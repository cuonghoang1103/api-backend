/**
 * Kịch bản 10 — Webhook thanh toán.
 *
 * Webhook đảo ngược mọi thói quen: bạn không gọi ai, mà bị gọi; bạn không
 * kiểm soát số lần, thứ tự hay thời điểm. Ba điều gần như chắc chắn sẽ xảy
 * ra với mọi endpoint webhook chạy đủ lâu — bị gửi trùng, bị gửi sai thứ tự,
 * và bị kẻ lạ gọi thẳng — đều nằm trong kịch bản này.
 */

import { Webhook } from 'lucide-react';
import type { Scenario, SimStep } from '../types';

const nodes = [
  { id: 'psp', label: 'PayOS', kind: 'gateway' as const, x: 100, y: 300, sublabel: { vi: 'Cổng thanh toán', en: 'Payment gateway' } },
  { id: 'api', label: 'Webhook API', kind: 'server' as const, x: 380, y: 300, sublabel: { vi: 'POST /webhooks/payos', en: 'POST /webhooks/payos' } },
  { id: 'cache', label: 'Redis', kind: 'cache' as const, x: 680, y: 130, sublabel: { vi: 'Chống xử lý trùng', en: 'Duplicate guard' } },
  { id: 'db', label: 'PostgreSQL', kind: 'db' as const, x: 680, y: 470, sublabel: { vi: 'orders · payments', en: 'orders · payments' } },
  { id: 'rt', label: 'Realtime', kind: 'socket' as const, x: 940, y: 300, sublabel: { vi: 'Báo cho người mua', en: 'Notifies the buyer' } },
];

const edges = [
  { id: 'e_psp_api', from: 'psp', to: 'api' },
  { id: 'e_api_cache', from: 'api', to: 'cache' },
  { id: 'e_api_db', from: 'api', to: 'db' },
  { id: 'e_api_rt', from: 'api', to: 'rt' },
];

const PAYLOAD = {
  orderCode: 88213,
  amount: 499000,
  status: 'PAID',
  transactionId: 'FT26072812345',
  paidAt: '2026-07-28T09:41:02.000Z',
};

