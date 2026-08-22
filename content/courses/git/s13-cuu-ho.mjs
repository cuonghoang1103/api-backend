/**
 * Git & GitHub — Chương 13: Sách công thức cứu hộ + Git trong quy trình thật.
 * Mười tình huống sự cố kèm cách xử · quy trình thật của cuongthai.com, làm việc cùng
 * agent AI, và bảng tra nhanh · bài kiểm tra cuối khoá 12 câu.
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out đóng bằng </div> (KHÔNG </code></pre>). KHÔNG dùng <svg>.
 */
const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 13 — Disaster recovery & Git in a real workflow|||Chương 13 — Cứu hộ & Git trong quy trình thật',
  description: 'Chương cuối, viết để mở ra giữa lúc sự cố: mười tình huống thật kèm lệnh xử lý, quy trình Git đang chạy thật của cuongthai.com, cách làm việc cùng agent AI trên cùng một kho mã, và một bảng tra nhanh gói lại toàn khoá.',
  lessons: [
    /* ─────────────────────────── 13.1 ─────────────────────────── */
    {
      title: '13.1 — The disaster recovery cookbook|||13.1 — Sách công thức cứu hộ',
      slug: 'git-13-1-cuu-ho',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mười tình huống "hỏng rồi" phổ biến nhất, mỗi cái kèm chẩn đoán và lệnh xử lý. Bài này viết để đọc lẻ, giữa lúc đang hoảng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.1</span>
<h2>Open this one mid-emergency</h2>
<p class="lead">Ten situations, each with the diagnosis and the fix. Read it out of order. Before any of them, two commands are always safe and always worth running first:</p>
<pre><code>git status                 <span class="tok-comment"># where am I, what is uncommitted</span>
git reflog -15             <span class="tok-comment"># where HEAD has been (4.4)</span></code></pre>
<div class="callout ok"><strong>The rule that makes all of this survivable:</strong> if it was ever committed, it is recoverable for at least 30 days. Only <em>uncommitted</em> work can truly be lost. So before attempting any fix on a dirty tree: <code>git stash -u</code>. One second, and the destructive command becomes reversible.</div>

<h3>1. I committed to the wrong branch</h3>
<pre><code><span class="tok-comment"># Not pushed. Move the last commit to the right branch:</span>
git switch -c feature/right-branch      <span class="tok-comment"># brings the commit with you</span>
git switch main
git reset --hard HEAD~1                 <span class="tok-comment"># remove it from main</span></code></pre>
<pre><code><span class="tok-comment"># Several commits, or you already switched away — cherry-pick them across:</span>
git switch feature/right-branch
git cherry-pick 3f8a1c9 9e2d4b7
git switch main &amp;&amp; git reset --hard HEAD~2</code></pre>

<h3>2. I ran reset --hard and lost commits</h3>
<pre><code>git reflog -10</code></pre>
<div class="out">e8b4d92 HEAD@{0}: reset: moving to HEAD~3
c7f1a30 HEAD@{1}: commit: test(auth): cover the expired-token path</div>
<pre><code>git reset --hard HEAD@{1}</code></pre>
<p>The entry <em>just before</em> the destructive one is where you were. Uncommitted changes at that moment are still gone — that is the one gap (4.4).</p>

<h3>3. I deleted a branch</h3>
<pre><code>git reflog | grep <span class="tok-string">"feature/login"</span>
git switch -c feature/login c7f1a30</code></pre>
<p><code>git branch -D</code> even prints the hash as it deletes: "Deleted branch feature/login (was c7f1a30)". Scroll up before panicking.</p>

<h3>4. I committed a secret</h3>
<div class="callout danger"><strong>Rotate the credential first.</strong> Revoke it at the provider, issue a new one. Only then clean history — and if the commit was pushed to a public repository, assume the key is already compromised (8.3).</div>
<pre><code><span class="tok-comment"># Not pushed, and it is the last commit:</span>
git rm --cached .env &amp;&amp; git commit --amend --no-edit

<span class="tok-comment"># Anywhere in history, after rotating:</span>
git clone --mirror &lt;url&gt; &amp;&amp; cd repo.git
git filter-repo --invert-paths --path .env
git push --force --all &amp;&amp; git push --force --tags
<span class="tok-comment"># then: everyone re-clones (8.3)</span></code></pre>

<h3>5. Someone force-pushed over my commits</h3>
<pre><code>git reflog                              <span class="tok-comment"># if you still have them locally</span>
git switch -c rescue e8b4d92
git rebase origin/feature/login rescue
git push origin rescue</code></pre>
<pre><code><span class="tok-comment"># If your clone no longer has them, ask GitHub for the pre-push SHA:</span>
gh api repos/OWNER/REPO/events \\
  --jq <span class="tok-string">'.[] | select(.type=="PushEvent") | {before: .payload.before, ref: .payload.ref}'</span>
git fetch origin &lt;before-sha&gt;</code></pre>

<h3>6. Detached HEAD, and I made commits there</h3>
<pre><code>git switch -c rescue        <span class="tok-comment"># do this BEFORE switching away</span></code></pre>
<pre><code><span class="tok-comment"># Already switched away? They are unreferenced but alive:</span>
git reflog
git switch -c rescue &lt;hash&gt;
<span class="tok-comment"># or, if the reflog entry expired:</span>
git fsck --lost-found</code></pre>

<h3>7. A merge or rebase went wrong, mid-flight</h3>
<pre><code>git merge --abort           <span class="tok-comment"># mid-merge: back to before</span>
git rebase --abort          <span class="tok-comment"># mid-rebase: back to before</span>
git cherry-pick --abort
git revert --abort</code></pre>
<pre><code><span class="tok-comment"># Already finished, and the result is wrong:</span>
git reset --hard ORIG_HEAD  <span class="tok-comment"># Git saved where you were</span>
<span class="tok-comment"># or find the entry before "rebase (start)" in the reflog (3.5)</span></code></pre>

<h3>8. I pushed a bad commit to main</h3>
<pre><code>git revert 3f8a1c9          <span class="tok-comment"># NOT reset — main is shared (4.3)</span>
git revert -m 1 8c4f2a1     <span class="tok-comment"># if it was a merge commit</span>
git push</code></pre>
<p>During an incident, revert first and diagnose afterwards. A revert is one mechanically safe command; a forward fix written under pressure is neither.</p>

<h3>9. "fatal: refusing to merge unrelated histories"</h3>
<pre><code>git log --oneline | tail -3
git log --oneline other/main | tail -3     <span class="tok-comment"># do the root commits differ?</span></code></pre>
<p>If you did not expect two roots, you probably cloned into an existing folder or ran <code>git init</code> twice. Fix the mistake rather than passing <code>--allow-unrelated-histories</code>, which buries it (3.2).</p>

<h3>10. The repository looks corrupted</h3>
<pre><code>git fsck --full                     <span class="tok-comment"># what does Git think is wrong?</span>
cat .git/HEAD                       <span class="tok-comment"># does it name a ref that exists?</span>
git rev-parse main                  <span class="tok-comment"># does the branch resolve?</span>
git cat-file -t \$(git rev-parse HEAD)</code></pre>
<div class="callout ok">Chapter 9 turns this from mysticism into a checklist. <code>HEAD</code> names a ref; the ref holds a hash; the hash resolves to a commit object. Whichever link breaks tells you what to repair — and the last resort always works: clone fresh from the remote, then recover local-only work from the old <code>.git</code> with <code>git fsck --lost-found</code>.</div>

<h3>The panic checklist</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Stop typing</div><div class="lz-d">Every extra command makes the state harder to read. Nothing is on fire that one minute makes worse.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Protect the tree</div><div class="lz-d"><code>git stash -u</code>, or copy the whole folder. Uncommitted work is the only thing genuinely at risk.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Look</div><div class="lz-d"><code>git status</code>, <code>git reflog -15</code>, <code>git log --oneline --graph --all -20</code>.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Name the situation</div><div class="lz-d">Match it to one of the ten above before running anything.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Fix, then verify</div><div class="lz-d">Re-run <code>git log</code> and <code>git status</code>. Confirm the commits are where you think.</div></div>
</div>

<a class="link-card" href="https://git-scm.com/docs/git-fsck" target="_blank" rel="noopener">
  <span class="lc-ico">🩺</span>
  <span class="lc-body"><span class="lc-title">git-fsck — verifying and finding dangling objects</span><span class="lc-sub">The tool of last resort when the reflog has expired.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: break a repository ten ways and recover it ten ways</span><span class="lc-sub">Graded exercises mirroring every scenario in this lesson.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> fixing a bad state by piling more commands on top of it — a reset, then a merge, then a rebase, each based on a guess. Every one adds reflog entries and makes the original state harder to identify. Stop, look, name the situation, then run one command. If it does not do what you expected, go back with <code>reflog</code> before trying anything else.</div>
<p class="note-ct"><strong>The one habit worth taking from this whole course:</strong> commit early and often, on a branch. Every recovery above works because the work was in a commit. The single unrecoverable case — uncommitted changes destroyed by <code>reset --hard</code>, <code>restore</code> or <code>clean</code> — only exists in the window before you commit, and that window is entirely under your control.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.1</span>
<h2>Mở bài này ra giữa lúc sự cố</h2>
<p class="lead">Mười tình huống, mỗi cái kèm chẩn đoán và cách xử lý. Đọc lẻ, không cần theo thứ tự. Trước bất kỳ tình huống nào, hai lệnh sau lúc nào cũng an toàn và lúc nào cũng đáng chạy trước:</p>
<pre><code>git status                 <span class="tok-comment"># tôi đang ở đâu, cái gì chưa commit</span>
git reflog -15             <span class="tok-comment"># HEAD đã đi qua những đâu (bài 4.4)</span></code></pre>
<div class="callout ok"><strong>Luật làm cho mọi chuyện dưới đây đều sống sót được:</strong> nếu nó từng được commit thì nó cứu được, ít nhất trong 30 ngày. Chỉ công việc <em>CHƯA COMMIT</em> mới thật sự mất được. Nên trước khi thử bất kỳ cách sửa nào trên một cây còn thay đổi: <code>git stash -u</code>. Một giây, và cái lệnh phá huỷ trở thành đảo ngược được.</div>

<h3>1. Tôi commit nhầm nhánh</h3>
<pre><code><span class="tok-comment"># Chưa push. Chuyển commit cuối sang đúng nhánh:</span>
git switch -c feature/right-branch      <span class="tok-comment"># mang commit đi theo bạn</span>
git switch main
git reset --hard HEAD~1                 <span class="tok-comment"># gỡ nó khỏi main</span></code></pre>
<pre><code><span class="tok-comment"># Nhiều commit, hoặc bạn đã chuyển đi rồi — cherry-pick chúng sang:</span>
git switch feature/right-branch
git cherry-pick 3f8a1c9 9e2d4b7
git switch main &amp;&amp; git reset --hard HEAD~2</code></pre>

<h3>2. Tôi chạy reset --hard và mất commit</h3>
<pre><code>git reflog -10</code></pre>
<div class="out">e8b4d92 HEAD@{0}: reset: moving to HEAD~3
c7f1a30 HEAD@{1}: commit: test(auth): cover the expired-token path</div>
<pre><code>git reset --hard HEAD@{1}</code></pre>
<p>Dòng <em>ngay trước</em> cái lệnh phá huỷ là chỗ bạn đứng. Những thay đổi chưa commit ở thời điểm đó thì vẫn mất — đó là lỗ hổng duy nhất (bài 4.4).</p>

<h3>3. Tôi xoá mất một nhánh</h3>
<pre><code>git reflog | grep <span class="tok-string">"feature/login"</span>
git switch -c feature/login c7f1a30</code></pre>
<p><code>git branch -D</code> còn in luôn mã băm ngay khi xoá: "Deleted branch feature/login (was c7f1a30)". Hãy cuộn lên nhìn trước khi hoảng.</p>

<h3>4. Tôi commit một bí mật</h3>
<div class="callout danger"><strong>Xoay chứng chỉ trước đã.</strong> Thu hồi ở nhà cung cấp, cấp cái mới. Rồi mới dọn lịch sử — và nếu commit đó đã lên một kho công khai thì hãy coi như cái khoá đã bị lộ (bài 8.3).</div>
<pre><code><span class="tok-comment"># Chưa push, và nó là commit cuối:</span>
git rm --cached .env &amp;&amp; git commit --amend --no-edit

<span class="tok-comment"># Nằm đâu đó trong lịch sử, sau khi đã xoay khoá:</span>
git clone --mirror &lt;url&gt; &amp;&amp; cd repo.git
git filter-repo --invert-paths --path .env
git push --force --all &amp;&amp; git push --force --tags
<span class="tok-comment"># rồi: mọi người clone lại (bài 8.3)</span></code></pre>

<h3>5. Có người force-push đè lên commit của tôi</h3>
<pre><code>git reflog                              <span class="tok-comment"># nếu bạn vẫn còn chúng ở cục bộ</span>
git switch -c rescue e8b4d92
git rebase origin/feature/login rescue
git push origin rescue</code></pre>
<pre><code><span class="tok-comment"># Nếu bản clone không còn chúng, hãy hỏi GitHub lấy SHA trước lần push:</span>
gh api repos/OWNER/REPO/events \\
  --jq <span class="tok-string">'.[] | select(.type=="PushEvent") | {before: .payload.before, ref: .payload.ref}'</span>
git fetch origin &lt;sha-truoc&gt;</code></pre>

<h3>6. HEAD lìa cành, và tôi đã commit ở đó</h3>
<pre><code>git switch -c rescue        <span class="tok-comment"># làm việc này TRƯỚC khi chuyển đi</span></code></pre>
<pre><code><span class="tok-comment"># Lỡ chuyển đi rồi? Chúng không ai trỏ tới nhưng vẫn sống:</span>
git reflog
git switch -c rescue &lt;mã băm&gt;
<span class="tok-comment"># hoặc, nếu dòng reflog đã hết hạn:</span>
git fsck --lost-found</code></pre>

<h3>7. Một lần merge hay rebase đi sai, đang giữa chừng</h3>
<pre><code>git merge --abort           <span class="tok-comment"># đang merge: về trước lúc bắt đầu</span>
git rebase --abort          <span class="tok-comment"># đang rebase: về trước lúc bắt đầu</span>
git cherry-pick --abort
git revert --abort</code></pre>
<pre><code><span class="tok-comment"># Đã xong rồi, và kết quả sai:</span>
git reset --hard ORIG_HEAD  <span class="tok-comment"># Git đã lưu chỗ bạn đứng</span>
<span class="tok-comment"># hoặc tìm dòng trước "rebase (start)" trong reflog (bài 3.5)</span></code></pre>

<h3>8. Tôi push một commit tồi lên main</h3>
<pre><code>git revert 3f8a1c9          <span class="tok-comment"># KHÔNG dùng reset — main là nhánh chung (bài 4.3)</span>
git revert -m 1 8c4f2a1     <span class="tok-comment"># nếu đó là một commit hợp nhất</span>
git push</code></pre>
<p>Trong lúc sự cố, hãy revert trước rồi chẩn đoán sau. Một lần revert là một lệnh an toàn về mặt cơ học; một bản vá tiến tới viết dưới áp lực thì không có tính chất nào trong hai tính chất đó.</p>

<h3>9. "fatal: refusing to merge unrelated histories"</h3>
<pre><code>git log --oneline | tail -3
git log --oneline other/main | tail -3     <span class="tok-comment"># commit gốc có khác nhau không?</span></code></pre>
<p>Nếu bạn không hề chờ đợi có hai gốc thì nhiều khả năng bạn đã clone vào một thư mục có sẵn hoặc chạy <code>git init</code> hai lần. Hãy sửa cái sai lầm đó thay vì truyền <code>--allow-unrelated-histories</code>, thứ sẽ chôn vùi nó (bài 3.2).</p>

<h3>10. Kho mã trông như bị hỏng</h3>
<pre><code>git fsck --full                     <span class="tok-comment"># Git nghĩ cái gì đang sai?</span>
cat .git/HEAD                       <span class="tok-comment"># nó có gọi tên một ref tồn tại không?</span>
git rev-parse main                  <span class="tok-comment"># cái nhánh có phân giải được không?</span>
git cat-file -t \$(git rev-parse HEAD)</code></pre>
<div class="callout ok">Chương 9 biến việc này từ chuyện huyền bí thành một danh sách kiểm. <code>HEAD</code> gọi tên một ref; ref giữ một mã băm; mã băm phân giải ra một đối tượng commit. Mắt xích nào đứt sẽ nói cho bạn biết phải sửa gì — và phương án cuối cùng lúc nào cũng chạy: clone mới từ remote, rồi cứu phần việc chỉ có ở cục bộ từ <code>.git</code> cũ bằng <code>git fsck --lost-found</code>.</div>

<h3>Danh sách kiểm lúc hoảng</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Ngừng gõ</div><div class="lz-d">Mỗi lệnh thêm vào làm trạng thái khó đọc hơn. Không có gì đang cháy tới mức một phút làm nó tệ hơn.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Bảo vệ cây làm việc</div><div class="lz-d"><code>git stash -u</code>, hoặc chép cả thư mục ra. Việc chưa commit là thứ duy nhất thật sự đang gặp rủi ro.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Nhìn</div><div class="lz-d"><code>git status</code>, <code>git reflog -15</code>, <code>git log --oneline --graph --all -20</code>.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Gọi tên tình huống</div><div class="lz-d">Khớp nó với một trong mười ca ở trên TRƯỚC khi chạy bất cứ thứ gì.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Sửa, rồi kiểm chứng</div><div class="lz-d">Chạy lại <code>git log</code> và <code>git status</code>. Xác nhận các commit nằm đúng chỗ bạn nghĩ.</div></div>
</div>

<a class="link-card" href="https://git-scm.com/docs/git-fsck" target="_blank" rel="noopener">
  <span class="lc-ico">🩺</span>
  <span class="lc-body"><span class="lc-title">git-fsck — kiểm tra và tìm đối tượng lủng lẳng</span><span class="lc-sub">Công cụ cuối cùng khi reflog đã hết hạn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: phá một kho mã theo mười cách và cứu nó theo mười cách</span><span class="lc-sub">Bài tập chấm điểm phản chiếu từng tình huống trong bài này.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> sửa một trạng thái tồi bằng cách chồng thêm lệnh lên trên nó — một lần reset, rồi một lần merge, rồi một lần rebase, mỗi cái dựa trên một phỏng đoán. Mỗi lệnh lại thêm dòng vào reflog và làm trạng thái ban đầu khó nhận ra hơn. Hãy dừng lại, nhìn, gọi tên tình huống, rồi chạy MỘT lệnh. Nếu nó không làm đúng thứ bạn mong đợi thì quay lại bằng <code>reflog</code> trước khi thử thứ gì khác.</div>
<p class="note-ct"><strong>Thói quen duy nhất đáng mang đi từ cả khoá này:</strong> commit sớm và commit thường xuyên, trên một nhánh. Mọi cách cứu hộ ở trên đều chạy được vì công sức đã nằm trong một commit. Trường hợp duy nhất không cứu được — thay đổi chưa commit bị <code>reset --hard</code>, <code>restore</code> hay <code>clean</code> huỷ mất — chỉ tồn tại trong khoảng thời gian trước khi bạn commit, và khoảng đó hoàn toàn nằm trong tay bạn.</p>
</div>
`,
    },

    /* ─────────────────────────── 13.2 ─────────────────────────── */
    {
      title: '13.2 — Git in a real workflow, and the cheat sheet|||13.2 — Git trong quy trình thật, và bảng tra nhanh',
      slug: 'git-13-2-quy-trinh-that',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Quy trình Git đang chạy thật của cuongthai.com và lý do đằng sau từng quyết định, cách tự review diff của mình, làm việc cùng agent AI trên cùng một kho mã, và bảng tra nhanh gói lại toàn khoá.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Lesson 13.2</span>
<h2>What the rules look like when they came from outages</h2>
<p class="lead">Every chapter so far gave you a mechanism. This one shows a workflow that a real production site arrived at, and — more usefully — <em>why</em>, because each rule below exists because something broke.</p>

<h3>The flow</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Branch from main</div><div class="lz-d">GitHub flow (7.1). One branch per change, short-lived.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Run the checks locally</div><div class="lz-d">Type check, frontend build, and the seed if the schema moved.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Commit to local main</div><div class="lz-d">Small commits, Conventional Commits (1.4).</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Deploy with a script</div><div class="lz-d"><code>bash deploy-nha.sh</code>. NOT by pushing.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Wait for a human to test production</div><div class="lz-d">The fix is confirmed working before anything is shared.</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">Then push</div><div class="lz-d">At this point the push just syncs GitHub with what production already runs.</div></div>
</div>

<h3>The rule that surprises everyone: pushing does not deploy</h3>
<div class="callout danger">Two deploy workflows once triggered on <em>every</em> push to <code>main</code> and raced each other into real outages. On 3 July the feed returned 500 because the running image lagged behind a schema change. On 6 July two concurrent deploys collided while recreating the backend container, leaving it <code>Exited(137)</code> plus orphan containers — recovered by hand with <code>docker start</code>. Both workflows are now <code>workflow_dispatch</code> only.</div>
<p>The general lesson is bigger than one site: <strong>your branching model and your deployment trigger are two separate decisions.</strong> Coupling them tightly means an ordinary Git operation — a push, a merge, a revert — can start an irreversible action while you are still thinking. Verify what a push actually triggers rather than assuming:</p>
<pre><code>grep -A4 <span class="tok-string">'^on:'</span> .github/workflows/*.yml
gh run list --limit 8 --branch main       <span class="tok-comment"># what really fired on the last pushes</span></code></pre>

<h3>Reviewing your own diff — the highest-value five minutes</h3>
<pre><code><span class="tok-comment"># 1. What am I about to send?</span>
git log --oneline @{u}..HEAD

<span class="tok-comment"># 2. Which files, and are any of them a surprise?</span>
git diff @{u}..HEAD --stat

<span class="tok-comment"># 3. Read it as a stranger would.</span>
git diff @{u}..HEAD

<span class="tok-comment"># 4. Leftover markers, debug output, whitespace damage?</span>
git diff --check
git grep -n <span class="tok-string">"console.log\\|TODO\\|FIXME\\|&lt;&lt;&lt;&lt;&lt;&lt;&lt;"</span> \$(git diff --name-only @{u}..HEAD)</code></pre>
<div class="callout ok">Step 2 is the one that catches the expensive mistakes. An unexpected file in the list is almost always a secret, a build artefact, or a lockfile you did not mean to regenerate. Ten seconds of reading a file list has caught more problems than any linter in this course.</div>

<h3>Working alongside AI agents on the same repository</h3>
<p>An agent commits like a colleague, but it commits <em>fast</em> and it cannot see your terminal. Three rules, all learned the hard way:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Never git add -A when a session is running</span><span class="lz-v">It sweeps up whatever another session is midway through writing. Name the paths you mean — the advice from 1.3, with teeth.</span></div>
  <div class="lz-layer"><span class="lz-k">Never deploy without asking</span><span class="lz-v">A deploy script that rsyncs the working tree ships someone else's half-written file to production. <code>deploy.sh</code> has done exactly that, three times.</span></div>
  <div class="lz-layer"><span class="lz-k">One build or dev server at a time</span><span class="lz-v">Two processes writing the same build cache corrupt it in ways that look like a code bug for an hour.</span></div>
</div>
<pre><code><span class="tok-comment"># Give each agent its own worktree (10.1) — separate index, separate HEAD,</span>
<span class="tok-comment"># shared objects. Two sessions then cannot stage over each other at all.</span>
git worktree add ../api-agent-a -b agent/refactor-auth
git worktree add ../api-agent-b -b agent/add-tests</code></pre>
<div class="callout warn">Review an agent's diff the same way you review a colleague's — read it, do not skim it. An agent writes plausible code quickly, which means a wrong assumption arrives as forty confident lines rather than a question. The <code>git diff --stat</code> habit above matters more here, not less.</div>

<h3>Where each chapter shows up in a working week</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Every hour</span><span class="v"><code>status</code>, <code>diff</code>, <code>add -p</code>, <code>commit</code>, <code>switch</code> — Chapters 1 and 3.</span></div>
  <div class="kv"><span class="k">Every day</span><span class="v"><code>fetch</code>, <code>pull --rebase</code>, <code>push</code>, opening a pull request — Chapters 5 and 6.</span></div>
  <div class="kv"><span class="k">Every week</span><span class="v"><code>rebase -i</code> before review, <code>log -S</code> to find something, resolving a conflict — Chapters 2, 3 and 8.</span></div>
  <div class="kv"><span class="k">Every month</span><span class="v">A tag and a release, a revert, a <code>bisect</code> — Chapters 4 and 7.</span></div>
  <div class="kv"><span class="k">Twice a year, at speed</span><span class="v"><code>reflog</code>, <code>filter-repo</code>, <code>fsck</code> — Chapters 9 and 13. Worth having read <em>before</em> you need them.</span></div>
</div>

<h3>The cheat sheet</h3>
<pre><code><span class="tok-comment"># ── SEE ──────────────────────────────────────────</span>
git status --short                     <span class="tok-comment"># two columns: index | working dir</span>
git diff / --staged / HEAD             <span class="tok-comment"># the three trees (1.3)</span>
git log --oneline --graph --all -20    <span class="tok-comment"># the shape of history</span>
git log --oneline @{u}..HEAD           <span class="tok-comment"># what I have not pushed</span>
git show &lt;commit&gt;:&lt;path&gt;               <span class="tok-comment"># a file as it was, no checkout (2.2)</span>

<span class="tok-comment"># ── FIND ─────────────────────────────────────────</span>
git grep -n <span class="tok-string">"pattern"</span>                   <span class="tok-comment"># in the working tree</span>
git log -S<span class="tok-string">"string"</span> --oneline --all    <span class="tok-comment"># when it appeared or vanished (2.3)</span>
git blame -w -C -L 40,60 -- &lt;file&gt;     <span class="tok-comment"># who wrote this line, past reformatting</span>
git bisect start HEAD &lt;good&gt;           <span class="tok-comment"># which commit broke it (2.4)</span>

<span class="tok-comment"># ── UNDO ─────────────────────────────────────────</span>
git restore --staged &lt;file&gt;            <span class="tok-comment"># unstage (safe)</span>
git restore &lt;file&gt;                     <span class="tok-comment"># discard edits (DESTRUCTIVE)</span>
git reset --soft HEAD~1                <span class="tok-comment"># redo the last commit (safe)</span>
git revert &lt;commit&gt;                    <span class="tok-comment"># undo on a SHARED branch (4.3)</span>
git reflog                             <span class="tok-comment"># find anything that was ever committed</span>

<span class="tok-comment"># ── SHARE ────────────────────────────────────────</span>
git fetch                              <span class="tok-comment"># always safe; run it first</span>
git pull --rebase                      <span class="tok-comment"># integrate without a noise merge</span>
git push -u origin &lt;branch&gt;
git push --force-with-lease --force-if-includes   <span class="tok-comment"># the only safe force (8.2)</span>

<span class="tok-comment"># ── RESHAPE (local history only) ─────────────────</span>
git commit --amend --no-edit
git commit --fixup &lt;commit&gt;
git rebase -i --autosquash main
git cherry-pick -x &lt;commit&gt;</code></pre>

<h3>The settings worth having on every machine</h3>
<pre><code>git config --global init.defaultBranch main
git config --global pull.ff only                 <span class="tok-comment"># refuse a surprise merge (5.1)</span>
git config --global push.autoSetupRemote true    <span class="tok-comment"># no more "no upstream branch" (5.3)</span>
git config --global fetch.prune true              <span class="tok-comment"># drop dead origin/* refs</span>
git config --global merge.conflictStyle zdiff3    <span class="tok-comment"># show the base in conflicts (3.3)</span>
git config --global rerere.enabled true           <span class="tok-comment"># remember conflict resolutions</span>
git config --global rebase.autosquash true
git config --global alias.lg <span class="tok-string">"log --oneline --graph --all --decorate -20"</span>
git config --global alias.pushf <span class="tok-string">"push --force-with-lease --force-if-includes"</span></code></pre>
<div class="callout ok">If you adopt only one, make it <code>merge.conflictStyle zdiff3</code>. Seeing what a line looked like <em>before</em> either side touched it turns conflict resolution from guesswork into a decision — and it costs nothing until the day you need it.</div>

<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Keep going: the Git track on Code Lab</span><span class="lc-sub">Graded exercises across every chapter, with solutions.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/book/en/v2" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git — the reference to keep open from now on</span><span class="lc-sub">You now have the model; the book is the lookup table.</span></span>
</a>

<div class="pitfall"><strong>The last trap, and the biggest:</strong> treating a workflow as a rule to obey rather than a set of trade-offs someone made. Every rule in this lesson answers a specific failure — a race between deploys, a swept-up file, a corrupted build cache. When you join a project, ask what each unusual rule is protecting against. If nobody remembers, that rule is due for review; if the answer is a specific outage, it is load-bearing.</div>
<p class="note-ct"><strong>Where to go from here:</strong> you now have the model — snapshots and pointers — and roughly forty commands. That is enough for years of daily work. When you meet a situation this course did not cover, ask the three questions from 0.4 (which tree, pointer or object, is it pushed?), then look the command up. Understanding the model is what makes the documentation readable; memorising commands never was.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2</span>
<h2>Luật lệ trông ra sao khi chúng sinh ra từ những lần sự cố</h2>
<p class="lead">Mọi chương tới giờ cho bạn một cơ chế. Bài này cho xem một quy trình mà một trang production thật đã đi tới, và — hữu ích hơn — <em>VÌ SAO</em>, bởi mỗi luật dưới đây tồn tại vì đã có thứ gì đó hỏng.</p>

<h3>Quy trình</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Rẽ nhánh từ main</div><div class="lz-d">GitHub flow (bài 7.1). Mỗi thay đổi một nhánh, sống ngắn ngày.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Chạy các phép kiểm ở máy</div><div class="lz-d">Kiểm kiểu, dựng frontend, và chạy seed nếu schema có đổi.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Commit vào main cục bộ</div><div class="lz-d">Commit nhỏ, theo Conventional Commits (bài 1.4).</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Deploy bằng một script</div><div class="lz-d"><code>bash deploy-nha.sh</code>. KHÔNG deploy bằng cách push.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Chờ người kiểm trên production</div><div class="lz-d">Bản vá được xác nhận là chạy được trước khi chia sẻ bất cứ thứ gì.</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">Rồi mới push</div><div class="lz-d">Tới lúc này thì lần push chỉ là đồng bộ GitHub với thứ production vốn đã chạy.</div></div>
</div>

<h3>Cái luật làm ai cũng bất ngờ: push KHÔNG deploy</h3>
<div class="callout danger">Hai workflow deploy từng kích hoạt ở <em>MỌI</em> lần push vào <code>main</code> và đua nhau tới những sự cố thật. Ngày 3 tháng 7, feed trả 500 vì ảnh đang chạy đi sau một thay đổi schema. Ngày 6 tháng 7, hai lượt deploy chạy chồng va nhau lúc dựng lại container backend, để nó ở trạng thái <code>Exited(137)</code> cùng các container mồ côi — phải cứu bằng tay với <code>docker start</code>. Giờ cả hai workflow chỉ còn <code>workflow_dispatch</code>.</div>
<p>Bài học khái quát lớn hơn một trang web: <strong>mô hình nhánh của bạn và cơ chế kích hoạt deploy là hai quyết định tách biệt.</strong> Ghép chặt chúng nghĩa là một thao tác Git bình thường — một lần push, một lần merge, một lần revert — có thể khởi động một hành động không đảo ngược được trong khi bạn còn đang suy nghĩ. Hãy kiểm chứng xem một lần push THẬT SỰ kích hoạt cái gì thay vì phỏng đoán:</p>
<pre><code>grep -A4 <span class="tok-string">'^on:'</span> .github/workflows/*.yml
gh run list --limit 8 --branch main       <span class="tok-comment"># cái gì thật sự chạy ở những lần push gần đây</span></code></pre>

<h3>Tự review diff của mình — năm phút giá trị nhất</h3>
<pre><code><span class="tok-comment"># 1. Tôi sắp gửi đi cái gì?</span>
git log --oneline @{u}..HEAD

<span class="tok-comment"># 2. Những file nào, và có cái nào lạ không?</span>
git diff @{u}..HEAD --stat

<span class="tok-comment"># 3. Đọc nó như một người lạ đọc.</span>
git diff @{u}..HEAD

<span class="tok-comment"># 4. Còn sót ký hiệu xung đột, output debug, hỏng khoảng trắng không?</span>
git diff --check
git grep -n <span class="tok-string">"console.log\\|TODO\\|FIXME\\|&lt;&lt;&lt;&lt;&lt;&lt;&lt;"</span> \$(git diff --name-only @{u}..HEAD)</code></pre>
<div class="callout ok">Bước 2 là bước bắt được những sai lầm đắt tiền. Một file lạ trong danh sách gần như luôn là một bí mật, một sản phẩm build, hoặc một lockfile bạn không định sinh lại. Mười giây đọc một danh sách file đã bắt được nhiều vấn đề hơn mọi linter trong khoá này.</div>

<h3>Làm việc song song với agent AI trên cùng một kho mã</h3>
<p>Một agent commit như một đồng nghiệp, nhưng nó commit <em>NHANH</em> và nó không nhìn thấy terminal của bạn. Ba luật, đều học được bằng cách trả giá:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Đừng bao giờ git add -A khi có phiên khác đang chạy</span><span class="lz-v">Nó vơ luôn thứ mà một phiên khác đang viết dở. Hãy gọi tên đúng đường dẫn bạn muốn — lời khuyên ở bài 1.3, lần này có răng.</span></div>
  <div class="lz-layer"><span class="lz-k">Đừng bao giờ deploy khi chưa hỏi</span><span class="lz-v">Một script deploy rsync cả cây làm việc sẽ đẩy file viết dở của người khác lên production. <code>deploy.sh</code> đã làm đúng chuyện đó, ba lần.</span></div>
  <div class="lz-layer"><span class="lz-k">Mỗi lúc chỉ MỘT bản dựng hoặc dev server</span><span class="lz-v">Hai tiến trình cùng ghi vào một cache build làm hỏng nó theo kiểu trông y như một lỗi mã trong suốt một giờ đồng hồ.</span></div>
</div>
<pre><code><span class="tok-comment"># Cho mỗi agent một worktree riêng (bài 10.1) — index riêng, HEAD riêng,</span>
<span class="tok-comment"># đối tượng dùng chung. Hai phiên khi đó hoàn toàn không staging đè lên nhau được.</span>
git worktree add ../api-agent-a -b agent/refactor-auth
git worktree add ../api-agent-b -b agent/add-tests</code></pre>
<div class="callout warn">Hãy review diff của một agent đúng như bạn review của một đồng nghiệp — đọc nó, đừng lướt. Một agent viết ra mã nghe hợp lý rất nhanh, nghĩa là một giả định sai tới tay bạn dưới dạng bốn mươi dòng đầy tự tin thay vì dưới dạng một câu hỏi. Thói quen <code>git diff --stat</code> ở trên quan trọng hơn ở đây, chứ không phải ít hơn.</div>

<h3>Mỗi chương xuất hiện ở đâu trong một tuần làm việc</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mỗi giờ</span><span class="v"><code>status</code>, <code>diff</code>, <code>add -p</code>, <code>commit</code>, <code>switch</code> — Chương 1 và 3.</span></div>
  <div class="kv"><span class="k">Mỗi ngày</span><span class="v"><code>fetch</code>, <code>pull --rebase</code>, <code>push</code>, mở một pull request — Chương 5 và 6.</span></div>
  <div class="kv"><span class="k">Mỗi tuần</span><span class="v"><code>rebase -i</code> trước khi review, <code>log -S</code> để tìm thứ gì đó, giải một xung đột — Chương 2, 3 và 8.</span></div>
  <div class="kv"><span class="k">Mỗi tháng</span><span class="v">Một cái tag và một bản phát hành, một lần revert, một lần <code>bisect</code> — Chương 4 và 7.</span></div>
  <div class="kv"><span class="k">Hai lần một năm, lúc nước sôi lửa bỏng</span><span class="v"><code>reflog</code>, <code>filter-repo</code>, <code>fsck</code> — Chương 9 và 13. Đáng đọc <em>TRƯỚC</em> khi cần tới.</span></div>
</div>

<h3>Bảng tra nhanh</h3>
<pre><code><span class="tok-comment"># ── NHÌN ─────────────────────────────────────────</span>
git status --short                     <span class="tok-comment"># hai cột: index | thư mục làm việc</span>
git diff / --staged / HEAD             <span class="tok-comment"># ba cái cây (bài 1.3)</span>
git log --oneline --graph --all -20    <span class="tok-comment"># hình dạng lịch sử</span>
git log --oneline @{u}..HEAD           <span class="tok-comment"># tôi chưa push cái gì</span>
git show &lt;commit&gt;:&lt;đường dẫn&gt;          <span class="tok-comment"># một file như nó từng có, không checkout (bài 2.2)</span>

<span class="tok-comment"># ── TÌM ──────────────────────────────────────────</span>
git grep -n <span class="tok-string">"mẫu"</span>                       <span class="tok-comment"># trong cây làm việc</span>
git log -S<span class="tok-string">"chuỗi"</span> --oneline --all      <span class="tok-comment"># nó xuất hiện hay biến mất khi nào (bài 2.3)</span>
git blame -w -C -L 40,60 -- &lt;file&gt;     <span class="tok-comment"># ai viết dòng này, xuyên qua lần định dạng lại</span>
git bisect start HEAD &lt;good&gt;           <span class="tok-comment"># commit nào làm hỏng (bài 2.4)</span>

<span class="tok-comment"># ── HOÀN TÁC ─────────────────────────────────────</span>
git restore --staged &lt;file&gt;            <span class="tok-comment"># gỡ khỏi staging (an toàn)</span>
git restore &lt;file&gt;                     <span class="tok-comment"># vứt sửa đổi (PHÁ HUỶ)</span>
git reset --soft HEAD~1                <span class="tok-comment"># làm lại commit cuối (an toàn)</span>
git revert &lt;commit&gt;                    <span class="tok-comment"># hoàn tác trên nhánh CHUNG (bài 4.3)</span>
git reflog                             <span class="tok-comment"># tìm mọi thứ từng được commit</span>

<span class="tok-comment"># ── CHIA SẺ ──────────────────────────────────────</span>
git fetch                              <span class="tok-comment"># lúc nào cũng an toàn; chạy nó trước</span>
git pull --rebase                      <span class="tok-comment"># tích hợp mà không sinh merge nhiễu</span>
git push -u origin &lt;nhánh&gt;
git push --force-with-lease --force-if-includes   <span class="tok-comment"># lần ép an toàn duy nhất (bài 8.2)</span>

<span class="tok-comment"># ── NẮN LẠI (chỉ lịch sử cục bộ) ─────────────────</span>
git commit --amend --no-edit
git commit --fixup &lt;commit&gt;
git rebase -i --autosquash main
git cherry-pick -x &lt;commit&gt;</code></pre>

<h3>Những thiết lập đáng có trên mọi máy</h3>
<pre><code>git config --global init.defaultBranch main
git config --global pull.ff only                 <span class="tok-comment"># từ chối một lần merge bất ngờ (bài 5.1)</span>
git config --global push.autoSetupRemote true    <span class="tok-comment"># hết cảnh "no upstream branch" (bài 5.3)</span>
git config --global fetch.prune true              <span class="tok-comment"># bỏ các ref origin/* đã chết</span>
git config --global merge.conflictStyle zdiff3    <span class="tok-comment"># hiện bản gốc trong xung đột (bài 3.3)</span>
git config --global rerere.enabled true           <span class="tok-comment"># nhớ cách giải xung đột</span>
git config --global rebase.autosquash true
git config --global alias.lg <span class="tok-string">"log --oneline --graph --all --decorate -20"</span>
git config --global alias.pushf <span class="tok-string">"push --force-with-lease --force-if-includes"</span></code></pre>
<div class="callout ok">Nếu chỉ nhận một cái, hãy nhận <code>merge.conflictStyle zdiff3</code>. Nhìn thấy một dòng trông thế nào <em>TRƯỚC</em> khi cả hai bên đụng vào biến việc giải xung đột từ đoán mò thành một quyết định — và nó không tốn gì cho tới đúng cái ngày bạn cần nó.</div>

<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Đi tiếp: track Git trên Code Lab</span><span class="lc-sub">Bài tập chấm điểm trải khắp mọi chương, kèm lời giải.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/book/vi/v2" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git — cuốn tra cứu nên mở từ giờ trở đi</span><span class="lc-sub">Bạn đã có mô hình; cuốn sách là bảng tra.</span></span>
</a>

<div class="pitfall"><strong>Cái bẫy cuối cùng, và cũng là lớn nhất:</strong> coi một quy trình như một luật phải tuân theo thay vì như một tập đánh đổi mà ai đó đã cân nhắc. Mọi luật trong bài này đều trả lời một lần hỏng cụ thể — một cuộc đua giữa hai lần deploy, một file bị vơ nhầm, một cache build hỏng. Khi bạn vào một dự án, hãy hỏi mỗi luật khác thường đang bảo vệ chống lại điều gì. Nếu không ai còn nhớ thì cái luật đó đến hạn xem lại; nếu câu trả lời là một sự cố cụ thể thì nó đang chịu lực.</div>
<p class="note-ct"><strong>Từ đây đi đâu:</strong> bạn giờ đã có mô hình — ảnh chụp và con trỏ — cùng khoảng bốn mươi lệnh. Chừng đó là đủ cho nhiều năm làm việc hằng ngày. Khi gặp một tình huống khoá này chưa nói tới, hãy hỏi ba câu ở bài 0.4 (đụng vào cây nào, dời con trỏ hay tạo đối tượng, đã push chưa?), rồi tra lệnh. Hiểu mô hình chính là thứ làm cho tài liệu đọc được; học thuộc lệnh thì chưa bao giờ.</p>
</div>
`,
    },

    /* ─────────────────────────── 13.3 Bài kiểm tra cuối khoá ─────────────────────────── */
    {
      title: '13.3 — Final exam: the whole course|||13.3 — Kiểm tra cuối khoá: toàn bộ chương trình',
      slug: 'git-13-3-kiem-tra-cuoi-khoa',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười hai câu rút từ cả mười bốn mục — mô hình ba cây, commit là ảnh chụp, đọc lịch sử, nhánh và hợp nhất, hoàn tác, remote, pull request, tag, viết lại lịch sử, ruột gan, hook và cứu hộ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Final exam · All 14 sections</span>
<h2>Twelve questions, one per idea that matters</h2>
<p class="lead">Not a summary — a test of whether the <em>model</em> stuck. Every question below can be answered from the three-trees / snapshots / pointers picture, without memorising a single flag.</p>
<div class="callout ok">Aim for 10/12. If you drop one, note which chapter it came from and reread that lesson's opening section — the answer is nearly always in the first three paragraphs, because that is where each chapter states its model.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Q1–3</span><span class="lz-v">The model: three trees, commits as snapshots, hashes and parents (Ch 1).</span></div>
  <div class="lz-layer"><span class="lz-k">Q4–6</span><span class="lz-v">Moving through history: reading it, branching, merging, undoing (Ch 2–4).</span></div>
  <div class="lz-layer"><span class="lz-k">Q7–9</span><span class="lz-v">Working with people: remotes, pull requests, releases (Ch 5–7).</span></div>
  <div class="lz-layer"><span class="lz-k">Q10–12</span><span class="lz-v">Depth and danger: rewriting, internals, recovery (Ch 8–13).</span></div>
</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Kiểm tra cuối khoá · Cả 14 mục</span>
<h2>Mười hai câu, mỗi câu một ý quan trọng</h2>
<p class="lead">Không phải bản tóm tắt — đây là phép thử xem <em>MÔ HÌNH</em> có đọng lại không. Mọi câu dưới đây đều trả lời được từ bức tranh ba cây / ảnh chụp / con trỏ, mà không cần thuộc lòng một cái cờ nào.</p>
<div class="callout ok">Hãy nhắm 10/12. Rớt câu nào thì ghi lại nó thuộc chương nào rồi đọc lại phần mở đầu của bài đó — câu trả lời gần như luôn nằm trong ba đoạn đầu, vì đó là chỗ mỗi chương phát biểu mô hình của nó.</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Câu 1–3</span><span class="lz-v">Mô hình: ba cây, commit là ảnh chụp, mã băm và commit cha (Ch 1).</span></div>
  <div class="lz-layer"><span class="lz-k">Câu 4–6</span><span class="lz-v">Di chuyển trong lịch sử: đọc nó, tạo nhánh, hợp nhất, hoàn tác (Ch 2–4).</span></div>
  <div class="lz-layer"><span class="lz-k">Câu 7–9</span><span class="lz-v">Làm việc với người khác: remote, pull request, phát hành (Ch 5–7).</span></div>
  <div class="lz-layer"><span class="lz-k">Câu 10–12</span><span class="lz-v">Chiều sâu và nguy hiểm: viết lại, ruột gan, cứu hộ (Ch 8–13).</span></div>
</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 1080,
        questions: [
          {
            question: 'git status shows one file under BOTH "Changes to be committed" and "Changes not staged". You run git commit. What is recorded?|||git status hiện một file ở CẢ "Changes to be committed" lẫn "Changes not staged". Bạn chạy git commit. Cái gì được ghi lại?',
            options: [
              'Both sets of changes|||Cả hai bộ thay đổi',
              'Only the staged version — the later edits stay in the working directory, uncommitted|||Chỉ phiên bản đã staging — những sửa đổi sau vẫn nằm ở thư mục làm việc, chưa được commit',
              'Neither; Git refuses|||Không cái nào; Git từ chối',
              'Only the newest edits|||Chỉ những sửa đổi mới nhất',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You edit the message of a commit from three months ago. What happens to the 200 commits after it?|||Bạn sửa lời nhắn của một commit từ ba tháng trước. Chuyện gì xảy ra với 200 commit phía sau nó?',
            options: [
              'Nothing — only that commit changes|||Không gì cả — chỉ commit đó đổi',
              'They all get new hashes, because each commit\'s hash covers its parent\'s hash|||Tất cả nhận mã băm mới, vì mã băm của mỗi commit bao gồm cả mã băm của cha nó',
              'They are deleted|||Chúng bị xoá',
              'Only merge commits change|||Chỉ các commit hợp nhất đổi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Git stores a full snapshot per commit. Why is a ten-year repository still small?|||Git lưu một ảnh chụp đầy đủ cho mỗi commit. Vì sao một kho mười năm tuổi vẫn nhỏ?',
            options: [
              'Old commits are pruned automatically|||Commit cũ bị dọn tự động',
              'Content is addressed by hash (unchanged files are stored once) and packfiles delta-compress similar objects|||Nội dung được định danh bằng mã băm (file không đổi chỉ lưu một lần) và packfile nén delta các đối tượng giống nhau',
              'Git actually stores diffs, not snapshots|||Git thật ra lưu bản khác biệt chứ không lưu ảnh chụp',
              'Only the current branch is kept|||Chỉ nhánh hiện tại được giữ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A function was deleted eight months ago and you need the commit that removed it. Which command?|||Một hàm bị xoá tám tháng trước và bạn cần tìm commit đã gỡ nó. Lệnh nào?',
            options: [
              'git blame -- the-file.ts',
              'git log -S"functionName" --oneline --all',
              'git grep "functionName"',
              'git bisect start',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'During a REBASE conflict, the block under "<<<<<<< HEAD" contains…|||Trong một xung đột khi REBASE, khối nằm dưới "<<<<<<< HEAD" chứa…',
            options: [
              'Your commit, as in a merge|||Commit của bạn, giống như khi merge',
              'The branch you are rebasing ONTO — the labels are inverted relative to a merge|||Nhánh bạn đang rebase LÊN — nhãn bị đảo so với khi merge',
              'The merge base|||Điểm gốc hợp nhất',
              'Whichever side is larger|||Bên nào lớn hơn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which of these can Git NOT recover?|||Git KHÔNG cứu được thứ nào sau đây?',
            options: [
              'A branch deleted with -D|||Một nhánh bị xoá bằng -D',
              'Commits dropped by a bad rebase|||Commit bị một lần rebase hỏng loại bỏ',
              'Uncommitted edits destroyed by reset --hard — Git never saw them|||Những sửa đổi chưa commit bị reset --hard huỷ — Git chưa từng nhìn thấy chúng',
              'Commits made on a detached HEAD|||Commit tạo khi HEAD lìa cành',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You have been away a week. Which command is safe to run first, and changes nothing?|||Bạn vắng mặt một tuần. Lệnh nào an toàn để chạy đầu tiên, và không đổi gì cả?',
            options: [
              'git pull',
              'git fetch — it moves remote-tracking refs only; your branches, index and working directory are untouched|||git fetch — nó chỉ dời các ref theo dõi remote; nhánh, index và thư mục làm việc của bạn không bị đụng tới',
              'git reset --hard origin/main',
              'git merge origin/main',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Under "Squash and merge", what becomes the permanent commit message on main?|||Với "Squash and merge", cái gì trở thành lời nhắn commit vĩnh viễn trên main?',
            options: [
              'The first commit of the branch|||Commit đầu tiên của nhánh',
              'The pull request TITLE|||TIÊU ĐỀ của pull request',
              'All branch messages concatenated|||Mọi lời nhắn của nhánh nối lại',
              'An auto-generated merge message|||Một lời nhắn hợp nhất tự sinh',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You tagged v1.5.0 and ran "git push origin main". The release workflow did not fire. Why?|||Bạn gắn tag v1.5.0 rồi chạy "git push origin main". Workflow phát hành không chạy. Vì sao?',
            options: [
              'The tag was lightweight|||Tag đó là loại nhẹ',
              'Tags are separate refs and are not pushed automatically — you need git push origin v1.5.0 or --follow-tags|||Tag là ref riêng và không tự động được push — bạn cần git push origin v1.5.0 hoặc --follow-tags',
              'GitHub delays tag events by an hour|||GitHub trì hoãn sự kiện tag một giờ',
              'The workflow needs workflow_dispatch|||Workflow đó cần workflow_dispatch',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'An API key was pushed to a public repository yesterday. What is step one?|||Một khoá API bị push lên kho công khai từ hôm qua. Bước một là gì?',
            options: [
              'git filter-repo to clean history|||git filter-repo để dọn lịch sử',
              'Delete the line and commit|||Xoá dòng đó và commit',
              'Rotate the credential — bots find public keys within minutes, so history cleaning on a live key is theatre|||XOAY chứng chỉ — bot tìm ra khoá công khai trong vài phút, nên dọn lịch sử trên một cái khoá còn sống chỉ là diễn kịch',
              'Make the repository private|||Đổi kho thành riêng tư',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Why is a pre-commit hook not a security control?|||Vì sao một hook pre-commit không phải là biện pháp kiểm soát bảo mật?',
            options: [
              'It runs after the commit is created|||Nó chạy sau khi commit được tạo',
              'Anyone can pass --no-verify, and a fresh clone has no hooks at all — enforcement belongs in CI plus branch protection|||Ai cũng truyền được --no-verify, và một bản clone mới hoàn toàn không có hook — việc cưỡng chế thuộc về CI cộng bảo vệ nhánh',
              'Hooks cannot read the staged diff|||Hook không đọc được diff đã staging',
              'GitHub disables local hooks|||GitHub vô hiệu hoá hook cục bộ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A bad commit is on main and the whole team has pulled it. What is the correct undo?|||Một commit tồi đang nằm trên main và cả nhóm đã pull về. Cách hoàn tác đúng là gì?',
            options: [
              'git reset --hard HEAD~1 then force-push|||git reset --hard HEAD~1 rồi force-push',
              'git revert <hash> — it adds a new inverse commit, so every existing clone stays valid|||git revert <mã băm> — nó thêm một commit nghịch đảo mới, nên mọi bản clone hiện có vẫn hợp lệ',
              'git rebase -i and drop the commit|||git rebase -i rồi drop commit đó',
              'Delete main and recreate it|||Xoá main rồi tạo lại',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
