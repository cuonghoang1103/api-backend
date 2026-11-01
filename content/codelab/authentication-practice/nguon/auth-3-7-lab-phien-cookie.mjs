/** Authentication · Lab 3 — Lớp phiên của LabFlow ID, bản JavaScript thuần chạy trong trình duyệt: start (cookie __Host-, huỷ phiên cũ,
 *  lưu digest), load (hai mốc hết hạn, chạm có giới hạn, xoá cookie), end (xoá dòng + xoá cookie đúng thuộc tính). Cùng hành vi với
 *  máy chấm scripts/cham-lab-3.mjs (T1–T7); phần CSRF trong trình duyệt thật chỉ chạy được ở máy chấm của dự án (bài 3.4 có đề riêng). */
import { doiDau, KHOA, tn, jsBai, nguon, pre, TRO_GIUP } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s03/_ma.mjs';

const CHAM = OUT['lab-yeu'].split('\n').filter((l) => /^[✓✗] T|TOTAL/.test(l));
const HELP = TRO_GIUP + `// ── provided ──
function digest(token) { return hex(sha256(utf8(token))); }   // = tokenDigest() of lesson 1.3
function readCookie(header, name) {                            // lesson 0.1's parser
  var parts = String(header || '').split(';');
  for (var i = 0; i < parts.length; i++) { var j = parts[i].indexOf('='); if (j > 0 && parts[i].slice(0, j).trim() === name) return parts[i].slice(j + 1).trim(); }
  return null;
}
var ATTRS = 'Path=/; HttpOnly; Secure; SameSite=Lax';
`;
const T0 = Date.UTC(2026, 10, 2);

function start(store, cookieHeader, userId, freshToken, now) {
  var old = readCookie(cookieHeader, '__Host-lfid_ses');
  if (old) delete store[digest(old)];                                 // the session the browser carried dies
  store[digest(freshToken)] = { userId: userId, createdAt: now, expiresAt: now + 12 * 3600e3, lastSeenAt: now };
  return '__Host-lfid_ses=' + freshToken + '; ' + ATTRS + '; Max-Age=43200';
}
const run1 = (seed, cookie, user, fresh) => `(function () { var store = {}; ${seed}
  var setCookie = start(store, ${JSON.stringify(cookie)}, ${JSON.stringify(user)}, ${JSON.stringify(fresh)}, ${T0});
  return { setCookie: setCookie, rows: Object.keys(store).sort().map(function (k) { return store[k].userId; }), tokenStored: JSON.stringify(store).indexOf(${JSON.stringify(fresh)}) >= 0 }; })()`;
