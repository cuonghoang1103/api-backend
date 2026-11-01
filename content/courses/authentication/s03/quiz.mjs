/**
 * Authentication · Chương 3 · Quiz (10 câu tình huống trên LabFlow ID v0.3, số đo của chương). Slug giữ: auth-3-6-quiz.
 * Đáp án rải: A ×2 (câu 3, 7) · B ×3 (1, 5, 10) · C ×2 (4, 8) · D ×3 (2, 6, 9).
 */
export default {
  title: '3.6 — Quiz: sessions and cookies|||3.6 — Quiz: phiên và cookie',
  slug: 'auth-3-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống trên LabFlow ID v0.3 về Chương 3: hai kiểu hết hạn, ghi last_seen ở mỗi request, cookie __Host- bị bỏ âm thầm, xoá cookie sai Path, SameSite đo trong Chromium 156, HttpOnly và XSS, session fixation, đổi mật khẩu, CORS không chống CSRF, phiên sống ở đâu — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Check</span>
<h2>Chapter 3 check</h2>
<p class="lead">Ten scenarios from LabFlow ID v0.3, with the numbers you measured in this chapter. Every explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain idle vs absolute timeout and enforce both on the server.</li>
<li>I can justify every attribute of <code>__Host-lfid_ses</code> with a measurement.</li>
<li>I can show session fixation and fix it with a new session at every privilege change.</li>
<li>I can rank three CSRF defences and say why CORS is not one of them.</li>
<li>I can choose between PostgreSQL, Redis and a signed cookie for sessions.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Kiểm tra Chương 3</h2>
<p class="lead">Mười tình huống từ LabFlow ID v0.3, dùng đúng những con số bạn đã đo trong chương. Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được hết hạn nhàn rỗi và tuyệt đối, và áp cả hai ở máy chủ.</li>
<li>Tôi bảo vệ được từng thuộc tính của <code>__Host-lfid_ses</code> bằng một phép đo.</li>
<li>Tôi chỉ ra được session fixation và vá nó bằng phiên mới ở mỗi lần đổi đặc quyền.</li>
<li>Tôi xếp hạng được ba lớp phòng CSRF và nói được vì sao CORS không nằm trong số đó.</li>
<li>Tôi chọn được giữa PostgreSQL, Redis và cookie có ký để giữ phiên.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'An sends a request to LabFlow ID every 15 minutes from 07:00. Bình signs in at 07:00 and walks away. With idle 30 min and absolute 12 h, what did demo3/timeouts.mjs show?|||An gửi request tới LabFlow ID mỗi 15 phút từ 07:00. Bình đăng nhập lúc 07:00 rồi bỏ đi. Với nhàn rỗi 30 phút và tuyệt đối 12 giờ, demo3/timeouts.mjs cho thấy gì?',
        options: [
          'Both stay signed in until 19:00, because each has a valid cookie with Max-Age=43200|||Cả hai đăng nhập tới 19:00, vì mỗi người có cookie hợp lệ với Max-Age=43200',
          'Bình is signed out at 07:31 (idle); An is signed out at 19:00 even though she was active (absolute)|||Bình bị đăng xuất lúc 07:31 (nhàn rỗi); An bị đăng xuất lúc 19:00 dù vẫn hoạt động (tuyệt đối)',
          'An is never signed out, because every request extends the session|||An không bao giờ bị đăng xuất, vì mỗi request đều kéo dài phiên',
          'Both are signed out at 07:30, because the idle timeout is counted from sign-in|||Cả hai bị đăng xuất lúc 07:30, vì mốc nhàn rỗi tính từ lúc đăng nhập',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Idle ends a session nobody uses (Bình at 07:31); absolute ends it however busy it is (An at 19:00). “Max-Age keeps both alive” is the tempting mistake: Max-Age only tells the browser; the server checks expires_at and last_seen_at.|||VI: Nhàn rỗi kết thúc phiên không ai dùng (Bình lúc 07:31); tuyệt đối kết thúc phiên dù bận tới đâu (An lúc 19:00). "Max-Age giữ cả hai" là lỗi hấp dẫn: Max-Age chỉ báo cho trình duyệt; máy chủ tự kiểm expires_at và last_seen_at. (Bài 3.1)',
      },
      {
        question: 'A teammate updates last_seen_at on every authenticated request. In lesson 3.1, 1,000 GET /me requests caused how many updates of the sessions table, and what fixes it?|||Một bạn cùng nhóm cập nhật last_seen_at ở mọi request có xác thực. Ở bài 3.1, 1.000 request GET /me gây ra bao nhiêu lần cập nhật bảng sessions, và cách sửa là gì?',
        options: [
          'None — PostgreSQL skips updates that write the same row|||Không lần nào — PostgreSQL bỏ qua cập nhật ghi cùng một dòng',
          '1 — PostgreSQL batches updates of one row automatically|||1 — PostgreSQL tự gộp các lần cập nhật cùng một dòng',
          '500 — every second request, because of connection pooling|||500 — cứ hai request một lần, do connection pooling',
          '1,000; touching at most once a minute brought it to 0, with an idle check only ±60 s less precise|||1.000; chạm tối đa mỗi phút một lần đưa nó về 0, phép kiểm nhàn rỗi chỉ lệch ±60 s',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Port 4803 (TOUCH_EVERY_MS=0) logged 1,000 updated rows, port 4800 logged 0, and the median dropped from 2.06 to 1.74 ms. Every UPDATE leaves a dead row for VACUUM and WAL for replicas; PostgreSQL does not skip or merge them.|||VI: Cổng 4803 (TOUCH_EVERY_MS=0) ghi 1.000 dòng bị cập nhật, cổng 4800 ghi 0, và trung vị giảm từ 2,06 xuống 1,74 ms. Mỗi UPDATE để lại một dòng chết cho VACUUM và WAL cho bản sao; PostgreSQL không bỏ qua hay gộp chúng. (Bài 3.1)',
      },
      {
        question: 'Users of a new LabFlow sub-app “cannot stay signed in”. Its server sends Set-Cookie: __Host-lab=…; Path=/labs; HttpOnly; Secure. No error appears anywhere. Why?|||Người dùng một ứng dụng con mới của LabFlow "không giữ được đăng nhập". Máy chủ của nó gửi Set-Cookie: __Host-lab=…; Path=/labs; HttpOnly; Secure. Không có lỗi nào ở đâu cả. Vì sao?',
        options: [
          'A __Host- cookie must have Path=/; Chromium drops this one silently — the cookie matrix showed host_path “stored? no”|||Cookie __Host- phải có Path=/; Chromium âm thầm bỏ cookie này — ma trận cookie cho thấy host_path "stored? no"',
          'HttpOnly prevents the browser from sending the cookie back|||HttpOnly ngăn trình duyệt gửi cookie trở lại',
          'Secure cookies are never accepted on http://localhost|||Cookie Secure không bao giờ được nhận trên http://localhost',
          'The cookie needs Domain=labflow.example to work on a sub-app|||Cookie cần Domain=labflow.example mới chạy được trên ứng dụng con',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: __Host- requires Secure, Path=/ and no Domain; a violation is not an error, the cookie is just absent. Secure on localhost is accepted by Chromium (host_ok was stored), and adding Domain would also break __Host- — and widen the session to every subdomain.|||VI: __Host- đòi Secure, Path=/ và không Domain; phạm luật không sinh lỗi, cookie chỉ đơn giản không có mặt. Chromium nhận Secure trên localhost (host_ok được lưu), còn thêm Domain cũng làm hỏng __Host- — và nới phiên ra mọi subdomain. (Bài 3.2)',
      },
      {
        question: 'An XSS is found in one LabFlow ID page. The session cookie is HttpOnly. What did demo3/httponly-xss.mjs show the injected script could do?|||Phát hiện một lỗ XSS trên một trang LabFlow ID. Cookie phiên có HttpOnly. demo3/httponly-xss.mjs cho thấy đoạn script chèn vào làm được gì?',
        options: [
          'Nothing: HttpOnly blocks every request made by scripts|||Không gì cả: HttpOnly chặn mọi request do script tạo',
          'Read the token through document.cookie and send it to the attacker|||Đọc token qua document.cookie và gửi cho kẻ tấn công',
          'Not read the token (document.cookie was ""), but change An’s email with a same-origin fetch that carried the cookie|||Không đọc được token (document.cookie là ""), nhưng đổi được email của An bằng một fetch cùng origin có mang cookie',
          'Only change data if SameSite were set to None|||Chỉ đổi được dữ liệu nếu SameSite đặt None',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: HttpOnly hides the cookie from scripts but the browser still attaches it to their requests: the email became attacker@evil.example. SameSite is irrelevant here — the request is same-origin. Fixing the XSS is the real defence.|||VI: HttpOnly giấu cookie khỏi script nhưng trình duyệt vẫn đính nó vào request của chúng: email thành attacker@evil.example. SameSite không liên quan ở đây — request là cùng origin. Vá XSS mới là lớp phòng thật. (Bài 3.2)',
      },
      {
        question: 'On Chromium 156, LabFlow’s old app sets its session cookie with no SameSite attribute. An attacker page on another site auto-submits a POST form to it. What happens?|||Trên Chromium 156, ứng dụng cũ của LabFlow đặt cookie phiên không khai SameSite. Một trang kẻ tấn công ở site khác tự submit một form POST tới nó. Chuyện gì xảy ra?',
        options: [
          'The cookie is never sent, because missing SameSite means Strict|||Cookie không bao giờ được gửi, vì thiếu SameSite nghĩa là Strict',
          'Within 2 minutes of the cookie being set it is sent and the email changes; after that it is not (treated as Lax)|||Trong 2 phút sau khi cookie được đặt, nó được gửi và email bị đổi; sau đó thì không (coi như Lax)',
          'It is always sent, because missing SameSite means None|||Luôn được gửi, vì thiếu SameSite nghĩa là None',
          'It is sent only if the form uses GET|||Chỉ được gửi nếu form dùng GET',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Measured twice: form-post carried “unset” seconds after login, not 125 s later; the CSRF matrix row “(unset), none” shows the form CHANGED the email while the fetch got 401. Node.js 8.4 saw the same on Chromium 149. Default-Lax is not “Strict” and not “None”.|||VI: Đo hai lần: form-post mang "unset" vài giây sau đăng nhập, không mang sau 125 s; hàng "(unset), none" của ma trận CSRF cho thấy form đã đổi email còn fetch nhận 401. Node.js 8.4 thấy y hệt trên Chromium 149. Lax mặc định không phải "Strict" cũng không phải "None". (Bài 3.2, 3.4)',
      },
      {
        question: 'demo3/fixation-naive.js writes the user id into the anonymous session at sign-in. The attacker planted his anonymous sid in An’s browser before she signed in. What did his GET /me return, and what is the fix?|||demo3/fixation-naive.js ghi user id vào phiên ẩn danh khi đăng nhập. Kẻ tấn công đã cài sid ẩn danh của hắn vào trình duyệt An trước khi cô đăng nhập. GET /me của hắn trả gì, và cách sửa là gì?',
        options: [
          '401, because the sid was anonymous when he got it|||401, vì sid còn ẩn danh lúc hắn lấy nó',
          '403, because the sid came from another browser|||403, vì sid đến từ một trình duyệt khác',
          '200 as An only if he also knew her password|||200 với tư cách An chỉ khi hắn biết cả mật khẩu của cô',
          '200 as An; fix: destroy the old session and issue a new id at sign-in — v0.3 then answered 401 for the planted id|||200 với tư cách An; cách sửa: huỷ phiên cũ và cấp id mới khi đăng nhập — v0.3 khi đó trả 401 cho id bị cài',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: That is session fixation: no password, no cracking. The server cannot tell browsers apart, so “403 from another browser” never happens. start() in v0.3 deletes the session the request carried and mints a new token.|||VI: Đó là session fixation: không mật khẩu, không bẻ khoá. Máy chủ không phân biệt được trình duyệt, nên "403 vì trình duyệt khác" không bao giờ xảy ra. start() trong v0.3 xoá phiên request đang mang và tạo token mới. (Bài 3.3)',
      },
      {
        question: 'Cô Lan changes her password on her laptop while also signed in on her phone. What should LabFlow ID do, as in demo3/change-password.sh?|||Cô Lan đổi mật khẩu trên laptop trong khi cũng đang đăng nhập trên điện thoại. LabFlow ID nên làm gì, như demo3/change-password.sh?',
        options: [
          'Require her current password, end every session of hers (2 here), and give the laptop a new session|||Đòi mật khẩu hiện tại, kết thúc mọi phiên của cô (ở đây 2), và cấp cho laptop một phiên mới',
          'Change the password and keep every session, so she is not annoyed|||Đổi mật khẩu và giữ mọi phiên, để cô không phiền',
          'Sign her out on the laptop only|||Chỉ đăng xuất cô trên laptop',
          'Accept the change without the current password, since she is already signed in|||Chấp nhận việc đổi mà không cần mật khẩu hiện tại, vì cô đã đăng nhập rồi',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: A wrong current password got 403 REAUTH_FAILED (a stolen cookie is not enough); success returned signedOutSessions 2 and a fresh cookie. Keeping other sessions would keep a thief’s session alive — the reason she changed the password.|||VI: Sai mật khẩu hiện tại nhận 403 REAUTH_FAILED (cookie bị trộm là chưa đủ); thành công trả signedOutSessions 2 và một cookie mới. Giữ các phiên khác là giữ luôn phiên của kẻ trộm — đúng lý do cô đổi mật khẩu. (Bài 3.3)',
      },
      {
        question: 'A teammate says: “Our API only allows CORS from our own origin, so CSRF is impossible.” Which row of the CSRF matrix disproves it?|||Một bạn cùng nhóm nói: "API chỉ cho CORS từ origin của mình, nên CSRF là không thể." Hàng nào của ma trận CSRF bác bỏ điều đó?',
        options: [
          'Lax, none: both attacks got 401|||Lax, none: cả hai đòn nhận 401',
          'None, token: both attacks got 403|||None, token: cả hai đòn nhận 403',
          'None, none: the attacker’s no-cors fetch got an opaque response, yet the server answered 200 and the email CHANGED|||None, none: fetch no-cors của kẻ tấn công nhận phản hồi mờ đục, vậy mà máy chủ trả 200 và email CHANGED',
          'None, fetch-metadata: An’s own form got 200|||None, fetch-metadata: form của chính An nhận 200',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: CORS decides whether a page may read a response; the simple POST was sent with the cookie and the write happened. The Lax row is tempting but shows SameSite at work, not CORS.|||VI: CORS quyết định một trang có được đọc phản hồi không; POST đơn giản đã được gửi kèm cookie và việc ghi đã xảy ra. Hàng Lax nghe hấp dẫn nhưng cho thấy SameSite đang làm việc, không phải CORS. (Bài 3.4)',
      },
      {
        question: 'v0.3’s csrf() receives a POST with a valid session cookie and Sec-Fetch-Site: same-site (from blog.labflow.example). What does it answer, and why?|||csrf() của v0.3 nhận một POST có cookie phiên hợp lệ và Sec-Fetch-Site: same-site (từ blog.labflow.example). Nó trả gì, và vì sao?',
        options: [
          '200, because same-site means the request comes from LabFlow|||200, vì same-site nghĩa là request đến từ LabFlow',
          '401, because SameSite=Lax cookies are not sent from subdomains|||401, vì cookie SameSite=Lax không được gửi từ subdomain',
          '200, because the Origin header is missing|||200, vì thiếu header Origin',
          '403 — a sibling subdomain is the same site, so SameSite cannot separate it; only same-origin (or none) passes|||403 — subdomain anh em là cùng site, nên SameSite không tách được nó; chỉ same-origin (hoặc none) được qua',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: demo3/csrf-v03.sh: “Sec-Fetch-Site: same-site → 403”. A Lax cookie IS sent on same-site requests, which is exactly why the server-side check must reject them. “Same site = ours” is the trap: a forgotten or taken-over subdomain is not ours.|||VI: demo3/csrf-v03.sh: "Sec-Fetch-Site: same-site → 403". Cookie Lax CÓ được gửi với request cùng site, nên phép kiểm phía máy chủ phải từ chối chúng. "Cùng site = của mình" là cái bẫy: một subdomain bị bỏ quên hay bị chiếm không phải của mình. (Bài 3.4)',
      },
      {
        question: 'demo3/where.mjs signs An out everywhere, then asks each store again. Which answer is right?|||demo3/where.mjs đăng xuất An khỏi mọi nơi, rồi hỏi lại từng kho. Câu nào đúng?',
        options: [
          'All three return null; the signed cookie checks a revocation flag automatically|||Cả ba trả null; cookie có ký tự kiểm một cờ thu hồi',
          'PostgreSQL and Redis return null; the signed cookie still verifies until its own expiry — revoking it needs a denylist, i.e. a lookup again|||PostgreSQL và Redis trả null; cookie có ký vẫn hợp lệ tới hạn của nó — muốn thu hồi cần danh sách chặn, tức là lại phải tra',
          'Only PostgreSQL returns null; Redis keeps the key until its TTL ends|||Chỉ PostgreSQL trả null; Redis giữ khoá tới khi hết TTL',
          'Redis returns null; PostgreSQL keeps the row until VACUUM runs|||Redis trả null; PostgreSQL giữ dòng tới khi VACUUM chạy',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: PG → null, Redis → null (deleteByUser removed the keys and the per-user set), signed → {"userId":"usr_1",…}. A signed cookie has no server state to delete; the lookup you saved (5 µs vs ~360–470 µs here) is the revocation you lost.|||VI: PG → null, Redis → null (deleteByUser xoá các khoá và tập theo người dùng), có ký → {"userId":"usr_1",…}. Cookie có ký chẳng có trạng thái nào trên máy chủ để xoá; lần tra bạn tiết kiệm được (5 µs so với ~360–470 µs ở đây) chính là khả năng thu hồi bạn đánh mất. (Bài 3.5)',
      },
    ],
  },
};
