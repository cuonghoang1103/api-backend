/**
 * Nền tảng web · Rate limit — cửa sổ cố định và cái lỗ ở ranh giới.
 *
 * Cách cài rate limit đơn giản nhất là đếm theo phút: một khoá Redis tên
 * `user:60`, tăng dần, hết phút thì khoá mới ra đời và bộ đếm về 0. Nó dễ
 * viết, dễ hiểu, và có một lỗ hổng mà phần lớn người viết không nhận ra:
 *
 *   Trần 100 request/phút, nhưng nếu bắn 100 request vào giây thứ 59 rồi bắn
 *   tiếp 100 request vào giây thứ 61, máy chủ nhận 200 request trong 2 giây —
 *   gấp đôi trần, hoàn toàn "hợp lệ" theo luật đã đặt.
 *
 * Lỗ này không phải lý thuyết: nó là cách người ta vượt rate limit trên thực
 * tế, và nó lộ ra đúng lúc tệ nhất — khi có người cố tình dồn tải.
 *
 * Nhánh thứ hai dạy `token bucket`, cách mà hầu hết dịch vụ lớn dùng: không có
 * ranh giới nào để lợi dụng, cho phép một đợt dồn ngắn có kiểm soát, và trải
 * đều phần còn lại. Kèm luôn ba header `RateLimit-*` — thứ biến 429 từ một bức
 * tường câm thành một hợp đồng mà client biết cách tuân theo.
 */

