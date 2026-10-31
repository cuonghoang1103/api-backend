/** API Design · 5.2 — Thử lại: khi nào được thử, chờ bao lâu (lùi dần + jitter + Retry-After); số đo 50 client. */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Retries 1 — What the herd showed', kho: 'EASY', phut: 10,
  en: 'Facts from lesson 5.2 (50 clients after a 1-second outage, server capacity 10 requests per 100 ms, real runs).',
  vi: 'Những điều từ bài 5.2 (50 client sau sự cố 1 giây, năng lực server 10 request mỗi 100 ms, chạy thật).',
  cau: [
    q('c1', ['Which policy took longest (16.3 s)?', 'Chính sách nào mất lâu nhất (16,3 s)?'], ['Exponential backoff without jitter', 'Fixed retries every 500 ms', 'Exponential backoff with full jitter', 'No retries at all'], ['The clients stayed synchronised, so every wave of 50 hit the capacity limit again with ever longer gaps.', 'Các client vẫn đồng bộ nên đợt 50 nào cũng đụng trần, với khoảng trống ngày càng dài.']),
    q('c2', ['What did jitter change in the histogram?', 'Jitter thay đổi gì trong biểu đồ?'], ['After the first burst, arrivals spread out (34, 18, 13 … per 100 ms)', 'The first burst of 50 calls disappeared completely', 'The server answered every single request faster', 'Fewer of the 50 clients succeeded in the end'], ['A crowd that starts together still bursts once; jitter spreads the retries after it.', 'Đám đông bắt đầu cùng lúc vẫn tạo một đợt đầu; jitter rải các lần thử lại sau đó.']),
    q('c3', ['book-nokey.mjs timed out and did not retry. What happened on the server?', 'book-nokey.mjs hết giờ và không thử lại. Trên server chuyện gì đã xảy ra?'], ['bk_9 was created anyway', 'Nothing — the request was cancelled', 'The booking was created twice', 'The server returned 408'], ['A timeout only stops the client waiting; the server may have finished. That is why POST needs a key to be retried.', 'Timeout chỉ làm client thôi chờ; server có thể đã làm xong. Vì thế POST cần khoá mới được thử lại.']),
    q('c4', ['Why does fetchWithRetry retry a 409 only when it carries Retry-After?', 'Vì sao fetchWithRetry chỉ thử lại 409 khi có kèm Retry-After?'], ['409 + Retry-After means “still in progress, come back” (idempotency); other 409s are real conflicts', 'Because every 409 disappears on its own after a short wait', 'Because Retry-After is required on every 4xx response by HTTP', 'Because 409 means exactly the same as 429 Too Many Requests'], ['A BOOKING_CONFLICT will not go away by waiting; IDEMPOTENCY_IN_PROGRESS will.', 'BOOKING_CONFLICT không tự hết khi chờ; IDEMPOTENCY_IN_PROGRESS thì có.']),
  ],
  goiY: [['Look at the three histograms again.', 'Xem lại ba biểu đồ.'], ['A timeout is a client-side decision.', 'Timeout là quyết định phía client.']],
  loi: [['Thinking backoff alone fixes the herd.', 'Nghĩ rằng chỉ lùi dần là chữa được bầy đàn.'], ['Assuming a timed-out POST did nothing.', 'Cho rằng POST hết giờ là chưa làm gì.']],
  tns: [tn('thundering herd', 'hiệu ứng bầy đàn'), tn('full jitter', 'chờ ngẫu nhiên trong [0, mức lùi]')],
  kn: ['retries'],
});

