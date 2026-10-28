/**
 * Kịch bản hướng dẫn từng bước cho đợt mô phỏng #2 của phòng lab OS (28/10/2026): lời gọi hệ thống (Ch11), quyền &
 * bảng fd (Ch9), epoll (Ch10), namespace & overlay (Ch12). Viết cho người mới hoàn toàn: mỗi bước một ý, có việc tự làm,
 * số liệu trong lời thoại lấy từ engine (đã kiểm bằng engine/*.test.ts) — không bịa.
 */
import type { Tour } from './types';

const step = (n: number, delay = 650) => ({ a: 'player.step', delay, upTo: n });

export const OS2_TOURS: Tour[] = [
  // ───────────────────────── syscall ─────────────────────────
  {
    id: 'syscall-journey', ns: 'os-lab', sim: 'syscall', presets: ['write', 'strace', 'batch', 'vdso'],
    title: ['The journey of printf("hi")', 'Hành trình của printf("hi")'],
    summary: ['Follow one write() from your code, across the user/kernel line, to the driver and back — and see what each hop costs.', 'Theo một lời gọi write() từ mã của bạn, băng qua lằn ranh người dùng/nhân, tới driver rồi quay về — và xem mỗi chặng tốn bao nhiêu.'],
    steps: [
      {
        target: 'sys-path', do: [{ a: 'sys.scenario', v: 'write' }, { a: 'sys.arch', v: 'arm64' }, { a: 'player.seek', v: 0 }],
        title: ['A tower of layers', 'Một toà tháp nhiều tầng'],
        body: ['Blue rows run in USER mode — your program and the C library. Orange rows run in KERNEL mode. The dashed red line between them can be crossed by exactly one instruction.', 'Hàng viền xanh chạy ở chế độ NGƯỜI DÙNG — chương trình của bạn và thư viện C. Hàng viền cam chạy ở chế độ NHÂN. Vạch đỏ đứt nét ở giữa chỉ vượt qua được bằng đúng một lệnh.'],
      },
      {
        target: 'sys-term',
        title: ['printf is not a system call', 'printf không phải lời gọi hệ thống'],
        body: ['The program runs printf("hi from C\\n") with its output going into a pipe. printf only copies 10 bytes into a buffer in your own memory — the terminal shows nothing yet.', 'Chương trình chạy printf("hi from C\\n"), output đi vào một ống (pipe). printf chỉ chép 10 byte vào một bộ đệm trong bộ nhớ của chính bạn — terminal chưa hiện gì.'],
      },
      {
        target: 'step',
        title: ['Your turn: cross the line', 'Đến lượt bạn: vượt lằn ranh'],
        body: ['Press Step until the big badge turns orange: "EL1 · kernel mode". Listen for the whoosh.', 'Bấm Bước tới khi huy hiệu lớn chuyển màu cam: "EL1 · chế độ nhân". Nghe tiếng vút.'],
        task: { text: ['Step until the CPU is in kernel mode.', 'Bấm Bước tới khi CPU ở chế độ nhân.'], until: (s) => s.sys?.mode === 'kernel', solve: [step(4, 700)] },
      },
      {
        target: 'sys-regs',
        title: ['The whole API is numbers', 'Cả "API" chỉ là các con số'],
        body: ['Before the trap, libc put the call NUMBER into register x8: 64 means write. x0 = 1 is the fd (stdout), x1 is where the bytes are, x2 = 10 is how many. The kernel reads exactly these.', 'Trước khi bẫy, libc đặt SỐ HIỆU lời gọi vào thanh ghi x8: 64 nghĩa là write. x0 = 1 là fd (stdout), x1 là chỗ chứa byte, x2 = 10 là số byte. Nhân đọc đúng những con số này.'],
      },
      {
        target: 'where',
        title: ['Where is this happening?', 'Chuyện này xảy ra ở đâu?'],
        body: ['Inside the CPU core: the svc instruction switches the core itself from user mode (EL0) to kernel mode (EL1). The kernel code it jumps to sits in RAM like any other program.', 'Ngay trong lõi CPU: lệnh svc tự đổi chính lõi từ chế độ người dùng (EL0) sang chế độ nhân (EL1). Mã nhân mà nó nhảy tới nằm trong RAM như mọi chương trình khác.'],
      },
      {
        target: 'play',
        title: ['Your turn: finish the trip', 'Đến lượt bạn: đi hết chuyến'],
        body: ['Press Play and watch the token go down through the syscall table, the VFS and the /dev/null driver, then back up.', 'Bấm Chạy và xem hạt sáng đi xuống qua bảng syscall, VFS và driver /dev/null, rồi đi ngược lên.'],
        task: { text: ['Play until write() returns 10.', 'Chạy tới khi write() trả về 10.'], until: (s) => s.sys?.atEnd === true && s.sys?.ret === 10 && s.sys?.scenario === 'write', solve: [{ a: 'player.speed', v: 4 }, { a: 'player.play', delay: 200 }] },
      },
      {
        target: 'sys-cost',
        title: ['195.7 nanoseconds', '195,7 nano giây'],
        body: ['The call itself cost 195.7 ns — measured on the lab machine. /dev/null\'s driver does nothing at all, so almost all of it is the price of crossing into the kernel and back.', 'Riêng lời gọi tốn 195,7 ns — đo thật trên máy lab. Driver của /dev/null không làm gì cả, nên gần như toàn bộ là giá của việc vượt vào nhân rồi quay ra.'],
      },
      {
        target: 'sys-ladder',
        title: ['About 100× a function call', 'Cỡ 100 lần một lời gọi hàm'],
        body: ['A plain function call is 2.1 ns; a syscall 0.18–0.2 µs. Cheap enough to use freely, too expensive to do once per byte — that is why buffering and writev exist.', 'Gọi hàm thường tốn 2,1 ns; một syscall 0,18–0,2 µs. Đủ rẻ để dùng thoải mái, quá đắt để gọi cho từng byte — vì thế mới có bộ đệm và writev.'],
      },
      {
        target: 'sys-scenario',
        title: ['Your turn: the clock trick', 'Đến lượt bạn: mẹo đọc đồng hồ'],
        body: ['Choose "vDSO clock" and run it to the end. Date.now() and time.time() do this millions of times.', 'Chọn "Đồng hồ vDSO" và chạy tới cuối. Date.now() và time.time() làm việc này hàng triệu lần.'],
        task: { text: ['Run the vDSO clock scenario to the end.', 'Chạy kịch bản đồng hồ vDSO tới cuối.'], until: (s) => s.sys?.scenario === 'vdso' && s.sys?.atEnd === true, solve: [{ a: 'sys.scenario', v: 'vdso', delay: 300 }, { a: 'player.end', delay: 400 }] },
      },
      {
        target: 'sys-path',
        title: ['It never crossed the line', 'Nó không hề vượt lằn ranh'],
        body: ['Every orange row stayed dim: the vDSO is a page of kernel code mapped into your process, so reading the clock is a normal function call — 18.5 ns instead of 202.1 ns. strace sees nothing.', 'Mọi hàng viền cam vẫn mờ: vDSO là một trang mã nhân được ánh xạ sẵn vào tiến trình của bạn, nên đọc đồng hồ chỉ là gọi hàm thường — 18,5 ns thay vì 202,1 ns. strace không thấy gì.'],
      },
    ],
    quiz: {
      q: ['On arm64, which instruction moves the CPU from user mode into the kernel?', 'Trên arm64, lệnh nào đưa CPU từ chế độ người dùng vào nhân?'],
      options: [['svc #0', 'svc #0'], ['bl printf', 'bl printf'], ['ret', 'ret']],
      answer: 0, why: ['svc ("supervisor call") is the trap; on x86-64 the same job is done by syscall. Everything else, including printf, is an ordinary call inside your process.', 'svc ("supervisor call") là lệnh bẫy; trên x86-64 việc đó do lệnh syscall làm. Mọi thứ khác, kể cả printf, chỉ là lời gọi bình thường bên trong tiến trình của bạn.'],
    },
  },
  {
    id: 'syscall-errno', ns: 'os-lab', sim: 'syscall', presets: ['fail', 'seccomp'],
    title: ['How errors come back: −errno', 'Lỗi quay về ra sao: −errno'],
    summary: ['A missing file returns −2, libc turns it into errno 2; then a seccomp filter answers EPERM, KILL and ENOSYS before the kernel even looks.', 'Tệp không tồn tại trả về −2, libc đổi thành errno 2; rồi một bộ lọc seccomp trả lời EPERM, KILL và ENOSYS trước cả khi nhân kịp nhìn.'],
    steps: [
      {
        target: 'sys-path', do: [{ a: 'sys.scenario', v: 'fail' }, { a: 'sys.exists', v: false }, { a: 'player.seek', v: 0 }],
        title: ['A config file that is not there', 'Tệp cấu hình không tồn tại'],
        body: ['The program calls open("/nope/config.json"). libc turns it into the openat system call, number 56.', 'Chương trình gọi open("/nope/config.json"). libc đổi nó thành lời gọi hệ thống openat, số 56.'],
      },
      {
        target: 'step',
        title: ['Your turn: walk the path', 'Đến lượt bạn: đi theo đường dẫn'],
        body: ['Press Step until the kernel looks for "nope" inside "/" and finds nothing (the row turns red).', 'Bấm Bước tới khi nhân tìm "nope" trong "/" và không thấy gì (hàng chuyển đỏ).'],
        task: { text: ['Step until the lookup fails.', 'Bấm Bước tới khi phép tìm thất bại.'], until: (s) => s.sys?.layer === 'driver', solve: [step(7, 650)] },
      },
      {
        target: 'sys-regs', do: [{ a: 'player.step', delay: 300 }],
        title: ['−2 in the result register', '−2 trong thanh ghi kết quả'],
        body: ['The kernel has no exceptions. It returns a NEGATIVE number: −2 = −ENOENT. In 64-bit hex that is 0xfffffffffffffffe — exactly what gdb printed in the lab.', 'Nhân không có exception. Nó trả về một số ÂM: −2 = −ENOENT. Viết hex 64 bit là 0xfffffffffffffffe — đúng như gdb in ra trong lab.'],
      },
      {
        target: 'sys-term', do: [{ a: 'player.end', delay: 300 }],
        title: ['libc: −1 and errno = 2', 'libc: −1 và errno = 2'],
        body: ['libc sees a value between −4095 and −1, stores 2 in errno and returns −1. Node shows it as ENOENT, Python as FileNotFoundError, Java as NoSuchFileException — same number underneath.', 'libc thấy giá trị trong khoảng −4095 tới −1, cất 2 vào errno và trả −1. Node hiện thành ENOENT, Python thành FileNotFoundError, Java thành NoSuchFileException — bên dưới cùng một con số.'],
      },
      {
        target: 'sys-scenario',
        title: ['Your turn: add a seccomp filter', 'Đến lượt bạn: thêm bộ lọc seccomp'],
        body: ['Choose "seccomp" and run it to the end. A filter will answer mkdirat with EPERM.', 'Chọn "seccomp" và chạy tới cuối. Một bộ lọc sẽ trả lời mkdirat bằng EPERM.'],
        task: { text: ['Run the seccomp scenario to the end.', 'Chạy kịch bản seccomp tới cuối.'], until: (s) => s.sys?.scenario === 'seccomp' && s.sys?.filter === 'eperm' && s.sys?.atEnd === true, solve: [{ a: 'sys.scenario', v: 'seccomp', delay: 300 }, { a: 'player.end', delay: 400 }] },
      },
      {
        target: 'sys-path',
        title: ['The real handler never ran', 'Hàm xử lý thật không hề chạy'],
        body: ['The filter sits BEFORE the syscall table. mkdir gets an ordinary "Operation not permitted" and cannot tell it apart from a normal permission problem.', 'Bộ lọc nằm TRƯỚC bảng syscall. mkdir nhận một câu "Operation not permitted" bình thường và không phân biệt được với lỗi quyền thông thường.'],
      },
      {
        target: 'sys-options',
        title: ['Your turn: KILL', 'Đến lượt bạn: KILL'],
        body: ['Set the action to KILL and run it again.', 'Đặt hành động là KILL rồi chạy lại.'],
        task: { text: ['Action KILL, run to the end.', 'Hành động KILL, chạy tới cuối.'], until: (s) => s.sys?.filter === 'kill' && s.sys?.atEnd === true, solve: [{ a: 'sys.filter', v: 'kill', delay: 300 }, { a: 'player.end', delay: 400 }] },
      },
      {
        target: 'sys-term',
        title: ['"Bad system call", exit 159', '"Bad system call", thoát 159'],
        body: ['SIGSYS kills the process mid-call; it never returns. 159 = 128 + 31 (SIGSYS). If a container dies with 159, suspect a seccomp profile.', 'SIGSYS giết tiến trình ngay giữa lời gọi; nó không bao giờ quay về. 159 = 128 + 31 (SIGSYS). Container chết với mã 159 thì nghi hồ sơ seccomp.'],
      },
      {
        target: 'sys-options',
        title: ['Your turn: ENOSYS on a thread', 'Đến lượt bạn: ENOSYS với một luồng'],
        body: ['Pick "Python thread" and the action ENOSYS, then run to the end.', 'Chọn "luồng Python" và hành động ENOSYS, rồi chạy tới cuối.'],
        task: { text: ['Python thread + ENOSYS, run to the end.', 'Luồng Python + ENOSYS, chạy tới cuối.'], until: (s) => s.sys?.kind === 'clone3' && s.sys?.filter === 'enosys' && s.sys?.atEnd === true, solve: [{ a: 'sys.call', v: 'clone3', delay: 300 }, { a: 'sys.filter', v: 'enosys', delay: 300 }, { a: 'player.end', delay: 400 }] },
      },
      {
        target: 'sys-term',
        title: ['"thread ok" — the fallback', '"thread ok" — đường lùi'],
        body: ['ENOSYS means "this kernel does not have clone3", so glibc quietly falls back to the older clone() and the thread starts. That is why Docker\'s default profile answers clone3 with ENOSYS (38), not EPERM.', 'ENOSYS nghĩa là "nhân này không có clone3", nên glibc lặng lẽ lùi về clone() đời cũ và luồng vẫn chạy. Vì thế hồ sơ mặc định của Docker trả lời clone3 bằng ENOSYS (38), không phải EPERM.'],
      },
    ],
    quiz: {
      q: ['The kernel\'s openat returns −2. What does your C program see?', 'openat của nhân trả về −2. Chương trình C của bạn thấy gì?'],
      options: [['open() returns −1 and errno is 2', 'open() trả −1 và errno là 2'], ['open() returns −2', 'open() trả −2'], ['an exception is thrown by the kernel', 'nhân ném ra một exception']],
      answer: 0, why: ['libc converts any result between −4095 and −1 into −1 plus errno = the positive error number.', 'libc đổi mọi kết quả trong khoảng −4095 tới −1 thành −1 kèm errno = số lỗi dương.'],
    },
  },
];
