/** Authentication · 12.2 — Eight shapes; write causeOf(shape) mapping a failure shape to its chapter. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '12.2-1 — Read the shape, not the message', kho: 'EASY', phut: 8,
  en: 'The pattern of who is affected and when points at the cause faster than any single error message.',
  vi: 'Dáng của ai bị ảnh hưởng và khi nào chỉ ra nguyên nhân nhanh hơn bất kỳ thông điệp lỗi nào.',
  cau: [
    q('c1', ['Login works, then every request 401s exactly ~15 minutes later. Which shape?', 'Đăng nhập chạy, rồi mọi request 401 đúng ~15 phút sau. Dáng nào?'],
      ['The access token expired and refresh is broken — the 15-minute clock is the tell (Ch5)', 'A cookie SameSite problem that only the browser enforces', 'A stale build that is missing the login route entirely', 'A database outage that happens on a fixed schedule'],
      ['The exact 15-minute clock is the access-token lifetime; refresh is broken, not the login (12.2, 5.1).', 'Cái đồng hồ 15 phút chính xác là vòng đời access token; refresh hỏng, không phải đăng nhập (12.2, 5.1).']),
    q('c2', ['Everyone was logged out at once. Most likely cause?', 'Tất cả bị đăng xuất cùng lúc. Nguyên nhân khả dĩ nhất?'],
      ['The signing key or session secret changed with no overlap — a bad rotation (11.2)', 'One specific user changed their own password just now', 'The browser cleared its cookies on a routine update', 'A single API call returned the wrong audience claim'],
      ['A mass logout is a rotation with no overlap — no token verifies any more (12.2, 11.2).', 'Một lần đăng xuất hàng loạt là một lần xoay không chồng lấn — không token nào xác minh được (12.2, 11.2).']),
    q('c3', ['It works in Postman but fails in the browser. What does that point at?', 'Nó chạy trong Postman nhưng hỏng ở trình duyệt. Điều đó chỉ vào cái gì?'],
      ['A cookie rule the browser enforces — SameSite, Secure on http, or CORS without credentials (Ch3)', 'The password hashing function somehow running too slowly only when the request comes from a web browser', 'The signing key being configured as a completely different value specifically for browser-based clients', 'The database silently rejecting incoming connections whenever the originating request came from a browser'],
      ['The browser enforces rules Postman does not — SameSite/Secure/CORS (12.2, 3).', 'Trình duyệt thực thi các luật Postman không — SameSite/Secure/CORS (12.2, 3).']),
  ],
  goiY: [['Who (everyone/new/one) and when (now/15min/browser/load) pick the shape.', 'Ai (tất cả/mới/một) và khi nào (ngay/15 phút/trình duyệt/tải) chọn dáng.'], ['A single "401" is contentless.', 'Một "401" đơn lẻ vô nội dung.']],
  loi: [['Chasing the error message instead of the pattern.', 'Đuổi thông điệp lỗi thay vì dáng.'], ['Debugging the login when the shape says look past it.', 'Debug đăng nhập khi dáng bảo nhìn qua nó.']],
  tns: [tn('failure shape', 'dáng hỏng')],
  kn: ['authentication'],
});

const SHAPE = { mass_logout: 'rotation', new_logins_fail: 'signing-key', ok_then_401_15min: 'refresh', postman_ok_browser_fail: 'cookie', one_user: 'account', intermittent_401: 'instances', login_ok_api_401: 'audience', fivexx_under_load: 'dependency' };
function causeOf(shape) {
  // Map a named failure shape to the layer/cause it points at. An unknown shape ⇒ 'investigate'.
  return SHAPE[shape] || 'investigate';
}
const S2 = jsBai({
  ten: '12.2-2 — Write causeOf(shape): shape ⇒ cause', kho: 'MEDIUM', phut: 10,
  en: `<p>Map a named failure shape to its cause: <code>mass_logout ⇒ 'rotation'</code>, <code>new_logins_fail ⇒ 'signing-key'</code>, <code>ok_then_401_15min ⇒ 'refresh'</code>, <code>postman_ok_browser_fail ⇒ 'cookie'</code>, <code>one_user ⇒ 'account'</code>, <code>intermittent_401 ⇒ 'instances'</code>, <code>login_ok_api_401 ⇒ 'audience'</code>, <code>fivexx_under_load ⇒ 'dependency'</code>. An unknown shape ⇒ <code>'investigate'</code>.</p>`,
  vi: `<p>Ánh xạ một dáng hỏng có tên tới nguyên nhân: <code>mass_logout ⇒ 'rotation'</code>, <code>new_logins_fail ⇒ 'signing-key'</code>, <code>ok_then_401_15min ⇒ 'refresh'</code>, <code>postman_ok_browser_fail ⇒ 'cookie'</code>, <code>one_user ⇒ 'account'</code>, <code>intermittent_401 ⇒ 'instances'</code>, <code>login_ok_api_401 ⇒ 'audience'</code>, <code>fivexx_under_load ⇒ 'dependency'</code>. Một dáng lạ ⇒ <code>'investigate'</code>.</p>`,
  goiY: [['A lookup table maps the eight shapes.', 'Một bảng tra ánh xạ tám dáng.'], ['An unknown shape defaults to investigate.', 'Một dáng lạ mặc định investigate.']],
  loi: [['Mapping ok_then_401_15min to cookie instead of refresh.', 'Ánh xạ ok_then_401_15min tới cookie thay vì refresh.'], ['Returning undefined for an unknown shape.', 'Trả undefined cho một dáng lạ.']],
  gt: ['Each shape names the layer to open; the mapping turns a pattern into a diagnosis (12.2).', 'Mỗi dáng gọi tên tầng để mở; ánh xạ biến một dáng thành một chẩn đoán (12.2).'],
  kn: ['authentication'], tns: [tn('who + when', 'ai + khi nào')],
  dau: `const SHAPE = { mass_logout: 'rotation', new_logins_fail: 'signing-key', ok_then_401_15min: 'refresh', postman_ok_browser_fail: 'cookie', one_user: 'account', intermittent_401: 'instances', login_ok_api_401: 'audience', fivexx_under_load: 'dependency' };
/** ⇒ the cause a failure shape points at */
function causeOf(shape) {
  // Write your solution here
  return 'investigate';
}
`,
  giai: `const SHAPE = { mass_logout: 'rotation', new_logins_fail: 'signing-key', ok_then_401_15min: 'refresh', postman_ok_browser_fail: 'cookie', one_user: 'account', intermittent_401: 'instances', login_ok_api_401: 'audience', fivexx_under_load: 'dependency' };
