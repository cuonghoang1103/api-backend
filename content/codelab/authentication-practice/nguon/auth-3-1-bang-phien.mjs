/** Authentication · 3.1 — Bảng phiên: đọc output thật (hai mốc hết hạn, ghi last_seen); tự viết sessionState, countTouches; bảng cột → câu hỏi. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s03/_ma.mjs';

const TO = OUT['31-timeouts'].split('\n').slice(1);
const TC = OUT['31-touch'].split('\n').slice(1);
const DV = OUT['31-devices'].split('\n').slice(1);

const S1 = cs({
  ten: '3.1-1 — Two timeouts and a write per read: read the real runs', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.3 (real runs):${pre(TO)}${pre(TC)}${pre(DV)}`,
  vi: `LabFlow ID v0.3 (chạy thật):${pre(TO)}${pre(TC)}${pre(DV)}`,
  cau: [
    q('c1', ['An was active every 15 minutes and still got signed out at 19:00. Which timeout did that?', 'An hoạt động mỗi 15 phút mà vẫn bị đăng xuất lúc 19:00. Mốc nào làm việc đó?'],
      ['The absolute timeout: 12 h after sign-in, however active', 'The idle timeout: 30 min after the last request', 'The cookie’s Max-Age expiring in the browser', 'PostgreSQL deleting rows older than 12 h by itself'],
      ['Absolute caps the life of any session — including a stolen cookie in daily use. Idle ended Bình at 07:31. The server checks both; Max-Age only advises the browser.', 'Tuyệt đối giới hạn tuổi thọ mọi phiên — kể cả cookie bị trộm dùng hằng ngày. Nhàn rỗi kết thúc Bình lúc 07:31. Máy chủ kiểm cả hai; Max-Age chỉ là lời khuyên cho trình duyệt.']),
    q('c2', ['Port 4803 updated the sessions table 1,000 times for 1,000 reads. What did port 4800 change?', 'Cổng 4803 cập nhật bảng sessions 1.000 lần cho 1.000 lần đọc. Cổng 4800 đã thay đổi gì?'],
      ['It touches last_seen at most once a minute', 'It caches every /me response for one minute', 'It stopped checking the idle timeout entirely', 'It keeps sessions in Redis instead of PostgreSQL'],
      ['Same server, TOUCH_EVERY_MS 60000 instead of 0. The idle check loses at most a minute of precision; the database loses 1,000 dead rows.', 'Cùng máy chủ, TOUCH_EVERY_MS 60000 thay vì 0. Phép kiểm nhàn rỗi chỉ kém chính xác tối đa một phút; cơ sở dữ liệu bớt 1.000 dòng chết.']),
    q('c3', ['After POST /sign-out-everywhere from the laptop, why is the phone signed out too?', 'Sau POST /sign-out-everywhere từ laptop, vì sao điện thoại cũng bị đăng xuất?'],
      ['One DELETE … WHERE user_id removed all three rows', 'The server pushed a sign-out message to the phone', 'The phone’s cookie happened to expire at that moment', 'The laptop’s cookie had been copied onto the phone'],
      ['Server-side sessions are revoked by deleting rows; the cookie is just a pointer. An index on user_id keeps the delete fast.', 'Phiên phía máy chủ bị thu hồi bằng cách xoá dòng; cookie chỉ là con trỏ. Chỉ mục trên user_id giữ cho lệnh xoá nhanh.']),
  ],
  goiY: [['Which column decides each event?', 'Cột nào quyết định từng sự kiện?'], ['Count writes, not reads.', 'Đếm số lần ghi, không đếm lần đọc.']],
  loi: [['“Max-Age is the timeout.”', '"Max-Age chính là mốc hết hạn."'], ['“Updating last_seen is free.”', '"Cập nhật last_seen thì miễn phí."']],
  tns: [tn('idle timeout', 'hết hạn nhàn rỗi'), tn('absolute timeout', 'hết hạn tuyệt đối')],
  kn: ['session management'],
});

function sessionState(row, now, opt) {
  if (!row) return 'NO_SESSION';
  if (now >= row.expiresAt) return 'EXPIRED_ABSOLUTE';
  if (now - row.lastSeenAt >= opt.idleMs) return 'EXPIRED_IDLE';
  return now - row.lastSeenAt >= opt.touchEveryMs ? 'OK_TOUCH' : 'OK';
}
const OPT = { idleMs: 30 * 60e3, touchEveryMs: 60e3 };
const T0 = Date.UTC(2026, 10, 2);
const R = (ageMin, idleMin) => ({ userId: 'usr_1', createdAt: T0, expiresAt: T0 + 12 * 3600e3, lastSeenAt: T0 + ageMin * 60e3 - idleMin * 60e3 });
const S2 = jsBai({
  ten: '3.1-2 — Write sessionState(row, now, opt): the check inside load()', kho: 'EASY', phut: 12,
  en: `<p>Return what <code>load()</code> must do with a session row at time <code>now</code> (ms): <code>'NO_SESSION'</code> (row is null); <code>'EXPIRED_ABSOLUTE'</code> when <code>now ≥ expiresAt</code>; <code>'EXPIRED_IDLE'</code> when <code>now − lastSeenAt ≥ idleMs</code>; otherwise <code>'OK_TOUCH'</code> when <code>now − lastSeenAt ≥ touchEveryMs</code> (update last_seen), else <code>'OK'</code>. Check absolute first.</p>`,
  vi: `<p>Trả về việc <code>load()</code> phải làm với một dòng phiên ở thời điểm <code>now</code> (ms): <code>'NO_SESSION'</code> (dòng null); <code>'EXPIRED_ABSOLUTE'</code> khi <code>now ≥ expiresAt</code>; <code>'EXPIRED_IDLE'</code> khi <code>now − lastSeenAt ≥ idleMs</code>; còn lại <code>'OK_TOUCH'</code> khi <code>now − lastSeenAt ≥ touchEveryMs</code> (cập nhật last_seen), không thì <code>'OK'</code>. Kiểm tuyệt đối trước.</p>`,
  goiY: [['Use ≥ at every boundary.', 'Dùng ≥ ở mọi biên.'], ['Order: null, absolute, idle, touch.', 'Thứ tự: null, tuyệt đối, nhàn rỗi, chạm.']],
  loi: [['> instead of ≥: a session idle exactly 30 min survives (Lab 3 T4).', '> thay vì ≥: phiên nhàn rỗi đúng 30 phút vẫn sống (T4 của Lab 3).'], ['Touching on every request.', 'Chạm ở mọi request.']],
  gt: ['Absolute first, because an active session must still die; idle second; and only a live session is touched, at most once per interval — the order of lesson 3.1’s load().', 'Tuyệt đối trước, vì phiên đang hoạt động vẫn phải chết; nhàn rỗi sau; và chỉ phiên còn sống mới được chạm, tối đa mỗi khoảng một lần — đúng thứ tự load() của bài 3.1.'],
  kn: ['session management'], tns: [tn('boundary', 'biên')],
  dau: `/** ⇒ 'NO_SESSION' | 'EXPIRED_ABSOLUTE' | 'EXPIRED_IDLE' | 'OK_TOUCH' | 'OK' */
