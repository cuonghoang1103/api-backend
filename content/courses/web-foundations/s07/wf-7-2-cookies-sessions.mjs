/**
 * Bài 7.2 — Cookie và phiên (nâng cấp 02/11/2026). Output thật: _demo/_t7/chay.sh (curl + app Node _t7/app.mjs: Set-Cookie, kho
 * cookie, log máy chủ, đăng xuất rồi dùng lại cookie cũ ⇒ 401), _demo/_t7/chay.mjs (Chromium: HttpOnly không đọc được bằng
 * document.cookie, localStorage thì được; CSRF: SameSite=Lax chặn, SameSite=None ⇒ chuyển tiền thành công).
 * Deck: scripts/slides-src/wf-7-2.mjs (10 slide, WF/v1/wf-7-2). Code Lab: wf-7-2-cookies-sessions.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const doan = (key, ...n) => { const p = OUT[key].split(/\n+(?=\$ )/); return n.map((i) => p[i].trim()).join('\n\n'); };

const G = walkWf('wf-7-2', 'Cookies and sessions', 'Cookie và phiên', [
  [1, 'Cookies and sessions',
    '<p>The oldest and still the most common way websites remember who you are: the server keeps a record of your login, and the browser keeps a random number that points to it. This lesson follows that number from the login response to every request after it, and then attacks it.</p>',
    '<p>Cách lâu đời nhất và vẫn phổ biến nhất để website nhớ bạn là ai: máy chủ giữ một bản ghi lượt đăng nhập, còn trình duyệt giữ một con số ngẫu nhiên trỏ tới bản ghi đó. Bài này theo con số đó từ response đăng nhập tới mọi request sau đó, rồi tấn công nó.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to explain a session from start to finish, read every attribute of a Set-Cookie header, show why HttpOnly protects a session from injected scripts, log a user out so the old cookie stops working, and explain how SameSite stops a malicious site from using your login.</p>',
    '<p>Bạn sẽ giải thích được một phiên từ đầu tới cuối, đọc được mọi thuộc tính của header Set-Cookie, cho thấy vì sao HttpOnly bảo vệ phiên khỏi script bị chèn, đăng xuất người dùng sao cho cookie cũ thôi hiệu lực, và giải thích SameSite ngăn một trang độc hại dùng lượt đăng nhập của bạn thế nào.</p>'],
  [3, 'The session flow',
    '<p>At login the server checks the password, creates a record in its own memory or database, and sends back only a long random id in a Set-Cookie header. The browser stores it and attaches it to every later request to the same site. The server looks the id up to find the user.</p>',
    '<p>Khi đăng nhập, máy chủ kiểm mật khẩu, tạo một bản ghi trong bộ nhớ hoặc cơ sở dữ liệu của nó, và chỉ gửi lại một id ngẫu nhiên dài trong header Set-Cookie. Trình duyệt lưu nó và đính vào mọi request sau tới cùng trang. Máy chủ tra id để tìm ra người dùng.</p>'],
  [4, 'Reading Set-Cookie',
    '<p>Each attribute is a rule for the browser. HttpOnly hides the cookie from JavaScript. SameSite decides whether other sites can trigger requests that carry it. Path and Max-Age limit where and how long it is sent. Secure restricts it to HTTPS.</p>',
    '<p>Mỗi thuộc tính là một luật cho trình duyệt. HttpOnly giấu cookie khỏi JavaScript. SameSite quyết định trang khác có kích hoạt được request mang nó không. Path và Max-Age giới hạn gửi ở đâu và trong bao lâu. Secure giới hạn nó vào HTTPS.</p>'],
  [5, 'The server log',
    '<p>The app logs every request with the cookie it carried. Before login, nothing. After login, every request from curl\'s cookie jar carries the session id, without any extra code on the client. This automatic sending is both the convenience and, as we will see, the danger.</p>',
    '<p>App ghi log mọi request kèm cookie nó mang. Trước khi đăng nhập, không có gì. Sau khi đăng nhập, mọi request từ kho cookie của curl đều mang id phiên, không cần thêm dòng mã nào ở client. Việc tự động gửi này vừa là tiện lợi vừa, như ta sắp thấy, là nguy hiểm.</p>'],
  [6, 'HttpOnly in a real browser',
    '<p>In Chromium, the page could still use the session: fetch of slash api slash me returned An. But document dot cookie showed only the theme cookie, not the session id. Anything in localStorage, on the other hand, is readable by every script on the page, including an injected one.</p>',
    '<p>Trong Chromium, trang vẫn dùng được phiên: fetch tới /api/me trả về An. Nhưng document.cookie chỉ hiện cookie theme, không có id phiên. Ngược lại, mọi thứ trong localStorage đều đọc được bởi mọi script trên trang, kể cả script bị chèn vào.</p>'],
  [7, 'Logging out for real',
    '<p>Logout deletes the session record on the server and tells the browser to delete the cookie. We then sent the old cookie value by hand, as an attacker who had copied it would, and got 401. With sessions, the server can end a login at any moment.</p>',
    '<p>Đăng xuất xoá bản ghi phiên trên máy chủ và bảo trình duyệt xoá cookie. Sau đó ta gửi lại giá trị cookie cũ bằng tay, như kẻ đã chép được nó sẽ làm, và nhận 401. Với phiên, máy chủ kết thúc một lượt đăng nhập bất cứ lúc nào.</p>'],
  [8, 'CSRF, measured',
    '<p>An logged in, then opened a page on another site that silently posted a transfer form to our app. With SameSite Lax, the browser left the cookie out and the server answered 401. With SameSite None, the cookie went along and five million moved to the attacker.</p>',
    '<p>An đăng nhập, rồi mở một trang ở site khác lặng lẽ gửi form chuyển tiền tới app của ta. Với SameSite Lax, trình duyệt không kèm cookie và máy chủ trả 401. Với SameSite None, cookie đi theo và năm triệu chuyển sang kẻ tấn công.</p>'],
  [9, 'Cookie, localStorage, sessionStorage',
    '<p>Cookies are sent to the server automatically and can be hidden from JavaScript. localStorage and sessionStorage stay in the browser and are always readable by scripts. For a login session, an HttpOnly cookie is the safer default; storage is for preferences and drafts.</p>',
    '<p>Cookie được tự động gửi tới máy chủ và có thể giấu khỏi JavaScript. localStorage và sessionStorage ở lại trình duyệt và luôn đọc được bằng script. Với phiên đăng nhập, cookie HttpOnly là lựa chọn mặc định an toàn hơn; storage dành cho tuỳ chọn và bản nháp.</p>'],
  [10, 'Summary & practice',
    '<p>The practice asks you to inspect the session cookie in DevTools, prove that logout really ends the session, and reproduce the cross-site form with both SameSite values. "Done when" checks the flags you read and the 401 that SameSite Lax produces.</p>',
    '<p>Bài luyện yêu cầu bạn soi cookie phiên trong DevTools, chứng minh đăng xuất thật sự kết thúc phiên, và tái hiện form khác site với cả hai giá trị SameSite. "Xong khi" kiểm các cờ bạn đọc được và mã 401 mà SameSite Lax tạo ra.</p>'],
]);

export default {
  title: '7.2 — Cookies and sessions|||7.2 — Cookie và phiên',
  slug: 'wf-7-2-cookies-sessions',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/GihQAC1I39Q', durationSeconds: 0 },
  description: 'Phiên từ đầu tới cuối trên app Node thật (mã đầy đủ): Set-Cookie, kho cookie của curl, log máy chủ cho thấy request nào mang cookie; đọc HttpOnly/Secure/SameSite/Path/Max-Age; Chromium: HttpOnly không đọc được bằng document.cookie còn localStorage thì được; đăng xuất xoá phiên ⇒ cookie cũ 401; CSRF đo thật: SameSite=Lax chặn (401), SameSite=None ⇒ chuyển 5 000 000; so cookie/localStorage/sessionStorage.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>The server remembers you; a cookie reminds it who you are</h2>
<p class="lead">After this lesson you can follow a session from the login form to every request after it, read each attribute of a <code>Set-Cookie</code> header and say what it protects, show in a real browser why <code>HttpOnly</code> matters, end a session so that a copied cookie stops working, and explain — with a measured attack — how <code>SameSite</code> stops other websites from using your users' logins. Most websites you use, from banks to Facebook, work this way, and Express's <code>express-session</code> does exactly what our 80-line app does.</p>

<h3>Step 1 — the session flow</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">POST /login</span><span class="lz-d">The browser sends email and password (over HTTPS).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Server remembers</span><span class="lz-d">Password checked; a record <code>{ userId, expires }</code> saved under a random id — 32 random bytes, 43 characters.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Set-Cookie: sid=…</span><span class="lz-d">Only the id is sent back. The user's data stays on the server.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cookie: sid=… on every request</span><span class="lz-d">The browser attaches it by itself to every request to that site.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Lookup</span><span class="lz-d">The server finds the record → the user. Logout or expiry deletes the record.</span></div>
</div>
<p>Here is the whole app used in Chapter 7. Copy it into <code>app.mjs</code> and run <code>node app.mjs</code> (Node 18+, no installs):</p>
${ma('javascript', CODE['_t7/app.mjs'])}

<h3>Step 2 — a session, step by step (curl)</h3>
<p>curl only keeps cookies when asked: <code>-c cookies.txt</code> saves what the server sets, <code>-b cookies.txt</code> sends them back — exactly what a browser does automatically.</p>
${ra(doan('_t7/out/session', 2, 3))}
${ra(OUT['_t7/out/jar'])}
<p>The jar line says: domain <code>localhost</code>, path <code>/</code>, not Secure, an expiry timestamp one hour ahead, name <code>sid</code>. The <code>#HttpOnly_</code> prefix is curl's way of recording the HttpOnly flag. Meanwhile, the server's log shows which requests carried the cookie:</p>
${ra(OUT['_t7/out/app-log'])}

<h3>Step 3 — reading <code>Set-Cookie</code></h3>
<table>
<thead><tr><th>Attribute</th><th>Our value</th><th>What it does</th></tr></thead>
<tbody>
<tr><td><code>sid=…</code></td><td>43 random characters</td><td>The value. Must be unguessable: <code>crypto.randomBytes(32)</code>, never <code>Math.random()</code> or an incrementing number.</td></tr>
<tr><td><code>HttpOnly</code></td><td>set</td><td>JavaScript cannot read it (<code>document.cookie</code> does not show it). Stops injected scripts from stealing the session.</td></tr>
<tr><td><code>SameSite</code></td><td><code>Lax</code></td><td><code>Strict</code>: never sent from another site. <code>Lax</code>: sent when the user follows a link, not for cross-site POSTs or fetches. <code>None</code>: always (needs <code>Secure</code>).</td></tr>
<tr><td><code>Path</code></td><td><code>/</code></td><td>Sent for every path on the site.</td></tr>
<tr><td><code>Max-Age</code></td><td><code>3600</code></td><td>The browser deletes it after one hour. Without Max-Age/Expires it is a "session cookie" deleted when the browser closes.</td></tr>
<tr><td><code>Secure</code></td><td>(production)</td><td>Sent only over HTTPS. Always set it in production; browsers treat <code>localhost</code> as secure for testing.</td></tr>
<tr><td><code>Domain</code></td><td>(not set)</td><td>Not set = only this exact host. <code>Domain=example.com</code> would share it with every subdomain — rarely what you want.</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Trap — a guessable session id.</strong> <code>sid=1</code>, <code>sid=2</code>, a timestamp, or <code>Math.random().toString(36)</code> can be guessed or predicted, and whoever guesses a valid id <em>is</em> that user — no password needed. Use a cryptographic random generator with at least 128 bits (our app uses 256), and give a new id at every login so an id planted before login is useless.</p></div>

<h3>Step 4 — HttpOnly, in a real browser</h3>
<p>In Chromium, on the app's own page, we logged in with <code>fetch</code>, set an ordinary cookie <code>theme=dark</code> and put a token in <code>localStorage</code>. Then we ran the kind of script an attacker would inject through an XSS bug:</p>
${ra(OUT['_t7/out/httponly'])}
<p>The page could still <em>use</em> the session — the browser attached the HttpOnly cookie to <code>fetch('/api/me')</code> — but no script could <em>read</em> it. The localStorage token, on the other hand, was right there for the taking.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — keeping the login token in <code>localStorage</code> "because it is easier".</strong> Any script running on your page can read <code>localStorage</code>: an XSS bug, a compromised npm package, an analytics snippet. With the token in hand, the attacker can call your API from anywhere until it expires. An HttpOnly cookie cannot be read by script at all. XSS is still dangerous (the script can make requests while the page is open), but it cannot carry the session away.</p></div>

<h3>Step 5 — logging out for real</h3>
${ra(OUT['_t7/out/logout'])}
<p>Logout did two things: deleted the record on the server (<code>sessions.delete(sid)</code>) and sent <code>Max-Age=0</code> so the browser deletes its copy. The second request sends the <em>old</em> value by hand, as someone who copied it earlier would: 401. Because the server holds the truth, it can end any session at any time — "log out of all devices" is simply deleting every record for that user. Lesson 7.3 shows that JWTs cannot do this so easily.</p>

<h3>Step 6 — CSRF: when automatic cookies work against you</h3>
<p>Cookies are sent automatically — even when the request is started by <em>another</em> website. A real attack, measured: An is logged in to our app. She opens a link in an email to <code>http://127.0.0.1:&lt;port&gt;/</code> (a different site), whose page contains a hidden form posting to our <code>/api/transfer</code> and submits it immediately.</p>
${ra(OUT['_t7/out/csrf'])}
<p>This is <strong>Cross-Site Request Forgery</strong>: the attacker never sees the cookie, they just make An's browser send a request that carries it. With <code>SameSite=Lax</code> (the default in modern browsers when you set nothing) the browser left the cookie out of the cross-site POST and our app answered 401. With <code>SameSite=None</code>, the money moved.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Layer 1</span><span class="lz-t">SameSite=Lax or Strict</span><span class="lz-d">Blocks cross-site POST, PUT, DELETE and fetch from carrying the cookie.</span></div>
<div class="lz-layer"><span class="lz-k">Layer 2</span><span class="lz-t">Never change data on GET</span><span class="lz-d">Lax still sends the cookie when the user follows a link (a GET) — Lesson 6.2's rule matters here.</span></div>
<div class="lz-layer"><span class="lz-k">Layer 3</span><span class="lz-t">CSRF token or Origin check</span><span class="lz-d">For forms that must work cross-site or older browsers: a random token in the form that another site cannot read, or reject requests whose <code>Origin</code> header is not yours.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Trap — setting <code>SameSite=None</code> to "fix" a login that does not work.</strong> When a front-end on another domain cannot use the session, the quick fix found online is <code>SameSite=None; Secure</code>. It works — and re-opens exactly the attack above for every endpoint. First ask whether front-end and API can share a site (same domain, different subdomains count as the same <em>site</em>), and if they truly cannot, add CSRF tokens before relaxing SameSite.</p></div>

<h3>Step 7 — cookie, localStorage or sessionStorage?</h3>
<table>
<thead><tr><th></th><th>Cookie</th><th>localStorage</th><th>sessionStorage</th></tr></thead>
<tbody>
<tr><td>Sent to the server</td><td>Automatically, every request</td><td>Never (you add it yourself)</td><td>Never</td></tr>
<tr><td>Readable by JavaScript</td><td>Not if HttpOnly</td><td>Always</td><td>Always</td></tr>
<tr><td>Lifetime</td><td>Max-Age / Expires, or until the browser closes</td><td>Until deleted</td><td>Until the tab closes</td></tr>
<tr><td>Size</td><td>About 4 KB each</td><td>About 5 MB per origin</td><td>About 5 MB per origin</td></tr>
<tr><td>Good for</td><td>Session ids, server-needed preferences</td><td>Theme, drafts, cached non-secret data</td><td>One-tab wizard state</td></tr>
</tbody>
</table>

<div class="callout ok">
<p><strong>🧪 Practice (35 minutes) — inspect, end and attack a session</strong></p>
<ol>
<li>Run <code>node app.mjs</code>. Open <code>http://localhost:3457/api/me</code> in the browser (401), then in the console run the login <code>fetch</code> from the lesson and reload: 200.</li>
<li>DevTools → Application → Cookies: read the <code>sid</code> row. Which columns are ticked? Run <code>document.cookie</code> in the console.</li>
<li>Copy the cookie value, call <code>fetch('/logout', { method: 'POST' })</code>, then use curl with <code>-H 'Cookie: sid=&lt;copied value&gt;'</code> on <code>/api/me</code>.</li>
<li>Save the "prize" page from the lesson as <code>evil.html</code>, serve it with <code>npx serve -l 5000</code>, open <code>http://127.0.0.1:5000/evil.html</code> while logged in. Watch the server log.</li>
<li>Restart the app with <code>COOKIE_SAMESITE=None node app.mjs</code>, log in again and repeat step 4.</li>
</ol>
<p>Hint: <code>localhost</code> and <code>127.0.0.1</code> are different sites to the browser — that is what makes step 4 cross-site on one machine.</p>
<p><strong>Done when:</strong> DevTools shows HttpOnly ✓ and SameSite Lax for <code>sid</code> and <code>document.cookie</code> does not contain it; the copied cookie gets 401 after logout; the log shows <code>POST /api/transfer (no cookie)</code> with Lax and a TRANSFER line with None; and you can explain why in two sentences. Then Code Lab module 7.2.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">session</span><span class="v">phiên — bản ghi đăng nhập trên máy chủ.</span></div>
  <div class="kv"><span class="k">session id</span><span class="v">id phiên — số ngẫu nhiên trỏ tới bản ghi.</span></div>
  <div class="kv"><span class="k">Set-Cookie / Cookie</span><span class="v">máy chủ đặt / trình duyệt gửi lại.</span></div>
  <div class="kv"><span class="k">HttpOnly</span><span class="v">JavaScript không đọc được cookie.</span></div>
  <div class="kv"><span class="k">Secure</span><span class="v">chỉ gửi qua HTTPS.</span></div>
  <div class="kv"><span class="k">SameSite</span><span class="v">luật gửi cookie khi request đến từ site khác.</span></div>
  <div class="kv"><span class="k">CSRF</span><span class="v">giả mạo request liên trang — mượn cookie của nạn nhân.</span></div>
  <div class="kv"><span class="k">XSS</span><span class="v">chèn script độc vào trang.</span></div>
  <div class="kv"><span class="k">cookie jar</span><span class="v">kho cookie — nơi trình duyệt/curl giữ cookie.</span></div>
  <div class="kv"><span class="k">site vs origin</span><span class="v">site = tên miền gốc; origin = giao thức + host + cổng.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>A session = a record on the server + a random id in a cookie; the browser sends it automatically.</li>
  <li>The id must be long and cryptographically random, and replaced at every login.</li>
  <li><code>HttpOnly</code> keeps scripts from reading the session; <code>localStorage</code> is readable by any script.</li>
  <li>Logout deletes the server record, so even a copied cookie stops working.</li>
  <li>CSRF: another site makes the browser send your cookie. <code>SameSite=Lax</code> blocked it; <code>None</code> let it through.</li>
  <li>Production cookies: <code>HttpOnly; Secure; SameSite=Lax; Path=/</code> plus an expiry.</li>
</ul>
${nguon('📗', 'MDN — Using HTTP cookies', 'Set-Cookie attributes, SameSite and security', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies')}
${nguon('📘', 'OWASP — Session Management Cheat Sheet', 'Session ids, expiry and cookie flags in production', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-4-cookie-csrf-thu-hoi', title: 'Node.js 8.4 — Cookies, CSRF and revocation', sub: 'The same protections built into an Express app with a real database', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Máy chủ nhớ bạn; một cookie nhắc nó bạn là ai</h2>
<p class="lead">Học xong bài này bạn theo được một phiên từ form đăng nhập tới mọi request sau đó, đọc từng thuộc tính của header <code>Set-Cookie</code> và nói nó bảo vệ gì, cho thấy trong trình duyệt thật vì sao <code>HttpOnly</code> quan trọng, kết thúc một phiên sao cho cookie bị chép thôi hiệu lực, và giải thích — bằng một cuộc tấn công đo thật — cách <code>SameSite</code> ngăn website khác dùng lượt đăng nhập của người dùng. Phần lớn website bạn dùng, từ ngân hàng tới Facebook, chạy theo cách này, và <code>express-session</code> của Express làm đúng việc mà app 80 dòng của ta làm.</p>

<h3>Bước 1 — luồng của một phiên</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">POST /login</span><span class="lz-d">Trình duyệt gửi email và mật khẩu (qua HTTPS).</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Máy chủ ghi nhớ</span><span class="lz-d">Mật khẩu được kiểm; một bản ghi <code>{ userId, expires }</code> được lưu dưới một id ngẫu nhiên — 32 byte ngẫu nhiên, 43 ký tự.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Set-Cookie: sid=…</span><span class="lz-d">Chỉ id được gửi về. Dữ liệu người dùng ở lại máy chủ.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Cookie: sid=… ở mọi request</span><span class="lz-d">Trình duyệt tự đính nó vào mọi request tới trang đó.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Tra cứu</span><span class="lz-d">Máy chủ tìm bản ghi → người dùng. Đăng xuất hay hết hạn thì xoá bản ghi.</span></div>
</div>
<p>Đây là toàn bộ app dùng ở Chương 7. Chép vào <code>app.mjs</code> và chạy <code>node app.mjs</code> (Node 18+, không cần cài gì):</p>
${ma('javascript', CODE['_t7/app.mjs'])}

<h3>Bước 2 — một phiên, từng bước (curl)</h3>
<p>curl chỉ giữ cookie khi được bảo: <code>-c cookies.txt</code> lưu thứ máy chủ đặt, <code>-b cookies.txt</code> gửi chúng lại — đúng việc trình duyệt làm tự động.</p>
${ra(doan('_t7/out/session', 2, 3))}
${ra(OUT['_t7/out/jar'])}
<p>Dòng trong kho cookie nói: tên miền <code>localhost</code>, đường dẫn <code>/</code>, không Secure, mốc hết hạn một giờ sau, tên <code>sid</code>. Tiền tố <code>#HttpOnly_</code> là cách curl ghi lại cờ HttpOnly. Trong khi đó, log của máy chủ cho thấy request nào mang cookie:</p>
${ra(OUT['_t7/out/app-log'])}

<h3>Bước 3 — đọc <code>Set-Cookie</code></h3>
<table>
<thead><tr><th>Thuộc tính</th><th>Giá trị của ta</th><th>Tác dụng</th></tr></thead>
<tbody>
<tr><td><code>sid=…</code></td><td>43 ký tự ngẫu nhiên</td><td>Giá trị. Phải không đoán được: <code>crypto.randomBytes(32)</code>, không bao giờ <code>Math.random()</code> hay một số tăng dần.</td></tr>
<tr><td><code>HttpOnly</code></td><td>có</td><td>JavaScript không đọc được (<code>document.cookie</code> không hiện nó). Ngăn script bị chèn đánh cắp phiên.</td></tr>
<tr><td><code>SameSite</code></td><td><code>Lax</code></td><td><code>Strict</code>: không bao giờ gửi khi đến từ site khác. <code>Lax</code>: gửi khi người dùng bấm link, không gửi cho POST hay fetch khác site. <code>None</code>: luôn gửi (cần <code>Secure</code>).</td></tr>
<tr><td><code>Path</code></td><td><code>/</code></td><td>Gửi cho mọi đường dẫn của trang.</td></tr>
<tr><td><code>Max-Age</code></td><td><code>3600</code></td><td>Trình duyệt xoá nó sau một giờ. Không có Max-Age/Expires thì là "cookie phiên", bị xoá khi đóng trình duyệt.</td></tr>
<tr><td><code>Secure</code></td><td>(production)</td><td>Chỉ gửi qua HTTPS. Luôn đặt ở production; trình duyệt coi <code>localhost</code> là an toàn để thử.</td></tr>
<tr><td><code>Domain</code></td><td>(không đặt)</td><td>Không đặt = chỉ đúng host này. <code>Domain=example.com</code> sẽ chia nó cho mọi tên miền con — hiếm khi là điều bạn muốn.</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — id phiên đoán được.</strong> <code>sid=1</code>, <code>sid=2</code>, một mốc thời gian, hay <code>Math.random().toString(36)</code> đều đoán hoặc dự được, và ai đoán trúng một id hợp lệ <em>chính là</em> người dùng đó — không cần mật khẩu. Hãy dùng bộ sinh ngẫu nhiên mật mã với ít nhất 128 bit (app của ta dùng 256), và cấp id mới ở mỗi lần đăng nhập để một id cài sẵn trước khi đăng nhập trở nên vô dụng.</p></div>

<h3>Bước 4 — HttpOnly, trong trình duyệt thật</h3>
<p>Trong Chromium, trên chính trang của app, ta đăng nhập bằng <code>fetch</code>, đặt một cookie thường <code>theme=dark</code> và để một token trong <code>localStorage</code>. Rồi ta chạy loại script mà kẻ tấn công sẽ chèn qua một lỗi XSS:</p>
${ra(OUT['_t7/out/httponly'])}
<p>Trang vẫn <em>dùng</em> được phiên — trình duyệt đính cookie HttpOnly vào <code>fetch('/api/me')</code> — nhưng không script nào <em>đọc</em> được nó. Còn token trong localStorage thì nằm sẵn đó cho ai muốn lấy.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — giữ token đăng nhập trong <code>localStorage</code> "cho dễ".</strong> Mọi script chạy trên trang đều đọc được <code>localStorage</code>: một lỗi XSS, một gói npm bị chiếm, một đoạn mã thống kê. Cầm token trong tay, kẻ tấn công gọi API của bạn từ bất cứ đâu cho tới khi nó hết hạn. Cookie HttpOnly thì script hoàn toàn không đọc được. XSS vẫn nguy hiểm (script có thể gửi request khi trang còn mở), nhưng không mang phiên đi được.</p></div>

<h3>Bước 5 — đăng xuất cho thật</h3>
${ra(OUT['_t7/out/logout'])}
<p>Đăng xuất làm hai việc: xoá bản ghi trên máy chủ (<code>sessions.delete(sid)</code>) và gửi <code>Max-Age=0</code> để trình duyệt xoá bản của nó. Request thứ hai gửi giá trị <em>cũ</em> bằng tay, như người đã chép nó từ trước sẽ làm: 401. Vì máy chủ giữ sự thật, nó kết thúc được bất kỳ phiên nào bất cứ lúc nào — "đăng xuất khỏi mọi thiết bị" chỉ là xoá mọi bản ghi của người đó. Bài 7.3 cho thấy JWT không làm được việc này dễ như vậy.</p>

<h3>Bước 6 — CSRF: khi cookie tự động quay sang hại bạn</h3>
<p>Cookie được gửi tự động — kể cả khi request do một website <em>khác</em> khởi động. Một cuộc tấn công thật, đo được: An đang đăng nhập vào app của ta. Cô mở một link trong email tới <code>http://127.0.0.1:&lt;port&gt;/</code> (một site khác), trang đó chứa một form ẩn gửi tới <code>/api/transfer</code> của ta và tự gửi ngay.</p>
${ra(OUT['_t7/out/csrf'])}
<p>Đây là <strong>Cross-Site Request Forgery</strong> (giả mạo request liên trang): kẻ tấn công không bao giờ thấy cookie, họ chỉ khiến trình duyệt của An gửi một request có mang nó. Với <code>SameSite=Lax</code> (mặc định ở trình duyệt hiện đại khi bạn không đặt gì) trình duyệt bỏ cookie khỏi POST khác site và app trả 401. Với <code>SameSite=None</code>, tiền đã chuyển đi.</p>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Lớp 1</span><span class="lz-t">SameSite=Lax hoặc Strict</span><span class="lz-d">Chặn POST, PUT, DELETE và fetch khác site mang theo cookie.</span></div>
<div class="lz-layer"><span class="lz-k">Lớp 2</span><span class="lz-t">Không bao giờ đổi dữ liệu bằng GET</span><span class="lz-d">Lax vẫn gửi cookie khi người dùng bấm link (một GET) — luật ở Bài 6.2 quan trọng ở đây.</span></div>
<div class="lz-layer"><span class="lz-k">Lớp 3</span><span class="lz-t">CSRF token hoặc kiểm Origin</span><span class="lz-d">Với form buộc phải chạy khác site hay trình duyệt cũ: một token ngẫu nhiên trong form mà site khác không đọc được, hoặc từ chối request có header <code>Origin</code> không phải của bạn.</span></div>
</div>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — đặt <code>SameSite=None</code> để "sửa" đăng nhập không chạy.</strong> Khi front-end ở tên miền khác không dùng được phiên, cách sửa nhanh tìm thấy trên mạng là <code>SameSite=None; Secure</code>. Nó chạy — và mở lại đúng cuộc tấn công ở trên cho mọi endpoint. Trước hết hãy hỏi front-end và API có chung một site được không (cùng tên miền, khác tên miền con vẫn tính là cùng <em>site</em>), và nếu thật sự không thể, thêm CSRF token trước khi nới SameSite.</p></div>

<h3>Bước 7 — cookie, localStorage hay sessionStorage?</h3>
<table>
<thead><tr><th></th><th>Cookie</th><th>localStorage</th><th>sessionStorage</th></tr></thead>
<tbody>
<tr><td>Gửi lên máy chủ</td><td>Tự động, mọi request</td><td>Không bao giờ (bạn tự thêm)</td><td>Không bao giờ</td></tr>
<tr><td>JavaScript đọc được</td><td>Không, nếu HttpOnly</td><td>Luôn luôn</td><td>Luôn luôn</td></tr>
<tr><td>Thời gian sống</td><td>Max-Age / Expires, hoặc tới khi đóng trình duyệt</td><td>Tới khi bị xoá</td><td>Tới khi đóng thẻ</td></tr>
<tr><td>Kích thước</td><td>Khoảng 4 KB mỗi cookie</td><td>Khoảng 5 MB mỗi origin</td><td>Khoảng 5 MB mỗi origin</td></tr>
<tr><td>Hợp với</td><td>Id phiên, tuỳ chọn máy chủ cần</td><td>Theme, bản nháp, dữ liệu không bí mật</td><td>Trạng thái trình hướng dẫn trong một thẻ</td></tr>
</tbody>
</table>

<div class="callout ok">
<p><strong>🧪 Luyện tập (35 phút) — soi, kết thúc và tấn công một phiên</strong></p>
<ol>
<li>Chạy <code>node app.mjs</code>. Mở <code>http://localhost:3457/api/me</code> trong trình duyệt (401), rồi chạy <code>fetch</code> đăng nhập của bài trong console và tải lại: 200.</li>
<li>DevTools → Application → Cookies: đọc dòng <code>sid</code>. Những cột nào được tích? Chạy <code>document.cookie</code> trong console.</li>
<li>Chép giá trị cookie, gọi <code>fetch('/logout', { method: 'POST' })</code>, rồi dùng curl với <code>-H 'Cookie: sid=&lt;giá trị đã chép&gt;'</code> tới <code>/api/me</code>.</li>
<li>Lưu trang "trúng thưởng" của bài thành <code>evil.html</code>, phục vụ bằng <code>npx serve -l 5000</code>, mở <code>http://127.0.0.1:5000/evil.html</code> khi đang đăng nhập. Xem log máy chủ.</li>
<li>Khởi động lại app với <code>COOKIE_SAMESITE=None node app.mjs</code>, đăng nhập lại và làm lại bước 4.</li>
</ol>
<p>Gợi ý: <code>localhost</code> và <code>127.0.0.1</code> là hai site khác nhau với trình duyệt — đó là điều làm bước 4 thành khác site trên cùng một máy.</p>
<p><strong>Xong khi:</strong> DevTools hiện HttpOnly ✓ và SameSite Lax cho <code>sid</code> và <code>document.cookie</code> không chứa nó; cookie đã chép nhận 401 sau đăng xuất; log hiện <code>POST /api/transfer (no cookie)</code> với Lax và một dòng TRANSFER với None; và bạn giải thích được vì sao trong hai câu. Sau đó làm module Code Lab 7.2.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">session</span><span class="v">phiên — bản ghi đăng nhập trên máy chủ.</span></div>
  <div class="kv"><span class="k">session id</span><span class="v">id phiên — số ngẫu nhiên trỏ tới bản ghi.</span></div>
  <div class="kv"><span class="k">Set-Cookie / Cookie</span><span class="v">máy chủ đặt / trình duyệt gửi lại.</span></div>
  <div class="kv"><span class="k">HttpOnly</span><span class="v">JavaScript không đọc được cookie.</span></div>
  <div class="kv"><span class="k">Secure</span><span class="v">chỉ gửi qua HTTPS.</span></div>
  <div class="kv"><span class="k">SameSite</span><span class="v">luật gửi cookie khi request đến từ site khác.</span></div>
  <div class="kv"><span class="k">CSRF</span><span class="v">giả mạo request liên trang — mượn cookie của nạn nhân.</span></div>
  <div class="kv"><span class="k">XSS</span><span class="v">chèn script độc vào trang.</span></div>
  <div class="kv"><span class="k">cookie jar</span><span class="v">kho cookie — nơi trình duyệt/curl giữ cookie.</span></div>
  <div class="kv"><span class="k">site vs origin</span><span class="v">site = tên miền gốc; origin = giao thức + host + cổng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Phiên = một bản ghi trên máy chủ + một id ngẫu nhiên trong cookie; trình duyệt tự gửi nó.</li>
  <li>Id phải dài, ngẫu nhiên mật mã, và được thay ở mỗi lần đăng nhập.</li>
  <li><code>HttpOnly</code> ngăn script đọc phiên; <code>localStorage</code> thì script nào cũng đọc được.</li>
  <li>Đăng xuất xoá bản ghi trên máy chủ, nên cả cookie bị chép cũng thôi hiệu lực.</li>
  <li>CSRF: site khác khiến trình duyệt gửi cookie của bạn. <code>SameSite=Lax</code> đã chặn; <code>None</code> để lọt.</li>
  <li>Cookie production: <code>HttpOnly; Secure; SameSite=Lax; Path=/</code> kèm thời hạn.</li>
</ul>
${nguon('📗', 'MDN — Using HTTP cookies', 'Thuộc tính Set-Cookie, SameSite và bảo mật', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies')}
${nguon('📘', 'OWASP — Session Management Cheat Sheet', 'Id phiên, thời hạn và cờ cookie ở production', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html')}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-8-4-cookie-csrf-thu-hoi', title: 'Node.js 8.4 — Cookie, CSRF và thu hồi', sub: 'Cùng các lớp bảo vệ đó trong một app Express với cơ sở dữ liệu thật', cta: 'Mở bài' })}
</div>
`,
};
