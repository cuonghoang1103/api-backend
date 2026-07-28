/**
 * Node.js · Bài 5.4 — Xử lý lỗi tập trung.
 *
 * Bài 3.5 đã cho thấy một `throw` trong handler giết cả tiến trình: mọi kết
 * nối của mọi khách đều chết vì một request chạm phải một hàng dữ liệu xấu.
 * Bài này gỡ bỏ vĩnh viễn kiểu chết đó bằng khoảng hai mươi dòng viết một
 * lần rồi thôi.
 *
 * Ba biến thể là ba mức trưởng thành của cùng một đoạn mã, và điểm gãy nằm ở
 * chỗ ít ai ngờ: `try/catch` quanh một hàm `async` KHÔNG bắt được lỗi ném ra
 * sau `await` nếu bạn quên `await` chính nó — Express 4 không hiểu Promise bị
 * từ chối, nên request treo và tiến trình nhận `unhandledRejection`.
 */

import { ShieldAlert } from 'lucide-react';
import type { ItemTone, PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const NAIVE_CODE = [
  '// Không có lưới an toàn nào',
  "app.get('/api/notes/:id', async (req, res) => {",
  '  const note = await db.note.findUnique(...);',
  '  res.json(note.toJSON());     // note = null → TypeError',
  '});',
  '',
  '// Express 4 KHÔNG hiểu Promise bị từ chối',
];

const CATCH_CODE = [
  '// try/catch ở TỪNG route — đúng nhưng không bền',
  "app.get('/api/notes/:id', async (req, res, next) => {",
  '  try {',
  '    const note = await db.note.findUnique(...);',
  "    if (!note) return next(new AppError('Not found', 404));",
  '    res.json(note);',
  '  } catch (err) {',
  '    next(err);                 // nhớ dòng này ở MỌI route',
  '  }',
  '});',
];

const CENTRAL_CODE = [
  '// Bọc một lần, dùng cho mọi route',
  'const wrap = (fn) => (req, res, next) =>',
  '  Promise.resolve(fn(req, res, next)).catch(next);',
  '',
  "app.get('/api/notes/:id', wrap(async (req, res) => {",
  '  const note = await db.note.findUnique(...);',
  "  if (!note) throw new AppError('Not found', 404);",
  '  res.json(note);',
  '}));',
  '',
  'app.use((err, req, res, next) => {          // BỐN tham số',
  '  const status = err.status || 500;',
  '  logger.error({ err, requestId: req.id });',
  '  res.status(status).json({',
  '    error: { code: err.code, message: safe(err, status) },',
  '    requestId: req.id,',
  '  });',
  '});',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Mã xử lý lỗi', en: 'The error path' },
    x: 0,
    y: 0,
    w: 470,
    h: 348,
    lines: opts.level === 'catch' ? CATCH_CODE : opts.level === 'central' ? CENTRAL_CODE : NAIVE_CODE,
  },
  {
    id: 'health',
    kind: 'meter',
    title: { vi: 'Sức khoẻ tiến trình', en: 'Process health' },
    x: 0,
    y: 360,
    w: 470,
    h: 200,
    accent: '#f43f5e',
    meters: [
      { id: 'alive', label: 'Kết nối đang phục vụ', max: 240, unit: '', accent: '#34d399' },
      { id: 'restart', label: 'Số lần tiến trình phải khởi động lại', max: 5, unit: 'lần', accent: '#f43f5e' },
    ],
  },
  {
    id: 'path',
    kind: 'lanes',
    title: { vi: 'Lỗi đi về đâu', en: 'Where the error goes' },
    x: 482,
    y: 0,
    w: 518,
    h: 300,
    lanes: [
      { id: 'handler', label: 'Handler', sub: { vi: 'nơi lỗi phát sinh', en: 'where it is thrown' }, accent: '#38bdf8' },
      { id: 'wrap', label: 'Lưới bắt', sub: { vi: 'catch / wrap', en: 'catch / wrap' }, accent: '#f59e0b' },
      { id: 'central', label: 'errorHandler', sub: { vi: 'một chỗ duy nhất', en: 'the single place' }, accent: '#34d399' },
      { id: 'crash', label: 'Không ai bắt', sub: { vi: 'unhandledRejection', en: 'unhandledRejection' }, accent: '#f43f5e' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Client thấy gì · log thấy gì', en: 'What the client sees · what the log sees' },
    x: 482,
    y: 312,
    w: 518,
    h: 248,
    accent: '#34d399',
    maxLines: 6,
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: 'ok' | 'warn' | 'err' | 'muted' = 'ok'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const at = (id: string | null): PanelOp => ({ p: 'path', op: 'active', value: id });
const put = (lane: string, label: string, sub: string, tone: ItemTone = 'ok'): PanelOp => ({
  p: 'path',
  op: 'push',
  lane,
  item: { id: `p_${lane}`, label, sub, tone },
});
const gauge = (key: string, value: number, label?: string, tone?: 'ok' | 'warn' | 'err'): PanelOp => ({ p: 'health', op: 'value', key, value, label, tone });

type Push = (id: string, title: I18nText, detail: I18nText, duration: number, ops: PanelOp[], extra?: Partial<SimStep>) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ────────────────────────────────────────────────────────────
   A — KHÔNG CÓ LƯỚI
   ──────────────────────────────────────────────────────────── */

function buildNaive(): SimStep[] {
  const { steps, push } = collector();

  push(
    'serving',
    { vi: 'Server đang phục vụ bình thường', en: 'The server is serving normally' },
    {
      vi: '240 kết nối đang mở: người đang đọc, người đang gõ, người đang tải file. Mã trông sạch và đã chạy tốt suốt sáu tháng.',
      en: '240 open connections: people reading, typing, uploading. The code looks clean and has run fine for six months.',
    },
    2200,
    [lines([2, 3, 4]), gauge('alive', 240, '240', 'ok'), gauge('restart', 0, '0 lần', 'ok')],
    { sfx: 'click' }
  );

  push(
    'bad-row',
    { vi: 'Một request hỏi id không tồn tại', en: 'One request asks for an id that is not there' },
    {
      vi: '`findUnique` trả về `null` — hoàn toàn hợp lệ. Nhưng dòng sau gọi `note.toJSON()` trên `null`, và JavaScript ném `TypeError`. Chuyện này không cần dữ liệu xấu: chỉ cần một người bấm vào link cũ.',
      en: '`findUnique` returns `null` — perfectly legal. But the next line calls `note.toJSON()` on `null`, and JavaScript throws a `TypeError`. This needs no corrupt data: someone clicking an old link is enough.',
    },
    2500,
    [lines([4]), at('handler'), put('handler', 'TypeError', "đọc 'toJSON' của null", 'err')],
    { sfx: 'buzz' }
  );

  push(
    'unhandled',
    { vi: 'Express 4 không hiểu Promise bị từ chối', en: 'Express 4 does not understand a rejected promise' },
    {
      vi: 'Handler là hàm `async`, nên `throw` bên trong nó không phải một ngoại lệ đồng bộ — nó biến thành một Promise BỊ TỪ CHỐI. Express 4 không hề `await` handler, nên không ai bắt lời từ chối đó. Request nằm treo.',
      en: 'The handler is `async`, so a `throw` inside it is not a synchronous exception — it becomes a REJECTED promise. Express 4 never awaits the handler, so nobody catches that rejection. The request just hangs.',
    },
    2800,
    [
      lines([7]),
      at('crash'),
      put('crash', 'unhandledRejection', 'không middleware nào nhận', 'err'),
      out('⚠ UnhandledPromiseRejection', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Nhấn: lỗi KHÔNG tới errorHandler — nó rơi ra ngoài Express hoàn toàn.',
        en: 'Stress: the error never reaches errorHandler — it falls outside Express entirely.',
      },
    }
  );

  push(
    'die',
    { vi: 'Node 15 trở đi: tiến trình CHẾT', en: 'Node 15 and later: the process DIES' },
    {
      vi: 'Từ Node 15, một lời từ chối không được xử lý làm tiến trình thoát. Tất cả 240 kết nối đứt cùng lúc — người đang gõ dở mất bài, người đang tải file phải tải lại. Một request hỏng giết trải nghiệm của mọi người.',
      en: 'Since Node 15, an unhandled rejection terminates the process. All 240 connections drop at once — anyone mid-edit loses their work, anyone uploading starts over. One bad request ruins everybody’s session.',
    },
    2800,
    [gauge('alive', 0, '0 — đứt hết', 'err'), gauge('restart', 1, '1 lần', 'err'), out('✗ tiến trình thoát · 240 kết nối đứt', 'err')],
    { sfx: 'error' }
  );

  push(
    'verdict',
    { vi: 'Đây là kiểu chết cần gỡ bỏ vĩnh viễn', en: 'This is the failure mode to remove permanently' },
    {
      vi: 'Có thể vá bằng `try/catch` ở từng route — đúng, nhưng phải nhớ ở MỌI route, mãi mãi, kể cả route người khác viết vào thứ Sáu. Chọn hai biến thể sau để xem đường đi từ "đúng nhưng mong manh" tới "không phải nhớ nữa".',
      en: 'You can patch it with `try/catch` per route — correct, but you must remember it on EVERY route, forever, including the one a colleague adds on a Friday. The next two variants walk from "correct but fragile" to "nothing left to remember".',
    },
    2700,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — try/catch Ở TỪNG ROUTE
   ──────────────────────────────────────────────────────────── */

function buildCatch(): SimStep[] {
  const { steps, push } = collector();

  push(
    'wrap',
    { vi: 'Bọc thân handler bằng try/catch', en: 'Wrap the handler body in try/catch' },
    {
      vi: 'Lỗi được bắt tại chỗ rồi chuyển tiếp bằng `next(err)`. Tiến trình sống sót, client nhận phản hồi. Đây đã là bước tiến rất lớn so với biến thể trước.',
      en: 'The error is caught locally and forwarded with `next(err)`. The process survives and the client gets a response. This is already a huge step up from the previous variant.',
    },
    2400,
    [lines([3, 4, 5, 6]), at('handler'), put('handler', 'throw', 'trong khối try', 'warn'), gauge('alive', 240, '240', 'ok'), gauge('restart', 0, '0 lần', 'ok')],
    { sfx: 'click' }
  );

  push(
    'forward',
    { vi: 'next(err) đưa lỗi tới errorHandler', en: 'next(err) forwards to the errorHandler' },
    {
      vi: 'Lỗi đi đúng đường: bỏ qua mọi middleware thường, tới thẳng chỗ xử lý bốn tham số (bài 5.3). Client nhận 404 gọn gàng thay vì một kết nối đứt.',
      en: 'The error takes the right path: skipping every normal middleware, straight to the four-parameter handler (lesson 5.3). The client gets a clean 404 instead of a dropped connection.',
    },
    2500,
    [lines([7, 8, 9]), at('wrap'), put('wrap', 'next(err)', 'chuyển tiếp', 'ok'), put('central', 'res.status(404)', 'trả lời gọn', 'ok'), out('→ 404 { error: "Not found" }', 'warn')],
    { sfx: 'ping' }
  );

  push(
    'cost',
    { vi: 'Cái giá: phải nhớ ở MỌI route', en: 'The cost: you must remember it on EVERY route' },
    {
      vi: 'Sáu dòng lặp lại ở mỗi route. Sáu mươi route là ba trăm sáu mươi dòng chỉ để làm cùng một việc — và chỉ cần MỘT route quên là kiểu chết ở biến thể trước quay lại y nguyên, ở đúng chỗ không ai để ý.',
      en: 'Six lines repeated on every route. Sixty routes is three hundred and sixty lines doing the same thing — and it takes just ONE route forgetting to bring back the previous failure mode, in exactly the place nobody is watching.',
    },
    2800,
    [put('wrap', 'lặp lại × 60 route', 'chỉ cần quên 1 lần', 'warn')],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Hỏi lớp: ai review pull request sẽ nhận ra một route thiếu try/catch?',
        en: 'Ask the class: would a reviewer notice one route missing its try/catch?',
      },
    }
  );

  push(
    'verdict',
    { vi: 'Đúng, nhưng dựa vào trí nhớ con người', en: 'Correct, but it depends on human memory' },
    {
      vi: 'Một quy ước phải nhớ thì sớm muộn cũng có người quên. Biến thể cuối biến nó thành thứ KHÔNG THỂ quên: bọc một lần ở một chỗ.',
      en: 'A convention you must remember is a convention somebody eventually forgets. The last variant turns it into something you CANNOT forget: wrapped once, in one place.',
    },
    2600,
    [lines([])],
    { sfx: 'blip' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   C — TẬP TRUNG
   ──────────────────────────────────────────────────────────── */

function buildCentral(): SimStep[] {
  const { steps, push } = collector();

  push(
    'wrapper',
    { vi: 'Một hàm bọc, ba dòng, viết một lần', en: 'One wrapper, three lines, written once' },
    {
      vi: '`wrap` biến mọi handler `async` thành handler mà Express hiểu: kết quả được bọc trong `Promise.resolve` rồi `.catch(next)`. Mọi `throw` bên trong — đồng bộ hay sau `await` — đều tự chảy về `next(err)`.',
      en: '`wrap` turns any `async` handler into one Express understands: the result goes through `Promise.resolve` and then `.catch(next)`. Every `throw` inside — synchronous or after an `await` — flows into `next(err)` by itself.',
    },
    2500,
    [lines([2, 3]), gauge('alive', 240, '240', 'ok'), gauge('restart', 0, '0 lần', 'ok')],
    { sfx: 'click' }
  );

  push(
    'throw',
    { vi: 'Handler chỉ việc throw — không try, không catch', en: 'The handler just throws — no try, no catch' },
    {
      vi: 'Thân handler ngắn lại và đọc đúng như ý định: "không tìm thấy thì ném lỗi 404". Không còn sáu dòng nghi thức che mất bốn dòng logic.',
      en: 'The handler body shrinks and reads exactly like the intent: "if it is not there, throw a 404". No more six lines of ceremony hiding four lines of logic.',
    },
    2500,
    [lines([5, 6, 7, 8, 9]), at('handler'), put('handler', "throw AppError(404)", 'không cần try', 'ok')],
    { sfx: 'ping' }
  );

  push(
    'auto',
    { vi: 'Lưới bắt tự động, không phải nhớ gì', en: 'The net catches automatically, nothing to remember' },
    {
      vi: 'Không có quy ước nào để quên: route nào không bọc thì lỗi cú pháp hiện ngay khi đọc mã, còn route đã bọc thì không thể lọt lỗi. Đây là khác biệt giữa "phải nhớ" và "không thể sai".',
      en: 'There is no convention left to forget: an unwrapped route is visible on sight, and a wrapped one cannot leak. That is the difference between "must remember" and "cannot get wrong".',
    },
    2600,
    [at('wrap'), put('wrap', '.catch(next)', 'tự động, mọi route', 'ok')],
    { sfx: 'ping' }
  );

  push(
    'shape',
    { vi: 'Một chỗ quyết định hình dạng MỌI lỗi', en: 'One place decides the shape of EVERY error' },
    {
      vi: 'Thêm mã lỗi, gắn `requestId` để tra log, giấu chi tiết ở production nhưng giữ nguyên ở dev — mọi thứ đó sửa ở MỘT chỗ và có hiệu lực trên toàn hệ thống. Client cũng chỉ phải học đúng một hình dạng lỗi.',
      en: 'Add an error code, attach a `requestId` for log lookup, hide details in production but keep them in dev — all of it changes in ONE place and applies everywhere. Clients also only ever learn one error shape.',
    },
    2800,
    [
      lines([11, 12, 13, 14, 15, 16, 17, 18]),
      at('central'),
      put('central', 'res.status(err.status)', 'một hình dạng duy nhất', 'ok'),
      out('→ 404 { error: { code: "NOT_FOUND" }, requestId: "mJumRwAigpAO" }', 'warn'),
      out('log: level=error requestId=mJumRwAigpAO', 'muted'),
    ],
    { sfx: 'success' }
  );

  push(
    'verdict',
    { vi: 'Hai mươi dòng, viết một lần, không đụng lại', en: 'Twenty lines, written once, never touched again' },
    {
      vi: 'Tiến trình không còn chết vì một hàng dữ liệu. Client luôn nhận cùng một hình dạng lỗi. Và khi có sự cố lúc 3 giờ sáng, `requestId` trong phản hồi dẫn thẳng tới đúng dòng log — chi tiết đó ở bài 15.2.',
      en: 'The process no longer dies over one row of data. Clients always get the same error shape. And when something breaks at 3am, the `requestId` in the response leads straight to the right log line — lesson 15.2 covers that.',
    },
    2900,
    [at(null), lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsErrorHandlingScenario: Scenario = {
  id: 'nodejs-error-handling',
  name: { vi: 'Xử lý lỗi tập trung', en: 'Centralised error handling' },
  tagline: {
    vi: 'Một request hỏi id không tồn tại làm chết cả tiến trình và đứt 240 kết nối. Xem ba mức: không lưới, try/catch từng route, và hai mươi dòng viết một lần rồi thôi.',
    en: 'One request for a missing id kills the process and drops 240 connections. Watch three levels: no net, per-route try/catch, and twenty lines written once and never touched again.',
  },
  icon: ShieldAlert,
  accent: '#f43f5e',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '5.4',
    slug: 'nodejs-5-4-xu-ly-loi',
    title: { vi: 'Xử lý lỗi tập trung', en: 'Centralised error handling' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'level',
      label: { vi: 'Mức bảo vệ', en: 'Level of protection' },
      defaultValue: 'naive',
      choices: [
        {
          value: 'naive',
          label: 'Không lưới',
          fullLabel: 'async throw → tiến trình chết',
          color: '#f43f5e',
          hint: { vi: '240 kết nối đứt vì một hàng null', en: '240 connections dropped over one null row' },
        },
        {
          value: 'catch',
          label: 'try/catch từng route',
          fullLabel: 'Đúng, nhưng phải nhớ ở mọi route',
          color: '#f59e0b',
          hint: { vi: 'quên một lần là lỗi cũ quay lại', en: 'forget once and the old failure returns' },
        },
        {
          value: 'central',
          label: 'wrap + errorHandler',
          fullLabel: 'Bọc một lần, không thể quên',
          color: '#34d399',
          hint: { vi: 'một hình dạng lỗi cho cả hệ thống', en: 'one error shape for the whole system' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] =>
    opts.level === 'catch' ? buildCatch() : opts.level === 'central' ? buildCentral() : buildNaive(),
};
