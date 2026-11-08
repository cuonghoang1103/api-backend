/** Node.js 8.4 — Cookie HttpOnly + SameSite đo trên Chromium, CSRF (Origin + double-submit, so sánh hằng thời gian), đăng xuất mọi thiết bị bằng tokenVersion (và cấp lại cho người gọi), chặn dò mật khẩu theo IP + email với X-Forwarded-For đúng. */
import { modul, cs, bang1, tn, jsBai, goi, RES } from './_node-c6-8.mjs';

/* ── 1. SameSite, đo thật ── */
const GUI = ['cookie sent', 'cookie not sent'];
const E1 = cs({
  ten: '8.4 · 1 — What SameSite really does, as measured in Chromium 149', kho: 'EASY', phut: 8, loai: 'table',
  en: 'Lesson 8.4 measured it in a real browser: log in at the bank (localhost:4310), then the attacker’s page (127.0.0.1:4311, a different site) auto-submits a POST form and shows a link the user clicks. Fill in what the browser did with the bank’s session cookie.',
  vi: 'Bài 8.4 đo trong trình duyệt thật: đăng nhập ở ngân hàng (localhost:4310), rồi trang của kẻ tấn công (127.0.0.1:4311, một site khác) tự gửi một form POST và hiện một liên kết cho người dùng bấm. Điền xem trình duyệt đã làm gì với cookie phiên của ngân hàng.',
  bang: [bang1('b1', ['Cookie setting → cross-site POST / link click', 'Thiết lập cookie → POST chéo site / bấm liên kết'], [{ ma: 'c', ten: 'Cookie' }, { ma: 'p', ten: 'Cross-site POST', luaChon: GUI }, { ma: 'l', ten: 'Link click', luaChon: GUI }], [
    { o: { c: 'SameSite=Lax' }, a: { p: 'cookie not sent', l: 'cookie sent' } },
    { o: { c: 'SameSite=Strict' }, a: { p: 'cookie not sent', l: 'cookie not sent' } },
    { o: { c: 'SameSite=None; Secure' }, a: { p: 'cookie sent', l: 'cookie sent' } },
    { o: { c: 'no SameSite, just set' }, a: { p: 'cookie sent', l: 'cookie sent' } },
    { o: { c: 'no SameSite, 2+ minutes later' }, a: { p: 'cookie not sent', l: 'cookie sent' } },
  ], ['Lax blocks the classic cross-site form POST but keeps the link click logged in — why it is the default to use. Strict also breaks the link click (the user lands on the login page). None gives the protection up entirely. A cookie without SameSite is treated as Lax — except during its first 2 minutes, when a cross-site top-level POST still carries it: that window, old browsers and sibling subdomains are why SameSite alone is not the whole defence.', 'Lax chặn form POST chéo site kinh điển nhưng giữ đăng nhập khi bấm liên kết — vì vậy nó là mặc định nên dùng. Strict còn làm hỏng cả lần bấm liên kết (người dùng rơi vào trang đăng nhập). None bỏ hẳn sự bảo vệ. Cookie không có SameSite được coi là Lax — trừ 2 phút đầu sau khi đặt, khi POST chéo site cấp cao nhất vẫn mang nó: khe hở đó, trình duyệt cũ và subdomain anh em là lý do SameSite một mình không phải toàn bộ lớp phòng thủ.'])],
  goiY: [['Lax = sent on top-level navigation with a safe method (a link), not on cross-site POST.', 'Lax = gửi khi điều hướng cấp cao nhất với phương thức an toàn (liên kết), không gửi với POST chéo site.'], ['Remember the 2-minute exception for cookies set without SameSite.', 'Nhớ ngoại lệ 2 phút cho cookie đặt không có SameSite.']],
  loi: [['Assuming a missing SameSite means None — or means Lax from the very first second.', 'Cho rằng thiếu SameSite nghĩa là None — hoặc là Lax ngay từ giây đầu.'], ['Using Strict for the session cookie and wondering why links from email land on the login page.', 'Dùng Strict cho cookie phiên rồi thắc mắc vì sao liên kết từ email rơi vào trang đăng nhập.']],
  tns: [tn('SameSite', 'SameSite', 'Khi nào trình duyệt gửi cookie cho request chéo site.'), tn('CSRF', 'giả mạo request chéo site', 'Trang khác khiến trình duyệt gửi request kèm cookie của bạn.'), tn('HttpOnly', 'HttpOnly', 'JavaScript không đọc được cookie.')],
  kn: ['cookies', 'CSRF'],
});

