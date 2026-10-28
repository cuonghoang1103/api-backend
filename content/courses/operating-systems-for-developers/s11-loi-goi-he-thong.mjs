/**
 * Operating Systems for Developers — Chương 11: Lời gọi hệ thống và ranh giới nhân (soạn 28/10/2026 theo _HOP-DONG.md).
 * Chủ kênh hỏi: "cách chương trình của tôi nói chuyện với nhân hệ điều hành". Output CHẠY THẬT trong ảnh `os-lab`:
 *   lab/code/ch11/c111-hanh-trinh.sh → lab/out/c111-hanh-trinh (strace/nm/objdump/gdb của hello tĩnh; errno; Node/Python/Java)
 *   lab/code/ch11/c111-kernel.sh     → lab/out/c111-kernel     (--privileged --pid=host: ftrace "function" CHỈ cho tiến
 *                                                               trình ktrace — phía nhân của một write(); trả ftrace về nop)
 *   lab/code/ch11/c112-raw.sh        → lab/out/c112-raw        (syscall(), svc #0 nội tuyến, chương trình không libc; Go 1.27.3
 *                                                               tải từ go.dev gắn chỉ-đọc; libuv; JVM)
 *   lab/code/ch11/c113-strace.sh     → lab/out/c113-strace     (-Z/-p/-T/-tt/-c/-k; hỏng/treo/chậm; syscall mỗi request Node/
 *                                                               Python/Java + Nagle 40 ms; giá của strace; ltrace)
 *   lab/code/ch11/c114-chi-phi.sh    → lab/out/c114-chi-phi    (giá syscall, vDSO, writev/stdio/Buffered, sendfile/copy_file_range)
 *   lab/code/ch11/c115-eintr.sh      → lab/out/c115-eintr      (errno, EINTR/SA_RESTART, EAGAIN, SIGPIPE/EPIPE, PEP 475, SIGURG Go)
 *   lab/code/ch11/c116-proc.sh       → lab/out/c116-proc       (--memory 512m --cpus 1.5: /proc, /sys, /proc/PID/io, cgroup)
 *   lab/code/ch11/c116-bpf.sh        → lab/out/c116-bpf        (--privileged + bpftrace 0.25.0 cài từ .deb: xem trước eBPF)
 *   lab/code/ch11/c117-seccomp.sh    → lab/out/c117-seccomp    (bộ lọc BPF viết tay: EPERM/ENOSYS/SIGSYS, clone3, danh sách cho phép)
 *   lab/code/ch11/c117-host.sh       → lab/out/c117-host       (gõ TỪ MÁY CHỦ bằng ../ch09/phien-host.sh: hồ sơ Docker, strict)
 * Máy đo: Docker Desktop trên Apple Silicon (arm64, 10 lõi, nhân 7.0.12-linuxkit), Ubuntu 26.04 (glibc 2.43, gcc 15.2,
 * strace 6.19 — bản arm64 KHÔNG có -k). x86-64 chỉ nêu ở mức quy ước gọi (man 2 syscall), không chạy.
 * Thứ tự bài ≠ số trong slug: 4 slug đã seed từ khung (os-11-1-hanh-trinh, os-11-2-strace-ltrace, os-11-3-raw,
 * os-11-4-seccomp) GIỮ NGUYÊN; bài mới os-11-5-chi-phi, os-11-6-errno-tin-hieu, os-11-7-proc-sys chen vào đúng mạch học.
 * Ranh giới: chế độ user/kernel + giá syscall cơ bản ở Ch1 (1.3); fd/fsync ở Ch9; epoll/io_uring sâu ở Ch10 (ở đây chỉ xem
 * trước); namespace/cgroup ở Ch12; seccomp khái niệm ở Ch13 (13.4); eBPF sâu ở Ch15.
 * LUẬT escaping: < > → &lt; &gt;; & → &amp;; không backtick trần; ${ của bash → \${.
 */
import { run, src, card, kv, cmd } from './_ui.mjs';
import { lab } from './_lab.mjs';
import G111 from './giang/os-11-1.mjs';
import G112 from './giang/os-11-2.mjs';
import G113 from './giang/os-11-3.mjs';
import G114 from './giang/os-11-4.mjs';
import G115 from './giang/os-11-5.mjs';
import G116 from './giang/os-11-6.mjs';
import G117 from './giang/os-11-7.mjs';

const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);
const OS = (slug) => '/courses/operating-systems-for-developers/learn?lessonSlug=' + slug;
const OSG = (slug) => '/courses/operating-systems/learn?lessonSlug=' + slug;

