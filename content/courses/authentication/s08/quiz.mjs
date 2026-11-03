/**
 * Authentication · Chương 8 · Quiz (10 câu tình huống trên LabFlow ID v0.8). Slug giữ: auth-8-6-quiz.
 * Đáp án rải: A ×3 (câu 1, 5, 9) · B ×2 (câu 4, 8) · C ×2 (câu 3, 7) · D ×3 (câu 2, 6, 10).
 */
export default {
  title: '8.6 — Quiz: OAuth 2.1 and OpenID Connect|||8.6 — Quiz: OAuth 2.1 và OpenID Connect',
  slug: 'auth-8-6-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười câu tình huống trên LabFlow ID v0.8 về Chương 8: OAuth vs OIDC, bốn vai, luồng code+PKCE, PKCE chặn trộm code, state/nonce/redirect_uri, ID vs access token, bảy phép kiểm, nối theo sub — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Check</span>
<h2>Chapter 8 check</h2>
<p class="lead">Ten scenarios from LabFlow ID v0.8 as an OIDC provider and LabFlow API as its client. Every explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say what OAuth delegates and how OIDC adds identity.</li>
<li>I can trace the authorization code + PKCE flow and say what PKCE binds.</li>
<li>I can name the attack state, nonce and redirect_uri each stop.</li>
<li>I can tell an ID token from an access token and list the seven checks.</li>
<li>I can explain why you link a federated account on the sub, not the email.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Kiểm tra Chương 8</h2>
<p class="lead">Mười tình huống trên LabFlow ID v0.8 là một OIDC provider và LabFlow API là client của nó. Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được OAuth uỷ quyền cái gì và OIDC thêm danh tính ra sao.</li>
<li>Tôi lần được luồng authorization code + PKCE và nói PKCE gắn gì.</li>
<li>Tôi gọi được tên cú tấn công state, nonce và redirect_uri mỗi cái chặn.</li>
<li>Tôi phân biệt được ID token với access token và liệt kê bảy phép kiểm.</li>
<li>Tôi giải thích được vì sao nối một tài khoản liên kết theo sub, không theo email.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A teammate says "we use OAuth to log users in". What is the precise correction?|||Một đồng đội nói "chúng tôi dùng OAuth để đăng nhập người dùng". Chỉnh lại cho chính xác là gì?',
        options: [
          'OAuth is authorization (delegated access); logging a user in is OpenID Connect, which adds an ID token on top', 'OAuth and OIDC are the same thing with different names', 'OAuth logs users in; OIDC is only for mobile apps', 'OAuth is for sessions; OIDC is for API keys'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: OAuth delegates access; it never says who the user is. OIDC adds an ID token for identity — that is what "login" needs (8.1). VI: OAuth uỷ quyền truy cập; nó không bao giờ nói người dùng là ai. OIDC thêm một ID token cho danh tính — đó là cái "đăng nhập" cần (8.1).',
      },
      {
        question: 'In the LabFlow flow, which component is the client (relying party)?|||Trong luồng LabFlow, thành phần nào là client (relying party)?',
        options: ['LabFlow ID', 'The user An', 'The browser', 'LabFlow API — it wants to act for the user and never sees the password'],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: LabFlow ID is the authorization server/provider; LabFlow API is the client that obtains tokens; An is the resource owner (8.1). VI: LabFlow ID là máy chủ uỷ quyền/provider; LabFlow API là client lấy token; An là chủ tài nguyên (8.1).',
      },
      {
        question: 'An attacker intercepts the authorization code from the browser. With PKCE, can they redeem it?|||Một kẻ tấn công chặn mã uỷ quyền từ trình duyệt. Với PKCE, chúng đổi được không?',
        options: [
          'Yes — the code is all you need', 'Yes, if they also know the client id', 'No — redeeming needs the code_verifier, which never left the client; demo8 shows a wrong verifier → invalid_grant', 'No — the code is encrypted'],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: PKCE binds the code to the verifier the client kept; without it the token endpoint returns invalid_grant (8.2). VI: PKCE gắn code với verifier client giữ; thiếu nó token endpoint trả invalid_grant (8.2).',
      },
      {
        question: 'What does the state parameter defend, and who checks it?|||Tham số state phòng gì, và ai kiểm nó?',
        options: [
          'ID-token replay; the provider checks it', 'CSRF on the callback; the CLIENT issues a random state and checks the callback echoes the same one', 'Code theft; the resource server checks it', 'Nothing — it is just a correlation id for logs'],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: state stops login-CSRF: the client ties it to a login it started and rejects a callback it did not issue (8.3). VI: state chặn login-CSRF: client gắn nó với một đăng nhập nó bắt đầu và từ chối một callback nó không phát (8.3).',
      },
      {
        question: 'A client is handed an ID token that is validly signed and unexpired, but its nonce is not the one the client sent. What should happen?|||Một client nhận một ID token ký hợp lệ và chưa hết hạn, nhưng nonce của nó không phải cái client gửi. Nên xảy ra gì?',
        options: [
          'Reject it (bad_nonce) — the nonce ties the token to THIS login, so a mismatch means a replay from another session', 'Accept it — the signature is valid', 'Accept it but downgrade the session', 'Reject it only if it is also expired'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: A valid signature is not enough; the nonce binds the token to the client\'s own login request, defeating replay (8.3, 8.4). VI: Một chữ ký hợp lệ chưa đủ; nonce gắn token với yêu cầu đăng nhập của chính client, đánh bại phát lại (8.3, 8.4).',
      },
      {
        question: 'The provider is asked to send the code to redirect_uri=https://app.labflow.example.evil.com. What must it do?|||Provider được yêu cầu gửi code tới redirect_uri=https://app.labflow.example.evil.com. Nó phải làm gì?',
        options: [
          'Redirect there with an error', 'Accept it — it starts with the right domain', 'Send the code; the client will sort it out', 'Reject with 400 and NOT redirect — redirect_uri is matched exactly against the registered list; a prefix match is an open redirect'],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Exact match only; a prefix/substring match hands the code to the attacker, and an invalid redirect must not itself be redirected to (8.3). VI: Chỉ khớp chính xác; một khớp tiền tố/chuỗi con trao code cho kẻ tấn công, và một redirect không hợp lệ không được tự redirect tới (8.3).',
      },
      {
        question: 'Your client reads the user\'s id out of the ACCESS token to decide who they are. What is wrong?|||Client của bạn đọc id người dùng ra từ ACCESS token để quyết định họ là ai. Sai ở đâu?',
        options: [
          'Nothing — access tokens always carry the user id', 'It is slower than reading the ID token', 'The access token is for the resource server and may be opaque; identity comes from the ID token\'s verified claims', 'Access tokens cannot be decoded'],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Authenticating with an access token is a classic bypass — it is the API\'s token, not an identity statement. Use the ID token (8.4). VI: Xác thực bằng một access token là một cú bypass kinh điển — đó là token của API, không phải một lời khai danh tính. Dùng ID token (8.4).',
      },
      {
        question: 'Of the seven ID-token checks, which one\'s omission lets anyone forge a token for any user?|||Trong bảy phép kiểm ID token, bỏ cái nào để ai cũng giả một token cho bất kỳ người dùng nào?',
        options: ['The exp check', 'The signature check (verified against the provider\'s JWKS by kid)', 'The iat check', 'The nonce check'],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Without the signature check a forged, unsigned token is accepted — the "yeu" client\'s exact bug. Verify by kid against the JWKS (8.4, 4.4). VI: Không kiểm chữ ký thì một token giả, không ký được nhận — đúng lỗi của client "yếu". Kiểm theo kid với JWKS (8.4, 4.4).',
      },
      {
        question: 'You add "Sign in with LabFlow" and link accounts by matching the email in the ID token. Why is this dangerous?|||Bạn thêm "Đăng nhập bằng LabFlow" và nối tài khoản bằng cách khớp email trong ID token. Vì sao nguy hiểm?',
        options: [
          'If the email is unverified or can change, an attacker registers your address at the provider and is handed your local account — link on the stable sub instead', 'Emails are too long to index', 'The ID token does not contain an email', 'It is fine; email is always unique'],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Link on the provider\'s stable sub; email-linking is a takeover unless email_verified is enforced and changes re-confirmed (8.5). VI: Nối theo sub ổn định của provider; nối-email là một cú chiếm trừ khi ép email_verified và xác nhận lại khi đổi (8.5).',
      },
      {
        question: 'After the ID token verifies, your client keeps calling the provider on every request to check the user is still valid. What is the better design?|||Sau khi ID token xác minh, client của bạn cứ gọi provider mỗi request để kiểm người dùng còn hợp lệ. Thiết kế tốt hơn là gì?',
        options: [
          'Call the provider twice per request for safety', 'Store the ID token and send it as the session cookie', 'Re-run the full OAuth flow on every page', 'Start your OWN session (Chapter 3) after verifying once; the federated login is a moment, your session is the state'],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: The ID token is a one-time identity statement, not a session. Verify once, then run your own session; do not hammer the provider or store the token as a session (8.5). VI: ID token là một lời khai danh tính một lần, không phải một phiên. Xác minh một lần, rồi chạy phiên của mình; đừng dội provider hay lưu token làm phiên (8.5).',
      },
    ],
  },
};
