/** Authentication · 0.1 — Giao thức quên sạch: nhớ theo IP / kết nối / thẻ mang theo (output thật); tự viết parseCookieHeader, readBearer. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s00/_ma.mjs';

const dong = (k) => OUT[k].split('\n').filter((l) => !l.startsWith('$ ')).join(' / ');

/* ── 1. Ba cách "nhớ" — output thật ── */
const KQ = ['recognised as An', 'a stranger (null)', 'Binh is treated as An'];
const S1 = cs({
  ten: '0.1-1 — Three ways to remember, three real results', kho: 'EASY', phut: 8, loai: 'table',
  en: `demo0/forget.js tries to remember An by IP, by TCP connection, and by a card the client carries. Each row is a real request of lesson 0.1; pick what the server answered (the raw output is in brackets).`,
  vi: `demo0/forget.js thử nhớ An theo IP, theo kết nối TCP, và theo một tấm thẻ client mang theo. Mỗi dòng là một request thật trong bài 0.1; chọn máy chủ đã trả lời gì (output thô nằm trong ngoặc).`,
  bang: [bang1('b1', ['Request → what the server concluded', 'Request → máy chủ kết luận gì'], [{ ma: 'x', ten: 'Request (real output)' }, { ma: 'k', ten: 'Result', luaChon: KQ }], [
    { o: { x: `By IP: Binh, on the same machine, asks /ip/me after An signed in (${dong('01-ip-binh')})` }, a: { k: 'Binh is treated as An' } },
    { o: { x: `By IP: An’s own laptop switches network, /ip/me from 127.0.0.1 (${dong('01-ip-4g')})` }, a: { k: 'a stranger (null)' } },
    { o: { x: `By connection: sign-in and /conn/me in ONE curl command (${dong('01-conn-cung')})` }, a: { k: 'recognised as An' } },
    { o: { x: `By connection: /conn/me from a NEW curl command (${dong('01-conn-moi')})` }, a: { k: 'a stranger (null)' } },
    { o: { x: 'By card: /card/me with An’s card, from ::1 or from 127.0.0.1' }, a: { k: 'recognised as An' } },
    { o: { x: 'By card: Binh sends An’s card (practice 0.1)' }, a: { k: 'Binh is treated as An' } },
  ], ['IP and connection identify a network path, not a person: many people share one IP (NAT), one person changes IPs, and connections close. Only proof carried on every request survives — and whoever carries it IS the user (lesson 1.1).', 'IP và kết nối nhận diện một đường mạng, không phải một con người: nhiều người chung một IP (NAT), một người đổi IP, và kết nối thì đóng lại. Chỉ bằng chứng được mang theo mọi request mới trụ được — và ai mang nó thì LÀ người dùng (bài 1.1).'])],
  goiY: [['Same machine ⇒ same IP.', 'Cùng máy ⇒ cùng IP.'], ['A new curl process opens a new TCP connection (different client port).', 'Một tiến trình curl mới mở kết nối TCP mới (cổng client khác).']],
  loi: [['Thinking the card method is “safe” — it is a bearer credential.', 'Tưởng cách dùng thẻ là "an toàn" — nó là tín vật kiểu mang theo.'], ['Thinking keep-alive connections are tied to one user — proxies reuse them across users.', 'Tưởng kết nối keep-alive gắn với một người — proxy dùng lại chúng cho nhiều người.']],
  tns: [tn('stateless', 'phi trạng thái'), tn('NAT', 'nhiều máy dùng chung một IP công khai')],
  kn: ['HTTP is stateless'],
});

