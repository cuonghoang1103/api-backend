/**
 * Nền tảng web · Pub/Sub — một sự kiện, nhiều người nghe.
 *
 * Câu hỏi mở đầu rất đời thường: đặt hàng xong thì phải xuất hoá đơn, trừ tồn
 * kho và gửi email xác nhận. Cách hiển nhiên là gọi lần lượt ba dịch vụ ngay
 * trong handler. Nó chạy được, cho tới khi:
 *
 *   - người dùng phải chờ tổng thời gian của CẢ BA (1.400ms cho một cú bấm);
 *   - dịch vụ email chết thì đơn hàng cũng hỏng theo, dù đơn đã ghi vào CSDL;
 *   - thêm một việc thứ tư (tích điểm, chống gian lận, gửi Slack) là phải sửa
 *     lại đúng cái handler đặt hàng — thứ đáng lẽ chỉ nên biết về đặt hàng.
 *
 * Pub/Sub đảo ngược chiều phụ thuộc: handler chỉ công bố "đơn hàng đã tạo" rồi
 * trả lời ngay. Ai quan tâm thì tự đăng ký nghe. Thêm việc thứ tư = thêm một
 * người nghe mới, KHÔNG đụng vào mã đặt hàng.
 *
 * Kịch bản cũng nói rõ chỗ mà nhiều người nhầm: pub/sub KHÔNG phải hàng đợi
 * công việc. Hàng đợi chia việc cho một trong nhiều worker (1 → 1); pub/sub
 * phát cho MỌI người đăng ký (1 → N). Và cái giá phải trả là tính nhất quán
 * cuối cùng: ngay sau khi API trả 201, hoá đơn có thể chưa tồn tại.
 */

import { Waypoints } from 'lucide-react';
import type { I18nText, Scenario, ScenarioOptions, SimStep } from '../types';

/* ── Sơ đồ ───────────────────────────────────────────────────── */

const nodes = [
  {
    id: 'client',
    label: 'Người mua',
    kind: 'client' as const,
    x: 90,
    y: 300,
    sublabel: { vi: 'Bấm "Đặt hàng"', en: 'Taps "Place order"' },
  },
  {
    id: 'api',
    label: 'Order API',
    kind: 'server' as const,
    x: 330,
    y: 300,
    sublabel: { vi: 'Ghi đơn vào CSDL', en: 'Writes the order' },
  },
  {
    id: 'bus',
    label: 'Event bus',
    kind: 'queue' as const,
    x: 570,
    y: 300,
    sublabel: { vi: 'Kênh order.created', en: 'Topic order.created' },
  },
  {
    id: 'invoice',
    label: 'Hoá đơn',
    kind: 'worker' as const,
    x: 850,
    y: 120,
    sublabel: { vi: 'Xuất PDF · 400ms', en: 'Renders a PDF · 400ms' },
  },
  {
    id: 'stock',
    label: 'Tồn kho',
    kind: 'worker' as const,
    x: 850,
    y: 300,
    sublabel: { vi: 'Trừ số lượng · 120ms', en: 'Decrements stock · 120ms' },
  },
  {
    id: 'email',
    label: 'Email',
    kind: 'worker' as const,
    x: 850,
    y: 480,
    sublabel: { vi: 'Gửi xác nhận · 880ms', en: 'Sends confirmation · 880ms' },
  },
];

const edges = [
  { id: 'e_c_api', from: 'client', to: 'api' },
  { id: 'e_api_bus', from: 'api', to: 'bus' },
  { id: 'e_bus_inv', from: 'bus', to: 'invoice' },
  { id: 'e_bus_stk', from: 'bus', to: 'stock' },
  { id: 'e_bus_mail', from: 'bus', to: 'email' },
  { id: 'e_api_inv', from: 'api', to: 'invoice', ghost: true, curve: -40 },
  { id: 'e_api_mail', from: 'api', to: 'email', ghost: true, curve: 40 },
];

/* ── Tiện ích ────────────────────────────────────────────────── */

