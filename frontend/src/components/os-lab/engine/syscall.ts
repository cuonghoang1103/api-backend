/**
 * "Hành trình một lời gọi hệ thống" — engine thuần cho mô phỏng `syscall` (Chương 11).
 *
 * Một lời gọi đi: mã của bạn → libc → lệnh bẫy (svc #0 trên arm64 / syscall trên x86-64: lõi đổi chế độ người dùng →
 * chế độ nhân) → điểm vào của nhân → [bộ lọc seccomp] → bảng sys_call_table[nr] → hàm xử lý (ksys_write → vfs_write)
 * → móc LSM → driver (write_null / page cache / TCP) → quay về: thanh ghi kết quả = số byte hoặc −errno → libc đổi
 * −2 thành −1 + errno = 2. Mỗi chặng có GIÁ (ns) — tổng các chặng khớp số đo thật của lab/out/c114-chi-phi:
 *   hàm thường 2,1 ns · getppid() 176,2 ns (svc trần 175,0) · write(/dev/null) 195,7 · read(/dev/zero) 199,8
 *   · clock_gettime vDSO 18,5 (ép syscall 202,1) — và c113-strace (dd bs=1: 0,053 s → strace 8,261 s → --seccomp-bpf 0,051 s),
 *   c111-hanh-trinh (x8 = 64, x0 = 1, x2 = 10; openat → x0 = −2 → errno 2), c111-kernel (chuỗi ftrace), c117-seccomp.
 * Chặng nào không đo được trong lab thì `est: true` (giao diện ghi "≈ ước lượng").
 */

export type Arch = 'arm64' | 'x86';
export type Kind = 'write' | 'open' | 'clock' | 'writev' | 'mkdir' | 'socket' | 'clone3';
export type Target = 'null' | 'file' | 'tcp';
export type TraceMode = 'off' | 'ptrace' | 'bpf';
export type FilterAct = 'none' | 'allow' | 'eperm' | 'enosys' | 'kill' | 'log';
export type Layer = 'app' | 'libc' | 'vdso' | 'cpu' | 'entry' | 'seccomp' | 'table' | 'handler' | 'lsm' | 'driver' | 'device' | 'tracer';

export interface SysCfg {
  kind: Kind;
  arch: Arch;
  /** fd 1 trỏ vào đâu (write / writev) */
  target: Target;
  /** stdout là terminal (đệm theo dòng ⇒ ghi ngay) hay ống/tệp (đệm đầy ⇒ ghi lúc exit) */
  tty: boolean;
  /** clock_gettime: ép đi đường syscall thật thay vì vDSO */
  force: boolean;
  trace: TraceMode;
  filter: FilterAct;
  /** móc LSM (AppArmor/SELinux) từ chối ⇒ −EACCES */
  lsmDeny: boolean;
  /** openat: đường dẫn có tồn tại không */
  exists: boolean;
}

export const DEFAULT_CFG: SysCfg = { kind: 'write', arch: 'arm64', target: 'null', tty: false, force: false, trace: 'off', filter: 'none', lsmDeny: false, exists: false };

/** Số hiệu lời gọi (asm-generic/unistd.h trên arm64; arch/x86/entry/syscalls/syscall_64.tbl). */
export const NR: Record<Arch, Record<string, number>> = {
  arm64: { write: 64, openat: 56, clock_gettime: 113, writev: 66, mkdirat: 34, socket: 198, clone3: 435, read: 63, getppid: 173, exit_group: 94 },
  x86: { write: 1, openat: 257, clock_gettime: 228, writev: 20, mkdirat: 258, socket: 41, clone3: 435, read: 0, getppid: 110, exit_group: 231 },
};

/** Số đo thật (lab/out/c114-chi-phi, c113-strace, c93-fsync). */
export const COST = {
  fn: 2.1, getppid: 176.2, svcAsm: 175.0, vdsoClock: 18.5, gettimeofday: 17.8, forcedClock: 202.1, writeNull: 195.7, readZero: 199.8,
  /** ghi có đệm vào ext4 (page cache), mỗi lần ghi — Chương 9 (c93-fsync) */
  fileWrite: 1800,
  /** fsync mỗi lần ghi — Chương 9 */
  fsync: 957900,
  /** một lần dừng ptrace của strace (vào hoặc ra) = (8,261 − 0,053) s / 200 000 lời gọi / 2 */
  ptraceStop: ((8.261 - 0.053) / 200000 / 2) * 1e9,
} as const;

/** Chia nhỏ 175 ns của một vòng bẫy trần (getppid qua svc inline asm) — tổng khớp số đo, phần chia là ước lượng hợp lý. */
const TRAP = { enter: 40, entry: 44, table: 3, exit: 87, wrapper: COST.getppid - COST.svcAsm } as const;
const TRIVIAL = COST.svcAsm - (TRAP.enter + TRAP.entry + TRAP.table + TRAP.exit); // 1 ns: hàm xử lý gần như rỗng (getppid)

export const BATCH = [
  { mode: 'line', en: 'one write() per line', vi: 'mỗi dòng một write()', calls: 100001, sys: 'write', ms: 31.69, nsPerLine: 316.9 },
  { mode: 'writev', en: 'writev(), 64 lines per call', vi: 'writev(), 64 dòng mỗi lần', calls: 1564, sys: 'writev', ms: 1.56, nsPerLine: 15.6 },
  { mode: 'stdio', en: 'stdio buffer (fwrite)', vi: 'bộ đệm stdio (fwrite)', calls: 783, sys: 'write', ms: 1.6, nsPerLine: 16.0 },
  { mode: 'big', en: 'build one big buffer', vi: 'dựng một bộ đệm lớn', calls: 2, sys: 'write', ms: 2.16, nsPerLine: 21.6 },
] as const;

/** dd if=/dev/zero of=/dev/null bs=1 count=100000 (c113-strace): 200 000 lời gọi read+write. */
export const STRACE_DD = [
  { mode: 'plain', en: 'no strace', vi: 'không strace', s: 0.053 },
  { mode: 'ptrace', en: 'strace -c', vi: 'strace -c', s: 8.261 },
  { mode: 'filtered', en: 'strace -e trace=openat', vi: 'strace -e trace=openat', s: 8.671 },
  { mode: 'bpf', en: 'strace --seccomp-bpf -e trace=openat', vi: 'strace --seccomp-bpf -e trace=openat', s: 0.051 },
] as const;

