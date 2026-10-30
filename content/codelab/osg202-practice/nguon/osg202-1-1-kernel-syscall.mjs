/**
 * OSG202 · 1.1 — What an OS is: kernel, user/kernel mode and system calls (+ đọc vết strace).
 */
import { doiDau, KHOA, bi, hai, giai, tinh, jsDe, mc, tn, xoay, nguon } from './_os.mjs';

const E1 = tinh({
  tieuDe: 'Kernel 1 — Kernel mode, user mode and the role of the OS',
  doKho: 'EASY', phut: 8,
  moTa: bi('<p>Five basic questions on what an operating system is and does.</p>', '<p>Năm câu cơ bản về hệ điều hành là gì và làm gì.</p>'),
  loai: 'choice',
  cauHoi: [
    mc('c1', ['Which description of the operating system is most accurate?', 'Mô tả nào về hệ điều hành chính xác nhất?'], [['a', 'It is both an extended machine (nice abstractions) and a resource manager (CPU, memory, devices)'], ['b', 'It is only a graphical interface'], ['c', 'It is the same as the BIOS'], ['d', 'It is a compiler']], 'a', ['Tanenbaum’s two views: top-down (abstraction) and bottom-up (resource management).', 'Hai góc nhìn của Tanenbaum: từ trên xuống (trừu tượng hoá) và từ dưới lên (quản lý tài nguyên).']),
    mc('c2', ['Why does the CPU have a user mode and a kernel mode?', 'Vì sao CPU có chế độ người dùng và chế độ kernel?'], [['a', 'So that only the OS can execute privileged instructions and a faulty program cannot take over the machine'], ['b', 'To run two programs at once'], ['c', 'To save electricity'], ['d', 'To make the cache bigger']], 'a', ['Privileged instructions (I/O, interrupt masks, page-table registers) trap if executed in user mode.', 'Lệnh đặc quyền (I/O, mặt nạ ngắt, thanh ghi bảng trang) gây trap nếu chạy ở chế độ người dùng.']),
    mc('c3', ['A user program executes a privileged instruction in user mode. What happens?', 'Chương trình người dùng chạy lệnh đặc quyền ở chế độ người dùng. Điều gì xảy ra?'], [['a', 'The CPU raises an exception (trap) and the OS usually kills the process'], ['b', 'The instruction runs normally'], ['c', 'The CPU switches to kernel mode silently'], ['d', 'The instruction is ignored']], 'a', ['The trap hands control to the kernel, which decides the consequence.', 'Trap chuyển quyền cho kernel, kernel quyết định hậu quả.']),
    mc('c4', ['Which component is NOT part of the kernel in a monolithic design like Linux?', 'Thành phần nào KHÔNG thuộc kernel trong thiết kế nguyên khối như Linux?'], [['a', 'The shell (command interpreter)'], ['b', 'The process scheduler'], ['c', 'The virtual-memory manager'], ['d', 'Most device drivers']], 'a', ['The shell is an ordinary user program that happens to start other programs.', 'Shell là chương trình người dùng bình thường dùng để khởi động chương trình khác.']),
    mc('c5', ['A microkernel differs from a monolithic kernel in that …', 'Microkernel khác kernel nguyên khối ở chỗ …'], [['a', 'only the minimum (IPC, scheduling, basic memory) runs in kernel mode; drivers and file systems run as user processes'], ['b', 'it has no scheduler'], ['c', 'it cannot run on real hardware'], ['d', 'it is always faster']], 'a', ['Better isolation and reliability, at the cost of more message passing.', 'Cách ly và độ tin cậy tốt hơn, đổi lại nhiều truyền thông điệp hơn.']),
  ],
  goiY: ['Kernel mode = full hardware access; user mode = restricted.', 'The shell is just a program.'],
  loiHayGap: ['Treating the shell or the GUI as part of the kernel.', 'Thinking a microkernel is always faster.'],
  giaiThich: '<p>a · a · a · a · a.</p>',
  thuatNgu: [tn('kernel mode', 'chế độ kernel: toàn quyền phần cứng'), tn('privileged instruction', 'lệnh đặc quyền'), tn('monolithic kernel', 'kernel nguyên khối')],
  khaiNiem: ['OS role', 'dual mode', 'kernel structure'],
});

