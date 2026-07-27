/**
 * Kịch bản 7 — Spam click "Mua ngay" khi mạng lag.
 *
 * Đây là kịch bản DUY NHẤT trong bộ có nhiều gói tin cùng lơ lửng trên dây,
 * và đó chính là toàn bộ bài học: người dùng bấm lần thứ hai KHÔNG PHẢI vì
 * họ nghịch, mà vì lần thứ nhất chưa phản hồi. Nhìn ba viên gói tin xếp
 * hàng trên cùng một sợi dây trong khi server chưa kịp trả lời là hiểu ngay
 * vì sao double-submit xảy ra ở mọi hệ thống thanh toán trên đời.
 *
 * Ba nhánh xếp theo đúng thứ tự nên dạy:
 *   none        → để nó xảy ra, trừ tiền 3 lần. Học viên phải THẤY thiệt hại.
 *   ratelimit   → chặn được, nhưng chặn sai chỗ và vẫn hỏng ở tình huống khác.
 *   idempotency → cách đúng.
 */

import { MousePointerClick } from 'lucide-react';
import type { Scenario, SimStep } from '../types';

const nodes = [
  { id: 'user', label: 'Browser', kind: 'client' as const, x: 100, y: 300, sublabel: { vi: 'Nút "Mua ngay"', en: '"Buy now" button' } },
  { id: 'edge', label: 'Rate Limiter', kind: 'edge' as const, x: 360, y: 300, sublabel: { vi: 'Nginx · đếm theo IP', en: 'Nginx · per-IP counter' } },
  { id: 'api', label: 'Order API', kind: 'server' as const, x: 620, y: 300, sublabel: { vi: 'Tạo đơn · trừ tiền', en: 'Create order · charge' } },
  { id: 'cache', label: 'Redis', kind: 'cache' as const, x: 880, y: 130, sublabel: { vi: 'Khoá Idempotency-Key', en: 'Idempotency-Key store' } },
  { id: 'db', label: 'PostgreSQL', kind: 'db' as const, x: 880, y: 470, sublabel: { vi: 'orders · wallet', en: 'orders · wallet' } },
];

const edges = [
  { id: 'e_user_edge', from: 'user', to: 'edge', label: { vi: 'mạng 3G chập chờn', en: 'flaky 3G' } },
  { id: 'e_edge_api', from: 'edge', to: 'api' },
  { id: 'e_api_cache', from: 'api', to: 'cache' },
  { id: 'e_api_db', from: 'api', to: 'db' },
];

const ORDER_BODY = {
  productId: 'khoa-hoc-nodejs',
  qty: 1,
  amount: 499000,
  currency: 'VND',
};

