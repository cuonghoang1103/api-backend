/**
 * Git & GitHub — Chương 7: Quy trình nhóm, tag & phát hành.
 * Ba chiến lược nhánh · tag và đánh phiên bản ngữ nghĩa · changelog, nhánh phát hành, hotfix
 * · nhịp làm việc hằng ngày + cờ tính năng · quiz.
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 7 — Team workflows, tags & releases|||Chương 7 — Quy trình nhóm, tag & phát hành',
  description: 'Cách một nhóm sắp xếp nhánh, đánh dấu phiên bản và đưa mã ra production. Ba chiến lược nhánh phổ biến và chiến lược nào hợp với nhóm nào, tag và semantic versioning, changelog tự sinh, nhánh phát hành và hotfix, và cách giữ nhánh ngắn ngày bằng cờ tính năng.',
  lessons: [
    /* ─────────────────────────── 7.1 ─────────────────────────── */
    {
      title: '7.1 — Branching strategies: trunk-based, GitHub flow, git-flow|||7.1 — Chiến lược nhánh: trunk-based, GitHub flow, git-flow',
      slug: 'git-7-1-chien-luoc-nhanh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba mô hình nhánh, mô hình nào giải quyết vấn đề gì, vì sao git-flow bị dùng sai chỗ nhiều nhất, và cách chọn theo cách bạn phát hành chứ không theo cách bạn viết mã.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Choose by how you release, not by how you code</h2>
<p class="lead">Branching strategy arguments last for years because people compare the diagrams instead of the constraint each one was built for. All three below are correct — for different release models. Identify your release model first and the choice makes itself.</p>

<h3>GitHub flow — one long-lived branch</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Branch from main</div><div class="lz-d">One branch per change, named for the change.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Open a pull request</div><div class="lz-d">Review, CI, discussion.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Merge to main</div><div class="lz-d">main is always deployable.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Deploy</div><div class="lz-d">Immediately, or on a schedule from main.</div></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Fits</span><span class="v">Web applications and services where you control deployment and there is exactly one live version. This is the model for cuongthai.com.</span></div>
  <div class="kv"><span class="k">Requires</span><span class="v">Good CI, branch protection, and small branches. Without those, "main is always deployable" becomes a slogan rather than a fact.</span></div>
  <div class="kv"><span class="k">Does not fit</span><span class="v">Shipping software where customers run several versions at once and you must patch 2.3 while 3.0 is in development.</span></div>
</div>

<h3>Trunk-based development — GitHub flow, taken further</h3>
<p>Same shape, stricter discipline: branches live <strong>hours, not days</strong>, and everyone integrates into <code>main</code> at least daily. Work too big for a day ships <em>behind a feature flag</em> rather than on a long branch.</p>
<pre><code><span class="tok-comment">// The unfinished feature is on main, merged, and switched off.</span>
<span class="tok-keyword">if</span> (flags.newCheckout) {
  <span class="tok-keyword">return</span> renderNewCheckout();
}
<span class="tok-keyword">return</span> renderLegacyCheckout();</code></pre>
<div class="callout ok">The point is not speed for its own sake. Merge pain grows super-linearly with branch age (3.2), so a team that integrates daily spends almost no time on conflicts, while a team with two-week branches spends a day per merge. Feature flags convert a branching problem into a runtime one, which is far easier to reason about — and gives you an off switch in production.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Fits</span><span class="v">Teams with strong automated tests and the ability to deploy often. The default at most large web companies.</span></div>
  <div class="kv"><span class="k">Requires</span><span class="v">Real test coverage and flag hygiene — every flag needs an owner and a removal date, or you accumulate hundreds of dead branches in code.</span></div>
</div>

<h3>git-flow — two long-lived branches plus release branches</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">main</span><span class="lz-v">Only ever holds released versions. Every commit is tagged.</span></div>
  <div class="lz-layer"><span class="lz-k">develop</span><span class="lz-v">Where features land. Ahead of main between releases.</span></div>
  <div class="lz-layer"><span class="lz-k">feature/*</span><span class="lz-v">Branch from develop, merge back to develop.</span></div>
  <div class="lz-layer"><span class="lz-k">release/*</span><span class="lz-v">Cut from develop to stabilise a version. Only fixes land here; then it merges to both main and develop.</span></div>
  <div class="lz-layer"><span class="lz-k">hotfix/*</span><span class="lz-v">Branch from main to fix production, then merge to both main and develop.</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Fits</span><span class="v">Versioned software with a real release cycle: desktop applications, mobile releases gated by store review, libraries with supported older versions.</span></div>
  <div class="kv"><span class="k">Costs</span><span class="v">Two long-lived branches to keep in sync, and every hotfix must be merged twice. Forget the second merge and the bug returns in the next release — the single most common git-flow failure.</span></div>
</div>
<div class="callout warn">git-flow is the most <em>mis</em>applied model in this lesson. Its author has since noted that it was designed for versioned, shipped software and that continuously-delivered web applications usually want something simpler. If you deploy from <code>main</code> several times a week, <code>develop</code> is a second branch to keep in sync for no benefit.</div>

<h3>Choosing, in three questions</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Is more than one version live?</div><div class="lz-d">Yes → you need release branches (git-flow or a variant). No → continue.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Can you deploy any day?</div><div class="lz-d">Yes → GitHub flow. Blocked by store review or a release window → keep a release branch.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Do you have solid tests and flags?</div><div class="lz-d">Yes → trunk-based. Not yet → GitHub flow with slightly longer branches, and build the tests.</div></div>
</div>

<h3>Naming, whichever model you pick</h3>
<pre><code>feature/user-profile        <span class="tok-comment"># new functionality</span>
fix/login-500               <span class="tok-comment"># bug fix, named for the symptom</span>
hotfix/payment-timeout      <span class="tok-comment"># urgent production fix</span>
chore/bump-prisma           <span class="tok-comment"># maintenance</span>
release/1.5.0               <span class="tok-comment"># stabilising a version</span>
an/spike-webgl              <span class="tok-comment"># personal scratch, initials-prefixed</span></code></pre>
<p>Consistency matters more than the exact scheme: it makes <code>git branch --list 'fix/*'</code> useful, it groups branches in GitHub's UI, and it lets CI apply different rules by prefix.</p>

<h3>The CuongThai model, as a worked example</h3>
<p>cuongthai.com uses GitHub flow with one deliberate twist: <strong>a push to <code>main</code> does not deploy</strong>. Deployment is a script somebody runs, after testing. That separation exists because two deploy workflows once triggered on every push and raced each other into real outages. The lesson generalises: your branching model and your <em>deployment trigger</em> are two decisions, and coupling them tightly is how a Git operation turns into an incident.</p>

<a class="link-card" href="https://docs.github.com/en/get-started/using-github/github-flow" target="_blank" rel="noopener">
  <span class="lc-ico">🌊</span>
  <span class="lc-body"><span class="lc-title">GitHub flow — the official description</span><span class="lc-sub">Short, and the model most web teams should start from.</span></span>
</a>
<a class="link-card" href="https://nvie.com/posts/a-successful-git-branching-model/" target="_blank" rel="noopener">
  <span class="lc-ico">🌿</span>
  <span class="lc-body"><span class="lc-title">git-flow — the original 2010 post, with its 2020 note of caution</span><span class="lc-sub">Read the note at the top: the author says web apps usually want something simpler.</span></span>
</a>
<a class="link-card" href="https://trunkbaseddevelopment.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🌳</span>
  <span class="lc-body"><span class="lc-title">trunkbaseddevelopment.com</span><span class="lc-sub">Short-lived branches, feature flags, and how to scale it to large teams.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> adopting git-flow because it looks thorough, then discovering nobody merges hotfixes back into <code>develop</code>. The fix reaches production, the next release is cut from <code>develop</code>, and the bug you fixed in March returns in April — with everyone certain it was fixed. If you use git-flow, automate the back-merge or add it to a release checklist; human memory is not a mechanism.</div>
<p class="note-ct"><strong>The rule that outlives every model:</strong> whatever you choose, keep branches short. Every strategy works with one-day branches and every strategy suffers with three-week ones. The strategy determines the shape of the graph; branch lifetime determines how much of your week goes to merging.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Chọn theo cách bạn PHÁT HÀNH, không theo cách bạn viết mã</h2>
<p class="lead">Các cuộc tranh cãi về chiến lược nhánh kéo dài nhiều năm vì người ta so sánh mấy cái sơ đồ thay vì so ràng buộc mà mỗi mô hình được dựng lên để giải. Cả ba mô hình dưới đây đều đúng — cho những mô hình phát hành khác nhau. Hãy xác định mô hình phát hành của bạn trước rồi lựa chọn tự nó lộ ra.</p>

<h3>GitHub flow — một nhánh sống lâu duy nhất</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Rẽ nhánh từ main</div><div class="lz-d">Mỗi thay đổi một nhánh, đặt tên theo thay đổi đó.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Mở pull request</div><div class="lz-d">Review, CI, thảo luận.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Merge vào main</div><div class="lz-d">main lúc nào cũng deploy được.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Deploy</div><div class="lz-d">Ngay lập tức, hoặc theo lịch, từ main.</div></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hợp với</span><span class="v">Ứng dụng web và dịch vụ mà bạn kiểm soát việc triển khai và chỉ có đúng một phiên bản đang chạy. Đây là mô hình của cuongthai.com.</span></div>
  <div class="kv"><span class="k">Đòi hỏi</span><span class="v">CI tốt, bảo vệ nhánh, và nhánh nhỏ. Thiếu những thứ đó thì "main lúc nào cũng deploy được" thành một khẩu hiệu chứ không phải một sự thật.</span></div>
  <div class="kv"><span class="k">Không hợp với</span><span class="v">Phần mềm giao cho khách mà khách chạy nhiều phiên bản cùng lúc và bạn phải vá bản 2.3 trong khi 3.0 đang phát triển.</span></div>
</div>

<h3>Trunk-based development — GitHub flow, đẩy xa hơn</h3>
<p>Cùng hình dạng, kỷ luật khắt khe hơn: nhánh sống <strong>vài giờ, không phải vài ngày</strong>, và mọi người tích hợp vào <code>main</code> ít nhất mỗi ngày một lần. Phần việc quá lớn cho một ngày thì lên production <em>sau một cờ tính năng</em> chứ không nằm trên một nhánh dài ngày.</p>
<pre><code><span class="tok-comment">// Tính năng chưa xong đã nằm trên main, đã merge, và đang tắt.</span>
<span class="tok-keyword">if</span> (flags.newCheckout) {
  <span class="tok-keyword">return</span> renderNewCheckout();
}
<span class="tok-keyword">return</span> renderLegacyCheckout();</code></pre>
<div class="callout ok">Vấn đề không phải là nhanh cho có. Nỗi đau khi merge tăng theo cấp trên tuyến tính với tuổi của nhánh (bài 3.2), nên một nhóm tích hợp hằng ngày gần như không tốn thời gian cho xung đột, còn một nhóm có nhánh hai tuần thì tốn cả ngày cho mỗi lần merge. Cờ tính năng biến một bài toán về nhánh thành một bài toán ở thời điểm chạy, dễ suy luận hơn nhiều — và cho bạn một cái công tắc tắt ngay trên production.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hợp với</span><span class="v">Nhóm có bộ test tự động mạnh và khả năng deploy thường xuyên. Mặc định ở phần lớn công ty web lớn.</span></div>
  <div class="kv"><span class="k">Đòi hỏi</span><span class="v">Độ phủ test thật và kỷ luật về cờ — mỗi cờ cần một người chịu trách nhiệm và một ngày gỡ bỏ, nếu không bạn tích luỹ hàng trăm nhánh chết ngay trong mã.</span></div>
</div>

<h3>git-flow — hai nhánh sống lâu cộng các nhánh phát hành</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">main</span><span class="lz-v">Chỉ giữ những phiên bản đã phát hành. Mọi commit đều được gắn tag.</span></div>
  <div class="lz-layer"><span class="lz-k">develop</span><span class="lz-v">Nơi các tính năng đáp xuống. Đi trước main giữa hai lần phát hành.</span></div>
  <div class="lz-layer"><span class="lz-k">feature/*</span><span class="lz-v">Rẽ từ develop, merge về develop.</span></div>
  <div class="lz-layer"><span class="lz-k">release/*</span><span class="lz-v">Cắt ra từ develop để ổn định một phiên bản. Chỉ bản vá đáp xuống đây; rồi nó merge vào CẢ main lẫn develop.</span></div>
  <div class="lz-layer"><span class="lz-k">hotfix/*</span><span class="lz-v">Rẽ từ main để vá production, rồi merge vào CẢ main lẫn develop.</span></div>
</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hợp với</span><span class="v">Phần mềm có phiên bản và có chu kỳ phát hành thật: ứng dụng desktop, bản phát hành di động bị chặn bởi khâu duyệt của cửa hàng, thư viện còn hỗ trợ các bản cũ.</span></div>
  <div class="kv"><span class="k">Cái giá</span><span class="v">Hai nhánh sống lâu phải giữ đồng bộ, và mọi hotfix phải merge hai lần. Quên lần merge thứ hai là con lỗi quay lại ở bản phát hành kế tiếp — thất bại phổ biến nhất của git-flow.</span></div>
</div>
<div class="callout warn">git-flow là mô hình bị <em>áp dụng SAI CHỖ</em> nhiều nhất trong bài này. Chính tác giả của nó về sau đã ghi chú rằng nó được thiết kế cho phần mềm có phiên bản, giao cho khách, và rằng các ứng dụng web giao liên tục thường muốn thứ gì đó đơn giản hơn. Nếu bạn deploy từ <code>main</code> vài lần một tuần thì <code>develop</code> chỉ là một nhánh thứ hai phải giữ đồng bộ mà chẳng được lợi gì.</div>

<h3>Chọn, qua ba câu hỏi</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Có nhiều hơn một phiên bản đang chạy không?</div><div class="lz-d">Có → bạn cần nhánh phát hành (git-flow hoặc một biến thể). Không → đi tiếp.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Ngày nào bạn cũng deploy được không?</div><div class="lz-d">Được → GitHub flow. Bị chặn bởi khâu duyệt của cửa hàng hay một cửa sổ phát hành → giữ một nhánh phát hành.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Bạn có bộ test chắc và cờ tính năng chưa?</div><div class="lz-d">Có → trunk-based. Chưa → GitHub flow với nhánh dài hơn một chút, và hãy xây bộ test.</div></div>
</div>

<h3>Đặt tên, dù bạn chọn mô hình nào</h3>
<pre><code>feature/user-profile        <span class="tok-comment"># chức năng mới</span>
fix/login-500               <span class="tok-comment"># sửa lỗi, đặt tên theo triệu chứng</span>
hotfix/payment-timeout      <span class="tok-comment"># vá production khẩn</span>
chore/bump-prisma           <span class="tok-comment"># bảo trì</span>
release/1.5.0               <span class="tok-comment"># đang ổn định một phiên bản</span>
an/spike-webgl              <span class="tok-comment"># nháp cá nhân, gắn tiền tố tên viết tắt</span></code></pre>
<p>Sự nhất quán quan trọng hơn chính cái quy ước: nó làm cho <code>git branch --list 'fix/*'</code> có ích, nó gom nhánh lại trong giao diện GitHub, và nó cho phép CI áp luật khác nhau theo tiền tố.</p>

<h3>Mô hình của CuongThai, như một ví dụ chạy thật</h3>
<p>cuongthai.com dùng GitHub flow với một điểm xoắn có chủ ý: <strong>một lần push vào <code>main</code> KHÔNG deploy</strong>. Triển khai là một script do người chạy, sau khi đã test. Sự tách bạch đó tồn tại vì đã từng có hai workflow deploy kích hoạt ở mọi lần push và đua nhau tới mức gây sự cố thật. Bài học khái quát được: mô hình nhánh và <em>cơ chế kích hoạt deploy</em> là hai quyết định, và ghép chặt chúng lại là cách một thao tác Git biến thành một sự cố.</p>

<a class="link-card" href="https://docs.github.com/en/get-started/using-github/github-flow" target="_blank" rel="noopener">
  <span class="lc-ico">🌊</span>
  <span class="lc-body"><span class="lc-title">GitHub flow — mô tả chính thức</span><span class="lc-sub">Ngắn, và là mô hình mà đa số nhóm web nên bắt đầu từ đó.</span></span>
</a>
<a class="link-card" href="https://nvie.com/posts/a-successful-git-branching-model/" target="_blank" rel="noopener">
  <span class="lc-ico">🌿</span>
  <span class="lc-body"><span class="lc-title">git-flow — bài gốc năm 2010, kèm ghi chú thận trọng năm 2020</span><span class="lc-sub">Hãy đọc phần ghi chú ở đầu bài: tác giả nói ứng dụng web thường muốn thứ đơn giản hơn.</span></span>
</a>
<a class="link-card" href="https://trunkbaseddevelopment.com/" target="_blank" rel="noopener">
  <span class="lc-ico">🌳</span>
  <span class="lc-body"><span class="lc-title">trunkbaseddevelopment.com</span><span class="lc-sub">Nhánh sống ngắn, cờ tính năng, và cách mở rộng nó cho nhóm lớn.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> chọn git-flow vì nó trông chỉn chu, rồi phát hiện chẳng ai merge hotfix ngược về <code>develop</code>. Bản vá lên tới production, bản phát hành kế tiếp được cắt ra từ <code>develop</code>, và con lỗi bạn vá hồi tháng Ba quay lại vào tháng Tư — với việc mọi người đều chắc chắn là nó đã được vá. Nếu bạn dùng git-flow, hãy tự động hoá lần merge ngược hoặc đưa nó vào danh sách kiểm phát hành; trí nhớ con người không phải một cơ chế.</div>
<p class="note-ct"><strong>Luật sống lâu hơn mọi mô hình:</strong> chọn gì thì chọn, hãy giữ nhánh ngắn ngày. Mọi chiến lược đều chạy tốt với nhánh một ngày và mọi chiến lược đều khổ sở với nhánh ba tuần. Chiến lược quyết định hình dạng đồ thị; tuổi thọ của nhánh quyết định bao nhiêu phần tuần làm việc của bạn đi vào việc merge.</p>
</div>
`,
    },

    /* ─────────────────────────── 7.2 ─────────────────────────── */
    {
      title: '7.2 — Tags & semantic versioning|||7.2 — Tag & đánh phiên bản ngữ nghĩa',
      slug: 'git-7-2-tag-semver',
      type: 'LESSON',
      description: 'Tag nhẹ vs tag có chú thích và vì sao khác biệt đó quan trọng, semantic versioning từng con số, git describe, đặt tag cho một commit quá khứ, và sửa một tag đã đẩy sai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>A permanent name for one commit</h2>
<p class="lead">A branch is a pointer that moves. A <strong>tag</strong> is a pointer that does not. It marks one commit forever, which is exactly what a release needs: six months from now, <code>v1.5.0</code> must still mean the same forty characters.</p>

<h3>Two kinds of tag, and why it matters</h3>
<pre><code>git tag v1.5.0                                  <span class="tok-comment"># LIGHTWEIGHT — just a name</span>
git tag -a v1.5.0 -m <span class="tok-string">"Release 1.5.0"</span>          <span class="tok-comment"># ANNOTATED — a real object</span></code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Lightweight</span><span class="lz-v">A file under <code>.git/refs/tags/</code> containing a hash. No author, no date, no message. A private bookmark.</span></div>
  <div class="lz-layer"><span class="lz-k">Annotated</span><span class="lz-v">A full object in the database: tagger, date, message, and optionally a GPG/SSH signature. What a release is.</span></div>
</div>
<pre><code>git show v1.5.0 | head -6</code></pre>
<div class="out">tag v1.5.0
Tagger: Nguyen Van An &lt;an@example.com&gt;
Date:   Thu Aug 21 14:20:00 2026 +0700

Release 1.5.0 — refresh token rotation, feed performance</div>
<div class="callout ok"><strong>Always use <code>-a</code> for anything anyone else will see.</strong> An annotated tag records who released it and when, can be signed, and is the only kind <code>git describe</code> uses by default. Lightweight tags are fine as a personal bookmark and wrong for a release.</div>

<h3>Semantic versioning</h3>
<pre><code>MAJOR.MINOR.PATCH        <span class="tok-comment">// 2.4.1</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">MAJOR</span><span class="v">A breaking change. Existing users must change their code. <code>2.4.1 → 3.0.0</code></span></div>
  <div class="kv"><span class="k">MINOR</span><span class="v">New functionality, backwards-compatible. <code>2.4.1 → 2.5.0</code></span></div>
  <div class="kv"><span class="k">PATCH</span><span class="v">A backwards-compatible bug fix. <code>2.4.1 → 2.4.2</code></span></div>
  <div class="kv"><span class="k">Pre-release</span><span class="v"><code>2.5.0-beta.1</code>, <code>2.5.0-rc.2</code>. Sorts <em>before</em> <code>2.5.0</code>.</span></div>
  <div class="kv"><span class="k">Build metadata</span><span class="v"><code>2.5.0+20260821.a7c2f91</code>. Ignored when comparing versions.</span></div>
</div>
<p>This is where Conventional Commits (1.4) pays off: <code>fix:</code> implies a patch bump, <code>feat:</code> a minor, and <code>BREAKING CHANGE:</code> a major — so the next version can be computed from the commits instead of argued about.</p>
<div class="callout warn"><strong>0.x means "no promises".</strong> Under semver, anything below 1.0.0 may break at any time, which is why so many libraries sit at 0.x for years. Publishing 1.0.0 is a commitment: from then on, breaking anything costs a major bump.</div>

<h3>Everyday tag commands</h3>
<pre><code>git tag                              <span class="tok-comment"># list, alphabetically</span>
git tag -l <span class="tok-string">"v1.5.*"</span>                   <span class="tok-comment"># filter</span>
git tag -n9                          <span class="tok-comment"># list with up to 9 lines of message</span>
git tag -a v1.5.0 -m <span class="tok-string">"…"</span> 3f8a1c9      <span class="tok-comment"># tag a PAST commit</span>
git show v1.5.0                      <span class="tok-comment"># the tag and the commit it points at</span>
git checkout v1.5.0                  <span class="tok-comment"># detached HEAD at that release (3.1)</span>
git tag -d v1.5.0                    <span class="tok-comment"># delete locally</span></code></pre>
<pre><code><span class="tok-comment"># Sorted the way humans expect (v1.10.0 AFTER v1.9.0):</span>
git tag --sort=-version:refname | head -5</code></pre>
<div class="out">v1.10.0
v1.9.2
v1.9.1
v1.9.0
v1.8.4</div>
<p>Without <code>--sort=version:refname</code> you get plain alphabetical order, where <code>v1.10.0</code> sorts before <code>v1.9.0</code>. That has broken more release scripts than any other single detail here.</p>

<h3>Tags are not pushed automatically</h3>
<pre><code>git push origin v1.5.0            <span class="tok-comment"># one tag</span>
git push --follow-tags            <span class="tok-comment"># commits + annotated tags pointing into them</span>
git push origin --tags            <span class="tok-comment"># every local tag, including junk</span></code></pre>
<p>Worth repeating from 5.3 because it is the most common release-day confusion: you tagged, you pushed, and the release workflow did not fire — because the tag never left your machine.</p>

<h3>git describe — a human name for any commit</h3>
<pre><code>git describe --tags</code></pre>
<div class="out">v1.5.0-14-ga7c2f91</div>
<div class="kv-grid">
  <div class="kv"><span class="k">v1.5.0</span><span class="v">The most recent annotated tag reachable from here.</span></div>
  <div class="kv"><span class="k">14</span><span class="v">Commits since that tag.</span></div>
  <div class="kv"><span class="k">ga7c2f91</span><span class="v">The current commit ("g" for git).</span></div>
</div>
<pre><code>git describe --tags --always --dirty</code></pre>
<div class="out">v1.5.0-14-ga7c2f91-dirty</div>
<p>Bake this into your build and every deployed artefact can say exactly which commit it is — including whether it was built from an uncommitted working tree, which the <code>-dirty</code> suffix reveals. It is the cheapest possible answer to "what is actually running in production?"</p>

<h3>Fixing a tag you pushed wrong</h3>
<pre><code>git tag -d v1.5.0                       <span class="tok-comment"># delete locally</span>
git push origin --delete v1.5.0         <span class="tok-comment"># delete on the remote</span>
git tag -a v1.5.0 -m <span class="tok-string">"…"</span> &lt;right-hash&gt;   <span class="tok-comment"># re-create</span>
git push origin v1.5.0                  <span class="tok-comment"># push again</span></code></pre>
<div class="callout danger">Moving a published tag is a <strong>history rewrite for everyone who already fetched it</strong>. Their local <code>v1.5.0</code> keeps pointing at the old commit and Git will not silently update it — so "version 1.5.0" now means two different things depending on who you ask. Do this only within minutes of the mistake, tell the team, and never for a tag a release artefact was built from. The safe alternative is to publish <code>v1.5.1</code>.</div>

<h3>Tagging in a release workflow</h3>
<pre><code><span class="tok-comment"># .github/workflows/release.yml — build only when a version tag is pushed</span>
on:
  push:
    tags: [<span class="tok-string">'v*.*.*'</span>]</code></pre>
<pre><code><span class="tok-comment"># npm keeps package.json and the tag in step for you:</span>
npm version patch      <span class="tok-comment"># 1.5.0 → 1.5.1, commits, and creates tag v1.5.1</span>
npm version minor      <span class="tok-comment"># 1.5.1 → 1.6.0</span>
npm version major      <span class="tok-comment"># 1.6.0 → 2.0.0</span>
git push --follow-tags</code></pre>
<div class="callout ok">Letting the tooling create the tag removes an entire class of mistake: a <code>package.json</code> saying 1.5.1 while the tag says v1.5.0, or a tag that exists on your laptop and nowhere else. One command, one commit, one tag, one push.</div>

<a class="link-card" href="https://semver.org/lang/vi/" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">Semantic Versioning 2.0.0 — the specification (Vietnamese available)</span><span class="lc-sub">Short and worth reading in full once; the pre-release ordering rules are the part people get wrong.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Basics-Tagging" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">Pro Git 2.6 — Tagging</span><span class="lc-sub">Lightweight vs annotated, signing, and tagging past commits.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> using a lightweight tag for a release and then wondering why <code>git describe</code> ignores it and why nobody can tell who cut the release. Lightweight tags carry no metadata at all — there is no author, no date, nothing to sign. The fix is one flag, <code>-a</code>, decided at the moment you create it and impossible to add afterwards without recreating the tag.</div>
<p class="note-ct"><strong>What tags are actually for:</strong> being able to answer, at any point in the future, "what exactly was version 1.5.0?" — and to check out that code, diff it against today, and reproduce a bug a customer is reporting on an old version. That is only true if the tag is annotated, pushed, and never moved.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Một cái tên vĩnh viễn cho một commit</h2>
<p class="lead">Một nhánh là con trỏ biết dịch chuyển. Một <strong>tag</strong> là con trỏ không dịch chuyển. Nó đánh dấu một commit mãi mãi, và đó đúng là thứ một bản phát hành cần: sáu tháng nữa, <code>v1.5.0</code> vẫn phải có nghĩa là đúng bốn mươi ký tự đó.</p>

<h3>Hai loại tag, và vì sao khác biệt đó quan trọng</h3>
<pre><code>git tag v1.5.0                                  <span class="tok-comment"># NHẸ — chỉ là một cái tên</span>
git tag -a v1.5.0 -m <span class="tok-string">"Release 1.5.0"</span>          <span class="tok-comment"># CÓ CHÚ THÍCH — một đối tượng thật</span></code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Nhẹ (lightweight)</span><span class="lz-v">Một file dưới <code>.git/refs/tags/</code> chứa một mã băm. Không tác giả, không ngày, không lời nhắn. Một cái đánh dấu trang riêng tư.</span></div>
  <div class="lz-layer"><span class="lz-k">Có chú thích (annotated)</span><span class="lz-v">Một đối tượng đầy đủ trong cơ sở dữ liệu: người gắn tag, ngày, lời nhắn, và tuỳ chọn thêm chữ ký GPG/SSH. Đây mới là một bản phát hành.</span></div>
</div>
<pre><code>git show v1.5.0 | head -6</code></pre>
<div class="out">tag v1.5.0
Tagger: Nguyen Van An &lt;an@example.com&gt;
Date:   Thu Aug 21 14:20:00 2026 +0700

Release 1.5.0 — refresh token rotation, feed performance</div>
<div class="callout ok"><strong>Hãy luôn dùng <code>-a</code> cho bất cứ thứ gì người khác sẽ nhìn thấy.</strong> Một tag có chú thích ghi lại ai phát hành và khi nào, ký được, và là loại duy nhất mà <code>git describe</code> dùng theo mặc định. Tag nhẹ thì ổn khi làm đánh dấu trang cá nhân và sai khi làm một bản phát hành.</div>

<h3>Đánh phiên bản ngữ nghĩa</h3>
<pre><code>MAJOR.MINOR.PATCH        <span class="tok-comment">// 2.4.1</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">MAJOR</span><span class="v">Một thay đổi phá vỡ tương thích. Người dùng hiện tại phải sửa mã của họ. <code>2.4.1 → 3.0.0</code></span></div>
  <div class="kv"><span class="k">MINOR</span><span class="v">Chức năng mới, vẫn tương thích ngược. <code>2.4.1 → 2.5.0</code></span></div>
  <div class="kv"><span class="k">PATCH</span><span class="v">Một bản vá lỗi tương thích ngược. <code>2.4.1 → 2.4.2</code></span></div>
  <div class="kv"><span class="k">Tiền phát hành</span><span class="v"><code>2.5.0-beta.1</code>, <code>2.5.0-rc.2</code>. Sắp <em>TRƯỚC</em> <code>2.5.0</code>.</span></div>
  <div class="kv"><span class="k">Siêu dữ liệu bản dựng</span><span class="v"><code>2.5.0+20260821.a7c2f91</code>. Bị bỏ qua khi so sánh phiên bản.</span></div>
</div>
<p>Đây là chỗ Conventional Commits (bài 1.4) sinh lời: <code>fix:</code> ngụ ý tăng số patch, <code>feat:</code> tăng minor, và <code>BREAKING CHANGE:</code> tăng major — nên phiên bản kế tiếp tính được từ chính các commit thay vì phải đem ra tranh cãi.</p>
<div class="callout warn"><strong>0.x nghĩa là "không hứa hẹn gì".</strong> Theo semver, mọi thứ dưới 1.0.0 có thể phá vỡ tương thích bất cứ lúc nào, và vì thế rất nhiều thư viện nằm ở 0.x nhiều năm. Công bố 1.0.0 là một cam kết: từ đó trở đi, phá vỡ bất cứ thứ gì đều tốn một lần tăng major.</div>

<h3>Các lệnh tag hằng ngày</h3>
<pre><code>git tag                              <span class="tok-comment"># liệt kê, theo bảng chữ cái</span>
git tag -l <span class="tok-string">"v1.5.*"</span>                   <span class="tok-comment"># lọc</span>
git tag -n9                          <span class="tok-comment"># liệt kê kèm tối đa 9 dòng lời nhắn</span>
git tag -a v1.5.0 -m <span class="tok-string">"…"</span> 3f8a1c9      <span class="tok-comment"># gắn tag cho một commit QUÁ KHỨ</span>
git show v1.5.0                      <span class="tok-comment"># cái tag và commit nó trỏ tới</span>
git checkout v1.5.0                  <span class="tok-comment"># HEAD lìa cành tại bản phát hành đó (bài 3.1)</span>
git tag -d v1.5.0                    <span class="tok-comment"># xoá ở cục bộ</span></code></pre>
<pre><code><span class="tok-comment"># Sắp theo cách con người mong đợi (v1.10.0 SAU v1.9.0):</span>
git tag --sort=-version:refname | head -5</code></pre>
<div class="out">v1.10.0
v1.9.2
v1.9.1
v1.9.0
v1.8.4</div>
<p>Không có <code>--sort=version:refname</code> thì bạn nhận thứ tự bảng chữ cái thuần tuý, nơi <code>v1.10.0</code> đứng trước <code>v1.9.0</code>. Chi tiết đó đã làm hỏng nhiều script phát hành hơn bất kỳ chi tiết đơn lẻ nào khác ở đây.</p>

<h3>Tag không tự động được push</h3>
<pre><code>git push origin v1.5.0            <span class="tok-comment"># một tag</span>
git push --follow-tags            <span class="tok-comment"># commit + các tag có chú thích trỏ vào chúng</span>
git push origin --tags            <span class="tok-comment"># mọi tag cục bộ, kể cả rác</span></code></pre>
<p>Đáng nhắc lại từ bài 5.3 vì đây là nỗi bối rối phổ biến nhất trong ngày phát hành: bạn đã gắn tag, đã push, mà workflow phát hành không chạy — vì cái tag chưa bao giờ rời khỏi máy bạn.</p>

<h3>git describe — một cái tên đọc được cho mọi commit</h3>
<pre><code>git describe --tags</code></pre>
<div class="out">v1.5.0-14-ga7c2f91</div>
<div class="kv-grid">
  <div class="kv"><span class="k">v1.5.0</span><span class="v">Tag có chú thích gần nhất với tới được từ đây.</span></div>
  <div class="kv"><span class="k">14</span><span class="v">Số commit kể từ tag đó.</span></div>
  <div class="kv"><span class="k">ga7c2f91</span><span class="v">Commit hiện tại ("g" là git).</span></div>
</div>
<pre><code>git describe --tags --always --dirty</code></pre>
<div class="out">v1.5.0-14-ga7c2f91-dirty</div>
<p>Nướng cái này vào bản dựng và mọi sản phẩm đã triển khai đều nói được chính xác nó là commit nào — kể cả việc nó được dựng từ một cây làm việc chưa commit, thứ mà hậu tố <code>-dirty</code> phơi ra. Đó là câu trả lời rẻ nhất có thể cho "trên production thật ra đang chạy cái gì?"</p>

<h3>Sửa một tag đã đẩy sai</h3>
<pre><code>git tag -d v1.5.0                       <span class="tok-comment"># xoá cục bộ</span>
git push origin --delete v1.5.0         <span class="tok-comment"># xoá trên remote</span>
git tag -a v1.5.0 -m <span class="tok-string">"…"</span> &lt;mã-băm-đúng&gt;  <span class="tok-comment"># tạo lại</span>
git push origin v1.5.0                  <span class="tok-comment"># push lại</span></code></pre>
<div class="callout danger">Dời một tag đã công bố là một <strong>lần viết lại lịch sử với mọi người đã fetch nó</strong>. Cái <code>v1.5.0</code> cục bộ của họ vẫn trỏ vào commit cũ và Git sẽ không âm thầm cập nhật nó — nên "phiên bản 1.5.0" giờ có nghĩa là hai thứ khác nhau tuỳ bạn hỏi ai. Chỉ làm việc này trong vòng vài phút sau lúc lỡ tay, hãy báo cả nhóm, và đừng bao giờ làm với một tag mà sản phẩm phát hành đã được dựng từ đó. Phương án an toàn là công bố <code>v1.5.1</code>.</div>

<h3>Gắn tag trong một workflow phát hành</h3>
<pre><code><span class="tok-comment"># .github/workflows/release.yml — chỉ dựng khi một tag phiên bản được push</span>
on:
  push:
    tags: [<span class="tok-string">'v*.*.*'</span>]</code></pre>
<pre><code><span class="tok-comment"># npm giữ package.json và tag khớp nhau hộ bạn:</span>
npm version patch      <span class="tok-comment"># 1.5.0 → 1.5.1, commit, và tạo tag v1.5.1</span>
npm version minor      <span class="tok-comment"># 1.5.1 → 1.6.0</span>
npm version major      <span class="tok-comment"># 1.6.0 → 2.0.0</span>
git push --follow-tags</code></pre>
<div class="callout ok">Để công cụ tạo tag gỡ bỏ cả một lớp sai lầm: một <code>package.json</code> ghi 1.5.1 trong khi tag ghi v1.5.0, hay một tag chỉ tồn tại trên laptop của bạn và không ở đâu khác. Một lệnh, một commit, một tag, một lần push.</div>

<a class="link-card" href="https://semver.org/lang/vi/" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">Semantic Versioning 2.0.0 — bản đặc tả (có tiếng Việt)</span><span class="lc-sub">Ngắn và đáng đọc trọn vẹn một lần; luật sắp thứ tự bản tiền phát hành là chỗ người ta hay hiểu sai.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/book/vi/v2/C%C4%83n-B%E1%BA%A3n-Git-G%E1%BA%AFn-Th%E1%BA%BB" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">Pro Git 2.6 (tiếng Việt) — Gắn thẻ</span><span class="lc-sub">Tag nhẹ vs có chú thích, ký tag, và gắn tag cho commit quá khứ.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dùng một tag nhẹ cho bản phát hành rồi thắc mắc vì sao <code>git describe</code> lờ nó đi và vì sao không ai biết được ai đã cắt bản phát hành. Tag nhẹ hoàn toàn không mang siêu dữ liệu nào — không có tác giả, không có ngày, không có gì để ký. Cách sửa là một cái cờ, <code>-a</code>, quyết định ngay lúc bạn tạo nó và không thể thêm vào sau nếu không tạo lại tag.</div>
<p class="note-ct"><strong>Tag thật ra dùng để làm gì:</strong> để trả lời được, ở bất kỳ thời điểm nào trong tương lai, câu "phiên bản 1.5.0 chính xác là cái gì?" — và để checkout ra chính phần mã đó, so nó với hôm nay, và tái hiện một con lỗi mà khách hàng đang báo trên một bản cũ. Điều đó chỉ đúng nếu tag có chú thích, đã được push, và không bao giờ bị dời.</p>
</div>
`,
    },

    /* ─────────────────────────── 7.3 ─────────────────────────── */
    {
      title: '7.3 — Releases, changelogs & hotfixes|||7.3 — Phát hành, changelog & hotfix',
      slug: 'git-7-3-phat-hanh-changelog',
      type: 'LESSON',
      description: 'Sinh changelog từ chính lịch sử, GitHub Releases, quy trình cắt một bản phát hành, hotfix khi production đang cháy, và cherry-pick để mang một bản vá sang nhánh khác.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Turning commits into something a human can read</h2>
<p class="lead">A release is two artefacts: the tagged code, and a description of what changed. The second one is what users and your future self actually read — and if commit messages were written properly (1.4), it can be generated rather than written.</p>

<h3>The changelog, straight from history</h3>
<pre><code>git log --oneline v1.4.0..v1.5.0</code></pre>
<div class="out">a7c2f91 fix(auth): reject expired refresh tokens on /auth/refresh
3f8a1c9 feat(auth): add refresh token rotation
9e2d4b7 perf(feed): batch the author lookup into one query
5f7a9c2 chore(deps): bump prisma to 6.2.0</div>
<pre><code><span class="tok-comment"># Grouped by type, ready to paste:</span>
git log --pretty=format:<span class="tok-string">"- %s (%h)"</span> v1.4.0..v1.5.0 --grep=<span class="tok-string">"^feat"</span>
git log --pretty=format:<span class="tok-string">"- %s (%h)"</span> v1.4.0..v1.5.0 --grep=<span class="tok-string">"^fix"</span></code></pre>
<div class="out">- feat(auth): add refresh token rotation (3f8a1c9)</div>
<p>That is the entire mechanism behind every changelog generator. Tools such as <code>changesets</code>, <code>release-please</code> and <code>semantic-release</code> add version calculation and a pull request, but the data comes from exactly this.</p>

<h3>A changelog worth publishing</h3>
<pre><code><span class="tok-comment"># CHANGELOG.md — newest first, one section per release</span>
## [1.5.0] — 2026-08-21

### Added
- Refresh token rotation: each refresh issues a new token and invalidates
  the old one, so a stolen token is usable at most once. (#428)

### Fixed
- **Sessions never expired.** /auth/refresh accepted tokens whose exp had
  passed, so a 40-day-old token still minted access tokens. (#431)

### Changed
- Feed author lookups are batched — p95 on /feed went from 4.2s to 180ms.

### Security
- Update prisma to 6.2.0 (CVE-2026-1234).</code></pre>
<div class="callout ok">Write for the person deciding whether to upgrade. "Fixed auth bug" tells them nothing; "sessions never expired, a 40-day-old token still worked" tells them whether this is urgent. The <strong>Security</strong> section deserves its own heading precisely so it can be scanned for in a hurry.</div>

<h3>GitHub Releases</h3>
<pre><code>gh release create v1.5.0 --generate-notes
gh release create v1.5.0 --notes-file CHANGELOG-1.5.0.md
gh release create v1.5.0 ./dist/app-1.5.0.zip --title <span class="tok-string">"1.5.0 — Token rotation"</span>
gh release list
gh release view v1.5.0</code></pre>
<p><code>--generate-notes</code> builds notes from merged pull requests since the previous tag, grouped by label. Configure the grouping in <code>.github/release.yml</code>:</p>
<pre><code>changelog:
  categories:
    - title: 🚀 Features
      labels: [feature, enhancement]
    - title: 🐛 Fixes
      labels: [bug]
    - title: 🔒 Security
      labels: [security]
    - title: 🧹 Maintenance
      labels: [chore, dependencies]</code></pre>

<h3>Cutting a release</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Decide the version</div><div class="lz-d">Read the commits since the last tag: any <code>feat</code> → minor; only <code>fix</code> → patch; any breaking change → major.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Update version and changelog</div><div class="lz-d"><code>npm version minor</code> plus the CHANGELOG section, in one commit.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Tag, annotated</div><div class="lz-d"><code>git tag -a v1.5.0 -m "…"</code> — or let <code>npm version</code> do it.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Push commits AND tags</div><div class="lz-d"><code>git push --follow-tags</code>. This is what triggers the release workflow.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Verify what shipped</div><div class="lz-d">Check the artefact reports the version you expect — <code>git describe</code> baked into the build (7.2).</div></div>
</div>

<h3>Hotfix — production is broken right now</h3>
<pre><code><span class="tok-comment"># 1. Branch from the RELEASED code, not from main. main may contain</span>
<span class="tok-comment">#    unreleased work you do not want to ship in an emergency.</span>
git switch -c hotfix/payment-timeout v1.5.0

<span class="tok-comment"># 2. The smallest possible fix. Nothing else.</span>
git commit -m <span class="tok-string">"fix(payment): raise the gateway timeout to 30s"</span>

<span class="tok-comment"># 3. Tag a patch release and ship it.</span>
git tag -a v1.5.1 -m <span class="tok-string">"Hotfix: gateway timeout"</span>
git push origin hotfix/payment-timeout --follow-tags

<span class="tok-comment"># 4. Merge back into main — the step people forget (7.1).</span>
git switch main &amp;&amp; git merge hotfix/payment-timeout &amp;&amp; git push</code></pre>
<div class="callout danger">Step 4 is not optional. Skip it and the fix exists only on the hotfix branch and the tag — the next release, cut from <code>main</code>, silently ships without it and the outage repeats. Put "merged back to main" on the incident checklist; it is the single most common post-incident regression.</div>

<h3>cherry-pick — one commit onto another branch</h3>
<pre><code>git switch release/1.4
git cherry-pick a7c2f91          <span class="tok-comment"># apply just that commit here</span>
git cherry-pick a7c2f91 3f8a1c9  <span class="tok-comment"># several, in order</span>
git cherry-pick -x a7c2f91       <span class="tok-comment"># record "(cherry picked from commit …)" in the message</span></code></pre>
<p>The use case: a fix landed on <code>main</code>, and you also need it on a maintenance branch that is not going to take everything else from main. <code>-x</code> is worth using always — it leaves a trail explaining where the commit came from, which is otherwise unrecoverable.</p>
<div class="callout warn">A cherry-pick creates a <strong>new commit with a new hash</strong> containing the same change. If the branch is later merged into one that already has the original, Git usually notices the identical change and resolves it — but not always. Cherry-pick deliberately, in one direction (main → release branch), and do not use it as a substitute for merging.</div>

<h3>Automating the whole thing</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">release-please</span><span class="v">Reads Conventional Commits, opens a "chore: release 1.5.0" pull request with the version bump and changelog. Merging it tags and releases. Language-agnostic.</span></div>
  <div class="kv"><span class="k">semantic-release</span><span class="v">Fully automatic: every merge to main computes the version, tags, publishes and writes release notes. Powerful, and unforgiving of sloppy commit messages.</span></div>
  <div class="kv"><span class="k">changesets</span><span class="v">Contributors add a small file describing their change; the tool aggregates them at release time. Designed for monorepos with several published packages.</span></div>
</div>

<a class="link-card" href="https://keepachangelog.com/en/1.1.0/" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">Keep a Changelog — the format used above</span><span class="lc-sub">Added / Changed / Deprecated / Removed / Fixed / Security, and why "git log is not a changelog".</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes" target="_blank" rel="noopener">
  <span class="lc-ico">🤖</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Automatically generated release notes</span><span class="lc-sub">The <code>.github/release.yml</code> configuration in full.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> hotfixing from <code>main</code> instead of from the released tag. <code>main</code> usually contains work that has not shipped and has not been tested in production. Branching from it during an incident means your one-line emergency fix arrives bundled with three unrelated features — and if <em>they</em> break, you are now debugging two incidents at once. Branch from the tag that is live.</div>
<p class="note-ct"><strong>The connection back to Chapter 1:</strong> everything in this lesson is downstream of commit message quality. Conventional Commits make the version computable, the changelog generable, and the release notes readable. Teams that skip that discipline end up writing release notes by hand from a diff — which is exactly the work the discipline was avoiding.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Biến commit thành thứ con người đọc được</h2>
<p class="lead">Một bản phát hành gồm hai sản phẩm: phần mã đã gắn tag, và một bản mô tả những gì đã đổi. Cái thứ hai mới là thứ người dùng và chính bạn trong tương lai thật sự đọc — và nếu lời nhắn commit được viết tử tế (bài 1.4), nó SINH RA được thay vì phải viết.</p>

<h3>Changelog, thẳng từ lịch sử</h3>
<pre><code>git log --oneline v1.4.0..v1.5.0</code></pre>
<div class="out">a7c2f91 fix(auth): reject expired refresh tokens on /auth/refresh
3f8a1c9 feat(auth): add refresh token rotation
9e2d4b7 perf(feed): batch the author lookup into one query
5f7a9c2 chore(deps): bump prisma to 6.2.0</div>
<pre><code><span class="tok-comment"># Gom theo loại, sẵn sàng để dán:</span>
git log --pretty=format:<span class="tok-string">"- %s (%h)"</span> v1.4.0..v1.5.0 --grep=<span class="tok-string">"^feat"</span>
git log --pretty=format:<span class="tok-string">"- %s (%h)"</span> v1.4.0..v1.5.0 --grep=<span class="tok-string">"^fix"</span></code></pre>
<div class="out">- feat(auth): add refresh token rotation (3f8a1c9)</div>
<p>Đó là toàn bộ cơ chế đằng sau mọi bộ sinh changelog. Các công cụ như <code>changesets</code>, <code>release-please</code> và <code>semantic-release</code> thêm phần tính phiên bản và một pull request, nhưng dữ liệu đến từ đúng chỗ này.</p>

<h3>Một changelog đáng công bố</h3>
<pre><code><span class="tok-comment"># CHANGELOG.md — mới nhất trước, mỗi bản phát hành một mục</span>
## [1.5.0] — 21/08/2026

### Thêm mới
- Xoay vòng refresh token: mỗi lần refresh cấp một token mới và vô hiệu
  token cũ, nên một token bị đánh cắp dùng được nhiều nhất một lần. (#428)

### Đã sửa
- **Phiên đăng nhập không bao giờ hết hạn.** /auth/refresh chấp nhận token
  đã quá exp, nên một token 40 ngày tuổi vẫn đúc ra access token. (#431)

### Đã đổi
- Việc tra tác giả ở feed được gộp theo lô — p95 của /feed từ 4,2s xuống 180ms.

### Bảo mật
- Nâng prisma lên 6.2.0 (CVE-2026-1234).</code></pre>
<div class="callout ok">Hãy viết cho người đang quyết định có nên nâng cấp hay không. "Sửa lỗi auth" chẳng nói gì với họ; "phiên đăng nhập không bao giờ hết hạn, một token 40 ngày tuổi vẫn chạy" cho họ biết chuyện này có gấp hay không. Mục <strong>Bảo mật</strong> xứng đáng có tiêu đề riêng đúng để người ta lướt mắt tìm được nó lúc vội.</div>

<h3>GitHub Releases</h3>
<pre><code>gh release create v1.5.0 --generate-notes
gh release create v1.5.0 --notes-file CHANGELOG-1.5.0.md
gh release create v1.5.0 ./dist/app-1.5.0.zip --title <span class="tok-string">"1.5.0 — Xoay vong token"</span>
gh release list
gh release view v1.5.0</code></pre>
<p><code>--generate-notes</code> dựng ghi chú từ các pull request đã merge kể từ tag trước, gom theo nhãn. Cấu hình cách gom trong <code>.github/release.yml</code>:</p>
<pre><code>changelog:
  categories:
    - title: 🚀 Tính năng
      labels: [feature, enhancement]
    - title: 🐛 Sửa lỗi
      labels: [bug]
    - title: 🔒 Bảo mật
      labels: [security]
    - title: 🧹 Bảo trì
      labels: [chore, dependencies]</code></pre>

<h3>Cắt một bản phát hành</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Quyết định số phiên bản</div><div class="lz-d">Đọc các commit kể từ tag cuối: có <code>feat</code> → minor; chỉ có <code>fix</code> → patch; có thay đổi phá vỡ tương thích → major.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Cập nhật phiên bản và changelog</div><div class="lz-d"><code>npm version minor</code> cộng mục trong CHANGELOG, trong một commit.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Gắn tag, có chú thích</div><div class="lz-d"><code>git tag -a v1.5.0 -m "…"</code> — hoặc để <code>npm version</code> làm hộ.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Push cả commit LẪN tag</div><div class="lz-d"><code>git push --follow-tags</code>. Đây mới là thứ kích hoạt workflow phát hành.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Kiểm chứng thứ đã lên</div><div class="lz-d">Xem sản phẩm có báo đúng phiên bản bạn mong đợi không — <code>git describe</code> nướng vào bản dựng (bài 7.2).</div></div>
</div>

<h3>Hotfix — production đang hỏng ngay lúc này</h3>
<pre><code><span class="tok-comment"># 1. Rẽ nhánh từ MÃ ĐÃ PHÁT HÀNH, không phải từ main. main có thể chứa</span>
<span class="tok-comment">#    phần việc chưa phát hành mà bạn không muốn đẩy lên trong lúc khẩn cấp.</span>
git switch -c hotfix/payment-timeout v1.5.0

<span class="tok-comment"># 2. Bản vá nhỏ nhất có thể. Không gì khác.</span>
git commit -m <span class="tok-string">"fix(payment): nang timeout cong thanh toan len 30s"</span>

<span class="tok-comment"># 3. Gắn tag một bản patch và đẩy đi.</span>
git tag -a v1.5.1 -m <span class="tok-string">"Hotfix: timeout cong thanh toan"</span>
git push origin hotfix/payment-timeout --follow-tags

<span class="tok-comment"># 4. Merge ngược vào main — bước mà người ta hay quên (bài 7.1).</span>
git switch main &amp;&amp; git merge hotfix/payment-timeout &amp;&amp; git push</code></pre>
<div class="callout danger">Bước 4 không phải tuỳ chọn. Bỏ qua nó thì bản vá chỉ tồn tại trên nhánh hotfix và cái tag — bản phát hành kế tiếp, cắt ra từ <code>main</code>, âm thầm đi mà không có nó và sự cố lặp lại. Hãy đưa "đã merge ngược vào main" vào danh sách kiểm sự cố; đó là bước lùi sau sự cố phổ biến nhất.</div>

<h3>cherry-pick — một commit sang một nhánh khác</h3>
<pre><code>git switch release/1.4
git cherry-pick a7c2f91          <span class="tok-comment"># chỉ áp đúng commit đó vào đây</span>
git cherry-pick a7c2f91 3f8a1c9  <span class="tok-comment"># vài cái, theo thứ tự</span>
git cherry-pick -x a7c2f91       <span class="tok-comment"># ghi "(cherry picked from commit …)" vào lời nhắn</span></code></pre>
<p>Tình huống dùng: một bản vá đã đáp xuống <code>main</code>, và bạn cũng cần nó trên một nhánh bảo trì vốn sẽ không nhận mọi thứ khác từ main. <code>-x</code> đáng dùng lúc nào cũng vậy — nó để lại dấu vết giải thích commit đến từ đâu, thứ mà nếu không có thì không cách nào tìm lại.</p>
<div class="callout warn">Một lần cherry-pick tạo ra một <strong>commit MỚI với mã băm mới</strong> chứa cùng thay đổi. Nếu về sau nhánh đó được merge vào một nhánh vốn đã có commit gốc, Git thường nhận ra thay đổi trùng và tự giải quyết — nhưng không phải lúc nào cũng thế. Hãy cherry-pick có chủ ý, theo một chiều (main → nhánh phát hành), và đừng dùng nó thay cho việc merge.</div>

<h3>Tự động hoá toàn bộ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">release-please</span><span class="v">Đọc Conventional Commits, mở một pull request "chore: release 1.5.0" kèm việc tăng phiên bản và changelog. Merge nó là gắn tag và phát hành. Không phụ thuộc ngôn ngữ.</span></div>
  <div class="kv"><span class="k">semantic-release</span><span class="v">Hoàn toàn tự động: mỗi lần merge vào main sẽ tính phiên bản, gắn tag, công bố và viết ghi chú phát hành. Mạnh, và không tha thứ cho lời nhắn commit cẩu thả.</span></div>
  <div class="kv"><span class="k">changesets</span><span class="v">Người đóng góp thêm một file nhỏ mô tả thay đổi của mình; công cụ gom chúng lại lúc phát hành. Thiết kế cho monorepo có nhiều gói được công bố.</span></div>
</div>

<a class="link-card" href="https://keepachangelog.com/vi/1.0.0/" target="_blank" rel="noopener">
  <span class="lc-ico">📝</span>
  <span class="lc-body"><span class="lc-title">Keep a Changelog — định dạng dùng ở trên (có tiếng Việt)</span><span class="lc-sub">Added / Changed / Deprecated / Removed / Fixed / Security, và vì sao "git log không phải changelog".</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/releasing-projects-on-github/automatically-generated-release-notes" target="_blank" rel="noopener">
  <span class="lc-ico">🤖</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Ghi chú phát hành sinh tự động</span><span class="lc-sub">Toàn bộ cấu hình <code>.github/release.yml</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> hotfix từ <code>main</code> thay vì từ tag đã phát hành. <code>main</code> thường chứa phần việc chưa lên production và chưa được kiểm trên production. Rẽ nhánh từ đó trong lúc sự cố nghĩa là bản vá khẩn một dòng của bạn tới nơi kèm theo ba tính năng không liên quan — và nếu <em>chúng</em> hỏng, bạn đang gỡ hai sự cố cùng lúc. Hãy rẽ nhánh từ cái tag đang chạy.</div>
<p class="note-ct"><strong>Mối nối ngược về Chương 1:</strong> mọi thứ trong bài này nằm ở hạ nguồn của chất lượng lời nhắn commit. Conventional Commits làm cho phiên bản tính được, changelog sinh được, và ghi chú phát hành đọc được. Nhóm nào bỏ qua kỷ luật đó rốt cuộc phải viết ghi chú phát hành bằng tay từ một bản diff — đúng cái công việc mà kỷ luật kia sinh ra để né.</p>
</div>
`,
    },

    /* ─────────────────────────── 7.4 Quiz ─────────────────────────── */
    {
      title: '7.4 — Chapter 7 quiz|||7.4 — Kiểm tra Chương 7',
      slug: 'git-7-4-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về ba chiến lược nhánh, cờ tính năng, tag nhẹ vs có chú thích, semver, sắp thứ tự tag, git describe, hotfix và cherry-pick.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on team workflows and releases. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: why a hotfix branches from the released tag rather than main (7.3), and what a lightweight tag is missing (7.2).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về quy trình nhóm và phát hành. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: vì sao hotfix rẽ nhánh từ tag đã phát hành chứ không từ main (bài 7.3), và tag nhẹ thiếu những gì (bài 7.2).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What problem do feature flags solve in trunk-based development?|||Cờ tính năng giải quyết vấn đề gì trong trunk-based development?',
            options: [
              'They make CI faster|||Chúng làm CI nhanh hơn',
              'They let unfinished work merge to main switched off, so branches stay short and merge pain (which grows super-linearly with branch age) stays near zero|||Chúng cho phép việc chưa xong merge vào main ở trạng thái TẮT, nên nhánh vẫn ngắn và nỗi đau khi merge (vốn tăng trên tuyến tính theo tuổi nhánh) gần như bằng không',
              'They replace code review|||Chúng thay thế cho code review',
              'They allow force-pushing to main safely|||Chúng cho phép force-push vào main một cách an toàn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the most common way git-flow fails in practice?|||git-flow hỏng theo cách phổ biến nhất nào trong thực tế?',
            options: [
              'develop grows too large to merge|||develop phình to quá không merge nổi',
              'Hotfixes are merged to main but never back-merged to develop, so the bug returns in the next release|||Hotfix được merge vào main nhưng không bao giờ được merge ngược về develop, nên con lỗi quay lại ở bản phát hành kế tiếp',
              'Release branches cannot be tagged|||Nhánh phát hành không gắn tag được',
              'It requires GitHub Enterprise|||Nó đòi hỏi GitHub Enterprise',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does an annotated tag have that a lightweight tag does not?|||Tag có chú thích có gì mà tag nhẹ không có?',
            options: [
              'Nothing — they are the same object|||Không gì cả — chúng là cùng một đối tượng',
              'A tagger, a date, a message, and the ability to be signed — it is a real object, not just a ref|||Người gắn tag, ngày, lời nhắn, và khả năng được ký — nó là một đối tượng thật, không chỉ là một ref',
              'The ability to point at a branch|||Khả năng trỏ vào một nhánh',
              'Automatic pushing to the remote|||Tự động được push lên remote',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Under semver, you add a new backwards-compatible endpoint to 2.4.1. What is the next version?|||Theo semver, bạn thêm một endpoint mới tương thích ngược vào 2.4.1. Phiên bản kế tiếp là gì?',
            options: [
              '2.4.2',
              '2.5.0',
              '3.0.0',
              '2.4.1+1',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does "git tag" list v1.10.0 before v1.9.0 by default?|||Vì sao "git tag" mặc định liệt kê v1.10.0 trước v1.9.0?',
            options: [
              'Because 1.10 is older|||Vì 1.10 cũ hơn',
              'It sorts alphabetically, so "1" < "9" — use --sort=version:refname for the order humans expect|||Nó sắp theo bảng chữ cái, nên "1" < "9" — hãy dùng --sort=version:refname để có thứ tự con người mong đợi',
              'Because v1.10.0 is annotated|||Vì v1.10.0 có chú thích',
              'It is a bug in Git|||Đó là một lỗi của Git',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does the "-dirty" suffix from git describe --dirty tell you?|||Hậu tố "-dirty" từ git describe --dirty cho bạn biết gì?',
            options: [
              'The tag is unsigned|||Cái tag chưa được ký',
              'The build was made from a working tree with uncommitted changes|||Bản dựng được tạo từ một cây làm việc còn thay đổi chưa commit',
              'The commit failed CI|||Commit đó trượt CI',
              'There are merge conflicts|||Đang có xung đột hợp nhất',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why should a hotfix branch from the released tag rather than from main?|||Vì sao một hotfix nên rẽ nhánh từ tag đã phát hành thay vì từ main?',
            options: [
              'Tags are faster to check out|||Checkout tag thì nhanh hơn',
              'main usually contains unreleased, untested-in-production work — branching from it ships that too, in the middle of an incident|||main thường chứa phần việc chưa phát hành, chưa kiểm trên production — rẽ nhánh từ đó là đẩy luôn cả phần đó lên, ngay giữa lúc sự cố',
              'Git refuses to branch from main during an incident|||Git từ chối rẽ nhánh từ main trong lúc sự cố',
              'It is only a naming convention|||Đó chỉ là một quy ước đặt tên',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does "git cherry-pick -x <hash>" add compared to plain cherry-pick?|||"git cherry-pick -x <mã băm>" thêm gì so với cherry-pick trần?',
            options: [
              'It keeps the original commit hash|||Nó giữ nguyên mã băm commit gốc',
              'It records "(cherry picked from commit …)" in the new commit message, leaving a trail of where the change came from|||Nó ghi "(cherry picked from commit …)" vào lời nhắn của commit mới, để lại dấu vết thay đổi đó đến từ đâu',
              'It applies the commit without conflicts|||Nó áp commit mà không gây xung đột',
              'It cherry-picks all commits on the branch|||Nó cherry-pick mọi commit trên nhánh',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
