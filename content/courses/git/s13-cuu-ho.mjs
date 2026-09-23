/**
 * Git & GitHub — Chương 13: Sách công thức cứu hộ + Git trong quy trình thật.
 * Mười tình huống sự cố kèm cách xử · quy trình thật của cuongthai.com, làm việc cùng
 * agent AI, và bảng tra nhanh · kiểm tra Chương 13 (10 câu).
 * Nâng cấp 09/2026: 13.0 slide (deck git-13) · slide + 🧪/🗂/📌 trong 13.1, 13.2 · quiz viết lại.
 * Bài thi cuối khoá thật chuyển sang Chương 16. Output trong bài chạy thật git 2.51 bằng
 * "phòng thí nghiệm thảm hoạ" tham-hoa.sh (ngày giờ cố định ⇒ mã băm tái lập được).
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out đóng bằng </div> (KHÔNG </code></pre>). KHÔNG dùng <svg>.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 13 — Disaster recovery & Git in a real workflow|||Chương 13 — Cứu hộ & Git trong quy trình thật',
  description: 'Chương cứu hộ, viết để mở ra giữa lúc sự cố: sơ đồ chọn lệnh cứu, mười tình huống thật kèm lệnh xử lý và một phòng thí nghiệm thảm hoạ để tự cứu, quy trình Git đang chạy thật của cuongthai.com, cách làm việc cùng agent AI trên cùng một kho mã, và một bảng tra nhanh gói lại toàn khoá.',
  lessons: [
    /* ─────────────────────────── 13.0 ─────────────────────────── */
    {
      title: '13.0 — Chapter 13 slides: recovery in pictures|||13.0 — Slide Chương 13: cứu hộ bằng hình',
      slug: 'git-13-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 18 slide của Chương 13: sơ đồ "tôi đang gặp sự cố gì → lệnh cứu", sáu công thức cứu hộ vẽ trước/sau, một ngày làm việc thật, push không phải deploy, tự review diff, worktree cho agent AI và bảng tra nhanh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Slides</span>
<h2>The whole chapter in 18 slides</h2>
<p class="lead">Recovery is easiest to learn as pictures: where the branch pointer was, where it is now, and which commits are left behind as dashed "ghosts" that the reflog or <code>git fsck</code> can still bring back. Slide 4 is the one to remember — a decision map from "what went wrong?" to the one command that fixes it.</p>
<p>Every terminal on these slides is real output (git 2.51) from the "disaster lab" script in lesson 13.1. Its dates are fixed, so when you run it yourself you get exactly the same hashes as the slides: the <code>96c9e91</code> that <code>git branch -D</code> prints on slide 7 is the one you will restore, and the <code>07d8f6f</code> that <code>git fsck</code> finds on slide 10 is your dropped stash. The slides are in Vietnamese; the diagrams read the same in any language. The last two slides are the cheat sheet and the lab itself.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Slide</span>
<h2>Cả chương trong 18 slide</h2>
<p class="lead">Cứu hộ dễ học nhất khi nhìn bằng hình: con trỏ nhánh từng ở đâu, giờ ở đâu, và commit nào bị bỏ lại thành "bóng ma" nét đứt mà reflog (nhật ký tham chiếu) hay <code>git fsck</code> vẫn mang về được. Slide 4 là slide đáng nhớ nhất — một sơ đồ quyết định đi từ "hỏng cái gì?" tới đúng MỘT lệnh cứu.</p>
<p>Mọi terminal trên slide là output thật (git 2.51) của script "phòng thí nghiệm thảm hoạ" trong bài 13.1. Script đặt ngày giờ cố định, nên khi bạn tự chạy sẽ ra đúng những mã băm trên slide: mã <code>96c9e91</code> mà <code>git branch -D</code> in ra ở slide 7 chính là nhánh bạn sẽ khôi phục, còn <code>07d8f6f</code> mà <code>git fsck</code> tìm thấy ở slide 10 là cái stash bạn lỡ drop. Hai slide cuối là bảng tra nhanh và chính bài thực hành đó.</p>
</div>
${gallery('git-13', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Luật sống sót: Git chỉ cứu thứ nó đã thấy'], [4, 'Sơ đồ chọn lệnh cứu theo sự cố'],
  [5, 'Công thức 1: commit nhầm lên main'], [6, 'Công thức 2: lỡ reset --hard'], [7, 'Công thức 3: xoá nhầm nhánh'],
  [8, 'Công thức 4: merge nhầm'], [9, 'Công thức 5: HEAD lìa cành có commit'], [10, 'Công thức 6: lỡ drop stash — git fsck'],
  [11, 'Khi sự cố đã lên GitHub'], [12, 'Danh sách kiểm lúc hoảng'], [13, 'Một ngày làm việc thật'],
  [14, 'cuongthai.com: push không deploy'], [15, 'Tự review diff'], [16, 'Agent AI: mỗi phiên một worktree'],
  [17, 'Bảng tra nhanh Chương 13'], [18, 'Thực hành: phòng thí nghiệm thảm hoạ'],
])}
`,
    },

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

<h3>Which recipe? Start from the map</h3>
${slide('git-13', 3, 'Luật sống sót: Git chỉ cứu thứ nó đã thấy')}
${slide('git-13', 4, 'Sơ đồ chọn lệnh cứu theo sự cố')}
<p>Two questions place every emergency on this map: <em>was the lost work ever committed?</em> and <em>has it been pushed?</em> Uncommitted work is the only truly dangerous zone. Commits that live only on your machine can always be brought back with the reflog. Pushed commits are fixed by <em>adding</em> commits (revert), never by rewriting what your teammates already have.</p>

<h3>1. I committed to the wrong branch</h3>
${slide('git-13', 5, 'Công thức 1: commit nhầm lên main')}
<pre><code><span class="tok-comment"># Not pushed. Move the last commit to the right branch:</span>
git switch -c feature/right-branch      <span class="tok-comment"># brings the commit with you</span>
git switch main
git reset --hard HEAD~1                 <span class="tok-comment"># remove it from main</span></code></pre>
<pre><code><span class="tok-comment"># Several commits, or you already switched away — cherry-pick them across:</span>
git switch feature/right-branch
git cherry-pick 3f8a1c9 9e2d4b7
git switch main &amp;&amp; git reset --hard HEAD~2</code></pre>
<p>One command shorter, without leaving main: <code>git branch feature/cart</code> then <code>git reset --hard HEAD~1</code> (exactly the slide above, real output). The order is everything: <strong>create the branch label FIRST</strong>, then move main back. Reverse the order and the commit is orphaned — still recoverable through the reflog, but you have just made a second emergency.</p>

<h3>2. I ran reset --hard and lost commits</h3>
${slide('git-13', 6, 'Công thức 2: lỡ reset --hard mất hai commit')}
<pre><code>git reflog -10</code></pre>
<div class="out">e8b4d92 HEAD@{0}: reset: moving to HEAD~3
c7f1a30 HEAD@{1}: commit: test(auth): cover the expired-token path</div>
<pre><code>git reset --hard HEAD@{1}</code></pre>
<p>The entry <em>just before</em> the destructive one is where you were. Uncommitted changes at that moment are still gone — that is the one gap (4.4).</p>

<h3>3. I deleted a branch</h3>
${slide('git-13', 7, 'Công thức 3: xoá nhầm nhánh chưa push')}
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
${slide('git-13', 11, 'Khi sự cố đã lên GitHub — luật đổi hẳn')}
<pre><code>git reflog                              <span class="tok-comment"># if you still have them locally</span>
git switch -c rescue e8b4d92
git rebase origin/feature/login rescue
git push origin rescue</code></pre>
<pre><code><span class="tok-comment"># If your clone no longer has them, ask GitHub for the pre-push SHA:</span>
gh api repos/OWNER/REPO/events \\
  --jq <span class="tok-string">'.[] | select(.type=="PushEvent") | {before: .payload.before, ref: .payload.ref}'</span>
git fetch origin &lt;before-sha&gt;</code></pre>

<h3>6. Detached HEAD, and I made commits there</h3>
${slide('git-13', 9, 'Công thức 5: HEAD lìa cành, và tôi đã commit ở đó')}
<pre><code>git switch -c rescue        <span class="tok-comment"># do this BEFORE switching away</span></code></pre>
<pre><code><span class="tok-comment"># Already switched away? They are unreferenced but alive:</span>
git reflog
git switch -c rescue &lt;hash&gt;
<span class="tok-comment"># or, if the reflog entry expired:</span>
git fsck --lost-found</code></pre>

<h3>7. A merge or rebase went wrong, mid-flight</h3>
${slide('git-13', 8, 'Công thức 4: merge nhầm nhánh làm dở vào main')}
<pre><code>git merge --abort           <span class="tok-comment"># mid-merge: back to before</span>
git rebase --abort          <span class="tok-comment"># mid-rebase: back to before</span>
git cherry-pick --abort
git revert --abort</code></pre>
<pre><code><span class="tok-comment"># Already finished, and the result is wrong:</span>
git reset --hard ORIG_HEAD  <span class="tok-comment"># Git saved where you were</span>
<span class="tok-comment"># or find the entry before "rebase (start)" in the reflog (3.5)</span></code></pre>
<p><code>--abort</code> only works <em>while</em> the operation is still in progress. Once the merge commit exists, it answers <code>fatal: There is no merge to abort (MERGE_HEAD missing).</code> (real output) — that message is your cue to switch to <code>ORIG_HEAD</code>. And if the merge was already pushed, neither applies: <code>git revert -m 1 &lt;merge&gt;</code> (recipe 8).</p>

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

<h3>Bonus: I dropped a stash I still needed</h3>
${slide('git-13', 10, 'Công thức 6: lỡ drop stash — git fsck tìm lại')}
<p>A stash is a commit that only <code>refs/stash</code> points to. <code>git stash drop</code> — or a <code>pop</code> you did not mean — removes that pointer <em>and</em> its reflog entry, so <code>git reflog</code> will not show it. The commit itself stays in the object database, dangling, until garbage collection prunes it (by default, unreachable objects older than two weeks). First, scroll up: drop prints the full hash.</p>
<pre><code>git stash drop</code></pre>
<div class="out">Dropped refs/stash@{0} (07d8f6f75ecade3d5036b06cfaa658b93576f776)</div>
<pre><code><span class="tok-comment"># Terminal already closed? Ask fsck for commits nothing points to:</span>
git fsck --lost-found
git show -s --format=<span class="tok-string">"%h %s"</span> 07d8f6f      <span class="tok-comment"># "On main: …" means it is a stash</span>
git stash apply 07d8f6f</code></pre>
<div class="out">dangling commit 07d8f6f75ecade3d5036b06cfaa658b93576f776
07d8f6f On main: ghi chú quan trọng</div>
<p>In a real repository fsck may list a dozen dangling commits. Print them all with their messages and pick the one that starts with <code>On &lt;branch&gt;:</code> or <code>WIP on</code>:</p>
<pre><code>git fsck --no-reflogs | awk <span class="tok-string">'/dangling commit/ {print $3}'</span> | xargs git show -s --format=<span class="tok-string">"%h %s"</span></code></pre>

<h3>The panic checklist</h3>
${slide('git-13', 12, 'Danh sách kiểm lúc hoảng')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Stop typing</div><div class="lz-d">Every extra command makes the state harder to read. Nothing is on fire that one minute makes worse.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Protect the tree</div><div class="lz-d"><code>git stash -u</code>, or copy the whole folder. Uncommitted work is the only thing genuinely at risk.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Look</div><div class="lz-d"><code>git status</code>, <code>git reflog -15</code>, <code>git log --oneline --graph --all -20</code>.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Name the situation</div><div class="lz-d">Match it to one of the ten above before running anything.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Fix, then verify</div><div class="lz-d">Re-run <code>git log</code> and <code>git status</code>. Confirm the commits are where you think.</div></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Go to a folder that is <strong>not</strong> inside any Git repository (for example <code>cd ~</code>; on Windows use Git Bash), save the script below as <code>tham-hoa.sh</code> and run <code>bash tham-hoa.sh</code> — with <code>bash</code> even on a Mac whose shell is zsh. It builds <code>phong-tham-hoa/</code> with five small repositories, one disaster each. The dates are fixed, so your hashes are exactly the ones in this lesson and on the slides.</li><li>In each folder, <strong>only look</strong> first: <code>git status</code>, <code>git reflog -10</code>, <code>git log --oneline --graph --all</code>. Place the disaster on the map (slide 4) before typing any fix.</li><li>Rescue each one with a single recipe: <code>1-nham-nhanh</code> — the cart commit belongs on a new <code>feature/cart</code>, and <code>main</code> goes back one commit; <code>2-reset-hard</code> — bring back the two lost commits; <code>3-xoa-nhanh</code> — restore <code>feature/payment</code>; <code>4-merge-nham</code> — undo the merge of the unfinished branch (nothing was pushed); <code>5-stash-drop</code> — get <code>ghi-chu.txt</code> back.</li><li>Grade yourself with <code>bash tham-hoa.sh kiem</code>, run from the folder that holds the script. Made things worse? <code>bash tham-hoa.sh</code> rebuilds all five from scratch.</li></ol>
<pre><code class="language-bash">#!/usr/bin/env bash
# Phòng thí nghiệm thảm hoạ — Chương 13.  Dựng: bash tham-hoa.sh   Chấm: bash tham-hoa.sh kiem
export GIT_AUTHOR_NAME="Sinh Vien" GIT_AUTHOR_EMAIL="sv@fpt.edu.vn"
export GIT_COMMITTER_NAME="Sinh Vien" GIT_COMMITTER_EMAIL="sv@fpt.edu.vn"
t=1788228000                                   # giờ cố định ⇒ mã băm giống hệt trên mọi máy
g() { t=$((t+60)); GIT_AUTHOR_DATE="$t +0700" GIT_COMMITTER_DATE="$t +0700" git "$@"; }
moi() { mkdir "$1" &amp;&amp; cd "$1" &amp;&amp; git init -q -b main
  echo "# Đặt lịch phòng khám" &gt; README.md &amp;&amp; g add . &amp;&amp; g commit -q -m "chore: khởi tạo dự án"
  echo "login()" &gt; auth.js &amp;&amp; g add . &amp;&amp; g commit -q -m "feat(auth): form đăng nhập"; }
ok() { [ "$(git -C "$1" log -1 --format=%s "$2" 2&gt;/dev/null)" = "$3" ] &amp;&amp; echo "✅ $1 · $2" || echo "❌ $1 · $2"; }

if [ "$1" = kiem ]; then cd phong-tham-hoa || exit 1
  ok 1-nham-nhanh main "feat(auth): form đăng nhập"; ok 1-nham-nhanh feature/cart "feat(cart): nút thêm vào giỏ"
  ok 2-reset-hard main "test(auth): thêm test đăng nhập"
  ok 3-xoa-nhanh feature/payment "feat(payment): thanh toán VNPay"
  ok 4-merge-nham main "docs: cập nhật README"
  grep -qs Zalo 5-stash-drop/ghi-chu.txt &amp;&amp; echo "✅ 5-stash-drop · ghi-chu.txt" || echo "❌ 5-stash-drop · ghi-chu.txt"
  exit 0; fi

set -e; rm -rf phong-tham-hoa; mkdir phong-tham-hoa; cd phong-tham-hoa
( moi 1-nham-nhanh                             # 1. commit nhầm lên main
  echo "addToCart()" &gt; cart.js &amp;&amp; g add . &amp;&amp; g commit -q -m "feat(cart): nút thêm vào giỏ" )
( moi 2-reset-hard                             # 2. lỡ tay reset --hard mất 2 commit
  echo "if (!email) return" &gt;&gt; auth.js &amp;&amp; g commit -qam "fix(auth): chặn email rỗng"
  echo "test('login')" &gt; auth.test.js &amp;&amp; g add . &amp;&amp; g commit -q -m "test(auth): thêm test đăng nhập"
  git reset -q --hard HEAD~2 )
( moi 3-xoa-nhanh                              # 3. xoá nhầm nhánh chưa push
  g switch -q -c feature/payment &amp;&amp; echo "pay()" &gt; pay.js &amp;&amp; g add . &amp;&amp; g commit -q -m "feat(payment): thanh toán VNPay"
  g switch -q main &amp;&amp; git branch -q -D feature/payment )
( moi 4-merge-nham                             # 4. merge nhánh làm dở vào main
  g switch -q -c feature/wip &amp;&amp; echo "// TODO" &gt; wip.js &amp;&amp; g add . &amp;&amp; g commit -q -m "wip: đang làm dở"
  g switch -q main &amp;&amp; echo "Chạy: npm run dev" &gt;&gt; README.md &amp;&amp; g commit -qam "docs: cập nhật README"
  g merge -q --no-ff feature/wip -m "Merge branch 'feature/wip'" )
( moi 5-stash-drop                             # 5. cất ghi chú vào stash rồi lỡ drop
  echo "ý tưởng: nhắc lịch khám qua Zalo" &gt; ghi-chu.txt &amp;&amp; g add ghi-chu.txt
  g stash push -q -m "ghi chú quan trọng" &amp;&amp; git stash drop -q )
echo "Đã dựng 5 sự cố trong $(pwd). Cứu xong thì chạy: bash tham-hoa.sh kiem"</code></pre>
<p><strong>Done when:</strong> <code>bash tham-hoa.sh kiem</code> prints six ✅ lines, and for each repository you can say which zone of the map it was in (uncommitted / local only / pushed) and why the command you used was safe there.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Reflog</span><span class="v">A local journal of every position HEAD and each branch has held. The first place to look for any "lost" commit.</span></div>
  <div class="kv"><span class="k">ORIG_HEAD</span><span class="v">Where HEAD was before the last big move (merge, reset, rebase). <code>git reset --hard ORIG_HEAD</code> undoes that move.</span></div>
  <div class="kv"><span class="k">Dangling commit</span><span class="v">A commit nothing points to, not even a reflog entry. <code>git fsck</code> lists it until garbage collection prunes it.</span></div>
  <div class="kv"><span class="k">Detached HEAD</span><span class="v">HEAD points at a commit instead of a branch, so new commits there have no branch to hold them.</span></div>
  <div class="kv"><span class="k">Force-push</span><span class="v">Overwriting a remote branch with history that does not contain its commits — how a teammate can make your pushed work vanish from GitHub.</span></div>
  <div class="kv"><span class="k">Rotate a credential</span><span class="v">Revoke a leaked key at the provider and issue a new one. Always step one of a secret leak, before any history cleaning.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Anything that was ever committed can be recovered for weeks; only uncommitted edits can truly be lost — so <code>git stash -u</code> before any fix.</li><li>Place the emergency on the map first: uncommitted, local only, or pushed — each zone has different safe commands.</li><li>Local mistakes are undone by moving pointers back: <code>reflog</code>, <code>ORIG_HEAD</code>, <code>git branch</code>/<code>switch -c</code> on a hash.</li><li>Pushed mistakes are undone by adding commits (<code>revert</code>), and a leaked secret is rotated before anything else.</li><li>When the reflog has nothing, <code>git fsck</code> still finds dangling commits — including a dropped stash.</li></ul>

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

<h3>Công thức nào? Bắt đầu từ tấm bản đồ</h3>
${slide('git-13', 3, 'Luật sống sót: Git chỉ cứu thứ nó đã thấy')}
${slide('git-13', 4, 'Sơ đồ chọn lệnh cứu theo sự cố')}
<p>Hai câu hỏi đặt mọi sự cố lên tấm bản đồ này: <em>phần việc bị mất đã từng được commit chưa?</em> và <em>đã push chưa?</em> Việc chưa commit là vùng nguy hiểm thật sự duy nhất. Commit chỉ nằm trên máy bạn thì luôn mang về được bằng reflog (nhật ký tham chiếu). Commit đã push thì sửa bằng cách THÊM commit (revert — hoàn tác bằng một commit nghịch đảo), không bao giờ bằng cách viết lại thứ đồng đội đã có.</p>

<h3>1. Tôi commit nhầm nhánh</h3>
${slide('git-13', 5, 'Công thức 1: commit nhầm lên main')}
<pre><code><span class="tok-comment"># Chưa push. Chuyển commit cuối sang đúng nhánh:</span>
git switch -c feature/right-branch      <span class="tok-comment"># mang commit đi theo bạn</span>
git switch main
git reset --hard HEAD~1                 <span class="tok-comment"># gỡ nó khỏi main</span></code></pre>
<pre><code><span class="tok-comment"># Nhiều commit, hoặc bạn đã chuyển đi rồi — cherry-pick chúng sang:</span>
git switch feature/right-branch
git cherry-pick 3f8a1c9 9e2d4b7
git switch main &amp;&amp; git reset --hard HEAD~2</code></pre>
<p>Cách ngắn hơn một lệnh, không cần rời main: <code>git branch feature/cart</code> rồi <code>git reset --hard HEAD~1</code> (đúng như slide ở trên, output thật). Thứ tự là tất cả: <strong>tạo nhãn nhánh TRƯỚC</strong>, rồi mới lùi main. Đảo ngược thứ tự thì commit thành "mồ côi" — vẫn cứu được bằng reflog, nhưng bạn vừa tự tạo thêm một sự cố thứ hai.</p>

<h3>2. Tôi chạy reset --hard và mất commit</h3>
${slide('git-13', 6, 'Công thức 2: lỡ reset --hard mất hai commit')}
<pre><code>git reflog -10</code></pre>
<div class="out">e8b4d92 HEAD@{0}: reset: moving to HEAD~3
c7f1a30 HEAD@{1}: commit: test(auth): cover the expired-token path</div>
<pre><code>git reset --hard HEAD@{1}</code></pre>
<p>Dòng <em>ngay trước</em> cái lệnh phá huỷ là chỗ bạn đứng. Những thay đổi chưa commit ở thời điểm đó thì vẫn mất — đó là lỗ hổng duy nhất (bài 4.4).</p>

<h3>3. Tôi xoá mất một nhánh</h3>
${slide('git-13', 7, 'Công thức 3: xoá nhầm nhánh chưa push')}
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
${slide('git-13', 11, 'Khi sự cố đã lên GitHub — luật đổi hẳn')}
<pre><code>git reflog                              <span class="tok-comment"># nếu bạn vẫn còn chúng ở cục bộ</span>
git switch -c rescue e8b4d92
git rebase origin/feature/login rescue
git push origin rescue</code></pre>
<pre><code><span class="tok-comment"># Nếu bản clone không còn chúng, hãy hỏi GitHub lấy SHA trước lần push:</span>
gh api repos/OWNER/REPO/events \\
  --jq <span class="tok-string">'.[] | select(.type=="PushEvent") | {before: .payload.before, ref: .payload.ref}'</span>
git fetch origin &lt;sha-truoc&gt;</code></pre>

<h3>6. HEAD lìa cành, và tôi đã commit ở đó</h3>
${slide('git-13', 9, 'Công thức 5: HEAD lìa cành, và tôi đã commit ở đó')}
<pre><code>git switch -c rescue        <span class="tok-comment"># làm việc này TRƯỚC khi chuyển đi</span></code></pre>
<pre><code><span class="tok-comment"># Lỡ chuyển đi rồi? Chúng không ai trỏ tới nhưng vẫn sống:</span>
git reflog
git switch -c rescue &lt;mã băm&gt;
<span class="tok-comment"># hoặc, nếu dòng reflog đã hết hạn:</span>
git fsck --lost-found</code></pre>

<h3>7. Một lần merge hay rebase đi sai, đang giữa chừng</h3>
${slide('git-13', 8, 'Công thức 4: merge nhầm nhánh làm dở vào main')}
<pre><code>git merge --abort           <span class="tok-comment"># đang merge: về trước lúc bắt đầu</span>
git rebase --abort          <span class="tok-comment"># đang rebase: về trước lúc bắt đầu</span>
git cherry-pick --abort
git revert --abort</code></pre>
<pre><code><span class="tok-comment"># Đã xong rồi, và kết quả sai:</span>
git reset --hard ORIG_HEAD  <span class="tok-comment"># Git đã lưu chỗ bạn đứng</span>
<span class="tok-comment"># hoặc tìm dòng trước "rebase (start)" trong reflog (bài 3.5)</span></code></pre>
<p><code>--abort</code> chỉ chạy được <em>TRONG LÚC</em> thao tác còn dở. Khi commit merge đã được tạo xong, nó trả lời <code>fatal: There is no merge to abort (MERGE_HEAD missing).</code> (output thật) — thấy câu đó là tới lượt <code>ORIG_HEAD</code> (HEAD gốc — chỗ HEAD đứng trước lần di chuyển lớn gần nhất). Còn nếu merge đã push thì cả hai cách đều không dùng: <code>git revert -m 1 &lt;merge&gt;</code> (tình huống 8).</p>

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

<h3>Thêm: Tôi lỡ drop một stash vẫn còn cần</h3>
${slide('git-13', 10, 'Công thức 6: lỡ drop stash — git fsck tìm lại')}
<p>Một stash là một commit mà chỉ <code>refs/stash</code> trỏ tới. <code>git stash drop</code> — hay một lần <code>pop</code> ngoài ý muốn — gỡ con trỏ đó <em>VÀ</em> dòng reflog của nó, nên <code>git reflog</code> sẽ không hiện ra. Bản thân commit vẫn nằm trong kho đối tượng ở dạng lủng lẳng (dangling — không ai trỏ tới) cho tới khi bộ dọn rác (garbage collection) xoá nó (mặc định: đối tượng không với tới được và cũ hơn hai tuần). Việc đầu tiên: cuộn terminal lên — lệnh drop in sẵn mã băm đầy đủ.</p>
<pre><code>git stash drop</code></pre>
<div class="out">Dropped refs/stash@{0} (07d8f6f75ecade3d5036b06cfaa658b93576f776)</div>
<pre><code><span class="tok-comment"># Lỡ đóng terminal rồi? Hỏi fsck các commit không ai trỏ tới:</span>
git fsck --lost-found
git show -s --format=<span class="tok-string">"%h %s"</span> 07d8f6f      <span class="tok-comment"># "On main: …" nghĩa là một stash</span>
git stash apply 07d8f6f</code></pre>
<div class="out">dangling commit 07d8f6f75ecade3d5036b06cfaa658b93576f776
07d8f6f On main: ghi chú quan trọng</div>
<p>Trong kho thật, fsck có thể liệt kê cả chục commit lủng lẳng. In hết kèm lời nhắn rồi chọn cái bắt đầu bằng <code>On &lt;nhánh&gt;:</code> hoặc <code>WIP on</code>:</p>
<pre><code>git fsck --no-reflogs | awk <span class="tok-string">'/dangling commit/ {print $3}'</span> | xargs git show -s --format=<span class="tok-string">"%h %s"</span></code></pre>

<h3>Danh sách kiểm lúc hoảng</h3>
${slide('git-13', 12, 'Danh sách kiểm lúc hoảng')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Ngừng gõ</div><div class="lz-d">Mỗi lệnh thêm vào làm trạng thái khó đọc hơn. Không có gì đang cháy tới mức một phút làm nó tệ hơn.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Bảo vệ cây làm việc</div><div class="lz-d"><code>git stash -u</code>, hoặc chép cả thư mục ra. Việc chưa commit là thứ duy nhất thật sự đang gặp rủi ro.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Nhìn</div><div class="lz-d"><code>git status</code>, <code>git reflog -15</code>, <code>git log --oneline --graph --all -20</code>.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Gọi tên tình huống</div><div class="lz-d">Khớp nó với một trong mười ca ở trên TRƯỚC khi chạy bất cứ thứ gì.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Sửa, rồi kiểm chứng</div><div class="lz-d">Chạy lại <code>git log</code> và <code>git status</code>. Xác nhận các commit nằm đúng chỗ bạn nghĩ.</div></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Vào một thư mục <strong>KHÔNG</strong> nằm trong kho Git nào (ví dụ <code>cd ~</code>; trên Windows dùng Git Bash), lưu script bên dưới thành <code>tham-hoa.sh</code> rồi chạy <code>bash tham-hoa.sh</code> — gõ đúng <code>bash</code> kể cả trên Mac đang dùng zsh. Nó dựng <code>phong-tham-hoa/</code> gồm năm kho nhỏ, mỗi kho một sự cố. Ngày giờ được cố định, nên mã băm của bạn khớp đúng từng ký tự với bài và slide.</li><li>Vào từng thư mục, <strong>CHỈ NHÌN</strong> trước: <code>git status</code>, <code>git reflog -10</code>, <code>git log --oneline --graph --all</code>. Đặt sự cố lên tấm bản đồ (slide 4) rồi mới gõ lệnh sửa.</li><li>Cứu mỗi kho bằng đúng một công thức: <code>1-nham-nhanh</code> — commit giỏ hàng phải nằm trên nhánh mới <code>feature/cart</code>, còn <code>main</code> lùi lại một commit; <code>2-reset-hard</code> — mang hai commit đã mất về; <code>3-xoa-nhanh</code> — khôi phục <code>feature/payment</code>; <code>4-merge-nham</code> — gỡ lần merge nhánh làm dở (chưa push gì cả); <code>5-stash-drop</code> — lấy lại <code>ghi-chu.txt</code>.</li><li>Tự chấm bằng <code>bash tham-hoa.sh kiem</code>, chạy ở đúng thư mục chứa script. Lỡ làm rối hơn? <code>bash tham-hoa.sh</code> dựng lại cả năm kho từ đầu.</li></ol>
<pre><code class="language-bash">#!/usr/bin/env bash
# Phòng thí nghiệm thảm hoạ — Chương 13.  Dựng: bash tham-hoa.sh   Chấm: bash tham-hoa.sh kiem
export GIT_AUTHOR_NAME="Sinh Vien" GIT_AUTHOR_EMAIL="sv@fpt.edu.vn"
export GIT_COMMITTER_NAME="Sinh Vien" GIT_COMMITTER_EMAIL="sv@fpt.edu.vn"
t=1788228000                                   # giờ cố định ⇒ mã băm giống hệt trên mọi máy
g() { t=$((t+60)); GIT_AUTHOR_DATE="$t +0700" GIT_COMMITTER_DATE="$t +0700" git "$@"; }
moi() { mkdir "$1" &amp;&amp; cd "$1" &amp;&amp; git init -q -b main
  echo "# Đặt lịch phòng khám" &gt; README.md &amp;&amp; g add . &amp;&amp; g commit -q -m "chore: khởi tạo dự án"
  echo "login()" &gt; auth.js &amp;&amp; g add . &amp;&amp; g commit -q -m "feat(auth): form đăng nhập"; }
ok() { [ "$(git -C "$1" log -1 --format=%s "$2" 2&gt;/dev/null)" = "$3" ] &amp;&amp; echo "✅ $1 · $2" || echo "❌ $1 · $2"; }

if [ "$1" = kiem ]; then cd phong-tham-hoa || exit 1
  ok 1-nham-nhanh main "feat(auth): form đăng nhập"; ok 1-nham-nhanh feature/cart "feat(cart): nút thêm vào giỏ"
  ok 2-reset-hard main "test(auth): thêm test đăng nhập"
  ok 3-xoa-nhanh feature/payment "feat(payment): thanh toán VNPay"
  ok 4-merge-nham main "docs: cập nhật README"
  grep -qs Zalo 5-stash-drop/ghi-chu.txt &amp;&amp; echo "✅ 5-stash-drop · ghi-chu.txt" || echo "❌ 5-stash-drop · ghi-chu.txt"
  exit 0; fi

set -e; rm -rf phong-tham-hoa; mkdir phong-tham-hoa; cd phong-tham-hoa
( moi 1-nham-nhanh                             # 1. commit nhầm lên main
  echo "addToCart()" &gt; cart.js &amp;&amp; g add . &amp;&amp; g commit -q -m "feat(cart): nút thêm vào giỏ" )
( moi 2-reset-hard                             # 2. lỡ tay reset --hard mất 2 commit
  echo "if (!email) return" &gt;&gt; auth.js &amp;&amp; g commit -qam "fix(auth): chặn email rỗng"
  echo "test('login')" &gt; auth.test.js &amp;&amp; g add . &amp;&amp; g commit -q -m "test(auth): thêm test đăng nhập"
  git reset -q --hard HEAD~2 )
( moi 3-xoa-nhanh                              # 3. xoá nhầm nhánh chưa push
  g switch -q -c feature/payment &amp;&amp; echo "pay()" &gt; pay.js &amp;&amp; g add . &amp;&amp; g commit -q -m "feat(payment): thanh toán VNPay"
  g switch -q main &amp;&amp; git branch -q -D feature/payment )
( moi 4-merge-nham                             # 4. merge nhánh làm dở vào main
  g switch -q -c feature/wip &amp;&amp; echo "// TODO" &gt; wip.js &amp;&amp; g add . &amp;&amp; g commit -q -m "wip: đang làm dở"
  g switch -q main &amp;&amp; echo "Chạy: npm run dev" &gt;&gt; README.md &amp;&amp; g commit -qam "docs: cập nhật README"
  g merge -q --no-ff feature/wip -m "Merge branch 'feature/wip'" )
( moi 5-stash-drop                             # 5. cất ghi chú vào stash rồi lỡ drop
  echo "ý tưởng: nhắc lịch khám qua Zalo" &gt; ghi-chu.txt &amp;&amp; g add ghi-chu.txt
  g stash push -q -m "ghi chú quan trọng" &amp;&amp; git stash drop -q )
echo "Đã dựng 5 sự cố trong $(pwd). Cứu xong thì chạy: bash tham-hoa.sh kiem"</code></pre>
<p><strong>Đạt khi:</strong> <code>bash tham-hoa.sh kiem</code> in ra đủ sáu dòng ✅, và với mỗi kho bạn nói được nó nằm ở vùng nào trên bản đồ (chưa commit / chỉ ở máy / đã push) và vì sao lệnh bạn dùng là an toàn ở vùng đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Reflog</span><span class="v">Nhật ký tham chiếu — sổ ghi cục bộ mọi vị trí HEAD và từng nhánh từng đứng. Chỗ đầu tiên để tìm mọi commit "đã mất".</span></div>
  <div class="kv"><span class="k">ORIG_HEAD</span><span class="v">HEAD gốc — chỗ HEAD đứng trước lần di chuyển lớn gần nhất (merge, reset, rebase). <code>git reset --hard ORIG_HEAD</code> huỷ lần di chuyển đó.</span></div>
  <div class="kv"><span class="k">Dangling commit</span><span class="v">Commit lủng lẳng — không gì trỏ tới, kể cả reflog. <code>git fsck</code> vẫn liệt kê nó cho tới khi bộ dọn rác xoá.</span></div>
  <div class="kv"><span class="k">Detached HEAD</span><span class="v">HEAD lìa cành — HEAD trỏ thẳng vào một commit thay vì một nhánh, nên commit mới ở đó không có nhánh nào giữ.</span></div>
  <div class="kv"><span class="k">Force-push</span><span class="v">Đẩy ép — ghi đè nhánh trên remote bằng lịch sử không chứa các commit của nó; cách một bạn cùng nhóm làm việc đã push của bạn biến khỏi GitHub.</span></div>
  <div class="kv"><span class="k">Rotate a credential</span><span class="v">Xoay chứng chỉ — thu hồi khoá bị lộ ở nhà cung cấp và cấp khoá mới. Luôn là bước một khi lộ bí mật, trước mọi việc dọn lịch sử.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Thứ gì từng được commit thì cứu được trong nhiều tuần; chỉ phần sửa chưa commit mới mất thật — nên <code>git stash -u</code> trước mọi cách sửa.</li><li>Đặt sự cố lên bản đồ trước: chưa commit, chỉ ở máy, hay đã push — mỗi vùng có lệnh an toàn riêng.</li><li>Sai lầm cục bộ được gỡ bằng cách dời con trỏ về: <code>reflog</code>, <code>ORIG_HEAD</code>, <code>git branch</code>/<code>switch -c</code> trên một mã băm.</li><li>Sai lầm đã push được gỡ bằng cách thêm commit (<code>revert</code>), còn bí mật bị lộ thì xoay khoá trước mọi thứ khác.</li><li>Khi reflog không còn gì, <code>git fsck</code> vẫn tìm ra commit lủng lẳng — kể cả một stash đã drop.</li></ul>

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
${slide('git-13', 14, 'cuongthai.com: push không deploy — deploy là một script')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Branch from main</div><div class="lz-d">GitHub flow (7.1). One branch per change, short-lived.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Run the checks locally</div><div class="lz-d">Type check, frontend build, and the seed if the schema moved.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Commit to local main</div><div class="lz-d">Small commits, Conventional Commits (1.4).</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Deploy with a script</div><div class="lz-d"><code>bash deploy-nha.sh</code>. NOT by pushing.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Wait for a human to test production</div><div class="lz-d">The fix is confirmed working before anything is shared.</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">Then push</div><div class="lz-d">At this point the push just syncs GitHub with what production already runs.</div></div>
</div>

<div class="callout warn"><strong>Update (09/2026) — steps 5 and 6 have changed.</strong> <code>deploy-nha.sh</code> now runs the required CI checks itself (backend type check, the eval checks, <code>npm test</code>, frontend type check) and, when they all pass, runs <code>git push origin HEAD:main</code> on its own, without asking. So on this site today, <em>deploying is pushing</em>: the push happens at the end of step 4, not after someone has tested production. If a check fails, the script skips the push — production still runs the new image and only GitHub lags behind. The rule in the next section still holds exactly (a push never starts a deploy); what changed is the other direction (a deploy ends with a push). Check the real state with <code>git log --oneline origin/main..HEAD</code>, never by assuming.</div>

<h3>The rule that surprises everyone: pushing does not deploy</h3>
<div class="callout danger">Two deploy workflows once triggered on <em>every</em> push to <code>main</code> and raced each other into real outages. On 3 July the feed returned 500 because the running image lagged behind a schema change. On 6 July two concurrent deploys collided while recreating the backend container, leaving it <code>Exited(137)</code> plus orphan containers — recovered by hand with <code>docker start</code>. Both workflows are now <code>workflow_dispatch</code> only.</div>
<p>The general lesson is bigger than one site: <strong>your branching model and your deployment trigger are two separate decisions.</strong> Coupling them tightly means an ordinary Git operation — a push, a merge, a revert — can start an irreversible action while you are still thinking. Verify what a push actually triggers rather than assuming:</p>
<pre><code>grep -A4 <span class="tok-string">'^on:'</span> .github/workflows/*.yml
gh run list --limit 8 --branch main       <span class="tok-comment"># what really fired on the last pushes</span></code></pre>

<h3>Reviewing your own diff — the highest-value five minutes</h3>
${slide('git-13', 15, 'Tự review diff — năm phút đáng giá nhất')}
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
<div class="callout warn"><strong>If <code>@{u}</code> fails:</strong> on a branch you have never pushed, <code>git log --oneline @{u}..HEAD</code> stops with <code>fatal: no upstream configured for branch 'feature/dat-lich'</code> (real output, git 2.51). Nothing is broken — the branch simply has no upstream yet. Compare against the branch your pull request will target instead: <code>git log --oneline origin/main..HEAD</code> and <code>git diff --stat origin/main..HEAD</code>. On slide 15 that second command is what exposes a <code>.env</code> file nobody meant to commit.</div>

<h3>Working alongside AI agents on the same repository</h3>
${slide('git-13', 16, 'Làm việc cùng agent AI: mỗi phiên một worktree')}
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
${slide('git-13', 13, 'Một ngày làm việc thật của đồ án nhóm')}
<div class="kv-grid">
  <div class="kv"><span class="k">Every hour</span><span class="v"><code>status</code>, <code>diff</code>, <code>add -p</code>, <code>commit</code>, <code>switch</code> — Chapters 1 and 3.</span></div>
  <div class="kv"><span class="k">Every day</span><span class="v"><code>fetch</code>, <code>pull --rebase</code>, <code>push</code>, opening a pull request — Chapters 5 and 6.</span></div>
  <div class="kv"><span class="k">Every week</span><span class="v"><code>rebase -i</code> before review, <code>log -S</code> to find something, resolving a conflict — Chapters 2, 3 and 8.</span></div>
  <div class="kv"><span class="k">Every month</span><span class="v">A tag and a release, a revert, a <code>bisect</code> — Chapters 4 and 7.</span></div>
  <div class="kv"><span class="k">Twice a year, at speed</span><span class="v"><code>reflog</code>, <code>filter-repo</code>, <code>fsck</code> — Chapters 9 and 13. Worth having read <em>before</em> you need them.</span></div>
</div>

<h3>The cheat sheet</h3>
${slide('git-13', 17, 'Bảng tra nhanh Chương 13')}
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In <code>thu-git</code>, on an up-to-date <code>main</code>: <code>git switch -c feature/tu-review</code>. Create <code>dat-lich.js</code> containing a <code>console.log("debug", ngay)</code> line and a line that ends with a space, plus a <code>.env</code> file with <code>DB_PASSWORD=abc123</code>. Commit everything in one go, the careless way: <code>git add -A</code>, then <code>git add -f .env</code> (your <code>.gitignore</code> from 1.5 probably blocks it — the <code>-f</code> plays the teammate who forced it in), then <code>git commit -m "feat: đặt lịch"</code>.</li><li>Now review it as if it were someone else's: <code>git log --oneline main..HEAD</code>, <code>git diff --stat main..HEAD</code>, <code>git diff --check main..HEAD</code>, <code>git grep -n "console.log" -- dat-lich.js</code>. Write down the three problems they reveal.</li><li>Fix all three without adding a commit: <code>git rm --cached .env</code> (make sure <code>.gitignore</code> lists <code>.env</code>), delete the debug line and the trailing space, <code>git add dat-lich.js</code>, then <code>git commit --amend --no-edit</code>.</li><li>Run the four review commands again, then add the settings from "The settings worth having on every machine" that you do not have yet, and check them with <code>git config --global --list</code>.</li></ol>
<pre><code class="language-bash">git diff --stat main..HEAD
<span class="tok-comment"># before the fix (real output, git 2.51):</span>
 .env        | 1 +
 dat-lich.js | 4 ++++
git diff --check main..HEAD
dat-lich.js:3: trailing whitespace.
+  return ngay </code></pre>
<p><strong>Done when:</strong> <code>git diff --stat main..HEAD</code> no longer lists <code>.env</code>, <code>git diff --check main..HEAD</code> prints nothing, <code>git grep console.log</code> finds nothing, and <code>git log --oneline main..HEAD</code> still shows exactly one commit.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GitHub flow</span><span class="v">Branch from main, commit, open a pull request, merge, delete the branch — one short-lived branch per change (7.1).</span></div>
  <div class="kv"><span class="k">Self-review</span><span class="v">Reading your own commits and diff before anyone else does: which commits, which files, what content, what leftovers.</span></div>
  <div class="kv"><span class="k">Upstream (@{u})</span><span class="v">The remote branch your local branch tracks. A branch that was never pushed has none, so <code>@{u}</code> fails on it.</span></div>
  <div class="kv"><span class="k">Worktree</span><span class="v">An extra working folder attached to the same repository, with its own HEAD and index — one per agent or session (10.1).</span></div>
  <div class="kv"><span class="k">workflow_dispatch</span><span class="v">A GitHub Actions trigger meaning "run only when someone starts it by hand" — how both deploy workflows here are configured.</span></div>
  <div class="kv"><span class="k">Deploy trigger</span><span class="v">Whatever starts a deployment. Keeping it separate from Git operations means a push can never ship something by accident.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A real workflow is a set of rules each written in response to a specific failure — ask what each one protects against.</li><li>Your branching model and your deploy trigger are separate decisions; on this site a push only runs checks, and today the deploy script ends with a push.</li><li>Before every push: which commits (<code>log origin/main..HEAD</code>), which files (<code>diff --stat</code>), what content, what leftovers (<code>--check</code>, <code>grep</code>).</li><li>AI agents get their own worktree, never <code>git add -A</code> next to another session, and their diffs are read like a colleague's.</li><li>A handful of global settings (<code>zdiff3</code>, <code>pull.ff only</code>, <code>push.autoSetupRemote</code>, <code>fetch.prune</code>) prevent whole classes of surprises.</li></ul>

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
<p class="note-ct"><strong>This is no longer where the course ends.</strong> Three chapters follow: Chapter 14 puts Git inside the tools you open every day (VS Code, graphical clients, configuration, working with teammates on Windows); Chapter 15 is GitHub for students (your profile, GitHub Pages, the Student Developer Pack, a first open-source contribution); and Chapter 16 runs a whole team project on GitHub from day zero to the final release — ending with the course's real final exam.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 13 · Bài 13.2</span>
<h2>Luật lệ trông ra sao khi chúng sinh ra từ những lần sự cố</h2>
<p class="lead">Mọi chương tới giờ cho bạn một cơ chế. Bài này cho xem một quy trình mà một trang production thật đã đi tới, và — hữu ích hơn — <em>VÌ SAO</em>, bởi mỗi luật dưới đây tồn tại vì đã có thứ gì đó hỏng.</p>

<h3>Quy trình</h3>
${slide('git-13', 14, 'cuongthai.com: push không deploy — deploy là một script')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Rẽ nhánh từ main</div><div class="lz-d">GitHub flow (bài 7.1). Mỗi thay đổi một nhánh, sống ngắn ngày.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Chạy các phép kiểm ở máy</div><div class="lz-d">Kiểm kiểu, dựng frontend, và chạy seed nếu schema có đổi.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Commit vào main cục bộ</div><div class="lz-d">Commit nhỏ, theo Conventional Commits (bài 1.4).</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Deploy bằng một script</div><div class="lz-d"><code>bash deploy-nha.sh</code>. KHÔNG deploy bằng cách push.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Chờ người kiểm trên production</div><div class="lz-d">Bản vá được xác nhận là chạy được trước khi chia sẻ bất cứ thứ gì.</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">Rồi mới push</div><div class="lz-d">Tới lúc này thì lần push chỉ là đồng bộ GitHub với thứ production vốn đã chạy.</div></div>
</div>

<div class="callout warn"><strong>Cập nhật (09/2026) — bước 5 và 6 đã đổi.</strong> <code>deploy-nha.sh</code> giờ tự chạy các phép kiểm bắt buộc của CI (kiểm kiểu backend, các bộ eval, <code>npm test</code>, kiểm kiểu frontend) và, khi tất cả xanh, tự chạy <code>git push origin HEAD:main</code> mà không hỏi. Nên ở trang này hôm nay, <em>deploy CHÍNH LÀ push</em>: lần push xảy ra ở cuối bước 4, không phải sau khi có người kiểm production. Nếu một phép kiểm hỏng, script bỏ qua bước push — production vẫn chạy ảnh mới, chỉ GitHub là đi sau. Luật ở mục kế tiếp vẫn đúng y nguyên (push không bao giờ khởi động deploy); thứ đổi là chiều ngược lại (deploy kết thúc bằng một lần push). Kiểm trạng thái thật bằng <code>git log --oneline origin/main..HEAD</code>, đừng bao giờ đoán.</div>

<h3>Cái luật làm ai cũng bất ngờ: push KHÔNG deploy</h3>
<div class="callout danger">Hai workflow deploy từng kích hoạt ở <em>MỌI</em> lần push vào <code>main</code> và đua nhau tới những sự cố thật. Ngày 3 tháng 7, feed trả 500 vì ảnh đang chạy đi sau một thay đổi schema. Ngày 6 tháng 7, hai lượt deploy chạy chồng va nhau lúc dựng lại container backend, để nó ở trạng thái <code>Exited(137)</code> cùng các container mồ côi — phải cứu bằng tay với <code>docker start</code>. Giờ cả hai workflow chỉ còn <code>workflow_dispatch</code>.</div>
<p>Bài học khái quát lớn hơn một trang web: <strong>mô hình nhánh của bạn và cơ chế kích hoạt deploy là hai quyết định tách biệt.</strong> Ghép chặt chúng nghĩa là một thao tác Git bình thường — một lần push, một lần merge, một lần revert — có thể khởi động một hành động không đảo ngược được trong khi bạn còn đang suy nghĩ. Hãy kiểm chứng xem một lần push THẬT SỰ kích hoạt cái gì thay vì phỏng đoán:</p>
<pre><code>grep -A4 <span class="tok-string">'^on:'</span> .github/workflows/*.yml
gh run list --limit 8 --branch main       <span class="tok-comment"># cái gì thật sự chạy ở những lần push gần đây</span></code></pre>

<h3>Tự review diff của mình — năm phút giá trị nhất</h3>
${slide('git-13', 15, 'Tự review diff — năm phút đáng giá nhất')}
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
<div class="callout warn"><strong>Nếu <code>@{u}</code> báo lỗi:</strong> trên một nhánh chưa từng push, <code>git log --oneline @{u}..HEAD</code> dừng với <code>fatal: no upstream configured for branch 'feature/dat-lich'</code> (output thật, git 2.51). Không có gì hỏng cả — nhánh chỉ là chưa có upstream (nhánh theo dõi trên remote). Hãy so với nhánh mà pull request của bạn sẽ nhắm tới: <code>git log --oneline origin/main..HEAD</code> và <code>git diff --stat origin/main..HEAD</code>. Ở slide 15, chính lệnh thứ hai là lệnh lôi ra một file <code>.env</code> không ai định commit.</div>

<h3>Làm việc song song với agent AI trên cùng một kho mã</h3>
${slide('git-13', 16, 'Làm việc cùng agent AI: mỗi phiên một worktree')}
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
${slide('git-13', 13, 'Một ngày làm việc thật của đồ án nhóm')}
<div class="kv-grid">
  <div class="kv"><span class="k">Mỗi giờ</span><span class="v"><code>status</code>, <code>diff</code>, <code>add -p</code>, <code>commit</code>, <code>switch</code> — Chương 1 và 3.</span></div>
  <div class="kv"><span class="k">Mỗi ngày</span><span class="v"><code>fetch</code>, <code>pull --rebase</code>, <code>push</code>, mở một pull request — Chương 5 và 6.</span></div>
  <div class="kv"><span class="k">Mỗi tuần</span><span class="v"><code>rebase -i</code> trước khi review, <code>log -S</code> để tìm thứ gì đó, giải một xung đột — Chương 2, 3 và 8.</span></div>
  <div class="kv"><span class="k">Mỗi tháng</span><span class="v">Một cái tag và một bản phát hành, một lần revert, một lần <code>bisect</code> — Chương 4 và 7.</span></div>
  <div class="kv"><span class="k">Hai lần một năm, lúc nước sôi lửa bỏng</span><span class="v"><code>reflog</code>, <code>filter-repo</code>, <code>fsck</code> — Chương 9 và 13. Đáng đọc <em>TRƯỚC</em> khi cần tới.</span></div>
</div>

<h3>Bảng tra nhanh</h3>
${slide('git-13', 17, 'Bảng tra nhanh Chương 13')}
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong <code>thu-git</code>, từ một <code>main</code> mới nhất: <code>git switch -c feature/tu-review</code>. Tạo <code>dat-lich.js</code> có một dòng <code>console.log("debug", ngay)</code> và một dòng kết thúc bằng dấu cách, cùng một file <code>.env</code> chứa <code>DB_PASSWORD=abc123</code>. Commit tất cả một lượt, kiểu ẩu: <code>git add -A</code>, rồi <code>git add -f .env</code> (<code>.gitignore</code> từ bài 1.5 nhiều khả năng đã chặn nó — <code>-f</code> đóng vai bạn cùng nhóm cố tình ép vào), rồi <code>git commit -m "feat: đặt lịch"</code>.</li><li>Giờ review nó như thể của người khác: <code>git log --oneline main..HEAD</code>, <code>git diff --stat main..HEAD</code>, <code>git diff --check main..HEAD</code>, <code>git grep -n "console.log" -- dat-lich.js</code>. Ghi ra ba vấn đề chúng lộ ra.</li><li>Sửa cả ba mà KHÔNG thêm commit: <code>git rm --cached .env</code> (đảm bảo <code>.gitignore</code> có dòng <code>.env</code>), xoá dòng debug và dấu cách thừa, <code>git add dat-lich.js</code>, rồi <code>git commit --amend --no-edit</code>.</li><li>Chạy lại bốn lệnh review, rồi thêm những thiết lập ở mục "Những thiết lập đáng có trên mọi máy" mà bạn chưa có, kiểm lại bằng <code>git config --global --list</code>.</li></ol>
<pre><code class="language-bash">git diff --stat main..HEAD
<span class="tok-comment"># trước khi sửa (output thật, git 2.51):</span>
 .env        | 1 +
 dat-lich.js | 4 ++++
git diff --check main..HEAD
dat-lich.js:3: trailing whitespace.
+  return ngay </code></pre>
<p><strong>Đạt khi:</strong> <code>git diff --stat main..HEAD</code> không còn liệt kê <code>.env</code>, <code>git diff --check main..HEAD</code> không in gì, <code>git grep console.log</code> không tìm thấy gì, và <code>git log --oneline main..HEAD</code> vẫn đúng một commit.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">GitHub flow</span><span class="v">Quy trình GitHub — rẽ nhánh từ main, commit, mở pull request, merge, xoá nhánh; mỗi thay đổi một nhánh sống ngắn (bài 7.1).</span></div>
  <div class="kv"><span class="k">Self-review</span><span class="v">Tự review — đọc commit và diff của chính mình trước người khác: commit nào, file nào, nội dung gì, còn sót rác gì.</span></div>
  <div class="kv"><span class="k">Upstream (@{u})</span><span class="v">Nhánh theo dõi — nhánh trên remote mà nhánh cục bộ bám theo. Nhánh chưa từng push thì không có, nên <code>@{u}</code> báo lỗi.</span></div>
  <div class="kv"><span class="k">Worktree</span><span class="v">Cây làm việc phụ — một thư mục làm việc nữa gắn vào cùng kho, có HEAD và index riêng; mỗi agent hay mỗi phiên một cái (bài 10.1).</span></div>
  <div class="kv"><span class="k">workflow_dispatch</span><span class="v">Kích hoạt bằng tay — trigger của GitHub Actions nghĩa là "chỉ chạy khi có người bấm"; cả hai workflow deploy ở đây đặt như vậy.</span></div>
  <div class="kv"><span class="k">Deploy trigger</span><span class="v">Cơ chế kích hoạt deploy — thứ khởi động việc triển khai. Tách nó khỏi thao tác Git thì một lần push không thể vô tình đẩy thứ gì lên production.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một quy trình thật là tập luật, mỗi luật viết ra để trả lời một lần hỏng cụ thể — hãy hỏi mỗi luật đang bảo vệ chống lại điều gì.</li><li>Mô hình nhánh và cơ chế deploy là hai quyết định tách rời; ở trang này push chỉ chạy phép kiểm, còn hôm nay script deploy kết thúc bằng một lần push.</li><li>Trước mỗi lần push: commit nào (<code>log origin/main..HEAD</code>), file nào (<code>diff --stat</code>), nội dung gì, rác gì (<code>--check</code>, <code>grep</code>).</li><li>Agent AI có worktree riêng, không bao giờ <code>git add -A</code> cạnh một phiên khác, và diff của nó được đọc như diff của đồng nghiệp.</li><li>Vài thiết lập toàn cục (<code>zdiff3</code>, <code>pull.ff only</code>, <code>push.autoSetupRemote</code>, <code>fetch.prune</code>) chặn được cả một loại bất ngờ.</li></ul>

<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Đi tiếp: track Git trên Code Lab</span><span class="lc-sub">Bài tập chấm điểm trải khắp mọi chương, kèm lời giải.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/book/en/v2" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git — cuốn tra cứu nên mở từ giờ trở đi</span><span class="lc-sub">Bạn đã có mô hình; cuốn sách là bảng tra.</span></span>
</a>

<div class="pitfall"><strong>Cái bẫy cuối cùng, và cũng là lớn nhất:</strong> coi một quy trình như một luật phải tuân theo thay vì như một tập đánh đổi mà ai đó đã cân nhắc. Mọi luật trong bài này đều trả lời một lần hỏng cụ thể — một cuộc đua giữa hai lần deploy, một file bị vơ nhầm, một cache build hỏng. Khi bạn vào một dự án, hãy hỏi mỗi luật khác thường đang bảo vệ chống lại điều gì. Nếu không ai còn nhớ thì cái luật đó đến hạn xem lại; nếu câu trả lời là một sự cố cụ thể thì nó đang chịu lực.</div>
<p class="note-ct"><strong>Từ đây đi đâu:</strong> bạn giờ đã có mô hình — ảnh chụp và con trỏ — cùng khoảng bốn mươi lệnh. Chừng đó là đủ cho nhiều năm làm việc hằng ngày. Khi gặp một tình huống khoá này chưa nói tới, hãy hỏi ba câu ở bài 0.4 (đụng vào cây nào, dời con trỏ hay tạo đối tượng, đã push chưa?), rồi tra lệnh. Hiểu mô hình chính là thứ làm cho tài liệu đọc được; học thuộc lệnh thì chưa bao giờ.</p>
<p class="note-ct"><strong>Khoá học chưa kết thúc ở đây.</strong> Còn ba chương nữa: Chương 14 đưa Git vào những công cụ bạn mở mỗi ngày (VS Code, ứng dụng giao diện đồ hoạ, cấu hình, làm chung với bạn dùng Windows); Chương 15 là GitHub cho sinh viên (hồ sơ, GitHub Pages, Student Developer Pack, lần đóng góp mã nguồn mở đầu tiên); và Chương 16 vận hành trọn một dự án nhóm trên GitHub từ ngày 0 tới bản phát hành cuối — khép lại bằng bài thi cuối khoá thật.</p>
</div>
`,
    },

    /* ─────────────────────────── 13.3 Kiểm tra Chương 13 ─────────────────────────── */
    {
      title: '13.3 — Chapter 13 check|||13.3 — Kiểm tra Chương 13',
      slug: 'git-13-3-kiem-tra-cuoi-khoa',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống cứu hộ và quy trình thật của Chương 13: commit nhầm nhánh, reflog sau reset --hard, merge nhầm, HEAD lìa cành, stash đã drop, bị force-push đè, lộ khoá, push không deploy, tự review diff và worktree cho agent AI.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 13 · Check</span>
<h2>Ten emergencies, one calm answer each</h2>
<p class="lead">Every question is a situation from lesson 13.1 or 13.2, and every one is decided by the same two questions from the map: was the work ever committed, and has it been pushed? The hashes are the real ones from the disaster lab, so if you did the practice you have already seen these exact outputs. Read each explanation after submitting — especially where the wrong option looked tempting.</p>
<div class="callout ok">This used to be the course's final exam. It is now the Chapter 13 check: the real final exam — twenty questions across all sixteen chapters — has moved to the end of Chapter 16.</div>
<h3>Self-check before you start</h3>
<ul>
<li>I can place any emergency on the map: uncommitted, local only, or pushed.</li>
<li>I can move a commit made on the wrong branch, and I know why the branch must be created before main moves back.</li>
<li>I can find the right line in <code>git reflog</code> after a <code>reset --hard</code>, and I know when <code>ORIG_HEAD</code> is the faster answer.</li>
<li>I can rescue commits made on a detached HEAD and a stash I dropped by mistake (<code>git fsck</code>).</li>
<li>I know why pushed mistakes are fixed with <code>revert</code>, and that a leaked key is rotated before anything else.</li>
<li>I run a self-review before every push, and I finished the disaster lab with six ✅.</li>
</ul>
${slide('git-13', 17, 'Bảng tra nhanh Chương 13')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 13 · Kiểm tra</span>
<h2>Mười sự cố, mỗi sự cố một câu trả lời bình tĩnh</h2>
<p class="lead">Câu nào cũng là một tình huống từ bài 13.1 hoặc 13.2, và câu nào cũng được quyết định bởi đúng hai câu hỏi của tấm bản đồ: phần việc đã từng được commit chưa, và đã push chưa? Mã băm là mã thật của phòng thí nghiệm thảm hoạ, nên nếu đã làm bài thực hành thì bạn đã thấy đúng những output này. Đọc mọi phần giải thích sau khi nộp — nhất là chỗ phương án sai trông hấp dẫn.</p>
<div class="callout ok">Bài này trước đây là bài thi cuối khoá. Giờ nó là bài kiểm tra Chương 13: bài thi cuối khoá thật — hai mươi câu trải khắp mười sáu chương — đã chuyển xuống cuối Chương 16.</div>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đặt được mọi sự cố lên bản đồ: chưa commit, chỉ ở máy, hay đã push.</li>
<li>Tôi chuyển được một commit tạo nhầm nhánh, và biết vì sao phải tạo nhánh trước khi lùi main.</li>
<li>Tôi tìm đúng dòng trong <code>git reflog</code> sau một lần <code>reset --hard</code>, và biết khi nào <code>ORIG_HEAD</code> là đường nhanh hơn.</li>
<li>Tôi cứu được commit tạo trên HEAD lìa cành và một stash lỡ drop (<code>git fsck</code>).</li>
<li>Tôi biết vì sao sai lầm đã push phải sửa bằng <code>revert</code>, và khoá bị lộ thì xoay trước mọi việc khác.</li>
<li>Tôi tự review trước mỗi lần push, và đã làm xong phòng thí nghiệm thảm hoạ với đủ sáu ✅.</li>
</ul>
${slide('git-13', 17, 'Bảng tra nhanh Chương 13')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You are on main and just committed "feat(cart): nút thêm vào giỏ" (a48c3cd). Nothing is pushed, and it belonged on a new branch feature/cart. Which sequence fixes it without losing the commit?|||Bạn đang ở main và vừa commit "feat(cart): nút thêm vào giỏ" (a48c3cd). Chưa push gì, và commit đó đáng ra thuộc nhánh mới feature/cart. Chuỗi lệnh nào sửa được mà không mất commit?',
            options: [
              'git reset --hard HEAD~1, then git switch -c feature/cart|||git reset --hard HEAD~1, rồi git switch -c feature/cart',
              'git switch -c feature/cart, then git reset --hard HEAD~1|||git switch -c feature/cart, rồi git reset --hard HEAD~1',
              'git branch feature/cart, then git reset --hard HEAD~1|||git branch feature/cart, rồi git reset --hard HEAD~1',
              'git revert HEAD, then git switch -c feature/cart|||git revert HEAD, rồi git switch -c feature/cart',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: git branch creates the label on a48c3cd while you stay on main, so the reset then moves only main back (the lab output: "HEAD is now at 563e067"). Option B is the tempting one: after switch -c you are ON feature/cart, so the reset removes the commit from the new branch and main still has it. Option A resets first, so the new branch is created on 563e067 and a48c3cd is orphaned (only the reflog can save it). revert adds an undo commit that feature/cart would inherit.|||VI: git branch tạo nhãn trên a48c3cd trong khi bạn vẫn đứng ở main, nên lệnh reset sau đó chỉ lùi main (output của kho thử: "HEAD is now at 563e067"). Phương án B là bẫy: sau switch -c bạn đang ĐỨNG trên feature/cart, nên reset gỡ commit khỏi nhánh mới còn main thì vẫn giữ nó. Phương án A reset trước, nên nhánh mới được tạo trên 563e067 và a48c3cd thành mồ côi (chỉ reflog cứu được). revert thêm một commit hoàn tác mà feature/cart sẽ thừa hưởng luôn.',
          },
          {
            question: 'After an accidental git reset --hard HEAD~2, git reflog -3 prints: "563e067 HEAD@{0}: reset: moving to HEAD~2", "3f0e87c HEAD@{1}: commit: test(auth): thêm test đăng nhập", "639a6d1 HEAD@{2}: commit: fix(auth): chặn email rỗng". Which command brings both commits back?|||Sau một lần lỡ tay git reset --hard HEAD~2, git reflog -3 in ra: "563e067 HEAD@{0}: reset: moving to HEAD~2", "3f0e87c HEAD@{1}: commit: test(auth): thêm test đăng nhập", "639a6d1 HEAD@{2}: commit: fix(auth): chặn email rỗng". Lệnh nào mang cả hai commit về?',
            options: [
              'git reset --hard HEAD@{1}',
              'git reset --hard HEAD@{0}',
              'git reset --hard HEAD@{2}',
              'git reset --hard 563e067',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: HEAD@{1} is where HEAD stood just before the reset: 3f0e87c, the newer of the two lost commits, whose parent is 639a6d1 — so both return ("HEAD is now at 3f0e87c", real output). HEAD@{2} is tempting because it names the other lost commit, but resetting there brings back only 639a6d1 and leaves 3f0e87c behind. HEAD@{0} and 563e067 are where you are now, so they change nothing.|||VI: HEAD@{1} là chỗ HEAD đứng ngay trước lần reset: 3f0e87c, commit mới hơn trong hai commit đã mất, có cha là 639a6d1 — nên cả hai quay về ("HEAD is now at 3f0e87c", output thật). HEAD@{2} hấp dẫn vì nó gọi tên commit mất còn lại, nhưng reset về đó chỉ mang 639a6d1 về và bỏ lại 3f0e87c. HEAD@{0} và 563e067 là chỗ bạn đang đứng, nên chẳng đổi gì.',
          },
          {
            question: 'Your SWP391 team’s CI deploys to the demo server on every push to main. Two members pushed within a minute; the two deploys raced and the backend came up half-updated. Following 13.2, what is the structural fix?|||CI của nhóm SWP391 deploy lên máy demo ở mọi lần push vào main. Hai bạn push cách nhau một phút; hai lượt deploy đua nhau và backend lên ở trạng thái cập nhật nửa vời. Theo bài 13.2, cách sửa tận gốc là gì?',
            options: [
              'Agree that only one person pushes to main per hour|||Thống nhất mỗi giờ chỉ một người được push vào main',
              'Use git push --force-with-lease so the second push fails|||Dùng git push --force-with-lease để lần push thứ hai bị từ chối',
              'Add more tests so a bad deploy is caught earlier|||Thêm test để bắt một lần deploy hỏng sớm hơn',
              'Decouple deploy from push: pushes only run checks, and deploy is a deliberate manual action (workflow_dispatch or a script)|||Tách deploy khỏi push: push chỉ chạy phép kiểm, còn deploy là một hành động có chủ đích bằng tay (workflow_dispatch hoặc một script)',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The lesson from the 3 and 6 July outages is that the branching model and the deploy trigger are separate decisions; once a push cannot start a deploy, two pushes cannot race. A pushing rota is the tempting answer, but it relies on people remembering, which is exactly what failed. --force-with-lease protects against overwriting commits you have not seen, not against two deploys; more tests catch bad code but not a race between two good commits.|||VI: Bài học từ hai sự cố ngày 3 và 6 tháng 7 là mô hình nhánh và cơ chế kích hoạt deploy là hai quyết định tách rời; khi push không thể khởi động deploy thì hai lần push không thể đua nhau. Chia lịch push là đáp án hấp dẫn, nhưng nó dựa vào trí nhớ con người — đúng thứ đã hỏng. --force-with-lease chặn việc ghi đè commit bạn chưa thấy, không chặn hai lượt deploy; thêm test bắt được mã tồi chứ không bắt được cuộc đua giữa hai commit đều tốt.',
          },
          {
            question: 'You merged feature/wip (unfinished) into main by mistake; the merge commit is 2554c23 and nothing is pushed. You have run no other command since. What is the quickest correct undo?|||Bạn lỡ merge feature/wip (đang làm dở) vào main; commit merge là 2554c23 và chưa push gì. Từ đó tới giờ bạn chưa chạy lệnh nào khác. Cách hoàn tác nhanh và đúng nhất?',
            options: [
              'git revert -m 1 2554c23',
              'git reset --hard ORIG_HEAD',
              'git merge --abort',
              'git reset --hard HEAD~2',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: A merge records where HEAD was in ORIG_HEAD (44e950f here), so reset --hard ORIG_HEAD puts main back exactly, and feature/wip keeps its commit. merge --abort is tempting, but it only works while a merge is still in progress; after the commit exists it answers "fatal: There is no merge to abort (MERGE_HEAD missing)" (real output). revert -m 1 is the right tool once the merge is pushed; locally it just adds two noisy commits and makes re-merging the branch later harder. HEAD~2 goes one commit too far and drops "docs: cập nhật README".|||VI: Một lần merge ghi chỗ HEAD từng đứng vào ORIG_HEAD (ở đây là 44e950f), nên reset --hard ORIG_HEAD đưa main về chính xác, còn feature/wip vẫn giữ commit của nó. merge --abort hấp dẫn, nhưng nó chỉ chạy được khi merge còn dở; khi commit đã được tạo, nó trả lời "fatal: There is no merge to abort (MERGE_HEAD missing)" (output thật). revert -m 1 là công cụ đúng khi merge đã push; ở máy cục bộ nó chỉ thêm commit ồn ào và làm việc merge lại nhánh sau này khó hơn. HEAD~2 lùi quá một commit và vứt luôn "docs: cập nhật README".',
          },
          {
            question: 'To test something you ran git switch --detach HEAD~1, committed a quick fix, then git switch main. Git printed "Warning: you are leaving 1 commit behind … f93dafa fix: thử vá nhanh". You want to keep that fix on its own branch for a pull request. What now?|||Để thử một thứ, bạn chạy git switch --detach HEAD~1, commit một bản vá nhanh, rồi git switch main. Git in ra "Warning: you are leaving 1 commit behind … f93dafa fix: thử vá nhanh". Bạn muốn giữ bản vá đó trên một nhánh riêng để mở pull request. Làm gì?',
            options: [
              'Nothing can be done — commits made on a detached HEAD are never stored|||Không làm gì được nữa — commit tạo trên HEAD lìa cành không bao giờ được lưu',
              'git switch --detach f93dafa and keep committing there|||git switch --detach f93dafa rồi commit tiếp ở đó',
              'git switch -c cuu-ho f93dafa',
              'git stash pop, because Git stashed the detached commit|||git stash pop, vì Git đã cất commit lìa cành vào stash',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: The commit exists; it just has no branch. switch -c cuu-ho f93dafa creates a branch on it ("Switched to a new branch ’cuu-ho’", real output), and that branch can be pushed and opened as a PR. Going back with --detach is tempting because the commit reappears, but you are in exactly the same situation: the next switch leaves it behind again. Git never stashes a commit, and the warning itself says the work is not lost — it even prints the git branch command.|||VI: Commit vẫn tồn tại; nó chỉ không có nhánh. switch -c cuu-ho f93dafa tạo một nhánh trên nó ("Switched to a new branch ’cuu-ho’", output thật), và nhánh đó push được, mở PR được. Quay lại bằng --detach hấp dẫn vì commit hiện ra lại, nhưng bạn vẫn ở y nguyên tình thế cũ: lần switch kế tiếp lại bỏ nó lại. Git không bao giờ cất một commit vào stash, còn chính dòng cảnh báo đã nói việc chưa mất — nó còn in sẵn lệnh git branch.',
          },
          {
            question: 'Yesterday you ran git stash drop on a stash holding ghi-chu.txt, then closed the terminal. git stash list is empty. Which command can still find it?|||Hôm qua bạn chạy git stash drop với một stash chứa ghi-chu.txt, rồi đóng terminal. git stash list giờ trống. Lệnh nào vẫn tìm ra được nó?',
            options: [
              'git fsck --lost-found, then pick the dangling commit whose message starts with "On main:"|||git fsck --lost-found, rồi chọn commit lủng lẳng có lời nhắn bắt đầu bằng "On main:"',
              'git reflog — it lists every commit HEAD has seen|||git reflog — nó liệt kê mọi commit HEAD từng thấy',
              'git log --all --oneline|||git log --all --oneline',
              'git stash list --all|||git stash list --all',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: A stash is a commit that only refs/stash points to; drop removes the pointer and its reflog, leaving a dangling commit that fsck lists ("dangling commit 07d8f6f…" in the lab), and git stash apply 07d8f6f brings the file back. git reflog is the tempting answer, but a stash never moves HEAD to its commit — in the lab it shows only "reset: moving to HEAD", no stash hash. log --all only follows refs, and there is no --all option for stash list.|||VI: Stash là một commit mà chỉ refs/stash trỏ tới; drop gỡ con trỏ đó và reflog của nó, để lại một commit lủng lẳng mà fsck liệt kê ("dangling commit 07d8f6f…" trong kho thử), và git stash apply 07d8f6f mang file về. git reflog là đáp án hấp dẫn, nhưng stash không bao giờ dời HEAD tới commit của nó — trong kho thử reflog chỉ hiện "reset: moving to HEAD", không có mã của stash. log --all chỉ đi theo các ref, còn stash list không có tuỳ chọn --all.',
          },
          {
            question: 'A teammate force-pushed feature/login and your two pushed commits vanished from GitHub. Your laptop still has them (git reflog shows e8b4d92). What should you do?|||Một bạn cùng nhóm force-push lên feature/login và hai commit bạn đã push biến mất khỏi GitHub. Laptop của bạn vẫn còn chúng (git reflog hiện e8b4d92). Bạn nên làm gì?',
            options: [
              'git pull, so Git merges the two versions automatically|||git pull, để Git tự hợp nhất hai phiên bản',
              'git push --force from your laptop to put your version back|||git push --force từ laptop để đặt phiên bản của bạn lên lại',
              'git reset --hard origin/feature/login to match the team|||git reset --hard origin/feature/login cho khớp với nhóm',
              'git switch -c rescue e8b4d92, rebase it onto origin/feature/login, push rescue and talk to your teammate|||git switch -c rescue e8b4d92, rebase nó lên origin/feature/login, push nhánh rescue rồi nói chuyện với bạn kia',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The rescue branch keeps your commits safe, the rebase puts them on top of what is now on GitHub, and a separate branch lets the two of you merge deliberately. Force-pushing back is tempting because it "restores" GitHub, but it erases whatever your teammate pushed — a second incident. reset --hard origin/… throws away your local copy, the only one left. A plain pull on diverged history either refuses (pull.ff only) or creates a merge that quietly reintroduces the old commits.|||VI: Nhánh rescue giữ an toàn các commit của bạn, rebase đặt chúng lên trên thứ đang có trên GitHub, và một nhánh riêng cho hai người hợp nhất có chủ đích. Force-push ngược lại hấp dẫn vì nó "khôi phục" GitHub, nhưng nó xoá sạch thứ bạn kia vừa push — thành sự cố thứ hai. reset --hard origin/… vứt luôn bản sao cục bộ, bản duy nhất còn lại. Còn pull trần trên lịch sử đã rẽ đôi thì hoặc bị từ chối (pull.ff only), hoặc tạo một merge lặng lẽ đưa các commit cũ quay lại.',
          },
          {
            question: 'An hour ago you pushed a .env containing a database password to your public GitHub repository. What is step one?|||Một giờ trước bạn push một file .env chứa mật khẩu cơ sở dữ liệu lên kho GitHub công khai. Bước một là gì?',
            options: [
              'Run git filter-repo --invert-paths --path .env and force-push|||Chạy git filter-repo --invert-paths --path .env rồi force-push',
              'Change the password at the database provider (rotate it), then clean history|||Đổi mật khẩu ở nhà cung cấp cơ sở dữ liệu (xoay khoá), rồi mới dọn lịch sử',
              'Make the repository private right away|||Đổi kho sang riêng tư ngay lập tức',
              'git rm .env, commit and push|||git rm .env, commit rồi push',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Once a secret has been public, assume it is compromised — automated scanners read public pushes within minutes — so the only step that removes the danger is making the old password useless. filter-repo is tempting because it feels like "deleting" the leak, but existing clones, forks and caches keep the old history; it is the right step two. Making the repo private or committing a deletion leaves a password that still works.|||VI: Một bí mật đã từng công khai thì phải coi như đã lộ — bộ quét tự động đọc các lần push công khai trong vài phút — nên bước duy nhất gỡ được nguy hiểm là làm mật khẩu cũ vô dụng. filter-repo hấp dẫn vì cảm giác như "xoá" được chỗ rò, nhưng bản clone, fork và bộ đệm đã có vẫn giữ lịch sử cũ; nó là bước hai đúng đắn. Đổi kho sang riêng tư hay commit một lần xoá đều để lại một mật khẩu vẫn còn dùng được.',
          },
          {
            question: 'Before pushing a brand-new branch, you run git log --oneline @{u}..HEAD and get "fatal: no upstream configured for branch ’feature/dat-lich’". What does it mean and what do you run instead?|||Trước khi push một nhánh hoàn toàn mới, bạn chạy git log --oneline @{u}..HEAD và nhận "fatal: no upstream configured for branch ’feature/dat-lich’". Nó nghĩa là gì và thay bằng lệnh nào?',
            options: [
              'The branch was never pushed, so it has no upstream; compare with the PR target: git log --oneline origin/main..HEAD|||Nhánh chưa từng push nên chưa có upstream; so với nhánh đích của PR: git log --oneline origin/main..HEAD',
              'The repository is damaged; run git fsck --full first|||Kho bị hỏng; chạy git fsck --full trước',
              'You must run git fetch --all before @{u} works|||Phải chạy git fetch --all thì @{u} mới chạy',
              '@{u} only works on main; switch to main to review|||@{u} chỉ chạy trên main; chuyển sang main để review',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: @{u} means "the upstream of this branch", and a branch gets one on its first push -u (or with push.autoSetupRemote). Until then, the meaningful comparison is with the branch the pull request will target — in the lab that listed two commits and a .env nobody meant to commit. fetch is tempting because it is the usual first step, but fetching cannot create an upstream for a branch the remote has never seen. Nothing is damaged, and @{u} works on any branch that has one.|||VI: @{u} nghĩa là "upstream của nhánh này", và một nhánh có upstream ở lần push -u đầu tiên (hoặc nhờ push.autoSetupRemote). Trước đó, phép so có ý nghĩa là so với nhánh mà pull request sẽ nhắm tới — trong kho thử lệnh đó liệt kê hai commit và một file .env không ai định commit. fetch hấp dẫn vì nó thường là bước đầu tiên, nhưng fetch không thể tạo upstream cho một nhánh remote chưa từng thấy. Không có gì hỏng, và @{u} chạy trên mọi nhánh đã có upstream.',
          },
          {
            question: 'You and two AI agent sessions work in the same folder. One agent ran git add -A and swept your half-written file into its commit. What stops this from happening again?|||Bạn và hai phiên agent AI cùng làm trong một thư mục. Một agent chạy git add -A và vơ luôn file bạn đang viết dở vào commit của nó. Cách nào chặn được chuyện này tái diễn?',
            options: [
              'Tell the agents to use git add . instead of git add -A|||Bảo các agent dùng git add . thay cho git add -A',
              'Run git stash before every agent task|||Chạy git stash trước mỗi việc của agent',
              'Give each session its own worktree: git worktree add ../agent-a -b agent/refactor-auth main|||Cho mỗi phiên một worktree riêng: git worktree add ../agent-a -b agent/refactor-auth main',
              'List every half-written file in .gitignore while you work|||Ghi mọi file đang viết dở vào .gitignore trong lúc làm',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: A worktree gives each session its own folder, index and HEAD while sharing the object database, so one session physically cannot stage another’s files (real output: "Preparing worktree (new branch ’agent/refactor-auth’)"). Stashing before each task is tempting, but it hides your work from yourself and only helps if you remember every time. git add . at the top of the repo stages the same files as -A, and ignoring your own work-in-progress means you have to un-ignore it before you can commit it.|||VI: Worktree cho mỗi phiên một thư mục, index và HEAD riêng trong khi dùng chung kho đối tượng, nên về mặt vật lý phiên này không thể staging file của phiên kia (output thật: "Preparing worktree (new branch ’agent/refactor-auth’)"). Stash trước mỗi việc nghe hấp dẫn, nhưng nó giấu việc của chính bạn khỏi bạn và chỉ có tác dụng nếu lần nào bạn cũng nhớ. git add . ở gốc kho staging đúng những file như -A, còn ignore chính phần việc dở của mình thì phải gỡ ignore ra mới commit được.',
          },
        ],
      },
    },
  ],
};
