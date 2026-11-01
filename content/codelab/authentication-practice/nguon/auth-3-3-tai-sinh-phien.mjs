/** Authentication · 3.3 — Tái sinh phiên: đọc đòn fixation thật; tự viết startSession (huỷ phiên cũ), afterPasswordChange (kết thúc mọi phiên khác); bảng sự kiện → làm gì. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s03/_ma.mjs';

const FX = OUT['33-fixation'].split('\n').slice(1).map((l) => (l.length > 120 ? l.slice(0, 119) + '…' : l));
const PW = OUT['33-password'].split('\n').slice(1);

const S1 = cs({
  ten: '3.3-1 — Session fixation, run for real', kho: 'EASY', phut: 8,
  en: `Real run in Chromium 156 (naive server :4802, LabFlow ID v0.3 :4800):${pre(FX)}${pre(PW)}`,
  vi: `Chạy thật trong Chromium 156 (máy chủ ngây thơ :4802, LabFlow ID v0.3 :4800):${pre(FX)}${pre(PW)}`,
  cau: [
    q('c1', ['On :4802 the attacker’s GET /me returned An. What did he need?', 'Ở :4802, GET /me của kẻ tấn công trả về An. Hắn đã cần gì?'],
      ['Only a session id planted in An’s browser before she signed in', 'An’s password', 'An’s cookie, stolen after she signed in', 'An XSS on LabFlow ID'],
      ['The server upgraded the session he already knew. No password, no theft after login.', 'Máy chủ nâng cấp đúng phiên hắn đã biết. Không mật khẩu, không trộm gì sau đăng nhập.']),
    q('c2', ['Before signing in on :4800, An’s tab showed Bình’s account. What is that called, and what stops it?', 'Trước khi đăng nhập ở :4800, tab của An hiện tài khoản Bình. Đó gọi là gì, và cái gì chặn nó?'],
      ['Login CSRF — CSRF checks plus a new session at sign-in', 'Session fixation — and nothing can stop it at all', 'Clickjacking — fixed by an X-Frame-Options header', 'XSS — fixed by the HttpOnly attribute alone'],
      ['The victim works inside the attacker’s account; once she signs in, start() replaces the planted session.', 'Nạn nhân làm việc trong tài khoản của kẻ tấn công; khi cô đăng nhập, start() thay phiên bị cài.']),
    q('c3', ['After a successful password change, signedOutSessions was 2. Why end the other sessions?', 'Sau khi đổi mật khẩu thành công, signedOutSessions là 2. Vì sao kết thúc các phiên khác?'],
      ['If a thief had a session, changing the password must end it too', 'To free memory on the server', 'Because the old cookies have the old password inside', 'Because PostgreSQL requires it'],
      ['People change passwords because they suspect someone else is in. Ending every other session is the point.', 'Người ta đổi mật khẩu vì ngờ có ai khác đang vào. Kết thúc mọi phiên khác chính là mục đích.']),
  ],
  goiY: [['When did the attacker get the id — before or after sign-in?', 'Kẻ tấn công có id lúc nào — trước hay sau đăng nhập?'], ['Why do people change passwords?', 'Vì sao người ta đổi mật khẩu?']],
  loi: [['“Fixation needs the password.”', '"Fixation cần mật khẩu."'], ['Keeping other sessions after a password change.', 'Giữ các phiên khác sau khi đổi mật khẩu.']],
  tns: [tn('session fixation', 'cố định phiên'), tn('login CSRF', 'giả mạo đăng nhập')],
  kn: ['session fixation'],
});

function startSession(sessions, oldToken, userId, freshToken) {
  var next = {};
  Object.keys(sessions).forEach(function (t) { if (t !== oldToken) next[t] = sessions[t]; });   // the planted / previous one dies
  next[freshToken] = { userId: userId };
  return { sessions: next, cookie: freshToken };
}
const S2 = jsBai({
  ten: '3.3-2 — Write startSession(sessions, oldToken, userId, freshToken)', kho: 'EASY', phut: 10,
  en: `<p><code>sessions</code> maps token → <code>{ userId }</code>. At sign-in the browser may carry <code>oldToken</code> (anonymous, planted, or the user's own). Return <code>{ sessions, cookie }</code>: a <b>new</b> object without <code>oldToken</code>, with <code>freshToken → { userId }</code> added, and <code>cookie = freshToken</code>. Never reuse <code>oldToken</code>; do not modify the input.</p>`,
  vi: `<p><code>sessions</code> ánh xạ token → <code>{ userId }</code>. Lúc đăng nhập, trình duyệt có thể mang <code>oldToken</code> (ẩn danh, bị cài, hoặc của chính người dùng). Trả <code>{ sessions, cookie }</code>: một object <b>mới</b> không còn <code>oldToken</code>, có thêm <code>freshToken → { userId }</code>, và <code>cookie = freshToken</code>. Không bao giờ dùng lại <code>oldToken</code>; không sửa đầu vào.</p>`,
  goiY: [['Copy every entry except oldToken.', 'Chép mọi phần tử trừ oldToken.'], ['oldToken may be null or unknown.', 'oldToken có thể null hoặc không tồn tại.']],
  loi: [['sessions[oldToken].userId = userId — the fixation bug.', 'sessions[oldToken].userId = userId — chính con bug fixation.'], ['Keeping oldToken “in case”.', 'Giữ oldToken "phòng khi cần".']],
  gt: ['Whatever id the browser brought dies at sign-in, so no planting route works — that is the two lines of start() in LabFlow ID v0.3.', 'Id nào trình duyệt mang tới cũng chết lúc đăng nhập, nên không đường cài nào hiệu quả — đó là hai dòng của start() trong LabFlow ID v0.3.'],
  kn: ['session fixation'], tns: [tn('session regeneration', 'tái sinh phiên')],
  dau: `/** ⇒ { sessions, cookie } */
