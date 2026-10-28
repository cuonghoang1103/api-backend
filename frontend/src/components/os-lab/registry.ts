/**
 * Danh mục mô phỏng của OS Visual Lab. Bài học nhúng bằng một <div class="os-lab os-lab-sim-<tên> os-lab-p-<preset>">
 * (xem content/courses/operating-systems-for-developers/_lab.mjs — hai danh sách PHẢI khớp nhau; bộ dựng nội dung
 * ném lỗi khi gặp tên lạ). Chỉ tên trong danh mục này mới được gắn: nội dung bài KHÔNG chạy được mã tuỳ ý.
 */
import type { ComponentType } from 'react';
import type { Lang } from './ui';

export interface OsLabDef {
  en: string; vi: string; descEn: string; descVi: string; chapterEn: string; chapterVi: string;
  presets: string[];
  load: () => Promise<{ default: ComponentType<{ lang?: Lang; preset?: string }> }>;
}

export const OS_LABS: Record<string, OsLabDef> = {
  process: {
    en: 'Processes: tree & states', vi: 'Tiến trình: cây & trạng thái', chapterEn: 'Chapter 1', chapterVi: 'Chương 1',
    descEn: 'fork, exec, wait, exit; zombies, orphans, exit 137, threads — with live ps output.',
    descVi: 'fork, exec, wait, exit; zombie, mồ côi, exit 137, luồng — kèm output ps tại từng bước.',
    presets: ['shell', 'zombie', 'orphan', 'fork3', 'oom137', 'threads', 'sandbox'],
    load: () => import('./ProcessSim'),
  },
  scheduler: {
    en: 'CPU scheduling', vi: 'Lập lịch CPU', chapterEn: 'Chapter 3', chapterVi: 'Chương 3',
    descEn: 'FCFS, SJF, SRTF, RR, priority, MLFQ, CFS on 1–4 cores, Gantt chart and waiting/turnaround/response.',
    descVi: 'FCFS, SJF, SRTF, RR, ưu tiên, MLFQ, CFS trên 1–4 lõi, sơ đồ Gantt và thời gian chờ/hoàn thành/đáp ứng.',
    presets: ['textbook', 'convoy', 'rr', 'interactive', 'multicore', 'nice'],
    load: () => import('./SchedulerSim'),
  },
  race: {
    en: 'Race conditions & deadlock', vi: 'Race condition & deadlock', chapterEn: 'Chapters 5–6', chapterVi: 'Chương 5–6',
    descEn: 'counter++ as load/add/store, interleaved instruction by instruction; mutex, atomics; deadlock with two locks.',
    descVi: 'counter++ là nạp/cộng/ghi, xen kẽ từng lệnh máy; mutex, nguyên tử; deadlock với hai khoá.',
    presets: ['none', 'mutex', 'atomic', 'deadlock', 'ordered'],
    load: () => import('./RaceSim'),
  },
  memory: {
    en: 'Process memory layout', vi: 'Bố cục bộ nhớ tiến trình', chapterEn: 'Chapters 7 & 13', chapterVi: 'Chương 7 & 13',
    descEn: 'text/data/bss/heap/mmap/stack with ASLR; stack frames, canaries and what a buffer overflow overwrites.',
    descVi: 'text/data/bss/heap/mmap/stack với ASLR; khung stack, canary và tràn bộ đệm ghi đè lên cái gì.',
    presets: ['layout', 'stack', 'overflow'],
    load: () => import('./MemoryLayoutSim'),
  },
  vm: {
    en: 'Virtual memory & thrashing', vi: 'Bộ nhớ ảo & thrashing', chapterEn: 'Chapters 7–8', chapterVi: 'Chương 7–8',
    descEn: 'Address → TLB → page table → frame, page faults, FIFO/LRU/OPT/Clock, and a RAM-pressure slider.',
    descVi: 'Địa chỉ → TLB → bảng trang → khung, lỗi trang, FIFO/LRU/OPT/Clock, và thanh trượt thiếu RAM.',
    presets: ['program', 'walk', 'pressure', 'exam', 'belady', 'loop'],
    load: () => import('./VirtualMemorySim'),
  },
  sysmon: {
    en: 'System monitor: read top/htop', vi: 'Phòng máy: đọc top/htop', chapterEn: 'Chapter 2', chapterVi: 'Chương 2',
    descEn: 'A live Linux box: load vs cores, us/sy/wa, free vs available, df, iowait. Inject a CPU hog, leak, full disk, I/O storm, fork bomb or zombies — then diagnose and fix it.',
    descVi: 'Một máy Linux chạy thật: load so với số lõi, us/sy/wa, free vs available, df, iowait. Bơm sự cố chiếm CPU, rò bộ nhớ, đầy đĩa, bão I/O, fork bomb, zombie — rồi chẩn đoán và sửa.',
    presets: ['calm', 'cpuhog', 'memleak', 'diskfull', 'iostorm', 'forkbomb', 'zombies', 'mystery'],
    load: () => import('./SysmonSim'),
  },
  eventloop: {
    en: 'Node.js event loop', vi: 'Event loop của Node.js', chapterEn: 'Chapters 3, 5 & 10', chapterVi: 'Chương 3, 5 & 10',
    descEn: 'Call stack, nextTick and microtask queues, timers/poll/check, the libuv thread pool and epoll; a slow callback blocks everyone; a race across await.',
    descVi: 'Call stack, hàng nextTick và microtask, timers/poll/check, thread pool của libuv và epoll; một callback chậm chặn tất cả; race qua await.',
    presets: ['order', 'block', 'offload', 'pool', 'race', 'racelock'],
    load: () => import('./EventLoopSim'),
  },
  threadpool: {
    en: "Thread pools & Little's law", vi: 'Thread pool & định luật Little', chapterEn: 'Chapter 3', chapterVi: 'Chương 3',
    descEn: 'Arrivals, N workers, cores, a DB pool, queue, timeouts; throughput and p99 curves, the knee, virtual threads; checked against M/M/1 and Erlang C.',
    descVi: 'Request đến, N worker, lõi, pool CSDL, hàng đợi, timeout; đường cong thông lượng và p99, khúc gãy, virtual thread; đối chiếu M/M/1 và Erlang C.',
    presets: ['healthy', 'overload', 'timeout', 'dbpool', 'virtual', 'mm1'],
    load: () => import('./ThreadPoolSim'),
  },
  sync: {
    en: 'Semaphores & condition variables', vi: 'Semaphore & biến điều kiện', chapterEn: 'Chapter 5', chapterVi: 'Chương 5',
    descEn: 'An N-slot semaphore pool (and a leaked permit), producer–consumer with if vs while (stolen and spurious wakeups), readers–writers and writer starvation.',
    descVi: 'Pool semaphore N chỗ (và một chỗ bị rò), producer–consumer với if vs while (đánh thức bị cướp, đánh thức giả), readers–writers và người ghi bị đói.',
    presets: ['semaphore', 'leak', 'pcif', 'pcwhile', 'readers', 'writerpref'],
    load: () => import('./SyncSim'),
  },
  deadlock: {
    en: 'Deadlock lab', vi: 'Phòng lab deadlock', chapterEn: 'Chapter 6', chapterVi: 'Chương 6',
    descEn: "Banker's algorithm step by step, detection with multi-instance resources, dining philosophers in 4 modes, priority inversion (Mars Pathfinder).",
    descVi: 'Thuật toán Banker từng bước, phát hiện deadlock với tài nguyên nhiều bản, triết gia ăn tối 4 chế độ, đảo ngược ưu tiên (Mars Pathfinder).',
    presets: ['banker', 'request', 'detect', 'cycle', 'pool', 'philosophers', 'inversion'],
    load: () => import('./DeadlockSim'),
  },
  cgroup: {
    en: 'cgroups: memory & CPU limits', vi: 'cgroup: giới hạn bộ nhớ & CPU', chapterEn: 'Chapters 8 & 12', chapterVi: 'Chương 8 & 12',
    descEn: 'memory.high vs memory.max: reclaim, throttling, OOM kill and exit 137 on a timeline; page cache is not a leak; cpu.max quota throttling every 100 ms.',
    descVi: 'memory.high vs memory.max: thu hồi, throttle, OOM kill và mã 137 trên dòng thời gian; page cache không phải rò rỉ; throttle quota cpu.max mỗi 100 ms.',
    presets: ['oom', 'high', 'cache', 'swap', 'restart', 'cpuquota', 'cputhreads'],
    load: () => import('./CgroupSim'),
  },
  cow: {
    en: 'Copy-on-write after fork()', vi: 'Copy-on-write sau fork()', chapterEn: 'Chapter 7', chapterVi: 'Chương 7',
    descEn: 'Parent and child page tables share frames; a write faults and copies one page; exec copies nothing; how much RAM a Redis BGSAVE costs, 4 KiB vs 2 MiB pages.',
    descVi: 'Bảng trang cha và con dùng chung khung; ghi là lỗi trang và chép một trang; exec không chép gì; Redis BGSAVE tốn bao nhiêu RAM, trang 4 KiB vs 2 MiB.',
    presets: ['fork', 'exec', 'bgsave', 'hugepage'],
    load: () => import('./CowSim'),
  },
  pagecache: {
    en: 'Page cache & read-ahead', vi: 'Page cache & read-ahead', chapterEn: 'Chapters 8–9', chapterVi: 'Chương 8–9',
    descEn: 'Sequential vs random reads of a cold or warm file, read-ahead windows 4→32 pages, read() copies vs mmap() minor faults, LRU flooded by a big loop.',
    descVi: 'Đọc tuần tự vs ngẫu nhiên một file nguội hay ấm, cửa sổ read-ahead 4→32 trang, read() chép vs mmap() lỗi trang minor, LRU bị vòng lặp lớn làm lụt.',
    presets: ['seq', 'random', 'warm', 'mmap', 'lru'],
    load: () => import('./PageCacheSim'),
  },
  syscall: {
    en: 'The journey of a system call', vi: 'Hành trình một lời gọi hệ thống', chapterEn: 'Chapter 11', chapterVi: 'Chương 11',
    descEn: 'Your code → libc → svc/syscall trap → syscall table → handler → driver → back with bytes or −errno, with the measured price of every hop; vDSO, batching, strace, seccomp.',
    descVi: 'Mã của bạn → libc → bẫy svc/syscall → bảng syscall → hàm xử lý → driver → quay về với số byte hoặc −errno, kèm giá đo thật của từng chặng; vDSO, gom lời gọi, strace, seccomp.',
    presets: ['write', 'fail', 'vdso', 'batch', 'strace', 'seccomp'],
    load: () => import('./SyscallSim'),
  },
  perm: {
    en: 'Permission room: can user X do Y?', vi: 'Phòng quyền: người X làm được Y không?', chapterEn: 'Chapter 9', chapterVi: 'Chương 9',
    descEn: 'rwx and owner/group/other checked one rule at a time; directory x and w, delete vs sticky (EPERM), setuid/setgid, umask, capabilities and the ACL mask trap.',
    descVi: 'rwx và chủ/nhóm/other được kiểm từng luật một; x và w của thư mục, xoá và sticky (EPERM), setuid/setgid, umask, capability và cái bẫy mask của ACL.',
    presets: ['owner', 'dirx', 'sticky', 'setgid', 'setuid', 'caps', 'acl'],
    load: () => import('./PermSim'),
  },
  fdtable: {
    en: 'File descriptors, open files and inodes', vi: 'fd, tệp đang mở và inode', chapterEn: 'Chapter 9', chapterVi: 'Chương 9',
    descEn: 'fd table → open file description (offset, flags) → inode ← names. Two open()s overwrite each other, dup/fork share an offset, O_APPEND, deleted-but-open files, EMFILE, 2>&1 order.',
    descVi: 'Bảng fd → mô tả file mở (offset, cờ) → inode ← tên. Hai lần open() ghi đè nhau, dup/fork chung offset, O_APPEND, tệp đã xoá mà còn mở, EMFILE, thứ tự 2>&1.',
    presets: ['twice', 'dup', 'append', 'fork', 'deleted', 'emfile', 'links', 'redirect'],
    load: () => import('./FdTableSim'),
  },
  nslayers: {
    en: 'Namespaces: one process, two views', vi: 'Namespace: một tiến trình, hai góc nhìn', chapterEn: 'Chapter 12', chapterVi: 'Chương 12',
    descEn: 'The same process seen from the host and from inside a container; switch pid, mnt, net, uts, ipc, user, cgroup, time on one by one. unshare traps, uid_map, and a Kubernetes pod with pause.',
    descVi: 'Cùng một tiến trình nhìn từ máy chủ và từ trong container; bật từng namespace pid, mnt, net, uts, ipc, user, cgroup, time. Bẫy của unshare, uid_map, và pod Kubernetes với pause.',
    presets: ['docker', 'unshare', 'userns', 'pod'],
    load: () => import('./NsSim'),
  },
  overlay: {
    en: 'OverlayFS: image layers', vi: 'OverlayFS: các lớp image', chapterEn: 'Chapter 12', chapterVi: 'Chương 12',
    descEn: 'lowerdirs, upperdir and the merged view; copy-up of a 200 MB file (0.93 s), whiteouts, opaque directories, 13 + 1 image layers, docker diff, and which build steps a one-file change rebuilds.',
    descVi: 'lowerdir, upperdir và góc nhìn merged; copy-up tệp 200 MB (0,93 s), whiteout, thư mục opaque, 13 + 1 lớp image, docker diff, và đổi một tệp thì bước build nào phải dựng lại.',
    presets: ['layers', 'copyup', 'whiteout', 'opaque', 'image', 'cache'],
    load: () => import('./OverlaySim'),
  },
  latency: {
    en: 'Latency ladder', vi: 'Thang độ trễ', chapterEn: 'Section 0', chapterVi: 'Mục 0',
    descEn: 'Registers → caches → RAM → SSD → disk → network, on a human time scale.',
    descVi: 'Thanh ghi → cache → RAM → SSD → đĩa → mạng, theo thang thời gian con người.',
    presets: ['default'],
    load: () => import('./LatencyLadder'),
  },
};

export const isLab = (name: string) => Object.prototype.hasOwnProperty.call(OS_LABS, name);
