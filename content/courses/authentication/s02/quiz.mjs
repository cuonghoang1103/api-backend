/**
 * Authentication · Chương 2 · Quiz (10 câu tình huống trên LabFlow ID, số đo của chương). Slug giữ: auth-2-6-quiz.
 * Đáp án rải: A ×2 (câu 3, 7) · B ×3 (1, 5, 10) · C ×2 (4, 8) · D ×3 (2, 6, 9).
 */
export default {
  title: '2.6 — Quiz: passwords|||2.6 — Quiz: mật khẩu',
  slug: 'auth-2-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống trên LabFlow ID về Chương 2: muối làm được gì, bảng thời gian bẻ khoá, hai ngân sách khi chỉnh argon2id, bộ nhớ khi nhiều người đăng nhập, đọc chuỗi băm theo tên, băm giả và đồng hồ, NFC, luật NIST 800-63B-4, k-ẩn danh của HIBP, bọc MD5 và bài học Ashley Madison — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Check</span>
<h2>Chapter 2 check</h2>
<p class="lead">Ten scenarios from LabFlow ID v0.2, with the numbers you measured in this chapter. Every explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say what a salt does and what it does not do.</li>
<li>I can derive argon2id parameters from two budgets and predict RAM under load.</li>
<li>I can build a sign-in whose failures look the same — answer, time and bytes.</li>
<li>I can state NIST 800-63B-4's password rules and check a breach with 5 hex characters.</li>
<li>I can move MD5 or bcrypt rows to argon2id without a reset, and say when it is finished.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Kiểm tra Chương 2</h2>
<p class="lead">Mười tình huống từ LabFlow ID v0.2, dùng đúng những con số bạn đã đo trong chương. Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được muối làm được gì và không làm được gì.</li>
<li>Tôi suy được tham số argon2id từ hai ngân sách và đoán được RAM khi có tải.</li>
<li>Tôi dựng được luồng đăng nhập mà mọi lần thất bại giống nhau — câu trả lời, thời gian và chuỗi byte.</li>
<li>Tôi nói được luật mật khẩu của NIST 800-63B-4 và kiểm rò rỉ bằng 5 ký tự hex.</li>
<li>Tôi chuyển được dòng MD5 hay bcrypt sang argon2id mà không bắt đặt lại, và nói được khi nào là xong.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'A teammate proposes SHA-256 with a 16-byte random salt per user for LabFlow ID passwords, “because salt stops cracking”. On the 1,003-account dump of lesson 2.1, what did salted SHA-256 change compared with unsalted?|||Một bạn cùng nhóm đề xuất SHA-256 kèm muối ngẫu nhiên 16 byte mỗi người cho mật khẩu LabFlow ID, "vì muối chặn được việc bẻ". Trên bản dump 1.003 tài khoản ở bài 2.1, SHA-256 có muối thay đổi gì so với không muối?',
        options: [
          'Nothing at all: both cracked 701 accounts with the same 10,001 hashes|||Không gì cả: cả hai đều bẻ 701 tài khoản với cùng 10.001 lần băm',
          'The attacker had to hash the list per account (4.96 million hashes, 2.4 s instead of 15 ms), yet exactly the same 701 accounts fell|||Kẻ tấn công phải băm danh sách cho từng tài khoản (4,96 triệu lần, 2,4 s thay vì 15 ms), vậy mà đúng 701 tài khoản đó vẫn sụp',
          'Only Bình was cracked, because salt protects every password not on the first line|||Chỉ Bình bị bẻ, vì muối bảo vệ mọi mật khẩu không nằm ở dòng đầu',
          'Nobody was cracked, because the attacker cannot know the salt|||Không ai bị bẻ, vì kẻ tấn công không thể biết muối',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Salt removes shared work and precomputed tables, so the work rose from 10,001 to 4,960,404 hashes — but one guess still costs one fast SHA-256 (about 2 million/s on a core, 22 billion/s on an RTX 4090), so the same 701 fell. “Nobody was cracked” is the tempting myth: the salt is stored next to the hash and is not secret.|||VI: Muối gỡ việc làm chung và bảng tính sẵn, nên khối lượng tăng từ 10.001 lên 4.960.404 lần băm — nhưng một lần đoán vẫn chỉ tốn một lần SHA-256 nhanh (khoảng 2 triệu/s mỗi nhân, 22 tỉ/s trên RTX 4090), nên đúng 701 tài khoản vẫn sụp. "Không ai bị bẻ" là ngộ nhận hấp dẫn: muối nằm ngay cạnh giá trị băm và không bí mật. (Bài 2.1)',
      },
      {
        question: 'With argon2id at LabFlow ID’s parameters, the attacker’s list against all 1,003 accounts takes about 54 hours. How long did Bình’s 123456 survive?|||Với argon2id ở tham số của LabFlow ID, danh sách của kẻ tấn công chạy với cả 1.003 tài khoản mất khoảng 54 giờ. 123456 của Bình trụ được bao lâu?',
        options: [
          'About 54 hours, like everyone else, because argon2id treats all passwords equally|||Khoảng 54 giờ như mọi người, vì argon2id đối xử với mọi mật khẩu như nhau',
          'About 131 years, the time for 8 lower-case letters|||Khoảng 131 năm, thời gian cho 8 chữ thường',
          'It was never found, because argon2id is memory-hard|||Không bao giờ bị tìm ra, vì argon2id tốn bộ nhớ',
          'Two guesses, 166 ms: it is the second word of the list — which is why lesson 2.4 adds a blocklist|||Hai lần đoán, 166 ms: nó là từ thứ hai của danh sách — đó là lý do bài 2.4 thêm danh sách chặn',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: A slow hash multiplies the cost of each guess, not the number of guesses needed. 123456 is guess number 2, so it fell after 2 guesses in 166 ms. “54 hours like everyone” confuses the time for the whole list with the time to reach one word near its top.|||VI: Băm chậm nhân chi phí mỗi lần đoán, không nhân số lần đoán cần thiết. 123456 là lần đoán thứ 2, nên sụp sau 2 lần trong 166 ms. "54 giờ như mọi người" nhầm thời gian chạy hết danh sách với thời gian chạm tới một từ ở gần đầu nó. (Bài 2.1, 2.4)',
      },
      {
        question: 'demo2/tune.mjs with a 100 ms budget alone would pick m=128 MiB, t=1 (85 ms). Why does LabFlow ID use m=64 MiB, t=2 instead?|||demo2/tune.mjs chỉ với ngân sách 100 ms sẽ chọn m=128 MiB, t=1 (85 ms). Vì sao LabFlow ID dùng m=64 MiB, t=2?',
        options: [
          'Because 4 threads hash at once: 256 MiB for hashing ÷ 4 = 64 MiB per hash; 128 MiB × 4 would need 512 MiB|||Vì 4 luồng băm cùng lúc: 256 MiB cho việc băm ÷ 4 = 64 MiB mỗi lần; 128 MiB × 4 sẽ cần 512 MiB',
          'Because argon2id is insecure above 64 MiB|||Vì argon2id không an toàn khi trên 64 MiB',
          'Because t must always be at least 2 according to OWASP|||Vì theo OWASP t luôn phải ít nhất là 2',
          'Because 64 MiB is the default of the argon2 package|||Vì 64 MiB là mặc định của gói argon2',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: The second budget is memory: libuv runs up to UV_THREADPOOL_SIZE (4) hashes at once, so each may use 256 ÷ 4 = 64 MiB; then the most passes that fit 100 ms is t=2 (86.5 ms). “t ≥ 2 per OWASP” is wrong: OWASP lists m=46 MiB, t=1 as an equal option.|||VI: Ngân sách thứ hai là bộ nhớ: libuv chạy tối đa UV_THREADPOOL_SIZE (4) lần băm cùng lúc, nên mỗi lần chỉ được 256 ÷ 4 = 64 MiB; rồi số lượt nhiều nhất còn vừa 100 ms là t=2 (86,5 ms). "Theo OWASP t ≥ 2" là sai: OWASP liệt kê m=46 MiB, t=1 là một lựa chọn ngang bằng. (Bài 2.2)',
      },
      {
        question: 'Before an exam 40 students sign in at the same moment. Someone raises UV_THREADPOOL_SIZE from 4 to 64 on the 10-core server “to make logins faster”. What did lesson 2.2 measure?|||Trước giờ thi 40 sinh viên đăng nhập cùng lúc. Ai đó nâng UV_THREADPOOL_SIZE từ 4 lên 64 trên máy chủ 10 nhân "cho đăng nhập nhanh hơn". Bài 2.2 đo được gì?',
        options: [
          'Every login finished in 86 ms, because each one got its own thread|||Mọi lượt đăng nhập xong trong 86 ms, vì mỗi lượt có luồng riêng',
          'Logins failed with ERR_CRYPTO_INVALID_SCRYPT_PARAMS|||Đăng nhập thất bại với ERR_CRYPTO_INVALID_SCRYPT_PARAMS',
          'No faster (median 537 ms) but RSS grew by 2,498 MiB — more threads than cores buys memory, not speed|||Không nhanh hơn (trung vị 537 ms) nhưng RSS tăng 2.498 MiB — nhiều luồng hơn số nhân chỉ mua thêm bộ nhớ, không mua tốc độ',
          'Exactly the same as 4 threads in both time and memory|||Y hệt 4 luồng cả về thời gian lẫn bộ nhớ',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Memory is threads × m: 64 threads × 64 MiB ⇒ +2,498 MiB for 40 logins, while 10 cores still do the work (median 537 ms vs 511 ms at 4 threads). “Each gets 86 ms” ignores that threads share cores.|||VI: Bộ nhớ = số luồng × m: 64 luồng × 64 MiB ⇒ +2.498 MiB cho 40 lượt, trong khi vẫn chỉ 10 nhân làm việc (trung vị 537 ms so với 511 ms ở 4 luồng). "Mỗi lượt 86 ms" bỏ qua việc các luồng dùng chung nhân. (Bài 2.2)',
      },
      {
        question: 'A teammate’s needsRehash uses /m=(\\d+),t=(\\d+),p=(\\d+)/ on strings from the argon2 package. In production every login hashes twice. Why?|||needsRehash của một bạn cùng nhóm dùng /m=(\\d+),t=(\\d+),p=(\\d+)/ trên chuỗi do gói argon2 tạo. Trên production lượt đăng nhập nào cũng băm hai lần. Vì sao?',
        options: [
          'argon2 adds a random number of passes each time|||argon2 thêm một số lượt ngẫu nhiên mỗi lần',
          'The package writes m=65536,p=1,t=2 — the regex returns null, “cannot read” is treated as “outdated”, so every login rehashes|||Gói ghi m=65536,p=1,t=2 — regex trả null, "không đọc được" bị coi là "đã cũ", nên lượt nào cũng băm lại',
          'needsRehash must be called before verify, not after|||needsRehash phải gọi trước verify, không phải sau',
          'The salt changes on every login, so the stored string is always new|||Muối đổi ở mỗi lượt đăng nhập, nên chuỗi lưu luôn mới',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: demo2/format.mjs printed the real order m=65536,p=1,t=2 and “naive parse: null”. Read parameters by name or call argon2.needsRehash(stored, PARAMS). “Call it before verify” is wrong: rehash must happen only after a correct password.|||VI: demo2/format.mjs in ra thứ tự thật m=65536,p=1,t=2 và "naive parse: null". Hãy đọc tham số theo tên hoặc gọi argon2.needsRehash(stored, PARAMS). "Gọi trước verify" là sai: chỉ băm lại sau mật khẩu đúng. (Bài 2.2)',
      },
      {
        question: 'demo2/signin-naive.js returns the same 401 body for “no such email” and “wrong password”. What did 60 requests per case through HTTP show?|||demo2/signin-naive.js trả cùng một nội dung 401 cho "email không tồn tại" và "sai mật khẩu". 60 request mỗi trường hợp qua HTTP cho thấy gì?',
        options: [
          'Nothing measurable: HTTP noise hides any difference, as in lesson 1.3|||Không đo được gì: nhiễu HTTP che mọi chênh lệch, như bài 1.3',
          'A 1.0× ratio, because the message is identical|||Tỉ lệ 1,0×, vì thông báo giống hệt',
          'The server crashed on the unknown email|||Máy chủ sập với email lạ',
          '2.2 ms vs about 86 ms — 37× and 39× in two runs; the fix is one verify against a dummy hash made with today’s PARAMS (1.0×)|||2,2 ms so với khoảng 86 ms — 37× và 39× trong hai lần chạy; cách sửa là một lần kiểm với băm giả làm bằng PARAMS hiện hành (1,0×)',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Lesson 1.3’s 2 ns signal hid in ~100 µs of noise, but here the signal is ~84 ms — one argon2id verify — visible in a single request. “Noise hides it” transfers the wrong lesson: always compare the size of the signal with the noise.|||VI: Tín hiệu 2 ns ở bài 1.3 chìm trong ~100 µs nhiễu, còn ở đây tín hiệu là ~84 ms — một lần kiểm argon2id — thấy được ngay trong một request. "Nhiễu che mất" là áp nhầm bài học: luôn so độ lớn tín hiệu với nhiễu. (Bài 2.3)',
      },
      {
        question: 'An registered on her phone (Unicode dựng sẵn) and signs in from a lab PC whose Unikey is set to “Unicode tổ hợp”. Same visible password. What does NIST SP 800-63B-4 say LabFlow ID should do?|||An đăng ký trên điện thoại (Unicode dựng sẵn) và đăng nhập từ máy phòng lab có Unikey đặt "Unicode tổ hợp". Mật khẩu nhìn giống hệt. NIST SP 800-63B-4 nói LabFlow ID nên làm gì?',
        options: [
          'Normalise to NFC before hashing, on sign-up and on sign-in — the two forms are 25 vs 27 bytes and otherwise fail|||Chuẩn hoá về NFC trước khi băm, cả lúc đăng ký và đăng nhập — hai dạng là 25 với 27 byte và nếu không sẽ trượt',
          'Normalise to NFKC, which also folds full-width letters|||Chuẩn hoá về NFKC, dạng còn gộp cả chữ toàn độ rộng',
          'Reject any non-ASCII character in passwords|||Từ chối mọi ký tự không phải ASCII trong mật khẩu',
          'Store both forms of the password hash|||Lưu cả hai dạng giá trị băm của mật khẩu',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: NIST says verifiers SHOULD apply NFC (canonical composition); demo2/unicode.mjs failed without it and passed with NFC on both sides. NFKC is tempting — the old version of this lesson said so — but it is not what NIST asks and it changes more characters than needed.|||VI: NIST nói bên kiểm SHOULD áp NFC (ghép chính tắc); demo2/unicode.mjs trượt khi không có nó và khớp khi NFC cả hai phía. NFKC nghe hấp dẫn — bản cũ của bài từng ghi vậy — nhưng không phải điều NIST yêu cầu và nó đổi nhiều ký tự hơn cần thiết. (Bài 2.3)',
      },
      {
        question: 'The product owner wants: minimum 8 characters, one upper-case letter, one digit, one symbol, change every 90 days. Which reply follows NIST SP 800-63B-4 for LabFlow ID (password is the only factor)?|||Chủ sản phẩm muốn: tối thiểu 8 ký tự, một chữ hoa, một chữ số, một ký hiệu, đổi mỗi 90 ngày. Câu trả lời nào theo NIST SP 800-63B-4 cho LabFlow ID (mật khẩu là yếu tố duy nhất)?',
        options: [
          'Keep the rules but raise the minimum to 12|||Giữ các luật nhưng nâng tối thiểu lên 12',
          'Keep everything; NIST only recommends, it does not forbid|||Giữ hết; NIST chỉ khuyến nghị, không cấm',
          'At least 15 characters, allow 64+, block the whole password against a list and breach data; no composition rules and no scheduled expiry — they are SHALL NOT|||Ít nhất 15 ký tự, cho phép 64+, chặn nguyên mật khẩu theo danh sách và dữ liệu rò rỉ; không luật pha trộn và không hết hạn định kỳ — chúng là SHALL NOT',
          'Drop the minimum length, since a symbol adds more strength than length|||Bỏ độ dài tối thiểu, vì ký hiệu thêm độ mạnh nhiều hơn độ dài',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Composition rules and periodic changes are SHALL NOT in §3.1.1.2; measured, 756 of the top 1,000 pass after “Capital + 1!” and Password1! appears 584,516 times in HIBP. “NIST only recommends” is wrong for these items.|||VI: Luật pha trộn và đổi định kỳ là SHALL NOT trong §3.1.1.2; đo thật, 756 trên top 1.000 qua được sau "viết hoa + 1!" và Password1! xuất hiện 584.516 lần trong HIBP. "NIST chỉ khuyến nghị" là sai với các mục này. (Bài 2.4)',
      },
      {
        question: 'LabFlow ID checks new passwords against Have I Been Pwned. What exactly leaves the server for the password 123456?|||LabFlow ID kiểm mật khẩu mới với Have I Been Pwned. Với mật khẩu 123456, chính xác thứ gì rời khỏi máy chủ?',
        options: [
          'The full SHA-1 hash, which is safe because hashes cannot be reversed|||Toàn bộ SHA-1, an toàn vì giá trị băm không đảo ngược được',
          'The password encrypted with TLS|||Mật khẩu đã mã hoá bằng TLS',
          'The argon2id hash from the users table|||Giá trị argon2id trong bảng users',
          'Only “7C4A8”, the first 5 hex characters of its SHA-1; about 2,100 suffixes come back and the match is done locally|||Chỉ "7C4A8", 5 ký tự hex đầu của SHA-1; khoảng 2.100 phần đuôi trả về và việc so khớp làm tại chỗ',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: The range API is k-anonymity: a 20-bit prefix shared by thousands of hashes (2,094–2,202 suffixes in our runs). Sending the full SHA-1 is the tempting mistake — an unsalted SHA-1 of a human password is cracked in milliseconds.|||VI: Range API là k-ẩn danh: một tiền tố 20 bit được hàng nghìn giá trị băm chia sẻ (2.094–2.202 phần đuôi trong các lần chạy). Gửi nguyên SHA-1 là lỗi hấp dẫn — SHA-1 không muối của một mật khẩu do người chọn bị bẻ trong vài mili giây. (Bài 2.4)',
      },
      {
        question: 'LabFlow’s old system has 1,003 unsalted MD5 rows. The team plans to “rehash each row when its user next signs in, and leave the MD5 column until then”. What is the problem, and the fix?|||Hệ thống cũ của LabFlow có 1.003 dòng MD5 không muối. Nhóm định "băm lại từng dòng khi người dùng đăng nhập lần tới, và để nguyên cột MD5 tới lúc đó". Vấn đề là gì, và cách sửa?',
        options: [
          'No problem: lazy rehash is the recommended way for every legacy hash|||Không có vấn đề: băm lại kiểu lười là cách khuyến nghị cho mọi giá trị băm cũ',
          'Inactive users stay MD5 for years (701 rows crack in 4 ms); wrap every row in argon2id now (17.1 s here) and NULL the MD5 in the same UPDATE — Ashley Madison lost 11 million passwords to a leftover MD5|||Người dùng không hoạt động ở dạng MD5 nhiều năm (701 dòng sụp trong 4 ms); bọc mọi dòng trong argon2id ngay (17,1 s ở đây) và đặt NULL cột MD5 trong cùng câu UPDATE — Ashley Madison mất 11 triệu mật khẩu vì một MD5 sót lại',
          'Force everyone to reset their password by email today|||Bắt mọi người đặt lại mật khẩu qua email ngay hôm nay',
          'Encrypt the MD5 column with AES until users sign in|||Mã hoá cột MD5 bằng AES cho tới khi người dùng đăng nhập',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Lazy rehash suits slow hashes (old argon2 params, bcrypt); broken ones must be wrapped at once — no password needed — and the old value removed. Forcing a reset is the tempting “safe” answer, but many users never complete it and the MD5 rows stay meanwhile.|||VI: Băm lại kiểu lười hợp với hàm băm chậm (argon2 tham số cũ, bcrypt); hàm băm hỏng phải bọc ngay — không cần mật khẩu — và xoá giá trị cũ. Bắt đặt lại là câu trả lời "an toàn" hấp dẫn, nhưng nhiều người không bao giờ làm xong và các dòng MD5 vẫn nằm đó trong lúc chờ. (Bài 2.5)',
      },
    ],
  },
};
