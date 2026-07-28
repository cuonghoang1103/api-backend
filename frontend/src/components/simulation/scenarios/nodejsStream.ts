/**
 * Node.js · Bài 3.3 — Stream: thí nghiệm với file 348 MB.
 *
 * Kịch bản dùng đúng ba phép đo trong giáo trình:
 *
 *   A. Đọc nguyên file rồi đếm dòng → RAM 37 MB lên 395 MB, 3.662 ms.
 *   B. Cùng phép đếm bằng stream    → RAM đỉnh 120 MB, 2.544 ms.
 *      (Nhanh hơn CHỨ KHÔNG chậm hơn — đọc khúc đầu là bắt đầu đếm được,
 *      không phải ngồi chờ 348 MB về hết.)
 *   C. pipeline read → gzip → write  → 1.169 ms, đỉnh 75 MB, 348 → 15 MB.
 *
 * Đồng hồ đo mức là nguyên thuỷ chính ở đây: bài học nằm ở CHIỀU CAO của cột
 * RAM, và ở chỗ nó đi ngang thay vì leo dốc.
 */

import { Waves } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const BUFFER_CODE = [
  "const data = fs.readFileSync(file);   // TOÀN BỘ file vào RAM",
  '',
  'let dong = 0;',
  'for (const ch of data) if (ch === 10) dong++;',
  '',
  "log('RAM sau :', mb(), 'MB');",
];

const STREAM_CODE = [
  'fs.createReadStream(file)',
  "  .on('data', (chunk) => {          // chunk = Buffer 64 KB",
  '    for (const ch of chunk) if (ch === 10) dong++;',
  '  })',
  "  .on('end', () => log('đỉnh RAM:', peak, 'MB'));",
];

