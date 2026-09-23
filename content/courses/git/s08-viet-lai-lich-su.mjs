/**
 * Git & GitHub — Chương 8: Viết lại lịch sử an toàn.
 * amend · force-with-lease vs force · gỡ bí mật khỏi TOÀN BỘ lịch sử (filter-repo)
 * · viết lại lớn (đổi email tác giả, tách/gộp kho) và chi phí phối hợp · quiz.
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 8 — Rewriting history safely|||Chương 8 — Viết lại lịch sử an toàn',
  description: 'Viết lại lịch sử là công cụ mạnh nhất và nguy hiểm nhất của Git. Chương này đi từ amend một commit, qua force-push có chốt an toàn, tới gỡ một khoá API bị lộ khỏi mọi commit từng tồn tại — kèm chính xác chi phí phối hợp mà mỗi mức phải trả.',
  lessons: [
    /* ─────────────────────────── 8.0 ─────────────────────────── */
    {
      title: '8.0 — Chapter 8 slides: rewriting history in pictures|||8.0 — Slide Chương 8: viết lại lịch sử bằng hình',
      slug: 'git-8-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 18 slide của Chương 8: amend thay commit bằng commit mới, --force so với --force-with-lease trên hai máy thật, bẫy IDE tự fetch nền và --force-if-includes, quy trình gỡ khoá bị lộ bằng git filter-repo — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Slides</span>
<h2>The whole chapter in 18 slides</h2>
<p class="lead">Every history rewrite does the same thing underneath: it builds new commits and abandons old ones. These slides draw that — the dashed "ghost" commit an amend leaves behind, two laptops and one server racing on <code>feature/login</code>, and the exact moment a background fetch turns <code>--force-with-lease</code> into a plain <code>--force</code>.</p>
<p>All terminal output is real, from two test repositories with a fake "GitHub" made by <code>git init --bare</code> (git 2.51, git-filter-repo 2.47), so hashes match from slide to slide: the commit <code>8342020</code> that your teammate An pushes on slide 6 is the one a plain <code>--force</code> wipes on slide 7 and An rescues on slide 11. The slides are in Vietnamese; the diagrams read the same in any language. The last two are a cheat sheet and a 30-minute practice session.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Slide</span>
<h2>Cả chương trong 18 slide</h2>
<p class="lead">Mọi lần viết lại lịch sử bên dưới đều làm cùng một việc: dựng commit mới và bỏ rơi commit cũ. Bộ slide này vẽ đúng điều đó — commit "bóng ma" nét đứt mà một lần amend để lại, hai laptop và một máy chủ cùng giành nhánh <code>feature/login</code>, và đúng khoảnh khắc một lần fetch nền (tự chạy ở phía sau) biến <code>--force-with-lease</code> thành <code>--force</code> trần.</p>
<p>Mọi output terminal là output thật từ hai kho thử có một "GitHub" giả dựng bằng <code>git init --bare</code> (git 2.51, git-filter-repo 2.47), nên mã băm khớp nhau từ slide này sang slide khác: commit <code>8342020</code> mà bạn cùng nhóm An push ở slide 6 chính là commit bị <code>--force</code> trần xoá khỏi nhánh ở slide 7 và được An cứu về ở slide 11. Hai slide cuối là bảng tra nhanh và một buổi thực hành 30 phút.</p>
</div>
${gallery('git-08', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'amend thay commit bằng commit mới'], [4, 'amend --no-edit: thêm file quên'],
  [5, 'Amend một commit đã push'], [6, 'Kịch bản hai máy, một nhánh'], [7, '--force so với --force-with-lease'],
  [8, 'Bẫy IDE tự fetch nền'], [9, '--force-if-includes'], [10, 'Bị từ chối: đọc, tích hợp, push lại'],
  [11, 'Bị force-push đè: cứu commit'], [12, 'Khoá bị lộ: sáu bước theo thứ tự'], [13, 'Xoá dòng rồi commit không xoá được gì'],
  [14, 'git filter-repo: mã băm đổi từ chỗ bẩn trở đi'], [15, 'Quy trình --sensitive-data-removal'], [16, 'Force-push xong vẫn còn sót ở ba chỗ'],
  [17, 'Bảng tra nhanh'], [18, 'Thực hành chương 8'],
])}
`,
    },

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
${slide('git-08', 3, 'amend thay commit bằng commit mới — commit cũ thành bóng ma')}
${slide('git-08', 4, 'amend --no-edit: thêm file quên, giữ lời nhắn')}
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
${slide('git-08', 5, 'Amend một commit đã push: hai lịch sử phân nhánh')}
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In <code>thu-git</code>, on <code>main</code>: create <code>ghi-chu.txt</code> and commit it with a deliberate typo, <code>git commit -m "docs: thme ghi chu"</code>. Write down the hash from <code>git log --oneline -1</code>.</li><li>Fix the message with <code>git commit --amend -m "docs: thêm ghi chú"</code>, then run <code>git reflog -2</code>. Compare the two hashes: the "same" commit now has a new one, and the old one is still listed.</li><li>You forgot a file: create <code>ghi-chu-2.txt</code>, <code>git add</code> it, then <code>git commit --amend --no-edit</code>. Check with <code>git show --stat HEAD</code> that the commit has both files and the message did not change.</li><li>Before pushing, run <code>git log --oneline @{u}..HEAD</code> (one line = still yours alone). Push, run it again (empty = shared now). Then amend once more and try a plain <code>git push</code>: read the <code>(non-fast-forward)</code> rejection, and do <strong>not</strong> force it — undo the amend with <code>git reset --hard @{u}</code>, since the pushed version is the one the team has.</li></ol>
<pre><code class="language-bash">git reflog -3
986cfd4 HEAD@{0}: commit (amend): feat(auth): add refresh token rotation   <span class="tok-comment"># real output from our test repo</span>
b9e574e HEAD@{1}: commit: feat(auth): add refresh tokn rotation
1ab137f HEAD@{2}: commit: feat(auth): thêm form đăng nhập</code></pre>
<p><strong>Done when:</strong> your reflog shows three different hashes for what felt like one commit (typo → fixed message → extra file), and <code>git status -sb</code> ends on <code>## main...origin/main</code> with no <code>ahead</code>/<code>behind</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">amend</span><span class="v">Replace the last commit with a new one (same parent, corrected content or message). The old commit is abandoned, not edited.</span></div>
  <div class="kv"><span class="k">--no-edit</span><span class="v">Keep the existing commit message; no editor opens.</span></div>
  <div class="kv"><span class="k">Rewrite history</span><span class="v">Any operation that replaces existing commits with new ones — amend, rebase, reset + recommit, filter-repo. Always produces new hashes.</span></div>
  <div class="kv"><span class="k">@{u} (upstream)</span><span class="v">Shorthand for the remote-tracking branch your branch follows, e.g. <code>origin/main</code>.</span></div>
  <div class="kv"><span class="k">non-fast-forward</span><span class="v">The server's branch is not an ancestor of yours, so a normal push would throw commits away — Git refuses.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>--amend</code> builds a new commit and moves the branch to it; the old one survives only in the reflog.</li><li><code>git add</code> + <code>git commit --amend --no-edit</code> is the everyday "I forgot a file" fix.</li><li><code>git log --oneline @{u}..HEAD</code> tells you, without guessing, whether the commit is still private.</li><li>Not pushed: amend freely. Pushed to your own branch: amend + <code>--force-with-lease</code>. Pushed and shared: a new commit instead.</li><li>A <code>(non-fast-forward)</code> rejection after an amend is Git telling you the old hash is already out there.</li></ul>

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
${slide('git-08', 3, 'amend thay commit bằng commit mới — commit cũ thành bóng ma')}
${slide('git-08', 4, 'amend --no-edit: thêm file quên, giữ lời nhắn')}
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
${slide('git-08', 5, 'Amend một commit đã push: hai lịch sử phân nhánh')}
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong <code>thu-git</code>, trên <code>main</code>: tạo <code>ghi-chu.txt</code> và commit với một lỗi chính tả cố ý, <code>git commit -m "docs: thme ghi chu"</code>. Ghi lại mã băm từ <code>git log --oneline -1</code>.</li><li>Sửa lời nhắn bằng <code>git commit --amend -m "docs: thêm ghi chú"</code>, rồi chạy <code>git reflog -2</code>. So hai mã băm: commit "vẫn là nó" giờ có mã mới, và mã cũ vẫn nằm trong danh sách.</li><li>Bạn quên một file: tạo <code>ghi-chu-2.txt</code>, <code>git add</code> nó, rồi <code>git commit --amend --no-edit</code>. Kiểm bằng <code>git show --stat HEAD</code> rằng commit có cả hai file và lời nhắn không đổi.</li><li>Trước khi push, chạy <code>git log --oneline @{u}..HEAD</code> (có một dòng = vẫn là của riêng bạn). Push, chạy lại (trống = đã chia sẻ). Rồi amend thêm lần nữa và thử <code>git push</code> thường: đọc lời từ chối <code>(non-fast-forward)</code> (không tua thẳng được), và <strong>KHÔNG</strong> ép nó — huỷ lần amend bằng <code>git reset --hard @{u}</code>, vì bản đã push mới là bản cả nhóm đang có.</li></ol>
<pre><code class="language-bash">git reflog -3
986cfd4 HEAD@{0}: commit (amend): feat(auth): add refresh token rotation   <span class="tok-comment"># output thật từ kho thử</span>
b9e574e HEAD@{1}: commit: feat(auth): add refresh tokn rotation
1ab137f HEAD@{2}: commit: feat(auth): thêm form đăng nhập</code></pre>
<p><strong>Đạt khi:</strong> reflog của bạn cho thấy ba mã băm khác nhau cho thứ mà bạn tưởng chỉ là một commit (gõ sai → sửa lời nhắn → thêm file), và <code>git status -sb</code> kết thúc ở <code>## main...origin/main</code>, không có <code>ahead</code>/<code>behind</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">amend</span><span class="v">Sửa bổ sung — thay commit cuối bằng một commit mới (cùng cha, nội dung hay lời nhắn đã sửa). Commit cũ bị bỏ rơi, không bị sửa.</span></div>
  <div class="kv"><span class="k">--no-edit</span><span class="v">Không sửa lời nhắn — giữ nguyên lời nhắn commit hiện có, không mở trình soạn thảo.</span></div>
  <div class="kv"><span class="k">Rewrite history</span><span class="v">Viết lại lịch sử — mọi thao tác thay commit có sẵn bằng commit mới (amend, rebase, reset rồi commit lại, filter-repo). Luôn đẻ ra mã băm mới.</span></div>
  <div class="kv"><span class="k">@{u} (upstream)</span><span class="v">Nhánh thượng nguồn — cách viết tắt cho nhánh theo dõi từ xa mà nhánh của bạn đi theo, vd <code>origin/main</code>.</span></div>
  <div class="kv"><span class="k">non-fast-forward</span><span class="v">Không tua thẳng được — nhánh trên máy chủ không phải tổ tiên của nhánh bạn, push thường sẽ vứt commit đi nên Git từ chối.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>--amend</code> dựng một commit mới và dời nhánh sang nó; commit cũ chỉ còn sống trong reflog.</li><li><code>git add</code> + <code>git commit --amend --no-edit</code> là cách sửa "quên một file" hằng ngày.</li><li><code>git log --oneline @{u}..HEAD</code> cho bạn biết, không cần đoán, commit còn là của riêng bạn không.</li><li>Chưa push: amend thoải mái. Đã push lên nhánh của riêng bạn: amend + <code>--force-with-lease</code>. Đã push và đã chia sẻ: tạo commit mới.</li><li>Lời từ chối <code>(non-fast-forward)</code> sau một lần amend là Git báo rằng mã băm cũ đã ra ngoài rồi.</li></ul>

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
${slide('git-08', 7, '--force ghi đè mù, --force-with-lease hỏi trước')}
<pre><code>git push --force origin feature/login</code></pre>
<p>Translated: <em>"Whatever <code>feature/login</code> points at on the server, discard it and make it point at my commit."</em> Git does not compare, does not warn, does not care what was there. If a colleague pushed three commits while you were rebasing, those commits are no longer reachable from any branch on the server.</p>
<div class="callout danger">Their work is not <em>deleted</em> — the objects survive on the server until garbage collection — but nothing points at them, nobody can find them without a reflog on the server side, and if their laptop no longer has them, the practical answer is that the work is gone. This is the single most destructive thing an ordinary Git user can do.</div>

<h3>What --force-with-lease adds</h3>
${slide('git-08', 10, 'Bị từ chối: đọc, tích hợp, push lại')}
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
${slide('git-08', 8, 'Bẫy: IDE tự fetch nền làm chốt an toàn gật đầu')}
${slide('git-08', 9, '--force-if-includes bịt lỗ hổng')}
<div class="callout warn"><code>--force-with-lease</code> compares against your <strong>remote-tracking ref</strong>, not against the server directly. Anything that silently runs <code>git fetch</code> for you — an IDE that polls, a <code>git fetch</code> in a shell prompt, a background sync — updates that ref <em>without you having seen the new commits</em>. The lease then compares "current server state" against "current server state", passes, and overwrites your colleague's work exactly as <code>--force</code> would.</div>
<pre><code><span class="tok-comment"># Git 2.30+ closes the hole: also require that your local branch</span>
<span class="tok-comment"># actually CONTAINS everything you have fetched.</span>
git push --force-with-lease --force-if-includes</code></pre>
<p>Use both flags together. <code>--force-if-includes</code> is what makes the lease meaningful again when something else is fetching behind your back.</p>
<p>What it looks like when it saves you — real output from our two-laptop test, right after an automatic fetch had pulled in An's commit that Cường had never looked at:</p>
<pre><code class="language-bash">git push --force-with-lease --force-if-includes</code></pre>
<div class="out"> ! [rejected]        feature/login -&gt; feature/login (remote ref updated since checkout)
error: failed to push some refs to '../origin.git'
hint: Updates were rejected because the tip of the remote-tracking branch has
hint: been updated since the last checkout. If you want to integrate the
hint: remote changes, use 'git pull' before pushing again.</div>
<p>The same push with only <code>--force-with-lease</code>, in the same situation, printed <code>+ 8342020...299ab8e feature/login -&gt; feature/login (forced update)</code> — An's commit gone from the branch. The extra flag checks that the tip of <code>origin/feature/login</code> is actually part of your branch (or of your branch's reflog); a fetch you never integrated fails that check.</p>
<pre><code class="language-bash"><span class="tok-comment"># Make every --force-with-lease also check this, once per machine:</span>
git config --global push.useForceIfIncludes true
<span class="tok-comment"># …or put both flags in the alias:</span>
git config --global alias.pushf <span class="tok-string">"push --force-with-lease --force-if-includes"</span></code></pre>
<div class="callout warn"><strong>Which IDEs fetch on their own?</strong> VS Code has a setting <code>git.autofetch</code> that runs <code>git fetch</code> periodically; several other Git GUIs do the same; some shell prompt themes run <code>git fetch</code> to show "behind" counts. You do not need to know which one is doing it — assume something is, and let <code>--force-if-includes</code> catch it.</div>

<h3>When force-pushing is fine</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">✅ Your own feature branch</span><span class="v">You rebased onto main, or squashed "wip" commits before review. Normal and expected.</span></div>
  <div class="kv"><span class="k">✅ Your fork's branch in a pull request</span><span class="v">Standard open-source practice (5.4). Avoid it mid-review, because it invalidates review comments.</span></div>
  <div class="kv"><span class="k">⚠️ A branch two people share</span><span class="v">Only after telling them, and only when you both know how to recover.</span></div>
  <div class="kv"><span class="k">❌ main, develop, release/*</span><span class="v">Never. Branch protection should make this impossible (6.4); if it does not, fix that today.</span></div>
</div>

<h3>Recovering when someone force-pushed over you</h3>
${slide('git-08', 11, 'Bị force-push đè: commit vẫn còn, tìm và đặt lại')}
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Play your teammate: <code>git clone ../thu-git-server.git ../ban-an</code>. In <code>thu-git</code>, create a branch, commit and push it: <code>git switch -c feature/lease</code>, add <code>login.js</code>, commit, <code>git push -u origin feature/lease</code>.</li><li>In <code>../ban-an</code>: <code>git fetch</code>, <code>git switch feature/lease</code>, add <code>logout.js</code>, commit "An: đăng xuất", <code>git push</code>.</li><li>Back in <code>thu-git</code>, rewrite your tip without looking at the server: add <code>validate.js</code>, <code>git commit --amend --no-edit</code>, then <code>git push --force-with-lease</code>. Expect <code>(stale info)</code>.</li><li>Now play the IDE: <code>git fetch</code>, then <code>git push --force-with-lease --force-if-includes</code>. Expect <code>(remote ref updated since checkout)</code>. (Plain <code>--force-with-lease</code> would succeed here and wipe An's commit — do not run it.)</li><li>Do it properly: <code>git log --oneline HEAD..origin/feature/lease</code> (An's commit appears), <code>git rebase origin/feature/lease</code>, <code>git push --force-with-lease --force-if-includes</code>. Then in <code>../ban-an</code> run <code>git pull</code>.</li></ol>
<pre><code class="language-bash">git push --force-with-lease
 ! [rejected]        feature/lease -&gt; feature/lease (stale info)          <span class="tok-comment"># step 3, real output</span>
git pull                                                                  <span class="tok-comment"># step 5, in ban-an</span>
Updating 4b0bee8..9150435</code></pre>
<p><strong>Done when:</strong> <code>git log --oneline origin/feature/lease</code> contains both "An: đăng xuất" and your commit with <code>validate.js</code>, and An's <code>git pull</code> says <code>Updating …</code> (a fast-forward) instead of creating a merge.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">force push</span><span class="v">A push that replaces the server's branch even though it is not an ancestor of yours — commits only the server had drop off the branch.</span></div>
  <div class="kv"><span class="k">--force-with-lease</span><span class="v">Force only if the server's branch is still where your remote-tracking ref says; otherwise reject with <code>stale info</code>.</span></div>
  <div class="kv"><span class="k">remote-tracking ref</span><span class="v"><code>origin/feature/login</code>: your local memory of the server's branch, updated by every fetch — including ones you did not start.</span></div>
  <div class="kv"><span class="k">--force-if-includes</span><span class="v">Also require that the remote-tracking tip is already part of your branch (or its reflog). Git 2.30+; <code>push.useForceIfIncludes</code> turns it on by default.</span></div>
  <div class="kv"><span class="k">auto-fetch</span><span class="v">A background <code>git fetch</code> run by an IDE or shell prompt. Harmless on its own; the reason a lease alone is not enough.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>--force</code> overwrites whatever the server has, without looking; never on a branch someone else pushes to.</li><li><code>--force-with-lease</code> refuses with <code>stale info</code> when someone pushed after your last fetch — read that as information, not an obstacle.</li><li>A background fetch makes the lease compare the server with itself; <code>--force-if-includes</code> (or <code>push.useForceIfIncludes</code>) closes the hole.</li><li>After a rejection: fetch, read <code>HEAD..origin/&lt;branch&gt;</code>, rebase onto it, push again — often it is then a normal push.</li><li>If you were overwritten, your commits are still in your clone (and on the server as unreferenced objects for a while): rebase onto the new history and push.</li></ul>

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
${slide('git-08', 7, '--force ghi đè mù, --force-with-lease hỏi trước')}
<pre><code>git push --force origin feature/login</code></pre>
<p>Dịch ra: <em>"Dù <code>feature/login</code> trên máy chủ đang trỏ vào cái gì, hãy vứt nó đi và cho nó trỏ vào commit của tôi."</em> Git không so sánh, không cảnh báo, không quan tâm ở đó từng có gì. Nếu một đồng nghiệp đã push ba commit trong lúc bạn rebase thì ba commit đó không còn với tới được từ bất kỳ nhánh nào trên máy chủ.</p>
<div class="callout danger">Việc của họ không bị <em>xoá</em> — các đối tượng vẫn sống trên máy chủ cho tới lần thu gom rác — nhưng không gì trỏ vào chúng, không ai tìm ra chúng nếu không có reflog phía máy chủ, và nếu laptop của họ không còn giữ nữa thì câu trả lời thực tế là công sức đó đã mất. Đây là thứ có sức phá huỷ lớn nhất mà một người dùng Git bình thường làm được.</div>

<h3>--force-with-lease thêm vào cái gì</h3>
${slide('git-08', 10, 'Bị từ chối: đọc, tích hợp, push lại')}
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
${slide('git-08', 8, 'Bẫy: IDE tự fetch nền làm chốt an toàn gật đầu')}
${slide('git-08', 9, '--force-if-includes bịt lỗ hổng')}
<div class="callout warn"><code>--force-with-lease</code> so với <strong>ref theo dõi remote</strong> của bạn, không so trực tiếp với máy chủ. Bất cứ thứ gì âm thầm chạy <code>git fetch</code> hộ bạn — một IDE đang thăm dò, một lệnh <code>git fetch</code> trong dấu nhắc shell, một tiến trình đồng bộ nền — đều cập nhật cái ref đó <em>mà bạn chưa hề nhìn thấy các commit mới</em>. Chốt an toàn khi đó so "trạng thái máy chủ hiện tại" với "trạng thái máy chủ hiện tại", đi qua trót lọt, và ghi đè lên công sức của đồng nghiệp y hệt như <code>--force</code>.</div>
<pre><code><span class="tok-comment"># Git 2.30+ bịt lỗ hổng: đòi hỏi thêm rằng nhánh cục bộ của bạn</span>
<span class="tok-comment"># thật sự CHỨA mọi thứ bạn đã fetch về.</span>
git push --force-with-lease --force-if-includes</code></pre>
<p>Hãy dùng cả hai cờ cùng nhau. <code>--force-if-includes</code> là thứ làm cho chốt an toàn có ý nghĩa trở lại khi có thứ khác đang fetch sau lưng bạn.</p>
<p>Trông nó thế nào khi nó cứu bạn — output thật từ bài thử hai laptop, ngay sau khi một lần fetch tự động đã kéo về commit của An mà Cường chưa hề nhìn:</p>
<pre><code class="language-bash">git push --force-with-lease --force-if-includes</code></pre>
<div class="out"> ! [rejected]        feature/login -&gt; feature/login (remote ref updated since checkout)
error: failed to push some refs to '../origin.git'
hint: Updates were rejected because the tip of the remote-tracking branch has
hint: been updated since the last checkout. If you want to integrate the
hint: remote changes, use 'git pull' before pushing again.</div>
<p>Cũng lệnh push đó mà chỉ có <code>--force-with-lease</code>, trong đúng tình huống đó, đã in ra <code>+ 8342020...299ab8e feature/login -&gt; feature/login (forced update)</code> (cập nhật cưỡng bức) — commit của An biến khỏi nhánh. Cờ thêm vào kiểm rằng đỉnh của <code>origin/feature/login</code> thật sự là một phần của nhánh bạn (hoặc của reflog nhánh bạn); một lần fetch mà bạn chưa tích hợp thì trượt phép kiểm này.</p>
<pre><code class="language-bash"><span class="tok-comment"># Cho mọi lần --force-with-lease tự kiểm thêm điều này, mỗi máy một lần:</span>
git config --global push.useForceIfIncludes true
<span class="tok-comment"># …hoặc nhét cả hai cờ vào alias:</span>
git config --global alias.pushf <span class="tok-string">"push --force-with-lease --force-if-includes"</span></code></pre>
<div class="callout warn"><strong>IDE nào tự fetch?</strong> VS Code có thiết lập <code>git.autofetch</code> chạy <code>git fetch</code> định kỳ; vài giao diện Git khác cũng làm vậy; một số theme dấu nhắc shell chạy <code>git fetch</code> để hiện số commit "behind" (tụt sau). Bạn không cần biết đứa nào đang làm — cứ coi như có đứa đang làm, và để <code>--force-if-includes</code> bắt nó.</div>

<h3>Khi nào force-push là ổn</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">✅ Nhánh tính năng của chính bạn</span><span class="v">Bạn vừa rebase lên main, hoặc gộp các commit "wip" trước khi review. Bình thường và được trông đợi.</span></div>
  <div class="kv"><span class="k">✅ Nhánh trên fork của bạn trong một pull request</span><span class="v">Thực hành chuẩn của mã nguồn mở (bài 5.4). Tránh làm giữa lúc đang review, vì nó làm mất hiệu lực các bình luận.</span></div>
  <div class="kv"><span class="k">⚠️ Một nhánh hai người cùng dùng</span><span class="v">Chỉ sau khi đã báo họ, và chỉ khi cả hai đều biết cách cứu hộ.</span></div>
  <div class="kv"><span class="k">❌ main, develop, release/*</span><span class="v">Không bao giờ. Bảo vệ nhánh phải làm cho điều này bất khả (bài 6.4); nếu chưa, hãy sửa ngay hôm nay.</span></div>
</div>

<h3>Cứu hộ khi có người force-push đè lên bạn</h3>
${slide('git-08', 11, 'Bị force-push đè: commit vẫn còn, tìm và đặt lại')}
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Đóng vai bạn cùng nhóm: <code>git clone ../thu-git-server.git ../ban-an</code>. Trong <code>thu-git</code>, tạo một nhánh, commit và push: <code>git switch -c feature/lease</code>, thêm <code>login.js</code>, commit, <code>git push -u origin feature/lease</code>.</li><li>Trong <code>../ban-an</code>: <code>git fetch</code>, <code>git switch feature/lease</code>, thêm <code>logout.js</code>, commit "An: đăng xuất", <code>git push</code>.</li><li>Quay về <code>thu-git</code>, viết lại đỉnh nhánh mà không nhìn máy chủ: thêm <code>validate.js</code>, <code>git commit --amend --no-edit</code>, rồi <code>git push --force-with-lease</code>. Phải thấy <code>(stale info)</code> (thông tin đã cũ).</li><li>Giờ đóng vai IDE: <code>git fetch</code>, rồi <code>git push --force-with-lease --force-if-includes</code>. Phải thấy <code>(remote ref updated since checkout)</code>. (Ở bước này <code>--force-with-lease</code> trần sẽ thành công và xoá commit của An — đừng chạy nó.)</li><li>Làm cho đúng: <code>git log --oneline HEAD..origin/feature/lease</code> (thấy commit của An), <code>git rebase origin/feature/lease</code>, <code>git push --force-with-lease --force-if-includes</code>. Rồi trong <code>../ban-an</code> chạy <code>git pull</code>.</li></ol>
<pre><code class="language-bash">git push --force-with-lease
 ! [rejected]        feature/lease -&gt; feature/lease (stale info)          <span class="tok-comment"># bước 3, output thật</span>
git pull                                                                  <span class="tok-comment"># bước 5, trong ban-an</span>
Updating 4b0bee8..9150435</code></pre>
<p><strong>Đạt khi:</strong> <code>git log --oneline origin/feature/lease</code> có cả "An: đăng xuất" lẫn commit chứa <code>validate.js</code> của bạn, và <code>git pull</code> của An in <code>Updating …</code> (tua thẳng) thay vì tạo một commit merge.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">force push</span><span class="v">Push cưỡng bức — thay nhánh trên máy chủ dù nó không phải tổ tiên của nhánh bạn; commit chỉ máy chủ có sẽ rơi khỏi nhánh.</span></div>
  <div class="kv"><span class="k">--force-with-lease</span><span class="v">Ép có điều kiện ("hợp đồng thuê") — chỉ ép khi nhánh trên máy chủ vẫn đúng ở chỗ ref theo dõi của bạn nói; nếu không thì từ chối với <code>stale info</code>.</span></div>
  <div class="kv"><span class="k">remote-tracking ref</span><span class="v">Ref theo dõi từ xa — <code>origin/feature/login</code>: trí nhớ trên máy bạn về nhánh của máy chủ, cập nhật sau mỗi lần fetch, kể cả lần bạn không tự chạy.</span></div>
  <div class="kv"><span class="k">--force-if-includes</span><span class="v">Ép nếu đã bao gồm — đòi thêm rằng đỉnh ref theo dõi đã nằm trong nhánh bạn (hoặc reflog của nó). Git 2.30+; <code>push.useForceIfIncludes</code> bật mặc định.</span></div>
  <div class="kv"><span class="k">auto-fetch</span><span class="v">Tự fetch nền — lệnh <code>git fetch</code> do IDE hay dấu nhắc shell chạy ngầm. Tự nó vô hại; nó là lý do chỉ riêng lease là chưa đủ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>--force</code> ghi đè thứ máy chủ đang có mà không nhìn; không bao giờ dùng trên nhánh người khác cũng push.</li><li><code>--force-with-lease</code> từ chối với <code>stale info</code> khi có người push sau lần fetch cuối của bạn — hãy đọc nó như thông tin, không phải chướng ngại.</li><li>Một lần fetch nền khiến lease so máy chủ với chính nó; <code>--force-if-includes</code> (hoặc <code>push.useForceIfIncludes</code>) bịt lỗ hổng đó.</li><li>Sau lời từ chối: fetch, đọc <code>HEAD..origin/&lt;nhánh&gt;</code>, rebase lên nó, push lại — nhiều khi lúc đó chỉ còn là push thường.</li><li>Nếu bị ghi đè, commit của bạn vẫn nằm trong bản clone của bạn (và trên máy chủ dưới dạng object không ai trỏ tới một thời gian): rebase lên lịch sử mới rồi push.</li></ul>

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
${slide('git-08', 12, 'Khoá bị lộ: sáu bước, đổi khoá trước')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Rotate</div><div class="lz-d">Revoke the key at the provider and issue a new one. Minutes matter; nothing else does yet.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Assess</div><div class="lz-d">Public or private? How long was it live? Check the provider's audit log for use you did not make.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Prevent</div><div class="lz-d">Add it to <code>.gitignore</code>, move the value to environment config, commit that.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Clean history</div><div class="lz-d"><code>git filter-repo</code>, below. Now, not first.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Coordinate</div><div class="lz-d">Everyone re-clones. This is the expensive part and it cannot be skipped.</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">Ask the host to purge</div><div class="lz-d">GitHub Support can drop cached unreachable commits, which force-pushing alone does not.</div></div>
</div>

<h3>Finding what is actually in there</h3>
${slide('git-08', 13, 'Xoá dòng rồi commit không xoá được gì; git grep cần -E')}
<pre><code>git log -S<span class="tok-string">"sk_live_"</span> --oneline --all      <span class="tok-comment"># the pickaxe from 2.3</span>
git log --all --full-history -- .env      <span class="tok-comment"># every commit that touched the file</span>
git grep -nE <span class="tok-string">"AKIA[0-9A-Z]{16}"</span> \$(git rev-list --all) 2&gt;/dev/null | head</code></pre>
<p>The last one searches <em>every commit</em> for an AWS key pattern. It is slow on a large repository and it is the only way to be sure you found all of them — a leak is often several commits, not one.</p>
<div class="callout warn"><strong>Do not drop the <code>-E</code>.</strong> Without it <code>git grep</code> uses basic regular expressions, where <code>{16}</code> means the literal characters "{16}" — so the search finds nothing and looks like good news. In our test repository the version without <code>-E</code> printed nothing at all, while <code>git grep -lE</code> listed the key in three commits (<code>4e414d5</code>, <code>f0c7fc8</code>, <code>1dcc959</code>). Also note that <code>git log -S</code> lists the commit that <em>removed</em> the secret too: "fix: remove .env" still shows up, because the text changed there.</div>

<h3>git filter-repo</h3>
${slide('git-08', 14, 'git filter-repo: mọi commit từ chỗ bẩn trở đi đổi mã băm')}
${slide('git-08', 15, 'Quy trình --sensitive-data-removal mà GitHub khuyên dùng')}
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
<div class="callout ok"><strong>The variant GitHub's own guide now uses (as of 09/2026):</strong> git-filter-repo 2.47 added <code>--sensitive-data-removal</code>. Run on an ordinary fresh clone, it first fetches <em>every</em> ref from origin (including GitHub's read-only <code>refs/pull/*</code>), keeps the <code>origin</code> remote, and prints the "First Changed Commit" you will need for GitHub Support. Real output from our test repository:</div>
<pre><code class="language-bash">git clone --no-local origin2.git sach2 &amp;&amp; cd sach2
git filter-repo --sensitive-data-removal --invert-paths --path .env</code></pre>
<div class="out">NOTICE: Fetching all refs from origin to make sure we rewrite
        all history that may reference the sensitive data, via
      git fetch -q --prune --update-head-ok --refmap "" origin +refs/*:refs/*
You rewrote 4 (of 5) commits.

NOTE: First Changed Commit(s) is/are:
  723ea29a3a19e3991980c23bab013454b9d87f3e</div>
<pre><code class="language-bash">git push --force --mirror origin</code></pre>
<div class="out"> + 1dcc959...e98bdbf main -&gt; main (forced update)</div>
<p>(<code>--no-local</code> is only needed because our "server" is a folder on the same disk; with a GitHub URL a plain <code>git clone</code> is already a fresh clone.) Both routes work — we ran both. The mirror-clone route above strips the remote on purpose; the <code>--sensitive-data-removal</code> route keeps it and pushes with <code>--mirror</code>.</p>

<h3>What this costs everyone else</h3>
<div class="callout danger">Every commit after the earliest rewritten one gets a <strong>new hash</strong> (1.2). The entire team's clones are now incompatible with the server. Pulling will not fix it — it produces a duplicated, conflicting history. Everyone must <strong>re-clone</strong>, and any local branch not yet pushed has to be rescued by hand.</div>
<pre><code><span class="tok-comment"># What each colleague does, and the order matters:</span>
git bundle create ~/my-unpushed-work.bundle --all   <span class="tok-comment"># 1. save local work FIRST</span>
cd .. &amp;&amp; rm -rf api-backend                          <span class="tok-comment"># 2. delete the old clone</span>
git clone git@github.com:cuonghoang1103/api-backend.git   <span class="tok-comment"># 3. fresh</span>
<span class="tok-comment"># 4. cherry-pick the rescued commits across from the bundle</span></code></pre>
<p>Open pull requests are also affected: their branches point at commits that no longer exist upstream. Expect to close and re-open some of them, which is one more reason to do this immediately rather than a week later.</p>
<div class="pitfall co-tieu-de"><strong>The rescue that puts the key back.</strong> In our test, Bình's old clone had one unpushed commit. He saved it with a bundle, re-cloned, fetched the bundle into a branch <code>cuu-binh</code> and cherry-picked his commit — correct so far. But <code>git log -S"sk_live_" --oneline --all</code> in the <em>new</em> clone then printed <code>f0c7fc8</code> and <code>723ea29</code> again: the rescue branch carried the whole old history, key included. One <code>git push --all</code> and the cleanup is undone. Delete the rescue branch right after cherry-picking (<code>git branch -D cuu-binh</code>) and re-run the <code>-S</code> search before any push — it must print nothing.</div>

<h3>The part force-pushing does not fix</h3>
${slide('git-08', 16, 'Force-push xong vẫn còn sót ở ba chỗ')}
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Stage the accident in <code>thu-git</code> on <code>main</code>: create <code>.env</code> containing <code>API_KEY=sk_live_THU_NGHIEM_123</code> (fake), commit and push it. Then do the "obvious fix": <code>git rm --cached .env</code>, add <code>.env</code> to <code>.gitignore</code>, commit, push.</li><li>Prove the fix fixed nothing: <code>git log -S"sk_live_" --oneline --all</code> (two commits) and <code>git show HEAD~1:.env</code> (the key, in full).</li><li>Pretend step 1 of the procedure is done (you "rotated" the fake key). Make a fresh clone: <code>git clone --no-local ../thu-git-server.git ../thu-git-sach</code>, <code>cd ../thu-git-sach</code>, then <code>git filter-repo --sensitive-data-removal --invert-paths --path .env</code>. Copy the "First Changed Commit" hash somewhere.</li><li>Verify, then publish: <code>git log -S"sk_live_" --oneline --all</code> must print nothing; then <code>git push --force --mirror origin</code>.</li><li>Go back to the old <code>thu-git</code> and run <code>git pull</code>. Read the error, then treat <code>thu-git</code> as a teammate's stale clone: from now on, work in <code>thu-git-sach</code> (or delete and re-clone).</li></ol>
<pre><code class="language-bash">git pull                              <span class="tok-comment"># in the OLD clone — real output from our test</span>
fatal: Need to specify how to reconcile divergent branches.</code></pre>
<p><strong>Done when:</strong> the <code>-S</code> search is empty in the cleaned clone, <code>git log --oneline</code> there shows different hashes from the old clone for every commit from the leak onwards, and you can explain why the old clone must not push again.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rotate / revoke</span><span class="v">Invalidate the leaked credential at the provider and issue a new one. The only step that actually removes the danger.</span></div>
  <div class="kv"><span class="k">git filter-repo</span><span class="v">The tool the Git project recommends for rewriting a whole history (removing a file, replacing text, changing emails). Installed separately.</span></div>
  <div class="kv"><span class="k">--invert-paths --path</span><span class="v">"Keep everything except this path" — the file disappears from every commit that ever had it.</span></div>
  <div class="kv"><span class="k">Fresh clone / mirror clone</span><span class="v">A clone with no local work; <code>--mirror</code> copies every ref. filter-repo refuses to run elsewhere so a mistake costs nothing.</span></div>
  <div class="kv"><span class="k">Unreachable commit</span><span class="v">A commit no branch or tag points to. Still stored, still viewable by full hash, until garbage collection removes it.</span></div>
  <div class="kv"><span class="k">Push protection</span><span class="v">GitHub secret scanning that blocks a push containing a recognised secret; on by default for pushes to public repositories.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A secret that reached GitHub is compromised: rotate it first, everything else is cleanup.</li><li>Deleting the line in a new commit leaves the key in the old commit; <code>git log -S</code> and <code>git grep -E … $(git rev-list --all)</code> find every copy.</li><li><code>git filter-repo</code> on a fresh clone rewrites every commit from the first dirty one, so every later hash changes.</li><li>After <code>git push --force --mirror</code>, every teammate re-clones; rescued work is cherry-picked and the rescue branch deleted before anyone pushes.</li><li>The server, forks and pull request refs can still hold the old commits — only GitHub Support can purge those, which is why rotation comes first.</li></ul>

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
${slide('git-08', 12, 'Khoá bị lộ: sáu bước, đổi khoá trước')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Xoay khoá</div><div class="lz-d">Thu hồi khoá ở nhà cung cấp và cấp cái mới. Từng phút đều quan trọng; chưa gì khác quan trọng cả.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Đánh giá</div><div class="lz-d">Công khai hay riêng tư? Nó sống bao lâu? Kiểm nhật ký kiểm toán của nhà cung cấp xem có lượt dùng nào không phải của bạn.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Phòng ngừa</div><div class="lz-d">Thêm vào <code>.gitignore</code>, chuyển giá trị sang cấu hình môi trường, commit phần đó.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Dọn lịch sử</div><div class="lz-d"><code>git filter-repo</code>, ngay dưới. Bây giờ, không phải đầu tiên.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Phối hợp</div><div class="lz-d">Mọi người clone lại. Đây là phần đắt đỏ và không bỏ qua được.</div></div>
  <div class="lz-step"><div class="lz-k">6</div><div class="lz-t">Nhờ nhà cung cấp xoá hẳn</div><div class="lz-d">GitHub Support gỡ được các commit không ai trỏ tới còn nằm trong bộ đệm, thứ mà riêng force-push không làm nổi.</div></div>
</div>

<h3>Tìm xem thật sự có gì trong đó</h3>
${slide('git-08', 13, 'Xoá dòng rồi commit không xoá được gì; git grep cần -E')}
<pre><code>git log -S<span class="tok-string">"sk_live_"</span> --oneline --all      <span class="tok-comment"># cái cuốc chim ở bài 2.3</span>
git log --all --full-history -- .env      <span class="tok-comment"># mọi commit từng chạm vào file</span>
git grep -nE <span class="tok-string">"AKIA[0-9A-Z]{16}"</span> \$(git rev-list --all) 2&gt;/dev/null | head</code></pre>
<p>Lệnh cuối tìm mẫu khoá AWS trong <em>mọi commit</em>. Nó chậm trên kho lớn và là cách duy nhất để chắc chắn bạn đã tìm ra hết — một vụ lộ thường nằm ở vài commit, không phải một.</p>
<div class="callout warn"><strong>Đừng bỏ <code>-E</code>.</strong> Không có nó, <code>git grep</code> dùng biểu thức chính quy cơ bản (basic regex), ở đó <code>{16}</code> nghĩa là đúng bốn ký tự "{16}" — nên lệnh không tìm thấy gì và trông như tin vui. Trong kho thử, bản không có <code>-E</code> không in ra dòng nào, còn <code>git grep -lE</code> liệt kê khoá ở ba commit (<code>4e414d5</code>, <code>f0c7fc8</code>, <code>1dcc959</code>). Để ý thêm: <code>git log -S</code> liệt kê cả commit đã <em>XOÁ</em> bí mật — "fix: bỏ .env khỏi repo" vẫn hiện ra, vì chuỗi đó thay đổi ở đúng commit ấy.</div>

<h3>git filter-repo</h3>
${slide('git-08', 14, 'git filter-repo: mọi commit từ chỗ bẩn trở đi đổi mã băm')}
${slide('git-08', 15, 'Quy trình --sensitive-data-removal mà GitHub khuyên dùng')}
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
<div class="callout ok"><strong>Biến thể mà chính hướng dẫn của GitHub đang dùng (tính đến 09/2026):</strong> git-filter-repo 2.47 thêm cờ <code>--sensitive-data-removal</code> (gỡ dữ liệu nhạy cảm). Chạy trên một bản clone mới bình thường, nó fetch <em>MỌI</em> ref từ origin trước (kể cả <code>refs/pull/*</code> chỉ-đọc của GitHub), GIỮ remote <code>origin</code>, và in ra "First Changed Commit" (commit đầu tiên bị đổi) mà bạn sẽ cần khi gửi GitHub Support. Output thật từ kho thử:</div>
<pre><code class="language-bash">git clone --no-local origin2.git sach2 &amp;&amp; cd sach2
git filter-repo --sensitive-data-removal --invert-paths --path .env</code></pre>
<div class="out">NOTICE: Fetching all refs from origin to make sure we rewrite
        all history that may reference the sensitive data, via
      git fetch -q --prune --update-head-ok --refmap "" origin +refs/*:refs/*
You rewrote 4 (of 5) commits.

NOTE: First Changed Commit(s) is/are:
  723ea29a3a19e3991980c23bab013454b9d87f3e</div>
<pre><code class="language-bash">git push --force --mirror origin</code></pre>
<div class="out"> + 1dcc959...e98bdbf main -&gt; main (forced update)</div>
<p>(<code>--no-local</code> chỉ cần vì "máy chủ" của kho thử là một thư mục trên cùng ổ đĩa; với URL GitHub thì <code>git clone</code> thường đã là bản clone mới.) Cả hai đường đều chạy — kho thử đã chạy cả hai. Đường clone mirror ở trên cố tình gỡ remote; đường <code>--sensitive-data-removal</code> giữ nó lại và push bằng <code>--mirror</code>.</p>

<h3>Việc này tốn của mọi người khác cái gì</h3>
<div class="callout danger">Mọi commit sau cái commit bị viết lại sớm nhất đều nhận một <strong>mã băm MỚI</strong> (bài 1.2). Bản clone của cả nhóm giờ không tương thích với máy chủ. Pull không sửa được — nó sinh ra một lịch sử trùng lặp và xung đột. Mọi người phải <strong>CLONE LẠI</strong>, và mọi nhánh cục bộ chưa push phải được cứu bằng tay.</div>
<pre><code><span class="tok-comment"># Việc từng đồng nghiệp phải làm, và thứ tự thì quan trọng:</span>
git bundle create ~/viec-chua-push.bundle --all      <span class="tok-comment"># 1. cứu việc cục bộ TRƯỚC</span>
cd .. &amp;&amp; rm -rf api-backend                          <span class="tok-comment"># 2. xoá bản clone cũ</span>
git clone git@github.com:cuonghoang1103/api-backend.git   <span class="tok-comment"># 3. clone mới</span>
<span class="tok-comment"># 4. cherry-pick các commit đã cứu từ file bundle sang</span></code></pre>
<p>Các pull request đang mở cũng bị ảnh hưởng: nhánh của chúng trỏ vào những commit không còn tồn tại ở thượng nguồn. Hãy chuẩn bị tinh thần đóng và mở lại một số cái, và đó là thêm một lý do để làm việc này ngay lập tức thay vì một tuần sau.</p>
<div class="pitfall co-tieu-de"><strong>Cú cứu hộ mang khoá quay lại.</strong> Trong kho thử, bản clone cũ của Bình có một commit chưa push. Bạn ấy cứu nó bằng bundle, clone lại, fetch bundle vào nhánh <code>cuu-binh</code> rồi cherry-pick (nhặt) commit của mình sang — tới đây vẫn đúng. Nhưng <code>git log -S"sk_live_" --oneline --all</code> trong bản clone <em>MỚI</em> lại in ra <code>f0c7fc8</code> và <code>723ea29</code>: nhánh cứu hộ mang theo cả lịch sử cũ, khoá cũng nằm trong đó. Một lần <code>git push --all</code> là công dọn dẹp đổ sông. Xoá nhánh cứu hộ ngay sau khi cherry-pick (<code>git branch -D cuu-binh</code>) và chạy lại phép tìm <code>-S</code> trước mọi lần push — nó phải không in gì.</div>

<h3>Phần mà force-push không sửa được</h3>
${slide('git-08', 16, 'Force-push xong vẫn còn sót ở ba chỗ')}
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Dựng lại tai nạn trong <code>thu-git</code>, trên <code>main</code>: tạo <code>.env</code> chứa <code>API_KEY=sk_live_THU_NGHIEM_123</code> (khoá giả), commit và push. Rồi làm "cách sửa hiển nhiên": <code>git rm --cached .env</code>, thêm <code>.env</code> vào <code>.gitignore</code>, commit, push.</li><li>Chứng minh cách sửa đó chẳng sửa được gì: <code>git log -S"sk_live_" --oneline --all</code> (hai commit) và <code>git show HEAD~1:.env</code> (khoá, đầy đủ).</li><li>Coi như bước 1 của quy trình đã xong (bạn đã "xoay" khoá giả). Tạo bản clone mới: <code>git clone --no-local ../thu-git-server.git ../thu-git-sach</code>, <code>cd ../thu-git-sach</code>, rồi <code>git filter-repo --sensitive-data-removal --invert-paths --path .env</code>. Chép mã băm "First Changed Commit" ra một chỗ.</li><li>Kiểm rồi mới công bố: <code>git log -S"sk_live_" --oneline --all</code> phải không in gì; rồi <code>git push --force --mirror origin</code>.</li><li>Quay về <code>thu-git</code> cũ và chạy <code>git pull</code>. Đọc lỗi, rồi coi <code>thu-git</code> như bản clone cũ của một bạn cùng nhóm: từ giờ làm việc trong <code>thu-git-sach</code> (hoặc xoá đi và clone lại).</li></ol>
<pre><code class="language-bash">git pull                              <span class="tok-comment"># trong bản clone CŨ — output thật từ kho thử</span>
fatal: Need to specify how to reconcile divergent branches.</code></pre>
<p><strong>Đạt khi:</strong> phép tìm <code>-S</code> trống trơn trong bản đã dọn, <code>git log --oneline</code> ở đó cho mã băm khác bản clone cũ ở mọi commit từ chỗ lộ trở đi, và bạn giải thích được vì sao bản clone cũ không được push thêm lần nào nữa.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rotate / revoke</span><span class="v">Xoay / thu hồi khoá — vô hiệu hoá chứng chỉ bị lộ ở nhà cung cấp và cấp cái mới. Bước duy nhất thật sự dập được nguy hiểm.</span></div>
  <div class="kv"><span class="k">git filter-repo</span><span class="v">Công cụ lọc lại kho — thứ dự án Git khuyên dùng để viết lại cả lịch sử (gỡ file, thay chữ, đổi email). Cài riêng.</span></div>
  <div class="kv"><span class="k">--invert-paths --path</span><span class="v">Đảo đường dẫn — "giữ mọi thứ TRỪ đường dẫn này": file biến khỏi mọi commit từng chứa nó.</span></div>
  <div class="kv"><span class="k">Fresh clone / mirror clone</span><span class="v">Bản clone mới / bản clone gương — clone chưa có việc gì trên đó; <code>--mirror</code> chép mọi ref. filter-repo từ chối chạy chỗ khác để lỡ tay cũng không mất gì.</span></div>
  <div class="kv"><span class="k">Unreachable commit</span><span class="v">Commit không với tới được — không nhánh hay tag nào trỏ tới. Vẫn được lưu, vẫn xem được bằng mã băm đầy đủ, cho tới khi bị thu gom rác.</span></div>
  <div class="kv"><span class="k">Push protection</span><span class="v">Chặn khi push — tính năng quét bí mật của GitHub chặn lần push chứa một bí mật nhận ra được; bật sẵn khi push lên kho công khai.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Bí mật đã lên GitHub là bí mật đã lộ: xoay khoá trước, mọi thứ khác là dọn dẹp.</li><li>Xoá dòng trong một commit mới vẫn để khoá nằm trong commit cũ; <code>git log -S</code> và <code>git grep -E … $(git rev-list --all)</code> tìm ra mọi bản sao.</li><li><code>git filter-repo</code> trên bản clone mới viết lại mọi commit từ commit bẩn đầu tiên, nên mọi mã băm phía sau đều đổi.</li><li>Sau <code>git push --force --mirror</code>, cả nhóm clone lại; việc cứu ra thì cherry-pick sang và xoá nhánh cứu hộ trước khi ai đó push.</li><li>Máy chủ, fork và ref của pull request vẫn có thể giữ commit cũ — chỉ GitHub Support dọn được, và đó là lý do xoay khoá đi đầu tiên.</li></ul>

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
      description: 'Mười tình huống thật về viết lại lịch sử: amend chưa push và đã push, stale info, bẫy IDE tự fetch và --force-if-includes, cứu commit bị force-push đè, khoá API bị lộ, git grep thiếu -E, và bạn cùng nhóm có bản clone cũ sau filter-repo.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from real group work. Most are decided by one question: <em>does anyone else already have the old hashes?</em> The two that matter most in practice are why rotation comes before history cleaning, and what quietly breaks <code>--force-with-lease</code>. Read every explanation after submitting.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain why <code>git commit --amend</code> changes the hash, and find the old commit in the reflog.</li>
<li>I check <code>git log --oneline @{u}..HEAD</code> before amending instead of guessing whether I pushed.</li>
<li>I have produced <code>(stale info)</code> with <code>--force-with-lease</code> and <code>(remote ref updated since checkout)</code> with <code>--force-if-includes</code> in my playground.</li>
<li>I know what to do after a rejection: fetch, read, rebase, push again.</li>
<li>I can list the six steps for a leaked key in order, starting with rotation.</li>
<li>I have removed a fake <code>.env</code> from every commit with <code>git filter-repo</code> and confirmed it with <code>git log -S</code>.</li>
</ul>
${slide('git-08', 17, 'Bảng tra nhanh Chương 8')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ việc nhóm thật. Phần lớn được quyết định bởi một câu hỏi: <em>đã có ai khác đang giữ mã băm cũ chưa?</em> Hai điều quan trọng nhất trong việc thật là vì sao xoay khoá đi trước dọn lịch sử, và cái gì lặng lẽ làm hỏng <code>--force-with-lease</code>. Đọc mọi phần giải thích sau khi nộp.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được vì sao <code>git commit --amend</code> đổi mã băm, và tìm được commit cũ trong reflog.</li>
<li>Tôi kiểm <code>git log --oneline @{u}..HEAD</code> trước khi amend thay vì đoán mình đã push chưa.</li>
<li>Tôi đã tự tạo ra <code>(stale info)</code> với <code>--force-with-lease</code> và <code>(remote ref updated since checkout)</code> với <code>--force-if-includes</code> trong sân tập.</li>
<li>Tôi biết làm gì sau lời từ chối: fetch, đọc, rebase, push lại.</li>
<li>Tôi kể được sáu bước xử lý khoá bị lộ theo đúng thứ tự, bắt đầu bằng xoay khoá.</li>
<li>Tôi đã gỡ một file <code>.env</code> giả khỏi mọi commit bằng <code>git filter-repo</code> và xác nhận bằng <code>git log -S</code>.</li>
</ul>
${slide('git-08', 17, 'Bảng tra nhanh Chương 8')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You fixed a typo with git commit --amend (not pushed yet). git log now shows 986cfd4 where you remember b9e574e. What happened to b9e574e?|||Bạn sửa lỗi chính tả bằng git commit --amend (chưa push). git log giờ hiện 986cfd4 chỗ bạn nhớ là b9e574e. Chuyện gì đã xảy ra với b9e574e?',
            options: [
              'Git edited b9e574e in place and then renamed it 986cfd4|||Git sửa b9e574e tại chỗ rồi đổi tên nó thành 986cfd4',
              'b9e574e was deleted immediately and cannot be recovered|||b9e574e bị xoá ngay lập tức và không lấy lại được',
              'It still exists, unreferenced; git reflog lists it as HEAD@{1}|||Nó vẫn tồn tại, không ai trỏ tới; git reflog ghi nó là HEAD@{1}',
              'Both commits are now on main, one after the other|||Cả hai commit giờ đều nằm trên main, cái này nối sau cái kia',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Commits are immutable, so amend builds a NEW commit with the same parent and moves main to it; the old one is abandoned, not deleted, and the reflog keeps it (our test showed exactly "b9e574e HEAD@{1}"). "Edited in place" is the tempting answer because it is how amend feels, but a changed hash always means a different commit. Nothing is appended either: main points at 986cfd4 only.|||VI: Commit là bất biến, nên amend dựng một commit MỚI cùng cha rồi dời main sang nó; commit cũ bị bỏ rơi chứ không bị xoá, và reflog giữ nó (kho thử in đúng "b9e574e HEAD@{1}"). "Sửa tại chỗ" là đáp án hấp dẫn vì amend cho cảm giác như vậy, nhưng mã băm đổi thì luôn là một commit khác. Cũng không có gì được nối thêm: main chỉ trỏ vào 986cfd4.',
          },
          {
            question: 'You just committed "feat(auth): add refresh token rotation" (not pushed) and realise token.config.js is missing. The message is fine. Cleanest fix?|||Bạn vừa commit "feat(auth): add refresh token rotation" (chưa push) và nhận ra thiếu token.config.js. Lời nhắn thì ổn. Cách sửa gọn nhất?',
            options: [
              'git add token.config.js, then git commit --amend --no-edit|||git add token.config.js, rồi git commit --amend --no-edit',
              'git add token.config.js, then git commit -m "add missing file"|||git add token.config.js, rồi git commit -m "thêm file còn thiếu"',
              'git reset --hard HEAD~1, then redo both files and commit again|||git reset --hard HEAD~1, rồi làm lại cả hai file và commit lại',
              'git revert HEAD, then commit both files together|||git revert HEAD, rồi commit cả hai file cùng lúc',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: The commit is still private, so fold the file into it: --amend replaces the commit and --no-edit keeps the message without opening an editor. A separate "add missing file" commit works but leaves a broken commit in history for no reason — it is the right move only once the commit is shared. reset --hard throws away the work in token.js on disk, and revert adds two noisy commits to undo something nobody else has.|||VI: Commit vẫn còn riêng tư, nên gộp file vào nó: --amend thay commit và --no-edit giữ lời nhắn, không mở trình soạn thảo. Một commit "thêm file còn thiếu" riêng thì chạy được nhưng để lại một commit hỏng trong lịch sử vô cớ — đó chỉ là nước đi đúng khi commit đã được chia sẻ. reset --hard vứt phần việc của token.js trên đĩa, còn revert nhét thêm hai commit ồn ào để huỷ thứ chưa ai có.',
          },
          {
            question: 'You amended a commit that was already on the team’s shared main. git push says "! [rejected] main -> main (non-fast-forward)". What now?|||Bạn amend một commit vốn đã nằm trên main chung của nhóm. git push báo "! [rejected] main -> main (non-fast-forward)". Giờ làm gì?',
            options: [
              'git push --force-with-lease — the lease makes it safe|||git push --force-with-lease — có lease nên an toàn',
              'git pull, then git push|||git pull, rồi git push',
              'git push --force, then tell the group chat|||git push --force, rồi báo lên nhóm chat',
              'Undo the amend to match origin/main, then fix it in a new commit|||Huỷ lần amend cho khớp origin/main, rồi sửa bằng một commit mới',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The old hash is already in your teammates’ clones, so on a shared branch the only clean fix is to go back to what the server has and add a new commit. --force-with-lease is tempting, but the lease only checks that nobody pushed after your fetch — it still rewrites history four clones already contain. git pull would merge the old and the amended commit together, leaving both versions in history.|||VI: Mã băm cũ đã nằm trong bản clone của các bạn cùng nhóm, nên trên nhánh chung cách sửa sạch duy nhất là quay về đúng thứ máy chủ đang có rồi thêm một commit mới. --force-with-lease hấp dẫn, nhưng lease chỉ kiểm rằng không ai push sau lần fetch của bạn — nó vẫn viết lại lịch sử mà bốn bản clone đang giữ. git pull sẽ merge commit cũ và bản amend lại với nhau, để cả hai phiên bản nằm trong lịch sử.',
          },
          {
            question: 'You rebased feature/login onto main. git push --force-with-lease prints "! [rejected] feature/login -> feature/login (stale info)". What does it mean?|||Bạn rebase feature/login lên main. git push --force-with-lease in ra "! [rejected] feature/login -> feature/login (stale info)". Nghĩa là gì?',
            options: [
              'The server is temporarily unavailable; retry with --force|||Máy chủ tạm thời không truy cập được; thử lại với --force',
              'Someone pushed since your last fetch: fetch, read, rebase onto it, push again|||Có người push sau lần fetch cuối của bạn: fetch, đọc, rebase lên đó, push lại',
              'The branch is protected and you need admin rights|||Nhánh được bảo vệ và bạn cần quyền admin',
              'Your branch is behind main; run git pull origin main|||Nhánh của bạn tụt sau main; chạy git pull origin main',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: "Stale info" means the server’s branch is no longer where your origin/feature/login says — a teammate pushed and you have not seen it. The rejection is the information. Retrying with --force is exactly the damage the lease prevents: in our test it printed "+ 8342020...299ab8e (forced update)" and An’s commit vanished. Protection errors look different ("protected branch"), and being behind main has nothing to do with this branch’s server state.|||VI: "Stale info" nghĩa là nhánh trên máy chủ không còn ở chỗ origin/feature/login của bạn nói — một bạn cùng nhóm đã push mà bạn chưa thấy. Lời từ chối chính là thông tin. Thử lại bằng --force là gây đúng thiệt hại mà lease sinh ra để chặn: trong kho thử nó in "+ 8342020...299ab8e (forced update)" và commit của An biến mất. Lỗi bảo vệ nhánh trông khác ("protected branch"), còn tụt sau main chẳng liên quan gì tới trạng thái nhánh này trên máy chủ.',
          },
          {
            question: 'VS Code has git.autofetch on. You rewrite feature/login, run git push --force-with-lease, it succeeds — and An’s commit from 10 minutes ago is gone. Why did the lease not stop it?|||VS Code đang bật git.autofetch. Bạn viết lại feature/login, chạy git push --force-with-lease, lệnh thành công — và commit An đẩy lên 10 phút trước biến mất. Vì sao lease không chặn?',
            options: [
              'Auto-fetch also rewrote your local feature/login branch|||Tự fetch cũng viết lại nhánh feature/login cục bộ của bạn',
              '--force-with-lease is ignored while an IDE is open|||--force-with-lease bị bỏ qua khi đang mở IDE',
              'The lease checks origin/feature/login, which the background fetch had already moved|||Lease so với origin/feature/login, thứ lần fetch nền đã dời đi mất rồi',
              'The lease only protects main, not feature branches|||Lease chỉ bảo vệ main, không bảo vệ nhánh tính năng',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: The lease is a comparison between the server and your remote-tracking ref. A background fetch updates that ref without you reading the new commits, so the comparison becomes "server vs server" and passes. Fetch never touches your local branch — that is why the first option is wrong, and why your rewrite still lacked An’s commit. The lease works on any branch and does not know what an IDE is.|||VI: Lease là phép so giữa máy chủ và ref theo dõi từ xa của bạn. Một lần fetch nền cập nhật ref đó mà bạn chưa đọc commit mới, nên phép so thành "máy chủ so với máy chủ" và đi qua. Fetch không bao giờ đụng vào nhánh cục bộ — đó là lý do phương án đầu sai, và cũng là lý do bản viết lại của bạn vẫn thiếu commit của An. Lease chạy trên mọi nhánh và chẳng biết IDE là gì.',
          },
          {
            question: 'Which change makes the push in the previous question refuse instead of overwrite?|||Thay đổi nào khiến lần push ở câu trước từ chối thay vì ghi đè?',
            options: [
              'Add --force-if-includes (or set push.useForceIfIncludes true once)|||Thêm --force-if-includes (hoặc đặt push.useForceIfIncludes true một lần)',
              'git config fetch.prune true|||git config fetch.prune true',
              'Write the lease explicitly: --force-with-lease=feature/login|||Viết lease tường minh: --force-with-lease=feature/login',
              'Add --atomic to the push|||Thêm --atomic vào lệnh push',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: --force-if-includes also requires that the tip of origin/feature/login is part of your branch or its reflog; a fetch you never integrated fails that, and our test printed "(remote ref updated since checkout)". Naming the ref in --force-with-lease=feature/login looks stricter, but without an explicit expected hash it still compares against the same, already-updated tracking ref. fetch.prune only deletes stale tracking branches, and --atomic is about pushing several refs all-or-nothing.|||VI: --force-if-includes đòi thêm rằng đỉnh origin/feature/login đã nằm trong nhánh bạn hoặc reflog của nó; một lần fetch chưa tích hợp thì trượt, và kho thử in ra "(remote ref updated since checkout)". Ghi tên ref trong --force-with-lease=feature/login trông chặt hơn, nhưng không kèm mã băm kỳ vọng thì nó vẫn so với đúng cái ref theo dõi đã bị cập nhật. fetch.prune chỉ xoá nhánh theo dõi đã chết, còn --atomic là push nhiều ref theo kiểu được cả hoặc không gì.',
          },
          {
            question: 'Your teammate force-pushed feature/login; your git fetch shows "+ 8342020...299ab8e (forced update)" and 8342020 is your commit, still in your clone. Best recovery?|||Bạn cùng nhóm force-push đè feature/login; git fetch của bạn hiện "+ 8342020...299ab8e (forced update)" và 8342020 là commit của bạn, vẫn còn trong bản clone. Cách cứu tốt nhất?',
            options: [
              'git reset --hard origin/feature/login and redo the work|||git reset --hard origin/feature/login rồi làm lại',
              'git push --force to put your version back on the server|||git push --force để đặt lại phiên bản của bạn lên máy chủ',
              'git pull (merge) and push the merge commit|||git pull (merge) rồi push commit merge',
              'git rebase origin/feature/login, then a normal git push|||git rebase origin/feature/login, rồi git push thường',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Rebasing replays your work onto the new history; Git skips commits whose changes are already there ("skipped previously applied commit") and the push becomes a fast-forward — in our test "299ab8e..39313e2", no + sign. Forcing your version back is tempting but just overwrites your teammate in turn. A merge keeps both the old and the rewritten copies of the same commits side by side, and reset --hard throws away the one copy you still have.|||VI: Rebase phát lại việc của bạn lên lịch sử mới; Git bỏ qua commit có thay đổi đã có sẵn ("skipped previously applied commit") và lần push trở thành tua thẳng — trong kho thử là "299ab8e..39313e2", không có dấu +. Ép phiên bản của bạn trở lại thì hấp dẫn nhưng chỉ là tới lượt bạn ghi đè bạn cùng nhóm. Merge giữ cả bản cũ lẫn bản đã viết lại của cùng những commit đó nằm cạnh nhau, còn reset --hard vứt đúng bản sao duy nhất bạn đang giữ.',
          },
          {
            question: 'Ten minutes ago you pushed a Stripe live key (.env) to a public GitHub repo for your SWP391 project. What is step one?|||Mười phút trước bạn push một khoá Stripe thật (.env) lên kho GitHub công khai của đồ án SWP391. Bước một là gì?',
            options: [
              'Run git filter-repo to remove .env from every commit|||Chạy git filter-repo để gỡ .env khỏi mọi commit',
              'Revoke the key in the Stripe dashboard and issue a new one|||Thu hồi khoá trong trang quản trị Stripe và cấp khoá mới',
              'Switch the repository to private|||Chuyển kho sang riêng tư',
              'Delete .env, add it to .gitignore and commit|||Xoá .env, thêm vào .gitignore rồi commit',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Bots scan public GitHub continuously, so a key that was public for ten minutes must be treated as stolen; only revoking it removes the danger, and GitHub’s own guide puts rotation first. filter-repo is the right tool, but at step 4 — cleaning history while the key still works is theatre. Going private does not un-copy anything, and deleting the file leaves the key in the old commit (git show HEAD~1:.env still prints it).|||VI: Bot quét GitHub công khai liên tục, nên một khoá đã công khai mười phút phải coi như đã bị lấy; chỉ thu hồi nó mới dập được nguy hiểm, và chính hướng dẫn của GitHub đặt việc xoay khoá lên đầu. filter-repo là đúng công cụ, nhưng ở bước 4 — dọn lịch sử khi khoá vẫn còn dùng được chỉ là diễn kịch. Chuyển riêng tư không thu hồi được bản sao nào, còn xoá file thì khoá vẫn nằm trong commit cũ (git show HEAD~1:.env vẫn in ra).',
          },
          {
            question: 'git grep -n "AKIA[0-9A-Z]{16}" $(git rev-list --all) prints nothing, yet s3.js in an old commit clearly contains AKIAIOSFODNN7EXAMPLE. Why?|||git grep -n "AKIA[0-9A-Z]{16}" $(git rev-list --all) không in gì, dù s3.js trong một commit cũ rõ ràng chứa AKIAIOSFODNN7EXAMPLE. Vì sao?',
            options: [
              'git rev-list --all skips commits that are already pushed|||git rev-list --all bỏ qua các commit đã push',
              'git grep only searches the working directory|||git grep chỉ tìm trong thư mục làm việc',
              'Without -E, {16} is basic regex and matches literally|||Thiếu -E, {16} là regex cơ bản, bị khớp như chữ thường',
              'The key was already removed by a later commit|||Khoá đã bị một commit sau đó gỡ đi',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: In basic regular expressions the braces are ordinary characters, so the pattern looks for the text "{16}". With -E the same search listed the key in three commits of our test repository. The last option is the dangerous misreading: a later commit removing the line does not remove it from older commits, which is the whole point of searching every commit. rev-list --all covers every commit reachable from any ref, pushed or not, and passing commits makes git grep search those trees rather than the working directory.|||VI: Trong regex cơ bản, dấu ngoặc nhọn là ký tự thường, nên mẫu đi tìm đúng chuỗi "{16}". Có -E thì cùng phép tìm đó liệt kê khoá ở ba commit của kho thử. Phương án cuối là cách hiểu nguy hiểm: một commit sau gỡ dòng đó không gỡ nó khỏi các commit cũ hơn — đó chính là lý do phải tìm trong mọi commit. rev-list --all bao mọi commit với tới được từ mọi ref, đã push hay chưa, và khi truyền commit vào thì git grep tìm trong cây của chúng chứ không tìm trong thư mục làm việc.',
          },
          {
            question: 'After filter-repo and git push --force --mirror, Bình’s old clone (with one unpushed commit) fails on git pull: "Need to specify how to reconcile divergent branches". What should he do?|||Sau filter-repo và git push --force --mirror, bản clone cũ của Bình (có một commit chưa push) lỗi khi git pull: "Need to specify how to reconcile divergent branches". Bạn ấy nên làm gì?',
            options: [
              'Save his commit, re-clone, cherry-pick it across, delete the rescue branch|||Cứu commit của mình, clone lại, cherry-pick sang, xoá nhánh cứu hộ',
              'git pull --no-rebase to merge, fix the conflict, then git push|||git pull --no-rebase để merge, gỡ xung đột, rồi git push',
              'git push --force-with-lease — the lease protects the cleaned history|||git push --force-with-lease — lease sẽ bảo vệ lịch sử đã dọn',
              'git push --force from his clone so the server matches his work|||git push --force từ bản clone của mình để máy chủ khớp với việc của bạn ấy',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Bình’s clone still contains the old commits with the key, so anything that joins it to the server puts the key back — GitHub’s guide calls this recontamination. We tried the merge: git pull --no-rebase stopped on a conflict in s3.js, and finishing it would make the old commits (723ea29 included) ancestors of whatever he pushes next. The --force-with-lease option is the tempting one, but his pull has just fetched, so the lease passes and uploads the dirty history over the clean one. Re-cloning and moving only his own commit is the safe path, and the rescue branch must be deleted afterwards: in our test it made git log -S find 723ea29 in the new clone. (GitHub’s guide also allows rebasing, not merging, branches made from the old history — slower to get right for a beginner.)|||VI: Bản clone của Bình vẫn chứa các commit cũ có khoá, nên mọi thứ nối nó với máy chủ đều đưa khoá trở lại — hướng dẫn của GitHub gọi đây là “tái nhiễm”. Kho thử đã thử merge: git pull --no-rebase dừng ở xung đột trong s3.js, và merge xong thì các commit cũ (có cả 723ea29) thành tổ tiên của mọi thứ bạn ấy push tiếp theo. Phương án --force-with-lease là cái bẫy hấp dẫn nhất: lệnh pull vừa fetch xong, nên lease đi qua và đẩy lịch sử bẩn đè lên bản đã dọn. Clone lại và chỉ chuyển commit của riêng mình là đường an toàn, và nhánh cứu hộ phải xoá ngay sau đó: trong kho thử nó vẫn khiến git log -S tìm ra 723ea29 trong bản clone mới. (Hướng dẫn của GitHub cũng cho phép rebase, không merge, các nhánh dựng từ lịch sử cũ — khó làm đúng hơn với người mới.)',
          },
        ],
      },
    },
  ],
};
