/**
 * Operating Systems for Developers — khoá CuongThai (Courses, academyType=GENERAL).
 * Slug là operating-systems-for-developers vì "operating-systems" đã là khoá Academy FPT (OSG202) — seeder từ chối ghi đè.
 *
 * Ranh giới với các khoá khác:
 *  - linux-bash dạy DÙNG hệ điều hành (lệnh, quản trị). Khoá này dạy CƠ CHẾ bên trong (lập lịch, bộ nhớ ảo, trang, file
 *    system, đồng bộ, syscall, container) và HỆ QUẢ lên code của lập trình viên (Node event loop, luồng Java/Spring, pool,
 *    OOM, exit 137). Chỗ chạm nhau có bài "Nếu đã học linux-bash …".
 *  - performance-load-testing (đo tải/k6/capacity) khác: chương hiệu năng ở đây chỉ ở mức cơ chế OS.
 *  - Academy OSG202 (123 bài + 8 deck ⭐) KHÔNG trùng: khoá này đi sâu vào "nghĩa với code/máy chủ/bảo mật của tôi" và trỏ
 *    sang OSG202 khi hữu ích.
 *
 * ⭐ TRỌNG TÂM theo yêu cầu chủ kênh (SV FPT học OSG202, muốn làm backend/bảo mật, 28/10/2026):
 *  - "thấy được" hệ điều hành: PHÒNG LAB TRỰC QUAN /os-lab (6 mô phỏng React, nhúng vào bài bằng content/.../_lab.mjs `lab()`).
 *  - quan sát Linux hằng ngày (tiến trình nào ăn CPU/RAM/đĩa/IO/mạng) kể như sự cố thật của chính dự án cuongthai.com.
 *  - tiến trình & luồng: TỰ VIẾT chương trình đồng thời/song song (C pthreads, Java threads/virtual threads, Node
 *    worker_threads/cluster, Python GIL/multiprocessing) rồi ĐO.
 *  - đồng bộ (race, mutex, semaphore, deadlock), bộ nhớ ảo, file system & quyền, syscall, container, + 2 chương MỚI:
 *    Bảo mật ở tầng OS (phòng thủ, chỉ trên lab của người học) và Windows/macOS cho lập trình viên.
 *
 * TRẠNG THÁI (28/10/2026): Mục 0 + Chương 1 ĐÃ SOẠN ĐẦY ĐỦ (bài mẫu: _HOP-DONG.md + _PROMPT-AGENT.md cho agent chương
 * sau). Các chương 2–17 còn là KHUNG (khung() ⇒ "Đang soạn"). Output CHẠY THẬT trong ảnh `os-lab` (lab/moi-truong).
 *
 * Kiểm trước khi seed:
 *   node scripts/course-content-check.mjs ./content/courses/operating-systems-for-developers.mjs
 * Seed: node scripts/course-seed.mjs --file ./content/courses/operating-systems-for-developers.mjs --apply
 */
import { khung } from './_chung/khung.mjs';
import s00 from './operating-systems-for-developers/s00-gioi-thieu.mjs';
import s01 from './operating-systems-for-developers/s01-tien-trinh.mjs';
import s02 from './operating-systems-for-developers/s02-quan-sat.mjs';
import s03 from './operating-systems-for-developers/s03-luong-lap-lich.mjs';
import s05 from './operating-systems-for-developers/s05-dong-bo.mjs';
import s07 from './operating-systems-for-developers/s07-bo-nho-ao.mjs';
import s06 from './operating-systems-for-developers/s06-deadlock.mjs';
import s08 from './operating-systems-for-developers/s08-ap-luc-bo-nho.mjs';
import s09 from './operating-systems-for-developers/s09-file-quyen.mjs';
import s10 from './operating-systems-for-developers/s10-mo-hinh-io.mjs';
import s11 from './operating-systems-for-developers/s11-loi-goi-he-thong.mjs';
import s12 from './operating-systems-for-developers/s12-container.mjs';
import s13 from './operating-systems-for-developers/s13-bao-mat.mjs';
import s14 from './operating-systems-for-developers/s14-windows-macos.mjs';

/*
 * Đề cương đầy đủ (redesigned 28/10/2026). Mục 0 và Chương 1 ở đây chỉ là KHUNG dự phòng — hai section THẬT (s00, s01)
 * ghi đè chúng ngay dưới. Giữ nguyên để khung() đánh đúng số chương cho các chương sau (n = chỉ số mảng).
 */
