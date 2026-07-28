/**
 * Máy tính · CEA201 — phân cấp bộ nhớ và cache.
 *
 * Có một sự thật về phần cứng mà phần lớn lập trình viên chưa từng nhìn thấy
 * bằng con số: CPU nhanh hơn RAM khoảng hai trăm lần. Một lệnh cộng mất chưa
 * tới một nano giây; một lần đọc RAM mất khoảng tám mươi. Nếu CPU thật sự phải
 * đợi RAM mỗi lần cần dữ liệu, nó sẽ dành 99% thời gian đứng yên.
 *
 * Cache tồn tại để che khoảng cách đó, và nó hoạt động được nhờ hai tính chất
 * mà chương trình thật gần như luôn có:
 *
 *   Locality thời gian — vừa đọc một ô thì sắp tới rất có thể đọc lại nó.
 *   Locality không gian — vừa đọc một ô thì sắp tới rất có thể đọc ô kế bên.
 *
 * Tính chất thứ hai là lý do cache không bao giờ nạp một byte: nó luôn nạp
 * nguyên một *cache line* 64 byte. Và đó cũng là lý do một vòng lặp duyệt mảng
 * theo thứ tự nhanh hơn hẳn cùng vòng lặp đó duyệt nhảy cóc — dù số phép tính
 * giống hệt nhau.
 *
 * Nhánh thứ hai đi vào cách cache quyết định chỗ đặt dữ liệu, và cái bẫy đi
 * kèm: với cache ánh xạ trực tiếp, hai địa chỉ cách nhau đúng một bội số của
 * kích thước cache sẽ tranh nhau MỘT ô duy nhất — cache 32KB mà chỉ dùng được
 * một dòng, hiệu năng rơi thẳng đứng dù dữ liệu thừa sức nằm vừa.
 */

import { Microchip } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const SEQ_CODE = [
  '// Duyệt mảng theo thứ tự',
  'for (let i = 0; i < n; i++)',
  '  sum += arr[i];',
  '',
  '// Duyệt nhảy cóc 16 phần tử',
  'for (let i = 0; i < n; i += 16)',
  '  sum += arr[i];',
];