function sessionState(row, now, opt) {
  // Write your solution here
  if (now - row.lastSeenAt > opt.idleMs) return 'EXPIRED_IDLE';
  return 'OK_TOUCH';
}
`,
  giai: '// Reference solution\n' + nguon(sessionState),
  cases: [
    { goi: goi('sessionState', R(20, 20), T0 + 20 * 60e3, OPT), moTa: ['20 min idle', 'Nhàn rỗi 20 phút'] },
    { goi: goi('sessionState', R(31, 31), T0 + 31 * 60e3, OPT), moTa: ['Bình at 07:31', 'Bình lúc 07:31'] },
    { goi: goi('sessionState', R(720, 15), T0 + 720 * 60e3, OPT), an: true, moTa: ['An at 19:00, active', 'An lúc 19:00, đang hoạt động'] },
    { goi: goi('sessionState', R(30, 30), T0 + 30 * 60e3, OPT), an: true, moTa: ['Exactly 30 min idle', 'Nhàn rỗi đúng 30 phút'] },
    { goi: goi('sessionState', R(10, 0.5), T0 + 10 * 60e3, OPT), an: true },
    { goi: goi('sessionState', R(10, 1), T0 + 10 * 60e3, OPT), an: true },
    { goi: 'sessionState(null, 0, ' + JSON.stringify(OPT) + ')', an: true },
  ],
});

function countTouches(signInAt, requestTimes, touchEveryMs) {
  var lastSeen = signInAt, n = 0;
  for (var i = 0; i < requestTimes.length; i++) {
    if (requestTimes[i] - lastSeen >= touchEveryMs) { lastSeen = requestTimes[i]; n++; }
  }
  return n;
}
const burst = Array.from({ length: 100 }, (_, i) => 1000 + i * 100);
const S3 = jsBai({
  ten: '3.1-3 — Write countTouches(signInAt, times, touchEveryMs): how many UPDATEs?', kho: 'MEDIUM', phut: 12,
  en: `<p>A session starts with <code>lastSeenAt = signInAt</code>. For each request time in order, the server updates last_seen (one UPDATE) only when <code>time − lastSeenAt ≥ touchEveryMs</code>, and then <code>lastSeenAt = time</code>. Return the number of UPDATEs. Lesson 3.1 measured 1,000 UPDATEs with <code>touchEveryMs = 0</code> and 0 with 60 s for a 2-second burst.</p>`,
  vi: `<p>Một phiên bắt đầu với <code>lastSeenAt = signInAt</code>. Với mỗi thời điểm request theo thứ tự, máy chủ cập nhật last_seen (một UPDATE) chỉ khi <code>time − lastSeenAt ≥ touchEveryMs</code>, rồi gán <code>lastSeenAt = time</code>. Trả về số lần UPDATE. Bài 3.1 đo được 1.000 UPDATE với <code>touchEveryMs = 0</code> và 0 với 60 s cho một đợt 2 giây.</p>`,
  goiY: [['Keep lastSeen in a variable; move it only when you touch.', 'Giữ lastSeen trong một biến; chỉ dời nó khi chạm.'], ['touchEveryMs = 0 ⇒ every request touches.', 'touchEveryMs = 0 ⇒ request nào cũng chạm.']],
  loi: [['Moving lastSeen on every request: then nothing is ever ≥ 60 s.', 'Dời lastSeen ở mọi request: khi đó chẳng khoảng nào ≥ 60 s.'], ['Counting the sign-in as a touch.', 'Đếm cả lúc đăng nhập là một lần chạm.']],
  gt: ['lastSeen moves only when the database is written; between touches the idle clock still runs from the last write — which is why the idle check is at most touchEveryMs late.', 'lastSeen chỉ dời khi cơ sở dữ liệu được ghi; giữa hai lần chạm đồng hồ nhàn rỗi vẫn chạy từ lần ghi cuối — nên phép kiểm nhàn rỗi trễ tối đa touchEveryMs.'],
  kn: ['write amplification'], tns: [tn('throttle', 'giới hạn tần suất')],
  dau: `/** ⇒ number of last_seen UPDATEs */
