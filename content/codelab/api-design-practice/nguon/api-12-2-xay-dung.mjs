/** API Design · 12.3 — Dựng trên PostgreSQL: một pool, transaction, lỗi CSDL thành HTTP (output thật bài 12.3: perf/pool.mjs, perf/race-api.mjs, test:pg). */
import { doiDau, KHOA, cs, q, tn, jsBai, nguon, goi } from './_api.mjs';

const E1 = cs({
  ten: 'Build 1 — Pool, transaction, race: what was measured', kho: 'EASY', phut: 8,
  en: 'Facts from lesson 12.3: the store interface, one pool per instance, and the 50-booking race through two instances.',
  vi: 'Những điều từ bài 12.3: giao diện store, mỗi instance một pool, và cuộc đua 50 lượt đặt qua hai instance.',
  cau: [
    q('c1', ['Pool max 2, wait timeout 500 ms, twenty 100 ms queries at once. What happened?', 'Pool tối đa 2, chờ tối đa 500 ms, hai mươi truy vấn 100 ms cùng lúc. Chuyện gì xảy ra?'],
      ['10 finished, 10 failed after ~502 ms with “timeout exceeded when trying to connect”', 'All 20 finished after about 1 second, because the pool queues forever', 'All 20 failed immediately, because the pool was smaller than the load', 'The pool opened 18 extra connections and all 20 finished in 103 ms'],
      ['Without a timeout (pg’s default 0) all 20 finish but the last waits 1,028 ms; LabFlow maps the timeout to 503 + Retry-After.', 'Không có thời hạn (mặc định 0 của pg) cả 20 xong nhưng cái cuối chờ 1.028 ms; LabFlow đổi lỗi hết hạn thành 503 + Retry-After.']),
    q('c2', ['Fifty managers book the same slot through two RAM instances. How many bookings did the lab end up with?', 'Năm mươi quản lý đặt cùng khung giờ qua hai instance RAM. Phòng có bao nhiêu lượt đặt?'],
      ['Two — one winner per instance, because each checked only its own array', 'One — the second instance saw the first booking through the proxy', 'Fifty — the RAM store has no overlap check at all under concurrency', 'Zero — both instances answered 409 to every request'],
      ['On PostgreSQL the EXCLUDE constraint let exactly one through: 1 × 201, 49 × 409.', 'Trên PostgreSQL ràng buộc EXCLUDE cho đúng một lượt qua: 1 × 201, 49 × 409.']),
    q('c3', ['Without SELECT … FOR UPDATE on the user’s row, An’s ten simultaneous bookings produced how many 201s?', 'Không có SELECT … FOR UPDATE trên dòng của người dùng, mười lượt đặt cùng lúc của An ra bao nhiêu 201?'],
      ['5–8 over three runs, although the rule says at most 3 active bookings', 'Exactly 3 every time, because each request runs in its own transaction', 'Exactly 1, because the exclusion constraint applies to all of them', '10, because count(*) never sees uncommitted rows of other users'],
      ['Count-then-insert is a race even inside one database; locking her row makes her requests queue: 3, 3, 3.', 'Đếm-rồi-chèn là cuộc đua kể cả trong một CSDL; khoá dòng của An làm request của An xếp hàng: 3, 3, 3.']),
    q('c4', ['Two API instances with pool max 10, a worker pool of 10, a relay listener and a migration runner. How many connections at most?', 'Hai instance API pool tối đa 10, worker pool 10, một kết nối nghe của relay và một bộ chạy migration. Tối đa bao nhiêu kết nối?'],
      ['32 — well under the 97 non-superuser slots of max_connections 100', '20 — the worker and relay borrow from the API pools', '10 — node-postgres shares one pool between processes on a host', '100 — every pool reserves max_connections when it starts'],
      ['Size pools from max_connections; eight instances would need 82, time for PgBouncer.', 'Tính kích thước pool từ max_connections; tám instance cần 82, tới lúc dùng PgBouncer.']),
  ],
  goiY: [['A pool is a queue with a fixed number of seats.', 'Pool là hàng đợi có số ghế cố định.'], ['Ask what each instance can see.', 'Hỏi: mỗi instance thấy được gì.']],
  loi: [['Leaving connectionTimeoutMillis at 0 (wait forever).', 'Để connectionTimeoutMillis bằng 0 (chờ mãi).'], ['Trusting a count-then-insert check under concurrency.', 'Tin phép đếm-rồi-chèn khi có đồng thời.']],
  tns: [tn('connection pool', 'bể kết nối'), tn('row lock', 'khoá dòng'), tn('max_connections', 'số kết nối tối đa')],
  kn: ['databases', 'concurrency'],
});

