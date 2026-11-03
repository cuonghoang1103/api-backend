/**
 * Authentication · Chương 7 · Quiz (10 câu tình huống trên LabFlow ID v0.7). Slug giữ: auth-7-6-quiz.
 * Đáp án rải: A ×3 (câu 1, 5, 9) · B ×2 (câu 4, 8) · C ×2 (câu 3, 7) · D ×3 (câu 2, 6, 10).
 */
export default {
  title: '7.6 — Quiz: MFA and passkeys|||7.6 — Quiz: đa yếu tố và passkey',
  slug: 'auth-7-6-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười câu tình huống trên LabFlow ID v0.7 về Chương 7: ba họ yếu tố, step-up, SMS yếu nhất, TOTP (cắt động, counter=time/30, vector RFC, cửa sổ lệch), mã khôi phục (một lần, băm), passkey (cặp khoá, gắn origin giết lừa đảo), bộ đếm chữ ký, challenge do máy chủ tạo — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Check</span>
<h2>Chapter 7 check</h2>
<p class="lead">Ten scenarios from LabFlow ID v0.7, with the behaviour and the RFC numbers you saw in this chapter. Every explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can name the three factor families and say why two of one is still one factor.</li>
<li>I can compute a TOTP code from a secret and a time, and verify it with a skew window.</li>
<li>I can explain why recovery codes are single-use and stored hashed.</li>
<li>I can say what a passkey stores server-side and why a database dump is harmless.</li>
<li>I can explain the one property — origin binding — that makes passkeys unphishable.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Kiểm tra Chương 7</h2>
<p class="lead">Mười tình huống từ LabFlow ID v0.7, với hành vi và những con số RFC bạn đã thấy trong chương. Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi gọi được tên ba họ yếu tố và nói vì sao hai cái cùng họ vẫn là một yếu tố.</li>
<li>Tôi tính được một mã TOTP từ một bí mật và một thời gian, và xác minh nó với cửa sổ lệch.</li>
<li>Tôi giải thích được vì sao mã khôi phục dùng một lần và lưu dạng băm.</li>
<li>Tôi nói được một passkey lưu gì phía máy chủ và vì sao một bản dump vô hại.</li>
<li>Tôi giải thích được cái tính chất duy nhất — gắn origin — khiến passkey không lừa được.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A login asks for a password and then a security question. Is that two-factor authentication?|||Một lần đăng nhập hỏi mật khẩu rồi một câu hỏi bảo mật. Đó có phải xác thực hai yếu tố?',
        options: [
          'No — both are "something you know", so they leak together; two factors means two different families|||Không — cả hai là "thứ bạn biết", nên rò cùng nhau; hai yếu tố nghĩa là hai họ khác nhau',
          'Yes — any two separate prompts count as two factors|||Có — hai lời hỏi riêng bất kỳ tính là hai yếu tố',
          'Yes — the security question is "something you have"|||Có — câu hỏi bảo mật là "thứ bạn có"',
          'No — because a security question is not secret enough|||Không — vì câu hỏi bảo mật không đủ bí mật',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Two factors must come from different families (know / have / are). A password and a security question are both things you know and leak the same way (7.1). VI: Hai yếu tố phải từ các họ khác nhau (biết / có / là). Mật khẩu và câu hỏi bảo mật đều là thứ bạn biết và rò cùng kiểu (7.1).',
      },
      {
        question: 'Your team enabled TOTP, but a user was still phished. How?|||Đội bạn bật TOTP, mà một người dùng vẫn bị lừa. Bằng cách nào?',
        options: [
          'TOTP codes never expire, so the attacker reused an old one|||Mã TOTP không bao giờ hết hạn, nên kẻ tấn công dùng lại một cái cũ',
          'The TOTP secret was stored in plaintext and leaked|||Bí mật TOTP lưu dạng gốc và bị lộ',
          'The user typed a weak password|||Người dùng gõ một mật khẩu yếu',
          'A fake site collected the password AND the code and relayed both to the real site within the 30-second window|||Một site giả thu mật khẩu VÀ mã rồi chuyển tiếp cả hai tới site thật trong cửa sổ 30 giây',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: TOTP is phishable: a code is valid for its window, so a convincing fake relays it in real time. Only an origin-bound factor (passkey) stops this (7.1, 7.4). VI: TOTP lừa được: một mã hợp lệ suốt cửa sổ, nên một bản giả thuyết phục chuyển tiếp nó thời gian thực. Chỉ một yếu tố gắn origin (passkey) chặn điều này (7.1, 7.4).',
      },
      {
        question: 'In HOTP, what is "dynamic truncation"?|||Trong HOTP, "cắt động" là gì?',
        options: [
          'Dropping the last byte of the HMAC before taking the modulo|||Bỏ byte cuối của HMAC trước khi lấy modulo',
          'Shortening the secret to fit the authenticator app|||Rút ngắn bí mật cho vừa app xác thực',
          'The low 4 bits of the last HMAC byte pick a 4-byte offset; you read 31 bits there and take modulo 10^digits|||4 bit thấp của byte HMAC cuối chọn một offset 4 byte; bạn đọc 31 bit ở đó và lấy modulo 10^digits',
          'Truncating the time to the nearest 30 seconds|||Cắt thời gian về bội 30 giây gần nhất',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Dynamic truncation (RFC 4226) chooses the output bytes using the hash itself, so the code does not depend on a fixed slice. Truncating time to 30s is the TOTP counter, a different step (7.2). VI: Cắt động (RFC 4226) chọn các byte đầu ra dùng chính hàm băm, nên mã không phụ thuộc một lát cố định. Cắt thời gian về 30s là counter của TOTP, một bước khác (7.2).',
      },
      {
        question: 'LabFlow ID’s totp() is tested against secret "12345678901234567890" at t=59 expecting 94287082. Why test against fixed numbers?|||totp() của LabFlow ID được kiểm với bí mật "12345678901234567890" tại t=59 mong 94287082. Vì sao kiểm với số cố định?',
        options: [
          'Because random inputs are too slow to test|||Vì đầu vào ngẫu nhiên quá chậm để kiểm',
          'They are the RFC 6238 published test vectors — reproducing them proves the implementation matches the standard, not just "looks right"|||Chúng là vector thử công bố của RFC 6238 — tái tạo chúng chứng minh cài đặt khớp chuẩn, không chỉ "trông đúng"',
          'To hide the real secret from the test file|||Để giấu bí mật thật khỏi tệp test',
          'Because otplib requires those exact values|||Vì otplib đòi đúng những giá trị đó',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: RFC 6238 ships test vectors so any implementation can prove conformance; LabFlow ID reproduces all six and matches otplib (7.2). VI: RFC 6238 kèm vector thử để mọi cài đặt chứng minh tuân chuẩn; LabFlow ID tái tạo cả sáu và khớp otplib (7.2).',
      },
      {
        question: 'verifyTotp accepts the current 30-second step and ±1. Why not accept ±10 to be forgiving of clock drift?|||verifyTotp nhận bước 30 giây hiện tại và ±1. Vì sao không nhận ±10 cho rộng lượng với lệch đồng hồ?',
        options: [
          'A ±10 window keeps a relayed code valid for ~5 minutes of replay instead of ~90 seconds — a bigger gift to a real-time phisher|||Một cửa sổ ±10 giữ một mã chuyển tiếp hợp lệ ~5 phút phát lại thay vì ~90 giây — món quà lớn hơn cho kẻ lừa đảo thời gian thực',
          'A ±10 window is too slow to compute|||Một cửa sổ ±10 quá chậm để tính',
          'Authenticator apps refuse windows larger than ±1|||App xác thực từ chối cửa sổ lớn hơn ±1',
          'The code would become 8 digits instead of 6|||Mã sẽ thành 8 chữ số thay vì 6',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: The skew window is also the replay window; ±1 (~±30s) covers real drift while keeping the code effectively one-time. Widening it only helps an attacker (7.2). VI: Cửa sổ lệch cũng là cửa sổ phát lại; ±1 (~±30s) phủ trôi thật mà vẫn giữ mã gần như dùng-một-lần. Nới nó chỉ giúp kẻ tấn công (7.2).',
      },
      {
        question: 'How does LabFlow ID store recovery codes, and what happens when one is used?|||LabFlow ID lưu mã khôi phục thế nào, và gì xảy ra khi một cái được dùng?',
        options: [
          'In plaintext, reusable, so support can read them to the user|||Dạng gốc, dùng lại được, để hỗ trợ đọc cho người dùng',
          'Encrypted and reusable until they expire|||Mã hoá và dùng lại được tới khi hết hạn',
          'As plaintext but single-use|||Dạng gốc nhưng dùng một lần',
          'As SHA-256 digests, shown once at enrollment, and single-use — a consumed code is removed and fails on reuse|||Dạng digest SHA-256, hiện một lần lúc đăng ký, và dùng một lần — một mã đã tiêu bị bỏ và thất bại khi dùng lại',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Recovery codes are credentials: stored as digests, shown once, single-use. The demo shows a reused code returning ok=false (7.3). VI: Mã khôi phục là tín vật: lưu dạng digest, hiện một lần, dùng một lần. Demo cho thấy một mã dùng lại trả ok=false (7.3).',
      },
      {
        question: 'What does the server store for a passkey, and why is a database dump not catastrophic?|||Máy chủ lưu gì cho một passkey, và vì sao một bản dump không thảm hoạ?',
        options: [
          'The private key, encrypted — safe because it is encrypted|||Khoá riêng, mã hoá — an toàn vì được mã hoá',
          'A shared secret like a TOTP seed|||Một bí mật chung như hạt giống TOTP',
          'Only the public key, a counter and the credential id — the private key never leaves the authenticator, so there is nothing to replay|||Chỉ khoá công khai, một counter và credential id — khoá riêng không bao giờ rời bộ xác thực, nên không gì phát lại được',
          'Nothing — passkeys are stored entirely on the device|||Không gì — passkey lưu hoàn toàn trên thiết bị',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: The server keeps the public key, counter and id; the private key is on the device. A dump yields public keys, useless to impersonate anyone (7.4, 7.5). VI: Máy chủ giữ khoá công khai, counter và id; khoá riêng ở thiết bị. Một bản dump cho khoá công khai, vô dụng để giả danh ai (7.4, 7.5).',
      },
      {
        question: 'The demo re-verifies a real passkey assertion with expectedOrigin = https://evil.example and it returns verified=false. Why?|||Demo xác minh lại một assertion passkey thật với expectedOrigin = https://evil.example và nó trả verified=false. Vì sao?',
        options: [
          'evil.example is on a blocklist|||evil.example nằm trong danh sách chặn',
          'The authenticator signed over the real origin, so the signature cannot satisfy a check for a different origin — origin binding is what kills phishing|||Bộ xác thực đã ký lên origin thật, nên chữ ký không thoả một phép kiểm cho một origin khác — gắn origin là cái giết lừa đảo',
          'The challenge expired between the two checks|||Challenge hết hạn giữa hai lần kiểm',
          'The public key was rotated|||Khoá công khai bị xoay',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: WebAuthn signs over the challenge AND the requesting origin; verifying against a different origin fails. A phishing site relaying your challenge gets a signature your server rejects (7.4). VI: WebAuthn ký lên challenge VÀ origin đã hỏi; xác minh với một origin khác thất bại. Một site lừa đảo chuyển tiếp challenge của bạn nhận một chữ ký máy chủ bạn từ chối (7.4).',
      },
      {
        question: 'Why must the WebAuthn challenge be generated by the server and used once?|||Vì sao challenge WebAuthn phải do máy chủ tạo và dùng một lần?',
        options: [
          'A client-chosen or reused challenge could be pre-signed by an attacker; a fresh server challenge makes each assertion one-shot|||Một challenge do client chọn hay dùng lại có thể bị kẻ tấn công ký trước; một challenge máy chủ mới khiến mỗi assertion dùng-một-lần',
          'The browser cannot generate random numbers|||Trình duyệt không sinh được số ngẫu nhiên',
          'To keep the challenge short enough for the QR code|||Để giữ challenge đủ ngắn cho QR',
          'Because the RP ID must be inside the challenge|||Vì RP ID phải nằm trong challenge',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Freshness is half the security — a reusable or client-chosen challenge lets an attacker prepare a signature in advance; a one-shot server challenge prevents it (7.5). VI: Độ tươi là nửa sự an toàn — một challenge dùng lại hay do client chọn cho kẻ tấn công chuẩn bị một chữ ký trước; một challenge máy chủ dùng-một-lần ngăn nó (7.5).',
      },
      {
        question: 'A user has one passkey on one phone and no password or recovery codes. The phone is lost. What does this chapter say?|||Một người dùng có một passkey trên một điện thoại và không mật khẩu hay mã khôi phục. Mất điện thoại. Chương này nói gì?',
        options: [
          'The passkey syncs, so nothing is ever lost — no planning needed|||Passkey đồng bộ, nên không bao giờ mất gì — không cần lên kế hoạch',
          'Support should disable passkeys for anyone who asks|||Hỗ trợ nên tắt passkey cho bất kỳ ai hỏi',
          'A new password can always be set without any factor|||Luôn có thể đặt một mật khẩu mới mà không cần yếu tố nào',
          'This is the device-loss cliff: a single passkey on a single device is one dropped phone from lockout — keep recovery codes and encourage a second authenticator|||Đây là vách mất-thiết-bị: một passkey trên một thiết bị là một cú rơi điện thoại khỏi bị khoá — giữ mã khôi phục và khuyến khích một bộ xác thực thứ hai',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Passkey convenience hides a sharp recovery edge; the fix is recovery codes (7.3) and a second enrolled authenticator, and migrating off passwords only once two passkeys work (7.5). VI: Sự tiện lợi của passkey giấu một mép khôi phục sắc; cách sửa là mã khôi phục (7.3) và một bộ xác thực thứ hai, và bỏ mật khẩu chỉ khi hai passkey chạy (7.5).',
      },
    ],
  },
};