export interface SysStep {
  layer: Layer;
  mode: 'user' | 'kernel';
  fn: string;
  en: string;
  vi: string;
  ns: number;
  est?: boolean;
  /** nằm trong con số đo của chính lời gọi (để đối chiếu c114) */
  inCall?: boolean;
  regs: Array<[string, string]>;
  /** khái niệm cho khung "Ở đâu trong máy?" */
  where: string;
  dir: 'down' | 'up' | 'side' | 'stay';
  tone?: 'ok' | 'bad' | 'warn';
  out?: string;
  sfx?: 'blip-fetch' | 'blip-decode' | 'blip-exec' | 'whoosh' | 'pop' | 'oops' | 'thud' | 'hit' | 'tick';
}

export interface SysResult {
  /** giá trị thô trong thanh ghi kết quả (x0/rax) khi về chế độ người dùng; null = bị giết, không về */
  raw: number | null;
  /** giá trị libc trả cho mã của bạn */
  ret: number | null;
  errno: number;
  errName: string;
  exit: number;
  output: string[];
  strace: string;
  calls: number;
}

export interface Journey { steps: SysStep[]; result: SysResult; totalNs: number; callNs: number; est: boolean }

const ERR: Record<number, [string, string, string]> = {
  1: ['EPERM', 'Operation not permitted', 'Không được phép'],
  2: ['ENOENT', 'No such file or directory', 'Không có tệp hoặc thư mục đó'],
  13: ['EACCES', 'Permission denied', 'Từ chối quyền'],
  38: ['ENOSYS', 'Function not implemented', 'Hàm chưa được cài'],
};
export const errName = (n: number) => ERR[n]?.[0] ?? `E${n}`;
export const errText = (n: number) => ERR[n]?.[1] ?? '';

const hex = (n: number) => `0x${(n < 0 ? BigInt.asUintN(64, BigInt(n)) : BigInt(n)).toString(16)}`;

interface Call { name: string; args: Array<[string, string]>; argsStr: string }

/** Thanh ghi mang số hiệu và tham số theo kiến trúc. */
function regsFor(arch: Arch, nr: number, args: Array<[string, string]>): Array<[string, string]> {
  const names = arch === 'arm64' ? ['x0', 'x1', 'x2', 'x3'] : ['rdi', 'rsi', 'rdx', 'r10'];
  return [[arch === 'arm64' ? 'x8' : 'rax', `${nr}`], ...args.map(([, v], k) => [names[k], v] as [string, string])];
}