export const spamClickScenario: Scenario = {
  id: 'spam-click',
  name: { vi: 'Spam click mua hàng khi mạng lag', en: 'Double-submit under network lag' },
  tagline: {
    vi: 'Người dùng bấm 3 lần vì lần đầu chưa phản hồi. Xem tiền bị trừ 3 lần, rồi xem hai cách chặn — và vì sao chỉ một cách là đúng.',
    en: 'The user clicks three times because the first click never answered. Watch the wallet get charged three times, then watch two defences — and why only one of them actually works.',
  },
  icon: MousePointerClick,
  accent: '#f43f5e',
  nodes,
  edges,
  options: [
    {
      id: 'guard',
      label: { vi: 'Cơ chế phòng vệ', en: 'Defence' },
      defaultValue: 'none',
      choices: [
        { value: 'none', label: 'Không có gì', color: '#f43f5e', hint: { vi: 'Trừ tiền 3 lần — xem trước để thấy thiệt hại', en: 'Charged three times — watch this first' } },
        { value: 'ratelimit', label: 'Rate limit → 429', color: '#fbbf24', hint: { vi: 'Chặn được lần này, nhưng chặn sai chỗ', en: 'Blocks this case, but guards the wrong thing' } },
        { value: 'idempotency', label: 'Idempotency-Key', color: '#34d399', hint: { vi: 'Cách đúng: an toàn kể cả khi thử lại', en: 'The right fix: safe even on retry' } },
      ],
    },
    {
      id: 'ux',
      label: { vi: 'Giao diện có khoá nút không?', en: 'Does the UI disable the button?' },
      defaultValue: 'no',
      choices: [
        { value: 'no', label: 'Không khoá', color: '#f43f5e' },
        { value: 'yes', label: 'Khoá + spinner', color: '#38bdf8', hint: { vi: 'Giảm hẳn số ca, nhưng KHÔNG thay được phòng vệ ở server', en: 'Cuts most cases — but never replaces the server-side guard' } },
      ],
    },
  ],

  build({ guard = 'none', ux = 'no' }) {
    const steps: SimStep[] = [];
    const locked = ux === 'yes';

    /* ── Cú bấm đầu tiên ───────────────────────────────────────── */
    steps.push({
      id: 'click-1',
      edge: 'e_user_edge',
      kind: 'POST',
      // Cố tình DÀI. Thời lượng ở đây chính là cảm giác "sao lâu thế" mà
      // người dùng đang chịu đựng — không phải hiệu ứng trang trí.
      duration: 2600,
      latencyMs: 4200,
      packetLabel: 'POST /orders #1',
      title: { vi: 'Bấm "Mua ngay" — gói tin lết trên mạng lag', en: 'Click "Buy now" — the packet crawls over a lagging network' },
      detail: {
        vi: 'Request rời máy bình thường, nhưng mạng 3G đang tắc: 4,2 giây mới tới nơi. Điểm mấu chốt cần nhấn mạnh — phía người dùng KHÔNG có cách nào biết request đang đi hay đã chết. Màn hình chỉ đứng im. Mọi thứ sắp xảy ra đều bắt nguồn từ sự im lặng này.',
        en: 'The request leaves normally, but the 3G link is congested: 4.2 seconds in flight. The crucial point — the user has NO way to tell whether the request is travelling or already dead. The screen simply sits there. Everything that follows grows out of that silence.',
      },
      payload: ORDER_BODY,
      headers: guard === 'idempotency' ? { 'Idempotency-Key': '9f2c1a7e-…-4b81', 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' },
      nodeStates: { user: 'waiting', edge: 'waiting' },
      sfx: 'swoosh',
      log: { vi: '→ POST /orders #1 (đang chờ…)', en: '→ POST /orders #1 (pending…)' },
      teachingNote: {
        vi: 'Hỏi lớp: "lúc này người dùng nên làm gì?" — câu trả lời tự nhiên của mọi người là BẤM LẠI. Đó không phải lỗi người dùng, đó là lỗi thiết kế.',
        en: 'Ask the room: "what should the user do right now?" — everyone\'s instinct is to CLICK AGAIN. That is not a user error, it is a design error.',
      },
    });

    /* ── Nhánh giao diện có khoá nút ───────────────────────────── */
    if (locked) {
      steps.push({
        id: 'ui-locked',
        at: 'user',
        kind: 'INTERNAL',
        duration: 1500,
        title: { vi: 'Nút bị khoá + hiện spinner', en: 'Button disabled + spinner shown' },
        detail: {
          vi: 'Nút chuyển sang disabled ngay khi bấm, kèm vòng quay. Cách này chặn được phần lớn ca double-submit và nên LUÔN làm. Nhưng nó KHÔNG phải hàng phòng vệ: người dùng bấm F5 rồi gửi lại, mạng tự thử lại, hoặc ai đó gọi thẳng API bằng curl thì nút disabled vô nghĩa. Giao diện là lớp trải nghiệm, không phải lớp bảo đảm.',
          en: 'The button flips to disabled on click, with a spinner. This stops most double-submits and should ALWAYS be done. But it is not a defence: the user hits F5 and resubmits, the network retries on its own, or somebody calls the API straight from curl — a disabled button means nothing there. The UI is an experience layer, never a guarantee layer.',
        },
        nodeStates: { user: 'processing' },
        sfx: 'click',
        teachingNote: {
          vi: 'Câu chốt: "khoá nút là phép LỊCH SỰ, idempotency mới là phép BẢO ĐẢM". Đừng bao giờ đổi chỗ hai thứ này.',
          en: 'The line to land: "disabling the button is a courtesy, idempotency is a guarantee." Never swap the two.',
        },
      });
    }

    /* ── Bấm lần 2 và 3 khi lần 1 còn lơ lửng ─────────────────── */
    steps.push({
      id: 'click-2',
      edge: 'e_user_edge',
      kind: 'POST',
      duration: 1700,
      latencyMs: 3900,
      packetLabel: 'POST /orders #2',
      // Gói #1 vẫn đang treo giữa đường — đây là hình ảnh cốt lõi của bài.
      alsoInFlight: [{ edge: 'e_user_edge', at: 0.72, label: 'POST /orders #1' }],
      title: {
        vi: locked ? 'Người dùng tải lại trang rồi bấm tiếp' : 'Sốt ruột — bấm lần thứ hai',
        en: locked ? 'The user reloads the page and clicks again' : 'Impatient — the second click',
      },
      detail: {
        vi: locked
          ? 'Nút bị khoá nên người dùng làm điều tiếp theo mà ai cũng làm: nhấn F5. Trang tải lại, nút hết disabled, họ bấm lại. Toàn bộ công sức khoá nút vừa bị xoá sạch bởi một phím duy nhất — và server thì vẫn chưa có gì bảo vệ nó.'
          : 'Nhìn sợi dây: giờ có HAI gói tin cùng nằm trên đó. Gói #1 chưa tới nơi, gói #2 đã lên đường. Server sắp nhận hai đơn hàng giống hệt nhau, cách nhau vài trăm mili giây, và nó không có cách nào tự biết đó là cùng một ý định mua.',
        en: locked
          ? 'The button is disabled, so the user does the next thing everyone does: hit F5. The page reloads, the button is enabled again, they click. One keystroke just erased all the work the disabled button was doing — and the server still has nothing protecting it.'
          : 'Look at the wire: there are now TWO packets on it. #1 has not arrived, #2 is already under way. The server is about to receive two identical orders a few hundred milliseconds apart, with no way of knowing on its own that they are the same intent.',
      },
      payload: ORDER_BODY,
      nodeStates: { user: 'error' },
      sfx: 'swoosh',
      log: { vi: '→ POST /orders #2 (#1 vẫn chưa phản hồi)', en: '→ POST /orders #2 (#1 still unanswered)' },
    });

    steps.push({
      id: 'click-3',
      edge: 'e_user_edge',
      kind: 'POST',
      duration: 1500,
      latencyMs: 3600,
      packetLabel: 'POST /orders #3',
      alsoInFlight: [
        { edge: 'e_user_edge', at: 0.86, label: 'POST /orders #1' },
        { edge: 'e_user_edge', at: 0.55, label: 'POST /orders #2' },
      ],
      title: { vi: 'Bấm lần thứ ba — ba gói tin trên một sợi dây', en: 'Third click — three packets on one wire' },
      detail: {
        vi: 'Ba yêu cầu tạo đơn giống hệt nhau đang bay song song. Đây không phải tình huống hiếm gặp: nó xảy ra mỗi ngày trên mọi cổng thanh toán, mọi form đăng ký, mọi nút "gửi". Câu hỏi không phải "làm sao ngăn người dùng bấm nhiều lần" — mà là "làm sao để bấm nhiều lần cũng chỉ tính tiền một lần".',
        en: 'Three identical create-order requests are in flight at once. This is not an exotic case: it happens every day on every payment gateway, every signup form, every submit button. The question is never "how do I stop users clicking twice" — it is "how do I make clicking twice charge only once".',
      },
      payload: ORDER_BODY,
      nodeStates: { user: 'error', edge: 'processing' },
      sfx: 'buzz',
    });

    /* ── Request #1 tới server và được xử lý ──────────────────── */
    steps.push({
      id: 'arrive-1',
      edge: 'e_edge_api',
      kind: 'POST',
      duration: 1100,
      latencyMs: 2,
      packetLabel: '#1 → handler',
      alsoInFlight: [
        { edge: 'e_user_edge', at: 0.94, label: '#2' },
        { edge: 'e_user_edge', at: 0.66, label: '#3' },
      ],
      title: { vi: 'Request #1 tới nơi — hoàn toàn hợp lệ', en: 'Request #1 lands — perfectly legitimate' },
      detail: {
        vi: 'Không có gì đáng ngờ ở gói tin này cả: đúng người dùng, đúng token, đúng sản phẩm. Nếu chỉ nhìn riêng nó thì đây là một đơn hàng hoàn hảo. Vấn đề không nằm ở gói tin nào cả — vấn đề nằm ở việc sắp có thêm hai gói y hệt.',
        en: 'There is nothing suspicious about this packet: right user, valid token, real product. Judged alone it is a perfect order. The problem is not in any single packet — the problem is that two identical ones are right behind it.',
      },
      nodeStates: { api: 'processing' },
      sfx: 'blip',
    });

    if (guard === 'idempotency') {
      steps.push({
        id: 'idem-claim',
        edge: 'e_api_cache',
        kind: 'POST',
        duration: 1200,
        latencyMs: 1,
        packetLabel: 'SET NX key',
        alsoInFlight: [{ edge: 'e_user_edge', at: 0.94, label: '#2' }, { edge: 'e_user_edge', at: 0.66, label: '#3' }],
        title: { vi: 'Giành khoá Idempotency-Key', en: 'Claim the Idempotency-Key' },
        detail: {
          vi: 'Client sinh MỘT khoá duy nhất cho MỘT ý định mua và gắn vào header — cả ba lần bấm đều mang cùng khoá đó, vì đó là cùng một ý định. Server chạy SET NX: chỉ request nào đặt được khoá mới được đi tiếp. Chữ NX (chỉ đặt khi chưa tồn tại) là thứ làm nên tính nguyên tử — không có nó thì hai request cùng đọc "chưa có" rồi cùng ghi, và ta quay lại vạch xuất phát.',
          en: 'The client generates ONE key per purchase intent and sends it as a header — all three clicks carry the same key, because they are the same intent. The server runs SET NX: only the request that wins the key proceeds. The NX (set only if absent) is what makes it atomic — without it two requests both read "absent" and both write, and we are back where we started.',
        },
        payload: { command: 'SET idem:9f2c1a7e-…-4b81 "processing" NX EX 86400', result: 'OK' },
        nodeStates: { cache: 'success' },
        sfx: 'lock',
        teachingNote: {
          vi: 'Khoá phải do CLIENT sinh, không phải server. Server sinh thì mỗi request lại một khoá khác nhau và cơ chế vô dụng ngay.',
          en: 'The key must be generated by the CLIENT, not the server. If the server generates it, every request gets a different key and the whole mechanism is useless.',
        },
      });
    }

    steps.push({
      id: 'charge-1',
      edge: 'e_api_db',
      kind: 'PUT',
      duration: 1300,
      latencyMs: 16,
      packetLabel: 'trừ 499.000đ',
      alsoInFlight: [{ edge: 'e_user_edge', at: 0.96, label: '#2' }, { edge: 'e_user_edge', at: 0.7, label: '#3' }],
      title: { vi: 'Tạo đơn và trừ tiền — lần thứ nhất', en: 'Create the order and charge — first time' },
      detail: {
        vi: 'Giao dịch chạy: chèn một dòng vào bảng orders, trừ 499.000đ khỏi ví. Đây là thao tác ĐÚNG và cần thiết. Nó chỉ trở thành thảm hoạ khi được lặp lại — mà hai bản sao thì đang trên đường tới.',
        en: 'The transaction runs: insert a row into orders, subtract 499,000₫ from the wallet. This operation is correct and necessary. It only becomes a disaster when repeated — and two copies are already on their way.',
      },
      payload: { orderId: 'ord_88213', amount: 499000, walletBefore: 1200000, walletAfter: 701000 },
      nodeStates: { db: 'success', api: 'success' },
      sfx: 'ping',
      log: { vi: 'order ord_88213 created · wallet 1.200.000 → 701.000', en: 'order ord_88213 created · wallet 1,200,000 → 701,000' },
    });

    /* ── #2 và #3 tới nơi — đây là chỗ ba nhánh tách ra ───────── */
    if (guard === 'none') {
      steps.push({
        id: 'charge-2',
        edge: 'e_api_db',
        kind: 'PUT',
        duration: 1200,
        latencyMs: 15,
        packetLabel: 'trừ 499.000đ (lần 2)',
        alsoInFlight: [{ edge: 'e_edge_api', at: 0.6, label: '#3' }],
        title: { vi: 'Request #2 tới — và trừ tiền LẦN NỮA', en: 'Request #2 lands — and charges AGAIN' },
        detail: {
          vi: 'Server không có bất kỳ cơ sở nào để nghi ngờ. Với nó, đây là một đơn hàng mới, hợp lệ, từ một người dùng đã xác thực. Nó làm đúng việc được giao. Lỗi không nằm ở dòng code nào cả — lỗi nằm ở chỗ hệ thống chưa bao giờ được cho biết "hai request này là cùng một ý định".',
          en: 'The server has no basis whatsoever for suspicion. To it, this is a fresh, valid order from an authenticated user. It does exactly its job. The bug is in no single line of code — the bug is that the system was never told "these two requests are one intent".',
        },
        payload: { orderId: 'ord_88214', amount: 499000, walletBefore: 701000, walletAfter: 202000 },
        nodeStates: { db: 'error' },
        sfx: 'error',
        log: { vi: 'order ord_88214 created · wallet 701.000 → 202.000', en: 'order ord_88214 created · wallet 701,000 → 202,000' },
      });
      steps.push({
        id: 'charge-3',
        edge: 'e_api_db',
        kind: 'PUT',
        duration: 1200,
        latencyMs: 15,
        packetLabel: 'trừ 499.000đ (lần 3)',
        title: { vi: 'Request #3 — số dư âm', en: 'Request #3 — the balance goes negative' },
        detail: {
          vi: 'Ba đơn hàng, 1.497.000đ bị trừ từ một chiếc ví chỉ có 1.200.000đ. Số dư âm 297.000đ. Người dùng nhận ba email xác nhận và sẽ mở ticket khiếu nại trong vòng vài phút. Và tình huống này chỉ cần MỘT lần mạng lag để xảy ra.',
          en: 'Three orders, 1,497,000₫ taken from a wallet holding 1,200,000₫. The balance is now minus 297,000₫. The user gets three confirmation emails and opens a support ticket within minutes. All it took was one lagging network.',
        },
        payload: { orderId: 'ord_88215', walletAfter: -297000, alert: 'BALANCE_NEGATIVE' },
        nodeStates: { db: 'error', api: 'error' },
        sfx: 'error',
        teachingNote: {
          vi: 'Đây là khung hình đắt nhất của cả kịch bản. Dừng lâu ở đây rồi mới chuyển sang nhánh idempotency — người xem cần THẤY thiệt hại trước khi nghe cách chữa.',
          en: 'This is the most valuable frame in the scenario. Sit on it before switching to the idempotency branch — people need to SEE the damage before they hear the cure.',
        },
      });
      steps.push({
        id: 'none-res',
        edge: 'e_user_edge',
        reverse: true,
        kind: 'ERROR',
        duration: 1200,
        status: 201,
        packetLabel: '3 × 201 Created',
        title: { vi: 'Ba phản hồi "thành công" cùng về', en: 'Three "success" responses arrive together' },
        detail: {
          vi: 'Trớ trêu: về mặt HTTP thì cả ba đều 201 Created — không có lỗi nào để log, không có cảnh báo nào nổ. Đây là loại sự cố tệ nhất: hệ thống báo khoẻ trong khi tiền đã bay. Bạn chỉ biết khi khách hàng gọi tới.',
          en: 'The irony: all three are HTTP 201 Created — no error to log, no alert to fire. This is the worst class of incident: the system reports healthy while the money is gone. You find out when the customer calls.',
        },
        nodeStates: { user: 'error' },
        sfx: 'buzz',
      });
      return steps;
    }

    if (guard === 'ratelimit') {
      steps.push({
        id: 'rl-block',
        at: 'edge',
        kind: 'ERROR',
        duration: 1400,
        latencyMs: 1,
        status: 429,
        title: { vi: 'Rate limiter chặn #2 và #3 — 429', en: 'Rate limiter rejects #2 and #3 — 429' },
        detail: {
          vi: 'Bộ đếm theo IP thấy 3 request trong 1 giây, vượt ngưỡng, trả 429 Too Many Requests kèm header Retry-After. Tiền chỉ bị trừ một lần. Nghe có vẻ đã xong chuyện — nhưng chưa.',
          en: 'The per-IP counter sees three requests in one second, exceeds the threshold and returns 429 Too Many Requests with a Retry-After header. The money was taken once. It sounds solved — it is not.',
        },
        payload: { error: 'TooManyRequests', limit: '2/s', retryAfter: 1 },
        headers: { 'Retry-After': '1', 'X-RateLimit-Remaining': '0' },
        nodeStates: { edge: 'error' },
        sfx: 'error',
        log: { vi: 'limiting requests, excess: 1 by zone "orders"', en: 'limiting requests, excess: 1 by zone "orders"' },
      });
      steps.push({
        id: 'rl-flaw',
        at: 'api',
        kind: 'CACHE_MISS',
        duration: 1600,
        title: { vi: 'Vì sao rate limit là câu trả lời SAI', en: 'Why rate limiting is the WRONG answer' },
        detail: {
          vi: 'Rate limit chống được LŨ REQUEST, không chống được LẶP Ý ĐỊNH. Bấm lại sau 3 giây thì dưới ngưỡng — trừ tiền lần hai bình thường. Hai người dùng chung một IP văn phòng thì người vô tội bị chặn oan. Và mọi cơ chế thử lại tự động (axios retry, retry của cổng thanh toán, người dùng bấm F5 sau một phút) đều đi lọt. Nó là van an toàn chống quá tải, không phải cơ chế bảo đảm tính đúng đắn.',
          en: 'Rate limiting defends against a FLOOD of requests, not against a REPEATED INTENT. Click again after three seconds and you are under the threshold — charged a second time, cleanly. Two users behind one office IP and the innocent one gets blocked. And every automatic retry (axios retry, the payment gateway\'s own retry, a user refreshing a minute later) sails straight through. It is a pressure valve against overload, not a correctness guarantee.',
        },
        nodeStates: { api: 'error' },
        sfx: 'buzz',
        teachingNote: {
          vi: 'Nhắc lại sự cố 429 thật của dự án: khoá rate limit lấy nhầm phần tử ĐẦU của X-Forwarded-For nên kẻ tấn công giả IP là lách được. Phải lấy phần tử CUỐI do proxy tin cậy ghi.',
          en: 'Tie back to the project\'s real 429 incident: the limiter keyed on the FIRST entry of X-Forwarded-For, so a spoofed header bypassed it. Key on the LAST entry, written by your trusted proxy.',
        },
      });
      steps.push({
        id: 'rl-res',
        edge: 'e_user_edge',
        reverse: true,
        kind: 'ERROR',
        duration: 1200,
        status: 429,
        packetLabel: '429 + 201',
        title: { vi: 'Người dùng nhận một 201 và hai 429', en: 'The user gets one 201 and two 429s' },
        detail: {
          vi: 'Đơn hàng đã tạo đúng một lần — may mắn hơn nhánh trước. Nhưng giao diện giờ phải đoán: 429 nghĩa là "đơn hỏng, thử lại" hay "đơn đã vào rồi"? Không phân biệt được, nên nhiều frontend hiển thị lỗi đỏ dù đơn đã thành công, khiến người dùng… bấm lại lần nữa.',
          en: 'Exactly one order was created — luckier than the previous branch. But the UI must now guess: does 429 mean "failed, retry" or "already accepted"? It cannot tell, so plenty of frontends show a red error even though the order succeeded — prompting the user to… click again.',
        },
        nodeStates: { user: 'error' },
        sfx: 'buzz',
      });
      return steps;
    }

    /* ── Nhánh idempotency ────────────────────────────────────── */
    steps.push({
      id: 'idem-store',
      edge: 'e_api_cache',
      kind: 'POST',
      duration: 1200,
      latencyMs: 1,
      packetLabel: 'lưu kết quả',
      alsoInFlight: [{ edge: 'e_edge_api', at: 0.5, label: '#2' }],
      title: { vi: 'Ghi KẾT QUẢ vào khoá, không chỉ ghi cờ', en: 'Store the RESULT under the key, not just a flag' },
      detail: {
        vi: 'Chi tiết hay bị làm ẩu: đừng chỉ lưu "đã xử lý", hãy lưu luôn phản hồi đầy đủ (mã đơn, số tiền, trạng thái). Nhờ vậy request lặp không những không trừ tiền lần nữa mà còn trả về ĐÚNG kết quả của lần đầu — client không phân biệt được đâu là lần thật, và đó chính là điều ta muốn.',
        en: 'The detail people skimp on: do not store just "processed", store the full response (order id, amount, status). That way a duplicate not only avoids a second charge but returns the EXACT result of the first — the client cannot tell which call was the real one, and that is precisely the goal.',
      },
      payload: { key: 'idem:9f2c1a7e-…-4b81', value: { status: 201, orderId: 'ord_88213', amount: 499000 }, ttl: 86400 },
      nodeStates: { cache: 'success' },
      sfx: 'click',
    });

    steps.push({
      id: 'idem-hit-2',
      edge: 'e_api_cache',
      kind: 'CACHE_HIT',
      duration: 1300,
      latencyMs: 1,
      packetLabel: 'khoá đã tồn tại',
      alsoInFlight: [{ edge: 'e_edge_api', at: 0.35, label: '#3' }],
      title: { vi: 'Request #2: khoá đã có → KHÔNG trừ tiền', en: 'Request #2: key exists → NO second charge' },
      detail: {
        vi: 'SET NX thất bại vì khoá đã tồn tại. Server không chạm tới CSDL, không tạo đơn, không trừ đồng nào — nó đọc kết quả đã lưu và trả về nguyên vẹn. Hãy để ý mũi tên trên sơ đồ: KHÔNG có đường nào đi xuống PostgreSQL ở bước này. Đó là toàn bộ điểm khác biệt.',
        en: 'The SET NX fails because the key is already there. The server never touches the database, never creates an order, never moves a đồng — it reads the stored result and returns it verbatim. Watch the arrows: nothing goes down to PostgreSQL in this step. That is the entire difference.',
      },
      payload: { orderId: 'ord_88213', amount: 499000, idempotentReplay: true },
      nodeStates: { cache: 'success', db: 'idle' },
      sfx: 'ping',
      log: { vi: 'SET NX → 0 (đã tồn tại) · trả lại kết quả đã lưu', en: 'SET NX → 0 (exists) · replaying stored result' },
    });

    steps.push({
      id: 'idem-hit-3',
      at: 'api',
      kind: 'CACHE_HIT',
      duration: 1200,
      latencyMs: 1,
      title: { vi: 'Request #3: y hệt — vẫn một đơn hàng', en: 'Request #3: same again — still one order' },
      detail: {
        vi: 'Bấm mười lần cũng vậy. Đây là định nghĩa của idempotent: thực hiện nhiều lần cho ra đúng kết quả như thực hiện một lần. Và lợi ích lớn hơn cả việc chặn spam click — nó khiến việc THỬ LẠI trở nên an toàn. Không có idempotency thì không dám tự động retry; mà không dám retry thì mọi lỗi mạng thoáng qua đều thành giao dịch thất bại.',
        en: 'Ten clicks would be the same. That is the definition of idempotent: performing it many times yields exactly the result of performing it once. And the payoff is bigger than blocking double-clicks — it makes RETRIES safe. Without idempotency you dare not auto-retry; and if you dare not retry, every transient network blip becomes a failed transaction.',
      },
      nodeStates: { api: 'success', db: 'idle' },
      sfx: 'ping',
      teachingNote: {
        vi: 'Chốt bài: idempotency không phải "tính năng chống spam", nó là điều kiện để hệ thống phân tán dám thử lại. Mọi cổng thanh toán nghiêm túc đều bắt buộc header này.',
        en: 'The closing line: idempotency is not an anti-spam feature, it is the precondition that lets a distributed system retry at all. Every serious payment gateway requires this header.',
      },
    });

    steps.push({
      id: 'idem-res',
      edge: 'e_user_edge',
      reverse: true,
      kind: 'RESPONSE',
      duration: 1300,
      status: 201,
      packetLabel: '3 × 201 (cùng 1 đơn)',
      title: { vi: 'Ba phản hồi giống hệt, một lần trừ tiền', en: 'Three identical responses, one charge' },
      detail: {
        vi: 'Cả ba lần bấm đều nhận 201 kèm cùng orderId ord_88213. Giao diện không cần xử lý gì đặc biệt, người dùng thấy đúng một đơn, ví bị trừ đúng 499.000đ. Ba chỗ cần khoá idempotency trong một dự án thật: tạo đơn/thanh toán, webhook từ đối tác, và mọi job trong hàng đợi (vì hàng đợi luôn là "ít nhất một lần").',
        en: 'All three clicks receive a 201 carrying the same orderId ord_88213. The UI needs no special handling, the user sees exactly one order, the wallet is down exactly 499,000₫. The three places a real project needs idempotency: order/payment creation, partner webhooks, and every queue job (because queues are always at-least-once).',
      },
      payload: { orderId: 'ord_88213', amount: 499000, walletAfter: 701000 },
      nodeStates: { user: 'success' },
      sfx: 'success',
    });

    return steps;
  },
};