/* ── 2. Set-Cookie dựng đúng, xoá đúng ── */
function serializeCookie(name, value, opts = {}) {
  const parts = [name + '=' + encodeURIComponent(value)];
  parts.push('Path=' + (opts.path ?? '/'));
  if (opts.maxAge !== undefined) parts.push('Max-Age=' + Math.floor(opts.maxAge));      // seconds — must line up with the token's exp
  if (opts.httpOnly) parts.push('HttpOnly');                                             // document.cookie cannot read it
  if (opts.secure) parts.push('Secure');                                                 // HTTPS only
  if (opts.sameSite) {
    const s = opts.sameSite[0].toUpperCase() + opts.sameSite.slice(1).toLowerCase();
    if (s === 'None' && !opts.secure) throw new TypeError('SameSite=None requires Secure');
    parts.push('SameSite=' + s);
  }
  return parts.join('; ');
}
function clearCookie(name, opts = {}) {
  // the SAME path (and flags) as when it was set — a mismatched path silently clears nothing
  return serializeCookie(name, '', { ...opts, maxAge: 0 });
}
const E2 = jsBai({
  ten: '8.4 · 2 — Write serializeCookie() and clearCookie(): the flags, and a logout that really clears', kho: 'EASY', phut: 12,
  en: `<p>Build the <code>Set-Cookie</code> lines of lesson 8.4. <code>serializeCookie(name, value, opts)</code> with <code>opts = { path = "/", maxAge?, httpOnly?, secure?, sameSite? }</code> returns, joined by <code>"; "</code> in this order:</p>
<ol><li><code>name=</code> + <code>encodeURIComponent(value)</code>;</li><li><code>Path=…</code> (default <code>/</code>);</li><li><code>Max-Age=…</code> if given (whole seconds);</li><li><code>HttpOnly</code>, then <code>Secure</code>, if true;</li><li><code>SameSite=Lax|Strict|None</code> if given — accept any case and write it capitalised. <code>SameSite=None</code> without <code>secure</code> ⇒ throw <code>TypeError</code> (browsers reject it).</li></ol>
<p><code>clearCookie(name, opts)</code> = the same line with an empty value and <code>Max-Age=0</code> — with the <b>same options</b> the cookie was set with.</p>
<p>Lesson output: <code>access_token=gia-lap-jwt; Path=/; HttpOnly; SameSite=Lax</code> · <code>csrf_token=5866…; Path=/; SameSite=Lax</code>.</p>`,
  vi: `<p>Dựng các dòng <code>Set-Cookie</code> của bài 8.4. <code>serializeCookie(name, value, opts)</code> với <code>opts = { path = "/", maxAge?, httpOnly?, secure?, sameSite? }</code> trả về, nối bằng <code>"; "</code> theo thứ tự:</p>
<ol><li><code>name=</code> + <code>encodeURIComponent(value)</code>;</li><li><code>Path=…</code> (mặc định <code>/</code>);</li><li><code>Max-Age=…</code> nếu có (số giây nguyên);</li><li><code>HttpOnly</code>, rồi <code>Secure</code>, nếu true;</li><li><code>SameSite=Lax|Strict|None</code> nếu có — nhận mọi kiểu hoa thường và viết hoa chữ đầu. <code>SameSite=None</code> không có <code>secure</code> ⇒ ném <code>TypeError</code> (trình duyệt từ chối).</li></ol>
<p><code>clearCookie(name, opts)</code> = cùng dòng đó với giá trị rỗng và <code>Max-Age=0</code> — với <b>cùng các tuỳ chọn</b> lúc đặt cookie.</p>
<p>Output của bài: <code>access_token=gia-lap-jwt; Path=/; HttpOnly; SameSite=Lax</code> · <code>csrf_token=5866…; Path=/; SameSite=Lax</code>.</p>`,
  yc: [['Attributes in exactly the listed order.', 'Thuộc tính đúng thứ tự đã liệt kê.'], ['clearCookie reuses the original options.', 'clearCookie dùng lại tuỳ chọn ban đầu.']],
  goiY: [['Push parts into an array and <code>join("; ")</code>.', 'Đẩy từng phần vào mảng rồi <code>join("; ")</code>.'], ['<code>clearCookie = (name, opts) =&gt; serializeCookie(name, "", { ...opts, maxAge: 0 })</code>.', '<code>clearCookie = (name, opts) =&gt; serializeCookie(name, "", { ...opts, maxAge: 0 })</code>.']],
  loi: [['Clearing <code>refresh_token</code> with the default Path=/ when it was set with Path=/api/v1/auth — the browser keeps the real one and the logout does nothing.', 'Xoá <code>refresh_token</code> với Path=/ mặc định trong khi lúc đặt là Path=/api/v1/auth — trình duyệt giữ cái thật và đăng xuất chẳng làm gì.'], ['SameSite=None without Secure: modern browsers drop the cookie entirely, and login “randomly” stops working.', 'SameSite=None không có Secure: trình duyệt hiện đại bỏ hẳn cookie, và đăng nhập "tự nhiên" ngừng chạy.']],
  gt: ['Each flag closes one door: HttpOnly keeps the value away from injected scripts, Secure keeps it off plain HTTP, SameSite keeps it off most cross-site requests, Path keeps the refresh cookie off the hundreds of ordinary API calls. A cookie is identified by name + domain + path, so clearing it is only possible with the same path it was set with.', 'Mỗi cờ đóng một cánh cửa: HttpOnly giữ giá trị tránh xa script bị chèn, Secure giữ nó khỏi HTTP thường, SameSite giữ nó khỏi phần lớn request chéo site, Path giữ cookie refresh khỏi hàng trăm lời gọi API thông thường. Cookie được nhận diện bằng tên + domain + path, nên chỉ xoá được khi dùng đúng path lúc đặt.'],
  kn: ['cookies'],
  tns: [tn('Set-Cookie', 'Set-Cookie', 'Header server dùng để đặt cookie.'), tn('Max-Age', 'Max-Age', 'Thời gian sống tính bằng giây.')],
  dau: `function serializeCookie(name, value, opts = {}) {
  // Write your solution here
  let s = name + '=' + value;
  if (opts.httpOnly) s += '; HttpOnly';
  return s;
}
function clearCookie(name, opts = {}) {
  return name + '=; Max-Age=0';
}
`,
  giai: [serializeCookie, clearCookie],
  chung: `const caught = (f) => { try { return f(); } catch (e) { return { thrown: e.name }; } };`,
  cases: [
    { goi: `[serializeCookie('access_token', 'gia-lap-jwt', { httpOnly: true, sameSite: 'lax' }), serializeCookie('csrf_token', '5866ee2352054a7d4323e097c541f0bb', { sameSite: 'Lax' })]`, moTa: ['The lesson’s two cookies', 'Hai cookie của bài'] },
    { goi: `serializeCookie('refresh_token', 'r/1+2=3', { path: '/api/v1/auth', maxAge: 2592000, httpOnly: true, secure: true, sameSite: 'strict' })`, moTa: ['Refresh cookie scoped to /api/v1/auth', 'Cookie refresh giới hạn ở /api/v1/auth'] },
    { goi: `clearCookie('refresh_token', { path: '/api/v1/auth', httpOnly: true, secure: true, sameSite: 'Strict' })`, moTa: ['Logout clears with the same path', 'Đăng xuất xoá với cùng path'] },
    { goi: `[caught(() => serializeCookie('s', 'x', { sameSite: 'none' })), serializeCookie('s', 'x', { sameSite: 'NONE', secure: true })]`, an: true },
    { goi: `[serializeCookie('a', 'b c;d'), serializeCookie('t', 'v', { maxAge: 899.9 }), clearCookie('access_token')]`, an: true },
  ],
});