function startSession(sessions, oldToken, userId, freshToken) {
  // Write your solution here
  if (oldToken && sessions[oldToken]) { sessions[oldToken].userId = userId; return { sessions: sessions, cookie: oldToken }; }
  sessions[freshToken] = { userId: userId };
  return { sessions: sessions, cookie: freshToken };
}
`,
  giai: '// Reference solution\n' + nguon(startSession),
  cases: [
    { goi: goi('startSession', { anon1: { userId: null }, b1: { userId: 'usr_2' } }, 'anon1', 'usr_1', 'f1'), moTa: ['Planted anonymous sid', 'Sid ẩn danh bị cài'] },
    { goi: goi('startSession', { b1: { userId: 'usr_2' } }, 'b1', 'usr_1', 'f2'), moTa: ['Bình’s session planted', 'Phiên của Bình bị cài'] },
    { goi: goi('startSession', {}, null, 'usr_1', 'f3'), an: true },
    { goi: goi('startSession', { a1: { userId: 'usr_1' } }, 'zz', 'usr_1', 'f4'), an: true },
  ],
});

function afterPasswordChange(sessions, userId, freshToken) {
  var next = {}, ended = 0;
  Object.keys(sessions).forEach(function (t) {
    if (sessions[t].userId === userId) ended++; else next[t] = sessions[t];
  });
  next[freshToken] = { userId: userId };
  return { sessions: next, ended: ended };
}
const S3 = jsBai({
  ten: '3.3-3 — Write afterPasswordChange(sessions, userId, freshToken)', kho: 'MEDIUM', phut: 12,
  en: `<p>After a verified password change: end <b>every</b> session of <code>userId</code> (including the current one), keep other users' sessions, add <code>freshToken → { userId }</code> for this device. Return <code>{ sessions, ended }</code> (a new object; <code>ended</code> counts removed sessions). Real run: Cô Lan on two devices ⇒ <code>signedOutSessions: 2</code>.</p>`,
  vi: `<p>Sau khi đổi mật khẩu đã xác thực: kết thúc <b>mọi</b> phiên của <code>userId</code> (kể cả phiên hiện tại), giữ phiên của người khác, thêm <code>freshToken → { userId }</code> cho thiết bị này. Trả <code>{ sessions, ended }</code> (object mới; <code>ended</code> đếm số phiên bị xoá). Chạy thật: Cô Lan trên hai thiết bị ⇒ <code>signedOutSessions: 2</code>.</p>`,
  goiY: [['One pass: count and skip the user’s sessions.', 'Một lượt duyệt: đếm và bỏ qua phiên của người đó.'], ['Add the fresh one after the loop.', 'Thêm phiên mới sau vòng lặp.']],
  loi: [['Keeping the current session instead of issuing a new one.', 'Giữ phiên hiện tại thay vì cấp phiên mới.'], ['Ending other users’ sessions.', 'Kết thúc phiên của người khác.']],
  gt: ['Ending all sessions removes any thief; the fresh session keeps the honest user working — the change-password route of v0.3.', 'Kết thúc mọi phiên loại bỏ mọi kẻ trộm; phiên mới giữ người dùng thật tiếp tục làm việc — đúng route đổi mật khẩu của v0.3.'],
  kn: ['session management'], tns: [tn('sign out everywhere', 'đăng xuất mọi nơi')],
  dau: `/** ⇒ { sessions, ended } */
function afterPasswordChange(sessions, userId, freshToken) {
  // Write your solution here
  sessions[freshToken] = { userId: userId };
  return { sessions: sessions, ended: 0 };
}
`,
  giai: '// Reference solution\n' + nguon(afterPasswordChange),
  cases: [
    { goi: goi('afterPasswordChange', { l1: { userId: 'usr_3' }, l2: { userId: 'usr_3' }, a1: { userId: 'usr_1' } }, 'usr_3', 'n1'), moTa: ['Cô Lan on two devices', 'Cô Lan trên hai thiết bị'] },
    { goi: goi('afterPasswordChange', {}, 'usr_3', 'n2'), an: true },
    { goi: goi('afterPasswordChange', { a1: { userId: 'usr_1' }, b1: { userId: 'usr_2' } }, 'usr_3', 'n3'), an: true },
  ],
});

