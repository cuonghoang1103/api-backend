/**
 * Node.js · Bài 2.5 — Đưa việc nặng ra khỏi event loop.
 *
 * Bài 2.4 đo được căn bệnh: 2871ms tính toán làm đóng băng cả tiến trình,
 * nhịp tim trễ 2873ms. Bài này là ba thuốc chữa, và điểm mấu chốt là chúng
 * KHÔNG thay thế cho nhau — mỗi cái có một cái giá khác nhau.
 *
 *   1. worker thread   → độ trễ 2873ms xuống còn 2ms; giá: ~10–30ms khởi
 *                        động, một vùng heap V8 riêng, không dùng chung biến.
 *   2. xắt lô + setImmediate → không cần luồng mới, nhưng việc chậm hơn và
 *                        vòng lặp chỉ "thở" được giữa hai lát.
 *   3. đẩy ra khỏi tiến trình (hàng đợi việc nền) → cách của một hệ thật.
 *
 * Bố cục chọn hai làn — LUỒNG CHÍNH và LUỒNG WORKER — vì bài học nằm đúng ở
 * chỗ hai làn ấy chạy song song hay giành nhau.
 */

import { Cpu } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const WORKER_CODE = [
  '// worker.js — luồng riêng, V8 riêng, event loop riêng',
  "const { parentPort } = require('node:worker_threads');",
  'let s = 0;',
  'for (let i = 0; i < 3e9; i++) s += i;',
  'parentPort.postMessage(s);',
  '',
  '// main.js — nhịp tim vẫn chạy y như bài 2.4',
  "const w = new Worker('./worker.js');",
  "w.on('message', () => log('worker xong'));",
];