export function journey(cfg: SysCfg): Journey {
  const A = cfg.arch;
  const arm = A === 'arm64';
  const trapIns = arm ? 'svc #0' : 'syscall';
  const retReg = arm ? 'x0' : 'rax';
  const userMode = arm ? 'EL0' : 'ring 3';
  const kernMode = arm ? 'EL1' : 'ring 0';
  const steps: SysStep[] = [];
  const add = (s: SysStep) => steps.push(s);
  let regs: Array<[string, string]> = [];
  const res: SysResult = { raw: null, ret: null, errno: 0, errName: '', exit: 0, output: [], strace: '', calls: 1 };

  // ── 1. đoạn mã người dùng + libc ──
  let call: Call;
  let fnUser = '';
  if (cfg.kind === 'write' || cfg.kind === 'writev') {
    const v = cfg.kind === 'writev';
    fnUser = v ? 'writev(fd, iov, 64)  /* 64 dòng một lần */' : 'printf("hi from C\\n");';
    add({
      layer: 'app', mode: 'user', fn: fnUser, ns: COST.fn, regs: [], where: 'process', dir: 'stay', sfx: 'blip-fetch',
      en: v ? 'Your program has 64 log lines ready and hands all of them to the kernel in ONE call: writev() takes an array of (pointer, length) pairs — an iovec.'
        : `printf() is NOT a system call. It formats the text and copies 10 bytes into the stdio buffer in your own memory (4 096 bytes). Nothing has left the process yet. ${cfg.tty ? 'stdout is a terminal ⇒ line-buffered: the "\\n" makes stdio flush right now.' : 'stdout is a pipe ⇒ fully buffered: stdio keeps the bytes until the buffer is full or the program exits.'}`,
      vi: v ? 'Chương trình có sẵn 64 dòng log và trao hết cho nhân trong MỘT lời gọi: writev() nhận một mảng cặp (con trỏ, độ dài) — iovec.'
        : `printf() KHÔNG phải lời gọi hệ thống. Nó định dạng chữ rồi chép 10 byte vào bộ đệm stdio ngay trong bộ nhớ của bạn (4 096 byte). Chưa có gì rời khỏi tiến trình. ${cfg.tty ? 'stdout là terminal ⇒ đệm theo dòng: ký tự "\\n" khiến stdio xả ngay.' : 'stdout là một ống (pipe) ⇒ đệm đầy: stdio giữ byte tới khi đầy bộ đệm hoặc chương trình thoát.'}`,
    });
    if (!v && !cfg.tty) {
      add({
        layer: 'app', mode: 'user', fn: 'return 0;  →  exit(0)', ns: COST.fn, regs: [], where: 'process', dir: 'stay', sfx: 'blip-fetch',
        en: 'main() returns. Only now, inside exit(), does libc flush the buffer — gdb shows the call chain write ← _IO_new_file_write ← _IO_flush_all ← exit ← __libc_start_call_main.',
        vi: 'main() trả về. Tới lúc này, bên trong exit(), libc mới xả bộ đệm — gdb cho thấy chuỗi gọi write ← _IO_new_file_write ← _IO_flush_all ← exit ← __libc_start_call_main.',
      });
    }
    const fd = '1';
    const target = cfg.target === 'null' ? '/dev/null' : cfg.target === 'file' ? (v ? '/dev/shm/out.txt' : 'out.txt (ext4)') : 'socket:[1047582] (TCP)';
    call = v
      ? { name: 'writev', args: [['fd', fd], ['iov', '0xffffd2a0'], ['iovcnt', '64']], argsStr: '1, [{iov_base="line 0\\n", iov_len=7}, …], 64' }
      : { name: 'write', args: [['fd', fd], ['buf', '0x11c4a420'], ['count', '10']], argsStr: '1, "hi from C\\n", 10' };
    regs = regsFor(A, NR[A][call.name], call.args);
    add({
      layer: 'libc', mode: 'user', fn: v ? '__writev(1, iov, 64)' : '_IO_new_file_write → __libc_write(1, buf, 10)', ns: TRAP.wrapper, inCall: true, regs, where: 'process', dir: 'down', sfx: 'blip-fetch',
      en: `libc's thin wrapper loads the registers the kernel expects: the call NUMBER ${NR[A][call.name]} (${call.name}) into ${arm ? 'x8' : 'rax'}, then the arguments — fd = 1 (stdout → ${target}), the buffer address, the length. That is the whole "API": numbers in registers.`,
      vi: `Lớp vỏ mỏng của libc nạp các thanh ghi mà nhân chờ: SỐ HIỆU lời gọi ${NR[A][call.name]} (${call.name}) vào ${arm ? 'x8' : 'rax'}, rồi các tham số — fd = 1 (stdout → ${target}), địa chỉ bộ đệm, độ dài. Toàn bộ "API" chỉ có vậy: các con số trong thanh ghi.`,
    });
  } else if (cfg.kind === 'open') {
    const path = cfg.exists ? '/etc/hostname' : '/nope/config.json';
    fnUser = `int fd = open("${path}", O_RDONLY);`;
    add({ layer: 'app', mode: 'user', fn: fnUser, ns: COST.fn, regs: [], where: 'process', dir: 'stay', sfx: 'blip-fetch',
      en: `The program wants to read a config file at ${path}. open() looks like a normal C function…`, vi: `Chương trình muốn đọc tệp cấu hình ${path}. open() trông như một hàm C bình thường…` });
    call = { name: 'openat', args: [['dirfd', 'AT_FDCWD (-100)'], ['path', cfg.exists ? '0x45b7f0' : '0x45b808'], ['flags', 'O_RDONLY (0)']], argsStr: `AT_FDCWD, "${path}", O_RDONLY` };
    regs = regsFor(A, NR[A].openat, call.args);
    add({ layer: 'libc', mode: 'user', fn: '__libc_open64 → openat', ns: TRAP.wrapper, inCall: true, regs, where: 'process', dir: 'down', sfx: 'blip-fetch',
      en: `…but libc turns it into openat (number ${NR[A].openat}): x8/rax = ${NR[A].openat}, first argument AT_FDCWD = "relative to the current directory", second the ADDRESS of the path string in your memory.`,
      vi: `…nhưng libc đổi nó thành openat (số ${NR[A].openat}): x8/rax = ${NR[A].openat}, tham số đầu AT_FDCWD = "tính từ thư mục hiện tại", tham số hai là ĐỊA CHỈ của chuỗi đường dẫn trong bộ nhớ của bạn.` });
  } else if (cfg.kind === 'clock') {
    fnUser = 'clock_gettime(CLOCK_MONOTONIC, &ts);   /* Date.now(), time.time(), System.nanoTime() */';
    add({ layer: 'app', mode: 'user', fn: fnUser, ns: 0, regs: [], where: 'process', dir: 'stay', sfx: 'blip-fetch',
      en: 'Reading the clock is something every runtime does millions of times (Date.now(), performance.now(), time.time(), System.nanoTime()). If each one were a real system call, that would be ~200 ns each.',
      vi: 'Đọc đồng hồ là việc mọi runtime làm hàng triệu lần (Date.now(), performance.now(), time.time(), System.nanoTime()). Nếu mỗi lần là một lời gọi hệ thống thật thì tốn ~200 ns mỗi lần.' });
    call = { name: 'clock_gettime', args: [['clk', 'CLOCK_MONOTONIC (1)'], ['tp', '0xffffd2b8']], argsStr: 'CLOCK_MONOTONIC, {tv_sec=…, tv_nsec=…}' };
    if (!cfg.force) {
      add({ layer: 'libc', mode: 'user', fn: 'clock_gettime → vDSO', ns: TRAP.wrapper, inCall: true, regs: [], where: 'vdso', dir: 'down', sfx: 'blip-fetch',
        en: 'libc checks: the kernel mapped a tiny code page called the vDSO into this process at start-up ([vdso] 8 192 bytes in /proc/self/maps). It calls __kernel_clock_gettime THERE — a normal function call, still in user mode.',
        vi: 'libc kiểm: lúc khởi động, nhân đã ánh xạ một trang mã tí hon tên vDSO vào tiến trình này ([vdso] 8 192 byte trong /proc/self/maps). Nó gọi __kernel_clock_gettime Ở ĐÓ — một lời gọi hàm thường, vẫn ở chế độ người dùng.' });
      add({ layer: 'vdso', mode: 'user', fn: '__kernel_clock_gettime: đọc cntvct_el0 + trang vvar', ns: COST.vdsoClock - TRAP.wrapper, inCall: true, regs: [], where: 'vdso', dir: 'stay', sfx: 'blip-decode',
        en: `The vDSO code reads the CPU's counter register directly (clocksource arch_sys_counter) and a data page the kernel keeps updated, and computes the time. No ${trapIns}, no mode switch: ${COST.vdsoClock} ns instead of ${COST.forcedClock} ns. strace sees NOTHING — Node, Python and Java made 0 clock syscalls for a million reads.`,
        vi: `Mã vDSO đọc thẳng thanh ghi bộ đếm của CPU (clocksource arch_sys_counter) và một trang dữ liệu mà nhân luôn cập nhật, rồi tính ra giờ. Không có ${trapIns}, không đổi chế độ: ${COST.vdsoClock} ns thay vì ${COST.forcedClock} ns. strace KHÔNG thấy gì — Node, Python và Java đọc đồng hồ một triệu lần mà 0 lời gọi hệ thống.` });
      add({ layer: 'app', mode: 'user', fn: 'ts = {tv_sec, tv_nsec}', ns: 0, regs: [], where: 'process', dir: 'up', tone: 'ok', sfx: 'hit', out: 'clock_gettime() via vDSO: 18.5 ns',
        en: `Done, and we never left user mode (${userMode} the whole time). This trick only works for calls that just READ something the kernel can publish safely: the time, getcpu.`,
        vi: `Xong, và ta chưa hề rời chế độ người dùng (${userMode} suốt). Mẹo này chỉ dùng được cho lời gọi chỉ ĐỌC thứ nhân công bố an toàn được: giờ, getcpu.` });
      res.raw = 0; res.ret = 0; res.output = ['clock_gettime() via vDSO: 18.5 ns']; res.strace = '(nothing — vDSO calls never enter the kernel)'; res.calls = 0;
      return finish(steps, res);
    }
    regs = regsFor(A, NR[A].clock_gettime, call.args);
    add({ layer: 'libc', mode: 'user', fn: 'syscall(SYS_clock_gettime, …)', ns: TRAP.wrapper, inCall: true, regs, where: 'process', dir: 'down', sfx: 'blip-fetch',
      en: `Forced the slow way: syscall(SYS_clock_gettime) skips the vDSO and loads number ${NR[A].clock_gettime} into ${arm ? 'x8' : 'rax'}.`, vi: `Ép đi đường chậm: syscall(SYS_clock_gettime) bỏ qua vDSO và nạp số ${NR[A].clock_gettime} vào ${arm ? 'x8' : 'rax'}.` });
  } else {
    // seccomp: ba chương trình thật của c117
    const prog = cfg.kind === 'mkdir' ? { u: 'mkdir /tmp/uploads', name: 'mkdirat', args: [['dirfd', 'AT_FDCWD (-100)'], ['path', '0xffffe7a2'], ['mode', '0777']] as Array<[string, string]>, argsStr: 'AT_FDCWD, "/tmp/uploads", 0777' }
      : cfg.kind === 'socket' ? { u: 'curl http://example.com/', name: 'socket', args: [['domain', 'AF_INET (2)'], ['type', 'SOCK_DGRAM (2)'], ['proto', '0']] as Array<[string, string]>, argsStr: 'AF_INET, SOCK_DGRAM|SOCK_CLOEXEC, IPPROTO_IP' }
        : { u: 'python3 -c "threading.Thread(…).start()"', name: 'clone3', args: [['args', '0xffffc120'], ['size', '88']] as Array<[string, string]>, argsStr: '{flags=CLONE_VM|CLONE_FS|…, …}, 88' };
    fnUser = prog.u;
    add({ layer: 'app', mode: 'user', fn: prog.u, ns: COST.fn, regs: [], where: 'process', dir: 'stay', sfx: 'blip-fetch',
      en: cfg.kind === 'mkdir' ? 'mkdir wants to create a directory.' : cfg.kind === 'socket' ? 'curl first resolves example.com — DNS needs a UDP socket.' : 'Python starts a thread — glibc creates it with clone3().',
      vi: cfg.kind === 'mkdir' ? 'mkdir muốn tạo một thư mục.' : cfg.kind === 'socket' ? 'curl phải phân giải example.com trước — DNS cần một socket UDP.' : 'Python tạo một luồng — glibc tạo nó bằng clone3().' });
    call = { name: prog.name, args: prog.args, argsStr: prog.argsStr };
    regs = regsFor(A, NR[A][prog.name], prog.args);
    add({ layer: 'libc', mode: 'user', fn: `${prog.name}()`, ns: TRAP.wrapper, inCall: true, regs, where: 'process', dir: 'down', sfx: 'blip-fetch',
      en: `libc loads number ${NR[A][prog.name]} (${prog.name}) and the arguments.`, vi: `libc nạp số ${NR[A][prog.name]} (${prog.name}) và các tham số.` });
  }

  const nr = NR[A][call.name];

  // ── 2. bẫy: đổi chế độ ──
  add({ layer: 'cpu', mode: 'kernel', fn: `${trapIns}   (${userMode} → ${kernMode})`, ns: TRAP.enter, inCall: true, regs, where: 'syscall', dir: 'down', sfx: 'whoosh',
    en: `The ONE instruction that crosses the line: ${trapIns}. The CPU core itself switches from ${userMode} (user) to ${kernMode} (kernel), saves where you were${arm ? ' (ELR_EL1)' : ' — and overwrites rcx (return address) and r11 (flags), which is why the syscall ABI says they are clobbered'}, and jumps to the address the kernel registered at boot. From here on, the code running is the kernel's.`,
    vi: `MỘT lệnh duy nhất vượt qua lằn ranh: ${trapIns}. Chính lõi CPU đổi từ ${userMode} (người dùng) sang ${kernMode} (nhân), lưu lại chỗ bạn đang đứng${arm ? ' (ELR_EL1)' : ' — và ghi đè rcx (địa chỉ quay về) và r11 (cờ), vì thế ABI syscall nói hai thanh ghi này bị phá'}, rồi nhảy tới địa chỉ nhân đã đăng ký lúc khởi động. Từ đây, mã đang chạy là của nhân.` });
  if (!arm) regs = [...regs, ['rcx', '(return RIP)'], ['r11', '(RFLAGS)']];
  add({ layer: 'entry', mode: 'kernel', fn: arm ? 'el0_svc → do_el0_svc → invoke_syscall' : 'entry_SYSCALL_64 → do_syscall_64', ns: TRAP.entry, inCall: true, regs, where: 'kernel-code', dir: 'down', sfx: 'blip-decode',
    en: `Kernel entry code saves all your registers on the kernel stack of this thread, then reads the number: ${arm ? 'x8' : 'rax'} = ${nr}. (This is the exact chain ftrace recorded in the lab.)`,
    vi: `Mã điểm vào của nhân cất mọi thanh ghi của bạn lên stack nhân của luồng này, rồi đọc số hiệu: ${arm ? 'x8' : 'rax'} = ${nr}. (Đây đúng là chuỗi ftrace ghi được trong lab.)` });

  // strace (ptrace): dừng lúc vào
  if (cfg.trace === 'ptrace') {
    add({ layer: 'tracer', mode: 'kernel', fn: 'ptrace: syscall-enter-stop → strace chạy', ns: COST.ptraceStop, regs, where: 'scheduler', dir: 'side', tone: 'warn', sfx: 'tick',
      en: `strace is attached. The kernel STOPS your process, wakes strace (another process), and the scheduler switches to it. strace reads your registers with PTRACE_GETREGS and prints "${call.name}(${call.argsStr}". Then it resumes you. ≈ ${(COST.ptraceStop / 1000).toFixed(1)} µs — 100× the syscall itself.`,
      vi: `strace đang bám. Nhân DỪNG tiến trình của bạn, đánh thức strace (một tiến trình khác), bộ lập lịch chuyển sang nó. strace đọc thanh ghi của bạn bằng PTRACE_GETREGS và in "${call.name}(${call.argsStr}". Rồi cho bạn chạy tiếp. ≈ ${(COST.ptraceStop / 1000).toFixed(1)} µs — gấp 100 lần chính lời gọi.` });
  }

  // seccomp
  const filt: FilterAct = cfg.trace === 'bpf' ? (call.name === 'openat' ? 'log' : 'allow') : cfg.filter;
  if (filt !== 'none') {
    const act = filt === 'allow' ? 'SECCOMP_RET_ALLOW' : filt === 'eperm' ? 'SECCOMP_RET_ERRNO | EPERM' : filt === 'enosys' ? 'SECCOMP_RET_ERRNO | ENOSYS' : filt === 'kill' ? 'SECCOMP_RET_KILL_PROCESS' : cfg.trace === 'bpf' ? 'SECCOMP_RET_TRACE' : 'SECCOMP_RET_LOG';
    add({ layer: 'seccomp', mode: 'kernel', fn: `seccomp BPF: nr ${nr} → ${act}`, ns: 8, est: true, inCall: true, regs, where: 'kernel-code', dir: 'down', tone: filt === 'allow' || filt === 'log' ? 'ok' : 'bad', sfx: filt === 'allow' || filt === 'log' ? 'blip-decode' : 'oops',
      en: cfg.trace === 'bpf' ? `strace --seccomp-bpf installed a tiny filter: "stop me only for openat". For ${call.name} it says ALLOW — no ptrace stop, no context switch, full speed.`
        : `A seccomp filter runs BEFORE the syscall table — a few BPF instructions that look at the number (and architecture). Verdict for ${call.name}: ${act}.${filt === 'kill' ? ' The kernel sends SIGSYS and kills the whole process.' : filt === 'eperm' || filt === 'enosys' ? ' The real handler never runs.' : ''}`,
      vi: cfg.trace === 'bpf' ? `strace --seccomp-bpf đã cài một bộ lọc tí hon: "chỉ dừng tôi khi gặp openat". Với ${call.name} nó nói ALLOW — không dừng ptrace, không đổi ngữ cảnh, chạy hết tốc độ.`
        : `Bộ lọc seccomp chạy TRƯỚC bảng syscall — vài lệnh BPF nhìn số hiệu (và kiến trúc). Phán quyết cho ${call.name}: ${act}.${filt === 'kill' ? ' Nhân gửi SIGSYS và giết cả tiến trình.' : filt === 'eperm' || filt === 'enosys' ? ' Hàm xử lý thật không bao giờ chạy.' : ''}` });
    if (filt === 'kill') {
      res.raw = null; res.ret = null; res.exit = 159; res.errName = 'SIGSYS';
      res.output = ['Bad system call            (exit=159 = 128 + 31, SIGSYS)'];
      res.strace = `${call.name}(${call.argsStr}) = ?\n+++ killed by SIGSYS +++`;
      add({ layer: 'app', mode: 'user', fn: 'killed by SIGSYS', ns: 0, regs, where: 'process', dir: 'up', tone: 'bad', sfx: 'thud', out: res.output[0],
        en: 'The process never returns from the call: SIGSYS kills it. The shell prints "Bad system call" and the exit code is 159 (128 + 31). This is what Docker/Kubernetes users see as a mystery crash when a profile is too strict.',
        vi: 'Tiến trình không bao giờ quay về từ lời gọi: SIGSYS giết nó. Shell in "Bad system call" và mã thoát 159 (128 + 31). Đây là cái "sập bí ẩn" người dùng Docker/Kubernetes gặp khi hồ sơ quá chặt.' });
      return finish(steps, res);
    }
    if (filt === 'eperm' || filt === 'enosys') {
      const e = filt === 'eperm' ? 1 : 38;
      return back(steps, res, cfg, call, regs, -e, arm, retReg, userMode, kernMode);
    }
  }

  // ── 3. bảng + hàm xử lý ──
  const sysFn = arm ? `__arm64_sys_${call.name}` : `__x64_sys_${call.name}`;
  add({ layer: 'table', mode: 'kernel', fn: `sys_call_table[${nr}] → ${sysFn}`, ns: TRAP.table, inCall: true, regs, where: 'kernel-code', dir: 'down', sfx: 'blip-decode',
    en: `The syscall table is just an array of function pointers in kernel memory. Entry ${nr} points at ${sysFn}. (This kernel has 434 of them — grep -c ' __arm64_sys_' /proc/kallsyms.)`,
    vi: `Bảng syscall chỉ là một mảng con trỏ hàm trong bộ nhớ nhân. Ô ${nr} trỏ tới ${sysFn}. (Nhân này có 434 hàm như thế — grep -c ' __arm64_sys_' /proc/kallsyms.)` });

  if (cfg.kind === 'clock') {
    add({ layer: 'handler', mode: 'kernel', fn: 'posix_get_monotonic_timespec → ktime_get_ts64', ns: COST.forcedClock - TRAP.wrapper - TRAP.enter - TRAP.entry - TRAP.table - TRAP.exit, inCall: true, regs, where: 'kernel-code', dir: 'stay', sfx: 'blip-exec',
      en: 'The kernel reads the same counter the vDSO would have read, and copies the result to your memory (copy_to_user).', vi: 'Nhân đọc đúng bộ đếm mà vDSO lẽ ra đã đọc, rồi chép kết quả sang bộ nhớ của bạn (copy_to_user).' });
    return back(steps, res, cfg, call, regs, 0, arm, retReg, userMode, kernMode);
  }

  if (cfg.kind === 'open') {
    add({ layer: 'handler', mode: 'kernel', fn: 'do_sys_openat2 → getname → do_filp_open → path_openat', ns: 120, est: true, inCall: true, regs, where: 'kernel-code', dir: 'down', sfx: 'blip-exec',
      en: 'The kernel copies the path string from YOUR memory into its own (getname — it never trusts a user pointer), then walks it one component at a time: "/" → "nope"…', vi: 'Nhân chép chuỗi đường dẫn từ bộ nhớ CỦA BẠN sang bộ nhớ của nó (getname — nó không bao giờ tin con trỏ của người dùng), rồi đi từng thành phần: "/" → "nope"…' });
    add({ layer: 'driver', mode: 'kernel', fn: cfg.exists ? 'lookup "etc" → "hostname": dentry cache hit → alloc fd 3' : 'link_path_walk: lookup "nope" in "/" → not found', ns: 90, est: true, inCall: true, regs, where: cfg.exists ? 'fd-table' : 'inode', dir: 'stay', tone: cfg.exists ? 'ok' : 'bad', sfx: cfg.exists ? 'blip-exec' : 'oops',
      en: cfg.exists ? 'Each name is found in the dentry cache (RAM); permission is checked on the inode; a new open file description is created and the lowest free fd, 3, is filled in.' : 'The directory "/" (cached in RAM) has no entry called "nope". The handler gives up and returns −ENOENT = −2. There is no exception in the kernel: errors are just negative numbers.',
      vi: cfg.exists ? 'Mỗi tên được tìm thấy trong dentry cache (RAM); quyền được kiểm trên inode; nhân tạo một mô tả file mở và điền vào fd trống nhỏ nhất là 3.' : 'Thư mục "/" (đã nằm trong RAM) không có mục nào tên "nope". Hàm xử lý bỏ cuộc và trả về −ENOENT = −2. Trong nhân không có exception: lỗi chỉ là số âm.' });
    return back(steps, res, cfg, call, regs, cfg.exists ? 3 : -2, arm, retReg, userMode, kernMode);
  }

  if (cfg.kind === 'mkdir' || cfg.kind === 'socket' || cfg.kind === 'clone3') {
    const ok = cfg.kind === 'mkdir' ? 0 : cfg.kind === 'socket' ? 5 : 54;
    add({ layer: 'handler', mode: 'kernel', fn: cfg.kind === 'mkdir' ? 'do_mkdirat → vfs_mkdir' : cfg.kind === 'socket' ? '__sys_socket → sock_create' : 'kernel_clone → copy_process', ns: 300, est: true, inCall: true, regs, where: 'kernel-code', dir: 'stay', tone: 'ok', sfx: 'blip-exec',
      en: 'Allowed: the real handler runs as usual.', vi: 'Được phép: hàm xử lý thật chạy như thường.' });
    return back(steps, res, cfg, call, regs, ok, arm, retReg, userMode, kernMode);
  }

  // write / writev
  const v = cfg.kind === 'writev';
  const ROUND = TRAP.enter + TRAP.entry + TRAP.table + TRAP.exit + TRAP.wrapper + 16; // vòng bẫy + fdget/vfs_write + LSM
  // write: /dev/null khớp 195,7 ns; tệp ext4 khớp 1,8 µs (c93); writev 64 dòng khớp 1,56 ms ÷ 1 564 lần ≈ 997 ns; TCP là ước lượng
  const driverNs = v ? (BATCH[1].ms * 1e6) / BATCH[1].calls - ROUND : cfg.target === 'null' ? COST.writeNull - ROUND : cfg.target === 'file' ? COST.fileWrite - ROUND : 1900;
  const vNs = 0;
  add({ layer: 'handler', mode: 'kernel', fn: v ? 'do_writev → import_iovec → vfs_writev' : 'ksys_write → fdget_pos(1) → vfs_write', ns: 11, inCall: true, regs, where: 'fd-table', dir: 'down', sfx: 'blip-exec',
    en: 'fd 1 is just an index into this process\'s fd table (Chapter 9): fdget_pos looks it up and finds the open file description — with the offset and flags — and through it the file itself.',
    vi: 'fd 1 chỉ là chỉ số trong bảng fd của tiến trình này (Chương 9): fdget_pos tra nó và tìm ra mô tả file mở — có offset và cờ — rồi qua đó tới chính tệp.' });
  add({ layer: 'lsm', mode: 'kernel', fn: 'rw_verify_area → security_file_permission → bpf_lsm_file_permission', ns: 5, inCall: true, regs, where: 'permission', dir: 'down', tone: cfg.lsmDeny ? 'bad' : undefined, sfx: cfg.lsmDeny ? 'oops' : 'blip-exec',
    en: cfg.lsmDeny ? 'The Linux Security Module hook says NO (an AppArmor/SELinux profile forbids this file for this program). The write is refused with −EACCES = −13 — even for root, even though the file mode allows it.'
      : 'A security hook: every Linux Security Module (AppArmor, SELinux, BPF-LSM) gets a chance to say no here. Nobody objects.',
    vi: cfg.lsmDeny ? 'Móc Linux Security Module nói KHÔNG (hồ sơ AppArmor/SELinux cấm chương trình này đụng tệp này). Lần ghi bị từ chối với −EACCES = −13 — kể cả với root, kể cả khi bit quyền của tệp cho phép.'
      : 'Một móc bảo mật: mọi Linux Security Module (AppArmor, SELinux, BPF-LSM) đều có cơ hội nói không ở đây. Không ai phản đối.' });
  if (cfg.lsmDeny) return back(steps, res, cfg, call, regs, -13, arm, retReg, userMode, kernMode);
  const n = v ? 448 : 10;
  if (cfg.target === 'null') {
    add({ layer: 'driver', mode: 'kernel', fn: 'write_null', ns: driverNs + vNs, inCall: true, regs, where: 'kernel-code', dir: 'stay', tone: 'ok', sfx: 'blip-exec',
      en: `/dev/null's driver is one line of C: return count. It "writes" ${n} bytes by doing nothing. No device is involved at all — the whole trip stayed inside the CPU and RAM.`,
      vi: `Driver của /dev/null chỉ có một dòng C: return count. Nó "ghi" ${n} byte bằng cách không làm gì. Không có thiết bị nào dính vào — cả chuyến đi chỉ ở trong CPU và RAM.` });
  } else if (cfg.target === 'file') {
    add({ layer: 'driver', mode: 'kernel', fn: v ? 'shmem_file_write_iter (tmpfs)' : 'ext4_file_write_iter → generic_perform_write', ns: driverNs + vNs, est: v, inCall: true, regs, where: 'page-cache', dir: 'stay', tone: 'ok', sfx: 'blip-exec',
      en: v ? 'tmpfs (/dev/shm) copies the 64 lines (448 bytes) into page-cache pages in RAM. Average for the whole writev: ~1 µs (1.56 ms ÷ 1 563 calls).'
        : 'ext4 copies the 10 bytes into a page-cache page in RAM and marks it DIRTY. The SSD is not touched now — that is why a buffered write costs ~1.8 µs while fsync costs ~1 ms (Chapter 9).',
      vi: v ? 'tmpfs (/dev/shm) chép 64 dòng (448 byte) vào các trang page cache trong RAM. Trung bình cả lần writev: ~1 µs (1,56 ms ÷ 1 563 lần).'
        : 'ext4 chép 10 byte vào một trang page cache trong RAM và đánh dấu nó BẨN (dirty). SSD chưa bị đụng tới lúc này — vì thế một lần ghi có đệm chỉ ~1,8 µs còn fsync ~1 ms (Chương 9).' });
    if (!v) add({ layer: 'device', mode: 'kernel', fn: '(later) flusher → SSD', ns: 0, regs, where: 'ssd', dir: 'side', sfx: 'tick',
      en: 'Later, NOT during this call: a kernel flusher thread writes the dirty page to the SSD (after ~30 s, or on fsync). If the power fails before that, the data is gone.',
      vi: 'Về sau, KHÔNG trong lời gọi này: một luồng flusher của nhân ghi trang bẩn xuống SSD (sau ~30 s, hoặc khi fsync). Mất điện trước lúc đó thì dữ liệu mất.' });
  } else {
    add({ layer: 'driver', mode: 'kernel', fn: 'sock_write_iter → tcp_sendmsg', ns: driverNs + vNs, est: true, inCall: true, regs, where: 'packet', dir: 'stay', tone: 'ok', sfx: 'blip-exec',
      en: `TCP copies the ${n} bytes into the socket's send buffer (kernel RAM) and returns. Nagle, ACKs and retransmission happen later, asynchronously.`,
      vi: `TCP chép ${n} byte vào bộ đệm gửi của socket (RAM của nhân) rồi trả về. Nagle, ACK và gửi lại xảy ra sau, bất đồng bộ.` });
    add({ layer: 'device', mode: 'kernel', fn: '(later) NIC DMA → wire', ns: 0, regs, where: 'packet', dir: 'side', sfx: 'tick',
      en: 'The network chip later pulls the packet out of RAM by DMA and puts it on the wire — no CPU copy.', vi: 'Về sau chip mạng tự kéo gói tin khỏi RAM bằng DMA rồi đẩy ra dây — CPU không phải chép.' });
  }
  return back(steps, res, cfg, call, regs, n, arm, retReg, userMode, kernMode);
}

