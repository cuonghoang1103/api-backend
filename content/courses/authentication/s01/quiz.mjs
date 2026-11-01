/**
 * Authentication · Chương 1 · Quiz (10 câu tình huống trên LabFlow ID, số đo của chương). Slug giữ: auth-1-6-quiz.
 * Đáp án rải: A ×2 (câu 3, 7) · B ×3 (1, 5, 9) · C ×2 (2, 8) · D ×3 (4, 6, 10).
 */
export default {
  title: '1.6 — Quiz: credentials and primitives|||1.6 — Quiz: tín vật và nguyên hàm',
  slug: 'auth-1-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống trên LabFlow ID về Chương 1: tín vật kiểu bearer, Referer, Math.random đoán được, sai lệch modulo, phép đo nói dối, webhook trên thân gốc, lưu digest, khoá HMAC dùng chung, length extension, log lỗi axios — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Check</span>
<h2>Chapter 1 check</h2>
<p class="lead">Ten scenarios from LabFlow ID, with the numbers you measured in this chapter. Every explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say what “bearer” means for lifetime, scope and revocation.</li>
<li>I can generate a token from the CSPRNG and say how many bits it carries.</li>
<li>I can compare secrets without leaking timing — or avoid comparing by looking up a digest.</li>
<li>I can choose between a hash, an HMAC and a signature, and say why encryption is not integrity.</li>
<li>I can name four places a secret leaks with no attacker involved.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Kiểm tra Chương 1</h2>
<p class="lead">Mười tình huống từ LabFlow ID, dùng đúng những con số bạn đã đo trong chương. Câu nào cũng giải thích vì sao đáp án đúng là đúng, và vì sao phương án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được "bearer" nghĩa là gì với tuổi thọ, phạm vi và thu hồi.</li>
<li>Tôi sinh được token từ CSPRNG và nói được nó mang bao nhiêu bit.</li>
<li>Tôi so được bí mật mà không rò thời gian — hoặc tránh so bằng cách tra digest.</li>
<li>Tôi chọn được giữa băm, HMAC và chữ ký, và nói được vì sao mã hoá không phải toàn vẹn.</li>
<li>Tôi kể được bốn chỗ bí mật rò ra mà chẳng cần kẻ tấn công nào.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'An’s LabFlow ID session token is copied (from a screenshot of her terminal) and used from Bình’s laptop with a different browser. What does the server do?|||Token phiên LabFlow ID của An bị chép (từ một ảnh chụp terminal) và dùng trên laptop của Bình với trình duyệt khác. Máy chủ làm gì?',
        options: [
          'It rejects the request because the IP address and User-Agent changed|||Từ chối vì địa chỉ IP và User-Agent đã đổi',
          'It answers as An: a bearer token is proof by possession, so only its lifetime, scope and revocation limit the damage|||Trả lời như với An: token bearer là bằng chứng bằng việc cầm giữ, nên chỉ tuổi thọ, phạm vi và khả năng thu hồi mới giới hạn thiệt hại',
          'It answers as Bình, because Bình is the one sending the request|||Trả lời như với Bình, vì Bình là người gửi request',
          'It locks An’s account after detecting two devices|||Khoá tài khoản của An sau khi phát hiện hai thiết bị',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: In lesson 1.1 the copied token returned {"you":"An"} from 127.0.0.1 with a Firefox User-Agent; only one extra character produced a 401. Rejecting on IP/User-Agent is tempting but nothing in v0.1 does it, and as a rule it breaks real users (4G, NAT) without stopping a careful thief.|||VI: Ở bài 1.1, token bị chép vẫn trả {"you":"An"} từ 127.0.0.1 với User-Agent Firefox; chỉ khi thêm một ký tự mới ra 401. Từ chối theo IP/User-Agent nghe hấp dẫn nhưng v0.1 không hề làm thế, và nói chung nó làm khổ người dùng thật (4G, NAT) mà không chặn được kẻ trộm cẩn thận.',
      },
      {
        question: 'The reset page http://localhost:4800/reset?token=lfid_reset_… loads an analytics pixel from another origin. No Referrer-Policy is set. In Chromium 156, what Referer does the analytics server receive?|||Trang đặt lại http://localhost:4800/reset?token=lfid_reset_… tải một pixel thống kê từ origin khác. Không đặt Referrer-Policy. Trong Chromium 156, máy chủ thống kê nhận Referer gì?',
        options: [
          'The full URL including the token|||URL đầy đủ, kèm cả token',
          'No Referer at all|||Không có Referer nào',
          'Only the origin, http://localhost:4800/ — but the full URL still reaches same-origin requests and the access log|||Chỉ origin, http://localhost:4800/ — nhưng URL đầy đủ vẫn tới các request cùng origin và access log',
          'Only the token, without the path|||Chỉ token, không có đường dẫn',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured in lesson 1.1: default (strict-origin-when-cross-origin) sent only the origin to the third party, while /static/app.js got the full URL and the access log recorded it. The “full URL” answer was the old default; it is still what you get with no-referrer-when-downgrade or unsafe-url — so do not put tokens in URLs.|||VI: Đo ở bài 1.1: mặc định (strict-origin-when-cross-origin) chỉ gửi origin sang bên thứ ba, còn /static/app.js nhận URL đầy đủ và access log ghi lại nó. Đáp án "URL đầy đủ" là mặc định cũ; bạn vẫn gặp nó khi đặt no-referrer-when-downgrade hay unsafe-url — nên đừng đặt token trong URL.',
      },
      {
        question: 'A teammate generates reset tokens with Math.random(). How many outputs did lesson 1.2’s predictor need to compute the next ones exactly?|||Một bạn cùng nhóm sinh token đặt lại mật khẩu bằng Math.random(). Bộ dự đoán của bài 1.2 cần bao nhiêu giá trị để tính đúng các giá trị kế tiếp?',
        options: [
          'Four raw outputs: 208 equations solved all 128 state bits and 5/5 predictions matched (three gave only 116 bits)|||Bốn giá trị thô: 208 phương trình giải đủ 128 bit trạng thái và đoán đúng 5/5 (ba giá trị chỉ ra 116 bit)',
          'About 2^52 guesses, because each output has 52 random bits|||Khoảng 2^52 lần đoán, vì mỗi giá trị có 52 bit ngẫu nhiên',
          'It cannot be predicted without the --random-seed flag|||Không đoán được nếu không có cờ --random-seed',
          'One output is enough, because Math.random is just Date.now()|||Một giá trị là đủ, vì Math.random chỉ là Date.now()',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: xorshift128+ is linear over bits; each output reveals 52 bits of state, so 4 outputs give 208 equations for 128 unknowns. The 2^52 answer treats the output as a fresh coin flip — it is a formula. --random-seed only showed that the sequence is deterministic; prediction works without it.|||VI: xorshift128+ tuyến tính theo bit; mỗi giá trị lộ 52 bit trạng thái, nên 4 giá trị cho 208 phương trình cho 128 ẩn. Đáp án 2^52 coi mỗi giá trị như một lần tung đồng xu mới — nó là một công thức. --random-seed chỉ cho thấy dãy số là tất định; dự đoán chạy được mà không cần nó.',
      },
      {
        question: 'A 6-digit one-time code is built as six times randomBytes(1)[0] % 10. What is wrong?|||Một mã một lần 6 chữ số được dựng bằng sáu lần randomBytes(1)[0] % 10. Sai ở đâu?',
        options: [
          'Nothing: randomBytes is a CSPRNG, so any arithmetic on it stays uniform|||Không sai gì: randomBytes là CSPRNG nên làm phép tính gì trên nó cũng vẫn đều',
          'It is too slow; use Math.random for codes|||Quá chậm; với mã thì dùng Math.random',
          'A byte has only 8 bits, so the code has 8 bits of entropy|||Một byte chỉ có 8 bit, nên mã chỉ có 8 bit entropy',
          'Modulo bias: 256 = 25 × 10 + 6, so digits 0–5 come up 26/256 of the time and 6–9 only 25/256 — use crypto.randomInt(10)|||Sai lệch modulo: 256 = 25 × 10 + 6, nên chữ số 0–5 ra 26/256 số lần còn 6–9 chỉ 25/256 — dùng crypto.randomInt(10)',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Lesson 1.2 counted a million draws: digits 0–5 between 100,371 and 101,778, digits 6–9 between 97,115 and 98,386; randomInt stayed near 100,000 everywhere. “Any arithmetic stays uniform” is the trap — % on a range that does not divide 256 is not uniform. (The code still has about 20 bits; attempt limits matter more — Chapter 7.)|||VI: Bài 1.2 đếm một triệu lần rút: chữ số 0–5 từ 100.371 tới 101.778, 6–9 từ 97.115 tới 98.386; randomInt quanh 100.000 ở mọi chữ số. "Phép tính gì cũng vẫn đều" chính là cái bẫy — % trên một khoảng không chia hết 256 thì không đều. (Mã vẫn có khoảng 20 bit; giới hạn lượt thử quan trọng hơn — Chương 7.)',
      },
      {
        question: 'Your benchmark prints 0.99 ns for === at every position of a 64-character token. What is the right conclusion?|||Phép đo của bạn in 0,99 ns cho === ở mọi vị trí của token 64 ký tự. Kết luận đúng là gì?',
        options: [
          '=== is constant-time in V8, so timingSafeEqual is unnecessary|||=== trong V8 chạy hằng thời gian, nên timingSafeEqual là thừa',
          'The benchmark measured an empty loop: the input never changed and the result was unused, so the JIT computed the comparison once|||Phép đo đã đo một vòng lặp rỗng: đầu vào không đổi và kết quả không ai dùng, nên JIT chỉ tính phép so một lần',
          'The machine is too fast to measure strings shorter than 1 KB|||Máy quá nhanh để đo chuỗi ngắn hơn 1 KB',
          'process.hrtime.bigint() is not precise enough below 1 µs|||process.hrtime.bigint() không đủ chính xác dưới 1 µs',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: With 8 rotating copies and every result counted, the same machine showed 4.61 → 6.56 ns over 64 characters and 4.61 → 38.05 ns over 1,024. “=== is constant-time” is exactly what the lying benchmark tempts you to believe; hrtime is fine because each sample covers a million comparisons.|||VI: Xoay 8 bản sao và đếm mọi kết quả thì cùng máy đó cho 4,61 → 6,56 ns trên 64 ký tự và 4,61 → 38,05 ns trên 1.024. "=== chạy hằng thời gian" đúng là điều phép đo nói dối dụ bạn tin; hrtime đủ chính xác vì mỗi mẫu gồm một triệu phép so.',
      },
      {
        question: 'LabFlow API’s webhook receiver runs express.json() and then verifies the HMAC over JSON.stringify(req.body). Honest requests from LabFlow ID fail with BAD_SIGNATURE. Why?|||Bên nhận webhook của LabFlow API chạy express.json() rồi kiểm HMAC trên JSON.stringify(req.body). Request trung thực từ LabFlow ID vẫn trượt BAD_SIGNATURE. Vì sao?',
        options: [
          'The shared secret is wrong on one side|||Bí mật dùng chung bị sai ở một phía',
          'timingSafeEqual cannot compare hex signatures|||timingSafeEqual không so được chữ ký hex',
          'The timestamp is older than 300 seconds|||Dấu thời gian cũ hơn 300 giây',
          'The bytes differ: the sender signed pretty-printed JSON, re-serialising dropped the spaces — verify the raw body|||Các byte khác nhau: bên gửi ký JSON được định dạng đẹp, serialize lại làm mất dấu cách — hãy kiểm thân gốc',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: In lesson 1.3 the same secret and timestamp gave BAD_SIGNATURE on /hooks/parsed and OK on /hooks/raw. A wrong secret is the usual first guess, but the raw receiver proves the secret is right. An old timestamp would say TOO_OLD, not BAD_SIGNATURE.|||VI: Ở bài 1.3 cùng bí mật và dấu thời gian cho BAD_SIGNATURE ở /hooks/parsed và OK ở /hooks/raw. Sai bí mật là phỏng đoán đầu tiên quen thuộc, nhưng bên nhận raw chứng minh bí mật đúng. Dấu thời gian cũ sẽ báo TOO_OLD chứ không phải BAD_SIGNATURE.',
      },
      {
        question: 'How should LabFlow ID store session tokens so that a leaked data/db.json cannot be used to sign in?|||LabFlow ID nên lưu token phiên thế nào để một data/db.json bị lộ không dùng để đăng nhập được?',
        options: [
          'Store SHA-256 of each token and look the session up by the digest of the token presented|||Lưu SHA-256 của mỗi token và tra phiên theo digest của token được trình ra',
          'Store the tokens encrypted with AES-256-CTR and decrypt them on every request|||Lưu token đã mã hoá AES-256-CTR rồi giải mã ở mỗi request',
          'Store the tokens in plain text but compare them with timingSafeEqual|||Lưu token dạng thô nhưng so bằng timingSafeEqual',
          'Store argon2id hashes of the tokens, like passwords|||Lưu băm argon2id của token, như mật khẩu',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: v0.1 keeps only "digest": "00ce0da2…"; a digest cannot be presented as a session and there is no comparison of secrets left. Plain text + timingSafeEqual fixes timing but not the leaked file. Encryption needs a key on the same server (and CTR is malleable, lesson 1.4). argon2id is pointless for 256 random bits and slow on every request.|||VI: v0.1 chỉ giữ "digest": "00ce0da2…"; digest không trình ra như phiên được và không còn phép so bí mật nào. Lưu thô + timingSafeEqual sửa được chuyện thời gian nhưng không cứu được tệp bị lộ. Mã hoá cần khoá nằm ngay trên máy chủ đó (và CTR sửa được, bài 1.4). argon2id là thừa với 256 bit ngẫu nhiên và chậm ở mọi request.',
      },
      {
        question: 'LabFlow ID signs tokens with HMAC-SHA256, and the billing service gets the same key so it can verify them. What is the real risk?|||LabFlow ID ký token bằng HMAC-SHA256, và dịch vụ billing nhận cùng khoá để kiểm. Rủi ro thật là gì?',
        options: [
          'HMAC-SHA256 is cryptographically weak; switching to RS256 makes the tokens harder to break|||HMAC-SHA256 yếu về mật mã; chuyển sang RS256 thì token khó bẻ hơn',
          'Billing will verify tokens more slowly than LabFlow ID|||Billing sẽ kiểm token chậm hơn LabFlow ID',
          'Whoever can verify can also mint: billing (or anyone who breaches it) can issue a LAB_MANAGER token — give verifiers a public key instead (Ed25519)|||Ai kiểm được thì cũng tạo được: billing (hay bất kỳ ai xâm nhập nó) phát được token LAB_MANAGER — hãy đưa cho bên kiểm một khoá công khai (Ed25519)',
          'There is no risk as long as the key is 32 random bytes|||Không rủi ro gì miễn khoá có 32 byte ngẫu nhiên',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Lesson 1.4: the token made by billing “checks out → true … role: LAB_MANAGER”; with Ed25519 billing could verify but signing with the public key threw ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE. The problem is who holds the power to issue, not the strength of HMAC — a 32-byte key does not change who holds it.|||VI: Bài 1.4: token do billing tạo "checks out → true … role: LAB_MANAGER"; với Ed25519 billing kiểm được nhưng ký bằng khoá công khai thì ném ERR_CRYPTO_INVALID_KEY_OBJECT_TYPE. Vấn đề là ai nắm quyền phát token, không phải độ mạnh của HMAC — khoá 32 byte không đổi được việc ai đang cầm nó.',
      },
      {
        question: 'A cookie is "user=usr_1&role=STUDENT" with tag sha256(SECRET + message). An knows the message, the tag and the key length but not SECRET. Can she obtain a valid tag for a message ending in "&role=LAB_MANAGER"?|||Một cookie là "user=usr_1&role=STUDENT" kèm thẻ sha256(SECRET + thông điệp). An biết thông điệp, thẻ và độ dài khoá nhưng không biết SECRET. Cô ấy có tạo được thẻ hợp lệ cho một thông điệp kết thúc bằng "&role=LAB_MANAGER" không?',
        options: [
          'No: without SECRET nobody can compute a SHA-256 that matches|||Không: không có SECRET thì không ai tính được SHA-256 khớp',
          'Yes: length extension — the digest is SHA-256’s internal state, so she continues hashing from it; HMAC is not vulnerable|||Có: length extension — digest chính là trạng thái bên trong của SHA-256, nên cô ấy băm tiếp từ đó; HMAC thì không bị',
          'Only if SECRET is shorter than 16 bytes|||Chỉ khi SECRET ngắn hơn 16 byte',
          'Only with a quantum computer|||Chỉ với máy tính lượng tử',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Lesson 1.4 forged the 57-byte message user=usr_1&role=STUDENT + SHA-256 padding + &role=LAB_MANAGER against a 24-byte random key: sha256(secret+msg) accepted it, HMAC refused. “Without SECRET nobody can” is true for HMAC, not for this homemade construction.|||VI: Bài 1.4 giả được thông điệp 57 byte user=usr_1&role=STUDENT + phần đệm SHA-256 + &role=LAB_MANAGER với khoá ngẫu nhiên 24 byte: sha256(secret+msg) chấp nhận, HMAC từ chối. "Không có SECRET thì không ai làm được" đúng với HMAC, không đúng với kiểu tự chế này.',
      },
      {
        question: 'A call to a partner API fails and the code runs logger.error({ err }, "payment API failed") with pino. What ended up in the 9,771-byte log line?|||Một lời gọi tới API đối tác thất bại và mã chạy logger.error({ err }, "payment API failed") bằng pino. Dòng log 9.771 byte chứa gì?',
        options: [
          'Only the message "Request failed with status code 500"|||Chỉ câu "Request failed with status code 500"',
          'Nothing sensitive — pino redacts the Authorization header by default|||Không có gì nhạy cảm — pino mặc định che header Authorization',
          'The response body of the partner, nothing about the request|||Thân phản hồi của đối tác, không có gì về request',
          'The partner API key, five times — axios errors carry config.headers and the raw request; log status, code and message only|||Khoá API của đối tác, năm lần — lỗi axios mang theo config.headers và request thô; chỉ log status, code và message',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Lesson 1.5 counted pk_demo_partner_key_000 five times in that line. pino redacts only the paths you configure — there is no default — which is why the deny-list approach fails and the safe line logs an explicit allow-list: status, code, error.|||VI: Bài 1.5 đếm được pk_demo_partner_key_000 xuất hiện năm lần trong dòng đó. pino chỉ che những đường dẫn bạn cấu hình — không có mặc định nào — nên deny-list thất bại và dòng an toàn log một allow-list rõ ràng: status, code, error.',
      },
    ],
  },
};
