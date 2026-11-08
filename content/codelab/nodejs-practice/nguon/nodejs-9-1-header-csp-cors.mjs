/** Node.js 9.1 — Đường biên: header bảo mật, CSP và CORS (số đo thật của bài: helmet thêm 12 bỏ 1, cors 4 cấu hình, Vary). */
import { modul, cs, q, qn, tn, jsBai, nguon, MOI_TRUONG } from './_node-c9-11.mjs';

/* ─── 1. EASY · choice ─── */
const E1 = cs({
  ten: 'Read helmet’s headers: which one stops what', kho: 'EASY', phut: 8,
  en: 'One line, <code>app.use(helmet())</code>, added 12 response headers and removed 1 in the lesson’s measurement. Five of them matter. For each question pick the header (or the statement) that matches what the lesson measured.',
  vi: 'Một dòng <code>app.use(helmet())</code> thêm 12 header phản hồi và bỏ 1 trong phép đo của bài. Năm cái thật sự quan trọng. Mỗi câu chọn header (hoặc nhận định) khớp với điều bài đã đo.',
  cau: [
    q('h1', ['A user on café Wi-Fi types <code>http://cuongthai.com</code>. Which header makes the browser go straight to HTTPS, so the first plain request is never sent?', 'Người dùng ở Wi-Fi quán cà phê gõ <code>http://cuongthai.com</code>. Header nào khiến trình duyệt đi thẳng HTTPS, không bao giờ gửi request thường đầu tiên?'],
      ['strict-transport-security: max-age=31536000; includeSubDomains', 'upgrade-insecure-requests inside the Content-Security-Policy', 'x-dns-prefetch-control: off', 'cross-origin-opener-policy: same-origin'],
      ['HSTS tells the browser "for the next 31,536,000 seconds never talk to this host over plain HTTP". upgrade-insecure-requests only rewrites sub-resources of a page that already loaded.', 'HSTS bảo trình duyệt "31.536.000 giây tới đừng bao giờ nói chuyện với host này qua HTTP thường". upgrade-insecure-requests chỉ viết lại tài nguyên con của một trang đã tải.']),
    q('h2', ['An uploaded <code>.txt</code> file contains HTML. Which header stops the browser from deciding it "looks like HTML" and running it?', 'Một file <code>.txt</code> tải lên chứa HTML. Header nào ngăn trình duyệt tự cho là nó "trông giống HTML" rồi chạy?'],
      ['x-content-type-options: nosniff', 'x-download-options: noopen', 'referrer-policy: no-referrer', 'x-permitted-cross-domain-policies: none'],
      ['nosniff = "believe my Content-Type, do not guess". It is the header that keeps a text upload a text upload.', 'nosniff = "hãy tin Content-Type của tôi, đừng đoán". Nó giữ cho file chữ tải lên vẫn chỉ là chữ.']),
    q('h3', ['Your real "Delete account" page is loaded inside an invisible iframe on an attacker’s site, with a fake button on top. Which pair stops this clickjacking?', 'Trang "Xoá tài khoản" thật bị nhúng trong iframe trong suốt trên site kẻ tấn công, với nút giả đè lên. Cặp nào chặn clickjacking này?'],
      ['x-frame-options: SAMEORIGIN, or the CSP directive frame-ancestors \'self\'', 'cross-origin-resource-policy: same-origin, or img-src \'self\'', 'strict-transport-security, or upgrade-insecure-requests', 'x-xss-protection: 1, or script-src-attr \'none\''],
      ['Both answer "who may put my page in a frame". frame-ancestors is the modern CSP form of X-Frame-Options.', 'Cả hai trả lời "ai được nhúng trang tôi vào khung". frame-ancestors là dạng CSP hiện đại của X-Frame-Options.']),
    q('h4', ['helmet sends <code>x-xss-protection: 0</code>. A teammate wants to "fix" it to 1. What is right?', 'helmet gửi <code>x-xss-protection: 0</code>. Đồng đội muốn "sửa" thành 1. Điều nào đúng?'],
      ['Keep 0: the old XSS auditor was itself exploitable and is gone from modern browsers', 'Set 1: it re-enables the browser’s XSS filter, which helmet forgot', 'Set 1; mode=block: it is the only header that stops stored XSS', 'Remove the header: modern browsers reject responses that contain it'],
      ['The legacy auditor was a heuristic that attackers could abuse; 0 is the correct modern value. Setting 1 because it "sounds protective" is a step backwards.', 'Bộ kiểm cũ là một phỏng đoán từng bị lợi dụng; 0 là giá trị đúng thời nay. Đặt 1 vì "nghe có vẻ bảo vệ" là bước lùi.']),
    q('h5', ['A stored XSS payload is already sitting in your database. Which header is the only one of the five that can still stop it from doing damage?', 'Một payload XSS đã nằm sẵn trong cơ sở dữ liệu. Header nào là cái duy nhất trong năm cái vẫn có thể chặn nó gây hại?'],
      ['content-security-policy (script-src decides whether the injected script may run)', 'referrer-policy (the script cannot read the page URL any more)', 'strict-transport-security (the payload cannot travel over HTTP)', 'x-content-type-options (the page is no longer sniffed as HTML)'],
      ['The others make one specific attack harder. CSP changes what an injected script is allowed to do — script-src blocks it, connect-src blocks sending stolen data out.', 'Những cái khác làm một đòn cụ thể khó hơn. CSP thay đổi việc script bị chèn được làm gì — script-src chặn nó chạy, connect-src chặn gửi dữ liệu ra ngoài.']),
  ],
  goiY: [['Read each header name literally: transport, content-type options, frame options…', 'Đọc tên header theo nghĩa đen: transport, content-type options, frame options…'], ['The lesson’s table "The five that actually matter" has one line per header — match the attack to the line.', 'Bảng "Năm cái thật sự quan trọng" trong bài có một dòng mỗi header — ghép đòn tấn công với dòng.']],
  loi: [['Thinking upgrade-insecure-requests replaces HSTS — it only rewrites sub-resources of a page that already arrived.', 'Tưởng upgrade-insecure-requests thay được HSTS — nó chỉ viết lại tài nguyên con của trang đã tới.'], ['"Fixing" x-xss-protection to 1 because it sounds protective.', '"Sửa" x-xss-protection thành 1 vì nghe có vẻ bảo vệ.']],
  tns: [tn('HSTS', 'Strict-Transport-Security', 'ép trình duyệt chỉ dùng HTTPS với host này'), tn('clickjacking', 'tấn công nhúng khung', 'trang thật trong iframe trong suốt, nút giả đè lên'), tn('sniffing', 'đoán kiểu nội dung', 'trình duyệt tự đoán kiểu thay vì tin Content-Type')],
  kn: ['security headers', 'helmet'],
});

