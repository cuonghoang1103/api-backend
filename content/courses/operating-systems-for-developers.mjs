/**
 * Hệ điều hành cho lập trình viên — khoá học CuongThai (Courses, GENERAL). KHUNG dựng 30/09/2026 theo
 * content/courses/_KE-HOACH-KHOA-MOI-3009.md (Nhóm C). Slug là operating-systems-for-developers vì "operating-systems" đã là khoá Academy FPT — seeder từ chối ghi đè. Soạn chi tiết sau theo content/courses/docker/_HOP-DONG.md.
 *
 * Ranh giới: linux-bash dạy DÙNG hệ điều hành (Ch5 tiến trình/tín hiệu/job ở mức lệnh, Ch14 syscall/namespaces/cgroups/
 * USE ở mức quản trị). Khoá này dạy CƠ CHẾ bên trong (lập lịch, bộ nhớ ảo, trang, file system, đồng bộ hoá) và hệ quả
 * lên code của lập trình viên (Node.js event loop, luồng Java/Spring, pool, OOM). Chỗ chạm có bài "Nếu đã học …".
 * Không trùng performance-load-testing (Nhóm B — đo tải/k6/capacity): chương hiệu năng ở đây chỉ ở mức cơ chế OS.
 */
import { khung } from './_chung/khung.mjs';

