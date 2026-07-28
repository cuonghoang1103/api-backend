/**
 * OOP · CSD201 — ArrayList so với LinkedList.
 *
 * Sách giáo khoa tóm tắt bằng bảng độ phức tạp: truy cập theo chỉ số ArrayList
 * O(1) còn LinkedList O(n); chèn giữa thì ngược lại. Bảng đó đúng, nhưng nó
 * giấu mất hai điều quan trọng hơn trong thực tế:
 *
 * 1. DUYỆT TỪ ĐẦU TỚI CUỐI, cả hai đều O(n) — mà ArrayList vẫn nhanh hơn nhiều
 *    lần. Lý do không nằm trong bảng: các phần tử của ArrayList nằm LIỀN NHAU
 *    trong bộ nhớ nên cache nạp một dòng 64 byte là được luôn 16 phần tử; các
 *    node của LinkedList rải rác khắp heap nên gần như phần tử nào cũng trượt
 *    cache.
 * 2. LinkedList chỉ thật sự thắng khi bạn ĐANG ĐỨNG SẴN ở chỗ cần chèn. Nếu
 *    phải `get(i)` để tới đó trước thì lợi thế O(1) biến mất, vì bước đi tới
 *    đã tốn O(n) rồi.
 *
 * Kết luận thực dụng mà bài này hướng tới: mặc định dùng ArrayList; chỉ đổi
 * sang LinkedList khi có lý do đo được, chứ không phải vì bảng độ phức tạp.
 */

import { Layers } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

const ACCESS_CODE = [
  '// Cùng 1 triệu phần tử, cùng vòng lặp',
  'for (int i = 0; i < list.size(); i++)',
  '    sum += list.get(i);',
  '',
  '// ArrayList : 4 ms',
  '// LinkedList: 61 ms   ← cùng O(n) mà chậm 15 lần',
];

