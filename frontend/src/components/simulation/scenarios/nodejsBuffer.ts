/**
 * Node.js · Bài 3.2 — Buffer: dữ liệu nhị phân.
 *
 * Bài này có một ví dụ hiếm hoi vừa ngắn vừa đắt giá cho người Việt: chuỗi
 * `'Xin chào'` dài 8 KÝ TỰ nhưng chiếm 9 BYTE, vì `à` trong UTF-8 tốn hai
 * byte `c3 a0`. Cắt ở byte thứ 7 là cắt ngang giữa chữ `à` và nhận về `�`.
 *
 * Đó chính là nguồn gốc của những dòng chữ vỡ mà ai cũng từng thấy trên web,
 * và là cái bẫy của mọi đoạn mã kiểu "lấy 100 ký tự đầu của mô tả" viết
 * thành `buffer.subarray(0, 100)`.
 *
 * Bố cục: từng byte là một chip trong một làn, có nhãn hex; cộng một bảng
 * so sánh bốn lần cắt để thấy đúng chỗ nào vỡ.
 */

import { Binary } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Dữ liệu thật của ví dụ ──────────────────────────────────── */

/** 'Xin chào' trong UTF-8: 8 ký tự → 9 byte. `à` = c3 a0. */
const BYTES = [
  { hex: '58', ch: 'X' },
  { hex: '69', ch: 'i' },
  { hex: '6e', ch: 'n' },
  { hex: '20', ch: '␠' },
  { hex: '63', ch: 'c' },
  { hex: '68', ch: 'h' },
  { hex: 'c3', ch: 'à' },
  { hex: 'a0', ch: '↑' },
  { hex: '6f', ch: 'o' },
];

const CODE = [
  "const s = 'Xin chào';",
  "const b = Buffer.from(s, 'utf8');",
  '',
  "log('độ dài chuỗi :', s.length, 'ký tự');",
  "log('độ dài buffer:', b.length, 'byte');",
  "log('hex          :', b.toString('hex'));",
];