const CONFLICT_CODE = [
  '// Cache 32KB · ánh xạ trực tiếp · dòng 64B',
  '// → 512 dòng, chỉ mục = (địa chỉ / 64) % 512',
  '',
  'for (let i = 0; i < n; i++) {',
  '  sum += a[i] + b[i];',
  '}',
  '',
  '// a và b cách nhau đúng 32KB trong bộ nhớ',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Vòng lặp đang chạy', en: 'The loop being run' },
    file: 'bench.js',
    x: 0,
    y: 0,
    w: 470,
    h: 232,
    lines: opts.view === 'conflict' ? CONFLICT_CODE : SEQ_CODE,
  },
  {
    id: 'cache',
    kind: 'table',
    title: { vi: 'Bên trong cache', en: 'Inside the cache' },
    hint: { vi: 'mỗi dòng giữ 64 byte liền nhau', en: 'each line holds 64 contiguous bytes' },
    x: 0,
    y: 244,
    w: 470,
    h: 316,
    accent: '#38bdf8',
    columns: [
      { key: 'i', label: 'dòng', flex: 0.5 },
      { key: 'd', label: 'đang giữ', flex: 1.3 },
    ],
  },
  {
    id: 'speed',
    kind: 'chart',
    mode: 'bar',
    title: { vi: 'Thời gian lấy dữ liệu (nano giây)', en: 'Time to fetch data (nanoseconds)' },
    hint: { vi: 'mỗi tầng xuống là chậm hơn một bậc', en: 'each level down is an order slower' },
    x: 482,
    y: 0,
    w: 518,
    h: 264,
    accent: '#f59e0b',
    max: 100,
    unit: 'ns',
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Từng lần truy cập', en: 'Access by access' },
    file: 'CPU',
    x: 482,
    y: 276,
    w: 518,
    h: 284,
    accent: '#34d399',
    maxLines: 8,
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info' | 'active';

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: Tone = 'muted'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const bar = (key: string, value: number, label: string, tone: Tone): PanelOp => ({
  p: 'speed',
  op: 'value',
  key,
  value,
  label,
  tone,
});
const line = (id: string, idx: string, holds: string, tone: Tone): PanelOp => ({
  p: 'cache',
  op: 'push',
  item: { id, label: idx, cells: [idx, holds], tone },
});
const wipe = (): PanelOp => ({ p: 'cache', op: 'clear' });

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
   A — PHÂN CẤP VÀ CACHE LINE
   ──────────────────────────────────────────────────────────── */

function buildHierarchy(): SimStep[] {
  const { steps, push } = collector();

  push(
    'gap',
    { vi: 'Khoảng cách: CPU nhanh hơn RAM khoảng 200 lần', en: 'The gap: the CPU is ~200× faster than RAM' },
    {
      vi: 'Thanh ghi trả lời trong khoảng 0,3 nano giây, L1 khoảng 1, L2 khoảng 4, còn RAM khoảng 80. Nếu mỗi lần cần dữ liệu mà phải đi tới RAM thì CPU 3 GHz sẽ đứng chờ suốt hai trăm chu kỳ — nhanh hay chậm không còn do CPU nữa, mà do đường đi lấy dữ liệu.',
      en: 'A register answers in about 0.3 nanoseconds, L1 in 1, L2 in 4, and RAM in about 80. If every data access had to reach RAM, a 3 GHz CPU would stall for two hundred cycles each time — speed would no longer be about the CPU at all, but about the trip to fetch data.',
    },
    2800,
    [
      lines([2, 3]),
      bar('L1', 1, '1 ns', 'ok'),
      bar('L2', 4, '4 ns', 'info'),
      bar('RAM', 80, '80 ns', 'err'),
      out('CPU 3GHz: 1 chu kỳ ≈ 0,33 ns', 'muted'),
    ],
    { sfx: 'click' }
  );

  push(
    'miss',
    { vi: 'Lần đọc đầu tiên luôn trượt — và nạp về 64 byte', en: 'The first read always misses — and pulls in 64 bytes' },
    {
      vi: 'Cache trống thì `arr[0]` chắc chắn trượt, phải đi tới RAM và mất 80 ns. Nhưng cache KHÔNG nạp về một số — nó nạp nguyên một dòng 64 byte, tức là `arr[0]` tới `arr[15]` nếu mảng là số 32-bit. Bạn trả tiền cho một lần đọc và nhận về mười sáu.',
      en: 'With a cold cache `arr[0]` is guaranteed to miss, so it goes to RAM and costs 80 ns. But the cache does NOT fetch one number — it fetches a whole 64-byte line, which is `arr[0]` through `arr[15]` for 32-bit values. You pay for one read and receive sixteen.',
    },
    3000,
    [
      line('c0', '0', 'arr[0..15]', 'ok'),
      out('arr[0] → MISS · nạp 64B từ RAM · 80ns', 'err'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Hỏi lớp: vừa nạp arr[0..15], vậy mười lăm lần đọc kế tiếp tốn bao nhiêu?',
        en: 'Ask the class: having loaded arr[0..15], what do the next fifteen reads cost?',
      },
    }
  );

  push(
    'hits',
    { vi: 'Mười lăm lần đọc kế tiếp đều trúng — 1 ns mỗi lần', en: 'The next fifteen reads all hit — 1 ns each' },
    {
      vi: '`arr[1]` tới `arr[15]` đã nằm sẵn trong dòng vừa nạp, nên chúng lấy từ L1 và gần như miễn phí. Trung bình cho mười sáu lần đọc: (80 + 15×1) / 16 ≈ 5,9 ns. Đó là cách một chương trình duyệt tuần tự "giấu" được cái giá 80 ns của RAM.',
      en: '`arr[1]` through `arr[15]` are already in the line just loaded, so they come from L1 and are practically free. Averaged over sixteen reads: (80 + 15×1) / 16 ≈ 5.9 ns. That is how sequential code "hides" RAM’s 80 ns price.',
    },
    3000,
    [
      out('arr[1..15] → HIT × 15 · 1ns mỗi lần', 'ok'),
      out('trung bình: 5,9 ns / phần tử', 'ok'),
      bar('duyệt tuần tự', 6, '5,9 ns', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'stride',
    { vi: 'Đổi sang nhảy cóc 16 phần tử — mọi lần đọc đều trượt', en: 'Switch to a stride of 16 — every read misses' },
    {
      vi: 'Cùng số phép cộng, cùng số phần tử được đọc, nhưng mỗi lần đọc rơi vào một dòng cache khác nhau. Không lần nào tận dụng được mười lăm phần tử vừa nạp kèm — chúng bị nạp về rồi vứt đi. Trung bình vọt lên 80 ns, chậm gấp mười ba lần.',
      en: 'Same number of additions, same number of elements read, but each read lands in a different cache line. None of them benefits from the fifteen neighbours loaded alongside — those are fetched and discarded. The average jumps to 80 ns, thirteen times slower.',
    },
    3100,
    [
      lines([6, 7]),
      wipe(),
      line('s0', '0', 'arr[0..15]  ← chỉ dùng arr[0]', 'warn'),
      line('s1', '1', 'arr[16..31] ← chỉ dùng arr[16]', 'warn'),
      line('s2', '2', 'arr[32..47] ← chỉ dùng arr[32]', 'warn'),
      out('mọi lần đọc → MISS · 80ns', 'err'),
      bar('nhảy cóc 16', 80, '80 ns', 'err'),
    ],
    { sfx: 'error' }
  );

  push(
    'why',
    { vi: 'Vì sao điều này quan trọng khi viết mã bậc cao', en: 'Why this matters even in high-level code' },
    {
      vi: 'Nó giải thích những chuyện nhìn qua thì vô lý: vì sao mảng thường nhanh hơn danh sách liên kết dù cùng độ phức tạp O(n); vì sao duyệt ma trận theo hàng nhanh hơn theo cột trong ngôn ngữ lưu theo hàng; vì sao gom dữ liệu hay dùng vào cạnh nhau lại tăng tốc rõ rệt mà không đổi một dòng thuật toán nào. Độ phức tạp đếm số phép tính, còn cache quyết định mỗi phép tính tốn bao lâu.',
      en: 'It explains things that look absurd on paper: why arrays beat linked lists at the same O(n); why iterating a matrix row-wise beats column-wise in a row-major language; why packing hot fields next to each other speeds things up without changing a line of algorithm. Complexity counts operations, but the cache decides what each operation costs.',
    },
    3100,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — ÁNH XẠ TRỰC TIẾP VÀ XUNG ĐỘT
   ──────────────────────────────────────────────────────────── */

function buildConflict(): SimStep[] {
  const { steps, push } = collector();

  push(
    'map',
    { vi: 'Cache quyết định chỗ đặt bằng phép chia lấy dư', en: 'The cache picks a slot with a modulo' },
    {
      vi: 'Cache 32KB với dòng 64 byte có đúng 512 dòng. Với ánh xạ trực tiếp, một địa chỉ CHỈ được phép nằm ở đúng một dòng: `(địa chỉ / 64) % 512`. Cách này rẻ về phần cứng — tra một phát ra ngay, không phải dò — nhưng nó cứng nhắc, và chỗ cứng nhắc đó sẽ trả giá.',
      en: 'A 32KB cache with 64-byte lines has exactly 512 lines. Under direct mapping an address may live in one line only: `(address / 64) % 512`. That is cheap in hardware — a single lookup, no searching — but it is rigid, and the rigidity has a price.',
    },
    2900,
    [
      lines([1, 2]),
      line('k0', '0', 'trống', 'muted'),
      line('k1', '1', 'trống', 'muted'),
      line('k2', '…', '512 dòng tất cả', 'muted'),
      out('32KB / 64B = 512 dòng · chỉ mục = (addr/64) % 512', 'info'),
    ],
    { sfx: 'click' }
  );

  push(
    'a',
    { vi: 'Đọc a[0] — vào dòng 0', en: 'Read a[0] — lands in line 0' },
    {
      vi: 'Mảng `a` bắt đầu ở một địa chỉ chia hết cho 32KB, nên `a[0]` rơi vào dòng 0. Trượt lần đầu, nạp 64 byte về, mọi thứ vẫn bình thường và đúng như bài trước.',
      en: 'Array `a` starts at an address divisible by 32KB, so `a[0]` maps to line 0. It misses once, pulls in 64 bytes, and everything behaves exactly as in the previous lesson.',
    },
    2600,
    [lines([4, 5]), wipe(), line('x0', '0', 'a[0..15]', 'ok'), out('a[0] → MISS · nạp vào dòng 0', 'warn')],
    { sfx: 'blip' }
  );

  push(
    'b',
    { vi: 'Đọc b[0] — cũng vào dòng 0, và đá a ra ngoài', en: 'Read b[0] — also line 0, and it evicts a' },
    {
      vi: 'Mảng `b` nằm cách `a` đúng 32KB. Chia lấy dư cho ra CÙNG chỉ mục 0. Vì mỗi chỉ mục chỉ chứa được một dòng, `b[0]` buộc phải đuổi `a[0..15]` ra, dù 511 dòng còn lại đang trống trơn.',
      en: 'Array `b` sits exactly 32KB after `a`. The modulo yields the SAME index 0. Because each index holds only one line, `b[0]` must evict `a[0..15]` — even though the other 511 lines are completely empty.',
    },
    3000,
    [
      wipe(),
      line('x1', '0', 'b[0..15]  ← vừa đá a ra', 'err'),
      line('x2', '1', 'trống', 'muted'),
      line('x3', '2', 'trống', 'muted'),
      out('b[0] → MISS · đuổi a[0..15] ra khỏi dòng 0', 'err'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Chỉ vào 511 dòng trống: cache còn thừa chỗ, nhưng luật ánh xạ không cho dùng.',
        en: 'Point at the 511 empty lines: the cache has room, but the mapping rule forbids using it.',
      },
    }
  );

  push(
    'thrash',
    { vi: 'Vòng lặp tiếp theo: a lại đá b, b lại đá a, mãi mãi', en: 'Next iteration: a evicts b, b evicts a, forever' },
    {
      vi: 'Đây gọi là *cache thrashing*. Mỗi lần lặp có hai lần trượt, và không lần nào tận dụng được mười lăm phần tử đã nạp kèm — chúng bị đuổi trước khi kịp dùng. Cache 32KB hoàn toàn còn chỗ, nhưng thực tế chỉ một dòng duy nhất được dùng.',
      en: 'This is *cache thrashing*. Every iteration takes two misses, and neither ever benefits from the fifteen neighbours loaded with it — they are evicted before they can be used. The 32KB cache has plenty of room, yet in practice only one line of it is ever used.',
    },
    3100,
    [
      out('a[1] → MISS (đuổi b) · b[1] → MISS (đuổi a)', 'err'),
      out('a[2] → MISS · b[2] → MISS · …', 'err'),
      bar('có xung đột', 80, '80 ns', 'err'),
    ],
    { sfx: 'error' }
  );

  push(
    'fix',
    { vi: 'Cách chữa: dịch mảng đi một chút, hoặc dùng cache nhiều đường', en: 'The fix: offset the arrays, or use a set-associative cache' },
    {
      vi: 'Ở phía phần mềm, chỉ cần chèn thêm 64 byte đệm giữa hai mảng là chỉ mục lệch nhau và xung đột biến mất — thay đổi tí xíu, nhanh gấp mười ba lần. Ở phía phần cứng, CPU thật dùng cache *nhiều đường*: mỗi chỉ mục có 8 hoặc 16 chỗ chứa thay vì một, nên hai địa chỉ đụng chỉ mục vẫn cùng tồn tại được. Đó là lý do bạn hiếm khi gặp trường hợp cực đoan này ngoài đời — nhưng nó vẫn xảy ra với những cấu trúc dữ liệu có kích thước đúng bằng luỹ thừa của hai.',
      en: 'In software, inserting 64 bytes of padding between the arrays shifts their indices apart and the conflict disappears — a trivial change, thirteen times faster. In hardware, real CPUs use *set-associative* caches: each index holds 8 or 16 slots instead of one, so two colliding addresses can coexist. That is why you rarely meet this extreme case in the wild — though it still bites data structures whose size is exactly a power of two.',
    },
    3300,
    [
      wipe(),
      line('y0', '0', 'a[0..15]', 'ok'),
      line('y1', '1', 'b[0..15]  ← sau khi đệm', 'ok'),
      bar('sau khi đệm', 6, '6 ns', 'ok'),
      out('thêm 64B đệm → hết xung đột → nhanh gấp 13 lần', 'ok'),
    ],
    { sfx: 'success' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const memoryCacheScenario: Scenario = {
  id: 'memory-cache',
  name: { vi: 'Bộ nhớ và cache — vì sao thứ tự duyệt quyết định tốc độ', en: 'Memory and cache — why access order decides speed' },
  tagline: {
    vi: 'CPU nhanh hơn RAM 200 lần, nên cache luôn nạp nguyên 64 byte một lúc. Cùng số phép tính, duyệt tuần tự mất 5,9 ns mỗi phần tử còn nhảy cóc mất 80 ns — chậm gấp mười ba lần.',
    en: 'The CPU is 200× faster than RAM, so the cache always pulls 64 bytes at a time. Same operation count: sequential costs 5.9 ns per element, strided costs 80 ns — thirteen times slower.',
  },
  icon: Microchip,
  accent: '#38bdf8',
  group: 'computer',
  lesson: {
    course: 'computer-organization-and-architecture',
    subject: 'CEA201',
    code: '4.1',
    slug: 'cea201-4-1-locality',
    title: { vi: 'Tính cục bộ & nguyên lý cache', en: 'Locality & the cache principle' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'view',
      label: { vi: 'Xem phần nào', en: 'Which part' },
      defaultValue: 'hierarchy',
      choices: [
        {
          value: 'hierarchy',
          label: 'Phân cấp & cache line',
          fullLabel: 'Vì sao duyệt tuần tự nhanh hơn',
          color: '#38bdf8',
          hint: { vi: '5,9 ns so với 80 ns', en: '5.9 ns vs 80 ns' },
        },
        {
          value: 'conflict',
          label: 'Xung đột chỉ mục',
          fullLabel: 'Cache 32KB mà chỉ dùng được 1 dòng',
          color: '#f43f5e',
          hint: { vi: 'hai mảng cách nhau đúng 32KB', en: 'two arrays exactly 32KB apart' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'conflict' ? buildConflict() : buildHierarchy()),
};