function asHttp(err) {
  const down = ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', '57P01', '57P02', '57P03', '08006'];
  if (err.code === '23P01') return { status: 409, code: 'BOOKING_CONFLICT' };
  if (err.code === '23505') return { status: 409, code: 'DUPLICATE_SERIAL' };
  if (down.includes(err.code) || /timeout exceeded when trying to connect/.test(err.message || '')) return { status: 503, code: 'DEPENDENCY_DOWN', retryAfter: 5 };
  if (err.code === '57014') return { status: 503, code: 'DEPENDENCY_DOWN', retryAfter: 1 };
  return { status: 500, code: 'INTERNAL' };
}
const E2 = jsBai({
  ten: 'Build 2 — Write asHttp(err): one place that knows SQLSTATE', kho: 'MEDIUM', phut: 12,
  en: `<p>Map a database error <code>{ code, message }</code> to <code>{ status, code, retryAfter? }</code>: <code>23P01</code> ⇒ 409 BOOKING_CONFLICT; <code>23505</code> ⇒ 409 DUPLICATE_SERIAL; unreachable database (<code>ECONNREFUSED</code>, <code>ECONNRESET</code>, <code>ETIMEDOUT</code>, <code>57P01</code>, <code>57P02</code>, <code>57P03</code>, <code>08006</code>, or a message containing “timeout exceeded when trying to connect”) ⇒ 503 DEPENDENCY_DOWN with <code>retryAfter: 5</code>; <code>57014</code> (statement timeout) ⇒ 503 DEPENDENCY_DOWN with <code>retryAfter: 1</code>; anything else ⇒ 500 INTERNAL (no retryAfter key).</p>`,
  vi: `<p>Đổi lỗi CSDL <code>{ code, message }</code> thành <code>{ status, code, retryAfter? }</code>: <code>23P01</code> ⇒ 409 BOOKING_CONFLICT; <code>23505</code> ⇒ 409 DUPLICATE_SERIAL; CSDL không tới được (<code>ECONNREFUSED</code>, <code>ECONNRESET</code>, <code>ETIMEDOUT</code>, <code>57P01</code>, <code>57P02</code>, <code>57P03</code>, <code>08006</code>, hoặc thông điệp chứa “timeout exceeded when trying to connect”) ⇒ 503 DEPENDENCY_DOWN kèm <code>retryAfter: 5</code>; <code>57014</code> (statement timeout) ⇒ 503 DEPENDENCY_DOWN kèm <code>retryAfter: 1</code>; còn lại ⇒ 500 INTERNAL (không có khoá retryAfter).</p>`,
  dauVao: ['err — { code?, message? }', 'err — { code?, message? }'], dauRa: ['{ status, code, retryAfter? }', '{ status, code, retryAfter? }'],
  goiY: [['The pool timeout has no code — check the message.', 'Lỗi hết hạn của pool không có code — kiểm thông điệp.'], ['Do not add retryAfter to the 409 and 500 answers.', 'Đừng thêm retryAfter vào câu 409 và 500.']],
  loi: [['Answering 500 when the database is restarting.', 'Trả 500 khi CSDL đang khởi động lại.'], ['Treating a statement timeout like a bug.', 'Coi statement timeout như một con bug.']],
  gt: ['src/pg.js asHttp(): a 503 with Retry-After tells clients to come back; a 500 says “our bug”. In 12.7 a stopped database produced exactly 503 DEPENDENCY_DOWN, Retry-After: 5.', 'asHttp() trong src/pg.js: 503 kèm Retry-After bảo client quay lại; 500 nghĩa là “lỗi của chúng tôi”. Ở 12.7 CSDL bị tắt cho đúng 503 DEPENDENCY_DOWN, Retry-After: 5.'],
  kn: ['errors', 'databases'], tns: [tn('SQLSTATE', 'mã lỗi SQL'), tn('statement timeout', 'giới hạn thời gian câu lệnh')],
  dau: `/** database error ⇒ HTTP */
function asHttp(err) {
  // Write your solution here
  if (err.code === '23P01') return { status: 409, code: 'BOOKING_CONFLICT' };
  return { status: 500, code: 'INTERNAL' };
}
`,
  giai: '// Reference solution\n' + nguon(asHttp),
  cases: [
    { goi: goi('asHttp', { code: '23P01', message: 'conflicting key value violates exclusion constraint "bookings_no_overlap"' }), moTa: ['Overlap', 'Chồng giờ'] },
    { goi: goi('asHttp', { code: 'ECONNREFUSED', message: 'connect ECONNREFUSED 127.0.0.1:55432' }), moTa: ['Database stopped', 'CSDL bị tắt'] },
    { goi: goi('asHttp', { message: 'timeout exceeded when trying to connect' }), an: true },
    { goi: goi('asHttp', { code: '57014', message: 'canceling statement due to statement timeout' }), an: true },
    { goi: goi('asHttp', { code: '23505', message: 'duplicate key value violates unique constraint "devices_serial_no_key"' }), an: true },
    { goi: goi('asHttp', { code: '42703', message: 'column "nme" does not exist' }), an: true },
  ],
});

