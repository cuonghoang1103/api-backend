/**
 * Node.js · Bài 6.4 — Phân trang, lọc và sắp xếp.
 *
 * Số đo lấy nguyên từ giáo trình, đo bằng `EXPLAIN ANALYZE` trên bảng
 * 1.000.000 dòng có chỉ mục, cache nóng:
 *
 *   OFFSET 0       →   0,048 ms · quét 20 dòng
 *   OFFSET 500000  →  98,117 ms · quét 500.020 dòng
 *   OFFSET 999980  → 166,815 ms · quét 1.000.000 dòng
 *   cursor > 500000 →  0,029 ms · quét 20 dòng
 *   cursor > 999980 →  0,015 ms · quét 20 dòng     (nhanh hơn ~11.000 lần)
 *
 * Con số giải thích con số: OFFSET không phải "nhảy tới", nó là ĐẾM RỒI VỨT.
 * Chi phí trang N tăng tuyến tính theo N — nên truy vấn nặng nhất của hệ
 * thống lại nằm ở những trang không ai xem.
 *
 * Biểu đồ cột là nguyên thuỷ chính; cái đập vào mắt phải là chiều cao cột,
 * rồi mới tới con số bên trên nó.
 */

import { List } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const OFFSET_CODE = [
  '// GET /notes?page=3&limit=20',
  'SELECT * FROM notes',
  ' ORDER BY id',
  ' LIMIT 20 OFFSET 40;',
  '',
  '// trang 25001 → OFFSET 500000',
  '// trang cuối  → OFFSET 999980',
];

const CURSOR_CODE = [
  '// GET /notes?limit=20&after=999980',
  'SELECT * FROM notes',
  ' WHERE id > 999980',
  ' ORDER BY id',
  ' LIMIT 20;',
  '',
  '// chỉ mục nhảy thẳng tới khoá,',
  '// không đếm gì cả',
];

const DRIFT_CODE = [
  '// người dùng đang cuộn feed',
  "GET /notes?page=1&limit=3   // xong",
  '',
  '// … một ghi chú MỚI được tạo …',
  '',
  "GET /notes?page=2&limit=3   // trang 2",
  '// → thấy lại đúng mục đã đọc ở trang 1',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Truy vấn', en: 'The query' },
    x: 0,
    y: 0,
    w: 424,
    h: 244,
    lines: opts.mode === 'cursor' ? CURSOR_CODE : opts.mode === 'drift' ? DRIFT_CODE : OFFSET_CODE,
  },
  {
    id: 'gauges',
    kind: 'meter',
    title: { vi: 'Chi phí một truy vấn', en: 'What one query costs' },
    hint: { vi: 'bảng 1.000.000 dòng, cache nóng', en: '1,000,000 rows, warm cache' },
    x: 0,
    y: 256,
    w: 424,
    h: 304,
    accent: '#f59e0b',
    meters: [
      { id: 'scan', label: 'Số dòng CSDL phải đọc', max: 1_000_000, unit: 'dòng', accent: '#f43f5e' },
      { id: 'ms', label: 'Thời gian truy vấn', max: 170, unit: 'ms', threshold: 10, thresholdLabel: 'ngưỡng dễ chịu', accent: '#f59e0b' },
      { id: 'rows', label: 'Số dòng thật sự TRẢ VỀ', max: 20, unit: 'dòng', accent: '#34d399' },
    ],
  },
  {
    id: 'cost',
    kind: 'chart',
    mode: 'bar',
    title: { vi: 'Thời gian truy vấn theo trang (ms)', en: 'Query time by page (ms)' },
    hint: { vi: 'cùng bảng, cùng chỉ mục, cùng 20 dòng trả về', en: 'same table, same index, same 20 rows out' },
    x: 436,
    y: 0,
    w: 564,
    h: 316,
    accent: '#f43f5e',
    unit: 'ms',
    max: 180,
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'EXPLAIN ANALYZE', en: 'EXPLAIN ANALYZE' },
    x: 436,
    y: 328,
    w: 564,
    h: 232,
    accent: '#34d399',
    maxLines: 6,
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: 'ok' | 'warn' | 'err' | 'muted' = 'ok'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const gauge = (key: string, value: number, label?: string, tone?: 'ok' | 'warn' | 'err'): PanelOp => ({ p: 'gauges', op: 'value', key, value, label, tone });
const bar = (key: string, value: number, label: string, tone: 'ok' | 'warn' | 'err'): PanelOp => ({ p: 'cost', op: 'value', key, value, label, tone });

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ────────────────────────────────────────────────────────────
   A — OFFSET: ĐẾM RỒI VỨT
   ──────────────────────────────────────────────────────────── */

