/** API Design · 10.5 — Gửi webhook: đăng ký an toàn (SSRF), ký Standard Webhooks, thử lại lùi dần có jitter, nhật ký giao (output thật bài 10.5). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Sending webhooks 1 — The sender’s contract', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 10.5: POST /v2/webhooks, the dispatcher and sender in src/worker.js, and a receiver that answered 503 three times.',
  vi: 'Những điều từ bài 10.5: POST /v2/webhooks, bộ điều phối và bộ gửi trong src/worker.js, và một bên nhận trả 503 ba lần.',
  cau: [
    q('c1', ['LabFlow checks a webhook URL when it is registered. Why does it check it again before every delivery?', 'LabFlow kiểm URL webhook lúc đăng ký. Vì sao nó kiểm lại trước mỗi lần gửi?'],
      ['DNS can change in between, so a public name may later point to an internal address', 'The subscriber may have rotated the secret since the subscription was created', 'The receiver may have moved from HTTP/1.1 to HTTP/2 since it was registered', 'Registration only checks the scheme; the port is checked at delivery time'],
      ['Webhooks make LabFlow the client inside its own network — the SSRF of 6.3. https://169.254.169.254/… was refused with 422 (private address).', 'Webhook biến LabFlow thành client ngay trong mạng của mình — SSRF của bài 6.3. https://169.254.169.254/… bị từ chối 422 (private address).']),
    q('c2', ['The message id is msg_&lt;event id&gt;_&lt;subscription id&gt; and is used as the BullMQ jobId. What does that buy?', 'Id thông điệp là msg_&lt;id sự kiện&gt;_&lt;id đăng ký&gt; và được dùng làm jobId của BullMQ. Được gì?'],
      ['If the dispatcher reads the same event twice, the second add is ignored', 'Receivers can decrypt the body with the id, so the payload stays private', 'Messages are delivered in the order of their ids, so no version is needed', 'The id tells the receiver which secret to use when it verifies the HMAC'],
      ['10.3 showed the stream delivers at least once. The same id is also sent as webhook-id on every retry — the receiver’s dedupe key.', 'Bài 10.3 cho thấy stream giao ít nhất một lần. Cùng id đó được gửi làm webhook-id ở mọi lần thử lại — khoá chống trùng của bên nhận.']),
    q('c3', ['The receiver answers 410 Gone. What does LabFlow do?', 'Bên nhận trả 410 Gone. LabFlow làm gì?'],
      ['Disables the subscription and stops retrying that message', 'Retries with backoff like any other 4xx, up to eight attempts', 'Deletes the subscription and every row of its delivery log', 'Follows the Location header of the 410 to the new endpoint'],
      ['410 means “stop sending” in the Standard Webhooks spec. 2xx = delivered; everything else is retried.', '410 nghĩa là “đừng gửi nữa” theo Standard Webhooks. 2xx = đã giao; mọi thứ khác được thử lại.']),
    q('c4', ['The sender uses fetch(…, { redirect: ’error’ }). Why not follow redirects?', 'Bộ gửi dùng fetch(…, { redirect: ’error’ }). Vì sao không đi theo chuyển hướng?'],
      ['A 302 to an internal address would bypass the SSRF checks done on the URL', 'Redirects double the latency and the receiver must answer within 5 seconds', 'Following a redirect would change the body bytes and break the signature', 'HTTP clients cannot follow redirects for POST requests with a JSON body'],
      ['A redirect counts as a failed attempt and is retried; the subscriber fixes the URL.', 'Chuyển hướng tính là một lần thử hỏng và được thử lại; bên đăng ký phải sửa URL.']),
  ],
  goiY: [['Every answer is a Chapter 5–6 rule seen from the other side.', 'Mỗi câu là một luật của Chương 5–6 nhìn từ phía bên kia.'], ['Now LabFlow is the client.', 'Giờ LabFlow là client.']],
  loi: [['Checking the URL only once, at registration.', 'Chỉ kiểm URL một lần, lúc đăng ký.'], ['Retrying a 410 forever.', 'Thử lại 410 mãi mãi.']],
  tns: [tn('webhook', 'request API gửi tới URL bên đăng ký'), tn('SSRF', 'lừa server gửi request vào mạng nội bộ'), tn('dispatcher', 'bộ điều phối')],
  kn: ['webhooks', 'security'],
});

function prepare(msgId, nowMs, body, macs) {
  const ts = Math.floor(nowMs / 1000);                                  // GIÂY, không phải mili giây
  return {
    toSign: `${msgId}.${ts}.${body}`,                                    // đúng chuỗi byte sẽ gửi đi
    headers: {
      'webhook-id': msgId,
      'webhook-timestamp': String(ts),
      'webhook-signature': macs.map((m) => `v1,${m}`).join(' '),         // nhiều chữ ký cách nhau DẤU CÁCH (xoay khoá)
    },
  };
}
const BODY = '{"specversion":"1.0","type":"labflow.booking.created.v1","source":"/labflow/v2","subject":"bk_1","data":{"id":"bk_1","status":"PENDING","version":1}}';
const E2 = jsBai({
  ten: 'Sending webhooks 2 — Write prepare(msgId, nowMs, body, macs): the Standard Webhooks headers', kho: 'EASY', phut: 10,
  en: `<p>Before sending, LabFlow builds the string that the HMAC is computed over and the three headers. Return <code>{ toSign, headers }</code>:</p><ul><li><code>toSign</code> = <code>msgId + "." + timestamp + "." + body</code>, where <code>timestamp</code> is <code>nowMs</code> in whole <b>seconds</b> (rounded down) and <code>body</code> is used exactly as given;</li><li><code>headers["webhook-id"]</code> = <code>msgId</code>; <code>headers["webhook-timestamp"]</code> = the timestamp as a string;</li><li><code>headers["webhook-signature"]</code> = every MAC in <code>macs</code> (base64, already computed — one per active secret) prefixed with <code>v1,</code> and separated by a single space.</li></ul>`,
  vi: `<p>Trước khi gửi, LabFlow dựng chuỗi để tính HMAC và ba header. Trả <code>{ toSign, headers }</code>:</p><ul><li><code>toSign</code> = <code>msgId + "." + timestamp + "." + body</code>, với <code>timestamp</code> là <code>nowMs</code> tính bằng <b>giây</b> nguyên (làm tròn xuống) và <code>body</code> dùng đúng như được cho;</li><li><code>headers["webhook-id"]</code> = <code>msgId</code>; <code>headers["webhook-timestamp"]</code> = timestamp dạng chuỗi;</li><li><code>headers["webhook-signature"]</code> = mọi MAC trong <code>macs</code> (base64, đã tính sẵn — mỗi khoá đang dùng một cái) có tiền tố <code>v1,</code>, cách nhau một dấu cách.</li></ul>`,
  dauVao: ['msgId — string; nowMs — number; body — string (the exact bytes); macs — string[]', 'msgId — chuỗi; nowMs — số; body — chuỗi (đúng chuỗi byte); macs — string[]'],
  dauRa: ['{ toSign: string, headers: { "webhook-id", "webhook-timestamp", "webhook-signature" } }', '{ toSign: string, headers: { "webhook-id", "webhook-timestamp", "webhook-signature" } }'],
  goiY: [['Math.floor(nowMs / 1000) gives Unix seconds.', 'Math.floor(nowMs / 1000) cho số giây Unix.'], ['macs.map(…).join(" ") — a space, not a comma: the comma is already inside “v1,…”.', 'macs.map(…).join(" ") — dấu cách, không phải dấu phẩy: dấu phẩy đã nằm trong “v1,…”.']],
  loi: [['Using milliseconds — every receiver rejects it as outside the 5-minute window.', 'Dùng mili giây — mọi bên nhận từ chối vì nằm ngoài cửa sổ 5 phút.'], ['JSON.stringify(body) on a string that is already JSON: the quotes change the signed bytes.', 'JSON.stringify(body) trên một chuỗi đã là JSON: dấu ngoặc kép làm đổi chuỗi byte được ký.']],
  gt: ['Real headers of lesson 10.5: webhook-id msg_1793496727230-0_wh_mvx5n6sx, webhook-timestamp 1793496727, webhook-signature v1,U77XGBo4UR95…. The timestamp is inside the signed string, so a replayed request cannot refresh it; two signatures let receivers holding either secret accept the same delivery during a rotation.', 'Header thật của bài 10.5: webhook-id msg_1793496727230-0_wh_mvx5n6sx, webhook-timestamp 1793496727, webhook-signature v1,U77XGBo4UR95…. Timestamp nằm trong chuỗi được ký, nên request phát lại không làm mới được nó; hai chữ ký cho bên nhận giữ khoá nào cũng chấp nhận cùng một lần giao trong lúc xoay khoá.'],
  kn: ['webhooks', 'signatures'],
  tns: [tn('HMAC', 'mã băm có khoá'), tn('secret rotation', 'xoay khoá bí mật')],
  dau: `/** the string to sign and the Standard Webhooks headers */
