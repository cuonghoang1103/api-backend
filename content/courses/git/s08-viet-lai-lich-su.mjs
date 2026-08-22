/**
 * Git & GitHub — Chương 8: Viết lại lịch sử an toàn.
 * amend · force-with-lease vs force · gỡ bí mật khỏi TOÀN BỘ lịch sử (filter-repo)
 * · viết lại lớn (đổi email tác giả, tách/gộp kho) và chi phí phối hợp · quiz.
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 8 — Rewriting history safely|||Chương 8 — Viết lại lịch sử an toàn',
  description: 'Viết lại lịch sử là công cụ mạnh nhất và nguy hiểm nhất của Git. Chương này đi từ amend một commit, qua force-push có chốt an toàn, tới gỡ một khoá API bị lộ khỏi mọi commit từng tồn tại — kèm chính xác chi phí phối hợp mà mỗi mức phải trả.',
  lessons: [
    /* ─────────────────────────── 8.1 ─────────────────────────── */
    {
      title: '8.1 — git commit --amend: fixing the last commit|||8.1 — git commit --amend: sửa commit cuối cùng',
      slug: 'git-8-1-amend',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Amend thật ra làm gì (nó KHÔNG sửa commit, nó tạo commit mới), ba trường hợp dùng hằng ngày, giữ nguyên lời nhắn với --no-edit, và ranh giới an toàn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>The smallest history rewrite there is</h2>
<p class="lead">You commit, and half a second later notice the typo in the message, or the file you forgot to stage. <code>git commit --amend</code> fixes it — and understanding exactly what it does is the gentlest possible introduction to everything else in this chapter.</p>

<pre><code>git commit -m <span class="tok-string">"feat(auth): add refresh tokn rotation"</span>   <span class="tok-comment"># typo</span>
git commit --amend -m <span class="tok-string">"feat(auth): add refresh token rotation"</span></code></pre>
<pre><code>git log --oneline -1</code></pre>
<div class="out">e8b4d92 feat(auth): add refresh token rotation</div>
<div class="callout warn"><strong>Amend does not edit the commit.</strong> Commits are immutable (1.2). Git builds a <em>new</em> commit with the same parent and the corrected content, then moves the branch to it. The old commit still exists, unreferenced, findable in the reflog for 30 days — and its hash was <code>3f8a1c9</code> while the new one is <code>e8b4d92</code>. That hash change is the entire risk profile of this command.</div>

<h3>The three everyday uses</h3>
<pre><code><span class="tok-comment"># 1. Fix the message.</span>
git commit --amend -m <span class="tok-string">"fix(auth): reject expired refresh tokens"</span>

<span class="tok-comment"># 2. Add a file you forgot, keeping the message exactly as it was.</span>
git add src/services/token.service.ts
git commit --amend --no-edit

<span class="tok-comment"># 3. Remove something you should not have committed.</span>
git restore --staged .env
git rm --cached .env
git commit --amend --no-edit</code></pre>
<p><code>--no-edit</code> is the flag you will use most: it amends the content and leaves the message untouched, with no editor opening.</p>

<h3>Amend also updates the author date — sometimes</h3>
<pre><code>git commit --amend --no-edit --date=now        <span class="tok-comment"># set the author date to now</span>
git commit --amend --author=<span class="tok-string">"An &lt;an@example.com&gt;"</span>  <span class="tok-comment"># fix a wrong author</span>
git commit --amend --reset-author               <span class="tok-comment"># use your current config identity</span></code></pre>
<p>By default an amend keeps the original <em>author</em> date and updates the <em>committer</em> date — the two-timestamp design from 1.2. <code>--reset-author</code> is the fix for a commit made before you set <code>user.email</code> correctly (0.3), though only for the most recent one.</p>

<h3>The safety boundary</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">not pushed</div><div class="lz-t">Amend freely</div><div class="lz-d">Nobody else can have the old hash. This is a private edit.</div></div>
  <div class="lz-step"><div class="lz-k">pushed, your branch</div><div class="lz-t">Amend, then force-with-lease</div><div class="lz-d">Fine on a personal feature branch. Lesson 8.2.</div></div>
  <div class="lz-step"><div class="lz-k">pushed and shared</div><div class="lz-t">Do not amend</div><div class="lz-d">Make a new commit instead. The old hash is in other people's clones.</div></div>
</div>
<pre><code>git log --oneline @{u}..HEAD    <span class="tok-comment"># is the commit still local? empty = already pushed</span></code></pre>

<h3>What happens if you amend a pushed commit anyway</h3>
<pre><code>git commit --amend --no-edit
git push</code></pre>
<div class="out">! [rejected]        main -&gt; main (non-fast-forward)
error: failed to push some refs
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart.</div>
<p>Git is telling you that your history and the server's have diverged: the server has <code>3f8a1c9</code>, you have <code>e8b4d92</code>, and neither contains the other. On a personal branch, <code>--force-with-lease</code> resolves it. On a shared branch, stop — the correct move is <code>git pull</code> and a new commit.</p>

<h3>Amending an older commit</h3>
<p><code>--amend</code> only ever touches <code>HEAD</code>. For something three commits back, mark it and let interactive rebase (3.5) put you there:</p>
<pre><code>git rebase -i HEAD~3
<span class="tok-comment"># change "pick" to "edit" on the commit you want, save, close</span>
<span class="tok-comment"># …make your changes…</span>
git add .
git commit --amend --no-edit
git rebase --continue</code></pre>
<p>Or, for a fix you already know belongs to an earlier commit, use the <code>--fixup</code> workflow from 3.5, which is less error-prone:</p>
<pre><code>git commit --fixup 3f8a1c9
git rebase -i --autosquash HEAD~5</code></pre>

<h3>Amend vs the alternatives</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">--amend</span><span class="v">Replace the last commit. Use when the last commit is simply wrong or incomplete.</span></div>
  <div class="kv"><span class="k">reset --soft HEAD~1</span><span class="v">Undo the last commit, keep everything staged. Use when you want to re-split it into two commits (4.2).</span></div>
  <div class="kv"><span class="k">A new commit</span><span class="v">The only option once the commit is shared. "fix: correct the typo from a7c2f91" is not shameful; broken clones are.</span></div>
</div>

<a class="link-card" href="https://git-scm.com/docs/git-commit#Documentation/git-commit.txt---amend" target="_blank" rel="noopener">
  <span class="lc-ico">✏️</span>
  <span class="lc-body"><span class="lc-title">git-commit --amend — the reference</span><span class="lc-sub">Including --no-edit, --reset-author and the date behaviour.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: amend a message, add a forgotten file, remove a secret</span><span class="lc-sub">Graded exercises including the "already pushed" case.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> amending to remove a secret and thinking the secret is gone. If you had already <em>pushed</em> the original commit, the old commit is on the server and in every clone — GitHub keeps unreferenced commits reachable by URL for a long time. Amend only helps if nothing left your machine. Once it did: rotate the credential first, then clean history (8.3). Rotation is the fix; history cleaning is tidying up.</div>
<p class="note-ct"><strong>The general rule for this whole chapter, in its mildest form:</strong> every history rewrite creates new commits and abandons old ones. Locally that is free. The moment someone else has the old hashes, the cost is coordination — and coordination is the thing Git cannot automate for you.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Lần viết lại lịch sử nhỏ nhất có thể</h2>
<p class="lead">Bạn commit, và nửa giây sau nhận ra lỗi chính tả trong lời nhắn, hoặc file bạn quên đưa vào staging. <code>git commit --amend</code> sửa được — và hiểu chính xác nó làm gì là lời giới thiệu nhẹ nhàng nhất cho mọi thứ còn lại của chương này.</p>

<pre><code>git commit -m <span class="tok-string">"feat(auth): add refresh tokn rotation"</span>   <span class="tok-comment"># gõ sai</span>
git commit --amend -m <span class="tok-string">"feat(auth): add refresh token rotation"</span></code></pre>
<pre><code>git log --oneline -1</code></pre>
<div class="out">e8b4d92 feat(auth): add refresh token rotation</div>
<div class="callout warn"><strong>Amend KHÔNG sửa cái commit.</strong> Commit là bất biến (bài 1.2). Git dựng một commit <em>MỚI</em> cùng cha và nội dung đã sửa, rồi dời nhánh sang nó. Commit cũ vẫn tồn tại, không ai trỏ tới, tìm được trong reflog suốt 30 ngày — và mã băm của nó là <code>3f8a1c9</code> còn cái mới là <code>e8b4d92</code>. Chính sự đổi mã băm đó là toàn bộ hồ sơ rủi ro của lệnh này.</div>

<h3>Ba cách dùng hằng ngày</h3>
<pre><code><span class="tok-comment"># 1. Sửa lời nhắn.</span>
git commit --amend -m <span class="tok-string">"fix(auth): tu choi refresh token het han"</span>

<span class="tok-comment"># 2. Thêm một file bạn quên, giữ nguyên lời nhắn.</span>
git add src/services/token.service.ts
git commit --amend --no-edit

<span class="tok-comment"># 3. Gỡ thứ lẽ ra không nên commit.</span>
git restore --staged .env
git rm --cached .env
git commit --amend --no-edit</code></pre>
<p><code>--no-edit</code> là cái cờ bạn dùng nhiều nhất: nó amend phần nội dung và để yên lời nhắn, không mở trình soạn thảo nào.</p>

<h3>Amend cũng cập nhật ngày tác giả — đôi khi</h3>
<pre><code>git commit --amend --no-edit --date=now        <span class="tok-comment"># đặt ngày tác giả thành bây giờ</span>
git commit --amend --author=<span class="tok-string">"An &lt;an@example.com&gt;"</span>  <span class="tok-comment"># sửa một tác giả sai</span>
git commit --amend --reset-author               <span class="tok-comment"># dùng danh tính trong cấu hình hiện tại</span></code></pre>
<p>Theo mặc định, một lần amend giữ nguyên ngày <em>tác giả</em> gốc và cập nhật ngày <em>người commit</em> — thiết kế hai dấu thời gian ở bài 1.2. <code>--reset-author</code> là cách sửa cho một commit tạo ra trước khi bạn đặt đúng <code>user.email</code> (bài 0.3), dù chỉ cho commit gần nhất.</p>

<h3>Ranh giới an toàn</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">chưa push</div><div class="lz-t">Amend thoải mái</div><div class="lz-d">Không ai khác có mã băm cũ. Đây là một lần sửa riêng tư.</div></div>
  <div class="lz-step"><div class="lz-k">đã push, nhánh của bạn</div><div class="lz-t">Amend, rồi force-with-lease</div><div class="lz-d">Ổn trên nhánh tính năng cá nhân. Bài 8.2.</div></div>
  <div class="lz-step"><div class="lz-k">đã push và đã chia sẻ</div><div class="lz-t">Đừng amend</div><div class="lz-d">Hãy tạo một commit mới. Mã băm cũ đang nằm trong bản clone của người khác.</div></div>
</div>
<pre><code>git log --oneline @{u}..HEAD    <span class="tok-comment"># commit còn ở cục bộ không? trống = đã push rồi</span></code></pre>

<h3>Nếu cứ amend một commit đã push thì sao</h3>
<pre><code>git commit --amend --no-edit
git push</code></pre>
<div class="out">! [rejected]        main -&gt; main (non-fast-forward)
error: failed to push some refs
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart.</div>
<p>Git đang nói rằng lịch sử của bạn và của máy chủ đã phân ly: máy chủ có <code>3f8a1c9</code>, bạn có <code>e8b4d92</code>, và không cái nào chứa cái kia. Trên nhánh cá nhân, <code>--force-with-lease</code> giải quyết xong. Trên nhánh chung, hãy dừng lại — nước đi đúng là <code>git pull</code> rồi tạo một commit mới.</p>

<h3>Amend một commit cũ hơn</h3>
<p><code>--amend</code> chỉ bao giờ đụng vào <code>HEAD</code>. Với thứ nằm lùi ba commit, hãy đánh dấu nó và để rebase tương tác (bài 3.5) đưa bạn tới đó:</p>
<pre><code>git rebase -i HEAD~3
<span class="tok-comment"># đổi "pick" thành "edit" ở commit bạn muốn, lưu, đóng</span>
<span class="tok-comment"># …sửa những gì cần sửa…</span>
git add .
git commit --amend --no-edit
git rebase --continue</code></pre>
<p>Hoặc, với một bản vá mà bạn đã biết thuộc về commit nào trước đó, hãy dùng quy trình <code>--fixup</code> ở bài 3.5, ít sai sót hơn:</p>
<pre><code>git commit --fixup 3f8a1c9
git rebase -i --autosquash HEAD~5</code></pre>

<h3>Amend so với các lựa chọn khác</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">--amend</span><span class="v">Thay thế commit cuối. Dùng khi commit cuối đơn giản là sai hoặc thiếu.</span></div>
  <div class="kv"><span class="k">reset --soft HEAD~1</span><span class="v">Huỷ commit cuối, giữ mọi thứ ở staging. Dùng khi bạn muốn chẻ lại nó thành hai commit (bài 4.2).</span></div>
  <div class="kv"><span class="k">Một commit mới</span><span class="v">Lựa chọn duy nhất khi commit đã được chia sẻ. "fix: sửa lỗi chính tả ở a7c2f91" không có gì đáng xấu hổ; làm hỏng bản clone của người khác mới đáng.</span></div>
</div>

<a class="link-card" href="https://git-scm.com/docs/git-commit#Documentation/git-commit.txt---amend" target="_blank" rel="noopener">
  <span class="lc-ico">✏️</span>
  <span class="lc-body"><span class="lc-title">git-commit --amend — tài liệu</span><span class="lc-sub">Gồm --no-edit, --reset-author và cách nó xử lý ngày tháng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: amend lời nhắn, thêm file quên, gỡ một bí mật</span><span class="lc-sub">Bài tập chấm điểm, gồm cả ca "đã push rồi".</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> amend để gỡ một bí mật và tưởng rằng bí mật đã biến mất. Nếu bạn đã <em>push</em> commit gốc thì commit cũ nằm trên máy chủ và trong mọi bản clone — GitHub giữ những commit không ai trỏ tới ở trạng thái vẫn truy cập được bằng URL trong một thời gian dài. Amend chỉ giúp được nếu chưa có gì rời khỏi máy bạn. Khi đã rời rồi: hãy xoay chứng chỉ trước, rồi mới dọn lịch sử (bài 8.3). Xoay khoá mới là cách sửa; dọn lịch sử chỉ là dọn dẹp.</div>
<p class="note-ct"><strong>Luật chung của cả chương này, ở dạng nhẹ nhất:</strong> mọi lần viết lại lịch sử đều tạo commit mới và bỏ rơi commit cũ. Ở cục bộ thì miễn phí. Khoảnh khắc có người khác đang giữ mã băm cũ, cái giá trở thành sự phối hợp — và phối hợp chính là thứ Git không tự động hoá hộ bạn được.</p>
</div>
`,
    },

    /* ─────────────────────────── 8.2 ─────────────────────────── */
    {
      title: '8.2 — Force-pushing safely: --force-with-lease|||8.2 — Force-push an toàn: --force-with-lease',
      slug: 'git-8-2-force-with-lease',
      type: 'LESSON',
      description: 'Vì sao --force huỷ được việc của người khác, --force-with-lease chặn đúng ca đó ra sao, cái bẫy khi fetch tự động làm hỏng chốt an toàn, --force-if-includes, và cách cứu khi ai đó đã force-push đè lên bạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>The difference between a flag and a colleague's afternoon</h2>
<p class="lead">Once you rewrite a commit that is already on the server, a normal push is refused (8.1). The way past that refusal is a force push — and there are two of them. One asks no questions; the other checks first. The check is free, and the difference is somebody's work.</p>

<h3>What --force actually says</h3>
<pre><code>git push --force origin feature/login</code></pre>
<p>Translated: <em>"Whatever <code>feature/login</code> points at on the server, discard it and make it point at my commit."</em> Git does not compare, does not warn, does not care what was there. If a colleague pushed three commits while you were rebasing, those commits are no longer reachable from any branch on the server.</p>
<div class="callout danger">Their work is not <em>deleted</em> — the objects survive on the server until garbage collection — but nothing points at them, nobody can find them without a reflog on the server side, and if their laptop no longer has them, the practical answer is that the work is gone. This is the single most destructive thing an ordinary Git user can do.</div>

<h3>What --force-with-lease adds</h3>
<pre><code>git push --force-with-lease origin feature/login</code></pre>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Git remembers</div><div class="lz-d">Your <code>origin/feature/login</code> — where the branch was at your last fetch.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">It asks the server</div><div class="lz-d">"Is the branch still exactly there?"</div></div>
  <div class="lz-step"><div class="lz-k">3a</div><div class="lz-t">Yes → push</div><div class="lz-d">Nobody pushed since you last looked. Your rewrite is safe.</div></div>
  <div class="lz-step"><div class="lz-k">3b</div><div class="lz-t">No → refuse</div><div class="lz-d">Someone pushed. Git stops instead of overwriting them.</div></div>
</div>
<pre><code>git push --force-with-lease</code></pre>
<div class="out">! [rejected]        feature/login -&gt; feature/login (stale info)
error: failed to push some refs to 'github.com:cuonghoang1103/api-backend.git'</div>
<p>"stale info" means: <em>your picture of the remote is out of date, so I will not let you overwrite it.</em> That message has saved a great many afternoons. The response is to fetch, look at what arrived, integrate it, and try again:</p>
<pre><code>git fetch
git log --oneline HEAD..origin/feature/login    <span class="tok-comment"># what did they add?</span>
git rebase origin/feature/login                 <span class="tok-comment"># put your work on top of theirs</span>
git push --force-with-lease</code></pre>

<h3>Make it the default</h3>
<pre><code>git config --global alias.pushf <span class="tok-string">"push --force-with-lease"</span></code></pre>
<p>There is no config setting that turns plain <code>--force</code> into the safe version, so an alias is the practical answer. Type <code>git pushf</code> and never type <code>--force</code> again.</p>

<h3>The trap that breaks the lease</h3>
<div class="callout warn"><code>--force-with-lease</code> compares against your <strong>remote-tracking ref</strong>, not against the server directly. Anything that silently runs <code>git fetch</code> for you — an IDE that polls, a <code>git fetch</code> in a shell prompt, a background sync — updates that ref <em>without you having seen the new commits</em>. The lease then compares "current server state" against "current server state", passes, and overwrites your colleague's work exactly as <code>--force</code> would.</div>
<pre><code><span class="tok-comment"># Git 2.30+ closes the hole: also require that your local branch</span>
<span class="tok-comment"># actually CONTAINS everything you have fetched.</span>
git push --force-with-lease --force-if-includes</code></pre>
<p>Use both flags together. <code>--force-if-includes</code> is what makes the lease meaningful again when something else is fetching behind your back.</p>

<h3>When force-pushing is fine</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">✅ Your own feature branch</span><span class="v">You rebased onto main, or squashed "wip" commits before review. Normal and expected.</span></div>
  <div class="kv"><span class="k">✅ Your fork's branch in a pull request</span><span class="v">Standard open-source practice (5.4). Avoid it mid-review, because it invalidates review comments.</span></div>
  <div class="kv"><span class="k">⚠️ A branch two people share</span><span class="v">Only after telling them, and only when you both know how to recover.</span></div>
  <div class="kv"><span class="k">❌ main, develop, release/*</span><span class="v">Never. Branch protection should make this impossible (6.4); if it does not, fix that today.</span></div>
</div>

<h3>Recovering when someone force-pushed over you</h3>
<pre><code><span class="tok-comment"># Your commits vanished from the server. If you still have them locally:</span>
git reflog                              <span class="tok-comment"># find your last good commit</span>
git switch -c rescue e8b4d92            <span class="tok-comment"># park them on a branch</span>
git rebase origin/feature/login rescue  <span class="tok-comment"># replay onto the new history</span>
git push origin rescue</code></pre>
<pre><code><span class="tok-comment"># If your clone no longer has them, ask GitHub. Unreferenced commits</span>
<span class="tok-comment"># stay reachable by hash for a while; the Events API records the old SHA.</span>
gh api repos/cuonghoang1103/api-backend/events \\
  --jq <span class="tok-string">'.[] | select(.type=="PushEvent") | {before: .payload.before, head: .payload.head, ref: .payload.ref}'</span></code></pre>
<div class="callout ok">The <code>before</code> field of a PushEvent is the commit the branch pointed at <em>before</em> the force push. Fetch it directly — <code>git fetch origin 3f8a1c9</code> — and the work is back. Worth knowing before you need it, because the window is not infinite.</div>

<h3>Protecting the branch instead</h3>
<pre><code><span class="tok-comment"># The real fix is at the server, not in anyone's fingers:</span>
Settings → Branches → main
  ☑ Block force pushes
  ☑ Restrict deletions</code></pre>
<p>Branch protection (6.4) turns "please be careful" into "the server refuses". No amount of discipline beats a rule that makes the mistake impossible.</p>

<a class="link-card" href="https://git-scm.com/docs/git-push#Documentation/git-push.txt---force-with-leaseltrefnamegt" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">git-push — --force-with-lease and --force-if-includes</span><span class="lc-sub">The exact semantics of the lease, and when it is not enough.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: trigger "stale info" and recover from an overwrite</span><span class="lc-sub">A graded two-clone exercise that reproduces the real accident.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> reaching for <code>--force</code> because <code>--force-with-lease</code> was rejected. The rejection <em>is the information</em>: someone pushed and you have not seen it. Forcing past it does exactly the damage the lease exists to prevent. Fetch, read what arrived, rebase onto it, push again — thirty seconds, and nobody loses anything.</div>
<p class="note-ct"><strong>A cultural note:</strong> on a shared branch, announce before you rewrite. "I am about to force-push feature/login — pull before you touch it" costs one message and prevents the confusing state where a colleague's <code>git pull</code> merges the old and new histories into a mess of duplicate commits. Git handles the mechanics; the announcement handles the people.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Khác biệt giữa một cái cờ và cả buổi chiều của đồng nghiệp</h2>
<p class="lead">Khi bạn đã viết lại một commit vốn đã nằm trên máy chủ, một lần push thường sẽ bị từ chối (bài 8.1). Đường đi qua lời từ chối đó là force push — và có hai loại. Một loại không hỏi han gì; loại kia kiểm tra trước. Phép kiểm ấy miễn phí, còn khác biệt là công sức của một người.</p>

<h3>--force thật ra nói gì</h3>
<pre><code>git push --force origin feature/login</code></pre>
<p>Dịch ra: <em>"Dù <code>feature/login</code> trên máy chủ đang trỏ vào cái gì, hãy vứt nó đi và cho nó trỏ vào commit của tôi."</em> Git không so sánh, không cảnh báo, không quan tâm ở đó từng có gì. Nếu một đồng nghiệp đã push ba commit trong lúc bạn rebase thì ba commit đó không còn với tới được từ bất kỳ nhánh nào trên máy chủ.</p>
<div class="callout danger">Việc của họ không bị <em>xoá</em> — các đối tượng vẫn sống trên máy chủ cho tới lần thu gom rác — nhưng không gì trỏ vào chúng, không ai tìm ra chúng nếu không có reflog phía máy chủ, và nếu laptop của họ không còn giữ nữa thì câu trả lời thực tế là công sức đó đã mất. Đây là thứ có sức phá huỷ lớn nhất mà một người dùng Git bình thường làm được.</div>

<h3>--force-with-lease thêm vào cái gì</h3>
<pre><code>git push --force-with-lease origin feature/login</code></pre>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Git nhớ</div><div class="lz-d"><code>origin/feature/login</code> của bạn — chỗ nhánh đó đứng ở lần fetch gần nhất.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Nó hỏi máy chủ</div><div class="lz-d">"Nhánh đó có còn đúng ở chỗ ấy không?"</div></div>
  <div class="lz-step"><div class="lz-k">3a</div><div class="lz-t">Còn → push</div><div class="lz-d">Không ai push kể từ lần bạn nhìn. Lần viết lại của bạn là an toàn.</div></div>
  <div class="lz-step"><div class="lz-k">3b</div><div class="lz-t">Không → từ chối</div><div class="lz-d">Có người đã push. Git dừng lại thay vì ghi đè lên họ.</div></div>
</div>
<pre><code>git push --force-with-lease</code></pre>
<div class="out">! [rejected]        feature/login -&gt; feature/login (stale info)
error: failed to push some refs to 'github.com:cuonghoang1103/api-backend.git'</div>
<p>"stale info" nghĩa là: <em>bức tranh của bạn về remote đã cũ, nên tôi không cho bạn ghi đè lên nó.</em> Thông báo đó đã cứu rất nhiều buổi chiều. Cách đáp là fetch, nhìn xem có gì tới, tích hợp nó, rồi thử lại:</p>
<pre><code>git fetch
git log --oneline HEAD..origin/feature/login    <span class="tok-comment"># họ đã thêm gì?</span>
git rebase origin/feature/login                 <span class="tok-comment"># đặt việc của bạn lên trên việc của họ</span>
git push --force-with-lease</code></pre>

<h3>Biến nó thành mặc định</h3>
<pre><code>git config --global alias.pushf <span class="tok-string">"push --force-with-lease"</span></code></pre>
<p>Không có thiết lập cấu hình nào biến <code>--force</code> trần thành bản an toàn, nên một alias là câu trả lời thực dụng. Gõ <code>git pushf</code> và đừng bao giờ gõ <code>--force</code> nữa.</p>

<h3>Cái bẫy phá vỡ chốt an toàn</h3>
<div class="callout warn"><code>--force-with-lease</code> so với <strong>ref theo dõi remote</strong> của bạn, không so trực tiếp với máy chủ. Bất cứ thứ gì âm thầm chạy <code>git fetch</code> hộ bạn — một IDE đang thăm dò, một lệnh <code>git fetch</code> trong dấu nhắc shell, một tiến trình đồng bộ nền — đều cập nhật cái ref đó <em>mà bạn chưa hề nhìn thấy các commit mới</em>. Chốt an toàn khi đó so "trạng thái máy chủ hiện tại" với "trạng thái máy chủ hiện tại", đi qua trót lọt, và ghi đè lên công sức của đồng nghiệp y hệt như <code>--force</code>.</div>
<pre><code><span class="tok-comment"># Git 2.30+ bịt lỗ hổng: đòi hỏi thêm rằng nhánh cục bộ của bạn</span>
<span class="tok-comment"># thật sự CHỨA mọi thứ bạn đã fetch về.</span>
git push --force-with-lease --force-if-includes</code></pre>
<p>Hãy dùng cả hai cờ cùng nhau. <code>--force-if-includes</code> là thứ làm cho chốt an toàn có ý nghĩa trở lại khi có thứ khác đang fetch sau lưng bạn.</p>

<h3>Khi nào force-push là ổn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">✅ Nhánh tính năng của chính bạn</span><span class="v">Bạn vừa rebase lên main, hoặc gộp các commit "wip" trước khi review. Bình thường và được trông đợi.</span></div>
  <div class="kv"><span class="k">✅ Nhánh trên fork của bạn trong một pull request</span><span class="v">Thực hành chuẩn của mã nguồn mở (bài 5.4). Tránh làm giữa lúc đang review, vì nó làm mất hiệu lực các bình luận.</span></div>
  <div class="kv"><span class="k">⚠️ Một nhánh hai người cùng dùng</span><span class="v">Chỉ sau khi đã báo họ, và chỉ khi cả hai đều biết cách cứu hộ.</span></div>
  <div class="kv"><span class="k">❌ main, develop, release/*</span><span class="v">Không bao giờ. Bảo vệ nhánh phải làm cho điều này bất khả (bài 6.4); nếu chưa, hãy sửa ngay hôm nay.</span></div>
</div>

<h3>Cứu hộ khi có người force-push đè lên bạn</h3>
<pre><code><span class="tok-comment"># Commit của bạn biến khỏi máy chủ. Nếu bạn vẫn còn chúng ở cục bộ:</span>
git reflog                              <span class="tok-comment"># tìm commit tốt cuối cùng của bạn</span>
git switch -c rescue e8b4d92            <span class="tok-comment"># cất chúng lên một nhánh</span>
git rebase origin/feature/login rescue  <span class="tok-comment"># phát lại lên lịch sử mới</span>
git push origin rescue</code></pre>
<pre><code><span class="tok-comment"># Nếu bản clone của bạn không còn chúng, hãy hỏi GitHub. Commit không ai</span>
<span class="tok-comment"># trỏ tới vẫn với tới được bằng mã băm một thời gian; API Events ghi lại SHA cũ.</span>
gh api repos/cuonghoang1103/api-backend/events \\
  --jq <span class="tok-string">'.[] | select(.type=="PushEvent") | {before: .payload.before, head: .payload.head, ref: .payload.ref}'</span></code></pre>
<div class="callout ok">Trường <code>before</code> của một PushEvent là commit mà nhánh trỏ vào <em>TRƯỚC</em> lần force push. Hãy fetch nó thẳng — <code>git fetch origin 3f8a1c9</code> — và công sức trở lại. Đáng biết TRƯỚC khi cần tới, vì cửa sổ thời gian không phải vô hạn.</div>

<h3>Bảo vệ nhánh thay vì trông cậy vào con người</h3>
<pre><code><span class="tok-comment"># Cách sửa thật nằm ở máy chủ, không nằm trong ngón tay ai cả:</span>
Settings → Branches → main
  ☑ Chặn force push
  ☑ Hạn chế xoá nhánh</code></pre>
<p>Bảo vệ nhánh (bài 6.4) biến "làm ơn cẩn thận" thành "máy chủ từ chối". Không mức kỷ luật nào thắng nổi một cái luật làm cho sai lầm trở nên bất khả.</p>

<a class="link-card" href="https://git-scm.com/docs/git-push#Documentation/git-push.txt---force-with-leaseltrefnamegt" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">git-push — --force-with-lease và --force-if-includes</span><span class="lc-sub">Ngữ nghĩa chính xác của chốt an toàn, và khi nào nó chưa đủ.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: tạo ra "stale info" và cứu hộ sau một lần bị ghi đè</span><span class="lc-sub">Bài tập chấm điểm với hai bản clone, tái hiện đúng tai nạn thật.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> vớ lấy <code>--force</code> vì <code>--force-with-lease</code> bị từ chối. Lời từ chối <em>CHÍNH LÀ thông tin</em>: có người đã push và bạn chưa nhìn thấy. Ép qua nó là gây đúng cái thiệt hại mà chốt an toàn sinh ra để ngăn. Hãy fetch, đọc xem có gì tới, rebase lên trên nó, push lại — ba mươi giây, và không ai mất gì.</div>
<p class="note-ct"><strong>Một lưu ý về văn hoá:</strong> trên nhánh chung, hãy báo trước khi viết lại. "Tôi sắp force-push feature/login — hãy pull trước khi đụng vào" tốn một tin nhắn và ngăn được cái trạng thái rối rắm khi lệnh <code>git pull</code> của đồng nghiệp hợp nhất lịch sử cũ và mới thành một mớ commit trùng lặp. Git lo phần cơ chế; lời báo trước lo phần con người.</p>
</div>
`,
    },

    /* ─────────────────────────── 8.3 ─────────────────────────── */
    {
      title: '8.3 — Removing a leaked secret from all of history|||8.3 — Gỡ một bí mật bị lộ khỏi toàn bộ lịch sử',
      slug: 'git-8-3-go-bi-mat',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Quy trình sáu bước khi một khoá API lên GitHub: vì sao XOAY KHOÁ là bước một chứ không phải bước cuối, git filter-repo, phối hợp với cả nhóm, và vì sao commit cũ vẫn truy cập được bằng URL.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>The one emergency this chapter is really about</h2>
<p class="lead">An API key went into a commit and the commit went to GitHub. This lesson is the procedure, in order, with the reasoning — because the instinct everyone has (delete the line, commit, hope) fixes nothing at all.</p>

<div class="callout danger"><strong>Step one is not Git.</strong> Bots scrape public GitHub for credential patterns continuously and act on findings within <em>minutes</em>. By the time you have read this paragraph, a key pushed to a public repository should be assumed compromised. <strong>Rotate the credential first.</strong> Everything below is cleanup, and cleanup on a key that is still valid is theatre.</div>

<h3>The six steps, in order</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Rotate</div><div class="lz-d">Revoke the key at the provider and issue a new one. Minutes matter; nothing else does yet.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Assess</div><div class="lz-d">Public or private? How long was it live? Check the provider's audit log for use you did not make.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Prevent</div><div class="lz-d">Add it to <code>.gitignore</code>, move the value to environment config, commit that.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Clean history</div><div class="lz-d"><code>git filter-repo</code>, below. Now, not first.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Coordinate</div><div class="lz-d">Everyone re-clones. This is the expensive part and it cannot be skipped.</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">Ask the host to purge</div><div class="lz-d">GitHub Support can drop cached unreachable commits, which force-pushing alone does not.</div></div>
</div>

<h3>Finding what is actually in there</h3>
<pre><code>git log -S<span class="tok-string">"sk_live_"</span> --oneline --all      <span class="tok-comment"># the pickaxe from 2.3</span>
git log --all --full-history -- .env      <span class="tok-comment"># every commit that touched the file</span>
git grep -n <span class="tok-string">"AKIA[0-9A-Z]{16}"</span> \$(git rev-list --all) 2&gt;/dev/null | head</code></pre>
<p>The last one searches <em>every commit</em> for an AWS key pattern. It is slow on a large repository and it is the only way to be sure you found all of them — a leak is often several commits, not one.</p>

<h3>git filter-repo</h3>
<pre><code>pip install git-filter-repo        <span class="tok-comment"># or: brew install git-filter-repo</span></code></pre>
<div class="callout warn">Use <code>git filter-repo</code>, not <code>git filter-branch</code>. The Git project itself now recommends against <code>filter-branch</code>: it is orders of magnitude slower, and it has documented failure modes that silently corrupt history. Any tutorial still recommending it predates 2019.</div>
<pre><code><span class="tok-comment"># Work on a FRESH clone — filter-repo refuses to run on a repo with</span>
<span class="tok-comment"># extra state, and a fresh clone means a mistake costs nothing.</span>
git clone --mirror git@github.com:cuonghoang1103/api-backend.git
cd api-backend.git

<span class="tok-comment"># Option A — remove a file from every commit it ever appeared in:</span>
git filter-repo --invert-paths --path .env --path config/secrets.json

<span class="tok-comment"># Option B — keep the files, replace only the secret text:</span>
printf <span class="tok-string">'sk_live_51H8xK2abcdef==&gt;REMOVED\\nAKIAIOSFODNN7EXAMPLE==&gt;REMOVED\\n'</span> &gt; /tmp/rules.txt
git filter-repo --replace-text /tmp/rules.txt</code></pre>
<div class="out">Parsed 2413 commits
New history written in 4.21 seconds; now repacking/cleaning...
Completely finished after 11.87 seconds.</div>
<pre><code><span class="tok-comment"># filter-repo removes the remote on purpose, so you cannot push by reflex.</span>
git remote add origin git@github.com:cuonghoang1103/api-backend.git
git push --force --all
git push --force --tags</code></pre>

<h3>What this costs everyone else</h3>
<div class="callout danger">Every commit after the earliest rewritten one gets a <strong>new hash</strong> (1.2). The entire team's clones are now incompatible with the server. Pulling will not fix it — it produces a duplicated, conflicting history. Everyone must <strong>re-clone</strong>, and any local branch not yet pushed has to be rescued by hand.</div>
<pre><code><span class="tok-comment"># What each colleague does, and the order matters:</span>
git bundle create ~/my-unpushed-work.bundle --all   <span class="tok-comment"># 1. save local work FIRST</span>
cd .. &amp;&amp; rm -rf api-backend                          <span class="tok-comment"># 2. delete the old clone</span>
git clone git@github.com:cuonghoang1103/api-backend.git   <span class="tok-comment"># 3. fresh</span>
<span class="tok-comment"># 4. cherry-pick the rescued commits across from the bundle</span></code></pre>
<p>Open pull requests are also affected: their branches point at commits that no longer exist upstream. Expect to close and re-open some of them, which is one more reason to do this immediately rather than a week later.</p>

<h3>The part force-pushing does not fix</h3>
<div class="callout warn">After a force push the old commits are unreferenced but <strong>not gone from GitHub</strong>. They remain reachable by full hash — <code>github.com/owner/repo/commit/3f8a1c9…</code> still renders — and forks keep their own copies indefinitely. To have them actually purged you must contact GitHub Support and ask, quoting the repository and the SHAs. This is precisely why step 1 is rotation: the cleanup is genuinely incomplete for a while, and only a revoked key is safe.</div>

<h3>Making it not happen again</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">.gitignore first</span><span class="v">Create <code>.gitignore</code> and <code>.env.example</code> before the first commit (1.5). Costs a minute, at a moment when it is free.</span></div>
  <div class="kv"><span class="k">A pre-commit hook</span><span class="v"><code>gitleaks</code> or <code>detect-secrets</code> refuses the commit locally (Chapter 12). The only layer that stops the leak before it exists.</span></div>
  <div class="kv"><span class="k">Push protection</span><span class="v">GitHub secret scanning can block a push containing a known credential pattern. Free on public repositories; turn it on.</span></div>
  <div class="kv"><span class="k">CI scanning</span><span class="v">A scan in the pipeline catches what slipped past. Later than the hook, and better than a bot finding it first.</span></div>
</div>

<h3>Other things filter-repo is good for</h3>
<pre><code><span class="tok-comment"># Extract a subdirectory into its own repository, keeping its history:</span>
git filter-repo --path frontend/ --path-rename frontend/:

<span class="tok-comment"># Fix an author email across all commits (the 0.3 mistake, at scale):</span>
git filter-repo --email-callback <span class="tok-string">'
  return email if email != b"old@example.com" else b"an@example.com"
'</span>

<span class="tok-comment"># Drop a 400 MB video someone committed in 2023 and bloats every clone:</span>
git filter-repo --strip-blobs-bigger-than 10M</code></pre>
<p>All of them rewrite every subsequent commit, so all of them carry the same coordination cost as the secret removal. Batch them: if you are going to make the team re-clone, do every rewrite you have been putting off in the same operation.</p>

<a class="link-card" href="https://github.com/newren/git-filter-repo/blob/main/README.md" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">git-filter-repo — the official documentation</span><span class="lc-sub">Includes the full list of callbacks and why filter-branch is deprecated.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Secret scanning and push protection</span><span class="lc-sub">What is detected, and how to enable blocking on push.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> "I deleted the line and committed, so it is fixed." The old commit still contains the secret, still exists on GitHub, and is still one <code>git log -p</code> away for anyone with the repository. This is the single most common misunderstanding in this whole course, and it is the reason the six-step procedure begins with rotation rather than with Git.</div>
<p class="note-ct"><strong>The honest framing to give a team:</strong> cleaning history is expensive and never quite complete. Rotation is cheap and total. So treat the cleanup as hygiene — worth doing, especially before a repository is opened up or archived — and treat rotation as <em>the fix</em>. Anyone who tells you the leak is handled because history was rewritten has the priority backwards.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Tình huống khẩn cấp mà cả chương này thật sự nói về</h2>
<p class="lead">Một khoá API lọt vào một commit và commit đó lên GitHub. Bài này là quy trình, theo đúng thứ tự, kèm lý lẽ — vì cái bản năng mà ai cũng có (xoá dòng đó, commit, hy vọng) chẳng sửa được gì hết.</p>

<div class="callout danger"><strong>Bước một không phải là Git.</strong> Các bot quét GitHub công khai tìm mẫu chứng chỉ liên tục và hành động với thứ tìm được trong vòng <em>vài phút</em>. Tới lúc bạn đọc xong đoạn này, một khoá đã push lên kho công khai phải được coi là đã bị lộ. <strong>Hãy XOAY chứng chỉ trước.</strong> Mọi thứ bên dưới là dọn dẹp, và dọn dẹp trên một cái khoá còn hiệu lực chỉ là diễn kịch.</div>

<h3>Sáu bước, theo thứ tự</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Xoay khoá</div><div class="lz-d">Thu hồi khoá ở nhà cung cấp và cấp cái mới. Từng phút đều quan trọng; chưa gì khác quan trọng cả.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Đánh giá</div><div class="lz-d">Công khai hay riêng tư? Nó sống bao lâu? Kiểm nhật ký kiểm toán của nhà cung cấp xem có lượt dùng nào không phải của bạn.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Phòng ngừa</div><div class="lz-d">Thêm vào <code>.gitignore</code>, chuyển giá trị sang cấu hình môi trường, commit phần đó.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Dọn lịch sử</div><div class="lz-d"><code>git filter-repo</code>, ngay dưới. Bây giờ, không phải đầu tiên.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Phối hợp</div><div class="lz-d">Mọi người clone lại. Đây là phần đắt đỏ và không bỏ qua được.</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">Nhờ nhà cung cấp xoá hẳn</div><div class="lz-d">GitHub Support gỡ được các commit không ai trỏ tới còn nằm trong bộ đệm, thứ mà riêng force-push không làm nổi.</div></div>
</div>

<h3>Tìm xem thật sự có gì trong đó</h3>
<pre><code>git log -S<span class="tok-string">"sk_live_"</span> --oneline --all      <span class="tok-comment"># cái cuốc chim ở bài 2.3</span>
git log --all --full-history -- .env      <span class="tok-comment"># mọi commit từng chạm vào file</span>
git grep -n <span class="tok-string">"AKIA[0-9A-Z]{16}"</span> \$(git rev-list --all) 2&gt;/dev/null | head</code></pre>
<p>Lệnh cuối tìm mẫu khoá AWS trong <em>mọi commit</em>. Nó chậm trên kho lớn và là cách duy nhất để chắc chắn bạn đã tìm ra hết — một vụ lộ thường nằm ở vài commit, không phải một.</p>

<h3>git filter-repo</h3>
<pre><code>pip install git-filter-repo        <span class="tok-comment"># hoặc: brew install git-filter-repo</span></code></pre>
<div class="callout warn">Hãy dùng <code>git filter-repo</code>, đừng dùng <code>git filter-branch</code>. Chính dự án Git nay khuyến cáo không dùng <code>filter-branch</code>: nó chậm hơn nhiều bậc, và có những kiểu hỏng đã được ghi nhận làm lịch sử sai lệch trong im lặng. Mọi hướng dẫn còn đề xuất nó đều có từ trước 2019.</div>
<pre><code><span class="tok-comment"># Hãy làm trên một bản clone MỚI — filter-repo từ chối chạy trên kho có</span>
<span class="tok-comment"># trạng thái thừa, và một bản clone mới nghĩa là lỡ tay cũng không tốn gì.</span>
git clone --mirror git@github.com:cuonghoang1103/api-backend.git
cd api-backend.git

<span class="tok-comment"># Cách A — gỡ một file khỏi mọi commit từng chứa nó:</span>
git filter-repo --invert-paths --path .env --path config/secrets.json

<span class="tok-comment"># Cách B — giữ file, chỉ thay phần chữ là bí mật:</span>
printf <span class="tok-string">'sk_live_51H8xK2abcdef==&gt;REMOVED\\nAKIAIOSFODNN7EXAMPLE==&gt;REMOVED\\n'</span> &gt; /tmp/rules.txt
git filter-repo --replace-text /tmp/rules.txt</code></pre>
<div class="out">Parsed 2413 commits
New history written in 4.21 seconds; now repacking/cleaning...
Completely finished after 11.87 seconds.</div>
<pre><code><span class="tok-comment"># filter-repo cố tình gỡ remote đi, để bạn không push theo phản xạ.</span>
git remote add origin git@github.com:cuonghoang1103/api-backend.git
git push --force --all
git push --force --tags</code></pre>

<h3>Việc này tốn của mọi người khác cái gì</h3>
<div class="callout danger">Mọi commit sau cái commit bị viết lại sớm nhất đều nhận một <strong>mã băm MỚI</strong> (bài 1.2). Bản clone của cả nhóm giờ không tương thích với máy chủ. Pull không sửa được — nó sinh ra một lịch sử trùng lặp và xung đột. Mọi người phải <strong>CLONE LẠI</strong>, và mọi nhánh cục bộ chưa push phải được cứu bằng tay.</div>
<pre><code><span class="tok-comment"># Việc từng đồng nghiệp phải làm, và thứ tự thì quan trọng:</span>
git bundle create ~/viec-chua-push.bundle --all      <span class="tok-comment"># 1. cứu việc cục bộ TRƯỚC</span>
cd .. &amp;&amp; rm -rf api-backend                          <span class="tok-comment"># 2. xoá bản clone cũ</span>
git clone git@github.com:cuonghoang1103/api-backend.git   <span class="tok-comment"># 3. clone mới</span>
<span class="tok-comment"># 4. cherry-pick các commit đã cứu từ file bundle sang</span></code></pre>
<p>Các pull request đang mở cũng bị ảnh hưởng: nhánh của chúng trỏ vào những commit không còn tồn tại ở thượng nguồn. Hãy chuẩn bị tinh thần đóng và mở lại một số cái, và đó là thêm một lý do để làm việc này ngay lập tức thay vì một tuần sau.</p>

<h3>Phần mà force-push không sửa được</h3>
<div class="callout warn">Sau một lần force push, các commit cũ không còn ai trỏ tới nhưng <strong>chưa biến mất khỏi GitHub</strong>. Chúng vẫn với tới được bằng mã băm đầy đủ — <code>github.com/owner/repo/commit/3f8a1c9…</code> vẫn hiện ra — và các bản fork giữ bản sao riêng của chúng vô thời hạn. Muốn chúng thật sự bị xoá, bạn phải liên hệ GitHub Support và yêu cầu, kèm tên kho và các SHA. Đây chính xác là lý do bước 1 là xoay khoá: việc dọn dẹp thật sự chưa trọn vẹn trong một khoảng thời gian, và chỉ một cái khoá đã bị thu hồi mới là an toàn.</div>

<h3>Làm cho nó không tái diễn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">.gitignore trước đã</span><span class="v">Tạo <code>.gitignore</code> và <code>.env.example</code> trước commit đầu tiên (bài 1.5). Tốn một phút, vào đúng lúc nó còn miễn phí.</span></div>
  <div class="kv"><span class="k">Một hook pre-commit</span><span class="v"><code>gitleaks</code> hay <code>detect-secrets</code> từ chối commit ngay ở máy (Chương 12). Lớp duy nhất chặn vụ lộ trước khi nó tồn tại.</span></div>
  <div class="kv"><span class="k">Push protection</span><span class="v">Secret scanning của GitHub chặn được một lần push chứa mẫu chứng chỉ đã biết. Miễn phí trên kho công khai; hãy bật nó.</span></div>
  <div class="kv"><span class="k">Quét trong CI</span><span class="v">Một lượt quét trong pipeline bắt được thứ lọt qua hook. Muộn hơn hook, và tốt hơn là để một con bot tìm ra trước.</span></div>
</div>

<h3>Những việc khác filter-repo làm tốt</h3>
<pre><code><span class="tok-comment"># Tách một thư mục con ra thành kho riêng, giữ nguyên lịch sử của nó:</span>
git filter-repo --path frontend/ --path-rename frontend/:

<span class="tok-comment"># Sửa email tác giả trên mọi commit (sai lầm ở bài 0.3, ở quy mô lớn):</span>
git filter-repo --email-callback <span class="tok-string">'
  return email if email != b"old@example.com" else b"an@example.com"
'</span>

<span class="tok-comment"># Vứt một video 400 MB ai đó commit năm 2023 làm phình mọi bản clone:</span>
git filter-repo --strip-blobs-bigger-than 10M</code></pre>
<p>Tất cả đều viết lại mọi commit phía sau, nên tất cả đều mang đúng cái chi phí phối hợp như việc gỡ bí mật. Hãy gộp chúng lại: nếu đằng nào cũng bắt cả nhóm clone lại, hãy làm hết mọi việc viết lại mà bạn còn nợ trong cùng một lần.</p>

<a class="link-card" href="https://github.com/newren/git-filter-repo/blob/main/README.md" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">git-filter-repo — tài liệu chính thức</span><span class="lc-sub">Gồm danh sách đầy đủ các callback và lý do filter-branch bị khai tử.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Secret scanning và push protection</span><span class="lc-sub">Những gì được phát hiện, và cách bật chế độ chặn khi push.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> "Tôi xoá dòng đó và commit rồi, thế là xong." Commit cũ vẫn chứa bí mật, vẫn tồn tại trên GitHub, và vẫn chỉ cách một lệnh <code>git log -p</code> với bất kỳ ai có kho mã. Đây là hiểu lầm phổ biến nhất trong cả khoá học này, và là lý do quy trình sáu bước bắt đầu bằng việc xoay khoá chứ không bắt đầu bằng Git.</div>
<p class="note-ct"><strong>Cách nói thẳng thắn với một nhóm:</strong> dọn lịch sử thì đắt và không bao giờ trọn vẹn hẳn. Xoay khoá thì rẻ và triệt để. Vậy hãy coi việc dọn dẹp là vệ sinh — đáng làm, nhất là trước khi mở công khai hay lưu trữ một kho — và coi việc xoay khoá là <em>CÁCH SỬA</em>. Ai nói với bạn rằng vụ lộ đã được xử lý xong vì lịch sử đã được viết lại thì người đó đang đặt ngược thứ tự ưu tiên.</p>
</div>
`,
    },

    /* ─────────────────────────── 8.4 Quiz ─────────────────────────── */
    {
      title: '8.4 — Chapter 8 quiz|||8.4 — Kiểm tra Chương 8',
      slug: 'git-8-4-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về amend tạo commit mới, ranh giới an toàn, --force-with-lease và bẫy fetch nền, --force-if-includes, quy trình sáu bước khi lộ bí mật, và filter-repo.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on rewriting history. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: why rotation comes before history cleaning (8.3), and what breaks <code>--force-with-lease</code> (8.2).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về viết lại lịch sử. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: vì sao xoay khoá đi trước việc dọn lịch sử (bài 8.3), và cái gì phá vỡ <code>--force-with-lease</code> (bài 8.2).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does "git commit --amend" actually do to the last commit?|||"git commit --amend" thật ra làm gì với commit cuối cùng?',
            options: [
              'It edits the commit in place|||Nó sửa commit đó tại chỗ',
              'It creates a NEW commit with the same parent and corrected content, then moves the branch to it — the old commit becomes unreferenced|||Nó tạo một commit MỚI cùng cha và nội dung đã sửa, rồi dời nhánh sang nó — commit cũ trở thành không ai trỏ tới',
              'It deletes the commit and stages its changes|||Nó xoá commit và đưa thay đổi của nó vào staging',
              'It rewrites every commit on the branch|||Nó viết lại mọi commit trên nhánh',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which command tells you whether a commit is still safe to amend?|||Lệnh nào cho biết một commit có còn an toàn để amend không?',
            options: [
              'git status',
              'git log --oneline @{u}..HEAD — if the commit is listed, it is not pushed yet|||git log --oneline @{u}..HEAD — nếu commit đó có trong danh sách thì nó chưa được push',
              'git show --stat',
              'git branch -a',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does --force-with-lease check that --force does not?|||--force-with-lease kiểm tra điều gì mà --force không kiểm?',
            options: [
              'That the commit message is valid|||Rằng lời nhắn commit hợp lệ',
              'That the remote branch is still exactly where your remote-tracking ref says it is — i.e. nobody pushed since your last fetch|||Rằng nhánh trên remote vẫn đúng ở chỗ mà ref theo dõi remote của bạn nói — tức là không ai push kể từ lần fetch gần nhất',
              'That CI has passed|||Rằng CI đã xanh',
              'That the branch is not protected|||Rằng nhánh đó không được bảo vệ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What silently defeats --force-with-lease?|||Cái gì âm thầm vô hiệu hoá --force-with-lease?',
            options: [
              'A slow network|||Mạng chậm',
              'Anything that runs git fetch in the background (an IDE, a shell prompt) — it updates the tracking ref without you seeing the new commits, so the lease compares the server against itself|||Bất cứ thứ gì chạy git fetch ở nền (một IDE, một dấu nhắc shell) — nó cập nhật ref theo dõi mà bạn chưa nhìn thấy commit mới, nên chốt an toàn so máy chủ với chính nó',
              'Using SSH instead of HTTPS|||Dùng SSH thay vì HTTPS',
              'Having more than one remote|||Có nhiều hơn một remote',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which flag closes that hole, from Git 2.30 onwards?|||Cờ nào bịt lỗ hổng đó, từ Git 2.30 trở đi?',
            options: [
              '--force-if-includes',
              '--force-strict',
              '--no-fetch',
              '--verify-remote',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'An API key was pushed to a public repository. What is step ONE?|||Một khoá API đã bị push lên kho công khai. Bước MỘT là gì?',
            options: [
              'Run git filter-repo|||Chạy git filter-repo',
              'Delete the line and commit|||Xoá dòng đó và commit',
              'Rotate the credential — revoke it at the provider and issue a new one; bots find public keys within minutes|||XOAY chứng chỉ — thu hồi ở nhà cung cấp và cấp cái mới; bot tìm ra khoá công khai trong vài phút',
              'Make the repository private|||Đổi kho thành riêng tư',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'After a force push, are the old commits gone from GitHub?|||Sau một lần force push, các commit cũ đã biến khỏi GitHub chưa?',
            options: [
              'Yes, immediately|||Rồi, ngay lập tức',
              'No — they are unreferenced but still reachable by full hash via URL, and forks keep their own copies; a support request is needed to purge them|||Chưa — chúng không còn ai trỏ tới nhưng vẫn với tới được bằng mã băm đầy đủ qua URL, và các bản fork giữ bản sao riêng; cần một yêu cầu tới support để xoá hẳn',
              'Yes, after 24 hours|||Rồi, sau 24 giờ',
              'Only if the repository is private|||Chỉ khi kho là riêng tư',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does the Git project recommend git-filter-repo over git filter-branch?|||Vì sao dự án Git khuyến nghị git-filter-repo thay vì git filter-branch?',
            options: [
              'filter-branch only works on public repositories|||filter-branch chỉ chạy được trên kho công khai',
              'filter-branch is orders of magnitude slower and has documented failure modes that silently corrupt history|||filter-branch chậm hơn nhiều bậc và có những kiểu hỏng đã được ghi nhận làm lịch sử sai lệch trong im lặng',
              'filter-repo keeps the original commit hashes|||filter-repo giữ nguyên mã băm commit gốc',
              'filter-branch cannot remove files|||filter-branch không gỡ file được',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
