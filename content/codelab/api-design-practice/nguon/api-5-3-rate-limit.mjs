/** API Design · 5.3 — Giới hạn tần suất: xô token, header RateLimit (draft-11), địa chỉ client sau proxy (trust proxy). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Rate limits 1 — Buckets and proxies', kho: 'EASY', phut: 10,
  en: 'Facts from lesson 5.3 (LabFlow token bucket, real runs through a proxy that behaves like nginx).',
  vi: 'Những điều từ bài 5.3 (xô token của LabFlow, chạy thật qua một proxy hành xử như nginx).',
  cau: [
    q('c1', ['Lan’s 6th booking within a minute got 429 with Retry-After: 12. Bin then booked once and got …', 'Lượt đặt thứ 6 trong một phút của cô Lan nhận 429 kèm Retry-After: 12. Ngay sau đó Bin đặt một lần và nhận …'], ['201 with RateLimit r=4 — his own bucket', '429 — the limit is global', '503 — the server is overloaded', '201 with RateLimit r=0'], ['bookingLimit keys on req.user.id; every user has a separate bucket.', 'bookingLimit dùng khoá req.user.id; mỗi người dùng có xô riêng.']),
    q('c2', ['With trust proxy OFF behind the proxy, user B’s very first request got 429. Why?', 'Tắt trust proxy khi đứng sau proxy, request đầu tiên của người B nhận 429. Vì sao?'], ['The app saw every user as the proxy’s address, so all shared one bucket', 'B had already sent too many requests a minute earlier', 'The proxy itself returned 429 before reaching LabFlow', 'Express blocks every unknown IP address by default'], ['req.ip was ::ffff:127.0.0.1 for everyone; A had used up that bucket.', 'req.ip là ::ffff:127.0.0.1 với mọi người; A đã dùng hết xô đó.']),
    q('c3', ['With trust proxy = true, the attacker sent a different fake X-Forwarded-For each time. Result?', 'Với trust proxy = true, kẻ tấn công gửi X-Forwarded-For giả khác nhau mỗi lần. Kết quả?'], ['8/8 requests passed — never limited', 'The 6th request got 429', 'All requests got 400', 'The proxy removed the fake header'], ['Express trusted the leftmost entry, written by the client; each fake address got a fresh bucket.', 'Express tin mục ngoài cùng bên trái, do client viết; mỗi địa chỉ giả có một xô mới.']),
    q('c4', ['Why does LabFlow put idempotent() BEFORE bookingLimit?', 'Vì sao LabFlow đặt idempotent() TRƯỚC bookingLimit?'], ['A replay is answered before the limiter, so retries of the same intention cost no token', 'Because the limiter needs the stored response to compute its headers', 'Because Express runs the middleware of a route from right to left', 'So that every replay is counted twice and abusers are slowed down'], ['The lab transcript shows it: the lost report used one token, its replay none.', 'Transcript của lab cho thấy: báo hỏng bị mất dùng một token, lần phát lại thì không.']),
  ],
  goiY: [['Which key does each limiter use?', 'Mỗi bộ giới hạn dùng khoá gì?'], ['Who wrote each entry of X-Forwarded-For?', 'Ai viết từng mục của X-Forwarded-For?']],
  loi: [['trust proxy: true “because we have a proxy”.', 'trust proxy: true “vì chúng ta có proxy”.'], ['One global bucket for everyone.', 'Một xô chung cho tất cả.']],
  tns: [tn('token bucket', 'xô token'), tn('X-Forwarded-For', 'header chuỗi địa chỉ qua các proxy')],
  kn: ['rate limiting'],
});

function take(bucket, nowSec, capacity, windowSec) {
  const perSec = capacity / windowSec;
  const tokens = Math.min(capacity, bucket.tokens + (nowSec - bucket.at) * perSec);
  if (tokens < 1) {
    return { allowed: false, remaining: 0, retryAfter: Math.ceil((1 - tokens) / perSec), bucket: { tokens, at: nowSec } };
  }
  return { allowed: true, remaining: Math.floor(tokens - 1), retryAfter: 0, bucket: { tokens: tokens - 1, at: nowSec } };
}
const run = (times) => `(function () { var b = { tokens: 5, at: 0 }, out = []; ${JSON.stringify(times)}.forEach(function (t) { var r = take(b, t, 5, 60); b = r.bucket; out.push(r.allowed ? 'ok r=' + r.remaining : '429 wait ' + r.retryAfter); }); return out; })()`;
const E2 = jsBai({
  ten: 'Rate limits 2 — Write take(bucket, nowSec, capacity, windowSec): one token bucket step', kho: 'MEDIUM', phut: 15,
  en: `<p>One request against a token bucket. <code>bucket = { tokens, at }</code> (tokens may be fractional; <code>at</code> in seconds). Refill <code>capacity / windowSec</code> tokens per second since <code>at</code>, never above <code>capacity</code>. Then:</p><ul>
<li>at least 1 token ⇒ <code>{ allowed: true, remaining: floor(tokens − 1), retryAfter: 0, bucket: { tokens: tokens − 1, at: nowSec } }</code></li>
<li>otherwise ⇒ <code>{ allowed: false, remaining: 0, retryAfter: ceil(seconds until one token), bucket: { tokens, at: nowSec } }</code></li></ul>
<p>Return a new bucket; do not modify the argument. The tests replay LabFlow’s booking limit (5 per 60 s).</p>`,
  vi: `<p>Một request vào xô token. <code>bucket = { tokens, at }</code> (tokens có thể lẻ; <code>at</code> tính bằng giây). Rót thêm <code>capacity / windowSec</code> token mỗi giây kể từ <code>at</code>, không quá <code>capacity</code>. Rồi:</p><ul>
<li>có ít nhất 1 token ⇒ <code>{ allowed: true, remaining: floor(tokens − 1), retryAfter: 0, bucket: { tokens: tokens − 1, at: nowSec } }</code></li>
<li>ngược lại ⇒ <code>{ allowed: false, remaining: 0, retryAfter: ceil(số giây tới khi có một token), bucket: { tokens, at: nowSec } }</code></li></ul>
<p>Trả xô mới; không sửa đối số. Các kiểm phát lại giới hạn đặt phòng của LabFlow (5 lần mỗi 60 giây).</p>`,
  dauVao: ['bucket { tokens, at }, nowSec, capacity, windowSec', 'bucket { tokens, at }, nowSec, capacity, windowSec'],
  dauRa: ['{ allowed, remaining, retryAfter, bucket }', '{ allowed, remaining, retryAfter, bucket }'],
  goiY: [['Refill first: tokens + (now − at) × perSec, capped.', 'Rót trước: tokens + (now − at) × perSec, có trần.'], ['Seconds until one token: (1 − tokens) / perSec, rounded up.', 'Số giây tới khi có một token: (1 − tokens) / perSec, làm tròn lên.']],
  loi: [['Forgetting the cap — a quiet hour gives a burst of 60.', 'Quên mức trần — một giờ yên lặng cho một đợt dồn 60.'], ['Not updating at when refused — the refill is counted twice next time.', 'Không cập nhật at khi từ chối — lần sau tính rót hai lần.']],
  gt: ['Six bookings at t=0 give ok r=4 … ok r=0, then 429 wait 12 — exactly LabFlow’s headers in lesson 5.3.', 'Sáu lượt đặt lúc t=0 cho ok r=4 … ok r=0, rồi 429 wait 12 — đúng các header của LabFlow ở bài 5.3.'],
  kn: ['rate limiting', 'token bucket'],
  tns: [tn('refill rate', 'tốc độ rót'), tn('burst', 'đợt dồn')],
  dau: `/** one request against a token bucket */
