/**
 * OOP · PRO192 — Stack và Heap: biến của bạn thật ra nằm ở đâu.
 *
 * Rất nhiều hiểu lầm kinh điển của người mới học đều tan ngay khi nhìn được
 * hai vùng nhớ này tách bạch:
 *
 *   "Vì sao truyền đối tượng vào hàm thì hàm sửa được, mà truyền số thì không?"
 *   "Vì sao gán `b = a` rồi sửa `b` thì `a` cũng đổi?"
 *   "Stack overflow là gì, khác gì hết RAM?"
 *   "Đặt biến null có giải phóng bộ nhớ không?"
 *
 * Câu trả lời chung: biến cục bộ nằm trên STACK, đối tượng nằm trong HEAP, và
 * cái nằm trên stack với kiểu đối tượng chỉ là một THAM CHIẾU — một mũi tên
 * trỏ sang heap, không phải bản thân đối tượng. Chép biến là chép mũi tên, chứ
 * không chép thứ nó trỏ tới.
 *
 * Hai vùng này còn khác nhau ở cách dọn dẹp: stack tự dọn khi hàm trả về, gọn
 * gàng và tức thì; heap thì phải có bộ dọn rác đi tìm những thứ không còn ai
 * trỏ tới nữa.
 */

import { Split } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

const REF_CODE = [
  'void main() {',
  '  int x = 5;',
  '  Point p = new Point(1, 2);',
  '',
  '  change(x, p);',
  '',
  '  print(x);        // 5   ← KHÔNG đổi',
  '  print(p.x);      // 99  ← ĐÃ đổi',
  '}',
  '',
  'void change(int n, Point q) {',
  '  n = 99;          // sửa bản sao của số',
  '  q.x = 99;        // sửa đối tượng THẬT',
  '}',
];

