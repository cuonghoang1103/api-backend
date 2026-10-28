/**
 * Operating Systems for Developers — Chương 14: Windows và macOS cho lập trình viên (soạn 29/10/2026 theo _HOP-DONG.md).
 * Câu của chủ kênh: "linux, apple, windows đều là hệ điều hành sao?" — làm trên Mac Apple Silicon, học nhóm với bạn dùng
 * Windows + NetBeans, deploy lên Linux. Chương này đặt MỌI khái niệm Linux của khoá cạnh macOS và Windows.
 * Output CHẠY THẬT, ba nguồn (ghi rõ trong bài):
 *   • "-mac": lệnh CHỈ ĐỌC + chương trình của chính mình trên MÁY MAC soạn bài (macOS 27.0.1, MacBookPro18,2, 10 lõi 8P+2E,
 *     32 GiB, trang 16 KiB), không sudo, không đổi cài đặt; qua lab/code/ch14/an-danh.sh (tên người dùng → dev, tên máy →
 *     mac, thư mục nhà → /Users/dev, thư mục tạm → ~/ch14-demo). Máy đang bận (load 13–18) ⇒ số thời gian trên Mac nhiễu, bài nói rõ.
 *   • "-lx": container lab os-lab vứt đi (--label oslab=1): Linux 7.0.12-linuxkit trong máy ảo Docker Desktop.
 *   • "-pwsh": PowerShell 7.6.9 THẬT (tarball chính thức, sha256 khớp) chạy trên Linux trong container — nhãn "pwsh trên Linux".
 *   Windows: KHÔNG có máy Windows ⇒ mọi chỗ về Windows ghi nhãn "theo tài liệu, không đo" + link learn.microsoft.com.
 *   lab/code/ch14/chay-tat-ca.sh tạo lại toàn bộ: c141-mac/lx (nhân, syscall, trang), c142-mac/lx (fork/vfork/posix_spawn đo,
 *   số tín hiệu, sig.js), c143-mac (launchd, top, sample, lsof, fs_usage/dtruss cần root, log show), c144-mac/lx (vm_stat,
 *   compressor, swapfile, footprint; meminfo commit), c145-mac/lx (APFS sealed, hoa thường, clone, resource fork, quarantine,
 *   ACL, SIP; virtiofs không phân biệt hoa thường), c146-mac (máy ảo Docker, file nhỏ qua virtiofs vs overlay), c147-pwsh/mac
 *   (đường ống đối tượng, brew, bash 3.2), c148-mac/lx (path.win32, ntpath, File.separator, Config.properties, CRLF, autocrlf).
 * Thứ tự bài ≠ số trong slug: 4 slug đã seed từ khung (os-14-1-nhan, os-14-2-cong-cu, os-14-3-wsl, os-14-4-cross) GIỮ NGUYÊN;
 * bài mới os-14-5-tien-trinh, os-14-6-bo-nho, os-14-7-file-system, os-14-8-shell chen vào theo mạch học; quiz os-14-9-quiz.
 * Deck slide đánh theo SỐ BÀI trong tiêu đề (os-14-1 … os-14-8), như Chương 9.
 * Ranh giới: fork/exec ở 1.2, tín hiệu/mã thoát ở 1.4, PID 1 ở 1.5, quan sát Linux ở Ch2, page cache/swap/OOM ở Ch8, inode/quyền
 * ở Ch9, syscall ở Ch11, container ở Ch12 — chương này chỉ đặt chúng cạnh macOS/Windows, không dạy lại.
 * LUẬT escaping: < > → &lt; &gt;; & → &amp;; không backtick trần; ${ của bash → \${.
 */
import { run, src, card, kv, cmd, code } from './_ui.mjs';
import { lab } from './_lab.mjs';
import G141 from './giang/os-14-1.mjs';
import G142 from './giang/os-14-2.mjs';
import G143 from './giang/os-14-3.mjs';
import G144 from './giang/os-14-4.mjs';
import G145 from './giang/os-14-5.mjs';
import G146 from './giang/os-14-6.mjs';
import G147 from './giang/os-14-7.mjs';
import G148 from './giang/os-14-8.mjs';

const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);
const OS = (slug) => '/courses/operating-systems-for-developers/learn?lessonSlug=' + slug;
const OSG = (slug) => '/courses/operating-systems/learn?lessonSlug=' + slug;
/** Nhãn cho mọi đoạn về Windows: không có máy Windows để đo. */
const DOC_EN = '<em>(per the documentation, not measured)</em>';
const DOC_VI = '<em>(theo tài liệu, không đo)</em>';