function take(bucket, nowSec, capacity, windowSec) {
  // Write your solution here
  if (bucket.tokens < 1) return { allowed: false, remaining: 0, retryAfter: windowSec, bucket };
  bucket.tokens -= 1;
  return { allowed: true, remaining: bucket.tokens, retryAfter: 0, bucket };
}
`,
  giai: '// Reference solution\n' + nguon(take),
  cases: [
    { goi: run([0, 0, 0, 0, 0, 0]), moTa: ['Six bookings at once (lesson 5.3)', 'Sáu lượt đặt cùng lúc (bài 5.3)'] },
    { goi: run([0, 0, 0, 0, 0, 0, 12, 12]), moTa: ['Twelve seconds later', 'Mười hai giây sau'] },
    { goi: run([0, 0, 0, 0, 0, 3600, 3600, 3600, 3600, 3600, 3600]), an: true, moTa: ['An hour later: still at most 5', 'Một giờ sau: vẫn tối đa 5'] },
    { goi: `(function () { var b = { tokens: 1, at: 0 }; take(b, 0, 5, 60); return b; })()`, an: true, moTa: ['The argument is not modified', 'Đối số không bị sửa'] },
    { goi: run([0, 0, 0, 0, 0, 6, 30]), an: true },
  ],
});

function clientIp(remote, xff, trust) {
  const chain = [...(xff ? xff.split(',').map((s) => s.trim()) : []), remote];   // nearest hop last
  if (trust === false) return remote;
  if (trust === true) return chain[0];
  return chain[Math.max(0, chain.length - 1 - trust)];
}
const E3 = jsBai({
  ten: 'Rate limits 3 — Write clientIp(remote, xff, trust): what Express calls req.ip', kho: 'MEDIUM', phut: 12,
  en: `<p>Build the address chain: the entries of <code>X-Forwarded-For</code> (comma-separated, trimmed, oldest first) followed by <code>remote</code> (the address of the connection itself). Then:</p><ul>
