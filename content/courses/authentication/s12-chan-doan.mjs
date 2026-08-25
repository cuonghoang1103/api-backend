/**
 * Authentication — Chương 12: Chẩn đoán, và lời kết.
 * Năm phút đầu · tám hình dạng hỏng · hộp đồ nghề · soát một kho mã kế thừa ·
 * lời kết · bài kiểm cuối khoá.
 * Output CHẠY THẬT Node.js 22 + Express 5 + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fauthentication%2Flearn&reflabel=Auth';

export default {
  title: 'Chapter 12 — Diagnosis, and where to start|||Chương 12 — Chẩn đoán, và bắt đầu từ đâu',
  description: 'Chương cuối là chương bạn sẽ mở lại nhiều nhất: một cây quyết định cho năm phút đầu khi "người dùng không đăng nhập được", tám hình dạng hỏng và ý nghĩa của từng cái, hộp đồ nghề để tự trả lời, một bảng soát cho kho mã bạn vừa kế thừa, và lời kết nói thẳng nên dựng cái gì trước.',
  lessons: [

    /* ─────────────────────────── 12.1 ─────────────────────────── */
    {
      title: '12.1 — The first five minutes: "users cannot log in"|||12.1 — Năm phút đầu tiên: "người dùng không đăng nhập được"',
      slug: 'auth-12-1-nam-phut-dau',
      type: 'LESSON',
      description: 'Một cây quyết định chạy được trong năm phút và cắt bài toán làm đôi ở mỗi bước. Câu hỏi đầu tiên không phải "vì sao nó hỏng" mà là "hỏng với BAO NHIÊU người" — vì câu trả lời cho câu đó quyết định bạn đi nhánh nào trong bốn nhánh, và ba nhánh còn lại thì bỏ hẳn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>The first five minutes: "users cannot log in"</h2>
<p class="lead">Authentication failures arrive as one sentence with no detail, usually from somebody who cannot give you more. The instinct is to start reading code. The faster path is four questions that each halve the search space — and after four questions you are looking at one subsystem instead of eleven chapters.</p>

<h3>Question 1: how many?</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Everyone</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Something you deployed</span><span class="lz-nsub">A key, a config value, a dependency, a clock · check the last deploy first, always</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">One person</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Their account or their device</span><span class="lz-nsub">Locked, unverified, revoked, wrong password, a browser extension · read their audit log</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">A group</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Find what they share</span><span class="lz-nsub">One tenant, one provider, one country, one client version, one rate-limit bucket</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Intermittent</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A race or a rollout</span><span class="lz-nsub">Half the instances have the new key · or the refresh race from Lesson 5.5 · reproduce with concurrency</span></div></div>
  </div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Everyone means the last change</span><span class="v">Nothing else affects every user simultaneously. Look at the last deploy, the last config edit and the last dependency bump, in that order — and if a key rotation happened recently, read Lesson 11.2 before anything else.</span></div>
  <div class="kv"><span class="k">One person means look at their row</span><span class="v">Is the account locked, is the email unverified, was every session revoked by a password change, does an MFA factor exist that they do not have? The audit log from Lesson 11.4 answers all four in one query, and it is faster than any hypothesis.</span></div>
  <div class="kv"><span class="k">A group means find the shared attribute</span><span class="v">Everyone in one workspace, everyone on one identity provider, everyone on the mobile app version released yesterday, everyone behind one office IP hitting a per-IP limiter. Query for the attribute rather than guessing at the cause.</span></div>
  <div class="kv"><span class="k">Intermittent means concurrency or a partial rollout</span><span class="v">The two shapes that produce "it works when I try it". A rolling deploy where instances disagree about the key set (11.2), or a race that only appears under parallel requests (5.5, 10.5). Neither reproduces with a single sequential attempt.</span></div>
</div>

<h3>Question 2: which step?</h3>
<pre><code><span class="tok-comment">// Ba bước, ba mã trạng thái khác nhau. Hỏi CÁI NÀO trước khi đoán vì sao.</span>
POST /sign-in   → 401  <span class="tok-comment">// tín vật sai, HOẶC tài khoản bị khoá, HOẶC băm không khớp</span>
POST /sign-in   → 429  <span class="tok-comment">// bộ giới hạn — Bài 11.3, và hãy hỏi nó đếm theo TRỤC nào</span>
POST /mfa/kiem    → 401  <span class="tok-comment">// mã đúng nhưng đồng hồ lệch, hoặc buocCuoi chặn tái dùng — 7.2</span>
GET  /api/me     → 401  <span class="tok-comment">// đăng nhập ĐƯỢC, phiên KHÔNG dùng được ⇒ cookie hoặc token</span>
GET  /api/me     → 403  <span class="tok-comment">// phiên tốt, PHÂN QUYỀN từ chối ⇒ Chương 9, không phải xác thực</span></code></pre>
<div class="pitfall">
<p><strong>Trap — "cannot log in" and "gets logged out immediately" are different bugs with the same sentence.</strong> If <code>/dang-nhap</code> returns 200 and the very next request returns 401, authentication succeeded and the <em>session</em> failed — which moves you from Chapter 2 to Chapter 3 or 4, an entirely different subsystem. Ask for the network tab, or reproduce with two <code>curl</code> calls: one to log in, one to use what it returned. Two commands separate the two halves of the course, and people routinely spend an afternoon in the wrong one.</p>
</div>

<h3>Question 3: does it reproduce outside the browser?</h3>
<div class="out">$ curl -si -X POST https://vidu.com/api/v1/dang-nhap \\
    -H 'content-type: application/json' \\
    -d '{"email":"kiem-thu@vidu.com","matKhau":"…"}' | head -20

HTTP/2 200
set-cookie: phien=…; Path=/; HttpOnly; Secure; SameSite=Lax
content-type: application/json

# Dang nhap CHAY DUOC bang curl nhung HONG tren trinh duyet ⇒ khong phai
# van de tin vat. Doc thang xuong: Set-Cookie co Secure ma trang dang chay
# tren http? SameSite=Strict ma nguoi dung toi tu mot chuyen huong? Domain
# tro sai? Ba cai do la Chuong 3, va ca ba khong hien ra trong log may chu.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">curl works, browser does not</span><span class="lz-t">It is the cookie</span><span class="lz-d">Read the <code>Set-Cookie</code> header literally: <code>Secure</code> on an http origin, <code>SameSite=Strict</code> after a cross-site redirect, a <code>Domain</code> that does not match, or a missing <code>Path</code>. Chapter 3, and none of it appears in server logs.</span></div>
  <div class="lz-step"><span class="lz-k">Neither works</span><span class="lz-t">Server-side</span><span class="lz-d">The credential, the hash, the account state or the rate limiter. Now the server logs are the right place, and Lesson 12.2's shapes tell you which one.</span></div>
  <div class="lz-step"><span class="lz-k">Works for you, not for them</span><span class="lz-t">Compare the two requests</span><span class="lz-d">Different client version, different provider, different tenant, different country, different token age. The difference is in the request, so get theirs — a HAR file or the exact failing request beats any amount of speculation.</span></div>
  <div class="lz-step"><span class="lz-k">Works on staging, not production</span><span class="lz-t">Configuration, almost always</span><span class="lz-d">A missing environment variable, a different key set, a proxy that rewrites headers, <code>trust proxy</code> unset so every user shares one IP at the limiter. Lesson 11.1 and 11.3, in that order.</span></div>
</div>

<h3>Question 4: what changed?</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Your deploy, first</span><span class="lz-lnote">Code, configuration, dependencies, database migration. The commit log is the shortest list of suspects you will ever have, and "nothing changed" is almost never true — it usually means the change was in configuration, which is not in the commit log.</span></div>
  <div class="lz-layer"><span class="lz-lname">Their deploy, second</span><span class="lz-lnote">An identity provider rotated a key or changed a claim, a mail provider started rate-limiting you, a browser shipped a stricter cookie default. You did not change and it broke anyway — check the provider's status page and changelog before doubting your own code.</span></div>
  <div class="lz-layer"><span class="lz-lname">Time, third</span><span class="lz-lnote">A certificate expired, a token you thought was short-lived finally aged out, a key overlap window ended (11.2), a scheduled job deleted unverified accounts (6.2). Nobody deployed anything; a clock simply passed a number.</span></div>
  <div class="lz-layer"><span class="lz-lname">Scale, fourth</span><span class="lz-lnote">The race that needed traffic to appear, the connection pool that ran out, the rate limiter that was generous at a thousand users and is not at fifty thousand. It broke because it got bigger, which is the hardest one to see because nothing about it looks like an event.</span></div>
</div>
<div class="note-ct">
<p><strong>Write down what you learn as you go, in the ticket.</strong> "Reproduces with curl. 200 on login, 401 on the next call. Set-Cookie has Secure and the report came from an http staging URL." Three sentences and the bug is found — and if it is not you, the person who picks it up next starts from where you stopped rather than from the beginning. Authentication incidents are unusually prone to being investigated three times by three people because nobody recorded which halves were already eliminated.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">MDN — HTTP status codes</span><span class="lc-sub">developer.mozilla.org · 401 versus 403, and why the distinction matters here</span></span></a>
<a class="link-card" href="https://curl.se/docs/manual.html" target="_blank" rel="noopener"><span class="lc-ico">🌀</span><span class="lc-body"><span class="lc-title">curl — the manual</span><span class="lc-sub">curl.se · Cookie jars, -i, and reproducing a browser request exactly</span></span></a>
<a class="link-card" href="https://developer.chrome.com/docs/devtools/network" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">Chrome DevTools — network panel</span><span class="lc-sub">developer.chrome.com · Reading Set-Cookie, and exporting a HAR file</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">CuongThai course — Linux &amp; Bash</span><span class="lc-sub">Reading logs quickly, and the pipeline that narrows a search</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Six broken systems, one sentence each — find the cause in under five minutes</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Năm phút đầu tiên: "người dùng không đăng nhập được"</h2>
<p class="lead">Sự cố xác thực tới dưới dạng MỘT CÂU không kèm chi tiết nào, thường là từ một người không đưa thêm được gì. Bản năng là lao vào đọc mã. Đường nhanh hơn là bốn câu hỏi, mỗi câu cắt đôi vùng tìm kiếm — và sau bốn câu hỏi thì bạn đang nhìn vào MỘT phân hệ thay vì mười một chương.</p>

<h3>Câu hỏi 1: BAO NHIÊU người?</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Tất cả</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một thứ BẠN vừa đưa lên</span><span class="lz-nsub">Một cái khoá, một giá trị cấu hình, một gói phụ thuộc, một cái đồng hồ · hãy xem lần deploy gần nhất TRƯỚC TIÊN, luôn luôn</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Một người</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Tài khoản của họ hoặc thiết bị của họ</span><span class="lz-nsub">Bị khoá, chưa xác minh, đã thu hồi, sai mật khẩu, một tiện ích trình duyệt · hãy đọc nhật ký kiểm toán của họ</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Một nhóm</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Tìm cái họ DÙNG CHUNG</span><span class="lz-nsub">Một tenant, một nhà cung cấp, một quốc gia, một phiên bản client, một cái gàu giới hạn tần suất</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Lúc được lúc không</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một cuộc đua hoặc một đợt triển khai dở dang</span><span class="lz-nsub">Nửa số bản chạy đã có khoá mới · hoặc cuộc đua refresh ở Bài 5.5 · hãy tái hiện bằng cách chạy SONG SONG</span></div></div>
  </div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">TẤT CẢ nghĩa là thay đổi gần nhất</span><span class="v">Chẳng thứ gì khác ảnh hưởng tới mọi người dùng CÙNG LÚC. Hãy xem lần deploy gần nhất, lần sửa cấu hình gần nhất và lần nâng gói phụ thuộc gần nhất, theo đúng thứ tự đó — và nếu vừa có một lần xoay khoá thì hãy đọc Bài 11.2 trước mọi thứ khác.</span></div>
  <div class="kv"><span class="k">MỘT NGƯỜI nghĩa là hãy nhìn vào bản ghi của họ</span><span class="v">Tài khoản có bị khoá không, email đã xác minh chưa, mọi phiên có bị một lần đổi mật khẩu thu hồi không, có tồn tại một yếu tố MFA mà họ không có không? Nhật ký kiểm toán ở Bài 11.4 trả lời cả bốn trong MỘT câu truy vấn, và nó nhanh hơn mọi giả thuyết.</span></div>
  <div class="kv"><span class="k">MỘT NHÓM nghĩa là tìm cái thuộc tính chung</span><span class="v">Tất cả trong một không gian làm việc, tất cả dùng một nhà cung cấp danh tính, tất cả dùng phiên bản ứng dụng di động phát hành hôm qua, tất cả đứng sau một IP văn phòng đang đập vào bộ giới hạn theo IP. Hãy TRUY VẤN theo thuộc tính thay vì đoán mò nguyên nhân.</span></div>
  <div class="kv"><span class="k">LÚC ĐƯỢC LÚC KHÔNG nghĩa là song song hoặc triển khai dở</span><span class="v">Hai hình dạng sinh ra câu "tôi thử thì nó chạy mà". Một lần deploy cuốn chiếu nơi các bản chạy BẤT ĐỒNG về tập khoá (11.2), hoặc một cuộc đua chỉ hiện ra khi có request song song (5.5, 10.5). Không cái nào tái hiện được bằng một lần thử tuần tự.</span></div>
</div>

<h3>Câu hỏi 2: hỏng ở BƯỚC NÀO?</h3>
<pre><code><span class="tok-comment">// Ba bước, ba mã trạng thái khác nhau. Hỏi CÁI NÀO trước khi đoán vì sao.</span>
POST /sign-in   → 401  <span class="tok-comment">// tín vật sai, HOẶC tài khoản bị khoá, HOẶC băm không khớp</span>
POST /sign-in   → 429  <span class="tok-comment">// bộ giới hạn — Bài 11.3, và hãy hỏi nó đếm theo TRỤC nào</span>
POST /mfa/kiem    → 401  <span class="tok-comment">// mã đúng nhưng đồng hồ lệch, hoặc buocCuoi chặn tái dùng — 7.2</span>
GET  /api/me     → 401  <span class="tok-comment">// đăng nhập ĐƯỢC, phiên KHÔNG dùng được ⇒ cookie hoặc token</span>
GET  /api/me     → 403  <span class="tok-comment">// phiên tốt, PHÂN QUYỀN từ chối ⇒ Chương 9, không phải xác thực</span></code></pre>
<div class="pitfall">
<p><strong>Bẫy — "không đăng nhập được" và "vừa đăng nhập xong đã bị đá ra" là HAI con lỗi khác nhau mang cùng một câu nói.</strong> Nếu <code>/dang-nhap</code> trả 200 mà request NGAY SAU đó trả 401 thì việc xác thực đã THÀNH CÔNG và cái <em>PHIÊN</em> mới hỏng — điều đó chuyển bạn từ Chương 2 sang Chương 3 hoặc 4, một phân hệ hoàn toàn khác. Hãy xin cái tab Network, hoặc tự tái hiện bằng hai lời gọi <code>curl</code>: một để đăng nhập, một để dùng thứ nó trả về. Hai câu lệnh tách được hai nửa của cả khoá học này, mà người ta vẫn đều đặn ngồi cả buổi chiều ở nửa SAI.</p>
</div>

<h3>Câu hỏi 3: nó có tái hiện được NGOÀI trình duyệt không?</h3>
<div class="out">$ curl -si -X POST https://vidu.com/api/v1/dang-nhap \\
    -H 'content-type: application/json' \\
    -d '{"email":"kiem-thu@vidu.com","matKhau":"…"}' | head -20

HTTP/2 200
set-cookie: phien=…; Path=/; HttpOnly; Secure; SameSite=Lax
content-type: application/json

# Dang nhap CHAY DUOC bang curl nhung HONG tren trinh duyet ⇒ khong phai
# van de tin vat. Doc thang xuong: Set-Cookie co Secure ma trang dang chay
# tren http? SameSite=Strict ma nguoi dung toi tu mot chuyen huong? Domain
# tro sai? Ba cai do la Chuong 3, va ca ba khong hien ra trong log may chu.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">curl chạy, trình duyệt không</span><span class="lz-t">Là cái COOKIE</span><span class="lz-d">Hãy đọc header <code>Set-Cookie</code> theo đúng nghĩa đen: có <code>Secure</code> trên một origin http, có <code>SameSite=Strict</code> sau một cú chuyển hướng khác site, một cái <code>Domain</code> không khớp, hoặc thiếu <code>Path</code>. Chương 3, và không thứ nào trong đó hiện ra trong log máy chủ.</span></div>
  <div class="lz-step"><span class="lz-k">Cả hai đều không chạy</span><span class="lz-t">Ở phía máy chủ</span><span class="lz-d">Tín vật, hàm băm, trạng thái tài khoản hoặc bộ giới hạn tần suất. Bây giờ log máy chủ mới là chỗ đúng, và các hình dạng ở Bài 12.2 cho bạn biết là cái nào.</span></div>
  <div class="lz-step"><span class="lz-k">Chạy với bạn, không chạy với họ</span><span class="lz-t">So SÁNH hai cái request</span><span class="lz-d">Khác phiên bản client, khác nhà cung cấp, khác tenant, khác quốc gia, khác tuổi token. Khác biệt nằm TRONG request, nên hãy lấy cái của HỌ — một tệp HAR hay đúng cái request đang hỏng thì hơn mọi mức độ suy đoán.</span></div>
  <div class="lz-step"><span class="lz-k">Chạy trên môi trường thử, không chạy trên production</span><span class="lz-t">Cấu hình, gần như luôn luôn</span><span class="lz-d">Một biến môi trường bị thiếu, một tập khoá khác, một proxy viết lại header, <code>trust proxy</code> chưa đặt nên mọi người dùng chung một IP ở bộ giới hạn. Bài 11.1 và 11.3, theo thứ tự đó.</span></div>
</div>

<h3>Câu hỏi 4: cái gì đã THAY ĐỔI?</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Lần deploy của BẠN, trước tiên</span><span class="lz-lnote">Mã, cấu hình, gói phụ thuộc, migration cơ sở dữ liệu. Nhật ký commit là danh sách nghi phạm NGẮN NHẤT bạn từng có, và câu "chẳng có gì thay đổi cả" thì gần như không bao giờ đúng — nó thường nghĩa là thay đổi nằm ở CẤU HÌNH, thứ không có trong nhật ký commit.</span></div>
  <div class="lz-layer"><span class="lz-lname">Lần deploy của HỌ, thứ hai</span><span class="lz-lnote">Một nhà cung cấp danh tính vừa xoay khoá hoặc đổi một claim, một nhà cung cấp thư bắt đầu giới hạn tần suất với bạn, một trình duyệt vừa ra bản mặc định cookie chặt hơn. Bạn không đổi gì mà nó vẫn hỏng — hãy xem trang trạng thái và nhật ký thay đổi của nhà cung cấp TRƯỚC khi nghi ngờ mã của chính mình.</span></div>
  <div class="lz-layer"><span class="lz-lname">THỜI GIAN, thứ ba</span><span class="lz-lnote">Một chứng chỉ vừa hết hạn, một token bạn tưởng là ngắn hạn thì rốt cuộc cũng già đi, một cửa sổ chồng lấn khoá vừa kết thúc (11.2), một công việc theo lịch vừa xoá các tài khoản chưa xác minh (6.2). Chẳng ai deploy gì cả; chỉ là một cái đồng hồ vừa đi qua một con số.</span></div>
  <div class="lz-layer"><span class="lz-lname">QUY MÔ, thứ tư</span><span class="lz-lnote">Cuộc đua cần có lưu lượng mới hiện ra, cái bể kết nối vừa cạn, cái bộ giới hạn từng hào phóng ở một nghìn người dùng và giờ thì không, ở năm mươi nghìn. Nó hỏng vì nó LỚN LÊN, và đó là kiểu khó thấy nhất vì chẳng có gì trong đó trông giống một SỰ KIỆN cả.</span></div>
</div>
<div class="note-ct">
<p><strong>Hãy VIẾT RA những gì bạn tìm được trong lúc làm, ngay trong cái ticket.</strong> "Tái hiện được bằng curl. Đăng nhập 200, lời gọi tiếp theo 401. Set-Cookie có Secure mà báo cáo tới từ một URL staging chạy http." Ba câu và con lỗi đã được tìm ra — còn nếu không phải bạn thì người cầm việc tiếp theo bắt đầu từ chỗ bạn dừng lại chứ không phải từ đầu. Sự cố xác thực đặc biệt hay bị điều tra BA lần bởi BA người, vì chẳng ai ghi lại những nửa nào đã bị loại.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">MDN — mã trạng thái HTTP</span><span class="lc-sub">developer.mozilla.org · 401 so với 403, và vì sao ở đây sự phân biệt ấy quan trọng</span></span></a>
<a class="link-card" href="https://curl.se/docs/manual.html" target="_blank" rel="noopener"><span class="lc-ico">🌀</span><span class="lc-body"><span class="lc-title">curl — sách hướng dẫn</span><span class="lc-sub">curl.se · Bình chứa cookie, cờ -i, và tái hiện CHÍNH XÁC một request của trình duyệt</span></span></a>
<a class="link-card" href="https://developer.chrome.com/docs/devtools/network" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">Chrome DevTools — bảng Network</span><span class="lc-sub">developer.chrome.com · Đọc Set-Cookie, và xuất một tệp HAR</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Linux &amp; Bash</span><span class="lc-sub">Đọc log cho nhanh, và cái đường ống thu hẹp một vùng tìm kiếm</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Sáu hệ thống hỏng, mỗi cái một câu mô tả — tìm ra nguyên nhân trong dưới năm phút</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 12.2 ─────────────────────────── */
    {
      title: '12.2 — Eight shapes of failure, and what each one means|||12.2 — Tám hình dạng hỏng, và ý nghĩa của từng cái',
      slug: 'auth-12-2-tam-hinh-dang',
      type: 'LESSON',
      description: 'Sự cố xác thực chỉ có một nhúm hình dạng, và HÌNH DẠNG khai ra nguyên nhân nhanh hơn mọi lời mô tả. Bài này xếp tám cái hay gặp nhất, mỗi cái kèm câu chẩn đoán trong một dòng và chương phải mở ra — cộng một phép đo thật cho cái hay bị đổ lỗi nhầm nhất.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Eight shapes of failure, and what each one means</h2>
<p class="lead">After enough incidents you stop reading the description and start reading the <em>shape</em>: who it affects, when it started, whether it is consistent. Eight shapes cover almost everything authentication does wrong, and each one points at a specific chapter — which is the fastest index into eleven chapters you will get.</p>

<h3>Shapes 1 to 4: something has a lifetime</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Works, then stops after exactly N</span><span class="lz-t">Find which lifetime N is</span><span class="lz-d">Fifteen minutes is an access token; a day or seven is a cookie <code>Max-Age</code>; thirty days is a refresh token or a remembered device; ninety days is a certificate. The number <em>is</em> the diagnosis — match it against the lifetimes you configured in 5.1 and 7.1.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Everyone logged out at once</span><span class="lz-t">One shared thing changed</span><span class="lz-d">A key rotated out of the verifying set (11.2), a session store restarted with in-memory state, a credential-version column bumped for every row by a migration, or a cookie secret redeployed. Four suspects, all checkable in minutes.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Random logouts, a few users, all day</span><span class="lz-t">Concurrency or affinity</span><span class="lz-d">The refresh race from 5.5 firing false reuse detections, or an in-memory session store behind a load balancer with no sticky sessions — the user logs in on one instance and their next request lands on another.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Old accounts work, new ones do not</span><span class="lz-t">Or exactly the reverse</span><span class="lz-d">A hash-parameter change without a rehash-on-login path (2.5), a schema default added without a backfill, a normalisation rule changed after rows already existed (6.1). The dividing line is a timestamp — find it and you have found the deploy.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — "it logs me out randomly" is the one report that is almost never random.</strong> Ask for two things: the exact time it last happened, and whether the user had more than one tab open. Two tabs plus a false reuse detection is Lesson 5.5, and it reproduces on demand with <code>Promise.all</code>. One tab plus a consistent interval is a lifetime, which is shape 1. And if it correlates with which instance served the request, it is shape 3 — check whether your session store is actually shared, because an in-memory fallback that "worked in development" is the single most common cause of this report.</p>
</div>

<h3>Shapes 5 to 8: something disagrees</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">5 · Works in one browser, not another</span><span class="v">A cookie attribute meeting a browser default. <code>SameSite</code> after a cross-site redirect, <code>Secure</code> on an http origin, third-party cookie blocking in a private window, a <code>Domain</code> that does not match the host. Chapter 3 — and never visible in server logs, because the request simply arrives without the cookie.</span></div>
  <div class="kv"><span class="k">6 · MFA codes always rejected</span><span class="v">Three causes, in order of likelihood: clock drift beyond the window, the secret decoded as hex when the app read it as base32, or a server configured for SHA-256 while every authenticator uses SHA-1 (7.2). The measurement below separates the first from the other two in one look.</span></div>
  <div class="kv"><span class="k">7 · OAuth callback fails intermittently</span><span class="v">The authorization code redeemed twice — a refresh, a link prefetcher, a client router mounting twice (8.2) — or <code>state</code> and the PKCE verifier held in instance memory so the callback only works if it lands on the same instance (8.3).</span></div>
  <div class="kv"><span class="k">8 · The right person gets 403</span><span class="v">Not authentication at all. A stale cached permission set after a role change (9.5), a tenant filter with the wrong value (9.4), or an object-level rule that a route-level check never reached (9.1). The tell is that <code>/api/toi</code> works — the session is fine.</span></div>
</div>
<div class="out">Dong ho DIEN THOAI lech bao nhieu -&gt; ma no sinh ra, va may chu (cua so +/-1) co nhan khong:

     lech  ma dien thoai sinh   may chu chap nhan?
    -180s   343373               tu choi
     -90s   693052               tu choi
     -45s   450400               tu choi
     -31s   010180               CHAP NHAN
       0s   168544               CHAP NHAN
     +31s   598012               CHAP NHAN
     +90s   726575               tu choi
    +180s   606568               tu choi

=&gt; Cua so +/-1 buoc dung duoc voi do lech tu -60s toi +59s. Ngoai khoang do
   thi MOI ma deu sai, MAI MAI, va nguoi dung se noi "app cua toi hong".</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Clock drift fails for one user, forever</span><span class="lz-lnote">Their phone is ninety seconds out, so every code they will ever generate is rejected, and nothing else about their account is wrong. Ask them to enable automatic time — and log the observed step offset (7.2) so support can see the drift instead of guessing at it.</span></div>
  <div class="lz-layer"><span class="lz-lname">An encoding or algorithm mismatch fails for everyone, from enrolment</span><span class="lz-lnote">If <em>no</em> user has ever completed MFA enrolment, it is not drift. It is the secret encoding or the hash algorithm, and the fastest check is the RFC 6238 test vectors from Lesson 7.2 — if your implementation does not reproduce them, the bug is yours and not theirs.</span></div>
  <div class="lz-layer"><span class="lz-lname">Server drift fails for everyone, suddenly</span><span class="lz-lnote">A container with no NTP drifts over weeks, and then one day every code from every user is rejected at once. That is shape 2 wearing shape 6's clothes — check the server clock before touching the code.</span></div>
  <div class="lz-layer"><span class="lz-lname">A code that works once and then never again is not drift</span><span class="lz-lnote">That is the <code>lastStep</code> replay guard from Lesson 7.2 doing its job — usually because the client submitted the form twice. The fix is on the client, and the guard is correct.</span></div>
</div>

<h3>The lookup table</h3>
<pre><code><span class="tok-comment">// Triệu chứng                          → mở chương nào trước</span>
'dung sau dung N phut/gio'            → 5.1 · 3.2 · 11.2   <span class="tok-comment">// một tuổi thọ nào đó</span>
'tat ca bi dang xuat cung luc'        → 11.2 · 3.3 · 6.3   <span class="tok-comment">// một thứ DÙNG CHUNG đổi</span>
'dang xuat ngau nhien, vai nguoi'     → 5.5 · 3.3          <span class="tok-comment">// đua, hoặc kho phiên không chung</span>
'tai khoan cu chay, moi thi khong'    → 2.5 · 6.1          <span class="tok-comment">// đổi tham số hoặc luật chuẩn hoá</span>
'chay o trinh duyet nay, kia thi khong' → 3.4 · 3.5        <span class="tok-comment">// thuộc tính cookie</span>
'ma MFA luon bi tu choi'              → 7.2                <span class="tok-comment">// lệch đồng hồ / mã hoá / thuật toán</span>
'callback OAuth hong luc duoc luc khong' → 8.2 · 8.3       <span class="tok-comment">// đổi mã hai lần / state trong bộ nhớ</span>
'dung nguoi ma van 403'               → 9.5 · 9.4 · 9.1    <span class="tok-comment">// phân quyền, không phải xác thực</span></code></pre>
<div class="note-ct">
<p><strong>Two questions worth asking before any of the eight.</strong> First: does it reproduce for you, right now, with <code>curl</code>? If yes you have a bug you control; if no, the difference is in the client and you need theirs. Second: when did it last work? A shape that started at a deploy is a deploy; one that started at a round number of days after a deploy is a lifetime; one that has never worked for anybody is a configuration that was wrong from the beginning. Those two questions plus the table above resolve most authentication incidents before you open an editor.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies" target="_blank" rel="noopener"><span class="lc-ico">🍪</span><span class="lc-body"><span class="lc-title">MDN — HTTP cookies</span><span class="lc-sub">developer.mozilla.org · Every attribute, and the browser default it meets</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc6238#appendix-B" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">RFC 6238 Appendix B — test vectors</span><span class="lc-sub">datatracker.ietf.org · The fastest way to prove your TOTP is correct</span></span></a>
<a class="link-card" href="https://chrome.google.com/webstore/category/extensions" target="_blank" rel="noopener"><span class="lc-ico">🔬</span><span class="lc-body"><span class="lc-title">Reproducing in a clean profile</span><span class="lc-sub">chrome.google.com · Extensions and blocked cookies are shape 5 in disguise</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">Reproducing a race with Promise.all, and reading a stack across async boundaries</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Eight broken systems, one per shape — name the shape before you read the code</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Tám hình dạng hỏng, và ý nghĩa của từng cái</h2>
<p class="lead">Sau đủ nhiều sự cố thì bạn thôi đọc phần mô tả và bắt đầu đọc <em>HÌNH DẠNG</em>: nó ảnh hưởng tới ai, nó bắt đầu lúc nào, nó có nhất quán không. Tám hình dạng phủ gần như mọi thứ mà xác thực làm sai, và mỗi cái chỉ thẳng vào một chương cụ thể — đó là cái mục lục NHANH NHẤT dẫn vào mười một chương mà bạn có được.</p>

<h3>Hình dạng 1 tới 4: có thứ gì đó mang một TUỔI THỌ</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Chạy được, rồi dừng sau ĐÚNG N</span><span class="lz-t">Hãy tìm xem N là tuổi thọ NÀO</span><span class="lz-d">Mười lăm phút là một access token; một ngày hoặc bảy ngày là <code>Max-Age</code> của cookie; ba mươi ngày là refresh token hoặc thiết bị được nhớ; chín mươi ngày là một chứng chỉ. CON SỐ đó <em>CHÍNH LÀ</em> chẩn đoán — hãy đối chiếu nó với các tuổi thọ bạn đã cấu hình ở 5.1 và 7.1.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Tất cả bị đăng xuất CÙNG LÚC</span><span class="lz-t">Một thứ DÙNG CHUNG vừa đổi</span><span class="lz-d">Một cái khoá bị xoay ra khỏi tập xác minh (11.2), một kho phiên vừa khởi động lại với trạng thái nằm trong bộ nhớ, một cột phiên bản tín vật bị một migration tăng lên cho MỌI bản ghi, hoặc một bí mật cookie vừa được deploy lại. Bốn nghi phạm, kiểm được hết trong vài phút.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Đăng xuất ngẫu nhiên, vài người, suốt ngày</span><span class="lz-t">Song song hoặc thiếu tính dính</span><span class="lz-d">Cuộc đua refresh ở 5.5 làm nổ những cú phát hiện tái dùng GIẢ, hoặc một kho phiên trong bộ nhớ đứng sau bộ cân bằng tải không có phiên dính — người dùng đăng nhập ở một bản chạy còn request kế tiếp rơi vào bản khác.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Tài khoản CŨ chạy, tài khoản MỚI thì không</span><span class="lz-t">Hoặc ngược lại y hệt</span><span class="lz-d">Một lần đổi tham số băm mà không có đường băm-lại-lúc-đăng-nhập (2.5), một giá trị mặc định thêm vào lược đồ mà không điền ngược dữ liệu, một luật chuẩn hoá đổi đi SAU khi đã có bản ghi (6.1). Ranh giới phân chia là một MỐC THỜI GIAN — tìm ra nó là tìm ra lần deploy.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — "tôi bị đăng xuất ngẫu nhiên" là cái báo cáo mà gần như KHÔNG BAO GIỜ ngẫu nhiên.</strong> Hãy hỏi hai thứ: chính xác LÚC NÀO nó vừa xảy ra, và người dùng có mở nhiều hơn một tab không. Hai tab cộng một cú phát hiện tái dùng giả là Bài 5.5, và nó tái hiện được theo yêu cầu bằng <code>Promise.all</code>. Một tab cộng một khoảng thời gian ĐỀU ĐẶN là một tuổi thọ, tức là hình dạng 1. Còn nếu nó tương quan với việc bản chạy nào phục vụ request thì đó là hình dạng 3 — hãy kiểm xem kho phiên của bạn có THẬT SỰ dùng chung không, vì một đường lùi về bộ nhớ vốn "chạy tốt lúc phát triển" chính là nguyên nhân phổ biến NHẤT của cái báo cáo này.</p>
</div>

<h3>Hình dạng 5 tới 8: có thứ gì đó BẤT ĐỒNG</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">5 · Chạy ở trình duyệt này, không chạy ở trình duyệt kia</span><span class="v">Một thuộc tính cookie gặp một mặc định của trình duyệt. <code>SameSite</code> sau một cú chuyển hướng khác site, <code>Secure</code> trên một origin http, việc chặn cookie bên thứ ba trong cửa sổ ẩn danh, một cái <code>Domain</code> không khớp host. Chương 3 — và KHÔNG BAO GIỜ nhìn thấy trong log máy chủ, vì cái request đơn giản là tới mà không mang cookie.</span></div>
  <div class="kv"><span class="k">6 · Mã MFA LUÔN bị từ chối</span><span class="v">Ba nguyên nhân, theo thứ tự khả năng: lệch đồng hồ vượt ngoài cửa sổ, bí mật bị giải mã theo hex trong khi ứng dụng đọc nó theo base32, hoặc máy chủ cấu hình SHA-256 trong khi mọi ứng dụng sinh mã đều dùng SHA-1 (7.2). Phép đo dưới đây tách cái đầu tiên khỏi hai cái kia chỉ trong một cái liếc.</span></div>
  <div class="kv"><span class="k">7 · Callback OAuth hỏng lúc được lúc không</span><span class="v">Mã uỷ quyền bị đổi HAI lần — một cú tải lại trang, một bộ tải trước đường dẫn, một router phía client gắn component hai lần (8.2) — hoặc <code>state</code> và verifier PKCE giữ trong bộ nhớ của một bản chạy nên callback chỉ chạy nếu nó rơi đúng vào bản chạy ấy (8.3).</span></div>
  <div class="kv"><span class="k">8 · ĐÚNG người mà vẫn nhận 403</span><span class="v">Hoàn toàn KHÔNG phải chuyện xác thực. Một tập quyền đã cache bị cũ sau một lần đổi vai (9.5), một bộ lọc tenant mang giá trị sai (9.4), hoặc một luật ở mức đối tượng mà phép kiểm ở mức tuyến chẳng bao giờ với tới (9.1). Dấu hiệu nhận biết là <code>/api/toi</code> VẪN chạy — cái phiên hoàn toàn ổn.</span></div>
</div>
<div class="out">Dong ho DIEN THOAI lech bao nhieu -&gt; ma no sinh ra, va may chu (cua so +/-1) co nhan khong:

     lech  ma dien thoai sinh   may chu chap nhan?
    -180s   343373               tu choi
     -90s   693052               tu choi
     -45s   450400               tu choi
     -31s   010180               CHAP NHAN
       0s   168544               CHAP NHAN
     +31s   598012               CHAP NHAN
     +90s   726575               tu choi
    +180s   606568               tu choi

=&gt; Cua so +/-1 buoc dung duoc voi do lech tu -60s toi +59s. Ngoai khoang do
   thi MOI ma deu sai, MAI MAI, va nguoi dung se noi "app cua toi hong".</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Lệch đồng hồ thì hỏng với MỘT người, VĨNH VIỄN</span><span class="lz-lnote">Điện thoại của họ lệch chín mươi giây, nên MỌI mã họ sẽ sinh ra từ nay về sau đều bị từ chối, mà chẳng có gì khác về tài khoản của họ là sai cả. Hãy bảo họ bật đồng hồ tự động — và hãy GHI LẠI độ lệch bước quan sát được (7.2) để bộ phận hỗ trợ NHÌN THẤY độ trôi thay vì phải đoán.</span></div>
  <div class="lz-layer"><span class="lz-lname">Lệch mã hoá hay lệch thuật toán thì hỏng với TẤT CẢ, ngay từ lúc đăng ký</span><span class="lz-lnote">Nếu CHƯA có người dùng nào từng hoàn tất được việc đăng ký MFA thì đó không phải lệch đồng hồ. Đó là phần mã hoá bí mật hoặc thuật toán băm, và phép kiểm nhanh nhất là bộ vector kiểm thử của RFC 6238 ở Bài 7.2 — nếu bản cài của bạn không tái tạo được chúng thì con lỗi là của BẠN chứ không phải của họ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đồng hồ MÁY CHỦ lệch thì hỏng với tất cả, ĐỘT NGỘT</span><span class="lz-lnote">Một container không có NTP sẽ trôi dần qua nhiều tuần, rồi một ngày mọi mã của mọi người dùng cùng bị từ chối một lúc. Đó là hình dạng 2 khoác bộ đồ của hình dạng 6 — hãy kiểm đồng hồ máy chủ TRƯỚC khi đụng vào mã.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một mã chạy được MỘT lần rồi thôi thì KHÔNG phải lệch đồng hồ</span><span class="lz-lnote">Đó là cái chốt chặn phát lại <code>lastStep</code> ở Bài 7.2 đang làm đúng việc của nó — thường vì client gửi biểu mẫu hai lần. Cách vá nằm ở phía CLIENT, còn cái chốt thì ĐÚNG.</span></div>
</div>

<h3>Bảng tra</h3>
<pre><code><span class="tok-comment">// Triệu chứng                          → mở chương nào trước</span>
'dung sau dung N phut/gio'            → 5.1 · 3.2 · 11.2   <span class="tok-comment">// một tuổi thọ nào đó</span>
'tat ca bi dang xuat cung luc'        → 11.2 · 3.3 · 6.3   <span class="tok-comment">// một thứ DÙNG CHUNG đổi</span>
'dang xuat ngau nhien, vai nguoi'     → 5.5 · 3.3          <span class="tok-comment">// đua, hoặc kho phiên không chung</span>
'tai khoan cu chay, moi thi khong'    → 2.5 · 6.1          <span class="tok-comment">// đổi tham số hoặc luật chuẩn hoá</span>
'chay o trinh duyet nay, kia thi khong' → 3.4 · 3.5        <span class="tok-comment">// thuộc tính cookie</span>
'ma MFA luon bi tu choi'              → 7.2                <span class="tok-comment">// lệch đồng hồ / mã hoá / thuật toán</span>
'callback OAuth hong luc duoc luc khong' → 8.2 · 8.3       <span class="tok-comment">// đổi mã hai lần / state trong bộ nhớ</span>
'dung nguoi ma van 403'               → 9.5 · 9.4 · 9.1    <span class="tok-comment">// phân quyền, không phải xác thực</span></code></pre>
<div class="note-ct">
<p><strong>Hai câu hỏi đáng hỏi TRƯỚC cả tám hình dạng.</strong> Thứ nhất: nó có tái hiện được với BẠN, NGAY BÂY GIỜ, bằng <code>curl</code> không? Nếu có thì bạn đang có một con lỗi mà bạn KIỂM SOÁT được; nếu không thì khác biệt nằm ở phía client và bạn cần lấy cái của HỌ. Thứ hai: lần cuối nó còn chạy là bao giờ? Một hình dạng bắt đầu ngay tại một lần deploy thì đó là lần deploy; một cái bắt đầu sau một số NGÀY TRÒN kể từ lần deploy thì đó là một tuổi thọ; một cái CHƯA BAO GIỜ chạy với bất kỳ ai thì đó là một cấu hình sai ngay từ đầu. Hai câu hỏi ấy cộng với bảng tra ở trên giải quyết được phần lớn sự cố xác thực trước cả khi bạn mở trình soạn thảo.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies" target="_blank" rel="noopener"><span class="lc-ico">🍪</span><span class="lc-body"><span class="lc-title">MDN — cookie HTTP</span><span class="lc-sub">developer.mozilla.org · Từng thuộc tính, và cái mặc định của trình duyệt mà nó gặp</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc6238#appendix-B" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">RFC 6238 Phụ lục B — vector kiểm thử</span><span class="lc-sub">datatracker.ietf.org · Cách nhanh nhất để chứng minh TOTP của bạn viết đúng</span></span></a>
<a class="link-card" href="https://chrome.google.com/webstore/category/extensions" target="_blank" rel="noopener"><span class="lc-ico">🔬</span><span class="lc-body"><span class="lc-title">Tái hiện trong một hồ sơ trình duyệt SẠCH</span><span class="lc-sub">chrome.google.com · Tiện ích mở rộng và cookie bị chặn chính là hình dạng 5 đội lốt</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">Tái hiện một cuộc đua bằng Promise.all, và đọc stack xuyên qua ranh giới bất đồng bộ</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Tám hệ thống hỏng, mỗi hình dạng một cái — gọi tên hình dạng TRƯỚC khi đọc mã</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 12.3 ─────────────────────────── */
    {
      title: '12.3 — The toolbox: answering the question yourself|||12.3 — Hộp đồ nghề: tự trả lời lấy câu hỏi',
      slug: 'auth-12-3-hop-do-nghe',
      type: 'LESSON',
      description: 'Bảy công cụ, cái nào cũng có sẵn, và mỗi cái trả lời một câu hỏi mà log không trả lời được: token đó thật sự chứa gì, cookie có thật sự được gửi đi không, băm ấy có tham số nào, và cơ sở dữ liệu THẬT SỰ đang nói gì về tài khoản này. Toàn bộ output ở đây chạy thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>The toolbox: answering the question yourself</h2>
<p class="lead">Most authentication debugging stalls on a question the logs cannot answer — what is actually inside that token, was the cookie actually sent, what does the row actually say. Seven tools answer all of them, none needs installing, and each one turns a hypothesis into a fact in one command.</p>

<h3>1 · Decode a JWT without a website</h3>
<div class="out">$ echo $TOKEN | cut -d. -f1 | basenc --base64url -d
{"alg":"HS256","typ":"JWT"}

$ echo $TOKEN | cut -d. -f2 | basenc --base64url -d
{"sub":"clx7a2b1c0000","iss":"https://vidu.com","aud":"vidu-api","iat":1756000000,"exp":1756000900,"vaiTro":"USER"}

exp     = 1756000900 = 2025-08-24T02:01:40.000Z
bay gio = 1787484117 = 2026-08-23T11:21:57.000Z
=&gt; token DA HET HAN 364 ngay truoc</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Never paste a production token into a website</span><span class="v">The popular decoder sites are convenient and they receive a live credential. Two shell commands do the same job locally, and this is the single most common way a working session token leaves an organisation during an incident.</span></div>
  <div class="kv"><span class="k">The header answers half the questions</span><span class="v"><code>alg</code> tells you whether it is what you expect (4.2) and <code>kid</code> tells you which key should verify it (11.2). An unexpected <code>kid</code> during an incident means a rotation is mid-flight.</span></div>
  <div class="kv"><span class="k">Convert exp before you argue about it</span><span class="v">A Unix timestamp compared by eye is how people conclude a token is valid when it expired last year. Print both times as ISO strings; the answer is then not a matter of opinion.</span></div>
  <div class="kv"><span class="k">Decoding is not verifying</span><span class="v">This tells you what the token <em>claims</em>. It says nothing about whether the signature is valid — for that you need the key, and Lesson 8.4's seven checks.</span></div>
</div>

<h3>2 · Reproduce the browser with a cookie jar</h3>
<div class="out">$ curl -si -c binh.txt -X POST http://127.0.0.1:4111/dang-nhap
HTTP/1.1 200 OK
Set-Cookie: phien=abc123xyz; Path=/; HttpOnly; SameSite=Lax; Max-Age=900

$ cat binh.txt
#HttpOnly_127.0.0.1  FALSE  /  FALSE  1787485382  phien  abc123xyz

$ curl -s -b binh.txt http://127.0.0.1:4111/api/toi
{"nhanDuoc":"phien=abc123xyz"}

$ curl -s http://127.0.0.1:4111/api/toi          # khong gui binh
{"loi":"khong co cookie"}</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">-c writes, -b sends</span><span class="lz-t">Two flags, one round trip</span><span class="lz-d">This is exactly what a browser does, minus every browser policy — so if <code>curl</code> works and the browser does not, the difference <em>is</em> a browser policy, which is shape 5 from Lesson 12.2 and lives entirely in the cookie attributes.</span></div>
  <div class="lz-step"><span class="lz-k">The jar file shows what was really stored</span><span class="lz-t">Including the flags</span><span class="lz-d">Domain, whether it is host-only, path, the secure flag, the expiry as a Unix timestamp, and the <code>#HttpOnly_</code> prefix. Nine columns that settle most cookie arguments without opening DevTools.</span></div>
  <div class="lz-step"><span class="lz-k">The last command is the actual test</span><span class="lz-t">No cookie, what happens?</span><span class="lz-d">If the endpoint returns 200 without a cookie, you have found something far more interesting than the reported bug.</span></div>
  <div class="lz-step"><span class="lz-k">In the browser, use a clean profile</span><span class="lz-t">Not incognito, a fresh profile</span><span class="lz-d">Incognito changes cookie policy, which changes the thing you are measuring. A clean profile removes extensions without changing the rules.</span></div>
</div>

<h3>3 to 7 · The rest of the box</h3>
<pre><code><span class="tok-comment">// 3. Băm Argon2 tự khai tham số của nó — đọc ngay trong chuỗi.</span>
$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$…
<span class="tok-comment">//        ↑ phiên bản  ↑ bộ nhớ 64MB, 3 lượt, 4 luồng — Bài 2.3</span>
<span class="tok-comment">// Bản ghi CŨ mang tham số CŨ. Đó là hình dạng 4 ở Bài 12.2.</span>

<span class="tok-comment">// 4. Tuyến có được gắn không? 404 = build cũ, 401 = có gắn và đòi xác thực.</span>
curl -s -o /dev/null -w "%{http_code}\\\\n" https://vidu.com/api/v1/&lt;route&gt;

<span class="tok-comment">// 5. Đồng hồ máy chủ — cái hay bị bỏ qua nhất ở hình dạng 6.</span>
date -u; timedatectl status | grep -i 'synchronized\\\\|NTP'

<span class="tok-comment">// 6. Cơ sở dữ liệu nói gì về tài khoản này (đọc, đừng đoán):</span>
SELECT email_xac_minh, khoa_luc, phien_ban_tin_vat,
       (SELECT count(*) FROM refresh_token r
         WHERE r.user_id = u.id AND r.revoked_at IS NULL) AS phien_song
FROM nguoi_dung u WHERE email_chuan_hoa = 'nan-nhan@vidu.com';

<span class="tok-comment">// 7. Nhật ký kiểm toán — Bài 11.4 dựng ra chính là để trả lời câu này.</span>
SELECT luc, kind, chu_the_id, ip, ket_qua FROM su_kien_kiem_toan
WHERE doi_tuong_id = 'u_812' ORDER BY luc DESC LIMIT 50;</code></pre>
<div class="pitfall">
<p><strong>Trap — the database is the only thing that is not telling you a story.</strong> The user's description is filtered through what they noticed, the logs are filtered through what somebody decided to record, and your mental model is filtered through what you built six months ago. The row is the state. Before forming any hypothesis about why an account cannot log in, run query 6: is the email verified, is the account locked, what is the credential version, and how many live sessions are there? Four columns, one query, and it eliminates most hypotheses before you spend an hour on them.</p>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Keep a scratch file of these queries</span><span class="lz-lnote">Per-account state, recent audit events, session count, factor list. In the repository, not in someone's shell history — so the next person, at 3am, runs the query instead of writing it.</span></div>
  <div class="lz-layer"><span class="lz-lname">Read-only access for debugging</span><span class="lz-lnote">A separate database role with <code>SELECT</code> only, and a habit of using it. Debugging with a superuser connection is how an incident acquires a second incident, and it also bypasses the row-level security from Lesson 9.4 while you are trying to understand it.</span></div>
  <div class="lz-layer"><span class="lz-lname">Never print a secret while debugging</span><span class="lz-lnote">Not the token, not the hash, not the TOTP secret — not even into your own terminal, which is recorded in shell history, in a screen share and in the ticket you paste it into. Print the last four characters or a hash prefix; it is enough to correlate.</span></div>
  <div class="lz-layer"><span class="lz-lname">Write the finding down before you fix it</span><span class="lz-lnote">The one-line answer — "the phone clock was 90 seconds slow" — is what makes the next occurrence take two minutes instead of two hours. It belongs in the ticket and, if it happens twice, in the runbook from Lesson 11.5.</span></div>
</div>
<div class="note-ct">
<p><strong>The tools you did not need.</strong> No debugger, no APM, no vendor. Authentication is unusually amenable to command-line debugging because everything it does is text: a token is base64, a cookie is a header, a hash names its own parameters, and the state is four columns. That is a real advantage, and the reason to use it is not purity — it is that these commands work identically on your laptop, on staging and on a production container at three in the morning, which is exactly when you need them to.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://curl.se/docs/http-cookies.html" target="_blank" rel="noopener"><span class="lc-ico">🍪</span><span class="lc-body"><span class="lc-title">curl — HTTP cookies</span><span class="lc-sub">curl.se · The jar format, column by column</span></span></a>
<a class="link-card" href="https://www.gnu.org/software/coreutils/manual/html_node/basenc-invocation.html" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">coreutils — basenc</span><span class="lc-sub">gnu.org · base64url decoding without a website</span></span></a>
<a class="link-card" href="https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md" target="_blank" rel="noopener"><span class="lc-ico">🧂</span><span class="lc-body"><span class="lc-title">PHC string format</span><span class="lc-sub">github.com · How an Argon2 hash encodes its own parameters</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">CuongThai course — Linux &amp; Bash</span><span class="lc-sub">cut, date and the pipelines that turn a token into an answer</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Diagnose five failures using only the seven tools above</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Hộp đồ nghề: tự trả lời lấy câu hỏi</h2>
<p class="lead">Phần lớn việc gỡ lỗi xác thực bị kẹt ở một câu hỏi mà LOG không trả lời được — cái token đó thật ra chứa gì, cái cookie có THẬT SỰ được gửi đi không, cái bản ghi THẬT SỰ nói gì. Bảy công cụ trả lời hết, chẳng cái nào cần cài, và mỗi cái biến một giả thuyết thành một SỰ THẬT trong một câu lệnh.</p>

<h3>1 · Giải mã một JWT mà không cần trang web nào</h3>
<div class="out">$ echo $TOKEN | cut -d. -f1 | basenc --base64url -d
{"alg":"HS256","typ":"JWT"}

$ echo $TOKEN | cut -d. -f2 | basenc --base64url -d
{"sub":"clx7a2b1c0000","iss":"https://vidu.com","aud":"vidu-api","iat":1756000000,"exp":1756000900,"vaiTro":"USER"}

exp     = 1756000900 = 2025-08-24T02:01:40.000Z
bay gio = 1787484117 = 2026-08-23T11:21:57.000Z
=&gt; token DA HET HAN 364 ngay truoc</div>
<div class="kv-grid">
  <div class="kv"><span class="k">ĐỪNG BAO GIỜ dán một token production vào một trang web</span><span class="v">Mấy trang giải mã nổi tiếng thì tiện, và chúng nhận được một TÍN VẬT ĐANG SỐNG. Hai câu lệnh shell làm đúng việc đó ngay tại máy, và đây chính là cách phổ biến nhất khiến một token phiên còn dùng được rời khỏi một tổ chức ngay giữa lúc có sự cố.</span></div>
  <div class="kv"><span class="k">Phần header trả lời một nửa số câu hỏi</span><span class="v"><code>alg</code> cho biết nó có đúng là thứ bạn mong đợi không (4.2) còn <code>kid</code> cho biết khoá nào phải xác minh nó (11.2). Một cái <code>kid</code> lạ giữa lúc có sự cố nghĩa là một cuộc xoay khoá đang dở dang.</span></div>
  <div class="kv"><span class="k">Hãy ĐỔI exp ra dạng đọc được trước khi tranh cãi về nó</span><span class="v">Một mốc thời gian Unix đem so bằng mắt chính là cách người ta kết luận rằng một token còn hạn trong khi nó đã hết hạn từ năm ngoái. Hãy in cả hai thời điểm ra dạng chuỗi ISO; khi đó câu trả lời thôi còn là chuyện ý kiến.</span></div>
  <div class="kv"><span class="k">GIẢI MÃ không phải KIỂM CHỨNG</span><span class="v">Việc này cho bạn biết token đang <em>KHAI</em> cái gì. Nó chẳng nói gì về việc chữ ký có hợp lệ hay không — muốn vậy thì cần cái khoá, và bảy phép kiểm ở Bài 8.4.</span></div>
</div>

<h3>2 · Tái hiện trình duyệt bằng một bình cookie</h3>
<div class="out">$ curl -si -c binh.txt -X POST http://127.0.0.1:4111/dang-nhap
HTTP/1.1 200 OK
Set-Cookie: phien=abc123xyz; Path=/; HttpOnly; SameSite=Lax; Max-Age=900

$ cat binh.txt
#HttpOnly_127.0.0.1  FALSE  /  FALSE  1787485382  phien  abc123xyz

$ curl -s -b binh.txt http://127.0.0.1:4111/api/toi
{"nhanDuoc":"phien=abc123xyz"}

$ curl -s http://127.0.0.1:4111/api/toi          # khong gui binh
{"loi":"khong co cookie"}</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">-c để GHI, -b để GỬI</span><span class="lz-t">Hai cờ, một vòng đi về</span><span class="lz-d">Đây đúng là thứ một trình duyệt làm, chỉ trừ MỌI chính sách của trình duyệt — nên nếu <code>curl</code> chạy mà trình duyệt không chạy thì khác biệt <em>CHÍNH LÀ</em> một chính sách của trình duyệt, tức là hình dạng 5 ở Bài 12.2, và nó nằm hoàn toàn trong các thuộc tính cookie.</span></div>
  <div class="lz-step"><span class="lz-k">Tệp bình cho thấy cái gì THẬT SỰ được lưu</span><span class="lz-t">Kèm cả các cờ</span><span class="lz-d">Tên miền, có phải chỉ-thuộc-host không, đường dẫn, cờ secure, hạn dưới dạng mốc Unix, và tiền tố <code>#HttpOnly_</code>. Chín cột giải quyết phần lớn các cuộc tranh cãi về cookie mà chẳng cần mở DevTools.</span></div>
  <div class="lz-step"><span class="lz-k">Câu lệnh cuối mới là PHÉP THỬ thật</span><span class="lz-t">Không cookie thì sao?</span><span class="lz-d">Nếu cái endpoint trả về 200 khi KHÔNG có cookie thì bạn vừa tìm ra một thứ thú vị hơn nhiều so với con lỗi được báo cáo.</span></div>
  <div class="lz-step"><span class="lz-k">Trong trình duyệt, hãy dùng một HỒ SƠ SẠCH</span><span class="lz-t">Không phải ẩn danh, mà là hồ sơ mới</span><span class="lz-d">Chế độ ẩn danh ĐỔI chính sách cookie, tức là đổi cái thứ bạn đang đo. Một hồ sơ sạch thì gỡ bỏ các tiện ích mở rộng mà không đổi luật.</span></div>
</div>

<h3>3 tới 7 · Phần còn lại của hộp đồ</h3>
<pre><code><span class="tok-comment">// 3. Băm Argon2 tự khai tham số của nó — đọc ngay trong chuỗi.</span>
$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$…
<span class="tok-comment">//        ↑ phiên bản  ↑ bộ nhớ 64MB, 3 lượt, 4 luồng — Bài 2.3</span>
<span class="tok-comment">// Bản ghi CŨ mang tham số CŨ. Đó là hình dạng 4 ở Bài 12.2.</span>

<span class="tok-comment">// 4. Tuyến có được gắn không? 404 = build cũ, 401 = có gắn và đòi xác thực.</span>
curl -s -o /dev/null -w "%{http_code}\\\\n" https://vidu.com/api/v1/&lt;route&gt;

<span class="tok-comment">// 5. Đồng hồ máy chủ — cái hay bị bỏ qua nhất ở hình dạng 6.</span>
date -u; timedatectl status | grep -i 'synchronized\\\\|NTP'

<span class="tok-comment">// 6. Cơ sở dữ liệu nói gì về tài khoản này (đọc, đừng đoán):</span>
SELECT email_xac_minh, khoa_luc, phien_ban_tin_vat,
       (SELECT count(*) FROM refresh_token r
         WHERE r.user_id = u.id AND r.revoked_at IS NULL) AS phien_song
FROM nguoi_dung u WHERE email_chuan_hoa = 'nan-nhan@vidu.com';

<span class="tok-comment">// 7. Nhật ký kiểm toán — Bài 11.4 dựng ra chính là để trả lời câu này.</span>
SELECT luc, kind, chu_the_id, ip, ket_qua FROM su_kien_kiem_toan
WHERE doi_tuong_id = 'u_812' ORDER BY luc DESC LIMIT 50;</code></pre>
<div class="pitfall">
<p><strong>Bẫy — CƠ SỞ DỮ LIỆU là thứ DUY NHẤT không kể chuyện cho bạn nghe.</strong> Lời mô tả của người dùng đã bị lọc qua những gì họ ĐỂ Ý thấy, log đã bị lọc qua những gì ai đó QUYẾT ĐỊNH ghi lại, còn mô hình trong đầu bạn thì bị lọc qua thứ bạn đã dựng sáu tháng trước. Cái BẢN GHI mới là trạng thái. Trước khi hình thành bất kỳ giả thuyết nào về việc vì sao một tài khoản không đăng nhập được, hãy chạy câu truy vấn số 6: email đã xác minh chưa, tài khoản có bị khoá không, phiên bản tín vật là bao nhiêu, và có bao nhiêu phiên đang sống? Bốn cột, một câu truy vấn, và nó loại bỏ phần lớn giả thuyết trước khi bạn tốn một tiếng cho chúng.</p>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Hãy giữ một tệp nháp chứa những câu truy vấn này</span><span class="lz-lnote">Trạng thái theo tài khoản, các sự kiện kiểm toán gần đây, số phiên, danh sách yếu tố. Để TRONG KHO MÃ, đừng để trong lịch sử shell của ai đó — để người tiếp theo, vào ba giờ sáng, CHẠY câu truy vấn thay vì ngồi viết nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Quyền CHỈ ĐỌC để gỡ lỗi</span><span class="lz-lnote">Một vai cơ sở dữ liệu riêng chỉ có <code>SELECT</code>, và một thói quen dùng nó. Gỡ lỗi bằng kết nối siêu người dùng là cách một sự cố sinh ra thêm một sự cố nữa, và nó cũng ĐI VÒNG QUA row-level security ở Bài 9.4 ngay trong lúc bạn đang cố hiểu nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đừng bao giờ IN một bí mật ra trong lúc gỡ lỗi</span><span class="lz-lnote">Không in token, không in băm, không in bí mật TOTP — kể cả ra chính terminal của bạn, thứ được ghi vào lịch sử shell, vào một buổi chia sẻ màn hình và vào cái ticket bạn dán nó vào. Hãy in bốn ký tự cuối hoặc một đoạn đầu của băm; chừng đó là đủ để đối chiếu.</span></div>
  <div class="lz-layer"><span class="lz-lname">VIẾT phát hiện ra TRƯỚC khi đi vá</span><span class="lz-lnote">Câu trả lời một dòng — "đồng hồ điện thoại chậm 90 giây" — là thứ làm cho lần xảy ra tiếp theo tốn hai phút thay vì hai tiếng. Nó thuộc về cái ticket, và nếu chuyện đó xảy ra tới hai lần thì nó thuộc về cuốn runbook ở Bài 11.5.</span></div>
</div>
<div class="note-ct">
<p><strong>Những công cụ bạn KHÔNG cần tới.</strong> Không debugger, không APM, không nhà cung cấp nào. Xác thực đặc biệt dễ gỡ lỗi bằng dòng lệnh vì mọi thứ nó làm đều là VĂN BẢN: token là base64, cookie là một header, một cái băm tự khai tham số của nó, và trạng thái là bốn cái cột. Đó là một lợi thế THẬT, và lý do nên dùng nó không phải vì sự thuần khiết — mà vì những câu lệnh này chạy Y HỆT NHAU trên laptop của bạn, trên môi trường thử và trên một container production lúc ba giờ sáng, tức là đúng lúc bạn cần chúng chạy.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://curl.se/docs/http-cookies.html" target="_blank" rel="noopener"><span class="lc-ico">🍪</span><span class="lc-body"><span class="lc-title">curl — cookie HTTP</span><span class="lc-sub">curl.se · Định dạng tệp bình, từng cột một</span></span></a>
<a class="link-card" href="https://www.gnu.org/software/coreutils/manual/html_node/basenc-invocation.html" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">coreutils — basenc</span><span class="lc-sub">gnu.org · Giải mã base64url mà không cần trang web nào</span></span></a>
<a class="link-card" href="https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md" target="_blank" rel="noopener"><span class="lc-ico">🧂</span><span class="lc-body"><span class="lc-title">Định dạng chuỗi PHC</span><span class="lc-sub">github.com · Một băm Argon2 mã hoá tham số của chính nó ra sao</span></span></a>
<a class="link-card" href="/courses/linux-bash/learn${REF}"><span class="lc-ico">🐧</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Linux &amp; Bash</span><span class="lc-sub">cut, date và những đường ống biến một cái token thành một câu trả lời</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Chẩn đoán năm ca hỏng CHỈ bằng bảy công cụ ở trên</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 12.4 ─────────────────────────── */
    {
      title: '12.4 — Reviewing a codebase you did not write|||12.4 — Soát một kho mã không phải bạn viết',
      slug: 'auth-12-4-soat-kho-ma',
      type: 'LESSON',
      description: 'Bạn vừa nhận một hệ thống xác thực có sẵn. Bài này là quy trình soát nửa ngày: một lượt quét grep tìm năm dấu hiệu đỏ — chạy THẬT trên chính kho mã này, kèm kết quả thật — rồi hai mươi câu hỏi ánh xạ về đúng bài học đã trả lời chúng, và cách xếp thứ tự việc cần sửa.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.4</span>
<h2>Reviewing a codebase you did not write</h2>
<p class="lead">The most common way to meet an authentication system is to inherit one. Nobody wrote down which decisions were deliberate, the person who built it left, and you need to know within a day whether it is fine, fixable or on fire. This is that review — a grep pass, then twenty questions, then a priority order.</p>

<h3>Pass one: five greps, on this repository</h3>
<div class="out">=== Quet nhanh nam dau hieu do, tren chinh kho ma nay ===
1. jwt.decode() thay cho jwt.verify()          0
2. jwt.verify() KHONG ghim thuat toan          7
3. data: req.body (gan hang loat)              4
4. URL dung tu header Host                     2
5. bi mat co gia tri mac dinh du phong        10

src/middleware/auth.ts:37:   jwt.verify(token, config.jwtSecret) as JwtPayload
src/middleware/auth.ts:73:   jwt.verify(token, config.jwtSecret) as JwtPayload
src/services/llm/gateway.ts:50:  process.env.LLM_GATEWAY_API_KEY ||
src/services/llm/gateway.ts:51:  process.env.OPENAI_COMPAT_API_KEY ||

# Quet chi CHI CHO, khong ket luan. Muc 5 o day phan lon la mot chuoi doc
# NHIEU TEN BIEN cho cung mot khoa — co chu y, khong phai bi mat chep cung.
# Muc 2 thi khac: bay loi goi khong ghim thuat toan, va do la Bai 4.2.</div>
<pre><code><span class="tok-comment"># Năm dấu hiệu đỏ. Mỗi cái là một họ lỗi trong khoá học này.</span>
grep -rE 'jwt\\\\.decode\\\\(|decodeJwt\\\\('        src/   <span class="tok-comment"># 8.4 · giải mã thay vì kiểm chứng</span>
grep -rE 'jwt\\\\.verify\\\\('  src/ | grep -v algorithms  <span class="tok-comment"># 4.2 · không ghim thuật toán</span>
grep -rE 'data:\\\\s*req\\\\.body|\\\\.\\\\.\\\\.req\\\\.body'    src/   <span class="tok-comment"># 9.5 · gán hàng loạt</span>
grep -rE "req\\\\.headers\\\\.host|x-forwarded-host" src/   <span class="tok-comment"># 6.3 · đầu độc Host</span>
grep -rE "env\\\\.[A-Z_]*(SECRET|KEY)[A-Z_]*\\\\s*(\\\\|\\\\||\\\\?\\\\?)" src/ <span class="tok-comment"># 11.1 · mặc định dự phòng</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">A grep finds candidates, a human classifies them</span><span class="v">Ten hits on the secrets pattern here are mostly one key read under several variable names — a documented fallback chain, not a hard-coded value. Seven unpinned <code>jwt.verify</code> calls are a real finding. Report what you measured and what you concluded, separately.</span></div>
  <div class="kv"><span class="k">Zero hits is information too</span><span class="v">No <code>jwt.decode</code> anywhere means nobody took that shortcut, which is worth writing down. A review that only lists problems reads as if everything is broken.</span></div>
  <div class="kv"><span class="k">Run the greps before reading any code</span><span class="v">Five commands, two minutes, and they tell you where to spend the next four hours. Reading the login handler first is how a review ends with one well-understood file and nineteen unexamined ones.</span></div>
  <div class="kv"><span class="k">Add your own patterns as you learn the codebase</span><span class="v">Every project has a house-specific smell — a helper everyone copies, a middleware that is easy to forget. Once you find one instance, grep for the rest.</span></div>
</div>

<h3>Pass two: twenty questions, mapped to lessons</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Credentials and sessions (1–7)</span><span class="lz-lnote">Argon2id or bcrypt with current parameters, and do old rows rehash on login (2.3, 2.5)? Are new passwords checked against a breach list (2.2)? Is the session cookie <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code>, with no <code>Domain</code> (3.4, 10.3)? Is the session store shared across instances (3.3)? Is the algorithm pinned on every <code>verify</code> (4.2)? Are <code>iss</code>, <code>aud</code> and <code>exp</code> all checked (4.3)? Does a token carry a <code>kid</code> (4.4)?</span></div>
  <div class="lz-layer"><span class="lz-lname">Revocation and lifecycle (8–13)</span><span class="lz-lnote">Do refresh tokens rotate, with reuse detection and a grace window (5.2, 5.5)? Does a password reset revoke every session (6.3)? Is the reset URL built from configuration rather than a header (6.3)? Is the login response uniform, and does it always hash (6.4)? Does changing an email require re-authentication and verify the new address before switching (6.5)? Is there a device list users can act on (5.4)?</span></div>
  <div class="lz-layer"><span class="lz-lname">Factors and federation (14–17)</span><span class="lz-lnote">Does MFA enrolment confirm a working code before enabling, and issue hashed recovery codes at the same moment (7.3)? Is <code>lastStep</code> stored so a code cannot be replayed (7.2)? For social login, is the account keyed on <code>(provider, sub)</code> rather than email, and is <code>email_verified</code> required (8.4, 8.5)? Are <code>state</code>, <code>nonce</code> and the PKCE verifier all server-side and single-use (8.2, 8.3)?</span></div>
  <div class="lz-layer"><span class="lz-lname">Authorization and operations (18–20)</span><span class="lz-lnote">Is ownership in the query rather than in an <code>if</code> after it, and does an endpoint with no policy fail closed (9.1, 9.5)? In a multi-tenant system, does the tenant come from the session and is there a second layer below the application (9.4)? Is there an audit log with the actor recorded, and does anything alert on refresh-token reuse (11.4, 11.5)?</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — the answers are rarely "yes" or "no", and writing them as such makes the review useless.</strong> "Is MFA required?" has the answer "for administrators, since March, except three accounts exempted for a customer integration". That sentence is the finding; "no" is not. Write what you observed, where you observed it, and what you could not determine — an honest "I could not tell whether the session store is shared in production; it is Redis in the compose file and there is an in-memory fallback in the code" is far more useful than a confident tick either way, because it names the exact thing somebody should check next.</p>
</div>

<h3>Pass three: ordering the work</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Fix today</span><span class="lz-t">Exploitable now, cheap to fix</span><span class="lz-d">An unpinned algorithm, a URL built from a header, mass assignment on a profile endpoint, a missing <code>email_verified</code> check. Each is a few lines, each closes a documented attack, and none needs a design discussion.</span></div>
  <div class="lz-step"><span class="lz-k">Fix this quarter</span><span class="lz-t">Structural, and worth planning</span><span class="lz-d">No revocation path, no rate limiting on login, no audit log, passwords hashed with a fast function. Real work — a sprint each — and each removes a whole category rather than one bug.</span></div>
  <div class="lz-step"><span class="lz-k">Write down and revisit</span><span class="lz-t">Decisions, not defects</span><span class="lz-d">"We do not hide enumeration because our profiles are public." "SMS is allowed because most of our users have nothing else." These are legitimate, and undocumented they get re-litigated every six months by whoever reads the code next.</span></div>
  <div class="lz-step"><span class="lz-k">Measure before rewriting</span><span class="lz-t">The rewrite instinct is usually wrong</span><span class="lz-d">An inherited system that has run for three years has absorbed edge cases you cannot see. Fix the findings in place, add the tests from Lessons 9.5 and 10.5, and only replace a subsystem you can describe completely.</span></div>
</div>
<div class="note-ct">
<p><strong>What the review is actually for.</strong> Not a score, and not a list of everything wrong — a document that tells the next person which decisions were deliberate, which were accidents, and which are still unknown. Half a day, five greps, twenty questions, three lists. The value is that it turns "our authentication is probably fine" into a page someone can disagree with, and a page someone can disagree with is the only kind that ever gets improved.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://owasp.org/www-project-application-security-verification-standard/" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">OWASP ASVS</span><span class="lc-sub">owasp.org · Chapters 2 and 3 are this checklist, formalised and numbered</span></span></a>
<a class="link-card" href="https://owasp.org/www-project-web-security-testing-guide/" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">OWASP Testing Guide</span><span class="lc-sub">owasp.org · How an auditor probes each item, step by step</span></span></a>
<a class="link-card" href="https://semgrep.dev/explore" target="_blank" rel="noopener"><span class="lc-ico">🤖</span><span class="lc-body"><span class="lc-title">Semgrep rules</span><span class="lc-sub">semgrep.dev · The grep pass above, as rules that run in CI</span></span></a>
<a class="link-card" href="/courses/git/learn${REF}"><span class="lc-ico">🌿</span><span class="lc-body"><span class="lc-title">CuongThai course — Git &amp; GitHub</span><span class="lc-sub">git log and blame for finding when a decision was made, and by whom</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Review an inherited codebase against the twenty questions and produce the three lists</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.4</span>
<h2>Soát một kho mã không phải bạn viết</h2>
<p class="lead">Cách phổ biến nhất để làm quen một hệ thống xác thực là KẾ THỪA một cái. Chẳng ai ghi lại quyết định nào là có chủ ý, người dựng nó thì đã nghỉ, còn bạn thì cần biết trong vòng một ngày rằng nó ổn, sửa được, hay đang cháy. Đây chính là cuộc soát đó — một lượt grep, rồi hai mươi câu hỏi, rồi một thứ tự ưu tiên.</p>

<h3>Lượt một: năm câu grep, trên chính kho mã này</h3>
<div class="out">=== Quet nhanh nam dau hieu do, tren chinh kho ma nay ===
1. jwt.decode() thay cho jwt.verify()          0
2. jwt.verify() KHONG ghim thuat toan          7
3. data: req.body (gan hang loat)              4
4. URL dung tu header Host                     2
5. bi mat co gia tri mac dinh du phong        10

src/middleware/auth.ts:37:   jwt.verify(token, config.jwtSecret) as JwtPayload
src/middleware/auth.ts:73:   jwt.verify(token, config.jwtSecret) as JwtPayload
src/services/llm/gateway.ts:50:  process.env.LLM_GATEWAY_API_KEY ||
src/services/llm/gateway.ts:51:  process.env.OPENAI_COMPAT_API_KEY ||

# Quet chi CHI CHO, khong ket luan. Muc 5 o day phan lon la mot chuoi doc
# NHIEU TEN BIEN cho cung mot khoa — co chu y, khong phai bi mat chep cung.
# Muc 2 thi khac: bay loi goi khong ghim thuat toan, va do la Bai 4.2.</div>
<pre><code><span class="tok-comment"># Năm dấu hiệu đỏ. Mỗi cái là một họ lỗi trong khoá học này.</span>
grep -rE 'jwt\\\\.decode\\\\(|decodeJwt\\\\('        src/   <span class="tok-comment"># 8.4 · giải mã thay vì kiểm chứng</span>
grep -rE 'jwt\\\\.verify\\\\('  src/ | grep -v algorithms  <span class="tok-comment"># 4.2 · không ghim thuật toán</span>
grep -rE 'data:\\\\s*req\\\\.body|\\\\.\\\\.\\\\.req\\\\.body'    src/   <span class="tok-comment"># 9.5 · gán hàng loạt</span>
grep -rE "req\\\\.headers\\\\.host|x-forwarded-host" src/   <span class="tok-comment"># 6.3 · đầu độc Host</span>
grep -rE "env\\\\.[A-Z_]*(SECRET|KEY)[A-Z_]*\\\\s*(\\\\|\\\\||\\\\?\\\\?)" src/ <span class="tok-comment"># 11.1 · mặc định dự phòng</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">grep tìm ra ỨNG VIÊN, còn CON NGƯỜI mới phân loại chúng</span><span class="v">Mười cái khớp với mẫu bí mật ở đây phần lớn là MỘT cái khoá được đọc dưới vài tên biến — một chuỗi dự phòng CÓ TÀI LIỆU, không phải một giá trị chép cứng. Còn bảy lời gọi <code>jwt.verify</code> không ghim thuật toán thì là một phát hiện THẬT. Hãy báo cáo TÁCH RIÊNG cái bạn ĐO ĐƯỢC với cái bạn KẾT LUẬN.</span></div>
  <div class="kv"><span class="k">Không khớp cái nào cũng là THÔNG TIN</span><span class="v">Không có <code>jwt.decode</code> ở bất cứ đâu nghĩa là chẳng ai đi lối tắt đó, và điều ấy đáng ghi lại. Một bản soát chỉ liệt kê vấn đề sẽ đọc lên như thể mọi thứ đều hỏng.</span></div>
  <div class="kv"><span class="k">Chạy các câu grep TRƯỚC khi đọc bất kỳ dòng mã nào</span><span class="v">Năm câu lệnh, hai phút, và chúng cho bạn biết nên dùng bốn tiếng tiếp theo ở đâu. Đọc bộ xử lý đăng nhập trước là cách một cuộc soát kết thúc với MỘT tệp hiểu rất kỹ và mười chín tệp chưa từng ngó tới.</span></div>
  <div class="kv"><span class="k">Hãy thêm mẫu của RIÊNG bạn khi đã quen kho mã</span><span class="v">Dự án nào cũng có một cái mùi riêng — một hàm tiện ích ai cũng chép, một middleware dễ quên. Tìm ra được một trường hợp thì hãy grep tìm nốt phần còn lại.</span></div>
</div>

<h3>Lượt hai: hai mươi câu hỏi, ánh xạ về từng bài</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Tín vật và phiên (1–7)</span><span class="lz-lnote">Argon2id hay bcrypt với tham số hiện hành, và bản ghi cũ có được băm lại lúc đăng nhập không (2.3, 2.5)? Mật khẩu mới có được đối chiếu danh sách rò rỉ không (2.2)? Cookie phiên có <code>HttpOnly</code>, <code>Secure</code>, <code>SameSite</code> và KHÔNG có <code>Domain</code> không (3.4, 10.3)? Kho phiên có dùng chung giữa các bản chạy không (3.3)? Thuật toán có được ghim ở MỌI lời gọi <code>verify</code> không (4.2)? <code>iss</code>, <code>aud</code> và <code>exp</code> có được kiểm đủ cả ba không (4.3)? Token có mang <code>kid</code> không (4.4)?</span></div>
  <div class="lz-layer"><span class="lz-lname">Thu hồi và vòng đời (8–13)</span><span class="lz-lnote">Refresh token có xoay vòng, có phát hiện tái dùng và có cửa sổ ân hạn không (5.2, 5.5)? Một lần đặt lại mật khẩu có thu hồi MỌI phiên không (6.3)? URL đặt lại có dựng từ CẤU HÌNH thay vì từ một header không (6.3)? Phản hồi đăng nhập có ĐỒNG NHẤT không, và nó có LUÔN băm không (6.4)? Đổi email có đòi xác thực lại và có xác minh địa chỉ mới TRƯỚC khi chuyển không (6.5)? Có một danh sách thiết bị mà người dùng thao tác được không (5.4)?</span></div>
  <div class="lz-layer"><span class="lz-lname">Yếu tố và liên kết định danh (14–17)</span><span class="lz-lnote">Việc đăng ký MFA có xác nhận một mã CHẠY ĐƯỢC trước khi bật, và có phát mã khôi phục dạng băm ngay tại khoảnh khắc đó không (7.3)? <code>lastStep</code> có được lưu để một mã không thể phát lại không (7.2)? Với đăng nhập mạng xã hội, tài khoản có lấy khoá là <code>(nhà cung cấp, sub)</code> thay vì email không, và <code>email_verified</code> có bắt buộc không (8.4, 8.5)? <code>state</code>, <code>nonce</code> và verifier PKCE có nằm ở phía máy chủ và dùng một lần không (8.2, 8.3)?</span></div>
  <div class="lz-layer"><span class="lz-lname">Phân quyền và vận hành (18–20)</span><span class="lz-lnote">Quyền sở hữu có nằm TRONG câu truy vấn thay vì trong một câu <code>if</code> đứng sau nó không, và một endpoint không khai chính sách có hỏng theo hướng ĐÓNG không (9.1, 9.5)? Trong hệ nhiều tenant, tenant có tới từ PHIÊN không và có một lớp THỨ HAI nằm dưới tầng ứng dụng không (9.4)? Có nhật ký kiểm toán ghi NGƯỜI THỰC HIỆN không, và có thứ gì cảnh báo khi tái dùng refresh token không (11.4, 11.5)?</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — câu trả lời hiếm khi là "có" hay "không", và viết chúng thành như vậy làm cả bản soát trở nên vô dụng.</strong> Câu "MFA có bắt buộc không?" có câu trả lời là "với quản trị viên thì có, từ tháng Ba, trừ ba tài khoản được miễn để phục vụ một tích hợp của khách hàng". CHÍNH CÂU ĐÓ là phát hiện; còn chữ "không" thì không phải. Hãy viết ra thứ bạn QUAN SÁT được, quan sát ở ĐÂU, và cái bạn KHÔNG xác định nổi — một câu trung thực kiểu "tôi không xác định được kho phiên trên production có dùng chung không; trong tệp compose thì là Redis còn trong mã thì có một đường lùi về bộ nhớ" hữu ích hơn NHIỀU so với một dấu tích tự tin ở bên nào đi nữa, vì nó gọi tên CHÍNH XÁC cái thứ mà ai đó nên đi kiểm tiếp theo.</p>
</div>

<h3>Lượt ba: xếp thứ tự công việc</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Vá NGAY HÔM NAY</span><span class="lz-t">Khai thác được ngay, mà vá thì rẻ</span><span class="lz-d">Một thuật toán không ghim, một URL dựng từ header, một cú gán hàng loạt trên endpoint hồ sơ, một phép kiểm <code>email_verified</code> bị thiếu. Mỗi cái tốn vài dòng, mỗi cái bịt một cú tấn công đã có tài liệu, và chẳng cái nào cần một cuộc họp thiết kế.</span></div>
  <div class="lz-step"><span class="lz-k">Vá TRONG QUÝ NÀY</span><span class="lz-t">Mang tính cấu trúc, và đáng lên kế hoạch</span><span class="lz-d">Không có đường thu hồi, không giới hạn tần suất ở trang đăng nhập, không có nhật ký kiểm toán, mật khẩu băm bằng một hàm nhanh. Công việc THẬT — mỗi cái một sprint — và mỗi cái gỡ bỏ cả một HỌ vấn đề chứ không phải một con lỗi.</span></div>
  <div class="lz-step"><span class="lz-k">GHI LẠI và xem lại sau</span><span class="lz-t">Quyết định, không phải khiếm khuyết</span><span class="lz-d">"Chúng tôi không giấu chuyện dò tài khoản vì hồ sơ của chúng tôi vốn công khai." "SMS được cho phép vì phần lớn người dùng của chúng tôi chẳng có gì khác." Những cái này CHÍNH ĐÁNG, mà không ghi ra thì cứ sáu tháng lại bị đem ra tranh cãi lại bởi bất kỳ ai đọc mã tiếp theo.</span></div>
  <div class="lz-step"><span class="lz-k">ĐO trước khi viết lại</span><span class="lz-t">Bản năng muốn viết lại thường là SAI</span><span class="lz-d">Một hệ thống kế thừa đã chạy ba năm thì đã hấp thụ những ca biên mà bạn không nhìn thấy. Hãy vá các phát hiện TẠI CHỖ, thêm các bài kiểm thử ở Bài 9.5 và 10.5, và chỉ thay thế một phân hệ mà bạn mô tả được TRỌN VẸN.</span></div>
</div>
<div class="note-ct">
<p><strong>Cuộc soát này thật ra để làm gì.</strong> Không phải để chấm điểm, và cũng không phải một danh sách mọi thứ sai — mà là một tài liệu nói cho người tiếp theo biết quyết định nào là CÓ CHỦ Ý, cái nào là TAI NẠN, và cái nào vẫn CHƯA RÕ. Nửa ngày, năm câu grep, hai mươi câu hỏi, ba cái danh sách. Giá trị của nó là biến câu "phần xác thực của chúng ta chắc là ổn" thành một trang giấy mà người khác có thể PHẢN ĐỐI, và một trang giấy có thể phản đối được là loại duy nhất từng được cải thiện.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://owasp.org/www-project-application-security-verification-standard/" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">OWASP ASVS</span><span class="lc-sub">owasp.org · Chương 2 và 3 chính là bảng kiểm này, viết thành chuẩn có đánh số</span></span></a>
<a class="link-card" href="https://owasp.org/www-project-web-security-testing-guide/" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">OWASP Testing Guide</span><span class="lc-sub">owasp.org · Một người kiểm toán dò từng mục ra sao, từng bước một</span></span></a>
<a class="link-card" href="https://semgrep.dev/explore" target="_blank" rel="noopener"><span class="lc-ico">🤖</span><span class="lc-body"><span class="lc-title">Bộ luật của Semgrep</span><span class="lc-sub">semgrep.dev · Lượt grep ở trên, viết thành các luật chạy trong CI</span></span></a>
<a class="link-card" href="/courses/git/learn${REF}"><span class="lc-ico">🌿</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Git &amp; GitHub</span><span class="lc-sub">git log và blame để tìm ra một quyết định được đưa ra khi nào, và bởi ai</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Soát một kho mã kế thừa theo hai mươi câu hỏi và cho ra ba cái danh sách</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 12.5 ─────────────────────────── */
    {
      title: '12.5 — What to build first, and what actually changed|||12.5 — Nên dựng cái gì trước, và điều gì đã THẬT SỰ thay đổi',
      slug: 'auth-12-5-loi-ket',
      type: 'LESSON',
      description: 'Mười một chương là một hệ thống đầy đủ, và không ai dựng nó theo thứ tự đó. Bài cuối này xếp lại theo TÁC DỤNG trên mỗi giờ công: cái gì làm trong ngày đầu, tuần đầu, quý đầu, cái gì có thể không bao giờ cần, và cái gì trong khoá học này sẽ còn đúng sau mười năm.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.5</span>
<h2>What to build first, and what actually changed</h2>
<p class="lead">Read end to end, this course describes a complete authentication system, and reading it that way makes it look like a project. It is not. Almost everything here can be added to a running product one piece at a time, and the order matters far more than the completeness — so this last lesson is the order.</p>

<h3>Day one: the things with no alternative</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Hash properly</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Argon2id, one line of configuration</span><span class="lz-nsub">Lesson 2.3 · irreversible if you get it wrong, trivial if you get it right, and it never needs revisiting</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Cookie flags</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">HttpOnly · Secure · SameSite · no Domain</span><span class="lz-nsub">Lessons 3.4 and 10.3 · four words that remove the easy version of session theft</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Pin the algorithm</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">algorithms: ['HS256'], and check iss/aud/exp</span><span class="lz-nsub">Lessons 4.2 and 4.3 · one option object between you and a total bypass</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Ownership in the query</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">where: { id, nguoiDungId }</span><span class="lz-nsub">Lesson 9.1 · the number-one web vulnerability, closed by moving a condition</span></div></div>
  </div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">All four are single lines</span><span class="v">Between them they close password cracking, the easy session theft, complete token forgery and the most common access-control bug. No architecture, no migration, no meeting — and if you do nothing else from this course, do these.</span></div>
  <div class="kv"><span class="k">They are also the ones nobody notices are missing</span><span class="v">A fast hash, a cookie without <code>HttpOnly</code>, an unpinned <code>verify</code> and an unscoped query all work perfectly. There is no symptom, no failing test and no error — which is why they need to be on a checklist rather than left to be discovered.</span></div>
  <div class="kv"><span class="k">Add the breach-list check while you are there</span><span class="v">Lesson 2.2, one API call at registration and reset. It removes most of what makes credential stuffing profitable, and it is the highest-leverage line in the entire course per minute spent.</span></div>
  <div class="kv"><span class="k">Then write down what you did</span><span class="v">Four sentences in the repository. The next person will otherwise spend the half-day in Lesson 12.4 working out whether these were decisions or accidents.</span></div>
</div>

<h3>Week one, quarter one, and maybe never</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Week one</span><span class="lz-t">Revocation and limits</span><span class="lz-d">Sessions you can end (5.3), rate limiting keyed on the account (10.1, 11.3), a password reset that revokes everything and is built from configuration (6.3), and the three notification mails from 6.5. This is the week that turns "we have login" into "we can respond when something happens".</span></div>
  <div class="lz-step"><span class="lz-k">Quarter one</span><span class="lz-t">Factors and visibility</span><span class="lz-d">Passkeys with a password fallback (7.4, 7.5), a device list users can act on (5.4), an audit log with the actor recorded (11.4), and two alerts you trust (11.5). Each is a sprint, and together they are the difference between a product that survives an incident and one that discovers it from a customer.</span></div>
  <div class="lz-step"><span class="lz-k">When the product needs it</span><span class="lz-t">Not before</span><span class="lz-d">Social login (Chapter 8) when users ask for it. Roles and permissions (9.2) at the third boolean. Multi-tenancy (9.4) when the first customer wants isolation. Building these early produces abstractions with no users.</span></div>
  <div class="lz-step"><span class="lz-k">Possibly never</span><span class="lz-t">And that is a legitimate answer</span><span class="lz-d">Your own authorization server (8.1), relationship-based authorization (9.3) for a product with one owner per object, tamper-evident logging (11.4) outside regulated work. Knowing these exist is most of the value; adopting them without a reason is cost.</span></div>
</div>
<div class="callout warn">
<p><strong>The recovery path is the one thing that must keep pace with everything else.</strong> Every factor added is another thing a user can lose, and every mechanism in this course is worth exactly what its weakest recovery path is worth. Passkeys with an email reset that disables them are an email account. MFA with a help desk that turns it off after two questions is a help desk. Whenever you strengthen the front door, re-read Lesson 7.3's ladder and Lesson 10.4's procedure, and make sure the back has moved with it — because attackers check the back first.</p>
</div>

<h3>What this course was actually about</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Almost none of it was cryptography</span><span class="lz-lnote">Argon2 is one line, HMAC is thirty, and a signature check is a library call. The lessons that mattered were about state, ordering and omission: a session you can end, a token that cannot be replayed, a check nobody can forget, a reset that invalidates what came before it. The maths was never the hard part.</span></div>
  <div class="lz-layer"><span class="lz-lname">The failures were structural, not clever</span><span class="lz-lnote">A missing <code>WHERE</code> clause, a URL built from a header, a boolean nobody checked, a key published in the wrong order, a query that ran before an <code>await</code>. Every measured failure in twelve chapters was ordinary code doing exactly what it said — which is why the defences are architectural: make the wrong thing impossible rather than merely discouraged.</span></div>
  <div class="lz-layer"><span class="lz-lname">The user is inside the threat model</span><span class="lz-lnote">They reuse passwords, they approve prompts at midnight, they cannot read a hostname, and they phone your support desk. Every defence that depends on them being careful eventually fails — which is the entire argument for passkeys, for number matching, and for a written recovery procedure instead of an agent's judgement.</span></div>
  <div class="lz-layer"><span class="lz-lname">What ages, and what does not</span><span class="lz-lnote">Parameters age: Argon2's memory cost, key sizes, which providers are trustworthy, which factors are strong. The reasoning does not. Deny by default, one canonical identifier, revocable state, verify the origin, log the actor, fail closed. Ten years from now the numbers on this page will be wrong and those six sentences will not.</span></div>
</div>
<div class="note-ct">
<p><strong>The last thing worth saying.</strong> A perfect authentication system that nobody can recover an account in is a failed product, and a friction-free one that hands accounts to strangers is a failed product too — the whole subject is the space between those, and every chapter here has been an argument about where a particular line should sit. You now have the material to make those calls deliberately and to write down why. That is the deliverable: not a system without trade-offs, but a system whose trade-offs somebody chose on purpose and can explain to the person who inherits it.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — authentication cheat sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · The whole course as one page to re-read yearly</span></span></a>
<a class="link-card" href="https://pages.nist.gov/800-63-3/" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">NIST SP 800-63 — digital identity guidelines</span><span class="lc-sub">pages.nist.gov · The standard the parameters in this course come from</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9700" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">RFC 9700 — OAuth security best current practice</span><span class="lc-sub">datatracker.ietf.org · Updated as attacks are found; worth a re-read each year</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">Chapters 8 and 9 build the service this authentication sits inside</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Build the day-one four into an existing product, then the week-one four</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.5</span>
<h2>Nên dựng cái gì trước, và điều gì đã THẬT SỰ thay đổi</h2>
<p class="lead">Đọc từ đầu tới cuối thì khoá học này mô tả một hệ thống xác thực HOÀN CHỈNH, và đọc theo cách đó khiến nó trông như một DỰ ÁN. Nó không phải vậy. Gần như mọi thứ ở đây đều thêm được vào một sản phẩm đang chạy, từng mảnh một, và THỨ TỰ còn quan trọng hơn nhiều so với sự trọn vẹn — nên bài cuối cùng này chính là cái thứ tự đó.</p>

<h3>Ngày thứ nhất: những thứ KHÔNG có phương án thay thế</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Băm cho đúng</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Argon2id, một dòng cấu hình</span><span class="lz-nsub">Bài 2.3 · không đảo ngược được nếu làm sai, cực dễ nếu làm đúng, và không bao giờ phải xem lại</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Các cờ của cookie</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">HttpOnly · Secure · SameSite · không Domain</span><span class="lz-nsub">Bài 3.4 và 10.3 · bốn chữ gỡ bỏ phiên bản DỄ của việc cắp phiên</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Ghim thuật toán</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">algorithms: ['HS256'], và kiểm iss/aud/exp</span><span class="lz-nsub">Bài 4.2 và 4.3 · một đối tượng tuỳ chọn đứng giữa bạn và một cú vượt xác thực hoàn toàn</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Sở hữu nằm trong truy vấn</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">where: { id, nguoiDungId }</span><span class="lz-nsub">Bài 9.1 · lỗ hổng web số MỘT, bịt được bằng cách DỜI một điều kiện</span></div></div>
  </div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Cả bốn đều là những dòng ĐƠN LẺ</span><span class="v">Gộp lại, chúng bịt việc bẻ mật khẩu, phiên bản dễ của cắp phiên, việc giả mạo token hoàn toàn, và con lỗi kiểm soát truy cập phổ biến nhất. Không kiến trúc, không migration, không họp hành — và nếu bạn chẳng làm gì khác từ khoá học này thì hãy làm bốn cái này.</span></div>
  <div class="kv"><span class="k">Chúng cũng là những thứ mà việc THIẾU chẳng ai nhận ra</span><span class="v">Một hàm băm nhanh, một cookie thiếu <code>HttpOnly</code>, một lời gọi <code>verify</code> không ghim và một truy vấn không giới hạn phạm vi — tất cả đều chạy HOÀN HẢO. Không triệu chứng, không test đỏ, không lỗi nào — và đó là lý do chúng phải nằm trong một BẢNG KIỂM chứ đừng để tự phát hiện ra.</span></div>
  <div class="kv"><span class="k">Nhân tiện hãy thêm luôn phép đối chiếu danh sách rò rỉ</span><span class="v">Bài 2.2, một lời gọi API lúc đăng ký và lúc đặt lại. Nó gỡ bỏ phần lớn cái làm cho việc nhồi tín vật có lời, và nó là dòng có ĐÒN BẨY CAO NHẤT trên mỗi phút bỏ ra trong cả khoá học này.</span></div>
  <div class="kv"><span class="k">Rồi hãy GHI LẠI những gì bạn vừa làm</span><span class="v">Bốn câu trong kho mã. Nếu không thì người tiếp theo sẽ phải bỏ ra nửa ngày ở Bài 12.4 để tìm hiểu xem đây là QUYẾT ĐỊNH hay là TAI NẠN.</span></div>
</div>

<h3>Tuần thứ nhất, quý thứ nhất, và có thể không bao giờ</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Tuần thứ nhất</span><span class="lz-t">Thu hồi và các trần</span><span class="lz-d">Những cái phiên bạn KẾT THÚC được (5.3), giới hạn tần suất lấy khoá là TÀI KHOẢN (10.1, 11.3), một luồng đặt lại mật khẩu thu hồi mọi thứ và dựng URL từ cấu hình (6.3), cùng ba lá thư báo ở 6.5. Đây là cái tuần biến "chúng ta có đăng nhập" thành "chúng ta PHẢN ỨNG được khi có chuyện".</span></div>
  <div class="lz-step"><span class="lz-k">Quý thứ nhất</span><span class="lz-t">Các yếu tố và khả năng NHÌN THẤY</span><span class="lz-d">Passkey kèm mật khẩu làm đường lùi (7.4, 7.5), một danh sách thiết bị mà người dùng thao tác được (5.4), một nhật ký kiểm toán ghi người thực hiện (11.4), và HAI cảnh báo mà bạn tin (11.5). Mỗi cái một sprint, và gộp lại chúng là khác biệt giữa một sản phẩm SỐNG SÓT qua một sự cố với một sản phẩm biết tin từ một khách hàng.</span></div>
  <div class="lz-step"><span class="lz-k">Khi sản phẩm THẬT SỰ cần</span><span class="lz-t">Không sớm hơn</span><span class="lz-d">Đăng nhập mạng xã hội (Chương 8) khi người dùng hỏi tới. Vai trò và quyền (9.2) ở cái boolean thứ ba. Nhiều tenant (9.4) khi khách hàng đầu tiên muốn được cô lập. Dựng những thứ này SỚM thì cho ra những lớp trừu tượng KHÔNG CÓ NGƯỜI DÙNG.</span></div>
  <div class="lz-step"><span class="lz-k">Có thể KHÔNG BAO GIỜ</span><span class="lz-t">Và đó là một câu trả lời chính đáng</span><span class="lz-d">Máy chủ uỷ quyền của riêng bạn (8.1), phân quyền theo quan hệ (9.3) cho một sản phẩm mà mỗi đối tượng chỉ có một chủ, nhật ký chống-sửa-đổi (11.4) ngoài phạm vi công việc bị quản lý chặt. BIẾT rằng chúng tồn tại đã là phần lớn giá trị; áp dụng chúng mà không có lý do thì chỉ là chi phí.</span></div>
</div>
<div class="callout warn">
<p><strong>Đường KHÔI PHỤC là thứ DUY NHẤT bắt buộc phải theo kịp mọi thứ còn lại.</strong> Mỗi yếu tố thêm vào là thêm một thứ người dùng có thể MẤT, và mọi cơ chế trong khoá học này đáng giá ĐÚNG BẰNG đường khôi phục yếu nhất của nó. Passkey đi kèm một cú đặt lại qua email có thể tắt chúng đi thì chính là một tài khoản email. MFA đi kèm một bàn hỗ trợ tắt nó sau hai câu hỏi thì chính là một bàn hỗ trợ. Mỗi lần bạn gia cố cửa TRƯỚC, hãy đọc lại cái thang ở Bài 7.3 và quy trình ở Bài 10.4, và bảo đảm rằng cửa SAU cũng đã dịch theo — vì kẻ tấn công kiểm cửa sau TRƯỚC.</p>
</div>

<h3>Khoá học này thật ra nói về cái gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Gần như KHÔNG có phần nào là mật mã học</span><span class="lz-lnote">Argon2 là một dòng, HMAC là ba mươi dòng, và kiểm một chữ ký là một lời gọi thư viện. Những bài học ĐÁNG KỂ đều nói về TRẠNG THÁI, THỨ TỰ và SỰ THIẾU SÓT: một cái phiên bạn kết thúc được, một token không phát lại được, một phép kiểm không ai quên nổi, một lần đặt lại vô hiệu hoá những gì có trước nó. Phần toán chưa bao giờ là phần khó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Các kiểu hỏng đều mang tính CẤU TRÚC, không hề tinh vi</span><span class="lz-lnote">Một mệnh đề <code>WHERE</code> bị thiếu, một URL dựng từ một header, một giá trị boolean chẳng ai kiểm, một cái khoá công bố sai thứ tự, một truy vấn chạy trước một cái <code>await</code>. Mọi kiểu hỏng ĐO ĐƯỢC trong mười hai chương đều là mã BÌNH THƯỜNG làm đúng cái nó viết ra — và đó là lý do các hàng phòng thủ mang tính kiến trúc: hãy làm cho việc SAI trở nên BẤT KHẢ chứ đừng chỉ khuyên can nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">NGƯỜI DÙNG nằm bên trong mô hình đe doạ</span><span class="lz-lnote">Họ dùng lại mật khẩu, họ phê duyệt lời nhắc lúc nửa đêm, họ không đọc nổi một cái hostname, và họ gọi cho bàn hỗ trợ của bạn. Mọi hàng phòng thủ dựa vào việc họ CẨN THẬN rồi sẽ có ngày sụp — và đó là toàn bộ lý lẽ ủng hộ passkey, ủng hộ khớp số, và ủng hộ một quy trình khôi phục bằng VĂN BẢN thay cho sự phán đoán của một nhân viên.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cái gì GIÀ ĐI, và cái gì thì không</span><span class="lz-lnote">Các THAM SỐ thì già đi: chi phí bộ nhớ của Argon2, kích thước khoá, nhà cung cấp nào đáng tin, yếu tố nào là mạnh. Còn LÝ LẼ thì không. Mặc định từ chối, một định danh chuẩn duy nhất, trạng thái thu hồi được, kiểm chứng origin, ghi người thực hiện, hỏng theo hướng đóng. Mười năm nữa các con số trên trang này sẽ sai, còn sáu câu kia thì không.</span></div>
</div>
<div class="note-ct">
<p><strong>Điều cuối cùng đáng nói.</strong> Một hệ thống xác thực HOÀN HẢO mà chẳng ai khôi phục nổi tài khoản là một sản phẩm THẤT BẠI, và một hệ thống trơn tru không ma sát mà đem tài khoản trao cho người lạ cũng là một sản phẩm thất bại — cả cái môn học này chính là khoảng nằm GIỮA hai thứ đó, và mọi chương ở đây đều là một lập luận về việc một cái ranh giới cụ thể nên nằm ở đâu. Giờ bạn đã có đủ chất liệu để đưa ra những lựa chọn ấy MỘT CÁCH CÓ CHỦ Ý và để viết ra vì sao. Đó mới là sản phẩm thật: không phải một hệ thống không có đánh đổi, mà là một hệ thống mà những đánh đổi của nó do ai đó CHỌN có chủ ý và GIẢI THÍCH được cho người sẽ kế thừa nó.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — bảng tra về xác thực</span><span class="lc-sub">cheatsheetseries.owasp.org · Cả khoá học này gói vào một trang, đáng đọc lại mỗi năm</span></span></a>
<a class="link-card" href="https://pages.nist.gov/800-63-3/" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">NIST SP 800-63 — hướng dẫn danh tính số</span><span class="lc-sub">pages.nist.gov · Bản chuẩn mà các tham số trong khoá này lấy ra từ đó</span></span></a>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc9700" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">RFC 9700 — thực hành bảo mật OAuth hiện hành</span><span class="lc-sub">datatracker.ietf.org · Được cập nhật mỗi khi có cú tấn công mới; đáng đọc lại hằng năm</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">Chương 8 và 9 dựng cái dịch vụ mà phần xác thực này nằm bên trong</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Dựng bốn việc của ngày thứ nhất vào một sản phẩm đang chạy, rồi tới bốn việc của tuần thứ nhất</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 12.6 ─────────────────────────── */
    {
      title: 'Final exam — Authentication|||Bài kiểm cuối khoá — Authentication',
      slug: 'auth-12-6-kiem-cuoi-khoa',
      type: 'QUIZ',
      description: 'Mười hai câu trải khắp cả khoá: băm, phiên, JWT, xoay vòng, vòng đời tài khoản, MFA và passkey, OAuth, phân quyền, tấn công và vận hành. 1.080 giây.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Final exam</span>
<h2>Final exam — Authentication</h2>
<p class="lead">Twelve questions across all twelve chapters, eighteen minutes. Most of them describe code that compiles, runs, passes its tests and hands somebody an account — which has been the shape of this entire course.</p>
<div class="callout">
<p><strong>What you built.</strong> Passwords hashed with Argon2id and checked against a breach corpus. Sessions in a shared store, in a cookie with four attributes, and a token pair whose access half expires in minutes while the refresh half rotates and detects reuse. An account lifecycle where the email is normalised once, verification happens behind a <code>POST</code>, and a password reset invalidates everything older than it. A second factor written from the RFC, and passkeys that make phishing structurally impossible. Federated login keyed on <code>(provider, sub)</code> with <code>email_verified</code> required. Authorization that denies by default, scopes every query, and cannot be bypassed by a background job. And the operational half: secrets that never reach the repository, keys rotated in four phases, limits keyed on the account, an audit log recording the actor, and two alerts somebody reads.</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài kiểm cuối khoá</span>
<h2>Bài kiểm cuối khoá — Authentication</h2>
<p class="lead">Mười hai câu trải khắp mười hai chương, mười tám phút. Phần lớn trong số đó mô tả những đoạn mã BIÊN DỊCH ĐƯỢC, CHẠY ĐƯỢC, TEST XANH và đem trao cho ai đó một tài khoản — đó vẫn luôn là hình dạng của cả khoá học này.</p>
<div class="callout">
<p><strong>Bạn đã dựng được cái gì.</strong> Mật khẩu băm bằng Argon2id và đối chiếu với một kho rò rỉ. Phiên nằm trong một kho dùng chung, trong một cookie mang bốn thuộc tính, và một cặp token mà nửa access hết hạn sau vài phút còn nửa refresh thì xoay vòng và phát hiện tái dùng. Một vòng đời tài khoản trong đó email được chuẩn hoá MỘT lần, việc xác minh nằm sau một cú <code>POST</code>, và một lần đặt lại mật khẩu vô hiệu hoá mọi thứ cũ hơn nó. Một yếu tố thứ hai viết ra từ chính bản RFC, và passkey khiến việc lừa đảo trở nên BẤT KHẢ về mặt cấu trúc. Đăng nhập liên kết lấy khoá là <code>(nhà cung cấp, sub)</code> với <code>email_verified</code> bắt buộc. Phân quyền mặc định TỪ CHỐI, giới hạn phạm vi mọi truy vấn, và không bị một công việc chạy nền đi vòng qua. Và nửa vận hành: bí mật không bao giờ tới được kho mã, khoá xoay theo bốn giai đoạn, trần lấy khoá là tài khoản, một nhật ký kiểm toán ghi người thực hiện, và hai cảnh báo mà có người ĐỌC.</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 1080,
        questions: [
          {
            question: 'Why is Argon2id preferred over SHA-256 for passwords, when SHA-256 is the stronger hash?|||Vì sao Argon2id được ưu tiên hơn SHA-256 cho mật khẩu, trong khi SHA-256 mới là hàm băm mạnh hơn?',
            options: [
              'Because SHA-256 has known collisions|||Vì SHA-256 đã có va chạm được công bố',
              'Because password hashing needs to be deliberately slow and memory-hard: SHA-256 is fast by design, so a GPU tries billions per second against a stolen table|||Vì băm mật khẩu cần CỐ TÌNH chậm và ngốn bộ nhớ: SHA-256 nhanh theo thiết kế, nên một cái GPU thử hàng tỉ lần mỗi giây trên một bảng bị cắp',
              'Because Argon2id produces longer output|||Vì Argon2id cho ra kết quả dài hơn',
              'Because SHA-256 cannot be salted|||Vì SHA-256 không thêm muối được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your JWT verification calls jwt.verify(token, key) with no options object. What is the risk?|||Phần kiểm chứng JWT của bạn gọi jwt.verify(token, key) mà không kèm đối tượng tuỳ chọn. Rủi ro là gì?',
            options: [
              'None; verify always checks the signature|||Không có; verify lúc nào cũng kiểm chữ ký',
              'The token chooses the algorithm, enabling algorithm confusion — pin an explicit allowlist of exactly one algorithm and check iss, aud and exp as well|||Cái TOKEN được chọn thuật toán, mở đường cho nhầm lẫn thuật toán — hãy ghim một danh sách trắng tường minh với ĐÚNG MỘT thuật toán, và kiểm thêm cả iss, aud và exp',
              'Verification will be slower|||Việc kiểm chứng sẽ chậm hơn',
              'The token cannot be revoked|||Cái token đó không thu hồi được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does a refresh token being presented twice tell you, and what is the correct response?|||Một refresh token được trình ra hai lần cho bạn biết điều gì, và phản ứng đúng là gì?',
            options: [
              'A client bug; issue a new token and continue|||Một con lỗi của client; cứ phát token mới rồi đi tiếp',
              'Two parties hold it and you cannot tell which is legitimate — revoke the whole token family, unless a short grace window shows it is the refresh race|||HAI bên đang cùng giữ nó và bạn không phân biệt được bên nào là thật — hãy thu hồi CẢ HỌ token, trừ khi một cửa sổ ân hạn ngắn cho thấy đó là cuộc đua refresh',
              'The token expired; ask the user to log in again|||Token đã hết hạn; bảo người dùng đăng nhập lại',
              'Nothing; rotation makes reuse harmless|||Chẳng nói lên gì; xoay vòng đã làm việc tái dùng thành vô hại',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A verification link is a GET that marks the email verified. Why do users report expired links they never clicked?|||Một đường dẫn xác minh là một cú GET đánh dấu email đã xác minh. Vì sao người dùng báo rằng đường dẫn hết hạn dù họ chưa hề bấm?',
            options: [
              'The expiry window is too short|||Cửa sổ hết hạn quá ngắn',
              'Mail security gateways fetch every URL in an incoming message within seconds, consuming the token — move the side effect behind a POST or make the GET idempotent|||Cổng bảo mật thư tải MỌI URL trong thư đến chỉ sau vài giây, và tiêu mất cái token — hãy đẩy tác dụng phụ ra sau một cú POST hoặc làm cho cái GET bất biến khi lặp',
              'The mail provider rewrites the token|||Nhà cung cấp thư viết lại cái token',
              'The user opened the mail on two devices|||Người dùng mở thư trên hai thiết bị',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Both login failure branches return the same message and status. Is enumeration closed?|||Cả hai nhánh thất bại của trang đăng nhập đều trả về cùng một câu và cùng một mã trạng thái. Đã bịt được chuyện dò tài khoản chưa?',
            options: [
              'Yes; identical responses carry identical information|||Rồi; phản hồi giống hệt thì mang thông tin giống hệt',
              'No — with no user row the password hash is skipped, so the answer arrives in microseconds instead of ~100ms; always verify against a dummy hash|||Chưa — khi không có bản ghi người dùng thì hàm băm bị bỏ qua, nên câu trả lời về sau vài micro giây thay vì ~100ms; hãy LUÔN xác minh với một băm giả',
              'Yes, provided rate limiting is enabled|||Rồi, miễn là đã bật giới hạn tần suất',
              'No, because the response body length differs|||Chưa, vì độ dài thân phản hồi khác nhau',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your reset mail builds its URL from req.headers.host. What can an attacker do?|||Thư đặt lại mật khẩu của bạn dựng URL từ req.headers.host. Kẻ tấn công làm được gì?',
            options: [
              'Nothing; the token is random and stored hashed|||Không gì cả; token vẫn ngẫu nhiên và lưu dạng băm',
              'Request a reset for a victim with a poisoned Host, so your server mails their real inbox a genuine link pointing at the attacker — build the URL from a configured constant|||Yêu cầu đặt lại cho một nạn nhân kèm một cái Host đã đầu độc, khiến máy chủ của bạn gửi tới hộp thư THẬT của họ một đường dẫn chính danh trỏ về kẻ tấn công — hãy dựng URL từ một HẰNG SỐ cấu hình',
              'Only prevent the mail from being delivered|||Chỉ khiến lá thư không tới nơi được',
              'Read the token from the database|||Đọc được token từ cơ sở dữ liệu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why do passkeys stop a phishing proxy that relays your real login page, while TOTP does not?|||Vì sao passkey chặn được một proxy lừa đảo chuyển tiếp trang đăng nhập thật của bạn, còn TOTP thì không?',
            options: [
              'Because the passkey signature expires faster|||Vì chữ ký của passkey hết hạn nhanh hơn',
              'Because the browser signs the origin it is actually on, so a relayed signature names the proxy and the credential is never offered to that domain — six digits carry no site information|||Vì trình duyệt KÝ CẢ cái origin nó đang thật sự đứng, nên chữ ký chuyển tiếp khai ra cái proxy và credential ngay từ đầu đã không được đưa ra cho tên miền đó — còn sáu chữ số thì không mang thông tin nào về trang cả',
              'Because passkeys use a longer key|||Vì passkey dùng khoá dài hơn',
              'Because TOTP secrets are stored on the server|||Vì bí mật TOTP được lưu ở máy chủ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A provider sends email: "admin@company.com" with email_verified: false. What should your login do?|||Một nhà cung cấp gửi email: "admin@congty.com" kèm email_verified: false. Trang đăng nhập của bạn nên làm gì?',
            options: [
              'Log the user in; the provider authenticated them|||Đăng nhập người dùng đó; nhà cung cấp đã xác thực họ rồi',
              'Refuse to link or auto-create against that address — an unverified claim lets anyone who registers at the sloppiest accepted provider sign in as any of your users|||Từ chối nối và từ chối tự tạo tài khoản gắn với địa chỉ đó — một lời khai chưa xác minh cho phép bất kỳ ai đăng ký ở nhà cung cấp CẨU THẢ NHẤT mà bạn chấp nhận đăng nhập với tư cách bất kỳ người dùng nào của bạn',
              'Log them in and send a verification email afterwards|||Cứ đăng nhập rồi gửi thư xác minh sau',
              'Link only if the provider is Google|||Chỉ nối nếu nhà cung cấp là Google',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'An authenticated endpoint loads an invoice by the id in the URL. What is the correct fix?|||Một endpoint đã có xác thực nạp một hoá đơn theo id trên URL. Cách vá đúng là gì?',
            options: [
              'Switch the ids to UUIDs so they cannot be guessed|||Đổi id sang UUID để không đoán được',
              'Put the ownership condition inside the query so the row cannot be returned to another user, and answer 404 rather than 403|||Đặt điều kiện SỞ HỮU vào TRONG câu truy vấn để bản ghi không thể trả về cho người dùng khác, và đáp 404 chứ không phải 403',
              'Check the user role in route middleware|||Kiểm vai trò người dùng trong middleware của tuyến',
              'Rate-limit the endpoint|||Giới hạn tần suất cho endpoint đó',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is per-IP rate limiting the wrong axis for login attempts?|||Vì sao giới hạn tần suất theo IP là TRỤC SAI cho các lần thử đăng nhập?',
            options: [
              'Because IPv6 addresses are too numerous to store|||Vì địa chỉ IPv6 quá nhiều, không lưu xuể',
              'Because the attacker rotates addresses cheaply while the target account is fixed, and the same limiter punishes offices and carrier NATs where many real users share one address|||Vì kẻ tấn công xoay địa chỉ rất rẻ trong khi cái tài khoản đích thì cố định, và cũng chính bộ giới hạn đó trừng phạt các văn phòng và NAT nhà mạng nơi nhiều người dùng thật chung một địa chỉ',
              'Because IP addresses are personal data|||Vì địa chỉ IP là dữ liệu cá nhân',
              'Because proxies strip the client IP|||Vì proxy gỡ mất IP của client',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the correct order for rotating a signing key without downtime?|||Thứ tự ĐÚNG để xoay một khoá ký mà không gián đoạn là gì?',
            options: [
              'Sign with the new key, then publish it, then retire the old|||Ký bằng khoá mới, rồi công bố nó, rồi rút cái cũ',
              'Publish the new key to every verifier, then switch signing to it, then wait out the longest-lived signed artefact, then retire the old key|||CÔNG BỐ khoá mới tới mọi bên xác minh, rồi chuyển sang KÝ bằng nó, rồi CHỜ hết tuổi thọ của hiện vật đã ký sống lâu nhất, rồi RÚT khoá cũ',
              'Retire the old key first so nothing verifies against it|||Rút khoá cũ trước để không còn gì xác minh bằng nó',
              'Publish and retire in the same deploy|||Công bố và rút trong cùng một lần deploy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A password reset succeeds. Which of these must it invalidate?|||Một lần đặt lại mật khẩu thành công. Nó BẮT BUỘC phải vô hiệu hoá những thứ nào?',
            options: [
              'Only the reset token that was used|||Chỉ cái token đặt lại vừa được dùng',
              'Everything that existed before it: every session, any pending email change, factors and provider links attached earlier, and all outstanding tokens — this is what closes all five pre-hijacking variants|||MỌI THỨ tồn tại trước nó: mọi phiên, mọi yêu cầu đổi email đang chờ, các yếu tố và liên kết nhà cung cấp gắn vào từ trước, và toàn bộ token còn treo — chính điều này bịt cả năm biến thể chiếm-trước tài khoản',
              'Every session except the one performing the reset|||Mọi phiên trừ cái phiên đang thực hiện việc đặt lại',
              'Nothing else; the new password is sufficient|||Không gì khác cả; mật khẩu mới là đủ',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
