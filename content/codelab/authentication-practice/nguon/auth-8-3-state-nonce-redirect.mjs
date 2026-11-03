/** Authentication · 8.3 — state/nonce/redirect_uri: đọc output; viết redirectUriAllowed; sắp + bảng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s08/_ma.mjs';
const OF = OUT['81-oidc-flow'].split('\n').slice(1);
const S1 = cs({
  ten: '8.3-1 — Three parameters, three attacks', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.8 (real run):${pre(OF.filter((l)=>l.includes('state')||l.includes('nonce')||l.includes('redirect_uri')))}`,
  vi: `LabFlow ID v0.8 (chạy thật):${pre(OF.filter((l)=>l.includes('state')||l.includes('nonce')||l.includes('redirect_uri')))}`,
  cau: [
    q('c1', ['What does state defend, and who checks it?', 'state phòng gì, và ai kiểm nó?'],
      ['CSRF on the callback; the CLIENT issues a random state and checks the callback echoes it', 'ID-token replay across sessions; the provider checks it for you', 'Authorization-code theft; the resource server is the one that checks it', 'Nothing security-relevant; it is just a correlation id for logs'],
      ['state stops login-CSRF: the client ties it to a login it started and rejects a callback it did not issue (8.3).', 'state chặn login-CSRF: client gắn nó với một đăng nhập nó bắt đầu và từ chối một callback nó không phát (8.3).']),
    q('c2', ['An ID token is validly signed and unexpired but its nonce is not the one the client sent. Then?', 'Một ID token ký hợp lệ và chưa hết hạn nhưng nonce không phải cái client gửi. Rồi sao?'],
      ['Reject it (bad_nonce) — the nonce ties the token to THIS login; a mismatch means replay', 'Accept it, because the cryptographic signature is perfectly valid', 'Accept it but downgrade the resulting session to read-only', 'Reject it only if the token has also already expired'],
      ['A valid signature is not enough; the nonce binds the token to the client’s own request (8.3).', 'Một chữ ký hợp lệ chưa đủ; nonce gắn token với yêu cầu của chính client (8.3).']),
    q('c3', ['redirect_uri=https://app.labflow.example.evil.com — what must the provider do?', 'redirect_uri=https://app.labflow.example.evil.com — provider phải làm gì?'],
      ['Reject with 400 and NOT redirect — exact match against the registered list; a prefix match is an open redirect', 'Redirect the browser there anyway, attaching an error parameter', 'Accept it, since the registered domain is a prefix of this one', 'Send the authorization code there and let the client sort it out'],
      ['Exact match only; a prefix hands the code to the attacker, and an invalid redirect must not be redirected to (8.3).', 'Chỉ khớp chính xác; một tiền tố trao code cho kẻ tấn công, và một redirect không hợp lệ không được redirect tới (8.3).']),
  ],
  goiY: [['Two checks are on the client, one on the provider.', 'Hai phép ở client, một ở provider.'], ['nonce lives inside the token.', 'nonce sống trong token.']],
  loi: [['Thinking a valid signature makes a token trustworthy.', 'Tưởng một chữ ký hợp lệ làm một token đáng tin.'], ['Prefix-matching redirect_uri.', 'Khớp tiền tố redirect_uri.']],
  tns: [tn('login CSRF', 'login CSRF'), tn('open redirect', 'open redirect')],
  kn: ['authentication'],
});
function redirectUriAllowed(uri, allow) {
  const list = Array.isArray(allow) ? allow : [allow];
  return list.includes(uri);   // EXACT match — never a prefix or substring
}
const S2 = jsBai({
  ten: '8.3-2 — Write redirectUriAllowed(uri, allow): exact match only', kho: 'EASY', phut: 8,
  en: `<p>The provider sends the code only to a pre-registered redirect_uri. Return <code>true</code> only if <code>uri</code> is on the <code>allow</code> list (a string or array), matched <b>exactly</b>. A prefix or substring match is an open redirect: <code>https://app.example.evil.com</code> must NOT pass for <code>https://app.example</code>.</p>`,
  vi: `<p>Provider gửi code chỉ tới một redirect_uri đã đăng ký trước. Trả <code>true</code> chỉ khi <code>uri</code> nằm trong danh sách <code>allow</code> (một chuỗi hoặc mảng), khớp <b>chính xác</b>. Một khớp tiền tố hay chuỗi con là một open redirect: <code>https://app.example.evil.com</code> KHÔNG được lọt cho <code>https://app.example</code>.</p>`,
  goiY: [['Normalise allow to an array, then check membership.', 'Chuẩn hoá allow về mảng, rồi kiểm thành viên.'], ['Use exact equality, not startsWith/includes-on-string.', 'Dùng bằng chính xác, không startsWith/includes-trên-chuỗi.']],
  loi: [['Using startsWith (prefix) or String.includes (substring).', 'Dùng startsWith (tiền tố) hoặc String.includes (chuỗi con).'], ['Accepting any https URL.', 'Nhận bất kỳ URL https nào.']],
  gt: ['Exact-match redirect validation stops the open-redirect code theft; a loose match hands the code to a lookalike domain (8.3).', 'Kiểm redirect khớp chính xác chặn trộm code qua open-redirect; một khớp lỏng trao code cho một tên miền nhìn-giống (8.3).'],
  kn: ['authentication'], tns: [tn('redirect_uri', 'redirect_uri')],
  dau: `/** ⇒ true only if uri is exactly an allowed redirect */