/* ── 2. Tự viết: parseCookieHeader ── */
function parseCookieHeader(header) {
  var out = {};
  if (typeof header !== 'string') return out;
  header.split(';').forEach(function (part) {
    var i = part.indexOf('=');
    if (i < 0) return;                                   // "flag" without a value: ignore
    var name = part.slice(0, i).trim();
    var value = part.slice(i + 1).trim();
    if (!name) return;
    if (value.length >= 2 && value[0] === '"' && value[value.length - 1] === '"') value = value.slice(1, -1);
    if (!Object.prototype.hasOwnProperty.call(out, name)) out[name] = value;   // the FIRST one wins
  });
  return out;
}
const S2 = jsBai({
  ten: '0.1-2 — Write parseCookieHeader(header)', kho: 'MEDIUM', phut: 15,
  en: `<p>Browsers send every cookie in one header: <code>Cookie: lfid_ses=abc; theme=dark</code>. Write <code>parseCookieHeader(header)</code> returning an object name ⇒ value:</p><ul>
<li>pairs are separated by <code>;</code>, spaces around names and values are trimmed;</li>
<li>split each pair at the <b>first</b> <code>=</code> only (values may contain <code>=</code>, e.g. base64 padding);</li>
<li>a value wrapped in double quotes loses the quotes;</li>
<li>pairs without <code>=</code> or with an empty name are ignored; if a name appears twice, the <b>first</b> wins;</li>
<li>a missing header (<code>undefined</code>) gives <code>{}</code>.</li></ul>`,
  vi: `<p>Trình duyệt gửi mọi cookie trong một header: <code>Cookie: lfid_ses=abc; theme=dark</code>. Viết <code>parseCookieHeader(header)</code> trả về object tên ⇒ giá trị:</p><ul>
<li>các cặp cách nhau bởi <code>;</code>, cắt khoảng trắng hai đầu tên và giá trị;</li>
<li>tách mỗi cặp ở dấu <code>=</code> <b>đầu tiên</b> thôi (giá trị có thể chứa <code>=</code>, vd phần đệm base64);</li>
<li>giá trị bọc trong ngoặc kép thì bỏ ngoặc;</li>
<li>cặp không có <code>=</code> hoặc tên rỗng thì bỏ qua; tên xuất hiện hai lần thì cái <b>đầu</b> thắng;</li>
<li>không có header (<code>undefined</code>) thì trả <code>{}</code>.</li></ul>`,
  goiY: [['indexOf("=") then slice — not split("=").', 'indexOf("=") rồi slice — không phải split("=").'], ['Check hasOwnProperty before assigning to keep the first value.', 'Kiểm hasOwnProperty trước khi gán để giữ giá trị đầu.']],
  loi: [['split("=") cuts "a=b==" into three pieces and loses the padding.', 'split("=") cắt "a=b==" thành ba mảnh và mất phần đệm.'], ['Letting a second, attacker-planted cookie with the same name override the real one.', 'Để một cookie thứ hai cùng tên do kẻ tấn công cài đè lên cookie thật.']],
  gt: ['This is what cookie-parser does before your route sees req.cookies. Chapter 3 shows why duplicate names matter: a sub-domain can plant a second cookie with the same name, and which one your parser keeps decides who you are.', 'Đây là việc cookie-parser làm trước khi route của bạn thấy req.cookies. Chương 3 cho thấy vì sao trùng tên quan trọng: một tên miền con có thể cài cookie thứ hai cùng tên, và parser giữ cái nào quyết định bạn là ai.'],
  kn: ['Cookie header'],
  tns: [tn('Cookie header', 'header chứa mọi cookie trình duyệt gửi lên')],
  dau: `/** "a=1; b=2" ⇒ { a: '1', b: '2' } */
function parseCookieHeader(header) {
  // Write your solution here
  var out = {};
  header.split('; ').forEach(function (p) { var kv = p.split('='); out[kv[0]] = kv[1]; });
  return out;
}
`,
  giai: '// Reference solution\n' + nguon(parseCookieHeader),
  cases: [
    { goi: goi('parseCookieHeader', 'lfid_ses=abc; theme=dark') },
    { goi: goi('parseCookieHeader', 'sig=YWJjZA==;  lang = vi ') },
    { goi: goi('parseCookieHeader', 'lfid_ses=real; lfid_ses=planted'), an: true, moTa: ['Duplicate name: first wins', 'Trùng tên: cái đầu thắng'] },
    { goi: 'parseCookieHeader(undefined)', an: true },
    { goi: goi('parseCookieHeader', 'flag; =nameless; a="quoted value"'), an: true },
    { goi: goi('parseCookieHeader', ''), an: true },
  ],
});

