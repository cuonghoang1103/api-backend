/** Authentication · 3.2 — Thuộc tính cookie: đọc ma trận Chromium 156 thật; tự viết hostCookieProblem (luật __Host-), cookiesSent (SameSite như đo được); bảng thuộc tính → chặn gì. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s03/_ma.mjs';

const CM = OUT['32-cookies'].split('\n').slice(1);
const SS = OUT['32-samesite'].split('\n').slice(1);

const S1 = cs({
  ten: '3.2-1 — What Chromium 156 did with each cookie', kho: 'EASY', phut: 8,
  en: `Real runs in Chromium 156.0.8078.4:${pre(CM)}${pre(SS)}`,
  vi: `Chạy thật trong Chromium 156.0.8078.4:${pre(CM)}${pre(SS)}`,
  cau: [
    q('c1', ['host_path (__Host-path=1; Path=/admin; Secure) shows “stored? no”. What did the user see?', 'host_path (__Host-path=1; Path=/admin; Secure) hiện "stored? no". Người dùng thấy gì?'],
      ['Nothing — the cookie silently does not exist', 'A console error about the __Host- prefix rules', 'A failed request answered with status 400', 'A browser dialog warning about the cookie'],
      ['Broken prefixed cookies are dropped without any error; check the cookie jar, not the console.', 'Cookie tiền tố sai bị bỏ không kèm lỗi nào; hãy kiểm hộp cookie, đừng tìm trong console.']),
    q('c2', ['delete_wrong_path left “scoped” stored. Why?', 'delete_wrong_path để lại "scoped". Vì sao?'],
      ['The original had Path=/me; the delete lacked it', 'Chromium ignores Max-Age=0 on every cookie', 'Only an Expires date in the past deletes a cookie', 'HttpOnly cookies can never be deleted by a server'],
      ['A cookie is identified by name + domain + path; clear it with the same attributes.', 'Một cookie được nhận diện bằng tên + domain + path; xoá phải cùng thuộc tính.']),
    q('c3', ['In the SameSite run, which cookie arrived with the cross-site form POST seconds after login but not 125 s later?', 'Trong lần chạy SameSite, cookie nào đi theo form POST chéo site vài giây sau đăng nhập nhưng không sau 125 s?'],
      ['unset — the 2-minute exception for cookies without SameSite', 'lax — Lax allows POST for 2 minutes', 'strict — Strict is relaxed right after login', 'none — None expires after 2 minutes'],
      ['Explicit Lax is never sent on cross-site POST; only cookies without the attribute get the window. None is always sent.', 'Lax khai rõ không bao giờ đi theo POST chéo site; chỉ cookie không khai thuộc tính mới có cửa sổ đó. None thì luôn được gửi.']),
  ],
  goiY: [['Compare the “stored?” column with the Set-Cookie of each case.', 'So cột "stored?" với Set-Cookie của từng trường hợp.'], ['Find the one line that differs between the two SameSite runs.', 'Tìm dòng duy nhất khác nhau giữa hai lần chạy SameSite.']],
  loi: [['Expecting an error when a cookie is rejected.', 'Chờ một thông báo lỗi khi cookie bị từ chối.'], ['“Lax blocks everything cross-site.”', '"Lax chặn mọi thứ chéo site."']],
  tns: [tn('cookie prefix', 'tiền tố cookie'), tn('SameSite', 'cùng site')],
  kn: ['cookies'],
});

function hostCookieProblem(setCookie) {
  var parts = String(setCookie).split(';').map(function (p) { return p.trim(); });
  var name = parts[0].split('=')[0];
  if (name.indexOf('__Host-') !== 0) return 'NOT_HOST_PREFIX';
  var attrs = parts.slice(1).map(function (p) { return p.toLowerCase(); });
  if (attrs.indexOf('secure') < 0) return 'NO_SECURE';
  if (attrs.some(function (a) { return a.indexOf('domain=') === 0; })) return 'HAS_DOMAIN';
  if (attrs.indexOf('path=/') < 0) return 'PATH_NOT_ROOT';
  return 'OK';
}
const S2 = jsBai({
  ten: '3.2-2 — Write hostCookieProblem(setCookie): the three __Host- rules', kho: 'MEDIUM', phut: 12,
  en: `<p>Given one <code>Set-Cookie</code> value, return why Chromium would drop it as a <code>__Host-</code> cookie, checking in this order: <code>'NOT_HOST_PREFIX'</code> (name does not start with <code>__Host-</code>, case-sensitive), <code>'NO_SECURE'</code>, <code>'HAS_DOMAIN'</code>, <code>'PATH_NOT_ROOT'</code> (no exact <code>Path=/</code>); else <code>'OK'</code>. Attribute names are case-insensitive (our run accepted <code>path=/; secure</code>).</p>`,
  vi: `<p>Cho một giá trị <code>Set-Cookie</code>, trả về lý do Chromium sẽ bỏ nó với tư cách cookie <code>__Host-</code>, kiểm theo thứ tự: <code>'NOT_HOST_PREFIX'</code> (tên không bắt đầu bằng <code>__Host-</code>, phân biệt hoa thường), <code>'NO_SECURE'</code>, <code>'HAS_DOMAIN'</code>, <code>'PATH_NOT_ROOT'</code> (không có đúng <code>Path=/</code>); còn lại <code>'OK'</code>. Tên thuộc tính không phân biệt hoa thường (lần chạy của mình nhận <code>path=/; secure</code>).</p>`,
  goiY: [['split(";"), trim, lower-case the attributes but not the name.', 'split(";"), trim, viết thường thuộc tính nhưng không viết thường tên.'], ['Path=/admin is not Path=/.', 'Path=/admin không phải Path=/.']],
  loi: [['A substring test "path=/" matches "path=/admin".', 'Kiểm chuỗi con "path=/" khớp cả "path=/admin".'], ['Lower-casing the name: "__host-x" is not a prefixed cookie.', 'Viết thường cả tên: "__host-x" không phải cookie có tiền tố.']],
  gt: ['Three rules — Secure, Path=/, no Domain — make the cookie belong to exactly one host, so no subdomain can set or read it; the browser enforces them by silently dropping the cookie.', 'Ba luật — Secure, Path=/, không Domain — khiến cookie thuộc về đúng một host, nên không subdomain nào đặt hay đọc được; trình duyệt áp chúng bằng cách âm thầm bỏ cookie.'],
  kn: ['cookies'], tns: [tn('__Host- prefix', 'tiền tố __Host-')],
  dau: `/** ⇒ 'OK' | 'NOT_HOST_PREFIX' | 'NO_SECURE' | 'HAS_DOMAIN' | 'PATH_NOT_ROOT' */
