/**
 * Authentication · Chương 6 · Quiz (10 câu tình huống trên LabFlow ID v0.6). Slug giữ: auth-6-6-quiz.
 * Đáp án rải: A ×3 (câu 1, 5, 9) · B ×2 (câu 4, 8) · C ×2 (câu 3, 7) · D ×3 (câu 2, 6, 10).
 */
export default {
  title: '6.6 — Quiz: the account lifecycle|||6.6 — Quiz: vòng đời tài khoản',
  slug: 'auth-6-6-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười câu tình huống trên LabFlow ID v0.6 về Chương 6: đăng ký chống dò tài khoản + tài khoản chưa xác minh, token một lần lưu băm, máy quét bấm link (GET/POST), đặt lại mật khẩu thu hồi mọi phiên, link reset dùng một lần, phản hồi chung của quên-mật-khẩu, cú rò THỜI GIAN, băm ở cả hai nhánh đăng ký, đổi email về chưa xác minh, và xoá mềm + xác thực lại + thu hồi — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Check</span>
<h2>Chapter 6 check</h2>
<p class="lead">Ten scenarios from LabFlow ID v0.6, with the behaviour and the numbers you saw in this chapter. Every explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can register an account that starts unverified without leaking which emails exist.</li>
<li>I can issue and consume a one-time token (hashed, single-use, purpose-bound, time-limited).</li>
<li>I can explain why a GET verify link must not consume the token.</li>
<li>I can make a password reset end every session, and give one fixed forgot-password response.</li>
<li>I can name the four channels account enumeration leaks through, timing included.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Kiểm tra Chương 6</h2>
<p class="lead">Mười tình huống từ LabFlow ID v0.6, dùng đúng hành vi và những con số bạn đã thấy trong chương. Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đăng ký được một tài khoản bắt đầu chưa xác minh mà không lộ email nào tồn tại.</li>
<li>Tôi phát và tiêu được một token một lần (băm, dùng một lần, ràng mục đích, có hạn).</li>
<li>Tôi giải thích được vì sao một đường dẫn xác minh GET không được tiêu token.</li>
<li>Tôi làm được một lần reset kết thúc mọi phiên, và cho một phản hồi quên-mật-khẩu cố định.</li>
<li>Tôi gọi được tên bốn kênh mà dò tài khoản rò qua, kể cả thời gian.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A new user signs up with an email that already exists. What does LabFlow ID do?|||Một người dùng mới đăng ký với một email đã tồn tại. LabFlow ID làm gì?',
        options: [
          'Returns the same 202 as a new sign-up, hashes the password anyway (same timing), and emails "you already have an account" — so sign-up cannot be used to tell which emails are registered|||Trả cùng một 202 như một lần đăng ký mới, vẫn băm mật khẩu (cùng thời gian), và gửi "bạn đã có tài khoản" — nên đăng ký không dùng để biết email nào đã đăng ký được',
          'Returns 409 "email already taken" so the user tries another address|||Trả 409 "email đã được dùng" để người dùng thử một địa chỉ khác',
          'Creates a second account with the same email|||Tạo một tài khoản thứ hai với cùng email',
          'Logs the user in, since the email clearly belongs to them|||Đăng nhập người dùng, vì email rõ ràng là của họ',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: A 409 "taken" is an enumeration oracle; LabFlow ID answers the same 202 either way, hashes in both branches so timing matches, and emails the real owner instead (6.1). VI: Một 409 "đã dùng" là một nhà tiên tri dò tài khoản; LabFlow ID trả cùng một 202 dù thế nào, băm ở cả hai nhánh để thời gian khớp, và gửi thư cho chủ thật thay vào đó (6.1).',
      },
      {
        question: 'A verification token is 256 bits of randomness. How should it be stored, and why that hash?|||Một token xác minh là 256 bit ngẫu nhiên. Nên lưu nó thế nào, và vì sao hàm băm đó?',
        options: [
          'In plaintext — it expires in 30 minutes anyway|||Dạng gốc — dù sao nó cũng hết hạn trong 30 phút',
          'Argon2id, like a password, to slow down brute force|||Argon2id, như một mật khẩu, để làm chậm dò cạn',
          'As a JWT, so it carries the user id and the expiry|||Dạng JWT, để nó mang user id và hạn',
          'As a SHA-256 digest — the row is a credential (a leak must not be a working link), and SHA-256 is right because the input is already high-entropy random, so there is nothing to brute-force|||Dạng digest SHA-256 — dòng này là một tín vật (một lần lộ không được là một link chạy được), và SHA-256 là đúng vì đầu vào đã là ngẫu nhiên entropy cao, nên chẳng có gì để dò cạn',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Store the digest so a DB dump is not a list of working links; SHA-256 (not Argon2) because a 256-bit random input has nothing to slow-hash against (6.2, contrast 2.3). VI: Lưu digest để một bản dump DB không là danh sách link chạy được; SHA-256 (không Argon2) vì một đầu vào ngẫu nhiên 256 bit không có gì để băm-chậm chống lại (6.2, khác 2.3).',
      },
      {
        question: 'Users report the email-verification link says "expired" the moment they click it. The server log shows a GET from "Microsoft Office Existence Discovery" seconds after the mail was sent. What is happening?|||Người dùng báo đường dẫn xác minh nói "hết hạn" ngay khi họ bấm. Log máy chủ cho thấy một GET từ "Microsoft Office Existence Discovery" vài giây sau khi thư được gửi. Chuyện gì đang xảy ra?',
        options: [
          'The token expiry is set too short and should be raised to a week|||Hạn token đặt quá ngắn và nên nâng lên một tuần',
          'The user clicked twice and the second click failed|||Người dùng bấm hai lần và lần thứ hai hỏng',
          'A mail security gateway prefetched the GET link and consumed the one-time token before the human clicked — the side effect must move behind a POST (or the verify must be idempotent)|||Một cổng bảo mật thư đã prefetch đường dẫn GET và tiêu token một lần trước khi con người bấm — tác dụng phụ phải chuyển ra sau một POST (hoặc xác minh phải idempotent)',
          'The email client corrupted the token in the URL|||Trình đọc thư làm hỏng token trong URL',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Safe Links / scanners GET every URL to check it, firing any GET side effect before the user. Show a confirm page on GET and consume on POST, or make verify idempotent (6.2). VI: Safe Links / máy quét GET mọi URL để kiểm, làm nổ bất kỳ tác dụng phụ GET nào trước người dùng. Hiện trang xác nhận ở GET và tiêu ở POST, hoặc làm xác minh idempotent (6.2).',
      },
      {
        question: 'An is signed in on two devices. She resets her password from a reset link. What happens to the device she did NOT use?|||An đang đăng nhập trên hai thiết bị. Cô đặt lại mật khẩu từ một đường dẫn reset. Thiết bị cô KHÔNG dùng ra sao?',
        options: [
          'It keeps working — a reset only affects the device that performed it|||Nó vẫn chạy — một lần reset chỉ ảnh hưởng thiết bị thực hiện nó',
          'Its next refresh returns REVOKED — reset calls revokeAll, ending every session and refresh family, so an attacker who was signed in is locked out|||Lần refresh kế của nó trả về REVOKED — reset gọi revokeAll, kết thúc mọi phiên và họ refresh, nên một kẻ tấn công đang đăng nhập bị khoá ra ngoài',
          'It must enter the new password to continue|||Nó phải nhập mật khẩu mới để tiếp tục',
          'Only its access token is revoked; its refresh token survives|||Chỉ access token của nó bị thu hồi; refresh token của nó sống sót',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Reset that only changes the hash leaves an attacker\'s session alive; LabFlow ID calls sessions.endAll + refresh.revokeAll, so the other device\'s refresh returns REVOKED. Recovery that does not revoke is not recovery (6.3). VI: Reset chỉ đổi hash để phiên của kẻ tấn công còn sống; LabFlow ID gọi sessions.endAll + refresh.revokeAll, nên refresh của thiết bị kia trả REVOKED. Khôi phục mà không thu hồi thì không phải khôi phục (6.3).',
      },
      {
        question: 'An uses her reset link, sets a new password, then an attacker who intercepted the same link tries it. What does the attacker get?|||An dùng đường dẫn reset của mình, đặt mật khẩu mới, rồi một kẻ tấn công đã chặn bắt cùng đường dẫn đó thử nó. Kẻ tấn công nhận gì?',
        options: [
          'USED — the reset token is single-use, so it dies on An\'s first use and the replayed link is rejected|||USED — token reset dùng một lần, nên nó chết ở lần dùng đầu của An và đường dẫn phát lại bị từ chối',
          'A fresh reset link, because the token auto-renews|||Một đường dẫn reset mới, vì token tự gia hạn',
          'Access to the account, because the link still points to An\'s user id|||Truy cập tài khoản, vì đường dẫn vẫn trỏ tới user id của An',
          'A different error that reveals An just reset her password|||Một lỗi khác tiết lộ An vừa đặt lại mật khẩu',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: consumeToken marks the row used on first consume, so the second attempt returns USED — the single-use property from 6.2 applied to the highest-stakes link (6.3). VI: consumeToken đánh dấu dòng đã dùng ở lần tiêu đầu, nên lần thử thứ hai trả USED — tính dùng-một-lần từ 6.2 áp cho đường dẫn cao giá nhất (6.3).',
      },
      {
        question: 'Why does /forgot-password answer "if an account exists for that address, a reset link is on its way" even for an email with no account?|||Vì sao /forgot-password trả lời "nếu một tài khoản tồn tại cho địa chỉ đó, một đường dẫn reset đang trên đường tới" kể cả cho một email không có tài khoản?',
        options: [
          'Because the server cannot tell whether the account exists|||Vì máy chủ không biết tài khoản có tồn tại hay không',
          'Because it is friendlier wording|||Vì câu chữ thân thiện hơn',
          'Because the email might arrive late|||Vì email có thể tới trễ',
          'So the response does not reveal whether the address is registered — a different reply for a real vs a missing account is an enumeration oracle (6.4)|||Để phản hồi không tiết lộ địa chỉ có đăng ký hay không — một câu trả lời khác cho một tài khoản thật đối lại một cái thiếu là một nhà tiên tri dò tài khoản (6.4)',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: A reply that differs by account existence lets an attacker enumerate users; one fixed response closes the wording channel (but not timing — next question) (6.4). VI: Một câu trả lời khác nhau theo sự tồn tại của tài khoản cho kẻ tấn công dò người dùng; một phản hồi cố định đóng kênh câu chữ (nhưng không đóng thời gian — câu sau) (6.4).',
      },
      {
        question: 'The forgot-password message is already identical for every address, yet a measurement shows a real account replies ~0.9 ms slower, consistently. Why, and does it matter?|||Thông điệp quên-mật-khẩu đã y hệt cho mọi địa chỉ, vậy mà một phép đo cho thấy một tài khoản thật trả lời chậm hơn ~0,9 ms, nhất quán. Vì sao, và nó có quan trọng không?',
        options: [
          'Random network jitter; it cannot be exploited|||Nhiễu mạng ngẫu nhiên; không khai thác được',
          'The real account is on a slower database shard|||Tài khoản thật nằm trên một shard cơ sở dữ liệu chậm hơn',
          'The handler AWAITS the token insert + email for a real account (work a missing one skips); it is a timing oracle, and a consistent difference is readable by averaging over many requests — fix it by doing that work off the response path|||Handler AWAIT phần chèn token + email cho một tài khoản thật (việc một cái thiếu bỏ qua); đó là một nhà tiên tri thời gian, và một chênh lệch nhất quán đọc được bằng lấy trung bình qua nhiều request — vá bằng làm việc đó ngoài đường phản hồi',
          'The email provider is rate-limiting the real address|||Nhà cung cấp email đang giới hạn tần suất địa chỉ thật',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Account-specific work awaited before replying leaks timing even with a uniform message; LabFlow ID fires the insert + send off the response path so both branches do only the lookup (6.4). VI: Việc riêng-tài-khoản được await trước khi trả lời rò thời gian kể cả với một thông điệp đồng nhất; LabFlow ID bắn phần chèn + gửi ra ngoài đường phản hồi để cả hai nhánh chỉ làm phép tra (6.4).',
      },
      {
        question: 'Measuring /sign-up, a taken email and a free email both take ~190 ms (ratio ~1x), even though only the free one creates a row. Why?|||Đo /sign-up, một email đã-dùng và một email trống đều mất ~190 ms (tỉ lệ ~1x), dù chỉ cái trống tạo một dòng. Vì sao?',
        options: [
          'The database insert is the slowest step and both do it|||Lệnh chèn cơ sở dữ liệu là bước chậm nhất và cả hai đều làm',
          'The password is hashed with argon2 in BOTH branches, so that ~190 ms dominates both and creating a row is a rounding error — same work, no timing leak|||Mật khẩu được băm bằng argon2 ở CẢ HAI nhánh, nên ~190 ms đó chi phối cả hai và tạo một dòng là một sai số làm tròn — cùng công việc, không rò thời gian',
          'Node caches the response for repeated emails|||Node cache phản hồi cho các email lặp lại',
          'The 190 ms is mostly the pwned-password network call, which is skipped for a taken email|||190 ms phần lớn là lời gọi mạng kiểm mật khẩu rò, bị bỏ qua cho một email đã-dùng',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Hashing in both branches (6.1) makes argon2 the cost of both, so the row insert is negligible beside it and the timing matches — the "constant work" fix (6.4). VI: Băm ở cả hai nhánh (6.1) khiến argon2 là chi phí của cả hai, nên lệnh chèn dòng là không đáng kể bên cạnh nó và thời gian khớp — cách vá "công việc hằng định" (6.4).',
      },
      {
        question: 'An changes her account email to a new address. What is the state of the new address, and what can it do immediately?|||An đổi email tài khoản sang một địa chỉ mới. Trạng thái của địa chỉ mới là gì, và nó làm được gì ngay?',
        options: [
          'Unverified — users.updateEmail clears email_verified_at, so the new address must be proven again and cannot receive a password reset until it is (6.2, 6.5)|||Chưa xác minh — users.updateEmail xoá email_verified_at, nên địa chỉ mới phải được chứng minh lại và không nhận được reset mật khẩu cho tới khi đó (6.2, 6.5)',
          'Verified — the user was already logged in, so the new address is trusted|||Đã xác minh — người dùng đã đăng nhập, nên địa chỉ mới được tin',
          'Pending for 30 days, during which the old address still works|||Chờ 30 ngày, trong lúc đó địa chỉ cũ vẫn chạy',
          'Verified only for login, not for reset|||Đã xác minh chỉ cho đăng nhập, không cho reset',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: A changed email is a new claim; updateEmail sets email_verified_at = NULL and sends a fresh verify link, and reset is gated on verification so a not-yet-owned address cannot receive one (6.5). VI: Một email đã đổi là một lời khai mới; updateEmail đặt email_verified_at = NULL và gửi một link xác minh mới, và reset bị chặn sau xác minh nên một địa chỉ chưa-sở-hữu không nhận được nó (6.5).',
      },
      {
        question: 'An deletes her account from a logged-in session. Which combination does LabFlow ID require and perform?|||An xoá tài khoản của mình từ một phiên đã đăng nhập. LabFlow ID đòi và thực hiện tổ hợp nào?',
        options: [
          'Nothing extra — a logged-in session is proof enough, and a hard DELETE removes the row|||Không gì thêm — một phiên đã đăng nhập là đủ bằng chứng, và một DELETE cứng bỏ cái dòng',
          'Only revoke the current session; other devices log out on their own|||Chỉ thu hồi phiên hiện tại; thiết bị khác tự đăng xuất',
          'Only re-authentication; the row stays active but hidden|||Chỉ xác thực lại; dòng vẫn active nhưng ẩn',
          'Re-authenticate with the password, soft-delete (status = deleted, so findByEmail stops finding it), and revoke every session + refresh family — a deleted account with live tokens would be a ghost that still acts|||Xác thực lại bằng mật khẩu, xoá-mềm (status = deleted, nên findByEmail ngừng tìm thấy nó), và thu hồi mọi phiên + họ refresh — một tài khoản đã xoá còn token sống sẽ là một bóng ma vẫn hành động',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Re-auth stops a borrowed unlocked device erasing an account; soft-delete keeps referential integrity and recovery; revokeAll stops a deleted account\'s tokens from still working (6.5). VI: Xác thực lại chặn một thiết bị mượn chưa khoá xoá một tài khoản; xoá-mềm giữ toàn vẹn tham chiếu và khôi phục; revokeAll ngừng token của một tài khoản đã xoá vẫn chạy (6.5).',
      },
    ],
  },
};