const sections = khung('os', [
  ['Section 0 — What an operating system is for', 'Mục 0 — Hệ điều hành để làm gì', 'Hệ điều hành bằng lời đời thường và bằng số đo; phòng lab Linux thật; và vừa đủ C.', [
    ['bat-dau-tai-day', 'Start here (1/2)', 'Bắt đầu tại đây (1/2)', 'Hệ điều hành là gì · lịch sử Unix→Linux · lỗi OS trả giá đắt'],
    ['bat-dau-hoc-xong', 'Start here (2/2)', 'Bắt đầu tại đây (2/2)', 'Học xong làm được gì · điều kiện · cách học'],
    ['cai-dat', 'Your OS lab', 'Phòng lab OS', 'Container vứt đi · giới hạn CPU/RAM · Docker trên Mac là VM'],
    ['c-toi-thieu', 'Just enough C', 'Vừa đủ C', 'Con trỏ · stack/heap · syscall · không có lưới an toàn'],
  ]],
  ['Chapter 1 — Processes', 'Chương 1 — Tiến trình', 'Chương trình đang chạy là gì trong mắt nhân.', [
    ['tien-trinh', 'What a process is', 'Tiến trình là gì', '/proc · RSS vs VSZ · task_struct'],
    ['fork-exec', 'fork, exec, wait', 'fork, exec, wait', 'Copy-on-write · shell tí hon · zombie/orphan'],
    ['che-do', 'User/kernel mode', 'Chế độ user/kernel', 'Lệnh đặc quyền · giá syscall · strace'],
    ['vong-doi', 'States, signals, exit codes', 'Trạng thái, tín hiệu, mã thoát', 'R/S/D/T/Z · 128+N · exit 137'],
    ['pid1', 'PID 1 in containers', 'PID 1 trong container', 'docker stop 10s · tini · OOM 137'],
  ]],
  // ── Các chương dưới đây CÒN LÀ KHUNG (soạn theo _PROMPT-AGENT.md) ──
  ['Chapter 2 — Observing Linux day to day', 'Chương 2 — Quan sát Linux hằng ngày', 'Tiến trình nào ăn CPU, RAM, đĩa, IO, mạng — kể như những sự cố thật của chính dự án này.', [
    ['phuong-phap', 'The USE method and a triage reflex', 'Phương pháp USE và phản xạ phân loại sự cố', 'Triệu chứng → đo → nguyên nhân → sửa · bốn tài nguyên: CPU, bộ nhớ, đĩa, mạng · "chậm" không phải một chẩn đoán'],
    ['cpu', 'Who eats the CPU: top, htop, ps, load average', 'Ai ăn CPU: top, htop, ps, tải trung bình', 'Đọc năm dòng đầu của top · %us/%sy/%wa/%id · load average là hàng đợi, không phải phần trăm · pidstat · một lõi 100% vs mọi lõi'],
    ['bo-nho', 'Memory: free, available, and why "free" is near zero', 'Bộ nhớ: free, available, và vì sao "free" gần bằng 0', 'buff/cache · cột available mới là thật · /proc/meminfo · nhầm "hết RAM" với page cache · ps theo RSS'],
    ['dia-io', 'Disk full and slow I/O: df, du, iostat, iotop', 'Đầy đĩa và I/O chậm: df, du, iostat, iotop', 'Sự cố thật: cache build 7,6 GB giết Postgres · df vs du lệch vì file đã xoá còn mở (lsof +L1) · df -i cạn inode · %util, await'],
    ['mang-fd', 'Network and file descriptors: ss, lsof, /proc', 'Mạng và file descriptor: ss, lsof, /proc', 'ss thay netstat · ai giữ cổng · Too many open files · rò rỉ fd · kết nối TIME_WAIT'],
    ['nhat-ky', 'The logs the kernel keeps: journalctl, dmesg', 'Nhật ký của nhân: journalctl, dmesg', 'journalctl -k · dmesg tìm OOM/segfault/lỗi đĩa · Docker hung sau khi đầy đĩa · ghép log với lúc sự cố'],
  ]],
  ['Chapter 3 — Threads and CPU scheduling', 'Chương 3 — Luồng và lập lịch CPU', 'Nhiều việc chạy "cùng lúc" trên vài lõi — và ai được CPU, lúc nào.', [
    ['luong', 'Threads: what they share and what they do not', 'Luồng: chia sẻ gì và không chia sẻ gì', 'pthread · stack riêng, heap chung · luồng nhân vs người dùng · đo bằng /proc/<pid>/task'],
    ['lap-lich', 'Scheduling: FIFO, RR, MLFQ, CFS, EEVDF', 'Lập lịch: FIFO, RR, MLFQ, CFS, EEVDF', 'Thông lượng vs đáp ứng · CFS→EEVDF (Linux 6.6) · nice · mô phỏng lập lịch trong /os-lab'],
    ['context-switch', 'Context switches and their cost', 'Chuyển ngữ cảnh và cái giá của nó', 'perf stat, vmstat cs · quá nhiều luồng làm chậm · cache CPU bị xoá · đo thật'],
    ['da-loi', 'Multicore, affinity, NUMA and CPU limits', 'Đa lõi, affinity, NUMA và giới hạn CPU', 'taskset · CPU quota trong container và throttling · Java/Node đếm sai số lõi trong container'],
    ['event-loop', 'Event loop vs thread pool: Node and Spring Boot', 'Event loop vs thread pool: Node và Spring Boot', 'libuv · chặn event loop bằng việc nặng CPU · Tomcat pool · chọn mô hình'],
  ]],
  ['Chapter 4 — Writing concurrent programs', 'Chương 4 — Tự viết chương trình đồng thời', 'Bạn tự viết chương trình đồng thời và song song rồi đo tốc độ và cái giá.', [
    ['pthreads', 'C: pthreads and real parallelism', 'C: pthreads và song song thật', 'pthread_create/join · chia việc · đo speedup theo số lõi · định luật Amdahl'],
    ['java', 'Java: threads, ExecutorService, virtual threads', 'Java: luồng, ExecutorService, virtual threads', 'Thread pool · Future/CompletableFuture · virtual threads (Java 21) · đo throughput'],
    ['node', 'Node: event loop, worker_threads, cluster', 'Node: event loop, worker_threads, cluster', 'Vì sao một luồng · đẩy việc CPU ra worker · cluster theo số lõi · đo'],
    ['python', 'Python: the GIL, threads vs multiprocessing', 'Python: GIL, luồng vs multiprocessing', 'Vì sao luồng không chạy song song cho việc CPU · multiprocessing · asyncio cho I/O'],
    ['so-sanh', 'Measuring it: when parallel helps and when it hurts', 'Đo lại: khi nào song song giúp, khi nào hại', 'Việc CPU vs I/O · chi phí tạo/đồng bộ · bảng so bốn ngôn ngữ trên cùng bài toán'],
  ]],
  ['Chapter 5 — Synchronization: races and locks', 'Chương 5 — Đồng bộ: race và khoá', 'Hai luồng đụng cùng một dữ liệu.', [
    ['race', 'Race conditions you can reproduce', 'Race condition tái hiện được', 'counter++ không nguyên tử · chạy 1 triệu lần ra số sai · mô phỏng từng lệnh máy trong /os-lab'],
    ['mutex', 'Mutexes, spinlocks and condition variables', 'Mutex, spinlock và biến điều kiện', 'Vùng găng · futex · producer-consumer · synchronized/ReentrantLock'],
    ['semaphore', 'Semaphores, read-write locks, atomics and CAS', 'Semaphore, khoá đọc-ghi, nguyên tử và CAS', 'Giới hạn số người vào · RWLock · compare-and-swap · hiển thị bộ nhớ (memory visibility)'],
    ['backend', 'The same bugs in backend code', 'Chính các lỗi đó trong code backend', 'Đặt phòng trùng (double booking) · khoá dòng CSDL · khoá Redis · nối DBI202/PostgreSQL'],
  ]],
  ['Chapter 6 — Deadlock and classic problems', 'Chương 6 — Deadlock và các bài toán kinh điển', 'Khi mọi người cùng chờ nhau.', [
    ['deadlock', 'Deadlock: the four Coffman conditions', 'Deadlock: bốn điều kiện Coffman', 'Giữ-và-chờ, vòng chờ… · thứ tự khoá cố định · deadlock hai khoá trong /os-lab · deadlock trong PostgreSQL'],
    ['livelock', 'Livelock, starvation and priority inversion', 'Livelock, đói và đảo ngược ưu tiên', 'Mars Pathfinder nhìn lại · kế thừa ưu tiên · hàng đợi công bằng'],
    ['kinh-dien', 'Dining philosophers, readers-writers, bounded buffer', 'Triết gia ăn tối, đọc-ghi, bộ đệm giới hạn', 'Giải bằng Java và C · câu hỏi thi · nối sang phỏng vấn'],
    ['banker', "Detection and avoidance: Banker's algorithm", 'Phát hiện và tránh: thuật toán Banker', 'Trạng thái an toàn · ma trận cấp phát · dạng bài thi · vì sao thực tế ít dùng'],
  ]],
  ['Chapter 7 — Memory: virtual memory and paging', 'Chương 7 — Bộ nhớ: bộ nhớ ảo và phân trang', 'Mỗi tiến trình tưởng mình có cả bộ nhớ.', [
    ['khong-gian', 'Address spaces: stack, heap, code, mmap, ASLR', 'Không gian địa chỉ: stack, heap, code, mmap, ASLR', '/proc/<pid>/maps · stack overflow · RSS vs VSZ vs PSS · mô phỏng bố cục trong /os-lab'],
    ['phan-trang', 'Paging, page tables and the TLB', 'Phân trang, bảng trang và TLB', 'Trang 4KB · bảng trang nhiều cấp · TLB miss · huge pages và PostgreSQL · mô phỏng dịch địa chỉ'],
    ['page-fault', 'Page faults, demand paging, copy-on-write', 'Page fault, nạp trang theo yêu cầu, copy-on-write', 'Minor vs major fault · đo bằng perf/ps · fork của Redis nhân đôi bộ nhớ ra sao'],
    ['allocator', 'Allocators and garbage collectors', 'Bộ cấp phát và bộ gom rác', 'malloc, phân mảnh · V8 heap và --max-old-space-size · JVM G1/ZGC · rò rỉ bộ nhớ'],
  ]],
  ['Chapter 8 — Memory pressure: swap, cgroups, OOM', 'Chương 8 — Áp lực bộ nhớ: swap, cgroup, OOM', 'Khi RAM không đủ, nhân chọn ai phải chết.', [
    ['page-cache', 'Page cache and why "free" memory is near zero', 'Page cache và vì sao bộ nhớ "free" gần bằng 0', 'buff/cache · available vs free · nối Chương 2'],
    ['swap', 'Swap, swappiness and thrashing', 'Swap, swappiness và thrashing', 'Khi nào swap có ích · thrashing làm máy "treo" · thanh trượt áp lực RAM trong /os-lab · PSI'],
    ['oom', 'The OOM killer: how it picks a victim', 'OOM killer: nó chọn nạn nhân thế nào', 'oom_score, oom_score_adj · dmesg ghi gì · overcommit · bảo vệ PostgreSQL'],
    ['exit137', 'The exit-137 incident, measured', 'Sự cố exit 137, đo thật', 'next build bị giết trên VPS 6GB · hai build song song vượt RAM · sửa: build tuần tự/máy khác/giới hạn · memory.events'],
    ['gioi-han', 'Memory limits for Node, JVM and containers', 'Giới hạn bộ nhớ cho Node, JVM và container', 'docker --memory · -XX:MaxRAMPercentage · Node heap vs RSS · giới hạn quá chặt cũng gây sự cố'],
  ]],
  ['Chapter 9 — File systems and permissions', 'Chương 9 — Hệ thống file và quyền', 'Dữ liệu nằm trên đĩa thế nào, và khi nào nó thật sự an toàn.', [
    ['inode', 'Files, inodes, directories, links, fds', 'File, inode, thư mục, liên kết, fd', 'Tên chỉ là con trỏ tới inode · hard link vs symlink · bài học thật: bind-mount file theo inode nên mv vô tác dụng'],
    ['fsync', 'Buffering, fsync and durability', 'Đệm, fsync và độ bền', 'write() trả về chưa phải đã lên đĩa · fsync/fdatasync · "fsyncgate" PostgreSQL · ghi file an toàn: tạm → fsync → rename'],
    ['journaling', 'ext4, journaling and crash consistency', 'ext4, journaling và nhất quán khi sập', 'Journal ghi trước · data=ordered · copy-on-write (Btrfs/ZFS) · mất điện giữa lúc ghi'],
    ['quyen', 'Permissions, ownership, SUID, capabilities, ACL', 'Quyền, sở hữu, SUID, capabilities, ACL', 'rwx và bát phân · umask · sticky bit · SUID và vì sao nguy hiểm · capabilities thay root · nối Chương 13'],
  ]],
  ['Chapter 10 — I/O models', 'Chương 10 — Các mô hình I/O', 'Chờ đợi dữ liệu mà không lãng phí CPU — vì sao nginx và Node ôm được hàng nghìn kết nối.', [
    ['fd', 'File descriptors: everything is a file', 'File descriptor: mọi thứ là file', 'Bảng fd · ulimit -n và Too many open files · socket, pipe cũng là fd · rò rỉ fd'],
    ['blocking', 'Blocking, non-blocking, asynchronous', 'Chặn, không chặn, bất đồng bộ', 'read chặn luồng · O_NONBLOCK · bài toán C10K · thread-per-connection vs event loop'],
    ['epoll', 'select, poll, epoll and kqueue', 'select, poll, epoll và kqueue', 'Vì sao epoll mở rộng được · edge vs level triggered · viết một echo server epoll · libuv dùng gì'],
    ['io-uring', 'io_uring and zero-copy (sendfile)', 'io_uring và zero-copy (sendfile)', 'Hàng đợi chia sẻ với nhân · sendfile trong nginx · khi nào đáng dùng'],
  ]],
  ['Chapter 11 — System calls and the kernel boundary', 'Chương 11 — Lời gọi hệ thống và ranh giới nhân', 'Hành trình từ code của bạn vào nhân và trở ra.', [
    ['hanh-trinh', 'The user→kernel journey in detail', 'Hành trình user→kernel chi tiết', 'Lệnh syscall · bảng syscall · ngắt và trap · vDSO · nối Chương 1'],
    ['strace-ltrace', 'strace and ltrace in anger', 'strace và ltrace thực chiến', 'Theo dõi file một chương trình mở · tìm chỗ treo · chi phí của strace · ltrace cho lời gọi thư viện'],
    ['raw', 'Writing a raw syscall yourself', 'Tự viết một syscall trần', 'syscall() · không qua libc · errno · vì sao Go có runtime syscall riêng'],
    ['seccomp', 'Filtering syscalls with seccomp', 'Lọc syscall bằng seccomp', 'Bỏ bớt syscall một chương trình được gọi · hồ sơ seccomp của Docker · nối Chương 12 và 13'],
  ]],
  ['Chapter 12 — Containers from the kernel’s point of view', 'Chương 12 — Container nhìn từ nhân', 'Container không phải máy ảo — nó là tiến trình được rào lại.', [
    ['namespaces', 'Namespaces: pid, net, mnt, uts, ipc, user', 'Namespace: pid, net, mnt, uts, ipc, user', 'unshare tự dựng một "container" bằng tay · một tiến trình hai PID · nối linux-bash Ch14'],
    ['cgroups', 'cgroups v2: CPU, memory and I/O limits', 'cgroup v2: giới hạn CPU, bộ nhớ, I/O', 'cpu.max, memory.max, io.max · throttling đo được · nối Chương 3 và 8'],
    ['overlayfs', 'OverlayFS, capabilities and the image layers', 'OverlayFS, capabilities và các lớp ảnh', 'Lớp ảnh Docker trên đĩa · copy-on-write của overlay · bỏ bớt quyền root'],
    ['mini', 'Build a mini container by hand', 'Tự dựng một mini container bằng tay', 'namespace + cgroup + overlayfs + chroot/pivot_root · vì sao Docker Desktop trên Mac chạy một VM'],
  ]],
  ['Chapter 13 — Security at the OS layer', 'Chương 13 — Bảo mật ở tầng hệ điều hành', 'Hiểu bộ nhớ và quyền đủ sâu để mổ xẻ và phòng thủ — thuần phòng thủ, chỉ trên lab của bạn.', [
    ['bo-nho', 'Reading a binary: stack frames and calling convention', 'Đọc một tệp nhị phân: khung stack và quy ước gọi', 'objdump/gdb · thanh ghi · đọc một hàm trong mã máy · mô phỏng khung stack trong /os-lab'],
    ['overflow', 'Buffer overflow and its mitigations', 'Tràn bộ đệm và các lớp phòng vệ', 'Ghi đè địa chỉ trả về (minh hoạ) · ASLR, NX, stack canary, PIE, RELRO · vì sao mỗi lớp giúp gì'],
    ['leo-thang', 'Privilege escalation via SUID and misconfig', 'Leo thang đặc quyền qua SUID và cấu hình sai', 'SUID bị lạm dụng · TOCTOU race · rò thông tin qua /proc · quyền tối thiểu'],
    ['container-escape', 'Container escape basics and hardening', 'Nhập môn thoát container và cứng hoá', 'Vì sao mount docker.sock là trao root · capabilities, seccomp, user namespace · nối cloud-container-security'],
  ]],
  ['Chapter 14 — Windows and macOS for developers', 'Chương 14 — Windows và macOS cho lập trình viên', 'Cùng kỹ năng, ba hệ điều hành.', [
    ['nhan', 'Three kernels: Linux, NT and XNU', 'Ba nhân: Linux, NT và XNU', 'Monolithic vs hybrid · lịch sử NT (Cutler) và XNU (Mach+BSD) · cái gì giống, cái gì khác'],
    ['cong-cu', 'launchd vs systemd, Task Manager vs top', 'launchd vs systemd, Task Manager vs top', 'Quản lý dịch vụ · xem tiến trình/bộ nhớ · Activity Monitor · perfmon'],
    ['wsl', 'WSL2 and PowerShell vs Bash', 'WSL2 và PowerShell vs Bash', 'WSL2 là một VM Linux thật · đối tượng vs văn bản trong ống dẫn · bảng tương đương'],
    ['cross', 'File systems and cross-platform code', 'Hệ thống file và code đa nền', 'NTFS/APFS/ext4 · quyền khác nhau · brew/winget/apt · CRLF · viết code chạy cả ba'],
  ]],
  ['Chapter 15 — Observing and tuning the OS', 'Chương 15 — Quan sát và tinh chỉnh hệ điều hành', 'Thấy được nhân đang làm gì với chương trình của bạn.', [
    ['perf', 'perf and flame graphs', 'perf và flame graph', 'Lấy mẫu CPU · flame graph cho Node và Java · tìm hàm nóng · giới hạn của perf trên Docker Desktop'],
    ['ebpf', 'eBPF and bpftrace', 'eBPF và bpftrace', 'Chạy chương trình nhỏ trong nhân an toàn · execsnoop, opensnoop, biolatency · nối phương pháp USE'],
    ['sysctl', 'sysctl: kernel tunables worth knowing', 'sysctl: tham số nhân nên biết', 'vm.overcommit_memory, vm.swappiness · fs.file-max · net.core.somaxconn · đừng chỉnh khi chưa đo'],
    ['phuong-phap', 'A tuning method: measure, change one thing, measure', 'Một phương pháp tinh chỉnh: đo, đổi một thứ, đo lại', 'Chống "chỉnh theo blog" · baseline · một biến một lần · ghi lại'],
  ]],
  ['Chapter 16 — OS in exams and interviews', 'Chương 16 — Hệ điều hành trong thi cử và phỏng vấn', 'Câu hỏi OS kinh điển và cách trả lời bằng thí nghiệm.', [
    ['cau-hoi', 'Classic interview questions, answered with measurements', 'Câu hỏi phỏng vấn kinh điển, trả lời kèm số đo', 'Tiến trình vs luồng · deadlock · bộ nhớ ảo · điều gì xảy ra khi gọi malloc · exit 137'],
    ['bai-tap', 'University OS exam patterns (OSG202)', 'Dạng bài thi môn OS (OSG202)', 'Gantt lập lịch · thay trang FIFO/LRU/OPT · Banker · semaphore · trỏ sang OSG202'],
    ['su-co', 'Production incidents that were really OS problems', 'Sự cố production thật ra là vấn đề hệ điều hành', 'Giây nhuận 30/06/2012 · Dirty COW (2016) · cạn fd/PID, đầy đĩa · cách kể trong phỏng vấn'],
  ]],
  ['Chapter 17 — Capstone: diagnose and build', 'Chương 17 — Dự án cuối khoá: chẩn đoán và dựng', 'Dựng một shell tí hon + một máy chủ HTTP có thread pool, rồi chẩn đoán một sự cố được cài sẵn.', [
    ['shell', 'Build a mini shell', 'Dựng một shell tí hon', 'fork/exec/wait · ống dẫn · chuyển hướng · job control · dựa trên ctsh.c của Chương 1'],
    ['server', 'A tiny thread-pool HTTP server', 'Một máy chủ HTTP có thread pool', 'epoll hoặc thread pool · giới hạn kết nối · tắt êm (SIGTERM) · đo throughput'],
    ['chan-doan', 'Diagnose a planted performance incident', 'Chẩn đoán một sự cố hiệu năng cài sẵn', 'OOM, rò fd, event loop bị chặn, tranh chấp khoá · thu bằng chứng: dmesg, /proc, strace, perf'],
    ['bao-cao', 'Write the postmortem and your interview story', 'Viết báo cáo sự cố và câu chuyện phỏng vấn', 'Mẫu postmortem không đổ lỗi · checklist cả khoá · kể lại trong phỏng vấn'],
  ]],
]);

