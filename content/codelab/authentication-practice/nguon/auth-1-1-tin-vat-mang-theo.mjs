/** Authentication · 1.1 — Ai cầm nó, người đó LÀ bạn: token chép sang máy khác, token trong URL đi đâu (Chromium thật); tự viết stripSecretParams, referrerFor. */
import { doiDau, KHOA, cs, q, bang1, tn, jsBai, nguon, goi, pre } from './_auth.mjs';
import { OUT } from '../../../courses/authentication/s01/_ma.mjs';

const ngan = (s) => s.replace(/(lfid_reset_)[A-Za-z0-9_-]{6,}/g, '$1…');

/* ── 1. Referer thật ── */
const S1 = cs({
  ten: '1.1-1 — Where did the reset token go?', kho: 'EASY', phut: 8,
  en: `A password-reset page <code>/reset?token=…</code> loads a same-origin script and a third-party pixel. Real Chromium, four Referrer-Policy values (token shortened with …). The third party logged:${pre(ngan(OUT['11-log-third']))}`,
  vi: `Trang đặt lại mật khẩu <code>/reset?token=…</code> tải một script cùng origin và một pixel của bên thứ ba. Chromium thật, bốn giá trị Referrer-Policy (token cắt bằng …). Bên thứ ba ghi lại:${pre(ngan(OUT['11-log-third']))}`,
  cau: [
    q('c1', ['With NO Referrer-Policy set, what did the third party receive?', 'KHÔNG đặt Referrer-Policy, bên thứ ba nhận được gì?'],
      ['Only the origin, http://localhost:4800/', 'The full URL, including the reset token', 'Nothing at all: the header was not sent', 'The token alone, without the page path'],
      ['The first log line. Older advice (“the Referer leaks the token to every script”) describes the old default, no-referrer-when-downgrade — the second line shows exactly that.', 'Dòng log đầu tiên. Lời khuyên cũ ("Referer làm lộ token cho mọi script") mô tả mặc định cũ, no-referrer-when-downgrade — dòng thứ hai cho thấy đúng như vậy.']),
    q('c2', ['So is a token in a URL safe now?', 'Vậy token trong URL giờ đã an toàn chưa?'],
      ['No: your own log and same-origin requests still get it', 'Yes: modern browsers strip it from every request', 'Yes, as long as the whole site is served over HTTPS', 'Only on mobile browsers, which use a stricter default'],
      ['The LabFlow access log line and the same-origin Referer both contained the token. Keep tokens out of URLs, or make them single-use and short-lived (Chapter 6).', 'Dòng access log của LabFlow và Referer cùng origin đều chứa token. Đừng để token trong URL, hoặc làm nó dùng một lần và sống ngắn (Chương 6).']),
    q('c3', ['Which policy sends NO Referer at all?', 'Policy nào KHÔNG gửi Referer nào cả?'],
      ['no-referrer', 'unsafe-url', 'no-referrer-when-downgrade', 'strict-origin-when-cross-origin'],
      ['The fourth log line: “Referer: (none)”. A reset page can set it on its own response.', 'Dòng log thứ tư: "Referer: (none)". Trang đặt lại mật khẩu có thể tự đặt nó trên response của mình.']),
  ],
  goiY: [['Compare each log line with the policy in its URL.', 'So từng dòng log với policy nằm trong URL của nó.'], ['The first request had no policy query parameter.', 'Request đầu tiên không có tham số policy.']],
  loi: [['Trusting the default and putting long-lived tokens in links.', 'Tin vào mặc định rồi đặt token sống lâu vào link.'], ['Forgetting the server’s own access log.', 'Quên access log của chính máy chủ.']],
  tns: [tn('Referer', 'header trình duyệt gửi kèm: trang nào dẫn tới request này'), tn('Referrer-Policy', 'header trang dùng để giới hạn Referer')],
  kn: ['Referer'],
});

