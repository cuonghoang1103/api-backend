/**
 * "Cùng khái niệm, ba hệ điều hành" (Chương 14, đợt mô phỏng #4): mỗi thẻ một khái niệm, mỗi hệ một tên + một lệnh + một
 * dòng output. Linux và macOS: dòng output CHÉP NGUYÊN từ lab/out/c14x (src = tệp; osmap.test.ts kiểm từng dòng có thật
 * trong tệp đó). Windows: KHÔNG chạy trong lab — ghi nhãn "theo tài liệu" (src = 'doc'), không có số đo.
 */
export type OsKey = 'linux' | 'mac' | 'win';
export const OS_KEYS: OsKey[] = ['linux', 'mac', 'win'];
export const OS_LABEL: Record<OsKey, string> = { linux: 'Linux', mac: 'macOS', win: 'Windows' };
export interface OsCell { name: string; cmd: string; out: string; src: string; noteEn?: string; noteVi?: string }
export interface OsCard { id: string; en: string; vi: string; whyEn: string; whyVi: string; os: Record<OsKey, OsCell> }

const doc = (name: string, cmd: string, out: string, noteEn?: string, noteVi?: string): OsCell => ({ name, cmd, out, src: 'doc', noteEn, noteVi });

export const OS_CARDS: OsCard[] = [
  {
    id: 'kernel', en: 'The kernel', vi: 'Nhân',
    whyEn: 'Three different kernels: monolithic Linux, hybrid XNU (Mach + BSD), hybrid NT. Docker on a Mac runs a real Linux kernel inside a small VM.',
    whyVi: 'Ba nhân khác nhau: Linux nguyên khối, XNU lai (Mach + BSD), NT lai. Docker trên Mac chạy một nhân Linux thật trong một máy ảo nhỏ.',
    os: {
      linux: { name: 'Linux (linuxkit VM)', cmd: 'uname -srm', out: 'Linux 7.0.12-linuxkit aarch64', src: 'c141-lx' },
      mac: { name: 'XNU (Darwin)', cmd: 'uname -srm', out: 'Darwin 27.0.0 arm64', src: 'c141-mac' },
      win: doc('NT kernel (ntoskrnl.exe)', 'ver', 'Microsoft Windows [Version 10.0.<build>]'),
    },
  },
  {
    id: 'syscall', en: 'System-call numbers', vi: 'Số hiệu lời gọi hệ thống',
    whyEn: 'write is number 64 on Linux arm64 and 4 on macOS. Windows does not publish its numbers at all: programs call ntdll.dll and the numbers change between builds.',
    whyVi: 'write là số 64 trên Linux arm64 và số 4 trên macOS. Windows không công bố số hiệu: chương trình gọi qua ntdll.dll và số hiệu đổi giữa các bản build.',
    os: {
      linux: { name: '__NR_write', cmd: "grep __NR_write unistd.h", out: '#define __NR_write 64', src: 'c141-lx' },
      mac: { name: 'SYS_write', cmd: "grep SYS_write sys/syscall.h", out: '#define	SYS_write          4', src: 'c141-mac' },
      win: doc('NtWriteFile (ntdll.dll)', 'dumpbin /exports ntdll.dll', 'NtWriteFile — number not documented, changes per build'),
    },
  },
  {
    id: 'pid1', en: 'PID 1 — the first process', vi: 'PID 1 — tiến trình đầu tiên',
    whyEn: 'Linux distros run systemd (Docker Desktop\'s VM runs a tiny initd); macOS runs launchd; Windows has no PID 1 — "System" is PID 4, then smss.exe → wininit.exe → services.exe.',
    whyVi: 'Bản phân phối Linux chạy systemd (máy ảo của Docker Desktop chạy initd nhỏ); macOS chạy launchd; Windows không có PID 1 — "System" là PID 4, rồi smss.exe → wininit.exe → services.exe.',
    os: {
      linux: { name: 'initd / systemd', cmd: 'ps -o pid,ppid,comm -p 1', out: '    1     0 initd', src: 'c141-mac' },
      mac: { name: 'launchd', cmd: 'ps -o pid,ppid,user,comm -p 1', out: '    1     0 root /sbin/launchd', src: 'c141-mac' },
      win: doc('System (4) → smss.exe → services.exe', 'Get-Process -Id 4', 'Id 4  ProcessName System'),
    },
  },
  {
    id: 'spawn', en: 'Starting a process', vi: 'Khởi động tiến trình',
    whyEn: 'fork copies the parent\'s page tables — 5 ms when it has touched 512 MiB; posix_spawn/vfork do not. Windows has no fork at all: CreateProcess builds a new process from scratch.',
    whyVi: 'fork chép bảng trang của cha — 5 ms khi cha đã chạm 512 MiB; posix_spawn/vfork thì không. Windows không có fork: CreateProcess dựng tiến trình mới từ đầu.',
    os: {
      linux: { name: 'fork + exec / posix_spawn', cmd: 'spawn 300 512', out: 'parent touched  512 MiB | fork+exec  5202.1 us | vfork+exec   212.4 us | posix_spawn   222.9 us', src: 'c142-lx' },
      mac: { name: 'posix_spawn (fork discouraged)', cmd: 'spawn 300 512', out: 'parent touched  512 MiB | fork+exec  2223.0 us | vfork+exec  2235.4 us | posix_spawn  1504.2 us', src: 'c142-mac', noteEn: 'busy machine: load 18', noteVi: 'máy đang bận: load 18' },
      win: doc('CreateProcess', 'Start-Process', 'no fork(): the child never shares the parent\'s memory'),
    },
  },
  {
    id: 'signal', en: 'Signals and exit codes', vi: 'Tín hiệu và mã thoát',
    whyEn: 'The same signal has different numbers: SIGUSR1 is 10 on Linux (exit 138) and 30 on macOS (exit 158); exit 138 on a Mac means SIGBUS. Windows has no signals: console control events (Ctrl+C, close) run on a NEW thread, then TerminateProcess.',
    whyVi: 'Cùng một tín hiệu mà khác số: SIGUSR1 là 10 trên Linux (thoát 138) và 30 trên macOS (thoát 158); thoát 138 trên Mac lại là SIGBUS. Windows không có tín hiệu: sự kiện điều khiển console (Ctrl+C, đóng cửa sổ) chạy trên một luồng MỚI, rồi TerminateProcess.',
    os: {
      linux: { name: 'SIGUSR1 = 10', cmd: "sh -c 'kill -USR1 $$'; echo \"exit=$?\"", out: 'exit=138', src: 'c142-lx' },
      mac: { name: 'SIGUSR1 = 30', cmd: "sh -c 'kill -USR1 $$'; echo \"exit=$?\"", out: 'exit=158', src: 'c142-mac' },
      win: doc('CTRL_C_EVENT / CTRL_CLOSE_EVENT', 'SetConsoleCtrlHandler', 'handler runs on a new thread; ~5 s on close, then TerminateProcess'),
    },
  },
  {
    id: 'service', en: 'Background services', vi: 'Dịch vụ chạy nền',
    whyEn: 'systemd units, launchd property lists, the Windows Service Control Manager: same idea — start at boot, restart on failure, run on a schedule.',
    whyVi: 'Unit của systemd, property list của launchd, Service Control Manager của Windows: cùng một ý — chạy khi khởi động, chạy lại khi hỏng, chạy theo lịch.',
    os: {
      linux: doc('systemd unit (.service)', 'systemctl status nginx', 'Active: active (running)', 'the lab container has no systemd', 'container của lab không có systemd'),
      mac: { name: 'launchd plist', cmd: 'launchctl print system/com.apple.newsyslog', out: '	runs = 110', src: 'c143-mac' },
      win: doc('Windows service (SCM)', 'Get-Service Spooler', 'Status Running  Name Spooler'),
    },
  },
  {
    id: 'log', en: 'System log', vi: 'Nhật ký hệ thống',
    whyEn: 'journald (journalctl), the macOS unified log (log show), the Windows Event Log (Get-WinEvent): all three are structured binary stores, not plain text files.',
    whyVi: 'journald (journalctl), unified log của macOS (log show), Event Log của Windows (Get-WinEvent): cả ba là kho nhị phân có cấu trúc, không phải tệp chữ thường.',
    os: {
      linux: doc('journald', 'journalctl -u nginx --since -1h', '<timestamp> host nginx[123]: …', 'the lab container has no journald', 'container của lab không có journald'),
      mac: { name: 'unified log', cmd: 'log show --predicate …', out: '2026-10-29 01:03:58.609 Df logger[46447:763b13f] hello from chapter 14', src: 'c143-mac' },
      win: doc('Event Log', 'Get-WinEvent -LogName System -MaxEvents 1', 'TimeCreated  Id  LevelDisplayName  Message'),
    },
  },
  {
    id: 'freemem', en: '"How much RAM is free?"', vi: '"Còn bao nhiêu RAM?"',
    whyEn: 'Linux: read "available", not "free" (page cache is reclaimable). macOS: "unused" is tiny because the compressor and caches use everything — watch memory pressure instead. Windows: "Available" in Task Manager.',
    whyVi: 'Linux: đọc "available", đừng đọc "free" (page cache thu hồi được). macOS: "unused" luôn nhỏ vì compressor và cache dùng hết — hãy nhìn memory pressure. Windows: "Available" trong Task Manager.',
    os: {
      linux: { name: 'available', cmd: 'free -m', out: 'Mem:            7934        3327        2054         156        2907        4606', src: 'c144-lx' },
      mac: { name: 'memory pressure', cmd: 'memory_pressure | tail -1', out: 'System-wide memory free percentage: 57%', src: 'c144-mac', noteEn: 'while "PhysMem … 1086M unused"', noteVi: 'trong khi "PhysMem … 1086M unused"' },
      win: doc('Available / Standby', 'Get-Counter "\\Memory\\Available MBytes"', 'Available MBytes …'),
    },
  },
  {
    id: 'overcommit', en: 'Promising more memory than exists', vi: 'Hứa nhiều bộ nhớ hơn mức có',
    whyEn: 'Linux overcommits: Committed_AS can exceed CommitLimit; the OOM killer settles it later (exit 137). macOS compresses (1.72×) and grows swap files. Windows refuses: commit charge may never pass RAM + pagefile, so malloc fails while RAM is still free.',
    whyVi: 'Linux hứa vượt: Committed_AS có thể lớn hơn CommitLimit; OOM killer giải quyết sau (thoát 137). macOS nén (1,72×) và cho tệp swap mọc thêm. Windows từ chối: commit charge không được vượt RAM + pagefile, nên malloc hỏng trong khi RAM vẫn còn trống.',
    os: {
      linux: { name: 'overcommit', cmd: 'grep Commit /proc/meminfo', out: 'Committed_AS:    5256044 kB', src: 'c144-lx', noteEn: '> CommitLimit 5 110 828 kB', noteVi: '> CommitLimit 5 110 828 kB' },
      mac: { name: 'compressor', cmd: 'vm_stat | awk …', out: 'compressor holds 16.9 GiB of data in 9.8 GiB of RAM (ratio 1.72)', src: 'c144-mac' },
      win: doc('commit limit = RAM + pagefile', 'Task Manager → Committed', 'Committed 31.8/32.0 GB → allocation fails'),
    },
  },
  {
    id: 'swap', en: 'Swap', vi: 'Swap',
    whyEn: 'A fixed swap area on Linux, swap files that appear on demand on macOS (13 of them here), pagefile.sys that grows on Windows.',
    whyVi: 'Vùng swap cố định trên Linux, tệp swap tự sinh khi cần trên macOS (ở đây 13 tệp), pagefile.sys tự nở trên Windows.',
    os: {
      linux: { name: 'swap partition / file', cmd: 'free -m', out: 'Swap:           1023           0        1023', src: 'c144-lx' },
      mac: { name: '/System/Volumes/VM/swapfileN', cmd: 'sysctl vm.swapusage', out: 'vm.swapusage: total = 13312.00M  used = 12149.12M  free = 1162.88M  (encrypted)', src: 'c144-mac' },
      win: doc('pagefile.sys', 'Get-CimInstance Win32_PageFileUsage', 'AllocatedBaseSize … CurrentUsage …'),
    },
  },
  {
    id: 'page', en: 'Page size', vi: 'Cỡ trang',
    whyEn: '4 KiB on Linux and Windows, 16 KiB on Apple Silicon macOS — and the same Mac runs 4 KiB pages inside the Docker VM.',
    whyVi: '4 KiB trên Linux và Windows, 16 KiB trên macOS chip Apple — và chính chiếc Mac đó chạy trang 4 KiB bên trong máy ảo Docker.',
    os: {
      linux: { name: '4 KiB', cmd: 'getconf PAGESIZE', out: '4096', src: 'c141-mac' },
      mac: { name: '16 KiB', cmd: 'sysctl hw.pagesize', out: 'hw.pagesize: 16384', src: 'c141-mac' },
      win: doc('4 KiB', 'GetSystemInfo().dwPageSize', '4096'),
    },
  },
  {
    id: 'case', en: 'Upper/lower case in file names', vi: 'Chữ hoa/thường trong tên tệp',
    whyEn: 'Linux keeps README.md and Readme.md as two files. APFS and NTFS (by default) treat them as one — code that works on your Mac can break on the Linux server.',
    whyVi: 'Linux giữ README.md và Readme.md là hai tệp. APFS và NTFS (mặc định) coi là một — mã chạy được trên Mac có thể gãy trên máy chủ Linux.',
    os: {
      linux: { name: 'case-sensitive', cmd: 'touch Readme.md README.md && ls *.md', out: 'Readme.md', src: 'c145-lx', noteEn: 'and README.md: two files', noteVi: 'và README.md: hai tệp' },
      mac: { name: 'case-insensitive (APFS)', cmd: 'touch Readme.md; ls readme.md', out: 'readme.md', src: 'c145-mac', noteEn: 'found, though it was created as Readme.md', noteVi: 'vẫn tìm thấy, dù tạo với tên Readme.md' },
      win: doc('case-insensitive (NTFS default)', 'dir readme.md', 'Readme.md'),
    },
  },
  {
    id: 'acl', en: 'Permissions beyond rwx', vi: 'Quyền ngoài rwx',
    whyEn: 'POSIX ACLs with a mask on Linux, NFSv4-style allow/deny entries on macOS, full NT ACLs (icacls) on Windows — deny entries win.',
    whyVi: 'ACL POSIX có mask trên Linux, mục cho phép/cấm kiểu NFSv4 trên macOS, ACL NT đầy đủ (icacls) trên Windows — mục cấm thắng.',
    os: {
      linux: { name: 'POSIX ACL', cmd: 'setfacl -m u:nobody:r f; getfacl -c f', out: 'mask::r--', src: 'c145-lx' },
      mac: { name: 'chmod +a', cmd: 'chmod +a "everyone deny delete" tool.sh; rm tool.sh', out: 'rm: tool.sh: Permission denied', src: 'c145-mac' },
      win: doc('NT ACL', 'icacls file.txt /deny Everyone:(D)', 'processed file: file.txt'),
    },
  },
  {
    id: 'shell', en: 'Shell pipes', vi: 'Ống dẫn của shell',
    whyEn: 'bash pipes bytes between processes; PowerShell pipes .NET objects inside one process — Get-Process gives System.Diagnostics.Process objects with 52 properties.',
    whyVi: 'bash dẫn byte giữa các tiến trình; PowerShell dẫn đối tượng .NET trong một tiến trình — Get-Process trả đối tượng System.Diagnostics.Process có 52 thuộc tính.',
    os: {
      linux: { name: 'bash: text', cmd: 'ps -eo pid,comm,time,rss --sort=-time | head -4', out: '     60 node            00:00:01 59992', src: 'c147-pwsh' },
      mac: { name: 'zsh: text', cmd: 'ps -o pid,%cpu,rss,etime,comm -p $P', out: '46412  46.4  45344   00:01 node', src: 'c143-mac' },
      win: { name: 'PowerShell: objects', cmd: '(Get-Process -Id $PID | Get-Member -MemberType Property).Count', out: '52', src: 'c147-pwsh', noteEn: 'measured with PowerShell 7.6.9 on Linux', noteVi: 'đo bằng PowerShell 7.6.9 trên Linux' },
    },
  },
  {
    id: 'container', en: 'Containers', vi: 'Container',
    whyEn: 'Containers are a Linux kernel feature (namespaces + cgroups). macOS and Windows run them inside a Linux VM — every file access crosses the VM boundary.',
    whyVi: 'Container là tính năng của nhân Linux (namespace + cgroup). macOS và Windows chạy chúng trong một máy ảo Linux — mỗi lần đụng tệp đều vượt ranh giới máy ảo.',
    os: {
      linux: { name: 'native namespaces', cmd: 'docker run … uname -srm', out: 'Linux 7.0.12-linuxkit aarch64', src: 'c141-mac' },
      mac: { name: 'Docker Desktop VM (virtiofs)', cmd: "mount | grep ' /mac '", out: 'virtiofs2 on /mac type virtiofs (rw,nosuid,nodev,relatime,ignore_atime,no_xattr)', src: 'c145-lx' },
      win: doc('WSL 2 / Hyper-V VM', 'wsl -l -v', 'NAME  STATE  VERSION  docker-desktop  Running  2'),
    },
  },
];

export const measuredCount = () => OS_CARDS.reduce((n, c) => n + OS_KEYS.filter((k) => c.os[k].src !== 'doc').length, 0);
