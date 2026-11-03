/**
 * Authentication · Chương 10 · Quiz (10 câu tình huống trên LabFlow ID v0.10). Slug giữ: auth-10-6-quiz.
 * Đáp án rải: A ×3 (câu 1, 6, 10) · B ×2 (câu 3, 7) · C ×3 (câu 2, 5, 9) · D ×2 (câu 4, 8).
 */
export default {
  title: 'Quiz: the attacks|||Quiz: các cú tấn công',
  slug: 'auth-10-6-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười câu tình huống trên LabFlow ID v0.10 về Chương 10: nhồi tín vật và DoS khoá-tài-khoản, relay AiTM và gắn-origin, bốn kênh cắp phiên, mệt mỏi MFA và ghép số, SIM swap, chiếm-trước và nối-theo-sub, đua TOCTOU và consume nguyên tử — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Check</span>
<h2>Chapter 10 check</h2>
<p class="lead">Ten scenarios on LabFlow ID v0.10 under attack. Every explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can defend credential stuffing without locking real users.</li>
<li>I can say why an AiTM relay defeats OTP and a passkey defeats the relay.</li>
<li>I can name the four session-theft channels and what closes each.</li>
<li>I can stop MFA fatigue and explain why SMS is the weak factor.</li>
<li>I can describe pre-hijacking and fix a TOCTOU race atomically.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Kiểm tra Chương 10</h2>
<p class="lead">Mười tình huống trên LabFlow ID v0.10 bị tấn công. Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi phòng thủ được nhồi tín vật mà không khoá người thật.</li>
<li>Tôi nói được vì sao một relay AiTM đánh bại OTP và một passkey đánh bại relay.</li>
<li>Tôi gọi tên được bốn kênh cắp phiên và cái gì đóng mỗi kênh.</li>
<li>Tôi chặn được mệt mỏi MFA và giải thích vì sao SMS là yếu tố yếu.</li>
<li>Tôi mô tả được chiếm-trước và sửa một cuộc đua TOCTOU một cách nguyên tử.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'Your login is hit by millions of email/password pairs from an unrelated breach. What is this, and why does it work?|||Trang đăng nhập của bạn bị hàng triệu cặp email/mật khẩu từ một vụ lộ không liên quan dội vào. Đây là gì, và vì sao nó chạy?',
        options: [
          'Credential stuffing — it works because people reuse passwords across sites', 'A brute-force attack — it works by trying every possible password', 'A SQL injection — it works by breaking the database query', 'A phishing attack — it works by tricking the user into typing their password'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Replaying leaked pairs is credential stuffing; the bet is password reuse — the leak came from elsewhere (10.1). VI: Phát lại các cặp rò là nhồi tín vật; cái cược là dùng lại mật khẩu — vụ lộ đến từ nơi khác (10.1).',
      },
      {
        question: 'A teammate proposes "lock the account after 5 failed logins" to stop stuffing. What is the problem?|||Một đồng đội đề xuất "khoá tài khoản sau 5 lần đăng nhập sai" để chặn nhồi. Vấn đề là gì?',
        options: [
          'It is too slow to check the failure count on every request', 'Five is too high; real attacks need a lower threshold to be stopped', 'The attacker can now lock every real user on purpose — a denial-of-service you built', 'Nothing — account lockout is the recommended defence against stuffing'],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Lockout turns against real users: fail an account five times and it is locked, no password needed. Defend the IP/spread, challenge the account (10.1). VI: Khoá quay ngược vào người thật: làm sai một tài khoản năm lần là nó bị khoá, không cần mật khẩu. Phòng thủ IP/độ lan, thách đố tài khoản (10.1).',
      },
      {
        question: 'A victim logs in on login.labflovv.example, a relay forwarding to the real LabFlow ID. They have TOTP enabled. What happens?|||Nạn nhân đăng nhập trên login.labflovv.example, một relay chuyển tiếp tới LabFlow ID thật. Họ bật TOTP. Điều gì xảy ra?',
        options: [
          'The TOTP code stops the attack because it changes every 30 seconds', 'The relay captures the password AND the TOTP code and replays both — the session is stolen', 'TLS prevents the relay from reading anything the victim sends', 'The attack fails because the victim would notice the wrong URL'],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A TOTP code is a replayable secret; the relay forwards it in real time and keeps the session. OTP is not phishing-resistant (10.2). VI: Một mã TOTP là một bí mật phát lại được; relay chuyển nó theo thời gian thực và giữ phiên. OTP không kháng lừa đảo (10.2).',
      },
      {
        question: 'Why does a passkey defeat the AiTM relay that TOTP does not?|||Vì sao một passkey đánh bại relay AiTM mà TOTP không?',
        options: [
          'Passkeys use a longer code that the relay cannot forward in time', 'Passkeys are stored on the phone, which the relay cannot reach', 'Passkeys require biometrics, which the relay cannot fake', 'The assertion is signed over the phishing origin; the real server checks expectedOrigin and rejects it'],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Origin binding — the WebAuthn signature is over the domain the browser is on (the phishing one), and the real RP demands its own origin (10.2, 7.4). VI: Gắn origin — chữ ký WebAuthn là trên tên miền trình duyệt đang ở (tên miền lừa đảo), và RP thật đòi origin của mình (10.2, 7.4).',
      },
      {
        question: 'Where is a session token safe from XSS, the network, and URL/log leaks all at once?|||Một token phiên an toàn trước XSS, mạng, và rò URL/log cùng một lúc ở đâu?',
        options: [
          'In localStorage, because it persists across tabs', 'In the URL, so it is always available to the request', 'In a __Host-, HttpOnly, Secure cookie', 'In a JavaScript variable in memory'],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: HttpOnly blocks XSS, Secure blocks the network, and a cookie (not a URL) avoids log/Referer leaks. localStorage is JS-readable (10.3). VI: HttpOnly chặn XSS, Secure chặn mạng, và một cookie (không URL) tránh rò log/Referer. localStorage đọc-được-bằng-JS (10.3).',
      },
      {
        question: 'An attacker with the victim\'s password spams "Approve this login?" prompts until the victim taps yes. What stops this?|||Một kẻ tấn công có mật khẩu nạn nhân spam lời nhắc "Duyệt lần đăng nhập này?" cho tới khi nạn nhân bấm có. Cái gì chặn được?',
        options: [
          'Number matching — the victim must type a number shown only on the attacker\'s login screen', 'Sending the prompts faster so the victim cannot keep up', 'Allowing unlimited prompts so the victim gets used to them', 'Switching the second factor to SMS codes'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: The number is on the attacker\'s screen, which the victim never sees, so a tap is not enough. SMS would be weaker, not stronger (10.4). VI: Số nằm trên màn hình kẻ tấn công, cái nạn nhân không thấy, nên một cái bấm không đủ. SMS sẽ yếu hơn, không mạnh hơn (10.4).',
      },
      {
        question: 'Why is SMS considered the weak second factor?|||Vì sao SMS bị coi là yếu tố thứ hai yếu?',
        options: [
          'SMS messages are too short to carry a secure code', 'It is SIM-swappable at the carrier, relayable by phishing, and interceptable on the network', 'SMS costs money to send at scale', 'Phones can be set to silent, so the user misses the code'],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: SMS was never built for auth: a SIM swap, a relay, or SS7 interception all defeat it. Prefer TOTP/passkeys; SMS is a fallback (10.4). VI: SMS chưa bao giờ dựng cho xác thực: một SIM swap, một relay, hay chặn SS7 đều đánh bại nó. Ưu tiên TOTP/passkey; SMS là dự phòng (10.4).',
      },
      {
        question: 'A user clicks "Sign in with Google"; a local account with that email already exists, unverified. The naive server attaches the Google login to it. What is the risk?|||Một người dùng bấm "Đăng nhập bằng Google"; một tài khoản local với email đó đã tồn tại, chưa xác minh. Máy chủ ngây thơ gắn đăng nhập Google vào nó. Rủi ro là gì?',
        options: [
          'The user will have two accounts and get confused', 'Google logins are slower than password logins', 'The email will be sent a duplicate verification message', 'Pre-hijacking — an attacker pre-created that unverified account and now shares access; never merge into unverified, link on the sub'],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: An attacker can pre-register the victim\'s email unverified; merging hands them a verified account. Discard the stale record; link on the stable sub (10.5, 8.5). VI: Một kẻ tấn công có thể đăng ký trước email nạn nhân chưa xác minh; gộp trao cho họ một tài khoản đã xác minh. Bỏ bản ghi cũ; nối theo sub ổn định (10.5, 8.5).',
      },
      {
        question: 'Two requests redeem the same one-time reset token at the same instant, and both succeed. What is the correct fix?|||Hai yêu cầu đổi cùng một token đặt lại một-lần cùng một khoảnh khắc, và cả hai thành công. Cách sửa đúng là gì?',
        options: [
          'Add a short delay between requests so they do not overlap', 'Check the token twice before acting on it', 'Make it atomic: UPDATE ... SET used_at = now() WHERE id = $1 AND used_at IS NULL RETURNING id', 'Store the token in localStorage so each tab has its own copy'],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: A TOCTOU race: both pass the check before either writes. An atomic UPDATE serialised by the DB lets exactly one win (10.5). VI: Một cuộc đua TOCTOU: cả hai qua phép kiểm trước khi một trong hai ghi. Một UPDATE nguyên tử do DB tuần tự hoá để đúng một thắng (10.5).',
      },
      {
        question: 'Across Chapter 10, what single idea explains why a strong login is not enough on its own?|||Suốt Chương 10, một ý tưởng duy nhất nào giải thích vì sao một đăng nhập mạnh một mình là chưa đủ?',
        options: [
          'The attacker takes the weakest path in — a stolen session, a relayed factor, a soft help desk, a pre-made account — not the strong front door', 'Passwords can always be brute-forced given enough time', 'Encryption algorithms become weaker every year', 'Users will always choose the same password for every site'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Every attack in the chapter bypasses the login — session theft, AiTM, fatigue, pre-hijacking, races. Audit every path IN, not just the front door (10.1–10.5). VI: Mọi cú tấn công trong chương vượt qua đăng nhập — cắp phiên, AiTM, mệt mỏi, chiếm-trước, đua. Soát mọi đường VÀO, không chỉ cửa trước (10.1–10.5).',
      },
    ],
  },
};