/* ── 2. Hành trình của một tín vật ── */
const CHAN = ['use the OS CSPRNG (lesson 1.2)', 'TLS, and never in a URL', 'HttpOnly cookie (Chapter 3)', 'SameSite + CSRF defences (Chapter 3)', 'constant-time check or digest lookup (lesson 1.3)', 'store only a digest (lesson 1.3)'];
const S2 = cs({
  ten: '1.1-2 — Six hops, six defences', kho: 'MEDIUM', phut: 10, loai: 'table',
  en: 'A bearer credential travels through six hops. Match each failure with the defence that stops it.',
  vi: 'Một tín vật kiểu mang theo đi qua sáu chặng. Ghép mỗi kiểu hỏng với lớp phòng thủ chặn nó.',
  bang: [bang1('b1', ['Hop · failure → defence', 'Chặng · kiểu hỏng → phòng thủ'], [{ ma: 'x', ten: 'Hop and failure' }, { ma: 'd', ten: 'Defence', luaChon: CHAN }], [
    { o: { x: 'Created: the id is Date.now() and is guessed in seconds' }, a: { d: 'use the OS CSPRNG (lesson 1.2)' } },
    { o: { x: 'In transit: it sits in ?token= and lands in access logs' }, a: { d: 'TLS, and never in a URL' } },
    { o: { x: 'At rest in the browser: an injected script reads localStorage' }, a: { d: 'HttpOnly cookie (Chapter 3)' } },
    { o: { x: 'Sent back: the browser attaches it to a request another site caused' }, a: { d: 'SameSite + CSRF defences (Chapter 3)' } },
    { o: { x: 'Verified: === returns earlier for wrong first characters' }, a: { d: 'constant-time check or digest lookup (lesson 1.3)' } },
    { o: { x: 'At rest on the server: a backup of the session table leaks' }, a: { d: 'store only a digest (lesson 1.3)' } },
  ], ['You cannot make a bearer credential unstealable; you make each hop as hard as possible, keep lifetimes short and keep the ability to revoke.', 'Bạn không làm được tín vật mang theo "không thể bị lấy"; bạn làm mỗi chặng khó nhất có thể, giữ thời gian sống ngắn và giữ khả năng thu hồi.'])],
  goiY: [['Ask where the credential is at that moment.', 'Hỏi lúc đó tín vật đang nằm ở đâu.'], ['HttpOnly is about JavaScript reading; SameSite is about the browser sending.', 'HttpOnly là chuyện JavaScript đọc; SameSite là chuyện trình duyệt gửi.']],
  loi: [['HttpOnly for CSRF: the attacker never needs to read the cookie.', 'HttpOnly cho CSRF: kẻ tấn công không cần đọc cookie.'], ['Encrypting session ids in the database instead of hashing them.', 'Mã hoá id phiên trong CSDL thay vì băm.']],
  kn: ['credential lifecycle'],
});

/* ── 3. Tự viết: stripSecretParams ── */
function stripSecretParams(url, names) {
  var hash = '';
  var h = url.indexOf('#');
  if (h >= 0) { hash = url.slice(h); url = url.slice(0, h); }
  var q = url.indexOf('?');
  if (q < 0) return url + hash;
  var base = url.slice(0, q);
  var kept = url.slice(q + 1).split('&').filter(function (pair) {
    if (pair === '') return false;
    var name = pair.split('=')[0];
    try { name = decodeURIComponent(name.replace(/\+/g, ' ')); } catch (e) { /* keep the raw name */ }
    return names.indexOf(name.toLowerCase()) < 0;
  });
  return base + (kept.length ? '?' + kept.join('&') : '') + hash;
}
const SECRETS = ['token', 'access_token', 'code', 'session', 'api_key'];
const S3 = jsBai({
  ten: '1.1-3 — Write stripSecretParams(url, names) for your access log', kho: 'MEDIUM', phut: 15,
  en: `<p>LabFlow ID’s access log must never record a credential that arrived in a query string. Write <code>stripSecretParams(url, names)</code>: remove every query parameter whose (decoded, lower-cased) name is in <code>names</code> (given in lower case); keep the other parameters in their order and exactly as written; drop the <code>?</code> if nothing is left; keep the <code>#fragment</code>. No <code>URL</code> class is available — parse the string yourself.</p>`,
  vi: `<p>Access log của LabFlow ID không bao giờ được ghi tín vật đến trong query string. Viết <code>stripSecretParams(url, names)</code>: bỏ mọi tham số query có tên (sau khi giải mã, viết thường) nằm trong <code>names</code> (cho sẵn chữ thường); giữ các tham số khác đúng thứ tự và đúng như đã viết; bỏ dấu <code>?</code> nếu không còn gì; giữ <code>#fragment</code>. Không có lớp <code>URL</code> — tự phân tích chuỗi.</p>`,
  goiY: [['Cut the #fragment first, then the query.', 'Cắt #fragment trước, rồi tới query.'], ['A name can be written as To%6Ben: decode before comparing.', 'Tên có thể viết dạng To%6Ben: giải mã rồi mới so.']],
  loi: [['A regex that removes "token=" but also "csrf_token=" or "tokenizer=".', 'Regex xoá "token=" nhưng xoá luôn "csrf_token=" hay "tokenizer=".'], ['Leaving "?&" or a trailing "?" behind.', 'Để lại "?&" hoặc dấu "?" thừa ở cuối.']],
  gt: ['Matching whole, decoded names is what makes the filter reliable: substring regexes either miss encoded names or delete innocent parameters. Better still: never put credentials in URLs (POST them, or use a header).', 'So khớp cả tên đã giải mã mới làm bộ lọc đáng tin: regex chuỗi con hoặc bỏ sót tên bị mã hoá, hoặc xoá nhầm tham số vô hại. Tốt hơn nữa: đừng bao giờ để tín vật trong URL (gửi bằng POST, hoặc dùng header).'],
  kn: ['logging hygiene'],
  dau: `/** remove credential parameters from a URL before logging it */
function stripSecretParams(url, names) {
  // Write your solution here
  return url.replace(/token=[^&]*/, '');
}
`,
  giai: '// Reference solution\n' + nguon(stripSecretParams),
  cases: [
    { goi: goi('stripSecretParams', '/reset?token=lfid_reset_abc&policy=unsafe-url', SECRETS) },
    { goi: goi('stripSecretParams', '/reset?token=lfid_reset_abc', SECRETS) },
    { goi: goi('stripSecretParams', '/cb?state=xyz&code=4%2F0Ab&scope=openid#top', SECRETS), an: true },
    { goi: goi('stripSecretParams', '/search?q=token&csrf_token=keep&tokenizer=keep', SECRETS), an: true },
    { goi: goi('stripSecretParams', '/x?To%6Ben=abc&a=1', SECRETS), an: true },
    { goi: goi('stripSecretParams', '/health', SECRETS), an: true },
    { goi: goi('stripSecretParams', '/me?&access_token=t&&page=2', SECRETS), an: true },
  ],
});