const OVERFLOW_CODE = [
  'int sum(int n) {',
  '  if (n == 0) return 0;',
  '  return n + sum(n - 1);   // gọi lại chính nó',
  '}',
  '',
  'sum(10);        // ✅ 10 khung chồng lên nhau',
  'sum(100_000);   // ❌ StackOverflowError',
  '',
  '// Stack chỉ khoảng 512KB – 1MB, không phải vài GB',
];

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: opts.view === 'overflow' ? { vi: 'Đệ quy quá sâu', en: 'Recursion too deep' } : { vi: 'Truyền vào hàm', en: 'Passing into a function' },
    file: 'Main.java',
    x: 0,
    y: 0,
    w: 486,
    h: 300,
    lines: opts.view === 'overflow' ? OVERFLOW_CODE : REF_CODE,
  },
  {
    id: 'stack',
    kind: 'stack',
    title: { vi: 'STACK — khung hàm, tự dọn', en: 'STACK — call frames, self-cleaning' },
    hint: { vi: 'hàm trả về là khung biến mất ngay', en: 'a frame vanishes the moment the call returns' },
    x: 0,
    y: 312,
    w: 486,
    h: 248,
    accent: '#f59e0b',
    floor: { vi: '(đáy stack)', en: '(stack floor)' },
  },
  {
    id: 'heap',
    kind: 'lanes',
    title: { vi: 'HEAP — đối tượng, do bộ dọn rác lo', en: 'HEAP — objects, managed by the collector' },
    hint: { vi: 'không ai trỏ tới nữa = rác', en: 'nothing pointing at it = garbage' },
    x: 498,
    y: 0,
    w: 502,
    h: 316,
    accent: '#34d399',
    layout: 'rows',
    lanes: [
      { id: 'obj', label: 'đối tượng', sub: { vi: 'dữ liệu thật nằm đây', en: 'the real data lives here' }, accent: '#34d399' },
      { id: 'ref', label: 'ai đang trỏ tới', sub: { vi: 'mũi tên từ stack', en: 'arrows from the stack' }, accent: '#38bdf8' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Kết quả', en: 'Output' },
    file: 'java',
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
const frame = (id: string, label: string, sub: string, tone: Tone = 'info'): PanelOp => ({
  p: 'stack',
  op: 'push',
  item: { id, label, sub, tone },
});
const popFrame = (n = 1): PanelOp => ({ p: 'stack', op: 'pop', n });
const hp = (lane: string, id: string, label: string, sub: string, tone: Tone): PanelOp => ({
  p: 'heap',
  op: 'push',
  lane,
  item: { id, label, sub, tone },
});
const hpTone = (id: string, tone: Tone, badge?: string, sub?: string): PanelOp => ({ p: 'heap', op: 'tone', key: id, tone, badge, sub });
const wipeHeap = (lane: string): PanelOp => ({ p: 'heap', op: 'clear', lane });

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ── A — THAM TRỊ VÀ THAM CHIẾU ──────────────────────────────── */

function buildRef(): SimStep[] {
  const { steps, push } = collector();

  push(
    'main',
    { vi: 'main chạy — hai biến, hai loại hoàn toàn khác nhau', en: 'main runs — two variables, two very different kinds' },
    {
      vi: '`x` là số nguyên: giá trị 5 nằm THẲNG trên stack, trong khung của `main`. `p` khai kiểu `Point`, nhưng thứ nằm trên stack chỉ là một tham chiếu — một mũi tên; còn đối tượng Point thật thì `new` cấp phát bên heap. Phân biệt được hai loại này là gỡ được gần hết hiểu lầm về sau.',
      en: '`x` is an int: the value 5 sits DIRECTLY on the stack, inside `main`’s frame. `p` is declared as a `Point`, but what sits on the stack is only a reference — an arrow; the actual Point object is allocated by `new` over on the heap. Telling these two apart resolves most later confusion.',
    },
    2900,
    [
      lines([1, 2, 3]),
      frame('f1', 'main()', 'x = 5   ·   p = →', 'ok'),
      hp('obj', 'o1', 'Point(1, 2)', 'ở địa chỉ 0x4A20', 'ok'),
      hp('ref', 'r1', 'p @ main', '→ 0x4A20', 'info'),
      out('x nằm trên stack · Point nằm trong heap', 'muted'),
    ],
    { sfx: 'click' }
  );

  push(
    'call',
    { vi: 'Gọi change(x, p) — khung mới, và HAI BẢN SAO', en: 'Call change(x, p) — a new frame, and TWO COPIES' },
    {
      vi: 'Java luôn truyền theo GIÁ TRỊ, kể cả với đối tượng — điều bị hiểu lầm nhiều nhất. `n` nhận bản sao của số 5. `q` nhận bản sao của MŨI TÊN. Cả hai đều là bản sao, khác biệt duy nhất là bản sao của mũi tên vẫn chỉ vào đúng đối tượng cũ.',
      en: 'Java always passes by VALUE, objects included — the most misunderstood point of all. `n` receives a copy of the number 5. `q` receives a copy of the ARROW. Both are copies; the only difference is that a copied arrow still points at the same object.',
    },
    3100,
    [
      lines([5, 11]),
      frame('f2', 'change()', 'n = 5 (bản sao)  ·  q = → (bản sao)', 'warn'),
      hp('ref', 'r2', 'q @ change', '→ 0x4A20 · CÙNG cái', 'warn'),
      out('n: bản sao của 5 · q: bản sao của mũi tên', 'warn'),
    ],
    {
      sfx: 'swoosh',
      teachingNote: {
        vi: 'Câu chốt: Java truyền THAM TRỊ luôn — nhưng với đối tượng thì "trị" đó là mũi tên.',
        en: 'The key line: Java is always pass-by-value — but for objects the "value" is the arrow.',
      },
    }
  );

  push(
    'writeN',
    { vi: 'n = 99 — chỉ sửa bản sao, main không biết gì', en: 'n = 99 — edits the copy only, main never notices' },
    {
      vi: '`n` là một ô nhớ riêng trong khung của `change`. Ghi 99 vào đó không đụng gì tới ô `x` nằm ở khung `main`. Đây là lý do truyền số vào hàm thì hàm không sửa được biến gốc.',
      en: '`n` is its own memory cell inside `change`’s frame. Writing 99 there does not touch the `x` cell in `main`’s frame. This is why passing a number into a function leaves the caller’s variable untouched.',
    },
    2800,
    [
      lines([12]),
      { p: 'stack', op: 'tone', key: 'f2', tone: 'err', sub: 'n = 99 (bản sao)  ·  q = →' },
      out('n = 99 · nhưng x ở main vẫn = 5', 'info'),
    ],
    { sfx: 'blip' }
  );

  push(
    'writeQ',
    { vi: 'q.x = 99 — đi theo mũi tên, sửa đối tượng THẬT', en: 'q.x = 99 — follows the arrow and edits the REAL object' },
    {
      vi: 'Chỗ khác biệt nằm ở dấu chấm. `q = ...` sẽ chỉ đổi mũi tên trong khung này. Nhưng `q.x = ...` là ĐI THEO mũi tên sang heap rồi sửa ô nhớ ở đó — mà ô nhớ đó cũng chính là thứ `p` bên `main` đang trỏ tới. Một đối tượng, hai mũi tên cùng chỉ vào.',
      en: 'The difference is the dot. `q = ...` would only change the arrow in this frame. But `q.x = ...` FOLLOWS the arrow into the heap and writes the cell there — and that cell is exactly what `p` back in `main` points to. One object, two arrows aimed at it.',
    },
    3100,
    [
      lines([13]),
      hpTone('o1', 'err', 'đã sửa', 'Point(99, 2)'),
      out('q.x = 99 → sửa đúng đối tượng mà p đang trỏ tới', 'err'),
    ],
    { sfx: 'error' }
  );

  push(
    'return',
    { vi: 'change trả về — khung biến mất, dấu vết thì không', en: 'change returns — the frame vanishes, its effect does not' },
    {
      vi: 'Toàn bộ khung của `change` bị bỏ đi tức thì: `n` và `q` không còn tồn tại. Nhưng thay đổi mà `q.x` đã ghi vào heap thì vẫn nằm đó, vì nó không thuộc khung nào cả. Nên `x` in ra 5 còn `p.x` in ra 99 — cùng một lệnh gọi hàm, hai kết quả trái ngược.',
      en: 'The whole `change` frame is discarded at once: `n` and `q` cease to exist. But the change `q.x` wrote into the heap remains, because it never belonged to any frame. So `x` prints 5 while `p.x` prints 99 — one function call, two opposite outcomes.',
    },
    3100,
    [
      lines([7, 8]),
      popFrame(),
      { p: 'heap', op: 'shift', lane: 'ref', n: 1 },
      out('print(x)   → 5', 'ok'),
      out('print(p.x) → 99', 'err'),
    ],
    { sfx: 'ping' }
  );

  push(
    'alias',
    { vi: 'Cùng cơ chế đó gây ra bẫy b = a', en: 'The same mechanism causes the b = a trap' },
    {
      vi: '`Point b = a;` chép mũi tên, không chép đối tượng — nên `b.x = 7` cũng làm `a.x` thành 7. Muốn có bản độc lập thì phải tự tạo đối tượng mới (`new Point(a.x, a.y)`), hoặc dùng kiểu bất biến để không ai sửa được sau khi tạo. Đây cũng chính là lý do mảng và danh sách truyền qua lại giữa các hàm rất dễ bị sửa ngoài ý muốn.',
      en: '`Point b = a;` copies the arrow, not the object — so `b.x = 7` also makes `a.x` seven. For an independent copy you must build a new object (`new Point(a.x, a.y)`), or use an immutable type so nobody can modify it after creation. This is also why arrays and lists passed between functions get modified unintentionally so easily.',
    },
    3100,
    [
      hp('ref', 'r3', 'a và b', '2 mũi tên · 1 đối tượng', 'warn'),
      out('b.x = 7  →  a.x cũng thành 7', 'warn'),
    ],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── B — STACK OVERFLOW VÀ RÁC ───────────────────────────────── */

function buildOverflow(): SimStep[] {
  const { steps, push } = collector();

  push(
    'small',
    { vi: 'sum(3) — mỗi lần gọi đẻ thêm một khung', en: 'sum(3) — each call adds one frame' },
    {
      vi: 'Hàm gọi chính nó thì khung cũ CHƯA được dọn, vì nó còn phải chờ kết quả để cộng vào. Bốn khung chồng lên nhau, mỗi khung giữ `n` riêng của mình. Đến khi `n == 0` thì bắt đầu trả ngược, và các khung tan dần từ trên xuống.',
      en: 'When a function calls itself the old frame is NOT cleaned up yet, because it still has to wait for the result to add. Four frames stack up, each holding its own `n`. Once `n == 0` the returns unwind and the frames dissolve from the top down.',
    },
    2900,
    [
      lines([1, 2, 3]),
      frame('s1', 'sum(3)', 'n = 3 · chờ sum(2)', 'info'),
      frame('s2', 'sum(2)', 'n = 2 · chờ sum(1)', 'info'),
      frame('s3', 'sum(1)', 'n = 1 · chờ sum(0)', 'info'),
      frame('s4', 'sum(0)', 'trả về 0', 'ok'),
      out('4 khung chồng · rồi trả ngược 0→1→3→6', 'ok'),
    ],
    { sfx: 'stream' }
  );

  push(
    'size',
    { vi: 'Nhưng stack rất nhỏ — khoảng 512KB tới 1MB', en: 'But the stack is tiny — around 512KB to 1MB' },
    {
      vi: 'Đây là con số làm nhiều người bất ngờ. Máy có 16GB RAM, nhưng mỗi luồng chỉ được cấp khoảng một megabyte cho stack. Mỗi khung tốn cỡ vài chục byte, nên trần thực tế nằm quanh mười tới hai chục nghìn khung — nghe nhiều, nhưng đệ quy trên dữ liệu lớn chạm tới rất nhanh.',
      en: 'This number surprises people. The machine has 16GB of RAM, yet each thread gets roughly one megabyte of stack. A frame costs a few dozen bytes, putting the practical ceiling around ten to twenty thousand frames — which sounds like plenty until recursion over real data reaches it.',
    },
    2900,
    [lines([9]), out('16GB RAM · nhưng stack mỗi luồng ≈ 1MB', 'warn')],
    { sfx: 'blip' }
  );

  push(
    'boom',
    { vi: 'sum(100_000) → StackOverflowError', en: 'sum(100_000) → StackOverflowError' },
    {
      vi: 'Khung thứ mười mấy nghìn tràn khỏi vùng stack và máy ảo ném lỗi ngay. Chú ý đây KHÔNG phải hết RAM: heap còn trống mênh mông, chỉ riêng stack đầy. Đó là lý do `StackOverflowError` và `OutOfMemoryError` là hai lỗi khác nhau, và cách chữa cũng khác hẳn nhau.',
      en: 'Somewhere past ten thousand frames the stack region overflows and the VM throws immediately. Note this is NOT running out of RAM: the heap still has plenty of room, only the stack is full. That is why `StackOverflowError` and `OutOfMemoryError` are different errors with entirely different fixes.',
    },
    3100,
    [
      lines([7]),
      frame('s5', '… 11.400 khung', 'tràn vùng stack', 'err'),
      out('StackOverflowError · heap vẫn còn trống', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Hỏi lớp: máy còn 15GB RAM trống, sao vẫn tràn? Vì stack là vùng riêng, rất nhỏ.',
        en: 'Ask the class: 15GB of RAM free, why overflow? Because the stack is its own, very small region.',
      },
    }
  );

  push(
    'fix',
    { vi: 'Cách chữa: đổi đệ quy thành vòng lặp', en: 'The fix: turn recursion into a loop' },
    {
      vi: 'Vòng lặp dùng đúng MỘT khung, dù chạy một triệu vòng — không có gì chồng lên nhau cả. Một số ngôn ngữ tối ưu được đệ quy đuôi thành vòng lặp tự động, nhưng Java thì không, nên với dữ liệu lớn phải tự viết vòng lặp hoặc tự quản lý một ngăn xếp riêng trong heap.',
      en: 'A loop uses exactly ONE frame no matter how many million iterations — nothing stacks up. Some languages optimise tail recursion into a loop automatically, but Java does not, so for large inputs you must write the loop yourself or manage an explicit stack on the heap.',
    },
    3000,
    [
      popFrame(5),
      frame('s6', 'sumLoop(100000)', 'đúng 1 khung · chạy 100.000 vòng', 'ok'),
      out('vòng lặp: 1 khung · không bao giờ tràn', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'garbage',
    { vi: 'Còn heap thì dọn kiểu khác hẳn', en: 'The heap, meanwhile, is cleaned quite differently' },
    {
      vi: 'Stack tự dọn theo đúng thứ tự vào ra, không cần ai can thiệp. Heap thì không có thứ tự nào cả — đối tượng sống chừng nào còn có mũi tên trỏ tới. Khi mũi tên cuối cùng biến mất, đối tượng thành RÁC, và bộ dọn rác sẽ thu hồi vào lúc nào đó nó thấy tiện, không phải ngay lập tức.',
      en: 'The stack cleans itself in strict last-in-first-out order with no intervention. The heap has no order at all — an object lives as long as some arrow points at it. When the last arrow disappears the object becomes GARBAGE, and the collector reclaims it whenever it sees fit, not immediately.',
    },
    3000,
    [
      wipeHeap('ref'),
      hp('obj', 'g1', 'Point(99, 2)', 'không ai trỏ tới', 'warn'),
      out('mũi tên cuối biến mất → thành rác', 'warn'),
    ],
    { sfx: 'blip' }
  );

  push(
    'null',
    { vi: 'Vì sao gán null không "giải phóng bộ nhớ"', en: 'Why setting null does not "free memory"' },
    {
      vi: '`p = null` chỉ xoá một mũi tên. Nếu còn mũi tên khác trỏ tới đối tượng thì nó vẫn sống nguyên. Và ngay cả khi không còn mũi tên nào, bộ nhớ cũng chưa được trả lại ngay — chỉ là đối tượng đủ điều kiện để thu hồi. Đây là lý do rò rỉ bộ nhớ trong Java hầu như luôn là "còn mũi tên mà quên": danh sách tĩnh, bộ nghe sự kiện không gỡ, bộ đệm không có trần.',
      en: '`p = null` erases one arrow. If another arrow still points at the object it lives on untouched. And even with no arrows left, the memory is not returned right away — the object merely becomes eligible for collection. This is why memory leaks in Java are almost always "a forgotten arrow": a static list, an unremoved event listener, an unbounded cache.',
    },
    3200,
    [
      hpTone('g1', 'err', 'vẫn chiếm RAM', 'chờ bộ dọn rác chạy'),
      out('p = null → xoá 1 mũi tên, KHÔNG trả RAM ngay', 'warn'),
      out('rò rỉ = còn mũi tên mà quên (list tĩnh, listener, cache)', 'err'),
    ],
    { sfx: 'lock' }
  );

  return steps;
}

export const stackHeapScenario: Scenario = {
  id: 'stack-heap',
  name: { vi: 'Stack và Heap — biến của bạn nằm ở đâu', en: 'Stack and heap — where your variables actually live' },
  tagline: {
    vi: 'Truyền số vào hàm thì hàm không sửa được, truyền đối tượng thì sửa được — cùng một cơ chế truyền tham trị, khác nhau ở chỗ với đối tượng thì "trị" đó là một mũi tên trỏ sang heap.',
    en: 'Pass a number and the function cannot change it; pass an object and it can — the same pass-by-value mechanism, except for objects the "value" is an arrow into the heap.',
  },
  icon: Split,
  accent: '#f59e0b',
  group: 'oop',
  lesson: {
    course: 'object-oriented-programming',
    subject: 'PRO192',
    code: '2.1',
    slug: 'pro192-2-1-lop-doi-tuong',
    title: { vi: 'Trường, phương thức & constructor', en: 'Fields, methods & constructors' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'view',
      label: { vi: 'Tình huống', en: 'Situation' },
      defaultValue: 'ref',
      choices: [
        {
          value: 'ref',
          label: 'Truyền vào hàm',
          fullLabel: 'Vì sao số không đổi mà đối tượng thì đổi',
          color: '#f59e0b',
          hint: { vi: 'chép mũi tên, không chép đối tượng', en: 'copies the arrow, not the object' },
        },
        {
          value: 'overflow',
          label: 'Tràn stack & rác',
          fullLabel: 'Stack chỉ 1MB, và null không trả RAM',
          color: '#f43f5e',
          hint: { vi: '16GB RAM vẫn tràn stack', en: '16GB RAM and still overflows' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'overflow' ? buildOverflow() : buildRef()),
};