const OPS = [
  ['Disable interrupts (cli)', 'Kernel mode only'], ['Add two registers (ADD r1, r2)', 'User mode is enough'], ['Execute the IN / OUT port instruction', 'Kernel mode only'],
  ['Load a value from the process’s own stack', 'User mode is enough'], ['Write the page-table base register', 'Kernel mode only'], ['Set the timer chip to fire in 10 ms', 'Kernel mode only'],
];
const E2 = tinh({
  tieuDe: 'Kernel 2 — Which operations need kernel mode?',
  doKho: 'EASY', phut: 7,
  moTa: bi('<p>For each operation say whether the CPU must be in kernel mode to execute it directly.</p>', '<p>Với mỗi thao tác cho biết CPU có phải ở chế độ kernel mới thực hiện trực tiếp được không.</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Operation → mode', 'Thao tác → chế độ'),
    cot: [{ ma: 'o', ten: 'Operation' }, { ma: 'm', ten: 'Mode', luaChon: ['Kernel mode only', 'User mode is enough'] }],
    hang: OPS.map(([o], i) => ({ ma: `r${i}`, o: { o } })),
    dapAn: Object.fromEntries(OPS.map(([, m], i) => [`r${i}.m`, m])),
    giaiThich: giai('Anything that touches shared hardware state — interrupts, I/O ports, MMU registers, the timer — is privileged. Ordinary arithmetic and memory access inside your own address space is not.', 'Mọi thứ chạm vào trạng thái phần cứng dùng chung — ngắt, cổng I/O, thanh ghi MMU, bộ định thời — là đặc quyền. Tính toán thường và truy cập bộ nhớ trong không gian địa chỉ của mình thì không.'),
  }],
  goiY: ['Ask: could a buggy program break OTHER programs by doing this?', 'Arithmetic and own-memory accesses are always allowed.'],
  loiHayGap: ['Thinking reading memory needs kernel mode.', 'Forgetting that the timer is privileged — otherwise a program could stop the scheduler.'],
  giaiThich: '<p>' + OPS.map(([, m]) => (m.startsWith('Kernel') ? 'K' : 'U')).join(' ') + '</p>',
  thuatNgu: [tn('trap', 'ngắt mềm / ngoại lệ chuyển vào kernel')],
  khaiNiem: ['privileged instructions'],
});

const SC = ['The program calls the library wrapper read(fd, buf, n)', 'The wrapper puts the system-call number and arguments in registers and executes a TRAP instruction', 'The CPU switches to kernel mode and jumps to the system-call handler', 'The kernel looks the number up in the system-call table and runs sys_read', 'The kernel copies the data into the user buffer and returns, switching back to user mode', 'The wrapper returns the byte count to the calling program'];
const E3 = tinh({
  tieuDe: 'Kernel 3 — Order the steps of a system call',
  doKho: 'MEDIUM', phut: 8,
  moTa: bi('<p>Arrange the steps of the system call read() from the user program to the return value.</p>', '<p>Sắp xếp các bước của lời gọi hệ thống read() từ chương trình người dùng đến giá trị trả về.</p>'),
  loai: 'order',
  cauHoi: [{
    ma: 'q1', de: hai('Steps of read()', 'Các bước của read()'),
    muc: xoay(SC.map((n, i) => ({ ma: `s${i + 1}`, noiDung: n })), 3), dapAn: SC.map((_, i) => `s${i + 1}`),
    giaiThich: giai('The library wrapper hides the TRAP; the mode switch happens in hardware; the kernel dispatches through a table; the return path restores user mode (a “return from trap”).', 'Hàm bao trong thư viện che đi lệnh TRAP; việc đổi chế độ do phần cứng làm; kernel điều phối qua bảng; đường về khôi phục chế độ người dùng (return from trap).'),
  }],
  goiY: ['The user program never executes the kernel code directly: it asks through a TRAP.', 'Mode changes: user → kernel at the trap, kernel → user at the return.'],
  loiHayGap: ['Placing the mode switch before the arguments are prepared.', 'Forgetting that the library wrapper prepares the registers.'],
  giaiThich: '<p>call → TRAP → kernel mode → table dispatch → copy + return → result.</p>',
  thuatNgu: [tn('system call table', 'bảng lời gọi hệ thống'), tn('wrapper', 'hàm bao của thư viện C')],
  khaiNiem: ['system call', 'trap'],
});

