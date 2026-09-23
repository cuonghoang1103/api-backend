/**
 * Git & GitHub — Chương 7: Quy trình nhóm, tag & phát hành.
 * Ba chiến lược nhánh · tag và đánh phiên bản ngữ nghĩa · changelog, nhánh phát hành, hotfix
 * · nhịp làm việc hằng ngày + cờ tính năng · quiz.
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 7 — Team workflows, tags & releases|||Chương 7 — Quy trình nhóm, tag & phát hành',
  description: 'Cách một nhóm sắp xếp nhánh, đánh dấu phiên bản và đưa mã ra production. Ba chiến lược nhánh phổ biến và chiến lược nào hợp với nhóm nào, tag và semantic versioning, changelog tự sinh, nhánh phát hành và hotfix, và cách giữ nhánh ngắn ngày bằng cờ tính năng.',
  lessons: [
    /* ─────────────────────────── 7.0 ─────────────────────────── */
    {
      title: '7.0 — Chapter 7 slides: team workflows, tags and releases in pictures|||7.0 — Slide Chương 7: quy trình nhóm, tag và phát hành bằng hình',
      slug: 'git-7-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 18 slide của Chương 7: đồ thị ba chiến lược nhánh, tag nhẹ vs annotated, semver, sắp tag, git describe, đẩy tag, changelog, hotfix từ tag và cherry-pick -x — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Slides</span>
<h2>The whole chapter in 18 slides</h2>
<p class="lead">Three branching strategies drawn as real graphs, then tags, semantic versioning and a full hotfix — branched from the live tag, released as v1.5.1, and cherry-picked back into main. Skim before the lessons; come back after the quiz.</p>
<p>The slides are in Vietnamese; the graphs and terminals read the same in any language. Every hash and every line of terminal output on them comes from a real run of Git 2.51 in a practice repository. The last two slides are a cheat sheet and a 40-minute practice session for the whole chapter.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Slide</span>
<h2>Cả chương trong 18 slide</h2>
<p class="lead">Ba chiến lược nhánh vẽ thành đồ thị thật, rồi tag, đánh phiên bản ngữ nghĩa (semver) và một vụ hotfix trọn vẹn — rẽ nhánh từ tag đang chạy, phát hành v1.5.1, rồi cherry-pick (nhặt commit) ngược về main. Lướt trước khi vào bài; quay lại sau bài kiểm tra để ôn.</p>
<p>Mọi mã băm và mọi dòng output terminal trên slide đều lấy từ một lần chạy thật Git 2.51 trong kho thử. Hai slide cuối là bảng tra nhanh và một buổi thực hành 40 phút cho cả chương.</p>
</div>
${gallery('git-07', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'GitHub flow'], [4, 'Trunk-based và cờ tính năng'], [5, 'git-flow'],
  [6, 'Chọn chiến lược'], [7, 'Đặt tên nhánh'], [8, 'Tag nhẹ vs annotated'], [9, 'Semver'], [10, 'Sắp tag và bẫy bản -rc'],
  [11, 'git describe'], [12, 'Tag không tự đi theo push'], [13, 'Changelog từ lịch sử'], [14, 'Cắt một bản phát hành'],
  [15, 'Hotfix từ tag đang chạy'], [16, 'cherry-pick -x về main'], [17, 'Bảng tra nhanh'], [18, 'Thực hành chương 7'],
])}
`,
    },

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
${slide('git-07', 3, 'GitHub flow: một nhánh sống lâu là main')}
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
${slide('git-07', 4, 'Trunk-based: nhánh sống vài giờ, việc dở nằm sau cờ')}
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
${slide('git-07', 5, 'git-flow: main, develop, release/*, hotfix/*')}
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
${slide('git-07', 6, 'Chọn chiến lược theo cách bạn phát hành')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Is more than one version live?</div><div class="lz-d">Yes → you need release branches (git-flow or a variant). No → continue.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Can you deploy any day?</div><div class="lz-d">Yes → GitHub flow. Blocked by store review or a release window → keep a release branch.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Do you have solid tests and flags?</div><div class="lz-d">Yes → trunk-based. Not yet → GitHub flow with slightly longer branches, and build the tests.</div></div>
</div>

<div class="callout ok"><strong>For a student team project (SWP391, 4–5 people, one web app, one deadline):</strong> answer the three questions and you land on GitHub flow — one protected <code>main</code>, one short branch per task, every change through a pull request. If your lecturer or team insists on a <code>develop</code> branch, you are running half of git-flow: then <code>main</code> only receives tested merges from <code>develop</code>, and any fix made directly on <code>main</code> must be merged back into <code>develop</code> the same day.</div>

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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In your <code>thu-git</code> playground, simulate two teammates: <code>git switch -c feature/avatar</code>, create <code>avatar.txt</code>, commit <code>feat: avatar</code>, then <code>git switch main</code>. Do the same with <code>git switch -c fix/login-500</code> and a one-line change to <code>a.txt</code> committed as <code>fix: login 500</code>.</li><li>Back on <code>main</code>, list only the fix branches: <code>git branch --list 'fix/*'</code>. Keep the quotes — without them zsh tries to expand the <code>*</code> itself and fails with "no matches found".</li><li>Integrate both the way a pull request would: <code>git merge --no-ff feature/avatar</code>, then <code>git merge --no-ff fix/login-500</code>. Delete both with <code>git branch -d</code>.</li><li>Answer the three questions of this lesson for your own SWP391 team and write the answer as one line you could put in a CONTRIBUTING file: model, branch prefixes, and who may merge into <code>main</code>.</li></ol>
<pre><code class="language-bash">git branch --list <span class="tok-string">'fix/*'</span>
  fix/login-500
git log --oneline --graph      <span class="tok-comment"># two "bumps" that left main and came back</span></code></pre>
<p><strong>Done when:</strong> <code>git log --oneline --graph</code> shows two merge commits on <code>main</code>, <code>git branch</code> lists only <code>main</code>, and your one-line team rule names a model and explains the choice with the release question (how many versions are live).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Branching strategy</span><span class="v">The team agreement on which branches exist, how long they live and where they merge.</span></div>
  <div class="kv"><span class="k">Long-lived branch</span><span class="v">A branch that never gets deleted (<code>main</code>, <code>develop</code>). Everything else should be short-lived.</span></div>
  <div class="kv"><span class="k">Trunk</span><span class="v">The single shared integration branch — in practice, <code>main</code>.</span></div>
  <div class="kv"><span class="k">Feature flag</span><span class="v">A runtime switch that lets unfinished code sit on main turned off.</span></div>
  <div class="kv"><span class="k">Release branch</span><span class="v"><code>release/1.5.0</code>: cut to stabilise one version; only fixes land there.</span></div>
  <div class="kv"><span class="k">Back-merge</span><span class="v">Merging a fix from <code>main</code> (or a hotfix) back into <code>develop</code> so the next release keeps it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Choose a strategy by how you release, not by which diagram looks most thorough.</li><li>One live version and deploys any day → GitHub flow; add strong tests and feature flags → trunk-based.</li><li>Several supported versions or store-gated releases → release branches, i.e. git-flow or a variant.</li><li>git-flow's classic failure is the forgotten back-merge of a hotfix into <code>develop</code>.</li><li>Whatever the model, keep branches short and name them with consistent prefixes.</li></ul>

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
${slide('git-07', 3, 'GitHub flow: một nhánh sống lâu là main')}
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
${slide('git-07', 4, 'Trunk-based: nhánh sống vài giờ, việc dở nằm sau cờ')}
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
${slide('git-07', 5, 'git-flow: main, develop, release/*, hotfix/*')}
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
${slide('git-07', 6, 'Chọn chiến lược theo cách bạn phát hành')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Có nhiều hơn một phiên bản đang chạy không?</div><div class="lz-d">Có → bạn cần nhánh phát hành (git-flow hoặc một biến thể). Không → đi tiếp.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Ngày nào bạn cũng deploy được không?</div><div class="lz-d">Được → GitHub flow. Bị chặn bởi khâu duyệt của cửa hàng hay một cửa sổ phát hành → giữ một nhánh phát hành.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Bạn có bộ test chắc và cờ tính năng chưa?</div><div class="lz-d">Có → trunk-based. Chưa → GitHub flow với nhánh dài hơn một chút, và hãy xây bộ test.</div></div>
</div>

<div class="callout ok"><strong>Với đồ án nhóm ở trường (SWP391, 4–5 người, một web app, một hạn nộp):</strong> trả lời ba câu hỏi trên là ra GitHub flow — một <code>main</code> được bảo vệ, mỗi việc một nhánh ngắn, mọi thay đổi đi qua pull request. Nếu giảng viên hay nhóm muốn có nhánh <code>develop</code> thì bạn đang chạy một nửa git-flow: khi đó <code>main</code> chỉ nhận các lần merge đã test từ <code>develop</code>, và bản vá nào làm thẳng trên <code>main</code> phải được merge ngược (back-merge) về <code>develop</code> ngay trong ngày.</div>

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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong kho sân tập <code>thu-git</code>, đóng vai hai bạn cùng nhóm: <code>git switch -c feature/avatar</code>, tạo <code>avatar.txt</code>, commit <code>feat: avatar</code>, rồi <code>git switch main</code>. Làm tương tự với <code>git switch -c fix/login-500</code> và một dòng sửa trong <code>a.txt</code>, commit <code>fix: login 500</code>.</li><li>Quay về <code>main</code>, chỉ liệt kê nhánh sửa lỗi: <code>git branch --list 'fix/*'</code>. Giữ nguyên dấu nháy — thiếu nó thì zsh tự bung dấu <code>*</code> và báo "no matches found".</li><li>Tích hợp cả hai như một pull request sẽ làm: <code>git merge --no-ff feature/avatar</code>, rồi <code>git merge --no-ff fix/login-500</code>. Xoá hai nhánh bằng <code>git branch -d</code>.</li><li>Trả lời ba câu hỏi của bài cho chính nhóm SWP391 của bạn và viết câu trả lời thành MỘT dòng có thể dán vào file CONTRIBUTING: mô hình, tiền tố nhánh, và ai được merge vào <code>main</code>.</li></ol>
<pre><code class="language-bash">git branch --list <span class="tok-string">'fix/*'</span>
  fix/login-500
git log --oneline --graph      <span class="tok-comment"># hai "cái bướu" rời main rồi nhập lại</span></code></pre>
<p><strong>Đạt khi:</strong> <code>git log --oneline --graph</code> có hai commit merge trên <code>main</code>, <code>git branch</code> chỉ còn <code>main</code>, và dòng quy ước của nhóm bạn gọi tên một mô hình và giải thích bằng câu hỏi phát hành (có bao nhiêu phiên bản đang chạy).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Branching strategy</span><span class="v">Chiến lược nhánh — thoả thuận của nhóm về nhánh nào tồn tại, sống bao lâu và merge vào đâu.</span></div>
  <div class="kv"><span class="k">Long-lived branch</span><span class="v">Nhánh sống lâu — nhánh không bao giờ bị xoá (<code>main</code>, <code>develop</code>). Mọi nhánh khác nên sống ngắn.</span></div>
  <div class="kv"><span class="k">Trunk</span><span class="v">Thân chính — nhánh tích hợp chung duy nhất, trên thực tế là <code>main</code>.</span></div>
  <div class="kv"><span class="k">Feature flag</span><span class="v">Cờ tính năng — công tắc lúc chạy, cho phép mã chưa xong nằm trên main ở trạng thái tắt.</span></div>
  <div class="kv"><span class="k">Release branch</span><span class="v">Nhánh phát hành — <code>release/1.5.0</code>, cắt ra để ổn định một phiên bản; chỉ nhận bản vá.</span></div>
  <div class="kv"><span class="k">Back-merge</span><span class="v">Merge ngược — đưa bản vá từ <code>main</code> (hoặc hotfix) về <code>develop</code> để bản phát hành sau vẫn giữ nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Chọn chiến lược theo cách bạn phát hành, không theo sơ đồ nào trông chỉn chu nhất.</li><li>Một phiên bản đang chạy và ngày nào cũng deploy được → GitHub flow; thêm test mạnh và cờ tính năng → trunk-based.</li><li>Nhiều phiên bản cần hỗ trợ hoặc phát hành phải qua duyệt của cửa hàng → nhánh phát hành, tức git-flow hoặc biến thể.</li><li>Thất bại kinh điển của git-flow là quên merge ngược hotfix về <code>develop</code>.</li><li>Mô hình nào cũng vậy: giữ nhánh ngắn ngày và đặt tên theo tiền tố nhất quán.</li></ul>

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
${slide('git-07', 8, 'Tag nhẹ là một file, tag annotated là một đối tượng')}
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
${slide('git-07', 9, 'Semver: MAJOR.MINOR.PATCH')}
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
${slide('git-07', 10, 'Sắp tag theo số và bẫy bản -rc')}
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
<div class="callout warn"><strong>Pre-releases need one more setting.</strong> Plain <code>--sort=-version:refname</code> puts <code>v2.0.0-rc.1</code> <em>above</em> <code>v2.0.0</code> — the opposite of semver, where a pre-release comes first. Git 2.51, real output from a repository with both tags:
<pre><code>git tag --sort=-version:refname | head -3
v2.0.0-rc.1
v2.0.0-beta.1
v2.0.0
git -c versionsort.suffix=- tag --sort=-version:refname | head -3
v2.0.0
v2.0.0-rc.1
v2.0.0-beta.1</code></pre>
Set it once with <code>git config --global versionsort.suffix -</code> (and <code>git config --global tag.sort -version:refname</code> to make plain <code>git tag</code> use this order). A release script that picks "the newest tag" without it will happily pick a release candidate.</div>

<h3>Tags are not pushed automatically</h3>
<pre><code>git push origin v1.5.0            <span class="tok-comment"># one tag</span>
git push --follow-tags            <span class="tok-comment"># commits + annotated tags pointing into them</span>
git push origin --tags            <span class="tok-comment"># every local tag, including junk</span></code></pre>
<p>Worth repeating from 5.3 because it is the most common release-day confusion: you tagged, you pushed, and the release workflow did not fire — because the tag never left your machine.</p>

<h3>git describe — a human name for any commit</h3>
${slide('git-07', 11, 'Giải phẫu một chuỗi git describe')}
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In <code>thu-git</code> on <code>main</code>, create an annotated release tag: <code>git tag -a v1.0.0 -m "Release 1.0.0"</code>. Run <code>git cat-file -t v1.0.0</code>.</li><li>Make two more commits (<code>feat: b</code>, <code>feat: c</code>), then add a lightweight tag on the newest one: <code>git tag nhap</code>. Run <code>git cat-file -t nhap</code> and compare with step 1.</li><li><strong>Write down first</strong> what <code>git describe</code> will print, then run it, then <code>git describe --tags</code>. Edit a tracked file without committing and run <code>git describe --dirty</code>; restore the file afterwards.</li><li>Sorting trap: <code>git tag v1.9.0 HEAD~1</code>, <code>git tag v1.10.0 HEAD~1</code>, <code>git tag v2.0.0-rc.1 HEAD~1</code>, <code>git tag v2.0.0 HEAD~1</code>. Compare <code>git tag --sort=-version:refname</code> with <code>git -c versionsort.suffix=- tag --sort=-version:refname</code>. Clean up with <code>git tag -d v1.9.0 v1.10.0 v2.0.0-rc.1 v2.0.0 nhap</code>.</li></ol>
<pre><code class="language-bash">git cat-file -t v1.0.0      <span class="tok-comment"># tag    ← a real object</span>
git cat-file -t nhap        <span class="tok-comment"># commit ← just a name for a commit</span>
git describe                <span class="tok-comment"># v1.0.0-2-g&lt;hash&gt; — the lightweight tag is ignored</span>
git describe --tags         <span class="tok-comment"># nhap</span></code></pre>
<p><strong>Done when:</strong> your written prediction matched the <code>v1.0.0-2-g…</code> shape before you ran it, you can say why <code>--tags</code> changed the answer, and in the second sort <code>v2.0.0</code> is on top with <code>v1.10.0</code> above <code>v1.9.0</code>. Keep <code>v1.0.0</code> — lesson 7.3 builds on it.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tag</span><span class="v">A name for one commit that, unlike a branch, never moves.</span></div>
  <div class="kv"><span class="k">Lightweight tag</span><span class="v">Only a ref file holding a hash — no author, date or message. A private bookmark.</span></div>
  <div class="kv"><span class="k">Annotated tag</span><span class="v">A tag object with tagger, date, message and optional signature; <code>git tag -a</code>. Use it for releases.</span></div>
  <div class="kv"><span class="k">Semantic versioning (semver)</span><span class="v">MAJOR.MINOR.PATCH, where each number is a promise about compatibility.</span></div>
  <div class="kv"><span class="k">Pre-release</span><span class="v"><code>-beta.1</code>, <code>-rc.1</code>: a trial build that sorts before the final version.</span></div>
  <div class="kv"><span class="k">git describe</span><span class="v">Names any commit relative to the nearest annotated tag: <code>v1.5.0-2-g705090e</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A branch moves with every commit; a tag stays on one commit forever.</li><li>Releases get annotated tags (<code>-a</code>); lightweight tags are private bookmarks that <code>git describe</code> ignores by default.</li><li>Semver: breaking → MAJOR, new feature → MINOR, bug fix → PATCH, and 0.x promises nothing.</li><li>Sort tags by version, and add <code>versionsort.suffix=-</code> so <code>-rc</code> builds sort before the final release.</li><li>Tags are not pushed by plain <code>git push</code>: use <code>--follow-tags</code> or push the tag by name, and never move one that is published.</li></ul>

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
${slide('git-07', 8, 'Tag nhẹ là một file, tag annotated là một đối tượng')}
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
${slide('git-07', 9, 'Semver: MAJOR.MINOR.PATCH')}
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
${slide('git-07', 10, 'Sắp tag theo số và bẫy bản -rc')}
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
<div class="callout warn"><strong>Bản tiền phát hành cần thêm một thiết lập.</strong> Chỉ có <code>--sort=-version:refname</code> thì <code>v2.0.0-rc.1</code> đứng <em>trên</em> <code>v2.0.0</code> — ngược với semver, nơi bản tiền phát hành (pre-release) phải đứng trước. Output thật của Git 2.51 trong một kho có cả hai tag:
<pre><code>git tag --sort=-version:refname | head -3
v2.0.0-rc.1
v2.0.0-beta.1
v2.0.0
git -c versionsort.suffix=- tag --sort=-version:refname | head -3
v2.0.0
v2.0.0-rc.1
v2.0.0-beta.1</code></pre>
Đặt một lần bằng <code>git config --global versionsort.suffix -</code> (và <code>git config --global tag.sort -version:refname</code> để <code>git tag</code> trần cũng sắp theo thứ tự này). Script phát hành nào chọn "tag mới nhất" mà thiếu nó sẽ vui vẻ chọn nhầm một bản rc (release candidate — bản ứng viên).</div>

<h3>Tag không tự động được push</h3>
<pre><code>git push origin v1.5.0            <span class="tok-comment"># một tag</span>
git push --follow-tags            <span class="tok-comment"># commit + các tag có chú thích trỏ vào chúng</span>
git push origin --tags            <span class="tok-comment"># mọi tag cục bộ, kể cả rác</span></code></pre>
<p>Đáng nhắc lại từ bài 5.3 vì đây là nỗi bối rối phổ biến nhất trong ngày phát hành: bạn đã gắn tag, đã push, mà workflow phát hành không chạy — vì cái tag chưa bao giờ rời khỏi máy bạn.</p>

<h3>git describe — một cái tên đọc được cho mọi commit</h3>
${slide('git-07', 11, 'Giải phẫu một chuỗi git describe')}
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong <code>thu-git</code>, trên <code>main</code>, tạo một tag phát hành có chú thích: <code>git tag -a v1.0.0 -m "Release 1.0.0"</code>. Chạy <code>git cat-file -t v1.0.0</code>.</li><li>Tạo thêm hai commit (<code>feat: b</code>, <code>feat: c</code>), rồi gắn một tag nhẹ vào commit mới nhất: <code>git tag nhap</code>. Chạy <code>git cat-file -t nhap</code> và so với bước 1.</li><li><strong>Viết ra giấy trước</strong> bạn đoán <code>git describe</code> sẽ in gì, rồi mới chạy, rồi chạy <code>git describe --tags</code>. Sửa một file đang theo dõi mà KHÔNG commit, chạy <code>git describe --dirty</code>; xong thì trả file về như cũ.</li><li>Bẫy sắp xếp: <code>git tag v1.9.0 HEAD~1</code>, <code>git tag v1.10.0 HEAD~1</code>, <code>git tag v2.0.0-rc.1 HEAD~1</code>, <code>git tag v2.0.0 HEAD~1</code>. So <code>git tag --sort=-version:refname</code> với <code>git -c versionsort.suffix=- tag --sort=-version:refname</code>. Dọn bằng <code>git tag -d v1.9.0 v1.10.0 v2.0.0-rc.1 v2.0.0 nhap</code>.</li></ol>
<pre><code class="language-bash">git cat-file -t v1.0.0      <span class="tok-comment"># tag    ← một đối tượng thật</span>
git cat-file -t nhap        <span class="tok-comment"># commit ← chỉ là một cái tên cho commit</span>
git describe                <span class="tok-comment"># v1.0.0-2-g&lt;mã&gt; — tag nhẹ bị lờ đi</span>
git describe --tags         <span class="tok-comment"># nhap</span></code></pre>
<p><strong>Đạt khi:</strong> dự đoán trên giấy của bạn đúng dạng <code>v1.0.0-2-g…</code> trước khi chạy, bạn giải thích được vì sao <code>--tags</code> đổi câu trả lời, và ở lần sắp thứ hai <code>v2.0.0</code> đứng đầu còn <code>v1.10.0</code> đứng trên <code>v1.9.0</code>. Giữ lại <code>v1.0.0</code> — bài 7.3 dùng tiếp nó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tag</span><span class="v">Thẻ — một cái tên cho một commit; khác nhánh ở chỗ nó không bao giờ dịch chuyển.</span></div>
  <div class="kv"><span class="k">Lightweight tag</span><span class="v">Tag nhẹ — chỉ là một file ref chứa mã băm, không tác giả, không ngày, không lời nhắn. Đánh dấu trang riêng tư.</span></div>
  <div class="kv"><span class="k">Annotated tag</span><span class="v">Tag có chú thích — một đối tượng tag có người gắn, ngày, lời nhắn, ký được; tạo bằng <code>git tag -a</code>. Dùng cho bản phát hành.</span></div>
  <div class="kv"><span class="k">Semantic versioning (semver)</span><span class="v">Đánh phiên bản ngữ nghĩa — MAJOR.MINOR.PATCH, mỗi con số là một lời hứa về tính tương thích.</span></div>
  <div class="kv"><span class="k">Pre-release</span><span class="v">Bản tiền phát hành — <code>-beta.1</code>, <code>-rc.1</code>: bản dùng thử, xếp TRƯỚC bản chính thức.</span></div>
  <div class="kv"><span class="k">git describe</span><span class="v">Đặt tên cho mọi commit theo tag annotated gần nhất: <code>v1.5.0-2-g705090e</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Nhánh dịch chuyển theo mỗi commit; tag đứng yên trên một commit mãi mãi.</li><li>Bản phát hành dùng tag có chú thích (<code>-a</code>); tag nhẹ là đánh dấu trang riêng, và <code>git describe</code> mặc định lờ nó đi.</li><li>Semver: phá tương thích → MAJOR, thêm chức năng → MINOR, sửa lỗi → PATCH, còn 0.x thì không hứa gì.</li><li>Sắp tag theo số phiên bản, và thêm <code>versionsort.suffix=-</code> để bản <code>-rc</code> xếp trước bản chính thức.</li><li><code>git push</code> trần không đẩy tag: dùng <code>--follow-tags</code> hoặc đẩy tag theo tên, và đừng bao giờ dời một tag đã công bố.</li></ul>

<a class="link-card" href="https://semver.org/lang/vi/" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">Semantic Versioning 2.0.0 — bản đặc tả (có tiếng Việt)</span><span class="lc-sub">Ngắn và đáng đọc trọn vẹn một lần; luật sắp thứ tự bản tiền phát hành là chỗ người ta hay hiểu sai.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Basics-Tagging" target="_blank" rel="noopener">
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
${slide('git-07', 13, 'Changelog: dữ liệu thô từ git log, viết lại cho người đọc')}
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
${slide('git-07', 14, 'Cắt một bản phát hành trong 5 bước')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Decide the version</div><div class="lz-d">Read the commits since the last tag: any <code>feat</code> → minor; only <code>fix</code> → patch; any breaking change → major.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Update version and changelog</div><div class="lz-d"><code>npm version minor</code> plus the CHANGELOG section, in one commit.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Tag, annotated</div><div class="lz-d"><code>git tag -a v1.5.0 -m "…"</code> — or let <code>npm version</code> do it.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Push commits AND tags</div><div class="lz-d"><code>git push --follow-tags</code>. This is what triggers the release workflow.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Verify what shipped</div><div class="lz-d">Check the artefact reports the version you expect — <code>git describe</code> baked into the build (7.2).</div></div>
</div>

<h3>Hotfix — production is broken right now</h3>
${slide('git-07', 15, 'Hotfix rẽ từ tag đang chạy, không từ main')}
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
${slide('git-07', 16, 'cherry-pick -x: cùng thay đổi, mã băm mới, có dấu vết')}
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Continue in <code>thu-git</code>, which has <code>v1.0.0</code> from 7.2. Add two "unreleased" commits on <code>main</code> that touch only a new file: <code>moi.txt</code> (<code>feat: tinh nang moi</code>, <code>feat: tinh nang moi 2</code>).</li><li>Production (<code>v1.0.0</code>) has a bug in <code>a.txt</code>. Branch from the <strong>tag</strong>, not from main: <code>git switch -c hotfix/sua-a v1.0.0</code>. Add a line to <code>a.txt</code>, commit <code>fix: sua loi trong a.txt</code>, then <code>git tag -a v1.0.1 -m "Hotfix 1.0.1"</code>.</li><li>Check that the release contains the fix and nothing else: <code>git log --oneline v1.0.0..v1.0.1</code> must print exactly one line — the two <code>moi.txt</code> commits are not in it.</li><li>Bring the fix home: <code>git switch main</code>, <code>git cherry-pick -x hotfix/sua-a</code>, then read the message with <code>git log -1 --format=%B</code>. Write a <code>## [1.0.1]</code> section with a <code>### Fixed</code> line in <code>CHANGELOG.md</code> and commit it.</li></ol>
<pre><code class="language-bash">git log -1 --format=%B
fix: sua loi trong a.txt

(cherry picked from commit e096f3fbfbe49a9e4cdd3835248731e7434bb678)   <span class="tok-comment"># your hash will differ</span></code></pre>
<p><strong>Done when:</strong> <code>git log --oneline --graph --all</code> shows the hotfix branch leaving the graph at <code>v1.0.0</code>, <code>git describe hotfix/sua-a</code> prints <code>v1.0.1</code>, and the cherry-picked commit on <code>main</code> has a different hash from the original yet carries the "(cherry picked from commit …)" line.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Release</span><span class="v">A tagged version plus the notes that describe it (on GitHub: a Release page with assets).</span></div>
  <div class="kv"><span class="k">Changelog</span><span class="v">The human-readable list of changes per version, newest first (Added / Changed / Fixed / Security…).</span></div>
  <div class="kv"><span class="k">Release notes</span><span class="v">The text shown for one release; GitHub can generate it from merged pull requests.</span></div>
  <div class="kv"><span class="k">Hotfix</span><span class="v">An urgent fix to what is live, branched from the released tag and shipped as a PATCH version.</span></div>
  <div class="kv"><span class="k">Cherry-pick</span><span class="v">Re-applies one existing commit's change on another branch as a new commit with a new hash.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>With Conventional Commits, <code>git log v1.4.0..v1.5.0</code> is the raw changelog; rewrite it for the person deciding whether to upgrade.</li><li>A release is: pick the number, bump version + changelog in one commit, annotated tag, <code>git push --follow-tags</code>, verify what shipped.</li><li>A hotfix branches from the tag that is live, never from a <code>main</code> full of unreleased work.</li><li>The fix must come back to <code>main</code> (merge or <code>cherry-pick -x</code>), or the next release loses it.</li><li><code>cherry-pick -x</code> makes a new commit and records where it came from; use it in one direction, not instead of merging.</li></ul>

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
${slide('git-07', 13, 'Changelog: dữ liệu thô từ git log, viết lại cho người đọc')}
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
${slide('git-07', 14, 'Cắt một bản phát hành trong 5 bước')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Quyết định số phiên bản</div><div class="lz-d">Đọc các commit kể từ tag cuối: có <code>feat</code> → minor; chỉ có <code>fix</code> → patch; có thay đổi phá vỡ tương thích → major.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Cập nhật phiên bản và changelog</div><div class="lz-d"><code>npm version minor</code> cộng mục trong CHANGELOG, trong một commit.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Gắn tag, có chú thích</div><div class="lz-d"><code>git tag -a v1.5.0 -m "…"</code> — hoặc để <code>npm version</code> làm hộ.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Push cả commit LẪN tag</div><div class="lz-d"><code>git push --follow-tags</code>. Đây mới là thứ kích hoạt workflow phát hành.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Kiểm chứng thứ đã lên</div><div class="lz-d">Xem sản phẩm có báo đúng phiên bản bạn mong đợi không — <code>git describe</code> nướng vào bản dựng (bài 7.2).</div></div>
</div>

<h3>Hotfix — production đang hỏng ngay lúc này</h3>
${slide('git-07', 15, 'Hotfix rẽ từ tag đang chạy, không từ main')}
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
${slide('git-07', 16, 'cherry-pick -x: cùng thay đổi, mã băm mới, có dấu vết')}
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Làm tiếp trong <code>thu-git</code>, nơi đã có <code>v1.0.0</code> từ bài 7.2. Thêm hai commit "chưa phát hành" trên <code>main</code> chỉ đụng tới một file mới: <code>moi.txt</code> (<code>feat: tinh nang moi</code>, <code>feat: tinh nang moi 2</code>).</li><li>Bản đang chạy (<code>v1.0.0</code>) có lỗi trong <code>a.txt</code>. Rẽ nhánh từ <strong>tag</strong>, không phải từ main: <code>git switch -c hotfix/sua-a v1.0.0</code>. Thêm một dòng vào <code>a.txt</code>, commit <code>fix: sua loi trong a.txt</code>, rồi <code>git tag -a v1.0.1 -m "Hotfix 1.0.1"</code>.</li><li>Kiểm rằng bản phát hành chứa đúng bản vá và không gì khác: <code>git log --oneline v1.0.0..v1.0.1</code> phải in đúng MỘT dòng — hai commit của <code>moi.txt</code> không có trong đó.</li><li>Mang bản vá về nhà: <code>git switch main</code>, <code>git cherry-pick -x hotfix/sua-a</code>, rồi đọc lời nhắn bằng <code>git log -1 --format=%B</code>. Viết một mục <code>## [1.0.1]</code> có dòng <code>### Fixed</code> trong <code>CHANGELOG.md</code> và commit nó.</li></ol>
<pre><code class="language-bash">git log -1 --format=%B
fix: sua loi trong a.txt

(cherry picked from commit e096f3fbfbe49a9e4cdd3835248731e7434bb678)   <span class="tok-comment"># mã băm của bạn sẽ khác</span></code></pre>
<p><strong>Đạt khi:</strong> <code>git log --oneline --graph --all</code> cho thấy nhánh hotfix tách khỏi đồ thị đúng tại <code>v1.0.0</code>, <code>git describe hotfix/sua-a</code> in <code>v1.0.1</code>, và commit được cherry-pick trên <code>main</code> có mã băm KHÁC bản gốc nhưng mang dòng "(cherry picked from commit …)".</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Release</span><span class="v">Bản phát hành — một phiên bản đã gắn tag cộng phần ghi chú mô tả nó (trên GitHub: trang Release kèm file tải về).</span></div>
  <div class="kv"><span class="k">Changelog</span><span class="v">Nhật ký thay đổi — danh sách thay đổi theo từng phiên bản cho người đọc, mới nhất ở trên (Added / Changed / Fixed / Security…).</span></div>
  <div class="kv"><span class="k">Release notes</span><span class="v">Ghi chú phát hành — đoạn chữ của MỘT bản phát hành; GitHub sinh được từ các pull request đã merge.</span></div>
  <div class="kv"><span class="k">Hotfix</span><span class="v">Bản vá khẩn — sửa thứ đang chạy, rẽ nhánh từ tag đã phát hành và ra một bản PATCH.</span></div>
  <div class="kv"><span class="k">Cherry-pick</span><span class="v">Nhặt commit — áp lại thay đổi của một commit có sẵn lên nhánh khác, thành commit mới với mã băm mới.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Có Conventional Commits thì <code>git log v1.4.0..v1.5.0</code> chính là changelog thô; hãy viết lại nó cho người đang quyết định có nâng cấp hay không.</li><li>Một lần phát hành: chọn số, tăng version + changelog trong một commit, tag có chú thích, <code>git push --follow-tags</code>, kiểm thứ đã lên.</li><li>Hotfix rẽ từ tag đang chạy, không bao giờ từ một <code>main</code> đầy việc chưa phát hành.</li><li>Bản vá phải quay về <code>main</code> (merge hoặc <code>cherry-pick -x</code>), nếu không bản phát hành sau sẽ mất nó.</li><li><code>cherry-pick -x</code> tạo commit mới và ghi lại nó đến từ đâu; dùng theo một chiều, đừng dùng thay cho merge.</li></ul>

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
      description: 'Mười tình huống về chọn chiến lược nhánh, cờ tính năng, merge ngược trong git-flow, tag nhẹ vs có chú thích, semver, sắp tag có bản -rc, đẩy tag, dời tag đã công bố, hotfix từ tag và cherry-pick -x.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from team projects and release days. Each one is decided by a single idea from this chapter — read the explanation after submitting, especially for the ones you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can pick GitHub flow, trunk-based or git-flow for a team by asking how many versions are live and how often we can deploy.</li>
<li>I know what a git-flow hotfix must be merged into, and what happens when someone forgets.</li>
<li>I can tell a lightweight tag from an annotated one with <code>git cat-file -t</code>, and I know which one <code>git describe</code> uses.</li>
<li>I can compute the next semver number from a list of <code>feat:</code> / <code>fix:</code> / breaking commits.</li>
<li>I know why a pushed tag did not trigger a release workflow, and why moving a published tag is worse than publishing a patch.</li>
<li>I can branch a hotfix from the live tag and bring the fix back to <code>main</code> with <code>cherry-pick -x</code>.</li>
</ul>
${slide('git-07', 17, 'Bảng tra nhanh Chương 7')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ đồ án nhóm và ngày phát hành. Câu nào cũng được quyết định bởi một ý của chương này — đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chọn được GitHub flow, trunk-based hay git-flow cho một nhóm bằng cách hỏi có bao nhiêu phiên bản đang chạy và deploy được thường xuyên tới đâu.</li>
<li>Tôi biết trong git-flow một hotfix phải được merge vào đâu, và chuyện gì xảy ra khi có người quên.</li>
<li>Tôi phân biệt được tag nhẹ với tag có chú thích bằng <code>git cat-file -t</code>, và biết <code>git describe</code> dùng loại nào.</li>
<li>Tôi tính được số semver kế tiếp từ một danh sách commit <code>feat:</code> / <code>fix:</code> / phá tương thích.</li>
<li>Tôi biết vì sao đã push mà tag không kích hoạt workflow phát hành, và vì sao dời một tag đã công bố tệ hơn ra một bản patch.</li>
<li>Tôi rẽ được nhánh hotfix từ tag đang chạy và mang bản vá về <code>main</code> bằng <code>cherry-pick -x</code>.</li>
</ul>
${slide('git-07', 17, 'Bảng tra nhanh Chương 7')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Your SWP391 team (5 people) builds one web app with one live deployment, and you can deploy whenever main is green. Which branching strategy fits best?|||Nhóm SWP391 của bạn (5 người) làm một web app, chỉ có một bản đang chạy, và deploy được bất cứ lúc nào main xanh. Chiến lược nhánh nào hợp nhất?',
            options: [
              'git-flow with develop, release/* and hotfix/*, because it is the most complete model|||git-flow với develop, release/* và hotfix/*, vì đó là mô hình đầy đủ nhất',
              'GitHub flow: a protected main, one short branch per task, every change through a pull request|||GitHub flow: main được bảo vệ, mỗi việc một nhánh ngắn, mọi thay đổi đi qua pull request',
              'One personal long-lived branch per member, all merged into main at the end of each sprint|||Mỗi thành viên một nhánh riêng sống lâu, cuối mỗi sprint mới merge hết vào main',
              'Everyone commits directly to main without branches, since the team is small|||Mọi người commit thẳng vào main không cần nhánh, vì nhóm nhỏ',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: One live version and deploys any day is exactly the case GitHub flow was built for. git-flow is tempting because it looks thorough, but develop and release branches exist for multiple live versions — here they are just a second branch to keep in sync. Per-member sprint-long branches maximise merge pain; committing straight to main skips review and CI.|||VI: Một bản đang chạy và ngày nào cũng deploy được chính là tình huống GitHub flow sinh ra để phục vụ. git-flow hấp dẫn vì trông chỉn chu, nhưng develop và nhánh phát hành tồn tại cho trường hợp nhiều phiên bản cùng chạy — ở đây chúng chỉ là thêm một nhánh phải giữ đồng bộ. Mỗi người một nhánh dài cả sprint làm nỗi đau merge lớn nhất; commit thẳng vào main thì bỏ qua review và CI.',
          },
          {
            question: 'Your team works trunk-based. A new checkout page will take about three weeks. What should you do?|||Nhóm bạn làm trunk-based. Trang thanh toán mới cần khoảng ba tuần. Bạn nên làm gì?',
            options: [
              'Merge small pieces into main every day, hidden behind a feature flag that stays off until the page is ready|||Merge từng phần nhỏ vào main mỗi ngày, giấu sau một cờ tính năng để tắt cho tới khi trang xong',
              'Keep a feature branch for three weeks and merge it once when everything works|||Giữ một nhánh tính năng suốt ba tuần và merge một lần khi mọi thứ chạy',
              'Create a develop branch just for this feature and merge develop into main at the end|||Tạo nhánh develop riêng cho tính năng này rồi cuối cùng merge develop vào main',
              'Work on main locally for three weeks and push only when finished|||Làm trên main ở máy mình suốt ba tuần và chỉ push khi xong',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Trunk-based means integrating at least daily; a feature flag lets unfinished code live on main switched off, so there is never a long branch to merge. The tempting "one merge at the end" is the three-week branch whose merge pain grows faster than its age. Working unpushed on local main is the same long branch, just invisible to the team.|||VI: Trunk-based nghĩa là tích hợp ít nhất mỗi ngày; cờ tính năng cho phép mã chưa xong nằm trên main ở trạng thái tắt, nên chẳng bao giờ có nhánh dài phải merge. Phương án "merge một lần cuối cùng" nghe gọn nhưng chính là nhánh ba tuần mà nỗi đau merge tăng nhanh hơn tuổi của nó. Làm trên main ở máy mình mà không push cũng là một nhánh dài, chỉ là cả nhóm không thấy.',
          },
          {
            question: 'In a git-flow project, a hotfix for v1.1.0 was merged into main and tagged v1.1.1, but nobody merged it into develop. What happens when v1.2.0 is cut from develop?|||Trong một dự án git-flow, hotfix cho v1.1.0 đã merge vào main và gắn tag v1.1.1, nhưng không ai merge nó vào develop. Chuyện gì xảy ra khi v1.2.0 được cắt từ develop?',
            options: [
              'Git refuses to create the release branch until the hotfix is merged|||Git từ chối tạo nhánh phát hành cho tới khi hotfix được merge',
              'Nothing — tags are shared across branches, so v1.2.0 inherits the fix|||Không sao cả — tag dùng chung cho mọi nhánh, nên v1.2.0 thừa hưởng bản vá',
              'v1.2.0 ships without the fix and the bug returns in production|||v1.2.0 lên production mà thiếu bản vá, và con lỗi quay lại',
              'The fix is applied twice and causes a conflict in production|||Bản vá bị áp hai lần và gây xung đột trên production',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: A release is cut from develop, and develop never received the fix, so v1.2.0 silently lacks it — the classic git-flow regression. A tag names one commit; it does not copy changes into other branches, and Git has no rule that blocks the release. The cure is a checklist or automation for the back-merge into develop.|||VI: Bản phát hành cắt từ develop, mà develop chưa từng nhận bản vá, nên v1.2.0 âm thầm thiếu nó — lỗi quay lại kinh điển của git-flow. Tag chỉ đặt tên cho một commit; nó không chép thay đổi sang nhánh khác, và Git không có luật nào chặn việc phát hành. Cách chữa là đưa bước merge ngược về develop vào danh sách kiểm hoặc tự động hoá nó.',
          },
          {
            question: 'You ran "git tag sang-thu-2" on HEAD, but "git describe" still prints v1.5.0-2-g705090e. Why?|||Bạn chạy "git tag sang-thu-2" tại HEAD, nhưng "git describe" vẫn in v1.5.0-2-g705090e. Vì sao?',
            options: [
              'The new tag has not been pushed yet, and describe only reads remote tags|||Tag mới chưa được push, và describe chỉ đọc tag trên remote',
              'describe always picks the tag with the highest version number|||describe luôn chọn tag có số phiên bản cao nhất',
              'Tag names must start with "v" to be recognised|||Tên tag phải bắt đầu bằng "v" thì mới được nhận ra',
              'sang-thu-2 is a lightweight tag, and describe uses only annotated tags unless you pass --tags|||sang-thu-2 là tag nhẹ, mà describe chỉ dùng tag có chú thích trừ khi bạn thêm --tags',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Without -a, git tag creates a lightweight tag (git cat-file -t prints "commit"), and git describe considers only annotated tags by default; git describe --tags prints sang-thu-2. describe works entirely on local refs, and it picks the nearest tag, not the highest number. Tag names need no "v" prefix.|||VI: Không có -a thì git tag tạo tag nhẹ (git cat-file -t in "commit"), mà git describe mặc định chỉ xét tag có chú thích; git describe --tags sẽ in sang-thu-2. describe làm việc hoàn toàn trên ref cục bộ, và nó chọn tag GẦN nhất chứ không phải số cao nhất. Tên tag không bắt buộc có chữ "v".',
          },
          {
            question: 'Since v2.4.1 the commits are "fix(auth): …", "feat(api): add /bookings endpoint" and "fix(feed): …". Nothing is breaking. What is the next version under semver?|||Từ v2.4.1 tới giờ có các commit "fix(auth): …", "feat(api): add /bookings endpoint" và "fix(feed): …". Không có gì phá tương thích. Theo semver, phiên bản kế tiếp là gì?',
            options: [
              '2.4.3, one patch per fix|||2.4.3, mỗi bản vá tăng một patch',
              '3.0.0, because a new endpoint changes the API|||3.0.0, vì endpoint mới làm đổi API',
              '2.5.0, because the highest change is a new feature|||2.5.0, vì thay đổi lớn nhất là một chức năng mới',
              '2.5.2, one minor plus two patches|||2.5.2, một minor cộng hai patch',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: The release is sized by its biggest change: any backwards-compatible feat bumps MINOR and resets PATCH to 0, so 2.4.1 → 2.5.0; the fixes ride along. 2.4.3 undersells a new feature, and 2.5.2 counts commits instead of applying the rule. Adding an endpoint breaks nobody, so it is not MAJOR.|||VI: Một bản phát hành được định cỡ theo thay đổi lớn nhất: có feat tương thích ngược là tăng MINOR và đưa PATCH về 0, nên 2.4.1 → 2.5.0; các bản vá đi kèm luôn. 2.4.3 bỏ sót chức năng mới, còn 2.5.2 là đếm commit chứ không áp luật. Thêm endpoint không làm hỏng ai nên không phải MAJOR.',
          },
          {
            question: 'Your release script uses "git tag --sort=-version:refname | head -1" and returns v2.0.0-rc.1 even though v2.0.0 exists. What fixes it?|||Script phát hành của bạn dùng "git tag --sort=-version:refname | head -1" và trả về v2.0.0-rc.1 dù đã có v2.0.0. Sửa thế nào?',
            options: [
              'Set versionsort.suffix to "-" so versions with a -suffix sort before the final release|||Đặt versionsort.suffix là "-" để bản có hậu tố -... xếp trước bản chính thức',
              'Drop --sort and use plain alphabetical order|||Bỏ --sort, dùng thứ tự bảng chữ cái thuần',
              'Recreate v2.0.0 as a lightweight tag|||Tạo lại v2.0.0 thành tag nhẹ',
              'Use --sort=version:refname without the minus sign|||Dùng --sort=version:refname bỏ dấu trừ',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Plain version sort treats "-rc.1" as coming after 2.0.0 — the output in lesson 7.2 shows it on top. git -c versionsort.suffix=- (or git config --global versionsort.suffix -) makes suffixed versions sort before the release, matching semver. Alphabetical order puts v1.10.0 before v1.9.0; removing the minus only reverses the list, so head -1 would return the OLDEST tag.|||VI: Sắp theo phiên bản trần coi "-rc.1" đứng sau 2.0.0 — output trong bài 7.2 cho thấy nó nằm trên cùng. git -c versionsort.suffix=- (hoặc git config --global versionsort.suffix -) làm bản có hậu tố xếp trước bản chính thức, khớp semver. Thứ tự bảng chữ cái đặt v1.10.0 trước v1.9.0; bỏ dấu trừ chỉ đảo ngược danh sách, nên head -1 sẽ trả về tag CŨ nhất.',
          },
          {
            question: 'You ran "git tag -a v1.5.0 -m …" and then "git push". The GitHub workflow "on: push: tags: [v*]" did not run. Most likely cause?|||Bạn chạy "git tag -a v1.5.0 -m …" rồi "git push". Workflow GitHub "on: push: tags: [v*]" không chạy. Nguyên nhân khả dĩ nhất?',
            options: [
              'Annotated tags cannot trigger workflows; only lightweight ones can|||Tag có chú thích không kích hoạt được workflow; chỉ tag nhẹ mới được',
              'The pattern v* does not match v1.5.0|||Mẫu v* không khớp v1.5.0',
              'GitHub needs a few hours to notice new tags|||GitHub cần vài giờ mới nhận ra tag mới',
              'Plain git push does not send tags; the tag never left your machine|||git push trần không gửi tag; cái tag chưa bao giờ rời máy bạn',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: git push pushes branches, not tags. On slide 12 of this chapter (real output), git ls-remote --tags origin stayed empty after git push and only listed v1.5.0 after git push --follow-tags (or git push origin v1.5.0). Annotated tags are exactly what --follow-tags sends, v* does match v1.5.0, and there is no hours-long delay.|||VI: git push đẩy nhánh, không đẩy tag. Trên slide 12 của chương (output thật), git ls-remote --tags origin vẫn trống sau git push và chỉ có v1.5.0 sau git push --follow-tags (hoặc git push origin v1.5.0). Tag có chú thích chính là loại mà --follow-tags gửi đi, v* có khớp v1.5.0, và không có độ trễ vài giờ nào cả.',
          },
          {
            question: 'An hour ago you pushed tag v1.5.0 on the wrong commit. Teammates have fetched, and CI already built and published an artefact from it. Best response?|||Một giờ trước bạn đã push tag v1.5.0 lên nhầm commit. Bạn cùng nhóm đã fetch, và CI đã dựng và công bố một bản từ nó. Cách xử lý tốt nhất?',
            options: [
              'Delete v1.5.0 locally and on the remote, recreate it on the right commit, and push again|||Xoá v1.5.0 ở máy và trên remote, tạo lại trên đúng commit rồi push lại',
              'Leave v1.5.0 as it is and publish the correct code as v1.5.1|||Để nguyên v1.5.0 và công bố mã đúng thành v1.5.1',
              'Force-push main so the wrong commit disappears|||Force-push main để commit sai biến mất',
              'Ask everyone to delete their local clone and clone again|||Bảo mọi người xoá bản clone của mình rồi clone lại',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Once others have fetched a tag and an artefact was built from it, moving it makes "1.5.0" mean two different things — Git does not silently update tags teammates already have. Re-tagging is acceptable only minutes after the mistake, before anyone fetched. Force-pushing main rewrites shared history and still leaves the tag; recloning is disruptive and does not fix the published artefact.|||VI: Khi người khác đã fetch tag và đã có bản dựng từ nó, dời tag làm "1.5.0" mang hai nghĩa khác nhau — Git không âm thầm cập nhật tag mà bạn cùng nhóm đã có. Tạo lại tag chỉ chấp nhận được trong vài phút sau lúc lỡ tay, trước khi ai fetch. Force-push main là viết lại lịch sử chung mà tag vẫn còn đó; bắt clone lại thì phiền cả nhóm và không sửa được bản đã công bố.',
          },
          {
            question: 'Production runs v1.5.0. Since then main has two merged but unreleased profile features. Payments are failing right now. Where do you start the hotfix branch?|||Production đang chạy v1.5.0. Từ đó tới giờ main có thêm hai tính năng profile đã merge nhưng chưa phát hành. Thanh toán đang lỗi ngay lúc này. Bạn rẽ nhánh hotfix từ đâu?',
            options: [
              'From the tag that is live: git switch -c hotfix/payment-timeout v1.5.0|||Từ tag đang chạy: git switch -c hotfix/payment-timeout v1.5.0',
              'From main, because it has the newest code|||Từ main, vì nó có mã mới nhất',
              'From the last feature branch, because it is already tested|||Từ nhánh tính năng gần nhất, vì nó đã được test',
              'From develop, and merge develop into production|||Từ develop, rồi merge develop lên production',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Branching from v1.5.0 gives you exactly the code in production plus one fix, released as v1.5.1. "Newest code" is the trap: branching from main would ship the two untested profile features in the middle of an incident. Afterwards bring the fix back to main (merge or cherry-pick -x) so 1.6.0 keeps it.|||VI: Rẽ từ v1.5.0 cho bạn đúng mã đang chạy trên production cộng một bản vá, phát hành thành v1.5.1. "Mã mới nhất" chính là cái bẫy: rẽ từ main là đẩy luôn hai tính năng profile chưa kiểm trên production lên ngay giữa sự cố. Sau đó mang bản vá về main (merge hoặc cherry-pick -x) để bản 1.6.0 vẫn giữ nó.',
          },
          {
            question: 'On main you run "git cherry-pick -x a3cd15c" (the hotfix commit). What do you get?|||Trên main bạn chạy "git cherry-pick -x a3cd15c" (commit hotfix). Bạn nhận được gì?',
            options: [
              'main now points at a3cd15c itself, so both branches share the commit|||main giờ trỏ thẳng vào a3cd15c, hai nhánh dùng chung commit đó',
              'A merge commit with two parents, main and the hotfix branch|||Một commit merge có hai cha, main và nhánh hotfix',
              'A new commit with the same change but a new hash, whose message ends with "(cherry picked from commit a3cd15c…)"|||Một commit mới cùng thay đổi nhưng mã băm mới, lời nhắn có thêm dòng "(cherry picked from commit a3cd15c…)"',
              'The hotfix branch is deleted after its commit is copied|||Nhánh hotfix bị xoá sau khi commit được chép sang',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: cherry-pick re-applies the change on top of main, so the parent differs and the hash differs — in the lesson run a3cd15c became 13e7314 — and -x appends the "(cherry picked from commit …)" line. It does not move main to the original commit (that would drop main’s own work), it does not create a two-parent merge (that is git merge), and it never deletes branches.|||VI: cherry-pick áp lại thay đổi lên đầu main, nên cha khác và mã băm khác — trong lần chạy của bài, a3cd15c thành 13e7314 — còn -x nối thêm dòng "(cherry picked from commit …)". Nó không dời main về commit gốc (làm vậy là vứt việc riêng của main), không tạo commit merge hai cha (đó là git merge), và không bao giờ xoá nhánh.',
          },
        ],
      },
    },
  ],
};
