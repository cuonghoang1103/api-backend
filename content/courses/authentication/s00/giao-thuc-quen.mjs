/**
 * Authentication · Mục 0 · 0.1 — Một giao thức quên sạch mọi thứ. Slug giữ: auth-0-1-giao-thuc-quen.
 * Soạn lại 01/11/2026 (đợt mẫu). Output cũ gọi cuongthai.com thật (không tái lập được) ⇒ thay bằng demo0/forget.js chạy
 * trên localhost:4800 trong env -i (Node 22.23.3, Express 5.3.0). Mọi code/output lấy từ ./_ma.mjs (sinh tự động).
 */
import G from '../giang/auth-00-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const F = CODE.forget.split('\n');
const F_RAW = F.slice(8, 13).join('\n');
const F_IP = F.slice(15, 21).join('\n');
const F_CONN = F.slice(23, 28).join('\n');
const F_CARD = F.slice(30, 37).join('\n');

const NGUON_EN = [
  nguon('🌐', 'MDN — An overview of HTTP', '“HTTP is stateless: there is no link between two requests being successively carried out on the same connection” — and how cookies add sessions on top (read 01/11/2026).', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview'),
  nguon('📡', 'RFC 6598 — Shared Address Space (April 2012)', 'Reserves 100.64.0.0/10 for Carrier-Grade NAT: many subscribers behind one provider address (read 01/11/2026).', 'https://www.rfc-editor.org/rfc/rfc6598.html'),
  nguon('🎫', 'OWASP — Session Management Cheat Sheet', 'Session ids from a CSPRNG with at least 64 bits of entropy; timeouts enforced on the server (read 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
].join('\n');
const NGUON_VI = [
  nguon('🌐', 'MDN — Tổng quan về HTTP', '“HTTP is stateless: there is no link between two requests being successively carried out on the same connection” — và cookie thêm phiên lên trên thế nào (đọc 01/11/2026).', 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview'),
  nguon('📡', 'RFC 6598 — Shared Address Space (4/2012)', 'Dành dải 100.64.0.0/10 cho Carrier-Grade NAT: nhiều thuê bao đứng sau một địa chỉ của nhà mạng (đọc 01/11/2026).', 'https://www.rfc-editor.org/rfc/rfc6598.html'),
  nguon('🎫', 'OWASP — Session Management Cheat Sheet', 'Mã phiên sinh từ CSPRNG với ít nhất 64 bit entropy; thời hạn phải được thi hành ở máy chủ (đọc 01/11/2026).', 'https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html'),
].join('\n');

const BANG_EN = `<table>
<thead><tr><th>Try</th><th>What the server keys on</th><th>What we measured</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td>1 · IP address</td><td><code>req.ip</code></td><td>Bình (same machine) became An; An on another address became nobody</td><td>❌ wrong person and lost person at once</td></tr>
<tr><td>2 · TCP connection</td><td><code>req.socket</code></td><td>Same connection (port 60295) remembered; next connection (60296) forgot</td><td>❌ lives seconds; proxies mix users</td></tr>
<tr><td>3 · A card the client carries</td><td>the <code>x-card</code> header</td><td>Recognised on every request, any connection, any address</td><td>✅ works — and whoever holds the card <em>is</em> you</td></tr>
</tbody>
</table>`;
const BANG_VI = `<table>
<thead><tr><th>Cách thử</th><th>Máy chủ dựa vào</th><th>Đo được</th><th>Kết luận</th></tr></thead>
<tbody>
<tr><td>1 · Địa chỉ IP</td><td><code>req.ip</code></td><td>Bình (cùng máy) thành An; An ở địa chỉ khác thành người lạ</td><td>❌ nhận nhầm người và mất người cùng lúc</td></tr>
<tr><td>2 · Kết nối TCP</td><td><code>req.socket</code></td><td>Cùng kết nối (cổng 60295) thì nhớ; kết nối sau (60296) thì quên</td><td>❌ sống vài giây; proxy trộn người dùng</td></tr>
<tr><td>3 · Một "thẻ" client mang theo</td><td>header <code>x-card</code></td><td>Nhận ra ở mọi request, mọi kết nối, mọi địa chỉ</td><td>✅ chạy được — và ai cầm thẻ, người đó <em>là</em> bạn</td></tr>
</tbody>
</table>`;

export default {
  title: '0.1 — A protocol that forgets everything|||0.1 — Một giao thức quên sạch mọi thứ',
  slug: 'auth-0-1-giao-thuc-quen',
  type: 'LESSON',
  isFreePreview: true,
  description: 'HTTP không nhớ request trước, nên mọi sản phẩm phải tự dựng lại danh tính. Bài này chạy thật ba cách "nhớ" người dùng trên LabFlow ID (theo IP: Bình thành An; theo kết nối: quên sau một request; theo thẻ client mang theo: chạy được), rồi vẽ bản đồ cả khoá từ đó.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>A protocol that forgets everything</h2>
<p class="lead">HTTP has no memory. Each request arrives as if it were the first one, from a stranger. Every login system ever built exists to work around that single fact — and almost every authentication bug is a bug in the workaround, not in the login form. In this lesson you run three workarounds on a tiny server and watch two of them fail.</p>

<div class="callout ok">
<p><strong>After this lesson you can:</strong></p>
<ul>
<li>read a raw HTTP request and show that nothing in it says <em>who</em> sent it;</li>
<li>explain, with output you produced, why an IP address or a TCP connection cannot identify a user;</li>
<li>name the one idea every login uses — the client carries proof on every request — and its price;</li>
<li>place every chapter of this course on one map: prove once, present every time, expire eventually.</li>
</ul>
<p><strong>Why it is worth it:</strong> “HTTP is stateless — so how do sessions work?” is a first-round interview question, and the answer is the foundation of every SWP391/SEP490 login you will build.</p>
</div>

<h3>An everyday picture first</h3>
<p>Picture a canteen where the cashier forgets every face the moment you step away. You pay, walk to the counter, and the cook has no idea you paid. The canteen solves it with a <strong>receipt</strong>: you carry a slip, and anyone who holds that slip gets the food. The cook never learns who you are — only that the slip is genuine. Hold that picture: the slip is a cookie, a session id, a token. Losing it means someone else eats your lunch.</p>

<h3>What the server actually receives</h3>
<p>Run <code>demo0/forget.js</code> (LabFlow ID's experiment server for this lesson) and ask it to echo back exactly what arrived:</p>
${ma('javascript', F_RAW)}
${ra(OUT['01-raw'])}
${ra(OUT['01-raw-trinh-duyet'])}
<p>A method, a path, a <code>Host</code>, and whatever headers the client chose to send. The second request claims to be a Windows browser that prefers Vietnamese — and the server cannot check any of it. There is no field called “user”. MDN puts it in one line: <em>“HTTP is stateless: there is no link between two requests being successively carried out on the same connection.”</em></p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Stateless by design</span><span class="lz-t">Not an oversight</span><span class="lz-d">Any server can answer any request — that is what makes load balancers, CDNs and scaling out possible. It is also why the server cannot simply remember you.</span></div>
  <div class="lz-step"><span class="lz-k">Try 1</span><span class="lz-t">The IP address</span><span class="lz-d">Shared by everyone behind the same router; changes when you move.</span></div>
  <div class="lz-step"><span class="lz-k">Try 2</span><span class="lz-t">The TCP connection</span><span class="lz-d">Lives seconds; a proxy carries many users on one.</span></div>
  <div class="lz-step"><span class="lz-k">Try 3</span><span class="lz-t">The client carries proof</span><span class="lz-d">The only one that works — and the start of every problem in this course.</span></div>
</div>

<h3>Try 1 — remember people by IP address</h3>
${ma('javascript', F_IP)}
${ra(OUT['01-ip-an'])}
${ra(OUT['01-ip-binh'])}
${ra(OUT['01-ip-4g'])}
<p>An signs in; the server remembers her address <code>::1</code>. Then Bình asks <code>/ip/me</code> from the same machine and is told she is An. On a real network the same thing happens to everyone behind one router: a dormitory Wi-Fi, a café, a whole mobile carrier. Carriers even have an address block reserved for this sharing — RFC 6598's <code>100.64.0.0/10</code> for Carrier-Grade NAT. The third request is An again, reaching the server through another address (<code>127.0.0.1</code>, as if her laptop moved from Wi-Fi to 4G) — and she is nobody.</p>
<div class="pitfall co-tieu-de">
<p><strong>Trap — IP is a signal, not an identity.</strong> One request proved both failure modes: a stranger got in <em>and</em> the real user was locked out. IP addresses are still useful for <em>risk</em> (“a sign-in from a new country deserves a second look”, rate limits in Chapter 10), never as proof of who someone is.</p>
</div>

<h3>Try 2 — remember people by connection</h3>
${ma('javascript', F_CONN)}
${ra(OUT['01-conn-cung'])}
${ra(OUT['01-conn-moi'])}
<p>The first command makes two requests in one curl run, and curl reuses the connection: the client port is 60295 both times, so the server remembers An. The next command opens a new connection (port 60296) and the memory is gone. Browsers open several connections per site and close idle ones; Node closes an idle keep-alive connection after 5 seconds by default (you will see <code>Keep-Alive: timeout=5</code> in lesson 0.2's output). Worse, a reverse proxy or load balancer in front of your app forwards many users' requests over the same upstream connection — so this design can hand one user's identity to another.</p>

<h3>Try 3 — the client carries proof</h3>
${ma('javascript', F_CARD)}
${ra(OUT['01-card'])}
<p>At sign-in the server hands out a random <strong>card</strong> (16 random bytes, base64url) and remembers which name it belongs to. From then on the client sends the card with every request, in the <code>x-card</code> header; the server looks it up. It works on any connection and from any address; a request without the card gets <code>null</code>. This is the whole trick behind every login on the web. The card is called a <strong>credential</strong>, and in this course it will be a session id in a cookie (Chapter 3) or a signed token (Chapter 4).</p>
${BANG_EN}

<h3>The price of the only design that works</h3>
<p>The server cannot tell who is <em>holding</em> the card. If Bình gets a copy of An's card, the server sees An — the practice below proves it. That property has a name, <strong>bearer credential</strong>, and it shapes everything after this lesson:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Copy = identity</span><span class="v">Whoever holds the credential is you; stealing it is the goal of most attacks in Chapter 10. Lesson 1.1 measures where copies leak.</span></div>
  <div class="kv"><span class="k">The browser sends it for you</span><span class="v">Cookies ride along even on requests another site triggered — the root of CSRF and the reason for SameSite (Chapter 3).</span></div>
  <div class="kv"><span class="k">JavaScript may read it</span><span class="v">A credential in <code>localStorage</code> is readable by any script on the page; lesson 0.3 runs that in Chromium.</span></div>
  <div class="kv"><span class="k">Nothing expires by itself</span><span class="v">Our <code>cards</code> Map keeps every card until the process dies. Expiry and revocation are features you build (Chapters 3 and 5).</span></div>
</div>

<h3>The whole course on one map</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Once — Prove who you are, receive a credential</span><span class="lz-lnote">Password (Ch2), second factor and passkey (Ch7), another provider via OAuth/OIDC (Ch8).</span></div>
  <div class="lz-layer"><span class="lz-lname">Every request — Present the credential, the server verifies it</span><span class="lz-lnote">Session cookie looked up (Ch3) or signed token checked (Ch4), on primitives you build in Ch1; then “may you do this?” (Ch9).</span></div>
  <div class="lz-layer"><span class="lz-lname">Eventually — Expire, rotate, revoke</span><span class="lz-lnote">The half nobody designs until an incident — refresh and rotation (Ch5), account lifecycle (Ch6), running it (Ch11).</span></div>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Trap — “we will add authentication later”.</strong> Authentication decides your data model (who owns a row), your routes (which ones need a user), your caching (per-user responses are not shared) and every test fixture (each test needs a signed-in user). Adding it at the end touches every file that reads data. Decide the shape in week one even if you build it in week four.</p>
</div>

<h3>In interviews / at work</h3>
<ul>
<li><strong>“HTTP is stateless — how do sessions work?”</strong> — The client sends a credential on every request (usually a cookie with a random session id); the server looks it up. State lives on the server or inside a signed token, never in the protocol.</li>
<li><strong>“Why not identify users by IP?”</strong> — Many users share one address (NAT, Carrier-Grade NAT) and one user changes address when moving networks: wrong person and lost person at the same time.</li>
<li><strong>“What is a bearer credential?”</strong> — Presenting it is the proof; there is no second check. So you limit its lifetime and scope and make it revocable.</li>
</ul>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Start <code>node demo0/forget.js</code>. Sign in An through <code>localhost</code> and Bình through <code>127.0.0.1</code> with <code>/card/sign-in</code>, keeping both cards in shell variables.</li>
<li>Ask <code>/card/me</code> with each card from its own address.</li>
<li>Now let Bình (on <code>127.0.0.1</code>) send <strong>An's</strong> card. Predict the answer before you run it.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ra(OUT['01-thuc-hanh'])}
<p>Each card finds its owner, whatever the address. And Bình holding An's card <em>is</em> An — the server has no way to know otherwise. Keep this output in mind; lesson 1.1 starts from it.</p>
<p><strong>Done when:</strong> you can predict all three lines before running them, and explain in one sentence why the third line is <code>An</code>.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">stateless</span><span class="v">Each request is handled on its own; the protocol keeps no memory between requests.</span></div>
  <div class="kv"><span class="k">request header</span><span class="v">A <code>Name: value</code> line the client chooses to send — a claim, not a fact.</span></div>
  <div class="kv"><span class="k">NAT / Carrier-Grade NAT</span><span class="v">Many devices sharing one public IP address; reserved block 100.64.0.0/10 for carriers.</span></div>
  <div class="kv"><span class="k">keep-alive connection</span><span class="v">A TCP connection reused for several requests, closed after an idle timeout.</span></div>
  <div class="kv"><span class="k">credential</span><span class="v">The thing presented as proof on each request: a session id, a token, a key.</span></div>
  <div class="kv"><span class="k">bearer credential</span><span class="v">A credential where holding it is enough: whoever presents it is treated as the owner.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A raw request has a method, a path and headers — nothing says who sent it.</li>
<li>IP addresses identify routers, not people: Bình became An, and An on another address became nobody.</li>
<li>Connections live seconds and proxies mix users: port 60295 remembered, port 60296 forgot.</li>
<li>The design that works: the client carries a random credential on every request, and the server looks it up.</li>
<li>Its price: whoever holds the credential is the user — the subject of Chapter 1.</li>
</ul>
${NGUON_EN}
${lienKet({ khoa: 'api-design', bai: 'api-0-1-http', title: 'Also in API Design — lesson 0.1: the HTTP you actually need', sub: 'Same: a request is a method, a path and headers, read with curl. That lesson teaches HTTP for designing APIs (methods, status codes, headers); this one zooms in on the missing “who” and the three ways to fake it. Each stands on its own.', cta: 'OPEN API DESIGN LESSON →' })}
<a class="link-card lien-ket-cheo" href="/courses/java-web-application-development/learn?lessonSlug=prj301-cookie-session" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">You met this in PRJ301 — Cookies and sessions</span><span class="lc-sub">Same: HTTP remembers nothing; the server keeps the session and the browser carries only its id (JSESSIONID in Tomcat). Different: PRJ301 uses the servlet API; here the code is Node.js and you first watch IP and TCP-connection identity fail on real requests. Not taken PRJ301? This lesson stands on its own.</span></span>
  <span class="lc-cta">OPEN PRJ301 LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Một giao thức quên sạch mọi thứ</h2>
<p class="lead">HTTP không có trí nhớ. Mỗi request tới nơi như thể là request đầu tiên, từ một người lạ. Mọi hệ đăng nhập từng được viết ra đều để lách qua đúng một sự thật đó — và gần như mọi lỗi xác thực là lỗi trong cách lách, chứ không phải trong cái form đăng nhập. Trong bài này bạn chạy ba cách lách trên một máy chủ nhỏ và nhìn hai cách trong số đó thất bại.</p>

<div class="callout ok">
<p><strong>Học xong bài này bạn làm được:</strong></p>
<ul>
<li>đọc một HTTP request thô và chỉ ra rằng không có gì trong đó nói <em>ai</em> gửi nó;</li>
<li>giải thích, bằng output do chính bạn chạy ra, vì sao địa chỉ IP hay kết nối TCP không thể nhận diện người dùng;</li>
<li>gọi tên ý tưởng duy nhất mà mọi kiểu đăng nhập dùng — client mang bằng chứng theo ở mọi request — và cái giá của nó;</li>
<li>đặt mọi chương của khoá lên một tấm bản đồ: chứng minh một lần, trình ra mỗi lần, hết hạn vào lúc nào đó.</li>
</ul>
<p><strong>Vì sao đáng học:</strong> "HTTP phi trạng thái — vậy phiên đăng nhập hoạt động thế nào?" là câu phỏng vấn vòng một, và câu trả lời là nền móng của mọi chức năng đăng nhập bạn sẽ làm trong SWP391/SEP490.</p>
</div>

<h3>Một hình ảnh đời thường trước đã</h3>
<p>Hãy tưởng tượng một căng tin mà cô thu ngân quên mặt bạn ngay khi bạn bước đi. Bạn trả tiền, đi tới quầy lấy món, và chú đầu bếp không biết bạn đã trả. Căng tin giải quyết bằng một <strong>tờ phiếu</strong>: bạn cầm phiếu, ai cầm phiếu thì người đó được lấy món. Đầu bếp không bao giờ biết bạn là ai — chỉ biết tờ phiếu là thật. Giữ hình ảnh đó: tờ phiếu chính là cookie, mã phiên, token. Đánh rơi nó thì người khác ăn bữa trưa của bạn.</p>

<h3>Máy chủ thật sự nhận được gì</h3>
<p>Chạy <code>demo0/forget.js</code> (máy chủ thí nghiệm của LabFlow ID cho bài này) và bảo nó in lại đúng những gì nhận được:</p>
${ma('javascript', F_RAW)}
${ra(OUT['01-raw'])}
${ra(OUT['01-raw-trinh-duyet'])}
<p>Một phương thức, một đường dẫn, một <code>Host</code>, và những header mà client <em>tự chọn</em> gửi. Request thứ hai tự xưng là trình duyệt Windows thích tiếng Việt — và máy chủ không kiểm được điều nào trong đó. Không có trường nào tên là "người dùng". MDN nói gọn một câu: <em>"HTTP is stateless: there is no link between two requests being successively carried out on the same connection."</em></p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Phi trạng thái có chủ đích</span><span class="lz-t">Không phải sơ suất</span><span class="lz-d">Máy chủ nào cũng trả lời được request nào — nhờ vậy mới có cân bằng tải, CDN và mở rộng ngang. Cũng vì vậy mà máy chủ không thể đơn giản là nhớ bạn.</span></div>
  <div class="lz-step"><span class="lz-k">Cách 1</span><span class="lz-t">Địa chỉ IP</span><span class="lz-d">Dùng chung bởi mọi người sau cùng router; đổi khi bạn di chuyển.</span></div>
  <div class="lz-step"><span class="lz-k">Cách 2</span><span class="lz-t">Kết nối TCP</span><span class="lz-d">Sống vài giây; proxy chở nhiều người dùng trên một kết nối.</span></div>
  <div class="lz-step"><span class="lz-k">Cách 3</span><span class="lz-t">Client mang bằng chứng theo</span><span class="lz-d">Cách duy nhất chạy được — và là khởi đầu của mọi vấn đề trong khoá này.</span></div>
</div>

<h3>Cách 1 — nhớ người theo địa chỉ IP</h3>
${ma('javascript', F_IP)}
${ra(OUT['01-ip-an'])}
${ra(OUT['01-ip-binh'])}
${ra(OUT['01-ip-4g'])}
<p>An đăng nhập; máy chủ nhớ địa chỉ <code>::1</code> của An. Rồi Bình hỏi <code>/ip/me</code> từ cùng máy và được bảo mình là An. Trên mạng thật chuyện y hệt xảy ra với mọi người đứng sau một router: Wi-Fi ký túc xá, quán cà phê, cả một nhà mạng di động. Nhà mạng còn có hẳn một dải địa chỉ dành cho kiểu dùng chung này — <code>100.64.0.0/10</code> của RFC 6598 cho Carrier-Grade NAT (NAT cấp nhà mạng). Request thứ ba lại là An, tới máy chủ qua địa chỉ khác (<code>127.0.0.1</code>, như thể laptop chuyển từ Wi-Fi sang 4G) — và An thành người lạ.</p>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — IP là tín hiệu, không phải danh tính.</strong> Một lần chạy đã chứng minh cả hai kiểu hỏng: người lạ vào được <em>và</em> người thật bị chặn ngoài. Địa chỉ IP vẫn có ích cho việc đánh giá <em>rủi ro</em> ("đăng nhập từ một quốc gia mới đáng xem lại", giới hạn tần suất ở Chương 10), nhưng không bao giờ là bằng chứng một người là ai.</p>
</div>

<h3>Cách 2 — nhớ người theo kết nối</h3>
${ma('javascript', F_CONN)}
${ra(OUT['01-conn-cung'])}
${ra(OUT['01-conn-moi'])}
<p>Lệnh đầu gửi hai request trong một lần chạy curl, và curl dùng lại kết nối: cổng phía client là 60295 cả hai lần, nên máy chủ nhớ An. Lệnh sau mở kết nối mới (cổng 60296) và trí nhớ biến mất. Trình duyệt mở nhiều kết nối tới một trang và đóng những kết nối rảnh; Node mặc định đóng kết nối keep-alive rảnh sau 5 giây (bạn sẽ thấy <code>Keep-Alive: timeout=5</code> trong output bài 0.2). Tệ hơn, reverse proxy hay bộ cân bằng tải đứng trước ứng dụng chuyển request của nhiều người qua cùng một kết nối phía sau — nên thiết kế này có thể trao danh tính của người này cho người khác.</p>

<h3>Cách 3 — client mang bằng chứng theo</h3>
${ma('javascript', F_CARD)}
${ra(OUT['01-card'])}
<p>Lúc đăng nhập, máy chủ phát một <strong>tấm thẻ</strong> ngẫu nhiên (16 byte ngẫu nhiên, base64url) và nhớ thẻ đó thuộc về ai. Từ đó client gửi thẻ theo mọi request, trong header <code>x-card</code>; máy chủ tra nó. Cách này chạy trên mọi kết nối, từ mọi địa chỉ; request không có thẻ thì nhận <code>null</code>. Đây là toàn bộ "mẹo" đứng sau mọi kiểu đăng nhập trên web. Tấm thẻ gọi là <strong>credential (tín vật — thứ trình ra làm bằng chứng)</strong>, và trong khoá này nó sẽ là mã phiên trong cookie (Chương 3) hoặc token có chữ ký (Chương 4).</p>
${BANG_VI}

<h3>Cái giá của thiết kế duy nhất chạy được</h3>
<p>Máy chủ không thể biết ai đang <em>cầm</em> tấm thẻ. Nếu Bình có bản sao thẻ của An, máy chủ thấy An — bài thực hành bên dưới chứng minh điều đó. Tính chất này có tên, <strong>bearer credential (tín vật kiểu "ai cầm là người đó")</strong>, và nó định hình mọi thứ sau bài này:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Bản sao = danh tính</span><span class="v">Ai cầm tín vật thì là bạn; đánh cắp nó là mục tiêu của phần lớn các đòn ở Chương 10. Bài 1.1 đo xem bản sao rò ra ở đâu.</span></div>
  <div class="kv"><span class="k">Trình duyệt tự gửi giùm bạn</span><span class="v">Cookie đi kèm cả những request do trang khác gây ra — gốc rễ của CSRF và lý do có SameSite (Chương 3).</span></div>
  <div class="kv"><span class="k">JavaScript có thể đọc được</span><span class="v">Tín vật nằm trong <code>localStorage</code> thì script nào trên trang cũng đọc được; bài 0.3 chạy điều đó trong Chromium.</span></div>
  <div class="kv"><span class="k">Không có gì tự hết hạn</span><span class="v">Map <code>cards</code> của ta giữ mọi thẻ tới khi tiến trình chết. Hết hạn và thu hồi là tính năng bạn phải tự xây (Chương 3 và 5).</span></div>
</div>

<h3>Cả khoá trên một tấm bản đồ</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một lần — Chứng minh bạn là ai, nhận một tín vật</span><span class="lz-lnote">Mật khẩu (Ch2), yếu tố thứ hai và passkey (Ch7), nhà cung cấp khác qua OAuth/OIDC (Ch8).</span></div>
  <div class="lz-layer"><span class="lz-lname">Mỗi request — Trình tín vật, máy chủ kiểm nó</span><span class="lz-lnote">Tra cookie phiên (Ch3) hoặc kiểm token có chữ ký (Ch4), trên các nguyên hàm bạn dựng ở Ch1; rồi "bạn có được làm việc này không?" (Ch9).</span></div>
  <div class="lz-layer"><span class="lz-lname">Vào lúc nào đó — Hết hạn, xoay vòng, thu hồi</span><span class="lz-lnote">Nửa mà chẳng ai thiết kế cho tới khi có sự cố — refresh và xoay vòng (Ch5), vòng đời tài khoản (Ch6), vận hành (Ch11).</span></div>
</div>
<div class="pitfall co-tieu-de">
<p><strong>Bẫy — "để sau rồi thêm đăng nhập".</strong> Xác thực quyết định mô hình dữ liệu (dòng nào của ai), các route (route nào cần người dùng), cache (phản hồi riêng từng người không dùng chung được) và mọi dữ liệu test (test nào cũng cần một người đã đăng nhập). Thêm nó vào cuối là động vào mọi tệp có đọc dữ liệu. Hãy chốt hình dạng ngay tuần đầu, dù tuần thứ tư mới dựng.</p>
</div>

<h3>Khi phỏng vấn / khi đi làm</h3>
<ul>
<li><strong>"HTTP phi trạng thái — vậy phiên hoạt động thế nào?"</strong> — Client gửi một tín vật ở mọi request (thường là cookie chứa mã phiên ngẫu nhiên); máy chủ tra nó. Trạng thái nằm ở máy chủ hoặc trong một token có chữ ký, không bao giờ nằm trong giao thức.</li>
<li><strong>"Sao không nhận diện người dùng theo IP?"</strong> — Nhiều người dùng chung một địa chỉ (NAT, Carrier-Grade NAT) và một người đổi địa chỉ khi đổi mạng: nhận nhầm người và mất người cùng lúc.</li>
<li><strong>"Bearer credential là gì?"</strong> — Trình nó ra chính là bằng chứng; không có bước kiểm thứ hai. Nên phải giới hạn thời gian sống, phạm vi, và thu hồi được.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Bật <code>node demo0/forget.js</code>. Đăng nhập An qua <code>localhost</code> và Bình qua <code>127.0.0.1</code> bằng <code>/card/sign-in</code>, giữ hai thẻ trong biến shell.</li>
<li>Hỏi <code>/card/me</code> với từng thẻ từ đúng địa chỉ của nó.</li>
<li>Giờ cho Bình (ở <code>127.0.0.1</code>) gửi thẻ <strong>của An</strong>. Đoán trước kết quả rồi hãy chạy.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ra(OUT['01-thuc-hanh'])}
<p>Mỗi thẻ tìm đúng chủ, bất kể địa chỉ. Và Bình cầm thẻ của An thì <em>là</em> An — máy chủ không có cách nào biết khác đi. Hãy nhớ output này; bài 1.1 bắt đầu từ đây.</p>
<p><strong>Đạt khi:</strong> bạn đoán trúng cả ba dòng trước khi chạy, và giải thích được bằng một câu vì sao dòng thứ ba là <code>An</code>.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">stateless (phi trạng thái)</span><span class="v">Mỗi request được xử lý riêng; giao thức không giữ trí nhớ giữa các request.</span></div>
  <div class="kv"><span class="k">request header (header của request)</span><span class="v">Một dòng <code>Tên: giá trị</code> mà client tự chọn gửi — một lời tự xưng, không phải sự thật.</span></div>
  <div class="kv"><span class="k">NAT / Carrier-Grade NAT (NAT cấp nhà mạng)</span><span class="v">Nhiều thiết bị dùng chung một địa chỉ IP công khai; dải 100.64.0.0/10 dành cho nhà mạng.</span></div>
  <div class="kv"><span class="k">keep-alive connection (kết nối giữ sống)</span><span class="v">Kết nối TCP được dùng lại cho nhiều request, đóng sau một khoảng rảnh.</span></div>
  <div class="kv"><span class="k">credential (tín vật)</span><span class="v">Thứ được trình ra làm bằng chứng ở mỗi request: mã phiên, token, khoá.</span></div>
  <div class="kv"><span class="k">bearer credential (tín vật "ai cầm là người đó")</span><span class="v">Tín vật mà chỉ cần cầm là đủ: ai trình ra thì được coi là chủ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Request thô có phương thức, đường dẫn và header — không có gì nói ai gửi nó.</li>
<li>Địa chỉ IP nhận diện router, không nhận diện người: Bình thành An, còn An ở địa chỉ khác thành người lạ.</li>
<li>Kết nối sống vài giây và proxy trộn người dùng: cổng 60295 thì nhớ, cổng 60296 thì quên.</li>
<li>Thiết kế chạy được: client mang một tín vật ngẫu nhiên ở mọi request, máy chủ tra nó.</li>
<li>Cái giá: ai cầm tín vật thì là người dùng — chủ đề của Chương 1.</li>
</ul>
${NGUON_VI}
${lienKet({ khoa: 'api-design', bai: 'api-0-1-http', title: 'Cũng có ở API Design — bài 0.1: HTTP bạn thật sự cần', sub: 'Giống: một request là phương thức, đường dẫn và header, đọc bằng curl. Bài đó dạy HTTP để thiết kế API (phương thức, mã trạng thái, header); bài này soi vào chữ "ai" bị thiếu và ba cách làm giả nó. Mỗi bài tự đứng được.', cta: 'MỞ BÀI API DESIGN →' })}
<a class="link-card lien-ket-cheo" href="/courses/java-web-application-development/learn?lessonSlug=prj301-cookie-session" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Đã gặp ở PRJ301 — Cookie và session</span><span class="lc-sub">Giống: HTTP không nhớ gì; server giữ phiên, trình duyệt chỉ mang id của nó (JSESSIONID trong Tomcat). Khác: PRJ301 dùng servlet API; ở đây code là Node.js và bạn xem nhận diện theo IP và theo kết nối TCP hỏng trên request thật trước. Chưa học PRJ301? Bài này vẫn tự đứng được.</span></span>
  <span class="lc-cta">MỞ BÀI PRJ301 →</span>
</a>
</div>
`,
};
