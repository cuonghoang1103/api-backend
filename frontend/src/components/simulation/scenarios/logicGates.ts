/**
 * Máy tính · CSI104 — từ cổng logic tới bộ cộng.
 *
 * Đây là bài nối hai thế giới: bên dưới là điện, bên trên là số học. Câu hỏi
 * cần trả lời là "làm sao một mớ transistor lại biết cộng?", và đường đi ngắn
 * hơn người ta tưởng — chỉ ba tầng:
 *
 *   transistor  → công tắc điện đóng/mở
 *   cổng logic  → AND, OR, XOR, NOT dựng từ vài transistor
 *   bộ cộng     → dựng từ vài cổng, và cộng được số nhiều bit
 *
 * Điểm đáng nhấn: KHÔNG có mạch nào "biết đếm". Bộ cộng chỉ là một bảng chân
 * trị được nối dây lại. Toàn bộ số học của máy tính nằm trên nhận xét rằng
 * cộng hai bit cho ra tổng đúng bằng XOR, và nhớ đúng bằng AND.
 */

import { CircuitBoard } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

const GATE_CODE = [
  '// Ba cổng đủ dựng mọi thứ',
  'AND(a,b)  → 1 chỉ khi cả hai là 1',
  'OR (a,b)  → 1 khi ít nhất một là 1',
  'XOR(a,b)  → 1 khi hai bit KHÁC nhau',
  '',
  '// Nhận xét làm nên số học:',
  '  0+0=0   0+1=1   1+0=1   1+1=10',
  '  tổng  = XOR(a,b)',
  '  nhớ   = AND(a,b)',
];

const ADD_CODE = [
  '// Cộng 2 số 4 bit:  0110 + 0011',
  '',
  '   0 1 1 0     (6)',
  ' + 0 0 1 1     (3)',
  ' ─────────',
  '   1 0 0 1     (9)',
  '',
  '// mỗi cột = một bộ cộng đầy đủ',
  '// nhớ của cột này là đầu vào cột sau',
];

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: opts.view === 'adder' ? { vi: 'Phép cộng cần làm', en: 'The addition to perform' } : { vi: 'Ba cổng cơ bản', en: 'Three basic gates' },
    file: 'logic',
    x: 0,
    y: 0,
    w: 470,
    h: 272,
    lines: opts.view === 'adder' ? ADD_CODE : GATE_CODE,
  },
  {
    id: 'truth',
    kind: 'table',
    title: { vi: 'Bảng chân trị', en: 'Truth table' },
    hint: { vi: 'toàn bộ "trí tuệ" của mạch nằm ở đây', en: 'all the circuit’s "intelligence" is here' },
    x: 0,
    y: 284,
    w: 470,
    h: 276,
    accent: '#a78bfa',
    columns: [
      { key: 'i', label: 'a  b', flex: 0.8 },
      { key: 'o', label: 'ra', flex: 1.2 },
    ],
  },
  {
    id: 'circuit',
    kind: 'lanes',
    title: opts.view === 'adder' ? { vi: 'Bốn cột, bốn bộ cộng', en: 'Four columns, four adders' } : { vi: 'Tín hiệu chạy qua cổng', en: 'Signals through the gates' },
    x: 482,
    y: 0,
    w: 518,
    h: 320,
    accent: '#34d399',
    layout: 'rows',
    lanes:
      opts.view === 'adder'
        ? [
            { id: 'c0', label: 'cột 0', sub: { vi: 'bit thấp nhất', en: 'least significant' }, accent: '#34d399' },
            { id: 'c1', label: 'cột 1', sub: { vi: '', en: '' }, accent: '#38bdf8' },
            { id: 'c2', label: 'cột 2', sub: { vi: '', en: '' }, accent: '#a78bfa' },
            { id: 'c3', label: 'cột 3', sub: { vi: 'bit cao nhất', en: 'most significant' }, accent: '#f59e0b' },
          ]
        : [
            { id: 'in', label: 'đầu vào', sub: { vi: 'a và b', en: 'a and b' }, accent: '#94a3b8' },
            { id: 'gate', label: 'cổng', sub: { vi: 'AND · OR · XOR', en: 'AND · OR · XOR' }, accent: '#a78bfa' },
            { id: 'sum', label: 'đầu ra', sub: { vi: 'tổng và nhớ', en: 'sum and carry' }, accent: '#34d399' },
          ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Kết quả', en: 'Result' },
    file: 'mạch',
    x: 482,
    y: 332,
    w: 518,
    h: 228,
    accent: '#38bdf8',
    maxLines: 6,
  },
];

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info';
const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: Tone = 'muted'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const trow = (id: string, i: string, o: string, tone: Tone): PanelOp => ({
  p: 'truth',
  op: 'push',
  item: { id, label: i, cells: [i, o], tone },
});
const wipeTruth = (): PanelOp => ({ p: 'truth', op: 'clear' });
const sig = (lane: string, id: string, label: string, sub: string, tone: Tone): PanelOp => ({
  p: 'circuit',
  op: 'push',
  lane,
  item: { id, label, sub, tone },
});

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ── A — CỔNG LOGIC ──────────────────────────────────────────── */