function countTouches(signInAt, requestTimes, touchEveryMs) {
  // Write your solution here
  return requestTimes.length;
}
`,
  giai: '// Reference solution\n' + nguon(countTouches),
  cases: [
    { goi: goi('countTouches', 0, burst, 60000), moTa: ['100 requests in 10 s, touch every minute', '100 request trong 10 s, chạm mỗi phút'] },
    { goi: goi('countTouches', 0, burst, 0) },
    { goi: goi('countTouches', 0, [30e3, 61e3, 90e3, 125e3, 200e3], 60000), an: true },
    { goi: goi('countTouches', 0, [], 60000), an: true },
    { goi: goi('countTouches', 0, Array.from({ length: 48 }, (_, i) => (i + 1) * 15 * 60e3), 60000), an: true, moTa: ['An every 15 min for 12 h', 'An mỗi 15 phút trong 12 giờ'] },
  ],
});

const Q = ['which session (never the token)', 'when it ends, whatever happens', 'has it been idle too long', 'when was the password last proven', 'is this you? (devices page)', 'sign out everywhere, fast'];
const S4 = cs({
  ten: '3.1-4 — Each column answers a question', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each part of sql/002_sessions.sql with the question it answers.',
  vi: 'Ghép mỗi phần của sql/002_sessions.sql với câu hỏi nó trả lời.',
  bang: [bang1('b1', ['Column → question', 'Cột → câu hỏi'], [{ ma: 'x', ten: 'Column' }, { ma: 'q', ten: 'Answers', luaChon: Q }], [
    { o: { x: 'digest (primary key)' }, a: { q: 'which session (never the token)' } },
    { o: { x: 'expires_at' }, a: { q: 'when it ends, whatever happens' } },
    { o: { x: 'last_seen_at' }, a: { q: 'has it been idle too long' } },
    { o: { x: 'auth_at' }, a: { q: 'when was the password last proven' } },
    { o: { x: 'ip, user_agent' }, a: { q: 'is this you? (devices page)' } },
    { o: { x: 'index on user_id' }, a: { q: 'sign out everywhere, fast' } },
  ], ['Every column exists because someone will ask that question in production; a column nobody asks about is a column to drop.', 'Mỗi cột tồn tại vì sẽ có người hỏi câu đó trên production; cột không ai hỏi tới là cột nên bỏ.'])],
  goiY: [['Think of the support call each column answers.', 'Nghĩ tới cuộc gọi hỗ trợ mà mỗi cột trả lời.'], ['The index is not a column but answers a question too.', 'Chỉ mục không phải cột nhưng cũng trả lời một câu hỏi.']],
  loi: [['Storing the token itself as the key.', 'Lưu chính token làm khoá.'], ['Using created_at for idle.', 'Dùng created_at cho nhàn rỗi.']],
  kn: ['session management'],
});

export default doiDau({ slug: 'auth-3-1-bang-phien', ten: '3.1 One table, and what every column is for', khoa: KHOA, baiHoc: 'auth-3-1-bang-phien', de: [S1, S2, S3, S4] });
