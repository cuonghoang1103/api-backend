/**
 * Web Foundations — Chương 7: Xác thực & bảo mật (authentication vs authorization,
 * cookie/session, JWT, mật khẩu/hash/salt/bcrypt, HTTPS/CORS). Chương nền cho
 * middleware auth của NODE.JS/Express. Song ngữ EN/VI (.ml-en / .ml-vi, số khối bằng
 * nhau). ⚠️ KHÔNG backtick trần trong content (dùng &#96;); `${` trong code escape
 * thành \${. Quiz có field content.
 */

export default {
  title: 'Chapter 7 — Authentication & security|||Chương 7 — Xác thực & bảo mật',
  description: 'Chương 6 cho thấy HTTP không lưu trạng thái — server quên bạn ngay sau mỗi yêu cầu. Chương 7 giải bài toán đó: authentication vs authorization, cookie và session, JWT và Authorization: Bearer, cách mật khẩu phải được hash và salt (không bao giờ lưu thô), và HTTPS/CORS — hai lớp bảo vệ khác nhau mà mọi API thật đều cần.',
  lessons: [
    /* ─────────────────────────── 7.1 ─────────────────────────── */
    {
      title: '7.1 — Authentication vs authorization|||7.1 — Xác thực vs phân quyền',
      slug: 'wf-7-1-auth-basics',
      type: 'VIDEO',
      isFreePreview: true,
      video: { url: 'https://youtu.be/2PPSXonhIck', durationSeconds: 0 },
      description: 'Xác thực (bạn là ai) khác phân quyền (bạn được làm gì); bài toán đăng nhập trên một giao thức không nhớ gì; vì sao danh tính phải đi kèm mỗi yêu cầu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Authentication answers "who are you?"; authorization answers "what can you do?"</h2>
<p class="lead">These two words get used interchangeably in casual speech, but they are different jobs, often done by different code. Keep them separate and every login/permissions bug becomes easier to reason about.</p>

<h3>Two different questions</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Authentication (AuthN)</span><span class="v">Proving who you are. Typing a username/password and the server confirming it is really you.</span></div>
  <div class="kv"><span class="k">Authorization (AuthZ)</span><span class="v">Deciding what you are allowed to do, once you are known. A regular user vs an admin see different things.</span></div>
</div>
<p>Think of a building: showing your ID badge at the door is authentication. The badge only opening the floors you are cleared for is authorization. You can be authenticated (a real employee) and still be unauthorized (not cleared for the server room).</p>

<h3>Why this needs a whole chapter: HTTP forgets you</h3>
<p>You learned in Chapter 6 that <strong>HTTP is stateless</strong> — the server treats every request as if it has never seen you before. Imagine a login without a fix for this:</p>
<pre><code>Request 1: POST /login { "email": "...", "password": "..." }
Response 1: 200 OK — "welcome, Lan!"

Request 2: GET /profile
Response 2: 401 Unauthorized — "...who?"</code></pre>
<p>The server verified your password on request 1, then instantly forgot everything. Without a fix, you would have to log in again before every single click. Real apps obviously do not work this way — so something must carry your identity forward.</p>

<h3>The general fix: identity rides on every request</h3>
<p>Every solution to this problem follows the same shape: after login, the client receives <em>something</em> that proves "this is still Lan," and it attaches that something to every later request. Two concrete versions of "something" exist, and you will learn both:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Session + cookie</span><span class="v">The server remembers you (a session), the browser reminds it who you are (a cookie). Lesson 7.2.</span></div>
  <div class="kv"><span class="k">Token (JWT)</span><span class="v">The server does not remember anything — your proof of identity is self-contained in a signed token you send yourself. Lesson 7.3.</span></div>
</div>

<p class="pitfall"><strong>"I logged in, so I'm logged in" is not how HTTP works.</strong> A beginner mistake is assuming the server keeps a memory of you by default. It does not — every request must re-prove identity, one way or another. If you ever see a 401 right after a successful login, this is almost always why: the follow-up request forgot to attach the cookie/token.</p>

<p class="note-ct"><strong>You already met the header that will carry this.</strong> Chapter 6 showed <code>Authorization: Bearer &lt;token&gt;</code> as one of the common headers, and Chapter 6 also covered <code>401 Unauthorized</code> vs <code>403 Forbidden</code> — that pair maps exactly onto authentication vs authorization. In your future Node.js/Express backend, this whole chapter becomes one thing: <strong>auth middleware</strong> that runs before your routes and checks "who is this?" (401 if unknown) then "are they allowed here?" (403 if not).</p>
<h3>Authentication and authorisation are two questions</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Authentication</span><span class="lz-t">Who are you?</span><span class="lz-d">Answered once, at login, by checking something only that person has: a password, a code from their phone, a passkey on their device.</span></div>
<div class="lz-layer"><span class="lz-k">Session or token</span><span class="lz-t">Proof, carried forward</span><span class="lz-d">HTTP forgets everything between requests, so the answer has to travel with each one — as a cookie or an <code>Authorization</code> header.</span></div>
<div class="lz-layer"><span class="lz-k">Authorisation</span><span class="lz-t">May you do this?</span><span class="lz-d">Answered on <em>every</em> request, for <em>every</em> resource. Being logged in says nothing about whether note 13 is yours.</span></div>
<div class="lz-layer"><span class="lz-k">401 vs 403</span><span class="lz-t">The two failures</span><span class="lz-d">401 means "I do not know who you are" — log in. 403 means "I know exactly who you are, and no". Mixing them up confuses the client.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — checking permission in the user interface instead of on the server.</strong> Hiding the Delete button from non-admins feels like access control, and it is not: the endpoint is still there, and anyone can call it with <code>curl</code>, from DevTools, or by replaying a request they saw once. The UI check is a courtesy — it stops honest users from doing something they will be told off for. The real check lives in the handler, before anything is written. A useful test while building: for every button you hide, ask "what happens if someone calls this endpoint anyway?" If you do not know, that is the next thing to fix.</p></div>
<div class="link-card"><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" target="_blank" rel="noopener">OWASP Authentication Cheat Sheet — the practical checklist</a></div>
<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication" target="_blank" rel="noopener">MDN — HTTP authentication, 401 vs 403</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Xác thực trả lời "bạn là ai?"; phân quyền trả lời "bạn được làm gì?"</h2>
<p class="lead">Hai từ này hay bị dùng lẫn lộn trong nói chuyện thường ngày, nhưng chúng là hai việc khác nhau, thường do những đoạn code khác nhau đảm nhiệm. Tách bạch chúng ra thì mọi lỗi đăng nhập/phân quyền đều dễ suy luận hơn.</p>

<h3>Hai câu hỏi khác nhau</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Xác thực (Authentication)</span><span class="v">Chứng minh bạn là ai. Gõ username/password và server xác nhận đúng là bạn.</span></div>
  <div class="kv"><span class="k">Phân quyền (Authorization)</span><span class="v">Quyết định bạn được phép làm gì, một khi đã biết bạn là ai. Người dùng thường vs admin thấy những thứ khác nhau.</span></div>
</div>
<p>Hãy tưởng tượng một toà nhà: đưa thẻ ID ở cửa là xác thực. Thẻ đó chỉ mở được những tầng bạn được cấp quyền là phân quyền. Bạn có thể đã xác thực (đúng là nhân viên thật) nhưng vẫn không được phân quyền (không được vào phòng máy chủ).</p>

<h3>Vì sao cần cả một chương: HTTP quên bạn</h3>
<p>Bạn đã học ở Chương 6 rằng <strong>HTTP không lưu trạng thái</strong> — server xử lý mỗi yêu cầu như thể chưa từng gặp bạn bao giờ. Hãy tưởng tượng một luồng đăng nhập không có cách khắc phục điều này:</p>
<pre><code>Yêu cầu 1: POST /login { "email": "...", "password": "..." }
Phản hồi 1: 200 OK — "chào mừng, Lan!"

Yêu cầu 2: GET /profile
Phản hồi 2: 401 Unauthorized — "...ai cơ?"</code></pre>
<p>Server đã xác minh mật khẩu bạn ở yêu cầu 1, rồi quên sạch ngay lập tức. Không có cách khắc phục, bạn sẽ phải đăng nhập lại trước mỗi cú click. App thật rõ ràng không hoạt động kiểu này — nên phải có gì đó mang danh tính bạn đi tiếp.</p>

<h3>Cách khắc phục chung: danh tính đi kèm mỗi yêu cầu</h3>
<p>Mọi lời giải cho bài toán này đều theo cùng một hình dạng: sau khi đăng nhập, client nhận được <em>một thứ gì đó</em> chứng minh "đây vẫn là Lan," và đính kèm thứ đó vào mọi yêu cầu sau. Có hai phiên bản cụ thể của "thứ gì đó," và bạn sẽ học cả hai:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Session + cookie</span><span class="v">Server nhớ bạn (một session), trình duyệt nhắc server bạn là ai (một cookie). Bài 7.2.</span></div>
  <div class="kv"><span class="k">Token (JWT)</span><span class="v">Server không nhớ gì cả — bằng chứng danh tính của bạn tự chứa trong một token đã ký mà bạn tự gửi đi. Bài 7.3.</span></div>
</div>

<p class="pitfall"><strong>"Tôi đã đăng nhập rồi, nên tôi đang đăng nhập" không phải cách HTTP hoạt động.</strong> Một sai lầm của người mới là nghĩ server mặc định giữ ký ức về bạn. Không hề — mọi yêu cầu đều phải chứng minh lại danh tính, bằng cách này hay cách khác. Nếu bạn từng thấy 401 ngay sau khi đăng nhập thành công, gần như luôn là vì lý do này: yêu cầu tiếp theo quên đính kèm cookie/token.</p>

<p class="note-ct"><strong>Bạn đã gặp header sẽ mang thứ này rồi.</strong> Chương 6 cho thấy <code>Authorization: Bearer &lt;token&gt;</code> là một trong các header thường gặp, và Chương 6 cũng nói về <code>401 Unauthorized</code> vs <code>403 Forbidden</code> — cặp đó ánh xạ đúng vào xác thực vs phân quyền. Trong backend Node.js/Express tương lai của bạn, cả chương này trở thành một thứ: <strong>auth middleware</strong> chạy trước route của bạn, kiểm "đây là ai?" (401 nếu không rõ) rồi "họ có được phép ở đây không?" (403 nếu không).</p>
<h3>Xác thực và phân quyền là hai câu hỏi khác nhau</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Xác thực</span><span class="lz-t">Bạn là ai?</span><span class="lz-d">Trả lời một lần, lúc đăng nhập, bằng cách kiểm một thứ chỉ người đó có: mật khẩu, một mã từ điện thoại, một passkey trên thiết bị.</span></div>
<div class="lz-layer"><span class="lz-k">Phiên hoặc token</span><span class="lz-t">Bằng chứng, mang theo về sau</span><span class="lz-d">HTTP quên sạch giữa các request, nên câu trả lời phải đi kèm từng cái — dưới dạng cookie hoặc header <code>Authorization</code>.</span></div>
<div class="lz-layer"><span class="lz-k">Phân quyền</span><span class="lz-t">Bạn có được làm việc này không?</span><span class="lz-d">Trả lời ở <em>mọi</em> request, cho <em>mọi</em> tài nguyên. Đăng nhập rồi chẳng nói gì về việc ghi chú 13 có phải của bạn không.</span></div>
<div class="lz-layer"><span class="lz-k">401 với 403</span><span class="lz-t">Hai kiểu thất bại</span><span class="lz-d">401 nghĩa là "tôi không biết bạn là ai" — hãy đăng nhập. 403 nghĩa là "tôi biết chính xác bạn là ai, và không". Lẫn lộn hai cái làm client bối rối.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — kiểm quyền ở giao diện thay vì ở máy chủ.</strong> Giấu cái nút Xoá khỏi người không phải quản trị viên thì nghe như kiểm soát truy cập, mà không phải: cái endpoint vẫn nằm đó, và ai cũng gọi được bằng <code>curl</code>, từ DevTools, hoặc bằng cách phát lại một request họ từng thấy. Phép kiểm ở giao diện là một cử chỉ lịch sự — nó ngăn người dùng ngay thẳng khỏi làm điều sẽ bị mắng. Phép kiểm thật sống trong handler, trước khi có gì được ghi. Một phép thử hữu ích lúc đang dựng: với mỗi cái nút bạn giấu đi, hãy hỏi "nếu có người cứ gọi endpoint này thì sao?". Nếu bạn không biết, đó là thứ tiếp theo cần sửa.</p></div>
<div class="link-card"><a href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" target="_blank" rel="noopener">OWASP Authentication Cheat Sheet — bản kiểm thực dụng</a></div>
<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication" target="_blank" rel="noopener">MDN — Xác thực HTTP, 401 với 403</a></div>
</div>
`,
    },

    /* ─────────────────────────── 7.2 ─────────────────────────── */
    {
      title: '7.2 — Cookies & sessions|||7.2 — Cookie & session',
      slug: 'wf-7-2-cookies-sessions',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/GihQAC1I39Q', durationSeconds: 0 },
      description: 'Cookie được server đặt và trình duyệt tự gửi lại; session id lưu phía server; cookie khác localStorage/sessionStorage; cờ HttpOnly/Secure/SameSite.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>The oldest fix: the server remembers you, a cookie reminds it who you are</h2>
<p class="lead">A <strong>session</strong> means the server keeps a small record — "this session id belongs to user 42" — in memory or a database. A <strong>cookie</strong> is a small piece of text the browser stores and re-sends automatically, so the server can look that session id back up on every request.</p>

<h3>How a cookie gets set and sent — automatically</h3>
<pre><code>1) You log in:
   POST /login
   ← response header: Set-Cookie: sessionId=abc123; HttpOnly; Secure

2) Browser stores "sessionId=abc123" for this site.

3) Every later request to the same site, the browser adds it BY ITSELF:
   GET /profile
   → request header: Cookie: sessionId=abc123

4) Server looks up "abc123" in its session store → finds "user 42" → knows who you are.</code></pre>
<p>You never write code to re-send the cookie — that automatic re-attachment on every request to the matching domain is the entire point of cookies, and exactly what solves the "HTTP forgets you" problem from Lesson 7.1.</p>

<h3>Cookies vs localStorage vs sessionStorage</h3>
<p>All three store small bits of data in the browser, but only one of them is sent automatically with requests — a distinction that matters a lot for auth:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cookie</span><span class="v">Sent automatically with every matching request. Can be hidden from JavaScript (HttpOnly, below). Small (~4KB).</span></div>
  <div class="kv"><span class="k">localStorage</span><span class="v">NOT sent automatically — only your own JS can read/send it. Persists even after the browser closes.</span></div>
  <div class="kv"><span class="k">sessionStorage</span><span class="v">NOT sent automatically either. Cleared when the tab closes.</span></div>
</div>

<h3>The flags that make a cookie safe</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HttpOnly</span><span class="v">JavaScript on the page cannot read this cookie at all — only the browser's network layer can. Blocks theft via a malicious script.</span></div>
  <div class="kv"><span class="k">Secure</span><span class="v">The cookie is only ever sent over HTTPS, never plain HTTP. See Lesson 7.5.</span></div>
  <div class="kv"><span class="k">SameSite</span><span class="v">Strict/Lax/None — controls whether the cookie is sent on requests coming FROM another site, limiting a class of attacks.</span></div>
</div>

<p class="pitfall"><strong>Storing a login token in localStorage feels convenient — and is a real security weakness.</strong> Any JavaScript that runs on your page (including a malicious script sneaked in through a dependency or an XSS bug) can read localStorage and steal it. A <code>HttpOnly</code> cookie is invisible to JavaScript entirely, so it survives that exact attack. This is why session cookies are still the default choice for traditional logged-in websites.</p>

<p class="note-ct"><strong>Forward reference:</strong> sessions are not the only fix. Lesson 7.3 covers <strong>tokens (JWT)</strong> — a fix where the server does not need to remember anything at all. In Node.js/Express, the session approach is exactly what libraries like <code>express-session</code> implement: they set the cookie for you and store the session server-side (in memory for dev, in Redis/a database for production).</p>
<h3>The four cookie flags that matter</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">HttpOnly</span><span class="lz-t">JavaScript cannot read it</span><span class="lz-d">The single most valuable flag for a session cookie: it means an XSS bug cannot simply steal the session and post it elsewhere.</span></div>
<div class="lz-node"><span class="lz-k">Secure</span><span class="lz-t">HTTPS only</span><span class="lz-d">Without it, one plain-HTTP request on a café network hands the cookie to whoever is listening. Set it everywhere except localhost.</span></div>
<div class="lz-node"><span class="lz-k">SameSite</span><span class="lz-t">Not sent from other sites</span><span class="lz-d"><code>Lax</code> is a sensible default and blocks most CSRF; <code>Strict</code> is safer and logs users out when they arrive from a link.</span></div>
<div class="lz-node"><span class="lz-k">Max-Age / Expires</span><span class="lz-t">How long it survives</span><span class="lz-d">No value means the cookie dies with the browser tab. A long value is convenience bought with risk on shared machines.</span></div>
</div>
<pre><code>res.cookie('sid', id, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 days
});</code></pre>
<div class="pitfall"><p><strong>Trap — a cookie lifetime that outlives the session it points at.</strong> Set the cookie to seven days and the server-side session (or the token inside it) to twenty-four hours, and on day two every request arrives <em>with</em> a cookie that is no longer valid. The user is not logged out — the browser still sends it, so the app looks logged in — but every API call returns 401, and the symptom is "the site is broken", not "please log in". This exact mismatch is recorded in this repo's own history: a 24-hour JWT under a 7-day cookie, with no working refresh endpoint, so sessions died silently after a day. Keep the two numbers in one place, and implement refresh before you extend either.</p></div>
<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" target="_blank" rel="noopener">MDN — Using HTTP cookies, every flag explained</a></div>
<div class="link-card"><a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" target="_blank" rel="noopener">OWASP Session Management Cheat Sheet</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Cách khắc phục cổ nhất: server nhớ bạn, một cookie nhắc nó bạn là ai</h2>
<p class="lead">Một <strong>session</strong> nghĩa là server giữ một bản ghi nhỏ — "session id này thuộc về user 42" — trong bộ nhớ hoặc một cơ sở dữ liệu. Một <strong>cookie</strong> là một mẩu văn bản nhỏ mà trình duyệt lưu và tự gửi lại, để server tra lại session id đó ở mỗi yêu cầu.</p>

<h3>Cookie được đặt và gửi ra sao — hoàn toàn tự động</h3>
<pre><code>1) Bạn đăng nhập:
   POST /login
   ← header phản hồi: Set-Cookie: sessionId=abc123; HttpOnly; Secure

2) Trình duyệt lưu "sessionId=abc123" cho trang này.

3) Mọi yêu cầu sau tới cùng trang, trình duyệt TỰ THÊM vào:
   GET /profile
   → header yêu cầu: Cookie: sessionId=abc123

4) Server tra "abc123" trong kho session → tìm ra "user 42" → biết bạn là ai.</code></pre>
<p>Bạn không bao giờ phải viết code để gửi lại cookie — việc tự động đính kèm ở mọi yêu cầu tới đúng domain đó chính là toàn bộ mục đích của cookie, và đúng là cách giải bài toán "HTTP quên bạn" ở Bài 7.1.</p>

<h3>Cookie vs localStorage vs sessionStorage</h3>
<p>Cả ba đều lưu dữ liệu nhỏ trong trình duyệt, nhưng chỉ một trong số đó được tự động gửi kèm yêu cầu — một khác biệt rất quan trọng cho việc xác thực:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cookie</span><span class="v">Tự động gửi kèm mọi yêu cầu khớp domain. Có thể ẩn khỏi JavaScript (HttpOnly, bên dưới). Nhỏ (~4KB).</span></div>
  <div class="kv"><span class="k">localStorage</span><span class="v">KHÔNG tự động gửi — chỉ JS của chính bạn mới đọc/gửi được. Còn tồn tại kể cả sau khi đóng trình duyệt.</span></div>
  <div class="kv"><span class="k">sessionStorage</span><span class="v">Cũng KHÔNG tự động gửi. Bị xoá khi đóng tab.</span></div>
</div>

<h3>Các cờ khiến một cookie an toàn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">HttpOnly</span><span class="v">JavaScript trên trang hoàn toàn không đọc được cookie này — chỉ tầng mạng của trình duyệt mới đọc. Chặn việc bị đánh cắp qua một script độc hại.</span></div>
  <div class="kv"><span class="k">Secure</span><span class="v">Cookie chỉ được gửi qua HTTPS, không bao giờ qua HTTP thường. Xem Bài 7.5.</span></div>
  <div class="kv"><span class="k">SameSite</span><span class="v">Strict/Lax/None — kiểm soát cookie có được gửi trên yêu cầu ĐẾN TỪ trang khác hay không, hạn chế một lớp tấn công.</span></div>
</div>

<p class="pitfall"><strong>Lưu token đăng nhập trong localStorage nghe tiện — và là một điểm yếu bảo mật thật.</strong> Bất kỳ JavaScript nào chạy trên trang bạn (kể cả một script độc hại lẻn vào qua một dependency hay lỗi XSS) đều đọc được localStorage và đánh cắp nó. Một cookie <code>HttpOnly</code> hoàn toàn vô hình với JavaScript, nên nó sống sót đúng kiểu tấn công đó. Đây là lý do session cookie vẫn là lựa chọn mặc định cho các website đăng nhập truyền thống.</p>

<p class="note-ct"><strong>Tham chiếu tới:</strong> session không phải cách khắc phục duy nhất. Bài 7.3 nói về <strong>token (JWT)</strong> — một cách khắc phục mà server không cần nhớ gì cả. Trong Node.js/Express, cách tiếp cận session chính là những gì thư viện như <code>express-session</code> hiện thực: chúng đặt cookie giúp bạn và lưu session phía server (trong bộ nhớ khi phát triển, trong Redis/cơ sở dữ liệu khi production).</p>
<h3>Bốn cờ cookie có ý nghĩa</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">HttpOnly</span><span class="lz-t">JavaScript không đọc được</span><span class="lz-d">Cờ giá trị nhất cho một cookie phiên: nó nghĩa là một lỗ hổng XSS không thể chỉ việc lấy cắp phiên rồi gửi đi nơi khác.</span></div>
<div class="lz-node"><span class="lz-k">Secure</span><span class="lz-t">Chỉ đi qua HTTPS</span><span class="lz-d">Không có nó, một request HTTP trần trong mạng quán cà phê là trao cookie cho bất kỳ ai đang nghe. Hãy bật ở mọi nơi trừ localhost.</span></div>
<div class="lz-node"><span class="lz-k">SameSite</span><span class="lz-t">Không gửi từ trang khác</span><span class="lz-d"><code>Lax</code> là mặc định hợp lý và chặn được phần lớn CSRF; <code>Strict</code> an toàn hơn nhưng làm người dùng bị đăng xuất khi họ tới từ một liên kết.</span></div>
<div class="lz-node"><span class="lz-k">Max-Age / Expires</span><span class="lz-t">Nó sống bao lâu</span><span class="lz-d">Không đặt giá trị thì cookie chết theo tab trình duyệt. Đặt dài là mua sự tiện lợi bằng rủi ro trên máy dùng chung.</span></div>
</div>
<pre><code>res.cookie('sid', id, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,   // 7 ngày
});</code></pre>
<div class="pitfall"><p><strong>Bẫy — tuổi thọ cookie dài hơn cái phiên mà nó trỏ tới.</strong> Đặt cookie bảy ngày còn phiên phía máy chủ (hoặc token bên trong nó) hai mươi tư giờ, thì sang ngày thứ hai mọi request đều tới <em>kèm</em> một cookie không còn hợp lệ. Người dùng không hề bị đăng xuất — trình duyệt vẫn gửi nó, nên ứng dụng trông như đã đăng nhập — nhưng mọi lời gọi API đều trả 401, và triệu chứng là "trang hỏng rồi", chứ không phải "mời đăng nhập". Đúng cái lệch này có trong lịch sử của chính kho này: một JWT 24 giờ dưới một cookie 7 ngày, mà không có endpoint làm mới nào chạy được, nên phiên chết lặng lẽ sau một ngày. Hãy giữ hai con số đó ở một chỗ, và làm phần làm-mới trước khi kéo dài bất kỳ cái nào.</p></div>
<div class="link-card"><a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies" target="_blank" rel="noopener">MDN — Dùng cookie HTTP, giải thích từng cờ</a></div>
<div class="link-card"><a href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" target="_blank" rel="noopener">OWASP Session Management Cheat Sheet</a></div>
</div>
`,
    },

    /* ─────────────────────────── 7.3 ─────────────────────────── */
    {
      title: '7.3 — Tokens & JWT|||7.3 — Token & JWT',
      slug: 'wf-7-3-jwt',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/7Q17ubqLfaM', durationSeconds: 0 },
      description: 'JWT là gì (header.payload.signature), xác thực không trạng thái, Authorization: Bearer, vì sao chữ ký quan trọng, không bao giờ để bí mật trong payload (chỉ base64, không mã hoá).',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>A token that proves itself, without the server remembering anything</h2>
<p class="lead">A <strong>JWT</strong> (JSON Web Token, said "jot") is a different fix to the same problem from Lesson 7.1: instead of the server keeping a session record and the cookie just pointing at it, a JWT carries the proof of identity <em>inside itself</em>. The server does not have to store or look up anything — it just checks the token is genuine.</p>

<h3>Three parts, separated by dots</h3>
<pre><code>eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjoidXNlciJ9.4f8a91c2b6d0e...
└──────header───────┘└────────────payload────────────────┘└──signature──┘</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Header</span><span class="v">Metadata: which algorithm was used to sign this token.</span></div>
  <div class="kv"><span class="k">Payload (claims)</span><span class="v">The actual data: userId, role, an expiry time. This is what &#96;req.user&#96; becomes on your server.</span></div>
  <div class="kv"><span class="k">Signature</span><span class="v">A hash of (header + payload + a secret key only the server knows). Proves nobody tampered with the token.</span></div>
</div>

<h3>Stateless auth — no lookup required</h3>
<p>Compare this to the session flow from Lesson 7.2: with sessions, the server had to look up "abc123" in a store on every request. With a JWT, the server just re-computes the signature using its secret key and checks it matches. If it matches, the payload can be trusted — no database round trip. That is what "stateless auth" means, and it is why JWT scales well across many servers.</p>

<h3>Sending it: Authorization: Bearer</h3>
<pre><code>GET /profile
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQyfQ.4f8a91c2...</code></pre>
<p>Unlike a cookie, a JWT is NOT sent automatically — your client-side code must explicitly attach it to the <code>Authorization</code> header on every request (you saw this header back in Chapter 6, Lesson 6.4).</p>

<h3>Why the signature matters</h3>
<p>Without a signature, anyone could write &#96;{ "userId": 1, "role": "admin" }&#96;, paste it into a token shape, and pretend to be an admin. The signature is what stops that: it can only be produced by someone who has the server's secret key, so the server can detect if even one character of the payload was changed.</p>

<p class="pitfall"><strong>A JWT's payload is base64-encoded, NOT encrypted — never put secrets in it.</strong> Anyone can copy the middle part of a JWT and decode it in two seconds with zero tools; it is not scrambled, just re-formatted. A password, a credit card number, or anything sensitive in the payload is effectively public. Only put non-secret identity data there (user id, role, expiry) and let the signature guarantee it was not forged.</p>

<p class="note-ct"><strong>Node.js preview:</strong> your Express backend will use a library like <code>jsonwebtoken</code> to sign a token at login (&#96;jwt.sign(payload, secret)&#96;) and an auth middleware that runs <code>jwt.verify(token, secret)</code> on every protected route — throwing a <strong>401</strong> (Chapter 6) if the token is missing or the signature does not check out, before your route handler ever runs.</p>
<h3>What is actually inside a JWT</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Header — the algorithm</span><span class="lz-d">Base64url text, not encryption. Says how the signature was made, e.g. <code>HS256</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Payload — the claims</span><span class="lz-d">Also base64url. <code>sub</code> (who), <code>exp</code> (until when), plus whatever you add. Anyone holding the token can read all of it.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Signature — the only secret part</span><span class="lz-d">A hash of the first two pieces plus your server's key. It proves the payload was not edited; it does not hide anything.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Verification is the whole point</span><span class="lz-d">Decoding a token is trivial and proves nothing. Only <em>verifying</em> the signature — with your key, on the server — makes the claims trustworthy.</span></div>
</div>
<div class="out">$ echo 'eyJzdWIiOiIxMiIsInJvbGUiOiJhZG1pbiJ9' | base64 -d
{"sub":"12","role":"admin"}</div>
<div class="pitfall"><p><strong>Trap — putting anything private in a JWT payload, or believing a token can be cancelled.</strong> Base64 is not encryption; as the command above shows, anyone with the token reads every claim in it — so an email address, a phone number or an internal user note is effectively published to whoever holds it, including any script that can reach browser storage. The second half is worse: a signed token stays valid until <code>exp</code>, so "log out everywhere" and "ban this account" do not work by themselves. Keep access tokens short-lived (minutes), pair them with a refresh token you can revoke server-side, and keep a deny-list for the cases that cannot wait.</p></div>
<div class="link-card"><a href="https://jwt.io/" target="_blank" rel="noopener">jwt.io — paste a token, see exactly what is inside it</a></div>
<div class="link-card"><a href="https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html" target="_blank" rel="noopener">OWASP — JWT pitfalls and how to avoid them</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Một token tự chứng minh, không cần server nhớ gì cả</h2>
<p class="lead">Một <strong>JWT</strong> (JSON Web Token, đọc "jot") là một cách khắc phục khác cho cùng bài toán ở Bài 7.1: thay vì server giữ một bản ghi session và cookie chỉ trỏ vào đó, một JWT mang bằng chứng danh tính <em>ngay bên trong chính nó</em>. Server không cần lưu hay tra cứu gì — nó chỉ kiểm token có thật hay không.</p>

<h3>Ba phần, ngăn bởi dấu chấm</h3>
<pre><code>eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQyLCJyb2xlIjoidXNlciJ9.4f8a91c2b6d0e...
└──────header───────┘└────────────payload────────────────┘└──signature──┘</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Header</span><span class="v">Siêu dữ liệu: thuật toán nào được dùng để ký token này.</span></div>
  <div class="kv"><span class="k">Payload (claims)</span><span class="v">Dữ liệu thật: userId, role, thời điểm hết hạn. Đây là thứ trở thành &#96;req.user&#96; trên server bạn.</span></div>
  <div class="kv"><span class="k">Signature (chữ ký)</span><span class="v">Một hash của (header + payload + một khoá bí mật chỉ server biết). Chứng minh không ai đã sửa token.</span></div>
</div>

<h3>Xác thực không trạng thái — không cần tra cứu</h3>
<p>So sánh với luồng session ở Bài 7.2: với session, server phải tra "abc123" trong kho ở mỗi yêu cầu. Với JWT, server chỉ tính lại chữ ký bằng khoá bí mật của nó rồi kiểm khớp không. Nếu khớp, payload đáng tin — không cần vòng qua cơ sở dữ liệu. Đó là ý nghĩa của "xác thực không trạng thái," và đó là lý do JWT mở rộng tốt trên nhiều server.</p>

<h3>Gửi nó: Authorization: Bearer</h3>
<pre><code>GET /profile
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjQyfQ.4f8a91c2...</code></pre>
<p>Khác với cookie, một JWT KHÔNG được gửi tự động — code phía client của bạn phải chủ động đính nó vào header <code>Authorization</code> ở mỗi yêu cầu (bạn đã gặp header này ở Chương 6, Bài 6.4).</p>

<h3>Vì sao chữ ký quan trọng</h3>
<p>Không có chữ ký, bất kỳ ai cũng có thể viết &#96;{ "userId": 1, "role": "admin" }&#96;, dán vào hình dạng token, và giả làm admin. Chữ ký là thứ ngăn điều đó: nó chỉ có thể được tạo bởi ai có khoá bí mật của server, nên server phát hiện được nếu dù chỉ một ký tự của payload bị đổi.</p>

<p class="pitfall"><strong>Payload của JWT chỉ mã hoá base64, KHÔNG mã hoá thật — đừng bao giờ để bí mật trong đó.</strong> Bất kỳ ai cũng có thể copy phần giữa của một JWT và giải mã trong hai giây mà không cần công cụ nào; nó không bị xáo trộn, chỉ đổi định dạng. Một mật khẩu, số thẻ tín dụng, hay bất cứ gì nhạy cảm trong payload coi như công khai. Chỉ đặt dữ liệu danh tính không bí mật ở đó (user id, role, thời hạn) và để chữ ký đảm bảo nó không bị giả mạo.</p>

<p class="note-ct"><strong>Xem trước Node.js:</strong> backend Express của bạn sẽ dùng một thư viện như <code>jsonwebtoken</code> để ký một token lúc đăng nhập (&#96;jwt.sign(payload, secret)&#96;) và một auth middleware chạy <code>jwt.verify(token, secret)</code> ở mỗi route được bảo vệ — ném ra <strong>401</strong> (Chương 6) nếu token thiếu hoặc chữ ký không khớp, trước khi route handler của bạn từng chạy.</p>
<h3>Bên trong một JWT thật ra có gì</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Header — thuật toán</span><span class="lz-d">Chữ base64url, không phải mã hoá. Nói chữ ký được tạo thế nào, ví dụ <code>HS256</code>.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Payload — các tuyên bố</span><span class="lz-d">Cũng base64url. <code>sub</code> (là ai), <code>exp</code> (tới khi nào), cộng bất cứ thứ gì bạn thêm. Ai cầm token cũng đọc được toàn bộ.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Chữ ký — phần bí mật duy nhất</span><span class="lz-d">Một hàm băm của hai mẩu đầu cộng khoá của máy chủ bạn. Nó chứng minh payload chưa bị sửa; nó KHÔNG giấu bất cứ thứ gì.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Xác minh mới là toàn bộ vấn đề</span><span class="lz-d">Giải mã một token thì dễ như bỡn và chẳng chứng minh gì. Chỉ có <em>xác minh</em> chữ ký — bằng khoá của bạn, trên máy chủ — mới làm các tuyên bố đáng tin.</span></div>
</div>
<div class="out">$ echo 'eyJzdWIiOiIxMiIsInJvbGUiOiJhZG1pbiJ9' | base64 -d
{"sub":"12","role":"admin"}</div>
<div class="pitfall"><p><strong>Bẫy — đặt thứ riêng tư vào payload của JWT, hoặc tin rằng huỷ được một token.</strong> Base64 không phải mã hoá; như lệnh ở trên cho thấy, ai có token là đọc được mọi tuyên bố trong đó — nên một địa chỉ email, một số điện thoại hay một ghi chú nội bộ về người dùng thực chất đã công bố cho bất kỳ ai cầm nó, kể cả một script với tới được bộ nhớ trình duyệt. Nửa sau còn tệ hơn: một token đã ký vẫn hợp lệ cho tới <code>exp</code>, nên "đăng xuất mọi nơi" và "khoá tài khoản này" tự thân chúng không chạy. Hãy giữ token truy cập sống ngắn (vài phút), ghép nó với một token làm mới mà bạn thu hồi được ở máy chủ, và giữ một danh sách chặn cho những ca không chờ được.</p></div>
<div class="link-card"><a href="https://jwt.io/" target="_blank" rel="noopener">jwt.io — dán một token vào, xem chính xác bên trong có gì</a></div>
<div class="link-card"><a href="https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html" target="_blank" rel="noopener">OWASP — các bẫy của JWT và cách tránh</a></div>
</div>
`,
    },

    /* ─────────────────────────── 7.4 ─────────────────────────── */
    {
      title: '7.4 — Password security|||7.4 — Bảo mật mật khẩu',
      slug: 'wf-7-4-passwords',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/O6cmuiTBZVs', durationSeconds: 0 },
      description: 'Không bao giờ lưu mật khẩu thô; hash khác mã hoá; salting; bcrypt; vì sao hash chậm lại là điều tốt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Never store a password. Store proof you could check it once.</h2>
<p class="lead">This lesson has real teeth: mishandling passwords is one of the most damaging mistakes a beginner backend developer can make, because a single leaked database can expose every user's password for every site they reused it on. The fix is not exotic — it is one well-understood rule, always applied.</p>

<h3>The rule: NEVER store plaintext passwords</h3>
<pre><code>❌ users table:
id | email             | password
1  | lan@example.com   | hunter2          ← anyone who reads the DB now owns every account

✅ users table:
id | email             | passwordHash
1  | lan@example.com   | $2b$10$N9qo8uLOickgx2ZMRZoMy...</code></pre>
<p>If your database is ever leaked, stolen, or read by a rogue employee, plaintext passwords hand over every account instantly. A proper hash does not.</p>

<h3>Hashing is not encryption — the difference matters</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Encryption</span><span class="v">Reversible with the right key: encrypt(data, key) → ciphertext → decrypt(ciphertext, key) → data again. Used for data you must get back (Lesson 7.3's HTTPS).</span></div>
  <div class="kv"><span class="k">Hashing</span><span class="v">One-way: hash(password) → a fixed string, with NO function to reverse it. You never recover the original password — only ever compare a new guess's hash to the stored one.</span></div>
</div>
<p>Login therefore never "decrypts" your password to check it. It hashes what you just typed and compares the two hashes:</p>
<pre><code>// register:
passwordHash = hash(userInputPassword)  → store passwordHash

// login:
candidateHash = hash(userInputPassword)
if (candidateHash === storedPasswordHash) → correct password</code></pre>

<h3>Salting: defeating precomputed tables</h3>
<p>Plain hashing alone still has a hole: two users with the same password ("123456") get the exact same hash, and attackers keep giant precomputed lookup tables ("rainbow tables") mapping common hashes back to common passwords. The fix is a <strong>salt</strong> — random data unique to each password, mixed in before hashing.</p>
<pre><code>hash("123456" + salt_A) → completely different from
hash("123456" + salt_B) → even though the password is identical</code></pre>
<p>A precomputed table for "123456" is now useless — the attacker would need a separate table per salt, which defeats the whole point of precomputing.</p>

<h3>bcrypt: hashing built specifically for passwords</h3>
<p>Generic hash functions (like the SHA-256 you might use for file checksums) are built to be <em>fast</em> — great for checking a download, terrible for passwords, because fast means an attacker with stolen hashes can try billions of guesses per second. <strong>bcrypt</strong> (and similarly, argon2) is deliberately slow, and generates and stores its own salt automatically:</p>
<pre><code>const hash = await bcrypt.hash(plainPassword, 10);  // 10 = "cost factor"
// stores something like: $2b$10$N9qo8uLOickgx2ZMRZoMy...

const isMatch = await bcrypt.compare(typedPassword, hash);
// true only if typedPassword hashes to the same value</code></pre>
<p class="note-ct"><strong>Why slow hashing is good:</strong> checking one login attempt taking an extra ~100ms is invisible to a real user, but it makes an attacker's brute-force script — which needs to try millions of guesses — impractically slow. The "cost factor" can be raised over time as computers get faster, which is exactly why bcrypt has stayed relevant for decades.</p>

<p class="pitfall"><strong>Do not roll your own crypto.</strong> Writing your own hashing scheme, using a fast general-purpose hash (MD5, plain SHA-256) for passwords, or reusing the same salt for everyone are all real, documented ways real companies got breached. Use a vetted library (bcrypt, argon2) — this is one corner of programming where "boring and standard" beats "clever."</p>
<h3>Storing a password, correctly</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Never store the password</span><span class="lz-d">Not encrypted either — encryption is reversible, and whoever gets the database usually gets the key with it.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Hash it with bcrypt or argon2</span><span class="lz-d">Deliberately slow, so an attacker with the hashes can only try a few thousand guesses a second instead of billions. Slowness is the feature.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">The salt is automatic</span><span class="lz-d">bcrypt generates a random salt per password and stores it inside the hash string, so two users with the same password get different hashes.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Compare with the library</span><span class="lz-d"><code>bcrypt.compare(plain, hash)</code>. Never hash the input and compare with <code>===</code> — the salt is in the stored hash, so that always fails.</span></div>
</div>
<pre><code>const hash = await bcrypt.hash(password, 12);
// $2b$12$Xy8kQ2r...   ← algorithm, cost, salt and hash, all in one string

const ok = await bcrypt.compare(input, hash);</code></pre>
<div class="pitfall"><p><strong>Trap — a login that tells an attacker which half was wrong.</strong> Returning "no account with that email" for an unknown address and "wrong password" for a known one turns your login form into a membership checker: an attacker can test a list of ten thousand emails and learn exactly which ones have accounts here, which is valuable on its own and doubly so when the site is sensitive. A timing difference does the same thing — if a missing user returns instantly while a real one waits for bcrypt, the clock leaks the answer. Return one message for both cases, and run the hash comparison even when the user was not found.</p></div>
<div class="link-card"><a href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" target="_blank" rel="noopener">OWASP Password Storage Cheat Sheet — which algorithm, which cost</a></div>
<div class="link-card"><a href="https://github.com/kelektiv/node.bcrypt.js" target="_blank" rel="noopener">node.bcrypt.js — the library, and its README on cost factors</a></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Đừng bao giờ lưu một mật khẩu. Lưu bằng chứng rằng bạn đã kiểm được nó một lần.</h2>
<p class="lead">Bài này có "răng" thật: xử lý sai mật khẩu là một trong những lỗi gây hại nhất mà một lập trình viên backend mới có thể mắc, vì chỉ một cơ sở dữ liệu rò rỉ có thể lộ mật khẩu của mọi người dùng cho mọi trang họ dùng lại mật khẩu đó. Cách khắc phục không kỳ lạ gì — chỉ là một luật được hiểu rõ, luôn được áp dụng.</p>

<h3>Luật: KHÔNG BAO GIỜ lưu mật khẩu thô</h3>
<pre><code>❌ bảng users:
id | email             | password
1  | lan@example.com   | hunter2          ← ai đọc được DB giờ sở hữu mọi tài khoản

✅ bảng users:
id | email             | passwordHash
1  | lan@example.com   | $2b$10$N9qo8uLOickgx2ZMRZoMy...</code></pre>
<p>Nếu cơ sở dữ liệu của bạn bao giờ bị rò rỉ, đánh cắp, hay bị một nhân viên xấu đọc trộm, mật khẩu thô trao ngay mọi tài khoản. Một hash đúng chuẩn thì không.</p>

<h3>Hash không phải mã hoá — khác biệt này quan trọng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mã hoá (encryption)</span><span class="v">Đảo ngược được nếu có đúng khoá: encrypt(data, key) → bản mã → decrypt(bản mã, key) → data trở lại. Dùng cho dữ liệu bạn phải lấy lại được (HTTPS ở Bài 7.5).</span></div>
  <div class="kv"><span class="k">Hash</span><span class="v">Một chiều: hash(password) → một chuỗi cố định, KHÔNG có hàm nào đảo ngược. Bạn không bao giờ lấy lại mật khẩu gốc — chỉ so hash của một lần đoán mới với hash đã lưu.</span></div>
</div>
<p>Vì vậy đăng nhập không bao giờ "giải mã" mật khẩu bạn để kiểm. Nó hash cái bạn vừa gõ và so hai hash:</p>
<pre><code>// đăng ký:
passwordHash = hash(mậtKhẩuNgườiDùngGõ)  → lưu passwordHash

// đăng nhập:
candidateHash = hash(mậtKhẩuNgườiDùngGõ)
if (candidateHash === passwordHash đã lưu) → mật khẩu đúng</code></pre>

<h3>Salting: đánh bại bảng tra cứu tính sẵn</h3>
<p>Chỉ hash thuần vẫn còn một lỗ hổng: hai người dùng cùng mật khẩu ("123456") có hash y hệt nhau, và kẻ tấn công giữ những bảng tra cứu tính sẵn khổng lồ ("rainbow table") ánh xạ hash phổ biến ngược về mật khẩu phổ biến. Cách khắc phục là một <strong>salt</strong> — dữ liệu ngẫu nhiên riêng cho mỗi mật khẩu, trộn vào trước khi hash.</p>
<pre><code>hash("123456" + salt_A) → hoàn toàn khác
hash("123456" + salt_B) → dù mật khẩu giống hệt</code></pre>
<p>Một bảng tính sẵn cho "123456" giờ vô dụng — kẻ tấn công cần một bảng riêng cho mỗi salt, phá vỡ hoàn toàn mục đích của việc tính sẵn.</p>

<h3>bcrypt: hash dựng riêng cho mật khẩu</h3>
<p>Các hàm hash tổng quát (như SHA-256 bạn có thể dùng cho checksum file) được dựng để <em>nhanh</em> — tuyệt cho kiểm một file tải về, tệ hại cho mật khẩu, vì nhanh nghĩa là kẻ tấn công có hash đánh cắp có thể thử hàng tỉ lần đoán mỗi giây. <strong>bcrypt</strong> (và tương tự, argon2) cố tình chậm, và tự sinh + tự lưu salt riêng của nó:</p>
<pre><code>const hash = await bcrypt.hash(mậtKhẩuThô, 10);  // 10 = "cost factor"
// lưu thứ giống: $2b$10$N9qo8uLOickgx2ZMRZoMy...

const isMatch = await bcrypt.compare(mậtKhẩuVừaGõ, hash);
// true chỉ khi mậtKhẩuVừaGõ hash ra đúng giá trị đó</code></pre>
<p class="note-ct"><strong>Vì sao hash chậm lại là điều tốt:</strong> kiểm một lần đăng nhập tốn thêm ~100ms là vô hình với người dùng thật, nhưng khiến script brute-force của kẻ tấn công — cần thử hàng triệu lần đoán — chậm đến mức bất khả thi. "Cost factor" có thể tăng dần theo thời gian khi máy tính mạnh lên, đó chính là lý do bcrypt vẫn còn phù hợp suốt hàng thập kỷ.</p>

<p class="pitfall"><strong>Đừng tự chế mật mã của riêng bạn.</strong> Tự viết một sơ đồ hash riêng, dùng một hash tổng quát nhanh (MD5, SHA-256 thuần) cho mật khẩu, hay dùng chung một salt cho tất cả mọi người đều là những cách thật, đã được ghi nhận khiến các công ty thật bị xâm nhập. Hãy dùng một thư viện đã được kiểm chứng (bcrypt, argon2) — đây là một góc của lập trình mà "nhàm chán và chuẩn mực" thắng "khôn khéo."</p>
<h3>Lưu một mật khẩu, cho đúng</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Đừng bao giờ lưu mật khẩu</span><span class="lz-d">Mã hoá cũng không — mã hoá là đảo ngược được, và kẻ lấy được cơ sở dữ liệu thường lấy được luôn cái khoá kèm theo.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Băm nó bằng bcrypt hoặc argon2</span><span class="lz-d">Chậm một cách có chủ đích, để kẻ tấn công cầm đống hash chỉ thử được vài nghìn lần đoán mỗi giây thay vì hàng tỷ. Cái chậm ấy chính là tính năng.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Muối là tự động</span><span class="lz-d">bcrypt sinh một chuỗi muối ngẫu nhiên cho mỗi mật khẩu và cất luôn trong chuỗi hash, nên hai người dùng cùng mật khẩu vẫn có hash khác nhau.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">So sánh bằng chính thư viện đó</span><span class="lz-d"><code>bcrypt.compare(plain, hash)</code>. Đừng bao giờ tự băm đầu vào rồi so bằng <code>===</code> — muối nằm trong hash đã lưu, nên cách đó luôn luôn sai.</span></div>
</div>
<pre><code>const hash = await bcrypt.hash(password, 12);
// $2b$12$Xy8kQ2r...   ← thuật toán, chi phí, muối và hash, tất cả trong một chuỗi

const ok = await bcrypt.compare(input, hash);</code></pre>
<div class="pitfall"><p><strong>Bẫy — một trang đăng nhập nói cho kẻ tấn công biết nửa nào sai.</strong> Trả về "không có tài khoản với email đó" cho một địa chỉ lạ và "sai mật khẩu" cho một địa chỉ có thật là biến form đăng nhập của bạn thành một máy dò thành viên: kẻ tấn công thử một danh sách mười nghìn email và biết chính xác cái nào có tài khoản ở đây, thứ tự nó đã có giá trị và càng có giá khi trang web nhạy cảm. Chênh lệch thời gian cũng làm y hệt — nếu một người dùng không tồn tại trả về tức thì trong khi người có thật phải chờ bcrypt, thì cái đồng hồ đã tiết lộ đáp án. Hãy trả về MỘT thông điệp cho cả hai ca, và vẫn chạy phép so hash kể cả khi không tìm thấy người dùng.</p></div>
<div class="link-card"><a href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" target="_blank" rel="noopener">OWASP Password Storage Cheat Sheet — thuật toán nào, chi phí bao nhiêu</a></div>
<div class="link-card"><a href="https://github.com/kelektiv/node.bcrypt.js" target="_blank" rel="noopener">node.bcrypt.js — thư viện, và README về hệ số chi phí</a></div>
</div>
`,
    },

    /* ─────────────────────────── 7.5 ─────────────────────────── */
    {
      title: '7.5 — HTTPS and CORS|||7.5 — HTTPS và CORS',
      slug: 'wf-7-5-https-cors',
      type: 'VIDEO',
      video: { url: 'https://youtu.be/4KHiSt0oLJ0', durationSeconds: 0 },
      description: 'HTTPS mã hoá dữ liệu khi truyền (vì sao quan trọng với cookie/token) và CORS (same-origin policy, vì sao "lỗi CORS" xảy ra trên trình duyệt, server phải chủ động cho phép — đây là bảo vệ của trình duyệt, không phải một cuộc tấn công).',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>HTTPS protects data in transit; CORS protects users from your own browser</h2>
<p class="lead">These two are the last pieces of the security picture, and beginners often confuse them because both show up as "the site won't connect." They solve completely different problems — one is about eavesdropping, the other is about which websites are allowed to talk to which APIs.</p>

<h3>HTTPS — encrypting the wire itself</h3>
<p><strong>HTTPS</strong> is HTTP wrapped in <strong>TLS</strong> (Transport Layer Security): everything sent between browser and server is encrypted in transit, so anyone listening on the network in between — a public Wi-Fi hotspot, an ISP, an attacker on the same network — sees scrambled bytes, not your data.</p>
<pre><code>Plain HTTP:  Authorization: Bearer eyJhbGc...   ← readable by anyone on the network
HTTPS:       <encrypted bytes — unreadable without the TLS session key>  </code></pre>
<p class="note-ct"><strong>This is why Lessons 7.2 and 7.3 matter together with HTTPS.</strong> A session cookie or a JWT is proof of your identity — on plain HTTP, that proof travels in the open, and anyone who captures it can impersonate you with no password needed. This is exactly why Lesson 7.2's <code>Secure</code> cookie flag exists: it refuses to send the cookie over anything but HTTPS.</p>

<h3>CORS — a browser rule, not a network rule</h3>
<p>The <strong>same-origin policy</strong> is a browser default: JavaScript running on one <strong>origin</strong> (scheme + host + port, e.g. <code>https://app.example.com</code>) cannot read responses from a <em>different</em> origin (e.g. <code>https://api.other.com</code>) unless that other origin explicitly allows it. <strong>CORS</strong> (Cross-Origin Resource Sharing) is the mechanism for that explicit permission.</p>
<pre><code>Browser JS on https://myapp.com calls fetch("https://api.example.com/data")

Server response needs this header to allow it:
Access-Control-Allow-Origin: https://myapp.com

Missing that header → browser blocks the JS from reading the response
→ console shows a "CORS error"</code></pre>

<p class="pitfall"><strong>A "CORS error" means the browser blocked YOUR OWN script — it is not the server being down, and not an attack on you.</strong> The request often still reaches the server and even runs there; the browser just refuses to hand the response back to your JavaScript. That is also why CORS never appears in curl, Postman, or server-to-server calls — CORS is enforced only inside browsers, as a protection for the person visiting the page. Fix it by having the server opt in (add the right <code>Access-Control-Allow-Origin</code> header, e.g. via the &#96;cors&#96; npm package in Express) — never by trying to bypass it from the client.</p>

<h3>CORS, in the order the browser applies it</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">The browser compares origins</span><span class="lz-d">Scheme, host and port must all match. <code>http://x.com</code> and <code>https://x.com</code> are different origins, and so are ports 3000 and 5173.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Simple requests go straight out</span><span class="lz-d">A plain <code>GET</code>. The request reaches your server either way — CORS decides whether the <em>response</em> may be read, not whether it is sent.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Others get a preflight first</span><span class="lz-d">An <code>OPTIONS</code> request asking permission, triggered by a custom header or a JSON <code>Content-Type</code>. Your server must answer it.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">The server's headers decide</span><span class="lz-d"><code>Access-Control-Allow-Origin</code> and friends. CORS is enforced by the browser, on the server's instructions — <code>curl</code> ignores it entirely.</span></div>
</div>
<div class="pitfall"><p><strong>Trap — fixing a CORS error with <code>Allow-Origin: *</code>.</strong> It makes the message go away, and it turns off the protection: any website your users visit can now call your API from their browsers. That is harmless for genuinely public data and serious for anything else — although with cookies there is a second safeguard, because <code>*</code> is incompatible with <code>Allow-Credentials: true</code>, and the browser will refuse the combination. That refusal is what usually sends people looking for a workaround, at exactly the moment the rule is protecting them. List the origins you actually serve, and remember the browser is enforcing this on your behalf: CORS is not a firewall, and it never stops <code>curl</code>.</p></div>
<div class="link-card"><a href="https://youtu.be/hExRDVZHhig" target="_blank" rel="noopener">SSL, TLS, HTTP, HTTPS Explained</a></div>

<p class="note-ct"><strong>Chapter wrap-up.</strong> You now have the full authentication picture: the problem (Lesson 7.1, HTTP forgets you), two fixes (7.2 cookies/sessions, 7.3 JWT), how passwords must be stored (7.4), and the two extra layers that make all of it safe to use in the real world (7.5, HTTPS + CORS). This is precisely what your Express auth middleware, login routes and CORS config will implement. <strong>Next chapter: data & SQL</strong> — how the server actually stores and queries the data sitting behind all of these authenticated requests.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>HTTPS bảo vệ dữ liệu khi truyền; CORS bảo vệ người dùng khỏi chính trình duyệt của họ</h2>
<p class="lead">Hai thứ này là những mảnh cuối của bức tranh bảo mật, và người mới hay nhầm lẫn chúng vì cả hai đều biểu hiện là "trang không kết nối được." Chúng giải hai bài toán hoàn toàn khác nhau — một là về nghe lén, một là về trang web nào được phép nói chuyện với API nào.</p>

<h3>HTTPS — mã hoá chính đường truyền</h3>
<p><strong>HTTPS</strong> là HTTP được bọc trong <strong>TLS</strong> (Transport Layer Security): mọi thứ gửi giữa trình duyệt và server được mã hoá khi truyền, nên bất kỳ ai nghe lén trên mạng ở giữa — một điểm Wi-Fi công cộng, một nhà mạng, một kẻ tấn công cùng mạng — chỉ thấy byte xáo trộn, không thấy dữ liệu của bạn.</p>
<pre><code>HTTP thường:  Authorization: Bearer eyJhbGc...   ← ai trên mạng cũng đọc được
HTTPS:        <byte đã mã hoá — không đọc được nếu không có khoá phiên TLS>  </code></pre>
<p class="note-ct"><strong>Đây là lý do Bài 7.2 và 7.3 quan trọng cùng với HTTPS.</strong> Một session cookie hay một JWT là bằng chứng danh tính của bạn — trên HTTP thường, bằng chứng đó truyền công khai, và bất kỳ ai bắt được nó có thể mạo danh bạn mà không cần mật khẩu. Đây đúng là lý do cờ <code>Secure</code> của cookie ở Bài 7.2 tồn tại: nó từ chối gửi cookie qua bất cứ gì ngoài HTTPS.</p>

<h3>CORS — một luật của trình duyệt, không phải luật mạng</h3>
<p><strong>Chính sách cùng nguồn gốc (same-origin policy)</strong> là mặc định của trình duyệt: JavaScript chạy trên một <strong>origin</strong> (scheme + host + port, vd <code>https://app.example.com</code>) không đọc được phản hồi từ một origin <em>khác</em> (vd <code>https://api.other.com</code>) trừ khi origin kia chủ động cho phép. <strong>CORS</strong> (Cross-Origin Resource Sharing) là cơ chế cho sự cho phép chủ động đó.</p>
<pre><code>JS trình duyệt trên https://myapp.com gọi fetch("https://api.example.com/data")

Phản hồi server cần header này để cho phép:
Access-Control-Allow-Origin: https://myapp.com

Thiếu header đó → trình duyệt chặn JS đọc phản hồi
→ console hiện một "lỗi CORS"</code></pre>

<p class="pitfall"><strong>Một "lỗi CORS" nghĩa là trình duyệt chặn CHÍNH script của bạn — không phải server sập, và không phải một cuộc tấn công vào bạn.</strong> Yêu cầu thường vẫn tới được server và thậm chí chạy ở đó; trình duyệt chỉ từ chối trao phản hồi lại cho JavaScript của bạn. Đó cũng là lý do CORS không bao giờ xuất hiện trong curl, Postman, hay các lời gọi server-to-server — CORS chỉ được thực thi bên trong trình duyệt, như một bảo vệ cho người đang xem trang. Sửa nó bằng cách để server chủ động cho phép (thêm đúng header <code>Access-Control-Allow-Origin</code>, vd qua gói npm &#96;cors&#96; trong Express) — không bao giờ bằng cách tìm cách lách nó từ phía client.</p>

<h3>CORS, theo đúng thứ tự trình duyệt áp dụng</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Trình duyệt so các origin</span><span class="lz-d">Giao thức, tên máy và cổng đều phải khớp. <code>http://x.com</code> và <code>https://x.com</code> là hai origin khác nhau, cổng 3000 với 5173 cũng vậy.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Request đơn giản thì đi thẳng</span><span class="lz-d">Một <code>GET</code> trơn. Request tới máy chủ bạn dù thế nào — CORS quyết định phần <em>phản hồi</em> có được đọc hay không, chứ không quyết định nó có được gửi hay không.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Các loại khác bị hỏi trước (preflight)</span><span class="lz-d">Một request <code>OPTIONS</code> xin phép, kích hoạt bởi một header tự đặt hoặc một <code>Content-Type</code> kiểu JSON. Máy chủ của bạn phải trả lời nó.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Header của máy chủ quyết định</span><span class="lz-d"><code>Access-Control-Allow-Origin</code> và bạn bè. CORS do trình duyệt cưỡng chế, theo chỉ dẫn của máy chủ — <code>curl</code> thì lờ tịt nó.</span></div>
</div>
<div class="pitfall"><p><strong>Bẫy — chữa một lỗi CORS bằng <code>Allow-Origin: *</code>.</strong> Nó làm thông báo biến mất, và nó tắt luôn lớp bảo vệ: bất kỳ trang web nào người dùng của bạn ghé qua giờ đều gọi được API của bạn từ trình duyệt của họ. Điều đó vô hại với dữ liệu thật sự công khai và nghiêm trọng với mọi thứ khác — dù với cookie thì còn một lớp chốt thứ hai, vì <code>*</code> không tương thích với <code>Allow-Credentials: true</code>, và trình duyệt sẽ từ chối tổ hợp đó. Chính cú từ chối ấy thường đẩy người ta đi tìm cách lách, đúng vào lúc cái luật đang bảo vệ họ. Hãy liệt kê những origin bạn thật sự phục vụ, và nhớ rằng trình duyệt đang cưỡng chế điều này thay bạn: CORS không phải tường lửa, và nó chẳng bao giờ chặn được <code>curl</code>.</p></div>
<div class="link-card"><a href="https://youtu.be/hExRDVZHhig" target="_blank" rel="noopener">SSL, TLS, HTTP, HTTPS Explained</a></div>

<p class="note-ct"><strong>Tổng kết chương.</strong> Giờ bạn đã có bức tranh xác thực đầy đủ: bài toán (Bài 7.1, HTTP quên bạn), hai cách khắc phục (7.2 cookie/session, 7.3 JWT), cách mật khẩu phải được lưu (7.4), và hai lớp thêm khiến tất cả an toàn để dùng ngoài đời thật (7.5, HTTPS + CORS). Đây đúng là thứ auth middleware, route đăng nhập và cấu hình CORS trong Express của bạn sẽ hiện thực. <strong>Chương kế tiếp: dữ liệu & SQL</strong> — server thật sự lưu và truy vấn dữ liệu đứng sau mọi yêu cầu đã xác thực này như thế nào.</p>
</div>
`,
    },

    /* ─────────────────────────── 7.6 quiz ─────────────────────────── */
    {
      title: '7.6 — Chapter 7 quiz|||7.6 — Kiểm tra chương 7',
      slug: 'wf-7-6-quiz',
      type: 'QUIZ',
      isFreePreview: false,
      description: 'Mười câu về authentication vs authorization, cookie/session, JWT, bảo mật mật khẩu, và HTTPS/CORS.',
      content: `
<div class="ml-en"><p class="lead">Ten questions on Chapter 7: authentication vs authorization, cookies and sessions, JWT, password security, and HTTPS/CORS.</p>
<p class="note-ct"><strong>Now practice by doing.</strong> The best way to internalise auth is to build real login and protected routes. On Code Lab, implement sessions or JWT, hash passwords with bcrypt, and wire up middleware on the Node.js (Express) track.</p>
<h3>The chapter in four points</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Two questions</span><span class="lz-t">Who are you, and may you</span><span class="lz-d">Authentication happens once; authorisation happens on every request, for every resource. A hidden button is not access control.</span></div>
<div class="lz-node"><span class="lz-k">Cookie flags</span><span class="lz-t">HttpOnly, Secure, SameSite</span><span class="lz-d">And keep the cookie's lifetime in step with the session's — a mismatch logs users out invisibly, with 401s instead of a login prompt.</span></div>
<div class="lz-node"><span class="lz-k">A JWT is readable</span><span class="lz-t">Signed, not encrypted</span><span class="lz-d">Anyone holding it reads every claim, and it stays valid until it expires. Keep them short-lived and pair them with something revocable.</span></div>
<div class="lz-node"><span class="lz-k">Passwords</span><span class="lz-t">bcrypt, and one error message</span><span class="lz-d">Never store or encrypt them — hash them slowly. And do not tell an attacker which half of the login was wrong.</span></div>
</div>
<p class="note-ct"><strong>Security is the one area where "it works" proves nothing.</strong> A broken auth check works perfectly for the honest user testing it. For each endpoint you write, ask what happens when someone calls it with a different id, no token, or an expired one — then try it.</p>
<div class="link-card"><a href="/code-lab/nodejs-express">Practice on Code Lab → Node.js (Express) track</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 7: xác thực vs phân quyền, cookie và session, JWT, bảo mật mật khẩu, và HTTPS/CORS.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Cách tốt nhất để thấm auth là tự dựng đăng nhập thật và các route được bảo vệ. Trên Code Lab, hãy hiện thực session hoặc JWT, hash mật khẩu bằng bcrypt, và nối middleware ở track Node.js (Express).</p>
<h3>Cả chương trong bốn ý</h3>
<div class="lz-map">
<div class="lz-node"><span class="lz-k">Hai câu hỏi</span><span class="lz-t">Bạn là ai, và bạn có được phép</span><span class="lz-d">Xác thực xảy ra một lần; phân quyền xảy ra ở mọi request, cho mọi tài nguyên. Một cái nút bị giấu không phải là kiểm soát truy cập.</span></div>
<div class="lz-node"><span class="lz-k">Các cờ cookie</span><span class="lz-t">HttpOnly, Secure, SameSite</span><span class="lz-d">Và giữ tuổi thọ cookie khớp nhịp với phiên — lệch nhau là người dùng bị đăng xuất một cách vô hình, nhận 401 thay vì lời mời đăng nhập.</span></div>
<div class="lz-node"><span class="lz-k">Một JWT là đọc được</span><span class="lz-t">Đã ký, không phải mã hoá</span><span class="lz-d">Ai cầm nó cũng đọc được mọi tuyên bố, và nó hợp lệ cho tới khi hết hạn. Hãy giữ chúng sống ngắn và ghép với một thứ thu hồi được.</span></div>
<div class="lz-node"><span class="lz-k">Mật khẩu</span><span class="lz-t">bcrypt, và một thông điệp lỗi duy nhất</span><span class="lz-d">Đừng bao giờ lưu hay mã hoá chúng — hãy băm chậm. Và đừng nói cho kẻ tấn công biết nửa nào của lần đăng nhập là sai.</span></div>
</div>
<p class="note-ct"><strong>An toàn là lĩnh vực duy nhất mà "nó chạy được" chẳng chứng minh gì.</strong> Một phép kiểm quyền bị hỏng vẫn chạy hoàn hảo với người dùng ngay thẳng đang thử nó. Với mỗi endpoint bạn viết, hãy hỏi chuyện gì xảy ra khi có người gọi nó bằng một id khác, không có token, hoặc một token hết hạn — rồi thử thật.</p>
<div class="link-card"><a href="/code-lab/nodejs-express">Luyện tập ở Code Lab → track Node.js (Express)</a></div></div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What is the difference between authentication and authorization?|||Khác biệt giữa xác thực (authentication) và phân quyền (authorization) là gì?',
            options: [
              'Authentication proves who you are; authorization decides what you can do|||Xác thực chứng minh bạn là ai; phân quyền quyết định bạn được làm gì',
              'They are the same thing|||Chúng là một',
              'Authorization happens before login|||Phân quyền xảy ra trước khi đăng nhập',
              'Authentication only applies to admins|||Xác thực chỉ áp dụng cho admin',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why does a login system need cookies or tokens at all?|||Vì sao một hệ thống đăng nhập cần cookie hoặc token?',
            options: [
              'Because HTTP is stateless — the server forgets you after every request, so identity must be re-sent|||Vì HTTP không lưu trạng thái — server quên bạn sau mỗi yêu cầu, nên danh tính phải được gửi lại',
              'Because passwords cannot be checked otherwise|||Vì không thể kiểm mật khẩu bằng cách khác',
              'Only to make the URL shorter|||Chỉ để URL ngắn hơn',
              'Cookies and tokens are required by JSON|||Cookie và token là bắt buộc theo JSON',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What happens automatically once a cookie is set by the server?|||Điều gì xảy ra tự động một khi cookie được server đặt?',
            options: [
              'The browser re-sends it on every later request to the matching domain|||Trình duyệt tự gửi lại nó ở mọi yêu cầu sau tới đúng domain',
              'It is deleted after one request|||Nó bị xoá sau một yêu cầu',
              'The user must copy-paste it manually|||Người dùng phải tự copy-paste nó',
              'It only works for GET requests|||Nó chỉ hoạt động với yêu cầu GET',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does the HttpOnly cookie flag do?|||Cờ HttpOnly của cookie làm gì?',
            options: [
              'Prevents JavaScript on the page from reading the cookie, protecting against theft via a malicious script|||Ngăn JavaScript trên trang đọc cookie, bảo vệ khỏi bị đánh cắp qua script độc hại',
              'Forces the cookie to only work over HTTP, never HTTPS|||Buộc cookie chỉ hoạt động qua HTTP, không bao giờ HTTPS',
              'Makes the cookie visible in the URL|||Khiến cookie hiển thị trong URL',
              'Deletes the cookie after one hour|||Xoá cookie sau một giờ',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'A JWT has three parts separated by dots. What are they?|||Một JWT có ba phần ngăn bởi dấu chấm. Đó là gì?',
            options: [
              'header.payload.signature|||header.payload.signature',
              'method.path.status|||method.path.status',
              'client.server.database|||client.server.database',
              'cookie.session.token|||cookie.session.token',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Which statement about a JWT payload is TRUE?|||Phát biểu nào về payload của JWT là ĐÚNG?',
            options: [
              'It is only base64-encoded, not encrypted — anyone can decode and read it, so never put secrets in it|||Nó chỉ mã hoá base64, không mã hoá thật — ai cũng giải mã và đọc được, nên đừng bao giờ để bí mật trong đó',
              'It is fully encrypted and unreadable without the secret key|||Nó được mã hoá hoàn toàn và không đọc được nếu không có khoá bí mật',
              'It is stored only on the server, never sent to the client|||Nó chỉ lưu trên server, không bao giờ gửi cho client',
              'It cannot contain a user id|||Nó không thể chứa user id',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why hash a password instead of encrypting it?|||Vì sao hash một mật khẩu thay vì mã hoá nó?',
            options: [
              'Hashing is one-way — you never need to recover the original password, only compare hashes|||Hash là một chiều — bạn không bao giờ cần lấy lại mật khẩu gốc, chỉ so hash',
              'Hashing is reversible and faster to decrypt|||Hash đảo ngược được và giải mã nhanh hơn',
              'Encryption cannot be used on strings|||Mã hoá không dùng được trên chuỗi',
              'Hashing and encryption are the same thing|||Hash và mã hoá là một',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does salting a password before hashing accomplish?|||Salting một mật khẩu trước khi hash làm được gì?',
            options: [
              'Makes identical passwords produce different hashes, defeating precomputed rainbow tables|||Khiến mật khẩu giống nhau tạo ra hash khác nhau, đánh bại bảng rainbow table tính sẵn',
              'Makes the password shorter|||Làm mật khẩu ngắn hơn',
              'Encrypts the password so it can be recovered|||Mã hoá mật khẩu để có thể lấy lại',
              'Removes the need for a password entirely|||Loại bỏ hoàn toàn nhu cầu mật khẩu',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why is bcrypt deliberately slow?|||Vì sao bcrypt cố tình chậm?',
            options: [
              'It makes brute-force guessing attacks impractically slow, while one real login check is barely noticeable|||Nó khiến tấn công brute-force đoán mật khẩu chậm đến mức bất khả thi, trong khi một lần kiểm đăng nhập thật gần như không cảm nhận được',
              'To save server memory|||Để tiết kiệm bộ nhớ server',
              'Slow hashing is a bug that developers tolerate|||Hash chậm là một lỗi mà lập trình viên chấp nhận',
              'It has nothing to do with security|||Nó không liên quan gì đến bảo mật',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'What does a "CORS error" in the browser console actually mean?|||Một "lỗi CORS" trong console trình duyệt thực sự nghĩa là gì?',
            options: [
              'The browser blocked your own JavaScript from reading a cross-origin response because the server did not allow it — not a server crash|||Trình duyệt chặn chính JavaScript của bạn đọc phản hồi khác origin vì server không cho phép — không phải server sập',
              'The server is offline|||Server đang offline',
              'The user\'s password is wrong|||Mật khẩu người dùng sai',
              'CORS errors also happen in curl and Postman|||Lỗi CORS cũng xảy ra trong curl và Postman',
            ],
            correctIndex: 0,
            points: 1,
          },
        ],
      },
    },
  ],
};
