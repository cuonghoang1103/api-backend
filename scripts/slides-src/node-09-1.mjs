/**
 * node-09-1 — Node.js · Chapter 9 · Lesson 9.1 "The perimeter: security headers, CSP and CORS" (slide EN, đợt 8 — 01/11/2026).
 * MỘT deck, HAI tập: node-9-1 (slide 1–13) · node-9-1-2 (slide 14–29).
 *   A: header là mệnh lệnh cho trình duyệt · Express trần 7 header (thật) · helmet() thêm 12 bỏ 1 (thật) · giá trị trên dây · 5 header quan trọng · x-xss-protection: 0
 *   B: CSP thật của cuongthai.com (curl thật) · từng chỉ thị · hai nhận xét thành thật + hai header HSTS (đo thật) · CSP mặc định làm vỡ app HTML ·
 *      SOP/CORS nới lỏng gì · ma trận 4 cấu hình cors (thật) · origin:true + credentials · '*' + credentials · tiền vẫn đi khi không có CORS (thật) ·
 *      CORS ≠ phân quyền (dẫn API Design 6.4, Chromium) · Vary: Origin với cache dùng chung (thật) · website này · thứ tự · bài tập · tự kiểm · tóm tắt
 * Nguồn: nodejs-9-1-header-csp-cors. Output THẬT: that/c9/{headers,prod-headers,cors-matrix,cors-transfer,vary}.
 * Khác web: thêm OPTIONS cho origin bị từ chối (204, ACAO trống) · thêm phép đo Vary bằng cache dùng chung · đo thấy production gửi HAI header HSTS.
 */
import { lamDeck, two, box, cards, flow, bang, J, JW, T, TT } from './_c9-chung.mjs';
import { ma } from './_node-chung.mjs';