/** Chặng quay về: thanh ghi kết quả → (strace dừng lúc ra) → eret/sysret → libc đổi −errno → mã của bạn. */
function back(steps: SysStep[], res: SysResult, cfg: SysCfg, call: Call, regs0: Array<[string, string]>, raw: number, arm: boolean, retReg: string, userMode: string, kernMode: string): Journey {
  const add = (s: SysStep) => steps.push(s);
  const regs = regs0.map(([k, v]) => [k, k === retReg ? `${raw} (${hex(raw)})` : v] as [string, string]);
  if (!regs.some(([k]) => k === retReg)) regs.unshift([retReg, `${raw} (${hex(raw)})`]);
  const neg = raw < 0;
  const e = neg ? -raw : 0;
  const strRet = neg ? `-1 ${errName(e)} (${errText(e)})` : call.name === 'clock_gettime' ? '0' : `${raw}`;
  res.strace = `${call.name}(${call.argsStr}) = ${strRet}`;
  if (cfg.trace === 'ptrace') {
    add({ layer: 'tracer', mode: 'kernel', fn: 'ptrace: syscall-exit-stop → strace chạy', ns: COST.ptraceStop, regs, where: 'scheduler', dir: 'side', tone: 'warn', sfx: 'tick',
      en: `Second stop, on the way out: strace wakes again and prints " = ${strRet}". Two stops and two context switches for EVERY call — dd bs=1 (200 000 calls) goes from 0.053 s to 8.261 s.`,
      vi: `Lần dừng thứ hai, trên đường ra: strace lại thức dậy và in " = ${strRet}". Hai lần dừng, hai lần đổi ngữ cảnh cho MỌI lời gọi — dd bs=1 (200 000 lời gọi) từ 0,053 s thành 8,261 s.` });
  }
  add({ layer: 'cpu', mode: 'user', fn: `${arm ? 'eret' : 'sysretq'}   (${kernMode} → ${userMode}),  ${retReg} = ${raw}`, ns: TRAP.exit, inCall: true, regs, where: 'syscall', dir: 'up', sfx: 'whoosh',
    en: `The handler's return value goes into ${retReg}: ${raw}${neg ? ` — that is −${errName(e)}; in 64-bit hex ${hex(raw)}, exactly what gdb printed` : ''}. The kernel restores your registers and ${arm ? 'eret' : 'sysretq'} drops the core back to ${userMode}, right after the ${arm ? 'svc' : 'syscall'} instruction.`,
    vi: `Giá trị trả về của hàm xử lý được đặt vào ${retReg}: ${raw}${neg ? ` — tức −${errName(e)}; viết hex 64 bit là ${hex(raw)}, đúng như gdb in ra` : ''}. Nhân khôi phục thanh ghi của bạn và ${arm ? 'eret' : 'sysretq'} đưa lõi về ${userMode}, ngay sau lệnh ${arm ? 'svc' : 'syscall'}.` });
  res.raw = raw;
  if (neg) {
    res.ret = -1; res.errno = e; res.errName = errName(e);
    add({ layer: 'libc', mode: 'user', fn: `if (${retReg} > -4096) { errno = ${e}; return -1; }`, ns: 0, regs, where: 'process', dir: 'up', tone: 'bad', sfx: 'oops',
      en: `libc sees a value between −4095 and −1, so it is an error: it stores ${e} in the thread-local variable errno and returns −1. That is the C convention — Node turns it into Error: ${errName(e)}, Python into an OSError, Java into an IOException.`,
      vi: `libc thấy một giá trị trong khoảng −4095 tới −1 nên đó là lỗi: nó cất ${e} vào biến errno (riêng từng luồng) và trả −1. Đó là quy ước của C — Node biến nó thành Error: ${errName(e)}, Python thành OSError, Java thành IOException.` });
  } else {
    res.ret = raw;
    add({ layer: 'libc', mode: 'user', fn: `return ${raw};`, ns: 0, regs, where: 'process', dir: 'up', sfx: 'pop',
      en: `${raw} is not negative, so libc returns it unchanged${call.name === 'write' ? ' — 10 bytes written' : ''}.`, vi: `${raw} không âm nên libc trả nguyên${call.name === 'write' ? ' — đã ghi 10 byte' : ''}.` });
  }
  // kết cục nhìn thấy được
  const out = outcome(cfg, e);
  res.output = out.lines; res.exit = out.exit;
  add({ layer: 'app', mode: 'user', fn: out.fn, ns: 0, regs, where: 'process', dir: 'up', tone: out.tone, sfx: out.tone === 'bad' ? 'oops' : 'hit', out: out.lines.join('\n'),
    en: out.en, vi: out.vi });
  return finish(steps, res);
}

