/** Authentication · 8.1 — OAuth là gì: đọc discovery; viết tokenAudience; sắp + bảng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s08/_ma.mjs';
const OF = OUT['81-oidc-flow'].split('\n').slice(1);
const S1 = cs({
  ten: '8.1-1 — OAuth vs OIDC, read the discovery', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.8 as an OIDC provider:${pre(OF.slice(0, 5))}`,
  vi: `LabFlow ID v0.8 là một OIDC provider:${pre(OF.slice(0, 5))}`,
  cau: [
    q('c1', ['A teammate says "we use OAuth to log users in". The precise correction?', 'Một đồng đội nói "ta dùng OAuth để đăng nhập". Chỉnh lại chính xác?'],
      ['OAuth is authorization (delegated access); login is OpenID Connect, which adds an ID token', 'OAuth and OpenID Connect are two names for the exact same protocol', 'OAuth logs users in directly; OIDC is only needed for mobile apps', 'OAuth manages sessions while OIDC manages API keys for services'],
      ['OAuth delegates access and never says who the user is; OIDC adds an ID token for identity (8.1).', 'OAuth uỷ quyền truy cập và không bao giờ nói người dùng là ai; OIDC thêm một ID token cho danh tính (8.1).']),
    q('c2', ['discovery shows code_challenge_methods_supported ["S256"] and no "plain". What does that mean?', 'discovery khai code_challenge_methods_supported ["S256"] và không "plain". Nghĩa là gì?'],
      ['PKCE is required and only the strong S256 method is offered', 'User passwords must now be at least 256 bits of entropy', 'The provider is currently down and only offering a fallback', 'Only native mobile apps, not web clients, may connect to it'],
      ['S256-only means every client must use PKCE with a SHA-256 challenge; plain is deliberately absent (8.1, OAuth 2.1).', 'Chỉ S256 nghĩa là mọi client phải dùng PKCE với challenge SHA-256; plain cố ý vắng (8.1, OAuth 2.1).']),
    q('c3', ['Why can a client NOT read the user identity from the access token?', 'Vì sao một client KHÔNG đọc danh tính người dùng từ access token được?'],
      ['The access token is for the resource server and may be opaque; identity comes from the ID token', 'Access tokens are encrypted so the client cannot read them at all', 'Access tokens are too short to hold a user identifier', 'The browser strips the identity claims out before the client sees them'],
      ['The access token targets the API and may be opaque; use the ID token’s verified claims for identity (8.1, 8.4).', 'Access token nhắm API và có thể mờ đục; dùng claim đã xác minh của ID token cho danh tính (8.1, 8.4).']),
  ],
  goiY: [['Authorization answers "allowed?"; authentication answers "who?".', 'Uỷ quyền trả lời "được phép?"; xác thực trả lời "ai?".'], ['The ID token is the identity half.', 'ID token là nửa danh tính.']],
  loi: [['Calling OAuth "login".', 'Gọi OAuth là "đăng nhập".'], ['Reading identity from an access token.', 'Đọc danh tính từ một access token.']],
  tns: [tn('OAuth 2.1', 'OAuth 2.1'), tn('OpenID Connect', 'OpenID Connect')],
  kn: ['authentication'],
});
function tokenAudience(kind) {
  // The ID token is for the client; the access token is for the API (resource server).
  if (kind === 'id') return 'client';
  if (kind === 'access') return 'api';
  return 'unknown';
}
const S2 = jsBai({
  ten: '8.1-2 — Write tokenAudience(kind): who each token is for', kho: 'EASY', phut: 8,
  en: `<p>Return who a token’s audience is: an <code>'id'</code> token is for the <code>'client'</code> (it reads the claims); an <code>'access'</code> token is for the <code>'api'</code> (resource server, opaque to the client); anything else ⇒ <code>'unknown'</code>. Confusing the two is a classic bypass.</p>`,
  vi: `<p>Trả về audience của một token là ai: một token <code>'id'</code> dành cho <code>'client'</code> (nó đọc claim); một token <code>'access'</code> dành cho <code>'api'</code> (máy chủ tài nguyên, mờ đục với client); còn lại ⇒ <code>'unknown'</code>. Lẫn hai cái là một cú bypass kinh điển.</p>`,
  goiY: [['The ID token is consumed by the client.', 'ID token được client tiêu.'], ['The access token is for the API.', 'Access token dành cho API.']],
  loi: [['Swapping the two audiences.', 'Đổi chỗ hai audience.'], ['Returning a value for an unknown kind.', 'Trả một giá trị cho một kind lạ.']],
  gt: ['The ID token answers "who logged in" for the client; the access token is a pass for the API — never authenticate with it (8.4).', 'ID token trả lời "ai đã đăng nhập" cho client; access token là một tấm vé cho API — đừng xác thực bằng nó (8.4).'],
  kn: ['authentication'], tns: [tn('audience (aud)', 'audience (aud)')],
  dau: `/** ⇒ 'client' | 'api' | 'unknown' */
