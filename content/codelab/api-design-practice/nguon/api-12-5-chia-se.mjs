/** API Design · 12.4 — Hai instance, một sự thật: xô token Lua, idempotency, ETag từ sequence, UPDATE có điều kiện (output thật bài 12.4). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Shared state 1 — Two instances, measured', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 12.4: rate limits, idempotency keys, list ETags and Redis outages across instances A and B.',
  vi: 'Những điều từ bài 12.4: rate limit, khoá idempotency, ETag danh sách và sự cố Redis qua hai instance A và B.',
  cau: [
    q('c1', ['Why is the shared token bucket one Lua script instead of GET, compute, SET from Node?', 'Vì sao xô token dùng chung là một script Lua thay vì GET, tính, SET từ Node?'],
      ['Redis runs a script atomically, so two instances cannot interleave between read and write', 'Lua is faster than JavaScript, so the bucket refills more precisely', 'GET and SET are not allowed on hash keys in Redis 8', 'Scripts are persisted to disk, so the buckets survive a restart'],
      ['Read–compute–write from two processes is the same race as counting bookings; inside the script it is one step. The clock is Redis’s TIME.', 'Đọc–tính–ghi từ hai tiến trình là đúng cuộc đua của việc đếm lượt đặt; trong script nó là một bước. Đồng hồ là TIME của Redis.']),
    q('c2', ['Two managers PATCH dev_1 with the same If-Match through two instances, 20 trials, check-then-write version. Result?', 'Hai quản lý PATCH dev_1 với cùng If-Match qua hai instance, 20 lần thử, bản kiểm-rồi-ghi. Kết quả?'],
      ['11 trials lost an edit (both 200); with the condition inside the UPDATE, 0 of 20', '0 lost edits, because PostgreSQL serialises updates of the same row', '20 lost edits, because If-Match is ignored when there are two instances', '20 trials answered 412 to both managers, so nobody could edit'],
      ['UPDATE … WHERE id = $1 AND version = $2: zero rows means someone was first ⇒ 412.', 'UPDATE … WHERE id = $1 AND version = $2: 0 dòng nghĩa là có người tới trước ⇒ 412.']),
    q('c3', ['Redis is stopped. What did LabFlow answer to seven bookings in a row from Lan?', 'Redis bị tắt. LabFlow trả gì cho bảy lượt đặt liên tiếp của Cô Lan?'],
      ['7 × 201 — the limiter fails open to each instance’s local bucket', '5 × 201 then 2 × 429 — the limit is remembered in PostgreSQL', '7 × 503 — no write is allowed without the rate limiter', '7 × 500 — the Redis client throws on every command'],
      ['A limiter must not take the site down; the cache bypasses, tickets 503, /ready stays 200, events wait in the outbox.', 'Bộ giới hạn không được tự làm sập trang; cache bỏ qua, vé 503, /ready vẫn 200, sự kiện chờ trong outbox.']),
    q('c4', ['Why is nextval(’bookings_list_version’) called AFTER the booking’s COMMIT?', 'Vì sao nextval(’bookings_list_version’) được gọi SAU khi lượt đặt COMMIT?'],
      ['Bumping first lets a reader cache the old list under the new version — a 304 that hides the booking', 'Sequences cannot be called inside a transaction in PostgreSQL 18', 'nextval inside the transaction would lock the version row for everyone', 'The ETag must be computed from the committed row’s created_at'],
      ['After commit, the worst case is one extra 200, never a stale 304.', 'Sau commit, tệ nhất chỉ thêm một lần 200, không bao giờ 304 sai.']),
  ],
  goiY: [['Ask what happens between “check” and “write”.', 'Hỏi: chuyện gì xảy ra giữa “kiểm” và “ghi”.'], ['Decide per feature what “Redis down” means.', 'Quyết định theo từng tính năng “Redis sập” nghĩa là gì.']],
  loi: [['Rate limiting with GET + SET from two processes.', 'Giới hạn tần suất bằng GET + SET từ hai tiến trình.'], ['Failing closed: one cache outage becomes a full outage.', 'Đóng cửa khi hỏng: một sự cố cache thành sập toàn bộ.']],
  tns: [tn('atomic script', 'script nguyên tử'), tn('fail open', 'mở cửa khi hỏng'), tn('lost update', 'mất cập nhật')],
  kn: ['concurrency', 'redis'],
});

function takeToken(bucket, nowS, cap, rate) {
  const tokens0 = bucket ? bucket.tokens : cap;
  const at = bucket ? bucket.at : nowS;
  let tokens = Math.min(cap, tokens0 + (nowS - at) * rate);
  let ok = false;
  if (tokens >= 1) { tokens -= 1; ok = true; }
  return { ok, bucket: { tokens: Math.round(tokens * 1000) / 1000, at: nowS } };
}
const E2 = jsBai({
  ten: 'Shared state 2 — Write takeToken(bucket, nowS, cap, rate): the Lua script in JS', kho: 'MEDIUM', phut: 12,
  en: `<p>Port the 12.4 script. <code>bucket</code> is <code>null</code> (new: full) or <code>{ tokens, at }</code>. Refill <code>(nowS − at) × rate</code>, never above <code>cap</code>. If at least one token is left, take it (<code>ok: true</code>). Return <code>{ ok, bucket: { tokens, at: nowS } }</code> with <code>tokens</code> rounded to 3 decimals.</p>`,
  vi: `<p>Chép sang JS script của bài 12.4. <code>bucket</code> là <code>null</code> (mới: đầy) hoặc <code>{ tokens, at }</code>. Rót thêm <code>(nowS − at) × rate</code>, không vượt <code>cap</code>. Còn ít nhất một token thì lấy (<code>ok: true</code>). Trả <code>{ ok, bucket: { tokens, at: nowS } }</code> với <code>tokens</code> làm tròn 3 chữ số lẻ.</p>`,
  dauVao: ['bucket — {tokens, at} | null; nowS, cap, rate — numbers', 'bucket — {tokens, at} | null; nowS, cap, rate — số'], dauRa: ['{ ok, bucket }', '{ ok, bucket }'],
  goiY: [['A new bucket starts full, at nowS.', 'Xô mới bắt đầu đầy, tại nowS.'], ['Always store the new time, even when refused.', 'Luôn lưu thời điểm mới, kể cả khi từ chối.']],
  loi: [['Refilling above capacity after a long pause.', 'Rót quá dung tích sau một quãng nghỉ dài.'], ['Taking a token when only 0.5 is left.', 'Lấy token khi chỉ còn 0,5.']],
  gt: ['booking: cap 5, rate 5/60 per second. Five quick bookings empty it; the sixth waits about 12 s for one token — the t=12 in RateLimit (12.4).', 'booking: cap 5, rate 5/60 mỗi giây. Năm lượt nhanh làm cạn xô; lượt thứ sáu chờ chừng 12 s để có một token — chính t=12 trong RateLimit (12.4).'],
  kn: ['rate limiting'], tns: [tn('token bucket', 'xô token'), tn('refill rate', 'tốc độ rót')],
  dau: `/** one request against the bucket */
