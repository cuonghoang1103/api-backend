/**
 * Authentication — Chương 11: Vận hành nó.
 * Bí mật · xoay khoá không gián đoạn · giới hạn tần suất · nhật ký kiểm toán ·
 * giám sát và ứng cứu sự cố · quiz.
 * Output CHẠY THẬT Node.js 22 + Express 5 + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fauthentication%2Flearn&reflabel=Auth';

export default {
  title: 'Chapter 11 — Running it|||Chương 11 — Vận hành nó',
  description: 'Mã đúng rồi thì công việc mới bắt đầu: bí mật phải tới được tiến trình mà không đi qua kho mã, khoá phải xoay được mà không đá ai ra ngoài, trần tần suất phải sống nổi với lưu lượng thật, nhật ký phải ghi đủ để điều tra mà không tự nó thành một vụ rò rỉ, và ai đó phải được ĐÁNH THỨC khi có chuyện.',
  lessons: [

    /* ─────────────────────────── 11.1 ─────────────────────────── */
    {
      title: '11.1 — Secrets: getting them to the process without touching the repo|||11.1 — Bí mật: đưa chúng tới tiến trình mà không đụng vào kho mã',
      slug: 'auth-11-1-bi-mat',
      type: 'LESSON',
      description: 'Khoá ký, chuỗi kết nối, khoá API của bên thứ ba — chúng phải có mặt lúc chạy và không được có mặt trong git. Bài này đo THẬT 155 biến môi trường của kho mã này, chỉ ra chỗ tài liệu đã trôi dạt, và xếp bốn cách đưa bí mật vào tiến trình theo đúng thứ tự bạn nên leo lên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>Secrets: getting them to the process without touching the repo</h2>
<p class="lead">Lesson 1.5 said where a secret should live. This one is about the operational reality: a running process needs the value, a repository must never contain it, a new engineer needs to start the app on Monday, and the person who rotates it needs to know every place it is used. Those four requirements pull in different directions, which is why this goes wrong so consistently.</p>

<h3>Four ways in, ranked</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Worst</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">In the code</span><span class="lz-nsub">A default fallback, a test fixture, a comment · it is now in the history forever, even after you delete it</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Baseline</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">An env file on the host</span><span class="lz-nsub">Ignored by git, owned by root, mode 600 · what most products actually run, and it is defensible</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Better</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A secrets manager</span><span class="lz-nsub">Fetched at boot with an identity the machine has · audit trail, rotation, no file to leak</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Best, where available</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">No long-lived secret at all</span><span class="lz-nsub">Workload identity: the platform vouches for the process and the credential is minted per request</span></div></div>
  </div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Deleting a committed secret does not remove it</span><span class="v">It stays in the history, in every clone, in every fork and in the CI cache. The only correct response is to <em>rotate</em> — treat the value as burned, issue a new one, and consider rewriting history a tidiness measure rather than a fix.</span></div>
  <div class="kv"><span class="k">A default value is the most common way one gets committed</span><span class="v"><code>process.env.JWT_SECRET ?? 'dev-secret'</code> ships a working fallback, so nothing fails when the variable is missing — and production runs on a secret that is in the repository. Fail loudly at boot instead; see below.</span></div>
  <div class="kv"><span class="k">The env file has one real advantage</span><span class="v">It survives deploys. On this project it lives at <code>/opt/cuonghoangdev/.env</code> on the VPS, outside the deployed tree, so values added there persist across releases — which is exactly the property that makes it workable and the reason nobody remembers what is in it.</span></div>
  <div class="kv"><span class="k">Scan for secrets in CI, not in review</span><span class="v">A pre-commit hook plus a CI scanner (gitleaks, trufflehog, the platform's own push protection) catches the accidental paste. Human review catches it too, until the week everybody is busy.</span></div>
</div>

<h3>Fail at boot, not at 3am</h3>
<pre><code><span class="tok-comment">// Kiểm MỘT lần lúc khởi động. Thiếu bí mật ⇒ tiến trình KHÔNG chạy.</span>
const CanCo = z.object({
  DATABASE_URL:   z.string().url(),
  JWT_SECRET:     z.string().min(32),        <span class="tok-comment">// KHÔNG có giá trị mặc định</span>
  REDIS_URL:      z.string().url(),
  URL_CONG_KHAI:  z.string().url(),          <span class="tok-comment">// ← Bài 6.3, chặn đầu độc Host</span>
});

export const env = CanCo.parse(process.env);  <span class="tok-comment">// ném lỗi ngay lúc nạp module</span>

<span class="tok-comment">// SAI, và đây là cách một bí mật dev đi tới production:</span>
<span class="tok-comment">// const secret = process.env.JWT_SECRET ?? 'dev-secret';</span></code></pre>
<div class="pitfall">
<p><strong>Bẫy — a missing variable that defaults silently is worse than a crash, because it is invisible.</strong> With a fallback, the app starts, tokens are signed with a value an attacker can read in your repository, and everything looks healthy. With a validated schema the process refuses to start, the deploy fails, and someone fixes it in two minutes. Validate at module load so the failure happens during the deploy rather than on the first request that happens to need it — and put <code>URL_CONG_KHAI</code> in the required set, because a missing public URL is how Lesson 6.3's reset link falls back to the <code>Host</code> header.</p>
</div>

<h3>Documentation drifts. Measured, in this repository</h3>
<div class="out">bien doc trong src/          : 155
bien khai trong .env.example : 135
doc ma KHONG duoc khai       :  84

   AI_CHAT_CLAUDE_MAX_TOKENS
   AI_CHAT_CLAUDE_TIMEOUT_MS
   AI_CHAT_DOC_CHARS
   AI_CHAT_MAX_TOKENS_PRO
   AI_CHAT_MODEL_VISION
   … va 79 bien nua

# Khong phai mot vu ro ri — phan lon la CO CHINH, khong phai bi mat, va
# chung deu co gia tri mac dinh hop ly. Nhung: mot nguoi moi vao khong
# biet co the chinh nhung gi, va nguoi di XOAY mot khoa khong co danh
# sach nao de doi chieu. Danh sach do phai SINH RA TU MA, khong go tay.</div>
<pre><code><span class="tok-comment">// Sinh .env.example TỪ MÃ, rồi để CI báo hỏng khi nó lệch.</span>
grep -rhoE 'process\\.env\\.[A-Z0-9_]+' src/ | sed 's/process\\.env\\.//' | sort -u &gt; /tmp/dang-doc
grep -oE '^[A-Z0-9_]+' .env.example | sort -u &gt; /tmp/dang-khai
diff /tmp/dang-doc /tmp/dang-khai || exit 1        <span class="tok-comment">// lệch là CI đỏ</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Separate configuration from secrets</span><span class="lz-t">They have different rules</span><span class="lz-d">A timeout, a model name and a feature flag can live in the repository and change with a pull request. A signing key cannot. Mixing them in one file means the whole file gets treated with the care of its least sensitive line.</span></div>
  <div class="lz-step"><span class="lz-k">Document every variable, including the boring ones</span><span class="lz-t">Name, purpose, default, and who owns it</span><span class="lz-d">The eighty-four undocumented variables above are all harmless individually. Collectively they are the reason nobody can answer "what does this service need to run?" without reading the source.</span></div>
  <div class="lz-step"><span class="lz-k">Adding a variable is a four-step change</span><span class="lz-t">And step four is not code</span><span class="lz-d">Local env, <code>.env.example</code>, the container definition, and <em>telling the person who manages production</em>. That last step cannot be automated from inside the repository, and skipping it is the most common cause of a deploy that passes CI and fails on the host.</span></div>
  <div class="lz-step"><span class="lz-k">Never expose a secret to the browser</span><span class="lz-t"><code>NEXT_PUBLIC_</code> is a one-way door</span><span class="lz-d">Anything with that prefix is compiled into the client bundle and is public forever. A third-party API key belongs behind a small authenticated proxy route on your own server, reading the key from runtime env.</span></div>
</div>

<h3>Rotation, which is the whole point of the exercise</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">A secret you cannot rotate is a secret you will not rotate</span><span class="lz-lnote">If rotating the signing key logs out every user, it will not happen until an incident forces it — at the worst possible moment. Lesson 11.2 builds the overlap that makes it routine, and the ability to do it calmly is the actual deliverable.</span></div>
  <div class="lz-layer"><span class="lz-lname">Know where each secret is used before you change it</span><span class="lz-lnote">One key referenced by the API, a worker, a cron job and a staging environment needs all four updated. A grep across the organisation, not just this repository, and a written list per secret.</span></div>
  <div class="lz-layer"><span class="lz-lname">Rotate on a schedule and on every departure</span><span class="lz-lnote">Anyone who had access to production configuration takes a copy in their memory and possibly in a terminal history. Rotation on departure is a process decision, and it is cheap once rotation is routine.</span></div>
  <div class="lz-layer"><span class="lz-lname">Log access to secrets, never their values</span><span class="lz-lnote">A secrets manager gives you "who read this, when" for free, which is worth having before an incident asks. What must never appear anywhere is the value itself — including in an error message that helpfully prints the configuration it failed to parse.</span></div>
</div>
<div class="note-ct">
<p><strong>The realistic target for a small team.</strong> An env file on the host outside the deploy tree, mode 600, never in git; a validated schema that refuses to boot without the required values; a generated <code>.env.example</code> checked in CI; a secret scanner on every push; and one written page listing each secret, where it is used, and how to rotate it. That is a day of work, it covers the failures in this lesson, and it is a long way ahead of most production systems. A secrets manager is better and it is the next step, not the first one.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">OWASP — secrets management</span><span class="lc-sub">cheatsheetseries.owasp.org · Storage, rotation and the leakage paths</span></span></a>
<a class="link-card" href="https://github.com/gitleaks/gitleaks" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">gitleaks</span><span class="lc-sub">github.com · A scanner for pre-commit hooks and CI</span></span></a>
<a class="link-card" href="https://12factor.net/config" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — config</span><span class="lc-sub">12factor.net · Why configuration belongs in the environment, and the limits of that</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">CuongThai course — Docker</span><span class="lc-sub">Build arguments versus runtime environment, and what ends up in an image layer</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Commit a secret, remove it, then find it again in the history</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Bí mật: đưa chúng tới tiến trình mà không đụng vào kho mã</h2>
<p class="lead">Bài 1.5 nói bí mật NÊN sống ở đâu. Bài này nói về thực tế vận hành: một tiến trình đang chạy CẦN cái giá trị đó, một kho mã KHÔNG BAO GIỜ được chứa nó, một kỹ sư mới cần khởi động được ứng dụng vào sáng thứ Hai, và người đi XOAY nó cần biết MỌI chỗ nó đang được dùng. Bốn yêu cầu ấy kéo về bốn hướng khác nhau, và đó là lý do chuyện này sai một cách đều đặn tới vậy.</p>

<h3>Bốn cách đưa vào, xếp hạng</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Tệ nhất</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Nằm trong mã</span><span class="lz-nsub">Một giá trị mặc định, một bộ dữ liệu kiểm thử, một dòng chú thích · giờ nó nằm trong lịch sử VĨNH VIỄN, kể cả sau khi bạn xoá</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Mức nền</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một tệp env trên máy chủ</span><span class="lz-nsub">Bị git lờ đi, thuộc về root, quyền 600 · đây là thứ phần lớn sản phẩm THẬT SỰ chạy, và nó bảo vệ được</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Tốt hơn</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một trình quản lý bí mật</span><span class="lz-nsub">Lấy về lúc khởi động bằng một danh tính mà máy có · có dấu vết kiểm toán, có xoay vòng, không còn cái tệp nào để rò</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Tốt nhất, nơi nào có</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">KHÔNG có bí mật dài hạn nào cả</span><span class="lz-nsub">Danh tính khối việc: nền tảng bảo lãnh cho tiến trình và tín vật được đúc ra cho từng lời gọi</span></div></div>
  </div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Xoá một bí mật đã commit KHÔNG gỡ bỏ được nó</span><span class="v">Nó ở lại trong lịch sử, trong mọi bản clone, trong mọi bản fork và trong bộ nhớ đệm của CI. Phản ứng đúng DUY NHẤT là <em>XOAY</em> — hãy coi giá trị đó là đã cháy, phát một cái mới, và coi việc viết lại lịch sử là chuyện dọn dẹp cho gọn chứ không phải cách vá.</span></div>
  <div class="kv"><span class="k">Giá trị MẶC ĐỊNH là cách phổ biến nhất khiến một bí mật bị commit</span><span class="v"><code>process.env.JWT_SECRET ?? 'dev-secret'</code> đưa lên một đường lùi CHẠY ĐƯỢC, nên chẳng có gì hỏng khi biến bị thiếu — và production chạy trên một bí mật nằm sẵn trong kho mã. Hãy hỏng THẬT TO ngay lúc khởi động; xem ngay dưới đây.</span></div>
  <div class="kv"><span class="k">Tệp env có đúng MỘT ưu điểm thật</span><span class="v">Nó SỐNG SÓT qua các lần deploy. Ở dự án này nó nằm tại <code>/opt/cuonghoangdev/.env</code> trên VPS, NGOÀI cây mã được triển khai, nên những giá trị thêm vào đó tồn tại qua các bản phát hành — mà đó chính là tính chất làm cho nó dùng được, và cũng là lý do chẳng ai còn nhớ trong đó có gì.</span></div>
  <div class="kv"><span class="k">Quét bí mật trong CI, đừng quét lúc review</span><span class="v">Một hook trước commit cộng một bộ quét trong CI (gitleaks, trufflehog, hoặc lớp bảo vệ push của chính nền tảng) bắt được cú dán nhầm. Người review cũng bắt được, cho tới đúng cái tuần mà ai cũng bận.</span></div>
</div>

<h3>Hỏng ngay lúc khởi động, đừng hỏng lúc ba giờ sáng</h3>
<pre><code><span class="tok-comment">// Kiểm MỘT lần lúc khởi động. Thiếu bí mật ⇒ tiến trình KHÔNG chạy.</span>
const CanCo = z.object({
  DATABASE_URL:   z.string().url(),
  JWT_SECRET:     z.string().min(32),        <span class="tok-comment">// KHÔNG có giá trị mặc định</span>
  REDIS_URL:      z.string().url(),
  URL_CONG_KHAI:  z.string().url(),          <span class="tok-comment">// ← Bài 6.3, chặn đầu độc Host</span>
});

export const env = CanCo.parse(process.env);  <span class="tok-comment">// ném lỗi ngay lúc nạp module</span>

<span class="tok-comment">// SAI, và đây là cách một bí mật dev đi tới production:</span>
<span class="tok-comment">// const secret = process.env.JWT_SECRET ?? 'dev-secret';</span></code></pre>
<div class="pitfall">
<p><strong>Bẫy — một biến bị thiếu mà LẶNG LẼ rơi về giá trị mặc định thì tệ hơn một cú sập, vì nó VÔ HÌNH.</strong> Có đường lùi thì ứng dụng khởi động, token được ký bằng một giá trị mà kẻ tấn công đọc được ngay trong kho mã của bạn, và mọi thứ trông khoẻ mạnh. Có một schema kiểm chứng thì tiến trình từ chối khởi động, lần deploy thất bại, và có người sửa nó trong hai phút. Hãy kiểm ngay lúc NẠP MODULE để sự cố xảy ra trong lúc deploy chứ không phải ở cái request đầu tiên tình cờ cần tới nó — và hãy đặt <code>URL_CONG_KHAI</code> vào nhóm bắt buộc, vì thiếu một URL công khai chính là cách mà đường dẫn đặt lại ở Bài 6.3 rơi về header <code>Host</code>.</p>
</div>

<h3>Tài liệu thì TRÔI DẠT. Đo thật, trên chính kho mã này</h3>
<div class="out">bien doc trong src/          : 155
bien khai trong .env.example : 135
doc ma KHONG duoc khai       :  84

   AI_CHAT_CLAUDE_MAX_TOKENS
   AI_CHAT_CLAUDE_TIMEOUT_MS
   AI_CHAT_DOC_CHARS
   AI_CHAT_MAX_TOKENS_PRO
   AI_CHAT_MODEL_VISION
   … va 79 bien nua

# Khong phai mot vu ro ri — phan lon la CO CHINH, khong phai bi mat, va
# chung deu co gia tri mac dinh hop ly. Nhung: mot nguoi moi vao khong
# biet co the chinh nhung gi, va nguoi di XOAY mot khoa khong co danh
# sach nao de doi chieu. Danh sach do phai SINH RA TU MA, khong go tay.</div>
<pre><code><span class="tok-comment">// Sinh .env.example TỪ MÃ, rồi để CI báo hỏng khi nó lệch.</span>
grep -rhoE 'process\\.env\\.[A-Z0-9_]+' src/ | sed 's/process\\.env\\.//' | sort -u &gt; /tmp/dang-doc
grep -oE '^[A-Z0-9_]+' .env.example | sort -u &gt; /tmp/dang-khai
diff /tmp/dang-doc /tmp/dang-khai || exit 1        <span class="tok-comment">// lệch là CI đỏ</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Tách CẤU HÌNH ra khỏi BÍ MẬT</span><span class="lz-t">Chúng có luật khác nhau</span><span class="lz-d">Một cái timeout, một tên model và một cờ tính năng thì nằm trong kho mã được và đổi bằng một pull request. Một khoá ký thì không. Trộn chúng vào một tệp nghĩa là cả tệp bị đối xử với mức cẩn thận của cái dòng ÍT nhạy cảm nhất trong đó.</span></div>
  <div class="lz-step"><span class="lz-k">Ghi tài liệu cho MỌI biến, kể cả những cái nhàm chán</span><span class="lz-t">Tên, mục đích, mặc định, và ai sở hữu nó</span><span class="lz-d">Tám mươi tư biến không có tài liệu ở trên thì từng cái một đều vô hại. Gộp lại, chúng là lý do không ai trả lời nổi câu "dịch vụ này cần gì để chạy?" nếu không mở mã nguồn ra đọc.</span></div>
  <div class="lz-step"><span class="lz-k">Thêm một biến là một thay đổi BỐN bước</span><span class="lz-t">Và bước thứ tư không phải là mã</span><span class="lz-d">Env cục bộ, <code>.env.example</code>, định nghĩa container, và <em>BÁO cho người quản lý production</em>. Bước cuối đó không tự động hoá được từ bên trong kho mã, và bỏ qua nó là nguyên nhân phổ biến nhất của một lần deploy qua được CI rồi hỏng ngay trên máy chủ.</span></div>
  <div class="lz-step"><span class="lz-k">Đừng bao giờ phơi bí mật ra trình duyệt</span><span class="lz-t"><code>NEXT_PUBLIC_</code> là cánh cửa một chiều</span><span class="lz-d">Bất cứ thứ gì mang tiền tố đó đều được biên dịch thẳng vào gói của client và trở thành CÔNG KHAI vĩnh viễn. Một khoá API của bên thứ ba thuộc về phía sau một tuyến proxy nhỏ có xác thực trên máy chủ CỦA BẠN, đọc khoá từ biến môi trường lúc chạy.</span></div>
</div>

<h3>Xoay vòng, thứ chính là toàn bộ mục đích của bài tập này</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Một bí mật KHÔNG xoay được là một bí mật bạn SẼ KHÔNG xoay</span><span class="lz-lnote">Nếu xoay khoá ký làm đăng xuất mọi người dùng thì chuyện đó sẽ không xảy ra cho tới khi một sự cố ép phải làm — vào đúng thời điểm tệ nhất có thể. Bài 11.2 dựng phần chồng lấn biến nó thành việc thường ngày, và khả năng làm nó một cách BÌNH THẢN mới là sản phẩm thật.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hãy biết mỗi bí mật đang được dùng Ở ĐÂU trước khi đổi nó</span><span class="lz-lnote">Một cái khoá được API, một worker, một cron job và một môi trường thử nghiệm cùng tham chiếu thì cần cập nhật cả bốn. Hãy grep trên toàn TỔ CHỨC chứ không riêng kho mã này, và giữ một danh sách viết ra cho từng bí mật.</span></div>
  <div class="lz-layer"><span class="lz-lname">Xoay theo LỊCH, và xoay ở mỗi lần có người rời đi</span><span class="lz-lnote">Bất kỳ ai từng có quyền vào cấu hình production đều mang theo một bản sao trong trí nhớ và có thể trong lịch sử terminal. Xoay khi có người nghỉ là một quyết định quy trình, và nó rẻ một khi việc xoay đã thành thường ngày.</span></div>
  <div class="lz-layer"><span class="lz-lname">Ghi log việc TRUY CẬP bí mật, đừng bao giờ ghi GIÁ TRỊ</span><span class="lz-lnote">Một trình quản lý bí mật cho bạn "ai đã đọc cái này, lúc nào" miễn phí, và thứ đó đáng có TRƯỚC khi một sự cố hỏi tới. Cái tuyệt đối không được xuất hiện ở đâu là chính cái giá trị — kể cả trong một thông báo lỗi đang nhiệt tình in ra cấu hình mà nó không phân tích nổi.</span></div>
</div>
<div class="note-ct">
<p><strong>Mục tiêu thực tế cho một đội nhỏ.</strong> Một tệp env trên máy chủ NGOÀI cây triển khai, quyền 600, không bao giờ vào git; một schema kiểm chứng từ chối khởi động khi thiếu giá trị bắt buộc; một <code>.env.example</code> SINH RA TỰ ĐỘNG và được CI kiểm; một bộ quét bí mật ở mọi lần push; và MỘT trang viết ra liệt kê từng bí mật, nó dùng ở đâu, và xoay nó thế nào. Chừng đó là một ngày công, nó phủ hết những kiểu hỏng trong bài này, và nó đã đi trước phần lớn các hệ thống production một quãng dài. Một trình quản lý bí mật thì tốt hơn và nó là BƯỚC TIẾP THEO, không phải bước đầu tiên.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🔐</span><span class="lc-body"><span class="lc-title">OWASP — quản lý bí mật</span><span class="lc-sub">cheatsheetseries.owasp.org · Lưu trữ, xoay vòng và các đường rò rỉ</span></span></a>
<a class="link-card" href="https://github.com/gitleaks/gitleaks" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">gitleaks</span><span class="lc-sub">github.com · Một bộ quét cho hook trước commit và cho CI</span></span></a>
<a class="link-card" href="https://12factor.net/config" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">The Twelve-Factor App — cấu hình</span><span class="lc-sub">12factor.net · Vì sao cấu hình thuộc về môi trường, và giới hạn của điều đó</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Docker</span><span class="lc-sub">Tham số lúc dựng so với biến môi trường lúc chạy, và cái gì rốt cuộc nằm lại trong một lớp ảnh</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Commit một bí mật, gỡ nó ra, rồi tìm lại nó trong lịch sử</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 11.2 ─────────────────────────── */
    {
      title: '11.2 — Rotating a key without logging everyone out|||11.2 — Xoay một cái khoá mà không đá tất cả mọi người ra ngoài',
      slug: 'auth-11-2-xoay-khoa',
      type: 'LESSON',
      description: 'Xoay khoá ký là một thao tác BỐN giai đoạn, và đảo thứ tự hai giai đoạn đầu là mọi token đang chạy chết ngay lập tức. Bài này chạy thật cả bốn giai đoạn, cho thấy cái xảy ra khi bỏ qua bước công bố, rồi mở rộng cùng cái mẫu đó sang bí mật phiên, khoá mã hoá và tín vật của bên thứ ba.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>Rotating a key without logging everyone out</h2>
<p class="lead">Lesson 4.4 named keys with <code>kid</code> so this would be possible. This lesson does it: four phases, in one order, with an overlap window sized by the longest-lived thing the key signs. Get the order right and nobody notices; get it wrong and every token in flight becomes invalid in the same second.</p>

<h3>The four phases, run for real</h3>
<div class="out">token CU (ky bang k1) va token MOI (ky bang khoa dang hoat dong), qua bon giai doan:

0. Truoc khi xoay          — chum { k1 }
     token cu (k1) -&gt; CHAP NHAN
     token moi (k1) -&gt; CHAP NHAN
1. CONG BO k2 (chua ky)    — chum { k1, k2 }
     token cu (k1) -&gt; CHAP NHAN
     token moi (k1) -&gt; CHAP NHAN
2. Doi sang KY bang k2     — chum { k1, k2 }
     token cu (k1) -&gt; CHAP NHAN
     token moi (k2) -&gt; CHAP NHAN
3. Rut k1 sau khi het han  — chum { k2 }
     token cu (k1) -&gt; TU CHOI (khong biet kid=k1)
     token moi (k2) -&gt; CHAP NHAN

=== Neu bo qua giai doan 1 (ky bang k2 NGAY, chum chua co k2): ===
     token moi (k2) -&gt; TU CHOI (khong biet kid=k2)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Phase 1 · Publish</span><span class="lz-t">Verify with it, do not sign with it</span><span class="lz-d">Add the new key to the verifying set and deploy everywhere. Nothing changes for any user; you are only teaching every instance that <code>k2</code> exists. Wait until every instance has it — a rolling deploy means "deployed" and "everywhere" are different moments.</span></div>
  <div class="lz-step"><span class="lz-k">Phase 2 · Sign</span><span class="lz-t">Flip the active key</span><span class="lz-d">New tokens carry <code>kid: k2</code>. Old tokens still verify because <code>k1</code> is still in the set. This is the only phase users could notice, and they do not.</span></div>
  <div class="lz-step"><span class="lz-k">Phase 3 · Wait</span><span class="lz-t">The longest lifetime, plus slack</span><span class="lz-d">If access tokens live fifteen minutes, wait an hour. If the key also signs something that lives thirty days, wait thirty days — the overlap is set by the longest-lived artefact, not by the shortest.</span></div>
  <div class="lz-step"><span class="lz-k">Phase 4 · Retire</span><span class="lz-t">Remove and destroy</span><span class="lz-d">Drop <code>k1</code> from the verifying set, then delete the key material. Retiring early is the same outage as skipping phase 1, arriving from the other end.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — signing with a key before every verifier knows about it is an instant, total outage.</strong> The last line of the measurement above is that mistake: a perfectly valid token, signed with a real key, rejected because the verifying side has never heard of <code>kid: k2</code>. It happens most often during a rolling deploy, where new instances sign with the new key while old instances are still verifying with only the old set — so half your requests fail and the half that works depends on which pod answered. Publish first, wait for the rollout to complete, and only then flip. And keep the two settings genuinely separate: a list of keys that verify, and one key id that signs.</p>
</div>
<pre><code><span class="tok-comment">// Hai cấu hình RIÊNG BIỆT. Đây là toàn bộ cơ chế.</span>
KHOA_KY_HIEN_TAI = 'k2'                    <span class="tok-comment">// đúng MỘT khoá ký</span>
CHUM_KHOA = { k1: '…', k2: '…' }           <span class="tok-comment">// NHIỀU khoá xác minh</span>

const token = jwt.sign(payload, CHUM_KHOA[KHOA_KY_HIEN_TAI],
                       { algorithm: 'HS256', keyid: KHOA_KY_HIEN_TAI });

<span class="tok-comment">// Xác minh: đọc kid, tra trong chùm, GHIM thuật toán (Bài 4.2).</span>
const kid = jwt.decode(token, { complete: true })?.header.kid;
const khoa = CHUM_KHOA[kid];
if (!khoa) throw new Error('kid khong biet');
jwt.verify(token, khoa, { algorithms: ['HS256'] });</code></pre>

<h3>The same four phases, for everything else</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Session cookie secret — identical</span><span class="lz-lnote">Most session libraries accept an array of secrets: the first signs, all of them verify. Add the new one to the front, wait out the cookie's maximum age, remove the old one. Same shape, no <code>kid</code> needed because the library tries each in turn.</span></div>
  <div class="lz-layer"><span class="lz-lname">Encryption keys — harder, because data outlives tokens</span><span class="lz-lnote">The TOTP secrets from Lesson 7.2 are encrypted at rest and never expire, so waiting does not help. Store a key id alongside each ciphertext, decrypt with whichever key it names, and re-encrypt rows in the background until none reference the old key. Then retire it.</span></div>
  <div class="lz-layer"><span class="lz-lname">Third-party credentials — you do not control the timing</span><span class="lz-lnote">A payment or mail provider key usually allows two active keys briefly. Create the new one, deploy it, verify traffic is flowing on it in their dashboard, then revoke the old one — and only after checking that nothing else in the organisation was using it.</span></div>
  <div class="lz-layer"><span class="lz-lname">Emergency rotation skips the wait, deliberately</span><span class="lz-lnote">If a key is known compromised, retiring it immediately is correct even though every token dies. That is a decision to log everyone out on purpose — announce it, expect the support load, and know that the reason this is survivable is that the routine version has been practised.</span></div>
</div>

<h3>Making it routine</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rotate on a schedule before you need to</span><span class="v">A quarterly rotation with nobody watching proves the procedure works while the stakes are zero. The first rotation should never be the one performed at 2am during an incident by someone reading the runbook for the first time.</span></div>
  <div class="kv"><span class="k">Write down the overlap for each key</span><span class="v">"JWT signing key: overlap 1 hour (access tokens 15m). Cookie secret: overlap 8 days (cookie 7d). TOTP encryption key: overlap until backfill complete." Without this written per key, phase 3 becomes a guess.</span></div>
  <div class="kv"><span class="k">Alert on unknown kid</span><span class="v">A spike of "unknown kid" rejections means a phase ran out of order or an instance missed the rollout. It is the single metric that tells you a rotation is going wrong while it is still recoverable.</span></div>
  <div class="kv"><span class="k">Never reuse a key id</span><span class="v">Retiring <code>k1</code> and later creating a different key called <code>k1</code> means an old token could verify against new material. Monotonic ids — <code>k1</code>, <code>k2</code>, <code>k3</code>, or a date — cost nothing and remove the possibility.</span></div>
</div>
<div class="callout warn">
<p><strong>The overlap window is bounded by your longest-lived signed artefact, and people usually forget one.</strong> Access tokens are fifteen minutes, so an hour feels generous — until you remember the same key also signs email verification links valid for twenty-four hours, password reset links, invitation tokens, and the signed URLs on your file downloads. Retiring the old key an hour after the flip breaks all of them at once, and the reports arrive as unrelated bug tickets over the following day. List everything the key signs before you rotate, take the maximum, and add slack.</p>
</div>
<div class="note-ct">
<p><strong>If you take nothing else from this lesson: publish, then sign, then wait, then retire.</strong> Four words in one order. The measurement at the top of this lesson shows both failure modes — signing before publishing, and retiring before the wait — and both produce the same symptom, which is a valid token being rejected. When a rotation goes wrong, that symptom is the thing you will see, and the fix is always to put the key back in the verifying set and start the phases again in order.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc7517" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">RFC 7517 — JSON Web Key</span><span class="lc-sub">datatracker.ietf.org · Key sets, and what kid is for</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — key management</span><span class="lc-sub">cheatsheetseries.owasp.org · Lifetimes, overlap and destruction</span></span></a>
<a class="link-card" href="https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">NIST SP 800-57 — key management</span><span class="lc-sub">csrc.nist.gov · Cryptoperiods, and why keys have an expiry at all</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">CuongThai course — Docker</span><span class="lc-sub">Rolling deploys, and why "deployed" and "everywhere" are different moments</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Rotate a key in the wrong order, watch every token die, then do it in the right one</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Xoay một cái khoá mà không đá tất cả mọi người ra ngoài</h2>
<p class="lead">Bài 4.4 đã đặt tên cho các khoá bằng <code>kid</code> chính là để chuyện này khả thi. Bài này ĐI LÀM nó: bốn giai đoạn, theo đúng MỘT thứ tự, với một cửa sổ chồng lấn có kích thước bằng cái thứ SỐNG LÂU NHẤT mà cái khoá đó ký. Đúng thứ tự thì chẳng ai nhận ra; sai thứ tự thì mọi token đang bay trở nên vô hiệu trong cùng một giây.</p>

<h3>Bốn giai đoạn, chạy thật</h3>
<div class="out">token CU (ky bang k1) va token MOI (ky bang khoa dang hoat dong), qua bon giai doan:

0. Truoc khi xoay          — chum { k1 }
     token cu (k1) -&gt; CHAP NHAN
     token moi (k1) -&gt; CHAP NHAN
1. CONG BO k2 (chua ky)    — chum { k1, k2 }
     token cu (k1) -&gt; CHAP NHAN
     token moi (k1) -&gt; CHAP NHAN
2. Doi sang KY bang k2     — chum { k1, k2 }
     token cu (k1) -&gt; CHAP NHAN
     token moi (k2) -&gt; CHAP NHAN
3. Rut k1 sau khi het han  — chum { k2 }
     token cu (k1) -&gt; TU CHOI (khong biet kid=k1)
     token moi (k2) -&gt; CHAP NHAN

=== Neu bo qua giai doan 1 (ky bang k2 NGAY, chum chua co k2): ===
     token moi (k2) -&gt; TU CHOI (khong biet kid=k2)</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Giai đoạn 1 · CÔNG BỐ</span><span class="lz-t">Xác minh bằng nó, đừng KÝ bằng nó</span><span class="lz-d">Thêm khoá mới vào tập XÁC MINH rồi triển khai khắp nơi. Không có gì thay đổi với người dùng nào cả; bạn chỉ đang dạy cho mọi bản chạy biết rằng <code>k2</code> tồn tại. Hãy đợi tới khi MỌI bản chạy đã có nó — một lần deploy cuốn chiếu nghĩa là "đã triển khai" và "khắp nơi" là hai thời điểm khác nhau.</span></div>
  <div class="lz-step"><span class="lz-k">Giai đoạn 2 · KÝ</span><span class="lz-t">Lật khoá đang hoạt động</span><span class="lz-d">Token mới mang <code>kid: k2</code>. Token cũ vẫn xác minh được vì <code>k1</code> vẫn còn trong tập. Đây là giai đoạn DUY NHẤT mà người dùng có thể nhận ra, và họ không nhận ra.</span></div>
  <div class="lz-step"><span class="lz-k">Giai đoạn 3 · CHỜ</span><span class="lz-t">Tuổi thọ dài nhất, cộng thêm dư</span><span class="lz-d">Nếu access token sống mười lăm phút thì chờ một tiếng. Nếu cái khoá đó còn ký một thứ sống ba mươi ngày thì chờ ba mươi ngày — phần chồng lấn được quy định bởi hiện vật SỐNG LÂU NHẤT, không phải cái ngắn nhất.</span></div>
  <div class="lz-step"><span class="lz-k">Giai đoạn 4 · RÚT</span><span class="lz-t">Gỡ ra và tiêu huỷ</span><span class="lz-d">Bỏ <code>k1</code> khỏi tập xác minh, rồi xoá phần vật liệu khoá. Rút SỚM thì cũng chính là cú gián đoạn của việc bỏ qua giai đoạn 1, chỉ đi vào từ đầu kia.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — KÝ bằng một khoá trước khi mọi bên xác minh biết tới nó là một cú gián đoạn TỨC THÌ và TOÀN DIỆN.</strong> Dòng cuối trong phép đo ở trên chính là cái sai đó: một token hoàn toàn hợp lệ, ký bằng một khoá THẬT, bị từ chối vì phía xác minh chưa bao giờ nghe nói tới <code>kid: k2</code>. Nó hay xảy ra nhất trong một lần deploy cuốn chiếu, nơi các bản chạy MỚI ký bằng khoá mới trong khi các bản chạy CŨ vẫn chỉ xác minh bằng tập cũ — thế là một nửa số request hỏng, và nửa còn lại chạy được phụ thuộc vào việc pod nào trả lời. Hãy CÔNG BỐ trước, đợi cho đợt triển khai hoàn tất, rồi mới lật. Và hãy giữ hai cấu hình đó THẬT SỰ tách rời: một DANH SÁCH khoá để xác minh, và MỘT id khoá để ký.</p>
</div>
<pre><code><span class="tok-comment">// Hai cấu hình RIÊNG BIỆT. Đây là toàn bộ cơ chế.</span>
KHOA_KY_HIEN_TAI = 'k2'                    <span class="tok-comment">// đúng MỘT khoá ký</span>
CHUM_KHOA = { k1: '…', k2: '…' }           <span class="tok-comment">// NHIỀU khoá xác minh</span>

const token = jwt.sign(payload, CHUM_KHOA[KHOA_KY_HIEN_TAI],
                       { algorithm: 'HS256', keyid: KHOA_KY_HIEN_TAI });

<span class="tok-comment">// Xác minh: đọc kid, tra trong chùm, GHIM thuật toán (Bài 4.2).</span>
const kid = jwt.decode(token, { complete: true })?.header.kid;
const khoa = CHUM_KHOA[kid];
if (!khoa) throw new Error('kid khong biet');
jwt.verify(token, khoa, { algorithms: ['HS256'] });</code></pre>

<h3>Cũng bốn giai đoạn ấy, cho mọi thứ CÒN LẠI</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Bí mật cookie phiên — y hệt</span><span class="lz-lnote">Phần lớn thư viện phiên nhận một MẢNG bí mật: cái đầu tiên dùng để ký, tất cả đều dùng để xác minh. Thêm cái mới vào đầu, chờ hết tuổi thọ tối đa của cookie, rồi gỡ cái cũ. Cùng hình dạng, không cần <code>kid</code> vì thư viện tự thử lần lượt.</span></div>
  <div class="lz-layer"><span class="lz-lname">Khoá mã hoá — khó hơn, vì DỮ LIỆU sống lâu hơn token</span><span class="lz-lnote">Các bí mật TOTP ở Bài 7.2 được mã hoá lúc lưu và KHÔNG BAO GIỜ hết hạn, nên chờ chẳng giúp gì. Hãy lưu một id khoá bên cạnh mỗi bản mã, giải mã bằng đúng cái khoá mà nó khai ra, và mã hoá lại các bản ghi ở chế độ nền cho tới khi không còn bản nào tham chiếu khoá cũ. Rồi mới rút nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tín vật của bên thứ ba — bạn KHÔNG kiểm soát nhịp</span><span class="lz-lnote">Một khoá của nhà cung cấp thanh toán hay thư điện tử thường cho phép hai khoá cùng hoạt động trong thời gian ngắn. Hãy tạo cái mới, triển khai nó, KIỂM CHỨNG trên bảng điều khiển của họ rằng lưu lượng đang chạy trên nó, rồi mới thu hồi cái cũ — và chỉ sau khi đã kiểm rằng không còn thứ nào khác trong tổ chức đang dùng nó.</span></div>
  <div class="lz-layer"><span class="lz-lname">Xoay khẩn cấp thì BỎ QUA phần chờ, một cách có chủ ý</span><span class="lz-lnote">Nếu một khoá đã biết chắc là bị lộ thì rút nó NGAY là đúng, dù mọi token đều chết. Đó là một quyết định ĐÁ TẤT CẢ MỌI NGƯỜI RA NGOÀI có chủ đích — hãy thông báo, hãy chuẩn bị cho lượng ticket hỗ trợ, và hãy biết rằng lý do việc này SỐNG SÓT được là vì phiên bản thường ngày của nó đã được tập dượt.</span></div>
</div>

<h3>Biến nó thành việc thường ngày</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hãy xoay THEO LỊCH trước khi cần tới</span><span class="v">Một lần xoay hàng quý chẳng ai theo dõi sẽ chứng minh rằng quy trình chạy được trong lúc rủi ro bằng không. Lần xoay ĐẦU TIÊN không bao giờ nên là lần thực hiện lúc hai giờ sáng giữa một sự cố bởi một người lần đầu đọc cuốn runbook.</span></div>
  <div class="kv"><span class="k">Viết ra phần chồng lấn cho TỪNG khoá</span><span class="v">"Khoá ký JWT: chồng lấn 1 giờ (access token 15 phút). Bí mật cookie: chồng lấn 8 ngày (cookie 7 ngày). Khoá mã hoá TOTP: chồng lấn cho tới khi điền lại xong." Thiếu dòng viết ra này cho mỗi khoá thì giai đoạn 3 trở thành một cú đoán.</span></div>
  <div class="kv"><span class="k">Cảnh báo khi có kid LẠ</span><span class="v">Một cú vọt lên của các lần từ chối "kid không biết" nghĩa là một giai đoạn đã chạy sai thứ tự hoặc một bản chạy bị lỡ đợt triển khai. Đó là chỉ số DUY NHẤT cho bạn biết một lần xoay đang hỏng trong lúc vẫn còn cứu được.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ DÙNG LẠI một id khoá</span><span class="v">Rút <code>k1</code> đi rồi về sau tạo một khoá KHÁC cũng tên <code>k1</code> nghĩa là một token cũ có thể xác minh được với vật liệu mới. Id tăng dần — <code>k1</code>, <code>k2</code>, <code>k3</code>, hoặc một ngày tháng — chẳng tốn gì và dẹp hẳn khả năng đó.</span></div>
</div>
<div class="callout warn">
<p><strong>Cửa sổ chồng lấn bị chặn bởi cái hiện vật đã ký SỐNG LÂU NHẤT của bạn, và người ta thường quên mất một cái.</strong> Access token là mười lăm phút, nên một tiếng nghe đã rất hào phóng — cho tới lúc bạn nhớ ra rằng cũng cái khoá ấy còn ký cả đường dẫn xác minh email hiệu lực hai mươi bốn giờ, đường dẫn đặt lại mật khẩu, token lời mời, và các URL đã ký trên phần tải tệp. Rút khoá cũ sau một tiếng kể từ lúc lật là phá hỏng TẤT CẢ chúng cùng lúc, và các báo cáo sẽ tới dưới dạng những cái ticket lỗi CHẲNG LIÊN QUAN GÌ NHAU rải rác suốt ngày hôm sau. Hãy liệt kê mọi thứ mà cái khoá đó ký TRƯỚC khi xoay, lấy giá trị lớn nhất, rồi cộng thêm dư.</p>
</div>
<div class="note-ct">
<p><strong>Nếu không lấy gì khác từ bài này thì hãy lấy cái này: CÔNG BỐ, rồi KÝ, rồi CHỜ, rồi RÚT.</strong> Bốn từ, một thứ tự. Phép đo ở đầu bài cho thấy cả hai kiểu hỏng — ký trước khi công bố, và rút trước khi chờ xong — và cả hai đều sinh ra CÙNG một triệu chứng, là một token hợp lệ bị từ chối. Khi một lần xoay đi sai, đó chính là cái triệu chứng bạn sẽ nhìn thấy, và cách sửa bao giờ cũng là đưa cái khoá đó TRỞ LẠI tập xác minh rồi bắt đầu lại các giai đoạn theo đúng thứ tự.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc7517" target="_blank" rel="noopener"><span class="lc-ico">🔑</span><span class="lc-body"><span class="lc-title">RFC 7517 — JSON Web Key</span><span class="lc-sub">datatracker.ietf.org · Tập khoá, và kid dùng để làm gì</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Key_Management_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — quản lý khoá</span><span class="lc-sub">cheatsheetseries.owasp.org · Tuổi thọ, chồng lấn và tiêu huỷ</span></span></a>
<a class="link-card" href="https://csrc.nist.gov/pubs/sp/800/57/pt1/r5/final" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">NIST SP 800-57 — quản lý khoá</span><span class="lc-sub">csrc.nist.gov · Chu kỳ mật mã, và vì sao khoá lại phải có hạn</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Docker</span><span class="lc-sub">Deploy cuốn chiếu, và vì sao "đã triển khai" với "khắp nơi" là hai thời điểm khác nhau</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Xoay một cái khoá SAI thứ tự, nhìn mọi token chết, rồi làm lại cho đúng</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 11.3 ─────────────────────────── */
    {
      title: '11.3 — Rate limiting that survives real traffic|||11.3 — Giới hạn tần suất sống nổi với lưu lượng thật',
      slug: 'auth-11-3-gioi-han-tan-suat',
      type: 'LESSON',
      description: 'Cửa sổ cố định là thuật toán ai cũng viết đầu tiên, và nó cho qua GẤP ĐÔI trần ở chỗ giáp ranh — đo thật ở đây. Bài này so ba thuật toán, chỉ ra trần nên đếm theo trục nào cho từng luồng xác thực, và vá bài toán văn phòng dùng chung một IP mà mọi bộ giới hạn theo IP đều mắc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Rate limiting that survives real traffic</h2>
<p class="lead">Every lesson from Chapter 2 onwards has said "rate-limit this". This one says how — because the obvious implementation lets twice the limit through at a predictable moment, and the obvious axis to count on is the wrong one for almost every authentication flow.</p>

<h3>Three algorithms, measured</h3>
<div class="out">giap ranh cua so (10@59s + 10@61s)          | tran = 10 req / 60 giay
   cua so co dinh : 20 / 20 duoc qua        &lt;- GAP DOI tran
   cua so truot   : 10 / 20 duoc qua
   gau token      : 10 / 20 duoc qua

rai deu 20 req / 120s
   cua so co dinh : 20 / 20 duoc qua
   cua so truot   : 20 / 20 duoc qua
   gau token      : 20 / 20 duoc qua

# Ca ba deu XU LY DUNG luu luong binh thuong. Chung chi khac nhau o chinh
# cai truong hop ma ban dung chung de chan: mot tran do dung vao cho hai
# cua so cham nhau.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Fixed window — one counter, one bug</span><span class="v"><code>INCR</code> a key named for the current minute, with a TTL. It is two lines, it is what everyone writes first, and an attacker who fires at second 59 and again at second 61 gets twice the limit through in two seconds. For login attempts that is the difference between ten guesses and twenty.</span></div>
  <div class="kv"><span class="k">Sliding window — exact, and more expensive</span><span class="v">Keep the timestamps and count the ones inside the window. Precise at any moment, at the cost of storing one entry per request — a Redis sorted set with <code>ZREMRANGEBYSCORE</code>. Right for low-volume, high-value endpoints, which is exactly what authentication is.</span></div>
  <div class="kv"><span class="k">Token bucket — the one for general traffic</span><span class="v">A bucket refills at a steady rate and each request spends one token. It allows a controlled burst up to the bucket size and then enforces the average, which matches how real clients behave. Two numbers in Redis, and the standard choice for an API gateway.</span></div>
  <div class="kv"><span class="k">Pick per endpoint, not per application</span><span class="v">A sliding window on <code>/dang-nhap</code>, a token bucket on the general API, and a fixed window wherever the doubling genuinely does not matter. Using one algorithm everywhere means either paying sliding-window cost on your busiest route or accepting the doubling on your most sensitive one.</span></div>
</div>

<h3>The axis matters more than the algorithm</h3>
<pre><code><span class="tok-comment">// Mỗi luồng đếm theo một TRỤC khác nhau. Chọn sai trục là bộ giới hạn vô dụng.</span>
'/dang-nhap'        → theo TÀI KHOẢN  (kẻ tấn công xoay IP, không xoay được đích) <span class="tok-comment">// 10.1</span>
'/dang-ky'          → theo IP + ASN   (chưa có tài khoản nào để mà đếm)
'/quen-mat-khau'    → CẢ HAI          (theo IP chặn quét, theo email chặn bom thư) <span class="tok-comment">// 6.3</span>
'/mfa/kiem'         → theo TÀI KHOẢN  (sáu chữ số chỉ là một triệu)               <span class="tok-comment">// 7.3</span>
'/auth/refresh'     → theo PHIÊN      (một phiên chính đáng làm mới có nhịp)      <span class="tok-comment">// 5.5</span></code></pre>
<div class="pitfall">
<p><strong>Bẫy — a per-IP limit on login is measuring the one thing the attacker controls most cheaply.</strong> Lesson 10.1 measured it: a thousand residential proxies turn twenty-eight hours into under two minutes, and each address makes ten requests, which looks like ten normal people. Meanwhile the same limiter punishes the office, the university and the mobile carrier NAT where two hundred real users share one address — so it is simultaneously useless against the attack and hostile to legitimate traffic. Count login failures against the <em>account</em>, keep a much looser per-IP ceiling as a backstop against raw flooding, and never let the two be the same number.</p>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Behind a proxy, req.ip is a lie until you configure it</span><span class="lz-lnote">Express reports the load balancer's address unless <code>trust proxy</code> is set — so every user shares one IP and the limiter is global. Set it to the exact number of proxies you actually have; setting it to <code>true</code> lets a client forge <code>X-Forwarded-For</code> and choose their own bucket.</span></div>
  <div class="lz-layer"><span class="lz-lname">Count the ASN as well as the address</span><span class="lz-lnote">A single datacentre ASN producing thousands of login failures is a stronger signal than any individual address, and it survives IP rotation within that provider. It is a coarse limit and a very good alert.</span></div>
  <div class="lz-layer"><span class="lz-lname">The limiter must be shared, or it multiplies</span><span class="lz-lnote">An in-memory counter in each of six instances is a limit of sixty, not ten, and it resets on every deploy. Redis, with an atomic increment — this is the same lesson as the session store in Chapter 3.</span></div>
  <div class="lz-layer"><span class="lz-lname">Fail open or closed, deliberately</span><span class="lz-lnote">When Redis is down, does login stop or does the limit vanish? For authentication, failing closed on the <em>sensitive</em> endpoints and open on the rest is usually right — but it must be a written decision, because the default is whatever the library does when it throws.</span></div>
</div>

<h3>Answering, without helping</h3>
<pre><code><span class="tok-comment">// Trả lời đủ để client cư xử đúng, không đủ để kẻ tấn công dò ra trần.</span>
res.status(429)
   .set('Retry-After', String(cho))        <span class="tok-comment">// giây — client tử tế sẽ chờ</span>
   .json({ loi: 'Quá nhiều yêu cầu. Hãy thử lại sau.' });

<span class="tok-comment">// KHÔNG gửi kèm: trần là bao nhiêu, còn lại mấy lượt, đang đếm theo trục nào.</span>
<span class="tok-comment">// Với API công khai có tài liệu thì các header X-RateLimit-* là ĐÚNG;</span>
<span class="tok-comment">// với endpoint xác thực thì chúng là bản đồ chỉ đường cho việc dò.</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Always send Retry-After</span><span class="lz-t">It changes client behaviour</span><span class="lz-d">Without it, a mobile app retries immediately and turns one rejection into a loop that looks exactly like an attack. With it, well-behaved clients back off and your graph becomes readable.</span></div>
  <div class="lz-step"><span class="lz-k">Back off exponentially, reset on success</span><span class="lz-t">Lesson 10.1's shape</span><span class="lz-d">Two seconds, four, eight, capped. A real user who mistyped once never reaches the second step, and an attacker's throughput collapses within a dozen attempts.</span></div>
  <div class="lz-step"><span class="lz-k">Rate-limit the expensive path, not just the endpoint</span><span class="lz-t">Argon2 is the resource</span><span class="lz-d">A hundred concurrent logins is a hundred hashes at a hundred milliseconds each, which saturates the CPU and takes the whole service down without a single successful authentication. Cap concurrency on the hash, separately from the request limit.</span></div>
  <div class="lz-step"><span class="lz-k">Alert on the limiter itself</span><span class="lz-t">It is a detector</span><span class="lz-d">A sustained rise in <code>429</code>s on <code>/dang-nhap</code> is the stuffing signal from Lesson 10.1 arriving through a different pipe. If nobody is watching that number, the limiter is protecting you silently and telling you nothing.</span></div>
</div>
<div class="callout warn">
<p><strong>A limiter that has never been tested is a configuration, not a control.</strong> The failure people discover in production is not that it does not block — it is that it blocks the wrong thing: a shared office IP locked out for a day, a mobile app's retry loop hammering a limit it was never told about, or an in-memory counter that silently multiplied by the number of instances. Write a test that fires the burst and asserts the exact number that gets through, run it against the real store rather than a mock, and include the boundary case from the measurement above — requests straddling the window edge. It takes an hour and it is the difference between a number in a config file and something you can rely on.</p>
</div>
<div class="note-ct">
<p><strong>The minimum that covers this course.</strong> Sliding window on the four authentication endpoints, keyed by account where an account exists and by IP plus ASN where one does not; a token bucket on everything else; a shared Redis store; <code>Retry-After</code> on every rejection; exponential backoff that resets on success; and an alert on the rejection rate per endpoint. Everything above that — device fingerprints, adaptive thresholds, a bot-management vendor — is worth considering only once those are in place and you have watched the graphs for a month.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc6585#section-4" target="_blank" rel="noopener"><span class="lc-ico">🚦</span><span class="lc-body"><span class="lc-title">RFC 6585 §4 — 429 Too Many Requests</span><span class="lc-sub">datatracker.ietf.org · The status code and Retry-After</span></span></a>
<a class="link-card" href="https://redis.io/docs/latest/develop/use-cases/rate-limiting/" target="_blank" rel="noopener"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">Redis — rate limiting patterns</span><span class="lc-sub">redis.io · Fixed window, sliding window and token bucket, implemented</span></span></a>
<a class="link-card" href="https://expressjs.com/en/guide/behind-proxies.html" target="_blank" rel="noopener"><span class="lc-ico">🔀</span><span class="lc-body"><span class="lc-title">Express — trust proxy</span><span class="lc-sub">expressjs.com · Getting req.ip right, which every limiter depends on</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">CuongThai course — Redis</span><span class="lc-sub">Sorted sets, atomic counters and Lua, which is where a correct limiter lives</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Fire a burst across a window boundary and count exactly how many got through</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Giới hạn tần suất sống nổi với lưu lượng thật</h2>
<p class="lead">Mọi bài từ Chương 2 trở đi đều nói "hãy giới hạn tần suất chỗ này". Bài này nói LÀM THẾ NÀO — vì cái cách cài đặt hiển nhiên nhất cho qua GẤP ĐÔI trần vào một thời điểm đoán trước được, còn cái TRỤC đếm hiển nhiên nhất thì lại sai với gần như mọi luồng xác thực.</p>

<h3>Ba thuật toán, đo thật</h3>
<div class="out">giap ranh cua so (10@59s + 10@61s)          | tran = 10 req / 60 giay
   cua so co dinh : 20 / 20 duoc qua        &lt;- GAP DOI tran
   cua so truot   : 10 / 20 duoc qua
   gau token      : 10 / 20 duoc qua

rai deu 20 req / 120s
   cua so co dinh : 20 / 20 duoc qua
   cua so truot   : 20 / 20 duoc qua
   gau token      : 20 / 20 duoc qua

# Ca ba deu XU LY DUNG luu luong binh thuong. Chung chi khac nhau o chinh
# cai truong hop ma ban dung chung de chan: mot tran do dung vao cho hai
# cua so cham nhau.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Cửa sổ cố định — một bộ đếm, một con lỗi</span><span class="v"><code>INCR</code> một khoá đặt tên theo phút hiện tại, kèm TTL. Nó tốn hai dòng, nó là thứ ai cũng viết đầu tiên, và một kẻ tấn công bắn ở giây 59 rồi bắn lại ở giây 61 sẽ đẩy được GẤP ĐÔI trần qua trong hai giây. Với các lần thử đăng nhập, đó là khác biệt giữa mười lần đoán và hai mươi lần.</span></div>
  <div class="kv"><span class="k">Cửa sổ trượt — chính xác, và đắt hơn</span><span class="v">Giữ lại các mốc thời gian rồi đếm những cái nằm trong cửa sổ. Chính xác ở MỌI thời điểm, đổi lại phải lưu một mục cho mỗi request — một sorted set của Redis với <code>ZREMRANGEBYSCORE</code>. Đúng cho các endpoint lưu lượng thấp mà giá trị cao, tức là ĐÚNG những gì xác thực đang là.</span></div>
  <div class="kv"><span class="k">Gàu token — cái dành cho lưu lượng chung</span><span class="v">Một cái gàu được rót đầy lại với tốc độ đều và mỗi request tiêu một token. Nó cho phép một cú bùng nổ CÓ KIỂM SOÁT tới cỡ cái gàu rồi thi hành đúng mức trung bình, khớp với cách client thật cư xử. Hai con số trong Redis, và là lựa chọn chuẩn cho một cổng API.</span></div>
  <div class="kv"><span class="k">Chọn theo TỪNG endpoint, đừng chọn cho cả ứng dụng</span><span class="v">Cửa sổ trượt cho <code>/dang-nhap</code>, gàu token cho API chung, và cửa sổ cố định ở bất cứ đâu mà việc gấp đôi thật sự không quan trọng. Dùng MỘT thuật toán cho mọi nơi nghĩa là hoặc trả cái giá của cửa sổ trượt trên tuyến bận nhất, hoặc chấp nhận việc gấp đôi trên tuyến nhạy cảm nhất.</span></div>
</div>

<h3>Cái TRỤC còn quan trọng hơn cả thuật toán</h3>
<pre><code><span class="tok-comment">// Mỗi luồng đếm theo một TRỤC khác nhau. Chọn sai trục là bộ giới hạn vô dụng.</span>
'/dang-nhap'        → theo TÀI KHOẢN  (kẻ tấn công xoay IP, không xoay được đích) <span class="tok-comment">// 10.1</span>
'/dang-ky'          → theo IP + ASN   (chưa có tài khoản nào để mà đếm)
'/quen-mat-khau'    → CẢ HAI          (theo IP chặn quét, theo email chặn bom thư) <span class="tok-comment">// 6.3</span>
'/mfa/kiem'         → theo TÀI KHOẢN  (sáu chữ số chỉ là một triệu)               <span class="tok-comment">// 7.3</span>
'/auth/refresh'     → theo PHIÊN      (một phiên chính đáng làm mới có nhịp)      <span class="tok-comment">// 5.5</span></code></pre>
<div class="pitfall">
<p><strong>Bẫy — một trần theo IP đặt trên trang đăng nhập là đang đo đúng cái thứ mà kẻ tấn công điều khiển RẺ nhất.</strong> Bài 10.1 đã đo: một nghìn proxy dân cư biến hai mươi tám tiếng thành chưa tới hai phút, và mỗi địa chỉ chỉ gửi mười request, trông y hệt mười người bình thường. Trong khi đó cũng chính bộ giới hạn ấy trừng phạt cái văn phòng, cái trường đại học và cái NAT của nhà mạng di động nơi hai trăm người dùng thật dùng chung một địa chỉ — nên nó ĐỒNG THỜI vô dụng trước cú tấn công và thù địch với lưu lượng chính đáng. Hãy đếm số lần đăng nhập hỏng theo <em>TÀI KHOẢN</em>, giữ một trần theo IP LỎNG hơn nhiều làm lớp chắn cuối trước việc dội request thô, và đừng bao giờ để hai con số đó bằng nhau.</p>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Đứng sau proxy thì req.ip là một lời NÓI DỐI cho tới khi bạn cấu hình nó</span><span class="lz-lnote">Express báo về địa chỉ của bộ cân bằng tải trừ khi <code>trust proxy</code> được đặt — nên mọi người dùng chung một IP và bộ giới hạn trở thành TOÀN CỤC. Hãy đặt nó bằng ĐÚNG số proxy bạn thật sự có; đặt thành <code>true</code> là cho client giả mạo <code>X-Forwarded-For</code> và tự chọn cái gàu của mình.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đếm cả ASN chứ đừng chỉ đếm địa chỉ</span><span class="lz-lnote">Một ASN của trung tâm dữ liệu sinh ra hàng nghìn lần đăng nhập hỏng là một tín hiệu MẠNH hơn bất kỳ địa chỉ đơn lẻ nào, và nó sống sót qua việc xoay IP bên trong nhà cung cấp ấy. Đó là một trần thô và là một cảnh báo rất tốt.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bộ giới hạn phải DÙNG CHUNG, không thì nó NHÂN LÊN</span><span class="lz-lnote">Một bộ đếm trong bộ nhớ ở mỗi bản chạy trong sáu bản là một cái trần bằng sáu mươi chứ không phải mười, và nó đặt lại ở mỗi lần deploy. Hãy dùng Redis, với một phép tăng nguyên tử — đây đúng là bài học về kho phiên ở Chương 3.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hỏng theo hướng MỞ hay ĐÓNG, một cách có chủ ý</span><span class="lz-lnote">Khi Redis chết, việc đăng nhập DỪNG lại hay cái trần BIẾN MẤT? Với xác thực thì hỏng-đóng ở các endpoint <em>nhạy cảm</em> và hỏng-mở ở phần còn lại thường là đúng — nhưng nó phải là một quyết định VIẾT RA, vì mặc định là bất cứ điều gì mà thư viện làm khi nó ném lỗi.</span></div>
</div>

<h3>Trả lời, mà không giúp gì cho kẻ tấn công</h3>
<pre><code><span class="tok-comment">// Trả lời đủ để client cư xử đúng, không đủ để kẻ tấn công dò ra trần.</span>
res.status(429)
   .set('Retry-After', String(cho))        <span class="tok-comment">// giây — client tử tế sẽ chờ</span>
   .json({ loi: 'Quá nhiều yêu cầu. Hãy thử lại sau.' });

<span class="tok-comment">// KHÔNG gửi kèm: trần là bao nhiêu, còn lại mấy lượt, đang đếm theo trục nào.</span>
<span class="tok-comment">// Với API công khai có tài liệu thì các header X-RateLimit-* là ĐÚNG;</span>
<span class="tok-comment">// với endpoint xác thực thì chúng là bản đồ chỉ đường cho việc dò.</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Luôn gửi Retry-After</span><span class="lz-t">Nó đổi HÀNH VI của client</span><span class="lz-d">Thiếu nó thì một ứng dụng di động thử lại NGAY LẬP TỨC và biến một lần từ chối thành một vòng lặp trông y hệt một cú tấn công. Có nó thì các client tử tế lùi lại và biểu đồ của bạn trở nên đọc được.</span></div>
  <div class="lz-step"><span class="lz-k">Lùi theo cấp số nhân, đặt lại khi THÀNH CÔNG</span><span class="lz-t">Đúng hình dạng ở Bài 10.1</span><span class="lz-d">Hai giây, bốn, tám, có trần. Một người dùng thật gõ nhầm một lần thì chẳng bao giờ chạm tới bước thứ hai, còn thông lượng của kẻ tấn công thì sụp đổ trong khoảng một tá lần thử.</span></div>
  <div class="lz-step"><span class="lz-k">Giới hạn cả ĐƯỜNG ĐẮT, đừng chỉ giới hạn endpoint</span><span class="lz-t">Argon2 mới là tài nguyên</span><span class="lz-d">Một trăm lần đăng nhập song song là một trăm lần băm, mỗi lần một trăm mili giây, đủ làm bão hoà CPU và hạ cả dịch vụ mà KHÔNG có nổi một lần xác thực thành công. Hãy đặt trần cho số phép băm chạy song song, TÁCH RIÊNG khỏi trần số request.</span></div>
  <div class="lz-step"><span class="lz-k">Cảnh báo trên chính bộ giới hạn</span><span class="lz-t">Nó là một BỘ CẢM BIẾN</span><span class="lz-d">Một mức tăng kéo dài của số <code>429</code> trên <code>/dang-nhap</code> chính là tín hiệu nhồi tín vật ở Bài 10.1 đi tới bằng một đường ống khác. Nếu chẳng ai canh con số đó thì bộ giới hạn đang bảo vệ bạn trong IM LẶNG và chẳng nói cho bạn biết điều gì.</span></div>
</div>
<div class="callout warn">
<p><strong>Một bộ giới hạn CHƯA BAO GIỜ được kiểm thử là một mục cấu hình, không phải một biện pháp kiểm soát.</strong> Kiểu hỏng mà người ta phát hiện trên production không phải là nó không chặn — mà là nó chặn NHẦM thứ: một IP văn phòng dùng chung bị khoá cả ngày, một vòng lặp thử lại của ứng dụng di động cứ dập vào một cái trần mà nó chưa từng được báo, hoặc một bộ đếm trong bộ nhớ âm thầm nhân lên theo số bản chạy. Hãy viết một bài kiểm thử bắn một tràng rồi khẳng định CHÍNH XÁC bao nhiêu cái lọt qua, chạy nó với kho lưu trữ THẬT chứ đừng chạy với một bản giả, và nhớ đưa vào cả trường hợp biên trong phép đo ở trên — các request nằm vắt qua mép cửa sổ. Nó tốn một tiếng và nó là khác biệt giữa một con số trong tệp cấu hình với một thứ bạn dựa vào được.</p>
</div>
<div class="note-ct">
<p><strong>Mức tối thiểu phủ được cả khoá học này.</strong> Cửa sổ trượt trên bốn endpoint xác thực, lấy khoá là TÀI KHOẢN ở đâu có tài khoản và là IP cộng ASN ở đâu chưa có; gàu token cho mọi thứ còn lại; một kho Redis dùng chung; <code>Retry-After</code> ở mọi lần từ chối; lùi theo cấp số nhân đặt lại khi thành công; và một cảnh báo trên tỉ lệ từ chối theo từng endpoint. Mọi thứ cao hơn thế — dấu vân tay thiết bị, ngưỡng thích ứng, một dịch vụ quản lý bot — chỉ đáng cân nhắc sau khi những cái trên đã có và bạn đã ngồi nhìn biểu đồ suốt một tháng.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc6585#section-4" target="_blank" rel="noopener"><span class="lc-ico">🚦</span><span class="lc-body"><span class="lc-title">RFC 6585 §4 — 429 Too Many Requests</span><span class="lc-sub">datatracker.ietf.org · Mã trạng thái và header Retry-After</span></span></a>
<a class="link-card" href="https://redis.io/docs/latest/develop/use-cases/rate-limiting/" target="_blank" rel="noopener"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">Redis — các mẫu giới hạn tần suất</span><span class="lc-sub">redis.io · Cửa sổ cố định, cửa sổ trượt và gàu token, có mã cài đặt</span></span></a>
<a class="link-card" href="https://expressjs.com/en/guide/behind-proxies.html" target="_blank" rel="noopener"><span class="lc-ico">🔀</span><span class="lc-body"><span class="lc-title">Express — trust proxy</span><span class="lc-sub">expressjs.com · Lấy req.ip cho đúng, thứ mà mọi bộ giới hạn đều phụ thuộc vào</span></span></a>
<a class="link-card" href="/courses/redis/learn${REF}"><span class="lc-ico">🔴</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Redis</span><span class="lc-sub">Sorted set, bộ đếm nguyên tử và Lua, nơi một bộ giới hạn ĐÚNG thật sự sống</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Bắn một tràng vắt qua mép cửa sổ rồi đếm chính xác bao nhiêu cái lọt qua</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 11.4 ─────────────────────────── */
    {
      title: '11.4 — The audit log: what to write, and what never to|||11.4 — Nhật ký kiểm toán: ghi gì, và tuyệt đối KHÔNG ghi gì',
      slug: 'auth-11-4-nhat-ky-kiem-toan',
      type: 'LESSON',
      description: 'Sau một sự cố, câu hỏi luôn là "chuyện gì đã xảy ra, lúc nào, do ai" — và câu trả lời hoặc nằm trong nhật ký hoặc không tồn tại. Bài này liệt kê những sự kiện PHẢI ghi, những trường tuyệt đối không được ghi, và chạy thật một chuỗi băm khiến việc sửa hay xoá một bản ghi trở nên NHÌN THẤY ĐƯỢC.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.4</span>
<h2>The audit log: what to write, and what never to</h2>
<p class="lead">An audit log is not application logging. Application logs exist for debugging and get sampled, rotated and truncated. An audit log answers "who did what to whom, when, from where" months later, in front of somebody who needs a definite answer — and every gap in it is a question that stays unanswered permanently.</p>

<h3>The events that must be there</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Authentication</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Success and failure, both</span><span class="lz-nsub">Login, logout, MFA pass and fail, recovery code used, refresh-token reuse detected · failures are half the story</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Credential changes</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Every one, no exceptions</span><span class="lz-nsub">Password set or reset, email changed, factor added or removed, provider linked or unlinked, sessions revoked</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Authorization changes</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Who granted what to whom</span><span class="lz-nsub">Role granted or revoked, permission changed, sharing created, tenant membership altered · Chapter 9's audit</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Privileged actions</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">And who really did them</span><span class="lz-nsub">Admin impersonation, bulk export, account deletion, MFA reset by support · record the operator, not the victim</span></div></div>
  </div>
</div>
<pre><code>model SuKienKiemToan {
  id          BigInt   @id @default(autoincrement())
  luc         DateTime @default(now())
  loai        String                       <span class="tok-comment">// 'vai_tro.cap', 'mat_khau.dat_lai'</span>
  chuTheId    String?                      <span class="tok-comment">// AI làm — người vận hành, không phải nạn nhân</span>
  doiTuongId  String?                      <span class="tok-comment">// làm LÊN AI/CÁI GÌ</span>
  ip          String?
  userAgent   String?
  ketQua      String                       <span class="tok-comment">// 'thanh_cong' | 'that_bai' | 'tu_choi'</span>
  chiTiet     Json?                        <span class="tok-comment">// bối cảnh — xem danh sách CẤM bên dưới</span>
  bamTruoc    String                       <span class="tok-comment">// ← chuỗi băm, phần dưới bài</span>
  bam         String

  @@index([chuTheId, luc])
  @@index([doiTuongId, luc])
  @@index([loai, luc])
  @@map("su_kien_kiem_toan")
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Record the actor, not the account being changed</span><span class="v">When support resets MFA for a user, the subject is the <em>agent</em> and the object is the user. Logging only the user makes the most security-relevant events in your system look like the user did them to themselves — which is exactly what Lesson 10.4's help-desk attack relies on.</span></div>
  <div class="kv"><span class="k">Log failures and refusals, not just successes</span><span class="v">A permission denial, a rejected MFA code, a 429, a reuse detection. The attack is visible in the failures; by the time it appears in the successes it has already worked.</span></div>
  <div class="kv"><span class="k">Use a stable event vocabulary</span><span class="v">A fixed set of type strings, defined in one place as a union. Free-text event names drift within a quarter and make every query a guess about how a colleague phrased it eighteen months ago.</span></div>
  <div class="kv"><span class="k">Index for the questions you will ask</span><span class="v">"Everything this user did", "everything done to this account", "every role grant last month". Three composite indexes, decided now, because adding them to a hundred-million-row table during an incident is not a thing you get to do.</span></div>
</div>

<h3>What must never appear</h3>
<div class="pitfall">
<p><strong>Bẫy — an audit log that captures credentials is a credential file with better indexing.</strong> Never write: passwords, even wrong ones, even hashed; tokens, session ids, refresh tokens, reset tokens or authorization codes; TOTP secrets or codes; full card numbers; API keys. And never log a whole request or response body on an authentication route — that is how all of the above end up there without anyone deciding to put them there. Store identifiers and hashes: the last four characters of a token, or its SHA-256, is enough to correlate two log lines without the log becoming the thing an attacker wants. The same rule covers your error reporter and your APM tracer, which capture request bodies by default and are usually the ones that actually leak.</p>
</div>
<pre><code><span class="tok-comment">// SAI — và đây là cách một nhật ký trở thành thứ ĐÁNG CẮP NHẤT bạn có:</span>
log.info('dang nhap that bai', { email, matKhau, body: req.body });

<span class="tok-comment">// ĐÚNG — đủ để đối chiếu, không đủ để dùng lại:</span>
log.info('dang nhap that bai', {
  emailChuanHoa,                      <span class="tok-comment">// định danh, không phải tín vật</span>
  ip: req.ip, asn: asn(req.ip),
  tokenDauCuoi: token?.slice(-4),     <span class="tok-comment">// đối chiếu được, không phát lại được</span>
});</code></pre>

<h3>Tamper evidence, run for real</h3>
<div class="out">id  thoi diem  loai                     bam
1   09:14:02  dang_nhap.thanh_cong     20c7b3330daa…
2   09:14:40  vai_tro.cap              7cf0c410222e…
3   09:15:11  hoa_don.xuat             d1414e9943ec…
4   09:16:03  vai_tro.thu_hoi          2177864bd5db…

Kiem lai: chuoi NGUYEN VEN
Sau khi SUA ban ghi #2 (giau viec tu cap admin): HONG o ban ghi #1
Sau khi XOA HAN ban ghi #2: HONG o ban ghi #1</div>
<pre><code><span class="tok-comment">// Mỗi bản ghi băm CẢ nội dung của nó LẪN băm của bản ghi trước.</span>
const bamTruoc = (await banGhiCuoi())?.bam ?? '0'.repeat(64);
const bam = sha256(JSON.stringify(suKien) + bamTruoc);
await prisma.suKienKiemToan.create({ data: { ...suKien, bamTruoc, bam } });</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Editing breaks the chain</span><span class="lz-t">And so does deleting</span><span class="lz-d">Change one field or remove one row and every hash after it stops matching. An attacker who reaches your database can still destroy the log — but they cannot quietly <em>edit</em> it, and the difference between "the log is gone" and "the log says nothing happened" is enormous during an investigation.</span></div>
  <div class="lz-step"><span class="lz-k">Verify on a schedule</span><span class="lz-t">A nightly job</span><span class="lz-d">Walk the chain and alert on the first mismatch. A tamper-evident log nobody verifies proves nothing, because the evidence is only produced by the checking.</span></div>
  <div class="lz-step"><span class="lz-k">Anchor it somewhere else</span><span class="lz-t">The strong version</span><span class="lz-d">Publish the latest hash daily to a system with different credentials — an append-only bucket, a separate account, a signed mail. Then even someone with full database access cannot rewrite history that was already anchored.</span></div>
  <div class="lz-step"><span class="lz-k">Write-only for the application</span><span class="lz-t">Chapter 9's roles, applied</span><span class="lz-d">Grant the application <code>INSERT</code> and <code>SELECT</code> on this table and nothing else. No <code>UPDATE</code>, no <code>DELETE</code> — so a bug, or a compromised process, cannot rewrite the record of what it did.</span></div>
</div>

<h3>Retention, and the thing people forget</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Keep it longer than your detection time</span><span class="lz-lnote">Breaches are commonly found months after they start. Thirty days of audit log means the answer to "when did this begin" is usually "before our logs". A year is a reasonable default for authentication events; the volume is small because these are not request logs.</span></div>
  <div class="lz-layer"><span class="lz-lname">The log is personal data too</span><span class="lz-lnote">IP addresses and user agents are personal data under GDPR, so retention needs a stated period and a reason. Lesson 6.5's deletion rules apply — usually as anonymisation rather than deletion, because an audit trail with the actor removed answers nothing.</span></div>
  <div class="lz-layer"><span class="lz-lname">Separate it from application logs</span><span class="lz-lnote">Different retention, different access control, different volume. Audit events in the same index as debug logging get sampled away, dropped under load, and read by anyone with a dashboard login.</span></div>
  <div class="lz-layer"><span class="lz-lname">Give users their own view</span><span class="lz-lnote">Lesson 5.4's device list is an audit log with a friendly face. Extending it to "recent security activity" — logins, password changes, new devices, factor changes — turns your users into detectors for the events your monitoring will never flag.</span></div>
</div>
<div class="note-ct">
<p><strong>Write the audit event in the same transaction as the change it records.</strong> If granting a role commits and the audit insert fails afterwards, the log now disagrees with reality in the direction that hides a privilege escalation. Put them in one transaction so the change and its record are atomic — and if that is genuinely impossible because the log lives in another system, write the audit event <em>first</em>, marked as pending, and settle it after. An audit event with no corresponding change is a puzzle; a change with no audit event is a hole.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — logging cheat sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · What to log, and the forbidden fields</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🏷️</span><span class="lc-body"><span class="lc-title">OWASP — logging vocabulary</span><span class="lc-sub">cheatsheetseries.owasp.org · A ready-made event-name taxonomy</span></span></a>
<a class="link-card" href="https://transparency.dev/verifiable-data-structures/" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Verifiable data structures</span><span class="lc-sub">transparency.dev · Hash chains and Merkle trees, the serious version of the above</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL</span><span class="lc-sub">Grants that make a table append-only, and indexing for time-range queries</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Build the hash chain, then edit one row and find the break</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.4</span>
<h2>Nhật ký kiểm toán: ghi gì, và tuyệt đối KHÔNG ghi gì</h2>
<p class="lead">Nhật ký kiểm toán KHÔNG phải log ứng dụng. Log ứng dụng tồn tại để gỡ lỗi, và nó bị lấy mẫu, bị xoay vòng, bị cắt cụt. Nhật ký kiểm toán trả lời câu "ai đã làm gì lên ai, lúc nào, từ đâu" sau nhiều tháng, trước mặt một người cần một câu trả lời DỨT KHOÁT — và mỗi khoảng trống trong đó là một câu hỏi VĨNH VIỄN không có lời đáp.</p>

<h3>Những sự kiện BẮT BUỘC phải có</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Xác thực</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Cả THÀNH CÔNG lẫn THẤT BẠI</span><span class="lz-nsub">Đăng nhập, đăng xuất, MFA đúng và sai, mã khôi phục đã dùng, phát hiện tái dùng refresh token · thất bại là MỘT NỬA câu chuyện</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Thay đổi tín vật</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Mọi cái, không ngoại lệ</span><span class="lz-nsub">Đặt hoặc đặt lại mật khẩu, đổi email, thêm hoặc gỡ yếu tố, nối hoặc gỡ nhà cung cấp, thu hồi phiên</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Thay đổi phân quyền</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Ai cấp gì cho ai</span><span class="lz-nsub">Cấp hoặc thu hồi vai, đổi quyền, tạo chia sẻ, đổi tư cách thành viên tenant · phần kiểm toán của Chương 9</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Hành động đặc quyền</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Và AI THẬT SỰ đã làm chúng</span><span class="lz-nsub">Quản trị viên đóng vai người dùng, xuất dữ liệu hàng loạt, xoá tài khoản, hỗ trợ đặt lại MFA · hãy ghi NGƯỜI VẬN HÀNH, không ghi nạn nhân</span></div></div>
  </div>
</div>
<pre><code>model SuKienKiemToan {
  id          BigInt   @id @default(autoincrement())
  luc         DateTime @default(now())
  loai        String                       <span class="tok-comment">// 'vai_tro.cap', 'mat_khau.dat_lai'</span>
  chuTheId    String?                      <span class="tok-comment">// AI làm — người vận hành, không phải nạn nhân</span>
  doiTuongId  String?                      <span class="tok-comment">// làm LÊN AI/CÁI GÌ</span>
  ip          String?
  userAgent   String?
  ketQua      String                       <span class="tok-comment">// 'thanh_cong' | 'that_bai' | 'tu_choi'</span>
  chiTiet     Json?                        <span class="tok-comment">// bối cảnh — xem danh sách CẤM bên dưới</span>
  bamTruoc    String                       <span class="tok-comment">// ← chuỗi băm, phần dưới bài</span>
  bam         String

  @@index([chuTheId, luc])
  @@index([doiTuongId, luc])
  @@index([loai, luc])
  @@map("su_kien_kiem_toan")
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Ghi NGƯỜI THỰC HIỆN, đừng ghi cái tài khoản bị thay đổi</span><span class="v">Khi bộ phận hỗ trợ đặt lại MFA cho một người dùng thì chủ thể là <em>NHÂN VIÊN</em> còn đối tượng là người dùng. Chỉ ghi mỗi người dùng sẽ khiến những sự kiện QUAN TRỌNG NHẤT về bảo mật trong hệ thống của bạn trông như thể chính người dùng tự làm với mình — mà đó đúng là thứ mà cú tấn công qua bàn hỗ trợ ở Bài 10.4 dựa vào.</span></div>
  <div class="kv"><span class="k">Ghi cả THẤT BẠI và TỪ CHỐI, không chỉ ghi thành công</span><span class="v">Một lần từ chối quyền, một mã MFA bị loại, một cái 429, một lần phát hiện tái dùng. Cú tấn công NHÌN THẤY ĐƯỢC trong phần thất bại; tới lúc nó hiện ra trong phần thành công thì nó đã thành công rồi.</span></div>
  <div class="kv"><span class="k">Dùng một BỘ TỪ VỰNG sự kiện ổn định</span><span class="v">Một tập cố định các chuỗi loại, định nghĩa ở MỘT chỗ dưới dạng union. Tên sự kiện viết tự do sẽ trôi dạt trong vòng một quý và biến mọi câu truy vấn thành một cú đoán xem mười tám tháng trước một đồng nghiệp đã đặt câu chữ thế nào.</span></div>
  <div class="kv"><span class="k">Đánh chỉ mục cho những CÂU HỎI bạn sẽ hỏi</span><span class="v">"Mọi thứ người này đã làm", "mọi thứ đã làm LÊN tài khoản này", "mọi lần cấp vai trong tháng trước". Ba chỉ mục ghép, quyết định NGAY BÂY GIỜ, vì thêm chúng vào một cái bảng trăm triệu dòng giữa lúc có sự cố không phải là việc bạn được phép làm.</span></div>
</div>

<h3>Cái tuyệt đối KHÔNG được xuất hiện</h3>
<div class="pitfall">
<p><strong>Bẫy — một nhật ký kiểm toán có chứa tín vật là một tệp tín vật được đánh chỉ mục ĐẸP HƠN.</strong> Đừng bao giờ ghi: mật khẩu, kể cả mật khẩu SAI, kể cả dạng băm; token, id phiên, refresh token, token đặt lại hay mã uỷ quyền; bí mật hay mã TOTP; số thẻ đầy đủ; khoá API. Và đừng bao giờ ghi cả một thân request hay response trên một tuyến xác thực — đó chính là cách tất cả những thứ trên rơi vào đó mà chẳng ai từng quyết định đặt chúng vào. Hãy lưu ĐỊNH DANH và BĂM: bốn ký tự cuối của một token, hoặc SHA-256 của nó, là đủ để đối chiếu hai dòng log mà không biến nhật ký thành thứ kẻ tấn công thèm muốn. Cùng luật đó áp cho bộ báo lỗi và bộ theo dấu APM của bạn, vốn thu thân request theo MẶC ĐỊNH và thường mới là những thứ thật sự làm rò rỉ.</p>
</div>
<pre><code><span class="tok-comment">// SAI — và đây là cách một nhật ký trở thành thứ ĐÁNG CẮP NHẤT bạn có:</span>
log.info('dang nhap that bai', { email, matKhau, body: req.body });

<span class="tok-comment">// ĐÚNG — đủ để đối chiếu, không đủ để dùng lại:</span>
log.info('dang nhap that bai', {
  emailChuanHoa,                      <span class="tok-comment">// định danh, không phải tín vật</span>
  ip: req.ip, asn: asn(req.ip),
  tokenDauCuoi: token?.slice(-4),     <span class="tok-comment">// đối chiếu được, không phát lại được</span>
});</code></pre>

<h3>Bằng chứng chống sửa đổi, chạy thật</h3>
<div class="out">id  thoi diem  loai                     bam
1   09:14:02  dang_nhap.thanh_cong     20c7b3330daa…
2   09:14:40  vai_tro.cap              7cf0c410222e…
3   09:15:11  hoa_don.xuat             d1414e9943ec…
4   09:16:03  vai_tro.thu_hoi          2177864bd5db…

Kiem lai: chuoi NGUYEN VEN
Sau khi SUA ban ghi #2 (giau viec tu cap admin): HONG o ban ghi #1
Sau khi XOA HAN ban ghi #2: HONG o ban ghi #1</div>
<pre><code><span class="tok-comment">// Mỗi bản ghi băm CẢ nội dung của nó LẪN băm của bản ghi trước.</span>
const bamTruoc = (await banGhiCuoi())?.bam ?? '0'.repeat(64);
const bam = sha256(JSON.stringify(suKien) + bamTruoc);
await prisma.suKienKiemToan.create({ data: { ...suKien, bamTruoc, bam } });</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">SỬA thì gãy chuỗi</span><span class="lz-t">Và XOÁ cũng vậy</span><span class="lz-d">Đổi một trường hoặc gỡ một dòng là mọi băm phía sau nó thôi không khớp. Một kẻ tấn công tới được cơ sở dữ liệu của bạn thì vẫn PHÁ được nhật ký — nhưng hắn không thể lặng lẽ <em>SỬA</em> nó, và khác biệt giữa "nhật ký đã biến mất" với "nhật ký nói chẳng có gì xảy ra" là khổng lồ trong một cuộc điều tra.</span></div>
  <div class="lz-step"><span class="lz-k">Kiểm lại THEO LỊCH</span><span class="lz-t">Một công việc chạy đêm</span><span class="lz-d">Đi hết chuỗi và báo động ở chỗ lệch đầu tiên. Một nhật ký chống-sửa-đổi mà chẳng ai kiểm lại thì không chứng minh được gì cả, vì bằng chứng chỉ được SINH RA bởi chính việc kiểm.</span></div>
  <div class="lz-step"><span class="lz-k">NEO nó ở một nơi khác</span><span class="lz-t">Phiên bản mạnh</span><span class="lz-d">Hãy công bố cái băm mới nhất mỗi ngày sang một hệ thống dùng tín vật KHÁC — một bucket chỉ-ghi-thêm, một tài khoản riêng, một lá thư đã ký. Khi đó, kể cả người có toàn quyền vào cơ sở dữ liệu cũng không viết lại được phần lịch sử đã được neo.</span></div>
  <div class="lz-step"><span class="lz-k">Chỉ cho ứng dụng quyền GHI THÊM</span><span class="lz-t">Vai trò ở Chương 9, đem áp vào</span><span class="lz-d">Hãy cấp cho ứng dụng quyền <code>INSERT</code> và <code>SELECT</code> trên bảng này và không gì khác. Không <code>UPDATE</code>, không <code>DELETE</code> — để một con lỗi, hoặc một tiến trình bị chiếm, KHÔNG viết lại được bản ghi về chính việc nó vừa làm.</span></div>
</div>

<h3>Thời hạn lưu, và cái người ta hay quên</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Giữ LÂU HƠN thời gian bạn phát hiện ra sự cố</span><span class="lz-lnote">Các vụ xâm nhập thường được tìm ra nhiều tháng sau khi chúng bắt đầu. Ba mươi ngày nhật ký kiểm toán nghĩa là câu trả lời cho "chuyện này bắt đầu từ bao giờ" thường là "trước khi có log của chúng tôi". Một năm là mặc định hợp lý cho các sự kiện xác thực; khối lượng thì nhỏ vì đây KHÔNG phải log request.</span></div>
  <div class="lz-layer"><span class="lz-lname">Bản thân nhật ký cũng là DỮ LIỆU CÁ NHÂN</span><span class="lz-lnote">Địa chỉ IP và user agent là dữ liệu cá nhân theo GDPR, nên thời hạn lưu cần một khoảng thời gian và một lý do CÔNG BỐ ra. Luật xoá ở Bài 6.5 áp vào — thường dưới dạng ẨN DANH HOÁ chứ không phải xoá, vì một dấu vết kiểm toán bị gỡ mất người thực hiện thì chẳng trả lời được gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tách nó khỏi log ứng dụng</span><span class="lz-lnote">Khác thời hạn lưu, khác kiểm soát truy cập, khác khối lượng. Sự kiện kiểm toán nằm chung chỉ mục với log gỡ lỗi thì bị lấy mẫu bỏ bớt, bị vứt khi tải cao, và bị đọc bởi bất cứ ai có tài khoản vào bảng điều khiển.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cho chính NGƯỜI DÙNG một khung nhìn của họ</span><span class="lz-lnote">Danh sách thiết bị ở Bài 5.4 chính là một nhật ký kiểm toán khoác bộ mặt thân thiện. Mở rộng nó thành "hoạt động bảo mật gần đây" — đăng nhập, đổi mật khẩu, thiết bị mới, thay đổi yếu tố — là biến người dùng của bạn thành bộ cảm biến cho những sự kiện mà hệ giám sát của bạn sẽ chẳng bao giờ đánh dấu.</span></div>
</div>
<div class="note-ct">
<p><strong>Hãy ghi sự kiện kiểm toán TRONG CÙNG giao dịch với thay đổi mà nó ghi nhận.</strong> Nếu việc cấp vai đã commit rồi mà lệnh chèn kiểm toán hỏng sau đó thì nhật ký giờ đang MÂU THUẪN với thực tế theo đúng cái hướng che giấu một cú leo thang đặc quyền. Hãy đặt chúng vào một giao dịch để thay đổi và bản ghi của nó là nguyên tử — và nếu điều đó thật sự bất khả vì nhật ký sống ở một hệ thống khác, thì hãy ghi sự kiện kiểm toán TRƯỚC, đánh dấu là đang chờ, rồi chốt lại sau. Một sự kiện kiểm toán không có thay đổi tương ứng là một câu đố; một thay đổi không có sự kiện kiểm toán là một LỖ HỔNG.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — bảng tra về ghi log</span><span class="lc-sub">cheatsheetseries.owasp.org · Ghi gì, và những trường bị CẤM</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Vocabulary_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🏷️</span><span class="lc-body"><span class="lc-title">OWASP — từ vựng cho log</span><span class="lc-sub">cheatsheetseries.owasp.org · Một bộ phân loại tên sự kiện làm sẵn</span></span></a>
<a class="link-card" href="https://transparency.dev/verifiable-data-structures/" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Cấu trúc dữ liệu kiểm chứng được</span><span class="lc-sub">transparency.dev · Chuỗi băm và cây Merkle, phiên bản nghiêm túc của thứ ở trên</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL</span><span class="lc-sub">Cấp quyền để một bảng thành chỉ-ghi-thêm, và đánh chỉ mục cho truy vấn theo khoảng thời gian</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Dựng chuỗi băm, rồi sửa một dòng và đi tìm chỗ gãy</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 11.5 ─────────────────────────── */
    {
      title: '11.5 — Six signals, and the runbook for when one fires|||11.5 — Sáu tín hiệu, và cuốn runbook cho lúc một cái nổ',
      slug: 'auth-11-5-giam-sat',
      type: 'LESSON',
      description: 'Nhật ký ở Bài 11.4 chỉ có ích nếu có ai đó bị ĐÁNH THỨC. Bài này chọn sáu chỉ số xác thực đáng cảnh báo, đặt ngưỡng cho từng cái và cho chạy thật trên hai tập dữ liệu, rồi viết ra bốn bước ứng cứu — thứ phải tồn tại TRƯỚC lúc cần, không phải viết ra giữa lúc sự cố đang chạy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.5</span>
<h2>Six signals, and the runbook for when one fires</h2>
<p class="lead">The audit log from Lesson 11.4 records everything and wakes nobody. Monitoring is the part that turns a record into a response — and the hard problem is not collecting the data, it is picking few enough alerts that people still read them at three in the morning after a month of them being right.</p>

<h3>Six signals, run against two days</h3>
<div class="out">=== MOT NGAY BINH THUONG ===
  [ ok] ti le dang nhap HONG           0.09   nguong &gt; 30% trong 15 phut
  [ ok] tai dung refresh token            0   nguong &gt;= 1 trong 1 gio
  [ ok] MFA hong                         12   nguong &gt; 100 trong 1 gio
  [ ok] so 429 tren /dang-nhap          340   nguong &gt; 5.000 trong 1 gio
  [ ok] dang ky moi                     210   nguong &gt; 800 trong 1 gio
  [ ok] dang nhap tu quoc gia MOI        31   nguong &gt; 200 trong 1 gio

=== DANG BI NHOI TIN VAT ===
  [NO ] ti le dang nhap HONG           0.87   nguong &gt; 30% trong 15 phut
  [NO ] tai dung refresh token            3   nguong &gt;= 1 trong 1 gio
  [NO ] MFA hong                        410   nguong &gt; 100 trong 1 gio
  [NO ] so 429 tren /dang-nhap        22800   nguong &gt; 5.000 trong 1 gio
  [NO ] dang ky moi                    1900   nguong &gt; 800 trong 1 gio
  [NO ] dang nhap tu quoc gia MOI       640   nguong &gt; 200 trong 1 gio</div>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · Login failure ratio, not count</span><span class="v">Normal sits between five and fifteen percent. A count moves with your traffic and with the working week; a ratio does not, so one threshold works at 3am on a Sunday and at 10am on a Monday. Alert above thirty percent sustained for fifteen minutes.</span></div>
  <div class="kv"><span class="k">2 · Refresh-token reuse — the highest-quality signal you have</span><span class="v">Lesson 5.2's detection, with Lesson 5.5's grace window absorbing the races. Once the client is correct this should be flat zero, so a single occurrence is worth paging for — it is the closest thing to proof of a stolen token in this whole course.</span></div>
  <div class="kv"><span class="k">3 · MFA failures</span><span class="v">Somebody guessing codes already has the password (Lesson 7.3). This is not a login problem, it is a "this account is compromised" event, and a burst across many accounts is a campaign rather than a mistake.</span></div>
  <div class="kv"><span class="k">4–6 · Rate-limit rejections, registrations, new countries</span><span class="v">The limiter is a sensor (Lesson 11.3). A registration spike is bulk account creation. First-ever logins from a new country, in volume, is takeover at scale. None is conclusive alone; together they draw the picture.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — an alert nobody acts on trains everybody to ignore the channel.</strong> Six alerts that fire correctly are worth more than sixty that mostly do not, because the cost of a false positive is not the interruption — it is the next real alert being dismissed by reflex. Every alert needs three things before it is switched on: a threshold derived from a fortnight of your own data rather than a blog post, a named owner, and a linked runbook. If you cannot write the runbook, the alert is not actionable and should be a dashboard panel instead. And review the ones that fire without anyone doing anything: they are the ones eroding your response.</p>
</div>

<h3>What to instrument, and what to leave out</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Page for these</span><span class="lz-t">Wake a person</span><span class="lz-d">Refresh-token reuse, and an admin-role grant nobody expected. Both are close to proof, both are rare, and both get worse every minute they run.</span></div>
  <div class="lz-step"><span class="lz-k">Ticket for these</span><span class="lz-t">Look at it today</span><span class="lz-d">A sustained failure ratio, an MFA-failure burst, a registration spike, a rate-limit surge. Real, worth investigating, and not usually worse in an hour than in a minute.</span></div>
  <div class="lz-step"><span class="lz-k">Dashboard only</span><span class="lz-t">Context, not alerts</span><span class="lz-d">Logins per hour, sessions created, MFA enrolment percentage, passkey adoption, password-reset volume. You look at these <em>after</em> an alert, and their value is that they tell you what normal looks like.</span></div>
  <div class="lz-step"><span class="lz-k">Never alert on a single user's behaviour</span><span class="lz-t">Except reuse detection</span><span class="lz-d">One person failing five logins is a typo. Alerting per user produces thousands of pages and finds nothing — aggregate first, and let the per-user events live in the audit log where an investigation can find them.</span></div>
</div>
<pre><code><span class="tok-comment">// Ghi mọi sự kiện xác thực thành MỘT chỉ số có nhãn. Cảnh báo dựng trên nó.</span>
xacThucTong.inc({ loai: 'dang_nhap', ketQua: khop ? 'thanh_cong' : 'that_bai' });

<span class="tok-comment">// PromQL: tỉ lệ hỏng trong 15 phút, KHÔNG phải số đếm.</span>
<span class="tok-comment">//   sum(rate(xac_thuc_tong{loai="dang_nhap",ketQua="that_bai"}[15m]))</span>
<span class="tok-comment">// / sum(rate(xac_thuc_tong{loai="dang_nhap"}[15m])) &gt; 0.30</span></code></pre>

<h3>The runbook: four steps, written in advance</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · Contain, before you understand</span><span class="lz-lnote">Revoke the affected sessions (Lesson 5.3), force a reset on the accounts involved, and tighten the relevant limit. Containment does not require a root cause, and the hour spent understanding first is an hour the attacker keeps working.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · Scope it from the audit log</span><span class="lz-lnote">Which accounts, from when, from where, and what did they touch? This is the query Lesson 11.4's indexes exist for. Write down the answer as you go — the timeline is the deliverable, and reconstructing it later from memory is how details get lost.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · Notify, honestly and early</span><span class="lz-lnote">Affected users first, with what happened and what to do. Many jurisdictions set a deadline for personal-data breaches — seventy-two hours under GDPR — and the clock starts when you become aware, not when you finish investigating. Know who makes that call before you need to.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Fix the class, not the instance</span><span class="lz-lnote">One stolen session means asking why that path existed at all. The write-up should end with a change that makes the whole category harder, and a test that fails if it comes back — which is the only part of an incident that has lasting value.</span></div>
</div>
<div class="callout warn">
<p><strong>Practise the runbook while nothing is wrong, because every step in it has a dependency you have not tested.</strong> Revoking every session for one account: does the endpoint exist, and does it work for an operator rather than the user? Forcing a password reset on two hundred accounts at once: is there a script, and has anyone run it? Querying the audit log for a two-week window: does that query return in seconds or does it time out? Notifying ten thousand users: can your mail provider send that volume without being rate-limited as spam? A tabletop exercise once a quarter, working through one scenario out loud, finds these in an hour — and each one found that way is an hour you do not spend discovering it during the real thing.</p>
</div>
<div class="note-ct">
<p><strong>Start with two alerts, not six.</strong> Refresh-token reuse, and the login failure ratio. They cover the two attacks from Chapter 10 that will actually reach you — a stolen session and a stuffing run — they almost never fire falsely once the client is correct, and each has an obvious first action. Add the other four once you have watched your own baselines for a month and can pick thresholds from your data rather than from this page. Six alerts that people trust beat twenty that they mute, and the number that matters is not how many signals you collect but how many of them someone still reads after the third month.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#event-attributes" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — logging and monitoring</span><span class="lc-sub">cheatsheetseries.owasp.org · The events worth alerting on</span></span></a>
<a class="link-card" href="https://sre.google/workbook/alerting-on-slos/" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">Google SRE — alerting on SLOs</span><span class="lc-sub">sre.google · Why ratios beat counts, and how to avoid alert fatigue</span></span></a>
<a class="link-card" href="https://www.nist.gov/cyberframework" target="_blank" rel="noopener"><span class="lc-ico">🧭</span><span class="lc-body"><span class="lc-title">NIST Cybersecurity Framework</span><span class="lc-sub">nist.gov · Detect, respond, recover — the shape the runbook follows</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">CuongThai course — Docker</span><span class="lc-sub">Getting metrics out of a container, and where the scraper reaches them</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Instrument the six signals, replay a stuffing run, and see which alerts fire</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.5</span>
<h2>Sáu tín hiệu, và cuốn runbook cho lúc một cái nổ</h2>
<p class="lead">Nhật ký ở Bài 11.4 ghi lại mọi thứ và chẳng đánh thức ai. Giám sát là phần biến một BẢN GHI thành một PHẢN ỨNG — và bài toán khó không phải thu thập dữ liệu, mà là chọn ĐỦ ÍT cảnh báo để người ta còn đọc chúng vào ba giờ sáng sau một tháng chúng đều đúng.</p>

<h3>Sáu tín hiệu, chạy trên hai ngày</h3>
<div class="out">=== MOT NGAY BINH THUONG ===
  [ ok] ti le dang nhap HONG           0.09   nguong &gt; 30% trong 15 phut
  [ ok] tai dung refresh token            0   nguong &gt;= 1 trong 1 gio
  [ ok] MFA hong                         12   nguong &gt; 100 trong 1 gio
  [ ok] so 429 tren /dang-nhap          340   nguong &gt; 5.000 trong 1 gio
  [ ok] dang ky moi                     210   nguong &gt; 800 trong 1 gio
  [ ok] dang nhap tu quoc gia MOI        31   nguong &gt; 200 trong 1 gio

=== DANG BI NHOI TIN VAT ===
  [NO ] ti le dang nhap HONG           0.87   nguong &gt; 30% trong 15 phut
  [NO ] tai dung refresh token            3   nguong &gt;= 1 trong 1 gio
  [NO ] MFA hong                        410   nguong &gt; 100 trong 1 gio
  [NO ] so 429 tren /dang-nhap        22800   nguong &gt; 5.000 trong 1 gio
  [NO ] dang ky moi                    1900   nguong &gt; 800 trong 1 gio
  [NO ] dang nhap tu quoc gia MOI       640   nguong &gt; 200 trong 1 gio</div>
<div class="kv-grid">
  <div class="kv"><span class="k">1 · TỈ LỆ đăng nhập hỏng, không phải SỐ ĐẾM</span><span class="v">Bình thường nằm giữa năm và mười lăm phần trăm. Số đếm thì nhúc nhích theo lưu lượng và theo ngày trong tuần; tỉ lệ thì không, nên một cái ngưỡng chạy được cả lúc ba giờ sáng Chủ nhật lẫn mười giờ sáng thứ Hai. Hãy báo động khi vượt ba mươi phần trăm kéo dài mười lăm phút.</span></div>
  <div class="kv"><span class="k">2 · Tái dùng refresh token — tín hiệu CHẤT LƯỢNG NHẤT bạn có</span><span class="v">Phép phát hiện ở Bài 5.2, với cửa sổ ân hạn ở Bài 5.5 hấp thụ các cuộc đua. Một khi client đã đúng thì con số này phải phẳng ở KHÔNG, nên một lần xuất hiện duy nhất cũng đáng gọi điện đánh thức — đó là thứ gần với BẰNG CHỨNG về một token bị cắp nhất trong cả khoá học này.</span></div>
  <div class="kv"><span class="k">3 · MFA hỏng</span><span class="v">Kẻ đang đoán mã thì đã CÓ mật khẩu rồi (Bài 7.3). Đây không phải sự cố đăng nhập, đây là sự kiện "tài khoản này đã bị lộ", và một tràng trải rộng trên nhiều tài khoản là một CHIẾN DỊCH chứ không phải một cú gõ nhầm.</span></div>
  <div class="kv"><span class="k">4–6 · Số lần bị giới hạn, số đăng ký, số quốc gia mới</span><span class="v">Bộ giới hạn chính là một cảm biến (Bài 11.3). Một cú vọt về số đăng ký là việc mở tài khoản hàng loạt. Những lần đăng nhập ĐẦU TIÊN từ một quốc gia mới, với số lượng lớn, là chiếm tài khoản ở quy mô rộng. Không cái nào đứng một mình là kết luận; gộp lại thì chúng vẽ ra bức tranh.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — một cảnh báo mà chẳng ai hành động theo sẽ HUẤN LUYỆN cho mọi người lờ đi cả cái kênh đó.</strong> Sáu cảnh báo nổ ĐÚNG thì đáng giá hơn sáu mươi cái phần lớn nổ sai, vì cái giá của một cảnh báo giả không phải là sự gián đoạn — mà là cái cảnh báo THẬT tiếp theo bị gạt đi theo phản xạ. Mỗi cảnh báo cần ba thứ trước khi được bật lên: một ngưỡng rút ra từ dữ liệu của CHÍNH BẠN suốt hai tuần chứ không phải từ một bài blog, một người sở hữu có TÊN, và một cuốn runbook có liên kết tới. Nếu bạn không viết nổi cái runbook thì cảnh báo đó không hành động được và nên là một ô trên bảng điều khiển thay vì một cảnh báo. Và hãy xem lại những cái nổ mà chẳng ai làm gì: chính chúng đang bào mòn khả năng phản ứng của bạn.</p>
</div>

<h3>Đo cái gì, và bỏ cái gì ra ngoài</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">GỌI ĐIỆN cho những cái này</span><span class="lz-t">Đánh thức một con người</span><span class="lz-d">Tái dùng refresh token, và một lần cấp vai admin mà chẳng ai chờ đợi. Cả hai đều gần như là bằng chứng, cả hai đều hiếm, và cả hai đều TỆ HƠN theo từng phút chúng còn chạy.</span></div>
  <div class="lz-step"><span class="lz-k">MỞ TICKET cho những cái này</span><span class="lz-t">Xem trong hôm nay</span><span class="lz-d">Tỉ lệ hỏng kéo dài, một tràng MFA hỏng, một cú vọt về đăng ký, một đợt tăng số lần bị giới hạn. Thật, đáng điều tra, và thường không tệ hơn sau một tiếng so với sau một phút.</span></div>
  <div class="lz-step"><span class="lz-k">Chỉ để trên BẢNG ĐIỀU KHIỂN</span><span class="lz-t">Bối cảnh, không phải cảnh báo</span><span class="lz-d">Số lần đăng nhập mỗi giờ, số phiên được tạo, tỉ lệ phần trăm đã đăng ký MFA, tỉ lệ dùng passkey, khối lượng đặt lại mật khẩu. Bạn nhìn những cái này <em>SAU</em> một cảnh báo, và giá trị của chúng là cho bạn biết BÌNH THƯỜNG trông ra sao.</span></div>
  <div class="lz-step"><span class="lz-k">Đừng bao giờ cảnh báo theo hành vi của MỘT người dùng</span><span class="lz-t">Trừ phát hiện tái dùng</span><span class="lz-d">Một người đăng nhập hỏng năm lần là một cú gõ nhầm. Cảnh báo theo từng người dùng sẽ sinh ra hàng nghìn cuộc gọi và chẳng tìm ra gì — hãy TỔNG HỢP trước đã, và để các sự kiện theo từng người sống trong nhật ký kiểm toán, nơi một cuộc điều tra tìm ra được chúng.</span></div>
</div>
<pre><code><span class="tok-comment">// Ghi mọi sự kiện xác thực thành MỘT chỉ số có nhãn. Cảnh báo dựng trên nó.</span>
xacThucTong.inc({ loai: 'dang_nhap', ketQua: khop ? 'thanh_cong' : 'that_bai' });

<span class="tok-comment">// PromQL: tỉ lệ hỏng trong 15 phút, KHÔNG phải số đếm.</span>
<span class="tok-comment">//   sum(rate(xac_thuc_tong{loai="dang_nhap",ketQua="that_bai"}[15m]))</span>
<span class="tok-comment">// / sum(rate(xac_thuc_tong{loai="dang_nhap"}[15m])) &gt; 0.30</span></code></pre>

<h3>Cuốn runbook: bốn bước, viết TRƯỚC</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · KHOANH VÙNG, trước khi hiểu</span><span class="lz-lnote">Thu hồi các phiên bị ảnh hưởng (Bài 5.3), ép đặt lại mật khẩu trên các tài khoản liên quan, và siết cái trần tương ứng. Khoanh vùng KHÔNG đòi hỏi phải biết nguyên nhân gốc, còn cái giờ đồng hồ dành để hiểu trước là một giờ mà kẻ tấn công vẫn đang làm việc.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · XÁC ĐỊNH PHẠM VI từ nhật ký kiểm toán</span><span class="lz-lnote">Những tài khoản nào, từ lúc nào, từ đâu, và họ đã chạm vào cái gì? Đây chính là câu truy vấn mà các chỉ mục ở Bài 11.4 sinh ra để phục vụ. Hãy VIẾT câu trả lời ra ngay trong lúc làm — cái DÒNG THỜI GIAN mới là sản phẩm, và dựng lại nó về sau bằng trí nhớ là cách các chi tiết bị mất.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · THÔNG BÁO, trung thực và sớm</span><span class="lz-lnote">Người dùng bị ảnh hưởng trước, kèm chuyện gì đã xảy ra và họ nên làm gì. Nhiều khu vực pháp lý đặt hạn chót cho việc vi phạm dữ liệu cá nhân — bảy mươi hai giờ theo GDPR — và đồng hồ bắt đầu chạy từ lúc bạn BIẾT, không phải từ lúc bạn điều tra xong. Hãy biết AI ra quyết định đó TRƯỚC khi cần tới.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · Vá cả HỌ, đừng vá một ca</span><span class="lz-lnote">Một cái phiên bị cắp nghĩa là phải hỏi vì sao con đường đó tồn tại ngay từ đầu. Bản tổng kết nên kết thúc bằng một thay đổi làm cho CẢ NHÓM vấn đề đó khó hơn, cộng một bài kiểm thử sẽ ĐỎ nếu nó quay lại — và đó là phần DUY NHẤT của một sự cố có giá trị lâu dài.</span></div>
</div>
<div class="callout warn">
<p><strong>Hãy TẬP DƯỢT cuốn runbook trong lúc chẳng có gì sai, vì mỗi bước trong đó đều có một thứ phụ thuộc mà bạn CHƯA hề kiểm thử.</strong> Thu hồi mọi phiên của một tài khoản: cái endpoint đó có tồn tại không, và nó có chạy được cho một NGƯỜI VẬN HÀNH chứ không phải cho chính người dùng không? Ép đặt lại mật khẩu cho hai trăm tài khoản cùng lúc: có script không, và đã có ai chạy nó chưa? Truy vấn nhật ký kiểm toán cho một cửa sổ hai tuần: câu đó trả về sau vài giây hay là nó hết giờ? Thông báo cho mười nghìn người dùng: nhà cung cấp thư của bạn có gửi nổi khối lượng đó mà không bị chặn như thư rác không? Một buổi diễn tập trên bàn mỗi quý, nói to ra một kịch bản từ đầu tới cuối, sẽ tìm ra những thứ này trong một tiếng — và mỗi thứ tìm ra kiểu ấy là một tiếng bạn không phải bỏ ra để phát hiện nó giữa lúc sự cố THẬT đang chạy.</p>
</div>
<div class="note-ct">
<p><strong>Hãy bắt đầu với HAI cảnh báo, không phải sáu.</strong> Tái dùng refresh token, và tỉ lệ đăng nhập hỏng. Chúng phủ được hai cú tấn công ở Chương 10 sẽ thật sự tới với bạn — một cái phiên bị cắp và một đợt nhồi tín vật — chúng gần như không bao giờ nổ sai một khi client đã đúng, và mỗi cái đều có một hành động đầu tiên rõ ràng. Hãy thêm bốn cái còn lại sau khi bạn đã ngồi nhìn đường nền của CHÍNH MÌNH suốt một tháng và chọn được ngưỡng từ dữ liệu của bạn thay vì từ trang này. Sáu cảnh báo mà người ta TIN thì hơn hẳn hai mươi cái mà người ta TẮT TIẾNG, và con số đáng kể không phải là bạn thu thập bao nhiêu tín hiệu, mà là còn bao nhiêu cái được ai đó ĐỌC sau tháng thứ ba.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#event-attributes" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — ghi log và giám sát</span><span class="lc-sub">cheatsheetseries.owasp.org · Những sự kiện đáng dựng cảnh báo</span></span></a>
<a class="link-card" href="https://sre.google/workbook/alerting-on-slos/" target="_blank" rel="noopener"><span class="lc-ico">📗</span><span class="lc-body"><span class="lc-title">Google SRE — cảnh báo theo SLO</span><span class="lc-sub">sre.google · Vì sao tỉ lệ hơn số đếm, và cách tránh mệt mỏi vì cảnh báo</span></span></a>
<a class="link-card" href="https://www.nist.gov/cyberframework" target="_blank" rel="noopener"><span class="lc-ico">🧭</span><span class="lc-body"><span class="lc-title">Khung An ninh mạng của NIST</span><span class="lc-sub">nist.gov · Phát hiện, phản ứng, phục hồi — đúng hình dạng mà cuốn runbook bám theo</span></span></a>
<a class="link-card" href="/courses/docker/learn${REF}"><span class="lc-ico">🐳</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Docker</span><span class="lc-sub">Đưa chỉ số ra khỏi một container, và chỗ mà bộ thu thập chạm tới chúng</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Cắm sáu tín hiệu, phát lại một đợt nhồi, và xem cảnh báo nào nổ</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 11.6 ─────────────────────────── */
    {
      title: 'Quiz: running it|||Quiz: vận hành nó',
      slug: 'auth-11-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về bí mật, xoay khoá bốn giai đoạn, thuật toán giới hạn tần suất, nhật ký kiểm toán và cảnh báo.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.6</span>
<h2>Quiz: running it</h2>
<p class="lead">Eight questions. None of them is about cryptography — this chapter is the part that decides whether correct code stays correct after twelve months, four engineers and one incident.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> Secrets reach the process through the environment and never through the repository; a default fallback is how a development secret reaches production, so validate at boot and fail loudly (11.1). Key rotation is four phases in one order — publish, sign, wait, retire — and the overlap is set by the longest-lived thing the key signs (11.2). Fixed-window rate limiting lets twice the limit through at the boundary, and the axis matters more than the algorithm: login counts against the account, not the address (11.3). The audit log records the actor rather than the victim, never contains a credential, and a hash chain makes editing or deleting a row visible (11.4). Two alerts you trust beat twenty you mute, and the runbook — contain, scope, notify, fix the class — has to be written and practised before it is needed (11.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.6</span>
<h2>Quiz: vận hành nó</h2>
<p class="lead">Tám câu. Không câu nào nói về mật mã — chương này là phần quyết định xem mã ĐÚNG có còn đúng sau mười hai tháng, bốn kỹ sư và một sự cố hay không.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Bí mật tới được tiến trình qua MÔI TRƯỜNG và không bao giờ qua kho mã; một giá trị mặc định dự phòng chính là cách một bí mật dev đi tới production, nên hãy kiểm chứng ngay lúc khởi động và hỏng THẬT TO (11.1). Xoay khoá là bốn giai đoạn theo MỘT thứ tự — công bố, ký, chờ, rút — và phần chồng lấn được quy định bởi cái thứ SỐNG LÂU NHẤT mà khoá đó ký (11.2). Giới hạn kiểu cửa sổ cố định cho qua GẤP ĐÔI trần ở chỗ giáp ranh, và cái TRỤC còn quan trọng hơn thuật toán: đăng nhập thì đếm theo TÀI KHOẢN chứ không theo địa chỉ (11.3). Nhật ký kiểm toán ghi NGƯỜI THỰC HIỆN chứ không ghi nạn nhân, không bao giờ chứa một tín vật nào, và một chuỗi băm làm cho việc sửa hay xoá một dòng trở nên NHÌN THẤY được (11.4). Hai cảnh báo mà bạn TIN thì hơn hai mươi cái bạn TẮT TIẾNG, và cuốn runbook — khoanh vùng, xác định phạm vi, thông báo, vá cả họ — phải được viết ra và tập dượt TRƯỚC lúc cần (11.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What is wrong with process.env.JWT_SECRET ?? "dev-secret"?|||Câu process.env.JWT_SECRET ?? "dev-secret" sai ở đâu?',
            options: [
              'Nothing, as long as the real value is set in production|||Không sai gì, miễn là giá trị thật được đặt trên production',
              'The fallback means a missing variable fails silently and production signs tokens with a value that is in the repository — validate required variables at boot and refuse to start|||Cái đường lùi khiến một biến bị thiếu hỏng trong IM LẶNG và production ký token bằng một giá trị nằm sẵn trong kho mã — hãy kiểm các biến bắt buộc ngay lúc khởi động và TỪ CHỐI chạy',
              'The nullish operator is slower than a ternary|||Toán tử nullish chậm hơn toán tử ba ngôi',
              'It should use an empty string as the default|||Nên dùng chuỗi rỗng làm giá trị mặc định',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A secret was committed and then deleted in a later commit. What is the correct response?|||Một bí mật đã bị commit rồi bị xoá ở một commit sau. Phản ứng ĐÚNG là gì?',
            options: [
              'Nothing further; the file no longer contains it|||Không cần làm gì thêm; tệp đó không còn chứa nó nữa',
              'Rotate it — the value remains in the history, in every clone and fork and in the CI cache, so treat it as burned and issue a new one|||XOAY nó — giá trị đó vẫn nằm trong lịch sử, trong mọi bản clone và fork và trong bộ nhớ đệm của CI, nên hãy coi nó là đã CHÁY và phát một cái mới',
              'Force-push to rewrite the branch and consider it fixed|||Force-push để viết lại nhánh rồi coi như đã xong',
              'Add the file to .gitignore|||Thêm cái tệp đó vào .gitignore',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What are the four phases of rotating a signing key, in order?|||Bốn giai đoạn xoay một khoá ký, theo đúng thứ tự, là gì?',
            options: [
              'Sign with the new key, publish it, wait, retire the old one|||Ký bằng khoá mới, công bố nó, chờ, rút cái cũ',
              'Publish the new key to every verifier, then switch signing to it, then wait out the longest-lived artefact, then retire the old key|||CÔNG BỐ khoá mới tới mọi bên xác minh, rồi chuyển sang KÝ bằng nó, rồi CHỜ hết tuổi thọ của hiện vật sống lâu nhất, rồi RÚT khoá cũ',
              'Retire the old key, publish the new one, sign, wait|||Rút khoá cũ, công bố khoá mới, ký, chờ',
              'Publish and sign together, then retire immediately|||Công bố và ký cùng lúc, rồi rút ngay lập tức',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Access tokens live 15 minutes, but the same key signs email verification links valid for 24 hours. How long is the overlap?|||Access token sống 15 phút, nhưng cùng cái khoá đó còn ký đường dẫn xác minh email hiệu lực 24 giờ. Phần chồng lấn dài bao lâu?',
            options: [
              'One hour — four times the access-token lifetime|||Một tiếng — gấp bốn lần tuổi thọ access token',
              'At least 24 hours plus slack, because the overlap is set by the longest-lived thing the key signs, not the shortest|||Ít nhất 24 giờ cộng thêm dư, vì phần chồng lấn được quy định bởi cái thứ SỐNG LÂU NHẤT mà khoá đó ký, không phải cái ngắn nhất',
              'Fifteen minutes, matching the access token|||Mười lăm phút, khớp với access token',
              'It does not matter if kid is used|||Không quan trọng, nếu đã dùng kid',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your limit is 10 requests per 60 seconds with a fixed window. An attacker fires 10 at second 59 and 10 at second 61. What happens?|||Trần của bạn là 10 request mỗi 60 giây với cửa sổ cố định. Kẻ tấn công bắn 10 cái ở giây 59 và 10 cái ở giây 61. Chuyện gì xảy ra?',
            options: [
              'Ten get through; the limit holds|||Mười cái lọt qua; cái trần vẫn giữ được',
              'All twenty get through — twice the limit — because the two windows meet at second 60; a sliding window or token bucket lets only ten|||Cả hai mươi cái LỌT QUA — gấp đôi trần — vì hai cửa sổ chạm nhau ở giây 60; cửa sổ trượt hoặc gàu token thì chỉ cho qua mười',
              'The second batch is delayed but eventually allowed|||Lô thứ hai bị hoãn lại nhưng rốt cuộc vẫn được cho qua',
              'None get through; the window resets to zero|||Không cái nào lọt; cửa sổ đặt lại về không',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Support resets a user’s MFA. Who should the audit event record as the subject?|||Bộ phận hỗ trợ đặt lại MFA cho một người dùng. Sự kiện kiểm toán nên ghi AI là chủ thể?',
            options: [
              'The user, since it is their account|||Người dùng đó, vì đây là tài khoản của họ',
              'The support agent — the actor — with the user as the object, otherwise the most security-relevant events look like users doing things to themselves|||Bạn NHÂN VIÊN hỗ trợ — người thực hiện — với người dùng là đối tượng, không thì những sự kiện quan trọng nhất về bảo mật sẽ trông như người dùng tự làm với chính mình',
              'Both, in a single subject field|||Cả hai, gộp vào một trường chủ thể duy nhất',
              'Neither; the event type is enough|||Không ai cả; loại sự kiện là đủ rồi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does hash-chaining the audit log actually guarantee?|||Việc xâu chuỗi băm cho nhật ký kiểm toán THẬT SỰ bảo đảm điều gì?',
            options: [
              'That the log cannot be destroyed|||Rằng nhật ký không thể bị phá huỷ',
              'That editing or deleting a row breaks every hash after it, so tampering becomes visible — an attacker can still destroy the log, but cannot quietly rewrite it|||Rằng sửa hay xoá một dòng sẽ làm gãy mọi băm phía sau nó, nên việc can thiệp trở nên NHÌN THẤY được — kẻ tấn công vẫn PHÁ được nhật ký, nhưng không thể lặng lẽ VIẾT LẠI nó',
              'That the log is encrypted at rest|||Rằng nhật ký được mã hoá lúc lưu',
              'That entries cannot be inserted out of order|||Rằng các mục không thể bị chèn sai thứ tự',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why alert on the login failure ratio rather than the failure count?|||Vì sao nên cảnh báo theo TỈ LỆ đăng nhập hỏng chứ không theo SỐ ĐẾM?',
            options: [
              'Because ratios are cheaper to compute|||Vì tỉ lệ thì tính rẻ hơn',
              'Because a count moves with traffic and the working week, so one threshold cannot fit both a Sunday night and a Monday morning — the ratio stays near 5–15% regardless|||Vì số đếm nhúc nhích theo lưu lượng và theo ngày trong tuần, nên một cái ngưỡng không vừa được cả tối Chủ nhật lẫn sáng thứ Hai — còn tỉ lệ thì luôn quanh 5–15% bất kể lúc nào',
              'Because counts cannot be graphed|||Vì số đếm thì không vẽ biểu đồ được',
              'Because failures are not worth counting|||Vì số lần hỏng không đáng đếm',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