/* ── 4. Tự viết: referrerFor ── */
function referrerFor(pageUrl, requestUrl, policy) {
  function parse(u) {
    var m = /^(https?):\/\/([^/?#]+)/i.exec(u);
    if (!m) return null;
    var scheme = m[1].toLowerCase();
    var host = m[2].toLowerCase();
    if ((scheme === 'http' && /:80$/.test(host)) || (scheme === 'https' && /:443$/.test(host))) host = host.replace(/:\d+$/, '');
    return { scheme: scheme, origin: scheme + '://' + host };
  }
  var p = parse(pageUrl), r = parse(requestUrl);
  if (!p || !r) return null;
  var full = pageUrl.split('#')[0];
  var origin = p.origin + '/';
  var same = p.origin === r.origin;
  var downgrade = p.scheme === 'https' && r.scheme === 'http';
  switch (policy || 'strict-origin-when-cross-origin') {
    case 'no-referrer': return null;
    case 'origin': return origin;
    case 'unsafe-url': return full;
    case 'same-origin': return same ? full : null;
    case 'strict-origin': return downgrade ? null : origin;
    case 'no-referrer-when-downgrade': return downgrade ? null : full;
    case 'origin-when-cross-origin': return same ? full : origin;
    case 'strict-origin-when-cross-origin': return same ? full : (downgrade ? null : origin);
    default: return null;
  }
}
const PAGE = 'http://localhost:4800/reset?token=lfid_reset_abc&policy=x';
const S4 = jsBai({
  ten: '1.1-4 — Write referrerFor(pageUrl, requestUrl, policy)', kho: 'HARD', phut: 25,
  en: `<p>Predict the <code>Referer</code> a browser sends — the rules the real Chromium run of lesson 1.1 followed. Return a string or <code>null</code> (no header).</p><ul>
<li><b>full</b> = the page URL without its <code>#fragment</code>; <b>origin</b> = <code>scheme://host[:port]/</code> (lower case, default ports :80/:443 dropped); <b>same</b> = same origin; <b>downgrade</b> = page is https and the request is http.</li>
<li><code>no-referrer</code> ⇒ null · <code>origin</code> ⇒ origin · <code>unsafe-url</code> ⇒ full · <code>same-origin</code> ⇒ same ? full : null · <code>strict-origin</code> ⇒ downgrade ? null : origin · <code>no-referrer-when-downgrade</code> ⇒ downgrade ? null : full · <code>origin-when-cross-origin</code> ⇒ same ? full : origin · <code>strict-origin-when-cross-origin</code> (also when policy is empty/undefined — today’s default) ⇒ same ? full : (downgrade ? null : origin).</li>
<li>An unknown policy or a URL that is not http(s) ⇒ null.</li></ul>`,
  vi: `<p>Đoán header <code>Referer</code> mà trình duyệt gửi — đúng các luật mà lần chạy Chromium thật ở bài 1.1 đã theo. Trả chuỗi hoặc <code>null</code> (không có header).</p><ul>
<li><b>full</b> = URL trang bỏ <code>#fragment</code>; <b>origin</b> = <code>scheme://host[:port]/</code> (chữ thường, bỏ cổng mặc định :80/:443); <b>same</b> = cùng origin; <b>downgrade</b> = trang là https còn request là http.</li>
<li><code>no-referrer</code> ⇒ null · <code>origin</code> ⇒ origin · <code>unsafe-url</code> ⇒ full · <code>same-origin</code> ⇒ same ? full : null · <code>strict-origin</code> ⇒ downgrade ? null : origin · <code>no-referrer-when-downgrade</code> ⇒ downgrade ? null : full · <code>origin-when-cross-origin</code> ⇒ same ? full : origin · <code>strict-origin-when-cross-origin</code> (cả khi policy rỗng/undefined — mặc định hiện nay) ⇒ same ? full : (downgrade ? null : origin).</li>
<li>Policy lạ hoặc URL không phải http(s) ⇒ null.</li></ul>`,
  goiY: [['Write parse(url) ⇒ { scheme, origin } with one regex.', 'Viết parse(url) ⇒ { scheme, origin } bằng một regex.'], ['Then the policies are a switch of one-liners.', 'Sau đó các policy chỉ là một switch gồm các dòng ngắn.']],
  loi: [['Comparing hosts without the port: localhost:4800 and localhost:4801 are different origins.', 'So host mà bỏ cổng: localhost:4800 và localhost:4801 là hai origin khác nhau.'], ['Forgetting that the default (no policy) is strict-origin-when-cross-origin, not no-referrer-when-downgrade.', 'Quên rằng mặc định (không policy) là strict-origin-when-cross-origin, không phải no-referrer-when-downgrade.']],
  gt: ['Matches the measured run: no policy ⇒ the pixel on 127.0.0.1:4801 got only http://localhost:4800/; no-referrer-when-downgrade and unsafe-url ⇒ the full URL with the token; no-referrer ⇒ nothing; the same-origin script got the full URL every time except with no-referrer.', 'Khớp lần đo thật: không policy ⇒ pixel ở 127.0.0.1:4801 chỉ nhận http://localhost:4800/; no-referrer-when-downgrade và unsafe-url ⇒ cả URL kèm token; no-referrer ⇒ không gì; script cùng origin nhận URL đầy đủ ở mọi lần trừ no-referrer.'],
  kn: ['Referrer-Policy'],
  tns: [tn('origin', 'scheme + host + port'), tn('downgrade', 'từ https xuống http')],
  dau: `/** ⇒ the Referer string, or null */
function referrerFor(pageUrl, requestUrl, policy) {
  // Write your solution here
  if (policy === 'no-referrer') return null;
  return pageUrl;
}
`,
  giai: '// Reference solution\n' + nguon(referrerFor),
  cases: [
    { goi: goi('referrerFor', PAGE, 'http://127.0.0.1:4801/pixel.gif', ''), moTa: ['No policy, third party (real run: origin only)', 'Không policy, bên thứ ba (chạy thật: chỉ origin)'] },
    { goi: goi('referrerFor', PAGE, 'http://localhost:4800/static/app.js', ''), moTa: ['No policy, same origin (real run: full URL)', 'Không policy, cùng origin (chạy thật: URL đầy đủ)'] },
    { goi: goi('referrerFor', PAGE, 'http://127.0.0.1:4801/pixel.gif', 'no-referrer-when-downgrade'), an: true },
    { goi: goi('referrerFor', PAGE, 'http://127.0.0.1:4801/pixel.gif', 'no-referrer'), an: true },
    { goi: goi('referrerFor', 'https://id.labflow.example/a?b=1#frag', 'http://cdn.example/x.js', 'strict-origin-when-cross-origin'), an: true, moTa: ['https ⇒ http downgrade', 'Hạ cấp https ⇒ http'] },
    { goi: goi('referrerFor', 'https://ID.LabFlow.example:443/a#f', 'https://id.labflow.example/b', 'same-origin'), an: true },
    { goi: goi('referrerFor', 'http://localhost:4800/a', 'http://localhost:4801/b', 'same-origin'), an: true },
    { goi: 'referrerFor("https://id.labflow.example/r?t=1", "https://api.example/x", undefined)', an: true },
    { goi: goi('referrerFor', 'https://id.labflow.example/r?t=1', 'http://api.example/x', 'unsafe-url'), an: true },
    { goi: goi('referrerFor', 'file:///tmp/a.html', 'https://api.example/x', 'unsafe-url'), an: true },
    { goi: goi('referrerFor', PAGE, 'http://127.0.0.1:4801/', 'banana'), an: true },
  ],
});

export default doiDau({ slug: 'auth-1-1-tin-vat-mang-theo', ten: '1.1 Whoever holds it, is you', khoa: KHOA, baiHoc: 'auth-1-1-tin-vat-mang-theo', de: [S1, S2, S3, S4] });
