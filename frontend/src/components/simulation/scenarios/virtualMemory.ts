/**
 * Máy tính · CEA201 / OSG202 — bộ nhớ ảo, TLB và page fault.
 *
 * Mọi địa chỉ mà chương trình của bạn nhìn thấy đều là ĐỊA CHỈ GIẢ. Con trỏ in
 * ra `0x7ffd4a2b` không tương ứng với chân RAM nào cả — nó là địa chỉ ảo, và
 * mỗi tiến trình có một không gian ảo riêng bắt đầu từ 0. Hai chương trình
 * cùng in ra `0x1000` đang nói về hai vùng RAM hoàn toàn khác nhau.
 *
 * Lớp dịch địa chỉ này giải quyết ba việc một lúc:
 *   - Cách ly: tiến trình A không thể chạm vào bộ nhớ của B, vì bảng trang của
 *     A đơn giản là không có mục nào trỏ tới đó.
 *   - Ảo hoá dung lượng: chương trình xin 8GB trên máy 4GB vẫn chạy, vì phần
 *     chưa dùng tới không cần nằm trong RAM.
 *   - Chia sẻ: cùng một thư viện được nạp một lần rồi ánh xạ vào nhiều tiến
 *     trình, mỗi tiến trình tưởng mình có bản riêng.
 *
 * Cái giá là mỗi lần chạm bộ nhớ phải tra bảng — và bảng đó cũng nằm trong
 * RAM, tức là một lần đọc biến thành hai. TLB tồn tại để xoá cái giá đó.
 */

import { Grid3x3 } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

const CODE = [
  'const buf = new Uint8Array(8 * 1024 * 1024);',
  'buf[0] = 1;        // chạm trang đầu',
  'buf[4096] = 2;     // trang kế tiếp',
  'buf[0] = 3;        // lại trang đầu',
];

