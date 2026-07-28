/**
 * Node.js · Bài 6.5 — Hợp đồng API: phiên bản, ETag, idempotency.
 *
 * Giáo trình mở bài bằng một câu đáng nhớ: API là lời hứa với đoạn mã bạn
 * KHÔNG kiểm soát. Web app thì deploy lại trong một phút; ứng dụng di động
 * thì nằm trên máy người dùng với bản tám tháng trước, còn đối tác tích hợp
 * sẽ đọc email báo thay đổi của bạn ba tuần sau khi tích hợp của họ vỡ.
 *
 * Hai biến thể là hai lời hứa cụ thể nhất, và cả hai đều kể được bằng một
 * bảng trạng thái thay đổi theo từng bước:
 *   - idempotency: bấm "Thanh toán" hai lần chỉ trừ tiền một lần.
 *   - ETag: nội dung không đổi thì trả 304, không gửi lại thân phản hồi.
 */

import { FileCheck } from 'lucide-react';
import type { ItemTone, PanelOp, PanelSpec } from '../panels';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Mã nguồn ────────────────────────────────────────────────── */

const IDEM_CODE = [
  '// POST /api/v1/payments',
  "// Idempotency-Key: 8f2c-…  (client tự sinh)",
  '',
  'const seen = await redis.get(`idem:${key}`);',
  'if (seen) return res.status(200).json(JSON.parse(seen));',
  '',
  'const result = await chargeCard(body);',
  'await redis.set(`idem:${key}`, JSON.stringify(result),',
  "                'EX', 60 * 60 * 24);",
  'res.status(201).json(result);',
];

const ETAG_CODE = [
  '// GET /api/v1/notes/42',
  '',
  'const note = await db.note.findUnique(...);',
  'const etag = `"${note.updatedAt.getTime()}"`;',
  '',
  "if (req.headers['if-none-match'] === etag) {",
  '  return res.status(304).end();      // KHÔNG có thân',
  '}',
  "res.set('ETag', etag).json(note);",
];

/* ── Bố cục ──────────────────────────────────────────────────── */

