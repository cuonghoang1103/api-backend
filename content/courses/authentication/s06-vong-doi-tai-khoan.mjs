/**
 * Authentication — Chương 6: Vòng đời tài khoản.
 * Đăng ký và chuẩn hoá email · xác minh email · đặt lại mật khẩu · dò tài khoản ·
 * đổi email và xoá tài khoản · quiz.
 * Output CHẠY THẬT Node.js 22 + Express 5 + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fauthentication%2Flearn&reflabel=Auth';

export default {
  title: 'Chapter 6 — The account lifecycle|||Chương 6 — Vòng đời tài khoản',
  description: 'Đăng nhập chỉ là một khoảnh khắc trong đời một tài khoản. Chương này lo phần còn lại: đăng ký và cái bẫy chuẩn hoá email, xác minh email, đặt lại mật khẩu — luồng bị tấn công nhiều nhất trong mọi hệ thống xác thực — cùng cái rò rỉ dò tài khoản mà hầu hết trang web đều mắc, đổi email, và xoá tài khoản cho đúng luật.',
  lessons: [

    /* ─────────────────────────── 6.1 ─────────────────────────── */
    {
      title: '6.1 — Registration, and the identifier you cannot take back|||6.1 — Đăng ký, và cái định danh không rút lại được',
      slug: 'auth-6-1-dang-ky',
      type: 'LESSON',
      description: 'Đăng ký là nơi bạn chọn cái định danh sẽ đi theo tài khoản suốt đời nó. Bài này chuẩn hoá email cho đúng — chữ hoa, khoảng trắng, dấu chấm, dấu cộng, Unicode và chữ nhìn giống nhau — tách cột "email như người ta gõ" khỏi cột "email đã chuẩn hoá" mang chỉ mục duy nhất, và chỉ ra vì sao kiểm-rồi-mới-chèn LUÔN LUÔN là một cuộc đua.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Registration, and the identifier you cannot take back</h2>
<p class="lead">Every chapter so far assumed a user row already existed. This one creates it — and the decision made in these twenty lines is the hardest one in the course to reverse, because once a million rows carry an identifier normalised one way, changing the rule means merging or splitting real accounts belonging to real people.</p>

<h3>Collect less than you want to</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">An identifier and a password. That is the whole requirement</span><span class="v">Everything else — full name, date of birth, phone, company — is a field the user can fill in later, from a screen where abandoning it costs you nothing. At registration, each extra field is measurable drop-off and one more thing you are legally responsible for storing.</span></div>
  <div class="kv"><span class="k">Do not ask for the password twice</span><span class="v">The confirm field exists because the input is masked. A "show password" toggle solves the same problem, keeps one field, and lets the user actually check what they typed. If you keep the confirm field, at least compare after normalising nothing — trailing spaces are part of a password.</span></div>
  <div class="kv"><span class="k">Do not invent a username</span><span class="v">A username is a second identifier, with its own uniqueness rules, its own normalisation problem and its own impersonation risk (Lesson 6.4). If your product does not display one, do not have one.</span></div>
  <div class="kv"><span class="k">The strength rule belongs to Chapter 2</span><span class="v">Length floor, a breach-list check, no composition rules. Registration is where that policy is enforced, not where it is designed.</span></div>
</div>

<h3>Normalising an email, decision by decision</h3>
<pre><code><span class="tok-comment">// Chuẩn hoá: cắt khoảng trắng, hạ chữ, hợp nhất Unicode.</span>
export function chuanHoaEmail(tho: string): string {
  const t = tho.trim();
  const i = t.lastIndexOf('@');                 <span class="tok-comment">// last, không phải first: local part có thể chứa @</span>
  if (i &lt;= 0 || i === t.length - 1) throw new Error('email khong hop le');

  const local  = t.slice(0, i);
  const domain = t.slice(i + 1).toLowerCase();  <span class="tok-comment">// tên miền: KHÔNG phân biệt hoa thường, luôn luôn</span>

  return (local + '@' + domain).normalize('NFKC').toLowerCase();
}</code></pre>
<div class="out">"Nguyen.Van.A@Gmail.COM"           -> nguyen.van.a@gmail.com
"  cuong@cuongthai.com  "          -> cuong@cuongthai.com
"cuong+github@cuongthai.com"       -> cuong+github@cuongthai.com
"CUONG@CUONGTHAI.COM"              -> cuong@cuongthai.com
"admin@cuongthai.com"              -> admin@cuongthai.com     ← chu 'a' Kirin, KHAC hoan toan
430 64 6d 69 6e   ← ma diem cua "admin": U+0430 la Cyrillic small letter A</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Trim</span><span class="lz-t">Uncontroversial</span><span class="lz-d">A copy-paste from a spreadsheet carries leading and trailing spaces. No mail system on earth wants them, and a user who cannot log in because of an invisible character will never work out why.</span></div>
  <div class="lz-step"><span class="lz-k">Lowercase the domain</span><span class="lz-t">Always correct</span><span class="lz-d">DNS is case-insensitive and RFC 1035 settles it. <code>@Gmail.COM</code> and <code>@gmail.com</code> are the same host, with no provider anywhere disagreeing.</span></div>
  <div class="lz-step"><span class="lz-k">Lowercase the local part</span><span class="lz-t">Technically wrong, practically required</span><span class="lz-d">RFC 5321 says the part before <code>@</code> belongs to the receiving server and may be case-sensitive. In reality every mainstream provider folds case, and users type their address differently every time. Fold it — and write down that you did.</span></div>
  <div class="lz-step"><span class="lz-k">NFKC before lowercasing</span><span class="lz-t">Order matters</span><span class="lz-d">Unicode offers several byte sequences for the same visible character. Normalising first means <code>é</code> typed as one code point and as <code>e</code> plus a combining accent become the same string; doing it after lowercasing leaves cases that slip through.</span></div>
</div>

<h3>What you must NOT normalise away</h3>
<pre><code><span class="tok-comment">// CÁM DỖ: gộp bí danh để "chặn nhiều tài khoản". ĐỪNG.</span>
function dungLam(e: string) {
  const [local, domain] = e.split('@');
  return local.split('+')[0].replaceAll('.', '') + '@' + domain;
}
<span class="tok-comment">// "cuong.thai+mua@fastmail.com" → "cuongthai@fastmail.com"</span>
<span class="tok-comment">// …là một địa chỉ HOÀN TOÀN KHÁC ở fastmail, và có thể là người khác.</span></code></pre>
<div class="pitfall">
<p><strong>Trap — dot and plus stripping is a Gmail rule, not an email rule.</strong> Gmail ignores dots and treats <code>+tag</code> as an alias. Fastmail, Zoho, most corporate Exchange servers and every self-hosted domain do not: <code>a.b@</code> and <code>ab@</code> are two different mailboxes, often two different people. Strip them globally and you will eventually merge two strangers' accounts — a data breach you caused yourself, and one that is very hard to unwind. If you must block disposable aliases, do it per known provider, and only for abuse limits, never for identity.</p>
</div>
<div class="callout warn">
<p><strong>Confusable characters are a real attack, and normalisation does not touch them.</strong> The Cyrillic <code>а</code> (U+0430) renders identically to Latin <code>a</code> in nearly every font, and NFKC leaves both alone because they are genuinely different letters. A support agent reading <code>аdmin@cuongthai.com</code> in a ticket cannot see the difference. Two defences that are cheap: for domains you control, reject any local part outside a conservative character set; for display anywhere an operator makes a decision, mark addresses containing mixed scripts. Full confusable detection is a library, not a regex.</p>
</div>

<h3>Two columns, because they answer two questions</h3>
<pre><code>model NguoiDung {
  id             String   @id @default(cuid())
  email          String                        <span class="tok-comment">// NHƯ NGƯỜI TA GÕ — để hiển thị và để GỬI thư</span>
  emailChuanHoa  String   @unique              <span class="tok-comment">// đã chuẩn hoá — để TRA CỨU và bảo đảm duy nhất</span>
  matKhauBam     String?
  emailXacMinh   DateTime?
  taoLuc         DateTime @default(now())

  @@map("nguoi_dung")
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Send to what they typed</span><span class="lz-lnote">A handful of providers really do distinguish case in the local part. Keeping the original means the verification mail reaches the mailbox even in that minority, and it means the user sees their own address back, spelled their way.</span></div>
  <div class="lz-layer"><span class="lz-lname">Look up on the normalised column</span><span class="lz-lnote">Login, password reset and the uniqueness check all normalise the input and match this column. Never query the display column — that is how "I definitely have an account" tickets are born.</span></div>
  <div class="lz-layer"><span class="lz-lname">The unique index goes on one column only</span><span class="lz-lnote">Two rows may legitimately share a display value while differing in normalised form only if your rule is broken. One index, on <code>emailChuanHoa</code>, is the entire uniqueness policy.</span></div>
  <div class="lz-layer"><span class="lz-lname">Changing the rule later means a migration with judgement in it</span><span class="lz-lnote">Fold case tomorrow and any pair of rows that collide must be merged or one of them locked out. That is a product decision and a support conversation, not a schema change — which is why this lesson is early in the chapter.</span></div>
</div>

<h3>Check-then-insert is always a race</h3>
<pre><code><span class="tok-comment">// SAI: có một cái await giữa lúc kiểm và lúc chèn.</span>
const daCo = await prisma.nguoiDung.findUnique({ where: { emailChuanHoa: ch } });
if (daCo) throw new Error('email da duoc dung');
await prisma.nguoiDung.create({ data: { email, emailChuanHoa: ch, matKhauBam } });</code></pre>
<div class="out">A: tao thanh cong
B: 23505 duplicate key value violates unique constraint "nguoi_dung_email_chuan_hoa_key"

# Hai lan dang ky cung mot email, cach nhau vai mili giay: ca hai deu
# thay "chua ton tai", roi ca hai cung chen. Chi rang buoc duy nhat cua
# CO SO DU LIEU chan duoc cai thu hai.</div>
<pre><code><span class="tok-comment">// ĐÚNG: cứ chèn, và bắt lỗi vi phạm ràng buộc duy nhất.</span>
try {
  const nd = await prisma.nguoiDung.create({
    data: { email: tho.trim(), emailChuanHoa: ch, matKhauBam },
  });
  await guiThuXacMinh(nd);
} catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError &amp;&amp; e.code === 'P2002') {
    await guiThuDaCoTaiKhoan(ch);        <span class="tok-comment">// ← Bài 6.4: KHÔNG nói cho người gửi biết</span>
  } else throw e;
}
return res.status(202).json({ thongBao: 'Kiểm tra hộp thư của bạn.' });</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">The constraint is the check</span><span class="v">A <code>UNIQUE</code> index is enforced by the database under concurrency, at every isolation level, across every application process. A <code>SELECT</code> before an <code>INSERT</code> is a snapshot of the past and nothing more.</span></div>
  <div class="kv"><span class="k">Catch the code, not the message</span><span class="v">Prisma reports <code>P2002</code>; the underlying PostgreSQL code is <code>23505</code>. Both are stable. The message text is not, and matching on it breaks the day you upgrade.</span></div>
  <div class="kv"><span class="k">The two branches return the same thing</span><span class="v">Success and duplicate both answer <code>202</code> with the same body. The difference is which email gets sent, and only the mailbox owner sees that. This is Lesson 6.4's rule applied at its most important door.</span></div>
  <div class="kv"><span class="k">Hash before the insert, always</span><span class="v">Argon2id takes hundreds of milliseconds (Lesson 2.3). Compute it before opening any transaction, so a slow hash never holds a database connection or a row lock while it runs.</span></div>
</div>

<h3>Validating the address, and what actually validates it</h3>
<pre><code><span class="tok-comment">// Đủ rồi. Nghiêm hơn nữa là bạn đang từ chối những địa chỉ HỢP LỆ.</span>
const HOP_LE = /^[^\\s@]+@[^\\s@.]+\\.[^\\s@]+$/;
if (!HOP_LE.test(t) || t.length &gt; 254) throw new Error('email khong hop le');</code></pre>
<div class="note-ct">
<p><strong>The full grammar is not worth implementing, and the regex is not the validation.</strong> RFC 5322 permits quoted local parts, comments in parentheses and bracketed IP-literal domains; the well-known "perfect" regex runs to several kilobytes and still rejects valid addresses. Meanwhile a syntactically flawless address at a domain with no mailbox is useless to you. So keep the check loose enough not to reject a real user — one <code>@</code>, a dot in the domain, no whitespace, 254 characters — and let the verification mail in Lesson 6.2 do the real work. It answers the only question you care about: can this person read mail at this address?</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc5321#section-2.4" target="_blank" rel="noopener"><span class="lc-ico">📮</span><span class="lc-body"><span class="lc-title">RFC 5321 §2.4 — case sensitivity of the local part</span><span class="lc-sub">datatracker.ietf.org · The paragraph everyone cites and almost nobody follows</span></span></a>
<a class="link-card" href="https://unicode.org/reports/tr15/" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">UAX #15 — Unicode normalisation forms</span><span class="lc-sub">unicode.org · What NFKC actually does, and where it differs from NFC</span></span></a>
<a class="link-card" href="https://unicode.org/reports/tr39/" target="_blank" rel="noopener"><span class="lc-ico">🎭</span><span class="lc-body"><span class="lc-title">UTS #39 — confusable detection</span><span class="lc-sub">unicode.org · The mixed-script rules behind the Cyrillic-a attack</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/errcodes-appendix.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — error codes</span><span class="lc-sub">postgresql.org · 23505 and the rest of class 23, integrity constraint violation</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL</span><span class="lc-sub">Unique indexes, and what a constraint guarantees that application code cannot</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Fire two registrations at the same address concurrently, then add the constraint and watch the second one fail correctly</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Đăng ký, và cái định danh không rút lại được</h2>
<p class="lead">Mọi chương từ đầu tới giờ đều mặc định là đã có sẵn một bản ghi người dùng. Chương này TẠO ra nó — và quyết định nằm trong hai mươi dòng dưới đây là quyết định khó đảo ngược nhất của cả khoá, vì một khi đã có một triệu bản ghi mang định danh chuẩn hoá theo một kiểu, đổi luật nghĩa là phải gộp hoặc tách những tài khoản THẬT của những con người THẬT.</p>

<h3>Hỏi ít hơn cái bạn muốn hỏi</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Một định danh và một mật khẩu. Toàn bộ yêu cầu chỉ có thế</span><span class="v">Mọi thứ khác — họ tên đầy đủ, ngày sinh, số điện thoại, công ty — đều là những ô người dùng có thể điền sau, từ một màn hình mà bỏ dở giữa chừng chẳng khiến bạn mất gì. Ngay tại bước đăng ký, mỗi ô thêm vào là một phần trăm rơi rụng đo được và thêm một thứ bạn phải chịu trách nhiệm pháp lý khi lưu.</span></div>
  <div class="kv"><span class="k">Đừng bắt gõ mật khẩu hai lần</span><span class="v">Ô nhập lại tồn tại chỉ vì ô kia bị che. Một cái nút "hiện mật khẩu" giải quyết đúng vấn đề đó, giữ lại một ô duy nhất, và để người dùng thật sự nhìn được thứ họ vừa gõ. Nếu vẫn giữ ô nhập lại thì ít nhất hãy so sánh mà KHÔNG chuẩn hoá gì cả — khoảng trắng cuối cũng là một phần của mật khẩu.</span></div>
  <div class="kv"><span class="k">Đừng đẻ thêm cái tên đăng nhập</span><span class="v">Tên đăng nhập là một định danh thứ hai, kéo theo luật duy nhất riêng, bài toán chuẩn hoá riêng và rủi ro mạo danh riêng (Bài 6.4). Nếu sản phẩm của bạn không hiển thị nó ở đâu cả thì đừng có nó.</span></div>
  <div class="kv"><span class="k">Luật độ mạnh thuộc về Chương 2</span><span class="v">Sàn độ dài, đối chiếu danh sách rò rỉ, không có luật thành phần ký tự. Đăng ký là nơi THI HÀNH chính sách đó, không phải nơi thiết kế nó.</span></div>
</div>

<h3>Chuẩn hoá email, từng quyết định một</h3>
<pre><code><span class="tok-comment">// Chuẩn hoá: cắt khoảng trắng, hạ chữ, hợp nhất Unicode.</span>
export function chuanHoaEmail(tho: string): string {
  const t = tho.trim();
  const i = t.lastIndexOf('@');                 <span class="tok-comment">// last, không phải first: local part có thể chứa @</span>
  if (i &lt;= 0 || i === t.length - 1) throw new Error('email khong hop le');

  const local  = t.slice(0, i);
  const domain = t.slice(i + 1).toLowerCase();  <span class="tok-comment">// tên miền: KHÔNG phân biệt hoa thường, luôn luôn</span>

  return (local + '@' + domain).normalize('NFKC').toLowerCase();
}</code></pre>
<div class="out">"Nguyen.Van.A@Gmail.COM"           -> nguyen.van.a@gmail.com
"  cuong@cuongthai.com  "          -> cuong@cuongthai.com
"cuong+github@cuongthai.com"       -> cuong+github@cuongthai.com
"CUONG@CUONGTHAI.COM"              -> cuong@cuongthai.com
"admin@cuongthai.com"              -> admin@cuongthai.com     ← chu 'a' Kirin, KHAC hoan toan
430 64 6d 69 6e   ← ma diem cua "admin": U+0430 la Cyrillic small letter A</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Cắt khoảng trắng</span><span class="lz-t">Không ai cãi</span><span class="lz-d">Một cú dán từ bảng tính mang theo khoảng trắng ở đầu và cuối. Không hệ thống thư nào trên đời muốn chúng, và một người dùng không đăng nhập được vì một ký tự vô hình thì sẽ chẳng bao giờ đoán ra vì sao.</span></div>
  <div class="lz-step"><span class="lz-k">Hạ chữ tên miền</span><span class="lz-t">Luôn luôn đúng</span><span class="lz-d">DNS không phân biệt hoa thường và RFC 1035 chốt chuyện đó. <code>@Gmail.COM</code> với <code>@gmail.com</code> là cùng một máy chủ, không nhà cung cấp nào trên thế giới nghĩ khác.</span></div>
  <div class="lz-step"><span class="lz-k">Hạ chữ phần local</span><span class="lz-t">Về lý thì sai, về thực tế thì buộc phải làm</span><span class="lz-d">RFC 5321 nói phần trước dấu <code>@</code> thuộc về máy chủ nhận và CÓ THỂ phân biệt hoa thường. Thực tế thì mọi nhà cung cấp phổ thông đều gộp hoa thường, còn người dùng thì mỗi lần gõ địa chỉ của mình một kiểu. Hãy gộp — và ghi lại rằng bạn đã gộp.</span></div>
  <div class="lz-step"><span class="lz-k">NFKC TRƯỚC khi hạ chữ</span><span class="lz-t">Thứ tự có ý nghĩa</span><span class="lz-d">Unicode cho phép nhiều chuỗi byte khác nhau cho cùng một ký tự nhìn thấy. Chuẩn hoá trước nghĩa là <code>é</code> gõ bằng một mã điểm và <code>e</code> cộng một dấu ghép sẽ thành cùng một chuỗi; làm sau khi hạ chữ thì vẫn còn trường hợp lọt lưới.</span></div>
