/**
 * node-08-4 — Node.js · Chapter 8 · Lesson 8.4 "Cookies, CSRF, revocation and rate limiting" (slide EN, đợt 7 — 01/11/2026).
 * MỘT deck, HAI tập: node-8-4 (slide 1–13) · node-8-4-2 (slide 14–30).
 *   A: chọn chỗ cất (localStorage thua XSS, cookie thua CSRF) · HttpOnly trong Chromium thật (thật: document.cookie chỉ thấy csrf_token) · các cờ ·
 *      kịch bản CSRF · bốn endpoint + hũ cookie curl (thật: yếu 200 chuyển 100 triệu, origin 403, csrf 403, bearer 401; ngân hàng 200×3) ·
 *      mã hai lớp phòng thủ · ma trận SameSite trong Chromium 149 thật (thật: Lax chặn POST cho GET, Strict chặn cả hai, None gửi,
 *      không SameSite: vừa đặt GỬI, sau 2 phút chặn POST) · thứ tự áp dụng
 *   B: đăng xuất ba cỡ · tokenVersion + logoutEverywhere · chạy thật (cả máy gọi cũng bị đăng xuất; bản sửa keepMe) · đổi mật khẩu ·
 *      chặn đăng nhập 5/phút theo IP+email (thật: 401×5, 429 Retry-After 60, đúng mật khẩu vẫn 429, email khác 200) · bốn quyết định ·
 *      trust proxy (thật: false gộp mọi người, true bị giả IP 8/8 lọt, 1 khoá đúng) · Map theo tiến trình (link API Design 8.4) ·
 *      clearCookie lệch path (thật: cookie sống sót) · những thứ nhỏ · bốn lớp · website · bài tập · tự kiểm · tóm tắt
 * Nguồn: nodejs-8-4-cookie-csrf-thu-hoi. Output THẬT: that/c8/{httponly-browser,bank,csrf-browser,logout-all,ratelimit,xff,clear-cookie} + c8notes/{session,loginLimit,auth.routes}.
 * Khác web: web nói "curl -b jar làm đúng cái mà trình duyệt làm" — Chromium thật với SameSite=Lax KHÔNG gửi cookie ở POST từ trang khác (đòn chỉ lọt
 *   khi cookie không có SameSite và vừa đặt < 2 phút, hoặc SameSite=None) ⇒ đã sửa bài web. Bộ đếm theo tiến trình: số đo hai instance dẫn sang API Design 8.4.
 */
import { lamDeck, two, box, cards, flow, bang, J, JW, T, G, TT } from './_c8-chung.mjs';
import { ra, ma } from './_node-chung.mjs';