` + '// Reference solution\n' + nguon(causeOf),
  cases: [
    { goi: goi('causeOf', 'ok_then_401_15min'), moTa: ['15-min ⇒ refresh', '15-phút ⇒ refresh'] },
    { goi: goi('causeOf', 'mass_logout'), an: true, moTa: ['mass logout ⇒ rotation', 'đăng xuất hàng loạt ⇒ rotation'] },
    { goi: goi('causeOf', 'postman_ok_browser_fail'), an: true, moTa: ['browser-only ⇒ cookie', 'chỉ-trình-duyệt ⇒ cookie'] },
    { goi: goi('causeOf', 'something_new'), an: true, moTa: ['unknown ⇒ investigate', 'lạ ⇒ investigate'] },
  ],
});

const S3 = cs({
  ten: '12.2-3 — Shape → chapter', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each failure shape to the chapter it points at.',
  vi: 'Ghép mỗi dáng hỏng với chương nó chỉ vào.',
  bang: [bang1('b1', ['Shape → chapter', 'Dáng → chương'], [{ ma: 'x', ten: 'Shape' }, { ma: 'q', ten: 'Chapter', luaChon: ['refresh (5)', 'rotation (11.2)', 'cookie (3)'] }], [
    { o: { x: 'works, then 401 after 15 min' }, a: { q: 'refresh (5)' } },
    { o: { x: 'everyone logged out at once' }, a: { q: 'rotation (11.2)' } },
    { o: { x: 'Postman ok, browser fails' }, a: { q: 'cookie (3)' } },
  ], ['The 15-min shape is refresh; mass logout is rotation; browser-only is a cookie rule (12.2).', 'Dáng 15-phút là refresh; đăng xuất hàng loạt là rotation; chỉ-trình-duyệt là một luật cookie (12.2).'])],
  goiY: [['The exact clock is the access-token lifetime.', 'Cái đồng hồ chính xác là vòng đời access token.'], ['The browser enforces cookie rules Postman does not.', 'Trình duyệt thực thi luật cookie Postman không.']],
  loi: [['Matching the 15-min shape to a cookie.', 'Ghép dáng 15-phút với một cookie.'], ['Matching mass logout to the account.', 'Ghép đăng xuất hàng loạt với tài khoản.']],
  tns: [tn('15-minute clock', 'đồng hồ 15 phút')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-12-2-tam-hinh-dang', ten: '12.2 Eight shapes', khoa: KHOA, baiHoc: 'auth-12-2-tam-hinh-dang', de: [S1, S2, S3] });