<li><code>trust === false</code> ⇒ <code>remote</code></li>
<li><code>trust === true</code> ⇒ the first (leftmost) entry of the chain — whatever the client wrote</li>
<li><code>trust = n</code> (number of trusted proxy hops) ⇒ skip <code>n</code> entries from the right and return the next one; if the chain is shorter, return its first entry</li></ul>`,
  vi: `<p>Dựng chuỗi địa chỉ: các mục của <code>X-Forwarded-For</code> (cách nhau dấu phẩy, bỏ khoảng trắng, cũ nhất trước) rồi tới <code>remote</code> (địa chỉ của chính kết nối). Sau đó:</p><ul>
<li><code>trust === false</code> ⇒ <code>remote</code></li>
<li><code>trust === true</code> ⇒ mục đầu tiên (bên trái nhất) của chuỗi — bất kể client đã viết gì</li>
<li><code>trust = n</code> (số chặng proxy được tin) ⇒ bỏ <code>n</code> mục từ bên phải và trả mục kế tiếp; nếu chuỗi ngắn hơn, trả mục đầu tiên</li></ul>`,
  dauVao: ['remote — string; xff — string | undefined; trust — false | true | number', 'remote — chuỗi; xff — chuỗi | undefined; trust — false | true | số'],
  dauRa: ['the client address (string)', 'địa chỉ client (chuỗi)'],
  goiY: [['Put remote at the END of the chain: it is the nearest hop.', 'Đặt remote ở CUỐI chuỗi: nó là chặng gần nhất.'], ['trust = 1 behind one nginx returns what nginx appended.', 'trust = 1 sau một nginx trả đúng thứ nginx đã nối thêm.']],
  loi: [['Taking the leftmost entry with a hop count — spoofable.', 'Lấy mục trái nhất khi có số chặng — giả được.'], ['Forgetting that remote is part of the chain.', 'Quên rằng remote là một phần của chuỗi.']],
  gt: ['The proxy experiment of 5.3: with "6.6.6.6, 203.0.113.10" from 127.0.0.1, false ⇒ 127.0.0.1, true ⇒ 6.6.6.6 (spoofed), 1 ⇒ 203.0.113.10 (correct).', 'Thí nghiệm proxy của 5.3: với "6.6.6.6, 203.0.113.10" từ 127.0.0.1, false ⇒ 127.0.0.1, true ⇒ 6.6.6.6 (bị giả), 1 ⇒ 203.0.113.10 (đúng).'],
  kn: ['proxies', 'rate limiting'],
  tns: [tn('hop', 'chặng (một proxy)'), tn('spoofing', 'giả mạo')],
  dau: `/** the client address after trusting n proxy hops */
function clientIp(remote, xff, trust) {
  // Write your solution here
  return xff ? xff.split(',')[0].trim() : remote;
}
`,
  giai: '// Reference solution\n' + nguon(clientIp),
  cases: [
    { goi: goi('clientIp', '127.0.0.1', '6.6.6.6, 203.0.113.10', 1), moTa: ['trust proxy = 1 (lesson 5.3)', 'trust proxy = 1 (bài 5.3)'] },
    { goi: goi('clientIp', '127.0.0.1', '6.6.6.6, 203.0.113.10', true), moTa: ['trust proxy = true', 'trust proxy = true'] },
    { goi: goi('clientIp', '127.0.0.1', '203.0.113.10', false), an: true },
    { goi: goi('clientIp', '10.0.0.2', '6.6.6.6, 198.51.100.7, 10.0.0.1', 2), an: true, moTa: ['Load balancer + nginx', 'Load balancer + nginx'] },
    { goi: `clientIp('127.0.0.1', undefined, 1)`, an: true },
    { goi: goi('clientIp', '127.0.0.1', '198.51.100.7', 5), an: true },
  ],
});

export default doiDau({ slug: 'api-5-3-rate-limit', ten: '5.3 Rate limiting and quotas', khoa: KHOA, baiHoc: 'api-5-3-rate-limit', de: [E1, E2, E3] });
