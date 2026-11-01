/** Authentication · 3.5 — Phiên sống ở đâu: đọc số đo thật PG/Redis/cookie có ký; tự viết runTtl (kho có TTL như Redis), endEverywhere (tập theo người dùng); bảng yêu cầu → kho. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s03/_ma.mjs';

const W = OUT['35-where'].split('\n').slice(1).map((l) => (l.length > 110 ? l.slice(0, 109) + '…' : l));

const S1 = cs({
  ten: '3.5-1 — Three stores, measured', kho: 'EASY', phut: 8,
  en: `node demo3/where.mjs (real run; PostgreSQL 17 and Redis 7 in Docker Desktop on macOS):${pre(W)}`,
  vi: `node demo3/where.mjs (chạy thật; PostgreSQL 17 và Redis 7 trong Docker Desktop trên macOS):${pre(W)}`,
  cau: [
    q('c1', ['The signed cookie is ~70–90× faster to look up. Why is it still not LabFlow ID’s browser session?', 'Cookie có ký tra nhanh hơn ~70–90 lần. Vì sao nó vẫn không phải phiên trình duyệt của LabFlow ID?'],
      ['It cannot be revoked before it expires', 'It is larger than the 4 KB cookie limit', 'A signed cookie can never be marked HttpOnly', 'Its HMAC verification is not constant-time'],
      ['Revocation versus a lookup: the saved lookup is the lost revocation. A denylist brings the lookup back.', 'Thu hồi đối lại một lần tra: lần tra tiết kiệm được chính là khả năng thu hồi bị mất. Một danh sách chặn mang lần tra quay lại.']),
    q('c2', ['Why are the PostgreSQL and Redis numbers (hundreds of µs) not a reason to pick either?', 'Vì sao số của PostgreSQL và Redis (vài trăm µs) không phải lý do để chọn bên nào?'],
      ['Both are small next to a whole request (~1.7 ms)', 'Because PostgreSQL is always faster than Redis', 'Because Node.js cannot measure microseconds', 'Because both numbers were averages of zero runs'],
      ['Measure the whole request, not the component; then decide on revocation and operations.', 'Hãy đo cả request, không đo từng thành phần; rồi quyết định dựa trên thu hồi và vận hành.']),
    q('c3', ['Redis showed TTL 1796 s on An’s session key. What does that give LabFlow ID for free?', 'Redis cho thấy TTL 1796 s trên khoá phiên của An. Điều đó cho LabFlow ID không công gì?'],
      ['The idle timeout, reset by every touch', 'The absolute timeout after twelve hours', 'Signing a user out of every device', 'Keeping sessions safe across restarts'],
      ['TTL = idle. “Everywhere” still needs a per-user set; absolute still needs an expiresAt check.', 'TTL = nhàn rỗi. "Mọi nơi" vẫn cần tập theo người dùng; tuyệt đối vẫn cần kiểm expiresAt.']),
  ],
  goiY: [['Read the last line first.', 'Đọc dòng cuối trước.'], ['Compare µs with the ms of a request.', 'So µs với ms của một request.']],
  loi: [['Choosing by microseconds.', 'Chọn theo micro giây.'], ['“TTL handles everything.”', '"TTL lo hết mọi thứ."']],
  tns: [tn('TTL', 'thời gian sống'), tn('denylist', 'danh sách chặn')],
  kn: ['session storage'],
});

function runTtl(ops) {
  var store = {}, out = [];
  ops.forEach(function (o) {
    var e = store[o.key];
    if (e && o.t >= e.expiresAt) { delete store[o.key]; e = undefined; }       // expired keys disappear by themselves
    if (o.op === 'set') store[o.key] = { value: o.value, expiresAt: o.t + o.ttl * 1000 };
    else if (o.op === 'get') out.push(e ? e.value : null);
    else if (o.op === 'touch' && e) e.expiresAt = o.t + o.ttl * 1000;
  });
  return out;
}
const S2 = jsBai({
  ten: '3.5-2 — Write runTtl(ops): a key-value store with TTL', kho: 'MEDIUM', phut: 15,
  en: `<p>Simulate Redis-style expiry. <code>ops</code> is a time-ordered list: <code>{ op: 'set', key, value, ttl, t }</code> (ttl in seconds, t in ms), <code>{ op: 'touch', key, ttl, t }</code> (reset the TTL if the key is alive), <code>{ op: 'get', key, t }</code>. A key is gone from the moment <code>t ≥ setOrTouchTime + ttl × 1000</code>. Return the results of every <code>get</code> in order (<code>null</code> if gone).</p>`,
  vi: `<p>Mô phỏng hết hạn kiểu Redis. <code>ops</code> là danh sách theo thời gian: <code>{ op: 'set', key, value, ttl, t }</code> (ttl tính giây, t tính ms), <code>{ op: 'touch', key, ttl, t }</code> (đặt lại TTL nếu khoá còn sống), <code>{ op: 'get', key, t }</code>. Khoá biến mất từ lúc <code>t ≥ thời điểm set/touch + ttl × 1000</code>. Trả về kết quả của mọi <code>get</code> theo thứ tự (<code>null</code> nếu đã mất).</p>`,
  goiY: [['Store expiresAt with each key.', 'Lưu expiresAt cùng mỗi khoá.'], ['Check expiry before every operation on a key.', 'Kiểm hết hạn trước mọi thao tác trên một khoá.']],
  loi: [['Touching an expired key brings it back.', 'Chạm vào khoá đã hết hạn làm nó sống lại.'], ['> instead of ≥ at the expiry moment.', '> thay vì ≥ ở thời điểm hết hạn.']],
  gt: ['This is the idle timeout of lesson 3.5 handed to the store: each request touches the key, silence lets it expire — no last_seen column, no cleanup job.', 'Đây là mốc nhàn rỗi của bài 3.5 giao cho kho: mỗi request chạm khoá, im lặng thì nó hết hạn — không cần cột last_seen, không cần việc dọn dẹp.'],
  kn: ['session storage'], tns: [tn('expiry', 'hết hạn')],
  dau: `/** ⇒ results of the 'get' operations */