const SYS = ['Create a child process', 'Replace the program image of the caller', 'Wait for a child to terminate', 'Obtain a file descriptor for a file', 'Create a one-way communication channel', 'Duplicate a file descriptor onto a chosen number', 'Send a signal to a process', 'Change the permissions of a file'];
const CALLS = [['fork()', 0], ['execve()', 1], ['waitpid()', 2], ['open()', 3], ['pipe()', 4], ['dup2()', 5], ['kill()', 6], ['chmod()', 7]];
const E4 = tinh({
  tieuDe: 'Kernel 4 — Match the UNIX system call to its purpose',
  doKho: 'EASY', phut: 7,
  moTa: bi('<p>Pick the purpose of each POSIX system call.</p>', '<p>Chọn mục đích của từng lời gọi hệ thống POSIX.</p>'),
  loai: 'table',
  bang: [{
    ma: 'b1', de: hai('Call → purpose', 'Lời gọi → mục đích'),
    cot: [{ ma: 'c', ten: 'Call' }, { ma: 'p', ten: 'Purpose', luaChon: SYS }],
    hang: CALLS.map(([c], i) => ({ ma: `r${i}`, o: { c } })),
    dapAn: Object.fromEntries(CALLS.map(([, k], i) => [`r${i}.p`, SYS[k]])),
    giaiThich: giai('fork creates, execve replaces, waitpid synchronises with a child; open/pipe/dup2 deal with file descriptors; kill sends signals (not only SIGKILL); chmod edits the mode bits in the i-node.', 'fork tạo, execve thay thế, waitpid đồng bộ với tiến trình con; open/pipe/dup2 làm việc với file descriptor; kill gửi tín hiệu (không chỉ SIGKILL); chmod sửa bit quyền trong i-node.'),
  }],
  goiY: ['Call names are abbreviations: pipe → pipe, dup2 → duplicate.', 'kill is a historical name: it sends ANY signal.'],
  loiHayGap: ['Believing kill() always terminates the target.', 'Mixing up fork (create) and exec (replace).'],
  giaiThich: '<p>' + CALLS.map(([c, k]) => `${c} → ${SYS[k]}`).join('; ') + '.</p>',
  thuatNgu: [tn('POSIX', 'chuẩn giao diện UNIX')],
  khaiNiem: ['POSIX system calls'],
});

