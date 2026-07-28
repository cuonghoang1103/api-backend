/**
 * Node.js · Bài 16.5 — Bộ nhớ: cái cache không bao giờ quên.
 *
 * Số đo lấy nguyên từ giáo trình (cùng app Express, bốn chế độ, RSS lấy mẫu
 * sau 20k / 50k / 100k request; trần heap 4.144 MB):
 *
 *   chế độ    đầu    20k      50k      100k     phần tử
 *   none     56,6   122,5    123,3    123,4         0     ← ĐI NGANG
 *   leak     57,0   162,2    232,4    351,5   100.000     ← tuyến tính
 *   lru      56,6   124,9    126,0    125,7     1.000     ← phẳng
 *   listener 56,8   130,2    142,6    173,1   170.000
 *
 * Biểu đồ ĐƯỜNG là nguyên thuỷ chính ở đây, không phải cột: cả bài học nằm ở
 * HÌNH DẠNG của đường (đi ngang so với leo tuyến tính), chứ không ở giá trị
 * tại một thời điểm. "RSS 120MB, có sao không?" là câu hỏi không trả lời được;
 * "RSS tăng 90MB qua 100.000 request và chưa dừng" là một chẩn đoán.
 */

import { MemoryStick } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const LEAK_CODE = [
  'const cache = new Map();',
  '',
  "app.get('/notes/:id', (req, res) => {",
  '  const key = req.params.id;          // khoá lấy từ URL',
  '  if (!cache.has(key))',
  "    cache.set(key, { id: key, body: 'x'.repeat(2000) });",
  '  res.json({ n: cache.size });',
  '});',
  '',
  '// phép sửa — một câu điều kiện, và nó THẬT SỰ miễn phí',
  'if (cache.size >= 1000)',
  '  cache.delete(cache.keys().next().value);  // bỏ cái cũ nhất',
];

const LISTENER_CODE = [
  "app.get('/notes/:id', (req, res) => {",
  "  process.on('customEvent', () => {});  // đăng ký, KHÔNG BAO GIỜ gỡ",
  '  res.json({ ok: true });',
  '});',
  '',
  '// Node đã cảnh báo, rất to, ngay ở request thứ MƯỜI MỘT:',
  '// MaxListenersExceededWarning: Possible EventEmitter',
  '// memory leak detected. 11 customEvent listeners added',
  '// to [process]. MaxListeners is 10.',
  '',
  '// Use emitter.setMaxListeners() to increase limit  ← ĐỪNG',
];

