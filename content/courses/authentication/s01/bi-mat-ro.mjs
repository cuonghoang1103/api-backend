/**
 * Authentication · Chương 1 · 1.5 — Chỗ bí mật rò ra mà không ai tấn công cả. Slug giữ: auth-1-5-bi-mat-ro-o-dau.
 * Soạn lại 01/11/2026 (đợt mẫu). Mọi code/output từ ./_ma.mjs (LabFlow ID chạy thật trong env -i, Node 22.23.3, pino 10.4.0,
 * axios 1.21.0, Vite 8.3.5, gitleaks 8.30.1). Số đo: console.log in x-session + Authorization + 2 mật khẩu; pino deny-list
 * lọt x-session + newPassword (và otp); lỗi axios 9.773 byte, khoá xuất hiện 5 lần; git rm --cached vẫn để .env trong lịch sử;
 * gitleaks mặc định bắt .env nhưng sót fixture, luật lfid_ bắt cả hai; VITE_* bị nhúng vào bundle. Bí mật trong output đều GIẢ.
 */
import G from '../giang/auth-01-5.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const LD = CODE.logDemo.split('\n');
const LOG_THREE = [...LD.slice(8, 12), '', ...LD.slice(14, 18), '', ...LD.slice(21, 26)].join('\n');
const LOGS = OUT['15-log-server'].split('\n');
const LOG_NAIVE = LOGS.slice(0, 18).join('\n');
const LOG_DENY = LOGS[18]; // the same request sent to /deny/sign-in
const LOG_ALLOW = LOGS[19]; // … and to /allow/sign-in
const TH_LOG = OUT['15-thuc-hanh-log'].split('\n').slice(2).join('\n');
const LG = CODE.log.split('\n').slice(4).join('\n');
const AX = CODE.axiosError.split('\n').slice(9, 16).join('\n');

const NGUON_EN = [
  nguon('🗝️', 'OWASP — Secrets Management Cheat Sheet', 'Secrets should “never be logged”; detect them before commit with pre-commit hooks; rotate so stolen ones expire (read 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html'),
  nguon('📰', 'KrebsOnSecurity — Facebook stored hundreds of millions of passwords in plain text (21/03/2019)', 'Internal apps logged passwords; archives back to 2012; searchable by 20,000+ employees (read 01/11/2026).', 'https://krebsonsecurity.com/2019/03/facebook-stored-hundreds-of-millions-of-user-passwords-in-plain-text-for-years/'),
  nguon('⚡', 'Vite — Env variables and modes', '“Variables prefixed with VITE_ will be exposed in client-side source code”; VITE_* must not hold API keys (read 01/11/2026).', 'https://vite.dev/guide/env-and-mode'),
  nguon('🌲', 'pino — redaction', 'Paths with * wildcards; values replaced by "[Redacted]" unless you set censor (read 01/11/2026).', 'https://github.com/pinojs/pino/blob/main/docs/redaction.md'),
].join('\n');
const NGUON_VI = [
  nguon('🗝️', 'OWASP — Secrets Management Cheat Sheet', 'Bí mật "never be logged"; bắt chúng trước khi commit bằng pre-commit hook; xoay khoá để bí mật bị lấy sớm hết hạn (đọc 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html'),
  nguon('📰', 'KrebsOnSecurity — Facebook lưu hàng trăm triệu mật khẩu dạng chữ thường (21/03/2019)', 'Ứng dụng nội bộ ghi mật khẩu vào log; lưu trữ từ 2012; hơn 20.000 nhân viên tìm kiếm được (đọc 01/11/2026).', 'https://krebsonsecurity.com/2019/03/facebook-stored-hundreds-of-millions-of-user-passwords-in-plain-text-for-years/'),
  nguon('⚡', 'Vite — Biến môi trường và mode', '"Variables prefixed with VITE_ will be exposed in client-side source code"; VITE_* không được chứa API key (đọc 01/11/2026).', 'https://vite.dev/guide/env-and-mode'),
  nguon('🌲', 'pino — redaction (che dữ liệu)', 'Đường dẫn có ký tự đại diện *; giá trị bị thay bằng "[Redacted]" nếu không đặt censor (đọc 01/11/2026).', 'https://github.com/pinojs/pino/blob/main/docs/redaction.md'),
].join('\n');