// Ghi đè hai section KHUNG bằng hai section THẬT đã soạn (giữ nguyên slug bài + title chương để seeder neo đúng).
sections[0] = s00;
sections[1] = s01;
sections[2] = s02;
sections[3] = s03;
sections[5] = s05;
sections[7] = s07;
sections[6] = s06;
sections[8] = s08;
sections[9] = s09;
sections[10] = s10;
sections[11] = s11;
sections[12] = s12;
sections[13] = s13;
sections[14] = s14;

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
    shortDescription: 'See the operating system work: processes and threads, CPU scheduling, race conditions and deadlock, virtual memory and the OOM killer, file systems, system calls, and containers — with interactive simulators and real measurements you run yourself on Linux.|||Nhìn thấy hệ điều hành làm việc: tiến trình và luồng, lập lịch CPU, race condition và deadlock, bộ nhớ ảo và OOM killer, hệ thống file, lời gọi hệ thống, và container — với mô phỏng tương tác và số đo thật bạn tự chạy trên Linux.',
    description: 'Khoá hệ điều hành cho lập trình viên — môn OS của trường đại học, nhưng mọi khái niệm đều nối về code bạn viết hằng ngày, có thể THẤY bằng mô phỏng tương tác (/os-lab) và ĐO thật trong một phòng lab Linux. Tiến trình, luồng và lập lịch CPU; tự viết chương trình đồng thời bằng C/Java/Node/Python; race condition, mutex, semaphore và deadlock; bộ nhớ ảo, phân trang, page fault, swap và OOM killer (exit 137 đo thật); hệ thống file, fsync và quyền; lời gọi hệ thống; các mô hình I/O (epoll, io_uring); container nhìn từ nhân (namespace, cgroup); bảo mật ở tầng hệ điều hành (phòng thủ); và Windows/macOS cho lập trình viên. Dự án cuối: dựng một shell và một máy chủ nhỏ, rồi chẩn đoán một sự cố hiệu năng được cài sẵn — đúng kiểu sự cố thật của hạ tầng cuongthai.com.',
    whatYouLearn: 'Giải thích tiến trình, luồng, lập lịch và bộ nhớ ảo bằng ví dụ đo được và mô phỏng nhìn được; đọc /proc, strace, perf, vmstat để biết chương trình đang làm gì; tự viết và đo chương trình đồng thời; phát hiện và sửa race condition, deadlock; hiểu vì sao Node dùng một luồng + event loop còn Java dùng thread pool; hiểu fsync và độ bền dữ liệu; giải thích container là gì ở mức nhân; chẩn đoán exit 137/OOM, rò rỉ bộ nhớ, cạn file descriptor, đầy đĩa; đọc bố cục bộ nhớ đủ để hiểu tràn bộ đệm và các lớp phòng vệ; và trả lời câu hỏi OS trong phỏng vấn và môn học.',
    requirements: 'Lập trình được một ngôn ngữ (C, Java hoặc JavaScript), dùng terminal Linux cơ bản, và cài được Docker Desktop (Mac/Windows/Linux). Nên học trước Linux & Bash. Biết chút C là lợi thế nhưng không bắt buộc — Mục 0 dạy vừa đủ.',
    documentsNote: 'Tài liệu chính: "Operating Systems: Three Easy Pieces" (Arpaci-Dusseau, miễn phí tại pages.cs.wisc.edu/~remzi/OSTEP) • "Operating System Concepts" (Silberschatz, Galvin, Gagne) • "The Linux Programming Interface" (Michael Kerrisk) • man7.org/linux/man-pages • kernel.org/doc/html/latest • "Systems Performance" (Brendan Gregg) và brendangregg.com. Phòng lab trực quan đi kèm: /os-lab.',
  },
  sections,
};
