/** Authentication · 12.1 — First five minutes; write diagnose(status) mapping an HTTP status to the broken layer. */
import { doiDau, KHOA, cs, q, ord, tn, jsBai, nguon, goi } from './_auth.mjs';

const S1 = cs({
  ten: '12.1-1 — Measure before you guess', kho: 'EASY', phut: 8,
  en: '"Users cannot log in." Curl the login route and read the HTTP status — it narrows the problem to a layer before you read code.',
  vi: '"Người dùng không đăng nhập được." Curl tuyến đăng nhập và đọc mã HTTP — nó thu hẹp vấn đề về một tầng trước khi bạn đọc mã.',
  cau: [
    q('c1', ['A login route returns 404, but the handler is clearly in the source. Most likely cause?', 'Một tuyến đăng nhập trả 404, nhưng handler rõ ràng có trong nguồn. Nguyên nhân khả dĩ nhất?'],
      ['A stale or partial build — the running image lacks the route; redeploy a clean build, do not edit code', 'The password hashing is misconfigured and rejects everyone', 'The user is authenticated but forbidden from the route', 'The access token in the request has expired'],
      ['404 on a route that exists in source is almost always a stale/partial build, not a code bug (12.1).', '404 trên một tuyến có trong nguồn gần như luôn là một build cũ/một phần, không phải lỗi mã (12.1).']),
    q('c2', ['You get a 403 on the login flow. What should you NOT waste time on?', 'Bạn nhận một 403 trên luồng đăng nhập. Bạn KHÔNG nên phí thời gian vào cái gì?'],
      ['The password and the hashing — 403 is authorization (known but forbidden), not authentication', 'The load balancer configuration and its health checks', 'The database connection pool size and timeouts', 'The TLS certificate and its expiry date'],
      ['403 means the user is known but forbidden — look at authorization (role/tenant), not the password (12.1, 9).', '403 nghĩa là người dùng được biết nhưng bị cấm — nhìn phân quyền (vai/tenant), không phải mật khẩu (12.1, 9).']),
    q('c3', ['The login route returns 200 but users say they are "not logged in". Where is the problem?', 'Tuyến đăng nhập trả 200 nhưng người dùng nói họ "không đăng nhập". Vấn đề ở đâu?'],
      ['After login — the session cookie (flags, SameSite), a redirect, or the client not sending credentials', 'In the password hashing function being too slow to complete', 'In the database being completely down and unreachable', 'In the signing key being missing from the keyring'],
      ['A 200 means login works; the problem is after it — the cookie or the client (12.1, 3).', 'Một 200 nghĩa là đăng nhập chạy; vấn đề ở sau nó — cookie hay client (12.1, 3).']),
  ],
  goiY: [['The status narrows the problem to a layer.', 'Mã trạng thái thu hẹp vấn đề về một tầng.'], ['Change one thing at a time.', 'Đổi một thứ một lần.']],
  loi: [['Reading the code before measuring the status.', 'Đọc mã trước khi đo mã trạng thái.'], ['Debugging the password on a 403.', 'Debug mật khẩu trên một 403.']],
  tns: [tn('status-first diagnosis', 'chẩn đoán mã-trạng-thái-trước'), tn('stale build', 'build cũ')],
  kn: ['authentication'],
});