</div>

<h3>Cái KHÔNG được chuẩn hoá mất đi</h3>
<pre><code><span class="tok-comment">// CÁM DỖ: gộp bí danh để "chặn nhiều tài khoản". ĐỪNG.</span>
function dungLam(e: string) {
  const [local, domain] = e.split('@');
  return local.split('+')[0].replaceAll('.', '') + '@' + domain;
}
<span class="tok-comment">// "cuong.thai+mua@fastmail.com" → "cuongthai@fastmail.com"</span>
<span class="tok-comment">// …là một địa chỉ HOÀN TOÀN KHÁC ở fastmail, và có thể là người khác.</span></code></pre>
<div class="pitfall">
<p><strong>Bẫy — cắt dấu chấm và dấu cộng là LUẬT CỦA GMAIL, không phải luật của email.</strong> Gmail lờ dấu chấm và coi <code>+nhãn</code> là bí danh. Fastmail, Zoho, phần lớn máy chủ Exchange của doanh nghiệp và mọi tên miền tự dựng thì không: <code>a.b@</code> và <code>ab@</code> là hai hộp thư khác nhau, thường là hai người khác nhau. Cắt bừa cho toàn hệ thống thì sớm muộn bạn sẽ GỘP tài khoản của hai người lạ — một vụ lộ dữ liệu do chính bạn gây ra, và rất khó gỡ. Nếu buộc phải chặn bí danh dùng một lần thì hãy làm riêng cho từng nhà cung cấp đã biết, và chỉ để giới hạn lạm dụng, tuyệt đối không dùng cho danh tính.</p>
</div>
<div class="callout warn">
<p><strong>Ký tự nhìn giống nhau là một cú tấn công THẬT, và chuẩn hoá không đụng tới nó.</strong> Chữ <code>а</code> Kirin (U+0430) hiển thị y hệt chữ <code>a</code> Latin trong gần như mọi phông, và NFKC để yên cả hai vì chúng đúng là hai chữ cái khác nhau. Một bạn hỗ trợ đọc <code>аdmin@cuongthai.com</code> trong một ticket thì không thể nào thấy được sự khác biệt. Hai lớp phòng rẻ tiền: với những tên miền bạn tự quản, hãy từ chối mọi phần local nằm ngoài một tập ký tự bảo thủ; và ở bất cứ đâu một người vận hành phải ra quyết định, hãy đánh dấu những địa chỉ trộn nhiều hệ chữ. Phát hiện nhầm lẫn đầy đủ là việc của một thư viện, không phải của một biểu thức chính quy.</p>
</div>

<h3>Hai cột, vì chúng trả lời hai câu hỏi</h3>
<pre><code>model NguoiDung {
  id             String   @id @default(cuid())
  email          String                        <span class="tok-comment">// NHƯ NGƯỜI TA GÕ — để hiển thị và để GỬI thư</span>
  emailChuanHoa  String   @unique              <span class="tok-comment">// đã chuẩn hoá — để TRA CỨU và bảo đảm duy nhất</span>
  matKhauBam     String?
  emailXacMinh   DateTime?
  taoLuc         DateTime @default(now())

  @@map("nguoi_dung")
}</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Gửi tới đúng cái họ gõ</span><span class="lz-lnote">Có một nhúm nhà cung cấp thật sự phân biệt hoa thường ở phần local. Giữ lại bản gốc nghĩa là thư xác minh vẫn tới được hộp thư ngay cả trong số ít đó, và nghĩa là người dùng nhìn thấy địa chỉ của chính mình, viết theo cách của họ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tra cứu trên cột đã chuẩn hoá</span><span class="lz-lnote">Đăng nhập, đặt lại mật khẩu và phép kiểm duy nhất đều chuẩn hoá đầu vào rồi khớp với cột này. Đừng bao giờ truy vấn lên cột hiển thị — đó chính là cách những cái ticket "tôi CHẮC CHẮN có tài khoản" ra đời.</span></div>
  <div class="lz-layer"><span class="lz-lname">Chỉ MỘT cột mang chỉ mục duy nhất</span><span class="lz-lnote">Hai bản ghi có thể chính đáng trùng giá trị hiển thị, còn khác nhau ở dạng chuẩn hoá thì chỉ xảy ra khi luật của bạn hỏng. Một chỉ mục, trên <code>emailChuanHoa</code>, chính là toàn bộ chính sách duy nhất.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đổi luật về sau là một migration có yếu tố phán đoán bên trong</span><span class="lz-lnote">Ngày mai gộp hoa thường thì mọi cặp bản ghi va nhau đều phải được gộp lại hoặc phải khoá một cái. Đó là một quyết định sản phẩm và một cuộc trò chuyện với bộ phận hỗ trợ, không phải một thay đổi lược đồ — chính vì thế bài này nằm ở đầu chương.</span></div>
</div>

<h3>Kiểm rồi mới chèn LUÔN LUÔN là một cuộc đua</h3>
<pre><code><span class="tok-comment">// SAI: có một cái await giữa lúc kiểm và lúc chèn.</span>
const daCo = await prisma.nguoiDung.findUnique({ where: { emailChuanHoa: ch } });
if (daCo) throw new Error('email da duoc dung');
await prisma.nguoiDung.create({ data: { email, emailChuanHoa: ch, matKhauBam } });</code></pre>
<div class="out">A: tao thanh cong
B: 23505 duplicate key value violates unique constraint "nguoi_dung_email_chuan_hoa_key"

# Hai lan dang ky cung mot email, cach nhau vai mili giay: ca hai deu
# thay "chua ton tai", roi ca hai cung chen. Chi rang buoc duy nhat cua
# CO SO DU LIEU chan duoc cai thu hai.</div>
<pre><code><span class="tok-comment">// ĐÚNG: cứ chèn, và bắt lỗi vi phạm ràng buộc duy nhất.</span>
try {
  const nd = await prisma.nguoiDung.create({
    data: { email: tho.trim(), emailChuanHoa: ch, matKhauBam },
  });
  await guiThuXacMinh(nd);
} catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError &amp;&amp; e.code === 'P2002') {
    await guiThuDaCoTaiKhoan(ch);        <span class="tok-comment">// ← Bài 6.4: KHÔNG nói cho người gửi biết</span>
  } else throw e;
}
return res.status(202).json({ thongBao: 'Kiểm tra hộp thư của bạn.' });</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Ràng buộc CHÍNH LÀ phép kiểm</span><span class="v">Một chỉ mục <code>UNIQUE</code> được cơ sở dữ liệu thi hành dưới điều kiện song song, ở mọi mức cô lập, xuyên qua mọi tiến trình ứng dụng. Một câu <code>SELECT</code> đứng trước một câu <code>INSERT</code> chỉ là một tấm ảnh chụp quá khứ, không hơn.</span></div>
  <div class="kv"><span class="k">Bắt theo MÃ, đừng bắt theo lời nhắn</span><span class="v">Prisma báo <code>P2002</code>; mã gốc của PostgreSQL là <code>23505</code>. Cả hai đều ổn định. Còn phần chữ trong lời nhắn thì không, và khớp chuỗi vào đó là hỏng ngay ngày bạn nâng cấp.</span></div>
  <div class="kv"><span class="k">Hai nhánh trả về CÙNG MỘT thứ</span><span class="v">Thành công và trùng lặp đều đáp <code>202</code> với cùng một nội dung. Khác biệt nằm ở lá thư nào được gửi đi, và chỉ chủ hộp thư mới thấy điều đó. Đây là luật của Bài 6.4 áp dụng ngay tại cánh cửa quan trọng nhất.</span></div>
  <div class="kv"><span class="k">Băm TRƯỚC khi chèn, luôn luôn</span><span class="v">Argon2id ngốn hàng trăm mili giây (Bài 2.3). Hãy tính nó trước khi mở bất kỳ giao dịch nào, để một lần băm chậm không bao giờ giữ khư khư một kết nối cơ sở dữ liệu hay một khoá bản ghi trong lúc nó chạy.</span></div>
</div>

<h3>Kiểm tính hợp lệ của địa chỉ, và cái gì mới thật sự kiểm được</h3>
<pre><code><span class="tok-comment">// Đủ rồi. Nghiêm hơn nữa là bạn đang từ chối những địa chỉ HỢP LỆ.</span>
const HOP_LE = /^[^\\s@]+@[^\\s@.]+\\.[^\\s@]+$/;
if (!HOP_LE.test(t) || t.length &gt; 254) throw new Error('email khong hop le');</code></pre>
<div class="note-ct">
<p><strong>Cài đặt trọn vẹn cái ngữ pháp đó không đáng công, và biểu thức chính quy KHÔNG phải là phép kiểm thật.</strong> RFC 5322 cho phép phần local đặt trong nháy, cho phép ghi chú trong ngoặc đơn, cho phép tên miền là địa chỉ IP trong ngoặc vuông; cái biểu thức chính quy "hoàn hảo" nổi tiếng dài vài kilobyte và vẫn từ chối những địa chỉ hợp lệ. Trong khi đó, một địa chỉ đúng cú pháp hoàn hảo nhưng ở một tên miền không có hộp thư nào thì cũng vô dụng với bạn. Vậy nên hãy giữ phép kiểm đủ lỏng để không đá nhầm người dùng thật — một dấu <code>@</code>, một dấu chấm trong tên miền, không khoảng trắng, tối đa 254 ký tự — rồi để lá thư xác minh ở Bài 6.2 làm phần việc thật. Nó trả lời đúng câu hỏi duy nhất bạn quan tâm: người này có đọc được thư ở địa chỉ này không?</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://datatracker.ietf.org/doc/html/rfc5321#section-2.4" target="_blank" rel="noopener"><span class="lc-ico">📮</span><span class="lc-body"><span class="lc-title">RFC 5321 §2.4 — phân biệt hoa thường ở phần local</span><span class="lc-sub">datatracker.ietf.org · Cái đoạn ai cũng trích và gần như không ai làm theo</span></span></a>
<a class="link-card" href="https://unicode.org/reports/tr15/" target="_blank" rel="noopener"><span class="lc-ico">🔤</span><span class="lc-body"><span class="lc-title">UAX #15 — các dạng chuẩn hoá Unicode</span><span class="lc-sub">unicode.org · NFKC thật sự làm gì, và khác NFC ở chỗ nào</span></span></a>
<a class="link-card" href="https://unicode.org/reports/tr39/" target="_blank" rel="noopener"><span class="lc-ico">🎭</span><span class="lc-body"><span class="lc-title">UTS #39 — phát hiện ký tự nhìn giống nhau</span><span class="lc-sub">unicode.org · Luật trộn hệ chữ đứng sau cú tấn công chữ a Kirin</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/errcodes-appendix.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — bảng mã lỗi</span><span class="lc-sub">postgresql.org · 23505 và phần còn lại của lớp 23, vi phạm ràng buộc toàn vẹn</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL</span><span class="lc-sub">Chỉ mục duy nhất, và điều một ràng buộc bảo đảm được mà mã ứng dụng thì không</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Bắn hai lần đăng ký cùng một địa chỉ song song, rồi thêm ràng buộc và nhìn cái thứ hai hỏng cho đúng</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — Email verification, and the scanner that clicks your links|||6.2 — Xác minh email, và cái máy quét bấm hộ mọi đường dẫn của bạn',
      slug: 'auth-6-2-xac-minh-email',
      type: 'LESSON',
      description: 'Một token ngẫu nhiên, lưu dạng băm, dùng một lần, hết hạn sau hai mươi bốn giờ — phần dễ. Phần khó là cái cổng bảo mật của công ty người dùng đã BẤM vào đường dẫn trước khi họ mở thư, và câu hỏi tài khoản chưa xác minh thì được làm gì. Bài này trả lời cả hai, cộng một cái bẫy: đường dẫn xác minh mà đăng nhập luôn hộ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Email verification, and the scanner that clicks your links</h2>
<p class="lead">Verification answers one question: can the person who registered read mail at that address? Everything downstream depends on the answer — password reset in Lesson 6.3 is entirely built on it — so this is not a nicety, it is the foundation the rest of the chapter stands on.</p>

<h3>Three reasons, and they are not the same reason</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Deliverability</span><span class="lz-t">The typo problem</span><span class="lz-d">A user who typed <code>gmial.com</code> will never get a receipt, a reset link or a security alert, and will file a support ticket months later. Verification catches it in the first minute, while they still remember what they typed.</span></div>
  <div class="lz-step"><span class="lz-k">Ownership</span><span class="lz-t">The one that matters</span><span class="lz-d">Password reset means "prove you own the mailbox, get the account". If the mailbox was never proven to belong to this account, that is not a recovery mechanism — it is a takeover mechanism handed to whoever typed the address.</span></div>
  <div class="lz-step"><span class="lz-k">Abuse</span><span class="lz-t">Raising the unit cost</span><span class="lz-d">Unverified registration is free. Requiring a working mailbox does not stop a determined attacker — disposable addresses exist — but it turns "ten thousand accounts in a minute" into work.</span></div>
  <div class="lz-step"><span class="lz-k">Not a reason: identity</span><span class="lz-t">Say what you mean</span><span class="lz-d">A verified address proves mailbox access at one moment in time. It does not prove a name, an employer, an age or a country, and treating it as if it does is how "verified" ends up meaning nothing at all.</span></div>
</div>

<h3>The token is Chapter 1's primitive, unchanged</h3>
<pre><code>const token = randomBytes(32).toString('base64url');          <span class="tok-comment">// gửi đi trong thư</span>
const bam   = createHash('sha256').update(token).digest('hex'); <span class="tok-comment">// lưu vào CSDL</span>