const CUT_CODE = [
  'for (const n of [6, 7, 8, 9])',
  '  log(`subarray(0,${n}) =`,',
  "    b.subarray(0, n).toString('utf8'));",
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Mã nguồn', en: 'Source' },
    x: 0,
    y: 0,
    w: 430,
    h: 244,
    lines: opts.demo === 'cut' ? CUT_CODE : CODE,
  },
  {
    id: 'cuts',
    kind: 'table',
    title: { vi: 'Cắt ở byte thứ mấy thì vỡ chữ', en: 'Which cut breaks the text' },
    x: 0,
    y: 256,
    w: 430,
    h: 304,
    accent: '#f59e0b',
    columns: [
      { key: 'n', label: 'subarray(0,n)', flex: 1.1 },
      { key: 'txt', label: 'kết quả', flex: 1.4 },
    ],
  },
  {
    id: 'bytes',
    kind: 'lanes',
    title: { vi: "Chín byte của chuỗi 'Xin chào'", en: "The nine bytes of 'Xin chào'" },
    hint: { vi: '8 ký tự · 9 byte', en: '8 characters · 9 bytes' },
    x: 442,
    y: 0,
    w: 558,
    h: 196,
    accent: '#22d3ee',
    lanes: [{ id: 'b', label: 'UTF-8', sub: { vi: 'hex từng byte', en: 'hex per byte' }, accent: '#22d3ee' }],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Kết quả in ra', en: 'Program output' },
    x: 442,
    y: 208,
    w: 558,
    h: 352,
    accent: '#34d399',
    maxLines: 7,
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: 'ok' | 'warn' | 'err' | 'muted' = 'ok'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/** Đẩy n byte đầu vào làn, mỗi byte một chip. */
function pushBytes(from: number, to: number, tone: 'ok' | 'warn' | 'err' | 'info' = 'ok'): PanelOp[] {
  return BYTES.slice(from, to).map((b, i) => ({
    p: 'bytes',
    op: 'push' as const,
    lane: 'b',
    item: { id: `by${from + i}`, label: b.hex, sub: b.ch, tone },
  }));
}

/* ────────────────────────────────────────────────────────────
   A — KÝ TỰ KHÔNG PHẢI LÀ BYTE
   ──────────────────────────────────────────────────────────── */

function buildBytes(): SimStep[] {
  const { steps, push } = collector();

  push(
    'string',
    { vi: 'Một chuỗi tám ký tự', en: 'A string of eight characters' },
    {
      vi: "`'Xin chào'`. Đếm bằng mắt: X-i-n-dấu cách-c-h-à-o, tám ký tự. `s.length` cũng trả về 8. Cho tới đây mọi thứ đều như mong đợi.",
      en: "`'Xin chào'`. Count by eye: X-i-n-space-c-h-à-o, eight characters. `s.length` returns 8 too. So far everything matches intuition.",
    },
    2200,
    [lines([1]), out('độ dài chuỗi : 8 ký tự')],
    { sfx: 'click' }
  );

  push(
    'ascii',
    { vi: 'Sáu ký tự đầu — mỗi ký tự một byte', en: 'The first six — one byte each' },
    {
      vi: 'ASCII thì rẻ: `X` là `58`, `i` là `69`, dấu cách là `20`. Sáu ký tự đầu chiếm đúng sáu byte, nên tới đây "ký tự" và "byte" vẫn còn là một.',
      en: 'ASCII is cheap: `X` is `58`, `i` is `69`, the space is `20`. The first six characters take exactly six bytes, so up to here "character" and "byte" still mean the same thing.',
    },
    2400,
    [lines([2]), ...pushBytes(0, 6, 'ok')],
    { sfx: 'blip' }
  );

  push(
    'accent',
    { vi: 'Chữ à tốn HAI byte', en: 'The letter à costs TWO bytes' },
    {
      vi: 'Trong UTF-8, một ký tự có dấu tiếng Việt chiếm hai byte — `à` là cặp `c3 a0`. Emoji còn tốn bốn. Từ đây trở đi, "ký tự" và "byte" là hai đại lượng khác nhau.',
      en: 'In UTF-8 a Vietnamese accented letter takes two bytes — `à` is the pair `c3 a0`. Emoji take four. From here on, "character" and "byte" are two different quantities.',
    },
    2600,
    [...pushBytes(6, 8, 'warn'), out('(à = c3 a0 — hai byte cho MỘT ký tự)', 'warn')],
    {
      sfx: 'ping',
      teachingNote: {
        vi: 'Chỉ vào hai chip vàng: đây là toàn bộ nguyên nhân của bài học.',
        en: 'Point at the two amber chips: they are the entire cause of this lesson.',
      },
    }
  );

  push(
    'total',
    { vi: 'Tám ký tự, chín byte', en: 'Eight characters, nine bytes' },
    {
      vi: 'Byte cuối là `6f` — chữ `o`. Tổng cộng chín byte cho tám ký tự. `b.length` là 9, `s.length` là 8, và cả hai đều đúng: chúng đếm hai thứ khác nhau.',
      en: 'The last byte is `6f` — the letter `o`. Nine bytes for eight characters. `b.length` is 9, `s.length` is 8, and both are right: they count different things.',
    },
    2500,
    [
      ...pushBytes(8, 9, 'ok'),
      lines([4, 5, 6]),
      out('độ dài buffer: 9 byte', 'warn'),
      out('hex          : 58696e206368c3a06f'),
    ],
    { sfx: 'ping' }
  );

  push(
    'verdict',
    { vi: 'Buffer là byte thô nằm NGOÀI heap của V8', en: 'A Buffer is raw bytes OUTSIDE the V8 heap' },
    {
      vi: 'Mỗi khi Node chạm vào thế giới bên ngoài — file, socket, ảnh, mã hoá — dữ liệu về dưới dạng byte, và Buffer là cách bạn cầm chúng. Mọi sự kiện `data` của stream đều trao cho bạn một Buffer. Chọn biến thể "Cắt sai chỗ" để xem chuyện gì xảy ra khi cắt bừa.',
      en: 'Every time Node touches the outside world — files, sockets, images, encryption — data arrives as bytes, and a Buffer is how you hold them. Every `data` event of a stream hands you one. Pick the "Cut in the wrong place" variant to see what a careless cut does.',
    },
    2700,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — CẮT SAI CHỖ
   ──────────────────────────────────────────────────────────── */

function buildCut(): SimStep[] {
  const { steps, push } = collector();

  const allBytes = [...pushBytes(0, 6, 'muted' as 'ok'), ...pushBytes(6, 8, 'warn'), ...pushBytes(8, 9, 'muted' as 'ok')];

  push(
    'setup',
    { vi: 'Cắt bốn chỗ khác nhau, cùng một buffer', en: 'Four different cuts, one buffer' },
    {
      vi: 'Vẫn chín byte đó. Ta cắt lấy 6, 7, 8 rồi 9 byte đầu và giải mã lại thành chuỗi. Ba trong bốn lần cho kết quả bình thường.',
      en: 'The same nine bytes. We take the first 6, 7, 8 and then 9 bytes and decode them back to a string. Three of the four come out fine.',
    },
    2300,
    [lines([1, 2, 3]), ...allBytes],
    { sfx: 'click' }
  );

  push(
    'cut6',
    { vi: 'Cắt 6 byte — an toàn', en: 'Cut at 6 bytes — safe' },
    {
      vi: 'Sáu byte đầu đều là ASCII trọn vẹn, nên giải mã ra `"Xin ch"` không sứt mẻ gì. Cắt trước một ký tự nhiều byte thì luôn an toàn.',
      en: 'The first six bytes are complete ASCII, so they decode to `"Xin ch"` intact. Cutting before a multi-byte character is always safe.',
    },
    2200,
    [{ p: 'cuts', op: 'push', item: { id: 'c6', label: '6', cells: ['subarray(0,6)', '"Xin ch"'], tone: 'ok' } }, out('subarray(0,6) = "Xin ch"')],
    { sfx: 'blip' }
  );

  push(
    'cut7',
    { vi: 'Cắt 7 byte — chữ vỡ', en: 'Cut at 7 bytes — the text breaks' },
    {
      vi: 'Byte thứ 7 là `c3` — nửa ĐẦU của chữ `à`. Nửa sau `a0` bị bỏ lại. Bộ giải mã UTF-8 gặp một cặp dở dang nên thay bằng `�`, ký tự thay thế. Đây chính là nguồn gốc của những dòng chữ vỡ trên web.',
      en: 'The seventh byte is `c3` — the FIRST half of `à`. The second half `a0` is left behind. The UTF-8 decoder meets a half-finished pair and substitutes `�`, the replacement character. This is where mangled text on the web comes from.',
    },
    2800,
    [
      { p: 'bytes', op: 'tone', lane: 'b', key: 'by6', tone: 'err', sub: '✂ cắt ở đây' },
      { p: 'bytes', op: 'tone', lane: 'b', key: 'by7', tone: 'muted', sub: 'bị bỏ lại' },
      { p: 'cuts', op: 'push', item: { id: 'c7', label: '7', cells: ['subarray(0,7)', '"Xin ch�"'], tone: 'err' } },
      out('subarray(0,7) = "Xin ch�"', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Dừng lại: hỏi lớp đã từng thấy ký tự ◆? ở đâu chưa — và giờ họ biết vì sao.',
        en: 'Pause: ask who has seen that ◆? character before — now they know why.',
      },
    }
  );

  push(
    'cut8',
    { vi: 'Cắt 8 byte — lành lại', en: 'Cut at 8 bytes — whole again' },
    {
      vi: 'Lấy đủ cả cặp `c3 a0` thì `à` hiện ra nguyên vẹn: `"Xin chà"`. Ranh giới an toàn không nằm ở số ký tự, mà ở chỗ một ký tự KẾT THÚC.',
      en: 'Take the full `c3 a0` pair and `à` comes back whole: `"Xin chà"`. The safe boundary is not a character count — it is wherever a character ENDS.',
    },
    2400,
    [
      { p: 'bytes', op: 'tone', lane: 'b', key: 'by6', tone: 'ok', sub: 'à' },
      { p: 'bytes', op: 'tone', lane: 'b', key: 'by7', tone: 'ok', sub: '↑' },
      { p: 'cuts', op: 'push', item: { id: 'c8', label: '8', cells: ['subarray(0,8)', '"Xin chà"'], tone: 'ok' } },
      out('subarray(0,8) = "Xin chà"'),
    ],
    { sfx: 'ping' }
  );

  push(
    'cut9',
    { vi: 'Cắt 9 byte — nguyên chuỗi', en: 'Cut at 9 bytes — the whole string' },
    {
      vi: 'Đủ chín byte, được lại `"Xin chào"`. Bốn lần cắt, một lần vỡ — và lần vỡ ấy không có lỗi nào được ném ra. Mã vẫn chạy, chỉ có chữ là sai.',
      en: 'All nine bytes, and `"Xin chào"` is back. Four cuts, one broken — and the broken one threw no error. The code kept running; only the text was wrong.',
    },
    2500,
    [
      { p: 'cuts', op: 'push', item: { id: 'c9', label: '9', cells: ['subarray(0,9)', '"Xin chào"'], tone: 'ok' } },
      out('subarray(0,9) = "Xin chào"'),
    ],
    { sfx: 'ping' }
  );

  push(
    'verdict',
    { vi: 'Cắt CHUỖI, đừng cắt BUFFER', en: 'Truncate the STRING, not the BUFFER' },
    {
      vi: 'Câu "lấy 100 ký tự đầu của mô tả" viết thành `buffer.subarray(0, 100)` là cùng một cái bẫy, chỉ khác quy mô. Và nhớ thêm: cột `VARCHAR(100)` trong cơ sở dữ liệu đếm KÝ TỰ, trong khi vài bảng mã lại đếm BYTE — một mô tả toàn tiếng Việt có dấu chạm trần sớm hơn bạn tưởng.',
      en: '"Keep the first 100 characters of the description" written as `buffer.subarray(0, 100)` is the same trap at a different scale. And remember: a `VARCHAR(100)` column counts CHARACTERS, while some encodings count BYTES — an all-accented Vietnamese description hits the ceiling sooner than you expect.',
    },
    2900,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsBufferScenario: Scenario = {
  id: 'nodejs-buffer',
  name: { vi: 'Buffer — ký tự không phải là byte', en: 'Buffers — characters are not bytes' },
  tagline: {
    vi: "'Xin chào' dài 8 ký tự nhưng chiếm 9 byte. Cắt ở byte thứ 7 là cắt ngang giữa chữ à — và đó chính là nguồn gốc của những dòng chữ vỡ trên web.",
    en: "'Xin chào' is 8 characters but 9 bytes. Cutting at byte 7 slices through the middle of à — and that is where mangled text on the web comes from.",
  },
  icon: Binary,
  accent: '#22d3ee',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '3.2',
    slug: 'nodejs-3-2-buffer',
    title: { vi: 'Buffer: dữ liệu nhị phân', en: 'Buffers: binary data' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'demo',
      label: { vi: 'Thí nghiệm', en: 'Experiment' },
      defaultValue: 'bytes',
      choices: [
        {
          value: 'bytes',
          label: '8 ký tự → 9 byte',
          fullLabel: 'Ký tự không phải là byte',
          color: '#22d3ee',
          hint: { vi: 'à tốn hai byte, emoji tốn bốn', en: 'à costs two bytes, emoji four' },
        },
        {
          value: 'cut',
          label: 'Cắt sai chỗ',
          fullLabel: 'subarray(0,7) → "Xin ch◆?"',
          color: '#f43f5e',
          hint: { vi: 'chữ vỡ mà không có lỗi nào được ném', en: 'text breaks and nothing throws' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.demo === 'cut' ? buildCut() : buildBytes()),
};
