/**
 * Bài 14.2 — Biến môi trường và khoá bí mật (nâng cấp 01/11/2026). Output: Vite 8.3.5 / Node 22.23.3 / git, chạy thật trong
 * _demo/_t14 (mọi giá trị bí mật là GIẢ). Deck: scripts/slides-src/wf-14-2.mjs (11 slide).
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-14-2', 'Environment variables & secrets', 'Biến môi trường & khoá bí mật', [
  [1, 'Environment variables & secrets',
    '<p>Your code runs on your laptop, on a test server and in production, and each place needs different settings — a different database, a different payment mode. This lesson is about keeping those settings outside the code, and about the one mistake that costs real money: leaking a secret.</p>',
    '<p>Code của bạn chạy trên laptop, trên máy chủ thử và trên production, và mỗi nơi cần cấu hình khác nhau — cơ sở dữ liệu khác, chế độ thanh toán khác. Bài này nói về việc giữ các cấu hình đó ngoài code, và về một lỗi tốn tiền thật: làm lộ khoá bí mật.</p>'],
  [2, 'After this lesson you can…',
    '<p>Five skills. The two most important are the rule that anything sent to the browser is public, and the reaction to a leak: rotate the secret first, clean up second.</p>',
    '<p>Năm kỹ năng. Hai cái quan trọng nhất là luật mọi thứ gửi tới trình duyệt đều công khai, và cách phản ứng khi lộ: xoay khoá trước, dọn dẹp sau.</p>'],
  [3, 'Same code, different machines',
    '<p>The API address, the database and the payment key differ between your laptop and production, but the code does not. So configuration lives outside the code, in environment variables that each machine sets for itself.</p>',
    '<p>Địa chỉ API, cơ sở dữ liệu và khoá thanh toán khác nhau giữa laptop và production, nhưng code thì không. Vì vậy cấu hình nằm ngoài code, trong biến môi trường mà mỗi máy tự đặt.</p>'],
  [4, 'The three files',
    '<p><code>.env</code> holds the real values on each machine and is never committed. <code>.env.example</code> lists the names with fake values and is committed, so a new teammate knows what to fill in. <code>.gitignore</code> keeps the real file out of git.</p>',
    '<p><code>.env</code> giữ giá trị thật trên từng máy và không bao giờ được commit. <code>.env.example</code> liệt kê tên kèm giá trị giả và được commit, để đồng đội mới biết cần điền gì. <code>.gitignore</code> giữ file thật ngoài git.</p>'],
  [5, 'Server side: fail fast',
    '<p>The server reads its configuration once at start-up and checks that every required variable exists. If one is missing it stops immediately with a clear message, instead of starting and crashing later on a customer’s request.</p>',
    '<p>Máy chủ đọc cấu hình một lần lúc khởi động và kiểm mọi biến bắt buộc đều có mặt. Thiếu một cái thì dừng ngay với thông báo rõ ràng, thay vì khởi động rồi sập về sau ở request của một khách hàng.</p>'],
  [6, 'Fail fast, measured',
    '<p>Three real runs. With no environment at all, two variables are missing. With the <code>.env</code> file loaded, one is still missing — the file only had a browser-prefixed version. With everything set, the server starts and prints that the secret is set without printing the secret itself.</p>',
    '<p>Ba lần chạy thật. Không có môi trường nào, thiếu hai biến. Nạp file <code>.env</code>, vẫn thiếu một — file chỉ có phiên bản mang tiền tố trình duyệt. Đủ cả, máy chủ khởi động và in ra rằng bí mật đã được đặt mà không in chính bí mật đó.</p>'],
  [7, 'Front-end: everything is public',
    '<p>In the browser bundle the payment secret appears as plain text, because the code read a <code>VITE_</code> variable. The prefix does not protect anything; it only tells Vite the value is safe to publish. The database URL, without the prefix, became undefined.</p>',
    '<p>Trong bundle của trình duyệt, khoá thanh toán hiện ra dạng chữ thường, vì code đã đọc một biến <code>VITE_</code>. Tiền tố đó không bảo vệ gì; nó chỉ báo cho Vite rằng giá trị an toàn để công khai. URL cơ sở dữ liệu, không có tiền tố, thành undefined.</p>'],
  [8, 'Where each value belongs',
    '<p>Public values — an API address, an analytics id, feature flags — may go to the browser. Secrets — database passwords, payment and e-mail keys, the JWT signing key — stay on the server. When the browser needs something only a secret can do, it calls your own API, which uses the secret.</p>',
    '<p>Giá trị công khai — địa chỉ API, mã analytics, cờ tính năng — được phép tới trình duyệt. Bí mật — mật khẩu cơ sở dữ liệu, khoá thanh toán và e-mail, khoá ký JWT — ở lại máy chủ. Khi trình duyệt cần việc gì chỉ bí mật làm được, nó gọi API của chính bạn, nơi dùng bí mật đó.</p>'],
  [9, 'Deleting is not enough',
    '<p>A fresh repository: the first commit included <code>.env</code> by mistake, the second removed it and added a <code>.gitignore</code>. The file is no longer tracked, yet one <code>git log</code> command still prints the password from history. Anyone with a clone has it.</p>',
    '<p>Một kho mới tinh: commit đầu vô tình chứa <code>.env</code>, commit sau xoá nó và thêm <code>.gitignore</code>. File không còn được theo dõi, vậy mà một lệnh <code>git log</code> vẫn in ra mật khẩu từ lịch sử. Ai có bản clone là có nó.</p>'],
  [10, 'A secret leaked',
    '<p>Rotate first: create a new key and revoke the old one, within minutes — bots scan public pushes for keys. Then update every place that uses it, and only then think about cleaning history. Finally add guards so it cannot happen again.</p>',
    '<p>Xoay khoá trước: tạo khoá mới và thu hồi khoá cũ, trong vài phút — bot quét các lần push công khai để tìm khoá. Rồi cập nhật mọi nơi dùng nó, và chỉ sau đó mới nghĩ tới dọn lịch sử. Cuối cùng thêm hàng rào để chuyện không lặp lại.</p>'],
  [11, 'Summary & practice',
    '<p>The practice sets up the whole pattern on a small script: a fail-fast config module, the three files, and a check that git really ignores the secret. It is the same pattern every Node.js and Next.js project in this platform uses.</p>',
    '<p>Bài luyện dựng toàn bộ mẫu trên một script nhỏ: module cấu hình dừng sớm, ba file, và một phép kiểm git thật sự bỏ qua bí mật. Đó là đúng mẫu mà mọi dự án Node.js và Next.js trên nền tảng này đang dùng.</p>'],
]);

export default {
  title: '14.2 — Environment variables and secrets|||14.2 — Biến môi trường và khoá bí mật',
  slug: 'wf-14-2-env-secrets',
  type: 'DOCUMENT',
  isFreePreview: true,
  description: 'Cấu hình theo môi trường, .env / .env.example / .gitignore, cấu hình máy chủ dừng sớm khi thiếu biến (node --env-file chạy thật), biến VITE_ bị nướng vào bundle — tái hiện vụ lộ khoá thật, giá trị nào công khai giá trị nào bí mật, bí mật đã commit vẫn còn trong lịch sử git, xoay khoá.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2</span>
<h2>Configuration outside the code, secrets out of reach</h2>
<p class="lead">After this lesson you can keep settings such as API addresses and database credentials outside your code, use <code>.env</code>, <code>.env.example</code> and <code>.gitignore</code> the way professional teams do, tell a public value from a secret, make a server refuse to start when its configuration is incomplete, and respond correctly when a secret has leaked. Why it matters: a leaked database password or payment key is one of the few beginner mistakes that costs real money within hours — bots scan public GitHub pushes for keys continuously. Every leak in this lesson is reproduced for real, with fake values.</p>

<h3>Step 1 — why configuration lives in the environment</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">API URL</span><span class="v">Laptop: <code>http://localhost:4000</code> · production: <code>https://api.ctshop.vn</code>.</span></div>
  <div class="kv"><span class="k">Database</span><span class="v">Laptop: local Postgres with test data · production: real customers.</span></div>
  <div class="kv"><span class="k">Payment key</span><span class="v">Laptop: test mode · production: live mode, real money.</span></div>
</div>
<p>The code is identical everywhere; only the settings change. An <strong>environment variable</strong> is a named value given to a program by whoever starts it — your terminal, a hosting platform, a CI runner. In Node.js you read it as <code>process.env.NAME</code>. Keeping settings there means the same build can run anywhere, and secrets never need to be written in a source file.</p>

<h3>Step 2 — the three files</h3>
${ma('bash', CODE['_t14/.env.example'])}
${ma('bash', CODE['_t14/.gitignore'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">.env</span><span class="lz-t">real values · never committed</span><span class="lz-d">Exists only on each machine. On a host you set the same variables in its dashboard or secret store.</span></div>
<div class="lz-layer"><span class="lz-k">.env.example</span><span class="lz-t">names + fake values · committed</span><span class="lz-d">Documentation: a new teammate copies it to <code>.env</code> and fills it in.</span></div>
<div class="lz-layer"><span class="lz-k">.gitignore</span><span class="lz-t">keeps .env out of git</span><span class="lz-d"><code>.env</code> and <code>.env.*</code> ignored, with an exception for <code>.env.example</code>. Check with <code>git check-ignore -v .env</code>.</span></div>
</div>

<h3>Step 3 — the server: read once, fail fast</h3>
${ma('javascript', CODE['_t14/config.mjs'])}
${ra(OUT['_t14/out/config-missing'])}
${ra(OUT['_t14/out/config-envfile'])}
${ra(OUT['_t14/out/config-ok'])}
<p>Three real runs. With no environment, both required variables are missing and the process exits with code 1 and a clear message. With <code>node --env-file=.env</code> (built into Node since version 20.6, no library needed) the database URL is found, but <code>PAYMENT_SECRET</code> is still missing — our demo <code>.env</code> only has a <code>VITE_PAYMENT_SECRET</code>, which is a different name. With everything set, the server starts, and the log proves the secret exists by printing its <em>length</em>, never its value.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — logging configuration.</strong> <code>console.log(process.env)</code> or <code>console.log(config)</code> "just to debug" sends every secret into your log files, error trackers and screenshots shared in group chats. Log that a secret is present (as above), the host of a database URL (not the password), or nothing at all.</p></div>

<h3>Step 4 — the front-end: everything in the bundle is public</h3>
<p>Browser code cannot read the server's environment — there is no <code>process.env</code> on a user's phone. Instead, a build tool copies chosen values <em>into the bundle</em> at build time (lesson 14.1). Vite only copies variables whose names start with <code>VITE_</code> (Next.js: <code>NEXT_PUBLIC_</code>). Here is the deliberate mistake from our project:</p>
${ma('javascript', CODE['_t14/src/main.js'], [13, 16])}
${ra(OUT['_t14/out/bundle-grep'])}
<p>The bundle contains <code>window.__paymentKey=&#96;demo-secret-not-real-0001&#96;</code> — in plain text, downloadable by every visitor, visible in DevTools in five seconds. The prefix did its job exactly: it marked the value as <em>safe to publish</em>, and Vite published it. Meanwhile <code>DATABASE_URL</code>, which lacks the prefix, became <code>void 0</code> (undefined): Vite refuses to expose unprefixed variables, which is the real protection.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "VITE_ / NEXT_PUBLIC_ makes it work".</strong> Beginners see <code>undefined</code> in the browser, add the prefix, and the error disappears — together with the secret's secrecy. If the browser needs a secret to do something (charge a card, send an e-mail, query the database), the browser must call <strong>your own API</strong>, and the API uses the secret on the server. That is what the backend courses build.</p></div>
<div class="kv-grid">
  <div class="kv"><span class="k">Public — may be in the bundle</span><span class="v">API base URL, analytics/measurement ids, map keys restricted to your domain, feature flags. Name: <code>VITE_…</code> / <code>NEXT_PUBLIC_…</code>.</span></div>
  <div class="kv"><span class="k">Secret — server only</span><span class="v">Database passwords, payment and e-mail API secret keys, JWT signing secrets, admin tokens. Never prefixed, never in front-end code.</span></div>
</div>

<h3>Step 5 — a secret committed once is leaked forever</h3>
${ra(OUT['_t14/out/git-history'])}
<p>A fresh repository, two commits: the first included <code>.env</code> by mistake; the second removed it from git and added a <code>.gitignore</code>. Today the file is not tracked (<code>git ls-files</code>) and is ignored (<code>check-ignore</code>). Yet <code>git log -p -S "demo-password"</code> walks the history and prints the password from the first commit. Every clone, every fork, and every bot that scanned the push has that line.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Rotate</span><span class="lz-d">At the provider: create a new key and revoke the old one. Minutes count.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Update</span><span class="lz-d">Put the new value in every server, CI secret and teammate's <code>.env</code>.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Clean (optional)</span><span class="lz-d">Rewriting history (<code>git filter-repo</code>) reduces exposure but cannot recall copies. Assume the old key is public forever.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Guard</span><span class="lz-d"><code>.gitignore</code> from day one, GitHub push protection / secret scanning, a pre-commit scanner such as gitleaks.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — "I deleted it in the next commit, so it's fine".</strong> It is not. Deleting the file changes the latest snapshot, not the past. The only safe assumption after a secret reaches any remote repository — even a private one, even for a minute — is that it is compromised. Rotate it.</p></div>

<div class="callout ok">
<p><strong>🧪 Practice (20 minutes)</strong></p>
<p>In a new folder with <code>git init</code>: write <code>config.mjs</code> that requires <code>API_TOKEN</code> and <code>PORT</code> (default 3000), exits with code 1 and a clear message if <code>API_TOKEN</code> is missing, and prints only the token's length. Create <code>.env</code> with a fake token, <code>.env.example</code> with a placeholder, and a <code>.gitignore</code> that ignores <code>.env</code> but not <code>.env.example</code>. Run it with and without <code>--env-file=.env</code>.</p>
<p><strong>Done when:</strong> without the variable the script prints your message and <code>echo $?</code> shows 1; with it, it prints the length; <code>git check-ignore -v .env</code> names your <code>.gitignore</code> rule; <code>git status</code> shows <code>.env.example</code> but not <code>.env</code>; and the token never appears in any output. Code Lab module 14.2 grades a configuration loader and a bundle-leak detector.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">environment variable</span><span class="v">biến môi trường — giá trị có tên do nơi khởi động chương trình đặt.</span></div>
  <div class="kv"><span class="k">.env / .env.example</span><span class="v">file giá trị thật (không commit) / file mẫu chỉ có tên (commit).</span></div>
  <div class="kv"><span class="k">secret</span><span class="v">bí mật — mật khẩu, khoá API, khoá ký; chỉ nằm ở máy chủ.</span></div>
  <div class="kv"><span class="k">public config</span><span class="v">cấu hình công khai — an toàn khi nằm trong bundle.</span></div>
  <div class="kv"><span class="k">fail fast</span><span class="v">dừng sớm — báo lỗi ngay lúc khởi động thay vì sập về sau.</span></div>
  <div class="kv"><span class="k">build-time vs run-time</span><span class="v">lúc dựng / lúc chạy — VITE_ được nướng lúc dựng; process.env đọc lúc chạy.</span></div>
  <div class="kv"><span class="k">rotate</span><span class="v">xoay khoá — tạo khoá mới, thu hồi khoá cũ.</span></div>
  <div class="kv"><span class="k">secret scanning</span><span class="v">quét bí mật — công cụ tự tìm khoá bị đẩy lên kho.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>Configuration changes per environment, so it lives in environment variables, not in code.</li>
  <li><code>.env</code> holds real values and is ignored; <code>.env.example</code> documents the names and is committed.</li>
  <li>Servers read config once and fail fast with a clear message; never log secrets.</li>
  <li>Everything in a front-end bundle is public; <code>VITE_</code>/<code>NEXT_PUBLIC_</code> marks values as publishable, it does not protect them.</li>
  <li>A committed secret stays in git history — rotate it first, then clean up and add guards.</li>
</ul>
${nguon('📗', 'Vite — Env Variables and Modes', 'The VITE_ prefix, .env files and modes, from the official guide', 'https://vite.dev/guide/env-and-mode.html')}
${nguon('📘', 'OWASP — Secrets Management Cheat Sheet', 'How teams store, rotate and audit secrets', 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html')}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-20-2-env-next-public', title: 'Next.js 20.2 — environment variables and the NEXT_PUBLIC trap', sub: 'The same leak with NEXT_PUBLIC_, and build-time vs run-time in Next.js', cta: 'Open lesson' })}
${lienKet({ khoa: 'deploy-vps', bai: 'deploy-4-4-bi-mat-trong-lich-su-git', title: 'Deploy 4.4 — a secret in git history is a LEAKED secret', sub: 'History rewriting, what it can and cannot fix', cta: 'Open lesson' })}
${lienKet({ khoa: 'deploy-vps', bai: 'deploy-4-5-xoay-bi-mat', title: 'Deploy 4.5 — rotating a secret without logging everyone out', sub: 'The rotation step done properly on a live server', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2</span>
<h2>Cấu hình nằm ngoài code, bí mật nằm ngoài tầm với</h2>
<p class="lead">Học xong bài này bạn giữ được các cấu hình như địa chỉ API hay thông tin đăng nhập cơ sở dữ liệu ở ngoài code, dùng <code>.env</code>, <code>.env.example</code> và <code>.gitignore</code> theo cách các nhóm chuyên nghiệp dùng, phân biệt giá trị công khai với bí mật, làm cho máy chủ từ chối khởi động khi cấu hình thiếu, và phản ứng đúng khi một bí mật bị lộ. Vì sao cần: lộ mật khẩu cơ sở dữ liệu hay khoá thanh toán là một trong số ít lỗi của người mới tốn tiền thật chỉ trong vài giờ — bot liên tục quét các lần push công khai trên GitHub để tìm khoá. Mọi vụ rò rỉ trong bài này được tái hiện thật, với giá trị giả.</p>

<h3>Bước 1 — vì sao cấu hình nằm trong môi trường</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">URL API</span><span class="v">Laptop: <code>http://localhost:4000</code> · production: <code>https://api.ctshop.vn</code>.</span></div>
  <div class="kv"><span class="k">Cơ sở dữ liệu</span><span class="v">Laptop: Postgres cục bộ với dữ liệu thử · production: khách hàng thật.</span></div>
  <div class="kv"><span class="k">Khoá thanh toán</span><span class="v">Laptop: chế độ thử · production: chế độ thật, tiền thật.</span></div>
</div>
<p>Code giống hệt ở mọi nơi; chỉ cấu hình thay đổi. <strong>Biến môi trường (environment variable)</strong> là một giá trị có tên được đưa cho chương trình bởi người khởi động nó — terminal của bạn, nền tảng hosting, máy chạy CI. Trong Node.js bạn đọc nó bằng <code>process.env.TÊN</code>. Giữ cấu hình ở đó nghĩa là cùng một bản dựng chạy được ở mọi nơi, và bí mật không bao giờ phải viết trong file mã nguồn.</p>

<h3>Bước 2 — ba file</h3>
${ma('bash', CODE['_t14/.env.example'])}
${ma('bash', CODE['_t14/.gitignore'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">.env</span><span class="lz-t">giá trị thật · không bao giờ commit</span><span class="lz-d">Chỉ tồn tại trên từng máy. Trên máy chủ bạn đặt cùng các biến đó trong bảng điều khiển hay kho bí mật của nó.</span></div>
<div class="lz-layer"><span class="lz-k">.env.example</span><span class="lz-t">tên + giá trị giả · có commit</span><span class="lz-d">Tài liệu: đồng đội mới chép nó thành <code>.env</code> rồi điền vào.</span></div>
<div class="lz-layer"><span class="lz-k">.gitignore</span><span class="lz-t">giữ .env ngoài git</span><span class="lz-d">Bỏ qua <code>.env</code> và <code>.env.*</code>, có ngoại lệ cho <code>.env.example</code>. Kiểm bằng <code>git check-ignore -v .env</code>.</span></div>
</div>

<h3>Bước 3 — máy chủ: đọc một lần, dừng sớm</h3>
${ma('javascript', CODE['_t14/config.mjs'])}
${ra(OUT['_t14/out/config-missing'])}
${ra(OUT['_t14/out/config-envfile'])}
${ra(OUT['_t14/out/config-ok'])}
<p>Ba lần chạy thật. Không có môi trường nào, thiếu cả hai biến bắt buộc và tiến trình thoát với mã 1 cùng thông báo rõ ràng. Với <code>node --env-file=.env</code> (có sẵn trong Node từ bản 20.6, không cần thư viện) URL cơ sở dữ liệu được tìm thấy, nhưng <code>PAYMENT_SECRET</code> vẫn thiếu — file <code>.env</code> mẫu chỉ có <code>VITE_PAYMENT_SECRET</code>, một cái tên khác. Đủ cả thì máy chủ khởi động, và dòng log chứng minh bí mật có mặt bằng cách in <em>độ dài</em> của nó, không bao giờ in giá trị.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — in cấu hình ra log.</strong> <code>console.log(process.env)</code> hay <code>console.log(config)</code> "để gỡ lỗi thôi" đẩy mọi bí mật vào file log, công cụ theo dõi lỗi và ảnh chụp màn hình gửi trong nhóm chat. Hãy in rằng bí mật có mặt (như trên), phần host của URL cơ sở dữ liệu (không kèm mật khẩu), hoặc không in gì.</p></div>

<h3>Bước 4 — front-end: mọi thứ trong bundle đều công khai</h3>
<p>Code trình duyệt không đọc được môi trường của máy chủ — trên điện thoại người dùng không có <code>process.env</code>. Thay vào đó, công cụ build chép các giá trị được chọn <em>vào bundle</em> lúc dựng (bài 14.1). Vite chỉ chép các biến có tên bắt đầu bằng <code>VITE_</code> (Next.js: <code>NEXT_PUBLIC_</code>). Đây là lỗi cố ý trong dự án của ta:</p>
${ma('javascript', CODE['_t14/src/main.js'], [13, 16])}
${ra(OUT['_t14/out/bundle-grep'])}
<p>Bundle chứa <code>window.__paymentKey=&#96;demo-secret-not-real-0001&#96;</code> — dạng chữ thường, mọi người truy cập đều tải về, nhìn thấy trong DevTools trong năm giây. Tiền tố đã làm đúng việc của nó: đánh dấu giá trị là <em>an toàn để công khai</em>, và Vite đã công khai nó. Trong khi đó <code>DATABASE_URL</code>, không có tiền tố, thành <code>void 0</code> (undefined): Vite từ chối phơi các biến không có tiền tố — đó mới là sự bảo vệ thật.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "thêm VITE_ / NEXT_PUBLIC_ là chạy".</strong> Người mới thấy <code>undefined</code> trên trình duyệt, thêm tiền tố, và lỗi biến mất — cùng với tính bí mật của khoá. Nếu trình duyệt cần bí mật để làm việc gì (trừ tiền thẻ, gửi e-mail, truy vấn cơ sở dữ liệu), trình duyệt phải gọi <strong>API của chính bạn</strong>, và API dùng bí mật ở máy chủ. Đó là thứ các khoá backend xây dựng.</p></div>
<div class="kv-grid">
  <div class="kv"><span class="k">Công khai — được nằm trong bundle</span><span class="v">URL gốc của API, mã analytics, khoá bản đồ giới hạn theo tên miền của bạn, cờ tính năng. Tên: <code>VITE_…</code> / <code>NEXT_PUBLIC_…</code>.</span></div>
  <div class="kv"><span class="k">Bí mật — chỉ ở máy chủ</span><span class="v">Mật khẩu cơ sở dữ liệu, khoá bí mật API thanh toán và e-mail, khoá ký JWT, token quản trị. Không tiền tố, không bao giờ có trong code front-end.</span></div>
</div>

<h3>Bước 5 — bí mật đã commit một lần là lộ mãi mãi</h3>
${ra(OUT['_t14/out/git-history'])}
<p>Một kho mới tinh, hai commit: commit đầu vô tình chứa <code>.env</code>; commit sau gỡ nó khỏi git và thêm <code>.gitignore</code>. Hôm nay file không còn được theo dõi (<code>git ls-files</code>) và bị bỏ qua (<code>check-ignore</code>). Vậy mà <code>git log -p -S "demo-password"</code> đi ngược lịch sử và in ra mật khẩu từ commit đầu. Mọi bản clone, mọi bản fork, và mọi con bot đã quét lần push đó đều có dòng này.</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Xoay khoá</span><span class="lz-d">Tại nhà cung cấp: tạo khoá mới và thu hồi khoá cũ. Từng phút đều quý.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Cập nhật</span><span class="lz-d">Đặt giá trị mới vào mọi máy chủ, secret của CI và <code>.env</code> của đồng đội.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Dọn (tuỳ chọn)</span><span class="lz-d">Viết lại lịch sử (<code>git filter-repo</code>) giảm mức phơi nhưng không thu hồi được các bản sao. Hãy coi khoá cũ là công khai vĩnh viễn.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Rào lại</span><span class="lz-d"><code>.gitignore</code> từ ngày đầu, push protection / secret scanning của GitHub, công cụ quét trước commit như gitleaks.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "commit sau tôi xoá rồi, không sao đâu".</strong> Có sao đấy. Xoá file chỉ đổi ảnh chụp mới nhất, không đổi quá khứ. Giả định an toàn duy nhất sau khi một bí mật lên bất kỳ kho từ xa nào — kể cả kho riêng tư, kể cả chỉ một phút — là nó đã bị lộ. Hãy xoay khoá.</p></div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (20 phút)</strong></p>
<p>Trong một thư mục mới đã <code>git init</code>: viết <code>config.mjs</code> yêu cầu <code>API_TOKEN</code> và <code>PORT</code> (mặc định 3000), thoát với mã 1 kèm thông báo rõ nếu thiếu <code>API_TOKEN</code>, và chỉ in độ dài của token. Tạo <code>.env</code> với một token giả, <code>.env.example</code> với giá trị giữ chỗ, và một <code>.gitignore</code> bỏ qua <code>.env</code> nhưng không bỏ qua <code>.env.example</code>. Chạy nó có và không có <code>--env-file=.env</code>.</p>
<p><strong>Xong khi:</strong> thiếu biến thì script in thông báo của bạn và <code>echo $?</code> ra 1; có biến thì in độ dài; <code>git check-ignore -v .env</code> chỉ ra đúng luật trong <code>.gitignore</code>; <code>git status</code> thấy <code>.env.example</code> mà không thấy <code>.env</code>; và token không bao giờ xuất hiện trong output nào. Code Lab module 14.2 chấm một bộ đọc cấu hình và một bộ dò rò rỉ trong bundle.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">environment variable</span><span class="v">biến môi trường — giá trị có tên do nơi khởi động chương trình đặt.</span></div>
  <div class="kv"><span class="k">.env / .env.example</span><span class="v">file giá trị thật (không commit) / file mẫu chỉ có tên (commit).</span></div>
  <div class="kv"><span class="k">secret</span><span class="v">bí mật — mật khẩu, khoá API, khoá ký; chỉ nằm ở máy chủ.</span></div>
  <div class="kv"><span class="k">public config</span><span class="v">cấu hình công khai — an toàn khi nằm trong bundle.</span></div>
  <div class="kv"><span class="k">fail fast</span><span class="v">dừng sớm — báo lỗi ngay lúc khởi động thay vì sập về sau.</span></div>
  <div class="kv"><span class="k">build-time vs run-time</span><span class="v">lúc dựng / lúc chạy — VITE_ được nướng lúc dựng; process.env đọc lúc chạy.</span></div>
  <div class="kv"><span class="k">rotate</span><span class="v">xoay khoá — tạo khoá mới, thu hồi khoá cũ.</span></div>
  <div class="kv"><span class="k">secret scanning</span><span class="v">quét bí mật — công cụ tự tìm khoá bị đẩy lên kho.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Cấu hình thay đổi theo môi trường, nên nằm trong biến môi trường, không nằm trong code.</li>
  <li><code>.env</code> giữ giá trị thật và bị bỏ qua; <code>.env.example</code> ghi lại các tên và được commit.</li>
  <li>Máy chủ đọc cấu hình một lần và dừng sớm với thông báo rõ; không bao giờ in bí mật.</li>
  <li>Mọi thứ trong bundle front-end đều công khai; <code>VITE_</code>/<code>NEXT_PUBLIC_</code> đánh dấu giá trị được phép công khai, không bảo vệ nó.</li>
  <li>Bí mật đã commit còn mãi trong lịch sử git — xoay khoá trước, rồi dọn dẹp và thêm hàng rào.</li>
</ul>
${nguon('📗', 'Vite — Env Variables and Modes', 'Tiền tố VITE_, file .env và các mode, theo hướng dẫn chính thức', 'https://vite.dev/guide/env-and-mode.html')}
${nguon('📘', 'OWASP — Secrets Management Cheat Sheet', 'Các nhóm lưu, xoay và kiểm toán bí mật thế nào', 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html')}
${lienKet({ khoa: 'nextjs', bai: 'nextjs-20-2-env-next-public', title: 'Next.js 20.2 — biến môi trường và bẫy NEXT_PUBLIC', sub: 'Cùng vụ lộ với NEXT_PUBLIC_, và lúc dựng khác lúc chạy trong Next.js', cta: 'Mở bài' })}
${lienKet({ khoa: 'deploy-vps', bai: 'deploy-4-4-bi-mat-trong-lich-su-git', title: 'Deploy 4.4 — bí mật lỡ vào lịch sử git là bí mật ĐÃ LỘ', sub: 'Viết lại lịch sử: sửa được gì và không sửa được gì', cta: 'Mở bài' })}
${lienKet({ khoa: 'deploy-vps', bai: 'deploy-4-5-xoay-bi-mat', title: 'Deploy 4.5 — xoay bí mật mà không đá văng người dùng', sub: 'Bước xoay khoá làm đúng cách trên một máy chủ đang chạy', cta: 'Mở bài' })}
</div>
`,
};