function buildGates(): SimStep[] {
  const { steps, push } = collector();

  push(
    'switch',
    { vi: 'Dưới cùng chỉ có công tắc', en: 'At the very bottom there are only switches' },
    {
      vi: 'Một transistor là công tắc điều khiển bằng điện: đưa điện áp vào chân điều khiển thì nó cho dòng đi qua, không thì chặn. Có điện = 1, không điện = 0. Toàn bộ máy tính được dựng từ hàng tỉ công tắc như vậy — không có gì huyền bí hơn thế ở tầng dưới cùng.',
      en: 'A transistor is an electrically controlled switch: apply voltage to the gate and current flows, otherwise it blocks. Voltage present = 1, absent = 0. The entire computer is built from billions of such switches — there is nothing more mysterious than that at the bottom.',
    },
    2600,
    [lines([1]), sig('in', 'i0', 'điện áp', 'có = 1 · không = 0', 'muted'), out('transistor = công tắc điều khiển bằng điện', 'muted')],
    { sfx: 'click' }
  );

  push(
    'and',
    { vi: 'AND — nối tiếp hai công tắc', en: 'AND — two switches in series' },
    {
      vi: 'Đặt hai công tắc nối tiếp nhau thì dòng chỉ qua được khi CẢ HAI cùng đóng. Đó chính xác là phép AND, và bảng chân trị của nó chỉ có một dòng cho ra 1. Không cần lập trình gì — hành vi này là hệ quả trực tiếp của cách nối dây.',
      en: 'Wire two switches in series and current flows only when BOTH are closed. That is exactly AND, and its truth table has just one row producing 1. Nothing was programmed — the behaviour follows directly from how the wires are arranged.',
    },
    2900,
    [
      lines([2]),
      trow('a1', '0  0', '0', 'muted'),
      trow('a2', '0  1', '0', 'muted'),
      trow('a3', '1  0', '0', 'muted'),
      trow('a4', '1  1', '1  ← chỉ dòng này', 'ok'),
      sig('gate', 'g1', 'AND', 'hai công tắc nối tiếp', 'info'),
      out('AND: chỉ 1 khi cả hai là 1', 'info'),
    ],
    { sfx: 'blip' }
  );

  push(
    'xor',
    { vi: 'XOR — 1 khi hai bit KHÁC nhau', en: 'XOR — 1 when the two bits DIFFER' },
    {
      vi: 'Cổng này ít trực giác hơn nhưng lại là cổng quan trọng nhất cho số học. Nó trả về 1 đúng khi hai đầu vào khác nhau. Hãy giữ bảng này trong đầu và so với bảng cộng ở bước sau — chúng sẽ trùng khớp.',
      en: 'Less intuitive, yet the most important gate for arithmetic. It returns 1 exactly when the inputs differ. Keep this table in mind and compare it with the addition table in the next step — they will match.',
    },
    2900,
    [
      lines([4]),
      wipeTruth(),
      trow('x1', '0  0', '0', 'muted'),
      trow('x2', '0  1', '1', 'ok'),
      trow('x3', '1  0', '1', 'ok'),
      trow('x4', '1  1', '0', 'muted'),
      sig('gate', 'g2', 'XOR', '1 khi khác nhau', 'info'),
      out('XOR: 1 khi hai bit khác nhau', 'info'),
    ],
    { sfx: 'blip' }
  );

  push(
    'insight',
    { vi: 'Nhận xét làm nên toàn bộ số học của máy tính', en: 'The observation that gives computers arithmetic' },
    {
      vi: 'Viết ra bảng cộng hai bit: 0+0=0, 0+1=1, 1+0=1, 1+1=10 (tức tổng 0 nhớ 1). Bây giờ so cột tổng với bảng XOR — trùng khít. So cột nhớ với bảng AND — cũng trùng khít. Nghĩa là bạn không cần phát minh ra "mạch biết cộng": chỉ cần nối một XOR và một AND lại.',
      en: 'Write out the two-bit addition table: 0+0=0, 0+1=1, 1+0=1, 1+1=10 (sum 0, carry 1). Now compare the sum column with the XOR table — identical. Compare the carry column with AND — also identical. So you never need to invent an "adding circuit": just wire one XOR and one AND together.',
    },
    3200,
    [
      lines([6, 7, 8, 9]),
      sig('sum', 's1', 'tổng = XOR(a,b)', '', 'ok'),
      sig('sum', 's2', 'nhớ = AND(a,b)', '', 'ok'),
      out('bảng cộng = XOR (tổng) + AND (nhớ)', 'ok'),
    ],
    {
      sfx: 'success',
      teachingNote: {
        vi: 'Đây là khoảnh khắc của cả bài: không có mạch nào "biết đếm", chỉ có bảng chân trị được nối dây.',
        en: 'This is the moment: no circuit "knows how to count" — there is only a truth table wired up.',
      },
    }
  );

  push(
    'half',
    { vi: 'Ghép lại: bộ cộng bán phần', en: 'Put them together: a half adder' },
    {
      vi: 'Một XOR cho tổng, một AND cho nhớ — thế là có mạch cộng được hai bit. Gọi là "bán phần" vì nó chưa nhận được số nhớ từ cột trước; thêm khả năng đó thì thành bộ cộng đầy đủ, và bốn cái ghép lại là cộng được số 4 bit. Chọn "Bộ cộng 4 bit" để xem chúng nối với nhau ra sao.',
      en: 'One XOR for the sum, one AND for the carry — and you have a circuit that adds two bits. It is called "half" because it cannot accept a carry from the previous column; add that and it becomes a full adder, and four of those chained together add 4-bit numbers. Pick "4-bit adder" to see how they connect.',
    },
    2900,
    [out('bộ cộng bán phần = 1 XOR + 1 AND', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── B — BỘ CỘNG 4 BIT ───────────────────────────────────────── */

function buildAdder(): SimStep[] {
  const { steps, push } = collector();

  push(
    'setup',
    { vi: 'Cộng 0110 với 0011 — làm y như cộng tay', en: 'Add 0110 to 0011 — exactly like adding on paper' },
    {
      vi: 'Bốn cột, mỗi cột một bộ cộng đầy đủ. Mỗi bộ nhận ba đầu vào: bit của số thứ nhất, bit của số thứ hai, và số nhớ từ cột bên phải. Nó trả về hai đầu ra: bit tổng của cột này, và số nhớ chuyển sang cột bên trái.',
      en: 'Four columns, one full adder each. Each takes three inputs: a bit from the first number, a bit from the second, and the carry from the column to its right. It produces two outputs: this column’s sum bit, and a carry into the column on its left.',
    },
    2700,
    [
      lines([3, 4, 5, 6]),
      trow('r1', 'a b nhớ', 'tổng · nhớ ra', 'muted'),
      out('0110 (6) + 0011 (3)', 'info'),
    ],
    { sfx: 'click' }
  );

  push(
    'col0',
    { vi: 'Cột 0: 0 + 1 = 1, không nhớ', en: 'Column 0: 0 + 1 = 1, no carry' },
    {
      vi: 'XOR(0,1) cho tổng 1, AND(0,1) cho nhớ 0. Cột này xong, và vì không sinh nhớ nên cột kế bên không bị ảnh hưởng gì.',
      en: 'XOR(0,1) gives sum 1, AND(0,1) gives carry 0. This column is done, and since it produces no carry the next column is unaffected.',
    },
    2600,
    [sig('c0', 'p0', '0 + 1 = 1', 'nhớ ra: 0', 'ok'), out('cột 0 → tổng 1 · nhớ 0', 'ok')],
    { sfx: 'blip' }
  );

  push(
    'col1',
    { vi: 'Cột 1: 1 + 1 = 0 và nhớ 1', en: 'Column 1: 1 + 1 = 0 carry 1' },
    {
      vi: 'Đây là chỗ số nhớ ra đời. XOR(1,1) = 0 nên bit tổng là 0; AND(1,1) = 1 nên có nhớ. Số nhớ này chạy sang cột 2 và trở thành đầu vào thứ ba của bộ cộng ở đó.',
      en: 'This is where a carry is born. XOR(1,1) = 0 so the sum bit is 0; AND(1,1) = 1 so there is a carry. That carry travels into column 2 and becomes the third input of the adder there.',
    },
    2800,
    [sig('c1', 'p1', '1 + 1 = 0', 'nhớ ra: 1  →', 'warn'), out('cột 1 → tổng 0 · nhớ 1 sang cột 2', 'warn')],
    { sfx: 'ping' }
  );

  push(
    'col2',
    { vi: 'Cột 2: 1 + 0 + nhớ 1 = 0, lại nhớ tiếp', en: 'Column 2: 1 + 0 + carry 1 = 0, carry again' },
    {
      vi: 'Bộ cộng ở đây phải cộng ba bit chứ không phải hai — đó chính là khác biệt giữa bộ cộng đầy đủ và bán phần. 1 + 0 + 1 = 10, nên tổng 0 và lại sinh nhớ. Chuỗi nhớ tiếp tục lan sang trái.',
      en: 'This adder must sum three bits, not two — that is precisely what makes a full adder full. 1 + 0 + 1 = 10, so the sum is 0 and another carry is produced. The carry chain keeps propagating leftward.',
    },
    2800,
    [sig('c2', 'p2', '1 + 0 + 1 = 0', 'nhớ ra: 1  →', 'warn'), out('cột 2 → tổng 0 · nhớ 1 sang cột 3', 'warn')],
    { sfx: 'ping' }
  );

  push(
    'col3',
    { vi: 'Cột 3: 0 + 0 + nhớ 1 = 1 → kết quả 1001 = 9', en: 'Column 3: 0 + 0 + carry 1 = 1 → result 1001 = 9' },
    {
      vi: 'Cột cuối nhận số nhớ và cho ra 1. Ghép bốn bit tổng lại: 1001, đúng bằng 9. Toàn bộ phép tính được thực hiện bởi tám cổng logic nối dây cố định — không có phần mềm, không có bước nào "suy nghĩ".',
      en: 'The last column takes the carry and yields 1. Assemble the four sum bits: 1001, which is 9. The whole calculation was performed by eight logic gates in fixed wiring — no software, no step that "thinks".',
    },
    3000,
    [sig('c3', 'p3', '0 + 0 + 1 = 1', 'xong', 'ok'), out('kết quả: 1001 = 9  ✅', 'ok')],
    { sfx: 'success' }
  );

  push(
    'ripple',
    { vi: 'Và vì sao cách này chậm khi số có nhiều bit', en: 'And why this gets slow for wide numbers' },
    {
      vi: 'Cột 3 không thể tính xong trước khi cột 2 cho ra số nhớ, mà cột 2 lại đợi cột 1. Số nhớ phải LAN qua từng cột theo thứ tự — với 64 bit là 64 chặng nối tiếp, và độ trễ đó đặt trần cho xung nhịp CPU. Vì thế CPU thật dùng mạch tính trước số nhớ, tốn nhiều cổng hơn hẳn nhưng cho ra kết quả gần như tức thì.',
      en: 'Column 3 cannot finish before column 2 produces its carry, and column 2 waits on column 1. The carry must RIPPLE through every column in order — 64 sequential hops for 64-bit numbers, and that delay caps the CPU clock. Which is why real CPUs use carry-lookahead circuits: far more gates, but the answer arrives almost at once.',
    },
    3100,
    [lines([8, 9]), out('nhớ lan nối tiếp · 64 bit = 64 chặng → giới hạn xung nhịp', 'warn')],
    { sfx: 'lock' }
  );

  return steps;
}

export const logicGatesScenario: Scenario = {
  id: 'logic-gates',
  name: { vi: 'Cổng logic — làm sao transistor biết cộng', en: 'Logic gates — how transistors learn to add' },
  tagline: {
    vi: 'Không có mạch nào "biết đếm". Cộng hai bit cho tổng đúng bằng XOR và nhớ đúng bằng AND — toàn bộ số học của máy tính dựng trên nhận xét đó, cộng với việc nối dây lại.',
    en: 'No circuit "knows how to count". Adding two bits gives a sum identical to XOR and a carry identical to AND — all of computer arithmetic rests on that observation plus some wiring.',
  },
  icon: CircuitBoard,
  accent: '#a78bfa',
  group: 'computer',
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'view',
      label: { vi: 'Tầng nào', en: 'Which level' },
      defaultValue: 'gates',
      choices: [
        {
          value: 'gates',
          label: 'Cổng logic',
          fullLabel: 'Từ công tắc tới AND / XOR',
          color: '#a78bfa',
          hint: { vi: 'tổng = XOR · nhớ = AND', en: 'sum = XOR · carry = AND' },
        },
        {
          value: 'adder',
          label: 'Bộ cộng 4 bit',
          fullLabel: 'Số nhớ lan qua từng cột',
          color: '#34d399',
          hint: { vi: '0110 + 0011 = 1001', en: '0110 + 0011 = 1001' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'adder' ? buildAdder() : buildGates()),
};
