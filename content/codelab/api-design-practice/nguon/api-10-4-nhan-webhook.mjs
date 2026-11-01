/** API Design · 10.6 — Nhận webhook: body thô, chống giả và phát lại, trả lời trước làm sau, giữ đúng trạng thái theo version (output thật bài 10.6). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Receiving webhooks 1 — Each habit switched off once', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 10.6: webhooks/receiver.mjs on port 4005 with VERIFY, DEDUPE, ASYNC and ORDER switched off one at a time.',
  vi: 'Những điều từ bài 10.6: webhooks/receiver.mjs ở cổng 4005, tắt lần lượt VERIFY, DEDUPE, ASYNC và ORDER.',
  cau: [
    q('c1', ['A receiver uses express.json() and checks the signature over JSON.stringify(req.body). Which sender breaks it?', 'Bên nhận dùng express.json() rồi kiểm chữ ký trên JSON.stringify(req.body). Bên gửi nào làm nó hỏng?'],
      ['A Python sender: json.dumps escapes “ò” as \\u00f2 and adds spaces, so the bytes differ', 'Any sender that uses HTTP/2, because headers arrive in lower case and change the HMAC', 'A Node sender with a body larger than 100 KB, because express.json() truncates it', 'None: JSON.stringify always gives back the exact bytes the sender originally signed'],
      ['Same data, different bytes, different signature — and the error only shows up for Vietnamese lab names. Verify the raw body (express.raw).', 'Cùng dữ liệu, khác byte, khác chữ ký — và lỗi chỉ hiện với tên phòng tiếng Việt. Kiểm trên body thô (express.raw).']),
    q('c2', ['An attacker replays a captured delivery unchanged 1 s later (tolerance 10 s). What happens?', 'Kẻ tấn công phát lại y nguyên một lần giao bắt được, 1 s sau (cửa sổ 10 s). Chuyện gì xảy ra?'],
      ['The signature is valid, the webhook-id was already seen ⇒ 200 duplicate, no second effect', 'The signature is now invalid because the timestamp has changed ⇒ 401 bad signature', 'It is processed again, because a valid signature proves the request is genuine', 'The receiver answers 409 Conflict so that the sender knows it was a replay'],
      ['Changed body ⇒ 401; same request 11 s later ⇒ 401 (outside the window). The window limits how long a capture is useful; the id store covers replays inside it.', 'Sửa body ⇒ 401; cùng request 11 s sau ⇒ 401 (ngoài cửa sổ). Cửa sổ giới hạn thời gian một bản bắt được còn dùng được; kho id che phần phát lại trong cửa sổ.']),
    q('c3', ['The receiver’s work takes 3 s and LabFlow waits 2 s. What did answering 202 first (ASYNC=1) change?', 'Việc của bên nhận mất 3 s và LabFlow chờ 2 s. Trả 202 trước (ASYNC=1) đã thay đổi gì?'],
      ['1 attempt in 21 ms and 1 email, instead of 5 timeouts and 5 emails', '5 attempts but only 1 email, because the 202 marks the message as seen', '2 attempts and 1 email, the same as turning deduplication on alone', 'Nothing: LabFlow still counts the delivery as failed after 2 seconds'],
      ['Dedupe alone gave 2 attempts and 1 email, but the sender still logged a timeout. In production “afterwards” means a queue, not setImmediate.', 'Chỉ chống trùng thì còn 2 lần và 1 email, nhưng bên gửi vẫn ghi một lần quá giờ. Thật thì “làm sau” nghĩa là hàng đợi, không phải setImmediate.']),
  ],
  goiY: [['The signature covers bytes, not objects.', 'Chữ ký phủ byte, không phủ object.'], ['A sender that times out retries — even if you finished.', 'Bên gửi quá giờ sẽ thử lại — kể cả khi bạn đã làm xong.']],
  loi: [['Doing slow work before answering.', 'Làm việc chậm trước khi trả lời.'], ['Re-serialising the parsed body to verify it.', 'Dựng lại body đã parse để kiểm chữ ký.']],
  tns: [tn('raw body', 'body thô — đúng chuỗi byte nhận được'), tn('replay attack', 'phát lại request bắt được'), tn('acknowledge first', 'nhận trước, làm sau')],
  kn: ['webhooks', 'security'],
});

function checkHeaders(headers, nowSec, toleranceSec) {
  const id = headers['webhook-id'], ts = headers['webhook-timestamp'], sig = headers['webhook-signature'];
  if (!id || !ts || !sig) return { ok: false, reason: 'missing headers' };
  if (!/^\d+$/.test(ts)) return { ok: false, reason: 'bad timestamp' };
  if (Math.abs(nowSec - Number(ts)) > toleranceSec) return { ok: false, reason: 'timestamp outside tolerance' };   // chống phát lại, cả hai phía
  const signatures = [];
  for (const part of sig.split(' ')) {                         // nhiều chữ ký cách nhau dấu cách (đang xoay khoá)
    const comma = part.indexOf(',');
    if (comma > 0 && part.slice(0, comma) === 'v1' && part.length > comma + 1) signatures.push(part.slice(comma + 1));
  }
  if (!signatures.length) return { ok: false, reason: 'no v1 signature' };
  return { ok: true, id, timestamp: Number(ts), signatures };
}
const H = (ts, sig = 'v1,U77XGBo4UR95') => ({ 'content-type': 'application/json', 'webhook-id': 'msg_1793496727230-0_wh_mvx5n6sx', 'webhook-timestamp': ts, 'webhook-signature': sig });
const E2 = jsBai({
  ten: 'Receiving webhooks 2 — Write checkHeaders(headers, nowSec, toleranceSec)', kho: 'MEDIUM', phut: 15,
  en: `<p>The first checks of the receiver, before any HMAC. <code>headers</code> has lower-case names (as in Node). In this order:</p><ol><li><code>webhook-id</code>, <code>webhook-timestamp</code> or <code>webhook-signature</code> missing or empty ⇒ <code>{ ok: false, reason: "missing headers" }</code>;</li><li>timestamp not all digits ⇒ <code>{ ok: false, reason: "bad timestamp" }</code>;</li><li><code>|nowSec − timestamp| &gt; toleranceSec</code> (too old <b>or</b> too far in the future) ⇒ <code>{ ok: false, reason: "timestamp outside tolerance" }</code>;</li><li>the signature header is a space-separated list of <code>version,signature</code>; keep the non-empty signatures of version <code>v1</code> only (in order). None ⇒ <code>{ ok: false, reason: "no v1 signature" }</code>;</li><li>otherwise <code>{ ok: true, id, timestamp (number), signatures }</code>.</li></ol>`,
  vi: `<p>Các bước kiểm đầu tiên của bên nhận, trước mọi HMAC. <code>headers</code> có tên chữ thường (như trong Node). Theo thứ tự:</p><ol><li>thiếu hoặc rỗng <code>webhook-id</code>, <code>webhook-timestamp</code> hay <code>webhook-signature</code> ⇒ <code>{ ok: false, reason: "missing headers" }</code>;</li><li>timestamp không toàn chữ số ⇒ <code>{ ok: false, reason: "bad timestamp" }</code>;</li><li><code>|nowSec − timestamp| &gt; toleranceSec</code> (quá cũ <b>hoặc</b> quá xa trong tương lai) ⇒ <code>{ ok: false, reason: "timestamp outside tolerance" }</code>;</li><li>header chữ ký là danh sách <code>phiên bản,chữ ký</code> cách nhau dấu cách; chỉ giữ chữ ký khác rỗng của phiên bản <code>v1</code> (đúng thứ tự). Không có cái nào ⇒ <code>{ ok: false, reason: "no v1 signature" }</code>;</li><li>còn lại <code>{ ok: true, id, timestamp (số), signatures }</code>.</li></ol>`,
  dauVao: ['headers — object; nowSec, toleranceSec — numbers', 'headers — object; nowSec, toleranceSec — số'],
  dauRa: ['{ ok: false, reason } | { ok: true, id, timestamp, signatures }', '{ ok: false, reason } | { ok: true, id, timestamp, signatures }'],
  goiY: [['Math.abs covers both directions of the window.', 'Math.abs phủ cả hai chiều của cửa sổ.'], ['Split on " " first, then each part at its first comma — base64 never contains a comma or a space.', 'Tách theo " " trước, rồi tách mỗi phần ở dấu phẩy đầu tiên — base64 không bao giờ chứa dấu phẩy hay dấu cách.']],
  loi: [['Checking only nowSec − ts &gt; tolerance: a timestamp from next year passes for a whole year.', 'Chỉ xét nowSec − ts &gt; tolerance: timestamp của năm sau qua được cả năm.'], ['Splitting the header on "," — two signatures become one broken list.', 'Tách header theo "," — hai chữ ký thành một danh sách hỏng.']],
  gt: ['The timestamp is signed, so an attacker cannot refresh it; with TOLERANCE_SEC=10 the same capture was accepted as a duplicate 1 s later and refused 11 s later. Stripe’s libraries default to 5 minutes (300 s).', 'Timestamp được ký, nên kẻ tấn công không làm mới được; với TOLERANCE_SEC=10 cùng bản bắt được được nhận là trùng sau 1 s và bị từ chối sau 11 s. Thư viện của Stripe mặc định 5 phút (300 s).'],
  kn: ['webhooks', 'security'],
  tns: [tn('tolerance window', 'cửa sổ chấp nhận'), tn('signature version', 'phiên bản chữ ký')],
  dau: `/** first checks on an incoming webhook */
