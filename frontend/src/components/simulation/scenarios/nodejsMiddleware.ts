/**
 * Node.js · Bài 5.3 — Middleware: sợi dây chuyền mọi request đi qua.
 *
 * Bài giảng nói một câu đáng để dựng hẳn một kịch bản: middleware có ĐÚNG BA
 * cách kết thúc hợp lệ — gọi `next()`, tự trả lời, hoặc `next(err)` — và một
 * cách thứ tư BẤT HỢP PHÁP là không làm gì cả. Cách thứ tư mới là thứ khó
 * thấy nhất khi đọc mã, vì một dòng `next()` thiếu thì trông hệt như không
 * có gì sai.
 *
 * Ba biến thể ứng với ba kết cục, chạy trên cùng một dây chuyền để người xem
 * so sánh được: đường đi đổi, còn danh sách middleware thì không.
 */

import { Link2 } from 'lucide-react';
import type { ItemTone, PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const OK_CODE = [
  "app.use((req, res, next) => { log('1. logger'); next(); });",
  "app.use(express.json());",
  "app.use('/api', (req, res, next) => { log('2. /api/*'); next(); });",
  '',
  "app.get('/api/notes',",
  "  (req, res, next) => { log('3. route-level'); next(); },",
  "  (req, res)       => { log('4. handler'); res.json({ ok: true }); });",
  '',
  "app.use((req, res, next) => { log('X. sau routes'); next(); });",
  'app.use(notFound);',
  'app.use(errorHandler);   // BỐN tham số',
];

const HANG_CODE = [
  "app.use((req, res, next) => { log('1. logger'); next(); });",
  "app.use(express.json());",
  '',
  "app.use('/api', (req, res, next) => {",
  "  log('2. /api/* — kiểm tra gì đó…');",
  '  // ⚠️ quên next() — không lỗi, không cảnh báo',
  '});',
  '',
  "app.get('/api/notes', (req, res) => res.json({ ok: true }));",
];

const ERR_CODE = [
  "app.use((req, res, next) => { log('1. logger'); next(); });",
  "app.use(express.json());",
  '',
  "app.get('/api/notes', (req, res, next) => {",
  '  const err = new Error(&#39;Note not found&#39;);',
  '  err.status = 404;',
  '  next(err);            // nhảy THẲNG tới error handler',
  '});',
  '',
  'app.use(notFound);       // BỊ BỎ QUA',
  'app.use((err, req, res, next) => {   // BỐN tham số',
  '  res.status(err.status || 500).json({ error: err.message });',
  '});',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const CHAIN_LANES = [
  { id: 'logger', label: '1 · logger', sub: { vi: 'app.use — mọi request', en: 'app.use — every request' }, accent: '#7f92b4' },
  { id: 'json', label: '2 · express.json()', sub: { vi: 'điền req.body', en: 'fills req.body' }, accent: '#7f92b4' },
  { id: 'api', label: "3 · app.use('/api')", sub: { vi: 'chỉ dưới /api', en: 'only under /api' }, accent: '#38bdf8' },
  { id: 'route', label: '4 · route-level', sub: { vi: 'chỉ route này', en: 'this route only' }, accent: '#38bdf8' },
  { id: 'handler', label: '5 · handler', sub: { vi: 'res.json — dây DỪNG', en: 'res.json — the chain STOPS' }, accent: '#34d399' },
  { id: 'notfound', label: '6 · notFound', sub: { vi: 'chỉ tới nếu chưa ai trả lời', en: 'only if nothing responded' }, accent: '#f59e0b' },
  { id: 'error', label: '7 · errorHandler', sub: { vi: 'CHỈ tới bằng next(err)', en: 'reached ONLY via next(err)' }, accent: '#f43f5e' },
];

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'app.js — thứ tự khai báo LÀ thứ tự chạy', en: 'app.js — declaration order IS execution order' },
    x: 0,
    y: 0,
    w: 452,
    h: 330,
    lines: opts.flow === 'hang' ? HANG_CODE : opts.flow === 'error' ? ERR_CODE : OK_CODE,
  },
  {
    id: 'req',
    kind: 'table',
    title: { vi: 'Đối tượng req lớn dần qua từng chặng', en: 'The req object grows along the chain' },
    x: 0,
    y: 342,
    w: 452,
    h: 218,
    accent: '#22d3ee',
    columns: [
      { key: 'k', label: 'thuộc tính', flex: 1 },
      { key: 'v', label: 'giá trị', flex: 1.5 },
    ],
  },
  {
    id: 'chain',
    kind: 'lanes',
    title: { vi: 'Dây chuyền middleware', en: 'The middleware chain' },
    hint: { vi: 'mỗi mắt xích có ĐÚNG ba cách kết thúc', en: 'each link has exactly three legal endings' },
    x: 464,
    y: 0,
    w: 536,
    h: 362,
    lanes: CHAIN_LANES,
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Nhật ký + phản hồi', en: 'Log + response' },
    x: 464,
    y: 374,
    w: 536,
    h: 186,
    accent: '#34d399',
    maxLines: 5,
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: 'ok' | 'warn' | 'err' | 'muted' = 'ok'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const at = (id: string | null): PanelOp => ({ p: 'chain', op: 'active', value: id });
const ran = (lane: string, label: string, sub: string, tone: ItemTone = 'ok'): PanelOp => ({
  p: 'chain',
  op: 'push',
  lane,
  item: { id: `m_${lane}`, label, sub, tone },
});
const field = (id: string, k: string, v: string, tone: 'ok' | 'warn' | 'info' = 'ok'): PanelOp => ({
  p: 'req',
  op: 'push',
  item: { id, label: k, cells: [k, v], tone },
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
   A — ĐI HẾT DÂY CHUYỀN
   ──────────────────────────────────────────────────────────── */

function buildOk(): SimStep[] {
  const { steps, push } = collector();

  push(
    'arrive',
    { vi: 'GET /api/notes tới nơi', en: 'GET /api/notes arrives' },
    {
      vi: 'Express không "tìm route" trước. Nó đưa request vào ĐẦU dây chuyền và để từng mắt xích quyết định có đi tiếp hay không. Thứ tự khai báo trong file chính là thứ tự chạy — không có gì bí ẩn ở đây.',
      en: 'Express does not "find the route" first. It drops the request at the START of the chain and lets each link decide whether to carry on. Declaration order in the file is execution order — there is no mystery here.',
    },
    2200,
    [lines([1]), at('logger'), field('f_url', 'req.url', '/api/notes'), field('f_m', 'req.method', 'GET')],
    { sfx: 'click' }
  );

  push(
    'logger',
    { vi: 'Mắt 1 — logger gọi next()', en: 'Link 1 — the logger calls next()' },
    {
      vi: '`app.use` không có đường dẫn nghĩa là "mọi request". Nó ghi log rồi gọi `next()` — cách kết thúc phổ biến nhất: "tôi xong rồi, đi tiếp đi".',
      en: '`app.use` with no path means "every request". It logs, then calls `next()` — the most common ending: "I am done, carry on".',
    },
    2100,
    [ran('logger', 'next()', 'đi tiếp', 'ok'), out('1. logger')],
    { sfx: 'blip' }
  );

  push(
    'json',
    { vi: 'Mắt 2 — express.json() điền req.body', en: 'Link 2 — express.json() fills req.body' },
    {
      vi: 'Đây là lý do `req.body` tồn tại. Không có middleware này thì `req.body` là `undefined` — và đó là câu hỏi "vì sao req.body rỗng" mà mọi người mới học Express đều hỏi một lần.',
      en: 'This is why `req.body` exists at all. Without this middleware `req.body` is `undefined` — the "why is req.body empty" question every Express beginner asks exactly once.',
    },
    2200,
    [lines([2]), at('json'), ran('json', 'next()', 'đã đọc thân request', 'ok'), field('f_b', 'req.body', '{} (GET nên rỗng)', 'info')],
    { sfx: 'blip' }
  );

  push(
    'api',
    { vi: 'Mắt 3 — chỉ chạy dưới /api', en: 'Link 3 — only runs under /api' },
    {
      vi: '`app.use("/api", …)` là middleware CÓ PHẠM VI. Một request tới `/health` sẽ bỏ qua mắt này hoàn toàn. Đây là chỗ đặt xác thực cho cả một nhánh URL mà không phải nhắc lại ở từng route.',
      en: '`app.use("/api", …)` is path-scoped middleware. A request to `/health` skips this link entirely. This is where authentication for a whole URL branch belongs, instead of being repeated on every route.',
    },
    2300,
    [lines([3]), at('api'), ran('api', 'next()', 'khớp tiền tố /api', 'ok'), out('2. /api/*')],
    { sfx: 'ping' }
  );

  push(
    'route',
    { vi: 'Mắt 4 — middleware riêng của route', en: 'Link 4 — route-level middleware' },
    {
      vi: 'Đặt giữa đường dẫn và handler trong `app.get(path, mw, handler)`. Chỉ chạy cho đúng route này. Thường là kiểm quyền chi tiết: "người này có được sửa ghi chú này không".',
      en: 'Sits between the path and the handler in `app.get(path, mw, handler)`. Runs for this route only. Typically fine-grained authorisation: "may this person edit this particular note".',
    },
    2200,
    [lines([5, 6]), at('route'), ran('route', 'next()', 'kiểm quyền xong', 'ok'), field('f_u', 'req.user', '{ id: 7 }'), out('3. route-level')],
    { sfx: 'ping' }
  );

  push(
    'handler',
    { vi: 'Mắt 5 — handler trả lời, dây chuyền DỪNG', en: 'Link 5 — the handler responds, the chain STOPS' },
    {
      vi: 'Cách kết thúc thứ hai: tự gửi phản hồi. `res.json()` chấm dứt dây chuyền tại đây — mọi middleware phía dưới KHÔNG chạy, kể cả `notFound`. Đó là lý do `notFound` phải đứng sau cùng mới đúng.',
      en: 'The second legal ending: send a response yourself. `res.json()` terminates the chain here — every middleware below it does NOT run, including `notFound`. That is exactly why `notFound` only works when it sits last.',
    },
    2600,
    [lines([7]), at('handler'), ran('handler', 'res.json()', 'dây chuyền dừng tại đây', 'ok'), out('4. handler'), out('→ 200 { ok: true }', 'ok')],
    {
      sfx: 'success',
      teachingNote: {
        vi: 'Nhấn mạnh: "X. sau routes" KHÔNG in ra — chỉ chỗ trống trong nhật ký.',
        en: 'Stress: "X. after routes" never prints — point at the gap in the log.',
      },
    }
  );

  push(
    'skipped',
    { vi: 'Phần còn lại không bao giờ chạy', en: 'The rest never runs' },
    {
      vi: 'Dòng `X. sau routes` không hề xuất hiện trong nhật ký, dù nó nằm trong file. `notFound` và `errorHandler` cũng vậy. Chúng không "bị lỗi" — chúng chỉ nằm sau một mắt xích đã trả lời rồi.',
      en: 'The line `X. after routes` never appears in the log, even though it is right there in the file. Same for `notFound` and `errorHandler`. They are not broken — they simply sit below a link that already answered.',
    },
    2500,
    [
      lines([9, 10, 11]),
      at(null),
      ran('notfound', 'KHÔNG chạy', 'đã có phản hồi rồi', 'warn'),
      ran('error', 'KHÔNG chạy', 'chỉ tới bằng next(err)', 'warn'),
    ],
    { sfx: 'blip' }
  );

  push(
    'verdict',
    { vi: 'Ba cách kết thúc hợp lệ', en: 'Three legal endings' },
    {
      vi: '`next()` đi tiếp · tự trả lời thì dừng · `next(err)` nhảy tới error handler. Có một cách thứ tư BẤT HỢP PHÁP: không làm gì cả. Chọn biến thể "Quên next()" để xem nó trông như thế nào — cảnh báo trước: nó trông như không có gì.',
      en: '`next()` carries on · responding stops the chain · `next(err)` jumps to the error handler. There is a fourth, ILLEGAL ending: doing none of them. Pick the "Forgot next()" variant to see what that looks like — fair warning: it looks like nothing.',
    },
    2700,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — QUÊN next(): REQUEST TREO
   ──────────────────────────────────────────────────────────── */

function buildHang(): SimStep[] {
  const { steps, push } = collector();

  push(
    'arrive',
    { vi: 'Cùng một request, cùng dây chuyền', en: 'Same request, same chain' },
    {
      vi: 'Không có gì khác ở hai mắt đầu. Hãy nhìn kỹ mắt thứ ba trong khung mã — nó thiếu đúng một dòng.',
      en: 'The first two links behave identically. Look closely at the third one in the source — it is missing exactly one line.',
    },
    2200,
    [lines([1]), at('logger'), field('f_url', 'req.url', '/api/notes')],
    { sfx: 'click' }
  );

  push(
    'first-two',
    { vi: 'Hai mắt đầu chạy bình thường', en: 'The first two links run normally' },
    {
      vi: 'Logger ghi log rồi `next()`. `express.json()` đọc thân request rồi `next()`. Tới đây mọi thứ vẫn hoàn hảo.',
      en: 'The logger logs, then `next()`. `express.json()` parses the body, then `next()`. Everything is still perfect.',
    },
    2200,
    [lines([2]), at('json'), ran('logger', 'next()', 'đi tiếp'), ran('json', 'next()', 'đi tiếp'), out('1. logger')],
    { sfx: 'blip' }
  );

  push(
    'forgot',
    { vi: 'Mắt 3 chạy xong… rồi thôi', en: 'Link 3 runs… and then nothing' },
    {
      vi: 'Nó ghi log, làm việc của nó, rồi hàm kết thúc. Không gọi `next()`, cũng không gửi phản hồi. Express KHÔNG có cách nào biết đây là lỗi — với nó, mắt xích này chỉ đơn giản là chưa xong việc.',
      en: 'It logs, does its job, and the function returns. It never calls `next()` and never sends a response. Express has NO way to know this is a bug — as far as it knows, this link simply has not finished yet.',
    },
    2600,
    [lines([4, 5, 6, 7]), at('api'), ran('api', 'hàm trả về', 'không next(), không res', 'err'), out('2. /api/* — kiểm tra gì đó…', 'warn')],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Hỏi lớp: nhìn vào mã, chỗ nào báo cho bạn biết có gì sai? Câu trả lời: không chỗ nào.',
        en: 'Ask the class: reading the code, what tells you something is wrong? Answer: nothing does.',
      },
    }
  );

  push(
    'hanging',
    { vi: 'Request nằm đó — không lỗi, không log, không phản hồi', en: 'The request just sits there — no error, no log, no response' },
    {
      vi: 'Handler không bao giờ được gọi. Trình duyệt quay vòng chờ. Không có ngoại lệ nào ném ra, không dòng log nào xuất hiện, và Sentry cũng im lặng — không có gì để báo cả.',
      en: 'The handler is never called. The browser spins. No exception is thrown, no log line appears, and Sentry stays quiet — there is nothing to report.',
    },
    2800,
    [at('api'), ran('route', 'không bao giờ tới', '', 'muted'), ran('handler', 'không bao giờ tới', '', 'muted'), out('(im lặng…)', 'muted')],
    { sfx: 'buzz' }
  );

  push(
    'timeout',
    { vi: '30 giây sau: client tự bỏ cuộc', en: '30 seconds later: the client gives up' },
    {
      vi: 'Người dùng thấy "Network Error". Kết nối vẫn mở phía server cho tới khi hết hạn — mỗi request treo giữ một socket. Vài trăm request như vậy là hết chỗ.',
      en: 'The user sees "Network Error". The connection stays open server-side until it times out — every hung request holds a socket. A few hundred of them and you are out.',
    },
    2600,
    [ran('api', 'TREO', 'giữ socket tới khi hết hạn', 'err'), out('✗ client: Network Error sau 30s', 'err')],
    { sfx: 'error' }
  );

  push(
    'verdict',
    { vi: 'Cách bắt: nhìn nhật ký tìm chỗ ĐỨT', en: 'How to catch it: look for the BREAK in the log' },
    {
      vi: 'Lỗi này không để lại dấu vết nào ngoài một dãy log dừng giữa chừng. Mẹo thực chiến: mỗi middleware log một dòng khi VÀO; request nào không có dòng cuối cùng là request bị nuốt, và mắt xích cuối cùng có log chính là thủ phạm.',
      en: 'This bug leaves no trace except a log sequence that stops halfway. The practical trick: have every middleware log one line on ENTRY; any request missing the last line was swallowed, and the last link that logged is the culprit.',
    },
    2900,
    [lines([]), at(null)],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   C — next(err): NHẢY THẲNG TỚI ERROR HANDLER
   ──────────────────────────────────────────────────────────── */

function buildError(): SimStep[] {
  const { steps, push } = collector();

  push(
    'arrive',
    { vi: 'Vẫn dây chuyền đó, tới handler', en: 'Same chain, down to the handler' },
    {
      vi: 'Hai mắt đầu chạy như thường. Handler tra ghi chú trong cơ sở dữ liệu và không tìm thấy.',
      en: 'The first two links run as usual. The handler looks the note up in the database and finds nothing.',
    },
    2200,
    [lines([1, 2]), at('logger'), ran('logger', 'next()', 'đi tiếp'), ran('json', 'next()', 'đi tiếp'), field('f_url', 'req.url', '/api/notes/999')],
    { sfx: 'click' }
  );

  push(
    'throw',
    { vi: 'next(err) — cách kết thúc thứ ba', en: 'next(err) — the third legal ending' },
    {
      vi: 'Truyền một đối số cho `next()` là đổi hẳn ý nghĩa: không còn là "đi tiếp" mà là "bỏ qua mọi thứ, tới thẳng chỗ xử lý lỗi".',
      en: 'Passing an argument to `next()` changes its meaning entirely: no longer "carry on" but "skip everything, go straight to error handling".',
    },
    2500,
    [lines([4, 5, 6, 7]), at('route'), ran('route', 'next(err)', 'Error: Note not found', 'err'), field('f_e', 'err.status', '404', 'warn')],
    { sfx: 'buzz' }
  );

  push(
    'skip',
    { vi: 'Mọi middleware thường bị BỎ QUA', en: 'Every normal middleware is SKIPPED' },
    {
      vi: '`notFound` nằm ngay dưới và không hề chạy. Express bỏ qua tất cả middleware ba tham số cho tới khi gặp một cái có BỐN tham số. Số lượng tham số chính là tín hiệu — không có cờ, không có đăng ký gì đặc biệt.',
      en: '`notFound` sits right below and never runs. Express skips every three-argument middleware until it meets one with FOUR arguments. The parameter count IS the signal — no flag, no special registration.',
    },
    2700,
    [lines([10]), at('notfound'), ran('notfound', 'BỊ BỎ QUA', 'chỉ có 3 tham số', 'muted')],
    {
      sfx: 'blip',
      teachingNote: {
        vi: 'Đây là chỗ hay sai: viết error handler với 3 tham số thì nó không bao giờ chạy.',
        en: 'Common mistake: writing the error handler with 3 parameters means it never runs.',
      },
    }
  );

  push(
    'handle',
    { vi: 'errorHandler — bốn tham số mới được nhận lỗi', en: 'errorHandler — four parameters, and only then' },
    {
      vi: '`(err, req, res, next)`. Đây là MỘT chỗ duy nhất trong cả ứng dụng biến lỗi thành phản hồi. Không còn `try/catch` rải rác ở từng route, không còn mỗi route trả một hình dạng lỗi khác nhau.',
      en: '`(err, req, res, next)`. This is the single place in the whole application that turns errors into responses. No scattered `try/catch` in every route, no two routes returning differently-shaped errors.',
    },
    2700,
    [lines([11, 12, 13]), at('error'), ran('error', 'res.status(404)', 'một chỗ duy nhất', 'ok'), out('→ 404 { error: "Note not found" }', 'warn')],
    { sfx: 'success' }
  );

  push(
    'verdict',
    { vi: 'Một đường thoát, một hình dạng lỗi', en: 'One escape hatch, one error shape' },
    {
      vi: 'Mọi lỗi trong ứng dụng đều đổ về đây, nên chỉ cần sửa MỘT chỗ là đổi được cách toàn hệ thống báo lỗi: thêm mã lỗi, thêm request-id, giấu chi tiết ở production. Bài 5.4 dựng cái error handler đó bằng khoảng hai mươi dòng viết một lần rồi thôi.',
      en: 'Every error in the application funnels here, so changing ONE place changes how the whole system reports failure: add an error code, add a request id, hide details in production. Lesson 5.4 builds that handler in about twenty lines you write once and never touch again.',
    },
    2900,
    [lines([]), at(null)],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsMiddlewareScenario: Scenario = {
  id: 'nodejs-middleware',
  name: { vi: 'Middleware — sợi dây chuyền mọi request đi qua', en: 'Middleware — the chain every request walks' },
  tagline: {
    vi: 'Middleware có đúng ba cách kết thúc hợp lệ, và một cách thứ tư bất hợp pháp làm request treo mà không để lại lỗi nào. Xem cả ba đường đi trên cùng một dây chuyền.',
    en: 'Middleware has exactly three legal endings, and a fourth illegal one that hangs the request without leaving any error behind. Watch all three paths on one chain.',
  },
  icon: Link2,
  accent: '#38bdf8',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '5.3',
    slug: 'nodejs-5-3-middleware',
    title: { vi: 'Middleware: sợi dây chuyền mọi request đi qua', en: 'Middleware: the chain every request walks' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'flow',
      label: { vi: 'Request kết thúc thế nào', en: 'How the request ends' },
      defaultValue: 'ok',
      choices: [
        {
          value: 'ok',
          label: 'Đi hết dây chuyền',
          fullLabel: 'next() → next() → res.json()',
          color: '#34d399',
          hint: { vi: 'và vì sao notFound không chạy', en: 'and why notFound never runs' },
        },
        {
          value: 'hang',
          label: 'Quên next()',
          fullLabel: 'Cách kết thúc thứ tư — bất hợp pháp',
          color: '#f43f5e',
          hint: { vi: 'treo 30 giây, không lỗi, không log', en: 'hangs 30s, no error, no log' },
        },
        {
          value: 'error',
          label: 'next(err)',
          fullLabel: 'Nhảy thẳng tới error handler',
          color: '#f59e0b',
          hint: { vi: 'bỏ qua mọi middleware 3 tham số', en: 'skips every 3-argument middleware' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] =>
    opts.flow === 'hang' ? buildHang() : opts.flow === 'error' ? buildError() : buildOk(),
};