function buildOffset(): SimStep[] {
  const { steps, push } = collector();

  push(
    'page1',
    { vi: 'Trang 1 — 0,048 ms', en: 'Page 1 — 0.048 ms' },
    {
      vi: 'OFFSET 0. Chỉ mục đưa thẳng tới đầu bảng, đọc 20 dòng rồi thôi. Nhanh tới mức không ai nghĩ tới việc đo lại — và đây chính là con số mà mọi người kiểm thử lúc phát triển.',
      en: 'OFFSET 0. The index goes straight to the start, reads 20 rows, done. So fast nobody thinks to measure again — and this is precisely the number everyone tests during development.',
    },
    2300,
    [
      lines([2, 3, 4]),
      gauge('scan', 20, '20 dòng', 'ok'),
      gauge('ms', 0.048, '0,048 ms', 'ok'),
      gauge('rows', 20, '20 dòng', 'ok'),
      bar('trang 1', 0.048, '0,048', 'ok'),
      out('OFFSET 0      → 0.048 ms · quét 20 dòng'),
    ],
    { sfx: 'ping' }
  );

  push(
    'page25k',
    { vi: 'Trang 25.001 — 98,117 ms', en: 'Page 25,001 — 98.117 ms' },
    {
      vi: 'OFFSET 500000. Vẫn trả về đúng 20 dòng, nhưng cơ sở dữ liệu phải ĐỌC 500.020 dòng để tới được đó. Chậm hơn 2.000 lần cho cùng một kết quả.',
      en: 'OFFSET 500000. Still returns exactly 20 rows, but the database had to READ 500,020 rows to get there. Two thousand times slower for the same result.',
    },
    2600,
    [
      lines([6]),
      gauge('scan', 500_020, '500.020 dòng', 'warn'),
      gauge('ms', 98.117, '98,117 ms', 'warn'),
      gauge('rows', 20, '20 dòng', 'ok'),
      bar('trang 25.001', 98.117, '98,1', 'warn'),
      out('OFFSET 500000 → 98.117 ms · quét 500.020 dòng', 'warn'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'last',
    { vi: 'Trang cuối — 166,815 ms, quét TRỌN một triệu dòng', en: 'Last page — 166.815 ms, a full million rows scanned' },
    {
      vi: 'Hãy đọc cột giữa. `OFFSET 999980` KHÔNG nhảy qua một triệu dòng một cách rẻ tiền — nó đọc từng dòng một, theo thứ tự, rồi vứt đi tất cả trừ hai mươi dòng cuối. OFFSET không phải phép nhảy; nó là ĐẾM RỒI VỨT.',
      en: 'Read the middle column. `OFFSET 999980` did not skip a million rows cheaply — it read every one of them, in order, and threw away all but the last twenty. OFFSET is not a seek; it is count-and-discard.',
    },
    2900,
    [
      lines([7]),
      gauge('scan', 1_000_000, '1.000.000 dòng', 'err'),
      gauge('ms', 166.815, '166,815 ms', 'err'),
      gauge('rows', 20, 'vẫn 20 dòng', 'ok'),
      bar('trang cuối', 166.815, '166,8', 'err'),
      out('OFFSET 999980 → 166.815 ms · quét 1.000.000 dòng', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Chỉ vào ba cột: cùng 20 dòng trả về, chi phí tăng tuyến tính theo SỐ TRANG.',
        en: 'Point at the three bars: identical 20 rows out, cost growing linearly with PAGE NUMBER.',
      },
    }
  );

  push(
    'verdict',
    { vi: 'Truy vấn nặng nhất nằm ở trang không ai xem', en: 'Your heaviest queries are on the pages nobody reads' },
    {
      vi: 'Chi phí trang N tăng tuyến tính theo N. Nghĩa là cơ sở dữ liệu làm việc nặng nhất cho lưu lượng ít giá trị nhất — thường là bot bò hết phân trang. Chọn "Cursor" để xem cách hỏi khác đi.',
      en: 'The cost of page N grows linearly with N. So the database does its heaviest work for your least valuable traffic — usually a crawler walking the whole pagination. Pick "Cursor" to see a different way of asking.',
    },
    2700,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — CURSOR: HỎI CÁI ĐỨNG SAU
   ──────────────────────────────────────────────────────────── */

function buildCursor(): SimStep[] {
  const { steps, push } = collector();

  push(
    'idea',
    { vi: 'Đổi câu hỏi, không đổi chỉ mục', en: 'Change the question, not the index' },
    {
      vi: 'Thay vì "bỏ qua 999.980 dòng rồi đưa tôi 20 dòng", ta hỏi "đưa tôi 20 dòng có id LỚN HƠN 999980". Cùng bảng, cùng chỉ mục, cùng 20 dòng trả về.',
      en: 'Instead of "skip 999,980 rows then give me 20", we ask "give me 20 rows whose id is GREATER THAN 999980". Same table, same index, same 20 rows out.',
    },
    2400,
    [lines([2, 3, 4, 5]), gauge('scan', 0, '—'), gauge('ms', 0, '—'), gauge('rows', 0, '—')],
    { sfx: 'click' }
  );

  push(
    'mid',
    { vi: 'Giữa bảng — 0,029 ms, quét 20 dòng', en: 'Mid-table — 0.029 ms, 20 rows scanned' },
    {
      vi: 'Chỉ mục B-Tree nhảy thẳng tới khoá 500000 rồi đọc tiếp 20 dòng. Không đếm, không vứt. Đây không phải cơ sở dữ liệu thông minh lên — đây là chỉ mục làm đúng việc duy nhất mà chỉ mục sinh ra để làm.',
      en: 'The B-Tree index jumps straight to key 500000 and reads the next 20. No counting, no discarding. This is not the database getting clever — it is an index doing the one thing indexes exist for.',
    },
    2600,
    [
      gauge('scan', 20, '20 dòng', 'ok'),
      gauge('ms', 0.029, '0,029 ms', 'ok'),
      gauge('rows', 20, '20 dòng', 'ok'),
      bar('OFFSET giữa', 98.117, '98,1', 'err'),
      bar('cursor giữa', 0.029, '0,029', 'ok'),
      out('cursor id > 500000 → 0.029 ms · quét 20 dòng', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'last',
    { vi: 'Trang cuối — 0,015 ms: nhanh gấp ~11.000 lần', en: 'Last page — 0.015 ms: about 11,000× faster' },
    {
      vi: 'Càng về cuối bảng cursor càng NHANH HƠN chút ít, trong khi OFFSET càng chậm đi. 166,815 ms so với 0,015 ms cho cùng hai mươi dòng.',
      en: 'Deeper into the table the cursor gets slightly FASTER, while OFFSET gets slower. 166.815 ms versus 0.015 ms for the same twenty rows.',
    },
    2800,
    [
      gauge('scan', 20, '20 dòng', 'ok'),
      gauge('ms', 0.015, '0,015 ms', 'ok'),
      bar('OFFSET cuối', 166.815, '166,8', 'err'),
      bar('cursor cuối', 0.015, '0,015', 'ok'),
      out('cursor id > 999980 → 0.015 ms · quét 20 dòng', 'ok'),
      out('→ nhanh hơn ~11.000 lần', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'complexity',
    { vi: 'O(limit) so với O(offset + limit)', en: 'O(limit) versus O(offset + limit)' },
    {
      vi: 'Cursor quét 20 dòng ở MỌI trang; OFFSET quét tới một triệu. Cái giá phải trả: mất nút "nhảy tới trang 57", vì cursor chỉ biết "cái tiếp theo". Với feed, tìm kiếm, cuộn vô tận thì đó không phải mất mát gì — không ai nhảy tới trang 57 của một feed.',
      en: 'The cursor scans 20 rows on EVERY page; OFFSET scans up to a million. The price: you lose "jump to page 57", because a cursor only knows "what comes next". For feeds, search and infinite scroll that costs nothing — nobody jumps to page 57 of a feed.',
    },
    2900,
    [lines([7, 8])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   C — LỖI KHÔNG LIÊN QUAN TỚI TỐC ĐỘ
   ──────────────────────────────────────────────────────────── */

function buildDrift(): SimStep[] {
  const { steps, push } = collector();

  push(
    'page1',
    { vi: 'Trang 1 — ba mục mới nhất', en: 'Page 1 — the three newest items' },
    {
      vi: 'Feed sắp xếp mới nhất trước. Người dùng đọc xong ba mục rồi cuộn tiếp.',
      en: 'The feed sorts newest first. The user reads three items and scrolls on.',
    },
    2300,
    [
      lines([2]),
      { p: 'cost', op: 'value', key: 'đã đọc', value: 3, label: '3', tone: 'ok' },
      out('trang 1 → [#100, #99, #98]'),
    ],
    { sfx: 'click' }
  );

  push(
    'insert',
    { vi: 'Một ghi chú mới được tạo — bởi người khác', en: 'A new note is created — by somebody else' },
    {
      vi: 'Không có gì bất thường: đây là điều xảy ra mỗi giây trên một hệ thống có người dùng thật. Nhưng nó vừa đẩy MỌI mục xuống một bậc.',
      en: 'Nothing unusual: this happens every second on a system with real users. But it has just pushed EVERY item down one place.',
    },
    2600,
    [lines([4]), out('  … #101 được tạo …', 'warn')],
    { sfx: 'buzz' }
  );

  push(
    'page2',
    { vi: 'Trang 2 — và #98 xuất hiện LẠI', en: 'Page 2 — and #98 shows up AGAIN' },
    {
      vi: '`OFFSET 3` giờ trỏ vào một chỗ khác trong danh sách so với lúc trang 1 được lấy. Người dùng thấy lại đúng mục vừa đọc. Nếu có mục bị XOÁ thì ngược lại: một mục bị nhảy cóc mà không ai thấy nó bao giờ.',
      en: '`OFFSET 3` now points somewhere else in the list than it did when page 1 was fetched. The user sees an item they just read. And if an item is DELETED instead, the mirror image happens: one item is skipped and nobody ever sees it.',
    },
    2900,
    [
      lines([6, 7]),
      { p: 'cost', op: 'value', key: 'trùng lặp', value: 1, label: '1', tone: 'err' },
      out('trang 2 → [#98, #97, #96]   ← #98 LẶP LẠI', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Đây là lỗi không hề liên quan tới tốc độ — cursor sửa cả hai cùng lúc.',
        en: 'This bug has nothing to do with speed — the cursor fixes both at once.',
      },
    }
  );

  push(
    'verdict',
    { vi: 'Cursor không có lỗi này, vì nó neo vào DỮ LIỆU', en: 'A cursor cannot drift, because it anchors to DATA' },
    {
      vi: '`WHERE id < 98` luôn cho ra cái đứng sau #98, bất kể có bao nhiêu mục được thêm hay xoá trong lúc đó. OFFSET neo vào VỊ TRÍ trong một danh sách đang thay đổi; cursor neo vào một hàng cụ thể. Đó là khác biệt thật sự — tốc độ chỉ là phần thưởng kèm theo.',
      en: '`WHERE id < 98` always yields whatever follows #98, no matter how many items were added or removed meanwhile. OFFSET anchors to a POSITION in a shifting list; a cursor anchors to a specific row. That is the real difference — the speed is a bonus.',
    },
    2900,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsPaginationScenario: Scenario = {
  id: 'nodejs-pagination',
  name: { vi: 'Phân trang — OFFSET so với cursor', en: 'Pagination — OFFSET versus cursor' },
  tagline: {
    vi: 'Cùng hai mươi dòng trả về: OFFSET trang cuối mất 166,8 ms và quét trọn một triệu dòng, cursor mất 0,015 ms và quét đúng hai mươi. Nhanh hơn ~11.000 lần — và sửa luôn một lỗi chẳng liên quan gì tới tốc độ.',
    en: 'The same twenty rows out: OFFSET on the last page costs 166.8 ms and scans a full million rows; a cursor costs 0.015 ms and scans exactly twenty. About 11,000× faster — and it fixes a bug that has nothing to do with speed.',
  },
  icon: List,
  accent: '#f59e0b',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '6.4',
    slug: 'nodejs-6-4-phan-trang',
    title: { vi: 'Phân trang, lọc và sắp xếp', en: 'Pagination, filtering and sorting' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'mode',
      label: { vi: 'Cách phân trang', en: 'Pagination style' },
      defaultValue: 'offset',
      choices: [
        {
          value: 'offset',
          label: 'OFFSET',
          fullLabel: 'LIMIT 20 OFFSET n — đếm rồi vứt',
          color: '#f43f5e',
          hint: { vi: 'trang cuối quét trọn một triệu dòng', en: 'the last page scans a full million rows' },
        },
        {
          value: 'cursor',
          label: 'Cursor',
          fullLabel: 'WHERE id > n LIMIT 20 — O(limit)',
          color: '#34d399',
          hint: { vi: 'quét đúng 20 dòng ở mọi trang', en: 'exactly 20 rows scanned on every page' },
        },
        {
          value: 'drift',
          label: 'Lỗi trôi trang',
          fullLabel: 'Mục lặp lại / bị nhảy cóc khi cuộn',
          color: '#f59e0b',
          hint: { vi: 'không liên quan gì tới tốc độ', en: 'nothing to do with speed' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] =>
    opts.mode === 'cursor' ? buildCursor() : opts.mode === 'drift' ? buildDrift() : buildOffset(),
};
