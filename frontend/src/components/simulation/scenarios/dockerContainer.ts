/**
 * VPS & Docker · Container KHÔNG phải máy ảo nhẹ.
 *
 * Câu hay gặp nhất khi mới học Docker là "container giống máy ảo nhưng nhẹ
 * hơn". Nó sai ở chỗ căn bản nhất: máy ảo có KERNEL RIÊNG, container thì
 * không. Container là một tiến trình Linux bình thường chạy trên kernel của
 * máy chủ, chỉ khác là nó bị hai cơ chế của chính kernel đó nhốt lại:
 *
 *   namespace — quyết định tiến trình NHÌN THẤY GÌ (pid, net, mnt, uts, ipc,
 *               user). Đây là lý do `ps` trong container chỉ thấy vài tiến
 *               trình và tiến trình chính mang PID 1.
 *   cgroup    — quyết định tiến trình DÙNG ĐƯỢC BAO NHIÊU (RAM, CPU, I/O).
 *               Đây là thứ giết container khi vượt trần, và là nguồn gốc của
 *               mã thoát 137 mà ai chạy VPS cũng gặp một lần.
 *
 * Hiểu đúng hai chữ này thì mọi hành vi "lạ" của Docker đều hết lạ: vì sao
 * container khởi động trong 0,3 giây, vì sao `free -h` bên trong container
 * lại báo RAM của cả máy chủ, vì sao container chết mà log ứng dụng không có
 * lấy một dòng lỗi.
 *
 * Con số dùng ở đây theo thang một VPS 8GB thật (đúng cấu hình đang chạy
 * cuongthai.com): ảnh Node alpine ~150MB, máy ảo Ubuntu tối thiểu ~1,2GB.
 */

import { Boxes } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn cho nhánh giới hạn tài nguyên ──────────────────── */

const LIMIT_CODE = [
  '# Chạy API với trần RAM 512 MB',
  '$ docker run --memory=512m --memory-swap=512m api',
  '',
  '# Bên trong container:',
  '$ free -h        # ← báo 7,8Gi, KHÔNG phải 512Mi',
  '$ cat /sys/fs/cgroup/memory.max',
  '536870912        # ← trần thật nằm ở đây',
  '',
  '# Ứng dụng cứ thế cấp phát...',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const STACK_PANELS: PanelSpec[] = [
  {
    id: 'vm',
    kind: 'tree',
    title: { vi: 'Máy ảo — mỗi máy một kernel riêng', en: 'Virtual machine — a kernel each' },
    x: 0,
    y: 0,
    w: 494,
    h: 306,
    accent: '#f43f5e',
  },
  {
    id: 'ct',
    kind: 'tree',
    title: { vi: 'Container — dùng chung kernel máy chủ', en: 'Container — sharing the host kernel' },
    x: 506,
    y: 0,
    w: 494,
    h: 306,
    accent: '#34d399',
  },
  {
    id: 'cost',
    kind: 'chart',
    mode: 'bar',
    title: { vi: 'Cái giá phải trả cho MỘT bản sao ứng dụng', en: 'Cost of ONE copy of the app' },
    hint: { vi: 'RAM tính bằng MB, khởi động tính bằng phần mười giây', en: 'RAM in MB, boot in tenths of a second' },
    x: 0,
    y: 318,
    w: 494,
    h: 242,
    accent: '#f59e0b',
    max: 1400,
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Trên máy chủ', en: 'On the host' },
    file: 'root@vps:~#',
    x: 506,
    y: 318,
    w: 494,
    h: 242,
    accent: '#38bdf8',
    maxLines: 7,
  },
];

const LIMIT_PANELS: PanelSpec[] = [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Đặt trần bằng cgroup', en: 'Setting the ceiling with cgroups' },
    file: 'bash',
    x: 0,
    y: 0,
    w: 494,
    h: 268,
    lines: LIMIT_CODE,
  },
  {
    id: 'ns',
    kind: 'lanes',
    title: { vi: 'Namespace — container NHÌN THẤY gì', en: 'Namespaces — what the container SEES' },
    hint: { vi: 'cùng một kernel, sáu tấm kính lọc khác nhau', en: 'one kernel, six different filters' },
    x: 0,
    y: 280,
    w: 494,
    h: 280,
    accent: '#a78bfa',
    layout: 'rows',
    lanes: [
      { id: 'pid', label: 'pid', sub: { vi: 'thấy tiến trình nào', en: 'which processes' } },
      { id: 'net', label: 'net', sub: { vi: 'card mạng, cổng', en: 'interfaces, ports' } },
      { id: 'mnt', label: 'mnt', sub: { vi: 'cây thư mục', en: 'filesystem tree' } },
    ],
  },
  {
    id: 'mem',
    kind: 'meter',
    title: { vi: 'cgroup memory.max — trần cứng 512 MB', en: 'cgroup memory.max — hard ceiling 512 MB' },
    x: 506,
    y: 0,
    w: 494,
    h: 268,
    accent: '#f59e0b',
    meters: [
      {
        id: 'rss',
        label: 'RSS của container',
        max: 640,
        unit: 'MB',
        threshold: 512,
        thresholdLabel: 'memory.max',
        accent: '#38bdf8',
      },
      { id: 'host', label: 'RAM máy chủ đã dùng', max: 8192, unit: 'MB', accent: '#64748b' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Nhật ký', en: 'Logs' },
    file: 'docker logs / dmesg',
    x: 506,
    y: 280,
    w: 494,
    h: 280,
    accent: '#34d399',
    maxLines: 8,
  },
];

const panels = (opts: ScenarioOptions): PanelSpec[] =>
  opts.view === 'limits' ? LIMIT_PANELS : STACK_PANELS;

/* ── Tiện ích ────────────────────────────────────────────────── */

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info' | 'active' | 'idle';

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });

const out = (label: string, tone: Tone = 'ok'): PanelOp => ({
  p: 'out',
  op: 'push',
  item: { label, tone },
});

/** Một tầng trong chồng "phần cứng → … → ứng dụng". */
const tier = (
  panel: 'vm' | 'ct',
  id: string,
  label: string,
  sub: string,
  badge: string,
  tone: Tone = 'muted'
): PanelOp => ({ p: panel, op: 'push', item: { id, label, depth: 0, sub, badge, tone } });

const bar = (key: string, value: number, label: string, tone: Tone): PanelOp => ({
  p: 'cost',
  op: 'value',
  key,
  value,
  label,
  tone,
});

const meter = (key: string, value: number, label: string, tone: Tone): PanelOp => ({
  p: 'mem',
  op: 'value',
  key,
  value,
  label,
  tone,
});

const nsItem = (lane: string, id: string, label: string, sub: string, tone: Tone = 'info'): PanelOp => ({
  p: 'ns',
  op: 'push',
  lane,
  item: { id, label, sub, tone },
});

type Push = (
  id: string,
  title: I18nText,
  detail: I18nText,
  duration: number,
  ops: PanelOp[],
  extra?: Partial<SimStep>
) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ────────────────────────────────────────────────────────────
   A — HAI CHỒNG TẦNG
   ──────────────────────────────────────────────────────────── */