function shouldRetry(method, outcome, hasKey, retryAfter) {
  const safe = ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS'].includes(method.toUpperCase()) || hasKey;
  if (!safe) return false;
  if (outcome === 'timeout' || outcome === 'network') return true;
  return [408, 429, 500, 502, 503, 504].includes(outcome) || (outcome === 409 && retryAfter !== undefined);
}
const E2 = jsBai({
  ten: 'Retries 2 — Write shouldRetry(method, outcome, hasKey, retryAfter)', kho: 'EASY', phut: 10,
  en: `<p>Decide whether a failed attempt may be retried. <code>outcome</code> is a status number or the string <code>'timeout'</code> / <code>'network'</code>.</p><ul>
<li>Only safe methods (GET, HEAD, PUT, DELETE, OPTIONS — any case) or a request with an Idempotency-Key (<code>hasKey</code>) may be retried at all</li>
<li>Retry timeouts, network errors, 408, 429, 500, 502, 503, 504</li>
<li>Retry 409 only when <code>retryAfter</code> is present (“still in progress”)</li>
<li>Everything else: no</li></ul>`,
  vi: `<p>Quyết định một lần thử hỏng có được thử lại không. <code>outcome</code> là số mã trạng thái hoặc chuỗi <code>'timeout'</code> / <code>'network'</code>.</p><ul>
<li>Chỉ phương thức an toàn (GET, HEAD, PUT, DELETE, OPTIONS — không phân biệt hoa thường) hoặc request có Idempotency-Key (<code>hasKey</code>) mới được thử lại</li>
<li>Thử lại khi hết giờ, lỗi mạng, 408, 429, 500, 502, 503, 504</li>
<li>Thử lại 409 chỉ khi có <code>retryAfter</code> (“còn đang xử lý”)</li>
<li>Còn lại: không</li></ul>`,
  dauVao: ['method, outcome (number | "timeout" | "network"), hasKey (boolean), retryAfter (string | undefined)', 'method, outcome (số | "timeout" | "network"), hasKey (boolean), retryAfter (chuỗi | undefined)'],
  dauRa: ['boolean', 'boolean'],
  goiY: [['First decide whether the request may be repeated at all.', 'Trước hết quyết định request có được lặp lại hay không.'], ['Then decide whether the failure is transient.', 'Rồi quyết định lỗi có phải tạm thời không.']],
  loi: [['Retrying a POST without a key after a timeout — may book twice.', 'Thử lại POST không khoá sau khi hết giờ — có thể đặt hai lần.'], ['Retrying 422 or 404.', 'Thử lại 422 hay 404.']],
  gt: ['Two questions in order: may I repeat it (idempotent method or key), and can waiting help (transient error). Both must be yes.', 'Hai câu hỏi theo thứ tự: tôi có được lặp lại nó không (phương thức idempotent hoặc có khoá), và chờ có giúp được không (lỗi tạm thời). Cả hai phải là có.'],
  kn: ['retries'],
  tns: [tn('transient error', 'lỗi tạm thời'), tn('safe to repeat', 'an toàn khi lặp lại')],
  dau: `/** may this failed attempt be retried? */
function shouldRetry(method, outcome, hasKey, retryAfter) {
  // Write your solution here
  return outcome === 'timeout' || outcome >= 500;
}
`,
  giai: '// Reference solution\n' + nguon(shouldRetry),
  cases: [
    { goi: goi('shouldRetry', 'GET', 503, false), moTa: ['GET /v2/labs during the outage', 'GET /v2/labs khi đang sự cố'] },
    { goi: goi('shouldRetry', 'POST', 'timeout', false), moTa: ['book-nokey.mjs', 'book-nokey.mjs'] },
    { goi: goi('shouldRetry', 'POST', 'timeout', true), an: true },
    { goi: goi('shouldRetry', 'post', 409, true, '1'), an: true },
    { goi: goi('shouldRetry', 'POST', 409, true), an: true },
    { goi: goi('shouldRetry', 'GET', 422, false), an: true },
    { goi: goi('shouldRetry', 'delete', 'network', false), an: true },
    { goi: goi('shouldRetry', 'PATCH', 503, false), an: true },
  ],
});