function checkHeaders(headers, nowSec, toleranceSec) {
  // Write your solution here
  const ts = Number(headers['webhook-timestamp']);
  if (nowSec - ts > toleranceSec) return { ok: false, reason: 'timestamp outside tolerance' };
  return { ok: true, id: headers['webhook-id'], timestamp: ts, signatures: [headers['webhook-signature'].slice(3)] };
}
`,
  giai: '// Reference solution\n' + nguon(checkHeaders),
  cases: [
    { goi: goi('checkHeaders', H('1793496727'), 1793496728, 10), moTa: ['Replayed 1 s later', 'Phát lại sau 1 s'] },
    { goi: goi('checkHeaders', H('1793496727'), 1793496738, 10), moTa: ['Replayed 11 s later', 'Phát lại sau 11 s'] },
    { goi: goi('checkHeaders', H('1793496727', 'v1,OLD+sig= v1,NEW+sig='), 1793496727, 300), an: true },
    { goi: goi('checkHeaders', H('1793496727', 'v2,abc= v1,def='), 1793496737, 10), an: true },
    { goi: goi('checkHeaders', H('1893496727'), 1793496727, 300), an: true },
    { goi: goi('checkHeaders', { 'webhook-id': 'msg_1', 'webhook-signature': 'v1,abc=' }, 1793496727, 300), an: true },
    { goi: goi('checkHeaders', H('1793496727000'), 1793496727, 300), an: true },
    { goi: goi('checkHeaders', H('1793496727', 'v1, v0,abc='), 1793496727, 300), an: true },
  ],
});

function safeEqual(a, b) {
  if (a.length !== b.length) return false;                     // độ dài không bí mật: chữ ký luôn dài 44 ký tự
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);   // KHÔNG dừng ở chỗ khác đầu tiên
  return diff === 0;
}
function verifyAny(expected, signatures) {
  let ok = false;
  for (const s of signatures) if (safeEqual(s, expected)) ok = true;   // xoay khoá: cái nào khớp cũng được
  return ok;
}
const E3 = jsBai({
  ten: 'Receiving webhooks 3 — Write safeEqual(a, b) and verifyAny(expected, signatures)', kho: 'MEDIUM', phut: 15,
  en: `<p>The receiver computed the <code>expected</code> signature (base64) and parsed the header into <code>signatures</code>. Write two functions:</p><ul><li><code>safeEqual(a, b)</code> — <code>true</code> iff the two strings are equal. Different lengths ⇒ <code>false</code> at once (lengths are not secret). For equal lengths, compare <b>every</b> character and combine the differences (with <code>^</code> and <code>|=</code>), so the time does not reveal how many leading characters matched. <code>timingSafeEqual</code> does not exist in this sandbox.</li><li><code>verifyAny(expected, signatures)</code> — <code>true</code> if any signature is <code>safeEqual</code> to <code>expected</code> (during a key rotation the sender sends two).</li></ul>`,
  vi: `<p>Bên nhận đã tính chữ ký <code>expected</code> (base64) và tách header thành <code>signatures</code>. Viết hai hàm:</p><ul><li><code>safeEqual(a, b)</code> — <code>true</code> khi và chỉ khi hai chuỗi bằng nhau. Khác độ dài ⇒ <code>false</code> ngay (độ dài không phải bí mật). Cùng độ dài thì so <b>mọi</b> ký tự và gộp các chỗ khác (bằng <code>^</code> và <code>|=</code>), để thời gian chạy không lộ ra bao nhiêu ký tự đầu đã khớp. Hộp cát này không có <code>timingSafeEqual</code>.</li><li><code>verifyAny(expected, signatures)</code> — <code>true</code> nếu có chữ ký nào <code>safeEqual</code> với <code>expected</code> (khi xoay khoá bên gửi gửi hai cái).</li></ul>`,
  dauVao: ['a, b, expected — strings; signatures — string[]', 'a, b, expected — chuỗi; signatures — string[]'],
  dauRa: ['true | false', 'true | false'],
  yc: [['Return the value; do not print it.', 'Trả về giá trị, đừng in ra.'], ['Do not return early inside the character loop of safeEqual.', 'Không return sớm bên trong vòng lặp ký tự của safeEqual.']],
  goiY: [['a.charCodeAt(i) ^ b.charCodeAt(i) is 0 only when the characters are equal.', 'a.charCodeAt(i) ^ b.charCodeAt(i) bằng 0 chỉ khi hai ký tự bằng nhau.'], ['diff |= … keeps any difference; check diff === 0 after the loop.', 'diff |= … giữ lại mọi chỗ khác; xét diff === 0 sau vòng lặp.']],
  loi: [['a === b: correct answer, but it stops at the first different character — an attacker can measure that, byte by byte.', 'a === b: đúng kết quả, nhưng dừng ở ký tự khác đầu tiên — kẻ tấn công đo được điều đó, từng byte một.'], ['Checking only the first signature: during a rotation, receivers holding the new secret reject every delivery.', 'Chỉ xét chữ ký đầu tiên: trong lúc xoay khoá, bên nhận giữ khoá mới từ chối mọi lần giao.']],
  gt: ['LabFlow’s verify() decodes both sides and calls crypto.timingSafeEqual after checking the length (it throws on different lengths). In 10.6, the tampered body was refused 401 bad signature.', 'verify() của LabFlow giải mã hai phía rồi gọi crypto.timingSafeEqual sau khi kiểm độ dài (nó ném lỗi khi khác độ dài). Ở bài 10.6, body bị sửa bị từ chối 401 bad signature.'],
  kn: ['webhooks', 'security'],
  tns: [tn('constant-time compare', 'so sánh thời gian hằng'), tn('timing attack', 'tấn công đo thời gian')],
  dau: `/** compare two strings without leaking where they differ */
