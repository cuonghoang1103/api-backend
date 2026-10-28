/**
 * Operating Systems for Developers — Chương 12: Container nhìn từ nhân (soạn 28/10/2026 theo _HOP-DONG.md).
 * Chủ đề: "container chỉ là một tiến trình" — tự dựng một container bằng tay trong lab rồi so với Docker/runc/containerd.
 * Output CHẠY THẬT (ảnh `os-lab`; container đặc quyền VỨT ĐI nhãn oslab=1 cho mọi việc namespace/cgroup/mount/mạng):
 *   lab/code/ch12/c121-ns.sh      → lab/out/c121-ns       (--privileged: /proc/self/ns, lsns, unshare từng namespace, nsenter, ip netns)
 *   lab/code/ch12/c121-host.sh    → lab/out/c121-host     (từ máy chủ: một container nhìn từ trong và từ máy ảo Docker — NSpid, shim, ns)
 *   lab/code/ch12/c122-cg.sh      → lab/out/c122-cg       (--privileged --memory 1g: cgroup v2 bằng tay — memory/cpu/pids/io.max, fork bomb, freeze)
 *   lab/code/ch12/c122-host.sh    → lab/out/c122-host     (từ máy chủ: cờ docker run → file cgroup; docker update; docker pause = freezer)
 *   lab/code/ch12/c123-overlay.sh → lab/out/c123-overlay  (--privileged: overlay bằng tay — copy-up, whiteout, opaque, giá copy-up 200 MB)
 *   lab/code/ch12/c123-host.sh    → lab/out/c123-host     (từ máy chủ: lớp ảnh, docker diff, build cache CACHED/làm lại; cache tự dọn theo id)
 *   lab/code/ch12/c124-mini.sh    → lab/out/c124-mini     (--privileged + rootfs Alpine 3.24 xuất bằng docker export: mini-container.sh)
 *   lab/code/ch12/c125-net.sh     → lab/out/c125-net      (--privileged: netns + veth + bridge + MASQUERADE + DNAT; cắm mini container vào bridge)
 *   lab/code/ch12/c126-runc.sh    → lab/out/c126-runc     (--privileged: runc 1.5.2 arm64 tải từ GitHub, sha256 khớp — spec, run, state, strace, rootless)
 *   lab/code/ch12/c126-host.sh    → lab/out/c126-host     (từ máy chủ: dockerd → containerd → shim → tiến trình; config.json Docker viết)
 *   lab/code/ch12/c127-host.sh    → lab/out/c127-host     (từ máy chủ: pod = namespace chung; checklist Dockerfile đo thật)
 *   lab/code/ch12/c127-good.sh    → lab/out/c127-good     (từ máy chủ: ảnh good/ dựng theo checklist, chạy đủ cờ; ảnh + cache dọn theo id)
 * Máy đo: Docker Desktop 29.8 trên Apple Silicon (arm64, 10 lõi, nhân 7.0.12-linuxkit, cgroup v2, containerd snapshotter overlayfs).
 * Thứ tự bài: 4 slug đã seed từ khung (os-12-1-namespaces, os-12-2-cgroups, os-12-3-overlayfs, os-12-4-mini) GIỮ NGUYÊN;
 * bài mới os-12-5-mang, os-12-6-runc, os-12-7-pod-dockerfile, quiz os-12-8-quiz.
 * Ranh giới: PID 1/tini ở 1.5; OOM/137/memory.high ở Ch8; mount/bind mount ở 9.6, capabilities ở 9.7; seccomp ở 11.4;
 * cờ bảo mật container (--privileged, docker.sock, no-new-privileges) ở 13.4 — chương này chỉ trỏ sang, không dạy lại.
 * LUẬT escaping: < > → &lt; &gt;; & → &amp;; không backtick trần; ${ của bash → \${.
 */
import { run, src, card, kv, cmd } from './_ui.mjs';
import { lab } from './_lab.mjs';
import G121 from './giang/os-12-1.mjs';
import G122 from './giang/os-12-2.mjs';
import G123 from './giang/os-12-3.mjs';
import G124 from './giang/os-12-4.mjs';
import G125 from './giang/os-12-5.mjs';
import G126 from './giang/os-12-6.mjs';
import G127 from './giang/os-12-7.mjs';

const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);
const OS = (slug) => '/courses/operating-systems-for-developers/learn?lessonSlug=' + slug;
const OSG = (slug) => '/courses/operating-systems/learn?lessonSlug=' + slug;