function runTtl(ops) {
  // Write your solution here
  var store = {}, out = [];
  ops.forEach(function (o) { if (o.op === 'set') store[o.key] = o.value; if (o.op === 'get') out.push(store[o.key] || null); });
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(runTtl),
  cases: [
    { goi: goi('runTtl', [{ op: 'set', key: 'ses:a', value: 'usr_1', ttl: 1800, t: 0 }, { op: 'get', key: 'ses:a', t: 1799e3 }, { op: 'get', key: 'ses:a', t: 1800e3 }]), moTa: ['Idle 30 min', 'Nhàn rỗi 30 phút'] },
    { goi: goi('runTtl', [{ op: 'set', key: 'ses:a', value: 'usr_1', ttl: 1800, t: 0 }, { op: 'touch', key: 'ses:a', ttl: 1800, t: 1500e3 }, { op: 'get', key: 'ses:a', t: 3000e3 }]) },
    { goi: goi('runTtl', [{ op: 'set', key: 'k', value: 1, ttl: 10, t: 0 }, { op: 'touch', key: 'k', ttl: 10, t: 10e3 }, { op: 'get', key: 'k', t: 11e3 }]), an: true, moTa: ['Touch after expiry does not revive', 'Chạm sau khi hết hạn không làm sống lại'] },
    { goi: goi('runTtl', [{ op: 'get', key: 'x', t: 0 }]), an: true },
    { goi: goi('runTtl', [{ op: 'set', key: 'k', value: 'a', ttl: 5, t: 0 }, { op: 'set', key: 'k', value: 'b', ttl: 5, t: 4e3 }, { op: 'get', key: 'k', t: 8e3 }]), an: true },
  ],
});

