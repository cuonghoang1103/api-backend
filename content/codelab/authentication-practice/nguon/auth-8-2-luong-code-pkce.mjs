/** Authentication · 8.2 — Luồng code+PKCE: đọc login; viết codeStatus; sắp + bảng. */
import { doiDau, KHOA, cs, q, ord, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s08/_ma.mjs';
const OF = OUT['81-oidc-flow'].split('\n').slice(1);
const S1 = cs({
  ten: '8.2-1 — The code+PKCE login, read the run', kho: 'EASY', phut: 8,
  en: `LabFlow ID v0.8 (real run):${pre(OF.slice(5, 9))}`,
  vi: `LabFlow ID v0.8 (chạy thật):${pre(OF.slice(5, 9))}`,
  cau: [
    q('c1', ['An attacker intercepts the code from the browser. With PKCE, can they redeem it?', 'Một kẻ tấn công chặn code từ trình duyệt. Với PKCE, chúng đổi được không?'],
      ['No — redeeming needs the code_verifier the client kept; demo8 shows a wrong verifier → invalid_grant', 'Yes — possessing the authorization code alone is enough to redeem it', 'Yes, as long as they also know the public client id', 'No — the authorization code is encrypted so it cannot be reused'],
      ['PKCE binds the code to the verifier the client never sent; without it the token endpoint returns invalid_grant (8.2).', 'PKCE gắn code với verifier mà client không bao giờ gửi; thiếu nó token endpoint trả invalid_grant (8.2).']),
    q('c2', ['Why is it safe that the code appears in the browser URL?', 'Vì sao an toàn khi code xuất hiện trong URL trình duyệt?'],
      ['It is single-use, 60 seconds, and useless without the verifier; tokens never ride the URL', 'The whole callback URL is encrypted end to end by the browser', 'Browsers hide the query string from history and server logs', 'The code in the URL is actually already the access token itself'],
      ['The code alone cannot be redeemed (PKCE) and expires fast; the tokens are swapped back-channel (8.2).', 'Chỉ code không đổi được (PKCE) và hết hạn nhanh; token đổi ở kênh-sau (8.2).']),
  ],
  goiY: [['The verifier never leaves the client.', 'Verifier không bao giờ rời client.'], ['Tokens travel back-channel.', 'Token đi kênh-sau.']],
  loi: [['Thinking a stolen code is enough.', 'Tưởng một code bị trộm là đủ.'], ['Thinking the code is the access token.', 'Tưởng code là access token.']],
  tns: [tn('PKCE', 'PKCE'), tn('back-channel', 'kênh sau')],
  kn: ['authentication'],
});
function codeStatus(rec, now) {
  if (!rec) return 'unknown';
  if (rec.used) return 'used';
  if (now >= rec.exp) return 'expired';
  return 'ok';
}
const S2 = jsBai({
  ten: '8.2-2 — Write codeStatus(rec, now): the code lifecycle', kho: 'MEDIUM', phut: 10,
  en: `<p>An authorization code is single-use and short-lived. Given a stored record <code>rec</code> (or <code>null</code>) and the current time <code>now</code>, return its status in this order: no record ⇒ <code>'unknown'</code>; already redeemed (<code>rec.used</code>) ⇒ <code>'used'</code>; past <code>rec.exp</code> ⇒ <code>'expired'</code>; otherwise <code>'ok'</code>. (The provider deletes a code on redemption, so a replay is <code>'unknown'</code> or <code>'used'</code>.)</p>`,
  vi: `<p>Một mã uỷ quyền dùng một lần và ngắn hạn. Cho một bản ghi lưu <code>rec</code> (hoặc <code>null</code>) và thời gian hiện tại <code>now</code>, trả về trạng thái theo thứ tự này: không có bản ghi ⇒ <code>'unknown'</code>; đã đổi (<code>rec.used</code>) ⇒ <code>'used'</code>; qua <code>rec.exp</code> ⇒ <code>'expired'</code>; còn lại <code>'ok'</code>. (Provider xoá một code khi đổi, nên một lần phát lại là <code>'unknown'</code> hoặc <code>'used'</code>.)</p>`,
  goiY: [['Check used before expiry.', 'Kiểm đã-dùng trước hết hạn.'], ['A missing record is unknown, not a crash.', 'Một bản ghi thiếu là unknown, không phải sập.']],
  loi: [['Checking expiry before used.', 'Kiểm hết hạn trước đã-dùng.'], ['Throwing on a null record.', 'Ném lỗi trên một bản ghi null.']],
  gt: ['Single-use + short expiry are what make a leaked code harmless; the status order mirrors how the token endpoint rejects a bad code (8.2).', 'Dùng một lần + hạn ngắn là cái làm một code bị rò vô hại; thứ tự trạng thái phản chiếu cách token endpoint từ chối một code xấu (8.2).'],
  kn: ['authentication'], tns: [tn('authorization code', 'mã uỷ quyền')],
  dau: `/** ⇒ 'unknown' | 'used' | 'expired' | 'ok' */
function codeStatus(rec, now) {
  // Write your solution here
  return 'ok';
}
`,
  giai: '// Reference solution\n' + nguon(codeStatus),
  cases: [
    { goi: goi('codeStatus', { used: false, exp: 100 }, 50), moTa: ['fresh', 'mới'] },
    { goi: goi('codeStatus', null, 50), an: true, moTa: ['no record', 'không bản ghi'] },
    { goi: goi('codeStatus', { used: true, exp: 100 }, 50), an: true, moTa: ['replayed', 'phát lại'] },
    { goi: goi('codeStatus', { used: false, exp: 40 }, 50), an: true, moTa: ['expired', 'hết hạn'] },
  ],
});
const S3 = cs({
  ten: '8.2-3 — Order the three moves', kho: 'EASY', phut: 6, loai: 'order',
  en: 'Order the authorization-code-with-PKCE flow from begin to tokens.',
  vi: 'Xếp luồng authorization-code-kèm-PKCE từ begin tới token.',
  cau: [ord('o1', ['First → last', 'Đầu → cuối'], [
    'Client makes a verifier, hashes it to a challenge, sends only the challenge',
    'User authorizes at the provider; a one-time code 302s back to the client',
    'Client POSTs code + verifier to the token endpoint, back-channel',
    'Provider checks the verifier hashes to the challenge, issues access + ID token',
  ], ['Challenge up front → user authorizes → code back → swap code + verifier for tokens (8.2).', 'Challenge trước → người dùng uỷ quyền → code về → đổi code + verifier lấy token (8.2).'])],
  goiY: [['The challenge goes before the code exists.', 'Challenge đi trước khi code tồn tại.'], ['The verifier appears only at the token step.', 'Verifier chỉ xuất hiện ở bước token.']],
  loi: [['Sending the verifier in the authorize URL.', 'Gửi verifier trong URL authorize.'], ['Issuing tokens before checking PKCE.', 'Phát token trước khi kiểm PKCE.']],
  tns: [tn('code_challenge', 'code_challenge')],
  kn: ['authentication'],
});
const S4 = cs({
  ten: '8.2-4 — Where does each value travel?', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Match each value with the channel it travels on.',
  vi: 'Ghép mỗi giá trị với kênh nó đi.',
  bang: [bang1('b1', ['Value → channel', 'Giá trị → kênh'], [{ ma: 'x', ten: 'Value' }, { ma: 'q', ten: 'Travels', luaChon: ['browser (front-channel)', 'server-to-server (back-channel)'] }], [
    { o: { x: 'code_challenge' }, a: { q: 'browser (front-channel)' } },
    { o: { x: 'authorization code' }, a: { q: 'browser (front-channel)' } },
    { o: { x: 'code_verifier' }, a: { q: 'server-to-server (back-channel)' } },
    { o: { x: 'access + ID token' }, a: { q: 'server-to-server (back-channel)' } },
  ], ['The challenge and the code ride the browser; the verifier and the tokens stay back-channel, never in the URL (8.2).', 'Challenge và code đi qua trình duyệt; verifier và token ở kênh-sau, không bao giờ trong URL (8.2).'])],
  goiY: [['The verifier is a secret — it must not touch the browser.', 'Verifier là một bí mật — nó không được chạm trình duyệt.'], ['The challenge and code are public-ish; the verifier and tokens are not.', 'Challenge và code hơi công khai; verifier và token thì không.']],
  loi: [['Putting tokens in the browser.', 'Đặt token trong trình duyệt.'], ['Putting the verifier front-channel.', 'Đặt verifier kênh-trước.']],
  kn: ['authentication'],
});
export default doiDau({ slug: 'auth-8-2-luong-code-pkce', ten: '8.2 Code + PKCE', khoa: KHOA, baiHoc: 'auth-8-2-luong-code-pkce', de: [S1, S2, S3, S4] });