function poolBudget(maxConnections, reserved, instances, poolMax, extra) {
  const usable = maxConnections - reserved;
  const total = instances * poolMax + extra;
  return { total, usable, fits: total <= usable, maxInstances: Math.floor((usable - extra) / poolMax) };
}
const E3 = jsBai({
  ten: 'Build 3 — Write poolBudget(...): will the pools fit?', kho: 'MEDIUM', phut: 10,
  en: `<p><code>poolBudget(maxConnections, reserved, instances, poolMax, extra)</code> returns <code>{ total, usable, fits, maxInstances }</code>: <code>usable = maxConnections − reserved</code>; <code>total = instances × poolMax + extra</code> (extra = worker pool, relay, migration runner…); <code>fits = total ≤ usable</code>; <code>maxInstances</code> = how many API instances fit with the same extra, rounded down.</p>`,
  vi: `<p><code>poolBudget(maxConnections, reserved, instances, poolMax, extra)</code> trả <code>{ total, usable, fits, maxInstances }</code>: <code>usable = maxConnections − reserved</code>; <code>total = instances × poolMax + extra</code> (extra = pool của worker, relay, bộ chạy migration…); <code>fits = total ≤ usable</code>; <code>maxInstances</code> = số instance API tối đa lọt được với cùng extra, làm tròn xuống.</p>`,
  dauVao: ['five numbers', 'năm con số'], dauRa: ['{ total, usable, fits, maxInstances }', '{ total, usable, fits, maxInstances }'],
  goiY: [['Superuser slots are not for your app.', 'Chỗ dành cho superuser không phải của ứng dụng.'], ['Math.floor for the instance count.', 'Math.floor cho số instance.']],
  loi: [['Forgetting the worker and relay connections.', 'Quên kết nối của worker và relay.'], ['Comparing against max_connections instead of usable slots.', 'So với max_connections thay vì số chỗ dùng được.']],
  gt: ['12.3: SHOW max_connections ⇒ 100, superuser_reserved_connections ⇒ 3; 2 × 10 + 12 = 32 fits easily, and the ceiling is 8 instances before PgBouncer becomes the answer.', '12.3: SHOW max_connections ⇒ 100, superuser_reserved_connections ⇒ 3; 2 × 10 + 12 = 32 lọt thoải mái, trần là 8 instance trước khi PgBouncer thành lời giải.'],
  kn: ['databases', 'capacity'], tns: [tn('connection budget', 'ngân sách kết nối')],
  dau: `/** do the pools fit? */
function poolBudget(maxConnections, reserved, instances, poolMax, extra) {
  // Write your solution here
  const total = instances * poolMax;
  return { total, usable: maxConnections, fits: total <= maxConnections, maxInstances: Math.floor(maxConnections / poolMax) };
}
`,
  giai: '// Reference solution\n' + nguon(poolBudget),
  cases: [
    { goi: goi('poolBudget', 100, 3, 2, 10, 12), moTa: ['LabFlow today', 'LabFlow hôm nay'] },
    { goi: goi('poolBudget', 100, 3, 9, 10, 12), moTa: ['Nine instances', 'Chín instance'] },
    { goi: goi('poolBudget', 200, 3, 12, 15, 20), an: true },
    { goi: goi('poolBudget', 50, 5, 1, 50, 0), an: true },
  ],
});

export default doiDau({ slug: 'api-12-2-xay-dung', ten: '12.3 Building on PostgreSQL: one pool, transactions, constraints', khoa: KHOA, baiHoc: 'api-12-2-xay-dung', de: [E1, E2, E3] });