export default {
  title: '1.5 — Where secrets leak without anyone attacking|||1.5 — Chỗ bí mật rò ra mà không ai tấn công cả',
  slug: 'auth-1-5-bi-mat-ro-o-dau',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bí mật hay rò nhất là rò mà không ai tấn công: log (console.log in cả token lẫn mật khẩu; deny-list của pino lọt x-session, newPassword, otp; allow-list chặn cả trường thêm sau), đối tượng lỗi (axios: dòng log 9.773 byte, khoá API xuất hiện 5 lần), lịch sử git (git rm --cached không xoá được; gitleaks + luật tiền tố lfid_), bundle front-end (VITE_* bị nhúng thẳng), biến môi trường truyền sang tiến trình con — và vì sao cách sửa duy nhất sau khi lộ là xoay khoá.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Where secrets leak without anyone attacking</h2>
<p class="lead">The first four lessons were about attackers. This one is about the commoner case: nobody attacked anything, and a token or a key still ended up somewhere it should not — a log line, an error report, a git history, a JavaScript bundle. These leaks need no skill to exploit, and they are the ones that actually happen. Every leak below is produced for real on LabFlow ID with fake secrets.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>log requests with an <strong>allow-list</strong> so credentials never reach the log — and explain why a deny-list fails;</li>
<li>log errors without dumping the request that failed (axios and friends);</li>
<li>explain why <code>git rm</code> does not remove a committed secret, catch one with gitleaks before it lands, and know that rotation is the only real fix;</li>
<li>keep server secrets out of front-end bundles and know what child processes inherit.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> in 2019 Facebook found that internal apps had logged hundreds of millions of passwords in plain text, searchable by more than 20,000 employees (KrebsOnSecurity, 21/03/2019). No attacker was involved.</p>
</div>

<h3>Four places a secret lives</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">In transit</span><span class="lz-t">TLS, never in a URL</span><span class="lz-d">Lesson 1.1: a token in a query string reaches access logs and same-origin Referers.</span></div>
  <div class="lz-step"><span class="lz-k">In logs</span><span class="lz-t">The one that actually leaks</span><span class="lz-d">Copied to log platforms, backups and dashboards — kept for years.</span></div>
  <div class="lz-step"><span class="lz-k">In the repo / bundle</span><span class="lz-t">Shipped with the code</span><span class="lz-d">Git history is forever; a front-end bundle goes to every visitor.</span></div>
  <div class="lz-step"><span class="lz-k">In the process</span><span class="lz-t">Env vars, memory</span><span class="lz-d">Inherited by child processes, visible to anything running as the same user.</span></div>
</div>

<h3>Logs: three ways to log the same sign-in</h3>
<p>One sign-in request — with a session header, a bearer key and two passwords (a password change) — sent to three routes that log it three ways:</p>
${ma('javascript', LOG_THREE)}
${ra(OUT['15-req-naive'])}
${ra(LOG_NAIVE)}
<p>Day-one logging printed the session, the API key and both passwords. That line now lives in the log file, the log platform, its backups and on every screen that shows the dashboard. The deny-list version:</p>
${ra(LOG_DENY)}
<p>It hid exactly the three fields someone thought of — <code>authorization</code>, <code>cookie</code>, <code>password</code> — and printed <code>x-session</code> and <code>newPassword</code> in clear. The allow-list version:</p>
${ra(LOG_ALLOW)}
<div class="pitfall co-tieu-de">
<p><strong>Trap — a deny-list fails open.</strong> It must name every secret field that will ever exist: <code>password</code> but also <code>newPassword</code>, <code>pwd</code>, <code>matKhau</code>, <code>otp</code>, <code>x-session</code>, <code>x-api-key</code>… Miss one and it leaks silently. An <strong>allow-list</strong> fails closed: you name what is safe, and a field added next year is hidden until someone decides otherwise. The price is a few <code>[redacted]</code> values you might have liked to see.</p>
</div>
<p>LabFlow ID v0.1 logs one line per request this way — with <code>req.path</code>, never <code>req.originalUrl</code>, because the query string may carry a token (lesson 1.1):</p>
${ma('javascript', LG)}
${ra(OUT['15-v01-req'])}
${ra(OUT['15-v01-log'])}
<p>The <code>?debug_token=…</code> pasted into the URL by mistake is gone (only <code>/me</code> is logged), the password is <code>[redacted]</code>, the email and user agent survive. The <code>redact</code> helper is fifteen lines in <code>src/crypto/redact.js</code>; you write your own in Lab 1.</p>

<h3>Error objects carry the request that failed</h3>
<p>“Log the error” sounds harmless. But many error objects keep a copy of the request: an axios error has <code>config.headers</code> — including <code>Authorization</code>.</p>
${ma('javascript', AX)}
${ra(OUT['15-axios'])}
<p>One failed call produced a <strong>9,773-byte</strong> log line containing the partner key <strong>5 times</strong> (in <code>config.headers</code>, in the raw request text, in the redirect options…). Error trackers do the same by design: they capture request context and local variables. Log what you need — status, code, message — and set up the scrubbing rules of Sentry/Datadog on day one.</p>

<h3>Git: a committed secret is committed forever</h3>
${ra(OUT['15-git-1'])}
${ra(OUT['15-git-2'])}
<p><code>git rm --cached</code> plus <code>.gitignore</code> made the file disappear from <em>now</em>. The history still has it: <code>git log -S</code> finds both commits that touched the key and <code>git show HEAD~1:.env</code> prints it. Every clone, fork and CI cache has that history too.</p>
${ma('toml', CODE.gitleaksLfid)}
${ra(OUT['15-git-3'])}
${ra(OUT['15-git-4'])}
<ul>
<li>gitleaks' default rules found the <code>.env</code> line (the name says <em>KEY</em>) but <strong>missed</strong> the session id in a test fixture. A rule for LabFlow ID's own prefix (lesson 1.2 put <code>lfid_</code> on every token for this reason) finds both.</li>
<li><code>--redact</code> keeps the scanner's own output from becoming the next leak: CI logs are logs too.</li>
<li>Run it as a <strong>pre-commit hook</strong> (blocks the commit) and again in CI (catches whoever skipped the hook).</li>
</ul>
<div class="pitfall co-tieu-de">
<p><strong>Trap — rewriting history is not the fix.</strong> Once pushed, assume the secret is public: revoke it at the provider and issue a new one (<strong>rotation</strong>). <code>git filter-repo</code> cleans your copy, not the clones that already exist. Chapter 11 makes rotation a config change instead of an outage.</p>
</div>

<h3>The front-end bundle: a secret shipped to every visitor</h3>
${ma('javascript', CODE.webMain)}
${ra(OUT['15-vite'])}
<p>Vite replaced <code>import.meta.env.VITE_PAYMENT_SECRET_KEY</code> with its <strong>value</strong> at build time — the key is in the JavaScript file every visitor downloads. The variable without <code>VITE_</code> is not exposed (0 matches). Vite's docs say it plainly: <code>VITE_*</code> must not hold API keys. Next.js does the same with <code>NEXT_PUBLIC_*</code>. CuongThai itself learned this on 02/07/2026: a GIF picker called GIPHY from the browser with a <code>NEXT_PUBLIC_</code> key and broke when the variable was missing at build time; the fix was a small authenticated backend proxy that reads the key at runtime. Rule: a third-party secret is used <em>by the server</em>, never shipped.</p>

<h3>The process: environment variables are inherited</h3>
${ra(OUT['15-env-con'])}
<p>A child process — an npm script, a <code>postinstall</code>, a tool you spawn — sees the parent's environment. Environment variables are still the pragmatic way to give a secret to a container, but treat everything that runs inside it as able to read them. Secret managers (Vault, AWS Secrets Manager, Doppler) add audited access and rotation without redeploys; the value still ends up in memory. Chapter 11 covers getting secrets to the process.</p>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“A developer pushed an API key to GitHub. What now?”</strong> — Revoke and rotate it first, then check the provider's logs for use, then clean history and add a pre-commit scanner. Deleting the commit is the last step, not the first.</li>
<li><strong>“How do you keep tokens out of logs?”</strong> — An allow-list serializer for requests and errors, path without query string, scrubbing in the error tracker, and a test that greps a sample log for known prefixes.</li>
<li><strong>“Can I put the API key in the React app's .env?”</strong> — Only if it is meant to be public. Anything secret goes behind a backend endpoint.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>The team adds a one-time code field <code>otp</code> to the sign-in body. Send <code>{"email","password","otp"}</code> to <code>/deny/sign-in</code> and <code>/allow/sign-in</code> of <code>demo1/log-demo.js</code>. Which log shows the code?</li>
<li>Add a gitleaks rule for your own token prefix and run it on <code>tmp/shop</code>; confirm the fixture is found.</li>
<li>Write the safe <code>catch</code> for <code>demo1/axios-error.mjs</code> and count how many times the key appears in the log afterwards.</li>
</ol>
<p><strong>Solution for step 1 and real output:</strong></p>
${ra(OUT['15-thuc-hanh-req'])}
${ra(TH_LOG)}
<p>The deny-list printed <code>"otp":"491023"</code> — nobody added <code>otp</code> to its list. The allow-list hid it without anyone touching the logger. Step 2 is the output of <code>15-git-4</code> above; step 3 is the last line of the axios output (status, code, message — 0 keys).</p>
<p><strong>Done when:</strong> you can show one new field leaking through a deny-list and hidden by an allow-list, your custom gitleaks rule reports the fixture, and your error log line contains no credential.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">allow-list</span><span class="v">Name what may pass; everything else is blocked — fails closed.</span></div>
  <div class="kv"><span class="k">deny-list</span><span class="v">Name what must be blocked; everything else passes — fails open when a new field appears.</span></div>
  <div class="kv"><span class="k">redaction</span><span class="v">Replacing a sensitive value with a placeholder like <code>[redacted]</code> before it is written.</span></div>
  <div class="kv"><span class="k">secret scanning</span><span class="v">Searching code and history for credentials (gitleaks, GitHub secret scanning), best before the commit.</span></div>
  <div class="kv"><span class="k">rotation</span><span class="v">Revoking a secret and issuing a new one — the only fix once a secret has leaked.</span></div>
  <div class="kv"><span class="k">build-time inlining</span><span class="v">A bundler replacing <code>VITE_*</code>/<code>NEXT_PUBLIC_*</code> with its value in the shipped JavaScript.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The leaks that happen need no attacker: logs, errors, git history, bundles, inherited env.</li>
<li>Log through an allow-list (<code>redact</code>); a deny-list leaked <code>x-session</code>, <code>newPassword</code> and <code>otp</code>.</li>
<li>Never log whole error objects: one axios error carried the key 5 times in 9,773 bytes.</li>
<li><code>git rm</code> leaves the secret in history; scan before commit, and rotate once pushed.</li>
<li><code>VITE_*</code>/<code>NEXT_PUBLIC_*</code> values ship to every visitor; secrets stay on the server.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-9-4-bi-mat-va-phu-thuoc', title: 'Applied in Node.js — lesson 9.4: secrets, dependencies and what your errors give away', sub: 'Same: secrets reach the process at runtime, NEXT_PUBLIC_* is public, gitleaks with narrow exceptions. That lesson adds a weak JWT secret cracked from one token and a dependency that steals the environment; this one measures what logs, errors, git and bundles leak. Each stands on its own.', cta: 'OPEN NODE.JS LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Chỗ bí mật rò ra mà không ai tấn công cả</h2>
<p class="lead">Bốn bài trước nói về kẻ tấn công. Bài này nói về chuyện hay gặp hơn: chẳng ai tấn công gì, vậy mà token hay khoá vẫn nằm ở chỗ không nên nằm — một dòng log, một báo cáo lỗi, lịch sử git, một bundle JavaScript. Những chỗ rò này chẳng cần tài gì để khai thác, và chính chúng mới là thứ thật sự xảy ra. Mọi chỗ rò dưới đây đều được tạo ra thật trên LabFlow ID với bí mật giả.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>ghi log request bằng <strong>allow-list (danh sách cho phép)</strong> để thông tin xác thực không bao giờ vào log — và giải thích vì sao deny-list (danh sách cấm) thất bại;</li>
<li>ghi log lỗi mà không đổ ra cả request vừa hỏng (axios và các thư viện tương tự);</li>
<li>giải thích vì sao <code>git rm</code> không xoá được bí mật đã commit, bắt nó bằng gitleaks trước khi lọt vào, và biết xoay khoá là cách sửa thật duy nhất;</li>
<li>giữ bí mật của máy chủ ngoài bundle front-end và biết tiến trình con thừa hưởng những gì.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> năm 2019 Facebook phát hiện các ứng dụng nội bộ đã ghi hàng trăm triệu mật khẩu dạng chữ thường vào log, hơn 20.000 nhân viên tìm kiếm được (KrebsOnSecurity, 21/03/2019). Chẳng có kẻ tấn công nào cả.</p>
</div>

<h3>Bốn nơi một bí mật sống</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Trên đường truyền</span><span class="lz-t">TLS, đừng nằm trong URL</span><span class="lz-d">Bài 1.1: token trong query string chui vào access log và Referer cùng origin.</span></div>
  <div class="lz-step"><span class="lz-k">Trong log</span><span class="lz-t">Chỗ thật sự rò</span><span class="lz-d">Bị chép sang nền tảng log, bản sao lưu và dashboard — giữ hàng năm.</span></div>
  <div class="lz-step"><span class="lz-k">Trong repo / bundle</span><span class="lz-t">Đi theo mã nguồn</span><span class="lz-d">Lịch sử git là mãi mãi; bundle front-end tới tay mọi khách truy cập.</span></div>
  <div class="lz-step"><span class="lz-k">Trong tiến trình</span><span class="lz-t">Biến môi trường, bộ nhớ</span><span class="lz-d">Tiến trình con thừa hưởng, mọi thứ chạy cùng user đều thấy.</span></div>
</div>

<h3>Log: ba cách ghi cùng một lần đăng nhập</h3>
<p>Một request đăng nhập — có header phiên, một bearer key và hai mật khẩu (đổi mật khẩu) — gửi tới ba route ghi log theo ba cách:</p>
${ma('javascript', LOG_THREE)}
${ra(OUT['15-req-naive'])}
${ra(LOG_NAIVE)}
<p>Kiểu log "ngày đầu đi làm" in ra phiên, API key và cả hai mật khẩu. Dòng đó giờ nằm trong tệp log, nền tảng log, bản sao lưu và trên mọi màn hình mở dashboard. Bản deny-list:</p>
${ra(LOG_DENY)}
<p>Nó giấu đúng ba trường người ta nghĩ tới — <code>authorization</code>, <code>cookie</code>, <code>password</code> — và in rõ <code>x-session</code> lẫn <code>newPassword</code>. Bản allow-list:</p>
${ra(LOG_ALLOW)}
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — deny-list hỏng theo kiểu mở cửa.</strong> Nó phải kể tên mọi trường bí mật sẽ từng tồn tại: <code>password</code> mà còn <code>newPassword</code>, <code>pwd</code>, <code>matKhau</code>, <code>otp</code>, <code>x-session</code>, <code>x-api-key</code>… Sót một là rò âm thầm. <strong>Allow-list</strong> hỏng theo kiểu đóng cửa: bạn kể tên thứ an toàn, và một trường thêm vào năm sau bị giấu cho tới khi có người quyết khác. Cái giá chỉ là vài giá trị <code>[redacted]</code> bạn có lẽ muốn xem.</p>
</div>
<p>LabFlow ID v0.1 ghi một dòng cho mỗi request theo cách này — với <code>req.path</code>, không bao giờ <code>req.originalUrl</code>, vì query string có thể mang token (bài 1.1):</p>
${ma('javascript', LG)}
${ra(OUT['15-v01-req'])}
${ra(OUT['15-v01-log'])}
<p><code>?debug_token=…</code> lỡ dán vào URL đã biến mất (chỉ ghi <code>/me</code>), mật khẩu thành <code>[redacted]</code>, email và user agent còn lại. Hàm <code>redact</code> chỉ mười lăm dòng trong <code>src/crypto/redact.js</code>; bạn tự viết bản của mình ở Lab 1.</p>

<h3>Đối tượng lỗi mang theo cả request đã hỏng</h3>
<p>"Ghi log lỗi" nghe vô hại. Nhưng nhiều đối tượng lỗi giữ một bản sao request: lỗi của axios có <code>config.headers</code> — kể cả <code>Authorization</code>.</p>
${ma('javascript', AX)}
${ra(OUT['15-axios'])}
<p>Một lần gọi hỏng tạo ra dòng log <strong>9.773 byte</strong> chứa khoá của đối tác <strong>5 lần</strong> (trong <code>config.headers</code>, trong văn bản request thô, trong tuỳ chọn chuyển hướng…). Các công cụ theo dõi lỗi cũng làm vậy theo thiết kế: chúng chụp ngữ cảnh request và biến cục bộ. Hãy ghi đúng thứ cần — status, code, message — và đặt luật che dữ liệu cho Sentry/Datadog ngay từ ngày đầu.</p>

<h3>Git: đã commit bí mật là commit mãi mãi</h3>
${ra(OUT['15-git-1'])}
${ra(OUT['15-git-2'])}
<p><code>git rm --cached</code> cộng <code>.gitignore</code> làm tệp biến mất từ <em>bây giờ</em>. Lịch sử vẫn còn: <code>git log -S</code> tìm ra cả hai commit đụng tới khoá và <code>git show HEAD~1:.env</code> in nó ra. Mọi bản clone, fork và cache CI cũng có lịch sử đó.</p>
${ma('toml', CODE.gitleaksLfid)}
${ra(OUT['15-git-3'])}
${ra(OUT['15-git-4'])}
<ul>
<li>Luật mặc định của gitleaks bắt được dòng trong <code>.env</code> (tên biến có chữ <em>KEY</em>) nhưng <strong>sót</strong> mã phiên trong một tệp fixture của test. Một luật cho tiền tố riêng của LabFlow ID (bài 1.2 gắn <code>lfid_</code> vào mọi token chính vì việc này) bắt được cả hai.</li>
<li><code>--redact</code> giữ cho chính output của trình quét không thành chỗ rò tiếp theo: log CI cũng là log.</li>
<li>Chạy nó làm <strong>pre-commit hook</strong> (chặn commit) và chạy lại trong CI (bắt người bỏ qua hook).</li>
</ul>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — viết lại lịch sử không phải cách sửa.</strong> Đã push là coi như bí mật công khai: thu hồi nó ở nhà cung cấp và cấp cái mới (<strong>rotation — xoay khoá</strong>). <code>git filter-repo</code> làm sạch bản của bạn, không phải các bản clone đã tồn tại. Chương 11 biến việc xoay khoá thành một thay đổi cấu hình thay vì một sự cố.</p>
</div>

<h3>Bundle front-end: bí mật gửi tới tận tay mọi khách truy cập</h3>
${ma('javascript', CODE.webMain)}
${ra(OUT['15-vite'])}
<p>Vite thay <code>import.meta.env.VITE_PAYMENT_SECRET_KEY</code> bằng <strong>giá trị</strong> của nó lúc build — khoá nằm trong tệp JavaScript mọi khách truy cập tải về. Biến không có <code>VITE_</code> thì không bị lộ (0 lần khớp). Tài liệu Vite nói thẳng: <code>VITE_*</code> không được chứa API key. Next.js làm y hệt với <code>NEXT_PUBLIC_*</code>. Chính CuongThai đã học bài này ngày 02/07/2026: bộ chọn GIF gọi GIPHY từ trình duyệt bằng khoá <code>NEXT_PUBLIC_</code> và hỏng khi biến thiếu lúc build; cách sửa là một proxy nhỏ ở backend có xác thực, đọc khoá lúc chạy. Luật: bí mật của bên thứ ba do <em>máy chủ</em> dùng, không bao giờ gửi đi.</p>

<h3>Tiến trình: biến môi trường được thừa hưởng</h3>
${ra(OUT['15-env-con'])}
<p>Một tiến trình con — npm script, <code>postinstall</code>, công cụ bạn gọi — thấy môi trường của tiến trình cha. Biến môi trường vẫn là cách thực dụng để đưa bí mật vào container, nhưng hãy coi mọi thứ chạy trong đó đều đọc được chúng. Trình quản lý bí mật (Vault, AWS Secrets Manager, Doppler) thêm truy cập có ghi vết và xoay khoá không cần deploy lại; giá trị vẫn nằm trong bộ nhớ. Chương 11 nói cách đưa bí mật tới tiến trình.</p>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Một bạn lỡ push API key lên GitHub. Giờ sao?"</strong> — Thu hồi và xoay khoá trước, rồi xem log của nhà cung cấp có ai dùng chưa, rồi mới dọn lịch sử và thêm trình quét pre-commit. Xoá commit là bước cuối, không phải bước đầu.</li>
<li><strong>"Làm sao giữ token ngoài log?"</strong> — Bộ serialize allow-list cho request và lỗi, ghi path không kèm query string, luật che dữ liệu trong công cụ theo dõi lỗi, và một test grep log mẫu tìm các tiền tố đã biết.</li>
<li><strong>"Cho API key vào .env của app React được không?"</strong> — Chỉ khi nó vốn công khai. Thứ gì bí mật thì đặt sau một endpoint backend.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Nhóm thêm trường mã một lần <code>otp</code> vào thân request đăng nhập. Gửi <code>{"email","password","otp"}</code> tới <code>/deny/sign-in</code> và <code>/allow/sign-in</code> của <code>demo1/log-demo.js</code>. Log nào hiện mã?</li>
<li>Thêm luật gitleaks cho tiền tố token của riêng bạn và chạy trên <code>tmp/shop</code>; xác nhận fixture bị bắt.</li>
<li>Viết khối <code>catch</code> an toàn cho <code>demo1/axios-error.mjs</code> và đếm khoá còn xuất hiện mấy lần trong log.</li>
</ol>
<p><strong>Lời giải bước 1 và output thật:</strong></p>
${ra(OUT['15-thuc-hanh-req'])}
${ra(TH_LOG)}
<p>Deny-list in ra <code>"otp":"491023"</code> — chẳng ai thêm <code>otp</code> vào danh sách của nó. Allow-list giấu đi mà không ai phải đụng tới logger. Bước 2 là output <code>15-git-4</code> ở trên; bước 3 là dòng cuối của output axios (status, code, message — 0 khoá).</p>
<p><strong>Đạt khi:</strong> bạn chỉ ra được một trường mới lọt qua deny-list và bị allow-list giấu, luật gitleaks của bạn báo được fixture, và dòng log lỗi của bạn không còn thông tin xác thực nào.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">allow-list (danh sách cho phép)</span><span class="v">Kể tên thứ được đi qua; mọi thứ khác bị chặn — hỏng thì đóng cửa.</span></div>
  <div class="kv"><span class="k">deny-list (danh sách cấm)</span><span class="v">Kể tên thứ phải chặn; mọi thứ khác đi qua — hỏng thì mở cửa khi có trường mới.</span></div>
  <div class="kv"><span class="k">redaction (che dữ liệu)</span><span class="v">Thay giá trị nhạy cảm bằng chuỗi giữ chỗ như <code>[redacted]</code> trước khi ghi.</span></div>
  <div class="kv"><span class="k">secret scanning (quét bí mật)</span><span class="v">Tìm thông tin xác thực trong mã và lịch sử (gitleaks, GitHub secret scanning), tốt nhất là trước khi commit.</span></div>
  <div class="kv"><span class="k">rotation (xoay khoá)</span><span class="v">Thu hồi một bí mật và cấp cái mới — cách sửa duy nhất khi bí mật đã lộ.</span></div>
  <div class="kv"><span class="k">build-time inlining (nhúng lúc build)</span><span class="v">Bundler thay <code>VITE_*</code>/<code>NEXT_PUBLIC_*</code> bằng giá trị thật trong JavaScript gửi đi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Những chỗ rò thật sự xảy ra không cần kẻ tấn công: log, lỗi, lịch sử git, bundle, biến môi trường thừa hưởng.</li>
<li>Ghi log qua allow-list (<code>redact</code>); deny-list đã lọt <code>x-session</code>, <code>newPassword</code> và <code>otp</code>.</li>
<li>Đừng bao giờ ghi nguyên đối tượng lỗi: một lỗi axios mang khoá 5 lần trong 9.773 byte.</li>
<li><code>git rm</code> để lại bí mật trong lịch sử; quét trước khi commit, và xoay khoá khi đã push.</li>
<li>Giá trị <code>VITE_*</code>/<code>NEXT_PUBLIC_*</code> tới tay mọi khách; bí mật ở lại máy chủ.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-9-4-bi-mat-va-phu-thuoc', title: 'Áp vào Node.js — bài 9.4: bí mật, dependency và những gì lỗi của bạn khai ra', sub: 'Giống: bí mật tới tiến trình lúc chạy, NEXT_PUBLIC_* là công khai, gitleaks với ngoại lệ hẹp. Bài đó thêm bí mật JWT yếu bị bẻ từ một token và một dependency lấy trộm biến môi trường; bài này đo xem log, lỗi, git và bundle rò những gì. Mỗi bài tự đứng được.', cta: 'MỞ BÀI NODE.JS →' })}
</div>
`,
};