const panels = (opts: ScenarioOptions): PanelSpec[] => [
  {
    id: 'code',
    kind: 'code',
    title: { vi: 'Phía máy chủ', en: 'Server side' },
    x: 0,
    y: 0,
    w: 462,
    h: 300,
    lines: opts.topic === 'etag' ? ETAG_CODE : IDEM_CODE,
  },
  {
    id: 'state',
    kind: 'table',
    title: {
      vi: opts.topic === 'etag' ? 'Băng thông từng lượt gọi' : 'Sổ khoá đã thấy (Redis)',
      en: opts.topic === 'etag' ? 'Bandwidth per call' : 'Seen-keys store (Redis)',
    },
    x: 0,
    y: 312,
    w: 462,
    h: 248,
    accent: '#a855f7',
    columns:
      opts.topic === 'etag'
        ? [
            { key: 'n', label: 'lượt gọi', flex: 1 },
            { key: 'b', label: 'byte truyền', flex: 1 },
          ]
        : [
            { key: 'k', label: 'Idempotency-Key', flex: 1.3 },
            { key: 'r', label: 'kết quả đã ghi', flex: 1 },
          ],
  },
  {
    id: 'flow',
    kind: 'lanes',
    title: { vi: 'Hai lượt gọi giống hệt nhau', en: 'Two identical calls' },
    hint: {
      vi: opts.topic === 'etag' ? 'lần hai không đổi nội dung' : 'người dùng bấm hai lần',
      en: opts.topic === 'etag' ? 'nothing changed since last time' : 'the user double-clicks',
    },
    x: 474,
    y: 0,
    w: 526,
    h: 300,
    lanes: [
      { id: 'c1', label: 'Lượt 1', sub: { vi: 'lần đầu', en: 'first time' }, accent: '#38bdf8' },
      { id: 'c2', label: 'Lượt 2', sub: { vi: 'y hệt lượt 1', en: 'identical to the first' }, accent: '#f59e0b' },
      { id: 'side', label: 'Tác dụng phụ', sub: { vi: 'thứ KHÔNG hoàn tác được', en: 'the part you cannot undo' }, accent: '#f43f5e' },
    ],
  },
  {
    id: 'out',
    kind: 'log',
    title: { vi: 'Trao đổi HTTP', en: 'The HTTP exchange' },
    x: 474,
    y: 312,
    w: 526,
    h: 248,
    accent: '#34d399',
    maxLines: 6,
  },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

const lines = (v: number[]): PanelOp => ({ p: 'code', op: 'lines', value: v });
const out = (label: string, tone: 'ok' | 'warn' | 'err' | 'muted' = 'ok'): PanelOp => ({ p: 'out', op: 'push', item: { label, tone } });
const at = (id: string | null): PanelOp => ({ p: 'flow', op: 'active', value: id });
const put = (lane: string, id: string, label: string, sub: string, tone: ItemTone = 'ok'): PanelOp => ({
  p: 'flow',
  op: 'push',
  lane,
  item: { id, label, sub, tone },
});
const row = (id: string, a: string, b: string, tone: 'ok' | 'warn' | 'err'): PanelOp => ({
  p: 'state',
  op: 'push',
  item: { id, label: a, cells: [a, b], tone },
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
   A — IDEMPOTENCY
   ──────────────────────────────────────────────────────────── */

function buildIdempotency(): SimStep[] {
  const { steps, push } = collector();

  push(
    'first',
    { vi: 'Lượt 1 — client gửi kèm một khoá tự sinh', en: 'Call 1 — the client sends a self-generated key' },
    {
      vi: 'Khoá do CLIENT sinh ra, một lần cho một ý định thanh toán, và giữ nguyên qua mọi lần thử lại. Đây là điểm mấu chốt: nếu máy chủ sinh khoá thì lần thử lại đã là một khoá khác rồi.',
      en: 'The key is generated by the CLIENT, once per payment intent, and reused across every retry. That is the crux: if the server generated it, a retry would already carry a different key.',
    },
    2400,
    [lines([1, 2, 4]), at('c1'), put('c1', 'q1', 'POST /payments', 'Idempotency-Key: 8f2c…', 'info'), out('→ POST /payments  Idempotency-Key: 8f2c…')],
    { sfx: 'click' }
  );

  push(
    'charge',
    { vi: 'Chưa thấy khoá này — trừ tiền thật', en: 'Key not seen before — the card is really charged' },
    {
      vi: 'Redis không có khoá, nên đây là lần đầu. Máy chủ gọi cổng thanh toán, trừ 300.000đ, rồi GHI LẠI kết quả kèm khoá với hạn 24 giờ.',
      en: 'Redis has no such key, so this is genuinely the first time. The server calls the payment gateway, charges 300,000đ, and RECORDS the result under that key for 24 hours.',
    },
    2700,
    [
      lines([7, 8, 9]),
      put('side', 's1', 'chargeCard()', '−300.000đ · KHÔNG hoàn tác được', 'err'),
      row('k1', '8f2c…', '201 · txn_A91', 'ok'),
      out('← 201 { id: "txn_A91" }', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'double',
    { vi: 'Người dùng bấm lại — mạng chậm, họ tưởng hụt', en: 'The user clicks again — the network lagged and they assumed it failed' },
    {
      vi: 'Đây không phải tình huống hiếm: mạng 3G chậm, nút không đổi trạng thái, người ta bấm lại. Hoặc chính app tự thử lại khi timeout. Cùng một khoá được gửi lần hai.',
      en: 'This is not an edge case: slow mobile network, the button gave no feedback, they tap again. Or the app itself retries on timeout. The same key arrives a second time.',
    },
    2500,
    [at('c2'), put('c2', 'q2', 'POST /payments', 'CÙNG khoá 8f2c…', 'warn'), out('→ POST /payments  Idempotency-Key: 8f2c…', 'warn')],
    { sfx: 'buzz' }
  );

  push(
    'replay',
    { vi: 'Máy chủ thấy khoá cũ — trả lại kết quả CŨ', en: 'The server recognises the key — replays the OLD result' },
    {
      vi: 'Không gọi cổng thanh toán lần nữa. Trả lại đúng phản hồi đã ghi. Client không phân biệt được — và đó chính là điều ta muốn: với client, hai lượt gọi giống nhau cho ra cùng một kết quả.',
      en: 'The gateway is not called again. The recorded response is replayed verbatim. The client cannot tell the difference — which is exactly the point: two identical calls, one identical outcome.',
    },
    2800,
    [
      lines([4, 5]),
      put('c2', 'q2b', '200 (phát lại)', 'txn_A91 — không trừ thêm', 'ok'),
      out('← 200 { id: "txn_A91" }   ← phát lại, KHÔNG trừ tiền lần hai', 'ok'),
    ],
    {
      sfx: 'ping',
      teachingNote: {
        vi: 'Chỉ vào làn "Tác dụng phụ": vẫn chỉ có MỘT dòng. Đó là toàn bộ bài học.',
        en: 'Point at the "side effect" lane: still just ONE entry. That is the whole lesson.',
      },
    }
  );

  push(
    'verdict',
    { vi: 'GET/PUT/DELETE vốn đã idempotent, POST thì không', en: 'GET/PUT/DELETE are idempotent by design, POST is not' },
    {
      vi: 'Gọi `GET` mười lần vẫn ra một kết quả; `PUT` mười lần vẫn ra một trạng thái; `DELETE` lần thứ hai chỉ là không còn gì để xoá. Chỉ `POST` là tạo thêm mỗi lần gọi — nên chỉ `POST` mới cần khoá idempotency. Bất kỳ endpoint nào tiêu tiền, gửi email hay tạo đơn hàng đều nên có.',
      en: 'Ten `GET`s give one result; ten `PUT`s give one state; a second `DELETE` simply finds nothing left. Only `POST` creates something new on every call — so only `POST` needs an idempotency key. Any endpoint that spends money, sends mail or creates an order should have one.',
    },
    2900,
    [at(null), lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — ETAG / 304
   ──────────────────────────────────────────────────────────── */

function buildEtag(): SimStep[] {
  const { steps, push } = collector();

  push(
    'first',
    { vi: 'Lượt 1 — tải đầy đủ, kèm ETag', en: 'Call 1 — full download, with an ETag' },
    {
      vi: 'Máy chủ trả nội dung kèm một "dấu vân tay" của phiên bản hiện tại. Ở đây dùng thời điểm cập nhật, nhưng bất cứ thứ gì đổi khi nội dung đổi đều được — miễn là rẻ để tính.',
      en: 'The server returns the content plus a fingerprint of the current version. Here it uses the update timestamp, but anything that changes when the content changes works — as long as it is cheap to compute.',
    },
    2400,
    [
      lines([3, 4, 9]),
      at('c1'),
      put('c1', 'e1', 'GET /notes/42', 'không kèm header nào', 'info'),
      put('c1', 'e1b', '200 + ETag', '"1753664400000"', 'ok'),
      row('b1', 'lượt 1', '18.400 byte', 'warn'),
      out('→ GET /notes/42'),
      out('← 200 · ETag: "1753664400000" · 18.400 byte', 'warn'),
    ],
    { sfx: 'click' }
  );

  push(
    'second',
    { vi: 'Lượt 2 — client hỏi lại kèm dấu vân tay cũ', en: 'Call 2 — the client asks again, quoting the old fingerprint' },
    {
      vi: '`If-None-Match` nghĩa là "tôi đang giữ bản này rồi; chỉ gửi lại nếu đã khác". Trình duyệt làm việc này tự động; ứng dụng di động thì phải tự gắn.',
      en: '`If-None-Match` means "I already hold this version; only send it again if it changed". Browsers do this automatically; mobile apps have to send it themselves.',
    },
    2500,
    [lines([6]), at('c2'), put('c2', 'e2', 'GET /notes/42', 'If-None-Match: "1753664400000"', 'warn'), out('→ GET /notes/42  If-None-Match: "1753664400000"', 'warn')],
    { sfx: 'ping' }
  );

  push(
    'not-modified',
    { vi: '304 Not Modified — không có thân phản hồi', en: '304 Not Modified — no response body at all' },
    {
      vi: 'Dấu vân tay khớp, nên máy chủ trả 304 và DỪNG. Không tuần tự hoá JSON, không đẩy 18KB qua mạng. Client dùng lại bản đang giữ.',
      en: 'The fingerprint matches, so the server answers 304 and stops. No JSON serialisation, no 18KB over the wire. The client reuses what it already has.',
    },
    2700,
    [
      lines([7]),
      put('c2', 'e2b', '304', 'không thân · ~180 byte', 'ok'),
      row('b2', 'lượt 2', '180 byte  (102× nhẹ hơn)', 'ok'),
      out('← 304 Not Modified · 180 byte', 'ok'),
    ],
    { sfx: 'success' }
  );

  push(
    'note',
    { vi: 'Vẫn phải truy vấn CSDL — ETag tiết kiệm BĂNG THÔNG', en: 'The database is still queried — ETag saves BANDWIDTH' },
    {
      vi: 'Đây là chỗ hay bị hiểu nhầm: để biết dấu vân tay có khớp không, máy chủ vẫn phải đọc bản ghi. ETag cắt băng thông và thời gian tuần tự hoá, KHÔNG cắt tải cho cơ sở dữ liệu. Muốn cắt luôn phần đó thì cần đệm (bài 12.2).',
      en: 'This is the common misunderstanding: to know whether the fingerprint matches, the server still has to read the row. ETag saves bandwidth and serialisation time, NOT database load. Removing that too takes a cache (lesson 12.2).',
    },
    2800,
    [put('side', 'q', 'db.note.findUnique', 'vẫn chạy ở CẢ HAI lượt', 'warn')],
    {
      sfx: 'buzz',
      teachingNote: {
        vi: 'Nhấn: 304 không có nghĩa là "không làm gì" — chỉ là "không GỬI gì".',
        en: 'Stress: 304 does not mean "did nothing" — it means "sent nothing".',
      },
    }
  );

  push(
    'verdict',
    { vi: 'Thêm thì an toàn, siết thì phá vỡ', en: 'Adding is safe, tightening breaks' },
    {
      vi: 'Cả bài 6.5 gói trong một câu: thêm trường tuỳ chọn, thêm endpoint, thêm giá trị enum — an toàn. Bỏ trường, đổi kiểu, đổi mã trạng thái, hay SIẾT kiểm tra dữ liệu — phá vỡ. Cái cuối là cái ai cũng đánh giá thấp: thêm `.max(200)` vào một trường tiêu đề trước đó nhận mọi độ dài sẽ bắt đầu từ chối những request hôm qua vẫn chạy, từ một client bạn không thể cập nhật.',
      en: 'The whole lesson in one line: adding an optional field, an endpoint, an enum value — safe. Removing a field, changing a type, changing a status code, or TIGHTENING validation — breaking. That last one is the underestimated one: adding `.max(200)` to a title that used to accept anything starts rejecting requests that worked yesterday, from a client you cannot update.',
    },
    3000,
    [at(null), lines([])],
    { sfx: 'lock' }
  );

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const nodejsContractScenario: Scenario = {
  id: 'nodejs-contract',
  name: { vi: 'Hợp đồng API — idempotency và ETag', en: 'The API contract — idempotency and ETag' },
  tagline: {
    vi: 'API là lời hứa với đoạn mã bạn không kiểm soát. Xem hai lời hứa cụ thể nhất: bấm thanh toán hai lần chỉ trừ tiền một lần, và nội dung không đổi thì trả 180 byte thay vì 18.400.',
    en: 'An API is a promise to code you do not control. Watch the two most concrete promises: a double-tapped payment charges once, and unchanged content answers in 180 bytes instead of 18,400.',
  },
  icon: FileCheck,
  accent: '#a855f7',
  group: 'nodejs',
  lesson: {
    course: 'nodejs',
    code: '6.5',
    slug: 'nodejs-6-5-hop-dong-api',
    title: { vi: 'Hợp đồng API: phiên bản, ETag, idempotency', en: 'The API contract: versions, ETag, idempotency' },
  },
  nodes: [],
  edges: [],
  panels,
  options: [
    {
      id: 'topic',
      label: { vi: 'Lời hứa nào', en: 'Which promise' },
      defaultValue: 'idem',
      choices: [
        {
          value: 'idem',
          label: 'Idempotency',
          fullLabel: 'Bấm hai lần, trừ tiền một lần',
          color: '#a855f7',
          hint: { vi: 'khoá do CLIENT sinh, giữ qua mọi lần thử lại', en: 'client-generated key, reused across retries' },
        },
        {
          value: 'etag',
          label: 'ETag / 304',
          fullLabel: '18.400 byte xuống 180 byte',
          color: '#34d399',
          hint: { vi: 'tiết kiệm băng thông, KHÔNG tiết kiệm CSDL', en: 'saves bandwidth, NOT database load' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.topic === 'etag' ? buildEtag() : buildIdempotency()),
};