export default {
  title: 'Chapter 12 — Containers from the kernel’s point of view|||Chương 12 — Container nhìn từ nhân',
  description: 'Container không phải máy ảo — nó là một tiến trình được nhân rào lại. Tự dựng một container bằng tay trong lab: unshare từng namespace (pid, uts, mount, net, ipc, user, cgroup), nsenter = docker exec; cgroup v2 memory.max/cpu.max/pids.max/io.max đo thật (OOM 137, throttling, fork bomb bị chặn ở 64); overlayfs lower/upper/work, copy-up và whiteout = lớp ảnh Docker, build cache; pivot_root vào rootfs Alpine; veth + bridge + NAT; rồi so với runc/containerd-shim/config.json OCI mà Docker thật sự viết, rootless, gVisor/Kata, pod Kubernetes và checklist Dockerfile nhìn từ hệ điều hành.',
  lessons: [
    /* ───────────────────────── 12.1 — Namespace ───────────────────────── */
    {
      title: '12.1 — A container is a process with a different view: the namespaces, one by one|||12.1 — Container là một tiến trình nhìn thế giới khác đi: từng namespace một',
      slug: 'os-12-1-namespaces',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một container nhìn từ hai phía: PID 1 bên trong là PID 71743 trong máy ảo Docker, con của containerd-shim; 8 namespace trong /proc/self/ns; unshare từng loại — uts (hostname), pid (Cannot fork khi quên --fork, ps lỗi khi quên --mount-proc, PID 1 lờ SIGTERM), mount, net (chỉ có lo), ipc, user (root bên trong = dev 1001 bên ngoài), cgroup; nsenter chính là docker exec; namespace sống bao lâu (ip netns).',
      content: `${G121}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>A container is a process with a different view</h2>
<p class="lead">Search the Linux source for a "container" object and you will not find one. The kernel has <strong>processes</strong>, and it has a handful of features that change what a process can <em>see</em> (namespaces) and how much it can <em>use</em> (cgroups, lesson 12.2). A container is just a process started with all of them switched on. This lesson answers one question with measurements: <strong>when Docker says "a container is running", what exactly exists in the kernel — and can you build the same thing yourself with one command per namespace?</strong> (OSG202 introduces containers next to virtual machines in <a href="${OSG('osg202-n1-1-cloud-container')}">lesson N1.1</a>; here we open them up.)</p>

<h3>One process, seen from inside and from outside</h3>
<p>Start an ordinary container and ask it for its processes, then ask the Docker VM (the Linux machine Docker Desktop runs; on a Linux server it would be the server itself) about the same process. To look from outside we use a throwaway container with <code>--pid=host</code>, which only <em>reads</em> <code>/proc</code>:</p>
${run('c121-host', 'docker exec os-c121-web ps -ef', 2)}
${run('c121-host', 'docker run --rm --label oslab=1 --name os-c121-vm --pid=host --privileged os-lab bash -c "grep')}
<p>Inside, <code>sleep</code> is <strong>PID 1</strong> — the first and only process in its world. Outside it is PID 71743, an ordinary entry in the VM's process table, and its parent is <code>containerd-shim-runc-v2</code> (lesson 12.6 explains that chain). The kernel keeps both numbers: <code>NSpid: 71743 1</code> means "71743 in the outer PID namespace, 1 in the inner one". Notice also <code>ps -ef</code> run by <code>docker exec</code> has <strong>PPID 0</strong>: its real parent lives outside the container's PID namespace, so from inside it has no parent at all.</p>
<p>What makes the views different is a set of <strong>namespace</strong> memberships. Compare the container's with PID 1 of the VM:</p>
${run('c121-host', 'docker run --rm --label oslab=1 --name os-c121-vm --pid=host --privileged os-lab bash -c "for n')}
<p>Six of the seven differ — the container has its own PID, network, mount, UTS, IPC and cgroup namespaces. One is the <strong>same</strong>: <code>user</code>. Docker does not use a user namespace by default, so UID 0 in this container is UID 0 of the VM's kernel, held back only by capabilities, seccomp and the other fences of <a href="${OS('os-13-4-container-escape')}">lesson 13.4</a>. Keep that in mind; we come back to it below and in lesson 12.6.</p>
${lab('nslayers', 'docker', 'en', 'One process, two views: the same sleep is PID 1 inside and PID 71743 outside. Switch the namespaces on one at a time — uts, mnt, pid, net, ipc, cgroup, time — and watch the inside view change; user stays the SAME as the host’s.', { tour: 'nslayers-views' })}

<h3>Eight namespaces, eight links in /proc</h3>
<p>Every process — containerised or not — belongs to exactly one namespace of each type. The kernel shows them as symbolic links whose target names the type and an inode number; two processes are in the same namespace exactly when the numbers match:</p>
${run('c121-ns', 'ls -l /proc/self/ns')}
${run('c121-ns', 'lsns -o NS')}
<table>
<tr><th>namespace</th><th>clone/unshare flag</th><th>what it gives the process its own copy of</th></tr>
<tr><td>pid</td><td><code>CLONE_NEWPID</code></td><td>process numbers — the first process becomes PID 1</td></tr>
<tr><td>mnt</td><td><code>CLONE_NEWNS</code></td><td>the mount table — what <code>/</code>, <code>/proc</code>, <code>/data</code> are</td></tr>
<tr><td>net</td><td><code>CLONE_NEWNET</code></td><td>interfaces, IP addresses, routes, ports, firewall rules</td></tr>
<tr><td>uts</td><td><code>CLONE_NEWUTS</code></td><td>hostname and domain name</td></tr>
<tr><td>ipc</td><td><code>CLONE_NEWIPC</code></td><td>System V message queues, semaphores, shared memory</td></tr>
<tr><td>user</td><td><code>CLONE_NEWUSER</code></td><td>UID/GID numbers and capabilities — root inside, nobody outside</td></tr>
<tr><td>cgroup</td><td><code>CLONE_NEWCGROUP</code></td><td>the view of the cgroup tree — your cgroup looks like <code>/</code></td></tr>
<tr><td>time</td><td><code>CLONE_NEWTIME</code></td><td>offsets for the monotonic and boot clocks (used for checkpoint/restore)</td></tr>
</table>
<p>The tool for creating them from a shell is <code>unshare</code> (util-linux): it calls the <code>unshare()</code> system call with the flags you ask for, then runs a command. We are inside a <code>--privileged</code> throwaway container, so everything we create lives inside it and disappears with it.</p>

<h3>UTS: a hostname of its own</h3>
${run('c121-ns', 'hostname')}
${run('c121-ns', 'unshare --uts', 2)}
<p>The child changed the hostname to <code>mini</code> and saw it; the shell outside still says <code>oslab</code>. Two different UTS namespaces, two different inode numbers. This is all <code>docker run --hostname web</code> does.</p>

<h3>PID: the process becomes PID 1 — and three traps</h3>
<p>The PID namespace is the one people get wrong first. Try it naively:</p>
${run('c121-ns', 'unshare --pid sh -c')}
<p>The shell still has PID 30, the first command ran, and the second fork failed. <code>unshare(CLONE_NEWPID)</code> does not move the caller; it decides where the caller's <em>next child</em> goes. That first child became PID 1 of the new namespace, exited — and a PID namespace whose PID 1 has died accepts no new processes, so the next <code>fork()</code> fails with <code>ENOMEM</code> ("Cannot fork"). The fix is <code>--fork</code>: unshare forks once and runs your command as that child, PID 1.</p>
${run('c121-ns', "unshare --pid --fork sh -c 'echo \"I am PID $$\"; ps -e")}
<p>PID 1 now — but <code>ps</code> crashes with "fatal library error, lookup self". <code>ps</code> does not ask the kernel for processes; it reads <code>/proc</code>, and the <code>/proc</code> we can see is still the one mounted for the <em>old</em> namespace, where our PID 1 is called something else. The new namespace needs its own <code>/proc</code> mount, which needs its own mount namespace — exactly what <code>--mount-proc</code> does:</p>
${run('c121-ns', 'unshare --pid --fork --mount-proc sh -c')}
<p>Two processes in the whole world. From outside, the same process has two numbers, and the PID namespaces differ:</p>
${run('c121-ns', 'unshare --pid --fork --mount-proc sleep 300 &', 3)}
<p>The third trap is the one from <a href="${OS('os-1-5-pid1')}">lesson 1.5</a>, now visible at its source: the kernel does not deliver a signal to a namespace's PID 1 unless PID 1 installed a handler for it. <code>sleep</code> has none, so SIGTERM is simply dropped — only SIGKILL gets through:</p>
${run('c121-ns', 'kill $S; sleep 0.5', 2)}
${lab('nslayers', 'unshare', 'en', 'unshare by hand, with its traps: --pid without --fork (“Cannot fork”), --fork without --mount-proc (“fatal library error, lookup self”), a new net namespace where curl exits 6, and nsenter walking back in.', { tour: 'nslayers-views' })}

<div class="pitfall co-tieu-de">
<p><strong>"unshare --pid works on my laptop, but in the script every second command fails."</strong> Without <code>--fork</code>, the first command you run becomes PID 1 and dies, and the namespace is closed for good: "Cannot fork", or <code>fork: Cannot allocate memory</code> in bash. Without <code>--mount-proc</code>, <code>ps</code>, <code>top</code> and anything that reads <code>/proc</code> either show the host's processes or crash. The working recipe is always the three together: <code>unshare --pid --fork --mount-proc</code>. Container runtimes do the same: fork into the new namespace first, then mount a fresh <code>/proc</code> inside it.</p>
</div>

<h3>Mount: a private file-system tree</h3>
${run('c121-ns', 'unshare --mount sh -c', 2)}
<p>The tmpfs mounted inside exists only in the new mount namespace; outside, <code>/mnt</code> is an empty directory. <code>unshare</code> also marks the new tree <em>private</em>, so mounts do not propagate back to the parent — the "propagation" settings of <a href="${OS('os-9-6-mount')}">lesson 9.6</a>. Every container starts with a private copy of the mount table and then replaces <code>/</code> entirely (lesson 12.4).</p>

<h3>Network: an empty stack</h3>
${run('c121-ns', 'ip -br link | grep -v NONE', 2)}
<p>Outside, this lab container has <code>lo</code> and <code>eth0</code>. Inside a new network namespace there is only <code>lo</code>, and it is down. After bringing it up, <code>ping 127.0.0.1</code> works — but nothing else: no interface, no route, no DNS, so <code>curl</code> exits 6 ("Could not resolve host"). A fresh network namespace is a computer with its network cable cut. Lesson 12.5 plugs a virtual cable in.</p>
<p>(<code>grep -v NONE</code> only hides the tunnel devices — <code>tunl0</code>, <code>gre0</code>… — that this kernel creates in every network namespace; they are always down.)</p>

<h3>IPC: separate message queues</h3>
${run('c121-ns', 'ipcmk -Q', 2)}
<p>A System V message queue created outside does not exist in the new IPC namespace. PostgreSQL used System V shared memory for years — this is why two Postgres containers on one machine never collide on segment keys.</p>

<h3>User: root that is not root</h3>
<p>Now the namespace that needs <strong>no privilege at all</strong>. As the unprivileged user <code>dev</code> (UID 1001):</p>
${run('c121-ns', "runuser -u dev -- unshare --user --map-root-user sh -c 'id", 2)}
<p>Inside, <code>dev</code> is <code>uid=0(root)</code> with a <em>full</em> set of capabilities (<code>CapEff 000001ffffffffff</code>). Yet it cannot create <code>/etc/hacked</code>. The mapping <code>0 1001 1</code> says "UID 0 here is UID 1001 out there", and capabilities in a user namespace only count for objects <em>owned by that namespace</em> — the host's <code>/etc</code> is not. <code>setgroups</code> reads <code>deny</code>: an unprivileged user may not drop supplementary groups, or it could escape a "deny group" permission. This is the basis of <strong>rootless</strong> containers (lesson 12.6). Root can map whole ranges, like Docker's <code>userns-remap</code> or Podman:</p>
${run('c121-ns', 'unshare --user --map-users')}
<p>Container UIDs 0…65535 are host UIDs 100000…165535. Our own shell (host UID 0) is not in that range, so inside it appears as <code>nobody</code> — exactly how files owned by the host's root look from inside a remapped container.</p>
${lab('nslayers', 'userns', 'en', 'A user namespace from both sides: dev becomes uid 0 with a full CapEff, the map 0 1001 1 says who that really is, and touch /etc is still refused; then remap 0 100000 65536 and host-owned files appear as nobody.', { tour: 'nslayers-views' })}

<h3>cgroup: your cgroup looks like the root</h3>
${run('c121-ns', 'mkdir /sys/fs/cgroup/demo', 3)}
<p>A process placed in cgroup <code>/demo</code> sees that path — until it enters a new cgroup namespace, where its own cgroup becomes <code>/</code>. That is why every container reads its limits from <code>/sys/fs/cgroup/memory.max</code> rather than a long path, and why runtimes such as the JVM and Node find them (<a href="${OS('os-11-7-proc-sys')}">lesson 11.7</a>).</p>

<h3>nsenter: walking into a running box — what docker exec does</h3>
<p>Build a small "box" with five namespaces at once, then step into it from outside with <code>nsenter</code>, which calls <code>setns()</code> on the target's <code>/proc/PID/ns/*</code> links before running a command:</p>
${run('c121-ns', 'unshare --uts --pid --mount --net --ipc --fork --mount-proc', 4)}
<p>The entered shell sees the box's hostname, its two processes and its lone <code>lo</code>, and gets PID 4 with PPID 0 (its parent, nsenter, is outside). With <code>--all</code> it joins every namespace the target has, which is what <code>docker exec</code> does through the runtime. The same works on a real Docker container from the VM:</p>
${run('c121-host', 'docker run --rm --label oslab=1 --name os-c121-vm --pid=host --privileged os-lab nsenter')}

<h3>How long does a namespace live?</h3>
<p>A namespace exists while something references it: a process inside, an open file descriptor to its <code>/proc/PID/ns</code> link, or a <strong>bind mount</strong> of that link. <code>ip netns add</code> uses the last one — it creates a network namespace with no process in it at all:</p>
${run('c121-ns', 'ip netns add demo', 2)}
<p>Zero processes, still alive, until the bind mount in <code>/run/netns</code> is removed. Kubernetes pods use the same idea with a tiny "pause" process that holds the namespaces while app containers come and go (lesson 12.7).</p>

<h3>🧪 Practice (25–30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> in a design review a teammate says: "a container is a lightweight VM with its own kernel, so root inside cannot hurt the server". You want to answer with measurements, not opinions.</p>
<ol>
<li>Start the lab with <code>--privileged</code> (throwaway). Run <code>unshare --uts --pid --mount --net --ipc --fork --mount-proc bash</code>, set a hostname and run <code>ps -ef</code>, <code>ip -br link</code>, <code>uname -r</code>.</li>
<li>In a second terminal (<code>docker exec</code> into the same lab container), find your box's PID with <code>pgrep</code>, read its <code>NSpid</code> line and compare <code>readlink /proc/PID/ns/*</code> with <code>/proc/self/ns/*</code>.</li>
<li>Join it with <code>nsenter -t PID --all</code> and show that you see the box's hostname and processes.</li>
<li>From your Mac or VPS run two different images and compare <code>uname -r</code>; then <code>docker run --rm alpine id</code> and check whether the user namespace differs from PID 1's (the <code>c121-host</code> loop above).</li>
</ol>
<p><strong>Done when:</strong> you can show one process with two PIDs, a namespace table where six links differ and <code>user</code> does not, and the same kernel version in every container — and explain in three sentences why "own kernel" and "root cannot hurt the server" are both wrong for a default Docker container.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['namespace', 'A kernel feature that gives a process its own copy of one global resource view (PIDs, mounts, network, hostname, IPC, users, cgroup tree, clocks).'],
  ['unshare(2) / unshare(1)', 'Move the caller (or, for PID, its next child) into new namespaces; the command-line tool runs a program there.'],
  ['setns(2) / nsenter(1)', 'Join an existing namespace through its /proc/PID/ns link — the mechanism behind docker exec.'],
  ['NSpid', 'Line in /proc/PID/status listing the process’s PID in each nested PID namespace, outermost first.'],
  ['--fork / --mount-proc', 'Make the command PID 1 of the new PID namespace and give it a matching /proc; forgetting either breaks it.'],
  ['uid_map', 'The table that maps UIDs inside a user namespace to UIDs outside (0 1001 1 = root inside is dev outside).'],
  ['ip netns', 'Named network namespaces kept alive by a bind mount in /run/netns, even with no process inside.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A container is an ordinary process: PID 1 inside, a normal PID (child of containerd-shim) outside — <code>NSpid</code> shows both.</li>
<li>Its isolation is a set of namespace memberships, visible as <code>/proc/PID/ns/*</code> links; same inode number = same namespace.</li>
<li><code>unshare</code> creates them one by one; the PID namespace needs <code>--fork</code> and <code>--mount-proc</code>, and its PID 1 ignores signals it has no handler for.</li>
<li>A user namespace makes "root" harmless outside its own objects; <strong>default Docker does not use one</strong>, so container root is the kernel's root.</li>
<li><code>nsenter</code> joins a running box — the same <code>setns()</code> that <code>docker exec</code> uses; a namespace lives as long as a process, fd or bind mount holds it.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/namespaces.7.html', '📄', 'man 7 namespaces', 'The eight namespace types, /proc/PID/ns, lifetime rules.', 'Open')}
${L('https://man7.org/linux/man-pages/man1/unshare.1.html', '📄', 'man 1 unshare', 'Every flag used in this lesson: --fork, --mount-proc, --map-root-user, --map-users.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Container là một tiến trình nhìn thế giới khác đi</h2>
<p class="lead">Tìm trong mã nguồn Linux một đối tượng tên "container", bạn sẽ không thấy. Nhân chỉ có <strong>tiến trình</strong>, cộng một nhúm tính năng đổi thứ một tiến trình <em>nhìn thấy</em> (namespace) và lượng tài nguyên nó được <em>dùng</em> (cgroup, bài 12.2). Container chỉ là một tiến trình được khởi động với tất cả các tính năng đó bật lên. Bài này trả lời một câu hỏi bằng số đo: <strong>khi Docker nói "một container đang chạy", trong nhân thật sự có gì — và bạn có tự dựng được đúng thứ đó, mỗi namespace một lệnh, hay không?</strong> (OSG202 giới thiệu container bên cạnh máy ảo ở <a href="${OSG('osg202-n1-1-cloud-container')}">bài N1.1</a>; ở đây ta mở nó ra xem bên trong.)</p>

<h3>Một tiến trình, nhìn từ trong và từ ngoài</h3>
<p>Chạy một container bình thường và hỏi nó có những tiến trình nào, rồi hỏi máy ảo Docker (máy Linux mà Docker Desktop chạy; trên máy chủ Linux thì chính là máy chủ) về đúng tiến trình đó. Để nhìn từ ngoài ta dùng một container vứt đi có <code>--pid=host</code>, chỉ <em>đọc</em> <code>/proc</code>:</p>
${run('c121-host', 'docker exec os-c121-web ps -ef', 2)}
${run('c121-host', 'docker run --rm --label oslab=1 --name os-c121-vm --pid=host --privileged os-lab bash -c "grep')}
<p>Bên trong, <code>sleep</code> là <strong>PID 1</strong> — tiến trình đầu tiên và duy nhất trong thế giới của nó. Bên ngoài nó là PID 71743, một dòng bình thường trong bảng tiến trình của máy ảo, và cha của nó là <code>containerd-shim-runc-v2</code> (bài 12.6 giải thích chuỗi này). Nhân giữ cả hai con số: <code>NSpid: 71743 1</code> nghĩa là "71743 trong PID namespace bên ngoài, 1 trong namespace bên trong". Để ý thêm: <code>ps -ef</code> chạy bằng <code>docker exec</code> có <strong>PPID 0</strong> — cha thật của nó nằm ngoài PID namespace của container, nên nhìn từ trong nó không có cha.</p>
<p>Thứ làm hai góc nhìn khác nhau là tập <strong>namespace</strong> mà tiến trình thuộc về. So của container với PID 1 của máy ảo:</p>
${run('c121-host', 'docker run --rm --label oslab=1 --name os-c121-vm --pid=host --privileged os-lab bash -c "for n')}
<p>Sáu trên bảy khác nhau — container có PID, mạng, mount, UTS, IPC và cgroup namespace riêng. Một cái <strong>giống</strong>: <code>user</code>. Mặc định Docker không dùng user namespace, nên UID 0 trong container này chính là UID 0 của nhân máy ảo, chỉ bị kìm bởi capabilities, seccomp và các hàng rào khác ở <a href="${OS('os-13-4-container-escape')}">bài 13.4</a>. Nhớ điều đó; ta quay lại ở dưới và ở bài 12.6.</p>
${lab('nslayers', 'docker', 'vi', 'Một tiến trình, hai góc nhìn: cùng tiến trình sleep là PID 1 bên trong và PID 71743 bên ngoài. Bật từng namespace — uts, mnt, pid, net, ipc, cgroup, time — và nhìn khung bên trong đổi; user vẫn GIỐNG của máy chủ.', { tour: 'nslayers-views' })}

<h3>Tám namespace, tám liên kết trong /proc</h3>
<p>Mọi tiến trình — trong container hay không — thuộc đúng một namespace của mỗi loại. Nhân hiện chúng thành các liên kết tượng trưng mà đích ghi loại và một số inode; hai tiến trình chung một namespace khi và chỉ khi hai con số trùng nhau:</p>
${run('c121-ns', 'ls -l /proc/self/ns')}
${run('c121-ns', 'lsns -o NS')}
<table>
<tr><th>namespace</th><th>cờ clone/unshare</th><th>tiến trình được một bản riêng của</th></tr>
<tr><td>pid</td><td><code>CLONE_NEWPID</code></td><td>số hiệu tiến trình — tiến trình đầu tiên thành PID 1</td></tr>
<tr><td>mnt</td><td><code>CLONE_NEWNS</code></td><td>bảng mount — <code>/</code>, <code>/proc</code>, <code>/data</code> là gì</td></tr>
<tr><td>net</td><td><code>CLONE_NEWNET</code></td><td>interface, địa chỉ IP, route, cổng, luật tường lửa</td></tr>
<tr><td>uts</td><td><code>CLONE_NEWUTS</code></td><td>tên máy (hostname) và tên miền</td></tr>
<tr><td>ipc</td><td><code>CLONE_NEWIPC</code></td><td>hàng đợi thông điệp, semaphore, bộ nhớ chia sẻ System V</td></tr>
<tr><td>user</td><td><code>CLONE_NEWUSER</code></td><td>số UID/GID và capabilities — root bên trong, vô danh bên ngoài</td></tr>
<tr><td>cgroup</td><td><code>CLONE_NEWCGROUP</code></td><td>góc nhìn cây cgroup — cgroup của bạn trông như <code>/</code></td></tr>
<tr><td>time</td><td><code>CLONE_NEWTIME</code></td><td>độ lệch của đồng hồ monotonic và boot (dùng cho checkpoint/restore)</td></tr>
</table>
<p>Công cụ tạo chúng từ shell là <code>unshare</code> (util-linux): nó gọi system call <code>unshare()</code> với các cờ bạn yêu cầu rồi chạy một lệnh. Ta đang ở trong một container vứt đi <code>--privileged</code>, nên mọi thứ tạo ra đều nằm trong nó và biến mất theo nó.</p>

<h3>UTS: một hostname của riêng mình</h3>
${run('c121-ns', 'hostname')}
${run('c121-ns', 'unshare --uts', 2)}
<p>Tiến trình con đổi hostname thành <code>mini</code> và thấy nó; shell bên ngoài vẫn nói <code>oslab</code>. Hai UTS namespace khác nhau, hai số inode khác nhau. <code>docker run --hostname web</code> chỉ làm có vậy.</p>

<h3>PID: tiến trình thành PID 1 — và ba cái bẫy</h3>
<p>PID namespace là thứ người ta làm sai đầu tiên. Thử một cách ngây thơ:</p>
${run('c121-ns', 'unshare --pid sh -c')}
<p>Shell vẫn mang PID 30, lệnh đầu chạy được, và lần fork thứ hai hỏng. <code>unshare(CLONE_NEWPID)</code> không chuyển chính tiến trình gọi; nó quyết định <em>đứa con kế tiếp</em> của tiến trình gọi sẽ vào đâu. Đứa con đầu tiên đó thành PID 1 của namespace mới, rồi thoát — và một PID namespace có PID 1 đã chết thì không nhận thêm tiến trình nào, nên <code>fork()</code> kế tiếp hỏng với <code>ENOMEM</code> ("Cannot fork"). Cách sửa là <code>--fork</code>: unshare tự fork một lần và chạy lệnh của bạn làm đứa con đó, tức PID 1.</p>
${run('c121-ns', "unshare --pid --fork sh -c 'echo \"I am PID $$\"; ps -e")}
<p>Giờ là PID 1 — nhưng <code>ps</code> sập với "fatal library error, lookup self". <code>ps</code> không hỏi nhân danh sách tiến trình; nó đọc <code>/proc</code>, mà <code>/proc</code> ta thấy vẫn là cái được mount cho namespace <em>cũ</em>, nơi PID 1 của ta mang số khác. Namespace mới cần một <code>/proc</code> riêng, tức cần một mount namespace riêng — đúng việc <code>--mount-proc</code> làm:</p>
${run('c121-ns', 'unshare --pid --fork --mount-proc sh -c')}
<p>Cả thế giới chỉ có hai tiến trình. Nhìn từ ngoài, cùng tiến trình đó có hai con số, và hai PID namespace khác nhau:</p>
${run('c121-ns', 'unshare --pid --fork --mount-proc sleep 300 &', 3)}
<p>Cái bẫy thứ ba là cái ở <a href="${OS('os-1-5-pid1')}">bài 1.5</a>, giờ thấy tận gốc: nhân không giao tín hiệu cho PID 1 của một namespace trừ khi PID 1 đã cài handler cho tín hiệu đó. <code>sleep</code> không có handler nào, nên SIGTERM bị bỏ qua luôn — chỉ SIGKILL lọt qua:</p>
${run('c121-ns', 'kill $S; sleep 0.5', 2)}
${lab('nslayers', 'unshare', 'vi', 'unshare bằng tay, cùng các cái bẫy: --pid không --fork (“Cannot fork”), --fork không --mount-proc (“fatal library error, lookup self”), net namespace mới nơi curl thoát mã 6, và nsenter bước ngược vào trong.', { tour: 'nslayers-views' })}

<div class="pitfall co-tieu-de">
<p><strong>"unshare --pid chạy được trên máy tôi, nhưng trong script cứ lệnh thứ hai là hỏng."</strong> Thiếu <code>--fork</code>, lệnh đầu tiên bạn chạy thành PID 1 rồi chết, và namespace bị đóng vĩnh viễn: "Cannot fork", hay <code>fork: Cannot allocate memory</code> trong bash. Thiếu <code>--mount-proc</code>, <code>ps</code>, <code>top</code> và mọi thứ đọc <code>/proc</code> hoặc hiện tiến trình của máy chủ, hoặc sập. Công thức chạy được luôn là cả ba cùng nhau: <code>unshare --pid --fork --mount-proc</code>. Các container runtime cũng làm vậy: fork vào namespace mới trước, rồi mount một <code>/proc</code> mới bên trong.</p>
</div>

<h3>Mount: một cây thư mục riêng</h3>
${run('c121-ns', 'unshare --mount sh -c', 2)}
<p>Cái tmpfs mount bên trong chỉ tồn tại trong mount namespace mới; bên ngoài, <code>/mnt</code> là thư mục rỗng. <code>unshare</code> còn đánh dấu cây mới là <em>private</em>, nên mount không lan ngược về cha — chính là thiết lập "propagation" ở <a href="${OS('os-9-6-mount')}">bài 9.6</a>. Container nào cũng bắt đầu bằng một bản sao riêng của bảng mount rồi thay hẳn <code>/</code> (bài 12.4).</p>

<h3>Mạng: một chồng giao thức trống trơn</h3>
${run('c121-ns', 'ip -br link | grep -v NONE', 2)}
<p>Bên ngoài, container lab này có <code>lo</code> và <code>eth0</code>. Trong một network namespace mới chỉ có <code>lo</code>, và nó đang tắt. Bật lên rồi, <code>ping 127.0.0.1</code> chạy — nhưng ngoài ra không gì cả: không interface, không route, không DNS, nên <code>curl</code> thoát mã 6 ("Could not resolve host"). Một network namespace mới tinh là một cái máy bị rút dây mạng. Bài 12.5 sẽ cắm một sợi dây ảo vào.</p>
<p>(<code>grep -v NONE</code> chỉ giấu các thiết bị đường hầm — <code>tunl0</code>, <code>gre0</code>… — mà nhân này tạo sẵn trong mọi network namespace; chúng luôn tắt.)</p>

<h3>IPC: hàng đợi thông điệp riêng</h3>
${run('c121-ns', 'ipcmk -Q', 2)}
<p>Một hàng đợi thông điệp System V tạo bên ngoài không tồn tại trong IPC namespace mới. PostgreSQL từng dùng bộ nhớ chia sẻ System V nhiều năm — đây là lý do hai container Postgres trên cùng một máy không bao giờ giẫm khoá phân đoạn của nhau.</p>

<h3>User: root mà không phải root</h3>
<p>Giờ tới namespace <strong>không cần chút đặc quyền nào</strong>. Với người dùng thường <code>dev</code> (UID 1001):</p>
${run('c121-ns', "runuser -u dev -- unshare --user --map-root-user sh -c 'id", 2)}
<p>Bên trong, <code>dev</code> là <code>uid=0(root)</code> với tập capabilities <em>đầy đủ</em> (<code>CapEff 000001ffffffffff</code>). Thế mà không tạo nổi <code>/etc/hacked</code>. Ánh xạ <code>0 1001 1</code> nói "UID 0 ở đây là UID 1001 ở ngoài kia", và capabilities trong một user namespace chỉ có giá trị với những đối tượng <em>thuộc về namespace đó</em> — <code>/etc</code> của máy chủ thì không. <code>setgroups</code> đọc ra <code>deny</code>: người dùng thường không được bỏ nhóm phụ, nếu không sẽ lách được quyền kiểu "cấm nhóm này". Đây là nền móng của container <strong>rootless</strong> (bài 12.6). Root thì ánh xạ được cả dải, như <code>userns-remap</code> của Docker hay Podman:</p>
${run('c121-ns', 'unshare --user --map-users')}
<p>UID 0…65535 trong container là UID 100000…165535 của máy chủ. Shell của chính ta (UID 0 ở máy chủ) không nằm trong dải đó, nên bên trong nó hiện thành <code>nobody</code> — đúng như file của root máy chủ trông ra sao khi nhìn từ trong một container đã ánh xạ lại.</p>
${lab('nslayers', 'userns', 'vi', 'User namespace nhìn từ hai phía: dev thành uid 0 với CapEff đầy đủ, ánh xạ 0 1001 1 cho biết thật ra đó là ai, và touch /etc vẫn bị từ chối; rồi ánh xạ lại 0 100000 65536 và file của máy chủ hiện thành nobody.', { tour: 'nslayers-views' })}

<h3>cgroup: cgroup của bạn trông như gốc</h3>
${run('c121-ns', 'mkdir /sys/fs/cgroup/demo', 3)}
<p>Một tiến trình đặt vào cgroup <code>/demo</code> thấy đúng đường dẫn đó — cho tới khi nó vào một cgroup namespace mới, nơi cgroup của nó thành <code>/</code>. Vì thế container nào cũng đọc giới hạn của mình ở <code>/sys/fs/cgroup/memory.max</code> chứ không phải một đường dẫn dài, và các runtime như JVM hay Node tìm thấy chúng (<a href="${OS('os-11-7-proc-sys')}">bài 11.7</a>).</p>

<h3>nsenter: bước vào một cái hộp đang chạy — việc docker exec làm</h3>
<p>Dựng một "cái hộp" nhỏ với năm namespace một lúc, rồi bước vào nó từ bên ngoài bằng <code>nsenter</code>, công cụ gọi <code>setns()</code> trên các liên kết <code>/proc/PID/ns/*</code> của đích trước khi chạy lệnh:</p>
${run('c121-ns', 'unshare --uts --pid --mount --net --ipc --fork --mount-proc', 4)}
<p>Shell vừa vào thấy hostname của hộp, hai tiến trình của nó và một <code>lo</code> đơn độc, và nhận PID 4 với PPID 0 (cha của nó, nsenter, ở ngoài). Với <code>--all</code> nó vào mọi namespace mà đích có, đúng việc <code>docker exec</code> làm qua runtime. Làm y vậy với một container Docker thật, từ máy ảo:</p>
${run('c121-host', 'docker run --rm --label oslab=1 --name os-c121-vm --pid=host --privileged os-lab nsenter')}

<h3>Một namespace sống bao lâu?</h3>
<p>Namespace còn tồn tại chừng nào còn thứ tham chiếu tới nó: một tiến trình bên trong, một file descriptor mở tới liên kết <code>/proc/PID/ns</code> của nó, hoặc một <strong>bind mount</strong> của liên kết đó. <code>ip netns add</code> dùng cách cuối — nó tạo một network namespace không có tiến trình nào bên trong:</p>
${run('c121-ns', 'ip netns add demo', 2)}
<p>Không tiến trình nào, vẫn sống, cho tới khi bind mount trong <code>/run/netns</code> bị gỡ. Pod Kubernetes dùng cùng ý tưởng với một tiến trình "pause" tí hon giữ các namespace trong lúc container ứng dụng đến rồi đi (bài 12.7).</p>

<h3>🧪 Thực hành (25–30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> trong buổi review thiết kế, một bạn cùng nhóm nói: "container là máy ảo nhẹ có nhân riêng, nên root bên trong không làm hại được máy chủ". Bạn muốn trả lời bằng số đo, không bằng ý kiến.</p>
<ol>
<li>Mở lab với <code>--privileged</code> (vứt đi). Chạy <code>unshare --uts --pid --mount --net --ipc --fork --mount-proc bash</code>, đặt một hostname rồi chạy <code>ps -ef</code>, <code>ip -br link</code>, <code>uname -r</code>.</li>
<li>Ở terminal thứ hai (<code>docker exec</code> vào cùng container lab), tìm PID cái hộp bằng <code>pgrep</code>, đọc dòng <code>NSpid</code> và so <code>readlink /proc/PID/ns/*</code> với <code>/proc/self/ns/*</code>.</li>
<li>Vào hộp bằng <code>nsenter -t PID --all</code> và cho thấy bạn thấy hostname và tiến trình của hộp.</li>
<li>Từ máy Mac hoặc VPS chạy hai ảnh khác nhau và so <code>uname -r</code>; rồi <code>docker run --rm alpine id</code> và kiểm user namespace có khác của PID 1 không (vòng lặp <code>c121-host</code> ở trên).</li>
</ol>
<p><strong>Đạt khi:</strong> bạn cho thấy được một tiến trình có hai PID, một bảng namespace với sáu liên kết khác nhau còn <code>user</code> thì không, và cùng một phiên bản nhân trong mọi container — và giải thích trong ba câu vì sao "nhân riêng" và "root không hại được máy chủ" đều sai với một container Docker mặc định.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['namespace (không gian tên)', 'Tính năng của nhân cho một tiến trình bản riêng của một góc nhìn toàn cục (PID, mount, mạng, hostname, IPC, người dùng, cây cgroup, đồng hồ).'],
  ['unshare(2) / unshare(1)', 'Đưa tiến trình gọi (với PID là đứa con kế tiếp) vào namespace mới; công cụ dòng lệnh chạy một chương trình trong đó.'],
  ['setns(2) / nsenter(1)', 'Gia nhập một namespace có sẵn qua liên kết /proc/PID/ns — cơ chế đứng sau docker exec.'],
  ['NSpid', 'Dòng trong /proc/PID/status liệt kê PID của tiến trình ở từng PID namespace lồng nhau, ngoài cùng trước.'],
  ['--fork / --mount-proc', 'Cho lệnh thành PID 1 của PID namespace mới và một /proc khớp với nó; quên cái nào cũng hỏng.'],
  ['uid_map (bảng ánh xạ UID)', 'Bảng ánh xạ UID bên trong user namespace sang UID bên ngoài (0 1001 1 = root bên trong là dev bên ngoài).'],
  ['ip netns', 'Network namespace có tên, được giữ sống bằng một bind mount trong /run/netns, kể cả khi không có tiến trình nào.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Container là một tiến trình bình thường: PID 1 bên trong, một PID thường (con của containerd-shim) bên ngoài — <code>NSpid</code> cho thấy cả hai.</li>
<li>Sự cách ly của nó là tập namespace mà nó thuộc về, nhìn thấy qua các liên kết <code>/proc/PID/ns/*</code>; cùng số inode = cùng namespace.</li>
<li><code>unshare</code> tạo từng cái một; PID namespace cần <code>--fork</code> và <code>--mount-proc</code>, và PID 1 của nó lờ các tín hiệu không có handler.</li>
<li>User namespace làm "root" vô hại ngoài phạm vi đồ của chính nó; <strong>Docker mặc định không dùng</strong>, nên root trong container là root của nhân.</li>
<li><code>nsenter</code> vào một cái hộp đang chạy — cùng <code>setns()</code> mà <code>docker exec</code> dùng; namespace sống chừng nào còn tiến trình, fd hay bind mount giữ nó.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/namespaces.7.html', '📄', 'man 7 namespaces', 'Tám loại namespace, /proc/PID/ns, luật về vòng đời.', 'Mở')}
${L('https://man7.org/linux/man-pages/man1/unshare.1.html', '📄', 'man 1 unshare', 'Mọi cờ dùng trong bài: --fork, --mount-proc, --map-root-user, --map-users.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 12.2 — cgroup v2 ───────────────────────── */
    {
      title: '12.2 — cgroups v2 by hand: memory.max, cpu.max, pids.max and io.max, each one hit on purpose|||12.2 — cgroup v2 bằng tay: memory.max, cpu.max, pids.max và io.max, chạm từng trần một',
      slug: 'os-12-2-cgroups',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Giới hạn của container là những file: dựng một cgroup con bằng mkdir, luật "không tiến trình ở nút trong" (EBUSY), bật controller qua subtree_control; memory.max 64M ⇒ python 200 MiB bị giết 137 (memory.events oom_kill 1); cpu.max 50000 100000 ⇒ hai luồng mỗi luồng ~25%, 42/42 chu kỳ bị hãm; pids.max ⇒ fork thứ 20 EAGAIN, fork bomb dừng ở 64 rồi cgroup.kill dọn sạch; io.max 10 MB/s ⇒ 40 MiB mất 4 s; cgroup.freeze = docker pause; cờ docker run nào ghi file nào, docker update đổi lúc đang chạy.',
      content: `${G122}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>cgroups v2 by hand: the limits are files</h2>
<p class="lead">Namespaces decide what a process can <em>see</em>. They do not stop it from eating all the RAM, every CPU or every PID on the machine. That is the job of <strong>control groups</strong>. Chapter 8 showed what happens <em>at</em> a memory limit and <a href="${OS('os-3-4-da-loi')}">lesson 3.4</a> what a CPU quota does to latency; this lesson is about the mechanism under both. The question: <strong>when you write <code>docker run --memory 256m --cpus 1.5 --pids-limit 100</code>, which files does that become, and what exactly happens when a process reaches each limit?</strong> We build a cgroup with <code>mkdir</code> and <code>echo</code> and hit every limit on purpose.</p>

<h3>The cgroup tree is a file system</h3>
<p>cgroup v2 is one hierarchy mounted at <code>/sys/fs/cgroup</code>. Each directory is a group; each process belongs to exactly one directory; and the files in a directory are the group's settings and counters. Inside our privileged lab container (it has its own cgroup namespace, so its cgroup looks like <code>/</code>, lesson 12.1):</p>
${run('c122-cg', 'cat /proc/self/cgroup', 2)}
<p>Seven <strong>controllers</strong> are available here — <code>cpu</code>, <code>memory</code>, <code>pids</code>, <code>io</code>, <code>cpuset</code>, <code>hugetlb</code>, <code>rdma</code> — and four processes sit in this group. Creating a child group is <code>mkdir</code>. Giving it controllers is where everyone trips:</p>
${run('c122-cg', 'mkdir /sys/fs/cgroup/box')}

<div class="pitfall co-tieu-de">
<p><strong>"echo +memory &gt; cgroup.subtree_control: Device or resource busy".</strong> cgroup v2 has a <em>no internal processes</em> rule: a group that hands controllers down to its children may not itself contain processes (the root of the whole machine is the only exception). Our group still holds the lab's own shell, so the kernel says <code>EBUSY</code>. The fix is the one systemd and every container runtime use: move the existing processes into a leaf (here <code>init</code>), then enable the controllers. If you ever write your own supervisor that creates cgroups, this is the first error you will meet.</p>
</div>
${run('c122-cg', 'mkdir /sys/fs/cgroup/init', 2)}
${run('c122-cg', 'cd /sys/fs/cgroup/box', 2)}
<p>The new group came with 49 files. The ones that matter for a container are the <code>*.max</code> files (limits), the <code>*.current</code> files (usage now) and <code>*.events</code> / <code>*.stat</code> (what happened). All limits start at "no limit" — and that matters: a container started without flags has exactly these values (lesson 12.7 measures it). A process joins a group by writing its PID into <code>cgroup.procs</code>; our pattern below is <code>sh -c 'echo $$ &gt; …/box/cgroup.procs; exec program'</code> — the shell moves itself in, then becomes the program.</p>

<h3>memory.max: the kernel kills inside the box</h3>
${run('c122-cg', 'echo 64M > memory.max', 2)}
${run('c122-cg', "grep -E '^(oom|oom_kill|max) ' memory.events", 2)}
<p>A Python process tried to fill 200 MiB in a 64 MiB group and was killed with SIGKILL — exit 137. <code>memory.events</code> keeps the score: the group hit its maximum 53 times (each time the kernel reclaimed what it could), then <code>oom 1</code> and <code>oom_kill 1</code>. The kernel log names the victim and its RSS. Note what was <em>not</em> killed: the lab shell, in another group, never noticed. That is the whole point of a memory cgroup — the OOM killer runs <em>inside</em> the box. How it picks a victim, <code>memory.high</code>, swap and the exit-137 incident of this project are Chapter 8 (<a href="${OS('os-8-4-exit137')}">lesson 8.4</a>); we do not repeat them here.</p>
${lab('cgroup', 'oom', 'en', 'The same experiment as a timeline: memory.current climbs into memory.max, reclaim finds nothing more, oom_kill fires — exit 137.', { tour: 'cgroup-start' })}

<h3>cpu.max: a budget per 100 ms</h3>
<p><code>cpu.max</code> holds two numbers: <em>quota</em> and <em>period</em>, in microseconds. <code>50000 100000</code> means "at most 50 ms of CPU time in every 100 ms window, summed over all threads of the group" — half a CPU. Two busy threads share that budget:</p>
${run('c122-cg', 'echo "50000 100000" > cpu.max', 2)}
${run('c122-cg', "sh -c 'echo $$ > /sys/fs/cgroup/box/cgroup.procs; exec stress-ng --cpu 2", 2)}
<p>Each of the two workers gets about 25 % of a CPU — together 50 %, never more, on a 10-core machine with nothing else running. <code>cpu.stat</code> explains how: in 42 periods (≈ 4.2 s) the group used 2.13 s of CPU, and it was <strong>throttled in all 42</strong> — each period it burned its 50 ms in the first ~25 ms (two threads in parallel), then both threads were taken off the CPU until the next period began. <code>throttled_usec</code> (6.2 s) adds up those waits across the CPUs. That stop-and-go is what turns a CPU limit into latency spikes in a web server (<a href="${OS('os-3-4-da-loi')}">lesson 3.4</a>), and why <code>docker run --cpus 1.5</code> is written as <code>150000 100000</code> (below).</p>
${lab('cgroup', 'cpuquota', 'en', 'cpu.max on a timeline: the group spends its quota early in each 100 ms period and then waits — the throttled slices are the latency your requests feel.', { tour: 'cgroup-start' })}
${lab('cgroup', 'cputhreads', 'en', 'More threads do not get more CPU under a quota — they burn the same budget faster and wait longer each period.')}

<h3>pids.max: the fork bomb that couldn't</h3>
${run('c122-cg', 'echo max > cpu.max; echo 20 > pids.max', 3)}
<p>With <code>pids.max = 20</code>, Python itself plus 19 children fill the group; fork number 20 fails with <code>EAGAIN</code> ("Resource temporarily unavailable"), and <code>pids.events</code> counts the refusal. The count includes threads — a JVM with 60 threads uses 60 entries. Now the real thing, a bash fork bomb (a function that calls itself twice in the background), in a group capped at 64:</p>
${run('c122-cg', 'echo 64 > pids.max', 4)}
<p>The bomb filled the group to exactly 64 tasks and was refused 150 more times — and the machine did not care: load average 0.24. Without a <code>pids.max</code>, the same five characters fill the PID table of the whole server, after which nobody, including your <code>ssh</code> session, can start a process. <code>cgroup.kill</code> is the clean-up: one write sends SIGKILL to every process in the group at once (no race with processes forking while you kill them), and <code>populated 0</code> confirms the group is empty.</p>
${lab('sysmon', 'forkbomb', 'en', 'A fork bomb on a monitor: tasks explode until the limit. Watch which numbers move — Tasks, pids.current, load — and which do not.', { tour: 'sysmon-start' })}

<h3>io.max: bandwidth on one device</h3>
${run('c122-cg', 'echo "254:0 wbps=10485760" > io.max', 3)}
<p><code>io.max</code> limits bytes or operations per second <strong>on one block device</strong>, named by major:minor — <code>254:0</code> is <code>vda</code>, the disk of this VM (from <code>/proc/partitions</code>). 40 MiB at 10 MiB/s took 4.0 s; the same write unlimited took 12 ms. Two details: the limit applies only to I/O that actually reaches that device (a bind mount from macOS is not on <code>vda</code>, so writing there is not slowed at all), and buffered writes are throttled when the page cache writes them back, not at <code>write()</code> — that is why the test uses <code>oflag=direct</code> (lesson 9.2).</p>

<h3>freeze: what docker pause does</h3>
${run('c122-cg', 'sleep 300 & S=$!', 2)}
<p>Writing 1 to <code>cgroup.freeze</code> stops every process of the group in the kernel's signal path (<code>wchan get_signal</code>) until you write 0. Nothing is killed and memory stays as it is. <code>docker pause</code> is exactly this — read from the VM:</p>
${run('c122-host', 'ID=$(docker inspect', 3)}

<h3>What docker run writes</h3>
${run('c122-host', 'docker run -d --name os-c122-app', 3)}
<table>
<tr><th>docker run flag</th><th>cgroup file</th><th>measured value</th></tr>
<tr><td><code>--memory 256m</code></td><td><code>memory.max</code></td><td>268435456 (256 × 1024 × 1024)</td></tr>
<tr><td><code>--cpus 1.5</code></td><td><code>cpu.max</code></td><td><code>150000 100000</code> (150 ms per 100 ms)</td></tr>
<tr><td><code>--pids-limit 100</code></td><td><code>pids.max</code></td><td>100</td></tr>
<tr><td><code>--device-write-bps /dev/vda:10mb</code></td><td><code>io.max</code></td><td>like our <code>254:0 wbps=…</code></td></tr>
<tr><td><code>docker pause</code></td><td><code>cgroup.freeze</code></td><td>1</td></tr>
</table>
<p>And <code>docker update</code> rewrites the files of a <em>running</em> container — <code>--cpus 0.5</code> became <code>50000 100000</code> without a restart. Kubernetes <code>resources.limits</code> end up in the very same files (memory limits in <a href="${OS('os-8-5-gioi-han')}">lesson 8.5</a>).</p>

<h3>🧪 Practice (25–30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a background worker on the team's VPS had a bug that started a child process for every job and never reaped them. Within minutes <code>ssh</code> answered "fork: retry: Resource temporarily unavailable" and the whole server had to be rebooted from the provider's console. You want to prove a cgroup would have contained it.</p>
<ol>
<li>In a <code>--privileged</code> lab container, set up delegation as above (<code>init</code> group, <code>subtree_control</code>) and create <code>worker</code> with <code>pids.max = 50</code>.</li>
<li>Run the fork bomb (or <code>forks.py</code> with a bigger loop) inside <code>worker</code>; in a second shell, show that you can still start processes and read <code>pids.current</code> and <code>pids.events</code>.</li>
<li>Clean up with one write to <code>cgroup.kill</code>; prove the group is empty.</li>
<li>Repeat with <code>docker run --pids-limit 50</code> and read <code>/sys/fs/cgroup/pids.max</code> inside the container.</li>
</ol>
<p><strong>Done when:</strong> you can show <code>pids.current</code> stuck at the limit, a non-zero <code>max</code> in <code>pids.events</code>, a healthy shell outside the group, and the one-line Docker flag your team should add to every service.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['cgroup v2', 'One hierarchy of groups under /sys/fs/cgroup; each process is in exactly one group; files are settings and counters.'],
  ['controller', 'The part of the kernel that enforces one resource (memory, cpu, pids, io…); enabled for children via cgroup.subtree_control.'],
  ['no internal processes rule', 'A group that delegates controllers may not contain processes itself — EBUSY until you move them to a leaf.'],
  ['memory.max / memory.events', 'Hard memory limit; reaching it triggers reclaim, then the OOM killer inside the group (oom_kill counter).'],
  ['cpu.max (quota period)', 'At most quota µs of CPU per period µs for the whole group; nr_throttled counts periods where the group had to wait.'],
  ['pids.max', 'Maximum number of tasks (processes and threads) in the group; fork/clone beyond it fails with EAGAIN.'],
  ['cgroup.kill / cgroup.freeze', 'Kill every process in the group at once / stop them all until unfrozen (docker pause).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Container limits are ordinary files in <code>/sys/fs/cgroup</code>: a group is a directory, joining is writing a PID to <code>cgroup.procs</code>.</li>
<li>Controllers must be delegated via <code>subtree_control</code>, and only from a group with no processes of its own (EBUSY otherwise).</li>
<li><code>memory.max</code> → OOM kill inside the box (137); <code>cpu.max</code> → throttling every period; <code>pids.max</code> → fork fails with EAGAIN; <code>io.max</code> → bandwidth per device.</li>
<li><code>cgroup.kill</code> empties a group atomically; <code>cgroup.freeze</code> is <code>docker pause</code>.</li>
<li><code>--memory</code>, <code>--cpus</code>, <code>--pids-limit</code> write exactly those files, and <code>docker update</code> changes them live.</li>
</ul>
${L('https://docs.kernel.org/admin-guide/cgroup-v2.html', '📄', 'Control Group v2 (kernel.org)', 'The reference: every file, the no-internal-process rule, delegation.', 'Open')}
${L('https://man7.org/linux/man-pages/man7/cgroups.7.html', '📄', 'man 7 cgroups', 'cgroups v1 and v2 from the system-call side, /proc/PID/cgroup.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>cgroup v2 bằng tay: giới hạn chỉ là những file</h2>
<p class="lead">Namespace quyết định một tiến trình <em>thấy</em> gì. Nó không cản tiến trình đó ăn hết RAM, mọi CPU hay mọi PID của máy. Đó là việc của <strong>control group</strong> (nhóm điều khiển). Chương 8 cho thấy chuyện gì xảy ra <em>tại</em> trần bộ nhớ, và <a href="${OS('os-3-4-da-loi')}">bài 3.4</a> cho thấy quota CPU làm gì với độ trễ; bài này nói về cơ chế nằm dưới cả hai. Câu hỏi: <strong>khi bạn gõ <code>docker run --memory 256m --cpus 1.5 --pids-limit 100</code>, nó thành những file nào, và chính xác chuyện gì xảy ra khi một tiến trình chạm từng trần?</strong> Ta dựng một cgroup bằng <code>mkdir</code> và <code>echo</code>, rồi cố ý chạm từng giới hạn.</p>

<h3>Cây cgroup là một hệ thống file</h3>
<p>cgroup v2 là một cây duy nhất mount ở <code>/sys/fs/cgroup</code>. Mỗi thư mục là một nhóm; mỗi tiến trình thuộc đúng một thư mục; và các file trong thư mục là thiết lập và bộ đếm của nhóm. Trong container lab đặc quyền (nó có cgroup namespace riêng, nên cgroup của nó trông như <code>/</code>, bài 12.1):</p>
${run('c122-cg', 'cat /proc/self/cgroup', 2)}
<p>Ở đây có bảy <strong>controller</strong> — <code>cpu</code>, <code>memory</code>, <code>pids</code>, <code>io</code>, <code>cpuset</code>, <code>hugetlb</code>, <code>rdma</code> — và bốn tiến trình nằm trong nhóm này. Tạo nhóm con là <code>mkdir</code>. Trao controller cho nó là chỗ ai cũng vấp:</p>
${run('c122-cg', 'mkdir /sys/fs/cgroup/box')}

<div class="pitfall co-tieu-de">
<p><strong>"echo +memory &gt; cgroup.subtree_control: Device or resource busy".</strong> cgroup v2 có luật <em>không có tiến trình ở nút trong</em>: một nhóm trao controller xuống cho con thì bản thân nó không được chứa tiến trình (gốc của cả máy là ngoại lệ duy nhất). Nhóm của ta vẫn đang chứa shell của lab, nên nhân trả <code>EBUSY</code>. Cách sửa là cách systemd và mọi container runtime dùng: chuyển các tiến trình đang có vào một nhóm lá (ở đây là <code>init</code>), rồi mới bật controller. Nếu có ngày bạn tự viết một trình giám sát tạo cgroup, đây là lỗi đầu tiên bạn gặp.</p>
</div>
${run('c122-cg', 'mkdir /sys/fs/cgroup/init', 2)}
${run('c122-cg', 'cd /sys/fs/cgroup/box', 2)}
<p>Nhóm mới đi kèm 49 file. Những file quan trọng với container là các file <code>*.max</code> (giới hạn), <code>*.current</code> (đang dùng bao nhiêu) và <code>*.events</code> / <code>*.stat</code> (đã có chuyện gì). Mọi giới hạn bắt đầu ở "không giới hạn" — và điều đó quan trọng: một container chạy không có cờ nào mang đúng những giá trị này (bài 12.7 đo). Một tiến trình vào nhóm bằng cách ghi PID của nó vào <code>cgroup.procs</code>; mẫu ta dùng bên dưới là <code>sh -c 'echo $$ &gt; …/box/cgroup.procs; exec chương_trình'</code> — shell tự chuyển mình vào nhóm, rồi hoá thành chương trình.</p>

<h3>memory.max: nhân giết ngay trong hộp</h3>
${run('c122-cg', 'echo 64M > memory.max', 2)}
${run('c122-cg', "grep -E '^(oom|oom_kill|max) ' memory.events", 2)}
<p>Một tiến trình Python cố lấp 200 MiB trong một nhóm 64 MiB và bị giết bằng SIGKILL — mã thoát 137. <code>memory.events</code> ghi lại: nhóm chạm trần 53 lần (mỗi lần nhân thu hồi được gì thì thu), rồi <code>oom 1</code> và <code>oom_kill 1</code>. Log của nhân ghi tên nạn nhân và RSS của nó. Để ý cái <em>không</em> bị giết: shell của lab, ở nhóm khác, không hề hay biết. Đó là toàn bộ ý nghĩa của memory cgroup — OOM killer chạy <em>bên trong</em> cái hộp. Nó chọn nạn nhân ra sao, <code>memory.high</code>, swap và sự cố exit 137 của chính dự án này là Chương 8 (<a href="${OS('os-8-4-exit137')}">bài 8.4</a>); ở đây không lặp lại.</p>
${lab('cgroup', 'oom', 'vi', 'Cùng thí nghiệm đó trên dòng thời gian: memory.current leo tới memory.max, thu hồi không còn gì, oom_kill nổ — mã 137.', { tour: 'cgroup-start' })}

<h3>cpu.max: ngân sách cho mỗi 100 ms</h3>
<p><code>cpu.max</code> chứa hai con số: <em>quota</em> và <em>period</em>, tính bằng micro-giây. <code>50000 100000</code> nghĩa là "tối đa 50 ms thời gian CPU trong mỗi cửa sổ 100 ms, cộng dồn mọi luồng của nhóm" — nửa CPU. Hai luồng bận chia nhau ngân sách đó:</p>
${run('c122-cg', 'echo "50000 100000" > cpu.max', 2)}
${run('c122-cg', "sh -c 'echo $$ > /sys/fs/cgroup/box/cgroup.procs; exec stress-ng --cpu 2", 2)}
<p>Mỗi worker được khoảng 25 % một CPU — cộng lại 50 %, không hơn, trên một máy 10 lõi chẳng có gì khác đang chạy. <code>cpu.stat</code> giải thích vì sao: trong 42 chu kỳ (≈ 4,2 s) nhóm dùng 2,13 s CPU, và <strong>bị hãm cả 42 chu kỳ</strong> — mỗi chu kỳ nó đốt hết 50 ms trong ~25 ms đầu (hai luồng chạy song song), rồi cả hai luồng bị đưa khỏi CPU tới khi chu kỳ sau bắt đầu. <code>throttled_usec</code> (6,2 s) cộng dồn những lần chờ đó trên các CPU. Kiểu chạy-dừng này là thứ biến giới hạn CPU thành những cú vọt độ trễ ở máy chủ web (<a href="${OS('os-3-4-da-loi')}">bài 3.4</a>), và là lý do <code>docker run --cpus 1.5</code> được ghi thành <code>150000 100000</code> (bên dưới).</p>
${lab('cgroup', 'cpuquota', 'vi', 'cpu.max trên dòng thời gian: nhóm tiêu hết quota sớm trong mỗi chu kỳ 100 ms rồi phải chờ — những lát bị hãm chính là độ trễ mà request của bạn cảm thấy.', { tour: 'cgroup-start' })}
${lab('cgroup', 'cputhreads', 'vi', 'Thêm luồng không được thêm CPU dưới một quota — chúng đốt cùng ngân sách nhanh hơn và chờ lâu hơn mỗi chu kỳ.')}

<h3>pids.max: quả bom fork không nổ được</h3>
${run('c122-cg', 'echo max > cpu.max; echo 20 > pids.max', 3)}
<p>Với <code>pids.max = 20</code>, bản thân Python cộng 19 đứa con lấp đầy nhóm; lần fork thứ 20 hỏng với <code>EAGAIN</code> ("Resource temporarily unavailable"), và <code>pids.events</code> đếm lần từ chối. Con số này tính cả luồng — một JVM 60 luồng chiếm 60 chỗ. Giờ tới thứ thật, một fork bomb bằng bash (một hàm tự gọi chính nó hai lần ở nền), trong một nhóm có trần 64:</p>
${run('c122-cg', 'echo 64 > pids.max', 4)}
<p>Quả bom lấp nhóm tới đúng 64 tác vụ và bị từ chối thêm 150 lần — còn cả máy thì chẳng hề gì: tải trung bình 0,24. Không có <code>pids.max</code>, đúng năm ký tự đó lấp đầy bảng PID của cả máy chủ, sau đó không ai, kể cả phiên <code>ssh</code> của bạn, khởi động nổi một tiến trình. <code>cgroup.kill</code> là cách dọn: một lần ghi gửi SIGKILL tới mọi tiến trình trong nhóm cùng lúc (không có cuộc đua với tiến trình đang fork trong lúc bạn giết), và <code>populated 0</code> xác nhận nhóm đã trống.</p>
${lab('sysmon', 'forkbomb', 'vi', 'Một fork bomb trên màn hình giám sát: số tác vụ bùng lên tới trần. Xem con số nào nhảy — Tasks, pids.current, tải — và con số nào đứng yên.', { tour: 'sysmon-start' })}

<h3>io.max: băng thông trên một thiết bị</h3>
${run('c122-cg', 'echo "254:0 wbps=10485760" > io.max', 3)}
<p><code>io.max</code> giới hạn số byte hoặc số thao tác mỗi giây <strong>trên một thiết bị khối</strong>, gọi bằng major:minor — <code>254:0</code> là <code>vda</code>, ổ đĩa của máy ảo này (xem <code>/proc/partitions</code>). 40 MiB ở 10 MiB/s mất 4,0 s; cùng lần ghi đó không giới hạn mất 12 ms. Hai chi tiết: giới hạn chỉ áp lên I/O thật sự tới thiết bị đó (một bind mount từ macOS không nằm trên <code>vda</code>, nên ghi vào đó không chậm chút nào), và ghi có đệm bị hãm lúc page cache ghi chúng xuống, không phải lúc <code>write()</code> — vì thế phép thử dùng <code>oflag=direct</code> (bài 9.2).</p>

<h3>freeze: việc docker pause làm</h3>
${run('c122-cg', 'sleep 300 & S=$!', 2)}
<p>Ghi 1 vào <code>cgroup.freeze</code> làm mọi tiến trình của nhóm dừng ở đường xử lý tín hiệu của nhân (<code>wchan get_signal</code>) cho tới khi bạn ghi 0. Không gì bị giết, bộ nhớ giữ nguyên. <code>docker pause</code> chính là việc này — đọc từ máy ảo:</p>
${run('c122-host', 'ID=$(docker inspect', 3)}

<h3>docker run ghi gì</h3>
${run('c122-host', 'docker run -d --name os-c122-app', 3)}
<table>
<tr><th>cờ docker run</th><th>file cgroup</th><th>giá trị đo được</th></tr>
<tr><td><code>--memory 256m</code></td><td><code>memory.max</code></td><td>268435456 (256 × 1024 × 1024)</td></tr>
<tr><td><code>--cpus 1.5</code></td><td><code>cpu.max</code></td><td><code>150000 100000</code> (150 ms mỗi 100 ms)</td></tr>
<tr><td><code>--pids-limit 100</code></td><td><code>pids.max</code></td><td>100</td></tr>
<tr><td><code>--device-write-bps /dev/vda:10mb</code></td><td><code>io.max</code></td><td>như <code>254:0 wbps=…</code> của ta</td></tr>
<tr><td><code>docker pause</code></td><td><code>cgroup.freeze</code></td><td>1</td></tr>
</table>
<p>Còn <code>docker update</code> ghi lại các file của một container <em>đang chạy</em> — <code>--cpus 0.5</code> thành <code>50000 100000</code> mà không cần khởi động lại. <code>resources.limits</code> của Kubernetes cũng rơi vào đúng những file này (giới hạn bộ nhớ ở <a href="${OS('os-8-5-gioi-han')}">bài 8.5</a>).</p>

<h3>🧪 Thực hành (25–30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một worker chạy nền trên VPS của nhóm có lỗi: mỗi job sinh một tiến trình con và không bao giờ dọn. Vài phút sau <code>ssh</code> trả lời "fork: retry: Resource temporarily unavailable" và cả máy chủ phải khởi động lại từ bảng điều khiển của nhà cung cấp. Bạn muốn chứng minh một cgroup đã có thể chặn được chuyện đó.</p>
<ol>
<li>Trong container lab <code>--privileged</code>, dựng phần uỷ quyền như trên (nhóm <code>init</code>, <code>subtree_control</code>) và tạo nhóm <code>worker</code> với <code>pids.max = 50</code>.</li>
<li>Chạy fork bomb (hoặc <code>forks.py</code> với vòng lặp lớn hơn) trong <code>worker</code>; ở shell thứ hai, cho thấy bạn vẫn khởi động được tiến trình và đọc được <code>pids.current</code>, <code>pids.events</code>.</li>
<li>Dọn bằng đúng một lần ghi vào <code>cgroup.kill</code>; chứng minh nhóm đã trống.</li>
<li>Làm lại với <code>docker run --pids-limit 50</code> và đọc <code>/sys/fs/cgroup/pids.max</code> bên trong container.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn cho thấy <code>pids.current</code> kẹt ở trần, <code>max</code> khác 0 trong <code>pids.events</code>, một shell bên ngoài nhóm vẫn khoẻ, và đúng một cờ Docker mà nhóm bạn nên thêm cho mọi dịch vụ.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['cgroup v2 (nhóm điều khiển v2)', 'Một cây nhóm duy nhất dưới /sys/fs/cgroup; mỗi tiến trình ở đúng một nhóm; các file là thiết lập và bộ đếm.'],
  ['controller (bộ điều khiển)', 'Phần của nhân thực thi một tài nguyên (memory, cpu, pids, io…); bật cho nhóm con qua cgroup.subtree_control.'],
  ['no internal processes rule (luật không tiến trình ở nút trong)', 'Nhóm đã trao controller xuống thì không được chứa tiến trình — EBUSY tới khi bạn chuyển chúng sang một nhóm lá.'],
  ['memory.max / memory.events', 'Trần bộ nhớ cứng; chạm trần thì nhân thu hồi, rồi OOM killer ra tay ngay trong nhóm (bộ đếm oom_kill).'],
  ['cpu.max (quota period)', 'Tối đa quota µs CPU mỗi period µs cho cả nhóm; nr_throttled đếm số chu kỳ nhóm phải chờ.'],
  ['pids.max', 'Số tác vụ (tiến trình và luồng) tối đa trong nhóm; fork/clone vượt trần thì hỏng với EAGAIN.'],
  ['cgroup.kill / cgroup.freeze', 'Giết mọi tiến trình trong nhóm một lúc / dừng tất cả cho tới khi rã đông (docker pause).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Giới hạn của container là những file bình thường trong <code>/sys/fs/cgroup</code>: nhóm là thư mục, vào nhóm là ghi PID vào <code>cgroup.procs</code>.</li>
<li>Controller phải được uỷ quyền qua <code>subtree_control</code>, và chỉ từ một nhóm không chứa tiến trình nào của chính nó (nếu không thì EBUSY).</li>
<li><code>memory.max</code> → OOM kill trong hộp (137); <code>cpu.max</code> → bị hãm mỗi chu kỳ; <code>pids.max</code> → fork hỏng với EAGAIN; <code>io.max</code> → băng thông theo thiết bị.</li>
<li><code>cgroup.kill</code> làm trống một nhóm trong một nhát; <code>cgroup.freeze</code> chính là <code>docker pause</code>.</li>
<li><code>--memory</code>, <code>--cpus</code>, <code>--pids-limit</code> ghi đúng những file đó, và <code>docker update</code> đổi chúng khi container đang chạy.</li>
</ul>
${L('https://docs.kernel.org/admin-guide/cgroup-v2.html', '📄', 'Control Group v2 (kernel.org)', 'Tài liệu gốc: từng file, luật không tiến trình ở nút trong, uỷ quyền.', 'Mở')}
${L('https://man7.org/linux/man-pages/man7/cgroups.7.html', '📄', 'man 7 cgroups', 'cgroup v1 và v2 nhìn từ phía system call, /proc/PID/cgroup.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 12.3 — OverlayFS và lớp ảnh ───────────────────────── */
    {
      title: '12.3 — OverlayFS and image layers: lower, upper, work — copy-up, whiteouts and the build cache|||12.3 — OverlayFS và các lớp ảnh: lower, upper, work — copy-up, whiteout và build cache',
      slug: 'os-12-3-overlayfs',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Gốc / của mọi container là một mount overlay: 14 thư mục lower (13 lớp ảnh os-lab + lớp init) + một upper riêng. Dựng overlay bằng tay: lớp trên che lớp dưới, ghi mới vào upper, sửa file thì copy-up, xoá thì whiteout (thiết bị ký tự 0,0), xoá thư mục thì opaque; nối một byte vào file 200 MB tốn 0,93 s và 200 MB đĩa. Lớp ảnh = lower, docker diff = upper; build cache theo từng lệnh (CACHED, đổi server.js chỉ làm lại bước 5, đổi package.json làm lại npm ci 3,1 s) và vì sao cache làm đầy đĩa VPS (bài 2.4).',
      content: `${G123}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>Image layers are an overlay mount</h2>
<p class="lead">The image <code>os-lab</code> is 13 layers; <code>alpine</code> is one. Ten containers from one image do not copy it ten times, a write inside a container never changes the image, and yet appending one line to a big file inside a container can be strangely slow and fill the disk. All of that is one kernel file system: <strong>OverlayFS</strong>. The question for this lesson: <strong>how does the kernel turn a stack of read-only directories into one writable root, and what does each operation — read, write, modify, delete — really cost?</strong> We mount an overlay by hand, then read Docker's layers and build cache with the same eyes.</p>

<h3>The root of every container is an overlay mount</h3>
<p>Ask a running container what its <code>/</code> is. The mount options list every layer:</p>
${run('c123-overlay', "cat /proc/self/mountinfo | grep -E ' / / ' | grep -oE 'lowerdir", 2)}
${run('c123-host', "docker image inspect os-lab -f")}
${run('c126-host', 'docker run --rm --label oslab=1 alpine:latest sh -c "grep')}
<p>Fourteen read-only <strong>lower</strong> directories for an image of 13 layers, and two for the one-layer Alpine image: every image layer is one lower directory, plus one small layer Docker adds per container (its "init" layer, with empty placeholders such as <code>/etc/hosts</code> and <code>/etc/resolv.conf</code> that it later bind-mounts over — you can see those mounts in lesson 12.6). On top sits one <strong>upper</strong> directory that belongs to this container only, and a <strong>work</strong> directory overlayfs needs for atomic operations. The snapshot numbers are directories inside the Docker VM.</p>
${lab('overlay', 'image', 'en', 'An image is a stack of lower directories: os-lab’s 13 layers plus Docker’s init layer make 14 lowerdirs, Alpine 1 + 1 = 2. The container’s writable upper dir is exactly what docker diff lists.', { tour: 'overlay-copyup' })}

<h3>Build an overlay by hand</h3>
<p>Two "image layers" (<code>base</code>, like a <code>FROM</code>, and <code>app</code>, like a <code>COPY</code>), an empty upper and work directory, all on a tmpfs — an upper directory cannot itself sit on another overlay, and our lab's root is one:</p>
${run('c123-overlay', 'mkdir /ovl', 4)}
${run('c123-overlay', 'mount -t overlay', 2)}
${run('c123-overlay', 'ls merged merged/etc')}
<p>The merged view contains files from both layers. Where both have <code>etc/app.conf</code>, the <strong>leftmost</strong> lower directory wins: <code>lowerdir=app:base</code> means <code>app</code> is on top, so we see <code>port=8080</code> and <code>base</code>'s <code>port=80</code> is hidden. That is exactly why a later Dockerfile instruction overrides an earlier one.</p>
${lab('overlay', 'layers', 'en', 'lowerdir, upperdir, workdir and merged as columns: read a file and see which layer answers — the leftmost lower dir wins, which is why a later Dockerfile instruction overrides an earlier one.', { tour: 'overlay-copyup' })}

<h3>Writes go up: new files and copy-up</h3>
${run('c123-overlay', 'echo "GET /" > merged/access.log')}
${run('c123-overlay', 'echo "workers=4"', 2)}
<p>A new file lands in <code>upper</code>. Modifying a file from a lower layer triggers <strong>copy-up</strong>: overlayfs copies the whole file into <code>upper</code> first, then applies the change there. The lower layers are never touched — <code>app/etc/app.conf</code> and <code>base/etc/app.conf</code> are still the originals, which is why one image can serve any number of containers.</p>

<h3>Deletes are whiteouts; replaced directories are opaque</h3>
${run('c123-overlay', 'rm merged/etc/legacy.conf')}
<p>A lower layer cannot be changed, so deleting <code>legacy.conf</code> creates a <strong>whiteout</strong> in <code>upper</code>: a character device with device number 0,0 that means "hide this name". The file is still in <code>base</code>. Deleting a whole directory and creating it again marks the new one <strong>opaque</strong> (an extended attribute), so nothing from below shows through:</p>
${run('c123-overlay', 'rm -rf merged/etc')}
<p>Image layers store deletes the same way, which is why <code>RUN rm -rf /var/lib/apt/lists</code> in a <em>separate</em> instruction makes the image no smaller: the files still sit in the layer below, merely hidden.</p>
${lab('overlay', 'whiteout', 'en', 'Delete a file that lives in a lower layer: upper gets a whiteout (a character device 0,0), the name disappears from merged — and the file still sits in the layer below, still taking space in the image.', { tour: 'overlay-copyup' })}

<h3>Copy-up has a price: one byte costs 200 MB</h3>
${run('c123-overlay', 'du -sm upper', 2)}
<p>Appending two bytes to a 200 MB file from a lower layer took <strong>0.93 s</strong> and grew <code>upper</code> from 1 MB to 201 MB: the first write copied the whole file up. The second append took 1 ms, because the file was already in <code>upper</code>.</p>
${lab('overlay', 'copyup', 'en', 'Copy-up with a progress bar: the first write to a 200 MB file from a lower layer copies all of it (0.93 s, upper 1 → 201 MB); the second write takes 1 ms.', { tour: 'overlay-copyup' })}

<div class="pitfall co-tieu-de">
<p><strong>A database (or a log) inside the container's writable layer.</strong> If an image ships a SQLite file, a pre-filled data directory or a large log, the first write copies all of it into the container's upper layer: a slow first request, double the disk, and every byte disappears with <code>docker rm</code>. Data that changes belongs on a <strong>volume</strong> or bind mount — a plain directory mounted over that path, bypassing overlayfs entirely (lesson 9.6). Postgres in this project keeps its data in a named volume for exactly this reason.</p>
</div>

<h3>Image layers are lower dirs; docker diff is the upper dir</h3>
${run('c123-host', 'docker history', 1)}
<p>Every instruction that changes files makes one layer (<code>ENV</code>, <code>CMD</code> and <code>WORKDIR</code> add 0 B or a few KB of metadata). Most of <code>os-lab</code> is two layers: the 719 MB <code>apt-get install</code> and the 309 MB JDK of the base image. And what a container has changed is simply its upper directory, which <code>docker diff</code> lists as <strong>A</strong>dded, <strong>C</strong>hanged and <strong>D</strong>eleted (a whiteout):</p>
${run('c123-host', 'docker run --name os-c123-diff', 2)}

<h3>The build cache: one cache entry per instruction</h3>
<p>When you build, each instruction produces a layer, and BuildKit remembers it under a key made of the parent layer, the instruction text and — for <code>COPY</code> — a checksum of the files copied. A four-step Dockerfile (<code>lab/code/ch12/cache-demo</code>) built a second time, then after changing the source, then after changing the dependency list:</p>
${src('ch12/cache-demo/Dockerfile', 'dockerfile')}
${run('c123-host', 'docker build -q', 2)}
${run('c123-host', 'echo "console.log', 2)}
${run('c123-host', "echo '{\"name\":\"demo\",\"version\":\"1.0.1\"}'", 3)}
<p>Unchanged: every step <code>CACHED</code>. A new <code>server.js</code>: only step 5 runs again (0.1 s). A new <code>package.json</code>: its <code>COPY</code> changes the key of every later step, so the slow "install" (3.1 s here, minutes for a real <code>npm ci</code>) runs again. Hence the rule: <strong>copy the dependency manifest and install first, copy the source last</strong>. A Dockerfile that starts with <code>COPY . .</code> reinstalls everything on every commit.</p>
${lab('overlay', 'cache', 'en', 'The build cache as a chain of keys: change server.js and only the last step reruns (0.1 s); change package.json and the install reruns (3.2 s). Then move “COPY . .” before the install and watch every edit pay for it.', { tour: 'overlay-cache' })}
${run('c123-host', 'docker system df')}
<p>Each of those rebuilds left layers behind; on this Mac the build cache holds 115 entries, 5.7 GB. On a server that is a disk-space problem waiting to happen — the incident of <a href="${OS('os-2-4-dia-io')}">lesson 2.4</a>, where build cache and old images filled the disk that also held Postgres. Clean it deliberately (<code>docker builder prune</code> with a filter such as <code>until=168h</code>, keep the last N deploy images) or, as this project did, stop building on the production machine.</p>
${lab('sysmon', 'diskfull', 'en', 'The other end of the build cache: a disk at 100 %. Watch which process fails first when the volume holding the database runs out of space.', { tour: 'sysmon-start' })}

<h3>🧪 Practice (25–30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your team's backend image is 1.9 GB, every push rebuilds for six minutes even when only one route changed, and the VPS disk alarm fires every few weeks.</p>
<ol>
<li>In a privileged lab container, rebuild the hand-made overlay above and measure copy-up yourself: a 100 MB file in the lower layer, one appended byte, <code>du</code> of <code>upper</code> before and after.</li>
<li>Run <code>docker history</code> on your own image (or <code>os-lab</code>); name the three biggest layers and the instruction that made each.</li>
<li>Take the <code>cache-demo</code> Dockerfile, swap the order to <code>COPY . .</code> first, change <code>server.js</code> and rebuild: which steps are no longer <code>CACHED</code>?</li>
<li>Run <code>docker system df</code> and <code>docker buildx du</code>; write the prune command with a filter you would schedule on a server.</li>
</ol>
<p><strong>Done when:</strong> you can show the copy-up cost in MB and seconds, a build log where a source change re-runs only the final <code>COPY</code>, and a two-line explanation of where the VPS disk went.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['OverlayFS', 'A union file system: read-only lower directories + one writable upper directory, shown as one merged tree.'],
  ['lowerdir / upperdir / workdir', 'The image layers (leftmost on top) / the container’s private changes / scratch space overlayfs needs for atomic renames.'],
  ['copy-up', 'The first modification of a lower-layer file copies the whole file into the upper directory.'],
  ['whiteout', 'A 0,0 character device in the upper layer that hides a deleted lower-layer file.'],
  ['opaque directory', 'An upper-layer directory marked trusted.overlay.opaque=y; nothing from lower layers shows through.'],
  ['image layer', 'The file changes of one Dockerfile instruction, stored as a tar and mounted as one lowerdir.'],
  ['build cache', 'Layers remembered by key (parent + instruction + file checksums); a changed key re-runs that step and all later ones.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A container’s <code>/</code> is an overlay mount: one lowerdir per image layer (+ Docker’s init layer) and one private upperdir.</li>
<li>Reads come from the topmost layer that has the file; writes go to <code>upper</code>; lower layers never change.</li>
<li>Modifying a lower file copies it up whole (200 MB for one byte, 0.93 s); deleting creates a whiteout, replacing a directory makes it opaque.</li>
<li>Mutable data belongs on volumes, not in the container layer.</li>
<li>The build cache is keyed per instruction: copy dependency manifests before source, and prune the cache before it fills a server disk.</li>
</ul>
${L('https://docs.kernel.org/filesystems/overlayfs.html', '📄', 'Overlay Filesystem (kernel.org)', 'lower/upper/work, copy-up, whiteouts and opaque directories.', 'Open')}
${L('https://docs.docker.com/build/cache/', '📄', 'Docker build cache', 'How cache keys work and how to order a Dockerfile for them.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Các lớp ảnh chính là một mount overlay</h2>
<p class="lead">Ảnh <code>os-lab</code> có 13 lớp; <code>alpine</code> có một. Mười container từ một ảnh không chép ảnh mười lần, ghi trong container không bao giờ đổi ảnh, vậy mà nối thêm một dòng vào một file lớn trong container lại có thể chậm lạ lùng và làm đầy đĩa. Tất cả là một hệ thống file của nhân: <strong>OverlayFS</strong>. Câu hỏi của bài: <strong>nhân biến một chồng thư mục chỉ-đọc thành một gốc ghi được như thế nào, và mỗi thao tác — đọc, ghi, sửa, xoá — thật ra tốn gì?</strong> Ta mount một overlay bằng tay, rồi đọc các lớp và build cache của Docker bằng chính con mắt đó.</p>

<h3>Gốc của mọi container là một mount overlay</h3>
<p>Hỏi một container đang chạy xem <code>/</code> của nó là gì. Các tuỳ chọn mount liệt kê từng lớp:</p>
${run('c123-overlay', "cat /proc/self/mountinfo | grep -E ' / / ' | grep -oE 'lowerdir", 2)}
${run('c123-host', "docker image inspect os-lab -f")}
${run('c126-host', 'docker run --rm --label oslab=1 alpine:latest sh -c "grep')}
<p>Mười bốn thư mục <strong>lower</strong> chỉ-đọc cho một ảnh 13 lớp, và hai cho ảnh Alpine một lớp: mỗi lớp ảnh là một thư mục lower, cộng một lớp nhỏ Docker thêm cho từng container (lớp "init" của nó, chứa các chỗ giữ chỗ rỗng như <code>/etc/hosts</code> và <code>/etc/resolv.conf</code> mà sau đó nó bind mount đè lên — bạn sẽ thấy các mount đó ở bài 12.6). Trên cùng là một thư mục <strong>upper</strong> chỉ thuộc về container này, và một thư mục <strong>work</strong> mà overlayfs cần cho các thao tác nguyên tử. Các con số snapshot là thư mục bên trong máy ảo Docker.</p>
${lab('overlay', 'image', 'vi', 'Một image là một chồng thư mục lower: 13 lớp của os-lab cộng lớp init của Docker thành 14 lowerdir, Alpine 1 + 1 = 2. Thư mục upper ghi được của container chính là thứ docker diff liệt kê.', { tour: 'overlay-copyup' })}

<h3>Dựng một overlay bằng tay</h3>
<p>Hai "lớp ảnh" (<code>base</code>, như một <code>FROM</code>, và <code>app</code>, như một <code>COPY</code>), một thư mục upper và work rỗng, tất cả trên một tmpfs — thư mục upper không được nằm trên một overlay khác, mà gốc của lab chính là một overlay:</p>
${run('c123-overlay', 'mkdir /ovl', 4)}
${run('c123-overlay', 'mount -t overlay', 2)}
${run('c123-overlay', 'ls merged merged/etc')}
<p>Góc nhìn gộp chứa file từ cả hai lớp. Chỗ nào cả hai cùng có <code>etc/app.conf</code> thì thư mục lower <strong>bên trái nhất</strong> thắng: <code>lowerdir=app:base</code> nghĩa là <code>app</code> nằm trên, nên ta thấy <code>port=8080</code> còn <code>port=80</code> của <code>base</code> bị che. Đó chính là lý do một lệnh Dockerfile phía sau đè được lệnh phía trước.</p>
${lab('overlay', 'layers', 'vi', 'lowerdir, upperdir, workdir và merged thành từng cột: đọc một file và xem lớp nào trả lời — thư mục lower bên trái nhất thắng, đó là lý do lệnh Dockerfile sau đè lệnh trước.', { tour: 'overlay-copyup' })}

<h3>Ghi thì đi lên: file mới và copy-up</h3>
${run('c123-overlay', 'echo "GET /" > merged/access.log')}
${run('c123-overlay', 'echo "workers=4"', 2)}
<p>File mới rơi vào <code>upper</code>. Sửa một file từ lớp dưới kích hoạt <strong>copy-up</strong>: overlayfs chép nguyên file lên <code>upper</code> trước, rồi mới sửa ở đó. Các lớp dưới không bao giờ bị đụng — <code>app/etc/app.conf</code> và <code>base/etc/app.conf</code> vẫn là bản gốc, vì thế một ảnh phục vụ được bao nhiêu container cũng được.</p>

<h3>Xoá là whiteout; thư mục bị thay thì thành opaque</h3>
${run('c123-overlay', 'rm merged/etc/legacy.conf')}
<p>Lớp dưới không sửa được, nên xoá <code>legacy.conf</code> tạo ra một <strong>whiteout</strong> trong <code>upper</code>: một thiết bị ký tự số hiệu 0,0 mang nghĩa "giấu cái tên này". File vẫn nằm trong <code>base</code>. Xoá cả một thư mục rồi tạo lại thì thư mục mới bị đánh dấu <strong>opaque</strong> (một thuộc tính mở rộng), để không gì từ bên dưới lọt lên:</p>
${run('c123-overlay', 'rm -rf merged/etc')}
<p>Lớp ảnh lưu thao tác xoá y như vậy, nên <code>RUN rm -rf /var/lib/apt/lists</code> đặt ở một lệnh <em>riêng</em> không làm ảnh nhỏ đi: các file vẫn nằm ở lớp dưới, chỉ bị giấu.</p>
${lab('overlay', 'whiteout', 'vi', 'Xoá một file nằm ở lớp lower: upper nhận một whiteout (thiết bị ký tự 0,0), cái tên biến khỏi merged — còn file vẫn nằm ở lớp dưới, vẫn chiếm chỗ trong image.', { tour: 'overlay-copyup' })}

<h3>Copy-up có giá: một byte tốn 200 MB</h3>
${run('c123-overlay', 'du -sm upper', 2)}
<p>Nối hai byte vào một file 200 MB của lớp dưới mất <strong>0,93 s</strong> và làm <code>upper</code> phình từ 1 MB lên 201 MB: lần ghi đầu đã chép cả file lên. Lần nối thứ hai mất 1 ms, vì file đã nằm sẵn trong <code>upper</code>.</p>
${lab('overlay', 'copyup', 'vi', 'Copy-up có thanh tiến độ: lần ghi đầu vào một file 200 MB ở lớp lower chép nguyên file (0,93 s, upper 1 → 201 MB); lần ghi thứ hai mất 1 ms.', { tour: 'overlay-copyup' })}

<div class="pitfall co-tieu-de">
<p><strong>Cơ sở dữ liệu (hay log) nằm trong lớp ghi được của container.</strong> Nếu một ảnh mang sẵn file SQLite, một thư mục dữ liệu điền sẵn hay một log lớn, lần ghi đầu tiên chép toàn bộ nó lên lớp upper của container: request đầu chậm, đĩa tốn gấp đôi, và mọi byte biến mất theo <code>docker rm</code>. Dữ liệu thay đổi phải nằm trên <strong>volume</strong> hoặc bind mount — một thư mục thường mount đè lên đường dẫn đó, đi vòng qua overlayfs hoàn toàn (bài 9.6). Postgres của dự án này giữ dữ liệu trong một volume có tên chính vì lý do đó.</p>
</div>

<h3>Lớp ảnh là các lower; docker diff là thư mục upper</h3>
${run('c123-host', 'docker history', 1)}
<p>Mỗi lệnh có đổi file tạo ra một lớp (<code>ENV</code>, <code>CMD</code>, <code>WORKDIR</code> thêm 0 B hoặc vài KB siêu dữ liệu). Phần lớn <code>os-lab</code> nằm ở hai lớp: 719 MB của <code>apt-get install</code> và 309 MB JDK của ảnh nền. Còn những gì một container đã đổi đơn giản là thư mục upper của nó, mà <code>docker diff</code> liệt kê thành <strong>A</strong> (thêm), <strong>C</strong> (đổi) và <strong>D</strong> (xoá — một whiteout):</p>
${run('c123-host', 'docker run --name os-c123-diff', 2)}

<h3>Build cache: mỗi lệnh một mục cache</h3>
<p>Khi build, mỗi lệnh tạo một lớp, và BuildKit nhớ nó theo một khoá ghép từ lớp cha, chữ của lệnh và — với <code>COPY</code> — mã băm của các file được chép. Một Dockerfile bốn bước (<code>lab/code/ch12/cache-demo</code>) build lần hai, rồi sau khi đổi mã nguồn, rồi sau khi đổi danh sách thư viện:</p>
${src('ch12/cache-demo/Dockerfile', 'dockerfile')}
${run('c123-host', 'docker build -q', 2)}
${run('c123-host', 'echo "console.log', 2)}
${run('c123-host', "echo '{\"name\":\"demo\",\"version\":\"1.0.1\"}'", 3)}
<p>Không đổi gì: mọi bước <code>CACHED</code>. <code>server.js</code> mới: chỉ bước 5 chạy lại (0,1 s). <code>package.json</code> mới: lệnh <code>COPY</code> của nó đổi khoá của mọi bước sau, nên bước "cài đặt" chậm (3,1 s ở đây, vài phút với một <code>npm ci</code> thật) chạy lại. Từ đó có luật: <strong>chép file khai báo thư viện và cài trước, chép mã nguồn sau cùng</strong>. Một Dockerfile mở đầu bằng <code>COPY . .</code> sẽ cài lại tất cả ở mỗi commit.</p>
${lab('overlay', 'cache', 'vi', 'Build cache là một chuỗi khoá: đổi server.js thì chỉ bước cuối chạy lại (0,1 s); đổi package.json thì bước cài chạy lại (3,2 s). Rồi đưa “COPY . .” lên trước bước cài và xem lần sửa nào cũng phải trả giá.', { tour: 'overlay-cache' })}
${run('c123-host', 'docker system df')}
<p>Mỗi lần build lại đó để lại lớp; trên máy Mac này build cache giữ 115 mục, 5,7 GB. Trên máy chủ, đó là một vụ hết đĩa đang chờ xảy ra — chính sự cố ở <a href="${OS('os-2-4-dia-io')}">bài 2.4</a>, khi build cache và ảnh cũ lấp đầy cái đĩa chứa luôn Postgres. Hãy dọn có chủ đích (<code>docker builder prune</code> kèm bộ lọc như <code>until=168h</code>, giữ N ảnh deploy gần nhất) hoặc, như dự án này đã làm, thôi build trên máy production.</p>
${lab('sysmon', 'diskfull', 'vi', 'Đầu kia của build cache: một ổ đĩa đầy 100 %. Xem tiến trình nào hỏng trước khi phân vùng chứa cơ sở dữ liệu hết chỗ.', { tour: 'sysmon-start' })}

<h3>🧪 Thực hành (25–30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> ảnh backend của nhóm bạn nặng 1,9 GB, mỗi lần push đều build lại sáu phút dù chỉ đổi một route, và chuông báo đĩa của VPS cứ vài tuần lại kêu.</p>
<ol>
<li>Trong container lab đặc quyền, dựng lại overlay bằng tay như trên và tự đo copy-up: một file 100 MB ở lớp dưới, nối thêm một byte, <code>du</code> thư mục <code>upper</code> trước và sau.</li>
<li>Chạy <code>docker history</code> trên ảnh của chính bạn (hoặc <code>os-lab</code>); gọi tên ba lớp lớn nhất và lệnh đã tạo ra từng lớp.</li>
<li>Lấy Dockerfile <code>cache-demo</code>, đổi thứ tự thành <code>COPY . .</code> trước, sửa <code>server.js</code> rồi build lại: những bước nào không còn <code>CACHED</code>?</li>
<li>Chạy <code>docker system df</code> và <code>docker buildx du</code>; viết lệnh prune có bộ lọc mà bạn sẽ đặt lịch chạy trên máy chủ.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn cho thấy được giá của copy-up bằng MB và giây, một log build mà sửa mã nguồn chỉ chạy lại lệnh <code>COPY</code> cuối, và hai dòng giải thích đĩa VPS đã đi đâu.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['OverlayFS', 'Hệ thống file hợp nhất: các thư mục lower chỉ-đọc + một thư mục upper ghi được, hiện ra thành một cây gộp.'],
  ['lowerdir / upperdir / workdir', 'Các lớp ảnh (bên trái nhất nằm trên) / thay đổi riêng của container / chỗ nháp overlayfs cần để đổi tên nguyên tử.'],
  ['copy-up (chép lên)', 'Lần sửa đầu tiên một file của lớp dưới chép nguyên file đó lên thư mục upper.'],
  ['whiteout (dấu xoá)', 'Một thiết bị ký tự 0,0 ở lớp upper, giấu một file đã bị xoá của lớp dưới.'],
  ['opaque directory (thư mục mờ)', 'Thư mục ở upper mang thuộc tính trusted.overlay.opaque=y; không gì từ lớp dưới lọt lên.'],
  ['image layer (lớp ảnh)', 'Thay đổi file của một lệnh Dockerfile, lưu thành một tar và mount thành một lowerdir.'],
  ['build cache', 'Các lớp được nhớ theo khoá (lớp cha + lệnh + mã băm file); khoá đổi thì bước đó và mọi bước sau chạy lại.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>/</code> của một container là một mount overlay: mỗi lớp ảnh một lowerdir (+ lớp init của Docker) và một upperdir riêng.</li>
<li>Đọc lấy từ lớp cao nhất có file; ghi đi vào <code>upper</code>; lớp dưới không bao giờ đổi.</li>
<li>Sửa một file lớp dưới thì chép nguyên file lên (200 MB cho một byte, 0,93 s); xoá tạo whiteout, thay một thư mục thì nó thành opaque.</li>
<li>Dữ liệu thay đổi phải nằm trên volume, không nằm trong lớp của container.</li>
<li>Build cache được khoá theo từng lệnh: chép file khai báo thư viện trước mã nguồn, và dọn cache trước khi nó làm đầy đĩa máy chủ.</li>
</ul>
${L('https://docs.kernel.org/filesystems/overlayfs.html', '📄', 'Overlay Filesystem (kernel.org)', 'lower/upper/work, copy-up, whiteout và thư mục opaque.', 'Mở')}
${L('https://docs.docker.com/build/cache/', '📄', 'Docker build cache', 'Khoá cache hoạt động ra sao và sắp Dockerfile cho khớp.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 12.4 — Mini container ───────────────────────── */
    {
      title: '12.4 — Build a mini container by hand: an Alpine rootfs, overlayfs, a cgroup, six namespaces and pivot_root|||12.4 — Tự dựng một mini container bằng tay: rootfs Alpine, overlayfs, một cgroup, sáu namespace và pivot_root',
      slug: 'os-12-4-mini',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ghép ba bài trước thành một container ~40 dòng shell (mini-container.sh): ảnh = tar Alpine 3.24 xuất bằng docker export, lớp = overlay riêng cho từng hộp, giới hạn = cgroup memory/cpu/pids, hàng rào = unshare 6 namespace + pivot_root + /proc, /sys, cgroup2, /dev tí hon. Đo: hostname box1, Alpine, PID 1, chỉ có lo; dd 200 MB bị giết 137; fork bị từ chối ở trần 32; vòng lặp 0,45 s CPU mất 0,88 s dưới quota 50 %; nhìn từ ngoài (NSpid, /proc/PID/root, upper có whiteout motd), nsenter vào, dọn sạch; vì sao pivot_root chứ không chroot; còn thiếu gì so với Docker.',
      content: `${G124}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>Build a mini container by hand</h2>
<p class="lead">Lessons 12.1–12.3 took a container apart: namespaces for what it sees, cgroups for what it may use, overlayfs for its files. Now we put the parts back together without Docker. The question: <strong>if you write the container runtime yourself, in about forty lines of shell, does the result behave like a container — and what is still missing?</strong> We measure it the same way we measured Docker.</p>

<h3>Step 0 — an image is a tar of files</h3>
<p>A container image is, at the bottom, a directory tree. The quickest way to get one is to let Docker flatten an image into a tar, once, on the host:</p>
${cmd('docker create --name tmp alpine:latest', 'docker export tmp > alpine-3.24.tar     # 8.6 MB, Alpine 3.24.2', 'docker rm tmp')}
${run('c124-mini', 'ls -lh /opt/c12/alpine-3.24.tar')}
<p>421 files: <code>/bin/busybox</code>, the musl C library, <code>apk</code>, <code>/etc</code>. (Without Docker you would download the "mini root filesystem" tarball from alpinelinux.org — the same thing.) Our lab is Ubuntu 26.04 with 5 processes; the box we build will be Alpine with one.</p>
${run('c124-mini', 'cat /etc/os-release | head -1')}

<h3>The whole runtime</h3>
${src('ch12/mini-container.sh', 'bash')}
<p>Four blocks, each one a lesson of this chapter:</p>
<ol>
<li><strong>Layers</strong> (12.3): the tar is unpacked once into <code>image/</code>, the read-only lower layer; each box gets its own <code>upper</code> and <code>work</code>, so ten boxes share one image and none can change it.</li>
<li><strong>Limits</strong> (12.2): a child cgroup <code>mini-NAME</code> with <code>memory.max</code>, <code>cpu.max</code> and <code>pids.max</code>. The parent group must already delegate those controllers (the <code>init</code> trick of 12.2).</li>
<li><strong>Fences</strong> (12.1): a helper shell writes its own PID into the cgroup and <code>exec</code>s <code>unshare</code> for six namespaces with <code>--fork</code>, so everything that follows is inside both. Inside, it makes the mount tree private, <strong><code>pivot_root</code>s</strong> into the overlay, mounts a fresh <code>/proc</code>, a read-only <code>/sys</code>, the cgroup file system (which, thanks to the cgroup namespace, shows the box's own group as <code>/</code>) and a tiny <code>/dev</code> with three device nodes, then unmounts the old root and <code>exec</code>s the command — which becomes PID 1.</li>
<li><strong>Cleanup</strong>: when PID 1 exits, the kernel kills everything else in its PID namespace; we unmount the overlay and remove the empty cgroup.</li>
</ol>

<h3>Why pivot_root and not chroot</h3>
<p><code>chroot</code> only changes where <em>path lookup</em> starts for one process. The old root is still mounted, still in the mount table, and reachable again by a privileged process (a directory file descriptor opened before the chroot is enough), which is why <code>chroot</code> was never a security boundary. <code>pivot_root(new, put_old)</code> works on the <strong>mount namespace</strong>: it makes <code>new</code> the root mount and moves the old root to <code>put_old</code>, after which we unmount it lazily (<code>umount -l /.old</code>) — the host file system is no longer in this namespace at all. It has preconditions, which is why the script looks the way it does: <code>new</code> must be a mount point (our overlay is), and the tree must not share mount propagation with the parent (<code>--make-rprivate</code>). runc does exactly this — <code>pivot_root(".", ".")</code> shows up in its trace in lesson 12.6. (<code>man 2 pivot_root</code> lists the rules; the man page uses the same <code>.</code>/<code>.</code> trick.)</p>

<div class="pitfall co-tieu-de">
<p><strong>Mounts that leak back to the host.</strong> On a systemd machine the root mount is <em>shared</em>: a mount made in one mount namespace propagates into its peers. A homemade runtime that forgets <code>mount --make-rprivate /</code> before mounting <code>/proc</code>, overlays or tmpfs can leave those mounts visible on the host — and after a few hundred containers, <code>findmnt</code> on the server is a wall of stale mounts that nothing cleans up. <code>unshare</code> sets <code>--propagation private</code> by default; we still write it explicitly, and you should too in any code that creates mount namespaces (lesson 9.6 explains the propagation types).</p>
</div>

<h3>It behaves like a container</h3>
${run('c124-mini', "./mini-container.sh box1 /bin/sh -c 'echo \"hostname:")}
<p>Its own hostname, Alpine instead of Ubuntu, PID 1, a process list of two. And the file system and devices:</p>
${run('c124-mini', "./mini-container.sh box1 /bin/sh -c 'ls /")}
<p>The root is our overlay (on the 256 MB tmpfs), <code>/dev</code> has exactly the three nodes we created — no disks, no host terminal — and the network namespace has only a <code>lo</code> that is down. Its cgroup looks like <code>/</code> and carries our limits:</p>
${run('c124-mini', "./mini-container.sh box1 /bin/sh -c 'cat /proc/self/cgroup")}
${lab('process', 'sandbox', 'en', 'The fenced process tree you just built: PID 1 inside, a normal PID outside, children that cannot see or signal anything beyond the fence.', { tour: 'process-start' })}

<h3>The limits bite</h3>
${run('c124-mini', "./mini-container.sh box1 /bin/sh -c 'dd", 2)}
<p>busybox <code>dd</code> with a 200 MB block allocates a 200 MB buffer and fills it: killed at 64 MiB, exit 137, and the kernel names the process. Our homemade box gets the same OOM kill as a Docker container with <code>--memory 64m</code> (lesson 1.5 and Chapter 8 for what 137 means).</p>
${lab('process', 'oom137', 'en', 'The same death from the process side: the box’s PID 1 is SIGKILLed by the memory cgroup and its parent reads 128 + 9 = 137.', { tour: 'process-start' })}
${run('c124-mini', "./mini-container.sh box1 /bin/sh -c 'for i")}
<p>Forty background <code>sleep</code>s in a box with <code>pids.max = 32</code>: the shell cannot fork and gives up — the script never reaches "survived". And the CPU quota:</p>
${run('c124-mini', "./mini-container.sh box1 /bin/sh -c 'time", 2)}
<p>The same loop needs 0.45 s of CPU either way, but under <code>50000 100000</code> it takes <strong>0.88 s</strong> of wall time: half of every 100 ms period is spent waiting. With the quota set to <code>max</code>, wall time equals CPU time.</p>

<h3>Seen from outside</h3>
<p>Start a box that writes a file, deletes one, and sleeps; then look at it from the lab:</p>
${run('c124-mini', './mini-container.sh box2', 4)}
<p>PID 271 outside, PID 1 inside; its cgroup is <code>/mini-box2</code>; and <code>/proc/PID/root</code> — the kernel's handle on another process's root directory — lets the host read the box's Alpine files. The box's changes are in its own upper directory: <code>note</code>, and a whiteout for the deleted <code>motd</code>, which is still in the shared image. (Notice also that <code>sleep</code> itself became PID 1: busybox <code>sh -c</code> <code>exec</code>s the last command of its script — that detail matters in lesson 12.7.) And <code>nsenter --all</code> walks into it, exactly like <code>docker exec</code>:</p>
${run('c124-mini', 'nsenter -t $P --all', 2)}
<p>One SIGKILL to PID 1 ends the box; the script's cleanup leaves zero <code>mini-*</code> cgroups and only the lab's own overlay mounted.</p>

<h3>What is still missing compared with Docker</h3>
<table>
<tr><th>feature</th><th>our 40 lines</th><th>runc / Docker</th><th>where in the course</th></tr>
<tr><td>namespaces, cgroups, overlay, pivot_root</td><td>yes</td><td>yes</td><td>12.1–12.4</td></tr>
<tr><td>network (veth, bridge, NAT, ports)</td><td>no — only <code>lo</code></td><td>yes</td><td>12.5</td></tr>
<tr><td>capabilities dropped</td><td>no — full root</td><td>14 kept by default</td><td><a href="${OS('os-9-7-capabilities')}">9.7</a>, <a href="${OS('os-13-4-container-escape')}">13.4</a></td></tr>
<tr><td>seccomp filter</td><td>no</td><td>default profile</td><td><a href="${OS('os-11-4-seccomp')}">11.4</a></td></tr>
<tr><td>masked <code>/proc</code> paths, read-only <code>/sys</code></td><td>/sys only</td><td>yes (maskedPaths, readonlyPaths)</td><td>12.6</td></tr>
<tr><td>user namespace (rootless)</td><td>no</td><td>optional</td><td>12.1, 12.6</td></tr>
<tr><td>images from a registry, logs, restart, health checks</td><td>no</td><td>containerd / dockerd</td><td>12.6</td></tr>
</table>
<p>The kernel part — the part that makes it a container — is all there. Everything else is plumbing around it, which is the subject of lesson 12.6.</p>

<h3>🧪 Practice (30–40 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> in an interview for a backend internship you are asked: "What is a container, really? Not the Docker commands — what does the kernel do?" You want to answer with a demo you built yourself.</p>
<ol>
<li>Copy <code>mini-container.sh</code> into a <code>--privileged</code> lab container with an Alpine tar mounted (export it as in step 0). Set up the <code>init</code> group and <code>subtree_control</code> as in 12.2.</li>
<li>Run <code>MEM=32M PIDS=16 ./mini-container.sh demo /bin/sh</code> and show: <code>hostname</code>, <code>ps</code>, <code>ls /dev</code>, <code>cat /sys/fs/cgroup/memory.max</code>.</li>
<li>From a second shell of the lab, find the box's PID 1, read its <code>NSpid</code> and cgroup, and enter it with <code>nsenter --all</code>.</li>
<li>Add one missing fence: drop all capabilities before <code>exec</code> with <code>setpriv --bounding-set=-all --inh-caps=-all</code> (from the lab, not the Alpine root — think about where the binary must come from), and show <code>grep Cap /proc/self/status</code> inside.</li>
</ol>
<p><strong>Done when:</strong> your box reports its own hostname and PID 1, shows the 32 MiB limit, can be entered from outside, has <code>CapEff 0</code> after step 4, and you can explain each of the four blocks of the script in one sentence.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['root filesystem (rootfs)', 'The directory tree a container sees as /; an image unpacked (here a tar of Alpine 3.24).'],
  ['docker export', 'Writes a container’s merged file system as one flat tar — a quick way to get a rootfs.'],
  ['pivot_root(2)', 'Makes a new mount the root of the mount namespace and moves the old root aside so it can be unmounted.'],
  ['chroot(2)', 'Only changes where path lookup starts for one process; the old root stays mounted — not a security boundary.'],
  ['mount propagation', 'Whether mounts made in one namespace appear in others (shared/private/slave); runtimes make the tree private.'],
  ['/proc/PID/root', 'A link to another process’s root directory; lets the host read files inside a running container.'],
  ['PID 1 exit', 'When the first process of a PID namespace exits, the kernel kills every other process in that namespace.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A container runtime’s kernel work fits in about 40 lines: unpack an image, overlay a private upper layer, create a cgroup, unshare namespaces, <code>pivot_root</code>, mount <code>/proc</code>, <code>exec</code>.</li>
<li>Measured, the homemade box behaves like a container: own hostname and PID 1, Alpine userland, only <code>lo</code>, OOM kill 137, fork refused, CPU throttled (0.45 s CPU in 0.88 s).</li>
<li><code>pivot_root</code> removes the host file system from the namespace; <code>chroot</code> only hides it.</li>
<li>Make the mount tree private before mounting anything, or mounts leak to the host.</li>
<li>Still missing: networking, dropped capabilities, seccomp, masked paths, user namespaces and image/lifecycle management — what runc and Docker add.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/pivot_root.2.html', '📄', 'man 2 pivot_root', 'The rules for the new and old root, and the pivot_root(".", ".") idiom.', 'Open')}
${L('https://man7.org/linux/man-pages/man7/pid_namespaces.7.html', '📄', 'man 7 pid_namespaces', 'Why PID 1 matters, and what happens when it exits.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>Tự dựng một mini container bằng tay</h2>
<p class="lead">Các bài 12.1–12.3 đã tháo một container ra: namespace cho thứ nó thấy, cgroup cho thứ nó được dùng, overlayfs cho file của nó. Giờ ta lắp các mảnh lại mà không cần Docker. Câu hỏi: <strong>nếu bạn tự viết container runtime, khoảng bốn mươi dòng shell, thì kết quả có hành xử như một container không — và còn thiếu gì?</strong> Ta đo nó đúng như đã đo Docker.</p>

<h3>Bước 0 — ảnh là một tar chứa file</h3>
<p>Ở tầng đáy, một ảnh container là một cây thư mục. Cách nhanh nhất để có một cái là nhờ Docker ép phẳng một ảnh thành tar, một lần, trên máy chủ:</p>
${cmd('docker create --name tmp alpine:latest', 'docker export tmp > alpine-3.24.tar     # 8.6 MB, Alpine 3.24.2', 'docker rm tmp')}
${run('c124-mini', 'ls -lh /opt/c12/alpine-3.24.tar')}
<p>421 file: <code>/bin/busybox</code>, thư viện C musl, <code>apk</code>, <code>/etc</code>. (Không có Docker thì tải gói "mini root filesystem" từ alpinelinux.org — cũng y vậy.) Lab của ta là Ubuntu 26.04 với 5 tiến trình; cái hộp ta dựng sẽ là Alpine với một tiến trình.</p>
${run('c124-mini', 'cat /etc/os-release | head -1')}

<h3>Toàn bộ runtime</h3>
${src('ch12/mini-container.sh', 'bash')}
<p>Bốn khối, mỗi khối là một bài của chương này:</p>
<ol>
<li><strong>Lớp</strong> (12.3): tar được giải nén một lần vào <code>image/</code>, lớp lower chỉ-đọc; mỗi hộp có <code>upper</code> và <code>work</code> riêng, nên mười hộp dùng chung một ảnh và không hộp nào sửa được nó.</li>
<li><strong>Giới hạn</strong> (12.2): một cgroup con <code>mini-TÊN</code> với <code>memory.max</code>, <code>cpu.max</code> và <code>pids.max</code>. Nhóm cha phải đã uỷ quyền các controller đó (mẹo nhóm <code>init</code> của 12.2).</li>
<li><strong>Hàng rào</strong> (12.1): một shell phụ ghi PID của chính nó vào cgroup rồi <code>exec</code> sang <code>unshare</code> cho sáu namespace kèm <code>--fork</code>, nên mọi thứ sau đó nằm trong cả hai. Bên trong, nó làm cây mount thành private, <strong><code>pivot_root</code></strong> vào overlay, mount một <code>/proc</code> mới, một <code>/sys</code> chỉ-đọc, hệ thống file cgroup (nhờ cgroup namespace, nhóm của hộp hiện thành <code>/</code>) và một <code>/dev</code> tí hon với ba device node, rồi gỡ gốc cũ và <code>exec</code> lệnh — lệnh đó thành PID 1.</li>
<li><strong>Dọn dẹp</strong>: khi PID 1 thoát, nhân giết mọi tiến trình còn lại trong PID namespace của nó; ta gỡ overlay và xoá cgroup đã trống.</li>
</ol>

<h3>Vì sao pivot_root chứ không phải chroot</h3>
<p><code>chroot</code> chỉ đổi chỗ <em>bắt đầu tra đường dẫn</em> cho một tiến trình. Gốc cũ vẫn được mount, vẫn nằm trong bảng mount, và một tiến trình có đặc quyền vẫn với tới được (một file descriptor thư mục mở trước khi chroot là đủ), vì thế <code>chroot</code> chưa bao giờ là một ranh giới bảo mật. <code>pivot_root(new, put_old)</code> làm việc trên <strong>mount namespace</strong>: nó biến <code>new</code> thành mount gốc và dời gốc cũ sang <code>put_old</code>, sau đó ta gỡ nó kiểu lười (<code>umount -l /.old</code>) — hệ thống file của máy chủ không còn trong namespace này nữa. Nó có điều kiện, nên script mới trông như vậy: <code>new</code> phải là một điểm mount (overlay của ta là), và cây không được chia sẻ propagation với cha (<code>--make-rprivate</code>). runc làm đúng như thế — <code>pivot_root(".", ".")</code> hiện trong dấu vết của nó ở bài 12.6. (<code>man 2 pivot_root</code> liệt kê các luật; trang man dùng đúng mẹo <code>.</code>/<code>.</code> đó.)</p>

<div class="pitfall co-tieu-de">
<p><strong>Mount rò ngược về máy chủ.</strong> Trên một máy chạy systemd, mount gốc là <em>shared</em>: một mount tạo trong một mount namespace sẽ lan sang các namespace ngang hàng. Một runtime tự viết quên <code>mount --make-rprivate /</code> trước khi mount <code>/proc</code>, overlay hay tmpfs có thể để các mount đó hiện ra trên máy chủ — và sau vài trăm container, <code>findmnt</code> trên máy chủ là một bức tường mount cũ chẳng ai dọn. <code>unshare</code> mặc định đặt <code>--propagation private</code>; ta vẫn ghi rõ ra, và bạn cũng nên làm vậy trong mọi đoạn mã tạo mount namespace (bài 9.6 giải thích các kiểu propagation).</p>
</div>

<h3>Nó hành xử như một container</h3>
${run('c124-mini', "./mini-container.sh box1 /bin/sh -c 'echo \"hostname:")}
<p>Hostname riêng, Alpine thay vì Ubuntu, PID 1, danh sách tiến trình chỉ có hai. Còn hệ thống file và thiết bị:</p>
${run('c124-mini', "./mini-container.sh box1 /bin/sh -c 'ls /")}
<p>Gốc là overlay của ta (trên tmpfs 256 MB), <code>/dev</code> có đúng ba node ta tạo — không đĩa, không terminal của máy chủ — và network namespace chỉ có một <code>lo</code> đang tắt. cgroup của nó trông như <code>/</code> và mang đúng các giới hạn của ta:</p>
${run('c124-mini', "./mini-container.sh box1 /bin/sh -c 'cat /proc/self/cgroup")}
${lab('process', 'sandbox', 'vi', 'Cây tiến trình bị rào mà bạn vừa dựng: PID 1 bên trong, một PID thường bên ngoài, các tiến trình con không thấy và không gửi tín hiệu được ra ngoài hàng rào.', { tour: 'process-start' })}

<h3>Giới hạn có hiệu lực</h3>
${run('c124-mini', "./mini-container.sh box1 /bin/sh -c 'dd", 2)}
<p><code>dd</code> của busybox với khối 200 MB cấp một bộ đệm 200 MB rồi lấp đầy nó: bị giết ở 64 MiB, mã thoát 137, và nhân ghi tên tiến trình. Hộp tự làm của ta nhận đúng cú OOM kill như một container Docker có <code>--memory 64m</code> (bài 1.5 và Chương 8 nói 137 nghĩa là gì).</p>
${lab('process', 'oom137', 'vi', 'Cùng cái chết đó nhìn từ phía tiến trình: PID 1 của hộp bị memory cgroup gửi SIGKILL và tiến trình cha đọc ra 128 + 9 = 137.', { tour: 'process-start' })}
${run('c124-mini', "./mini-container.sh box1 /bin/sh -c 'for i")}
<p>Bốn mươi lệnh <code>sleep</code> chạy nền trong một hộp có <code>pids.max = 32</code>: shell không fork nổi và bỏ cuộc — script không bao giờ tới được chữ "survived". Còn quota CPU:</p>
${run('c124-mini', "./mini-container.sh box1 /bin/sh -c 'time", 2)}
<p>Cùng một vòng lặp cần 0,45 s CPU dù thế nào, nhưng dưới <code>50000 100000</code> nó mất <strong>0,88 s</strong> thời gian thực: nửa mỗi chu kỳ 100 ms là ngồi chờ. Đặt quota thành <code>max</code>, thời gian thực bằng thời gian CPU.</p>

<h3>Nhìn từ bên ngoài</h3>
<p>Khởi động một hộp ghi một file, xoá một file rồi ngủ; sau đó nhìn nó từ lab:</p>
${run('c124-mini', './mini-container.sh box2', 4)}
<p>PID 271 bên ngoài, PID 1 bên trong; cgroup của nó là <code>/mini-box2</code>; và <code>/proc/PID/root</code> — cái tay nắm của nhân vào thư mục gốc của một tiến trình khác — cho máy chủ đọc được file Alpine của hộp. Thay đổi của hộp nằm trong thư mục upper riêng: <code>note</code>, và một whiteout cho <code>motd</code> đã xoá, file vẫn còn trong ảnh dùng chung. (Để ý thêm: chính <code>sleep</code> thành PID 1 — <code>sh -c</code> của busybox <code>exec</code> luôn lệnh cuối cùng của script; chi tiết này quan trọng ở bài 12.7.) Và <code>nsenter --all</code> bước vào nó, y như <code>docker exec</code>:</p>
${run('c124-mini', 'nsenter -t $P --all', 2)}
<p>Một SIGKILL cho PID 1 là kết thúc hộp; phần dọn dẹp của script để lại không cgroup <code>mini-*</code> nào và chỉ còn overlay của chính lab.</p>

<h3>Còn thiếu gì so với Docker</h3>
<table>
<tr><th>tính năng</th><th>40 dòng của ta</th><th>runc / Docker</th><th>học ở đâu</th></tr>
<tr><td>namespace, cgroup, overlay, pivot_root</td><td>có</td><td>có</td><td>12.1–12.4</td></tr>
<tr><td>mạng (veth, bridge, NAT, cổng)</td><td>không — chỉ <code>lo</code></td><td>có</td><td>12.5</td></tr>
<tr><td>bỏ bớt capabilities</td><td>không — root đầy đủ</td><td>mặc định giữ 14</td><td><a href="${OS('os-9-7-capabilities')}">9.7</a>, <a href="${OS('os-13-4-container-escape')}">13.4</a></td></tr>
<tr><td>bộ lọc seccomp</td><td>không</td><td>hồ sơ mặc định</td><td><a href="${OS('os-11-4-seccomp')}">11.4</a></td></tr>
<tr><td>che đường dẫn <code>/proc</code>, <code>/sys</code> chỉ-đọc</td><td>chỉ /sys</td><td>có (maskedPaths, readonlyPaths)</td><td>12.6</td></tr>
<tr><td>user namespace (rootless)</td><td>không</td><td>tuỳ chọn</td><td>12.1, 12.6</td></tr>
<tr><td>ảnh từ registry, log, khởi động lại, kiểm tra sức khoẻ</td><td>không</td><td>containerd / dockerd</td><td>12.6</td></tr>
</table>
<p>Phần của nhân — phần làm nên một container — đã đủ cả. Mọi thứ còn lại là đường ống bao quanh nó, chủ đề của bài 12.6.</p>

<h3>🧪 Thực hành (30–40 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> trong buổi phỏng vấn thực tập backend, người phỏng vấn hỏi: "Container thật ra là gì? Đừng kể lệnh Docker — nhân làm gì?" Bạn muốn trả lời bằng một bản demo tự tay dựng.</p>
<ol>
<li>Chép <code>mini-container.sh</code> vào một container lab <code>--privileged</code> có gắn tar Alpine (xuất như ở bước 0). Dựng nhóm <code>init</code> và <code>subtree_control</code> như bài 12.2.</li>
<li>Chạy <code>MEM=32M PIDS=16 ./mini-container.sh demo /bin/sh</code> và cho thấy: <code>hostname</code>, <code>ps</code>, <code>ls /dev</code>, <code>cat /sys/fs/cgroup/memory.max</code>.</li>
<li>Từ một shell thứ hai của lab, tìm PID 1 của hộp, đọc <code>NSpid</code> và cgroup của nó, rồi bước vào bằng <code>nsenter --all</code>.</li>
<li>Thêm một hàng rào còn thiếu: bỏ mọi capability trước khi <code>exec</code> bằng <code>setpriv --bounding-set=-all --inh-caps=-all</code> (của lab, không phải của gốc Alpine — nghĩ xem tệp chạy phải lấy từ đâu), và cho thấy <code>grep Cap /proc/self/status</code> bên trong.</li>
</ol>
<p><strong>Đạt khi:</strong> hộp của bạn báo hostname riêng và PID 1, hiện trần 32 MiB, bước vào được từ ngoài, có <code>CapEff 0</code> sau bước 4, và bạn giải thích được từng khối trong bốn khối của script bằng một câu.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['root filesystem / rootfs (hệ thống file gốc)', 'Cây thư mục mà container thấy là /; một ảnh đã giải nén (ở đây là tar Alpine 3.24).'],
  ['docker export', 'Ghi hệ thống file gộp của một container thành một tar phẳng — cách nhanh để có một rootfs.'],
  ['pivot_root(2)', 'Biến một mount mới thành gốc của mount namespace và dời gốc cũ sang bên để gỡ được.'],
  ['chroot(2)', 'Chỉ đổi chỗ bắt đầu tra đường dẫn cho một tiến trình; gốc cũ vẫn được mount — không phải ranh giới bảo mật.'],
  ['mount propagation (lan truyền mount)', 'Mount tạo trong một namespace có hiện ở namespace khác không (shared/private/slave); runtime đặt cây thành private.'],
  ['/proc/PID/root', 'Liên kết tới thư mục gốc của một tiến trình khác; cho máy chủ đọc file bên trong một container đang chạy.'],
  ['PID 1 thoát', 'Khi tiến trình đầu tiên của một PID namespace thoát, nhân giết mọi tiến trình khác trong namespace đó.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Phần việc với nhân của một container runtime gói gọn trong khoảng 40 dòng: giải nén ảnh, phủ một lớp upper riêng, tạo cgroup, unshare các namespace, <code>pivot_root</code>, mount <code>/proc</code>, <code>exec</code>.</li>
<li>Đo đạc cho thấy hộp tự làm hành xử như container: hostname và PID 1 riêng, phần người dùng Alpine, chỉ có <code>lo</code>, OOM kill 137, fork bị từ chối, CPU bị hãm (0,45 s CPU trong 0,88 s).</li>
<li><code>pivot_root</code> loại hệ thống file máy chủ ra khỏi namespace; <code>chroot</code> chỉ giấu nó.</li>
<li>Đặt cây mount thành private trước khi mount bất cứ gì, nếu không mount sẽ rò ra máy chủ.</li>
<li>Còn thiếu: mạng, bỏ capabilities, seccomp, che đường dẫn, user namespace và quản lý ảnh/vòng đời — những thứ runc và Docker thêm vào.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/pivot_root.2.html', '📄', 'man 2 pivot_root', 'Luật cho gốc mới và gốc cũ, và mẹo pivot_root(".", ".").', 'Mở')}
${L('https://man7.org/linux/man-pages/man7/pid_namespaces.7.html', '📄', 'man 7 pid_namespaces', 'Vì sao PID 1 quan trọng, và chuyện gì xảy ra khi nó thoát.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 12.5 — Mạng container ───────────────────────── */
    {
      title: '12.5 — Container networking by hand: veth pairs, a bridge, NAT and a published port|||12.5 — Mạng container bằng tay: cặp veth, bridge, NAT và một cổng publish',
      slug: 'os-12-5-mang',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dựng lại mạng bridge mặc định của Docker bằng tay trong một network namespace vứt đi: eth0 của container là một đầu veth; hai "container" = hai netns, br0 = công tắc ảo, mỗi container một cặp veth; ping 0,09 ms và HTTP 200 giữa hai bên, bảng MAC của bridge; ra Internet cần ip_forward + MASQUERADE (curl 28 → HTTP 200); publish cổng = DNAT (172.17.0.4:8080 → 10.12.0.3:8000); cắm mini container của 12.4 vào bridge bằng PID của nó; một chặng veth+bridge tốn vài micro-giây; bẫy Docker publish cổng vượt qua ufw.',
      content: `${G125}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.5</span>
<h2>Container networking by hand</h2>
<p class="lead">In lesson 12.1 a new network namespace had one interface, <code>lo</code>, and no way out — a machine with the cable cut. Yet every Docker container can talk to its neighbours, reach the Internet and accept connections on a published port. The question: <strong>which kernel objects carry a packet from one container to another, out to the Internet, and from <code>-p 8080:8000</code> back in — and can we build them ourselves with <code>ip</code> and <code>iptables</code>?</strong> We rebuild Docker's default "bridge" network by hand, inside a throwaway privileged container, so nothing on the host's network changes.</p>

<h3>What Docker gave this lab container</h3>
${run('c125-net', 'ip -br addr | grep -v NONE', 2)}
<p>The lab container's <code>eth0</code> has address 172.17.0.4/16 and a default route via 172.17.0.1. <code>ip -d link</code> reveals what it really is: a <strong>veth</strong> — one end of a virtual cable — whose other end lives in another network namespace (<code>link-netnsid 0</code>, here the Docker VM, where it is plugged into the bridge <code>docker0</code> whose address is 172.17.0.1). The <code>@if1229</code> suffix is the interface index of that peer. That is the whole design: a namespace, a virtual cable, a virtual switch, and routing. Let us make our own.</p>

<h3>Two containers, one switch, two cables</h3>
${run('c125-net', 'ip netns add c1', 3)}
<p>Two named network namespaces <code>c1</code> and <code>c2</code> play the containers. <code>br0</code> is a <strong>bridge</strong>: a software Ethernet switch in the kernel, with an address of its own (10.12.0.1) so it can also act as the containers' gateway. For each container, <code>ip link add … type veth peer name eth0 netns cN</code> creates a cable whose one end goes into the container (named <code>eth0</code>, like Docker does) and whose other end, <code>veth-cN</code>, is plugged into the bridge. Then an address, the link up, and a default route via the bridge:</p>
${run('c125-net', 'ip -br link show master br0', 2)}

<h3>Container to container</h3>
${run('c125-net', 'ip netns exec c1 ping', 4)}
<p>Ping and HTTP between the two namespaces work through the bridge. <code>bridge fdb</code> shows how: like a hardware switch, the bridge <em>learned</em> which MAC address sits behind which port (<code>veth-c1</code>, <code>veth-c2</code>) and forwards frames only there. Docker containers on one network talk exactly like this; Docker adds a small DNS server so they can use names instead of addresses.</p>

<h3>To the Internet: forwarding and masquerade</h3>
${run('c125-net', 'ip netns exec c1 curl -sS -m 4', 2)}
<p>c1 has a route to the bridge, but nothing beyond: even the DNS server (whose address is outside 10.12.0.0/24) cannot be reached, so <code>curl</code> times out resolving the name (exit 28). Two things are needed. The kernel must <strong>forward</strong> packets between interfaces — <code>ip_forward</code> is already 1 in this namespace. And the private source address 10.12.0.2 must be replaced by an address the outside world can answer: <strong>source NAT</strong>, which iptables calls <code>MASQUERADE</code>:</p>
${run('c125-net', 'iptables -t nat -A POSTROUTING', 3)}
<p>"Packets from 10.12.0.0/24 that leave through any interface other than <code>br0</code>: rewrite their source to the outgoing interface's address." Now example.com answers with HTTP 200, and the rule's counters show the two connections it rewrote (DNS and HTTP). The kernel remembers each rewritten connection in its <em>connection tracking</em> table so replies are translated back. This is the same rule Docker installs for <code>docker0</code> — and on Docker Desktop it happens twice, once in our lab container and once in the VM.</p>

<h3>Publishing a port is destination NAT</h3>
<p><code>docker run -p 8080:8000</code> means "connections to the host's port 8080 go to the container's port 8000". That is a <strong>DNAT</strong> rule: rewrite the destination before routing.</p>
${run('c125-net', 'ME=$(hostname -i)', 4)}
<p>Two rules, because packets arrive two ways: from another machine they pass the <code>PREROUTING</code> chain; from a process on this same host they pass <code>OUTPUT</code>. Either way the connection to 172.17.0.4:8080 reaches the Python server in c2 on 10.12.0.3:8000. Docker writes rules of this shape into its own <code>DOCKER</code> chain for every <code>-p</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>"ufw says port 5432 is closed, but the database answers from the Internet."</strong> A published port is a DNAT in <code>PREROUTING</code>: the packet is redirected to the container <em>before</em> the host's INPUT rules — where ufw and most simple firewalls live — ever see it, and it is then <em>forwarded</em>, not delivered locally. So <code>docker run -p 5432:5432 postgres</code> on a VPS with <code>ufw deny 5432</code> is still reachable from everywhere. Publish internal services on loopback only (<code>-p 127.0.0.1:5432:5432</code>), or do not publish them at all and let containers talk over a Docker network; filter forwarded traffic in the <code>DOCKER-USER</code> chain if you must. Check from <em>outside</em> the server, never by reading the firewall config.</p>
</div>

<h3>Plug the hand-made container into the bridge</h3>
<p>The mini container of lesson 12.4 has only <code>lo</code>. A network namespace can be addressed by the PID of any process inside it, which is exactly how runtimes wire a container: create the veth, move one end into the namespace of the container's PID 1, configure it from inside.</p>
${run('c125-net', './mini-container.sh box3 sleep 300 &', 6)}
<p>box3 got 10.12.0.4, reached the server in c2 and, through the MASQUERADE rule, example.com. We also had to give it a <code>/etc/resolv.conf</code> — Docker does the same: it bind-mounts a generated <code>resolv.conf</code>, <code>hosts</code> and <code>hostname</code> into every container (you will see those mounts in its <code>config.json</code> in lesson 12.6).</p>
${run('c125-net', 'kill -KILL $P $SRV', 2)}
<p>When box3's PID 1 died, its network namespace died with it, and the kernel destroyed both ends of its veth: <code>veth-b3</code> vanished from the bridge on its own. Deleting <code>c1</code>, <code>c2</code> and <code>br0</code> leaves the lab exactly as it was.</p>

<h3>What a hop costs</h3>
${run('c125-net', 'ping -c 500', 2)}
<p>500 pings each: the fastest round trip is 1–2 µs both on loopback and through veth + bridge; the averages (154 µs and 15 µs) are dominated by scheduling noise of the VM — note the 54 ms outlier on loopback in this run. The conclusion is robust anyway: a veth and a bridge cost microseconds, a thousand times less than the ~0.5 ms of a real network round trip inside a data centre. Container networking is not where your latency goes; DNS lookups, TLS handshakes and connection setup are.</p>
${lab('latency', 'default', 'en', 'Place the measured hop on the ladder: a veth + bridge round trip (microseconds) sits far below a same-datacentre network round trip and a cross-continent one.', { tour: 'latency-start' })}

<h3>🧪 Practice (25–30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> after a teammate "hardened" a VPS, every container lost Internet access: <code>apt-get</code> and calls to a payment API time out, while containers can still reach each other.</p>
<ol>
<li>In a <code>--privileged</code> lab container (install <code>iptables</code> with apt), rebuild c1, c2, br0 and the MASQUERADE rule; confirm that <code>curl example.com</code> works from c1.</li>
<li>Break it two ways, one at a time: <code>sysctl -w net.ipv4.ip_forward=0</code>; then restore it and delete the MASQUERADE rule (<code>iptables -t nat -D POSTROUTING …</code>).</li>
<li>For each break, diagnose from c1 step by step: <code>ip route</code>, <code>ping 10.12.0.1</code>, <code>ping</code> an outside IP, a DNS lookup — and read the rule counters with <code>iptables -t nat -L -n -v</code>.</li>
<li>Add a published port with DNAT and test it from the lab itself (<code>OUTPUT</code> chain) and from another throwaway container on the same Docker network (<code>PREROUTING</code>).</li>
</ol>
<p><strong>Done when:</strong> you can name, for each break, the first command that fails and the counter that stops moving, and write the two lines that fix it.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['veth pair', 'A virtual Ethernet cable: two interfaces, what goes in one comes out of the other; one end per network namespace.'],
  ['bridge', 'A software Ethernet switch in the kernel (docker0, br0); learns MAC addresses per port (bridge fdb).'],
  ['ip_forward', 'Kernel switch that lets a namespace route packets between its interfaces.'],
  ['MASQUERADE (SNAT)', 'Rewrites the private source address of outgoing packets to the outgoing interface’s address.'],
  ['DNAT', 'Rewrites the destination of incoming packets — how -p HOST:CONTAINER publishes a port.'],
  ['conntrack', 'The kernel table of tracked connections, so replies to NATed packets are translated back.'],
  ['DOCKER-USER chain', 'The iptables chain Docker leaves for your own rules on forwarded (published-port) traffic.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A container’s <code>eth0</code> is one end of a veth pair; the other end is plugged into a bridge on the host (<code>docker0</code>).</li>
<li>Containers on one bridge reach each other directly; the bridge learns MACs like a switch.</li>
<li>Reaching the Internet needs forwarding plus MASQUERADE; publishing a port is a DNAT rule (PREROUTING + OUTPUT).</li>
<li>Runtimes wire a container through the network namespace of its PID; when the namespace dies, its veth dies too.</li>
<li>Published ports bypass host INPUT firewalls such as ufw — bind internal services to 127.0.0.1 and test from outside.</li>
</ul>
${L('https://man7.org/linux/man-pages/man4/veth.4.html', '📄', 'man 4 veth', 'Virtual Ethernet pairs and moving one end into another namespace.', 'Open')}
${L('https://docs.docker.com/engine/network/drivers/bridge/', '📄', 'Docker bridge network driver', 'What docker0 is, published ports, and the packet-filtering notes.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.5</span>
<h2>Mạng container bằng tay</h2>
<p class="lead">Ở bài 12.1, một network namespace mới chỉ có một interface, <code>lo</code>, và không lối ra — một cái máy bị rút dây mạng. Vậy mà container Docker nào cũng nói chuyện được với hàng xóm, ra được Internet và nhận kết nối qua một cổng publish. Câu hỏi: <strong>những đối tượng nào của nhân chở một gói tin từ container này sang container kia, ra Internet, và từ <code>-p 8080:8000</code> đi ngược vào — và ta có tự dựng chúng bằng <code>ip</code> và <code>iptables</code> được không?</strong> Ta dựng lại mạng "bridge" mặc định của Docker bằng tay, bên trong một container đặc quyền vứt đi, nên mạng của máy chủ không thay đổi gì.</p>

<h3>Docker đã cho container lab này những gì</h3>
${run('c125-net', 'ip -br addr | grep -v NONE', 2)}
<p><code>eth0</code> của container lab có địa chỉ 172.17.0.4/16 và route mặc định qua 172.17.0.1. <code>ip -d link</code> cho thấy bản chất của nó: một <strong>veth</strong> — một đầu của một sợi cáp ảo — mà đầu kia nằm ở network namespace khác (<code>link-netnsid 0</code>, ở đây là máy ảo Docker, nơi nó được cắm vào bridge <code>docker0</code> có địa chỉ 172.17.0.1). Hậu tố <code>@if1229</code> là chỉ số interface của đầu bên kia. Thiết kế chỉ có vậy: một namespace, một sợi cáp ảo, một công tắc ảo, và định tuyến. Ta tự làm một bộ.</p>

<h3>Hai container, một công tắc, hai sợi cáp</h3>
${run('c125-net', 'ip netns add c1', 3)}
<p>Hai network namespace có tên <code>c1</code> và <code>c2</code> đóng vai container. <code>br0</code> là một <strong>bridge</strong>: một công tắc Ethernet bằng phần mềm trong nhân, có địa chỉ riêng (10.12.0.1) để làm luôn cổng ra (gateway) cho các container. Với mỗi container, <code>ip link add … type veth peer name eth0 netns cN</code> tạo một sợi cáp mà một đầu đi vào container (tên <code>eth0</code>, như Docker đặt) còn đầu kia, <code>veth-cN</code>, cắm vào bridge. Rồi đặt địa chỉ, bật link, và route mặc định qua bridge:</p>
${run('c125-net', 'ip -br link show master br0', 2)}

<h3>Container tới container</h3>
${run('c125-net', 'ip netns exec c1 ping', 4)}
<p>Ping và HTTP giữa hai namespace đi qua bridge. <code>bridge fdb</code> cho thấy cách làm: như một công tắc phần cứng, bridge đã <em>học</em> địa chỉ MAC nào nằm sau cổng nào (<code>veth-c1</code>, <code>veth-c2</code>) và chỉ chuyển khung tin tới đúng đó. Container Docker trên cùng một mạng nói chuyện y như vậy; Docker thêm một máy chủ DNS nhỏ để chúng gọi nhau bằng tên thay vì địa chỉ.</p>

<h3>Ra Internet: chuyển tiếp và masquerade</h3>
${run('c125-net', 'ip netns exec c1 curl -sS -m 4', 2)}
<p>c1 có route tới bridge, nhưng không xa hơn: ngay cả máy chủ DNS (địa chỉ nằm ngoài 10.12.0.0/24) cũng không tới được, nên <code>curl</code> hết giờ khi phân giải tên (mã 28). Cần hai thứ. Nhân phải <strong>chuyển tiếp</strong> gói tin giữa các interface — <code>ip_forward</code> đã là 1 trong namespace này. Và địa chỉ nguồn riêng 10.12.0.2 phải được thay bằng một địa chỉ mà thế giới bên ngoài trả lời được: <strong>NAT nguồn</strong>, mà iptables gọi là <code>MASQUERADE</code>:</p>
${run('c125-net', 'iptables -t nat -A POSTROUTING', 3)}
<p>"Gói tin từ 10.12.0.0/24 đi ra qua bất kỳ interface nào khác <code>br0</code>: đổi địa chỉ nguồn thành địa chỉ của interface đi ra." Giờ example.com trả HTTP 200, và bộ đếm của luật cho thấy hai kết nối nó đã đổi (DNS và HTTP). Nhân nhớ từng kết nối đã đổi trong bảng <em>connection tracking</em> để gói trả lời được đổi ngược lại. Đây chính là luật Docker cài cho <code>docker0</code> — và trên Docker Desktop nó xảy ra hai lần, một lần trong container lab và một lần trong máy ảo.</p>

<h3>Publish một cổng là NAT đích</h3>
<p><code>docker run -p 8080:8000</code> nghĩa là "kết nối tới cổng 8080 của máy chủ đi tới cổng 8000 của container". Đó là một luật <strong>DNAT</strong>: đổi địa chỉ đích trước khi định tuyến.</p>
${run('c125-net', 'ME=$(hostname -i)', 4)}
<p>Hai luật, vì gói tin tới theo hai đường: từ máy khác nó đi qua chuỗi <code>PREROUTING</code>; từ một tiến trình trên chính máy này nó đi qua <code>OUTPUT</code>. Đường nào thì kết nối tới 172.17.0.4:8080 cũng tới được máy chủ Python trong c2 ở 10.12.0.3:8000. Docker ghi các luật đúng dạng này vào chuỗi <code>DOCKER</code> riêng của nó cho mỗi <code>-p</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>"ufw nói cổng 5432 đã đóng, vậy mà cơ sở dữ liệu vẫn trả lời từ Internet."</strong> Một cổng publish là một DNAT trong <code>PREROUTING</code>: gói tin bị chuyển hướng tới container <em>trước khi</em> các luật INPUT của máy chủ — nơi ufw và phần lớn tường lửa đơn giản nằm — kịp thấy nó, và sau đó nó được <em>chuyển tiếp</em> chứ không giao cho máy chủ. Nên <code>docker run -p 5432:5432 postgres</code> trên một VPS có <code>ufw deny 5432</code> vẫn bị truy cập từ khắp nơi. Publish dịch vụ nội bộ chỉ trên loopback (<code>-p 127.0.0.1:5432:5432</code>), hoặc đừng publish và để các container nói chuyện qua một mạng Docker; nếu phải lọc thì lọc lưu lượng chuyển tiếp ở chuỗi <code>DOCKER-USER</code>. Kiểm từ <em>bên ngoài</em> máy chủ, đừng bao giờ kiểm bằng cách đọc cấu hình tường lửa.</p>
</div>

<h3>Cắm container tự làm vào bridge</h3>
<p>Mini container của bài 12.4 chỉ có <code>lo</code>. Một network namespace có thể gọi bằng PID của bất kỳ tiến trình nào bên trong, và đó đúng là cách runtime nối dây cho một container: tạo veth, chuyển một đầu vào namespace của PID 1 trong container, cấu hình nó từ bên trong.</p>
${run('c125-net', './mini-container.sh box3 sleep 300 &', 6)}
<p>box3 nhận 10.12.0.4, tới được máy chủ trong c2 và, nhờ luật MASQUERADE, tới được example.com. Ta còn phải đưa cho nó một <code>/etc/resolv.conf</code> — Docker cũng làm vậy: nó bind mount <code>resolv.conf</code>, <code>hosts</code> và <code>hostname</code> do nó sinh ra vào mọi container (bạn sẽ thấy các mount đó trong <code>config.json</code> của nó ở bài 12.6).</p>
${run('c125-net', 'kill -KILL $P $SRV', 2)}
<p>Khi PID 1 của box3 chết, network namespace của nó chết theo, và nhân huỷ cả hai đầu sợi veth của nó: <code>veth-b3</code> tự biến khỏi bridge. Xoá <code>c1</code>, <code>c2</code> và <code>br0</code> thì lab trở lại y như cũ.</p>

<h3>Một chặng tốn bao nhiêu</h3>
${run('c125-net', 'ping -c 500', 2)}
<p>Mỗi bên 500 lần ping: vòng đi-về nhanh nhất là 1–2 µs cả trên loopback lẫn qua veth + bridge; các giá trị trung bình (154 µs và 15 µs) bị nhiễu lập lịch của máy ảo chi phối — để ý cú vọt 54 ms trên loopback ở lần chạy này. Kết luận vẫn vững: một veth và một bridge tốn vài micro-giây, ít hơn cả nghìn lần ~0,5 ms của một vòng đi-về mạng thật trong cùng trung tâm dữ liệu. Mạng container không phải chỗ độ trễ của bạn đi mất; tra DNS, bắt tay TLS và dựng kết nối mới là chỗ đó.</p>
${lab('latency', 'default', 'vi', 'Đặt chặng vừa đo lên thang: một vòng đi-về qua veth + bridge (micro-giây) nằm rất xa bên dưới một vòng đi-về mạng trong cùng trung tâm dữ liệu và một vòng xuyên lục địa.', { tour: 'latency-start' })}

<h3>🧪 Thực hành (25–30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> sau khi một bạn trong nhóm "siết bảo mật" VPS, mọi container mất Internet: <code>apt-get</code> và lời gọi tới API thanh toán đều hết giờ, trong khi các container vẫn gọi được nhau.</p>
<ol>
<li>Trong một container lab <code>--privileged</code> (cài <code>iptables</code> bằng apt), dựng lại c1, c2, br0 và luật MASQUERADE; xác nhận <code>curl example.com</code> chạy được từ c1.</li>
<li>Làm hỏng theo hai cách, mỗi lần một cách: <code>sysctl -w net.ipv4.ip_forward=0</code>; rồi trả lại và xoá luật MASQUERADE (<code>iptables -t nat -D POSTROUTING …</code>).</li>
<li>Với mỗi kiểu hỏng, chẩn đoán từ c1 theo từng bước: <code>ip route</code>, <code>ping 10.12.0.1</code>, <code>ping</code> một IP bên ngoài, một lần tra DNS — và đọc bộ đếm của luật bằng <code>iptables -t nat -L -n -v</code>.</li>
<li>Thêm một cổng publish bằng DNAT và thử nó từ chính lab (chuỗi <code>OUTPUT</code>) và từ một container vứt đi khác trên cùng mạng Docker (<code>PREROUTING</code>).</li>
</ol>
<p><strong>Đạt khi:</strong> với mỗi kiểu hỏng, bạn gọi tên được lệnh đầu tiên thất bại và bộ đếm ngừng nhảy, và viết được hai dòng sửa nó.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['veth pair (cặp veth)', 'Một sợi cáp Ethernet ảo: hai interface, thứ đi vào đầu này ra ở đầu kia; mỗi đầu một network namespace.'],
  ['bridge (cầu nối)', 'Một công tắc Ethernet bằng phần mềm trong nhân (docker0, br0); học địa chỉ MAC theo từng cổng (bridge fdb).'],
  ['ip_forward', 'Công tắc của nhân cho phép một namespace định tuyến gói tin giữa các interface của nó.'],
  ['MASQUERADE (SNAT)', 'Đổi địa chỉ nguồn riêng của gói đi ra thành địa chỉ của interface đi ra.'],
  ['DNAT', 'Đổi địa chỉ đích của gói đi vào — cách -p MÁY_CHỦ:CONTAINER publish một cổng.'],
  ['conntrack', 'Bảng kết nối được theo dõi trong nhân, để gói trả lời của kết nối đã NAT được đổi ngược lại.'],
  ['chuỗi DOCKER-USER', 'Chuỗi iptables Docker chừa lại cho luật riêng của bạn với lưu lượng chuyển tiếp (cổng publish).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>eth0</code> của container là một đầu của cặp veth; đầu kia cắm vào một bridge trên máy chủ (<code>docker0</code>).</li>
<li>Các container trên cùng bridge tới thẳng được nhau; bridge học MAC như một công tắc.</li>
<li>Ra Internet cần chuyển tiếp cộng MASQUERADE; publish một cổng là một luật DNAT (PREROUTING + OUTPUT).</li>
<li>Runtime nối dây cho container qua network namespace của PID của nó; namespace chết thì veth của nó chết theo.</li>
<li>Cổng publish đi vòng qua tường lửa INPUT của máy chủ như ufw — gắn dịch vụ nội bộ vào 127.0.0.1 và kiểm từ bên ngoài.</li>
</ul>
${L('https://man7.org/linux/man-pages/man4/veth.4.html', '📄', 'man 4 veth', 'Cặp Ethernet ảo và chuyển một đầu sang namespace khác.', 'Mở')}
${L('https://docs.docker.com/engine/network/drivers/bridge/', '📄', 'Docker bridge network driver', 'docker0 là gì, cổng publish, và ghi chú về lọc gói tin.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 12.6 — Docker thật sự chạy gì ───────────────────────── */
    {
      title: '12.6 — What Docker really runs: dockerd, containerd, the shim, runc and an OCI config.json — and why it is not a VM|||12.6 — Docker thật sự chạy gì: dockerd, containerd, shim, runc và config.json OCI — và vì sao đó không phải máy ảo',
      slug: 'os-12-6-runc',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Chuỗi tiến trình thật trong máy ảo Docker: dockerd → containerd → containerd-shim-runc-v2 (cha của PID 1 container) — runc đã thoát; thư mục bundle của shim chứa config.json OCI mà Docker viết (namespaces gồm cả time, mount /etc/hosts|hostname|resolv.conf, seccomp mặc định 380 syscall, 12 đường dẫn bị che, cgroupsPath /docker/<id>). Tự chạy runc 1.5.2 với rootfs Alpine: runc spec (3 capability, không seccomp), run/state/ps/exec/kill/delete, strace thấy đúng unshare 6 cờ + pivot_root(".", ".") như script bài 12.4; runc rootless (root trong = 1001 ngoài). Không phải máy ảo: mọi container cùng nhân 7.0.12-linuxkit; gVisor và Kata ở mức khái niệm.',
      content: `${G126}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.6</span>
<h2>What Docker really runs</h2>
<p class="lead">Our 40-line runtime and Docker do the same kernel work. But <code>docker run</code> starts several programs, writes a JSON file, and leaves a process behind that is neither Docker nor your app. The questions: <strong>which programs run when you type <code>docker run</code>, which one actually calls <code>unshare</code> and <code>pivot_root</code>, who stays the parent of your PID 1, what does the container spec say — and, since every container shares one kernel, in what sense is a container <em>not</em> a virtual machine?</strong> We look at a running Docker container from the VM, then run the same low-level tool Docker uses — <code>runc</code> — by hand.</p>

<h3>The chain of processes</h3>
<p>Start a container with limits, then read the process tree of the Docker VM around it (a <code>--pid=host</code> container that only reads <code>/proc</code>):</p>
${run('c126-host', 'docker run -d --name os-c126-app')}
${run('c126-host', 'docker run --rm --label oslab=1 --name os-c126-vm --pid=host --privileged os-lab sh -c "S=')}
<p>Four programs, and one of them is missing on purpose:</p>
<ol>
<li><code>docker</code> (the CLI on your Mac) sends an HTTP request to <strong>dockerd</strong> over <code>/var/run/docker.sock</code>. dockerd handles images, networks, volumes and the API — and builds the container's spec.</li>
<li>dockerd asks <strong>containerd</strong> (over gRPC) to create and start the container. containerd manages snapshots (the overlay layers of 12.3) and tasks.</li>
<li>containerd starts one <strong>containerd-shim-runc-v2</strong> per container. Its parent is PID 1, not containerd: it is deliberately detached.</li>
<li>The shim runs <strong>runc</strong>, which does the kernel work — namespaces, cgroup, pivot_root — then <code>exec</code>s your program and <em>exits</em>. That is why there is no runc in the list: your <code>sleep</code> (PID 72724) is the shim's child.</li>
</ol>
<p>Why the shim? Someone must be the parent of your PID 1 to collect its exit code, hold its stdin/stdout for <code>docker logs</code>, and reap it. If that were containerd or dockerd, restarting or upgrading them would kill every container on the machine. With the shim in between, the daemons can restart while containers keep running (Docker's <code>live-restore</code>).</p>
${lab('process', 'shell', 'en', 'The same pattern one level down: a parent forks, the child execs the real program, the parent waits for its exit status — the shim plays the parent, runc the short-lived child that execs your app.', { tour: 'process-shell' })}

<h3>The bundle and the OCI spec Docker wrote</h3>
<p>The shim's working directory is the container's <strong>bundle</strong>: a <code>rootfs</code> and a <code>config.json</code> in the format of the Open Container Initiative (OCI) runtime specification. Every runtime that speaks OCI — runc, crun, gVisor's runsc, Kata — takes exactly this input.</p>
${run('c126-host', "docker run --rm --label oslab=1 --name os-c126-vm --pid=host --privileged os-lab sh -c \"S=\\$(ps -o ppid= -p $P | tr -d ' '); readlink")}
${src('ch12/ocisum.py', 'python')}
${run('c126-host', 'docker run --rm --label oslab=1 --name os-c126-vm --pid=host --privileged -v')}
${run('c126-host', "docker inspect -f 'Pid=")}
<p>Everything this chapter built by hand is in that file. <code>process.args</code> is the image's <code>ENTRYPOINT</code> + <code>CMD</code>; the root is the overlay mount, read-only because we passed <code>--read-only</code>; the hostname is the container ID; seven namespaces (Docker 29 also creates a <code>time</code> namespace); the mounts include <code>/etc/hostname</code>, <code>/etc/hosts</code> and <code>/etc/resolv.conf</code>, which Docker generates and bind-mounts over the init-layer placeholders of 12.3 (and which we had to write by hand for box3 in 12.5); <strong>0 capabilities</strong> because of <code>--cap-drop ALL</code> (a default container keeps 14 — lesson 13.4); resources that match the flags (128 MiB, 50000/100000, 64 PIDs) and the cgroup path <code>/docker/&lt;id&gt;</code>; a seccomp profile whose default action is <code>ERRNO</code> with rules naming 380 allowed syscalls (lesson 11.4); and 12 masked + 5 read-only paths under <code>/proc</code> and <code>/sys</code>.</p>

<h3>runc by hand: the same rootfs, the same spec format</h3>
<p>runc is a single static binary. We downloaded release 1.5.2 for arm64 from GitHub (checksum verified) into the throwaway lab, unpacked the Alpine tar as the bundle's <code>rootfs</code>, and asked runc for its default spec:</p>
${run('c126-runc', 'install -m 755', 3)}
<p>Compare with Docker's file: runc's own default keeps only 3 capabilities, has <strong>no seccomp filter</strong>, no resource limits and sets <code>noNewPrivileges</code>. A small script (<code>ocifix.py</code>) then puts in a command, a hostname and the same limits as our mini container, and runc runs it:</p>
${run('c126-runc', 'python3 /lab/ch12/ocifix.py config.json \'hostname', 2)}
<p>Hostname <code>oci-box</code>, PID 1, <code>CapEff 0000000020000420</code> (bits 5, 10, 29: <code>KILL</code>, <code>NET_BIND_SERVICE</code>, <code>AUDIT_WRITE</code>), <code>NoNewPrivs 1</code>, no seccomp, 64 MiB and 32 PIDs. The lifecycle commands are the ones the shim uses:</p>
${run('c126-runc', "python3 /lab/ch12/ocifix.py config.json 'sleep 300'", 5)}
<p>Notice <code>runc ps</code>: the container's PID 1 has <strong>PPID 1</strong>. <code>runc run -d</code> created the container and exited, so the orphan was adopted by the lab's own PID 1 (lesson 1.4). Nobody is holding its stdout or waiting for its exit code — exactly the job the shim takes on in Docker. <code>runc kill</code> then <code>runc delete</code> remove it; the cgroup <code>/oci-box</code> it created is gone with it.</p>

<h3>strace runc: the syscalls of our 40-line script</h3>
${run('c126-runc', 'strace -f -qq', 3)}
<p>Under all the Go code, the kernel sees the same requests our <code>mini-container.sh</code> made: one <code>unshare</code> with six namespace flags, <code>pivot_root(".", ".")</code> — the idiom from <code>man 2 pivot_root</code> — <code>sethostname</code>, and finally <code>execve</code> of the container's program. The 20 <code>clone</code> calls are runc's own threads and the child processes it uses to step into the namespaces safely.</p>

<div class="pitfall co-tieu-de">
<p><strong>The security defaults live in the spec, not in the kernel.</strong> Docker's <code>config.json</code> has a seccomp profile, a dropped capability set and masked <code>/proc</code> paths because <em>dockerd wrote them there</em>. runc's own default spec has no seccomp at all. Anything that builds the spec differently — <code>--privileged</code>, <code>security_opt: [seccomp=unconfined]</code> in a Compose file, a CI runner that calls runc or containerd directly, a Kubernetes pod without <code>seccompProfile: RuntimeDefault</code> — silently runs without those fences. Read the effective spec (as above, or <code>docker inspect</code>, or <code>/proc/PID/status</code> inside: <code>Seccomp</code>, <code>CapEff</code>) instead of assuming "containers are sandboxed".</p>
</div>

<h3>Rootless: runc as an ordinary user</h3>
${run('c126-runc', 'mkdir -p /srv/rl', 4)}
<p><code>runc spec --rootless</code> adds a <strong>user namespace</strong> (UID 0 inside = <code>dev</code>, 1001, outside — the mapping of lesson 12.1) and drops the network namespace, because an unprivileged user cannot create the veth and bridge of 12.5. The process is root inside, writes <code>/etc/x</code>, and on the host that file belongs to 1001. Rootless Docker and Podman are this plus: the daemon itself runs as your user, a user-mode network stack (slirp4netns or pasta) replaces veth + bridge, cgroup limits work only where systemd delegates a cgroup subtree to the user, and ports below 1024 need a sysctl. A container escape then lands as an ordinary user, not as root — the strongest single hardening step for shared machines (lesson 13.4).</p>

<h3>Not a virtual machine: one kernel for everyone</h3>
${run('c126-host', 'uname -sr', 3)}
<p>The Mac runs Darwin. Docker Desktop runs a Linux VM (kernel 7.0.12-linuxkit), and <em>every</em> container — Alpine, Ubuntu — reports that same kernel, because a container is a process of that kernel. That is the whole difference from a VM, which boots its own kernel on virtual hardware. It is also why Docker Desktop needs a VM on macOS and Windows: their kernels have no Linux namespaces or cgroups. On a Linux VPS there is no extra VM: containers are processes of the server's kernel.</p>
<table>
<tr><th></th><th>container (runc)</th><th>gVisor (runsc)</th><th>Kata Containers</th><th>virtual machine</th></tr>
<tr><td>kernel the app talks to</td><td>the host kernel</td><td>a user-space kernel (the Sentry) that intercepts syscalls</td><td>a guest kernel in a light VM per pod</td><td>its own guest kernel</td></tr>
<tr><td>isolation boundary</td><td>namespaces, cgroups, caps, seccomp</td><td>gVisor's kernel + a small set of host syscalls</td><td>hardware virtualisation</td><td>hardware virtualisation</td></tr>
<tr><td>a host-kernel bug</td><td>reachable from every container</td><td>much smaller surface</td><td>needs a VM escape</td><td>needs a VM escape</td></tr>
<tr><td>cost</td><td>almost none</td><td>slower for syscall-heavy work</td><td>a VM boot, more memory</td><td>most</td></tr>
<tr><td>how you choose it</td><td>default</td><td><code>--runtime=runsc</code> (an OCI runtime)</td><td>a containerd shim (Kubernetes RuntimeClass)</td><td>—</td></tr>
</table>
<p>(The gVisor and Kata rows are from their documentation, not measured in this lab.) Because they all accept the same OCI bundle, swapping the isolation level is a configuration change, not a rewrite: multi-tenant platforms run untrusted code under gVisor or Kata and their own services under plain runc.</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a security review of your team's deployment asks: "List exactly what the backend container runs with — namespaces, capabilities, seccomp, limits, mounts — from the system, not from the Compose file."</p>
<ol>
<li>Start a container from your own image with the flags your team uses. From a <code>--pid=host</code> lab container, find its shim (<code>ps -o ppid= -p PID</code>) and print the bundle directory.</li>
<li>Summarise its <code>config.json</code> with <code>ocisum.py</code>; run it again with no flags and with <code>--privileged</code>, and write down what changes (capabilities, seccomp, masked paths).</li>
<li>In a privileged lab, run the Alpine bundle with runc, add a limit to <code>config.json</code> by hand, and confirm it in <code>/sys/fs/cgroup</code> inside.</li>
<li>Repeat as the user <code>dev</code> with <code>runc spec --rootless</code> and show the owner of a file written by "root" inside.</li>
</ol>
<p><strong>Done when:</strong> you have a short table "default vs our flags vs --privileged" filled from real <code>config.json</code> files, and can explain who the parent of your container's PID 1 is and why it is not dockerd.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['dockerd', 'The Docker daemon: API, images, networks, volumes; builds the OCI spec and hands it to containerd.'],
  ['containerd', 'The container supervisor: snapshots (layers), tasks, and one shim per container.'],
  ['containerd-shim-runc-v2', 'The per-container parent of PID 1: keeps stdio, reaps it, reports the exit code; lets daemons restart.'],
  ['runc', 'The reference OCI runtime: reads config.json, does namespaces/cgroups/pivot_root, execs the program, exits.'],
  ['OCI bundle / config.json', 'A rootfs plus a JSON spec (process, root, mounts, namespaces, resources, capabilities, seccomp).'],
  ['rootless container', 'Runtime and daemon run as an ordinary user inside a user namespace; root inside maps to that user.'],
  ['gVisor / Kata', 'OCI runtimes with a stronger boundary: a user-space kernel (gVisor) or a lightweight VM per pod (Kata).'],
])}

<h3>📌 Summary</h3>
<ul>
<li><code>docker run</code> → dockerd → containerd → a shim per container → runc, which sets up the kernel objects, execs your program and exits.</li>
<li>The shim stays as the parent of PID 1, so daemons can restart without killing containers.</li>
<li>Everything about a container is in its OCI <code>config.json</code>: namespaces, mounts, limits, capabilities, seccomp, masked paths.</li>
<li>runc does the same syscalls as our script: <code>unshare</code>, <code>pivot_root(".", ".")</code>, <code>sethostname</code>, <code>execve</code>; security defaults come from whoever writes the spec.</li>
<li>All containers share the host kernel; gVisor and Kata trade speed for a stronger boundary behind the same OCI interface.</li>
</ul>
${L('https://github.com/opencontainers/runtime-spec/blob/main/config.md', '📄', 'OCI runtime spec — config.json', 'Every field of the file Docker writes and runc reads.', 'Open')}
${L('https://docs.docker.com/engine/security/rootless/', '📄', 'Rootless mode (Docker docs)', 'Running the daemon and containers as a non-root user, and its limits.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.6</span>
<h2>Docker thật sự chạy gì</h2>
<p class="lead">Runtime 40 dòng của ta và Docker làm cùng một việc với nhân. Nhưng <code>docker run</code> khởi động mấy chương trình, viết một file JSON, và để lại một tiến trình chẳng phải Docker cũng chẳng phải ứng dụng của bạn. Các câu hỏi: <strong>những chương trình nào chạy khi bạn gõ <code>docker run</code>, cái nào thật sự gọi <code>unshare</code> và <code>pivot_root</code>, ai ở lại làm cha của PID 1, bản đặc tả container ghi gì — và, vì mọi container dùng chung một nhân, container <em>không</em> phải máy ảo theo nghĩa nào?</strong> Ta nhìn một container Docker đang chạy từ máy ảo, rồi tự tay chạy chính công cụ cấp thấp mà Docker dùng — <code>runc</code>.</p>

<h3>Chuỗi tiến trình</h3>
<p>Khởi động một container có giới hạn, rồi đọc cây tiến trình của máy ảo Docker quanh nó (một container <code>--pid=host</code> chỉ đọc <code>/proc</code>):</p>
${run('c126-host', 'docker run -d --name os-c126-app')}
${run('c126-host', 'docker run --rm --label oslab=1 --name os-c126-vm --pid=host --privileged os-lab sh -c "S=')}
<p>Bốn chương trình, và một cái vắng mặt có chủ đích:</p>
<ol>
<li><code>docker</code> (CLI trên máy Mac) gửi một request HTTP tới <strong>dockerd</strong> qua <code>/var/run/docker.sock</code>. dockerd lo ảnh, mạng, volume và API — và dựng bản đặc tả của container.</li>
<li>dockerd nhờ <strong>containerd</strong> (qua gRPC) tạo và khởi động container. containerd quản lý snapshot (các lớp overlay của 12.3) và task.</li>
<li>containerd khởi động một <strong>containerd-shim-runc-v2</strong> cho mỗi container. Cha của nó là PID 1, không phải containerd: nó được tách ra có chủ đích.</li>
<li>Shim chạy <strong>runc</strong>, chương trình làm việc với nhân — namespace, cgroup, pivot_root — rồi <code>exec</code> chương trình của bạn và <em>thoát</em>. Vì thế danh sách không có runc: <code>sleep</code> của bạn (PID 72724) là con của shim.</li>
</ol>
<p>Vì sao cần shim? Phải có ai làm cha PID 1 của bạn để nhận mã thoát, giữ stdin/stdout cho <code>docker logs</code>, và dọn nó. Nếu đó là containerd hay dockerd, khởi động lại hay nâng cấp chúng sẽ giết mọi container trên máy. Có shim ở giữa, các daemon khởi động lại được trong khi container vẫn chạy (<code>live-restore</code> của Docker).</p>
${lab('process', 'shell', 'vi', 'Cùng một khuôn ở tầng thấp hơn: cha fork, con exec chương trình thật, cha chờ mã thoát — shim đóng vai cha, runc là đứa con sống ngắn ngủi exec ứng dụng của bạn.', { tour: 'process-shell' })}

<h3>Bundle và đặc tả OCI do Docker viết</h3>
<p>Thư mục làm việc của shim là <strong>bundle</strong> của container: một <code>rootfs</code> và một <code>config.json</code> theo định dạng đặc tả runtime của Open Container Initiative (OCI). Mọi runtime nói chuyện bằng OCI — runc, crun, runsc của gVisor, Kata — đều nhận đúng đầu vào này.</p>
${run('c126-host', "docker run --rm --label oslab=1 --name os-c126-vm --pid=host --privileged os-lab sh -c \"S=\\$(ps -o ppid= -p $P | tr -d ' '); readlink")}
${src('ch12/ocisum.py', 'python')}
${run('c126-host', 'docker run --rm --label oslab=1 --name os-c126-vm --pid=host --privileged -v')}
${run('c126-host', "docker inspect -f 'Pid=")}
<p>Mọi thứ chương này dựng bằng tay đều có trong file đó. <code>process.args</code> là <code>ENTRYPOINT</code> + <code>CMD</code> của ảnh; gốc là mount overlay, chỉ-đọc vì ta truyền <code>--read-only</code>; hostname là ID container; bảy namespace (Docker 29 tạo thêm cả <code>time</code> namespace); các mount gồm <code>/etc/hostname</code>, <code>/etc/hosts</code> và <code>/etc/resolv.conf</code>, do Docker sinh ra và bind mount đè lên các chỗ giữ chỗ của lớp init ở 12.3 (và là thứ ta phải tự ghi cho box3 ở 12.5); <strong>0 capability</strong> vì <code>--cap-drop ALL</code> (container mặc định giữ 14 — bài 13.4); tài nguyên khớp với cờ (128 MiB, 50000/100000, 64 PID) và đường dẫn cgroup <code>/docker/&lt;id&gt;</code>; một hồ sơ seccomp có hành động mặc định <code>ERRNO</code> với các luật liệt kê 380 syscall được phép (bài 11.4); và 12 đường dẫn bị che + 5 đường dẫn chỉ-đọc dưới <code>/proc</code> và <code>/sys</code>.</p>

<h3>Tự chạy runc: cùng rootfs, cùng định dạng đặc tả</h3>
<p>runc là một tệp chạy tĩnh duy nhất. Ta tải bản 1.5.2 cho arm64 từ GitHub (đã kiểm mã băm) vào lab vứt đi, giải nén tar Alpine làm <code>rootfs</code> của bundle, và xin runc bản đặc tả mặc định:</p>
${run('c126-runc', 'install -m 755', 3)}
<p>So với file của Docker: bản mặc định của runc chỉ giữ 3 capability, <strong>không có bộ lọc seccomp</strong>, không giới hạn tài nguyên và bật <code>noNewPrivileges</code>. Một script nhỏ (<code>ocifix.py</code>) đặt vào một lệnh, một hostname và cùng các giới hạn như mini container của ta, rồi runc chạy nó:</p>
${run('c126-runc', 'python3 /lab/ch12/ocifix.py config.json \'hostname', 2)}
<p>Hostname <code>oci-box</code>, PID 1, <code>CapEff 0000000020000420</code> (bit 5, 10, 29: <code>KILL</code>, <code>NET_BIND_SERVICE</code>, <code>AUDIT_WRITE</code>), <code>NoNewPrivs 1</code>, không seccomp, 64 MiB và 32 PID. Các lệnh vòng đời chính là những lệnh shim dùng:</p>
${run('c126-runc', "python3 /lab/ch12/ocifix.py config.json 'sleep 300'", 5)}
<p>Để ý <code>runc ps</code>: PID 1 của container có <strong>PPID 1</strong>. <code>runc run -d</code> tạo container rồi thoát, nên đứa mồ côi được PID 1 của chính lab nhận nuôi (bài 1.4). Chẳng ai giữ stdout của nó hay chờ mã thoát của nó — đúng phần việc shim đảm nhận trong Docker. <code>runc kill</code> rồi <code>runc delete</code> gỡ nó đi; cgroup <code>/oci-box</code> nó tạo cũng biến theo.</p>

<h3>strace runc: những syscall của script 40 dòng</h3>
${run('c126-runc', 'strace -f -qq', 3)}
<p>Dưới tất cả mã Go, nhân thấy đúng những yêu cầu mà <code>mini-container.sh</code> của ta đã gửi: một <code>unshare</code> với sáu cờ namespace, <code>pivot_root(".", ".")</code> — đúng mẹo trong <code>man 2 pivot_root</code> — <code>sethostname</code>, và cuối cùng <code>execve</code> chương trình của container. 20 lời gọi <code>clone</code> là các luồng của chính runc và những tiến trình con nó dùng để bước vào các namespace một cách an toàn.</p>

<div class="pitfall co-tieu-de">
<p><strong>Mặc định bảo mật nằm trong bản đặc tả, không nằm trong nhân.</strong> <code>config.json</code> của Docker có hồ sơ seccomp, tập capability đã cắt và các đường dẫn <code>/proc</code> bị che vì <em>dockerd đã viết chúng vào đó</em>. Bản đặc tả mặc định của chính runc không có seccomp nào. Bất cứ thứ gì dựng bản đặc tả khác đi — <code>--privileged</code>, <code>security_opt: [seccomp=unconfined]</code> trong file Compose, một CI runner gọi thẳng runc hay containerd, một pod Kubernetes thiếu <code>seccompProfile: RuntimeDefault</code> — đều lặng lẽ chạy mà không có những hàng rào đó. Hãy đọc bản đặc tả đang hiệu lực (như trên, hoặc <code>docker inspect</code>, hoặc <code>/proc/PID/status</code> bên trong: <code>Seccomp</code>, <code>CapEff</code>) thay vì tin rằng "container thì được cách ly".</p>
</div>

<h3>Rootless: runc với một người dùng thường</h3>
${run('c126-runc', 'mkdir -p /srv/rl', 4)}
<p><code>runc spec --rootless</code> thêm một <strong>user namespace</strong> (UID 0 bên trong = <code>dev</code>, 1001, bên ngoài — ánh xạ của bài 12.1) và bỏ network namespace, vì người dùng thường không tạo được veth và bridge của 12.5. Tiến trình là root bên trong, ghi <code>/etc/x</code>, và trên máy chủ file đó thuộc về 1001. Docker rootless và Podman là chừng đó cộng thêm: bản thân daemon chạy bằng người dùng của bạn, một chồng mạng chạy ở chế độ người dùng (slirp4netns hoặc pasta) thay cho veth + bridge, giới hạn cgroup chỉ chạy được khi systemd uỷ quyền một cây cgroup con cho người dùng, và cổng dưới 1024 cần một sysctl. Một vụ thoát container khi đó chỉ rơi vào một người dùng thường, không phải root — bước cứng hoá đơn lẻ mạnh nhất cho máy dùng chung (bài 13.4).</p>

<h3>Không phải máy ảo: mọi người dùng chung một nhân</h3>
${run('c126-host', 'uname -sr', 3)}
<p>Máy Mac chạy Darwin. Docker Desktop chạy một máy ảo Linux (nhân 7.0.12-linuxkit), và <em>mọi</em> container — Alpine, Ubuntu — đều báo đúng nhân đó, vì container là một tiến trình của nhân đó. Đó là toàn bộ khác biệt với máy ảo, thứ khởi động nhân riêng của nó trên phần cứng ảo. Đó cũng là lý do Docker Desktop cần một máy ảo trên macOS và Windows: nhân của chúng không có namespace hay cgroup của Linux. Trên một VPS Linux thì không có máy ảo thêm nào: container là tiến trình của nhân máy chủ.</p>
<table>
<tr><th></th><th>container (runc)</th><th>gVisor (runsc)</th><th>Kata Containers</th><th>máy ảo</th></tr>
<tr><td>ứng dụng nói chuyện với nhân nào</td><td>nhân máy chủ</td><td>một nhân chạy ở chế độ người dùng (Sentry) chặn các syscall</td><td>một nhân khách trong một máy ảo nhẹ cho mỗi pod</td><td>nhân khách riêng</td></tr>
<tr><td>ranh giới cách ly</td><td>namespace, cgroup, capabilities, seccomp</td><td>nhân của gVisor + một nhúm syscall của máy chủ</td><td>ảo hoá phần cứng</td><td>ảo hoá phần cứng</td></tr>
<tr><td>một lỗi của nhân máy chủ</td><td>container nào cũng với tới</td><td>bề mặt nhỏ hơn nhiều</td><td>cần thoát máy ảo</td><td>cần thoát máy ảo</td></tr>
<tr><td>chi phí</td><td>gần như không</td><td>chậm hơn với việc gọi nhiều syscall</td><td>khởi động một máy ảo, tốn bộ nhớ hơn</td><td>nhiều nhất</td></tr>
<tr><td>chọn bằng cách nào</td><td>mặc định</td><td><code>--runtime=runsc</code> (một OCI runtime)</td><td>một containerd shim (RuntimeClass của Kubernetes)</td><td>—</td></tr>
</table>
<p>(Hàng gVisor và Kata lấy từ tài liệu của họ, không đo trong lab này.) Vì tất cả đều nhận cùng một bundle OCI, đổi mức cách ly là đổi cấu hình, không phải viết lại: các nền tảng nhiều khách hàng chạy mã không tin cậy dưới gVisor hay Kata và dịch vụ của chính họ dưới runc thường.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một buổi review bảo mật hệ thống deploy của nhóm yêu cầu: "Liệt kê chính xác container backend chạy với những gì — namespace, capabilities, seccomp, giới hạn, mount — lấy từ hệ thống, không lấy từ file Compose."</p>
<ol>
<li>Khởi động một container từ ảnh của chính bạn với các cờ nhóm bạn đang dùng. Từ một container lab <code>--pid=host</code>, tìm shim của nó (<code>ps -o ppid= -p PID</code>) và in thư mục bundle.</li>
<li>Tóm tắt <code>config.json</code> của nó bằng <code>ocisum.py</code>; chạy lại không cờ nào và với <code>--privileged</code>, ghi lại những gì thay đổi (capabilities, seccomp, đường dẫn bị che).</li>
<li>Trong một lab đặc quyền, chạy bundle Alpine bằng runc, tự thêm một giới hạn vào <code>config.json</code> và xác nhận nó trong <code>/sys/fs/cgroup</code> bên trong.</li>
<li>Làm lại với người dùng <code>dev</code> và <code>runc spec --rootless</code>, cho thấy chủ sở hữu của một file do "root" bên trong ghi ra.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một bảng ngắn "mặc định vs cờ của nhóm vs --privileged" điền từ các file <code>config.json</code> thật, và giải thích được ai là cha của PID 1 trong container của bạn và vì sao đó không phải dockerd.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['dockerd', 'Daemon của Docker: API, ảnh, mạng, volume; dựng bản đặc tả OCI và giao cho containerd.'],
  ['containerd', 'Trình giám sát container: snapshot (các lớp), task, và mỗi container một shim.'],
  ['containerd-shim-runc-v2', 'Cha riêng của PID 1 trong từng container: giữ stdio, dọn nó, báo mã thoát; cho phép daemon khởi động lại.'],
  ['runc', 'OCI runtime tham chiếu: đọc config.json, làm namespace/cgroup/pivot_root, exec chương trình rồi thoát.'],
  ['OCI bundle / config.json', 'Một rootfs cộng một bản đặc tả JSON (process, root, mounts, namespaces, resources, capabilities, seccomp).'],
  ['rootless container (container không root)', 'Runtime và daemon chạy bằng người dùng thường trong một user namespace; root bên trong ánh xạ ra người dùng đó.'],
  ['gVisor / Kata', 'OCI runtime có ranh giới mạnh hơn: một nhân chạy ở chế độ người dùng (gVisor) hoặc một máy ảo nhẹ cho mỗi pod (Kata).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>docker run</code> → dockerd → containerd → mỗi container một shim → runc, chương trình dựng các đối tượng của nhân, exec chương trình của bạn rồi thoát.</li>
<li>Shim ở lại làm cha của PID 1, nên daemon khởi động lại được mà không giết container.</li>
<li>Mọi điều về một container nằm trong <code>config.json</code> OCI của nó: namespace, mount, giới hạn, capabilities, seccomp, đường dẫn bị che.</li>
<li>runc gửi đúng những syscall như script của ta: <code>unshare</code>, <code>pivot_root(".", ".")</code>, <code>sethostname</code>, <code>execve</code>; mặc định bảo mật đến từ bên viết bản đặc tả.</li>
<li>Mọi container dùng chung nhân máy chủ; gVisor và Kata đổi tốc độ lấy ranh giới mạnh hơn, sau cùng một giao diện OCI.</li>
</ul>
${L('https://github.com/opencontainers/runtime-spec/blob/main/config.md', '📄', 'OCI runtime spec — config.json', 'Từng trường của file mà Docker viết và runc đọc.', 'Mở')}
${L('https://docs.docker.com/engine/security/rootless/', '📄', 'Rootless mode (tài liệu Docker)', 'Chạy daemon và container bằng người dùng không phải root, và giới hạn của nó.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 12.7 — Pod và checklist Dockerfile ───────────────────────── */
    {
      title: '12.7 — Pods share namespaces, and a Dockerfile checklist from the OS side — every item measured|||12.7 — Pod là namespace dùng chung, và checklist Dockerfile nhìn từ hệ điều hành — mục nào cũng đo',
      slug: 'os-12-7-pod-dockerfile',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Pod Kubernetes = nhiều container dùng chung namespace quanh một tiến trình "pause": dựng lại bằng --network/--pid/--ipc container: (sidecar gọi 127.0.0.1:8000 được, cùng net/pid/ipc, khác mnt). Checklist Dockerfile đo thật: PID 1 không handler ⇒ docker stop 3,16 s rồi 137, shell form để sh làm PID 1, --init 0,09 s (143), có handler SIGTERM 0,10 s (0); không cờ = không giới hạn; ulimit nofile 1048576 mặc định, Node tự nâng soft lên hard; --read-only + --tmpfs; USER không root (CapEff 0) vẫn mở cổng 80; ảnh mẫu đủ cờ: CapEff 0, NoNewPrivs 1, Seccomp 2, root chỉ-đọc, dừng 0,13 s mã 0.',
      content: `${G127}
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.7</span>
<h2>Pods share namespaces; Dockerfiles from the OS side</h2>
<p class="lead">Two practical consequences of "a container is a process with namespaces and cgroups". First, Kubernetes builds its unit, the <strong>pod</strong>, by letting several containers <em>share</em> some namespaces. Second, most "Dockerfile best practices" are really operating-system facts: who is PID 1, which signal arrives, which limits apply, who owns the files. The questions: <strong>what exactly does a pod share, and which Dockerfile and <code>docker run</code> choices change what the kernel does with your service?</strong> Every item below is measured.</p>

<h3>A pod is containers that share namespaces</h3>
<p>Kubernetes starts a tiny "pause" process first; it does nothing but hold the pod's network and IPC namespaces (and, if you ask, its PID namespace). Every app container of the pod then <em>joins</em> those namespaces. Docker can do the same with <code>--network container:X</code>, <code>--pid container:X</code> and <code>--ipc container:X</code>; an Alpine <code>sleep</code> plays the pause process:</p>
${run('c127-host', 'docker run -d --name os-c127-pause', 5)}
<p>What the measurements show: a third container (the "sidecar") reached the app on <strong>127.0.0.1:8000</strong> — one network namespace, one <code>lo</code>, one IP address and one port space for the whole pod, which is why two containers of one pod cannot both listen on 8000. With the PID namespace shared, the app sees the pause process as PID 1 and itself as PID 7. The namespace table: <code>net</code>, <code>pid</code> and <code>ipc</code> identical; <code>mnt</code> different — each container keeps its own file system — and <code>uts</code> different here because Docker copies the hostname <code>pod-a</code> rather than sharing the namespace (Kubernetes does share UTS). Kubernetes shares the PID namespace only with <code>shareProcessNamespace: true</code>; by default each container keeps its own PID 1.</p>
${lab('nslayers', 'pod', 'en', 'A pod as shared namespaces: switch net, ipc, uts and pid sharing on and off — the sidecar reaches 127.0.0.1:8000 or not, ps shows /pause as PID 1, two containers on port 8000 hit EADDRINUSE, and the pod IP survives an app restart.', { tour: 'nslayers-pod' })}
<p>The pause process exists for the reason of lesson 12.1: a namespace lives while something holds it. If the network namespace belonged to the app container, restarting the app would destroy the pod's IP address. Because pause holds it, app containers can crash and restart while the pod keeps its network identity.</p>

<h3>The checklist, measured</h3>
<table>
<tr><th>item</th><th>what the kernel does</th><th>measured here</th></tr>
<tr><td>1. PID 1 and signals</td><td>PID 1 ignores signals it has no handler for</td><td>no handler: 3.16 s then 137 · <code>--init</code>: 0.09 s · handler: 0.10 s, exit 0</td></tr>
<tr><td>2. resource limits</td><td>none unless the cgroup files are written</td><td><code>memory.max=max pids.max=max</code> without flags</td></tr>
<tr><td>3. ulimits</td><td>RLIMIT_NOFILE is inherited from the runtime</td><td>soft = hard = 1048576 by default</td></tr>
<tr><td>4. read-only root</td><td>the overlay is mounted <code>ro</code></td><td>writes fail with EROFS; <code>--tmpfs /tmp</code> for scratch</td></tr>
<tr><td>5. non-root user</td><td>a UID without capabilities</td><td><code>CapEff 0</code>, can still bind port 80</td></tr>
</table>

<h3>1 — PID 1 and signals</h3>
<p><a href="${OS('os-1-5-pid1')}">Lesson 1.5</a> explained why; here are the four variants side by side, with the same Node server without and with a SIGTERM handler:</p>
${src('ch12/naive.js', 'javascript')}
${src('ch12/server.js', 'javascript')}
${run('c127-host', 'docker run -d --name os-c127-s0')}
${run('c127-host', 'docker run -d --name os-c127-s1')}
${run('c127-host', 'docker run -d --name os-c127-s2')}
${run('c127-host', 'docker run -d --name os-c127-s3')}
${run('c127-host', 'docker run -d --name os-c127-s4')}
<p>No handler: Node is PID 1, SIGTERM is dropped (12.1 showed why), and after the grace period Docker sends SIGKILL — <strong>exit 137</strong>. On this Docker Desktop the grace period was about 3 s (the container has no <code>StopTimeout</code> of its own; Docker documents 10 s by default and Kubernetes waits <code>terminationGracePeriodSeconds</code>, 30 s). <strong>Shell form</strong> (<code>CMD node naive.js</code> becomes <code>sh -c</code>) is the same failure one level up: Ubuntu's <code>dash</code> stays PID 1 and does not forward SIGTERM. (busybox <code>sh</code> on Alpine <code>exec</code>s the last command — lesson 12.4 — so the same Dockerfile behaves differently on different base images: do not rely on it.) <strong><code>--init</code></strong> puts <code>docker-init</code> (tini) as PID 1, which forwards the signal — 0.09 s, exit 143 (128 + 15). A real handler is best: 0.10 s, the log line, <strong>exit 0</strong>, in-flight requests finished.</p>
${lab('process', 'oom137', 'en', 'Where 137 comes from: SIGKILL (9) + 128 — whether it is docker stop giving up or the memory cgroup killing your PID 1.', { tour: 'process-start' })}

<h3>2 — Resource limits</h3>
${run('c127-host', "docker run --rm --label oslab=1 os-lab sh -c 'cd /sys/fs/cgroup")}
<p>Without flags a container may use all the RAM, every CPU and every PID of the machine (lesson 12.2). Set <code>--memory</code>, <code>--cpus</code> and <code>--pids-limit</code> (or <code>deploy.resources.limits</code> in Compose, <code>resources.limits</code> in Kubernetes), and size the runtime inside to match — Node's heap and the JVM's <code>MaxRAMPercentage</code> in <a href="${OS('os-8-5-gioi-han')}">lesson 8.5</a>. Kubernetes can also use <code>memory.high</code> as a soft limit below <code>memory.max</code>, so the kernel throttles and reclaims before it has to kill:</p>
${lab('cgroup', 'high', 'en', 'memory.high below memory.max: the group is slowed down and reclaimed at the soft limit long before the OOM killer would fire at the hard one.', { tour: 'cgroup-start' })}

<h3>3 — ulimits</h3>
${run('c127-host', "docker run --rm --label oslab=1 os-lab bash -c 'echo \"nofile", 2)}
<p>A default container here may open over a million files (<code>RLIMIT_NOFILE</code> soft = hard = 1048576), may start unlimited processes per user (the cgroup <code>pids.max</code> is the real cap) and writes no core dumps. A huge <code>nofile</code> hides descriptor leaks until memory runs out; a tiny one gives "Too many open files" under load (<a href="${OS('os-2-5-mang-fd')}">lesson 2.5</a>). <code>--ulimit nofile=1024:4096</code> sets soft and hard; note that Node raised its own soft limit to the hard one at start-up (its child shell sees 4096), so for Node the <em>hard</em> limit is what counts.</p>
${lab('fdtable', 'emfile', 'en', 'What a small nofile limit looks like from inside: a server leaking one socket per request fills its fd table to 1024 and gets EMFILE (“Too many open files”); raising the limit only delays it.', { tour: 'fdtable-deleted' })}

<h3>4 — A read-only root file system</h3>
${run('c127-host', 'docker run --rm --label oslab=1 --read-only os-lab')}
${run('c127-host', 'docker run --rm --label oslab=1 --read-only --tmpfs')}
<p><code>--read-only</code> mounts the overlay root <code>ro</code>: an attacker or a bug cannot drop files into the image's directories, and nothing silently grows the container layer (the copy-up of 12.3). The app then needs explicit writable places: a <code>--tmpfs /tmp</code> (Docker mounts it <code>noexec,nosuid,nodev</code>) and volumes for real data. Writing a log file inside the container is the classic thing that breaks — log to stdout instead.</p>

<h3>5 — A non-root user</h3>
${run('c127-host', "docker run --rm --label oslab=1 os-lab sh -c 'id -u")}
${run('c127-host', 'docker run --rm --label oslab=1 --user 1001:1001 os-lab')}
<p>Default: UID 0 with 14 capabilities (<code>0xa80425fb</code>). With <code>USER 1001</code> the effective set is empty. And the usual excuse for root — "the app must listen on port 80" — does not apply: Docker sets <code>net.ipv4.ip_unprivileged_port_start = 0</code> inside the container's network namespace, so UID 1001 bound port 80 (the server was still serving when <code>timeout</code> stopped it, exit 124).</p>
${run('c127-host', 'docker run --rm --label oslab=1 --user 1001:1001 -v', 2)}

<div class="pitfall co-tieu-de">
<p><strong>"Permission denied" on a volume after switching to a non-root user.</strong> The kernel checks numbers, not names: a file written by UID 1001 in the container is owned by UID 1001 on a Linux host, and a volume directory created by root is not writable by 1001. Fix ownership at build time (<code>COPY --chown=node:node</code>, <code>RUN chown</code> of the data directory) or with an init step, not by going back to root. (On Docker Desktop for Mac the file-sharing layer shows such a file as owned by your Mac user — UID 501 above — which hides the problem until the image reaches a Linux server.)</p>
</div>

<h3>All of it together</h3>
<p>A small Node image written with the list in mind, run with every flag:</p>
${src('ch12/good/Dockerfile', 'dockerfile')}
${run('c127-good', 'docker build -q')}
${run('c127-good', 'docker run -d --name os-c127-g', 4)}
${run('c127-good', "TIMEFORMAT=", 2)}
<p>Every fence is visible from inside: PID 1 is <code>docker-init</code> and the app runs as <code>node</code>; <code>CapEff 0</code>, <code>NoNewPrivs 1</code>, <code>Seccomp 2</code> (filter active); 256 MiB, one CPU, 128 tasks, 4096 descriptors; a read-only root; the port published on 127.0.0.1 only (lesson 12.5). And it stops cleanly in 0.13 s with exit 0. The <code>docker run</code> line is long — that is what Compose files and Kubernetes manifests are for; the kernel settings are the same.</p>

<h3>🧪 Practice (30–40 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your team's API container takes 10 s to stop on every deploy and sometimes loses the last requests; it runs as root, writes logs to <code>/app/logs</code> and has no limits. You get one afternoon to fix it.</p>
<ol>
<li>Measure the starting point: <code>time docker stop</code>, exit code, <code>docker exec … grep -E 'Cap|Seccomp|NoNew' /proc/1/status</code>, and <code>cat /sys/fs/cgroup/memory.max pids.max</code>.</li>
<li>Add a SIGTERM handler (Node <code>server.close()</code>, Spring Boot <code>server.shutdown=graceful</code>), switch <code>CMD</code> to exec form, and add <code>--init</code>. Measure again.</li>
<li>Add <code>USER</code>, <code>--read-only</code> with <code>--tmpfs /tmp</code>, log to stdout, and fix volume ownership with <code>--chown</code>.</li>
<li>Add <code>--memory</code>, <code>--cpus</code>, <code>--pids-limit</code>, <code>--cap-drop ALL</code>, <code>--security-opt no-new-privileges</code>, and publish on 127.0.0.1 behind the reverse proxy.</li>
</ol>
<p><strong>Done when:</strong> a before/after table shows stop time ≤ 1 s with exit 0, <code>CapEff 0</code>, <code>NoNewPrivs 1</code>, a read-only root, and non-<code>max</code> values in <code>memory.max</code> and <code>pids.max</code> — all read from the running container, not from the Dockerfile.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['pod', 'Kubernetes’ unit: containers sharing network and IPC (optionally PID) namespaces, one IP, one port space.'],
  ['pause container', 'A process that only holds the pod’s namespaces, so app containers can restart without losing them.'],
  ['--network/--pid/--ipc container:X', 'Docker flags that make a container join another container’s namespaces (setns).'],
  ['shell form vs exec form', 'CMD cmd runs under /bin/sh -c (the shell may stay PID 1); CMD ["cmd"] runs the program directly.'],
  ['--init (tini)', 'A minimal PID 1 that forwards signals to your app and reaps zombies.'],
  ['--read-only / --tmpfs', 'Mount the root overlay read-only; give the app explicit writable tmpfs or volumes.'],
  ['ip_unprivileged_port_start', 'Per-network-namespace sysctl; Docker sets it to 0 so non-root containers may bind ports below 1024.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A pod is containers that join one set of network/IPC (optionally PID) namespaces held by a pause process: one IP, <code>localhost</code> between containers, separate file systems.</li>
<li>PID 1 without a SIGTERM handler gets killed after the grace period (137); use exec form, <code>--init</code> and a real handler (exit 0 in 0.10 s).</li>
<li>No flags means no limits: set memory, CPU and PID limits, and size the runtime inside them.</li>
<li>Check <code>ulimit -n</code>, run with a read-only root and a tmpfs, and log to stdout.</li>
<li>Run as a non-root user: capabilities drop to 0 and port 80 still works; fix volume ownership by UID.</li>
</ul>
${L('https://kubernetes.io/docs/concepts/workloads/pods/', '📄', 'Pods (Kubernetes docs)', 'What containers in a pod share, and how pods are managed.', 'Open')}
${L('https://docs.docker.com/build/building/best-practices/', '📄', 'Dockerfile best practices (Docker docs)', 'Exec form, USER, layer order and more — with this lesson’s measurements behind them.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.7</span>
<h2>Pod dùng chung namespace; Dockerfile nhìn từ hệ điều hành</h2>
<p class="lead">Hai hệ quả thực tế của câu "container là một tiến trình có namespace và cgroup". Thứ nhất, Kubernetes dựng đơn vị của nó, <strong>pod</strong>, bằng cách cho nhiều container <em>dùng chung</em> một số namespace. Thứ hai, phần lớn "best practice Dockerfile" thật ra là sự thật về hệ điều hành: ai là PID 1, tín hiệu nào tới, giới hạn nào áp dụng, ai sở hữu file. Các câu hỏi: <strong>pod dùng chung chính xác cái gì, và những lựa chọn nào trong Dockerfile và <code>docker run</code> làm đổi cách nhân đối xử với dịch vụ của bạn?</strong> Mục nào dưới đây cũng được đo.</p>

<h3>Pod là các container dùng chung namespace</h3>
<p>Kubernetes khởi động trước một tiến trình "pause" tí hon; nó không làm gì ngoài giữ network namespace và IPC namespace của pod (và, nếu bạn yêu cầu, PID namespace). Mỗi container ứng dụng của pod sau đó <em>gia nhập</em> các namespace đó. Docker làm được y vậy với <code>--network container:X</code>, <code>--pid container:X</code> và <code>--ipc container:X</code>; một lệnh <code>sleep</code> Alpine đóng vai tiến trình pause:</p>
${run('c127-host', 'docker run -d --name os-c127-pause', 5)}
<p>Số đo cho thấy: container thứ ba (cái "sidecar") gọi được ứng dụng ở <strong>127.0.0.1:8000</strong> — cả pod có một network namespace, một <code>lo</code>, một địa chỉ IP và một không gian cổng, vì thế hai container trong một pod không thể cùng nghe cổng 8000. Khi PID namespace được dùng chung, ứng dụng thấy tiến trình pause là PID 1 và chính nó là PID 7. Bảng namespace: <code>net</code>, <code>pid</code> và <code>ipc</code> trùng nhau; <code>mnt</code> khác — mỗi container giữ hệ thống file riêng — và <code>uts</code> khác ở đây vì Docker chép hostname <code>pod-a</code> sang chứ không dùng chung namespace (Kubernetes thì có dùng chung UTS). Kubernetes chỉ dùng chung PID namespace khi đặt <code>shareProcessNamespace: true</code>; mặc định mỗi container giữ PID 1 riêng.</p>
${lab('nslayers', 'pod', 'vi', 'Pod là các namespace dùng chung: bật/tắt chia sẻ net, ipc, uts và pid — sidecar gọi được 127.0.0.1:8000 hay không, ps thấy /pause là PID 1, hai container cùng cổng 8000 bị EADDRINUSE, và IP pod sống sót qua lần app khởi động lại.', { tour: 'nslayers-pod' })}
<p>Tiến trình pause tồn tại vì lý do của bài 12.1: namespace sống chừng nào còn thứ giữ nó. Nếu network namespace thuộc về container ứng dụng, khởi động lại ứng dụng sẽ huỷ luôn địa chỉ IP của pod. Vì pause giữ nó, container ứng dụng có thể sập và khởi động lại mà pod vẫn giữ danh tính mạng.</p>

<h3>Checklist, có đo</h3>
<table>
<tr><th>mục</th><th>nhân làm gì</th><th>đo được ở đây</th></tr>
<tr><td>1. PID 1 và tín hiệu</td><td>PID 1 lờ các tín hiệu không có handler</td><td>không handler: 3,16 s rồi 137 · <code>--init</code>: 0,09 s · có handler: 0,10 s, mã 0</td></tr>
<tr><td>2. giới hạn tài nguyên</td><td>không có gì nếu chưa ghi file cgroup</td><td><code>memory.max=max pids.max=max</code> khi không cờ</td></tr>
<tr><td>3. ulimit</td><td>RLIMIT_NOFILE thừa hưởng từ runtime</td><td>soft = hard = 1048576 mặc định</td></tr>
<tr><td>4. gốc chỉ-đọc</td><td>overlay được mount <code>ro</code></td><td>ghi hỏng với EROFS; <code>--tmpfs /tmp</code> làm chỗ nháp</td></tr>
<tr><td>5. người dùng không root</td><td>một UID không có capability</td><td><code>CapEff 0</code>, vẫn mở được cổng 80</td></tr>
</table>

<h3>1 — PID 1 và tín hiệu</h3>
<p><a href="${OS('os-1-5-pid1')}">Bài 1.5</a> đã giải thích vì sao; đây là bốn biến thể đặt cạnh nhau, với cùng một máy chủ Node không có và có handler SIGTERM:</p>
${src('ch12/naive.js', 'javascript')}
${src('ch12/server.js', 'javascript')}
${run('c127-host', 'docker run -d --name os-c127-s0')}
${run('c127-host', 'docker run -d --name os-c127-s1')}
${run('c127-host', 'docker run -d --name os-c127-s2')}
${run('c127-host', 'docker run -d --name os-c127-s3')}
${run('c127-host', 'docker run -d --name os-c127-s4')}
<p>Không handler: Node là PID 1, SIGTERM bị bỏ (12.1 cho thấy vì sao), và hết thời gian ân hạn Docker gửi SIGKILL — <strong>mã 137</strong>. Trên Docker Desktop này thời gian ân hạn khoảng 3 s (container không có <code>StopTimeout</code> riêng; tài liệu Docker ghi mặc định 10 s và Kubernetes chờ <code>terminationGracePeriodSeconds</code>, 30 s). <strong>Shell form</strong> (<code>CMD node naive.js</code> thành <code>sh -c</code>) là cùng thất bại đó ở một tầng trên: <code>dash</code> của Ubuntu ở lại làm PID 1 và không chuyển SIGTERM. (<code>sh</code> của busybox trên Alpine thì <code>exec</code> luôn lệnh cuối — bài 12.4 — nên cùng một Dockerfile hành xử khác nhau trên các ảnh nền khác nhau: đừng dựa vào đó.) <strong><code>--init</code></strong> đặt <code>docker-init</code> (tini) làm PID 1, chuyển tín hiệu đi — 0,09 s, mã 143 (128 + 15). Một handler thật là tốt nhất: 0,10 s, có dòng log, <strong>mã 0</strong>, request đang xử lý được làm xong.</p>
${lab('process', 'oom137', 'vi', '137 từ đâu ra: SIGKILL (9) + 128 — dù là docker stop hết kiên nhẫn hay memory cgroup giết PID 1 của bạn.', { tour: 'process-start' })}

<h3>2 — Giới hạn tài nguyên</h3>
${run('c127-host', "docker run --rm --label oslab=1 os-lab sh -c 'cd /sys/fs/cgroup")}
<p>Không có cờ thì một container được dùng hết RAM, mọi CPU và mọi PID của máy (bài 12.2). Hãy đặt <code>--memory</code>, <code>--cpus</code> và <code>--pids-limit</code> (hoặc <code>deploy.resources.limits</code> trong Compose, <code>resources.limits</code> trong Kubernetes), và chỉnh runtime bên trong cho vừa — heap của Node và <code>MaxRAMPercentage</code> của JVM ở <a href="${OS('os-8-5-gioi-han')}">bài 8.5</a>. Kubernetes còn có thể dùng <code>memory.high</code> làm trần mềm dưới <code>memory.max</code>, để nhân hãm và thu hồi trước khi phải giết:</p>
${lab('cgroup', 'high', 'vi', 'memory.high dưới memory.max: nhóm bị làm chậm và bị thu hồi ở trần mềm, rất lâu trước khi OOM killer ra tay ở trần cứng.', { tour: 'cgroup-start' })}

<h3>3 — ulimit</h3>
${run('c127-host', "docker run --rm --label oslab=1 os-lab bash -c 'echo \"nofile", 2)}
<p>Một container mặc định ở đây được mở hơn một triệu file (<code>RLIMIT_NOFILE</code> soft = hard = 1048576), được khởi động không giới hạn tiến trình mỗi người dùng (trần thật là <code>pids.max</code> của cgroup) và không ghi core dump. <code>nofile</code> quá lớn giấu rò rỉ descriptor cho tới khi hết bộ nhớ; quá nhỏ thì gặp "Too many open files" lúc tải cao (<a href="${OS('os-2-5-mang-fd')}">bài 2.5</a>). <code>--ulimit nofile=1024:4096</code> đặt soft và hard; để ý Node đã tự nâng soft lên bằng hard lúc khởi động (shell con của nó thấy 4096), nên với Node thì giới hạn <em>hard</em> mới là thứ quyết định.</p>
${lab('fdtable', 'emfile', 'vi', 'Giới hạn nofile nhỏ nhìn từ bên trong: một máy chủ rò một socket mỗi request làm đầy bảng fd tới 1024 và nhận EMFILE (“Too many open files”); nâng giới hạn chỉ làm nó tới muộn hơn.', { tour: 'fdtable-deleted' })}

<h3>4 — Hệ thống file gốc chỉ-đọc</h3>
${run('c127-host', 'docker run --rm --label oslab=1 --read-only os-lab')}
${run('c127-host', 'docker run --rm --label oslab=1 --read-only --tmpfs')}
<p><code>--read-only</code> mount gốc overlay ở chế độ <code>ro</code>: kẻ tấn công hay một lỗi không thả được file vào thư mục của ảnh, và không gì lặng lẽ làm phình lớp container (copy-up của 12.3). Khi đó ứng dụng cần chỗ ghi được rõ ràng: một <code>--tmpfs /tmp</code> (Docker mount nó <code>noexec,nosuid,nodev</code>) và volume cho dữ liệu thật. Ghi file log bên trong container là thứ kinh điển bị gãy — hãy ghi log ra stdout.</p>

<h3>5 — Người dùng không phải root</h3>
${run('c127-host', "docker run --rm --label oslab=1 os-lab sh -c 'id -u")}
${run('c127-host', 'docker run --rm --label oslab=1 --user 1001:1001 os-lab')}
<p>Mặc định: UID 0 với 14 capability (<code>0xa80425fb</code>). Với <code>USER 1001</code>, tập hiệu lực rỗng. Và cái cớ thường gặp để chạy root — "ứng dụng phải nghe cổng 80" — không đúng ở đây: Docker đặt <code>net.ipv4.ip_unprivileged_port_start = 0</code> trong network namespace của container, nên UID 1001 mở được cổng 80 (máy chủ vẫn đang phục vụ khi <code>timeout</code> dừng nó, mã 124).</p>
${run('c127-host', 'docker run --rm --label oslab=1 --user 1001:1001 -v', 2)}

<div class="pitfall co-tieu-de">
<p><strong>"Permission denied" trên volume sau khi chuyển sang người dùng không root.</strong> Nhân kiểm con số, không kiểm tên: một file do UID 1001 ghi trong container thuộc UID 1001 trên máy chủ Linux, và một thư mục volume do root tạo thì 1001 không ghi được. Hãy sửa quyền sở hữu lúc build (<code>COPY --chown=node:node</code>, <code>RUN chown</code> thư mục dữ liệu) hoặc bằng một bước khởi tạo, đừng quay về root. (Trên Docker Desktop cho Mac, lớp chia sẻ file hiện file đó là của người dùng Mac — UID 501 ở trên — nên vấn đề bị giấu cho tới khi ảnh lên tới một máy chủ Linux.)</p>
</div>

<h3>Ghép tất cả lại</h3>
<p>Một ảnh Node nhỏ viết theo danh sách này, chạy với đủ cờ:</p>
${src('ch12/good/Dockerfile', 'dockerfile')}
${run('c127-good', 'docker build -q')}
${run('c127-good', 'docker run -d --name os-c127-g', 4)}
${run('c127-good', "TIMEFORMAT=", 2)}
<p>Mọi hàng rào đều thấy được từ bên trong: PID 1 là <code>docker-init</code> và ứng dụng chạy bằng <code>node</code>; <code>CapEff 0</code>, <code>NoNewPrivs 1</code>, <code>Seccomp 2</code> (bộ lọc đang bật); 256 MiB, một CPU, 128 tác vụ, 4096 descriptor; gốc chỉ-đọc; cổng chỉ publish trên 127.0.0.1 (bài 12.5). Và nó dừng sạch trong 0,13 s với mã 0. Dòng <code>docker run</code> dài — đó là việc của file Compose và manifest Kubernetes; các thiết lập của nhân thì y hệt.</p>

<h3>🧪 Thực hành (30–40 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> container API của nhóm bạn mất 10 s để dừng mỗi lần deploy và đôi khi mất mấy request cuối; nó chạy bằng root, ghi log vào <code>/app/logs</code> và không có giới hạn nào. Bạn có một buổi chiều để sửa.</p>
<ol>
<li>Đo điểm xuất phát: <code>time docker stop</code>, mã thoát, <code>docker exec … grep -E 'Cap|Seccomp|NoNew' /proc/1/status</code>, và <code>cat /sys/fs/cgroup/memory.max pids.max</code>.</li>
<li>Thêm handler SIGTERM (Node <code>server.close()</code>, Spring Boot <code>server.shutdown=graceful</code>), đổi <code>CMD</code> sang exec form, và thêm <code>--init</code>. Đo lại.</li>
<li>Thêm <code>USER</code>, <code>--read-only</code> kèm <code>--tmpfs /tmp</code>, ghi log ra stdout, và sửa quyền sở hữu volume bằng <code>--chown</code>.</li>
<li>Thêm <code>--memory</code>, <code>--cpus</code>, <code>--pids-limit</code>, <code>--cap-drop ALL</code>, <code>--security-opt no-new-privileges</code>, và chỉ publish trên 127.0.0.1 sau reverse proxy.</li>
</ol>
<p><strong>Đạt khi:</strong> một bảng trước/sau cho thấy thời gian dừng ≤ 1 s với mã 0, <code>CapEff 0</code>, <code>NoNewPrivs 1</code>, gốc chỉ-đọc, và <code>memory.max</code>, <code>pids.max</code> khác <code>max</code> — tất cả đọc từ container đang chạy, không đọc từ Dockerfile.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['pod', 'Đơn vị của Kubernetes: các container dùng chung network và IPC (tuỳ chọn cả PID) namespace, một IP, một không gian cổng.'],
  ['pause container', 'Một tiến trình chỉ giữ các namespace của pod, để container ứng dụng khởi động lại mà không mất chúng.'],
  ['--network/--pid/--ipc container:X', 'Cờ Docker cho một container gia nhập namespace của container khác (setns).'],
  ['shell form vs exec form', 'CMD lệnh chạy dưới /bin/sh -c (shell có thể ở lại làm PID 1); CMD ["lệnh"] chạy thẳng chương trình.'],
  ['--init (tini)', 'Một PID 1 tối giản chuyển tín hiệu cho ứng dụng và dọn zombie.'],
  ['--read-only / --tmpfs', 'Mount gốc overlay chỉ-đọc; cho ứng dụng chỗ ghi tmpfs hoặc volume rõ ràng.'],
  ['ip_unprivileged_port_start', 'Sysctl theo từng network namespace; Docker đặt 0 để container không root mở được cổng dưới 1024.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Pod là các container gia nhập một bộ network/IPC (tuỳ chọn PID) namespace do một tiến trình pause giữ: một IP, gọi nhau qua <code>localhost</code>, hệ thống file riêng.</li>
<li>PID 1 không có handler SIGTERM bị giết sau thời gian ân hạn (137); dùng exec form, <code>--init</code> và một handler thật (mã 0 trong 0,10 s).</li>
<li>Không cờ là không giới hạn: đặt giới hạn bộ nhớ, CPU, PID, và chỉnh runtime bên trong cho vừa.</li>
<li>Kiểm <code>ulimit -n</code>, chạy với gốc chỉ-đọc và một tmpfs, và ghi log ra stdout.</li>
<li>Chạy bằng người dùng không root: capabilities về 0 mà cổng 80 vẫn được; sửa quyền sở hữu volume theo UID.</li>
</ul>
${L('https://kubernetes.io/docs/concepts/workloads/pods/', '📄', 'Pods (tài liệu Kubernetes)', 'Các container trong một pod dùng chung những gì, và pod được quản lý ra sao.', 'Mở')}
${L('https://docs.docker.com/build/building/best-practices/', '📄', 'Dockerfile best practices (tài liệu Docker)', 'Exec form, USER, thứ tự lớp và hơn nữa — có số đo của bài này đứng sau.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 12.8 — Quiz ───────────────────────── */
    {
      title: '12.8 — Chapter 12 check: containers from the kernel’s point of view|||12.8 — Kiểm tra Chương 12: container nhìn từ nhân',
      slug: 'os-12-8-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về container: NSpid, unshare --pid thiếu --fork, PID 1 và SIGTERM, cpu.max và throttling, EBUSY của subtree_control, copy-up, whiteout trong lớp ảnh, cổng publish vượt ufw, chuỗi shim/runc, và seccomp nằm trong bản đặc tả.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Check</span>
<h2>Chapter 12 check: containers from the kernel’s point of view</h2>
<p class="lead">Ten situations taken from the outputs of this chapter. Each asks what a line of <code>/proc</code>, a cgroup counter, an exit code or a process tree means — the reading you need when a container misbehaves in production.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can show that a container is a process: its NSpid, its namespace links, its parent shim — and enter it with nsenter.</li>
<li>I can create namespaces with unshare (including the PID-namespace traps) and a cgroup with memory, CPU, PID and I/O limits.</li>
<li>I can explain lower/upper/work, copy-up and whiteouts, and why the build cache is keyed per instruction.</li>
<li>I can build container networking with veth, a bridge, MASQUERADE and DNAT, and explain why published ports bypass ufw.</li>
<li>I can read Docker’s OCI config.json, explain dockerd → containerd → shim → runc, and apply the PID 1 / limits / read-only / non-root checklist.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Kiểm tra</span>
<h2>Kiểm tra Chương 12: container nhìn từ nhân</h2>
<p class="lead">Mười tình huống lấy từ output của chương này. Mỗi câu hỏi một dòng <code>/proc</code>, một bộ đếm cgroup, một mã thoát hay một cây tiến trình có nghĩa là gì — đúng cách đọc bạn cần khi một container trục trặc trên production.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chứng minh được container là một tiến trình: NSpid, các liên kết namespace, shim cha của nó — và bước vào nó bằng nsenter.</li>
<li>Tôi tạo được namespace bằng unshare (kể cả các bẫy của PID namespace) và một cgroup với giới hạn bộ nhớ, CPU, PID và I/O.</li>
<li>Tôi giải thích được lower/upper/work, copy-up và whiteout, và vì sao build cache được khoá theo từng lệnh.</li>
<li>Tôi dựng được mạng container bằng veth, bridge, MASQUERADE và DNAT, và giải thích được vì sao cổng publish lách qua ufw.</li>
<li>Tôi đọc được config.json OCI của Docker, giải thích được dockerd → containerd → shim → runc, và áp được checklist PID 1 / giới hạn / chỉ-đọc / không root.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          { question: 'Inside a container <code>ps</code> shows your app as PID 1. On the Docker host, <code>grep NSpid /proc/71743/status</code> prints <code>NSpid: 71743 1</code>. What does that line mean?|||Trong một container, <code>ps</code> cho thấy ứng dụng của bạn là PID 1. Trên máy chủ Docker, <code>grep NSpid /proc/71743/status</code> in ra <code>NSpid: 71743 1</code>. Dòng đó nghĩa là gì?',
            options: ['There are two processes, one in each namespace, kept in sync|||Có hai tiến trình, mỗi namespace một cái, được giữ đồng bộ', 'One process: PID 71743 in the outer PID namespace and PID 1 in the container’s|||Một tiến trình: PID 71743 ở PID namespace bên ngoài và PID 1 ở namespace của container', 'The container runs its own kernel, which numbered the process 1|||Container chạy nhân riêng, nhân đó đánh số tiến trình là 1', '71743 is containerd-shim and 1 is the app it started|||71743 là containerd-shim còn 1 là ứng dụng nó khởi động'],
            correctIndex: 1, points: 1,
            explanation: 'EN: The kernel keeps one task with one PID per nested PID namespace, outermost first. In lesson 12.1 the shim was a different process (PID 71719, the parent), so D mixes up parent and child; and every container reported the same kernel 7.0.12-linuxkit, so there is no second kernel (C).|||VI: Nhân giữ một tác vụ với mỗi PID namespace lồng nhau một PID, ngoài cùng trước. Ở bài 12.1, shim là một tiến trình khác (PID 71719, tiến trình cha), nên D lẫn cha với con; và mọi container đều báo cùng nhân 7.0.12-linuxkit, nên không có nhân thứ hai (C).' },
          { question: 'In the lab, <code>unshare --pid sh -c</code> runs a script that calls <code>/bin/true</code> twice. It prints <code>sh is still PID 30</code>, <code>first child ran</code>, then <code>sh: 1: Cannot fork</code>. Why does the second <code>/bin/true</code> fail?|||Trong lab, <code>unshare --pid sh -c</code> chạy một script gọi <code>/bin/true</code> hai lần. Nó in <code>sh is still PID 30</code>, <code>first child ran</code>, rồi <code>sh: 1: Cannot fork</code>. Vì sao lần <code>/bin/true</code> thứ hai hỏng?',
            options: ['pids.max of the cgroup was reached|||Đã chạm pids.max của cgroup', 'unshare --pid needs the user to be root|||unshare --pid cần người dùng là root', 'The new namespace has no /proc mounted|||Namespace mới chưa mount /proc', 'The first child became PID 1 of the new namespace and exited, so the namespace accepts no new process — use --fork|||Đứa con đầu tiên thành PID 1 của namespace mới rồi thoát, nên namespace không nhận thêm tiến trình nào — hãy dùng --fork'],
            correctIndex: 3, points: 1,
            explanation: 'EN: unshare(CLONE_NEWPID) moves the caller’s next child, not the caller. That child was PID 1 and exited; a PID namespace whose init is gone refuses new processes (ENOMEM, "Cannot fork"). --fork makes your command PID 1. A missing /proc (C) breaks ps, not fork — that was the second trap, fixed by --mount-proc.|||VI: unshare(CLONE_NEWPID) chuyển đứa con kế tiếp của tiến trình gọi, không chuyển chính nó. Đứa con đó là PID 1 rồi thoát; PID namespace mất init thì từ chối tiến trình mới (ENOMEM, "Cannot fork"). --fork làm lệnh của bạn thành PID 1. Thiếu /proc (C) làm ps hỏng chứ không làm fork hỏng — đó là cái bẫy thứ hai, sửa bằng --mount-proc.' },
          { question: 'A Node server with no signal handler runs as PID 1. <code>docker stop</code> takes 3.16 s and the exit code is 137. Which change gives a fast stop with <strong>exit 0</strong>?|||Một máy chủ Node không có handler tín hiệu chạy làm PID 1. <code>docker stop</code> mất 3,16 s và mã thoát là 137. Thay đổi nào cho dừng nhanh với <strong>mã 0</strong>?',
            options: ['Handle SIGTERM in the app (close the server, then exit) and keep the exec form|||Xử lý SIGTERM trong ứng dụng (đóng máy chủ rồi thoát) và giữ exec form', 'Switch CMD to the shell form CMD node server.js|||Đổi CMD sang shell form CMD node server.js', 'Raise the stop timeout to 30 seconds|||Tăng thời gian chờ dừng lên 30 giây', 'Run the container with --privileged so signals are allowed|||Chạy container với --privileged để tín hiệu được phép'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured in 12.7: with a SIGTERM handler the stop took 0.10 s and exit was 0. Shell form left sh as PID 1 (3.13 s, killed). --init is fast too but exits 143 (128 + SIGTERM) because nobody handles the signal. A longer timeout only waits longer before the same SIGKILL; privileges have nothing to do with PID 1 signal rules.|||VI: Đo ở 12.7: có handler SIGTERM thì dừng mất 0,10 s và mã 0. Shell form để sh làm PID 1 (3,13 s, bị giết). --init cũng nhanh nhưng thoát 143 (128 + SIGTERM) vì không ai xử lý tín hiệu. Thời gian chờ dài hơn chỉ chờ lâu hơn trước cùng một SIGKILL; đặc quyền chẳng liên quan gì tới luật tín hiệu của PID 1.' },
          { question: 'A cgroup has <code>cpu.max = 50000 100000</code> and runs two busy threads on an idle 10-core machine. What do you measure?|||Một cgroup có <code>cpu.max = 50000 100000</code> và chạy hai luồng bận trên một máy 10 lõi đang rảnh. Bạn đo được gì?',
            options: ['Each thread at 50 %, 100 % together|||Mỗi luồng 50 %, tổng 100 %', 'One thread runs at 50 %, the other starves at 0 %|||Một luồng chạy 50 %, luồng kia đói ở 0 %', 'About 25 % each, and cpu.stat shows nr_throttled almost equal to nr_periods|||Khoảng 25 % mỗi luồng, và cpu.stat cho thấy nr_throttled gần bằng nr_periods', 'Both at 100 %, because the quota only applies when the machine is busy|||Cả hai 100 %, vì quota chỉ áp dụng khi máy bận'],
            correctIndex: 2, points: 1,
            explanation: 'EN: The quota is 50 ms per 100 ms for the whole group, summed over its threads. Measured: 24.8 % and 26.0 %, 2.13 s of CPU in 42 periods, throttled in 42 of 42. The tempting D is wrong: cpu.max is a hard ceiling even on an idle machine — that is exactly why CPU limits cause latency spikes.|||VI: Quota là 50 ms mỗi 100 ms cho cả nhóm, cộng dồn các luồng. Đo được: 24,8 % và 26,0 %, 2,13 s CPU trong 42 chu kỳ, bị hãm 42 trên 42. D hấp dẫn nhưng sai: cpu.max là trần cứng kể cả khi máy rảnh — chính vì thế giới hạn CPU gây ra những cú vọt độ trễ.' },
          { question: 'You create <code>/sys/fs/cgroup/box</code> and run <code>echo "+memory" &gt; /sys/fs/cgroup/cgroup.subtree_control</code>. It fails with "Device or resource busy". What is the cause?|||Bạn tạo <code>/sys/fs/cgroup/box</code> rồi chạy <code>echo "+memory" &gt; /sys/fs/cgroup/cgroup.subtree_control</code>. Nó hỏng với "Device or resource busy". Nguyên nhân là gì?',
            options: ['The memory controller is not compiled into this kernel|||Controller memory không được biên dịch vào nhân này', 'The parent group still contains processes; cgroup v2 forbids delegating controllers from a group with processes — move them into a leaf first|||Nhóm cha vẫn còn tiến trình; cgroup v2 cấm uỷ quyền controller từ một nhóm có tiến trình — chuyển chúng vào một nhóm lá trước', 'You need to restart the container with --privileged|||Bạn cần khởi động lại container với --privileged', 'memory.max of box was already set|||memory.max của box đã được đặt rồi'],
            correctIndex: 1, points: 1,
            explanation: 'EN: The "no internal processes" rule. In 12.2 the lab’s 4 processes were moved to init/, after which "+memory +cpu +pids +io" was accepted. The controller exists (cgroup.controllers listed memory), and the container was already privileged.|||VI: Luật "không có tiến trình ở nút trong". Ở 12.2, 4 tiến trình của lab được chuyển vào init/, sau đó "+memory +cpu +pids +io" được chấp nhận. Controller có tồn tại (cgroup.controllers có liệt kê memory), và container vốn đã đặc quyền.' },
          { question: 'Inside a container you append one line to a 200 MB file that came with the image. The first append takes 0.93 s and the container’s writable layer grows by 200 MB; the second append takes 1 ms. Why?|||Trong một container, bạn nối một dòng vào file 200 MB đi kèm ảnh. Lần nối đầu mất 0,93 s và lớp ghi được của container phình thêm 200 MB; lần nối thứ hai mất 1 ms. Vì sao?',
            options: ['overlayfs copy-up: the first write copies the whole file from the lower layer into the upper directory|||copy-up của overlayfs: lần ghi đầu chép nguyên file từ lớp dưới lên thư mục upper', 'The page cache had to be flushed to disk first|||Page cache phải được xả xuống đĩa trước', 'Docker committed a new image layer|||Docker đã commit một lớp ảnh mới', 'A whiteout had to be created for the old version|||Phải tạo một whiteout cho phiên bản cũ'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Lower layers are read-only, so overlayfs copies the file up before the first modification — measured in 12.3: upper 1 → 201 MB, 0.93 s, then 1 ms. Whiteouts are for deletes (D), and nothing is committed to the image (C). Keep mutable data on volumes.|||VI: Lớp dưới chỉ-đọc, nên overlayfs chép file lên trước lần sửa đầu tiên — đo ở 12.3: upper 1 → 201 MB, 0,93 s, rồi 1 ms. Whiteout dành cho thao tác xoá (D), và không có gì được commit vào ảnh (C). Hãy giữ dữ liệu thay đổi trên volume.' },
          { question: 'A Dockerfile installs packages with one <code>RUN apt-get install …</code> and, three instructions later, cleans up with <code>RUN rm -rf /var/lib/apt/lists/*</code>. The image is no smaller. Why?|||Một Dockerfile cài gói bằng một <code>RUN apt-get install …</code> và, ba lệnh sau, dọn bằng <code>RUN rm -rf /var/lib/apt/lists/*</code>. Ảnh không nhỏ đi. Vì sao?',
            options: ['rm failed silently because the files were read-only|||rm hỏng lặng lẽ vì các file chỉ-đọc', 'The build cache restored the deleted files|||Build cache đã khôi phục các file bị xoá', 'apt downloads the lists again when the container starts|||apt tải lại danh sách khi container khởi động', 'A delete in a later layer is only a whiteout; the bytes stay in the earlier layer — clean up in the same RUN|||Thao tác xoá ở lớp sau chỉ là một whiteout; các byte vẫn nằm ở lớp trước — hãy dọn trong cùng lệnh RUN'],
            correctIndex: 3, points: 1,
            explanation: 'EN: Each instruction is a layer; layers are stacked by overlayfs and never modified. In 12.3 deleting legacy.conf created a 0,0 character device in upper while base still held the file. Install and clean in one RUN so the files never enter a layer.|||VI: Mỗi lệnh là một lớp; các lớp được overlayfs xếp chồng và không bao giờ bị sửa. Ở 12.3, xoá legacy.conf tạo một thiết bị ký tự 0,0 trong upper trong khi base vẫn giữ file. Hãy cài và dọn trong một lệnh RUN để file không bao giờ lọt vào một lớp.' },
          { question: 'A VPS has <code>ufw deny 5432</code>, yet a scanner reaches the Postgres container published with <code>-p 5432:5432</code>. What explains it, and what is the fix?|||Một VPS có <code>ufw deny 5432</code>, vậy mà một máy quét vẫn tới được container Postgres publish bằng <code>-p 5432:5432</code>. Điều gì giải thích, và sửa ra sao?',
            options: ['ufw only filters UDP; add a TCP rule|||ufw chỉ lọc UDP; thêm một luật TCP', 'Postgres opens its own raw socket that bypasses netfilter|||Postgres mở raw socket riêng lách qua netfilter', 'A published port is a DNAT in PREROUTING, so the packet is forwarded before ufw’s INPUT rules see it — publish on 127.0.0.1:5432 or not at all|||Cổng publish là một DNAT trong PREROUTING, nên gói tin được chuyển tiếp trước khi luật INPUT của ufw thấy nó — publish trên 127.0.0.1:5432 hoặc đừng publish', 'Docker disables ufw when it is installed|||Docker tắt ufw khi được cài'],
            correctIndex: 2, points: 1,
            explanation: 'EN: In 12.5 the -p equivalent was two DNAT rules (PREROUTING for remote clients, OUTPUT for local ones); the rewritten packet goes through FORWARD, not INPUT. Binding to loopback, or filtering in DOCKER-USER, closes it. ufw is not disabled (D) — it simply never sees the packet.|||VI: Ở 12.5, tương đương -p là hai luật DNAT (PREROUTING cho máy khách từ xa, OUTPUT cho tiến trình trên máy); gói đã đổi đích đi qua FORWARD chứ không qua INPUT. Gắn vào loopback, hoặc lọc ở DOCKER-USER, là đóng được. ufw không bị tắt (D) — nó chỉ đơn giản là không bao giờ thấy gói tin.' },
          { question: 'In the Docker VM you see <code>72701 1 containerd-shim-runc-v2 …</code> and <code>72724 72701 sleep 600</code>, and no runc process at all. Which statement is true?|||Trong máy ảo Docker bạn thấy <code>72701 1 containerd-shim-runc-v2 …</code> và <code>72724 72701 sleep 600</code>, mà không có tiến trình runc nào. Câu nào đúng?',
            options: ['runc set up the container, exec’d the app and exited; the shim stays as its parent so dockerd and containerd can restart without killing it|||runc dựng container, exec ứng dụng rồi thoát; shim ở lại làm cha để dockerd và containerd khởi động lại được mà không giết nó', 'runc crashed and the container runs without isolation|||runc đã sập và container chạy mà không được cách ly', 'The container has stopped; sleep is a leftover zombie|||Container đã dừng; sleep là một zombie còn sót', 'containerd is the parent of the app; the shim only collects logs|||containerd là cha của ứng dụng; shim chỉ thu log'],
            correctIndex: 0, points: 1,
            explanation: 'EN: runc is short-lived by design: strace showed unshare, pivot_root(".", "."), sethostname and execve, then it exits. The shim (parent PID 1, detached from containerd) holds stdio, reaps the app and reports its exit code. When runc ran without a shim (runc run -d), the container’s PID 1 was adopted by init (PPID 1) — the gap the shim fills.|||VI: runc sống ngắn có chủ đích: strace cho thấy unshare, pivot_root(".", "."), sethostname và execve, rồi nó thoát. Shim (cha là PID 1, tách khỏi containerd) giữ stdio, dọn ứng dụng và báo mã thoát. Khi runc chạy không có shim (runc run -d), PID 1 của container bị init nhận nuôi (PPID 1) — đúng khoảng trống shim lấp vào.' },
          { question: 'A Compose file sets <code>security_opt: [seccomp=unconfined]</code> "because one library needs one syscall". A teammate says: "containers are sandboxed anyway". Based on this chapter’s measurements, what is correct?|||Một file Compose đặt <code>security_opt: [seccomp=unconfined]</code> "vì một thư viện cần một syscall". Một bạn trong nhóm nói: "container thì đằng nào cũng được cách ly". Dựa vào số đo của chương này, điều gì đúng?',
            options: ['The kernel always applies a seccomp filter to containers, so nothing changes|||Nhân luôn áp một bộ lọc seccomp cho container, nên không có gì thay đổi', 'The filter exists only because dockerd wrote it into config.json; unconfined removes it — check Seccomp in /proc/1/status and allow just that syscall in a custom profile|||Bộ lọc chỉ tồn tại vì dockerd viết nó vào config.json; unconfined gỡ nó đi — kiểm dòng Seccomp trong /proc/1/status và chỉ cho phép đúng syscall đó trong một hồ sơ riêng', 'seccomp only matters for --privileged containers|||seccomp chỉ quan trọng với container --privileged', 'runc adds the default seccomp profile by itself|||runc tự thêm hồ sơ seccomp mặc định'],
            correctIndex: 1, points: 1,
            explanation: 'EN: runc spec’s own default had "seccomp none"; Docker’s config.json had ERRNO by default with 380 allowed syscalls; the good image showed Seccomp: 2 inside. The fences come from whoever writes the spec, so D is false and A is the dangerous assumption. A custom profile that adds one syscall keeps the other ~400 filtered.|||VI: Bản đặc tả mặc định của chính runc ghi "seccomp none"; config.json của Docker mặc định ERRNO với 380 syscall được phép; ảnh mẫu cho thấy Seccomp: 2 bên trong. Hàng rào đến từ bên viết bản đặc tả, nên D sai và A là giả định nguy hiểm. Một hồ sơ riêng thêm đúng một syscall vẫn giữ ~400 cái khác bị lọc.' },
        ],
      },
    },
  ],
};