function prepare(msgId, nowMs, body, macs) {
  // Write your solution here
  return {
    toSign: msgId + '.' + nowMs + '.' + JSON.stringify(body),
    headers: { 'webhook-id': msgId, 'webhook-timestamp': String(nowMs), 'webhook-signature': 'v1,' + macs.join(',') },
  };
}
`,
  giai: '// Reference solution\n' + nguon(prepare),
  cases: [
    { goi: goi('prepare', 'msg_1793496727230-0_wh_mvx5n6sx', 1793496727412, BODY, ['U77XGBo4UR95…']), moTa: ['The delivery of lesson 10.5', 'Lần giao của bài 10.5'] },
    { goi: goi('prepare', 'msg_1_wh_a', 1793496727999, '{}', ['OLD+sig=', 'NEW+sig=']), moTa: ['During a rotation: two signatures', 'Trong lúc xoay khoá: hai chữ ký'] },
    { goi: goi('prepare', 'msg_9_wh_b', 1000, '{"labName":"Phòng Lab Mạng"}', ['abc=']), an: true },
    { goi: goi('prepare', 'msg_2_wh_c', 1793496727000, 'not json at all', []), an: true },
  ],
});

function nextStep(status, attempt, maxAttempts, baseMs, jitter) {
  if (status !== null && status >= 200 && status < 300) return { action: 'done' };
  if (status === 410) return { action: 'disable' };                         // "đừng gửi nữa" ⇒ tắt đăng ký
  if (attempt >= maxAttempts) return { action: 'give-up' };                  // 3xx, 4xx, 5xx, timeout: thử lại nếu còn lượt
  const raw = baseMs * 2 ** (attempt - 1);
  return { action: 'retry', minMs: Math.round(raw * (1 - jitter)), maxMs: raw };   // jitter rút ngắn tới `jitter` phần
}
const E3 = jsBai({
  ten: 'Sending webhooks 3 — Write nextStep(status, attempt, maxAttempts, baseMs, jitter)', kho: 'MEDIUM', phut: 15,
  en: `<p>After attempt number <code>attempt</code> (1-based) of a delivery, decide what the sender does. <code>status</code> is the receiver’s HTTP status, or <code>null</code> for a timeout, a network error or a redirect (redirects are not followed).</p><ul><li><code>2xx</code> ⇒ <code>{ action: "done" }</code>;</li><li><code>410</code> ⇒ <code>{ action: "disable" }</code> (no more attempts);</li><li>anything else and <code>attempt ≥ maxAttempts</code> ⇒ <code>{ action: "give-up" }</code>;</li><li>otherwise ⇒ <code>{ action: "retry", minMs, maxMs }</code>: exponential backoff <code>raw = baseMs · 2^(attempt−1)</code>, shortened at random by up to <code>jitter</code> of it — so <code>maxMs = raw</code>, <code>minMs = round(raw · (1 − jitter))</code>.</li></ul>`,
  vi: `<p>Sau lần thử thứ <code>attempt</code> (đếm từ 1) của một lần giao, quyết định bộ gửi làm gì. <code>status</code> là mã HTTP của bên nhận, hoặc <code>null</code> khi quá giờ, lỗi mạng hay bị chuyển hướng (không đi theo chuyển hướng).</p><ul><li><code>2xx</code> ⇒ <code>{ action: "done" }</code>;</li><li><code>410</code> ⇒ <code>{ action: "disable" }</code> (không thử nữa);</li><li>mọi thứ khác và <code>attempt ≥ maxAttempts</code> ⇒ <code>{ action: "give-up" }</code>;</li><li>ngược lại ⇒ <code>{ action: "retry", minMs, maxMs }</code>: lùi dần <code>raw = baseMs · 2^(attempt−1)</code>, rút ngắn ngẫu nhiên tới <code>jitter</code> phần của nó — nên <code>maxMs = raw</code>, <code>minMs = round(raw · (1 − jitter))</code>.</li></ul>`,
  dauVao: ['status — number | null; attempt, maxAttempts — integers ≥ 1; baseMs — number; jitter — 0…1', 'status — số | null; attempt, maxAttempts — số nguyên ≥ 1; baseMs — số; jitter — 0…1'],
  dauRa: ['{ action: "done" | "disable" | "give-up" } | { action: "retry", minMs, maxMs }', '{ action: "done" | "disable" | "give-up" } | { action: "retry", minMs, maxMs }'],
  goiY: [['Decide the action first; only "retry" needs the backoff numbers.', 'Quyết định hành động trước; chỉ "retry" mới cần số lùi dần.'], ['null &gt;= 200 is false in JavaScript, but test null explicitly anyway.', 'null &gt;= 200 là false trong JavaScript, nhưng vẫn nên xét null rõ ràng.']],
  loi: [['Treating every 4xx as final — a 404 while the receiver redeploys is worth retrying; only 410 says stop.', 'Coi mọi 4xx là cuối — 404 khi bên nhận đang deploy vẫn đáng thử lại; chỉ 410 mới bảo dừng.'], ['Adding jitter on top of the delay instead of shortening it: the schedule drifts past the promised hour.', 'Cộng jitter thêm vào thay vì rút ngắn: lịch thử trôi quá một giờ đã hứa.']],
  gt: ['Demo of 10.5 (base 1 s, jitter 50%): 503, 503, 503 then 204 with gaps of 0.8, 1.8 and 2.7 s — inside [0.5, 1], [1, 2], [2, 4] s. Production: base 30 s, 8 attempts ⇒ gaps of up to 30 s, 1, 2, 4, 8, 16, 32 min, within about an hour.', 'Bản thử của bài 10.5 (gốc 1 s, jitter 50%): 503, 503, 503 rồi 204 với khoảng 0,8, 1,8 và 2,7 s — nằm trong [0,5; 1], [1; 2], [2; 4] s. Thật: gốc 30 s, 8 lần ⇒ khoảng tới 30 s, 1, 2, 4, 8, 16, 32 phút, trong khoảng một giờ.'],
  kn: ['webhooks', 'retries'],
  tns: [tn('jitter', 'độ ngẫu nhiên trong thời gian chờ'), tn('give up', 'bỏ cuộc sau lần cuối')],
  dau: `/** what does the sender do after an attempt? */