/* Bài 5 HARD: phân tích vết strace */
function summarize(lines) {
  const counts = {}; const open = {}; let errors = 0;
  for (const raw of lines) {
    const m = /^([a-z_0-9]+)\((.*)\)\s*=\s*(-?\d+)/.exec(raw.trim());
    if (!m) continue;
    const name = m[1]; const ret = parseInt(m[3], 10);
    counts[name] = (counts[name] || 0) + 1;
    if (ret < 0) { errors++; continue; }
    if (name === 'open' || name === 'openat') open[ret] = true;
    else if (name === 'close') { const fd = parseInt(m[2], 10); delete open[fd]; }
  }
  return { counts, errors, leaked: Object.keys(open).map(Number).sort((a, b) => a - b) };
}
const T1 = ['openat(AT_FDCWD, "/etc/hosts", O_RDONLY) = 3', 'read(3, "127.0.0.1 localhost", 4096) = 22', 'close(3) = 0', 'write(1, "done", 4) = 4'];
const T2 = ['open("/tmp/a", O_RDONLY) = 3', 'open("/tmp/b", O_RDONLY) = 4', 'read(4, "", 100) = 0', 'open("/nope", O_RDONLY) = -1', 'close(4) = 0', 'open("/tmp/c", O_RDONLY) = 4'];
const E5 = jsDe({
  tieuDe: 'Kernel 5 — Summarise a strace log and find leaked descriptors',
  doKho: 'HARD', phut: 25,
  moTa: bi(`<p>strace prints every system call as <code>name(arguments) = result</code>. Write <code>summarize(lines)</code> returning <code>{ counts, errors, leaked }</code>: <code>counts</code> maps each call name to how many times it appears; <code>errors</code> is the number of calls whose result is negative (e.g. <code>= -1</code>); <code>leaked</code> is the sorted array of file descriptors returned by successful <code>open</code>/<code>openat</code> calls that were never closed afterwards (<code>close(fd)</code> closes <code>fd</code>; a descriptor number may be reused after a close). Lines that do not look like a system call are ignored.</p>`,
    `<p>strace in mỗi lời gọi hệ thống dạng <code>tên(đối số) = kết quả</code>. Viết <code>summarize(lines)</code> trả <code>{ counts, errors, leaked }</code>: <code>counts</code> ánh xạ tên lời gọi sang số lần xuất hiện; <code>errors</code> là số lời gọi có kết quả âm (vd <code>= -1</code>); <code>leaked</code> là mảng đã sắp xếp các file descriptor do <code>open</code>/<code>openat</code> thành công trả về mà sau đó không được đóng (<code>close(fd)</code> đóng <code>fd</code>; số descriptor được dùng lại sau khi đóng). Dòng không giống lời gọi hệ thống thì bỏ qua.</p>`),
  yeuCau: [bi('Failed calls (negative result) never open a descriptor.', 'Lời gọi lỗi (kết quả âm) không mở descriptor nào.')],
  viDu: [{ input: 'summarize([\'open("/a", O_RDONLY) = 3\', \'close(3) = 0\'])', output: JSON.stringify(summarize(['open("/a", O_RDONLY) = 3', 'close(3) = 0'])), explanation: 'One open and one close: nothing leaked.|||Một open và một close: không rò gì.' }],
  goiY: ['Parse with a regular expression: ^name\\(args\\) = number.', 'Track the set of open descriptors: add on successful open, remove on close.'],
  loiHayGap: ['Counting the failed open (= -1) as a leaked descriptor.', 'Forgetting that fd 4 can be opened again after being closed.'],
  giaiThich: '<p>This is exactly the first step of diagnosing an fd leak (EMFILE) with strace.</p>',
  khaiNiem: ['system calls', 'file descriptors', 'strace'],
  fn: 'summarize',
  dau: "function summarize(lines) {\n  return { counts: {}, errors: 0, leaked: [] };\n}\n",
  giaiMa: '// Parse each line and keep a set of open descriptors.\n' + nguon(summarize),
  ref: summarize,
  cases: [{ args: [T1] }, { args: [T2] }, { args: [['ioctl(1, TCGETS, 0x7ffe) = -1', 'garbage line', 'mmap(NULL, 4096) = 140234']], an: true }, { args: [[]], an: true }, { args: [['openat(AT_FDCWD, "/x", O_RDONLY) = 5', 'openat(AT_FDCWD, "/y", O_RDONLY) = 6', 'close(5) = 0', 'close(5) = -1']], an: true }],
});

export default doiDau({
  slug: 'osg202-1-1-kernel-syscall',
  ten: '1.1 What an OS is: kernel & system calls',
  khoa: KHOA,
  baiHoc: 'osg202-1-1-kernel-syscall',
  de: [E1, E2, E3, E4, E5],
});
void hai;
