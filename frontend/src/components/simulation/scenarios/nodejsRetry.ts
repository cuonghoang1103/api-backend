/**
 * Node.js · Bài 13.3 — Thất bại: thử lại, backoff, và cú trừ tiền chạy ba lần.
 *
 * Số đo lấy nguyên từ giáo trình (BullMQ + Redis thật):
 *
 *   không cấu hình     : chạy 1 lần · failed=1 · KHÔNG thử lại
 *   backoff cố định 300: 4 lần · khoảng cách 368 · 312 · 311 ms
 *   backoff luỹ thừa   : 5 lần · khoảng cách 288 · 417 · 826 · 1674 ms
 *   bên kia hồi phục   : chạy 3 lần · completed=1 · không ai bị gọi dậy lúc 3h sáng
 *   job KHÔNG idempotent: trừ 300.000đ cho một đơn 100.000đ
 *   jobId              : gọi add() 5 lần → 1 job chờ → 1 hoá đơn
 *
 * Câu quan trọng nhất của cả chương, và là thứ kịch bản phải nói thẳng: hàng
 * đợi bảo đảm giao ÍT NHẤT MỘT LẦN, không phải ĐÚNG MỘT LẦN. "Đúng một lần"
 * không tồn tại trong hệ phân tán; cái tồn tại là hàm xử lý idempotent.
 */

import { RefreshCw } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const BACKOFF_CODE = [
  '// không cấu hình gì → chạy 1 lần rồi nằm im trong "failed"',
  "new Worker('email', handler);",
  '',
  '// backoff cố định — lựa chọn mặc định SAI',
  "await queue.add('send', data, {",
  "  attempts: 4, backoff: { type: 'fixed', delay: 300 },",
  '});',
  '',
  '// backoff luỹ thừa — nhân đôi khoảng cách mỗi vòng',
  "await queue.add('send', data, {",
  "  attempts: 5, backoff: { type: 'exponential', delay: 200 },",
  '});',
];

const IDEM_CODE = [
  '// 1) Khoá duy nhất trong CSDL — cách chắc chắn nhất',
  'try {',
  "  await db.payment.create({ data: { orderId, amount } });",
  '} catch (err) {',
  "  if (err.code === 'P2002') return { skipped: 'đã trừ rồi' };",
  '  throw err;',
  '}',
  'await psp.charge({ orderId, amount });',
  '',
  '// 3) Khoá idempotency đưa cho bên thứ ba',
  'await psp.charge({ orderId, amount },',
  '  { idempotencyKey: `charge-${orderId}` });',
];

