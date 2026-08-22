/**
 * Git & GitHub — Chương 4: Hoàn tác — lưới an toàn.
 * restore (thư mục làm việc & index) · reset ba chế độ · revert (cách duy nhất an toàn
 * trên lịch sử đã chia sẻ) · reflog (không gì thật sự mất) · stash · quiz.
 * Output CHẠY THẬT git 2.43. LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;;
 * & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 4 — Undo: the safety net|||Chương 4 — Hoàn tác: lưới an toàn',
  description: 'Mọi cách hoàn tác trong Git, xếp theo mức nguy hiểm và theo cây mà chúng đụng vào: restore, reset ba chế độ, revert, stash và reflog. Học xong chương này bạn biết chính xác lệnh nào lấy lại được thứ gì — và biết đúng một thứ duy nhất Git không cứu nổi.',
  lessons: [
    /* ─────────────────────────── 4.1 ─────────────────────────── */
    {
      title: '4.1 — The undo map: which command touches which tree|||4.1 — Bản đồ hoàn tác: lệnh nào đụng vào cây nào',
      slug: 'git-4-1-ban-do-hoan-tac',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một bảng duy nhất xếp restore, reset, revert, checkout và stash theo ba cây của bài 1.1 — cộng với luật an toàn duy nhất bạn cần nhớ trước khi gõ bất cứ lệnh hoàn tác nào.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Every undo command, on one map</h2>
<p class="lead">Git's undo commands look like a random pile until you sort them by the question from 1.1: <em>which of the three trees does this touch?</em> Sorted that way, they stop overlapping and each one has an obvious job.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">git restore &lt;file&gt;</span><span class="lz-v">Working directory ← index. Throws away your unstaged edits. <strong>Destructive</strong> — the content was never given to Git.</span></div>
  <div class="lz-layer"><span class="lz-k">git restore --staged &lt;file&gt;</span><span class="lz-v">Index ← HEAD. Unstages, leaves your edits on disk. Completely safe.</span></div>
  <div class="lz-layer"><span class="lz-k">git reset --soft &lt;commit&gt;</span><span class="lz-v">Moves the branch only. Index and working directory untouched — your changes end up staged. Safe.</span></div>
  <div class="lz-layer"><span class="lz-k">git reset --mixed &lt;commit&gt;</span><span class="lz-v">Branch + index. Working directory untouched — changes end up unstaged. The default. Safe.</span></div>
  <div class="lz-layer"><span class="lz-k">git reset --hard &lt;commit&gt;</span><span class="lz-v">All three. <strong>Destructive</strong> — uncommitted work is gone for good.</span></div>
  <div class="lz-layer"><span class="lz-k">git revert &lt;commit&gt;</span><span class="lz-v">Adds a NEW commit that undoes an old one. Changes nothing that already exists. The only undo that is safe on shared history.</span></div>
  <div class="lz-layer"><span class="lz-k">git stash</span><span class="lz-v">Moves working directory + index into a saved snapshot, leaving you clean. Reversible.</span></div>
</div>

<h3>The one rule that predicts danger</h3>
<div class="callout danger"><strong>Git can recover anything it has seen. It cannot recover what it was never shown.</strong> A commit — even one you "deleted" — lives in the reflog for at least 30 days. An uncommitted edit that <code>reset --hard</code> or <code>restore</code> overwrote was never stored anywhere, and is as gone as if you had closed the editor without saving.</div>
<p>So the safety of any undo command comes down to a single question: <em>does it destroy uncommitted content?</em> Only three do — <code>restore &lt;file&gt;</code>, <code>reset --hard</code>, and <code>checkout -- &lt;file&gt;</code> (the old spelling of the first). Everything else is a pointer move, and pointer moves are always reversible.</p>

<h3>Choosing by what you actually want</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"Undo my edits to this file"</span><span class="v"><code>git restore src/app.ts</code> — destructive, and the thing you want ninety per cent of the time.</span></div>
  <div class="kv"><span class="k">"I staged too much"</span><span class="v"><code>git restore --staged src/app.ts</code> — safe, edits stay.</span></div>
  <div class="kv"><span class="k">"My last commit message is wrong"</span><span class="v"><code>git commit --amend</code> (8.1) — rewrites the last commit.</span></div>
  <div class="kv"><span class="k">"I want to redo my last commit"</span><span class="v"><code>git reset --soft HEAD~1</code> — the commit is undone, everything is staged, commit again properly.</span></div>
  <div class="kv"><span class="k">"Undo a commit that is already pushed"</span><span class="v"><code>git revert &lt;hash&gt;</code> — the only correct answer. Never reset a shared branch.</span></div>
  <div class="kv"><span class="k">"Set this branch back three commits"</span><span class="v"><code>git reset --hard HEAD~3</code> — only if unpushed, and only if you have nothing uncommitted.</span></div>
  <div class="kv"><span class="k">"Park this work, I need to fix something"</span><span class="v"><code>git stash</code> (4.5) — or better, commit on a branch.</span></div>
  <div class="kv"><span class="k">"I destroyed something, help"</span><span class="v"><code>git reflog</code> (4.4) — if it was ever committed, it is still there.</span></div>
</div>

<h3>Pushed or not — the line that decides everything</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">local only</div><div class="lz-t">Anything goes</div><div class="lz-d">reset, rebase, amend. Nobody else can be affected, and the reflog protects you.</div></div>
  <div class="lz-step"><div class="lz-k">pushed, branch is yours</div><div class="lz-t">Rewrite with care</div><div class="lz-d">reset/rebase then <code>--force-with-lease</code> (8.3). Fine on a personal feature branch.</div></div>
  <div class="lz-step"><div class="lz-k">pushed and shared</div><div class="lz-t">revert only</div><div class="lz-d">Adding a new commit is the only operation that does not break other people's clones.</div></div>
</div>
<p>Check before acting, rather than guessing:</p>
<pre><code>git log --oneline origin/main..HEAD   <span class="tok-comment"># commits I have that the server does not</span>
git branch -r --contains 3f8a1c9      <span class="tok-comment"># which remote branches contain this commit?</span></code></pre>
<div class="out">3f8a1c9 fix: reject expired refresh tokens
9e2d4b7 feat(auth): add refresh token rotation</div>
<p>Those two commits are unpushed, so they are yours to rewrite. Anything <em>not</em> listed is already on the server, and belongs to everyone.</p>

<h3>The names, old and new</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">git restore &lt;file&gt;</span><span class="v">= the old <code>git checkout -- &lt;file&gt;</code>. Same behaviour, unambiguous name.</span></div>
  <div class="kv"><span class="k">git restore --staged &lt;file&gt;</span><span class="v">= the old <code>git reset HEAD &lt;file&gt;</code>. Same behaviour.</span></div>
  <div class="kv"><span class="k">git switch &lt;branch&gt;</span><span class="v">= the old <code>git checkout &lt;branch&gt;</code>.</span></div>
</div>
<p>Both spellings work; older tutorials use the old ones. The split exists because <code>git checkout</code> did two unrelated jobs, and mistyping one as the other silently destroyed work — which is exactly what the new names prevent.</p>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 7.7 — Reset Demystified</span><span class="lc-sub">The three-trees explanation of reset, with a table per mode.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: pick the right undo for eight situations</span><span class="lc-sub">Graded scenarios covering restore, reset, revert and stash.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> reaching for <code>reset --hard</code> as a general "make it clean" command. It is the only routine Git command that permanently destroys work, and it does so silently, with no confirmation and nothing in the reflog for the uncommitted part. Before typing it, run <code>git status</code> and read what you are about to lose. If anything in there matters, <code>git stash</code> first — it costs one second and turns a destructive command into a reversible one.</div>
<p class="note-ct"><strong>The habit that makes all of this moot:</strong> commit early, on a branch. A commit is private until pushed and endlessly reshapeable afterwards. Once your work is in a commit, every undo in this chapter becomes a pointer move — and pointer moves cannot lose anything.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Mọi lệnh hoàn tác, trên một tấm bản đồ</h2>
<p class="lead">Các lệnh hoàn tác của Git trông như một đống hỗn độn cho tới khi bạn xếp chúng theo câu hỏi ở bài 1.1: <em>lệnh này đụng vào cây nào trong ba cây?</em> Xếp như thế, chúng hết chồng lấn và mỗi cái có một nhiệm vụ rõ ràng.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">git restore &lt;file&gt;</span><span class="lz-v">Thư mục làm việc ← index. Vứt bỏ sửa đổi chưa staging của bạn. <strong>Phá huỷ</strong> — nội dung đó chưa từng được giao cho Git.</span></div>
  <div class="lz-layer"><span class="lz-k">git restore --staged &lt;file&gt;</span><span class="lz-v">Index ← HEAD. Gỡ khỏi staging, để nguyên sửa đổi trên đĩa. Hoàn toàn an toàn.</span></div>
  <div class="lz-layer"><span class="lz-k">git reset --soft &lt;commit&gt;</span><span class="lz-v">Chỉ dời nhánh. Index và thư mục làm việc không đụng tới — thay đổi của bạn nằm ở staging. An toàn.</span></div>
  <div class="lz-layer"><span class="lz-k">git reset --mixed &lt;commit&gt;</span><span class="lz-v">Nhánh + index. Thư mục làm việc không đụng tới — thay đổi nằm ngoài staging. Mặc định. An toàn.</span></div>
  <div class="lz-layer"><span class="lz-k">git reset --hard &lt;commit&gt;</span><span class="lz-v">Cả ba. <strong>Phá huỷ</strong> — việc chưa commit mất hẳn.</span></div>
  <div class="lz-layer"><span class="lz-k">git revert &lt;commit&gt;</span><span class="lz-v">Thêm một commit MỚI hoàn tác một commit cũ. Không đổi thứ gì đã tồn tại. Cách hoàn tác duy nhất an toàn trên lịch sử đã chia sẻ.</span></div>
  <div class="lz-layer"><span class="lz-k">git stash</span><span class="lz-v">Dời thư mục làm việc + index vào một ảnh chụp cất đi, để bạn lại sạch sẽ. Đảo ngược được.</span></div>
</div>

<h3>Một luật duy nhất dự đoán được mức nguy hiểm</h3>
<div class="callout danger"><strong>Git cứu được mọi thứ nó đã nhìn thấy. Nó không cứu được thứ chưa bao giờ được cho xem.</strong> Một commit — kể cả cái bạn "đã xoá" — sống trong reflog ít nhất 30 ngày. Một sửa đổi chưa commit mà <code>reset --hard</code> hay <code>restore</code> ghi đè lên thì chưa từng được lưu ở đâu, và mất đúng như thể bạn đóng trình soạn thảo mà không lưu.</div>
<p>Vậy độ an toàn của mọi lệnh hoàn tác quy về một câu hỏi duy nhất: <em>nó có huỷ nội dung chưa commit không?</em> Chỉ ba lệnh làm thế — <code>restore &lt;file&gt;</code>, <code>reset --hard</code>, và <code>checkout -- &lt;file&gt;</code> (cách viết cũ của cái đầu). Còn lại đều là dời con trỏ, và dời con trỏ thì luôn đảo ngược được.</p>

<h3>Chọn theo thứ bạn thật sự muốn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">"Bỏ sửa đổi của tôi trên file này"</span><span class="v"><code>git restore src/app.ts</code> — phá huỷ, và là thứ bạn muốn trong chín mươi phần trăm trường hợp.</span></div>
  <div class="kv"><span class="k">"Tôi lỡ staging quá nhiều"</span><span class="v"><code>git restore --staged src/app.ts</code> — an toàn, sửa đổi vẫn còn.</span></div>
  <div class="kv"><span class="k">"Lời nhắn commit cuối của tôi sai"</span><span class="v"><code>git commit --amend</code> (bài 8.1) — viết lại commit cuối.</span></div>
  <div class="kv"><span class="k">"Tôi muốn làm lại commit cuối"</span><span class="v"><code>git reset --soft HEAD~1</code> — commit bị huỷ, mọi thứ nằm ở staging, commit lại cho tử tế.</span></div>
  <div class="kv"><span class="k">"Hoàn tác một commit đã push"</span><span class="v"><code>git revert &lt;mã băm&gt;</code> — câu trả lời đúng duy nhất. Đừng bao giờ reset một nhánh chung.</span></div>
  <div class="kv"><span class="k">"Đưa nhánh này lùi ba commit"</span><span class="v"><code>git reset --hard HEAD~3</code> — chỉ khi chưa push, và chỉ khi bạn không có gì chưa commit.</span></div>
  <div class="kv"><span class="k">"Cất việc này đi, tôi phải sửa gấp thứ khác"</span><span class="v"><code>git stash</code> (bài 4.5) — hoặc tốt hơn là commit lên một nhánh.</span></div>
  <div class="kv"><span class="k">"Tôi vừa phá mất thứ gì đó, cứu"</span><span class="v"><code>git reflog</code> (bài 4.4) — nếu nó từng được commit thì nó vẫn còn đó.</span></div>
</div>

<h3>Đã push hay chưa — lằn ranh quyết định mọi thứ</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">chỉ cục bộ</div><div class="lz-t">Làm gì cũng được</div><div class="lz-d">reset, rebase, amend. Không ai khác bị ảnh hưởng, và reflog bảo vệ bạn.</div></div>
  <div class="lz-step"><div class="lz-k">đã push, nhánh của bạn</div><div class="lz-t">Viết lại cẩn thận</div><div class="lz-d">reset/rebase rồi <code>--force-with-lease</code> (bài 8.3). Ổn trên nhánh tính năng cá nhân.</div></div>
  <div class="lz-step"><div class="lz-k">đã push và đã chia sẻ</div><div class="lz-t">Chỉ revert</div><div class="lz-d">Thêm một commit mới là thao tác duy nhất không làm hỏng bản clone của người khác.</div></div>
</div>
<p>Hãy kiểm trước khi hành động, thay vì đoán:</p>
<pre><code>git log --oneline origin/main..HEAD   <span class="tok-comment"># commit tôi có mà máy chủ chưa có</span>
git branch -r --contains 3f8a1c9      <span class="tok-comment"># nhánh remote nào chứa commit này?</span></code></pre>
<div class="out">3f8a1c9 fix: reject expired refresh tokens
9e2d4b7 feat(auth): add refresh token rotation</div>
<p>Hai commit đó chưa push, nên chúng là của bạn để viết lại. Bất cứ thứ gì <em>không</em> có trong danh sách thì đã nằm trên máy chủ, và thuộc về tất cả mọi người.</p>

<h3>Tên gọi, cũ và mới</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">git restore &lt;file&gt;</span><span class="v">= <code>git checkout -- &lt;file&gt;</code> cũ. Cùng hành vi, tên không nhập nhằng.</span></div>
  <div class="kv"><span class="k">git restore --staged &lt;file&gt;</span><span class="v">= <code>git reset HEAD &lt;file&gt;</code> cũ. Cùng hành vi.</span></div>
  <div class="kv"><span class="k">git switch &lt;nhánh&gt;</span><span class="v">= <code>git checkout &lt;nhánh&gt;</code> cũ.</span></div>
</div>
<p>Cả hai cách viết đều chạy; hướng dẫn cũ dùng cách cũ. Việc tách ra tồn tại vì <code>git checkout</code> làm hai việc chẳng liên quan gì nhau, và gõ nhầm cái này thành cái kia thì âm thầm huỷ mất công sức — đúng thứ mà tên mới ngăn chặn.</p>

<a class="link-card" href="https://git-scm.com/book/vi/v2/C%C3%A1c-C%C3%B4ng-C%E1%BB%A5-Git-Gi%E1%BA%A3i-M%C3%A3-Reset" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 7.7 (tiếng Việt) — Giải mã Reset</span><span class="lc-sub">Cách giải thích reset theo ba cây, kèm bảng cho từng chế độ.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: chọn đúng cách hoàn tác cho tám tình huống</span><span class="lc-sub">Kịch bản chấm điểm phủ restore, reset, revert và stash.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> vớ lấy <code>reset --hard</code> như một lệnh "cho sạch sẽ" dùng chung. Nó là lệnh Git thường ngày DUY NHẤT huỷ vĩnh viễn công sức, và nó làm thế trong im lặng, không hỏi xác nhận và không để lại gì trong reflog cho phần chưa commit. Trước khi gõ nó, hãy chạy <code>git status</code> và đọc xem bạn sắp mất gì. Nếu có thứ gì đáng giá, hãy <code>git stash</code> trước — tốn một giây và biến một lệnh phá huỷ thành một lệnh đảo ngược được.</div>
<p class="note-ct"><strong>Thói quen làm cho tất cả những điều trên thành thừa:</strong> commit sớm, trên một nhánh. Một commit là riêng tư cho tới khi push và sau đó vẫn nắn lại thoải mái. Khi công sức của bạn đã nằm trong một commit, mọi cách hoàn tác trong chương này đều trở thành dời con trỏ — và dời con trỏ thì không đánh mất được cái gì.</p>
</div>
`,
    },

    /* ─────────────────────────── 4.2 ─────────────────────────── */
    {
      title: '4.2 — git reset: soft, mixed, hard|||4.2 — git reset: soft, mixed, hard',
      slug: 'git-4-2-reset',
      type: 'LESSON',
      description: 'Ba chế độ reset qua đúng ba cây, chạy thật từng chế độ để thấy git status đổi ra sao, reset một file cụ thể, và vì sao reset --hard là lệnh nguy hiểm nhất của Git.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>One command, three depths</h2>
<p class="lead"><code>git reset</code> always does the same first thing — <strong>move the current branch pointer</strong> to the commit you name. The flag decides how far the change is propagated down through the other two trees. That is the whole design, and it is why the three modes feel unrelated until you see them side by side.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">--soft</span><span class="lz-v">Move the branch. Stop. Index and working directory keep the newer content, so those changes appear <em>staged</em>.</span></div>
  <div class="lz-layer"><span class="lz-k">--mixed (default)</span><span class="lz-v">Move the branch, then reset the index to match. Working directory untouched, so changes appear <em>unstaged</em>.</span></div>
  <div class="lz-layer"><span class="lz-k">--hard</span><span class="lz-v">Move the branch, reset the index, <strong>and overwrite the working directory</strong>. Uncommitted work is destroyed.</span></div>
</div>

<h3>Seeing the difference for real</h3>
<p>Start from a repository with three commits and a clean tree:</p>
<pre><code>git log --oneline -3</code></pre>
<div class="out">1a2b3c4 (HEAD -&gt; main) third
9e2d4b7 second
7b3e9d1 first</div>
<pre><code>git reset --soft HEAD~1 &amp;&amp; git status --short</code></pre>
<div class="out">M  file.txt</div>
<p>One column, on the left: the change from the "third" commit is now <strong>staged</strong>. The commit is gone from the branch, its content is not. This is the mode for "let me redo that commit properly" — <code>git commit</code> again and you are done.</p>
<pre><code>git reset --mixed HEAD~1 &amp;&amp; git status --short</code></pre>
<div class="out"> M file.txt</div>
<p>The M moved to the right column: the change is now <strong>unstaged</strong>, still in your file. This is the mode for "undo the commit and let me re-choose what to stage" — useful after an over-eager <code>git add .</code>.</p>
<pre><code>git reset --hard HEAD~1 &amp;&amp; git status --short</code></pre>
<div class="out"></div>
<p>Nothing. The commit is gone and so is its content, from disk. If that commit existed, the reflog can bring it back (4.4). If part of the change had never been committed, that part is gone permanently.</p>

<h3>The mental picture</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">--soft</div><div class="lz-t">HEAD moves</div><div class="lz-d">index ✓ untouched · working dir ✓ untouched → changes staged</div></div>
  <div class="lz-step"><div class="lz-k">--mixed</div><div class="lz-t">HEAD + index move</div><div class="lz-d">working dir ✓ untouched → changes unstaged</div></div>
  <div class="lz-step"><div class="lz-k">--hard</div><div class="lz-t">All three move</div><div class="lz-d">working dir OVERWRITTEN → uncommitted changes destroyed</div></div>
</div>

<h3>The everyday uses</h3>
<pre><code><span class="tok-comment"># Undo the last commit, keep everything staged, commit again properly:</span>
git reset --soft HEAD~1

<span class="tok-comment"># Squash the last three commits into one (a poor man's rebase -i):</span>
git reset --soft HEAD~3
git commit -m <span class="tok-string">"feat(auth): add refresh token rotation"</span>

<span class="tok-comment"># Undo the commit AND the staging, keep the file edits:</span>
git reset HEAD~1                     <span class="tok-comment"># --mixed is the default</span>

<span class="tok-comment"># Throw away the last two commits entirely (LOCAL branches only):</span>
git reset --hard HEAD~2</code></pre>
<div class="callout ok">The <code>--soft HEAD~3</code> + <code>commit</code> pair is the fastest way to collapse a handful of "wip" commits when you do not need to reorder or drop anything. Interactive rebase (3.5) is more precise; this is two commands and covers the common case.</div>

<h3>Resetting a single file</h3>
<pre><code>git reset HEAD src/app.ts        <span class="tok-comment"># unstage one file (old spelling)</span>
git restore --staged src/app.ts  <span class="tok-comment"># same thing, modern spelling — prefer this</span></code></pre>
<p>With a path, <code>reset</code> never moves the branch — it only copies that file from the named commit into the index. There is deliberately no <code>--hard</code> with a path: the destructive per-file operation is <code>git restore</code>, so you cannot reach it by accident while thinking about commits.</p>
<pre><code>git reset 3f8a1c9 -- src/app.ts  <span class="tok-comment"># stage that file AS IT WAS in an old commit</span>
git commit -m <span class="tok-string">"revert: restore the pre-refactor auth helper"</span></code></pre>

<h3>Why --hard is the most dangerous command in Git</h3>
<div class="callout danger">It is the only command in normal daily use that <strong>silently destroys work Git has never seen</strong>. No confirmation, no output, nothing in the reflog for the uncommitted part. Two minutes of unstaged edits and two hours of unstaged edits vanish the same way.</div>
<p>Two habits remove the risk entirely:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Look before you leap</span><span class="v"><code>git status</code> first, every time. If it lists modified files you care about, do not run <code>--hard</code> yet.</span></div>
  <div class="kv"><span class="k">Stash instead</span><span class="v"><code>git stash -u</code> then reset. The stash costs a second and turns an irreversible command into a reversible one — <code>git stash pop</code> brings it all back.</span></div>
</div>

<h3>Untracked files are not touched by reset</h3>
<pre><code>git reset --hard HEAD
git status --short</code></pre>
<div class="out">?? debug.log
?? scratch/</div>
<p><code>--hard</code> resets <em>tracked</em> files only. New files Git has never been told about survive, which is usually what you want. To remove those too:</p>
<pre><code>git clean -n        <span class="tok-comment"># DRY RUN — list what would be deleted. Always run this first.</span>
git clean -f        <span class="tok-comment"># delete untracked files</span>
git clean -fd       <span class="tok-comment"># …and untracked directories</span>
git clean -fdx      <span class="tok-comment"># …and ignored files too (node_modules, .env — careful!)</span></code></pre>
<div class="callout danger"><code>git clean -fdx</code> deletes your <code>.env</code>, your local database file, and anything else that is ignored but irreplaceable. There is no undo — these files were never in Git. Run <code>git clean -n</code> first, every single time, and read the list.</div>

<h3>Reset vs revert, in one line</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">reset</span><span class="v">Moves the branch backwards; commits after the target become unreferenced. Rewrites history → local branches only.</span></div>
  <div class="kv"><span class="k">revert</span><span class="v">Adds a new commit whose content is the inverse of an old one. History grows → safe on shared branches. Next lesson.</span></div>
</div>

<a class="link-card" href="https://git-scm.com/docs/git-reset" target="_blank" rel="noopener">
  <span class="lc-ico">⏪</span>
  <span class="lc-body"><span class="lc-title">git-reset — the tables of what each mode touches</span><span class="lc-sub">The "Discussion" section spells out all three trees per mode.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-clean" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">git-clean — and why -n exists</span><span class="lc-sub">Read this before ever typing -fdx.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>git reset --hard origin/main</code> on a branch where you had local commits you had forgotten about. It does exactly what you asked — throws away everything not on the server. The commits survive in the reflog, so it is recoverable, but only if you remember they existed. Run <code>git log --oneline origin/main..HEAD</code> first: an empty result means you have nothing to lose.</div>
<p class="note-ct"><strong>The one to memorise:</strong> <code>git reset --soft HEAD~1</code>. It undoes your last commit while keeping every change staged, which makes it the safe answer to "I committed too early", "wrong message", "forgot a file" and "that should have been two commits". It cannot lose anything, and it covers most of the situations people reach for <code>--hard</code> in.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Một lệnh, ba độ sâu</h2>
<p class="lead"><code>git reset</code> luôn làm cùng một việc đầu tiên — <strong>dời con trỏ nhánh hiện tại</strong> tới commit bạn gọi tên. Cái cờ quyết định thay đổi đó lan xuống hai cây còn lại bao xa. Đó là toàn bộ thiết kế, và đó là lý do ba chế độ nghe như chẳng liên quan gì nhau cho tới khi bạn nhìn chúng cạnh nhau.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">--soft</span><span class="lz-v">Dời nhánh. Dừng. Index và thư mục làm việc giữ nội dung mới hơn, nên các thay đổi đó hiện ra là <em>đã staging</em>.</span></div>
  <div class="lz-layer"><span class="lz-k">--mixed (mặc định)</span><span class="lz-v">Dời nhánh, rồi đặt lại index cho khớp. Thư mục làm việc không đụng tới, nên thay đổi hiện ra là <em>chưa staging</em>.</span></div>
  <div class="lz-layer"><span class="lz-k">--hard</span><span class="lz-v">Dời nhánh, đặt lại index, <strong>VÀ ghi đè thư mục làm việc</strong>. Việc chưa commit bị huỷ.</span></div>
</div>

<h3>Nhìn thấy khác biệt bằng mắt thật</h3>
<p>Bắt đầu từ một kho có ba commit và cây sạch:</p>
<pre><code>git log --oneline -3</code></pre>
<div class="out">1a2b3c4 (HEAD -&gt; main) third
9e2d4b7 second
7b3e9d1 first</div>
<pre><code>git reset --soft HEAD~1 &amp;&amp; git status --short</code></pre>
<div class="out">M  file.txt</div>
<p>Một cột, bên trái: thay đổi từ commit "third" giờ đã ở <strong>staging</strong>. Cái commit biến khỏi nhánh, nội dung của nó thì không. Đây là chế độ cho "để tôi làm lại commit đó cho tử tế" — <code>git commit</code> lần nữa là xong.</p>
<pre><code>git reset --mixed HEAD~1 &amp;&amp; git status --short</code></pre>
<div class="out"> M file.txt</div>
<p>Chữ M nhảy sang cột phải: thay đổi giờ <strong>chưa staging</strong>, vẫn nằm trong file của bạn. Đây là chế độ cho "huỷ commit và cho tôi chọn lại thứ nào đưa vào staging" — hữu ích sau một lần <code>git add .</code> quá vội.</p>
<pre><code>git reset --hard HEAD~1 &amp;&amp; git status --short</code></pre>
<div class="out"></div>
<p>Trống trơn. Commit biến mất và nội dung của nó cũng biến khỏi đĩa. Nếu commit đó từng tồn tại thì reflog mang nó về được (bài 4.4). Nếu một phần thay đổi chưa bao giờ được commit, phần đó mất vĩnh viễn.</p>

<h3>Bức tranh trong đầu</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">--soft</div><div class="lz-t">HEAD dời</div><div class="lz-d">index ✓ nguyên · thư mục làm việc ✓ nguyên → thay đổi ở staging</div></div>
  <div class="lz-step"><div class="lz-k">--mixed</div><div class="lz-t">HEAD + index dời</div><div class="lz-d">thư mục làm việc ✓ nguyên → thay đổi ngoài staging</div></div>
  <div class="lz-step"><div class="lz-k">--hard</div><div class="lz-t">Cả ba dời</div><div class="lz-d">thư mục làm việc BỊ GHI ĐÈ → thay đổi chưa commit bị huỷ</div></div>
</div>

<h3>Những cách dùng hằng ngày</h3>
<pre><code><span class="tok-comment"># Huỷ commit cuối, giữ mọi thứ ở staging, commit lại cho tử tế:</span>
git reset --soft HEAD~1

<span class="tok-comment"># Gộp ba commit cuối thành một (rebase -i của nhà nghèo):</span>
git reset --soft HEAD~3
git commit -m <span class="tok-string">"feat(auth): them xoay vong refresh token"</span>

<span class="tok-comment"># Huỷ cả commit LẪN việc staging, giữ sửa đổi trong file:</span>
git reset HEAD~1                     <span class="tok-comment"># --mixed là mặc định</span>

<span class="tok-comment"># Vứt hẳn hai commit cuối (CHỈ trên nhánh cục bộ):</span>
git reset --hard HEAD~2</code></pre>
<div class="callout ok">Cặp <code>--soft HEAD~3</code> + <code>commit</code> là cách nhanh nhất để dồn một nhúm commit "wip" khi bạn không cần đổi thứ tự hay bỏ cái nào. Rebase tương tác (bài 3.5) chính xác hơn; cái này chỉ hai lệnh và phủ được trường hợp thường gặp.</div>

<h3>Reset một file cụ thể</h3>
<pre><code>git reset HEAD src/app.ts        <span class="tok-comment"># gỡ một file khỏi staging (cách viết cũ)</span>
git restore --staged src/app.ts  <span class="tok-comment"># cùng việc, cách viết mới — nên dùng cái này</span></code></pre>
<p>Khi có đường dẫn, <code>reset</code> KHÔNG bao giờ dời nhánh — nó chỉ chép file đó từ commit được gọi tên vào index. Cố ý không có <code>--hard</code> đi cùng đường dẫn: thao tác phá huỷ theo từng file là <code>git restore</code>, nên bạn không thể chạm vào nó một cách tình cờ trong lúc đang nghĩ về commit.</p>
<pre><code>git reset 3f8a1c9 -- src/app.ts  <span class="tok-comment"># staging file đó ĐÚNG NHƯ nó có ở một commit cũ</span>
git commit -m <span class="tok-string">"revert: khoi phuc helper auth truoc lan refactor"</span></code></pre>

<h3>Vì sao --hard là lệnh nguy hiểm nhất của Git</h3>
<div class="callout danger">Nó là lệnh duy nhất dùng hằng ngày mà <strong>âm thầm huỷ công sức Git chưa từng nhìn thấy</strong>. Không hỏi xác nhận, không in gì, không để lại gì trong reflog cho phần chưa commit. Hai phút sửa đổi chưa staging và hai giờ sửa đổi chưa staging đều bốc hơi y như nhau.</div>
<p>Hai thói quen xoá sạch rủi ro đó:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Nhìn trước khi nhảy</span><span class="v"><code>git status</code> trước, mỗi lần. Nếu nó liệt kê những file đã sửa mà bạn còn cần, đừng chạy <code>--hard</code> vội.</span></div>
  <div class="kv"><span class="k">Stash thay vì thế</span><span class="v"><code>git stash -u</code> rồi reset. Cái stash tốn một giây và biến một lệnh không đảo ngược được thành đảo ngược được — <code>git stash pop</code> mang tất cả về.</span></div>
</div>

<h3>File chưa theo dõi không bị reset đụng tới</h3>
<pre><code>git reset --hard HEAD
git status --short</code></pre>
<div class="out">?? debug.log
?? scratch/</div>
<p><code>--hard</code> chỉ đặt lại các file <em>được theo dõi</em>. File mới mà Git chưa từng được cho biết thì sống sót, và đó thường là thứ bạn muốn. Muốn xoá cả chúng:</p>
<pre><code>git clean -n        <span class="tok-comment"># CHẠY THỬ — liệt kê thứ sẽ bị xoá. Luôn chạy cái này trước.</span>
git clean -f        <span class="tok-comment"># xoá file chưa theo dõi</span>
git clean -fd       <span class="tok-comment"># …và cả thư mục chưa theo dõi</span>
git clean -fdx      <span class="tok-comment"># …và cả file bị ignore (node_modules, .env — cẩn thận!)</span></code></pre>
<div class="callout danger"><code>git clean -fdx</code> xoá luôn <code>.env</code> của bạn, file database cục bộ, và mọi thứ khác bị ignore nhưng không thay thế được. Không có hoàn tác — những file đó chưa bao giờ ở trong Git. Hãy chạy <code>git clean -n</code> trước, mọi lần không sót lần nào, và đọc cái danh sách.</div>

<h3>Reset vs revert, trong một dòng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">reset</span><span class="v">Dời nhánh lùi lại; các commit sau điểm đích trở thành không ai trỏ tới. Viết lại lịch sử → chỉ dùng cho nhánh cục bộ.</span></div>
  <div class="kv"><span class="k">revert</span><span class="v">Thêm một commit mới có nội dung là nghịch đảo của một commit cũ. Lịch sử dài thêm ra → an toàn trên nhánh chung. Bài tiếp theo.</span></div>
</div>

<a class="link-card" href="https://git-scm.com/docs/git-reset" target="_blank" rel="noopener">
  <span class="lc-ico">⏪</span>
  <span class="lc-body"><span class="lc-title">git-reset — bảng liệt kê mỗi chế độ đụng vào cây nào</span><span class="lc-sub">Mục "Discussion" ghi rõ cả ba cây cho từng chế độ.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-clean" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">git-clean — và vì sao có cờ -n</span><span class="lc-sub">Đọc cái này trước khi gõ -fdx lần đầu.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>git reset --hard origin/main</code> trên một nhánh mà bạn có những commit cục bộ đã quên mất. Nó làm đúng thứ bạn yêu cầu — vứt đi mọi thứ không có trên máy chủ. Các commit sống sót trong reflog nên cứu được, nhưng chỉ khi bạn còn nhớ là chúng từng tồn tại. Hãy chạy <code>git log --oneline origin/main..HEAD</code> trước: kết quả trống nghĩa là bạn không có gì để mất.</div>
<p class="note-ct"><strong>Lệnh cần thuộc lòng:</strong> <code>git reset --soft HEAD~1</code>. Nó huỷ commit cuối trong khi giữ mọi thay đổi ở staging, nên nó là câu trả lời an toàn cho "tôi commit sớm quá", "sai lời nhắn", "quên một file" và "cái đó lẽ ra phải là hai commit". Nó không đánh mất được gì, và nó phủ phần lớn những tình huống mà người ta vớ lấy <code>--hard</code>.</p>
</div>
`,
    },

    /* ─────────────────────────── 4.3 ─────────────────────────── */
    {
      title: '4.3 — git revert: the only safe undo on shared history|||4.3 — git revert: cách hoàn tác an toàn duy nhất trên lịch sử đã chia sẻ',
      slug: 'git-4-3-revert',
      type: 'LESSON',
      description: 'Revert thêm một commit nghịch đảo thay vì xoá lịch sử, cách revert nhiều commit và một commit hợp nhất (-m 1), hoàn tác chính bản revert, và giới hạn: revert mã KHÔNG revert database.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>Undo by going forwards</h2>
<p class="lead">A bad commit is already on <code>main</code> and everyone has pulled it. <code>reset</code> is out of the question — it would rewrite history other people are standing on. <code>git revert</code> solves this by refusing to touch the past: it computes the inverse of the bad commit and adds that as a <strong>new commit</strong> on top.</p>

<pre><code>git revert 3f8a1c9</code></pre>
<div class="out">[main a7c2f91] Revert "feat(feed): add author preloading"
 1 file changed, 4 insertions(+), 18 deletions(-)</div>
<pre><code>git log --oneline -3</code></pre>
<div class="out">a7c2f91 (HEAD -&gt; main) Revert "feat(feed): add author preloading"
5f7a9c2 chore(deps): bump prisma to 6.2.0
3f8a1c9 feat(feed): add author preloading</div>
<p>Both commits are still there. History grew by one instead of shrinking by one — and every clone on the team stays valid, because nothing they already had was changed.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">reset</div><div class="lz-t">Erases the past</div><div class="lz-d">The branch stops pointing at the commit. Anyone who pulled it now disagrees with you.</div></div>
  <div class="lz-step"><div class="lz-k">revert</div><div class="lz-t">Adds to the future</div><div class="lz-d">A new commit undoes the effect. Everyone's history stays consistent; the record of what happened remains.</div></div>
</div>

<h3>Reverting several commits</h3>
<pre><code>git revert 3f8a1c9 9e2d4b7           <span class="tok-comment"># two specific commits, newest first</span>
git revert HEAD~3..HEAD              <span class="tok-comment"># a range — creates one revert commit per commit</span>
git revert --no-commit HEAD~3..HEAD  <span class="tok-comment"># stage all the inversions, commit once yourself</span>
git commit -m <span class="tok-string">"revert: roll back the whole feed preloading feature"</span></code></pre>
<div class="callout warn">Order matters when reverting a range. Git applies the inversions newest-first, because reverting an old commit before a newer one that depends on it will conflict. Passing a range handles the ordering for you; passing individual hashes does not — list them newest first.</div>

<h3>Reverting a merge commit</h3>
<p>A merge commit has two parents, so "undo it" is ambiguous: undo relative to <em>which</em> side? Git refuses to guess:</p>
<pre><code>git revert 8c4f2a1</code></pre>
<div class="out">error: commit 8c4f2a1 is a merge but no -m option was given.
fatal: revert failed</div>
<pre><code>git revert -m 1 8c4f2a1</code></pre>
<p><code>-m 1</code> means "treat parent 1 as the mainline" — parent 1 is the branch you were on when you merged (usually <code>main</code>). So this says: keep main's line of history, undo everything the merged branch brought in.</p>
<div class="callout danger"><strong>Reverting a merge has a long tail.</strong> Once you have reverted merge M, the branch's commits are considered "already in main" by Git's ancestry rules, even though their effect is gone. If you later fix the branch and merge it again, Git brings in <em>only the new commits</em> — the original changes stay reverted, and the feature ships half-missing. The standard fix is to revert the revert (<code>git revert &lt;revert-commit&gt;</code>) before merging again. Know this before you revert a merge on a real project.</div>

<h3>Reverting a revert</h3>
<pre><code>git revert a7c2f91</code></pre>
<div class="out">[main c3e9d04] Revert "Revert \\"feat(feed): add author preloading\\""</div>
<p>The double-negative message looks absurd and is exactly right: the feature is back. This is the normal way to say "we rolled that back on Friday to stop the bleeding; the fix is in, bring it back".</p>

<h3>Conflicts during a revert</h3>
<p>If the code has moved on since the commit you are undoing, the inverse patch may not apply cleanly:</p>
<pre><code>git revert 3f8a1c9</code></pre>
<div class="out">error: could not revert 3f8a1c9… feat(feed): add author preloading
hint: After resolving the conflicts, mark them with
hint: "git add/rm &lt;pathspec&gt;", then run "git revert --continue".</div>
<pre><code><span class="tok-comment"># resolve as in 3.3, then:</span>
git add src/services/feed.service.ts
git revert --continue
git revert --abort          <span class="tok-comment"># or give up cleanly</span></code></pre>

<h3>Write a message that says why</h3>
<p>Git's default is <code>Revert "&lt;original subject&gt;"</code>, which records <em>what</em> and not <em>why</em>. Edit it:</p>
<pre><code>git revert 3f8a1c9 --edit</code></pre>
<pre><code>Revert <span class="tok-string">"feat(feed): add author preloading"</span>

This reverts commit 3f8a1c9. Preloading issued one query per post
instead of one per page, and the feed p95 went from 180ms to 4.2s
under real traffic. Rolling back now; the batched version is being
prepared in #431.</code></pre>
<div class="callout ok">Without that body, the next person to read the log sees a feature added and removed with no explanation, and the most likely outcome is that they re-add it. A revert message is one of the highest-value commit messages you will ever write, because it is the one people most often disagree with later.</div>

<h3>What revert cannot undo</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Database migrations</span><span class="v">Reverting the code does <em>not</em> reverse a schema change or the data it transformed. You need a down-migration, planned separately.</span></div>
  <div class="kv"><span class="k">Anything already sent</span><span class="v">Emails, webhooks, payments, push notifications. The commit is undone; the effects are not.</span></div>
  <div class="kv"><span class="k">Leaked secrets</span><span class="v">The credential is still in the old commit and in every clone. Rotate it, then clean history (8.4).</span></div>
  <div class="kv"><span class="k">Deployed artefacts</span><span class="v">Reverting the source does nothing until you deploy again. Reverting <em>is not</em> rolling back.</span></div>
</div>

<a class="link-card" href="https://git-scm.com/docs/git-revert" target="_blank" rel="noopener">
  <span class="lc-ico">↩️</span>
  <span class="lc-body"><span class="lc-title">git-revert — including -m for merge commits</span><span class="lc-sub">The mainline-parent explanation, from the source.</span></span>
</a>
<a class="link-card" href="https://github.com/git/git/blob/master/Documentation/howto/revert-a-faulty-merge.txt" target="_blank" rel="noopener">
  <span class="lc-ico">⚠️</span>
  <span class="lc-body"><span class="lc-title">"How to revert a faulty merge" — the canonical Git document</span><span class="lc-sub">Written by Linus Torvalds. Read it before reverting a merge in anger.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> using <code>git reset --hard</code> on a shared branch to "undo" a bad commit, then force-pushing. It looks cleaner than a revert commit and it breaks every colleague's clone at once: their next pull tries to reconcile a history that no longer exists, and the usual outcome is that someone pushes the bad commit straight back. On anything shared, <code>revert</code> is not the polite option — it is the only correct one.</div>
<p class="note-ct"><strong>An operational note:</strong> during an incident, revert first and diagnose afterwards. A revert is one command, mechanically safe, and instantly reviewable; a forward fix written under pressure is neither. Get production back to a known-good state, then take the time to understand the bug with the tools from Chapter 2.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Hoàn tác bằng cách đi tới</h2>
<p class="lead">Một commit tồi đã nằm trên <code>main</code> và mọi người đã pull về. <code>reset</code> là chuyện không tưởng — nó sẽ viết lại lịch sử mà người khác đang đứng lên trên. <code>git revert</code> giải bài này bằng cách từ chối đụng vào quá khứ: nó tính ra nghịch đảo của commit tồi rồi thêm cái đó vào như một <strong>commit MỚI</strong> ở trên cùng.</p>

<pre><code>git revert 3f8a1c9</code></pre>
<div class="out">[main a7c2f91] Revert "feat(feed): add author preloading"
 1 file changed, 4 insertions(+), 18 deletions(-)</div>
<pre><code>git log --oneline -3</code></pre>
<div class="out">a7c2f91 (HEAD -&gt; main) Revert "feat(feed): add author preloading"
5f7a9c2 chore(deps): bump prisma to 6.2.0
3f8a1c9 feat(feed): add author preloading</div>
<p>Cả hai commit vẫn còn đó. Lịch sử DÀI THÊM một cái thay vì ngắn đi một cái — và mọi bản clone của cả nhóm vẫn hợp lệ, vì không có gì họ đã có bị thay đổi.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">reset</div><div class="lz-t">Xoá quá khứ</div><div class="lz-d">Nhánh thôi trỏ vào commit đó. Ai đã pull nó về thì giờ bất đồng với bạn.</div></div>
  <div class="lz-step"><div class="lz-k">revert</div><div class="lz-t">Thêm vào tương lai</div><div class="lz-d">Một commit mới huỷ bỏ tác dụng. Lịch sử của mọi người vẫn nhất quán; dấu vết chuyện đã xảy ra vẫn còn.</div></div>
</div>

<h3>Revert nhiều commit</h3>
<pre><code>git revert 3f8a1c9 9e2d4b7           <span class="tok-comment"># hai commit cụ thể, mới nhất trước</span>
git revert HEAD~3..HEAD              <span class="tok-comment"># một khoảng — tạo một commit revert cho MỖI commit</span>
git revert --no-commit HEAD~3..HEAD  <span class="tok-comment"># staging mọi phần nghịch đảo, tự commit một lần</span>
git commit -m <span class="tok-string">"revert: lui toan bo tinh nang preload feed"</span></code></pre>
<div class="callout warn">Thứ tự quan trọng khi revert một khoảng. Git áp các phần nghịch đảo theo thứ tự mới-nhất-trước, vì revert một commit cũ trước một commit mới hơn vốn phụ thuộc vào nó sẽ gây xung đột. Truyền cả một khoảng thì Git lo thứ tự hộ bạn; truyền từng mã băm rời thì không — hãy liệt kê mới nhất trước.</div>

<h3>Revert một commit hợp nhất</h3>
<p>Một commit hợp nhất có hai cha, nên "huỷ nó đi" là nhập nhằng: huỷ so với <em>phía nào</em>? Git từ chối đoán:</p>
<pre><code>git revert 8c4f2a1</code></pre>
<div class="out">error: commit 8c4f2a1 is a merge but no -m option was given.
fatal: revert failed</div>
<pre><code>git revert -m 1 8c4f2a1</code></pre>
<p><code>-m 1</code> nghĩa là "coi cha số 1 là dòng chính" — cha 1 là nhánh bạn đang đứng khi merge (thường là <code>main</code>). Nên câu này nói: giữ dòng lịch sử của main, huỷ mọi thứ nhánh được merge mang vào.</p>
<div class="callout danger"><strong>Revert một commit hợp nhất có cái đuôi rất dài.</strong> Khi bạn đã revert lần merge M, các commit của nhánh đó vẫn bị Git coi là "đã có trong main" theo luật tổ tiên, dù tác dụng của chúng đã biến mất. Nếu sau này bạn sửa nhánh rồi merge lại, Git chỉ mang vào <em>những commit mới</em> — các thay đổi ban đầu vẫn ở trạng thái bị revert, và tính năng lên production thiếu mất một nửa. Cách sửa chuẩn là revert chính cái revert (<code>git revert &lt;commit-revert&gt;</code>) trước khi merge lại. Hãy biết điều này TRƯỚC khi revert một merge trên dự án thật.</div>

<h3>Revert chính cái revert</h3>
<pre><code>git revert a7c2f91</code></pre>
<div class="out">[main c3e9d04] Revert "Revert \\"feat(feed): add author preloading\\""</div>
<p>Lời nhắn phủ định kép trông thật lố bịch và lại chính xác: tính năng đã quay lại. Đây là cách bình thường để nói "hôm thứ Sáu ta lùi cái đó để cầm máu; bản vá xong rồi, mang nó trở lại".</p>

<h3>Xung đột trong lúc revert</h3>
<p>Nếu mã đã đi tiếp kể từ commit bạn đang huỷ, bản vá nghịch đảo có thể không áp gọn được:</p>
<pre><code>git revert 3f8a1c9</code></pre>
<div class="out">error: could not revert 3f8a1c9… feat(feed): add author preloading
hint: After resolving the conflicts, mark them with
hint: "git add/rm &lt;pathspec&gt;", then run "git revert --continue".</div>
<pre><code><span class="tok-comment"># giải như bài 3.3, rồi:</span>
git add src/services/feed.service.ts
git revert --continue
git revert --abort          <span class="tok-comment"># hoặc bỏ cuộc một cách gọn ghẽ</span></code></pre>

<h3>Hãy viết lời nhắn nói VÌ SAO</h3>
<p>Mặc định của Git là <code>Revert "&lt;tiêu đề gốc&gt;"</code>, ghi lại <em>cái gì</em> chứ không ghi <em>vì sao</em>. Hãy sửa nó:</p>
<pre><code>git revert 3f8a1c9 --edit</code></pre>
<pre><code>Revert <span class="tok-string">"feat(feed): add author preloading"</span>

Revert commit 3f8a1c9. Preload bắn một truy vấn cho MỖI bài thay vì một
truy vấn cho mỗi trang, và p95 của feed nhảy từ 180ms lên 4,2s dưới tải
thật. Lùi lại ngay bây giờ; bản gộp theo lô đang được chuẩn bị ở #431.</code></pre>
<div class="callout ok">Không có phần thân đó, người đọc log tiếp theo chỉ thấy một tính năng được thêm vào rồi gỡ ra mà không có lời giải thích nào, và kết cục nhiều khả năng nhất là họ thêm lại nó. Lời nhắn của một commit revert là một trong những lời nhắn giá trị nhất bạn từng viết, vì nó là cái mà về sau người ta hay bất đồng nhất.</div>

<h3>Những thứ revert KHÔNG hoàn tác được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Migration cơ sở dữ liệu</span><span class="v">Revert mã <em>không</em> đảo ngược một thay đổi schema hay dữ liệu nó đã biến đổi. Bạn cần một migration đi xuống, lên kế hoạch riêng.</span></div>
  <div class="kv"><span class="k">Mọi thứ đã gửi đi</span><span class="v">Email, webhook, thanh toán, thông báo đẩy. Commit bị huỷ; tác dụng thì không.</span></div>
  <div class="kv"><span class="k">Bí mật bị lộ</span><span class="v">Chứng chỉ vẫn nằm trong commit cũ và trong mọi bản clone. Hãy xoay khoá, rồi dọn lịch sử (bài 8.4).</span></div>
  <div class="kv"><span class="k">Thứ đã deploy</span><span class="v">Revert mã nguồn chẳng làm gì cho tới khi bạn deploy lại. Revert <em>không phải</em> là rollback.</span></div>
</div>

<a class="link-card" href="https://git-scm.com/docs/git-revert" target="_blank" rel="noopener">
  <span class="lc-ico">↩️</span>
  <span class="lc-body"><span class="lc-title">git-revert — gồm cả -m cho commit hợp nhất</span><span class="lc-sub">Giải thích về cha dòng chính, từ chính nguồn.</span></span>
</a>
<a class="link-card" href="https://github.com/git/git/blob/master/Documentation/howto/revert-a-faulty-merge.txt" target="_blank" rel="noopener">
  <span class="lc-ico">⚠️</span>
  <span class="lc-body"><span class="lc-title">"How to revert a faulty merge" — tài liệu kinh điển của Git</span><span class="lc-sub">Do Linus Torvalds viết. Đọc trước khi revert một merge trong lúc nóng giận.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dùng <code>git reset --hard</code> trên nhánh chung để "huỷ" một commit tồi, rồi force-push. Nó trông gọn hơn một commit revert và nó làm hỏng bản clone của mọi đồng nghiệp cùng một lúc: lần pull sau của họ cố điều hoà với một lịch sử không còn tồn tại, và kết cục thường thấy là ai đó push thẳng cái commit tồi trở lại. Trên mọi thứ đã chia sẻ, <code>revert</code> không phải lựa chọn lịch sự — nó là lựa chọn đúng duy nhất.</div>
<p class="note-ct"><strong>Một lưu ý vận hành:</strong> trong lúc sự cố, hãy revert trước rồi chẩn đoán sau. Một lần revert là một lệnh, an toàn về mặt cơ học, và review được ngay lập tức; một bản vá tiến tới viết dưới áp lực thì không có tính chất nào trong hai tính chất đó. Hãy đưa production về trạng thái tốt đã biết, rồi mới dành thời gian hiểu con lỗi bằng bộ công cụ của Chương 2.</p>
</div>
`,
    },

    /* ─────────────────────────── 4.4 ─────────────────────────── */
    {
      title: '4.4 — git reflog: nothing is ever really lost|||4.4 — git reflog: không gì thật sự mất',
      slug: 'git-4-4-reflog',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Reflog ghi lại mọi vị trí HEAD từng đứng trên máy bạn — kể cả những commit không nhánh nào trỏ tới. Đọc reflog, cứu một nhánh đã xoá, một reset --hard hỏng, một rebase hỏng, và biết giới hạn của nó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>The undo button for the undo button</h2>
<p class="lead">This is the lesson that removes fear from every other lesson. Git keeps a private journal of <strong>every position <code>HEAD</code> has held on your machine</strong> — every commit, checkout, merge, rebase and reset — for at least 30 days. Even commits that no branch points to are still in there, still reachable, still fully intact.</p>

<pre><code>git reflog</code></pre>
<div class="out">e8b4d92 HEAD@{0}: reset: moving to HEAD~2
c7f1a30 HEAD@{1}: commit: test(auth): cover the expired-token path
b2c6a91 HEAD@{2}: commit: feat(auth): add refresh token rotation
5f7a9c2 HEAD@{3}: checkout: moving from main to feature/login
7b3e9d1 HEAD@{4}: commit: refactor(api): extract pagination</div>
<div class="kv-grid">
  <div class="kv"><span class="k">HEAD@{0}</span><span class="v">Where you are now. <code>HEAD@{1}</code> is where you were one move ago, and so on backwards in time.</span></div>
  <div class="kv"><span class="k">The action label</span><span class="v"><code>commit:</code>, <code>checkout:</code>, <code>reset:</code>, <code>rebase (start):</code>, <code>merge:</code> — what moved HEAD, which is how you find the entry you want.</span></div>
  <div class="kv"><span class="k">The hash</span><span class="v">The commit HEAD pointed at <em>after</em> that action. This is what you feed to <code>reset</code> or <code>switch -c</code>.</span></div>
</div>
<div class="callout ok">Read the list top-down as "the last thing I did, the thing before that…". To undo something, find the entry from <em>just before</em> it and go back there. In the output above, the reset at <code>HEAD@{0}</code> threw away two commits; <code>HEAD@{1}</code> is where the branch stood before it.</div>

<h3>Recovery 1 — a bad reset --hard</h3>
<pre><code>git reset --hard HEAD~2       <span class="tok-comment"># …and two good commits vanish</span>
git reflog -3</code></pre>
<div class="out">e8b4d92 HEAD@{0}: reset: moving to HEAD~2
c7f1a30 HEAD@{1}: commit: test(auth): cover the expired-token path
b2c6a91 HEAD@{2}: commit: feat(auth): add refresh token rotation</div>
<pre><code>git reset --hard HEAD@{1}     <span class="tok-comment"># or: git reset --hard c7f1a30</span></code></pre>
<div class="out">HEAD is now at c7f1a30 test(auth): cover the expired-token path</div>
<p>Both commits are back. They were never deleted — the branch simply stopped pointing at them, and the reflog remembered where they were.</p>

<h3>Recovery 2 — a deleted branch</h3>
<pre><code>git branch -D feature/login</code></pre>
<div class="out">Deleted branch feature/login (was c7f1a30).</div>
<p>Git even prints the hash as it deletes. If you missed it, the reflog has it:</p>
<pre><code>git reflog | grep <span class="tok-string">"feature/login"</span></code></pre>
<div class="out">c7f1a30 HEAD@{4}: checkout: moving from feature/login to main</div>
<pre><code>git switch -c feature/login c7f1a30</code></pre>
<div class="out">Switched to a new branch 'feature/login'</div>
<p>The branch is back with every commit. A branch is a 41-byte pointer (3.1) — deleting it never touched the commits, so recreating it at the same hash restores it exactly.</p>

<h3>Recovery 3 — a rebase that went wrong</h3>
<pre><code>git reflog -8</code></pre>
<div class="out">a1f9c34 HEAD@{0}: rebase (finish): returning to refs/heads/feature/login
a1f9c34 HEAD@{1}: rebase (pick): test(auth): cover the expired-token path
d8e2b70 HEAD@{2}: rebase (pick): feat(auth): add refresh token rotation
5f7a9c2 HEAD@{3}: rebase (start): checkout main
c7f1a30 HEAD@{4}: commit: test(auth): cover the expired-token path</div>
<pre><code>git reset --hard HEAD@{4}     <span class="tok-comment"># the entry just BEFORE "rebase (start)"</span></code></pre>
<p>The pattern is always the same: find <code>rebase (start)</code> and take the entry immediately below it. That is where your branch stood before the rebase touched anything.</p>

<h3>Per-branch reflogs</h3>
<pre><code>git reflog show main          <span class="tok-comment"># everywhere main itself has pointed</span>
git reflog show feature/login</code></pre>
<div class="out">3f8a1c9 main@{0}: merge feature/login: Fast-forward
7b3e9d1 main@{1}: commit: refactor(api): extract pagination
5f7a9c2 main@{2}: pull: Fast-forward</div>
<p>Useful for "what did <code>main</code> look like before I pulled this morning?" — <code>git diff main@{1} main</code> answers it exactly.</p>
<pre><code>git show main@{yesterday}     <span class="tok-comment"># time-based selectors work too</span>
git diff main@{<span class="tok-string">"2 hours ago"</span>} main
git log main@{1}..main --oneline</code></pre>
<div class="callout warn">Time selectors read the <em>local</em> reflog, so <code>main@{yesterday}</code> means "where main pointed on this machine yesterday", not "what the project looked like yesterday". On a fresh clone the reflog is nearly empty and these expressions silently fall back to the oldest entry.</div>

<h3>Finding commits the reflog missed</h3>
<pre><code>git fsck --lost-found</code></pre>
<div class="out">dangling commit 4d9e2f8a1b3c5d7e9f0a2b4c6d8e0f2a4b6c8d0e
dangling blob 7c4a1b2e...</div>
<p>A dangling commit is one nothing refers to — typically from a dropped stash or a rebase that discarded a commit whose reflog entry has expired. Inspect each with <code>git show &lt;hash&gt;</code>, and rescue what you want with <code>git switch -c rescue &lt;hash&gt;</code>.</p>

<h3>The limits — worth knowing precisely</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">It is local</span><span class="lz-v">The reflog lives in <code>.git/logs/</code> and is <strong>never</strong> pushed or cloned. A fresh clone has an almost empty reflog; your colleague's reflog cannot recover your mistake.</span></div>
  <div class="lz-layer"><span class="lz-k">It expires</span><span class="lz-v">Reachable entries after 90 days, unreachable ones after 30, then <code>git gc</code> may delete the objects. Long enough for any realistic panic.</span></div>
  <div class="lz-layer"><span class="lz-k">Commits only</span><span class="lz-v">It records where HEAD pointed. Work that was <strong>never committed</strong> — killed by <code>reset --hard</code> or <code>restore</code> — is not in it, because Git never saw it.</span></div>
</div>
<div class="callout danger">That last row is the one real gap in Git's safety net, and it is the reason Chapter 4.1 kept repeating: commit early. Once something is a commit, this lesson guarantees you can get it back. Until then, nothing does.</div>

<h3>Two habits</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Before anything scary</span><span class="v"><code>git reflog -1</code>. Note the hash. Now the operation is reversible whatever happens.</span></div>
  <div class="kv"><span class="k">After anything scary</span><span class="v">If the result is wrong, <code>git reflog</code> and go back. Do not try to repair a bad state by piling more commands on top of it.</span></div>
</div>

<a class="link-card" href="https://git-scm.com/docs/git-reflog" target="_blank" rel="noopener">
  <span class="lc-ico">🕰️</span>
  <span class="lc-body"><span class="lc-title">git-reflog — expiry rules and the @{…} syntax</span><span class="lc-sub">Where gc.reflogExpire and gc.reflogExpireUnreachable are documented.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: destroy a branch three ways and recover it three ways</span><span class="lc-sub">Graded exercises on reset, branch -D and a failed rebase.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> assuming <code>git clone</code> or a colleague can recover your lost commits. The reflog is strictly local and never transferred, so if you delete a branch that was never pushed, only <em>your</em> machine has any record of it. Clone the repository again on the same machine and the reflog is gone too — the objects are still in the old clone's <code>.git/</code>, not in the new one.</div>
<p class="note-ct"><strong>The sentence that changes how you use Git:</strong> if it was committed, it is recoverable. That is what makes it reasonable to experiment with rebase, reset and history rewriting instead of avoiding them — the cost of a mistake is one <code>reflog</code> lookup, not an afternoon.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Nút hoàn tác cho chính nút hoàn tác</h2>
<p class="lead">Đây là bài xoá bỏ nỗi sợ khỏi mọi bài khác. Git giữ một cuốn nhật ký riêng về <strong>mọi vị trí mà <code>HEAD</code> từng đứng trên máy bạn</strong> — mọi lần commit, checkout, merge, rebase và reset — trong ít nhất 30 ngày. Kể cả những commit không nhánh nào trỏ tới vẫn nằm trong đó, vẫn với tới được, vẫn nguyên vẹn hoàn toàn.</p>

<pre><code>git reflog</code></pre>
<div class="out">e8b4d92 HEAD@{0}: reset: moving to HEAD~2
c7f1a30 HEAD@{1}: commit: test(auth): cover the expired-token path
b2c6a91 HEAD@{2}: commit: feat(auth): add refresh token rotation
5f7a9c2 HEAD@{3}: checkout: moving from main to feature/login
7b3e9d1 HEAD@{4}: commit: refactor(api): extract pagination</div>
<div class="kv-grid">
  <div class="kv"><span class="k">HEAD@{0}</span><span class="v">Chỗ bạn đang đứng. <code>HEAD@{1}</code> là chỗ bạn đứng một nước trước đó, và cứ thế lùi dần về quá khứ.</span></div>
  <div class="kv"><span class="k">Nhãn hành động</span><span class="v"><code>commit:</code>, <code>checkout:</code>, <code>reset:</code>, <code>rebase (start):</code>, <code>merge:</code> — thứ đã dời HEAD, và đó là cách bạn tìm ra dòng mình cần.</span></div>
  <div class="kv"><span class="k">Mã băm</span><span class="v">Commit mà HEAD trỏ tới <em>SAU</em> hành động đó. Đây là thứ bạn đưa cho <code>reset</code> hay <code>switch -c</code>.</span></div>
</div>
<div class="callout ok">Đọc danh sách từ trên xuống như "việc cuối cùng tôi làm, việc trước đó nữa…". Muốn hoàn tác một việc, hãy tìm dòng <em>ngay trước</em> nó rồi quay về đó. Trong output ở trên, lệnh reset ở <code>HEAD@{0}</code> đã vứt đi hai commit; <code>HEAD@{1}</code> là chỗ nhánh đứng trước đó.</div>

<h3>Cứu hộ 1 — một lần reset --hard hỏng</h3>
<pre><code>git reset --hard HEAD~2       <span class="tok-comment"># …và hai commit tử tế bốc hơi</span>
git reflog -3</code></pre>
<div class="out">e8b4d92 HEAD@{0}: reset: moving to HEAD~2
c7f1a30 HEAD@{1}: commit: test(auth): cover the expired-token path
b2c6a91 HEAD@{2}: commit: feat(auth): add refresh token rotation</div>
<pre><code>git reset --hard HEAD@{1}     <span class="tok-comment"># hoặc: git reset --hard c7f1a30</span></code></pre>
<div class="out">HEAD is now at c7f1a30 test(auth): cover the expired-token path</div>
<p>Cả hai commit đã trở lại. Chúng chưa bao giờ bị xoá — chỉ là cái nhánh thôi trỏ vào chúng, và reflog thì nhớ chúng nằm ở đâu.</p>

<h3>Cứu hộ 2 — một nhánh đã xoá</h3>
<pre><code>git branch -D feature/login</code></pre>
<div class="out">Deleted branch feature/login (was c7f1a30).</div>
<p>Git in luôn mã băm ngay khi xoá. Nếu bạn lỡ không để ý, reflog có nó:</p>
<pre><code>git reflog | grep <span class="tok-string">"feature/login"</span></code></pre>
<div class="out">c7f1a30 HEAD@{4}: checkout: moving from feature/login to main</div>
<pre><code>git switch -c feature/login c7f1a30</code></pre>
<div class="out">Switched to a new branch 'feature/login'</div>
<p>Nhánh trở lại với đầy đủ commit. Một nhánh là con trỏ 41 byte (bài 3.1) — xoá nó chưa bao giờ đụng tới các commit, nên tạo lại nó ở đúng mã băm đó là khôi phục y nguyên.</p>

<h3>Cứu hộ 3 — một lần rebase đi sai</h3>
<pre><code>git reflog -8</code></pre>
<div class="out">a1f9c34 HEAD@{0}: rebase (finish): returning to refs/heads/feature/login
a1f9c34 HEAD@{1}: rebase (pick): test(auth): cover the expired-token path
d8e2b70 HEAD@{2}: rebase (pick): feat(auth): add refresh token rotation
5f7a9c2 HEAD@{3}: rebase (start): checkout main
c7f1a30 HEAD@{4}: commit: test(auth): cover the expired-token path</div>
<pre><code>git reset --hard HEAD@{4}     <span class="tok-comment"># dòng ngay TRƯỚC "rebase (start)"</span></code></pre>
<p>Quy luật lúc nào cũng thế: tìm dòng <code>rebase (start)</code> rồi lấy dòng ngay bên dưới nó. Đó là chỗ nhánh của bạn đứng trước khi rebase đụng vào bất cứ thứ gì.</p>

<h3>Reflog riêng cho từng nhánh</h3>
<pre><code>git reflog show main          <span class="tok-comment"># mọi nơi mà chính main từng trỏ tới</span>
git reflog show feature/login</code></pre>
<div class="out">3f8a1c9 main@{0}: merge feature/login: Fast-forward
7b3e9d1 main@{1}: commit: refactor(api): extract pagination
5f7a9c2 main@{2}: pull: Fast-forward</div>
<p>Hữu ích cho câu "sáng nay trước khi tôi pull thì <code>main</code> trông thế nào?" — <code>git diff main@{1} main</code> trả lời chính xác.</p>
<pre><code>git show main@{yesterday}     <span class="tok-comment"># chọn theo thời gian cũng được</span>
git diff main@{<span class="tok-string">"2 hours ago"</span>} main
git log main@{1}..main --oneline</code></pre>
<div class="callout warn">Bộ chọn theo thời gian đọc reflog <em>CỤC BỘ</em>, nên <code>main@{yesterday}</code> nghĩa là "chỗ main trỏ tới trên máy này hôm qua", không phải "dự án trông thế nào hôm qua". Trên một bản clone mới, reflog gần như trống và các biểu thức này âm thầm rơi về dòng cũ nhất.</div>

<h3>Tìm những commit mà reflog bỏ sót</h3>
<pre><code>git fsck --lost-found</code></pre>
<div class="out">dangling commit 4d9e2f8a1b3c5d7e9f0a2b4c6d8e0f2a4b6c8d0e
dangling blob 7c4a1b2e...</div>
<p>Một commit "lủng lẳng" là commit không có gì trỏ tới — thường từ một stash bị bỏ hoặc một lần rebase đã loại bỏ một commit mà dòng reflog của nó đã hết hạn. Hãy soi từng cái bằng <code>git show &lt;mã băm&gt;</code>, và cứu cái bạn cần bằng <code>git switch -c rescue &lt;mã băm&gt;</code>.</p>

<h3>Các giới hạn — đáng biết cho chính xác</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Nó là cục bộ</span><span class="lz-v">Reflog nằm ở <code>.git/logs/</code> và <strong>KHÔNG BAO GIỜ</strong> được push hay clone. Một bản clone mới có reflog gần như trống; reflog của đồng nghiệp không cứu được sai lầm của bạn.</span></div>
  <div class="lz-layer"><span class="lz-k">Nó hết hạn</span><span class="lz-v">Dòng còn với tới được thì sau 90 ngày, dòng không với tới được thì sau 30, rồi <code>git gc</code> có thể xoá các đối tượng. Đủ dài cho mọi cơn hoảng loạn thực tế.</span></div>
  <div class="lz-layer"><span class="lz-k">Chỉ commit</span><span class="lz-v">Nó ghi lại chỗ HEAD từng trỏ. Công sức <strong>CHƯA BAO GIỜ được commit</strong> — bị <code>reset --hard</code> hay <code>restore</code> giết — thì không nằm trong đó, vì Git chưa từng nhìn thấy nó.</span></div>
</div>
<div class="callout danger">Dòng cuối chính là lỗ hổng thật sự duy nhất trong lưới an toàn của Git, và đó là lý do bài 4.1 cứ nhắc đi nhắc lại: hãy commit sớm. Khi một thứ đã là commit, bài này bảo đảm bạn lấy lại được nó. Trước đó thì không gì bảo đảm cả.</div>

<h3>Hai thói quen</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Trước mọi việc đáng sợ</span><span class="v"><code>git reflog -1</code>. Ghi lại mã băm. Giờ thao tác đó đảo ngược được dù có chuyện gì xảy ra.</span></div>
  <div class="kv"><span class="k">Sau mọi việc đáng sợ</span><span class="v">Nếu kết quả sai, <code>git reflog</code> rồi quay lại. Đừng cố sửa một trạng thái tồi bằng cách chồng thêm lệnh lên trên nó.</span></div>
</div>

<a class="link-card" href="https://git-scm.com/docs/git-reflog" target="_blank" rel="noopener">
  <span class="lc-ico">🕰️</span>
  <span class="lc-body"><span class="lc-title">git-reflog — luật hết hạn và cú pháp @{…}</span><span class="lc-sub">Nơi gc.reflogExpire và gc.reflogExpireUnreachable được ghi lại.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: phá một nhánh theo ba cách và cứu nó theo ba cách</span><span class="lc-sub">Bài tập chấm điểm về reset, branch -D và một lần rebase hỏng.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tưởng <code>git clone</code> hay một đồng nghiệp cứu được các commit bạn làm mất. Reflog hoàn toàn cục bộ và không bao giờ được truyền đi, nên nếu bạn xoá một nhánh chưa từng được push thì chỉ <em>máy của bạn</em> mới có dấu vết về nó. Clone lại kho mã trên cùng cái máy đó thì reflog cũng mất theo — các đối tượng vẫn nằm trong <code>.git/</code> của bản clone CŨ, không nằm trong bản mới.</div>
<p class="note-ct"><strong>Câu làm thay đổi cách bạn dùng Git:</strong> nếu nó đã được commit thì nó cứu được. Đó là thứ làm cho việc thí nghiệm với rebase, reset và viết lại lịch sử trở thành hợp lý thay vì phải né tránh — cái giá của một sai lầm là một lần tra <code>reflog</code>, không phải một buổi chiều.</p>
</div>
`,
    },

    /* ─────────────────────────── 4.5 ─────────────────────────── */
    {
      title: '4.5 — git stash: parking work without committing|||4.5 — git stash: cất việc lại mà không cần commit',
      slug: 'git-4-5-stash',
      type: 'LESSON',
      description: 'Stash làm gì ở mức cơ chế, pop vs apply, stash nhiều lần và đặt tên, -u cho file chưa theo dõi, stash một phần với -p, và vì sao commit trên nhánh thường tốt hơn stash.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.5</span>
<h2>A drawer for work in progress</h2>
<p class="lead">You are halfway through a feature when a production bug arrives. Your working directory is a mess, and switching branches with modified files that differ between them is refused. <code>git stash</code> takes everything uncommitted, stores it safely, and hands you back a clean tree.</p>

<pre><code>git status --short</code></pre>
<div class="out">M  src/services/auth.service.ts
 M src/routes/auth.routes.ts</div>
<pre><code>git stash
git status --short</code></pre>
<div class="out">Saved working directory and index state WIP on feature/login: 3f8a1c9 feat(auth): rotation</div>
<p>Clean. Switch, fix the bug, come back, and bring your work out of the drawer:</p>
<pre><code>git switch main
<span class="tok-comment"># …fix, commit, push, deploy…</span>
git switch feature/login
git stash pop</code></pre>
<div class="out">On branch feature/login
Changes to be committed:
        modified:   src/services/auth.service.ts
Changes not staged for commit:
        modified:   src/routes/auth.routes.ts
Dropped refs/stash@{0} (a7c2f91d…)</div>
<div class="callout ok">Notice the staged/unstaged split survived exactly as it was. <code>git stash</code> records both the index and the working directory as separate commits internally, which is why the restore is faithful rather than "everything comes back unstaged".</div>

<h3>pop vs apply</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">git stash pop</span><span class="v">Restore <em>and delete</em> the stash entry. What you want most of the time.</span></div>
  <div class="kv"><span class="k">git stash apply</span><span class="v">Restore and <em>keep</em> the entry. Use it to apply the same work to two branches, or when you are not sure the restore will go cleanly.</span></div>
</div>
<div class="callout warn">If <code>pop</code> hits a conflict, the entry is <strong>not</strong> deleted — Git keeps it precisely because the restore was incomplete. Resolve the conflict, then <code>git stash drop</code> once you are satisfied. People who do not know this end up with a pile of duplicate stashes.</div>

<h3>Managing several stashes</h3>
<pre><code>git stash list</code></pre>
<div class="out">stash@{0}: WIP on feature/login: 3f8a1c9 feat(auth): rotation
stash@{1}: On main: experiment with the new feed query
stash@{2}: WIP on fix/feed-500: 9e2d4b7 fix(feed): null author</div>
<pre><code>git stash push -m <span class="tok-string">"half-finished pagination refactor"</span>   <span class="tok-comment"># name it — do this</span>
git stash show -p stash@{1}     <span class="tok-comment"># what is actually inside it</span>
git stash apply stash@{1}       <span class="tok-comment"># restore a specific one</span>
git stash drop  stash@{1}       <span class="tok-comment"># delete one</span>
git stash clear                 <span class="tok-comment"># delete ALL — no confirmation</span></code></pre>
<p>The default message, "WIP on branch: hash subject", tells you nothing three days later. <code>git stash push -m "…"</code> costs five seconds and is the difference between a usable drawer and a junk pile.</p>

<h3>Untracked and ignored files</h3>
<pre><code>git stash              <span class="tok-comment"># tracked files only — new files STAY in your working dir</span>
git stash -u           <span class="tok-comment"># also stash untracked files</span>
git stash -a           <span class="tok-comment"># also ignored files (node_modules, .env) — rarely what you want</span></code></pre>
<div class="callout warn">Plain <code>git stash</code> leaves untracked files behind. If your work in progress includes a brand-new file, stashing then switching branches carries that file with you into the other branch — where it does not belong, and where a careless <code>git add .</code> will commit it. When the work involves new files, use <code>-u</code>.</div>

<h3>Stashing part of your work</h3>
<pre><code>git stash push -p                        <span class="tok-comment"># choose hunk by hunk, like git add -p</span>
git stash push -m <span class="tok-string">"just the auth bits"</span> src/services/auth.service.ts</code></pre>
<p>Naming paths stashes only those files. Useful when one experiment is in the way and the rest of your changes are fine to keep working with.</p>

<h3>Turning a stash into a branch</h3>
<pre><code>git stash branch feature/pagination stash@{1}</code></pre>
<div class="out">Switched to a new branch 'feature/pagination'
Dropped stash@{1}</div>
<p>Creates a branch <em>from the commit the stash was made on</em>, applies the stash there, and drops it. This is the correct escape when a <code>pop</code> conflicts badly because the base has moved on: instead of fighting the conflict, restore the work in its original context and merge from there.</p>

<h3>Why a branch is usually better than a stash</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">stash</div><div class="lz-t">Invisible and unnamed</div><div class="lz-d">Not on any branch, not pushed, easy to forget, and gone if you clone fresh.</div></div>
  <div class="lz-step"><div class="lz-k">wip commit</div><div class="lz-t">Visible and safe</div><div class="lz-d"><code>git switch -c wip/pagination &amp;&amp; git commit -am "wip"</code> — a real commit, listed by <code>git branch</code>, pushable as a backup.</div></div>
  <div class="lz-step"><div class="lz-k">later</div><div class="lz-t">Clean it up</div><div class="lz-d"><code>git reset --soft HEAD~1</code> or <code>rebase -i</code> removes the wip commit before review. Nobody ever sees it.</div></div>
</div>
<p>Use the stash for what it is good at: a five-minute interruption. For anything you might still be holding tomorrow, a branch with a "wip" commit is safer, visible in <code>git branch</code>, and can be pushed so a dead laptop does not take it with it.</p>

<h3>Where stashes actually live</h3>
<pre><code>git log --oneline --graph stash@{0} -3</code></pre>
<div class="out">*-.   a7c2f91 WIP on feature/login: 3f8a1c9 feat(auth): rotation
|\\ \\
| | * 4d9e2f8 untracked files on feature/login
| * 8b1c3a5 index on feature/login: 3f8a1c9 feat(auth): rotation
|/
* 3f8a1c9 feat(auth): add refresh token rotation</div>
<p>A stash is a real commit — in fact two or three, tied together — sitting on the <code>refs/stash</code> ref instead of a branch. That is why <code>git stash show -p</code> works, why a dropped stash can still be found with <code>git fsck --lost-found</code> (4.4), and why the staged/unstaged split is preserved.</p>

<a class="link-card" href="https://git-scm.com/docs/git-stash" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">git-stash — push, pop, apply, branch, -u and -p</span><span class="lc-sub">Also documents the internal commit structure shown above.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: interrupt a feature, hotfix, and restore cleanly</span><span class="lc-sub">A graded exercise covering -u, named stashes and stash branch.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> the stash pile. Six months in, <code>git stash list</code> shows fourteen entries called "WIP on main", none of which you can identify, some of which apply to code that no longer exists. Nobody dares run <code>git stash clear</code> in case something matters. Two rules avoid it entirely: always <code>-m "…"</code>, and empty the drawer within a day or two — anything older belongs on a branch or in the bin.</div>
<p class="note-ct"><strong>The one-line summary:</strong> stash is a fast, unnamed, local drawer for a short interruption. It is not storage. It is not a backup — it never leaves your machine. Anything you would be upset to lose belongs in a commit on a branch, ideally pushed.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.5</span>
<h2>Một cái ngăn kéo cho việc đang làm dở</h2>
<p class="lead">Bạn đang làm dở một tính năng thì một lỗi production ập tới. Thư mục làm việc đang bừa bộn, và đổi nhánh khi có file đã sửa mà hai nhánh khác nhau thì bị từ chối. <code>git stash</code> lấy mọi thứ chưa commit, cất đi an toàn, và trả lại cho bạn một cây sạch.</p>

<pre><code>git status --short</code></pre>
<div class="out">M  src/services/auth.service.ts
 M src/routes/auth.routes.ts</div>
<pre><code>git stash
git status --short</code></pre>
<div class="out">Saved working directory and index state WIP on feature/login: 3f8a1c9 feat(auth): rotation</div>
<p>Sạch sẽ. Đổi nhánh, sửa lỗi, quay lại, và lấy việc của bạn ra khỏi ngăn kéo:</p>
<pre><code>git switch main
<span class="tok-comment"># …sửa, commit, push, deploy…</span>
git switch feature/login
git stash pop</code></pre>
<div class="out">On branch feature/login
Changes to be committed:
        modified:   src/services/auth.service.ts
Changes not staged for commit:
        modified:   src/routes/auth.routes.ts
Dropped refs/stash@{0} (a7c2f91d…)</div>
<div class="callout ok">Để ý phần chia staging/chưa-staging sống sót y nguyên. <code>git stash</code> ghi lại cả index lẫn thư mục làm việc thành các commit riêng ở bên trong, và vì thế việc khôi phục trung thực chứ không phải "mọi thứ trở về dạng chưa staging".</div>

<h3>pop vs apply</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">git stash pop</span><span class="v">Khôi phục <em>VÀ XOÁ</em> mục stash. Thứ bạn muốn trong phần lớn trường hợp.</span></div>
  <div class="kv"><span class="k">git stash apply</span><span class="v">Khôi phục và <em>GIỮ</em> mục đó. Dùng khi muốn áp cùng một phần việc lên hai nhánh, hoặc khi chưa chắc việc khôi phục sẽ trôi chảy.</span></div>
</div>
<div class="callout warn">Nếu <code>pop</code> gặp xung đột, mục stash <strong>KHÔNG</strong> bị xoá — Git giữ lại chính vì việc khôi phục chưa trọn vẹn. Hãy giải xung đột, rồi <code>git stash drop</code> khi bạn hài lòng. Người không biết điều này rốt cuộc có một đống stash trùng lặp.</div>

<h3>Quản lý nhiều stash</h3>
<pre><code>git stash list</code></pre>
<div class="out">stash@{0}: WIP on feature/login: 3f8a1c9 feat(auth): rotation
stash@{1}: On main: experiment with the new feed query
stash@{2}: WIP on fix/feed-500: 9e2d4b7 fix(feed): null author</div>
<pre><code>git stash push -m <span class="tok-string">"refactor phan trang lam do dang"</span>   <span class="tok-comment"># đặt tên — hãy làm việc này</span>
git stash show -p stash@{1}     <span class="tok-comment"># thật ra bên trong nó có gì</span>
git stash apply stash@{1}       <span class="tok-comment"># khôi phục một cái cụ thể</span>
git stash drop  stash@{1}       <span class="tok-comment"># xoá một cái</span>
git stash clear                 <span class="tok-comment"># xoá TẤT CẢ — không hỏi xác nhận</span></code></pre>
<p>Lời nhắn mặc định, "WIP on nhánh: mã băm tiêu đề", chẳng nói gì với bạn sau ba ngày. <code>git stash push -m "…"</code> tốn năm giây và là khác biệt giữa một ngăn kéo dùng được và một đống đồ bỏ.</p>

<h3>File chưa theo dõi và file bị ignore</h3>
<pre><code>git stash              <span class="tok-comment"># chỉ file được theo dõi — file mới VẪN NẰM ở thư mục làm việc</span>
git stash -u           <span class="tok-comment"># cất luôn file chưa theo dõi</span>
git stash -a           <span class="tok-comment"># cất cả file bị ignore (node_modules, .env) — hiếm khi là thứ bạn muốn</span></code></pre>
<div class="callout warn"><code>git stash</code> trần bỏ lại các file chưa theo dõi. Nếu việc đang dở của bạn có một file hoàn toàn mới, stash rồi đổi nhánh sẽ mang file đó theo bạn sang nhánh kia — nơi nó không thuộc về, và nơi một lần <code>git add .</code> bất cẩn sẽ commit nó. Khi công việc có file mới, hãy dùng <code>-u</code>.</div>

<h3>Cất một phần công việc</h3>
<pre><code>git stash push -p                        <span class="tok-comment"># chọn từng đoạn, như git add -p</span>
git stash push -m <span class="tok-string">"chi phan auth"</span> src/services/auth.service.ts</code></pre>
<p>Gọi tên đường dẫn thì chỉ cất những file đó. Hữu ích khi một thí nghiệm đang vướng chân còn phần thay đổi còn lại thì vẫn làm việc tiếp được.</p>

<h3>Biến một stash thành một nhánh</h3>
<pre><code>git stash branch feature/pagination stash@{1}</code></pre>
<div class="out">Switched to a new branch 'feature/pagination'
Dropped stash@{1}</div>
<p>Tạo một nhánh <em>từ chính commit mà stash được tạo ra trên đó</em>, áp stash vào đấy, rồi bỏ stash đi. Đây là lối thoát đúng khi một lần <code>pop</code> xung đột nặng vì phần gốc đã đi tiếp: thay vì vật lộn với xung đột, hãy khôi phục công việc trong đúng ngữ cảnh gốc của nó rồi hợp nhất từ đó.</p>

<h3>Vì sao một nhánh thường tốt hơn một stash</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">stash</div><div class="lz-t">Vô hình và không tên</div><div class="lz-d">Không nằm trên nhánh nào, không được push, dễ quên, và mất sạch nếu bạn clone mới.</div></div>
  <div class="lz-step"><div class="lz-k">commit wip</div><div class="lz-t">Nhìn thấy được và an toàn</div><div class="lz-d"><code>git switch -c wip/pagination &amp;&amp; git commit -am "wip"</code> — một commit thật, có trong <code>git branch</code>, push lên làm bản sao lưu được.</div></div>
  <div class="lz-step"><div class="lz-k">về sau</div><div class="lz-t">Dọn nó đi</div><div class="lz-d"><code>git reset --soft HEAD~1</code> hoặc <code>rebase -i</code> gỡ commit wip trước khi review. Không ai từng nhìn thấy nó.</div></div>
</div>
<p>Hãy dùng stash cho đúng thứ nó giỏi: một lần gián đoạn năm phút. Với bất cứ thứ gì có thể ngày mai bạn vẫn còn cầm, một nhánh kèm commit "wip" thì an toàn hơn, nhìn thấy được trong <code>git branch</code>, và push lên được để một cái laptop chết không mang nó đi theo.</p>

<h3>Stash thật ra nằm ở đâu</h3>
<pre><code>git log --oneline --graph stash@{0} -3</code></pre>
<div class="out">*-.   a7c2f91 WIP on feature/login: 3f8a1c9 feat(auth): rotation
|\\ \\
| | * 4d9e2f8 untracked files on feature/login
| * 8b1c3a5 index on feature/login: 3f8a1c9 feat(auth): rotation
|/
* 3f8a1c9 feat(auth): add refresh token rotation</div>
<p>Một stash là một commit THẬT — thật ra là hai hoặc ba cái, buộc lại với nhau — nằm trên ref <code>refs/stash</code> thay vì trên một nhánh. Vì thế <code>git stash show -p</code> chạy được, vì thế một stash đã bỏ vẫn tìm lại được bằng <code>git fsck --lost-found</code> (bài 4.4), và vì thế phần chia staging/chưa-staging được giữ nguyên.</p>

<a class="link-card" href="https://git-scm.com/docs/git-stash" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">git-stash — push, pop, apply, branch, -u và -p</span><span class="lc-sub">Cũng ghi lại cấu trúc commit bên trong đã trình bày ở trên.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: bị cắt ngang giữa một tính năng, vá gấp, rồi khôi phục sạch</span><span class="lc-sub">Bài tập chấm điểm phủ -u, stash có tên và stash branch.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đống stash. Sáu tháng sau, <code>git stash list</code> hiện mười bốn mục đều tên "WIP on main", không cái nào bạn nhận ra được, vài cái áp cho phần mã không còn tồn tại. Không ai dám chạy <code>git stash clear</code> phòng khi có thứ gì đó quan trọng. Hai luật tránh hẳn chuyện này: luôn <code>-m "…"</code>, và dọn sạch ngăn kéo trong một hai ngày — thứ gì cũ hơn thì thuộc về một nhánh hoặc thuộc về thùng rác.</div>
<p class="note-ct"><strong>Tóm tắt một dòng:</strong> stash là một ngăn kéo nhanh, không tên, cục bộ, cho một lần gián đoạn ngắn. Nó không phải chỗ lưu trữ. Nó không phải bản sao lưu — nó không bao giờ rời khỏi máy bạn. Thứ gì mà mất đi bạn sẽ tiếc thì thuộc về một commit trên một nhánh, tốt nhất là đã push.</p>
</div>
`,
    },

    /* ─────────────────────────── 4.6 Quiz ─────────────────────────── */
    {
      title: '4.6 — Chapter 4 quiz|||4.6 — Kiểm tra Chương 4',
      slug: 'git-4-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về ba chế độ reset, revert vs reset trên nhánh chung, revert một commit hợp nhất, reflog và giới hạn của nó, git clean, và stash.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on undoing things. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: the one thing the reflog cannot recover (4.4), and why revert is the only correct undo on a shared branch (4.3).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về hoàn tác. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: thứ duy nhất reflog KHÔNG cứu được (bài 4.4), và vì sao revert là cách hoàn tác đúng duy nhất trên nhánh chung (bài 4.3).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'After "git reset --soft HEAD~1", where are the changes from that commit?|||Sau "git reset --soft HEAD~1", các thay đổi của commit đó nằm ở đâu?',
            options: [
              'Deleted|||Đã bị xoá',
              'Staged in the index, ready to commit again|||Đã ở staging trong index, sẵn sàng commit lại',
              'Unstaged in the working directory|||Chưa staging, ở thư mục làm việc',
              'In the stash|||Trong stash',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which reset mode can permanently destroy uncommitted work?|||Chế độ reset nào có thể huỷ vĩnh viễn công việc chưa commit?',
            options: [
              '--soft',
              '--mixed',
              '--hard — it overwrites the working directory as well|||--hard — nó ghi đè cả thư mục làm việc',
              'All three do|||Cả ba đều thế',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'A bad commit is already pushed to main and everyone pulled it. What is the correct undo?|||Một commit tồi đã được push lên main và mọi người đã pull về. Cách hoàn tác đúng là gì?',
            options: [
              'git reset --hard then force-push|||git reset --hard rồi force-push',
              'git revert <hash> — it adds a new inverse commit and leaves everyone\'s history valid|||git revert <mã băm> — nó thêm một commit nghịch đảo mới và giữ lịch sử của mọi người hợp lệ',
              'git rebase -i and drop the commit|||git rebase -i rồi drop commit đó',
              'Delete the branch and recreate it|||Xoá nhánh rồi tạo lại',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does "git revert" refuse to run on a merge commit without -m?|||Vì sao "git revert" từ chối chạy trên một commit hợp nhất khi không có -m?',
            options: [
              'Merge commits cannot be reverted at all|||Commit hợp nhất hoàn toàn không revert được',
              'A merge has two parents, so "undo relative to which side?" is ambiguous — -m names the mainline parent|||Một merge có hai cha, nên "huỷ so với phía nào?" là nhập nhằng — -m gọi tên cha dòng chính',
              'It needs -m to write the commit message|||Nó cần -m để viết lời nhắn commit',
              'Because merge commits have no diff|||Vì commit hợp nhất không có diff',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the ONE thing git reflog cannot recover?|||MỘT thứ duy nhất git reflog không cứu được là gì?',
            options: [
              'Deleted branches|||Nhánh đã xoá',
              'Commits dropped by a rebase|||Commit bị rebase loại bỏ',
              'Work that was never committed — killed by reset --hard or restore, because Git never saw it|||Công việc CHƯA BAO GIỜ được commit — bị reset --hard hay restore giết, vì Git chưa từng nhìn thấy nó',
              'Commits made on a detached HEAD|||Commit tạo khi HEAD lìa cành',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Can a colleague use their reflog to recover a branch you deleted and never pushed?|||Đồng nghiệp có thể dùng reflog của họ để cứu một nhánh bạn đã xoá và chưa từng push không?',
            options: [
              'Yes, reflogs sync with the remote|||Có, reflog đồng bộ với remote',
              'No — the reflog is strictly local, lives in .git/logs/, and is never pushed or cloned|||Không — reflog hoàn toàn cục bộ, nằm ở .git/logs/, và không bao giờ được push hay clone',
              'Only if they cloned after you created the branch|||Chỉ khi họ clone sau lúc bạn tạo nhánh',
              'Only with git fetch --reflog',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does "git clean -fdx" delete that "git reset --hard" does not?|||"git clean -fdx" xoá thứ gì mà "git reset --hard" không xoá?',
            options: [
              'Nothing — they are equivalent|||Không gì cả — chúng tương đương',
              'Untracked files, untracked directories AND ignored files such as .env and node_modules|||File chưa theo dõi, thư mục chưa theo dõi VÀ các file bị ignore như .env và node_modules',
              'Only files listed in .gitignore|||Chỉ những file có trong .gitignore',
              'The .git directory|||Thư mục .git',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: '"git stash pop" hits a conflict. Is the stash entry deleted?|||"git stash pop" gặp xung đột. Mục stash có bị xoá không?',
            options: [
              'Yes, always — pop always drops the entry|||Có, luôn luôn — pop luôn bỏ mục đó',
              'No — Git keeps it because the restore was incomplete; drop it yourself after resolving|||Không — Git giữ lại vì việc khôi phục chưa trọn vẹn; hãy tự drop sau khi giải xong',
              'It is converted into a branch automatically|||Nó tự động được chuyển thành một nhánh',
              'It is deleted but recoverable with git stash undo|||Nó bị xoá nhưng cứu được bằng git stash undo',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
