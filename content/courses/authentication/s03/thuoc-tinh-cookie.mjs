/**
 * Authentication · Chương 3 · 3.2 — Từng thuộc tính cookie, và nó THẬT SỰ chặn được gì. Slug giữ: auth-3-2-thuoc-tinh-cookie.
 * Đo trong Chromium 156.0.8078.4 (Playwright 1.64.1, env -i): ma trận 8 kiểu Set-Cookie (HttpOnly ẩn khỏi script; __Host- thiếu Secure /
 * có Domain / Path ≠ / bị bỏ âm thầm; xoá thiếu Path không xoá được); SameSite 4 cookie × 4 kiểu request × 2 thời điểm (Lax chặn POST
 * chéo site; không khai ⇒ POST chéo site vẫn kèm trong 2 phút đầu — giống nodejs 8.4 trên Chromium 149); XSS đổi được email dù HttpOnly.
 */
import G from '../giang/auth-03-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const CASES = CODE.cookieLab.split('\n').filter((l) => /^  [a-z_]+: '/.test(l)).join('\n');

const NGUON_EN = [
  nguon('📘', 'MDN — Set-Cookie', '__Host-: Secure, no Domain, Path=/; HttpOnly cookies are still sent with fetch(); the https requirement is ignored on localhost (read 01/11/2026).', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie'),
  nguon('🦉', 'OWASP — Session Management Cheat Sheet: cookies', 'Session cookies: Secure, HttpOnly, SameSite Strict or Lax, no Domain, the __Host- prefix (read 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('📘', 'MDN — Set-Cookie', '__Host-: Secure, không Domain, Path=/; cookie HttpOnly vẫn được gửi kèm fetch(); yêu cầu https được bỏ qua với localhost (đọc 01/11/2026).', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie'),
  nguon('🦉', 'OWASP — Session Management Cheat Sheet: cookie', 'Cookie phiên: Secure, HttpOnly, SameSite Strict hoặc Lax, không Domain, tiền tố __Host- (đọc 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Attribute</th><th>Stops (measured here)</th><th>Does NOT stop</th><th>Session cookie</th></tr></thead>
<tbody>
<tr><td><code>HttpOnly</code></td><td>a script reading the token (<code>document.cookie</code> = "")</td><td>a script <em>using</em> the cookie in place — the XSS run changed the email</td><td>always</td></tr>
<tr><td><code>Secure</code></td><td>the cookie travelling over plain HTTP</td><td>anything once the page itself is compromised</td><td>always (localhost counts as secure)</td></tr>
<tr><td><code>SameSite=Lax</code></td><td>cross-site form POST, fetch, images</td><td>top-level cross-site GET links; requests from a sibling subdomain (same site)</td><td>Lax, or Strict if no external links must keep you signed in</td></tr>
<tr><td><code>__Host-</code> (Secure, Path=/, no Domain)</td><td>subdomains setting, overwriting or receiving it</td><td>an XSS on the host itself</td><td>always</td></tr>
<tr><td><code>Domain=…</code></td><td>— (it widens, never narrows)</td><td>—</td><td>never for sessions</td></tr>
<tr><td><code>Max-Age</code></td><td>the browser keeping it forever</td><td>a copied cookie — the server checks expiry (3.1)</td><td>= the absolute timeout</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Thuộc tính</th><th>Chặn được (đo ở đây)</th><th>KHÔNG chặn</th><th>Cookie phiên</th></tr></thead>
<tbody>
<tr><td><code>HttpOnly</code></td><td>script đọc token (<code>document.cookie</code> = "")</td><td>script <em>dùng</em> cookie tại chỗ — lần chạy XSS đã đổi được email</td><td>luôn luôn</td></tr>
<tr><td><code>Secure</code></td><td>cookie đi qua HTTP thường</td><td>bất cứ gì khi chính trang đã bị chiếm</td><td>luôn luôn (localhost được coi là an toàn)</td></tr>
<tr><td><code>SameSite=Lax</code></td><td>form POST, fetch, ảnh từ site khác</td><td>link GET cấp cao nhất từ site khác; request từ subdomain anh em (cùng site)</td><td>Lax, hoặc Strict nếu không cần giữ đăng nhập khi bấm link từ ngoài vào</td></tr>
<tr><td><code>__Host-</code> (Secure, Path=/, không Domain)</td><td>subdomain đặt, ghi đè hay nhận cookie</td><td>XSS trên chính host</td><td>luôn luôn</td></tr>
<tr><td><code>Domain=…</code></td><td>— (chỉ nới rộng, không bao giờ thu hẹp)</td><td>—</td><td>không bao giờ cho phiên</td></tr>
<tr><td><code>Max-Age</code></td><td>trình duyệt giữ mãi</td><td>cookie bị chép — máy chủ tự kiểm hết hạn (3.1)</td><td>= mốc hết hạn tuyệt đối</td></tr>
</tbody>
</table>`;

export default {
  title: '3.2 — Every cookie attribute, and what it actually stops|||3.2 — Từng thuộc tính cookie, và nó THẬT SỰ chặn được gì',
  slug: 'auth-3-2-thuoc-tinh-cookie',
  type: 'LESSON',
  isFreePreview: true,
  description: 'HttpOnly, Secure, SameSite, Domain, Path, Max-Age và tiền tố __Host- — đo trong Chromium 156 thật: thuộc tính nào được nhận, script có thấy không, có được gửi lại không; __Host- sai bị bỏ ÂM THẦM; xoá cookie thiếu Path không xoá được; SameSite đo lại (4 cookie × link/form/ảnh/fetch × trước/sau 2 phút); HttpOnly chặn việc đọc chứ không chặn việc dùng (XSS vẫn đổi được email); vì sao Domain= là cái bẫy.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Every cookie attribute, and what it actually stops</h2>
<p class="lead">LabFlow ID v0.3 sends <code>Set-Cookie: __Host-lfid_ses=…; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200</code>. Each attribute is a small security decision, and most tables online list them as if every attribute stopped every attack. This lesson asks a real browser — Chromium 156 driven by Playwright — what it accepts, what it hides from scripts, and what it sends back, then attacks the result.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>read a <code>Set-Cookie</code> line attribute by attribute and justify each one;</li>
<li>use the <code>__Host-</code> prefix and know the three rules the browser enforces;</li>
<li>predict which cookies a browser attaches to a cross-site link, form, image or fetch;</li>
<li>explain precisely what HttpOnly protects and what it does not;</li>
<li>clear a cookie so that it is really gone.</li>
</ul>
<p><strong>Why it is worth your hour:</strong> the session cookie is the single most attacked string in a web app. “Why HttpOnly?”, “what does SameSite do?” are standard interview questions — and the honest answer includes what each one does <em>not</em> do.</p>
</div>

<h3>An everyday picture first</h3>
<p>A festival wristband: staff check it at every gate, but you cannot peel it off and hand it over (<strong>HttpOnly</strong> — scripts cannot read it); it works at this festival only, not at the one next door (<strong>no Domain</strong>, <strong>SameSite</strong>); and it only goes through the guarded entrance (<strong>Secure</strong> — HTTPS). Each property stops one specific thing. None of them stops someone who is already inside the fence with you.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Stored?</span><span class="lz-d">The browser may silently refuse a cookie whose attributes break a rule (prefixes, Secure).</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Visible?</span><span class="lz-d">HttpOnly hides it from <code>document.cookie</code> — and only from that.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Sent?</span><span class="lz-d">Path, Domain and SameSite decide which requests carry it — including ones another site triggers.</span></div>
</div>

<h3>What Chromium 156 accepts, hides and sends</h3>
<p><code>demo3/cookie-lab.js</code> (http://localhost:4802) answers <code>/set?c=…</code> with one of these headers; <code>demo3/cookie-matrix.mjs</code> sets each in real Chromium, then checks the browser's jar, <code>document.cookie</code>, and what arrives at <code>/me</code>:</p>
${ma('javascript', CASES)}
${ra(OUT['32-cookies'])}
<ul>
<li><strong>HttpOnly</strong> cookies (<code>httponly</code>, <code>host_ok</code>) are stored and sent, but invisible to scripts.</li>
<li>Every <strong>broken prefix</strong> is dropped: <code>__Host-</code> without Secure, with a Domain, or with <code>Path=/admin</code>; <code>__Secure-</code> without Secure. Note that <code>__Host-ok</code> was accepted over <code>http://localhost</code>: Chromium treats localhost as a secure context so you can develop without HTTPS (MDN says the same).</li>
<li><strong>Deleting</strong>: <code>scoped=; Max-Age=0</code> sent from <code>/set</code> did not delete <code>scoped</code>, because the original was set with <code>Path=/me</code> — a cookie is identified by name <em>and</em> domain <em>and</em> path. With <code>Path=/me</code> the delete worked.</li>
</ul>
<div class="pitfall co-tieu-de">
<p><strong>Trap — failures without an error.</strong> A rejected <code>__Host-</code> cookie produces no console error and no failed request; the user just “cannot stay signed in”. A sign-out that clears the cookie with different attributes leaves the old cookie in place — and if the server forgot to delete the row, the user is still signed in. LabFlow ID clears with exactly the same attributes (<code>Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0</code>) <em>and</em> deletes the row.</p>
</div>

<h3>The <code>__Host-</code> prefix: three rules, enforced by the browser</h3>
<p>A cookie whose name starts with <code>__Host-</code> is accepted only if it has <code>Secure</code>, has <code>Path=/</code> and has <strong>no</strong> <code>Domain</code> — measured above. The payoff: such a cookie belongs to exactly one host. A user-content or forgotten subdomain (<code>blog.labflow.example</code>) cannot set, overwrite or receive <code>__Host-lfid_ses</code>, which closes “cookie tossing”, the usual way to plant a session in someone's browser (lesson 3.3).</p>

<h3>SameSite, re-measured on Chromium 156</h3>
<p>Four cookies, one per SameSite value, are set on <code>localhost:4802</code>. A page on <code>127.0.0.1:4801</code> — a different <em>site</em> — then triggers a link click, an auto-submitted form POST, an image and a <code>fetch</code> POST; the server logs which cookies arrived. Once right after login, once 125 seconds later:</p>
${ra(OUT['32-samesite'])}
<ul>
<li><strong>Strict</strong> is never sent cross-site — not even when the user clicks a link to you (they arrive “signed out”).</li>
<li><strong>Lax</strong> is sent only on a top-level navigation (the link), never on a cross-site POST, image or fetch.</li>
<li><strong>None</strong> (must be Secure) is sent on everything — the CSRF setting.</li>
<li><strong>Not set</strong>: Chromium treats it as Lax, <em>except</em> for its first 2 minutes, when a cross-site top-level POST still carries it (“Lax-allowing-unsafe”). The second run shows the window closed.</li>
</ul>
<p>Node.js lesson 8.4 measured the same POST behaviour on Chromium 149; on 156 nothing changed. Note what SameSite cannot do: <code>blog.labflow.example</code> and <code>id.labflow.example</code> are the <em>same site</em>, so SameSite does not separate them — <code>__Host-</code> and the CSRF checks of lesson 3.4 do.</p>

<h3>HttpOnly stops reading, not using</h3>
<p>Suppose a page of LabFlow ID itself has an XSS hole. <code>demo3/httponly-xss.mjs</code> signs An in, then runs “injected” code inside a LabFlow ID page:</p>
${ra(OUT['32-xss'])}
<p>The script sees <code>""</code> — the token cannot be copied out and replayed later from the attacker's machine. But a <code>fetch</code> from the same page carries the cookie automatically, and the email changed to <code>attacker@evil.example</code> (the demo then puts it back). OWASP says it plainly: XSS defeats all CSRF defences. HttpOnly limits the damage to <em>while the script runs</em>; preventing the XSS is the real fix.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — <code>Domain=labflow.example</code> “so it works on subdomains”.</strong> It sends the session to <em>every</em> subdomain: one forgotten <code>test.labflow.example</code>, or a subdomain taken over through a dangling DNS record, receives every user's session. Without Domain the cookie is host-only — the default is the safe one. Signing in across subdomains is a real need; Chapter 8 solves it with OpenID Connect, not with a wider cookie.</p>
</div>

<h3>What each attribute stops — and what it does not</h3>
${BANG_EN}

<h3>In interviews / at work</h3>
<ul>
<li><strong>“Why HttpOnly?”</strong> — So a script cannot read the session token and send it elsewhere. It does not stop an XSS from making requests with the cookie while it runs.</li>
<li><strong>“What does SameSite=Lax protect?”</strong> — Cross-site POSTs, images and fetches do not carry the cookie; top-level GET links still do. It is defence in depth for CSRF, not the whole defence.</li>
<li><strong>“Why the __Host- prefix?”</strong> — The browser enforces Secure, Path=/ and no Domain, so subdomains cannot set or read the session cookie.</li>
</ul>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<ol>
<li>Start <code>node demo3/cookie-lab.js</code> and run <code>node demo3/cookie-matrix.mjs</code>. Then add a case <code>__Host-lower=1; path=/; secure</code> (lower-case attributes). Predict, then run.</li>
<li>Run <code>node demo3/samesite.mjs</code> (it takes about 2.5 minutes). Which line changes between the two runs, and why only that one?</li>
<li>In DevTools on any site you use, find the session cookie and write down its attributes. Which row of the table above does each one cover?</li>
</ol>
<p><strong>Solution:</strong> attribute names are case-insensitive in RFC 6265, and our run confirmed it: <code>__Host-lower</code> was stored, visible to <code>document.cookie</code> (no HttpOnly) and sent — <code>yes yes yes</code>. In the SameSite run only <code>form-post POST</code> changes: <code>unset</code> disappears after 2 minutes because the exception applies to top-level POSTs of cookies without a SameSite attribute; fetch and img never carried it.</p>
<p><strong>Done when:</strong> your session cookie has all five protective attributes, you can explain each with one of the measurements above, and your sign-out clears it with identical attributes.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HttpOnly</span><span class="v">The cookie is hidden from <code>document.cookie</code>; it is still sent with requests, including ones a script makes.</span></div>
  <div class="kv"><span class="k">Secure</span><span class="v">Sent only over HTTPS (localhost counts as secure for development).</span></div>
  <div class="kv"><span class="k">SameSite</span><span class="v">Whether a request triggered by another site carries the cookie: Strict, Lax or None.</span></div>
  <div class="kv"><span class="k">site vs origin</span><span class="v">Origin = scheme + host + port; site = scheme + registrable domain. Subdomains of one domain are the same site.</span></div>
  <div class="kv"><span class="k">__Host- prefix</span><span class="v">A name prefix that makes the browser require Secure, Path=/ and no Domain.</span></div>
  <div class="kv"><span class="k">cookie tossing</span><span class="v">A subdomain setting a cookie for its parent domain to plant or overwrite a session.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>LabFlow ID's cookie: <code>__Host-lfid_ses=…; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200</code> — every part measured.</li>
<li>Broken <code>__Host-</code>/<code>__Secure-</code> cookies are dropped silently; deleting needs the same name, domain and path.</li>
<li>SameSite on Chromium 156: Lax blocks cross-site POST/fetch/img; an unset cookie still rides on POSTs for 2 minutes.</li>
<li>HttpOnly stops theft, not use: an XSS changed the email anyway.</li>
<li>Never <code>Domain=</code> on a session cookie.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'java-web-application-development', bai: 'prj301-cookie-session', title: 'Also in PRJ301 — cookies and sessions (Java servlets)', sub: 'Same: the session lives on the server and the browser carries only its id (JSESSIONID). That lesson shows Cookie and HttpSession in servlets; this one measures each cookie attribute in real Chromium. The ideas carry over to Java unchanged.', cta: 'OPEN PRJ301 LESSON →' })}
${lienKet({ khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-5-1-passwords-sessions', title: 'Also in SDN302 — 5.1 passwords, sessions and cookies', sub: 'Same: sessions versus stateless tokens, and cookies with express. That lesson follows the syllabus with express-session and Passport; this one sets every attribute by hand and tests it in a browser.', cta: 'OPEN SDN302 LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Từng thuộc tính cookie, và nó THẬT SỰ chặn được gì</h2>
<p class="lead">LabFlow ID v0.3 gửi <code>Set-Cookie: __Host-lfid_ses=…; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200</code>. Mỗi thuộc tính là một quyết định bảo mật nhỏ, và phần lớn bảng trên mạng liệt kê chúng như thể thuộc tính nào cũng chặn được mọi đòn. Bài này hỏi một trình duyệt thật — Chromium 156 điều khiển bằng Playwright — nó nhận gì, giấu gì khỏi script, gửi lại gì, rồi tấn công kết quả.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>đọc một dòng <code>Set-Cookie</code> từng thuộc tính và bảo vệ được từng cái;</li>
<li>dùng tiền tố <code>__Host-</code> và biết ba luật trình duyệt áp cho nó;</li>
<li>đoán trình duyệt đính cookie nào vào một link, form, ảnh hay fetch từ site khác;</li>
<li>giải thích chính xác HttpOnly bảo vệ gì và không bảo vệ gì;</li>
<li>xoá một cookie sao cho nó thật sự biến mất.</li>
</ul>
<p><strong>Vì sao đáng một giờ của bạn:</strong> cookie phiên là chuỗi bị tấn công nhiều nhất trong một ứng dụng web. "Sao lại HttpOnly?", "SameSite làm gì?" là câu phỏng vấn quen thuộc — và câu trả lời thật thà phải gồm cả điều mỗi thuộc tính <em>không</em> làm được.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Vòng đeo tay ở lễ hội: nhân viên soát nó ở mọi cổng, nhưng bạn không tháo ra đưa người khác được (<strong>HttpOnly</strong> — script không đọc được); nó chỉ dùng ở lễ hội này, không dùng được ở lễ hội bên cạnh (<strong>không Domain</strong>, <strong>SameSite</strong>); và nó chỉ đi qua cổng có người gác (<strong>Secure</strong> — HTTPS). Mỗi tính chất chặn một điều cụ thể. Không cái nào chặn được kẻ đã ở trong hàng rào cùng bạn.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Có được lưu?</span><span class="lz-d">Trình duyệt có thể âm thầm từ chối cookie có thuộc tính phạm luật (tiền tố, Secure).</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Có thấy được?</span><span class="lz-d">HttpOnly giấu nó khỏi <code>document.cookie</code> — và chỉ khỏi chỗ đó.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Có được gửi?</span><span class="lz-d">Path, Domain và SameSite quyết định request nào mang nó — kể cả request do site khác gây ra.</span></div>
</div>

<h3>Chromium 156 nhận gì, giấu gì, gửi gì</h3>
<p><code>demo3/cookie-lab.js</code> (http://localhost:4802) trả lời <code>/set?c=…</code> bằng một trong các header này; <code>demo3/cookie-matrix.mjs</code> đặt từng cái trong Chromium thật, rồi kiểm hộp cookie của trình duyệt, <code>document.cookie</code>, và thứ tới được <code>/me</code>:</p>
${ma('javascript', CASES)}
${ra(OUT['32-cookies'])}
<ul>
<li>Cookie <strong>HttpOnly</strong> (<code>httponly</code>, <code>host_ok</code>) được lưu và gửi, nhưng script không thấy.</li>
<li>Mọi <strong>tiền tố sai</strong> đều bị bỏ: <code>__Host-</code> thiếu Secure, có Domain, hay <code>Path=/admin</code>; <code>__Secure-</code> thiếu Secure. Để ý <code>__Host-ok</code> được nhận qua <code>http://localhost</code>: Chromium coi localhost là ngữ cảnh an toàn để bạn phát triển không cần HTTPS (MDN cũng nói vậy).</li>
<li><strong>Xoá</strong>: <code>scoped=; Max-Age=0</code> gửi từ <code>/set</code> không xoá được <code>scoped</code>, vì bản gốc đặt với <code>Path=/me</code> — một cookie được nhận diện bằng tên <em>và</em> domain <em>và</em> path. Kèm <code>Path=/me</code> thì xoá được.</li>
</ul>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — thất bại không kèm lỗi.</strong> Cookie <code>__Host-</code> bị từ chối không sinh lỗi console, không làm request nào thất bại; người dùng chỉ thấy "không giữ được đăng nhập". Đăng xuất mà xoá cookie bằng thuộc tính khác thì cookie cũ vẫn nằm đó — và nếu máy chủ quên xoá dòng, người dùng vẫn đăng nhập. LabFlow ID xoá với đúng các thuộc tính đó (<code>Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0</code>) <em>và</em> xoá dòng.</p>
</div>

<h3>Tiền tố <code>__Host-</code>: ba luật, do trình duyệt áp</h3>
<p>Cookie có tên bắt đầu bằng <code>__Host-</code> chỉ được nhận khi có <code>Secure</code>, có <code>Path=/</code> và <strong>không</strong> có <code>Domain</code> — đã đo ở trên. Cái lợi: cookie đó thuộc về đúng một host. Một subdomain chứa nội dung người dùng hay bị bỏ quên (<code>blog.labflow.example</code>) không đặt, ghi đè hay nhận được <code>__Host-lfid_ses</code>, chặn luôn "cookie tossing" (ném cookie), cách thường dùng để cài phiên vào trình duyệt người khác (bài 3.3).</p>

<h3>SameSite, đo lại trên Chromium 156</h3>
<p>Bốn cookie, mỗi giá trị SameSite một cái, được đặt trên <code>localhost:4802</code>. Một trang ở <code>127.0.0.1:4801</code> — một <em>site</em> khác — kích hoạt một cú bấm link, một form POST tự gửi, một ảnh và một <code>fetch</code> POST; máy chủ ghi cookie nào tới nơi. Một lần ngay sau đăng nhập, một lần sau 125 giây:</p>
${ra(OUT['32-samesite'])}
<ul>
<li><strong>Strict</strong> không bao giờ được gửi chéo site — kể cả khi người dùng bấm link tới bạn (họ đến nơi ở trạng thái "chưa đăng nhập").</li>
<li><strong>Lax</strong> chỉ được gửi khi điều hướng cấp cao nhất (link), không bao giờ với POST, ảnh hay fetch chéo site.</li>
<li><strong>None</strong> (phải có Secure) được gửi với mọi thứ — thiết lập của CSRF.</li>
<li><strong>Không khai</strong>: Chromium coi là Lax, <em>trừ</em> 2 phút đầu, khi một POST cấp cao nhất từ site khác vẫn mang nó ("Lax-allowing-unsafe"). Lần chạy thứ hai cho thấy cửa sổ đã đóng.</li>
</ul>
<p>Bài 8.4 của khoá Node.js đo được cùng hành vi với POST trên Chromium 149; lên 156 không gì thay đổi. Để ý điều SameSite không làm được: <code>blog.labflow.example</code> và <code>id.labflow.example</code> là <em>cùng site</em>, nên SameSite không tách chúng ra — <code>__Host-</code> và các phép kiểm CSRF ở bài 3.4 mới làm việc đó.</p>

<h3>HttpOnly chặn việc đọc, không chặn việc dùng</h3>
<p>Giả sử chính một trang của LabFlow ID dính lỗ XSS. <code>demo3/httponly-xss.mjs</code> đăng nhập cho An, rồi chạy đoạn mã "chèn vào" bên trong một trang LabFlow ID:</p>
${ra(OUT['32-xss'])}
<p>Script thấy <code>""</code> — token không thể bị chép ra để dùng lại sau từ máy kẻ tấn công. Nhưng một <code>fetch</code> từ chính trang đó tự mang cookie theo, và email đã đổi thành <code>attacker@evil.example</code> (demo đổi lại sau đó). OWASP nói thẳng: XSS đánh bại mọi lớp phòng CSRF. HttpOnly giới hạn thiệt hại vào <em>lúc script đang chạy</em>; chặn XSS mới là cách sửa thật.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — <code>Domain=labflow.example</code> "cho chạy được trên subdomain".</strong> Nó gửi phiên tới <em>mọi</em> subdomain: một <code>test.labflow.example</code> bị bỏ quên, hay một subdomain bị chiếm qua bản ghi DNS treo, nhận được phiên của mọi người dùng. Không có Domain thì cookie chỉ thuộc một host — mặc định chính là lựa chọn an toàn. Đăng nhập xuyên subdomain là nhu cầu có thật; Chương 8 giải nó bằng OpenID Connect, không phải bằng một cookie rộng hơn.</p>
</div>

<h3>Mỗi thuộc tính chặn gì — và không chặn gì</h3>
${BANG_VI}

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"Sao lại HttpOnly?"</strong> — Để script không đọc được token phiên rồi gửi đi nơi khác. Nó không ngăn XSS tạo request kèm cookie trong lúc đang chạy.</li>
<li><strong>"SameSite=Lax bảo vệ gì?"</strong> — POST, ảnh và fetch từ site khác không mang cookie; link GET cấp cao nhất thì vẫn mang. Nó là lớp phòng thêm cho CSRF, không phải toàn bộ.</li>
<li><strong>"Sao dùng tiền tố __Host-?"</strong> — Trình duyệt bắt buộc Secure, Path=/ và không Domain, nên subdomain không đặt hay đọc được cookie phiên.</li>
</ul>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<ol>
<li>Bật <code>node demo3/cookie-lab.js</code> và chạy <code>node demo3/cookie-matrix.mjs</code>. Rồi thêm một trường hợp <code>__Host-lower=1; path=/; secure</code> (thuộc tính viết thường). Đoán, rồi chạy.</li>
<li>Chạy <code>node demo3/samesite.mjs</code> (mất khoảng 2,5 phút). Dòng nào đổi giữa hai lần chạy, và vì sao chỉ dòng đó?</li>
<li>Trong DevTools của một trang bạn hay dùng, tìm cookie phiên và ghi lại các thuộc tính. Mỗi cái ứng với hàng nào của bảng ở trên?</li>
</ol>
<p><strong>Lời giải:</strong> tên thuộc tính không phân biệt hoa thường theo RFC 6265, và lần chạy của mình xác nhận: <code>__Host-lower</code> được lưu, <code>document.cookie</code> thấy (không HttpOnly) và được gửi — <code>yes yes yes</code>. Trong lần chạy SameSite chỉ dòng <code>form-post POST</code> đổi: <code>unset</code> biến mất sau 2 phút vì ngoại lệ chỉ áp cho POST cấp cao nhất của cookie không khai SameSite; fetch và img vốn chưa bao giờ mang nó.</p>
<p><strong>Đạt khi:</strong> cookie phiên của bạn có đủ năm thuộc tính bảo vệ, bạn giải thích được từng cái bằng một phép đo ở trên, và lúc đăng xuất bạn xoá nó với thuộc tính y hệt.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HttpOnly</span><span class="v">Cookie bị giấu khỏi <code>document.cookie</code>; vẫn được gửi kèm request, kể cả request do script tạo.</span></div>
  <div class="kv"><span class="k">Secure</span><span class="v">Chỉ gửi qua HTTPS (localhost được coi là an toàn khi phát triển).</span></div>
  <div class="kv"><span class="k">SameSite</span><span class="v">Request do site khác gây ra có mang cookie không: Strict, Lax hay None.</span></div>
  <div class="kv"><span class="k">site và origin</span><span class="v">Origin = scheme + host + cổng; site = scheme + tên miền đăng ký được. Các subdomain của cùng một tên miền là cùng site.</span></div>
  <div class="kv"><span class="k">tiền tố __Host-</span><span class="v">Tiền tố tên khiến trình duyệt đòi Secure, Path=/ và không Domain.</span></div>
  <div class="kv"><span class="k">cookie tossing (ném cookie)</span><span class="v">Subdomain đặt cookie cho tên miền cha để cài hoặc ghi đè một phiên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cookie của LabFlow ID: <code>__Host-lfid_ses=…; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200</code> — phần nào cũng đã đo.</li>
<li>Cookie <code>__Host-</code>/<code>__Secure-</code> sai bị bỏ âm thầm; xoá phải cùng tên, domain và path.</li>
<li>SameSite trên Chromium 156: Lax chặn POST/fetch/ảnh chéo site; cookie không khai vẫn theo POST trong 2 phút.</li>
<li>HttpOnly chặn việc trộm, không chặn việc dùng: XSS vẫn đổi được email.</li>
<li>Không bao giờ <code>Domain=</code> cho cookie phiên.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'java-web-application-development', bai: 'prj301-cookie-session', title: 'Cũng có ở PRJ301 — cookie và session (Java servlet)', sub: 'Giống: session sống ở máy chủ và trình duyệt chỉ mang id của nó (JSESSIONID). Bài đó dùng Cookie và HttpSession trong servlet; bài này đo từng thuộc tính cookie trong Chromium thật. Ý tưởng dùng nguyên cho Java.', cta: 'MỞ BÀI PRJ301 →' })}
${lienKet({ khoa: 'server-side-development-nodejs-express-mongodb', bai: 'sdn302-5-1-passwords-sessions', title: 'Cũng có ở SDN302 — 5.1 mật khẩu, session và cookie', sub: 'Giống: session đối lại token không trạng thái, và cookie với express. Bài đó theo giáo trình với express-session và Passport; bài này tự đặt từng thuộc tính và thử trong trình duyệt.', cta: 'MỞ BÀI SDN302 →' })}
</div>
`,
};