function buildStack(): SimStep[] {
  const { steps, push } = collector();

  push(
    'hw',
    { vi: 'Cùng bắt đầu từ một chỗ: phần cứng và kernel máy chủ', en: 'Both start at the same place: hardware and host kernel' },
    {
      vi: 'Máy chủ vật lý (hoặc VPS của bạn) chạy Linux. Tầng dưới cùng của cả hai bên là như nhau — phần cứng thật và một kernel Linux đang điều khiển nó. Mọi khác biệt sắp tới đều nằm ở phía TRÊN hai tầng này.',
      en: 'The physical host (or your VPS) runs Linux. The bottom of both stacks is identical — real hardware and one Linux kernel driving it. Every difference from here on lives ABOVE these two layers.',
    },
    2400,
    [
      tier('vm', 'v1', 'Phần cứng', 'CPU · RAM · đĩa', 'chung', 'muted'),
      tier('vm', 'v2', 'Kernel máy chủ', 'Linux 6.x', 'chung', 'muted'),
      tier('ct', 'c1', 'Phần cứng', 'CPU · RAM · đĩa', 'chung', 'muted'),
      tier('ct', 'c2', 'Kernel máy chủ', 'Linux 6.x', 'chung', 'muted'),
      out('$ uname -r    → 6.8.0-generic', 'muted'),
    ],
    { sfx: 'click' }
  );

  push(
    'hypervisor',
    { vi: 'Máy ảo: thêm hypervisor, rồi thêm MỘT KERNEL NỮA', en: 'VM: add a hypervisor, then ANOTHER WHOLE KERNEL' },
    {
      vi: 'Hypervisor giả lập ra phần cứng ảo, và bên trên nó là một hệ điều hành khách hoàn chỉnh — kernel riêng, tiến trình init riêng, systemd riêng, dịch vụ nền riêng. Toàn bộ khối này tồn tại chỉ để cuối cùng chạy được ứng dụng của bạn, và nó ngốn khoảng 1,2 GB RAM trước khi ứng dụng viết ra dòng mã đầu tiên.',
      en: 'The hypervisor emulates virtual hardware, and on top of it sits a complete guest OS — its own kernel, its own init, its own systemd, its own background services. All of that exists just so your app can eventually run, and it eats about 1.2 GB of RAM before your app executes a single line.',
    },
    3200,
    [
      tier('vm', 'v3', 'Hypervisor', 'KVM · giả lập phần cứng ảo', '', 'warn'),
      tier('vm', 'v4', 'Kernel khách', 'Linux RIÊNG của máy ảo', '+ ~120 MB', 'err'),
      tier('vm', 'v5', 'Hệ điều hành khách', 'systemd · sshd · cron', '+ ~1,1 GB', 'err'),
      tier('vm', 'v6', 'Ứng dụng của bạn', 'node dist/index.js', '~90 MB', 'ok'),
      out('máy ảo: khởi động kernel khách... 12,4s', 'err'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Chỉ vào tầng "Kernel khách": đây là thứ container KHÔNG có, và là toàn bộ khác biệt.',
        en: 'Point at the "guest kernel" tier: this is what a container does NOT have, and it is the entire difference.',
      },
    }
  );

  push(
    'container',
    { vi: 'Container: không kernel khách, không hệ điều hành khách', en: 'Container: no guest kernel, no guest OS' },
    {
      vi: 'Bên container, phía trên kernel máy chủ chỉ có Docker và... tiến trình của bạn. Không có kernel thứ hai. `node` chạy TRỰC TIẾP trên kernel máy chủ, y như mọi tiến trình khác trên máy. Cái gọi là "ảnh alpine 150MB" chỉ là một cây thư mục — thư viện C, vài lệnh cơ bản — chứ không phải một hệ điều hành đang chạy.',
      en: 'On the container side, above the host kernel there is Docker and… your process. No second kernel. `node` runs DIRECTLY on the host kernel, exactly like every other process on the machine. The "150MB alpine image" is just a directory tree — a C library and a few basic commands — not a running operating system.',
    },
    3200,
    [
      tier('ct', 'c3', 'Docker Engine', 'containerd · runc', '', 'info'),
      tier('ct', 'c4', 'Hệ thống tệp của ảnh', 'alpine: libc + lệnh cơ bản', '~150 MB đĩa', 'info'),
      tier('ct', 'c5', 'Ứng dụng của bạn', 'node — tiến trình thường', '~90 MB', 'ok'),
      out('container: khởi động... 0,3s', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'proof',
    { vi: 'Bằng chứng: ps trên máy chủ nhìn thấy tiến trình trong container', en: 'Proof: the host’s ps can see the container’s process' },
    {
      vi: 'Đây là phép thử dứt điểm. Chạy `ps aux` TRÊN MÁY CHỦ và bạn thấy tiến trình `node` của container, với một PID thật của máy chủ. Với máy ảo thì không bao giờ có chuyện đó — tiến trình bên trong máy ảo nằm sau một kernel khác, máy chủ chỉ thấy đúng một tiến trình `qemu`.',
      en: 'This is the decisive test. Run `ps aux` ON THE HOST and you see the container’s `node` process, with a real host PID. With a VM that never happens — processes inside live behind a different kernel, and the host sees exactly one `qemu` process.',
    },
    3000,
    [
      out('$ ps aux | grep node', 'info'),
      out('root  4127  node dist/index.js   ← container', 'ok'),
      out('$ ps aux | grep qemu', 'info'),
      out('root  3055  qemu-system-x86_64   ← cả máy ảo gói trong 1 dòng', 'err'),
    ],
    {
      sfx: 'blip',
      teachingNote: {
        vi: 'Đây là câu trả lời cho "container có phải máy ảo nhẹ không": không, nó là TIẾN TRÌNH bị nhốt.',
        en: 'This answers "is a container a light VM": no, it is a CONFINED PROCESS.',
      },
    }
  );

  push(
    'cost',
    { vi: 'Cái giá: 1.310 MB so với 90 MB, 12,4s so với 0,3s', en: 'The cost: 1,310 MB vs 90 MB, 12.4s vs 0.3s' },
    {
      vi: 'Cùng một ứng dụng Node. Máy ảo phải nuôi thêm kernel khách và cả bộ dịch vụ nền của hệ điều hành khách; container thì không nuôi gì cả. Trên VPS 8GB, khác biệt này quyết định bạn chạy được 5 dịch vụ hay 50.',
      en: 'The same Node app. The VM must also feed a guest kernel and a full set of guest OS background services; the container feeds none. On an 8GB VPS this difference decides whether you run 5 services or 50.',
    },
    2900,
    [
      bar('máy ảo', 1310, '1.310 MB', 'err'),
      bar('container', 90, '90 MB', 'ok'),
      out('máy ảo:    1.310 MB · 12,4s', 'err'),
      out('container:     90 MB ·  0,3s', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'tradeoff',
    { vi: 'Đổi lại: cách ly yếu hơn, và bị trói vào kernel Linux', en: 'The trade-off: weaker isolation, and tied to the Linux kernel' },
    {
      vi: 'Không có gì miễn phí. Vì dùng chung kernel, một lỗ hổng leo thang đặc quyền ở kernel có thể thoát ra khỏi container — máy ảo thì phải phá thêm một tầng nữa. Và container Linux chỉ chạy được trên kernel Linux: Docker trên máy Mac của bạn thật ra đang chạy MỘT MÁY ẢO Linux ẩn bên dưới, đó là lý do nó chậm hơn hẳn và ăn RAM.',
      en: 'Nothing is free. Sharing a kernel means a privilege-escalation bug in that kernel can escape a container — a VM would still have another layer to break. And Linux containers only run on a Linux kernel: Docker on your Mac is in fact running a hidden Linux VM underneath, which is why it feels slower and eats RAM.',
    },
    3000,
    [out('Docker Desktop trên macOS = 1 máy ảo Linux ẩn', 'warn')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — NAMESPACE VÀ CGROUP: NHÌN THẤY GÌ, DÙNG ĐƯỢC BAO NHIÊU
   ──────────────────────────────────────────────────────────── */

function buildLimits(): SimStep[] {
  const { steps, push } = collector();

  push(
    'ns',
    { vi: 'namespace — sáu tấm kính lọc trên cùng một kernel', en: 'namespaces — six filters over one kernel' },
    {
      vi: 'Kernel không tạo ra thế giới mới cho container; nó chỉ LỌC những gì tiến trình được nhìn thấy. `pid` namespace làm tiến trình chính của bạn tưởng mình là PID 1. `net` cho nó một ngăn xếp mạng riêng với card `eth0` ảo. `mnt` cho nó một cây thư mục gốc riêng. Vẫn một kernel, vẫn một bảng tiến trình thật — chỉ là mỗi container nhìn qua một tấm kính khác.',
      en: 'The kernel does not create a new world for the container; it FILTERS what the process may see. The `pid` namespace makes your main process believe it is PID 1. `net` gives it a private network stack with a virtual `eth0`. `mnt` gives it its own root tree. Still one kernel, still one real process table — each container just looks through a different filter.',
    },
    3200,
    [
      lines([1, 2]),
      nsItem('pid', 'p1', 'PID 1 = node', 'máy chủ: 4127', 'info'),
      nsItem('net', 'n1', 'eth0 riêng', '172.17.0.3', 'info'),
      nsItem('mnt', 'm1', '/ = alpine', 'không thấy máy chủ', 'info'),
      out('$ docker run --memory=512m api', 'info'),
    ],
    { sfx: 'click' }
  );

  push(
    'free',
    { vi: 'Cái bẫy: free -h bên trong container nói dối', en: 'The trap: free -h inside the container lies' },
    {
      vi: 'Không có namespace nào cho bộ nhớ. `free -h` đọc `/proc/meminfo`, mà `/proc` phản ánh CẢ MÁY CHỦ — nên nó báo 7,8 GiB dù bạn đã đặt trần 512 MB. Hệ quả rất thật: các runtime tự chỉnh kích thước heap theo RAM "nhìn thấy" sẽ chọn heap cho máy 8GB, rồi chết vì trần 512MB. Với Node phải tự nói rõ `--max-old-space-size`.',
      en: 'There is no namespace for memory. `free -h` reads `/proc/meminfo`, and `/proc` reflects THE HOST — so it reports 7.8 GiB even though you set a 512 MB ceiling. The consequence is very real: runtimes that auto-size their heap from "visible" RAM will size for an 8GB machine and then die at the 512MB ceiling. With Node you must state `--max-old-space-size` explicitly.',
    },
    3200,
    [
      lines([4, 5, 6, 7]),
      meter('host', 3100, '3,1 GB / 8 GB', 'muted'),
      meter('rss', 90, '90 MB', 'ok'),
      out('$ free -h  → 7,8Gi   ← RAM của MÁY CHỦ', 'warn'),
      out('$ cat /sys/fs/cgroup/memory.max → 536870912', 'info'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Hỏi lớp: nếu ứng dụng tự chọn heap theo free -h, nó sẽ chọn theo con số nào?',
        en: 'Ask the class: if the app auto-sizes its heap from free -h, which number does it pick?',
      },
    }
  );

  push(
    'grow',
    { vi: 'Ứng dụng cấp phát dần — 90 → 320 → 480 MB', en: 'The app allocates — 90 → 320 → 480 MB' },
    {
      vi: 'Một chỗ rò rỉ bộ nhớ, một bộ đệm không có trần, hay đơn giản là lượng truy cập tăng. Container leo dần về phía vạch 512 MB. Ở đây chưa có gì sai: cgroup chỉ đếm, chưa can thiệp.',
      en: 'A leak, an unbounded cache, or simply more traffic. The container climbs toward the 512 MB line. Nothing is wrong yet: the cgroup is only counting, not intervening.',
    },
    2800,
    [
      lines([9]),
      meter('rss', 320, '320 MB', 'warn'),
      meter('host', 3330, '3,3 GB / 8 GB', 'muted'),
      out('RSS 320 MB / 512 MB', 'warn'),
    ],
    { sfx: 'stream' }
  );

  push(
    'kill',
    { vi: 'Chạm trần → kernel giết tiến trình, mã thoát 137', en: 'Hit the ceiling → the kernel kills it, exit code 137' },
    {
      vi: 'Vượt `memory.max` là kernel ra tay ngay, không thương lượng, không đợi ứng dụng dọn dẹp. Không có ngoại lệ nào ném ra trong mã của bạn, không có `try/catch` nào bắt được, log ứng dụng dừng giữa chừng không một dòng lỗi. Dấu vết duy nhất nằm ở `dmesg` của máy chủ và mã thoát 137 = 128 + 9, tức là bị SIGKILL.',
      en: 'Crossing `memory.max` triggers the kernel immediately — no negotiation, no chance to clean up. No exception is thrown in your code, no `try/catch` catches it, and the app log simply stops mid-sentence with no error. The only trace is in the host’s `dmesg` and the exit code 137 = 128 + 9, meaning SIGKILL.',
    },
    3300,
    [
      meter('rss', 512, '512 MB — CHẠM TRẦN', 'err'),
      out('[app] xử lý lô 4200...', 'muted'),
      out('(log dừng ở đây, không có lỗi)', 'warn'),
      out('dmesg: Memory cgroup out of memory: Killed process 4127 (node)', 'err'),
      out('$ docker ps -a → Exited (137)', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Đây chính là Exited(137) trong sổ sự cố deploy — không phải lỗi ứng dụng, mà là trần cgroup.',
        en: 'This is the Exited(137) from the deploy incident log — not an app bug, a cgroup ceiling.',
      },
    }
  );

  push(
    'why',
    { vi: 'Vì sao 137 khó chẩn đoán đến thế', en: 'Why 137 is so hard to diagnose' },
    {
      vi: 'Vì mọi nơi bạn quen nhìn đều im lặng: log ứng dụng sạch, không stack trace, không lỗi HTTP. Ba chỗ THẬT SỰ có dấu vết là `docker inspect` (`OOMKilled: true`), `dmesg` trên máy chủ, và mã thoát. Nhớ ba chỗ này thì một sự cố kéo dài hàng giờ rút xuống còn ba phút.',
      en: 'Because every place you habitually look is silent: clean app logs, no stack trace, no HTTP error. The three places that actually hold evidence are `docker inspect` (`OOMKilled: true`), the host `dmesg`, and the exit code. Remembering those three turns a multi-hour incident into a three-minute one.',
    },
    3000,
    [out('$ docker inspect api | grep OOMKilled → true', 'info')],
    { sfx: 'blip' }
  );

  push(
    'fix',
    { vi: 'Cách xử lý: nâng trần, hoặc dạy ứng dụng biết trần của nó', en: 'The fix: raise the ceiling, or teach the app its ceiling' },
    {
      vi: 'Hai hướng, thường phải làm cả hai. Một: đặt trần đúng với nhu cầu thật thay vì đoán. Hai: nói cho runtime biết trần đó — với Node là `NODE_OPTIONS=--max-old-space-size=448` (để chừa ~64 MB cho phần ngoài heap), để bộ dọn rác làm việc TRƯỚC khi chạm vạch cgroup thay vì bị giết ngang. Và nếu RSS vẫn leo đều sau khi nâng trần, thì đó là rò rỉ bộ nhớ thật — nâng trần chỉ mua thêm thời gian.',
      en: 'Two directions, usually both. One: set the ceiling to the real requirement instead of guessing. Two: tell the runtime about that ceiling — for Node, `NODE_OPTIONS=--max-old-space-size=448` (leaving ~64 MB for off-heap), so the garbage collector works BEFORE the cgroup line instead of being killed at it. And if RSS still climbs steadily after raising the ceiling, it is a genuine leak — a bigger ceiling only buys time.',
    },
    3100,
    [
      meter('rss', 430, '430 MB — GC kịp làm việc', 'ok'),
      out('--memory=768m + NODE_OPTIONS=--max-old-space-size=448', 'ok'),
      out('$ docker ps → Up 6 hours (healthy)', 'ok'),
    ],
    { sfx: 'success' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const dockerContainerScenario: Scenario = {
  id: 'docker-container',
  name: { vi: 'Container không phải máy ảo nhẹ', en: 'A container is not a light VM' },
  tagline: {
    vi: 'Máy ảo có kernel riêng, container thì không — nó chỉ là một tiến trình Linux bị namespace và cgroup nhốt lại. Hiểu hai chữ đó thì mã thoát 137 hết bí ẩn.',
    en: 'A VM carries its own kernel; a container does not — it is just a Linux process fenced in by namespaces and cgroups. Understand those two and exit code 137 stops being a mystery.',
  },
  icon: Boxes,
  accent: '#34d399',
  group: 'devops',
  lesson: {
    course: 'nodejs',
    code: '17.1',
    slug: 'nodejs-17-1-anh-docker',
    title: { vi: 'Ảnh Docker: từ 440MB xuống 58,8MB', en: 'The image: 440MB down to 58.8MB' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'view',
      label: { vi: 'Góc nhìn', en: 'View' },
      defaultValue: 'stack',
      choices: [
        {
          value: 'stack',
          label: 'Chồng tầng',
          fullLabel: 'Máy ảo so với container',
          color: '#34d399',
          hint: { vi: '1.310 MB so với 90 MB', en: '1,310 MB vs 90 MB' },
        },
        {
          value: 'limits',
          label: 'namespace & cgroup',
          fullLabel: 'Nhìn thấy gì, dùng được bao nhiêu',
          color: '#f59e0b',
          hint: { vi: 'nguồn gốc của Exited(137)', en: 'where Exited(137) comes from' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'limits' ? buildLimits() : buildStack()),
};
