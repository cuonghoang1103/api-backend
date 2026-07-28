/**
 * Node.js · Bài 9.3 — Đầu vào là kẻ thù: ReDoS, ô nhiễm nguyên mẫu,
 * giới hạn thân request, SSRF.
 *
 * Số đo lấy nguyên từ giáo trình:
 *
 *   ReDoS  /^(a+)+$/ :  20 ký tự 8,0ms · 24 → 135,7ms · 28 → 1.954ms · 30 → 9.478,8ms
 *                       nhịp tim trễ tối đa 7.552 ms — event loop đứng hình
 *          /^([\s\S]*?)(\s+)+$/ : 28 DẤU CÁCH → 4.355,7 ms
 *   thân request 11,3MB → RSS 61 MB ⇒ 200 MB (≈12× kích thước thân)
 *   express.json() mặc định 100kb: 90KB → 200 · 200KB → 413
 *
 * Bốn đòn tấn công, không đòn nào cần mật khẩu, token ăn cắp được hay một lỗ
 * XSS. Mỗi đòn là một request TRÔNG RẤT BÌNH THƯỜNG mà lớp kiểm tra của bạn
 * sẽ vui vẻ nhận.
 */

import { ShieldAlert } from 'lucide-react';
import type { ItemTone, PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const REDOS_CODE = [
  'const RE = /^(a+)+$/;',
  "RE.test('a'.repeat(n) + '!');   // đầu vào KHÔNG khớp",
  '',
  '// và một cái trông đúng như thứ bạn sẽ tự viết:',
  '// "cắt khoảng trắng ở cuối chuỗi"',
  '/^([\\s\\S]*?)(\\s+)+$/',
  '',
  '// phép sửa: chặn ĐỘ DÀI trước khi regex chạm vào giá trị',
  'z.string().max(200)',
];

const PROTO_CODE = [
  'function merge(target, src) {',
  '  for (const k of Object.keys(src)) {',
  "    if (typeof src[k] === 'object' && src[k] !== null) {",
  '      target[k] ??= {}; merge(target[k], src[k]);',
  '    } else target[k] = src[k];',
  '  }',
  '}',
  '',
  "merge({ name: 'An' },",
  '  JSON.parse(\'{"__proto__":{"isAdmin":true}}\'));',
];

const BODY_CODE = [
  "app.use(express.json());            // mặc định 100kb",
  '//   90KB  → 200 {"len":92168}',
  '//   200KB → 413 entity.too.large',
  '',
  "app.use(express.json({ limit: '20mb' }));  // ai cũng nâng",
  '',
  '// đúng: 100kb toàn cục + parser lớn CHỈ ở nơi cần',
  "app.use(express.json({ limit: '100kb' }));",
  "app.post('/import', express.json({ limit: '10mb' }), h);",
];

const SSRF_CODE = [
  "app.get('/preview', async (req, res) => {",
  '  const r = await fetch(req.query.url);  // ← toàn bộ lỗ hổng',
  '  res.type(\'text\').send(await r.text());',
  '});',
  '',
  "const ALLOW = new Set(['media.cuongthai.com']);",
  'const u = new URL(req.query.url);',
  "if (u.protocol !== 'https:') return res.status(400)…",
  'if (!ALLOW.has(u.hostname)) return res.status(400)…',
  '',
  "// vẫn chưa đủ: fetch ĐI THEO 302 → redirect: 'manual'",
];

/* ── Bố cục ──────────────────────────────────────────────────── */

type Mode = 'redos' | 'proto' | 'body' | 'ssrf';
const modeOf = (opts: ScenarioOptions): Mode =>
  opts.mode === 'proto' || opts.mode === 'body' || opts.mode === 'ssrf' ? opts.mode : 'redos';

const CHART: Record<Mode, { title: I18nText; unit: string; max: number }> = {
  redos: { title: { vi: 'Một lần RE.test() tốn bao lâu (ms)', en: 'How long one RE.test() takes (ms)' }, unit: 'ms', max: 10_000 },
  proto: { title: { vi: 'Object trong tiến trình trả lời `isAdmin`', en: 'Objects in the process answering `isAdmin`' }, unit: 'object', max: 3 },
  body: { title: { vi: 'RSS máy chủ sau MỘT request (MB)', en: 'Server RSS after ONE request (MB)' }, unit: 'MB', max: 230 },
  ssrf: { title: { vi: 'Bí mật rò ra trong một request', en: 'Secrets leaked in one request' }, unit: 'lần', max: 3 },
};

/**
 * Thang đo của hai đồng hồ, theo từng đòn tấn công.
 *
 * Bốn đòn này khác nhau BỐN BẬC ĐỘ LỚN về đầu vào (31 byte so với 11,3 MB),
 * nên một thang chung làm cột ReDoS trông như bằng không — đúng cái ấn tượng
 * ngược với điều bài học muốn nói.
 */
const METERS: Record<Mode, { size: number; sizeUnit: string; cost: number; costUnit: string; threshold: number }> = {
  redos: { size: 200, sizeUnit: 'ký tự', cost: 10_000, costUnit: 'ms', threshold: 100 },
  proto: { size: 100, sizeUnit: 'byte', cost: 10_000, costUnit: 'object', threshold: 1 },
  body: { size: 12_000_000, sizeUnit: 'byte', cost: 230, costUnit: 'MB RSS', threshold: 100 },
  ssrf: { size: 200, sizeUnit: 'byte', cost: 10_000, costUnit: 'bí mật', threshold: 1 },
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
      lines: mode === 'proto' ? PROTO_CODE : mode === 'body' ? BODY_CODE : mode === 'ssrf' ? SSRF_CODE : REDOS_CODE,
    },
    {
      id: 'gauges',
      kind: 'meter',
      title: { vi: 'Một request tốn của bạn bao nhiêu', en: 'What one request costs you' },
      hint: { vi: 'không cần mật khẩu, không cần token', en: 'no password, no stolen token' },
      x: 0,
      y: 312,
      w: 452,
      h: 248,
      accent: '#f43f5e',
      meters: [
        { id: 'size', label: 'Kích thước đầu vào', max: METERS[mode].size, unit: METERS[mode].sizeUnit, accent: '#38bdf8' },
        {
          id: 'cost',
          label: 'Cái giá phải trả',
          max: METERS[mode].cost,
          unit: METERS[mode].costUnit,
          threshold: METERS[mode].threshold,
          thresholdLabel: 'ngưỡng dễ chịu',
          accent: '#f43f5e',
        },
      ],
    },
    {
      id: 'cost',
      kind: 'chart',
      mode: 'bar',
      title: CHART[mode].title,
      x: 464,
      y: 0,
      w: 536,
      h: 348,
      accent: '#f43f5e',
      unit: CHART[mode].unit,
      max: CHART[mode].max,
    },
    {
      id: 'log',
      kind: 'log',
      title: { vi: 'Chạy thật', en: 'Real run' },
      file: 'node input-lab.js',
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
const log = (label: string, tone: ItemTone = 'muted'): PanelOp => ({ p: 'log', op: 'push', item: { label, tone } });
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
   A — ReDoS: 31 KÝ TỰ ĐÓNG BĂNG CẢ MÁY CHỦ
   ──────────────────────────────────────────────────────────── */

function buildRedos(): SimStep[] {
  const { steps, push } = collector();

  push(
    'small',
    { vi: '20 ký tự — 8,0 ms. Không có gì đáng ngờ.', en: '20 characters — 8.0 ms. Nothing suspicious.' },
    {
      vi: 'Một biểu thức chính quy có lượng từ LỒNG NHAU: `/^(a+)+$/`. Nó không hề kỳ quái; các biến thể của nó nằm rải rác trong code kiểm tra dữ liệu ở khắp nơi. Với đầu vào ngắn thì nó nhanh, nên nó lọt qua mọi bài test.',
      en: 'A regex with NESTED quantifiers: `/^(a+)+$/`. Nothing exotic about it; variants of it are scattered through validation code everywhere. On short inputs it is fast, so it passes every test.',
    },
    2400,
    [
      lines([1, 2]),
      gauge('size', 20, '20 ký tự', 'ok'),
      gauge('cost', 8, '8,0 ms', 'ok'),
      bar('20 ký tự', 8, '8,0', 'ok'),
      log('20 ký tự →     8.0ms'),
    ],
    { sfx: 'click' }
  );

  push(
    'grow',
    { vi: 'Thêm hai ký tự, thời gian nhân bốn — mỗi lần', en: 'Add two characters, multiply the time by four — every time' },
    {
      vi: 'Chuỗi kết thúc bằng `!` nên phép khớp buộc phải THẤT BẠI, và để chứng minh thất bại, bộ máy regex phải thử MỌI cách chia n ký tự giữa dấu `+` trong và dấu `+` ngoài — một số lượng cách theo hàm mũ. Người ta gọi đây là "quay lui thảm hoạ".',
      en: 'The string ends with `!`, so the match must FAIL — and to prove failure, the engine tries EVERY way of splitting those n characters between the inner `+` and the outer `+`, which is an exponential number of ways. This is called catastrophic backtracking.',
    },
    2800,
    [
      gauge('size', 26, '26 ký tự', 'warn'),
      gauge('cost', 537, '537,5 ms', 'err'),
      bar('24 ký tự', 135.7, '135,7', 'warn'),
      bar('26 ký tự', 537.5, '537,5', 'err'),
      bar('28 ký tự', 1954, '1.954', 'err'),
      log('24 →   135.7ms · 26 →   537.5ms', 'warn'),
      log('28 →  1954.0ms · 30 →  9478.8ms', 'err'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'freeze',
    { vi: '31 byte trong một ô nhập liệu — nhịp tim trễ 7.552 ms', en: '31 bytes in a text field — heartbeat 7,552 ms late' },
    {
      vi: 'Biểu thức chính quy là JavaScript ĐỒNG BỘ. Nó chặn event loop y hệt vòng lặp `for` ở bài 2.4 — chặn mọi request khác, mọi timer, mọi socket, trong 7,5 giây. Một kẻ tấn công gửi mười cái như vậy mỗi giây là hạ được API của bạn, với lượng traffic không đủ để nhô lên trên bất kỳ biểu đồ nào.',
      en: 'A regex is SYNCHRONOUS JavaScript. It blocks the event loop exactly like the `for` loop in lesson 2.4 — blocking every other request, every timer, every socket, for 7.5 seconds. An attacker sending ten of these per second takes your API down with traffic too small to show up on any graph.',
    },
    3000,
    [
      gauge('size', 31, '31 byte', 'err'),
      gauge('cost', 9478, '9.478,8 ms', 'err'),
      bar('30 ký tự', 9478.8, '9.478,8', 'err'),
      log('regex 7652ms → nhịp tim trễ tối đa 7552ms', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Không phải một gigabyte. Ba mươi mốt byte.',
        en: 'Not a gigabyte. Thirty-one bytes.',
      },
    }
  );

  push(
    'real',
    { vi: 'Và đây là cái bạn sẽ TỰ VIẾT: cắt khoảng trắng cuối chuỗi', en: 'And here is the one YOU would write: trim trailing whitespace' },
    {
      vi: '`/^([\\s\\S]*?)(\\s+)+$/` với hai mươi tám DẤU CÁCH mất 4.355,7 ms. Cái khiến nó bùng nổ là `(\\s+)+` — một lượng từ đặt lên một nhóm mà bản thân nhóm đó đã kết thúc bằng một lượng từ trên cùng lớp ký tự.',
      en: '`/^([\\s\\S]*?)(\\s+)+$/` with twenty-eight SPACES costs 4,355.7 ms. What makes it explode is `(\\s+)+` — a quantifier over a group that itself ends in a quantifier over the same character class.',
    },
    2900,
    [
      lines([4, 5, 6]),
      gauge('size', 28, '28 dấu cách', 'err'),
      gauge('cost', 4355, '4.355,7 ms', 'err'),
      bar('28 dấu cách', 4355.7, '4.355,7', 'err'),
      log('26 dấu cách → 1115.5ms · 28 → 4355.7ms', 'err'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'fix',
    { vi: 'Phép sửa: chặn ĐỘ DÀI trước khi regex chạm vào giá trị', en: 'The fix: bound the LENGTH before any regex touches the value' },
    {
      vi: '`z.string().max(200)` ở bài 6.3, chạy TRƯỚC. Hàm mũ trên một đầu vào bị chặn trên là một chi phí bị chặn trên. Tốt hơn nữa là không dùng regex: `trimEnd()`, `includes`, `split`, `URL`, `Number.isInteger` đều tuyến tính — phần lớn regex "thông minh" trong một dự án chỉ thay thế ba dòng code nhàm chán và nhanh. Và đừng tự viết regex email: mấy bản "đúng chuẩn RFC" nổi tiếng chính là nguyên liệu ReDoS.',
      en: '`z.string().max(200)` from lesson 6.3, running FIRST. An exponential on a bounded input is a bounded cost. Better still, skip the regex: `trimEnd()`, `includes`, `split`, `URL`, `Number.isInteger` are all linear — most "clever" regexes in a project replace three boring, fast lines. And never hand-write an email regex: the famous RFC-correct ones are ReDoS material.',
    },
    2900,
    [
      lines([8, 9]),
      gauge('size', 200, '≤ 200 ký tự', 'ok'),
      gauge('cost', 1, 'bị chặn trên', 'ok'),
      bar('có max(200)', 1, '< 1', 'ok'),
      log('nhận diện: (a+)+ · (a*)* · (\\s+)+ · (.*,)* · (a|aa)+', 'ok'),
    ],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — Ô NHIỄM NGUYÊN MẪU
   ──────────────────────────────────────────────────────────── */

function buildProto(): SimStep[] {
  const { steps, push } = collector();

  push(
    'merge',
    { vi: 'Dự án nào cũng có một hàm trộn sâu', en: 'Every project has a deep-merge helper' },
    {
      vi: 'Bảy dòng, ai cũng viết được, và trông không có gì để mà nghi ngờ. Vấn đề bắt đầu ở chỗ object đem trộn đến từ `req.body`.',
      en: 'Seven lines, anyone could write it, and there is nothing about it to be suspicious of. The trouble starts when the object being merged comes from `req.body`.',
    },
    2500,
    [
      lines([1, 2, 3, 4, 5, 6, 7]),
      gauge('size', 40, '40 byte JSON', 'ok'),
      gauge('cost', 0, '0 ms', 'ok'),
      bar('trước khi trộn', 0, '0', 'ok'),
      log("Object.keys(req.body) = ['__proto__']", 'warn'),
      log('({}).isAdmin = undefined'),
    ],
    { sfx: 'click' }
  );

  push(
    'poison',
    { vi: 'Một khoá JSON — và MỌI object trong tiến trình thành admin', en: 'One JSON key — and EVERY object in the process is an admin' },
    {
      vi: '`"__proto__"` là một khoá THẬT sau `JSON.parse`, nên `Object.keys` liệt kê nó và hàm trộn đi thẳng vào `Object.prototype`. Sau đó `user.isAdmin` trả về `true` cho một object hoàn toàn không liên quan — nó THỪA KẾ thuộc tính vừa bị gắn vào.',
      en: '`"__proto__"` is a REAL key after `JSON.parse`, so `Object.keys` lists it and the merge walks straight into `Object.prototype`. After that, `user.isAdmin` returns `true` on a completely unrelated object — it INHERITS the property that was just attached.',
    },
    3000,
    [
      lines([9, 10]),
      gauge('cost', 10_000, 'mọi object', 'err'),
      bar('sau khi trộn', 3, 'mọi object', 'err'),
      log('({}).isAdmin = true', 'err'),
      log('kiểm tra quyền: user.isAdmin → CHO QUA (!!)', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'user chưa từng được gán isAdmin. Nó thừa kế.',
        en: 'The user object was never assigned isAdmin. It inherits it.',
      },
    }
  );

  push(
    'scope',
    { vi: 'Và nó không bị giới hạn trong request đã gây ra nó', en: 'And it is not confined to the request that caused it' },
    {
      vi: 'Mọi object thường trong tiến trình, với MỌI người dùng, cho tới khi khởi động lại, đều trả lời `true` cho phép kiểm tra kia. Đó chính là điểm khiến ô nhiễm nguyên mẫu khác một cái bug thông thường.',
      en: 'Every plain object in the process, for EVERY user, until the process restarts, answers `true` to that check. That is what makes prototype pollution different from an ordinary bug.',
    },
    2700,
    [log('mọi người dùng · mọi request · tới khi restart', 'err')],
    { sfx: 'buzz' }
  );

  push(
    'defend',
    { vi: 'Ba lớp phòng thủ, xếp theo mức độ hữu ích', en: 'Three defences, in order of usefulness' },
    {
      vi: 'Một: kiểm bằng schema — `zod .object()` vứt các khoá lạ (bài 6.3), nên `__proto__` không bao giờ TỚI ĐƯỢC hàm trộn. Hai: bỏ qua tường minh `__proto__`, `constructor`, `prototype` trong mọi phép sao chép đệ quy. Ba: dùng cấu trúc không có nguyên mẫu — `Object.create(null)` và `Map` miễn nhiễm, và dùng `Map` cho dữ liệu khoá/giá trị do người dùng kiểm soát vốn dĩ cũng là lựa chọn đúng về mặt cấu trúc.',
      en: 'One: validate with a schema — `zod .object()` drops unknown keys (lesson 6.3), so `__proto__` never REACHES the merge. Two: explicitly skip `__proto__`, `constructor` and `prototype` in every recursive copy. Three: use prototype-less structures — `Object.create(null)` and `Map` are immune, and using a `Map` for user-controlled key/value data was the structurally right choice anyway.',
    },
    3000,
    [
      lines([]),
      gauge('cost', 0, 'sạch', 'ok'),
      bar('safeMerge', 0, '0', 'ok'),
      log('sau safeMerge : ({}).isAdmin = undefined', 'ok'),
      log('Object.create(null) và new Map() miễn nhiễm', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'express',
    { vi: 'Tin tốt: lỗ hổng KHÔNG nằm ở Express', en: 'Good news: the hole is NOT in Express' },
    {
      vi: 'Cả hai bộ phân tích query string đều không gây ô nhiễm — `simple` giữ nguyên cú pháp ngoặc vuông làm tên khoá, còn `qs` dựng object lồng nhau nhưng lặng lẽ VỨT nhánh `__proto__`. Lỗ hổng nằm ở hàm tiện ích bạn viết SAU ĐÓ, cái đem `req.query` hay `req.body` trộn vào chỗ khác.',
      en: 'Neither query-string parser pollutes — `simple` keeps the bracket syntax as a literal key name, and `qs` builds nested objects but silently DROPS the `__proto__` branch. The hole is in the helper you write AFTERWARDS, the one that merges `req.query` or `req.body` into something else.',
    },
    2800,
    [log('simple → poisoned=null · extended → poisoned=null', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   C — GIỚI HẠN THÂN REQUEST
   ──────────────────────────────────────────────────────────── */

function buildBody(): SimStep[] {
  const { steps, push } = collector();

  push(
    'default',
    { vi: 'Mặc định 100kb — và nó từ chối một cách lịch sự', en: 'The 100kb default — and it refuses politely' },
    {
      vi: '90KB đi qua, 200KB nhận `413 entity.too.large`. Ai cũng nâng giới hạn đó lên ngay lần đầu bị từ chối một payload THẬT.',
      en: '90KB passes, 200KB gets `413 entity.too.large`. Everybody raises that limit the first time it rejects a REAL payload.',
    },
    2500,
    [
      lines([1, 2, 3]),
      gauge('size', 92_168, '90 KB', 'ok'),
      gauge('cost', 61, '61 MB RSS', 'ok'),
      bar('lúc rảnh', 61, '61', 'ok'),
      log('90KB  → 200 {"len":92168}', 'ok'),
      log('200KB → 413 entity.too.large (limit 102400)', 'warn'),
    ],
    { sfx: 'click' }
  );

  push(
    'raise',
    { vi: 'Nâng lên 20mb — một request, +139 MB RSS', en: 'Raise it to 20mb — one request, +139 MB of RSS' },
    {
      vi: 'Thân request 11,3 MB trên đường truyền, mà RSS đi từ 61 MB lên 200 MB — khoảng MƯỜI HAI LẦN kích thước thân, vì buffer thô, chuỗi đã giải mã và cây object đã phân tích cùng tồn tại một lúc, mà object JavaScript thì không hề gọn.',
      en: 'An 11.3 MB body on the wire takes RSS from 61 MB to 200 MB — roughly TWELVE TIMES the body size, because the raw buffer, the decoded string and the parsed object tree all exist at once, and JavaScript objects are not compact.',
    },
    2900,
    [
      lines([5]),
      gauge('size', 11_300_000, '11,3 MB', 'err'),
      gauge('cost', 200, '200 MB RSS', 'err'),
      bar('sau 1 request', 200, '200', 'err'),
      bar('sau 1,5 giây', 213, '213', 'err'),
      log('parse 82ms · 200.000 phần tử · RSS 61 → 200 MB', 'err'),
    ],
    { sfx: 'buzz' }
  );

  push(
    'oom',
    { vi: 'Mười request như thế đến cùng lúc là 1,4 GB', en: 'Ten of those arriving together is 1.4 GB' },
    {
      vi: 'Trên con VPS 6GB mà dự án này từng chạy, đó là lúc OOM killer đem container của bạn đi — và cái request kích hoạt nó trông HOÀN TOÀN HỢP LỆ. Không có mã lỗi nào, không có stack trace nào; chỉ có exit 137 như bài 16.5 đã kể.',
      en: 'On the 6GB VPS this project used to run on, that is when the OOM killer takes your container away — and the request that triggered it looks COMPLETELY VALID. No error code, no stack trace; just exit 137, as lesson 16.5 described.',
    },
    2800,
    [
      gauge('cost', 10_000, '≈1,4 GB', 'err'),
      log('10 × 139MB ≈ 1,4GB → OOM killer, exit 137', 'err'),
    ],
    { sfx: 'error' }
  );

  push(
    'fix',
    { vi: 'Đặt giới hạn THEO TỪNG ROUTE, và chặn cả độ dài mảng', en: 'Set the limit PER ROUTE, and bound array lengths too' },
    {
      vi: 'Đặt `10mb` toàn cục chỉ vì MỘT endpoint upload cần thế là trao cho mọi endpoint khác cùng thứ vũ khí đó. File thì không đi qua JSON: upload thuộc về `multipart/form-data`, truyền dòng thẳng ra kho lưu trữ (chương 10) — base64 còn làm phình thêm 33% trước cả khi phân tích. Và một thân request 90KB NẰM DƯỚI giới hạn vẫn có thể chứa 5.000 phần tử mà việc xử lý là O(n²): hãy kiểm `.max()` trên độ dài mảng, không chỉ trên số byte.',
      en: 'Setting `10mb` globally because ONE upload endpoint needs it hands every other endpoint the same weapon. Files do not travel through JSON: uploads belong in `multipart/form-data`, streamed straight to storage (chapter 10) — base64 also inflates by 33% before parsing even starts. And a 90KB body UNDER the limit can still hold 5,000 elements whose processing is O(n²): bound array lengths with `.max()`, not just bytes.',
    },
    3000,
    [
      lines([7, 8, 9]),
      gauge('size', 102_400, '100 KB', 'ok'),
      gauge('cost', 62, '62 MB RSS', 'ok'),
      bar('100kb toàn cục', 62, '62', 'ok'),
      log("express.json({ limit: '100kb' }) + parser riêng", 'ok'),
    ],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   D — SSRF
   ──────────────────────────────────────────────────────────── */

function buildSsrf(): SimStep[] {
  const { steps, push } = collector();

  push(
    'feature',
    { vi: 'Tính năng thì hết sức bình thường', en: 'The feature is entirely ordinary' },
    {
      vi: 'Xem trước một link, nhập ảnh đại diện từ URL, nút thử webhook. Người dùng đưa một URL và máy chủ đi lấy nó. Toàn bộ lỗ hổng nằm ở đúng một dòng.',
      en: 'Link preview, import an avatar from a URL, a "test webhook" button. The user hands you a URL and the server fetches it. The entire vulnerability is one line.',
    },
    2500,
    [
      lines([1, 2, 3, 4]),
      gauge('size', 60, '60 byte URL', 'ok'),
      gauge('cost', 0, '—'),
      bar('bình thường', 0, '0', 'ok'),
      log('GET /preview?url=https://vi.dụ/anh.png → 200', 'ok'),
    ],
    { sfx: 'click' }
  );

  push(
    'attack',
    { vi: 'Máy chủ tự đi đọc bí mật của chính nó', en: 'The server fetches its own secrets' },
    {
      vi: 'Một dịch vụ nội bộ hoàn toàn không mở ra Internet đang lắng nghe ở cổng 4404. Kẻ tấn công KHÔNG cần với tới nó — máy chủ của bạn với tới được, và máy chủ của bạn mới là bên gửi request. Tường lửa không làm gì sai cả: request đến TỪ BÊN TRONG.',
      en: 'An internal service not exposed to the internet at all is listening on port 4404. The attacker does NOT need to reach it — your server can, and your server is the one sending the request. The firewall did nothing wrong: the request came from INSIDE.',
    },
    3000,
    [
      gauge('cost', 10_000, 'rò toàn bộ', 'err'),
      bar('SSRF', 3, 'DB + R2', 'err'),
      log('/preview?url=http://127.0.0.1:4404/admin/config', 'err'),
      log('200 {"DATABASE_URL":"postgres://prod:…","R2_SECRET":…}', 'err'),
    ],
    {
      sfx: 'error',
      teachingNote: {
        vi: 'Cùng chiêu đó với tới postgres:5432, redis:6379, socket Docker, hoặc 169.254.169.254 trên máy ảo đám mây.',
        en: 'The same trick reaches postgres:5432, redis:6379, the Docker socket, or 169.254.169.254 on a cloud VM.',
      },
    }
  );

  push(
    'allow',
    { vi: 'Danh sách trắng — cần thiết, và CHƯA ĐỦ', en: 'An allow-list — necessary, and NOT sufficient' },
    {
      vi: 'Chỉ chấp nhận `https:` và một tập tên miền cho phép. URL nội bộ bị chặn ở bước giao thức, `file:///etc/hostname` thì `undici` không hỗ trợ. Trông như đã xong.',
      en: 'Accept only `https:` and a fixed set of hostnames. The internal URL is rejected at the protocol check, and `file:///etc/hostname` is not supported by `undici` at all. It looks finished.',
    },
    2700,
    [
      lines([6, 7, 8, 9]),
      gauge('cost', 1, 'bị chặn', 'ok'),
      bar('danh sách trắng', 0, '0', 'ok'),
      log('/preview-safe (URL nội bộ) → 400 chỉ chấp nhận https', 'ok'),
      log('file:///etc/hostname → fetch failed', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'redirect',
    { vi: 'Cái bẫy: một URL vượt qua MỌI phép kiểm, rồi trả 302', en: 'The trap: a URL that passes EVERY check, then returns a 302' },
    {
      vi: 'Kẻ tấn công đưa một host `https` THẬT mà họ sở hữu; host đó trả về `302` trỏ về nội bộ. `fetch` mặc định ĐI THEO chuyển hướng, còn lớp kiểm tra của bạn chỉ nhìn thấy URL ĐẦU TIÊN.',
      en: 'The attacker hands you a REAL `https` host they own; that host answers `302` pointing inward. `fetch` FOLLOWS redirects by default, and your validation only ever saw the FIRST URL.',
    },
    2900,
    [
      lines([11]),
      gauge('cost', 10_000, 'rò toàn bộ', 'err'),
      bar('302 về nội bộ', 3, 'DB + R2', 'err'),
      log('URL "vô hại" → 302 → 127.0.0.1:4404', 'err'),
      log('200 {"DATABASE_URL":…,"R2_SECRET":…}  ✗', 'err'),
    ],
    { sfx: 'error' }
  );

  push(
    'fix',
    { vi: 'Kiểm lại ở TỪNG chặng, và kiểm IP sau khi phân giải DNS', en: 'Re-check at EVERY hop, and check the IP after DNS resolution' },
    {
      vi: '`redirect: "manual"` để tự đi theo chuyển hướng và kiểm tra lại ở từng chặng. Rồi phân giải tên miền và chặn các dải IP nội bộ — một tên miền bạn CHO PHÉP vẫn có thể phân giải ra `127.0.0.1` hay `10.0.0.0/8`. Và hãy biết rằng còn đòn đổi DNS giữa lúc kiểm và lúc kết nối.',
      en: '`redirect: "manual"` so you follow hops yourself and re-validate each one. Then resolve the hostname and block private IP ranges — a hostname you ALLOW can still resolve to `127.0.0.1` or `10.0.0.0/8`. And know that DNS rebinding between check and connect exists.',
    },
    3000,
    [
      gauge('cost', 1, 'bị chặn', 'ok'),
      bar('manual + kiểm IP', 0, '0', 'ok'),
      log("redirect: 'manual' → kiểm lại từng chặng", 'ok'),
      log('phân giải DNS → chặn 127.0.0.0/8, 10/8, 169.254/16', 'ok'),
    ],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsInputAttacksScenario: Scenario = {
  id: 'nodejs-input-attacks',
  name: { vi: 'Đầu vào là kẻ thù', en: 'Input is the enemy' },
  tagline: {
    vi: 'Bốn đòn tấn công, không đòn nào cần mật khẩu hay token: 31 byte trong một ô nhập liệu làm event loop đứng hình 7,5 giây; một khoá JSON biến mọi object thành admin; một request 11,3MB ngốn 139MB RAM; và một URL bắt máy chủ tự đọc bí mật của chính nó.',
    en: 'Four attacks, none needing a password or a token: 31 bytes in a text field freeze the event loop for 7.5 seconds; one JSON key makes every object an admin; one 11.3MB request eats 139MB of RAM; and one URL makes the server read its own secrets.',
  },
  icon: ShieldAlert,
  accent: '#f43f5e',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '9.3',
    slug: 'nodejs-9-3-dau-vao-doc-hai',
    title: {
      vi: 'Đầu vào là kẻ thù: ReDoS, ô nhiễm nguyên mẫu, giới hạn thân request, SSRF',
      en: 'Input is the enemy: ReDoS, prototype pollution, body limits, SSRF',
    },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'mode',
      label: { vi: 'Đòn tấn công', en: 'The attack' },
      defaultValue: 'redos',
      choices: [
        {
          value: 'redos',
          label: 'ReDoS',
          fullLabel: '31 ký tự → event loop đứng 7,5 giây',
          color: '#f43f5e',
          hint: { vi: 'thêm 2 ký tự, thời gian nhân bốn', en: 'two more characters, four times the time' },
        },
        {
          value: 'proto',
          label: 'Nguyên mẫu',
          fullLabel: '__proto__ → mọi object thành admin',
          color: '#a78bfa',
          hint: { vi: 'không giới hạn trong request gây ra nó', en: 'not confined to the request that caused it' },
        },
        {
          value: 'body',
          label: 'Thân request',
          fullLabel: '11,3MB trên dây → +139MB RSS',
          color: '#f59e0b',
          hint: { vi: 'gấp 12 lần kích thước thân request', en: 'twelve times the body size' },
        },
        {
          value: 'ssrf',
          label: 'SSRF',
          fullLabel: 'Máy chủ tự đọc bí mật của chính nó',
          color: '#38bdf8',
          hint: { vi: 'danh sách trắng thôi thì chưa đủ', en: 'an allow-list alone is not enough' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => {
    const mode = modeOf(opts);
    return mode === 'proto' ? buildProto() : mode === 'body' ? buildBody() : mode === 'ssrf' ? buildSsrf() : buildRedos();
  },
};
