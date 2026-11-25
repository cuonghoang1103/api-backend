/**
 * 7.5 — Thông điệp của nhân (soạn 24/11/2026, agent lgz).
 * Output thật: OUT['s07/nhan'], OUT['s07/nhan-bang'], OUT['s07/loc'] (lệnh 6: I/O error fd0) — máy ảo lab7, nhân 6.8.0-147, RAM 1 GB, không swap.
 * OOM chạy TRONG máy ảo (nhân riêng của máy ảo), không ảnh hưởng máy thật. Lỗi I/O tạo bằng device-mapper "error" trên một tệp loop 64 MB.
 * Nguồn: docs.kernel.org (sysctl kernel.dmesg_restrict, tainted kernels, cgroup v2 memory.max), man dmesg(1), MITRE T1547.006.
 */
import { lenh, nguon, lienKet, kv } from '../_chung.mjs';

export default {
  title: '7.5 — Kernel messages: dmesg -T, journalctl -k, OOM killer, disk I/O errors, segfaults, USB|||7.5 — Thông điệp của nhân: dmesg -T, journalctl -k, OOM killer, lỗi I/O đĩa, segfault, USB',
  slug: 'log-7-5-kernel-dmesg',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Nhân Linux có log riêng: vòng đệm đọc bằng dmesg (bị chặn với người thường), bản sao bền trong journal đọc bằng journalctl -k. Trên máy ảo thật: dòng USB khi cắm thiết bị, Call Trace không phải lúc nào cũng là sập, OOM killer hai kiểu — trong cgroup (MemoryMax của một dịch vụ) và cả máy — đọc từng trường total-vm/anon-rss/constraint, ai "invoked" khác ai bị giết; segfault at 0 … error 4 in libc; ổ đĩa hỏng thật bằng device-mapper: Buffer I/O error, Aborting journal, ext4 tự chuyển sang chỉ đọc; nhân bị "tainted" và module lạ ở góc hacker.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>Kernel messages: the log nobody reads until a process vanishes</h2>
<p class="lead">When a service dies without a single error line of its own, the answer is usually in the kernel's log: it killed the process for memory, the process crashed on a bad pointer, or the disk under it stopped answering. The kernel writes to its own ring buffer, which <code>dmesg</code> reads; journald also copies it into the journal, which <code>journalctl -k</code> reads. Every message below was produced on the lab7 VM — its own kernel, so killing things there cannot hurt your machine.</p>

<h3>The everyday picture: the building's security office</h3>
<p>Tenants (programs) keep their own diaries. The building's security office (the kernel) keeps a separate logbook: "21:03 power dip floor 2", "02:10 evicted tenant in 304 for overloading the electricity", "03:40 lift 2 broken". A tenant who was evicted at 02:10 never wrote it in their own diary — they were already out. To know why, you read the security office's book.</p>

<h3>Step 1 — who may read it, and the two ways to read</h3>
${lenh('s07/nhan', 0)}
${lenh('s07/nhan', 1)}
${lenh('s07/nhan', 2)}
${lenh('s07/nhan', 3)}
<ul>
<li><code>kernel.dmesg_restrict = 1</code> (Ubuntu's default): only root (CAP_SYSLOG) may read the ring buffer. Kernel messages may contain addresses and hardware details that help an attacker, so normal users are kept out.</li>
<li><code>dmesg</code> shows seconds since boot (<code>[    0.000000]</code>). <code>-T</code> converts to wall-clock time — approximately: after suspend/resume the conversion drifts.</li>
<li>The ring buffer is RAM of fixed size: it is lost at reboot and, on a busy machine, old lines are overwritten. <code>journalctl -k</code> reads the copy journald stored (<code>_TRANSPORT=kernel</code>) — with real timestamps, across boots (<code>journalctl -k -b -1</code>), with all filters from 7.2.</li>
</ul>
${lenh('s07/nhan', 5)}
<p>The last three "kernel" records are journald's own vacuum messages: journald writes its own status lines through the kernel log, so they appear under <code>-k</code>. Keep only what the kernel itself said with <code>journalctl -k SYSLOG_IDENTIFIER=kernel</code>.</p>

<h3>Step 2 — levels, and a Call Trace that is not a crash</h3>
${lenh('s07/nhan', 4)}
<p>A "Call Trace" looks frightening. This one is a known virtualisation quirk: the kernel tried to write a CPU performance-counter register the hypervisor does not emulate, warned once at boot, and carried on. A call trace means "the kernel is showing you where it was"; it is a crash only with words like <code>Oops</code>, <code>BUG:</code>, <code>Kernel panic</code>, <code>general protection fault</code>, or when followed by a dead machine. Same idea as the floppy line from lesson 7.2:</p>
${lenh('s07/loc', 6)}
<p>That line also teaches the <strong>format of a block I/O error</strong>: device (<code>fd0</code>), sector, operation (<code>0x0:(READ)</code>, <code>0x1:(WRITE)</code>). On a real server the same line with <code>dev sda</code> or <code>nvme0n1</code> is a dying disk.</p>

<h3>Step 3 — hardware arriving: USB</h3>
${lenh('s07/nhan', 6)}
${lenh('s07/nhan', 7)}
<p>Plugging a device writes a small story: bus/port (<code>usb 1-1</code>), speed, vendor:product id (<code>0627:0001</code>, look it up when the product name is missing), manufacturer and serial. Security teams read these lines to answer "was a USB stick plugged into this server on Friday?". The second command found nothing: these boot-time records were in the journal file that the vacuum of lesson 7.4 deleted, while the ring buffer still had them. Two copies, two lifetimes.</p>

<h3>Step 4 — the OOM killer inside a cgroup (one service's limit)</h3>
<p>Every systemd service lives in its own cgroup. <code>MemoryMax=</code> is a hard ceiling for that cgroup; when the processes in it need more, the kernel's OOM killer kills one of them — the rest of the machine is fine.</p>
${lenh('s07/nhan', 9)}
${lenh('s07/nhan', 10)}
${lenh('s07/nhan', 11)}
<p>Read it from the bottom up:</p>
<ul>
<li><code>Memory cgroup out of memory: Killed process 10774 (python3)</code> — who died. <strong>"Memory cgroup"</strong> = it hit a cgroup limit, not the machine's RAM.</li>
<li><code>total-vm:76596kB</code> = virtual address space (reserved, not used); <code>anon-rss:61184kB</code> = heap/stack actually in RAM — 59.75 MiB, right at the 60 MB limit; <code>file-rss</code> = mapped files (libraries); <code>shmem-rss</code> = shared memory. The number that matters is <code>anon-rss</code>.</li>
<li><code>oom-kill:constraint=CONSTRAINT_MEMCG … oom_memcg=/system.slice/an-ram.service</code> — which limit was hit (the unit's own) and in which cgroup the victim lived.</li>
<li><code>python3 invoked oom-killer: … oom_score_adj=0</code> — the process that asked for memory at the moment the limit was hit. Followed by a stack trace and a task table (step 5).</li>
<li>systemd's view: <code>A process of this unit has been killed by the OOM killer</code>, <code>status=9/KILL</code>, <code>Failed with result 'oom-kill'</code>. With <code>Restart=</code>, the next line would be "Scheduled restart job" — Lab 7.</li>
</ul>

<h3>Step 5 — the OOM killer for the whole machine</h3>
${lenh('s07/nhan', 13)}
${lenh('s07/nhan', 14)}
${lenh('s07/nhan-bang', 0)}
<ul>
<li><code>Out of memory: Killed process 10879 (python3) … anon-rss:813312kB</code> — no "Memory cgroup" prefix: the <strong>machine</strong> ran out (1 GB RAM, <code>Free swap = 0kB</code>). <code>constraint=CONSTRAINT_NONE … global_oom</code> confirms it.</li>
<li>The task table is printed in <strong>pages of 4 KiB</strong>: 203 328 pages ≈ 794 MiB for our python3 — the obvious victim. (The 16 864-page python3 belongs to the cgroup report one second earlier, which fell inside our time window.) The kernel picks the victim by <code>oom_score</code>, essentially memory use adjusted by <code>oom_score_adj</code>; daemons like <code>systemd-udevd</code> (-1000) and <code>dbus-daemon</code> (-900) are protected.</li>
<li><strong>"invoked" is not "killed".</strong> The process named in <code>X invoked oom-killer</code> is whoever happened to ask for memory at the last moment — on a real server that may be sshd or cron while the victim is your database. Always read the <code>Killed process</code> line.</li>
<li>Many desktops and Fedora also run <strong>systemd-oomd</strong>, which kills whole cgroups earlier, based on memory <em>pressure</em>; its lines come from <code>systemd-oomd</code>, not from the kernel. Ubuntu Server (lab7) does not run it.</li>
</ul>

<h3>Step 6 — segfault</h3>
${lenh('s07/nhan', 15)}
${lenh('s07/nhan', 16)}
<ul>
<li>Exit code <strong>139 = 128 + 11</strong>: killed by signal 11, SIGSEGV. Any exit code above 128 is "128 + signal" (137 = 128 + 9 = SIGKILL, typical for OOM).</li>
<li><code>segfault at 0</code> = the address the program tried to touch: 0, a NULL pointer. <code>ip</code> = the instruction that did it, <code>sp</code> = stack pointer.</li>
<li><code>error 4</code> = bits of the page-fault code: 4 = from user mode, read, page not present. (2 = it was a write, 1 = page present but protection violated.)</li>
<li><code>in libc.so.6[…+189000]</code> = the library where the crashing instruction lives. A crash inside libc almost always means the caller passed it a bad pointer (here our <code>ctypes.string_at(0)</code>).</li>
<li>"(core dumped)": a memory image was saved (Ubuntu hands it to apport; other systems to <code>systemd-coredump</code> — <code>coredumpctl list</code>). That is what developers need to debug it.</li>
</ul>

<h3>Step 7 — a disk that stops answering</h3>
<p>To see real disk errors without breaking real hardware, we built a 64 MB ext4 disk on device-mapper, mounted it with <code>errors=remount-ro</code> (the option Ubuntu puts on the root file system in <code>/etc/fstab</code>), and then replaced the mapping with the <code>error</code> target: every read and write now fails, like a disk that died.</p>
${lenh('s07/nhan', 18)}
${lenh('s07/nhan', 19)}
${lenh('s07/nhan', 20)}
${lenh('s07/nhan', 21)}
${lenh('s07/nhan', 22)}
${lenh('s07/nhan', 23)}
<p>What the application sees: <code>Input/output error</code>. What the kernel tells you, in order:</p>
<ol>
<li><code>Buffer I/O error on dev dm-0, logical block 0, lost sync page write</code> — a write to the device failed.</li>
<li><code>EXT4-fs (dm-0): I/O error while writing superblock</code> and <code>EXT4-fs error … __ext4_find_entry … reading directory lblock 0</code> — the file system cannot read its own directory.</li>
<li><code>Aborting journal on device dm-0-8</code>, <code>JBD2: I/O error when updating journal superblock</code> — ext4's journal (its crash-safety log, not journald) gives up.</li>
<li><code>Remounting filesystem read-only</code> — the protective reaction of <code>errors=remount-ro</code>: better read-only than corrupting data. Applications then fail with <code>Read-only file system</code> (EROFS).</li>
</ol>
<p>When an app suddenly logs "Read-only file system" or "Input/output error", go straight to <code>journalctl -k -p warning</code> and look for these lines. Next steps on real hardware: <code>smartctl -a /dev/sda</code>, the cloud console (a detached or throttled volume), and backups. Do not confuse with <code>No space left on device</code> (ENOSPC): that is a full disk, not a broken one.</p>

<h3>Hacker's corner: tainted kernels and unexpected modules</h3>
<p>Rootkits that hide processes and files often load a kernel module. The kernel notices some of this and says so. Lines to recognise:</p>
<ul>
<li><code>module verification failed: signature and/or required key missing - tainting kernel</code> — an unsigned module was loaded.</li>
<li><code>loading out-of-tree module taints kernel</code> — a module not built with this kernel (also normal for VirtualBox, NVIDIA, ZFS — know your baseline).</li>
<li>In every Oops/OOM report: <code>Not tainted</code> (Lab 7 shows one) or <code>Tainted: P O E</code> — the letters are decoded in the kernel's "Tainted kernels" page.</li>
</ul>
<p>Loading kernel modules for persistence is MITRE ATT&amp;CK <strong>T1547.006</strong>. A strong attacker can also clear the ring buffer (<code>dmesg -C</code>) — journald's copy and logs shipped off the machine (Chapter 15) are what remain. And <code>dmesg_restrict</code> exists precisely because kernel messages help attackers find addresses: do not turn it off to "make debugging easier".</p>

<h3>Real-life situations</h3>
<ul>
<li><strong>"The Java service dies every few days, no exception in its log":</strong> <code>journalctl -k -g 'Killed process' --since -7d</code>. If it is there with <code>Memory cgroup</code>, the container/unit limit is too low or the heap setting (<code>-Xmx</code>) is bigger than the limit; without the prefix, the whole VM is short of RAM.</li>
<li><strong>Docker:</strong> a container killed by its <code>--memory</code> limit shows <code>OOMKilled: true</code> in <code>docker inspect</code>, exit code 137, and the same kernel line with the container's cgroup path (lesson 13.1).</li>
<li><strong>"The database went read-only at night":</strong> look for <code>EXT4-fs … Remounting filesystem read-only</code> or <code>I/O error, dev …</code> just before. Restarting the database will not fix a disk.</li>
</ul>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok"><ol>
<li>As a normal user try <code>dmesg</code>, then read the last 20 kernel lines with <code>journalctl -k</code> using sudo. Explain why the first fails.</li>
<li>Run <code>sudo systemd-run --unit=thu-oom -p MemoryMax=40M -p MemorySwapMax=0 --wait python3 -c 'import itertools; a = [bytearray(5 &lt;&lt; 20) for _ in itertools.count()]'</code>. From the kernel line, write: victim, PID, anon-rss in MiB, which limit.</li>
<li>Crash a program with SIGSEGV; decode the <code>segfault at … error N in …</code> line field by field.</li>
<li>Find every kernel line at warning or above in the current boot that is <em>normal</em> on your machine, and write a one-line "baseline" note for each.</li>
<li>(Optional, VM only) Repeat the device-mapper error experiment and note the order of the ext4 messages.</li>
</ol>
<p><strong>Done when:</strong> 1 mentions <code>dmesg_restrict</code>; 2 shows anon-rss ≈ 40 MiB and <code>CONSTRAINT_MEMCG</code>; 3 explains address, error bits and library; 4 lists at least two harmless lines with a reason; 5 ends with "Remounting filesystem read-only".</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['ring buffer', 'The kernel’s fixed-size message buffer in RAM; read with dmesg, lost at reboot.'],
  ['journalctl -k', 'Kernel messages stored by journald; real timestamps, all boots, all filters.'],
  ['dmesg_restrict', 'sysctl that limits reading the ring buffer to root.'],
  ['OOM killer', 'Kernel code that kills a process when a cgroup limit or the whole RAM is exhausted.'],
  ['anon-rss', 'Anonymous memory (heap, stack) actually resident in RAM — the real usage of the victim.'],
  ['CONSTRAINT_MEMCG / global_oom', 'OOM caused by a cgroup limit / by the whole machine.'],
  ['exit 128+N', 'Process killed by signal N: 137 SIGKILL, 139 SIGSEGV, 134 SIGABRT.'],
  ['errors=remount-ro', 'ext4 option: switch to read-only on an I/O error instead of risking corruption.'],
  ['tainted', 'Kernel flag saying something non-standard happened (unsigned/out-of-tree module, prior Oops…).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Service died silently? Read the kernel: <code>journalctl -k -b -p warning</code>, and <code>sudo dmesg -T</code> for what journald lost.</li>
<li>"Memory cgroup out of memory" = a unit/container limit; "Out of memory" alone = the whole machine.</li>
<li>Read the <code>Killed process</code> line, not the "invoked" line; anon-rss is the real usage.</li>
<li>segfault line = address, error bits, library; exit code 139.</li>
<li>Buffer I/O error → ext4 error → Aborting journal → Remounting read-only = a disk problem, not an app bug.</li>
<li>Call traces and red lines are not always faults — know your baseline; know what "tainted" means.</li>
</ul>
${nguon('📘', 'dmesg(1)', '-T, --level, -w and the ring buffer', 'https://man7.org/linux/man-pages/man1/dmesg.1.html')}
${nguon('📘', 'Linux kernel — sysctl kernel.*', 'dmesg_restrict, kptr_restrict, panic settings', 'https://docs.kernel.org/admin-guide/sysctl/kernel.html')}
${nguon('📘', 'Linux kernel — cgroup v2', 'memory.max, memory.events, OOM inside a cgroup', 'https://docs.kernel.org/admin-guide/cgroup-v2.html')}
${nguon('📘', 'Linux kernel — Tainted kernels', 'Decode the letters after "Tainted:"', 'https://docs.kernel.org/admin-guide/tainted-kernels.html')}
${nguon('🛡', 'MITRE ATT&CK T1547.006', 'Kernel Modules and Extensions', 'https://attack.mitre.org/techniques/T1547/006/')}
${lienKet({ khoa: 'operating-systems-for-developers', bai: 'os-2-6-nhat-ky', title: 'OS for Developers 2.6 — The system diary', sub: 'Memory, processes and the kernel from the OS side', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Thông điệp của nhân: cuốn log không ai đọc cho tới khi một tiến trình biến mất</h2>
<p class="lead">Khi một dịch vụ chết mà không để lại dòng lỗi nào của chính nó, câu trả lời thường nằm trong log của nhân: nhân đã giết tiến trình vì bộ nhớ, tiến trình sập vì một con trỏ hỏng, hoặc ổ đĩa bên dưới thôi trả lời. Nhân ghi vào vòng đệm riêng mà <code>dmesg</code> đọc; journald cũng chép nó vào journal mà <code>journalctl -k</code> đọc. Mọi thông điệp dưới đây sinh ra trên máy ảo lab7 — nhân riêng của nó, nên giết gì trong đó cũng không hại tới máy thật của bạn.</p>

<h3>Liên tưởng đời thường: phòng bảo vệ của toà nhà</h3>
<p>Các hộ thuê (chương trình) tự viết nhật ký của mình. Phòng bảo vệ toà nhà (nhân) giữ một cuốn sổ riêng: "21:03 sụt điện tầng 2", "02:10 mời hộ 304 ra vì quá tải điện", "03:40 thang máy 2 hỏng". Hộ bị mời ra lúc 02:10 không bao giờ ghi điều đó vào nhật ký của họ — họ đã ra ngoài rồi. Muốn biết vì sao, phải đọc sổ của phòng bảo vệ.</p>

<h3>Bước 1 — ai được đọc, và hai cách đọc</h3>
${lenh('s07/nhan', 0)}
${lenh('s07/nhan', 1)}
${lenh('s07/nhan', 2)}
${lenh('s07/nhan', 3)}
<ul>
<li><code>kernel.dmesg_restrict = 1</code> (mặc định của Ubuntu): chỉ root (CAP_SYSLOG) đọc được vòng đệm. Thông điệp của nhân có thể chứa địa chỉ và chi tiết phần cứng có ích cho kẻ tấn công, nên người dùng thường bị chặn.</li>
<li><code>dmesg</code> hiện số giây từ lúc khởi động (<code>[    0.000000]</code>). <code>-T</code> đổi sang giờ đồng hồ — gần đúng thôi: sau khi ngủ/thức, phép đổi bị trôi.</li>
<li>Vòng đệm là RAM cỡ cố định: mất khi khởi động lại, và trên máy bận thì dòng cũ bị ghi đè. <code>journalctl -k</code> đọc bản journald đã lưu (<code>_TRANSPORT=kernel</code>) — giờ thật, qua nhiều lần khởi động (<code>journalctl -k -b -1</code>), dùng được mọi bộ lọc ở 7.2.</li>
</ul>
${lenh('s07/nhan', 5)}
<p>Ba bản ghi "kernel" cuối cùng là thông điệp dọn dẹp của chính journald: journald ghi dòng trạng thái của nó qua log của nhân, nên chúng hiện dưới <code>-k</code>. Chỉ giữ lời của chính nhân bằng <code>journalctl -k SYSLOG_IDENTIFIER=kernel</code>.</p>

<h3>Bước 2 — các mức, và một Call Trace không phải là sập</h3>
${lenh('s07/nhan', 4)}
<p>"Call Trace" trông đáng sợ. Cái này là một điểm lạ quen thuộc của ảo hoá: nhân thử ghi một thanh ghi đếm hiệu năng của CPU mà hypervisor không giả lập, cảnh báo một lần lúc khởi động, rồi chạy tiếp. Call trace nghĩa là "nhân đang chỉ cho bạn nó đang ở đâu"; nó chỉ là sập khi đi kèm những chữ như <code>Oops</code>, <code>BUG:</code>, <code>Kernel panic</code>, <code>general protection fault</code>, hoặc ngay sau đó máy chết. Cùng ý với dòng đĩa mềm ở bài 7.2:</p>
${lenh('s07/loc', 6)}
<p>Dòng đó cũng dạy luôn <strong>định dạng của lỗi I/O khối</strong>: thiết bị (<code>fd0</code>), sector, thao tác (<code>0x0:(READ)</code>, <code>0x1:(WRITE)</code>). Trên máy chủ thật, cùng dòng đó với <code>dev sda</code> hay <code>nvme0n1</code> là một ổ đĩa đang chết.</p>

<h3>Bước 3 — phần cứng mới cắm vào: USB</h3>
${lenh('s07/nhan', 6)}
${lenh('s07/nhan', 7)}
<p>Cắm một thiết bị là nhân viết một câu chuyện nhỏ: bus/cổng (<code>usb 1-1</code>), tốc độ, mã hãng:sản phẩm (<code>0627:0001</code>, tra mã này khi thiếu tên sản phẩm), hãng và số sê-ri. Đội bảo mật đọc các dòng này để trả lời "thứ Sáu có ai cắm USB vào máy chủ này không?". Lệnh thứ hai không thấy gì: các bản ghi lúc khởi động này nằm trong tệp journal mà lần dọn ở bài 7.4 đã xoá, còn vòng đệm thì vẫn giữ. Hai bản sao, hai tuổi thọ.</p>

<h3>Bước 4 — OOM killer bên trong một cgroup (giới hạn của một dịch vụ)</h3>
<p>Mỗi dịch vụ systemd sống trong cgroup riêng. <code>MemoryMax=</code> là trần cứng của cgroup đó; khi các tiến trình bên trong cần thêm, OOM killer của nhân giết một trong số chúng — phần còn lại của máy vẫn ổn.</p>
${lenh('s07/nhan', 9)}
${lenh('s07/nhan', 10)}
${lenh('s07/nhan', 11)}
<p>Đọc từ dưới lên:</p>
<ul>
<li><code>Memory cgroup out of memory: Killed process 10774 (python3)</code> — ai đã chết. <strong>"Memory cgroup"</strong> = chạm giới hạn của một cgroup, không phải hết RAM của máy.</li>
<li><code>total-vm:76596kB</code> = không gian địa chỉ ảo (đặt chỗ, chưa dùng); <code>anon-rss:61184kB</code> = heap/stack thực sự nằm trong RAM — 59,75 MiB, đúng bằng giới hạn 60 MB; <code>file-rss</code> = tệp được ánh xạ (thư viện); <code>shmem-rss</code> = bộ nhớ dùng chung. Con số quan trọng là <code>anon-rss</code>.</li>
<li><code>oom-kill:constraint=CONSTRAINT_MEMCG … oom_memcg=/system.slice/an-ram.service</code> — giới hạn nào bị chạm (của chính unit) và nạn nhân sống trong cgroup nào.</li>
<li><code>python3 invoked oom-killer: … oom_score_adj=0</code> — tiến trình xin bộ nhớ đúng lúc chạm giới hạn. Theo sau là stack trace và bảng tiến trình (bước 5).</li>
<li>Góc nhìn của systemd: <code>A process of this unit has been killed by the OOM killer</code>, <code>status=9/KILL</code>, <code>Failed with result 'oom-kill'</code>. Có <code>Restart=</code> thì dòng tiếp theo sẽ là "Scheduled restart job" — Lab 7.</li>
</ul>

<h3>Bước 5 — OOM killer cho cả máy</h3>
${lenh('s07/nhan', 13)}
${lenh('s07/nhan', 14)}
${lenh('s07/nhan-bang', 0)}
<ul>
<li><code>Out of memory: Killed process 10879 (python3) … anon-rss:813312kB</code> — không có chữ "Memory cgroup" ở đầu: <strong>cả máy</strong> đã hết (RAM 1 GB, <code>Free swap = 0kB</code>). <code>constraint=CONSTRAINT_NONE … global_oom</code> xác nhận điều đó.</li>
<li>Bảng tiến trình in theo <strong>trang 4 KiB</strong>: 203 328 trang ≈ 794 MiB cho python3 của ta — nạn nhân hiển nhiên. (Dòng python3 16 864 trang thuộc báo cáo cgroup một giây trước đó, lọt vào khung giờ của ta.) Nhân chọn nạn nhân theo <code>oom_score</code>, về cơ bản là lượng bộ nhớ dùng có điều chỉnh bởi <code>oom_score_adj</code>; các daemon như <code>systemd-udevd</code> (-1000) và <code>dbus-daemon</code> (-900) được bảo vệ.</li>
<li><strong>"invoked" không phải "bị giết".</strong> Tiến trình được nêu trong <code>X invoked oom-killer</code> chỉ là kẻ tình cờ xin bộ nhớ vào phút chót — trên máy chủ thật đó có thể là sshd hay cron trong khi nạn nhân là CSDL của bạn. Luôn đọc dòng <code>Killed process</code>.</li>
<li>Nhiều máy desktop và Fedora còn chạy <strong>systemd-oomd</strong>, giết cả cgroup sớm hơn dựa trên <em>áp lực</em> bộ nhớ; dòng của nó đến từ <code>systemd-oomd</code>, không phải từ nhân. Ubuntu Server (lab7) không chạy nó.</li>
</ul>

<h3>Bước 6 — segfault</h3>
${lenh('s07/nhan', 15)}
${lenh('s07/nhan', 16)}
<ul>
<li>Mã thoát <strong>139 = 128 + 11</strong>: bị giết bởi tín hiệu 11, SIGSEGV. Mọi mã thoát trên 128 đều là "128 + số tín hiệu" (137 = 128 + 9 = SIGKILL, hay gặp khi OOM).</li>
<li><code>segfault at 0</code> = địa chỉ chương trình định chạm vào: 0, con trỏ NULL. <code>ip</code> = lệnh máy đã làm việc đó, <code>sp</code> = con trỏ ngăn xếp.</li>
<li><code>error 4</code> = các bit của mã lỗi trang: 4 = từ chế độ người dùng, đọc, trang không tồn tại. (2 = đó là thao tác ghi, 1 = trang có nhưng vi phạm quyền.)</li>
<li><code>in libc.so.6[…+189000]</code> = thư viện chứa lệnh gây sập. Sập bên trong libc gần như luôn nghĩa là bên gọi đã đưa cho nó một con trỏ hỏng (ở đây là <code>ctypes.string_at(0)</code> của ta).</li>
<li>"(core dumped)": một ảnh bộ nhớ đã được lưu (Ubuntu giao cho apport; hệ khác cho <code>systemd-coredump</code> — <code>coredumpctl list</code>). Đó là thứ lập trình viên cần để gỡ lỗi.</li>
</ul>

<h3>Bước 7 — một ổ đĩa thôi trả lời</h3>
<p>Để thấy lỗi đĩa thật mà không phá phần cứng thật, ta dựng một đĩa ext4 64 MB trên device-mapper, gắn với <code>errors=remount-ro</code> (tuỳ chọn Ubuntu đặt cho phân vùng gốc trong <code>/etc/fstab</code>), rồi thay ánh xạ bằng đích <code>error</code>: mọi lần đọc ghi giờ đều thất bại, như một ổ đĩa đã chết.</p>
${lenh('s07/nhan', 18)}
${lenh('s07/nhan', 19)}
${lenh('s07/nhan', 20)}
${lenh('s07/nhan', 21)}
${lenh('s07/nhan', 22)}
${lenh('s07/nhan', 23)}
<p>Ứng dụng thấy: <code>Input/output error</code>. Nhân kể cho bạn, theo thứ tự:</p>
<ol>
<li><code>Buffer I/O error on dev dm-0, logical block 0, lost sync page write</code> — một lần ghi xuống thiết bị thất bại.</li>
<li><code>EXT4-fs (dm-0): I/O error while writing superblock</code> và <code>EXT4-fs error … __ext4_find_entry … reading directory lblock 0</code> — hệ thống tệp không đọc nổi thư mục của chính nó.</li>
<li><code>Aborting journal on device dm-0-8</code>, <code>JBD2: I/O error when updating journal superblock</code> — journal của ext4 (sổ an toàn khi sập của nó, không phải journald) bỏ cuộc.</li>
<li><code>Remounting filesystem read-only</code> — phản ứng tự vệ của <code>errors=remount-ro</code>: thà chỉ đọc còn hơn làm hỏng dữ liệu. Ứng dụng sau đó lỗi <code>Read-only file system</code> (EROFS).</li>
</ol>
<p>Khi app bỗng ghi "Read-only file system" hay "Input/output error", hãy đi thẳng tới <code>journalctl -k -p warning</code> và tìm các dòng này. Bước tiếp trên phần cứng thật: <code>smartctl -a /dev/sda</code>, console của cloud (ổ bị tháo hoặc bị bóp tốc độ), và bản sao lưu. Đừng nhầm với <code>No space left on device</code> (ENOSPC): đó là đĩa đầy, không phải đĩa hỏng.</p>

<h3>Góc hacker: nhân bị "tainted" và module lạ</h3>
<p>Rootkit giấu tiến trình và tệp thường nạp một module nhân. Nhân nhận ra một phần chuyện này và nói ra. Những dòng cần nhận biết:</p>
<ul>
<li><code>module verification failed: signature and/or required key missing - tainting kernel</code> — một module không có chữ ký vừa được nạp.</li>
<li><code>loading out-of-tree module taints kernel</code> — module không được biên dịch cùng nhân này (cũng bình thường với VirtualBox, NVIDIA, ZFS — hãy biết mốc bình thường của máy mình).</li>
<li>Trong mọi báo cáo Oops/OOM: <code>Not tainted</code> (Lab 7 có một dòng như vậy) hoặc <code>Tainted: P O E</code> — các chữ cái được giải nghĩa ở trang "Tainted kernels" của nhân.</li>
</ul>
<p>Nạp module nhân để bám trụ là MITRE ATT&amp;CK <strong>T1547.006</strong>. Kẻ tấn công mạnh còn có thể xoá vòng đệm (<code>dmesg -C</code>) — bản sao của journald và log đã gửi ra ngoài máy (Chương 15) là những gì còn lại. Và <code>dmesg_restrict</code> tồn tại chính vì thông điệp của nhân giúp kẻ tấn công tìm địa chỉ: đừng tắt nó cho "dễ gỡ lỗi".</p>

<h3>Tình huống đời thật</h3>
<ul>
<li><strong>"Dịch vụ Java cứ vài ngày lại chết, log của nó không có exception nào":</strong> <code>journalctl -k -g 'Killed process' --since -7d</code>. Nếu có, kèm <code>Memory cgroup</code>, thì giới hạn của container/unit quá thấp hoặc cấu hình heap (<code>-Xmx</code>) lớn hơn giới hạn; không có chữ đó thì cả máy ảo thiếu RAM.</li>
<li><strong>Docker:</strong> container bị giết vì giới hạn <code>--memory</code> hiện <code>OOMKilled: true</code> trong <code>docker inspect</code>, mã thoát 137, và cùng dòng nhân đó với đường cgroup của container (bài 13.1).</li>
<li><strong>"CSDL chuyển sang chỉ đọc trong đêm":</strong> tìm <code>EXT4-fs … Remounting filesystem read-only</code> hoặc <code>I/O error, dev …</code> ngay trước đó. Khởi động lại CSDL không sửa được ổ đĩa.</li>
</ul>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok"><ol>
<li>Bằng người dùng thường thử <code>dmesg</code>, rồi đọc 20 dòng nhân cuối bằng <code>journalctl -k</code> với sudo. Giải thích vì sao lệnh đầu thất bại.</li>
<li>Chạy <code>sudo systemd-run --unit=thu-oom -p MemoryMax=40M -p MemorySwapMax=0 --wait python3 -c 'import itertools; a = [bytearray(5 &lt;&lt; 20) for _ in itertools.count()]'</code>. Từ dòng của nhân, ghi ra: nạn nhân, PID, anon-rss theo MiB, giới hạn nào.</li>
<li>Làm một chương trình sập vì SIGSEGV; giải mã dòng <code>segfault at … error N in …</code> từng trường.</li>
<li>Tìm mọi dòng nhân từ mức warning trở lên trong lần khởi động hiện tại mà là <em>bình thường</em> trên máy bạn, và viết một ghi chú "mốc bình thường" một dòng cho mỗi dòng.</li>
<li>(Tuỳ chọn, chỉ trên máy ảo) Làm lại thí nghiệm device-mapper error và ghi lại thứ tự các thông điệp ext4.</li>
</ol>
<p><strong>Đạt khi:</strong> câu 1 nhắc tới <code>dmesg_restrict</code>; câu 2 có anon-rss ≈ 40 MiB và <code>CONSTRAINT_MEMCG</code>; câu 3 giải thích được địa chỉ, các bit lỗi và thư viện; câu 4 liệt kê ít nhất hai dòng vô hại kèm lý do; câu 5 kết thúc bằng "Remounting filesystem read-only".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['vòng đệm (ring buffer)', 'Bộ đệm thông điệp cỡ cố định của nhân trong RAM; đọc bằng dmesg, mất khi khởi động lại.'],
  ['journalctl -k', 'Thông điệp nhân do journald lưu; giờ thật, mọi lần khởi động, mọi bộ lọc.'],
  ['dmesg_restrict', 'sysctl giới hạn việc đọc vòng đệm chỉ cho root.'],
  ['OOM killer', 'Mã của nhân giết một tiến trình khi giới hạn của cgroup hoặc toàn bộ RAM cạn.'],
  ['anon-rss', 'Bộ nhớ ẩn danh (heap, stack) thực sự nằm trong RAM — mức dùng thật của nạn nhân.'],
  ['CONSTRAINT_MEMCG / global_oom', 'OOM do giới hạn của cgroup / do cả máy.'],
  ['mã thoát 128+N', 'Tiến trình bị tín hiệu N giết: 137 SIGKILL, 139 SIGSEGV, 134 SIGABRT.'],
  ['errors=remount-ro', 'Tuỳ chọn ext4: gặp lỗi I/O thì chuyển sang chỉ đọc thay vì liều làm hỏng dữ liệu.'],
  ['tainted', 'Cờ của nhân báo có chuyện không chuẩn đã xảy ra (module không ký/ngoài cây, Oops trước đó…).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dịch vụ chết không một lời? Đọc nhân: <code>journalctl -k -b -p warning</code>, và <code>sudo dmesg -T</code> cho phần journald đã mất.</li>
<li>"Memory cgroup out of memory" = giới hạn của unit/container; chỉ "Out of memory" = cả máy.</li>
<li>Đọc dòng <code>Killed process</code>, không phải dòng "invoked"; anon-rss là mức dùng thật.</li>
<li>Dòng segfault = địa chỉ, bit lỗi, thư viện; mã thoát 139.</li>
<li>Buffer I/O error → EXT4 error → Aborting journal → Remounting read-only = chuyện của ổ đĩa, không phải lỗi app.</li>
<li>Call trace và dòng đỏ không phải lúc nào cũng là hỏng — biết mốc bình thường của máy; biết "tainted" nghĩa là gì.</li>
</ul>
${nguon('📘', 'dmesg(1)', '-T, --level, -w và vòng đệm', 'https://man7.org/linux/man-pages/man1/dmesg.1.html')}
${nguon('📘', 'Nhân Linux — sysctl kernel.*', 'dmesg_restrict, kptr_restrict, cấu hình panic', 'https://docs.kernel.org/admin-guide/sysctl/kernel.html')}
${nguon('📘', 'Nhân Linux — cgroup v2', 'memory.max, memory.events, OOM bên trong cgroup', 'https://docs.kernel.org/admin-guide/cgroup-v2.html')}
${nguon('📘', 'Nhân Linux — Tainted kernels', 'Giải nghĩa các chữ cái sau "Tainted:"', 'https://docs.kernel.org/admin-guide/tainted-kernels.html')}
${nguon('🛡', 'MITRE ATT&CK T1547.006', 'Kernel Modules and Extensions', 'https://attack.mitre.org/techniques/T1547/006/')}
${lienKet({ khoa: 'operating-systems-for-developers', bai: 'os-2-6-nhat-ky', title: 'Hệ điều hành cho lập trình viên 2.6 — Nhật ký hệ thống', sub: 'Bộ nhớ, tiến trình và nhân nhìn từ phía hệ điều hành' })}
</div>
`,
};