function hostCookieProblem(setCookie) {
  // Write your solution here
  if (setCookie.indexOf('Secure') < 0) return 'NO_SECURE';
  return 'OK';
}
`,
  giai: '// Reference solution\n' + nguon(hostCookieProblem),
  cases: [
    { goi: goi('hostCookieProblem', '__Host-lfid_ses=lfid_ses_x; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200'), moTa: ['LabFlow ID v0.3', 'LabFlow ID v0.3'] },
    { goi: goi('hostCookieProblem', '__Host-nosecure=1; Path=/; HttpOnly') },
    { goi: goi('hostCookieProblem', '__Host-domain=1; Path=/; Secure; Domain=localhost'), an: true },
    { goi: goi('hostCookieProblem', '__Host-path=1; Path=/admin; Secure'), an: true },
    { goi: goi('hostCookieProblem', '__Host-lower=1; path=/; secure'), an: true },
    { goi: goi('hostCookieProblem', 'sid=1; Path=/; Secure'), an: true },
    { goi: goi('hostCookieProblem', '__Host-nopath=1; Secure'), an: true },
  ],
});

function cookiesSent(cookies, req) {
  return cookies.filter(function (c) {
    if (!req.crossSite) return true;
    if (c.sameSite === 'None') return true;
    if (c.sameSite === 'Strict') return false;
    var topGet = req.topLevel && req.method === 'GET';
    if (c.sameSite === 'Lax') return topGet;
    return topGet || (req.topLevel && req.method === 'POST' && c.ageSec < 120);   // unset: Lax, plus the 2-minute window
  }).map(function (c) { return c.name; });
}
const C = (age) => [{ name: 'strict', sameSite: 'Strict', ageSec: age }, { name: 'lax', sameSite: 'Lax', ageSec: age }, { name: 'none', sameSite: 'None', ageSec: age }, { name: 'unset', sameSite: null, ageSec: age }];
const S3 = jsBai({
  ten: '3.2-3 — Write cookiesSent(cookies, req): SameSite as measured', kho: 'HARD', phut: 18,
  en: `<p>Model what Chromium 156 did in lesson 3.2. <code>cookies = [{ name, sameSite: 'Strict'|'Lax'|'None'|null, ageSec }]</code>, <code>req = { crossSite, topLevel, method }</code>. Return the names sent, in order. Same-site requests carry all. Cross-site: None always; Strict never; Lax only on a top-level GET; no attribute (null) behaves like Lax, <b>plus</b> a top-level POST while the cookie is younger than 120 s. The real run:${pre(SS.slice(1, 6))}</p>`,
  vi: `<p>Mô phỏng điều Chromium 156 đã làm ở bài 3.2. <code>cookies = [{ name, sameSite: 'Strict'|'Lax'|'None'|null, ageSec }]</code>, <code>req = { crossSite, topLevel, method }</code>. Trả về tên các cookie được gửi, theo thứ tự. Request cùng site mang tất cả. Chéo site: None luôn luôn; Strict không bao giờ; Lax chỉ với GET cấp cao nhất; không khai (null) cư xử như Lax, <b>cộng</b> POST cấp cao nhất khi cookie chưa tới 120 s tuổi. Lần chạy thật:${pre(SS.slice(1, 6))}</p>`,
  goiY: [['filter, then map to names.', 'filter, rồi map ra tên.'], ['An image or fetch is not top-level.', 'Ảnh hay fetch không phải cấp cao nhất.']],
  loi: [['Giving the 2-minute window to explicit Lax.', 'Cho cả Lax khai rõ hưởng cửa sổ 2 phút.'], ['Treating null as None.', 'Coi null là None.']],
  gt: ['This is the table you can reproduce from the measurement: the only difference between the two runs is the unset cookie on the form POST. That window is why session cookies always declare SameSite explicitly.', 'Đây là bảng tái tạo được từ phép đo: khác biệt duy nhất giữa hai lần chạy là cookie không khai trên form POST. Cửa sổ đó là lý do cookie phiên luôn khai SameSite rõ ràng.'],
  kn: ['SameSite cookies'], tns: [tn('top-level navigation', 'điều hướng cấp cao nhất')],
  dau: `/** ⇒ names of the cookies the browser attaches */