type Push = (step: Partial<SimStep> & { id: string; title: I18nText; detail: I18nText; duration: number }) => void;

function collector(): { steps: SimStep[]; push: Push } {
  const steps: SimStep[] = [];
  const push: Push = (s) => {
    steps.push({ kind: 'INTERNAL', ...s } as SimStep);
  };
  return { steps, push };
}

/* ────────────────────────────────────────────────────────────
   A — GỌI THẲNG, TUẦN TỰ
   ──────────────────────────────────────────────────────────── */

function buildDirect(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'order',
    title: { vi: 'Người mua bấm "Đặt hàng"', en: 'The buyer taps "Place order"' },
    detail: {
      vi: 'Handler ghi đơn vào CSDL trong 30ms. Tới đây đơn hàng đã TỒN TẠI và hợp lệ — mọi việc còn lại chỉ là hệ quả của nó. Hãy nhớ điều đó, vì lát nữa nó sẽ là điểm mấu chốt.',
      en: 'The handler writes the order in 30ms. At this point the order EXISTS and is valid — everything that follows is merely a consequence of it. Remember that, because it becomes the crux in a moment.',
    },
    duration: 2500,
    edge: 'e_c_api',
    kind: 'POST',
    nodeStates: { client: 'active', api: 'processing' },
    packetLabel: 'POST /orders',
    latencyMs: 30,
    sfx: 'click',
    log: { vi: 'INSERT INTO orders … 30ms', en: 'INSERT INTO orders … 30ms' },
  });

  push({
    id: 'invoice',
    title: { vi: 'Rồi gọi dịch vụ hoá đơn — chờ 400ms', en: 'Then call the invoice service — wait 400ms' },
    detail: {
      vi: 'Handler đứng chờ hoá đơn xuất xong PDF. Người mua vẫn đang nhìn vòng xoay, dù đơn của họ đã nằm an toàn trong CSDL từ 400ms trước.',
      en: 'The handler blocks until the invoice service finishes rendering a PDF. The buyer is still watching a spinner, even though their order has been safely in the database for the last 400ms.',
    },
    duration: 2700,
    edge: 'e_api_inv',
    kind: 'INTERNAL',
    nodeStates: { invoice: 'processing' },
    packetLabel: 'gọi hoá đơn',
    latencyMs: 400,
    sfx: 'stream',
    log: { vi: 'invoice.create() … 400ms', en: 'invoice.create() … 400ms' },
  });

  push({
    id: 'stock',
    title: { vi: 'Xong hoá đơn mới tới tồn kho — thêm 120ms', en: 'Only then stock — another 120ms' },
    detail: {
      vi: 'Ba việc này chẳng phụ thuộc gì vào nhau: trừ tồn kho không cần biết hoá đơn đã xuất chưa. Nhưng vì viết tuần tự trong một handler, chúng phải xếp hàng, và tổng thời gian là TỔNG của cả ba.',
      en: 'These three jobs do not depend on each other at all: decrementing stock does not care whether the invoice exists. But written sequentially in one handler they must queue up, and the total is the SUM of all three.',
    },
    duration: 2600,
    at: 'stock',
    kind: 'INTERNAL',
    nodeStates: { invoice: 'success', stock: 'processing' },
    latencyMs: 120,
    sfx: 'blip',
    log: { vi: 'stock.decrement() … 120ms  (tổng 550ms)', en: 'stock.decrement() … 120ms  (550ms total)' },
  });

  push({
    id: 'mailfail',
    title: { vi: 'Dịch vụ email chết — và đơn hàng hỏng theo', en: 'The mail service dies — and takes the order with it' },
    detail: {
      vi: 'Nhà cung cấp email hết giờ chờ, ngoại lệ ném ra giữa handler, và người mua nhận về lỗi 500. Nhưng đơn hàng ĐÃ nằm trong CSDL từ đầu — nên bây giờ có một đơn hàng thật, đã trừ tồn kho, mà người mua tin rằng mình đặt thất bại. Họ sẽ bấm lại.',
      en: 'The mail provider times out, an exception is thrown mid-handler, and the buyer gets a 500. But the order has been in the database from the start — so now there is a real order, with stock already decremented, that the buyer believes failed. They will click again.',
    },
    duration: 3200,
    edge: 'e_api_mail',
    kind: 'ERROR',
    nodeStates: { email: 'error', api: 'error', client: 'error' },
    packetLabel: 'timeout',
    status: 500,
    sfx: 'error',
    log: { vi: '500 · đơn đã tạo, tồn kho đã trừ, mail chưa gửi', en: '500 · order created, stock decremented, mail not sent' },
    teachingNote: {
      vi: 'Hỏi lớp: đơn hàng này còn tồn tại không? Người mua nghĩ gì? Họ sẽ làm gì tiếp?',
      en: 'Ask the class: does the order still exist? What does the buyer think? What will they do next?',
    },
  });

  push({
    id: 'coupling',
    title: { vi: 'Và mỗi việc mới lại phải sửa đúng chỗ này', en: 'And every new job means editing this exact place' },
    detail: {
      vi: 'Thêm tích điểm, thêm kiểm tra gian lận, thêm thông báo Slack — tất cả đều phải chen vào handler đặt hàng. Một hàm đáng lẽ chỉ biết "tạo đơn" dần dần biết về hoá đơn, kho, email, điểm thưởng, Slack. Mỗi lần thêm là một lần có nguy cơ làm hỏng đường đặt hàng.',
      en: 'Add loyalty points, add fraud checks, add a Slack notification — all of them must squeeze into the order handler. A function that should only know "create an order" gradually learns about invoices, stock, email, points and Slack. Every addition is another chance to break the order path.',
    },
    duration: 2900,
    at: 'api',
    nodeStates: { api: 'error' },
    sfx: 'buzz',
    log: { vi: 'handler dài 180 dòng, chạm 5 dịch vụ', en: 'handler is 180 lines, touches 5 services' },
  });

  return steps;
}