function endEverywhere(kv, userSets, userId) {
  var keys = userSets[userId] || [];
  var ended = 0;
  keys.forEach(function (k) { if (Object.prototype.hasOwnProperty.call(kv, k)) { delete kv[k]; ended++; } });
  delete userSets[userId];
  return { kv: kv, userSets: userSets, ended: ended };
}
const S3 = jsBai({
  ten: '3.5-3 — Write endEverywhere(kv, userSets, userId): the Redis way', kho: 'MEDIUM', phut: 12,
  en: `<p>Redis cannot search values, so LabFlow ID keeps <code>userSets[userId]</code> = the session keys of each user (<code>user-ses:&lt;id&gt;</code> in <code>demo3/redis-store.mjs</code>). Delete every key of the user from <code>kv</code>, delete the user's set, and return <code>{ kv, userSets, ended }</code> where <code>ended</code> counts keys that still existed (some may have expired already). Other users are untouched.</p>`,
  vi: `<p>Redis không tìm theo giá trị được, nên LabFlow ID giữ <code>userSets[userId]</code> = các khoá phiên của từng người (<code>user-ses:&lt;id&gt;</code> trong <code>demo3/redis-store.mjs</code>). Xoá mọi khoá của người đó khỏi <code>kv</code>, xoá tập của người đó, rồi trả <code>{ kv, userSets, ended }</code> với <code>ended</code> đếm số khoá còn tồn tại (có khoá có thể đã hết hạn). Không đụng tới người khác.</p>`,
  goiY: [['Iterate the user’s set, not the whole kv.', 'Duyệt tập của người đó, không duyệt cả kv.'], ['Count only keys that were present.', 'Chỉ đếm khoá còn tồn tại.']],
  loi: [['Scanning every value for userId — what Redis cannot do efficiently.', 'Quét mọi giá trị tìm userId — điều Redis không làm hiệu quả được.'], ['Forgetting to delete the set itself.', 'Quên xoá chính cái tập.']],
  gt: ['The second structure is the price of “sign out everywhere” in a key-value store; keeping it in sync on every insert and delete is the extra work PostgreSQL’s index gives you for free.', 'Cấu trúc thứ hai là cái giá của "đăng xuất mọi nơi" trong kho key-value; giữ nó khớp ở mọi lần thêm và xoá là phần việc thêm mà chỉ mục của PostgreSQL cho không.'],
  kn: ['session storage'], tns: [tn('secondary index', 'chỉ mục phụ')],
  dau: `/** ⇒ { kv, userSets, ended } */
function endEverywhere(kv, userSets, userId) {
  // Write your solution here
  var ended = 0;
  Object.keys(kv).forEach(function (k) { if (kv[k] === userId) { delete kv[k]; ended++; } });
  return { kv: kv, userSets: userSets, ended: ended };
}
`,
  giai: '// Reference solution\n' + nguon(endEverywhere),
  cases: [
    { goi: goi('endEverywhere', { 'ses:a1': '{"userId":"usr_1"}', 'ses:a2': '{"userId":"usr_1"}', 'ses:b1': '{"userId":"usr_2"}' }, { usr_1: ['ses:a1', 'ses:a2'], usr_2: ['ses:b1'] }, 'usr_1'), moTa: ['An on two devices', 'An trên hai thiết bị'] },
    { goi: goi('endEverywhere', { 'ses:a2': '{"userId":"usr_1"}' }, { usr_1: ['ses:a1', 'ses:a2'] }, 'usr_1'), an: true, moTa: ['One key already expired', 'Một khoá đã hết hạn'] },
    { goi: goi('endEverywhere', {}, {}, 'usr_9'), an: true },
  ],
});

const ST = ['PostgreSQL row', 'Redis key', 'signed cookie', 'in-memory Map'];
const S4 = cs({
  ten: '3.5-4 — Requirement → store', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Pick the session store each situation calls for (lesson 3.5).',
  vi: 'Chọn kho phiên mà mỗi tình huống cần (bài 3.5).',
  bang: [bang1('b1', ['Situation → store', 'Tình huống → kho'], [{ ma: 'x', ten: 'Situation' }, { ma: 's', ten: 'Store', luaChon: ST }], [
    { o: { x: 'LabFlow ID today: must revoke now, show a devices page, already runs PostgreSQL' }, a: { s: 'PostgreSQL row' } },
    { o: { x: 'Lookups measured as the bottleneck; several services share the sessions' }, a: { s: 'Redis key' } },
    { o: { x: 'A 15-minute access token between two services, no revocation needed' }, a: { s: 'signed cookie' } },
    { o: { x: 'The Lab 3 grader, one process, thrown away after the run' }, a: { s: 'in-memory Map' } },
  ], ['Revocation and queries ⇒ the database you already run; measured load or sharing ⇒ Redis; short-lived, unrevocable ⇒ signed; tests ⇒ memory — never in production.', 'Thu hồi và truy vấn ⇒ cơ sở dữ liệu đang chạy sẵn; tải đã đo hay cần chia sẻ ⇒ Redis; sống ngắn, không thu hồi ⇒ có ký; test ⇒ bộ nhớ — không bao giờ trên production.'])],
  goiY: [['Ask first: must it be revocable now?', 'Hỏi trước: có cần thu hồi ngay không?'], ['Does it survive two instances?', 'Nó có sống được với hai bản chạy không?']],
  loi: [['A Map in production.', 'Map trên production.'], ['A signed cookie as the main browser session.', 'Cookie có ký làm phiên trình duyệt chính.']],
  kn: ['session storage'],
});

export default doiDau({ slug: 'auth-3-5-phien-song-o-dau', ten: '3.5 Three places to keep a session', khoa: KHOA, baiHoc: 'auth-3-5-phien-song-o-dau', de: [S1, S2, S3, S4] });
