/** Authentication · 3.4 — CSRF: đọc ma trận Chromium thật; tự viết csrfVerdict (Sec-Fetch-Site + Origin), checkCsrfToken (gắn phiên, so hằng thời gian); bảng lớp phòng. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s03/_ma.mjs';

const M = OUT['34-csrf'].split('\n').slice(1);
const V = OUT['34-v03'].split('\n').slice(1);

const S1 = cs({
  ten: '3.4-1 — Five configurations, one attacker page', kho: 'MEDIUM', phut: 10,
  en: `Real runs (Chromium 156, attacker 127.0.0.1:4801, target localhost:4802; then LabFlow ID v0.3):${pre(M)}${pre(V)}`,
  vi: `Chạy thật (Chromium 156, kẻ tấn công 127.0.0.1:4801, đích localhost:4802; rồi LabFlow ID v0.3):${pre(M)}${pre(V)}`,
  cau: [
    q('c1', ['Row 1’s fetch used mode no-cors and could not read the answer. Did it matter?', 'Fetch ở hàng 1 dùng mode no-cors và không đọc được câu trả lời. Có quan trọng không?'],
      ['No: the request was sent with the cookie and the email CHANGED — CORS only hides responses', 'Yes: an unreadable response means the server ignored it', 'Yes: no-cors requests never carry cookies', 'No: but only because the server allowed CORS'],
      ['CSRF needs the write, not the read. CORS controls reading; simple POSTs are not even preflighted.', 'CSRF cần việc ghi, không cần đọc. CORS kiểm soát việc đọc; POST đơn giản thậm chí không qua preflight.']),
    q('c2', ['With SameSite=Lax and no defence, both attacks got 401. Why does LabFlow ID still add the Sec-Fetch-Site check?', 'Với SameSite=Lax và không phòng gì, cả hai đòn nhận 401. Vì sao LabFlow ID vẫn thêm phép kiểm Sec-Fetch-Site?'],
      ['Lax misses same-site subdomains and old browsers', 'Because Lax stops working two minutes after login', 'Because Lax cookies are sent with every POST anyway', 'It does not — the Lax attribute is already enough'],
      ['Defence in depth: the server check covers what the cookie attribute cannot — see “Sec-Fetch-Site: same-site → 403”.', 'Phòng thủ nhiều lớp: phép kiểm ở máy chủ che phần thuộc tính cookie không che được — xem "Sec-Fetch-Site: same-site → 403".']),
    q('c3', ['Why did the request with no browser headers (curl) get 200 from v0.3?', 'Vì sao request không có header trình duyệt nào (curl) nhận 200 từ v0.3?'],
      ['It cannot ride on a victim’s browser cookie', 'Because LabFlow ID trusts curl as a known client', 'Because v0.3 simply forgot to check that case', 'Because a POST without Origin is always same-origin'],
      ['CSRF requires a victim’s browser. A client with no browser metadata either has its own credentials or nothing.', 'CSRF cần trình duyệt của nạn nhân. Client không có thông tin trình duyệt thì hoặc có thông tin đăng nhập riêng, hoặc chẳng có gì.']),
  ],
  goiY: [['Who needs to read the response for the attack to work?', 'Ai cần đọc phản hồi để đòn tấn công chạy được?'], ['Same site ≠ same origin.', 'Cùng site ≠ cùng origin.']],
  loi: [['“CORS protects us.”', '"CORS bảo vệ mình."'], ['“Lax is the whole defence.”', '"Lax là toàn bộ lớp phòng."']],
  tns: [tn('Fetch Metadata', 'siêu dữ liệu fetch'), tn('opaque response', 'phản hồi mờ đục')],
  kn: ['CSRF'],
});

function csrfVerdict(req, origins) {
  if (['GET', 'HEAD', 'OPTIONS'].indexOf(req.method) >= 0) return 'ALLOW';
  var h = req.headers || {};
  var site = h['sec-fetch-site'];
  if (site) return site === 'same-origin' || site === 'none' ? 'ALLOW' : 'BLOCK';
  if (h.origin && origins.indexOf(h.origin) < 0) return 'BLOCK';
  return 'ALLOW';
}
const O = ['http://localhost:4800'];
const S2 = jsBai({
  ten: '3.4-2 — Write csrfVerdict(req, origins): layer 2', kho: 'MEDIUM', phut: 12,
  en: `<p><code>req = { method, headers }</code> (lower-case header names). Return <code>'ALLOW'</code> or <code>'BLOCK'</code>: safe methods (GET, HEAD, OPTIONS) ⇒ ALLOW; if <code>sec-fetch-site</code> is present ⇒ ALLOW only for <code>same-origin</code> or <code>none</code>; otherwise, an <code>origin</code> header not in <code>origins</code> (including <code>"null"</code>) ⇒ BLOCK; no browser metadata at all ⇒ ALLOW. The real v0.3 answers:${pre(V)}</p>`,
  vi: `<p><code>req = { method, headers }</code> (tên header viết thường). Trả <code>'ALLOW'</code> hoặc <code>'BLOCK'</code>: method an toàn (GET, HEAD, OPTIONS) ⇒ ALLOW; nếu có <code>sec-fetch-site</code> ⇒ chỉ ALLOW với <code>same-origin</code> hoặc <code>none</code>; không thì header <code>origin</code> không nằm trong <code>origins</code> (kể cả <code>"null"</code>) ⇒ BLOCK; không có thông tin trình duyệt nào ⇒ ALLOW. Câu trả lời thật của v0.3:${pre(V)}</p>`,
  goiY: [['Sec-Fetch-Site first, Origin only as the fallback.', 'Sec-Fetch-Site trước, Origin chỉ là dự phòng.'], ['"null" is a string, and not ours.', '"null" là một chuỗi, và không phải của mình.']],
  loi: [['Allowing same-site.', 'Cho same-site qua.'], ['Blocking when Origin is missing on a non-browser client.', 'Chặn khi client không phải trình duyệt thiếu Origin.']],
  gt: ['Modern browsers always say where a request came from; the Origin fallback covers older ones; with neither, the request did not come from a victim’s browser. That is OWASP’s recommendation and v0.3’s csrf().', 'Trình duyệt hiện đại luôn cho biết request đến từ đâu; dự phòng Origin che trình duyệt cũ; không có cả hai thì request không đến từ trình duyệt của nạn nhân. Đó là khuyến nghị của OWASP và csrf() của v0.3.'],
  kn: ['CSRF'], tns: [tn('safe method', 'method an toàn')],
  dau: `/** ⇒ 'ALLOW' | 'BLOCK' */