const DO = ['new session, keep the others', 'new session, end all others', 'delete it, keep the others'];
const S4 = cs({
  ten: '3.3-4 — Which event, which move', kho: 'EASY', phut: 6, loai: 'table',
  en: 'For each event in LabFlow ID, pick what happens to sessions.',
  vi: 'Với mỗi sự kiện trong LabFlow ID, chọn điều xảy ra với các phiên.',
  bang: [bang1('b1', ['Event → move', 'Sự kiện → nước đi'], [{ ma: 'x', ten: 'Event' }, { ma: 'm', ten: 'Move', luaChon: DO }], [
    { o: { x: 'An signs in' }, a: { m: 'new session, keep the others' } },
    { o: { x: 'Cô Lan changes her password' }, a: { m: 'new session, end all others' } },
    { o: { x: 'An adds a second factor (Chapter 7)' }, a: { m: 'new session, end all others' } },
    { o: { x: 'Bình presses “Sign out” on the lab PC' }, a: { m: 'delete it, keep the others' } },
  ], ['Every privilege change gets a new session; changes that protect the account (password, second factor) also end the others; signing out ends only this one.', 'Mỗi lần đổi đặc quyền có phiên mới; thay đổi bảo vệ tài khoản (mật khẩu, yếu tố thứ hai) còn kết thúc các phiên khác; đăng xuất chỉ kết thúc phiên này.'])],
  goiY: [['Does the event raise or protect privileges?', 'Sự kiện nâng hay bảo vệ đặc quyền?'], ['Signing out on one PC should not sign you out on your phone.', 'Đăng xuất trên một máy không nên đăng xuất cả điện thoại.']],
  loi: [['Keeping other sessions after a password change.', 'Giữ phiên khác sau khi đổi mật khẩu.'], ['Reusing the session at sign-in.', 'Dùng lại phiên khi đăng nhập.']],
  kn: ['session fixation'],
});

export default doiDau({ slug: 'auth-3-3-tai-sinh-phien', ten: '3.3 New session on every privilege change', khoa: KHOA, baiHoc: 'auth-3-3-tai-sinh-phien', de: [S1, S2, S3, S4] });