function redirectUriAllowed(uri, allow) {
  // Write your solution here
  return true;
}
`,
  giai: '// Reference solution\n' + nguon(redirectUriAllowed),
  cases: [
    { goi: goi('redirectUriAllowed', 'http://localhost:4810/callback', 'http://localhost:4810/callback'), moTa: ['exact', 'chính xác'] },
    { goi: goi('redirectUriAllowed', 'https://app.example.evil.com', 'https://app.example'), an: true, moTa: ['lookalike ⇒ false', 'nhìn-giống ⇒ false'] },
    { goi: goi('redirectUriAllowed', 'https://b.example', ['https://a.example', 'https://b.example']), an: true, moTa: ['in the list', 'trong danh sách'] },
    { goi: goi('redirectUriAllowed', 'https://app.example/x', 'https://app.example'), an: true, moTa: ['extra path ⇒ false', 'thêm path ⇒ false'] },
  ],
});
const S3 = cs({
  ten: '8.3-3 — Order an audit of the three', kho: 'EASY', phut: 6, loai: 'order',
  en: 'A login is failing checks. Order where you would look, from the client-side request state to the provider-side redirect.',
  vi: 'Một đăng nhập đang trượt kiểm. Xếp nơi bạn sẽ nhìn, từ state phía-client tới redirect phía-provider.',
  cau: [ord('o1', ['Request → provider', 'Request → provider'], [
    'state — did the client issue and re-check the value on the callback?',
    'nonce — did the client put one in, and does the ID token echo it?',
    'redirect_uri — does the provider match it exactly against the allow-list?',
  ], ['state and nonce are the client’s request/response checks; redirect_uri is the provider’s (8.3).', 'state và nonce là phép kiểm request/response của client; redirect_uri là của provider (8.3).'])],
  goiY: [['Client first (what it sent), provider last (what it allowed).', 'Client trước (nó gửi gì), provider cuối (nó cho phép gì).'], ['state and nonce are both the client\u2019s; redirect_uri is the provider\u2019s.', 'state và nonce đều của client; redirect_uri của provider.']],
  loi: [['Putting redirect_uri on the client.', 'Đặt redirect_uri ở client.'], ['Thinking the provider checks state.', 'Tưởng provider kiểm state.']],
  tns: [tn('nonce', 'nonce')],
  kn: ['authentication'],
});
const S4 = cs({
  ten: '8.3-4 — Parameter → attack it stops', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each parameter with the attack it stops.',
  vi: 'Ghép mỗi tham số với cú tấn công nó chặn.',
  bang: [bang1('b1', ['Param → attack', 'Tham số → tấn công'], [{ ma: 'x', ten: 'Param' }, { ma: 'q', ten: 'Stops', luaChon: ['CSRF on the callback', 'ID-token replay', 'code theft via open redirect'] }], [
    { o: { x: 'state' }, a: { q: 'CSRF on the callback' } },
    { o: { x: 'nonce' }, a: { q: 'ID-token replay' } },
    { o: { x: 'redirect_uri' }, a: { q: 'code theft via open redirect' } },
  ], ['state ⟂ CSRF, nonce ⟂ replay, redirect_uri ⟂ code theft — each closes one specific attack (8.3).', 'state ⟂ CSRF, nonce ⟂ phát lại, redirect_uri ⟂ trộm code — mỗi cái đóng một cú cụ thể (8.3).'])],
  goiY: [['nonce lives in the token; state on the request.', 'nonce sống trong token; state ở request.'], ['redirect_uri is the provider\u2019s exact-match defence.', 'redirect_uri là phòng khớp-chính-xác của provider.']],
  loi: [['Swapping state and nonce.', 'Đổi chỗ state và nonce.'], ['Thinking redirect_uri stops replay.', 'Tưởng redirect_uri chặn phát lại.']],
  kn: ['authentication'],
});
export default doiDau({ slug: 'auth-8-3-state-nonce-redirect', ten: '8.3 state/nonce/redirect', khoa: KHOA, baiHoc: 'auth-8-3-state-nonce-redirect', de: [S1, S2, S3, S4] });