import { Gauge } from 'lucide-react';
import type { PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const FIXED_CODE = [
  '// Cửa sổ cố định — cách ai cũng viết đầu tiên',
  'const key = `rl:${ip}:${Math.floor(Date.now()/60000)}`;',
  'const n = await redis.incr(key);',
  'if (n === 1) await redis.expire(key, 60);',
  '',
  'if (n > 100) return res.status(429).end();',
  '// hết phút → khoá mới → bộ đếm về 0',
];

const BUCKET_CODE = [
  '// Token bucket — không có ranh giới để lợi dụng',
  '// 100 token, hồi lại 100/60 ≈ 1,67 token mỗi giây',
  'const now = Date.now();',
  'const refill = (now - last) / 1000 * (100/60);',
  'tokens = Math.min(100, tokens + refill);',
  '',
  'if (tokens < 1) return res.status(429)',
  '  .set("Retry-After", Math.ceil((1-tokens)/1.67));',
  'tokens -= 1;   // tiêu một token, cho qua',
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Luật chặn', en: 'The limiting rule' },
    file: 'rateLimit.ts',
    x: 0,
    y: 0,
    w: 470,
    h: 252,
    lines: opts.algo === 'bucket' ? BUCKET_CODE : FIXED_CODE,
  },
  {
    id: 'gauge',
    kind: 'meter',
    title:
      opts.algo === 'bucket'
        ? { vi: 'Số token còn trong xô', en: 'Tokens left in the bucket' }
        : { vi: 'Bộ đếm của cửa sổ hiện tại', en: 'Counter for the current window' },
    x: 0,
    y: 264,
    w: 470,
    h: 296,
    accent: '#f59e0b',
    meters: [
      { id: 'n', label: 'đã dùng', max: 220, unit: 'req', threshold: 100, thresholdLabel: 'trần 100/phút', accent: '#38bdf8' },
    ],
  },
  {
    id: 'flow',
    kind: 'lanes',
    title: { vi: 'Request đi đâu', en: 'Where each request goes' },
    hint: { vi: '401/200 = qua · 429 = bị chặn', en: '401/200 = through · 429 = blocked' },
    x: 482,
    y: 0,
    w: 518,
    h: 300,
    accent: '#34d399',
    layout: 'rows',
    lanes: [
      { id: 'in', label: 'đến', sub: { vi: 'client bắn', en: 'client sends' }, accent: '#94a3b8' },
      { id: 'ok', label: 'cho qua', sub: { vi: 'tới được máy chủ', en: 'reaches the server' }, accent: '#34d399' },
      { id: 'no', label: '429', sub: { vi: 'bị chặn', en: 'blocked' }, accent: '#f43f5e' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Nhật ký', en: 'Log' },
    file: 'server',
    x: 482,
    y: 312,
    w: 518,
    h: 248,
    accent: '#38bdf8',
    maxLines: 7,
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

type Tone = 'ok' | 'warn' | 'err' | 'muted' | 'info';

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: Tone = 'muted'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const gauge = (value: number, label: string, tone: Tone): PanelOp => ({ p: 'gauge', op: 'value', key: 'n', value, label, tone });
const send = (lane: string, id: string, label: string, sub: string, tone: Tone): PanelOp => ({
  p: 'flow',
  op: 'push',
  lane,
  item: { id, label, sub, tone },
});
const clearLane = (lane: string): PanelOp => ({ p: 'flow', op: 'clear', lane });

type Push = (
  id: string,
  title: I18nText,
  detail: I18nText,
  duration: number,
  ops: PanelOp[],
  extra?: Partial<SimStep>
) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (id, title, detail, duration, ops, extra = {}) => {
    steps.push({ id, title, detail, kind: 'INTERNAL', duration, ops, ...extra });
  };
  return { steps, push };
}

/* ────────────────────────────────────────────────────────────
   A — CỬA SỔ CỐ ĐỊNH VÀ LỖ Ở RANH GIỚI
   ──────────────────────────────────────────────────────────── */

function buildFixed(): SimStep[] {
  const { steps, push } = collector();

  push(
    'rule',
    { vi: 'Luật: 100 request mỗi phút cho mỗi IP', en: 'The rule: 100 requests per minute per IP' },
    {
      vi: 'Khoá Redis mang luôn số phút hiện tại trong tên, nên hết phút là một khoá hoàn toàn mới ra đời và bộ đếm khởi động lại từ 0. Cách này rẻ, chỉ tốn một lệnh `INCR`, và đó là lý do nó phổ biến.',
      en: 'The Redis key carries the current minute in its name, so when the minute ends a brand-new key appears and the counter restarts from 0. It is cheap — one `INCR` — which is exactly why it is everywhere.',
    },
    2500,
    [lines([2, 3, 4, 6]), gauge(0, '0 / 100', 'ok'), out('rl:203.0.113.7:29384521 → 0', 'muted')],
    { sfx: 'click' }
  );

  push(
    'normal',
    { vi: 'Dùng bình thường: 40 request rải đều', en: 'Normal use: 40 requests spread out' },
    {
      vi: 'Người dùng thật bấm rải rác, bộ đếm bò lên từ từ và không ai chạm trần. Ở trạng thái này rate limit hoàn toàn vô hình — nó chỉ hiện hình khi có gì đó bất thường.',
      en: 'A real user clicks sporadically, the counter creeps up and nobody approaches the ceiling. In this state a rate limit is entirely invisible — it only surfaces when something abnormal happens.',
    },
    2500,
    [
      gauge(40, '40 / 100', 'ok'),
      send('in', 'i1', '40 req', 'rải trong 45s', 'muted'),
      send('ok', 'o1', '40 qua', '200 OK', 'ok'),
      out('40 request · 0 bị chặn', 'ok'),
    ],
    { sfx: 'blip' }
  );

  push(
    'burst1',
    { vi: 'Giây thứ 59: bắn 100 request', en: 'Second 59: fire 100 requests' },
    {
      vi: 'Bộ đếm chạm đúng trần và dừng ở đó. Theo luật đã đặt thì không có gì sai: đúng 100 request trong phút này, không hơn một cái nào. Chốt chặn đang làm đúng việc của nó.',
      en: 'The counter hits exactly the ceiling and stops. By the stated rule nothing is wrong: exactly 100 requests this minute, not one more. The gate is doing its job.',
    },
    2800,
    [
      clearLane('in'),
      clearLane('ok'),
      gauge(100, '100 / 100 — chạm trần', 'warn'),
      send('in', 'i2', '100 req', 'giây thứ 59', 'warn'),
      send('ok', 'o2', '100 qua', 'đúng trần', 'warn'),
      out('rl:…:29384521 → 100 (đầy)', 'warn'),
    ],
    { sfx: 'stream' }
  );

  push(
    'boundary',
    { vi: 'Giây thứ 61: khoá mới, bộ đếm về 0', en: 'Second 61: new key, counter back to 0' },
    {
      vi: 'Phút đổi, `Math.floor(Date.now()/60000)` cho ra số khác, tên khoá đổi theo, và bộ đếm bắt đầu lại từ đầu. Không có gì "hồi dần" ở đây — nó reset đột ngột, và đó chính là chỗ hở.',
      en: 'The minute rolls over, `Math.floor(Date.now()/60000)` yields a new number, the key name changes, and the counter starts from scratch. Nothing "recovers gradually" — it resets abruptly, and that is the hole.',
    },
    2700,
    [gauge(0, '0 / 100 — khoá mới', 'info'), out('rl:203.0.113.7:29384522 → 0  ← khoá khác', 'info')],
    {
      sfx: 'ping',
      teachingNote: {
        vi: 'Dừng ở đây và hỏi: nếu tôi bắn tiếp 100 cái nữa ngay bây giờ thì sao?',
        en: 'Pause here and ask: what if I fire another 100 right now?',
      },
    }
  );

  push(
    'exploit',
    { vi: '200 request trong 2 giây — và luật không hề bị vi phạm', en: '200 requests in 2 seconds — and no rule was broken' },
    {
      vi: 'Máy chủ vừa nhận gấp đôi trần trong một khoảng thời gian ngắn hơn ranh giới cửa sổ. Xét từng phút thì cả hai phút đều đúng 100. Xét cái mà rate limit SINH RA để bảo vệ — tải tức thời lên máy chủ — thì nó đã thất bại hoàn toàn.',
      en: 'The server just absorbed twice the ceiling in a window shorter than the boundary itself. Measured per minute, both minutes are exactly 100. Measured against what a rate limit EXISTS to protect — instantaneous load — it failed completely.',
    },
    3100,
    [
      gauge(200, '200 trong 2 giây', 'err'),
      send('in', 'i3', '100 req nữa', 'giây thứ 61', 'err'),
      send('ok', 'o3', '200 qua', 'gấp đôi trần', 'err'),
      out('tải thật: 200 req / 2s = 100 req/s', 'err'),
      out('luật "100/phút": KHÔNG bị vi phạm', 'err'),
    ],
    { sfx: 'error' }
  );

  push(
    'verdict',
    { vi: 'Vấn đề là RANH GIỚI, không phải con số', en: 'The problem is the BOUNDARY, not the number' },
    {
      vi: 'Hạ trần xuống 50 cũng không chữa được — vẫn có thể dồn 100 quanh ranh giới. Muốn hết lỗ thì phải bỏ hẳn khái niệm "cửa sổ reset đột ngột": dùng cửa sổ trượt, hoặc token bucket. Chọn lựa chọn bên cạnh để xem cách thứ hai.',
      en: 'Lowering the ceiling to 50 does not fix it — you can still cram 100 around the boundary. To close the hole you must abandon the idea of an abruptly resetting window: use a sliding window, or a token bucket. Pick the other option to see the second approach.',
    },
    2800,
    [lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — TOKEN BUCKET
   ──────────────────────────────────────────────────────────── */

function buildBucket(): SimStep[] {
  const { steps, push } = collector();

  push(
    'idea',
    { vi: 'Hình dung một cái xô có 100 token', en: 'Picture a bucket holding 100 tokens' },
    {
      vi: 'Mỗi request tiêu một token. Token được rót lại ĐỀU ĐẶN theo thời gian — 100 token mỗi phút nghĩa là khoảng 1,67 token mỗi giây. Không có phút nào để reset, không có ranh giới nào tồn tại, nên cũng không có gì để lợi dụng.',
      en: 'Each request spends one token. Tokens refill CONTINUOUSLY over time — 100 per minute means roughly 1.67 per second. There is no minute to reset and no boundary to speak of, so there is nothing to exploit.',
    },
    2700,
    [lines([2, 3, 4, 5]), gauge(0, 'xô đầy: 100 token', 'ok'), out('tokens = 100 · hồi 1,67/giây', 'ok')],
    { sfx: 'click' }
  );

  push(
    'burst',
    { vi: 'Cho phép dồn một đợt — nhưng chỉ đúng một lần', en: 'A burst is allowed — but only once' },
    {
      vi: 'Client bắn 100 request liên tiếp: tất cả đều qua, vì xô đang đầy. Đây là tính chất CÓ CHỦ Ý, không phải lỗ hổng — người dùng thật cũng dồn (mở trang có nhiều ảnh, tải một danh sách). Điểm khác biệt nằm ở chuyện tiếp theo.',
      en: 'The client fires 100 requests back to back: all pass, because the bucket is full. This is INTENTIONAL, not a hole — real users burst too (opening an image-heavy page, loading a list). The difference is what happens next.',
    },
    2900,
    [
      gauge(100, 'xô cạn: 0 token', 'warn'),
      send('in', 'j1', '100 req', 'dồn một lượt', 'warn'),
      send('ok', 'j2', '100 qua', 'xô đang đầy', 'ok'),
      out('100 qua · tokens = 0', 'warn'),
    ],
    { sfx: 'stream' }
  );

  push(
    'blocked',
    { vi: 'Bắn tiếp ngay lập tức → 429, không cần đợi hết phút', en: 'Fire again immediately → 429, no minute to wait out' },
    {
      vi: 'Xô cạn thì request tiếp theo bị chặn ngay, dù đồng hồ vừa nhảy sang phút mới hay không. Đây chính là chỗ token bucket khác hẳn cửa sổ cố định: không tồn tại thời điểm nào mà bộ đếm bỗng dưng trống trở lại.',
      en: 'With an empty bucket the next request is blocked at once, regardless of whether the clock just ticked into a new minute. This is precisely where a token bucket differs from a fixed window: there is no instant at which the counter suddenly empties.',
    },
    3000,
    [
      send('in', 'j3', '100 req nữa', 'ngay sau đó', 'err'),
      send('no', 'j4', '100 chặn', '429', 'err'),
      out('429 Too Many Requests × 100', 'err'),
    ],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'So với nhánh kia: cùng đúng thao tác đó, bên kia cho qua 200, bên này chặn 100.',
        en: 'Compare with the other branch: same exact move, 200 got through there, 100 blocked here.',
      },
    }
  );

  push(
    'headers',
    { vi: 'Ba header biến 429 thành một hợp đồng', en: 'Three headers turn a 429 into a contract' },
    {
      vi: '`RateLimit-Limit`, `RateLimit-Remaining` và `Retry-After` cho client biết trần là bao nhiêu, còn lại bao nhiêu và nên đợi bao lâu. Thiếu chúng thì client tử tế cũng chỉ biết thử lại mù quáng, thường là ngay lập tức — biến một lần chạm trần thành một vòng lặp nện liên tục.',
      en: '`RateLimit-Limit`, `RateLimit-Remaining` and `Retry-After` tell the client the ceiling, what is left, and how long to wait. Without them even a well-behaved client can only retry blindly, usually immediately — turning one rejection into a hammering loop.',
    },
    3000,
    [
      lines([7, 8]),
      out('RateLimit-Limit: 100', 'info'),
      out('RateLimit-Remaining: 0', 'info'),
      out('Retry-After: 36', 'ok'),
    ],
    { sfx: 'ping' }
  );

  push(
    'refill',
    { vi: 'Xô hồi dần — 36 giây sau đã có 60 token', en: 'The bucket refills — 60 tokens after 36 seconds' },
    {
      vi: 'Không có bước nhảy nào, chỉ có một đường dốc đều. Client tuân thủ `Retry-After` sẽ quay lại đúng lúc có token, và không bao giờ phải đoán. Đây cũng là lý do token bucket dễ chịu với người dùng thật: bạn không bị khoá cứng suốt phần còn lại của phút chỉ vì lỡ tay bấm nhanh.',
      en: 'No jumps, just a steady ramp. A client honouring `Retry-After` comes back exactly when tokens exist and never has to guess. This is also why token buckets feel kinder to real users: you are not locked out for the rest of a minute just because you clicked quickly.',
    },
    2900,
    [gauge(40, '60 token đã hồi', 'ok'), out('t+36s → tokens ≈ 60', 'ok')],
    { sfx: 'success' }
  );

  push(
    'where',
    { vi: 'Đặt bộ đếm ở đâu, và khoá theo cái gì', en: 'Where the counter lives, and what you key on' },
    {
      vi: 'Nếu chạy nhiều bản sao máy chủ thì bộ đếm phải nằm ở Redis dùng chung, không thì mỗi bản sao có trần riêng và trần thật bị nhân lên. Và khoá phải đúng thứ cần giới hạn: theo IP thật (nhớ chuyện đứng sau proxy), theo người dùng đã đăng nhập, hoặc theo khoá API. Đặt trần riêng cho những đường tốn kém — đăng nhập, gửi mã OTP, gọi mô hình AI — thay vì một trần chung cho cả website.',
      en: 'With multiple server replicas the counter must live in shared Redis, otherwise each replica has its own ceiling and the real limit multiplies. And key on the right thing: the real client IP (mind the proxy problem), the authenticated user, or the API key. Give expensive routes their own tighter limits — login, OTP sending, AI model calls — rather than one global ceiling for the whole site.',
    },
    3200,
    [lines([]), out('Redis dùng chung · khoá theo IP thật hoặc userId', 'ok')],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const rateLimitScenario: Scenario = {
  id: 'rate-limit',
  name: { vi: 'Rate limit — cái lỗ ở ranh giới cửa sổ', en: 'Rate limiting — the window boundary hole' },
  tagline: {
    vi: 'Trần 100 request/phút, nhưng bắn 100 cái ở giây 59 rồi 100 cái nữa ở giây 61 là máy chủ nhận 200 trong 2 giây — mà luật không hề bị vi phạm. Token bucket không có ranh giới nào để lợi dụng.',
    en: 'A 100-per-minute ceiling, yet 100 requests at second 59 plus 100 at second 61 means 200 in two seconds — with no rule broken. A token bucket has no boundary to exploit.',
  },
  icon: Gauge,
  accent: '#f59e0b',
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'algo',
      label: { vi: 'Thuật toán', en: 'Algorithm' },
      defaultValue: 'fixed',
      choices: [
        {
          value: 'fixed',
          label: 'Cửa sổ cố định',
          fullLabel: 'INCR theo phút — có lỗ ở ranh giới',
          color: '#f43f5e',
          hint: { vi: '200 request trong 2 giây', en: '200 requests in 2 seconds' },
        },
        {
          value: 'bucket',
          label: 'Token bucket',
          fullLabel: 'Hồi token đều, không có ranh giới',
          color: '#34d399',
          hint: { vi: 'kèm Retry-After', en: 'with Retry-After' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.algo === 'bucket' ? buildBucket() : buildFixed()),
};