const L1 = jsBai({
  ten: 'Lab 3.1 — start(store, cookieHeader, userId, freshToken, now)', kho: 'MEDIUM', phut: 20, dangBai: 'lab',
  en: `<p><code>store</code> maps a <b>digest</b> to a session row. At sign-in: if the request's <code>Cookie</code> header carries <code>__Host-lfid_ses</code>, delete that session (<code>store[digest(old)]</code>); then store <code>{ userId, createdAt: now, expiresAt: now + 12 h, lastSeenAt: now }</code> under <code>digest(freshToken)</code> — never the token itself — and return the Set-Cookie value <code>__Host-lfid_ses=&lt;freshToken&gt;; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200</code> (<code>ATTRS</code> is provided). The first attempt of the lab failed here:${pre(CHAM.filter((l) => /T1|T2|T3/.test(l)))}</p>`,
  vi: `<p><code>store</code> ánh xạ một <b>digest</b> tới một dòng phiên. Khi đăng nhập: nếu header <code>Cookie</code> của request mang <code>__Host-lfid_ses</code>, xoá phiên đó (<code>store[digest(old)]</code>); rồi lưu <code>{ userId, createdAt: now, expiresAt: now + 12 h, lastSeenAt: now }</code> dưới <code>digest(freshToken)</code> — không bao giờ lưu chính token — và trả về giá trị Set-Cookie <code>__Host-lfid_ses=&lt;freshToken&gt;; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200</code> (<code>ATTRS</code> cho sẵn). Lần thử đầu của lab trượt ở đây:${pre(CHAM.filter((l) => /T1|T2|T3/.test(l)))}</p>`,
  goiY: [['readCookie(cookieHeader, "__Host-lfid_ses") gives the old token or null.', 'readCookie(cookieHeader, "__Host-lfid_ses") cho token cũ hoặc null.'], ['Key = digest(token), always.', 'Khoá = digest(token), luôn luôn.']],
  loi: [['Keeping the old session (fixation).', 'Giữ phiên cũ (fixation).'], ['store[freshToken] = … — a dump becomes a list of live sessions.', 'store[freshToken] = … — bản dump thành danh sách phiên còn sống.']],
  gt: ['Three properties in eight lines: a planted session dies, a leaked store holds only digests, and the cookie carries every attribute lesson 3.2 measured.', 'Ba tính chất trong tám dòng: phiên bị cài chết, kho bị lộ chỉ chứa digest, và cookie mang đủ mọi thuộc tính bài 3.2 đã đo.'],
  kn: ['session fixation'], tns: [tn('digest', 'bản băm')],
  dau: HELP + `
/** ⇒ the Set-Cookie value */
function start(store, cookieHeader, userId, freshToken, now) {
  // Write your solution here
  store[freshToken] = { userId: userId, lastSeenAt: now };
  return '__Host-lfid_ses=' + freshToken + '; Path=/; HttpOnly; Secure';
}
`,
  giai: HELP + '\n// Reference solution\n' + nguon(start),
  cases: [
    { goi: run1('', '', 'usr_1', 'lfid_ses_AAA'), moTa: ['A first sign-in', 'Đăng nhập lần đầu'] },
    { goi: run1("store[digest('lfid_ses_BINH')] = { userId: 'usr_2', expiresAt: 9e15, lastSeenAt: 0 };", '__Host-lfid_ses=lfid_ses_BINH', 'usr_1', 'lfid_ses_NEW'), moTa: ['Bình’s session planted, An signs in', 'Phiên của Bình bị cài, An đăng nhập'] },
    { goi: run1("store[digest('lfid_ses_X')] = { userId: 'usr_3', expiresAt: 9e15, lastSeenAt: 0 };", 'lang=vi; __Host-lfid_ses=lfid_ses_ZZZ', 'usr_1', 'lfid_ses_N2'), an: true },
  ],
});

function load(store, cookieHeader, now, opt) {
  var token = readCookie(cookieHeader, '__Host-lfid_ses');
  if (!token) return { userId: null, setCookie: null };
  var d = digest(token), s = store[d];
  var clear = '__Host-lfid_ses=; ' + ATTRS + '; Max-Age=0';
  if (!s) return { userId: null, setCookie: clear };
  if (now >= s.expiresAt || now - s.lastSeenAt >= opt.idleMs) { delete store[d]; return { userId: null, setCookie: clear }; }
  if (now - s.lastSeenAt >= opt.touchEveryMs) s.lastSeenAt = now;
  return { userId: s.userId, setCookie: null };
}
const OPT = { idleMs: 30 * 60e3, touchEveryMs: 60e3 };
const run2 = (lastSeenMin, nowMin, cookie = '__Host-lfid_ses=lfid_ses_AN') => `(function () { var store = {}; store[digest('lfid_ses_AN')] = { userId: 'usr_1', createdAt: ${T0}, expiresAt: ${T0 + 12 * 3600e3}, lastSeenAt: ${T0 + lastSeenMin * 60e3} };
  var r = load(store, ${JSON.stringify(cookie)}, ${T0 + nowMin * 60e3}, ${JSON.stringify(OPT)});
  var row = store[digest('lfid_ses_AN')];
  return { userId: r.userId, setCookie: r.setCookie, rowLeft: !!row, lastSeenMin: row ? (row.lastSeenAt - ${T0}) / 60000 : null }; })()`;