const PIPE_CODE = [
  "import { pipeline } from 'node:stream/promises';",
  "import { createGzip } from 'node:zlib';",
  '',
  'await pipeline(',
  '  createReadStream(src),',
  '  createGzip(),',
  "  createWriteStream(src + '.gz'),",
  ');',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Cách làm', en: 'The approach' },
    x: 0,
    y: 0,
    w: 440,
    h: 232,
    lines: opts.mode === 'stream' ? STREAM_CODE : opts.mode === 'pipe' ? PIPE_CODE : BUFFER_CODE,
  },
  {
    id: 'gauges',
    kind: 'meter',
    title: { vi: 'Bộ nhớ tiến trình (RSS)', en: 'Process memory (RSS)' },
    hint: { vi: 'file nguồn: 348 MB', en: 'source file: 348 MB' },
    x: 0,
    y: 244,
    w: 440,
    h: 316,
    accent: '#38bdf8',
    meters: [
      {
        id: 'ram',
        label: 'RAM đang dùng',
        max: 420,
        unit: 'MB',
        threshold: 348,
        thresholdLabel: 'cỡ file 348 MB',
        accent: '#38bdf8',
      },
      { id: 'read', label: 'Đã đọc từ đĩa', max: 348, unit: 'MB', accent: '#34d399' },
      { id: 'time', label: 'Thời gian trôi qua', max: 4000, unit: 'ms', accent: '#f59e0b' },
    ],
  },
  {
    id: 'flow',
    kind: 'lanes',
    title: {
      vi: opts.mode === 'pipe' ? 'Dây chuyền: đọc → nén → ghi' : 'Dữ liệu đi qua đâu',
      en: opts.mode === 'pipe' ? 'The pipeline: read → gzip → write' : 'Where the data goes',
    },
    hint: {
      vi: opts.mode === 'buffer' ? 'nguyên file phải nằm trong RAM' : 'từng khúc 64 KB một',
      en: opts.mode === 'buffer' ? 'the whole file must sit in RAM' : '64 KB at a time',
    },
    x: 452,
    y: 0,
    w: 548,
    h: 300,
    lanes:
      opts.mode === 'pipe'
        ? [
            { id: 'read', label: 'Readable', sub: { vi: 'createReadStream', en: 'createReadStream' }, accent: '#34d399' },
            { id: 'gzip', label: 'Transform', sub: { vi: 'createGzip', en: 'createGzip' }, accent: '#a855f7' },
            { id: 'write', label: 'Writable', sub: { vi: 'createWriteStream', en: 'createWriteStream' }, accent: '#f59e0b' },
          ]
        : [
            { id: 'disk', label: 'Đĩa', sub: { vi: 'big.log · 348 MB', en: 'big.log · 348 MB' }, accent: '#7f92b4' },
            { id: 'ram', label: 'RAM', sub: { vi: 'vùng nhớ tiến trình', en: 'process memory' }, accent: '#38bdf8' },
            { id: 'work', label: 'Đếm dòng', sub: { vi: 'ch === 10', en: 'ch === 10' }, accent: '#34d399' },
          ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Kết quả in ra', en: 'Program output' },
    x: 452,
    y: 312,
    w: 548,
    h: 248,
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

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ────────────────────────────────────────────────────────────
   A — ĐỌC NGUYÊN FILE
   ──────────────────────────────────────────────────────────── */

function buildBuffered(): SimStep[] {
  const { steps, push } = collector();

  push(
    'before',
    { vi: 'Trước khi bắt đầu: 37 MB', en: 'Before we start: 37 MB' },
    {
      vi: 'Một tiến trình Node rỗng chiếm khoảng 37 MB. Việc cần làm: đếm số dòng trong một file log 348 MB. Cách hiển nhiên nhất là đọc nó ra rồi đếm.',
      en: 'An empty Node process sits at about 37 MB. The task: count the lines in a 348 MB log file. The obvious approach is to read it and count.',
    },
    2200,
    [
      lines([1]),
      gauge('ram', 37, '37 MB', 'ok'),
      gauge('read', 0, '0 MB'),
      gauge('time', 0, '0 ms'),
      { p: 'flow', op: 'push', lane: 'disk', item: { id: 'f', label: 'big.log', sub: '348 MB · 6 triệu dòng', tone: 'idle' } },
      out('RAM trước : 37 MB'),
    ],
    { sfx: 'click' }
  );

  push(
    'loading',
    { vi: 'readFileSync — nạp toàn bộ vào bộ nhớ', en: 'readFileSync — the entire file into memory' },
    {
      vi: 'Không có gì được đếm cho tới khi byte cuối cùng về tới nơi. Trong lúc đó bộ nhớ tiến trình phình lên đúng bằng cỡ file. Chữ `Sync` còn có nghĩa thứ hai: cả event loop đứng im suốt quãng này.',
      en: 'Nothing gets counted until the last byte has arrived. Meanwhile process memory swells by exactly the file size. And `Sync` carries a second meaning: the whole event loop stands still throughout.',
    },
    2600,
    [
      gauge('ram', 240, '240 MB', 'warn'),
      gauge('read', 240, '240 MB'),
      gauge('time', 2400, '2.400 ms', 'warn'),
      { p: 'flow', op: 'push', lane: 'ram', item: { id: 'blob', label: 'toàn bộ 348 MB', sub: 'một Buffer duy nhất', tone: 'warn' } },
    ],
    { sfx: 'stream' }
  );

  push(
    'peak',
    { vi: 'RAM 395 MB — gấp hơn 10 lần lúc đầu', en: 'RAM 395 MB — more than 10× the start' },
    {
      vi: '348 MB dữ liệu cộng 37 MB nền. Trên một VPS 512 MB, tiến trình chết ngay tại dòng này. Và nếu có HAI người cùng gọi endpoint đó thì cần gần 800 MB.',
      en: '348 MB of data plus the 37 MB baseline. On a 512 MB VPS the process dies on this very line. And if TWO users hit that endpoint you need nearly 800 MB.',
    },
    2600,
    [gauge('ram', 395, '395 MB', 'err'), gauge('read', 348, '348 MB', 'ok'), gauge('time', 3200, '3.200 ms', 'warn'), out('RAM sau  : 395 MB', 'err')],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Hỏi lớp: VPS của bạn có bao nhiêu RAM? File lớn nhất người dùng tải lên là bao nhiêu?',
        en: 'Ask the class: how much RAM does your VPS have? How big is the largest file a user can upload?',
      },
    }
  );

  push(
    'count',
    { vi: 'Giờ mới đếm — xong sau 3.662 ms', en: 'Only now does it count — done in 3,662 ms' },
    {
      vi: 'Sáu triệu dòng. Kết quả đúng, nhưng cái giá là giữ nguyên file trong bộ nhớ trong suốt quãng thời gian đó chỉ để đếm ký tự xuống dòng.',
      en: 'Six million lines. The answer is right, but the price was holding the whole file in memory the entire time just to count newline characters.',
    },
    2500,
    [
      lines([3, 4]),
      { p: 'flow', op: 'push', lane: 'work', item: { label: 'đếm 6.000.000', sub: 'ch === 10', tone: 'ok' } },
      gauge('time', 3662, '3.662 ms', 'err'),
      out('dòng: 6000000 | thời gian: 3662 ms', 'warn'),
    ],
    { sfx: 'ping' }
  );

  push(
    'verdict',
    { vi: 'Chi phí tỉ lệ THUẬN với cỡ file', en: 'Cost scales WITH file size' },
    {
      vi: 'Đây là hình dạng nguy hiểm nhất trong backend: chạy ngon với file mẫu 2 MB lúc phát triển, chết khi khách hàng tải lên file 2 GB. Chọn "Đọc bằng stream" để xem cùng phép đếm ấy tốn bao nhiêu.',
      en: 'This is the most dangerous shape in backend work: fine with the 2 MB sample in development, dead when a customer uploads 2 GB. Pick "Read with a stream" to see what the same count costs.',
    },
    2700,
    [lines([])],
    { sfx: 'error' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — ĐỌC BẰNG STREAM
   ──────────────────────────────────────────────────────────── */

function buildStream(): SimStep[] {
  const { steps, push } = collector();

  push(
    'open',
    { vi: 'Mở luồng đọc, chưa đọc gì cả', en: 'Open the stream, read nothing yet' },
    {
      vi: '`createReadStream` không nạp gì hết — nó chỉ mở file và hứa sẽ đưa dữ liệu tới theo từng khúc. Mỗi sự kiện `data` trao cho bạn một Buffer, mặc định 64 KB.',
      en: '`createReadStream` loads nothing — it opens the file and promises to deliver data in pieces. Each `data` event hands you a Buffer, 64 KB by default.',
    },
    2300,
    [
      lines([1, 2]),
      gauge('ram', 37, '37 MB', 'ok'),
      gauge('read', 0, '0 MB'),
      gauge('time', 0, '0 ms'),
      { p: 'flow', op: 'push', lane: 'disk', item: { id: 'f', label: 'big.log', sub: '348 MB', tone: 'idle' } },
      out('RAM trước : 37 MB'),
    ],
    { sfx: 'click' }
  );

  push(
    'chunk-1',
    { vi: 'Khúc đầu tiên: 64 KB', en: 'First chunk: 64 KB' },
    {
      vi: 'Đếm bắt đầu NGAY từ khúc đầu — không phải chờ 348 MB về hết. Đây cũng là lý do stream nhanh hơn: việc đọc đĩa và việc đếm chồng lên nhau.',
      en: 'Counting starts on the very first chunk — no waiting for 348 MB to arrive. This is also why streaming is faster: reading from disk and counting overlap.',
    },
    2300,
    [
      lines([2, 3]),
      { p: 'flow', op: 'push', lane: 'ram', item: { id: 'c1', label: 'chunk', sub: '64 KB', tone: 'ok' } },
      { p: 'flow', op: 'push', lane: 'work', item: { label: 'đếm 1.100 dòng', tone: 'ok' } },
      gauge('ram', 64, '64 MB', 'ok'),
      gauge('read', 30, '30 MB'),
      gauge('time', 300, '300 ms'),
    ],
    { sfx: 'blip' }
  );

  push(
    'chunk-n',
    { vi: 'Khúc cũ được thu hồi, khúc mới vào chỗ đó', en: 'The old chunk is freed, the new one takes its place' },
    {
      vi: 'Đây là điểm mấu chốt: tại mọi thời điểm chỉ có MỘT khúc nhỏ nằm trong bộ nhớ. Cột RAM không leo dốc theo cỡ file — nó đi ngang.',
      en: 'This is the crux: at any instant only ONE small chunk is in memory. The RAM bar does not climb with file size — it goes flat.',
    },
    2600,
    [
      { p: 'flow', op: 'clear', lane: 'ram' },
      { p: 'flow', op: 'push', lane: 'ram', item: { id: 'c2', label: 'chunk', sub: '64 KB', tone: 'ok' } },
      { p: 'flow', op: 'clear', lane: 'work' },
      { p: 'flow', op: 'push', lane: 'work', item: { label: 'đếm 3.400.000 dòng', tone: 'ok' } },
      gauge('ram', 118, '118 MB', 'ok'),
      gauge('read', 200, '200 MB'),
      gauge('time', 1500, '1.500 ms'),
    ],
    {
      sfx: 'stream',
      teachingNote: {
        vi: 'Chỉ vào cột RAM: nó ĐỨNG YÊN trong khi cột "đã đọc" chạy tới 348.',
        en: 'Point at the RAM bar: it STAYS PUT while the "read" bar runs to 348.',
      },
    }
  );

  push(
    'done',
    { vi: 'Đỉnh RAM 120 MB · xong sau 2.544 ms', en: 'Peak RAM 120 MB · done in 2,544 ms' },
    {
      vi: 'Cùng sáu triệu dòng. 395 MB xuống 120 MB, và 3.662 ms xuống 2.544 ms — vừa nhẹ hơn vừa nhanh hơn. Đây là một trong số ít lần trong nghề mà không có đánh đổi nào cả.',
      en: 'The same six million lines. 395 MB down to 120 MB, and 3,662 ms down to 2,544 ms — lighter AND faster. One of the rare times in this job with no trade-off at all.',
    },
    2700,
    [
      lines([5]),
      gauge('ram', 120, '120 MB — ĐỈNH', 'ok'),
      gauge('read', 348, '348 MB', 'ok'),
      gauge('time', 2544, '2.544 ms', 'ok'),
      out('đỉnh RAM  : 120 MB', 'ok'),
      out('dòng: 6000000 | thời gian: 2544 ms', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'verdict',
    { vi: 'Chi phí KHÔNG còn phụ thuộc cỡ file', en: 'Cost no longer depends on file size' },
    {
      vi: 'File 2 GB cũng tốn đúng chừng ấy bộ nhớ. Đó là lý do các file tải về ở cuongthai.com được chảy thẳng từ kho lưu trữ ra response thay vì đọc vào biến trước: một video 500 MB phục vụ theo kiểu đọc hết sẽ cần 500 MB RAM cho MỖI người xem cùng lúc.',
      en: 'A 2 GB file costs the same memory. That is why downloads on cuongthai.com stream straight from storage to the response instead of being read into a variable first: a 500 MB video served the buffered way would need 500 MB of RAM per concurrent viewer.',
    },
    2800,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   C — PIPELINE: ĐỌC → NÉN → GHI
   ──────────────────────────────────────────────────────────── */

function buildPipeline(): SimStep[] {
  const { steps, push } = collector();

  push(
    'setup',
    { vi: 'Ba luồng nối vào nhau', en: 'Three streams chained together' },
    {
      vi: 'Readable đọc từ đĩa, Transform nén bằng gzip, Writable ghi ra file mới. Dữ liệu chảy qua cả ba mà KHÔNG lúc nào tồn tại nguyên vẹn trong bộ nhớ.',
      en: 'A Readable reads from disk, a Transform gzips, a Writable writes a new file. Data flows through all three and at NO point exists whole in memory.',
    },
    2400,
    [
      lines([4, 5, 6, 7, 8]),
      gauge('ram', 37, '37 MB', 'ok'),
      gauge('read', 0, '0 MB'),
      gauge('time', 0, '0 ms'),
      out('nguồn: 348.0 MB'),
    ],
    { sfx: 'click' }
  );

  push(
    'flowing',
    { vi: 'Ba chặng cùng chạy một lúc', en: 'All three stages run at once' },
    {
      vi: 'Trong khi chặng ghi đang xả khúc thứ n ra đĩa thì chặng nén đang xử lý khúc n+1 và chặng đọc đã lấy khúc n+2. Đó là điều một `pipeline` cho không.',
      en: 'While the write stage flushes chunk n to disk, the gzip stage is working on n+1 and the read stage has already fetched n+2. That overlap is what a `pipeline` gives you for free.',
    },
    2600,
    [
      { p: 'flow', op: 'push', lane: 'read', item: { id: 'p_read', label: 'chunk n+2', sub: '64 KB', tone: 'ok' } },
      { p: 'flow', op: 'push', lane: 'gzip', item: { id: 'p_gzip', label: 'chunk n+1', sub: 'đang nén', tone: 'info' } },
      { p: 'flow', op: 'push', lane: 'write', item: { id: 'p_write', label: 'chunk n', sub: 'đang ghi', tone: 'warn' } },
      gauge('ram', 68, '68 MB', 'ok'),
      gauge('read', 180, '180 MB'),
      gauge('time', 600, '600 ms'),
    ],
    { sfx: 'stream' }
  );

  push(
    'backpressure',
    { vi: 'Áp lực ngược — thứ làm cho stream hoạt động được', en: 'Backpressure — what makes streams work' },
    {
      vi: 'Nếu đĩa đọc nhanh mà đích ghi chậm thì sao? Khi bộ đệm của đích đầy, `write()` trả về `false` và luồng đọc TỰ TẠM DỪNG cho tới khi đích kêu `drain`. Không có cơ chế này thì dữ liệu chất đống trong RAM — đúng cái vụ nổ mà ta dùng stream để tránh.',
      en: 'What if the disk reads fast and the destination writes slow? When the destination’s buffer fills, `write()` returns `false` and the read stream PAUSES ITSELF until the destination emits `drain`. Without that, data piles up in memory — the exact blow-up streams were meant to avoid.',
    },
    2800,
    [
      { p: 'flow', op: 'tone', lane: 'write', key: 'p_write', tone: 'err', sub: 'write() = false' },
      { p: 'flow', op: 'tone', lane: 'read', key: 'p_read', tone: 'muted', sub: 'tự tạm dừng' },
      gauge('ram', 75, '75 MB — vẫn phẳng', 'ok'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Đây là câu trả lời cho "tại sao stream không làm tràn RAM khi đích chậm".',
        en: 'This answers "why streams do not blow up RAM when the destination is slow".',
      },
    }
  );

  push(
    'done',
    { vi: '348 MB → 15 MB trong 1.169 ms, đỉnh 75 MB', en: '348 MB → 15 MB in 1,169 ms, peak 75 MB' },
    {
      vi: 'Nén xong cả file mà chưa lúc nào giữ quá 75 MB. Nếu làm theo kiểu đọc hết thì cần 348 MB cho bản gốc, cộng thêm chỗ cho bản nén.',
      en: 'The whole file compressed without ever holding more than 75 MB. The buffered way would need 348 MB for the original, plus room for the compressed copy.',
    },
    2700,
    [
      { p: 'flow', op: 'clear' },
      gauge('ram', 75, '75 MB — ĐỈNH', 'ok'),
      gauge('read', 348, '348 MB', 'ok'),
      gauge('time', 1169, '1.169 ms', 'ok'),
      out('nén xong trong 1169 ms | đỉnh RAM: 75 MB', 'ok'),
      out('gốc: 348.0 MB → nén: 15.0 MB', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'verdict',
    { vi: 'Luôn dùng pipeline, đừng bao giờ a.pipe(b).pipe(c)', en: 'Always use pipeline, never a.pipe(b).pipe(c)' },
    {
      vi: '`.pipe()` kiểu cũ KHÔNG chuyển tiếp lỗi và KHÔNG dọn dẹp: nếu chặng ghi hỏng giữa chừng, luồng đọc vẫn mở và bạn rò một file descriptor sau MỖI lần lỗi. `pipeline` huỷ đúng cả dây chuyền và cho bạn một chỗ duy nhất để bắt lỗi.',
      en: 'The old `.pipe()` does NOT forward errors and does NOT clean up: if the write fails halfway, the read stream stays open and you leak a file descriptor on EVERY failure. `pipeline` destroys the whole chain properly and gives you one place to catch errors.',
    },
    3000,
    [lines([1, 2])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsStreamScenario: Scenario = {
  id: 'nodejs-stream',
  name: { vi: 'Stream — thí nghiệm file 348 MB', en: 'Streams — the 348 MB experiment' },
  tagline: {
    vi: 'Cùng một phép đếm dòng: đọc hết file tốn 395 MB RAM và 3.662 ms, đọc bằng stream tốn 120 MB và 2.544 ms. Nhẹ hơn VÀ nhanh hơn — xem vì sao.',
    en: 'The same line count: reading the whole file costs 395 MB and 3,662 ms; streaming costs 120 MB and 2,544 ms. Lighter AND faster — see why.',
  },
  icon: Waves,
  accent: '#38bdf8',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '3.3',
    slug: 'nodejs-3-3-stream',
    title: { vi: 'Stream: thí nghiệm với file 348 MB', en: 'Streams: the 348 MB experiment' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'mode',
      label: { vi: 'Cách xử lý file 348 MB', en: 'How to process the 348 MB file' },
      defaultValue: 'buffer',
      choices: [
        {
          value: 'buffer',
          label: 'Đọc hết vào RAM',
          fullLabel: 'readFileSync — 395 MB, 3.662 ms',
          color: '#f43f5e',
          hint: { vi: 'chi phí tỉ lệ thuận cỡ file', en: 'cost scales with file size' },
        },
        {
          value: 'stream',
          label: 'Đọc bằng stream',
          fullLabel: 'createReadStream — 120 MB, 2.544 ms',
          color: '#34d399',
          hint: { vi: 'RAM đi ngang dù file to cỡ nào', en: 'flat RAM at any file size' },
        },
        {
          value: 'pipe',
          label: 'pipeline + gzip',
          fullLabel: 'đọc → nén → ghi, 348 MB còn 15 MB',
          color: '#a855f7',
          hint: { vi: 'ba chặng chạy chồng lên nhau', en: 'three stages overlapping' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] =>
    opts.mode === 'stream' ? buildStream() : opts.mode === 'pipe' ? buildPipeline() : buildBuffered(),
};
