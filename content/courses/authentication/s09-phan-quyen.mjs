/**
 * Authentication — Chương 9: Mô hình phân quyền.
 * Xác thực dừng, phân quyền bắt đầu · RBAC · ABAC và ReBAC · nhiều tenant ·
 * phép kiểm nằm ở đâu · quiz.
 * Output CHẠY THẬT Node.js 22 + Express 5 + PostgreSQL 16 trên Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Fauthentication%2Flearn&reflabel=Auth';

export default {
  title: 'Chapter 9 — Authorization models|||Chương 9 — Mô hình phân quyền',
  description: 'Tám chương vừa rồi trả lời câu "bạn là ai". Chương này trả lời câu tốn tiền hơn: "bạn được làm gì". Kiểm soát truy cập hỏng là lỗ hổng số MỘT của web theo OWASP, và nó hỏng không phải vì mật mã sai mà vì có ai đó quên một dòng — nên chương này lo cả mô hình LẪN cách dựng sao cho khó quên.',
  lessons: [

    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — Where authentication ends and the expensive bugs begin|||9.1 — Chỗ xác thực dừng lại và những con lỗi đắt tiền bắt đầu',
      slug: 'auth-9-1-phan-quyen-la-gi',
      type: 'LESSON',
      description: 'Kiểm soát truy cập hỏng đứng đầu bảng OWASP Top 10, và nó không phải một lỗi mật mã: nó là một dòng bị quên, ở đúng một trong hàng trăm chỗ. Bài này đo THẬT 939 endpoint của chính kho mã này, chỉ ra IDOR bằng bốn dòng, và đặt ba luật khiến việc quên trở nên khó về mặt CẤU TRÚC.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Where authentication ends and the expensive bugs begin</h2>
<p class="lead">Chapters 1 through 8 answered one question — who is this? — with cryptography, protocols and specifications. This chapter answers a different one: what may they do? It has no RFC, it is where OWASP puts its number one vulnerability, and it fails for a reason none of the previous chapters share: not a broken algorithm, but somebody forgetting a line in one of hundreds of places.</p>

<h3>Two questions, and only one of them has a specification</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Authentication</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Who are you?</span><span class="lz-nsub">Happens once per session · standardised · answered by Chapters 1–8 · a solved problem</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Authorization</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">May you do this, to this?</span><span class="lz-nsub">Happens on every request · specific to your product · nobody can write the rules for you</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Where it fails</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">One endpoint out of hundreds</span><span class="lz-nsub">Everything works, tests pass, nothing looks broken · until somebody changes an id in a URL</span></div></div>
  </div>
</div>

<h3>IDOR, in four lines</h3>
<pre><code><span class="tok-comment">// Endpoint này CÓ xác thực. Nó vẫn là một lỗ hổng.</span>
app.get('/api/invoices/:id', requireAuth, async (req, res) =&gt; {
  const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });
  res.json(invoice);            <span class="tok-comment">// ← hoá đơn CỦA AI cũng được</span>
});

<span class="tok-comment">// Vá: chủ sở hữu là một phần của CÂU TRUY VẤN, không phải một phép kiểm sau đó.</span>
const invoice = await prisma.invoice.findFirst({
  where: { id: req.params.id, userId: req.u.id },   <span class="tok-comment">// ← ở ĐÂY</span>
});
if (!invoice) return res.status(404).end();                    <span class="tok-comment">// 404, không phải 403</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Insecure direct object reference</span><span class="v">The client supplies an identifier and the server fetches it without asking whether this user may have it. It is the most common access-control bug by a wide margin, and it needs no tooling to find: change a number in a URL.</span></div>
  <div class="kv"><span class="k">Put ownership in the WHERE clause</span><span class="v">A separate <code>if (invoice.userId !== req.u.id)</code> works and is one refactor away from being deleted. A query that cannot return another user's row is correct by construction, and it stays correct when somebody adds a second code path.</span></div>
  <div class="kv"><span class="k">Answer 404, not 403</span><span class="v"><code>403</code> confirms the record exists, which turns the endpoint into an enumeration oracle (Lesson 6.4) — an attacker can map your invoice ids without reading a single one. Say "not found", because to this user it genuinely is not.</span></div>
  <div class="kv"><span class="k">Sequential ids make it trivial, and random ids do not fix it</span><span class="v">A UUID makes guessing impractical, which raises the cost but does not remove the flaw: ids leak through shared links, exports, referrers and support tickets. Unguessable identifiers are a mitigation, never the control.</span></div>
</div>

<h3>How many places can this go wrong? Measured</h3>
<pre><code><span class="tok-comment">// Đếm mọi endpoint trong chính kho mã này, và xem cái nào có lớp chắn nào.</span>
grep -c "router\\\\.(get|post|put|patch|delete)" src/routes/*.ts</code></pre>
<div class="out">tong endpoint                         : 939
co middleware ngay tren TUYEN         : 460
phu boi router.use() cua ca tep       : 365
KHONG co lop nao trong hai lop tren   : 114

  trong so do, theo dong tu: {'GET': 80, 'POST': 29, 'PUT': 3, 'DELETE': 2}

# 73 tep route, 939 endpoint, HAI co che chan khac nhau. 114 duong khong
# co ca hai — phan lon la GET cong khai va DUNG nhu vay (danh sach khoa
# hoc, bai blog). Van de khong phai con so, ma la: de biet 114 duong do
# co dung khong, phai doc TUNG duong mot.</div>
<div class="pitfall">
<p><strong>Trap — two mechanisms for the same job means a reviewer cannot tell "public on purpose" from "forgotten".</strong> When some routes carry <code>authenticate</code> inline and others inherit it from a <code>router.use</code> at the top of the file, an endpoint with neither is ambiguous: it might be a deliberately public blog listing, or it might be the one somebody added last Tuesday. Neither the compiler nor the test suite can distinguish them, so the difference lives in a reviewer's attention across 939 endpoints. The fix is not more discipline — it is making the public case <em>explicit</em>, so that an endpoint with no marking at all is a build error rather than a judgement call.</p>
</div>

<h3>Three rules that do the work</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Deny by default</span><span class="lz-t">Absence means no</span><span class="lz-d">An endpoint with no declared policy must be rejected, not allowed. Mark public routes with an explicit <code>congKhai()</code> so that forgetting produces a 403 in development instead of a data breach in production.</span></div>
  <div class="lz-step"><span class="lz-k">Check on every request</span><span class="lz-t">Never at login only</span><span class="lz-d">Permissions computed once and stored in a token go stale the moment a role changes — Lesson 5.3's revocation problem, in a new costume. If a check is expensive, cache it for seconds, not for a session.</span></div>
  <div class="lz-step"><span class="lz-k">Check on the server, every time</span><span class="lz-t">The UI is a convenience</span><span class="lz-d">Hiding a delete button is good design and zero security: the request is one <code>curl</code> away. Every rule the interface expresses must exist independently on the server, and the server is the only copy that counts.</span></div>
  <div class="lz-step"><span class="lz-k">Check as close to the data as you can</span><span class="lz-t">Routes are not the only door</span><span class="lz-d">A rule enforced in a route handler is absent from the background job, the admin script, the GraphQL resolver and the CSV export that read the same table. Lesson 9.5 is about where the check has to live so that every door inherits it.</span></div>
</div>
<div class="callout warn">
<p><strong>This is the number one entry on the OWASP Top 10, and it is there because it is not a cryptography problem.</strong> Nothing in Chapters 1 through 8 helps: Argon2, passkeys and rotation are all perfect, the user is exactly who they claim to be, and they read someone else's medical record by changing a number. Access control fails through omission — one endpoint, one background job, one export, one new feature shipped on a Friday. That is why the answer is architectural rather than algorithmic, and why the rest of this chapter spends as much time on <em>where the check lives</em> as on what the rules say.</p>
</div>
<div class="note-ct">
<p><strong>Model the rules before you write the code.</strong> Write out, in one page, the nouns your product protects, the verbs that apply to them, and the sentence that decides each — "the owner of a document may edit it", "a workspace admin may remove members", "anyone with a share link may read". That page is the specification the next four lessons implement, and producing it usually surfaces two or three rules nobody had agreed on. Doing it afterwards, from the code, means reverse-engineering a policy from a hundred scattered <code>if</code> statements — which is exactly how a product ends up unable to answer "who can see this?" without reading the source.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://owasp.org/Top10/A01_2021-Broken_Access_Control/" target="_blank" rel="noopener"><span class="lc-ico">🥇</span><span class="lc-body"><span class="lc-title">OWASP Top 10 — A01 Broken Access Control</span><span class="lc-sub">owasp.org · Why it ranks first, with the failure patterns listed</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — authorization cheat sheet</span><span class="lc-sub">cheatsheetseries.owasp.org · Deny by default, and enforcing at a single point</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">OWASP — preventing IDOR</span><span class="lc-sub">cheatsheetseries.owasp.org · Why unguessable ids are a mitigation, not a control</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL</span><span class="lc-sub">Putting the ownership condition in the query, and the indexes that keep it fast</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Read another user's invoice by changing one id, then move the check into the query</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Chỗ xác thực dừng lại và những con lỗi đắt tiền bắt đầu</h2>
<p class="lead">Chương 1 tới 8 trả lời MỘT câu hỏi — người này là ai? — bằng mật mã, giao thức và đặc tả. Chương này trả lời một câu KHÁC: họ được làm gì? Nó không có RFC nào cả, nó là chỗ OWASP đặt lỗ hổng số một của mình, và nó hỏng vì một lý do mà không chương nào phía trước có: không phải một thuật toán vỡ, mà là có ai đó QUÊN một dòng, ở một trong hàng trăm chỗ.</p>

<h3>Hai câu hỏi, và chỉ một cái có đặc tả</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Xác thực</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bạn là ai?</span><span class="lz-nsub">Xảy ra một lần mỗi phiên · đã chuẩn hoá · Chương 1–8 trả lời · một bài toán đã giải xong</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Phân quyền</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Bạn có được làm việc NÀY, lên thứ NÀY không?</span><span class="lz-nsub">Xảy ra ở MỌI request · riêng cho sản phẩm của bạn · không ai viết luật hộ bạn được</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Nó hỏng ở đâu</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một endpoint trong hàng trăm cái</span><span class="lz-nsub">Mọi thứ chạy tốt, test xanh, chẳng có gì trông hỏng · cho tới khi ai đó đổi một cái id trên URL</span></div></div>
  </div>
</div>

<h3>IDOR, trong bốn dòng</h3>
<pre><code><span class="tok-comment">// Endpoint này CÓ xác thực. Nó vẫn là một lỗ hổng.</span>
app.get('/api/invoices/:id', requireAuth, async (req, res) =&gt; {
  const invoice = await prisma.invoice.findUnique({ where: { id: req.params.id } });
  res.json(invoice);            <span class="tok-comment">// ← hoá đơn CỦA AI cũng được</span>
});

<span class="tok-comment">// Vá: chủ sở hữu là một phần của CÂU TRUY VẤN, không phải một phép kiểm sau đó.</span>
const invoice = await prisma.invoice.findFirst({
  where: { id: req.params.id, userId: req.u.id },   <span class="tok-comment">// ← ở ĐÂY</span>
});
if (!invoice) return res.status(404).end();                    <span class="tok-comment">// 404, không phải 403</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Tham chiếu đối tượng trực tiếp không an toàn</span><span class="v">Client đưa lên một định danh và máy chủ đi lấy nó về mà không hỏi xem người dùng này có được phép có nó không. Đây là con lỗi kiểm soát truy cập phổ biến nhất, bỏ xa các loại khác, và tìm ra nó chẳng cần công cụ gì: đổi một con số trên URL.</span></div>
  <div class="kv"><span class="k">Đặt quyền sở hữu vào mệnh đề WHERE</span><span class="v">Một câu <code>if (invoice.userId !== req.u.id)</code> riêng thì chạy được, và chỉ cách một lần tái cấu trúc là bị xoá mất. Còn một câu truy vấn KHÔNG THỂ trả về bản ghi của người khác thì đúng theo cấu trúc, và nó vẫn đúng khi có người thêm một đường mã thứ hai.</span></div>
  <div class="kv"><span class="k">Trả 404, không trả 403</span><span class="v"><code>403</code> xác nhận rằng bản ghi có tồn tại, tức là biến endpoint thành một cái máy trả lời cho việc dò (Bài 6.4) — kẻ tấn công lập được bản đồ id hoá đơn của bạn mà không cần đọc lấy một cái. Hãy nói "không tìm thấy", vì với người dùng này thì đúng là không có thật.</span></div>
  <div class="kv"><span class="k">Id tuần tự làm việc đó thành dễ, và id ngẫu nhiên KHÔNG vá được nó</span><span class="v">Một cái UUID làm việc đoán mò thành bất khả thi, tức là nâng chi phí lên chứ không gỡ được chỗ hỏng: id vẫn rò ra qua đường dẫn chia sẻ, qua bản xuất dữ liệu, qua Referer và qua ticket hỗ trợ. Định danh không đoán được là một lớp giảm nhẹ, không bao giờ là biện pháp kiểm soát.</span></div>
</div>

<h3>Chuyện này có thể sai ở bao nhiêu chỗ? Đo thật</h3>
<pre><code><span class="tok-comment">// Đếm mọi endpoint trong chính kho mã này, và xem cái nào có lớp chắn nào.</span>
grep -c "router\\\\.(get|post|put|patch|delete)" src/routes/*.ts</code></pre>
<div class="out">tong endpoint                         : 939
co middleware ngay tren TUYEN         : 460
phu boi router.use() cua ca tep       : 365
KHONG co lop nao trong hai lop tren   : 114

  trong so do, theo dong tu: {'GET': 80, 'POST': 29, 'PUT': 3, 'DELETE': 2}

# 73 tep route, 939 endpoint, HAI co che chan khac nhau. 114 duong khong
# co ca hai — phan lon la GET cong khai va DUNG nhu vay (danh sach khoa
# hoc, bai blog). Van de khong phai con so, ma la: de biet 114 duong do
# co dung khong, phai doc TUNG duong mot.</div>
<div class="pitfall">
<p><strong>Bẫy — hai cơ chế cho cùng một việc nghĩa là người review KHÔNG phân biệt được "công khai có chủ ý" với "bị quên".</strong> Khi một số tuyến mang <code>authenticate</code> viết ngay tại chỗ còn số khác thừa hưởng nó từ một câu <code>router.use</code> ở đầu tệp, thì một endpoint không có cả hai là một dấu hỏi: nó có thể là danh sách blog cố tình công khai, mà cũng có thể là cái tuyến ai đó thêm vào hôm thứ Ba tuần trước. Trình biên dịch không phân biệt được, bộ kiểm thử cũng không, nên sự khác biệt ấy sống trong SỰ CHÚ Ý của một người review trải trên 939 endpoint. Cách vá không phải là kỷ luật cao hơn — mà là làm cho trường hợp công khai trở nên <em>TƯỜNG MINH</em>, để một endpoint không đánh dấu gì cả là một lỗi lúc dựng chứ không phải một chuyện phải cân nhắc.</p>
</div>

<h3>Ba luật gánh phần lớn công việc</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Mặc định TỪ CHỐI</span><span class="lz-t">Vắng mặt nghĩa là không</span><span class="lz-d">Một endpoint không khai chính sách nào thì phải bị từ chối, không phải được cho qua. Hãy đánh dấu tuyến công khai bằng một hàm <code>congKhai()</code> tường minh, để việc quên sinh ra một cái 403 lúc phát triển thay vì một vụ lộ dữ liệu trên production.</span></div>
  <div class="lz-step"><span class="lz-k">Kiểm ở MỌI request</span><span class="lz-t">Đừng chỉ kiểm lúc đăng nhập</span><span class="lz-d">Quyền tính một lần rồi cất vào token sẽ cũ đi ngay khoảnh khắc một vai trò thay đổi — chính là bài toán thu hồi ở Bài 5.3, khoác bộ đồ mới. Nếu một phép kiểm đắt thì hãy cache nó theo GIÂY, đừng cache theo phiên.</span></div>
  <div class="lz-step"><span class="lz-k">Kiểm ở MÁY CHỦ, mọi lần</span><span class="lz-t">Giao diện chỉ là tiện lợi</span><span class="lz-d">Ẩn một cái nút xoá là thiết kế tốt và là con số không về bảo mật: cái request đó chỉ cách một câu <code>curl</code>. Mọi luật mà giao diện thể hiện đều phải tồn tại ĐỘC LẬP ở máy chủ, và bản ở máy chủ là bản duy nhất có giá trị.</span></div>
  <div class="lz-step"><span class="lz-k">Kiểm CÀNG GẦN dữ liệu càng tốt</span><span class="lz-t">Tuyến API không phải cánh cửa duy nhất</span><span class="lz-d">Một luật thi hành trong bộ xử lý tuyến thì VẮNG MẶT ở công việc chạy nền, ở script quản trị, ở resolver GraphQL và ở bản xuất CSV cùng đọc một cái bảng. Bài 9.5 nói về chỗ mà phép kiểm phải nằm để MỌI cánh cửa đều thừa hưởng nó.</span></div>
</div>
<div class="callout warn">
<p><strong>Đây là mục SỐ MỘT trong OWASP Top 10, và nó ở đó vì nó KHÔNG phải một bài toán mật mã.</strong> Chẳng thứ gì trong Chương 1 tới 8 giúp được: Argon2, passkey và xoay vòng đều hoàn hảo, người dùng đúng là người họ nhận, và họ đọc được hồ sơ bệnh án của người khác bằng cách đổi một con số. Kiểm soát truy cập hỏng vì SỰ THIẾU SÓT — một endpoint, một công việc nền, một bản xuất, một tính năng đưa lên vào chiều thứ Sáu. Đó là lý do câu trả lời mang tính KIẾN TRÚC chứ không phải thuật toán, và là lý do phần còn lại của chương này dành cho <em>chỗ đặt phép kiểm</em> nhiều thời gian ngang với nội dung của luật.</p>
</div>
<div class="note-ct">
<p><strong>Hãy mô hình hoá các luật TRƯỚC khi viết mã.</strong> Hãy viết ra, trong đúng một trang, những DANH TỪ mà sản phẩm của bạn bảo vệ, những ĐỘNG TỪ áp lên chúng, và câu văn quyết định từng cái — "người sở hữu một tài liệu thì được sửa nó", "quản trị viên của một không gian làm việc thì được gỡ thành viên", "ai có đường dẫn chia sẻ thì được đọc". Trang đó chính là bản đặc tả mà bốn bài kế tiếp đi cài đặt, và việc viết nó ra thường lôi lên hai ba cái luật mà chưa ai từng thống nhất. Làm việc ấy SAU, dựa vào mã, nghĩa là dịch ngược một chính sách ra từ một trăm câu <code>if</code> nằm rải rác — mà đó đúng là cách một sản phẩm đi tới chỗ không trả lời nổi câu "ai nhìn thấy được cái này?" nếu không mở mã nguồn ra đọc.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://owasp.org/Top10/A01_2021-Broken_Access_Control/" target="_blank" rel="noopener"><span class="lc-ico">🥇</span><span class="lc-body"><span class="lc-title">OWASP Top 10 — A01 Kiểm soát truy cập hỏng</span><span class="lc-sub">owasp.org · Vì sao nó đứng đầu, kèm danh sách các kiểu hỏng</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — bảng tra về phân quyền</span><span class="lc-sub">cheatsheetseries.owasp.org · Mặc định từ chối, và thi hành tại MỘT điểm duy nhất</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🔢</span><span class="lc-body"><span class="lc-title">OWASP — phòng chống IDOR</span><span class="lc-sub">cheatsheetseries.owasp.org · Vì sao id không đoán được là giảm nhẹ chứ không phải kiểm soát</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL</span><span class="lc-sub">Đặt điều kiện sở hữu vào câu truy vấn, và những chỉ mục giữ cho nó vẫn nhanh</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Đọc hoá đơn của người khác bằng cách đổi một cái id, rồi dời phép kiểm vào trong câu truy vấn</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 9.2 ─────────────────────────── */
    {
      title: '9.2 — RBAC, and the boolean that becomes forty booleans|||9.2 — RBAC, và cái boolean rồi sẽ thành bốn mươi cái boolean',
      slug: 'auth-9-2-rbac',
      type: 'LESSON',
      description: 'Mọi hệ thống đều bắt đầu bằng một cột isAdmin, và mọi hệ thống đều hối hận. Bài này đi qua ba chặng — boolean, vai trò, rồi vai trò-cộng-quyền — chỉ ra chính xác chỗ mỗi chặng vỡ, dựng lược đồ đủ ba bảng, và nói thẳng chỗ mà RBAC hết khả năng diễn đạt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>RBAC, and the boolean that becomes forty booleans</h2>
<p class="lead">Role-based access control is the model almost everybody reaches for, and it deserves its popularity: it is easy to explain, easy to query and easy to show in an interface. It also has a precise breaking point, and knowing where that is saves you from either over-engineering on day one or rebuilding under pressure in year two.</p>

<h3>Stage one: the boolean, and why it always spreads</h3>
<pre><code>model User {
  isAdmin Boolean @default(false)      <span class="tok-comment">// tuần 1: hoàn toàn hợp lý</span>
}

<span class="tok-comment">// Tháng 6, sau khi có đội hỗ trợ, đội kiểm duyệt và đội tài chính:</span>
model User {
  isAdmin        Boolean @default(false)
  isModerator    Boolean @default(false)
  isSupport      Boolean @default(false)
  isAccountant   Boolean @default(false)
  canViewRevenue Boolean @default(false)
  canDeletePost  Boolean @default(false)
  <span class="tok-comment">// …và không ai còn trả lời được: một "kiểm duyệt viên" thì làm được gì?</span>
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Booleans do not compose</span><span class="v">Six flags are sixty-four possible combinations, and your product intends to support four of them. The other sixty exist, are reachable through the admin interface, and have never been tested.</span></div>
  <div class="kv"><span class="k">There is nowhere to write the answer</span><span class="v">"What can a moderator do?" has no location in the schema — it lives in whichever <code>if</code> statements happen to mention <code>isModerator</code>. Answering the question means grepping, and the answer changes every sprint.</span></div>
  <div class="kv"><span class="k">Every new capability is a migration</span><span class="v">Adding a permission means a schema change, a deploy, and a backfill deciding who gets it. With roles, granting a new capability to twelve people is one row.</span></div>
  <div class="kv"><span class="k">It is still right for a small product</span><span class="v">If there are two kinds of user and there will be two kinds next year, a boolean is honest and cheap. The mistake is not starting there — it is staying there past the third flag.</span></div>
</div>

<h3>Stage two: roles, which is where most products should live</h3>
<pre><code>model Role {
  id    Int        @id @default(autoincrement())
  name  String     @unique
  users UserRole[]
  @@map("roles")
}

model UserRole {
  userId Int
  roleId Int
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role   Role @relation(fields: [roleId], references: [id], onDelete: Cascade)
  @@id([userId, roleId])                 <span class="tok-comment">// một người NHIỀU vai — quan trọng</span>
  @@map("user_roles")
}</code></pre>
<div class="out"># Lay tu chinh prisma/schema.prisma cua kho ma nay — no dung dung mo hinh tren.
# Rang buoc khoa ngoai that, sinh ra tu migration da trien khai:

ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId")
  REFERENCES "users"("id") ON DELETE CASCADE
ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId")
  REFERENCES "roles"("id") ON DELETE CASCADE

# Khoa chinh ghep (userId, roleId) lam cho "gan vai hai lan" thanh bat kha,
# va CASCADE lam cho viec xoa tai khoan tu don sach cac vai — Bai 6.5.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Many-to-many, always</span><span class="lz-t">Not a single role column</span><span class="lz-d">A person is an editor of one thing and an admin of another, or a support agent who is also a tester. A single <code>role</code> column forces someone to pick, and the workaround is always a new combined role like <code>support_admin</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Roles are named for jobs, not for permissions</span><span class="lz-t">"Editor", not "can_edit"</span><span class="lz-d">A role should map to something a human recognises from the org chart. When you find yourself creating <code>can_view_revenue</code> as a role, you have started building stage three by accident.</span></div>
  <div class="lz-step"><span class="lz-k">The composite primary key does real work</span><span class="lz-t">No duplicate grants</span><span class="lz-d">It makes double assignment impossible at the database level, so "grant role" is idempotent and a retried request cannot create a row that a later revoke misses.</span></div>
  <div class="lz-step"><span class="lz-k">Load roles per request, not per session</span><span class="lz-t">Or accept staleness</span><span class="lz-d">Roles baked into a JWT at login stay valid until it expires — a demoted admin keeps their access for the whole access-token window (Lesson 5.3). One indexed join is cheap; measure before you cache it.</span></div>
</div>

<h3>Stage three: roles grant permissions</h3>
<pre><code><span class="tok-comment">// Vai trò là cái CON NGƯỜI hiểu. Quyền là cái MÃ kiểm.</span>
model Permission     { id Int @id  ma String @unique  roles RolePermission[] }  <span class="tok-comment">// 'bai_viet:xoa'</span>
model RolePermission { roleId Int  quyenId Int   @@id([roleId, quyenId]) }

<span class="tok-comment">// Mã KHÔNG BAO GIỜ nhắc tên vai trò. Nó hỏi về QUYỀN.</span>
app.delete('/posts/:id', requireAuth, changeRole('post:xoa'), deletePost);

<span class="tok-comment">// SAI — đây là chặng hai đội lốt chặng ba:</span>
if (u.role === 'admin' || u.role === 'kiem_duyet') { <span class="tok-comment">/* … */</span> }</code></pre>
<div class="pitfall">
<p><strong>Trap — checking role names in application code recreates every problem the roles were meant to solve.</strong> The moment a handler says <code>if (role === 'admin' || role === 'moderator')</code>, adding a fourth role means finding and editing every such condition, and nobody can list what a role does without reading the whole codebase. Check <em>permissions</em>, always: <code>changeRole('post:xoa')</code>. Then creating a role is inserting rows, changing what a role can do is an admin screen, and the code never changes. The one legitimate exception is a hard-coded superuser check used to protect the permission system itself from locking everyone out.</p>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Name permissions resource:action</span><span class="lz-lnote"><code>post:xoa</code>, <code>hoa_don:xem</code>, <code>nguoi_dung:khoa</code>. It sorts usefully, it groups in an interface, and a wildcard like <code>hoa_don:*</code> becomes meaningful later if you need it.</span></div>
  <div class="lz-layer"><span class="lz-lname">Generate the permission list from code, not by hand</span><span class="lz-lnote">Define the permissions as a TypeScript union and seed the table from it. Then a permission referenced in a handler but missing from the database is a type error, rather than a check that silently denies everything in production.</span></div>
  <div class="lz-layer"><span class="lz-lname">Role hierarchies are optional and usually not worth it</span><span class="lz-lnote">"Admin inherits everything an editor has" is expressible with a parent link, and it turns a flat lookup into a recursive one that is harder to reason about and to display. Duplicating a few rows per role is cheaper than explaining an inheritance graph to a support agent.</span></div>
  <div class="lz-layer"><span class="lz-lname">Audit every grant and revoke</span><span class="lz-lnote">Who gave whom which role, and when. Privilege escalation is the goal of most internal attacks, and this table is the first thing an incident asks for — Chapter 11 builds the log it belongs in.</span></div>
</div>

<h3>Where RBAC stops</h3>
<pre><code><span class="tok-comment">// Ba câu hỏi mà KHÔNG mô hình vai trò nào trả lời nổi:</span>
"Cường có được sửa tài liệu số 42 không?"        <span class="tok-comment">// ← phụ thuộc AI SỞ HỮU nó</span>
"Người này có được xem hoá đơn của khách hàng X?" <span class="tok-comment">// ← phụ thuộc họ thuộc nhóm nào</span>
"Ai đang có đường dẫn chia sẻ thì đọc được chứ?" <span class="tok-comment">// ← chẳng dính gì tới người dùng cả</span>

<span class="tok-comment">// Vai trò trả lời "người này LÀ AI trong tổ chức".</span>
<span class="tok-comment">// Chúng KHÔNG trả lời được "người này với THỨ NÀY có quan hệ gì".</span></code></pre>
<div class="callout warn">
<p><strong>The tell is a role whose name contains an identifier.</strong> When someone proposes <code>editor_of_project_42</code>, or a table of roles that grows with your data rather than with your org chart, RBAC has run out — you are trying to encode a relationship between a user and an object into a model that only knows about users. Every workaround from there is worse than the next model: a role per project, a permission string containing an id, a check that parses the role name. Lesson 9.3 is that next model, and the honest advice is that most products need both, with roles for organisation-wide capability and relationships for per-object access.</p>
</div>
<div class="note-ct">
<p><strong>Start at stage two, and move when you can name the reason.</strong> Roles with a many-to-many table cost almost nothing over a boolean and remove the flag explosion permanently. Move to stage three when two different roles need overlapping-but-not-identical capabilities, or when a non-engineer needs to change who can do what without a deploy — those are the two symptoms that make the extra table pay for itself. Moving earlier buys an abstraction with no users; moving later means a migration under pressure, usually during the week you are also trying to onboard a customer who asked about permissions.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://csrc.nist.gov/projects/role-based-access-control" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">NIST — role-based access control</span><span class="lc-sub">csrc.nist.gov · The original model, including the hierarchy variants</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html#enforce-authorization-checks-on-static-resources" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — authorization design</span><span class="lc-sub">cheatsheetseries.owasp.org · Attribute and role models compared</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Prisma — many-to-many relations</span><span class="lc-sub">prisma.io · Explicit join tables, which is what UserRole is</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">CuongThai course — Prisma ORM</span><span class="lc-sub">Composite primary keys, join tables and the queries above</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Migrate six booleans to roles and permissions without changing a single handler's behaviour</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>RBAC, và cái boolean rồi sẽ thành bốn mươi cái boolean</h2>
<p class="lead">Kiểm soát truy cập theo vai trò là mô hình mà gần như ai cũng với tay lấy, và nó xứng đáng nổi tiếng: dễ giải thích, dễ truy vấn và dễ bày ra trên giao diện. Nó cũng có một ĐIỂM VỠ rất rõ, và biết điểm đó nằm ở đâu sẽ cứu bạn khỏi hoặc là làm quá phức tạp ngay ngày đầu, hoặc là phải xây lại dưới áp lực vào năm thứ hai.</p>

<h3>Chặng một: cái boolean, và vì sao nó luôn lan ra</h3>
<pre><code>model User {
  isAdmin Boolean @default(false)      <span class="tok-comment">// tuần 1: hoàn toàn hợp lý</span>
}

<span class="tok-comment">// Tháng 6, sau khi có đội hỗ trợ, đội kiểm duyệt và đội tài chính:</span>
model User {
  isAdmin        Boolean @default(false)
  isModerator    Boolean @default(false)
  isSupport      Boolean @default(false)
  isAccountant   Boolean @default(false)
  canViewRevenue Boolean @default(false)
  canDeletePost  Boolean @default(false)
  <span class="tok-comment">// …và không ai còn trả lời được: một "kiểm duyệt viên" thì làm được gì?</span>
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Boolean thì KHÔNG ghép lại được</span><span class="v">Sáu cái cờ là sáu mươi tư tổ hợp có thể xảy ra, và sản phẩm của bạn định hỗ trợ bốn trong số đó. Sáu mươi cái còn lại VẪN tồn tại, VẪN với tới được qua giao diện quản trị, và chưa bao giờ được kiểm thử.</span></div>
  <div class="kv"><span class="k">Không có CHỖ nào để viết câu trả lời</span><span class="v">Câu "kiểm duyệt viên làm được gì?" không có một vị trí nào trong lược đồ cả — nó sống trong những câu <code>if</code> nào tình cờ có nhắc tới <code>isModerator</code>. Trả lời câu hỏi đó nghĩa là đi grep, và câu trả lời đổi sau mỗi sprint.</span></div>
  <div class="kv"><span class="k">Mỗi khả năng mới là một cuộc migration</span><span class="v">Thêm một quyền nghĩa là đổi lược đồ, deploy, và một lần điền dữ liệu ngược để quyết ai được nhận. Với vai trò thì cấp một khả năng mới cho mười hai người chỉ là MỘT bản ghi.</span></div>
  <div class="kv"><span class="k">Với sản phẩm nhỏ thì nó vẫn ĐÚNG</span><span class="v">Nếu chỉ có hai loại người dùng và sang năm vẫn hai loại thì một cái boolean là trung thực và rẻ. Cái sai không phải là bắt đầu từ đó — mà là ở lại đó sau cái cờ thứ ba.</span></div>
</div>

<h3>Chặng hai: vai trò, chỗ mà phần lớn sản phẩm nên dừng lại</h3>
<pre><code>model Role {
  id    Int        @id @default(autoincrement())
  name  String     @unique
  users UserRole[]
  @@map("roles")
}

model UserRole {
  userId Int
  roleId Int
  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role   Role @relation(fields: [roleId], references: [id], onDelete: Cascade)
  @@id([userId, roleId])                 <span class="tok-comment">// một người NHIỀU vai — quan trọng</span>
  @@map("user_roles")
}</code></pre>
<div class="out"># Lay tu chinh prisma/schema.prisma cua kho ma nay — no dung dung mo hinh tren.
# Rang buoc khoa ngoai that, sinh ra tu migration da trien khai:

ADD CONSTRAINT "user_roles_userId_fkey" FOREIGN KEY ("userId")
  REFERENCES "users"("id") ON DELETE CASCADE
ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId")
  REFERENCES "roles"("id") ON DELETE CASCADE

# Khoa chinh ghep (userId, roleId) lam cho "gan vai hai lan" thanh bat kha,
# va CASCADE lam cho viec xoa tai khoan tu don sach cac vai — Bai 6.5.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Nhiều-nhiều, LUÔN LUÔN</span><span class="lz-t">Đừng dùng một cột vai trò duy nhất</span><span class="lz-d">Một người là biên tập của thứ này và quản trị của thứ kia, hoặc là nhân viên hỗ trợ mà cũng là người kiểm thử. Một cột <code>role</code> duy nhất buộc ai đó phải CHỌN, và cách lách bao giờ cũng là đẻ ra một vai gộp kiểu <code>support_admin</code>.</span></div>
  <div class="lz-step"><span class="lz-k">Vai trò đặt tên theo CÔNG VIỆC, không theo quyền</span><span class="lz-t">"Biên tập", không phải "được_sửa"</span><span class="lz-d">Một vai trò nên ánh xạ tới thứ mà con người nhận ra được từ sơ đồ tổ chức. Khi bạn thấy mình đang tạo <code>xem_duoc_doanh_thu</code> làm một vai trò thì bạn đã vô tình bắt đầu xây chặng ba rồi.</span></div>
  <div class="lz-step"><span class="lz-k">Khoá chính ghép làm việc THẬT</span><span class="lz-t">Không có bản gán trùng</span><span class="lz-d">Nó làm cho việc gán hai lần thành bất khả ngay ở tầng cơ sở dữ liệu, nên "cấp vai" trở nên bất biến khi lặp và một request thử lại không tạo ra được cái bản ghi mà lệnh thu hồi về sau bỏ sót.</span></div>
  <div class="lz-step"><span class="lz-k">Nạp vai theo REQUEST, đừng theo phiên</span><span class="lz-t">Hoặc chấp nhận dữ liệu cũ</span><span class="lz-d">Vai trò nướng sẵn vào một JWT lúc đăng nhập thì còn hiệu lực cho tới khi nó hết hạn — một quản trị viên vừa bị hạ quyền vẫn giữ quyền suốt cả cửa sổ access token (Bài 5.3). Một phép nối có chỉ mục thì rẻ; hãy ĐO trước khi đi cache nó.</span></div>
</div>

<h3>Chặng ba: vai trò CẤP quyền</h3>
<pre><code><span class="tok-comment">// Vai trò là cái CON NGƯỜI hiểu. Quyền là cái MÃ kiểm.</span>
model Permission     { id Int @id  ma String @unique  roles RolePermission[] }  <span class="tok-comment">// 'bai_viet:xoa'</span>
model RolePermission { roleId Int  quyenId Int   @@id([roleId, quyenId]) }

<span class="tok-comment">// Mã KHÔNG BAO GIỜ nhắc tên vai trò. Nó hỏi về QUYỀN.</span>
app.delete('/posts/:id', requireAuth, changeRole('post:xoa'), deletePost);

<span class="tok-comment">// SAI — đây là chặng hai đội lốt chặng ba:</span>
if (u.role === 'admin' || u.role === 'kiem_duyet') { <span class="tok-comment">/* … */</span> }</code></pre>
<div class="pitfall">
<p><strong>Bẫy — kiểm TÊN VAI TRÒ trong mã ứng dụng là dựng lại đúng mọi vấn đề mà vai trò sinh ra để giải.</strong> Ngay khoảnh khắc một bộ xử lý viết <code>if (role === 'admin' || role === 'kiem_duyet')</code> thì việc thêm một vai thứ tư nghĩa là phải đi tìm và sửa MỌI điều kiện kiểu ấy, và không ai liệt kê nổi một vai trò làm được gì nếu không đọc hết kho mã. Hãy kiểm <em>QUYỀN</em>, luôn luôn: <code>changeRole('post:xoa')</code>. Khi đó tạo một vai trò là chèn vài bản ghi, đổi việc một vai trò làm được gì là một màn hình quản trị, còn mã thì chẳng đổi. Ngoại lệ chính đáng duy nhất là một phép kiểm siêu người dùng viết cứng, dùng để bảo vệ chính hệ thống phân quyền khỏi việc khoá tất cả mọi người ở ngoài.</p>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Đặt tên quyền theo dạng tài_nguyên:hành_động</span><span class="lz-lnote"><code>post:xoa</code>, <code>hoa_don:xem</code>, <code>nguoi_dung:khoa</code>. Nó sắp xếp ra thứ có ích, nó gom nhóm gọn trên giao diện, và một ký tự đại diện kiểu <code>hoa_don:*</code> về sau trở nên có nghĩa nếu bạn cần tới.</span></div>
  <div class="lz-layer"><span class="lz-lname">SINH danh sách quyền từ MÃ, đừng gõ tay</span><span class="lz-lnote">Hãy định nghĩa các quyền thành một union của TypeScript rồi seed bảng từ đó. Khi ấy một quyền được nhắc trong bộ xử lý mà thiếu trong cơ sở dữ liệu sẽ là một LỖI KIỂU, thay vì một phép kiểm âm thầm từ chối tất cả trên production.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cây phân cấp vai trò là tuỳ chọn, và thường không đáng</span><span class="lz-lnote">"Admin thừa hưởng mọi thứ của biên tập viên" thì diễn đạt được bằng một liên kết cha, và nó biến một phép tra phẳng thành một phép tra đệ quy khó suy luận và khó hiển thị hơn. Nhân đôi vài bản ghi cho mỗi vai rẻ hơn việc đi giải thích một đồ thị thừa kế cho một bạn hỗ trợ.</span></div>
  <div class="lz-layer"><span class="lz-lname">GHI KIỂM TOÁN mọi lần cấp và thu hồi</span><span class="lz-lnote">Ai cấp vai gì cho ai, và lúc nào. Leo thang đặc quyền là mục tiêu của phần lớn các cú tấn công từ bên trong, và cái bảng này là thứ đầu tiên một cuộc điều tra sự cố hỏi tới — Chương 11 dựng cái nhật ký mà nó thuộc về.</span></div>
</div>

<h3>Chỗ RBAC dừng lại</h3>
<pre><code><span class="tok-comment">// Ba câu hỏi mà KHÔNG mô hình vai trò nào trả lời nổi:</span>
"Cường có được sửa tài liệu số 42 không?"        <span class="tok-comment">// ← phụ thuộc AI SỞ HỮU nó</span>
"Người này có được xem hoá đơn của khách hàng X?" <span class="tok-comment">// ← phụ thuộc họ thuộc nhóm nào</span>
"Ai đang có đường dẫn chia sẻ thì đọc được chứ?" <span class="tok-comment">// ← chẳng dính gì tới người dùng cả</span>

<span class="tok-comment">// Vai trò trả lời "người này LÀ AI trong tổ chức".</span>
<span class="tok-comment">// Chúng KHÔNG trả lời được "người này với THỨ NÀY có quan hệ gì".</span></code></pre>
<div class="callout warn">
<p><strong>Dấu hiệu nhận biết là một vai trò có ĐỊNH DANH trong tên của nó.</strong> Khi có người đề xuất <code>bien_tap_du_an_42</code>, hoặc một bảng vai trò phình ra theo DỮ LIỆU chứ không theo sơ đồ tổ chức, thì RBAC đã hết đất — bạn đang cố nhét một QUAN HỆ giữa một người dùng và một đối tượng vào một mô hình vốn chỉ biết về người dùng. Từ đó trở đi, mọi cách lách đều tệ hơn mô hình kế tiếp: một vai cho mỗi dự án, một chuỗi quyền có id nhét bên trong, một phép kiểm phải phân tích tên vai. Bài 9.3 chính là mô hình kế tiếp ấy, và lời khuyên trung thực là phần lớn sản phẩm cần CẢ HAI: vai trò cho khả năng ở phạm vi tổ chức, và quan hệ cho quyền truy cập theo từng đối tượng.</p>
</div>
<div class="note-ct">
<p><strong>Hãy bắt đầu ở chặng hai, và chỉ chuyển đi khi bạn GỌI TÊN được lý do.</strong> Vai trò với một bảng nhiều-nhiều thì tốn thêm gần như bằng không so với một cái boolean và dẹp vĩnh viễn chuyện cờ nở ra. Hãy chuyển sang chặng ba khi hai vai trò khác nhau cần những khả năng chồng-lấn-mà-không-trùng-khớp, hoặc khi một người không phải kỹ sư cần đổi ai làm được gì mà không phải deploy — hai triệu chứng đó làm cho cái bảng thêm vào tự trả được giá của nó. Chuyển sớm hơn là mua một lớp trừu tượng không có người dùng; chuyển muộn hơn là một cuộc migration dưới áp lực, thường rơi đúng vào cái tuần mà bạn cũng đang cố đưa vào một khách hàng vừa hỏi về phân quyền.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://csrc.nist.gov/projects/role-based-access-control" target="_blank" rel="noopener"><span class="lc-ico">📏</span><span class="lc-body"><span class="lc-title">NIST — kiểm soát truy cập theo vai trò</span><span class="lc-sub">csrc.nist.gov · Mô hình gốc, kể cả các biến thể có phân cấp</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html#enforce-authorization-checks-on-static-resources" target="_blank" rel="noopener"><span class="lc-ico">📋</span><span class="lc-body"><span class="lc-title">OWASP — thiết kế phân quyền</span><span class="lc-sub">cheatsheetseries.owasp.org · So sánh mô hình theo thuộc tính với mô hình theo vai trò</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations" target="_blank" rel="noopener"><span class="lc-ico">🔗</span><span class="lc-body"><span class="lc-title">Prisma — quan hệ nhiều-nhiều</span><span class="lc-sub">prisma.io · Bảng nối tường minh, chính là cái UserRole ở trên</span></span></a>
<a class="link-card" href="/courses/prisma-orm/learn${REF}"><span class="lc-ico">▲</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — Prisma ORM</span><span class="lc-sub">Khoá chính ghép, bảng nối và các câu truy vấn ở trên</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Chuyển sáu cái boolean sang vai trò và quyền mà không đổi hành vi của bất kỳ bộ xử lý nào</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — Attributes and relationships: authorization RBAC cannot express|||9.3 — Thuộc tính và quan hệ: phần phân quyền mà RBAC không diễn đạt nổi',
      slug: 'auth-9-3-abac-rebac',
      type: 'LESSON',
      description: 'Câu "Cường có được sửa tài liệu 42 không" không phụ thuộc Cường là ai, mà phụ thuộc quan hệ giữa Cường và tài liệu 42. Bài này dựng cả hai mô hình vượt qua vai trò — theo thuộc tính và theo quan hệ — rồi CHẠY THẬT một bộ kiểm quan hệ kiểu Zanzibar, kèm cả dấu vết vì sao mỗi quyết định được đưa ra.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Attributes and relationships: authorization RBAC cannot express</h2>
<p class="lead">Roles describe a person. The questions that break them describe a <em>pair</em>: this person and this object. Sharing, ownership, workspaces, folders, delegated access — every one of those is a fact about a relationship, and no amount of role modelling encodes it without smuggling an identifier into a role name.</p>

<h3>ABAC: the rule reads the attributes</h3>
<pre><code><span class="tok-comment">// Quyết định là một HÀM của (chủ thể, hành động, đối tượng, bối cảnh).</span>
function allowed(u, hanhDong, dt, boiCanh) {
  if (hanhDong === 'sua' &amp;&amp; dt.loai === 'document') {
    if (dt.ownerId === u.id) return true;                    <span class="tok-comment">// sở hữu</span>
    if (dt.state === 'DA_KHOA') return false;                 <span class="tok-comment">// trạng thái ĐỐI TƯỢNG</span>
    if (u.department === dt.department &amp;&amp; u.tier &gt;= 3) return true; <span class="tok-comment">// thuộc tính CHỦ THỂ</span>
    if (boiCanh.gio &lt; 6 || boiCanh.gio &gt; 22) return false;        <span class="tok-comment">// BỐI CẢNH</span>
  }
  return false;                                                   <span class="tok-comment">// mặc định TỪ CHỐI</span>
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">It expresses anything, which is its strength and its cost</span><span class="v">Department, seniority, document state, time of day, IP range, whether the account is verified. If you can read it, you can decide on it — and nothing forces the rules to stay comprehensible.</span></div>
  <div class="kv"><span class="k">Nobody can answer "who can edit this?"</span><span class="v">The rule runs forwards: given a person and an object, allow or deny. Running it backwards — list everyone who may edit document 42 — means evaluating it against every user, which is why ABAC systems rarely have a good sharing interface.</span></div>
  <div class="kv"><span class="k">It cannot filter a list efficiently</span><span class="v">"Show me the documents I can edit" becomes "fetch documents, evaluate each". That is fine for ten and unacceptable for a hundred thousand — the rule lives in application code, so the database cannot help.</span></div>
  <div class="kv"><span class="k">Keep the rules in one file, as data</span><span class="v">A policy engine — OPA, Cedar, Casbin — or at minimum a single module with a table of rules. Scattered <code>if</code> statements across handlers is ABAC with none of the benefits and all of the auditing problems.</span></div>
</div>

<h3>ReBAC: store the relationships, walk the graph</h3>
<pre><code><span class="tok-comment">// Một bộ ba: (đối tượng, quan hệ, chủ thể). Chỉ thế thôi.</span>
['document:42',         'chuSoHuu',  'u:cuong'],
['document:42',         'nam_trong', 'folder:ke-hoach'],
['folder:ke-hoach',    'nam_trong', 'namespace:cuongthai'],
['namespace:cuongthai','quanTri',   'u:mai'],
['namespace:cuongthai','thanhVien', 'u:nam'],
['document:42',         'nguoiXem',  'shareLink:abc'],

<span class="tok-comment">// Luật: sửa = chuSoHuu HOẶC quanTri của vật chứa nó (đệ quy).</span>
<span class="tok-comment">//       đọc = sửa HOẶC thanhVien của vật chứa nó HOẶC nguoiXem.</span></code></pre>
<div class="out">SUA  taiLieu:42   <- nd:cuong             CHO   chuSoHuu truc tiep tren taiLieu:42
SUA  taiLieu:42   <- nd:mai               CHO   quanTri cua khongGian:cuongthai (ke thua qua thuMuc:ke-hoach) (ke thua qua taiLieu:42)
SUA  taiLieu:42   <- nd:nam               CHAN  khong tim thay duong nao
DOC  taiLieu:42   <- nd:nam               CHO   thanhVien cua khongGian:cuongthai
DOC  taiLieu:42   <- lienKetChiaSe:abc    CHO   nguoiXem truc tiep
DOC  taiLieu:42   <- nd:lan               CHAN  khong tim thay duong nao

# Sau bo ba, hai luat, mot phep duyet do thi. Mai KHONG he duoc gan gi tren
# taiLieu:42 — quyen cua co ay ke thua qua thu muc len den khong gian lam viec.
# Va moi quyet dinh deu keo theo DUONG DI: do la thu ma RBAC khong in ra duoc.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Both directions work</span><span class="lz-t">The property ABAC lacks</span><span class="lz-d">"May Cường edit this?" walks up from the object. "Who can edit this?" walks down from it. The same tuples answer both, which is what makes a real sharing dialog possible.</span></div>
  <div class="lz-step"><span class="lz-k">Inheritance falls out of the graph</span><span class="lz-t">No special cases</span><span class="lz-d">A workspace admin gets access to every document inside it because the containment edges exist, not because anyone wrote a rule about workspaces and documents. Adding a folder level changes no code.</span></div>
  <div class="lz-step"><span class="lz-k">Subjects need not be users</span><span class="lz-t">Groups, links, services</span><span class="lz-d"><code>shareLink:abc</code> is a subject with a viewer relation. So is a team, an API key or another document. That generality is why the model covers "anyone with the link".</span></div>
  <div class="lz-step"><span class="lz-k">The decision carries its reason</span><span class="lz-t">Auditing for free</span><span class="lz-d">Every allow comes with the path that produced it. "Mai can edit because she administers the workspace two levels up" is a sentence you can show a user, log in an incident, and test against.</span></div>
</div>
<div class="pitfall">
<p><strong>Trap — the naive recursive walk is a performance cliff and a denial-of-service.</strong> Ten tuples traverse instantly; a real workspace with nested folders, group memberships and groups containing groups turns one authorization check into hundreds of queries, on every request. Worse, a cycle — folder A contains B contains A, which an import script can create — makes it recurse forever. Any real implementation needs a visited set, a depth limit, batched lookups instead of one query per edge, and a cache keyed on the tuple version. This is exactly why Google built Zanzibar as a dedicated service rather than a library, and why adopting ReBAC usually means adopting an implementation rather than writing the walk yourself.</p>
</div>

<h3>Choosing, and the answer that is usually both</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">RBAC for organisation-wide capability</span><span class="lz-lnote">"Support agents may read tickets", "finance may export invoices", "admins may suspend accounts". These are properties of a job and they do not vary per object — roles are the right shape and anything else is overhead.</span></div>
  <div class="lz-layer"><span class="lz-lname">ReBAC for per-object access</span><span class="lz-lnote">Ownership, sharing, workspaces, folders, comment threads, share links. If the answer depends on <em>which</em> object, tuples are the model, and trying to express it with roles produces role names containing identifiers.</span></div>
  <div class="lz-layer"><span class="lz-lname">ABAC for the conditions on top</span><span class="lz-lnote">"Not while the document is locked", "not outside business hours", "only from a managed device", "only if the account is verified". These are filters applied after the relationship check, and they are small enough to keep in one policy module.</span></div>
  <div class="lz-layer"><span class="lz-lname">Most products end up with all three, in that order</span><span class="lz-lnote">A role check for the capability, a relationship check for the object, an attribute check for the circumstances. Deciding this deliberately produces one clear pipeline; arriving at it accidentally produces the same three checks scattered across forty handlers.</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Do not build a policy engine</span><span class="v">OpenFGA and SpiceDB are open-source Zanzibar implementations; Cedar, OPA and Casbin cover the attribute side. They have solved the caching, the cycles, the list filtering and the consistency model, and none of that is where your product differentiates.</span></div>
  <div class="kv"><span class="k">A single table gets you a long way</span><span class="v">If a dedicated service is too much, a <code>quan_he(doiTuong, quanHe, chuThe)</code> table with an index on both directions, plus a hand-written walk with a depth limit, is a legitimate implementation for a product with shallow hierarchies. Know that you are choosing it.</span></div>
  <div class="kv"><span class="k">List filtering is the decision that bites</span><span class="v">"Show me everything I can read" is easy in SQL when ownership is a column and hard once permission is a graph. Check how your chosen approach answers it <em>before</em> you commit, because retrofitting it means either denormalising or paginating in application code.</span></div>
  <div class="kv"><span class="k">Write the rules down as sentences first</span><span class="v">"The owner of a document may edit it. A workspace admin may edit anything in the workspace. Anyone with the share link may read." Three sentences map to three lines of policy in any of these models — and they are also the acceptance tests.</span></div>
</div>
<div class="note-ct">
<p><strong>The model is the cheap part; the tuples are what you have to get right.</strong> Whichever engine you choose, the hard operational questions are the same: who may create a relationship (sharing is itself a permission), what happens to tuples when the object is deleted (Lesson 6.5's cascade problem, in a second store), and how stale a cached decision may be after access is revoked. Those three have caused more real incidents than any choice between ABAC and ReBAC — and unlike the model, they are yours to answer no matter what you adopt.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://research.google/pubs/pub48190/" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google Zanzibar — the paper</span><span class="lc-sub">research.google · Relationship tuples, and the consistency model behind them</span></span></a>
<a class="link-card" href="https://openfga.dev/docs/modeling" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">OpenFGA — modelling guide</span><span class="lc-sub">openfga.dev · An open-source Zanzibar, with worked models for sharing</span></span></a>
<a class="link-card" href="https://www.openpolicyagent.org/docs/latest/" target="_blank" rel="noopener"><span class="lc-ico">⚖️</span><span class="lc-body"><span class="lc-title">Open Policy Agent</span><span class="lc-sub">openpolicyagent.org · Attribute-based policy as data, kept outside handlers</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL</span><span class="lc-sub">Recursive CTEs, which is how a relationship walk looks in SQL</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Build the tuple checker above, then add a cycle and watch it never return</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Thuộc tính và quan hệ: phần phân quyền mà RBAC không diễn đạt nổi</h2>
<p class="lead">Vai trò mô tả một CON NGƯỜI. Còn những câu hỏi làm vỡ nó thì mô tả một CẶP: người này và đối tượng này. Chia sẻ, sở hữu, không gian làm việc, thư mục, quyền uỷ nhiệm — mỗi thứ trong số đó là một SỰ THẬT VỀ MỘT QUAN HỆ, và mô hình vai trò dù vẽ kiểu gì cũng không mã hoá nổi nó mà không lén nhét một định danh vào tên vai.</p>

<h3>ABAC: luật ĐỌC các thuộc tính</h3>
<pre><code><span class="tok-comment">// Quyết định là một HÀM của (chủ thể, hành động, đối tượng, bối cảnh).</span>
function allowed(u, hanhDong, dt, boiCanh) {
  if (hanhDong === 'sua' &amp;&amp; dt.loai === 'document') {
    if (dt.ownerId === u.id) return true;                    <span class="tok-comment">// sở hữu</span>
    if (dt.state === 'DA_KHOA') return false;                 <span class="tok-comment">// trạng thái ĐỐI TƯỢNG</span>
    if (u.department === dt.department &amp;&amp; u.tier &gt;= 3) return true; <span class="tok-comment">// thuộc tính CHỦ THỂ</span>
    if (boiCanh.gio &lt; 6 || boiCanh.gio &gt; 22) return false;        <span class="tok-comment">// BỐI CẢNH</span>
  }
  return false;                                                   <span class="tok-comment">// mặc định TỪ CHỐI</span>
}</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Nó diễn đạt được BẤT CỨ THỨ GÌ, vừa là sức mạnh vừa là cái giá</span><span class="v">Phòng ban, cấp bậc, trạng thái tài liệu, giờ trong ngày, dải IP, tài khoản đã xác minh hay chưa. Cứ đọc được là quyết định được — và chẳng có gì ép các luật phải giữ được tính dễ hiểu.</span></div>
  <div class="kv"><span class="k">Không ai trả lời nổi câu "ai sửa được cái này?"</span><span class="v">Luật chạy XUÔI: cho một người và một đối tượng thì cho hay chặn. Chạy NGƯỢC nó — liệt kê mọi người được sửa tài liệu 42 — nghĩa là phải đánh giá nó với TỪNG người dùng, và đó là lý do các hệ ABAC hiếm khi có một giao diện chia sẻ tử tế.</span></div>
  <div class="kv"><span class="k">Nó không lọc được một danh sách một cách hiệu quả</span><span class="v">"Cho tôi xem những tài liệu tôi sửa được" biến thành "lấy hết tài liệu về rồi đánh giá từng cái". Với mười cái thì ổn và với một trăm nghìn cái thì không chấp nhận được — luật sống trong mã ứng dụng nên cơ sở dữ liệu chẳng giúp được gì.</span></div>
  <div class="kv"><span class="k">Giữ các luật trong MỘT tệp, dưới dạng DỮ LIỆU</span><span class="v">Một cỗ máy chính sách — OPA, Cedar, Casbin — hoặc tối thiểu là một module duy nhất với một bảng luật. Rải câu <code>if</code> khắp các bộ xử lý là ABAC không có lợi ích nào mà lại đủ mọi vấn đề kiểm toán.</span></div>
</div>

<h3>ReBAC: lưu QUAN HỆ, rồi đi trên đồ thị</h3>
<pre><code><span class="tok-comment">// Một bộ ba: (đối tượng, quan hệ, chủ thể). Chỉ thế thôi.</span>
['document:42',         'chuSoHuu',  'u:cuong'],
['document:42',         'nam_trong', 'folder:ke-hoach'],
['folder:ke-hoach',    'nam_trong', 'namespace:cuongthai'],
['namespace:cuongthai','quanTri',   'u:mai'],
['namespace:cuongthai','thanhVien', 'u:nam'],
['document:42',         'nguoiXem',  'shareLink:abc'],

<span class="tok-comment">// Luật: sửa = chuSoHuu HOẶC quanTri của vật chứa nó (đệ quy).</span>
<span class="tok-comment">//       đọc = sửa HOẶC thanhVien của vật chứa nó HOẶC nguoiXem.</span></code></pre>
<div class="out">SUA  taiLieu:42   <- nd:cuong             CHO   chuSoHuu truc tiep tren taiLieu:42
SUA  taiLieu:42   <- nd:mai               CHO   quanTri cua khongGian:cuongthai (ke thua qua thuMuc:ke-hoach) (ke thua qua taiLieu:42)
SUA  taiLieu:42   <- nd:nam               CHAN  khong tim thay duong nao
DOC  taiLieu:42   <- nd:nam               CHO   thanhVien cua khongGian:cuongthai
DOC  taiLieu:42   <- lienKetChiaSe:abc    CHO   nguoiXem truc tiep
DOC  taiLieu:42   <- nd:lan               CHAN  khong tim thay duong nao

# Sau bo ba, hai luat, mot phep duyet do thi. Mai KHONG he duoc gan gi tren
# taiLieu:42 — quyen cua co ay ke thua qua thu muc len den khong gian lam viec.
# Va moi quyet dinh deu keo theo DUONG DI: do la thu ma RBAC khong in ra duoc.</div>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Chạy được CẢ HAI CHIỀU</span><span class="lz-t">Tính chất mà ABAC thiếu</span><span class="lz-d">"Cường sửa được cái này không?" thì đi NGƯỢC LÊN từ đối tượng. "Ai sửa được cái này?" thì đi XUỐNG từ nó. Cùng một bộ ba trả lời được cả hai, và đó là thứ làm cho một hộp thoại chia sẻ thật sự trở nên khả thi.</span></div>
  <div class="lz-step"><span class="lz-k">Thừa kế RƠI RA từ đồ thị</span><span class="lz-t">Không có trường hợp đặc biệt nào</span><span class="lz-d">Một quản trị viên không gian làm việc có quyền trên mọi tài liệu bên trong vì các cạnh CHỨA tồn tại, chứ không phải vì có ai đó viết một cái luật về không gian với tài liệu. Thêm một tầng thư mục thì chẳng đổi dòng mã nào.</span></div>
  <div class="lz-step"><span class="lz-k">Chủ thể KHÔNG nhất thiết là người dùng</span><span class="lz-t">Nhóm, đường dẫn, dịch vụ</span><span class="lz-d"><code>shareLink:abc</code> là một chủ thể mang quan hệ nguoiXem. Một cái đội, một khoá API hay một tài liệu khác cũng vậy. Chính tính tổng quát ấy làm mô hình này phủ được ca "ai có đường dẫn thì vào được".</span></div>
  <div class="lz-step"><span class="lz-k">Quyết định mang theo LÝ DO của nó</span><span class="lz-t">Kiểm toán miễn phí</span><span class="lz-d">Mỗi lần cho phép đều kèm cái ĐƯỜNG ĐI sinh ra nó. "Mai sửa được vì cô ấy quản trị cái không gian làm việc cách đó hai tầng" là một câu văn bạn đưa cho người dùng đọc được, ghi vào một cuộc điều tra sự cố được, và viết test cho nó được.</span></div>
</div>
<div class="pitfall">
<p><strong>Bẫy — phép duyệt đệ quy ngây thơ là một VỰC hiệu năng và cũng là một cú từ chối dịch vụ.</strong> Mười bộ ba thì đi hết trong nháy mắt; một không gian làm việc thật với thư mục lồng nhau, tư cách thành viên nhóm, và nhóm chứa nhóm sẽ biến MỘT phép kiểm phân quyền thành hàng trăm câu truy vấn, ở MỌI request. Tệ hơn, một chu trình — thư mục A chứa B chứa A, thứ mà một script nhập liệu tạo ra được — làm nó đệ quy vô tận. Mọi bản cài đặt thật đều cần một tập đã-thăm, một giới hạn độ sâu, các phép tra theo LÔ thay vì một truy vấn cho mỗi cạnh, và một bộ nhớ đệm lấy phiên bản bộ ba làm khoá. Đó đúng là lý do Google dựng Zanzibar thành một DỊCH VỤ riêng chứ không phải một thư viện, và là lý do chọn ReBAC thường có nghĩa là chọn một bản cài đặt sẵn thay vì tự viết phép duyệt.</p>
</div>

<h3>Chọn thế nào, và câu trả lời thường là CẢ BA</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">RBAC cho khả năng ở phạm vi TỔ CHỨC</span><span class="lz-lnote">"Nhân viên hỗ trợ được đọc ticket", "phòng tài chính được xuất hoá đơn", "quản trị viên được khoá tài khoản". Đó là tính chất của một CÔNG VIỆC và chúng không đổi theo từng đối tượng — vai trò là đúng hình dạng, còn thứ gì khác đều là gánh nặng thừa.</span></div>
  <div class="lz-layer"><span class="lz-lname">ReBAC cho quyền truy cập theo TỪNG ĐỐI TƯỢNG</span><span class="lz-lnote">Sở hữu, chia sẻ, không gian làm việc, thư mục, luồng bình luận, đường dẫn chia sẻ. Nếu câu trả lời phụ thuộc vào <em>đối tượng NÀO</em> thì bộ ba là mô hình đúng, còn cố diễn đạt bằng vai trò sẽ đẻ ra những cái tên vai có định danh bên trong.</span></div>
  <div class="lz-layer"><span class="lz-lname">ABAC cho các ĐIỀU KIỆN đặt lên trên</span><span class="lz-lnote">"Không được, khi tài liệu đang khoá", "không được, ngoài giờ hành chính", "chỉ từ thiết bị do công ty quản lý", "chỉ khi tài khoản đã xác minh". Đó là những bộ lọc áp SAU phép kiểm quan hệ, và chúng đủ nhỏ để giữ gọn trong một module chính sách.</span></div>
  <div class="lz-layer"><span class="lz-lname">Phần lớn sản phẩm rốt cuộc dùng cả ba, theo đúng thứ tự đó</span><span class="lz-lnote">Một phép kiểm vai trò cho khả năng, một phép kiểm quan hệ cho đối tượng, một phép kiểm thuộc tính cho hoàn cảnh. Quyết định điều này CÓ CHỦ Ý thì cho ra một đường ống rõ ràng; đi tới nó một cách tình cờ thì cho ra đúng ba phép kiểm ấy rải khắp bốn mươi bộ xử lý.</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Đừng tự dựng một cỗ máy chính sách</span><span class="v">OpenFGA và SpiceDB là các bản cài Zanzibar mã nguồn mở; Cedar, OPA và Casbin lo phía thuộc tính. Họ đã giải xong phần cache, phần chu trình, phần lọc danh sách và mô hình nhất quán, mà chẳng phần nào trong số đó là chỗ sản phẩm của bạn tạo ra khác biệt.</span></div>
  <div class="kv"><span class="k">Một cái bảng duy nhất cũng đi được khá xa</span><span class="v">Nếu một dịch vụ riêng là quá nặng thì một bảng <code>quan_he(doiTuong, quanHe, chuThe)</code> có chỉ mục theo cả hai chiều, cộng một phép duyệt viết tay có giới hạn độ sâu, là một bản cài đặt chính đáng cho sản phẩm có cây phân cấp NÔNG. Hãy BIẾT rằng bạn đang chọn nó.</span></div>
  <div class="kv"><span class="k">Lọc danh sách mới là quyết định cắn bạn</span><span class="v">"Cho tôi xem mọi thứ tôi đọc được" thì dễ trong SQL khi quyền sở hữu là một cột, và khó hẳn khi quyền là một đồ thị. Hãy kiểm xem cách bạn chọn trả lời nó ra sao <em>TRƯỚC</em> khi cam kết, vì lắp thêm về sau nghĩa là hoặc phi chuẩn hoá dữ liệu, hoặc phân trang bằng mã ứng dụng.</span></div>
  <div class="kv"><span class="k">Hãy viết các luật thành CÂU VĂN trước đã</span><span class="v">"Người sở hữu một tài liệu thì được sửa nó. Quản trị viên không gian làm việc được sửa mọi thứ trong đó. Ai có đường dẫn chia sẻ thì được đọc." Ba câu đó ánh xạ thành ba dòng chính sách trong bất kỳ mô hình nào ở đây — và chúng cũng chính là các bài kiểm thử nghiệm thu.</span></div>
</div>
<div class="note-ct">
<p><strong>Mô hình là phần RẺ; các bộ ba mới là thứ bạn buộc phải làm cho đúng.</strong> Chọn cỗ máy nào thì những câu hỏi vận hành khó nhằn vẫn y hệt: AI được quyền TẠO một quan hệ (chia sẻ tự nó cũng là một quyền), chuyện gì xảy ra với các bộ ba khi đối tượng bị xoá (chính là bài toán cascade ở Bài 6.5, nhưng trong một kho lưu trữ THỨ HAI), và một quyết định đã cache được phép cũ tới mức nào sau khi quyền bị thu hồi. Ba thứ đó đã gây ra nhiều sự cố thật hơn bất kỳ lựa chọn nào giữa ABAC và ReBAC — và khác với mô hình, chúng là phần bạn phải tự trả lời dù có chọn thứ gì đi nữa.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://research.google/pubs/pub48190/" target="_blank" rel="noopener"><span class="lc-ico">📄</span><span class="lc-body"><span class="lc-title">Google Zanzibar — bài báo gốc</span><span class="lc-sub">research.google · Bộ ba quan hệ, và mô hình nhất quán đứng sau chúng</span></span></a>
<a class="link-card" href="https://openfga.dev/docs/modeling" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">OpenFGA — hướng dẫn mô hình hoá</span><span class="lc-sub">openfga.dev · Một bản Zanzibar mã nguồn mở, kèm mô hình mẫu cho việc chia sẻ</span></span></a>
<a class="link-card" href="https://www.openpolicyagent.org/docs/latest/" target="_blank" rel="noopener"><span class="lc-ico">⚖️</span><span class="lc-body"><span class="lc-title">Open Policy Agent</span><span class="lc-sub">openpolicyagent.org · Chính sách theo thuộc tính viết dưới dạng dữ liệu, đặt NGOÀI các bộ xử lý</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL</span><span class="lc-sub">CTE đệ quy, chính là hình dáng của một phép duyệt quan hệ khi viết bằng SQL</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Dựng bộ kiểm bộ ba ở trên, rồi thêm một chu trình vào và nhìn nó không bao giờ trả về</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 9.4 ─────────────────────────── */
    {
      title: '9.4 — Multi-tenancy: the boundary that must never leak|||9.4 — Nhiều tenant: cái ranh giới KHÔNG BAO GIỜ được rò',
      slug: 'auth-9-4-nhieu-tenant',
      type: 'LESSON',
      description: 'Một mệnh đề WHERE bị quên trong một truy vấn là một con lỗi; cũng mệnh đề đó bị quên trong một hệ nhiều tenant là chuyện khách hàng A đọc được dữ liệu của khách hàng B. Bài này dựng ba lớp phòng thủ, rồi CHẠY THẬT PostgreSQL Row-Level Security — kèm cả hai đường mà nó âm thầm bị bỏ qua.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Multi-tenancy: the boundary that must never leak</h2>
<p class="lead">Every authorization bug so far has been one user seeing another user's row. In a multi-tenant product the same mistake is one <em>company</em> seeing another company's data, and it is the failure that ends contracts and triggers breach notifications. It also has a distinctive property: it is caused by omission, in a query that looks completely ordinary.</p>

<h3>The bug, and why it is invisible in review</h3>
<pre><code><span class="tok-comment">// Ba truy vấn. Hai cái đúng, một cái không. Cái nào?</span>
const a = await prisma.invoice.findMany({ where: { tenantId, state: 'CHUA_TRA' } });
const b = await prisma.invoice.findMany({ where: { tenantId, khachHangId } });
const c = await prisma.invoice.findMany({ where: { state: 'QUA_HAN' } });

<span class="tok-comment">// Cái thứ ba trả về hoá đơn quá hạn của MỌI công ty. Nó biên dịch được,</span>
<span class="tok-comment">// nó chạy được, test cũng xanh — vì môi trường test chỉ có MỘT tenant.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Nothing marks it as wrong</span><span class="v">There is no type error, no lint rule, and no runtime failure. The query returns rows, the page renders, and the defect is only visible if a reviewer holds "every query touching this table needs a tenant filter" in their head across every file.</span></div>
  <div class="kv"><span class="k">Tests miss it by construction</span><span class="v">A test fixture with one tenant cannot detect a missing tenant filter, because with one tenant the filtered and unfiltered results are identical. Every multi-tenant test suite needs a second tenant whose data must never appear.</span></div>
  <div class="kv"><span class="k">It hides in the places nobody reviews</span><span class="v">Background jobs, CSV exports, admin dashboards, analytics rollups, the migration script somebody ran once. These read the same tables without going through the request path where the tenant filter lives.</span></div>
  <div class="kv"><span class="k">Aggregates leak without showing a single row</span><span class="v">A <code>count</code>, a <code>sum</code> or a chart with no tenant filter reveals a competitor's revenue without ever displaying their data. These are the queries least likely to be reviewed as security-sensitive.</span></div>
</div>

<h3>Three layers, and you want more than one</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Layer 1</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Resolve the tenant once, early</span><span class="lz-nsub">From the session, never from a request parameter · one middleware, one source of truth</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Layer 2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">A data layer that cannot forget</span><span class="lz-nsub">A Prisma extension or repository that injects the filter · handlers never write tenantId themselves</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Layer 3</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Row-level security in the database</span><span class="lz-nsub">The last word · applies to every connection, including the psql session at 2am</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Not a layer</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"Everyone remembers the filter"</span><span class="lz-nsub">This is the state you are in right now, and it is why the bug exists</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// Lớp 1 — tenant lấy TỪ PHIÊN. Không bao giờ từ tham số của request.</span>
app.use((req, res, next) =&gt; {
  req.tenantId = req.u.tenantId;              <span class="tok-comment">// ĐÚNG: máy chủ tự biết</span>
  <span class="tok-comment">// req.tenantId = req.query.tenant;          // SAI: khách hàng tự khai</span>
  next();
});

<span class="tok-comment">// Lớp 2 — phần mở rộng Prisma tự chèn bộ lọc vào MỌI truy vấn.</span>
const db = prisma.$extends({
  query: { $allModels: { async $allOperations({ args, query, model }) {
    if (BANG_CO_TENANT.has(model!) &amp;&amp; args.where) {
      args.where = { AND: [args.where, { tenantId: getCurrentTenant() }] };
    }
    return query(args);
  }}},
});</code></pre>

<h3>Layer 3, run for real</h3>
<div class="out">=== 1. Vai ung_dung, DA dat app.tenant = cuongthai ===
 id | tenant_id | so_tien
  1 | cuongthai | 1500000
  2 | cuongthai |  900000
(2 rows)

=== 2. Cung cau truy van do, nhung QUEN menh de WHERE ===
 so_dong_thay_duoc = 2          &lt;- RLS van chan. Day la ca ma Lop 2 bo sot.

=== 3. Co tinh hoi hoa don cua tenant khac ===
(0 rows)

=== 4. Co tinh SUA hoa don cua tenant khac ===
UPDATE 0

=== 5. Chua dat app.tenant chut nao ===
 so_dong_thay_duoc = 0          &lt;- quen dat bien = thay KHONG GI, khong phai thay TAT CA</div>
<pre><code>ALTER TABLE hoa_don ENABLE ROW LEVEL SECURITY;
CREATE POLICY chi_tenant_cua_minh ON hoa_don
  USING (tenant_id = current_setting('app.tenant', true));

<span class="tok-comment">-- Ứng dụng đặt biến này MỘT lần cho mỗi request, trong cùng giao dịch:</span>
SET LOCAL app.tenant = 'cuongthai';</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">It applies to every path</span><span class="lz-t">Not just the request one</span><span class="lz-d">The background job, the export script, the analytics query and the console session all go through the same policy. This is the property no application-layer solution has.</span></div>
  <div class="lz-step"><span class="lz-k">Forgetting fails closed</span><span class="lz-t">Zero rows, not all rows</span><span class="lz-d">An unset <code>app.tenant</code> makes <code>current_setting</code> return null and the policy match nothing. The failure mode of forgetting is an empty page, which someone reports in minutes — not a silent leak nobody notices.</span></div>
  <div class="lz-step"><span class="lz-k">Writes are covered too</span><span class="lz-t">UPDATE 0, not UPDATE 1</span><span class="lz-d">The policy applies to <code>UPDATE</code> and <code>DELETE</code> as well as <code>SELECT</code>. Add a <code>WITH CHECK</code> clause so an <code>INSERT</code> cannot write a row into somebody else's tenant either.</span></div>
  <div class="lz-step"><span class="lz-k">Use SET LOCAL, inside a transaction</span><span class="lz-t">Connection pools reuse connections</span><span class="lz-d">A plain <code>SET</code> persists on the pooled connection and leaks into the next request that borrows it — which is a tenant leak created by the defence. <code>SET LOCAL</code> is scoped to the transaction and resets automatically.</span></div>
</div>
<div class="out">=== 7a. Sieu nguoi dung (postgres) — RLS BI BO QUA, ke ca khi da FORCE ===
 la_sieu_nguoi_dung | rolbypassrls
 t                  | t
 postgres_thay_duoc = 4          &lt;- CA BON dong, cua ca hai tenant

=== 7b. CHU BANG that (khong phai sieu nguoi dung), da co FORCE ===
 id | tenant_id | so_tien
  1 | cuongthai | 1500000
  2 | cuongthai |  900000
(2 rows)
 chua dat app.tenant -> chu_bang_thay_duoc = 0</div>
<div class="pitfall">
<p><strong>Trap — RLS is silently skipped for two kinds of role, and the default setup hits both.</strong> A table's <em>owner</em> bypasses its own policies unless you add <code>ALTER TABLE … FORCE ROW LEVEL SECURITY</code>, and a <em>superuser</em> bypasses them unconditionally — <code>FORCE</code> does not help, as the measurement above shows: the same query returns two rows for a normal owner and all four for <code>postgres</code>. Most projects connect as the migration user, which is usually both the owner and a superuser, so RLS is enabled, the policy is correct, and nothing is enforced. The fix is structural: run migrations as one role, run the application as a different, non-superuser, non-owner role with only <code>SELECT/INSERT/UPDATE/DELETE</code> granted — and verify it by querying as the application role with <code>app.tenant</code> unset and confirming you get zero rows.</p>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Test with two tenants, always</span><span class="lz-lnote">Seed the test database with a second tenant whose rows must never appear in any assertion. It is the only mechanism that catches a missing filter automatically, and it costs one fixture.</span></div>
  <div class="lz-layer"><span class="lz-lname">Never accept the tenant from the client</span><span class="lz-lnote">Not a query parameter, not a header, not a field in a JSON body. It comes from the session, or from a subdomain that you then verify the session is entitled to — otherwise the whole boundary is a value the attacker types.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cross-tenant features need an explicit, audited path</span><span class="lz-lnote">Support impersonation, platform analytics, a billing rollup. Give them a separate role and a separate code path that logs every access — never a flag that turns the tenant filter off in the normal path.</span></div>
  <div class="lz-layer"><span class="lz-lname">Separate databases are the strongest boundary, at a price</span><span class="lz-lnote">One schema or one database per tenant makes leakage nearly impossible and makes migrations, connection pooling and cross-tenant reporting genuinely painful. It is the right answer for a handful of large regulated customers, and the wrong one for ten thousand small ones.</span></div>
</div>
<div class="note-ct">
<p><strong>Decide the layers on the first day, because retrofitting means auditing every query you have ever written.</strong> Adding RLS to a mature schema is one migration per table plus a role change; the hard part is that until you have proven the application role sees nothing without <code>app.tenant</code>, you do not know whether it is protecting anything. Run that check in CI: connect as the application role, leave the setting unset, and assert that a <code>SELECT</code> on each tenant-scoped table returns zero rows. That single test is worth more than any amount of review discipline, and it is the only one that keeps passing after the next twelve engineers join.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://www.postgresql.org/docs/current/ddl-rowsecurity.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — row security policies</span><span class="lc-sub">postgresql.org · Policies, FORCE, and the roles that bypass them</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/sql-set.html" target="_blank" rel="noopener"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">PostgreSQL — SET and SET LOCAL</span><span class="lc-sub">postgresql.org · Transaction scope, which is what makes it pool-safe</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions/query" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">Prisma — query extensions</span><span class="lc-sub">prisma.io · Intercepting every operation, as in layer 2 above</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">CuongThai course — PostgreSQL</span><span class="lc-sub">Roles, ownership and grants — the parts that decide whether RLS applies</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Enable RLS, then connect as the owner and watch the policy do nothing</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Nhiều tenant: cái ranh giới KHÔNG BAO GIỜ được rò</h2>
<p class="lead">Mọi con lỗi phân quyền tới giờ đều là chuyện một người dùng nhìn thấy bản ghi của một người dùng khác. Trong một sản phẩm nhiều tenant, đúng cái sai ấy là chuyện một <em>CÔNG TY</em> nhìn thấy dữ liệu của công ty khác, và đó là kiểu hỏng làm mất hợp đồng và kích hoạt nghĩa vụ thông báo vi phạm. Nó còn có một tính chất riêng: nó sinh ra từ SỰ THIẾU SÓT, trong một câu truy vấn trông hoàn toàn bình thường.</p>

<h3>Con lỗi, và vì sao nó vô hình lúc review</h3>
<pre><code><span class="tok-comment">// Ba truy vấn. Hai cái đúng, một cái không. Cái nào?</span>
const a = await prisma.invoice.findMany({ where: { tenantId, state: 'CHUA_TRA' } });
const b = await prisma.invoice.findMany({ where: { tenantId, khachHangId } });
const c = await prisma.invoice.findMany({ where: { state: 'QUA_HAN' } });

<span class="tok-comment">// Cái thứ ba trả về hoá đơn quá hạn của MỌI công ty. Nó biên dịch được,</span>
<span class="tok-comment">// nó chạy được, test cũng xanh — vì môi trường test chỉ có MỘT tenant.</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Chẳng có gì đánh dấu nó là sai</span><span class="v">Không lỗi kiểu, không luật lint, không sự cố lúc chạy. Truy vấn trả về bản ghi, trang hiển thị ra, và khiếm khuyết chỉ lộ ra nếu người review giữ được trong đầu câu "mọi truy vấn chạm tới bảng này đều cần bộ lọc tenant" xuyên qua từng tệp một.</span></div>
  <div class="kv"><span class="k">Bộ kiểm thử bỏ sót nó theo CẤU TRÚC</span><span class="v">Một bộ dữ liệu kiểm thử chỉ có một tenant thì KHÔNG THỂ phát hiện việc thiếu bộ lọc tenant, vì với một tenant thì kết quả có lọc và không lọc giống hệt nhau. Mọi bộ kiểm thử của hệ nhiều tenant đều cần một tenant THỨ HAI mà dữ liệu của nó không bao giờ được xuất hiện.</span></div>
  <div class="kv"><span class="k">Nó núp ở những chỗ chẳng ai review</span><span class="v">Công việc chạy nền, bản xuất CSV, bảng điều khiển quản trị, phép tổng hợp phân tích, cái script migration ai đó chạy đúng một lần. Chúng đọc cùng những cái bảng ấy mà không đi qua đường request nơi bộ lọc tenant đang nằm.</span></div>
  <div class="kv"><span class="k">Phép tổng hợp làm RÒ mà không hiện lấy một dòng</span><span class="v">Một câu <code>count</code>, một câu <code>sum</code> hay một biểu đồ không có bộ lọc tenant sẽ tiết lộ doanh thu của đối thủ mà chẳng bao giờ hiển thị dữ liệu của họ. Đó lại đúng là những truy vấn ít có khả năng được review như thứ nhạy cảm về bảo mật nhất.</span></div>
</div>

<h3>Ba lớp, và bạn muốn có nhiều hơn một</h3>
<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Lớp 1</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Xác định tenant MỘT lần, thật sớm</span><span class="lz-nsub">Từ PHIÊN, không bao giờ từ tham số request · một middleware, một nguồn sự thật</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Lớp 2</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Một tầng dữ liệu KHÔNG THỂ quên</span><span class="lz-nsub">Một phần mở rộng Prisma hoặc một repository tự chèn bộ lọc · bộ xử lý không bao giờ tự viết tenantId</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Lớp 3</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">Row-level security trong cơ sở dữ liệu</span><span class="lz-nsub">Tiếng nói cuối cùng · áp cho MỌI kết nối, kể cả phiên psql lúc hai giờ sáng</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">KHÔNG phải một lớp</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">"Ai cũng nhớ đặt bộ lọc mà"</span><span class="lz-nsub">Đây là trạng thái bạn đang ở NGAY BÂY GIỜ, và đó là lý do con lỗi tồn tại</span></div></div>
  </div>
</div>
<pre><code><span class="tok-comment">// Lớp 1 — tenant lấy TỪ PHIÊN. Không bao giờ từ tham số của request.</span>
app.use((req, res, next) =&gt; {
  req.tenantId = req.u.tenantId;              <span class="tok-comment">// ĐÚNG: máy chủ tự biết</span>
  <span class="tok-comment">// req.tenantId = req.query.tenant;          // SAI: khách hàng tự khai</span>
  next();
});

<span class="tok-comment">// Lớp 2 — phần mở rộng Prisma tự chèn bộ lọc vào MỌI truy vấn.</span>
const db = prisma.$extends({
  query: { $allModels: { async $allOperations({ args, query, model }) {
    if (BANG_CO_TENANT.has(model!) &amp;&amp; args.where) {
      args.where = { AND: [args.where, { tenantId: getCurrentTenant() }] };
    }
    return query(args);
  }}},
});</code></pre>

<h3>Lớp 3, chạy thật</h3>
<div class="out">=== 1. Vai ung_dung, DA dat app.tenant = cuongthai ===
 id | tenant_id | so_tien
  1 | cuongthai | 1500000
  2 | cuongthai |  900000
(2 rows)

=== 2. Cung cau truy van do, nhung QUEN menh de WHERE ===
 so_dong_thay_duoc = 2          &lt;- RLS van chan. Day la ca ma Lop 2 bo sot.

=== 3. Co tinh hoi hoa don cua tenant khac ===
(0 rows)

=== 4. Co tinh SUA hoa don cua tenant khac ===
UPDATE 0

=== 5. Chua dat app.tenant chut nao ===
 so_dong_thay_duoc = 0          &lt;- quen dat bien = thay KHONG GI, khong phai thay TAT CA</div>
<pre><code>ALTER TABLE hoa_don ENABLE ROW LEVEL SECURITY;
CREATE POLICY chi_tenant_cua_minh ON hoa_don
  USING (tenant_id = current_setting('app.tenant', true));

<span class="tok-comment">-- Ứng dụng đặt biến này MỘT lần cho mỗi request, trong cùng giao dịch:</span>
SET LOCAL app.tenant = 'cuongthai';</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Nó áp cho MỌI đường</span><span class="lz-t">Không riêng đường request</span><span class="lz-d">Công việc chạy nền, script xuất dữ liệu, truy vấn phân tích và phiên gõ tay trên console đều đi qua cùng một chính sách. Đây là tính chất mà KHÔNG giải pháp nào ở tầng ứng dụng có được.</span></div>
  <div class="lz-step"><span class="lz-k">Quên thì hỏng theo hướng ĐÓNG</span><span class="lz-t">Không dòng nào, chứ không phải mọi dòng</span><span class="lz-d">Chưa đặt <code>app.tenant</code> thì <code>current_setting</code> trả về null và chính sách không khớp gì cả. Kiểu hỏng của việc quên là một trang TRỐNG, thứ mà có người báo lại sau vài phút — chứ không phải một cú rò lặng lẽ mà chẳng ai nhận ra.</span></div>
  <div class="lz-step"><span class="lz-k">Lệnh GHI cũng được phủ</span><span class="lz-t">UPDATE 0, không phải UPDATE 1</span><span class="lz-d">Chính sách áp cho cả <code>UPDATE</code> và <code>DELETE</code> chứ không riêng <code>SELECT</code>. Hãy thêm một mệnh đề <code>WITH CHECK</code> để một câu <code>INSERT</code> cũng không ghi được một bản ghi vào tenant của người khác.</span></div>
  <div class="lz-step"><span class="lz-k">Dùng SET LOCAL, bên trong một giao dịch</span><span class="lz-t">Bể kết nối thì DÙNG LẠI kết nối</span><span class="lz-d">Một câu <code>SET</code> thường sẽ ở lại trên cái kết nối trong bể và rò sang request kế tiếp mượn nó — tức là một cú rò tenant do CHÍNH hàng phòng thủ tạo ra. <code>SET LOCAL</code> giới hạn trong giao dịch và tự đặt lại.</span></div>
</div>
<div class="out">=== 7a. Sieu nguoi dung (postgres) — RLS BI BO QUA, ke ca khi da FORCE ===
 la_sieu_nguoi_dung | rolbypassrls
 t                  | t
 postgres_thay_duoc = 4          &lt;- CA BON dong, cua ca hai tenant

=== 7b. CHU BANG that (khong phai sieu nguoi dung), da co FORCE ===
 id | tenant_id | so_tien
  1 | cuongthai | 1500000
  2 | cuongthai |  900000
(2 rows)
 chua dat app.tenant -> chu_bang_thay_duoc = 0</div>
<div class="pitfall">
<p><strong>Bẫy — RLS bị bỏ qua trong IM LẶNG với hai loại vai, và cấu hình mặc định thì dính cả hai.</strong> CHỦ SỞ HỮU của một bảng đi vòng qua chính sách của chính bảng đó, trừ khi bạn thêm <code>ALTER TABLE … FORCE ROW LEVEL SECURITY</code>; còn SIÊU NGƯỜI DÙNG thì đi vòng qua VÔ ĐIỀU KIỆN — <code>FORCE</code> không giúp gì, đúng như phép đo ở trên cho thấy: cùng một câu truy vấn trả về hai dòng cho một chủ bảng thường và cả bốn dòng cho <code>postgres</code>. Phần lớn dự án kết nối bằng tài khoản chạy migration, mà tài khoản đó thường vừa là chủ bảng vừa là siêu người dùng, nên RLS đã bật, chính sách viết đúng, và chẳng có gì được thi hành cả. Cách vá mang tính CẤU TRÚC: chạy migration bằng một vai, chạy ứng dụng bằng một vai KHÁC, không siêu người dùng, không sở hữu bảng, chỉ được cấp <code>SELECT/INSERT/UPDATE/DELETE</code> — và hãy KIỂM CHỨNG bằng cách truy vấn dưới vai ứng dụng khi chưa đặt <code>app.tenant</code> rồi xác nhận rằng bạn nhận về không dòng nào.</p>
</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Kiểm thử với HAI tenant, luôn luôn</span><span class="lz-lnote">Hãy gieo vào cơ sở dữ liệu kiểm thử một tenant thứ hai mà bản ghi của nó không bao giờ được xuất hiện trong bất kỳ phép khẳng định nào. Đó là cơ chế DUY NHẤT bắt được một bộ lọc bị thiếu một cách tự động, và nó tốn đúng một bộ dữ liệu mẫu.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đừng bao giờ nhận tenant TỪ CLIENT</span><span class="lz-lnote">Không phải một tham số truy vấn, không phải một header, không phải một trường trong thân JSON. Nó tới từ PHIÊN, hoặc từ một tên miền con mà sau đó bạn kiểm chứng rằng phiên này có quyền với nó — không thì cả cái ranh giới đó chỉ là một giá trị mà kẻ tấn công tự gõ vào.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tính năng xuyên tenant cần một đường RIÊNG, có ghi kiểm toán</span><span class="lz-lnote">Hỗ trợ đóng vai người dùng, phân tích toàn nền tảng, một phép tổng hợp hoá đơn. Hãy cho chúng một vai riêng và một đường mã riêng ghi log MỌI lần truy cập — đừng bao giờ dùng một cái cờ TẮT bộ lọc tenant ngay trong đường mã bình thường.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tách hẳn cơ sở dữ liệu là ranh giới mạnh nhất, và có giá của nó</span><span class="lz-lnote">Một schema hoặc một cơ sở dữ liệu cho mỗi tenant làm việc rò rỉ gần như bất khả, và làm cho migration, gom bể kết nối và báo cáo xuyên tenant trở nên thật sự đau đớn. Đó là câu trả lời ĐÚNG cho một nhúm khách hàng lớn bị quản lý chặt, và SAI cho mười nghìn khách hàng nhỏ.</span></div>
</div>
<div class="note-ct">
<p><strong>Hãy quyết định các lớp ngay ngày đầu, vì lắp thêm về sau nghĩa là soát lại MỌI câu truy vấn bạn từng viết.</strong> Thêm RLS vào một lược đồ đã trưởng thành thì tốn một migration cho mỗi bảng cộng một lần đổi vai; phần khó là cho tới khi bạn CHỨNG MINH được rằng vai ứng dụng không nhìn thấy gì khi chưa có <code>app.tenant</code> thì bạn chưa biết nó có đang bảo vệ thứ gì hay không. Hãy chạy phép kiểm ấy trong CI: kết nối bằng vai ứng dụng, để nguyên biến chưa đặt, rồi khẳng định rằng một câu <code>SELECT</code> trên mỗi bảng có tenant trả về không dòng nào. Riêng bài kiểm thử đó đáng giá hơn mọi mức độ kỷ luật review, và nó là bài duy nhất còn tiếp tục xanh sau khi mười hai kỹ sư tiếp theo gia nhập.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://www.postgresql.org/docs/current/ddl-rowsecurity.html" target="_blank" rel="noopener"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">PostgreSQL — chính sách bảo mật mức dòng</span><span class="lc-sub">postgresql.org · Chính sách, FORCE, và những vai đi vòng qua được</span></span></a>
<a class="link-card" href="https://www.postgresql.org/docs/current/sql-set.html" target="_blank" rel="noopener"><span class="lc-ico">🔧</span><span class="lc-body"><span class="lc-title">PostgreSQL — SET và SET LOCAL</span><span class="lc-sub">postgresql.org · Phạm vi giao dịch, thứ làm cho nó an toàn với bể kết nối</span></span></a>
<a class="link-card" href="https://www.prisma.io/docs/orm/prisma-client/client-extensions/query" target="_blank" rel="noopener"><span class="lc-ico">🧩</span><span class="lc-body"><span class="lc-title">Prisma — phần mở rộng truy vấn</span><span class="lc-sub">prisma.io · Chặn mọi thao tác, đúng như lớp 2 ở trên</span></span></a>
<a class="link-card" href="/courses/postgresql/learn${REF}"><span class="lc-ico">🐘</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — PostgreSQL</span><span class="lc-sub">Vai, quyền sở hữu và cấp quyền — những thứ quyết định RLS có áp hay không</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Bật RLS lên, rồi kết nối bằng chính chủ bảng và nhìn chính sách chẳng làm gì cả</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 9.5 ─────────────────────────── */
    {
      title: '9.5 — Where the check lives, and how to make forgetting impossible|||9.5 — Phép kiểm nằm ở đâu, và làm sao để KHÔNG THỂ quên',
      slug: 'auth-9-5-dat-phep-kiem-o-dau',
      type: 'LESSON',
      description: 'Bốn chỗ có thể đặt phép kiểm phân quyền, và mỗi chỗ bỏ sót một thứ khác nhau. Bài này chỉ ra vì sao tuyến API không phải cánh cửa duy nhất, dựng cái mẫu khiến việc quên thành lỗi lúc DỰNG, chạy thật một BẢNG KIỂM phân quyền 25 ô, và vá con lỗi gán hàng loạt — thứ nhìn như lỗi tuần tự hoá mà thực chất là leo thang đặc quyền.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.5</span>
<h2>Where the check lives, and how to make forgetting impossible</h2>
<p class="lead">Lessons 9.2 to 9.4 decided <em>what</em> the rules are. This one decides where they run — which turns out to matter more, because a correct rule in the wrong layer is absent from every code path that does not go through that layer, and those paths are exactly the ones nobody reviews.</p>

<h3>Four layers, four blind spots</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">The interface — zero security, real value</span><span class="lz-lnote">Hiding a button users may not press is good design and stops nothing: the request is one <code>curl</code> away. Build it, and never count it. Every rule the interface expresses must exist on the server independently.</span></div>
  <div class="lz-layer"><span class="lz-lname">Route middleware — catches capability, misses the object</span><span class="lz-lnote"><code>changeRole('post:xoa')</code> runs before the handler and answers "may this person delete posts in general". It cannot answer "may they delete <em>this</em> post", because it has not loaded it yet. Necessary, never sufficient.</span></div>
  <div class="lz-layer"><span class="lz-lname">The service layer — the right place for object rules</span><span class="lz-lnote">Load the object, call one decision function, act. Every caller — HTTP handler, background job, GraphQL resolver, CLI script — goes through the same function, which is the property route middleware lacks.</span></div>
  <div class="lz-layer"><span class="lz-lname">The data layer — the only one that cannot be bypassed</span><span class="lz-lnote">Ownership in the <code>WHERE</code> clause and RLS in the database (Lessons 9.1 and 9.4). It cannot express "may Mai publish this", but what it does express, it enforces against every connection that ever opens.</span></div>
</div>
<pre><code><span class="tok-comment">// Một hàm quyết định. Mọi đường gọi đều đi qua đúng nó.</span>
export function canDeletePost(u: User | null, post: Post): boolean {
  if (!u) return false;
  if (post.authorId === u.id) return true;
  return u.permission.has('post:xoa');
}

<span class="tok-comment">// Tầng dịch vụ — KHÔNG phải bộ xử lý HTTP.</span>
export async function deletePost(u: User, id: string) {
  const bv = await prisma.post.findUnique({ where: { id } });
  if (!bv) throw new NotFound();
  if (!canDeletePost(u, bv)) throw new NotFound();   <span class="tok-comment">// 404, không phải 403</span>
  await prisma.post.delete({ where: { id } });
}</code></pre>

<h3>The route is not the only door</h3>
<div class="out"># Dem THAT trong kho ma nay — bao nhieu noi co the cham vao cung mot bang:

  src/routes/       73 tep   <- di qua middleware phan quyen
  src/services/    115 tep   <- goi thang tu nhieu noi, khong middleware nao chay
  src/socket/        —       <- su kien realtime, khong co req cua Express
  scripts/         174 tep   <- chay tay, ket noi bang tai khoan migration
  prisma/seed.ts             <- gieo du lieu, bo qua moi tang ung dung

# Neu luat song trong middleware thi BON trong nam duong tren khong co no.
# Neu luat song trong tang dich vu thi ba duong dau co no, con hai duong
# cuoi — script chay tay va seed — van khong. Do la ly do can Lop 3 o Bai 9.4.</div>
<div class="pitfall">
<p><strong>Trap — mass assignment turns an ordinary update endpoint into privilege escalation.</strong> A handler that spreads the request body into an update lets the client write any column the model has: <code>PATCH /me { "ten": "Cường", "role": "admin" }</code> succeeds, and every authorization rule in this chapter was enforced correctly on an operation the user was genuinely allowed to perform. The fix is to allow-list fields explicitly — never <code>data: req.body</code>, always <code>data: { ten, anhDaiDien }</code> — and to validate with a schema that <em>strips</em> unknown keys rather than one that ignores them. Grep for <code>...req.body</code> across the codebase; it finds this class in one pass.</p>
</div>
<pre><code><span class="tok-comment">// SAI — client viết được MỌI cột mà model có:</span>
await prisma.user.update({ where: { id: u.id }, data: req.body });

<span class="tok-comment">// ĐÚNG — danh sách trắng tường minh, và schema CẮT BỎ khoá lạ:</span>
const { ten, anhDaiDien } = ZodHoSo.parse(req.body);   <span class="tok-comment">// .strict() để lỗi thay vì lờ đi</span>
await prisma.user.update({ where: { id: u.id }, data: { ten, anhDaiDien } });</code></pre>

<h3>Making forgetting a build error</h3>
<pre><code><span class="tok-comment">// Mỗi tuyến PHẢI khai một chính sách. Kiểu dữ liệu ép điều đó.</span>
type Policy =
  | { kiu: 'congKhai'; reason: string }        <span class="tok-comment">// công khai thì phải NÓI VÌ SAO</span>
  | { kiu: 'daDangNhap' }
  | { kiu: 'permission'; ma: MaQuyen };

function route(cs: Policy, ...handlers: RequestHandler[]) { <span class="tok-comment">/* … */</span> }

route({ kiu: 'congKhai', reason: 'danh sách khoá học hiển thị cho khách' },
      listCourses);
route({ kiu: 'permission', ma: 'post:xoa' }, deletePost);
<span class="tok-comment">// tuyen(layDanhSachKhoaHoc);   ← KHÔNG biên dịch được. Đó là toàn bộ ý tưởng.</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Deny by default, in the type system</span><span class="lz-t">Not in a code review</span><span class="lz-d">A route with no declared policy fails to compile. Lesson 9.1 measured 114 endpoints in this repository with no visible guard; with this shape, every one of them would carry a written reason instead of an unanswered question.</span></div>
  <div class="lz-step"><span class="lz-k">Public routes state their reason</span><span class="lz-t">The reason is the review</span><span class="lz-d">Forcing a <code>reason</code> string turns "no marking" into "somebody wrote a sentence a reviewer can disagree with". It costs nothing and converts an omission into a claim.</span></div>
  <div class="lz-step"><span class="lz-k">Enumerate the routes in a test</span><span class="lz-t">Catch what the types cannot</span><span class="lz-d">Walk the registered route table at startup and assert every entry has a policy. It also gives you a generated document of who can reach what — the page Lesson 9.1 asked you to write, kept current automatically.</span></div>
  <div class="lz-step"><span class="lz-k">One error shape for everything</span><span class="lz-t">404, uniformly</span><span class="lz-d">Whether the object does not exist, or exists and is forbidden, answer the same way. Anything else is the enumeration oracle from Lesson 6.4, rebuilt inside your authorization layer.</span></div>
</div>

<h3>The matrix test, run for real</h3>
<div class="out">endpoint                     khach thanhVien    tacGia kiemDuyet    keToan
GET  /bai-viet                 CHO       CHO       CHO       CHO       CHO
POST /bai-viet                chan       CHO       CHO       CHO       CHO
PATCH /bai-viet/:id           chan      chan       CHO       CHO      chan
DELETE /bai-viet/:id          chan      chan       CHO       CHO      chan
GET  /admin/doanh-thu         chan      chan      chan      chan       CHO

25 o, 0 o lech so voi bang mong doi.
TAT CA KHOP.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Assert the denials, not just the permissions</span><span class="v">Most test suites check that an admin can delete a post. Almost none check that a member cannot — and that is the half where the bugs are. Every cell of the grid is an assertion, including all twenty that say "chan".</span></div>
  <div class="kv"><span class="k">Write the expected grid by hand, first</span><span class="v">The table of expectations is the specification from Lesson 9.1, in executable form. Generating it from the implementation makes the test tautological: it will happily confirm whatever the bug does.</span></div>
  <div class="kv"><span class="k">Add a row when you add an endpoint</span><span class="v">A missing row should fail the test, not silently pass. Enumerate the policy registry inside the test so a new route with no grid entry is an error — the same trick as the type above, applied to coverage.</span></div>
  <div class="kv"><span class="k">Include the object-level cases</span><span class="v">"Author may edit their own post" and "author may not edit somebody else's" are different cells with the same role. Capability tests alone miss every IDOR in Lesson 9.1.</span></div>
</div>
<div class="note-ct">
<p><strong>Cache decisions for seconds, never for a session.</strong> A permission lookup on every request is one indexed join and almost always cheap enough — measure before optimising. When it genuinely is not, cache the computed permission set in Redis with a TTL of a few seconds and delete the key on any role change: the cost of a stale allow is someone keeping access they should have lost, which is Lesson 5.3's revocation window arriving in a new place. What you must not do is bake permissions into the session or the access token, where they survive until it expires and no revocation can reach them.</p>
</div>

<h3>Learning sources for this lesson</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">OWASP — automating authorization testing</span><span class="lc-sub">cheatsheetseries.owasp.org · The matrix approach, formalised</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📥</span><span class="lc-body"><span class="lc-title">OWASP — mass assignment</span><span class="lc-sub">cheatsheetseries.owasp.org · Allow-listing fields, and why strip beats ignore</span></span></a>
<a class="link-card" href="https://zod.dev/?id=strict" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">Zod — strict objects</span><span class="lc-sub">zod.dev · Failing on unknown keys instead of quietly dropping them</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">CuongThai course — TypeScript</span><span class="lc-sub">Discriminated unions, which is what makes the policy type refuse to compile</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Promote yourself to admin through a profile update, then allow-list the fields</span></span></a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.5</span>
<h2>Phép kiểm nằm ở đâu, và làm sao để KHÔNG THỂ quên</h2>
<p class="lead">Bài 9.2 tới 9.4 quyết định các luật LÀ GÌ. Bài này quyết định chúng CHẠY Ở ĐÂU — mà hoá ra điều đó quan trọng hơn, vì một cái luật đúng đặt nhầm tầng thì VẮNG MẶT ở mọi đường mã không đi qua tầng ấy, và những đường đó đúng là những đường chẳng ai review.</p>

<h3>Bốn tầng, bốn điểm mù</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Giao diện — con số không về bảo mật, giá trị thì thật</span><span class="lz-lnote">Ẩn một cái nút mà người dùng không được bấm là thiết kế tốt và chặn được con số không: request đó chỉ cách một câu <code>curl</code>. Cứ làm đi, nhưng đừng bao giờ TÍNH nó vào. Mọi luật mà giao diện thể hiện đều phải tồn tại độc lập ở máy chủ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Middleware trên tuyến — bắt được KHẢ NĂNG, bỏ sót ĐỐI TƯỢNG</span><span class="lz-lnote"><code>changeRole('post:xoa')</code> chạy trước bộ xử lý và trả lời câu "người này có được xoá bài viết nói chung không". Nó KHÔNG trả lời được câu "họ có được xoá <em>bài này</em> không", vì nó còn chưa nạp bài đó lên. Cần thiết, nhưng không bao giờ đủ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tầng dịch vụ — chỗ ĐÚNG cho luật theo đối tượng</span><span class="lz-lnote">Nạp đối tượng, gọi MỘT hàm quyết định, rồi hành động. Mọi bên gọi — bộ xử lý HTTP, công việc chạy nền, resolver GraphQL, script dòng lệnh — đều đi qua đúng cái hàm ấy, và đó là tính chất mà middleware trên tuyến không có.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tầng dữ liệu — tầng DUY NHẤT không đi vòng qua được</span><span class="lz-lnote">Quyền sở hữu nằm trong mệnh đề <code>WHERE</code> và RLS nằm trong cơ sở dữ liệu (Bài 9.1 và 9.4). Nó không diễn đạt được câu "Mai có được xuất bản cái này không", nhưng cái gì nó diễn đạt được thì nó THI HÀNH với mọi kết nối từng mở ra.</span></div>
</div>
<pre><code><span class="tok-comment">// Một hàm quyết định. Mọi đường gọi đều đi qua đúng nó.</span>
export function canDeletePost(u: User | null, post: Post): boolean {
  if (!u) return false;
  if (post.authorId === u.id) return true;
  return u.permission.has('post:xoa');
}

<span class="tok-comment">// Tầng dịch vụ — KHÔNG phải bộ xử lý HTTP.</span>
export async function deletePost(u: User, id: string) {
  const bv = await prisma.post.findUnique({ where: { id } });
  if (!bv) throw new NotFound();
  if (!canDeletePost(u, bv)) throw new NotFound();   <span class="tok-comment">// 404, không phải 403</span>
  await prisma.post.delete({ where: { id } });
}</code></pre>

<h3>Tuyến API KHÔNG phải cánh cửa duy nhất</h3>
<div class="out"># Dem THAT trong kho ma nay — bao nhieu noi co the cham vao cung mot bang:

  src/routes/       73 tep   <- di qua middleware phan quyen
  src/services/    115 tep   <- goi thang tu nhieu noi, khong middleware nao chay
  src/socket/        —       <- su kien realtime, khong co req cua Express
  scripts/         174 tep   <- chay tay, ket noi bang tai khoan migration
  prisma/seed.ts             <- gieo du lieu, bo qua moi tang ung dung

# Neu luat song trong middleware thi BON trong nam duong tren khong co no.
# Neu luat song trong tang dich vu thi ba duong dau co no, con hai duong
# cuoi — script chay tay va seed — van khong. Do la ly do can Lop 3 o Bai 9.4.</div>
<div class="pitfall">
<p><strong>Bẫy — gán hàng loạt biến một endpoint cập nhật bình thường thành một cú LEO THANG ĐẶC QUYỀN.</strong> Một bộ xử lý trải thẳng thân request vào lệnh cập nhật sẽ cho client ghi vào BẤT KỲ cột nào mà model có: <code>PATCH /me { "ten": "Cường", "role": "admin" }</code> thành công, và mọi luật phân quyền trong chương này đều đã được thi hành ĐÚNG trên một thao tác mà người dùng THẬT SỰ được phép làm. Cách vá là liệt kê trắng các trường một cách tường minh — đừng bao giờ <code>data: req.body</code>, luôn luôn <code>data: { ten, anhDaiDien }</code> — và kiểm bằng một schema <em>CẮT BỎ</em> khoá lạ chứ không phải lờ chúng đi. Hãy grep <code>...req.body</code> trên toàn kho mã; nó tìm ra cả họ lỗi này trong một lượt.</p>
</div>
<pre><code><span class="tok-comment">// SAI — client viết được MỌI cột mà model có:</span>
await prisma.user.update({ where: { id: u.id }, data: req.body });

<span class="tok-comment">// ĐÚNG — danh sách trắng tường minh, và schema CẮT BỎ khoá lạ:</span>
const { ten, anhDaiDien } = ZodHoSo.parse(req.body);   <span class="tok-comment">// .strict() để lỗi thay vì lờ đi</span>
await prisma.user.update({ where: { id: u.id }, data: { ten, anhDaiDien } });</code></pre>

<h3>Biến việc QUÊN thành một lỗi lúc dựng</h3>
<pre><code><span class="tok-comment">// Mỗi tuyến PHẢI khai một chính sách. Kiểu dữ liệu ép điều đó.</span>
type Policy =
  | { kiu: 'congKhai'; reason: string }        <span class="tok-comment">// công khai thì phải NÓI VÌ SAO</span>
  | { kiu: 'daDangNhap' }
  | { kiu: 'permission'; ma: MaQuyen };

function route(cs: Policy, ...handlers: RequestHandler[]) { <span class="tok-comment">/* … */</span> }

route({ kiu: 'congKhai', reason: 'danh sách khoá học hiển thị cho khách' },
      listCourses);
route({ kiu: 'permission', ma: 'post:xoa' }, deletePost);
<span class="tok-comment">// tuyen(layDanhSachKhoaHoc);   ← KHÔNG biên dịch được. Đó là toàn bộ ý tưởng.</span></code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Mặc định TỪ CHỐI, ngay trong hệ kiểu</span><span class="lz-t">Không phải trong một buổi review</span><span class="lz-d">Một tuyến không khai chính sách thì không biên dịch được. Bài 9.1 đã đo được 114 endpoint trong kho mã này không có lớp chắn nào nhìn thấy được; với hình dạng này thì mỗi cái trong số đó sẽ mang theo một LÝ DO viết thành chữ thay vì một câu hỏi không lời đáp.</span></div>
  <div class="lz-step"><span class="lz-k">Tuyến công khai phải NÊU lý do</span><span class="lz-t">Cái lý do CHÍNH LÀ phần review</span><span class="lz-d">Bắt buộc phải có một chuỗi <code>reason</code> biến "không đánh dấu gì" thành "có người đã viết một câu mà người review có thể phản đối". Nó chẳng tốn gì và biến một sự thiếu sót thành một lời khẳng định.</span></div>
  <div class="lz-step"><span class="lz-k">Duyệt hết các tuyến trong một bài kiểm thử</span><span class="lz-t">Bắt cái mà hệ kiểu không bắt nổi</span><span class="lz-d">Hãy đi qua bảng tuyến đã đăng ký lúc khởi động và khẳng định mọi mục đều có chính sách. Nó còn cho bạn một tài liệu SINH RA TỰ ĐỘNG về việc ai với tới được cái gì — đúng cái trang mà Bài 9.1 bảo bạn viết, và luôn được cập nhật.</span></div>
  <div class="lz-step"><span class="lz-k">MỘT hình dạng lỗi cho tất cả</span><span class="lz-t">404, đồng nhất</span><span class="lz-d">Dù đối tượng không tồn tại, hay tồn tại mà bị cấm, hãy trả lời y hệt nhau. Bất cứ thứ gì khác đều là cái máy trả lời cho việc dò ở Bài 6.4, được dựng lại ngay bên trong tầng phân quyền của bạn.</span></div>
</div>

<h3>Bảng kiểm phân quyền, chạy thật</h3>
<div class="out">endpoint                     khach thanhVien    tacGia kiemDuyet    keToan
GET  /bai-viet                 CHO       CHO       CHO       CHO       CHO
POST /bai-viet                chan       CHO       CHO       CHO       CHO
PATCH /bai-viet/:id           chan      chan       CHO       CHO      chan
DELETE /bai-viet/:id          chan      chan       CHO       CHO      chan
GET  /admin/doanh-thu         chan      chan      chan      chan       CHO

25 o, 0 o lech so voi bang mong doi.
TAT CA KHOP.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Khẳng định cả những lần TỪ CHỐI, đừng chỉ khẳng định lần cho phép</span><span class="v">Phần lớn bộ kiểm thử đều kiểm rằng một quản trị viên xoá được bài viết. Gần như không bộ nào kiểm rằng một thành viên thì KHÔNG — mà đó mới là nửa chứa các con lỗi. Mỗi ô trong bảng là một phép khẳng định, kể cả cả hai mươi ô ghi "chan".</span></div>
  <div class="kv"><span class="k">Viết bảng mong đợi BẰNG TAY, trước đã</span><span class="v">Cái bảng kỳ vọng ấy chính là bản đặc tả ở Bài 9.1, dưới dạng chạy được. Sinh nó ra TỪ bản cài đặt sẽ làm bài kiểm thử thành lặp thừa: nó sẽ vui vẻ xác nhận đúng cái mà con lỗi đang làm.</span></div>
  <div class="kv"><span class="k">Thêm endpoint thì thêm một dòng</span><span class="v">Thiếu một dòng thì phải làm HỎNG bài kiểm thử, chứ không phải lặng lẽ qua. Hãy duyệt bảng đăng ký chính sách ngay bên trong bài kiểm thử để một tuyến mới không có ô nào trong bảng là một lỗi — đúng cái mẹo với hệ kiểu ở trên, áp cho độ phủ.</span></div>
  <div class="kv"><span class="k">Nhớ đưa cả các ca ở MỨC ĐỐI TƯỢNG vào</span><span class="v">"Tác giả được sửa bài của CHÍNH MÌNH" và "tác giả KHÔNG được sửa bài của người khác" là hai ô khác nhau với cùng một vai. Chỉ kiểm khả năng thôi thì bỏ sót MỌI cú IDOR ở Bài 9.1.</span></div>
</div>
<div class="note-ct">
<p><strong>Cache quyết định theo GIÂY, đừng bao giờ theo phiên.</strong> Một phép tra quyền ở mọi request là một phép nối có chỉ mục và gần như luôn đủ rẻ — hãy ĐO trước khi đi tối ưu. Khi nó thật sự không rẻ thì hãy cache tập quyền đã tính vào Redis với TTL vài giây và XOÁ khoá đó ngay khi có bất kỳ thay đổi vai trò nào: cái giá của một lần "cho phép" bị cũ là ai đó giữ được quyền lẽ ra đã mất, tức là cửa sổ thu hồi ở Bài 5.3 xuất hiện ở một chỗ mới. Cái bạn TUYỆT ĐỐI không được làm là nướng quyền vào phiên hay vào access token, nơi chúng sống tới khi hết hạn và không lệnh thu hồi nào với tới được.</p>
</div>

<h3>Nguồn học cho bài này</h3>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Testing_Automation_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">OWASP — tự động hoá kiểm thử phân quyền</span><span class="lc-sub">cheatsheetseries.owasp.org · Cách tiếp cận bằng bảng kiểm, viết thành quy trình</span></span></a>
<a class="link-card" href="https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html" target="_blank" rel="noopener"><span class="lc-ico">📥</span><span class="lc-body"><span class="lc-title">OWASP — gán hàng loạt</span><span class="lc-sub">cheatsheetseries.owasp.org · Liệt kê trắng các trường, và vì sao CẮT BỎ hơn là lờ đi</span></span></a>
<a class="link-card" href="https://zod.dev/?id=strict" target="_blank" rel="noopener"><span class="lc-ico">🛡️</span><span class="lc-body"><span class="lc-title">Zod — đối tượng nghiêm ngặt</span><span class="lc-sub">zod.dev · Báo lỗi khi gặp khoá lạ thay vì lặng lẽ bỏ chúng đi</span></span></a>
<a class="link-card" href="/courses/typescript/learn${REF}"><span class="lc-ico">🔷</span><span class="lc-body"><span class="lc-title">Khoá CuongThai — TypeScript</span><span class="lc-sub">Union phân biệt được, thứ làm cho cái kiểu chính sách kia từ chối biên dịch</span></span></a>
<a class="link-card codelab" href="/code-lab/tracks/authentication${REF}"><span class="lc-ico">🧪</span><span class="lc-body"><span class="lc-title">Code Lab — track "Authentication"</span><span class="lc-sub">Tự thăng mình lên admin qua một lệnh cập nhật hồ sơ, rồi liệt kê trắng các trường</span></span></a>
</div>
`,
    },

    /* ─────────────────────────── 9.6 ─────────────────────────── */
    {
      title: 'Quiz: authorization models|||Quiz: mô hình phân quyền',
      slug: 'auth-9-6-quiz',
      type: 'QUIZ',
      description: 'Tám câu về IDOR, mặc định từ chối, RBAC với ReBAC, ranh giới tenant, Row-Level Security, và gán hàng loạt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.6</span>
<h2>Quiz: authorization models</h2>
<p class="lead">Eight questions. None of them involve cryptography — which is the point of the chapter: this is the vulnerability class where every algorithm is perfect and the data still walks out.</p>
<div class="callout">
<p><strong>What this chapter established.</strong> Access control fails by omission, not by broken maths — put ownership in the <code>WHERE</code> clause, answer <code>404</code> rather than <code>403</code>, and deny by default (9.1). Booleans become forty booleans, so use roles with a many-to-many table, and check <em>permissions</em> in code rather than role names (9.2). Roles describe a person and cannot express "may Cường edit document 42" — relationships can, in both directions, but the naive graph walk is a performance cliff (9.3). In a multi-tenant product the tenant comes from the session, a data layer injects the filter, and row-level security is the last word — except for owners and superusers, who bypass it silently (9.4). A rule in route middleware is absent from every other door, so it belongs in the service layer with one decision function, forgetting must be a build error, and the matrix test asserts the denials too (9.5).</p>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.6</span>
<h2>Quiz: mô hình phân quyền</h2>
<p class="lead">Tám câu. Không câu nào dính tới mật mã — và đó chính là ý của cả chương: đây là họ lỗ hổng mà mọi thuật toán đều hoàn hảo còn dữ liệu thì vẫn đi ra ngoài.</p>
<div class="callout">
<p><strong>Chương này đã xác lập điều gì.</strong> Kiểm soát truy cập hỏng vì THIẾU SÓT, không phải vì toán vỡ — hãy đặt quyền sở hữu vào mệnh đề <code>WHERE</code>, trả <code>404</code> thay vì <code>403</code>, và mặc định TỪ CHỐI (9.1). Boolean rồi sẽ thành bốn mươi boolean, nên hãy dùng vai trò với một bảng nhiều-nhiều, và trong mã thì kiểm <em>QUYỀN</em> chứ đừng kiểm tên vai (9.2). Vai trò mô tả một con người và không diễn đạt nổi câu "Cường có được sửa tài liệu 42 không" — quan hệ thì diễn đạt được, theo cả hai chiều, nhưng phép duyệt đồ thị ngây thơ là một vực hiệu năng (9.3). Trong sản phẩm nhiều tenant, tenant tới từ PHIÊN, một tầng dữ liệu tự chèn bộ lọc, và row-level security là tiếng nói cuối cùng — trừ với chủ bảng và siêu người dùng, những vai đi vòng qua nó trong im lặng (9.4). Một cái luật nằm trong middleware của tuyến thì VẮNG MẶT ở mọi cánh cửa khác, nên nó thuộc về tầng dịch vụ với một hàm quyết định duy nhất, việc quên phải là một lỗi lúc dựng, và bảng kiểm phải khẳng định cả những lần TỪ CHỐI (9.5).</p>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'An authenticated endpoint fetches an invoice by the id in the URL and returns it. What is the fix?|||Một endpoint đã có xác thực lấy hoá đơn theo id trên URL rồi trả về. Cách vá là gì?',
            options: [
              'Use UUIDs so the ids cannot be guessed|||Dùng UUID để id không đoán được',
              'Put the ownership condition in the query itself, so the row simply cannot be returned to another user, and answer 404 rather than 403|||Đặt điều kiện SỞ HỮU vào chính câu truy vấn, để bản ghi đơn giản là KHÔNG THỂ trả về cho người dùng khác, và đáp 404 chứ không phải 403',
              'Add rate limiting to the endpoint|||Thêm giới hạn tần suất cho endpoint đó',
              'Check the role in middleware before the handler|||Kiểm vai trò trong middleware trước bộ xử lý',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why answer 404 instead of 403 for a resource that exists but is forbidden?|||Vì sao trả 404 thay vì 403 cho một tài nguyên CÓ TỒN TẠI nhưng bị cấm?',
            options: [
              'Because 403 is not a valid status for this case|||Vì 403 không phải mã trạng thái hợp lệ cho tình huống này',
              'Because 403 confirms the record exists, turning the endpoint into an enumeration oracle that maps your ids without reading a single one|||Vì 403 XÁC NHẬN rằng bản ghi có tồn tại, biến endpoint thành một cái máy trả lời cho việc dò, lập được bản đồ id của bạn mà không cần đọc lấy một bản ghi',
              'Because 404 is faster to return|||Vì trả 404 thì nhanh hơn',
              'Because browsers cache 403 responses|||Vì trình duyệt cache các phản hồi 403',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why should handlers check permissions rather than role names?|||Vì sao bộ xử lý nên kiểm QUYỀN thay vì kiểm TÊN VAI TRÒ?',
            options: [
              'Because permission strings are shorter|||Vì chuỗi quyền thì ngắn hơn',
              'Because a role-name check must be found and edited everywhere when a role is added, and nobody can list what a role does without reading the whole codebase — permissions make roles pure data|||Vì phép kiểm theo tên vai phải đi tìm và sửa ở KHẮP NƠI mỗi khi thêm một vai, và không ai liệt kê nổi một vai làm được gì nếu không đọc hết kho mã — kiểm theo quyền biến vai trò thành DỮ LIỆU thuần tuý',
              'Because roles cannot be indexed in the database|||Vì vai trò không đánh chỉ mục được trong cơ sở dữ liệu',
              'Because permissions are checked faster|||Vì kiểm quyền thì nhanh hơn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Somebody proposes a role called editor_of_project_42. What does that indicate?|||Có người đề xuất một vai trò tên là bien_tap_du_an_42. Điều đó cho thấy gì?',
            options: [
              'A naming convention problem|||Một vấn đề về quy ước đặt tên',
              'RBAC has run out: the rule is about a relationship between a user and one object, which needs relationship tuples rather than a role table that grows with your data|||RBAC đã hết đất: cái luật này nói về QUAN HỆ giữa một người dùng và MỘT đối tượng, thứ cần các bộ ba quan hệ chứ không phải một bảng vai trò phình ra theo dữ liệu',
              'The role should be renamed to project_editor|||Nên đổi tên vai thành bien_tap_du_an',
              'The project id should be a permission instead|||Nên biến id dự án thành một cái quyền thì hơn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In a multi-tenant app, where must the tenant identifier come from?|||Trong một ứng dụng nhiều tenant, định danh tenant BẮT BUỘC phải tới từ đâu?',
            options: [
              'A request header, so the client can switch workspaces|||Một header của request, để client chuyển được không gian làm việc',
              'The server-side session — never a query parameter, header or body field, because otherwise the entire boundary is a value the attacker types|||Từ PHIÊN ở phía máy chủ — không bao giờ từ tham số truy vấn, header hay trường trong thân request, vì nếu không thì cả cái ranh giới ấy chỉ là một giá trị kẻ tấn công tự gõ vào',
              'A signed cookie set by the client|||Một cookie đã ký do client đặt',
              'The subdomain, which cannot be forged|||Tên miền con, thứ không giả mạo được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You enable RLS, write a correct policy, and nothing is enforced. Why?|||Bạn bật RLS, viết một chính sách đúng, mà chẳng có gì được thi hành. Vì sao?',
            options: [
              'The policy needs an index to take effect|||Chính sách cần một chỉ mục thì mới có hiệu lực',
              'The application connects as the table owner or a superuser: owners bypass their own policies without FORCE, and superusers bypass them unconditionally — run the app as a separate non-owner, non-superuser role|||Ứng dụng kết nối bằng chính CHỦ BẢNG hoặc bằng SIÊU NGƯỜI DÙNG: chủ bảng đi vòng qua chính sách của mình khi chưa có FORCE, còn siêu người dùng thì đi vòng qua VÔ ĐIỀU KIỆN — hãy chạy ứng dụng bằng một vai riêng, không sở hữu bảng và không siêu người dùng',
              'RLS only applies to SELECT, not to UPDATE|||RLS chỉ áp cho SELECT chứ không áp cho UPDATE',
              'The policy must be created before the table has rows|||Phải tạo chính sách trước khi bảng có dữ liệu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why use SET LOCAL rather than SET for the tenant variable?|||Vì sao nên dùng SET LOCAL thay vì SET cho cái biến tenant?',
            options: [
              'SET LOCAL is faster|||SET LOCAL thì nhanh hơn',
              'A plain SET persists on the pooled connection and leaks into the next request that borrows it — a tenant leak created by the defence itself; SET LOCAL is scoped to the transaction|||Một câu SET thường sẽ ở lại trên kết nối trong bể và rò sang request kế tiếp mượn nó — một cú rò tenant do CHÍNH hàng phòng thủ tạo ra; còn SET LOCAL thì giới hạn trong giao dịch',
              'SET is not permitted inside a transaction|||SET không được phép dùng bên trong một giao dịch',
              'SET LOCAL survives a connection reset|||SET LOCAL sống sót qua một lần đặt lại kết nối',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A profile endpoint does update({ data: req.body }). A user sends { role: "admin" }. What class of bug is this?|||Một endpoint hồ sơ chạy update({ data: req.body }). Một người dùng gửi { vaiTro: "admin" }. Đây là họ lỗi nào?',
            options: [
              'A validation bug, fixed by checking the role value|||Một lỗi kiểm tính hợp lệ, vá bằng cách kiểm giá trị vai trò',
              'Mass assignment — privilege escalation through an operation the user was genuinely allowed to perform; allow-list the fields and use a schema that strips unknown keys|||GÁN HÀNG LOẠT — leo thang đặc quyền thông qua một thao tác mà người dùng THẬT SỰ được phép làm; hãy liệt kê trắng các trường và dùng schema CẮT BỎ khoá lạ',
              'An IDOR, fixed by scoping the query|||Một cú IDOR, vá bằng cách giới hạn phạm vi truy vấn',
              'Not a bug if the role column is indexed|||Không phải lỗi, nếu cột vai trò đã được đánh chỉ mục',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
