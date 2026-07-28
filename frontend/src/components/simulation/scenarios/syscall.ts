/**
 * Hệ điều hành · OSG202 — syscall và ranh giới user/kernel.
 *
 * Chương trình của bạn KHÔNG được phép nói chuyện với phần cứng. Không đọc đĩa
 * trực tiếp, không gửi gói tin, không cấp phát bộ nhớ vật lý. Mọi thứ đó phải
 * nhờ kernel làm hộ, thông qua một cửa duy nhất gọi là system call.
 *
 * Cửa đó không phải một lời gọi hàm bình thường. Nó là một lệnh đặc biệt của
 * CPU (`syscall` trên x86-64) làm bộ xử lý ĐỔI CHẾ ĐỘ: từ user mode — nơi
 * nhiều lệnh bị cấm — sang kernel mode, nơi mọi thứ đều được phép.
 *
 * Hiểu ranh giới này giải thích khá nhiều chuyện thực tế: vì sao đọc file theo
 * khối lớn nhanh hơn hẳn đọc từng byte, vì sao `printf` có bộ đệm, và vì sao
 * một lỗi trong driver làm sập cả máy còn lỗi trong ứng dụng thì không.
 */

import { Shield } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

const CODE = [
  '// Mã của bạn — chạy ở user mode',
  'FILE* f = fopen("data.txt", "r");',
  'char buf[4096];',
  'fread(buf, 1, 4096, f);',
  '',
  '// fread không tự đọc đĩa. Nó gọi:',
  '//   syscall(SYS_read, fd, buf, 4096)',
  '// → CPU đổi sang kernel mode',
];

const SLOW_CODE = [
  '// Đọc 1 MB theo hai cách',
  '',
  '// A. từng byte một',
  'for (int i = 0; i < 1048576; i++)',
  '    read(fd, &c, 1);        // 1.048.576 syscall',
  '',
  '// B. theo khối 64KB',
  'while (read(fd, buf, 65536) > 0);  // 16 syscall',
];

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: opts.view === 'cost' ? { vi: 'Cùng 1 MB, hai cách đọc', en: 'The same 1 MB, two ways' } : { vi: 'Mã người dùng gọi xuống', en: 'User code calling down' },
    file: opts.view === 'cost' ? 'bench.c' : 'app.c',
    x: 0,
    y: 0,
    w: 470,
    h: 244,
    lines: opts.view === 'cost' ? SLOW_CODE : CODE,
  },
  {
    id: 'chart',
    kind: 'chart',
    mode: 'bar',
    title: { vi: 'Chi phí (mili giây)', en: 'Cost (milliseconds)' },
    x: 0,
    y: 256,
    w: 470,
    h: 304,
    accent: '#f59e0b',
    max: 1200,
    unit: 'ms',
  },
  {
    id: 'ring',
    kind: 'lanes',
    title: { vi: 'Hai chế độ của CPU', en: 'The CPU’s two modes' },
    hint: { vi: 'ranh giới này do PHẦN CỨNG canh, không phải phần mềm', en: 'this boundary is enforced by HARDWARE, not software' },
    x: 482,
    y: 0,
    w: 518,
    h: 316,
    accent: '#a78bfa',
    layout: 'rows',
    lanes: [
      { id: 'user', label: 'user mode', sub: { vi: 'mã của bạn · bị hạn chế', en: 'your code · restricted' }, accent: '#38bdf8' },
      { id: 'kernel', label: 'kernel mode', sub: { vi: 'toàn quyền với phần cứng', en: 'full hardware access' }, accent: '#f43f5e' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'strace', en: 'strace' },
    file: 'strace ./app',
    x: 482,
    y: 328,
    w: 518,
    h: 232,
    accent: '#34d399',
    maxLines: 6,
  },
];

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info' | 'active';
const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: Tone = 'muted'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const bar = (key: string, value: number, label: string, tone: Tone): PanelOp => ({ p: 'chart', op: 'value', key, value, label, tone });
const at = (lane: string, id: string, label: string, sub: string, tone: Tone): PanelOp => ({
  p: 'ring',
  op: 'push',
  lane,
  item: { id, label, sub, tone },
});
const wipeRing = (lane: string): PanelOp => ({ p: 'ring', op: 'clear', lane });

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ── A — ĐƯỜNG ĐI CỦA MỘT SYSCALL ────────────────────────────── */

