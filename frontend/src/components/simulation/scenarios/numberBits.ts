/**
 * Máy tính · CEA201 / CSI104 — số âm và số thực trong máy tính.
 *
 * Máy tính chỉ có bit. Muốn biểu diễn số âm phải quy ước, và quy ước được
 * chọn — *bù hai* — không phải vì nó dễ hiểu với người, mà vì nó khiến phần
 * cứng ĐƠN GIẢN đi: cùng một mạch cộng dùng được cho cả số dương lẫn số âm,
 * không cần mạch trừ riêng.
 *
 * Phần thứ hai giải thích câu hỏi kinh điển của mọi lập trình viên: vì sao
 * `0.1 + 0.2` ra `0.30000000000000004`. Câu trả lời không phải "máy tính sai"
 * mà là: 0,1 trong hệ nhị phân là một số THẬP PHÂN VÔ HẠN TUẦN HOÀN, y như 1/3
 * trong hệ mười. Bạn không thể viết trọn nó bằng 64 bit, nên thứ được lưu chỉ
 * là số gần đúng — và tổng hai số gần đúng thì gần đúng.
 */

import { Binary } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

const TWOS_CODE = [
  '// Muốn biểu diễn -5 bằng 8 bit',
  '  5 = 0000 0101',
  '  đảo bit → 1111 1010',
  '  cộng 1  → 1111 1011   = -5',
  '',
  '// Vì sao? Vì phép cộng tự nhiên ra đúng:',
  '  0000 0101  ( 5)',
  '+ 1111 1011  (-5)',
  '= 0000 0000  ( 0)   ← bit tràn bị bỏ',
];

