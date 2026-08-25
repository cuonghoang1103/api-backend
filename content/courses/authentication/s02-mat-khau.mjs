/**
 * Authentication — Chương 2: Mật khẩu.
 * Vì sao hàm băm nhanh là công cụ sai · Argon2id/bcrypt/scrypt và cách chỉnh tham số bằng số đo ·
 * luồng đăng nhập làm đúng · chính sách mật khẩu theo NIST · chuyển đổi hàm băm cũ · quiz.
 * Output CHẠY THẬT Node.js 22 + Express 5 + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fauthentication%2Flearn&reflabel=Auth';

export default {
  title: 'Chapter 2 — Passwords|||Chương 2 — Mật khẩu',
  description: 'Bài toán duy nhất: kẻ tấn công đã CẦM cơ sở dữ liệu của bạn, và giờ chỉ còn tốc độ đứng giữa họ với mật khẩu của mọi người. Chương này đo tốc độ đó bằng số thật, chọn hàm băm và tham số theo phép đo chứ không theo bài blog, dựng luồng đăng nhập không rò danh sách người dùng qua thông báo lẫn qua thời gian, và chuyển đổi cả một bảng hàm băm cũ mà không bắt ai đặt lại mật khẩu.',
  lessons: [
    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — The attacker already has your database|||2.1 — Kẻ tấn công ĐÃ CÓ cơ sở dữ liệu của bạn',
      slug: 'auth-2-1-da-co-csdl',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Giả định duy nhất đáng thiết kế quanh nó: bảng người dùng đã nằm trong tay ai đó. Từ giả định đó suy ra vì sao SHA-256 là công cụ SAI, muối giải quyết điều gì và KHÔNG giải quyết điều gì, và bảng thời gian bẻ khoá đo bằng số thật cho từng hàm băm với từng độ mạnh mật khẩu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>The attacker already has your database</h2>
<p class="lead">Password storage has exactly one design goal, and it is not "keep the password secret". It is: <em>when someone walks off with the user table, how long does it take them to turn it into a list of plaintext passwords?</em> Every decision in this chapter — the algorithm, the salt, the cost parameter — is an answer to that one question, and the answer is measured in hashes per second.</p>

<h3>Why a fast hash is the wrong tool</h3>
<pre><code><span class="tok-comment">// The instinct: "hash it, hashes are one-way"</span>
const hash = createHash('sha256').update(password).digest('hex');</code></pre>
<div class="out"># Toc do do tren MOT GPU pho thong (bench kieu hashcat, xap xi):

MD5        ~ 160 GH/s     (160.000.000.000 lan bam moi giay)
SHA-1      ~  50 GH/s
SHA-256    ~  20 GH/s
SHA-512    ~   7 GH/s</div>
<pre><code><span class="tok-comment"># A password of 8 lowercase letters and digits: 36^8 = 2,82 × 10^12</span>
<span class="tok-comment"># One GPU, SHA-256:  2,82e12 / 2e10  =  141 giay</span></code></pre>
<div class="out">Toan bo khong gian mat khau 8 ky tu chu-so thuong:
  SHA-256, mot GPU  → 2 phut 21 giay
  MD5,     mot GPU  → 18 giay

Khong phai "kho". Khong phai "ton kem". La MOT LAN NGHI GIAI LAO.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">The property you want</span><span class="lz-t">Slow, deliberately</span><span class="lz-d">A general-purpose hash is designed to be as fast as possible, because that is what a checksum needs. For passwords that is the exact opposite of the requirement: you want each guess to <em>cost</em> the attacker something measurable.</span></div>
  <div class="lz-step"><span class="lz-k">The asymmetry you are buying</span><span class="lz-t">One check versus billions</span><span class="lz-d">Your server verifies one password per login. The attacker computes billions. Making a single hash take 100 ms is imperceptible to you and multiplies their cost by ten million.</span></div>
  <div class="lz-step"><span class="lz-k">GPUs, not CPUs</span><span class="lz-t">Why parallelism matters</span><span class="lz-d">SHA-256 is tiny, stateless and needs almost no memory, so a GPU runs thousands of instances at once. A password hash that <em>requires memory</em> takes that advantage away — which is what "memory-hard" means and why Argon2 exists.</span></div>
  <div class="lz-step"><span class="lz-k">The honest limit</span><span class="lz-t">It protects weak passwords</span><span class="lz-d">A truly random 12-character password survives even SHA-256 for thousands of years. Slow hashing exists because real passwords are not random — it buys time for the majority who reused something guessable.</span></div>
</div>

<h3>What salt fixes, and what it does not</h3>
<pre><code><span class="tok-comment">// Without salt: identical passwords produce identical hashes</span>
sha256('123456') = 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
sha256('123456') = 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92</code></pre>
<div class="out">SELECT bam, count(*) FROM "User" GROUP BY bam ORDER BY 2 DESC LIMIT 3;

                              bam                               | count
----------------------------------------------------------------+-------
 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc… |  4.182   ← '123456'
 e10adc3949ba59abbe56e057f20f883e…                              |  2.907
 5e884898da28047151d0e56f8dc62927…                              |  1.455   ← 'password'

# Ke tan cong be MOT lan, lay duoc 8.544 tai khoan.
# Va mot bang cau vong tinh san tra ra ca ba trong vai mili giay.</div>
<pre><code><span class="tok-comment">// With a per-user salt: the same password, two different hashes</span>
const salt = randomBytes(16);                    <span class="tok-comment">// 128 bit, một người một cái</span>
const hash = createHash('sha256').update(Buffer.concat([salt, Buffer.from(password)])).digest();
<span class="tok-comment">// Lưu CẢ HAI: muối không phải bí mật, nó chỉ cần DUY NHẤT.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">✅ Salt kills precomputation</span><span class="v">A rainbow table is built once and reused against every unsalted hash on earth. With a unique salt per user, a precomputed table is useless — the attacker must start from scratch for each row.</span></div>
  <div class="kv"><span class="k">✅ Salt hides duplicates</span><span class="v">The <code>GROUP BY</code> above stops working. The attacker can no longer see that four thousand users share a password, nor crack all four thousand with one success.</span></div>
  <div class="kv"><span class="k">❌ Salt does not slow anything down</span><span class="v">Cracking one user's SHA-256 hash still runs at 20 GH/s. Salt turns "one attack on the whole table" into "one attack per row" — which matters enormously at scale and not at all if the attacker only wants the admin account.</span></div>
  <div class="kv"><span class="k">The salt is not a secret</span><span class="v">It is stored next to the hash, and that is correct. It has one job — uniqueness — and hiding it would add nothing. The secret value stored separately is a <em>pepper</em>, which is a different tool covered in Lesson 2.3.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — reusing one salt for every user is the same as having no salt.</strong> A single application-wide salt still lets the attacker crack all rows in one pass, because every guess is hashed once and compared against the whole table. The salt must be <em>per record</em> and generated with a CSPRNG (Lesson 1.2). Modern password hashes generate and embed it for you, which is one more reason not to build this by hand.</p>
</div>

<h3>Slow and memory-hard: the numbers side by side</h3>
<pre><code><span class="tok-comment"># Toc do bam tren cung mot GPU (xap xi, bench kieu hashcat)</span>
SHA-256                          ~ 20.000.000.000  H/s
PBKDF2-HMAC-SHA256, 10k vong     ~     2.000.000  H/s
bcrypt, cost 5                   ~       184.000  H/s
bcrypt, cost 12                  ~         1.400  H/s
Argon2id, 64 MB, t=3, p=1        ~           500  H/s</code></pre>
<div class="out">Cung mot mat khau 8 ky tu chu-so thuong (36^8 = 2,82 × 10^12),
mot GPU, do het KHONG GIAN:

  SHA-256            →       2 phut
  PBKDF2 10k vong    →      16 ngay
  bcrypt cost 5      →       6 thang
  bcrypt cost 12     →      64 nam
  Argon2id 64MB      →     179 nam

Cung mot the may. Chi khac tham so.</div>
<pre><code><span class="tok-comment"># Va day la ly do MUOI van quan trong, tren quy mo:</span>
<span class="tok-comment"># Danh sach 10.000 mat khau pho bien nhat, Argon2id 64MB, 500 H/s</span>

  1 nguoi dung   → 10.000 / 500        =  20 giay
  1.000.000 nguoi → 20 giay × 1.000.000 = 231 NGAY (mot GPU)</code></pre>
<div class="callout ok">
<p><strong>Read those two tables together and the whole design falls out.</strong> The slow hash sets the cost per guess; the salt multiplies that cost by the number of users. Neither alone is enough: a fast hash with perfect salting still falls in an afternoon, and a slow hash with a shared salt lets one pass crack the whole table. You need both, and both come free with any modern password hashing function — which is Lesson 2.2.</p>
</div>

<h3>What "the attacker has the database" actually looks like</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">A backup on object storage with the wrong permissions</span><span class="lz-lnote">The most common one. Nobody broke in; a bucket was public, or a signed URL had no expiry, or a staging copy of production data sat on a laptop.</span></div>
  <div class="lz-layer"><span class="lz-lname">SQL injection that reads one table</span><span class="lz-lnote">It does not need to be a full compromise. One <code>UNION SELECT</code> against a search endpoint, and the user table leaves through a JSON response, a few hundred rows at a time.</span></div>
  <div class="lz-layer"><span class="lz-lname">An insider, or a former one</span><span class="lz-lnote">A developer with production read access, a contractor whose credentials were never revoked, an admin panel with an export button. No exploit involved, and no alert either.</span></div>
  <div class="lz-layer"><span class="lz-lname">A dependency that exfiltrates</span><span class="lz-lnote">A compromised npm package in a build pipeline that has database access. This is the modern version, and the reason a slow hash is worth having even in a system you consider low-risk.</span></div>
  <div class="lz-layer"><span class="lz-lname">Why this is worth designing for</span><span class="lz-lnote">Because it is not hypothetical and because the mitigation is one library and one configuration value. Compared with everything else in this course — MFA, OAuth, session management — password hashing has the best ratio of protection to effort by a wide margin.</span></div>
</div>
<div class="note-ct">
<p><strong>The consequence that reaches beyond you.</strong> A cracked password from your database is tried immediately against email, banking and every popular service, because password reuse is the norm rather than the exception. That means a leak of your user table is not only your users' problem with <em>your</em> product — it is their problem everywhere. It is also the mechanism behind credential stuffing (Chapter 10): the attacks you receive are powered by someone else's leak, and the leak you cause powers someone else's attacks.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">OWASP — Password Storage Cheat Sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · The current recommended algorithms and parameters</span></span></a>
<a class="link-card" href="https://hashcat.net/hashcat/" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">hashcat</span><span class="lc-sub">hashcat.net · The tool the benchmark numbers come from; run it on your own hardware</span></span></a>
<a class="link-card" href="https://www.ietf.org/rfc/rfc9106.html" target="_blank" rel="noopener"><span class="lc-ico">🧠</span><span class="lc-body"><span class="lc-title">RFC 9106 — Argon2</span><span class="lc-sub">ietf.org · What memory-hardness means, and the parameter guidance</span></span></a>
<a class="link-card" href="https://haveibeenpwned.com/PwnedWebsites" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">Have I Been Pwned — breached sites</span><span class="lc-sub">haveibeenpwned.com · Read a few entries and note how many say "unsalted MD5"</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Crack a table of unsalted SHA-256 hashes, then try the same attack after adding salt and cost</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Kẻ tấn công ĐÃ CÓ cơ sở dữ liệu của bạn</h2>
<p class="lead">Việc cất mật khẩu có ĐÚNG MỘT mục tiêu thiết kế, và nó không phải "giữ cho mật khẩu bí mật". Nó là: <em>khi có người ôm được bảng người dùng đi mất, họ mất bao lâu để biến nó thành một danh sách mật khẩu dạng rõ?</em> Mọi quyết định trong chương này — thuật toán, muối, tham số chi phí — đều là câu trả lời cho đúng câu hỏi đó, và câu trả lời đo bằng SỐ LẦN BĂM MỖI GIÂY.</p>

<h3>Vì sao hàm băm nhanh là công cụ SAI</h3>
<pre><code><span class="tok-comment">// Phản xạ đầu tiên: "băm nó đi, băm là một chiều mà"</span>
const hash = createHash('sha256').update(password).digest('hex');</code></pre>
<div class="out"># Toc do do tren MOT GPU pho thong (bench kieu hashcat, xap xi):

MD5        ~ 160 GH/s     (160.000.000.000 lan bam moi giay)
SHA-1      ~  50 GH/s
SHA-256    ~  20 GH/s
SHA-512    ~   7 GH/s</div>
<pre><code><span class="tok-comment"># Một mật khẩu 8 ký tự chữ thường và chữ số: 36^8 = 2,82 × 10^12</span>
<span class="tok-comment"># Một GPU, SHA-256:  2,82e12 / 2e10  =  141 giây</span></code></pre>
<div class="out">Toan bo khong gian mat khau 8 ky tu chu-so thuong:
  SHA-256, mot GPU  → 2 phut 21 giay
  MD5,     mot GPU  → 18 giay

Khong phai "kho". Khong phai "ton kem". La MOT LAN NGHI GIAI LAO.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Tính chất bạn CẦN</span><span class="lz-t">CHẬM, một cách cố ý</span><span class="lz-d">Một hàm băm đa dụng được thiết kế để NHANH HẾT MỨC, vì đó là thứ một checksum cần. Với mật khẩu thì đó là điều NGƯỢC HẲN với yêu cầu: bạn muốn mỗi lần đoán phải KHIẾN kẻ tấn công trả một cái giá đo được.</span></div>
  <div class="lz-step"><span class="lz-k">Cái BẤT ĐỐI XỨNG bạn đang mua</span><span class="lz-t">Một phép kiểm đối lại hàng tỉ</span><span class="lz-d">Máy chủ của bạn xác minh MỘT mật khẩu cho mỗi lần đăng nhập. Kẻ tấn công tính hàng tỉ. Làm cho một lần băm mất 100 ms thì bạn không cảm nhận nổi, còn chi phí của họ nhân lên mười triệu lần.</span></div>
  <div class="lz-step"><span class="lz-k">GPU, không phải CPU</span><span class="lz-t">Vì sao tính song song lại quan trọng</span><span class="lz-d">SHA-256 nhỏ xíu, không trạng thái và gần như không cần bộ nhớ, nên một GPU chạy hàng nghìn thể hiện cùng lúc. Một hàm băm mật khẩu ĐÒI HỎI BỘ NHỚ sẽ tước mất lợi thế đó — đó là nghĩa của "cứng theo bộ nhớ" và là lý do Argon2 ra đời.</span></div>
  <div class="lz-step"><span class="lz-k">Giới hạn nói cho thật</span><span class="lz-t">Nó bảo vệ mật khẩu YẾU</span><span class="lz-d">Một mật khẩu 12 ký tự NGẪU NHIÊN THẬT thì sống sót qua cả SHA-256 hàng nghìn năm. Băm chậm tồn tại vì mật khẩu THẬT không ngẫu nhiên — nó mua thời gian cho ĐA SỐ những người đã dùng lại một thứ gì đó đoán được.</span></div>
</div>

<h3>Muối vá được gì, và KHÔNG vá được gì</h3>
<pre><code><span class="tok-comment">// Không muối: mật khẩu giống nhau cho ra chuỗi băm giống nhau</span>
sha256('123456') = 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92
sha256('123456') = 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92</code></pre>
<div class="out">SELECT bam, count(*) FROM "User" GROUP BY bam ORDER BY 2 DESC LIMIT 3;

                              bam                               | count
----------------------------------------------------------------+-------
 8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc… |  4.182   ← '123456'
 e10adc3949ba59abbe56e057f20f883e…                              |  2.907
 5e884898da28047151d0e56f8dc62927…                              |  1.455   ← 'password'

# Ke tan cong be MOT lan, lay duoc 8.544 tai khoan.
# Va mot bang cau vong tinh san tra ra ca ba trong vai mili giay.</div>
<pre><code><span class="tok-comment">// Có muối riêng từng người: cùng một mật khẩu, hai chuỗi băm khác nhau</span>
const salt = randomBytes(16);                    <span class="tok-comment">// 128 bit, một người một cái</span>
const hash = createHash('sha256').update(Buffer.concat([salt, Buffer.from(password)])).digest();
<span class="tok-comment">// Lưu CẢ HAI: muối không phải bí mật, nó chỉ cần DUY NHẤT.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">✅ Muối giết chết việc TÍNH TRƯỚC</span><span class="v">Một bảng cầu vồng được dựng MỘT lần rồi dùng lại với mọi chuỗi băm không muối trên đời. Với một muối riêng cho từng người, bảng tính sẵn thành vô dụng — kẻ tấn công phải bắt đầu lại từ đầu cho TỪNG hàng.</span></div>
  <div class="kv"><span class="k">✅ Muối GIẤU những cái trùng nhau</span><span class="v">Câu <code>GROUP BY</code> ở trên thôi hoạt động. Kẻ tấn công không còn nhìn thấy bốn nghìn người dùng chung một mật khẩu, cũng không bẻ được cả bốn nghìn bằng MỘT lần thành công.</span></div>
  <div class="kv"><span class="k">❌ Muối KHÔNG làm chậm cái gì cả</span><span class="v">Bẻ chuỗi băm SHA-256 của MỘT người vẫn chạy ở 20 GH/s. Muối biến "một cú tấn công lên cả bảng" thành "một cú tấn công cho mỗi hàng" — điều đó cực kỳ quan trọng ở quy mô lớn và chẳng quan trọng gì nếu kẻ tấn công chỉ muốn tài khoản admin.</span></div>
  <div class="kv"><span class="k">Muối KHÔNG phải bí mật</span><span class="v">Nó nằm ngay cạnh chuỗi băm, và như thế là ĐÚNG. Nó có đúng một việc — bảo đảm tính duy nhất — và giấu nó đi cũng chẳng thêm được gì. Cái giá trị bí mật cất riêng ra là <em>TIÊU</em> (pepper), một công cụ khác, nói ở Bài 2.3.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — dùng CHUNG một muối cho mọi người dùng thì y hệt như không có muối.</strong> Một cái muối duy nhất cho toàn ứng dụng vẫn cho phép kẻ tấn công bẻ mọi hàng trong MỘT lượt, vì mỗi lần đoán chỉ băm một lần rồi đem so với cả bảng. Muối phải theo TỪNG BẢN GHI và sinh bằng một nguồn ngẫu nhiên mật mã (Bài 1.2). Các hàm băm mật khẩu hiện đại tự sinh và tự nhúng muối giùm bạn, và đó là thêm một lý do đừng tự tay dựng cái này.</p>
</div>

<h3>Chậm và cứng-theo-bộ-nhớ: các con số đặt cạnh nhau</h3>
<pre><code><span class="tok-comment"># Toc do bam tren cung mot GPU (xap xi, bench kieu hashcat)</span>
SHA-256                          ~ 20.000.000.000  H/s
PBKDF2-HMAC-SHA256, 10k vong     ~     2.000.000  H/s
bcrypt, cost 5                   ~       184.000  H/s
bcrypt, cost 12                  ~         1.400  H/s
Argon2id, 64 MB, t=3, p=1        ~           500  H/s</code></pre>
<div class="out">Cung mot mat khau 8 ky tu chu-so thuong (36^8 = 2,82 × 10^12),
mot GPU, do het KHONG GIAN:

  SHA-256            →       2 phut
  PBKDF2 10k vong    →      16 ngay
  bcrypt cost 5      →       6 thang
  bcrypt cost 12     →      64 nam
  Argon2id 64MB      →     179 nam

Cung mot the may. Chi khac tham so.</div>
<pre><code><span class="tok-comment"># Va day la ly do MUOI van quan trong, tren quy mo:</span>
<span class="tok-comment"># Danh sach 10.000 mat khau pho bien nhat, Argon2id 64MB, 500 H/s</span>

  1 nguoi dung   → 10.000 / 500        =  20 giay
  1.000.000 nguoi → 20 giay × 1.000.000 = 231 NGAY (mot GPU)</code></pre>
<div class="callout ok">
<p><strong>Đọc hai cái bảng đó CÙNG nhau là cả thiết kế tự rơi ra.</strong> Hàm băm chậm đặt ra CHI PHÍ CHO MỖI LẦN ĐOÁN; cái muối NHÂN chi phí đó lên theo SỐ NGƯỜI DÙNG. Không cái nào một mình là đủ: một hàm băm nhanh dù muối hoàn hảo vẫn đổ trong một buổi chiều, còn một hàm băm chậm với muối dùng chung thì để một lượt bẻ được cả bảng. Bạn cần CẢ HAI, và cả hai đều có sẵn miễn phí trong bất kỳ hàm băm mật khẩu hiện đại nào — tức là Bài 2.2.</p>
</div>

<h3>"Kẻ tấn công có cơ sở dữ liệu" thực tế trông như thế nào</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một bản sao lưu trên lưu trữ đối tượng với quyền đặt sai</span><span class="lz-lnote">Phổ biến nhất. Không ai đột nhập gì cả; một cái bucket để công khai, hoặc một URL có ký mà không đặt hạn, hoặc một bản sao dữ liệu production nằm trên laptop.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một lỗ SQL injection đọc được MỘT bảng</span><span class="lz-lnote">Nó không cần là một cú chiếm toàn phần. Một câu <code>UNION SELECT</code> lên một endpoint tìm kiếm, và bảng người dùng đi ra ngoài qua một phản hồi JSON, mỗi lần vài trăm hàng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Người bên trong, hoặc từng ở bên trong</span><span class="lz-lnote">Một lập trình viên có quyền đọc production, một nhà thầu mà tín vật chưa từng bị thu hồi, một trang quản trị có nút xuất dữ liệu. Không có khai thác nào, và cũng không có cảnh báo nào.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một gói phụ thuộc TUỒN dữ liệu ra</span><span class="lz-lnote">Một gói npm bị chiếm nằm trong đường ống build có quyền truy cập cơ sở dữ liệu. Đây là phiên bản HIỆN ĐẠI, và là lý do một hàm băm chậm vẫn đáng có ngay cả trong một hệ thống bạn cho là rủi ro thấp.</span></div>
  <div class="lz-layer"><span class="lz-lname">Vì sao chuyện này đáng thiết kế phòng trước</span><span class="lz-lnote">Vì nó KHÔNG giả định, và vì cách giảm thiểu chỉ là một thư viện và một giá trị cấu hình. So với mọi thứ khác trong khoá này — MFA, OAuth, quản lý phiên — việc băm mật khẩu có tỉ lệ bảo vệ trên công sức TỐT NHẤT, cách biệt rất xa.</span></div>
</div>
<div class="note-ct">
<p><strong>Hệ quả vươn ra ngoài phạm vi của bạn.</strong> Một mật khẩu bẻ được từ cơ sở dữ liệu của bạn sẽ được thử NGAY LẬP TỨC lên email, ngân hàng và mọi dịch vụ phổ biến, bởi vì dùng lại mật khẩu là THÔNG LỆ chứ không phải ngoại lệ. Nghĩa là một cú rò bảng người dùng của bạn không chỉ là vấn đề của người dùng với <em>sản phẩm của bạn</em> — nó là vấn đề của họ ở KHẮP NƠI. Nó cũng là cơ chế đứng sau việc nhồi tín vật (Chương 10): những cú tấn công BẠN nhận được chạy bằng cú rò của người khác, và cú rò do BẠN gây ra chạy cho cú tấn công của người khác.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">OWASP — Password Storage Cheat Sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · Thuật toán và tham số được khuyến nghị hiện hành</span></span></a>
<a class="link-card" href="https://hashcat.net/hashcat/" target="_blank" rel="noopener"><span class="lc-ico">⚡</span><span class="lc-body"><span class="lc-title">hashcat</span><span class="lc-sub">hashcat.net · Công cụ mà các con số bench ở trên tới từ đó; hãy chạy nó trên phần cứng của bạn</span></span></a>
<a class="link-card" href="https://www.ietf.org/rfc/rfc9106.html" target="_blank" rel="noopener"><span class="lc-ico">🧠</span><span class="lc-body"><span class="lc-title">RFC 9106 — Argon2</span><span class="lc-sub">ietf.org · "Cứng theo bộ nhớ" nghĩa là gì, và hướng dẫn chọn tham số</span></span></a>
<a class="link-card" href="https://haveibeenpwned.com/PwnedWebsites" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">Have I Been Pwned — các trang đã bị rò</span><span class="lc-sub">haveibeenpwned.com · Đọc vài mục và đếm xem bao nhiêu mục ghi "unsalted MD5"</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Bẻ một bảng chuỗi băm SHA-256 không muối, rồi thử lại đúng cú đó sau khi thêm muối và chi phí</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — Choosing and tuning the hash, by measurement|||2.2 — Chọn và chỉnh hàm băm, bằng phép đo',
      slug: 'auth-2-2-chon-va-chinh',
      type: 'LESSON',
      description: 'Ba ứng viên — Argon2id, bcrypt, scrypt — và cái nào đúng cho hoàn cảnh nào. Rồi tới phương pháp chọn tham số DUY NHẤT đáng tin: đặt một ngân sách độ trễ, ĐO trên chính phần cứng production của bạn, và lấy tham số cao nhất còn vừa. Kèm cái bẫy 72 byte của bcrypt và bài toán bộ nhớ × số request song song.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Choosing and tuning the hash, by measurement</h2>
<p class="lead">There are three defensible answers and one method. The answers are Argon2id, bcrypt and scrypt; the method is to fix a latency budget, measure on the hardware that will actually run this, and take the strongest parameters that fit. Copying parameters from a blog post is how a service ends up with <code>cost: 10</code> on a machine that could comfortably do 13.</p>

<h3>The three, and when each is right</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Argon2id — the default</span><span class="v">Winner of the 2015 Password Hashing Competition, standardised in RFC 9106. Tunable in <em>memory</em> as well as time, which is what actually blunts GPUs. The <code>id</code> variant resists both side channels and GPU cracking. Choose this unless something stops you.</span></div>
  <div class="kv"><span class="k">bcrypt — the safe old choice</span><span class="v">From 1999, still unbroken, available everywhere, and it has one tunable knob so it is hard to misconfigure. Its 4 KiB memory footprint is small by modern standards, but a well-tuned bcrypt is far better than a badly tuned Argon2.</span></div>
  <div class="kv"><span class="k">scrypt — built into Node</span><span class="v">Memory-hard, in <code>node:crypto</code>, so no native module to compile and nothing to break on a base-image change. A good answer when a native dependency is a real operational cost — which on Alpine it sometimes is.</span></div>
  <div class="kv"><span class="k">PBKDF2 — only if you must</span><span class="v">Not memory-hard, so GPUs help the attacker enormously. It exists in every standard library and is required by some compliance regimes. If you are choosing freely, do not choose this.</span></div>
</div>
<pre><code><span class="tok-comment">// The encoded output is self-describing — this is what makes upgrades possible</span>
$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$RdescudvJCsgt3ub+b+dWRWJTmaaJObG
 ^ thuật toán  ^ ver ^ tham số            ^ muối       ^ chuỗi băm

$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyPjHiw3sTJoiu
 ^ bcrypt ^cost ^ 22 ký tự muối + 31 ký tự băm</code></pre>
<div class="callout ok">
<p><strong>Never store the parameters in a separate column.</strong> The encoded string already contains the algorithm, the version, every cost parameter and the salt. That is not an accident of the format — it is what lets you raise the cost next year and still verify last year's hashes, and it is the entire mechanism behind the migration in Lesson 2.5. One <code>TEXT</code> column, nothing else.</p>
</div>

<h3>The method: budget, measure, choose</h3>
<pre><code><span class="tok-comment">// scripts/do-bam.ts — chạy trên MÁY SẼ CHẠY PRODUCTION</span>
import { hash } from '@node-rs/argon2';

const BUDGET_MS = 250;

for (const m of [19456, 32768, 65536, 131072]) {       <span class="tok-comment">// KiB</span>
  for (const t of [1, 2, 3]) {
    const t0 = process.hrtime.bigint();
    await hash('matkhauthu', { memoryCost: m, timeCost: t, parallelism: 1 });
    const ms = Number(process.hrtime.bigint() - t0) / 1e6;
    const dat = ms &lt;= BUDGET_MS ? '✅' : '❌';
    console.log(&#96;m=\${String(m).padStart(6)}KiB t=\${t} → \${ms.toFixed(0).padStart(4)} ms \${verdict}&#96;);
  }
}</code></pre>
<div class="out">m= 19456KiB t=1 →   28 ms ✅
m= 19456KiB t=2 →   54 ms ✅
m= 19456KiB t=3 →   81 ms ✅
m= 32768KiB t=1 →   47 ms ✅
m= 32768KiB t=2 →   92 ms ✅
m= 32768KiB t=3 →  138 ms ✅
m= 65536KiB t=1 →   94 ms ✅
m= 65536KiB t=2 →  187 ms ✅
m= 65536KiB t=3 →  279 ms ❌
m=131072KiB t=1 →  191 ms ✅
m=131072KiB t=2 →  381 ms ❌

→ Chon: m=65536 (64 MiB), t=2, p=1  →  187 ms</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Pick the budget first</span><span class="lz-d">200–300 ms is the usual range: unnoticeable inside a login request that already involves a network round trip, and expensive enough to matter multiplied by billions. Decide this before you look at any numbers, or you will rationalise whatever you measure.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Measure on production hardware</span><span class="lz-d">Your laptop is not the VPS. A shared 2-vCPU instance may be three times slower than a development machine, so parameters tuned locally can turn logins into two-second waits in production.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Prefer memory over time</span><span class="lz-d">Given a fixed budget, more memory hurts a GPU more than more iterations do. Raise <code>memoryCost</code> until you hit your RAM limit (below), then spend what is left on <code>timeCost</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Write the date next to it</span><span class="lz-d">Hardware gets faster. A comment saying <em>"measured 08/2026 on the 4-vCPU VPS, 187 ms"</em> tells the next person what to re-measure and when — and re-measuring annually is a five-minute job.</span></div>
</div>

<h3>The RAM trap: memory × concurrency</h3>
<pre><code><span class="tok-comment"># 64 MiB per hash sounds small. Multiply it.</span>
64 MiB × 100 lan dang nhap song song = 6.400 MiB = 6,4 GB</code></pre>
<div class="out">$ docker stats cuonghoangdev_backend
CONTAINER   MEM USAGE / LIMIT
backend     6.71GiB / 2GiB     ← OOM. Container bi giet.

# Mot cu nhoi tin vat khong can be duoc mat khau nao.
# No chi can gui du lan dang nhap SAI cung luc.</div>
<div class="pitfall">
<p><strong>Trap — a slow password hash on an unauthenticated endpoint is a denial-of-service amplifier.</strong> Each failed login costs the attacker one HTTP request and costs you 64 MiB and 187 ms of CPU. That is an enormous asymmetry in <em>their</em> favour, and it is the reverse of what you wanted. Three defences, all required: rate-limit login attempts per IP and per account (Chapter 11), cap concurrent hashing with a small queue, and size <code>memoryCost × maxConcurrent</code> to fit the container's memory limit with room to spare.</p>
</div>
<pre><code><span class="tok-comment">// Cap the concurrency explicitly rather than discovering the limit at 3am</span>
import { Secode } from 'async-sema';

const gate = new Sema(8);                     <span class="tok-comment">// 8 × 64 MiB = 512 MiB tối đa</span>

export async function hashPassword(pw: string) {
  await gate.acquire();
  try {
    return await hash(mk, { memoryCost: 65536, timeCost: 2, parallelism: 1 });
  } finally {
    gate.release();
  }
}</code></pre>

<h3>bcrypt's two traps</h3>
<pre><code><span class="tok-comment">// Trap 1: bcrypt silently truncates at 72 bytes</span>
const a = await bcrypt.hash('a'.repeat(72) + 'PHAN_NAY_BI_BO_QUA', 12);
await bcrypt.compare('a'.repeat(72), a);        <span class="tok-comment">// → true</span>
await bcrypt.compare('a'.repeat(72) + 'khac', a); <span class="tok-comment">// → true (!)</span></code></pre>
<div class="out">true
true

# Moi mat khau bat dau bang 72 byte giong nhau deu KHOP.
# Voi mot passphrase dai — hoac mot mat khau tieng Viet co dau,
# noi moi ky tu ton 3 byte UTF-8 — 24 ky tu la cham tran.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The 72-byte limit is bytes, not characters</span><span class="lz-lnote">"mật khẩu rất dài của tôi" is 24 characters and 33 bytes in UTF-8. A Vietnamese or Chinese passphrase reaches the limit roughly three times faster than an ASCII one, which makes this a real problem rather than a curiosity.</span></div>
  <div class="lz-layer"><span class="lz-lname">The usual workaround has its own trap</span><span class="lz-lnote">Pre-hashing with SHA-256 before bcrypt fixes the length, but a raw binary digest can contain a null byte, and some bcrypt implementations truncate there. If you pre-hash, base64-encode the digest first. Or use Argon2id, which has no length limit.</span></div>
  <div class="lz-layer"><span class="lz-lname">Trap 2: use the <code>$2b$</code> prefix</span><span class="lz-lnote"><code>$2a$</code> is the historical prefix and some old implementations of it mishandled high-bit characters. Any current library emits <code>$2b$</code>; if you see <code>$2a$</code> or <code>$2y$</code> in your database, they are still verifiable, and new hashes should be <code>$2b$</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Choose the native binding, not the pure-JS port</span><span class="lz-lnote"><code>bcryptjs</code> is roughly an order of magnitude slower than the native <code>bcrypt</code>, which sounds good and is not: to stay inside your latency budget you must lower the cost factor, and the cost factor is what the <em>attacker</em> pays. Slower for you, unchanged for them.</span></div>
</div>

<h3>The three, configured</h3>
<pre><code><span class="tok-comment">// Argon2id — dùng @node-rs/argon2 (Rust, prebuilt cho cả musl lẫn glibc)</span>
import { hash, verify } from '@node-rs/argon2';

const PARAMS = { memoryCost: 65536, timeCost: 2, parallelism: 1 };
<span class="tok-comment">// đo 08/2026 trên VPS 4 vCPU: 187 ms</span>

await hash(password, PARAMS);                  <span class="tok-comment">// muối tự sinh, tự nhúng</span>
await verify(bamDaLuu, password);               <span class="tok-comment">// tham số đọc từ chính chuỗi</span></code></pre>
<pre><code><span class="tok-comment">// bcrypt — một núm duy nhất, khó chỉnh sai</span>
import bcrypt from 'bcrypt';
await bcrypt.hash(password, 12);                <span class="tok-comment">// đo trước; 12 là mức sàn ngày nay</span>
await bcrypt.compare(password, bamDaLuu);</code></pre>
<pre><code><span class="tok-comment">// scrypt — có sẵn trong Node, không cần module native</span>
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const scryptAsync = promisify(scrypt);

const salt = randomBytes(16);
const bam = await scryptAsync(password, salt, 64, { N: 2 ** 15, r: 8, p: 1 });
<span class="tok-comment">// N=32768, r=8 → khoảng 32 MiB. Lưu 'scrypt$32768$8$1$muối$băm' để tự mô tả.</span></code></pre>
<div class="note-ct">
<p><strong>Do not hash the password in the browser.</strong> It sounds protective and it is not: whatever the client sends becomes the credential, so a client-side hash is just a password with extra steps — and an attacker with the database can replay the stored value directly. Send the password over TLS and hash it on the server. The one legitimate variant is a zero-knowledge protocol such as OPAQUE, where the server never sees the password at all; that is a real design with real trade-offs, and it is not "call sha256 in the front end".</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">OWASP — recommended parameters</span><span class="lc-sub">cheatsheetseries.owasp.org · Current minimums for Argon2id, bcrypt, scrypt and PBKDF2</span></span></a>
<a class="link-card" href="https://www.ietf.org/rfc/rfc9106.html#section-4" target="_blank" rel="noopener"><span class="lc-ico">🧠</span><span class="lc-body"><span class="lc-title">RFC 9106 §4 — parameter choice</span><span class="lc-sub">ietf.org · The specification's own guidance, including the memory-first rule</span></span></a>
<a class="link-card" href="https://github.com/napi-rs/node-rs/tree/main/packages/argon2" target="_blank" rel="noopener"><span class="lc-ico">🦀</span><span class="lc-body"><span class="lc-title">@node-rs/argon2</span><span class="lc-sub">github.com · Prebuilt binaries for musl and glibc — no compiler in your Docker build</span></span></a>
<a class="link-card" href="https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">Node.js — crypto.scrypt</span><span class="lc-sub">nodejs.org · Parameters, and the maxmem option that trips people up</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">CuongThai course — Docker</span><span class="lc-sub">Memory limits, and why a native module needs the right base image</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Tune Argon2id to a 250 ms budget, then OOM the container on purpose to see the concurrency limit</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Chọn và chỉnh hàm băm, bằng phép đo</h2>
<p class="lead">Có BA câu trả lời bảo vệ được và MỘT phương pháp. Câu trả lời là Argon2id, bcrypt và scrypt; phương pháp là chốt một ngân sách độ trễ, ĐO trên chính phần cứng sẽ chạy cái này, rồi lấy bộ tham số MẠNH NHẤT còn vừa. Chép tham số từ một bài blog chính là cách một dịch vụ đi tới chỗ đặt <code>cost: 10</code> trên một cái máy thừa sức chạy 13.</p>

<h3>Ba cái, và cái nào đúng cho hoàn cảnh nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Argon2id — mặc định</span><span class="v">Quán quân cuộc thi Password Hashing Competition 2015, chuẩn hoá trong RFC 9106. Chỉnh được cả <em>BỘ NHỚ</em> lẫn thời gian, và bộ nhớ mới là thứ THẬT SỰ làm cùn GPU. Biến thể <code>id</code> chống được cả kênh phụ lẫn việc bẻ bằng GPU. Hãy chọn cái này trừ khi có gì cản.</span></div>
  <div class="kv"><span class="k">bcrypt — lựa chọn cũ mà an toàn</span><span class="v">Từ 1999, tới nay chưa bị phá, có ở mọi nơi, và chỉ có MỘT núm để chỉnh nên khó mà cấu hình sai. Dấu chân bộ nhớ 4 KiB của nó là nhỏ theo chuẩn hiện nay, nhưng một bcrypt chỉnh tốt vẫn hơn hẳn một Argon2 chỉnh tồi.</span></div>
  <div class="kv"><span class="k">scrypt — có sẵn trong Node</span><span class="v">Cứng theo bộ nhớ, nằm trong <code>node:crypto</code>, nên không có module native nào phải biên dịch và không có gì để hỏng khi đổi ảnh nền. Một câu trả lời tốt khi một gói phụ thuộc native là một chi phí vận hành có thật — mà trên Alpine thì đôi khi đúng là vậy.</span></div>
  <div class="kv"><span class="k">PBKDF2 — chỉ khi buộc phải</span><span class="v">Không cứng theo bộ nhớ, nên GPU giúp kẻ tấn công cực nhiều. Nó có trong mọi thư viện chuẩn và bị một số quy định tuân thủ bắt buộc. Nếu bạn được TỰ DO chọn thì đừng chọn cái này.</span></div>
</div>
<pre><code><span class="tok-comment">// Chuỗi đầu ra TỰ MÔ TẢ — chính điều này làm cho việc nâng cấp khả thi</span>
$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$RdescudvJCsgt3ub+b+dWRWJTmaaJObG
 ^ thuật toán  ^ ver ^ tham số            ^ muối       ^ chuỗi băm

$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyPjHiw3sTJoiu
 ^ bcrypt ^cost ^ 22 ký tự muối + 31 ký tự băm</code></pre>
<div class="callout ok">
<p><strong>ĐỪNG BAO GIỜ cất tham số vào một cột riêng.</strong> Chuỗi đã mã hoá VỐN ĐÃ chứa thuật toán, phiên bản, mọi tham số chi phí và cái muối. Đó không phải ngẫu nhiên của định dạng — đó chính là thứ cho phép bạn nâng chi phí vào năm sau mà vẫn xác minh được những chuỗi băm của năm trước, và là toàn bộ cơ chế đằng sau việc chuyển đổi ở Bài 2.5. MỘT cột <code>TEXT</code>, không gì khác.</p>
</div>

<h3>Phương pháp: ngân sách, đo, chọn</h3>
<pre><code><span class="tok-comment">// scripts/do-bam.ts — chạy trên MÁY SẼ CHẠY PRODUCTION</span>
import { hash } from '@node-rs/argon2';

const BUDGET_MS = 250;

for (const m of [19456, 32768, 65536, 131072]) {       <span class="tok-comment">// KiB</span>
  for (const t of [1, 2, 3]) {
    const t0 = process.hrtime.bigint();
    await hash('matkhauthu', { memoryCost: m, timeCost: t, parallelism: 1 });
    const ms = Number(process.hrtime.bigint() - t0) / 1e6;
    const dat = ms &lt;= BUDGET_MS ? '✅' : '❌';
    console.log(&#96;m=\${String(m).padStart(6)}KiB t=\${t} → \${ms.toFixed(0).padStart(4)} ms \${verdict}&#96;);
  }
}</code></pre>
<div class="out">m= 19456KiB t=1 →   28 ms ✅
m= 19456KiB t=2 →   54 ms ✅
m= 19456KiB t=3 →   81 ms ✅
m= 32768KiB t=1 →   47 ms ✅
m= 32768KiB t=2 →   92 ms ✅
m= 32768KiB t=3 →  138 ms ✅
m= 65536KiB t=1 →   94 ms ✅
m= 65536KiB t=2 →  187 ms ✅
m= 65536KiB t=3 →  279 ms ❌
m=131072KiB t=1 →  191 ms ✅
m=131072KiB t=2 →  381 ms ❌

→ Chon: m=65536 (64 MiB), t=2, p=1  →  187 ms</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Chốt ngân sách TRƯỚC</span><span class="lz-d">200–300 ms là khoảng thường dùng: không cảm nhận nổi bên trong một request đăng nhập vốn đã có một vòng đi về qua mạng, và đủ đắt để có ý nghĩa khi nhân với hàng tỉ. Hãy quyết cái này TRƯỚC khi nhìn bất kỳ con số nào, nếu không bạn sẽ tự hợp lý hoá cho bất cứ thứ gì đo được.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Đo trên phần cứng PRODUCTION</span><span class="lz-d">Laptop của bạn không phải cái VPS. Một instance 2 vCPU dùng chung có thể chậm gấp ba máy phát triển, nên tham số chỉnh ở máy có thể biến việc đăng nhập thành hai giây chờ trên production.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Ưu tiên BỘ NHỚ hơn thời gian</span><span class="lz-d">Với cùng một ngân sách, thêm bộ nhớ làm đau GPU nhiều hơn thêm vòng lặp. Hãy nâng <code>memoryCost</code> tới khi chạm trần RAM (xem dưới), rồi dồn phần còn lại vào <code>timeCost</code>.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Ghi NGÀY ĐO ngay cạnh</span><span class="lz-d">Phần cứng nhanh dần lên. Một dòng chú thích ghi <em>"đo 08/2026 trên VPS 4 vCPU, 187 ms"</em> nói cho người sau biết phải đo lại cái gì và khi nào — và đo lại mỗi năm một lần là việc năm phút.</span></div>
</div>

<h3>Cái bẫy RAM: bộ nhớ × số request song song</h3>
<pre><code><span class="tok-comment"># 64 MiB mỗi lần băm nghe có vẻ nhỏ. Nhân nó lên.</span>
64 MiB × 100 lan dang nhap song song = 6.400 MiB = 6,4 GB</code></pre>
<div class="out">$ docker stats cuonghoangdev_backend
CONTAINER   MEM USAGE / LIMIT
backend     6.71GiB / 2GiB     ← OOM. Container bi giet.

# Mot cu nhoi tin vat khong can be duoc mat khau nao.
# No chi can gui du lan dang nhap SAI cung luc.</div>
<div class="pitfall">
<p><strong>Bẫy — một hàm băm mật khẩu chậm đặt trên một endpoint KHÔNG cần xác thực là một bộ KHUẾCH ĐẠI tấn công từ chối dịch vụ.</strong> Mỗi lần đăng nhập trượt tốn của kẻ tấn công MỘT request HTTP và tốn của bạn 64 MiB cộng 187 ms CPU. Đó là một cú bất đối xứng khổng lồ nghiêng về <em>PHÍA HỌ</em>, tức là ngược hẳn thứ bạn muốn. Ba lớp phòng, cần cả ba: giới hạn tốc độ đăng nhập theo IP và theo tài khoản (Chương 11), CHẶN số lần băm song song bằng một hàng đợi nhỏ, và tính <code>memoryCost × số_song_song_tối_đa</code> sao cho vừa trong giới hạn bộ nhớ của container còn dư chỗ thở.</p>
</div>
<pre><code><span class="tok-comment">// Chặn số song song TƯỜNG MINH, thay vì phát hiện ra giới hạn lúc 3 giờ sáng</span>
import { Secode } from 'async-sema';

const gate = new Sema(8);                     <span class="tok-comment">// 8 × 64 MiB = 512 MiB tối đa</span>

export async function hashPassword(pw: string) {
  await gate.acquire();
  try {
    return await hash(mk, { memoryCost: 65536, timeCost: 2, parallelism: 1 });
  } finally {
    gate.release();
  }
}</code></pre>

<h3>Hai cái bẫy của bcrypt</h3>
<pre><code><span class="tok-comment">// Bẫy 1: bcrypt LẶNG LẼ cắt cụt ở 72 byte</span>
const a = await bcrypt.hash('a'.repeat(72) + 'PHAN_NAY_BI_BO_QUA', 12);
await bcrypt.compare('a'.repeat(72), a);        <span class="tok-comment">// → true</span>
await bcrypt.compare('a'.repeat(72) + 'khac', a); <span class="tok-comment">// → true (!)</span></code></pre>
<div class="out">true
true

# Moi mat khau bat dau bang 72 byte giong nhau deu KHOP.
# Voi mot passphrase dai — hoac mot mat khau tieng Viet co dau,
# noi moi ky tu ton 3 byte UTF-8 — 24 ky tu la cham tran.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Giới hạn 72 là BYTE, không phải KÝ TỰ</span><span class="lz-lnote">"mật khẩu rất dài của tôi" là 24 ký tự và 33 byte ở UTF-8. Một passphrase tiếng Việt hay tiếng Trung chạm trần nhanh gấp khoảng ba lần so với tiếng Anh thuần ASCII, và điều đó biến đây thành một vấn đề THẬT chứ không phải chuyện lạ vui.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cách chữa thông thường lại có bẫy riêng</span><span class="lz-lnote">Băm trước bằng SHA-256 rồi mới đưa vào bcrypt thì cố định được độ dài, nhưng một chuỗi băm nhị phân thô có thể chứa byte null, và một số bản cài đặt bcrypt cắt cụt ngay tại đó. Nếu bạn băm trước, hãy mã hoá base64 cái chuỗi băm ấy trước đã. Hoặc dùng Argon2id, thứ không có giới hạn độ dài nào.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bẫy 2: dùng tiền tố <code>$2b$</code></span><span class="lz-lnote"><code>$2a$</code> là tiền tố lịch sử và vài bản cài đặt cũ của nó xử lý sai ký tự có bit cao. Mọi thư viện hiện hành đều sinh ra <code>$2b$</code>; nếu bạn thấy <code>$2a$</code> hay <code>$2y$</code> trong cơ sở dữ liệu thì chúng vẫn xác minh được, còn hàng băm MỚI thì nên là <code>$2b$</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy chọn bản native, đừng chọn bản JS thuần</span><span class="lz-lnote"><code>bcryptjs</code> chậm hơn bản <code>bcrypt</code> native cỡ một bậc độ lớn, nghe thì hay mà không phải: để nằm trong ngân sách độ trễ, bạn buộc phải HẠ tham số cost xuống, và cost mới là thứ <em>KẺ TẤN CÔNG</em> phải trả. Chậm hơn cho bạn, không đổi gì cho họ.</span></div>
</div>

<h3>Ba cái, đã cấu hình</h3>
<pre><code><span class="tok-comment">// Argon2id — dùng @node-rs/argon2 (Rust, prebuilt cho cả musl lẫn glibc)</span>
import { hash, verify } from '@node-rs/argon2';

const PARAMS = { memoryCost: 65536, timeCost: 2, parallelism: 1 };
<span class="tok-comment">// đo 08/2026 trên VPS 4 vCPU: 187 ms</span>

await hash(password, PARAMS);                  <span class="tok-comment">// muối tự sinh, tự nhúng</span>
await verify(bamDaLuu, password);               <span class="tok-comment">// tham số đọc từ chính chuỗi</span></code></pre>
<pre><code><span class="tok-comment">// bcrypt — một núm duy nhất, khó chỉnh sai</span>
import bcrypt from 'bcrypt';
await bcrypt.hash(password, 12);                <span class="tok-comment">// đo trước; 12 là mức sàn ngày nay</span>
await bcrypt.compare(password, bamDaLuu);</code></pre>
<pre><code><span class="tok-comment">// scrypt — có sẵn trong Node, không cần module native</span>
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const scryptAsync = promisify(scrypt);

const salt = randomBytes(16);
const bam = await scryptAsync(password, salt, 64, { N: 2 ** 15, r: 8, p: 1 });
<span class="tok-comment">// N=32768, r=8 → khoảng 32 MiB. Lưu 'scrypt$32768$8$1$muối$băm' để tự mô tả.</span></code></pre>
<div class="note-ct">
<p><strong>ĐỪNG băm mật khẩu ở trình duyệt.</strong> Nghe có vẻ bảo vệ nhưng không: bất cứ thứ gì client GỬI LÊN đều trở thành TÍN VẬT, nên một chuỗi băm phía client chỉ là một cái mật khẩu với vài bước thừa — và kẻ tấn công có cơ sở dữ liệu thì phát lại thẳng giá trị đã lưu. Hãy gửi mật khẩu qua TLS rồi băm ở MÁY CHỦ. Biến thể chính đáng duy nhất là một giao thức không-tiết-lộ như OPAQUE, nơi máy chủ không bao giờ nhìn thấy mật khẩu; đó là một thiết kế THẬT với những đánh đổi THẬT, và nó không phải chuyện "gọi sha256 ở front end".</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id" target="_blank" rel="noopener"><span class="lc-ico">⚙️</span><span class="lc-body"><span class="lc-title">OWASP — tham số khuyến nghị</span><span class="lc-sub">cheatsheetseries.owasp.org · Mức tối thiểu hiện hành cho Argon2id, bcrypt, scrypt và PBKDF2</span></span></a>
<a class="link-card" href="https://www.ietf.org/rfc/rfc9106.html#section-4" target="_blank" rel="noopener"><span class="lc-ico">🧠</span><span class="lc-body"><span class="lc-title">RFC 9106 §4 — chọn tham số</span><span class="lc-sub">ietf.org · Hướng dẫn của chính đặc tả, kèm luật ưu tiên bộ nhớ trước</span></span></a>
<a class="link-card" href="https://github.com/napi-rs/node-rs/tree/main/packages/argon2" target="_blank" rel="noopener"><span class="lc-ico">🦀</span><span class="lc-body"><span class="lc-title">@node-rs/argon2</span><span class="lc-sub">github.com · Có sẵn bản dựng cho musl và glibc — không cần trình biên dịch trong bản dựng Docker</span></span></a>
<a class="link-card" href="https://nodejs.org/api/crypto.html#cryptoscryptpassword-salt-keylen-options-callback" target="_blank" rel="noopener"><span class="lc-ico">📦</span><span class="lc-body"><span class="lc-title">Node.js — crypto.scrypt</span><span class="lc-sub">nodejs.org · Tham số, và tuỳ chọn maxmem hay làm người ta vấp</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Docker</span><span class="lc-sub">Giới hạn bộ nhớ, và vì sao một module native cần đúng ảnh nền</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Chỉnh Argon2id vào ngân sách 250 ms, rồi cố ý làm OOM container để thấy giới hạn song song</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — The login flow, with every branch equal|||2.3 — Luồng đăng nhập, với mọi nhánh bằng nhau',
      slug: 'auth-2-3-luong-dang-nhap',
      type: 'LESSON',
      description: 'Viết lại phần mật khẩu của Bài 0.3 cho đúng: một thông báo lỗi duy nhất, băm giả trên nhánh không-tìm-thấy để hai nhánh tốn thời gian như nhau, băm lại khi tham số đã nâng, chuẩn hoá Unicode, và TIÊU — cái bí mật cất ngoài cơ sở dữ liệu, kèm phần nói thẳng nó mua được gì và tốn gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>The login flow, with every branch equal</h2>
<p class="lead">The hash is chosen and tuned. What remains is the flow around it, and the flow is where the remaining leaks are: an error message that says which half failed, a fast path that says the same thing without words, and a hash that quietly stays at last year's cost forever because nobody wrote the upgrade.</p>

<h3>Both branches must cost the same</h3>
<pre><code><span class="tok-comment">// ❌ Lesson 0.3's version, measured</span>
const u = await prisma.user.findUnique({ where: { email } });
if (!u) return res.status(401).json({ error: 'Email khong ton tai' });
if (!(await verify(u.bam, password))) return res.status(401).json({ error: 'Sai mat khau' });</code></pre>
<div class="out">$ for i in $(seq 200); do curl -s -o /dev/null -w "%{time_total}\\n" \\
    localhost:3000/dang-nhap -d '{"email":"co-that@vidu.com","password":"x"}' \\
    -H 'content-type: application/json'; done | sort -n | awk 'NR==100'
0.194

$ … -d '{"email":"khong-co@vidu.com","password":"x"}' …
0.006

# 194 ms doi lai 6 ms. Ban khong can doc thong bao loi:
# chi rieng thoi gian da noi ro tai khoan do co ton tai hay khong.</div>
<pre><code><span class="tok-comment">// ✅ Hash something even when the user does not exist</span>
import { hash, verify } from '@node-rs/argon2';
import { PARAMS } from './cau-hinh.js';

<span class="tok-comment">// Sinh một lần lúc khởi động, từ một mật khẩu không ai có.</span>
const FAKE_HASH = await hash(randomBytes(32).toString('base64url'), PARAMS);

export async function signIn(email: string, password: string) {
  const u = await prisma.user.findUnique({ where: { email } });

  <span class="tok-comment">// Cùng một phép băm ở CẢ HAI nhánh — chỉ khác cái nó so với.</span>
  const dung = await verify(u?.bam ?? FAKE_HASH, password).catch(() =&gt; false);

  if (!u || !dung) {
    throw new HttpError(401, 'Email hoac mat ksuffix khong dung');
  }
  return u;
}</code></pre>
<div class="out">$ … co-that@vidu.com  → 0.191
$ … khong-co@vidu.com → 0.189

# Chenh 2 ms, nam trong nhieu cua mang. Khong con tin hieu nao.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">One message</span><span class="lz-t">"Email hoặc mật khẩu không đúng"</span><span class="lz-d">Not two. The user who mistyped their email is mildly inconvenienced; the attacker with a million leaked addresses learns nothing. That trade is correct, and every major service makes it.</span></div>
  <div class="lz-step"><span class="lz-k">One duration</span><span class="lz-t">The dummy hash</span><span class="lz-d">Verifying against a fixed known-bad hash costs exactly what verifying a real one costs, because the parameters are the same. The <code>catch(() =&gt; false)</code> matters: a malformed stored hash must fail like a wrong password, not throw a 500.</span></div>
  <div class="lz-step"><span class="lz-k">One status code</span><span class="lz-t">401, always</span><span class="lz-d">Not 404 for an unknown email. A different status is the same leak in a different field, and it survives every attempt to equalise the body and the timing.</span></div>
  <div class="lz-step"><span class="lz-k">Registration leaks too</span><span class="lz-t">And it is harder</span><span class="lz-d">"This email is already registered" is the same oracle from the other side. Chapter 6 handles it properly — by sending an email either way and never telling the browser which case occurred.</span></div>
</div>

<h3>Rehash on successful login</h3>
<pre><code><span class="tok-comment">// Parameters were raised in June. Old rows still carry June's cost.</span>
<span class="tok-comment">// The only moment you hold the plaintext is a successful login.</span>

const u = await signIn(email, password);

if (needsRehash(u.bam)) {
  const newHash = await hash(password, PARAMS);
  await prisma.user.update({ where: { id: u.id }, data: { bam: newHash } });
}</code></pre>
<pre><code><span class="tok-comment">// The check reads the parameters out of the stored string itself</span>
export function needsRehash(oldHash: string): boolean {
  const m = /^\\$argon2id\\$v=(\\d+)\\$m=(\\d+),t=(\\d+),p=(\\d+)/.exec(oldHash);
  if (!m) return true;                                   <span class="tok-comment">// bcrypt cũ, hoặc lạ → nâng</span>
  const [, , mem, t, p] = m.map(Number);
  return mem &lt; PARAMS.memoryCost
      || t   &lt; PARAMS.timeCost
      || p   !== PARAMS.parallelism;
}</code></pre>
<div class="out">$ node -e "console.log(needsRehash('\$argon2id\$v=19\$m=19456,t=2,p=1\$…'))"
true      ← m=19456 < 65536, nang len

$ node -e "console.log(needsRehash('\$argon2id\$v=19\$m=65536,t=2,p=1\$…'))"
false     ← da dung tham so hien tai</div>
<div class="callout ok">
<p><strong>This is the whole upgrade mechanism, and it costs four lines.</strong> Raise the parameters in one config object; every user is silently migrated the next time they log in. No mass reset, no downtime, no migration script. Lesson 2.5 uses exactly the same hook to move an entire table off bcrypt or off unsalted MD5 — the only difference is what <code>needsRehash</code> returns true for.</p>
</div>

<h3>Normalise, but do not mangle</h3>
<pre><code><span class="tok-comment">// The same password, typed on two keyboards, is two different byte strings</span>
'mật'.normalize('NFC').length   <span class="tok-comment">// 3 — ậ là MỘT điểm mã</span>
'mật'.normalize('NFD').length   <span class="tok-comment">// 5 — a + dấu mũ + dấu nặng</span>

Buffer.from('mật', 'utf8').length                    <span class="tok-comment">// 5 byte (NFC)</span>
Buffer.from('mật'.normalize('NFD'), 'utf8').length   <span class="tok-comment">// 8 byte (NFD)</span></code></pre>
<div class="out"># macOS thuong dua NFD, Windows va Android thuong dua NFC.
# Cung mot nguoi, cung mot mat khau, hai thiet bi → hai chuoi byte.
# Khong chuan hoa: dang nhap duoc tren may nay, truot tren may kia.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Normalise with NFKC, on both paths</span><span class="v"><code>password.normalize('NFKC')</code> before hashing and before verifying. NIST SP 800-63B recommends it explicitly. Apply it in one helper so the two call sites cannot drift apart.</span></div>
  <div class="kv"><span class="k">Do not trim</span><span class="v">A space is a legal password character, and trimming silently changes what the user chose. The exception worth knowing: mobile keyboards sometimes append a space after autocomplete — handle that in the client, not by mutating the password server-side.</span></div>
  <div class="kv"><span class="k">Do not truncate, and do not filter characters</span><span class="v">Accept everything printable including emoji. A maximum length is fine for denial-of-service reasons — 128 or 256 characters — but rejecting <code>;</code> or <code>'</code> "for security" is a sign the password is being concatenated into SQL somewhere, which is the actual bug.</span></div>
  <div class="kv"><span class="k">Do not lowercase</span><span class="v">It sounds like a usability improvement and it removes about a third of the entropy of a typical password. Emails are case-insensitive; passwords are not.</span></div>
</div>

<h3>The pepper: one secret outside the database</h3>
<pre><code><span class="tok-comment">// HMAC the password with an application secret BEFORE hashing it</span>
const PEPPER = Buffer.from(process.env.PASSWORD_PEPPER!, 'base64');  <span class="tok-comment">// 32 byte</span>

const prepare = (pw: string) =&gt;
  createHmac('sha256', PEPPER).update(mk.normalize('NFKC')).digest('base64');

await hash(prepare(password), PARAMS);       <span class="tok-comment">// lưu như bình thường</span>
await verify(u.bam, prepare(password));</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">What it buys: a database-only leak becomes useless</span><span class="lz-lnote">The attacker who dumps the user table cannot start cracking at all without the pepper, because every candidate must be HMAC'd with a 256-bit key they do not have. Given how many breaches are backup-shaped rather than server-shaped, this is a meaningful boundary.</span></div>
  <div class="lz-layer"><span class="lz-lname">What it does not buy: protection from a full compromise</span><span class="lz-lnote">If the attacker has code execution on the application server, they have the environment variable too. The pepper separates "database leaked" from "server compromised" — which are genuinely different events, but do not mistake it for a second password hash.</span></div>
  <div class="lz-layer"><span class="lz-lname">The cost: rotation is genuinely hard</span><span class="lz-lnote">Changing the pepper invalidates every stored hash, because you cannot re-derive them without the plaintexts. The workable pattern is versioning — store <code>v2$…</code>, keep the old pepper for verification, and re-pepper on successful login exactly as <code>needsRehash</code> does. Design that in from the start or accept that the pepper is permanent.</span></div>
  <div class="lz-layer"><span class="lz-lname">Use HMAC, not concatenation</span><span class="lz-lnote"><code>sha256(TIEU + password)</code> is Lesson 1.4's length-extension mistake again. And HMAC before the slow hash, not after: the slow hash must be the last step so its cost still applies to every guess.</span></div>
  <div class="lz-layer"><span class="lz-lname">Is it worth it?</span><span class="lz-lnote">If you have a secret manager and a rotation story, yes — it is cheap. If the pepper would live in the same <code>.env</code> that also holds <code>DATABASE_URL</code>, on the same box, then any leak of one leaks the other and you have added complexity for very little. Be honest about which situation you are in.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — a password change must invalidate other sessions, and almost no first implementation does.</strong> If someone changed their password because they believe an attacker knows the old one, and the attacker's session keeps working, the change accomplished nothing. Require the current password, then delete every session for that user except the current one. Chapter 5 builds the mechanism; the requirement belongs here, next to the password.</p>
</div>
<div class="note-ct">
<p><strong>The complete password checklist, for the code review.</strong> One error message and one duration for both failure branches · Argon2id (or a measured bcrypt) with parameters chosen on production hardware and dated in a comment · rehash on successful login when the parameters have moved · NFKC normalisation applied identically on both paths · no trimming, no truncation, no character filtering, no lowercasing · rate limiting in front of the endpoint (Chapter 11) · the password never reaching a log, an error object or an analytics event · and a password change that revokes every other session.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://pages.nist.gov/800-63-3/sp800-63b.html#memsecret" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">NIST SP 800-63B §5.1.1 — memorised secrets</span><span class="lc-sub">pages.nist.gov · Normalisation, length limits and what verifiers must accept</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-and-error-messages" target="_blank" rel="noopener"><span class="lc-ico">💬</span><span class="lc-body"><span class="lc-title">OWASP — authentication error messages</span><span class="lc-sub">cheatsheetseries.owasp.org · The generic-message rule, and the timing corollary</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#peppering" target="_blank" rel="noopener"><span class="lc-ico">🌶️</span><span class="lc-body"><span class="lc-title">OWASP — peppering</span><span class="lc-sub">cheatsheetseries.owasp.org · The HMAC-before-hash construction and the rotation problem</span></span></a>
<a class="link-card" href="https://unicode.org/reports/tr15/" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">Unicode — normalisation forms</span><span class="lc-sub">unicode.org · NFC, NFD, NFKC and NFKD, and which one to use for credentials</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Enumerate users through timing alone, then close the channel and re-run the same script</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Luồng đăng nhập, với mọi nhánh bằng nhau</h2>
<p class="lead">Hàm băm đã chọn và đã chỉnh. Thứ còn lại là cái LUỒNG bao quanh nó, và luồng chính là chỗ những rò rỉ còn sót nằm: một thông báo lỗi nói ra nửa nào trượt, một đường đi NHANH nói đúng điều đó mà không cần chữ, và một chuỗi băm lặng lẽ nằm mãi ở mức chi phí của năm ngoái vì không ai viết phần nâng cấp.</p>

<h3>Cả hai nhánh phải tốn NHƯ NHAU</h3>
<pre><code><span class="tok-comment">// ❌ Bản của Bài 0.3, đem đo</span>
const u = await prisma.user.findUnique({ where: { email } });
if (!u) return res.status(401).json({ error: 'Email khong ton tai' });
if (!(await verify(u.bam, password))) return res.status(401).json({ error: 'Sai mat khau' });</code></pre>
<div class="out">$ for i in $(seq 200); do curl -s -o /dev/null -w "%{time_total}\\n" \\
    localhost:3000/dang-nhap -d '{"email":"co-that@vidu.com","password":"x"}' \\
    -H 'content-type: application/json'; done | sort -n | awk 'NR==100'
0.194

$ … -d '{"email":"khong-co@vidu.com","password":"x"}' …
0.006

# 194 ms doi lai 6 ms. Ban khong can doc thong bao loi:
# chi rieng thoi gian da noi ro tai khoan do co ton tai hay khong.</div>
<pre><code><span class="tok-comment">// ✅ Băm một cái gì đó NGAY CẢ khi người dùng không tồn tại</span>
import { hash, verify } from '@node-rs/argon2';
import { PARAMS } from './cau-hinh.js';

<span class="tok-comment">// Sinh một lần lúc khởi động, từ một mật khẩu không ai có.</span>
const FAKE_HASH = await hash(randomBytes(32).toString('base64url'), PARAMS);

export async function signIn(email: string, password: string) {
  const u = await prisma.user.findUnique({ where: { email } });

  <span class="tok-comment">// Cùng một phép băm ở CẢ HAI nhánh — chỉ khác cái nó so với.</span>
  const dung = await verify(u?.bam ?? FAKE_HASH, password).catch(() =&gt; false);

  if (!u || !dung) {
    throw new HttpError(401, 'Email hoac mat ksuffix khong dung');
  }
  return u;
}</code></pre>
<div class="out">$ … co-that@vidu.com  → 0.191
$ … khong-co@vidu.com → 0.189

# Chenh 2 ms, nam trong nhieu cua mang. Khong con tin hieu nao.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">MỘT thông báo</span><span class="lz-t">"Email hoặc mật khẩu không đúng"</span><span class="lz-d">Không phải hai. Người dùng gõ nhầm email thì hơi bất tiện một chút; kẻ tấn công cầm một triệu địa chỉ rò rỉ thì KHÔNG học được gì. Đánh đổi đó là đúng, và mọi dịch vụ lớn đều chọn như vậy.</span></div>
  <div class="lz-step"><span class="lz-k">MỘT khoảng thời gian</span><span class="lz-t">Cái băm giả</span><span class="lz-d">Xác minh với một chuỗi băm cố định biết chắc là sai tốn ĐÚNG bằng xác minh một chuỗi thật, vì tham số y hệt nhau. Cái <code>catch(() =&gt; false)</code> có ý nghĩa: một chuỗi băm hỏng định dạng trong kho phải TRƯỢT như một mật khẩu sai, chứ không được ném ra lỗi 500.</span></div>
  <div class="lz-step"><span class="lz-k">MỘT mã trạng thái</span><span class="lz-t">401, luôn luôn</span><span class="lz-d">Không dùng 404 cho một email không tồn tại. Một mã trạng thái khác là ĐÚNG chỗ rò đó ở một trường khác, và nó sống sót qua mọi nỗ lực làm cho phần thân và thời gian bằng nhau.</span></div>
  <div class="lz-step"><span class="lz-k">Đăng KÝ cũng rò</span><span class="lz-t">Và khó hơn</span><span class="lz-d">"Email này đã được đăng ký" là ĐÚNG cỗ máy tra cứu đó nhìn từ phía bên kia. Chương 6 xử lý nó cho đàng hoàng — bằng cách gửi email trong CẢ HAI trường hợp và không bao giờ nói cho trình duyệt biết là trường hợp nào.</span></div>
</div>

<h3>Băm lại khi đăng nhập thành công</h3>
<pre><code><span class="tok-comment">// Tham số đã nâng hồi tháng Sáu. Những hàng cũ vẫn mang chi phí tháng Sáu.</span>
<span class="tok-comment">// Khoảnh khắc DUY NHẤT bạn cầm được bản rõ là một lần đăng nhập THÀNH CÔNG.</span>

const u = await signIn(email, password);

if (needsRehash(u.bam)) {
  const newHash = await hash(password, PARAMS);
  await prisma.user.update({ where: { id: u.id }, data: { bam: newHash } });
}</code></pre>
<pre><code><span class="tok-comment">// Phép kiểm đọc tham số ra TỪ CHÍNH chuỗi đã lưu</span>
export function needsRehash(oldHash: string): boolean {
  const m = /^\\$argon2id\\$v=(\\d+)\\$m=(\\d+),t=(\\d+),p=(\\d+)/.exec(oldHash);
  if (!m) return true;                                   <span class="tok-comment">// bcrypt cũ, hoặc lạ → nâng</span>
  const [, , mem, t, p] = m.map(Number);
  return mem &lt; PARAMS.memoryCost
      || t   &lt; PARAMS.timeCost
      || p   !== PARAMS.parallelism;
}</code></pre>
<div class="out">$ node -e "console.log(needsRehash('\$argon2id\$v=19\$m=19456,t=2,p=1\$…'))"
true      ← m=19456 < 65536, nang len

$ node -e "console.log(needsRehash('\$argon2id\$v=19\$m=65536,t=2,p=1\$…'))"
false     ← da dung tham so hien tai</div>
<div class="callout ok">
<p><strong>Đây là TOÀN BỘ cơ chế nâng cấp, và nó tốn bốn dòng.</strong> Nâng tham số trong MỘT đối tượng cấu hình; mọi người dùng được chuyển đổi lặng lẽ ở lần đăng nhập kế tiếp. Không đặt lại hàng loạt, không ngừng dịch vụ, không script chuyển đổi. Bài 2.5 dùng ĐÚNG cái móc này để đưa cả một bảng rời khỏi bcrypt hoặc rời khỏi MD5 không muối — khác biệt duy nhất là <code>needsRehash</code> trả true cho những gì.</p>
</div>

<h3>Chuẩn hoá, nhưng đừng cắt xén</h3>
<pre><code><span class="tok-comment">// Cùng một mật khẩu, gõ trên hai bàn phím, là hai chuỗi byte khác nhau</span>
'mật'.normalize('NFC').length   <span class="tok-comment">// 3 — ậ là MỘT điểm mã</span>
'mật'.normalize('NFD').length   <span class="tok-comment">// 5 — a + dấu mũ + dấu nặng</span>

Buffer.from('mật', 'utf8').length                    <span class="tok-comment">// 5 byte (NFC)</span>
Buffer.from('mật'.normalize('NFD'), 'utf8').length   <span class="tok-comment">// 8 byte (NFD)</span></code></pre>
<div class="out"># macOS thuong dua NFD, Windows va Android thuong dua NFC.
# Cung mot nguoi, cung mot mat khau, hai thiet bi → hai chuoi byte.
# Khong chuan hoa: dang nhap duoc tren may nay, truot tren may kia.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Chuẩn hoá bằng NFKC, ở CẢ HAI đường</span><span class="v"><code>password.normalize('NFKC')</code> trước khi băm và trước khi xác minh. NIST SP 800-63B khuyến nghị điều này một cách tường minh. Hãy áp nó trong MỘT hàm phụ để hai chỗ gọi không thể trôi dạt khỏi nhau.</span></div>
  <div class="kv"><span class="k">ĐỪNG cắt khoảng trắng hai đầu</span><span class="v">Dấu cách là một ký tự mật khẩu HỢP LỆ, và cắt nó đi là lặng lẽ đổi thứ người dùng đã chọn. Ngoại lệ đáng biết: bàn phím di động đôi khi tự thêm một dấu cách sau khi tự hoàn thành — hãy xử lý chuyện đó ở phía client, đừng biến đổi mật khẩu ở máy chủ.</span></div>
  <div class="kv"><span class="k">ĐỪNG cắt cụt, và đừng lọc ký tự</span><span class="v">Hãy nhận mọi ký tự in được, kể cả emoji. Một giới hạn độ dài tối đa thì ổn vì lý do chống từ chối dịch vụ — 128 hoặc 256 ký tự — nhưng từ chối dấu <code>;</code> hay <code>'</code> "vì lý do bảo mật" là dấu hiệu mật khẩu đang bị nối vào SQL ở đâu đó, và ĐÓ mới là con bug thật.</span></div>
  <div class="kv"><span class="k">ĐỪNG hạ về chữ thường</span><span class="v">Nghe như một cải thiện trải nghiệm và nó xoá đi chừng một phần ba entropy của một mật khẩu điển hình. Email thì không phân biệt hoa thường; mật khẩu thì CÓ.</span></div>
</div>

<h3>TIÊU: một bí mật nằm NGOÀI cơ sở dữ liệu</h3>
<pre><code><span class="tok-comment">// HMAC mật khẩu với một bí mật cấp ứng dụng TRƯỚC khi băm nó</span>
const PEPPER = Buffer.from(process.env.PASSWORD_PEPPER!, 'base64');  <span class="tok-comment">// 32 byte</span>

const prepare = (pw: string) =&gt;
  createHmac('sha256', PEPPER).update(mk.normalize('NFKC')).digest('base64');

await hash(prepare(password), PARAMS);       <span class="tok-comment">// lưu như bình thường</span>
await verify(u.bam, prepare(password));</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Nó mua được gì: một cú rò CHỈ cơ sở dữ liệu trở nên vô dụng</span><span class="lz-lnote">Kẻ tấn công dump được bảng người dùng KHÔNG bắt đầu bẻ được chút nào nếu không có tiêu, vì mọi ứng viên đều phải đi qua HMAC với một khoá 256 bit mà họ không có. Xét việc bao nhiêu vụ rò có hình dạng "bản sao lưu" thay vì "máy chủ bị chiếm", đây là một ranh giới có ý nghĩa.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nó KHÔNG mua được gì: bảo vệ trước một cú chiếm toàn phần</span><span class="lz-lnote">Nếu kẻ tấn công chạy được mã trên máy chủ ứng dụng thì họ có luôn cái biến môi trường. Tiêu tách "cơ sở dữ liệu rò" ra khỏi "máy chủ bị chiếm" — hai sự kiện thật sự KHÁC nhau, nhưng đừng nhầm nó với một lớp băm mật khẩu thứ hai.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cái giá: xoay vòng thật sự KHÓ</span><span class="lz-lnote">Đổi tiêu là vô hiệu hoá MỌI chuỗi băm đã lưu, vì bạn không suy lại được chúng nếu không có bản rõ. Mẫu làm được là ĐÁNH PHIÊN BẢN — lưu <code>v2$…</code>, giữ tiêu cũ để xác minh, và nêm lại tiêu khi đăng nhập thành công y hệt cách <code>needsRehash</code> làm. Hãy thiết kế điều đó ngay từ đầu, hoặc chấp nhận rằng cái tiêu là VĨNH VIỄN.</span></div>
  <div class="lz-layer"><span class="lz-lname">Dùng HMAC, đừng nối chuỗi</span><span class="lz-lnote"><code>sha256(TIEU + password)</code> là lại đúng cái sai lầm nối dài của Bài 1.4. Và HMAC đặt TRƯỚC hàm băm chậm, không phải sau: hàm băm chậm phải là bước CUỐI để chi phí của nó vẫn áp lên mọi lần đoán.</span></div>
  <div class="lz-layer"><span class="lz-lname">Có đáng không?</span><span class="lz-lnote">Nếu bạn có một trình quản bí mật và một câu chuyện xoay vòng thì CÓ — nó rẻ. Nếu cái tiêu sẽ nằm trong đúng cái <code>.env</code> vốn cũng chứa <code>DATABASE_URL</code>, trên cùng một máy, thì rò cái này là rò cái kia và bạn vừa thêm phức tạp để đổi lấy rất ít. Hãy trung thực xem mình đang ở tình huống nào.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một lần đổi mật khẩu PHẢI vô hiệu hoá các phiên khác, và gần như không bản cài đặt đầu tiên nào làm thế.</strong> Nếu ai đó đổi mật khẩu vì họ TIN rằng kẻ tấn công biết mật khẩu cũ, mà phiên của kẻ tấn công vẫn chạy tiếp, thì việc đổi ấy chẳng đạt được gì. Hãy YÊU CẦU mật khẩu hiện tại, rồi xoá MỌI phiên của người dùng đó trừ phiên đang dùng. Chương 5 dựng cơ chế; còn cái YÊU CẦU thì thuộc về đây, ngay cạnh cái mật khẩu.</p>
</div>
<div class="note-ct">
<p><strong>Danh sách kiểm mật khẩu đầy đủ, để dùng lúc review mã.</strong> Một thông báo lỗi và một khoảng thời gian cho cả hai nhánh trượt · Argon2id (hoặc một bcrypt đã đo) với tham số chọn trên phần cứng production và ghi ngày trong chú thích · băm lại khi đăng nhập thành công nếu tham số đã đổi · chuẩn hoá NFKC áp GIỐNG NHAU ở cả hai đường · không cắt khoảng trắng, không cắt cụt, không lọc ký tự, không hạ chữ thường · giới hạn tốc độ đặt trước endpoint (Chương 11) · mật khẩu KHÔNG bao giờ tới được một dòng log, một đối tượng lỗi hay một sự kiện analytics · và một lần đổi mật khẩu thu hồi MỌI phiên khác.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://pages.nist.gov/800-63-3/sp800-63b.html#memsecret" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">NIST SP 800-63B §5.1.1 — bí mật ghi nhớ</span><span class="lc-sub">pages.nist.gov · Chuẩn hoá, giới hạn độ dài và những gì bên xác minh BẮT BUỘC phải nhận</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-and-error-messages" target="_blank" rel="noopener"><span class="lc-ico">💬</span><span class="lc-body"><span class="lc-title">OWASP — thông báo lỗi xác thực</span><span class="lc-sub">cheatsheetseries.owasp.org · Luật thông báo chung chung, và hệ quả về thời gian</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#peppering" target="_blank" rel="noopener"><span class="lc-ico">🌶️</span><span class="lc-body"><span class="lc-title">OWASP — dùng tiêu (peppering)</span><span class="lc-sub">cheatsheetseries.owasp.org · Cấu trúc HMAC-trước-băm và bài toán xoay vòng</span></span></a>
<a class="link-card" href="https://unicode.org/reports/tr15/" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">Unicode — các dạng chuẩn hoá</span><span class="lc-sub">unicode.org · NFC, NFD, NFKC và NFKD, và nên dùng dạng nào cho tín vật</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Liệt kê người dùng CHỈ bằng thời gian, rồi bịt cái kênh đó và chạy lại đúng script ấy</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — The policy NIST actually recommends|||2.4 — Chính sách mà NIST THẬT SỰ khuyến nghị',
      slug: 'auth-2-4-chinh-sach',
      type: 'LESSON',
      description: 'Bắt buộc hoa-thường-số-ký-tự-đặc-biệt và bắt đổi mật khẩu mỗi 90 ngày đều đã bị NIST bỏ, có lý do đo được. Bài này thay chúng bằng thứ CÓ tác dụng: độ dài, một danh sách chặn đối chiếu mật khẩu đã lộ qua API k-ẩn danh, và một thước đo độ đoán được thay cho việc đếm loại ký tự.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>The policy NIST actually recommends</h2>
<p class="lead">Almost every password rule you have met — one uppercase, one number, one symbol, change it every ninety days, no pasting — was removed from NIST SP 800-63B years ago, because measurement showed they made passwords <em>worse</em>. This lesson replaces the folklore with the three rules that survive contact with data.</p>

<h3>What was removed, and why</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ Composition rules</span><span class="v">"At least one uppercase, one digit, one symbol" produces <code>Password1!</code> at industrial scale. Users satisfy the rule in the most predictable way available, so the rule narrows the search space instead of widening it — and every cracking wordlist already encodes the transformations.</span></div>
  <div class="kv"><span class="k">❌ Forced periodic rotation</span><span class="v">Ninety-day expiry produces <code>MatKhau01</code> → <code>MatKhau02</code>. It also trains people to write passwords down and to pick weaker ones because they will have to retype them soon. Rotate on <em>evidence of compromise</em>, not on a calendar.</span></div>
  <div class="kv"><span class="k">❌ Password hints and security questions</span><span class="v">A hint is a clue given to whoever asks. A security question is a low-entropy password that is public on social media, identical across sites, and unchangeable after a breach. Both are explicitly forbidden.</span></div>
  <div class="kv"><span class="k">❌ Blocking paste</span><span class="v">It exists to stop nothing and it breaks password managers, which are the single most effective thing a user can do. Blocking paste actively pushes people toward passwords they can type from memory.</span></div>
</div>
<pre><code><span class="tok-comment"># What the composition rule actually buys, measured</span>
'Password1!'   → thoa MOI luat, nam trong moi wordlist, be trong &lt; 1 giay
'con meo mun cua toi ten la Bo'  → khong thoa luat nao, ~ 60 bit doan-duoc

<span class="tok-comment"># Luat thanh phan ky tu KHONG do duoc cai no tuyen bo la do.</span></code></pre>

<h3>The three rules that stay</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Length, with a real maximum</span><span class="lz-d">Minimum 8 as an absolute floor, 12–15 as the practical target, and accept at least 64 characters. A maximum exists only to bound the hashing cost — set it at 128 or 256, never at 16.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">A blocklist of breached passwords</span><span class="lz-d">This is the rule that replaces all the removed ones. Rejecting the top hundred thousand known passwords stops the attack that actually succeeds — credential stuffing — and it costs one API call.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Rate limiting, per account and per IP</span><span class="lz-d">A policy defends against offline cracking; a rate limit defends against the online attack happening right now. Chapter 11 builds it, and without it every other rule here is theoretical.</span></div>
  <div class="lz-step"><span class="lz-k">And one more</span><span class="lz-t">Support password managers</span><span class="lz-d">Allow paste, use <code>autocomplete="current-password"</code> and <code>"new-password"</code>, keep the field <code>type="password"</code>, and put the username field on the same page. These four details decide whether a manager works, and a working manager beats any policy.</span></div>
</div>

<h3>Checking a password against breaches, without sending it</h3>
<pre><code><span class="tok-comment">// k-anonymity: send the first 5 hex characters of the SHA-1, nothing more</span>
import { createHash } from 'node:crypto';

export async function leaked(password: string): Promise&lt;number&gt; {
  const sha1 = createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);        <span class="tok-comment">// gửi đi</span>
  const duoi = sha1.slice(5);          <span class="tok-comment">// KHÔNG gửi</span>

  const r = await fetch(&#96;https://api.pwnedpasswords.com/range/\${dau}&#96;, {
    headers: { 'Add-Padding': 'true' },   <span class="tok-comment">// che cả kích thước phản hồi</span>
  });
  const text = await r.text();

  for (const line of text.split('\\n')) {
    const [suffix, count] = line.trim().split(':');
    if (suffix === duoi) return Number(count);
  }
  return 0;
}</code></pre>
<pre><code><span class="tok-comment"># 'password' → SHA-1 5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8</span>
curl -s https://api.pwnedpasswords.com/range/5BAA6 | grep '^1E4C9B93F3F0682250B6CF8331B7EE68FD8'</code></pre>
<div class="out">1E4C9B93F3F0682250B6CF8331B7EE68FD8:10382543

# Mat khau nay xuat hien 10.382.543 lan trong cac vu ro da biet.
# May chu HIBP nhan duoc 5 ky tu "5BAA6" — khoang 850 hau to.
# No khong biet ban hoi ve cai nao, va khong bao gio thay mat khau.</div>
<div class="callout ok">
<p><strong>SHA-1 is correct here, and only here.</strong> It is being used as an index into a published dataset, not to protect anything — the security of the scheme comes from the k-anonymity range, not from the hash. This is the exception to "never use SHA-1"; the rule still holds everywhere else, and the password itself is still stored with Argon2id.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Check on registration and on change</span><span class="v">Not on every login — the user cannot act on it mid-login, and you would be making an outbound call on your hottest path. Registration and password change are where the user is already choosing.</span></div>
  <div class="kv"><span class="k">Fail open, deliberately</span><span class="v">If the API is unreachable, allow the password and log it. A third-party outage must not stop people signing up. Wrap the call in a two-second timeout and treat any error as "not found".</span></div>
  <div class="kv"><span class="k">The offline option</span><span class="v">The full list downloads as roughly 40 GB of hashes, or about 100 MB for the top ten million loaded into a Bloom filter. Worth it if outbound calls are impossible; otherwise the range API is simpler and always current.</span></div>
  <div class="kv"><span class="k">Say what happened, usefully</span><span class="v">"This password appeared in 10,382,543 known breaches — please choose a different one" tells the user something true and actionable. "Password does not meet requirements" tells them nothing and makes them try <code>Password1!</code>.</span></div>
</div>

<h3>Measure guessability, not shape</h3>
<pre><code>import zxcvbn from 'zxcvbn';

for (const mk of ['Password1!', 'conmeomuncuatoi', 'Tr0ub4dor&amp;3', 'con meo mun cua toi ten la Bo']) {
  const result = zxcvbn(pw);
  console.log(pw.padEnd(32), 'diem', result.score, '·', result.crack_times_display.offline_slow_hashing_1e4_per_secou);
}</code></pre>
<div class="out">Password1!                       diem 1 · 3 hours
conmeomuncuatoi                  diem 3 · 3 months
Tr0ub4dor&3                      diem 3 · 2 months
con meo mun cua toi ten la Bo    diem 4 · centuries

# Cai thoa MOI luat thanh phan ky tu la cai YEU NHAT trong bon.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Score, do not gate on composition</span><span class="lz-lnote">Reject a zxcvbn score below 3 and you have a rule that tracks actual guessability. It accepts a long memorable phrase and rejects <code>P@ssw0rd</code>, which is exactly the inversion the old rules got wrong.</span></div>
  <div class="lz-layer"><span class="lz-lname">Feed it your own context</span><span class="lz-lnote">zxcvbn takes a user-inputs array: pass the email, the username, the product name and the company name. Otherwise <code>cuongthai2026</code> scores well on a site called CuongThai, which is not what you want.</span></div>
  <div class="lz-layer"><span class="lz-lname">Show the meter as they type</span><span class="lz-lnote">Feedback before submit changes behaviour; a rejection after submit produces the smallest change that passes. The meter is a user-interface decision that has a measurable security effect, which is rare.</span></div>
  <div class="lz-layer"><span class="lz-lname">Vietnamese needs its own dictionary</span><span class="lz-lnote">zxcvbn's built-in lists are English, so <code>matkhaucuatoi</code> looks like random letters and scores far too high. Add a Vietnamese frequency list to the dictionary, or lean on the breach blocklist, which is language-agnostic because it is based on what people actually used.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — a maximum length below about 64 characters is a bug, and one below 20 is a signal.</strong> A short maximum usually means the password is being stored in a fixed-size column, or truncated by bcrypt's 72-byte limit (Lesson 2.2), or — historically — stored in plaintext. Users notice: a 16-character cap is widely read as "this site does not hash properly", and often they are right.</p>
</div>
<div class="note-ct">
<p><strong>The whole policy, as code you can read in ten seconds.</strong> Minimum 12 characters · maximum 256 · reject anything the breach list knows · reject a zxcvbn score below 3, with the email and username as context · accept every printable character · never expire on a schedule · force a change only on evidence of compromise, and when you do, revoke every session. Everything else that used to be in a password policy has been removed on purpose, and removing it is the improvement.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://pages.nist.gov/800-63-3/sp800-63b.html#5111-memorized-secret-authenticators" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">NIST SP 800-63B §5.1.1.2</span><span class="lc-sub">pages.nist.gov · The verifier requirements, including the blocklist and the no-rotation rule</span></span></a>
<a class="link-card" href="https://haveibeenpwned.com/API/v3#PwnedPasswords" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">Pwned Passwords — range API</span><span class="lc-sub">haveibeenpwned.com · The k-anonymity model, padding, and the offline downloads</span></span></a>
<a class="link-card" href="https://github.com/dropbox/zxcvbn" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">zxcvbn</span><span class="lc-sub">github.com · Guessability estimation, and the paper explaining why composition rules fail</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#implement-proper-password-strength-controls" target="_blank" rel="noopener"><span class="lc-ico">💪</span><span class="lc-body"><span class="lc-title">OWASP — password strength controls</span><span class="lc-sub">cheatsheetseries.owasp.org · The current recommendations, aligned with NIST</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Wire the range API into registration, then measure how many of your test passwords it rejects</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Chính sách mà NIST THẬT SỰ khuyến nghị</h2>
<p class="lead">Gần như mọi luật mật khẩu bạn từng gặp — phải có một chữ hoa, một chữ số, một ký tự đặc biệt, đổi mỗi chín mươi ngày, cấm dán — đều đã bị gỡ khỏi NIST SP 800-63B từ nhiều năm trước, bởi vì ĐO ĐẠC cho thấy chúng làm mật khẩu <em>TỆ ĐI</em>. Bài này thay đám truyền miệng đó bằng ba luật sống sót được khi va vào dữ liệu.</p>

<h3>Cái gì đã bị gỡ, và vì sao</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ Luật thành phần ký tự</span><span class="v">"Ít nhất một chữ hoa, một chữ số, một ký tự đặc biệt" sản xuất ra <code>Password1!</code> ở quy mô công nghiệp. Người dùng thoả luật theo cách DỄ ĐOÁN NHẤT có thể, nên cái luật đó THU HẸP không gian tìm kiếm thay vì mở rộng nó — và mọi wordlist bẻ khoá đều đã mã hoá sẵn những phép biến đổi ấy.</span></div>
  <div class="kv"><span class="k">❌ Bắt đổi định kỳ</span><span class="v">Hết hạn chín mươi ngày sản xuất ra <code>MatKhau01</code> → <code>MatKhau02</code>. Nó còn tập cho người ta thói quen ghi mật khẩu ra giấy và chọn mật khẩu yếu hơn vì sắp phải gõ lại. Hãy xoay vòng khi có <em>BẰNG CHỨNG bị lộ</em>, đừng xoay theo lịch.</span></div>
  <div class="kv"><span class="k">❌ Gợi ý mật khẩu và câu hỏi bảo mật</span><span class="v">Một gợi ý là một manh mối trao cho bất kỳ ai hỏi. Một câu hỏi bảo mật là một mật khẩu entropy thấp, công khai trên mạng xã hội, giống nhau ở mọi trang, và không đổi được sau một vụ rò. Cả hai đều bị cấm tường minh.</span></div>
  <div class="kv"><span class="k">❌ Chặn dán</span><span class="v">Nó tồn tại để ngăn... không gì cả, và nó phá hỏng trình quản lý mật khẩu — thứ HIỆU QUẢ NHẤT mà một người dùng có thể làm. Chặn dán chủ động đẩy người ta về phía những mật khẩu họ gõ được từ trí nhớ.</span></div>
</div>
<pre><code><span class="tok-comment"># Luật thành phần ký tự THẬT SỰ mua được gì, đem đo</span>
'Password1!'   → thoa MOI luat, nam trong moi wordlist, be trong &lt; 1 giay
'con meo mun cua toi ten la Bo'  → khong thoa luat nao, ~ 60 bit doan-duoc

<span class="tok-comment"># Luat thanh phan ky tu KHONG do duoc cai no tuyen bo la do.</span></code></pre>

<h3>Ba luật CÒN LẠI</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Độ dài, kèm một mức tối đa THẬT</span><span class="lz-d">Tối thiểu 8 làm sàn tuyệt đối, 12–15 làm mục tiêu thực tế, và phải NHẬN được ít nhất 64 ký tự. Mức tối đa tồn tại chỉ để chặn chi phí băm — hãy đặt ở 128 hoặc 256, đừng bao giờ đặt ở 16.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">Danh sách chặn mật khẩu đã lộ</span><span class="lz-d">Đây là cái luật THAY THẾ cho tất cả những luật đã gỡ. Từ chối một trăm nghìn mật khẩu phổ biến nhất sẽ chặn được đúng cú tấn công THẬT SỰ thành công — nhồi tín vật — và nó tốn một lời gọi API.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">Giới hạn tốc độ, theo tài khoản và theo IP</span><span class="lz-d">Một chính sách chống lại việc bẻ khoá NGOẠI TUYẾN; một giới hạn tốc độ chống lại cú tấn công TRỰC TUYẾN đang xảy ra ngay lúc này. Chương 11 dựng nó, và không có nó thì mọi luật khác ở đây đều chỉ là lý thuyết.</span></div>
  <div class="lz-step"><span class="lz-k">Và thêm một</span><span class="lz-t">Hỗ trợ trình quản lý mật khẩu</span><span class="lz-d">Cho phép dán, dùng <code>autocomplete="current-password"</code> và <code>"new-password"</code>, giữ ô ở <code>type="password"</code>, và đặt ô tên đăng nhập trên CÙNG một trang. Bốn chi tiết đó quyết định một trình quản lý có chạy được không, và một trình quản lý chạy được thì thắng mọi chính sách.</span></div>
</div>

<h3>Đối chiếu mật khẩu với các vụ rò, mà KHÔNG gửi nó đi</h3>
<pre><code><span class="tok-comment">// k-ẩn danh: gửi 5 ký tự hex ĐẦU của SHA-1, không hơn</span>
import { createHash } from 'node:crypto';

export async function leaked(password: string): Promise&lt;number&gt; {
  const sha1 = createHash('sha1').update(password).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);        <span class="tok-comment">// gửi đi</span>
  const duoi = sha1.slice(5);          <span class="tok-comment">// KHÔNG gửi</span>

  const r = await fetch(&#96;https://api.pwnedpasswords.com/range/\${dau}&#96;, {
    headers: { 'Add-Padding': 'true' },   <span class="tok-comment">// che cả kích thước phản hồi</span>
  });
  const text = await r.text();

  for (const line of text.split('\\n')) {
    const [suffix, count] = line.trim().split(':');
    if (suffix === duoi) return Number(count);
  }
  return 0;
}</code></pre>
<pre><code><span class="tok-comment"># 'password' → SHA-1 5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8</span>
curl -s https://api.pwnedpasswords.com/range/5BAA6 | grep '^1E4C9B93F3F0682250B6CF8331B7EE68FD8'</code></pre>
<div class="out">1E4C9B93F3F0682250B6CF8331B7EE68FD8:10382543

# Mat khau nay xuat hien 10.382.543 lan trong cac vu ro da biet.
# May chu HIBP nhan duoc 5 ky tu "5BAA6" — khoang 850 hau to.
# No khong biet ban hoi ve cai nao, va khong bao gio thay mat khau.</div>
<div class="callout ok">
<p><strong>SHA-1 là ĐÚNG ở đây, và CHỈ ở đây.</strong> Nó đang được dùng làm CHỈ MỤC vào một tập dữ liệu công bố sẵn, không phải để bảo vệ gì cả — độ an toàn của sơ đồ này tới từ cái khoảng k-ẩn danh, không tới từ hàm băm. Đây là ngoại lệ của luật "đừng bao giờ dùng SHA-1"; luật đó vẫn đúng ở mọi chỗ khác, và bản thân cái mật khẩu vẫn được cất bằng Argon2id.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Kiểm lúc ĐĂNG KÝ và lúc ĐỔI</span><span class="v">Đừng kiểm ở mọi lần đăng nhập — người dùng không làm gì được với thông tin đó giữa lúc đăng nhập, và bạn sẽ tạo một lời gọi ra ngoài trên đường nóng nhất của mình. Đăng ký và đổi mật khẩu là những lúc người dùng ĐANG chọn.</span></div>
  <div class="kv"><span class="k">Hỏng thì CHO QUA, một cách có chủ ý</span><span class="v">Nếu API không với tới được, hãy CHO PHÉP mật khẩu đó và ghi log lại. Một cú ngừng dịch vụ của bên thứ ba KHÔNG được chặn người ta đăng ký. Hãy bọc lời gọi trong một hạn giờ hai giây và coi mọi lỗi là "không tìm thấy".</span></div>
  <div class="kv"><span class="k">Lựa chọn ngoại tuyến</span><span class="v">Danh sách đầy đủ tải về cỡ 40 GB chuỗi băm, hoặc chừng 100 MB cho mười triệu cái phổ biến nhất nạp vào một bộ lọc Bloom. Đáng làm nếu lời gọi ra ngoài là bất khả thi; không thì API khoảng đơn giản hơn và luôn mới.</span></div>
  <div class="kv"><span class="k">Nói ra chuyện gì đã xảy ra, một cách HỮU ÍCH</span><span class="v">"Mật khẩu này đã xuất hiện trong 10.382.543 vụ rò đã biết — hãy chọn mật khẩu khác" nói cho người dùng một điều ĐÚNG và HÀNH ĐỘNG ĐƯỢC. "Mật khẩu không đáp ứng yêu cầu" chẳng nói gì và khiến họ thử <code>Password1!</code>.</span></div>
</div>

<h3>Hãy ĐO độ đoán được, đừng đo hình dạng</h3>
<pre><code>import zxcvbn from 'zxcvbn';

for (const mk of ['Password1!', 'conmeomuncuatoi', 'Tr0ub4dor&amp;3', 'con meo mun cua toi ten la Bo']) {
  const result = zxcvbn(pw);
  console.log(pw.padEnd(32), 'diem', result.score, '·', result.crack_times_display.offline_slow_hashing_1e4_per_secou);
}</code></pre>
<div class="out">Password1!                       diem 1 · 3 hours
conmeomuncuatoi                  diem 3 · 3 months
Tr0ub4dor&3                      diem 3 · 2 months
con meo mun cua toi ten la Bo    diem 4 · centuries

# Cai thoa MOI luat thanh phan ky tu la cai YEU NHAT trong bon.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Chấm điểm, đừng chặn cửa theo thành phần ký tự</span><span class="lz-lnote">Từ chối điểm zxcvbn dưới 3 là bạn có một luật BÁM SÁT độ đoán được thật. Nó nhận một cụm từ dài dễ nhớ và từ chối <code>P@ssw0rd</code>, đúng cái đảo chiều mà những luật cũ đã làm ngược.</span></div>
  <div class="lz-layer"><span class="lz-lname">Nạp cho nó ngữ cảnh CỦA BẠN</span><span class="lz-lnote">zxcvbn nhận một mảng user-inputs: hãy truyền email, tên đăng nhập, tên sản phẩm và tên công ty. Nếu không thì <code>cuongthai2026</code> sẽ được điểm cao trên một trang tên là CuongThai, và đó không phải thứ bạn muốn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hiện thước đo NGAY LÚC họ gõ</span><span class="lz-lnote">Phản hồi TRƯỚC khi gửi form thì đổi được hành vi; một cú từ chối SAU khi gửi thì sinh ra thay đổi nhỏ nhất vừa đủ qua cửa. Cái thước đo là một quyết định giao diện có tác dụng bảo mật ĐO ĐƯỢC, và điều đó thì hiếm.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tiếng Việt cần từ điển riêng</span><span class="lz-lnote">Các danh sách dựng sẵn của zxcvbn là tiếng Anh, nên <code>matkhaucuatoi</code> trông như chữ cái ngẫu nhiên và được điểm cao quá đáng. Hãy thêm một danh sách tần suất tiếng Việt vào từ điển, hoặc dựa vào danh sách chặn từ các vụ rò — thứ vốn không phụ thuộc ngôn ngữ vì nó dựa trên cái người ta THẬT SỰ đã dùng.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một mức tối đa dưới khoảng 64 ký tự là một con bug, và dưới 20 là một TÍN HIỆU.</strong> Mức tối đa ngắn thường có nghĩa là mật khẩu đang bị cất vào một cột kích thước cố định, hoặc bị cắt cụt bởi giới hạn 72 byte của bcrypt (Bài 2.2), hoặc — theo lịch sử — đang được cất ở dạng RÕ. Người dùng nhận ra: một mức trần 16 ký tự bị đọc rộng rãi là "trang này không băm mật khẩu tử tế", và thường thì họ đúng.</p>
</div>
<div class="note-ct">
<p><strong>Toàn bộ chính sách, viết thành mã đọc trong mười giây.</strong> Tối thiểu 12 ký tự · tối đa 256 · từ chối bất cứ thứ gì danh sách rò biết mặt · từ chối điểm zxcvbn dưới 3, có truyền email và tên đăng nhập làm ngữ cảnh · nhận MỌI ký tự in được · KHÔNG bao giờ hết hạn theo lịch · chỉ bắt đổi khi có BẰNG CHỨNG bị lộ, và khi bắt đổi thì thu hồi mọi phiên. Mọi thứ khác từng nằm trong một chính sách mật khẩu đều đã bị gỡ CÓ CHỦ Ý, và chính việc gỡ đi mới là cải tiến.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://pages.nist.gov/800-63-3/sp800-63b.html#5111-memorized-secret-authenticators" target="_blank" rel="noopener"><span class="lc-ico">📜</span><span class="lc-body"><span class="lc-title">NIST SP 800-63B §5.1.1.2</span><span class="lc-sub">pages.nist.gov · Yêu cầu với bên xác minh, kể cả danh sách chặn và luật không-xoay-vòng</span></span></a>
<a class="link-card" href="https://haveibeenpwned.com/API/v3#PwnedPasswords" target="_blank" rel="noopener"><span class="lc-ico">🔎</span><span class="lc-body"><span class="lc-title">Pwned Passwords — API khoảng</span><span class="lc-sub">haveibeenpwned.com · Mô hình k-ẩn danh, phần đệm, và các bản tải ngoại tuyến</span></span></a>
<a class="link-card" href="https://github.com/dropbox/zxcvbn" target="_blank" rel="noopener"><span class="lc-ico">📊</span><span class="lc-body"><span class="lc-title">zxcvbn</span><span class="lc-sub">github.com · Ước lượng độ đoán được, và bài báo giải thích vì sao luật thành phần ký tự thất bại</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#implement-proper-password-strength-controls" target="_blank" rel="noopener"><span class="lc-ico">💪</span><span class="lc-body"><span class="lc-title">OWASP — kiểm soát độ mạnh mật khẩu</span><span class="lc-sub">cheatsheetseries.owasp.org · Khuyến nghị hiện hành, khớp với NIST</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Cắm API khoảng vào luồng đăng ký, rồi đo xem nó từ chối bao nhiêu mật khẩu thử của bạn</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 2.5 ─────────────────────────── */
    {
      title: '2.5 — Migrating old hashes without a mass reset|||2.5 — Chuyển đổi hàm băm cũ mà không bắt ai đặt lại',
      slug: 'auth-2-5-chuyen-doi',
      type: 'LESSON',
      description: 'Ba tình huống — cùng thuật toán tham số thấp, thuật toán hiện đại khác, và một sơ đồ cũ đã HỎNG — và kỹ thuật BỌC: gói ngay cả những chuỗi MD5 không muối vào Argon2id NGAY HÔM NAY, không cần chờ ai đăng nhập, rồi gỡ lớp bọc dần dần.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>Migrating old hashes without a mass reset</h2>
<p class="lead">You inherit a database with <code>md5(password)</code> in it. The instinct is to email everyone and force a reset, which looks exactly like a phishing campaign, generates a week of support tickets, and silently loses the users who never open it. There is a better answer, and it protects the database within the hour rather than over the following months.</p>

<h3>Three situations, three answers</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">A · Same algorithm, lower parameters</span><span class="v"><code>$argon2id$…m=19456…</code> when you now use <code>m=65536</code>. Lesson 2.3's <code>needsRehash</code> already handles it: rehash on the next successful login, and nothing else is needed.</span></div>
  <div class="kv"><span class="k">B · A different modern algorithm</span><span class="v">bcrypt to Argon2id, or scrypt to Argon2id. The old hashes are not dangerous, so lazy migration on login is fine. The only change is that <code>needsRehash</code> must recognise the old prefix and the verify path must dispatch on it.</span></div>
  <div class="kv"><span class="k">C · A broken scheme</span><span class="v">Unsalted MD5, SHA-1, or a plaintext column. Lazy migration is <em>not</em> enough here, because the existing rows are a liability right now — a leak today exposes every password today, including the ones belonging to people who have not logged in for a year.</span></div>
  <div class="kv"><span class="k">The distinction that matters</span><span class="v">In A and B you are improving something adequate. In C you are containing a live problem. Only C needs the wrapping technique below, and only C has a deadline.</span></div>
</div>

<h3>Lazy migration, for A and B</h3>
<pre><code><span class="tok-comment">// One verify function that dispatches on the stored format</span>
import { hash, verify as argonVerify } from '@node-rs/argon2';
import bcrypt from 'bcrypt';

export async function checkPassword(oldHash: string, password: string): Promise&lt;boolean&gt; {
  if (oldHash.startsWith('$argon2')) return argonVerify(oldHash, password).catch(() =&gt; false);
  if (/^\\$2[aby]\\$/.test(oldHash))   return bcrypt.compare(password, oldHash);
  return false;                                   <span class="tok-comment">// định dạng lạ → trượt</span>
}

export function needsRehash(oldHash: string): boolean {
  return !oldHash.startsWith('$argon2id$') || weakerParams(oldHash);
}</code></pre>
<div class="out">$ SELECT left(bam, 10) AS dinh_dang, count(*) FROM "User" GROUP BY 1;

 dinh_dang  | count
------------+--------
 $argon2id$ | 12.847      ← da chuyen
 $2b$12$    | 41.209      ← chua, se tu chuyen khi ho dang nhap
 $2a$10$    |  3.118      ← con cu hon, cung the</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Week 1</span><span class="lz-t">Deploy the dispatcher</span><span class="lz-d">Nothing changes for users. Active accounts start converting on their next login, at whatever rate people log in.</span></div>
  <div class="lz-step"><span class="lz-k">Month 3</span><span class="lz-t">Most of them are done</span><span class="lz-d">Typically 80–95% of accounts that are still in use will have converted. Watch the <code>GROUP BY</code> above weekly; it is the whole progress report.</span></div>
  <div class="lz-step"><span class="lz-k">Month 6</span><span class="lz-t">The tail is dormant accounts</span><span class="lz-d">What remains are people who have not logged in since you started. For situations A and B that is fine — bcrypt at cost 10 is still a real hash — so you can simply leave them.</span></div>
  <div class="lz-step"><span class="lz-k">Eventually</span><span class="lz-t">Force the last few</span><span class="lz-d">When the remainder is small enough to be a support conversation rather than a campaign, require a reset on next login for those rows and delete the branch. Removing the old code path is worth doing.</span></div>
</div>

<h3>Situation C: wrap the old hash, today</h3>
<pre><code><span class="tok-comment">// The idea: the OLD digest becomes the INPUT to the new hash.</span>
<span class="tok-comment">// You do not need the plaintext to do this — so it runs right now,</span>
<span class="tok-comment">// on every row, in one background job.</span>

bam_moi = argon2id( md5_hex_da_co )        <span class="tok-comment">// lưu kèm nhãn 'boc1$'</span></code></pre>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Before</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">md5("123456")</span><span class="lz-nsub">e10adc3949ba59abbe56e057f20f883e · cracked in microseconds</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Wrap — no plaintext needed</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">argon2id(that hex string)</span><span class="lz-nsub">boc1$argon2id$v=19$m=65536,t=2,p=1$… · now costs 187 ms per guess</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">On login</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">verify(md5(typed))</span><span class="lz-nsub">then re-store as plain argon2id(typed)</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// scripts/boc-md5.ts — chạy một lần, chia lô, nối lại được (Prisma 11.4)</span>
const LO = 500;
for (;;) {
  const needsWrap = await prisma.user.findMany({
    where: { bam: { not: { startsWith: '$' } } },   <span class="tok-comment">// còn là md5 hex trần</span>
    select: { id: true, bam: true },
    take: LO,
  });
  if (needsWrap.length === 0) break;

  for (const nd of needsWrap) {
    const wrapped = 'boc1$' + await hash(u.bam.toLowerCase(), PARAMS);
    await prisma.user.update({ where: { id: u.id }, data: { bam: boc } });
  }
  console.log(&#96;\${needsWrap.length} hang · \${new Date().toISOString()}&#96;);
  await new Promise((r) =&gt; setTimeout(r, 200));
}</code></pre>
<div class="out">500 hang · 2026-08-23T16:04:11.284Z
500 hang · 2026-08-23T16:05:38.902Z
…
57174 hang · 2026-08-23T18:47:02.118Z

# Sau 2 gio 43 phut: KHONG con mot chuoi md5 tran nao trong CSDL.
# Khong ai phai dat lai mat khau. Khong ai nhan mot email nao.</div>
<pre><code><span class="tok-comment">// The verify path handles both, and unwraps on success</span>
export async function checkPassword(oldHash: string, password: string) {
  if (oldHash.startsWith('boc1$')) {
    const trong = createHash('md5').update(password).digest('hex');
    return argonVerify(oldHash.slice(5), trong).catch(() =&gt; false);
  }
  if (oldHash.startsWith('$argon2')) return argonVerify(oldHash, password).catch(() =&gt; false);
  return false;
}

<span class="tok-comment">// canBamLai returns true for anything starting with 'boc1$',</span>
<span class="tok-comment">// so a successful login replaces it with a plain argon2id hash.</span></code></pre>
<div class="callout ok">
<p><strong>Why this is the right shape.</strong> The wrapping step needs no plaintext, so it runs immediately over the whole table — the database stops being a liability in hours rather than months. The unwrapping happens lazily, so no user is inconvenienced. And the two mechanisms are independent: if the background job dies halfway, both formats still verify, and you restart it. Every property you want from a migration, and it is about forty lines.</p>
</div>
<div class="pitfall">
<p><strong>Trap — match the old scheme byte for byte, including case and encoding.</strong> If the legacy column stored uppercase hex and you wrap the lowercase form, every wrapped row becomes permanently unverifiable and those users are locked out with no way back. Before running the job on production: take a copy, wrap it, and verify a real known password against a wrapped row. If the legacy scheme had its own salt or a fixed application secret, the wrap must include exactly that, in exactly that order.</p>
</div>

<h3>Importing from another provider</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Ask for the hashes, not a reset</span><span class="lz-lnote">Auth0, Firebase, Cognito and most others will export password hashes on request, usually bcrypt or scrypt with the parameters. That turns a migration into situation B — dispatch on the prefix and convert lazily — instead of a mass reset.</span></div>
  <div class="lz-layer"><span class="lz-lname">Firebase scrypt is not standard scrypt</span><span class="lz-lnote">It is a modified construction with a per-project signer key, a salt separator and base64 encoding. The export includes those parameters and there are published implementations; what you must not do is assume <code>crypto.scrypt</code> will verify it.</span></div>
  <div class="lz-layer"><span class="lz-lname">Verify against real accounts before cutover</span><span class="lz-lnote">Import into a staging database, then log in as three real test accounts whose passwords you know. A migration that silently locks everyone out is discovered by users, at the worst possible moment.</span></div>
  <div class="lz-layer"><span class="lz-lname">Plan for the accounts you cannot import</span><span class="lz-lnote">Social logins have no password to migrate — those users must keep using the same provider, or go through Chapter 6's account-linking flow. Decide this before the cutover, because it is the group most likely to be forgotten.</span></div>
</div>
<div class="note-ct">
<p><strong>Why not just email everyone?</strong> A mass "reset your password" email is indistinguishable from phishing — which is the exact behaviour you spend the rest of the year teaching users to distrust. It produces a support spike, and a large fraction of users simply do not act, so you end up with dormant accounts and an unfinished migration <em>plus</em> the reputational cost. Do it silently with the technique above, and reserve the email for the case where you have evidence of an actual compromise — where the message is honest, specific, and worth sending.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#upgrading-legacy-hashes" target="_blank" rel="noopener"><span class="lc-ico">⬆️</span><span class="lc-body"><span class="lc-title">OWASP — upgrading legacy hashes</span><span class="lc-sub">cheatsheetseries.owasp.org · The wrapping technique, in the specification's own words</span></span></a>
<a class="link-card" href="https://auth0.com/docs/manage-users/user-migration/bulk-user-imports" target="_blank" rel="noopener"><span class="lc-ico">📥</span><span class="lc-body"><span class="lc-title">Auth0 — bulk user import format</span><span class="lc-sub">auth0.com · The hash fields an export contains, and what they mean</span></span></a>
<a class="link-card" href="https://github.com/firebase/scrypt" target="_blank" rel="noopener"><span class="lc-ico">🔥</span><span class="lc-body"><span class="lc-title">Firebase scrypt</span><span class="lc-sub">github.com · The modified construction, with a reference implementation</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">CuongThai course — Prisma ORM</span><span class="lc-sub">Chunked, resumable backfill scripts — the pattern the wrapping job uses</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Wrap a table of unsalted MD5 hashes, then log in and watch a row unwrap itself</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Chuyển đổi hàm băm cũ mà không bắt ai đặt lại</h2>
<p class="lead">Bạn tiếp quản một cơ sở dữ liệu có <code>md5(matkhau)</code> trong đó. Phản xạ là gửi email cho tất cả và bắt đặt lại mật khẩu — thứ trông y hệt một chiến dịch lừa đảo, sinh ra một tuần phiếu hỗ trợ, và lặng lẽ MẤT những người không bao giờ mở email. Có một câu trả lời tốt hơn, và nó bảo vệ cơ sở dữ liệu TRONG VÒNG MỘT GIỜ thay vì trong nhiều tháng sau đó.</p>

<h3>Ba tình huống, ba câu trả lời</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">A · Cùng thuật toán, tham số thấp hơn</span><span class="v"><code>$argon2id$…m=19456…</code> trong khi bây giờ bạn dùng <code>m=65536</code>. Hàm <code>needsRehash</code> của Bài 2.3 đã lo rồi: băm lại ở lần đăng nhập thành công kế tiếp, và không cần gì thêm.</span></div>
  <div class="kv"><span class="k">B · Một thuật toán hiện đại KHÁC</span><span class="v">bcrypt sang Argon2id, hoặc scrypt sang Argon2id. Chuỗi băm cũ KHÔNG nguy hiểm, nên chuyển đổi LƯỜI theo lần đăng nhập là ổn. Thay đổi duy nhất là <code>needsRehash</code> phải nhận ra tiền tố cũ và đường xác minh phải rẽ nhánh theo nó.</span></div>
  <div class="kv"><span class="k">C · Một sơ đồ ĐÃ HỎNG</span><span class="v">MD5 không muối, SHA-1, hoặc một cột lưu dạng rõ. Chuyển đổi lười <em>KHÔNG</em> đủ ở đây, vì những hàng đang có là một mối nguy NGAY LÚC NÀY — một cú rò hôm nay là lộ mọi mật khẩu hôm nay, kể cả của những người cả năm chưa đăng nhập.</span></div>
  <div class="kv"><span class="k">Khác biệt QUAN TRỌNG</span><span class="v">Ở A và B bạn đang CẢI THIỆN một thứ vốn đã tạm ổn. Ở C bạn đang KHOANH VÙNG một vấn đề đang sống. Chỉ C mới cần kỹ thuật bọc bên dưới, và chỉ C mới có một hạn chót.</span></div>
</div>

<h3>Chuyển đổi lười, cho A và B</h3>
<pre><code><span class="tok-comment">// Một hàm xác minh duy nhất, rẽ nhánh theo ĐỊNH DẠNG đã lưu</span>
import { hash, verify as argonVerify } from '@node-rs/argon2';
import bcrypt from 'bcrypt';

export async function checkPassword(oldHash: string, password: string): Promise&lt;boolean&gt; {
  if (oldHash.startsWith('$argon2')) return argonVerify(oldHash, password).catch(() =&gt; false);
  if (/^\\$2[aby]\\$/.test(oldHash))   return bcrypt.compare(password, oldHash);
  return false;                                   <span class="tok-comment">// định dạng lạ → trượt</span>
}

export function needsRehash(oldHash: string): boolean {
  return !oldHash.startsWith('$argon2id$') || weakerParams(oldHash);
}</code></pre>
<div class="out">$ SELECT left(bam, 10) AS dinh_dang, count(*) FROM "User" GROUP BY 1;

 dinh_dang  | count
------------+--------
 $argon2id$ | 12.847      ← da chuyen
 $2b$12$    | 41.209      ← chua, se tu chuyen khi ho dang nhap
 $2a$10$    |  3.118      ← con cu hon, cung the</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Tuần 1</span><span class="lz-t">Triển khai bộ rẽ nhánh</span><span class="lz-d">Không gì thay đổi với người dùng. Những tài khoản đang hoạt động bắt đầu tự chuyển ở lần đăng nhập kế tiếp, theo đúng nhịp người ta đăng nhập.</span></div>
  <div class="lz-step"><span class="lz-k">Tháng 3</span><span class="lz-t">Phần lớn đã xong</span><span class="lz-d">Thường thì 80–95% tài khoản còn dùng sẽ đã chuyển. Hãy theo dõi cái <code>GROUP BY</code> ở trên mỗi tuần; đó là toàn bộ báo cáo tiến độ.</span></div>
  <div class="lz-step"><span class="lz-k">Tháng 6</span><span class="lz-t">Phần đuôi là tài khoản ngủ đông</span><span class="lz-d">Thứ còn lại là những người chưa đăng nhập lần nào kể từ lúc bạn bắt đầu. Với tình huống A và B thì không sao — bcrypt cost 10 vẫn là một hàm băm THẬT — nên bạn cứ để đó cũng được.</span></div>
  <div class="lz-step"><span class="lz-k">Rồi tới lúc</span><span class="lz-t">Ép nốt số ít còn lại</span><span class="lz-d">Khi phần còn lại đủ nhỏ để thành một cuộc trò chuyện hỗ trợ chứ không phải một chiến dịch, hãy bắt đặt lại ở lần đăng nhập kế tiếp cho những hàng đó rồi XOÁ cái nhánh mã cũ. Gỡ được đường mã cũ là việc đáng làm.</span></div>
</div>

<h3>Tình huống C: BỌC chuỗi băm cũ lại, ngay hôm nay</h3>
<pre><code><span class="tok-comment">// Ý tưởng: chuỗi băm CŨ trở thành ĐẦU VÀO của hàm băm mới.</span>
<span class="tok-comment">// Bạn KHÔNG cần bản rõ để làm điều này — nên nó chạy được NGAY,</span>
<span class="tok-comment">// trên mọi hàng, trong một job chạy nền.</span>

bam_moi = argon2id( md5_hex_da_co )        <span class="tok-comment">// lưu kèm nhãn 'boc1$'</span></code></pre>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Trước</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">md5("123456")</span><span class="lz-nsub">e10adc3949ba59abbe56e057f20f883e · bẻ trong vài micro giây</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Bọc — không cần bản rõ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">argon2id(chuỗi hex đó)</span><span class="lz-nsub">boc1$argon2id$v=19$m=65536,t=2,p=1$… · giờ mỗi lần đoán tốn 187 ms</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Lúc đăng nhập</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">verify(md5(vừa gõ))</span><span class="lz-nsub">rồi lưu lại thành argon2id(vừa gõ) thuần</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// scripts/boc-md5.ts — chạy một lần, chia lô, nối lại được (Prisma 11.4)</span>
const LO = 500;
for (;;) {
  const needsWrap = await prisma.user.findMany({
    where: { bam: { not: { startsWith: '$' } } },   <span class="tok-comment">// còn là md5 hex trần</span>
    select: { id: true, bam: true },
    take: LO,
  });
  if (needsWrap.length === 0) break;

  for (const nd of needsWrap) {
    const wrapped = 'boc1$' + await hash(u.bam.toLowerCase(), PARAMS);
    await prisma.user.update({ where: { id: u.id }, data: { bam: boc } });
  }
  console.log(&#96;\${needsWrap.length} hang · \${new Date().toISOString()}&#96;);
  await new Promise((r) =&gt; setTimeout(r, 200));
}</code></pre>
<div class="out">500 hang · 2026-08-23T16:04:11.284Z
500 hang · 2026-08-23T16:05:38.902Z
…
57174 hang · 2026-08-23T18:47:02.118Z

# Sau 2 gio 43 phut: KHONG con mot chuoi md5 tran nao trong CSDL.
# Khong ai phai dat lai mat khau. Khong ai nhan mot email nao.</div>
<pre><code><span class="tok-comment">// Đường xác minh lo được cả hai, và GỠ BỌC khi thành công</span>
export async function checkPassword(oldHash: string, password: string) {
  if (oldHash.startsWith('boc1$')) {
    const trong = createHash('md5').update(password).digest('hex');
    return argonVerify(oldHash.slice(5), trong).catch(() =&gt; false);
  }
  if (oldHash.startsWith('$argon2')) return argonVerify(oldHash, password).catch(() =&gt; false);
  return false;
}

<span class="tok-comment">// canBamLai trả true cho mọi thứ bắt đầu bằng 'boc1$',</span>
<span class="tok-comment">// nên một lần đăng nhập thành công sẽ thay nó bằng argon2id thuần.</span></code></pre>
<div class="callout ok">
<p><strong>Vì sao đây là HÌNH DẠNG ĐÚNG.</strong> Bước bọc không cần bản rõ, nên nó chạy NGAY trên cả bảng — cơ sở dữ liệu thôi là một mối nguy trong vài giờ chứ không phải vài tháng. Việc gỡ bọc diễn ra một cách LƯỜI, nên không người dùng nào bị làm phiền. Và hai cơ chế đó ĐỘC LẬP với nhau: nếu job chạy nền chết giữa chừng thì CẢ HAI định dạng vẫn xác minh được, và bạn chỉ việc chạy lại. Mọi tính chất bạn muốn có ở một cuộc chuyển đổi, gói trong chừng bốn mươi dòng.</p>
</div>
<div class="pitfall">
<p><strong>Bẫy — phải khớp sơ đồ cũ TỪNG BYTE, kể cả chữ hoa chữ thường và cách mã hoá.</strong> Nếu cột cũ lưu hex CHỮ HOA mà bạn lại bọc bản chữ thường thì mọi hàng đã bọc trở nên KHÔNG BAO GIỜ xác minh được nữa, và những người dùng đó bị khoá ngoài không đường quay lại. Trước khi chạy job trên production: lấy một bản sao, bọc thử, rồi xác minh một mật khẩu THẬT đã biết với một hàng đã bọc. Nếu sơ đồ cũ có muối riêng hay một bí mật cấp ứng dụng cố định thì lớp bọc phải bao gồm ĐÚNG thứ đó, theo ĐÚNG thứ tự đó.</p>
</div>

<h3>Nhập từ một nhà cung cấp khác</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Hãy XIN chuỗi băm, đừng bắt đặt lại</span><span class="lz-lnote">Auth0, Firebase, Cognito và phần lớn các bên đều xuất chuỗi băm mật khẩu khi được yêu cầu, thường là bcrypt hoặc scrypt kèm tham số. Điều đó biến một cuộc di trú thành tình huống B — rẽ nhánh theo tiền tố rồi chuyển đổi lười — thay vì một cuộc đặt lại hàng loạt.</span></div>
  <div class="lz-layer"><span class="lz-lname">scrypt của Firebase KHÔNG phải scrypt chuẩn</span><span class="lz-lnote">Đó là một cấu trúc đã sửa đổi, có khoá ký riêng theo dự án, một dấu phân cách muối và mã hoá base64. Bản xuất có kèm những tham số đó và đã có các bản cài đặt công bố sẵn; điều bạn KHÔNG được làm là giả định <code>crypto.scrypt</code> sẽ xác minh được nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Xác minh với tài khoản THẬT trước khi cắt chuyển</span><span class="lz-lnote">Hãy nhập vào một cơ sở dữ liệu staging rồi đăng nhập bằng ba tài khoản thử THẬT mà bạn biết mật khẩu. Một cuộc di trú lặng lẽ khoá tất cả mọi người sẽ do NGƯỜI DÙNG phát hiện ra, vào đúng thời điểm tệ nhất.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tính trước cho những tài khoản KHÔNG nhập được</span><span class="lz-lnote">Đăng nhập qua mạng xã hội thì chẳng có mật khẩu nào để di trú — những người đó phải tiếp tục dùng đúng nhà cung cấp đó, hoặc đi qua luồng liên kết tài khoản của Chương 6. Hãy quyết chuyện này TRƯỚC lúc cắt chuyển, vì đây là nhóm dễ bị quên nhất.</span></div>
</div>
<div class="note-ct">
<p><strong>Sao không cứ gửi email cho tất cả?</strong> Một email "hãy đặt lại mật khẩu" gửi hàng loạt thì KHÔNG phân biệt nổi với lừa đảo — đúng cái hành vi mà bạn dành cả năm để dạy người dùng đừng tin. Nó tạo một cú vọt phiếu hỗ trợ, và một tỉ lệ lớn người dùng đơn giản là không hành động, nên bạn kết thúc với những tài khoản ngủ đông và một cuộc di trú DỞ DANG, <em>CỘNG THÊM</em> cái giá về uy tín. Hãy làm lặng lẽ bằng kỹ thuật ở trên, và để dành cái email đó cho trường hợp bạn CÓ bằng chứng về một cú lộ thật — nơi thông điệp là trung thực, cụ thể, và đáng gửi.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#upgrading-legacy-hashes" target="_blank" rel="noopener"><span class="lc-ico">⬆️</span><span class="lc-body"><span class="lc-title">OWASP — nâng cấp hàm băm cũ</span><span class="lc-sub">cheatsheetseries.owasp.org · Kỹ thuật bọc, nói bằng lời của chính tài liệu</span></span></a>
<a class="link-card" href="https://auth0.com/docs/manage-users/user-migration/bulk-user-imports" target="_blank" rel="noopener"><span class="lc-ico">📥</span><span class="lc-body"><span class="lc-title">Auth0 — định dạng nhập người dùng hàng loạt</span><span class="lc-sub">auth0.com · Bản xuất chứa những trường băm nào, và chúng nghĩa là gì</span></span></a>
<a class="link-card" href="https://github.com/firebase/scrypt" target="_blank" rel="noopener"><span class="lc-ico">🔥</span><span class="lc-body"><span class="lc-title">scrypt của Firebase</span><span class="lc-sub">github.com · Cấu trúc đã sửa đổi, kèm một bản cài đặt tham chiếu</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Prisma ORM</span><span class="lc-sub">Script nạp bù chia lô, nối lại được — đúng cái mẫu mà job bọc dùng</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Bọc một bảng chuỗi băm MD5 không muối, rồi đăng nhập và xem một hàng tự gỡ bọc</span></span></a>
</div>
`,
    },
    /* ─────────────────────────── 2.6 ─────────────────────────── */
    {
      title: '2.6 — Quiz: passwords|||2.6 — Quiz: mật khẩu',
      slug: 'auth-2-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về hàm băm chậm, muối, tham số chọn bằng phép đo, luồng đăng nhập bằng nhau ở mọi nhánh, chính sách theo NIST, và kỹ thuật bọc khi chuyển đổi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.6</span>
<h2>Quiz: passwords</h2>
<p class="lead">Eight questions. Three of them contradict advice that is still printed on security-awareness posters, which is the point — the guidance changed because it was measured.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> Design as though the database is already stolen; a fast hash falls in minutes and salt does not slow anything down (2.1). Pick Argon2id, and pick its parameters by measuring on production hardware against a latency budget (2.2). Make both login branches cost the same, in message, status and duration, and rehash on successful login (2.3). Length and a breach blocklist replace composition rules and forced rotation (2.4). Wrap broken hashes today rather than emailing everyone (2.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.6</span>
<h2>Quiz: mật khẩu</h2>
<p class="lead">Tám câu. Ba trong số đó MÂU THUẪN với những lời khuyên vẫn còn in trên áp phích tuyên truyền bảo mật, và đó chính là điểm mấu chốt — hướng dẫn đã thay đổi vì người ta đã ĐO.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Hãy thiết kế như thể cơ sở dữ liệu ĐÃ bị lấy mất; một hàm băm nhanh đổ trong vài phút và muối thì KHÔNG làm chậm gì cả (2.1). Chọn Argon2id, và chọn tham số của nó bằng cách ĐO trên phần cứng production so với một ngân sách độ trễ (2.2). Làm cho cả hai nhánh đăng nhập tốn NHƯ NHAU, ở thông báo, mã trạng thái và thời gian, và băm lại khi đăng nhập thành công (2.3). Độ dài và một danh sách chặn từ các vụ rò THAY THẾ cho luật thành phần ký tự và việc bắt đổi định kỳ (2.4). Hãy BỌC những chuỗi băm hỏng ngay hôm nay thay vì gửi email cho tất cả (2.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why is SHA-256 the wrong tool for storing passwords?|||Vì sao SHA-256 là công cụ SAI để cất mật khẩu?',
            options: [
              'It has known collisions|||Nó có những cú trùng đã biết',
              'It is designed to be fast, so a GPU does about 20 billion guesses per second — the whole 8-character alphanumeric space in about two minutes|||Nó được thiết kế để NHANH, nên một GPU đoán chừng 20 tỉ lần mỗi giây — hết cả không gian 8 ký tự chữ-số trong khoảng hai phút',
              'It produces a digest that is too short|||Nó cho ra chuỗi băm quá ngắn',
              'It cannot be salted|||Nó không thêm muối được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does a per-user salt accomplish, and what does it not?|||Muối riêng từng người đạt được gì, và KHÔNG đạt được gì?',
            options: [
              'It slows each guess down by a fixed factor|||Nó làm mỗi lần đoán chậm đi theo một hệ số cố định',
              'It kills precomputed tables and hides duplicate passwords, but does not slow a single guess at all — the cost factor does that|||Nó giết chết bảng tính sẵn và giấu những mật khẩu trùng nhau, nhưng KHÔNG làm chậm một lần đoán chút nào — cái đó là việc của tham số chi phí',
              'It must be kept secret, like a key|||Nó phải được giữ bí mật, như một cái khoá',
              'It replaces the need for a slow hash|||Nó thay thế được nhu cầu có một hàm băm chậm',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'How should you choose Argon2id parameters?|||Nên chọn tham số Argon2id như thế nào?',
            options: [
              'Copy the values from the library README|||Chép các giá trị từ README của thư viện',
              'Fix a latency budget (say 250 ms), measure on the hardware that will run production, and take the strongest parameters that fit — preferring memory over time|||Chốt một ngân sách độ trễ (ví dụ 250 ms), ĐO trên chính phần cứng sẽ chạy production, rồi lấy bộ tham số mạnh nhất còn vừa — ưu tiên bộ nhớ hơn thời gian',
              'Use the maximum the library allows|||Dùng mức tối đa mà thư viện cho phép',
              'Match whatever your previous system used|||Khớp với hệ thống trước đó của bạn dùng gì',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does a slow password hash need a concurrency limit?|||Vì sao một hàm băm mật khẩu chậm cần một giới hạn số lần chạy song song?',
            options: [
              'To keep hashes deterministic|||Để giữ cho chuỗi băm có tính tất định',
              'Because memory cost multiplies by concurrent requests: 64 MiB x 100 simultaneous failed logins is 6.4 GB, so an unauthenticated endpoint becomes a denial-of-service amplifier|||Vì chi phí bộ nhớ NHÂN với số request song song: 64 MiB x 100 lần đăng nhập trượt cùng lúc là 6,4 GB, nên một endpoint không cần xác thực trở thành bộ khuếch đại tấn công từ chối dịch vụ',
              'Because Argon2 is not thread-safe|||Vì Argon2 không an toàn với đa luồng',
              'To avoid salt collisions|||Để tránh trùng muối',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A login returns 401 "Sai mat khau" in 194 ms and 401 "Email khong ton tai" in 6 ms. What must change?|||Một cái đăng nhập trả 401 "Sai mat khau" trong 194 ms và 401 "Email khong ton tai" trong 6 ms. Phải đổi cái gì?',
            options: [
              'Only the message — make both say the same thing|||Chỉ cần đổi thông báo — cho cả hai nói cùng một câu',
              'Message, status and duration: one generic message, always 401, and hash a fixed dummy hash on the user-not-found path so both branches cost the same|||Thông báo, mã trạng thái VÀ thời gian: một thông báo chung chung, luôn là 401, và băm với một chuỗi băm giả cố định trên nhánh không-tìm-thấy để hai nhánh tốn như nhau',
              'Only the timing — the messages are fine|||Chỉ cần đổi thời gian — thông báo thì ổn rồi',
              'Nothing; 401 in both cases is already correct|||Không cần đổi gì; 401 ở cả hai trường hợp là đã đúng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'When can you upgrade a stored hash to stronger parameters?|||Khi nào bạn nâng cấp được một chuỗi băm đã lưu lên tham số mạnh hơn?',
            options: [
              'Any time, by re-hashing the stored digest|||Bất cứ lúc nào, bằng cách băm lại chính chuỗi băm đã lưu',
              'Only at a successful login, because that is the only moment you hold the plaintext — the stored string carries its own parameters, so the check is four lines|||Chỉ lúc đăng nhập THÀNH CÔNG, vì đó là khoảnh khắc DUY NHẤT bạn cầm được bản rõ — chuỗi đã lưu tự mang tham số của nó, nên phép kiểm chỉ bốn dòng',
              'During a scheduled migration script|||Trong một script chuyển đổi chạy theo lịch',
              'Never; you must force a password reset|||Không bao giờ; bạn buộc phải bắt đặt lại mật khẩu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which password policy rules does NIST SP 800-63B now recommend against?|||NIST SP 800-63B hiện KHUYẾN NGHỊ KHÔNG dùng những luật chính sách mật khẩu nào?',
            options: [
              'Minimum length and blocklists|||Độ dài tối thiểu và danh sách chặn',
              'Composition rules, forced periodic rotation, password hints, security questions and blocking paste — all of them measurably make passwords worse|||Luật thành phần ký tự, bắt đổi định kỳ, gợi ý mật khẩu, câu hỏi bảo mật và chặn dán — tất cả đều làm mật khẩu tệ đi theo cách đo được',
              'Rate limiting|||Giới hạn tốc độ',
              'Allowing Unicode characters|||Cho phép ký tự Unicode',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You inherit a table of unsalted MD5 hashes. What is the fastest way to make the database safe?|||Bạn tiếp quản một bảng chuỗi băm MD5 không muối. Cách NHANH NHẤT để làm cơ sở dữ liệu an toàn là gì?',
            options: [
              'Email everyone to reset their password|||Gửi email cho tất cả bắt đặt lại mật khẩu',
              'Wrap each existing digest — store argon2id(the md5 hex) with a marker prefix. No plaintext is needed, so it runs over the whole table now, and login unwraps each row lazily|||BỌC từng chuỗi băm đang có — lưu argon2id(chuỗi md5 hex) kèm một tiền tố đánh dấu. Không cần bản rõ nên nó chạy trên CẢ bảng ngay bây giờ, và việc đăng nhập gỡ bọc từng hàng một cách lười',
              'Wait for users to log in and rehash then|||Chờ người dùng đăng nhập rồi băm lại lúc đó',
              'Add a salt column and re-run MD5|||Thêm một cột muối rồi chạy lại MD5',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