/* ─── 2. EASY · js — middleware header nền ─── */
function securityHeaders(req, res, next) {
  // 1) Cheapest win: stop advertising the framework (x-powered-by: Express tells scanners which CVEs to try).
  res.removeHeader('X-Powered-By');
  // 2) The five headers the lesson says actually matter, with the exact values helmet sends.
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains'); // HTTPS only, for a year
  res.setHeader('X-Content-Type-Options', 'nosniff');                                // believe my Content-Type
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');                                    // no clickjacking frames
  res.setHeader('Referrer-Policy', 'no-referrer');                                   // no ?token=… leaking in Referer
  res.setHeader('X-XSS-Protection', '0');                                            // the legacy auditor stays OFF
  // 3) A middleware that sets headers must hand over to the next one exactly once — it never ends the response.
  next();
}

const E2 = jsBai({
  ten: 'Write helmet’s baseline by hand', kho: 'EASY', phut: 10,
  en: `<p>A bare Express 5 app answers with <code>x-powered-by: Express</code> and no protective headers at all. Write the middleware <code>securityHeaders(req, res, next)</code> that does by hand the part of <code>helmet()</code> the lesson says matters:</p>
<ul><li>remove <code>X-Powered-By</code>;</li>
<li>set <code>Strict-Transport-Security: max-age=31536000; includeSubDomains</code>, <code>X-Content-Type-Options: nosniff</code>, <code>X-Frame-Options: SAMEORIGIN</code>, <code>Referrer-Policy: no-referrer</code>, <code>X-XSS-Protection: 0</code> (exactly these values — the ones helmet puts on the wire);</li>
<li>call <code>next()</code> exactly once, and never send a response.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Một app Express 5 trần trả về <code>x-powered-by: Express</code> và không có header bảo vệ nào. Viết middleware <code>securityHeaders(req, res, next)</code> làm bằng tay phần của <code>helmet()</code> mà bài nói là quan trọng:</p>
<ul><li>bỏ <code>X-Powered-By</code>;</li>
<li>đặt <code>Strict-Transport-Security: max-age=31536000; includeSubDomains</code>, <code>X-Content-Type-Options: nosniff</code>, <code>X-Frame-Options: SAMEORIGIN</code>, <code>Referrer-Policy: no-referrer</code>, <code>X-XSS-Protection: 0</code> (đúng các giá trị này — giá trị helmet gửi đi);</li>
<li>gọi <code>next()</code> đúng một lần, và không bao giờ gửi phản hồi.</li></ul>${MOI_TRUONG.vi}`,
  yc: [['Use res.removeHeader / res.setHeader (header names are case-insensitive; the fake res stores them lower-case).', 'Dùng res.removeHeader / res.setHeader (tên header không phân biệt hoa thường; res giả lưu chữ thường).'], ['Call next() once; do not call res.json / res.send / res.end.', 'Gọi next() một lần; không gọi res.json / res.send / res.end.']],
  goiY: [['The fake res already has <code>x-powered-by</code> set in some tests — removing it is a separate call from setting the others.', 'Trong vài ca, res giả đã có sẵn <code>x-powered-by</code> — bỏ nó là một lời gọi riêng, khác với đặt các header kia.'], ['Copy the values from the lesson’s helmet dump; <code>X-XSS-Protection</code> is <code>0</code>, not <code>1; mode=block</code>.', 'Chép giá trị từ bản in helmet trong bài; <code>X-XSS-Protection</code> là <code>0</code>, không phải <code>1; mode=block</code>.']],
  loi: [['Forgetting next(): every request after this middleware hangs until the client times out.', 'Quên next(): mọi request sau middleware này treo tới khi client hết giờ.'], ['Setting X-XSS-Protection to 1 because it "sounds safer".', 'Đặt X-XSS-Protection thành 1 vì "nghe an toàn hơn".'], ['Leaving x-powered-by: Express in place — the cheapest win in the whole chapter.', 'Để nguyên x-powered-by: Express — cái lợi rẻ nhất cả chương.']],
  gt: ['A security-header middleware only decorates the response: it removes the framework banner, adds the five headers with the exact values helmet measured, and passes control on with <code>next()</code>. Because it runs before the routes, every response — including errors from later middleware that still go through it — carries the headers.', 'Middleware header bảo mật chỉ trang trí phản hồi: bỏ dòng quảng cáo framework, thêm năm header với đúng giá trị helmet đã đo, rồi chuyển quyền bằng <code>next()</code>. Vì nó chạy trước các route nên mọi phản hồi đi qua nó đều mang các header này.'],
  kn: ['middleware', 'security headers'],
  tns: [tn('middleware', 'phần mềm trung gian', 'hàm (req, res, next) chạy trước route'), tn('x-powered-by', 'dòng quảng cáo framework', 'nói cho máy quét biết bạn dùng Express')],
  dau: `/** Set the security-header baseline, then hand over to the next middleware. */
function securityHeaders(req, res, next) {
  // Write your solution here
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
}
`,
  giai: '// Reference solution\n' + nguon(securityHeaders),
  cases: [
    { goi: 'await runMw(securityHeaders, { method: "GET", url: "/" })', moTa: ['GET / on a fresh response', 'GET / với phản hồi mới'] },
    { chuanBi: 'const res = makeRes(); res.setHeader("X-Powered-By", "Express");', goi: '(await runMw(securityHeaders, { method: "GET", url: "/notes" }, res)).headers["x-powered-by"] === undefined', moTa: ['x-powered-by: Express is removed', 'x-powered-by: Express bị bỏ'] },
    { goi: '(await runMw(securityHeaders, { method: "POST", url: "/notes" })).next', moTa: ['next() is called exactly once', 'next() được gọi đúng một lần'] },
    { chuanBi: 'const res = makeRes(); res.setHeader("X-Powered-By", "Express"); res.setHeader("Content-Type", "text/html");', goi: 'await runMw(securityHeaders, { method: "GET", url: "/feed" }, res)', an: true },
    { goi: '(() => { const r = makeRes(); let n = 0; securityHeaders({ headers: {} }, r, () => n++); return [n, r.ended, Object.keys(r.headers).sort()]; })()', an: true },
  ],
});