const PANELS: PanelSpec[] = [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Chương trình chạm bộ nhớ', en: 'A program touching memory' },
    file: 'app.js',
    x: 0,
    y: 0,
    w: 470,
    h: 208,
    lines: CODE,
  },
  {
    id: 'table',
    kind: 'table',
    title: { vi: 'Bảng trang của tiến trình', en: 'The process page table' },
    hint: { vi: 'ảo → thật, mỗi trang 4KB', en: 'virtual → physical, 4KB pages' },
    x: 0,
    y: 220,
    w: 470,
    h: 340,
    accent: '#a78bfa',
    columns: [
      { key: 'v', label: 'trang ảo', flex: 1 },
      { key: 'p', label: 'khung thật', flex: 1.1 },
    ],
  },
  {
    id: 'steps',
    kind: 'lanes',
    title: { vi: 'Một lần đọc bộ nhớ đi qua đâu', en: 'What one memory read goes through' },
    x: 482,
    y: 0,
    w: 518,
    h: 300,
    accent: '#38bdf8',
    layout: 'rows',
    lanes: [
      { id: 'tlb', label: 'TLB', sub: { vi: 'đệm dịch địa chỉ', en: 'translation cache' }, accent: '#34d399' },
      { id: 'walk', label: 'Bảng trang', sub: { vi: 'nằm trong RAM', en: 'lives in RAM' }, accent: '#a78bfa' },
      { id: 'ram', label: 'RAM', sub: { vi: 'khung vật lý', en: 'physical frame' }, accent: '#38bdf8' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Nhật ký', en: 'Log' },
    file: 'kernel',
    x: 482,
    y: 312,
    w: 518,
    h: 248,
    accent: '#f59e0b',
    maxLines: 7,
  },
];

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info';
const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: Tone = 'muted'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const row = (id: string, v: string, p: string, tone: Tone): PanelOp => ({
  p: 'table',
  op: 'push',
  item: { id, label: v, cells: [v, p], tone },
});
const step = (lane: string, id: string, label: string, sub: string, tone: Tone): PanelOp => ({
  p: 'steps',
  op: 'push',
  lane,
  item: { id, label, sub, tone },
});
const wipeSteps = (): PanelOp => ({ p: 'steps', op: 'clear' });

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ── A — DỊCH ĐỊA CHỈ VÀ TLB ─────────────────────────────────── */

function buildTranslate(): SimStep[] {
  const { steps, push } = collector();

  push(
    'alloc',
    { vi: 'Xin 8MB — nhưng RAM chưa mất một byte nào', en: 'Ask for 8MB — and RAM gives up nothing yet' },
    {
      vi: 'Cấp phát chỉ ghi vào bảng trang rằng "vùng ảo này hợp lệ". Không khung RAM nào được gán cả. Đây là lý do một tiến trình có thể xin nhiều bộ nhớ hơn lượng RAM đang có mà máy không hề hấn gì — cho tới lúc nó thật sự chạm vào.',
      en: 'Allocation merely records in the page table that "this virtual range is valid". No physical frame is assigned. That is why a process can request more memory than the machine has and nothing happens — until it actually touches it.',
    },
    2600,
    [lines([1]), row('t0', '0x0000–0x1FFF', '(chưa gán)', 'muted'), out('mmap 8MB · 0 khung RAM được cấp', 'muted')],
    { sfx: 'click' }
  );

  push(
    'fault',
    { vi: 'Chạm lần đầu → page fault, và đó là chuyện BÌNH THƯỜNG', en: 'First touch → a page fault, and that is NORMAL' },
    {
      vi: 'Ghi vào `buf[0]` thì CPU tra bảng, thấy trang chưa có khung, và ném ra một page fault. Nghe như lỗi nhưng không phải: kernel bắt lấy, tìm một khung RAM trống, ghi vào bảng, rồi cho lệnh chạy lại. Chương trình không biết gì đã xảy ra — nó chỉ thấy phép gán tốn hơi lâu.',
      en: 'Writing `buf[0]` makes the CPU consult the table, find no frame for that page, and raise a page fault. It sounds like an error but is not: the kernel catches it, finds a free frame, records it, and restarts the instruction. The program never notices — the assignment merely took a while.',
    },
    3000,
    [
      lines([2]),
      step('walk', 'w1', 'tra bảng', 'không có khung', 'err'),
      row('t1', 'trang 0', 'khung 0x2A · vừa cấp', 'ok'),
      out('page fault · cấp khung 0x2A · lệnh chạy lại', 'warn'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Nhấn mạnh: page fault không phải lỗi. Nó là cơ chế cấp phát lười, xảy ra hàng nghìn lần mỗi giây.',
        en: 'Stress: a page fault is not an error. It is lazy allocation, happening thousands of times a second.',
      },
    }
  );

  push(
    'walk',
    { vi: 'Nhưng tra bảng cũng là một lần đọc RAM', en: 'But walking the table is itself a RAM read' },
    {
      vi: 'Bảng trang nằm trong RAM. Nếu mỗi lần chạm bộ nhớ đều phải tra bảng thì một lần đọc dữ liệu biến thành hai lần đọc RAM — và với bảng nhiều tầng như x86-64 (bốn tầng) thì thành năm. Không thể chấp nhận được.',
      en: 'The page table lives in RAM. If every memory access had to walk it, one data read would become two RAM reads — and with a multi-level table like x86-64’s four levels, five. That is unacceptable.',
    },
    2900,
    [step('ram', 'r1', 'đọc dữ liệu', 'sau khi đã tra bảng', 'warn'), out('1 lần đọc dữ liệu = 2 lần chạm RAM', 'err')],
    { sfx: 'blip' }
  );

  push(
    'tlb',
    { vi: 'TLB — đệm nhớ những phép dịch vừa dùng', en: 'The TLB — a cache of recent translations' },
    {
      vi: 'TLB là một bảng rất nhỏ, vài chục tới vài trăm mục, nằm ngay trong CPU. Lần dịch nào vừa làm thì được nhớ lại. Chạm `buf[0]` lần thứ hai chỉ tốn một lần tra TLB — dưới một nano giây, không đụng RAM lần nào.',
      en: 'The TLB is a very small table, tens to hundreds of entries, sitting inside the CPU. Any translation just performed is remembered. Touching `buf[0]` a second time costs one TLB lookup — under a nanosecond, with no RAM access at all.',
    },
    3000,
    [
      lines([4]),
      wipeSteps(),
      step('tlb', 'h1', 'TLB HIT', 'trang 0 → khung 0x2A', 'ok'),
      step('ram', 'r2', 'đọc dữ liệu', 'chỉ 1 lần chạm RAM', 'ok'),
      out('buf[0] lần 2 · TLB hit · <1ns', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'thrash',
    { vi: 'Và vì sao nhảy lung tung trong bộ nhớ lại chậm bất thường', en: 'And why jumping around memory is unusually slow' },
    {
      vi: 'TLB chỉ nhớ được vài trăm trang, tức khoảng một megabyte. Một vòng lặp nhảy qua nhiều megabyte sẽ làm TLB trượt liên tục, và mỗi lần trượt là một lượt tra bảng bốn tầng. Đây là tầng lý do thứ hai — bên cạnh cache — khiến duyệt tuần tự nhanh hơn duyệt ngẫu nhiên.',
      en: 'A TLB holds a few hundred pages, roughly a megabyte. A loop striding across many megabytes misses constantly, and every miss is a four-level table walk. This is the second reason — alongside the cache — that sequential access beats random access.',
    },
    2900,
    [step('walk', 'w2', 'TLB miss', 'tra 4 tầng bảng', 'err'), out('nhảy > 1MB · TLB trượt liên tục', 'err')],
    { sfx: 'error' }
  );

  push(
    'isolate',
    { vi: 'Phần thưởng lớn nhất: cách ly giữa các tiến trình', en: 'The biggest payoff: isolation between processes' },
    {
      vi: 'Tiến trình B có bảng trang riêng, và trong bảng đó không tồn tại mục nào trỏ tới khung của A. Nên B không thể đọc bộ nhớ của A dù cố tình — không phải vì bị kiểm tra và từ chối, mà vì địa chỉ đó đơn giản là không dịch được. Đây là nền tảng của mọi thứ bảo mật ở tầng hệ điều hành.',
      en: 'Process B has its own page table, and that table contains no entry pointing at A’s frames. So B cannot read A’s memory even deliberately — not because a check refuses it, but because the address simply does not translate. This is the foundation of all OS-level security.',
    },
    2900,
    [row('t2', 'tiến trình B · trang 0', 'khung 0x71 · khác hẳn', 'info'), out('cùng địa chỉ ảo 0x0 → hai khung RAM khác nhau', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── B — KHI RAM CẠN: SWAP ───────────────────────────────────── */

function buildSwap(): SimStep[] {
  const { steps, push } = collector();

  push(
    'full',
    { vi: 'RAM đầy, nhưng chương trình vẫn xin thêm', en: 'RAM is full, and the program asks for more' },
    {
      vi: 'Mọi khung đã có chủ. Kernel phải chọn một trang nào đó để đẩy ra đĩa, lấy chỗ cho trang mới. Cách chọn thường là "ít được dùng gần đây nhất" — giả định rằng thứ lâu không đụng tới thì sắp tới cũng không cần.',
      en: 'Every frame is taken. The kernel must pick some page to push out to disk to make room. The choice is usually "least recently used" — betting that what has not been touched for a while will not be needed soon.',
    },
    2700,
    [lines([1]), row('s0', 'trang 0', 'khung 0x2A', 'ok'), row('s1', 'trang 1', 'khung 0x2B', 'ok'), out('RAM đầy · cần chọn nạn nhân', 'warn')],
    { sfx: 'click' }
  );

  push(
    'evict',
    { vi: 'Đẩy một trang xuống đĩa, đánh dấu là "không có mặt"', en: 'Evict a page to disk, mark it "not present"' },
    {
      vi: 'Nội dung trang được ghi ra vùng swap, khung RAM được thu hồi, và mục trong bảng trang đổi cờ thành không-có-mặt. Tiến trình sở hữu trang đó không được báo gì cả — nó vẫn tin rằng bộ nhớ của mình còn nguyên.',
      en: 'The page contents are written to the swap area, the frame is reclaimed, and its page table entry flips to not-present. The owning process is told nothing — it still believes its memory is intact.',
    },
    2900,
    [row('s2', 'trang 1', 'ĐÃ ĐẨY RA ĐĨA', 'err'), out('swap out trang 1 · khung 0x2B được giải phóng', 'warn')],
    { sfx: 'stream' }
  );

  push(
    'back',
    { vi: 'Khi tiến trình chạm lại trang đó — page fault, và lần này rất đắt', en: 'When the process touches that page again — a fault, and this time it is expensive' },
    {
      vi: 'Lại là page fault, nhưng khác hẳn lần trước: kernel phải ĐỌC TỪ ĐĨA. Trên SSD mất khoảng 100 micro giây, chậm hơn RAM cỡ một nghìn lần. Chương trình đứng hình suốt thời gian đó mà không có cách nào biết vì sao.',
      en: 'A page fault again, but a different kind: the kernel must READ FROM DISK. On an SSD that is roughly 100 microseconds, about a thousand times slower than RAM. The program freezes for that entire span with no way to know why.',
    },
    3000,
    [
      lines([4]),
      step('walk', 'v1', 'không có mặt', 'phải đọc từ đĩa', 'err'),
      out('page fault (major) · đọc swap · ~100µs', 'err'),
    ],
    { sfx: 'error' }
  );

  push(
    'thrash',
    { vi: 'Và nếu chuyện này lặp liên tục thì máy gần như đứng hẳn', en: 'And if this repeats constantly the machine effectively stops' },
    {
      vi: 'Khi tập hợp trang đang dùng lớn hơn RAM, mỗi trang vừa nạp vào lại đẩy một trang khác đang cần ra. Máy dành phần lớn thời gian chuyển trang thay vì chạy chương trình — hiện tượng gọi là *thrashing*. Biểu hiện rất đặc trưng: CPU thấp, đĩa bận liên tục, mọi thứ chậm như bò.',
      en: 'When the working set exceeds RAM, each page brought in evicts another page that is also needed. The machine spends most of its time shuffling pages instead of running code — this is *thrashing*. The signature is distinctive: low CPU, constantly busy disk, everything crawling.',
    },
    3000,
    [out('thrashing · CPU 8% · đĩa 100% · máy như treo', 'err')],
    { sfx: 'buzz' }
  );

  push(
    'lesson',
    { vi: 'Nối lại với thực tế vận hành', en: 'Tying it back to running real servers' },
    {
      vi: 'Đây chính là giai đoạn "máy chậm lờ đờ nhưng chưa chết" mà bạn gặp trên VPS trước khi OOM killer ra tay. Swap không phải RAM thêm — nó là phanh giảm tốc, cho bạn thời gian phản ứng thay vì chết ngay. Nhìn thấy máy đang swap nhiều nghĩa là đã quá tải rồi, chứ không phải "vẫn còn chỗ".',
      en: 'This is exactly the "sluggish but not dead" phase you meet on a VPS before the OOM killer steps in. Swap is not extra RAM — it is a brake that buys you reaction time instead of instant death. Seeing heavy swapping means you are already over budget, not that there is still room.',
    },
    2900,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

export const virtualMemoryScenario: Scenario = {
  id: 'virtual-memory',
  name: { vi: 'Bộ nhớ ảo — mọi con trỏ đều là địa chỉ giả', en: 'Virtual memory — every pointer is a fake address' },
  tagline: {
    vi: 'Hai chương trình cùng in ra địa chỉ 0x1000 đang nói về hai vùng RAM khác nhau. Cấp phát 8MB không tốn một byte RAM nào cho tới lúc chạm vào — và mỗi lần chạm đầu tiên là một page fault hoàn toàn bình thường.',
    en: 'Two programs printing address 0x1000 are talking about different RAM. Allocating 8MB costs no physical memory until you touch it — and every first touch is a perfectly normal page fault.',
  },
  icon: Grid3x3,
  accent: '#a78bfa',
  group: 'computer',
  lesson: {
    course: 'computer-organization-and-architecture',
    subject: 'CEA201',
    code: '8.1',
    slug: 'cea201-8-1-os-support',
    title: { vi: 'Lập lịch, quản lý bộ nhớ & bộ nhớ ảo', en: 'Scheduling, memory management & virtual memory' },
  },
  nodes: [],
  edges: [],
  panels: PANELS,
  options: [
    {
      id: 'view',
      label: { vi: 'Tình huống', en: 'Situation' },
      defaultValue: 'translate',
      choices: [
        {
          value: 'translate',
          label: 'Dịch địa chỉ & TLB',
          fullLabel: 'Page fault đầu tiên và vai trò của TLB',
          color: '#a78bfa',
          hint: { vi: 'vì sao 1 lần đọc thành 2', en: 'why one read becomes two' },
        },
        {
          value: 'swap',
          label: 'Khi RAM cạn',
          fullLabel: 'Đẩy trang ra đĩa và thrashing',
          color: '#f43f5e',
          hint: { vi: 'chậm hơn RAM 1.000 lần', en: '1,000× slower than RAM' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'swap' ? buildSwap() : buildTranslate()),
};