function csrfVerdict(req, origins) {
  // Write your solution here
  return req.headers['sec-fetch-site'] === 'cross-site' ? 'BLOCK' : 'ALLOW';
}
`,
  giai: '// Reference solution\n' + nguon(csrfVerdict),
  cases: [
    { goi: goi('csrfVerdict', { method: 'POST', headers: { 'sec-fetch-site': 'cross-site' } }, O) },
    { goi: goi('csrfVerdict', { method: 'POST', headers: { 'sec-fetch-site': 'same-origin' } }, O) },
    { goi: goi('csrfVerdict', { method: 'POST', headers: { 'sec-fetch-site': 'same-site' } }, O), an: true },
    { goi: goi('csrfVerdict', { method: 'POST', headers: { origin: 'http://127.0.0.1:4801' } }, O), an: true },
    { goi: goi('csrfVerdict', { method: 'POST', headers: { origin: 'null' } }, O), an: true },
    { goi: goi('csrfVerdict', { method: 'DELETE', headers: {} }, O), an: true },
    { goi: goi('csrfVerdict', { method: 'GET', headers: { 'sec-fetch-site': 'cross-site' } }, O), an: true },
    { goi: goi('csrfVerdict', { method: 'POST', headers: { 'sec-fetch-site': 'none' } }, O), an: true },
  ],
});

function checkCsrfToken(formToken, sessionId, mac) {
  if (typeof formToken !== 'string' || typeof sessionId !== 'string' || !sessionId) return false;
  var expected = mac(sessionId);
  var diff = formToken.length ^ expected.length;
  for (var i = 0; i < Math.max(formToken.length, expected.length); i++) diff |= (formToken.charCodeAt(i) | 0) ^ (expected.charCodeAt(i) | 0);
  return diff === 0;
}
const MAC = 'function (s) { var h = 2166136261, o = ""; for (var r = 0; r < 4; r++) { for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i) + r; h = Math.imul(h, 16777619) >>> 0; } o += ("0000000" + h.toString(16)).slice(-8); } return o; }';
const ck = (tokExpr, sid) => `(function () { var mac = ${MAC}; return checkCsrfToken(${tokExpr}, ${JSON.stringify(sid)}, mac); })()`;
const S3 = jsBai({
  ten: '3.4-3 — Write checkCsrfToken(formToken, sessionId, mac): layer 3', kho: 'MEDIUM', phut: 12,
  en: `<p>The synchronizer token of lesson 3.4 is <code>mac(sessionId)</code> (an HMAC with a server key — given). Return <code>true</code> only when <code>formToken</code> equals <code>mac(sessionId)</code>, compared in constant time (look at every character, no early exit); <code>false</code> for non-strings or an empty session id. A token from another session must fail.</p>`,
  vi: `<p>Token đồng bộ của bài 3.4 là <code>mac(sessionId)</code> (HMAC với khoá máy chủ — cho sẵn). Trả <code>true</code> chỉ khi <code>formToken</code> bằng <code>mac(sessionId)</code>, so trong thời gian không đổi (xem mọi ký tự, không thoát sớm); <code>false</code> với dữ liệu không phải chuỗi hoặc session id rỗng. Token của phiên khác phải trượt.</p>`,
  goiY: [['Compute expected = mac(sessionId), then compare like safeEqual (lesson 1.3).', 'Tính expected = mac(sessionId), rồi so như safeEqual (bài 1.3).'], ['Fold the length difference into the accumulator.', 'Gộp chênh lệch độ dài vào biến tích luỹ.']],
  loi: [['A constant token for everyone: one sign-up reveals it.', 'Một token cố định cho mọi người: một lần đăng ký là lộ.'], ['=== on the token.', '=== trên token.']],
  gt: ['Binding the token to the session means another user’s token is useless, and the attacker’s page cannot read yours. Constant-time comparison keeps the token from leaking through timing.', 'Gắn token với phiên nghĩa là token của người khác vô dụng, và trang của kẻ tấn công không đọc được trang của bạn. So hằng thời gian giữ token không rò qua thời gian.'],
  kn: ['CSRF'], tns: [tn('synchronizer token', 'token đồng bộ')],
  dau: `/** ⇒ true only if formToken = mac(sessionId) */