/* ────────────────────────────────────────────────────────────
   B — CÔNG BỐ SỰ KIỆN
   ──────────────────────────────────────────────────────────── */

function buildPubSub(): SimStep[] {
  const { steps, push } = collector();

  push({
    id: 'order',
    title: { vi: 'Ghi đơn xong là công bố sự kiện, rồi trả lời ngay', en: 'Write the order, publish an event, answer immediately' },
    detail: {
      vi: 'Handler làm đúng hai việc: ghi đơn vào CSDL và đẩy một sự kiện `order.created` lên bus. Nó KHÔNG biết ai đang nghe, cũng không quan tâm. Tổng cộng 45ms, và người mua nhận 201 ngay lập tức.',
      en: 'The handler does exactly two things: write the order and publish an `order.created` event. It does NOT know who is listening, and does not care. Forty-five milliseconds in total, and the buyer gets a 201 straight away.',
    },
    duration: 2700,
    edge: 'e_c_api',
    kind: 'POST',
    nodeStates: { client: 'active', api: 'processing' },
    packetLabel: 'POST /orders',
    latencyMs: 45,
    sfx: 'click',
    log: { vi: 'INSERT + publish → 201 trong 45ms', en: 'INSERT + publish → 201 in 45ms' },
  });

  push({
    id: 'publish',
    title: { vi: 'Sự kiện lên kênh order.created', en: 'The event lands on the order.created topic' },
    detail: {
      vi: 'Sự kiện mô tả một SỰ VIỆC ĐÃ XẢY RA, không phải một mệnh lệnh: "đơn 8412 đã được tạo", chứ không phải "hãy xuất hoá đơn". Khác biệt về cách đặt tên này quyết định kiến trúc — mệnh lệnh thì phải biết ai thi hành, sự việc thì không.',
      en: 'The event describes something that HAPPENED, not a command: "order 8412 was created", not "please issue an invoice". That naming difference drives the architecture — a command must know its executor, a fact need not.',
    },
    duration: 2800,
    edge: 'e_api_bus',
    kind: 'EVENT',
    nodeStates: { api: 'success', bus: 'processing' },
    packetLabel: 'order.created',
    sfx: 'swoosh',
    log: { vi: '{ type: "order.created", orderId: 8412 }', en: '{ type: "order.created", orderId: 8412 }' },
  });

  push({
    id: 'fanout',
    title: { vi: 'Ba người nghe nhận CÙNG MỘT bản sao, cùng lúc', en: 'Three subscribers get THEIR OWN copy, all at once' },
    detail: {
      vi: 'Đây là điểm phân biệt pub/sub với hàng đợi công việc. Hàng đợi giao một việc cho MỘT worker trong nhóm (1 → 1). Pub/sub phát bản sao cho MỌI người đăng ký (1 → N). Ba việc chạy song song, nên tổng thời gian là việc CHẬM NHẤT (880ms) chứ không phải tổng ba việc — và người mua chẳng chờ cái nào cả.',
      en: 'This is what separates pub/sub from a work queue. A queue hands one job to ONE worker in a group (1 → 1). Pub/sub delivers a copy to EVERY subscriber (1 → N). The three run in parallel, so the wall-clock cost is the SLOWEST job (880ms) rather than the sum — and the buyer waits for none of them.',
    },
    duration: 3200,
    edge: 'e_bus_stk',
    kind: 'EVENT',
    nodeStates: { invoice: 'processing', stock: 'processing', email: 'processing' },
    packetLabel: 'bản sao',
    alsoInFlight: [
      { edge: 'e_bus_inv', at: 0.55, label: 'bản sao', kind: 'EVENT' },
      { edge: 'e_bus_mail', at: 0.55, label: 'bản sao', kind: 'EVENT' },
    ],
    sfx: 'stream',
    teachingNote: {
      vi: 'Nhấn mạnh: hàng đợi = 1→1 (chia việc), pub/sub = 1→N (phát tin). Hai thứ khác nhau.',
      en: 'Stress: queue = 1→1 (work sharing), pub/sub = 1→N (broadcast). Different tools.',
    },
  });

  push({
    id: 'mailfail',
    title: { vi: 'Email lại chết — nhưng lần này không ai hề hấn', en: 'Mail dies again — and this time nothing else notices' },
    detail: {
      vi: 'Người mua đã nhận 201 từ lâu. Hoá đơn vẫn xuất xong, tồn kho vẫn trừ đúng. Chỉ riêng người nghe email thất bại, và nó thử lại theo lịch riêng của mình. Sự cố được KHOANH VÙNG đúng chỗ nó xảy ra thay vì lan ngược lên đường đặt hàng.',
      en: 'The buyer received their 201 long ago. The invoice still rendered, the stock still decremented. Only the mail subscriber failed, and it retries on its own schedule. The failure is CONTAINED where it happened instead of propagating back up the order path.',
    },
    duration: 3100,
    at: 'email',
    kind: 'ERROR',
    nodeStates: { email: 'error', invoice: 'success', stock: 'success', client: 'success' },
    packetLabel: 'thử lại sau',
    sfx: 'buzz',
    log: { vi: 'email: timeout → thử lại sau 30s · đơn hàng KHÔNG bị ảnh hưởng', en: 'email: timeout → retry in 30s · the order is UNAFFECTED' },
  });

  push({
    id: 'add',
    title: { vi: 'Thêm việc thứ tư mà không đụng vào mã đặt hàng', en: 'Add a fourth job without touching the order code' },
    detail: {
      vi: 'Muốn tích điểm khách hàng thân thiết? Viết một người nghe mới, đăng ký kênh `order.created`, xong. Handler đặt hàng không đổi một dòng, không cần deploy lại, không có nguy cơ làm hỏng đường đặt hàng. Đây mới là giá trị lớn nhất của pub/sub — lớn hơn cả chuyện nhanh hay chậm.',
      en: 'Want loyalty points? Write a new subscriber, subscribe it to `order.created`, done. The order handler changes not a single line, needs no redeploy, and carries no risk to the order path. This is pub/sub’s biggest payoff — bigger than the latency win.',
    },
    duration: 3000,
    at: 'bus',
    kind: 'EVENT',
    nodeStates: { bus: 'success' },
    sfx: 'ping',
    log: { vi: 'subscriber #4: loyalty.points — 0 dòng sửa ở Order API', en: 'subscriber #4: loyalty.points — 0 lines changed in Order API' },
  });

  push({
    id: 'cost',
    title: { vi: 'Cái giá: nhất quán cuối cùng, và phải chịu được lặp', en: 'The cost: eventual consistency, and idempotency' },
    detail: {
      vi: 'Không có gì miễn phí. Ngay sau khi API trả 201, hoá đơn có thể CHƯA tồn tại — giao diện phải chấp nhận trạng thái "đang xử lý" thay vì hiện ngay. Và vì bus thường bảo đảm "giao ít nhất một lần", một sự kiện có thể tới hai lần khi có sự cố mạng: mỗi người nghe phải chịu được lặp, thường bằng cách ghi nhớ id sự kiện đã xử lý. Cuối cùng, cần một chỗ chứa sự kiện chết hẳn (dead letter) để không mất im lặng.',
      en: 'Nothing is free. Right after the API returns 201 the invoice may NOT exist yet — the UI must accept a "processing" state instead of showing it immediately. And because buses typically guarantee at-least-once delivery, an event can arrive twice during a network hiccup: every subscriber must be idempotent, usually by remembering processed event ids. Finally you need a dead-letter destination so permanently failed events are not lost in silence.',
    },
    duration: 3300,
    at: 'bus',
    nodeStates: { bus: 'active' },
    sfx: 'lock',
    log: { vi: 'at-least-once → người nghe phải idempotent + có dead letter', en: 'at-least-once → subscribers must be idempotent + dead letter' },
  });

  return steps;
}