export default {
  title: 'Chapter 11 — System calls and the kernel boundary|||Chương 11 — Lời gọi hệ thống và ranh giới nhân',
  description: 'Chương trình của bạn nói chuyện với nhân thế nào, đo và nhìn tận nơi: một printf đi qua libc, số hiệu trong thanh ghi, lệnh svc/syscall, bảng syscall, hàm xử lý và driver (strace, objdump, gdb, ftrace); tự viết syscall trần và chương trình không libc, cách Node/JVM/Go bọc syscall; strace thực chiến cho "vì sao hỏng, vì sao treo, vì sao chậm" và đếm syscall mỗi request (lộ ra độ trễ Nagle 40 ms của máy chủ Python/Java); giá một syscall, vDSO, gộp lời gọi (writev, sendfile, copy_file_range); errno, EINTR/SA_RESTART, EAGAIN, SIGPIPE; /proc và /sys là API của nhân, xem trước eBPF; seccomp thực hành (EPERM, SIGSYS, clone3, danh sách cho phép rút từ strace, hồ sơ mặc định của Docker).',
  lessons: [
    /* ───────────────────────── 11.1 — Hành trình của một lời gọi ───────────────────────── */
    {
      title: '11.1 — One printf, followed into the kernel: wrapper, number, trap, table, errno|||11.1 — Một lệnh printf, theo chân vào tận nhân: hàm bọc, số hiệu, bẫy, bảng, errno',
      slug: 'os-11-1-hanh-trinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hành trình của một lời gọi: hello tĩnh hỏi nhân 16 lần (strace); printf thành puts và chỉ write lúc exit vì stdout là ống dẫn (gdb bt); __libc_write đặt 64, svc #0 sập bẫy (objdump); thanh ghi x8/x0–x2 ngay lúc bẫy và x0 khi về; quy ước gọi arm64 vs x86-64; phía nhân el0_svc → bảng syscall → __arm64_sys_write → vfs_write → write_null (ftrace); -2 thành -1 + errno; Node/Python/Java cùng kết thúc ở write(1, …).',
      content: `${G111}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>One printf, followed all the way into the kernel</h2>
<p class="lead">Your program cannot touch a disk, a socket or even the terminal. It can only <em>ask</em> the kernel. <a href="${OS('os-1-3-che-do')}">Lesson 1.3</a> showed that the request — a system call — is a guarded door that costs about 180 ns. This lesson walks through the door with one tiny C program and answers a precise question: <strong>between your <code>printf("hi")</code> and the bytes arriving, which code runs, which number is sent, in which register, through which instruction, to which kernel function — and how does an error come back?</strong> Every step is measured, not drawn from memory. (If you studied OSG202, this is <a href="${OSG('osg202-1-4-syscall-kien-truc')}">lesson 1.4 "the path of a read()"</a>, done on a real machine.)</p>

<h3>Step 0 — everything a hello-world asks the kernel</h3>
<p>We compile the smallest possible C program <em>statically</em> (no shared libraries to load, so the trace is short) and run it under <code>strace</code>, which prints each system call with its arguments and result:</p>
${run('c111-hanh-trinh', 'cat hello.c', 3)}
<p>Sixteen requests to print one line. Read them in groups: <code>execve</code> starts the program; <code>brk</code>, <code>madvise</code> and <code>mprotect</code> set up the heap and lock the relocated data read-only; <code>set_tid_address</code>, <code>set_robust_list</code> and <code>rseq</code> are thread bookkeeping that glibc does even for a single thread; <code>prlimit64</code> reads the stack limit; <code>getrandom</code> fetches 8 random bytes for the stack canary (<a href="${OS('os-13-2-overflow')}">lesson 13.2</a>). Then the two that matter: <strong><code>fstat(1, …S_IFIFO…)</code></strong> — "is stdout a terminal or a pipe?" — and the single <code>write(1, "hi from C\\n", 10)</code>. The text appears in the middle of the trace line because strace prints the call before the result and the program's stdout shares the screen.</p>

<h3>Step 1 — printf became puts, and puts did not write yet</h3>
${run('c111-hanh-trinh', 'nm hello-static')}
<p>There is no <code>printf</code> in the binary: gcc saw a format string without <code>%</code> and called <code>puts</code> instead. And <code>puts</code> does not call the kernel either — it copies the text into a stdio buffer. When does the write happen? gdb can stop the program exactly at a system call (<code>catch syscall write</code>) and print the call stack:</p>
${run('c111-hanh-trinh', "gdb -q -batch -ex 'catch syscall write'", 1, { max: 16 })}
<p>Read the stack from the bottom: <code>_start</code> → <code>main</code> returned → <code>exit()</code> → <code>__run_exit_handlers</code> → <code>_IO_cleanup</code> → <code>_IO_flush_all</code> → … → <code>__internal_syscall_cancel</code>. The write happened <strong>inside exit()</strong>, while libc flushed its buffers. That is the <code>fstat</code> from step 0 at work: stdout was a pipe, so glibc chose <em>full buffering</em> (a 4 KiB buffer, flushed when full or at exit) instead of line buffering. On a terminal the same program writes immediately. You met this behaviour in <a href="${OS('os-1-2-fork-exec')}">lesson 1.2</a> (output printed twice after fork); here you see the exact function that finally calls the kernel.</p>

<div class="pitfall co-tieu-de">
<p><strong>"My container prints nothing, then dies — and the last log lines are gone."</strong> In Docker, systemd or behind <code>| tee</code>, stdout is a pipe, so C stdio and Python buffer it. If the process is killed (OOM 137, SIGKILL on <code>docker stop</code> timeout, a segfault), the buffer dies with it: the lines your program "printed" never reached the kernel. This is why so many Python Dockerfiles set <code>PYTHONUNBUFFERED=1</code>. Flush what must survive (<code>fflush</code>, <code>setvbuf(stdout, NULL, _IOLBF, 0)</code>, <code>python -u</code>, log errors to stderr which is unbuffered) and verify with <code>strace -e trace=write</code>: you should see one write per line.</p>
</div>

<h3>Step 2 — the wrapper puts a number in a register</h3>
${run('c111-hanh-trinh', "objdump -d --no-show-raw-insn hello-static | awk '/<__libc_write>:/")}
<p><code>__libc_write</code> is glibc's <code>write()</code>. Its key instruction is <code>mov x6, #0x40</code>: <strong>0x40 = 64 is the system call number of write on arm64</strong>. It then jumps to <code>__syscall_cancel</code>, a layer glibc 2.43 puts around every "cancellable" call (one a thread can be cancelled in, see <code>pthread_cancel</code>). The real door is a few instructions further:</p>
${run('c111-hanh-trinh', "objdump -d --no-show-raw-insn hello-static | awk '/<__internal_syscall_cancel>:/")}
<p><code>mov x8, x6</code> moves the number into register <strong>x8</strong>, and <strong><code>svc #0</code></strong> — "supervisor call" — is the one instruction that switches the CPU from user mode (EL0) to kernel mode (EL1) and jumps to the kernel's entry point. Everything before it is ordinary code you could have written yourself (lesson 11.2 does). The numbers come from a header file, one per syscall:</p>
${run('c111-hanh-trinh', 'grep -wE')}

<h3>Step 3 — the registers at the moment of the trap</h3>
<p>The same gdb session, after the stop: the registers and the instruction we stopped on.</p>
${run('c111-hanh-trinh', "gdb -q -batch -ex 'catch syscall write'", 1, { drop: /^(#|Catchpoint|$)/ })}
<p>This is the whole request: <code>x8 = 64</code> (which service), <code>x0 = 1</code> (fd 1, stdout), <code>x1</code> = the address of our bytes (gdb prints the string sitting there), <code>x2 = 10</code> (how many). The arrow shows we stopped just after <code>svc #0</code>. One <code>stepi</code> later the kernel has done the work and <strong>replaced x0 with the result</strong>: 10 bytes written. Arguments go in, the answer comes back in the same register. That is the system call <strong>calling convention</strong> (ABI), and every architecture has one:</p>
<table>
<tr><th></th><th>arm64 (this lab, Apple Silicon, AWS Graviton)</th><th>x86-64 (most servers)</th></tr>
<tr><td>instruction</td><td><code>svc #0</code></td><td><code>syscall</code></td></tr>
<tr><td>syscall number in</td><td><code>x8</code></td><td><code>rax</code></td></tr>
<tr><td>arguments 1–6</td><td><code>x0 x1 x2 x3 x4 x5</code></td><td><code>rdi rsi rdx r10 r8 r9</code></td></tr>
<tr><td>return value</td><td><code>x0</code></td><td><code>rax</code></td></tr>
<tr><td>destroyed by the instruction</td><td>—</td><td><code>rcx</code>, <code>r11</code> (the CPU saves the return address and flags there)</td></tr>
<tr><td>number of <code>write</code></td><td>64</td><td>1</td></tr>
</table>
<p>(From <code>man 2 syscall</code>; we run only the arm64 column in this lab.) The numbers differ between architectures and some calls exist on only one — x86-64 still has <code>open</code> and <code>fork</code>, arm64 only <code>openat</code> and <code>clone</code>. Never hard-code a number; use <code>SYS_write</code> from the headers.</p>
${lab('syscall', 'write', 'en', 'The whole journey of one write(): the stdio buffer, the wrapper loading x8 = 64, svc #0, the kernel entry, the syscall table, the driver and the way back — with a cost counter adding up the nanoseconds. Switch arm64/x86-64 and the target (/dev/null, a file, TCP).', { tour: 'syscall-journey' })}
${lab('latency', 'default', 'en', 'Put the measured round trip on the ladder: a system call (~0.18 µs here) sits between a RAM access (~0.1 µs) and an SSD read (~50 µs) — about 100× a function call.', { tour: 'latency-start' })}

<h3>Step 4 — inside the kernel</h3>
<p>strace and gdb stand outside the door. To look behind it we use <strong>ftrace</strong>, the kernel's built-in function tracer, enabled for <em>one</em> process — a small program that switches tracing on for itself, writes 3 bytes to <code>/dev/null</code>, and switches it off. Tracing is a kernel-wide setting, so this runs only in a throwaway <code>--privileged</code> container, and the script resets it at the end:</p>
${src('ch11/ktrace.c', 'c')}
${run('c111-kernel', 'gcc -O2 ktrace.c')}
${run('c111-kernel', 'awk')}
<p>Each line is "function &lt;- its caller". After <code>svc</code>, the CPU lands in the kernel's exception vector and <code>el0_svc</code> ("a supervisor call from EL0") saves your registers; <code>invoke_syscall</code> reads x8 and calls entry 64 of the <strong>system call table</strong> — an array of function pointers — which is <code>__arm64_sys_write</code>. That unpacks the registers into C arguments (<code>ksys_write</code>), finds the open file for fd 1 (<code>fdget_pos</code>), and calls <code>vfs_write</code>, the generic layer of <a href="${OS('os-9-1-inode')}">lesson 9.1</a>. <code>rw_verify_area</code> and <code>security_file_permission</code> are the last checks — that hook is where AppArmor, SELinux or a BPF security module can still refuse — and finally <code>write_null</code>, the <strong>driver</strong> of <code>/dev/null</code>, which accepts the bytes and returns 3. For a file the chain would continue into ext4 and the page cache; for a socket, into TCP. The names of all handlers are visible to anyone:</p>
${run('c111-hanh-trinh', "grep -E ' (el0_svc")}
${run('c111-hanh-trinh', "grep -c ' __arm64_sys_'")}
<p>434 <code>__arm64_sys_*</code> symbols on this 7.0 kernel (some are aliases and compatibility entries; the table itself is indexed 0…~460). The addresses print as zeros because the kernel hides them from unprivileged readers (<code>kptr_restrict</code>) — knowing where kernel code lives would help an attacker.</p>

<h3>Step 5 — the way back: return value and errno</h3>
<p>What does a failure look like on this path? A program opens a file that does not exist:</p>
${src('ch11/fail.c', 'c')}
${run('c111-hanh-trinh', 'gcc -O2 -static fail.c', 2)}
<p>The program sees <code>-1</code> and <code>errno = 2</code>; strace shows <code>-1 ENOENT</code>. But neither is what the kernel actually returned. Stop at the syscall again and read x0 when it comes back:</p>
${run('c111-hanh-trinh', "gdb -q -batch -ex 'catch syscall openat'")}
<p>The kernel returned <strong>-2</strong> in x0 — a negative error number. That is the kernel's convention: success is ≥ 0, failure is <code>-errno</code> (values −4095…−1). The libc wrapper checks for that range, stores <code>2</code> in the thread-local variable <code>errno</code> and returns <code>-1</code> — the C convention. strace decodes the raw value for you (<code>ENOENT</code>, "No such file or directory"). Lesson 11.5 lists the errno values a backend developer meets and the two that are not errors at all (<code>EINTR</code>, <code>EAGAIN</code>).</p>
${lab('syscall', 'fail', 'en', 'The failure path: openat of a missing file returns −2 in x0, the wrapper turns it into −1 with errno = 2, strace prints ENOENT. Then open /etc/hostname instead and get fd 3.', { tour: 'syscall-errno' })}

<div class="pitfall co-tieu-de">
<p><strong>Reading errno after a call that succeeded — or too late.</strong> <code>errno</code> is only meaningful right after a call returned −1. Successful calls are allowed to leave garbage in it, and any call in between (a <code>printf</code>, a log line, <code>free</code>) can overwrite it. Check the return value first, then copy <code>errno</code> into a local variable immediately — exactly what <code>fail.c</code> would need if it logged something before printing. Higher-level languages do this for you: Node puts it in <code>err.code</code> (<code>'ENOENT'</code>), Python in <code>e.errno</code> on an <code>OSError</code>, Java in the exception message.</p>
</div>

<h3>Every runtime ends at the same door</h3>
${run('c111-hanh-trinh', "strace -f -qq -e trace=write -e signal=none -o node.txt")}
${run('c111-hanh-trinh', "strace -f -qq -e trace=write -e signal=none python3")}
${run('c111-hanh-trinh', "strace -f -qq -e trace=write -e signal=none -o java.txt")}
<p><code>console.log</code>, <code>print</code> and <code>System.out.println</code> travel through V8 and libuv, the CPython interpreter, or the JVM and its native <code>libjava</code> — and all end in the same <code>write(1, "…", n)</code>. The number in front of the Node and Java lines is the <strong>thread id</strong> (strace <code>-f</code> follows all threads): the Java launcher runs your <code>main()</code> on a new thread, not on the process's first one. The syscall layer is the one interface every language on Linux shares — which is why <code>strace</code> works on all of them, and why the rest of this chapter applies to whatever stack you use.</p>
${lab('process', 'shell', 'en', 'Every arrow in this animation is a system call: the shell calls clone (fork), the child calls execve, the parent waits in wait4 — the same doors you just traced.', { tour: 'process-shell' })}

<h3>🧪 Practice (25–30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a teammate's C worker runs in Docker. <code>docker logs</code> shows nothing for minutes, and when the container is killed by its memory limit the last progress lines are missing. They ask whether "the logs are broken".</p>
<ol>
<li>Compile <code>hello.c</code> statically in the lab and run <code>strace ./hello-static</code> twice: once as is, once as <code>strace ./hello-static | cat</code>. Compare the <code>fstat(1, …)</code> line (character device vs <code>S_IFIFO</code>).</li>
<li>Write a loop that prints a line every 0.2 s for 2 s. Run <code>strace -e trace=write ./loop | cat</code>: how many <code>write</code> calls, and when?</li>
<li>Use <code>gdb -batch -ex 'catch syscall write' -ex run -ex bt</code> to show which function finally writes.</li>
<li>Fix it with <code>setvbuf(stdout, NULL, _IOLBF, 0)</code> (or <code>fflush</code>) and run the strace again. Bonus: do the same with a Python script, with and without <code>PYTHONUNBUFFERED=1</code>.</li>
</ol>
<p><strong>Done when:</strong> you can show one write at the end before the fix and one write per line after it, and explain to your teammate in two sentences why a pipe changed the behaviour and why a SIGKILL loses buffered lines.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['system call number', 'The index that selects the kernel service (write = 64 on arm64, 1 on x86-64); passed in x8 / rax.'],
  ['svc #0 / syscall', 'The instruction that traps from user mode into the kernel entry point (arm64 / x86-64).'],
  ['calling convention (ABI)', 'Which registers carry the number, the six arguments and the result; fixed per architecture.'],
  ['libc wrapper', 'The C library function (write, open…) that loads the registers, executes the trap and converts errors.'],
  ['sys_call_table', 'The kernel array of function pointers indexed by the syscall number; an unknown number returns ENOSYS.'],
  ['handler', 'The kernel function behind one number (__arm64_sys_write); it reaches the VFS and finally a driver.'],
  ['-errno / errno', 'The kernel returns −2 for ENOENT; libc stores 2 in the thread-local errno and returns −1.'],
  ['ftrace', 'The kernel’s built-in function tracer (/sys/kernel/tracing); shows which kernel functions a call runs.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Your code never does I/O itself: it puts a <strong>number</strong> and up to six arguments in registers and executes one trapping instruction (<code>svc #0</code> / <code>syscall</code>).</li>
<li>libc sits in between: <code>printf</code> → stdio buffer → <code>__libc_write</code> → the trap. Buffering decides <em>when</em> that happens — at exit, if stdout is a pipe.</li>
<li>In the kernel: entry code saves your registers, <code>sys_call_table[number]</code> picks the handler, which goes through the VFS and security hooks to a driver.</li>
<li>The kernel returns a count or <code>-errno</code>; libc turns failures into <code>-1</code> + <code>errno</code>, and higher-level languages into error codes and exceptions.</li>
<li>Tools for each layer: <code>strace</code> (the calls), <code>nm</code>/<code>objdump</code> (the wrapper), <code>gdb catch syscall</code> (the registers), ftrace (the kernel side).</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/syscall.2.html', '📄', 'man 2 syscall', 'The instruction, registers and return convention of every architecture.', 'Open')}
${L('https://docs.kernel.org/trace/ftrace.html', '📄', 'ftrace — Function Tracer (kernel.org)', 'How the function tracer and set_ftrace_pid work.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Một lệnh printf, theo chân vào tận nhân</h2>
<p class="lead">Chương trình của bạn không chạm được vào đĩa, socket hay cả cái terminal. Nó chỉ có thể <em>xin</em> nhân. <a href="${OS('os-1-3-che-do')}">Bài 1.3</a> cho thấy lời xin đó — một lời gọi hệ thống — là một cánh cửa có người gác, tốn khoảng 180 ns. Bài này đi qua cánh cửa ấy với một chương trình C tí hon và trả lời một câu hỏi chính xác: <strong>giữa <code>printf("hi")</code> của bạn và lúc các byte tới nơi, đoạn mã nào chạy, con số nào được gửi, nằm trong thanh ghi nào, qua lệnh máy nào, tới hàm nào của nhân — và một lỗi quay về ra sao?</strong> Mọi bước đều được đo, không vẽ theo trí nhớ. (Nếu đã học OSG202, đây chính là <a href="${OSG('osg202-1-4-syscall-kien-truc')}">bài 1.4 "đường đi của một read()"</a>, làm trên máy thật.)</p>

<h3>Bước 0 — mọi thứ một hello-world xin nhân</h3>
<p>Ta biên dịch chương trình C nhỏ nhất có thể ở dạng <em>tĩnh</em> (không phải nạp thư viện dùng chung, nên dấu vết ngắn) rồi chạy dưới <code>strace</code>, công cụ in từng lời gọi hệ thống kèm đối số và kết quả:</p>
${run('c111-hanh-trinh', 'cat hello.c', 3)}
<p>Mười sáu yêu cầu để in một dòng. Đọc theo nhóm: <code>execve</code> khởi động chương trình; <code>brk</code>, <code>madvise</code> và <code>mprotect</code> dựng heap và khoá vùng dữ liệu đã định vị lại thành chỉ-đọc; <code>set_tid_address</code>, <code>set_robust_list</code> và <code>rseq</code> là sổ sách luồng mà glibc làm cả khi chỉ có một luồng; <code>prlimit64</code> đọc giới hạn stack; <code>getrandom</code> lấy 8 byte ngẫu nhiên cho stack canary (<a href="${OS('os-13-2-overflow')}">bài 13.2</a>). Rồi tới hai cái quan trọng: <strong><code>fstat(1, …S_IFIFO…)</code></strong> — "stdout là terminal hay ống dẫn?" — và đúng một <code>write(1, "hi from C\\n", 10)</code>. Dòng chữ hiện ra giữa dòng strace vì strace in lời gọi trước rồi mới in kết quả, còn stdout của chương trình dùng chung màn hình.</p>

<h3>Bước 1 — printf hoá thành puts, và puts chưa hề ghi</h3>
${run('c111-hanh-trinh', 'nm hello-static')}
<p>Trong tệp nhị phân không có <code>printf</code>: gcc thấy chuỗi định dạng không có <code>%</code> nên gọi <code>puts</code> thay vào. Và <code>puts</code> cũng không gọi nhân — nó chép chữ vào một bộ đệm stdio. Vậy lúc nào mới write? gdb dừng được chương trình đúng lúc một lời gọi hệ thống (<code>catch syscall write</code>) và in ngăn xếp lời gọi:</p>
${run('c111-hanh-trinh', "gdb -q -batch -ex 'catch syscall write'", 1, { max: 16 })}
<p>Đọc ngăn xếp từ dưới lên: <code>_start</code> → <code>main</code> đã trả về → <code>exit()</code> → <code>__run_exit_handlers</code> → <code>_IO_cleanup</code> → <code>_IO_flush_all</code> → … → <code>__internal_syscall_cancel</code>. Lần write xảy ra <strong>bên trong exit()</strong>, lúc libc xả bộ đệm. Đó là tác dụng của <code>fstat</code> ở bước 0: stdout là ống dẫn, nên glibc chọn <em>đệm đầy</em> (bộ đệm 4 KiB, xả khi đầy hoặc lúc thoát) thay vì đệm theo dòng. Trên terminal, cùng chương trình đó ghi ngay. Bạn đã gặp hành vi này ở <a href="${OS('os-1-2-fork-exec')}">bài 1.2</a> (chữ in hai lần sau fork); ở đây bạn thấy đúng hàm cuối cùng gọi nhân.</p>

<div class="pitfall co-tieu-de">
<p><strong>"Container của tôi không in gì, rồi chết — và mấy dòng log cuối biến mất."</strong> Trong Docker, systemd hay sau <code>| tee</code>, stdout là ống dẫn, nên stdio của C và Python đều đệm. Nếu tiến trình bị giết (OOM 137, SIGKILL khi <code>docker stop</code> quá hạn, segfault), bộ đệm chết theo: những dòng chương trình "đã in" chưa từng tới được nhân. Đó là lý do rất nhiều Dockerfile Python đặt <code>PYTHONUNBUFFERED=1</code>. Hãy xả những gì phải còn lại (<code>fflush</code>, <code>setvbuf(stdout, NULL, _IOLBF, 0)</code>, <code>python -u</code>, ghi lỗi ra stderr vốn không đệm) và kiểm bằng <code>strace -e trace=write</code>: phải thấy mỗi dòng một write.</p>
</div>

<h3>Bước 2 — hàm bọc đặt một con số vào thanh ghi</h3>
${run('c111-hanh-trinh', "objdump -d --no-show-raw-insn hello-static | awk '/<__libc_write>:/")}
<p><code>__libc_write</code> chính là <code>write()</code> của glibc. Lệnh then chốt là <code>mov x6, #0x40</code>: <strong>0x40 = 64 là số hiệu lời gọi hệ thống của write trên arm64</strong>. Sau đó nó nhảy sang <code>__syscall_cancel</code>, một lớp glibc 2.43 bọc quanh mọi lời gọi "hủy được" (lời gọi mà một luồng có thể bị hủy giữa chừng, xem <code>pthread_cancel</code>). Cánh cửa thật nằm vài lệnh sau:</p>
${run('c111-hanh-trinh', "objdump -d --no-show-raw-insn hello-static | awk '/<__internal_syscall_cancel>:/")}
<p><code>mov x8, x6</code> chuyển con số vào thanh ghi <strong>x8</strong>, và <strong><code>svc #0</code></strong> — "supervisor call" — là lệnh máy duy nhất chuyển CPU từ chế độ người dùng (EL0) sang chế độ nhân (EL1) và nhảy tới điểm vào của nhân. Mọi thứ trước nó là mã bình thường bạn tự viết được (bài 11.2 sẽ làm). Các con số lấy từ một tệp tiêu đề, mỗi syscall một số:</p>
${run('c111-hanh-trinh', 'grep -wE')}

<h3>Bước 3 — các thanh ghi đúng lúc sập bẫy</h3>
<p>Vẫn phiên gdb đó, sau khi dừng: các thanh ghi và lệnh máy nơi ta dừng.</p>
${run('c111-hanh-trinh', "gdb -q -batch -ex 'catch syscall write'", 1, { drop: /^(#|Catchpoint|$)/ })}
<p>Đây là toàn bộ lời xin: <code>x8 = 64</code> (dịch vụ nào), <code>x0 = 1</code> (fd 1, stdout), <code>x1</code> = địa chỉ các byte của ta (gdb in chuỗi nằm ở đó), <code>x2 = 10</code> (bao nhiêu byte). Mũi tên cho thấy ta dừng ngay sau <code>svc #0</code>. Một <code>stepi</code> sau, nhân đã làm xong và <strong>thay x0 bằng kết quả</strong>: đã ghi 10 byte. Đối số đi vào, câu trả lời về trong cùng thanh ghi. Đó là <strong>quy ước gọi</strong> (ABI) của lời gọi hệ thống, và kiến trúc nào cũng có một bản:</p>
<table>
<tr><th></th><th>arm64 (lab này, Apple Silicon, AWS Graviton)</th><th>x86-64 (phần lớn máy chủ)</th></tr>
<tr><td>lệnh máy</td><td><code>svc #0</code></td><td><code>syscall</code></td></tr>
<tr><td>số hiệu syscall nằm ở</td><td><code>x8</code></td><td><code>rax</code></td></tr>
<tr><td>đối số 1–6</td><td><code>x0 x1 x2 x3 x4 x5</code></td><td><code>rdi rsi rdx r10 r8 r9</code></td></tr>
<tr><td>giá trị trả về</td><td><code>x0</code></td><td><code>rax</code></td></tr>
<tr><td>bị lệnh ghi đè</td><td>—</td><td><code>rcx</code>, <code>r11</code> (CPU cất địa chỉ quay về và cờ vào đó)</td></tr>
<tr><td>số hiệu của <code>write</code></td><td>64</td><td>1</td></tr>
</table>
<p>(Theo <code>man 2 syscall</code>; lab này chỉ chạy cột arm64.) Số hiệu khác nhau giữa các kiến trúc và có lời gọi chỉ có ở một bên — x86-64 vẫn còn <code>open</code> và <code>fork</code>, arm64 chỉ có <code>openat</code> và <code>clone</code>. Đừng bao giờ viết cứng con số; dùng <code>SYS_write</code> từ tệp tiêu đề.</p>
${lab('syscall', 'write', 'vi', 'Trọn hành trình của một write(): bộ đệm stdio, wrapper nạp x8 = 64, svc #0, cửa vào nhân, bảng syscall, driver và đường quay về — kèm bộ đếm giá cộng dồn từng nano giây. Đổi arm64/x86-64 và đích ghi (/dev/null, file, TCP).', { tour: 'syscall-journey' })}
${lab('latency', 'default', 'vi', 'Đặt vòng đi-về vừa đo lên thang: một lời gọi hệ thống (~0,18 µs ở đây) nằm giữa một lần đọc RAM (~0,1 µs) và một lần đọc SSD (~50 µs) — khoảng 100 lần một lời gọi hàm.', { tour: 'latency-start' })}

<h3>Bước 4 — bên trong nhân</h3>
<p>strace và gdb đứng ngoài cửa. Để nhìn ra sau cửa ta dùng <strong>ftrace</strong>, bộ dò hàm có sẵn trong nhân, bật cho <em>một</em> tiến trình — một chương trình nhỏ tự bật dò cho chính nó, ghi 3 byte vào <code>/dev/null</code>, rồi tắt. Việc dò là thiết lập của cả nhân, nên nó chỉ chạy trong một container vứt đi <code>--privileged</code>, và kịch bản trả thiết lập về như cũ ở cuối:</p>
${src('ch11/ktrace.c', 'c')}
${run('c111-kernel', 'gcc -O2 ktrace.c')}
${run('c111-kernel', 'awk')}
<p>Mỗi dòng là "hàm &lt;- hàm gọi nó". Sau <code>svc</code>, CPU rơi vào bảng vector ngoại lệ của nhân và <code>el0_svc</code> ("một supervisor call đến từ EL0") cất các thanh ghi của bạn; <code>invoke_syscall</code> đọc x8 và gọi ô 64 của <strong>bảng lời gọi hệ thống</strong> — một mảng con trỏ hàm — tức <code>__arm64_sys_write</code>. Hàm này tháo thanh ghi thành đối số C (<code>ksys_write</code>), tìm file đang mở ứng với fd 1 (<code>fdget_pos</code>), rồi gọi <code>vfs_write</code>, tầng chung của <a href="${OS('os-9-1-inode')}">bài 9.1</a>. <code>rw_verify_area</code> và <code>security_file_permission</code> là các bước kiểm cuối — cái móc đó là nơi AppArmor, SELinux hay một mô-đun bảo mật BPF vẫn còn có thể từ chối — và cuối cùng là <code>write_null</code>, <strong>driver</strong> của <code>/dev/null</code>, nhận các byte và trả về 3. Với một file, chuỗi sẽ đi tiếp vào ext4 và page cache; với một socket, vào TCP. Tên của mọi hàm xử lý ai cũng xem được:</p>
${run('c111-hanh-trinh', "grep -E ' (el0_svc")}
${run('c111-hanh-trinh', "grep -c ' __arm64_sys_'")}
<p>434 ký hiệu <code>__arm64_sys_*</code> trên nhân 7.0 này (có cái là bí danh và ô tương thích; bảng thật đánh số 0…~460). Địa chỉ in ra toàn số 0 vì nhân giấu chúng với người đọc không có đặc quyền (<code>kptr_restrict</code>) — biết mã nhân nằm ở đâu sẽ giúp kẻ tấn công.</p>

<h3>Bước 5 — đường về: giá trị trả về và errno</h3>
<p>Một lần thất bại trông thế nào trên con đường này? Một chương trình mở file không tồn tại:</p>
${src('ch11/fail.c', 'c')}
${run('c111-hanh-trinh', 'gcc -O2 -static fail.c', 2)}
<p>Chương trình thấy <code>-1</code> và <code>errno = 2</code>; strace hiện <code>-1 ENOENT</code>. Nhưng cả hai đều không phải thứ nhân thật sự trả về. Dừng ở lời gọi lần nữa và đọc x0 lúc nó quay về:</p>
${run('c111-hanh-trinh', "gdb -q -batch -ex 'catch syscall openat'")}
<p>Nhân trả <strong>-2</strong> trong x0 — một số lỗi âm. Đó là quy ước của nhân: thành công là ≥ 0, thất bại là <code>-errno</code> (giá trị −4095…−1). Hàm bọc của libc kiểm khoảng đó, cất <code>2</code> vào biến <code>errno</code> riêng của từng luồng và trả <code>-1</code> — quy ước của C. strace giải mã giá trị thô giùm bạn (<code>ENOENT</code>, "No such file or directory"). Bài 11.5 liệt kê các giá trị errno một lập trình viên backend hay gặp, và hai cái hoàn toàn không phải lỗi (<code>EINTR</code>, <code>EAGAIN</code>).</p>
${lab('syscall', 'fail', 'vi', 'Đường thất bại: openat một file không tồn tại trả −2 trong x0, wrapper đổi thành −1 kèm errno = 2, strace in ENOENT. Rồi mở /etc/hostname thay vào và nhận fd 3.', { tour: 'syscall-errno' })}

<div class="pitfall co-tieu-de">
<p><strong>Đọc errno sau một lời gọi thành công — hoặc đọc quá muộn.</strong> <code>errno</code> chỉ có nghĩa ngay sau khi một lời gọi trả −1. Lời gọi thành công được phép để rác trong đó, và bất kỳ lời gọi nào chen giữa (một <code>printf</code>, một dòng log, <code>free</code>) đều có thể ghi đè nó. Hãy kiểm giá trị trả về trước, rồi chép <code>errno</code> ra biến cục bộ ngay lập tức — đúng thứ <code>fail.c</code> cần nếu nó ghi log trước khi in. Ngôn ngữ cấp cao làm giùm bạn: Node đặt nó vào <code>err.code</code> (<code>'ENOENT'</code>), Python vào <code>e.errno</code> của một <code>OSError</code>, Java vào thông điệp ngoại lệ.</p>
</div>

<h3>Trình chạy nào cũng kết thúc ở cùng một cánh cửa</h3>
${run('c111-hanh-trinh', "strace -f -qq -e trace=write -e signal=none -o node.txt")}
${run('c111-hanh-trinh', "strace -f -qq -e trace=write -e signal=none python3")}
${run('c111-hanh-trinh', "strace -f -qq -e trace=write -e signal=none -o java.txt")}
<p><code>console.log</code>, <code>print</code> và <code>System.out.println</code> đi qua V8 và libuv, trình thông dịch CPython, hay JVM và <code>libjava</code> gốc của nó — và đều kết thúc ở cùng một <code>write(1, "…", n)</code>. Con số trước dòng Node và Java là <strong>mã luồng</strong> (strace <code>-f</code> theo mọi luồng): trình khởi chạy Java cho <code>main()</code> của bạn chạy trên một luồng mới, không phải luồng đầu tiên của tiến trình. Tầng lời gọi hệ thống là giao diện duy nhất mọi ngôn ngữ trên Linux dùng chung — vì thế <code>strace</code> dùng được cho tất cả, và phần còn lại của chương áp dụng cho stack nào bạn đang dùng.</p>
${lab('process', 'shell', 'vi', 'Mỗi mũi tên trong hoạt cảnh này là một lời gọi hệ thống: shell gọi clone (fork), con gọi execve, cha chờ trong wait4 — chính những cánh cửa bạn vừa dò.', { tour: 'process-shell' })}

<h3>🧪 Thực hành (25–30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> worker C của một bạn trong nhóm chạy trong Docker. <code>docker logs</code> không hiện gì suốt mấy phút, và khi container bị giới hạn bộ nhớ giết thì mấy dòng tiến độ cuối cùng mất tăm. Bạn ấy hỏi có phải "log bị hỏng".</p>
<ol>
<li>Biên dịch <code>hello.c</code> dạng tĩnh trong lab và chạy <code>strace ./hello-static</code> hai lần: một lần nguyên, một lần <code>strace ./hello-static | cat</code>. So dòng <code>fstat(1, …)</code> (thiết bị ký tự vs <code>S_IFIFO</code>).</li>
<li>Viết một vòng lặp in một dòng mỗi 0,2 s trong 2 s. Chạy <code>strace -e trace=write ./loop | cat</code>: bao nhiêu lời gọi <code>write</code>, và vào lúc nào?</li>
<li>Dùng <code>gdb -batch -ex 'catch syscall write' -ex run -ex bt</code> để chỉ ra hàm nào cuối cùng mới ghi.</li>
<li>Sửa bằng <code>setvbuf(stdout, NULL, _IOLBF, 0)</code> (hoặc <code>fflush</code>) rồi chạy lại strace. Thêm: làm y vậy với một script Python, có và không có <code>PYTHONUNBUFFERED=1</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn cho thấy được một lần write ở cuối trước khi sửa và mỗi dòng một write sau khi sửa, và giải thích cho bạn cùng nhóm trong hai câu vì sao một ống dẫn đổi hành vi và vì sao SIGKILL làm mất các dòng đang đệm.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['system call number (số hiệu lời gọi hệ thống)', 'Chỉ số chọn dịch vụ của nhân (write = 64 trên arm64, 1 trên x86-64); truyền qua x8 / rax.'],
  ['svc #0 / syscall', 'Lệnh máy sập bẫy từ chế độ người dùng vào điểm vào của nhân (arm64 / x86-64).'],
  ['calling convention / ABI (quy ước gọi)', 'Thanh ghi nào chở con số, sáu đối số và kết quả; cố định theo từng kiến trúc.'],
  ['libc wrapper (hàm bọc của libc)', 'Hàm của thư viện C (write, open…) nạp thanh ghi, chạy lệnh bẫy và đổi lỗi.'],
  ['sys_call_table (bảng lời gọi hệ thống)', 'Mảng con trỏ hàm trong nhân, đánh chỉ số bằng số hiệu syscall; số lạ trả ENOSYS.'],
  ['handler (hàm xử lý)', 'Hàm của nhân đứng sau một con số (__arm64_sys_write); nó đi qua VFS và tới một driver.'],
  ['-errno / errno', 'Nhân trả −2 cho ENOENT; libc cất 2 vào errno riêng từng luồng và trả −1.'],
  ['ftrace', 'Bộ dò hàm có sẵn trong nhân (/sys/kernel/tracing); cho thấy một lời gọi chạy qua những hàm nào của nhân.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Code của bạn không tự làm I/O: nó đặt một <strong>con số</strong> và tối đa sáu đối số vào thanh ghi rồi chạy đúng một lệnh sập bẫy (<code>svc #0</code> / <code>syscall</code>).</li>
<li>libc nằm ở giữa: <code>printf</code> → bộ đệm stdio → <code>__libc_write</code> → cú bẫy. Cách đệm quyết định <em>khi nào</em> việc đó xảy ra — lúc thoát, nếu stdout là ống dẫn.</li>
<li>Trong nhân: mã cửa vào cất thanh ghi, <code>sys_call_table[số]</code> chọn hàm xử lý, hàm đó đi qua VFS và móc bảo mật tới một driver.</li>
<li>Nhân trả về một con số đếm hoặc <code>-errno</code>; libc đổi thất bại thành <code>-1</code> + <code>errno</code>, ngôn ngữ cấp cao đổi thành mã lỗi và ngoại lệ.</li>
<li>Mỗi tầng một công cụ: <code>strace</code> (các lời gọi), <code>nm</code>/<code>objdump</code> (hàm bọc), <code>gdb catch syscall</code> (thanh ghi), ftrace (phía nhân).</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/syscall.2.html', '📄', 'man 2 syscall', 'Lệnh máy, thanh ghi và quy ước trả về của từng kiến trúc.', 'Mở')}
${L('https://docs.kernel.org/trace/ftrace.html', '📄', 'ftrace — Function Tracer (kernel.org)', 'Bộ dò hàm và set_ftrace_pid hoạt động ra sao.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 11.2 — Syscall trần và cách runtime bọc syscall ───────────────────────── */
    {
      title: '11.2 — Below libc: raw syscalls, no-libc programs, and how Node, the JVM and Go reach the kernel|||11.2 — Dưới libc: syscall trần, chương trình không libc, Node/JVM/Go tới nhân',
      slug: 'os-11-3-raw',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bốn cách in cùng một dòng (printf, write, syscall(), svc #0 tự viết) — dòng printf tới sau cùng; ba quy ước lỗi (-1 + errno vs -9 trần); chương trình 1.632 byte không libc với _start; Node/libuv gọi glibc, file đi thread pool còn socket không chặn trên luồng chính; JVM qua libjava + 18 luồng; Go không libc, tự SVC trong Syscall6, 114 rt_sigaction — và vì sao chỉ trên Linux.',
      content: `${G112}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>Below libc: a raw system call, a program with no libc, and what runtimes do instead</h2>
<p class="lead">Lesson 11.1 showed that libc's <code>write()</code> is only a few instructions around <code>svc #0</code>. So can you skip libc and call the kernel yourself? Yes — and doing it once teaches what libc quietly does for you. This lesson answers two questions: <strong>what changes when you go below libc</strong> (buffering, errno, safety), and <strong>what Node, the JVM and Go put between your code and the kernel</strong> — because the answer explains why a Node server needs a thread pool, a JVM starts 18 threads to say hello, and a Go binary runs in an empty Docker image.</p>

<h3>Four ways down to the same write()</h3>
<p>One program prints four lines, each one level lower: stdio's <code>printf</code>, libc's <code>write()</code> wrapper, libc's generic <code>syscall()</code> (which takes any number — useful for calls libc has no wrapper for yet), and our own inline assembly that loads the registers and executes <code>svc #0</code>. Then it repeats the last three on an invalid descriptor, 99:</p>
${src('ch11/raw.c', 'c')}
${run('c112-raw', 'gcc -O2 -Wall raw.c')}
<p>Line 1 was printed first in the source and arrives <strong>last</strong>. Lines 2–4 trapped into the kernel the moment they ran; <code>printf</code> only copied its text into the stdio buffer, which <code>exit()</code> flushed because stdout is a pipe (lesson 11.1). The kernel itself cannot tell the four apart:</p>
${run('c112-raw', 'strace -qq -e trace=write ./raw')}
<p>Same number, same registers, same answer — whether the trap came from glibc or from three lines of asm. Notice the order again: strace shows the true order of the requests, which is not the order of the source lines.</p>

<h3>Same call, three error conventions</h3>
<p>Look at the <code>fd 99</code> line of the program's output: <code>write()</code> and <code>syscall()</code> both returned <strong>-1</strong> and set <code>errno = 9</code> (EBADF). Our raw call returned <strong>-9</strong> and left <code>errno</code> at 0. That is the kernel's real answer (−errno, lesson 11.1); the conversion to −1 + errno is pure libc code. Below libc nobody does it for you.</p>

<div class="pitfall co-tieu-de">
<p><strong>Checking a raw syscall for <code>== -1</code>.</strong> Code that wraps <code>svc</code>/<code>syscall</code> by hand (an embedded loader, a sandbox helper, a copy-pasted snippet) and then tests <code>if (r == -1) handle_error()</code> will treat −9, −13 or −28 as success — a write that silently failed with ENOSPC, a permission error ignored. Raw results are errors when they are in −4095…−1. The same trap exists one level up: <code>syscall()</code> <em>does</em> set errno, but only if you call libc's version, not a raw macro from some header.</p>
</div>

<h3>A program with no C library at all</h3>
<p>Take the last step: no libc, no <code>main()</code>, no startup code. The kernel's <code>execve</code> jumps to the ELF entry point, conventionally <code>_start</code>, and that function makes exactly two requests:</p>
${src('ch11/tiny.c', 'c')}
${run('c112-raw', 'gcc -O2 -static -nostdlib', 3)}
<p>1,632 bytes, against 711,936 for the static hello of lesson 11.1 — the difference is libc. strace shows the minimum life of a process: <code>execve</code>, our <code>write</code>, our <code>exit_group(7)</code>. None of the 13 setup calls from lesson 11.1 happened, because nothing asked for a heap, a thread descriptor or a stack canary. This is the level an OS course means by "a user program": a sequence of traps. Everything above — <code>main</code>, <code>printf</code>, <code>malloc</code>, <code>errno</code>, buffering — is library code you could, in principle, write yourself. (You will see the same <code>_start</code> and register conventions again when reading binaries in <a href="${OS('os-13-1-bo-nho')}">lesson 13.1</a>.)</p>

<h3>Node: libuv calls glibc, and waits in two different ways</h3>
<p>Nobody writes a backend in raw asm, so what do real runtimes do? Start with the one cuongthai.com's API runs on. The <code>node</code> binary does not issue syscalls itself; its libuv layer calls glibc wrappers:</p>
${run('c112-raw', 'objdump -T $(which node)')}
<p>The interesting part is <em>how</em> it uses them. This script reads a file and makes an HTTP request to itself:</p>
${src('ch11/uv.js', 'javascript')}
${run('c112-raw', 'strace -f -qq -e trace=openat,connect,accept4')}
<p>The first number is the main thread (1456). The file <code>/etc/hostname</code> was opened by <strong>thread 1466</strong> — a libuv worker, because regular files cannot be waited on with epoll, so libuv hands blocking file calls to its thread pool (4 threads by default, <code>UV_THREADPOOL_SIZE</code>). The sockets stayed on the main thread and were made <strong>non-blocking</strong>: <code>connect</code> returned <code>EINPROGRESS</code> ("started, not finished") instead of waiting, and <code>accept4</code> asked for <code>SOCK_NONBLOCK</code>. The loop then waits for all sockets at once in <code>epoll_pwait</code>. Two waiting strategies in one process — the core of Node's design, and of <a href="${OS('os-10-2-blocking')}">Chapter 10</a>.</p>
${lab('eventloop', 'pool', 'en', 'See both paths: fs, dns.lookup and crypto go to the libuv thread pool (4 threads by default), sockets wait in epoll on the main thread with no thread at all.')}

<h3>The JVM: native code over glibc, and many threads</h3>
${run('c112-raw', 'javac Hello.java', 2)}
<p>Java code reaches the kernel through native libraries of the JDK — <code>libjava.so</code>, <code>libnio.so</code>, <code>libnet.so</code> — which import <code>read</code> and <code>write</code> from glibc like any C program (JNI is the bridge from Java to that C code). What makes the JVM different is everything around your <code>main()</code>: a hello world starts 18 threads (garbage collector workers, JIT compilers, signal dispatcher, reference handler…):</p>
${run('c112-raw', 'strace -f -c -o jc.txt java Hello')}
<p>1,318 system calls for one line, most of the time in <code>futex</code> — threads waiting for each other during startup — and 281 <code>mmap</code> calls mapping the heap, the code cache and libraries. That is the warm-up cost <a href="${OS('os-1-3-che-do')}">lesson 1.3</a> counted; in a long-running Spring Boot service it is paid once. Java's virtual threads (Java 21) and NIO selectors use the same epoll mechanism as libuv — Chapter 10 compares them.</p>

<h3>Go: no libc at all</h3>
<p>Go was not in the lab image, so we downloaded the official Go 1.27.3 for linux/arm64 from go.dev (checksum verified) into a throwaway container:</p>
${run('c112-raw', 'go version', 3)}
<p>Built without cgo, the binary is <strong>static</strong> and links no libc. Its runtime contains its own syscall stub, written in Go's assembler:</p>
${run('c112-raw', 'go tool objdump -s')}
<p><code>MOVD 8(RSP), R8</code> loads the number into R8 (Go's name for x8) and <code>SVC $0</code> traps — the same two instructions as our <code>raw_write</code>. Every <code>os.File.Write</code>, <code>net.Conn.Read</code> and <code>time.Sleep</code> ends there, wrapped by <code>runtime.entersyscall</code>/<code>exitsyscall</code> so that, if a call blocks, the scheduler hands the logical processor to another OS thread and other goroutines keep running.</p>
${run('c112-raw', 'strace -f -qq -e trace=write -o go.txt ./hello-go')}
${run('c112-raw', 'strace -f -c -o goc.txt ./hello-go')}
<p>214 calls: 114 <code>rt_sigaction</code> (the runtime installs a handler for every signal — for preemption, crash reports and <code>os/signal</code>), a few <code>clone</code> for its threads, <code>sigaltstack</code> for signal stacks. Why does Go take this path? A static binary with no libc runs <code>FROM scratch</code> in Docker and never hits a glibc version mismatch; the runtime controls exactly how each call blocks. It can do this <strong>on Linux only</strong>, because Linux promises that the system call interface stays stable for user programs. macOS and OpenBSD do not make that promise, so Go goes through their libc there.</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> your team is choosing base images. The Go service is going into <code>FROM scratch</code>, and someone asks why the Node API "needs a whole Debian" while Go does not, and whether the Node API blocks on file reads.</p>
<ol>
<li>Compile <code>raw.c</code>, run it piped into <code>cat</code> and plain in a terminal. Explain the different order of line 1.</li>
<li>Add a raw <code>getpid</code> (number 172 on arm64, 39 on x86-64) next to <code>getpid()</code> and check with <code>strace</code> that both hit the same call.</li>
<li>Run <code>uv.js</code> under <code>strace -f</code> and identify which thread opened the file and which thread called <code>connect</code>.</li>
<li>Run <code>ldd</code> on <code>node</code>, on <code>java</code> and on a Go binary built with <code>CGO_ENABLED=0</code>. Write down which ones need glibc in the image.</li>
</ol>
<p><strong>Done when:</strong> you can show the two thread ids from step 3, the three <code>ldd</code> results, and explain in two sentences why Go can run from <code>scratch</code> and Node cannot.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['syscall(SYS_x, …)', 'libc’s generic wrapper: any syscall number, sets errno; used for calls without a dedicated wrapper.'],
  ['inline asm (asm volatile)', 'Assembly inside C; binding variables to x0–x8 lets you issue svc #0 yourself.'],
  ['_start / -nostdlib', 'The ELF entry point the kernel jumps to; without libc there is no main(), no errno, no buffering.'],
  ['libuv thread pool', 'Worker threads (default 4) that run blocking file, DNS and crypto calls for Node’s single JS thread.'],
  ['non-blocking socket', 'A socket where calls return EAGAIN/EINPROGRESS instead of waiting; readiness comes from epoll.'],
  ['JNI / native library', 'The C code (libjava, libnio) through which Java reaches glibc and the kernel.'],
  ['entersyscall / exitsyscall', 'Go runtime hooks around each syscall so a blocking call does not stall other goroutines.'],
  ['stable syscall ABI', 'Linux’s promise not to break user programs; it lets Go skip libc on Linux.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>printf, write(), syscall() and a hand-written <code>svc #0</code> all reach the same kernel call; only buffering and error handling differ.</li>
<li>The kernel always returns −errno; libc converts it to −1 + errno. Raw code must check the −4095…−1 range itself.</li>
<li>A program with no libc is 1,632 bytes and makes 2 syscalls — everything else is library code.</li>
<li>Node (libuv) and the JVM call glibc; Node sends file I/O to a thread pool and keeps sockets non-blocking on the main thread; a JVM hello starts 18 threads.</li>
<li>Go issues SVC itself, which makes static binaries possible — on Linux, thanks to its stable syscall interface.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/syscall.2.html', '📄', 'man 2 syscall', 'Calling a system call that has no wrapper, and every architecture’s convention.', 'Open')}
${L('https://docs.libuv.org/en/v1.x/design.html', '📄', 'libuv — Design overview', 'Why sockets use epoll and files use the thread pool.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Dưới libc: syscall trần, chương trình không libc, và các trình chạy làm gì thay bạn</h2>
<p class="lead">Bài 11.1 cho thấy <code>write()</code> của libc chỉ là vài lệnh máy quanh <code>svc #0</code>. Vậy có bỏ libc mà tự gọi nhân được không? Được — và làm một lần sẽ dạy bạn libc lặng lẽ làm gì giùm mình. Bài này trả lời hai câu hỏi: <strong>xuống dưới libc thì cái gì thay đổi</strong> (đệm, errno, an toàn), và <strong>Node, JVM và Go đặt gì giữa code của bạn và nhân</strong> — vì câu trả lời giải thích vì sao máy chủ Node cần thread pool, JVM khởi động 18 luồng chỉ để chào, còn tệp Go chạy được trong một image Docker rỗng.</p>

<h3>Bốn đường xuống cùng một write()</h3>
<p>Một chương trình in bốn dòng, mỗi dòng thấp hơn một bậc: <code>printf</code> của stdio, hàm bọc <code>write()</code> của libc, hàm <code>syscall()</code> chung của libc (nhận số hiệu bất kỳ — có ích cho những lời gọi libc chưa có hàm bọc), và assembly nội tuyến của chính ta nạp thanh ghi rồi chạy <code>svc #0</code>. Sau đó nó lặp lại ba cách cuối trên một descriptor sai, số 99:</p>
${src('ch11/raw.c', 'c')}
${run('c112-raw', 'gcc -O2 -Wall raw.c')}
<p>Dòng 1 được in đầu tiên trong mã nguồn nhưng tới <strong>cuối cùng</strong>. Dòng 2–4 sập bẫy vào nhân ngay lúc chạy; <code>printf</code> chỉ chép chữ vào bộ đệm stdio, bộ đệm được <code>exit()</code> xả vì stdout là ống dẫn (bài 11.1). Bản thân nhân không phân biệt được bốn cách:</p>
${run('c112-raw', 'strace -qq -e trace=write ./raw')}
<p>Cùng số hiệu, cùng thanh ghi, cùng câu trả lời — dù cú bẫy đến từ glibc hay từ ba dòng asm. Để ý thứ tự lần nữa: strace cho thấy thứ tự thật của các yêu cầu, không phải thứ tự các dòng mã nguồn.</p>

<h3>Cùng một lời gọi, ba quy ước lỗi</h3>
<p>Nhìn dòng <code>fd 99</code> trong output của chương trình: <code>write()</code> và <code>syscall()</code> đều trả <strong>-1</strong> và đặt <code>errno = 9</code> (EBADF). Lời gọi trần của ta trả <strong>-9</strong> và để <code>errno</code> bằng 0. Đó là câu trả lời thật của nhân (−errno, bài 11.1); việc đổi thành −1 + errno thuần là mã của libc. Dưới libc không ai làm hộ bạn.</p>

<div class="pitfall co-tieu-de">
<p><strong>Kiểm một syscall trần bằng <code>== -1</code>.</strong> Mã tự bọc <code>svc</code>/<code>syscall</code> (một bộ nạp nhúng, một hàm trợ giúp hộp cát, một đoạn chép từ đâu đó) rồi kiểm <code>if (r == -1) handle_error()</code> sẽ coi −9, −13 hay −28 là thành công — một lần ghi âm thầm hỏng vì ENOSPC, một lỗi quyền bị bỏ qua. Kết quả trần là lỗi khi nằm trong khoảng −4095…−1. Cái bẫy này còn ở một bậc cao hơn: <code>syscall()</code> <em>có</em> đặt errno, nhưng chỉ khi bạn gọi bản của libc, không phải một macro trần lấy từ tệp tiêu đề nào đó.</p>
</div>

<h3>Một chương trình không có thư viện C</h3>
<p>Bước cuối: không libc, không <code>main()</code>, không mã khởi động. <code>execve</code> của nhân nhảy tới điểm vào của ELF, quen gọi là <code>_start</code>, và hàm đó đưa ra đúng hai yêu cầu:</p>
${src('ch11/tiny.c', 'c')}
${run('c112-raw', 'gcc -O2 -static -nostdlib', 3)}
<p>1.632 byte, so với 711.936 của bản hello tĩnh ở bài 11.1 — phần chênh là libc. strace cho thấy đời sống tối thiểu của một tiến trình: <code>execve</code>, <code>write</code> của ta, <code>exit_group(7)</code> của ta. Không lời gọi nào trong 13 lời gọi chuẩn bị ở bài 11.1 xảy ra, vì chẳng ai xin heap, bộ mô tả luồng hay stack canary. Đây là mức mà môn hệ điều hành gọi là "một chương trình người dùng": một chuỗi cú bẫy. Mọi thứ phía trên — <code>main</code>, <code>printf</code>, <code>malloc</code>, <code>errno</code>, đệm — là mã thư viện mà về nguyên tắc bạn tự viết được. (Bạn sẽ gặp lại <code>_start</code> và quy ước thanh ghi này khi đọc tệp nhị phân ở <a href="${OS('os-13-1-bo-nho')}">bài 13.1</a>.)</p>

<h3>Node: libuv gọi glibc, và chờ theo hai cách khác nhau</h3>
<p>Chẳng ai viết backend bằng asm trần, vậy các trình chạy thật làm gì? Bắt đầu với cái mà API của cuongthai.com đang chạy. Tệp <code>node</code> không tự phát syscall; tầng libuv của nó gọi các hàm bọc của glibc:</p>
${run('c112-raw', 'objdump -T $(which node)')}
<p>Điều thú vị là nó dùng chúng <em>thế nào</em>. Script này đọc một file và gửi một request HTTP tới chính nó:</p>
${src('ch11/uv.js', 'javascript')}
${run('c112-raw', 'strace -f -qq -e trace=openat,connect,accept4')}
<p>Con số đầu là luồng chính (1456). File <code>/etc/hostname</code> được <strong>luồng 1466</strong> mở — một worker của libuv, vì file thường không chờ bằng epoll được, nên libuv giao các lời gọi file chặn cho thread pool của nó (mặc định 4 luồng, <code>UV_THREADPOOL_SIZE</code>). Các socket ở lại luồng chính và được đặt <strong>không chặn</strong>: <code>connect</code> trả <code>EINPROGRESS</code> ("đã bắt đầu, chưa xong") thay vì đứng chờ, và <code>accept4</code> xin <code>SOCK_NONBLOCK</code>. Vòng lặp sau đó chờ mọi socket cùng lúc trong <code>epoll_pwait</code>. Hai chiến lược chờ trong một tiến trình — cốt lõi thiết kế của Node, và của <a href="${OS('os-10-2-blocking')}">Chương 10</a>.</p>
${lab('eventloop', 'pool', 'vi', 'Thấy cả hai đường: fs, dns.lookup và crypto đi vào thread pool của libuv (mặc định 4 luồng), còn socket chờ trong epoll trên luồng chính, không tốn luồng nào.')}

<h3>JVM: mã gốc trên glibc, và rất nhiều luồng</h3>
${run('c112-raw', 'javac Hello.java', 2)}
<p>Mã Java tới nhân qua các thư viện gốc của JDK — <code>libjava.so</code>, <code>libnio.so</code>, <code>libnet.so</code> — chúng nhập <code>read</code> và <code>write</code> từ glibc như mọi chương trình C (JNI là cây cầu từ Java sang mã C đó). Cái làm JVM khác là mọi thứ quanh <code>main()</code> của bạn: một hello world khởi động 18 luồng (worker của bộ gom rác, trình biên dịch JIT, bộ phát tín hiệu, bộ xử lý tham chiếu…):</p>
${run('c112-raw', 'strace -f -c -o jc.txt java Hello')}
<p>1.318 lời gọi hệ thống cho một dòng chữ, phần lớn thời gian ở <code>futex</code> — các luồng chờ nhau lúc khởi động — và 281 lời gọi <code>mmap</code> ánh xạ heap, vùng mã đã biên dịch và thư viện. Đó là cái giá hâm nóng mà <a href="${OS('os-1-3-che-do')}">bài 1.3</a> đã đếm; ở một dịch vụ Spring Boot chạy lâu thì chỉ trả một lần. Virtual thread của Java 21 và selector của NIO dùng cùng cơ chế epoll như libuv — Chương 10 so sánh chúng.</p>

<h3>Go: không có libc</h3>
<p>Ảnh lab không có Go, nên ta tải Go 1.27.3 chính thức cho linux/arm64 từ go.dev (đã đối chiếu checksum) vào một container vứt đi:</p>
${run('c112-raw', 'go version', 3)}
<p>Dựng không có cgo, tệp chạy là <strong>tĩnh</strong> và không liên kết libc nào. Runtime của nó có đoạn syscall riêng, viết bằng assembler của Go:</p>
${run('c112-raw', 'go tool objdump -s')}
<p><code>MOVD 8(RSP), R8</code> nạp số hiệu vào R8 (tên Go gọi x8) và <code>SVC $0</code> sập bẫy — đúng hai lệnh như <code>raw_write</code> của ta. Mọi <code>os.File.Write</code>, <code>net.Conn.Read</code> và <code>time.Sleep</code> đều kết thúc ở đó, được bọc bởi <code>runtime.entersyscall</code>/<code>exitsyscall</code> để khi một lời gọi bị chặn, bộ lập lịch trao bộ xử lý logic cho một luồng hệ điều hành khác và các goroutine khác vẫn chạy.</p>
${run('c112-raw', 'strace -f -qq -e trace=write -o go.txt ./hello-go')}
${run('c112-raw', 'strace -f -c -o goc.txt ./hello-go')}
<p>214 lời gọi: 114 <code>rt_sigaction</code> (runtime cài hàm xử lý cho mọi tín hiệu — để giành CPU, báo lỗi sập và cho <code>os/signal</code>), vài <code>clone</code> cho các luồng của nó, <code>sigaltstack</code> cho stack tín hiệu. Vì sao Go đi đường này? Một tệp tĩnh không libc chạy được <code>FROM scratch</code> trong Docker và không bao giờ vướng lệch phiên bản glibc; runtime kiểm soát chính xác cách từng lời gọi bị chặn. Nó làm được điều đó <strong>chỉ trên Linux</strong>, vì Linux hứa giữ giao diện lời gọi hệ thống ổn định cho chương trình người dùng. macOS và OpenBSD không hứa như vậy, nên ở đó Go đi qua libc của chúng.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> nhóm bạn đang chọn image gốc. Dịch vụ Go sẽ chạy <code>FROM scratch</code>, và có người hỏi vì sao API Node "cần cả một bản Debian" còn Go thì không, và API Node có bị chặn khi đọc file không.</p>
<ol>
<li>Biên dịch <code>raw.c</code>, chạy nó qua ống <code>| cat</code> và chạy trần trên terminal. Giải thích vì sao thứ tự dòng 1 khác nhau.</li>
<li>Thêm một <code>getpid</code> trần (số 172 trên arm64, 39 trên x86-64) cạnh <code>getpid()</code> và kiểm bằng <code>strace</code> rằng cả hai cùng tới một lời gọi.</li>
<li>Chạy <code>uv.js</code> dưới <code>strace -f</code> và chỉ ra luồng nào mở file, luồng nào gọi <code>connect</code>.</li>
<li>Chạy <code>ldd</code> trên <code>node</code>, trên <code>java</code> và trên một tệp Go dựng với <code>CGO_ENABLED=0</code>. Ghi lại cái nào cần glibc trong image.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra được hai mã luồng ở bước 3, ba kết quả <code>ldd</code>, và giải thích trong hai câu vì sao Go chạy được từ <code>scratch</code> còn Node thì không.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['syscall(SYS_x, …)', 'Hàm bọc chung của libc: số hiệu bất kỳ, có đặt errno; dùng cho lời gọi chưa có hàm bọc riêng.'],
  ['inline asm (assembly nội tuyến)', 'Assembly nằm trong C; gắn biến vào x0–x8 để tự chạy svc #0.'],
  ['_start / -nostdlib', 'Điểm vào ELF mà nhân nhảy tới; không libc thì không có main(), errno hay đệm.'],
  ['libuv thread pool', 'Các luồng worker (mặc định 4) chạy lời gọi file, DNS, crypto chặn thay cho luồng JS duy nhất của Node.'],
  ['non-blocking socket (socket không chặn)', 'Socket mà lời gọi trả EAGAIN/EINPROGRESS thay vì chờ; tín hiệu sẵn sàng đến từ epoll.'],
  ['JNI / native library (thư viện gốc)', 'Mã C (libjava, libnio) mà Java đi qua để tới glibc và nhân.'],
  ['entersyscall / exitsyscall', 'Móc của runtime Go quanh mỗi syscall để lời gọi chặn không làm đứng các goroutine khác.'],
  ['stable syscall ABI (giao diện syscall ổn định)', 'Lời hứa của Linux không làm hỏng chương trình người dùng; nhờ nó Go bỏ được libc trên Linux.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>printf, write(), syscall() và một <code>svc #0</code> tự viết đều tới cùng một lời gọi của nhân; chỉ khác ở đệm và xử lý lỗi.</li>
<li>Nhân luôn trả −errno; libc đổi nó thành −1 + errno. Mã trần phải tự kiểm khoảng −4095…−1.</li>
<li>Một chương trình không libc nặng 1.632 byte và làm 2 syscall — mọi thứ khác là mã thư viện.</li>
<li>Node (libuv) và JVM gọi glibc; Node gửi I/O file vào thread pool và giữ socket không chặn trên luồng chính; một hello của JVM khởi động 18 luồng.</li>
<li>Go tự chạy SVC, nhờ đó có tệp tĩnh — trên Linux, nhờ giao diện syscall ổn định.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/syscall.2.html', '📄', 'man 2 syscall', 'Gọi một lời gọi hệ thống chưa có hàm bọc, và quy ước của từng kiến trúc.', 'Mở')}
${L('https://docs.libuv.org/en/v1.x/design.html', '📄', 'libuv — Design overview', 'Vì sao socket dùng epoll còn file dùng thread pool.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 11.3 — strace và ltrace thực chiến ───────────────────────── */
    {
      title: '11.3 — strace and ltrace in anger: why it fails, hangs or is slow|||11.3 — strace và ltrace thực chiến: vì sao hỏng, treo hay chậm',
      slug: 'os-11-2-strace-ltrace',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Các cờ strace đáng nhớ (-f, -e trace=%file/%network, -Z, -p, -T, -tt, -c, -y, -k); ba sự cố: lỗi mơ hồ (-Z tìm đúng đường dẫn), treo (strace -p thấy connect không ai trả lời), chậm (-tt chia DNS/connect/chờ phản hồi); một request Node từng lời gọi; đếm syscall mỗi request Node/Python/Java và lần ra độ trễ 40 ms do Nagle + ACK trễ (8,4 s → 0,028 s); strace làm chậm 160× và --seccomp-bpf; -k không có trên bản arm64; ltrace vs strace.',
      content: `${G113}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>strace in anger: read the syscalls, find the problem</h2>
<p class="lead">Logs show what a program <em>meant</em> to do. The system calls show what it actually asked the operating system — which file, which address, how long it waited. <a href="${OS('os-1-3-che-do')}">Lesson 1.3</a> used <code>strace -c</code> to count calls; this lesson uses strace the way you will on a server at 2 a.m.: <strong>why does it fail with a vague message, why does it hang, why is it slow — and how many times does my web server enter the kernel per request?</strong> The last question uncovers a real 40 ms delay in two popular servers.</p>

<h3>The flags that answer real questions</h3>
<table>
<tr><th>flag</th><th>what it gives you</th></tr>
<tr><td><code>-f</code></td><td>follow every thread and child process — required for Node, Java, Go and anything that forks</td></tr>
<tr><td><code>-e trace=openat,connect</code>, <code>%file</code>, <code>%network</code>, <code>%process</code></td><td>only the calls (or classes of calls) you care about</td></tr>
<tr><td><code>-Z</code> (<code>--failed-only</code>)</td><td>only calls that returned an error</td></tr>
<tr><td><code>-p PID</code></td><td>attach to a process that is already running — and already stuck</td></tr>
<tr><td><code>-T</code> / <code>-tt</code></td><td>time spent <em>inside</em> each call / wall-clock timestamp of each call (µs)</td></tr>
<tr><td><code>-c</code></td><td>a summary table instead of a trace: calls, errors, time per syscall</td></tr>
<tr><td><code>-o file</code>, <code>-y</code>, <code>-qq</code></td><td>write the trace to a file / print the path behind each fd / hide attach messages</td></tr>
<tr><td><code>-k</code></td><td>the user-space stack of each call — only if your strace build supports it</td></tr>
</table>

<h3>"It fails with a vague message" → only the failed calls</h3>
<p>A typical startup failure: the app catches the real error and prints something generic.</p>
${src('ch11/cfg.js', 'javascript')}
${run('c113-strace', 'node cfg.js', 3)}
<p><code>-Z -e trace=%file</code> keeps only file-related calls that failed: 10 lines out of hundreds (Node probes a few optional paths at startup), and one of them is the answer — the exact path the program tried, built from an environment variable nobody set. This works for any language and any message: "permission denied" becomes <code>EACCES</code> on a specific path, "module not found" becomes the list of directories searched.</p>

<h3>"It hangs" → attach and look at the blocked call</h3>
${src('ch11/hang.py', 'python')}
${run('c113-strace', 'python3 hang.py', 2)}
<p>strace attaches to the running process and prints the call it is sitting in: <code>connect(3, …10.255.255.1… port 5432…</code> with no result, because it has not returned. Nobody answers at that address, and a socket without a timeout waits as long as the kernel keeps retrying the SYN (over two minutes by default). The same diagnosis without strace — from <code>/proc</code> — is in lesson 11.6.</p>

<div class="pitfall co-tieu-de">
<p><strong>A database client with no connect timeout.</strong> Python's <code>socket.create_connection</code> without <code>timeout=</code> and node-postgres with its default <code>connectionTimeoutMillis: 0</code> both wait as long as the kernel does. A wrong host or a firewall that silently drops packets turns into a container that "starts" and never becomes healthy, with nothing in the logs. Always set a connect timeout, and when something hangs, <code>strace -p</code> tells you which call it is stuck in within a second.</p>
</div>

<h3>"It is slow" → timestamps show where the time went</h3>
${run('c113-strace', 'strace -f -tt -T -e trace=connect,sendmmsg', 2)}
<p>curl itself says 0.16 s; the trace says why. At :36.0609 the resolver thread (52) sends a DNS query to Docker's DNS server (192.168.65.7:53); the answers come back at .0625 (IPv6, empty) and .0745 (IPv4) — about 14 ms. The two <code>connect(…, htons(80)) = 0</code> on a UDP socket are glibc ranking the addresses (no packet is sent). Then the main thread (51) starts a <strong>non-blocking</strong> TCP connect (<code>EINPROGRESS</code>) at .0784 and can send the request only at .1411: 63 ms for the TCP handshake to the server. The response arrives at .2175, 76 ms later. Network round trips, not CPU — so caching DNS would save little, while a closer server or connection reuse would save most.</p>

<h3>One HTTP request to Node, call by call</h3>
${src('ch11/server.js', 'javascript')}
${run('c113-strace', 'cut -c1-130 one.txt')}
<p>Read it top to bottom: <code>accept4</code> takes the new connection (non-blocking, close-on-exec), <code>setsockopt(TCP_NODELAY)</code> disables Nagle's algorithm (remember this line), <code>epoll_ctl(ADD)</code> registers the socket with the event loop, <code>read</code> gets the 78-byte request, and <code>writev</code> sends headers and body in <strong>one</strong> call. On this first request V8 also reads <code>/etc/localtime</code> (fd 20) while building the Date header — only once. Then curl closes: <code>read</code> returns 0, Node shuts down and closes the socket.</p>

<h3>Count syscalls per request — and compare servers</h3>
${run('c113-strace', 'TIMEFORMAT', 5)}
<p>Under load, count instead of trace. 1,000 keep-alive requests produced 1,000 <code>writev</code>, 1,009 <code>read</code> and 1,015 <code>epoll_pwait</code> on the main thread: about <strong>3 system calls per request</strong>, plus <code>futex</code> on V8's helper threads. Notice strace's own cost: 0.135 s became 0.250 s. Now the same measurement for Python's standard library server:</p>
${src('ch11/pyserver.py', 'python')}
${run('c113-strace', 'python3 pyserver.py & PY', 2)}
<p><strong>8.4 seconds</strong> for 200 requests — 42 ms each, on localhost. The CPU is idle; something waits. Tracing the server changes its timing too much, so trace the <em>client</em>:</p>
${run('c113-strace', 'strace -qq -tt -T -e trace=sendto,recvfrom -o client.txt')}
<p>For request 2, the 111 bytes of headers arrive at .922405; curl asks for the 6-byte body and gets <code>EAGAIN</code> (non-blocking socket, nothing there yet); the body arrives at .963545 — <strong>41 ms later</strong>. The server wrote headers and body in two separate <code>sendto</code> calls, and TCP held the second one back. Two mechanisms meet: <strong>Nagle's algorithm</strong> on the server keeps a small segment until all earlier data is acknowledged, and <strong>delayed ACK</strong> on the client waits up to ~40 ms before acknowledging, hoping to piggyback the ACK on a reply. Each waits for the other until the ACK timer fires. (Request 1 was fast only because nothing was outstanding yet.)</p>
${run('c113-strace', 'NODELAY=1 python3 pyserver.py', 2)}
<p>With <code>TCP_NODELAY</code> (Python's <code>disable_nagle_algorithm = True</code>) the same 200 requests take <strong>0.028 s</strong> — 300 times faster. The JDK's built-in <code>com.sun.net.httpserver</code> had the same problem:</p>
${lab('nagle', 'nagle', 'en', 'The 41 ms on a sequence diagram: headers and body in two writes, Nagle holds the body until the headers are ACKed, the client delays its ACK — 200 requests take 8.4 s. Switch TCP_NODELAY on (0.028 s) or send everything in one write.', { tour: 'nagle-delay' })}
${src('ch11/HelloServer.java', 'java')}
${run('c113-strace', 'javac HelloServer.java && java HelloServer', 2)}
${run('c113-strace', 'java -Dsun.net.httpserver.nodelay=true', 6, { max: 18 })}
<p>8.6 s for 200 requests by default, 0.115 s for 1,000 with <code>-Dsun.net.httpserver.nodelay=true</code>. Per request, the three servers enter the kernel this often:</p>
<table>
<tr><th>server (1,000 keep-alive requests, Nagle off)</th><th>syscalls</th><th>per request</th><th>mostly</th></tr>
<tr><td>Node <code>http</code></td><td>3,207</td><td>3.2</td><td><code>epoll_pwait</code> + <code>read</code> + one <code>writev</code> (+ <code>futex</code> on helper threads)</td></tr>
<tr><td>Python <code>http.server</code></td><td>3,009</td><td>3.0</td><td><code>recvfrom</code> + two <code>sendto</code></td></tr>
<tr><td>JDK <code>HttpServer</code></td><td>14,571</td><td>14.6</td><td>3 <code>write</code>, 4 <code>fcntl</code>, 3 <code>epoll_pwait</code>, 2 <code>epoll_ctl</code>, 2 <code>read</code></td></tr>
</table>
<p>Same "hello", 3 vs 15 kernel crossings. The JDK server switches the socket between blocking and non-blocking mode with <code>fcntl</code> four times per request and hands each request between a dispatcher thread and the handler. That is not a verdict on Java — Spring Boot runs on Tomcat or Netty, which do this differently — but it shows the method: <strong>count, divide by requests, and ask why each call is there</strong>.</p>
${lab('eventloop', 'block', 'en', 'Every request to Node is epoll_pwait → read → writev on ONE thread. Make one handler slow and watch the others wait — in strace -tt that shows up as a gap between epoll_pwait calls.', { tour: 'eventloop-block' })}

<div class="pitfall co-tieu-de">
<p><strong>Two small writes on a socket.</strong> Writing headers and body separately, or a protocol that sends a length and then a payload with two <code>write()</code> calls, meets Nagle + delayed ACK and costs ~40 ms per message — invisible in CPU graphs, obvious in a client <code>strace -tt</code>. Either build the message and send it in one call (<code>writev</code>, a buffered writer that you flush once), or set <code>TCP_NODELAY</code> on the socket. Node’s <code>http</code> server sets it on every connection (the <code>setsockopt</code> line above); many other servers and clients do not.</p>
</div>

<h3>What strace costs</h3>
${run('c113-strace', 'time dd if=/dev/zero', 4)}
<p>strace uses <code>ptrace</code>: the kernel stops the traced program at every syscall entry and exit and wakes strace to look at it. For <code>dd</code> copying one byte at a time (200,000 syscalls) that turns 0.05 s into 8 s — about 160×. Filtering with <code>-e trace=openat</code> alone does not help, because the program still stops at every call. <code>--seccomp-bpf</code> does: strace installs a seccomp filter (lesson 11.7) so the kernel stops the program only for the calls you asked for, and the run is back to 0.05 s. On a busy production process, use a narrow <code>-e</code> with <code>--seccomp-bpf</code>, attach briefly with <code>-p</code>, or use eBPF tools that count in the kernel without stopping anyone (preview in lesson 11.6).</p>
${lab('syscall', 'strace', 'en', 'What strace adds to every call: two ptrace stops (entry and exit), about 41 µs of extra round trips — and the dd table: about 0.05 s without strace, over 8 s under it, back to about 0.05 s with --seccomp-bpf.', { tour: 'syscall-journey' })}

<h3>-k: which code made this call?</h3>
${run('c113-strace', 'strace -k')}
<p><code>-k</code> prints the user-space stack of every call, which answers "which part of my program opened this file?". It needs strace built with a stack unwinder, and Ubuntu's arm64 build has none. The same answer comes from gdb, as in lesson 11.1: <code>gdb -ex 'catch syscall openat' -ex run -ex bt ./prog</code>. On an x86-64 VPS, simply try <code>strace -k</code>.</p>

<h3>ltrace: one level up</h3>
<p><code>ltrace</code> intercepts calls into shared <em>libraries</em> instead of the kernel. A word counter makes thousands of them and only 40 system calls:</p>
${src('ch11/words.c', 'c')}
${run('c113-strace', 'ltrace -c ./words', 2)}
${run('c113-strace', 'ltrace -S -e malloc+strtok+fgets')}
<p>With <code>-S</code> both levels appear together: one <code>read</code> of 4,096 bytes fills stdio's buffer, and many <code>fgets</code> and <code>strtok</code> calls are then served from memory without the kernel — buffering at work. ltrace is slower than strace (it uses breakpoints on every library call: 0.43 s for a program that normally runs in milliseconds), works only for dynamically linked programs, and is of little use for Node, Java or Go, whose interesting calls are not exported library functions. Use it to answer "is the time in my code or in a library?" for C/C++ programs.</p>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> an internal Python service built on <code>http.server</code> answers health checks in ~40 ms on localhost while the CPU is idle, and a teammate wants to "add more workers".</p>
<ol>
<li>Start <code>pyserver.py</code> in the lab and time 200 keep-alive requests with curl's <code>[1-200]</code> syntax.</li>
<li>Trace the client with <code>strace -tt -T -e trace=sendto,recvfrom</code> for 2 requests and find the gap.</li>
<li>Count the server's syscalls per request with <code>strace -f -c -p</code> during 1,000 requests.</li>
<li>Fix it with <code>NODELAY=1</code> (or by sending headers and body in one write) and measure again.</li>
</ol>
<p><strong>Done when:</strong> you show the 40 ms gap in the trace, the per-request syscall count, and before/after timings, and can explain why more workers would not have helped.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['strace -f', 'Trace all threads and children; without it you miss most of a server’s work.'],
  ['strace -Z / -e trace=%file', 'Only failed calls / only file calls — the fastest way to the path a program really used.'],
  ['strace -p PID', 'Attach to a running process; shows the call it is blocked in right now.'],
  ['-T / -tt', 'Time inside each call / timestamp of each call — where wall-clock time went.'],
  ['ptrace overhead', 'Each traced call stops the process twice; --seccomp-bpf limits the stops to the calls you filter.'],
  ['Nagle’s algorithm', 'TCP holds a small segment until earlier data is acknowledged; TCP_NODELAY turns it off.'],
  ['delayed ACK', 'The receiver waits (up to ~40 ms) before acknowledging; with Nagle it creates 40 ms stalls.'],
  ['ltrace', 'Traces calls into shared libraries (malloc, strtok…); -S adds the syscalls.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Vague error → <code>strace -f -Z -e trace=%file</code>; hang → <code>strace -p</code>; slowness → <code>-tt -T</code> and read the gaps.</li>
<li>Under load, count with <code>-c</code> and divide by requests: Node ~3, Python ~3, the JDK server ~15 syscalls per hello.</li>
<li>Two small socket writes + Nagle + delayed ACK = 40 ms per response; one write or <code>TCP_NODELAY</code> fixes it (8.4 s → 0.028 s).</li>
<li>strace can slow a syscall-heavy program 100×+; use <code>--seccomp-bpf</code> with narrow filters, short attaches, or eBPF.</li>
<li>ltrace shows library calls; most of them never reach the kernel.</li>
</ul>
${L('https://man7.org/linux/man-pages/man1/strace.1.html', '📄', 'man 1 strace', 'Every flag: -f, -Z, -p, -T, -tt, -c, -y, -k, --seccomp-bpf.', 'Open')}
${L('https://man7.org/linux/man-pages/man7/tcp.7.html', '📄', 'man 7 tcp', 'TCP_NODELAY, TCP_QUICKACK and delayed acknowledgements.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>strace thực chiến: đọc syscall, tìm ra vấn đề</h2>
<p class="lead">Log cho thấy chương trình <em>định</em> làm gì. Lời gọi hệ thống cho thấy nó thật sự đã xin hệ điều hành cái gì — file nào, địa chỉ nào, chờ bao lâu. <a href="${OS('os-1-3-che-do')}">Bài 1.3</a> dùng <code>strace -c</code> để đếm lời gọi; bài này dùng strace đúng như bạn sẽ dùng trên máy chủ lúc 2 giờ sáng: <strong>vì sao nó hỏng với một thông báo mơ hồ, vì sao nó treo, vì sao nó chậm — và máy chủ web của tôi vào nhân bao nhiêu lần cho mỗi request?</strong> Câu cuối lộ ra một độ trễ 40 ms có thật ở hai máy chủ phổ biến.</p>

<h3>Những cờ trả lời được câu hỏi thật</h3>
<table>
<tr><th>cờ</th><th>cho bạn cái gì</th></tr>
<tr><td><code>-f</code></td><td>theo mọi luồng và tiến trình con — bắt buộc với Node, Java, Go và mọi thứ có fork</td></tr>
<tr><td><code>-e trace=openat,connect</code>, <code>%file</code>, <code>%network</code>, <code>%process</code></td><td>chỉ những lời gọi (hay nhóm lời gọi) bạn quan tâm</td></tr>
<tr><td><code>-Z</code> (<code>--failed-only</code>)</td><td>chỉ những lời gọi trả về lỗi</td></tr>
<tr><td><code>-p PID</code></td><td>gắn vào một tiến trình đang chạy — và đang kẹt</td></tr>
<tr><td><code>-T</code> / <code>-tt</code></td><td>thời gian nằm <em>bên trong</em> mỗi lời gọi / dấu giờ thực của mỗi lời gọi (µs)</td></tr>
<tr><td><code>-c</code></td><td>một bảng tổng thay cho dấu vết: số lời gọi, số lỗi, thời gian mỗi syscall</td></tr>
<tr><td><code>-o file</code>, <code>-y</code>, <code>-qq</code></td><td>ghi dấu vết ra file / in đường dẫn sau mỗi fd / giấu thông báo gắn vào</td></tr>
<tr><td><code>-k</code></td><td>ngăn xếp phía người dùng của mỗi lời gọi — chỉ khi bản strace của bạn hỗ trợ</td></tr>
</table>

<h3>"Nó hỏng với thông báo mơ hồ" → chỉ xem lời gọi lỗi</h3>
<p>Một kiểu hỏng lúc khởi động rất hay gặp: ứng dụng bắt lỗi thật rồi in ra một câu chung chung.</p>
${src('ch11/cfg.js', 'javascript')}
${run('c113-strace', 'node cfg.js', 3)}
<p><code>-Z -e trace=%file</code> chỉ giữ các lời gọi liên quan file mà bị lỗi: 10 dòng trên hàng trăm (Node dò vài đường dẫn tùy chọn lúc khởi động), và một dòng là câu trả lời — đúng đường dẫn chương trình đã thử, ghép từ một biến môi trường không ai đặt. Cách này dùng được cho mọi ngôn ngữ và mọi thông báo: "permission denied" thành <code>EACCES</code> trên một đường dẫn cụ thể, "module not found" thành danh sách thư mục đã tìm.</p>

<h3>"Nó treo" → gắn vào và nhìn lời gọi đang chặn</h3>
${src('ch11/hang.py', 'python')}
${run('c113-strace', 'python3 hang.py', 2)}
<p>strace gắn vào tiến trình đang chạy và in lời gọi nó đang ngồi trong đó: <code>connect(3, …10.255.255.1… cổng 5432…</code> không có kết quả, vì chưa trả về. Không ai trả lời ở địa chỉ đó, và một socket không có hạn chờ sẽ chờ chừng nào nhân còn gửi lại gói SYN (mặc định hơn hai phút). Chẩn đoán y vậy mà không cần strace — từ <code>/proc</code> — nằm ở bài 11.6.</p>

<div class="pitfall co-tieu-de">
<p><strong>Client CSDL không có hạn chờ kết nối.</strong> <code>socket.create_connection</code> của Python không có <code>timeout=</code> và node-postgres với mặc định <code>connectionTimeoutMillis: 0</code> đều chờ lâu bằng nhân. Sai host hay một tường lửa lặng lẽ bỏ gói biến thành một container "đã khởi động" mà không bao giờ khoẻ, log trống trơn. Luôn đặt hạn chờ kết nối, và khi có thứ treo, <code>strace -p</code> cho bạn biết nó kẹt ở lời gọi nào trong vòng một giây.</p>
</div>

<h3>"Nó chậm" → dấu thời gian cho thấy thời gian đi đâu</h3>
${run('c113-strace', 'strace -f -tt -T -e trace=connect,sendmmsg', 2)}
<p>curl tự nói 0,16 s; dấu vết nói vì sao. Lúc :36.0609 luồng phân giải tên (52) gửi một truy vấn DNS tới máy chủ DNS của Docker (192.168.65.7:53); câu trả lời về lúc .0625 (IPv6, rỗng) và .0745 (IPv4) — khoảng 14 ms. Hai lời gọi <code>connect(…, htons(80)) = 0</code> trên một socket UDP là glibc xếp hạng các địa chỉ (không gửi gói nào). Rồi luồng chính (51) bắt đầu một kết nối TCP <strong>không chặn</strong> (<code>EINPROGRESS</code>) lúc .0784 và chỉ gửi được request lúc .1411: 63 ms cho cái bắt tay TCP tới máy chủ. Phản hồi tới lúc .2175, sau 76 ms. Là các vòng đi-về mạng, không phải CPU — nên cache DNS tiết kiệm được ít, còn máy chủ gần hơn hay dùng lại kết nối thì tiết kiệm được phần lớn.</p>

<h3>Một request HTTP tới Node, từng lời gọi</h3>
${src('ch11/server.js', 'javascript')}
${run('c113-strace', 'cut -c1-130 one.txt')}
<p>Đọc từ trên xuống: <code>accept4</code> nhận kết nối mới (không chặn, đóng khi exec), <code>setsockopt(TCP_NODELAY)</code> tắt thuật toán Nagle (hãy nhớ dòng này), <code>epoll_ctl(ADD)</code> đăng ký socket với vòng lặp sự kiện, <code>read</code> lấy request 78 byte, và <code>writev</code> gửi header và thân trong <strong>một</strong> lời gọi. Ở request đầu tiên này V8 còn đọc <code>/etc/localtime</code> (fd 20) khi dựng header Date — chỉ một lần. Rồi curl đóng: <code>read</code> trả 0, Node shutdown và đóng socket.</p>

<h3>Đếm syscall mỗi request — và so các máy chủ</h3>
${run('c113-strace', 'TIMEFORMAT', 5)}
<p>Khi có tải, hãy đếm thay vì dò. 1.000 request keep-alive sinh ra 1.000 <code>writev</code>, 1.009 <code>read</code> và 1.015 <code>epoll_pwait</code> trên luồng chính: khoảng <strong>3 lời gọi hệ thống mỗi request</strong>, cộng <code>futex</code> ở các luồng phụ của V8. Để ý giá của chính strace: 0,135 s thành 0,250 s. Giờ cùng phép đo cho máy chủ trong thư viện chuẩn của Python:</p>
${src('ch11/pyserver.py', 'python')}
${run('c113-strace', 'python3 pyserver.py & PY', 2)}
<p><strong>8,4 giây</strong> cho 200 request — 42 ms mỗi cái, trên localhost. CPU rảnh; có thứ gì đó đang chờ. Dò máy chủ làm đổi nhịp của nó quá nhiều, nên hãy dò <em>client</em>:</p>
${run('c113-strace', 'strace -qq -tt -T -e trace=sendto,recvfrom -o client.txt')}
<p>Ở request 2, 111 byte header tới lúc .922405; curl xin phần thân 6 byte và nhận <code>EAGAIN</code> (socket không chặn, chưa có gì); phần thân tới lúc .963545 — <strong>trễ 41 ms</strong>. Máy chủ ghi header và thân bằng hai lời gọi <code>sendto</code> riêng, và TCP đã giữ lần thứ hai lại. Hai cơ chế gặp nhau: <strong>thuật toán Nagle</strong> ở máy chủ giữ một đoạn nhỏ cho tới khi mọi dữ liệu trước đó được báo nhận, còn <strong>ACK trễ</strong> ở client chờ tới ~40 ms mới báo nhận, mong gửi ACK kèm một câu trả lời. Bên nào cũng chờ bên kia cho tới khi bộ hẹn giờ ACK nổ. (Request 1 nhanh chỉ vì lúc đó chưa có gì đang chờ báo nhận.)</p>
${run('c113-strace', 'NODELAY=1 python3 pyserver.py', 2)}
<p>Bật <code>TCP_NODELAY</code> (trong Python là <code>disable_nagle_algorithm = True</code>), cùng 200 request chỉ mất <strong>0,028 s</strong> — nhanh gấp 300 lần. Máy chủ <code>com.sun.net.httpserver</code> có sẵn trong JDK mắc đúng lỗi đó:</p>
${lab('nagle', 'nagle', 'vi', '41 ms trên sơ đồ trình tự: header và thân trong hai lần ghi, Nagle giữ phần thân tới khi header được báo nhận, client lại báo nhận trễ — 200 request mất 8,4 s. Bật TCP_NODELAY (0,028 s) hoặc gửi tất cả trong một lần ghi.', { tour: 'nagle-delay' })}
${src('ch11/HelloServer.java', 'java')}
${run('c113-strace', 'javac HelloServer.java && java HelloServer', 2)}
${run('c113-strace', 'java -Dsun.net.httpserver.nodelay=true', 6, { max: 18 })}
<p>Mặc định 8,6 s cho 200 request, còn với <code>-Dsun.net.httpserver.nodelay=true</code> là 0,115 s cho 1.000. Tính theo mỗi request, ba máy chủ vào nhân với tần suất này:</p>
<table>
<tr><th>máy chủ (1.000 request keep-alive, đã tắt Nagle)</th><th>syscall</th><th>mỗi request</th><th>chủ yếu</th></tr>
<tr><td>Node <code>http</code></td><td>3.207</td><td>3,2</td><td><code>epoll_pwait</code> + <code>read</code> + một <code>writev</code> (+ <code>futex</code> ở luồng phụ)</td></tr>
<tr><td>Python <code>http.server</code></td><td>3.009</td><td>3,0</td><td><code>recvfrom</code> + hai <code>sendto</code></td></tr>
<tr><td>JDK <code>HttpServer</code></td><td>14.571</td><td>14,6</td><td>3 <code>write</code>, 4 <code>fcntl</code>, 3 <code>epoll_pwait</code>, 2 <code>epoll_ctl</code>, 2 <code>read</code></td></tr>
</table>
<p>Cùng một câu "hello", 3 so với 15 lần vào nhân. Máy chủ của JDK chuyển socket qua lại giữa chế độ chặn và không chặn bằng <code>fcntl</code> bốn lần mỗi request và chuyền mỗi request giữa luồng điều phối và luồng xử lý. Đó không phải phán quyết về Java — Spring Boot chạy trên Tomcat hay Netty, chúng làm khác — nhưng nó cho thấy phương pháp: <strong>đếm, chia cho số request, rồi hỏi vì sao từng lời gọi có mặt ở đó</strong>.</p>
${lab('eventloop', 'block', 'vi', 'Mỗi request tới Node là epoll_pwait → read → writev trên MỘT luồng. Làm một handler chậm đi và xem các request khác phải chờ — trong strace -tt nó hiện ra thành một khoảng hở giữa các lần epoll_pwait.', { tour: 'eventloop-block' })}

<div class="pitfall co-tieu-de">
<p><strong>Hai lần ghi nhỏ trên một socket.</strong> Ghi header và thân riêng, hay một giao thức gửi độ dài rồi gửi dữ liệu bằng hai lần <code>write()</code>, sẽ gặp Nagle + ACK trễ và tốn ~40 ms mỗi thông điệp — vô hình trên biểu đồ CPU, lộ rõ trong <code>strace -tt</code> phía client. Hoặc dựng xong thông điệp rồi gửi trong một lời gọi (<code>writev</code>, một bộ ghi có đệm mà bạn xả một lần), hoặc đặt <code>TCP_NODELAY</code> trên socket. Máy chủ <code>http</code> của Node đặt sẵn trên mọi kết nối (dòng <code>setsockopt</code> ở trên); nhiều máy chủ và client khác thì không.</p>
</div>

<h3>strace tốn bao nhiêu</h3>
${run('c113-strace', 'time dd if=/dev/zero', 4)}
<p>strace dùng <code>ptrace</code>: nhân dừng chương trình bị dò ở mỗi lần vào và ra khỏi syscall rồi đánh thức strace để xem. Với <code>dd</code> chép từng byte một (200.000 syscall), 0,05 s thành 8 s — khoảng 160 lần. Chỉ lọc bằng <code>-e trace=openat</code> không giúp gì, vì chương trình vẫn dừng ở mọi lời gọi. <code>--seccomp-bpf</code> thì giúp: strace cài một bộ lọc seccomp (bài 11.7) để nhân chỉ dừng chương trình ở những lời gọi bạn xin, và lượt chạy trở lại 0,05 s. Với một tiến trình production đang bận, hãy dùng <code>-e</code> hẹp kèm <code>--seccomp-bpf</code>, gắn <code>-p</code> thật ngắn, hoặc dùng công cụ eBPF đếm ngay trong nhân mà không dừng ai (xem trước ở bài 11.6).</p>
${lab('syscall', 'strace', 'vi', 'strace thêm gì vào mỗi lời gọi: hai lần dừng ptrace (vào và ra), khoảng 41 µs đi về thêm — và bảng dd: khoảng 0,05 s khi không strace, hơn 8 s dưới strace, về lại khoảng 0,05 s với --seccomp-bpf.', { tour: 'syscall-journey' })}

<h3>-k: đoạn mã nào gọi lời gọi này?</h3>
${run('c113-strace', 'strace -k')}
<p><code>-k</code> in ngăn xếp phía người dùng của mỗi lời gọi, trả lời câu "phần nào trong chương trình mở file này?". Nó cần strace được dựng kèm bộ tháo ngăn xếp, và bản arm64 của Ubuntu không có. Câu trả lời tương đương lấy từ gdb, như bài 11.1: <code>gdb -ex 'catch syscall openat' -ex run -ex bt ./prog</code>. Trên một VPS x86-64, cứ thử <code>strace -k</code>.</p>

<h3>ltrace: lên trên một bậc</h3>
<p><code>ltrace</code> chặn các lời gọi vào <em>thư viện</em> dùng chung thay vì vào nhân. Một chương trình đếm từ thực hiện hàng nghìn lời gọi như vậy và chỉ 40 lời gọi hệ thống:</p>
${src('ch11/words.c', 'c')}
${run('c113-strace', 'ltrace -c ./words', 2)}
${run('c113-strace', 'ltrace -S -e malloc+strtok+fgets')}
<p>Với <code>-S</code> cả hai tầng hiện cùng nhau: một lần <code>read</code> 4.096 byte đổ đầy bộ đệm của stdio, sau đó rất nhiều lời gọi <code>fgets</code> và <code>strtok</code> được phục vụ từ bộ nhớ mà không cần nhân — đệm đang làm việc. ltrace chậm hơn strace (nó đặt điểm dừng ở mọi lời gọi thư viện: 0,43 s cho một chương trình bình thường chạy vài mili-giây), chỉ dùng được cho chương trình liên kết động, và ít có ích cho Node, Java hay Go, vì các lời gọi đáng quan tâm của chúng không phải hàm thư viện được xuất ra. Hãy dùng nó để trả lời "thời gian nằm trong mã của tôi hay trong một thư viện?" với chương trình C/C++.</p>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một dịch vụ Python nội bộ dựng trên <code>http.server</code> trả lời health check mất ~40 ms trên localhost trong khi CPU rảnh, và một bạn muốn "thêm worker cho nhanh".</p>
<ol>
<li>Chạy <code>pyserver.py</code> trong lab và đo 200 request keep-alive bằng cú pháp <code>[1-200]</code> của curl.</li>
<li>Dò client bằng <code>strace -tt -T -e trace=sendto,recvfrom</code> với 2 request và tìm khoảng hở.</li>
<li>Đếm syscall mỗi request của máy chủ bằng <code>strace -f -c -p</code> trong 1.000 request.</li>
<li>Sửa bằng <code>NODELAY=1</code> (hoặc gửi header và thân trong một lần ghi) rồi đo lại.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn chỉ ra khoảng hở 40 ms trong dấu vết, số syscall mỗi request, thời gian trước/sau, và giải thích được vì sao thêm worker sẽ không giúp gì.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['strace -f', 'Dò mọi luồng và tiến trình con; thiếu nó bạn bỏ lỡ phần lớn việc của một máy chủ.'],
  ['strace -Z / -e trace=%file', 'Chỉ lời gọi lỗi / chỉ lời gọi file — đường nhanh nhất tới đường dẫn chương trình thật sự dùng.'],
  ['strace -p PID', 'Gắn vào tiến trình đang chạy; cho thấy lời gọi nó đang bị chặn ngay lúc này.'],
  ['-T / -tt', 'Thời gian trong mỗi lời gọi / dấu giờ của mỗi lời gọi — thời gian thực đi đâu.'],
  ['ptrace overhead (chi phí ptrace)', 'Mỗi lời gọi bị dò dừng tiến trình hai lần; --seccomp-bpf giới hạn việc dừng vào đúng lời gọi bạn lọc.'],
  ['Nagle’s algorithm (thuật toán Nagle)', 'TCP giữ một đoạn nhỏ tới khi dữ liệu trước được báo nhận; TCP_NODELAY tắt nó.'],
  ['delayed ACK (ACK trễ)', 'Bên nhận chờ (tới ~40 ms) rồi mới báo nhận; gặp Nagle là thành những lần đứng 40 ms.'],
  ['ltrace', 'Dò các lời gọi vào thư viện dùng chung (malloc, strtok…); -S thêm cả syscall.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lỗi mơ hồ → <code>strace -f -Z -e trace=%file</code>; treo → <code>strace -p</code>; chậm → <code>-tt -T</code> rồi đọc các khoảng hở.</li>
<li>Khi có tải, đếm bằng <code>-c</code> rồi chia cho số request: Node ~3, Python ~3, máy chủ JDK ~15 syscall cho một câu hello.</li>
<li>Hai lần ghi socket nhỏ + Nagle + ACK trễ = 40 ms mỗi phản hồi; một lần ghi hoặc <code>TCP_NODELAY</code> sửa được (8,4 s → 0,028 s).</li>
<li>strace có thể làm chương trình nhiều syscall chậm hơn 100 lần; dùng <code>--seccomp-bpf</code> với bộ lọc hẹp, gắn ngắn, hoặc eBPF.</li>
<li>ltrace cho thấy lời gọi thư viện; phần lớn chúng không bao giờ tới nhân.</li>
</ul>
${L('https://man7.org/linux/man-pages/man1/strace.1.html', '📄', 'man 1 strace', 'Mọi cờ: -f, -Z, -p, -T, -tt, -c, -y, -k, --seccomp-bpf.', 'Mở')}
${L('https://man7.org/linux/man-pages/man7/tcp.7.html', '📄', 'man 7 tcp', 'TCP_NODELAY, TCP_QUICKACK và báo nhận trễ.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 11.4 — Giá một syscall, vDSO, gộp lời gọi ───────────────────────── */
    {
      title: '11.4 — What a syscall costs: the vDSO, batching, sendfile and copy_file_range|||11.4 — Một syscall tốn bao nhiêu: vDSO, gộp lời gọi, sendfile và copy_file_range',
      slug: 'os-11-5-chi-phi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đo vòng đi-về theo chín cách (lời gọi hàm 2 ns, syscall ~175–200 ns dù qua libc hay svc tự viết, vDSO ~18 ns); strace chứng minh clock_gettime/gettimeofday không vào nhân; chép vDSO ra và đọc ký hiệu; Node/Python/Java đọc giờ 0 syscall; nguồn đồng hồ không đọc được thì vDSO lùi về syscall; 100.000 dòng: write từng dòng 31,7 ms vs writev/stdio/một write lớn ~1,6–2,2 ms; FileOutputStream vs BufferedOutputStream; chép 256 MiB bằng read/write vs sendfile/copy_file_range, và runtime đã dùng copy_file_range; ngân sách syscall tính nhẩm.',
      content: `${G114}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>What a syscall costs — and how to cross the boundary less often</h2>
<p class="lead"><a href="${OS('os-1-3-che-do')}">Lesson 1.3</a> measured one <code>getppid</code> at ~190 ns and stated the rule "syscalls are expensive, so batch them". This lesson makes the rule precise: <strong>what exactly costs 180 ns, which calls skip the toll entirely, and how much do batching, buffered streams and in-kernel copies actually save?</strong> Every number comes from the lab, so you can redo the arithmetic for your own server.</p>

<h3>The round trip, measured nine ways</h3>
<p>One program times a million iterations of each call and keeps the fastest of five runs:</p>
${src('ch11/cost.c', 'c')}
${run('c114-chi-phi', 'gcc -O2 -Wall cost.c')}
<p>Three things stand out. A plain function call costs 2 ns. <strong>Every real system call costs ~175–200 ns</strong>, about 85× more — and it does not matter whether it goes through libc's <code>getppid()</code>, the generic <code>syscall()</code> or our own <code>svc #0</code>: the price is the trip, not the wrapper. Saving and restoring registers, switching privilege level, the kernel's entry checks (and on x86 CPUs, the Spectre/Meltdown mitigations added in 2018, which made this trip noticeably more expensive) dominate. Doing actual work inside — writing 1 byte to <code>/dev/null</code>, reading 1 byte from <code>/dev/zero</code> — adds only ~20 ns. And the two clock functions cost <strong>~18 ns</strong>, ten times less than a syscall, while the same clock read forced through <code>syscall(SYS_clock_gettime)</code> costs 202 ns.</p>
${lab('latency', 'default', 'en', 'Place the numbers you just measured on the ladder: ~2 ns call, ~18 ns vDSO clock, ~180 ns syscall — all far below a RAM miss chain or an SSD read, but they add up when multiplied by millions.', { tour: 'latency-start' })}

<h3>The vDSO: system calls that never enter the kernel</h3>
<p>Why is the clock cheap? Run the same program under strace with 10,000 iterations of each:</p>
${run('c114-chi-phi', 'strace -c -o cost.sc')}
<p>The three <code>getppid</code> variants show up 30,000 times. Of the three clock measurements, only the forced <code>syscall()</code> appears — 10,000 calls; <code>clock_gettime()</code> and <code>gettimeofday()</code> made 20,000 calls that the kernel never saw. They ran in the <strong>vDSO</strong> ("virtual dynamic shared object"), a small library the kernel maps into every process. We can copy it out of our own memory and read its symbol table:</p>
${src('ch11/vdso.c', 'c')}
${run('c114-chi-phi', 'gcc -O2 vdso.c')}
${run('c114-chi-phi', 'cat /sys/devices/system/clocksource')}
<p>8 KiB of code exporting <code>__kernel_clock_gettime</code>, <code>__kernel_gettimeofday</code>, <code>__kernel_clock_getres</code>, <code>__kernel_getrandom</code> and the signal-return trampoline. The kernel keeps the current time on a page shared read-only with every process; the vDSO function reads that page and the CPU's counter register (<code>arch_sys_counter</code> on arm64, the TSC on x86) and computes the time without a trap. glibc picks the vDSO version automatically — and so does every runtime:</p>
${run('c114-chi-phi', "strace -f -qq -e trace=clock_gettime,gettimeofday -o k.txt node")}
${run('c114-chi-phi', "strace -f -qq -e trace=clock_gettime,gettimeofday -o k.txt python3")}
${run('c114-chi-phi', 'javac Clock.java')}
<p>Two million clock reads in each language, zero clock syscalls. Timestamps in request logs, latency metrics, <code>performance.now()</code> around a query — practically free.</p>
${lab('syscall', 'vdso', 'en', 'clock_gettime through the vDSO: no trap — the time is read from a page the kernel shares with every process, about 18.5 ns. Force a real syscall and the same read costs about 202 ns.', { tour: 'syscall-journey' })}

<div class="pitfall co-tieu-de">
<p><strong>A clock source the vDSO cannot read.</strong> The fast path only works if user space can read the hardware clock. On some virtual machines the kernel's clock source is one it must read itself (for example <code>xen</code> or <code>hpet</code>), and then every <code>clock_gettime</code> silently falls back to a real syscall — 10× slower, and a service that timestamps every request, every log line and every metric pays it millions of times per minute. Check <code>/sys/devices/system/clocksource/clocksource0/current_clocksource</code> and <code>available_clocksource</code> on your VPS, and verify the way we did: <code>strace -c</code> on a loop of clock reads should show <em>no</em> <code>clock_gettime</code>.</p>
</div>

<h3>Batching: the same bytes in fewer crossings</h3>
<p>When a syscall is unavoidable, make each one carry more. This program writes 100,000 lines of 32 bytes four ways — one <code>write()</code> per line, <code>writev()</code> with 64 lines per call, stdio's buffered <code>fputs</code>, and one big <code>write()</code>:</p>
${src('ch11/batch.c', 'c')}
${run('c114-chi-phi', 'gcc -O2 -Wall batch.c')}
${run('c114-chi-phi', 'for m in line writev stdio big; do strace')}
<p>One syscall per line: 31.7 ms, 317 ns per line — almost exactly the round-trip cost. Any batching: 1.6–2.2 ms, <strong>15–20× faster</strong>. <code>writev</code> sends 64 separate buffers in one call (no copying them together first — it is how Node wrote headers and body in lesson 11.3); stdio fills a 4,096-byte buffer and writes it (3.2 MB ÷ 4,096 ≈ 782 writes, plus 1 for the result line). The one big write is not faster than writev here because it first copies 3.2 MB into a new buffer. The same lesson in Java, where it bites most often:</p>
${lab('syscall', 'batch', 'en', 'Batching on the journey: writev carries 64 buffers through one crossing instead of 64. Compare the cost counter with single writes, and the 100,000-line table.', { tour: 'syscall-journey' })}
${src('ch11/Ghi.java', 'java')}
${run('c114-chi-phi', 'javac Ghi.java')}
${run('c114-chi-phi', 'strace -f -qq -c -e trace=write -o g.sc java Ghi raw', 2)}
<p>A raw <code>FileOutputStream</code> turns each <code>write(byte[])</code> into a <code>write()</code> syscall — 100,022 of them, including the JVM's own. Wrapped in a <code>BufferedOutputStream</code> (8 KiB), the same bytes need 398 calls and run 5.8× faster. <code>BufferedWriter</code>, <code>PrintWriter</code> over a buffered stream, and logging frameworks with buffered appenders exist for exactly this reason.</p>

<h3>Copying without copying: sendfile and copy_file_range</h3>
<p>The most common "batch" in a backend is moving a file: serving an upload, copying a backup, streaming a static asset. With <code>read</code> + <code>write</code>, every byte crosses into your buffer and back out. Two calls let the kernel move the data itself:</p>
${src('ch11/copy.c', 'c')}
${run('c114-chi-phi', 'gcc -O2 -Wall copy.c')}
${run('c114-chi-phi', 'for m in rw4k rw128k sendfile cfr; do ./copy', 2)}
<p>256 MiB already in the page cache (lesson 9.3). With 4 KiB chunks: 131,073 syscalls and 0.132 s; with 128 KiB: 4,097 syscalls and 0.046 s — bigger chunks recover most of the loss. <code>sendfile</code> (file → socket or file) and <code>copy_file_range</code> (file → file) do it in <strong>one call</strong> without the data ever entering user space: 0.038–0.039 s, and on file systems that support it (Btrfs, XFS, NFS) <code>copy_file_range</code> can even share the blocks instead of copying them. You rarely call them yourself, because your runtime already does:</p>
${run('c114-chi-phi', "strace -f -qq -c -e trace=read,write,sendfile,copy_file_range -o n.sc node")}
${run('c114-chi-phi', "strace -f -qq -c -e trace=read,write,sendfile,copy_file_range -o p.sc python3")}
${run('c114-chi-phi', 'javac Chep.java')}
<p><code>fs.copyFileSync</code>, <code>shutil.copyfile</code> and <code>Files.copy</code> each handed the whole job to <code>copy_file_range</code>. The thing to avoid is the hand-written loop — <code>readFileSync</code> then <code>writeFileSync</code>, or a stream piped through your own transform — when a plain copy would do. nginx serves static files with <code>sendfile</code> for the same reason (Chapter 10).</p>

<h3>A budget you can do in your head</h3>
<table>
<tr><th></th><th>cost here</th><th>one million per second costs</th></tr>
<tr><td>function call</td><td>~2 ns</td><td>0.2% of one core</td></tr>
<tr><td>vDSO clock read</td><td>~18 ns</td><td>1.8% of one core</td></tr>
<tr><td>system call round trip</td><td>~180–200 ns</td><td><strong>18–20% of one core</strong></td></tr>
<tr><td>context switch on one core (<a href="${OS('os-3-3-context-switch')}">lesson 3.3</a>)</td><td>~1 µs</td><td>a whole core</td></tr>
</table>
<p>A Node server at 10,000 requests/s × ~3 syscalls = 30,000 syscalls/s ≈ 0.5% of a core; the JDK server's 15 per request ≈ 2.7%. Syscalls are rarely the bottleneck of a well-built server — they become one when you make one per <strong>byte</strong>, per <strong>row</strong> or per <strong>log line</strong>.</p>

<div class="pitfall co-tieu-de">
<p><strong>Buffering makes it fast — not safe.</strong> Every batching technique above keeps data in <em>your</em> process first (stdio, BufferedOutputStream, a logger's queue) and then in the page cache. A crash or <code>kill -9</code> loses the first (lesson 11.1); a power cut can lose the second (lesson 9.3). Decide separately: buffer for speed, <code>flush()</code> where a reader must see the data (end of a request, before acknowledging a message), and <code>fsync()</code> only what must survive a power cut.</p>
</div>

<h3>🧪 Practice (25–30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a CSV export endpoint in a Java/Spring service writes 200,000 rows and takes several seconds; profiling shows little CPU in your code. A teammate suspects the database.</p>
<ol>
<li>Write a small Java (or Node) program that writes 200,000 rows to a file with one <code>write</code> per row, unbuffered. Time it and count writes with <code>strace -f -c -e trace=write</code>.</li>
<li>Wrap the stream in <code>BufferedWriter</code>/<code>BufferedOutputStream</code> (Node: build chunks, or use a write stream) and measure again.</li>
<li>Copy the result file with <code>Files.copy</code> or <code>fs.copyFileSync</code> under strace; confirm it uses <code>copy_file_range</code>.</li>
<li>On your VPS (or the lab), print <code>current_clocksource</code> and check with <code>strace -c</code> that a loop of <code>Date.now()</code> makes no clock syscalls.</li>
</ol>
<p><strong>Done when:</strong> you show syscall counts and times before/after buffering (expect 10×+ fewer calls), the <code>copy_file_range</code> line, and the clocksource check — and can tell your teammate where the seconds really went.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['syscall round trip', 'Entering and leaving the kernel once: ~180–200 ns here, ~85× a function call, regardless of the wrapper.'],
  ['vDSO', 'Kernel code mapped into every process; clock_gettime/gettimeofday run there without a syscall (~18 ns).'],
  ['clocksource', 'The hardware clock the kernel uses; the vDSO is fast only if user space can read it (tsc, arch_sys_counter).'],
  ['writev / iovec', 'Write several separate buffers in one syscall; how servers send headers + body together.'],
  ['buffered stream', 'stdio, BufferedOutputStream, BufferedWriter: collect small writes, issue one large syscall.'],
  ['sendfile', 'Copy from a file to a socket (or file) inside the kernel, without passing through user space.'],
  ['copy_file_range', 'In-kernel file-to-file copy; used by fs.copyFileSync, shutil.copyfile and Files.copy.'],
  ['flush vs fsync', 'flush moves your buffer into the kernel; fsync moves the kernel’s cache to the disk.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>A system call costs ~180–200 ns on this machine, no matter how you make it; doing the work inside often costs much less than crossing.</li>
<li>clock_gettime/gettimeofday run in the vDSO (~18 ns, zero syscalls) in C, Node, Python and Java — if the clocksource allows it.</li>
<li>Batching (writev, stdio, Buffered streams, one big write) cut 100,000 writes to hundreds and ran 15–20× faster.</li>
<li>sendfile and copy_file_range copy without touching user space; runtimes already use them — avoid hand-written copy loops.</li>
<li>Budget: 1 million syscalls/s ≈ a fifth of a core. Per request it is cheap; per byte or per line it is not. Fast ≠ durable.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/vdso.7.html', '📄', 'man 7 vdso', 'Which functions the vDSO exports on each architecture, and how it is found.', 'Open')}
${L('https://man7.org/linux/man-pages/man2/copy_file_range.2.html', '📄', 'man 2 copy_file_range', 'In-kernel copies between files, and when they can share blocks.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Một syscall tốn bao nhiêu — và cách băng qua ranh giới ít lần hơn</h2>
<p class="lead"><a href="${OS('os-1-3-che-do')}">Bài 1.3</a> đo một lần <code>getppid</code> ở ~190 ns và nêu luật "syscall đắt, nên gộp lại". Bài này làm luật đó chính xác: <strong>cái gì đúng ra tốn 180 ns, lời gọi nào né được hẳn khoản phí, và gộp lời gọi, luồng có đệm, chép trong nhân thật sự tiết kiệm bao nhiêu?</strong> Mọi con số đều lấy từ lab, nên bạn làm lại được phép tính cho máy chủ của mình.</p>

<h3>Vòng đi-về, đo theo chín cách</h3>
<p>Một chương trình bấm giờ một triệu lần lặp cho mỗi lời gọi và giữ lượt nhanh nhất trong năm lượt:</p>
${src('ch11/cost.c', 'c')}
${run('c114-chi-phi', 'gcc -O2 -Wall cost.c')}
<p>Ba điều nổi bật. Một lời gọi hàm thường tốn 2 ns. <strong>Mọi lời gọi hệ thống thật tốn ~175–200 ns</strong>, gấp khoảng 85 lần — và đi qua <code>getppid()</code> của libc, <code>syscall()</code> chung hay <code>svc #0</code> tự viết đều như nhau: cái giá là chuyến đi, không phải hàm bọc. Cất và khôi phục thanh ghi, đổi mức đặc quyền, các bước kiểm tra ở cửa vào của nhân (và trên CPU x86, các bản vá Spectre/Meltdown thêm năm 2018 làm chuyến đi này đắt lên thấy rõ) chiếm phần lớn. Làm việc thật bên trong — ghi 1 byte vào <code>/dev/null</code>, đọc 1 byte từ <code>/dev/zero</code> — chỉ thêm ~20 ns. Còn hai hàm đồng hồ tốn <strong>~18 ns</strong>, rẻ hơn syscall mười lần, trong khi cùng lần đọc giờ đó bị ép qua <code>syscall(SYS_clock_gettime)</code> tốn 202 ns.</p>
${lab('latency', 'default', 'vi', 'Đặt những con số vừa đo lên thang: ~2 ns lời gọi hàm, ~18 ns đồng hồ vDSO, ~180 ns syscall — đều thấp xa so với một chuỗi trượt RAM hay một lần đọc SSD, nhưng nhân lên hàng triệu lần thì thành đáng kể.', { tour: 'latency-start' })}

<h3>vDSO: những lời gọi hệ thống không bao giờ vào nhân</h3>
<p>Vì sao đồng hồ rẻ? Chạy cùng chương trình dưới strace, mỗi phép đo 10.000 vòng:</p>
${run('c114-chi-phi', 'strace -c -o cost.sc')}
<p>Ba kiểu <code>getppid</code> hiện ra 30.000 lần. Trong ba phép đo đồng hồ, chỉ bản <code>syscall()</code> bị ép xuất hiện — 10.000 lời gọi; <code>clock_gettime()</code> và <code>gettimeofday()</code> đã gọi 20.000 lần mà nhân không hề thấy. Chúng chạy trong <strong>vDSO</strong> ("virtual dynamic shared object"), một thư viện nhỏ nhân ánh xạ vào mọi tiến trình. Ta chép được nó ra khỏi bộ nhớ của chính mình và đọc bảng ký hiệu:</p>
${src('ch11/vdso.c', 'c')}
${run('c114-chi-phi', 'gcc -O2 vdso.c')}
${run('c114-chi-phi', 'cat /sys/devices/system/clocksource')}
<p>8 KiB mã xuất ra <code>__kernel_clock_gettime</code>, <code>__kernel_gettimeofday</code>, <code>__kernel_clock_getres</code>, <code>__kernel_getrandom</code> và đoạn đệm quay về từ tín hiệu. Nhân giữ giờ hiện tại trên một trang chia sẻ chỉ-đọc với mọi tiến trình; hàm vDSO đọc trang đó cùng thanh ghi bộ đếm của CPU (<code>arch_sys_counter</code> trên arm64, TSC trên x86) rồi tính ra giờ mà không cần sập bẫy. glibc tự chọn bản vDSO — và mọi runtime cũng vậy:</p>
${run('c114-chi-phi', "strace -f -qq -e trace=clock_gettime,gettimeofday -o k.txt node")}
${run('c114-chi-phi', "strace -f -qq -e trace=clock_gettime,gettimeofday -o k.txt python3")}
${run('c114-chi-phi', 'javac Clock.java')}
<p>Hai triệu lần đọc đồng hồ ở mỗi ngôn ngữ, không một syscall đồng hồ nào. Dấu thời gian trong log request, số đo độ trễ, <code>performance.now()</code> quanh một câu truy vấn — gần như miễn phí.</p>
${lab('syscall', 'vdso', 'vi', 'clock_gettime qua vDSO: không bẫy — thời gian được đọc từ một trang nhân chia sẻ với mọi tiến trình, khoảng 18,5 ns. Ép một syscall thật thì cùng lần đọc đó tốn khoảng 202 ns.', { tour: 'syscall-journey' })}

<div class="pitfall co-tieu-de">
<p><strong>Một nguồn đồng hồ vDSO không đọc được.</strong> Đường nhanh chỉ chạy khi phía người dùng đọc được đồng hồ phần cứng. Trên một số máy ảo, nguồn đồng hồ của nhân là loại nhân phải tự đọc (ví dụ <code>xen</code> hay <code>hpet</code>), và khi đó mỗi <code>clock_gettime</code> lặng lẽ lùi về một syscall thật — chậm gấp 10, và một dịch vụ gắn dấu giờ cho mọi request, mọi dòng log, mọi số đo sẽ trả cái giá đó hàng triệu lần mỗi phút. Hãy xem <code>/sys/devices/system/clocksource/clocksource0/current_clocksource</code> và <code>available_clocksource</code> trên VPS của bạn, và kiểm theo cách ta vừa làm: <code>strace -c</code> trên một vòng đọc giờ phải <em>không</em> có <code>clock_gettime</code> nào.</p>
</div>

<h3>Gộp lời gọi: cùng số byte, ít lần băng qua hơn</h3>
<p>Khi không tránh được syscall, hãy để mỗi lần chở được nhiều hơn. Chương trình này ghi 100.000 dòng 32 byte theo bốn cách — mỗi dòng một <code>write()</code>, <code>writev()</code> mỗi lần 64 dòng, <code>fputs</code> có đệm của stdio, và một <code>write()</code> lớn:</p>
${src('ch11/batch.c', 'c')}
${run('c114-chi-phi', 'gcc -O2 -Wall batch.c')}
${run('c114-chi-phi', 'for m in line writev stdio big; do strace')}
<p>Mỗi dòng một syscall: 31,7 ms, 317 ns mỗi dòng — gần đúng bằng giá một vòng đi-về. Gộp kiểu gì cũng được: 1,6–2,2 ms, <strong>nhanh hơn 15–20 lần</strong>. <code>writev</code> gửi 64 bộ đệm riêng rẽ trong một lời gọi (không phải chép chúng vào một chỗ trước — chính là cách Node gửi header và thân cùng lúc ở bài 11.3); stdio đổ đầy bộ đệm 4.096 byte rồi mới ghi (3,2 MB ÷ 4.096 ≈ 782 lần, cộng 1 cho dòng kết quả). Một lần write lớn không nhanh hơn writev ở đây vì nó phải chép 3,2 MB vào một bộ đệm mới trước. Bài học y vậy ở Java, nơi nó hay cắn nhất:</p>
${lab('syscall', 'batch', 'vi', 'Gộp lượt trên hành trình: writev mang 64 bộ đệm qua một lần vượt ranh giới thay vì 64 lần. So bộ đếm giá với các lần write đơn, và bảng 100.000 dòng.', { tour: 'syscall-journey' })}
${src('ch11/Ghi.java', 'java')}
${run('c114-chi-phi', 'javac Ghi.java')}
${run('c114-chi-phi', 'strace -f -qq -c -e trace=write -o g.sc java Ghi raw', 2)}
<p>Một <code>FileOutputStream</code> trần biến mỗi <code>write(byte[])</code> thành một syscall <code>write()</code> — 100.022 lần, tính cả của chính JVM. Bọc trong <code>BufferedOutputStream</code> (8 KiB), cùng số byte chỉ cần 398 lời gọi và nhanh hơn 5,8 lần. <code>BufferedWriter</code>, <code>PrintWriter</code> trên một luồng có đệm, và các framework log với appender có đệm tồn tại đúng vì lý do này.</p>

<h3>Chép mà không chép: sendfile và copy_file_range</h3>
<p>"Gộp" hay gặp nhất ở backend là chuyển một file: phục vụ file tải lên, chép bản sao lưu, phát một tài nguyên tĩnh. Với <code>read</code> + <code>write</code>, mọi byte băng vào bộ đệm của bạn rồi lại băng ra. Hai lời gọi cho phép nhân tự chuyển dữ liệu:</p>
${src('ch11/copy.c', 'c')}
${run('c114-chi-phi', 'gcc -O2 -Wall copy.c')}
${run('c114-chi-phi', 'for m in rw4k rw128k sendfile cfr; do ./copy', 2)}
<p>256 MiB đã nằm sẵn trong page cache (bài 9.3). Khối 4 KiB: 131.073 syscall và 0,132 s; khối 128 KiB: 4.097 syscall và 0,046 s — khối lớn hơn gỡ lại phần lớn thiệt hại. <code>sendfile</code> (file → socket hoặc file) và <code>copy_file_range</code> (file → file) làm trong <strong>một lời gọi</strong> mà dữ liệu không hề vào vùng người dùng: 0,038–0,039 s, và trên hệ thống file hỗ trợ (Btrfs, XFS, NFS) <code>copy_file_range</code> còn có thể dùng chung khối thay vì chép. Bạn hiếm khi tự gọi chúng, vì runtime đã gọi rồi:</p>
${run('c114-chi-phi', "strace -f -qq -c -e trace=read,write,sendfile,copy_file_range -o n.sc node")}
${run('c114-chi-phi', "strace -f -qq -c -e trace=read,write,sendfile,copy_file_range -o p.sc python3")}
${run('c114-chi-phi', 'javac Chep.java')}
<p><code>fs.copyFileSync</code>, <code>shutil.copyfile</code> và <code>Files.copy</code> đều giao trọn việc cho <code>copy_file_range</code>. Cái cần tránh là vòng lặp tự viết — <code>readFileSync</code> rồi <code>writeFileSync</code>, hay một luồng đi qua transform của chính bạn — khi chỉ cần chép thẳng. nginx phục vụ file tĩnh bằng <code>sendfile</code> cũng vì lý do này (Chương 10).</p>

<h3>Ngân sách tính nhẩm được</h3>
<table>
<tr><th></th><th>giá ở đây</th><th>một triệu lần mỗi giây tốn</th></tr>
<tr><td>lời gọi hàm</td><td>~2 ns</td><td>0,2% một lõi</td></tr>
<tr><td>đọc đồng hồ vDSO</td><td>~18 ns</td><td>1,8% một lõi</td></tr>
<tr><td>vòng đi-về syscall</td><td>~180–200 ns</td><td><strong>18–20% một lõi</strong></td></tr>
<tr><td>chuyển ngữ cảnh trên một lõi (<a href="${OS('os-3-3-context-switch')}">bài 3.3</a>)</td><td>~1 µs</td><td>cả một lõi</td></tr>
</table>
<p>Một máy chủ Node 10.000 request/giây × ~3 syscall = 30.000 syscall/giây ≈ 0,5% một lõi; 15 lời gọi mỗi request của máy chủ JDK ≈ 2,7%. Syscall hiếm khi là nút cổ chai của một máy chủ viết tốt — nó thành nút cổ chai khi bạn gọi một lần cho mỗi <strong>byte</strong>, mỗi <strong>dòng dữ liệu</strong> hay mỗi <strong>dòng log</strong>.</p>

<div class="pitfall co-tieu-de">
<p><strong>Đệm làm nó nhanh — không làm nó an toàn.</strong> Mọi kỹ thuật gộp ở trên giữ dữ liệu trong tiến trình <em>của bạn</em> trước (stdio, BufferedOutputStream, hàng đợi của logger) rồi tới page cache. Sập hay <code>kill -9</code> làm mất phần thứ nhất (bài 11.1); mất điện có thể làm mất phần thứ hai (bài 9.3). Hãy quyết định riêng: đệm để nhanh, <code>flush()</code> ở chỗ bên đọc phải thấy dữ liệu (cuối một request, trước khi báo đã nhận một thông điệp), và chỉ <code>fsync()</code> những gì phải sống qua mất điện.</p>
</div>

<h3>🧪 Thực hành (25–30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một endpoint xuất CSV trong dịch vụ Java/Spring ghi 200.000 dòng và mất vài giây; profile cho thấy mã của bạn tốn rất ít CPU. Một bạn nghi do CSDL.</p>
<ol>
<li>Viết một chương trình Java (hoặc Node) nhỏ ghi 200.000 dòng vào file, mỗi dòng một <code>write</code>, không đệm. Đo giờ và đếm lần ghi bằng <code>strace -f -c -e trace=write</code>.</li>
<li>Bọc luồng trong <code>BufferedWriter</code>/<code>BufferedOutputStream</code> (Node: dựng thành từng khối, hoặc dùng write stream) rồi đo lại.</li>
<li>Chép file kết quả bằng <code>Files.copy</code> hoặc <code>fs.copyFileSync</code> dưới strace; xác nhận nó dùng <code>copy_file_range</code>.</li>
<li>Trên VPS (hoặc lab), in <code>current_clocksource</code> và kiểm bằng <code>strace -c</code> rằng một vòng <code>Date.now()</code> không có syscall đồng hồ nào.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn cho thấy số syscall và thời gian trước/sau khi đệm (mong đợi ít hơn 10 lần trở lên), dòng <code>copy_file_range</code>, và kết quả kiểm nguồn đồng hồ — và nói được cho bạn mình mấy giây đó thật ra đi đâu.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['syscall round trip (vòng đi-về syscall)', 'Vào rồi ra khỏi nhân một lần: ~180–200 ns ở đây, ~85 lần lời gọi hàm, bất kể hàm bọc.'],
  ['vDSO', 'Mã của nhân ánh xạ vào mọi tiến trình; clock_gettime/gettimeofday chạy ở đó mà không cần syscall (~18 ns).'],
  ['clocksource (nguồn đồng hồ)', 'Đồng hồ phần cứng nhân dùng; vDSO chỉ nhanh khi phía người dùng đọc được nó (tsc, arch_sys_counter).'],
  ['writev / iovec', 'Ghi nhiều bộ đệm riêng rẽ trong một syscall; cách máy chủ gửi header + thân cùng lúc.'],
  ['buffered stream (luồng có đệm)', 'stdio, BufferedOutputStream, BufferedWriter: gom những lần ghi nhỏ, phát một syscall lớn.'],
  ['sendfile', 'Chép từ file sang socket (hoặc file) ngay trong nhân, không đi qua vùng người dùng.'],
  ['copy_file_range', 'Chép file sang file trong nhân; fs.copyFileSync, shutil.copyfile và Files.copy dùng nó.'],
  ['flush vs fsync', 'flush đẩy bộ đệm của bạn vào nhân; fsync đẩy cache của nhân xuống đĩa.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một lời gọi hệ thống tốn ~180–200 ns trên máy này, gọi kiểu gì cũng vậy; làm việc bên trong thường tốn ít hơn nhiều so với việc băng qua.</li>
<li>clock_gettime/gettimeofday chạy trong vDSO (~18 ns, không syscall) ở C, Node, Python và Java — nếu nguồn đồng hồ cho phép.</li>
<li>Gộp lời gọi (writev, stdio, luồng Buffered, một lần write lớn) giảm 100.000 lần ghi xuống vài trăm và nhanh hơn 15–20 lần.</li>
<li>sendfile và copy_file_range chép mà không chạm vùng người dùng; runtime đã dùng sẵn — đừng tự viết vòng lặp chép.</li>
<li>Ngân sách: 1 triệu syscall/giây ≈ một phần năm lõi. Tính theo request thì rẻ; theo byte hay theo dòng thì không. Nhanh ≠ bền.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/vdso.7.html', '📄', 'man 7 vdso', 'vDSO xuất những hàm nào trên từng kiến trúc, và được tìm ra sao.', 'Mở')}
${L('https://man7.org/linux/man-pages/man2/copy_file_range.2.html', '📄', 'man 2 copy_file_range', 'Chép giữa các file trong nhân, và khi nào chúng dùng chung khối.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 11.5 — errno, tín hiệu, EINTR, EAGAIN ───────────────────────── */
    {
      title: '11.5 — errno and signals: EINTR, SA_RESTART, EAGAIN, EPIPE|||11.5 — errno và tín hiệu: EINTR, SA_RESTART, EAGAIN, EPIPE',
      slug: 'os-11-6-errno-tin-hieu',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Các errno lập trình viên backend hay gặp (in thật từ Python); tín hiệu tới giữa read() đang chặn: không SA_RESTART ⇒ -1 EINTR rồi tự hỏi lại, có SA_RESTART ⇒ nhân tự chạy lại (strace thấy ERESTARTSYS, rt_sigreturn), poll luôn EINTR; Python tự thử lại (PEP 475), Go tự gửi SIGURG để giành CPU (49 lần/1,5 s); EAGAIN của read không chặn vs bên đọc chặn nhìn từ /proc (wchan, syscall); EPIPE và SIGPIPE (gnuyes bị giết, Python BrokenPipeError, MSG_NOSIGNAL) — mở đường cho Chương 10.',
      content: `${G115}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.5</span>
<h2>When a system call does not simply succeed: errno, signals, EINTR, EAGAIN</h2>
<p class="lead">Lesson 11.1 showed how a failure travels back: the kernel returns <code>-errno</code>, libc turns it into <code>-1</code> + <code>errno</code>. But not every −1 is a failure. A blocking call can be <strong>interrupted</strong> by a signal; a non-blocking call can say <strong>"not now"</strong>; a write can find that the reader <strong>has left</strong>. This lesson answers: <strong>which errno values are real errors, which mean "try again", and what exactly happens when a signal arrives while your program waits inside the kernel?</strong> It ends where <a href="${OS('os-10-2-blocking')}">Chapter 10</a> (epoll, io_uring) begins.</p>

<h3>errno: the kernel's error vocabulary</h3>
${run('c115-eintr', 'python3 -c')}
<p>These numbers come straight from the kernel's headers (Python just names them), and they are what your logs show behind every <code>ENOENT</code>, <code>EACCES</code> or <code>ECONNREFUSED</code>. You have met most of them in earlier chapters: <code>EMFILE</code> in <a href="${OS('os-2-5-mang-fd')}">lesson 2.5</a>, <code>ENOSPC</code> in lesson 2.4, <code>EACCES</code>/<code>EPERM</code> in Chapter 9. Two are different in kind: <strong>EINTR</strong> (4) and <strong>EAGAIN</strong> (11) do not say "this failed", they say "try again" — one because a signal interrupted you, one because nothing is ready yet.</p>

<h3>A signal arrives while read() is waiting</h3>
<p>The experiment: a child writes "data" into a pipe after 2 seconds; the parent installs a handler for <code>SIGALRM</code> (with or without the <code>SA_RESTART</code> flag), asks for an alarm in 1 second, and blocks in <code>read()</code>:</p>
${src('ch11/eintr.c', 'c')}
${run('c115-eintr', 'gcc -O2 -Wall eintr.c')}
<p>At 1.0 s <code>read()</code> returned −1 with "Interrupted system call"; the loop asked again and got the 5 bytes at 2.0 s. strace shows what happened inside:</p>
${run('c115-eintr', 'strace -qq -e trace=read,rt_sigreturn ./eintr norestart')}
<p>The read was sleeping in the kernel when the signal arrived. The kernel aborted it with <code>ERESTARTSYS</code> — an internal code that means "interrupted; may be restarted if the handler allows it" and that user space never sees directly — and delivered <code>SIGALRM</code>: it built a signal frame, ran our (empty) handler in user mode, and the handler returned through <code>rt_sigreturn</code>. Because the handler was installed <strong>without</strong> <code>SA_RESTART</code>, the kernel then completed the interrupted read as <code>-1 EINTR</code>. Now the same program with <code>SA_RESTART</code>:</p>
${run('c115-eintr', 'strace -qq -e trace=read,rt_sigreturn ./eintr restart')}
<p><code>rt_sigreturn</code> returned 3 — the original first argument, the pipe's fd, put back into x0 — and the kernel re-executed the same <code>read</code>. The program never saw the interruption. But not every call can be restarted:</p>
${run('c115-eintr', 'strace -qq -e trace=ppoll,rt_sigreturn ./eintr poll')}
<p><code>ERESTARTNOHAND</code>, then <code>-1 EINTR</code> despite <code>SA_RESTART</code>. <code>man 7 signal</code> lists the calls that are <strong>never</strong> restarted: <code>poll</code>, <code>epoll_wait</code>, <code>select</code>, <code>nanosleep</code>/<code>clock_nanosleep</code>, <code>sigtimedwait</code> and a few socket calls with timeouts. They all wait with a deadline, and silently restarting would extend it. Every event loop's wait call must therefore treat EINTR as "loop again".</p>
${lab('eintr', 'norestart', 'en', 'read() blocked for 2 s, SIGALRM at 1 s: without SA_RESTART the kernel aborts with ERESTARTSYS, runs the handler, and read returns EINTR; with SA_RESTART rt_sigreturn puts the fd back and the read restarts; poll returns EINTR either way.', { tour: 'eintr-signal' })}

<div class="pitfall co-tieu-de">
<p><strong>"Interrupted system call" crashes that appear only sometimes.</strong> A C program, a native addon or a hand-written Go syscall that treats every −1 as fatal works in testing and then fails in production — when a profiler sends <code>SIGPROF</code>, a child exits (<code>SIGCHLD</code>), someone resizes the terminal (<code>SIGWINCH</code>) or a supervisor sends a signal. The fix is boring and universal: on <code>EINTR</code>, call again (or install handlers with <code>SA_RESTART</code>, which still does not cover the wait calls above).</p>
</div>

<h3>Runtimes retry for you — and Go sends signals to itself</h3>
${src('ch11/pyeintr.py', 'python')}
${run('c115-eintr', 'strace -qq -e trace=read,rt_sigreturn -e signal=SIGALRM python3')}
<p>Python installs handlers <em>without</em> <code>SA_RESTART</code>, so the kernel returns EINTR — and then CPython runs your Python-level handler and calls <code>read()</code> again by itself. That is <a href="https://peps.python.org/pep-0475/" target="_blank" rel="noopener">PEP 475</a> (Python 3.5): you never see EINTR in Python code. libuv retries inside Node, and the JVM's native layer retries for Java. (The text "handler ran" is printed after the read only because stdout is a pipe — lesson 11.1.)</p>
<p>Go goes further: it uses signals for its own scheduling. Two goroutines spinning on one thread (<code>GOMAXPROCS=1</code>) cannot be switched cooperatively, so since Go 1.14 the runtime interrupts the running thread with <code>SIGURG</code>:</p>
${src('ch11/spin.go', 'go')}
${run('c115-eintr', 'TIMEFORMAT', 3)}
<p>49 <code>SIGURG</code> in 1.5 s — about 33 per second, sent by the process to itself (<code>SI_TKILL</code>, same pid). Each one interrupts whatever the thread is doing, including a slow system call. The Go 1.14 release notes warned exactly about this: programs using <code>syscall</code> or <code>golang.org/x/sys/unix</code> directly "will see more slow system calls fail with EINTR errors". The standard library retries; your raw calls must too.</p>
${lab('eintr', 'go', 'en', 'Go’s preemption signal on a timeline: two spinning goroutines on one thread, SIGURG about 33 times a second (49 in 1.475 s), each one interrupting whatever the thread is doing — a slow system call included.', { tour: 'eintr-signal' })}

<h3>EAGAIN: "not now" instead of waiting</h3>
<p>The other "try again" comes from <strong>non-blocking</strong> I/O. The same empty pipe, read two ways:</p>
${src('ch11/nb.c', 'c')}
${run('c115-eintr', 'gcc -O2 -Wall nb.c')}
<p>With <code>O_NONBLOCK</code> the read returned <code>-1 EAGAIN</code> after 11 µs — the thread is free to do something else. The blocking reader sleeps inside the kernel, and <code>/proc</code> shows exactly where: <code>wchan</code> = <code>anon_pipe_read</code> (the kernel function it sleeps in) and <code>syscall</code> = <code>63 0x5 …</code> (read, on fd 5). Lesson 11.6 uses the same files to diagnose a hung process without strace.</p>
<p>A thread per connection that blocks in <code>read</code> works for a few hundred clients; for ten thousand you want the opposite: every socket non-blocking, and <strong>one</strong> call that waits until any of them is ready. You have already seen all the pieces in this chapter:</p>
<table>
<tr><th>seen in</th><th>call</th><th>result</th><th>meaning</th></tr>
<tr><td>11.2 (libuv)</td><td><code>connect()</code></td><td><code>-1 EINPROGRESS</code></td><td>started; the loop learns when it completes</td></tr>
<tr><td>11.2 (libuv)</td><td><code>accept4(…, SOCK_NONBLOCK)</code></td><td>new fd</td><td>the connection's socket will never block</td></tr>
<tr><td>11.3 (curl)</td><td><code>recvfrom()</code></td><td><code>-1 EAGAIN</code></td><td>nothing yet; wait in <code>ppoll</code></td></tr>
<tr><td>11.3 (Node)</td><td><code>epoll_pwait()</code></td><td>1 ready fd</td><td>one thread waits for all sockets</td></tr>
</table>
<p>That is the design of nginx, Node, Netty and Go's network poller. <a href="${OS('os-10-3-epoll')}">Chapter 10</a> builds an epoll echo server and compares it with io_uring; for now, the contract: <strong>EAGAIN means "wait for readiness, then retry" — never "fail"</strong>.</p>
${lab('eventloop', 'order', 'en', 'The poll phase is where the event loop waits — in epoll_pwait, the one blocking call. Timers, I/O callbacks and microtasks all run between two waits; an EINTR there just means "loop again".', { tour: 'eventloop-order' })}

<h3>EPIPE and SIGPIPE: writing to someone who left</h3>
${run('c115-eintr', 'strace -qq -o yes.txt')}
${run('c115-eintr', 'strace -qq -o py.txt')}
<p><code>head -1</code> read one line and exited; the next <code>write</code> into the pipe found no reader. The kernel returned <code>-1 EPIPE</code> <em>and</em> sent <code>SIGPIPE</code>, whose default action is to kill: GNU <code>yes</code> died (that is how shell pipelines stop early). Python ignores <code>SIGPIPE</code> at startup, so it got EPIPE and raised <code>BrokenPipeError</code>. Servers need the Python behaviour: a client that closes its connection in the middle of a response would otherwise kill the whole server. Node, Python and the JVM ignore SIGPIPE; C code calls <code>signal(SIGPIPE, SIG_IGN)</code> once, or passes <code>MSG_NOSIGNAL</code> to each <code>send</code> — exactly what curl's <code>sendto</code> did in lesson 11.3.</p>

<div class="pitfall co-tieu-de">
<p><strong>A C/C++ service that dies when a client disconnects.</strong> No core dump, no error log, exit status 141 (128 + 13, SIGPIPE) — and it happens only when users close browsers mid-download or a load balancer cuts idle connections. Ignore SIGPIPE at startup (or use <code>MSG_NOSIGNAL</code>) and handle <code>EPIPE</code>/<code>ECONNRESET</code> as "this client is gone". In shell scripts the same signal is useful: it is why <code>producer | head</code> stops the producer.</p>
</div>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a small C worker that reads jobs from a pipe logs "read failed: Interrupted system call" a few times a day and exits; it started after the team enabled a profiler that samples with signals.</p>
<ol>
<li>Compile <code>eintr.c</code> and reproduce the three outcomes (<code>norestart</code>, <code>restart</code>, <code>poll</code>) under <code>strace -e trace=read,ppoll,rt_sigreturn</code>.</li>
<li>Remove the retry loop from the <code>norestart</code> path and show that the program now "fails" at 1.0 s.</li>
<li>Run <code>pyeintr.py</code> and explain why Python never shows EINTR.</li>
<li>Make the worker robust: either an EINTR retry loop or <code>SA_RESTART</code>, and explain which calls <code>SA_RESTART</code> would not protect.</li>
</ol>
<p><strong>Done when:</strong> you have three strace outputs (ERESTARTSYS → EINTR, ERESTARTSYS → restarted, ERESTARTNOHAND → EINTR) and a fixed worker that survives a signal at any time.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['errno', 'The error number of the last failed call (ENOENT = 2, EINTR = 4, EAGAIN = 11, EPIPE = 32…).'],
  ['EINTR', 'A blocking call was interrupted by a signal handler; the call did nothing — retry it.'],
  ['SA_RESTART', 'sigaction flag: after the handler, the kernel restarts the interrupted call (not poll/epoll_wait/select/sleeps).'],
  ['ERESTARTSYS / ERESTARTNOHAND', 'Kernel-internal codes strace shows when a call is interrupted; user space gets EINTR or a restart.'],
  ['EAGAIN / EWOULDBLOCK', 'A non-blocking call has nothing to do yet; wait for readiness (poll/epoll), then retry.'],
  ['O_NONBLOCK', 'File status flag that turns waiting into EAGAIN; how event loops use sockets.'],
  ['EPIPE / SIGPIPE', 'Writing to a pipe or socket whose reader is gone: the call fails with EPIPE and SIGPIPE kills by default.'],
  ['async preemption', 'Go 1.14+: the runtime interrupts running goroutines with SIGURG — more EINTR for raw syscalls.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Most errno values are real failures; <strong>EINTR</strong> and <strong>EAGAIN</strong> mean "try again".</li>
<li>A signal during a blocking call: without SA_RESTART the call returns EINTR; with it the kernel restarts it — except wait calls like poll/epoll_wait, which always return EINTR.</li>
<li>Python (PEP 475), libuv and the JVM retry for you; C code and raw Go syscalls must, and Go itself sends SIGURG ~33 times a second under contention.</li>
<li>Non-blocking I/O returns EAGAIN instead of sleeping; servers combine it with one epoll wait — Chapter 10.</li>
<li>Writing to a closed pipe/socket gives EPIPE plus SIGPIPE; servers ignore SIGPIPE or use MSG_NOSIGNAL.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/signal.7.html', '📄', 'man 7 signal', 'Signal dispositions, SA_RESTART, and the list of calls that are never restarted.', 'Open')}
${L('https://man7.org/linux/man-pages/man3/errno.3.html', '📄', 'man 3 errno', 'Every errno name and what it means.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5</span>
<h2>Khi một lời gọi hệ thống không chỉ đơn giản là thành công: errno, tín hiệu, EINTR, EAGAIN</h2>
<p class="lead">Bài 11.1 cho thấy một lỗi đi về ra sao: nhân trả <code>-errno</code>, libc đổi thành <code>-1</code> + <code>errno</code>. Nhưng không phải −1 nào cũng là thất bại. Một lời gọi chặn có thể bị một tín hiệu <strong>cắt ngang</strong>; một lời gọi không chặn có thể nói <strong>"chưa phải lúc"</strong>; một lần ghi có thể phát hiện bên đọc <strong>đã bỏ đi</strong>. Bài này trả lời: <strong>errno nào là lỗi thật, errno nào nghĩa là "thử lại", và chính xác chuyện gì xảy ra khi một tín hiệu tới trong lúc chương trình đang chờ bên trong nhân?</strong> Bài kết thúc ở đúng chỗ <a href="${OS('os-10-2-blocking')}">Chương 10</a> (epoll, io_uring) bắt đầu.</p>

<h3>errno: bộ từ vựng lỗi của nhân</h3>
${run('c115-eintr', 'python3 -c')}
<p>Các con số này lấy thẳng từ tệp tiêu đề của nhân (Python chỉ gán tên), và chính là thứ log của bạn hiện ra sau mỗi <code>ENOENT</code>, <code>EACCES</code> hay <code>ECONNREFUSED</code>. Bạn đã gặp phần lớn ở các chương trước: <code>EMFILE</code> ở <a href="${OS('os-2-5-mang-fd')}">bài 2.5</a>, <code>ENOSPC</code> ở bài 2.4, <code>EACCES</code>/<code>EPERM</code> ở Chương 9. Có hai cái khác hẳn về bản chất: <strong>EINTR</strong> (4) và <strong>EAGAIN</strong> (11) không nói "việc này hỏng", chúng nói "thử lại đi" — một vì tín hiệu cắt ngang bạn, một vì chưa có gì sẵn sàng.</p>

<h3>Một tín hiệu tới trong lúc read() đang chờ</h3>
<p>Thí nghiệm: tiến trình con ghi "data" vào một ống sau 2 giây; tiến trình cha cài hàm xử lý cho <code>SIGALRM</code> (có hoặc không có cờ <code>SA_RESTART</code>), hẹn báo thức sau 1 giây, rồi chặn trong <code>read()</code>:</p>
${src('ch11/eintr.c', 'c')}
${run('c115-eintr', 'gcc -O2 -Wall eintr.c')}
<p>Lúc 1,0 s <code>read()</code> trả −1 kèm "Interrupted system call"; vòng lặp hỏi lại và nhận 5 byte lúc 2,0 s. strace cho thấy chuyện bên trong:</p>
${run('c115-eintr', 'strace -qq -e trace=read,rt_sigreturn ./eintr norestart')}
<p>Lần read đang ngủ trong nhân thì tín hiệu tới. Nhân hủy nó với <code>ERESTARTSYS</code> — mã nội bộ nghĩa là "bị cắt ngang; có thể chạy lại nếu hàm xử lý cho phép", phía người dùng không bao giờ thấy trực tiếp — rồi giao <code>SIGALRM</code>: dựng một khung tín hiệu, chạy hàm xử lý (rỗng) của ta ở chế độ người dùng, và hàm xử lý quay về qua <code>rt_sigreturn</code>. Vì hàm xử lý được cài <strong>không có</strong> <code>SA_RESTART</code>, nhân hoàn tất lần read bị cắt bằng <code>-1 EINTR</code>. Giờ cùng chương trình đó có <code>SA_RESTART</code>:</p>
${run('c115-eintr', 'strace -qq -e trace=read,rt_sigreturn ./eintr restart')}
<p><code>rt_sigreturn</code> trả 3 — đối số đầu tiên ban đầu, fd của ống, được đặt lại vào x0 — và nhân chạy lại đúng lần <code>read</code> đó. Chương trình không hề thấy mình bị cắt ngang. Nhưng không phải lời gọi nào cũng chạy lại được:</p>
${run('c115-eintr', 'strace -qq -e trace=ppoll,rt_sigreturn ./eintr poll')}
<p><code>ERESTARTNOHAND</code>, rồi <code>-1 EINTR</code> dù đã có <code>SA_RESTART</code>. <code>man 7 signal</code> liệt kê những lời gọi <strong>không bao giờ</strong> được chạy lại: <code>poll</code>, <code>epoll_wait</code>, <code>select</code>, <code>nanosleep</code>/<code>clock_nanosleep</code>, <code>sigtimedwait</code> và vài lời gọi socket có hạn chờ. Chúng đều chờ có hạn, và lặng lẽ chạy lại sẽ kéo dài hạn đó. Vì vậy lời gọi chờ của mọi vòng lặp sự kiện phải coi EINTR là "lặp tiếp".</p>
${lab('eintr', 'norestart', 'vi', 'read() chặn 2 s, SIGALRM tới lúc 1 s: không có SA_RESTART thì nhân huỷ với ERESTARTSYS, chạy handler, và read trả EINTR; có SA_RESTART thì rt_sigreturn trả fd về và read chạy lại; poll thì đằng nào cũng EINTR.', { tour: 'eintr-signal' })}

<div class="pitfall co-tieu-de">
<p><strong>Lỗi "Interrupted system call" chỉ thỉnh thoảng mới xuất hiện.</strong> Một chương trình C, một addon gốc hay một syscall Go tự viết mà coi mọi −1 là chết người sẽ chạy ổn khi thử rồi hỏng trên production — khi một profiler gửi <code>SIGPROF</code>, một tiến trình con thoát (<code>SIGCHLD</code>), ai đó đổi cỡ terminal (<code>SIGWINCH</code>) hay một trình giám sát gửi tín hiệu. Cách sửa nhàm chán và áp dụng mọi nơi: gặp <code>EINTR</code> thì gọi lại (hoặc cài hàm xử lý với <code>SA_RESTART</code>, nhưng nó vẫn không che được các lời gọi chờ nói trên).</p>
</div>

<h3>Runtime thử lại giùm bạn — còn Go thì tự gửi tín hiệu cho mình</h3>
${src('ch11/pyeintr.py', 'python')}
${run('c115-eintr', 'strace -qq -e trace=read,rt_sigreturn -e signal=SIGALRM python3')}
<p>Python cài hàm xử lý <em>không</em> kèm <code>SA_RESTART</code>, nên nhân trả EINTR — rồi CPython chạy hàm xử lý cấp Python của bạn và tự gọi lại <code>read()</code>. Đó là <a href="https://peps.python.org/pep-0475/" target="_blank" rel="noopener">PEP 475</a> (Python 3.5): mã Python không bao giờ thấy EINTR. libuv tự thử lại bên trong Node, và tầng gốc của JVM thử lại cho Java. (Dòng "handler ran" in ra sau lần read chỉ vì stdout là ống dẫn — bài 11.1.)</p>
<p>Go còn đi xa hơn: nó dùng tín hiệu để tự lập lịch. Hai goroutine quay vòng trên một luồng (<code>GOMAXPROCS=1</code>) không thể nhường nhau theo kiểu hợp tác, nên từ Go 1.14 runtime cắt ngang luồng đang chạy bằng <code>SIGURG</code>:</p>
${src('ch11/spin.go', 'go')}
${run('c115-eintr', 'TIMEFORMAT', 3)}
<p>49 lần <code>SIGURG</code> trong 1,5 s — khoảng 33 lần mỗi giây, do chính tiến trình gửi cho mình (<code>SI_TKILL</code>, cùng pid). Mỗi lần cắt ngang bất cứ việc gì luồng đang làm, kể cả một syscall chậm. Ghi chú phát hành Go 1.14 cảnh báo đúng điều này: chương trình dùng thẳng <code>syscall</code> hay <code>golang.org/x/sys/unix</code> "sẽ thấy nhiều syscall chậm hỏng với lỗi EINTR hơn". Thư viện chuẩn tự thử lại; lời gọi trần của bạn cũng phải vậy.</p>
${lab('eintr', 'go', 'vi', 'Tín hiệu giành quyền của Go trên dòng thời gian: hai goroutine quay vòng trên một luồng, SIGURG khoảng 33 lần mỗi giây (49 lần trong 1,475 s), lần nào cũng cắt ngang việc luồng đang làm — kể cả một lời gọi hệ thống chậm.', { tour: 'eintr-signal' })}

<h3>EAGAIN: "chưa phải lúc" thay vì đứng chờ</h3>
<p>Kiểu "thử lại" thứ hai đến từ I/O <strong>không chặn</strong>. Cùng một ống rỗng, đọc theo hai cách:</p>
${src('ch11/nb.c', 'c')}
${run('c115-eintr', 'gcc -O2 -Wall nb.c')}
<p>Với <code>O_NONBLOCK</code>, lần read trả <code>-1 EAGAIN</code> sau 11 µs — luồng rảnh để làm việc khác. Bên đọc chặn thì ngủ trong nhân, và <code>/proc</code> chỉ rõ ngủ ở đâu: <code>wchan</code> = <code>anon_pipe_read</code> (hàm của nhân nơi nó đang ngủ) và <code>syscall</code> = <code>63 0x5 …</code> (read, trên fd 5). Bài 11.6 dùng chính những file này để chẩn đoán một tiến trình treo mà không cần strace.</p>
<p>Mỗi kết nối một luồng chặn trong <code>read</code> chạy ổn với vài trăm client; với mười nghìn thì bạn cần điều ngược lại: mọi socket không chặn, và <strong>một</strong> lời gọi chờ tới khi bất kỳ socket nào sẵn sàng. Bạn đã thấy đủ các mảnh trong chương này:</p>
<table>
<tr><th>gặp ở</th><th>lời gọi</th><th>kết quả</th><th>ý nghĩa</th></tr>
<tr><td>11.2 (libuv)</td><td><code>connect()</code></td><td><code>-1 EINPROGRESS</code></td><td>đã bắt đầu; vòng lặp sẽ được báo khi xong</td></tr>
<tr><td>11.2 (libuv)</td><td><code>accept4(…, SOCK_NONBLOCK)</code></td><td>fd mới</td><td>socket của kết nối sẽ không bao giờ chặn</td></tr>
<tr><td>11.3 (curl)</td><td><code>recvfrom()</code></td><td><code>-1 EAGAIN</code></td><td>chưa có gì; chờ trong <code>ppoll</code></td></tr>
<tr><td>11.3 (Node)</td><td><code>epoll_pwait()</code></td><td>1 fd sẵn sàng</td><td>một luồng chờ cho mọi socket</td></tr>
</table>
<p>Đó là thiết kế của nginx, Node, Netty và bộ thăm dò mạng của Go. <a href="${OS('os-10-3-epoll')}">Chương 10</a> dựng một máy chủ echo bằng epoll và so với io_uring; còn bây giờ, hãy nhớ bản hợp đồng: <strong>EAGAIN nghĩa là "chờ tới khi sẵn sàng rồi thử lại" — không bao giờ là "hỏng"</strong>.</p>
${lab('eventloop', 'order', 'vi', 'Pha poll là nơi vòng lặp sự kiện chờ — trong epoll_pwait, lời gọi chặn duy nhất. Hẹn giờ, callback I/O và microtask đều chạy giữa hai lần chờ; một EINTR ở đó chỉ có nghĩa "lặp tiếp".', { tour: 'eventloop-order' })}

<h3>EPIPE và SIGPIPE: ghi cho một bên đã bỏ đi</h3>
${run('c115-eintr', 'strace -qq -o yes.txt')}
${run('c115-eintr', 'strace -qq -o py.txt')}
<p><code>head -1</code> đọc một dòng rồi thoát; lần <code>write</code> tiếp theo vào ống không còn ai đọc. Nhân trả <code>-1 EPIPE</code> <em>và</em> gửi <code>SIGPIPE</code>, tín hiệu có hành động mặc định là giết: GNU <code>yes</code> chết (đó là cách các đường ống shell dừng sớm). Python bỏ qua <code>SIGPIPE</code> lúc khởi động, nên nó nhận EPIPE và ném <code>BrokenPipeError</code>. Máy chủ cần cách cư xử của Python: không thì một client đóng kết nối giữa lúc nhận phản hồi sẽ giết cả máy chủ. Node, Python và JVM bỏ qua SIGPIPE; mã C gọi <code>signal(SIGPIPE, SIG_IGN)</code> một lần, hoặc truyền <code>MSG_NOSIGNAL</code> cho mỗi lần <code>send</code> — đúng như <code>sendto</code> của curl đã làm ở bài 11.3.</p>

<div class="pitfall co-tieu-de">
<p><strong>Một dịch vụ C/C++ chết khi client ngắt kết nối.</strong> Không core dump, không log lỗi, mã thoát 141 (128 + 13, SIGPIPE) — và chỉ xảy ra khi người dùng đóng trình duyệt giữa lúc tải hay bộ cân bằng tải cắt các kết nối rảnh. Hãy bỏ qua SIGPIPE lúc khởi động (hoặc dùng <code>MSG_NOSIGNAL</code>) và xử lý <code>EPIPE</code>/<code>ECONNRESET</code> như "client này đã đi". Trong script shell thì chính tín hiệu này lại có ích: nhờ nó mà <code>producer | head</code> dừng được producer.</p>
</div>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một worker C nhỏ đọc việc từ một ống, vài lần mỗi ngày ghi log "read failed: Interrupted system call" rồi thoát; chuyện bắt đầu sau khi nhóm bật một profiler lấy mẫu bằng tín hiệu.</p>
<ol>
<li>Biên dịch <code>eintr.c</code> và tái hiện ba kết cục (<code>norestart</code>, <code>restart</code>, <code>poll</code>) dưới <code>strace -e trace=read,ppoll,rt_sigreturn</code>.</li>
<li>Bỏ vòng lặp thử lại ở nhánh <code>norestart</code> và cho thấy chương trình giờ "hỏng" lúc 1,0 s.</li>
<li>Chạy <code>pyeintr.py</code> và giải thích vì sao Python không bao giờ hiện EINTR.</li>
<li>Làm worker chịu được: hoặc vòng lặp thử lại khi EINTR, hoặc <code>SA_RESTART</code>, và giải thích những lời gọi nào <code>SA_RESTART</code> không che được.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có ba output strace (ERESTARTSYS → EINTR, ERESTARTSYS → chạy lại, ERESTARTNOHAND → EINTR) và một worker đã sửa sống sót khi tín hiệu tới bất cứ lúc nào.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['errno', 'Số hiệu lỗi của lời gọi hỏng gần nhất (ENOENT = 2, EINTR = 4, EAGAIN = 11, EPIPE = 32…).'],
  ['EINTR', 'Một lời gọi chặn bị hàm xử lý tín hiệu cắt ngang; lời gọi chưa làm gì — gọi lại.'],
  ['SA_RESTART', 'Cờ của sigaction: sau hàm xử lý, nhân chạy lại lời gọi bị cắt (trừ poll/epoll_wait/select/các hàm ngủ).'],
  ['ERESTARTSYS / ERESTARTNOHAND', 'Mã nội bộ của nhân mà strace hiện khi một lời gọi bị cắt; phía người dùng nhận EINTR hoặc được chạy lại.'],
  ['EAGAIN / EWOULDBLOCK', 'Lời gọi không chặn chưa có việc để làm; chờ sẵn sàng (poll/epoll) rồi thử lại.'],
  ['O_NONBLOCK', 'Cờ trạng thái file biến việc chờ thành EAGAIN; cách vòng lặp sự kiện dùng socket.'],
  ['EPIPE / SIGPIPE', 'Ghi vào ống hay socket không còn bên đọc: lời gọi hỏng với EPIPE và SIGPIPE mặc định giết tiến trình.'],
  ['async preemption (giành CPU bất đồng bộ)', 'Go 1.14+: runtime cắt ngang goroutine đang chạy bằng SIGURG — nhiều EINTR hơn cho syscall trần.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Phần lớn errno là thất bại thật; <strong>EINTR</strong> và <strong>EAGAIN</strong> nghĩa là "thử lại".</li>
<li>Tín hiệu tới giữa một lời gọi chặn: không SA_RESTART thì lời gọi trả EINTR; có thì nhân chạy lại — trừ các lời gọi chờ như poll/epoll_wait, luôn trả EINTR.</li>
<li>Python (PEP 475), libuv và JVM tự thử lại; mã C và syscall Go trần phải tự làm, và chính Go gửi SIGURG ~33 lần mỗi giây khi có tranh chấp.</li>
<li>I/O không chặn trả EAGAIN thay vì ngủ; máy chủ ghép nó với một lần chờ epoll — Chương 10.</li>
<li>Ghi vào ống/socket đã đóng cho EPIPE kèm SIGPIPE; máy chủ bỏ qua SIGPIPE hoặc dùng MSG_NOSIGNAL.</li>
</ul>
${L('https://man7.org/linux/man-pages/man7/signal.7.html', '📄', 'man 7 signal', 'Cách xử lý tín hiệu, SA_RESTART, và danh sách lời gọi không bao giờ được chạy lại.', 'Mở')}
${L('https://man7.org/linux/man-pages/man3/errno.3.html', '📄', 'man 3 errno', 'Mọi tên errno và ý nghĩa của chúng.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 11.6 — /proc và /sys, xem trước eBPF ───────────────────────── */
    {
      title: '11.6 — /proc and /sys: the kernel’s other API, and a first look at eBPF|||11.6 — /proc và /sys: API thứ hai của nhân, và xem trước eBPF',
      slug: 'os-11-7-proc-sys',
      type: 'LESSON',
      isFreePreview: true,
      description: 'ps aux = 82 openat + 58 read trên /proc (strace -y); free, uptime, sysctl đọc đúng một file, /proc/sys chỉ-đọc trong container; nhìn tiến trình đang ngủ qua wchan/syscall; chẩn đoán kết nối CSDL treo của bài 11.3 chỉ bằng /proc (syscall 203 = connect, socket, /proc/net/tcp SYN_SENT); /proc/PID/io đếm syscall miễn phí; giới hạn cgroup là file — JVM thấy 2 CPU, Node thấy 1 với --cpus 1.5; /sys; xem trước eBPF: bpftrace đếm syscall trong nhân (0,129 → 0,177 s so với strace 0,135 → 0,250 s) và opensnoop một dòng.',
      content: `${G116}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.6</span>
<h2>/proc and /sys: the kernel's other API</h2>
<p class="lead">There are about 450 numbered system calls, but no <code>get_memory_info()</code>, no <code>list_processes()</code>, no <code>get_container_cpu_limit()</code>. The kernel answers those questions through <strong>files</strong> it generates the moment you read them, under <code>/proc</code> and <code>/sys</code>. <a href="${OS('os-1-1-tien-trinh')}">Lesson 1.1</a> read <code>/proc/PID/status</code>; this lesson treats the whole tree as an API: <strong>which tools are just file readers, how do you diagnose a stuck process when you cannot install strace, how do the JVM and Node learn their container limits — and what does eBPF add?</strong></p>

<h3>Your monitoring tools are file readers</h3>
${run('c116-proc', 'strace -qq -c -o ps.sc ps aux', 2)}
<p><code>ps aux</code> made 82 <code>openat</code> and 58 <code>read</code> calls, and <code>-y</code> (print the path behind each fd) shows what it read: for every process, <code>/proc/&lt;pid&gt;/stat</code> and <code>status</code>, plain text it then parses. top, htop, <code>docker top</code> and every monitoring agent do the same. The simpler tools read exactly one file each:</p>
${run('c116-proc', 'strace -qq -e trace=openat -o free.txt free', 3)}
<p><code>free</code> is <code>/proc/meminfo</code> pretty-printed (lesson 2.3), <code>uptime</code> is <code>/proc/uptime</code> + <code>/proc/loadavg</code>, and <code>sysctl vm.swappiness</code> is <code>cat /proc/sys/vm/swappiness</code>. Writing works the same way — when it is allowed:</p>
${run('c116-proc', 'sysctl -w', 2)}
<p>Inside a container, <code>/proc/sys</code> is mounted read-only and <code>/sys</code> is read-only too: a container may read the kernel's settings but not change the host's. (Docker's <code>--sysctl</code> option sets the few namespaced ones, like <code>net.ipv4.ip_unprivileged_port_start</code> in lesson 9.7.)</p>
${lab('sysmon', 'calm', 'en', 'Every number on this top-like panel comes from a file: load from /proc/loadavg, memory from /proc/meminfo, per-process columns from /proc/PID/stat — read it with that in mind.', { tour: 'sysmon-read' })}

<h3>A process seen from outside</h3>
${run('c116-proc', 'sleep 300 & S', 5)}
<p>Three files tell you what a process is doing inside the kernel right now. <code>wchan</code> ("wait channel") names the kernel function it sleeps in: <code>hrtimer_nanosleep</code>. <code>/proc/PID/syscall</code> gives the system call it is blocked in and its arguments: <code>115</code> is <code>clock_nanosleep</code> on arm64 (look it up in <code>asm-generic/unistd.h</code>, lesson 11.1), followed by the six argument registers, the stack pointer and the program counter. <code>/proc/PID/stack</code>, the kernel stack, is restricted to <code>CAP_SYS_ADMIN</code> because kernel addresses help attackers — so it is refused in a normal container.</p>

<h3>Diagnosing the hung DB connection without strace</h3>
<p>In lesson 11.3 we attached strace to a process stuck connecting to a database. Production containers often have no strace and no permission to ptrace. <code>/proc</code> gives the same answer:</p>
${run('c116-proc', 'python3 hang.py > /dev/null & APP', 4)}
<p>Decode it field by field. <code>wchan</code> = <code>wait_woken</code>: sleeping until woken by the network stack. <code>syscall</code> = <code>203 0x3 …</code>: system call 203 is <code>connect</code> on arm64, first argument fd 3. <code>/proc/PID/fd/3</code> is <code>socket:[1292875]</code> — and that inode number appears in the tenth column (<code>inode</code>) of the matching line in <code>/proc/net/tcp</code>, where the remote address <code>01FFFF0A:1538</code> is 10.255.255.1 port 5432 in hex (the IPv4 bytes are little-endian) and state <code>02</code> is <code>SYN_SENT</code>: the SYN went out and nobody answered. That is the whole diagnosis — wrong database host, or a firewall dropping packets — from three <code>cat</code> commands. (<code>ss -tnp</code> prints the same table decoded; it reads the same kernel data.)</p>

<div class="pitfall co-tieu-de">
<p><strong>Assuming strace is the only way in.</strong> In a minimal production image (distroless, Alpine without tools, <code>FROM scratch</code>) there is no strace, and a default container may not ptrace at all. Before installing tools into a running container, read <code>/proc/&lt;pid&gt;/{status,wchan,syscall,fd,io}</code> and <code>/proc/net/tcp</code> from the host or a sidecar sharing its PID namespace (<code>docker run --pid=container:&lt;name&gt;</code>). Most "why is it stuck?" questions are answered there in a minute.</p>
</div>

<h3>Syscall counters for free: /proc/PID/io</h3>
${run('c116-proc', 'node server.js & NODE', 5)}
<p><code>syscr</code> and <code>syscw</code> count read-like and write-like system calls since the process started. 1,000 requests added 1,016 and 1,013: the one <code>read</code> and one <code>writev</code> per request that strace counted in lesson 11.3 — with zero overhead, readable by a monitoring script every second. (<code>rchar</code>/<code>wchar</code> in the same file count bytes; <code>read_bytes</code>/<code>write_bytes</code> count only what actually hit the disk.)</p>

<h3>Container limits are files — and runtimes read them</h3>
<p>This lab container was started with <code>--memory 512m --cpus 1.5</code>. Docker turned that into cgroup v2 files (Chapter 12 builds them by hand):</p>
${run('c116-proc', 'cat /sys/fs/cgroup/memory.max')}
${run('c116-proc', 'java -XshowSettings:system')}
${run('c116-proc', "node -e")}
<p>Both runtimes found the limits — by reading the same files:</p>
${run('c116-proc', 'strace -f -qq -e trace=openat -o jvm.txt java')}
${run('c116-proc', 'strace -f -qq -e trace=openat -o nd.txt node')}
<p>The JVM reads <code>/proc/self/cgroup</code> and <code>mountinfo</code> to find its cgroup, then <code>cpu.max</code> and <code>memory.max</code>, and sizes the default heap, GC threads and the common ForkJoin pool from them (<a href="${OS('os-8-5-gioi-han')}">lesson 8.5</a> measured the heap side). Node reads <code>memory.max</code> and <code>memory.high</code> for <code>process.constrainedMemory()</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>1.5 CPUs is 2 for Java and 1 for Node.</strong> Same container, same <code>cpu.max = 150000 100000</code>: the JVM rounded <em>up</em> (Effective CPU Count: 2), Node's <code>availableParallelism()</code> said <strong>1</strong>, and <code>nproc</code> on the host says 10. A thread pool sized from the host count oversubscribes the quota and gets throttled (lesson 3.4); one sized from 1 leaves half a CPU unused. Set pool sizes explicitly where it matters (<code>-XX:ActiveProcessorCount</code>, <code>UV_THREADPOOL_SIZE</code>, your own worker count) and log what the runtime detected at startup.</p>
</div>

<h3>/sys: one value per file</h3>
${run('c116-proc', 'cat /sys/class/net/eth0')}
<p>Received bytes on <code>eth0</code> (what <code>ip -s link</code> and node_exporter read), the CPUs that exist (<code>0-9</code> — the VM's, not the container's quota), and the transparent huge page mode (<code>[always]</code>, lesson 7.2). <code>/sys</code> is organised by device and subsystem and holds one value per file, so a shell script can read or (where permitted) set any of them without a dedicated tool.</p>

<h3>A first look at eBPF</h3>
<p>Files show state; strace shows calls but stops the process at each one. <strong>eBPF</strong> is the third way: you load a small, verified program into the kernel and attach it to an event — a syscall tracepoint, a kernel function, a network packet — and it counts or records <em>inside</em> the kernel. <code>bpftrace</code> is not in the os-lab image, so we installed Ubuntu's <code>bpftrace</code> 0.25.0 package in a throwaway <code>--privileged</code> container (the Docker Desktop kernel has BTF and the BPF features enabled):</p>
${run('c116-bpf', 'bpftrace --version', 2)}
${run('c116-bpf', 'node server.js', 5)}
<p>One line attached a counter to every <code>sys_enter_*</code> tracepoint for processes named <code>node</code>: during 1,000 requests it counted 1,000 <code>writev</code>, 1,010 <code>read</code> and 1,937 <code>epoll_pwait</code> — the same per-request shape as strace. The price: 0.129 s → 0.177 s with ~400 probes attached, against strace's 0.135 s → 0.250 s in lesson 11.3, and nothing was stopped or attached to. The same idea makes a one-line <code>opensnoop</code>:</p>
${run('c116-bpf', "bpftrace -q -e 'tracepoint:syscalls:sys_enter_openat", 2)}
<p>The missing config file of lesson 11.3, caught for every <code>node</code> process on the machine without touching any of them. <a href="${OS('os-15-2-ebpf')}">Chapter 15</a> goes deep: execsnoop, biolatency, latency histograms, profiling in production.</p>

<h3>🧪 Practice (25 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> a distroless container of your API is "running" but never becomes healthy. There is no shell tool inside, and you are not allowed to install strace on production.</p>
<ol>
<li>Start <code>hang.py</code> in the lab and, using only <code>cat</code>/<code>ls</code> on <code>/proc</code>, find which syscall it is blocked in and on which fd.</li>
<li>Find its socket in <code>/proc/net/tcp</code> and decode the remote address and state by hand (hex → dotted IP, port; state 02).</li>
<li>Read <code>/proc/PID/io</code> of the Node server before and after 500 requests and compute syscalls per request.</li>
<li>Start a container with <code>--cpus 1.5 --memory 512m</code> and compare what Java and Node report; decide how you would size a worker pool there.</li>
</ol>
<p><strong>Done when:</strong> you can name the blocked call and the unreachable address without strace, give a per-request syscall count from <code>/proc/PID/io</code>, and explain the 2-vs-1 CPU difference.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['/proc', 'A virtual file system of process and kernel state, generated on read (procfs).'],
  ['/sys (sysfs)', 'Kernel objects — devices, cgroups, tunables — one value per file.'],
  ['/proc/PID/wchan', 'The kernel function a sleeping task waits in (wait_woken, hrtimer_nanosleep…).'],
  ['/proc/PID/syscall', 'The syscall number and arguments a blocked task is in right now.'],
  ['/proc/PID/io', 'Per-process counters: syscr/syscw (syscalls), rchar/wchar, read_bytes/write_bytes.'],
  ['/proc/net/tcp', 'All TCP sockets in hex: local/remote address, state (02 = SYN_SENT), inode.'],
  ['cgroup files (cpu.max, memory.max)', 'Where a container’s limits live; the JVM and Node read them at startup.'],
  ['eBPF / bpftrace', 'Small verified programs that run inside the kernel on events; observe without stopping processes.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>/proc and /sys are an API of text the kernel generates when you read; ps, free, uptime, sysctl, top and monitoring agents are file readers.</li>
<li>wchan, /proc/PID/syscall, the fd links and /proc/net/tcp diagnose a stuck process without strace.</li>
<li>/proc/PID/io gives syscall counts for free; cgroup files hold container limits that runtimes read — and interpret differently (1.5 CPUs: Java 2, Node 1).</li>
<li>Containers see /proc/sys and /sys read-only.</li>
<li>eBPF counts and records inside the kernel: same answers as strace at a fraction of the cost — Chapter 15.</li>
</ul>
${L('https://man7.org/linux/man-pages/man5/proc.5.html', '📄', 'man 5 proc', 'Every file under /proc: stat, status, wchan, syscall, io, net/tcp…', 'Open')}
${L('https://github.com/bpftrace/bpftrace', '🐝', 'bpftrace', 'The high-level tracing language for eBPF, with one-liner tutorial.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.6</span>
<h2>/proc và /sys: API thứ hai của nhân</h2>
<p class="lead">Có khoảng 450 lời gọi hệ thống được đánh số, nhưng không có <code>get_memory_info()</code>, không có <code>list_processes()</code>, không có <code>get_container_cpu_limit()</code>. Nhân trả lời những câu đó qua các <strong>file</strong> nó sinh ra đúng lúc bạn đọc, trong <code>/proc</code> và <code>/sys</code>. <a href="${OS('os-1-1-tien-trinh')}">Bài 1.1</a> đã đọc <code>/proc/PID/status</code>; bài này coi cả cây thư mục là một API: <strong>công cụ nào chỉ là trình đọc file, chẩn đoán một tiến trình kẹt thế nào khi không cài được strace, JVM và Node biết giới hạn container của mình ra sao — và eBPF thêm được gì?</strong></p>

<h3>Công cụ giám sát của bạn là trình đọc file</h3>
${run('c116-proc', 'strace -qq -c -o ps.sc ps aux', 2)}
<p><code>ps aux</code> gọi <code>openat</code> 82 lần và <code>read</code> 58 lần, và <code>-y</code> (in đường dẫn sau mỗi fd) cho thấy nó đọc gì: với mỗi tiến trình, <code>/proc/&lt;pid&gt;/stat</code> và <code>status</code>, chữ thường mà nó phân tích. top, htop, <code>docker top</code> và mọi agent giám sát đều làm vậy. Các công cụ đơn giản hơn thì mỗi cái đọc đúng một file:</p>
${run('c116-proc', 'strace -qq -e trace=openat -o free.txt free', 3)}
<p><code>free</code> là <code>/proc/meminfo</code> in cho đẹp (bài 2.3), <code>uptime</code> là <code>/proc/uptime</code> + <code>/proc/loadavg</code>, còn <code>sysctl vm.swappiness</code> là <code>cat /proc/sys/vm/swappiness</code>. Ghi cũng y như vậy — khi được phép:</p>
${run('c116-proc', 'sysctl -w', 2)}
<p>Trong container, <code>/proc/sys</code> được gắn chỉ-đọc và <code>/sys</code> cũng chỉ-đọc: container được đọc thiết lập của nhân nhưng không được đổi thiết lập của máy chủ. (Tùy chọn <code>--sysctl</code> của Docker đặt được vài cái theo namespace, như <code>net.ipv4.ip_unprivileged_port_start</code> ở bài 9.7.)</p>
${lab('sysmon', 'calm', 'vi', 'Mọi con số trên bảng kiểu top này đều đến từ một file: tải từ /proc/loadavg, bộ nhớ từ /proc/meminfo, các cột theo tiến trình từ /proc/PID/stat — hãy đọc nó với ý đó trong đầu.', { tour: 'sysmon-read' })}

<h3>Nhìn một tiến trình từ bên ngoài</h3>
${run('c116-proc', 'sleep 300 & S', 5)}
<p>Ba file cho biết tiến trình đang làm gì trong nhân ngay lúc này. <code>wchan</code> ("wait channel") ghi tên hàm nhân nơi nó ngủ: <code>hrtimer_nanosleep</code>. <code>/proc/PID/syscall</code> cho lời gọi hệ thống nó đang bị chặn cùng đối số: <code>115</code> là <code>clock_nanosleep</code> trên arm64 (tra trong <code>asm-generic/unistd.h</code>, bài 11.1), tiếp theo là sáu thanh ghi đối số, con trỏ stack và bộ đếm chương trình. <code>/proc/PID/stack</code>, ngăn xếp nhân, chỉ dành cho <code>CAP_SYS_ADMIN</code> vì địa chỉ nhân giúp được kẻ tấn công — nên bị từ chối trong container thường.</p>

<h3>Chẩn đoán kết nối CSDL bị treo mà không cần strace</h3>
<p>Ở bài 11.3 ta gắn strace vào một tiến trình kẹt khi kết nối tới CSDL. Container production thường không có strace và không có quyền ptrace. <code>/proc</code> cho cùng câu trả lời:</p>
${run('c116-proc', 'python3 hang.py > /dev/null & APP', 4)}
<p>Giải mã từng trường. <code>wchan</code> = <code>wait_woken</code>: ngủ tới khi tầng mạng đánh thức. <code>syscall</code> = <code>203 0x3 …</code>: lời gọi hệ thống 203 là <code>connect</code> trên arm64, đối số đầu là fd 3. <code>/proc/PID/fd/3</code> là <code>socket:[1292875]</code> — và số inode đó nằm ở cột thứ mười (<code>inode</code>) của dòng tương ứng trong <code>/proc/net/tcp</code>, nơi địa chỉ đầu kia <code>01FFFF0A:1538</code> là 10.255.255.1 cổng 5432 dạng hex (các byte IPv4 xếp ngược, little-endian) và trạng thái <code>02</code> là <code>SYN_SENT</code>: gói SYN đã đi và không ai trả lời. Đó là toàn bộ chẩn đoán — sai host CSDL, hoặc tường lửa đang bỏ gói — chỉ bằng ba lệnh <code>cat</code>. (<code>ss -tnp</code> in đúng bảng đó đã giải mã; nó đọc cùng dữ liệu của nhân.)</p>

<div class="pitfall co-tieu-de">
<p><strong>Tưởng strace là đường vào duy nhất.</strong> Trong một image production tối giản (distroless, Alpine không công cụ, <code>FROM scratch</code>) không có strace, và một container mặc định có thể không được ptrace chút nào. Trước khi cài công cụ vào một container đang chạy, hãy đọc <code>/proc/&lt;pid&gt;/{status,wchan,syscall,fd,io}</code> và <code>/proc/net/tcp</code> từ máy chủ hoặc từ một sidecar dùng chung PID namespace (<code>docker run --pid=container:&lt;tên&gt;</code>). Phần lớn câu hỏi "sao nó kẹt?" được trả lời ở đó trong một phút.</p>
</div>

<h3>Bộ đếm syscall miễn phí: /proc/PID/io</h3>
${run('c116-proc', 'node server.js & NODE', 5)}
<p><code>syscr</code> và <code>syscw</code> đếm các lời gọi hệ thống kiểu đọc và kiểu ghi từ lúc tiến trình khởi động. 1.000 request cộng thêm 1.016 và 1.013: đúng một <code>read</code> và một <code>writev</code> mỗi request mà strace đếm ở bài 11.3 — không tốn gì, một script giám sát đọc được mỗi giây. (<code>rchar</code>/<code>wchar</code> trong cùng file đếm byte; <code>read_bytes</code>/<code>write_bytes</code> chỉ đếm phần thật sự xuống đĩa.)</p>

<h3>Giới hạn container là file — và runtime đọc chúng</h3>
<p>Container lab này được chạy với <code>--memory 512m --cpus 1.5</code>. Docker biến điều đó thành các file cgroup v2 (Chương 12 tự dựng chúng bằng tay):</p>
${run('c116-proc', 'cat /sys/fs/cgroup/memory.max')}
${run('c116-proc', 'java -XshowSettings:system')}
${run('c116-proc', "node -e")}
<p>Cả hai runtime đều tìm ra giới hạn — bằng cách đọc cùng những file đó:</p>
${run('c116-proc', 'strace -f -qq -e trace=openat -o jvm.txt java')}
${run('c116-proc', 'strace -f -qq -e trace=openat -o nd.txt node')}
<p>JVM đọc <code>/proc/self/cgroup</code> và <code>mountinfo</code> để tìm cgroup của mình, rồi <code>cpu.max</code> và <code>memory.max</code>, và tính heap mặc định, số luồng GC và ForkJoin pool chung từ đó (<a href="${OS('os-8-5-gioi-han')}">bài 8.5</a> đã đo phía heap). Node đọc <code>memory.max</code> và <code>memory.high</code> cho <code>process.constrainedMemory()</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>1,5 CPU là 2 với Java và 1 với Node.</strong> Cùng container, cùng <code>cpu.max = 150000 100000</code>: JVM làm tròn <em>lên</em> (Effective CPU Count: 2), <code>availableParallelism()</code> của Node nói <strong>1</strong>, còn <code>nproc</code> trên máy chủ nói 10. Một thread pool tính theo số lõi của máy chủ sẽ vượt quota và bị bóp (bài 3.4); một pool tính theo 1 thì bỏ phí nửa CPU. Hãy đặt cỡ pool rõ ràng ở chỗ quan trọng (<code>-XX:ActiveProcessorCount</code>, <code>UV_THREADPOOL_SIZE</code>, số worker của chính bạn) và ghi log con số runtime phát hiện lúc khởi động.</p>
</div>

<h3>/sys: mỗi file một giá trị</h3>
${run('c116-proc', 'cat /sys/class/net/eth0')}
<p>Số byte đã nhận trên <code>eth0</code> (thứ <code>ip -s link</code> và node_exporter đọc), các CPU đang có (<code>0-9</code> — của VM, không phải quota của container), và chế độ transparent huge page (<code>[always]</code>, bài 7.2). <code>/sys</code> được tổ chức theo thiết bị và hệ thống con, mỗi file một giá trị, nên một script shell đọc được hay (khi được phép) đặt được bất kỳ cái nào mà không cần công cụ riêng.</p>

<h3>Cái nhìn đầu tiên về eBPF</h3>
<p>File cho thấy trạng thái; strace cho thấy lời gọi nhưng dừng tiến trình ở mỗi lời gọi. <strong>eBPF</strong> là cách thứ ba: bạn nạp một chương trình nhỏ đã được kiểm tra vào nhân rồi gắn nó vào một sự kiện — một điểm dò syscall, một hàm nhân, một gói mạng — và nó đếm hay ghi lại <em>ngay trong</em> nhân. Ảnh os-lab không có <code>bpftrace</code>, nên ta cài gói <code>bpftrace</code> 0.25.0 của Ubuntu vào một container <code>--privileged</code> vứt đi (nhân của Docker Desktop đã bật BTF và các tính năng BPF):</p>
${run('c116-bpf', 'bpftrace --version', 2)}
${run('c116-bpf', 'node server.js', 5)}
<p>Một dòng gắn bộ đếm vào mọi điểm dò <code>sys_enter_*</code> cho các tiến trình tên <code>node</code>: trong 1.000 request nó đếm 1.000 <code>writev</code>, 1.010 <code>read</code> và 1.937 <code>epoll_pwait</code> — đúng dáng hình mỗi request như strace. Cái giá: 0,129 s → 0,177 s với ~400 điểm dò được gắn, so với strace 0,135 s → 0,250 s ở bài 11.3, và không ai bị dừng hay bị gắn vào. Cùng ý tưởng đó cho ra một <code>opensnoop</code> một dòng:</p>
${run('c116-bpf', "bpftrace -q -e 'tracepoint:syscalls:sys_enter_openat", 2)}
<p>File cấu hình bị thiếu của bài 11.3, bắt được cho mọi tiến trình <code>node</code> trên máy mà không đụng vào cái nào. <a href="${OS('os-15-2-ebpf')}">Chương 15</a> đi sâu: execsnoop, biolatency, biểu đồ độ trễ, profile trên production.</p>

<h3>🧪 Thực hành (25 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> một container distroless của API "đang chạy" nhưng không bao giờ khoẻ. Bên trong không có công cụ shell nào, và bạn không được phép cài strace lên production.</p>
<ol>
<li>Chạy <code>hang.py</code> trong lab và, chỉ dùng <code>cat</code>/<code>ls</code> trên <code>/proc</code>, tìm xem nó bị chặn ở syscall nào và trên fd nào.</li>
<li>Tìm socket của nó trong <code>/proc/net/tcp</code> và tự giải mã địa chỉ đầu kia và trạng thái (hex → IP dạng chấm, cổng; trạng thái 02).</li>
<li>Đọc <code>/proc/PID/io</code> của máy chủ Node trước và sau 500 request rồi tính số syscall mỗi request.</li>
<li>Chạy một container với <code>--cpus 1.5 --memory 512m</code> và so những gì Java và Node báo; quyết định bạn sẽ đặt cỡ worker pool thế nào ở đó.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn nêu được lời gọi đang bị chặn và địa chỉ không tới được mà không cần strace, đưa ra số syscall mỗi request từ <code>/proc/PID/io</code>, và giải thích được chênh lệch 2 với 1 CPU.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['/proc', 'Hệ thống file ảo chứa trạng thái tiến trình và nhân, sinh ra lúc đọc (procfs).'],
  ['/sys (sysfs)', 'Các đối tượng của nhân — thiết bị, cgroup, tham số — mỗi file một giá trị.'],
  ['/proc/PID/wchan', 'Hàm nhân mà tác vụ đang ngủ chờ trong đó (wait_woken, hrtimer_nanosleep…).'],
  ['/proc/PID/syscall', 'Số hiệu syscall và đối số mà tác vụ đang bị chặn ngay lúc này.'],
  ['/proc/PID/io', 'Bộ đếm theo tiến trình: syscr/syscw (syscall), rchar/wchar, read_bytes/write_bytes.'],
  ['/proc/net/tcp', 'Mọi socket TCP dạng hex: địa chỉ hai đầu, trạng thái (02 = SYN_SENT), inode.'],
  ['cgroup files (file cgroup: cpu.max, memory.max)', 'Nơi giới hạn của container nằm; JVM và Node đọc chúng lúc khởi động.'],
  ['eBPF / bpftrace', 'Chương trình nhỏ đã kiểm tra chạy trong nhân khi có sự kiện; quan sát mà không dừng tiến trình.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>/proc và /sys là một API bằng chữ do nhân sinh ra khi bạn đọc; ps, free, uptime, sysctl, top và các agent giám sát là trình đọc file.</li>
<li>wchan, /proc/PID/syscall, các liên kết fd và /proc/net/tcp chẩn đoán một tiến trình kẹt mà không cần strace.</li>
<li>/proc/PID/io cho số syscall miễn phí; file cgroup giữ giới hạn container mà runtime đọc — và hiểu khác nhau (1,5 CPU: Java 2, Node 1).</li>
<li>Container thấy /proc/sys và /sys ở chế độ chỉ-đọc.</li>
<li>eBPF đếm và ghi lại ngay trong nhân: cùng câu trả lời như strace với một phần nhỏ chi phí — Chương 15.</li>
</ul>
${L('https://man7.org/linux/man-pages/man5/proc.5.html', '📄', 'man 5 proc', 'Mọi file trong /proc: stat, status, wchan, syscall, io, net/tcp…', 'Mở')}
${L('https://github.com/bpftrace/bpftrace', '🐝', 'bpftrace', 'Ngôn ngữ dò vết cấp cao cho eBPF, kèm hướng dẫn các lệnh một dòng.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 11.7 — seccomp thực hành ───────────────────────── */
    {
      title: '11.7 — Filtering syscalls with seccomp: EPERM, ENOSYS, SIGSYS and Docker’s profile|||11.7 — Lọc syscall bằng seccomp: EPERM, ENOSYS, SIGSYS và hồ sơ của Docker',
      slug: 'os-11-4-seccomp',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tự viết bộ lọc seccomp (BPF cổ điển 7 lệnh) rồi exec lệnh bên trong: mkdirat → EPERM, kill → SIGSYS exit 159, chặn socket thì curl báo "Could not resolve host"; bộ lọc chồng, kế thừa, một chiều (Seccomp_filters 2, NoNewPrivs 1); chuyện clone3: EPERM làm hỏng tạo luồng (Python, JVM), ENOSYS cho glibc lùi về clone; hồ sơ mặc định của Docker đọc từ nguồn (ERRNO 1, 361 + 65, clone3 → ENOSYS); mặc định vs unconfined; hồ sơ JSON tự viết; chế độ strict bị chặn trong Docker, unconfined thì exit 137; danh sách cho phép từ strace -c của máy chủ Node (54/327) và lời gọi exit bị bỏ sót làm Node treo.',
      content: `${G117}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.7</span>
<h2>seccomp in practice: decide which system calls a program may make</h2>
<p class="lead"><a href="${OS('os-13-4-container-escape')}">Lesson 13.4</a> met seccomp as one line of <code>/proc/self/status</code> — <code>Seccomp: 2</code>, Docker's default filter — and moved on. Now that you know what a system call is, you can use it: <strong>how do you stop a program from making a particular system call, what does the program see when it tries, and how do you build a filter for a real service without breaking it?</strong> Everything below runs in throwaway lab containers; the "attacks" are just syscalls we choose to forbid.</p>

<h3>A small program the kernel runs on every syscall</h3>
<p>A <strong>seccomp filter</strong> is a short program in classic BPF that a process attaches to itself. On every system call, before the <code>sys_call_table</code> lookup of lesson 11.1, the kernel runs it with a small record: the architecture, the syscall number and its six arguments. The filter returns an action: <code>ALLOW</code>; <code>ERRNO(n)</code> — skip the call and return <code>-n</code>; <code>KILL_PROCESS</code> — kill with <code>SIGSYS</code>; <code>TRAP</code> or <code>USER_NOTIF</code> — let a signal handler or a supervisor decide; <code>LOG</code> — allow but write an audit record. Here is a complete one, written by hand:</p>
${src('ch11/sandbox.c', 'c')}
<p>Seven BPF instructions: load the architecture and kill anything from a foreign ABI (a classic bypass is calling the 32-bit syscall table, where numbers differ), load the syscall number, compare it with the one we block, return our action if it matches, otherwise allow. <code>PR_SET_NO_NEW_PRIVS</code> is required before an unprivileged process may install a filter. Then <code>execvp</code> runs the command — inside the filter.</p>

<h3>EPERM: the filter answers, the handler never runs</h3>
${run('c117-seccomp', 'gcc -O2 -Wall sandbox.c', 2)}
<p><code>mkdirat</code> returned <code>-1 EPERM</code> without the kernel's directory code ever running; <code>gnumkdir</code> printed an ordinary "Operation not permitted". (<code>gnumkdir</code> is GNU's <code>mkdir</code>; Ubuntu 26.04 installs it next to the default Rust rewrite, uutils.) Filters stack and are inherited:</p>
${lab('syscall', 'seccomp', 'en', 'A seccomp filter in front of the syscall table: pick a program (mkdir, curl, a Python thread) and an action (ALLOW, EPERM, ENOSYS, KILL, LOG) and see the measured outcome — exit 1, “Could not resolve host” exit 6, “Bad system call” 159, clone3 ENOSYS falling back to clone.', { tour: 'syscall-errno' })}
${run('c117-seccomp', "grep -E '^(Seccomp|Seccomp_filters|NoNewPrivs):'")}
${run('c117-seccomp', './sandbox eperm:mkdirat grep')}
<p>Inside Docker there is already one filter; under our sandbox there are two, and <code>NoNewPrivs</code> became 1 (which also disables setuid, as lesson 13.4 showed). Every filter runs on every call and the strictest answer wins; filters pass to every child and survive <code>exec</code>; and no process can remove one. A sandbox can only get tighter.</p>
${lab('process', 'sandbox', 'en', 'Build a process tree by hand: every child created with fork and every program started with exec keeps its parent’s seccomp filters — they are part of the process, like its fd table.')}

<h3>KILL, and errors that point the wrong way</h3>
${run('c117-seccomp', './sandbox kill:mkdirat')}
<p>With <code>KILL_PROCESS</code> the program never gets an error to handle: the kernel sends <code>SIGSYS</code> and the shell reports "Bad system call", exit status <strong>159</strong> (128 + 31). No log line, no stack trace — look for that exit code. A denied call can also surface as something unrelated:</p>
${run('c117-seccomp', './sandbox eperm:socket')}
<p>Blocking <code>socket()</code> made curl say "Could not resolve host": the DNS lookup needs a socket too, and curl reported the first step that failed. Inside a sandboxed container, an error that makes no sense — DNS failing, threads not starting, "permission denied" on a file you own — is a reason to trace the syscalls before debugging the application.</p>

<h3>EPERM or ENOSYS? The clone3 story</h3>
${run('c117-seccomp', './sandbox eperm:clone3 python3')}
${run('c117-seccomp', './sandbox eperm:clone3 java')}
<p>Blocking <code>clone3</code> with EPERM broke thread creation: Python cannot start a thread, and the JVM cannot even start its garbage collector. Now the same block answering <code>ENOSYS</code> ("function not implemented"):</p>
${run('c117-seccomp', './sandbox enosys:clone3 python3')}
${run('c117-seccomp', 'strace -f -qq -e trace=clone,clone3')}
<p>glibc tried <code>clone3</code>, got ENOSYS — "this kernel is too old to have it" — and fell back to the older <code>clone</code>, which is allowed. This is not a lab curiosity. In 2021 glibc 2.34 began creating threads with <code>clone3</code>; Docker's default profile at the time did not list <code>clone3</code>, so its default action answered EPERM, and new distribution images could not create threads on older Docker hosts. The fix was to answer unknown or new calls with ENOSYS so libraries fall back — and today's profile does exactly that:</p>
${run('c117-host', 'docker run --rm --label oslab=1 -v')}
<p>Read from the source (<code>github.com/moby/profiles</code>): default action <code>SCMP_ACT_ERRNO</code> with errno 1 (EPERM) for anything not listed, 361 syscalls allowed for every container, 65 more only with a capability, architecture or argument condition — and <code>clone3</code> answered with errno 38, ENOSYS, unless the container has <code>CAP_SYS_ADMIN</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>Denying with EPERM what a library could live without.</strong> When you write a profile (or a <code>SystemCallFilter=</code> in systemd), the error you return is part of the contract. EPERM says "you are not allowed" and well-behaved code gives up; ENOSYS says "this kernel does not have it" and well-behaved code falls back. For new syscalls (<code>clone3</code>, <code>openat2</code>, <code>io_uring_*</code>…) prefer ENOSYS; reserve KILL for calls that should never happen at all.</p>
</div>

<h3>Docker: default, unconfined, and your own profile</h3>
${run('c117-host', "docker run --rm --label oslab=1 os-lab grep -E '^Seccomp'", 5)}
<p>The default container has one filter, <code>seccomp=unconfined</code> has none. The default refuses <code>unshare --user</code> (creating a user namespace is a large kernel attack surface — Chapter 12) and <code>perf_event_open</code> (which is why <code>perf</code> needs extra options in Chapters 3 and 15); unconfined allows them. That is why this course uses <code>unconfined</code> only for single measurements in throwaway containers, never for an application. Writing your own profile is a JSON file:</p>
${run('c117-host', 'cat lab/code/ch11/deny-mkdir.json', 2)}
<p>For real use, start from Docker's default profile and <em>remove</em> what your service never needs; a profile that starts from "allow everything" (like this demo) protects almost nothing.</p>

<h3>Strict mode: where seccomp began</h3>
${src('ch11/strict.c', 'c')}
${run('c117-host', "docker run --rm --label oslab=1 -v \"$PWD/lab/code/ch11\":/lab/ch11 os-lab bash -c 'gcc")}
${run('c117-host', 'docker run --rm --label oslab=1 --security-opt seccomp=unconfined -v')}
<p>The original seccomp (2005) had one mode: after <code>prctl(PR_SET_SECCOMP, SECCOMP_MODE_STRICT)</code> only <code>read</code>, <code>write</code>, <code>exit</code> and <code>sigreturn</code> are allowed — meant for running untrusted computation that only talks through already-open pipes. Inside a Docker container it cannot even be enabled (EINVAL: the process is already in filter mode). Unconfined, <code>write</code> works and the next <code>getpid</code> kills the process with <code>SIGKILL</code>: <strong>exit 137</strong>. Remember that next time you see 137: it means SIGKILL, and the OOM killer of Chapter 8 is only one of the possible senders.</p>

<h3>An allowlist for a Node server — and the call it forgot</h3>
<p>The strongest profile allows only what a program needs. Lesson 11.3 already gave us the tool to find out: <code>strace -f -c</code> over the program's life. A small launcher turns that table into a filter — allow the listed calls, EPERM for everything else:</p>
${src('ch11/allow.c', 'c')}
${run('c117-seccomp', "echo '#include", 7)}
<p>Startup plus 100 requests used <strong>54</strong> different system calls out of the 327 this machine defines. Under the allowlist the server still answers "hello" — and the other ~270 calls (<code>ptrace</code>, <code>mount</code>, <code>bpf</code>, <code>keyctl</code>, <code>execveat</code>…) no longer exist for it. Then we try something the server never did while recorded:</p>
${run('c117-seccomp', 'timeout 8 ./allow node.sc node -e', 3)}
<p>We expected a clean <code>EPERM</code> error for <code>mkdir</code> — the error is printed — but then Node <strong>hangs</strong> until <code>timeout</code> kills it (exit 124). strace shows why: the threads call <code>exit</code> to finish, get EPERM, and try again forever. Our recording never contained <code>exit</code>, because the server never shut down while we recorded. Adding that one name gives the clean failure we wanted (exit 1).</p>

<div class="pitfall co-tieu-de">
<p><strong>An allowlist recorded from the happy path.</strong> Startup, steady traffic and the requests you happened to send are not the whole life of a service: shutdown, log rotation, error paths, DNS re-resolution, a rarely used endpoint that spawns a process. A missing call can crash, or — worse, as here — hang. Record with the filter in log mode first (<code>SCMP_ACT_LOG</code> as the default action), exercise startup, traffic, errors and shutdown, read the log, and only then switch to enforcing. Or start from Docker's default and remove specific dangerous calls, which fails much more gently.</p>
</div>

<h3>🧪 Practice (30 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> after an audit, your team must harden the containers of the API. A colleague proposes <code>--security-opt seccomp=unconfined</code> "because perf and strace did not work", another wants a custom allowlist.</p>
<ol>
<li>In the lab, compile <code>sandbox.c</code> and reproduce the three outcomes for <code>mkdirat</code>: EPERM, KILL (exit 159), and the EPERM-vs-ENOSYS difference for <code>clone3</code> with Python.</li>
<li>From the host, compare <code>Seccomp:</code> in a default and an unconfined container, and show one call that the default denies.</li>
<li>Record <code>node server.js</code> with <code>strace -f -c</code>, build the allowlist with <code>allow.c</code>, and make it fail on purpose with a call you did not record.</li>
<li>Write three sentences for the team: why not <code>unconfined</code>, why ENOSYS for new calls, and how to record an allowlist safely.</li>
</ol>
<p><strong>Done when:</strong> you show EPERM / 159 / ENOSYS outputs, the default-vs-unconfined comparison, a working allowlisted server plus one deliberate failure, and the three-sentence recommendation.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['seccomp (filter mode)', 'A classic-BPF program the kernel runs on every syscall of a process; returns ALLOW, ERRNO, KILL, TRAP, USER_NOTIF or LOG.'],
  ['PR_SET_NO_NEW_PRIVS', 'Promise that exec can never gain privileges (no setuid); required to install a filter without CAP_SYS_ADMIN.'],
  ['SIGSYS / exit 159', 'What SECCOMP_RET_KILL_PROCESS does: the process dies with signal 31, status 128 + 31.'],
  ['EPERM vs ENOSYS', '“Forbidden” makes code give up; “not implemented” makes it fall back (clone3 → clone).'],
  ['Docker default profile', 'Deny by default (EPERM), 361 calls allowed for all containers, 65 conditional, clone3 → ENOSYS.'],
  ['seccomp=unconfined', 'Run a container with no syscall filter — only for one-off measurements in throwaway containers.'],
  ['strict mode', 'The 2005 mode: only read, write, exit, sigreturn; anything else is SIGKILL (exit 137).'],
  ['allowlist profile', 'Allow only the syscalls a program uses; record its whole lifecycle (SCMP_ACT_LOG) before enforcing.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>seccomp runs a BPF filter on every syscall, before the handler; actions are ALLOW, ERRNO, KILL, TRAP/USER_NOTIF and LOG.</li>
<li>Filters stack, are inherited across fork and exec, and can never be removed; Docker installs one by default (<code>Seccomp: 2</code>).</li>
<li>The returned error matters: EPERM makes code give up, ENOSYS makes it fall back — the clone3 incident; KILL means exit 159 with no log.</li>
<li>Keep Docker's default profile, never run applications <code>unconfined</code>, and tighten by removing calls.</li>
<li>An allowlist from strace shrinks a Node server to 54 of 327 syscalls — but must be recorded over startup, traffic, errors and shutdown.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/seccomp.2.html', '📄', 'man 2 seccomp', 'Filter mode, every return action, and the seccomp_data structure.', 'Open')}
${L('https://docs.docker.com/engine/security/seccomp/', '🐳', 'Docker — Seccomp security profiles', 'The default profile, what it blocks, and how to pass your own.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.7</span>
<h2>seccomp thực hành: quyết định một chương trình được gọi những syscall nào</h2>
<p class="lead"><a href="${OS('os-13-4-container-escape')}">Bài 13.4</a> gặp seccomp dưới dạng một dòng trong <code>/proc/self/status</code> — <code>Seccomp: 2</code>, bộ lọc mặc định của Docker — rồi đi tiếp. Giờ bạn đã biết lời gọi hệ thống là gì, bạn dùng được nó: <strong>làm sao chặn một chương trình khỏi một lời gọi hệ thống cụ thể, chương trình thấy gì khi nó cố gọi, và dựng bộ lọc cho một dịch vụ thật thế nào mà không làm hỏng nó?</strong> Mọi thứ dưới đây chạy trong container lab vứt đi; "tấn công" chỉ là những syscall ta chọn cấm.</p>

<h3>Một chương trình nhỏ nhân chạy ở mỗi syscall</h3>
<p>Một <strong>bộ lọc seccomp</strong> là một chương trình ngắn viết bằng BPF cổ điển mà tiến trình tự gắn vào mình. Ở mỗi lời gọi hệ thống, trước khi tra <code>sys_call_table</code> như bài 11.1, nhân chạy nó với một bản ghi nhỏ: kiến trúc, số hiệu syscall và sáu đối số. Bộ lọc trả về một hành động: <code>ALLOW</code>; <code>ERRNO(n)</code> — bỏ qua lời gọi và trả <code>-n</code>; <code>KILL_PROCESS</code> — giết bằng <code>SIGSYS</code>; <code>TRAP</code> hay <code>USER_NOTIF</code> — để một hàm xử lý tín hiệu hay một tiến trình giám sát quyết định; <code>LOG</code> — cho phép nhưng ghi một dòng kiểm toán. Đây là một bộ lọc hoàn chỉnh, viết tay:</p>
${src('ch11/sandbox.c', 'c')}
<p>Bảy lệnh BPF: nạp kiến trúc và giết mọi lời gọi từ ABI lạ (một cách lách kinh điển là gọi qua bảng syscall 32-bit, nơi số hiệu khác), nạp số hiệu syscall, so với số ta chặn, trả hành động của ta nếu khớp, còn lại cho qua. <code>PR_SET_NO_NEW_PRIVS</code> là bắt buộc trước khi một tiến trình không đặc quyền được cài bộ lọc. Rồi <code>execvp</code> chạy lệnh — bên trong bộ lọc.</p>

<h3>EPERM: bộ lọc trả lời, hàm xử lý không hề chạy</h3>
${run('c117-seccomp', 'gcc -O2 -Wall sandbox.c', 2)}
<p><code>mkdirat</code> trả <code>-1 EPERM</code> mà mã tạo thư mục của nhân không hề chạy; <code>gnumkdir</code> in ra một câu "Operation not permitted" bình thường. (<code>gnumkdir</code> là <code>mkdir</code> của GNU; Ubuntu 26.04 cài nó bên cạnh bản viết lại bằng Rust mặc định, uutils.) Bộ lọc chồng lên nhau và được kế thừa:</p>
${lab('syscall', 'seccomp', 'vi', 'Một bộ lọc seccomp đứng trước bảng syscall: chọn chương trình (mkdir, curl, một luồng Python) và hành động (ALLOW, EPERM, ENOSYS, KILL, LOG) rồi xem kết cục đo thật — exit 1, “Could not resolve host” exit 6, “Bad system call” 159, clone3 ENOSYS lùi về clone.', { tour: 'syscall-errno' })}
${run('c117-seccomp', "grep -E '^(Seccomp|Seccomp_filters|NoNewPrivs):'")}
${run('c117-seccomp', './sandbox eperm:mkdirat grep')}
<p>Trong Docker đã có sẵn một bộ lọc; dưới sandbox của ta có hai, và <code>NoNewPrivs</code> thành 1 (điều này cũng vô hiệu setuid, như bài 13.4 đã cho thấy). Mọi bộ lọc đều chạy ở mọi lời gọi và câu trả lời chặt nhất thắng; bộ lọc truyền sang mọi tiến trình con và sống qua <code>exec</code>; và không tiến trình nào gỡ được. Một sandbox chỉ có thể chặt thêm.</p>
${lab('process', 'sandbox', 'vi', 'Tự dựng một cây tiến trình: mọi tiến trình con tạo bằng fork và mọi chương trình chạy bằng exec đều giữ bộ lọc seccomp của cha — chúng là một phần của tiến trình, như bảng fd.')}

<h3>KILL, và những lỗi chỉ sai hướng</h3>
${run('c117-seccomp', './sandbox kill:mkdirat')}
<p>Với <code>KILL_PROCESS</code> chương trình không bao giờ nhận được một lỗi để xử lý: nhân gửi <code>SIGSYS</code> và shell báo "Bad system call", mã thoát <strong>159</strong> (128 + 31). Không dòng log, không stack trace — hãy tìm mã thoát đó. Một lời gọi bị từ chối còn có thể hiện ra thành một chuyện chẳng liên quan:</p>
${run('c117-seccomp', './sandbox eperm:socket')}
<p>Chặn <code>socket()</code> làm curl báo "Could not resolve host": tra DNS cũng cần một socket, và curl báo bước đầu tiên bị hỏng. Trong một container có sandbox, một lỗi vô lý — DNS hỏng, luồng không chạy, "permission denied" trên file của chính mình — là lý do để dò syscall trước khi gỡ lỗi ứng dụng.</p>

<h3>EPERM hay ENOSYS? Chuyện clone3</h3>
${run('c117-seccomp', './sandbox eperm:clone3 python3')}
${run('c117-seccomp', './sandbox eperm:clone3 java')}
<p>Chặn <code>clone3</code> bằng EPERM làm hỏng việc tạo luồng: Python không tạo được luồng, còn JVM không khởi động nổi bộ gom rác. Giờ cùng lệnh chặn đó nhưng trả <code>ENOSYS</code> ("function not implemented"):</p>
${run('c117-seccomp', './sandbox enosys:clone3 python3')}
${run('c117-seccomp', 'strace -f -qq -e trace=clone,clone3')}
<p>glibc thử <code>clone3</code>, nhận ENOSYS — "nhân này quá cũ để có nó" — và lùi về <code>clone</code> đời cũ, cái được phép. Đây không phải chuyện riêng của lab. Năm 2021 glibc 2.34 bắt đầu tạo luồng bằng <code>clone3</code>; hồ sơ mặc định của Docker lúc đó chưa liệt kê <code>clone3</code>, nên hành động mặc định trả EPERM, và các image bản phân phối mới không tạo được luồng trên máy chủ Docker cũ. Cách sửa là trả ENOSYS cho lời gọi lạ hay mới để thư viện lùi về — và hồ sơ ngày nay làm đúng như vậy:</p>
${run('c117-host', 'docker run --rm --label oslab=1 -v')}
<p>Đọc từ nguồn (<code>github.com/moby/profiles</code>): hành động mặc định <code>SCMP_ACT_ERRNO</code> với errno 1 (EPERM) cho mọi thứ không được liệt kê, 361 syscall được phép cho mọi container, thêm 65 cái chỉ khi có điều kiện về capability, kiến trúc hay đối số — và <code>clone3</code> được trả errno 38, tức ENOSYS, trừ khi container có <code>CAP_SYS_ADMIN</code>.</p>

<div class="pitfall co-tieu-de">
<p><strong>Từ chối bằng EPERM thứ mà thư viện có thể sống thiếu.</strong> Khi bạn viết một hồ sơ (hay một <code>SystemCallFilter=</code> trong systemd), mã lỗi bạn trả về là một phần của hợp đồng. EPERM nói "bạn không được phép" và mã viết cẩn thận sẽ bỏ cuộc; ENOSYS nói "nhân này không có" và mã viết cẩn thận sẽ lùi về cách khác. Với syscall mới (<code>clone3</code>, <code>openat2</code>, <code>io_uring_*</code>…) hãy ưu tiên ENOSYS; để dành KILL cho những lời gọi lẽ ra không bao giờ xảy ra.</p>
</div>

<h3>Docker: mặc định, unconfined, và hồ sơ của riêng bạn</h3>
${run('c117-host', "docker run --rm --label oslab=1 os-lab grep -E '^Seccomp'", 5)}
<p>Container mặc định có một bộ lọc, <code>seccomp=unconfined</code> thì không có. Mặc định từ chối <code>unshare --user</code> (tạo user namespace là một bề mặt tấn công lớn của nhân — Chương 12) và <code>perf_event_open</code> (lý do <code>perf</code> cần thêm tùy chọn ở Chương 3 và 15); unconfined thì cho phép. Đó là lý do khoá học này chỉ dùng <code>unconfined</code> cho từng phép đo trong container vứt đi, không bao giờ cho một ứng dụng. Viết hồ sơ của riêng bạn là một file JSON:</p>
${run('c117-host', 'cat lab/code/ch11/deny-mkdir.json', 2)}
<p>Khi dùng thật, hãy bắt đầu từ hồ sơ mặc định của Docker rồi <em>bỏ bớt</em> những gì dịch vụ của bạn không bao giờ cần; một hồ sơ bắt đầu từ "cho phép tất cả" (như bản minh hoạ này) gần như không bảo vệ được gì.</p>

<h3>Chế độ strict: nơi seccomp bắt đầu</h3>
${src('ch11/strict.c', 'c')}
${run('c117-host', "docker run --rm --label oslab=1 -v \"$PWD/lab/code/ch11\":/lab/ch11 os-lab bash -c 'gcc")}
${run('c117-host', 'docker run --rm --label oslab=1 --security-opt seccomp=unconfined -v')}
<p>seccomp ban đầu (2005) chỉ có một chế độ: sau <code>prctl(PR_SET_SECCOMP, SECCOMP_MODE_STRICT)</code> chỉ còn <code>read</code>, <code>write</code>, <code>exit</code> và <code>sigreturn</code> — để chạy việc tính toán không tin cậy, chỉ nói chuyện qua những ống đã mở sẵn. Trong container Docker nó thậm chí không bật được (EINVAL: tiến trình đã ở chế độ bộ lọc). Ở unconfined, <code>write</code> chạy được và lần <code>getpid</code> kế tiếp giết tiến trình bằng <code>SIGKILL</code>: <strong>mã thoát 137</strong>. Hãy nhớ điều này lần tới khi gặp 137: nó nghĩa là SIGKILL, và OOM killer của Chương 8 chỉ là một trong những bên có thể gửi.</p>

<h3>Danh sách cho phép cho máy chủ Node — và lời gọi bị quên</h3>
<p>Hồ sơ mạnh nhất chỉ cho phép đúng những gì chương trình cần. Bài 11.3 đã cho ta công cụ để tìm ra: <code>strace -f -c</code> trong suốt đời chương trình. Một trình khởi chạy nhỏ biến bảng đó thành bộ lọc — cho phép các lời gọi trong danh sách, EPERM cho mọi thứ còn lại:</p>
${src('ch11/allow.c', 'c')}
${run('c117-seccomp', "echo '#include", 7)}
<p>Khởi động cộng 100 request dùng <strong>54</strong> lời gọi hệ thống khác nhau trên 327 cái máy này định nghĩa. Dưới danh sách cho phép, máy chủ vẫn trả lời "hello" — và ~270 lời gọi còn lại (<code>ptrace</code>, <code>mount</code>, <code>bpf</code>, <code>keyctl</code>, <code>execveat</code>…) không còn tồn tại với nó. Rồi ta thử một việc máy chủ chưa từng làm lúc được ghi:</p>
${run('c117-seccomp', 'timeout 8 ./allow node.sc node -e', 3)}
<p>Ta mong một lỗi <code>EPERM</code> gọn gàng cho <code>mkdir</code> — lỗi đó được in ra — nhưng rồi Node <strong>treo</strong> tới khi <code>timeout</code> giết nó (mã 124). strace cho thấy vì sao: các luồng gọi <code>exit</code> để kết thúc, nhận EPERM, rồi thử lại mãi. Bản ghi của ta không có <code>exit</code>, vì máy chủ chưa từng tắt trong lúc ghi. Thêm đúng cái tên đó là có lỗi gọn gàng như mong muốn (mã 1).</p>

<div class="pitfall co-tieu-de">
<p><strong>Danh sách cho phép ghi từ "đường suôn sẻ".</strong> Khởi động, lưu lượng đều đặn và những request bạn tình cờ gửi chưa phải toàn bộ đời sống của một dịch vụ: tắt máy, xoay vòng log, đường lỗi, phân giải lại DNS, một endpoint ít dùng có tạo tiến trình. Thiếu một lời gọi có thể làm sập, hoặc — tệ hơn, như ở đây — làm treo. Hãy ghi với bộ lọc ở chế độ log trước (<code>SCMP_ACT_LOG</code> làm hành động mặc định), chạy đủ khởi động, phục vụ, lỗi và tắt, đọc log, rồi mới chuyển sang cưỡng chế. Hoặc bắt đầu từ hồ sơ mặc định của Docker và bỏ từng lời gọi nguy hiểm cụ thể, cách này hỏng nhẹ nhàng hơn nhiều.</p>
</div>

<h3>🧪 Thực hành (30 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> sau một đợt kiểm tra, nhóm bạn phải cứng hoá các container của API. Một bạn đề xuất <code>--security-opt seccomp=unconfined</code> "vì perf và strace không chạy", một bạn khác muốn tự làm danh sách cho phép.</p>
<ol>
<li>Trong lab, biên dịch <code>sandbox.c</code> và tái hiện ba kết cục với <code>mkdirat</code>: EPERM, KILL (mã 159), và chênh lệch EPERM với ENOSYS cho <code>clone3</code> bằng Python.</li>
<li>Từ máy chủ, so dòng <code>Seccomp:</code> của một container mặc định và một container unconfined, và chỉ ra một lời gọi mà mặc định từ chối.</li>
<li>Ghi <code>node server.js</code> bằng <code>strace -f -c</code>, dựng danh sách cho phép bằng <code>allow.c</code>, rồi cố tình làm nó hỏng bằng một lời gọi bạn chưa ghi.</li>
<li>Viết ba câu cho nhóm: vì sao không dùng <code>unconfined</code>, vì sao ENOSYS cho lời gọi mới, và cách ghi danh sách cho phép an toàn.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có output EPERM / 159 / ENOSYS, bảng so mặc định với unconfined, một máy chủ chạy dưới danh sách cho phép cộng một lần cố tình làm hỏng, và đề xuất ba câu.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['seccomp (filter mode — chế độ bộ lọc)', 'Chương trình BPF cổ điển nhân chạy ở mọi syscall của tiến trình; trả ALLOW, ERRNO, KILL, TRAP, USER_NOTIF hoặc LOG.'],
  ['PR_SET_NO_NEW_PRIVS', 'Cam kết exec không bao giờ được thêm đặc quyền (không setuid); bắt buộc để cài bộ lọc khi không có CAP_SYS_ADMIN.'],
  ['SIGSYS / mã thoát 159', 'Kết quả của SECCOMP_RET_KILL_PROCESS: tiến trình chết với tín hiệu 31, trạng thái 128 + 31.'],
  ['EPERM vs ENOSYS', '"Bị cấm" làm mã bỏ cuộc; "chưa cài đặt" làm mã lùi về cách khác (clone3 → clone).'],
  ['Docker default profile (hồ sơ mặc định)', 'Từ chối mặc định (EPERM), 361 lời gọi cho mọi container, 65 có điều kiện, clone3 → ENOSYS.'],
  ['seccomp=unconfined', 'Chạy container không có bộ lọc syscall — chỉ cho phép đo một lần trong container vứt đi.'],
  ['strict mode (chế độ strict)', 'Chế độ năm 2005: chỉ read, write, exit, sigreturn; mọi thứ khác là SIGKILL (mã 137).'],
  ['allowlist profile (hồ sơ danh sách cho phép)', 'Chỉ cho phép syscall chương trình dùng; ghi cả vòng đời (SCMP_ACT_LOG) trước khi cưỡng chế.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>seccomp chạy một bộ lọc BPF ở mọi syscall, trước hàm xử lý; các hành động là ALLOW, ERRNO, KILL, TRAP/USER_NOTIF và LOG.</li>
<li>Bộ lọc chồng lên nhau, kế thừa qua fork và exec, và không bao giờ gỡ được; Docker cài sẵn một cái (<code>Seccomp: 2</code>).</li>
<li>Mã lỗi trả về quan trọng: EPERM làm mã bỏ cuộc, ENOSYS làm nó lùi về — sự cố clone3; KILL nghĩa là mã 159 và không log.</li>
<li>Giữ hồ sơ mặc định của Docker, không bao giờ chạy ứng dụng <code>unconfined</code>, và siết bằng cách bỏ bớt lời gọi.</li>
<li>Danh sách cho phép từ strace thu máy chủ Node lại còn 54 trên 327 syscall — nhưng phải ghi qua khởi động, phục vụ, lỗi và tắt.</li>
</ul>
${L('https://man7.org/linux/man-pages/man2/seccomp.2.html', '📄', 'man 2 seccomp', 'Chế độ bộ lọc, mọi hành động trả về, và cấu trúc seccomp_data.', 'Mở')}
${L('https://docs.docker.com/engine/security/seccomp/', '🐳', 'Docker — Seccomp security profiles', 'Hồ sơ mặc định, nó chặn gì, và cách truyền hồ sơ của bạn.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 11.8 — Kiểm tra Chương 11 ───────────────────────── */
    {
      title: '11.8 — Chapter 11 check|||11.8 — Kiểm tra Chương 11',
      slug: 'os-11-8-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về lời gọi hệ thống: printf và bộ đệm, thanh ghi lúc bẫy, -errno, syscall trần, độ trễ 40 ms, giá của strace, vDSO, copy_file_range, EINTR/SA_RESTART và EPERM vs ENOSYS trong seccomp.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Check</span>
<h2>Chapter 11 check: how your program talks to the kernel</h2>
<p class="lead">Ten situations taken from the outputs of this chapter. Each one asks what a trace, a register dump or an exit code means — the skill you need when a real service fails, hangs or is slow.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can follow one call from printf through the libc wrapper, svc #0/syscall and the syscall table to a driver, and back to errno.</li>
<li>I can use strace -Z, -p, -tt/-T and -c to answer "why does it fail / hang / run slow" and count syscalls per request.</li>
<li>I can explain what a syscall costs, why clock reads are cheap (vDSO), and how writev, buffers and copy_file_range reduce crossings.</li>
<li>I can tell EINTR and EAGAIN from real errors, and know what SA_RESTART does and does not cover.</li>
<li>I can read /proc to diagnose a stuck process and explain seccomp's EPERM, ENOSYS and SIGSYS outcomes.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Kiểm tra Chương 11: chương trình của bạn nói chuyện với nhân thế nào</h2>
<p class="lead">Mười tình huống lấy từ output của chương này. Mỗi câu hỏi một dấu vết, một bảng thanh ghi hay một mã thoát có nghĩa là gì — đúng kỹ năng bạn cần khi một dịch vụ thật hỏng, treo hay chậm.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi lần theo được một lời gọi từ printf qua hàm bọc libc, svc #0/syscall và bảng syscall tới một driver, rồi quay về errno.</li>
<li>Tôi dùng được strace -Z, -p, -tt/-T và -c để trả lời "vì sao hỏng / treo / chậm" và đếm syscall mỗi request.</li>
<li>Tôi giải thích được một syscall tốn bao nhiêu, vì sao đọc đồng hồ rẻ (vDSO), và writev, bộ đệm, copy_file_range giảm số lần băng qua ra sao.</li>
<li>Tôi phân biệt được EINTR và EAGAIN với lỗi thật, và biết SA_RESTART che được gì và không che được gì.</li>
<li>Tôi đọc được /proc để chẩn đoán một tiến trình kẹt và giải thích được kết cục EPERM, ENOSYS và SIGSYS của seccomp.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          { question: 'In the lab, <code>gdb -ex "catch syscall write"</code> on a static hello-world stops with this stack: <code>_IO_new_file_write ← … ← _IO_flush_all ← _IO_cleanup ← exit ← __libc_start_call_main</code>. stdout was a pipe. What does it tell you?|||Trong lab, <code>gdb -ex "catch syscall write"</code> trên một hello-world tĩnh dừng với ngăn xếp: <code>_IO_new_file_write ← … ← _IO_flush_all ← _IO_cleanup ← exit ← __libc_start_call_main</code>. stdout là một ống dẫn. Điều này cho biết gì?',
            options: ['printf is itself a system call, and it only runs at exit|||Bản thân printf là một lời gọi hệ thống, và nó chỉ chạy lúc thoát', 'Because stdout was a pipe, glibc kept the line in its stdio buffer and the write() happened only when exit() flushed it|||Vì stdout là ống dẫn, glibc giữ dòng chữ trong bộ đệm stdio và write() chỉ xảy ra khi exit() xả nó', 'gdb delays all system calls until the program exits|||gdb hoãn mọi lời gọi hệ thống tới khi chương trình thoát', 'Static binaries can only write at exit|||Tệp tĩnh chỉ ghi được lúc thoát'],
            correctIndex: 1, points: 1,
            explanation: 'EN: strace showed fstat(1) reporting S_IFIFO; on a pipe glibc uses full buffering, so puts() only copied the text and exit() → _IO_flush_all made the single write(). printf is library code, not a syscall — the tempting answer A confuses the wrapper with the trap. On a terminal the same binary writes immediately; a SIGKILL before exit would lose the line.|||VI: strace cho thấy fstat(1) báo S_IFIFO; trên ống dẫn glibc đệm đầy, nên puts() chỉ chép chữ và exit() → _IO_flush_all mới thực hiện lần write() duy nhất. printf là mã thư viện, không phải syscall — đáp án A hấp dẫn nhưng nhầm hàm bọc với cú bẫy. Trên terminal cùng tệp đó ghi ngay; một SIGKILL trước khi thoát sẽ làm mất dòng chữ.' },
          { question: 'At the trap gdb prints <code>x8 = 64, x0 = 1, x1 = 0x318f8420, x2 = 10</code>; after one <code>stepi</code>, <code>x0 = 10</code>. On arm64, which reading is correct?|||Lúc sập bẫy gdb in <code>x8 = 64, x0 = 1, x1 = 0x318f8420, x2 = 10</code>; sau một <code>stepi</code>, <code>x0 = 10</code>. Trên arm64, cách đọc nào đúng?',
            options: ['x0 = 1 before the call means the write already failed|||x0 = 1 trước lời gọi nghĩa là write đã hỏng', '64 is the number of bytes to write, x2 is the syscall number|||64 là số byte cần ghi, x2 là số hiệu syscall', 'x8 holds the return value, so 64 bytes were written|||x8 giữ giá trị trả về, nên đã ghi 64 byte', 'x8 = 64 selects write; x0, x1, x2 are fd 1, the buffer and the length; the kernel puts the result (10 bytes) back into x0|||x8 = 64 chọn write; x0, x1, x2 là fd 1, bộ đệm và độ dài; nhân đặt kết quả (10 byte) trở lại x0'],
            correctIndex: 3, points: 1,
            explanation: 'EN: The arm64 convention (man 2 syscall): number in x8, arguments in x0–x5, result in x0. __NR_write is 64 in asm-generic/unistd.h, and the buffer at x1 held "hi from C\\n" (10 bytes). On x86-64 the same call would use rax = 1 and rdi/rsi/rdx. Answer C mixes up the number register with the result register.|||VI: Quy ước arm64 (man 2 syscall): số hiệu ở x8, đối số ở x0–x5, kết quả ở x0. __NR_write là 64 trong asm-generic/unistd.h, và bộ đệm ở x1 chứa "hi from C\\n" (10 byte). Trên x86-64 cùng lời gọi dùng rax = 1 và rdi/rsi/rdx. Đáp án C lẫn thanh ghi số hiệu với thanh ghi kết quả.' },
          { question: 'A static program opens <code>/nope/config.json</code>. It prints <code>open returned -1, errno = 2</code>, strace shows <code>= -1 ENOENT</code>, but gdb shows <code>x0 = -2</code> right after the syscall returns. Why the difference?|||Một chương trình tĩnh mở <code>/nope/config.json</code>. Nó in <code>open returned -1, errno = 2</code>, strace hiện <code>= -1 ENOENT</code>, nhưng gdb cho thấy <code>x0 = -2</code> ngay khi syscall trả về. Vì sao khác nhau?',
            options: ['The kernel returns -errno (-2); the libc wrapper sees a value in -4095…-1, stores 2 in errno and returns -1|||Nhân trả -errno (-2); hàm bọc libc thấy giá trị trong khoảng -4095…-1, cất 2 vào errno và trả -1', 'The kernel returns -1 and writes errno into the process memory itself|||Nhân trả -1 và tự ghi errno vào bộ nhớ tiến trình', 'gdb shows a wrong value because static binaries have no symbols|||gdb hiện sai vì tệp tĩnh không có ký hiệu', 'ENOENT is 1 on arm64, so -2 must be a different error|||ENOENT là 1 trên arm64, nên -2 hẳn là lỗi khác'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Kernel convention: ≥ 0 success, -errno failure. The -1 + errno pair is a C library convention. strace decodes the raw -2 for you and prints it as "-1 ENOENT". The kernel never touches errno (answer B); that is why a raw svc in lesson 11.2 returned -9 with errno still 0.|||VI: Quy ước của nhân: ≥ 0 là thành công, -errno là thất bại. Cặp -1 + errno là quy ước của thư viện C. strace giải mã giá trị thô -2 giùm bạn và in thành "-1 ENOENT". Nhân không bao giờ đụng vào errno (đáp án B); vì thế svc trần ở bài 11.2 trả -9 mà errno vẫn bằng 0.' },
          { question: 'A sandbox helper issues <code>write</code> with inline <code>svc #0</code> and checks <code>if (r == -1) log_error()</code>. In the lab the same raw call on fd 99 returned <code>-9</code> and <code>errno = 0</code>. What happens in production?|||Một hàm trợ giúp sandbox gọi <code>write</code> bằng <code>svc #0</code> nội tuyến và kiểm <code>if (r == -1) log_error()</code>. Trong lab, cùng lời gọi trần trên fd 99 trả <code>-9</code> và <code>errno = 0</code>. Ở production chuyện gì xảy ra?',
            options: ['Nothing: -9 and -1 are both caught by the check|||Không sao: cả -9 và -1 đều bị phép kiểm bắt', 'errno = 0 proves the write succeeded|||errno = 0 chứng tỏ lần ghi đã thành công', 'Every failure is missed: raw syscalls return -errno (-9, -28…), so the code must treat any value in -4095…-1 as an error|||Mọi lỗi đều bị bỏ lọt: syscall trần trả -errno (-9, -28…), nên mã phải coi mọi giá trị trong -4095…-1 là lỗi', 'svc only ever returns -1 on failure on arm64|||Trên arm64 svc chỉ trả -1 khi lỗi'],
            correctIndex: 2, points: 1,
            explanation: 'EN: Only libc converts -errno to -1 + errno. A raw call that fails with EBADF returns -9, with ENOSPC -28 — never -1 (that would be EPERM). Answer B is the trap: errno is untouched by a raw syscall, so 0 means nothing.|||VI: Chỉ libc mới đổi -errno thành -1 + errno. Một lời gọi trần hỏng vì EBADF trả -9, vì ENOSPC trả -28 — không bao giờ -1 (đó sẽ là EPERM). Đáp án B là cái bẫy: syscall trần không đụng tới errno, nên 0 chẳng nói lên gì.' },
          { question: 'Python <code>http.server</code>: 200 keep-alive requests on localhost take 8.4 s while the CPU is idle. A client trace shows the 111 header bytes, then <code>recvfrom = -1 EAGAIN</code>, then the 6-byte body 41 ms later. Best fix?|||<code>http.server</code> của Python: 200 request keep-alive trên localhost mất 8,4 s trong khi CPU rảnh. Dấu vết client cho thấy 111 byte header, rồi <code>recvfrom = -1 EAGAIN</code>, rồi phần thân 6 byte tới sau 41 ms. Cách sửa tốt nhất?',
            options: ['Add more worker processes|||Thêm tiến trình worker', 'Disable Nagle with TCP_NODELAY, or send headers and body in one write|||Tắt Nagle bằng TCP_NODELAY, hoặc gửi header và thân trong một lần ghi', 'Increase the listen backlog|||Tăng hàng đợi listen', 'Give curl a larger receive buffer|||Cho curl bộ đệm nhận lớn hơn'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Two small sendto calls meet Nagle (hold the second segment until the first is ACKed) and the client\'s delayed ACK (~40 ms). NODELAY=1 brought 200 requests to 0.028 s; Node avoids it with one writev and TCP_NODELAY. More workers (A) would still wait 40 ms per response.|||VI: Hai lần sendto nhỏ gặp Nagle (giữ đoạn thứ hai tới khi đoạn đầu được báo nhận) và ACK trễ của client (~40 ms). NODELAY=1 đưa 200 request xuống 0,028 s; Node tránh nó bằng một writev và TCP_NODELAY. Thêm worker (A) thì mỗi phản hồi vẫn chờ 40 ms.' },
          { question: '<code>dd bs=1 count=100000</code> takes 0.05 s alone, 8.3 s under <code>strace -e trace=openat</code>, and 0.05 s under <code>strace --seccomp-bpf -f -e trace=openat</code>. Why?|||<code>dd bs=1 count=100000</code> tự chạy mất 0,05 s, dưới <code>strace -e trace=openat</code> mất 8,3 s, và dưới <code>strace --seccomp-bpf -f -e trace=openat</code> mất 0,05 s. Vì sao?',
            options: ['ptrace stops the process at every syscall even if strace only prints openat; --seccomp-bpf lets the kernel stop it only for the calls being traced|||ptrace dừng tiến trình ở mọi syscall dù strace chỉ in openat; --seccomp-bpf cho nhân chỉ dừng nó ở những lời gọi đang được dò', 'strace writes a huge output file in the slow case|||Ở trường hợp chậm strace ghi ra một file khổng lồ', 'dd detects strace and slows down on purpose|||dd phát hiện strace và cố ý chạy chậm', '--seccomp-bpf makes dd skip its read and write calls|||--seccomp-bpf làm dd bỏ qua các lời gọi read và write'],
            correctIndex: 0, points: 1,
            explanation: 'EN: Filtering with -e only filters the printing; without --seccomp-bpf every one of the 200,000 syscalls still causes two ptrace stops. With it, strace installs a seccomp filter that returns TRACE only for openat. Answer D is wrong: dd still made all its calls — they just did not stop. Under real load prefer this, short attaches, or eBPF.|||VI: Lọc bằng -e chỉ lọc phần in ra; không có --seccomp-bpf thì cả 200.000 syscall vẫn gây hai lần dừng ptrace. Có nó, strace cài một bộ lọc seccomp chỉ trả TRACE cho openat. Đáp án D sai: dd vẫn gọi đủ — chỉ là không bị dừng. Khi có tải thật hãy dùng cách này, gắn ngắn, hoặc eBPF.' },
          { question: 'Two million <code>Date.now() + performance.now()</code> in Node under <code>strace -f -e trace=clock_gettime,gettimeofday</code> produce 0 lines. What is going on?|||Hai triệu lần <code>Date.now() + performance.now()</code> trong Node dưới <code>strace -f -e trace=clock_gettime,gettimeofday</code> cho 0 dòng. Chuyện gì đang xảy ra?',
            options: ['Node caches the time once at startup|||Node lưu sẵn giờ một lần lúc khởi động', 'strace cannot see syscalls made by V8|||strace không thấy syscall do V8 thực hiện', 'Date.now() asks a timer thread instead of the kernel|||Date.now() hỏi một luồng hẹn giờ thay vì nhân', 'The clock is read in user space through the vDSO, so no system call is made at all|||Đồng hồ được đọc ở phía người dùng qua vDSO, nên không có lời gọi hệ thống nào'],
            correctIndex: 3, points: 1,
            explanation: 'EN: glibc\'s clock_gettime runs __kernel_clock_gettime from the vDSO page (~18 ns vs ~200 ns for the forced syscall). The same held for Python and Java. strace sees V8\'s other syscalls fine (B is false); a cached time (A) would not advance. If the clocksource cannot be read from user space, the calls would appear — that is how you detect it.|||VI: clock_gettime của glibc chạy __kernel_clock_gettime trong trang vDSO (~18 ns so với ~200 ns khi ép qua syscall). Python và Java cũng vậy. strace vẫn thấy các syscall khác của V8 (B sai); giờ lưu sẵn (A) thì không chạy tới được. Nếu nguồn đồng hồ không đọc được từ phía người dùng thì các lời gọi sẽ hiện ra — đó là cách phát hiện.' },
          { question: 'Copying 256 MiB: read/write with 4 KiB chunks made 131,073 syscalls in 0.132 s; <code>copy_file_range</code> made 1 call in 0.038 s. In the lab, which runtime copy functions issued <code>copy_file_range</code>?|||Chép 256 MiB: read/write khối 4 KiB tốn 131.073 syscall trong 0,132 s; <code>copy_file_range</code> tốn 1 lời gọi trong 0,038 s. Trong lab, hàm chép nào của các runtime đã phát lệnh <code>copy_file_range</code>?',
            options: ['None — runtimes always copy through a user-space buffer|||Không cái nào — runtime luôn chép qua bộ đệm phía người dùng', 'Only Python’s shutil.copyfile|||Chỉ shutil.copyfile của Python', 'Node’s fs.copyFileSync, Python’s shutil.copyfile and Java’s Files.copy all did|||Cả fs.copyFileSync của Node, shutil.copyfile của Python và Files.copy của Java', 'Only Java’s Files.copy, through JNI|||Chỉ Files.copy của Java, qua JNI'],
            correctIndex: 2, points: 1,
            explanation: 'EN: strace -c showed copy_file_range (1 call for Node, 2 for Python and Java) and only a few small reads. The lesson: use the runtime’s copy function instead of a read/write loop; the kernel moves the data without it ever entering your process.|||VI: strace -c cho thấy copy_file_range (1 lời gọi với Node, 2 với Python và Java) và chỉ vài lần read nhỏ. Bài học: dùng hàm chép của runtime thay cho vòng lặp read/write; nhân chuyển dữ liệu mà nó không bao giờ đi vào tiến trình của bạn.' },
          { question: 'A handler for SIGALRM is installed <strong>with</strong> SA_RESTART. The alarm fires while the process waits, once in <code>read()</code> on a pipe and once in <code>poll()</code>. What happens?|||Một hàm xử lý SIGALRM được cài <strong>có</strong> SA_RESTART. Báo thức nổ trong lúc tiến trình đang chờ, một lần trong <code>read()</code> trên một ống và một lần trong <code>poll()</code>. Chuyện gì xảy ra?',
            options: ['Both calls are restarted by the kernel|||Cả hai lời gọi được nhân chạy lại', 'read() is restarted transparently; poll() still returns -1 EINTR|||read() được chạy lại trong im lặng; poll() vẫn trả -1 EINTR', 'Both return -1 EINTR|||Cả hai trả -1 EINTR', 'poll() is restarted, read() returns EINTR|||poll() được chạy lại, read() trả EINTR'],
            correctIndex: 1, points: 1,
            explanation: 'EN: strace showed read → ERESTARTSYS → rt_sigreturn = 3 (original fd restored) → read again; but ppoll → ERESTARTNOHAND → -1 EINTR. man 7 signal lists poll, epoll_wait, select and the sleep calls as never restarted, because they have timeouts. So event loops must handle EINTR from their wait call.|||VI: strace cho thấy read → ERESTARTSYS → rt_sigreturn = 3 (fd ban đầu được đặt lại) → read lần nữa; còn ppoll → ERESTARTNOHAND → -1 EINTR. man 7 signal liệt kê poll, epoll_wait, select và các hàm ngủ là không bao giờ được chạy lại, vì chúng có hạn chờ. Vậy vòng lặp sự kiện phải xử lý EINTR từ lời gọi chờ.' },
          { question: 'In a container, a seccomp filter that answers <code>clone3</code> with EPERM makes Python fail with "can’t start new thread"; answering with ENOSYS makes it work, and strace shows <code>clone3(…) = -1 ENOSYS</code> then <code>clone(…) = 54</code>. Why?|||Trong một container, bộ lọc seccomp trả EPERM cho <code>clone3</code> làm Python hỏng với "can’t start new thread"; trả ENOSYS thì chạy được, và strace cho thấy <code>clone3(…) = -1 ENOSYS</code> rồi <code>clone(…) = 54</code>. Vì sao?',
            options: ['ENOSYS tells glibc the kernel has no such call, so it falls back to clone; EPERM means "forbidden" and glibc gives up|||ENOSYS báo glibc rằng nhân không có lời gọi đó, nên nó lùi về clone; EPERM nghĩa là "bị cấm" và glibc bỏ cuộc', 'ENOSYS disables the seccomp filter for the rest of the process|||ENOSYS tắt bộ lọc seccomp cho phần còn lại của tiến trình', 'Python ignores ENOSYS but not EPERM by accident|||Python vô tình bỏ qua ENOSYS mà không bỏ qua EPERM', 'clone3 is only used by Java, so Python was never affected|||clone3 chỉ được Java dùng, nên Python chưa từng bị ảnh hưởng'],
            correctIndex: 0, points: 1,
            explanation: 'EN: This is the 2021 clone3 incident: glibc 2.34 created threads with clone3, older Docker profiles answered EPERM and threads broke; today Docker’s profile returns errno 38 (ENOSYS) for clone3 unless CAP_SYS_ADMIN. Filters can never be disabled from inside (B). Deny new syscalls with ENOSYS.|||VI: Đây là sự cố clone3 năm 2021: glibc 2.34 tạo luồng bằng clone3, hồ sơ Docker cũ trả EPERM và việc tạo luồng hỏng; ngày nay hồ sơ Docker trả errno 38 (ENOSYS) cho clone3 trừ khi có CAP_SYS_ADMIN. Bộ lọc không bao giờ tắt được từ bên trong (B). Hãy từ chối syscall mới bằng ENOSYS.' },
        ],
      },
    },
  ],
};
