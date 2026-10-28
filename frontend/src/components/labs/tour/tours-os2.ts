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
  // ───────────────────────── perm ─────────────────────────
  {
    id: 'perm-check', ns: 'os-lab', sim: 'perm', presets: ['owner', 'dirx', 'sticky'],
    title: ['How Linux decides "Permission denied"', 'Linux quyết định "Permission denied" ra sao'],
    summary: ['Owner first and ONLY the owner bits; then group, then other — and why deleting is about the directory, not the file.', 'Xét chủ trước và CHỈ bit của chủ; rồi nhóm, rồi other — và vì sao xoá là chuyện của thư mục, không phải của tệp.'],
    steps: [
      {
        target: 'perm-ask', do: [{ a: 'perm.preset', v: 'owner' }, { a: 'player.seek', v: 0 }],
        title: ['A question for the kernel', 'Một câu hỏi cho nhân'],
        body: ['Every permission check is the same question: WHO (uid and groups), does WHAT (read, write, run, delete…), to WHICH file. Here: can dev read /tmp/own.txt?', 'Mọi phép kiểm quyền đều là cùng một câu hỏi: AI (uid và các nhóm), làm GÌ (đọc, ghi, chạy, xoá…), với TỆP NÀO. Ở đây: dev có đọc được /tmp/own.txt không?'],
      },
      {
        target: 'perm-tree',
        title: ['Read the mode string', 'Đọc chuỗi quyền'],
        body: ['own.txt shows ----rwxrwx dev:dev. Split it in three: owner ---, group rwx, other rwx. Most people guess "dev is in the group, so yes".', 'own.txt hiện ----rwxrwx dev:dev. Tách làm ba: chủ ---, nhóm rwx, other rwx. Đa số sẽ đoán "dev thuộc nhóm, vậy là được".'],
      },
      {
        target: 'step',
        title: ['Your turn: run the check', 'Đến lượt bạn: chạy phép kiểm'],
        body: ['Press Step until the verdict. Each line is one rule the kernel applies, in order.', 'Bấm Bước tới khi có phán quyết. Mỗi dòng là một luật nhân áp dụng, theo đúng thứ tự.'],
        task: { text: ['Step until the verdict appears.', 'Bấm Bước tới khi hiện phán quyết.'], until: (s) => s.perm?.atEnd === true && s.perm?.who === 'dev', solve: [step(9, 600)] },
      },
      {
        target: 'perm-checks',
        title: ['Only the owner bits count', 'Chỉ bit của chủ được tính'],
        body: ['dev IS the owner, so the kernel looks at the owner bits — and STOPS. The wide group and other bits are never consulted. The owner of a file can lock themselves out.', 'dev LÀ chủ, nên nhân nhìn bit của chủ — rồi DỪNG. Bit nhóm và other rộng rãi kia không hề được hỏi tới. Chủ tệp có thể tự khoá mình ở ngoài.'],
      },
      {
        target: 'perm-ask',
        title: ['Your turn: ask as bob', 'Đến lượt bạn: hỏi với tư cách bob'],
        body: ['Change Who to bob and run the check to the end.', 'Đổi Ai thành bob và chạy phép kiểm tới cuối.'],
        task: { text: ['Ask as bob and reach the verdict.', 'Hỏi với tư cách bob và chạy tới phán quyết.'], until: (s) => s.perm?.who === 'bob' && s.perm?.atEnd === true, solve: [{ a: 'perm.who', v: 'bob', delay: 300 }, { a: 'player.end', delay: 400 }] },
      },
      {
        target: 'perm-shell',
        title: ['bob reads it: "hello"', 'bob đọc được: "hello"'],
        body: ['bob is not the owner and not in group dev, so he falls through to "other": rwx. The exact output of the lab: dev → Permission denied, bob → hello.', 'bob không phải chủ, không thuộc nhóm dev, nên rơi xuống "other": rwx. Đúng output của lab: dev → Permission denied, bob → hello.'],
      },
      {
        target: 'perm-shell', do: [{ a: 'perm.preset', v: 'sticky' }, { a: 'player.end', delay: 300 }],
        title: ['Deleting in /tmp', 'Xoá trong /tmp'],
        body: ['dev tries rm /tmp/bob-session. /tmp is drwxrwxrwt — everyone may write it — yet the answer is "Operation not permitted" (EPERM), not "Permission denied".', 'dev thử rm /tmp/bob-session. /tmp là drwxrwxrwt — ai cũng ghi được — vậy mà câu trả lời là "Operation not permitted" (EPERM), không phải "Permission denied".'],
      },
      {
        target: 'perm-checks',
        title: ['The sticky bit', 'Bit sticky'],
        body: ['The "t" at the end is the sticky bit: in a shared directory you may delete only your OWN files. Without it, anyone could delete anyone\'s files in /tmp.', 'Chữ "t" ở cuối là bit sticky: trong thư mục dùng chung bạn chỉ được xoá tệp CỦA MÌNH. Không có nó, ai cũng xoá được tệp của người khác trong /tmp.'],
      },
      {
        target: 'perm-ask',
        title: ['Your turn: a directory without "t"', 'Đến lượt bạn: thư mục không có "t"'],
        body: ['Pick the file /srv/drop/bob-session (the directory is 777, no sticky bit) and run the check.', 'Chọn tệp /srv/drop/bob-session (thư mục 777, không có sticky) rồi chạy phép kiểm.'],
        task: { text: ['Delete /srv/drop/bob-session as dev.', 'Xoá /srv/drop/bob-session với tư cách dev.'], until: (s) => s.perm?.path === '/srv/drop/bob-session' && s.perm?.atEnd === true, solve: [{ a: 'perm.path', v: '/srv/drop/bob-session', delay: 300 }, { a: 'player.end', delay: 400 }] },
      },
      {
        target: 'perm-checks',
        title: ['Deleting = writing the directory', 'Xoá = ghi vào thư mục'],
        body: ['Allowed — and notice the file\'s own mode never mattered. A directory is a table of names; deleting removes a row, so only w+x on the DIRECTORY count.', 'Được phép — và để ý: mode của chính tệp không hề quan trọng. Thư mục là một bảng tên; xoá là gỡ một dòng, nên chỉ w+x của THƯ MỤC mới tính.'],
      },
    ],
    quiz: {
      q: ['A file is ----rwxrwx and you are its owner (and in its group). Can you read it?', 'Một tệp ----rwxrwx và bạn là chủ (cũng thuộc nhóm của nó). Bạn đọc được không?'],
      options: [['No — as the owner only the owner bits (---) count', 'Không — là chủ thì chỉ bit của chủ (---) được tính'], ['Yes, through the group bits', 'Được, nhờ bit nhóm'], ['Yes, through the other bits', 'Được, nhờ bit other']],
      answer: 0, why: ['The kernel picks ONE class — owner, else group, else other — and uses only that class\'s bits.', 'Nhân chọn MỘT lớp — chủ, không thì nhóm, không thì other — và chỉ dùng bit của lớp đó.'],
    },
  },
  {
    id: 'perm-acl', ns: 'os-lab', sim: 'perm', presets: ['acl', 'setuid', 'caps', 'setgid'],
    title: ['Beyond rwx: ACLs, setuid and root', 'Ngoài rwx: ACL, setuid và root'],
    summary: ['An ACL entry and its mask trap, a setuid program borrowing root, and root itself being just a set of capabilities.', 'Một mục ACL và cái bẫy mask, một chương trình setuid mượn quyền root, và chính root chỉ là một bộ capability.'],
    steps: [
      {
        target: 'perm-tree', do: [{ a: 'perm.preset', v: 'acl' }, { a: 'player.seek', v: 0 }],
        title: ['A private folder… with one exception', 'Một thư mục riêng… có một ngoại lệ'],
        body: ['uploads/ is drwx--x---+ dev:dev. The "+" means an ACL is attached: an extra line "user:www-data" that the three rwx classes cannot express.', 'uploads/ là drwx--x---+ dev:dev. Dấu "+" nghĩa là có ACL đi kèm: thêm một dòng "user:www-data" mà ba lớp rwx không diễn tả được.'],
      },
      {
        target: 'play',
        title: ['Your turn: can nginx\'s user read a.jpg?', 'Đến lượt bạn: user của nginx đọc được a.jpg không?'],
        body: ['Press Play and watch www-data walk into uploads/ and read a.jpg.', 'Bấm Chạy và xem www-data đi vào uploads/ rồi đọc a.jpg.'],
        task: { text: ['Play to the verdict.', 'Chạy tới phán quyết.'], until: (s) => s.perm?.preset === 'acl' && s.perm?.atEnd === true && s.perm?.ok === true, solve: [{ a: 'player.speed', v: 4 }, { a: 'player.play', delay: 200 }] },
      },
      {
        target: 'perm-checks',
        title: ['The entry is ANDed with the mask', 'Mục ACL phải AND với mask'],
        body: ['user:www-data:r-- matched, and the mask r-- lets it through. The mask is the ceiling for every named entry and for the group.', 'user:www-data:r-- khớp, và mask r-- cho nó đi qua. Mask là trần cho mọi mục có tên và cho nhóm.'],
      },
      {
        target: 'perm-bits',
        title: ['Your turn: the innocent chmod 600', 'Đến lượt bạn: lệnh chmod 600 vô hại'],
        body: ['Someone "tightens" the file with chmod 600 a.jpg. Make a.jpg the selected file and set its mode to 600 (type it in the chmod box or click the bits).', 'Ai đó "siết" tệp bằng chmod 600 a.jpg. Chọn a.jpg rồi đặt mode 600 (gõ vào ô chmod hoặc bấm các bit).'],
        task: { text: ['Set a.jpg to 600.', 'Đặt a.jpg thành 600.'], until: (s) => s.perm?.path === '/srv/app/uploads/a.jpg' && s.perm?.mode === '600', solve: [{ a: 'perm.select', v: '/srv/app/uploads/a.jpg' }, { a: 'perm.chmod', v: '/srv/app/uploads/a.jpg:600', delay: 300 }] },
      },
      {
        target: 'perm-bits', do: [{ a: 'player.end', delay: 300 }],
        title: ['#effective:---', '#effective:---'],
        body: ['On a file with an ACL, chmod\'s GROUP bits set the MASK. 600 has group ---, so the mask is --- and www-data\'s r-- becomes effective ---. nginx starts returning 403 and nobody touched the ACL.', 'Trên tệp có ACL, bit NHÓM của chmod đặt MASK. 600 có nhóm ---, nên mask thành --- và r-- của www-data hiệu lực thành ---. nginx bắt đầu trả 403 mà không ai đụng vào ACL.'],
      },
      {
        target: 'perm-shell', do: [{ a: 'perm.preset', v: 'setuid' }, { a: 'player.end', delay: 300 }],
        title: ['setuid: borrowing the owner', 'setuid: mượn danh chủ tệp'],
        body: ['dev runs /usr/local/bin/ids, which is -rwsr-xr-x root. The "s" makes the process run with euid 0, so it opens the root-only .env. passwd and sudo work exactly like this.', 'dev chạy /usr/local/bin/ids, tệp -rwsr-xr-x của root. Chữ "s" khiến tiến trình chạy với euid 0, nên nó mở được .env chỉ dành cho root. passwd và sudo hoạt động y như vậy.'],
      },
      {
        target: 'perm-ask',
        title: ['Your turn: without ids', 'Đến lượt bạn: không qua ids'],
        body: ['Switch to "directly" and run the check: dev alone is refused.', 'Chuyển sang "trực tiếp" và chạy phép kiểm: một mình dev bị từ chối.'],
        task: { text: ['Read .env directly as dev.', 'Đọc .env trực tiếp với tư cách dev.'], until: (s) => s.perm?.via === '' && s.perm?.atEnd === true && s.perm?.ok === false, solve: [{ a: 'perm.via', v: false, delay: 300 }, { a: 'player.end', delay: 400 }] },
      },
      {
        target: 'perm-checks', do: [{ a: 'perm.preset', v: 'caps' }, { a: 'player.end', delay: 300 }],
        title: ['root reads a 000 file', 'root đọc tệp 000'],
        body: ['.env is now ---------- and root still reads it: the mode bits say no, then CAP_DAC_OVERRIDE overrides. root is not magic — it is a process holding capabilities.', '.env giờ là ---------- mà root vẫn đọc được: bit quyền nói không, rồi CAP_DAC_OVERRIDE vượt qua. root không có phép thuật — chỉ là tiến trình đang giữ capability.'],
      },
      {
        target: 'perm-ask',
        title: ['Your turn: drop the capability', 'Đến lượt bạn: bỏ capability'],
        body: ['Choose "--cap-drop dac_override" and run the check again.', 'Chọn "--cap-drop dac_override" rồi chạy lại phép kiểm.'],
        task: { text: ['Drop CAP_DAC_OVERRIDE and run.', 'Bỏ CAP_DAC_OVERRIDE và chạy.'], until: (s) => s.perm?.capsDrop === true && s.perm?.atEnd === true, solve: [{ a: 'perm.capsDrop', v: true, delay: 300 }, { a: 'player.end', delay: 400 }] },
      },
    ],
    quiz: {
      q: ['A file has the ACL entry user:www-data:r-- and you run chmod 600 on it. Can www-data still read it?', 'Một tệp có mục ACL user:www-data:r-- và bạn chạy chmod 600 lên nó. www-data còn đọc được không?'],
      options: [['No — chmod set the mask to ---', 'Không — chmod đã đặt mask thành ---'], ['Yes, ACL entries ignore chmod', 'Được, mục ACL không bị chmod ảnh hưởng'], ['Only if www-data is root', 'Chỉ khi www-data là root']],
      answer: 0, why: ['With an ACL present, the group bits of chmod become the mask, and every named entry is ANDed with it (getfacl shows #effective:---).', 'Khi có ACL, bit nhóm của chmod trở thành mask, và mọi mục có tên phải AND với nó (getfacl hiện #effective:---).'],
    },
  },
  // ───────────────────────── fdtable ─────────────────────────
  {
    id: 'fdtable-offsets', ns: 'os-lab', sim: 'fdtable', presets: ['twice', 'dup', 'append', 'fork', 'redirect'],
    title: ['Why two writers clobber a log file', 'Vì sao hai người ghi làm nát tệp log'],
    summary: ['fd → open file description → inode: who owns the offset decides whether writes overwrite each other.', 'fd → mô tả file mở → inode: ai giữ offset sẽ quyết định các lần ghi có đè lên nhau hay không.'],
    steps: [
      {
        target: 'fd-procs', do: [{ a: 'fd.preset', v: 'twice' }, { a: 'player.seek', v: 0 }],
        title: ['Three tables, not one', 'Ba bảng, không phải một'],
        body: ['Column ① is the process\'s fd table: just small numbers. fd 0, 1, 2 all point at description #1 — the terminal. The kernel keeps columns ② and ③ for itself.', 'Cột ① là bảng fd của tiến trình: chỉ là các số nhỏ. fd 0, 1, 2 đều trỏ vào mô tả #1 — terminal. Cột ② và ③ là của riêng nhân.'],
      },
      {
        target: 'step',
        title: ['Your turn: open the log twice', 'Đến lượt bạn: mở tệp log hai lần'],
        body: ['Press Step twice: worker A and worker B each call open("log.txt").', 'Bấm Bước hai lần: worker A và worker B mỗi người gọi open("log.txt").'],
        task: { text: ['Step until both opens are done.', 'Bấm Bước tới khi xong cả hai lần open.'], until: (s) => s.fd?.preset === 'twice' && ((s.fd?.i as number) ?? 0) >= 2, solve: [step(2, 700)] },
      },
      {
        target: 'fd-ofds',
        title: ['Two descriptions, two offsets', 'Hai mô tả, hai offset'],
        body: ['fd 3 → #2 and fd 4 → #3: every open() creates its OWN description with its own offset, both starting at 0, both pointing at the same inode 12.', 'fd 3 → #2 và fd 4 → #3: mỗi lần open() tạo một mô tả RIÊNG với offset riêng, cùng bắt đầu từ 0, cùng trỏ vào inode 12.'],
      },
      {
        target: 'play',
        title: ['Your turn: let them write', 'Đến lượt bạn: cho họ ghi'],
        body: ['Press Play. A writes 26 bytes, then B writes 13 bytes.', 'Bấm Chạy. A ghi 26 byte, rồi B ghi 13 byte.'],
        task: { text: ['Play to the end.', 'Chạy tới cuối.'], until: (s) => s.fd?.preset === 'twice' && s.fd?.atEnd === true, solve: [{ a: 'player.speed', v: 4 }, { a: 'player.play', delay: 200 }] },
      },
      {
        target: 'fd-term',
        title: ['"worker B: hi" + "er 1001 paid"', '"worker B: hi" + "er 1001 paid"'],
        body: ['B\'s offset was still 0, so it wrote OVER the first 13 bytes of A\'s line. No error, no warning — exactly the output of ofd.c in the lab.', 'Offset của B vẫn là 0, nên nó ghi ĐÈ lên 13 byte đầu dòng của A. Không lỗi, không cảnh báo — đúng output của ofd.c trong lab.'],
      },
      {
        target: 'fd-preset',
        title: ['Your turn: share one description', 'Đến lượt bạn: dùng chung một mô tả'],
        body: ['Choose "dup" and run it to the end: B is now dup(3) instead of a second open().', 'Chọn "dup" và chạy tới cuối: B giờ là dup(3) thay vì open() lần hai.'],
        task: { text: ['Run the dup scenario to the end.', 'Chạy kịch bản dup tới cuối.'], until: (s) => s.fd?.preset === 'dup' && s.fd?.atEnd === true, solve: [{ a: 'fd.preset', v: 'dup', delay: 300 }, { a: 'player.end', delay: 400 }] },
      },
      {
        target: 'fd-ofds',
        title: ['One description, offset 39', 'Một mô tả, offset 39'],
        body: ['fd 3 and fd 4 point at the SAME description (refs 2), so they share one offset: A moved it to 26, B wrote at 26 and moved it to 39. Both lines survive. fork() shares descriptions the same way.', 'fd 3 và fd 4 trỏ vào CÙNG một mô tả (refs 2), nên chung một offset: A dời nó tới 26, B ghi tại 26 rồi dời tới 39. Cả hai dòng còn nguyên. fork() cũng dùng chung mô tả y như vậy.'],
      },
      {
        target: 'fd-preset',
        title: ['Your turn: O_APPEND', 'Đến lượt bạn: O_APPEND'],
        body: ['Choose "append": two separate open()s again, but B asks for O_APPEND. Run it to the end.', 'Chọn "append": lại hai lần open() riêng, nhưng B xin O_APPEND. Chạy tới cuối.'],
        task: { text: ['Run the append scenario to the end.', 'Chạy kịch bản append tới cuối.'], until: (s) => s.fd?.preset === 'append' && s.fd?.atEnd === true, solve: [{ a: 'fd.preset', v: 'append', delay: 300 }, { a: 'player.end', delay: 400 }] },
      },
      {
        target: 'fd-term',
        title: ['The kernel jumps to the end', 'Nhân nhảy về cuối tệp'],
        body: ['With O_APPEND the kernel moves the offset to the end of the file atomically before every write, so B landed at 26 and ended at 39. That is why log files are opened in append mode ("a" in Python, flags: "a" in Node).', 'Với O_APPEND nhân dời offset về cuối tệp một cách nguyên tử trước mỗi lần ghi, nên B rơi vào 26 và kết thúc ở 39. Vì thế tệp log luôn được mở ở chế độ nối thêm ("a" trong Python, flags: "a" trong Node).'],
      },
    ],
    quiz: {
      q: ['A parent opens log.txt, then fork()s. Parent and child both write to fd 3. What happens?', 'Tiến trình cha mở log.txt rồi fork(). Cha và con cùng ghi vào fd 3. Chuyện gì xảy ra?'],
      options: [['They share one offset, so the lines follow each other', 'Chung một offset, nên các dòng nối tiếp nhau'], ['Each has its own offset and they overwrite', 'Mỗi bên offset riêng nên ghi đè nhau'], ['The child cannot use fd 3', 'Tiến trình con không dùng được fd 3']],
      answer: 0, why: ['fork() copies the fd table; the copies point at the same open file description, and the offset lives there (lab: child 28, parent 42).', 'fork() chép bảng fd; các bản chép trỏ vào cùng một mô tả file mở, và offset nằm ở đó (lab: con 28, cha 42).'],
    },
  },
  {
    id: 'fdtable-deleted', ns: 'os-lab', sim: 'fdtable', presets: ['deleted', 'emfile', 'links'],
    title: ['Deleted but still full, and "Too many open files"', 'Đã xoá mà đĩa vẫn đầy, và "Too many open files"'],
    summary: ['A file lives until its last name AND its last open description are gone; a process that never closes hits EMFILE.', 'Tệp sống tới khi tên cuối cùng VÀ mô tả mở cuối cùng đều biến mất; tiến trình không bao giờ đóng sẽ chạm EMFILE.'],
    steps: [
      {
        target: 'fd-inodes', do: [{ a: 'fd.preset', v: 'deleted' }, { a: 'player.seek', v: 0 }],
        title: ['A busy log file', 'Một tệp log đang bận'],
        body: ['node keeps app.log open in append mode and has written 900 MiB into it. The disk is filling up, so someone runs rm app.log.', 'node giữ app.log mở ở chế độ nối thêm và đã ghi 900 MiB vào đó. Đĩa sắp đầy, nên ai đó chạy rm app.log.'],
      },
      {
        target: 'step',
        title: ['Your turn: delete it', 'Đến lượt bạn: xoá nó'],
        body: ['Press Step until the rm has happened.', 'Bấm Bước tới khi lệnh rm chạy xong.'],
        task: { text: ['Step until app.log is deleted.', 'Bấm Bước tới khi app.log bị xoá.'], until: (s) => s.fd?.preset === 'deleted' && s.fd?.deletedOpen === true, solve: [step(3, 700)] },
      },
      {
        target: 'fd-df',
        title: ['du says 0, df says 900 MiB', 'du nói 0, df nói 900 MiB'],
        body: ['The NAME is gone, so du and ls no longer see the file. But node still holds an open description, so the inode and all 900 MiB of blocks stay. df does not go down.', 'TÊN đã mất, nên du và ls không thấy tệp nữa. Nhưng node vẫn giữ một mô tả đang mở, nên inode và cả 900 MiB khối dữ liệu vẫn ở đó. df không giảm.'],
      },
      {
        target: 'fd-inodes',
        title: ['links 0, open 1', 'links 0, đang mở 1'],
        body: ['This is the state lsof +L1 lists: link count 0, still open. node even keeps writing into it. The fix is to make the process close it — restart it, or truncate through /proc/PID/fd/3.', 'Đây là trạng thái lsof +L1 liệt kê: số liên kết 0, vẫn đang mở. node thậm chí vẫn ghi tiếp vào đó. Cách sửa là bắt tiến trình đóng nó — khởi động lại, hoặc truncate qua /proc/PID/fd/3.'],
      },
      {
        target: 'play',
        title: ['Your turn: close it', 'Đến lượt bạn: đóng nó'],
        body: ['Press Play until node closes fd 3.', 'Bấm Chạy tới khi node đóng fd 3.'],
        task: { text: ['Play until the space is freed.', 'Chạy tới khi dung lượng được giải phóng.'], until: (s) => s.fd?.preset === 'deleted' && s.fd?.atEnd === true && s.fd?.df === 0, solve: [{ a: 'player.speed', v: 4 }, { a: 'player.play', delay: 200 }] },
      },
      {
        target: 'fd-procs', do: [{ a: 'fd.preset', v: 'emfile' }, { a: 'player.seek', v: 1 }],
        title: ['A server that never closes', 'Một máy chủ không bao giờ đóng'],
        body: ['Now a server that forgets close() after each request. Every connection is one more row in its fd table. The soft limit (ulimit -n) is 1024.', 'Giờ là một máy chủ quên close() sau mỗi request. Mỗi kết nối là thêm một dòng trong bảng fd. Giới hạn mềm (ulimit -n) là 1024.'],
      },
      {
        target: 'step',
        title: ['Your turn: send traffic', 'Đến lượt bạn: gửi lưu lượng'],
        body: ['Press Step: each step is 500 more requests. Stop when the table is full.', 'Bấm Bước: mỗi bước là thêm 500 request. Dừng khi bảng đầy.'],
        task: { text: ['Step until EMFILE.', 'Bấm Bước tới khi gặp EMFILE.'], until: (s) => s.fd?.preset === 'emfile' && s.fd?.err === 'EMFILE', solve: [step(3, 700)] },
      },
      {
        target: 'fd-term',
        title: ['EMFILE: Too many open files', 'EMFILE: Too many open files'],
        body: ['1024 of 1024: accept4() now fails with EMFILE. The real fix is to close what you open; raising the limit (ulimit -n, LimitNOFILE=) only buys time.', '1024 trên 1024: accept4() giờ thất bại với EMFILE. Cách sửa thật là đóng thứ đã mở; nâng giới hạn (ulimit -n, LimitNOFILE=) chỉ câu giờ.'],
      },
    ],
    quiz: {
      q: ['You rm a 900 MiB log, but df still shows the disk full. Why?', 'Bạn rm một tệp log 900 MiB mà df vẫn báo đĩa đầy. Vì sao?'],
      options: [['A process still has the file open, so its inode is kept', 'Một tiến trình vẫn đang mở tệp, nên inode của nó được giữ lại'], ['rm only moves files to a trash folder', 'rm chỉ chuyển tệp vào thùng rác'], ['df is cached and updates once a day', 'df được cache và cập nhật mỗi ngày một lần']],
      answer: 0, why: ['rm removes a name. The inode is freed only when its link count is 0 AND no open file description refers to it.', 'rm gỡ một tên. Inode chỉ được giải phóng khi số liên kết bằng 0 VÀ không còn mô tả file mở nào trỏ tới nó.'],
    },
  },
  // ───────────────────────── nslayers ─────────────────────────
  {
    id: 'nslayers-views', ns: 'os-lab', sim: 'nslayers', presets: ['docker', 'unshare', 'userns'],
    title: ['Build a container out of namespaces', 'Dựng một container từ các namespace'],
    summary: ['Start from a plain process and switch namespaces on one at a time until it looks like a container — then see what is still shared.', 'Bắt đầu từ một tiến trình bình thường và bật từng namespace tới khi nó trông như một container — rồi xem thứ gì vẫn dùng chung.'],
    steps: [
      {
        target: 'ns-inside', do: [{ a: 'ns.preset', v: 'docker' }, { a: 'player.seek', v: 0 }],
        title: ['No namespaces yet', 'Chưa có namespace nào'],
        body: ['The right side is what "sleep 600" sees from inside. Right now it sees exactly what the host sees: every process, the real network cards, the VM\'s disk. It is just a process.', 'Bên phải là thứ "sleep 600" thấy từ bên trong. Lúc này nó thấy y như máy chủ: mọi tiến trình, card mạng thật, đĩa của máy ảo. Nó chỉ là một tiến trình.'],
      },
      {
        target: 'ns-host',
        title: ['The host always sees the truth', 'Máy chủ luôn thấy sự thật'],
        body: ['On the left: the same process seen from the Docker VM — PID 71743, child of containerd-shim-runc-v2 (71719). This side never changes, whatever we switch on.', 'Bên trái: cùng tiến trình đó nhìn từ máy ảo Docker — PID 71743, con của containerd-shim-runc-v2 (71719). Bên này không bao giờ đổi, dù ta bật gì.'],
      },
      {
        target: 'step',
        title: ['Your turn: add namespaces', 'Đến lượt bạn: thêm namespace'],
        body: ['Press Step until the pid namespace is on. Watch the yellow highlights on the right — they mark what just changed.', 'Bấm Bước tới khi pid namespace được bật. Nhìn chỗ tô vàng bên phải — đó là thứ vừa đổi.'],
        task: { text: ['Step until the pid namespace is on.', 'Bấm Bước tới khi pid namespace được bật.'], until: (s) => s.ns?.preset === 'docker' && s.ns?.pid === true, solve: [step(3, 700)] },
      },
      {
        target: 'ns-inside',
        title: ['PID 71743 is PID 1', 'PID 71743 là PID 1'],
        body: ['Inside, the process is PID 1 and ps shows two processes. Outside it is still 71743: /proc/71743/status says NSpid: 71743 1 — one process, two numbers.', 'Bên trong, tiến trình là PID 1 và ps chỉ thấy hai tiến trình. Bên ngoài nó vẫn là 71743: /proc/71743/status ghi NSpid: 71743 1 — một tiến trình, hai con số.'],
      },
      {
        target: 'play',
        title: ['Your turn: finish the container', 'Đến lượt bạn: dựng nốt container'],
        body: ['Press Play to switch on net, ipc, cgroup and time.', 'Bấm Chạy để bật nốt net, ipc, cgroup và time.'],
        task: { text: ['Play to the end.', 'Chạy tới cuối.'], until: (s) => s.ns?.preset === 'docker' && s.ns?.atEnd === true, solve: [{ a: 'player.speed', v: 4 }, { a: 'player.play', delay: 200 }] },
      },
      {
        target: 'ns-inodes',
        title: ['7 own namespaces, 1 shared', '7 namespace riêng, 1 dùng chung'],
        body: ['Exactly what the lab measured: 7 namespace inodes differ from the VM\'s PID 1 — but user is the SAME (4026531837). A default Docker container does not isolate users: root inside is root outside.', 'Đúng như lab đo: 7 inode namespace khác PID 1 của máy ảo — nhưng user GIỐNG nhau (4026531837). Container Docker mặc định không cách ly người dùng: root bên trong là root bên ngoài.'],
      },
      {
        target: 'ns-toggles',
        title: ['Your turn: switch on "user"', 'Đến lượt bạn: bật "user"'],
        body: ['Click the user button.', 'Bấm nút user.'],
        task: { text: ['Turn on the user namespace.', 'Bật user namespace.'], until: (s) => s.ns?.user === true, solve: [{ a: 'ns.toggle', v: 'user', delay: 300 }] },
      },
      {
        target: 'ns-inside',
        title: ['root inside, dev outside', 'root bên trong, dev bên ngoài'],
        body: ['uid_map becomes "0 1001 1": uid 0 in here is uid 1001 out there. Inside you hold every capability, yet touch /etc/hacked fails — /etc belongs to the real root. That is a rootless container.', 'uid_map thành "0 1001 1": uid 0 trong này là uid 1001 ngoài kia. Bên trong bạn giữ mọi capability, vậy mà touch /etc/hacked thất bại — /etc thuộc root thật. Đó là container rootless.'],
      },
      {
        target: 'where',
        title: ['Where is the container?', 'Container nằm ở đâu?'],
        body: ['Nowhere special: a namespace is a few pointers in the kernel\'s process structure in RAM. The process runs on the same cores under the same kernel — that is why containers start in milliseconds and a VM takes seconds.', 'Chẳng ở đâu đặc biệt: namespace chỉ là vài con trỏ trong cấu trúc tiến trình của nhân, nằm trong RAM. Tiến trình chạy trên cùng các lõi, dưới cùng một nhân — vì thế container khởi động trong vài mili giây còn máy ảo mất vài giây.'],
      },
    ],
    quiz: {
      q: ['Which namespace makes a process see itself as PID 1?', 'Namespace nào khiến một tiến trình thấy mình là PID 1?'],
      options: [['pid', 'pid'], ['uts', 'uts'], ['user', 'user']],
      answer: 0, why: ['The PID namespace starts a new numbering; the same process keeps its real PID on the host (NSpid shows both).', 'PID namespace bắt đầu một dãy số mới; cùng tiến trình đó vẫn giữ PID thật trên máy chủ (NSpid hiện cả hai).'],
    },
  },
  {
    id: 'nslayers-pod', ns: 'os-lab', sim: 'nslayers', presets: ['pod'],
    title: ['A pod = containers sharing namespaces', 'Pod = các container dùng chung namespace'],
    summary: ['Why a sidecar can call localhost:8000, why two containers cannot both listen on 8000, and what the pause container is for.', 'Vì sao sidecar gọi được localhost:8000, vì sao hai container không cùng nghe 8000 được, và container pause để làm gì.'],
    steps: [
      {
        target: 'ns-pod', do: [{ a: 'ns.preset', v: 'pod' }],
        title: ['Three containers, one pod', 'Ba container, một pod'],
        body: ['"pause" does nothing but hold namespaces. app and sidecar JOIN them. By default Kubernetes shares net, ipc and uts; pid only if you ask (shareProcessNamespace).', '"pause" không làm gì ngoài giữ namespace. app và sidecar GIA NHẬP vào đó. Mặc định Kubernetes cho dùng chung net, ipc và uts; pid chỉ khi bạn xin (shareProcessNamespace).'],
      },
      {
        target: 'ns-podres',
        title: ['localhost means the pod', 'localhost nghĩa là cả pod'],
        body: ['They share ONE network namespace, so 127.0.0.1:8000 from the sidecar is the app\'s socket — the lab printed the HTML page. And only one of them can bind port 8000.', 'Chúng dùng chung MỘT network namespace, nên 127.0.0.1:8000 từ sidecar chính là socket của app — lab in ra trang HTML. Và chỉ một trong hai được nghe cổng 8000.'],
      },
      {
        target: 'ns-pod',
        title: ['Your turn: cut the network', 'Đến lượt bạn: cắt mạng'],
        body: ['Click "net" to give each container its own network namespace.', 'Bấm "net" để mỗi container có network namespace riêng.'],
        task: { text: ['Stop sharing net.', 'Thôi dùng chung net.'], until: (s) => s.ns?.podNet === false, solve: [{ a: 'ns.pod', v: 'net', delay: 300 }] },
      },
      {
        target: 'ns-podres',
        title: ['Connection refused', 'Connection refused'],
        body: ['Now 127.0.0.1 in the sidecar is its OWN loopback — nobody listens there. And when the app restarts it would get a new IP. Keeping the IP stable is exactly the pause container\'s job.', 'Giờ 127.0.0.1 trong sidecar là loopback CỦA RIÊNG nó — chẳng ai nghe ở đó. Và khi app khởi động lại nó sẽ nhận IP mới. Giữ IP ổn định chính là việc của container pause.'],
      },
      {
        target: 'ns-pod',
        title: ['Your turn: share net and pid', 'Đến lượt bạn: dùng chung net và pid'],
        body: ['Turn net back on, and also share pid.', 'Bật lại net, và cho dùng chung cả pid.'],
        task: { text: ['Share net and pid.', 'Dùng chung net và pid.'], until: (s) => s.ns?.podNet === true && s.ns?.podPid === true, solve: [{ a: 'ns.pod', v: 'net', delay: 300 }, { a: 'ns.pod', v: 'pid', delay: 300 }] },
      },
      {
        target: 'ns-podres',
        title: ['pause is PID 1', 'pause là PID 1'],
        body: ['With a shared PID namespace, ps in the app shows pause as PID 1 and python as 7 — the lab\'s docker exec … ps printed exactly that. PID 1 also reaps zombies for the whole pod.', 'Khi dùng chung PID namespace, ps trong app thấy pause là PID 1 và python là 7 — lệnh docker exec … ps của lab in đúng như vậy. PID 1 cũng dọn zombie cho cả pod.'],
      },
    ],
    quiz: {
      q: ['Two containers in one pod both try to listen on port 8000. What happens?', 'Hai container trong một pod cùng nghe cổng 8000. Chuyện gì xảy ra?'],
      options: [['The second one gets EADDRINUSE', 'Cái thứ hai nhận EADDRINUSE'], ['Both work, each has its own port 8000', 'Cả hai chạy, mỗi cái một cổng 8000 riêng'], ['Kubernetes renumbers one of them', 'Kubernetes tự đổi số cổng một cái']],
      answer: 0, why: ['They share one network namespace — one set of ports — so only one socket can bind :8000.', 'Chúng dùng chung một network namespace — một bộ cổng — nên chỉ một socket được nghe :8000.'],
    },
  },
];
