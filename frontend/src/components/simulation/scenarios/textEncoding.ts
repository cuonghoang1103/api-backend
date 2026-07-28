/**
 * Máy tính · CSI104 — chữ được lưu thành byte như thế nào.
 *
 * Máy tính không lưu chữ, nó lưu số. Mọi thứ còn lại là quy ước ánh xạ chữ
 * sang số, và quy ước ấy đã đi một chặng đường dài:
 *
 *   ASCII  — 128 ký tự, đủ cho tiếng Anh, mỗi ký tự đúng 1 byte.
 *   Unicode— gán số cho mọi ký tự của mọi ngôn ngữ (hơn 150.000 ký tự).
 *   UTF-8  — cách MÃ HOÁ những con số đó thành byte, dài từ 1 tới 4 byte.
 *
 * Chỗ gây đau đầu nằm ở chữ cuối: vì số byte mỗi ký tự KHÔNG cố định, mọi giả
 * định kiểu "một ký tự là một byte" hay "độ dài chuỗi là số ký tự người ta
 * nhìn thấy" đều sai — và sai một cách âm thầm, chỉ lộ ra khi gặp tiếng Việt,
 * tiếng Nhật hoặc emoji.
 *
 * Bài này giải thích luôn hai chuyện rất đời: vì sao cắt chuỗi có dấu đôi khi
 * ra ký tự lạ, và vì sao `"👨‍👩‍👧".length` trong JavaScript trả về 8.
 */

import { Table2 } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

const ASCII_CODE = [
  '// ASCII: 128 ký tự, mỗi ký tự 1 byte',
  "'A' → 65 → 0100 0001",
  "'a' → 97 → 0110 0001",
  '',
  '// Khoảng cách A→a đúng bằng 32 = 1 bit',
  "toLowerCase = bật bit thứ 6  (65 | 32 = 97)",
];