/* ── Kịch bản ────────────────────────────────────────────────── */

export const pubSubScenario: Scenario = {
  id: 'pub-sub',
  name: { vi: 'Pub/Sub — một sự kiện, nhiều người nghe', en: 'Pub/Sub — one event, many listeners' },
  tagline: {
    vi: 'Gọi thẳng ba dịch vụ thì người mua chờ 1.400ms và email chết là đơn hàng hỏng theo. Công bố một sự kiện thì API trả lời trong 45ms, email chết chẳng ai hề hấn, và thêm việc thứ tư không phải sửa mã đặt hàng.',
    en: 'Calling three services inline makes the buyer wait 1,400ms, and a mail failure kills the order. Publishing one event answers in 45ms, contains the mail failure, and lets you add a fourth job without touching the order code.',
  },
  icon: Waypoints,
  accent: '#a78bfa',
  lesson: {
    course: 'nodejs',
    code: '12.5',
    slug: 'nodejs-12-5-pubsub-streams',
    title: { vi: 'Pub/Sub và Streams: tin nhắn đã biến mất', en: 'Pub/Sub and Streams: the message that vanished' },
  },
  nodes,
  edges,
  options: [
    {
      id: 'style',
      label: { vi: 'Cách nối các dịch vụ', en: 'How services are wired' },
      defaultValue: 'direct',
      choices: [
        {
          value: 'direct',
          label: 'Gọi thẳng, tuần tự',
          fullLabel: 'Handler gọi lần lượt ba dịch vụ',
          color: '#f43f5e',
          hint: { vi: '1.400ms, email chết là hỏng cả', en: '1,400ms, mail failure kills it' },
        },
        {
          value: 'pubsub',
          label: 'Công bố sự kiện',
          fullLabel: 'order.created → ba người nghe',
          color: '#34d399',
          hint: { vi: '45ms, lỗi được khoanh vùng', en: '45ms, failures contained' },
        },
      ],
    },
  ],
  build: (opts: ScenarioOptions): SimStep[] => (opts.style === 'pubsub' ? buildPubSub() : buildDirect()),
};