/* ── 3. Tự viết: readBearer ── */
function readBearer(header) {
  if (typeof header !== 'string') return null;
  var m = /^Bearer +([A-Za-z0-9\-._~+/]+=*)$/i.exec(header.trim());
  return m ? m[1] : null;
}
const S3 = jsBai({
  ten: '0.1-3 — Write readBearer(authorizationHeader)', kho: 'MEDIUM', phut: 12,
  en: `<p>The other place a client carries proof is <code>Authorization: Bearer &lt;token&gt;</code> (RFC 6750). Return the token, or <code>null</code>. Rules: the scheme <code>Bearer</code> is case-insensitive; one or more spaces after it; the token uses only <code>A–Z a–z 0–9 - . _ ~ + /</code> optionally followed by <code>=</code> padding (RFC 6750 “b64token”); spaces around the whole header are ignored; anything else (Basic auth, missing token, a token with a space or a comma) ⇒ <code>null</code>.</p>`,
  vi: `<p>Chỗ còn lại client mang bằng chứng là <code>Authorization: Bearer &lt;token&gt;</code> (RFC 6750). Trả về token, hoặc <code>null</code>. Luật: tên lược đồ <code>Bearer</code> không phân biệt hoa thường; sau nó là một hoặc nhiều dấu cách; token chỉ gồm <code>A–Z a–z 0–9 - . _ ~ + /</code>, có thể kết thúc bằng các dấu <code>=</code> (cú pháp "b64token" của RFC 6750); bỏ qua khoảng trắng hai đầu cả header; còn lại (Basic auth, thiếu token, token có dấu cách hay dấu phẩy) ⇒ <code>null</code>.</p>`,
  goiY: [['One anchored regex with the i flag.', 'Một regex có neo ^…$ và cờ i.'], ['Do not use replace("Bearer ", "") — it accepts anything.', 'Đừng dùng replace("Bearer ", "") — nó nhận mọi thứ.']],
  loi: [['header.split(" ")[1] — returns "abc" for "Basic abc".', 'header.split(" ")[1] — trả "abc" cho "Basic abc".'], ['Case-sensitive "Bearer": some clients send "bearer".', '"Bearer" phân biệt hoa thường: có client gửi "bearer".']],
  gt: ['A strict parser is part of authentication: “Basic abc” must not reach your token lookup as the token “abc”, and garbage must be rejected before it touches the database.', 'Một parser chặt là một phần của xác thực: "Basic abc" không được đi tới chỗ tra token như thể token là "abc", và rác phải bị loại trước khi chạm vào cơ sở dữ liệu.'],
  kn: ['Authorization header'],
  tns: [tn('bearer token', 'tín vật kiểu "ai cầm là người đó"')],
  dau: `/** "Bearer abc" ⇒ "abc", otherwise null */
function readBearer(header) {
  // Write your solution here
  return header.split(' ')[1];
}
`,
  giai: '// Reference solution\n' + nguon(readBearer),
  cases: [
    { goi: goi('readBearer', 'Bearer tok_an') },
    { goi: goi('readBearer', 'Basic YW46YW4tbGFiLTIwMjY=') },
    { goi: goi('readBearer', 'bearer   lfid_ses_ab-c.d~e+f/g=='), an: true },
    { goi: 'readBearer(undefined)', an: true },
    { goi: goi('readBearer', 'Bearer'), an: true },
    { goi: goi('readBearer', 'Bearer abc def'), an: true },
    { goi: goi('readBearer', '  Bearer tok_lan  '), an: true },
    { goi: goi('readBearer', 'Bearer a,b'), an: true },
  ],
});

/* ── 4. Vì sao HTTP quên ── */
const S4 = cs({
  ten: '0.1-4 — Why the server forgets', kho: 'EASY', phut: 5,
  en: `What the server actually received in lesson 0.1:${pre(OUT['01-raw'])}`,
  vi: `Thứ máy chủ thật sự nhận được trong bài 0.1:${pre(OUT['01-raw'])}`,
  cau: [
    q('c1', ['Why is there no “who” in this request?', 'Vì sao request này không có "ai"?'],
      ['HTTP is stateless by design: every request stands alone', 'curl only sends a user name when you pass the -u flag', 'Express removes identity headers before the route runs', 'The identity is hidden inside the User-Agent header'],
      ['Statelessness is a feature (scaling, caches). The price: the client must carry proof on every request.', 'Phi trạng thái là một tính năng (mở rộng, cache). Cái giá: client phải mang bằng chứng ở mọi request.']),
    q('c2', ['Which of these can identify a returning user?', 'Cái nào nhận ra được người dùng quay lại?'],
      ['A credential the client presents on every request', 'The IP address the request arrived from', 'The keep-alive TCP connection it reused', 'The browser name in the User-Agent string'],
      ['Only something the client presents and the server can check survives NAT, network changes and closed connections.', 'Chỉ thứ client trình ra và máy chủ kiểm được mới trụ được qua NAT, đổi mạng và kết nối đóng.']),
  ],
  goiY: [['Look at the header names: none is about the user.', 'Nhìn tên các header: không cái nào nói về người dùng.'], ['Think of two users behind one router.', 'Nghĩ về hai người sau cùng một router.']],
  loi: [['Using User-Agent or IP as identity.', 'Dùng User-Agent hay IP làm danh tính.'], ['Assuming one connection = one user.', 'Tưởng một kết nối = một người.']],
  kn: ['HTTP is stateless'],
});

export default doiDau({ slug: 'auth-0-1-giao-thuc-quen', ten: '0.1 A protocol that forgets everything', khoa: KHOA, baiHoc: 'auth-0-1-giao-thuc-quen', de: [S1, S2, S3, S4] });
