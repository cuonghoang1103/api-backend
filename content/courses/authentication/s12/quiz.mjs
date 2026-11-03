/**
 * Authentication · Chương 12 · BÀI KIỂM CUỐI KHOÁ (20 câu, cả khoá). Slug giữ: auth-12-6-kiem-cuoi-khoa.
 * Đáp án rải mỗi chữ 5 lần: A câu 1,5,9,13,17 · B 2,6,10,14,18 · C 3,7,11,15,19 · D 4,8,12,16,20.
 */
export default {
  title: 'Final exam — Authentication|||Bài kiểm cuối khoá — Authentication',
  slug: 'auth-12-6-kiem-cuoi-khoa',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Hai mươi câu tình huống trải cả khoá Authentication (Chương 1–12) trên LabFlow ID: mật mã, mật khẩu, phiên, JWT, refresh, vòng đời, MFA/passkey, OIDC, phân quyền, tấn công, vận hành, chẩn đoán — có giải thích từng câu và chỉ chương.',
  content: `
<div class="ml-en">
<span class="eyebrow">Final exam</span>
<h2>Final exam — the whole course</h2>
<p class="lead">Twenty scenarios across all twelve chapters of Authentication, on LabFlow ID. Every explanation says why the right answer is right, why the most tempting wrong one is wrong, and which chapter it comes from. 30 minutes.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Bài kiểm cuối khoá</span>
<h2>Bài kiểm cuối khoá — cả khoá học</h2>
<p class="lead">Hai mươi tình huống trải cả mười hai chương Authentication, trên LabFlow ID. Câu nào cũng giải thích vì sao đáp án đúng là đúng, vì sao phương án sai hấp dẫn nhất sai, và nó từ chương nào. 30 phút.</p>
</div>
`,
  quiz: {
    timeLimitSeconds: 1800,
    questions: [
      {
        question: 'Comparing a submitted session token to the stored one with ===, you risk what, and what fixes it?|||So một token phiên gửi lên với cái đã lưu bằng ===, bạn liều gì, và cái gì sửa nó?',
        options: [
          'A timing side-channel that leaks the token byte by byte — use a constant-time comparison', 'Nothing; === is already constant-time in JavaScript', 'A type error if the token is a number — cast it first', 'Slower performance — cache the comparison result'],
        correctIndex: 0, points: 1,
        explanation: 'EN: String === short-circuits on the first differing byte, leaking length/content by timing; compare in constant time (1.3). VI: === chuỗi dừng ở byte khác đầu tiên, rò độ dài/nội dung theo thời gian; so bằng hằng thời gian (1.3).',
      },
      {
        question: 'A database dump leaks the users table. Which stored form resists cracking best?|||Một dump cơ sở dữ liệu lộ bảng users. Dạng lưu nào kháng bẻ tốt nhất?',
        options: [
          'SHA-256 of the password', 'argon2id with a per-user salt and tuned cost', 'The password XOR a fixed key', 'MD5 with a global pepper'],
        correctIndex: 1, points: 1,
        explanation: 'EN: Fast hashes (SHA-256/MD5) fall to GPUs; argon2id is slow, memory-hard and salted per user (2.2). VI: Hàm nhanh (SHA-256/MD5) gục trước GPU; argon2id chậm, nặng bộ nhớ và có muối mỗi người (2.2).',
      },
      {
        question: 'Your login endpoint returns "no such email" for unknown addresses and "wrong password" for known ones. What leaks?|||Endpoint đăng nhập trả "không có email" cho địa chỉ lạ và "sai mật khẩu" cho cái biết. Cái gì rò?',
        options: [
          'Nothing — clearer errors are better UX', 'The password hash', 'Which emails are registered — account enumeration; return one message and equalise timing', 'The session id'],
        correctIndex: 2, points: 1,
        explanation: 'EN: Different messages (and timing) reveal which accounts exist; use one message and constant timing (6.4, 2.3). VI: Thông điệp (và thời gian) khác nhau lộ tài khoản nào tồn tại; dùng một thông điệp và thời gian hằng (6.4, 2.3).',
      },
      {
        question: 'Where should a browser session token live to resist XSS and network theft?|||Một token phiên nên sống ở đâu trong trình duyệt để kháng XSS và trộm mạng?',
        options: [
          'localStorage, for persistence across tabs', 'A URL query parameter', 'A plain JavaScript variable', 'A __Host-, HttpOnly, Secure cookie'],
        correctIndex: 3, points: 1,
        explanation: 'EN: HttpOnly blocks XSS reads, Secure blocks plaintext, __Host- scopes it; localStorage/URL/JS var are all JS-readable or leak (3.2, 10.3). VI: HttpOnly chặn XSS đọc, Secure chặn trần, __Host- gắn phạm vi; localStorage/URL/biến JS đều đọc-được-bằng-JS hoặc rò (3.2, 10.3).',
      },
      {
        question: 'A JWT library decodes a token with header alg:"none" and no signature. Should the server accept it?|||Một thư viện JWT giải một token với header alg:"none" và không chữ ký. Máy chủ nên nhận không?',
        options: [
          'No — reject alg:none and pin the expected algorithm, or anyone forges any token', 'Yes, if the payload looks valid', 'Yes, alg:none is for internal services', 'Only if it is also unexpired'],
        correctIndex: 0, points: 1,
        explanation: 'EN: alg:none means "no signature" — accepting it lets anyone mint any token; pin the algorithm (4.2). VI: alg:none nghĩa là "không chữ ký" — nhận nó để ai cũng đúc bất kỳ token nào; ghim thuật toán (4.2).',
      },
      {
        question: 'A refresh token is presented that was already used (rotated away). What should happen?|||Một refresh token đã dùng rồi (đã xoay đi) được trình ra. Nên xảy ra gì?',
        options: [
          'Issue a new access token as usual', 'Treat it as theft — revoke the whole token family and force re-auth', 'Ignore it silently', 'Extend its expiry'],
        correctIndex: 1, points: 1,
        explanation: 'EN: A replayed rotated refresh means the token was stolen; revoke the family (reuse detection) (5.2). VI: Một refresh đã xoay bị phát lại nghĩa là token bị trộm; thu hồi họ (phát hiện tái dùng) (5.2).',
      },
      {
        question: 'A password-reset link uses a token that can be redeemed more than once. What is the fix?|||Một link đặt lại mật khẩu dùng một token đổi được nhiều lần. Cách sửa là gì?',
        options: [
          'Make the token longer', 'Email the token twice for reliability', 'Make it one-time and consume it atomically (UPDATE ... WHERE used_at IS NULL RETURNING)', 'Shorten its expiry to one minute'],
        correctIndex: 2, points: 1,
        explanation: 'EN: A multi-use reset token is a TOCTOU risk; a one-time, atomic consume lets exactly one redemption win (6.3, 10.5). VI: Một token đặt lại nhiều-lần là rủi ro TOCTOU; một consume một-lần, nguyên tử để đúng một lần đổi thắng (6.3, 10.5).',
      },
      {
        question: 'An attacker runs an AiTM phishing relay and the victim has TOTP enabled. What survives the relay?|||Một kẻ tấn công chạy một relay lừa đảo AiTM và nạn nhân bật TOTP. Cái gì sống qua relay?',
        options: [
          'TOTP, because the code changes every 30 seconds', 'The password, because it is hashed', 'Nothing — TOTP and the password are both relayed', 'A passkey, because its signature is bound to the origin'],
        correctIndex: 3, points: 1,
        explanation: 'EN: The relay replays the password and the OTP; only an origin-bound passkey is rejected for the wrong origin (10.2, 7.4). VI: Relay phát lại mật khẩu và OTP; chỉ một passkey gắn-origin bị từ chối vì sai origin (10.2, 7.4).',
      },
      {
        question: 'A "Sign in with LabFlow" client reads the user id out of the ACCESS token to decide who they are. What is wrong?|||Một client "Đăng nhập bằng LabFlow" đọc id người dùng ra từ ACCESS token để quyết định họ là ai. Sai ở đâu?',
        options: [
          'The access token is for the resource server and may be opaque; identity comes from the verified ID token', 'Access tokens are too short to hold an id', 'Access tokens cannot be decoded', 'Nothing — access tokens always carry identity'],
        correctIndex: 0, points: 1,
        explanation: 'EN: Authenticating with an access token is a classic bypass — use the ID token\'s verified claims (8.4). VI: Xác thực bằng một access token là một cú bypass kinh điển — dùng claim đã xác minh của ID token (8.4).',
      },
      {
        question: 'An ADMIN of tenant FPT-HN requests a booking that belongs to tenant FPT-HCM. What must the gate return?|||Một ADMIN của tenant FPT-HN yêu cầu một lượt đặt thuộc tenant FPT-HCM. Cổng phải trả gì?',
        options: [
          '200, because ADMIN can do anything', '404 — the tenant boundary is checked before any role, and a 403 would leak that the resource exists', '403 Forbidden with a clear reason', '500, because tenants should never mix'],
        correctIndex: 1, points: 1,
        explanation: 'EN: Tenant is checked first (even for ADMIN) and cross-tenant answers 404 to avoid enumeration (9.4). VI: Tenant kiểm trước (kể cả ADMIN) và khác tenant trả 404 để tránh dò (9.4).',
      },
      {
        question: 'To stop credential stuffing without locking real users, what should the defence do on a single mistyping account?|||Để chặn nhồi mật khẩu mà không khoá người thật, phòng thủ nên làm gì với một tài khoản đơn lẻ gõ sai?',
        options: [
          'Block the account after 5 failures', 'Email the account owner a warning', 'Challenge it (CAPTCHA/PoW), never hard-block — blocking a single account is the attacker\'s DoS', 'Delete the account'],
        correctIndex: 2, points: 1,
        explanation: 'EN: Account lockout lets the attacker DoS every user; challenge the account, block the IP/spread (10.1). VI: Khoá tài khoản để kẻ tấn công DoS mọi người; thách đố tài khoản, chặn IP/độ lan (10.1).',
      },
      {
        question: 'Your audit logging writes the whole event object, including the reset token and new password. Why is that dangerous?|||Việc log kiểm toán của bạn ghi cả object sự kiện, gồm token đặt lại và mật khẩu mới. Vì sao nguy hiểm?',
        options: [
          'The log file grows too large', 'It is slower than logging fewer fields', 'Timestamps become inaccurate', 'A token and a plaintext password now sit in the log store forever — a second breach; drop secrets with an allow-list'],
        correctIndex: 3, points: 1,
        explanation: 'EN: A logged secret is read by everyone with log access and kept for months; allow-list the safe fields (11.4). VI: Một bí mật bị log được đọc bởi mọi ai có quyền log và giữ hàng tháng; allow-list các trường an toàn (11.4).',
      },
      {
        question: 'You rotate the JWT signing key by swapping it and restarting. Users report everyone was logged out. Why?|||Bạn xoay khoá ký JWT bằng cách tráo và khởi động lại. Người dùng báo tất cả bị đăng xuất. Vì sao?',
        options: [
          'Every token signed with the old key became invalid at once; rotate with an overlap (both keys live)', 'The database was wiped', 'The restart cleared all cookies', 'The new key is too long'],
        correctIndex: 0, points: 1,
        explanation: 'EN: A hard swap invalidates all old-key tokens; keep both keys live until old tokens expire (11.2). VI: Một cú tráo cứng vô hiệu mọi token khoá cũ; giữ cả hai khoá sống tới khi token cũ hết hạn (11.2).',
      },
      {
        question: 'A login route returns 404, but the handler is clearly in the source code. Most likely cause?|||Một tuyến đăng nhập trả 404, nhưng handler rõ ràng có trong mã nguồn. Nguyên nhân khả dĩ nhất?',
        options: [
          'The password hashing is misconfigured', 'A stale or partial build — the running image lacks the route; redeploy a clean build', 'The user is forbidden', 'The token expired'],
        correctIndex: 1, points: 1,
        explanation: 'EN: 404 on a route that exists in source is almost always a stale/partial build, not a code bug (12.1). VI: 404 trên một tuyến có trong nguồn gần như luôn là một build cũ/một phần, không phải lỗi mã (12.1).',
      },
      {
        question: 'Login works, then every request 401s exactly ~15 minutes later. Which failure shape is this?|||Đăng nhập chạy, rồi mọi request 401 đúng ~15 phút sau. Đây là dáng hỏng nào?',
        options: [
          'A cookie SameSite problem', 'A stale build', 'The access token expired and refresh is broken — the 15-minute clock is the tell', 'A database outage'],
        correctIndex: 2, points: 1,
        explanation: 'EN: The exact 15-minute clock is the access-token lifetime; refresh is broken, not the login (12.2, 5.1). VI: Cái đồng hồ 15 phút chính xác là vòng đời access token; refresh hỏng, không phải đăng nhập (12.2, 5.1).',
      },
      {
        question: 'A teammate decodes a JWT, sees sub:"admin", and treats the request as an admin. What is the error?|||Một đồng đội giải một JWT, thấy sub:"admin", và coi request là admin. Lỗi là gì?',
        options: [
          'The token is too short to be an admin', 'Decoding is slow', 'JWTs cannot contain "admin"', 'Decoding only READS; anyone can forge an unsigned token — only the verified signature authorizes'],
        correctIndex: 3, points: 1,
        explanation: 'EN: A decoded token is unverified; authorize on the verified signature, decode only to diagnose (12.3, 4.1). VI: Một token đã giải là chưa xác minh; phân quyền trên chữ ký đã xác minh, giải chỉ để chẩn đoán (12.3, 4.1).',
      },
      {
        question: 'You inherit an auth service for a security review. What do you look at first, and why?|||Bạn thừa kế một dịch vụ xác thực cho một lần soát bảo mật. Nhìn cái gì trước, và vì sao?',
        options: [
          'The authorization gate — is there ONE, deny-by-default, on every write route; Broken Access Control is OWASP #1', 'The variable naming conventions', 'The length of the functions', 'The commit message style'],
        correctIndex: 0, points: 1,
        explanation: 'EN: Review highest-risk first; the one gate (or its absence) is where the real bugs are (12.4, 9.5). VI: Soát rủi-ro-cao trước; một cổng (hay sự vắng mặt của nó) là nơi lỗi thật ở (12.4, 9.5).',
      },
      {
        question: 'After verifying a federated ID token once, what should a client do for subsequent requests?|||Sau khi xác minh một ID token liên kết một lần, client nên làm gì cho các request sau?',
        options: [
          'Re-run the full OAuth flow on every request', 'Start its OWN session (Chapter 3) and run that; the federated login is a moment, not a session', 'Store the ID token as the session cookie', 'Call the provider on every request to re-check'],
        correctIndex: 1, points: 1,
        explanation: 'EN: The ID token is a one-time identity statement; verify once, then run your own session (8.5, 3.1). VI: ID token là một lời khai danh tính một lần; xác minh một lần, rồi chạy phiên của mình (8.5, 3.1).',
      },
      {
        question: 'Your rate limiter is an in-memory counter set to 100/min, running on 4 instances. What is the real limit, and the fix?|||Bộ giới hạn của bạn là một cái đếm trong bộ nhớ đặt 100/phút, chạy trên 4 instance. Giới hạn thật, và cách sửa?',
        options: [
          '25/min; add more instances', '100/min; it is already correct', '~400/min; share one counter in Redis so every instance sees it', 'Unlimited; add a database'],
        correctIndex: 2, points: 1,
        explanation: 'EN: Each node counts its own ~1/4, so the real cap is ~4×; a shared counter holds the real limit (11.3). VI: Mỗi node đếm ~1/4 của nó, nên trần thật là ~4×; một cái đếm chung giữ giới hạn thật (11.3).',
      },
      {
        question: 'Starting a new product that needs login, what is the best default — and what did this course actually change for you?|||Bắt đầu một sản phẩm mới cần đăng nhập, mặc định tốt nhất là gì — và khoá này thật sự đổi gì cho bạn?',
        options: [
          'Hand-roll your own auth to control everything', 'Copy another team\'s code without review', 'Store passwords in plaintext for easy debugging', 'Adopt a vetted library/provider; the course lets you choose, configure and debug it correctly — and offer passkeys'],
        correctIndex: 3, points: 1,
        explanation: 'EN: Understand auth to adopt and operate a vetted one well, not to ship your own crypto; passkeys are the biggest real change (12.5). VI: Hiểu xác thực để dùng và vận hành một cái đã kiểm tốt, không phải ship mật mã của mình; passkey là thay đổi thật lớn nhất (12.5).',
      },
    ],
  },
};