const CHUNK_CODE = [
  'const TOTAL = 3e9, CHUNK = 3e7;',
  'let i = 0, s = 0;',
  '',
  'function runChunk() {',
  '  const end = Math.min(i + CHUNK, TOTAL);',
  '  for (; i < end; i++) s += i;',
  '  if (i < TOTAL) setImmediate(runChunk);   // nhường lượt',
  '}',
  'runChunk();',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Cách chữa', en: 'The cure' },
    x: 0,
    y: 0,
    w: 430,
    h: 280,
    lines: opts.cure === 'chunk' ? CHUNK_CODE : WORKER_CODE,
  },
  {
    id: 'gauges',
    kind: 'meter',
    title: { vi: 'Đo tại chỗ', en: 'Live gauges' },
    x: 0,
    y: 292,
    w: 430,
    h: 268,
    accent: '#34d399',
    meters: [
      {
        id: 'lag',
        label: 'Độ trễ nhịp tim (luồng chính)',
        max: 3000,
        unit: 'ms',
        threshold: 100,
        thresholdLabel: 'ngưỡng báo động',
        accent: '#f43f5e',
      },
      { id: 'ram', label: 'Bộ nhớ thêm cho luồng phụ', max: 80, unit: 'MB', accent: '#a855f7' },
      { id: 'progress', label: 'Tiến độ phép tính 3e9', max: 100, unit: '%', accent: '#34d399' },
    ],
  },
  {
    id: 'threads',
    kind: 'lanes',
    title: { vi: 'Hai luồng chạy thế nào', en: 'What each thread is doing' },
    hint: { vi: 'luồng chính phải luôn rảnh', en: 'the main thread must stay free' },
    x: 442,
    y: 0,
    w: 558,
    h: 288,
    lanes: [
      { id: 'main', label: 'Luồng chính', sub: { vi: 'phục vụ request', en: 'serves requests' }, accent: '#34d399' },
      { id: 'worker', label: 'Luồng worker', sub: { vi: 'V8 + event loop RIÊNG', en: 'its own V8 + loop' }, accent: '#a855f7' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Kết quả in ra', en: 'Program output' },
    x: 442,
    y: 300,
    w: 558,
    h: 260,
    accent: '#34d399',
    maxLines: 6,
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: 'ok' | 'warn' | 'err' | 'muted' = 'ok'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const gauge = (key: string, value: number, label?: string, tone?: 'ok' | 'warn' | 'err'): PanelOp => ({
  p: 'gauges',
  op: 'value',
  key,
  value,
  label,
  tone,
});
const busy = (lane: string, label: string, sub: string, tone: 'ok' | 'warn' | 'err' | 'active' = 'active'): PanelOp => ({
  p: 'threads',
  op: 'push',
  lane,
  item: { label, sub, tone },
});

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ────────────────────────────────────────────────────────────
   A — WORKER THREAD
   ──────────────────────────────────────────────────────────── */

function buildWorker(): SimStep[] {
  const { steps, push } = collector();

  push(
    'before',
    { vi: 'Nhắc lại căn bệnh của bài 2.4', en: 'Recall the disease from 2.4' },
    {
      vi: 'Cùng phép tính 3 tỉ vòng, chạy thẳng trên luồng chính: nhịp tim trễ 2.873ms, server câm lặng suốt quãng đó. Giờ dời nguyên phép tính ấy sang một luồng khác.',
      en: 'The same three-billion-iteration loop, run on the main thread: 2,873ms of heartbeat lag, the server silent throughout. Now move that exact computation to another thread.',
    },
    2300,
    [lines([1, 2, 3, 4, 5]), gauge('lag', 2873, '2.873 ms — bài 2.4', 'err'), gauge('progress', 0, '0 %'), gauge('ram', 0, '0 MB')],
    { sfx: 'buzz' }
  );

  push(
    'spawn',
    { vi: 'Sinh worker — mất 10–30ms và một vùng heap riêng', en: 'Spawn the worker — 10–30ms and a fresh heap' },
    {
      vi: 'Worker KHÔNG miễn phí: nó là một bản V8 hoàn chỉnh với event loop riêng, tốn vài chục mili giây khởi động và bộ nhớ riêng. Vì thế đừng sinh một worker cho mỗi request — giữ một nhóm nhỏ dùng lại.',
      en: 'A worker is NOT free: it is a full V8 instance with its own event loop, costing tens of milliseconds to start plus its own memory. So never spawn one per request — keep a small pool and reuse it.',
    },
    2400,
    [
      lines([7, 8, 9]),
      busy('worker', 'khởi động', 'V8 mới + heap riêng', 'warn'),
      gauge('ram', 34, '34 MB', 'warn'),
      out('→ giao việc nặng cho worker…'),
    ],
    { sfx: 'click' }
  );

  push(
    'parallel',
    { vi: 'Hai luồng chạy song song thật', en: 'Two threads, genuinely in parallel' },
    {
      vi: 'Worker đếm 3 tỉ vòng trên nhân CPU của nó. Luồng chính KHÔNG chạm vào phép tính ấy — nó tiếp tục nhận request, trả lời, đọc CSDL, đáp health check.',
      en: 'The worker counts three billion iterations on its own core. The main thread never touches that computation — it keeps accepting requests, answering them, reading the database, passing health checks.',
    },
    2600,
    [
      { p: 'threads', op: 'clear', lane: 'worker' },
      busy('worker', 'for (i < 3e9)', 'đang tính…'),
      busy('main', 'GET /api/posts', '200 · 12ms', 'ok'),
      gauge('lag', 2, '2 ms', 'ok'),
      gauge('progress', 45, '45 %'),
    ],
    {
      sfx: 'stream',
      teachingNote: {
        vi: 'Chỉ vào hai làn cùng sáng: đây là điểm khác biệt duy nhất so với bài 2.4.',
        en: 'Point at both lanes lit at once: that is the only difference from lesson 2.4.',
      },
    }
  );

  push(
    'serving',
    { vi: 'Luồng chính vẫn phục vụ bình thường', en: 'The main thread keeps serving' },
    {
      vi: 'Nhịp tim trễ 2ms — tức là không trễ. Đây chính là con số cần so: 2.873ms xuống 2ms, trong khi phép tính vẫn tốn đúng từng ấy thời gian.',
      en: 'Heartbeat lag of 2ms — that is to say, none. This is the number to compare: 2,873ms down to 2ms, while the computation itself takes exactly as long as before.',
    },
    2500,
    [
      { p: 'threads', op: 'clear', lane: 'main' },
      busy('main', 'POST /api/notes', '201 · 18ms', 'ok'),
      gauge('progress', 88, '88 %'),
      out('nhịp tim · trễ 2ms', 'ok'),
    ],
    { sfx: 'blip' }
  );

  push(
    'done',
    { vi: 'Worker xong sau 2.883ms — nhỉnh hơn 12ms', en: 'Worker done after 2,883ms — 12ms slower' },
    {
      vi: 'Việc không hề nhanh hơn; nó còn chậm hơn một chút vì tiền khởi động luồng. Đổi lại, suốt 2,9 giây đó server trả lời mọi request khác. Kết quả gửi về bằng thông điệp — dữ liệu được SAO CHÉP, worker không dùng chung biến với luồng chính.',
      en: 'The work did not get faster; it got slightly slower, paying for thread start-up. In exchange, the server answered every other request for those 2.9 seconds. The result comes back as a message — the data is COPIED, workers share no variables with the main thread.',
    },
    2700,
    [
      { p: 'threads', op: 'clear', lane: 'worker' },
      gauge('progress', 100, '100 %', 'ok'),
      gauge('lag', 2, '2 ms', 'ok'),
      out('→ worker tính xong sau 2883 ms'),
      out('→ nhịp tim bị trễ TỐI ĐA: 2 ms  (luồng chính vẫn rảnh!)', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'verdict',
    { vi: 'Dùng worker cho việc nặng CPU THẬT SỰ', en: 'Use workers for genuinely CPU-heavy work' },
    {
      vi: 'Phân tích file khổng lồ, nén, xử lý ảnh/video, mật mã, biến đổi dữ liệu lớn. KHÔNG dùng cho truy vấn CSDL hay gọi HTTP — những thứ đó đã bất đồng bộ sẵn, bọc vào worker chỉ tốn thêm bộ nhớ mà không nhanh hơn một mili giây nào.',
      en: 'Parsing huge files, compression, image and video processing, cryptography, heavy data transformation. NOT for database queries or HTTP calls — those are already asynchronous, and wrapping them in a worker costs memory without saving a single millisecond.',
    },
    2800,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — XẮT LÔ, NHƯỜNG LƯỢT BẰNG setImmediate
   ──────────────────────────────────────────────────────────── */

function buildChunk(): SimStep[] {
  const { steps, push } = collector();

  push(
    'idea',
    { vi: 'Không dời được việc thì xắt nhỏ nó ra', en: 'If you cannot move the work, slice it' },
    {
      vi: 'Vẫn 3 tỉ vòng, nhưng chia thành 100 lát mỗi lát 30 triệu. Sau mỗi lát, `setImmediate` trả quyền cho event loop — nhớ bài 2.3: `setImmediate` là công cụ NHƯỜNG LƯỢT, còn `nextTick` thì ngược lại.',
      en: 'Still three billion iterations, but sliced into 100 slices of thirty million. After each slice, `setImmediate` hands control back to the loop — recall lesson 2.3: `setImmediate` is the YIELDING tool, `nextTick` is the opposite.',
    },
    2400,
    [lines([1, 4, 5, 6, 7]), gauge('lag', 0, '0 ms', 'ok'), gauge('progress', 0, '0 %'), gauge('ram', 0, '0 MB — không luồng mới', 'ok')],
    { sfx: 'click' }
  );

  push(
    'slice-1',
    { vi: 'Lát 1: chặn 30ms rồi nhả', en: 'Slice 1: block for 30ms, then release' },
    {
      vi: 'Trong lúc chạy một lát, vòng lặp VẪN bị chặn — chỉ là chặn 30ms thay vì 2.871ms. Đó là toàn bộ mẹo: chia một cú đóng băng dài thành nhiều cú chớp mắt.',
      en: 'While a slice runs, the loop IS still blocked — just for 30ms instead of 2,871ms. That is the whole trick: split one long freeze into many blinks.',
    },
    2300,
    [busy('main', 'lát 1 / 100', '30 triệu vòng', 'warn'), gauge('lag', 30, '30 ms', 'warn'), gauge('progress', 1, '1 %')],
    { sfx: 'blip' }
  );

  push(
    'yield',
    { vi: 'setImmediate — vòng lặp thở một nhịp', en: 'setImmediate — the loop takes a breath' },
    {
      vi: 'Giữa hai lát, pha poll được chạy: request đang chờ được nhận và trả lời. Người dùng thấy độ trễ 30ms, không phải 2,9 giây.',
      en: 'Between slices the poll phase runs: pending requests get accepted and answered. Users see 30ms of delay, not 2.9 seconds.',
    },
    2300,
    [
      { p: 'threads', op: 'clear', lane: 'main' },
      busy('main', 'GET /api/posts', '200 · 31ms', 'ok'),
      out('nhịp tim · trễ 30ms', 'warn'),
    ],
    { sfx: 'ping' }
  );

  push(
    'repeat',
    { vi: '…lặp lại 98 lát nữa', en: '…repeated for 98 more slices' },
    {
      vi: 'Tổng thời gian tính LÂU HƠN bản chạy một mạch (mỗi lần nhường lượt tốn một ít), nhưng server sống suốt quãng đó. Đây là đánh đổi có ý thức: chậm hơn một chút để không chết.',
      en: 'Total compute time is LONGER than the single-shot version (each yield costs a little), but the server stays alive throughout. A conscious trade: slightly slower in exchange for not dying.',
    },
    2600,
    [gauge('progress', 96, '96 %'), gauge('lag', 30, '30 ms — đỉnh', 'warn'), out('… 98 lát nữa …', 'muted')],
    { sfx: 'stream' }
  );

  push(
    'verdict',
    { vi: 'Khi nào chọn xắt lô thay vì worker', en: 'When to slice instead of using a worker' },
    {
      vi: 'Khi việc đó cần đọc dữ liệu đang nằm trong bộ nhớ của luồng chính (worker phải SAO CHÉP sang, có thể đắt hơn cả phép tính), hoặc khi 30ms trễ là chấp nhận được. Còn cách thứ ba, và là cách một hệ thật hay dùng nhất: đẩy hẳn việc ra khỏi tiến trình — bỏ vào hàng đợi cho worker riêng xử lý. Ở cuongthai.com, endpoint upload lưu file rồi trả về NGAY; phần nặng chạy ở chỗ khác.',
      en: 'When the work needs data already sitting in the main thread’s memory (a worker would have to COPY it, which can cost more than the computation), or when 30ms of lag is acceptable. There is a third cure, and it is the one real systems reach for most: push the work out of the process entirely — onto a queue for a separate worker. On cuongthai.com the upload endpoint stores the file and returns IMMEDIATELY; the heavy part runs elsewhere.',
    },
    3000,
    [lines([]), { p: 'threads', op: 'clear' }],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsWorkerScenario: Scenario = {
  id: 'nodejs-worker',
  name: { vi: 'Đưa việc nặng ra khỏi event loop', en: 'Getting heavy work off the loop' },
  tagline: {
    vi: 'Cùng phép tính 3 tỉ vòng của bài 2.4, nhưng độ trễ nhịp tim rơi từ 2.873ms xuống 2ms. Xem hai luồng chạy song song, và cái giá phải trả cho mỗi cách chữa.',
    en: 'The same three-billion-iteration computation from 2.4, but heartbeat lag drops from 2,873ms to 2ms. Watch two threads run in parallel, and what each cure actually costs.',
  },
  icon: Cpu,
  accent: '#a855f7',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '2.5',
    slug: 'nodejs-2-5-worker-threads',
    title: { vi: 'Đưa việc nặng ra khỏi event loop', en: 'Getting heavy work off the loop' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'cure',
      label: { vi: 'Cách chữa', en: 'Cure' },
      defaultValue: 'worker',
      choices: [
        {
          value: 'worker',
          label: 'Worker thread',
          fullLabel: 'Luồng riêng — 2.873ms → 2ms',
          color: '#a855f7',
          hint: { vi: 'giá: 10–30ms khởi động + heap riêng', en: 'cost: 10–30ms start-up + its own heap' },
        },
        {
          value: 'chunk',
          label: 'Xắt lô + setImmediate',
          fullLabel: '100 lát × 30 triệu vòng',
          color: '#f59e0b',
          hint: { vi: 'không cần luồng mới, trễ 30ms mỗi lát', en: 'no new thread, 30ms lag per slice' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.cure === 'chunk' ? buildChunk() : buildWorker()),
};