/* ── 3. Chặn CSRF: Origin rồi double-submit ── */
function safeEqual(a, b) {
  // constant-time: always compare every character, and never return early on the first difference
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;   // length first (timingSafeEqual throws otherwise)
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
const csrfGuard = ({ allowedOrigins }) => (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();          // safe methods change nothing
  const cookieSession = req.cookies && req.cookies.access_token;
  // a Bearer header is attached by YOUR code, never by the browser: no cookie, no CSRF surface
  if (!cookieSession && (req.get('authorization') || '').startsWith('Bearer ')) return next();
  // 1) Origin (or Referer) check — two lines, stops the majority
  let o = req.get('origin') || null;
  if (!o && req.get('referer')) { try { o = new URL(req.get('referer')).origin; } catch { o = 'invalid'; } }
  if (o && !allowedOrigins.includes(o)) return res.status(403).json({ error: 'CROSS_SITE', origin: o });
  // 2) double-submit: evil.com can make the browser SEND the cookie, but can never READ it to copy it into a header
  const c = req.cookies && req.cookies.csrf_token, h = req.get('x-csrf-token');
  if (!c || !h || !safeEqual(c, h)) return res.status(403).json({ error: 'CSRF_TOKEN_MISMATCH' });
  next();
};
const E3 = jsBai({
  ten: '8.4 · 3 — Write csrfGuard({ allowedOrigins }): Origin check, then double-submit, compared in constant time', kho: 'MEDIUM', phut: 20,
  en: `<p>The lesson’s bank: with no SameSite protection, a form on evil.com moved 100,000,000 dong with a perfectly valid session. Write <code>safeEqual(a, b)</code> and the middleware factory <code>csrfGuard({ allowedOrigins })</code>:</p>
<ul><li><code>safeEqual</code>: <code>false</code> unless both are strings of equal length; then compare <b>every</b> character (XOR into an accumulator) and return whether all matched — no early exit (the grader has no <code>crypto.timingSafeEqual</code>).</li>
<li>GET, HEAD, OPTIONS ⇒ <code>next()</code>.</li>
<li>No <code>access_token</code> cookie but an <code>Authorization: Bearer …</code> header ⇒ <code>next()</code> — a pure token API has no CSRF surface.</li>
<li>Origin = the <code>Origin</code> header, or else the origin of the <code>Referer</code> URL (an unparsable Referer counts as origin <code>"invalid"</code>). If there is one and it is not in <code>allowedOrigins</code> ⇒ <code>res.status(403).json({ error: "CROSS_SITE", origin })</code>.</li>
<li>Then the <code>csrf_token</code> cookie must equal the <code>X-CSRF-Token</code> header (via <code>safeEqual</code>), both present ⇒ else <code>403 { error: "CSRF_TOKEN_MISMATCH" }</code>. Otherwise <code>next()</code>.</li></ul>`,
  vi: `<p>Ngân hàng của bài: không có SameSite bảo vệ, một form trên evil.com chuyển 100.000.000 đồng với một phiên hoàn toàn hợp lệ. Viết <code>safeEqual(a, b)</code> và hàm tạo middleware <code>csrfGuard({ allowedOrigins })</code>:</p>
<ul><li><code>safeEqual</code>: <code>false</code> trừ khi cả hai là chuỗi cùng độ dài; rồi so <b>mọi</b> ký tự (XOR dồn vào một biến) và trả xem tất cả có khớp — không thoát sớm (máy chấm không có <code>crypto.timingSafeEqual</code>).</li>
<li>GET, HEAD, OPTIONS ⇒ <code>next()</code>.</li>
<li>Không có cookie <code>access_token</code> nhưng có header <code>Authorization: Bearer …</code> ⇒ <code>next()</code> — API thuần token không có bề mặt CSRF.</li>
<li>Origin = header <code>Origin</code>, không có thì origin của URL <code>Referer</code> (Referer không đọc được tính là origin <code>"invalid"</code>). Nếu có và không nằm trong <code>allowedOrigins</code> ⇒ <code>res.status(403).json({ error: "CROSS_SITE", origin })</code>.</li>
<li>Rồi cookie <code>csrf_token</code> phải bằng header <code>X-CSRF-Token</code> (qua <code>safeEqual</code>), cả hai đều có ⇒ không thì <code>403 { error: "CSRF_TOKEN_MISMATCH" }</code>. Còn lại <code>next()</code>.</li></ul>`,
  yc: [['Only state-changing methods are checked.', 'Chỉ kiểm các phương thức thay đổi trạng thái.'], ['Length check before comparing.', 'Kiểm độ dài trước khi so.']],
  goiY: [['<code>let diff = 0; for (…) diff |= a.charCodeAt(i) ^ b.charCodeAt(i); return diff === 0;</code>', '<code>let diff = 0; for (…) diff |= a.charCodeAt(i) ^ b.charCodeAt(i); return diff === 0;</code>'], ['Referer: <code>new URL(req.get("referer")).origin</code> inside try/catch.', 'Referer: <code>new URL(req.get("referer")).origin</code> trong try/catch.']],
  loi: [['<code>c === h</code>: returns at the first different character, so response time leaks how much of the token was right.', '<code>c === h</code>: trả về ở ký tự khác đầu tiên, nên thời gian phản hồi lộ ra bao nhiêu phần token đã đúng.'], ['Treating a missing Origin as an attack: same-origin form posts from older browsers send none — the double-submit token is the backstop.', 'Coi thiếu Origin là tấn công: form cùng origin từ trình duyệt cũ không gửi Origin — token double-submit là lớp đỡ phía sau.'], ['Requiring the CSRF header on Bearer-authenticated mobile requests that carry no cookie at all.', 'Đòi header CSRF ở request di động xác thực bằng Bearer mà không mang cookie nào.']],
  gt: ['CSRF works because the browser attaches cookies by domain, whoever started the request. The Origin header tells you who started it; the double-submit token proves the caller could READ a cookie of your site, which the same-origin policy forbids evil.com from doing. Bearer headers are never attached automatically — that is why CSRF is a cookie problem, not an HTTP problem.', 'CSRF chạy được vì trình duyệt gắn cookie theo domain, bất kể ai khởi tạo request. Header Origin cho biết ai khởi tạo; token double-submit chứng minh bên gọi ĐỌC được cookie của site bạn, điều mà chính sách cùng nguồn cấm evil.com làm. Header Bearer không bao giờ được gắn tự động — vì thế CSRF là vấn đề của cookie, không phải của HTTP.'],
  kn: ['CSRF', 'timing attacks'],
  tns: [tn('double-submit cookie', 'cookie gửi kép', 'Giá trị cookie phải được chép vào header.'), tn('constant-time comparison', 'so sánh hằng thời gian'), tn('same-origin policy', 'chính sách cùng nguồn')],
  dau: `function safeEqual(a, b) {
  // Write your solution here
  return a === b;
}
const csrfGuard = ({ allowedOrigins }) => (req, res, next) => {
  if (req.get('origin') && !allowedOrigins.includes(req.get('origin'))) return res.status(403).json({ error: 'CROSS_SITE', origin: req.get('origin') });
  next();
};
`,
  giai: `// Reference solution\n${safeEqual}\n\nconst csrfGuard = ${csrfGuard.toString()};\n`,
  chung: RES + `
const ORIGINS = ['http://localhost:4310'];
const R = (o) => mkReq({ method: 'POST', cookies: { access_token: 'jwt', csrf_token: '5866ee2352054a7d4323e097c541f0bb' }, ...o });
const run = (req) => { const res = mkRes(); const next = mkNext(); csrfGuard({ allowedOrigins: ORIGINS })(req, res, next); return next.calls.length ? 'next()' : { status: res.statusCode, body: res.body }; };`,
  cases: [
    { goi: `run(R({ headers: { origin: 'http://evil.com', 'x-csrf-token': '5866ee2352054a7d4323e097c541f0bb' } }))`, moTa: ['evil.com ⇒ CROSS_SITE', 'evil.com ⇒ CROSS_SITE'] },
    { goi: `[run(R({ headers: { origin: 'http://localhost:4310', 'x-csrf-token': '5866ee2352054a7d4323e097c541f0bb' } })), run(R({ headers: { origin: 'http://localhost:4310' } }))]`, moTa: ['The bank itself: with and without the header', 'Chính ngân hàng: có và không có header'] },
    { goi: `[safeEqual('abc', 'abc'), safeEqual('abc', 'abd'), safeEqual('abc', 'abcd'), safeEqual(undefined, 'x')]` },
    { goi: `[run(R({ headers: { referer: 'http://evil.com/page?x=1' } })), run(R({ headers: { referer: 'not a url' } })), run(R({ headers: { referer: 'http://localhost:4310/transfer', 'x-csrf-token': '5866ee2352054a7d4323e097c541f0bb' } }))]`, an: true },
    { goi: `[run(R({ method: 'GET', headers: { origin: 'http://evil.com' } })), run(mkReq({ method: 'POST', headers: { authorization: 'Bearer abc' } })), run(mkReq({ method: 'POST', headers: { authorization: 'Bearer abc' }, cookies: { access_token: 'jwt' } }))]`, an: true, moTa: ['GET passes; pure Bearer has no CSRF surface; Bearer + cookie is still checked', 'GET qua; Bearer thuần không có bề mặt CSRF; Bearer + cookie vẫn bị kiểm'] },
    { goi: `[run(R({ headers: { 'x-csrf-token': '5866ee2352054a7d4323e097c541f0bX' } })), run(R({ headers: { 'x-csrf-token': '5866' } })), run(mkReq({ method: 'DELETE', cookies: { access_token: 'jwt' }, headers: { 'x-csrf-token': '' } }))]`, an: true },
  ],
});

/* ── 4. Chặn dò mật khẩu: IP + email, 429, Retry-After, X-Forwarded-For đúng ── */
function createLoginLimiter({ windowMs = 60000, max = 5, trustedProxies = 1 } = {}) {
  const buckets = new Map();                                   // per process — Redis is the shared version (chapter 12)
  function clientIp(req) {
    const xff = (req.get('x-forwarded-for') || '').split(',').map((s) => s.trim()).filter(Boolean);
    // the CLIENT writes the left side of X-Forwarded-For; our own proxy APPENDS on the right — trust only that entry
    if (trustedProxies > 0 && xff.length >= trustedProxies) return xff[xff.length - trustedProxies];
    return req.ip;
  }
  return function loginLimit(req, res, next) {
    const key = clientIp(req) + '|' + String(req.body?.email ?? '').toLowerCase();   // IP + email: one NAT does not lock out an office
    const now = Date.now();
    let b = buckets.get(key);
    if (!b || now >= b.start + windowMs) { b = { start: now, count: 0 }; buckets.set(key, b); }
    b.count++;                                                  // counted BEFORE verification: a correct password cannot probe the limit
    res.set('RateLimit-Remaining', String(Math.max(0, max - b.count)));
    if (b.count > max) {
      res.set('Retry-After', String(Math.ceil((b.start + windowMs - now) / 1000)));
      return res.status(429).json({ error: { code: 'RATE_LIMITED', message: 'Too many login attempts' } });
    }
    next();
  };
}
const E4 = jsBai({
  ten: '8.4 · 4 — Write createLoginLimiter(): 5 per minute per IP + email, 429 with Retry-After, and an IP you can trust', kho: 'HARD', phut: 30,
  en: `<p>/auth/login is where credentials are guessed and where 33 ms of argon2 is spent per attempt. Write <code>createLoginLimiter({ windowMs = 60000, max = 5, trustedProxies = 1 })</code> returning <code>loginLimit(req, res, next)</code>:</p>
<ul><li><b>Client IP</b>: split <code>X-Forwarded-For</code> on commas (trim, drop empties). If <code>trustedProxies &gt; 0</code> and there are at least that many entries, the IP is the entry <code>trustedProxies</code> from the <b>right</b> (with one proxy: the last one — the one your proxy appended). Otherwise <code>req.ip</code>.</li>
<li><b>Key</b> = IP + <code>"|"</code> + lower-cased <code>req.body.email</code>.</li>
<li><b>Fixed window</b>: a bucket starts at the first attempt (<code>Date.now()</code> — the grader’s virtual clock) and lasts <code>windowMs</code>; after that a new bucket starts. Count the attempt first.</li>
<li>Always set header <code>RateLimit-Remaining</code> = <code>max − count</code>, never below 0.</li>
<li>Over <code>max</code> ⇒ header <code>Retry-After</code> = seconds until the window ends (rounded up) and <code>res.status(429).json({ error: { code: "RATE_LIMITED", message: "Too many login attempts" } })</code>; otherwise <code>next()</code>.</li></ul>
<p>Lesson output: attempts 1–5 ⇒ remaining 4…0, attempts 6 and 7 ⇒ 429 with <code>Retry-After: 60</code>; the right password while blocked ⇒ still 429; another email from the same IP ⇒ allowed.</p>`,
  vi: `<p>/auth/login là nơi mật khẩu bị đoán và nơi mỗi lần thử tốn 33 ms argon2. Viết <code>createLoginLimiter({ windowMs = 60000, max = 5, trustedProxies = 1 })</code> trả <code>loginLimit(req, res, next)</code>:</p>
<ul><li><b>IP client</b>: tách <code>X-Forwarded-For</code> theo dấu phẩy (trim, bỏ phần rỗng). Nếu <code>trustedProxies &gt; 0</code> và có ít nhất ngần ấy mục, IP là mục thứ <code>trustedProxies</code> tính từ <b>bên phải</b> (một proxy: mục cuối — mục proxy của bạn nối vào). Không thì <code>req.ip</code>.</li>
<li><b>Khoá</b> = IP + <code>"|"</code> + <code>req.body.email</code> chữ thường.</li>
<li><b>Cửa sổ cố định</b>: một xô bắt đầu ở lần thử đầu (<code>Date.now()</code> — đồng hồ ảo của máy chấm) và kéo dài <code>windowMs</code>; sau đó bắt đầu xô mới. Đếm lần thử trước.</li>
<li>Luôn đặt header <code>RateLimit-Remaining</code> = <code>max − count</code>, không bao giờ dưới 0.</li>
<li>Vượt <code>max</code> ⇒ header <code>Retry-After</code> = số giây tới khi cửa sổ hết (làm tròn lên) và <code>res.status(429).json({ error: { code: "RATE_LIMITED", message: "Too many login attempts" } })</code>; không thì <code>next()</code>.</li></ul>
<p>Output của bài: lần 1–5 ⇒ còn lại 4…0, lần 6 và 7 ⇒ 429 kèm <code>Retry-After: 60</code>; mật khẩu đúng khi đang bị chặn ⇒ vẫn 429; email khác từ cùng IP ⇒ được.</p>`,
  yc: [['Never take the leftmost X-Forwarded-For entry.', 'Không bao giờ lấy mục bên trái nhất của X-Forwarded-For.'], ['A 429 never calls next().', '429 không bao giờ gọi next().'], ['The window expires by itself — no permanent lockout.', 'Cửa sổ tự hết hạn — không khoá vĩnh viễn.']],
  goiY: [['Buckets: <code>Map(key → { start, count })</code>; reset when <code>now >= start + windowMs</code>.', 'Xô: <code>Map(khoá → { start, count })</code>; đặt lại khi <code>now >= start + windowMs</code>.'], ['<code>Math.ceil((b.start + windowMs - now) / 1000)</code> for Retry-After.', '<code>Math.ceil((b.start + windowMs - now) / 1000)</code> cho Retry-After.']],
  loi: [['Keying on IP alone: one office behind one NAT locks out everybody.', 'Chỉ khoá theo IP: một văn phòng sau một NAT khoá tất cả mọi người.'], ['Trusting the first X-Forwarded-For entry (<code>trust proxy: true</code>): the attacker sends a fresh fake IP per request and the limit evaporates — the bug this project shipped and fixed.', 'Tin mục X-Forwarded-For đầu tiên (<code>trust proxy: true</code>): kẻ tấn công gửi IP giả mới mỗi request và giới hạn bốc hơi — đúng lỗi dự án này từng phát hành rồi sửa.'], ['Permanently locking the account after N failures: a denial-of-service tool aimed at your own users.', 'Khoá vĩnh viễn tài khoản sau N lần sai: công cụ từ chối dịch vụ nhắm vào chính người dùng của bạn.']],
  gt: ['Each decision in the output is a trade-off: IP + email avoids locking out a whole NAT; a 429 that expires avoids lockout as a weapon; counting before verification stops the limit from being an oracle for “was that the right password?”; Retry-After tells an honest client exactly when to return. And req.ip is only as honest as your proxy configuration — take the entry YOUR proxy appended, not the one the client wrote.', 'Mỗi quyết định trong output là một sự đánh đổi: IP + email tránh khoá cả một NAT; 429 tự hết hạn tránh biến việc khoá thành vũ khí; đếm trước khi kiểm ngăn giới hạn trở thành cỗ máy trả lời "mật khẩu đó đúng không?"; Retry-After cho client lương thiện biết chính xác khi nào quay lại. Và req.ip chỉ trung thực bằng cấu hình proxy của bạn — lấy mục do proxy CỦA BẠN nối vào, không lấy mục client tự viết.'],
  kn: ['rate limiting', 'proxies'],
  tns: [tn('X-Forwarded-For', 'X-Forwarded-For', 'Chuỗi IP mà các proxy nối vào.'), tn('fixed window', 'cửa sổ cố định'), tn('429 Too Many Requests', '429')],
  dau: `function createLoginLimiter({ windowMs = 60000, max = 5, trustedProxies = 1 } = {}) {
  const counts = new Map();
  return function loginLimit(req, res, next) {
    // Write your solution here
    const ip = (req.get('x-forwarded-for') || req.ip).split(',')[0].trim();
    const n = (counts.get(ip) || 0) + 1;
    counts.set(ip, n);
    if (n > max) return res.status(429).json({ error: { code: 'RATE_LIMITED', message: 'Too many login attempts' } });
    next();
  };
}
`,
  giai: createLoginLimiter,
  chung: RES + `
const limiter = createLoginLimiter();
const wait = (ms) => new Promise((ok) => setTimeout(ok, ms));
const hit = (email, xff, ip = '10.0.0.1') => { const req = mkReq({ method: 'POST', body: { email }, ip, headers: xff ? { 'x-forwarded-for': xff } : {} }); const res = mkRes(); const next = mkNext(); limiter(req, res, next);
  return next.calls.length ? 'next ' + res.headers['ratelimit-remaining'] : res.statusCode + ' remaining=' + res.headers['ratelimit-remaining'] + ' retry-after=' + res.headers['retry-after']; };`,
  cases: [
    { goi: `Array.from({ length: 7 }, () => hit('an@vd.com', '203.0.113.7'))`, moTa: ['Attempts 1–7 from one client', 'Lần 1–7 từ một client'] },
    { goi: `(() => { for (let i = 0; i < 6; i++) hit('An@VD.com', '203.0.113.7'); return [hit('an@vd.com', '203.0.113.7'), hit('chi@vd.com', '203.0.113.7')]; })()`, moTa: ['Still blocked (case-insensitive); another email from the same IP is allowed', 'Vẫn bị chặn (không phân biệt hoa thường); email khác cùng IP được'] },
    { goi: `await (async () => { for (let i = 0; i < 6; i++) hit('an@vd.com', '203.0.113.7'); await wait(45000); const a = hit('an@vd.com', '203.0.113.7'); await wait(15000); return [a, hit('an@vd.com', '203.0.113.7')]; })()`, an: true, timeoutMs: 120000, moTa: ['Retry-After counts down; the window expires by itself', 'Retry-After đếm ngược; cửa sổ tự hết hạn'] },
    { goi: `Array.from({ length: 7 }, (_, i) => hit('an@vd.com', '1.2.3.' + i + ', 203.0.113.7'))`, an: true, moTa: ['A fake left-hand IP per request does not reset the bucket', 'IP giả bên trái mỗi request không đặt lại xô'] },
    { goi: `(() => { const r = []; for (let i = 0; i < 6; i++) r.push(hit('x@vd.com', null, '198.51.100.' + (i % 2))); return r; })()`, an: true, moTa: ['No XFF ⇒ req.ip', 'Không có XFF ⇒ req.ip'] },
    { goi: `(() => { const two = createLoginLimiter({ trustedProxies: 2, max: 1 }); const go = (xff) => { const req = mkReq({ method: 'POST', body: { email: 'a@b' }, ip: '10.0.0.9', headers: { 'x-forwarded-for': xff } }); const res = mkRes(); const n = mkNext(); two(req, res, n); return n.calls.length ? 'next' : res.statusCode; }; return [go('9.9.9.9, 203.0.113.7, 172.16.0.2'), go('8.8.8.8, 203.0.113.7, 172.16.0.3'), go('203.0.113.8, 172.16.0.2')]; })()`, an: true },
  ],
  saiMau: [
    createLoginLimiter.toString().replace("return xff[xff.length - trustedProxies];", 'return xff[0];'),
    createLoginLimiter.toString().replace("const key = clientIp(req) + '|' + String(req.body?.email ?? '').toLowerCase();", 'const key = clientIp(req);'),
  ],
});

/* ── 5. Đăng xuất mọi thiết bị — và cấp lại cho người gọi ── */
async function logoutEverywhere(prisma, userId, issueFor) {
  // both in ONE transaction: revoking refresh tokens without bumping the version leaves access tokens alive,
  // bumping without revoking lets a refresh mint a new pair
  const [, user] = await prisma.$transaction([
    prisma.refreshSession.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } }),
    prisma.user.update({ where: { id: userId }, data: { tokenVersion: { increment: 1 } } }),
  ]);
  // the one line every first implementation forgets: the device that asked must not be thrown out too
  return { ok: true, tokenVersion: user.tokenVersion, ...issueFor(user) };
}
const FAKE_LOGOUT = `const mkPrisma = () => { const db = { user: { id: 1, email: 'an@vd.com', tokenVersion: 0 }, sessions: [{ id: 's1', userId: 1, revokedAt: null }, { id: 's2', userId: 1, revokedAt: null }, { id: 's3', userId: 2, revokedAt: null }] }; const log = [];
  const lazy = (name, run) => ({ name, run, then(ok, no) { log.push(name + ' (outside a transaction)'); return Promise.resolve().then(run).then(ok, no); } });
  return { db, log,
    refreshSession: { updateMany: (a) => lazy('refreshSession.updateMany', () => { let count = 0; for (const s of db.sessions) if (s.userId === a.where.userId && s.revokedAt === null) { s.revokedAt = 'revoked'; count++; } return { count }; }) },
    user: { update: (a) => lazy('user.update', () => { const inc = a.data.tokenVersion && a.data.tokenVersion.increment; if (inc) db.user.tokenVersion += inc; return { ...db.user }; }) },
    $transaction: async (arr) => { if (!Array.isArray(arr)) throw new Error('use the array form'); log.push('$transaction[' + arr.map((x) => x.name).join(', ') + ']'); return arr.map((x) => x.run()); } }; };
const issueFor = (user) => ({ accessToken: 'access:' + user.id + ':tv' + user.tokenVersion, refreshToken: 'fresh-refresh' });
// what requireAuth does with an access token (lesson 8.3): compare its tv with the user's current tokenVersion
const accepted = (prisma, token) => Number(token.split(':tv')[1]) === prisma.db.user.tokenVersion ? 200 : '401 TOKEN_REVOKED';`;
const E5 = jsBai({
  ten: '8.4 · 5 — Write logoutEverywhere(): revoke and bump in one transaction, and keep the caller logged in', kho: 'MEDIUM', phut: 15,
  en: `<p>“Log out other devices” must kill every access token now, not in 15 minutes. The lesson’s mechanism: a counter on the user, copied into every token as <code>tv</code>. Write <code>async logoutEverywhere(prisma, userId, issueFor)</code>:</p>
<ul><li>In <b>one</b> batch <code>prisma.$transaction([ … ])</code>: <code>prisma.refreshSession.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } })</code> and <code>prisma.user.update({ where: { id: userId }, data: { tokenVersion: { increment: 1 } } })</code>.</li>
<li>Then issue a fresh pair for the caller: return <code>{ ok: true, tokenVersion, ...issueFor(user) }</code> with the updated user (the second result of the transaction).</li></ul>
<p>The lesson’s run showed the bug this fixes: device 2 called /auth/logout-all and was logged out too, because its own token carried the old <code>tv</code>.</p>`,
  vi: `<p>"Đăng xuất các thiết bị khác" phải giết mọi access token ngay, không phải sau 15 phút. Cơ chế của bài: một bộ đếm trên user, chép vào mọi token dưới tên <code>tv</code>. Viết <code>async logoutEverywhere(prisma, userId, issueFor)</code>:</p>
<ul><li>Trong <b>một</b> <code>prisma.$transaction([ … ])</code> theo lô: <code>prisma.refreshSession.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } })</code> và <code>prisma.user.update({ where: { id: userId }, data: { tokenVersion: { increment: 1 } } })</code>.</li>
<li>Rồi cấp cặp mới cho người gọi: trả <code>{ ok: true, tokenVersion, ...issueFor(user) }</code> với user đã cập nhật (kết quả thứ hai của transaction).</li></ul>
<p>Lần chạy của bài cho thấy lỗi mà cách này sửa: máy 2 gọi /auth/logout-all và cũng bị đăng xuất, vì token của chính nó mang <code>tv</code> cũ.</p>`,
  yc: [['Both writes in one batch transaction.', 'Cả hai lần ghi trong một transaction theo lô.'], ['Return new tokens for the caller.', 'Trả token mới cho người gọi.']],
  goiY: [['<code>const [, user] = await prisma.$transaction([revoke, bump]);</code>', '<code>const [, user] = await prisma.$transaction([revoke, bump]);</code>'], ['<code>{ increment: 1 }</code> is atomic in the database — no read-then-write.', '<code>{ increment: 1 }</code> là nguyên tử trong CSDL — không đọc rồi mới ghi.']],
  loi: [['Two separate awaits: a crash between them leaves either live access tokens or a refresh that can mint new ones.', 'Hai lần await riêng: sập ở giữa thì hoặc còn access token sống, hoặc còn refresh tạo được token mới.'], ['Not re-issuing for the caller: the user clicks “log out other devices” and lands on the login screen.', 'Không cấp lại cho người gọi: người dùng bấm "đăng xuất thiết bị khác" và rơi vào màn đăng nhập.'], ['Forgetting that a password change must do the same — otherwise a thief keeps the session after the victim’s defensive password change.', 'Quên rằng đổi mật khẩu cũng phải làm y vậy — không thì kẻ trộm giữ phiên sau khi nạn nhân đổi mật khẩu để phòng thủ.']],
  gt: ['tokenVersion is the one mechanism that kills a stateless token immediately: requireAuth already looks the user up (8.3), so a bumped counter makes every older token fail with TOKEN_REVOKED on its very next request. Revoking the refresh rows in the same transaction closes the other door — no old refresh can mint a new pair. Re-issuing for the caller turns a correct mechanism into a usable feature.', 'tokenVersion là cơ chế duy nhất giết một token không trạng thái ngay lập tức: requireAuth vốn đã tra user (8.3), nên bộ đếm tăng làm mọi token cũ hơn hỏng với TOKEN_REVOKED ngay ở request kế tiếp. Thu hồi các dòng refresh trong cùng transaction đóng cửa còn lại — không refresh cũ nào tạo được cặp mới. Cấp lại cho người gọi biến một cơ chế đúng thành một tính năng dùng được.'],
  kn: ['revocation', 'transactions'],
  tns: [tn('log out everywhere', 'đăng xuất mọi thiết bị'), tn('revocation', 'thu hồi')],
  dau: `async function logoutEverywhere(prisma, userId, issueFor) {
  // Write your solution here
  await prisma.refreshSession.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
  const user = await prisma.user.update({ where: { id: userId }, data: { tokenVersion: { increment: 1 } } });
  return { ok: true, tokenVersion: user.tokenVersion };
}
`,
  giai: logoutEverywhere,
  chung: FAKE_LOGOUT,
  cases: [
    { goi: `await (async () => { const p = mkPrisma(); const device1 = 'access:1:tv0'; const r = await logoutEverywhere(p, 1, issueFor); return { r, device1: accepted(p, device1), caller: accepted(p, r.accessToken), log: p.log }; })()`, moTa: ['Device 1 is out, the caller stays in, one transaction', 'Máy 1 bị đăng xuất, người gọi ở lại, một transaction'] },
    { goi: `await (async () => { const p = mkPrisma(); await logoutEverywhere(p, 1, issueFor); return p.db.sessions; })()`, moTa: ['Only this user’s refresh sessions are revoked', 'Chỉ phiên refresh của user này bị thu hồi'] },
    { goi: `await (async () => { const p = mkPrisma(); const a = await logoutEverywhere(p, 1, issueFor); const b = await logoutEverywhere(p, 1, issueFor); return [a.tokenVersion, b.tokenVersion, accepted(p, a.accessToken), accepted(p, b.accessToken)]; })()`, an: true },
  ],
});

export default modul('nodejs-8-4-cookie-csrf-thu-hoi', '8.4 Cookies, CSRF, revocation and rate limiting', [E1, E2, E3, E4, E5]);