function nextStep(status, attempt, maxAttempts, baseMs, jitter) {
  // Write your solution here
  if (status >= 200 && status < 300) return { action: 'done' };
  if (status >= 400 && status < 500) return { action: 'disable' };
  return { action: 'retry', minMs: baseMs * attempt, maxMs: baseMs * attempt + baseMs * jitter };
}
`,
  giai: '// Reference solution\n' + nguon(nextStep),
  cases: [
    { goi: goi('nextStep', 503, 1, 8, 1000, 0.5), moTa: ['First 503 of the demo', '503 đầu tiên của bản thử'] },
    { goi: goi('nextStep', 204, 4, 8, 1000, 0.5), moTa: ['Fourth attempt: 204', 'Lần thứ tư: 204'] },
    { goi: goi('nextStep', 503, 3, 8, 1000, 0.5), an: true },
    { goi: goi('nextStep', 410, 1, 8, 30000, 0.5), an: true },
    { goi: goi('nextStep', null, 5, 5, 2000, 0.5), an: true },
    { goi: goi('nextStep', 404, 7, 8, 30000, 0.5), an: true },
    { goi: goi('nextStep', 302, 2, 8, 30000, 0.2), an: true },
    { goi: goi('nextStep', 202, 1, 8, 30000, 0.5), an: true },
  ],
});

function urlProblem(url, allowLocal) {
  const m = /^([a-zA-Z][a-zA-Z0-9+.-]*):\/\/([^/?#]*)/.exec(url);
  if (!m) return 'not a URL';
  const scheme = m[1].toLowerCase();
  let auth = m[2];
  auth = auth.slice(auth.lastIndexOf('@') + 1);                          // bỏ "user:pass@" — host nằm SAU dấu @
  let host;
  if (auth.startsWith('[')) {                                             // IPv6: [::1]:4005
    const end = auth.indexOf(']');
    if (end === -1) return 'not a URL';
    host = auth.slice(1, end).toLowerCase();
  } else host = auth.replace(/:\d*$/, '').toLowerCase();                 // bỏ cổng
  if (host === '') return 'not a URL';
  if (allowLocal && (host === 'localhost' || host === '127.0.0.1')) return null;   // CHỈ để học trên máy mình
  if (scheme !== 'https') return 'https only';
  const V4 = [/^127\./, /^10\./, /^192\.168\./, /^172\.(1[6-9]|2\d|3[01])\./, /^169\.254\./, /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, /^0\./];
  const V6 = [/^::1$/, /^f[cd]/, /^fe80:/, /^::ffff:(127|10|192\.168|169\.254)\./];
  const isV4 = /^\d{1,3}(\.\d{1,3}){3}$/.test(host);
  if (host === 'localhost') return 'private address';
  if (isV4 && V4.some((r) => r.test(host))) return 'private address';
  if (host.includes(':') && V6.some((r) => r.test(host))) return 'private address';
  return null;                                                            // tên miền: kiểm địa chỉ phân giải lúc GỬI
}
const E4 = jsBai({
  ten: 'Sending webhooks 4 — Write urlProblem(url, allowLocal): SSRF checks without new URL()', kho: 'HARD', phut: 25,
  en: `<p>Check a webhook URL at registration with regular expressions only (no <code>URL</code> object in this sandbox). Return <code>null</code> if it is acceptable, otherwise the reason:</p><ol><li>not <code>scheme://authority…</code> (or an empty host) ⇒ <code>"not a URL"</code>;</li><li>the host is what comes after the last <code>@</code> of the authority, without the port; an IPv6 host is written in brackets (<code>[::1]:4005</code>); compare hosts and schemes case-insensitively;</li><li>if <code>allowLocal</code> and the host is <code>localhost</code> or <code>127.0.0.1</code> ⇒ <code>null</code> (any scheme — course mode only);</li><li>scheme not <code>https</code> ⇒ <code>"https only"</code>;</li><li><code>localhost</code>, a dotted IPv4 address in 127/8, 10/8, 192.168/16, 172.16–31, 169.254/16, 100.64–127 (CGNAT) or 0/8, or an IPv6 address <code>::1</code>, <code>fc…</code>/<code>fd…</code>, <code>fe80:…</code>, <code>::ffff:</code> + a private IPv4 ⇒ <code>"private address"</code>;</li><li>anything else (including names like <code>10.example.com</code> — LabFlow checks the resolved address at delivery) ⇒ <code>null</code>.</li></ol>`,
  vi: `<p>Kiểm URL webhook lúc đăng ký chỉ bằng biểu thức chính quy (hộp cát này không có đối tượng <code>URL</code>). Trả <code>null</code> nếu chấp nhận được, ngược lại là lý do:</p><ol><li>không có dạng <code>scheme://authority…</code> (hoặc host rỗng) ⇒ <code>"not a URL"</code>;</li><li>host là phần sau dấu <code>@</code> cuối cùng của authority, bỏ cổng; host IPv6 viết trong ngoặc vuông (<code>[::1]:4005</code>); so host và scheme không phân biệt hoa thường;</li><li>nếu <code>allowLocal</code> và host là <code>localhost</code> hoặc <code>127.0.0.1</code> ⇒ <code>null</code> (scheme nào cũng được — chỉ chế độ học);</li><li>scheme khác <code>https</code> ⇒ <code>"https only"</code>;</li><li><code>localhost</code>, địa chỉ IPv4 dạng chấm trong 127/8, 10/8, 192.168/16, 172.16–31, 169.254/16, 100.64–127 (CGNAT) hay 0/8, hoặc địa chỉ IPv6 <code>::1</code>, <code>fc…</code>/<code>fd…</code>, <code>fe80:…</code>, <code>::ffff:</code> + IPv4 riêng ⇒ <code>"private address"</code>;</li><li>còn lại (kể cả tên như <code>10.example.com</code> — LabFlow kiểm địa chỉ phân giải lúc gửi) ⇒ <code>null</code>.</li></ol>`,
  dauVao: ['url — string; allowLocal — boolean', 'url — chuỗi; allowLocal — boolean'],
  dauRa: ['null | "not a URL" | "https only" | "private address"', 'null | "not a URL" | "https only" | "private address"'],
  rangBuoc: [['No URL, fetch or DNS: they do not exist in the grader’s sandbox.', 'Không URL, fetch hay DNS: chúng không có trong hộp cát của máy chấm.']],
  goiY: [['/^([a-z][a-z0-9+.-]*):\\/\\/([^/?#]*)/i gives the scheme and the authority.', '/^([a-z][a-z0-9+.-]*):\\/\\/([^/?#]*)/i cho scheme và authority.'], ['Test the IPv4 ranges only when the host is all digits and dots — otherwise /^10\\./ matches 10.example.com.', 'Chỉ thử dải IPv4 khi host toàn số và dấu chấm — nếu không /^10\\./ khớp cả 10.example.com.']],
  loi: [['Reading the host before the @: https://dept.example.edu.vn@10.0.0.5/ goes to 10.0.0.5.', 'Đọc host ở trước dấu @: https://dept.example.edu.vn@10.0.0.5/ đi tới 10.0.0.5.'], ['172.32.0.1 is public: the private block is 172.16.0.0/12, i.e. 172.16–172.31.', '172.32.0.1 là công khai: khối riêng là 172.16.0.0/12, tức 172.16–172.31.']],
  gt: ['Measured in 10.5: http://localhost:4005/hooks ⇒ 422 https only; https://169.254.169.254/latest/meta-data (the cloud metadata address) ⇒ 422 private address. LabFlow’s assertPublicUrl runs the same address list again before every delivery, because DNS can change after registration.', 'Đo ở bài 10.5: http://localhost:4005/hooks ⇒ 422 https only; https://169.254.169.254/latest/meta-data (địa chỉ metadata của cloud) ⇒ 422 private address. assertPublicUrl của LabFlow chạy lại cùng danh sách địa chỉ trước mỗi lần gửi, vì DNS có thể đổi sau khi đăng ký.'],
  kn: ['webhooks', 'security', 'SSRF'],
  tns: [tn('userinfo', 'phần user:pass@ trong URL'), tn('link-local', 'dải 169.254.x.x — nơi cloud đặt metadata'), tn('CGNAT', 'dải 100.64.0.0/10 của nhà mạng')],
  dau: `/** why may LabFlow not POST to this URL? (null = it may) */
function urlProblem(url, allowLocal) {
  // Write your solution here
  if (!url.startsWith('https://')) return 'https only';
  if (/169\\.254|localhost/.test(url)) return 'private address';
  return null;
}
`,
  giai: '// Reference solution\n' + nguon(urlProblem),
  cases: [
    { goi: goi('urlProblem', 'http://localhost:4005/hooks', false), moTa: ['Lesson 10.5: plain http', 'Bài 10.5: http thường'] },
    { goi: goi('urlProblem', 'https://169.254.169.254/latest/meta-data', false), moTa: ['Lesson 10.5: cloud metadata', 'Bài 10.5: metadata của cloud'] },
    { goi: goi('urlProblem', 'http://localhost:4005/hooks', true), moTa: ['LABFLOW_WEBHOOK_ALLOW_LOCAL=1', 'LABFLOW_WEBHOOK_ALLOW_LOCAL=1'] },
    { goi: goi('urlProblem', 'https://dept.example.edu.vn/hooks', false), an: true },
    { goi: goi('urlProblem', 'https://dept.example.edu.vn@10.0.0.5/hooks', false), an: true },
    { goi: goi('urlProblem', 'https://172.20.1.1:8443/x', false), an: true },
    { goi: goi('urlProblem', 'https://172.32.0.1/x', false), an: true },
    { goi: goi('urlProblem', 'https://[::1]:4005/hooks', false), an: true },
    { goi: goi('urlProblem', 'HTTPS://100.64.0.1/hooks', false), an: true },
    { goi: goi('urlProblem', 'https://10.example.com/hooks', false), an: true },
    { goi: goi('urlProblem', 'ftp://example.com/hooks', false), an: true },
    { goi: goi('urlProblem', 'example.com/hooks', false), an: true },
    { goi: goi('urlProblem', 'https://192.168.1.10/hooks', true), an: true },
    { goi: goi('urlProblem', 'https://LOCALHOST/hooks', false), an: true },
  ],
});

export default doiDau({ slug: 'api-10-4-webhook', ten: '10.5 Sending webhooks: signatures, retries and a delivery log', khoa: KHOA, baiHoc: 'api-10-4-webhook', de: [E1, E2, E3, E4] });