export default {
  category: { slug: 'cs-fundamentals', name: 'Nền tảng khoa học máy tính', icon: 'Cpu', sortOrder: 9 },
  course: {
    slug: 'operating-systems-for-developers',
    title: 'Operating Systems for Developers',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    isFeatured: false,
    syncOrder: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/course-covers/operating-systems-for-developers.png?v=4',
    shortDescription: 'How the operating system really runs your code: processes and threads, scheduling, virtual memory and the OOM killer, file systems and I/O, system calls, locks and deadlocks, IPC, and containers seen from the kernel — measured on Linux.|||Hệ điều hành thật sự chạy code của bạn thế nào: tiến trình và luồng, lập lịch, bộ nhớ ảo và OOM killer, hệ thống file và I/O, system call, khoá và deadlock, IPC, và container nhìn từ nhân — đo thật trên Linux.',
    description: 'Khoá hệ điều hành cho lập trình viên — môn OS của trường đại học, nhưng mọi khái niệm đều nối về code bạn viết hằng ngày và đo được trên Linux. Tiến trình, luồng và vòng đời của chúng; lập lịch CPU (CFS/EEVDF, ưu tiên, context switch); bộ nhớ ảo, phân trang, page fault, swap và OOM killer; hệ thống file, page cache, fsync và các mô hình I/O (blocking, epoll, io_uring); system call; đồng bộ hoá (race condition, mutex, semaphore, deadlock, lock-free); IPC; container nhìn từ nhân (namespaces, cgroups); và hệ quả với Node.js, Java/Spring Boot, PostgreSQL. Dự án cuối: chẩn đoán và sửa một máy chủ 6GB bị OOM khi build — sự cố thật của hạ tầng cuongthai.com.',
    whatYouLearn: 'Giải thích tiến trình, luồng, lập lịch và bộ nhớ ảo bằng ví dụ đo được; đọc /proc, strace, perf, vmstat để hiểu chương trình đang làm gì; hiểu vì sao Node.js dùng một luồng + event loop và Java dùng thread pool; phát hiện và sửa race condition, deadlock; hiểu fsync và độ bền dữ liệu; giải thích container là gì ở mức nhân; chẩn đoán exit 137/OOM, rò rỉ bộ nhớ, cạn file descriptor; trả lời câu hỏi OS trong phỏng vấn và môn học.',
    requirements: 'Lập trình được một ngôn ngữ (C, Java hoặc JavaScript), dùng terminal Linux cơ bản. Nên học trước Linux & Bash; biết chút C là lợi thế nhưng không bắt buộc (có bài C tối thiểu).',
    documentsNote: 'Tài liệu chính: "Operating Systems: Three Easy Pieces" (Arpaci-Dusseau, miễn phí tại pages.cs.wisc.edu/~remzi/OSTEP) • "Operating System Concepts" (Silberschatz, Galvin, Gagne) • "The Linux Programming Interface" (Michael Kerrisk) • man7.org/linux/man-pages • kernel.org/doc/html/latest • "Systems Performance" (Brendan Gregg) và brendangregg.com.',
  },
  sections: khung('os', [
    ['Section 0 — What an operating system is for', 'Mục 0 — Hệ điều hành để làm gì', 'Hệ điều hành bằng lời đời thường, lịch sử, và phòng lab để quan sát nhân Linux.', [
      ['bat-dau-tai-day', 'Start here (1/2) — The OS in everyday words, its history, and bugs that cost lives and missions', 'Bắt đầu tại đây (1/2) — Hệ điều hành bằng lời đời thường, lịch sử, và những lỗi trả giá đắt', 'Người quản lý toà nhà chia phòng, điện, nước cho các chương trình · Unix ở Bell Labs 1969 → C 1972 → Linux 1991 (Linus Torvalds) → Android, máy chủ, container · Therac-25 (1985–1987): race condition trong máy xạ trị gây tử vong · Mars Pathfinder 1997: đảo ngược ưu tiên làm hệ thống tự khởi động lại trên sao Hỏa · Vì sao lập trình viên web vẫn cần OS'],
      ['bat-dau-hoc-xong', 'Start here (2/2) — What you can do after this course, and how to study it', 'Bắt đầu tại đây (2/2) — Học xong làm được gì, và học thế nào', 'Hiểu vì sao code chậm, treo, ăn RAM · Nền cho backend, hệ thống nhúng/IoT (LabFlow AIoT), SRE, bảo mật · Qua môn OS ở trường bằng hiểu chứ không học thuộc · Lộ trình: linux-bash → khoá này → distributed-systems · Cách học: đọc OSTEP song song, mỗi bài một thí nghiệm'],
      ['cai-dat', 'Your OS lab: a Linux VM, C toolchain and observability tools', 'Phòng lab OS: máy ảo Linux, bộ biên dịch C và công cụ quan sát', 'Ubuntu trong VM/Multipass hoặc container đặc quyền · gcc, make, strace, ltrace, perf, gdb, bpftrace · Trên macOS: vì sao nên thí nghiệm trong Linux · Máy ảo được phép làm sập'],
      ['c-toi-thieu', 'Just enough C to read OS examples', 'Vừa đủ C để đọc ví dụ hệ điều hành', 'Con trỏ và bộ nhớ · malloc/free · Gọi hàm hệ thống từ C · So sánh với Java/JavaScript'],
    ]],
    ['Chapter 1 — Processes', 'Chương 1 — Tiến trình', 'Chương trình đang chạy là gì trong mắt nhân.', [
      ['tien-trinh', 'Process abstraction: address space, registers, open files', 'Trừu tượng tiến trình: không gian địa chỉ, thanh ghi, file đang mở', 'Chương trình vs tiến trình · PCB/task_struct · Xem /proc/<pid>/status, maps, fd · Nếu đã học linux-bash Ch5: ps/top/tín hiệu — ở đây là bên trong nhân'],
      ['fork-exec', 'fork, exec, wait: how every process is born', 'fork, exec, wait: mọi tiến trình ra đời thế nào', 'Viết shell tí hon bằng C · Copy-on-write · Zombie và orphan · posix_spawn'],
      ['che-do', 'User mode, kernel mode and the system call boundary', 'Chế độ người dùng, chế độ nhân và ranh giới system call', 'Vòng bảo vệ CPU · Trap và ngắt · Chi phí một lần vào nhân · strace -c đếm syscall'],
      ['vong-doi', 'Process states, signals and exit codes', 'Trạng thái tiến trình, tín hiệu và mã thoát', 'R/S/D/T/Z nhìn từ nhân · Tín hiệu được giao lúc nào · 128+N · Exit 137 = SIGKILL (thường là OOM)'],
      ['pid1', 'PID 1, init systems and processes in containers', 'PID 1, hệ thống init và tiến trình trong container', 'systemd · PID 1 không nhận SIGTERM mặc định · tini/dumb-init · Vì sao docker stop chờ 10 giây'],
    ]],
    ['Chapter 2 — Threads and CPU scheduling', 'Chương 2 — Luồng và lập lịch CPU', 'Nhiều việc chạy "cùng lúc" trên vài lõi.', [
      ['luong', 'Threads: what they share and what they do not', 'Luồng: chia sẻ gì và không chia sẻ gì', 'pthread · Stack riêng, heap chung · Luồng nhân vs luồng người dùng · Virtual threads của Java 21'],
      ['lap-lich', 'Scheduling policies: FIFO, round robin, MLFQ, CFS, EEVDF', 'Chính sách lập lịch: FIFO, round robin, MLFQ, CFS, EEVDF', 'Thông lượng vs thời gian đáp ứng · CFS (2007) và EEVDF (Linux 6.6, 2023) · nice và ưu tiên · Mô phỏng bằng tay'],
      ['context-switch', 'Context switches and their cost', 'Chuyển ngữ cảnh và cái giá của nó', 'Đo bằng perf stat và vmstat cs · Quá nhiều luồng làm chậm · Cache CPU bị xoá'],
      ['da-loi', 'Multicore: affinity, NUMA and CPU limits', 'Đa lõi: affinity, NUMA và giới hạn CPU', 'taskset · NUMA nhập môn · CPU quota trong container và throttling · Java/Node đếm số lõi sai trong container'],
      ['event-loop', 'Event loop vs thread pool: Node.js and Spring Boot', 'Event loop và thread pool: Node.js và Spring Boot', 'libuv và thread pool ẩn · Chặn event loop bằng việc nặng CPU · Tomcat thread pool · Chọn mô hình cho LabFlow'],
    ]],
    ['Chapter 3 — Memory: virtual memory and paging', 'Chương 3 — Bộ nhớ: bộ nhớ ảo và phân trang', 'Mỗi tiến trình tưởng mình có cả bộ nhớ.', [
      ['khong-gian-dia-chi', 'Address spaces: stack, heap, code, mmap', 'Không gian địa chỉ: stack, heap, code, mmap', '/proc/<pid>/maps · Stack overflow · ASLR · RSS vs VSZ'],
      ['phan-trang', 'Paging, page tables and the TLB', 'Phân trang, bảng trang và TLB', 'Trang 4KB · Bảng trang nhiều cấp · TLB miss · Huge pages và PostgreSQL'],
      ['page-fault', 'Page faults, demand paging and copy-on-write', 'Page fault, nạp trang theo yêu cầu và copy-on-write', 'Minor vs major fault · Đo bằng perf/ps · fork của Redis khi lưu RDB nhân đôi bộ nhớ ra sao'],
      ['malloc-gc', 'Allocators and garbage collectors', 'Bộ cấp phát và bộ gom rác', 'malloc, phân mảnh bộ nhớ · V8 heap và --max-old-space-size · JVM heap, G1/ZGC · Rò rỉ bộ nhớ trong Node.js và Java'],
    ]],
    ['Chapter 4 — Memory pressure: swap, cgroups and the OOM killer', 'Chương 4 — Áp lực bộ nhớ: swap, cgroup và OOM killer', 'Khi RAM không đủ, nhân chọn ai phải chết.', [
      ['page-cache', 'Page cache and why "free" memory is almost zero', 'Page cache và vì sao bộ nhớ "free" gần bằng 0', 'buff/cache · available vs free · Đọc /proc/meminfo · Nếu đã học linux-bash Ch5: free/top — ở đây là cơ chế'],
      ['swap', 'Swap, swappiness and thrashing', 'Swap, swappiness và thrashing', 'Khi nào swap có ích · Thrashing làm máy "treo" · zram · PSI (pressure stall information)'],
      ['oom-killer', 'The OOM killer: how it picks a victim', 'OOM killer: nó chọn nạn nhân thế nào', 'oom_score, oom_score_adj · dmesg ghi gì · Overcommit · Bảo vệ PostgreSQL khỏi bị giết'],
      ['oom-that', 'Real incident: next build killed with exit 137 on a 6GB VPS', 'Sự cố thật: next build bị giết với exit 137 trên VPS 6GB', 'Hai build song song vượt RAM · Container bị giết, deploy dở dang · Cách sửa: build tuần tự, build ở máy khác, giới hạn memory · memory.events trong cgroup v2'],
      ['gioi-han', 'Setting memory limits for Node.js, JVM and containers', 'Đặt giới hạn bộ nhớ cho Node.js, JVM và container', 'docker --memory · -XX:MaxRAMPercentage · Node heap vs RSS · Giới hạn quá chặt cũng gây sự cố'],
    ]],
    ['Chapter 5 — File systems and storage', 'Chương 5 — Hệ thống file và lưu trữ', 'Dữ liệu nằm trên đĩa thế nào, và khi nào nó thật sự an toàn.', [
      ['inode', 'Files, inodes, directories and links', 'File, inode, thư mục và liên kết', 'Tên chỉ là con trỏ tới inode · Hard link vs symlink · Bài học thật: bind-mount một file theo inode nên mv không có tác dụng trong container'],
      ['ext4-journal', 'ext4, XFS, journaling and crash consistency', 'ext4, XFS, journaling và nhất quán khi sập', 'Journal ghi trước · Chế độ data=ordered · Copy-on-write (Btrfs, ZFS) · Mất điện giữa lúc ghi'],
      ['fsync', 'fsync, write-back and durability', 'fsync, ghi trễ và độ bền', 'write() trả về chưa có nghĩa là đã lên đĩa · fsync/fdatasync · "fsyncgate" của PostgreSQL (2018) · Ghi file an toàn: ghi tạm → fsync → rename'],
      ['dia-day', 'Disk space, inodes running out and log growth', 'Đầy đĩa, cạn inode và log phình', 'df vs du lệch nhau vì file đã xoá còn mở · Cạn inode · Sự cố thật: đĩa đầy vì build cache giết Postgres'],
      ['ssd', 'SSDs, block devices and I/O schedulers', 'SSD, thiết bị khối và bộ lập lịch I/O', 'Trang và khối xoá của SSD · TRIM · mq-deadline/none · Đo bằng fio'],
    ]],
    ['Chapter 6 — I/O models', 'Chương 6 — Các mô hình I/O', 'Chờ đợi dữ liệu mà không lãng phí CPU.', [
      ['fd', 'File descriptors: everything is a file', 'File descriptor: mọi thứ là file', 'Bảng fd · ulimit -n và "Too many open files" · Socket, pipe cũng là fd · Rò rỉ fd'],
      ['blocking', 'Blocking, non-blocking and asynchronous I/O', 'I/O chặn, không chặn và bất đồng bộ', 'read chặn luồng · O_NONBLOCK · Bài toán C10K (1999)'],
      ['epoll', 'select, poll, epoll and kqueue', 'select, poll, epoll và kqueue', 'Vì sao epoll mở rộng được · Edge vs level triggered · Viết một echo server bằng epoll · libuv dùng gì trên Linux/macOS'],
      ['io-uring', 'io_uring and zero-copy (sendfile)', 'io_uring và zero-copy (sendfile)', 'Hàng đợi chia sẻ với nhân · sendfile trong nginx · Khi nào đáng dùng'],
    ]],
    ['Chapter 7 — Concurrency: race conditions and locks', 'Chương 7 — Đồng thời: race condition và khoá', 'Hai luồng đụng cùng một dữ liệu.', [
      ['race', 'Race conditions you can reproduce', 'Race condition tái hiện được', 'counter++ không nguyên tử · Chạy 1 triệu lần ra số sai · Race trong JavaScript bất đồng bộ (check-then-act qua await)'],
      ['mutex', 'Mutexes, spinlocks and condition variables', 'Mutex, spinlock và biến điều kiện', 'Vùng găng · futex của Linux · Producer-consumer · synchronized/ReentrantLock trong Java'],
      ['semaphore', 'Semaphores, read-write locks and atomics', 'Semaphore, khoá đọc-ghi và phép toán nguyên tử', 'Giới hạn số người vào · RWLock · Compare-and-swap · Mô hình bộ nhớ và memory barrier nhập môn'],
      ['deadlock', 'Deadlock, livelock and priority inversion', 'Deadlock, livelock và đảo ngược ưu tiên', 'Bốn điều kiện Coffman · Thứ tự khoá cố định · Deadlock trong PostgreSQL · Mars Pathfinder nhìn lại'],
      ['bai-toan-kinh-dien', 'Classic problems: dining philosophers, readers-writers, bounded buffer', 'Bài toán kinh điển: triết gia ăn tối, đọc-ghi, bộ đệm giới hạn', 'Giải bằng Java và C · Câu hỏi thi môn OS · Nối sang phỏng vấn'],
    ]],
    ['Chapter 8 — Inter-process communication', 'Chương 8 — Giao tiếp giữa các tiến trình', 'Các tiến trình nói chuyện với nhau thế nào.', [
      ['pipe', 'Pipes and FIFOs', 'Pipe và FIFO', 'Ống dẫn của shell bên dưới · Bộ đệm pipe đầy thì sao · SIGPIPE'],
      ['unix-socket', 'Unix domain sockets', 'Unix domain socket', 'Nhanh hơn TCP localhost · docker.sock và vì sao mount nó là trao quyền root · PostgreSQL qua socket'],
      ['shared-memory', 'Shared memory and memory-mapped files', 'Bộ nhớ chia sẻ và file ánh xạ bộ nhớ', 'shm_open, mmap · shared_buffers của PostgreSQL · Đồng bộ khi chia sẻ bộ nhớ'],
      ['signal-ipc', 'Signals and graceful shutdown', 'Tín hiệu và tắt êm', 'Bắt SIGTERM trong Node.js/Spring Boot · Rút kết nối trước khi thoát · Deploy không rơi request'],
    ]],
    ['Chapter 9 — Containers from the kernel’s point of view', 'Chương 9 — Container nhìn từ nhân', 'Container không phải máy ảo — nó là tiến trình được rào lại.', [
      ['namespaces', 'Namespaces: pid, net, mnt, uts, ipc, user', 'Namespace: pid, net, mnt, uts, ipc, user', 'unshare tự dựng một "container" bằng tay · Nếu đã học linux-bash Ch14: nsenter và 8 namespace — ở đây là vì sao nhân thiết kế vậy'],
      ['cgroups', 'cgroups v2: CPU, memory and I/O limits', 'cgroup v2: giới hạn CPU, bộ nhớ và I/O', 'Lịch sử: Google đóng góp (Linux 2.6.24, 2008) · cpu.max, memory.max, io.max · Throttling đo được'],
      ['overlay-seccomp', 'OverlayFS, capabilities and seccomp', 'OverlayFS, capabilities và seccomp', 'Lớp ảnh Docker trên đĩa · Bỏ bớt quyền root · Lọc syscall · Trỏ khoá cloud-container-security cho phần tấn công/phòng thủ'],
      ['vm-vs-container', 'VMs, containers, gVisor and Firecracker', 'Máy ảo, container, gVisor và Firecracker', 'Hypervisor type 1/2 · Chung nhân vs riêng nhân · microVM · Docker Desktop trên macOS thật ra chạy một VM'],
    ]],
    ['Chapter 10 — Observing and tuning the OS', 'Chương 10 — Quan sát và tinh chỉnh hệ điều hành', 'Thấy được nhân đang làm gì với chương trình của bạn.', [
      ['strace-ltrace', 'strace and ltrace: what your program asks the kernel', 'strace và ltrace: chương trình của bạn xin nhân những gì', 'Theo dõi Node.js mở file nào · Tìm chỗ treo · Chi phí của strace'],
      ['perf', 'perf and flame graphs', 'perf và flame graph', 'Lấy mẫu CPU · Flame graph cho Node.js và Java · Tìm hàm nóng'],
      ['ebpf', 'eBPF and bpftrace', 'eBPF và bpftrace', 'Chạy chương trình nhỏ trong nhân an toàn · Công cụ bcc (execsnoop, opensnoop, biolatency) · Nếu đã học linux-bash Ch14: phương pháp USE — ở đây là vì sao số liệu đó tồn tại'],
      ['sysctl', 'sysctl and kernel tunables worth knowing', 'sysctl và các tham số nhân nên biết', 'vm.overcommit_memory, vm.swappiness · fs.file-max · net.core.somaxconn · Đừng tinh chỉnh khi chưa đo'],
    ]],
    ['Chapter 11 — OS in exams and interviews', 'Chương 11 — Hệ điều hành trong thi cử và phỏng vấn', 'Câu hỏi OS kinh điển và cách trả lời bằng thí nghiệm.', [
      ['cau-hoi', 'Classic interview questions', 'Câu hỏi phỏng vấn kinh điển', 'Tiến trình vs luồng · Deadlock · Bộ nhớ ảo · Điều gì xảy ra khi gọi malloc · Trả lời kèm số đo'],
      ['bai-tap-thi', 'University OS exam patterns', 'Dạng bài thi môn OS ở trường', 'Lập lịch (Gantt, thời gian chờ) · Thay trang (FIFO, LRU, OPT) · Banker’s algorithm · Semaphore'],
      ['su-co', 'Production incidents that were really OS problems', 'Sự cố production thật ra là vấn đề hệ điều hành', 'Giây nhuận 30/06/2012 làm nhiều máy Linux ăn 100% CPU · Dirty COW (2016) — race condition trong nhân · Cạn fd, cạn PID, đĩa đầy'],
    ]],
    ['Chapter 12 — Capstone: diagnose and harden a small production server', 'Chương 12 — Dự án cuối khoá: chẩn đoán và gia cố một máy chủ nhỏ', 'Máy chủ 6GB chạy Docker: Next.js + Express/Spring Boot + PostgreSQL + Redis, giống cuongthai.com và LabFlow.', [
      ['dung-lab', 'Build the lab server and a load generator', 'Dựng máy chủ lab và bộ tạo tải', 'VPS/VM 6GB · Compose Next.js + API + PostgreSQL + Redis · Tạo tải đơn giản'],
      ['tai-hien', 'Reproduce: OOM during build, fd leak, blocked event loop, lock contention', 'Tái hiện: OOM khi build, rò rỉ fd, event loop bị chặn, tranh chấp khoá', 'Mỗi sự cố một nhánh git · Thu bằng chứng: dmesg, /proc, strace, perf'],
      ['sua', 'Fix with evidence', 'Sửa có bằng chứng', 'Giới hạn memory đúng cho từng container · Đóng fd · Đẩy việc nặng CPU ra worker · Đo trước/sau'],
      ['tong-ket', 'Write the postmortem and your interview story', 'Viết báo cáo sự cố và câu chuyện phỏng vấn', 'Mẫu postmortem không đổ lỗi · Checklist cả khoá · Kể lại trong phỏng vấn'],
    ]],
  ]),
};