export const deck = { key: 'node-08-4', code: 'NODE 8.4', title: 'Cookies, CSRF, revocation and rate limiting', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';

/** Ma trận SameSite × (POST form, bấm link) — ô lấy từ output THẬT csrf-browser. */
function maTran() {
  const o = ra('c8/csrf-browser');
  const khoi = o.split('\n\n').slice(1);
  const hang = khoi.map((k) => {
    const l = k.split('\n');
    const post = /POST WITH/.test(k), get = /GET  WITH/.test(k);
    return [l[0].replace(/\s+\(cookie stored.*$/, ''), post, get];
  });
  const td = (bad, txt) => `<td style="text-align:center;font-weight:800;background:${bad ? '#fde2e1' : '#e3f4e8'};color:${bad ? DO : NODE}">${txt}</td>`;
  return `<table class="t" data-k="matran" style="font-size:22px"><tr><th>cookie setting</th><th>attacker's form POSTs to the bank</th><th>user clicks the attacker's link</th></tr>` +
    hang.map(([n, p, g]) => `<tr><td><b>${n}</b></td>${td(p, p ? 'cookie SENT — money moved' : 'not sent — 401')}${td(false, g ? 'cookie sent — logged in' : 'not sent — login page')}</tr>`).join('') + '</table>';
}

export const slides = lamDeck({ chuong: 'Chapter 8 — Authentication & authorisation', bai: '8.4' }, [
  { cover: true, t: 'Cookies, CSRF,<br>revocation and rate limiting', sub: 'Where the browser keeps the token looks like a storage question. It is a security question.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>localStorage or an HttpOnly cookie: the honest trade-off, checked in a real browser</li>
<li>What each cookie flag really does</li>
<li>CSRF with four endpoints, curl, and then a real Chromium — and the SameSite surprise</li>
<li>Logging out at three sizes, including "everywhere, right now"</li>
<li>Rate-limiting the login, and the proxy setting that silently disables it</li>
</ul>` + box('Why it matters to you', 'These are the "operational" pieces that turn a login that works into a login that is safe. They are also the classic interview follow-ups after "how do you store passwords?".', 'lam') },

  { t: 'The choice, said plainly', to: true, giua: true, body: two(
    box('localStorage + Bearer header', 'Immune to CSRF: the browser never attaches it on its own.<br>Fully exposed to XSS: any injected script reads it and sends it anywhere.', 'cam'),
    box('HttpOnly cookie', 'Immune to theft by XSS: JavaScript cannot read the value.<br>Exposed to CSRF: the browser attaches it to every request to your site, whoever started it.', 'lam')) +
    bang(['', 'localStorage + Bearer', 'HttpOnly cookie'], [['an injected script can READ the token', '<b style="color:#b0281a">yes</b>', '<b style="color:#15803d">no</b>'], ['another site can make the browser SEND it', '<b style="color:#15803d">no</b>', '<b style="color:#b0281a">yes</b> (unless defended)']], { co: 22 }) +
    box('No third option is safe against both', 'The practical answer: HttpOnly cookie + an anti-CSRF layer. Once there is XSS the attacker runs code in your page anyway; the cookie at least stops them carrying away a token that still works after the tab is closed.', 'xanh') },

  { t: 'HttpOnly, checked in a real browser', to: true, giua: true, body: JW(ma('c8/httponly-browser', 5, 9), 104, [2, 3], { sm: false }) +
    TT('c8/httponly-browser', 2, 4, 'node httponly-browser.mjs · headless Chromium 149 · real', { hl: [2], n: 112 }) +
    two(box('HttpOnly', 'document.cookie does not see access_token. An injected script cannot read it.', 'xanh'),
      box('localStorage', 'Any script in the page reads the token in one line — including an injected one.', 'do2')) },

  { t: 'What the flags really do', to: true, giua: true, body: T(G('c8/incident', 2, 2, 112), 'Set-Cookie sent by POST /api/v1/auth/login · real') + bang(['flag', 'what it does'], [
    ['<b>HttpOnly</b>', 'document.cookie cannot read it. The most valuable flag.'],
    ['<b>Secure</b>', 'Only sent over HTTPS. Without it, the cookie travels in clear on every http:// request — public Wi-Fi is enough.'],
    ['<b>SameSite=Lax</b>', 'Not sent on POST/PUT/DELETE from another site, still sent when the user clicks a link to you. Strict breaks that click; None needs Secure and gives up the protection.'],
    ['<b>Path</b>', 'Limit the refresh cookie to /api/v1/auth so hundreds of normal API calls never carry it.'],
    ['<b>Max-Age</b>', 'Its lifetime — the clock that must match the token\'s own exp (lesson 8.2).'],
  ], { co: 21 }) },

  { t: 'CSRF: the attack', to: true, giua: true, body: flow([
    { t: 'tab 1: bank', s: 'you are logged in', mau: NODE }, { t: 'tab 2: another site', s: 'you open it', mau: CAM }, { t: 'hidden form', s: 'POST /transfer', mau: DO }, { t: 'browser adds', s: 'the bank cookie', mau: DO },
  ]) + box('CSRF (giả mạo yêu cầu từ trang khác)', 'Cross-Site Request Forgery: another site makes YOUR browser send a request to a site where you are logged in. The attacker never sees the cookie — they only need the browser to send it.', 'do2') +
    J(`<form method="POST" action="https://bank.example/transfer">
  <input name="amount" value="100000000">
</form>
<script>document.forms[0].submit()</script>`, { sm: false }) },

  { t: 'Four endpoints, one cookie jar (curl)', to: true, giua: true, body: T(G('c8/bank', 4, 5), 'curl -c jar … /login  ⇒  the jar file · real') +
    T(G('c8/bank', 7, 10), 'curl -b jar … -H "Origin: http://evil.example"  (the attacker\'s request) · real', { hl: [1] }) +
    T(G('c8/bank', 12, 14), 'the same three endpoints called by the bank\'s own page · real') +
    box('Line 1 of the attack: 100 million moved, properly authenticated', 'curl attaches the jar to every request, whoever asked. That is what an old browser — or a cookie without protection — does.', 'do2') },

  { t: 'Two defences in code', to: true, giua: true, body: J(ma('c8/bank', 23, 25), { sm: false, hl: [2, 3] }) + J(ma('c8/bank', 29, 32), { sm: false, hl: [2, 3] }) +
    two(box('1 · Check Origin / Referer', 'Two lines. Blocks most of it: the browser writes Origin itself, a page cannot fake it.', 'xanh'),
      box('2 · Double submit', 'A readable csrf_token cookie must be copied into a header. evil.com can make the cookie be sent, but can never READ it, so it cannot copy it.', 'xanh')) },

  { t: 'Details that make the code right', to: true, giua: true, body: two(
    box('timingSafeEqual, not ===', 'Compares in constant time. Check the lengths first: timingSafeEqual throws when the two buffers differ in length.', 'cam'),
    box('The third defence is free', '<code class="i">Authorization: Bearer</code> is added by YOUR code, never by the browser. A token-only API (mobile, server-to-server) has no CSRF surface: <b>CSRF is a cookie problem, not an HTTP problem.</b>', 'lam')) +
    T(G('c8/bank', 9, 10), 'from the run above · real') +
    box('If you took API Design lesson 6.4', 'There Chromium shows the CORS side: a stranger\'s GET still reaches the server, a JSON POST stops at the preflight, and bearer tokens beat CSRF the same way.', '') },

  { t: 'Now in a real browser: Chromium 149', to: true, giua: true, body: maTran() +
    box('Bank at localhost:4310, attacker at 127.0.0.1:4311', 'Two different sites. Each row: log in at the bank, then the attacker\'s page auto-submits a form and shows a link. Every cell is a real run.', 'lam') },

  { t: 'Reading the matrix', to: true, giua: true, body: two(T(G('c8/csrf-browser', 4, 14), 'node csrf-browser.mjs · real'), T(G('c8/csrf-browser', 16, 22), 'node csrf-browser.mjs · real', { hl: [2, 6] })) +
    box('Lax does what the slide promised', 'Cross-site POST: no cookie. A normal link click: still logged in.', 'xanh') +
    box('No SameSite at all', 'Chromium treats it as Lax — except in the first 2 minutes after the cookie is set, when a cross-site POST still carries it. We waited: after 2 minutes, blocked.', 'cam') },

  { t: 'So which order to apply them', to: true, giua: true, body: `<div style="font-size:24px">` + flow([
    { t: '1 · SameSite=Lax', s: 'on every auth cookie', mau: NODE }, { t: '2 · check Origin', s: 'every state change', mau: LAM }, { t: '3 · double submit', s: 'money, irreversible', mau: TIM },
  ]) + `</div>` + two(
    box('Why Lax is not the end', 'It is a BROWSER behaviour, not a server check: old browsers, sibling subdomains (same site!) and the 2-minute window above all slip past it.', 'cam'),
    box('Correction to this course\'s own page', 'The web lesson said curl with a jar "does exactly what a browser does". A modern browser with SameSite=Lax would not have sent that cookie — fixed after this measurement.', 'lam')) },

  // ───────── phần B (tập node-8-4-2) ─────────
  { t: 'Logging out, at three sizes', to: true, giua: true, body: cards([
    ['This device', 'Revoke one RefreshSession row and clear the cookie. The access token still works for up to 15 minutes — acceptable, and why it is short.'],
    ['Another device', 'Revoke that row from the "active sessions" list. The userAgent column from lesson 8.2 makes it recognisable.'],
    ['Everywhere, now', 'Password just changed, or the user suspects theft. Every access token must die NOW, not in 15 minutes.'],
  ], 3) + flow([{ t: 'this device', s: 'revoke 1 row', mau: LAM }, { t: 'another device', s: 'revoke that row', mau: LAM }, { t: 'everywhere, now', s: 'tokenVersion + 1', mau: DO }], { h: 130 }) + box('The last one needs something a token cannot give', 'A counter on the user, copied into every token as tv, and compared on every request — the tokenVersion check you already saw in requireAuth.', 'lam') },

  { t: 'tokenVersion', to: true, giua: true, body: JW(ma('c8notes/session', 47, 53), 100, [3, 4], { sm: false }) + J(ma('c8notes/auth.mw', 29, 30), { sm: false }) +
    two(box('Both statements, one transaction', 'Revoke refresh tokens without bumping the version: access tokens live on. Bump without revoking: one refresh mints a new one.', 'cam'),
      box('Why it works', 'Every access token carries the tv it was signed with. One increment makes all of them stale at once.', 'xanh')) },

  { t: 'Run it: laptop and phone', to: true, giua: true, body: TT('c8/logout-all', 3, 8, 'node client/logout-all.mjs · Notes API on :4370 · real', { hl: [5], n: 104 }) +
    flow([{ t: 'laptop', s: 'logged in', mau: LAM }, { t: 'phone', s: 'POST /logout-all', mau: CAM }, { t: 'tokenVersion 0 → 1', mau: DO }, { t: 'laptop AND phone', s: '401 TOKEN_REVOKED', mau: DO }], { h: 130 }) +
    box('Read line 4: the caller is logged out too', 'Technically correct — its token carries the old tv. As an experience it is awful: the user clicks "log out other devices" and lands on the login screen. Every first implementation forgets this.', 'do2') },

  { t: 'The fix: hand the caller a fresh pair', to: true, giua: true, body: J(ma('c8notes/auth.routes', 37, 45), { sm: false, hl: [3, 4] }) +
    TT('c8/logout-all', 10, 17, 'node client/logout-all.mjs · real', { hl: [4] }) },

  { t: 'Changing the password = logging out everywhere', to: true, giua: true, body: flow([
    { t: 'thief has a session', s: 'stolen refresh token', mau: DO }, { t: 'victim changes password', s: 'tokenVersion + 1', mau: NODE }, { t: 'thief\'s next request', s: '401 TOKEN_REVOKED', mau: NODE },
  ]) + two(box('Without it', 'The thief keeps the session after the victim\'s defensive password change — exactly when the victim is trying to lock them out.', 'do2'),
    box('A password reset token', 'Is designed like a refresh token: random, stored hashed, single use, short (15 minutes, not 30 days).', 'lam')) +
    box('Going further', 'The Authentication course, lesson 6.3: password reset, "the most attacked flow you own".', '') },

  { t: 'Rate-limit the endpoint that deserves it', to: true, giua: true, body: J(ma('c8notes/loginLimit', 1, 18), { hl: [6, 10, 13, 14] }) },

  { t: 'Run it: a script guesses An\'s password', to: true, giua: true, body: TT('c8/ratelimit', 3, 16, 'node client/ratelimit.mjs · real', { hl: [7, 11, 14] }) +
    box('If you took API Design lesson 6.1', 'Same policy, same 6th attempt → 429 there (with Retry-After 180 s). Here the window is 60 s.', 'lam') },

  { t: 'Four decisions in that output', to: true, giua: true, body: cards([
    ['Key on IP + email', 'The last line: another email from the same IP still gets in. Keying on IP alone locks a whole office behind one NAT.'],
    ['429, not an account lock', 'The window expires by itself. A permanent lock on wrong passwords is a denial-of-service tool against your own users.'],
    ['Right password still 429', 'Count before verifying, so the limit cannot be probed to learn "was that the right password?".'],
    ['Retry-After', 'Tells an honest client exactly when to come back instead of hammering you.'],
  ], 2) + T(G('c8/ratelimit', 12, 16), 'node client/ratelimit.mjs · the last two checks · real', { hl: [2, 5] }) },

  { t: 'req.ip lies behind a proxy', to: true, giua: true, body: JW(ma('c8/xff', 13, 18), 100, [4], { sm: false }) + TT('c8/xff', 2, 4, 'node xff.mjs · 8 attempts, each with a new fake IP · real', { n: 118 }) +
    bang(['trust proxy', 'req.ip becomes', 'result'], [
      ['false (default)', 'the proxy itself', 'one bucket for the whole internet'],
      ['true', 'the LEFT-most entry — written by the client', 'a new fake IP each time: never limited'],
      ['1 (one proxy)', 'the entry YOUR proxy appended', 'the real client: limited at attempt 6'],
    ], { co: 20, hl: [2] }) },

  { t: 'The limiter lives in one process', to: true, giua: true, body: two(
    box('Two containers = two Maps', 'Each process counts on its own, so the real limit becomes 5 × the number of instances.', 'do2'),
    box('Redis (chapter 12)', 'A shared counter for every instance. But start with the Map: a limit that is right most of the time beats one you postpone until the infrastructure exists.', 'xanh')) +
    box('Already measured — not repeated here', 'API Design lesson 8.4: two instances behind round-robin, a limit of 5 bookings per minute — 8 out of 8 accepted, each instance counted only its own half. The fix there: a shared counter or the gateway.', 'lam') +
    box('This website, for real', 'A storm of 429s that looked like an outage: a limit set too low plus exactly the X-Forwarded-For trap above. Fixed by a sane limit and keying on the entry its single proxy appends.', 'cam') },

  { t: 'The small things that decide the rest', to: true, giua: true, body: JW(ma('c8/clear-cookie', 4, 7), 104, [3, 4], { sm: false }) +
    T([2, 4, 5, 7, 8].map((n) => ra('c8/clear-cookie', n, n)).join('\n'), 'curl: login, logout-wrong, logout-right · the Set-Cookie sent, then the count of refresh_token in the jar · real', { hl: [2, 3] }) +
    box('clearCookie must repeat the same path', 'Otherwise the delete silently does nothing (count still 1).', 'do2') },

  { t: 'Three more small things', to: true, giua: true, body: cards([
    ['Clean up expired sessions', 'Otherwise RefreshSession grows forever. A nightly job (chapter 13) deletes rows past expiresAt.'],
    ['Log events, never credentials', 'Log "login failed, user 42, ip x" for a security timeline. Never passwords, tokens or refresh tokens: logs are shipped, indexed and read by people.'],
    ['Reset tokens = refresh tokens', 'Random, stored as a hash, single use, short-lived.'],
  ], 3) + flow([{ t: 'nightly job', s: 'chapter 13', mau: LAM }, { t: 'delete expired rows', s: 'RefreshSession', mau: NODE }, { t: 'table stays small', mau: NODE }], { h: 130 }) },

  { t: 'Four layers, and what each one really stops', to: true, giua: true, body: cards([
    ['1 · HttpOnly', 'Stops a script from stealing the session. Does nothing against CSRF.'],
    ['2 · SameSite', 'Stops most CSRF. A browser behaviour, not a server check — and it has the 2-minute window.'],
    ['3 · CSRF token / Origin', 'Stops the rest, checked on the server, per session.'],
    ['4 · Revocation', 'Stops a stolen session: tokenVersion, refresh rows. Without it, "log out everywhere" is a button that lies.'],
  ], 2) + flow([{ t: 'HttpOnly', s: 'XSS cannot read', mau: NODE }, { t: 'SameSite', s: 'browser holds back', mau: LAM }, { t: 'Origin / CSRF token', s: 'server refuses', mau: TIM }, { t: 'revocation', s: 'stolen session dies', mau: DO }]) },

  { t: 'This website', to: true, giua: true, body: cards([
    ['HttpOnly cookie', 'Set by the frontend proxy; Bearer headers still accepted for non-browser callers.'],
    ['Real rate limiter', 'With its own incident: the 429 storm above, fixed by keying on the last X-Forwarded-For entry.'],
    ['Active sessions page', 'One row per device, each revocable on its own.'],
  ], 3) + box('Going further', 'The Authentication course: chapter 3 (session table, cookie attributes, CSRF ranked) and lesson 11.3 (rate limiting that survives real traffic).', 'lam') +
    box('If you took SDN302 lesson 5.1', 'Passport\'s session cookie there is exactly the left side of slide 3 — it needs the same SameSite and CSRF care.', '') },

  { t: 'Exercise', to: true, giua: true, body: J("app.set('trust proxy', true);\nres.cookie('sid', sid, { httpOnly: true });          // no SameSite, no Secure\napp.post('/change-email', requireSession, changeEmail);", { sm: false, hl: [1, 2] }) +
    box('Exercise', 'The app runs behind exactly one nginx. Name the two problems in these three lines, the attack each one allows, and the one-line fix for each.', '') +
    `<div data-k="dapan">${box('Answer', 'trust proxy true: req.ip is the client-written left-most X-Forwarded-For, so a fake IP per request skips the login limit — use <code class="i">app.set(\'trust proxy\', 1)</code>. No SameSite: Chromium still sends it on a cross-site POST for 2 minutes after login (and older browsers always) — set <code class="i">sameSite: \'lax\', secure: true</code> and check Origin on /change-email.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>localStorage vs HttpOnly cookie: which attack does each lose to?</li>
<li>Why does double submit work, and why does a Bearer-only API not need it?</li>
<li>A cookie without SameSite in Chromium: when is it sent on a cross-site POST?</li>
<li>How does "log out everywhere" kill access tokens that are still valid?</li>
<li>Why key the login limit on IP + email, and why count before verifying?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. localStorage loses to XSS, the cookie to CSRF. &nbsp;2. Other sites can make the cookie be sent but cannot read it; the browser never adds Authorization itself. &nbsp;3. During the first 2 minutes after it was set. &nbsp;4. tokenVersion + 1, compared on every request. &nbsp;5. One NAT is not one person; and the limit must not reveal a correct password.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>Store the token in an HttpOnly cookie, then defend against CSRF</li>
<li>CSRF moved 100 million through curl; Origin checks and double submit stopped it</li>
<li>Real Chromium: Lax blocks cross-site POST; no SameSite still leaks for 2 minutes</li>
<li>tokenVersion is the only instant kill for stateless tokens — re-issue for the caller</li>
<li>Login limit: IP + email, 429 + Retry-After, trust proxy = your real proxy count</li>
</ul>` + box('Chapter 8, done', 'Passwords (8.1), tokens (8.2), who may do what (8.3), and the browser side (8.4): the Notes API now has real users.', 'xanh') +
    box('Next: chapter 9', 'Application security: security headers, CSP and CORS, input that attacks you, and dependencies.', 'lam') },
]);
