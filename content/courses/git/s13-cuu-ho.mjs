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
  ],
};