function safeEqual(a, b) {
  // Write your solution here
  return a === b;
}

/** does any of the received signatures match? */
function verifyAny(expected, signatures) {
  return signatures.length > 0 && safeEqual(signatures[0], expected);
}
`,
  giai: '// Reference solution\n' + nguon(safeEqual, verifyAny),
  cases: [
    { goi: goi('verifyAny', 'ZLrEsD7a9yl=', ['ZLrEsD7a9yl=']), moTa: ['One signature, it matches', 'Một chữ ký, khớp'] },
    { goi: goi('verifyAny', 'NEW+sig=', ['OLD+sig=', 'NEW+sig=']), moTa: ['Rotation: the second one matches', 'Xoay khoá: cái thứ hai khớp'] },
    { goi: goi('verifyAny', 'ZLrEsD7a9yl=', ['wAoADndHaYw=']), an: true },
    { goi: goi('verifyAny', 'abc=', []), an: true },
    { goi: goi('safeEqual', 'abc', 'abcd'), an: true },
    { goi: goi('safeEqual', 'v1,abc', 'v1,abd'), an: true },
    { goi: goi('safeEqual', '', ''), an: true },
  ],
  kiemThem: [
    { kiem: 'ma-nguon', moTa: { en: 'Combines the differences with ^ / |= instead of stopping at the first one', vi: 'Gộp các chỗ khác bằng ^ / |= thay vì dừng ở chỗ khác đầu tiên' }, tep: 'answer.js', khop: '\\^|\\|=' },
    { kiem: 'ma-nguon', moTa: { en: 'Written by hand (no timingSafeEqual, crypto or require)', vi: 'Tự viết (không timingSafeEqual, crypto hay require)' }, tep: 'answer.js', khop: 'timingSafeEqual|crypto|require\\s*\\(', phuDinh: true },
  ],
});

function receive(deliveries) {
  const seen = new Set(), bookings = {};
  const stats = { rejected: 0, duplicates: 0, stale: 0, processed: 0 };
  const answers = [];
  for (const d of deliveries) {
    if (!d.signatureOk) { stats.rejected++; answers.push(401); continue; }    // giả mạo: KHÔNG ghi id vào kho
    if (seen.has(d.id)) { stats.duplicates++; answers.push(200); continue; }  // trùng: vẫn 2xx để bên gửi dừng
    seen.add(d.id);
    const b = d.event.data;
    if (b && typeof b.id === 'string' && b.id.startsWith('bk_')) {
      const cur = bookings[b.id];
      if (cur && cur.version >= b.version) { stats.stale++; answers.push(204); continue; }   // tin cũ tới muộn ⇒ bỏ
      bookings[b.id] = { status: b.status, version: b.version };
    }
    stats.processed++; answers.push(204);
  }
  return { answers, bookings, stats };
}
const D = (id, type, data, signatureOk = true) => ({ id, signatureOk, event: { type, data } });
const CREATED = D('msg_1793495998551-0_wh_mvx57', 'labflow.booking.created.v1', { id: 'bk_1', status: 'PENDING', version: 1 });
const CANCELLED = D('msg_1793495998569-0_wh_mvx57', 'labflow.booking.cancelled.v1', { id: 'bk_1', status: 'CANCELLED', version: 2 });
const E4 = jsBai({
  ten: 'Receiving webhooks 4 — Write receive(deliveries): the receiver’s final state', kho: 'HARD', phut: 20,
  en: `<p>Replay webhooks/receiver.mjs (VERIFY, DEDUPE and ORDER on) over a list of deliveries <code>{ id, signatureOk, event: { type, data } }</code>, in arrival order. For each delivery:</p><ol><li><code>signatureOk</code> false ⇒ answer <code>401</code>, <code>rejected++</code> — and do <b>not</b> remember its id;</li><li>id already seen ⇒ <code>200</code>, <code>duplicates++</code>;</li><li>otherwise remember the id. If <code>data.id</code> starts with <code>bk_</code>: when the stored booking has <code>version ≥ data.version</code> ⇒ <code>stale++</code>, answer <code>204</code>, state unchanged; else store <code>{ status, version }</code>. Every other new delivery ⇒ <code>processed++</code>, answer <code>204</code>.</li></ol><p>Return <code>{ answers, bookings, stats: { rejected, duplicates, stale, processed } }</code>.</p>`,
  vi: `<p>Dựng lại webhooks/receiver.mjs (bật VERIFY, DEDUPE và ORDER) trên danh sách lần giao <code>{ id, signatureOk, event: { type, data } }</code>, theo thứ tự tới. Với mỗi lần giao:</p><ol><li><code>signatureOk</code> sai ⇒ trả <code>401</code>, <code>rejected++</code> — và <b>không</b> ghi nhớ id của nó;</li><li>id đã thấy ⇒ <code>200</code>, <code>duplicates++</code>;</li><li>ngược lại ghi nhớ id. Nếu <code>data.id</code> bắt đầu bằng <code>bk_</code>: khi lượt đặt đang lưu có <code>version ≥ data.version</code> ⇒ <code>stale++</code>, trả <code>204</code>, giữ nguyên trạng thái; ngược lại lưu <code>{ status, version }</code>. Mọi lần giao mới khác ⇒ <code>processed++</code>, trả <code>204</code>.</li></ol><p>Trả <code>{ answers, bookings, stats: { rejected, duplicates, stale, processed } }</code>.</p>`,
  dauVao: ['deliveries — [{ id, signatureOk, event: { type, data } }]', 'deliveries — [{ id, signatureOk, event: { type, data } }]'],
  dauRa: ['{ answers: number[], bookings: { [id]: { status, version } }, stats }', '{ answers: number[], bookings: { [id]: { status, version } }, stats }'],
  goiY: [['Three early exits in this order: bad signature, duplicate, stale.', 'Ba lối ra sớm theo thứ tự: chữ ký sai, trùng, cũ.'], ['A stale event is still answered 2xx — the sender must stop retrying it.', 'Sự kiện cũ vẫn được trả 2xx — bên gửi phải thôi thử lại nó.']],
  loi: [['Remembering the id of a forged request: the genuine delivery with that id is then dropped as a “duplicate”.', 'Ghi nhớ id của request giả: lần giao thật mang id đó bị bỏ như “trùng”.'], ['Last write wins: the late booking.created turns a cancelled booking back into PENDING.', 'Ghi sau thắng: booking.created tới muộn biến lượt đã huỷ thành PENDING lại.']],
  gt: ['Measured in 10.6 (FAIL_FIRST=1): cancelled v2 arrived before created v1. With ORDER=0 the receiver ended with PENDING — the department believes the lab is booked when it is free; with the version check it kept CANCELLED and counted 1 stale. Timestamps are a weak substitute (two events can share a second); a per-object version is exact.', 'Đo ở bài 10.6 (FAIL_FIRST=1): cancelled v2 tới trước created v1. Với ORDER=0 bên nhận kết thúc ở PENDING — phòng đào tạo tưởng phòng đang được đặt trong khi nó trống; có kiểm version thì giữ CANCELLED và đếm 1 stale. Timestamp là thay thế yếu (hai sự kiện có thể cùng một giây); version theo từng đối tượng mới chính xác.'],
  kn: ['webhooks', 'idempotency', 'ordering'],
  tns: [tn('stale event', 'sự kiện cũ tới muộn'), tn('dedupe store', 'kho id đã xử lý')],
  dau: `/** replay the receiver over a list of deliveries */