const L2 = jsBai({
  ten: 'Lab 3.2 — load(store, cookieHeader, now, opt)', kho: 'HARD', phut: 25, dangBai: 'lab',
  en: `<p>Return <code>{ userId, setCookie }</code> for one request. No cookie ⇒ <code>{ userId: null, setCookie: null }</code>. Unknown digest, <code>now ≥ expiresAt</code> or <code>now − lastSeenAt ≥ idleMs</code> ⇒ delete the row (if any) and return <code>userId: null</code> with <code>setCookie = '__Host-lfid_ses=; ' + ATTRS + '; Max-Age=0'</code>. Otherwise return the user (<code>setCookie: null</code>) and set <code>lastSeenAt = now</code> only if <code>now − lastSeenAt ≥ touchEveryMs</code>. First attempt:${pre(CHAM.filter((l) => /T4|T5|T6/.test(l)))}</p>`,
  vi: `<p>Trả <code>{ userId, setCookie }</code> cho một request. Không có cookie ⇒ <code>{ userId: null, setCookie: null }</code>. Digest lạ, <code>now ≥ expiresAt</code> hoặc <code>now − lastSeenAt ≥ idleMs</code> ⇒ xoá dòng (nếu có) và trả <code>userId: null</code> với <code>setCookie = '__Host-lfid_ses=; ' + ATTRS + '; Max-Age=0'</code>. Còn lại trả người dùng (<code>setCookie: null</code>) và chỉ đặt <code>lastSeenAt = now</code> khi <code>now − lastSeenAt ≥ touchEveryMs</code>. Lần thử đầu:${pre(CHAM.filter((l) => /T4|T5|T6/.test(l)))}</p>`,
  goiY: [['Absolute first, then idle, then touch.', 'Tuyệt đối trước, rồi nhàn rỗi, rồi chạm.'], ['≥ at every boundary.', '≥ ở mọi biên.']],
  loi: [['<= idleMs keeps a session idle exactly 30 min.', '<= idleMs giữ phiên nhàn rỗi đúng 30 phút.'], ['Updating lastSeenAt on every request.', 'Cập nhật lastSeenAt ở mọi request.']],
  gt: ['The server, not Max-Age, decides when a session ends; expired rows are deleted, not left behind; and reads stay reads. This is load() of LabFlow ID v0.3.', 'Máy chủ, không phải Max-Age, quyết định khi nào phiên kết thúc; dòng hết hạn bị xoá chứ không bị bỏ lại; và lần đọc vẫn chỉ là đọc. Đây là load() của LabFlow ID v0.3.'],
  kn: ['session management'], tns: [tn('idle timeout', 'hết hạn nhàn rỗi')],
  dau: HELP + `
/** ⇒ { userId, setCookie } */
function load(store, cookieHeader, now, opt) {
  // Write your solution here
  var token = readCookie(cookieHeader, '__Host-lfid_ses');
  var s = token && store[digest(token)];
  if (s && now - s.lastSeenAt <= opt.idleMs) { s.lastSeenAt = now; return { userId: s.userId, setCookie: null }; }
  return { userId: null, setCookie: null };
}
`,
  giai: HELP + '\n// Reference solution\n' + nguon(load),
  cases: [
    { goi: run2(0, 20), moTa: ['20 min after the last request', '20 phút sau request cuối'] },
    { goi: run2(0, 30), moTa: ['Exactly 30 min idle', 'Nhàn rỗi đúng 30 phút'] },
    { goi: run2(705, 720), an: true, moTa: ['12 h after sign-in, active', '12 giờ sau đăng nhập, đang hoạt động'] },
    { goi: run2(10, 10.5), an: true, moTa: ['30 s after a touch', '30 s sau một lần chạm'] },
    { goi: run2(0, 5, '__Host-lfid_ses=lfid_ses_UNKNOWN'), an: true },
    { goi: run2(0, 5, 'lang=vi'), an: true },
  ],
});