const FLOAT_CODE = [
  '> 0.1 + 0.2',
  '0.30000000000000004',
  '',
  '// 0,1 trong hệ nhị phân:',
  '// 0.0001100110011001100...  (vô hạn tuần hoàn)',
  '',
  '// 64 bit chỉ giữ được 52 bit phần định trị',
  '// → phải cắt → sai số → cộng vào nhau',
];

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: opts.view === 'float' ? { vi: 'Câu hỏi kinh điển', en: 'The classic question' } : { vi: 'Quy tắc bù hai', en: 'The two’s complement rule' },
    file: opts.view === 'float' ? 'node' : 'bits',
    x: 0,
    y: 0,
    w: 470,
    h: 272,
    lines: opts.view === 'float' ? FLOAT_CODE : TWOS_CODE,
  },
  {
    id: 'bits',
    kind: 'table',
    title: { vi: 'Từng bit nghĩa là gì', en: 'What each bit means' },
    x: 0,
    y: 284,
    w: 470,
    h: 276,
    accent: '#38bdf8',
    columns: [
      { key: 'b', label: 'bit', flex: 1.1 },
      { key: 'm', label: 'giá trị', flex: 1 },
    ],
  },
  {
    id: 'range',
    kind: 'lanes',
    title: { vi: 'Hệ quả', en: 'Consequences' },
    x: 482,
    y: 0,
    w: 518,
    h: 296,
    accent: '#f59e0b',
    layout: 'rows',
    lanes: [
      { id: 'a', label: 'quan sát', sub: { vi: 'điều rút ra', en: 'what follows' }, accent: '#34d399' },
      { id: 'b', label: 'cái bẫy', sub: { vi: 'chỗ hay sai', en: 'where it bites' }, accent: '#f43f5e' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Thử nghiệm', en: 'Experiment' },
    file: 'repl',
    x: 482,
    y: 308,
    w: 518,
    h: 252,
    accent: '#34d399',
    maxLines: 7,
  },
];

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info';
const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: Tone = 'muted'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const bit = (id: string, b: string, m: string, tone: Tone): PanelOp => ({
  p: 'bits',
  op: 'push',
  item: { id, label: b, cells: [b, m], tone },
});
const note = (lane: string, id: string, label: string, sub: string, tone: Tone): PanelOp => ({
  p: 'range',
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

/* ── A — BÙ HAI ──────────────────────────────────────────────── */

function buildTwos(): SimStep[] {
  const { steps, push } = collector();

  push(
    'naive',
    { vi: 'Cách hiển nhiên — và vì sao nó bị loại', en: 'The obvious way — and why it was rejected' },
    {
      vi: 'Ý tưởng đầu tiên ai cũng nghĩ ra: lấy bit đầu làm dấu, phần còn lại là độ lớn. Nhưng nó đẻ ra hai vấn đề: tồn tại cả `+0` lẫn `−0` (hai dãy bit khác nhau cho cùng một số), và phép cộng không còn tự nhiên — phần cứng phải kiểm dấu rồi rẽ nhánh.',
      en: 'The first idea everyone has: use the top bit as a sign and the rest as magnitude. It creates two problems: both `+0` and `−0` exist (two bit patterns for one number), and addition stops being natural — the hardware must inspect signs and branch.',
    },
    2700,
    [lines([1, 2]), bit('n1', '0000 0000', '+0', 'warn'), bit('n2', '1000 0000', '−0  ← trùng nghĩa', 'err'), out('dấu-độ lớn: hai cách viết số 0', 'err')],
    { sfx: 'click' }
  );

  push(
    'rule',
    { vi: 'Bù hai: đảo hết bit rồi cộng 1', en: 'Two’s complement: invert every bit, then add one' },
    {
      vi: 'Quy tắc máy móc và dễ nhớ. `5` là `0000 0101`; đảo thành `1111 1010`; cộng 1 thành `1111 1011`. Dãy bit đó CHÍNH LÀ −5. Nhìn qua thì tuỳ tiện, nhưng bước sau sẽ cho thấy vì sao nó là lựa chọn duy nhất hợp lý.',
      en: 'A mechanical, memorable rule. `5` is `0000 0101`; invert to `1111 1010`; add one to get `1111 1011`. That pattern IS −5. It looks arbitrary until the next step shows why it is the only sensible choice.',
    },
    2800,
    [lines([2, 3, 4]), bit('t1', '0000 0101', '5', 'ok'), bit('t2', '1111 1011', '−5', 'info'), out('−5 = đảo(5) + 1', 'info')],
    { sfx: 'blip' }
  );

  push(
    'why',
    { vi: 'Vì sao lại là quy tắc đó: phép cộng tự nhiên ra đúng', en: 'Why that rule: addition just works' },
    {
      vi: 'Cộng `0000 0101` với `1111 1011` theo đúng cách cộng nhị phân bình thường, không quan tâm dấu. Kết quả là `1 0000 0000` — bit thứ chín tràn ra ngoài và bị bỏ, còn lại đúng `0000 0000`. Nghĩa là 5 + (−5) = 0 mà mạch cộng không hề biết khái niệm "số âm". Đây là toàn bộ lý do bù hai thắng: nó biến phép trừ thành phép cộng.',
      en: 'Add `0000 0101` to `1111 1011` using plain binary addition, ignoring signs entirely. The result is `1 0000 0000` — the ninth bit overflows and is discarded, leaving exactly `0000 0000`. So 5 + (−5) = 0 while the adder has no notion of "negative" at all. That is why two’s complement won: it turns subtraction into addition.',
    },
    3100,
    [
      lines([6, 7, 8, 9]),
      note('a', 'a1', 'một mạch cộng dùng cho cả hai dấu', 'không cần mạch trừ riêng', 'ok'),
      note('a', 'a2', 'chỉ có MỘT cách viết số 0', 'không còn −0', 'ok'),
      out('5 + (−5) = 0 · mạch cộng không cần biết dấu', 'ok'),
    ],
    {
      sfx: 'success',
      teachingNote: {
        vi: 'Đây là điểm chốt: quy ước được chọn vì nó làm PHẦN CỨNG đơn giản, không phải vì dễ hiểu.',
        en: 'The key point: the convention was chosen to simplify HARDWARE, not to be intuitive.',
      },
    }
  );

  push(
    'asym',
    { vi: 'Hệ quả lệch: có −128 nhưng không có +128', en: 'The asymmetry: −128 exists, +128 does not' },
    {
      vi: 'Với 8 bit, dải giá trị là −128 đến 127. Lệch một bên vì số 0 chiếm mất một chỗ ở nửa dương. Đây là nguồn của một lỗi thật: `Math.abs(-128)` trong kiểu 8 bit trả về... −128, vì +128 không tồn tại để trả về. Cùng lỗi đó có ở 32 bit với `Integer.MIN_VALUE`.',
      en: 'With 8 bits the range is −128 to 127. It is lopsided because zero takes one slot from the positive half. This causes a real bug: `Math.abs(-128)` in an 8-bit type returns… −128, because +128 does not exist to be returned. The same bug exists at 32 bits with `Integer.MIN_VALUE`.',
    },
    3000,
    [
      bit('t3', '1000 0000', '−128 (không có +128)', 'warn'),
      note('b', 'b1', 'abs(MIN_VALUE) vẫn âm', 'lỗi thật, có trong nhiều ngôn ngữ', 'err'),
      out('dải 8 bit: −128 … 127 · lệch một bên', 'warn'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'overflow',
    { vi: 'Và tràn số thì im lặng: 127 + 1 = −128', en: 'And overflow is silent: 127 + 1 = −128' },
    {
      vi: 'Cộng 1 vào `0111 1111` cho ra `1000 0000`, mà theo bù hai thì đó là −128. Không có ngoại lệ nào được ném ra, không có cảnh báo — số dương lớn nhất cộng một thành số âm nhỏ nhất. Đây là gốc rễ của cả một họ lỗ hổng bảo mật, và là lý do các ngôn ngữ hiện đại kiểm tra tràn hoặc dùng số nguyên lớn tuỳ ý.',
      en: 'Adding 1 to `0111 1111` yields `1000 0000`, which in two’s complement is −128. No exception is thrown, no warning — the largest positive becomes the smallest negative. This is the root of a whole family of security bugs, and why modern languages either check for overflow or use arbitrary-precision integers.',
    },
    3000,
    [bit('t4', '0111 1111 + 1', '= −128  ⚠ tràn im lặng', 'err'), out('127 + 1 = −128 · không ngoại lệ, không cảnh báo', 'err')],
    { sfx: 'error' }
  );

  return steps;
}

/* ── B — SỐ THỰC IEEE-754 ────────────────────────────────────── */

function buildFloat(): SimStep[] {
  const { steps, push } = collector();

  push(
    'question',
    { vi: '0.1 + 0.2 không bằng 0.3 — và đó không phải lỗi', en: '0.1 + 0.2 is not 0.3 — and that is not a bug' },
    {
      vi: 'Gõ vào bất kỳ ngôn ngữ nào dùng số thực 64 bit — JavaScript, Python, Java, C — kết quả đều y hệt: `0.30000000000000004`. Cùng một câu trả lời ở mọi nơi thì đó không phải lỗi của ngôn ngữ, mà là hệ quả của cách biểu diễn số.',
      en: 'Type it into any language using 64-bit floats — JavaScript, Python, Java, C — and you get the identical result: `0.30000000000000004`. The same answer everywhere means this is not a language bug but a consequence of the representation.',
    },
    2700,
    [lines([1, 2]), out('> 0.1 + 0.2', 'info'), out('0.30000000000000004', 'err')],
    { sfx: 'click' }
  );

  push(
    'thirds',
    { vi: 'So sánh với 1/3 trong hệ mười', en: 'Compare with 1/3 in base ten' },
    {
      vi: 'Bạn không viết trọn được 1/3 bằng số thập phân: 0,333… kéo dài vô hạn. Cắt ở đâu cũng ra số gần đúng, và 0,333 + 0,333 + 0,333 = 0,999 chứ không phải 1. Chẳng ai gọi đó là lỗi của hệ thập phân — chỉ là 3 không chia hết 10.',
      en: 'You cannot write 1/3 exactly in decimal: 0.333… goes on forever. Cut it anywhere and you have an approximation, and 0.333 + 0.333 + 0.333 = 0.999, not 1. Nobody calls that a decimal bug — 3 simply does not divide 10.',
    },
    2800,
    [bit('f1', '1/3 hệ 10', '0,333…  vô hạn', 'muted'), out('0,333 + 0,333 + 0,333 = 0,999 ≠ 1', 'muted')],
    { sfx: 'blip' }
  );

  push(
    'binary',
    { vi: 'Trong hệ nhị phân, 0,1 chính là số vô hạn tuần hoàn đó', en: 'In binary, 0.1 is exactly that kind of repeating number' },
    {
      vi: 'Hệ nhị phân chỉ viết trọn được những phân số có mẫu là luỹ thừa của 2: 0,5 · 0,25 · 0,125. Còn 0,1 là 1/10, mà 10 = 2 × 5 — cái thừa số 5 đó không biểu diễn được. Kết quả: `0.0001100110011...` lặp mãi. Máy giữ 52 bit rồi làm tròn, nên thứ thật sự nằm trong bộ nhớ hơi lớn hơn 0,1 một chút.',
      en: 'Binary can write exactly only fractions whose denominator is a power of two: 0.5, 0.25, 0.125. But 0.1 is 1/10, and 10 = 2 × 5 — that factor of 5 cannot be expressed. The result is `0.0001100110011...` repeating forever. The machine keeps 52 bits and rounds, so what actually sits in memory is slightly larger than 0.1.',
    },
    3100,
    [
      lines([4, 5]),
      bit('f2', '0,1 hệ 2', '0.000110011…  vô hạn', 'warn'),
      bit('f3', 'đã lưu', '0,1000000000000000055…', 'err'),
      note('a', 'g1', 'chỉ số có mẫu luỹ thừa 2 là chính xác', '0,5 · 0,25 · 0,125 → đúng tuyệt đối', 'ok'),
      out('0.1 lưu thật = 0.1000000000000000055511151231257827', 'warn'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Hỏi lớp: vậy 0.5 + 0.25 có sai số không? Không — cả hai đều biểu diễn chính xác.',
        en: 'Ask the class: does 0.5 + 0.25 have error? No — both are exactly representable.',
      },
    }
  );

  push(
    'sum',
    { vi: 'Cộng hai số gần đúng thì được một số gần đúng', en: 'Add two approximations, get an approximation' },
    {
      vi: '0,1 lưu thành hơi lớn hơn, 0,2 cũng vậy. Tổng của chúng lệch khỏi 0,3 đủ để lọt ra ngoài số gần nhất mà 64 bit biểu diễn được cho 0,3 — nên khi in ra, con số phải hiện đúng thứ nó là. Máy không hề sai ở bước nào; sai số đã có sẵn từ lúc bạn viết chữ "0.1".',
      en: 'Stored 0.1 is slightly too big, and so is 0.2. Their sum drifts from 0.3 by just enough to fall outside the nearest 64-bit representation of 0.3 — so when printed, the number shows what it actually is. The machine made no mistake anywhere; the error was baked in the moment you wrote "0.1".',
    },
    2900,
    [note('b', 'g2', 'so sánh bằng === là sai', 'dùng |a−b| < epsilon', 'err'), out('0.1 + 0.2 = 0.30000000000000004 · đúng như phải thế', 'info')],
    { sfx: 'stream' }
  );

  push(
    'money',
    { vi: 'Và vì sao TUYỆT ĐỐI không lưu tiền bằng số thực', en: 'And why you must NEVER store money as a float' },
    {
      vi: 'Sai số cỡ 10⁻¹⁷ nghe như vô hại, nhưng nó tích luỹ qua hàng triệu phép cộng, và quan trọng hơn: nó làm hai con số đáng lẽ bằng nhau trở nên khác nhau. Cách đúng là lưu số nguyên đơn vị nhỏ nhất — lưu 1999 xu thay vì 19,99 đồng — hoặc dùng kiểu decimal chính xác tuỳ ý. Cùng lý do đó, đừng bao giờ so sánh hai số thực bằng `===`.',
      en: 'An error around 10⁻¹⁷ sounds harmless, but it accumulates across millions of additions and, more importantly, makes two numbers that should be equal differ. The correct approach is to store integers of the smallest unit — 1999 cents rather than 19.99 — or use an arbitrary-precision decimal type. For the same reason, never compare two floats with `===`.',
    },
    3100,
    [lines([7, 8]), out('lưu 1999 (xu) thay vì 19.99 · so sánh bằng epsilon', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

export const numberBitsScenario: Scenario = {
  id: 'number-bits',
  name: { vi: 'Số âm và số thực trong máy tính', en: 'Negative and fractional numbers in a computer' },
  tagline: {
    vi: 'Bù hai được chọn không phải vì dễ hiểu, mà vì nó biến phép trừ thành phép cộng — một mạch dùng cho cả hai dấu. Còn 0.1 + 0.2 ≠ 0.3 vì 0,1 trong hệ nhị phân là số vô hạn tuần hoàn, y như 1/3 trong hệ mười.',
    en: 'Two’s complement was chosen not for clarity but because it turns subtraction into addition — one circuit for both signs. And 0.1 + 0.2 ≠ 0.3 because 0.1 in binary repeats forever, exactly like 1/3 in decimal.',
  },
  icon: Binary,
  accent: '#34d399',
  group: 'computer',
  lesson: {
    course: 'introduction-to-computer-science',
    subject: 'CSI104',
    code: '3.1',
    slug: 'csi104-3-1-luu-so',
    title: { vi: 'Lưu số: số nguyên & số thực', en: 'Storing numbers: integers & floats' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'view',
      label: { vi: 'Loại số', en: 'Kind of number' },
      defaultValue: 'twos',
      choices: [
        {
          value: 'twos',
          label: 'Số âm — bù hai',
          fullLabel: 'Vì sao đảo bit rồi cộng 1',
          color: '#34d399',
          hint: { vi: '127 + 1 = −128, im lặng', en: '127 + 1 = −128, silently' },
        },
        {
          value: 'float',
          label: 'Số thực — IEEE-754',
          fullLabel: 'Vì sao 0.1 + 0.2 ≠ 0.3',
          color: '#f59e0b',
          hint: { vi: 'đừng lưu tiền bằng float', en: 'never store money as a float' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'float' ? buildFloat() : buildTwos()),
};