function takeToken(bucket, nowS, cap, rate) {
  // Write your solution here
  const tokens = bucket ? bucket.tokens + (nowS - bucket.at) * rate : cap;
  return tokens >= 1 ? { ok: true, bucket: { tokens: tokens - 1, at: nowS } } : { ok: false, bucket };
}
`,
  giai: '// Reference solution\n' + nguon(takeToken),
  cases: [
    { goi: goi('takeToken', null, 1000, 5, 5 / 60), moTa: ['New bucket', 'Xô mới'] },
    { goi: goi('takeToken', { tokens: 0.2, at: 1000 }, 1005, 5, 5 / 60), moTa: ['Not enough yet', 'Chưa đủ'] },
    { goi: goi('takeToken', { tokens: 0.2, at: 1000 }, 1010, 5, 5 / 60), an: true },
    { goi: goi('takeToken', { tokens: 4, at: 1000 }, 9000, 5, 5 / 60), an: true },
  ],
});

function conditionalUpdate(rows, id, expected, patch) {
  const r = rows.find((x) => x.id === id);
  if (!r) return { status: 404, rows };
  if (expected !== undefined && r.version !== expected) return { status: 412, currentETag: `"${id}-v${r.version}"`, rows };
  const next = { ...r, ...patch, version: r.version + 1 };
  return { status: 200, etag: `"${id}-v${next.version}"`, rows: rows.map((x) => (x.id === id ? next : x)) };
}
const DEV = [{ id: 'dev_1', note: null, version: 3 }, { id: 'dev_2', note: 'ok', version: 1 }];
const E3 = jsBai({
  ten: 'Shared state 3 — Write conditionalUpdate(rows, id, expected, patch)', kho: 'HARD', phut: 15,
  en: `<p>Model <code>UPDATE devices SET …, version = version + 1 WHERE id = $1 AND ($2 IS NULL OR version = $2)</code>. Unknown id ⇒ <code>{ status: 404, rows }</code>. If <code>expected</code> is given and differs ⇒ <code>{ status: 412, currentETag: '"dev_1-v3"', rows }</code>. Otherwise apply <code>patch</code>, bump the version and return <code>{ status: 200, etag, rows }</code> with a <b>new</b> array.</p>`,
  vi: `<p>Mô phỏng <code>UPDATE devices SET …, version = version + 1 WHERE id = $1 AND ($2 IS NULL OR version = $2)</code>. Id lạ ⇒ <code>{ status: 404, rows }</code>. Có <code>expected</code> mà khác ⇒ <code>{ status: 412, currentETag: '"dev_1-v3"', rows }</code>. Ngược lại áp <code>patch</code>, tăng version và trả <code>{ status: 200, etag, rows }</code> với mảng <b>mới</b>.</p>`,
  dauVao: ['rows — {id, version, …}[]; id — string; expected — number | undefined; patch — object', 'rows — {id, version, …}[]; id — chuỗi; expected — số | undefined; patch — object'],
  dauRa: ['{ status, etag?, currentETag?, rows }', '{ status, etag?, currentETag?, rows }'],
  goiY: [['No If-Match ⇒ expected is undefined ⇒ overwrite, like before.', 'Không có If-Match ⇒ expected là undefined ⇒ ghi đè như trước.'], ['map() returns the new array; never mutate rows.', 'map() trả mảng mới; đừng sửa rows.']],
  loi: [['Comparing ETag strings in the route, then writing without a condition.', 'So chuỗi ETag ở route rồi ghi không điều kiện.'], ['Forgetting to bump the version, so the next If-Match still matches.', 'Quên tăng version nên If-Match sau vẫn khớp.']],
  gt: ['Two managers send the same expected version: the first call bumps 3 ⇒ 4, the second finds version 4 ⇒ 412. 12.4 measured 11/20 lost edits without the condition, 0/20 with it.', 'Hai quản lý gửi cùng version mong đợi: lần gọi đầu tăng 3 ⇒ 4, lần sau thấy version 4 ⇒ 412. 12.4 đo được 11/20 lần mất bản sửa khi không có điều kiện, 0/20 khi có.'],
  kn: ['concurrency', 'http caching'], tns: [tn('optimistic locking', 'khoá lạc quan'), tn('If-Match', 'điều kiện khớp ETag')],
  dau: `/** UPDATE … WHERE version = expected */