export default {
  title: 'Chapter 14 — Windows and macOS for developers|||Chương 14 — Windows và macOS cho lập trình viên',
  description: 'Cùng kỹ năng, ba hệ điều hành: nhân Linux (nguyên khối) vs XNU (Mach + BSD) vs Windows NT (lai), lịch sử Unix → BSD → NeXT → macOS và VMS → NT; fork vs posix_spawn vs CreateProcess đo thật (fork 5 ms khi cha giữ 512 MiB trên Linux), số tín hiệu khác nhau (SIGUSR1 = 30 trên Mac, 10 trên Linux ⇒ mã thoát 138 nghĩa khác nhau), Ctrl handler của Windows; systemd vs launchd vs Windows Services, top vs Activity Monitor vs Task Manager, sample/fs_usage/dtruss; bộ nhớ nén và swapfile của macOS vs pagefile + commit limit của Windows; APFS (sealed, clone, resource fork, quarantine, SIP) vs NTFS (ACL, ADS, MAX_PATH) vs ext4, hoa thường; WSL2 và Docker Desktop là máy ảo — file nhỏ qua virtiofs chậm 10–25 lần; PowerShell (đối tượng) vs Bash (văn bản) chạy thật; brew/apt/winget; và viết code chạy cả ba: path.win32, CRLF, autocrlf, Config.properties, ma trận CI.',
  lessons: [
    /* ───────────────────────── 14.1 — Ba nhân ───────────────────────── */
    {
      title: '14.1 — Three kernels: Linux, XNU and Windows NT — one question, three answers|||14.1 — Ba nhân: Linux, XNU và Windows NT — một câu hỏi, ba câu trả lời',
      slug: 'os-14-1-nhan',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Linux, macOS và Windows đều là hệ điều hành — khác ở nhân: Linux nguyên khối có module, XNU lai (Mach + BSD + IOKit), NT lai (HAL, kernel, executive); cây phả hệ Unix → BSD → NeXTSTEP → macOS và VMS → NT; đo trên Mac thật: xnu-13432, launchd là PID 1, 254 kext, trang 16 KiB vs 4 KiB; số syscall write = 4 (macOS) vs 64 (Linux arm64) và vì sao chỉ Linux hứa giữ số syscall ổn định.',
      content: `${G141}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1</span>
<h2>Three kernels: Linux, XNU and Windows NT</h2>
<p class="lead">The question that started this chapter: <em>"Linux, Apple, Windows — are they all operating systems?"</em> Yes. All three do the jobs of Chapter 0: they share the CPU between processes, give each one virtual memory, turn a disk into files and guard who may touch what. They differ in the <strong>kernel</strong> that does it, in the libraries programs must go through, and in a thousand small conventions that bite a developer who moves between them. This lesson answers: <strong>what exactly is the same, what is different, and how do you see each kernel for yourself on the Mac in front of you?</strong> (OSG202 tells the general history in <a href="${OSG('osg202-1-2-lich-su-zoo')}">lesson 1.2</a>; here we measure it.)</p>

<h3>Kernel vs operating system: who is who</h3>
<p>"Linux" is strictly a kernel; Ubuntu is an operating system built around it. Apple's kernel is called <strong>XNU</strong> and the open-source core of macOS is <strong>Darwin</strong>; Windows' kernel is the <strong>NT kernel</strong> (<code>ntoskrnl.exe</code>). Everything else in the table is the userland a developer actually touches:</p>
<table>
<tr><th></th><th>Linux server (Ubuntu)</th><th>macOS</th><th>Windows 10/11</th></tr>
<tr><td>kernel</td><td>Linux (monolithic + modules)</td><td>XNU = Mach + BSD + IOKit (hybrid)</td><td>NT kernel + Executive + HAL (hybrid)</td></tr>
<tr><td>the C library programs must use</td><td>glibc (or musl) — optional, syscalls are stable</td><td><code>libSystem.B.dylib</code> — mandatory</td><td><code>ntdll.dll</code> + <code>kernel32.dll</code> (Win32) — mandatory</td></tr>
<tr><td>PID 1 / first process</td><td><code>systemd</code></td><td><code>launchd</code></td><td>System (PID 4), then smss → wininit → services.exe</td></tr>
<tr><td>default shell</td><td>bash</td><td>zsh</td><td>PowerShell / cmd</td></tr>
<tr><td>default file system</td><td>ext4 (xfs, btrfs)</td><td>APFS</td><td>NTFS</td></tr>
<tr><td>executable format</td><td>ELF</td><td>Mach-O</td><td>PE (.exe/.dll)</td></tr>
<tr><td>POSIX</td><td>"Unix-like", mostly compliant</td><td>certified UNIX (since 10.5)</td><td>not POSIX; Linux comes via WSL</td></tr>
</table>
<p>The Windows column is ${DOC_EN} — there is no Windows machine in this lab. Everything for Linux and macOS below is measured.</p>

<h3>One family tree, two roots</h3>
<ul>
<li><strong>Unix</strong> (Bell Labs, 1969) → <strong>BSD</strong> (Berkeley, from 1977) → <strong>NeXTSTEP</strong> (1989): Steve Jobs' NeXT put a BSD layer on top of the <strong>Mach</strong> microkernel from Carnegie Mellon. Apple bought NeXT in 1997; NeXTSTEP became <strong>Mac OS X 10.0</strong> (2001), then macOS, iOS, iPadOS, watchOS. The kernel kept its name: XNU, "X is Not Unix".</li>
<li><strong>Linux</strong> (1991, Linus Torvalds) is a rewrite from scratch that behaves like Unix but contains no Unix code. Together with the GNU tools it became the server operating system — your VPS, Docker's VM, Android's kernel.</li>
<li><strong>VMS</strong> (DEC, 1977) was designed by Dave Cutler's team. Microsoft hired Cutler in 1988 to build a new kernel: <strong>Windows NT 3.1</strong> (1993). Windows 2000, XP, 7, 10 and 11 all run that NT kernel; the old MS-DOS-based Windows 95/98/ME line died with ME.</li>
</ul>
<p>So macOS and Linux are cousins (both speak POSIX: <code>fork</code>, signals, file descriptors, <code>/</code> paths), while Windows is a different family with its own vocabulary (handles, <code>CreateProcess</code>, drive letters, <code>\\</code>). That single fact predicts most of the pitfalls in this chapter.</p>

<h3>Seeing the macOS kernel</h3>
${run('c141-mac', 'sw_vers', 4)}
<p>macOS 27.0.1 runs Darwin 27.0.0, and the version string names the kernel build: <code>xnu-13432.1.9</code>, for an ARM64 T6000-family chip. The machine has 10 cores of two kinds — 8 performance and 2 efficiency (<code>perflevel0/1</code>) — and 32 GiB of RAM. Note <code>hw.pagesize: 16384</code>: Apple Silicon uses <strong>16 KiB pages</strong>.</p>
<p>Next: who is PID 1, how many drivers (<em>kernel extensions</em>) are loaded, and which library a trivial program links — <code>otool -L</code> is macOS's <code>ldd</code>:</p>
${run('c141-mac', 'ps -o pid,ppid,user,comm -p 1', 3)}
<p>PID 1 is <code>launchd</code>, Apple's init and service manager in one (lesson 14.3). 254 kexts are loaded, all from Apple. And even <code>/usr/bin/true</code>, a program that does nothing, links exactly one library: <code>libSystem.B.dylib</code>. Keep that in mind for the system-call section below.</p>

<h3>Seeing the Linux kernel (inside Docker's VM)</h3>
${run('c141-mac', "docker run --rm --label oslab=1 --name os-c141-lx", 3)}
<p>The same physical CPU, seen through Docker Desktop's virtual machine: Linux 7.0.12-linuxkit, the same 10 cores — but <strong>4 KiB pages</strong>. Its PID 1 is <code>initd</code> (Docker's minimal init), and PID 2 is <code>kthreadd</code>, the parent of 172 kernel threads that Linux shows as ordinary processes (flush workers, per-CPU threads…). macOS hides its kernel threads inside <code>kernel_task</code>; Windows groups them under the "System" process (PID 4) ${DOC_EN}.</p>
${run('c141-lx', 'cat /proc/version')}
${run('c141-lx', 'wc -l', 2)}
<p>This Linux kernel was built by Docker with almost everything compiled in: 146 entries in <code>/sys/module</code> but only 5 loadable modules. A distribution kernel on a VPS usually loads dozens with <code>modprobe</code>. Either way it is <strong>one</strong> program in one address space — the definition of a monolithic kernel.</p>

<h3>Three designs: monolithic, hybrid, hybrid</h3>
<table>
<tr><th></th><th>Linux</th><th>XNU (macOS)</th><th>NT (Windows)</th></tr>
<tr><td>idea</td><td>one big kernel; file systems, drivers, network stack all in kernel mode; modules loaded at run time</td><td>Mach microkernel ideas (tasks, threads, ports = message IPC, VM objects) + a BSD layer (processes, POSIX, VFS, sockets, signals) + IOKit (C++ drivers)</td><td>layered: HAL (hardware), kernel (scheduling, interrupts), Executive (object, memory, I/O, process managers), drivers; Win32 is a "subsystem" on top of the native NT API</td></tr>
<tr><td>where it actually runs</td><td>kernel mode</td><td>all three parts in <strong>one</strong> kernel address space (a true microkernel would run BSD as a server process — too slow)</td><td>all in kernel mode; even the window manager core (<code>win32k.sys</code>) moved into the kernel in NT 4.0 for speed</td></tr>
<tr><td>what developers see</td><td>syscalls, <code>/proc</code>, <code>/sys</code></td><td>BSD syscalls + Mach traps, <code>sysctl</code>, no <code>/proc</code></td><td>Win32 API, handles, the registry, ETW events</td></tr>
</table>
<p>"Hybrid" means a microkernel's <em>structure</em> with a monolithic kernel's <em>deployment</em>. In practice all three run their file systems and drivers in kernel mode, which is why a bad driver can crash any of them — a kernel panic on macOS, a blue screen (bug check) on Windows, an oops/panic on Linux.</p>

<h3>The system call boundary: who may call the kernel directly</h3>
<p>Chapter 11 showed that every <code>printf</code> ends in a <code>write</code> system call with a <em>number</em>. Compare the numbers:</p>
${run('c141-lx', "grep -cE '^#define __NR_'", 2)}
${run('c141-mac', "SDK=$(xcrun --show-sdk-path)", 2)}
<p><code>write</code> is <strong>64</strong> on Linux arm64 and <strong>4</strong> on macOS; <code>fork</code> does not even exist on arm64 Linux (it is <code>clone</code>, 220). The bigger difference is the <em>promise</em> behind the numbers:</p>
<ul>
<li><strong>Linux</strong> promises never to break user space: a syscall number, once released, keeps its meaning. That is why static binaries, Go programs and container images run on any newer kernel.</li>
<li><strong>macOS</strong> ships the numbers in its SDK but supports only <code>libSystem</code> as the interface (<code>otool</code> above: even <code>true</code> links it). The Go team learned this the hard way; since Go 1.11, "on macOS and iOS, the runtime now uses libSystem.dylib instead of calling the kernel directly", to stay compatible with future macOS releases.</li>
<li><strong>Windows</strong> ${DOC_EN}: the stable interface is the Win32 API in <code>kernel32.dll</code>; the actual system call stubs live in <code>ntdll.dll</code>, and their numbers are undocumented and change between Windows builds. Calling them directly is something only malware and anti-cheat tools do.</li>
</ul>
<p>Same idea, three contracts: on Linux the <strong>kernel</strong> is the API; on macOS and Windows a <strong>system library</strong> is.</p>
${lab('syscall', 'write', 'en', 'One write() from user code into the kernel and back — the trap, the syscall number in a register, the table lookup. On macOS the number in that register would be 4; on Linux arm64 it is 64; on Windows the stub in ntdll picks it for you.', { tour: 'syscall-journey' })}
${lab('osmap', 'compare', 'en', 'One concept, three systems, side by side: start at cards 1–2 (the kernel, system-call numbers) and play on through all 15. Linux and macOS lines are real output from this chapter’s labs; the Windows column is marked “per documentation”.', { tour: 'osmap-compare' })}

<div class="pitfall co-tieu-de">
<p><strong>"It is Unix on my Mac, so the Linux server will behave the same."</strong> Cousins, not twins. Measured in this lesson alone: different syscall numbers, a 16 KiB page instead of 4 KiB, a different binary format (Mach-O vs ELF — a binary built on the Mac does not run in the container, and vice versa), a different init. Code that hard-codes <code>4096</code> as the page size computes wrong buffer and <code>mmap</code> alignments on Apple Silicon; ask the system instead — <code>sysconf(_SC_PAGESIZE)</code> in C, <code>getconf PAGESIZE</code> in a shell, <code>os.sysconf('SC_PAGE_SIZE')</code> in Python. And test on Linux before you deploy to Linux — the Docker lab of this course exists for exactly that.</p>
</div>

<h3>🧪 Practice (20–25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your study group has one Mac (you), two Windows laptops running NetBeans, and the project deploys to an Ubuntu VPS. Someone asks in the group chat: "Is WSL just Linux? Is macOS Linux?" You want to answer with one table built from real commands.</p>
<ol>
<li>On the Mac: <code>sw_vers</code>, <code>sysctl -n kern.version</code>, <code>sysctl hw.pagesize hw.ncpu</code>, <code>ps -o pid,comm -p 1</code>.</li>
<li>In the lab container: <code>uname -srm</code>, <code>getconf PAGESIZE</code>, <code>nproc</code>, and with <code>--pid=host</code> <code>ps -o pid,comm -p 1,2</code>.</li>
<li>Ask a Windows teammate to run in PowerShell: <code>[Environment]::OSVersion</code>, <code>Get-CimInstance Win32_OperatingSystem | Select Caption, Version</code> and <code>Get-Process -Id 4</code>.</li>
<li>Fill a 3-column table: kernel name and version, PID 1 (or the first process), page size, executable format.</li>
</ol>
<p><strong>Done when:</strong> your table shows three different kernels, explains in one sentence each why macOS is "Unix" but not Linux and why Windows is neither, and names the one library every macOS and Windows program must go through (libSystem, ntdll/kernel32).</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['kernel vs OS', 'The kernel is the privileged core (Linux, XNU, NT); the OS is the kernel plus libraries, init, shell and tools (Ubuntu, macOS, Windows).'],
  ['monolithic kernel', 'One program in kernel mode containing scheduler, memory manager, file systems, drivers and network stack (Linux; modules are loaded into it).'],
  ['hybrid kernel', 'Microkernel-style layers (Mach, NT Executive) that nevertheless run together in one kernel address space for speed (XNU, NT).'],
  ['XNU / Darwin', 'Apple’s kernel (Mach + BSD + IOKit) and the open-source OS core around it that macOS and iOS are built on.'],
  ['libSystem / ntdll', 'The system library every macOS / Windows program must use; the only supported way into the kernel there.'],
  ['syscall ABI stability', 'Linux’s promise that a released system call keeps its number and meaning forever — why containers and static binaries work.'],
  ['page size', '4 KiB on most Linux and Windows machines, 16 KiB on Apple Silicon macOS; never hard-code it.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Linux, macOS and Windows are all operating systems; their kernels are Linux, XNU and NT.</li>
<li>macOS descends from Unix via BSD and NeXTSTEP (Mach + BSD); Linux is a Unix-like rewrite; Windows NT descends from VMS — a different family.</li>
<li>Measured on this Mac: <code>xnu-13432.1.9</code>, <code>launchd</code> as PID 1, 254 kexts, 16 KiB pages; in Docker's VM: Linux 7.0.12, <code>initd</code> and <code>kthreadd</code>, 4 KiB pages.</li>
<li>Linux keeps syscall numbers stable (write = 64 on arm64); macOS (write = 4) and Windows only support their system library.</li>
<li>"Works on my Mac" ≠ "works on Linux": numbers, page size, binary format and init all differ — test in Linux.</li>
</ul>
${L('https://github.com/apple-oss-distributions/xnu', '📄', 'XNU source (Apple open source)', 'Mach, BSD and IOKit — the kernel of macOS and iOS.', 'Open')}
${L('https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/overview-of-windows-components', '📄', 'Overview of Windows components', 'User mode, kernel mode, the Executive, HAL and drivers — Microsoft’s own map of NT.', 'Open')}
${L('/cpu-lab/3d', '🧭', 'Where is the kernel in the computer? (3D)', 'Fly from the case to the core: the kernel is code in RAM that a CPU core runs in privileged mode — on all three OSes.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1</span>
<h2>Ba nhân: Linux, XNU và Windows NT</h2>
<p class="lead">Câu hỏi mở ra chương này: <em>"linux, apple, windows đều là hệ điều hành sao?"</em> Đúng vậy. Cả ba làm đúng những việc của Mục 0: chia CPU cho các tiến trình, cho mỗi tiến trình một bộ nhớ ảo, biến cái đĩa thành file và canh xem ai được đụng vào cái gì. Chúng khác nhau ở <strong>nhân</strong> làm những việc đó, ở thư viện mà chương trình buộc phải đi qua, và ở cả nghìn quy ước nhỏ chuyên cắn lập trình viên khi chuyển qua lại giữa chúng. Bài này trả lời: <strong>chính xác cái gì giống, cái gì khác, và làm sao tự nhìn thấy từng nhân ngay trên cái Mac trước mặt?</strong> (OSG202 kể lịch sử chung ở <a href="${OSG('osg202-1-2-lich-su-zoo')}">bài 1.2</a>; ở đây ta đo.)</p>

<h3>Nhân và hệ điều hành: ai là ai</h3>
<p>Nói chặt thì "Linux" là một nhân; Ubuntu là hệ điều hành dựng quanh nhân đó. Nhân của Apple tên là <strong>XNU</strong>, và phần lõi mã nguồn mở của macOS gọi là <strong>Darwin</strong>; nhân của Windows là <strong>nhân NT</strong> (<code>ntoskrnl.exe</code>). Mọi thứ còn lại trong bảng là phần "người dùng" mà lập trình viên thật sự chạm vào:</p>
<table>
<tr><th></th><th>Máy chủ Linux (Ubuntu)</th><th>macOS</th><th>Windows 10/11</th></tr>
<tr><td>nhân</td><td>Linux (nguyên khối + module)</td><td>XNU = Mach + BSD + IOKit (lai)</td><td>nhân NT + Executive + HAL (lai)</td></tr>
<tr><td>thư viện C chương trình phải dùng</td><td>glibc (hoặc musl) — không bắt buộc, syscall ổn định</td><td><code>libSystem.B.dylib</code> — bắt buộc</td><td><code>ntdll.dll</code> + <code>kernel32.dll</code> (Win32) — bắt buộc</td></tr>
<tr><td>PID 1 / tiến trình đầu tiên</td><td><code>systemd</code></td><td><code>launchd</code></td><td>System (PID 4), rồi smss → wininit → services.exe</td></tr>
<tr><td>shell mặc định</td><td>bash</td><td>zsh</td><td>PowerShell / cmd</td></tr>
<tr><td>hệ thống file mặc định</td><td>ext4 (xfs, btrfs)</td><td>APFS</td><td>NTFS</td></tr>
<tr><td>định dạng file chạy</td><td>ELF</td><td>Mach-O</td><td>PE (.exe/.dll)</td></tr>
<tr><td>POSIX</td><td>"giống Unix", tuân thủ gần hết</td><td>UNIX được chứng nhận (từ 10.5)</td><td>không phải POSIX; Linux đến qua WSL</td></tr>
</table>
<p>Cột Windows là ${DOC_VI} — phòng lab này không có máy Windows. Mọi thứ về Linux và macOS dưới đây đều đo thật.</p>

<h3>Một cây phả hệ, hai gốc</h3>
<ul>
<li><strong>Unix</strong> (Bell Labs, 1969) → <strong>BSD</strong> (Berkeley, từ 1977) → <strong>NeXTSTEP</strong> (1989): công ty NeXT của Steve Jobs đặt một lớp BSD lên trên vi nhân <strong>Mach</strong> của Carnegie Mellon. Apple mua NeXT năm 1997; NeXTSTEP thành <strong>Mac OS X 10.0</strong> (2001), rồi macOS, iOS, iPadOS, watchOS. Nhân giữ nguyên tên: XNU, "X is Not Unix".</li>
<li><strong>Linux</strong> (1991, Linus Torvalds) là bản viết lại từ đầu, hành xử như Unix nhưng không chứa dòng mã Unix nào. Cùng bộ công cụ GNU, nó thành hệ điều hành của máy chủ — VPS của bạn, máy ảo của Docker, nhân của Android.</li>
<li><strong>VMS</strong> (DEC, 1977) do nhóm của Dave Cutler thiết kế. Microsoft thuê Cutler năm 1988 để dựng một nhân mới: <strong>Windows NT 3.1</strong> (1993). Windows 2000, XP, 7, 10 và 11 đều chạy nhân NT đó; dòng Windows 95/98/ME dựa trên MS-DOS chết cùng ME.</li>
</ul>
<p>Vậy macOS và Linux là anh em họ (cùng nói POSIX: <code>fork</code>, tín hiệu, file descriptor, đường dẫn <code>/</code>), còn Windows là một dòng họ khác với từ vựng riêng (handle, <code>CreateProcess</code>, ổ đĩa có chữ cái, <code>\\</code>). Chỉ một sự thật đó đã đoán trước được phần lớn các cái bẫy trong chương.</p>

<h3>Nhìn nhân của macOS</h3>
${run('c141-mac', 'sw_vers', 4)}
<p>macOS 27.0.1 chạy Darwin 27.0.0, và chuỗi phiên bản ghi rõ bản dựng nhân: <code>xnu-13432.1.9</code>, cho chip ARM64 họ T6000. Máy có 10 lõi thuộc hai loại — 8 lõi hiệu năng và 2 lõi tiết kiệm (<code>perflevel0/1</code>) — và 32 GiB RAM. Để ý <code>hw.pagesize: 16384</code>: Apple Silicon dùng <strong>trang 16 KiB</strong>.</p>
<p>Tiếp theo: ai là PID 1, bao nhiêu driver (<em>kernel extension</em>, kext) đang nạp, và một chương trình tầm thường liên kết thư viện nào — <code>otool -L</code> là <code>ldd</code> của macOS:</p>
${run('c141-mac', 'ps -o pid,ppid,user,comm -p 1', 3)}
<p>PID 1 là <code>launchd</code>, vừa là init vừa là trình quản lý dịch vụ của Apple (bài 14.3). Có 254 kext đang nạp, đều của Apple. Và ngay cả <code>/usr/bin/true</code>, một chương trình không làm gì cả, cũng liên kết đúng một thư viện: <code>libSystem.B.dylib</code>. Nhớ điều này cho mục system call bên dưới.</p>

<h3>Nhìn nhân Linux (bên trong máy ảo của Docker)</h3>
${run('c141-mac', "docker run --rm --label oslab=1 --name os-c141-lx", 3)}
<p>Vẫn CPU vật lý đó, nhìn qua máy ảo của Docker Desktop: Linux 7.0.12-linuxkit, vẫn 10 lõi — nhưng <strong>trang 4 KiB</strong>. PID 1 của nó là <code>initd</code> (init tối giản của Docker), còn PID 2 là <code>kthreadd</code>, cha của 172 luồng nhân mà Linux cho hiện như tiến trình thường (luồng xả đĩa, luồng theo từng CPU…). macOS giấu luồng nhân trong <code>kernel_task</code>; Windows gom chúng dưới tiến trình "System" (PID 4) ${DOC_VI}.</p>
${run('c141-lx', 'cat /proc/version')}
${run('c141-lx', 'wc -l', 2)}
<p>Nhân Linux này được Docker dựng với gần như mọi thứ biên dịch sẵn vào trong: 146 mục trong <code>/sys/module</code> mà chỉ 5 module nạp rời. Nhân của một bản phân phối trên VPS thường nạp vài chục cái bằng <code>modprobe</code>. Đằng nào thì nó cũng là <strong>một</strong> chương trình trong một không gian địa chỉ — đúng định nghĩa nhân nguyên khối.</p>

<h3>Ba thiết kế: nguyên khối, lai, lai</h3>
<table>
<tr><th></th><th>Linux</th><th>XNU (macOS)</th><th>NT (Windows)</th></tr>
<tr><td>ý tưởng</td><td>một nhân lớn; hệ thống file, driver, chồng mạng đều ở chế độ nhân; module nạp lúc chạy</td><td>ý tưởng vi nhân Mach (task, thread, port = IPC bằng thông điệp, đối tượng VM) + lớp BSD (tiến trình, POSIX, VFS, socket, tín hiệu) + IOKit (driver C++)</td><td>xếp tầng: HAL (phần cứng), kernel (lập lịch, ngắt), Executive (quản lý đối tượng, bộ nhớ, I/O, tiến trình), driver; Win32 là một "subsystem" chạy trên API NT gốc</td></tr>
<tr><td>thật sự chạy ở đâu</td><td>chế độ nhân</td><td>cả ba phần trong <strong>một</strong> không gian địa chỉ nhân (vi nhân thật sẽ chạy BSD thành một tiến trình phục vụ — quá chậm)</td><td>tất cả ở chế độ nhân; đến cả lõi quản lý cửa sổ (<code>win32k.sys</code>) cũng được dời vào nhân từ NT 4.0 cho nhanh</td></tr>
<tr><td>lập trình viên thấy gì</td><td>syscall, <code>/proc</code>, <code>/sys</code></td><td>syscall BSD + Mach trap, <code>sysctl</code>, không có <code>/proc</code></td><td>Win32 API, handle, registry, sự kiện ETW</td></tr>
</table>
<p>"Lai" nghĩa là <em>cấu trúc</em> của vi nhân nhưng <em>cách triển khai</em> của nhân nguyên khối. Thực tế cả ba đều chạy hệ thống file và driver ở chế độ nhân, nên một driver tồi có thể làm sập bất kỳ cái nào — kernel panic trên macOS, màn hình xanh (bug check) trên Windows, oops/panic trên Linux.</p>

<h3>Ranh giới system call: ai được gọi thẳng vào nhân</h3>
<p>Chương 11 cho thấy mọi <code>printf</code> kết thúc bằng một system call <code>write</code> mang một <em>con số</em>. So các con số:</p>
${run('c141-lx', "grep -cE '^#define __NR_'", 2)}
${run('c141-mac', "SDK=$(xcrun --show-sdk-path)", 2)}
<p><code>write</code> là <strong>64</strong> trên Linux arm64 và <strong>4</strong> trên macOS; <code>fork</code> thậm chí không tồn tại trên Linux arm64 (nó là <code>clone</code>, số 220). Khác biệt lớn hơn nằm ở <em>lời hứa</em> đằng sau các con số:</p>
<ul>
<li><strong>Linux</strong> hứa không bao giờ làm hỏng phía người dùng: một số syscall đã phát hành thì giữ nguyên nghĩa mãi mãi. Vì thế file chạy liên kết tĩnh, chương trình Go và ảnh container chạy được trên mọi nhân mới hơn.</li>
<li><strong>macOS</strong> có kèm các con số trong SDK nhưng chỉ hỗ trợ <code>libSystem</code> làm giao diện (<code>otool</code> ở trên: đến <code>true</code> cũng liên kết nó). Nhóm Go đã học điều này theo cách đau: từ Go 1.11, "trên macOS và iOS, runtime dùng libSystem.dylib thay vì gọi thẳng vào nhân", để còn tương thích với các bản macOS sau.</li>
<li><strong>Windows</strong> ${DOC_VI}: giao diện ổn định là Win32 API trong <code>kernel32.dll</code>; các mẩu gọi system call thật nằm trong <code>ntdll.dll</code>, con số của chúng không được công bố và đổi giữa các bản dựng Windows. Gọi thẳng chúng là việc chỉ mã độc và phần mềm chống gian lận làm.</li>
</ul>
<p>Cùng một ý, ba bản hợp đồng: trên Linux, <strong>nhân</strong> chính là API; trên macOS và Windows, một <strong>thư viện hệ thống</strong> mới là API.</p>
${lab('syscall', 'write', 'vi', 'Một lời gọi write() đi từ code người dùng vào nhân rồi trở ra — cái bẫy, số syscall trong thanh ghi, tra bảng. Trên macOS con số trong thanh ghi đó là 4; trên Linux arm64 là 64; trên Windows mẩu mã trong ntdll chọn hộ bạn.', { tour: 'syscall-journey' })}
${lab('osmap', 'compare', 'vi', 'Một khái niệm, ba hệ điều hành, đặt cạnh nhau: bắt đầu ở thẻ 1–2 (nhân, số hiệu lời gọi hệ thống) rồi chạy tiếp qua cả 15 thẻ. Dòng Linux và macOS là output thật từ lab của chương; cột Windows ghi rõ “theo tài liệu”.', { tour: 'osmap-compare' })}

<div class="pitfall co-tieu-de">
<p><strong>"Mac của tôi là Unix, nên máy chủ Linux sẽ chạy y như vậy."</strong> Anh em họ, không phải sinh đôi. Chỉ riêng bài này đã đo được: số syscall khác, trang 16 KiB thay vì 4 KiB, định dạng file chạy khác (Mach-O vs ELF — file dựng trên Mac không chạy trong container, và ngược lại), init khác. Code viết cứng <code>4096</code> làm cỡ trang sẽ tính sai bộ đệm và căn lề <code>mmap</code> trên Apple Silicon; hãy hỏi hệ thống — <code>sysconf(_SC_PAGESIZE)</code> trong C, <code>getconf PAGESIZE</code> trong shell, <code>os.sysconf('SC_PAGE_SIZE')</code> trong Python. Và thử trên Linux trước khi deploy lên Linux — phòng lab Docker của khoá này tồn tại đúng cho việc đó.</p>
</div>

<h3>🧪 Thực hành (20–25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> nhóm học của bạn có một máy Mac (bạn), hai laptop Windows chạy NetBeans, và dự án deploy lên một VPS Ubuntu. Có người hỏi trong nhóm chat: "WSL có phải chính là Linux không? macOS có phải Linux không?" Bạn muốn trả lời bằng một bảng dựng từ lệnh thật.</p>
<ol>
<li>Trên Mac: <code>sw_vers</code>, <code>sysctl -n kern.version</code>, <code>sysctl hw.pagesize hw.ncpu</code>, <code>ps -o pid,comm -p 1</code>.</li>
<li>Trong container lab: <code>uname -srm</code>, <code>getconf PAGESIZE</code>, <code>nproc</code>, và với <code>--pid=host</code> chạy <code>ps -o pid,comm -p 1,2</code>.</li>
<li>Nhờ bạn dùng Windows chạy trong PowerShell: <code>[Environment]::OSVersion</code>, <code>Get-CimInstance Win32_OperatingSystem | Select Caption, Version</code> và <code>Get-Process -Id 4</code>.</li>
<li>Điền một bảng 3 cột: tên và phiên bản nhân, PID 1 (hoặc tiến trình đầu tiên), cỡ trang, định dạng file chạy.</li>
</ol>
<p><strong>Đạt khi:</strong> bảng của bạn cho thấy ba nhân khác nhau, giải thích mỗi ý một câu vì sao macOS là "Unix" mà không phải Linux và vì sao Windows chẳng phải cái nào, và gọi tên thư viện mà mọi chương trình macOS và Windows phải đi qua (libSystem, ntdll/kernel32).</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['kernel vs OS (nhân và hệ điều hành)', 'Nhân là lõi đặc quyền (Linux, XNU, NT); hệ điều hành là nhân cộng thư viện, init, shell và công cụ (Ubuntu, macOS, Windows).'],
  ['monolithic kernel (nhân nguyên khối)', 'Một chương trình ở chế độ nhân chứa bộ lập lịch, quản lý bộ nhớ, hệ thống file, driver và chồng mạng (Linux; module được nạp vào nó).'],
  ['hybrid kernel (nhân lai)', 'Các tầng kiểu vi nhân (Mach, NT Executive) nhưng vẫn chạy chung một không gian địa chỉ nhân cho nhanh (XNU, NT).'],
  ['XNU / Darwin', 'Nhân của Apple (Mach + BSD + IOKit) và phần lõi mã nguồn mở bao quanh nó, nền của macOS và iOS.'],
  ['libSystem / ntdll', 'Thư viện hệ thống mà mọi chương trình macOS / Windows phải dùng; lối vào nhân duy nhất được hỗ trợ ở đó.'],
  ['syscall ABI stability (ABI syscall ổn định)', 'Lời hứa của Linux: một system call đã phát hành giữ nguyên số và nghĩa mãi mãi — lý do container và file chạy tĩnh hoạt động.'],
  ['page size (cỡ trang)', '4 KiB trên hầu hết máy Linux và Windows, 16 KiB trên macOS Apple Silicon; đừng bao giờ viết cứng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Linux, macOS và Windows đều là hệ điều hành; nhân của chúng là Linux, XNU và NT.</li>
<li>macOS đi xuống từ Unix qua BSD và NeXTSTEP (Mach + BSD); Linux là bản viết lại giống Unix; Windows NT đi xuống từ VMS — một dòng họ khác.</li>
<li>Đo trên Mac này: <code>xnu-13432.1.9</code>, <code>launchd</code> là PID 1, 254 kext, trang 16 KiB; trong máy ảo Docker: Linux 7.0.12, <code>initd</code> và <code>kthreadd</code>, trang 4 KiB.</li>
<li>Linux giữ số syscall ổn định (write = 64 trên arm64); macOS (write = 4) và Windows chỉ hỗ trợ thư viện hệ thống của mình.</li>
<li>"Chạy trên Mac tôi" ≠ "chạy trên Linux": con số, cỡ trang, định dạng file chạy và init đều khác — hãy thử trên Linux.</li>
</ul>
${L('https://github.com/apple-oss-distributions/xnu', '📄', 'Mã nguồn XNU (mã nguồn mở của Apple)', 'Mach, BSD và IOKit — nhân của macOS và iOS.', 'Mở')}
${L('https://learn.microsoft.com/en-us/windows-hardware/drivers/kernel/overview-of-windows-components', '📄', 'Overview of Windows components', 'Chế độ người dùng, chế độ nhân, Executive, HAL và driver — bản đồ NT của chính Microsoft.', 'Mở')}
${L('/cpu-lab/3d', '🧭', 'Nhân nằm ở đâu trong máy? (3D)', 'Bay từ vỏ máy vào lõi CPU: nhân là mã trong RAM được một lõi chạy ở chế độ đặc quyền — trên cả ba hệ điều hành.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 14.2 — Tiến trình, luồng, tín hiệu ───────────────────────── */
    {
      title: '14.2 — Processes, threads and signals: fork vs posix_spawn vs CreateProcess, measured|||14.2 — Tiến trình, luồng và tín hiệu: fork vs posix_spawn vs CreateProcess, đo thật',
      slug: 'os-14-5-tien-trinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba cách khai sinh một tiến trình: fork+exec (Unix), posix_spawn (một lời gọi, có trên Linux và macOS), CreateProcess (Windows, không có fork); đo cùng một chương trình C trên Mac và Linux: fork vọt lên 5 ms khi cha giữ 512 MiB trên Linux còn posix_spawn đứng ~0,2 ms; strace thấy posix_spawn của glibc là clone(CLONE_VM|CLONE_VFORK); luồng 1:1 ở cả ba; số tín hiệu khác nhau (SIGUSR1 = 30 trên Mac, 10 trên Linux ⇒ mã thoát 138 nghĩa khác), sig.js dừng êm y nhau; Windows không có tín hiệu — Ctrl handler, và SIGTERM của Node không bao giờ tới.',
      content: `${G142}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2</span>
<h2>Processes, threads and signals on three systems</h2>
<p class="lead">Your code starts other programs all the time: Java's <code>ProcessBuilder</code> runs <code>git</code> or <code>ffmpeg</code>, Node's <code>child_process.spawn</code> runs a build step, Python's <code>subprocess</code> runs a shell command — and when the server is stopped, it must shut down cleanly. Chapter 1 showed how Linux does both (<a href="${OS('os-1-2-fork-exec')}">fork/exec</a>, <a href="${OS('os-1-4-vong-doi')}">signals and exit codes</a>). This lesson asks: <strong>what does macOS do, what does Windows do, and do the differences change the cost or the behaviour of your code?</strong> One C program, run on both sides, gives the numbers.</p>

<h3>Three ways to start a program</h3>
<table>
<tr><th></th><th>how</th><th>where</th></tr>
<tr><td><code>fork()</code> + <code>exec()</code></td><td>two steps: clone the whole parent (copy-on-write), then replace the clone with a new program. Between the two, the child can rearrange fds, change directory, drop privileges — the reason shells love it.</td><td>Linux, macOS (BSD)</td></tr>
<tr><td><code>vfork()</code> + <code>exec()</code></td><td>the child borrows the parent's memory and the parent is frozen until <code>exec</code>; nothing is copied. Fast and dangerous (the child must do almost nothing).</td><td>Linux, macOS (deprecated there)</td></tr>
<tr><td><code>posix_spawn()</code></td><td>one call: "run this file with these arguments, these fd actions, this environment". The library or kernel picks the fastest way.</td><td>POSIX: Linux (in glibc), macOS (a real system call, number 244 — lesson 14.1)</td></tr>
<tr><td><code>CreateProcess()</code></td><td>one call: name an <code>.exe</code>, pass the command line as <strong>one string</strong>, an environment block and flags; the kernel builds a fresh address space from the image. There is <strong>no fork</strong>.</td><td>Windows ${DOC_EN}</td></tr>
</table>
<p>Runtimes hide the choice. Java's <code>ProcessBuilder</code> on Linux and macOS starts children through <code>posix_spawn</code> and a tiny helper (<code>jspawnhelper</code>); Python's <code>subprocess</code> and Node's <code>child_process</code> pick vfork/posix_spawn-style paths when they can. On Windows all of them end in <code>CreateProcess</code>. The program below measures the three Unix paths directly:</p>
${src('ch14/spawn.c')}

<h3>Measured on Linux (Docker's VM, idle)</h3>
${run('c142-lx', 'cat /proc/loadavg', 2)}
<p>With a small parent, all three take about 0.2–0.4 ms. With a parent that has touched <strong>512 MiB</strong>, <code>fork+exec</code> jumps to <strong>5.0–5.2 ms</strong> — twenty times slower — while <code>vfork</code> and <code>posix_spawn</code> stay at ~0.2 ms. <code>fork</code> must copy the page tables for 131,072 pages of 4 KiB and mark them copy-on-write (<a href="${OS('os-7-3-page-fault')}">lesson 7.3</a>), only for <code>exec</code> to throw all of it away a microsecond later. (The program asks Linux for real 4 KiB pages with <code>MADV_NOHUGEPAGE</code>; with transparent huge pages the same memory is 256 entries of 2 MiB and the effect nearly disappears.) How does glibc's <code>posix_spawn</code> avoid the copy?</p>
${run('c142-lx', 'strace -f -e trace=clone')}
<p>The first <code>clone</code> (plain flags) is our <code>fork</code>. The <code>vfork</code> and the <code>posix_spawn</code> are both <code>clone(CLONE_VM|CLONE_VFORK)</code>: the child shares the parent's memory and the parent sleeps until the child calls <code>execve</code>. glibc first tries the newer <code>clone3</code>, gets <code>ENOSYS</code> from Docker's seccomp profile (<a href="${OS('os-11-4-seccomp')}">lesson 11.4</a>) and falls back.</p>
${lab('cow', 'fork', 'en', 'What fork() really copies: page-table entries marked copy-on-write, not the pages themselves — and why that bill grows with the size of the parent.')}

<h3>Measured on macOS (this Mac, busy)</h3>
${run('c142-mac', 'sysctl -n vm.loadavg', 2)}
<p>Read these with care: the Mac was busy (load average 18 on 10 cores), so each number wobbles by ±30 %. Even so, two things are clear. Starting a process on macOS costs <strong>1.3–2.2 ms</strong>, five to ten times Linux's 0.2 ms; most of that is <code>exec</code>, not <code>fork</code> — loading the Mach-O binary through <code>dyld</code>, mapping <code>libSystem</code> and checking code signatures happen on every launch. And <code>posix_spawn</code> is the fastest path again. Here the 512 MiB parent made no measurable difference to <code>fork</code>; with 16 KiB pages there are 4× fewer entries to copy, and the gap disappears in the noise of the exec cost. Practical rule on both systems: <strong>a big process that starts many children should use <code>posix_spawn</code></strong> (or a runtime that does) — a 3 GB JVM that forks pays for its 3 GB every time.</p>
<p>On Windows ${DOC_EN} process creation is known to be expensive too: the kernel creates a process object, maps the image, the Win32 subsystem is notified, and antivirus filters inspect the new image. That is why tools that start one process per file — shell scripts, <code>make</code>, Git hooks — feel noticeably slower on a Windows laptop than on the Mac or the VPS.</p>
${lab('process', 'shell', 'en', 'A shell running one command: fork → exec → wait. On Windows the first two boxes merge into one CreateProcess call — there is no moment where a copy of the shell exists.', { tour: 'process-shell' })}
${lab('osmap', 'linux', 'en', 'Go to cards 4–5 (starting a process, signals and exit codes) and switch Linux → macOS → Windows: fork at 512 MiB vs posix_spawn, and why USR1 is exit 138 on Linux but 158 on macOS.')}

<h3>Threads: the one thing that is (almost) the same</h3>
<p>All three kernels schedule <strong>threads</strong>, and all three map each user thread to one kernel thread (1:1): pthreads on Linux and macOS, <code>CreateThread</code> on Windows. Java threads, .NET threads and Node's helper threads are kernel threads on every system. The same Node program shows the same 7 threads on both sides (main thread, 4 libuv workers, V8 platform threads):</p>
${run('c142-mac', 'node sig.js', 1)}
${run('c142-lx', 'node sig.js', 1)}
<p>Only the tool differs: <code>/proc/PID/task</code> on Linux, <code>ps -M</code> on macOS, the "Threads" column of Task Manager or <code>(Get-Process -Id N).Threads</code> on Windows. Schedulers differ in detail — macOS prefers the efficiency cores for low-QoS work, Windows boosts the foreground window's threads — but your concurrency bugs (Chapters 5–6) are identical everywhere.</p>

<h3>Signals: same names, different numbers — and none on Windows</h3>
${run('c142-mac', '/bin/kill -l')}
${run('c142-lx', 'kill -l | head -4')}
<p>macOS keeps the BSD order: <code>SIGBUS</code> is 10, <code>SIGUSR1</code> 30. Linux uses <code>SIGBUS</code> 7 and <code>SIGUSR1</code> 10. Only a few numbers are fixed by POSIX for <code>kill -N</code>: 1 HUP, 2 INT, 3 QUIT, 6 ABRT, 9 KILL, 14 ALRM, 15 TERM. Everything else must be used <strong>by name</strong>. The exit code of a killed process is 128 + number, so the same code means different things:</p>
${run('c142-mac', "sh -c 'kill -USR1", 2)}
${run('c142-lx', "sh -c 'kill -USR1", 2)}
<p>An exit code of <strong>138</strong> is SIGUSR1 on Linux but a <strong>bus error</strong> on macOS. 137 (SIGKILL) and 143 (SIGTERM) agree everywhere, which is why Chapter 1's "137 = killed" rule travels well.</p>
<p><strong>Windows has no signals</strong> ${DOC_EN}. A console program receives <em>control events</em> through <code>SetConsoleCtrlHandler</code>: <code>CTRL_C_EVENT</code> (0), <code>CTRL_BREAK_EVENT</code> (1), <code>CTRL_CLOSE_EVENT</code> (2, the window is closed; about 5 s to clean up), <code>CTRL_LOGOFF_EVENT</code> (5) and <code>CTRL_SHUTDOWN_EVENT</code> (6). The system runs the handler <strong>on a new thread</strong> it creates in your process. A service gets a <code>SERVICE_CONTROL_STOP</code> from the Service Control Manager instead (lesson 14.3). "Killing" is <code>TerminateProcess</code>: immediate, no handler, like SIGKILL. Node maps this as follows, per its documentation: <code>SIGINT</code> (Ctrl+C) works on all platforms; <code>SIGBREAK</code> is Ctrl+Break; <code>SIGHUP</code> arrives when the console window closes, and Windows kills Node about 10 seconds later; <code>'SIGTERM' is not supported on Windows, it can be listened on</code> — the listener simply never fires; and <code>process.kill(pid, 'SIGTERM')</code> causes "unconditional termination".</p>
${src('ch14/sig.js', 'js')}
<p>On macOS and Linux this handler runs and the process exits 0 after ~0.5 s (above). On a Windows teammate's laptop, the SIGINT branch runs when they press Ctrl+C in the terminal; the SIGTERM branch never runs.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Graceful shutdown works in production but the Windows dev box loses data."</strong> On Linux, Docker and Kubernetes stop a container with SIGTERM (lesson 1.5), so code that only listens for <code>SIGTERM</code> passes every test on the VPS. On Windows that listener never fires: an IDE "Stop" button or <code>process.kill</code> terminates the process immediately, and Ctrl+C sends SIGINT. Handle <strong>both</strong> <code>SIGINT</code> and <code>SIGTERM</code> (Java: a shutdown hook, which the JVM runs on SIGTERM, SIGINT and Ctrl+C alike; Spring Boot does it for you), flush and close on either, and never rely on a signal for correctness — commit work as you go. And never write <code>kill -10</code> in a script: on a Mac that is SIGBUS.</p>
</div>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a teammate's Express server keeps leaving half-written JSON files when they stop it from NetBeans on Windows, but never on the VPS. You need to show why, and make the shutdown path identical on all three systems.</p>
<ol>
<li>Compile <code>spawn.c</code> on your Mac (<code>clang -O2</code>) and in the lab (<code>gcc -O2</code>); run <code>./spawn 300 0</code> and <code>./spawn 300 512</code> on each and record the four rows.</li>
<li>In the lab, run <code>strace -f -e trace=clone,clone3,vfork,execve ./spawn 1 0</code> and mark which line is <code>fork</code>, which <code>vfork</code>, which <code>posix_spawn</code>.</li>
<li>Run <code>sh -c 'kill -USR1 $$'; echo $?</code> on the Mac and in the lab, then the same with <code>-BUS</code>. Write down which exit code collides.</li>
<li>Change <code>sig.js</code> so the same cleanup function runs for SIGINT, SIGTERM and (on Windows) SIGBREAK, and writes its file with the tmp → rename pattern of lesson 9.2.</li>
</ol>
<p><strong>Done when:</strong> your table shows fork's cost growing with parent memory on Linux but not posix_spawn's; you can explain exit 138 on each OS; and <code>sig.js</code> exits 0 after a clean close on both Mac and Linux — with a note that on Windows only Ctrl+C/Ctrl+Break reach it.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['posix_spawn', 'One-call process creation from POSIX; glibc implements it with clone(CLONE_VM|CLONE_VFORK), macOS as a system call — avoids copying the parent.'],
  ['vfork', 'Fork that shares the parent’s memory and freezes the parent until exec; fast, deprecated on macOS, the basis of posix_spawn on Linux.'],
  ['CreateProcess', 'Windows’ only way to start a program: image path + one command-line string + environment + flags; no fork exists.'],
  ['1:1 threading', 'Each user thread is one kernel thread — true for pthreads on Linux/macOS and Windows threads.'],
  ['signal number', 'Names are portable, numbers are not: SIGUSR1 = 10 on Linux, 30 on macOS; only 1, 2, 3, 6, 9, 14, 15 are fixed.'],
  ['console control event', 'Windows’ replacement for signals in console programs: CTRL_C, CTRL_BREAK, CTRL_CLOSE, LOGOFF, SHUTDOWN, delivered on a new thread.'],
  ['TerminateProcess', 'Immediate kill on Windows (no handler runs) — what Node’s process.kill does there.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Unix starts programs in two steps (fork + exec), Windows in one (CreateProcess); <code>posix_spawn</code> is the portable one-step call on Linux and macOS.</li>
<li>Measured on Linux: fork+exec 0.26 → 5.2 ms when the parent holds 512 MiB; posix_spawn and vfork stay ~0.2 ms (clone with CLONE_VM|CLONE_VFORK).</li>
<li>Measured on macOS (busy machine): every launch costs 1.3–2.2 ms, dominated by exec; posix_spawn is still the fastest.</li>
<li>Threads are 1:1 kernel threads everywhere; the same Node program has 7 on Mac and Linux.</li>
<li>Signal numbers differ (138 = SIGUSR1 on Linux, SIGBUS on Mac); Windows has no signals — handle SIGINT and SIGTERM, and expect hard termination.</li>
</ul>
${L('https://man7.org/linux/man-pages/man3/posix_spawn.3.html', '📄', 'man 3 posix_spawn', 'How glibc creates the child with CLONE_VM|CLONE_VFORK, and the file actions you can attach.', 'Open')}
${L('https://learn.microsoft.com/en-us/windows/console/handlerroutine', '📄', 'HandlerRoutine (Windows console)', 'The five control events, the new thread, and the timeouts Windows gives a console program.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2</span>
<h2>Tiến trình, luồng và tín hiệu trên ba hệ điều hành</h2>
<p class="lead">Code của bạn khởi động chương trình khác suốt: <code>ProcessBuilder</code> của Java chạy <code>git</code> hay <code>ffmpeg</code>, <code>child_process.spawn</code> của Node chạy một bước build, <code>subprocess</code> của Python chạy một lệnh shell — và khi máy chủ bị dừng, nó phải tắt êm. Chương 1 đã cho thấy Linux làm cả hai việc ra sao (<a href="${OS('os-1-2-fork-exec')}">fork/exec</a>, <a href="${OS('os-1-4-vong-doi')}">tín hiệu và mã thoát</a>). Bài này hỏi: <strong>macOS làm gì, Windows làm gì, và những khác biệt đó có đổi chi phí hay hành vi code của bạn không?</strong> Một chương trình C, chạy ở cả hai phía, cho ra con số.</p>

<h3>Ba cách khởi động một chương trình</h3>
<table>
<tr><th></th><th>cách làm</th><th>ở đâu</th></tr>
<tr><td><code>fork()</code> + <code>exec()</code></td><td>hai bước: nhân bản cả tiến trình cha (copy-on-write), rồi thay bản sao bằng chương trình mới. Giữa hai bước, đứa con được sắp lại fd, đổi thư mục, bỏ bớt quyền — lý do shell rất thích nó.</td><td>Linux, macOS (BSD)</td></tr>
<tr><td><code>vfork()</code> + <code>exec()</code></td><td>đứa con mượn luôn bộ nhớ của cha và cha bị đứng hình tới khi <code>exec</code>; không chép gì cả. Nhanh và nguy hiểm (đứa con gần như không được làm gì).</td><td>Linux, macOS (ở đó đã lỗi thời)</td></tr>
<tr><td><code>posix_spawn()</code></td><td>một lời gọi: "chạy file này với các đối số này, các thao tác fd này, môi trường này". Thư viện hoặc nhân tự chọn cách nhanh nhất.</td><td>POSIX: Linux (trong glibc), macOS (system call thật, số 244 — bài 14.1)</td></tr>
<tr><td><code>CreateProcess()</code></td><td>một lời gọi: chỉ ra một file <code>.exe</code>, đưa dòng lệnh dưới dạng <strong>một chuỗi</strong>, một khối biến môi trường và các cờ; nhân dựng không gian địa chỉ mới từ ảnh chương trình. <strong>Không có fork</strong>.</td><td>Windows ${DOC_VI}</td></tr>
</table>
<p>Runtime giấu lựa chọn này đi. <code>ProcessBuilder</code> của Java trên Linux và macOS khởi động tiến trình con qua <code>posix_spawn</code> và một trình trợ giúp tí hon (<code>jspawnhelper</code>); <code>subprocess</code> của Python và <code>child_process</code> của Node chọn lối kiểu vfork/posix_spawn khi có thể. Trên Windows tất cả đều kết thúc ở <code>CreateProcess</code>. Chương trình dưới đây đo thẳng ba lối của Unix:</p>
${src('ch14/spawn.c')}

<h3>Đo trên Linux (máy ảo của Docker, đang rảnh)</h3>
${run('c142-lx', 'cat /proc/loadavg', 2)}
<p>Với tiến trình cha nhỏ, cả ba mất khoảng 0,2–0,4 ms. Với tiến trình cha đã chạm <strong>512 MiB</strong>, <code>fork+exec</code> vọt lên <strong>5,0–5,2 ms</strong> — chậm hai mươi lần — trong khi <code>vfork</code> và <code>posix_spawn</code> vẫn ~0,2 ms. <code>fork</code> phải chép bảng trang cho 131.072 trang 4 KiB và đánh dấu chúng copy-on-write (<a href="${OS('os-7-3-page-fault')}">bài 7.3</a>), chỉ để <code>exec</code> vứt hết đi một micro giây sau. (Chương trình xin Linux trang 4 KiB thật bằng <code>MADV_NOHUGEPAGE</code>; với transparent huge page, cùng lượng bộ nhớ đó chỉ là 256 mục 2 MiB và hiệu ứng gần như biến mất.) Vậy <code>posix_spawn</code> của glibc tránh việc chép bằng cách nào?</p>
${run('c142-lx', 'strace -f -e trace=clone')}
<p><code>clone</code> đầu tiên (cờ thường) là <code>fork</code> của ta. <code>vfork</code> và <code>posix_spawn</code> đều là <code>clone(CLONE_VM|CLONE_VFORK)</code>: đứa con dùng chung bộ nhớ với cha và cha ngủ tới khi con gọi <code>execve</code>. glibc thử <code>clone3</code> mới hơn trước, nhận <code>ENOSYS</code> từ hồ sơ seccomp của Docker (<a href="${OS('os-11-4-seccomp')}">bài 11.4</a>) rồi lùi về.</p>
${lab('cow', 'fork', 'vi', 'fork() thật sự chép gì: các mục bảng trang được đánh dấu copy-on-write, không phải bản thân các trang — và vì sao hoá đơn đó tăng theo độ lớn của tiến trình cha.')}

<h3>Đo trên macOS (chính máy Mac này, đang bận)</h3>
${run('c142-mac', 'sysctl -n vm.loadavg', 2)}
<p>Đọc các số này cẩn thận: máy Mac đang bận (load average 18 trên 10 lõi), nên mỗi số dao động ±30 %. Dù vậy, hai điều vẫn rõ. Khởi động một tiến trình trên macOS tốn <strong>1,3–2,2 ms</strong>, gấp năm tới mười lần mức 0,2 ms của Linux; phần lớn là ở <code>exec</code>, không phải <code>fork</code> — nạp file Mach-O qua <code>dyld</code>, ánh xạ <code>libSystem</code> và kiểm chữ ký mã diễn ra ở mỗi lần chạy. Và <code>posix_spawn</code> lại là lối nhanh nhất. Ở đây tiến trình cha 512 MiB không làm <code>fork</code> chậm đi đo được; với trang 16 KiB thì số mục phải chép ít hơn 4 lần, và chênh lệch chìm trong độ nhiễu của chi phí exec. Luật thực hành ở cả hai hệ: <strong>một tiến trình lớn khởi động nhiều tiến trình con thì nên dùng <code>posix_spawn</code></strong> (hoặc runtime làm hộ việc đó) — một JVM 3 GB mà fork thì trả giá cho 3 GB đó mỗi lần.</p>
<p>Trên Windows ${DOC_VI} việc tạo tiến trình cũng nổi tiếng là đắt: nhân tạo một đối tượng tiến trình, ánh xạ ảnh chương trình, báo cho subsystem Win32, và bộ lọc diệt virus soi ảnh mới. Vì thế các công cụ khởi động một tiến trình cho mỗi file — script shell, <code>make</code>, Git hook — thấy chậm hẳn trên laptop Windows so với trên Mac hay VPS.</p>
${lab('process', 'shell', 'vi', 'Shell chạy một lệnh: fork → exec → wait. Trên Windows hai ô đầu gộp thành một lời gọi CreateProcess — không có lúc nào tồn tại một bản sao của shell.', { tour: 'process-shell' })}
${lab('osmap', 'linux', 'vi', 'Tới thẻ 4–5 (khởi động tiến trình, tín hiệu và mã thoát) rồi chuyển Linux → macOS → Windows: fork ở 512 MiB so với posix_spawn, và vì sao USR1 cho mã thoát 138 trên Linux nhưng 158 trên macOS.')}

<h3>Luồng: thứ (gần như) giống nhau</h3>
<p>Cả ba nhân đều lập lịch theo <strong>luồng</strong>, và cả ba đều ánh xạ mỗi luồng người dùng vào một luồng nhân (1:1): pthreads trên Linux và macOS, <code>CreateThread</code> trên Windows. Luồng Java, luồng .NET và các luồng phụ của Node đều là luồng nhân trên mọi hệ. Cùng một chương trình Node cho thấy cùng 7 luồng ở cả hai phía (luồng chính, 4 worker của libuv, các luồng nền của V8):</p>
${run('c142-mac', 'node sig.js', 1)}
${run('c142-lx', 'node sig.js', 1)}
<p>Chỉ có công cụ là khác: <code>/proc/PID/task</code> trên Linux, <code>ps -M</code> trên macOS, cột "Threads" của Task Manager hay <code>(Get-Process -Id N).Threads</code> trên Windows. Bộ lập lịch khác nhau ở chi tiết — macOS ưu tiên lõi tiết kiệm cho việc QoS thấp, Windows đẩy ưu tiên luồng của cửa sổ đang ở phía trước — nhưng lỗi đồng thời của bạn (Chương 5–6) giống hệt nhau ở mọi nơi.</p>

<h3>Tín hiệu: cùng tên, khác số — và Windows không có</h3>
${run('c142-mac', '/bin/kill -l')}
${run('c142-lx', 'kill -l | head -4')}
<p>macOS giữ thứ tự của BSD: <code>SIGBUS</code> là 10, <code>SIGUSR1</code> là 30. Linux dùng <code>SIGBUS</code> 7 và <code>SIGUSR1</code> 10. POSIX chỉ cố định vài con số cho <code>kill -N</code>: 1 HUP, 2 INT, 3 QUIT, 6 ABRT, 9 KILL, 14 ALRM, 15 TERM. Mọi tín hiệu khác phải dùng <strong>bằng tên</strong>. Mã thoát của tiến trình bị giết là 128 + số, nên cùng một mã mang nghĩa khác nhau:</p>
${run('c142-mac', "sh -c 'kill -USR1", 2)}
${run('c142-lx', "sh -c 'kill -USR1", 2)}
<p>Mã thoát <strong>138</strong> là SIGUSR1 trên Linux nhưng lại là <strong>bus error</strong> trên macOS. 137 (SIGKILL) và 143 (SIGTERM) thì khớp ở mọi nơi, vì thế luật "137 = bị giết" của Chương 1 mang đi đâu cũng đúng.</p>
<p><strong>Windows không có tín hiệu</strong> ${DOC_VI}. Một chương trình console nhận <em>sự kiện điều khiển</em> qua <code>SetConsoleCtrlHandler</code>: <code>CTRL_C_EVENT</code> (0), <code>CTRL_BREAK_EVENT</code> (1), <code>CTRL_CLOSE_EVENT</code> (2, cửa sổ bị đóng; khoảng 5 giây để dọn dẹp), <code>CTRL_LOGOFF_EVENT</code> (5) và <code>CTRL_SHUTDOWN_EVENT</code> (6). Hệ thống chạy handler <strong>trên một luồng mới</strong> mà nó tạo trong tiến trình của bạn. Một service thì nhận <code>SERVICE_CONTROL_STOP</code> từ Service Control Manager (bài 14.3). "Giết" là <code>TerminateProcess</code>: tức thì, không handler nào chạy, như SIGKILL. Theo tài liệu của Node: <code>SIGINT</code> (Ctrl+C) chạy trên mọi nền tảng; <code>SIGBREAK</code> là Ctrl+Break; <code>SIGHUP</code> tới khi cửa sổ console đóng, và Windows giết Node khoảng 10 giây sau đó; <code>'SIGTERM' is not supported on Windows, it can be listened on</code> — handler cứ thế không bao giờ chạy; còn <code>process.kill(pid, 'SIGTERM')</code> gây ra "kết thúc vô điều kiện".</p>
${src('ch14/sig.js', 'js')}
<p>Trên macOS và Linux, handler này chạy và tiến trình thoát mã 0 sau ~0,5 s (ở trên). Trên laptop Windows của bạn cùng nhóm, nhánh SIGINT chạy khi họ bấm Ctrl+C trong terminal; nhánh SIGTERM thì không bao giờ.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Tắt êm chạy ngon trên production nhưng máy dev Windows mất dữ liệu."</strong> Trên Linux, Docker và Kubernetes dừng container bằng SIGTERM (bài 1.5), nên code chỉ nghe <code>SIGTERM</code> qua mọi bài kiểm trên VPS. Trên Windows handler đó không bao giờ chạy: nút "Stop" của IDE hay <code>process.kill</code> kết thúc tiến trình ngay lập tức, còn Ctrl+C gửi SIGINT. Hãy xử lý <strong>cả</strong> <code>SIGINT</code> lẫn <code>SIGTERM</code> (Java: shutdown hook — JVM chạy nó khi nhận SIGTERM, SIGINT hay Ctrl+C như nhau; Spring Boot làm sẵn cho bạn), xả và đóng ở nhánh nào cũng được, và đừng bao giờ dựa vào tín hiệu để đảm bảo đúng đắn — ghi dữ liệu xong tới đâu chốt tới đó. Và đừng bao giờ viết <code>kill -10</code> trong script: trên Mac đó là SIGBUS.</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> máy chủ Express của một bạn cùng nhóm cứ để lại file JSON ghi dở mỗi khi họ dừng nó từ NetBeans trên Windows, nhưng trên VPS thì chưa bao giờ. Bạn cần chỉ ra vì sao, và làm cho đường tắt máy giống hệt nhau trên cả ba hệ.</p>
<ol>
<li>Biên dịch <code>spawn.c</code> trên Mac (<code>clang -O2</code>) và trong lab (<code>gcc -O2</code>); chạy <code>./spawn 300 0</code> và <code>./spawn 300 512</code> ở mỗi bên và ghi lại bốn dòng.</li>
<li>Trong lab, chạy <code>strace -f -e trace=clone,clone3,vfork,execve ./spawn 1 0</code> và đánh dấu dòng nào là <code>fork</code>, dòng nào <code>vfork</code>, dòng nào <code>posix_spawn</code>.</li>
<li>Chạy <code>sh -c 'kill -USR1 $$'; echo $?</code> trên Mac và trong lab, rồi làm lại với <code>-BUS</code>. Ghi ra mã thoát nào bị trùng.</li>
<li>Sửa <code>sig.js</code> cho cùng một hàm dọn dẹp chạy khi nhận SIGINT, SIGTERM và (trên Windows) SIGBREAK, và ghi file theo mẫu tạm → rename của bài 9.2.</li>
</ol>
<p><strong>Đạt khi:</strong> bảng của bạn cho thấy chi phí fork tăng theo bộ nhớ của cha trên Linux còn posix_spawn thì không; bạn giải thích được exit 138 trên từng hệ; và <code>sig.js</code> thoát mã 0 sau khi đóng sạch trên cả Mac lẫn Linux — kèm ghi chú rằng trên Windows chỉ Ctrl+C/Ctrl+Break tới được nó.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['posix_spawn', 'Tạo tiến trình bằng một lời gọi theo POSIX; glibc làm bằng clone(CLONE_VM|CLONE_VFORK), macOS làm thành system call — tránh chép tiến trình cha.'],
  ['vfork', 'Fork dùng chung bộ nhớ với cha và đóng băng cha tới khi exec; nhanh, đã lỗi thời trên macOS, là nền của posix_spawn trên Linux.'],
  ['CreateProcess', 'Cách duy nhất để chạy chương trình trên Windows: đường dẫn ảnh + một chuỗi dòng lệnh + môi trường + cờ; không có fork.'],
  ['1:1 threading (luồng 1:1)', 'Mỗi luồng người dùng là một luồng nhân — đúng với pthreads trên Linux/macOS và luồng Windows.'],
  ['signal number (số tín hiệu)', 'Tên thì mang đi được, số thì không: SIGUSR1 = 10 trên Linux, 30 trên macOS; chỉ 1, 2, 3, 6, 9, 14, 15 là cố định.'],
  ['console control event (sự kiện điều khiển console)', 'Thứ Windows dùng thay tín hiệu cho chương trình console: CTRL_C, CTRL_BREAK, CTRL_CLOSE, LOGOFF, SHUTDOWN, giao trên một luồng mới.'],
  ['TerminateProcess', 'Giết tức thì trên Windows (không handler nào chạy) — chính là việc process.kill của Node làm ở đó.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Unix khởi động chương trình theo hai bước (fork + exec), Windows một bước (CreateProcess); <code>posix_spawn</code> là lời gọi một bước dùng chung được trên Linux và macOS.</li>
<li>Đo trên Linux: fork+exec từ 0,26 → 5,2 ms khi cha giữ 512 MiB; posix_spawn và vfork đứng ~0,2 ms (clone với CLONE_VM|CLONE_VFORK).</li>
<li>Đo trên macOS (máy bận): mỗi lần khởi động tốn 1,3–2,2 ms, chủ yếu ở exec; posix_spawn vẫn nhanh nhất.</li>
<li>Luồng ở đâu cũng là luồng nhân 1:1; cùng một chương trình Node có 7 luồng trên Mac và Linux.</li>
<li>Số tín hiệu khác nhau (138 = SIGUSR1 trên Linux, SIGBUS trên Mac); Windows không có tín hiệu — xử lý SIGINT và SIGTERM, và chuẩn bị cho việc bị kết thúc cứng.</li>
</ul>
${L('https://man7.org/linux/man-pages/man3/posix_spawn.3.html', '📄', 'man 3 posix_spawn', 'glibc tạo tiến trình con bằng CLONE_VM|CLONE_VFORK ra sao, và các thao tác file đính kèm được.', 'Mở')}
${L('https://learn.microsoft.com/en-us/windows/console/handlerroutine', '📄', 'HandlerRoutine (console Windows)', 'Năm sự kiện điều khiển, luồng mới, và thời gian chờ Windows dành cho chương trình console.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 14.3 — Dịch vụ và công cụ quan sát ───────────────────────── */
    {
      title: '14.3 — Services and observability: systemd vs launchd vs Windows Services, top vs Activity Monitor vs Task Manager|||14.3 — Dịch vụ và quan sát: systemd vs launchd vs Windows Services, top vs Activity Monitor vs Task Manager',
      slug: 'os-14-2-cong-cu',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ai khởi động mọi thứ: systemd (unit file), launchd (plist — 549/724 tiến trình trên Mac là con trực tiếp của nó), Service Control Manager (sc, services.msc); bảng tra "câu hỏi → lệnh" cho CPU, RAM, đĩa, cổng, file mở, syscall, log trên ba hệ; đo trên Mac thật: top -l, lsof thấy cổng 3141, sample soi một tiến trình Node nóng, fs_usage cần root, dtruss bị SIP chặn, log show đọc unified log; Task Manager tính % trên cả máy.',
      content: `${G143}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3</span>
<h2>Services and observability on three systems</h2>
<p class="lead">On the VPS you already know the reflexes of Chapter 2: <code>systemctl status</code>, <code>journalctl</code>, <code>top</code>, <code>ss</code>, <code>lsof</code>, <code>strace</code>. On your Mac and on your teammates' Windows laptops the same questions — <em>is the service running, who eats the CPU, who holds port 3000, what is this process doing?</em> — have different tools with different limits. This lesson answers: <strong>who starts and supervises long-running programs on each OS, and what is the macOS and Windows equivalent of every observing command you learned on Linux?</strong></p>

<h3>The supervisor at PID 1: systemd, launchd, the Service Control Manager</h3>
<table>
<tr><th></th><th>Linux: systemd</th><th>macOS: launchd</th><th>Windows: SCM ${DOC_EN}</th></tr>
<tr><td>who</td><td>PID 1</td><td>PID 1</td><td><code>services.exe</code> (started by wininit)</td></tr>
<tr><td>definition</td><td>unit file (INI) in <code>/etc/systemd/system</code></td><td>property list (XML plist): <code>LaunchDaemons</code> (system) and <code>LaunchAgents</code> (per user)</td><td>registry key <code>HKLM\\SYSTEM\\CurrentControlSet\\Services\\&lt;name&gt;</code></td></tr>
<tr><td>control</td><td><code>systemctl start|stop|status|enable</code></td><td><code>launchctl bootstrap|bootout|kickstart|print|list</code></td><td><code>sc query|start|stop|qc</code>, <code>services.msc</code>, PowerShell <code>Get-Service</code>/<code>Start-Service</code></td></tr>
<tr><td>restart on crash</td><td><code>Restart=always</code></td><td><code>KeepAlive</code></td><td>Recovery tab / <code>sc failure</code></td></tr>
<tr><td>scheduled jobs</td><td>timers (<code>OnCalendar=</code>), cron</td><td><code>StartCalendarInterval</code> (cron is optional)</td><td>Task Scheduler</td></tr>
<tr><td>logs</td><td>journald → <code>journalctl</code></td><td>unified logging → <code>log show</code>, Console.app</td><td>Event Log → Event Viewer, <code>Get-WinEvent</code></td></tr>
</table>
<p>On this Mac, launchd is not just the first process — it starts almost everything:</p>
${run('c143-mac', 'ps -o pid,ppid,user,comm -p 1', 3)}
<p>549 of 724 processes are direct children of launchd, defined by 425 system daemons and 486 per-user agents shipped with macOS. A plist plays the role of a unit file. Here is the log rotator, a system daemon that runs at minute 30 of every hour — exactly a systemd timer with <code>OnCalendar=*:30</code>:</p>
${run('c143-mac', 'plutil -p /System/Library/LaunchDaemons/com.apple.newsyslog.plist', 2)}
<p>Compare the Linux unit of Chapter 2 and its status — the same ideas in INI instead of XML (<a href="${OS('os-2-6-nhat-ky')}">lesson 2.6</a>):</p>
${src('ch02/systemd/ctw-api.service', 'ini')}
${run('c26-log', 'systemctl status ctw-api --no-pager', 1, { max: 11 })}
<p>The same service as a macOS LaunchAgent (written for this lesson and only syntax-checked with <code>plutil -lint</code>, <strong>not</strong> loaded):</p>
${src('ch14/com.cuongthai.hot.plist', 'xml')}
${run('c143-mac', 'plutil -lint')}
<p><code>KeepAlive</code> with <code>SuccessfulExit = false</code> is <code>Restart=on-failure</code>; <code>ThrottleInterval</code> is <code>RestartSec</code>; there is no <code>MemoryMax</code> — macOS has no cgroups, so a per-service memory cap does not exist. To run it for real: copy it to <code>~/Library/LaunchAgents</code>, then <code>launchctl bootstrap gui/$(id -u) &lt;file&gt;</code>; <code>launchctl bootout</code> removes it. On Windows ${DOC_EN} a service is a program that talks to the SCM (it registers a control handler and answers <code>SERVICE_CONTROL_STOP</code>); a plain Node or Java app needs a wrapper such as WinSW or NSSM to become one, and is then managed with <code>sc</code> or <code>services.msc</code>.</p>

<h3>The observing toolbox: one question, three commands</h3>
<table>
<tr><th>question</th><th>Linux</th><th>macOS</th><th>Windows ${DOC_EN}</th></tr>
<tr><td>who eats the CPU?</td><td><code>top</code>, <code>htop</code>, <code>ps --sort=-%cpu</code></td><td><code>top -o cpu</code>, Activity Monitor → CPU</td><td>Task Manager → Details, <code>Get-Process | Sort CPU -Desc</code></td></tr>
<tr><td>memory</td><td><code>free -m</code>, <code>ps</code> RSS, <code>/proc/meminfo</code></td><td><code>vm_stat</code>, <code>memory_pressure</code>, <code>top</code> PhysMem, Activity Monitor → Memory</td><td>Task Manager → Performance (In use, Committed), Resource Monitor</td></tr>
<tr><td>disk space</td><td><code>df -h</code>, <code>du</code></td><td><code>df -h</code>, <code>du</code>, <code>diskutil</code></td><td><code>Get-Volume</code>, Settings → Storage</td></tr>
<tr><td>disk I/O</td><td><code>iostat -x</code>, <code>iotop</code></td><td><code>iostat</code>, <code>fs_usage</code> (root)</td><td>Resource Monitor → Disk</td></tr>
<tr><td>who holds a port?</td><td><code>ss -tlnp</code></td><td><code>lsof -nP -iTCP -sTCP:LISTEN</code></td><td><code>netstat -ano</code>, <code>Get-NetTCPConnection -State Listen</code></td></tr>
<tr><td>open files of a process</td><td><code>lsof -p</code>, <code>/proc/PID/fd</code></td><td><code>lsof -p</code></td><td>Process Explorer (Find → Handle), <code>handle.exe</code></td></tr>
<tr><td>trace system calls</td><td><code>strace</code></td><td><code>dtruss</code> (root, blocked by SIP), <code>fs_usage</code> (root)</td><td>Process Monitor (Sysinternals)</td></tr>
<tr><td>CPU profile</td><td><code>perf</code></td><td><code>sample</code>, Instruments → Time Profiler</td><td>Windows Performance Recorder, PerfView</td></tr>
<tr><td>logs</td><td><code>journalctl</code>, <code>dmesg</code></td><td><code>log show</code>, <code>log stream</code>, Console.app</td><td>Event Viewer, <code>Get-WinEvent</code></td></tr>
</table>

<h3>macOS, measured: top, lsof, sample</h3>
${run('c143-mac', "top -l 1 -n 0 -s 0")}
<p>The summary of macOS <code>top</code>: 722 processes, 5,397 threads, load average 16.8 on 10 cores (other jobs were running), and memory as "29G used (3440M wired, 10G compressor), 1882M unused". "Unused" is the cousin of Linux's <code>free</code> column, and just as misleading — lesson 14.4 reads it properly. Now a Node server with a hot function, observed three ways:</p>
${src('ch14/hot.cjs', 'js')}
${run('c143-mac', 'node hot.cjs', 3)}
<p><code>ps</code> shows 46 % CPU (macOS, like <code>top</code> on Linux, counts 100 % per core) and 45 MB RSS; <code>lsof</code> — identical syntax on Linux and macOS — finds the listening socket on <code>*:3141</code>. <code>sample</code> takes a stack snapshot every millisecond for one second, like <code>perf record</code>: the most frequent top frames are threads <em>waiting</em> — <code>__psynch_cvwait</code> (libuv workers on a condition variable), <code>kevent</code> (the event loop waiting on <strong>kqueue</strong>, macOS's epoll — lesson 10.3) and a Mach semaphore. The hot JavaScript appears only as <code>???</code> addresses: V8 generates that code at run time, and <code>sample</code>, like <code>perf</code> without a JIT map (Chapter 15), cannot name it.</p>
${run('c143-mac', 'fs_usage', 2)}
<p>The two closest things to <code>strace</code> refuse to run: <code>fs_usage</code> needs root, and <code>dtruss</code> (DTrace) is blocked by <strong>System Integrity Protection</strong> even for root on a default Mac. That is a design choice — SIP protects the system from code running as root (lesson 14.5). In practice: reproduce the problem inside the Linux lab and use <code>strace</code>, or use Instruments (Xcode) which is signed to trace your own processes. On Windows ${DOC_EN}, Sysinternals Process Monitor plays the <code>strace</code> role for file, registry, network and process events, and Process Explorer replaces <code>lsof</code>/<code>ps -T</code>.</p>
${run('c143-mac', 'logger -t ch14')}
<p>And the journal: <code>logger</code> writes into macOS's unified log, and <code>log show</code> with a predicate reads it back — the role of <code>journalctl -t</code>.</p>
${lab('sysmon', 'cpuhog', 'en', 'Read a live top: load vs cores, us/sy/wa, the process at the top. Activity Monitor shows the same numbers per core; Task Manager shows the same process as a share of the whole machine.', { tour: 'sysmon-read' })}
${lab('osmap', 'win', 'en', 'Cards 3, 6 and 7 (PID 1, background services, system log) from the Windows side; then switch to Linux and macOS to see systemd/journalctl and launchd/log show doing the same jobs.')}

<div class="pitfall co-tieu-de">
<p><strong>"Task Manager says node uses 10 %, top on the VPS said 100 % — the Windows box must be faster."</strong> The same single busy thread is reported differently: <code>top</code>, <code>ps</code> and Activity Monitor count 100 % <em>per core</em> (one saturated thread = 100 %, our <code>hot.cjs</code> = 46 %), while Task Manager's Processes tab shows a share of the <em>whole machine</em> ${DOC_EN} — one saturated thread on 10 logical cores shows as about 10 %. Compare like with like (Task Manager's Performance tab per logical processor, or <code>Get-Counter '\\Process(node)\\% Processor Time'</code>, which is per core). And on the Mac, do not disable SIP just to get <code>dtruss</code>: it removes the protection for the whole system; trace in the Linux lab instead.</p>
</div>

<h3>🧪 Practice (25–30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> everyone in the group runs <code>npm run dev</code> and gets <code>EADDRINUSE: address already in use :::3000</code> — on the Mac, on a Windows laptop and in the Linux container. Each person must find the culprit with their own OS's tools, and you want the app to restart itself on crash on all three.</p>
<ol>
<li>Start <code>node hot.cjs</code> (change the port to 3000). On the Mac: <code>lsof -nP -iTCP:3000 -sTCP:LISTEN</code>; in the lab: <code>ss -tlnp 'sport = :3000'</code>; on Windows: <code>Get-NetTCPConnection -LocalPort 3000 | Select OwningProcess</code> then <code>Get-Process -Id &lt;pid&gt;</code>.</li>
<li>On the Mac run <code>sample &lt;pid&gt; 1</code> and find the "Sort by top of stack" section; in the lab run <code>top -b -n 1 -p &lt;pid&gt;</code>. Note the CPU % each tool reports.</li>
<li>Write the restart policy three ways: the systemd unit (<code>Restart=on-failure</code>), the plist (<code>KeepAlive/SuccessfulExit=false</code>), and for Windows the <code>sc failure</code> line (from the documentation). Check the plist with <code>plutil -lint</code>.</li>
<li>Optional on your own Mac: load the agent with <code>launchctl bootstrap gui/$(id -u)</code>, kill it, watch launchd restart it, then <code>launchctl bootout</code> it.</li>
</ol>
<p><strong>Done when:</strong> you have one table row per OS with the command that names the PID holding port 3000, the CPU % each tool showed for the same busy process and why they differ, and three restart policies that mean the same thing.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['launchd', 'macOS’s PID 1: init, service manager, cron and inetd in one; jobs are plists in LaunchDaemons (system) and LaunchAgents (user).'],
  ['plist (property list)', 'Apple’s XML/binary key-value format; for launchd it plays the role of a systemd unit file.'],
  ['SCM (Service Control Manager)', 'Windows’ services.exe: starts, stops and restarts services defined in the registry; managed with sc, services.msc, Get-Service.'],
  ['unified logging', 'macOS’s system-wide log (log show, log stream, Console.app); the counterpart of journald and the Windows Event Log.'],
  ['sample / Instruments', 'macOS profilers: sample snapshots stacks of a running process; Instruments (Xcode) adds traces and timelines.'],
  ['SIP (System Integrity Protection)', 'macOS protection that restricts even root — why dtruss/DTrace and writes to /System fail on a default Mac.'],
  ['Sysinternals', 'Microsoft’s free tools for Windows internals: Process Explorer (ps/lsof), Process Monitor (strace-like), handle.exe.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>PID 1 supervises services everywhere: systemd (unit files), launchd (plists — 549 of 724 processes on this Mac are its children), and on Windows the SCM (registry, sc).</li>
<li>Restart, schedule and log map one-to-one: Restart=/KeepAlive/Recovery, OnCalendar/StartCalendarInterval/Task Scheduler, journalctl/log show/Event Viewer.</li>
<li><code>ps</code>, <code>top</code>, <code>lsof</code>, <code>df</code>, <code>du</code> work on macOS with the same syntax; <code>sample</code> is a quick profiler.</li>
<li>Tracing is harder on macOS: <code>fs_usage</code> needs root and <code>dtruss</code> is blocked by SIP — trace in the Linux lab, or use Instruments; Windows uses Process Monitor.</li>
<li>CPU % is per core in top/Activity Monitor but per machine in Task Manager — compare like with like.</li>
</ul>
${L('https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html', '📄', 'Creating launchd jobs (Apple)', 'Daemons vs agents, the plist keys, KeepAlive and StartCalendarInterval.', 'Open')}
${L('https://learn.microsoft.com/en-us/sysinternals/downloads/procmon', '📄', 'Process Monitor (Sysinternals)', 'The Windows tool for watching file, registry, network and process activity live.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3</span>
<h2>Dịch vụ và công cụ quan sát trên ba hệ điều hành</h2>
<p class="lead">Trên VPS bạn đã có các phản xạ của Chương 2: <code>systemctl status</code>, <code>journalctl</code>, <code>top</code>, <code>ss</code>, <code>lsof</code>, <code>strace</code>. Trên Mac của bạn và trên laptop Windows của các bạn cùng nhóm, cùng những câu hỏi đó — <em>dịch vụ có đang chạy không, ai ăn CPU, ai giữ cổng 3000, tiến trình này đang làm gì?</em> — lại dùng công cụ khác, với giới hạn khác. Bài này trả lời: <strong>trên mỗi hệ điều hành, ai khởi động và trông nom các chương trình chạy lâu, và lệnh quan sát nào của macOS và Windows tương đương với từng lệnh bạn đã học trên Linux?</strong></p>

<h3>Người trông coi ở PID 1: systemd, launchd, Service Control Manager</h3>
<table>
<tr><th></th><th>Linux: systemd</th><th>macOS: launchd</th><th>Windows: SCM ${DOC_VI}</th></tr>
<tr><td>là ai</td><td>PID 1</td><td>PID 1</td><td><code>services.exe</code> (do wininit khởi động)</td></tr>
<tr><td>khai báo</td><td>unit file (INI) trong <code>/etc/systemd/system</code></td><td>property list (plist XML): <code>LaunchDaemons</code> (hệ thống) và <code>LaunchAgents</code> (theo người dùng)</td><td>khoá registry <code>HKLM\\SYSTEM\\CurrentControlSet\\Services\\&lt;tên&gt;</code></td></tr>
<tr><td>điều khiển</td><td><code>systemctl start|stop|status|enable</code></td><td><code>launchctl bootstrap|bootout|kickstart|print|list</code></td><td><code>sc query|start|stop|qc</code>, <code>services.msc</code>, PowerShell <code>Get-Service</code>/<code>Start-Service</code></td></tr>
<tr><td>tự chạy lại khi sập</td><td><code>Restart=always</code></td><td><code>KeepAlive</code></td><td>tab Recovery / <code>sc failure</code></td></tr>
<tr><td>việc theo lịch</td><td>timer (<code>OnCalendar=</code>), cron</td><td><code>StartCalendarInterval</code> (cron là tuỳ chọn)</td><td>Task Scheduler</td></tr>
<tr><td>nhật ký</td><td>journald → <code>journalctl</code></td><td>unified logging → <code>log show</code>, Console.app</td><td>Event Log → Event Viewer, <code>Get-WinEvent</code></td></tr>
</table>
<p>Trên Mac này, launchd không chỉ là tiến trình đầu tiên — nó khởi động gần như mọi thứ:</p>
${run('c143-mac', 'ps -o pid,ppid,user,comm -p 1', 3)}
<p>549 trên 724 tiến trình là con trực tiếp của launchd, được khai báo bởi 425 daemon hệ thống và 486 agent theo người dùng đi kèm macOS. Một plist đóng vai unit file. Đây là trình xoay vòng log, một daemon hệ thống chạy vào phút 30 mỗi giờ — đúng một timer systemd với <code>OnCalendar=*:30</code>:</p>
${run('c143-mac', 'plutil -p /System/Library/LaunchDaemons/com.apple.newsyslog.plist', 2)}
<p>So với unit Linux của Chương 2 và trạng thái của nó — cùng những ý đó, viết bằng INI thay vì XML (<a href="${OS('os-2-6-nhat-ky')}">bài 2.6</a>):</p>
${src('ch02/systemd/ctw-api.service', 'ini')}
${run('c26-log', 'systemctl status ctw-api --no-pager', 1, { max: 11 })}
<p>Cũng dịch vụ đó viết thành LaunchAgent của macOS (viết cho bài này và chỉ kiểm cú pháp bằng <code>plutil -lint</code>, <strong>không</strong> nạp):</p>
${src('ch14/com.cuongthai.hot.plist', 'xml')}
${run('c143-mac', 'plutil -lint')}
<p><code>KeepAlive</code> với <code>SuccessfulExit = false</code> là <code>Restart=on-failure</code>; <code>ThrottleInterval</code> là <code>RestartSec</code>; không có <code>MemoryMax</code> — macOS không có cgroup, nên không tồn tại trần bộ nhớ theo từng dịch vụ. Muốn chạy thật: chép vào <code>~/Library/LaunchAgents</code>, rồi <code>launchctl bootstrap gui/$(id -u) &lt;file&gt;</code>; <code>launchctl bootout</code> để gỡ. Trên Windows ${DOC_VI} một service là chương trình biết nói chuyện với SCM (nó đăng ký một control handler và trả lời <code>SERVICE_CONTROL_STOP</code>); một ứng dụng Node hay Java thường cần một trình bọc như WinSW hay NSSM để thành service, rồi được quản lý bằng <code>sc</code> hoặc <code>services.msc</code>.</p>

<h3>Hộp đồ nghề quan sát: một câu hỏi, ba lệnh</h3>
<table>
<tr><th>câu hỏi</th><th>Linux</th><th>macOS</th><th>Windows ${DOC_VI}</th></tr>
<tr><td>ai ăn CPU?</td><td><code>top</code>, <code>htop</code>, <code>ps --sort=-%cpu</code></td><td><code>top -o cpu</code>, Activity Monitor → CPU</td><td>Task Manager → Details, <code>Get-Process | Sort CPU -Desc</code></td></tr>
<tr><td>bộ nhớ</td><td><code>free -m</code>, RSS của <code>ps</code>, <code>/proc/meminfo</code></td><td><code>vm_stat</code>, <code>memory_pressure</code>, PhysMem của <code>top</code>, Activity Monitor → Memory</td><td>Task Manager → Performance (In use, Committed), Resource Monitor</td></tr>
<tr><td>dung lượng đĩa</td><td><code>df -h</code>, <code>du</code></td><td><code>df -h</code>, <code>du</code>, <code>diskutil</code></td><td><code>Get-Volume</code>, Settings → Storage</td></tr>
<tr><td>I/O đĩa</td><td><code>iostat -x</code>, <code>iotop</code></td><td><code>iostat</code>, <code>fs_usage</code> (root)</td><td>Resource Monitor → Disk</td></tr>
<tr><td>ai giữ cổng?</td><td><code>ss -tlnp</code></td><td><code>lsof -nP -iTCP -sTCP:LISTEN</code></td><td><code>netstat -ano</code>, <code>Get-NetTCPConnection -State Listen</code></td></tr>
<tr><td>file đang mở của tiến trình</td><td><code>lsof -p</code>, <code>/proc/PID/fd</code></td><td><code>lsof -p</code></td><td>Process Explorer (Find → Handle), <code>handle.exe</code></td></tr>
<tr><td>theo dõi system call</td><td><code>strace</code></td><td><code>dtruss</code> (root, bị SIP chặn), <code>fs_usage</code> (root)</td><td>Process Monitor (Sysinternals)</td></tr>
<tr><td>hồ sơ CPU</td><td><code>perf</code></td><td><code>sample</code>, Instruments → Time Profiler</td><td>Windows Performance Recorder, PerfView</td></tr>
<tr><td>nhật ký</td><td><code>journalctl</code>, <code>dmesg</code></td><td><code>log show</code>, <code>log stream</code>, Console.app</td><td>Event Viewer, <code>Get-WinEvent</code></td></tr>
</table>

<h3>macOS, đo thật: top, lsof, sample</h3>
${run('c143-mac', "top -l 1 -n 0 -s 0")}
<p>Phần tóm tắt của <code>top</code> trên macOS: 722 tiến trình, 5.397 luồng, load average 16,8 trên 10 lõi (lúc đó có việc khác đang chạy), và bộ nhớ là "29G used (3440M wired, 10G compressor), 1882M unused". "Unused" là họ hàng của cột <code>free</code> trên Linux, và gây hiểu lầm y như vậy — bài 14.4 đọc nó cho đúng. Giờ là một máy chủ Node có một hàm nóng, quan sát bằng ba cách:</p>
${src('ch14/hot.cjs', 'js')}
${run('c143-mac', 'node hot.cjs', 3)}
<p><code>ps</code> cho thấy 46 % CPU (macOS, giống <code>top</code> trên Linux, tính 100 % cho mỗi lõi) và 45 MB RSS; <code>lsof</code> — cú pháp y hệt trên Linux và macOS — tìm ra socket đang nghe ở <code>*:3141</code>. <code>sample</code> chụp ngăn xếp mỗi mili giây trong một giây, như <code>perf record</code>: các khung trên đỉnh hay gặp nhất là luồng đang <em>chờ</em> — <code>__psynch_cvwait</code> (worker của libuv chờ trên biến điều kiện), <code>kevent</code> (event loop chờ trên <strong>kqueue</strong>, epoll của macOS — bài 10.3) và một semaphore của Mach. Đoạn JavaScript nóng chỉ hiện thành các địa chỉ <code>???</code>: V8 sinh mã đó lúc chạy, và <code>sample</code>, như <code>perf</code> khi thiếu bản đồ JIT (Chương 15), không gọi tên được nó.</p>
${run('c143-mac', 'fs_usage', 2)}
<p>Hai thứ gần với <code>strace</code> nhất đều từ chối chạy: <code>fs_usage</code> cần root, còn <code>dtruss</code> (DTrace) bị <strong>System Integrity Protection</strong> chặn kể cả với root trên một máy Mac mặc định. Đó là lựa chọn thiết kế — SIP bảo vệ hệ thống khỏi chính mã chạy bằng root (bài 14.5). Thực tế: tái hiện vấn đề trong lab Linux rồi dùng <code>strace</code>, hoặc dùng Instruments (Xcode), công cụ được ký để theo dõi tiến trình của chính bạn. Trên Windows ${DOC_VI}, Process Monitor của Sysinternals đóng vai <code>strace</code> cho sự kiện file, registry, mạng và tiến trình, còn Process Explorer thay cho <code>lsof</code>/<code>ps -T</code>.</p>
${run('c143-mac', 'logger -t ch14')}
<p>Và nhật ký: <code>logger</code> ghi vào unified log của macOS, và <code>log show</code> với một điều kiện lọc đọc nó ra — vai trò của <code>journalctl -t</code>.</p>
${lab('sysmon', 'cpuhog', 'vi', 'Đọc một top đang chạy: load so với số lõi, us/sy/wa, tiến trình đứng đầu. Activity Monitor hiện cùng những số này theo từng lõi; Task Manager hiện cùng tiến trình đó theo phần trăm cả máy.', { tour: 'sysmon-read' })}
${lab('osmap', 'win', 'vi', 'Thẻ 3, 6 và 7 (PID 1, dịch vụ chạy nền, nhật ký hệ thống) nhìn từ phía Windows; rồi chuyển sang Linux và macOS để thấy systemd/journalctl và launchd/log show làm cùng việc đó.')}

<div class="pitfall co-tieu-de">
<p><strong>"Task Manager bảo node dùng 10 %, top trên VPS bảo 100 % — máy Windows chắc nhanh hơn."</strong> Cùng một luồng bận được báo khác nhau: <code>top</code>, <code>ps</code> và Activity Monitor tính 100 % <em>cho mỗi lõi</em> (một luồng chạy hết công suất = 100 %, <code>hot.cjs</code> của ta = 46 %), còn tab Processes của Task Manager hiện phần trăm của <em>cả máy</em> ${DOC_VI} — một luồng chạy hết công suất trên 10 lõi logic hiện khoảng 10 %. Hãy so cùng loại (tab Performance của Task Manager theo từng bộ xử lý logic, hoặc <code>Get-Counter '\\Process(node)\\% Processor Time'</code>, vốn tính theo lõi). Và trên Mac, đừng tắt SIP chỉ để dùng <code>dtruss</code>: làm vậy là gỡ lớp bảo vệ của cả hệ thống; hãy theo dõi trong lab Linux.</p>
</div>

<h3>🧪 Thực hành (25–30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> cả nhóm chạy <code>npm run dev</code> và gặp <code>EADDRINUSE: address already in use :::3000</code> — trên Mac, trên một laptop Windows và trong container Linux. Mỗi người phải tìm thủ phạm bằng công cụ của hệ điều hành mình, và bạn muốn ứng dụng tự chạy lại khi sập trên cả ba.</p>
<ol>
<li>Chạy <code>node hot.cjs</code> (đổi cổng thành 3000). Trên Mac: <code>lsof -nP -iTCP:3000 -sTCP:LISTEN</code>; trong lab: <code>ss -tlnp 'sport = :3000'</code>; trên Windows: <code>Get-NetTCPConnection -LocalPort 3000 | Select OwningProcess</code> rồi <code>Get-Process -Id &lt;pid&gt;</code>.</li>
<li>Trên Mac chạy <code>sample &lt;pid&gt; 1</code> và tìm phần "Sort by top of stack"; trong lab chạy <code>top -b -n 1 -p &lt;pid&gt;</code>. Ghi lại % CPU mỗi công cụ báo.</li>
<li>Viết chính sách tự chạy lại theo ba cách: unit systemd (<code>Restart=on-failure</code>), plist (<code>KeepAlive/SuccessfulExit=false</code>), và với Windows là dòng <code>sc failure</code> (theo tài liệu). Kiểm plist bằng <code>plutil -lint</code>.</li>
<li>Tuỳ chọn trên Mac của bạn: nạp agent bằng <code>launchctl bootstrap gui/$(id -u)</code>, giết nó, xem launchd khởi động lại, rồi <code>launchctl bootout</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có mỗi hệ điều hành một dòng bảng với lệnh chỉ ra PID đang giữ cổng 3000, % CPU mỗi công cụ hiện cho cùng một tiến trình bận và vì sao chúng khác nhau, và ba chính sách tự chạy lại mang cùng một nghĩa.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['launchd', 'PID 1 của macOS: init, trình quản lý dịch vụ, cron và inetd gộp làm một; job là các plist trong LaunchDaemons (hệ thống) và LaunchAgents (người dùng).'],
  ['plist (property list)', 'Định dạng khoá-giá trị XML/nhị phân của Apple; với launchd nó đóng vai unit file của systemd.'],
  ['SCM (Service Control Manager)', 'services.exe của Windows: khởi động, dừng, chạy lại các service khai báo trong registry; quản lý bằng sc, services.msc, Get-Service.'],
  ['unified logging (nhật ký hợp nhất)', 'Nhật ký toàn hệ thống của macOS (log show, log stream, Console.app); tương đương journald và Event Log của Windows.'],
  ['sample / Instruments', 'Công cụ đo hiệu năng của macOS: sample chụp ngăn xếp của tiến trình đang chạy; Instruments (Xcode) có thêm vết và dòng thời gian.'],
  ['SIP (System Integrity Protection)', 'Lớp bảo vệ của macOS giới hạn cả root — lý do dtruss/DTrace và việc ghi vào /System hỏng trên máy Mac mặc định.'],
  ['Sysinternals', 'Bộ công cụ miễn phí của Microsoft để soi bên trong Windows: Process Explorer (ps/lsof), Process Monitor (giống strace), handle.exe.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Ở đâu thì PID 1 cũng trông coi dịch vụ: systemd (unit file), launchd (plist — 549 trên 724 tiến trình trên Mac này là con của nó), và trên Windows là SCM (registry, sc).</li>
<li>Tự chạy lại, lập lịch và nhật ký tương ứng một-một: Restart=/KeepAlive/Recovery, OnCalendar/StartCalendarInterval/Task Scheduler, journalctl/log show/Event Viewer.</li>
<li><code>ps</code>, <code>top</code>, <code>lsof</code>, <code>df</code>, <code>du</code> chạy trên macOS với cú pháp như nhau; <code>sample</code> là công cụ đo nhanh.</li>
<li>Theo dõi syscall trên macOS khó hơn: <code>fs_usage</code> cần root và <code>dtruss</code> bị SIP chặn — theo dõi trong lab Linux, hoặc dùng Instruments; Windows dùng Process Monitor.</li>
<li>% CPU tính theo lõi ở top/Activity Monitor nhưng theo cả máy ở Task Manager — hãy so cùng loại.</li>
</ul>
${L('https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html', '📄', 'Creating launchd jobs (Apple)', 'Daemon vs agent, các khoá plist, KeepAlive và StartCalendarInterval.', 'Mở')}
${L('https://learn.microsoft.com/en-us/sysinternals/downloads/procmon', '📄', 'Process Monitor (Sysinternals)', 'Công cụ Windows để xem trực tiếp hoạt động file, registry, mạng và tiến trình.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 14.4 — Bộ nhớ ───────────────────────── */
    {
      title: '14.4 — Memory on three systems: page cache, compressed memory, swap files and the Windows commit limit|||14.4 — Bộ nhớ trên ba hệ: page cache, bộ nhớ nén, swapfile và commit limit của Windows',
      slug: 'os-14-6-bo-nho',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba cách đối phó khi RAM thiếu: Linux (page cache, swap cố định, overcommit, OOM killer), macOS (nén trước — compressor giữ 16,9 GiB dữ liệu trong 9,8 GiB RAM, rồi swapfile 1 GiB tự mọc, 12 GiB swap mà áp lực vẫn xanh), Windows (commit charge phải ≤ RAM + pagefile, không overcommit); đọc vm_stat bằng trang 16 KiB, RSS vs footprint vs VSZ 467 GiB; Linux trong máy ảo Docker hứa 5,0 GiB khi chỉ có 4,9 GiB để bảo đảm.',
      content: `${G144}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4</span>
<h2>Memory on three systems</h2>
<p class="lead">Your Mac's Activity Monitor says <em>"Memory Used: 30 GB of 32 GB, Swap Used: 12 GB"</em>. A teammate's Windows laptop says <em>"Committed 20/37 GB"</em> and once refused to start IntelliJ with "out of memory" while 6 GB were free. On the VPS, <code>free</code> shows almost nothing free (Chapter 8). Three dashboards, three vocabularies. This lesson answers: <strong>what does each OS do when RAM runs short, and which single number on each one actually means "trouble"?</strong> Chapter 8 covered Linux in depth (<a href="${OS('os-8-1-page-cache')}">page cache</a>, <a href="${OS('os-8-2-swap')}">swap</a>, <a href="${OS('os-8-3-oom')}">OOM</a>); here we put macOS and Windows beside it.</p>

<h3>Three strategies for "not enough RAM"</h3>
<table>
<tr><th></th><th>Linux</th><th>macOS</th><th>Windows ${DOC_EN}</th></tr>
<tr><td>spare RAM is used for</td><td>page cache (buff/cache)</td><td>file cache ("Cached Files")</td><td>standby list (cache)</td></tr>
<tr><td>first move under pressure</td><td>drop clean cache, then swap anonymous pages (if swap exists; zswap/zram optional)</td><td><strong>compress</strong> anonymous pages in RAM (the compressor, since OS X 10.9)</td><td>trim working sets to the standby/modified lists; compress pages (memory compression store, Windows 10+)</td></tr>
<tr><td>backing store</td><td>a fixed swap partition or file — often none on a VPS</td><td>swapfiles that <strong>grow on demand</strong> in <code>/System/Volumes/VM</code>, 1 GiB each, encrypted</td><td><code>pagefile.sys</code>; system-managed size grows up to 3× RAM or 4 GB</td></tr>
<tr><td>promises</td><td><strong>overcommit</strong>: malloc succeeds beyond RAM + swap (heuristic)</td><td>no commit limit; swap grows while the disk allows</td><td><strong>no overcommit</strong>: commit charge must stay ≤ commit limit = RAM + pagefile</td></tr>
<tr><td>last resort</td><td>OOM killer → exit 137</td><td>"Your system has run out of application memory" dialog; processes are asked to free memory</td><td>allocations fail (out-of-memory errors) — nobody is killed</td></tr>
<tr><td>number that means trouble</td><td><code>MemAvailable</code> low + PSI memory high</td><td><strong>memory pressure</strong> yellow/red; swapins rising</td><td><strong>Committed</strong> near the limit</td></tr>
</table>

<h3>macOS, measured: compress first, then swap</h3>
${run('c144-mac', 'sysctl hw.memsize hw.pagesize', 2)}
<p>Every count in <code>vm_stat</code> is in pages of <strong>16,384 bytes</strong> (the header says so). Converted: only 88,093 pages = 1.3 GiB are free; 215,815 pages = 3.3 GiB are <em>wired</em> (kernel memory that can never be paged out); 853,306 = 13 GiB are anonymous (heaps, stacks) and 239,741 = 3.7 GiB file-backed. The interesting lines are the compressor's:</p>
${run('c144-mac', "vm_stat | awk")}
<p>The compressor holds <strong>16.9 GiB</strong> of other programs' memory in <strong>9.8 GiB</strong> of RAM — a 1.72× ratio. Compressing a 16 KiB page takes microseconds; reading it back from an SSD swapfile takes far longer (the latency ladder of Section 0). That is why macOS prefers it, and why "Memory Used: 30 GB" is not alarming by itself:</p>
${run('c144-mac', 'top -l 1 -n 0 -s 0', 4)}
<p>12.1 GB of swap is in use, spread over 13 swapfiles of 1 GiB that macOS created as it needed them — no partition was sized in advance. Yet <code>memory_pressure</code> reports 57 % free: the swapped data is cold, nobody is waiting for it. On macOS, <strong>swap used</strong> is history; <strong>memory pressure</strong> (Activity Monitor's green/yellow/red graph) and a rising <code>Swapins</code> counter (<code>vm_stat 1</code>) are the present.</p>

<h3>One process, three sizes</h3>
${src('ch14/an.py', 'python')}
${run('c144-mac', 'python3 an.py', 2)}
<p>A Python process holding 512 MiB: <strong>RSS</strong> 526 MiB — the resident pages, the same idea as on Linux; <strong>VSZ</strong> 467 GiB — macOS maps huge reserved regions (the shared library cache, GPU and allocator reservations) into every process, so VSZ is meaningless here; and the <strong>footprint</strong> 519 MB, which is what Activity Monitor's "Memory" column shows. Footprint counts the process's dirty memory <em>including the part sitting compressed or in swap</em>; RSS drops when pages are compressed, footprint does not. In these four seconds nothing was compressed yet (no pressure on fresh data), so the two agree. When you hunt a memory leak on a Mac, watch footprint, not RSS.</p>

<h3>Linux beside it: overcommit and the commit numbers</h3>
${run('c144-lx', 'free -m', 4)}
<p>Docker's Linux VM: 7.7 GiB, 4.5 GiB available, 1 GiB of swap, no compression (<code>zswap</code> is off). Look at the two commit lines: the kernel has promised <code>Committed_AS</code> = 5.0 GiB of anonymous memory while the amount it could guarantee, <code>CommitLimit</code>, is 4.9 GiB. With <code>overcommit_memory = 1</code> ("always") it does not care — it bets that most promised memory is never touched, and the OOM killer settles the bet if it is wrong. <strong>Windows would refuse that promise</strong> ${DOC_EN}: every committed byte must be backed by RAM or pagefile at the moment it is committed, which is why a Windows machine can report "out of memory" with physical RAM free — the <em>commit limit</em> ran out, not the RAM. Microsoft's guidance: system-managed pagefiles grow when the commit charge reaches 90 % of the limit; disabling the pagefile lowers the limit to RAM alone.</p>
${run('c144-lx', 'python3 an.py')}
${lab('vm', 'pressure', 'en', 'Slide RAM down and watch the stages every OS goes through: free memory and cache shrink, then pages leave RAM (to compression on macOS, to swap on Linux, to the pagefile on Windows), and finally the system thrashes.', { tour: 'vm-thrash' })}
${lab('cgroup', 'swap', 'en', 'Linux only: a cgroup memory limit with swap behind it — what Docker on the VPS does and what macOS cannot do per process (it has no cgroups).')}
${lab('osmap', 'mac', 'en', 'Cards 8–11 (free RAM, over-promising, swap, page size) on macOS: available vs memory pressure 57 %, the compressor at 1.72×, 13 swap files, 16 KiB pages. Switch to Linux and Windows to compare each answer.')}

<div class="pitfall co-tieu-de">
<p><strong>"I copied a vm_stat script from the internet and my Mac seems to have 4× less memory."</strong> Many scripts multiply <code>vm_stat</code> page counts by 4096 — correct on Intel Macs, wrong by 4× on Apple Silicon, where the header says <code>page size of 16384 bytes</code>. Read the size from the header or <code>sysctl -n hw.pagesize</code>. The Windows twin of this mistake: following an "optimisation" guide that disables the pagefile. Physical RAM is unchanged, but the commit limit drops to RAM alone, and programs that commit generously (browsers, JVMs, IDEs) start failing allocations while Task Manager still shows free memory ${DOC_EN}.</p>
</div>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> in the group chat, your Mac shows 12 GB of swap used and a teammate's Windows laptop says "out of memory" with 6 GB of RAM free. Both ask whether to buy more RAM. You want to answer from the right number on each machine.</p>
<ol>
<li>On the Mac: <code>vm_stat</code> (convert free, wired and compressor lines with the 16 KiB page size), <code>memory_pressure | tail -1</code>, <code>sysctl vm.swapusage</code>, then <code>vm_stat 1</code> for 10 seconds and watch the <code>swapins</code> column.</li>
<li>Run <code>python3 an.py 512 60 &amp;</code>; compare <code>ps -o rss</code> with <code>footprint -p PID</code> and with Activity Monitor's Memory column for that process.</li>
<li>In the lab: <code>free -m</code> and <code>grep -E 'Commit' /proc/meminfo</code>; explain why <code>Committed_AS</code> can exceed <code>CommitLimit</code>.</li>
<li>Ask the Windows teammate for Task Manager → Performance → Memory ("Committed x / y GB") and <code>Get-CimInstance Win32_PageFileUsage</code>.</li>
</ol>
<p><strong>Done when:</strong> for each machine you name the one number that decides "short of memory" (memory pressure + swapins / Committed vs limit / MemAvailable + PSI), state whether that machine is actually short, and explain why 12 GB of swap on the Mac can be harmless.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['memory compressor', 'macOS (and Windows 10+) compress inactive anonymous pages in RAM before writing anything to disk; vm_stat shows pages stored vs occupied.'],
  ['swapfile (macOS)', 'Encrypted 1 GiB files in /System/Volumes/VM that macOS creates and deletes on demand — no fixed swap size.'],
  ['memory pressure', 'macOS’s health signal for RAM (green/yellow/red; memory_pressure); more meaningful than "used" or "swap used".'],
  ['footprint', 'A macOS process’s dirty memory including compressed and swapped pages — the Activity Monitor "Memory" column.'],
  ['commit charge / commit limit', 'Windows: memory promised to processes vs RAM + pagefile; reaching the limit makes allocations fail even with free RAM.'],
  ['overcommit', 'Linux promising more anonymous memory than RAM + swap (Committed_AS > CommitLimit); the OOM killer settles it.'],
  ['wired memory', 'Kernel memory on macOS that can never be paged out or compressed (Linux: unevictable/kernel memory).'],
])}

<h3>📌 Summary</h3>
<ul>
<li>All three use spare RAM as a file cache, so "free" is near zero everywhere and means nothing on its own.</li>
<li>macOS compresses first (16.9 GiB held in 9.8 GiB here), then swaps to self-growing 1 GiB swapfiles; watch memory pressure and swapins, not "swap used".</li>
<li>Windows never overcommits: commit charge ≤ RAM + pagefile, so "out of memory" can happen with RAM free; Linux overcommits and kills with OOM instead.</li>
<li>On a Mac, read RSS, footprint and VSZ differently: VSZ (467 GiB) is meaningless, footprint is what Activity Monitor shows.</li>
<li>Page size is 16 KiB on Apple Silicon — convert vm_stat with it.</li>
</ul>
${L('https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/introduction-to-the-page-file', '📄', 'Introduction to the page file (Microsoft)', 'Commit charge, commit limit = RAM + page files, and how system-managed page files grow.', 'Open')}
${L('https://developer.apple.com/library/archive/documentation/Performance/Conceptual/ManagingMemory/Articles/AboutMemory.html', '📄', 'About the Virtual Memory System (Apple)', 'Pages, wired vs pageable memory and paging on macOS.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4</span>
<h2>Bộ nhớ trên ba hệ điều hành</h2>
<p class="lead">Activity Monitor trên Mac của bạn báo <em>"Memory Used: 30 GB of 32 GB, Swap Used: 12 GB"</em>. Laptop Windows của bạn cùng nhóm báo <em>"Committed 20/37 GB"</em> và từng không mở nổi IntelliJ với lỗi "out of memory" trong khi còn trống 6 GB. Trên VPS, <code>free</code> cho thấy gần như chẳng còn gì trống (Chương 8). Ba bảng đồng hồ, ba bộ từ vựng. Bài này trả lời: <strong>mỗi hệ điều hành làm gì khi RAM thiếu, và trên mỗi hệ, con số duy nhất nào mới thật sự có nghĩa là "có chuyện"?</strong> Chương 8 đã đi sâu vào Linux (<a href="${OS('os-8-1-page-cache')}">page cache</a>, <a href="${OS('os-8-2-swap')}">swap</a>, <a href="${OS('os-8-3-oom')}">OOM</a>); ở đây ta đặt macOS và Windows cạnh nó.</p>

<h3>Ba chiến lược khi "không đủ RAM"</h3>
<table>
<tr><th></th><th>Linux</th><th>macOS</th><th>Windows ${DOC_VI}</th></tr>
<tr><td>RAM rảnh dùng để</td><td>page cache (buff/cache)</td><td>cache file ("Cached Files")</td><td>standby list (cache)</td></tr>
<tr><td>bước đầu tiên khi bị ép</td><td>bỏ cache sạch, rồi đẩy trang ẩn danh ra swap (nếu có swap; zswap/zram là tuỳ chọn)</td><td><strong>nén</strong> trang ẩn danh ngay trong RAM (compressor, từ OS X 10.9)</td><td>cắt working set về các danh sách standby/modified; nén trang (memory compression store, Windows 10+)</td></tr>
<tr><td>nơi chứa dự phòng</td><td>phân vùng hoặc file swap cố định — trên VPS thường không có</td><td>các swapfile <strong>tự mọc khi cần</strong> trong <code>/System/Volumes/VM</code>, mỗi file 1 GiB, có mã hoá</td><td><code>pagefile.sys</code>; cỡ do hệ thống quản lý tăng tới 3× RAM hoặc 4 GB</td></tr>
<tr><td>lời hứa</td><td><strong>overcommit</strong>: malloc thành công vượt cả RAM + swap (theo heuristic)</td><td>không có commit limit; swap mọc chừng nào đĩa còn chỗ</td><td><strong>không overcommit</strong>: commit charge phải ≤ commit limit = RAM + pagefile</td></tr>
<tr><td>đường cùng</td><td>OOM killer → exit 137</td><td>hộp thoại "Your system has run out of application memory"; tiến trình được yêu cầu nhả bộ nhớ</td><td>cấp phát thất bại (lỗi out-of-memory) — không ai bị giết</td></tr>
<tr><td>con số báo có chuyện</td><td><code>MemAvailable</code> thấp + PSI bộ nhớ cao</td><td><strong>memory pressure</strong> vàng/đỏ; swapins tăng</td><td><strong>Committed</strong> sát giới hạn</td></tr>
</table>

<h3>macOS, đo thật: nén trước, swap sau</h3>
${run('c144-mac', 'sysctl hw.memsize hw.pagesize', 2)}
<p>Mọi con số trong <code>vm_stat</code> tính bằng trang <strong>16.384 byte</strong> (dòng đầu ghi rõ). Đổi ra: chỉ 88.093 trang = 1,3 GiB còn trống; 215.815 trang = 3,3 GiB là <em>wired</em> (bộ nhớ của nhân, không bao giờ được đẩy ra ngoài); 853.306 = 13 GiB là trang ẩn danh (heap, stack) và 239.741 = 3,7 GiB gắn với file. Các dòng đáng xem là của compressor:</p>
${run('c144-mac', "vm_stat | awk")}
<p>Compressor đang giữ <strong>16,9 GiB</strong> bộ nhớ của các chương trình khác trong <strong>9,8 GiB</strong> RAM — tỷ lệ 1,72 lần. Nén một trang 16 KiB mất vài micro giây; đọc lại nó từ swapfile trên SSD lâu hơn nhiều (thang độ trễ ở Mục 0). Vì thế macOS ưu tiên nén, và vì thế "Memory Used: 30 GB" tự nó không đáng lo:</p>
${run('c144-mac', 'top -l 1 -n 0 -s 0', 4)}
<p>12,1 GB swap đang dùng, rải trên 13 swapfile 1 GiB mà macOS tạo ra khi cần — chẳng có phân vùng nào được định cỡ trước. Thế mà <code>memory_pressure</code> báo 57 % còn rảnh: dữ liệu bị đẩy ra swap là dữ liệu nguội, không ai đang chờ nó. Trên macOS, <strong>swap đã dùng</strong> là quá khứ; <strong>memory pressure</strong> (đồ thị xanh/vàng/đỏ của Activity Monitor) và bộ đếm <code>Swapins</code> đang tăng (<code>vm_stat 1</code>) mới là hiện tại.</p>

<h3>Một tiến trình, ba con số kích thước</h3>
${src('ch14/an.py', 'python')}
${run('c144-mac', 'python3 an.py', 2)}
<p>Một tiến trình Python giữ 512 MiB: <strong>RSS</strong> 526 MiB — các trang đang nằm trong RAM, cùng ý nghĩa như trên Linux; <strong>VSZ</strong> 467 GiB — macOS ánh xạ những vùng dành sẵn khổng lồ (bộ đệm thư viện dùng chung, phần dành cho GPU và bộ cấp phát) vào mọi tiến trình, nên VSZ ở đây vô nghĩa; và <strong>footprint</strong> 519 MB, chính là cột "Memory" của Activity Monitor. Footprint đếm bộ nhớ bẩn của tiến trình <em>kể cả phần đang bị nén hay nằm trong swap</em>; RSS tụt xuống khi trang bị nén, footprint thì không. Trong bốn giây này chưa có gì bị nén (dữ liệu mới, chưa có áp lực), nên hai số khớp nhau. Khi săn rò rỉ bộ nhớ trên Mac, hãy nhìn footprint, đừng nhìn RSS.</p>

<h3>Linux đặt cạnh: overcommit và các con số commit</h3>
${run('c144-lx', 'free -m', 4)}
<p>Máy ảo Linux của Docker: 7,7 GiB, còn dùng được 4,5 GiB, 1 GiB swap, không nén (<code>zswap</code> tắt). Nhìn hai dòng commit: nhân đã hứa <code>Committed_AS</code> = 5,0 GiB bộ nhớ ẩn danh trong khi lượng nó có thể bảo đảm, <code>CommitLimit</code>, là 4,9 GiB. Với <code>overcommit_memory = 1</code> ("luôn đồng ý") nó chẳng bận tâm — nó cược rằng phần lớn bộ nhớ đã hứa sẽ không bao giờ bị chạm tới, và OOM killer phân xử nếu cược sai. <strong>Windows sẽ từ chối lời hứa đó</strong> ${DOC_VI}: mỗi byte được commit phải có RAM hoặc pagefile đứng sau ngay lúc commit, vì thế một máy Windows có thể báo "out of memory" trong khi RAM vật lý còn trống — thứ cạn là <em>commit limit</em>, không phải RAM. Theo hướng dẫn của Microsoft: pagefile do hệ thống quản lý sẽ tự mở rộng khi commit charge chạm 90 % giới hạn; tắt pagefile thì giới hạn tụt xuống chỉ còn bằng RAM.</p>
${run('c144-lx', 'python3 an.py')}
${lab('vm', 'pressure', 'vi', 'Kéo RAM xuống và xem các giai đoạn mà hệ điều hành nào cũng trải qua: bộ nhớ trống và cache co lại, rồi các trang rời RAM (đi nén trên macOS, ra swap trên Linux, ra pagefile trên Windows), và cuối cùng hệ thống thrashing.', { tour: 'vm-thrash' })}
${lab('cgroup', 'swap', 'vi', 'Chỉ Linux có: giới hạn bộ nhớ cgroup với swap phía sau — việc Docker làm trên VPS và là thứ macOS không làm được theo từng tiến trình (nó không có cgroup).')}
${lab('osmap', 'mac', 'vi', 'Thẻ 8–11 (RAM trống, hứa vượt, swap, cỡ trang) trên macOS: available so với memory pressure 57 %, compressor nén 1,72×, 13 swapfile, trang 16 KiB. Chuyển sang Linux và Windows để so từng câu trả lời.')}

<div class="pitfall co-tieu-de">
<p><strong>"Tôi chép một script vm_stat trên mạng và máy Mac như có ít bộ nhớ đi 4 lần."</strong> Rất nhiều script nhân số trang của <code>vm_stat</code> với 4096 — đúng trên Mac chip Intel, sai 4 lần trên Apple Silicon, nơi dòng đầu ghi <code>page size of 16384 bytes</code>. Hãy đọc cỡ trang từ dòng đầu hoặc từ <code>sysctl -n hw.pagesize</code>. Lỗi song sinh trên Windows: làm theo một bài "tối ưu" bảo tắt pagefile. RAM vật lý không đổi, nhưng commit limit tụt xuống chỉ còn bằng RAM, và những chương trình commit rộng tay (trình duyệt, JVM, IDE) bắt đầu cấp phát thất bại trong khi Task Manager vẫn báo còn bộ nhớ trống ${DOC_VI}.</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> trong nhóm chat, Mac của bạn báo 12 GB swap đã dùng, còn laptop Windows của một bạn báo "out of memory" khi RAM còn trống 6 GB. Cả hai hỏi có nên mua thêm RAM không. Bạn muốn trả lời bằng đúng con số trên từng máy.</p>
<ol>
<li>Trên Mac: <code>vm_stat</code> (đổi các dòng free, wired và compressor bằng cỡ trang 16 KiB), <code>memory_pressure | tail -1</code>, <code>sysctl vm.swapusage</code>, rồi <code>vm_stat 1</code> trong 10 giây và nhìn cột <code>swapins</code>.</li>
<li>Chạy <code>python3 an.py 512 60 &amp;</code>; so <code>ps -o rss</code> với <code>footprint -p PID</code> và với cột Memory của tiến trình đó trong Activity Monitor.</li>
<li>Trong lab: <code>free -m</code> và <code>grep -E 'Commit' /proc/meminfo</code>; giải thích vì sao <code>Committed_AS</code> có thể vượt <code>CommitLimit</code>.</li>
<li>Nhờ bạn dùng Windows mở Task Manager → Performance → Memory ("Committed x / y GB") và chạy <code>Get-CimInstance Win32_PageFileUsage</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> với mỗi máy, bạn gọi tên được con số duy nhất quyết định "thiếu bộ nhớ" (memory pressure + swapins / Committed so với giới hạn / MemAvailable + PSI), nói được máy đó có thật sự thiếu không, và giải thích vì sao 12 GB swap trên Mac có thể vô hại.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['memory compressor (bộ nén bộ nhớ)', 'macOS (và Windows 10+) nén các trang ẩn danh ít dùng ngay trong RAM trước khi ghi gì xuống đĩa; vm_stat cho thấy số trang được giữ và số trang chiếm chỗ.'],
  ['swapfile (macOS)', 'Các file 1 GiB có mã hoá trong /System/Volumes/VM mà macOS tạo và xoá khi cần — không có cỡ swap cố định.'],
  ['memory pressure (áp lực bộ nhớ)', 'Tín hiệu sức khoẻ RAM của macOS (xanh/vàng/đỏ; memory_pressure); có ý nghĩa hơn "used" hay "swap used".'],
  ['footprint', 'Bộ nhớ bẩn của một tiến trình macOS tính cả trang đang nén và trong swap — cột "Memory" của Activity Monitor.'],
  ['commit charge / commit limit', 'Windows: bộ nhớ đã hứa cho các tiến trình vs RAM + pagefile; chạm giới hạn thì cấp phát thất bại dù RAM còn trống.'],
  ['overcommit', 'Linux hứa nhiều bộ nhớ ẩn danh hơn RAM + swap (Committed_AS > CommitLimit); OOM killer phân xử.'],
  ['wired memory (bộ nhớ ghim)', 'Bộ nhớ của nhân trên macOS, không bao giờ bị đẩy ra hay nén (Linux: bộ nhớ nhân/unevictable).'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cả ba đều dùng RAM rảnh làm cache file, nên "free" ở đâu cũng gần 0 và tự nó chẳng nói lên gì.</li>
<li>macOS nén trước (ở đây 16,9 GiB nằm gọn trong 9,8 GiB), rồi swap ra các swapfile 1 GiB tự mọc; hãy nhìn memory pressure và swapins, không phải "swap used".</li>
<li>Windows không bao giờ overcommit: commit charge ≤ RAM + pagefile, nên "out of memory" có thể xảy ra khi RAM còn trống; Linux thì overcommit và giết bằng OOM.</li>
<li>Trên Mac, đọc RSS, footprint và VSZ khác nhau: VSZ (467 GiB) vô nghĩa, footprint mới là thứ Activity Monitor hiện.</li>
<li>Cỡ trang trên Apple Silicon là 16 KiB — đổi vm_stat theo con số đó.</li>
</ul>
${L('https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/introduction-to-the-page-file', '📄', 'Introduction to the page file (Microsoft)', 'Commit charge, commit limit = RAM + page file, và pagefile do hệ thống quản lý mở rộng ra sao.', 'Mở')}
${L('https://developer.apple.com/library/archive/documentation/Performance/Conceptual/ManagingMemory/Articles/AboutMemory.html', '📄', 'About the Virtual Memory System (Apple)', 'Trang, bộ nhớ wired vs có thể phân trang, và phân trang trên macOS.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 14.5 — Hệ thống file và quyền ───────────────────────── */
    {
      title: '14.5 — File systems and permissions: ext4, APFS and NTFS — case, paths, clones, hidden streams, ACLs, SIP|||14.5 — Hệ thống file và quyền: ext4, APFS và NTFS — hoa thường, đường dẫn, clone, luồng ẩn, ACL, SIP',
      slug: 'os-14-7-file-system',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Những khác biệt hệ thống file làm hỏng code: APFS và NTFS mặc định không phân biệt hoa thường (Readme.md = README.md — và tính chất đó lọt cả vào container qua virtiofs), PATH_MAX 1024 (Mac) / 4096 (Linux) / MAX_PATH 260 (Windows), ký tự và tên cấm của Windows; APFS clone 512 MiB trong 0,003 s không tốn chỗ (du vẫn đếm đủ), resource fork = ADS của NTFS, cờ quarantine của Gatekeeper = Mark of the Web; ACL "everyone deny delete" chặn cả chủ file, icacls; ổ hệ thống sealed + SIP: touch /usr/bin/x bị từ chối.',
      content: `${G145}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.5</span>
<h2>File systems and permissions on three systems</h2>
<p class="lead">Three real reports from one study group: the Spring app reads <code>data/Config.properties</code> fine on the Mac and on a Windows laptop, and dies with <code>NoSuchFileException</code> on the VPS. A script downloaded on the Mac "cannot be opened because Apple cannot check it". <code>git clone</code> works on the Mac and fails on Windows with "Filename too long". Each one is a property of the <strong>file system</strong>, not of the code. This lesson answers: <strong>where exactly do ext4, APFS and NTFS differ, and which of those differences reach your program?</strong> (Inodes, links and POSIX permissions are in <a href="${OS('os-9-1-inode')}">Chapter 9</a>; here we compare.)</p>

<h3>Three file systems side by side</h3>
<table>
<tr><th></th><th>ext4 (Linux)</th><th>APFS (macOS)</th><th>NTFS (Windows) ${DOC_EN}</th></tr>
<tr><td>case</td><td><strong>sensitive</strong>: <code>a.txt</code> ≠ <code>A.txt</code></td><td>insensitive but case-preserving (default)</td><td>insensitive but case-preserving; per-directory sensitivity can be switched on (<code>fsutil file setCaseSensitiveInfo</code>, used by WSL)</td></tr>
<tr><td>separator</td><td><code>/</code></td><td><code>/</code></td><td><code>\\</code> (the Win32 API also accepts <code>/</code>)</td></tr>
<tr><td>forbidden in names</td><td>only <code>/</code> and NUL</td><td>only <code>/</code> and NUL (<code>:</code> shows as <code>/</code> in Finder)</td><td><code>&lt; &gt; : " / \\ | ? *</code>, trailing dot or space, and reserved names <code>CON</code>, <code>PRN</code>, <code>AUX</code>, <code>NUL</code>, <code>COM1</code>…, <code>LPT1</code>…</td></tr>
<tr><td>longest path</td><td>4096 (<code>PATH_MAX</code>)</td><td>1024 (<code>PATH_MAX</code>)</td><td>260 (<code>MAX_PATH</code>) unless the registry <em>and</em> the app opt in to long paths</td></tr>
<tr><td>copy-on-write copies</td><td>no (btrfs/xfs have reflinks)</td><td><strong>clones</strong> (<code>cp -c</code>), snapshots</td><td>no (ReFS has block cloning); VSS shadow copies</td></tr>
<tr><td>extra data per file</td><td>xattrs (<code>user.*</code>)</td><td>xattrs + resource fork</td><td>alternate data streams (<code>file:stream</code>)</td></tr>
<tr><td>permissions</td><td>mode bits + optional POSIX ACL</td><td>mode bits + ACL (<code>chmod +a</code>) + file flags + SIP</td><td>ACLs only (DACL of ACEs, <code>icacls</code>); no execute bit — extensions decide</td></tr>
</table>

<h3>APFS, measured: a sealed system and a case-insensitive home</h3>
${run('c145-mac', 'mount | grep', 4)}
<p>macOS boots from a <strong>sealed, read-only snapshot</strong> (<code>/dev/disk3s1s1</code>, "sealed, read-only"): the system volume is cryptographically signed, and your files live on a separate data volume mounted at <code>/System/Volumes/Data</code>. SIP is enabled, Gatekeeper assessments are enabled, and the path limit is 1024 bytes versus 4096 on Linux.</p>
${run('c145-mac', 'touch Readme.md')}
<p>Opening <code>readme.md</code> succeeded (<code>ls</code> echoes the name as you typed it) although only <code>Readme.md</code> exists; creating <code>README.md</code> created nothing new — it opened the existing file, which kept its original spelling. The Linux side, including a folder from this Mac mounted into the container:</p>
${run('c145-lx', 'mount | grep', 3)}
<p>In the container's own <code>/tmp</code> (overlay on Linux) the two names are two files. In <code>/mac</code>, a Mac folder shared into the container over <strong>virtiofs</strong>, Linux sees only one: the case-insensitivity of APFS reaches through the VM. Code tested in Docker on a Mac with a bind-mounted project is therefore <em>not</em> tested against Linux file names.</p>

<h3>Clones: a 512 MiB copy that costs nothing</h3>
${run('c145-mac', 'dd if=/dev/urandom', 6)}
<p><code>cp -c</code> asks APFS for a <strong>clone</strong>: 0.003 s, and free space did not move (31,556 → 31,557 MiB, noise). The new file shares every block with the original until one of them is modified — copy-on-write at the file level, the same idea as fork in lesson 14.2. A normal <code>cp</code> took 0.263 s and consumed 512 MiB. Yet <code>du</code> reports 1,549 MiB for the three files: it adds up sizes and cannot see that two of them share storage. On Linux:</p>
${run('c145-lx', 'head -c 1M /dev/urandom')}
<p>ext4 (and the overlay on top of it) has no reflinks; btrfs and xfs do (<code>cp --reflink</code>). On Windows ${DOC_EN} NTFS has no clones; ReFS supports block cloning.</p>

<h3>Hidden data: resource forks and alternate data streams</h3>
${run('c145-mac', "echo 'echo hi' > tool.sh", 3)}
<p><code>ls -l</code> says <code>tool.sh</code> is 8 bytes, yet it carries 13 more bytes in its <strong>resource fork</strong> (an old Mac OS feature now stored as the xattr <code>com.apple.ResourceFork</code>) — invisible to <code>cat</code>, <code>wc</code> and most copy tools. NTFS has the same idea, more general: <strong>alternate data streams</strong> ${DOC_EN}. <code>echo secret &gt; notes.txt:hidden</code> writes into a second stream of <code>notes.txt</code>; <code>dir /r</code> or <code>Get-Item notes.txt -Stream *</code> lists them. Windows marks downloaded files with a <code>Zone.Identifier</code> stream (the "Mark of the Web"), exactly like macOS's <code>com.apple.quarantine</code> xattr above: browsers set it, and on first launch <strong>Gatekeeper</strong> (macOS) or SmartScreen (Windows) checks the file before it runs. <code>com.apple.provenance</code> is newer: macOS tags which app created the file. Linux has xattrs but none of this policy.</p>

<h3>Permissions: mode bits, ACLs, and protection even from root</h3>
${run('c145-mac', 'chmod +a', 2)}
<p>One ACL entry, <code>everyone deny delete</code>, and even the owner cannot delete the file — ACL entries are checked before the mode bits on macOS. Removing the entry makes <code>rm</code> work again. On Linux the equivalent tools are <code>setfacl</code>/<code>getfacl</code>:</p>
${run('c145-lx', 'echo hi > f')}
<p>On Windows ${DOC_EN} ACLs are the whole story: each file has a DACL, a list of allow/deny entries for users and groups, and there are no mode bits. <code>icacls file</code> lists it; <code>icacls file /deny Everyone:(D)</code> is the same "deny delete"; <code>icacls file /grant dev:(R)</code> grants read. There is no execute bit: Windows decides what runs by extension (<code>.exe</code>, <code>.bat</code>, <code>.ps1</code>), and PowerShell adds an execution policy for scripts.</p>
${run('c145-mac', 'ls -lO /usr/bin/true', 2)}
<p>The last layer is macOS-only: system binaries carry the <code>restricted</code> flag, the system volume is sealed and read-only, and <strong>SIP</strong> refuses writes to <code>/System</code>, <code>/usr</code> (except <code>/usr/local</code>) and <code>/bin</code> even to root. Our <code>touch</code> as an ordinary user was refused with "Operation not permitted" — and with <code>sudo</code> it would be refused too. That is also why <code>dtruss</code> failed in lesson 14.3. Windows has a similar fence ${DOC_EN}: Windows Resource Protection restricts full access to system files, folders and registry keys to the <code>TrustedInstaller</code> service — an administrator gets "access denied" too.</p>
${lab('perm', 'acl', 'en', 'Walk an access check with an ACL entry in front of the mode bits — the Linux model. macOS checks its ACL entries first in the same way; Windows has only the ACL part.', { tour: 'perm-acl' })}
${lab('fdtable', 'links', 'en', 'A name is just a pointer to an inode. On a case-insensitive file system, Readme.md and README.md are two spellings that resolve to the same pointer.')}
${lab('osmap', 'compare', 'en', 'Cards 12–13 side by side: upper/lower case in file names and permissions beyond rwx (POSIX ACLs, macOS ACLs, NTFS ACLs) — the same question answered three ways.')}

<div class="pitfall co-tieu-de">
<p><strong>"The tests pass in Docker on my Mac, so they will pass on the Linux CI."</strong> Not if the project is bind-mounted: as measured above, a virtiofs share keeps APFS's case-insensitivity, so <code>Config.properties</code> vs <code>config.properties</code>, or two files differing only by case, behave like on the Mac. CI (and the VPS) run on ext4 and are case-sensitive. Copy the project into the image (<code>COPY . .</code>) when you test, keep file-name case consistent in imports and resource paths, and add a CI job on Linux. The reverse trap: a repository with both <code>Readme.md</code> and <code>README.md</code> checks out on a Mac or Windows as <em>one</em> file, and Git shows it as modified forever.</p>
</div>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> before handing the project to two Windows teammates and deploying it to the VPS, you want a five-minute "will this repository survive three file systems?" check.</p>
<ol>
<li>Names colliding by case: <code>git ls-files | tr 'A-Z' 'a-z' | sort | uniq -d</code> (must print nothing).</li>
<li>Names illegal on Windows: <code>git ls-files | grep -E '[&lt;&gt;:"|?*\\\\]|(^|/)(CON|PRN|AUX|NUL|COM[0-9]|LPT[0-9])(\\.|/|$)'</code>; and paths too long for MAX_PATH: <code>git ls-files | awk 'length &gt; 200'</code>.</li>
<li>In a scratch folder on the Mac: make a 100 MiB file, <code>cp -c</code> it, compare <code>df -m .</code> before and after with <code>du -sm .</code>.</li>
<li>Repeat the <code>chmod +a "everyone deny delete"</code> experiment and undo it; write down the <code>icacls</code> line that does the same on Windows.</li>
</ol>
<p><strong>Done when:</strong> your repository has no case collisions, no Windows-illegal names and no path over 200 characters (or you have a plan for each), and you can explain why <code>du</code> and <code>df</code> disagree after a clone.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['case-insensitive, case-preserving', 'APFS and NTFS default: a name keeps the spelling it was created with, but lookups ignore case.'],
  ['APFS clone', 'A copy that shares blocks with the original until either is modified (cp -c); costs no space at first, du still counts it.'],
  ['sealed system volume', 'macOS boots from a signed, read-only snapshot of the system; user data lives on a separate data volume.'],
  ['alternate data stream (ADS)', 'A named extra stream of an NTFS file (file:stream); macOS’s counterpart is the resource fork / xattrs.'],
  ['quarantine / Mark of the Web', 'A flag on downloaded files (com.apple.quarantine xattr, NTFS Zone.Identifier stream) that makes Gatekeeper/SmartScreen check them.'],
  ['ACL / icacls', 'Access control list: allow/deny entries per user or group. Optional on Linux (setfacl), layered on mode bits on macOS (chmod +a), the only model on Windows (icacls).'],
  ['MAX_PATH', 'Windows’ classic 260-character path limit; lifted only when LongPathsEnabled is set and the app declares longPathAware.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>ext4 is case-sensitive; APFS and NTFS are not (by default) — and a virtiofs bind mount carries the Mac's behaviour into Linux containers.</li>
<li>Path limits differ: 4096 (Linux), 1024 (macOS), 260 on Windows unless long paths are enabled; Windows also forbids <code>&lt;&gt;:"|?*</code> and names like <code>CON</code>.</li>
<li>APFS clones copy 512 MiB in 0.003 s without using space; <code>du</code> still counts them; ext4 cannot.</li>
<li>Files can carry hidden data: resource forks/xattrs on macOS, alternate data streams on NTFS; quarantine/Mark of the Web makes Gatekeeper/SmartScreen check downloads.</li>
<li>Permissions: mode bits (+ACL) on Linux, mode bits + ACL + flags + SIP on macOS, ACLs only on Windows.</li>
</ul>
${L('https://developer.apple.com/documentation/foundation/about-apple-file-system', '📄', 'About Apple File System', 'Clones, snapshots, space sharing and case sensitivity in APFS.', 'Open')}
${L('https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/icacls', '📄', 'icacls (Microsoft)', 'Display and change Windows ACLs from the command line.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.5</span>
<h2>Hệ thống file và quyền trên ba hệ điều hành</h2>
<p class="lead">Ba lời báo lỗi thật từ cùng một nhóm học: ứng dụng Spring đọc <code>data/Config.properties</code> ngon lành trên Mac và trên một laptop Windows, nhưng chết với <code>NoSuchFileException</code> trên VPS. Một script tải về trên Mac "không mở được vì Apple không kiểm tra được nó". <code>git clone</code> chạy trên Mac mà hỏng trên Windows với "Filename too long". Cả ba đều là tính chất của <strong>hệ thống file</strong>, không phải của code. Bài này trả lời: <strong>ext4, APFS và NTFS khác nhau chính xác ở đâu, và khác biệt nào chạm tới chương trình của bạn?</strong> (Inode, liên kết và quyền POSIX ở <a href="${OS('os-9-1-inode')}">Chương 9</a>; ở đây ta so sánh.)</p>

<h3>Ba hệ thống file đặt cạnh nhau</h3>
<table>
<tr><th></th><th>ext4 (Linux)</th><th>APFS (macOS)</th><th>NTFS (Windows) ${DOC_VI}</th></tr>
<tr><td>hoa thường</td><td><strong>phân biệt</strong>: <code>a.txt</code> ≠ <code>A.txt</code></td><td>không phân biệt nhưng giữ nguyên cách viết (mặc định)</td><td>không phân biệt nhưng giữ cách viết; bật được phân biệt theo từng thư mục (<code>fsutil file setCaseSensitiveInfo</code>, WSL dùng)</td></tr>
<tr><td>dấu phân cách</td><td><code>/</code></td><td><code>/</code></td><td><code>\\</code> (Win32 API cũng nhận <code>/</code>)</td></tr>
<tr><td>cấm trong tên</td><td>chỉ <code>/</code> và NUL</td><td>chỉ <code>/</code> và NUL (<code>:</code> hiện thành <code>/</code> trong Finder)</td><td><code>&lt; &gt; : " / \\ | ? *</code>, dấu chấm hay khoảng trắng ở cuối, và các tên dành riêng <code>CON</code>, <code>PRN</code>, <code>AUX</code>, <code>NUL</code>, <code>COM1</code>…, <code>LPT1</code>…</td></tr>
<tr><td>đường dẫn dài nhất</td><td>4096 (<code>PATH_MAX</code>)</td><td>1024 (<code>PATH_MAX</code>)</td><td>260 (<code>MAX_PATH</code>) trừ khi registry <em>và</em> ứng dụng cùng bật đường dẫn dài</td></tr>
<tr><td>bản sao copy-on-write</td><td>không (btrfs/xfs có reflink)</td><td><strong>clone</strong> (<code>cp -c</code>), snapshot</td><td>không (ReFS có block cloning); VSS shadow copy</td></tr>
<tr><td>dữ liệu phụ theo file</td><td>xattr (<code>user.*</code>)</td><td>xattr + resource fork</td><td>alternate data stream (<code>file:stream</code>)</td></tr>
<tr><td>quyền</td><td>bit mode + ACL POSIX tuỳ chọn</td><td>bit mode + ACL (<code>chmod +a</code>) + cờ file + SIP</td><td>chỉ có ACL (DACL gồm các ACE, <code>icacls</code>); không có bit thực thi — đuôi file quyết định</td></tr>
</table>

<h3>APFS, đo thật: hệ thống niêm phong và thư mục nhà không phân biệt hoa thường</h3>
${run('c145-mac', 'mount | grep', 4)}
<p>macOS khởi động từ một <strong>snapshot chỉ-đọc được niêm phong</strong> (<code>/dev/disk3s1s1</code>, "sealed, read-only"): ổ hệ thống được ký bằng mật mã, còn file của bạn nằm trên một ổ dữ liệu riêng gắn ở <code>/System/Volumes/Data</code>. SIP đang bật, Gatekeeper đang bật, và giới hạn đường dẫn là 1024 byte so với 4096 trên Linux.</p>
${run('c145-mac', 'touch Readme.md')}
<p>Mở <code>readme.md</code> thành công (<code>ls</code> in lại đúng cái tên bạn gõ) dù chỉ có <code>Readme.md</code>; tạo <code>README.md</code> chẳng tạo thêm gì — nó mở file sẵn có, và file vẫn giữ cách viết ban đầu. Phía Linux, kể cả một thư mục từ Mac này gắn vào container:</p>
${run('c145-lx', 'mount | grep', 3)}
<p>Trong <code>/tmp</code> của chính container (overlay trên Linux), hai tên là hai file. Trong <code>/mac</code>, một thư mục Mac chia sẻ vào container qua <strong>virtiofs</strong>, Linux chỉ thấy một: tính không phân biệt hoa thường của APFS xuyên qua cả máy ảo. Vì vậy code thử trong Docker trên Mac với dự án gắn bằng bind mount <em>không</em> được thử với tên file của Linux.</p>

<h3>Clone: một bản sao 512 MiB chẳng tốn gì</h3>
${run('c145-mac', 'dd if=/dev/urandom', 6)}
<p><code>cp -c</code> xin APFS một <strong>clone</strong>: 0,003 s, và chỗ trống không nhúc nhích (31.556 → 31.557 MiB, nhiễu). File mới dùng chung mọi khối với file gốc cho tới khi một trong hai bị sửa — copy-on-write ở mức file, cùng ý tưởng với fork ở bài 14.2. Một lệnh <code>cp</code> thường mất 0,263 s và ngốn 512 MiB. Thế mà <code>du</code> báo 1.549 MiB cho ba file: nó cộng kích thước lại và không thấy được hai trong số đó dùng chung chỗ. Trên Linux:</p>
${run('c145-lx', 'head -c 1M /dev/urandom')}
<p>ext4 (và overlay chồng trên nó) không có reflink; btrfs và xfs thì có (<code>cp --reflink</code>). Trên Windows ${DOC_VI} NTFS không có clone; ReFS hỗ trợ block cloning.</p>

<h3>Dữ liệu ẩn: resource fork và alternate data stream</h3>
${run('c145-mac', "echo 'echo hi' > tool.sh", 3)}
<p><code>ls -l</code> bảo <code>tool.sh</code> nặng 8 byte, nhưng nó mang thêm 13 byte trong <strong>resource fork</strong> (một tính năng của Mac OS cũ, nay lưu thành xattr <code>com.apple.ResourceFork</code>) — vô hình với <code>cat</code>, <code>wc</code> và hầu hết công cụ chép file. NTFS có cùng ý tưởng, tổng quát hơn: <strong>alternate data stream</strong> ${DOC_VI}. <code>echo secret &gt; notes.txt:hidden</code> ghi vào một luồng thứ hai của <code>notes.txt</code>; <code>dir /r</code> hay <code>Get-Item notes.txt -Stream *</code> liệt kê chúng. Windows đánh dấu file tải về bằng một luồng <code>Zone.Identifier</code> ("Mark of the Web"), y như xattr <code>com.apple.quarantine</code> của macOS ở trên: trình duyệt gắn nó, và lần chạy đầu tiên <strong>Gatekeeper</strong> (macOS) hay SmartScreen (Windows) kiểm file trước khi cho chạy. <code>com.apple.provenance</code> thì mới hơn: macOS ghi lại ứng dụng nào đã tạo ra file. Linux có xattr nhưng không có chính sách nào kiểu này.</p>

<h3>Quyền: bit mode, ACL, và bảo vệ cả khỏi root</h3>
${run('c145-mac', 'chmod +a', 2)}
<p>Chỉ một mục ACL, <code>everyone deny delete</code>, là đến chủ file cũng không xoá được — trên macOS các mục ACL được kiểm trước bit mode. Gỡ mục đó đi thì <code>rm</code> lại chạy. Trên Linux công cụ tương đương là <code>setfacl</code>/<code>getfacl</code>:</p>
${run('c145-lx', 'echo hi > f')}
<p>Trên Windows ${DOC_VI} ACL là tất cả: mỗi file có một DACL, danh sách các mục cho phép/cấm theo người dùng và nhóm, và không có bit mode. <code>icacls file</code> liệt kê nó; <code>icacls file /deny Everyone:(D)</code> chính là "cấm xoá" ở trên; <code>icacls file /grant dev:(R)</code> cho quyền đọc. Không có bit thực thi: Windows quyết định thứ gì chạy được theo đuôi file (<code>.exe</code>, <code>.bat</code>, <code>.ps1</code>), và PowerShell thêm execution policy cho script.</p>
${run('c145-mac', 'ls -lO /usr/bin/true', 2)}
<p>Lớp cuối chỉ macOS có: file chạy của hệ thống mang cờ <code>restricted</code>, ổ hệ thống được niêm phong và chỉ-đọc, và <strong>SIP</strong> từ chối ghi vào <code>/System</code>, <code>/usr</code> (trừ <code>/usr/local</code>) và <code>/bin</code> kể cả với root. Lệnh <code>touch</code> của ta với tư cách người dùng thường bị từ chối bằng "Operation not permitted" — và có <code>sudo</code> thì vẫn bị từ chối. Đó cũng là lý do <code>dtruss</code> thất bại ở bài 14.3. Windows có một hàng rào tương tự ${DOC_VI}: Windows Resource Protection chỉ cho dịch vụ <code>TrustedInstaller</code> toàn quyền với file, thư mục và khoá registry của hệ thống — quản trị viên cũng nhận "access denied".</p>
${lab('perm', 'acl', 'vi', 'Đi từng bước một phép kiểm quyền có mục ACL đứng trước bit mode — mô hình của Linux. macOS cũng kiểm các mục ACL trước theo cách đó; Windows chỉ có phần ACL.', { tour: 'perm-acl' })}
${lab('fdtable', 'links', 'vi', 'Tên chỉ là con trỏ tới inode. Trên hệ thống file không phân biệt hoa thường, Readme.md và README.md là hai cách viết dẫn tới cùng một con trỏ.')}
${lab('osmap', 'compare', 'vi', 'Thẻ 12–13 đặt cạnh nhau: chữ hoa/thường trong tên tệp và quyền ngoài rwx (ACL POSIX, ACL macOS, ACL NTFS) — cùng một câu hỏi, ba cách trả lời.')}

<div class="pitfall co-tieu-de">
<p><strong>"Test qua hết trong Docker trên Mac, nên lên CI Linux cũng sẽ qua."</strong> Không, nếu dự án được gắn bằng bind mount: như vừa đo, thư mục chia sẻ qua virtiofs giữ nguyên tính không phân biệt hoa thường của APFS, nên <code>Config.properties</code> với <code>config.properties</code>, hay hai file chỉ khác nhau ở hoa thường, hành xử y như trên Mac. CI (và VPS) chạy trên ext4 và phân biệt hoa thường. Khi test hãy chép dự án vào ảnh (<code>COPY . .</code>), giữ cách viết tên file nhất quán trong import và đường dẫn tài nguyên, và thêm một job CI trên Linux. Cái bẫy ngược lại: một kho có cả <code>Readme.md</code> lẫn <code>README.md</code> khi checkout trên Mac hay Windows chỉ còn <em>một</em> file, và Git báo nó bị sửa mãi mãi.</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> trước khi giao dự án cho hai bạn dùng Windows và deploy lên VPS, bạn muốn một phép kiểm năm phút "kho này có sống sót qua ba hệ thống file không?".</p>
<ol>
<li>Tên đụng nhau theo hoa thường: <code>git ls-files | tr 'A-Z' 'a-z' | sort | uniq -d</code> (phải không in ra gì).</li>
<li>Tên cấm trên Windows: <code>git ls-files | grep -E '[&lt;&gt;:"|?*\\\\]|(^|/)(CON|PRN|AUX|NUL|COM[0-9]|LPT[0-9])(\\.|/|$)'</code>; và đường dẫn quá dài với MAX_PATH: <code>git ls-files | awk 'length &gt; 200'</code>.</li>
<li>Trong một thư mục nháp trên Mac: tạo một file 100 MiB, <code>cp -c</code> nó, so <code>df -m .</code> trước và sau với <code>du -sm .</code>.</li>
<li>Làm lại thí nghiệm <code>chmod +a "everyone deny delete"</code> rồi gỡ nó; ghi ra dòng <code>icacls</code> làm đúng việc đó trên Windows.</li>
</ol>
<p><strong>Đạt khi:</strong> kho của bạn không có tên đụng hoa thường, không có tên cấm trên Windows và không có đường dẫn nào dài quá 200 ký tự (hoặc bạn có kế hoạch cho từng cái), và bạn giải thích được vì sao <code>du</code> và <code>df</code> lệch nhau sau một lần clone.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['case-insensitive, case-preserving (không phân biệt, giữ cách viết)', 'Mặc định của APFS và NTFS: tên giữ cách viết lúc tạo, nhưng tìm kiếm thì bỏ qua hoa thường.'],
  ['APFS clone', 'Bản sao dùng chung khối với bản gốc cho tới khi một bên bị sửa (cp -c); lúc đầu không tốn chỗ, du vẫn đếm đủ.'],
  ['sealed system volume (ổ hệ thống niêm phong)', 'macOS khởi động từ một snapshot hệ thống chỉ-đọc có chữ ký; dữ liệu người dùng ở một ổ dữ liệu riêng.'],
  ['alternate data stream (ADS)', 'Một luồng dữ liệu phụ có tên của file NTFS (file:stream); bên macOS tương ứng là resource fork / xattr.'],
  ['quarantine / Mark of the Web', 'Cờ trên file tải về (xattr com.apple.quarantine, luồng Zone.Identifier của NTFS) khiến Gatekeeper/SmartScreen kiểm chúng.'],
  ['ACL / icacls', 'Danh sách kiểm soát truy cập: các mục cho phép/cấm theo người dùng hay nhóm. Tuỳ chọn trên Linux (setfacl), chồng lên bit mode trên macOS (chmod +a), là mô hình duy nhất trên Windows (icacls).'],
  ['MAX_PATH', 'Giới hạn đường dẫn 260 ký tự cổ điển của Windows; chỉ được gỡ khi bật LongPathsEnabled và ứng dụng khai báo longPathAware.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>ext4 phân biệt hoa thường; APFS và NTFS thì không (mặc định) — và bind mount qua virtiofs mang hành vi của Mac vào container Linux.</li>
<li>Giới hạn đường dẫn khác nhau: 4096 (Linux), 1024 (macOS), 260 trên Windows trừ khi bật đường dẫn dài; Windows còn cấm <code>&lt;&gt;:"|?*</code> và các tên như <code>CON</code>.</li>
<li>APFS clone chép 512 MiB trong 0,003 s mà không tốn chỗ; <code>du</code> vẫn đếm đủ; ext4 không làm được.</li>
<li>File có thể mang dữ liệu ẩn: resource fork/xattr trên macOS, alternate data stream trên NTFS; quarantine/Mark of the Web khiến Gatekeeper/SmartScreen kiểm file tải về.</li>
<li>Quyền: bit mode (+ACL) trên Linux, bit mode + ACL + cờ + SIP trên macOS, chỉ ACL trên Windows.</li>
</ul>
${L('https://developer.apple.com/documentation/foundation/about-apple-file-system', '📄', 'About Apple File System', 'Clone, snapshot, chia sẻ dung lượng và phân biệt hoa thường trong APFS.', 'Mở')}
${L('https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/icacls', '📄', 'icacls (Microsoft)', 'Xem và đổi ACL của Windows từ dòng lệnh.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 14.6 — WSL2 và Docker trong máy ảo ───────────────────────── */
    {
      title: '14.6 — WSL2 and Docker Desktop: why Linux on a Mac or a Windows laptop is a virtual machine, measured|||14.6 — WSL2 và Docker Desktop: vì sao Linux trên Mac hay laptop Windows là một máy ảo, đo thật',
      slug: 'os-14-3-wsl',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Container là tiến trình Linux (Chương 12) nên cần nhân Linux: Docker Desktop trên Mac chạy máy ảo linuxkit qua Virtualization.framework (một tiến trình duy nhất trên macOS, 235 tiến trình bên trong), Windows chạy WSL2 — một nhân Linux thật do Microsoft dựng trong máy ảo Hyper-V gọn nhẹ (WSL1 thì dịch syscall); đo cái giá của ranh giới: 3.000 file nhỏ qua virtiofs ghi chậm ~10–15 lần, đọc/xoá chậm ~20 lần so với ổ của máy ảo; .wslconfig, /mnt/c vs ~, giữ node_modules trong volume.',
      content: `${G146}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.6</span>
<h2>WSL2 and Docker Desktop: Linux in a virtual machine</h2>
<p class="lead">Since <a href="${OS('os-0-1-cai-dat')}">lesson 0.1</a> this course has said "Docker on a Mac runs in a VM", and Chapter 12 showed why: a container is a Linux process fenced by Linux namespaces and cgroups (<a href="${OS('os-12-6-runc')}">lesson 12.6</a>). XNU and NT have neither, so Linux containers need a Linux kernel somewhere. On Windows the same need gave us <strong>WSL2</strong>. This lesson answers: <strong>what sits between your terminal and the Linux kernel on a Mac, on a Windows laptop and on the VPS — and what does crossing that boundary cost your daily work?</strong></p>

<h3>The layers on each machine</h3>
<table>
<tr><th></th><th>macOS + Docker Desktop</th><th>Windows + WSL2 / Docker Desktop ${DOC_EN}</th><th>Linux VPS</th></tr>
<tr><td>hypervisor</td><td>Apple Virtualization.framework (on Hypervisor.framework)</td><td>Hyper-V; Windows itself becomes the "root partition" beside the VM</td><td>none for Docker (the VPS itself is a VM on the provider's hypervisor)</td></tr>
<tr><td>Linux kernel</td><td>linuxkit, built by Docker</td><td>Microsoft-built kernel from kernel.org sources, updated by Windows Update</td><td>the distribution's kernel</td></tr>
<tr><td>where distros/containers live</td><td>containerd inside the VM</td><td>each WSL distro is an isolated container inside one shared utility VM; Docker Desktop uses that VM too</td><td>containerd on the host</td></tr>
<tr><td>your files</td><td>shared into the VM over <strong>virtiofs</strong></td><td>Windows drives appear as <code>/mnt/c</code> (DrvFs); Linux files appear in Windows as <code>\\\\wsl.localhost\\&lt;distro&gt;</code></td><td>local ext4</td></tr>
</table>
<p>Before WSL2 there was <strong>WSL1</strong> ${DOC_EN}: no Linux kernel at all — the NT kernel <em>translated</em> Linux system calls (the "pico process" layer). It was fast on Windows files but never complete: Docker could not run on it. WSL2 replaced translation with a real kernel; Microsoft's comparison table lists "Full Linux Kernel" and "Full system call compatibility" for WSL2, and "Performance across OS file systems" only for WSL1.</p>

<h3>Measured on the Mac: one process that is a whole computer</h3>
${run('c146-mac', 'uname -sm', 4)}
<p>The Docker client is a macOS program (<code>darwin/arm64</code>); the server it talks to is Linux (<code>linux/arm64</code>, kernel 7.0.12-linuxkit) with 10 CPUs and 8.3 GB of RAM — the size set in Docker Desktop's settings, a quarter of the Mac's 32 GB. To macOS, that whole Linux machine is <strong>one process</strong>, <code>com.apple.Virtualization.VirtualMachine</code>, here at 12 % CPU (the sum of everything all containers were doing at that instant) and 3.6 GiB resident: guest pages the VM never touched are never allocated on the Mac, and idle ones can be compressed or swapped like any other memory (lesson 14.4). From inside, it is a normal Linux box:</p>
${run('c146-mac', 'docker run --rm --label oslab=1 --name os-c146-vm', 3)}
<p>235 processes, 7.7 GiB, PID 1 <code>initd</code>; Alpine and Ubuntu containers both report the VM's kernel, because a container brings no kernel of its own (lesson 12.6). Every effect of the VM you met in this course comes from this layer: hardware performance counters missing for <code>perf</code> (lesson 0.1), the 3.1 s default stop grace period measured in <a href="${OS('os-1-5-pid1')}">lesson 1.5</a>, memory and CPU limited by the VM before any cgroup.</p>
${lab('nslayers', 'docker', 'en', 'One container, two views: the process inside and the same process in the Docker VM. On a Mac or Windows laptop there is a third view above both — macOS or Windows, which sees only one VM process.', { tour: 'nslayers-views' })}

<h3>The price of the boundary: small files</h3>
<p>Every file operation on a folder shared from the Mac becomes a request that leaves the Linux kernel, crosses the VM boundary to macOS, is served by APFS and comes back. One request is fast; a build tool makes tens of thousands. A small benchmark — write, stat, read and delete 3,000 tiny files, the shape of <code>npm install</code>, <code>git status</code> or a Maven build — once in a folder shared from the Mac (<code>/mac</code>) and once on the VM's own disk (<code>/tmp</code>), twice each:</p>
${src('ch14/bench-fs.sh')}
${run('c146-mac', 'docker run --rm --label oslab=1 --name os-c146-fs')}
<table>
<tr><th>3,000 files</th><th>shared from the Mac (virtiofs)</th><th>VM's own disk (overlay)</th><th>slower by</th></tr>
<tr><td>write</td><td>0.92–1.45 s</td><td>0.085–0.094 s</td><td>~10–15×</td></tr>
<tr><td>stat</td><td>0.30–0.33 s</td><td>0.024–0.025 s</td><td>~12×</td></tr>
<tr><td>read</td><td>0.48–0.54 s</td><td>0.021–0.022 s</td><td>~23×</td></tr>
<tr><td>delete</td><td>0.57–0.61 s</td><td>0.026–0.028 s</td><td>~22×</td></tr>
</table>
<p>Windows has the same shape ${DOC_EN}. Microsoft's guidance is explicit: WSL2 is fast on its own Linux file system and slow "across OS file systems" — so keep a project you build with Linux tools <em>inside</em> the WSL distro (<code>~/project</code>, reachable from Windows as <code>\\\\wsl.localhost\\Ubuntu\\home\\…</code>), not under <code>/mnt/c/Users/…</code>; and keep a project you build with Windows tools (NetBeans, Visual Studio) on the Windows drive. Docker Desktop on Windows inherits the same rule through its WSL2 backend.</p>
${lab('latency', 'default', 'en', 'The latency ladder: a file operation inside the VM is a RAM-speed kernel call; one on a shared folder adds a trip across the VM boundary to the host OS and back, every single time.')}

<h3>Sizing the VM</h3>
<p>Both VMs take a fixed slice of the host. Docker Desktop: Settings → Resources (here 10 CPUs, 8 GB). WSL2 ${DOC_EN}: <code>%UserProfile%\\.wslconfig</code>, section <code>[wsl2]</code>, where <code>memory</code> defaults to 50 % of Windows' memory, <code>processors</code> to all logical processors and <code>swap</code> to 25 % of memory; changes apply after <code>wsl --shutdown</code> (Microsoft's "8-second rule": wait until the VM has really stopped). systemd inside WSL is opt-in with <code>[boot] systemd=true</code> in <code>/etc/wsl.conf</code>. Too small and your builds hit the OOM killer <em>inside</em> the VM (exit 137, Chapter 8) while the host still has free RAM; too large and the host starts compressing and swapping.</p>

<div class="pitfall co-tieu-de">
<p><strong>"npm install takes four minutes in Docker on my Mac and 20 seconds on the VPS."</strong> The project, and with it <code>node_modules</code> (tens of thousands of small files), is bind-mounted from the Mac, so every one of those files pays the 10–20× toll measured above. Keep <code>node_modules</code> (and <code>target/</code>, <code>.gradle/</code>, build caches) inside the VM: a named volume (<code>-v nm:/app/node_modules</code>) or a <code>COPY</code> into the image; mount only the source you edit. On Windows the same mistake is cloning the repo to <code>C:\\</code> and building it from WSL through <code>/mnt/c</code> — clone it inside the distro instead. Also expect file-change notifications from editors on the host to be unreliable inside the VM; dev servers offer a polling mode (for example <code>CHOKIDAR_USEPOLLING=1</code>) for that case.</p>
</div>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the group's Next.js project builds in 40 s on the VPS, 3 minutes in Docker on your Mac, and 6 minutes in WSL on a teammate's laptop. You want numbers, not guesses, and a fix for both laptops.</p>
<ol>
<li>On the Mac, run <code>docker run --rm -v "$PWD":/mac os-lab /mac/bench-fs.sh /mac</code> and the same with <code>/tmp</code>, from the <code>lab/code/ch14</code> folder; compare with the table above.</li>
<li>Find the VM in macOS: <code>ps -axo pid,%cpu,rss,comm | grep Virtualization</code> while a container works, and Docker Desktop's Resources page.</li>
<li>Ask the Windows teammate to run the same script inside WSL twice: in <code>~/bench</code> and in <code>/mnt/c/Users/&lt;name&gt;/bench</code>; and to show their <code>.wslconfig</code>.</li>
<li>Change the dev setup so <code>node_modules</code> lives in a named volume (Mac) and the repo lives inside the WSL distro (Windows); measure <code>npm ci</code> before and after.</li>
</ol>
<p><strong>Done when:</strong> you have the four-row table for your Mac, the two WSL numbers from your teammate, and an <code>npm ci</code> time that dropped after moving the small files to the VM's own disk — with one sentence explaining the boundary each file operation was crossing.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['WSL2', 'Windows Subsystem for Linux 2: a real Microsoft-built Linux kernel in a managed Hyper-V utility VM; distros run as containers inside it.'],
  ['WSL1', 'The earlier design: no Linux kernel, the NT kernel translated Linux system calls; fast on Windows files, never fully compatible.'],
  ['Virtualization.framework', 'Apple’s API for running VMs on macOS; Docker Desktop uses it for its linuxkit VM.'],
  ['virtiofs', 'The file-sharing protocol between a host and a VM; every operation on a shared folder crosses the VM boundary.'],
  ['DrvFs / \\\\wsl.localhost', 'How WSL sees Windows drives (/mnt/c) and how Windows sees WSL’s files — both cross the VM boundary.'],
  ['.wslconfig', 'Per-user file that sizes the WSL2 VM: memory (default 50 %), processors, swap; applied after wsl --shutdown.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Containers need a Linux kernel; macOS and Windows provide one in a VM — Docker Desktop's linuxkit, Windows' WSL2.</li>
<li>To macOS the whole Docker VM is one process; inside are 235 processes, 7.7 GiB and kernel 7.0.12.</li>
<li>WSL1 translated system calls; WSL2 runs a real kernel with full compatibility, but is slow across the Windows/Linux file-system boundary.</li>
<li>Measured: 3,000 small files on a shared folder are ~10–23× slower than on the VM's own disk — keep dependencies and build output inside the VM.</li>
<li>Size the VM deliberately (Docker Desktop Resources, <code>.wslconfig</code>): OOM inside the VM looks like exit 137 even when the host has RAM free.</li>
</ul>
${L('https://learn.microsoft.com/en-us/windows/wsl/compare-versions', '📄', 'Comparing WSL 1 and WSL 2 (Microsoft)', 'Full Linux kernel, system call compatibility, and why to keep files on the same OS as your tools.', 'Open')}
${L('https://learn.microsoft.com/en-us/windows/wsl/wsl-config', '📄', 'Advanced settings configuration in WSL', 'wsl.conf and .wslconfig: memory, processors, swap, systemd and the 8-second rule.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.6</span>
<h2>WSL2 và Docker Desktop: Linux trong một máy ảo</h2>
<p class="lead">Từ <a href="${OS('os-0-1-cai-dat')}">bài 0.1</a> khoá này đã nói "Docker trên Mac chạy trong một máy ảo", và Chương 12 cho thấy vì sao: container là một tiến trình Linux được rào bằng namespace và cgroup của Linux (<a href="${OS('os-12-6-runc')}">bài 12.6</a>). XNU và NT chẳng có cái nào, nên container Linux cần một nhân Linux ở đâu đó. Trên Windows, cùng nhu cầu đó sinh ra <strong>WSL2</strong>. Bài này trả lời: <strong>giữa terminal của bạn và nhân Linux có những gì, trên Mac, trên laptop Windows và trên VPS — và việc đi qua ranh giới đó làm công việc hằng ngày của bạn tốn bao nhiêu?</strong></p>

<h3>Các tầng trên mỗi máy</h3>
<table>
<tr><th></th><th>macOS + Docker Desktop</th><th>Windows + WSL2 / Docker Desktop ${DOC_VI}</th><th>VPS Linux</th></tr>
<tr><td>hypervisor</td><td>Virtualization.framework của Apple (trên Hypervisor.framework)</td><td>Hyper-V; chính Windows trở thành "root partition" bên cạnh máy ảo</td><td>Docker không cần (bản thân VPS là một máy ảo trên hypervisor của nhà cung cấp)</td></tr>
<tr><td>nhân Linux</td><td>linuxkit, do Docker dựng</td><td>nhân do Microsoft dựng từ mã nguồn kernel.org, cập nhật qua Windows Update</td><td>nhân của bản phân phối</td></tr>
<tr><td>distro/container sống ở đâu</td><td>containerd bên trong máy ảo</td><td>mỗi distro WSL là một container cách ly bên trong một máy ảo tiện ích dùng chung; Docker Desktop cũng dùng máy ảo đó</td><td>containerd trên máy chủ</td></tr>
<tr><td>file của bạn</td><td>chia sẻ vào máy ảo qua <strong>virtiofs</strong></td><td>ổ Windows hiện ra là <code>/mnt/c</code> (DrvFs); file Linux hiện ra trong Windows là <code>\\\\wsl.localhost\\&lt;distro&gt;</code></td><td>ext4 tại chỗ</td></tr>
</table>
<p>Trước WSL2 có <strong>WSL1</strong> ${DOC_VI}: không có nhân Linux nào cả — nhân NT <em>dịch</em> các system call của Linux (tầng "pico process"). Nó nhanh với file của Windows nhưng không bao giờ đầy đủ: Docker không chạy được trên nó. WSL2 thay việc dịch bằng một nhân thật; bảng so sánh của Microsoft ghi "Full Linux Kernel" và "Full system call compatibility" cho WSL2, còn "Performance across OS file systems" chỉ cho WSL1.</p>

<h3>Đo trên Mac: một tiến trình là cả một cái máy</h3>
${run('c146-mac', 'uname -sm', 4)}
<p>Docker client là một chương trình macOS (<code>darwin/arm64</code>); server mà nó nói chuyện là Linux (<code>linux/arm64</code>, nhân 7.0.12-linuxkit) với 10 CPU và 8,3 GB RAM — đúng cỡ đặt trong phần cài đặt của Docker Desktop, một phần tư 32 GB của máy Mac. Với macOS, cả cái máy Linux đó là <strong>một tiến trình</strong>, <code>com.apple.Virtualization.VirtualMachine</code>, ở đây 12 % CPU (tổng mọi việc mà mọi container đang làm ngay lúc đó) và 3,6 GiB nằm trong RAM: trang nào của máy khách chưa từng bị chạm thì không bao giờ được cấp trên Mac, và trang ít dùng có thể bị nén hay đẩy ra swap như mọi bộ nhớ khác (bài 14.4). Nhìn từ trong, nó là một máy Linux bình thường:</p>
${run('c146-mac', 'docker run --rm --label oslab=1 --name os-c146-vm', 3)}
<p>235 tiến trình, 7,7 GiB, PID 1 là <code>initd</code>; container Alpine và Ubuntu đều báo nhân của máy ảo, vì container không mang theo nhân riêng (bài 12.6). Mọi hiệu ứng của máy ảo bạn đã gặp trong khoá đều đến từ tầng này: thiếu bộ đếm phần cứng cho <code>perf</code> (bài 0.1), khoảng chờ dừng mặc định 3,1 s đo ở <a href="${OS('os-1-5-pid1')}">bài 1.5</a>, bộ nhớ và CPU bị máy ảo giới hạn trước cả cgroup.</p>
${lab('nslayers', 'docker', 'vi', 'Một container, hai góc nhìn: tiến trình bên trong và chính tiến trình đó trong máy ảo Docker. Trên Mac hay laptop Windows còn một góc nhìn thứ ba phía trên cả hai — macOS hay Windows, chỉ thấy đúng một tiến trình máy ảo.', { tour: 'nslayers-views' })}

<h3>Cái giá của ranh giới: file nhỏ</h3>
<p>Mọi thao tác file trên một thư mục chia sẻ từ Mac trở thành một yêu cầu rời nhân Linux, vượt ranh giới máy ảo sang macOS, được APFS phục vụ rồi quay về. Một yêu cầu thì nhanh; một công cụ build làm hàng chục nghìn yêu cầu. Một phép đo nhỏ — ghi, stat, đọc và xoá 3.000 file tí hon, đúng dáng của <code>npm install</code>, <code>git status</code> hay một lần build Maven — một lần trong thư mục chia sẻ từ Mac (<code>/mac</code>) và một lần trên ổ riêng của máy ảo (<code>/tmp</code>), mỗi bên hai lượt:</p>
${src('ch14/bench-fs.sh')}
${run('c146-mac', 'docker run --rm --label oslab=1 --name os-c146-fs')}
<table>
<tr><th>3.000 file</th><th>chia sẻ từ Mac (virtiofs)</th><th>ổ riêng của máy ảo (overlay)</th><th>chậm hơn</th></tr>
<tr><td>ghi</td><td>0,92–1,45 s</td><td>0,085–0,094 s</td><td>~10–15×</td></tr>
<tr><td>stat</td><td>0,30–0,33 s</td><td>0,024–0,025 s</td><td>~12×</td></tr>
<tr><td>đọc</td><td>0,48–0,54 s</td><td>0,021–0,022 s</td><td>~23×</td></tr>
<tr><td>xoá</td><td>0,57–0,61 s</td><td>0,026–0,028 s</td><td>~22×</td></tr>
</table>
<p>Windows cũng có hình dạng y như vậy ${DOC_VI}. Hướng dẫn của Microsoft nói rõ: WSL2 nhanh trên hệ thống file Linux của chính nó và chậm "xuyên qua hệ thống file của hệ điều hành kia" — nên dự án bạn build bằng công cụ Linux hãy để <em>bên trong</em> distro WSL (<code>~/project</code>, từ Windows vào được qua <code>\\\\wsl.localhost\\Ubuntu\\home\\…</code>), đừng để dưới <code>/mnt/c/Users/…</code>; còn dự án build bằng công cụ Windows (NetBeans, Visual Studio) thì để trên ổ Windows. Docker Desktop trên Windows thừa hưởng đúng luật đó qua backend WSL2.</p>
${lab('latency', 'default', 'vi', 'Thang độ trễ: một thao tác file bên trong máy ảo là một lời gọi nhân tốc độ RAM; một thao tác trên thư mục chia sẻ thì cộng thêm một chuyến vượt ranh giới máy ảo sang hệ điều hành chủ và quay về, lần nào cũng vậy.')}

<h3>Định cỡ máy ảo</h3>
<p>Cả hai máy ảo đều lấy một phần cố định của máy chủ. Docker Desktop: Settings → Resources (ở đây 10 CPU, 8 GB). WSL2 ${DOC_VI}: file <code>%UserProfile%\\.wslconfig</code>, mục <code>[wsl2]</code>, trong đó <code>memory</code> mặc định là 50 % bộ nhớ của Windows, <code>processors</code> là mọi bộ xử lý logic và <code>swap</code> là 25 % bộ nhớ; thay đổi có hiệu lực sau <code>wsl --shutdown</code> ("luật 8 giây" của Microsoft: chờ tới khi máy ảo thật sự dừng). systemd trong WSL phải tự bật bằng <code>[boot] systemd=true</code> trong <code>/etc/wsl.conf</code>. Nhỏ quá thì build của bạn dính OOM killer <em>bên trong</em> máy ảo (exit 137, Chương 8) trong khi máy chủ vẫn còn RAM; to quá thì máy chủ bắt đầu nén và swap.</p>

<div class="pitfall co-tieu-de">
<p><strong>"npm install trong Docker trên Mac mất bốn phút, trên VPS mất 20 giây."</strong> Dự án, và kéo theo <code>node_modules</code> (hàng chục nghìn file nhỏ), được gắn từ Mac bằng bind mount, nên từng file một trả khoản phí 10–20 lần vừa đo. Hãy giữ <code>node_modules</code> (và <code>target/</code>, <code>.gradle/</code>, cache build) bên trong máy ảo: một named volume (<code>-v nm:/app/node_modules</code>) hoặc <code>COPY</code> vào ảnh; chỉ gắn phần mã nguồn bạn sửa. Trên Windows, sai lầm y hệt là clone kho vào <code>C:\\</code> rồi build từ WSL qua <code>/mnt/c</code> — hãy clone nó bên trong distro. Cũng nên lường trước rằng thông báo đổi file từ trình soạn thảo trên máy chủ không phải lúc nào cũng tới được bên trong máy ảo; dev server có chế độ hỏi vòng (ví dụ <code>CHOKIDAR_USEPOLLING=1</code>) cho trường hợp đó.</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> dự án Next.js của nhóm build mất 40 s trên VPS, 3 phút trong Docker trên Mac của bạn, và 6 phút trong WSL trên laptop của một bạn. Bạn muốn con số, không muốn đoán, và một cách sửa cho cả hai laptop.</p>
<ol>
<li>Trên Mac, từ thư mục <code>lab/code/ch14</code>, chạy <code>docker run --rm -v "$PWD":/mac os-lab /mac/bench-fs.sh /mac</code> rồi làm lại với <code>/tmp</code>; so với bảng ở trên.</li>
<li>Tìm máy ảo trong macOS: <code>ps -axo pid,%cpu,rss,comm | grep Virtualization</code> trong lúc một container đang làm việc, và trang Resources của Docker Desktop.</li>
<li>Nhờ bạn dùng Windows chạy cùng script bên trong WSL hai lần: ở <code>~/bench</code> và ở <code>/mnt/c/Users/&lt;tên&gt;/bench</code>; và cho xem file <code>.wslconfig</code>.</li>
<li>Đổi cách dựng môi trường dev để <code>node_modules</code> nằm trong một named volume (Mac) và kho nằm trong distro WSL (Windows); đo <code>npm ci</code> trước và sau.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có bảng bốn dòng cho Mac, hai con số WSL từ bạn cùng nhóm, và thời gian <code>npm ci</code> giảm xuống sau khi dời các file nhỏ vào ổ riêng của máy ảo — kèm một câu giải thích mỗi thao tác file đã phải vượt ranh giới nào.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['WSL2', 'Windows Subsystem for Linux 2: một nhân Linux thật do Microsoft dựng trong máy ảo tiện ích Hyper-V được quản lý sẵn; các distro chạy như container bên trong.'],
  ['WSL1', 'Thiết kế cũ hơn: không có nhân Linux, nhân NT dịch các system call của Linux; nhanh với file Windows, không bao giờ tương thích đầy đủ.'],
  ['Virtualization.framework', 'API của Apple để chạy máy ảo trên macOS; Docker Desktop dùng nó cho máy ảo linuxkit.'],
  ['virtiofs', 'Giao thức chia sẻ file giữa máy chủ và máy ảo; mọi thao tác trên thư mục chia sẻ đều vượt ranh giới máy ảo.'],
  ['DrvFs / \\\\wsl.localhost', 'Cách WSL nhìn ổ Windows (/mnt/c) và cách Windows nhìn file của WSL — cả hai đều vượt ranh giới máy ảo.'],
  ['.wslconfig', 'File theo người dùng định cỡ máy ảo WSL2: memory (mặc định 50 %), processors, swap; áp dụng sau wsl --shutdown.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Container cần nhân Linux; macOS và Windows cung cấp nhân đó trong một máy ảo — linuxkit của Docker Desktop, WSL2 của Windows.</li>
<li>Với macOS, cả máy ảo Docker là một tiến trình; bên trong có 235 tiến trình, 7,7 GiB và nhân 7.0.12.</li>
<li>WSL1 dịch system call; WSL2 chạy nhân thật, tương thích đầy đủ, nhưng chậm khi vượt ranh giới hệ thống file Windows/Linux.</li>
<li>Đo được: 3.000 file nhỏ trên thư mục chia sẻ chậm hơn ~10–23 lần so với ổ riêng của máy ảo — giữ thư viện phụ thuộc và kết quả build bên trong máy ảo.</li>
<li>Định cỡ máy ảo có chủ đích (Resources của Docker Desktop, <code>.wslconfig</code>): OOM bên trong máy ảo trông như exit 137 dù máy chủ còn RAM trống.</li>
</ul>
${L('https://learn.microsoft.com/en-us/windows/wsl/compare-versions', '📄', 'Comparing WSL 1 and WSL 2 (Microsoft)', 'Nhân Linux đầy đủ, tương thích system call, và vì sao nên để file cùng hệ điều hành với công cụ.', 'Mở')}
${L('https://learn.microsoft.com/en-us/windows/wsl/wsl-config', '📄', 'Advanced settings configuration in WSL', 'wsl.conf và .wslconfig: memory, processors, swap, systemd và luật 8 giây.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 14.7 — Shell và trình quản lý gói ───────────────────────── */
    {
      title: '14.7 — Shells and package managers: Bash and zsh vs PowerShell (objects, not text), apt vs brew vs winget|||14.7 — Shell và trình quản lý gói: Bash, zsh vs PowerShell (đối tượng, không phải văn bản), apt vs brew vs winget',
      slug: 'os-14-8-shell',
      type: 'LESSON',
      isFreePreview: true,
      description: 'PowerShell 7 thật chạy trên Linux trong lab (tarball chính thức, sha256 khớp — và chính file hashes là UTF-16 + CRLF, grep trả 0): Get-Process trả đối tượng System.Diagnostics.Process 52 thuộc tính, Sort/Where/Select/Measure/ConvertTo-Json thay cho cắt cột văn bản, Stop-Process = SIGKILL (137); bảng dịch lệnh bash ↔ PowerShell; alias ls/cat/curl có trên Windows PowerShell 5.1 nhưng không có trên Linux; bash 3.2 của macOS không có mapfile; apt (303 gói trong lab) vs brew (/opt/homebrew, 135 formula) vs winget/choco.',
      content: `${G147}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.7</span>
<h2>Shells and package managers on three systems</h2>
<p class="lead">In the group chat, the Windows teammates paste PowerShell, you answer in zsh, the VPS runs bash, and the CI file is bash too. They look alike — a prompt, commands, pipes — but PowerShell is built on a different idea: its pipes carry <strong>objects</strong>, not text. This lesson answers: <strong>what exactly is different between Bash/zsh and PowerShell, how do everyday commands translate, and how does each OS install software?</strong> PowerShell here is real: PowerShell 7.6.9, installed in a throwaway lab container from the official release — labelled "pwsh on Linux".</p>

<h3>Which shell, where</h3>
<ul>
<li><strong>bash</strong> — the default on Ubuntu, Debian and in most CI images and Dockerfiles.</li>
<li><strong>zsh</strong> — the default login shell on macOS since 10.15 (2019). macOS still ships a <code>/bin/bash</code>, but an old one:</li>
</ul>
${run('c147-mac', 'echo $SHELL')}
<p>bash <strong>3.2.57</strong>, from 2007: Apple stopped updating it when bash moved to the GPLv3 licence. Every bash feature from the last 17 years is missing — measured below.</p>
<ul>
<li><strong>Windows PowerShell 5.1</strong> ${DOC_EN} — built into Windows, Windows-only, frozen. <strong>PowerShell 7</strong> (<code>pwsh</code>) — the open-source, cross-platform successor on .NET, for Windows, macOS and Linux. <strong>cmd.exe</strong> — the old command prompt, still used by <code>.bat</code> files and some tools.</li>
</ul>

<h3>Installing real PowerShell on Linux</h3>
${run('c147-pwsh', 'curl -sSL -o /tmp/hashes.sha256', 4)}
<p>A first cross-platform lesson for free: the official checksum file is <strong>UTF-16 little-endian with CRLF line endings</strong> — a file written the Windows way. <code>grep</code> finds 0 matches for a string that is plainly in it, because every character is followed by a zero byte. After <code>iconv</code> to UTF-8 the hash is there and matches the tarball. (In the lab image there is no ICU library, so .NET runs in "invariant globalization" mode; <code>NO_COLOR</code> keeps colour codes out of the output.)</p>
${run('c147-pwsh', 'export DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1', 2)}

<h3>Text pipes vs object pipes</h3>
<p>The same question — "which processes used the most CPU?" — in both shells:</p>
${run('c147-pwsh', 'ps -eo pid,comm,time,rss', 2)}
<p>In bash, <code>ps</code> prints <em>text</em>; <code>--sort</code> and <code>head</code> work on lines and columns, and if you wanted megabytes you would cut a column with <code>awk</code> and divide. In PowerShell, <code>Get-Process</code> emits <strong>objects</strong>; <code>Sort-Object CPU</code> sorts by a property, <code>Select-Object</code> picks properties and even computes a new one (<code>RSS_MiB</code>), and text appears only at the very end, when <code>Format-Table</code> draws it. What is an "object" here?</p>
${run('c147-pwsh', "pwsh -NoProfile -c '$p", 2)}
<p>A real .NET <code>System.Diagnostics.Process</code> with 52 properties — <code>StartTime</code> is a date you can subtract, <code>Threads</code> a collection you can count. No parsing, so no breakage when a column moves, a name contains a space, or the locale writes <code>1,5</code> instead of <code>1.5</code>. The same contrast for files:</p>
${run('c147-pwsh', 'find /usr/bin -type f -size +2M', 3)}
<p><code>Where-Object Length -gt 2MB</code> compares a number with a number (PowerShell knows <code>MB</code>); <code>Measure-Object</code> sums; <code>ConvertTo-Json</code> turns the result into JSON for another program — no <code>awk</code>, no <code>sed</code>. <code>Select-String</code> is PowerShell's <code>grep</code>:</p>
${run('c147-pwsh', 'pwsh -NoProfile -c \'Get-Content /etc/os-release')}
<p>Two portability traps live in the aliases. Short names map to cmdlets (<code>gci</code> → <code>Get-ChildItem</code>, <code>gps</code> → <code>Get-Process</code>), but on Linux <code>ls</code>, <code>cat</code>, <code>ps</code>, <code>curl</code> and <code>sort</code> are <strong>not</strong> aliases — they run the native Linux programs:</p>
${run('c147-pwsh', "pwsh -NoProfile -c 'Get-Alias gci", 2)}
<p>On Windows ${DOC_EN} Windows PowerShell 5.1 defines <code>ls</code>, <code>cat</code>, <code>ps</code> — and even <code>curl</code>, mapped to <code>Invoke-WebRequest</code>, which takes completely different options. The same line can therefore run three different programs on three machines. And stopping a process:</p>
${run('c147-pwsh', 'pwsh -NoProfile -c "Stop-Process')}
<p>On Linux <code>Stop-Process</code> sends <strong>SIGKILL</strong> — exit 137, no chance to clean up (lesson 14.2). On Windows it is <code>TerminateProcess</code>; the effect is the same.</p>
${lab('fdtable', 'redirect', 'en', 'What a Bash pipe really is: a file descriptor of one process wired to a file descriptor of the next, with bytes flowing through. A PowerShell pipeline of cmdlets passes .NET objects inside one process instead — no bytes, no parsing.')}
${lab('osmap', 'win', 'en', 'Card 14 (shell pipes) from the Windows side: PowerShell passes objects with 52 properties, Bash and zsh pass bytes. Switch to Linux to see the text pipe of the same task.')}

<h3>A translation table</h3>
<table>
<tr><th>task</th><th>bash / zsh</th><th>PowerShell 7</th></tr>
<tr><td>list files, incl. hidden</td><td><code>ls -la</code></td><td><code>Get-ChildItem -Force</code> (<code>gci</code>, <code>dir</code>)</td></tr>
<tr><td>show a file</td><td><code>cat f</code></td><td><code>Get-Content f</code></td></tr>
<tr><td>search text</td><td><code>grep -n 'x' f</code></td><td><code>Select-String -Pattern 'x' f</code></td></tr>
<tr><td>processes / kill</td><td><code>ps aux</code>, <code>kill PID</code></td><td><code>Get-Process</code>, <code>Stop-Process -Id PID</code></td></tr>
<tr><td>environment variable</td><td><code>export PORT=3000</code></td><td><code>$env:PORT = "3000"</code></td></tr>
<tr><td>which program?</td><td><code>command -v node</code></td><td><code>Get-Command node</code></td></tr>
<tr><td>run B only if A succeeded</td><td><code>A &amp;&amp; B</code></td><td><code>A &amp;&amp; B</code> (PowerShell 7+; not in 5.1)</td></tr>
<tr><td>last exit code</td><td><code>$?</code></td><td><code>$LASTEXITCODE</code> (native programs), <code>$?</code> (true/false)</td></tr>
<tr><td>HTTP request</td><td><code>curl -s URL</code></td><td><code>Invoke-RestMethod URL</code> (parses JSON into objects)</td></tr>
<tr><td>PATH separator</td><td><code>:</code></td><td><code>;</code> on Windows, <code>:</code> on Linux/macOS</td></tr>
</table>

<h3>Package managers</h3>
<table>
<tr><th></th><th>apt (Ubuntu)</th><th>Homebrew (macOS)</th><th>winget / Chocolatey (Windows) ${DOC_EN}</th></tr>
<tr><td>installs into</td><td>system-wide, <code>/usr</code>, needs root</td><td>a user-owned prefix: <code>/opt/homebrew</code> (Apple Silicon), <code>/usr/local</code> (Intel)</td><td>winget: per installer (Program Files or per user); Chocolatey: <code>C:\\ProgramData\\chocolatey</code></td></tr>
<tr><td>install / upgrade all</td><td><code>apt install nodejs</code> / <code>apt upgrade</code></td><td><code>brew install node</code> / <code>brew upgrade</code></td><td><code>winget install OpenJS.NodeJS</code> / <code>winget upgrade --all</code>; <code>choco install nodejs</code></td></tr>
<tr><td>list</td><td><code>dpkg -l</code></td><td><code>brew list</code></td><td><code>winget list</code></td></tr>
<tr><td>GUI apps</td><td>(snap/flatpak)</td><td><code>brew install --cask</code></td><td>same command</td></tr>
</table>
${run('c147-pwsh', 'dpkg-query', 2)}
${run('c147-mac', 'brew --version', 4)}
<p>On this Mac Homebrew owns <code>/opt/homebrew</code> (no <code>sudo</code> needed), has 135 formulae installed, and <code>node</code> is a symlink into a versioned "Cellar" directory — which is how <code>brew upgrade</code> swaps versions. In the lab image, 303 Debian packages are installed system-wide. For language runtimes (Node, Java, Python), many teams prefer a version manager (nvm/fnm, SDKMAN, pyenv) on all three systems, so the version is pinned per project instead of per machine.</p>

<div class="pitfall co-tieu-de">
<p><strong>"My deploy script works on the VPS and silently does nothing on the Mac."</strong> <code>#!/bin/bash</code> on a Mac is bash 3.2. Bash 4+ features — <code>mapfile</code>, associative arrays (<code>declare -A</code>), <code>\${var,,}</code> — do not exist there, and as measured the script does not stop: <code>mapfile</code> fails, the array stays empty, and the next line happily reports "read 0 lines". Write portable POSIX <code>sh</code> for small scripts, or use <code>#!/usr/bin/env bash</code> plus <code>set -euo pipefail</code> and a newer bash from Homebrew, and run every script in Linux CI. The Windows twin: in Windows PowerShell 5.1 ${DOC_EN} the redirection <code>&gt; out.txt</code> writes UTF-16LE — exactly the encoding that made <code>grep</code> find nothing in the checksum file above. Use <code>Out-File -Encoding utf8</code> or PowerShell 7, whose default is UTF-8.</p>
</div>

<h3>🧪 Practice (25–30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the group wants one "health" helper that prints the three biggest files in the project and the three processes using the most CPU, as JSON, for a dashboard — and it must work for the Mac (zsh), the Windows laptops (PowerShell) and the VPS (bash).</p>
<ol>
<li>Write it in bash with <code>find … -printf</code>/<code>ps --sort</code>/<code>head</code>, and check it in the lab. Then run it on the Mac and note what breaks (BSD <code>find</code> has no <code>-printf</code>, BSD <code>ps</code> no <code>--sort</code>).</li>
<li>Start a throwaway container, install pwsh from the official tarball as in this lesson (verify the sha256 after <code>iconv</code>), and write the same helper with <code>Get-ChildItem</code>, <code>Get-Process</code>, <code>Sort-Object</code>, <code>Select-Object</code>, <code>ConvertTo-Json</code>.</li>
<li>Run <code>/bin/bash -c 'declare -A m; m[a]=1; echo \${m[a]}'</code> on the Mac and in the lab; explain the difference.</li>
<li>Write the four install lines for Node on Ubuntu, macOS, Windows (winget) and Windows (choco).</li>
</ol>
<p><strong>Done when:</strong> the PowerShell version runs unchanged on Linux (and, by your teammate, on Windows) and produces valid JSON; the bash version runs in the lab; and you can name the two Mac-specific reasons the bash version broke there.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['PowerShell 7 (pwsh)', 'Cross-platform, open-source shell on .NET; Windows PowerShell 5.1 is the older Windows-only edition built into Windows.'],
  ['cmdlet', 'A PowerShell command (Verb-Noun: Get-Process, Stop-Process) that takes and emits .NET objects.'],
  ['object pipeline', 'PowerShell passes objects between commands inside one process; Bash passes bytes through pipes between processes.'],
  ['alias', 'A short name for a command; ls/cat/curl are aliases in Windows PowerShell but native programs under pwsh on Linux/macOS.'],
  ['bash 3.2 (macOS)', 'The 2007 bash Apple still ships as /bin/bash; no mapfile, no associative arrays.'],
  ['Homebrew', 'macOS’s de-facto package manager; installs into a user-owned prefix (/opt/homebrew) without sudo.'],
  ['winget / Chocolatey', 'Windows package managers: winget is built into Windows 10/11, Chocolatey is the older community one.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>bash on servers and CI, zsh on macOS (with an ancient bash 3.2 still at <code>/bin/bash</code>), PowerShell on Windows — and pwsh runs on all three.</li>
<li>Bash pipes carry text between processes; PowerShell pipes carry objects (<code>System.Diagnostics.Process</code>, 52 properties) — sort, filter and compute by property, format only at the end.</li>
<li>Aliases differ by platform: <code>curl</code> is Invoke-WebRequest in Windows PowerShell 5.1, the real curl under pwsh on Linux.</li>
<li>Encodings travel badly: a UTF-16LE + CRLF file defeated <code>grep</code> until <code>iconv</code>.</li>
<li>apt installs system-wide as root, Homebrew into a user-owned prefix, winget/choco on Windows; pin runtimes per project with a version manager.</li>
</ul>
${L('https://learn.microsoft.com/en-us/powershell/scripting/overview', '📄', 'What is PowerShell? (Microsoft)', 'PowerShell 7 vs Windows PowerShell 5.1, objects in the pipeline, installing on Linux and macOS.', 'Open')}
${L('https://learn.microsoft.com/en-us/windows/package-manager/winget/', '📄', 'Use WinGet to install and manage applications', 'The Windows Package Manager: install, upgrade, list, search.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.7</span>
<h2>Shell và trình quản lý gói trên ba hệ điều hành</h2>
<p class="lead">Trong nhóm chat, các bạn dùng Windows dán PowerShell, bạn trả lời bằng zsh, VPS chạy bash, và file CI cũng là bash. Trông chúng na ná nhau — dấu nhắc, lệnh, ống dẫn — nhưng PowerShell dựng trên một ý tưởng khác: ống dẫn của nó chở <strong>đối tượng</strong>, không phải văn bản. Bài này trả lời: <strong>Bash/zsh và PowerShell khác nhau chính xác ở đâu, các lệnh hằng ngày dịch qua lại thế nào, và mỗi hệ điều hành cài phần mềm ra sao?</strong> PowerShell ở đây là thật: PowerShell 7.6.9, cài trong một container lab vứt đi từ bản phát hành chính thức — ghi nhãn "pwsh trên Linux".</p>

<h3>Shell nào, ở đâu</h3>
<ul>
<li><strong>bash</strong> — mặc định trên Ubuntu, Debian và trong hầu hết ảnh CI và Dockerfile.</li>
<li><strong>zsh</strong> — shell đăng nhập mặc định trên macOS từ 10.15 (2019). macOS vẫn kèm một <code>/bin/bash</code>, nhưng là bản cũ:</li>
</ul>
${run('c147-mac', 'echo $SHELL')}
<p>bash <strong>3.2.57</strong>, từ năm 2007: Apple ngừng cập nhật khi bash chuyển sang giấy phép GPLv3. Mọi tính năng bash của 17 năm qua đều thiếu — đo ở dưới.</p>
<ul>
<li><strong>Windows PowerShell 5.1</strong> ${DOC_VI} — có sẵn trong Windows, chỉ chạy trên Windows, đã đóng băng. <strong>PowerShell 7</strong> (<code>pwsh</code>) — bản kế nhiệm mã nguồn mở, đa nền tảng trên .NET, cho Windows, macOS và Linux. <strong>cmd.exe</strong> — dấu nhắc lệnh cũ, vẫn được file <code>.bat</code> và vài công cụ dùng.</li>
</ul>

<h3>Cài PowerShell thật trên Linux</h3>
${run('c147-pwsh', 'curl -sSL -o /tmp/hashes.sha256', 4)}
<p>Một bài học đa nền tảng tặng kèm: file checksum chính thức là <strong>UTF-16 little-endian với dòng kết thúc CRLF</strong> — một file viết theo kiểu Windows. <code>grep</code> tìm ra 0 kết quả cho một chuỗi rõ ràng nằm trong đó, vì sau mỗi ký tự là một byte 0. Đổi sang UTF-8 bằng <code>iconv</code> rồi thì mã băm hiện ra và khớp với tarball. (Ảnh lab không có thư viện ICU, nên .NET chạy ở chế độ "invariant globalization"; <code>NO_COLOR</code> giữ mã màu khỏi lọt vào output.)</p>
${run('c147-pwsh', 'export DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=1', 2)}

<h3>Ống dẫn văn bản vs ống dẫn đối tượng</h3>
<p>Cùng một câu hỏi — "tiến trình nào dùng nhiều CPU nhất?" — trong cả hai shell:</p>
${run('c147-pwsh', 'ps -eo pid,comm,time,rss', 2)}
<p>Trong bash, <code>ps</code> in ra <em>văn bản</em>; <code>--sort</code> và <code>head</code> làm việc trên dòng và cột, và muốn ra megabyte thì bạn phải cắt cột bằng <code>awk</code> rồi chia. Trong PowerShell, <code>Get-Process</code> phát ra <strong>đối tượng</strong>; <code>Sort-Object CPU</code> sắp theo một thuộc tính, <code>Select-Object</code> chọn thuộc tính và còn tính được thuộc tính mới (<code>RSS_MiB</code>), và văn bản chỉ xuất hiện ở bước cuối cùng, khi <code>Format-Table</code> vẽ nó ra. "Đối tượng" ở đây là gì?</p>
${run('c147-pwsh', "pwsh -NoProfile -c '$p", 2)}
<p>Một <code>System.Diagnostics.Process</code> thật của .NET với 52 thuộc tính — <code>StartTime</code> là một ngày giờ trừ được cho nhau, <code>Threads</code> là một tập hợp đếm được. Không phải tách chữ, nên chẳng hỏng khi một cột đổi chỗ, một tên chứa khoảng trắng, hay khu vực ngôn ngữ viết <code>1,5</code> thay vì <code>1.5</code>. Cùng phép so sánh đó với file:</p>
${run('c147-pwsh', 'find /usr/bin -type f -size +2M', 3)}
<p><code>Where-Object Length -gt 2MB</code> so một con số với một con số (PowerShell hiểu <code>MB</code>); <code>Measure-Object</code> cộng tổng; <code>ConvertTo-Json</code> biến kết quả thành JSON cho chương trình khác — không <code>awk</code>, không <code>sed</code>. <code>Select-String</code> là <code>grep</code> của PowerShell:</p>
${run('c147-pwsh', 'pwsh -NoProfile -c \'Get-Content /etc/os-release')}
<p>Hai cái bẫy đa nền tảng nằm trong alias. Tên ngắn trỏ tới cmdlet (<code>gci</code> → <code>Get-ChildItem</code>, <code>gps</code> → <code>Get-Process</code>), nhưng trên Linux <code>ls</code>, <code>cat</code>, <code>ps</code>, <code>curl</code> và <code>sort</code> <strong>không</strong> phải alias — chúng chạy chương trình Linux gốc:</p>
${run('c147-pwsh', "pwsh -NoProfile -c 'Get-Alias gci", 2)}
<p>Trên Windows ${DOC_VI} Windows PowerShell 5.1 định nghĩa <code>ls</code>, <code>cat</code>, <code>ps</code> — và cả <code>curl</code>, trỏ tới <code>Invoke-WebRequest</code>, thứ nhận các tuỳ chọn hoàn toàn khác. Cùng một dòng lệnh vì thế có thể chạy ba chương trình khác nhau trên ba máy. Còn dừng một tiến trình:</p>
${run('c147-pwsh', 'pwsh -NoProfile -c "Stop-Process')}
<p>Trên Linux <code>Stop-Process</code> gửi <strong>SIGKILL</strong> — mã thoát 137, không có cơ hội dọn dẹp (bài 14.2). Trên Windows nó là <code>TerminateProcess</code>; kết quả như nhau.</p>
${lab('fdtable', 'redirect', 'vi', 'Một ống dẫn Bash thật ra là gì: file descriptor của tiến trình này nối vào file descriptor của tiến trình kế, byte chảy qua. Một chuỗi cmdlet PowerShell thì chuyền đối tượng .NET bên trong một tiến trình — không byte, không tách chữ.')}
${lab('osmap', 'win', 'vi', 'Thẻ 14 (ống dẫn của shell) nhìn từ Windows: PowerShell truyền đối tượng có 52 thuộc tính, Bash và zsh truyền byte. Chuyển sang Linux để xem ống dẫn văn bản cho cùng việc đó.')}

<h3>Bảng dịch lệnh</h3>
<table>
<tr><th>việc</th><th>bash / zsh</th><th>PowerShell 7</th></tr>
<tr><td>liệt kê file, kể cả file ẩn</td><td><code>ls -la</code></td><td><code>Get-ChildItem -Force</code> (<code>gci</code>, <code>dir</code>)</td></tr>
<tr><td>xem một file</td><td><code>cat f</code></td><td><code>Get-Content f</code></td></tr>
<tr><td>tìm chữ</td><td><code>grep -n 'x' f</code></td><td><code>Select-String -Pattern 'x' f</code></td></tr>
<tr><td>tiến trình / giết</td><td><code>ps aux</code>, <code>kill PID</code></td><td><code>Get-Process</code>, <code>Stop-Process -Id PID</code></td></tr>
<tr><td>biến môi trường</td><td><code>export PORT=3000</code></td><td><code>$env:PORT = "3000"</code></td></tr>
<tr><td>chương trình nào?</td><td><code>command -v node</code></td><td><code>Get-Command node</code></td></tr>
<tr><td>chạy B chỉ khi A thành công</td><td><code>A &amp;&amp; B</code></td><td><code>A &amp;&amp; B</code> (PowerShell 7+; 5.1 không có)</td></tr>
<tr><td>mã thoát vừa rồi</td><td><code>$?</code></td><td><code>$LASTEXITCODE</code> (chương trình gốc), <code>$?</code> (đúng/sai)</td></tr>
<tr><td>gọi HTTP</td><td><code>curl -s URL</code></td><td><code>Invoke-RestMethod URL</code> (tự tách JSON thành đối tượng)</td></tr>
<tr><td>dấu phân cách PATH</td><td><code>:</code></td><td><code>;</code> trên Windows, <code>:</code> trên Linux/macOS</td></tr>
</table>

<h3>Trình quản lý gói</h3>
<table>
<tr><th></th><th>apt (Ubuntu)</th><th>Homebrew (macOS)</th><th>winget / Chocolatey (Windows) ${DOC_VI}</th></tr>
<tr><td>cài vào</td><td>toàn hệ thống, <code>/usr</code>, cần root</td><td>một tiền tố do người dùng sở hữu: <code>/opt/homebrew</code> (Apple Silicon), <code>/usr/local</code> (Intel)</td><td>winget: tuỳ bộ cài (Program Files hoặc theo người dùng); Chocolatey: <code>C:\\ProgramData\\chocolatey</code></td></tr>
<tr><td>cài / nâng tất cả</td><td><code>apt install nodejs</code> / <code>apt upgrade</code></td><td><code>brew install node</code> / <code>brew upgrade</code></td><td><code>winget install OpenJS.NodeJS</code> / <code>winget upgrade --all</code>; <code>choco install nodejs</code></td></tr>
<tr><td>liệt kê</td><td><code>dpkg -l</code></td><td><code>brew list</code></td><td><code>winget list</code></td></tr>
<tr><td>ứng dụng có giao diện</td><td>(snap/flatpak)</td><td><code>brew install --cask</code></td><td>cùng lệnh</td></tr>
</table>
${run('c147-pwsh', 'dpkg-query', 2)}
${run('c147-mac', 'brew --version', 4)}
<p>Trên Mac này Homebrew sở hữu <code>/opt/homebrew</code> (không cần <code>sudo</code>), đã cài 135 formula, và <code>node</code> là một liên kết tượng trưng trỏ vào thư mục "Cellar" có ghi phiên bản — chính là cách <code>brew upgrade</code> đổi phiên bản. Trong ảnh lab, 303 gói Debian được cài toàn hệ thống. Với runtime ngôn ngữ (Node, Java, Python), nhiều nhóm thích dùng trình quản lý phiên bản (nvm/fnm, SDKMAN, pyenv) trên cả ba hệ, để phiên bản được ghim theo từng dự án thay vì theo từng máy.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Script deploy chạy trên VPS mà trên Mac lặng lẽ không làm gì."</strong> <code>#!/bin/bash</code> trên Mac là bash 3.2. Các tính năng của bash 4+ — <code>mapfile</code>, mảng kết hợp (<code>declare -A</code>), <code>\${var,,}</code> — không tồn tại ở đó, và như vừa đo, script không dừng lại: <code>mapfile</code> hỏng, mảng vẫn rỗng, và dòng sau vui vẻ báo "read 0 lines". Viết script nhỏ bằng <code>sh</code> POSIX cho dễ mang đi, hoặc dùng <code>#!/usr/bin/env bash</code> cùng <code>set -euo pipefail</code> và một bash mới từ Homebrew, và chạy mọi script trong CI Linux. Lỗi song sinh trên Windows: trong Windows PowerShell 5.1 ${DOC_VI} phép chuyển hướng <code>&gt; out.txt</code> ghi UTF-16LE — đúng bảng mã đã làm <code>grep</code> chẳng tìm thấy gì trong file checksum ở trên. Hãy dùng <code>Out-File -Encoding utf8</code> hoặc PowerShell 7, vốn mặc định UTF-8.</p>
</div>

<h3>🧪 Thực hành (25–30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> nhóm muốn một công cụ "health" in ra ba file lớn nhất trong dự án và ba tiến trình dùng nhiều CPU nhất, dưới dạng JSON, cho một dashboard — và nó phải chạy được trên Mac (zsh), laptop Windows (PowerShell) và VPS (bash).</p>
<ol>
<li>Viết nó bằng bash với <code>find … -printf</code>/<code>ps --sort</code>/<code>head</code>, và kiểm trong lab. Rồi chạy trên Mac và ghi lại chỗ nào hỏng (<code>find</code> của BSD không có <code>-printf</code>, <code>ps</code> của BSD không có <code>--sort</code>).</li>
<li>Mở một container vứt đi, cài pwsh từ tarball chính thức như trong bài (kiểm sha256 sau khi <code>iconv</code>), và viết lại công cụ đó bằng <code>Get-ChildItem</code>, <code>Get-Process</code>, <code>Sort-Object</code>, <code>Select-Object</code>, <code>ConvertTo-Json</code>.</li>
<li>Chạy <code>/bin/bash -c 'declare -A m; m[a]=1; echo \${m[a]}'</code> trên Mac và trong lab; giải thích khác biệt.</li>
<li>Viết bốn dòng cài Node trên Ubuntu, macOS, Windows (winget) và Windows (choco).</li>
</ol>
<p><strong>Đạt khi:</strong> bản PowerShell chạy nguyên văn trên Linux (và, nhờ bạn cùng nhóm, trên Windows) và cho ra JSON hợp lệ; bản bash chạy trong lab; và bạn gọi tên được hai lý do riêng của Mac khiến bản bash hỏng ở đó.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['PowerShell 7 (pwsh)', 'Shell đa nền tảng, mã nguồn mở trên .NET; Windows PowerShell 5.1 là phiên bản cũ chỉ cho Windows, có sẵn trong Windows.'],
  ['cmdlet', 'Một lệnh PowerShell (Động từ-Danh từ: Get-Process, Stop-Process) nhận và phát ra đối tượng .NET.'],
  ['object pipeline (ống dẫn đối tượng)', 'PowerShell chuyền đối tượng giữa các lệnh trong một tiến trình; Bash chuyền byte qua ống giữa các tiến trình.'],
  ['alias', 'Tên ngắn của một lệnh; ls/cat/curl là alias trong Windows PowerShell nhưng là chương trình gốc dưới pwsh trên Linux/macOS.'],
  ['bash 3.2 (macOS)', 'Bản bash năm 2007 mà Apple vẫn kèm ở /bin/bash; không có mapfile, không có mảng kết hợp.'],
  ['Homebrew', 'Trình quản lý gói thông dụng nhất của macOS; cài vào một tiền tố do người dùng sở hữu (/opt/homebrew), không cần sudo.'],
  ['winget / Chocolatey', 'Trình quản lý gói trên Windows: winget có sẵn trong Windows 10/11, Chocolatey là trình cộng đồng ra đời trước.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>bash trên máy chủ và CI, zsh trên macOS (kèm một bash 3.2 cổ lỗ vẫn nằm ở <code>/bin/bash</code>), PowerShell trên Windows — và pwsh chạy được trên cả ba.</li>
<li>Ống dẫn Bash chở văn bản giữa các tiến trình; ống dẫn PowerShell chở đối tượng (<code>System.Diagnostics.Process</code>, 52 thuộc tính) — sắp, lọc, tính theo thuộc tính, chỉ định dạng ở cuối.</li>
<li>Alias khác nhau theo nền tảng: <code>curl</code> là Invoke-WebRequest trong Windows PowerShell 5.1, là curl thật dưới pwsh trên Linux.</li>
<li>Bảng mã đi xa rất dễ vỡ: một file UTF-16LE + CRLF làm <code>grep</code> bó tay cho tới khi <code>iconv</code>.</li>
<li>apt cài toàn hệ thống bằng root, Homebrew cài vào tiền tố của người dùng, winget/choco trên Windows; ghim runtime theo dự án bằng trình quản lý phiên bản.</li>
</ul>
${L('https://learn.microsoft.com/en-us/powershell/scripting/overview', '📄', 'What is PowerShell? (Microsoft)', 'PowerShell 7 vs Windows PowerShell 5.1, đối tượng trong ống dẫn, cài trên Linux và macOS.', 'Mở')}
${L('https://learn.microsoft.com/en-us/windows/package-manager/winget/', '📄', 'Use WinGet to install and manage applications', 'Trình quản lý gói của Windows: cài, nâng cấp, liệt kê, tìm kiếm.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 14.8 — Code đa nền tảng ───────────────────────── */
    {
      title: '14.8 — Cross-platform code: paths, line endings, case, spawning, file locks, NetBeans and a CI matrix|||14.8 — Code chạy cả ba hệ: đường dẫn, xuống dòng, hoa thường, khởi động tiến trình, khoá file, NetBeans và ma trận CI',
      slug: 'os-14-4-cross',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Viết code chạy cả Mac, Windows và Linux, đo thật: path.win32/ntpath chạy được trên mọi máy (thử luật Windows ngay trên Mac), File.separator, dấu \\ là một ký tự tên file trên Linux; Res.java đọc Config.properties chạy trên Mac, NoSuchFileException trên Linux; git không thấy đổi tên chỉ khác hoa thường; CRLF: /bin/bash^M bad interpreter, cd $\'/tmp\\r\'; core.autocrlf biến LF thành CRLF, .gitattributes eol=lf sửa lại; spawn file .cmd trên Windows (EINVAL từ 2024), khoá file khi xoá/đổi tên; NetBeans nbproject/private; ma trận CI ba hệ điều hành.',
      content: `${G148}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.8</span>
<h2>Cross-platform code</h2>
<p class="lead">The last lesson of the chapter turns everything above into habits. The study group's project is written on a Mac, edited in NetBeans on two Windows laptops, built in GitHub Actions and deployed to a Linux VPS. Each of these breaks something the others get away with. This lesson answers: <strong>which lines of Java, Node and Python code behave differently on the three systems, how do you test the Windows behaviour from your Mac, and what guard rails — <code>.gitattributes</code>, <code>.gitignore</code>, a CI matrix — keep the project working for everyone?</strong></p>

<h3>Paths: never build them by hand</h3>
${src('ch14/cross.cjs', 'js')}
${run('c148-mac', 'node cross.cjs')}
${run('c148-lx', 'node cross.cjs')}
<p>Two runs, Mac and Linux, identical except for <code>platform</code> — and that is the useful part: <code>path.win32</code> (and <code>path.posix</code>) implement Windows' (and POSIX's) rules <strong>on every OS</strong>, so you can unit-test Windows path handling on your Mac. Three results to remember: on POSIX a backslash is an ordinary character, so <code>src/config\\app.json</code> is a directory <code>src</code> containing a file literally named <code>config\\app.json</code>; on Windows <code>/etc</code> counts as absolute (the root of the current drive); and <code>path.join</code> chooses the right separator for the machine it runs on. Python and Java offer the same:</p>
${run('c148-lx', 'python3 cross.py')}
${run('c148-lx', 'java Cross.java')}
<p>Python's <code>ntpath</code>/<code>posixpath</code> and <code>PureWindowsPath</code>/<code>PurePosixPath</code> work on any OS — and <code>PureWindowsPath</code> even compares names case-insensitively, like NTFS. Java gives the running OS's rules only: on Windows ${DOC_EN} <code>File.separator</code> is <code>\\</code>, <code>File.pathSeparator</code> is <code>;</code> and <code>System.lineSeparator()</code> is <code>\\r\\n</code>. Use <code>Path.of(a, b, c)</code>, <code>path.join</code> and <code>pathlib</code>; never <code>"src/" + name</code> or <code>"data\\\\" + name</code>.</p>

<h3>Case: it works on the two laptops and fails on the server</h3>
${src('ch14/Res.java', 'java')}
${run('c148-mac', 'java Res.java')}
${run('c148-lx', 'java Res.java')}
<p>The file is <code>data/config.properties</code>; the code asks for <code>Config.properties</code>. APFS and NTFS shrug (lesson 14.5); ext4 says the file does not exist. The same applies to classpath resources: inside a <strong>JAR</strong> (a ZIP file) entry names are case-sensitive on every OS, so <code>getResource("Logo.png")</code> can work in the IDE and fail in the packaged app even on a Mac. Git hides the problem too:</p>
${run('c148-mac', 'git -C . config core.ignorecase')}
${run('c148-mac', 'git init -q && git config user.name dev && git config user.email dev@example.com && echo hi', 3)}
<p>On the Mac, Git runs with <code>core.ignorecase = true</code>: renaming <code>Readme.md</code> to <code>README.md</code> on disk is invisible to it, so the old name is what everyone else (and the Linux server) receives. <code>git mv -f old New</code> records the rename explicitly.</p>
${lab('syscall', 'fail', 'en', 'openat("data/Config.properties") on Linux: the kernel walks the directory, finds no entry with exactly that name, and returns −2 — ENOENT, which Java turns into NoSuchFileException.', { tour: 'syscall-errno' })}

<h3>Line endings: the invisible \\r</h3>
<p>Windows tools traditionally end lines with CR LF (<code>\\r\\n</code>); Linux and macOS use LF. A shell script saved with CRLF:</p>
${run('c148-lx', "printf '#!/bin/bash", 4)}
<p>Every line now ends in an invisible <code>\\r</code> (shown by <code>cat -A</code> as <code>^M</code>). The kernel reads the first line and looks for an interpreter called <code>/bin/bash\\r</code> — "bad interpreter: No such file or directory". Run through <code>bash</code> explicitly, the script starts but every value carries the <code>\\r</code>: <code>NAME</code> becomes <code>prod\\r</code> and <code>cd</code> looks for a directory named <code>/tmp\\r</code>. In Docker the same file as <code>ENTRYPOINT</code> fails with "exec /entrypoint.sh: no such file or directory" — the file exists, its interpreter does not. Stripping the <code>\\r</code> fixes it:</p>
${run('c148-lx', "sed -i 's/")}
<p>Where do the CRs come from? Mostly from Git on Windows. Git for Windows' installer suggests "checkout Windows-style, commit Unix-style line endings", which is <code>core.autocrlf = true</code> ${DOC_EN}. The same setting, reproduced on the Mac:</p>
${run('c148-mac', "git init -q && git config user.name dev && git config user.email dev@example.com && printf", 3)}
<p>Committed with LF; checked out with <code>autocrlf = true</code> it arrives with CRLF — that is the file your Windows teammate has, and if they build the Docker image from their checkout, the image contains CRLF scripts. A <code>.gitattributes</code> line in the repository overrides every personal setting, and travels with the code:</p>
${code(['# .gitattributes — committed at the root of the repository', '* text=auto', '*.sh text eol=lf', 'Dockerfile text eol=lf', '*.bat text eol=crlf', '*.cmd text eol=crlf', '*.png binary'].join('\n'), 'ini')}

<h3>Starting processes portably</h3>
<ul>
<li><strong>Node</strong> ${DOC_EN}: on Windows <code>npm</code>, <code>npx</code> and many CLIs are <code>.cmd</code> files. <code>spawn('npm', ['ci'])</code> fails with <code>ENOENT</code> there, and since the April 2024 security releases (CVE-2024-27980) spawning a <code>.bat</code>/<code>.cmd</code> without <code>shell: true</code> throws <code>EINVAL</code>. Use <code>execFile</code>/<code>spawn</code> with an argument array and <code>shell: true</code> only for trusted arguments, or a helper such as <code>cross-spawn</code>.</li>
<li><strong>Java</strong>: <code>new ProcessBuilder("sh", "-c", cmd)</code> does not exist on Windows; branch on <code>System.getProperty("os.name")</code> (<code>cmd.exe /c</code>) — or better, call the program directly with an argument list and no shell at all.</li>
<li><strong>Python</strong>: <code>subprocess.run([...])</code> with a list works everywhere; <code>shell=True</code> means <code>/bin/sh</code> on Unix and <code>cmd.exe</code> on Windows — two different languages.</li>
<li><strong>Signals</strong>: handle SIGINT and SIGTERM; expect hard termination on Windows (lesson 14.2).</li>
</ul>

<h3>File locks: delete and rename are not the same on Windows</h3>
${run('c148-lx', 'exec 3> /tmp/app.log')}
<p>On Linux and macOS a file can be deleted or renamed while a process still has it open; the process keeps writing to the now nameless inode (the "deleted but still open" disk-full incident of <a href="${OS('os-2-4-dia-io')}">lesson 2.4</a>). On Windows ${DOC_EN} files are normally opened with sharing modes that do not include delete, so deleting or renaming a file another process holds fails with "The process cannot access the file because it is being used by another process" (<code>ERROR_SHARING_VIOLATION</code>). Practical consequences: log rotation by renaming fails while the app holds the log; <code>npm install</code>, <code>git checkout</code> or a Gradle clean fail with <code>EPERM</code>/<code>EBUSY</code> while an editor, antivirus scanner or search indexer has a file open; Java code that deletes or moves a file must close every stream first — use try-with-resources.</p>
${lab('fdtable', 'deleted', 'en', 'Delete a file that a process still holds open: on Linux the name disappears and the inode lives on until the last fd closes. On Windows the delete itself would be refused.', { tour: 'fdtable-deleted' })}

<h3>NetBeans projects across Windows and Mac</h3>
<p>An Ant-based NetBeans project keeps its build settings in <code>nbproject/</code> ${DOC_EN}. Two parts travel badly: <code>nbproject/private/</code> holds per-user absolute paths (your JDK, your folders) and must never be committed; and <code>nbproject/project.properties</code> may contain absolute <code>file.reference.*</code> paths such as <code>C\\:\\\\Users\\\\an\\\\libs\\\\mysql.jar</code> that exist only on one laptop, and names a Java platform by the label each user gave it. Before Java 18, <code>javac</code> on Windows read source files as windows-1252 unless told otherwise, so Vietnamese strings written on the Mac came out garbled — set <code>source.encoding=UTF-8</code> (NetBeans' project setting), or rely on Java 18+, where UTF-8 is the default everywhere. The portable fix is to make the build tool, not the IDE, own the project: a Maven <code>pom.xml</code> or Gradle build opens identically in NetBeans, IntelliJ and VS Code on all three systems, and the CI uses the same file.</p>
${code(['# .gitignore for a NetBeans / Java project shared between Windows and macOS', 'nbproject/private/', 'build/', 'dist/', 'target/', '.DS_Store', 'Thumbs.db', 'desktop.ini'].join('\n'), 'ini')}

<h3>Let CI run all three</h3>
<p>The only reliable test of "works on all three" is running it on all three. GitHub Actions provides hosted Linux, macOS and Windows runners; one matrix job covers them:</p>
${code(['# .github/workflows/test.yml', 'name: test', 'on: [push, pull_request]', 'jobs:', '  test:', '    strategy:', '      fail-fast: false', '      matrix:', '        os: [ubuntu-latest, macos-latest, windows-latest]', '    runs-on: \${{ matrix.os }}', '    defaults:', '      run:', '        shell: bash          # Git Bash on Windows, so the same script lines run everywhere', '    steps:', '      - uses: actions/checkout@v4', '      - uses: actions/setup-node@v4', '        with: { node-version: 22 }', '      - run: npm ci', '      - run: npm test'].join('\n'), 'yaml')}
<p><code>fail-fast: false</code> lets the other two finish when one fails, so you see whether a bug is Windows-only. Add a test that opens files by their exact case, one that spawns a child process and one that shuts down on SIGINT — the three classic cross-platform breakages of this chapter.</p>

<div class="pitfall co-tieu-de">
<p><strong>"exec /docker-entrypoint.sh: no such file or directory — but the file is right there."</strong> The image was built from a Windows checkout with <code>core.autocrlf = true</code>, so the script's first line is <code>#!/bin/sh\\r</code> and the kernel cannot find an interpreter with that name — exactly the "bad interpreter" measured above. Re-saving the file in an editor fixes it until the next checkout. The durable fix is a committed <code>.gitattributes</code> with <code>*.sh text eol=lf</code>, plus <code>git add --renormalize .</code> once to rewrite the files already in the repository.</p>
</div>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> the group project (a Spring Boot or Express API with a few shell scripts) must open in NetBeans on Windows, run on your Mac, build in CI and deploy to Linux, and it currently fails in at least three places. Make it portable and prove it.</p>
<ol>
<li>Run <code>node cross.cjs</code>, <code>python3 cross.py</code> and <code>java Cross.java</code> on your Mac and in the lab; then grep the project for string-built paths (<code>"/" +</code>, <code>+ "\\\\"</code>) and replace them with <code>path.join</code>/<code>Path.of</code>/<code>pathlib</code>.</li>
<li>Run <code>java Res.java</code> on the Mac and in the lab; fix every resource name whose case differs from the file on disk (<code>git ls-files</code> shows the true spelling).</li>
<li>Add the <code>.gitattributes</code> and <code>.gitignore</code> above, run <code>git add --renormalize .</code>, and check with <code>file *.sh</code> that every script is LF.</li>
<li>Add the three-OS CI matrix and one test each for case-exact file access, spawning a child process and SIGINT shutdown.</li>
</ol>
<p><strong>Done when:</strong> the CI matrix is green on ubuntu-latest, macos-latest and windows-latest; <code>file</code> reports no CRLF scripts; <code>nbproject/private</code> is not in the repository; and a Windows teammate can clone, open in NetBeans and run the project without editing any path.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['path.win32 / ntpath', 'Windows path rules available on every OS (Node, Python) — test Windows path handling from a Mac or Linux.'],
  ['CRLF / LF', 'Windows line ending (\\r\\n) vs Unix (\\n); a stray \\r breaks shebangs and shell variables.'],
  ['core.autocrlf', 'Git setting that converts LF to CRLF on checkout (true on most Windows installs); personal, not shared.'],
  ['.gitattributes', 'Committed file that fixes line endings per path for everyone (*.sh text eol=lf), overriding personal settings.'],
  ['core.ignorecase', 'Git setting (true on macOS/Windows) that makes case-only renames invisible; git mv -f records them.'],
  ['ERROR_SHARING_VIOLATION', 'Windows error when deleting/renaming a file another process has open; Linux and macOS allow it.'],
  ['CI matrix', 'One workflow run on several OSes (ubuntu/macos/windows-latest) so platform-only bugs show up before deploy.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Build paths with <code>path.join</code>, <code>Path.of</code>, <code>pathlib</code>; test Windows rules anywhere with <code>path.win32</code>/<code>ntpath</code>.</li>
<li>Case-insensitive laptops hide wrong file names; Linux (and JAR files) do not — <code>Config.properties</code> worked on the Mac and threw on Linux.</li>
<li>CRLF breaks shell scripts (<code>/bin/bash^M</code>, <code>$'/tmp\\r'</code>); <code>autocrlf</code> creates them, <code>.gitattributes eol=lf</code> prevents them.</li>
<li>Spawn with argument lists, handle <code>.cmd</code> files on Windows, handle SIGINT and SIGTERM; close files before deleting or renaming them.</li>
<li>Keep IDE-private files out of Git, let Maven/Gradle own the build, and run CI on all three operating systems.</li>
</ul>
${L('https://git-scm.com/docs/gitattributes', '📄', 'gitattributes (Git documentation)', 'text, eol and binary per path — the committed fix for line endings.', 'Open')}
${L('https://nodejs.org/api/path.html', '📄', 'Node.js path module', 'path.join, path.resolve, path.win32 and path.posix.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.8</span>
<h2>Code chạy được trên cả ba hệ</h2>
<p class="lead">Bài cuối của chương biến mọi thứ ở trên thành thói quen. Dự án của nhóm học được viết trên Mac, sửa bằng NetBeans trên hai laptop Windows, build trong GitHub Actions và deploy lên một VPS Linux. Mỗi nơi làm hỏng một thứ mà các nơi khác thì không sao. Bài này trả lời: <strong>những dòng code Java, Node và Python nào hành xử khác nhau trên ba hệ, làm sao thử hành vi Windows ngay trên Mac của bạn, và những hàng rào nào — <code>.gitattributes</code>, <code>.gitignore</code>, ma trận CI — giữ cho dự án chạy với tất cả mọi người?</strong></p>

<h3>Đường dẫn: đừng bao giờ tự ghép tay</h3>
${src('ch14/cross.cjs', 'js')}
${run('c148-mac', 'node cross.cjs')}
${run('c148-lx', 'node cross.cjs')}
<p>Hai lần chạy, Mac và Linux, giống hệt nhau trừ dòng <code>platform</code> — và đó chính là điều có ích: <code>path.win32</code> (và <code>path.posix</code>) cài đặt luật của Windows (và của POSIX) <strong>trên mọi hệ điều hành</strong>, nên bạn viết được unit test cho cách xử lý đường dẫn Windows ngay trên Mac. Ba kết quả cần nhớ: trên POSIX dấu gạch ngược là một ký tự bình thường, nên <code>src/config\\app.json</code> là thư mục <code>src</code> chứa một file tên đúng là <code>config\\app.json</code>; trên Windows <code>/etc</code> được tính là đường dẫn tuyệt đối (gốc của ổ hiện tại); và <code>path.join</code> tự chọn dấu phân cách đúng cho máy nó đang chạy. Python và Java cũng có y như vậy:</p>
${run('c148-lx', 'python3 cross.py')}
${run('c148-lx', 'java Cross.java')}
<p><code>ntpath</code>/<code>posixpath</code> và <code>PureWindowsPath</code>/<code>PurePosixPath</code> của Python chạy trên mọi hệ — và <code>PureWindowsPath</code> còn so tên không phân biệt hoa thường, giống NTFS. Java chỉ cho luật của hệ đang chạy: trên Windows ${DOC_VI} <code>File.separator</code> là <code>\\</code>, <code>File.pathSeparator</code> là <code>;</code> và <code>System.lineSeparator()</code> là <code>\\r\\n</code>. Hãy dùng <code>Path.of(a, b, c)</code>, <code>path.join</code> và <code>pathlib</code>; đừng bao giờ <code>"src/" + name</code> hay <code>"data\\\\" + name</code>.</p>

<h3>Hoa thường: chạy trên hai laptop, hỏng trên máy chủ</h3>
${src('ch14/Res.java', 'java')}
${run('c148-mac', 'java Res.java')}
${run('c148-lx', 'java Res.java')}
<p>File tên là <code>data/config.properties</code>; code lại xin <code>Config.properties</code>. APFS và NTFS nhún vai cho qua (bài 14.5); ext4 bảo file không tồn tại. Tài nguyên trên classpath cũng vậy: bên trong một <strong>JAR</strong> (một file ZIP) tên mục phân biệt hoa thường trên mọi hệ, nên <code>getResource("Logo.png")</code> có thể chạy trong IDE mà hỏng trong ứng dụng đã đóng gói, kể cả trên Mac. Git cũng giấu vấn đề này đi:</p>
${run('c148-mac', 'git -C . config core.ignorecase')}
${run('c148-mac', 'git init -q && git config user.name dev && git config user.email dev@example.com && echo hi', 3)}
<p>Trên Mac, Git chạy với <code>core.ignorecase = true</code>: đổi tên <code>Readme.md</code> thành <code>README.md</code> trên đĩa thì nó không thấy, nên tên cũ mới là thứ mọi người khác (và máy chủ Linux) nhận được. <code>git mv -f cũ Mới</code> ghi lại việc đổi tên một cách tường minh.</p>
${lab('syscall', 'fail', 'vi', 'openat("data/Config.properties") trên Linux: nhân duyệt thư mục, không thấy mục nào trùng đúng tên đó, và trả về −2 — ENOENT, rồi Java biến nó thành NoSuchFileException.', { tour: 'syscall-errno' })}

<h3>Xuống dòng: ký tự \\r vô hình</h3>
<p>Công cụ Windows theo truyền thống kết thúc dòng bằng CR LF (<code>\\r\\n</code>); Linux và macOS dùng LF. Một script shell lưu với CRLF:</p>
${run('c148-lx', "printf '#!/bin/bash", 4)}
<p>Mỗi dòng giờ kết thúc bằng một <code>\\r</code> vô hình (<code>cat -A</code> hiện nó thành <code>^M</code>). Nhân đọc dòng đầu tiên và đi tìm trình thông dịch tên là <code>/bin/bash\\r</code> — "bad interpreter: No such file or directory". Chạy thẳng qua <code>bash</code> thì script khởi động được nhưng mọi giá trị đều dính <code>\\r</code>: <code>NAME</code> thành <code>prod\\r</code> và <code>cd</code> đi tìm thư mục tên <code>/tmp\\r</code>. Trong Docker, cũng file đó làm <code>ENTRYPOINT</code> sẽ hỏng với "exec /entrypoint.sh: no such file or directory" — file có tồn tại, trình thông dịch của nó thì không. Gỡ <code>\\r</code> ra là sửa xong:</p>
${run('c148-lx', "sed -i 's/")}
<p>Các ký tự CR đến từ đâu? Phần lớn từ Git trên Windows. Bộ cài Git for Windows gợi ý "checkout Windows-style, commit Unix-style line endings", tức <code>core.autocrlf = true</code> ${DOC_VI}. Cùng thiết lập đó, tái hiện trên Mac:</p>
${run('c148-mac', "git init -q && git config user.name dev && git config user.email dev@example.com && printf", 3)}
<p>Commit bằng LF; checkout với <code>autocrlf = true</code> thì về tới nơi thành CRLF — đó chính là file bạn dùng Windows đang có, và nếu họ build ảnh Docker từ bản checkout của mình, ảnh sẽ chứa script CRLF. Một dòng <code>.gitattributes</code> trong kho ghi đè mọi thiết lập cá nhân, và đi theo code:</p>
${code(['# .gitattributes — commit ở gốc của kho', '* text=auto', '*.sh text eol=lf', 'Dockerfile text eol=lf', '*.bat text eol=crlf', '*.cmd text eol=crlf', '*.png binary'].join('\n'), 'ini')}

<h3>Khởi động tiến trình cho chạy được mọi nơi</h3>
<ul>
<li><strong>Node</strong> ${DOC_VI}: trên Windows <code>npm</code>, <code>npx</code> và nhiều CLI là file <code>.cmd</code>. <code>spawn('npm', ['ci'])</code> hỏng với <code>ENOENT</code> ở đó, và từ đợt vá bảo mật tháng 4/2024 (CVE-2024-27980), spawn một file <code>.bat</code>/<code>.cmd</code> mà không có <code>shell: true</code> sẽ ném <code>EINVAL</code>. Dùng <code>execFile</code>/<code>spawn</code> với mảng đối số, và chỉ bật <code>shell: true</code> khi đối số đáng tin, hoặc dùng thư viện như <code>cross-spawn</code>.</li>
<li><strong>Java</strong>: <code>new ProcessBuilder("sh", "-c", cmd)</code> không tồn tại trên Windows; rẽ nhánh theo <code>System.getProperty("os.name")</code> (<code>cmd.exe /c</code>) — hoặc tốt hơn, gọi thẳng chương trình với danh sách đối số và không qua shell nào cả.</li>
<li><strong>Python</strong>: <code>subprocess.run([...])</code> với một danh sách chạy mọi nơi; <code>shell=True</code> nghĩa là <code>/bin/sh</code> trên Unix và <code>cmd.exe</code> trên Windows — hai ngôn ngữ khác nhau.</li>
<li><strong>Tín hiệu</strong>: xử lý SIGINT và SIGTERM; chuẩn bị cho việc bị kết thúc cứng trên Windows (bài 14.2).</li>
</ul>

<h3>Khoá file: xoá và đổi tên trên Windows không giống vậy</h3>
${run('c148-lx', 'exec 3> /tmp/app.log')}
<p>Trên Linux và macOS, một file có thể bị xoá hay đổi tên trong khi một tiến trình vẫn đang mở nó; tiến trình tiếp tục ghi vào cái inode giờ đã mất tên (sự cố đầy đĩa vì "file đã xoá vẫn còn mở" ở <a href="${OS('os-2-4-dia-io')}">bài 2.4</a>). Trên Windows ${DOC_VI} file thường được mở với chế độ chia sẻ không bao gồm quyền xoá, nên xoá hay đổi tên một file mà tiến trình khác đang giữ sẽ hỏng với "The process cannot access the file because it is being used by another process" (<code>ERROR_SHARING_VIOLATION</code>). Hệ quả thực tế: xoay vòng log bằng cách đổi tên hỏng khi ứng dụng đang giữ file log; <code>npm install</code>, <code>git checkout</code> hay Gradle clean hỏng với <code>EPERM</code>/<code>EBUSY</code> khi một trình soạn thảo, trình diệt virus hay bộ đánh chỉ mục đang mở một file; code Java muốn xoá hay dời file phải đóng mọi luồng trước — dùng try-with-resources.</p>
${lab('fdtable', 'deleted', 'vi', 'Xoá một file mà tiến trình vẫn đang mở: trên Linux tên biến mất còn inode sống tới khi fd cuối cùng đóng. Trên Windows thì chính lệnh xoá sẽ bị từ chối.', { tour: 'fdtable-deleted' })}

<h3>Dự án NetBeans qua lại giữa Windows và Mac</h3>
<p>Một dự án NetBeans dựng trên Ant giữ thiết lập build trong <code>nbproject/</code> ${DOC_VI}. Hai phần mang đi rất dở: <code>nbproject/private/</code> chứa đường dẫn tuyệt đối riêng của từng người (JDK của bạn, thư mục của bạn) và không bao giờ được commit; còn <code>nbproject/project.properties</code> có thể chứa đường dẫn tuyệt đối <code>file.reference.*</code> kiểu <code>C\\:\\\\Users\\\\an\\\\libs\\\\mysql.jar</code> chỉ tồn tại trên một laptop, và gọi Java platform theo cái nhãn mỗi người tự đặt. Trước Java 18, <code>javac</code> trên Windows đọc mã nguồn theo windows-1252 nếu không được dặn khác, nên chuỗi tiếng Việt viết trên Mac ra thành chữ hỏng — hãy đặt <code>source.encoding=UTF-8</code> (thiết lập dự án của NetBeans), hoặc dùng Java 18+, nơi UTF-8 là mặc định ở mọi hệ. Cách sửa mang đi được là để công cụ build, không phải IDE, làm chủ dự án: một <code>pom.xml</code> Maven hay một bản build Gradle mở y hệt nhau trong NetBeans, IntelliJ và VS Code trên cả ba hệ, và CI dùng đúng file đó.</p>
${code(['# .gitignore cho dự án NetBeans / Java dùng chung giữa Windows và macOS', 'nbproject/private/', 'build/', 'dist/', 'target/', '.DS_Store', 'Thumbs.db', 'desktop.ini'].join('\n'), 'ini')}

<h3>Để CI chạy cả ba</h3>
<p>Phép thử đáng tin duy nhất cho "chạy được trên cả ba" là chạy nó trên cả ba. GitHub Actions có sẵn máy chạy Linux, macOS và Windows; một job ma trận phủ hết:</p>
${code(['# .github/workflows/test.yml', 'name: test', 'on: [push, pull_request]', 'jobs:', '  test:', '    strategy:', '      fail-fast: false', '      matrix:', '        os: [ubuntu-latest, macos-latest, windows-latest]', '    runs-on: \${{ matrix.os }}', '    defaults:', '      run:', '        shell: bash          # Git Bash trên Windows, để cùng dòng lệnh chạy ở mọi nơi', '    steps:', '      - uses: actions/checkout@v4', '      - uses: actions/setup-node@v4', '        with: { node-version: 22 }', '      - run: npm ci', '      - run: npm test'].join('\n'), 'yaml')}
<p><code>fail-fast: false</code> cho hai máy kia chạy xong khi một máy hỏng, nên bạn thấy được lỗi có phải chỉ riêng Windows không. Thêm một test mở file đúng hoa thường, một test khởi động tiến trình con và một test tắt khi nhận SIGINT — ba kiểu hỏng đa nền tảng kinh điển của chương này.</p>

<div class="pitfall co-tieu-de">
<p><strong>"exec /docker-entrypoint.sh: no such file or directory — mà file nằm ngay đó."</strong> Ảnh được build từ một bản checkout trên Windows với <code>core.autocrlf = true</code>, nên dòng đầu của script là <code>#!/bin/sh\\r</code> và nhân không tìm được trình thông dịch nào mang tên đó — đúng lỗi "bad interpreter" vừa đo. Lưu lại file trong trình soạn thảo thì sửa được tới lần checkout sau. Cách sửa bền là commit một <code>.gitattributes</code> có <code>*.sh text eol=lf</code>, cộng chạy <code>git add --renormalize .</code> một lần để viết lại các file đã nằm trong kho.</p>
</div>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> dự án nhóm (một API Spring Boot hoặc Express kèm vài script shell) phải mở được trong NetBeans trên Windows, chạy trên Mac của bạn, build trong CI và deploy lên Linux, và hiện đang hỏng ở ít nhất ba chỗ. Hãy làm nó chạy được mọi nơi và chứng minh điều đó.</p>
<ol>
<li>Chạy <code>node cross.cjs</code>, <code>python3 cross.py</code> và <code>java Cross.java</code> trên Mac và trong lab; rồi grep dự án tìm đường dẫn ghép bằng chuỗi (<code>"/" +</code>, <code>+ "\\\\"</code>) và thay bằng <code>path.join</code>/<code>Path.of</code>/<code>pathlib</code>.</li>
<li>Chạy <code>java Res.java</code> trên Mac và trong lab; sửa mọi tên tài nguyên có hoa thường khác với file trên đĩa (<code>git ls-files</code> cho thấy cách viết thật).</li>
<li>Thêm <code>.gitattributes</code> và <code>.gitignore</code> ở trên, chạy <code>git add --renormalize .</code>, và kiểm bằng <code>file *.sh</code> rằng mọi script đều là LF.</li>
<li>Thêm ma trận CI ba hệ điều hành và mỗi thứ một test: mở file đúng hoa thường, khởi động tiến trình con, và tắt khi nhận SIGINT.</li>
</ol>
<p><strong>Đạt khi:</strong> ma trận CI xanh trên ubuntu-latest, macos-latest và windows-latest; <code>file</code> không báo script CRLF nào; <code>nbproject/private</code> không nằm trong kho; và một bạn dùng Windows clone, mở trong NetBeans và chạy được dự án mà không phải sửa đường dẫn nào.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['path.win32 / ntpath', 'Luật đường dẫn của Windows dùng được trên mọi hệ (Node, Python) — thử cách xử lý đường dẫn Windows từ Mac hay Linux.'],
  ['CRLF / LF', 'Dòng kết thúc kiểu Windows (\\r\\n) vs Unix (\\n); một \\r lạc làm hỏng shebang và biến shell.'],
  ['core.autocrlf', 'Thiết lập Git đổi LF thành CRLF khi checkout (true trên hầu hết máy Windows); là thiết lập cá nhân, không dùng chung.'],
  ['.gitattributes', 'File được commit, cố định kiểu xuống dòng theo đường dẫn cho mọi người (*.sh text eol=lf), ghi đè thiết lập cá nhân.'],
  ['core.ignorecase', 'Thiết lập Git (true trên macOS/Windows) làm việc đổi tên chỉ khác hoa thường trở nên vô hình; git mv -f ghi lại được.'],
  ['ERROR_SHARING_VIOLATION', 'Lỗi Windows khi xoá/đổi tên một file tiến trình khác đang mở; Linux và macOS cho phép.'],
  ['CI matrix (ma trận CI)', 'Một workflow chạy trên nhiều hệ điều hành (ubuntu/macos/windows-latest) để lỗi riêng nền tảng lộ ra trước khi deploy.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dựng đường dẫn bằng <code>path.join</code>, <code>Path.of</code>, <code>pathlib</code>; thử luật Windows ở bất kỳ đâu bằng <code>path.win32</code>/<code>ntpath</code>.</li>
<li>Laptop không phân biệt hoa thường giấu tên file sai; Linux (và file JAR) thì không — <code>Config.properties</code> chạy trên Mac và ném lỗi trên Linux.</li>
<li>CRLF làm hỏng script shell (<code>/bin/bash^M</code>, <code>$'/tmp\\r'</code>); <code>autocrlf</code> tạo ra chúng, <code>.gitattributes eol=lf</code> ngăn chúng.</li>
<li>Spawn bằng danh sách đối số, xử lý file <code>.cmd</code> trên Windows, xử lý SIGINT và SIGTERM; đóng file trước khi xoá hay đổi tên.</li>
<li>Để file riêng của IDE ngoài Git, để Maven/Gradle làm chủ bản build, và chạy CI trên cả ba hệ điều hành.</li>
</ul>
${L('https://git-scm.com/docs/gitattributes', '📄', 'gitattributes (tài liệu Git)', 'text, eol và binary theo đường dẫn — cách sửa xuống dòng được commit cùng kho.', 'Mở')}
${L('https://nodejs.org/api/path.html', '📄', 'Module path của Node.js', 'path.join, path.resolve, path.win32 và path.posix.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 14.9 — Quiz ───────────────────────── */
    {
      title: '14.9 — Chapter 14 check: Windows and macOS for developers|||14.9 — Kiểm tra Chương 14: Windows và macOS cho lập trình viên',
      slug: 'os-14-9-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống trên ba hệ điều hành: mã thoát 138 trên Mac và Linux, fork vs posix_spawn, 12 GB swap trên Mac, "out of memory" khi RAM còn trống trên Windows, file nhỏ qua bind mount, Config.properties, CRLF và bad interpreter, dtruss và SIP, SIGTERM trên Windows, ống dẫn đối tượng của PowerShell.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Check</span>
<h2>Chapter 14 check: Windows and macOS for developers</h2>
<p class="lead">Ten situations from a study group with a Mac, two Windows laptops and a Linux VPS. Each one hides an OS difference measured in this chapter — a signal number, a page table, a commit limit, a VM boundary, a case-insensitive file system, an invisible <code>\\r</code>.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can name the kernel, PID 1, page size and system library of Linux, macOS and Windows, and explain why only Linux keeps syscall numbers stable.</li>
<li>I can explain fork vs posix_spawn vs CreateProcess, and why signal numbers and exit codes differ between macOS and Linux.</li>
<li>I can read memory health on each OS: memory pressure and swapins, commit charge vs limit, MemAvailable.</li>
<li>I can explain why Docker and WSL2 are VMs and what crossing the VM boundary costs for small files.</li>
<li>I can make a project portable: paths, case, line endings, spawning, file locks, PowerShell vs Bash, and a three-OS CI matrix.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Kiểm tra</span>
<h2>Kiểm tra Chương 14: Windows và macOS cho lập trình viên</h2>
<p class="lead">Mười tình huống từ một nhóm học có một máy Mac, hai laptop Windows và một VPS Linux. Mỗi câu giấu một khác biệt hệ điều hành đã đo trong chương này — một số tín hiệu, một bảng trang, một commit limit, một ranh giới máy ảo, một hệ thống file không phân biệt hoa thường, một ký tự <code>\\r</code> vô hình.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi gọi tên được nhân, PID 1, cỡ trang và thư viện hệ thống của Linux, macOS và Windows, và giải thích được vì sao chỉ Linux giữ số syscall ổn định.</li>
<li>Tôi giải thích được fork vs posix_spawn vs CreateProcess, và vì sao số tín hiệu và mã thoát khác nhau giữa macOS và Linux.</li>
<li>Tôi đọc được sức khoẻ bộ nhớ trên từng hệ: memory pressure và swapins, commit charge so với giới hạn, MemAvailable.</li>
<li>Tôi giải thích được vì sao Docker và WSL2 là máy ảo và việc vượt ranh giới máy ảo tốn bao nhiêu với file nhỏ.</li>
<li>Tôi làm được một dự án chạy mọi nơi: đường dẫn, hoa thường, xuống dòng, khởi động tiến trình, khoá file, PowerShell vs Bash, và ma trận CI ba hệ điều hành.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          { question: 'A worker killed by a signal reports <code>exit 138</code> on your Mac. In Linux CI a different worker also reports <code>exit 138</code>. What happened to each?|||Một worker bị giết bởi tín hiệu báo <code>exit 138</code> trên Mac của bạn. Trong CI Linux, một worker khác cũng báo <code>exit 138</code>. Mỗi worker đã gặp chuyện gì?',
            options: ['Both received SIGUSR1|||Cả hai đều nhận SIGUSR1', 'Linux: 128 + 10 = SIGUSR1; macOS: 128 + 10 = SIGBUS (SIGUSR1 is 30 there, which would give 158)|||Linux: 128 + 10 = SIGUSR1; macOS: 128 + 10 = SIGBUS (ở đó SIGUSR1 là 30, sẽ cho 158)', 'Both were killed by the OOM killer|||Cả hai bị OOM killer giết', 'Exit 138 always means a segmentation fault|||Exit 138 luôn có nghĩa là segmentation fault'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Measured in 14.2: kill -USR1 gave 158 on the Mac and 138 in the lab; kill -BUS gave 138 on the Mac and 135 on Linux. macOS keeps BSD numbering (BUS = 10, USR1 = 30), Linux uses USR1 = 10, BUS = 7. Only 1, 2, 3, 6, 9, 14, 15 are fixed by POSIX — so A is wrong for the Mac. OOM kills are SIGKILL = 137 on both (C), and SIGSEGV is 139 on both (D).|||VI: Đo ở 14.2: kill -USR1 cho 158 trên Mac và 138 trong lab; kill -BUS cho 138 trên Mac và 135 trên Linux. macOS giữ cách đánh số BSD (BUS = 10, USR1 = 30), Linux dùng USR1 = 10, BUS = 7. POSIX chỉ cố định 1, 2, 3, 6, 9, 14, 15 — nên A sai với Mac. OOM giết bằng SIGKILL = 137 ở cả hai (C), còn SIGSEGV là 139 ở cả hai (D).' },
          { question: 'On Linux, <code>spawn.c</code> measured fork+exec at 0.26 ms with a small parent but 5.2 ms when the parent had touched 512 MiB, while posix_spawn stayed at 0.22 ms. Why?|||Trên Linux, <code>spawn.c</code> đo fork+exec mất 0,26 ms với tiến trình cha nhỏ nhưng 5,2 ms khi cha đã chạm 512 MiB, trong khi posix_spawn vẫn 0,22 ms. Vì sao?',
            options: ['posix_spawn is a separate fast system call in the Linux kernel|||posix_spawn là một system call nhanh riêng trong nhân Linux', 'fork copies the 512 MiB of data to the child|||fork chép 512 MiB dữ liệu sang tiến trình con', 'exec takes longer when the parent is large|||exec chậm hơn khi tiến trình cha lớn', 'fork must copy page-table entries for 131,072 pages and mark them copy-on-write; glibc’s posix_spawn uses clone(CLONE_VM|CLONE_VFORK) and shares memory until exec|||fork phải chép mục bảng trang cho 131.072 trang và đánh dấu copy-on-write; posix_spawn của glibc dùng clone(CLONE_VM|CLONE_VFORK) và dùng chung bộ nhớ tới khi exec'],
            correctIndex: 3, points: 1,
            explanation: 'EN: strace showed posix_spawn as clone(CLONE_VM|CLONE_VFORK) — a library function on Linux, not a kernel call (that is macOS, where posix_spawn is syscall 244), so A is wrong. fork does not copy the data itself (B): it copies the page tables and marks pages copy-on-write, which is the cost that grows with parent size. exec runs in the child after fork; it does not care how big the parent was (C).|||VI: strace cho thấy posix_spawn là clone(CLONE_VM|CLONE_VFORK) — một hàm thư viện trên Linux, không phải lời gọi nhân (đó là macOS, nơi posix_spawn là syscall 244), nên A sai. fork không chép chính dữ liệu (B): nó chép bảng trang và đánh dấu copy-on-write, chính là chi phí tăng theo cỡ tiến trình cha. exec chạy trong tiến trình con sau fork; nó chẳng quan tâm tiến trình cha lớn thế nào (C).' },
          { question: 'Your Mac shows "Memory Used 30 GB of 32 GB", <code>vm.swapusage used = 12149M</code>, and <code>memory_pressure</code> says "System-wide memory free percentage: 57%". A friend says you must buy more RAM. What do you answer?|||Mac của bạn báo "Memory Used 30 GB of 32 GB", <code>vm.swapusage used = 12149M</code>, và <code>memory_pressure</code> báo "System-wide memory free percentage: 57%". Một người bạn bảo bạn phải mua thêm RAM. Bạn trả lời thế nào?',
            options: ['Not on these numbers: used RAM includes cache and the compressor, swap used is cold history; trouble is memory pressure turning yellow/red and swapins rising|||Chưa với các con số này: RAM "used" gồm cả cache và compressor, swap đã dùng là dữ liệu nguội của quá khứ; có chuyện là khi memory pressure chuyển vàng/đỏ và swapins tăng', 'Yes — any swap usage means RAM has run out|||Có — dùng swap chút nào cũng có nghĩa là hết RAM', 'Turn off swap so macOS is forced to keep everything in RAM|||Tắt swap để ép macOS giữ mọi thứ trong RAM', 'Run purge every hour to free the compressor|||Chạy purge mỗi giờ để giải phóng compressor'],
            correctIndex: 0, points: 1,
            explanation: 'EN: In 14.4 the compressor held 16.9 GiB in 9.8 GiB and 12 GB of swap sat in self-grown swapfiles, yet pressure was green (57 % free) — that data is cold. The signal of real shortage is pressure plus a rising swapins rate (vm_stat 1). B treats history as the present; C removes the safety valve; D throws away cache that will be rebuilt.|||VI: Ở 14.4 compressor giữ 16,9 GiB trong 9,8 GiB và 12 GB swap nằm trong các swapfile tự mọc, vậy mà áp lực vẫn xanh (57 % rảnh) — dữ liệu đó nguội. Dấu hiệu thiếu thật là áp lực cộng tốc độ swapins tăng (vm_stat 1). B coi quá khứ là hiện tại; C bỏ van an toàn; D vứt bỏ cache rồi lại phải dựng lại.' },
          { question: 'After following an "optimise Windows" guide that disabled the pagefile, a teammate’s laptop shows "out of memory" errors in IntelliJ while Task Manager says 6 GB of RAM are free. What is the most likely explanation?|||Sau khi làm theo một bài "tối ưu Windows" bảo tắt pagefile, laptop của bạn cùng nhóm báo lỗi "out of memory" trong IntelliJ trong khi Task Manager nói còn trống 6 GB RAM. Giải thích hợp lý nhất là gì?',
            options: ['The Windows OOM killer killed IntelliJ|||OOM killer của Windows đã giết IntelliJ', 'A memory leak filled the physical RAM|||Một chỗ rò bộ nhớ đã lấp đầy RAM vật lý', 'The commit limit is RAM + pagefile; without a pagefile it dropped to RAM alone, and the commit charge reached it — Windows refuses to overcommit|||Commit limit là RAM + pagefile; không có pagefile nó tụt xuống chỉ bằng RAM, và commit charge chạm tới — Windows từ chối overcommit', 'Windows can only use 4 GB per process|||Windows chỉ cho mỗi tiến trình dùng 4 GB'],
            correctIndex: 2, points: 1,
            explanation: 'EN: Windows checks every commit against the commit limit (RAM + all pagefiles); it does not overcommit like Linux (Committed_AS > CommitLimit was measured in the Linux VM). So allocations fail while physical RAM is free. There is no OOM killer on Windows (A); the RAM is not full (B); 64-bit Windows has no 4 GB per-process limit (D).|||VI: Windows kiểm mỗi lần commit với commit limit (RAM + mọi pagefile); nó không overcommit như Linux (đã đo Committed_AS > CommitLimit trong máy ảo Linux). Vì thế cấp phát thất bại trong khi RAM vật lý còn trống. Windows không có OOM killer (A); RAM chưa đầy (B); Windows 64-bit không có giới hạn 4 GB mỗi tiến trình (D).' },
          { question: '<code>npm install</code> in a project bind-mounted into Docker on your Mac takes minutes; on the VPS it takes seconds. The lab measured reading 3,000 small files at 0.48–0.54 s on the shared folder vs 0.021 s on the VM’s own disk. Best fix?|||<code>npm install</code> trong một dự án gắn bind mount vào Docker trên Mac mất vài phút; trên VPS mất vài giây. Lab đo đọc 3.000 file nhỏ mất 0,48–0,54 s trên thư mục chia sẻ so với 0,021 s trên ổ riêng của máy ảo. Cách sửa tốt nhất?',
            options: ['Give the Docker VM more CPUs|||Cho máy ảo Docker thêm CPU', 'Keep node_modules (and build output) inside the VM — a named volume or COPY into the image — and mount only the source you edit|||Giữ node_modules (và kết quả build) bên trong máy ảo — một named volume hoặc COPY vào ảnh — và chỉ gắn phần mã nguồn bạn sửa', 'Make the shared folder case-sensitive|||Làm thư mục chia sẻ phân biệt hoa thường', 'Run npm install on macOS and mount the resulting node_modules into the container|||Chạy npm install trên macOS rồi gắn node_modules đó vào container'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Each file operation on a virtiofs share crosses the VM boundary to macOS (~10–23× slower in 14.6); keeping the tens of thousands of small dependency files on the VM’s disk removes the toll. More CPUs do not shorten a per-operation round trip (A); case has nothing to do with speed (C); D keeps the files on the share and installs macOS (Mach-O) native modules into a Linux container.|||VI: Mỗi thao tác file trên thư mục chia sẻ virtiofs phải vượt ranh giới máy ảo sang macOS (chậm ~10–23 lần ở 14.6); giữ hàng chục nghìn file phụ thuộc nhỏ trên ổ của máy ảo là bỏ được khoản phí đó. Thêm CPU không rút ngắn được chuyến đi của từng thao tác (A); hoa thường chẳng liên quan tới tốc độ (C); D vẫn để file trên thư mục chia sẻ và còn cài module gốc của macOS (Mach-O) vào container Linux.' },
          { question: '<code>Files.readString(Path.of("data", "Config.properties"))</code> works on your Mac and on a Windows laptop, but the VPS throws <code>NoSuchFileException: data/Config.properties</code>. The repository contains <code>data/config.properties</code>. What is wrong?|||<code>Files.readString(Path.of("data", "Config.properties"))</code> chạy trên Mac của bạn và trên một laptop Windows, nhưng VPS ném <code>NoSuchFileException: data/Config.properties</code>. Kho chứa <code>data/config.properties</code>. Sai ở đâu?',
            options: ['ext4 on Linux is case-sensitive; APFS and NTFS are not by default — fix the name in the code to match the file exactly|||ext4 trên Linux phân biệt hoa thường; APFS và NTFS mặc định thì không — sửa tên trong code cho khớp đúng file', 'Linux needs a backslash as the path separator|||Linux cần dấu gạch ngược làm dấu phân cách', 'The file has the wrong permissions on the VPS|||File có quyền sai trên VPS', 'The file is not saved as UTF-8|||File không được lưu bằng UTF-8'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured in 14.8: the same Res.java printed the property on the Mac and threw NoSuchFileException in the Linux lab. Path.of already uses the right separator (B is backwards — Linux uses /); a permission problem would be AccessDeniedException (C); encoding affects contents, not whether the file is found (D).|||VI: Đo ở 14.8: cùng Res.java in ra thuộc tính trên Mac và ném NoSuchFileException trong lab Linux. Path.of đã dùng đúng dấu phân cách (B ngược — Linux dùng /); lỗi quyền sẽ là AccessDeniedException (C); bảng mã ảnh hưởng nội dung, không ảnh hưởng việc tìm thấy file (D).' },
          { question: 'In the Linux container, <code>./deploy.sh</code> fails with <code>/bin/bash^M: bad interpreter: No such file or directory</code>, although <code>/bin/bash</code> exists. The teammate who committed it uses Git for Windows. Best fix?|||Trong container Linux, <code>./deploy.sh</code> hỏng với <code>/bin/bash^M: bad interpreter: No such file or directory</code>, dù <code>/bin/bash</code> có tồn tại. Bạn đã commit nó dùng Git for Windows. Cách sửa tốt nhất?',
            options: ['Install bash in the image|||Cài bash vào ảnh', 'chmod +x deploy.sh|||chmod +x deploy.sh', 'Rebuild the image for the right CPU architecture|||Build lại ảnh cho đúng kiến trúc CPU', 'The file has CRLF endings, so the kernel looks for "/bin/bash\\r"; commit a .gitattributes with *.sh text eol=lf and run git add --renormalize .|||File có dòng kết thúc CRLF, nên nhân đi tìm "/bin/bash\\r"; commit một .gitattributes với *.sh text eol=lf và chạy git add --renormalize .'],
            correctIndex: 3, points: 1,
            explanation: 'EN: ^M is the carriage return. Measured in 14.8: the CRLF script gave exactly this error, and after removing \\r it ran. On the Mac, core.autocrlf=true turned an LF commit into a CRLF checkout, and .gitattributes eol=lf restored LF — a committed fix beats a personal setting or a one-off sed. bash exists (A); a missing x bit gives "Permission denied" (B); a wrong architecture gives "exec format error" (C).|||VI: ^M là ký tự carriage return. Đo ở 14.8: script CRLF cho đúng lỗi này, và gỡ \\r ra thì chạy. Trên Mac, core.autocrlf=true biến một commit LF thành bản checkout CRLF, và .gitattributes eol=lf trả về LF — cách sửa được commit hơn hẳn thiết lập cá nhân hay một lần sed. bash có tồn tại (A); thiếu bit x thì báo "Permission denied" (B); sai kiến trúc thì báo "exec format error" (C).' },
          { question: 'On your Mac, <code>dtruss -p PID</code> prints "DTrace requires additional privileges" and "system integrity protection is on". You want to see which files a Node process opens. What do you do?|||Trên Mac, <code>dtruss -p PID</code> in ra "DTrace requires additional privileges" và "system integrity protection is on". Bạn muốn xem một tiến trình Node mở những file nào. Bạn làm gì?',
            options: ['Run it with sudo — SIP only blocks normal users|||Chạy với sudo — SIP chỉ chặn người dùng thường', 'Install a newer dtruss from Homebrew|||Cài một dtruss mới hơn từ Homebrew', 'Reproduce it in the Linux lab and use strace (or use Instruments); do not disable SIP just for tracing|||Tái hiện trong lab Linux rồi dùng strace (hoặc dùng Instruments); đừng tắt SIP chỉ để theo dõi', 'Use fs_usage without sudo instead|||Dùng fs_usage không sudo thay thế'],
            correctIndex: 2, points: 1,
            explanation: 'EN: SIP restricts DTrace even for root on a default Mac (14.3), so A fails; the limit is in the kernel, not in the tool version (B); fs_usage printed "must be run as root" (D). Tracing in the Linux container or with Apple’s signed Instruments keeps the system protected.|||VI: SIP giới hạn DTrace kể cả với root trên Mac mặc định (14.3), nên A thất bại; giới hạn nằm trong nhân, không phải ở phiên bản công cụ (B); fs_usage in ra "must be run as root" (D). Theo dõi trong container Linux hoặc bằng Instruments có chữ ký của Apple giữ hệ thống được bảo vệ.' },
          { question: 'An Express server cleans up in <code>process.on("SIGTERM", …)</code>. It shuts down cleanly on the VPS (Docker sends SIGTERM) but leaves half-written files when a teammate stops it from the IDE on Windows. Why?|||Một máy chủ Express dọn dẹp trong <code>process.on("SIGTERM", …)</code>. Nó tắt êm trên VPS (Docker gửi SIGTERM) nhưng để lại file ghi dở khi bạn cùng nhóm dừng nó từ IDE trên Windows. Vì sao?',
            options: ['Node has a bug in its Windows build|||Bản Node cho Windows có lỗi', 'Windows has no signals: a SIGTERM listener never fires there, and stopping/process.kill is TerminateProcess — handle SIGINT (Ctrl+C) too and commit work as you go|||Windows không có tín hiệu: handler SIGTERM không bao giờ chạy ở đó, và việc dừng/process.kill là TerminateProcess — hãy xử lý cả SIGINT (Ctrl+C) và ghi dữ liệu xong tới đâu chốt tới đó', 'The IDE needs administrator rights to send SIGTERM|||IDE cần quyền quản trị để gửi SIGTERM', 'Listen for SIGKILL instead|||Hãy nghe SIGKILL thay thế'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Node’s documentation: "SIGTERM is not supported on Windows, it can be listened on", and process.kill there causes unconditional termination; Ctrl+C arrives as SIGINT, Ctrl+Break as SIGBREAK. It is a platform difference, not a bug (A) or a permission (C). SIGKILL can never have a listener on any OS (D).|||VI: Tài liệu Node: "SIGTERM is not supported on Windows, it can be listened on", và process.kill ở đó gây kết thúc vô điều kiện; Ctrl+C tới thành SIGINT, Ctrl+Break thành SIGBREAK. Đây là khác biệt nền tảng, không phải lỗi (A) hay quyền (C). SIGKILL không bao giờ có handler trên hệ nào (D).' },
          { question: 'In the lab, <code>Get-Process -Id $PID</code> returned a <code>System.Diagnostics.Process</code> with 52 properties, and <code>Get-Process | Sort-Object CPU -Descending | Select-Object -First 3 …</code> listed the busiest processes. Which statement is true?|||Trong lab, <code>Get-Process -Id $PID</code> trả về một <code>System.Diagnostics.Process</code> có 52 thuộc tính, và <code>Get-Process | Sort-Object CPU -Descending | Select-Object -First 3 …</code> liệt kê các tiến trình bận nhất. Phát biểu nào đúng?',
            options: ['PowerShell passes .NET objects between cmdlets and sorts by property; text appears only when Format-Table draws it, while a Bash pipe carries bytes that each stage must parse|||PowerShell chuyền đối tượng .NET giữa các cmdlet và sắp theo thuộc tính; văn bản chỉ xuất hiện khi Format-Table vẽ ra, còn ống Bash chở byte mà mỗi bước phải tự tách', 'PowerShell runs ps and parses its text output into objects|||PowerShell chạy ps rồi tách output văn bản của nó thành đối tượng', 'The two pipelines are identical; PowerShell only renames the commands|||Hai ống dẫn giống hệt nhau; PowerShell chỉ đổi tên lệnh', 'This only works on Windows; on Linux pwsh falls back to Bash|||Việc này chỉ chạy trên Windows; trên Linux pwsh lùi về Bash'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Measured with real PowerShell 7.6.9 on Linux in 14.7: Get-Process emits Process objects (52 properties) without running ps; Sort-Object, Where-Object, Measure-Object and ConvertTo-Json work on properties. B and C describe text pipelines; D is contradicted by the measurement itself — pwsh ran natively on Ubuntu.|||VI: Đo bằng PowerShell 7.6.9 thật trên Linux ở 14.7: Get-Process phát ra đối tượng Process (52 thuộc tính) mà không chạy ps; Sort-Object, Where-Object, Measure-Object và ConvertTo-Json làm việc trên thuộc tính. B và C mô tả ống dẫn văn bản; D bị chính phép đo bác bỏ — pwsh chạy thẳng trên Ubuntu.' },
        ],
      },
    },
  ],
};