function cookiesSent(cookies, req) {
  // Write your solution here
  return cookies.filter(function (c) { return !req.crossSite || c.sameSite !== 'Strict'; }).map(function (c) { return c.name; });
}
`,
  giai: '// Reference solution\n' + nguon(cookiesSent),
  cases: [
    { goi: goi('cookiesSent', C(5), { crossSite: true, topLevel: true, method: 'POST' }), moTa: ['Form POST seconds after login', 'Form POST vài giây sau đăng nhập'] },
    { goi: goi('cookiesSent', C(125), { crossSite: true, topLevel: true, method: 'POST' }), moTa: ['Form POST 125 s later', 'Form POST sau 125 s'] },
    { goi: goi('cookiesSent', C(5), { crossSite: true, topLevel: true, method: 'GET' }), an: true },
    { goi: goi('cookiesSent', C(5), { crossSite: true, topLevel: false, method: 'GET' }), an: true },
    { goi: goi('cookiesSent', C(5), { crossSite: true, topLevel: false, method: 'POST' }), an: true },
    { goi: goi('cookiesSent', C(500), { crossSite: false, topLevel: false, method: 'POST' }), an: true },
  ],
});

const STOP = ['a script reading the token', 'the cookie over plain HTTP', 'cross-site POST, fetch, images', 'subdomains setting or receiving it', 'nothing — it widens the cookie'];
const S4 = cs({
  ten: '3.2-4 — What each attribute stops', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Pick what each attribute of a session cookie stops (lesson 3.2’s measurements).',
  vi: 'Chọn thứ mà mỗi thuộc tính của cookie phiên chặn được (số đo của bài 3.2).',
  bang: [bang1('b1', ['Attribute → stops', 'Thuộc tính → chặn'], [{ ma: 'x', ten: 'Attribute' }, { ma: 's', ten: 'Stops', luaChon: STOP }], [
    { o: { x: 'HttpOnly' }, a: { s: 'a script reading the token' } },
    { o: { x: 'Secure' }, a: { s: 'the cookie over plain HTTP' } },
    { o: { x: 'SameSite=Lax' }, a: { s: 'cross-site POST, fetch, images' } },
    { o: { x: '__Host- prefix (Secure, Path=/, no Domain)' }, a: { s: 'subdomains setting or receiving it' } },
    { o: { x: 'Domain=labflow.example' }, a: { s: 'nothing — it widens the cookie' } },
  ], ['Each attribute stops one thing; none stops an XSS using the cookie in place (the email still changed).', 'Mỗi thuộc tính chặn một thứ; không cái nào chặn được XSS dùng cookie tại chỗ (email vẫn bị đổi).'])],
  goiY: [['Think of the measurement behind each one.', 'Nghĩ tới phép đo đằng sau mỗi cái.'], ['Domain never narrows.', 'Domain không bao giờ thu hẹp.']],
  loi: [['“HttpOnly stops XSS.”', '"HttpOnly chặn XSS."'], ['“Domain makes it safer.”', '"Domain làm nó an toàn hơn."']],
  kn: ['cookies'],
});

export default doiDau({ slug: 'auth-3-2-thuoc-tinh-cookie', ten: '3.2 Every cookie attribute, and what it actually stops', khoa: KHOA, baiHoc: 'auth-3-2-thuoc-tinh-cookie', de: [S1, S2, S3, S4] });