function outcome(cfg: SysCfg, e: number): { lines: string[]; exit: number; fn: string; tone: 'ok' | 'bad' | 'warn'; en: string; vi: string } {
  if (cfg.kind === 'write' || cfg.kind === 'writev') {
    if (e) return { lines: ['write error: Permission denied'], exit: 1, fn: 'perror(...)', tone: 'bad', en: 'The program gets EACCES — and the file mode never had a say: the LSM decided.', vi: 'Chương trình nhận EACCES — và bit quyền của tệp chẳng có tiếng nói nào: LSM đã quyết.' };
    return { lines: cfg.kind === 'writev' ? ['(64 lines written in one call)'] : ['hi from C'], exit: 0, fn: cfg.kind === 'writev' ? 'next batch…' : 'exit_group(0)', tone: 'ok',
      en: cfg.kind === 'writev' ? 'One trip for 64 lines. Batching is THE trick: 100 000 lines cost 31.7 ms with one write() each and 1.6 ms with writev().' : 'The text appears and the program ends with exit_group(0) — one more system call. Every program you have ever run spoke to the kernel exactly like this.',
      vi: cfg.kind === 'writev' ? 'Một chuyến cho 64 dòng. Gom lại là mẹo QUAN TRỌNG NHẤT: 100 000 dòng tốn 31,7 ms nếu mỗi dòng một write(), 1,6 ms với writev().' : 'Chữ hiện ra và chương trình kết thúc bằng exit_group(0) — thêm một lời gọi hệ thống nữa. Mọi chương trình bạn từng chạy đều nói chuyện với nhân y như vậy.' };
  }
  if (cfg.kind === 'open') {
    if (!e) return { lines: ['opened, fd = 3'], exit: 0, fn: 'fd = 3', tone: 'ok', en: 'The program gets fd 3 (0, 1, 2 are stdin, stdout, stderr).', vi: 'Chương trình nhận fd 3 (0, 1, 2 là stdin, stdout, stderr).' };
    return { lines: ['open returned -1, errno = 2 (No such file or directory)'], exit: 0, fn: 'printf("open returned %d, errno = %d (%s)", …)', tone: 'bad',
      en: 'Exactly the line the lab printed. When an app says "could not load configuration", strace -e trace=%file shows you which path it really tried.', vi: 'Đúng dòng lab đã in. Khi app báo "could not load configuration", strace -e trace=%file cho bạn thấy nó thật sự đã thử đường dẫn nào.' };
  }
  if (cfg.kind === 'clock') return { lines: ['syscall(SYS_clock_gettime): 202.1 ns'], exit: 0, fn: 'ts = {…}', tone: 'warn', en: '202 ns instead of 18.5 ns — 11× slower for the same answer. That is the price of crossing into the kernel.', vi: '202 ns thay vì 18,5 ns — chậm gấp 11 lần cho cùng một câu trả lời. Đó là giá của việc vượt vào nhân.' };
  if (cfg.kind === 'mkdir') {
    if (e === 1) return { lines: ['gnumkdir: cannot create directory ‘/tmp/uploads’: Operation not permitted', 'exit=1'], exit: 1, fn: 'perror → exit(1)', tone: 'bad', en: 'mkdir prints an ordinary "Operation not permitted" and exits 1 — it cannot tell a seccomp filter from a normal permission error.', vi: 'mkdir in một câu "Operation not permitted" bình thường rồi thoát 1 — nó không phân biệt được bộ lọc seccomp với lỗi quyền thông thường.' };
    if (e === 38) return { lines: ['gnumkdir: cannot create directory ‘/tmp/uploads’: Function not implemented', 'exit=1'], exit: 1, fn: 'perror → exit(1)', tone: 'bad', en: 'ENOSYS means "this kernel does not have that call". mkdir has no plan B, so it fails.', vi: 'ENOSYS nghĩa là "nhân này không có lời gọi đó". mkdir không có phương án B nên thất bại.' };
    return { lines: ['(directory created)', 'exit=0'], exit: 0, fn: 'exit(0)', tone: 'ok', en: cfg.filter === 'log' ? 'Allowed — and the kernel wrote an audit line (type=1326 … syscall=34) you can find in dmesg. LOG is how you test a profile before enforcing it.' : 'Allowed: the directory is created.', vi: cfg.filter === 'log' ? 'Được phép — và nhân ghi một dòng audit (type=1326 … syscall=34) xem được trong dmesg. LOG là cách thử một hồ sơ trước khi áp thật.' : 'Được phép: thư mục được tạo.' };
  }
  if (cfg.kind === 'socket') {
    if (e) return { lines: ['curl: (6) Could not resolve host: example.com', 'exit=6'], exit: 6, fn: 'exit(6)', tone: 'bad', en: 'curl blames DNS — "Could not resolve host", exit 6 — because creating the UDP socket for the DNS query failed. The error message points at the wrong layer: strace would show socket(…) = -1 EPERM.', vi: 'curl đổ lỗi cho DNS — "Could not resolve host", thoát 6 — vì không tạo được socket UDP để hỏi DNS. Thông báo lỗi chỉ sai tầng: strace sẽ cho thấy socket(…) = -1 EPERM.' };
    return { lines: ['HTTP/1.1 200 OK', 'exit=0'], exit: 0, fn: 'exit(0)', tone: 'ok', en: 'Allowed: curl resolves and fetches the page.', vi: 'Được phép: curl phân giải và tải trang.' };
  }
  // clone3
  if (e === 1) return { lines: ['RuntimeError: can\'t start new thread'], exit: 1, fn: 'raise RuntimeError', tone: 'bad', en: 'EPERM on clone3: Python cannot create a thread ("can\'t start new thread"); the JVM cannot even start its GC threads.', vi: 'EPERM với clone3: Python không tạo được luồng ("can\'t start new thread"); JVM thậm chí không khởi động nổi các luồng GC.' };
  if (e === 38) return { lines: ['clone3(…) = -1 ENOSYS (Function not implemented)', 'clone(…) = 54', 'thread ok'], exit: 0, fn: 'glibc fallback → clone()', tone: 'warn', en: 'ENOSYS is different: glibc thinks "old kernel" and falls back to the older clone() call — the thread starts ("thread ok"). This is why Docker\'s default profile answers clone3 with ENOSYS (38), not EPERM.', vi: 'ENOSYS thì khác: glibc nghĩ "nhân cũ" và lùi về lời gọi clone() đời trước — luồng vẫn chạy ("thread ok"). Vì thế hồ sơ mặc định của Docker trả lời clone3 bằng ENOSYS (38), không phải EPERM.' };
  return { lines: ['thread ok'], exit: 0, fn: 'thread.start()', tone: 'ok', en: 'Allowed: the thread starts.', vi: 'Được phép: luồng chạy.' };
}