function checkCsrfToken(formToken, sessionId, mac) {
  // Write your solution here
  return formToken === 'csrf-demo';
}
`,
  giai: '// Reference solution\n' + nguon(checkCsrfToken),
  cases: [
    { goi: ck('mac("sess-an")', 'sess-an'), moTa: ['An’s own form', 'Form của chính An'] },
    { goi: ck('mac("sess-attacker")', 'sess-an'), moTa: ['Attacker’s own token', 'Token của chính kẻ tấn công'] },
    { goi: ck('""', 'sess-an'), an: true },
    { goi: ck('undefined', 'sess-an'), an: true },
    { goi: ck('mac("")', ''), an: true },
    { goi: ck('mac("sess-an") + "x"', 'sess-an'), an: true },
  ],
});

const RANK = ['1st — always, one attribute', '2nd — always, ~10 lines, no state', '3rd — where layer 2 is not enough', 'not a CSRF defence'];
const S4 = cs({
  ten: '3.4-4 — Rank the defences', kho: 'EASY', phut: 6, loai: 'table',
  en: 'Place each measure in LabFlow ID’s ranking.',
  vi: 'Xếp mỗi biện pháp vào thứ hạng của LabFlow ID.',
  bang: [bang1('b1', ['Measure → rank', 'Biện pháp → thứ hạng'], [{ ma: 'x', ten: 'Measure' }, { ma: 'r', ten: 'Rank', luaChon: RANK }], [
    { o: { x: 'SameSite=Lax on the session cookie' }, a: { r: '1st — always, one attribute' } },
    { o: { x: 'Sec-Fetch-Site check + Origin fallback' }, a: { r: '2nd — always, ~10 lines, no state' } },
    { o: { x: 'Synchronizer token (HMAC of the session id)' }, a: { r: '3rd — where layer 2 is not enough' } },
    { o: { x: 'CORS allowing only our origin' }, a: { r: 'not a CSRF defence' } },
  ], ['Cheapest and broadest first; the token covers what is left; CORS controls reading, and the measured fetch still changed the email.', 'Rẻ và rộng nhất trước; token che phần còn lại; CORS kiểm soát việc đọc, và fetch đo được vẫn đổi được email.'])],
  goiY: [['Which one needs state?', 'Cái nào cần trạng thái?'], ['Which one did not stop the measured fetch?', 'Cái nào không chặn được fetch đã đo?']],
  loi: [['Ranking CORS as a defence.', 'Xếp CORS là một lớp phòng.'], ['Token first, everywhere.', 'Token trước tiên, ở mọi nơi.']],
  kn: ['CSRF'],
});

export default doiDau({ slug: 'auth-3-4-csrf', ten: '3.4 CSRF, and the three defences ranked', khoa: KHOA, baiHoc: 'auth-3-4-csrf', de: [S1, S2, S3, S4] });