const UTF_CODE = [
  '// UTF-8: số byte thay đổi theo ký tự',
  "'A'  → 1 byte   41",
  "'ế'  → 3 byte   E1 BA BF",
  "'漢' → 3 byte   E6 BC A2",
  "'😀' → 4 byte   F0 9F 98 80",
  '',
  '> "Tuế".length      // 3 ký tự',
  '> Buffer.byteLength("Tuế")   // 5 byte',
];

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: opts.view === 'utf8' ? { vi: 'Khi vượt khỏi tiếng Anh', en: 'Beyond English' } : { vi: 'ASCII — bảng gốc', en: 'ASCII — the original table' },
    file: 'text',
    x: 0,
    y: 0,
    w: 470,
    h: 250,
    lines: opts.view === 'utf8' ? UTF_CODE : ASCII_CODE,
  },
  {
    id: 'bytes',
    kind: 'table',
    title: { vi: 'Ký tự thành byte', en: 'Characters as bytes' },
    x: 0,
    y: 262,
    w: 470,
    h: 298,
    accent: '#38bdf8',
    columns: [
      { key: 'c', label: 'ký tự', flex: 0.6 },
      { key: 'b', label: 'byte thật sự lưu', flex: 1.4 },
    ],
  },
  {
    id: 'facts',
    kind: 'lanes',
    title: { vi: 'Hệ quả khi lập trình', en: 'What it means when you code' },
    x: 482,
    y: 0,
    w: 518,
    h: 300,
    accent: '#f59e0b',
    layout: 'rows',
    lanes: [
      { id: 'ok', label: 'dùng được', sub: { vi: 'giả định đúng', en: 'safe assumptions' }, accent: '#34d399' },
      { id: 'bad', label: 'cái bẫy', sub: { vi: 'giả định sai', en: 'broken assumptions' }, accent: '#f43f5e' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Thử trong REPL', en: 'In the REPL' },
    file: 'node',
    x: 482,
    y: 312,
    w: 518,
    h: 248,
    accent: '#34d399',
    maxLines: 7,
  },
];

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info';
const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: Tone = 'muted'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const brow = (id: string, c: string, b: string, tone: Tone): PanelOp => ({
  p: 'bytes',
  op: 'push',
  item: { id, label: c, cells: [c, b], tone },
});
const fact = (lane: string, id: string, label: string, sub: string, tone: Tone): PanelOp => ({
  p: 'facts',
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

/* ── A — ASCII ───────────────────────────────────────────────── */

function buildAscii(): SimStep[] {
  const { steps, push } = collector();

  push(
    'map',
    { vi: 'Chữ chỉ là số được quy ước', en: 'Letters are just agreed-upon numbers' },
    {
      vi: 'Không có gì trong RAM "là chữ A". Có một byte mang giá trị 65, và mọi người đồng ý rằng khi hiển thị thì vẽ hình chữ A. Đổi bảng quy ước là cùng byte đó thành ký tự khác — đó chính là gốc rễ của mọi lỗi hiển thị chữ loạn.',
      en: 'Nothing in RAM "is the letter A". There is a byte holding 65, and everyone agreed that when displayed it should be drawn as an A. Change the agreed table and that same byte becomes a different character — the root of every garbled-text bug.',
    },
    2600,
    [lines([1, 2, 3]), brow('a1', 'A', '65   0100 0001', 'ok'), brow('a2', 'a', '97   0110 0001', 'ok'), out("'A' === 65 · quy ước, không phải bản chất", 'muted')],
    { sfx: 'click' }
  );

  push(
    'bit',
    { vi: 'Bảng ASCII được thiết kế rất khéo', en: 'The ASCII table was cleverly designed' },
    {
      vi: "Khoảng cách giữa 'A' và 'a' đúng bằng 32, tức là đúng một bit. Đổi hoa thành thường chỉ cần bật bit thứ sáu — không cần bảng tra, không cần điều kiện. Các chữ số cũng nằm liền nhau từ 48, nên `'7' - '0'` cho ra đúng số 7. Những mẹo này vẫn còn được dùng khắp nơi trong mã nguồn hôm nay.",
      en: "The gap between 'A' and 'a' is exactly 32 — exactly one bit. Converting case means setting bit six: no lookup table, no branching. Digits are contiguous from 48, so `'7' - '0'` yields the number 7. These tricks are still in use throughout today’s code.",
    },
    2900,
    [
      lines([5, 6]),
      fact('ok', 'k1', 'đổi hoa/thường = 1 phép OR', "65 | 32 = 97", 'ok'),
      fact('ok', 'k2', "'7' − '0' = 7", 'chữ số nằm liền nhau', 'ok'),
      out("'A' | 32 → 'a'   ·   '7' - '0' → 7", 'ok'),
    ],
    { sfx: 'blip' }
  );

  push(
    'limit',
    { vi: 'Nhưng 128 chỗ thì không đủ cho thế giới', en: 'But 128 slots is not enough for the world' },
    {
      vi: 'Tiếng Việt có dấu, tiếng Nhật có hàng nghìn chữ, chưa kể tiếng Ả Rập, Hy Lạp, Thái. Suốt thập niên 90 mỗi vùng tự làm một bảng riêng cho 128 chỗ còn lại của byte — và khi hai bảng gặp nhau thì chữ hiện thành ký tự loạn. Đó là lý do Unicode ra đời.',
      en: 'Vietnamese has diacritics, Japanese has thousands of characters, and that is before Arabic, Greek or Thai. Through the nineties each region invented its own table for the byte’s remaining 128 slots — and when two tables met, text turned to garbage. That is why Unicode exists.',
    },
    2900,
    [
      brow('a3', 'ế', 'không có chỗ trong ASCII', 'err'),
      fact('bad', 'b1', 'mỗi vùng một bảng riêng', 'gặp nhau là chữ loạn', 'err'),
      out('128 chỗ · không đủ cho 150.000 ký tự', 'err'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'unicode',
    { vi: 'Unicode gán số, UTF-8 quyết định cách lưu', en: 'Unicode assigns numbers, UTF-8 decides how to store them' },
    {
      vi: 'Hai chuyện khác nhau mà rất hay bị nhầm là một. Unicode nói "ký tự ế mang số 7871", không nói gì về byte. UTF-8 là một trong nhiều cách mã hoá con số đó thành byte — và là cách đã thắng, vì nó tương thích ngược hoàn toàn với ASCII. Chọn nhánh bên cạnh để xem nó làm thế nào.',
      en: 'Two different things that are constantly conflated. Unicode says "the character ế has number 7871" and says nothing about bytes. UTF-8 is one of several ways to encode that number into bytes — and the one that won, because it is perfectly backward compatible with ASCII. Pick the other option to see how.',
    },
    2900,
    [lines([]), out('Unicode = số hiệu · UTF-8 = cách biến số thành byte', 'info')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── B — UTF-8 ───────────────────────────────────────────────── */

function buildUtf8(): SimStep[] {
  const { steps, push } = collector();

  push(
    'compat',
    { vi: 'Nước cờ hay nhất của UTF-8: giữ nguyên ASCII', en: 'UTF-8’s smartest move: leave ASCII untouched' },
    {
      vi: 'Mọi ký tự ASCII vẫn là đúng một byte, đúng giá trị cũ. Nghĩa là một file tiếng Anh thuần đọc bằng ASCII hay UTF-8 đều ra kết quả y hệt — không cần chuyển đổi gì. Chính tính tương thích ngược này khiến UTF-8 lan ra toàn bộ Internet trong khi các cách mã hoá khác chết dần.',
      en: 'Every ASCII character remains exactly one byte with exactly its old value. So a pure-English file read as ASCII or as UTF-8 gives identical results — no conversion needed. That backward compatibility is why UTF-8 spread across the entire Internet while rival encodings faded.',
    },
    2700,
    [lines([1, 2]), brow('u1', 'A', '41                (1 byte)', 'ok'), out('file tiếng Anh: ASCII và UTF-8 giống hệt nhau', 'ok')],
    { sfx: 'click' }
  );

  push(
    'multi',
    { vi: 'Ký tự ngoài ASCII dùng nhiều byte', en: 'Non-ASCII characters use several bytes' },
    {
      vi: 'Chữ `ế` tốn 3 byte, `漢` cũng 3, còn emoji tốn 4. Byte đầu tiên tự nói cho biết chuỗi này dài mấy byte, nên bộ giải mã luôn biết phải đọc tới đâu. Hệ quả trực tiếp: số byte không còn bằng số ký tự nữa, và mọi đoạn mã giả định điều ngược lại đều đã hỏng sẵn.',
      en: 'The letter `ế` takes 3 bytes, `漢` also 3, and an emoji takes 4. The first byte announces how many bytes follow, so a decoder always knows where a character ends. The direct consequence: the byte count no longer equals the character count, and any code assuming otherwise is already broken.',
    },
    3000,
    [
      lines([3, 4, 5]),
      brow('u2', 'ế', 'E1 BA BF          (3 byte)', 'warn'),
      brow('u3', '漢', 'E6 BC A2          (3 byte)', 'warn'),
      brow('u4', '😀', 'F0 9F 98 80       (4 byte)', 'err'),
      out('1 ký tự ≠ 1 byte', 'warn'),
    ],
    { sfx: 'stream' }
  );

  push(
    'length',
    { vi: 'Bẫy thứ nhất: cắt chuỗi theo byte làm hỏng ký tự', en: 'Trap one: slicing by bytes breaks characters' },
    {
      vi: 'Cột `VARCHAR(10)` trong CSDL đếm ký tự, nhưng nhiều API và bộ đệm lại đếm byte. Cắt một chuỗi tiếng Việt ở giữa chừng một ký tự 3 byte thì được nửa ký tự — và nửa đó hiện thành dấu hỏi ngược. Đây là lỗi kinh điển khi cắt tiêu đề để hiển thị, hoặc khi ghép hai gói tin mạng.',
      en: 'A `VARCHAR(10)` column counts characters, but many APIs and buffers count bytes. Cut a Vietnamese string mid-way through a 3-byte character and you get half a character — which renders as a replacement glyph. This is the classic bug when truncating titles for display, or when reassembling network packets.',
    },
    3100,
    [
      lines([7, 8]),
      fact('bad', 'x1', 'cắt giữa ký tự → ký tự lạ', 'gặp khi truncate tiêu đề', 'err'),
      out('> "Tuế".length → 3 · byteLength → 5', 'warn'),
      out('cắt 4 byte đầu → "Tu" + nửa ký tự → "Tu�"', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Hỏi lớp: VARCHAR(10) chứa được mấy chữ tiếng Việt có dấu, tính theo byte?',
        en: 'Ask the class: how many accented Vietnamese letters fit in VARCHAR(10), counted in bytes?',
      },
    }
  );

  push(
    'emoji',
    { vi: 'Bẫy thứ hai: "👨‍👩‍👧".length trả về 8', en: 'Trap two: "👨‍👩‍👧".length returns 8' },
    {
      vi: 'Người dùng thấy MỘT hình. JavaScript đếm được 8, vì chuỗi đó thật ra là ba emoji người ghép lại bằng hai ký tự nối vô hình, và mỗi emoji lại chiếm hai đơn vị trong cách JavaScript lưu chuỗi. Muốn đếm đúng số ký tự người ta NHÌN THẤY thì phải dùng `Intl.Segmenter`, không dùng `.length`.',
      en: 'The user sees ONE glyph. JavaScript counts 8, because that string is really three person emojis joined by two invisible joiner characters, and each emoji occupies two units in the way JavaScript stores strings. To count what a human actually SEES you need `Intl.Segmenter`, not `.length`.',
    },
    3200,
    [
      brow('u5', '👨‍👩‍👧', '3 emoji + 2 nối = 8 đơn vị', 'err'),
      fact('bad', 'x2', '.length không đếm ký tự nhìn thấy', 'dùng Intl.Segmenter', 'err'),
      out('> "👨‍👩‍👧".length → 8', 'err'),
      out('> [...seg.segment(s)].length → 1', 'ok'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'rules',
    { vi: 'Ba luật để không bao giờ dính lỗi chữ loạn', en: 'Three rules to never meet garbled text again' },
    {
      vi: 'Một: khai UTF-8 ở MỌI chặng — CSDL, bảng, cột, kết nối, header HTTP, thẻ meta của trang. Chỉ cần một chặng khai sai là hỏng cả chuỗi. Hai: đừng bao giờ giả định một ký tự là một byte; khi cần giới hạn độ dài thì phải nói rõ đang đếm theo đơn vị nào. Ba: khi hiển thị cho người dùng thì đếm theo cụm hiển thị, còn khi tính dung lượng lưu trữ thì đếm theo byte — đó là hai câu hỏi khác nhau, và trộn chúng vào nhau là nguồn của phần lớn lỗi loại này.',
      en: 'One: declare UTF-8 at EVERY hop — database, table, column, connection, HTTP header, page meta tag. A single wrong hop garbles everything. Two: never assume one character is one byte; when limiting length, state which unit you are counting. Three: when displaying to users count grapheme clusters, when sizing storage count bytes — these are different questions, and conflating them causes most bugs of this kind.',
    },
    3200,
    [lines([]), fact('ok', 'x3', 'khai UTF-8 ở mọi chặng', 'DB · kết nối · header · meta', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

export const textEncodingScenario: Scenario = {
  id: 'text-encoding',
  name: { vi: 'Chữ thành byte — ASCII, Unicode và UTF-8', en: 'Text as bytes — ASCII, Unicode and UTF-8' },
  tagline: {
    vi: 'Máy tính không lưu chữ, chỉ lưu số. Trong UTF-8 thì `A` tốn 1 byte còn `ế` tốn 3 và emoji tốn 4 — nên "một ký tự là một byte" sai, và `"👨‍👩‍👧".length` trả về 8 chứ không phải 1.',
    en: 'Computers store numbers, not letters. In UTF-8 an `A` takes 1 byte while `ế` takes 3 and an emoji takes 4 — so "one character is one byte" is false, and `"👨‍👩‍👧".length` returns 8, not 1.',
  },
  icon: Table2,
  accent: '#38bdf8',
  group: 'computer',
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'view',
      label: { vi: 'Chặng nào', en: 'Which stage' },
      defaultValue: 'ascii',
      choices: [
        {
          value: 'ascii',
          label: 'ASCII',
          fullLabel: '128 ký tự và những mẹo bit',
          color: '#34d399',
          hint: { vi: "'A' | 32 = 'a'", en: "'A' | 32 = 'a'" },
        },
        {
          value: 'utf8',
          label: 'UTF-8 & emoji',
          fullLabel: 'Vì sao .length không đếm ký tự',
          color: '#f43f5e',
          hint: { vi: 'cắt chuỗi làm hỏng dấu', en: 'slicing breaks diacritics' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.view === 'utf8' ? buildUtf8() : buildAscii()),
};
