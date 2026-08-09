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
<div class="link-card"><a href="/code-lab/nodejs-express">Practice on Code Lab → Node.js (Express) track</a></div></div>
<div class="ml-vi"><p class="lead">Mười câu cho Chương 7: xác thực vs phân quyền, cookie và session, JWT, bảo mật mật khẩu, và HTTPS/CORS.</p>
<p class="note-ct"><strong>Giờ luyện bằng cách làm.</strong> Cách tốt nhất để thấm auth là tự dựng đăng nhập thật và các route được bảo vệ. Trên Code Lab, hãy hiện thực session hoặc JWT, hash mật khẩu bằng bcrypt, và nối middleware ở track Node.js (Express).</p>
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