function retryDelay(attempt, opt, rand, retryAfterSec) {
  const exp = Math.min(opt.capMs, opt.baseMs * 2 ** (attempt - 1));
  let wait = opt.jitter ? Math.round(rand * exp) : exp;
  if (retryAfterSec !== undefined) wait = Math.max(wait, retryAfterSec * 1000);
  return wait;
}
const OPT = { baseMs: 200, capMs: 5000, jitter: true };
const E3 = jsBai({
  ten: 'Retries 3 — Write retryDelay(attempt, opt, rand, retryAfterSec)', kho: 'MEDIUM', phut: 12,
  en: `<p>Compute how long to wait after attempt number <code>attempt</code> (1, 2, 3 …) failed. <code>opt = { baseMs, capMs, jitter }</code>; <code>rand</code> is a random number in [0, 1) supplied by the caller (so the result is testable).</p><ul>
<li><code>exp = min(capMs, baseMs × 2<sup>attempt−1</sup>)</code></li>
<li>with jitter: <code>Math.round(rand × exp)</code> (“full jitter”); without: <code>exp</code></li>
<li>if <code>retryAfterSec</code> is given, wait <b>at least</b> that many seconds</li></ul>`,
  vi: `<p>Tính thời gian chờ sau khi lần thử thứ <code>attempt</code> (1, 2, 3 …) hỏng. <code>opt = { baseMs, capMs, jitter }</code>; <code>rand</code> là số ngẫu nhiên trong [0, 1) do bên gọi đưa vào (để kết quả kiểm được).</p><ul>
<li><code>exp = min(capMs, baseMs × 2<sup>attempt−1</sup>)</code></li>
<li>có jitter: <code>Math.round(rand × exp)</code> (“full jitter”); không có: <code>exp</code></li>
<li>nếu có <code>retryAfterSec</code>, chờ <b>ít nhất</b> chừng đó giây</li></ul>`,
  dauVao: ['attempt ≥ 1, opt, rand ∈ [0,1), retryAfterSec (number | undefined)', 'attempt ≥ 1, opt, rand ∈ [0,1), retryAfterSec (số | undefined)'],
  dauRa: ['milliseconds (number)', 'mili giây (số)'],
  goiY: [['2 ** (attempt - 1) doubles each time; Math.min applies the cap.', '2 ** (attempt - 1) gấp đôi mỗi lần; Math.min áp mức trần.'], ['Retry-After is in seconds; your wait is in milliseconds.', 'Retry-After tính bằng giây; thời gian chờ của bạn tính bằng mili giây.']],
  loi: [['2 ** attempt — the first wait becomes 400 ms.', '2 ** attempt — lần chờ đầu thành 400 ms.'], ['Letting jitter shorten a Retry-After.', 'Để jitter làm ngắn Retry-After.']],
  gt: ['The formula of fetchWithRetry in lesson 5.2: the cap keeps waits bounded, jitter de-synchronises clients, Retry-After is a lower bound the server asked for.', 'Công thức của fetchWithRetry ở bài 5.2: trần giữ thời gian chờ có giới hạn, jitter làm các client lệch nhịp, Retry-After là cận dưới mà server yêu cầu.'],
  kn: ['backoff', 'jitter'],
  tns: [tn('cap', 'mức trần'), tn('lower bound', 'cận dưới')],
  dau: `/** milliseconds to wait before the next attempt */
function retryDelay(attempt, opt, rand, retryAfterSec) {
  // Write your solution here
  return opt.baseMs * 2 ** attempt;
}
`,
  giai: '// Reference solution\n' + nguon(retryDelay),
  cases: [
    { goi: goi('retryDelay', 1, { ...OPT, jitter: false }, 0.5), moTa: ['First retry, no jitter', 'Lần thử lại đầu, không jitter'] },
    { goi: goi('retryDelay', 3, OPT, 0.5), moTa: ['Third attempt, rand 0.5', 'Lần thứ ba, rand 0,5'] },
    { goi: goi('retryDelay', 9, { ...OPT, jitter: false }, 0.9), an: true, moTa: ['The cap', 'Mức trần'] },
    { goi: goi('retryDelay', 2, OPT, 0.1, 12), an: true, moTa: ['429 with Retry-After: 12', '429 kèm Retry-After: 12'] },
    { goi: goi('retryDelay', 6, OPT, 0.99), an: true },
  ],
});

export default doiDau({ slug: 'api-5-2-retry', ten: '5.2 Retries, backoff and timeouts', khoa: KHOA, baiHoc: 'api-5-2-retry', de: [E1, E2, E3] });