/* ─── 3. MEDIUM · js — đọc CSP từng chỉ thị ─── */
function parseCsp(header) {
  const policy = {};
  // Directives are separated by ";" — the real header has no spaces after it, the pretty-printed one has newlines.
  for (const part of String(header).split(';')) {
    const tokens = part.trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) continue;                    // empty piece: "a;;b" or a trailing ";"
    const name = tokens[0].toLowerCase();            // directive names are case-insensitive
    if (Object.prototype.hasOwnProperty.call(policy, name)) continue; // CSP spec: the FIRST occurrence wins
    policy[name] = tokens.slice(1);                  // sources keep their case: 'self' and URLs are compared as written
  }
  return policy;
}

const CSP_HELMET = "default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests";
const CSP_SITE = "default-src 'self';\n script-src  'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.youtube.com;\n style-src   'self' 'unsafe-inline';\n img-src     'self' data: blob: https://media.cuongthai.com https://*.giphy.com;\n connect-src 'self' wss://cuongthai.com https://api.cuongthai.com https://*.sentry.io;\n object-src  'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';\n upgrade-insecure-requests";

const E3 = jsBai({
  ten: 'Read a CSP one directive at a time', kho: 'MEDIUM', phut: 15,
  en: `<p>The lesson reads <code>cuongthai.com</code>’s real policy "one directive at a time". Write <code>parseCsp(header)</code> that turns a <code>Content-Security-Policy</code> value into an object <code>{ directive: [sources…] }</code>:</p>
<ul><li>directives are separated by <code>;</code>; inside one, tokens are separated by any whitespace (spaces, tabs, new lines);</li>
<li>the directive name is lower-cased; sources are kept exactly as written (<code>'self'</code>, <code>https://*.giphy.com</code>, <code>data:</code>);</li>
<li>a directive without sources (<code>upgrade-insecure-requests</code>) maps to <code>[]</code>; empty pieces are skipped;</li>
<li>if a directive appears twice, the <b>first</b> one wins — browsers ignore the repeat.</li></ul>
<p>Example: <code>parseCsp("default-src 'self'; img-src 'self' data:")</code> → <code>{ "default-src": ["'self'"], "img-src": ["'self'", "data:"] }</code>.</p>${MOI_TRUONG.en}`,
  vi: `<p>Bài đọc chính sách thật của <code>cuongthai.com</code> "từng chỉ thị một". Viết <code>parseCsp(header)</code> biến giá trị <code>Content-Security-Policy</code> thành object <code>{ chỉ_thị: [nguồn…] }</code>:</p>
<ul><li>các chỉ thị cách nhau bằng <code>;</code>; trong một chỉ thị, các từ cách nhau bằng khoảng trắng bất kỳ (dấu cách, tab, xuống dòng);</li>
<li>tên chỉ thị viết thường; nguồn giữ nguyên như viết (<code>'self'</code>, <code>https://*.giphy.com</code>, <code>data:</code>);</li>
<li>chỉ thị không có nguồn (<code>upgrade-insecure-requests</code>) ứng với <code>[]</code>; mẩu rỗng bị bỏ qua;</li>
<li>chỉ thị xuất hiện hai lần thì cái <b>đầu tiên</b> thắng — trình duyệt bỏ qua cái lặp.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['Split on <code>;</code> first, then split each piece on <code>/\\s+/</code> after trimming.', 'Tách theo <code>;</code> trước, rồi cắt khoảng trắng hai đầu và tách mỗi mẩu theo <code>/\\s+/</code>.'], ['Before writing <code>policy[name]</code>, check whether the name is already there — and skip it if so.', 'Trước khi ghi <code>policy[name]</code>, kiểm xem tên đã có chưa — có rồi thì bỏ qua.']],
  loi: [['Splitting on a single space: the real header has new lines and double spaces between sources, so you get empty-string sources.', 'Tách theo một dấu cách: header thật có xuống dòng và hai dấu cách giữa các nguồn, nên sinh ra nguồn rỗng.'], ['Letting the LAST duplicate win (a plain assignment) — the browser enforces the first.', 'Để cái LẶP cuối thắng (gán thẳng) — trình duyệt áp dụng cái đầu.'], ['Lower-casing the sources too: hosts are fine, but you should not rewrite what the policy says.', 'Viết thường cả nguồn: host thì không sao, nhưng đừng viết lại điều chính sách nói.']],
  gt: ['Parsing is the step before any judgement: once the policy is a map, "where may scripts come from?" is <code>policy["script-src"] ?? policy["default-src"]</code>. Trimming and splitting on any whitespace survives pretty-printed headers; skipping repeats copies the browser rule, so your reading of the policy is the one that is enforced.', 'Phân tích là bước trước mọi phán đoán: khi chính sách thành một bảng, "script được tải từ đâu?" là <code>policy["script-src"] ?? policy["default-src"]</code>. Cắt và tách theo mọi khoảng trắng chịu được header in đẹp; bỏ qua cái lặp đúng luật trình duyệt, nên cách bạn đọc chính sách là cách nó được áp dụng.'],
  kn: ['CSP', 'parsing'],
  tns: [tn('directive', 'chỉ thị', 'một mệnh đề của CSP, vd script-src'), tn('source expression', 'biểu thức nguồn', "'self', https:, https://*.giphy.com…")],
  dau: `/** Parse a Content-Security-Policy header into { directive: [sources] }. */
function parseCsp(header) {
  // Write your solution here
  const policy = {};
  for (const part of header.split(';')) {
    const tokens = part.split(' ');
    policy[tokens[0]] = tokens.slice(1);
  }
  return policy;
}
`,
  giai: '// Reference solution\n' + nguon(parseCsp),
  cases: [
    { goi: `parseCsp("default-src 'self'; img-src 'self' data:")`, moTa: ['Two directives', 'Hai chỉ thị'] },
    { goi: `parseCsp(${JSON.stringify(CSP_HELMET)})`, moTa: ['helmet’s default policy (as measured)', 'Chính sách mặc định của helmet (như đã đo)'] },
    { goi: `parseCsp(${JSON.stringify(CSP_SITE)})["img-src"]`, moTa: ['cuongthai.com’s pretty-printed img-src', 'img-src in đẹp của cuongthai.com'] },
    { goi: `parseCsp(${JSON.stringify(CSP_SITE)})`, an: true },
    { goi: `parseCsp("script-src 'self'; SCRIPT-SRC https://evil.example; ;object-src 'none';")`, an: true },
    { goi: `Object.keys(parseCsp("upgrade-insecure-requests;  ;\\tframe-ancestors\\t'none'"))`, an: true },
  ],
});

/* ─── 4. MEDIUM · js — CORS danh sách trắng ─── */
function makeCors({ origins, credentials = false, maxAge }) {
  const allowed = new Set(origins);                 // an explicit allow-list — never "reflect whatever asked"
  return function cors(req, res, next) {
    const origin = req.headers.origin;
    // The answer depends on Origin ⇒ every cache in front must key on it. Without this, a CDN can hand
    // cuongthai.com's answer to evil.example (or the other way round).
    res.vary('Origin');
    const ok = origin !== undefined && allowed.has(origin);
    if (ok) {
      res.setHeader('Access-Control-Allow-Origin', origin);            // echo ONLY an origin we listed
      if (credentials) res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    const preflight = req.method === 'OPTIONS' && req.headers['access-control-request-method'] !== undefined;
    if (preflight) {
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
      if (maxAge !== undefined) res.setHeader('Access-Control-Max-Age', String(maxAge));
      // A rejected origin still gets 204, just without ACAO: the BROWSER is the one that blocks, not us.
      return res.status(204).end();
    }
    // Not a preflight: CORS never stops the request — it only decides who may READ the answer.
    next();
  };
}

const E4 = jsBai({
  ten: 'An allow-list CORS middleware that does not lie', kho: 'MEDIUM', phut: 18,
  en: `<p>The lesson probed four <code>cors()</code> configurations with <code>Origin: https://evil.example</code>. Write <code>makeCors({ origins, credentials, maxAge })</code> that returns a middleware behaving like the <b>allow-list</b> one (block 4 of the measurement):</p>
<ul><li>always add <code>Vary: Origin</code> (use <code>res.vary('Origin')</code>) — the answer depends on the origin;</li>
<li>if <code>req.headers.origin</code> is in <code>origins</code>: set <code>Access-Control-Allow-Origin</code> to that exact origin, and <code>Access-Control-Allow-Credentials: true</code> when <code>credentials</code> is true. Otherwise set neither — never <code>*</code>, never reflect;</li>
<li>a <b>preflight</b> (<code>OPTIONS</code> with an <code>access-control-request-method</code> header) is answered here: <code>Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE</code>, <code>Access-Control-Max-Age</code> if <code>maxAge</code> is given, status <b>204</b> and <code>end()</code> — even for a rejected origin;</li>
<li>any other request calls <code>next()</code> — also from a rejected origin (CORS is not authorisation).</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Bài thăm dò bốn cấu hình <code>cors()</code> với <code>Origin: https://evil.example</code>. Viết <code>makeCors({ origins, credentials, maxAge })</code> trả về middleware cư xử như cấu hình <b>danh sách trắng</b> (khối 4 của phép đo):</p>
<ul><li>luôn thêm <code>Vary: Origin</code> (dùng <code>res.vary('Origin')</code>) — câu trả lời phụ thuộc origin;</li>
<li>nếu <code>req.headers.origin</code> có trong <code>origins</code>: đặt <code>Access-Control-Allow-Origin</code> đúng bằng origin đó, và <code>Access-Control-Allow-Credentials: true</code> khi <code>credentials</code> là true. Ngược lại không đặt cái nào — không bao giờ <code>*</code>, không bao giờ phản chiếu;</li>
<li><b>preflight</b> (<code>OPTIONS</code> có header <code>access-control-request-method</code>) được trả lời tại đây: <code>Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE</code>, <code>Access-Control-Max-Age</code> nếu có <code>maxAge</code>, mã <b>204</b> và <code>end()</code> — kể cả với origin bị từ chối;</li>
<li>mọi request khác gọi <code>next()</code> — kể cả từ origin bị từ chối (CORS không phải phân quyền).</li></ul>${MOI_TRUONG.vi}`,
  yc: [['Header names in req.headers are lower-case (as in Node).', 'Tên header trong req.headers viết thường (như Node).'], ['Return a NEW middleware from makeCors; do not keep per-request state outside it.', 'makeCors trả về một middleware MỚI; không giữ trạng thái theo request ở ngoài.']],
  goiY: [['Build a <code>Set</code> of the allowed origins once, outside the returned function.', 'Dựng một <code>Set</code> các origin được phép một lần, bên ngoài hàm trả về.'], ['Decide in this order: Vary → allowed? → preflight? (answer 204) → otherwise next().', 'Quyết theo thứ tự: Vary → được phép? → preflight? (trả 204) → còn lại next().'], ['A request with no Origin header (curl, server-to-server) is not an error: no ACAO, just next().', 'Request không có header Origin (curl, máy chủ gọi máy chủ) không phải lỗi: không ACAO, chỉ next().']],
  loi: [['<code>origin: true</code> thinking — echoing <code>req.headers.origin</code> back: with credentials that hands your authenticated API to every website.', 'Kiểu nghĩ <code>origin: true</code> — phản chiếu <code>req.headers.origin</code>: kèm credentials là trao API đã đăng nhập cho mọi website.'], ['Answering a rejected origin with 403: the measured package answers 204 without ACAO; the browser is the component that blocks.', 'Trả 403 cho origin bị từ chối: gói thật trả 204 không ACAO; trình duyệt mới là bên chặn.'], ['Forgetting Vary: Origin in a hand-rolled CORS — the bug only shows up behind a cache, in production.', 'Quên Vary: Origin khi tự viết CORS — lỗi chỉ lộ ra sau một cache, trên production.']],
  gt: ['CORS is a statement to the browser about who may read the answer, so the middleware only ever adds headers — except for the preflight, which exists only to be answered. Echoing an origin is safe only after matching it against a fixed list; <code>Vary: Origin</code> makes caches store one copy per origin. The POST from evil.example still reaches next(): that is the lesson’s point that CORS is not authorisation — authentication and CSRF defences are.', 'CORS là lời tuyên bố với trình duyệt về việc ai được đọc câu trả lời, nên middleware chỉ thêm header — trừ preflight, thứ chỉ tồn tại để được trả lời. Phản chiếu origin chỉ an toàn sau khi khớp với một danh sách cố định; <code>Vary: Origin</code> khiến cache lưu một bản cho mỗi origin. POST từ evil.example vẫn tới next(): đó là ý của bài — CORS không phải phân quyền; xác thực và chống CSRF mới là.'],
  kn: ['CORS', 'Vary', 'preflight'],
  tns: [tn('preflight', 'request thăm dò', 'OPTIONS trình duyệt gửi trước request "không đơn giản"'), tn('ACAO', 'Access-Control-Allow-Origin', 'origin nào được đọc phản hồi'), tn('allow-list', 'danh sách trắng', 'chỉ những giá trị được liệt kê mới được nhận')],
  dau: `/** Return a CORS middleware with an explicit allow-list. */
function makeCors({ origins, credentials = false, maxAge }) {
  // Write your solution here
  return function cors(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    if (credentials) res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  };
}
`,
  giai: '// Reference solution\n' + nguon(makeCors),
  cases: [
    { goi: 'await runMw(makeCors({ origins: ["https://cuongthai.com"], credentials: true }), { method: "GET", headers: { origin: "https://cuongthai.com" } })', moTa: ['GET from the listed origin', 'GET từ origin được liệt kê'] },
    { goi: 'await runMw(makeCors({ origins: ["https://cuongthai.com"], credentials: true }), { method: "GET", headers: { origin: "https://evil.example" } })', moTa: ['GET from evil.example: no ACAO, still next()', 'GET từ evil.example: không ACAO, vẫn next()'] },
    { goi: 'await runMw(makeCors({ origins: ["https://cuongthai.com"], credentials: true, maxAge: 86400 }), { method: "OPTIONS", headers: { origin: "https://evil.example", "access-control-request-method": "POST" } })', moTa: ['Preflight from a rejected origin: 204 without ACAO', 'Preflight từ origin bị từ chối: 204 không ACAO'] },
    { goi: 'await runMw(makeCors({ origins: ["https://cuongthai.com", "https://www.cuongthai.com"], credentials: true, maxAge: 86400 }), { method: "OPTIONS", headers: { origin: "https://www.cuongthai.com", "access-control-request-method": "DELETE" } })', an: true },
    { goi: 'await runMw(makeCors({ origins: ["https://cuongthai.com"] }), { method: "POST", headers: {} })', an: true },
    { goi: 'await runMw(makeCors({ origins: ["https://cuongthai.com"] }), { method: "GET", headers: { origin: "https://cuongthai.com" } })', an: true },
    { goi: 'await runMw(makeCors({ origins: ["https://cuongthai.com"], credentials: true }), { method: "OPTIONS", headers: { origin: "https://cuongthai.com" } })', an: true, moTa: ['OPTIONS without access-control-request-method is not a preflight', 'OPTIONS không có access-control-request-method không phải preflight'] },
  ],
});

/* ─── 5. MEDIUM · choice — CORS: bốn cấu hình ─── */
const E5 = cs({
  ten: 'CORS: four configurations, one money transfer', kho: 'MEDIUM', phut: 10,
  en: 'Answer from the lesson’s measurements: the four <code>cors()</code> configurations probed with <code>Origin: https://evil.example</code>, the POST /transfer on a server with no CORS at all, and the <code>Vary</code> header.',
  vi: 'Trả lời theo số đo của bài: bốn cấu hình <code>cors()</code> thăm dò với <code>Origin: https://evil.example</code>, POST /transfer trên máy chủ không cấu hình CORS, và header <code>Vary</code>.',
  cau: [
    q('c1', ['A server has NO CORS configuration. A page on evil.example sends <code>POST /transfer</code> with the user’s cookie. The balance was 1000 before. What did the lesson measure?', 'Máy chủ KHÔNG cấu hình CORS. Một trang trên evil.example gửi <code>POST /transfer</code> kèm cookie người dùng. Số dư trước là 1000. Bài đo được gì?'],
      ['The request ran and the balance became 900: CORS only stops the page from reading the answer', 'The browser blocked the request before sending it, so the balance stayed 1000', 'The server answered 403 because the Origin header did not match its host', 'The request was sent but the cookie was stripped, so the transfer failed with 401'],
      ['CORS is a browser rule about reading responses. The request still arrived and changed state; authentication + a CSRF defence (lesson 8.4) are what protect the endpoint.', 'CORS là luật của trình duyệt về việc đọc phản hồi. Request vẫn tới và đổi trạng thái; xác thực + chống CSRF (bài 8.4) mới bảo vệ endpoint.']),
    q('c2', ['<code>cors({ origin: true, credentials: true })</code> passes every local test. Why is it the most common CORS mistake?', '<code>cors({ origin: true, credentials: true })</code> qua mọi test ở máy. Vì sao nó là lỗi CORS phổ biến nhất?'],
      ['It reflects any origin, so every website may make authenticated requests AND read the answers', 'It turns CORS off completely, so browsers fall back to the same-origin policy', 'It answers every preflight with 403, which only shows up in production', 'It sends ACAO: * which browsers silently accept together with cookies'],
      ['Measured: ACAO=https://evil.example, ACAC=true. Reflecting plus credentials gives any page the user has open your whole authenticated API.', 'Đo được: ACAO=https://evil.example, ACAC=true. Phản chiếu cộng credentials trao cho mọi trang người dùng đang mở toàn bộ API đã đăng nhập.']),
    q('c3', ['<code>cors({ origin: \'*\', credentials: true })</code> sends ACAO=* and ACAC=true. What happens in the browser?', '<code>cors({ origin: \'*\', credentials: true })</code> gửi ACAO=* và ACAC=true. Trình duyệt làm gì?'],
      ['It refuses the response: * together with credentials is forbidden by the spec', 'It accepts it and sends cookies to every origin, the most permissive setting', 'It downgrades the request to a no-cors request and shows an opaque body', 'It retries the request without cookies and accepts the second answer'],
      ['The server thinks it is permissive, the browser reports a "CORS error" that no amount of adding origins fixes.', 'Máy chủ tưởng mình dễ dãi, trình duyệt báo "lỗi CORS" mà thêm bao nhiêu origin cũng không hết.']),
    q('c4', ['With an allow-list, a rejected origin sends a preflight. What status did it get?', 'Với danh sách trắng, một origin bị từ chối gửi preflight. Nó nhận mã nào?'],
      ['204, with no Access-Control-Allow-Origin — the browser is the one that blocks', '403 Forbidden, with a JSON body explaining the origin is not allowed', '404, because the OPTIONS route is not mounted for that origin', '400, because the Origin header failed validation'],
      ['Do not go looking for a 403 that will never come: the server answered fine, without the permission header.', 'Đừng đi tìm một mã 403 không bao giờ tới: máy chủ trả lời bình thường, chỉ thiếu header cho phép.']),
    qn('c5', ['Which statements about <code>Vary: Origin</code> are true? (choose all)', 'Nhận định nào về <code>Vary: Origin</code> là đúng? (chọn mọi câu đúng)'],
      ['Without it, a cache in front can serve one origin’s CORS answer to another origin', 'The cors package sets it for you; hand-rolled middleware usually does not', 'The bug it prevents usually appears only in production, behind nginx or a CDN', 'It tells the browser to send the Origin header on same-origin requests too', 'It replaces the need for an allow-list when credentials are used'],
      [0, 1, 2],
      ['Vary lists the request headers that change the response, so caches key on them. It does not change what the browser sends and it is no substitute for the allow-list.', 'Vary liệt kê các header của request làm đổi phản hồi, để cache dùng chúng làm khoá. Nó không đổi điều trình duyệt gửi và không thay được danh sách trắng.']),
  ],
  goiY: [['CORS is enforced by the browser on READING a response — keep asking "did the request still run?".', 'CORS do trình duyệt áp khi ĐỌC phản hồi — luôn hỏi "request có vẫn chạy không?".'], ['The four measured blocks: none · reflect · * · allow-list. Match each question to a block.', 'Bốn khối đo: không cấu hình · phản chiếu · * · danh sách trắng. Ghép mỗi câu với một khối.']],
  loi: [['"That endpoint is safe because of CORS" — curl, scripts and other servers ignore CORS entirely.', '"Endpoint đó an toàn nhờ CORS" — curl, script và máy chủ khác bỏ qua CORS hoàn toàn.'], ['Expecting a 403 for a rejected origin and debugging the server for hours.', 'Chờ mã 403 cho origin bị từ chối rồi gỡ lỗi máy chủ hàng giờ.']],
  tns: [tn('Same-Origin Policy', 'chính sách cùng nguồn', 'luật trình duyệt mà CORS nới lỏng có chọn lọc'), tn('credentials', 'thông tin xác thực', 'cookie / Authorization đi kèm request')],
  kn: ['CORS'],
});

/* ─── 6. HARD · js — CSP có cho phép không? ─── */
function cspAllows(header, kind, url, pageOrigin) {
  // --- 1) parse (same rules as parseCsp: split on ";", any whitespace, first occurrence wins) ---
  const policy = {};
  for (const part of String(header).split(';')) {
    const t = part.trim().split(/\s+/).filter(Boolean);
    if (t.length && !Object.prototype.hasOwnProperty.call(policy, t[0].toLowerCase())) policy[t[0].toLowerCase()] = t.slice(1);
  }
  // --- 2) pick the directive: "<kind>-src", falling back to default-src. No directive at all ⇒ allowed. ---
  const sources = policy[kind + '-src'] ?? policy['default-src'];
  if (!sources) return true;
  const target = new URL(url, pageOrigin);       // resolves "/app.js" against the page
  const page = new URL(pageOrigin);
  // --- 3) a URL is allowed if ANY source matches it ---
  return sources.some((s) => {
    const src = s.toLowerCase();
    if (src === "'none'") return false;
    if (src === "'self'") return target.origin === page.origin;
    if (/^[a-z][a-z0-9+.-]*:$/.test(src)) return target.protocol === src;   // scheme source: https:  data:  blob:
    if (src.startsWith("'")) return false;            // 'unsafe-inline', nonces… say nothing about a URL
    const m = /^([a-z][a-z0-9+.-]*):\/\/(\*\.)?([^/:]+)$/.exec(src);
    if (!m) return false;
    if (target.protocol !== m[1] + ':') return false;
    if (m[2]) return target.hostname.endsWith('.' + m[3]);   // *.giphy.com: a SUBdomain, not giphy.com itself
    return target.hostname === m[3];
  });
}

const E6 = jsBai({
  ten: 'Would this CSP let it load?', kho: 'HARD', phut: 25,
  en: `<p>The lesson explains that a course cover hosted on a CDN that is not in <code>img-src</code> "silently fails to render". Write <code>cspAllows(header, kind, url, pageOrigin)</code> → <code>true</code>/<code>false</code>: may the page at <code>pageOrigin</code> load <code>url</code> as a <code>kind</code> (<code>"script"</code>, <code>"img"</code>, <code>"connect"</code>, <code>"style"</code>…) under this policy?</p>
<ul><li>parse like the previous exercise (first occurrence of a directive wins);</li>
<li>use <code>&lt;kind&gt;-src</code>; if it is missing use <code>default-src</code>; if both are missing the load is allowed;</li>
<li>resolve <code>url</code> against <code>pageOrigin</code> (<code>new URL(url, pageOrigin)</code>) — <code>/app.js</code> is same-origin;</li>
<li>sources (case-insensitive): <code>'none'</code> matches nothing · <code>'self'</code> matches the page’s origin · a scheme like <code>https:</code> / <code>data:</code> / <code>blob:</code> / <code>wss:</code> matches that protocol · <code>https://host</code> matches that protocol + exact host · <code>https://*.host</code> matches subdomains of host (not host itself) · other quoted keywords (<code>'unsafe-inline'</code>…) never match a URL. Ignore ports and paths in sources.</li></ul>${MOI_TRUONG.en}`,
  vi: `<p>Bài giải thích rằng ảnh bìa khoá học đặt trên CDN không có trong <code>img-src</code> sẽ "âm thầm không hiện". Viết <code>cspAllows(header, kind, url, pageOrigin)</code> → <code>true</code>/<code>false</code>: trang ở <code>pageOrigin</code> có được tải <code>url</code> dưới dạng <code>kind</code> (<code>"script"</code>, <code>"img"</code>, <code>"connect"</code>, <code>"style"</code>…) theo chính sách này không?</p>
<ul><li>phân tích như bài trước (lần xuất hiện đầu của chỉ thị thắng);</li>
<li>dùng <code>&lt;kind&gt;-src</code>; thiếu thì dùng <code>default-src</code>; thiếu cả hai thì được tải;</li>
<li>giải <code>url</code> theo <code>pageOrigin</code> (<code>new URL(url, pageOrigin)</code>) — <code>/app.js</code> là cùng nguồn;</li>
<li>nguồn (không phân biệt hoa thường): <code>'none'</code> không khớp gì · <code>'self'</code> khớp origin của trang · scheme như <code>https:</code> / <code>data:</code> / <code>blob:</code> / <code>wss:</code> khớp giao thức đó · <code>https://host</code> khớp giao thức + đúng host · <code>https://*.host</code> khớp tên miền con của host (không gồm chính host) · từ khoá trong nháy khác (<code>'unsafe-inline'</code>…) không bao giờ khớp một URL. Bỏ qua cổng và đường dẫn trong nguồn.</li></ul>${MOI_TRUONG.vi}`,
  goiY: [['Reuse your parser, then <code>const sources = policy[kind + "-src"] ?? policy["default-src"]</code>.', 'Dùng lại bộ phân tích, rồi <code>const sources = policy[kind + "-src"] ?? policy["default-src"]</code>.'], ['<code>new URL(...)</code> gives you <code>.origin</code>, <code>.protocol</code> (with the colon) and <code>.hostname</code> — compare those, not raw strings.', '<code>new URL(...)</code> cho bạn <code>.origin</code>, <code>.protocol</code> (có dấu hai chấm) và <code>.hostname</code> — so những thứ đó, đừng so chuỗi thô.'], ['For <code>*.giphy.com</code> test <code>hostname.endsWith(".giphy.com")</code> — the leading dot is what stops <code>evilgiphy.com</code>.', 'Với <code>*.giphy.com</code> kiểm <code>hostname.endsWith(".giphy.com")</code> — dấu chấm đầu là thứ chặn <code>evilgiphy.com</code>.']],
  loi: [['Checking <code>url.includes(host)</code>: <code>https://media.cuongthai.com.evil.example/x.png</code> contains the host and is not it.', 'Kiểm <code>url.includes(host)</code>: <code>https://media.cuongthai.com.evil.example/x.png</code> chứa host mà không phải host.'], ['Forgetting the default-src fallback: a policy without img-src still restricts images.', 'Quên dự phòng default-src: chính sách không có img-src vẫn giới hạn ảnh.'], ['Treating <code>\'unsafe-inline\'</code> as "anything goes" — it is about inline code, not about which URLs may load.', 'Coi <code>\'unsafe-inline\'</code> là "gì cũng được" — nó nói về mã nội tuyến, không nói URL nào được tải.']],
  gt: ['The browser’s question is always "which directive governs this load, and does any of its sources match?". Falling back to default-src is what makes <code>default-src \'self\'</code> a safe base. Matching on parsed URL parts instead of substrings is the same lesson as SSRF in 9.3: strings that look like your host are not your host. A source list is OR-ed, so one match is enough and <code>\'none\'</code> contributes nothing.', 'Câu hỏi của trình duyệt luôn là "chỉ thị nào quản lần tải này, và có nguồn nào khớp không?". Dự phòng về default-src là thứ khiến <code>default-src \'self\'</code> thành nền an toàn. So theo các phần của URL đã phân tích thay vì chuỗi con là cùng bài học với SSRF ở 9.3: chuỗi trông giống host của bạn không phải host của bạn. Danh sách nguồn là phép HOẶC, một nguồn khớp là đủ, còn <code>\'none\'</code> không góp gì.'],
  kn: ['CSP', 'URL parsing'],
  tns: [tn('fallback', 'dự phòng', 'default-src dùng khi thiếu chỉ thị riêng'), tn('scheme source', 'nguồn theo giao thức', 'https:, data:, blob: — khớp mọi URL cùng giao thức')],
  dau: `/** May the page at pageOrigin load url as a <kind> under this CSP? */
function cspAllows(header, kind, url, pageOrigin) {
  // Write your solution here
  const d = header.split(';').find((p) => p.trim().startsWith(kind + '-src'));
  if (!d) return true;
  return d.includes(new URL(url, pageOrigin).hostname) || d.includes("'self'");
}
`,
  giai: '// Reference solution\n' + nguon(cspAllows),
  cases: [
    { goi: `cspAllows(${JSON.stringify(CSP_SITE)}, "img", "https://media.cuongthai.com/images/course-covers/nodejs.png", "https://cuongthai.com")`, moTa: ['Course cover from media.cuongthai.com', 'Ảnh bìa từ media.cuongthai.com'] },
    { goi: `cspAllows(${JSON.stringify(CSP_SITE)}, "img", "https://cdn.icons.example/node.svg", "https://cuongthai.com")`, moTa: ['Cover on an unlisted CDN', 'Ảnh bìa trên CDN không được liệt kê'] },
    { goi: `cspAllows(${JSON.stringify(CSP_HELMET)}, "script", "/app.js", "https://cuongthai.com")`, moTa: ['helmet: same-origin script', 'helmet: script cùng nguồn'] },
    { goi: `cspAllows(${JSON.stringify(CSP_HELMET)}, "connect", "https://evil.example/steal", "https://cuongthai.com")`, moTa: ['helmet has no connect-src: falls back to default-src', 'helmet không có connect-src: dự phòng về default-src'] },
    { goi: `[cspAllows(${JSON.stringify(CSP_SITE)}, "img", "https://i.giphy.com/x.gif", "https://cuongthai.com"), cspAllows(${JSON.stringify(CSP_SITE)}, "img", "https://giphy.com/x.gif", "https://cuongthai.com"), cspAllows(${JSON.stringify(CSP_SITE)}, "img", "https://evilgiphy.com/x.gif", "https://cuongthai.com")]`, an: true },
    { goi: `[cspAllows(${JSON.stringify(CSP_SITE)}, "connect", "wss://cuongthai.com/socket.io/", "https://cuongthai.com"), cspAllows(${JSON.stringify(CSP_SITE)}, "connect", "https://api.cuongthai.com.evil.example/x", "https://cuongthai.com"), cspAllows(${JSON.stringify(CSP_SITE)}, "object", "/x.swf", "https://cuongthai.com")]`, an: true },
    { goi: `[cspAllows("img-src 'self' DATA:", "img", "data:image/png;base64,AAAA", "https://cuongthai.com"), cspAllows("script-src 'unsafe-inline'", "script", "/a.js", "https://cuongthai.com"), cspAllows("style-src 'self'", "img", "https://x.example/a.png", "https://cuongthai.com")]`, an: true },
    { goi: `[cspAllows("default-src 'none'; script-src 'self'; script-src https://evil.example", "script", "https://evil.example/x.js", "https://cuongthai.com"), cspAllows("default-src 'none'", "font", "/f.woff2", "https://cuongthai.com")]`, an: true },
  ],
});

export default modul('nodejs-9-1-header-csp-cors', '9.1 Security headers, CSP and CORS', [E1, E2, E3, E4, E5, E6]);