export const webhookScenario: Scenario = {
  id: 'webhook',
  name: { vi: 'Webhook thanh toán', en: 'Payment webhook' },
  tagline: {
    vi: 'Bị gọi trùng, bị gọi sai thứ tự, bị kẻ lạ gọi thẳng — ba chuyện chắc chắn xảy ra với mọi endpoint webhook, và cách chống từng cái.',
    en: 'Delivered twice, delivered out of order, called by a stranger — three things every webhook endpoint eventually meets, and how to survive each.',
  },
  icon: Webhook,
  accent: '#34d399',
  lesson: {
    course: 'nodejs',
    code: '13.1',
    slug: 'nodejs-13-1-vi-sao-hang-doi',
    title: { vi: 'Request không phải chỗ để làm việc nặng', en: 'A request is not a place to do work' },
  },
  nodes,
  edges,
  options: [
    {
      id: 'case',
      label: { vi: 'Tình huống', en: 'Case' },
      defaultValue: 'ok',
      choices: [
        { value: 'ok', label: 'Bình thường', color: '#34d399' },
        { value: 'forged', label: 'Chữ ký giả', color: '#f43f5e', hint: { vi: 'Ai cũng POST được vào endpoint của bạn', en: 'Anyone on the internet can POST here' } },
        { value: 'retry', label: 'Gửi lại do timeout', color: '#fbbf24', hint: { vi: 'Bạn xử lý xong nhưng trả lời chậm', en: 'You succeeded but answered too slowly' } },
        { value: 'race', label: 'Sai thứ tự', color: '#a855f7', hint: { vi: 'PAID tới trước PENDING', en: 'PAID arrives before PENDING' } },
      ],
    },
  ],

  build({ case: kase = 'ok' }) {
    const steps: SimStep[] = [];

    /* ── Chữ ký giả ───────────────────────────────────────────── */
    if (kase === 'forged') {
      steps.push({
        id: 'forged-in',
        edge: 'e_psp_api',
        kind: 'DELETE',
        duration: 1400,
        latencyMs: 60,
        packetLabel: 'POST giả mạo 😈',
        title: { vi: 'Một người lạ POST thẳng vào endpoint', en: 'A stranger POSTs straight at the endpoint' },
        detail: {
          vi: 'Endpoint webhook BẮT BUỘC phải công khai — cổng thanh toán cần gọi được vào. Nghĩa là cả internet cũng gọi được. Kẻ tấn công chỉ cần đoán đường dẫn rồi gửi một JSON nói "đơn 88213 đã thanh toán 499.000đ". Không có xác thực người dùng nào ở đây để dựa vào: không cookie, không JWT, không phiên làm việc.',
          en: 'A webhook endpoint MUST be public — the gateway has to reach it. Which means the whole internet can reach it too. An attacker only needs to guess the path and post a JSON saying "order 88213 was paid 499,000₫". There is no user authentication to lean on here: no cookie, no JWT, no session.',
        },
        payload: { ...PAYLOAD, note: 'do kẻ tấn công tự soạn' },
        headers: { 'X-Payos-Signature': 'deadbeefdeadbeef…' },
        nodeStates: { api: 'processing' },
        sfx: 'buzz',
        teachingNote: {
          vi: 'Hỏi lớp: "endpoint này bảo vệ bằng gì?" — không phải bằng đăng nhập, mà bằng CHỮ KÝ HMAC. Đó là khác biệt cốt lõi giữa webhook và API thường.',
          en: 'Ask: "what protects this endpoint?" — not a login, but an HMAC SIGNATURE. That is the core difference between a webhook and a normal API.',
        },
      });
      steps.push({
        id: 'verify-fail',
        at: 'api',
        kind: 'ERROR',
        duration: 1500,
        status: 401,
        latencyMs: 1,
        title: { vi: 'Chữ ký HMAC không khớp — chặn', en: 'HMAC does not match — rejected' },
        detail: {
          vi: 'Server tự tính HMAC-SHA256 của thân request bằng khoá bí mật chỉ mình nó và PayOS biết, rồi so với header. Kẻ tấn công không có khoá nên không tạo nổi chữ ký đúng. Ba điều bắt buộc: (1) ký trên thân RAW, không phải trên object đã parse rồi stringify lại — thứ tự khoá và khoảng trắng đổi là chữ ký hỏng; (2) so sánh bằng hàm timing-safe, không dùng `===`; (3) kiểm cả timestamp để chặn phát lại chữ ký cũ.',
          en: 'The server computes HMAC-SHA256 of the request body with a secret only it and PayOS know, then compares against the header. The attacker has no secret, so cannot forge a valid one. Three musts: (1) sign the RAW body, never a parsed-then-restringified object — key order and whitespace changes break the signature; (2) compare with a timing-safe function, not `===`; (3) check the timestamp too, to stop replay of an old valid signature.',
        },
        payload: { expected: 'a91f…', received: 'dead…', match: false },
        nodeStates: { api: 'error', db: 'idle' },
        sfx: 'error',
        log: { vi: 'webhook rejected: invalid signature · ip=45.83.x.x', en: 'webhook rejected: invalid signature · ip=45.83.x.x' },
      });
      steps.push({
        id: 'forged-res',
        edge: 'e_psp_api',
        reverse: true,
        kind: 'ERROR',
        duration: 1200,
        status: 401,
        packetLabel: '401',
        title: { vi: 'Không có dòng nào được ghi vào CSDL', en: 'Nothing was written to the database' },
        detail: {
          vi: 'Chú ý mũi tên: KHÔNG có đường nào đi xuống PostgreSQL. Nếu thiếu bước kiểm chữ ký, kẻ tấn công vừa mua được hàng miễn phí bằng một lệnh curl. Đây là lỗ hổng thanh toán phổ biến nhất trong các dự án tự tích hợp.',
          en: 'Note the arrows: nothing reaches PostgreSQL. Without that signature check, the attacker just bought a product for free with a single curl. This is the most common payment vulnerability in hand-rolled integrations.',
        },
        nodeStates: { api: 'error' },
        sfx: 'buzz',
      });
      return steps;
    }

    /* ── Sai thứ tự ───────────────────────────────────────────── */
    if (kase === 'race') {
      steps.push({
        id: 'paid-first',
        edge: 'e_psp_api',
        kind: 'EVENT',
        duration: 1300,
        latencyMs: 40,
        packetLabel: 'status=PAID (t=2)',
        alsoInFlight: [{ edge: 'e_psp_api', at: 0.28, label: 'status=PENDING (t=1)', kind: 'ACK' }],
        title: { vi: 'PAID tới TRƯỚC, PENDING còn đang trên đường', en: 'PAID arrives FIRST, PENDING is still travelling' },
        detail: {
          vi: 'Cổng thanh toán gửi PENDING trước rồi mới PAID, nhưng hai gói đi hai đường mạng khác nhau và gói sau về trước. Webhook KHÔNG bảo đảm thứ tự — không cổng nào trên thế giới bảo đảm điều đó. Nếu bạn xử lý theo thứ tự nhận được, đơn hàng sẽ bị PENDING ghi đè lên PAID và khách hàng trả tiền rồi mà đơn vẫn treo.',
          en: 'The gateway sent PENDING first and PAID second, but the two packets took different network paths and the later one won. Webhooks do NOT guarantee ordering — no gateway on earth promises it. Process them in arrival order and PENDING overwrites PAID: the customer has paid and the order still shows unpaid.',
        },
        payload: PAYLOAD,
        nodeStates: { api: 'processing' },
        sfx: 'swoosh',
      });
      steps.push({
        id: 'guard-order',
        edge: 'e_api_db',
        kind: 'PUT',
        duration: 1500,
        latencyMs: 12,
        packetLabel: 'UPDATE … WHERE ts < $1',
        title: { vi: 'Chống bằng dấu thời gian, không bằng thứ tự nhận', en: 'Guard with a timestamp, not with arrival order' },
        detail: {
          vi: 'Câu lệnh ghi kèm điều kiện: chỉ cập nhật nếu dấu thời gian của sự kiện MỚI HƠN dấu đang lưu. Gói PENDING tới sau sẽ không khớp điều kiện và bị bỏ qua một cách yên lặng, đúng như mong muốn. Cách khác tương đương: chỉ cho phép chuyển trạng thái tiến lên (PENDING → PAID được, PAID → PENDING thì không).',
          en: 'The write carries a condition: only update when the event timestamp is NEWER than the stored one. The late PENDING fails that condition and is silently ignored, exactly as intended. An equivalent approach: allow only forward state transitions (PENDING → PAID yes, PAID → PENDING never).',
        },
        payload: { sql: 'UPDATE orders SET status=$1, event_ts=$2 WHERE id=$3 AND event_ts < $2', rowsAffected: 1 },
        nodeStates: { db: 'success' },
        sfx: 'lock',
        teachingNote: {
          vi: 'Nguyên tắc chung của hệ phân tán: đừng bao giờ tin thứ tự đến. Hãy để dữ liệu tự mang theo thông tin để tự sắp xếp — timestamp, số phiên bản, hoặc máy trạng thái một chiều.',
          en: 'The general distributed-systems rule: never trust arrival order. Let the data carry what it needs to order itself — a timestamp, a version number, or a one-way state machine.',
        },
      });
      steps.push({
        id: 'late-pending',
        edge: 'e_psp_api',
        kind: 'ACK',
        duration: 1300,
        latencyMs: 90,
        packetLabel: 'PENDING tới muộn',
        title: { vi: 'PENDING tới nơi — và bị bỏ qua đúng cách', en: 'PENDING lands — and is correctly ignored' },
        detail: {
          vi: 'Điều kiện event_ts < $2 không thoả, câu UPDATE ảnh hưởng 0 dòng. Server vẫn trả 200 (đã nhận, không cần gửi lại nữa) nhưng trạng thái đơn không đổi. "Nhận nhưng không làm gì" là một kết quả hợp lệ và cần thiết của webhook.',
          en: 'The event_ts < $2 condition fails and the UPDATE touches zero rows. The server still answers 200 (received, do not resend) while the order state stays put. "Accepted but no-op" is a valid and necessary webhook outcome.',
        },
        payload: { rowsAffected: 0, reason: 'stale event, ignored' },
        nodeStates: { api: 'success', db: 'success' },
        sfx: 'blip',
      });
      steps.push({
        id: 'race-notify',
        edge: 'e_api_rt',
        kind: 'EVENT',
        duration: 1200,
        packetLabel: 'order:paid',
        title: { vi: 'Người mua thấy đúng trạng thái PAID', en: 'The buyer sees the correct PAID state' },
        detail: {
          vi: 'Trạng thái cuối cùng đúng dù các sự kiện tới lộn xộn. Đó là dấu hiệu của một endpoint webhook được viết tử tế: kết quả không phụ thuộc vào may rủi của đường truyền.',
          en: 'The final state is right even though events arrived jumbled. That is the mark of a well-built webhook endpoint: the outcome does not depend on the network\'s luck.',
        },
        nodeStates: { rt: 'success' },
        sfx: 'success',
      });
      return steps;
    }

    /* ── Bình thường + gửi lại ────────────────────────────────── */
    steps.push({
      id: 'in',
      edge: 'e_psp_api',
      kind: 'POST',
      duration: 1200,
      latencyMs: 45,
      packetLabel: 'POST /webhooks/payos',
      title: { vi: 'PayOS chủ động gọi vào hệ thống của bạn', en: 'PayOS calls into your system' },
      detail: {
        vi: 'Người mua vừa quét QR xong. Đây là chiều gọi NGƯỢC so với API thường: bạn là bên bị gọi. Đừng bao giờ dựa vào việc người dùng được chuyển hướng về trang "thanh toán thành công" để ghi nhận — họ có thể tắt trình duyệt ngay sau khi trả tiền. Webhook mới là nguồn sự thật.',
        en: 'The buyer just finished scanning the QR. This is the reverse direction from a normal API: you are the one being called. Never rely on the user being redirected to a "payment success" page — they may close the browser the instant they pay. The webhook is the source of truth.',
      },
      payload: PAYLOAD,
      headers: { 'X-Payos-Signature': 'a91f6c2d…', 'Content-Type': 'application/json' },
      nodeStates: { psp: 'active', api: 'processing' },
      sfx: 'swoosh',
    });

    steps.push({
      id: 'verify',
      at: 'api',
      kind: 'TOKEN',
      duration: 1200,
      latencyMs: 1,
      title: { vi: 'Xác minh chữ ký trên thân RAW', en: 'Verify the signature over the RAW body' },
      detail: {
        vi: 'Phải lấy được thân request ở dạng byte thô TRƯỚC khi middleware JSON đụng vào. Trong Express nghĩa là cấu hình express.raw() riêng cho route này — dùng express.json() rồi JSON.stringify lại là chữ ký sẽ sai với xác suất rất cao, và bạn sẽ mất nửa ngày để hiểu vì sao.',
        en: 'You must capture the body as raw bytes BEFORE any JSON middleware touches it. In Express that means an express.raw() mounted for this route only — parse it with express.json() then re-stringify and the signature will very likely mismatch, and you will lose half a day working out why.',
      },
      payload: { algorithm: 'HMAC-SHA256', match: true },
      nodeStates: { api: 'success' },
      sfx: 'lock',
    });

    steps.push({
      id: 'dedupe',
      edge: 'e_api_cache',
      kind: kase === 'retry' ? 'CACHE_MISS' : 'POST',
      duration: 1200,
      latencyMs: 1,
      packetLabel: 'SET NX event id',
      title: { vi: 'Chống xử lý trùng theo ID sự kiện', en: 'Deduplicate on the event id' },
      detail: {
        vi: 'Mọi cổng thanh toán đều gửi theo mô hình "ít nhất một lần" — trùng là chuyện bình thường, không phải sự cố. Ghi ID sự kiện vào Redis bằng SET NX với hạn 24 giờ. Đặt được khoá thì xử lý, không đặt được thì đây là bản sao.',
        en: 'Every gateway delivers at-least-once — duplicates are normal traffic, not an incident. Record the event id in Redis with SET NX and a 24-hour TTL. Win the key and you process; lose it and this is a duplicate.',
      },
      payload: { key: 'webhook:payos:FT26072812345', ttl: 86400 },
      nodeStates: { cache: 'success' },
      sfx: 'blip',
    });

    steps.push({
      id: 'apply',
      edge: 'e_api_db',
      kind: 'PUT',
      duration: 1300,
      latencyMs: 14,
      packetLabel: 'orders → PAID',
      title: { vi: 'Đối chiếu SỐ TIỀN rồi mới ghi nhận', en: 'Reconcile the AMOUNT before recording' },
      detail: {
        vi: 'Bước hay bị bỏ sót: so số tiền trong webhook với số tiền của đơn trong CSDL. Chữ ký chỉ chứng minh thông điệp đến từ PayOS, nó KHÔNG chứng minh số tiền khớp với đơn hàng. Thiếu bước này thì một đơn 5 triệu có thể được đánh dấu đã thanh toán bởi một giao dịch 10 nghìn đồng.',
          en: 'The step most often skipped: compare the webhook amount against the order amount in your database. The signature proves the message came from PayOS; it does NOT prove the amount matches the order. Omit this and a 5,000,000₫ order can be marked paid by a 10,000₫ transaction.',
      },
      payload: { orderAmount: 499000, webhookAmount: 499000, match: true, status: 'PAID' },
      nodeStates: { db: 'success' },
      sfx: 'ping',
    });

    steps.push({
      id: 'ack',
      edge: 'e_psp_api',
      reverse: true,
      kind: 'ACK',
      duration: kase === 'retry' ? 1900 : 1100,
      status: 200,
      latencyMs: kase === 'retry' ? 31000 : 120,
      packetLabel: kase === 'retry' ? '200 (quá muộn)' : '200 OK',
      title: {
        vi: kase === 'retry' ? 'Trả 200 sau 31 giây — PayOS đã bỏ cuộc' : 'Trả 200 thật nhanh',
        en: kase === 'retry' ? '200 after 31 seconds — PayOS already gave up' : 'Answer 200 quickly',
      },
      detail: {
        vi:
          kase === 'retry'
            ? 'Endpoint đã làm đúng mọi thứ, chỉ có điều nó gửi email và tạo ảnh hoá đơn NGAY trong handler, mất 31 giây. Timeout của PayOS là 10 giây. Với PayOS thì lần gọi này THẤT BẠI, dù thực tế đơn đã được ghi nhận thành công.'
            : 'Trả 200 trong vài trăm mili giây. Nguyên tắc vàng: handler webhook chỉ được làm hai việc — xác minh và ghi nhận. Mọi việc nặng (gửi email, xuất hoá đơn, gọi dịch vụ khác) phải đẩy vào hàng đợi.',
        en:
          kase === 'retry'
            ? 'The endpoint did everything right, except it sent an email and rendered an invoice image INSIDE the handler, taking 31 seconds. PayOS times out at 10. As far as PayOS is concerned this delivery FAILED — even though the order was recorded perfectly.'
            : 'Answer 200 within a few hundred milliseconds. The golden rule: a webhook handler may do exactly two things — verify and record. Everything heavy (email, invoice rendering, calling other services) goes on a queue.',
      },
      nodeStates: { api: kase === 'retry' ? 'error' : 'success', psp: kase === 'retry' ? 'error' : 'success' },
      sfx: kase === 'retry' ? 'error' : 'ping',
      teachingNote:
        kase === 'retry'
          ? {
              vi: 'Đây là lỗi thiết kế tinh vi nhất của webhook: xử lý ĐÚNG nhưng trả lời CHẬM, và hậu quả giống hệt như xử lý sai.',
              en: 'The subtlest webhook design fault: processing correctly but answering slowly — with consequences identical to processing wrongly.',
            }
          : undefined,
    });

    if (kase === 'retry') {
      steps.push({
        id: 'resend',
        edge: 'e_psp_api',
        kind: 'PUT',
        duration: 1300,
        latencyMs: 45,
        packetLabel: 'gửi lại (lần 2)',
        title: { vi: 'PayOS gửi lại đúng sự kiện đó', en: 'PayOS redelivers the same event' },
        detail: {
          vi: 'Không nhận được 200 trong hạn, cổng thanh toán coi như thất bại và gửi lại — thường theo khoảng lùi tăng dần trong 24 giờ. Nếu handler không chống trùng, đơn hàng sẽ được ghi nhận thanh toán hai lần, email gửi hai lần, và có thể cộng điểm thưởng hai lần.',
          en: 'Having received no 200 in time, the gateway treats it as failed and redelivers — typically with growing backoff across 24 hours. If the handler has no duplicate guard, the order is recorded as paid twice, the email goes twice, and loyalty points may be granted twice.',
        },
        nodeStates: { psp: 'processing', api: 'processing' },
        sfx: 'swoosh',
      });
      steps.push({
        id: 'dedupe-hit',
        edge: 'e_api_cache',
        kind: 'CACHE_HIT',
        duration: 1300,
        latencyMs: 1,
        packetLabel: 'khoá đã tồn tại',
        title: { vi: 'Khoá chống trùng cứu bàn thua', en: 'The duplicate guard saves the day' },
        detail: {
          vi: 'SET NX thất bại vì ID sự kiện đã có trong Redis. Handler trả 200 ngay lập tức mà không chạm CSDL. Đây chính xác là lý do bước chống trùng ở trên không phải thứ "làm cho chắc" — nó là thứ giữ cho hệ thống đúng đắn khi (chứ không phải nếu) webhook bị gửi lại.',
          en: 'The SET NX fails because the event id is already in Redis. The handler answers 200 immediately without touching the database. This is exactly why that dedupe step is not belt-and-braces — it is what keeps the system correct when (not if) a webhook is redelivered.',
        },
        nodeStates: { cache: 'success', db: 'idle' },
        sfx: 'ping',
      });
      steps.push({
        id: 'fix-retry',
        edge: 'e_api_rt',
        kind: 'RESPONSE',
        duration: 1400,
        title: { vi: 'Cách sửa: đẩy việc nặng ra khỏi handler', en: 'The fix: move the heavy work out of the handler' },
        detail: {
          vi: 'Cấu trúc đúng gồm bốn dòng: xác minh chữ ký → chống trùng → ghi trạng thái → đẩy job vào hàng đợi → trả 200. Email, hoá đơn, thông báo đều do worker làm sau. Handler xong trong 120ms và không bao giờ bị gửi lại oan nữa.',
          en: 'The correct shape is four lines: verify signature → dedupe → record state → enqueue job → return 200. Email, invoice and notifications are the worker\'s problem afterwards. The handler finishes in 120ms and never gets redelivered for the wrong reason again.',
        },
        payload: { handlerMs: 120, enqueued: ['send-receipt-email', 'render-invoice-pdf'] },
        nodeStates: { api: 'success', rt: 'success' },
        sfx: 'success',
      });
      return steps;
    }

    steps.push({
      id: 'enqueue',
      edge: 'e_api_rt',
      kind: 'EVENT',
      duration: 1200,
      packetLabel: 'order:paid',
      title: { vi: 'Đẩy việc nặng đi và báo cho người mua', en: 'Offload the heavy work and notify the buyer' },
      detail: {
        vi: 'Email hoá đơn, cấp quyền học khoá học, cộng điểm — tất cả vào hàng đợi. Người mua nhận sự kiện realtime và màn hình chuyển sang "Đã thanh toán" ngay, dù họ đang ở tab khác. Đây là chỗ kịch bản này nối vào kịch bản Microservices và WebSocket.',
        en: 'Receipt email, granting course access, awarding points — all queued. The buyer receives a realtime event and their screen flips to "Paid" immediately, even from another tab. This is where this scenario hands off to the Microservices and WebSocket ones.',
      },
      nodeStates: { rt: 'success' },
      sfx: 'success',
    });

    return steps;
  },
};