function receive(deliveries) {
  // Write your solution here
  const bookings = {};
  const stats = { rejected: 0, duplicates: 0, stale: 0, processed: 0 };
  const answers = [];
  for (const d of deliveries) {
    const b = d.event.data;
    if (b && b.id) bookings[b.id] = { status: b.status, version: b.version };
    stats.processed++;
    answers.push(204);
  }
  return { answers, bookings, stats };
}
`,
  giai: '// Reference solution\n' + nguon(receive),
  cases: [
    { goi: goi('receive', [CANCELLED, CREATED]), moTa: ['Lesson 10.6: the cancellation arrived first', 'Bài 10.6: lệnh huỷ tới trước'] },
    { goi: goi('receive', [CREATED, CREATED, CANCELLED]), moTa: ['A retry of the same message', 'Thử lại cùng một thông điệp'] },
    { goi: goi('receive', [{ ...CREATED, signatureOk: false }, CREATED, CREATED]), an: true },
    { goi: goi('receive', [D('msg_r1', 'labflow.report.ready.v1', { jobId: 'job_2', result: '/v2/jobs/job_2/result' }), CANCELLED, D('msg_x', 'labflow.booking.cancelled.v1', { id: 'bk_1', status: 'CANCELLED', version: 2 })]), an: true },
    { goi: goi('receive', []), an: true },
    { goi: goi('receive', [CREATED, D('msg_c3', 'labflow.booking.checked_in.v1', { id: 'bk_1', status: 'CHECKED_IN', version: 3 }), CANCELLED, D('msg_b2', 'labflow.booking.created.v1', { id: 'bk_2', status: 'PENDING', version: 1 })]), an: true },
  ],
});

export default doiDau({ slug: 'api-10-4-nhan-webhook', ten: '10.6 Receiving webhooks: raw bodies, replays, fast answers and order', khoa: KHOA, baiHoc: 'api-10-4-nhan-webhook', de: [E1, E2, E3, E4] });