function buildCall(): SimStep[] {
  const { steps, push } = collector();

  push(
    'restricted',
    { vi: 'Mã của bạn chạy ở user mode — và bị cấm khá nhiều thứ', en: 'Your code runs in user mode — and much is forbidden' },
    {
      vi: 'Ở chế độ này, CPU từ chối thi hành những lệnh chạm thẳng vào phần cứng: đổi bảng trang, tắt ngắt, đọc cổng vào ra. Đây không phải quy ước lịch sự của hệ điều hành — chính CPU có một bit chế độ và nó KHÔNG THI HÀNH những lệnh đó khi bit đang ở user.',
      en: 'In this mode the CPU refuses to execute instructions that touch hardware directly: swapping page tables, disabling interrupts, reading I/O ports. This is not an OS convention — the CPU itself has a mode bit and simply WILL NOT execute those instructions while it is set to user.',
    },
    2800,
    [
      lines([1, 2]),
      at('user', 'u1', 'app.c', 'không được đọc đĩa trực tiếp', 'info'),
      out('user mode: lệnh đặc quyền bị CPU từ chối', 'muted'),
    ],
    { sfx: 'click' }
  );

  push(
    'trap',
    { vi: 'Lệnh syscall — cánh cửa duy nhất, và nó có kiểm soát', en: 'The syscall instruction — the only door, and it is guarded' },
    {
      vi: '`fread` cuối cùng chạy lệnh `syscall` với số hiệu 0 (SYS_read) trong thanh ghi. CPU đổi bit chế độ sang kernel và nhảy tới một địa chỉ CỐ ĐỊNH do kernel đăng ký từ lúc khởi động. Chi tiết quan trọng: mã người dùng không chọn được nhảy đi đâu — nó chỉ nói muốn gì, còn điểm đến do kernel định trước.',
      en: '`fread` eventually executes the `syscall` instruction with number 0 (SYS_read) in a register. The CPU flips the mode bit to kernel and jumps to a FIXED address the kernel registered at boot. The crucial detail: user code cannot choose the destination — it only states what it wants; the landing point was decided by the kernel.',
    },
    3100,
    [
      lines([6, 7, 8]),
      at('kernel', 'k1', 'sys_read()', 'điểm vào do kernel đặt sẵn', 'err'),
      out('syscall(0, fd=3, buf, 4096)', 'info'),
    ],
    {
      sfx: 'lock',
      teachingNote: {
        vi: 'Nhấn: đây là lý do ứng dụng không thể "tự cho mình quyền" — điểm đến do kernel định.',
        en: 'Stress: this is why an app cannot grant itself privileges — the kernel picks the landing point.',
      },
    }
  );

  push(
    'work',
    { vi: 'Kernel làm việc thật, rồi chép dữ liệu ngược lên', en: 'The kernel does the real work, then copies data back up' },
    {
      vi: 'Kernel kiểm tra `fd` có hợp lệ và có quyền đọc không, tra cache trang, nếu chưa có thì bảo đĩa nạp về rồi chờ ngắt. Xong xuôi nó CHÉP dữ liệu từ vùng nhớ kernel sang vùng nhớ của tiến trình — không đưa thẳng con trỏ, vì như thế là cho user mode nhìn thấy bộ nhớ kernel.',
      en: 'The kernel checks the `fd` is valid and readable, consults the page cache, and if absent tells the disk to fetch and waits for the interrupt. Then it COPIES the data from kernel memory into the process’s memory — it never hands over a pointer, since that would expose kernel memory to user mode.',
    },
    3000,
    [
      at('kernel', 'k2', 'kiểm quyền → đọc → chép', 'sang bộ đệm của tiến trình', 'warn'),
      out('kiểm fd · page cache · chép 4096 byte lên user', 'info'),
    ],
    { sfx: 'stream' }
  );

  push(
    'ret',
    { vi: 'Quay lại user mode, mã chạy tiếp như chưa có gì', en: 'Back to user mode, and the code continues as if nothing happened' },
    {
      vi: 'Lệnh `sysret` đổi bit chế độ về user và trả điều khiển cho dòng lệnh kế tiếp. Từ góc nhìn mã C của bạn, `fread` chỉ là một lời gọi hàm bình thường vừa trả về. Toàn bộ chuyện đổi chế độ, kiểm quyền, đợi đĩa đều bị giấu sau một dòng.',
      en: 'The `sysret` instruction flips the mode bit back to user and returns control to the next line. From your C code’s point of view, `fread` was an ordinary function call that just returned. The mode switching, permission checks and disk waiting are all hidden behind one line.',
    },
    2900,
    [
      lines([4]),
      wipeRing('kernel'),
      at('user', 'u2', 'buf đã có dữ liệu', 'trở lại user mode', 'ok'),
      out('read() = 4096 · trở về user mode', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'isolation',
    { vi: 'Và đây là lý do lỗi ứng dụng không làm sập máy', en: 'And this is why an app crash does not take the machine down' },
    {
      vi: 'Ứng dụng chạy ở user mode, có bảng trang riêng, không chạm được vào bộ nhớ kernel hay bộ nhớ tiến trình khác. Nó hỏng thì kernel dọn dẹp rồi máy chạy tiếp. Ngược lại, driver chạy TRONG kernel mode nên một lỗi ở đó là màn hình xanh — không còn ai đứng ngoài để dọn.',
      en: 'An application runs in user mode with its own page table, unable to touch kernel memory or another process’s memory. When it crashes the kernel cleans up and the machine carries on. A driver, however, runs INSIDE kernel mode, so a bug there is a blue screen — nobody remains outside to clean up.',
    },
    3000,
    [out('app crash → kernel dọn · driver crash → sập máy', 'warn')],
    { sfx: 'blip' }
  );

  return steps;
}

/* ── B — CHI PHÍ ─────────────────────────────────────────────── */

function buildCost(): SimStep[] {
  const { steps, push } = collector();

  push(
    'price',
    { vi: 'Mỗi lần vượt ranh giới đều tốn tiền', en: 'Every boundary crossing is paid for' },
    {
      vi: 'Một syscall tốn khoảng 1–2 micro giây: đổi chế độ, cất thanh ghi, kiểm tham số, rồi làm nguội một phần cache. Nghe rất nhỏ — cho tới khi bạn gọi nó một triệu lần.',
      en: 'A syscall costs roughly 1–2 microseconds: switch modes, save registers, validate arguments, and leave part of the cache cold. That sounds tiny — until you make the call a million times.',
    },
    2600,
    [lines([1]), at('user', 'c1', '1 syscall', '≈ 1–2 µs', 'info'), out('1 syscall ≈ 1,2µs', 'muted')],
    { sfx: 'click' }
  );

  push(
    'byte',
    { vi: 'Đọc từng byte: hơn một triệu lần vượt ranh giới', en: 'Reading byte by byte: over a million crossings' },
    {
      vi: 'Vòng lặp `read(fd, &c, 1)` gọi syscall cho MỖI byte. Một megabyte thành 1.048.576 lần đổi chế độ, tốn khoảng 1,2 giây — trong khi dữ liệu thật thì đĩa trả về trong vài mili giây. Gần như toàn bộ thời gian là chi phí vượt cửa, không phải chi phí đọc.',
      en: 'The loop `read(fd, &c, 1)` issues a syscall for EVERY byte. One megabyte becomes 1,048,576 mode switches costing about 1.2 seconds — while the disk itself delivers the data in a few milliseconds. Nearly all the time is the crossing, not the reading.',
    },
    3100,
    [
      lines([3, 4, 5]),
      bar('từng byte', 1200, '1.200 ms', 'err'),
      out('1.048.576 syscall × 1,2µs ≈ 1,2 giây', 'err'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Hỏi lớp: đĩa chỉ mất vài ms, vậy 1,2 giây kia đi đâu?',
        en: 'Ask: the disk takes only a few ms — where did the other 1.2 seconds go?',
      },
    }
  );

  push(
    'block',
    { vi: 'Đọc theo khối 64KB: chỉ 16 lần', en: 'Reading in 64KB blocks: just 16 crossings' },
    {
      vi: 'Cùng một megabyte, cùng một đĩa, cùng lượng dữ liệu — nhưng chỉ 16 syscall thay vì hơn một triệu. Thời gian rơi xuống vài mili giây. Không có tối ưu thuật toán nào ở đây cả; chỉ là gộp nhiều lần vượt cửa thành một.',
      en: 'The same megabyte, the same disk, the same bytes — but 16 syscalls instead of over a million. The time drops to a few milliseconds. No algorithmic optimisation happened; several crossings were simply merged into one.',
    },
    3000,
    [
      lines([7, 8]),
      bar('khối 64KB', 8, '8 ms', 'ok'),
      out('16 syscall · ~8ms · nhanh hơn 150 lần', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'buffer',
    { vi: 'Vì sao printf có bộ đệm — và vì sao log mất khi crash', en: 'Why printf buffers — and why logs vanish on a crash' },
    {
      vi: 'Thư viện chuẩn không gọi syscall cho mỗi `printf`; nó gom vào bộ đệm rồi mới `write` một lần khi đầy hoặc gặp xuống dòng. Đây là lý do khi chương trình chết đột ngột, những dòng log cuối cùng biến mất — chúng còn nằm trong bộ đệm ở user mode, chưa kịp vượt cửa sang kernel. Cần chắc chắn thì phải `fflush` hoặc ghi không đệm.',
      en: 'The standard library does not syscall per `printf`; it accumulates into a buffer and issues one `write` when full or on a newline. This is why the last log lines disappear when a program dies abruptly — they were still in a user-mode buffer, never having crossed into the kernel. When it matters, `fflush` or write unbuffered.',
    },
    3100,
    [out('printf → bộ đệm user → 1 write khi đầy/xuống dòng', 'info'), out('crash đột ngột → mất dòng cuối trong bộ đệm', 'warn')],
    { sfx: 'blip' }
  );

  push(
    'modern',
    { vi: 'Và vì sao mạng tốc độ cao phải tránh syscall', en: 'And why high-speed networking avoids syscalls' },
    {
      vi: 'Máy chủ nhận hàng triệu gói mỗi giây không thể trả 1,2µs cho từng gói. Nên có `epoll` để một syscall biết được trạng thái hàng nghìn kết nối, `io_uring` để xếp hàng loạt thao tác vào một vùng nhớ dùng chung, và kernel bypass để bỏ qua kernel hoàn toàn. Cùng một bài toán: giảm số lần vượt ranh giới, không phải làm mỗi lần vượt nhanh hơn.',
      en: 'A server handling millions of packets per second cannot pay 1.2µs each. Hence `epoll`, where one syscall reports on thousands of connections; `io_uring`, which queues batches of operations through shared memory; and kernel bypass, which skips the kernel entirely. All solve the same problem: reduce the number of crossings rather than make each crossing faster.',
    },
    3100,
    [out('epoll · io_uring · kernel bypass — đều là giảm SỐ LẦN vượt', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

export const syscallScenario: Scenario = {
  id: 'syscall',
  name: { vi: 'System call — cánh cửa duy nhất xuống kernel', en: 'System calls — the only door down to the kernel' },
  tagline: {
    vi: 'Đọc 1 MB theo từng byte mất 1,2 giây, theo khối 64KB mất 8 mili giây — cùng đĩa, cùng dữ liệu. Khác biệt nằm ở số lần vượt ranh giới user/kernel, không phải ở tốc độ đọc.',
    en: 'Reading 1 MB byte by byte takes 1.2 seconds; in 64KB blocks, 8 milliseconds — same disk, same data. The difference is how many times you cross the user/kernel boundary, not how fast the disk is.',
  },
  icon: Shield,
  accent: '#a78bfa',
  group: 'os',
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'view',
      label: { vi: 'Phần nào', en: 'Which part' },
      defaultValue: 'call',
      choices: [
        {
          value: 'call',
          label: 'Đường đi một syscall',
          fullLabel: 'user mode → kernel mode → về lại',
          color: '#a78bfa',
          hint: { vi: 'vì sao app crash không sập máy', en: 'why an app crash spares the machine' },
        },
        {
          value: 'cost',
          label: 'Chi phí vượt ranh giới',
          fullLabel: '1,2 giây so với 8 mili giây',
          color: '#f43f5e',
          hint: { vi: 'vì sao printf có bộ đệm', en: 'why printf buffers' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'cost' ? buildCost() : buildCall()),
};