function finish(steps: SysStep[], res: SysResult): Journey {
  const totalNs = steps.reduce((t, s) => t + s.ns, 0);
  const callNs = steps.filter((s) => s.inCall).reduce((t, s) => t + s.ns, 0);
  return { steps, result: res, totalNs, callNs, est: steps.some((s) => s.est) };
}

/** Preset ⇒ cấu hình. */
export const SYS_PRESETS: Record<string, Partial<SysCfg>> = {
  write: { kind: 'write', target: 'null' },
  fail: { kind: 'open', exists: false },
  vdso: { kind: 'clock', force: false },
  batch: { kind: 'writev', target: 'file' },
  strace: { kind: 'write', target: 'null', trace: 'ptrace' },
  seccomp: { kind: 'mkdir', filter: 'eperm' },
};
export const cfgOf = (preset: string): SysCfg => ({ ...DEFAULT_CFG, ...(SYS_PRESETS[preset] ?? SYS_PRESETS.write) });

/** Đổi ns sang chữ dễ đọc. */
export function fmtNs(ns: number): string {
  if (ns >= 1e6) return `${(ns / 1e6).toFixed(2)} ms`;
  if (ns >= 1e3) return `${(ns / 1e3).toFixed(ns >= 1e4 ? 1 : 2)} µs`;
  return `${ns.toFixed(1)} ns`;
}