const DEDUPE_CODE = [
  '// chặn trùng ngay ở cửa: jobId tất định',
  "await queue.add('invoice', data, {",
  "  jobId: `invoice-${orderId}`,   // KHÔNG được chứa dấu :",
  '});',
  '',
  '// cố tình hỏng luôn, không thử lại',
  "import { UnrecoverableError } from 'bullmq';",
  "if (!user) throw new UnrecoverableError('người dùng không còn');",
  '',
  '// chạy lại cả đống job chết sau khi sửa nguyên nhân',
  'const failed = await queue.getFailed(0, 1000);',
  'for (const job of failed) await job.retry();',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

type Mode = 'backoff' | 'idempotent' | 'dedupe';
const modeOf = (opts: ScenarioOptions): Mode =>
  opts.mode === 'idempotent' || opts.mode === 'dedupe' ? opts.mode : 'backoff';

const CHART: Record<Mode, { title: I18nText; unit: string; max: number }> = {
  backoff: {
    title: { vi: 'Khoảng cách giữa hai lần thử (ms)', en: 'Gap between attempts (ms)' },
    unit: 'ms',
    max: 1800,
  },
  idempotent: {
    title: { vi: 'Số tiền thật sự bị trừ của khách (đồng)', en: 'Money actually taken from the customer (VND)' },
    unit: 'đ',
    max: 320_000,
  },
  dedupe: {
    title: { vi: 'Bấm nút bao nhiêu lần → tạo ra bao nhiêu job', en: 'Clicks in → jobs created' },
    unit: 'job',
    max: 6,
  },
};

const METERS: Record<Mode, PanelSpec & { kind: 'meter' }> = {
  backoff: {
    id: 'gauges',
    kind: 'meter',
    title: { vi: 'Job này đã đi tới đâu', en: 'Where this job stands' },
    x: 464,
    y: 360,
    w: 536,
    h: 200,
    accent: '#f59e0b',
    meters: [
      { id: 'runs', label: 'Số lần hàm xử lý chạy', max: 5, unit: 'lần', accent: '#38bdf8' },
      { id: 'total', label: 'Tổng thời gian tới lần thử cuối', max: 3300, unit: 'ms', accent: '#f59e0b' },
    ],
  },
  idempotent: {
    id: 'gauges',
    kind: 'meter',
    title: { vi: 'Hậu quả ngoài đời thật', en: 'The real-world consequence' },
    x: 464,
    y: 360,
    w: 536,
    h: 200,
    accent: '#f43f5e',
    meters: [
      { id: 'runs', label: 'Số lần hàm xử lý chạy', max: 3, unit: 'lần', accent: '#38bdf8' },
      { id: 'money', label: 'Đã trừ của khách', max: 300_000, unit: 'đ', threshold: 100_000, thresholdLabel: 'giá đơn hàng', accent: '#f43f5e' },
    ],
  },
  dedupe: {
    id: 'gauges',
    kind: 'meter',
    title: { vi: 'Hàng đợi đang chứa gì', en: 'What the queue is holding' },
    x: 464,
    y: 360,
    w: 536,
    h: 200,
    accent: '#34d399',
    meters: [
      { id: 'runs', label: 'Job thật sự đang chờ', max: 5, unit: 'job', accent: '#34d399' },
      { id: 'total', label: 'Job nằm trong tập "failed"', max: 5, unit: 'job', accent: '#f43f5e' },
    ],
  },
};

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
      lines: mode === 'idempotent' ? IDEM_CODE : mode === 'dedupe' ? DEDUPE_CODE : BACKOFF_CODE,
    },
    {
      id: 'log',
      kind: 'log',
      title: { vi: 'Kết quả chạy thật', en: 'Real run output' },
      file: 'node retry-lab.js',
      x: 0,
      y: 312,
      w: 452,
      h: 248,
      accent: '#38bdf8',
      maxLines: 7,
    },
    {
      id: 'cost',
      kind: 'chart',
      mode: 'bar',
      title: CHART[mode].title,
      hint:
        mode === 'backoff'
          ? { vi: 'cùng một job, hai kiểu backoff', en: 'the same job, two backoff strategies' }
          : undefined,
      x: 464,
      y: 0,
      w: 536,
      h: 348,
      accent: '#34d399',
      unit: CHART[mode].unit,
      max: CHART[mode].max,
    },
    METERS[mode],
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
const bar = (key: string, value: number, label: string, tone: 'ok' | 'warn' | 'err'): PanelOp => ({
  p: 'cost',
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
   A — BACKOFF: CỐ ĐỊNH LÀ LỰA CHỌN MẶC ĐỊNH SAI
   ──────────────────────────────────────────────────────────── */

function buildBackoff(): SimStep[] {
  const { steps, push } = collector();

  push(
    'none',
    { vi: 'Không cấu hình gì — job hỏng nằm im, mãi mãi', en: 'No config at all — a failed job just sits there, forever' },
    {
      vi: 'Một lần thử, không thử lại, job chuyển vào tập `failed` và nằm đó lặng lẽ. Vẫn tốt hơn bản đồng bộ ở bài 13.1 — công việc không MẤT, nó được ghi lại kèm lý do và chạy lại được — nhưng sẽ chẳng ai tới nhìn nó cả trừ khi bạn dựng ra thứ làm việc đó.',
      en: 'One attempt, no retry, the job moves to the `failed` set and sits there quietly. Still better than the synchronous version from 13.1 — the work is not LOST, it is recorded with a reason and re-runnable — but nobody will ever look at it unless you build something that does.',
    },
    2600,
    [
      lines([1, 2]),
      gauge('runs', 1, '1 lần', 'warn'),
      gauge('total', 0, '—'),
      log('hàm xử lý chạy 1 lần · failed=1 · waiting=0', 'warn'),
      log('failedReason = "SMTP 421" · attemptsMade = 1', 'warn'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'fixed',
    { vi: 'Backoff cố định — 368 · 312 · 311 ms, đều tăm tắp', en: 'Fixed backoff — 368 · 312 · 311 ms, metronomic' },
    {
      vi: '`attempts: 4` cộng `backoff: fixed 300ms`: bốn lần chạy, lần nào cũng chờ đúng bấy nhiêu. Chạy được, và đây vẫn là lựa chọn mặc định SAI — lý do nằm ở bước sau.',
      en: '`attempts: 4` plus `backoff: fixed 300ms`: four runs, each waiting exactly the same. It works, and it is still the WRONG default — the reason is in the next step.',
    },
    2700,
    [
      lines([5, 6, 7]),
      gauge('runs', 4, '4 lần', 'warn'),
      gauge('total', 1000, '1.000 ms', 'warn'),
      bar('cố định #1', 368, '368', 'warn'),
      bar('cố định #2', 312, '312', 'warn'),
      bar('cố định #3', 311, '311', 'warn'),
      log('4 lần: 9ms → 377ms → 689ms → 1000ms'),
    ],
    { sfx: 'blip' }
  );

  push(
    'expo',
    { vi: 'Luỹ thừa — 288 → 417 → 826 → 1674 ms, gấp đôi mỗi vòng', en: 'Exponential — 288 → 417 → 826 → 1674 ms, doubling each round' },
    {
      vi: 'Lý do thường gặp nhất khiến một job hỏng là có thứ gì đó ở phía dưới đang QUÁ TẢI. Thử lại theo nhịp cố định và nhanh là cộng thêm tải cho một dịch vụ vốn đã sắp chết đuối — chính các lần thử lại của bạn trở thành sự cố. Backoff luỹ thừa cho bên kia khoảng thở.',
      en: 'The most common reason a job fails is that something downstream is OVERLOADED. Retrying at a fixed, fast cadence adds load to a service already drowning — your retries become the incident. Exponential backoff gives the other side room to breathe.',
    },
    3000,
    [
      lines([10, 11, 12]),
      gauge('runs', 5, '5 lần', 'warn'),
      gauge('total', 3215, '3.215 ms', 'warn'),
      bar('luỹ thừa #1', 288, '288', 'ok'),
      bar('luỹ thừa #2', 417, '417', 'ok'),
      bar('luỹ thừa #3', 826, '826', 'ok'),
      bar('luỹ thừa #4', 1674, '1.674', 'ok'),
      log('5 lần: 10 → 298 → 715 → 1541 → 3215ms', 'ok'),
    ],
    {
      sfx: 'ping',
      teachingNote: {
        vi: 'Thêm jitter, đúng lý do đã thêm nó vào TTL ở bài 12.2: nghìn job hỏng cùng lúc sẽ thử lại cùng lúc.',
        en: 'Add jitter, for the same reason as the TTLs in 12.2: a thousand jobs failing together retry together.',
      },
    }
  );

  push(
    'recover',
    { vi: 'Khi nó chạy được, nó VÔ HÌNH', en: 'When it works, it is INVISIBLE' },
    {
      vi: 'Bên kia hồi phục ở lần thử thứ ba: hai lần hỏng, một lần thành công, trạng thái cuối là `completed`, không ai bị gọi dậy lúc ba giờ sáng. Đây là toàn bộ ý nghĩa của chương này gói trong bốn dòng kết quả. Trong production `attempts: 5, delay: 1000` cho lần thử cuối rơi vào khoảng 16 giây sau — đủ phủ phần lớn lỗi tạm thời.',
      en: 'The downstream recovers on the third attempt: two failures, one success, final state `completed`, nobody paged at three in the morning. That is the whole point of this chapter in four lines of output. In production `attempts: 5, delay: 1000` puts the last attempt around 16 seconds out — enough to cover most transient failures.',
    },
    2900,
    [
      lines([]),
      gauge('runs', 3, '3 lần', 'ok'),
      gauge('total', 715, '715 ms', 'ok'),
      log('chạy 3 lần · completed=1 · failed=0', 'ok'),
      log('returnvalue = {"sent":true} · attemptsMade = 3', 'ok'),
    ],
    { sfx: 'success' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — ÍT NHẤT MỘT LẦN, KHÔNG PHẢI ĐÚNG MỘT LẦN
   ──────────────────────────────────────────────────────────── */

function buildIdempotent(): SimStep[] {
  const { steps, push } = collector();

  push(
    'charge1',
    { vi: 'Job trừ tiền — lần một: đã trừ, rồi mạng rớt', en: 'A charge job — attempt one: money taken, then the network drops' },
    {
      vi: 'Hàm xử lý trừ thẻ khách hàng 100.000đ. Việc đó THÀNH CÔNG. Rồi kết nối rớt trước khi job kịp báo hoàn tất, nên với hàng đợi thì job này đã HỎNG.',
      en: 'The handler charges the customer\'s card 100,000₫. That SUCCEEDS. Then the connection drops before the job can report completion, so as far as the queue is concerned this job FAILED.',
    },
    2600,
    [
      lines([8]),
      gauge('runs', 1, '1 lần', 'warn'),
      gauge('money', 100_000, '100.000đ', 'ok'),
      bar('đơn hàng', 100_000, '100.000', 'ok'),
      bar('đã trừ', 100_000, '100.000', 'warn'),
      log('lần 1: charge OK → mạng rớt → job = failed', 'warn'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'charge3',
    { vi: 'Thử lại hai lần nữa — đã trừ 300.000đ cho một đơn 100.000đ', en: 'Two more retries — 300,000₫ taken for a 100,000₫ order' },
    {
      vi: 'Logic thử lại đã làm ĐÚNG Y NHƯ bạn yêu cầu. Job không idempotent, và "cứ thử lại tới khi thành công" chỉ là mệnh lệnh an toàn với những công việc lặp lại được mà không để lại hậu quả.',
      en: 'The retry logic did EXACTLY what you asked. The job is not idempotent, and "keep retrying until it succeeds" is only a safe instruction for work that can be repeated without consequences.',
    },
    2900,
    [
      gauge('runs', 3, '3 lần', 'err'),
      gauge('money', 300_000, '300.000đ', 'err'),
      bar('đã trừ', 300_000, '300.000', 'err'),
      log('đã trừ 300.000đ của khách — đáng lẽ chỉ 100.000đ', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Hàng đợi bảo đảm giao ÍT NHẤT MỘT LẦN, không phải ĐÚNG MỘT LẦN.',
        en: 'A queue guarantees AT-LEAST-ONCE delivery, never EXACTLY-ONCE.',
      },
    }
  );

  push(
    'atleastonce',
    { vi: '"Đúng một lần" không tồn tại trong hệ phân tán', en: '"Exactly once" does not exist in a distributed system' },
    {
      vi: 'Bất kỳ điều nào sau đây cũng làm hàm xử lý chạy hai lần: một lần thử lại, một job treo được đòi lại sau khi worker sập (bài 13.5), một lần thêm trùng vì người dùng bấm hai lần. Cái TỒN TẠI là hàm xử lý idempotent — thứ khiến "ít nhất một lần" không phân biệt được với "đúng một lần".',
      en: 'Any of these runs your handler twice: a retry, a stalled job reclaimed after a worker crash (13.5), a duplicate add because the user double-clicked. What DOES exist is an idempotent handler — the thing that makes at-least-once indistinguishable from exactly-once.',
    },
    2900,
    [lines([]), log('thử lại · worker sập · người dùng bấm hai lần', 'warn')],
    { sfx: 'lock' }
  );

  push(
    'unique',
    { vi: 'Cách 1 — khoá duy nhất trong CSDL, chắc chắn nhất', en: 'Fix 1 — a unique key in the database, the strongest' },
    {
      vi: 'Ghi một dòng `payment` với `orderId` là khoá duy nhất TRƯỚC khi gọi ra ngoài. Lần chạy thứ hai đâm vào ràng buộc duy nhất, nhận `P2002` — đúng cái mã lỗi bài 7.3 đã đo — và thoát ra ngay. Cơ sở dữ liệu làm trọng tài, không phải code của bạn.',
      en: 'Write a `payment` row keyed uniquely on `orderId` BEFORE calling out. The second run hits the unique constraint, gets `P2002` — the very error code measured in lesson 7.3 — and returns immediately. The database is the referee, not your code.',
    },
    2900,
    [
      lines([2, 3, 4, 5, 6, 7]),
      gauge('runs', 3, '3 lần', 'warn'),
      gauge('money', 100_000, '100.000đ', 'ok'),
      bar('đã trừ', 100_000, '100.000', 'ok'),
      log('lần 2: P2002 → { skipped: "đã trừ tiền rồi" }', 'ok'),
      log('lần 3: P2002 → skipped                        ✓', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'others',
    { vi: 'Cách 2 có khe hở đua · cách 3 là tốt nhất khi bên kia hỗ trợ', en: 'Fix 2 has a real race · fix 3 is best when the other side supports it' },
    {
      vi: 'Kiểm trạng thái trước khi làm ("đã có ảnh thu nhỏ chưa?") thì rẻ, nhưng hai worker đều có thể cùng đọc thấy "chưa" trước khi ai kịp ghi. Chấp nhận được khi chạy hai lần chỉ tổ phí công; không bao giờ chấp nhận được khi nó tốn tiền. Còn nếu bên thứ ba nhận `idempotencyKey` thì hãy đưa cho họ — họ khử trùng lặp giúp bạn.',
      en: 'Checking state first ("does it already have a thumbnail?") is cheap, but two workers can both read "no" before either writes. Acceptable when a double run only wastes effort; never acceptable when it costs money. And if the third party accepts an `idempotencyKey`, hand it over — they deduplicate for you.',
    },
    3000,
    [lines([10, 11, 12]), log('psp.charge(…, { idempotencyKey: `charge-${orderId}` })', 'ok')],
    { sfx: 'ping' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   C — CHẶN TRÙNG Ở CỬA, VÀ ĐỐNG JOB CHẾT
   ──────────────────────────────────────────────────────────── */

function buildDedupe(): SimStep[] {
  const { steps, push } = collector();

  push(
    'jobid',
    { vi: 'Năm cú bấm "Thanh toán" → một hoá đơn', en: 'Five clicks on "Pay" → one invoice' },
    {
      vi: 'Cho job một `jobId` TẤT ĐỊNH suy ra từ chính thứ mà nó tác động (`invoice-ORD-2026-777`), BullMQ sẽ từ chối tạo cái thứ hai. Gọi `add()` năm lần, số job thật sự đang chờ: một.',
      en: 'Give the job a DETERMINISTIC `jobId` derived from the thing it affects (`invoice-ORD-2026-777`) and BullMQ refuses to create a second one. Call `add()` five times; jobs actually waiting: one.',
    },
    2600,
    [
      lines([2, 3, 4]),
      gauge('runs', 1, '1 job chờ', 'ok'),
      gauge('total', 0, '0 hỏng', 'ok'),
      bar('add() được gọi', 5, '5', 'warn'),
      bar('job được tạo', 1, '1', 'ok'),
      log('gọi add() 5 lần → job thật sự đang chờ: 1', 'ok'),
      log('worker chạy 1 lần ⇒ 5 lần bấm chỉ tạo 1 hoá đơn', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'limit',
    { vi: 'Giới hạn: `jobId` chỉ chặn CHỪNG NÀO job cũ còn nằm trong Redis', en: 'The catch: `jobId` only blocks while the old job still exists in Redis' },
    {
      vi: 'Một khi job đã hoàn tất bị dọn đi — mà bạn BUỘC PHẢI dọn, xem bài 13.5 — thì cùng cái id đó lại thêm được. `jobId` là lá chắn rẻ tiền chống bấm hai lần trong một khoảng ngắn, KHÔNG phải thứ thay thế cho hàm xử lý idempotent. Hãy dùng cả hai. Cạnh sắc kèm theo: `jobId` không được chứa dấu hai chấm — viết `invoice-ORD-777`, đừng viết `invoice:ORD-777`.',
      en: 'Once the completed job is cleaned up — and you MUST clean up, see 13.5 — the same id can be added again. `jobId` is a cheap shield against double-clicks over a short window, NOT a replacement for an idempotent handler. Use both. Sharp edge: a `jobId` may not contain a colon — write `invoice-ORD-777`, not `invoice:ORD-777`.',
    },
    2900,
    [
      lines([3]),
      bar('sau removeOnComplete', 2, '2', 'err'),
      log('thêm lại cùng jobId khi job cũ đã bị dọn → tạo được', 'err'),
      log('Error: Custom Id cannot contain :', 'warn'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'jobId + hàm xử lý idempotent là hai lớp khác nhau, không thay thế nhau.',
        en: 'jobId and an idempotent handler are two different layers, not substitutes.',
      },
    }
  );

  push(
    'unrecoverable',
    { vi: 'Không phải lỗi nào cũng đáng thử lại', en: 'Not every error deserves a retry' },
    {
      vi: 'Một payload sai định dạng hoặc một người dùng đã bị xoá sẽ hỏng y hệt nhau năm lần và phí bốn lượt thử. `UnrecoverableError` hỏng NGAY. Quy tắc ngón tay cái: thử lại lỗi HẠ TẦNG (hết giờ, 5xx, đứt kết nối), đừng bao giờ thử lại lỗi LOGIC (4xx, sai dữ liệu, không tìm thấy bản ghi).',
      en: 'A malformed payload or a deleted user fails identically five times and wastes four attempts. `UnrecoverableError` fails IMMEDIATELY. Rule of thumb: retry INFRASTRUCTURE errors (timeouts, 5xx, dropped connections), never retry LOGIC errors (4xx, bad data, record not found).',
    },
    2900,
    [
      lines([6, 7, 8]),
      gauge('total', 1, '1 hỏng ngay', 'warn'),
      log('UnrecoverableError → hỏng ngay, không thử lại', 'ok'),
    ],
    { sfx: 'blip' }
  );

  push(
    'deadletter',
    { vi: 'Đống job chết — sửa nguyên nhân rồi chạy lại tất', en: 'The dead-letter pile — fix the cause, then re-run them all' },
    {
      vi: 'Job thất bại vẫn giữ nguyên dữ liệu và `failedReason`, nên một khi nguyên nhân thật đã được sửa thì một vòng lặp là chạy lại được tất: 5 hỏng → 5 hoàn tất. Và đó là lý do tập `failed` xứng đáng có một bảng theo dõi cùng một cảnh báo — một hàng đợi âm thầm tích luỹ job hỏng là một hàng đợi đã NGỪNG LÀM VIỆC trong khi mọi biểu đồ vẫn xanh.',
      en: 'A failed job keeps its data and its `failedReason`, so once the real cause is fixed one loop re-runs them all: 5 failed → 5 completed. And that is why the `failed` set deserves a dashboard and an alert — a queue quietly accumulating broken jobs is a queue that has STOPPED WORKING while every graph stays green.',
    },
    3000,
    [
      lines([11, 12]),
      gauge('total', 0, '0 hỏng', 'ok'),
      gauge('runs', 5, '5 hoàn tất', 'ok'),
      bar('chạy lại: hoàn tất', 5, '5', 'ok'),
      log('failed = 5 · "lỗi cấu hình: thiếu API key"', 'err'),
      log('→ sửa xong, retry tất: completed = 5 · failed = 0', 'ok'),
    ],
    { sfx: 'success' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsRetryScenario: Scenario = {
  id: 'nodejs-retry-idempotent',
  name: { vi: 'Thử lại, backoff và idempotent', en: 'Retries, backoff and idempotency' },
  tagline: {
    vi: 'Cùng một cơ chế thử lại: với email thì nó biến "hỏng" thành "tới muộn"; với một job trừ tiền thì nó trừ của khách 300.000đ cho một đơn 100.000đ. Hàng đợi bảo đảm giao ÍT NHẤT MỘT LẦN — phần "đúng một lần" là việc của bạn.',
    en: 'The same retry mechanism: on an email it turns "failed" into "arrived late"; on a charge job it takes 300,000₫ for a 100,000₫ order. A queue guarantees AT-LEAST-ONCE delivery — the "exactly once" part is your job.',
  },
  icon: RefreshCw,
  accent: '#f59e0b',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '13.3',
    slug: 'nodejs-13-3-thu-lai-va-idempotent',
    title: { vi: 'Thất bại: thử lại, backoff, và cú trừ tiền chạy ba lần', en: 'Failure: retries, backoff, and the charge that ran three times' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'mode',
      label: { vi: 'Xem gì', en: 'What to watch' },
      defaultValue: 'backoff',
      choices: [
        {
          value: 'backoff',
          label: 'Backoff',
          fullLabel: 'Cố định 300ms so với luỹ thừa 288→1674ms',
          color: '#38bdf8',
          hint: { vi: 'thử lại nhanh làm dịch vụ đang ngộp chết hẳn', en: 'fast retries finish off a service that is already drowning' },
        },
        {
          value: 'idempotent',
          label: 'Trừ tiền ba lần',
          fullLabel: 'Ít nhất một lần ≠ đúng một lần',
          color: '#f43f5e',
          hint: { vi: 'logic thử lại làm đúng y như bạn yêu cầu', en: 'the retry logic did exactly what you asked' },
        },
        {
          value: 'dedupe',
          label: 'jobId & job chết',
          fullLabel: '5 cú bấm → 1 hoá đơn · dead letter · UnrecoverableError',
          color: '#34d399',
          hint: { vi: 'lá chắn rẻ tiền, và giới hạn của nó', en: 'a cheap shield, and its limit' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => {
    const mode = modeOf(opts);
    return mode === 'idempotent' ? buildIdempotent() : mode === 'dedupe' ? buildDedupe() : buildBackoff();
  },
};