function end(store, cookieHeader) {
  var token = readCookie(cookieHeader, '__Host-lfid_ses');
  if (token) delete store[digest(token)];
  return '__Host-lfid_ses=; ' + ATTRS + '; Max-Age=0';                // same name and attributes, or it is another cookie
}
const run3 = (cookie) => `(function () { var store = {}; store[digest('lfid_ses_AN')] = { userId: 'usr_1' }; store[digest('lfid_ses_PH')] = { userId: 'usr_1' };
  var sc = end(store, ${JSON.stringify(cookie)}); return { setCookie: sc, left: Object.keys(store).length }; })()`;
const L3 = jsBai({
  ten: 'Lab 3.3 — end(store, cookieHeader): sign-out that really signs out', kho: 'EASY', phut: 10, dangBai: 'lab',
  en: `<p>Delete the session the cookie points to (other sessions of the user stay — that is <code>endAll</code>'s job) and return the clearing Set-Cookie <code>'__Host-lfid_ses=; ' + ATTRS + '; Max-Age=0'</code>, even when there was no cookie. The first attempt sent <code>__Host-lfid_ses=deleted</code>:${pre(CHAM.filter((l) => /T7/.test(l)))}</p>`,
  vi: `<p>Xoá phiên mà cookie trỏ tới (các phiên khác của người đó ở lại — đó là việc của <code>endAll</code>) và trả về Set-Cookie xoá <code>'__Host-lfid_ses=; ' + ATTRS + '; Max-Age=0'</code>, kể cả khi không có cookie. Lần thử đầu gửi <code>__Host-lfid_ses=deleted</code>:${pre(CHAM.filter((l) => /T7/.test(l)))}</p>`,
  goiY: [['Same name, same Path/Secure/HttpOnly/SameSite, Max-Age=0.', 'Cùng tên, cùng Path/Secure/HttpOnly/SameSite, Max-Age=0.'], ['Delete by digest.', 'Xoá theo digest.']],
  loi: [['A clearing cookie without Path=/ and Secure: the browser keeps the old one.', 'Cookie xoá thiếu Path=/ và Secure: trình duyệt giữ cái cũ.'], ['Clearing the cookie but not the row: a copied cookie still works.', 'Xoá cookie mà không xoá dòng: cookie bị chép vẫn dùng được.']],
  gt: ['Sign-out has two halves: the server forgets the session (so a copy is useless) and the browser forgets the cookie (same attributes, lesson 3.2’s delete trap).', 'Đăng xuất có hai nửa: máy chủ quên phiên (để bản chép vô dụng) và trình duyệt quên cookie (cùng thuộc tính, bẫy xoá cookie của bài 3.2).'],
  kn: ['session management'], tns: [tn('sign-out', 'đăng xuất')],
  dau: HELP + `
/** ⇒ the clearing Set-Cookie value */
function end(store, cookieHeader) {
  // Write your solution here
  return '__Host-lfid_ses=deleted';
}
`,
  giai: HELP + '\n// Reference solution\n' + nguon(end),
  cases: [
    { goi: run3('__Host-lfid_ses=lfid_ses_AN'), moTa: ['Laptop signs out, the phone stays', 'Laptop đăng xuất, điện thoại ở lại'] },
    { goi: run3(''), an: true },
    { goi: run3('__Host-lfid_ses=lfid_ses_OTHER'), an: true },
  ],
});

export default doiDau({ slug: 'auth-3-7-lab-phien-cookie', ten: 'Lab 3 — LabFlow ID’s session layer', khoa: KHOA, baiHoc: 'auth-3-7-lab-phien-cookie', de: [L1, L2, L3] });