function diagnose(status) {
  // Map a login-endpoint HTTP status to the broken layer, so you know which chapter to open.
  if (status === 404) return 'stale-build';      // route not mounted — redeploy, do not edit code
  if (status === 500) return 'dependency';       // a secret/DB/Redis is down — read the log + startup banner
  if (status === 403) return 'authorization';    // known but forbidden (Ch9) — not the password
  if (status === 401) return 'pipe-intact';      // mounted, asking for credentials — try a real login
  if (status === 200) return 'past-login';       // login works — the problem is the cookie/redirect/client
  return 'unexpected';
}
const S2 = jsBai({
  ten: '12.1-2 — Write diagnose(status): status ⇒ broken layer', kho: 'EASY', phut: 8,
  en: `<p>Map a login-endpoint HTTP status to the layer to investigate: <code>404 ⇒ 'stale-build'</code>, <code>500 ⇒ 'dependency'</code>, <code>403 ⇒ 'authorization'</code>, <code>401 ⇒ 'pipe-intact'</code>, <code>200 ⇒ 'past-login'</code>. Anything else ⇒ <code>'unexpected'</code>.</p>`,
  vi: `<p>Ánh xạ một mã HTTP của endpoint đăng nhập tới tầng cần điều tra: <code>404 ⇒ 'stale-build'</code>, <code>500 ⇒ 'dependency'</code>, <code>403 ⇒ 'authorization'</code>, <code>401 ⇒ 'pipe-intact'</code>, <code>200 ⇒ 'past-login'</code>. Còn lại ⇒ <code>'unexpected'</code>.</p>`,
  goiY: [['A lookup or a switch over the five known statuses.', 'Một tra bảng hoặc switch trên năm mã biết.'], ['404 is a build problem, not a code bug.', '404 là một vấn đề build, không phải lỗi mã.']],
  loi: [['Returning "authorization" for 401 instead of 403.', 'Trả "authorization" cho 401 thay vì 403.'], ['Not handling an unexpected status.', 'Không xử lý một mã lạ.']],
  gt: ['The status names the broken layer in seconds, before you read any code (12.1).', 'Mã trạng thái gọi tên tầng hỏng trong vài giây, trước khi bạn đọc mã (12.1).'],
  kn: ['authentication'], tns: [tn('404 = stale build', '404 = build cũ')],
  dau: `/** ⇒ the layer to investigate for a given login-endpoint status */
function diagnose(status) {
  // Write your solution here
  return 'unexpected';
}
`,
  giai: '// Reference solution\n' + nguon(diagnose),
  cases: [
    { goi: goi('diagnose', 404), moTa: ['404 ⇒ stale-build', '404 ⇒ build cũ'] },
    { goi: goi('diagnose', 500), an: true, moTa: ['500 ⇒ dependency', '500 ⇒ phụ thuộc'] },
    { goi: goi('diagnose', 403), an: true, moTa: ['403 ⇒ authorization', '403 ⇒ phân quyền'] },
    { goi: goi('diagnose', 401), an: true, moTa: ['401 ⇒ pipe-intact', '401 ⇒ ống nguyên vẹn'] },
    { goi: goi('diagnose', 418), an: true, moTa: ['other ⇒ unexpected', 'khác ⇒ unexpected'] },
  ],
});

const S3 = cs({
  ten: '12.1-3 — Order the diagnosis', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order the first steps of diagnosing "users cannot log in".',
  vi: 'Xếp các bước đầu chẩn đoán "người dùng không đăng nhập được".',
  cau: [ord('o1', ['First → next', 'Đầu → tiếp'], [
    'Curl the login route unauthenticated and read the HTTP status',
    'Map the status to a layer (404 stale, 500 dependency, 403 authz, 401 pipe, 200 past-login)',
    'Open that layer\'s chapter and change one thing at a time',
  ], ['Measure the status, map it to a layer, then investigate that layer one change at a time (12.1).', 'Đo mã, ánh xạ nó tới một tầng, rồi điều tra tầng đó một thay đổi một lần (12.1).'])],
  goiY: [['Measure before you read code.', 'Đo trước khi đọc mã.'], ['The status chooses where to look.', 'Mã trạng thái chọn chỗ nhìn.']],
  loi: [['Opening the code before measuring.', 'Mở mã trước khi đo.'], ['Changing three things at once.', 'Đổi ba thứ cùng lúc.']],
  tns: [tn('one change at a time', 'một thay đổi một lần')],
  kn: ['authentication'],
});

export default doiDau({ slug: 'auth-12-1-nam-phut-dau', ten: '12.1 First five minutes', khoa: KHOA, baiHoc: 'auth-12-1-nam-phut-dau', de: [S1, S2, S3] });
