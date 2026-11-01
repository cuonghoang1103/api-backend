/**
 * Authentication · Mục 0 · Quiz Mục 0 (10 câu tình huống). Slug giữ: auth-0-4-quiz. Soạn lại 01/11/2026 (đợt mẫu):
 * bản cũ 6 câu, đáp án dồn về A/B, không giải thích ⇒ 10 câu trên đúng output của Mục 0, có giải thích.
 * Đáp án rải: A ×3 (câu 3, 6, 9) · B ×2 (1, 8) · C ×3 (4, 5, 10) · D ×2 (2, 7).
 */
export default {
  title: 'Section 0 check — 10 scenario questions|||Kiểm tra Mục 0 — 10 câu tình huống',
  slug: 'auth-0-4-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về Mục 0: thẻ có dấu HMAC, bảng tra SHA-1 không salt, nhớ người theo IP và theo kết nối, tín vật kiểu "ai cầm là người đó", tự xưng qua header, IDOR, 401/403/404, đoán phiên Date.now(), thông điệp lỗi và thời gian, cất tín vật trong localStorage — có giải thích từng câu.',
  content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Check</span>
<h2>Section 0 check</h2>
<p class="lead">Ten scenarios taken from the runs of Section 0 — the stamped card, the LinkedIn replay, the forgetful server, the three gates and LabFlow ID v0's six holes. Every explanation says why the right answer is right and why the most tempting wrong one is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain why a server cannot recognise a user by IP address or by TCP connection.</li>
<li>I can say what a bearer credential is and what follows from it.</li>
<li>I can tell identification, authentication and authorization apart in a route.</li>
<li>I can choose between 401, 403 and 404.</li>
<li>I can name the six holes of LabFlow ID v0 and the chapter that fixes each.</li>
<li>I can explain why one identical error message is not the whole fix for account enumeration.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Kiểm tra Mục 0</h2>
<p class="lead">Mười tình huống lấy từ các lần chạy của Mục 0 — tấm thẻ đóng dấu, phát lại vụ LinkedIn, máy chủ hay quên, ba cổng và sáu lỗ của LabFlow ID v0. Câu nào cũng có giải thích vì sao đáp án đúng là đúng, và vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được vì sao máy chủ không nhận ra người dùng theo địa chỉ IP hay theo kết nối TCP.</li>
<li>Tôi nói được tín vật kiểu "ai cầm là người đó" là gì và hệ quả của nó.</li>
<li>Tôi tách bạch được nhận diện, xác thực và phân quyền trong một route.</li>
<li>Tôi chọn đúng giữa 401, 403 và 404.</li>
<li>Tôi kể được sáu lỗ của LabFlow ID v0 và chương vá từng lỗ.</li>
<li>Tôi giải thích được vì sao một thông điệp lỗi giống nhau chưa phải toàn bộ cách vá việc dò tài khoản.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'In "Start here", the server issued An the card user=An;role=STUDENT.<stamp>. An edits it to role=MANAGER and sends it back. The check returns null. Why?|||Ở bài "Bắt đầu", máy chủ cấp cho An tấm thẻ user=An;role=STUDENT.<dấu>. An sửa thành role=MANAGER rồi gửi lại. Phép kiểm trả null. Vì sao?',
        options: [
          'Because the card is encrypted and An cannot read the role.|||Vì thẻ được mã hoá nên An không đọc được vai trò.',
          'Because the stamp is an HMAC of the exact text with a key only the server knows; a new text needs a new stamp An cannot compute.|||Vì con dấu là HMAC của đúng đoạn chữ với khoá chỉ máy chủ biết; chữ mới cần con dấu mới mà An không tính được.',
          'Because the server remembers which card it gave to which IP address.|||Vì máy chủ nhớ đã cấp thẻ nào cho địa chỉ IP nào.',
          'Because MANAGER is not a valid role name in LabFlow.|||Vì MANAGER không phải tên vai trò hợp lệ trong LabFlow.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: The value is readable plain text; what protects it is the HMAC stamp computed over exactly that text with a secret key. Change one character and the stamp no longer fits. "Encrypted" is the tempting wrong answer: nothing was hidden — An could read user=An;role=STUDENT — the stamp only makes changes detectable (lesson 1.4 separates hiding from protecting).|||VI: Giá trị là chữ đọc được; thứ bảo vệ nó là con dấu HMAC tính trên đúng đoạn chữ đó bằng một khoá bí mật. Đổi một ký tự là con dấu không còn khớp. "Được mã hoá" là đáp án sai hấp dẫn: chẳng có gì bị giấu — An đọc được user=An;role=STUDENT — con dấu chỉ làm cho việc sửa bị phát hiện (bài 1.4 tách bạch giấu và bảo vệ).',
      },
      {
        question: 'The LinkedIn replay hashed the 10,001 most common passwords with unsalted SHA-1 in 11.8 ms and cracked Bình at once. Then each user gets a random salt. What changes?|||Bài phát lại vụ LinkedIn băm 10.001 mật khẩu phổ biến nhất bằng SHA-1 không salt trong 11,8 ms và bẻ được Bình ngay. Sau đó mỗi người dùng có một salt ngẫu nhiên. Điều gì thay đổi?',
        options: [
          'Nothing — salt is public, so it adds no protection at all.|||Không gì cả — salt là công khai nên chẳng bảo vệ thêm gì.',
          'Bình is now safe: a salted hash cannot be guessed.|||Bình giờ an toàn: bản băm có salt thì không đoán được.',
          'SHA-1 becomes slow enough to stop guessing.|||SHA-1 trở nên đủ chậm để chặn việc đoán.',
          'The one precomputed table stops working for everyone, but guessing Bình alone still found "123456" at guess 2 in 0.26 ms — a slow hash is still needed.|||Một bảng tính sẵn dùng cho mọi người hết tác dụng, nhưng đoán riêng Bình vẫn ra "123456" ở lần thứ 2 trong 0,26 ms — vẫn cần hàm băm chậm.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Salt defeats precomputation — one table for every user — which is real progress. It does not make a weak password strong: the attacker hashes the list again with Bình’s salt, and SHA-1 is fast, so "123456" fell in 0.26 ms. "Bình is now safe" is the tempting wrong answer; Chapter 2 adds the missing piece, a deliberately slow hash.|||VI: Salt đánh bại việc tính sẵn — một bảng dùng cho mọi người — đó là tiến bộ thật. Nó không biến mật khẩu yếu thành mạnh: kẻ tấn công băm lại danh sách với salt của Bình, và SHA-1 rất nhanh, nên "123456" rơi trong 0,26 ms. "Bình giờ an toàn" là đáp án sai hấp dẫn; Chương 2 thêm mảnh còn thiếu: hàm băm cố ý chậm.',
      },
      {
        question: 'demo0/forget.js remembers users by req.ip. An signs in through localhost; then Bình, on the same machine, asks /ip/me. What did the real run return, and what does it mean in production?|||demo0/forget.js nhớ người dùng theo req.ip. An đăng nhập qua localhost; rồi Bình, trên cùng máy, hỏi /ip/me. Lần chạy thật trả gì, và ở production điều đó nghĩa là gì?',
        options: [
          '{"you":"An"} — everyone behind the same router, dorm Wi-Fi or carrier NAT would be treated as An.|||{"you":"An"} — mọi người sau cùng router, Wi-Fi ký túc xá hay NAT của nhà mạng đều bị coi là An.',
          '{"you":null} — the server can tell two people apart even on one machine.|||{"you":null} — máy chủ phân biệt được hai người kể cả trên cùng một máy.',
          '{"you":"Binh"} — the server reads the user name from the operating system.|||{"you":"Binh"} — máy chủ đọc tên người dùng từ hệ điều hành.',
          'A 401, because two people cannot share an address.|||Một lỗi 401, vì hai người không thể dùng chung địa chỉ.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: The run printed {"you":"An","ip":"::1"} for Bình: an IP identifies a network path, not a person. Many people share one public address (NAT, Carrier-Grade NAT in 100.64.0.0/10). The tempting "{"you":null}" is what happened in the third request — An herself arriving through 127.0.0.1 became nobody — the other half of the same failure.|||VI: Lần chạy in {"you":"An","ip":"::1"} cho Bình: IP nhận diện một đường mạng, không nhận diện con người. Nhiều người dùng chung một địa chỉ công khai (NAT, Carrier-Grade NAT trong 100.64.0.0/10). Đáp án "{"you":null}" hấp dẫn là chuyện ở request thứ ba — chính An đi qua 127.0.0.1 thì thành người lạ — nửa còn lại của cùng một kiểu hỏng.',
      },
      {
        question: 'The /conn version stores the name on req.socket. One curl run (two requests) remembered An on client port 60295; the next curl got {"you":null} on port 60296. What is the deeper problem in production?|||Phiên bản /conn lưu tên vào req.socket. Một lần chạy curl (hai request) nhớ An ở cổng client 60295; lần curl sau nhận {"you":null} ở cổng 60296. Vấn đề sâu hơn ở production là gì?',
        options: [
          'Port numbers above 60000 are blocked by firewalls.|||Cổng trên 60000 bị tường lửa chặn.',
          'curl does not support keep-alive, browsers do, so it would work in a browser.|||curl không hỗ trợ keep-alive, trình duyệt thì có, nên trong trình duyệt nó sẽ chạy.',
          'Connections live seconds, and a proxy or load balancer carries many users over one upstream connection — so one user could inherit another’s identity.|||Kết nối chỉ sống vài giây, và proxy hay bộ cân bằng tải chở nhiều người dùng trên một kết nối phía sau — nên người này có thể thừa hưởng danh tính của người kia.',
          'Node closes every connection after each request, so req.socket is always new.|||Node đóng mọi kết nối sau mỗi request, nên req.socket luôn mới.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Forgetting after a few seconds is annoying; handing An’s identity to whoever shares the proxy’s upstream connection is a breach. The tempting "Node closes every connection" is contradicted by the run itself: two requests shared port 60295. Node keeps idle keep-alive connections for 5 s by default — reuse exists, it just cannot carry identity.|||VI: Quên sau vài giây thì phiền; trao danh tính của An cho ai đó dùng chung kết nối phía sau của proxy thì là sự cố bảo mật. Đáp án hấp dẫn "Node đóng mọi kết nối" bị chính lần chạy bác bỏ: hai request dùng chung cổng 60295. Node mặc định giữ kết nối keep-alive rảnh 5 giây — dùng lại kết nối có tồn tại, chỉ là không mang được danh tính.',
      },
      {
        question: 'In lesson 0.1’s practice, Bình (on 127.0.0.1) sent An’s card to /card/me and got {"you":"An"}. Which statement follows?|||Trong bài thực hành 0.1, Bình (ở 127.0.0.1) gửi thẻ của An tới /card/me và nhận {"you":"An"}. Phát biểu nào rút ra được?',
        options: [
          'The server has a bug: it should compare the IP of the card with the IP of the request.|||Máy chủ có bug: lẽ ra phải so IP của thẻ với IP của request.',
          'A random 16-byte card is too short; a longer card would have stopped Bình.|||Thẻ ngẫu nhiên 16 byte quá ngắn; thẻ dài hơn sẽ chặn được Bình.',
          'The card is a bearer credential: holding it is the proof, so you design for copies — short lifetime, narrow scope, revocation.|||Thẻ là tín vật kiểu "ai cầm là người đó": cầm nó chính là bằng chứng, nên phải thiết kế cho chuyện bị sao chép — sống ngắn, phạm vi hẹp, thu hồi được.',
          'Bình must have guessed the card by brute force.|||Chắc Bình đã dò vét ra tấm thẻ.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Nothing was guessed and nothing was broken: Bình simply held a copy. That is the definition of a bearer credential, and the rest of the course limits what a copy can do. Binding to the IP is the tempting fix, but lesson 0.1 showed IPs change and are shared — it would lock out An on 4G and still admit Bình on the same Wi-Fi.|||VI: Không ai đoán gì, không gì bị phá: Bình chỉ cầm một bản sao. Đó chính là định nghĩa của tín vật kiểu "ai cầm là người đó", và cả khoá còn lại là để giới hạn một bản sao làm được gì. Gắn với IP là cách sửa hấp dẫn, nhưng bài 0.1 đã cho thấy IP thay đổi và bị dùng chung — nó chặn An khi dùng 4G mà vẫn cho Bình vào khi cùng Wi-Fi.',
      },
      {
        question: 'GET /v1/me returns the profile of whatever id is in the X-User-Id header. A teammate says "it is fine, the gateway sets that header". When is that actually safe?|||GET /v1/me trả hồ sơ của id nằm trong header X-User-Id. Một bạn cùng nhóm nói "không sao, gateway gắn header đó mà". Khi nào điều đó thật sự an toàn?',
        options: [
          'Only if the service can be reached exclusively through a gateway that strips any incoming X-User-Id and sets its own after authenticating.|||Chỉ khi dịch vụ chỉ với tới được qua một gateway luôn xoá X-User-Id do client gửi và tự gắn bản của nó sau khi xác thực.',
          'Whenever the header name starts with X-, because browsers do not send such headers.|||Bất cứ khi nào tên header bắt đầu bằng X-, vì trình duyệt không gửi header như vậy.',
          'Whenever the API uses HTTPS.|||Bất cứ khi nào API dùng HTTPS.',
          'Never; a header can never carry identity in any architecture.|||Không bao giờ; header không bao giờ mang được danh tính trong bất kỳ kiến trúc nào.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: In our run, curl typed usr_3 and became Cô Lan — any client can send any header. The pattern is only safe when nothing can bypass the gateway that strips and re-sets it. "Never" is tempting but too strong: service meshes do pass identity in headers, safely, under exactly that condition. HTTPS protects the header in transit, not its truth.|||VI: Trong lần chạy, curl gõ usr_3 và thành Cô Lan — client nào cũng gửi được header nào. Mẫu này chỉ an toàn khi không gì đi vòng qua được gateway luôn xoá và gắn lại header. "Không bao giờ" hấp dẫn nhưng quá tay: service mesh vẫn chuyển danh tính qua header, an toàn, đúng với điều kiện đó. HTTPS bảo vệ header trên đường truyền, không bảo đảm nó đúng.',
      },
      {
        question: 'An, signed in as tok_an, loops over usr_1…usr_4 on GET /v2/users/:id and gets 200 200 200 404. What is this, and where does the fix belong?|||An, đăng nhập bằng tok_an, lặp usr_1…usr_4 trên GET /v2/users/:id và nhận 200 200 200 404. Đây là gì, và cách vá đặt ở đâu?',
        options: [
          'A rate-limit problem; add a 429 after three requests.|||Vấn đề giới hạn tần suất; thêm 429 sau ba request.',
          'An authentication problem; make tok_an expire sooner.|||Vấn đề xác thực; cho tok_an hết hạn sớm hơn.',
          'A predictable-id problem; switching to UUIDs fixes it.|||Vấn đề id dễ đoán; đổi sang UUID là sửa được.',
          'IDOR/BOLA — authenticated but not authorized; the fix is a per-object check inside the lookup (yourself or a lab manager), answering 404 otherwise.|||IDOR/BOLA — đã xác thực nhưng chưa phân quyền; cách vá là kiểm theo đối tượng ngay trong phép tra (chính mình hoặc quản lý lab), còn lại trả 404.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Gate 2 passed and gate 3 was never asked. Version v3 puts the rule inside the lookup and the same loop gives 200 404 404 404. UUIDs are the tempting answer: OWASP lists unpredictable ids as an extra layer, but ids leak through links and logs — the check is the defence. This class of bug is A01 in the OWASP Top 10:2025.|||VI: Cổng 2 qua còn cổng 3 chưa hề được hỏi. Phiên bản v3 đặt quy tắc trong phép tra và cùng vòng lặp đó cho 200 404 404 404. UUID là đáp án hấp dẫn: OWASP liệt kê id khó đoán như một lớp phụ, nhưng id rò qua đường link và log — phép kiểm mới là phòng thủ. Loại lỗi này là A01 trong OWASP Top 10:2025.',
      },
      {
        question: 'An is signed in. She sends PATCH /v3/users/usr_1/role to make herself LAB_MANAGER. Which response is right, and why?|||An đã đăng nhập. An gửi PATCH /v3/users/usr_1/role để tự lên LAB_MANAGER. Phản hồi nào đúng, vì sao?',
        options: [
          '401 — she lacks the permission, so she is unauthorized.|||401 — An thiếu quyền, nên là "unauthorized".',
          '403 — the server knows who she is and refuses the action; signing in again would change nothing.|||403 — máy chủ biết An là ai và từ chối hành động; đăng nhập lại cũng chẳng thay đổi gì.',
          '404 — the route must be hidden from students.|||404 — route phải được giấu khỏi sinh viên.',
          '200 — it is her own profile, so she may change anything on it.|||200 — đó là hồ sơ của chính An, nên An được đổi mọi thứ trên nó.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Our run returned 403 Forbidden. 401 is the tempting answer because of its name, but it means "unauthenticated" — sending it here throws the front end into a sign-in loop. The route is not secret, so there is nothing for a 404 to hide; and owning a profile does not grant every action on it (even Bình got 403 on her own role).|||VI: Lần chạy trả 403 Forbidden. 401 là đáp án hấp dẫn vì cái tên, nhưng nó nghĩa là "chưa xác thực" — gửi nó ở đây ném front end vào vòng lặp đăng nhập. Route không bí mật nên 404 chẳng có gì để giấu; và sở hữu hồ sơ không có nghĩa được làm mọi hành động trên nó (cả Bình cũng nhận 403 khi đổi vai trò của chính mình).',
      },
      {
        question: 'LabFlow ID v0 uses String(Date.now()) as the session id. An attacker knows only that An signed in "at 12:59". What did the real guess-session run show?|||LabFlow ID v0 dùng String(Date.now()) làm mã phiên. Kẻ tấn công chỉ biết An đăng nhập "lúc 12:59". Lần chạy guess-session thật cho thấy gì?',
        options: [
          'Found after 36,839 guesses in 4.37 s: one minute is only 60,000 candidates (about 16 bits); session ids need a CSPRNG and at least 64 bits, LabFlow ID uses 256.|||Tìm ra sau 36.839 lần đoán trong 4,37 giây: một phút chỉ có 60.000 ứng viên (khoảng 16 bit); mã phiên cần CSPRNG và ít nhất 64 bit, LabFlow ID dùng 256.',
          'Not found: 13-digit numbers are far too many to try.|||Không tìm ra: số 13 chữ số thì quá nhiều để thử.',
          'Found only because the server leaked the id in an error message.|||Tìm ra chỉ vì máy chủ làm lộ mã trong thông báo lỗi.',
          'Found, but only after the attacker cracked An’s password first.|||Tìm ra, nhưng chỉ sau khi kẻ tấn công bẻ được mật khẩu của An trước.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Length is not entropy. A 13-digit timestamp looks huge, but knowing the minute leaves 60,000 values, and 32 parallel workers found An’s session in 4.37 s. "Too many to try" is the tempting wrong answer — it confuses the size of the number with the size of the attacker’s search space. Lesson 1.2 replaces it with newToken() (256 random bits).|||VI: Độ dài không phải entropy. Một dấu thời gian 13 chữ số trông rất lớn, nhưng biết phút là còn 60.000 giá trị, và 32 luồng song song tìm ra phiên của An trong 4,37 giây. "Quá nhiều để thử" là đáp án sai hấp dẫn — nó lẫn độ lớn của con số với độ lớn không gian kẻ tấn công phải dò. Bài 1.2 thay bằng newToken() (256 bit ngẫu nhiên).',
      },
      {
        question: 'After the practice of lesson 0.3, both login failures answer "Email or password is incorrect" and the enumeration script can no longer tell. What can still leak which accounts exist?|||Sau bài thực hành 0.3, cả hai kiểu đăng nhập hỏng đều trả "Email or password is incorrect" và script dò email không còn phân biệt được. Thứ gì vẫn có thể rò việc tài khoản nào tồn tại?',
        options: [
          'Nothing; identical messages are a complete fix.|||Không gì cả; thông điệp giống nhau là đã vá xong.',
          'The HTTP status code, because 401 reveals that the email exists.|||Mã trạng thái HTTP, vì 401 tiết lộ email tồn tại.',
          'The response time: an unknown email returns immediately, a known one goes on to the password check — which Chapter 2 makes deliberately slow.|||Thời gian phản hồi: email lạ trả về ngay, email có thật thì đi tiếp tới bước kiểm mật khẩu — thứ mà Chương 2 cố ý làm chậm.',
          'The localStorage of the attacker’s browser.|||localStorage trong trình duyệt của kẻ tấn công.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: OWASP warns that "the response time will be different for the same error". Both branches now return 401 with the same text, so the status code is the tempting but wrong choice — it is identical. Once a slow hash runs only for known emails, timing becomes the oracle; Chapter 6 measures it and hashes a dummy value on the unknown path.|||VI: OWASP cảnh báo "the response time will be different for the same error". Cả hai nhánh giờ đều trả 401 với cùng câu chữ, nên mã trạng thái là lựa chọn hấp dẫn nhưng sai — nó giống hệt nhau. Khi hàm băm chậm chỉ chạy với email có thật, thời gian thành kênh dò; Chương 6 đo điều đó và băm một giá trị giả ở nhánh email lạ.',
      },
    ],
  },
};