function tokenAudience(kind) {
  // Write your solution here
  return 'client';
}
`,
  giai: '// Reference solution\n' + nguon(tokenAudience),
  cases: [
    { goi: goi('tokenAudience', 'id'), moTa: ['ID token', 'ID token'] },
    { goi: goi('tokenAudience', 'access'), an: true, moTa: ['access token', 'access token'] },
    { goi: goi('tokenAudience', 'refresh'), an: true, moTa: ['unknown kind', 'kind lạ'] },
  ],
});
const S3 = cs({
  ten: '8.1-3 — Order the roles in one login', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order the four OAuth roles as they appear in a login, from the human to the data.',
  vi: 'Xếp bốn vai OAuth như chúng xuất hiện trong một đăng nhập, từ con người tới dữ liệu.',
  cau: [ord('o1', ['Human → data', 'Con người → dữ liệu'], [
    'Resource owner — the user (An) who authorizes access',
    'Client — LabFlow API, which wants to act for the user',
    'Authorization server — LabFlow ID, which authenticates and issues tokens',
    'Resource server — the API that holds the data and accepts the access token',
  ], ['The owner authorizes; the client asks; the authorization server issues; the resource server serves the data (8.1).', 'Chủ uỷ quyền; client xin; máy chủ uỷ quyền phát; máy chủ tài nguyên phục vụ dữ liệu (8.1).'])],
  goiY: [['The user starts it; the API holds the data.', 'Người dùng bắt đầu; API giữ dữ liệu.'], ['LabFlow ID issues the tokens.', 'LabFlow ID phát token.']],
  loi: [['Putting the client before the owner.', 'Đặt client trước chủ.'], ['Confusing the two servers.', 'Lẫn hai máy chủ.']],
  tns: [tn('relying party', 'bên tin cậy')],
  kn: ['authentication'],
});
const S4 = cs({
  ten: '8.1-4 — Confused-with → what it is', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each thing OAuth is confused with to what it actually is.',
  vi: 'Ghép mỗi thứ OAuth bị lẫn với cái nó thực sự là.',
  bang: [bang1('b1', ['Confused → reality', 'Lẫn → thực tế'], [{ ma: 'x', ten: 'Called' }, { ma: 'q', ten: 'Actually', luaChon: ['OpenID Connect (an ID token)', 'a Chapter-3 session', 'a machine credential', 'dead (OAuth 2.1)'] }], [
    { o: { x: '"login"' }, a: { q: 'OpenID Connect (an ID token)' } },
    { o: { x: 'a session' }, a: { q: 'a Chapter-3 session' } },
    { o: { x: 'an API key' }, a: { q: 'a machine credential' } },
    { o: { x: 'the implicit flow' }, a: { q: 'dead (OAuth 2.1)' } },
  ], ['Login is OIDC; a session is yours after login; an API key is machine-to-machine; implicit is removed (8.1).', 'Đăng nhập là OIDC; một phiên là của bạn sau đăng nhập; một API key là máy-với-máy; implicit bị bỏ (8.1).'])],
  goiY: [['Only one of these is about identity.', 'Chỉ một cái về danh tính.'], ['One is removed entirely.', 'Một cái bị bỏ hẳn.']],
  loi: [['Thinking implicit is still recommended.', 'Tưởng implicit vẫn được khuyên.'], ['Thinking an API key is a user delegation.', 'Tưởng một API key là uỷ quyền của người dùng.']],
  kn: ['authentication'],
});
export default doiDau({ slug: 'auth-8-1-oauth-la-gi', ten: '8.1 What OAuth is', khoa: KHOA, baiHoc: 'auth-8-1-oauth-la-gi', de: [S1, S2, S3, S4] });