const INSERT_CODE = [
  '// Chèn vào GIỮA danh sách 1 triệu phần tử',
  'list.add(500_000, x);',
  '',
  '// ArrayList : dịch 500.000 phần tử sang phải',
  '// LinkedList: nối lại 2 con trỏ  ← nhưng…',
  '//   phải đi 500.000 bước mới TỚI được chỗ đó',
];

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: opts.view === 'insert' ? { vi: 'Chèn vào giữa', en: 'Insert in the middle' } : { vi: 'Duyệt hết danh sách', en: 'Walk the whole list' },
    file: 'List.java',
    x: 0,
    y: 0,
    w: 486,
    h: 220,
    lines: opts.view === 'insert' ? INSERT_CODE : ACCESS_CODE,
  },
  {
    id: 'arr',
    kind: 'table',
    title: { vi: 'ArrayList — một khối liền nhau', en: 'ArrayList — one contiguous block' },
    hint: { vi: 'địa chỉ tăng đều, cache nạp cả cụm', en: 'addresses step evenly, the cache loads a whole run' },
    x: 0,
    y: 232,
    w: 486,
    h: 328,
    accent: '#34d399',
    columns: [
      { key: 'a', label: 'địa chỉ', flex: 1 },
      { key: 'v', label: 'phần tử', flex: 1 },
    ],
  },
  {
    id: 'link',
    kind: 'lanes',
    title: { vi: 'LinkedList — node rải rác khắp heap', en: 'LinkedList — nodes scattered across the heap' },
    hint: { vi: 'mỗi node phải hỏi node trước mới biết đi đâu', en: 'each node must ask the previous one where to go' },
    x: 498,
    y: 0,
    w: 502,
    h: 316,
    accent: '#f59e0b',
    layout: 'rows',
    lanes: [
      { id: 'n', label: 'node', sub: { vi: 'dữ liệu + con trỏ', en: 'data + pointer' }, accent: '#f59e0b' },
      { id: 'jump', label: 'bước nhảy', sub: { vi: 'đi tới node kế', en: 'hop to the next' }, accent: '#a78bfa' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Đo thật', en: 'Measured' },
    file: 'benchmark',
    x: 498,
    y: 328,
    w: 502,
    h: 232,
    accent: '#38bdf8',
    maxLines: 6,
  },
];

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info' | 'active';
const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: Tone = 'muted'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const cell = (id: string, a: string, v: string, tone: Tone): PanelOp => ({
  p: 'arr',
  op: 'push',
  item: { id, label: a, cells: [a, v], tone },
});
const recolor = (id: string, tone: Tone, badge?: string): PanelOp => ({ p: 'arr', op: 'tone', key: id, tone, badge });
const wipeArr = (): PanelOp => ({ p: 'arr', op: 'clear' });
const nd = (lane: string, id: string, label: string, sub: string, tone: Tone): PanelOp => ({
  p: 'link',
  op: 'push',
  lane,
  item: { id, label, sub, tone },
});
const wipeLink = (lane: string): PanelOp => ({ p: 'link', op: 'clear', lane });

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ── A — TRUY CẬP VÀ DUYỆT ───────────────────────────────────── */

function buildAccess(): SimStep[] {
  const { steps, push } = collector();

  push(
    'layout',
    { vi: 'Khác biệt gốc rễ: cách nằm trong bộ nhớ', en: 'The root difference: how they sit in memory' },
    {
      vi: 'ArrayList giữ một mảng liền khối — phần tử thứ i nằm ở `base + i × 4`, tính ra được ngay bằng một phép nhân. LinkedList giữ những node riêng lẻ, mỗi node được cấp phát độc lập nên nằm rải rác khắp heap, và cách duy nhất để biết node kế ở đâu là đọc con trỏ trong node hiện tại.',
      en: 'An ArrayList holds one contiguous array — element i lives at `base + i × 4`, computable with a single multiply. A LinkedList holds separate nodes, each allocated independently and therefore scattered across the heap, and the only way to know where the next one is is to read the pointer inside the current one.',
    },
    2900,
    [
      lines([1, 2, 3]),
      cell('c0', '0x1000', 'A[0] = 7', 'ok'),
      cell('c1', '0x1004', 'A[1] = 3', 'ok'),
      cell('c2', '0x1008', 'A[2] = 9', 'ok'),
      cell('c3', '0x100C', 'A[3] = 1', 'ok'),
      nd('n', 'l0', 'node · 7', '0x8A20 → 0x3F10', 'info'),
      nd('n', 'l1', 'node · 3', '0x3F10 → 0xC402', 'info'),
      nd('n', 'l2', 'node · 9', '0xC402 → 0x1D88', 'info'),
      out('ArrayList: liền khối · LinkedList: rải rác', 'muted'),
    ],
    { sfx: 'click' }
  );

  push(
    'random',
    { vi: 'get(500_000): ArrayList tính một phép nhân là xong', en: 'get(500_000): ArrayList needs one multiplication' },
    {
      vi: 'Địa chỉ = `base + 500000 × 4`. Một phép nhân, một phép cộng, một lần đọc. Không phụ thuộc vào i lớn hay nhỏ — đó chính là ý nghĩa của O(1): lấy phần tử thứ một triệu cũng nhanh y như lấy phần tử đầu tiên.',
      en: 'Address = `base + 500000 × 4`. One multiply, one add, one read. It does not matter whether i is large or small — that is what O(1) means: fetching the millionth element is exactly as fast as the first.',
    },
    2800,
    [recolor('c0', 'active', 'base'), out('ArrayList.get(500000) → 1 phép nhân · ~1ns', 'ok')],
    { sfx: 'ping' }
  );

  push(
    'walk',
    { vi: 'LinkedList phải đi bộ 500.000 bước', en: 'LinkedList must walk 500,000 steps' },
    {
      vi: 'Không có công thức nào tính ra địa chỉ node thứ 500.000, vì các node không theo quy luật nào cả. Cách duy nhất là bắt đầu từ đầu và lần theo con trỏ từng bước một. Đây là chỗ bảng độ phức tạp nói đúng: O(n) và thật sự chậm.',
      en: 'No formula yields the address of node 500,000, because the nodes follow no pattern. The only way is to start at the head and follow pointers one at a time. Here the complexity table is right: O(n), and genuinely slow.',
    },
    2900,
    [
      nd('jump', 'j1', 'bước 1 → 2', 'đọc con trỏ', 'warn'),
      nd('jump', 'j2', 'bước 2 → 3', 'đọc con trỏ', 'warn'),
      nd('jump', 'j3', '… 500.000 bước', '', 'err'),
      out('LinkedList.get(500000) → 500.000 bước · ~2ms', 'err'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'sequential',
    { vi: 'Nhưng khi DUYỆT HẾT thì cả hai đều O(n) — mà vẫn chênh 15 lần', en: 'But walking the WHOLE list is O(n) for both — and still 15× apart' },
    {
      vi: 'Đây mới là chỗ đáng học. Duyệt tuần tự thì LinkedList không phải đi lại từ đầu mỗi lần, nên số bước bằng đúng ArrayList. Vậy mà đo thật vẫn ra 4ms so với 61ms. Bảng độ phức tạp không giải thích được, vì nó đếm số PHÉP TÍNH chứ không tính CHI PHÍ mỗi phép.',
      en: 'This is the part worth learning. Iterating sequentially, a LinkedList does not restart from the head each time, so the step count matches ArrayList exactly. Yet the measurement still reads 4ms against 61ms. The complexity table cannot explain it, because it counts OPERATIONS rather than the COST of each one.',
    },
    3100,
    [
      lines([5, 6]),
      out('duyệt hết: cả hai đều n bước', 'info'),
      out('ArrayList 4ms · LinkedList 61ms  ← vì sao?', 'warn'),
    ],
    {
      sfx: 'blip',
      teachingNote: {
        vi: 'Dừng ở đây: cùng số bước, chênh 15 lần. Cho lớp đoán trước khi sang bước sau.',
        en: 'Pause here: same step count, 15× apart. Let the class guess before the next step.',
      },
    }
  );

  push(
    'cache',
    { vi: 'Câu trả lời nằm ở cache: 64 byte một lần nạp', en: 'The answer is the cache: 64 bytes per fetch' },
    {
      vi: 'Cache không bao giờ nạp một phần tử — nó nạp nguyên dòng 64 byte. Với ArrayList, một lần trượt cache mang về luôn 16 phần tử kế tiếp, nên 15 lần đọc sau gần như miễn phí. Với LinkedList, node kế tiếp nằm ở một chỗ hoàn toàn khác nên dòng vừa nạp chẳng chứa gì hữu ích — gần như mỗi phần tử là một lần trượt.',
      en: 'A cache never fetches one element — it fetches a whole 64-byte line. For an ArrayList a single miss brings in the next 16 elements, so the following 15 reads are nearly free. For a LinkedList the next node lives somewhere else entirely, so the line just loaded contains nothing useful — almost every element is its own miss.',
    },
    3200,
    [
      wipeArr(),
      cell('d0', '0x1000–0x103F', '16 phần tử · 1 lần nạp', 'ok'),
      wipeLink('jump'),
      nd('jump', 'k1', '0x8A20', 'trượt cache', 'err'),
      nd('jump', 'k2', '0x3F10', 'trượt cache', 'err'),
      nd('jump', 'k3', '0xC402', 'trượt cache', 'err'),
      out('ArrayList: 1 lần trượt / 16 phần tử', 'ok'),
      out('LinkedList: ~1 lần trượt / 1 phần tử', 'err'),
    ],
    { sfx: 'stream' }
  );

  push(
    'lesson',
    { vi: 'Bài học: độ phức tạp đếm số phép, cache quyết định giá mỗi phép', en: 'The lesson: complexity counts operations, the cache prices them' },
    {
      vi: 'Hai cấu trúc cùng O(n) có thể chênh nhau hàng chục lần chỉ vì cách chúng nằm trong bộ nhớ. Đây cũng là lý do mảng thường thắng trong thực tế dù lý thuyết nói hoà — và là lý do đo bao giờ cũng đáng tin hơn suy luận từ bảng. Xem thêm kịch bản "Bộ nhớ và cache" cùng bộ để hiểu tầng dưới.',
      en: 'Two structures with the same O(n) can differ by an order of magnitude purely because of how they sit in memory. It is also why arrays usually win in practice when theory calls it a tie — and why measuring beats reasoning from a table. See the companion "Memory and cache" scenario for the layer underneath.',
    },
    3000,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── B — CHÈN VÀ XOÁ ─────────────────────────────────────────── */

function buildInsert(): SimStep[] {
  const { steps, push } = collector();

  push(
    'shift',
    { vi: 'ArrayList chèn giữa: phải dịch nửa mảng sang phải', en: 'ArrayList insert: shift half the array right' },
    {
      vi: 'Vì các phần tử phải nằm liền nhau, muốn nhét thêm một chỗ ở giữa thì mọi phần tử phía sau phải lùi một ô. Với danh sách một triệu phần tử, chèn ở giữa là chép 500.000 phần tử. Đây là O(n) và bảng độ phức tạp nói đúng.',
      en: 'Because elements must stay contiguous, making room in the middle means every element after it moves up one slot. On a million-element list, inserting in the middle copies 500,000 elements. That is O(n), and the complexity table is right.',
    },
    2900,
    [
      lines([1, 2, 4]),
      cell('s0', '[0]', '7', 'muted'),
      cell('s1', '[1]', '3', 'muted'),
      cell('s2', '[2]', '9  → dịch sang [3]', 'warn'),
      cell('s3', '[3]', '1  → dịch sang [4]', 'warn'),
      out('ArrayList.add(giữa) → chép 500.000 phần tử · 1,8ms', 'warn'),
    ],
    { sfx: 'stream' }
  );

  push(
    'relink',
    { vi: 'LinkedList chèn: chỉ nối lại hai con trỏ', en: 'LinkedList insert: just relink two pointers' },
    {
      vi: 'Không phần tử nào phải nhúc nhích. Tạo node mới, cho nó trỏ tới node sau, rồi sửa node trước trỏ vào nó — xong, đúng hai phép gán. Không phụ thuộc danh sách dài bao nhiêu. Đây là chỗ LinkedList thắng thật, và thắng đậm.',
      en: 'Nothing moves. Create the new node, point it at the following node, then make the preceding node point at it — done, exactly two assignments. Independent of how long the list is. This is where a LinkedList genuinely wins, and wins big.',
    },
    2900,
    [
      lines([5]),
      nd('n', 'm1', 'node A', '→ node MỚI', 'ok'),
      nd('n', 'm2', 'node MỚI', '→ node B', 'ok'),
      nd('n', 'm3', 'node B', 'không đổi', 'muted'),
      out('LinkedList: 2 phép gán · không phụ thuộc n', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'catch',
    { vi: 'Nhưng đó là khi bạn ĐÃ ĐỨNG SẴN ở chỗ cần chèn', en: 'But that assumes you are ALREADY standing there' },
    {
      vi: 'Đây là chỗ bảng độ phức tạp đánh lừa nhiều người nhất. `list.add(500000, x)` phải ĐI TỚI vị trí 500.000 trước đã — và đi tới thì tốn 500.000 bước. Cộng lại vẫn là O(n), và đo thật còn chậm hơn ArrayList vì mỗi bước là một lần trượt cache, trong khi ArrayList chép khối liền nhau rất nhanh.',
      en: 'This is where the complexity table misleads people most. `list.add(500000, x)` must first REACH position 500,000 — and reaching it costs 500,000 steps. Together that is still O(n), and measured it is slower than ArrayList, because every step is a cache miss while ArrayList copies a contiguous block very fast.',
    },
    3200,
    [
      lines([6]),
      nd('jump', 'w1', '500.000 bước để TỚI chỗ chèn', 'mỗi bước 1 lần trượt cache', 'err'),
      out('LinkedList.add(500000, x) → 2,4ms', 'err'),
      out('ArrayList.add(500000, x) → 1,8ms  ← vẫn nhanh hơn', 'ok'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Hỏi lớp: vậy khi nào LinkedList mới thật sự thắng? Khi đã có iterator đứng đúng chỗ.',
        en: 'Ask the class: when does LinkedList actually win? When an iterator is already at the position.',
      },
    }
  );

  push(
    'iterator',
    { vi: 'Khi nào LinkedList thắng thật: đã có con trỏ đứng đúng chỗ', en: 'When LinkedList truly wins: an iterator already in place' },
    {
      vi: 'Đang duyệt bằng iterator và xoá dần các phần tử thoả điều kiện — lúc đó bạn đã đứng ngay tại node, và `it.remove()` chỉ tốn hai phép gán. Làm việc tương tự trên ArrayList thì mỗi lần xoá lại phải dịch cả đuôi mảng, thành O(n²) cho cả vòng lặp. Đây mới là tình huống đáng đổi cấu trúc.',
      en: 'You are iterating and removing elements that match a condition — you are already standing at the node, and `it.remove()` costs two assignments. Doing the same on an ArrayList shifts the tail on every removal, making the whole loop O(n²). That is the situation worth switching structures for.',
    },
    3100,
    [
      nd('jump', 'w2', 'iterator đã ở đúng node', 'remove() = 2 phép gán', 'ok'),
      out('xoá nhiều phần tử khi duyệt:', 'info'),
      out('LinkedList O(n) · ArrayList O(n²)', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'grow',
    { vi: 'Và chuyện ArrayList phải lớn lên', en: 'And the matter of ArrayList growing' },
    {
      vi: 'Mảng có kích thước cố định, nên khi đầy thì ArrayList cấp một mảng mới lớn gấp rưỡi rồi chép toàn bộ sang. Lần chép đó tốn O(n), nhưng vì dung lượng tăng theo cấp số nhân nên chia đều ra mỗi lần `add` vẫn chỉ tốn O(1) — gọi là chi phí khấu hao. Biết trước số phần tử thì cứ `new ArrayList<>(n)` để khỏi chép lại lần nào.',
      en: 'Arrays have a fixed size, so when full an ArrayList allocates a new array half again as large and copies everything over. That copy costs O(n), but because capacity grows geometrically the cost spread across all `add` calls is still O(1) — amortised cost. If you know the count in advance, use `new ArrayList<>(n)` and avoid every copy.',
    },
    3100,
    [
      wipeArr(),
      cell('g0', 'cũ · sức chứa 10', 'đầy', 'warn'),
      cell('g1', 'mới · sức chứa 15', 'chép 10 phần tử sang', 'ok'),
      out('gấp 1,5 lần mỗi lần đầy → khấu hao O(1)', 'ok'),
      out('biết trước n → new ArrayList<>(n) → 0 lần chép', 'ok'),
    ],
    { sfx: 'blip' }
  );

  push(
    'verdict',
    { vi: 'Luật thực dụng: mặc định ArrayList', en: 'The practical rule: default to ArrayList' },
    {
      vi: 'Hơn 90% trường hợp trong mã thật là duyệt và truy cập theo chỉ số — ArrayList thắng cả hai. LinkedList chỉ đáng dùng khi bạn chèn/xoá liên tục ở giữa THÔNG QUA iterator, hoặc cần hàng đợi hai đầu. Và mỗi node LinkedList còn tốn thêm 24–40 byte cho con trỏ với phần đầu đối tượng, nên nó cũng ngốn bộ nhớ hơn hẳn.',
      en: 'Over 90% of real code iterates and indexes — ArrayList wins both. A LinkedList is worth it only when you repeatedly insert or remove in the middle THROUGH an iterator, or need a double-ended queue. And each LinkedList node carries an extra 24–40 bytes of pointers and object header, so it uses considerably more memory too.',
    },
    3100,
    [lines([]), out('mặc định ArrayList · đổi khi ĐO được lý do', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

export const listVsLinkedScenario: Scenario = {
  id: 'list-vs-linked',
  name: { vi: 'ArrayList so với LinkedList — trong bộ nhớ', en: 'ArrayList vs LinkedList — in memory' },
  tagline: {
    vi: 'Duyệt hết danh sách thì cả hai đều O(n), vậy mà ArrayList vẫn nhanh gấp 15 lần. Bảng độ phức tạp không giải thích được, vì nó đếm số phép tính chứ không tính giá mỗi phép.',
    en: 'Walking the whole list is O(n) for both, yet ArrayList is still 15× faster. The complexity table cannot explain it, because it counts operations without pricing them.',
  },
  icon: Layers,
  accent: '#34d399',
  group: 'oop',
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'view',
      label: { vi: 'Thao tác', en: 'Operation' },
      defaultValue: 'access',
      choices: [
        {
          value: 'access',
          label: 'Truy cập & duyệt',
          fullLabel: 'Cùng O(n) mà chênh 15 lần',
          color: '#34d399',
          hint: { vi: 'cache nạp 64 byte một lần', en: 'the cache fetches 64 bytes at a time' },
        },
        {
          value: 'insert',
          label: 'Chèn & xoá',
          fullLabel: 'Khi nào LinkedList mới thật sự thắng',
          color: '#f59e0b',
          hint: { vi: 'phải đứng sẵn ở chỗ cần chèn', en: 'only with an iterator already there' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'insert' ? buildInsert() : buildAccess()),
};