const LIMIT_CODE = [
  '# trần heap mặc định: Node tự chọn theo RAM TỔNG của máy',
  '#   → trong container phải khai TAY',
  '',
  'node --max-old-space-size=512 server.js',
  '#   chạm trần → Node ném lỗi + stack trace. BẠN BIẾT vì sao',
  '',
  '# không đặt, container limit 512MB:',
  '#   Node tưởng mình có nhiều RAM hơn thực tế',
  '#   → kernel SIGKILL, exit 137, KHÔNG có log gì',
  '',
  '# quy tắc: heap ≈ 75% giới hạn container',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

type Mode = 'cache' | 'listener' | 'limits';
const modeOf = (opts: ScenarioOptions): Mode =>
  opts.mode === 'listener' || opts.mode === 'limits' ? opts.mode : 'cache';

const panels = (opts: ScenarioOptions): PanelSpec[] => {
  const mode = modeOf(opts);
  return [
    {
      id: 'code',
      kind: 'code',
      title: { vi: 'Đoạn mã', en: 'The code' },
      x: 0,
      y: 0,
      w: 452,
      h: 300,
      lines: mode === 'listener' ? LISTENER_CODE : mode === 'limits' ? LIMIT_CODE : LEAK_CODE,
    },
    {
      id: 'gauges',
      kind: 'meter',
      title: { vi: 'Tiến trình đang ở đâu', en: 'Where the process stands' },
      hint: { vi: 'trần heap 4.144 MB', en: 'heap limit 4,144 MB' },
      x: 0,
      y: 312,
      w: 452,
      h: 248,
      accent: '#f59e0b',
      meters: [
        { id: 'rss', label: 'RSS', max: 400, unit: 'MB', threshold: 123, thresholdLabel: 'mức của app khoẻ mạnh', accent: '#f43f5e' },
        { id: 'items', label: 'Số phần tử đang bị giữ lại', max: 170_000, unit: 'phần tử', accent: '#a78bfa' },
      ],
    },
    {
      id: 'rssChart',
      kind: 'chart',
      mode: 'line',
      title: { vi: 'RSS theo số request đã phục vụ', en: 'RSS against requests served' },
      hint: { vi: 'bài học nằm ở HÌNH DẠNG, không ở con số', en: 'the lesson is the SHAPE, not the number' },
      x: 464,
      y: 0,
      w: 536,
      h: 348,
      accent: '#f43f5e',
      unit: 'MB',
      max: 380,
      xMax: 100_000,
      xLabel: { vi: 'số request', en: 'requests served' },
      series: [
        { id: 'none', label: 'none (đối chứng)', accent: '#64748b' },
        { id: 'leak', label: 'cache không trần', accent: '#f43f5e' },
        { id: 'lru', label: 'cache có trần 1.000', accent: '#34d399' },
        { id: 'listener', label: 'listener không gỡ', accent: '#f59e0b' },
      ],
    },
    {
      id: 'log',
      kind: 'log',
      title: { vi: 'Kết quả đo', en: 'Measured output' },
      file: 'node mem-lab.js',
      x: 464,
      y: 360,
      w: 536,
      h: 200,
      accent: '#38bdf8',
      maxLines: 7,
    },
  ];
};

/* ── Tiện ích ────────────────────────────────────────────────── */

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const log = (label: string, tone: 'ok' | 'warn' | 'err' | 'muted' = 'muted'): PanelOp => ({
  p: 'log',
  op: 'push',
  item: { label, tone },
});
const gauge = (key: string, value: number, label?: string, tone?: 'ok' | 'warn' | 'err'): PanelOp => ({
  p: 'gauges',
  op: 'value',
  key,
  value,
  label,
  tone,
});
/** Một điểm trên đường RSS: (số request, MB). */
const pt = (series: string, x: number, y: number): PanelOp => ({ p: 'rssChart', op: 'point', key: series, x, y });

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ── Đường đối chứng, dùng lại ở cả ba chế độ ────────────────── */

const CONTROL: PanelOp[] = [pt('none', 0, 56.6), pt('none', 20_000, 122.5), pt('none', 50_000, 123.3), pt('none', 100_000, 123.4)];

/* ────────────────────────────────────────────────────────────
   A — CÁI CACHE KHÔNG CÓ TRẦN
   ──────────────────────────────────────────────────────────── */

function buildCache(): SimStep[] {
  const { steps, push } = collector();

  push(
    'control',
    { vi: 'Đọc dòng ĐỐI CHỨNG trước — 56,6 → 122,5 → 123,3 → 123,4 MB', en: 'Read the CONTROL row first — 56.6 → 122.5 → 123.3 → 123.4 MB' },
    {
      vi: 'Ứng dụng khoẻ mạnh tăng gấp đôi rồi DỪNG. Lần tăng đầu ấy KHÔNG phải rò rỉ: đó là V8 nới heap ra tới cỡ làm việc thoải mái, cấp phát mã JIT, làm đầy bộ đệm nội bộ. Bộ nhớ tăng rồi đi ngang là bình thường; bộ nhớ tăng TUYẾN TÍNH theo lưu lượng mới là rò rỉ.',
      en: 'A healthy app doubles and then STOPS. That first jump is NOT a leak: it is V8 growing the heap to a comfortable working size, allocating JIT code, filling internal buffers. Memory that rises then flattens is normal; memory that rises LINEARLY with traffic is a leak.',
    },
    2800,
    [
      lines([]),
      ...CONTROL,
      gauge('rss', 123.4, '123,4 MB', 'ok'),
      gauge('items', 0, '0 phần tử', 'ok'),
      log('none  56,6 → 122,5 → 123,3 → 123,4 MB   (0 phần tử)', 'ok'),
    ],
    {
      sfx: 'click',
      teachingNote: {
        vi: '"RSS 120MB có sao không?" là câu hỏi KHÔNG TRẢ LỜI ĐƯỢC — một điểm dữ liệu không phân biệt được hai đường.',
        en: '"Is 120MB RSS okay?" is an UNANSWERABLE question — one data point cannot tell the two curves apart.',
      },
    }
  );

  push(
    'leak',
    { vi: 'Sáu dòng, hiển nhiên có lợi, và hoàn toàn không có trần', en: 'Six lines, obviously useful, and completely unbounded' },
    {
      vi: 'Khoá lấy từ URL, nên số phần tử bằng số id KHÁC NHAU mà bất kỳ ai từng yêu cầu — với một API công khai thì con số đó là vô hạn. RSS leo 57 → 162 → 232 → 351,5 MB và vẫn đang leo đều đặn 2,4 KB cho mỗi id mới.',
      en: 'The key comes from the URL, so the entry count equals the number of DISTINCT ids anyone has ever requested — on a public API that number is unbounded. RSS climbs 57 → 162 → 232 → 351.5 MB and is still climbing at a steady 2.4 KB per new id.',
    },
    2900,
    [
      lines([1, 3, 4, 5, 6, 7, 8]),
      pt('leak', 0, 57), pt('leak', 20_000, 162.2), pt('leak', 50_000, 232.4), pt('leak', 100_000, 351.5),
      gauge('rss', 351.5, '351,5 MB', 'err'),
      gauge('items', 100_000, '100.000 phần tử', 'err'),
      log('leak  57,0 → 162,2 → 232,4 → 351,5 MB  (100.000)', 'err'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'death',
    { vi: 'Với trần heap 4.144 MB, tiến trình chết sau ~1,7 triệu id', en: 'Against a 4,144 MB heap limit, the process dies after ~1.7 million ids' },
    {
      vi: 'Ở một site ít lưu lượng thì đó là chuyện của vài tháng nữa — và đó CHÍNH XÁC là lý do nó lọt được lên production. Dịch vụ chạy tốt suốt một ngày, chậm dần vào ngày thứ hai khi bộ dọn rác phải làm việc nặng hơn, rồi chết vào ngày thứ ba vì hết bộ nhớ, khởi động lại, trông khoẻ mạnh, và bắt đầu lại đúng cái đồng hồ đếm ngược ấy.',
      en: 'On a low-traffic site that is months away — and that is EXACTLY why it reaches production. The service runs fine for a day, slows on day two as the garbage collector works harder, dies on day three out of memory, restarts, looks healthy, and starts the same countdown again.',
    },
    2900,
    [log('trần heap 4.144MB ÷ 2,4KB mỗi id ≈ 1,7 triệu id', 'err')],
    { sfx: 'error' }
  );

  push(
    'lru',
    { vi: 'Phép sửa là một câu điều kiện — và đường RSS thành PHẲNG', en: 'The fix is one conditional — and the RSS line goes FLAT' },
    {
      vi: '`Map` trong JavaScript giữ nguyên thứ tự chèn, nên `keys().next().value` chính là phần tử cũ nhất: đây là một cái LRU dài năm từ. Nó giữ nguyên TOÀN BỘ lợi ích của việc cache với 2,3 MB bộ nhớ thay vì 295 MB — và đường của nó không phân biệt được với app không hề cache.',
      en: 'A JavaScript `Map` preserves insertion order, so `keys().next().value` is the oldest entry: this is a five-word LRU. It keeps ALL of the caching benefit at 2.3 MB instead of 295 MB — and its curve is indistinguishable from the app with no cache at all.',
    },
    3000,
    [
      lines([10, 11, 12]),
      pt('lru', 0, 56.6), pt('lru', 20_000, 124.9), pt('lru', 50_000, 126), pt('lru', 100_000, 125.7),
      gauge('rss', 125.7, '125,7 MB', 'ok'),
      gauge('items', 1000, '1.000 phần tử', 'ok'),
      log('lru   56,6 → 124,9 → 126,0 → 125,7 MB   (1.000)', 'ok'),
      log('→ PHẲNG, không phân biệt được với app không cache', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'rule',
    { vi: 'Quy tắc: mọi cache trong bộ nhớ đều cần một cái trần', en: 'The rule: every in-memory cache needs a ceiling' },
    {
      vi: 'Một giới hạn số phần tử, một TTL, hoặc cả hai — quyết định LÚC BẠN VIẾT nó, chứ không phải lúc nó hỏng. Nếu khó nói ra một giới hạn tự nhiên thì đó là tín hiệu dữ liệu ấy thuộc về Redis (chương 12), nơi việc thu hồi là việc của người khác và `allkeys-lru` đã lo sẵn.',
      en: 'An entry limit, a TTL, or both — decided WHEN YOU WRITE IT, not when it breaks. If you cannot state a natural bound, that is a signal the data belongs in Redis (chapter 12), where eviction is somebody else\'s problem and `allkeys-lru` already handles it.',
    },
    2800,
    [lines([10, 11, 12]), log('không nói được giới hạn tự nhiên → dùng Redis', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — CÁI LISTENER KHÔNG AI GỠ
   ──────────────────────────────────────────────────────────── */

function buildListener(): SimStep[] {
  const { steps, push } = collector();

  push(
    'register',
    { vi: '170.000 request, 170.000 listener', en: '170,000 requests, 170,000 listeners' },
    {
      vi: 'Object giữ listener (`process`) không bao giờ chết, nên mọi closure nó nắm đều còn với tới được MÃI MÃI — bao gồm cả mọi thứ closure ấy bắt giữ, mà thường là nguyên cả cái request. RSS ở 173,1 MB và đang tăng.',
      en: 'The object holding the listener (`process`) never dies, so every closure it holds stays reachable FOREVER — including everything that closure captured, which is usually the whole request. RSS sits at 173.1 MB and rising.',
    },
    2700,
    [
      lines([1, 2, 3, 4]),
      ...CONTROL,
      pt('listener', 0, 56.8), pt('listener', 20_000, 130.2), pt('listener', 50_000, 142.6), pt('listener', 100_000, 173.1),
      gauge('rss', 173.1, '173,1 MB', 'err'),
      gauge('items', 170_000, '170.000 listener', 'err'),
      log('listener 56,8 → 130,2 → 142,6 → 173,1 MB', 'err'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'disguise',
    { vi: 'Hình dạng này hiếm khi lộ nguyên văn — nó đội lốt', en: 'This shape rarely appears verbatim — it wears a disguise' },
    {
      vi: 'Một phép đăng ký lên client Redis. Một listener của `AbortSignal`. Một handler socket đăng ký THEO TỪNG REQUEST lên một emitter sống lâu. Dấu hiệu chung: bên đăng ký sống ngắn, bên bị đăng ký sống lâu.',
      en: 'A subscription on the Redis client. An `AbortSignal` listener. A socket handler registered PER REQUEST on a long-lived emitter. The common signature: the subscriber is short-lived, the thing subscribed to is not.',
    },
    2700,
    [log('client Redis · AbortSignal · handler socket theo request', 'warn')],
    { sfx: 'blip' }
  );

  push(
    'warning',
    { vi: 'Node đã cảnh báo, rất to, ngay ở request thứ MƯỜI MỘT', en: 'Node warned you, loudly, on request ELEVEN' },
    {
      vi: '`MaxListenersExceededWarning: Possible EventEmitter memory leak detected.` Cảnh báo này có tỉ lệ trúng rất cao — nó nổ vì một lỗi THẬT nhiều hơn hẳn số lần nổ oan.',
      en: '`MaxListenersExceededWarning: Possible EventEmitter memory leak detected.` This warning has a very high hit rate — it fires for a REAL bug far more often than it fires spuriously.',
    },
    2700,
    [
      lines([6, 7, 8, 9]),
      log('MaxListenersExceededWarning: 11 customEvent listeners', 'warn'),
    ],
    { sfx: 'ping' }
  );

  push(
    'dontfix',
    { vi: 'Và ĐỪNG làm cái điều mà chính cảnh báo ấy gợi ý', en: 'And do NOT do what the warning itself suggests' },
    {
      vi: '"Use emitter.setMaxListeners() to increase limit" tắt được cái chuông báo và GIỮ NGUYÊN chỗ rò rỉ. Phản ứng đúng là đi tìm xem ai đang đăng ký mà không bao giờ gỡ. Nâng giới hạn lên là cách biến một phép sửa năm phút thành một cuộc điều tra production ba ngày.',
      en: '"Use emitter.setMaxListeners() to increase limit" silences the alarm and KEEPS the leak. The right response is to find who subscribes and never unsubscribes. Raising the limit is how a five-minute fix becomes a three-day production investigation.',
    },
    2900,
    [
      lines([11]),
      log('setMaxListeners() → chuông tắt, rò rỉ còn nguyên', 'err'),
      log('đúng: tìm chỗ đăng ký mà không gỡ → off()/once()', 'ok'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Khi thủ phạm không rõ: chụp hai ảnh heap, so bằng "Comparison", đọc cột Retainers.',
        en: 'When the culprit is unclear: two heap snapshots, "Comparison" view, read the Retainers column.',
      },
    }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   C — TRẦN HEAP, VÀ CÚ GIẾT KHÔNG ĐỂ LẠI DÒNG LOG NÀO
   ──────────────────────────────────────────────────────────── */

function buildLimits(): SimStep[] {
  const { steps, push } = collector();

  push(
    'default',
    { vi: 'Trần heap mặc định 4.144 MB — Node tự chọn theo RAM TỔNG', en: 'Default heap limit 4,144 MB — Node picks it from TOTAL RAM' },
    {
      vi: 'Trên máy này là 4.144 MB. Trong container, Node vẫn nhìn thấy RAM của cả HOST chứ không phải giới hạn của container — nên bạn phải khai bằng tay.',
      en: 'On this machine, 4,144 MB. Inside a container, Node still sees the HOST\'s RAM rather than the container limit — so you have to declare it by hand.',
    },
    2500,
    [
      lines([1, 2]),
      ...CONTROL,
      gauge('rss', 123.4, '123,4 MB', 'ok'),
      gauge('items', 0, '—'),
      log('heap limit = 4.144MB (theo RAM tổng của máy)'),
    ],
    { sfx: 'click' }
  );

  push(
    'declared',
    { vi: '`--max-old-space-size=512` — chạm trần thì BẠN BIẾT vì sao', en: '`--max-old-space-size=512` — hit the ceiling and you KNOW why' },
    {
      vi: 'Node ném lỗi và in stack trace: có chỗ để bắt đầu điều tra. Quy tắc: đặt heap ≈ 75% giới hạn container, chừa chỗ cho Buffer, socket và stack — chúng nằm NGOÀI heap.',
      en: 'Node throws and prints a stack trace: you have somewhere to start. The rule: set the heap to ≈75% of the container limit, leaving room for buffers, sockets and stacks — they live OUTSIDE the heap.',
    },
    2700,
    [
      lines([4, 5]),
      pt('lru', 0, 56.6), pt('lru', 20_000, 124.9), pt('lru', 50_000, 126), pt('lru', 100_000, 125.7),
      log('chạm trần → JavaScript heap out of memory + stack', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'oom',
    { vi: 'Không đặt gì, container 512MB → exit 137, KHÔNG log', en: 'Nothing declared, 512MB container → exit 137, NO logs' },
    {
      vi: 'Node tưởng mình có nhiều RAM hơn thực tế, cứ thế lớn lên, và kernel giết nó bằng `SIGKILL`. Không có lỗi, không có stack trace, chỉ có mã thoát 137 — dự án này đã gặp đúng hai lần: một lần do build Docker song song, một lần do một tiến trình chạy loạn.',
      en: 'Node believes it has more RAM than it does, keeps growing, and the kernel kills it with `SIGKILL`. No error, no stack trace, just exit code 137 — this project has hit it exactly twice: once from parallel Docker builds, once from a runaway process.',
    },
    2900,
    [
      lines([7, 8, 9]),
      pt('leak', 0, 57), pt('leak', 20_000, 162.2), pt('leak', 50_000, 232.4), pt('leak', 100_000, 351.5),
      gauge('rss', 351.5, '351,5 MB → SIGKILL', 'err'),
      log('exit 137 · không có log gì để đọc', 'err'),
    ],
    { sfx: 'error' }
  );

  push(
    'buffers',
    { vi: 'Bẫy thật: Buffer nằm NGOÀI heap của V8', en: 'The real trap: buffers live OUTSIDE the V8 heap' },
    {
      vi: 'Một tiến trình xử lý upload có thể ở mức 200 MB heap mà 1,5 GB RSS, và `--max-old-space-size` sẽ KHÔNG BAO GIỜ nổ — cái nổ là giới hạn container, với exit 137. Chương 10 đo trên chính codebase này: bốn lượt upload 120 MB đồng thời đưa RSS từ 56,7 lên 786,1 MB, và một PNG 758 KB chứa ảnh 16000×16000 tốn 99 MB RSS để giải mã. Không cái nào hiện ra trong ảnh chụp heap. Khi RSS cao mà heap thì không, hãy thôi nhìn object JavaScript và bắt đầu nhìn buffer, stream, module native.',
      en: 'An upload-handling process can sit at 200 MB heap and 1.5 GB RSS, and `--max-old-space-size` will NEVER fire — what fires is the container limit, with exit 137. Chapter 10 measured it on this very codebase: four concurrent 120 MB uploads took RSS from 56.7 to 786.1 MB, and a 758 KB PNG holding a 16000×16000 image cost 99 MB of RSS to decode. Neither shows up in a heap snapshot. When RSS is high but the heap is not, stop looking at JavaScript objects and start looking at buffers, streams and native modules.',
    },
    3100,
    [
      lines([11]),
      gauge('rss', 400, '786,1 MB (ngoài thang)', 'err'),
      log('4 upload 120MB đồng thời: 56,7MB → 786,1MB RSS', 'err'),
      log('PNG 758KB (16000×16000) = 99MB RSS để giải mã', 'err'),
      log('→ cả hai VÔ HÌNH trong ảnh chụp heap', 'warn'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Phép sửa đúng là một cái TRẦN quyết định trước: MAX_INPUT_PIXELS, hàng đợi tối đa 4 lượt giải mã.',
        en: 'The right fix is a ceiling decided in advance: MAX_INPUT_PIXELS, a queue capped at 4 concurrent decodes.',
      },
    }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsMemoryLeakScenario: Scenario = {
  id: 'nodejs-memory-leak',
  name: { vi: 'Bộ nhớ: cái cache không bao giờ quên', en: 'Memory: the cache that never forgets' },
  tagline: {
    vi: 'Cùng một app, bốn chế độ: app khoẻ mạnh dừng ở 123,4 MB, cache không trần leo tới 351,5 MB và chưa dừng, thêm một câu điều kiện là đường RSS thành phẳng ở 125,7 MB. Bài học nằm ở HÌNH DẠNG của đường, không ở con số tại một thời điểm.',
    en: 'One app, four modes: the healthy one settles at 123.4 MB, the unbounded cache climbs to 351.5 MB and keeps going, and one added conditional flattens the curve at 125.7 MB. The lesson is the SHAPE of the line, not the number at any one moment.',
  },
  icon: MemoryStick,
  accent: '#f43f5e',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '16.5',
    slug: 'nodejs-16-5-ro-ri-bo-nho',
    title: { vi: 'Bộ nhớ: cái cache không bao giờ quên', en: 'Memory: the cache that never forgets' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'mode',
      label: { vi: 'Kiểu rò rỉ', en: 'Which leak' },
      defaultValue: 'cache',
      choices: [
        {
          value: 'cache',
          label: 'Cache không trần',
          fullLabel: '57 → 351,5 MB, 100.000 phần tử · sửa bằng 1 dòng',
          color: '#f43f5e',
          hint: { vi: 'sáu dòng, hiển nhiên có lợi, không có trần', en: 'six lines, obviously useful, unbounded' },
        },
        {
          value: 'listener',
          label: 'Listener không gỡ',
          fullLabel: '170.000 listener · và cảnh báo bạn KHÔNG nên nghe theo',
          color: '#f59e0b',
          hint: { vi: 'setMaxListeners() tắt chuông, giữ rò rỉ', en: 'setMaxListeners() silences the alarm, keeps the leak' },
        },
        {
          value: 'limits',
          label: 'Trần heap & exit 137',
          fullLabel: 'Buffer nằm NGOÀI heap — SIGKILL không để lại log',
          color: '#a78bfa',
          hint: { vi: 'RSS cao mà heap thấp = nhìn sang buffer', en: 'high RSS but low heap = look at buffers' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => {
    const mode = modeOf(opts);
    return mode === 'listener' ? buildListener() : mode === 'limits' ? buildLimits() : buildCache();
  },
};