await prisma.tokenXacMinh.create({
  data: { tokenBam: bam, nguoiDungId: nd.id, hetHanLuc: new Date(Date.now() + 864e5) },
});
await guiThu(nd.email, &#96;https://cuongthai.com/xac-minh?t=\${token}&#96;);</code></pre>
<div class="out">token   : dCfIs_pUdmFQQNwsRCsRu4vzDJfcwl_PTj9mmt8VbEc
do dai  : 43 ky tu · 256 bit entropy
bam     : 4c17b3f1f107285f515af3184df412993854542fefa6461a32ce30d85fb27599
URL     : https://cuongthai.com/xac-minh?t=dCfIs_pUdmFQQNwsRCsRu4vzDJfcwl_PTj9mmt8VbEc
do dai URL: 76 ky tu</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Store the hash, not the token</span><span class="v">Exactly the reasoning from Lesson 5.1: this row is a credential. A database dump, a log line or a support tool that prints the column must not hand anybody a working link. SHA-256 is right here — the input is 256 bits of randomness, so there is nothing to brute-force and no need for Argon2.</span></div>
  <div class="kv"><span class="k">Do not use a JWT</span><span class="v">A signed token cannot be marked used, cannot be revoked when the user asks for a new one, and cannot be expired early. Verification needs all three, and needs exactly one database row to get them. The signature buys you nothing you want.</span></div>
  <div class="kv"><span class="k">Twenty-four hours, and single use</span><span class="v">Long enough for someone who registered before bed, short enough that a link sitting in an archived mailbox stops working. Delete the row on use — do not merely flag it, unless you want the audit trail, in which case flag it and exclude used rows from the lookup.</span></div>
  <div class="kv"><span class="k">One live token per user</span><span class="v">Delete any outstanding verification token before issuing a new one. Otherwise "resend" leaves five valid links scattered across the mailbox, each one a live credential with its own expiry.</span></div>
</div>

<h3>The scanner that clicks your link before the user does</h3>
<div class="out"># Log cua /xac-minh, mot buoi sang binh thuong:
08:14:02  GET /xac-minh?t=dCfIs…  UA: Microsoft Office Existence Discovery   → 200, token DA DUNG
08:14:03  GET /xac-minh?t=dCfIs…  UA: Mozilla/5.0 (…) SkypeUriPreview        → 410 het han
08:31:47  GET /xac-minh?t=dCfIs…  UA: Mozilla/5.0 (Macintosh…) Safari/17.4   → 410 het han

# Nguoi dung bam luc 08:31 va thay "duong dan da het han".
# Ho khong lam gi sai ca. Cong bao mat cua cong ty ho bam truoc, luc 08:14.</div>
<div class="pitfall">
<p><strong>Trap — a GET that consumes the token will be consumed by a machine.</strong> Outlook Safe Links, Proofpoint, Mimecast, Slack unfurling, Skype previews and half a dozen antivirus suites fetch every URL in an incoming mail to check it. They arrive seconds after delivery, they follow redirects, and they do not run your JavaScript. Any side effect you attach to that <code>GET</code> has already happened by the time the human opens the message.</p>
</div>
<pre><code><span class="tok-comment">// Vá: GET chỉ HIỂN THỊ. Việc xác minh nằm sau một cú POST.</span>
app.get('/xac-minh', async (req, res) =&gt; {
  const t = String(req.query.t ?? '');
  const r = await timTokenConHan(t);                     <span class="tok-comment">// chỉ ĐỌC, không đổi gì</span>
  if (!r) return res.render('xac-minh-hong');
  res.render('xac-minh', { t });                          <span class="tok-comment">// một cái nút, form POST</span>
});

app.post('/xac-minh', dinhDanhCsrf, async (req, res) =&gt; { <span class="tok-comment">// ← Bài 3.5</span>
  const r = await timTokenConHan(String(req.body.t ?? ''));
  if (!r) return res.status(410).render('xac-minh-hong');

  await prisma.$transaction([
    prisma.nguoiDung.update({ where: { id: r.nguoiDungId }, data: { emailXacMinh: new Date() } }),
    prisma.tokenXacMinh.delete({ where: { id: r.id } }),
  ]);
  res.render('xac-minh-xong');
});</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">One extra click, and it is worth it</span><span class="lz-lnote">Users understand a page that says "Confirm this address" with a button. They do not understand a link that was already dead when they clicked it, and neither does your support team.</span></div>
  <div class="lz-layer"><span class="lz-lname">The cheaper alternative: idempotence</span><span class="lz-lnote">Keep the plain <code>GET</code>, but let the same token succeed repeatedly for its whole lifetime instead of dying on first use. The scanner verifies, the user verifies again, both see success. It costs the single-use property, which for verification — unlike password reset — is an acceptable trade.</span></div>
  <div class="lz-layer"><span class="lz-lname">Never use a bare GET for anything destructive</span><span class="lz-lnote">Unsubscribe, delete, accept-invitation, approve. The same scanners hit all of them, and a one-click unsubscribe that a security gateway triggers silently drops a user off your mailing list. That behaviour is why <code>POST</code> exists.</span></div>
  <div class="lz-layer"><span class="lz-lname">Do not try to detect the bots</span><span class="lz-lnote">User-agent allowlists rot within a quarter, and the gateways deliberately imitate browsers. Fix the shape of the request instead of guessing who sent it.</span></div>
</div>

<h3>What an unverified account may do</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Blocking login entirely</span><span class="v">The strictest option, and the one that produces the most stuck users: a typo at registration leaves them unable to log in, unable to fix the address, and unable to reset a password on a mailbox they cannot read. If you choose it, put an obvious "change my address" path on the blocked screen.</span></div>
  <div class="kv"><span class="k">Letting them in with restrictions (the default worth choosing)</span><span class="v">Log in, look around, configure things. Block anything that sends mail to other people, anything publicly visible, anything that spends money, and password reset. Almost every abuse case runs through those four, and almost every legitimate first session does not.</span></div>
  <div class="kv"><span class="k">Full access with a banner</span><span class="v">Right for internal tools where the address came from a directory, wrong for anything public: it means an unverified stranger can post under an address they do not own.</span></div>
  <div class="kv"><span class="k">Reset must always require verification</span><span class="v">Whatever else you allow, "reset the password on an address nobody proved they own" is the takeover path from the top of this lesson. There is no version of this that is safe.</span></div>
</div>

<h3>Resending, expiry, and the address stuck on an orphan</h3>
<pre><code><span class="tok-comment">// Gửi lại: giới hạn theo NGƯỜI DÙNG, và trả lời y hệt nhau dù có hay không.</span>
app.post('/xac-minh/gui-lai', gioiHan({ moiPhut: 1, moiGio: 5 }), async (req, res) =&gt; {
  const ch = chuanHoaEmail(String(req.body.email ?? ''));
  const nd = await prisma.nguoiDung.findUnique({ where: { emailChuanHoa: ch } });

  if (nd &amp;&amp; !nd.emailXacMinh) {
    await prisma.tokenXacMinh.deleteMany({ where: { nguoiDungId: nd.id } }); <span class="tok-comment">// một cái sống thôi</span>
    await phatTokenXacMinh(nd);
  }
  res.status(202).json({ thongBao: 'Nếu địa chỉ đó cần xác minh, thư đã được gửi.' });
});</code></pre>
<div class="callout warn">
<p><strong>The orphan account, and why you must be able to release an address.</strong> Someone registers with <code>cuong@cuongthai.com</code>, mistyping their own address by one letter — or deliberately typing yours. The row now holds an address they cannot verify, and the real owner cannot register because the unique index says the address is taken. Two mechanisms fix it, and you want both: let an unverified account change its address freely (nothing has been proven, so nothing is lost), and delete unverified accounts with no activity after thirty days. Without them, every typo permanently burns an address, and anyone can squat on a stranger's identifier for free.</p>
</div>
<div class="note-ct">
<p><strong>The verification link that also logs you in.</strong> It is tempting: the user clicks, lands inside the product, and the funnel improves measurably. It also makes the mailbox a login credential — the same design as a magic link, with the same consequences. An auto-forward rule set up years ago, a shared team inbox, a mail archive on an old laptop, and someone who is not the user is now signed in. If you do it, treat the resulting session as low-trust: valid for a short time, and required to re-enter the password before anything sensitive. If you do not want to reason about all of that, land them on the login page with a success banner and let them type their password. That is one extra step for a stranger's takeover to fail on.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/GET" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">MDN — GET is safe and idempotent</span><span class="lc-sub">developer.mozilla.org · The property the mail scanners are relying on</span></span></a>
<a class="link-card" href="https://learn.microsoft.com/en-us/defender-office-365/safe-links-about" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Microsoft — Safe Links</span><span class="lc-sub">learn.microsoft.com · What Defender does to every URL in an incoming mail</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — Forgot Password cheat sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · Token rules that apply to verification just as well</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">Sending mail from a service, and why delivery is its own subject</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Consume a verification link with curl before "opening" the mail, then move the side effect behind a POST</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Xác minh email, và cái máy quét bấm hộ mọi đường dẫn của bạn</h2>
<p class="lead">Xác minh trả lời đúng một câu hỏi: người vừa đăng ký có đọc được thư ở địa chỉ đó không? Mọi thứ phía sau đều dựa vào câu trả lời ấy — đặt lại mật khẩu ở Bài 6.3 dựng HOÀN TOÀN trên nó — nên đây không phải một thứ trang trí, mà là phần móng cho cả phần còn lại của chương đứng lên.</p>

<h3>Ba lý do, và chúng KHÔNG phải một lý do</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Thư tới được</span><span class="lz-t">Bài toán gõ nhầm</span><span class="lz-d">Một người gõ nhầm thành <code>gmial.com</code> sẽ chẳng bao giờ nhận được biên nhận, đường dẫn đặt lại mật khẩu hay cảnh báo bảo mật, rồi vài tháng sau mới mở một cái ticket. Xác minh bắt được nó ngay trong phút đầu tiên, lúc họ còn nhớ mình vừa gõ gì.</span></div>
  <div class="lz-step"><span class="lz-k">Quyền sở hữu</span><span class="lz-t">Cái quan trọng nhất</span><span class="lz-d">Đặt lại mật khẩu nghĩa là "chứng minh bạn sở hữu hộp thư, nhận lại tài khoản". Nếu hộp thư ấy chưa bao giờ được chứng minh là thuộc về tài khoản này thì đó không phải cơ chế khôi phục — đó là cơ chế CHIẾM tài khoản, trao tận tay cho bất kỳ ai đã gõ cái địa chỉ đó vào.</span></div>
  <div class="lz-step"><span class="lz-k">Chống lạm dụng</span><span class="lz-t">Nâng đơn giá lên</span><span class="lz-d">Đăng ký không xác minh thì miễn phí. Đòi một hộp thư chạy được không chặn nổi kẻ tấn công quyết tâm — địa chỉ dùng một lần vẫn có — nhưng nó biến "mười nghìn tài khoản trong một phút" thành một công việc phải làm.</span></div>
  <div class="lz-step"><span class="lz-k">KHÔNG phải lý do: danh tính</span><span class="lz-t">Nói đúng điều mình muốn nói</span><span class="lz-d">Một địa chỉ đã xác minh chứng minh quyền đọc hộp thư TẠI MỘT THỜI ĐIỂM. Nó không chứng minh một cái tên, một nơi làm việc, một độ tuổi hay một quốc gia, và coi nó như thể có chứng minh chính là cách chữ "đã xác minh" đi tới chỗ chẳng còn nghĩa gì.</span></div>
</div>

<h3>Cái token chính là nguyên thuỷ của Chương 1, không đổi gì</h3>
<pre><code>const token = randomBytes(32).toString('base64url');          <span class="tok-comment">// gửi đi trong thư</span>
const bam   = createHash('sha256').update(token).digest('hex'); <span class="tok-comment">// lưu vào CSDL</span>

await prisma.tokenXacMinh.create({
  data: { tokenBam: bam, nguoiDungId: nd.id, hetHanLuc: new Date(Date.now() + 864e5) },
});
await guiThu(nd.email, &#96;https://cuongthai.com/xac-minh?t=\${token}&#96;);</code></pre>
<div class="out">token   : dCfIs_pUdmFQQNwsRCsRu4vzDJfcwl_PTj9mmt8VbEc
do dai  : 43 ky tu · 256 bit entropy
bam     : 4c17b3f1f107285f515af3184df412993854542fefa6461a32ce30d85fb27599
URL     : https://cuongthai.com/xac-minh?t=dCfIs_pUdmFQQNwsRCsRu4vzDJfcwl_PTj9mmt8VbEc
do dai URL: 76 ky tu</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Lưu BĂM, không lưu token</span><span class="v">Đúng cái lý lẽ ở Bài 5.1: bản ghi này là một TÍN VẬT. Một bản dump cơ sở dữ liệu, một dòng log hay một công cụ hỗ trợ in cột đó ra đều không được phép trao cho ai một đường dẫn chạy được. SHA-256 là đúng ở đây — đầu vào đã là 256 bit ngẫu nhiên, nên chẳng có gì để dò cạn và không cần tới Argon2.</span></div>
  <div class="kv"><span class="k">Đừng dùng JWT</span><span class="v">Một token đã ký thì không đánh dấu được là đã dùng, không thu hồi được khi người dùng xin cái mới, và không cho hết hạn sớm được. Xác minh cần cả ba, và chỉ cần ĐÚNG MỘT bản ghi để có cả ba. Chữ ký chẳng mua cho bạn thứ gì bạn muốn cả.</span></div>
  <div class="kv"><span class="k">Hai mươi bốn giờ, và dùng MỘT lần</span><span class="v">Đủ dài cho người đăng ký ngay trước lúc đi ngủ, đủ ngắn để một đường dẫn nằm trong hộp thư lưu trữ thì thôi không chạy nữa. Hãy XOÁ bản ghi khi dùng — đừng chỉ gắn cờ, trừ khi bạn muốn giữ dấu vết kiểm toán, mà nếu vậy thì gắn cờ rồi loại các bản ghi đã dùng ra khỏi câu tra cứu.</span></div>
  <div class="kv"><span class="k">Mỗi người dùng chỉ MỘT token sống</span><span class="v">Hãy xoá mọi token xác minh còn treo trước khi phát cái mới. Không thì cái nút "gửi lại" để rơi năm đường dẫn còn hiệu lực rải rác khắp hộp thư, mỗi cái là một tín vật sống với hạn riêng của nó.</span></div>
</div>

<h3>Cái máy quét bấm đường dẫn của bạn trước cả người dùng</h3>
<div class="out"># Log cua /xac-minh, mot buoi sang binh thuong:
08:14:02  GET /xac-minh?t=dCfIs…  UA: Microsoft Office Existence Discovery   → 200, token DA DUNG
08:14:03  GET /xac-minh?t=dCfIs…  UA: Mozilla/5.0 (…) SkypeUriPreview        → 410 het han
08:31:47  GET /xac-minh?t=dCfIs…  UA: Mozilla/5.0 (Macintosh…) Safari/17.4   → 410 het han

# Nguoi dung bam luc 08:31 va thay "duong dan da het han".
# Ho khong lam gi sai ca. Cong bao mat cua cong ty ho bam truoc, luc 08:14.</div>
<div class="pitfall">
<p><strong>Bẫy — một cái GET có tiêu thụ token thì sẽ bị MÁY tiêu thụ.</strong> Outlook Safe Links, Proofpoint, Mimecast, phần xem trước của Slack, xem trước của Skype và cả tá bộ diệt virus đều tải MỌI URL trong thư đến để kiểm tra nó. Chúng tới sau vài giây kể từ lúc thư về, chúng đi theo cả chuyển hướng, và chúng KHÔNG chạy JavaScript của bạn. Mọi tác dụng phụ bạn gắn vào cái <code>GET</code> đó đều đã xảy ra xong trước khi con người mở thư ra.</p>
</div>
<pre><code><span class="tok-comment">// Vá: GET chỉ HIỂN THỊ. Việc xác minh nằm sau một cú POST.</span>
app.get('/xac-minh', async (req, res) =&gt; {
  const t = String(req.query.t ?? '');
  const r = await timTokenConHan(t);                     <span class="tok-comment">// chỉ ĐỌC, không đổi gì</span>
  if (!r) return res.render('xac-minh-hong');
  res.render('xac-minh', { t });                          <span class="tok-comment">// một cái nút, form POST</span>
});

app.post('/xac-minh', dinhDanhCsrf, async (req, res) =&gt; { <span class="tok-comment">// ← Bài 3.5</span>
  const r = await timTokenConHan(String(req.body.t ?? ''));
  if (!r) return res.status(410).render('xac-minh-hong');

  await prisma.$transaction([
    prisma.nguoiDung.update({ where: { id: r.nguoiDungId }, data: { emailXacMinh: new Date() } }),
    prisma.tokenXacMinh.delete({ where: { id: r.id } }),
  ]);
  res.render('xac-minh-xong');
});</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Thêm một cú bấm, và nó đáng</span><span class="lz-lnote">Người dùng hiểu một trang viết "Xác nhận địa chỉ này" kèm một cái nút. Họ không hiểu một đường dẫn đã chết sẵn từ trước lúc họ bấm vào, và đội hỗ trợ của bạn cũng vậy.</span></div>
  <div class="lz-layer"><span class="lz-lname">Phương án rẻ hơn: tính bất biến khi lặp</span><span class="lz-lnote">Giữ nguyên cái <code>GET</code> thường, nhưng cho cùng một token thành công NHIỀU LẦN suốt tuổi thọ của nó thay vì chết ngay lần đầu. Máy quét xác minh, người dùng xác minh lần nữa, cả hai đều thấy thành công. Cái giá là mất tính dùng-một-lần, mà với xác minh — khác với đặt lại mật khẩu — đó là một đánh đổi chấp nhận được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đừng bao giờ dùng GET trần cho việc có sức phá</span><span class="lz-lnote">Huỷ đăng ký nhận thư, xoá, nhận lời mời, phê duyệt. Đúng những máy quét đó đập vào tất cả, và một cái huỷ-nhận-thư-một-cú-bấm bị cổng bảo mật kích hoạt sẽ lặng lẽ gạt một người ra khỏi danh sách thư của bạn. Chính hành vi ấy là lý do <code>POST</code> tồn tại.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đừng cố NHẬN DIỆN đám bot</span><span class="lz-lnote">Danh sách trắng user-agent mục trong vòng một quý, còn các cổng thì cố tình giả dạng trình duyệt. Hãy sửa HÌNH DẠNG của request thay vì đoán xem ai gửi nó.</span></div>
</div>

<h3>Một tài khoản chưa xác minh được làm gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chặn hẳn không cho đăng nhập</span><span class="v">Phương án nghiêm nhất, và cũng là phương án sinh ra nhiều người dùng bị kẹt nhất: một cú gõ nhầm lúc đăng ký khiến họ không đăng nhập được, không sửa được địa chỉ, và không đặt lại được mật khẩu trên một hộp thư họ không đọc được. Nếu chọn nó, hãy đặt một lối "đổi địa chỉ của tôi" thật rõ ngay trên màn hình bị chặn.</span></div>
  <div class="kv"><span class="k">Cho vào nhưng hạn chế (mặc định đáng chọn)</span><span class="v">Đăng nhập, ngó nghiêng, cấu hình các thứ. Chặn mọi thứ GỬI THƯ TỚI NGƯỜI KHÁC, mọi thứ HIỂN THỊ CÔNG KHAI, mọi thứ TIÊU TIỀN, và đặt lại mật khẩu. Gần như mọi ca lạm dụng đều chạy qua bốn cái đó, còn gần như mọi phiên đầu tiên chính đáng thì không.</span></div>
  <div class="kv"><span class="k">Cho toàn quyền kèm một dải thông báo</span><span class="v">Đúng với công cụ nội bộ nơi địa chỉ lấy từ danh bạ công ty, sai với bất cứ thứ gì công khai: nó nghĩa là một người lạ chưa xác minh có thể đăng bài dưới một địa chỉ không thuộc về họ.</span></div>
  <div class="kv"><span class="k">Đặt lại mật khẩu thì LUÔN đòi đã xác minh</span><span class="v">Cho phép gì thì cho, riêng chuyện "đặt lại mật khẩu trên một địa chỉ chưa ai chứng minh là của mình" chính là con đường chiếm tài khoản ở đầu bài này. Không có phiên bản nào của chuyện đó là an toàn cả.</span></div>
</div>

<h3>Gửi lại, hết hạn, và cái địa chỉ kẹt trên một tài khoản mồ côi</h3>
<pre><code><span class="tok-comment">// Gửi lại: giới hạn theo NGƯỜI DÙNG, và trả lời y hệt nhau dù có hay không.</span>
app.post('/xac-minh/gui-lai', gioiHan({ moiPhut: 1, moiGio: 5 }), async (req, res) =&gt; {
  const ch = chuanHoaEmail(String(req.body.email ?? ''));
  const nd = await prisma.nguoiDung.findUnique({ where: { emailChuanHoa: ch } });

  if (nd &amp;&amp; !nd.emailXacMinh) {
    await prisma.tokenXacMinh.deleteMany({ where: { nguoiDungId: nd.id } }); <span class="tok-comment">// một cái sống thôi</span>
    await phatTokenXacMinh(nd);
  }
  res.status(202).json({ thongBao: 'Nếu địa chỉ đó cần xác minh, thư đã được gửi.' });
});</code></pre>
<div class="callout warn">
<p><strong>Tài khoản mồ côi, và vì sao bạn BẮT BUỘC phải giải phóng được một địa chỉ.</strong> Ai đó đăng ký bằng <code>cuong@cuongthai.com</code>, gõ nhầm địa chỉ của chính mình đúng một chữ cái — hoặc cố tình gõ địa chỉ của BẠN. Bản ghi giờ giữ một địa chỉ mà họ không xác minh nổi, còn chủ nhân thật thì không đăng ký được vì chỉ mục duy nhất bảo địa chỉ đã có người dùng. Hai cơ chế gỡ được, và bạn cần cả hai: cho một tài khoản CHƯA xác minh đổi địa chỉ tự do (chưa có gì được chứng minh nên chẳng mất gì cả), và xoá những tài khoản chưa xác minh không có hoạt động sau ba mươi ngày. Thiếu chúng thì mỗi cú gõ nhầm đốt vĩnh viễn một địa chỉ, và ai cũng có thể chiếm chỗ định danh của người lạ mà không tốn gì.</p>
</div>
<div class="note-ct">
<p><strong>Cái đường dẫn xác minh mà đăng nhập luôn hộ.</strong> Nghe rất hấp dẫn: người dùng bấm một cú, rơi thẳng vào trong sản phẩm, và phễu chuyển đổi đẹp lên thấy rõ. Nó cũng biến hộp thư thành một tín vật đăng nhập — cùng thiết kế với magic link, cùng hậu quả. Một quy tắc tự chuyển tiếp thư cài từ mấy năm trước, một hộp thư dùng chung của cả nhóm, một kho thư trên cái laptop cũ, và thế là một người KHÔNG PHẢI người dùng đang ngồi trong tài khoản. Nếu vẫn làm, hãy coi cái phiên sinh ra từ đó là phiên TIN THẤP: chỉ hiệu lực trong thời gian ngắn, và bắt nhập lại mật khẩu trước bất cứ việc nhạy cảm nào. Còn nếu bạn không muốn phải suy nghĩ về hết chừng ấy thứ thì hãy thả họ về trang đăng nhập kèm một dải báo thành công và để họ gõ mật khẩu. Đó là đúng một bước nữa để một cú chiếm tài khoản của người lạ vấp phải mà ngã.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods/GET" target="_blank" rel="noopener"><span class="lc-ico">🌐</span><span class="lc-body"><span class="lc-title">MDN — GET là an toàn và bất biến khi lặp</span><span class="lc-sub">developer.mozilla.org · Chính cái tính chất mà đám máy quét thư đang dựa vào</span></span></a>
<a class="link-card" href="https://learn.microsoft.com/en-us/defender-office-365/safe-links-about" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Microsoft — Safe Links</span><span class="lc-sub">learn.microsoft.com · Defender làm gì với mọi URL trong thư đến</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — bảng tra Quên mật khẩu</span><span class="lc-sub">cheatsheetseries.owasp.org · Luật về token, áp cho xác minh cũng đúng y như vậy</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">Gửi thư từ một dịch vụ, và vì sao chuyện thư tới được là một môn học riêng</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Tiêu thụ một đường dẫn xác minh bằng curl trước khi "mở thư", rồi đẩy tác dụng phụ ra sau một cú POST</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — Password reset, the most attacked flow you own|||6.3 — Đặt lại mật khẩu, luồng bị tấn công nhiều nhất mà bạn đang sở hữu',
      slug: 'auth-6-3-dat-lai-mat-khau',
      type: 'LESSON',
      description: 'Đặt lại mật khẩu là một đường đăng nhập KHÔNG CẦN MẬT KHẨU gắn thẳng vào ứng dụng của bạn, nên nó phải chặt hơn cả đăng nhập. Bài này thiết kế token, buộc nó vào phiên bản tín vật hiện tại, dựng URL từ CẤU HÌNH chứ không từ header Host — kèm output thật của cú đầu độc Host — và liệt kê những gì một lần đặt lại BẮT BUỘC phải thu hồi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Password reset, the most attacked flow you own</h2>
<p class="lead">Every protection in Chapters 2 through 5 — Argon2, rate limits, MFA, rotation — guards the front door. Password reset is a second door into the same house that opens for anyone who can read one mailbox, and it is usually built in an afternoon by whoever drew the short straw. Attackers know this. Treat it as the primary authentication path, because for them it is.</p>

<h3>The token, stricter than verification</h3>
<pre><code>model TokenDatLai {
  id            String   @id @default(cuid())
  tokenBam      String   @unique              <span class="tok-comment">// sha256 của 32 byte ngẫu nhiên</span>
  nguoiDungId   String
  phienBanTinVat Int                          <span class="tok-comment">// ← ràng buộc vào mật khẩu HIỆN TẠI</span>
  hetHanLuc     DateTime                      <span class="tok-comment">// now + 30 phút, KHÔNG phải 24 giờ</span>
  dungLuc       DateTime?
  ipYeuCau      String?
  taoLuc        DateTime @default(now())

  nguoiDung     NguoiDung @relation(fields: [nguoiDungId], references: [id], onDelete: Cascade)
  @@index([nguoiDungId])
  @@map("token_dat_lai")
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Thirty minutes</span><span class="lz-t">Not twenty-four hours</span><span class="lz-d">The user is standing at the screen waiting for the mail. A verification link may sit unread until evening; a reset link has no legitimate reason to work an hour later. Every extra minute is time a stolen mailbox stays useful.</span></div>
  <div class="lz-step"><span class="lz-k">Single use, with no exception</span><span class="lz-t">The idempotence trick from 6.2 does not apply</span><span class="lz-d">Here the <code>GET</code> only renders a form — it consumes nothing — and the <code>POST</code> that sets the new password consumes the token exactly once. The mail scanner opens the form, which is harmless, and the token survives for the human.</span></div>
  <div class="lz-step"><span class="lz-k">One live token per account</span><span class="lz-t">A new request kills the old</span><span class="lz-d">Delete outstanding rows before issuing. This is also the user's own escape hatch: if they suspect a reset mail they did not ask for, requesting one themselves invalidates whatever the attacker is holding.</span></div>
  <div class="lz-step"><span class="lz-k">Bound to the credential version</span><span class="lz-t">The subtle one</span><span class="lz-d">Store the account's current credential version in the row and compare it at redemption. A password change, an MFA enrolment or an admin lock bumps the counter, and every token issued before it dies at once — including the one an attacker requested last week and was saving.</span></div>
</div>
<pre><code><span class="tok-comment">// Đổi tín vật ở BẤT KỲ đâu → tăng bộ đếm → mọi token cũ chết theo</span>
await prisma.nguoiDung.update({
  where: { id },
  data: { matKhauBam: bamMoi, phienBanTinVat: { increment: 1 } },
});</code></pre>

<h3>The Host header builds your reset link. That is a vulnerability</h3>
<pre><code><span class="tok-comment">// SAI, và cực kỳ phổ biến: URL dựng từ thứ CLIENT gửi lên.</span>
const url = &#96;https://\${req.headers['x-forwarded-host'] ?? req.headers.host}/dat-lai?t=\${token}&#96;;
await guiThu(nd.email, url);</code></pre>
<div class="out">Host: cuongthai.com      X-Forwarded-Host: -                -> https://cuongthai.com/dat-lai?t=dCfIs_pU…
Host: ke-tan-cong.com    X-Forwarded-Host: -                -> https://ke-tan-cong.com/dat-lai?t=dCfIs_pU…
Host: cuongthai.com      X-Forwarded-Host: ke-tan-cong.com  -> https://ke-tan-cong.com/dat-lai?t=dCfIs_pU…

# Ba request THAT, gui bang socket tho. Ke tan cong dat header, may chu
# cua BAN gui thu that toi hop thu that cua nan nhan — voi mot duong dan
# tro ve may chu cua ho. Nan nhan bam, va token bay thang sang do.</div>
<div class="pitfall">
<p><strong>Trap — this attack needs no XSS, no interception and no access to the victim.</strong> The attacker submits "forgot password" for someone else's address with a poisoned <code>Host</code> or <code>X-Forwarded-Host</code>. Your server sends a genuine mail, from your genuine domain, passing SPF and DKIM, landing in the real inbox — carrying a link to the attacker's host. The victim clicks a link in a legitimate mail they were half-expecting, and the token is delivered to the attacker's access log. Even without a click, some setups leak it: any image or asset your reset page loads from that host takes the token along in the <code>Referer</code>.</p>
</div>
<pre><code><span class="tok-comment">// ĐÚNG: URL công khai là HẰNG SỐ CẤU HÌNH, không phải đầu vào.</span>
const URL_CONG_KHAI = process.env.URL_CONG_KHAI!;              <span class="tok-comment">// https://cuongthai.com</span>
const url = &#96;\${URL_CONG_KHAI}/dat-lai?t=\${token}&#96;;

<span class="tok-comment">// Và ở tầng biên: từ chối mọi Host lạ trước khi nó tới được app.</span>
<span class="tok-comment">// nginx: if ($host !~* ^(cuongthai\\.com|www\\.cuongthai\\.com)$) { return 421; }</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Two layers, because either one alone fails eventually</span><span class="v">The constant fixes the mail. The edge rule fixes every other place a stray <code>Host</code> reaches — absolute URLs in an API response, a redirect, a cached page keyed by host. Add both; neither costs anything to run.</span></div>
  <div class="kv"><span class="k">The same rule covers every generated link</span><span class="v">Verification, invitations, magic links, share URLs, unsubscribe. If a template builds a URL from a request header, it has this bug. Grep for <code>req.headers.host</code> and <code>x-forwarded-host</code> across the whole repo, not just the auth module.</span></div>
  <div class="kv"><span class="k">A proxy makes it worse, not better</span><span class="v">Behind a load balancer, <code>Host</code> is often already rewritten, so the app reads <code>X-Forwarded-Host</code> — a header any client can set and most proxies pass through untouched. Configure the proxy to overwrite it, and still do not trust it.</span></div>
  <div class="kv"><span class="k">Multi-tenant does not need the header either</span><span class="v">If a tenant has its own domain, look the tenant up from the account and read the domain from your own database. The mapping belongs to you; the header belongs to whoever sent the request.</span></div>
</div>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">1 · Request</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">POST /quen-mat-khau</span><span class="lz-nsub">Rate-limited per IP and per address · always answers 202 · sends nothing if the address is unverified</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">2 · Mail</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">One link, 30 minutes, single use</span><span class="lz-nsub">URL built from configuration · token stored as a hash · bound to the credential version</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">3 · Redeem</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">POST /dat-lai</span><span class="lz-nsub">One transaction: new hash · version bumped · token marked used · every session revoked</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">4 · Tell them</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"Your password was changed"</span><span class="lz-nsub">Sent every time, legitimate or not · the only signal that reaches a victim</span></div></div>
  </div>
</div>
<h3>The two endpoints, in full</h3>
<pre><code>app.post('/quen-mat-khau', gioiHan({ ip: '5/gio', email: '3/gio' }), async (req, res) =&gt; {
  const ch = chuanHoaEmail(String(req.body.email ?? ''));
  const nd = await prisma.nguoiDung.findUnique({ where: { emailChuanHoa: ch } });

  <span class="tok-comment">// CHỈ khi tài khoản tồn tại VÀ email đã xác minh (Bài 6.2).</span>
  if (nd?.emailXacMinh) {
    await prisma.tokenDatLai.deleteMany({ where: { nguoiDungId: nd.id } });
    const token = randomBytes(32).toString('base64url');
    await prisma.tokenDatLai.create({ data: {
      tokenBam: sha256(token), nguoiDungId: nd.id,
      phienBanTinVat: nd.phienBanTinVat,
      hetHanLuc: new Date(Date.now() + 30 * 60_000), ipYeuCau: req.ip,
    }});
    await guiThuDatLai(nd.email, &#96;\${URL_CONG_KHAI}/dat-lai?t=\${token}&#96;);
  }
  <span class="tok-comment">// MỘT câu trả lời duy nhất, cho mọi trường hợp. Bài 6.4.</span>
  res.status(202).json({ thongBao: 'Nếu địa chỉ đó có tài khoản, chúng tôi đã gửi thư.' });
});</code></pre>
<pre><code>app.post('/dat-lai', dinhDanhCsrf, async (req, res) =&gt; {
  const { t, matKhauMoi } = req.body;
  await kiemDoManh(matKhauMoi);                              <span class="tok-comment">// ← Chương 2, y hệt lúc đăng ký</span>

  const r = await prisma.tokenDatLai.findUnique({
    where: { tokenBam: sha256(String(t ?? '')) }, include: { nguoiDung: true },
  });
  if (!r || r.dungLuc || r.hetHanLuc &lt; new Date()
         || r.phienBanTinVat !== r.nguoiDung.phienBanTinVat) {
    return res.status(410).json({ loi: 'Đường dẫn không còn hiệu lực.' });
  }

  await prisma.$transaction([
    prisma.nguoiDung.update({ where: { id: r.nguoiDungId }, data: {
      matKhauBam: await argon2.hash(matKhauMoi),
      phienBanTinVat: { increment: 1 },                       <span class="tok-comment">// giết mọi token đặt lại khác</span>
    }}),
    prisma.tokenDatLai.update({ where: { id: r.id }, data: { dungLuc: new Date() } }),
    prisma.refreshToken.updateMany({                          <span class="tok-comment">// ← Bài 5.3: thu hồi TẤT CẢ</span>
      where: { nguoiDungId: r.nguoiDungId, thuHoiLuc: null },
      data: { thuHoiLuc: new Date() },
    }),
  ]);
  await guiThuDaDoiMatKhau(r.nguoiDung.email);                <span class="tok-comment">// ← cơ chế PHÁT HIỆN</span>
  res.status(204).end();
});</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Revoke every session, with no exception</span><span class="lz-lnote">Unlike the password change in Lesson 5.3, nobody performing a reset is logged in — and the whole reason for a reset may be that somebody else is. Keeping any session alive here defeats the point.</span></div>
  <div class="lz-layer"><span class="lz-lname">One transaction, or you get a half-reset</span><span class="lz-lnote">A crash between the password write and the token write leaves a used token that still looks live. Group them, and let the database guarantee that redeeming a token and changing a password happen together or not at all.</span></div>
  <div class="lz-layer"><span class="lz-lname">The notification mail is the detection</span><span class="lz-lnote">Send it to the address on file, always, including when the reset was legitimate. It is the only signal that reaches a user whose account was taken over through a compromised mailbox — and it is how they learn in minutes rather than months.</span></div>
  <div class="lz-layer"><span class="lz-lname">Enforce the strength rules again</span><span class="lz-lnote">This endpoint sets a password without ever showing the registration form. Skip the check here and you have a documented path for setting <code>123456</code> on any account, no matter what the signup screen enforces.</span></div>
</div>

<h3>Keeping the token out of places it should not be</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Referrer-Policy on the reset page</span><span class="v">Send <code>Referrer-Policy: no-referrer</code>. Without it, any third-party asset on that page — a font, an analytics pixel, a chat widget — receives the full URL, token included, in the <code>Referer</code> header. Better still: load nothing third-party on that page at all.</span></div>
  <div class="kv"><span class="k">Strip it from the address bar</span><span class="v">After the form renders, call <code>history.replaceState</code> to drop the query string. It keeps the token out of the browser history, out of a screen share and out of a copied URL, and it costs one line.</span></div>
  <div class="kv"><span class="k">Do not log the query string on that route</span><span class="v">Access logs, APM traces and error reporters all capture full URLs by default. A reset token in a log-aggregation index is a credential handed to everyone with a dashboard login. Redact the route explicitly.</span></div>
  <div class="kv"><span class="k">Rate-limit on both axes, and count the mail</span><span class="v">Per-IP stops the enumeration sweep; per-address stops the mail bomb — a hundred reset requests turning someone's inbox into a denial of service and burying the real alerts. Cap requests per address per hour and per day, and alert when one address goes far above normal.</span></div>
</div>
<div class="note-ct">
<p><strong>Do not sign the user in after a reset, and do not skip the notification for "clean" resets.</strong> Both shortcuts are asked for by product, and both remove the last checkpoint on the takeover path: a session handed out means the attacker who read the mailbox never has to type the password they just set, and a suppressed mail means the real owner never learns. Land the user on the login screen with a success message. If the reset was theirs, they type the password they chose ten seconds ago; if it was not, the mail arrives while there is still something to save.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — Forgot Password cheat sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · The reference this lesson follows, point by point</span></span></a>
<a class="link-card" href="https://portswigger.net/web-security/host-header" target="_blank" rel="noopener"><span class="lc-ico">💥</span><span class="lc-body"><span class="lc-title">PortSwigger — Host header attacks</span><span class="lc-sub">portswigger.net · Password reset poisoning, with labs you can run</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy" target="_blank" rel="noopener"><span class="lc-ico">🕶️</span><span class="lc-body"><span class="lc-title">MDN — Referrer-Policy</span><span class="lc-sub">developer.mozilla.org · Stopping the token from leaving with every asset request</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/request_processing.html" target="_blank" rel="noopener"><span class="lc-ico">🌊</span><span class="lc-body"><span class="lc-title">nginx — how a request picks a server block</span><span class="lc-sub">nginx.org · The default server, and rejecting an unknown Host at the edge</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Poison a reset link with a raw socket, then rebuild the URL from config and watch the attack die</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Đặt lại mật khẩu, luồng bị tấn công nhiều nhất mà bạn đang sở hữu</h2>
<p class="lead">Mọi lớp bảo vệ từ Chương 2 tới Chương 5 — Argon2, giới hạn tần suất, MFA, xoay vòng — đều canh cửa trước. Đặt lại mật khẩu là một CÁNH CỬA THỨ HAI vào cùng ngôi nhà, mở ra cho bất cứ ai đọc được một hộp thư, và nó thường được dựng trong một buổi chiều bởi người rút phải cọng thăm ngắn. Kẻ tấn công biết điều đó. Hãy đối xử với nó như con đường xác thực CHÍNH, vì với họ thì nó đúng là như vậy.</p>

<h3>Cái token, chặt hơn token xác minh</h3>
<pre><code>model TokenDatLai {
  id            String   @id @default(cuid())
  tokenBam      String   @unique              <span class="tok-comment">// sha256 của 32 byte ngẫu nhiên</span>
  nguoiDungId   String
  phienBanTinVat Int                          <span class="tok-comment">// ← ràng buộc vào mật khẩu HIỆN TẠI</span>
  hetHanLuc     DateTime                      <span class="tok-comment">// now + 30 phút, KHÔNG phải 24 giờ</span>
  dungLuc       DateTime?
  ipYeuCau      String?
  taoLuc        DateTime @default(now())

  nguoiDung     NguoiDung @relation(fields: [nguoiDungId], references: [id], onDelete: Cascade)
  @@index([nguoiDungId])
  @@map("token_dat_lai")
}</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Ba mươi phút</span><span class="lz-t">Không phải hai mươi bốn giờ</span><span class="lz-d">Người dùng đang đứng trước màn hình chờ thư về. Một đường dẫn xác minh có thể nằm im tới tối mới ai đó mở; còn một đường dẫn đặt lại thì chẳng có lý do chính đáng nào để còn chạy được sau một tiếng. Mỗi phút thừa ra là thêm một phút mà một hộp thư bị chiếm vẫn còn hữu dụng.</span></div>
  <div class="lz-step"><span class="lz-k">Dùng MỘT lần, không ngoại lệ</span><span class="lz-t">Mẹo bất-biến-khi-lặp ở Bài 6.2 KHÔNG áp dụng ở đây</span><span class="lz-d">Ở đây cái <code>GET</code> chỉ vẽ ra một cái biểu mẫu — nó không tiêu thụ gì cả — còn cú <code>POST</code> đặt mật khẩu mới thì tiêu thụ token đúng một lần. Máy quét thư mở cái biểu mẫu, chuyện đó vô hại, và token sống sót để dành cho con người.</span></div>
  <div class="lz-step"><span class="lz-k">Mỗi tài khoản một token sống</span><span class="lz-t">Yêu cầu mới giết cái cũ</span><span class="lz-d">Xoá mọi bản ghi còn treo trước khi phát. Đây cũng chính là lối thoát hiểm của người dùng: nếu họ nghi ngờ một lá thư đặt lại mà họ không hề yêu cầu, chỉ cần tự yêu cầu một cái là vô hiệu hoá luôn thứ kẻ tấn công đang cầm.</span></div>
  <div class="lz-step"><span class="lz-k">Buộc vào phiên bản tín vật</span><span class="lz-t">Cái tinh vi</span><span class="lz-d">Lưu phiên bản tín vật hiện tại của tài khoản vào bản ghi và so lại lúc đổi. Một lần đổi mật khẩu, một lần đăng ký MFA hay một lần bị quản trị viên khoá đều tăng bộ đếm, và mọi token phát ra trước đó chết cùng lúc — kể cả cái mà kẻ tấn công đã yêu cầu từ tuần trước và đang để dành.</span></div>
</div>
<pre><code><span class="tok-comment">// Đổi tín vật ở BẤT KỲ đâu → tăng bộ đếm → mọi token cũ chết theo</span>
await prisma.nguoiDung.update({
  where: { id },
  data: { matKhauBam: bamMoi, phienBanTinVat: { increment: 1 } },
});</code></pre>

<h3>Header Host đang dựng đường dẫn đặt lại của bạn. Đó là một LỖ HỔNG</h3>
<pre><code><span class="tok-comment">// SAI, và cực kỳ phổ biến: URL dựng từ thứ CLIENT gửi lên.</span>
const url = &#96;https://\${req.headers['x-forwarded-host'] ?? req.headers.host}/dat-lai?t=\${token}&#96;;
await guiThu(nd.email, url);</code></pre>
<div class="out">Host: cuongthai.com      X-Forwarded-Host: -                -> https://cuongthai.com/dat-lai?t=dCfIs_pU…
Host: ke-tan-cong.com    X-Forwarded-Host: -                -> https://ke-tan-cong.com/dat-lai?t=dCfIs_pU…
Host: cuongthai.com      X-Forwarded-Host: ke-tan-cong.com  -> https://ke-tan-cong.com/dat-lai?t=dCfIs_pU…

# Ba request THAT, gui bang socket tho. Ke tan cong dat header, may chu
# cua BAN gui thu that toi hop thu that cua nan nhan — voi mot duong dan
# tro ve may chu cua ho. Nan nhan bam, va token bay thang sang do.</div>
<div class="pitfall">
<p><strong>Bẫy — cú tấn công này KHÔNG cần XSS, không cần chặn đường truyền và không cần chạm được tới nạn nhân.</strong> Kẻ tấn công gửi "quên mật khẩu" cho địa chỉ của NGƯỜI KHÁC kèm một cái <code>Host</code> hoặc <code>X-Forwarded-Host</code> đã bị đầu độc. Máy chủ của bạn gửi một lá thư THẬT, từ tên miền THẬT của bạn, qua được cả SPF lẫn DKIM, rơi đúng vào hộp thư thật — mang theo một đường dẫn trỏ về máy chủ của kẻ tấn công. Nạn nhân bấm vào một đường dẫn nằm trong một lá thư chính danh mà họ cũng đang hơi chờ đợi, và cái token bay thẳng vào access log của kẻ tấn công. Thậm chí không cần cú bấm nào: ở một số cấu hình, chỉ cần trang đặt lại của bạn tải một tấm ảnh hay một tài nguyên nào đó từ máy chủ kia là token đã đi theo trong header <code>Referer</code>.</p>
</div>
<pre><code><span class="tok-comment">// ĐÚNG: URL công khai là HẰNG SỐ CẤU HÌNH, không phải đầu vào.</span>
const URL_CONG_KHAI = process.env.URL_CONG_KHAI!;              <span class="tok-comment">// https://cuongthai.com</span>
const url = &#96;\${URL_CONG_KHAI}/dat-lai?t=\${token}&#96;;

<span class="tok-comment">// Và ở tầng biên: từ chối mọi Host lạ trước khi nó tới được app.</span>
<span class="tok-comment">// nginx: if ($host !~* ^(cuongthai\\.com|www\\.cuongthai\\.com)$) { return 421; }</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Hai lớp, vì mỗi lớp đứng một mình đều sẽ có ngày hỏng</span><span class="v">Hằng số vá được lá thư. Luật ở tầng biên vá mọi chỗ CÒN LẠI mà một cái <code>Host</code> lạc loài chạm tới được — URL tuyệt đối trong phản hồi API, một cú chuyển hướng, một trang cache lấy host làm khoá. Hãy làm cả hai; chẳng cái nào tốn gì để chạy.</span></div>
  <div class="kv"><span class="k">Cùng luật đó áp cho MỌI đường dẫn sinh ra</span><span class="v">Xác minh, lời mời, magic link, URL chia sẻ, huỷ nhận thư. Nếu một cái template dựng URL từ một header của request thì nó đang mang đúng con lỗi này. Hãy grep <code>req.headers.host</code> và <code>x-forwarded-host</code> trên TOÀN kho mã, không chỉ trong module xác thực.</span></div>
  <div class="kv"><span class="k">Có proxy thì tệ hơn chứ không đỡ hơn</span><span class="v">Đứng sau cân bằng tải, <code>Host</code> thường đã bị viết lại rồi, nên ứng dụng quay ra đọc <code>X-Forwarded-Host</code> — một header mà client nào cũng đặt được và phần lớn proxy thì chuyển tiếp nguyên xi. Hãy cấu hình proxy GHI ĐÈ nó, và vẫn đừng tin nó.</span></div>
  <div class="kv"><span class="k">Nhiều tenant cũng chẳng cần tới cái header đó</span><span class="v">Nếu một tenant có tên miền riêng thì hãy tra tenant ra từ tài khoản và đọc tên miền từ cơ sở dữ liệu CỦA BẠN. Bảng ánh xạ đó thuộc về bạn; còn cái header thì thuộc về ai gửi request.</span></div>
</div>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">1 · Yêu cầu</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">POST /quen-mat-khau</span><span class="lz-nsub">Giới hạn theo IP và theo địa chỉ · luôn đáp 202 · không gửi gì nếu địa chỉ chưa xác minh</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">2 · Lá thư</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một đường dẫn, 30 phút, dùng một lần</span><span class="lz-nsub">URL dựng từ cấu hình · token lưu dạng băm · buộc vào phiên bản tín vật</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">3 · Đổi</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">POST /dat-lai</span><span class="lz-nsub">Một giao dịch: băm mới · tăng phiên bản · đánh dấu token đã dùng · thu hồi mọi phiên</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">4 · Báo cho họ</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"Mật khẩu của bạn vừa được đổi"</span><span class="lz-nsub">Gửi mọi lần, chính đáng hay không · tín hiệu DUY NHẤT chạm tới được nạn nhân</span></div></div>
  </div>
</div>
<h3>Hai endpoint, đầy đủ</h3>
<pre><code>app.post('/quen-mat-khau', gioiHan({ ip: '5/gio', email: '3/gio' }), async (req, res) =&gt; {
  const ch = chuanHoaEmail(String(req.body.email ?? ''));
  const nd = await prisma.nguoiDung.findUnique({ where: { emailChuanHoa: ch } });

  <span class="tok-comment">// CHỈ khi tài khoản tồn tại VÀ email đã xác minh (Bài 6.2).</span>
  if (nd?.emailXacMinh) {
    await prisma.tokenDatLai.deleteMany({ where: { nguoiDungId: nd.id } });
    const token = randomBytes(32).toString('base64url');
    await prisma.tokenDatLai.create({ data: {
      tokenBam: sha256(token), nguoiDungId: nd.id,
      phienBanTinVat: nd.phienBanTinVat,
      hetHanLuc: new Date(Date.now() + 30 * 60_000), ipYeuCau: req.ip,
    }});
    await guiThuDatLai(nd.email, &#96;\${URL_CONG_KHAI}/dat-lai?t=\${token}&#96;);
  }
  <span class="tok-comment">// MỘT câu trả lời duy nhất, cho mọi trường hợp. Bài 6.4.</span>
  res.status(202).json({ thongBao: 'Nếu địa chỉ đó có tài khoản, chúng tôi đã gửi thư.' });
});</code></pre>
<pre><code>app.post('/dat-lai', dinhDanhCsrf, async (req, res) =&gt; {
  const { t, matKhauMoi } = req.body;
  await kiemDoManh(matKhauMoi);                              <span class="tok-comment">// ← Chương 2, y hệt lúc đăng ký</span>

  const r = await prisma.tokenDatLai.findUnique({
    where: { tokenBam: sha256(String(t ?? '')) }, include: { nguoiDung: true },
  });
  if (!r || r.dungLuc || r.hetHanLuc &lt; new Date()
         || r.phienBanTinVat !== r.nguoiDung.phienBanTinVat) {
    return res.status(410).json({ loi: 'Đường dẫn không còn hiệu lực.' });
  }

  await prisma.$transaction([
    prisma.nguoiDung.update({ where: { id: r.nguoiDungId }, data: {
      matKhauBam: await argon2.hash(matKhauMoi),
      phienBanTinVat: { increment: 1 },                       <span class="tok-comment">// giết mọi token đặt lại khác</span>
    }}),
    prisma.tokenDatLai.update({ where: { id: r.id }, data: { dungLuc: new Date() } }),
    prisma.refreshToken.updateMany({                          <span class="tok-comment">// ← Bài 5.3: thu hồi TẤT CẢ</span>
      where: { nguoiDungId: r.nguoiDungId, thuHoiLuc: null },
      data: { thuHoiLuc: new Date() },
    }),
  ]);
  await guiThuDaDoiMatKhau(r.nguoiDung.email);                <span class="tok-comment">// ← cơ chế PHÁT HIỆN</span>
  res.status(204).end();
});</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Thu hồi MỌI phiên, không ngoại lệ</span><span class="lz-lnote">Khác với việc đổi mật khẩu ở Bài 5.3, người đang đặt lại thì không hề đăng nhập — và lý do phải đặt lại rất có thể chính là vì NGƯỜI KHÁC đang đăng nhập. Giữ lại bất kỳ phiên nào ở đây là phá hỏng toàn bộ ý nghĩa của việc này.</span></div>
  <div class="lz-layer"><span class="lz-lname">Một giao dịch, không thì bạn được một cú đặt lại NỬA VỜI</span><span class="lz-lnote">Một cú sập giữa lệnh ghi mật khẩu và lệnh ghi token để lại một token đã dùng mà nhìn vẫn như còn sống. Hãy gom chúng lại, và để cơ sở dữ liệu bảo đảm rằng việc tiêu token và việc đổi mật khẩu hoặc cùng xảy ra, hoặc cùng không.</span></div>
  <div class="lz-layer"><span class="lz-lname">Lá thư báo CHÍNH LÀ cơ chế phát hiện</span><span class="lz-lnote">Hãy gửi nó tới địa chỉ đang lưu, LUÔN LUÔN, kể cả khi lần đặt lại đó là chính đáng. Đó là tín hiệu duy nhất chạm tới được một người dùng vừa bị chiếm tài khoản qua một hộp thư bị xâm nhập — và đó là cách họ biết sau vài phút thay vì sau vài tháng.</span></div>
  <div class="lz-layer"><span class="lz-lname">Thi hành lại luật độ mạnh</span><span class="lz-lnote">Cái endpoint này đặt một mật khẩu mà chẳng bao giờ đi qua biểu mẫu đăng ký. Bỏ phép kiểm ở đây là bạn có một con đường được ghi thành tài liệu hẳn hoi để đặt <code>123456</code> lên bất kỳ tài khoản nào, bất kể màn hình đăng ký thi hành cái gì.</span></div>
</div>

<h3>Giữ token khỏi những chỗ nó không nên tới</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Referrer-Policy trên trang đặt lại</span><span class="v">Hãy gửi <code>Referrer-Policy: no-referrer</code>. Thiếu nó thì mọi tài nguyên bên thứ ba trên trang đó — một bộ phông, một pixel đo đạc, một widget chat — đều nhận được URL đầy đủ, kèm token, trong header <code>Referer</code>. Tốt hơn nữa: đừng tải BẤT CỨ thứ gì của bên thứ ba lên trang ấy.</span></div>
  <div class="kv"><span class="k">Gỡ nó khỏi thanh địa chỉ</span><span class="v">Sau khi biểu mẫu vẽ xong, gọi <code>history.replaceState</code> để bỏ phần chuỗi truy vấn đi. Nó giữ token khỏi lịch sử trình duyệt, khỏi một buổi chia sẻ màn hình và khỏi một cái URL bị sao chép, mà chỉ tốn đúng một dòng.</span></div>
  <div class="kv"><span class="k">Đừng ghi log chuỗi truy vấn trên tuyến đó</span><span class="v">Access log, vết APM và bộ báo lỗi mặc định đều thu URL đầy đủ. Một token đặt lại nằm trong chỉ mục gom log là một tín vật trao tận tay mọi người có tài khoản vào bảng điều khiển. Hãy che tuyến đó một cách tường minh.</span></div>
  <div class="kv"><span class="k">Giới hạn theo CẢ HAI trục, và đếm số thư</span><span class="v">Theo IP thì chặn được đợt quét dò; theo địa chỉ thì chặn được bom thư — một trăm yêu cầu đặt lại biến hộp thư của ai đó thành một cú từ chối dịch vụ và chôn vùi những cảnh báo thật. Hãy đặt trần theo giờ và theo ngày cho mỗi địa chỉ, và báo động khi một địa chỉ vọt lên cao hẳn so với bình thường.</span></div>
</div>
<div class="note-ct">
<p><strong>Đừng đăng nhập hộ người dùng sau khi đặt lại, và đừng bỏ lá thư báo với những lần đặt lại "sạch sẽ".</strong> Cả hai lối tắt đều do bên sản phẩm xin, và cả hai đều gỡ mất chốt kiểm cuối cùng trên con đường chiếm tài khoản: trao sẵn một phiên nghĩa là kẻ tấn công vừa đọc hộp thư không bao giờ phải gõ lại cái mật khẩu hắn vừa đặt, còn chặn lá thư nghĩa là chủ nhân thật không bao giờ biết. Hãy thả người dùng về màn hình đăng nhập kèm một lời báo thành công. Nếu lần đặt lại đó là của họ, họ gõ đúng cái mật khẩu họ vừa chọn mười giây trước; còn nếu không phải, lá thư tới lúc vẫn còn thứ để cứu.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — bảng tra Quên mật khẩu</span><span class="lc-sub">cheatsheetseries.owasp.org · Tài liệu tham chiếu mà bài này bám theo từng điểm một</span></span></a>
<a class="link-card" href="https://portswigger.net/web-security/host-header" target="_blank" rel="noopener"><span class="lc-ico">💥</span><span class="lc-body"><span class="lc-title">PortSwigger — tấn công qua header Host</span><span class="lc-sub">portswigger.net · Đầu độc đường dẫn đặt lại mật khẩu, kèm phòng lab chạy được</span></span></a>
<a class="link-card" href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy" target="_blank" rel="noopener"><span class="lc-ico">🕶️</span><span class="lc-body"><span class="lc-title">MDN — Referrer-Policy</span><span class="lc-sub">developer.mozilla.org · Chặn token đi theo mỗi lời gọi tài nguyên</span></span></a>
<a class="link-card" href="https://nginx.org/en/docs/http/request_processing.html" target="_blank" rel="noopener"><span class="lc-ico">🌊</span><span class="lc-body"><span class="lc-title">nginx — một request chọn khối server thế nào</span><span class="lc-sub">nginx.org · Server mặc định, và cách từ chối Host lạ ngay ở tầng biên</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Đầu độc một đường dẫn đặt lại bằng socket thô, rồi dựng lại URL từ cấu hình và nhìn cú tấn công chết</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — Account enumeration, and the leak no wording change can close|||6.4 — Dò tài khoản, và cái rò rỉ mà đổi câu chữ không bịt nổi',
      slug: 'auth-6-4-do-tai-khoan',
      type: 'LESSON',
      description: 'Bốn cửa làm lộ chuyện một địa chỉ có tài khoản hay không: câu chữ, mã trạng thái, THỜI GIAN, và các luồng phụ. Bài này đo cú rò rỉ thời gian thật — 0,001 ms so với 106 ms — vá nó, rồi nói thẳng cái giá phải trả về trải nghiệm và khi nào thì việc giấu là ĐÁNG, khi nào không.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Account enumeration, and the leak no wording change can close</h2>
<p class="lead">Enumeration is an attacker being able to ask "does this address have an account here?" and get a reliable answer. It is not a breach and it is often ranked low, which is exactly why it survives in production for years — and why the answer to it is a decision your product has to make on purpose rather than a bug you patch by editing a string.</p>

<h3>What it actually buys an attacker</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Targeting</span><span class="lz-t">Credential stuffing gets cheap</span><span class="lz-d">A ten-million-address breach list run against your login is mostly noise. Filtered down to the eighty thousand that have accounts here, it is a focused campaign that fits inside your rate limits and looks like ordinary traffic.</span></div>
  <div class="lz-step"><span class="lz-k">Phishing</span><span class="lz-t">Specific beats generic</span><span class="lz-d">"Your CuongThai account has unusual activity" sent only to people who actually have one converts several times better than a blind blast, and it survives the recipient's first sanity check.</span></div>
  <div class="lz-step"><span class="lz-k">The membership itself</span><span class="lz-t">Sometimes it is the whole harm</span><span class="lz-d">For a dating service, a health provider, a job board, a debt-advice site or a support forum, "this address has an account" is the private fact. There is no attack that has to follow; the disclosure is the damage.</span></div>
  <div class="lz-step"><span class="lz-k">Not a reason to panic</span><span class="lz-t">Rank it honestly</span><span class="lz-d">For a public developer tool where usernames are printed on profile pages, enumeration leaks nothing that is not already published. Fixing it there costs usability and buys nothing. Decide which product you are.</span></div>
</div>

<h3>The four leaks</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Leak 1</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Wording</span><span class="lz-nsub">"Email not registered" vs "Wrong password" · the one everybody fixes</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Leak 2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Status and shape</span><span class="lz-nsub">404 vs 401, a different JSON key, a different body length · same oracle, no reading required</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Leak 3</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Time</span><span class="lz-nsub">0.001 ms vs 106 ms · survives every wording fix · closed only by always hashing</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Leak 4</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">The other flows</span><span class="lz-nsub">Registration, reset, resend, the rate limiter itself · fix three and the fourth still answers</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// 1. Câu chữ — cái ai cũng biết</span>
if (!nd)          return res.status(404).json({ loi: 'Email chưa đăng ký' });
if (!khop)        return res.status(401).json({ loi: 'Sai mật khẩu' });

<span class="tok-comment">// 2. Mã trạng thái và HÌNH DẠNG — vẫn lộ y nguyên dù câu chữ giống hệt</span>
if (!nd)          return res.status(404).json({ loi: 'Thông tin đăng nhập không đúng' });
if (!khop)        return res.status(401).json({ loi: 'Thông tin đăng nhập không đúng' });
<span class="tok-comment">//                      ↑ 404 với 401. Kẻ tấn công đọc mã, không đọc chữ.</span></code></pre>
<div class="out">NGAY THO  khong co tai khoan :    0.001 ms
NGAY THO  CO  tai khoan      :  106.278 ms   <- chenh ~ 106358 lan
DA VA     khong co tai khoan :  106.415 ms
DA VA     CO  tai khoan      :  105.867 ms

# Do that, 15 luot moi ca, lay trung vi. Cai thu BA la thoi gian, va
# no lo hoan hao: khong co tai khoan thi ham bam KHONG chay.</div>
<div class="pitfall">
<p><strong>Trap — the timing leak is created by the very thing that makes your passwords safe.</strong> Argon2id is deliberately expensive: a hundred milliseconds and up. Skip it because there is no user row and you answer in microseconds. That gap is not a subtle statistical signal needing thousands of samples — it is a hundred-thousand-fold difference, visible in a single request, measurable over the internet through jitter, and completely untouched by making both error messages identical. A team that unified the wording and shipped it has fixed the symptom that appears in a screenshot and left the actual oracle running.</p>
</div>
<pre><code><span class="tok-comment">// 3. Vá thời gian: LUÔN LUÔN băm, kể cả khi không có tài khoản.</span>
const BAM_GIA = process.env.BAM_GIA!;   <span class="tok-comment">// một hash Argon2id thật, sinh một lần lúc khởi động</span>

const nd  = await prisma.nguoiDung.findUnique({ where: { emailChuanHoa: ch } });
const muc = nd?.matKhauBam ?? BAM_GIA;                 <span class="tok-comment">// ← không có bản ghi vẫn tốn đúng chừng ấy</span>
const khop = await argon2.verify(muc, matKhau);        <span class="tok-comment">// luôn chạy, luôn ~106ms</span>

if (!nd || !khop || nd.khoaLuc) {
  return res.status(401).json({ loi: 'Email hoặc mật khẩu không đúng' });  <span class="tok-comment">// MỘT câu, MỘT mã</span>
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">The dummy hash must be real</span><span class="v">Generate it once with the same algorithm and the same parameters as production hashes, and keep it in configuration. A hard-coded string from a blog post, or a hash with weaker parameters, is faster to verify and reintroduces the gap you just closed.</span></div>
  <div class="kv"><span class="k">Verify the whole condition after the hash, never before</span><span class="v">A locked account, an unverified address, a deleted row — every early <code>return</code> placed above the hash is a new timing channel with a new meaning. Gather the reasons, then answer once at the bottom.</span></div>
  <div class="kv"><span class="k">Argon2 parameters vary per row, and that leaks too</span><span class="v">After a parameter upgrade (Lesson 2.5), old rows verify faster than new ones. It distinguishes old accounts from new ones rather than existing from non-existing, which is usually acceptable — but if it is not, rehash on login and finish the migration.</span></div>
  <div class="kv"><span class="k">Rate limiting must not become the oracle</span><span class="v">A per-account limiter that answers <code>429</code> only for addresses it recognises reports existence perfectly, in one request, with no timing needed. Count against the address whether or not the account exists.</span></div>
</div>

<h3>The fourth leak: every other flow</h3>
<pre><code><span class="tok-comment">// Bốn cái cửa CÙNG phải trả lời như nhau, không thì ba cái kia vô nghĩa.</span>
POST /dang-ky           → 202 'Kiểm tra hộp thư của bạn.'        <span class="tok-comment">// dù trùng hay không (6.1)</span>
POST /quen-mat-khau     → 202 'Nếu địa chỉ đó có tài khoản, …'   <span class="tok-comment">// dù có hay không (6.3)</span>
POST /xac-minh/gui-lai  → 202 'Nếu địa chỉ đó cần xác minh, …'   <span class="tok-comment">// (6.2)</span>
POST /dang-nhap         → 401 'Email hoặc mật khẩu không đúng'   <span class="tok-comment">// + băm giả (ở trên)</span></code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Registration is the loudest door</span><span class="lz-lnote">"That email is already registered" is a perfect oracle, and it is the message almost every signup form shows. Hiding it means answering <code>202</code> either way and letting the mailbox carry the difference: a welcome mail, or a "someone tried to register with your address — here is a reset link" mail.</span></div>
  <div class="lz-layer"><span class="lz-lname">The mailbox is the only safe channel</span><span class="lz-lnote">This is the general shape of the whole lesson. Anything you must tell the account holder and must not tell a stranger goes by mail, because the mailbox is the one place only the real owner reads.</span></div>
  <div class="lz-layer"><span class="lz-lname">Half-hiding is worse than not hiding</span><span class="lz-lnote">A login that is careful and a reset that says "no account with that address" gives an attacker the same oracle and gives your team the belief that it is handled. If you decide to hide, audit all four; if you decide not to, write that down so nobody half-fixes it later.</span></div>
  <div class="lz-layer"><span class="lz-lname">The password-strength check can leak too</span><span class="lz-lnote">Some products reject a new password that matches the account's current one. On a reset form reachable without logging in, that reply confirms both the account and one password. Compare after redeeming the token, never before.</span></div>
</div>

<h3>The cost, stated honestly</h3>
<div class="callout warn">
<p><strong>Hiding enumeration makes your product measurably harder to use, and pretending otherwise is how the decision gets made badly.</strong> A user who registers twice gets no "you already have an account, log in instead" — they get a mail and a wait. A user who mistypes their address at reset gets a reassuring message and no mail, and will retype the same typo three times before contacting support. Your support team loses the ability to say "no, there is no account on that address". These are real costs, paid by every legitimate user, in exchange for slowing an attacker who has other ways to find targets.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hide it when membership is sensitive</span><span class="v">Health, finance, dating, employment, legal, addiction and support services, and anything where a list of your users is itself a story. Here the disclosure is the harm and no usability argument outweighs it.</span></div>
  <div class="kv"><span class="k">Hide it when registration is closed</span><span class="v">If accounts are created by an administrator or an invitation, there is no signup form demanding to reveal duplicates, so hiding costs almost nothing and the four responses stay consistent easily.</span></div>
  <div class="kv"><span class="k">Consider not hiding it when your product publishes members anyway</span><span class="v">Public profiles, public repositories, a public directory. GitHub and Slack both leak existence deliberately; both are usable partly because of it. If the fact is already public, protecting it at the login form is theatre.</span></div>
  <div class="kv"><span class="k">Close the timing leak either way</span><span class="v">Even a product that happily says "no such account" should always hash. The dummy hash costs one line, keeps every login path uniform, and stops the response time from silently disagreeing with whatever policy you chose.</span></div>
</div>
<div class="note-ct">
<p><strong>What to write in the decision record.</strong> One paragraph: whether membership in this product is sensitive, which of the four flows are uniform, what the login response time is in both branches, and who to ask before changing any of it. Enumeration defences erode the same way every time — someone adds a helpful message to the reset form during a usability push, and nobody connects it to a decision made two years earlier. The record is what makes that change get noticed in review instead of shipping.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-and-error-messages" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — authentication and error messages</span><span class="lc-sub">cheatsheetseries.owasp.org · The uniform-response rule, and the flows it applies to</span></span></a>
<a class="link-card" href="https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">OWASP WSTG — testing for account enumeration</span><span class="lc-sub">owasp.org · How an auditor will probe the four doors above</span></span></a>
<a class="link-card" href="https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">Node.js — timingSafeEqual</span><span class="lc-sub">nodejs.org · The comparison primitive, and what it does and does not cover</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">CuongThai course — Node.js</span><span class="lc-sub">Measuring with hrtime, and why a median beats a mean for latency</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Enumerate a login endpoint by timing alone, then add the dummy hash and watch the signal vanish</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Dò tài khoản, và cái rò rỉ mà đổi câu chữ không bịt nổi</h2>
<p class="lead">Dò tài khoản là chuyện kẻ tấn công hỏi được "địa chỉ này có tài khoản ở đây không?" và nhận về một câu trả lời đáng tin. Nó không phải một vụ lộ dữ liệu và thường bị xếp mức thấp, mà chính vì thế nó sống sót trên production hàng năm trời — và cũng vì thế câu trả lời cho nó phải là một QUYẾT ĐỊNH sản phẩm đưa ra có chủ ý, chứ không phải một con lỗi vá bằng cách sửa một chuỗi ký tự.</p>

<h3>Nó thật sự mua được gì cho kẻ tấn công</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Nhắm đúng mục tiêu</span><span class="lz-t">Nhồi tín vật trở nên rẻ</span><span class="lz-d">Một danh sách rò rỉ mười triệu địa chỉ đem bắn vào trang đăng nhập của bạn thì phần lớn là nhiễu. Lọc xuống còn tám mươi nghìn địa chỉ CÓ tài khoản ở đây thì nó thành một chiến dịch gọn gàng, lọt vừa trong hạn mức tần suất của bạn và trông y hệt lưu lượng bình thường.</span></div>
  <div class="lz-step"><span class="lz-k">Lừa đảo</span><span class="lz-t">Cụ thể thắng chung chung</span><span class="lz-d">"Tài khoản CuongThai của bạn có hoạt động bất thường" gửi riêng cho những người THẬT SỰ có tài khoản thì tỉ lệ ăn cao gấp mấy lần một cú bắn mù, và nó sống sót qua cái phép thử tỉnh táo đầu tiên của người nhận.</span></div>
  <div class="lz-step"><span class="lz-k">Chính chuyện là thành viên</span><span class="lz-t">Đôi khi đó là TOÀN BỘ thiệt hại</span><span class="lz-d">Với một dịch vụ hẹn hò, một cơ sở y tế, một trang tuyển dụng, một trang tư vấn nợ hay một diễn đàn hỗ trợ, "địa chỉ này có tài khoản" CHÍNH LÀ điều riêng tư. Không cần cú tấn công nào theo sau; việc tiết lộ đã là thiệt hại rồi.</span></div>
  <div class="lz-step"><span class="lz-k">Không phải lý do để hoảng</span><span class="lz-t">Xếp hạng cho trung thực</span><span class="lz-d">Với một công cụ lập trình công khai nơi tên người dùng in ngay trên trang hồ sơ, dò tài khoản chẳng làm lộ thứ gì chưa được công bố. Vá nó ở đó thì tốn trải nghiệm mà chẳng mua được gì. Hãy xác định bạn đang là loại sản phẩm nào.</span></div>
</div>

<h3>Bốn cái rò rỉ</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Rò rỉ 1</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Câu chữ</span><span class="lz-nsub">"Email chưa đăng ký" so với "Sai mật khẩu" · cái ai cũng vá</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Rò rỉ 2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Mã trạng thái và hình dạng</span><span class="lz-nsub">404 so với 401, một khoá JSON khác, một độ dài thân khác · cùng cái máy trả lời, chẳng cần đọc chữ</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Rò rỉ 3</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Thời gian</span><span class="lz-nsub">0,001 ms so với 106 ms · sống sót qua mọi lần sửa câu chữ · chỉ bịt được bằng cách LUÔN băm</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Rò rỉ 4</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Những luồng còn lại</span><span class="lz-nsub">Đăng ký, đặt lại, gửi lại, và chính bộ giới hạn tần suất · vá ba cái thì cái thứ tư vẫn trả lời</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// 1. Câu chữ — cái ai cũng biết</span>
if (!nd)          return res.status(404).json({ loi: 'Email chưa đăng ký' });
if (!khop)        return res.status(401).json({ loi: 'Sai mật khẩu' });

<span class="tok-comment">// 2. Mã trạng thái và HÌNH DẠNG — vẫn lộ y nguyên dù câu chữ giống hệt</span>
if (!nd)          return res.status(404).json({ loi: 'Thông tin đăng nhập không đúng' });
if (!khop)        return res.status(401).json({ loi: 'Thông tin đăng nhập không đúng' });
<span class="tok-comment">//                      ↑ 404 với 401. Kẻ tấn công đọc mã, không đọc chữ.</span></code></pre>
<div class="out">NGAY THO  khong co tai khoan :    0.001 ms
NGAY THO  CO  tai khoan      :  106.278 ms   <- chenh ~ 106358 lan
DA VA     khong co tai khoan :  106.415 ms
DA VA     CO  tai khoan      :  105.867 ms

# Do that, 15 luot moi ca, lay trung vi. Cai thu BA la thoi gian, va
# no lo hoan hao: khong co tai khoan thi ham bam KHONG chay.</div>
<div class="pitfall">
<p><strong>Bẫy — cú rò rỉ thời gian sinh ra bởi CHÍNH thứ làm cho mật khẩu của bạn an toàn.</strong> Argon2id cố tình đắt: một trăm mili giây trở lên. Bỏ qua nó vì không có bản ghi người dùng thì bạn trả lời trong vài micro giây. Khoảng chênh đó không phải một tín hiệu thống kê tinh vi cần tới hàng nghìn mẫu — nó là một khác biệt gấp cả trăm nghìn lần, nhìn thấy được trong MỘT request, đo được qua Internet xuyên qua độ nhiễu, và hoàn toàn không suy suyển gì khi bạn làm hai câu báo lỗi giống hệt nhau. Một đội đã thống nhất câu chữ rồi đưa lên là đã vá cái triệu chứng xuất hiện trong ảnh chụp màn hình và để nguyên cái máy trả lời thật đang chạy.</p>
</div>
<pre><code><span class="tok-comment">// 3. Vá thời gian: LUÔN LUÔN băm, kể cả khi không có tài khoản.</span>
const BAM_GIA = process.env.BAM_GIA!;   <span class="tok-comment">// một hash Argon2id thật, sinh một lần lúc khởi động</span>

const nd  = await prisma.nguoiDung.findUnique({ where: { emailChuanHoa: ch } });
const muc = nd?.matKhauBam ?? BAM_GIA;                 <span class="tok-comment">// ← không có bản ghi vẫn tốn đúng chừng ấy</span>
const khop = await argon2.verify(muc, matKhau);        <span class="tok-comment">// luôn chạy, luôn ~106ms</span>

if (!nd || !khop || nd.khoaLuc) {
  return res.status(401).json({ loi: 'Email hoặc mật khẩu không đúng' });  <span class="tok-comment">// MỘT câu, MỘT mã</span>
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Cái băm giả phải là băm THẬT</span><span class="v">Hãy sinh nó một lần bằng đúng thuật toán và đúng tham số như các hash trên production, rồi cất vào cấu hình. Một chuỗi chép cứng từ một bài blog, hay một hash với tham số yếu hơn, sẽ xác minh nhanh hơn và mở lại đúng cái khoảng chênh bạn vừa bịt.</span></div>
  <div class="kv"><span class="k">Kiểm TOÀN BỘ điều kiện SAU khi băm, đừng bao giờ trước</span><span class="v">Tài khoản bị khoá, địa chỉ chưa xác minh, bản ghi đã xoá — mỗi lệnh <code>return</code> sớm đặt phía trên hàm băm là một kênh thời gian MỚI mang một ý nghĩa MỚI. Hãy gom hết lý do lại, rồi trả lời đúng một lần ở dưới cùng.</span></div>
  <div class="kv"><span class="k">Tham số Argon2 khác nhau theo từng bản ghi, và cái đó cũng lộ</span><span class="v">Sau một lần nâng tham số (Bài 2.5), bản ghi cũ xác minh nhanh hơn bản ghi mới. Nó phân biệt tài khoản CŨ với tài khoản MỚI chứ không phải có với không có, nên thường chấp nhận được — còn nếu không chấp nhận được thì hãy băm lại lúc đăng nhập và làm cho xong cuộc di trú.</span></div>
  <div class="kv"><span class="k">Giới hạn tần suất KHÔNG được trở thành cái máy trả lời</span><span class="v">Một bộ giới hạn theo tài khoản chỉ trả <code>429</code> cho những địa chỉ nó nhận ra thì báo cáo sự tồn tại một cách hoàn hảo, trong một request, chẳng cần đo thời gian gì cả. Hãy đếm theo địa chỉ bất kể tài khoản có tồn tại hay không.</span></div>
</div>

<h3>Cái rò rỉ thứ tư: mọi luồng CÒN LẠI</h3>
<pre><code><span class="tok-comment">// Bốn cái cửa CÙNG phải trả lời như nhau, không thì ba cái kia vô nghĩa.</span>
POST /dang-ky           → 202 'Kiểm tra hộp thư của bạn.'        <span class="tok-comment">// dù trùng hay không (6.1)</span>
POST /quen-mat-khau     → 202 'Nếu địa chỉ đó có tài khoản, …'   <span class="tok-comment">// dù có hay không (6.3)</span>
POST /xac-minh/gui-lai  → 202 'Nếu địa chỉ đó cần xác minh, …'   <span class="tok-comment">// (6.2)</span>
POST /dang-nhap         → 401 'Email hoặc mật khẩu không đúng'   <span class="tok-comment">// + băm giả (ở trên)</span></code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Đăng ký là cánh cửa ồn ào nhất</span><span class="lz-lnote">"Email này đã được đăng ký" là một cái máy trả lời hoàn hảo, và đó lại là câu mà gần như mọi biểu mẫu đăng ký đều hiển thị. Giấu nó nghĩa là đáp <code>202</code> trong cả hai trường hợp và để HỘP THƯ mang phần khác biệt: một lá thư chào mừng, hoặc một lá thư "có người vừa thử đăng ký bằng địa chỉ của bạn — đây là đường dẫn đặt lại mật khẩu".</span></div>
  <div class="lz-layer"><span class="lz-lname">Hộp thư là kênh AN TOÀN duy nhất</span><span class="lz-lnote">Đây là hình dạng chung của cả bài này. Bất cứ điều gì bạn BUỘC phải nói với chủ tài khoản mà KHÔNG được nói với người lạ thì đều đi bằng thư, vì hộp thư là nơi duy nhất chỉ chủ nhân thật đọc được.</span></div>
  <div class="lz-layer"><span class="lz-lname">Giấu một nửa còn tệ hơn không giấu</span><span class="lz-lnote">Một trang đăng nhập cẩn thận đi kèm một trang đặt lại nói "không có tài khoản nào với địa chỉ đó" thì tặng kẻ tấn công đúng cái máy trả lời ấy, đồng thời tặng đội của bạn niềm tin rằng chuyện đã xong. Nếu đã quyết định giấu thì hãy soát cả bốn; còn nếu quyết định không giấu thì hãy GHI LẠI, để về sau không ai vá nửa vời.</span></div>
  <div class="lz-layer"><span class="lz-lname">Phép kiểm độ mạnh mật khẩu cũng lộ được</span><span class="lz-lnote">Vài sản phẩm từ chối một mật khẩu mới trùng với mật khẩu hiện tại của tài khoản. Trên một biểu mẫu đặt lại vào được mà không cần đăng nhập, câu trả lời đó xác nhận cùng lúc cả tài khoản LẪN một mật khẩu. Hãy so sánh SAU khi đã tiêu token, đừng bao giờ trước.</span></div>
</div>

<h3>Cái giá, nói cho thật</h3>
<div class="callout warn">
<p><strong>Giấu chuyện dò tài khoản làm sản phẩm của bạn khó dùng hơn một cách đo được, và vờ như không phải vậy chính là cách quyết định này bị đưa ra một cách tồi.</strong> Một người đăng ký lần thứ hai sẽ không nhận được câu "bạn đã có tài khoản rồi, hãy đăng nhập" — họ nhận một lá thư và một khoảng chờ. Một người gõ nhầm địa chỉ lúc đặt lại thì nhận một lời trấn an và không nhận thư nào, rồi sẽ gõ lại đúng cái lỗi ấy ba lần trước khi liên hệ hỗ trợ. Đội hỗ trợ của bạn mất luôn khả năng nói "không, địa chỉ đó không có tài khoản nào". Đó là những cái giá THẬT, do mọi người dùng chính đáng trả, đổi lấy việc làm chậm một kẻ tấn công vốn còn nhiều đường khác để tìm mục tiêu.</p>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hãy giấu khi việc là thành viên là chuyện nhạy cảm</span><span class="v">Y tế, tài chính, hẹn hò, việc làm, pháp lý, cai nghiện và các dịch vụ hỗ trợ, cùng bất cứ thứ gì mà một danh sách người dùng của bạn TỰ NÓ đã là một câu chuyện. Ở đây việc tiết lộ chính là thiệt hại và không lý lẽ trải nghiệm nào nặng cân hơn nó.</span></div>
  <div class="kv"><span class="k">Hãy giấu khi đăng ký là đóng</span><span class="v">Nếu tài khoản do quản trị viên tạo hoặc do lời mời sinh ra thì chẳng có biểu mẫu đăng ký nào đòi phải tiết lộ chuyện trùng lặp, nên giấu gần như chẳng tốn gì và bốn câu trả lời dễ dàng giữ được nhất quán.</span></div>
  <div class="kv"><span class="k">Hãy cân nhắc KHÔNG giấu khi sản phẩm vốn đã công bố thành viên</span><span class="v">Hồ sơ công khai, kho mã công khai, một danh bạ công khai. GitHub lẫn Slack đều cố ý để lộ sự tồn tại; cả hai dùng dễ một phần chính vì thế. Nếu điều đó vốn đã công khai thì bảo vệ nó ở biểu mẫu đăng nhập chỉ là diễn kịch.</span></div>
  <div class="kv"><span class="k">Bịt cú rò rỉ thời gian trong CẢ HAI trường hợp</span><span class="v">Ngay cả một sản phẩm vui vẻ nói "không có tài khoản nào" thì vẫn nên LUÔN băm. Cái băm giả tốn một dòng, giữ cho mọi đường đăng nhập đồng đều, và chặn việc thời gian phản hồi âm thầm cãi lại đúng cái chính sách bạn vừa chọn.</span></div>
</div>
<div class="note-ct">
<p><strong>Nên ghi gì vào biên bản quyết định.</strong> Một đoạn: việc là thành viên của sản phẩm này có nhạy cảm không, trong bốn luồng thì những luồng nào đang đồng nhất, thời gian phản hồi của đăng nhập ở cả hai nhánh là bao nhiêu, và phải hỏi ai trước khi đổi bất kỳ thứ gì trong đó. Hàng rào chống dò tài khoản luôn mòn đi theo cùng một cách: có người thêm một câu thông báo "cho thân thiện" vào biểu mẫu đặt lại trong một đợt cải thiện trải nghiệm, và chẳng ai nối nó lại với một quyết định đưa ra từ hai năm trước. Cái biên bản chính là thứ khiến thay đổi ấy bị nhìn thấy lúc review thay vì lặng lẽ lên production.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-and-error-messages" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — xác thực và các thông báo lỗi</span><span class="lc-sub">cheatsheetseries.owasp.org · Luật trả lời đồng nhất, và những luồng nó áp vào</span></span></a>
<a class="link-card" href="https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/03-Identity_Management_Testing/04-Testing_for_Account_Enumeration_and_Guessable_User_Account" target="_blank" rel="noopener"><span class="lc-ico">🔍</span><span class="lc-body"><span class="lc-title">OWASP WSTG — kiểm thử dò tài khoản</span><span class="lc-sub">owasp.org · Cách một người kiểm toán sẽ dò bốn cánh cửa ở trên</span></span></a>
<a class="link-card" href="https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b" target="_blank" rel="noopener"><span class="lc-ico">⏱️</span><span class="lc-body"><span class="lc-title">Node.js — timingSafeEqual</span><span class="lc-sub">nodejs.org · Nguyên thuỷ so sánh, và nó phủ được gì, không phủ được gì</span></span></a>
<a class="link-card" href="/courses/nodejs/learn${REF}"><span class="lc-ico">🟩</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Node.js</span><span class="lc-sub">Đo bằng hrtime, và vì sao trung vị hơn trung bình khi đo độ trễ</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Dò một endpoint đăng nhập CHỈ bằng thời gian, rồi thêm băm giả và nhìn tín hiệu biến mất</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 6.5 ─────────────────────────── */
    {
      title: '6.5 — Changing the address, and ending the account|||6.5 — Đổi địa chỉ, và kết thúc một tài khoản',
      slug: 'auth-6-5-doi-email-va-xoa',
      type: 'LESSON',
      description: 'Đổi email là một nguyên thuỷ CHIẾM tài khoản: đổi địa chỉ rồi đặt lại mật khẩu là xong. Bài này dựng nó thành ba bước có hoàn tác được, rồi sang phần xoá tài khoản — cửa sổ ân hạn, cái gì xoá thật cái gì ẩn danh, ràng buộc khoá ngoại đo thật trên chính kho mã này, và cái sự thật về bản sao lưu mà không ai muốn ghi vào chính sách.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.5</span>
<h2>Changing the address, and ending the account</h2>
<p class="lead">These two flows look like settings-screen chores and they are nothing of the sort. Changing an email address is the shortest takeover path in the entire product, and deleting an account is where a security decision, a legal obligation and a database schema all have to agree with each other in writing.</p>

<h3>Why changing an address is a takeover primitive</h3>
<pre><code><span class="tok-comment">// Kẻ tấn công có một phiên sống (laptop mượn, XSS, cookie bị cắp).</span>
PATCH /toi/email  { email: 'ke-tan-cong@vidu.com' }   → 200 OK
POST  /quen-mat-khau { email: 'ke-tan-cong@vidu.com' } → thư về hộp thư CỦA HẮN
POST  /dat-lai    { t: '…', matKhauMoi: '…' }          → mọi phiên bị thu hồi

<span class="tok-comment">// Chủ nhân thật giờ: không đăng nhập được, không đặt lại được (địa chỉ đã đổi),</span>
<span class="tok-comment">// và không có lá thư nào báo cho họ biết. Ba request. Không cần biết mật khẩu.</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Step 1</span><span class="lz-t">Re-enter the password</span><span class="lz-d">A live session is not enough to change the recovery address. Require the current password — or a passkey, or the MFA code from Chapter 7 — immediately before the change, not at the start of the session. This alone kills the attack above.</span></div>
  <div class="lz-step"><span class="lz-k">Step 2</span><span class="lz-t">Verify the new address before switching</span><span class="lz-d">Store the new address as <em>pending</em> and send it a token. The account keeps its old address until that token is redeemed, so a typo changes nothing and cannot lock anybody out.</span></div>
  <div class="lz-step"><span class="lz-k">Step 3</span><span class="lz-t">Tell the old address, with an undo</span><span class="lz-d">Mail the address being replaced: "your address is being changed to c…g@vidu.com; if this was not you, click here". That link revokes the pending change, revokes every session and forces a password reset. It is the only message that reaches the real owner.</span></div>
  <div class="lz-step"><span class="lz-k">And keep the undo alive afterwards</span><span class="lz-t">Thirty days</span><span class="lz-d">The notice is worth little if the owner reads it a week later. Keep the undo token valid well past the change, so a mail found late still rescues the account. Facebook and Google both do this; it is the difference between a warning and a remedy.</span></div>
</div>
<pre><code>model EmailChoDoi {
  id             String   @id @default(cuid())
  nguoiDungId    String   @unique                  <span class="tok-comment">// mỗi tài khoản một cái chờ</span>
  emailMoi       String
  emailMoiChuanHoa String
  tokenBam       String   @unique
  hetHanLuc      DateTime
  taoLuc         DateTime @default(now())

  nguoiDung      NguoiDung @relation(fields: [nguoiDungId], references: [id], onDelete: Cascade)
  @@map("email_cho_doi")
}</code></pre>
<div class="pitfall">
<p><strong>Trap — the pending address must be checked against the same uniqueness rule, and checked twice.</strong> Normalise it and reject it if any account already uses it — but the real trap is the gap between requesting the change and redeeming it. Two accounts can each hold a pending change to the same address, or somebody else can register it in the meantime. The check at request time is a courtesy that gives a good error message; the check that matters happens inside the transaction at redemption, where a <code>P2002</code> from the unique index is the only thing that cannot be raced.</p>
</div>

<h3>Deleting an account: the grace period is the security control</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Immediate deletion is a weapon</span><span class="v">An attacker with a session who cannot steal the account can still destroy it, and destruction is irreversible in a way a password change is not. A thirty-day window turns the worst case from "everything is gone" into "everything came back".</span></div>
  <div class="kv"><span class="k">Require re-authentication, same as the email change</span><span class="v">Password or passkey, immediately before. Deletion is at least as consequential as changing the recovery address, so it gets at least the same gate.</span></div>
  <div class="kv"><span class="k">Revoke every session at the request, not at the purge</span><span class="v">The moment deletion is requested, log the account out everywhere and block login except through a restore link mailed to the address on file. If the request came from an attacker, that is what returns control to the owner.</span></div>
  <div class="kv"><span class="k">Mail the confirmation, and say the date</span><span class="v">"Your account will be permanently deleted on 22 September. Restore it here." A user who did not ask for this now has a month and one click; a user who did gets a receipt they can find later.</span></div>
</div>

<h3>What actually gets deleted, and what cannot be</h3>
<div class="out"># Rang buoc khoa ngoai THAT trong prisma/migrations cua chinh kho ma nay:
    273  ON DELETE CASCADE
     43  ON DELETE SET NULL
      6  ON DELETE RESTRICT

ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId")
  REFERENCES "users"("id") ON DELETE CASCADE

# Xoa mot bang users keo theo 273 duong cascade. Do la mot dieu TOT — mien la
# ban biet duong nao la CASCADE, duong nao SET NULL, va duong nao RESTRICT
# se lam ca lenh xoa that bai luc 2 gio sang.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cascade for what belongs to the user</span><span class="lz-lnote">Sessions, refresh tokens, reset tokens, notification preferences, drafts. These have no meaning without the account and no reason to survive it. In Prisma, put <code>onDelete: Cascade</code> on the relation so the constraint is enforced by the database, not by application code that a script can bypass.</span></div>
  <div class="lz-layer"><span class="lz-lname">Set null and anonymise for what others still need</span><span class="lz-lnote">A comment thread, an audit log, a moderation record. Replace the author with a tombstone — "deleted user" — rather than cascading, so a conversation does not lose half its messages when one participant leaves.</span></div>
  <div class="lz-layer"><span class="lz-lname">Restrict for what the law keeps</span><span class="lz-lnote">Invoices, tax records, payment history. GDPR Article 17(3) explicitly carves out data you are legally required to retain, and a cascade that silently erases an invoice creates a bigger problem than the one it solved. Make deletion fail loudly here and handle it deliberately.</span></div>
  <div class="lz-layer"><span class="lz-lname">The processors you do not control</span><span class="lz-lnote">Analytics, error reporting, mail provider, CRM, support desk, log aggregator. Each holds a copy of the address and each needs its own deletion call. If your deletion job only touches your own database, the account is not deleted — it is deleted from the one place you were looking at.</span></div>
</div>
<div class="callout warn">
<p><strong>You cannot surgically delete a row from last week's backup, and no policy makes that untrue.</strong> Backups are immutable snapshots by design — that property is what makes them a recovery mechanism. The accepted answer everywhere, including under GDPR, is not to rewrite them: state a retention window (thirty, sixty, ninety days), guarantee that backups older than it are destroyed, and keep a log of deletion requests that is re-applied after any restore. Write that down in the privacy policy, and build the re-apply step before you need it — the day you restore a six-week-old backup and quietly resurrect two hundred deleted accounts is a very bad day to be designing it.</p>
</div>

<h3>Releasing the identifier</h3>
<pre><code><span class="tok-comment">// Sau khi xoá thật: địa chỉ được giải phóng, và ai đó CÓ THỂ đăng ký lại nó.</span>
<span class="tok-comment">// Người đăng ký mới KHÔNG được thừa kế bất cứ thứ gì của người cũ.</span>

<span class="tok-comment">// SAI — nối lại dữ liệu cũ qua email:</span>
const cu = await prisma.donHang.findMany({ where: { emailKhach: ch } });   <span class="tok-comment">// ← KHÔNG</span>

<span class="tok-comment">// ĐÚNG — mọi thứ nối bằng id tài khoản, và id đó đã chết cùng tài khoản:</span>
const cua = await prisma.donHang.findMany({ where: { nguoiDungId: nd.id } });</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Never join user data on the address</span><span class="v">Addresses get recycled — a corporate mailbox handed to a new employee, a personal domain that changed hands, a provider that reissues a dormant name. Any table keyed by email instead of account id will silently hand one person another person's history.</span></div>
  <div class="kv"><span class="k">Consider not releasing it at all</span><span class="v">Keeping a tombstone row that reserves the normalised address forever removes the recycling problem completely, at the cost of a user who genuinely wants to start over being unable to. For a bank, keep it; for a forum, release it.</span></div>
  <div class="kv"><span class="k">Third-party identity is not yours to release</span><span class="v">If the account was created through Google or GitHub (Chapter 8), delete the link too. Otherwise the next person to sign in with that provider account may be matched to the ghost of the old one.</span></div>
  <div class="kv"><span class="k">Export before you delete</span><span class="v">Offer the data export as part of the deletion flow, not buried elsewhere. It is a legal requirement in several jurisdictions, and it is the difference between a user leaving satisfied and a user leaving angry with a copy of nothing.</span></div>
</div>
<div class="note-ct">
<p><strong>The three mails that make this chapter safe.</strong> Address changed, password changed, account deletion requested — sent to the address that is being replaced or removed, always, with no opt-out and no exception for "the user did it themselves". Every takeover pattern in Chapters 5 and 6 ends with the attacker holding the account and the owner knowing nothing, and these three messages are the only ones that reach past the attacker. They are cheap to send, they are the most-read mail your product will ever produce, and each one should carry a link that undoes what it describes.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://gdpr-info.eu/art-17-gdpr/" target="_blank" rel="noopener"><span class="lc-ico">⚖️</span><span class="lc-body"><span class="lc-title">GDPR Article 17 — right to erasure</span><span class="lc-sub">gdpr-info.eu · Including paragraph 3, the exceptions that keep invoices alive</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/referential-actions" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Prisma — referential actions</span><span class="lc-sub">prisma.io · Cascade, SetNull and Restrict, and which layer enforces them</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — session management</span><span class="lc-sub">cheatsheetseries.owasp.org · Re-authentication before a sensitive operation</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">CuongThai course — Prisma ORM</span><span class="lc-sub">Referential actions in the schema, and what the generated SQL really says</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Take over an account by changing its address, then add the three steps and try again</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.5</span>
<h2>Đổi địa chỉ, và kết thúc một tài khoản</h2>
<p class="lead">Hai luồng này nhìn như mấy việc vặt trong màn hình cài đặt, mà chúng hoàn toàn không phải vậy. Đổi địa chỉ email là con đường CHIẾM TÀI KHOẢN ngắn nhất trong cả sản phẩm, còn xoá tài khoản là chỗ mà một quyết định bảo mật, một nghĩa vụ pháp lý và một lược đồ cơ sở dữ liệu buộc phải thống nhất với nhau — bằng văn bản.</p>

<h3>Vì sao đổi địa chỉ là một nguyên thuỷ chiếm tài khoản</h3>
<pre><code><span class="tok-comment">// Kẻ tấn công có một phiên sống (laptop mượn, XSS, cookie bị cắp).</span>
PATCH /toi/email  { email: 'ke-tan-cong@vidu.com' }   → 200 OK
POST  /quen-mat-khau { email: 'ke-tan-cong@vidu.com' } → thư về hộp thư CỦA HẮN
POST  /dat-lai    { t: '…', matKhauMoi: '…' }          → mọi phiên bị thu hồi

<span class="tok-comment">// Chủ nhân thật giờ: không đăng nhập được, không đặt lại được (địa chỉ đã đổi),</span>
<span class="tok-comment">// và không có lá thư nào báo cho họ biết. Ba request. Không cần biết mật khẩu.</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Bước 1</span><span class="lz-t">Nhập lại mật khẩu</span><span class="lz-d">Một phiên đang sống KHÔNG đủ để đổi địa chỉ khôi phục. Hãy đòi mật khẩu hiện tại — hoặc một passkey, hoặc mã MFA ở Chương 7 — NGAY TRƯỚC lúc đổi, không phải ở đầu phiên. Riêng cái này đã giết chết cú tấn công phía trên.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 2</span><span class="lz-t">Xác minh địa chỉ mới TRƯỚC khi chuyển</span><span class="lz-d">Hãy lưu địa chỉ mới ở trạng thái <em>chờ</em> rồi gửi cho nó một token. Tài khoản vẫn giữ địa chỉ cũ cho tới khi token ấy được đổi, nên một cú gõ nhầm chẳng đổi được gì và không thể khoá ai ra ngoài.</span></div>
  <div class="lz-step"><span class="lz-k">Bước 3</span><span class="lz-t">Báo cho địa chỉ CŨ, kèm nút hoàn tác</span><span class="lz-d">Gửi thư tới chính cái địa chỉ đang bị thay: "địa chỉ của bạn đang được đổi sang c…g@vidu.com; nếu không phải bạn thì bấm vào đây". Đường dẫn đó huỷ yêu cầu đổi, thu hồi mọi phiên và bắt buộc đặt lại mật khẩu. Đó là lá thư DUY NHẤT chạm tới được chủ nhân thật.</span></div>
  <div class="lz-step"><span class="lz-k">Và giữ nút hoàn tác sống SAU đó nữa</span><span class="lz-t">Ba mươi ngày</span><span class="lz-d">Lá thư báo chẳng đáng bao nhiêu nếu chủ nhân đọc nó sau một tuần. Hãy giữ token hoàn tác còn hiệu lực lâu sau khi đã đổi, để một lá thư tìm thấy muộn vẫn cứu được tài khoản. Facebook lẫn Google đều làm thế; đó là khác biệt giữa một lời cảnh báo và một phương thuốc.</span></div>
</div>
<pre><code>model EmailChoDoi {
  id             String   @id @default(cuid())
  nguoiDungId    String   @unique                  <span class="tok-comment">// mỗi tài khoản một cái chờ</span>
  emailMoi       String
  emailMoiChuanHoa String
  tokenBam       String   @unique
  hetHanLuc      DateTime
  taoLuc         DateTime @default(now())

  nguoiDung      NguoiDung @relation(fields: [nguoiDungId], references: [id], onDelete: Cascade)
  @@map("email_cho_doi")
}</code></pre>
<div class="pitfall">
<p><strong>Bẫy — địa chỉ đang chờ phải chịu ĐÚNG cái luật duy nhất đó, và phải kiểm HAI lần.</strong> Hãy chuẩn hoá nó và từ chối nếu đã có tài khoản nào dùng — nhưng cái bẫy thật nằm ở khoảng trống giữa lúc yêu cầu đổi và lúc đổi thật. Hai tài khoản có thể cùng lúc giữ một yêu cầu đổi sang cùng một địa chỉ, hoặc một người khác kịp đăng ký nó trong lúc đó. Phép kiểm lúc yêu cầu chỉ là một phép lịch sự để có thông báo lỗi tử tế; phép kiểm THẬT SỰ quan trọng nằm bên trong giao dịch lúc đổi, nơi một cái <code>P2002</code> từ chỉ mục duy nhất là thứ duy nhất không đua được với nó.</p>
</div>

<h3>Xoá tài khoản: cửa sổ ân hạn CHÍNH LÀ biện pháp bảo mật</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Xoá ngay lập tức là một VŨ KHÍ</span><span class="v">Một kẻ tấn công có phiên mà không cướp nổi tài khoản thì vẫn PHÁ được nó, và phá thì không đảo ngược được theo cách mà một lần đổi mật khẩu thì có. Một cửa sổ ba mươi ngày biến tình huống xấu nhất từ "mất sạch" thành "mọi thứ đã quay lại".</span></div>
  <div class="kv"><span class="k">Đòi xác thực lại, y như lúc đổi email</span><span class="v">Mật khẩu hoặc passkey, ngay trước đó. Xoá tài khoản ít nhất cũng hệ trọng ngang việc đổi địa chỉ khôi phục, nên nó xứng đáng ít nhất cùng một cái cổng.</span></div>
  <div class="kv"><span class="k">Thu hồi mọi phiên NGAY LÚC YÊU CẦU, không phải lúc xoá thật</span><span class="v">Ngay khoảnh khắc có yêu cầu xoá, hãy đăng xuất tài khoản khỏi mọi nơi và chặn đăng nhập, trừ qua một đường dẫn khôi phục gửi tới địa chỉ đang lưu. Nếu yêu cầu đó tới từ kẻ tấn công thì chính cái đó trả quyền kiểm soát về cho chủ nhân.</span></div>
  <div class="kv"><span class="k">Gửi thư xác nhận, và NÓI RÕ NGÀY</span><span class="v">"Tài khoản của bạn sẽ bị xoá vĩnh viễn vào ngày 22 tháng 9. Khôi phục tại đây." Một người không hề yêu cầu chuyện này giờ có một tháng và một cú bấm; một người thật sự yêu cầu thì có một biên nhận để tìm lại sau này.</span></div>
</div>

<h3>Cái gì thật sự bị xoá, và cái gì thì không thể</h3>
<div class="out"># Rang buoc khoa ngoai THAT trong prisma/migrations cua chinh kho ma nay:
    273  ON DELETE CASCADE
     43  ON DELETE SET NULL
      6  ON DELETE RESTRICT

ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId")
  REFERENCES "users"("id") ON DELETE CASCADE

# Xoa mot bang users keo theo 273 duong cascade. Do la mot dieu TOT — mien la
# ban biet duong nao la CASCADE, duong nao SET NULL, va duong nao RESTRICT
# se lam ca lenh xoa that bai luc 2 gio sang.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cascade cho những gì THUỘC VỀ người dùng</span><span class="lz-lnote">Phiên, refresh token, token đặt lại, tuỳ chọn thông báo, bản nháp. Chúng chẳng có nghĩa gì khi không còn tài khoản và chẳng có lý do gì để sống lâu hơn nó. Trong Prisma, hãy đặt <code>onDelete: Cascade</code> lên quan hệ để ràng buộc do CƠ SỞ DỮ LIỆU thi hành, chứ không do mã ứng dụng mà một cái script có thể đi vòng qua.</span></div>
  <div class="lz-layer"><span class="lz-lname">Set null và ẩn danh cho những gì NGƯỜI KHÁC vẫn cần</span><span class="lz-lnote">Một luồng bình luận, một nhật ký kiểm toán, một bản ghi kiểm duyệt. Hãy thay tác giả bằng một tấm bia — "người dùng đã xoá" — thay vì cascade, để một cuộc trò chuyện không mất nửa số tin nhắn chỉ vì một người tham gia rời đi.</span></div>
  <div class="lz-layer"><span class="lz-lname">Restrict cho những gì LUẬT giữ lại</span><span class="lz-lnote">Hoá đơn, sổ sách thuế, lịch sử thanh toán. Điều 17(3) của GDPR nói thẳng phần trừ ra cho dữ liệu bạn có nghĩa vụ pháp lý phải lưu, và một cú cascade âm thầm xoá mất một tờ hoá đơn tạo ra vấn đề lớn hơn cái nó vừa giải quyết. Ở đây hãy để lệnh xoá THẤT BẠI THÀNH TIẾNG và xử lý có chủ ý.</span></div>
  <div class="lz-layer"><span class="lz-lname">Những bên xử lý mà bạn KHÔNG kiểm soát</span><span class="lz-lnote">Bộ đo đạc, bộ báo lỗi, nhà cung cấp thư, CRM, bàn hỗ trợ, chỗ gom log. Mỗi chỗ giữ một bản sao của địa chỉ và mỗi chỗ cần một lời gọi xoá riêng. Nếu công việc xoá của bạn chỉ đụng tới cơ sở dữ liệu của chính bạn thì tài khoản đó CHƯA bị xoá — nó chỉ bị xoá khỏi đúng một chỗ bạn đang nhìn.</span></div>
</div>
<div class="callout warn">
<p><strong>Bạn KHÔNG thể mổ xẻ để xoá một bản ghi ra khỏi bản sao lưu của tuần trước, và không chính sách nào làm điều đó thành sai.</strong> Bản sao lưu là những tấm ảnh chụp BẤT BIẾN theo thiết kế — chính tính chất ấy làm nó thành một cơ chế khôi phục. Câu trả lời được chấp nhận ở khắp nơi, kể cả dưới GDPR, không phải là viết lại chúng: hãy công bố một cửa sổ lưu giữ (ba mươi, sáu mươi, chín mươi ngày), bảo đảm mọi bản sao lưu cũ hơn thế bị huỷ, và giữ một nhật ký các yêu cầu xoá để ÁP LẠI sau bất kỳ lần khôi phục nào. Hãy ghi điều đó vào chính sách riêng tư, và hãy dựng bước áp-lại TRƯỚC khi cần tới nó — cái ngày bạn khôi phục một bản sao lưu sáu tuần tuổi và lặng lẽ hồi sinh hai trăm tài khoản đã xoá là một ngày rất tệ để ngồi thiết kế nó.</p>
</div>

<h3>Giải phóng cái định danh</h3>
<pre><code><span class="tok-comment">// Sau khi xoá thật: địa chỉ được giải phóng, và ai đó CÓ THỂ đăng ký lại nó.</span>
<span class="tok-comment">// Người đăng ký mới KHÔNG được thừa kế bất cứ thứ gì của người cũ.</span>

<span class="tok-comment">// SAI — nối lại dữ liệu cũ qua email:</span>
const cu = await prisma.donHang.findMany({ where: { emailKhach: ch } });   <span class="tok-comment">// ← KHÔNG</span>

<span class="tok-comment">// ĐÚNG — mọi thứ nối bằng id tài khoản, và id đó đã chết cùng tài khoản:</span>
const cua = await prisma.donHang.findMany({ where: { nguoiDungId: nd.id } });</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Đừng bao giờ nối dữ liệu người dùng qua ĐỊA CHỈ</span><span class="v">Địa chỉ được tái sử dụng — một hộp thư công ty giao cho nhân viên mới, một tên miền cá nhân đổi chủ, một nhà cung cấp cấp lại một cái tên đã ngủ đông. Mọi bảng lấy email làm khoá thay vì id tài khoản sẽ có ngày lặng lẽ trao cho một người cái lịch sử của một người khác.</span></div>
  <div class="kv"><span class="k">Cân nhắc KHÔNG giải phóng nó luôn</span><span class="v">Giữ lại một bản ghi bia mộ giữ chỗ vĩnh viễn cho địa chỉ đã chuẩn hoá sẽ xoá sạch bài toán tái sử dụng, đổi lại một người thật lòng muốn làm lại từ đầu thì không làm được. Với một ngân hàng, hãy giữ; với một diễn đàn, hãy thả.</span></div>
  <div class="kv"><span class="k">Danh tính bên thứ ba không phải của bạn để mà thả</span><span class="v">Nếu tài khoản được tạo qua Google hay GitHub (Chương 8) thì hãy xoá cả mối liên kết đó. Không thì người tiếp theo đăng nhập bằng tài khoản nhà cung cấp ấy có thể bị khớp vào bóng ma của cái cũ.</span></div>
  <div class="kv"><span class="k">Cho xuất dữ liệu TRƯỚC khi xoá</span><span class="v">Hãy đưa phần xuất dữ liệu vào ngay trong luồng xoá, đừng chôn nó ở chỗ khác. Ở vài khu vực pháp lý đó là yêu cầu bắt buộc, và đó là khác biệt giữa một người rời đi hài lòng và một người rời đi tức giận với một bản sao của hư không.</span></div>
</div>
<div class="note-ct">
<p><strong>Ba lá thư làm cho cả chương này an toàn.</strong> Đã đổi địa chỉ, đã đổi mật khẩu, đã yêu cầu xoá tài khoản — gửi tới chính cái địa chỉ đang bị thay hoặc bị gỡ, LUÔN LUÔN, không cho tắt và không có ngoại lệ kiểu "chính người dùng tự làm mà". Mọi kiểu chiếm tài khoản ở Chương 5 và Chương 6 đều kết thúc bằng cảnh kẻ tấn công cầm tài khoản còn chủ nhân thì không hay biết gì, và ba lá thư này là những thứ duy nhất vươn qua được kẻ tấn công. Chúng rẻ để gửi, chúng là những lá thư được đọc nhiều nhất mà sản phẩm của bạn từng sinh ra, và mỗi lá nên mang theo một đường dẫn HOÀN TÁC đúng cái việc nó vừa kể.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://gdpr-info.eu/art-17-gdpr/" target="_blank" rel="noopener"><span class="lc-ico">⚖️</span><span class="lc-body"><span class="lc-title">GDPR Điều 17 — quyền được xoá</span><span class="lc-sub">gdpr-info.eu · Kể cả khoản 3, phần trừ ra giữ cho hoá đơn còn sống</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/referential-actions" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Prisma — hành vi tham chiếu</span><span class="lc-sub">prisma.io · Cascade, SetNull và Restrict, và tầng nào thi hành chúng</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — quản lý phiên</span><span class="lc-sub">cheatsheetseries.owasp.org · Xác thực lại trước một thao tác nhạy cảm</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Prisma ORM</span><span class="lc-sub">Hành vi tham chiếu trong lược đồ, và câu SQL sinh ra thật sự nói gì</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Chiếm một tài khoản bằng cách đổi địa chỉ của nó, rồi thêm ba bước vào và thử lại</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 6.6 ─────────────────────────── */
    {
      title: 'Quiz: the account lifecycle|||Quiz: vòng đời tài khoản',
      slug: 'auth-6-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về chuẩn hoá email, ràng buộc duy nhất, token xác minh, đầu độc header Host, rò rỉ thời gian, và ba bước của việc đổi địa chỉ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.6</span>
<h2>Quiz: the account lifecycle</h2>
<p class="lead">Eight questions. Three of them are about mistakes that make the login form irrelevant — because every flow in this chapter is a second way into the same account, and an attacker only needs the weakest one.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> Normalise the email and store it in a second column with the unique index, keep the typed form for sending, and let the database constraint — not a <code>SELECT</code> — decide uniqueness (6.1). Verification uses a hashed random token, and the side effect belongs behind a <code>POST</code> because mail scanners click every link (6.2). Reset is the most attacked flow you own: thirty minutes, single use, bound to a credential version, built from a configured URL rather than the <code>Host</code> header, revoking every session and always notifying (6.3). Enumeration leaks through wording, status codes, timing and every other flow — and only the timing leak survives a wording fix, so always hash (6.4). Changing an address is a takeover primitive that needs re-authentication, verification of the new address and an undoable notice to the old one; deletion needs a grace period, a deliberate answer per table, and an honest story about backups (6.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.6</span>
<h2>Quiz: vòng đời tài khoản</h2>
<p class="lead">Tám câu. Ba câu nói về những sai lầm khiến biểu mẫu đăng nhập trở nên VÔ NGHĨA — vì mọi luồng trong chương này đều là một lối vào THỨ HAI dẫn tới cùng một tài khoản, và kẻ tấn công chỉ cần cái yếu nhất.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Hãy chuẩn hoá email rồi lưu vào một cột thứ hai mang chỉ mục duy nhất, giữ lại bản người ta gõ để GỬI thư, và để RÀNG BUỘC của cơ sở dữ liệu — chứ không phải một câu <code>SELECT</code> — quyết định tính duy nhất (6.1). Xác minh dùng một token ngẫu nhiên lưu dạng băm, và tác dụng phụ phải nằm sau một cú <code>POST</code> vì máy quét thư bấm vào mọi đường dẫn (6.2). Đặt lại mật khẩu là luồng bị tấn công nhiều nhất mà bạn sở hữu: ba mươi phút, dùng một lần, buộc vào phiên bản tín vật, dựng URL từ CẤU HÌNH chứ không từ header <code>Host</code>, thu hồi mọi phiên và LUÔN gửi thư báo (6.3). Dò tài khoản rò rỉ qua câu chữ, mã trạng thái, THỜI GIAN và mọi luồng khác — và chỉ mỗi cú rò rỉ thời gian là sống sót qua việc sửa câu chữ, nên hãy LUÔN băm (6.4). Đổi địa chỉ là một nguyên thuỷ chiếm tài khoản, cần xác thực lại, cần xác minh địa chỉ mới và cần một lá thư báo có hoàn tác gửi về địa chỉ cũ; xoá tài khoản cần một cửa sổ ân hạn, một câu trả lời có chủ ý cho từng bảng, và một câu chuyện trung thực về bản sao lưu (6.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why keep both a display email column and a normalised email column?|||Vì sao phải giữ cả một cột email hiển thị lẫn một cột email đã chuẩn hoá?',
            options: [
              'To make the table easier to read in admin tools|||Để bảng dễ đọc hơn trong công cụ quản trị',
              'Because lookups and uniqueness must use one canonical form, while mail should be sent to the address the user actually typed — the unique index belongs on the normalised column only|||Vì tra cứu và tính duy nhất phải dùng MỘT dạng chuẩn duy nhất, còn thư thì nên gửi tới đúng địa chỉ người dùng đã gõ — và chỉ mục duy nhất chỉ đặt trên cột đã chuẩn hoá',
              'To support users with more than one email address|||Để hỗ trợ người dùng có nhiều hơn một địa chỉ email',
              'Because Prisma requires a separate column for indexed strings|||Vì Prisma bắt buộc phải có cột riêng cho chuỗi được đánh chỉ mục',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Should registration strip dots and +tags from the local part to prevent alias abuse?|||Có nên cắt dấu chấm và +nhãn ở phần local lúc đăng ký để chặn lạm dụng bí danh không?',
            options: [
              'Yes; they are always aliases of the same mailbox|||Có; chúng luôn là bí danh của cùng một hộp thư',
              'No — that is a Gmail-specific rule, and applying it everywhere merges genuinely different mailboxes at other providers into one account|||Không — đó là luật RIÊNG của Gmail, và áp nó cho mọi nơi sẽ gộp những hộp thư THẬT SỰ khác nhau ở các nhà cung cấp khác vào chung một tài khoản',
              'Yes, but only for the dots|||Có, nhưng chỉ với dấu chấm thôi',
              'Only if the domain has an MX record|||Chỉ khi tên miền có bản ghi MX',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You SELECT to check whether an email is taken, then INSERT. What is wrong?|||Bạn SELECT để kiểm xem email đã có người dùng chưa, rồi INSERT. Sai ở đâu?',
            options: [
              'Nothing, as long as the SELECT is inside a transaction|||Không sai gì, miễn là câu SELECT nằm trong một giao dịch',
              'Two concurrent registrations both see "not taken" and both insert — only a UNIQUE index stops the second, so insert first and catch P2002|||Hai lần đăng ký song song cùng thấy "chưa có ai dùng" rồi cùng chèn — chỉ một chỉ mục UNIQUE mới chặn được cái thứ hai, nên hãy CHÈN trước rồi bắt P2002',
              'The SELECT is slow and should be cached|||Câu SELECT chậm nên phải cache lại',
              'It should compare against the display column instead|||Nên so sánh với cột hiển thị thì đúng hơn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your verification link is a GET that marks the address verified and deletes the token. Users report expired links they never clicked. Why?|||Đường dẫn xác minh của bạn là một GET, nó đánh dấu địa chỉ đã xác minh rồi xoá token. Người dùng báo đường dẫn hết hạn dù họ chưa hề bấm. Vì sao?',
            options: [
              'The expiry is too short|||Hạn đặt quá ngắn',
              'Mail security gateways and link previewers fetch every URL in an incoming message seconds after delivery, consuming the token — put the side effect behind a POST, or make the GET idempotent|||Cổng bảo mật thư và bộ xem trước đường dẫn tải MỌI URL trong thư đến chỉ vài giây sau khi thư về, và tiêu mất token — hãy đẩy tác dụng phụ ra sau một cú POST, hoặc làm cho cái GET bất biến khi lặp',
              'The mail provider rewrites the token|||Nhà cung cấp thư viết lại cái token',
              'The user opened the mail on two devices|||Người dùng mở thư trên hai thiết bị',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your reset mail builds its URL from req.headers.host. What can an attacker do?|||Thư đặt lại mật khẩu của bạn dựng URL từ req.headers.host. Kẻ tấn công làm được gì?',
            options: [
              'Nothing; the token is still random and hashed|||Không gì cả; token vẫn ngẫu nhiên và vẫn được băm',
              'Request a reset for the victim with a poisoned Host, so your own server mails the real inbox a genuine link pointing at the attacker host — build the URL from configuration instead|||Yêu cầu đặt lại mật khẩu cho nạn nhân kèm một cái Host đã đầu độc, để chính máy chủ CỦA BẠN gửi tới hộp thư thật một đường dẫn chính danh trỏ về máy chủ của kẻ tấn công — hãy dựng URL từ CẤU HÌNH',
              'Only cause the mail to fail to send|||Chỉ khiến lá thư gửi không đi được',
              'Read the token from the database|||Đọc được token từ cơ sở dữ liệu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Login returns the same message and the same status code for both failure cases. Is enumeration closed?|||Trang đăng nhập trả về cùng một câu và cùng một mã trạng thái cho cả hai trường hợp thất bại. Vậy đã bịt được chuyện dò tài khoản chưa?',
            options: [
              'Yes; identical responses mean identical information|||Rồi; phản hồi giống hệt nghĩa là thông tin giống hệt',
              'No — skipping the password hash when there is no user row answers in microseconds instead of ~100ms, which is visible in a single request; always verify against a dummy hash|||Chưa — bỏ qua hàm băm mật khẩu khi không có bản ghi người dùng khiến máy chủ trả lời trong vài micro giây thay vì ~100ms, nhìn thấy được chỉ trong MỘT request; hãy luôn xác minh với một băm giả',
              'Yes, provided rate limiting is enabled|||Rồi, miễn là đã bật giới hạn tần suất',
              'No, because the response body length differs|||Chưa, vì độ dài thân phản hồi khác nhau',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'An attacker with a live session changes the account email, then requests a password reset. What breaks this chain?|||Một kẻ tấn công có phiên đang sống đổi email của tài khoản rồi yêu cầu đặt lại mật khẩu. Cái gì cắt được chuỗi này?',
            options: [
              'A stronger password policy|||Một chính sách mật khẩu mạnh hơn',
              'Re-authentication before the change, verifying the new address before switching, and an undoable notice mailed to the old address|||Xác thực lại NGAY TRƯỚC khi đổi, xác minh địa chỉ mới TRƯỚC khi chuyển, và một lá thư báo có nút hoàn tác gửi về địa chỉ CŨ',
              'A shorter access-token lifetime|||Một tuổi thọ access token ngắn hơn',
              'Rate limiting the settings endpoint|||Giới hạn tần suất cho endpoint cài đặt',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A user asks for deletion under the right to erasure. What is the honest answer about backups?|||Một người dùng yêu cầu xoá dữ liệu theo quyền được xoá. Câu trả lời trung thực về bản sao lưu là gì?',
            options: [
              'Rewrite the backups to remove their rows|||Viết lại các bản sao lưu để gỡ bỏ bản ghi của họ',
              'Backups are immutable snapshots, so state a retention window, destroy backups older than it, and keep a deletion log that is re-applied after any restore|||Bản sao lưu là ảnh chụp bất biến, nên hãy công bố một cửa sổ lưu giữ, huỷ những bản cũ hơn nó, và giữ một nhật ký xoá để ÁP LẠI sau bất kỳ lần khôi phục nào',
              'Delete every backup immediately|||Xoá ngay toàn bộ bản sao lưu',
              'Backups are exempt, so nothing needs to be said|||Bản sao lưu được miễn trừ, nên không cần nói gì cả',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
