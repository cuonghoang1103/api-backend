/**
 * Authentication · Chương 4 · Quiz (10 câu tình huống trên LabFlow ID v0.4, số đo của chương). Slug giữ: auth-4-6-quiz.
 * Đáp án rải: A ×2 (câu 4, 9) · B ×3 (câu 1, 6, 10) · C ×2 (câu 3, 7) · D ×3 (câu 2, 5, 8).
 */
export default {
  title: '4.6 — Quiz: JWT|||4.6 — Quiz: JWT',
  slug: 'auth-4-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống trên LabFlow ID v0.4 về Chương 4: giải mã base64url, alg none, nhầm lẫn HS/RS, bảy claim, biên exp với dung sai, thu hồi và denylist jti, xoay khoá hai bản, kid không phải đường dẫn, JWKS công khai, và cất token trong trình duyệt — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Check</span>
<h2>Chapter 4 check</h2>
<p class="lead">Ten scenarios from LabFlow ID v0.4, with the numbers and codes you measured in this chapter. Every explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can decode a JWT by hand and say why that proves nothing.</li>
<li>I can stop <code>alg: none</code> and HS/RS confusion by taking the algorithm from the key.</li>
<li>I can name the attack each skipped claim allows, and enforce exp with clock skew.</li>
<li>I can publish a JWKS and rotate a key with no downtime.</li>
<li>I can choose where a browser keeps a token and name its attack.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Kiểm tra Chương 4</h2>
<p class="lead">Mười tình huống từ LabFlow ID v0.4, dùng đúng những con số và mã bạn đã đo trong chương. Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải mã được một JWT bằng tay và nói được vì sao điều đó chẳng chứng minh gì.</li>
<li>Tôi chặn được <code>alg: none</code> và nhầm lẫn HS/RS bằng cách lấy thuật toán từ khoá.</li>
<li>Tôi gọi được tên cú tấn công mỗi claim bị bỏ cho phép, và áp exp với dung sai đồng hồ.</li>
<li>Tôi công bố được một JWKS và xoay một khoá không ngừng dịch vụ.</li>
<li>Tôi chọn được chỗ trình duyệt cất token và gọi tên cú tấn công của nó.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'An opens her LabFlow access token in jwt.io and reads sub and role with no key. What has she proven about the token?|||An mở access token của mình trong jwt.io và đọc sub cùng role mà không cần khoá. Cô đã chứng minh được gì về token?',
        options: [
          'That it is encrypted, since only she could open it|||Rằng nó được mã hoá, vì chỉ cô mới mở được',
          'Nothing — the payload is base64url, readable by anyone; only verifying the signature means anything|||Không gì — payload là base64url, ai cũng đọc được; chỉ xác minh chữ ký mới có nghĩa',
          'That the signature is valid, since the JSON parsed|||Rằng chữ ký hợp lệ, vì JSON phân tích được',
          'That she is a LAB_MANAGER, since role says so|||Rằng cô là LAB_MANAGER, vì role ghi thế',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: base64url is transport, not encryption (4.1); decoding needs no key and proves nothing until the signature is verified. Reading role is not the same as the role being true. VI: base64url là vận chuyển, không phải mã hoá (4.1); giải mã không cần khoá và chẳng chứng minh gì tới khi chữ ký được xác minh. Đọc role khác với role là thật.',
      },
      {
        question: 'An attacker takes An’s token, sets the header to {"alg":"none","kid":"ed-2026-11"} and deletes the signature. What does LabFlow ID’s verifier return?|||Kẻ tấn công lấy token của An, đặt header thành {"alg":"none","kid":"ed-2026-11"} và xoá chữ ký. Bộ xác minh của LabFlow ID trả về gì?',
        options: [
          'The claims, because an unsecured JWT needs no signature|||Các claim, vì một JWT không bảo vệ không cần chữ ký',
          'BAD_SIGNATURE, because the signature is empty|||BAD_SIGNATURE, vì chữ ký rỗng',
          'NO_KID, because none has no key id|||NO_KID, vì none không có key id',
          'ALG_MISMATCH, because kid ed-2026-11 is an EdDSA key and the header says none|||ALG_MISMATCH, vì kid ed-2026-11 là một khoá EdDSA còn header nói none',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: LabFlow ID takes the algorithm from the key it looks up by kid (4.2). The key is EdDSA; the header’s none is not EdDSA, so it fails at the algorithm check, before the signature is even considered. VI: LabFlow ID lấy thuật toán từ khoá tra theo kid (4.2). Khoá là EdDSA; none trong header không phải EdDSA, nên nó trượt ở bước kiểm thuật toán, trước cả khi xét chữ ký.',
      },
      {
        question: 'In demo4/confusion.mjs, the attacker signs an HS256 token using LabFlow ID’s public key as the HMAC secret, and a naive verifier accepts it. Why does that work?|||Trong demo4/confusion.mjs, kẻ tấn công ký một token HS256 dùng khoá công khai của LabFlow ID làm bí mật HMAC, và một bộ xác minh ngây thơ chấp nhận. Vì sao chạy được?',
        options: [
          'Because HS256 is weaker than EdDSA|||Vì HS256 yếu hơn EdDSA',
          'Because the attacker guessed the private key|||Vì kẻ tấn công đoán được khoá riêng',
          'Because the naive verifier uses the same public key as the HMAC key, and HMAC verifies with the key it signed with|||Vì bộ xác minh ngây thơ dùng chính khoá công khai làm khoá HMAC, và HMAC kiểm bằng đúng khoá nó đã ký',
          'Because the public key is secret|||Vì khoá công khai là bí mật',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: The public key is published in the JWKS, so it is not secret. A verifier that reads alg from the header will, for an HS256 token, HMAC with that public key — and HMAC uses one key to sign and verify, so the forgery matches (4.2). VI: Khoá công khai công bố trong JWKS nên không bí mật. Một bộ xác minh đọc alg từ header sẽ, với một token HS256, HMAC bằng khoá công khai đó — và HMAC dùng một khoá để ký và kiểm, nên cú giả mạo khớp (4.2).',
      },
      {
        question: 'An access token has exp exactly equal to now. With skewSec = 0, what does the verifier do, and why?|||Một access token có exp đúng bằng now. Với skewSec = 0, bộ xác minh làm gì, và vì sao?',
        options: [
          'Rejects it (EXPIRED): exp is the instant on or after which the token must not be accepted|||Từ chối (EXPIRED): exp là thời điểm mà từ nó trở đi token không được chấp nhận',
          'Accepts it: the token is valid up to and including exp|||Chấp nhận: token hợp lệ tới và gồm cả exp',
          'Rejects it (NOT_YET): nbf has not passed|||Từ chối (NOT_YET): nbf chưa qua',
          'Accepts it for 60 more seconds of grace|||Chấp nhận thêm 60 giây ân hạn',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: RFC 7519: the token MUST NOT be accepted on or after exp, so exp == now is already expired at zero skew (4.3) — the same boundary idea as the session timeouts of Chapter 3. Clock skew would only extend this by the leeway, which is zero here. VI: RFC 7519: token KHÔNG ĐƯỢC chấp nhận tại hoặc sau exp, nên exp == now đã là hết hạn ở dung sai 0 (4.3) — cùng ý biên với các mốc hết hạn phiên ở Chương 3. Dung sai chỉ nới thêm bằng đúng mức cho phép, mà ở đây là 0.',
      },
      {
        question: 'LabFlow ID mints a token with aud = "labflow-chat". The chat service is down, so a developer sends it to LabFlow API instead. What happens, and why does it matter?|||LabFlow ID đúc một token với aud = "labflow-chat". Dịch vụ chat sập, nên một lập trình viên gửi nó tới LabFlow API. Chuyện gì xảy ra, và vì sao nó quan trọng?',
        options: [
          'Accepted: aud is only advisory|||Chấp nhận: aud chỉ mang tính gợi ý',
          'Accepted: same issuer, so same trust|||Chấp nhận: cùng issuer nên cùng mức tin',
          'Rejected (EXPIRED): tokens for other services expire faster|||Từ chối (EXPIRED): token cho dịch vụ khác hết hạn nhanh hơn',
          'Rejected (BAD_AUD): a recipient not named in aud MUST reject the token, so a chat token cannot be spent at the API|||Từ chối (BAD_AUD): người nhận không có tên trong aud PHẢI từ chối token, nên một token chat không tiêu được ở API',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: RFC 7519: if the recipient is not in aud, it MUST reject (4.3). Without the check, one leaked chat token becomes an API token — aud is what keeps a token for one service from working at another. VI: RFC 7519: nếu người nhận không trong aud, PHẢI từ chối (4.3). Thiếu phép kiểm, một token chat bị lộ thành token API — aud là thứ ngăn một token của dịch vụ này chạy ở dịch vụ khác.',
      },
      {
        question: 'A user clicks "log out". LabFlow API adds the token’s jti to its denylist. A separate reporting service shares the same JWKS but keeps its own, empty denylist. Can the reporting service still be used with that token?|||Một người bấm "đăng xuất". LabFlow API thêm jti của token vào denylist của nó. Một dịch vụ báo cáo riêng dùng chung JWKS nhưng giữ denylist riêng, rỗng. Dịch vụ báo cáo còn dùng được token đó không?',
        options: [
          'No, a denylist is global across all services|||Không, một denylist là toàn cục trên mọi dịch vụ',
          'Yes, until the token expires — revocation only applies where the denylist is shared|||Có, tới khi token hết hạn — thu hồi chỉ áp dụng ở nơi denylist được chia sẻ',
          'No, revoking a jti deletes the token everywhere|||Không, thu hồi một jti xoá token ở mọi nơi',
          'Yes, forever, because JWTs cannot be revoked at all|||Có, mãi mãi, vì JWT hoàn toàn không thu hồi được',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A JWT cannot be un-issued; a jti denylist only works where it is shared, and only until exp (4.3). The reporting service never heard of that jti, so it trusts the signature until the 15-minute lifetime ends — the trade-off a session (one DELETE) avoids. "Forever" is wrong because exp still ends it. VI: Một JWT không huỷ phát được; một denylist jti chỉ hiệu lực ở nơi được chia sẻ, và chỉ tới exp (4.3). Dịch vụ báo cáo chưa từng nghe jti đó nên tin chữ ký tới hết tuổi thọ 15 phút — đánh đổi mà một phiên (một DELETE) né được. "Mãi mãi" sai vì exp vẫn kết thúc nó.',
      },
      {
        question: 'LabFlow ID rotates its signing key: it adds kid ed-2026-11 to the JWKS and switches signing to it, while ed-2026-10 is still in the JWKS. What happens to tokens already signed with ed-2026-10?|||LabFlow ID xoay khoá ký: thêm kid ed-2026-11 vào JWKS và chuyển việc ký sang nó, trong khi ed-2026-10 vẫn còn trong JWKS. Token đã ký bằng ed-2026-10 ra sao?',
        options: [
          'They are rejected immediately — only the active key verifies|||Bị từ chối ngay — chỉ khoá đang hoạt động mới xác minh',
          'They must be re-issued by the client|||Client phải xin cấp lại',
          'They keep verifying, because both keys are live in the JWKS during the overlap — no one is signed out|||Vẫn xác minh được, vì cả hai khoá đều sống trong JWKS suốt lúc gối đầu — không ai bị đăng xuất',
          'They verify only if the client clears its JWKS cache|||Chỉ xác minh nếu client xoá cache JWKS',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Zero-downtime rotation keeps two keys live: the new one signs, both verify, and the old one is dropped only after every token it signed has expired (4.4). That is exactly what the kid is for. VI: Xoay vòng không ngừng dịch vụ giữ hai khoá sống: cái mới ký, cả hai kiểm, và cái cũ chỉ bị gỡ sau khi mọi token nó đã ký đều hết hạn (4.4). Đó chính là công dụng của kid.',
      },
      {
        question: 'An attacker sends a token whose header is {"alg":"HS256","kid":"../secrets/app.key"}. LabFlow ID’s verifier returns UNKNOWN_KID. Why is that the safe answer?|||Kẻ tấn công gửi một token có header {"alg":"HS256","kid":"../secrets/app.key"}. Bộ xác minh của LabFlow ID trả UNKNOWN_KID. Vì sao đó là câu trả lời an toàn?',
        options: [
          'Because HS256 is always rejected|||Vì HS256 luôn bị từ chối',
          'Because the file ../secrets/app.key does not exist|||Vì tệp ../secrets/app.key không tồn tại',
          'Because the kid is URL-encoded wrongly|||Vì kid mã hoá URL sai',
          'Because kid is only a property on a fixed keyring object, never a file path — a kid not in the object is rejected, so there is nothing to traverse|||Vì kid chỉ là một thuộc tính trên một object keyring cố định, không bao giờ là đường dẫn tệp — một kid không trong object thì bị từ chối, nên chẳng có gì để lần',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: The kid is attacker input. A verifier that reads keys/&lt;kid&gt; from disk lets the attacker point it at a file they control (4.4). LabFlow ID looks kid up in a plain object; an unknown kid is UNKNOWN_KID, so path traversal has no surface. VI: kid là dữ liệu của kẻ tấn công. Một bộ xác minh đọc keys/&lt;kid&gt; từ đĩa cho kẻ tấn công trỏ vào một tệp họ kiểm soát (4.4). LabFlow ID tra kid trong một object trơn; một kid lạ là UNKNOWN_KID, nên path traversal không có bề mặt.',
      },
      {
        question: 'LabFlow’s front end keeps its access token in localStorage. An XSS runs one line of script on the page. In the Chromium 156 demo, what could that script reach?|||Front end của LabFlow giữ access token trong localStorage. Một XSS chạy một dòng script trên trang. Trong demo Chromium 156, script đó với tới được gì?',
        options: [
          'The localStorage token (it read and exfiltrated it); an HttpOnly cookie would have been invisible to it|||Token trong localStorage (nó đọc và tuồn ra); một cookie HttpOnly thì vô hình với nó',
          'Nothing — localStorage is sandboxed from scripts|||Không gì — localStorage được cách ly khỏi script',
          'Only cookies, never localStorage|||Chỉ cookie, không bao giờ localStorage',
          'The private signing key|||Khoá ký riêng',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Any script on the origin can read localStorage, so the demo’s injected script stole the token; the HttpOnly cookie did not appear in document.cookie (4.5). That is why an access token belongs in memory, not localStorage. The private key never reaches the browser at all. VI: Mọi script trên origin đọc được localStorage, nên script bị tiêm trong demo đã trộm token; cookie HttpOnly không hiện trong document.cookie (4.5). Vì thế access token nên nằm trong bộ nhớ, không phải localStorage. Khoá riêng không bao giờ tới trình duyệt.',
      },
      {
        question: 'A teammate proposes signing LabFlow ID’s tokens with HS256 (a shared secret) so every service can verify fast. Why is EdDSA the better choice for a platform?|||Một đồng đội đề xuất ký token của LabFlow ID bằng HS256 (một bí mật dùng chung) để mọi dịch vụ xác minh nhanh. Vì sao EdDSA là lựa chọn tốt hơn cho một nền tảng?',
        options: [
          'EdDSA tokens are smaller than HS256 tokens|||Token EdDSA nhỏ hơn token HS256',
          'With a shared HMAC secret, every service that can verify can also forge; with EdDSA only LabFlow ID (the private key) can mint, and others hold only the public key|||Với một bí mật HMAC dùng chung, mọi dịch vụ xác minh được cũng giả mạo được; với EdDSA chỉ LabFlow ID (khoá riêng) đúc được, còn các dịch vụ khác chỉ giữ khoá công khai',
          'HS256 cannot express claims|||HS256 không biểu diễn được các claim',
          'EdDSA verifies faster than HS256|||EdDSA kiểm nhanh hơn HS256',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: The security point, not speed: a shared secret means any verifier can forge (4.4). EdDSA keeps minting to the private-key holder; every other service verifies with the public JWKS. Measured, HS256 is actually faster and EdDSA tokens are not smaller — so A and D are wrong. VI: Điểm bảo mật, không phải tốc độ: một bí mật dùng chung nghĩa là bộ xác minh nào cũng giả mạo được (4.4). EdDSA giữ việc đúc cho người có khoá riêng; mọi dịch vụ khác xác minh bằng JWKS công khai. Đo thật, HS256 còn nhanh hơn và token EdDSA không nhỏ hơn — nên A và D sai.',
      },
    ],
  },
};