export const deck = { key: 'node-09-1', code: 'NODE 9.1', title: 'The perimeter: security headers, CSP and CORS', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e';

export const slides = lamDeck({ chuong: 'Chapter 9 — Application security', bai: '9.1' }, [
  { cover: true, t: 'The perimeter:<br>security headers, CSP and CORS', sub: 'A response header is an order you give to a browser you do not control.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Exactly what a bare Express app sends, and what one line of helmet() changes</li>
<li>The five headers that matter, and the one helmet deliberately turns OFF</li>
<li>Reading a real Content-Security-Policy, directive by directive</li>
<li>What CORS actually relaxes — and the request it never stops</li>
<li>Vary: Origin, the header that only breaks once a cache is involved</li>
</ul>` + box('Why it matters to you', 'Chapter 8 answered "whose request is this". This chapter is about the user\'s own browser being tricked into acting for someone else.', 'lam') },

  { t: 'Headers are orders to a browser you do not control', to: true, giua: true, body: flow([
    { t: 'your server', s: 'sets headers', mau: NODE }, { t: 'the response', s: 'travels with them', mau: LAM }, { t: 'the user\'s browser', s: 'obeys them — or not', mau: CAM }, { t: 'your page', s: 'runs under those rules', mau: DO }], { h: 150 }) +
    two(box('What you can control', 'Only what you send. After the response leaves, the browser decides what your page may load, frame, read and run.', 'lam'),
      box('So a header is not decoration', 'It is the only lever you have over what happens to your page on a machine you will never see.', 'cam')) +
    bang(['the browser decides…', 'the header that tells it'], [
      ['may I talk to this host over plain HTTP?', 'strict-transport-security'],
      ['may I guess this file\'s type?', 'x-content-type-options'],
      ['may another site put this page in a frame?', 'frame-ancestors / x-frame-options'],
      ['may this injected script run?', 'content-security-policy'],
      ['may that other origin read this response?', 'access-control-allow-origin (CORS)'],
    ], { co: 21 }) },

  { t: 'Start by looking at what you send', to: true, giua: true, body: J(ma('c9/headers', 15, 16), { sm: false }) +
    TT('c9/headers', 2, 9, 'node headers.mjs · bare Express · real', { hl: [8] }) +
    box('x-powered-by: Express', 'Tells anyone scanning you which framework\'s CVEs to look up. Removing it costs nothing: <code class="i">app.disable(\'x-powered-by\')</code>.', 'do2') },

  { t: 'One line: app.use(helmet())', to: true, giua: true, body: J("app.use(helmet());   // before the routes", { sm: false }) +
    TT('c9/headers', 10, 12, 'node headers.mjs · same machine, same second · real', { hl: [2, 3], n: 84, sm: false }) +
    two(box('12 headers added, 1 removed', 'For one line of code and no latency you could measure.', 'xanh'),
      box('Do not trust a summary', 'Read the values that go on the wire — next slide. Each one is an instruction.', 'lam')) },

  { t: 'The values on the wire', to: true, giua: true, body: TT('c9/headers', 14, 25, 'helmet 8.3.0 defaults · real', { hl: [1, 2, 3, 4, 8, 9, 10, 13], n: 80, sm: false }) +
    box('Highlighted: the five that matter', 'CSP, referrer-policy, HSTS, nosniff, x-frame-options. The next five slides take them one at a time.', 'lam') },

  { t: '1 · strict-transport-security', to: true, giua: true, body: T('strict-transport-security: max-age=31536000; includeSubDomains', 'from the response above') +
    two(box('What it says', '"For the next 31,536,000 seconds (one year), never talk to this host over plain HTTP — even if the user types http://."', 'lam'),
      box('What it stops', 'The downgrade: an attacker on the same Wi-Fi intercepts the very first, still-unencrypted request.', 'xanh')) +
    box('Only over HTTPS', 'Browsers ignore it on an http:// response. Once sent, you cannot take it back for a year — turn HTTPS on first.', 'cam') },

  { t: '2 · x-content-type-options: nosniff', to: true, giua: true, body: T('x-content-type-options: nosniff', 'from the response above') +
    two(box('What it says', '"Trust my Content-Type. Do not guess."', 'lam'),
      box('Without it', 'A browser may decide that a .txt a user uploaded "looks like" HTML or JavaScript and run it as such.', 'do2')) +
    flow([{ t: 'notes.txt uploaded', s: 'contains &lt;script&gt;', mau: DO }, { t: 'served as text/plain', s: 'by your server', mau: LAM }, { t: 'browser sniffs: "HTML!"', s: 'without nosniff', mau: CAM }, { t: 'script runs', s: 'on YOUR origin', mau: DO }], { h: 140 }) +
    box('Chapter 10 needs this', 'Every file a user uploads and you serve back depends on the browser NOT sniffing it.', 'xanh') },

  { t: '3 · x-frame-options / frame-ancestors', to: true, giua: true, body: T("x-frame-options: SAMEORIGIN\ncontent-security-policy: … frame-ancestors 'self' …", 'from the response above') +
    two(box('Clickjacking', 'Your real page sits inside a transparent iframe on the attacker\'s site, with a fake button placed exactly over "Delete account".', 'do2'),
      box('The fix', 'Only your own origin may frame your pages. frame-ancestors is the modern form; helmet sends both.', 'xanh')) +
    flow([{ t: 'attacker\'s page', s: '"Win a prize! Click"', mau: DO }, { t: 'invisible iframe', s: 'your real /settings', mau: CAM }, { t: 'the click lands on', s: '"Delete account"', mau: DO }, { t: 'with SAMEORIGIN', s: 'the frame stays empty', mau: NODE }], { h: 140 }) },

  { t: '4 · referrer-policy', to: true, giua: true, body: T('referrer-policy: no-referrer', 'from the response above') +
    box('What leaks without it', 'How much of your URL leaves the page when it loads something. A <code class="i">/reset-password?token=…</code> sent as Referer to an analytics script is a real account takeover.', 'do2') +
    flow([{ t: '/reset?token=9f…', s: 'the page', mau: LAM }, { t: 'loads analytics.js', s: 'a third party', mau: CAM }, { t: 'Referer: …?token=9f…', s: 'without a policy', mau: DO }, { t: 'their access log', s: 'now holds the token', mau: DO }], { h: 120 }) +
    bang(['value', 'sends'], [['no-referrer (helmet)', 'nothing'], ['strict-origin-when-cross-origin (browser default)', 'only https://cuongthai.com to other sites'], ['unsafe-url', 'the full URL everywhere — never']], { co: 19 }) },

  { t: '5 · content-security-policy', to: true, giua: true, body: T("content-security-policy: default-src 'self';…;script-src 'self';script-src-attr 'none';…", 'from the response above') +
    box('The only one that limits a hole you already have', 'The others make one attack harder. CSP changes what an injected script is allowed to do — even an XSS already stored in your database (lesson 9.2 shows it in a real browser).', 'xanh') +
    TT('c9/xss-browser', 17, 20, 'node xss-browser.mjs · lesson 9.2, run 5 · Chromium · real', { hl: [3, 4], n: 100 }) +
    box('A second line, not a shield', 'You still escape and sanitise. CSP catches what you missed.', 'lam') },

  { t: 'Why helmet sends x-xss-protection: 0', to: true, giua: true, body: T('x-xss-protection: 0', 'from the response above') +
    two(box('An old browser guess', 'It controlled a heuristic "XSS auditor" that was itself abused for attacks and has been removed from every modern browser.', 'do2'),
      box('0 is the modern value', 'Setting it to 1 "because it sounds protective" is a small step backwards. helmet turns it off on purpose.', 'xanh')) +
    bang(['browser', 'XSS auditor today'], [['Chrome / Edge', 'removed (Chrome 78, 2019)'], ['Firefox', 'never shipped one'], ['what protects you instead', 'escaping, sanitising (9.2) and CSP']], { co: 22 }) },

  { t: 'The five, in one table', to: true, giua: true, body: bang(['header', 'one-line job', 'stops'], [
    ['strict-transport-security', 'never plain HTTP again', 'downgrade on the first request'],
    ['x-content-type-options', 'do not guess the type', 'an upload run as HTML'],
    ['frame-ancestors / XFO', 'who may frame me', 'clickjacking'],
    ['referrer-policy', 'how much URL leaks', 'tokens in Referer'],
    ['content-security-policy', 'what this page may load and run', 'injected scripts (2nd line)'],
  ], { co: 22, hl: [4] }) + box('And x-powered-by: gone', 'Free. Do it today.', 'xanh') },

  { t: 'Reading a CSP: the one this website serves', to: true, giua: true, body: TT('c9/prod-headers', 2, 15, 'curl -sI https://cuongthai.com · real, 01/11/2026 · lines cut at 150', { hl: [2, 3, 8, 9, 15], n: 104 }) },

  { t: 'Directive by directive', to: true, giua: true, body: bang(['directive', 'means'], [
    ["default-src 'self'", 'fallback for everything not named below: this origin only'],
    ['script-src', 'where JavaScript may come from — decides whether an injected &lt;script src&gt; runs'],
    ['connect-src', 'where fetch/XHR/WebSocket may go — decides whether stolen data can leave'],
    ["object-src 'none'", 'no Flash/applets, ever — free in 2026'],
    ["frame-ancestors 'self'", 'the modern X-Frame-Options'],
  ], { co: 22, hl: [1, 2] }) + box('script-src and connect-src are the pair', 'One limits what can run, the other limits where it can send what it read.', 'lam') },

  { t: 'Two honest notes on that real policy', to: true, giua: true, body: two(
    box("script-src 'unsafe-inline' 'unsafe-eval'", 'The price of a Next.js app with inline hydration. Here CSP is the second line of defence, not a magic shield.', 'cam'),
    box('img-src is a long, explicit allow-list', 'Which is exactly why an image on a CDN not in the list silently does not show — a real bug on this site once.', 'lam')) +
    TT('c9/prod-headers', 17, 21, 'curl -sI https://cuongthai.com/api/v1/courses · real', { hl: [2, 4] }) +
    box('Measured: two HSTS headers on one response', 'One with helmet\'s default, one with a two-year preload value. A browser uses only the first. Each header should have exactly one owner.', 'do2') },

  { t: "helmet's default CSP will break an HTML app", to: true, giua: true, body: T("Refused to execute inline script because it violates the following Content Security Policy\ndirective: \"script-src 'self'\".", 'browser console · the symptom') +
    two(box('Symptom', 'A white page and a console full of "Refused to execute inline script" — framework hydration and analytics snippets are inline.', 'do2'),
      box('Fix', 'Configure it, or let the layer that renders the HTML own it. This backend sets contentSecurityPolicy: false because Next.js emits the page policy.', 'xanh')) +
    box('Never "fix" it by deleting CSP', 'One owner per header — not zero.', 'cam') },

  { t: 'Same-Origin Policy, and what CORS relaxes', to: true, giua: true, body: flow([
    { t: 'page on evil.example', s: 'fetch(your API)', mau: DO }, { t: 'request is SENT', s: 'and handled', mau: CAM }, { t: 'response comes back', s: 'to the browser', mau: LAM }, { t: 'page may NOT read it', s: 'unless you allow', mau: NODE }], { h: 150 }) +
    two(box('Default', 'A page may send requests anywhere. It may not read another origin\'s responses.', 'lam'),
      box('CORS', 'Your server saying: "this particular origin may read my responses". It loosens a rule; it never adds one.', 'xanh')) +
    bang(['from a page on another origin', 'reaches your server?', 'page reads the answer?'], [
      ['simple GET / form POST', 'yes', 'only if ACAO allows it'],
      ['POST with JSON, PUT, DELETE', 'preflight OPTIONS first; the real one only if allowed', 'only if allowed'],
    ], { co: 21 }) },

  { t: 'Four configurations, one hostile Origin', to: true, giua: true, body: TT('c9/cors-matrix', 2, 15, 'node cors-matrix.mjs · Origin: https://evil.example · real', { hl: [8, 9], n: 86, sm: false }) },

  { t: 'The allow-list, and the request it still answers', to: true, giua: true, body: TT('c9/cors-matrix', 17, 24, 'node cors-matrix.mjs · real', { hl: [3, 4], n: 86, sm: false }) +
    flow([{ t: 'evil.example asks', s: 'OPTIONS preflight', mau: DO }, { t: 'server: 204', s: 'no ACAO for it', mau: LAM }, { t: 'browser', s: 'sees no permission', mau: CAM }, { t: 'real PUT never sent', s: 'page gets "CORS error"', mau: NODE }], { h: 130 }) +
    box('Rejected origin: 200 and 204, not 403', 'The server answers normally with no Access-Control-Allow-Origin. The browser is what blocks the page. Do not hunt for a 403 that never comes.', 'cam') },

  { t: 'The two dangerous blocks', to: true, giua: true, body: two(
    box('origin: true + credentials: true', '"Reflect whatever origin asks" + "with cookies". Any website the user has open may call your authenticated API and read the answers. Passes every local test.', 'do2'),
    box("origin: '*' + credentials: true", 'Forbidden by the standard, so the browser refuses the response. Your server thinks it is being generous; you get "CORS error" that no list of origins fixes.', 'cam')) +
    bang(['configuration', 'what the browser does for evil.example'], [
      ['no CORS', 'sends the request, hides the answer'],
      ['origin: true + credentials', 'sends it WITH cookies and lets evil.example read it'],
      ["'*' + credentials", 'refuses the answer for everybody — your own app included'],
      ['allow-list', 'sends it, hides the answer; your origin reads it'],
    ], { co: 21, hl: [1] }) +
    box('The rule', 'An explicit list of exact origins. Never reflect, never star with credentials.', 'xanh') },

  { t: 'Measurement 2: what nobody tells you about CORS', to: true, giua: true, body: JW(ma('c9/cors-transfer', 4, 7) + '\n…\n' + ma('c9/cors-transfer', 11, 14), 96, [4, 7]) +
    TT('c9/cors-transfer', 2, 4, 'node cors-transfer.mjs · NO CORS configured · real', { hl: [2, 3] }) +
    box('The money is already gone', 'CORS decides who may READ the response. The request still arrived, still ran, still changed state.', 'do2') },

  { t: 'CORS is not authorisation', to: true, giua: true, body: two(
    box('Not a browser? No CORS at all', 'curl, a script, a mobile app, another server: they ignore it completely.', 'do2'),
    box('A browser? Only reading is blocked', 'API Design lesson 6.4 measured it in a real Chromium: a stranger\'s GET still reached the server; a JSON POST stopped at the preflight.', 'lam')) +
    flow([{ t: 'curl / script', s: 'no CORS', mau: DO }, { t: 'mobile app', s: 'no CORS', mau: DO }, { t: 'another server', s: 'no CORS', mau: DO }, { t: 'a browser', s: 'blocks READING only', mau: CAM }], { h: 130 }) +
    box('If your argument contains "it is safe because of CORS"', 'Replace it with authentication (chapter 8) and a CSRF defence (lesson 8.4).', 'xanh') },

  { t: 'The header you must not forget: Vary', to: true, giua: true, body: TT('c9/vary', 2, 7, 'node vary.mjs · a shared cache in front of the API · real', { hl: [3, 6], n: 104 }) +
    flow([{ t: 'cuongthai.com asks', s: 'MISS → API', mau: LAM }, { t: 'cache stores it', s: 'key = URL only', mau: CAM }, { t: 'admin.cuongthai.com asks', s: 'HIT', mau: LAM }, { t: 'gets ACAO of the first', s: 'blocked', mau: DO }], { h: 130 }) +
    box('Without Vary: Origin', 'The cache stored the answer for cuongthai.com and handed it to admin.cuongthai.com — wrong ACAO, "CORS error". The cors package sets Vary; hand-written middleware often does not.', 'do2') },

  { t: 'This website (src/index.ts, in order)', to: true, giua: true, body: flow([
    { t: 'request id', s: 'X-Request-ID', mau: LAM }, { t: 'helmet(…)', s: 'CSP off: Next.js owns it', mau: NODE }, { t: 'cors(allow-list)', s: 'credentials · maxAge 86400', mau: CAM }, { t: 'body parsers', s: 'then routes', mau: LAM }], { h: 140 }) +
    cards([
      ['www. on purpose', 'Users bookmark it; the failure mode is a useless "fetch failed" in the console.'],
      ['No Origin header → allowed', 'curl, server-to-server. The auth middleware decides.'],
      ['Rejections are logged', '<code class="i">logger.warn(\'CORS rejected origin\')</code> so operations see what is really blocked.'],
    ], 3) + J("origin: (origin, callback) => {\n  if (!origin) return callback(null, true);              // curl, server-to-server\n  if (allowed.includes(origin)) return callback(null, true);\n  logger.warn('CORS rejected origin', { origin });\n  return callback(new Error(`CORS: origin ${origin} not allowed`));\n},", { hl: [3, 4] }) },

  { t: 'Order matters', to: true, giua: true, body: J("app.use(requestId);\napp.use(helmet());\napp.use(cors(corsOptions));\napp.use(express.json({ limit: '100kb' }));\napp.use('/api/v1', routes);\napp.use(errorHandler);        // LAST", { sm: false, hl: [2, 3, 6] }) +
    two(box('Before the routes', 'helmet() and cors() only touch responses that pass through them.', 'lam'),
      box('Error handler last', 'Otherwise an error response can leave without any of these headers — and error responses are the ones most likely to carry something sensitive.', 'do2')) },

  { t: 'Exercise', to: true, giua: true, body: J("app.use(cors({ origin: (o, cb) => cb(null, true), credentials: true }));\napp.get('/api/me', requireAuth, (req, res) => res.json(req.user));", { sm: false, hl: [1] }) +
    box('Exercise', 'A teammate wrote this "to stop the CORS errors". What can a page on any website now do to a logged-in user? Rewrite the first line correctly for cuongthai.com and its www variant.', '') +
    `<div data-k="dapan">${box('Answer', 'It reflects every origin with credentials: any site can call /api/me with the user\'s cookie and read the answer. Fix: <code class="i">cors({ origin: [\'https://cuongthai.com\', \'https://www.cuongthai.com\'], credentials: true })</code> — the package also adds Vary: Origin.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>Which header tells a scanner what to attack, and how do you remove it?</li>
<li>Which header is the only one that limits an XSS already in your database?</li>
<li>Why does helmet send x-xss-protection: 0?</li>
<li>No CORS configured, attacker's Origin, POST /transfer: does the money move?</li>
<li>Why must a policy that depends on Origin also send Vary: Origin?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. x-powered-by; helmet() or app.disable(\'x-powered-by\'). &nbsp;2. content-security-policy. &nbsp;3. The old auditor was abused and removed; 0 is correct today. &nbsp;4. Yes — CORS only stops the page reading the answer. &nbsp;5. Otherwise a shared cache serves one origin\'s answer to another.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>Bare Express: 7 headers, one of them (x-powered-by) helps attackers</li>
<li>helmet(): +12 headers, −1, one line; five matter: HSTS, nosniff, frame-ancestors, referrer-policy, CSP</li>
<li>CSP is a second line of defence; one owner per header (this site: Next.js owns CSP)</li>
<li>CORS loosens who may READ; requests still arrive and run — it is not authorisation</li>
<li>Explicit origin list; never reflect + credentials; send Vary: Origin</li>
</ul>` + box('Next: lesson 9.2', 'XSS in a real browser: a stranger\'s note, your session, and what actually stops it.', 'lam') },
]);