function conditionalUpdate(rows, id, expected, patch) {
  // Write your solution here
  const r = rows.find((x) => x.id === id);
  Object.assign(r, patch);
  return { status: 200, etag: '"' + id + '-v' + r.version + '"', rows };
}
`,
  giai: '// Reference solution\n' + nguon(conditionalUpdate),
  cases: [
    { goi: goi('conditionalUpdate', DEV, 'dev_1', 3, { note: 'Cô Lan: thay dây nguồn' }), moTa: ['First manager wins', 'Quản lý thứ nhất thắng'] },
    { goi: goi('conditionalUpdate', [{ id: 'dev_1', note: 'Cô Lan: thay dây nguồn', version: 4 }], 'dev_1', 3, { note: 'Thầy Minh' }), moTa: ['Second manager, stale version', 'Quản lý thứ hai, version cũ'] },
    { goi: 'conditionalUpdate(' + JSON.stringify(DEV) + ', "dev_2", undefined, {"note":"x"})', an: true },
    { goi: goi('conditionalUpdate', DEV, 'dev_9', 1, { note: 'x' }), an: true },
  ],
});

export default doiDau({ slug: 'api-12-5-chia-se', ten: '12.4 Two instances, one truth: shared limits, keys, ETags', khoa: KHOA, baiHoc: 'api-12-5-chia-se', de: [E1, E2, E3] });
