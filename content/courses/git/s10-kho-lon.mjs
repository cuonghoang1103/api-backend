/**
 * Git & GitHub — Chương 10: Kho mã lớn & quy trình nâng cao.
 * worktree · submodule vs subtree · sparse-checkout + partial clone · Git LFS + monorepo · quiz.
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out đóng bằng </div> (KHÔNG </code></pre>). KHÔNG dùng <svg>.
 * Phần chèn thêm 09/2026 (slide git-10, 🧪/🗂/📌, quiz mới): output chạy thật git 2.51.1 + git-lfs 3.7.1
 * trong kho thử scratchpad/ch10-lab (lab.sh, practice.sh).
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 10 — Big repositories & advanced workflows|||Chương 10 — Kho mã lớn & quy trình nâng cao',
  description: 'Những công cụ bạn cần khi một kho mã không còn vừa với mô hình "một thư mục, một nhánh": nhiều thư mục làm việc cùng lúc, ghép nhiều kho lại với nhau, chỉ lấy về phần bạn cần, và xử lý file nhị phân lớn.',
  lessons: [
    /* ─────────────────────────── 10.0 ─────────────────────────── */
    {
      title: '10.0 — Chapter 10 slides: big repositories in pictures|||10.0 — Slide Chương 10: kho mã lớn bằng hình',
      slug: 'git-10-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 18 slide của Chương 10: worktree (một .git, nhiều thư mục), submodule là con trỏ gitlink còn subtree chép mã vào, bẫy push sai thứ tự, partial clone + sparse-checkout đo bằng số thật, và Git LFS con trỏ so với file thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Slides</span>
<h2>The whole chapter in 18 slides</h2>
<p class="lead">This chapter is about repositories that no longer fit "one folder, one branch": two branches open at once, one repository inside another, a monorepo you only need a slice of, and binary files Git was never built for. Each of those is a picture — which directory points at which <code>.git</code>, which commit a submodule pins, which bytes live in Git and which live on the LFS server.</p>
<p>Every terminal on these slides is real output from a test repository (git 2.51.1, git-lfs 3.7.1): a SWP391-style project <code>do-an-swp</code>, a shared <code>ui-kit</code> library kept as a local bare repository, a five-package monorepo, and a design repository with a 5 MB <code>.psd</code>. The hashes match from slide to slide — the <code>da584d6</code> commit that breaks a teammate’s clone on slide 8 is the same one the subtree pulls in on slide 9. The slides are in Vietnamese; the diagrams read the same in any language. The last three slides are a "measure first" decision table, a cheat sheet and a 40-minute practice session.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Slide</span>
<h2>Cả chương trong 18 slide</h2>
<p class="lead">Chương này nói về những kho mã không còn vừa với kiểu "một thư mục, một nhánh": mở hai nhánh cùng lúc, đặt kho này vào trong kho kia, một monorepo mà bạn chỉ cần một lát, và file nhị phân mà Git vốn không sinh ra để chứa. Thứ nào cũng là một hình vẽ — thư mục nào trỏ vào <code>.git</code> nào, submodule ghim commit nào, byte nào nằm trong Git còn byte nào nằm trên máy chủ LFS.</p>
<p>Mọi terminal trên slide là output thật từ một kho thử (git 2.51.1, git-lfs 3.7.1): một đồ án kiểu SWP391 tên <code>do-an-swp</code>, một thư viện dùng chung <code>ui-kit</code> đặt trong một kho trần (bare) trên máy, một monorepo năm gói, và một kho thiết kế có file <code>.psd</code> 5 MB. Mã băm khớp nhau từ slide này sang slide khác — commit <code>da584d6</code> làm hỏng bản clone của bạn cùng nhóm ở slide 8 chính là commit mà subtree kéo về ở slide 9. Ba slide cuối là bảng "đo trước rồi mới chọn", bảng tra nhanh và một buổi thực hành 40 phút.</p>
</div>
${gallery('git-10', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'worktree: một .git, nhiều thư mục làm việc'], [4, 'Vá gấp mà không đụng nhánh đang làm dở'],
  [5, 'Luật của worktree: ba lỗi hay gặp'], [6, 'submodule là con trỏ gitlink (mode 160000)'], [7, 'Vòng đời submodule: dấu -, dấu cách, dấu +'],
  [8, 'Bẫy: push kho cha trước kho con'], [9, 'subtree chép mã và lịch sử vào kho'], [10, 'Submodule, subtree, gói npm hay monorepo'],
  [11, 'partial clone và sparse-checkout bằng số đo thật'], [12, 'sparse-checkout trong thực tế (cone mode)'], [13, 'Monorepo: CI chỉ chạy phần đã đổi'],
  [14, 'Git LFS: con trỏ trong Git, file thật ở kho LFS'], [15, 'LFS không có hiệu lực ngược'], [16, 'Đo trước, chọn công cụ sau'],
  [17, 'Bảng tra nhanh'], [18, 'Thực hành chương 10'],
])}
`,
    },

    /* ─────────────────────────── 10.1 ─────────────────────────── */
    {
      title: '10.1 — git worktree: several branches checked out at once|||10.1 — git worktree: nhiều nhánh cùng được checkout một lúc',
      slug: 'git-10-1-worktree',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao stash không phải câu trả lời đúng cho mọi lần bị cắt ngang, worktree cho bạn nhiều thư mục làm việc dùng chung một kho đối tượng, và các luật của nó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>One repository, several working directories</h2>
<p class="lead">A production bug arrives while your feature branch is half-built, <code>node_modules</code> is installed for that branch, and the dev server is running. <code>git stash</code> (4.5) handles the files — and it does not stop your build from being invalidated, your dev server from restarting, or your editor from losing every open tab. <code>git worktree</code> avoids all of it.</p>

<pre><code>cd ~/projects/api-backend
git worktree add ../api-hotfix main</code></pre>
<div class="out">Preparing worktree (checking out 'main')
HEAD is now at 3f8a1c9 refactor(api): extract pagination</div>
<p>You now have a second directory, <code>../api-hotfix</code>, holding <code>main</code>, while <code>~/projects/api-backend</code> still holds your feature branch untouched — same running dev server, same editor tabs, same installed dependencies.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">One object database</span><span class="lz-v">Both directories share <code>.git/objects</code>. A second worktree costs a checkout, not a clone — no re-download, no duplicated history.</span></div>
  <div class="lz-layer"><span class="lz-k">Separate index and HEAD</span><span class="lz-v">Each worktree stages and commits independently. They cannot interfere with each other.</span></div>
  <div class="lz-layer"><span class="lz-k">Shared refs</span><span class="lz-v">A commit made in one is immediately visible from the other. No push or fetch involved.</span></div>
</div>

<h3>Managing them</h3>
${slide('git-10', 4, 'Vá gấp trong worktree thứ hai, nhánh đang dở đứng yên')}
<pre><code>git worktree list</code></pre>
<div class="out">/home/an/projects/api-backend  3f8a1c9 [feature/login]
/home/an/projects/api-hotfix   9e2d4b7 [main]</div>
<pre><code>git worktree add ../api-review pr-431      <span class="tok-comment"># existing branch</span>
git worktree add -b fix/urgent ../api-fix  <span class="tok-comment"># create the branch too</span>
git worktree add --detach ../api-v14 v1.4.0 <span class="tok-comment"># a tag, detached (3.1)</span>

git worktree remove ../api-hotfix          <span class="tok-comment"># delete it (refuses if dirty)</span>
git worktree prune                          <span class="tok-comment"># clean up after deleting a folder by hand</span></code></pre>
<div class="callout warn"><strong>The same branch cannot be checked out in two worktrees.</strong> Git refuses — on git 2.51 with "fatal: 'main' is already used by worktree at …" (older versions said "is already checked out at …"). This is protection, not an inconvenience: two directories committing to one branch would produce a state neither of them expects. Use a different branch, or <code>--detach</code>.</div>

<h3>Where it genuinely helps</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hotfix during a feature</span><span class="v">The case above. No stash, no reinstall, no lost editor state.</span></div>
  <div class="kv"><span class="k">Reviewing a pull request</span><span class="v"><code>git worktree add ../review pr-431</code>, run it, delete the folder. Your own work never moves.</span></div>
  <div class="kv"><span class="k">Comparing two versions side by side</span><span class="v">Two terminals, two servers, two browser tabs — old and new behaviour at once.</span></div>
  <div class="kv"><span class="k">Long builds</span><span class="v">A Rust or C++ build that takes twenty minutes keeps its cache per directory. Switching branches in place throws that away.</span></div>
  <div class="kv"><span class="k">Documentation branches</span><span class="v">A <code>gh-pages</code> worktree that stays checked out, so publishing is a commit rather than a branch dance.</span></div>
</div>

<h3>What lives where</h3>
${slide('git-10', 3, 'Một .git dùng chung, mỗi worktree một HEAD và index')}
<pre><code>cat ../api-hotfix/.git</code></pre>
<div class="out">gitdir: /home/an/projects/api-backend/.git/worktrees/api-hotfix</div>
<p>A linked worktree has a <code>.git</code> <em>file</em>, not a directory — it points back at the main repository. Per-worktree state (HEAD, index, reflog) lives under <code>.git/worktrees/&lt;name&gt;/</code>; objects and refs stay shared. That is exactly the design that makes them cheap.</p>

<h3>Things to know before relying on it</h3>
${slide('git-10', 5, 'Luật của worktree: ba lỗi hay gặp')}
<div class="kv-grid">
  <div class="kv"><span class="k">Ignored files are not copied</span><span class="v">A new worktree has no <code>node_modules</code>, no <code>.env</code>, no build cache. You install once per worktree — still far cheaper than reinstalling on every branch switch.</span></div>
  <div class="kv"><span class="k">Deleting the folder is not enough</span><span class="v">Git keeps the administrative entry. Use <code>git worktree remove</code>, or <code>git worktree prune</code> afterwards.</span></div>
  <div class="kv"><span class="k">Stashes are shared</span><span class="v"><code>refs/stash</code> is a single ref for the whole repository, so a stash made in one worktree is visible — and poppable — in another. Surprising the first time.</span></div>
  <div class="kv"><span class="k">Submodules need initialising per worktree</span><span class="v">Run <code>git submodule update --init</code> in each one (10.2).</span></div>
</div>

<h3>A practical layout</h3>
<pre><code>~/projects/
  api-backend/          <span class="tok-comment"># main worktree — your current feature</span>
  api-main/             <span class="tok-comment"># always on main, for quick checks and hotfixes</span>
  api-review/           <span class="tok-comment"># scratch, re-pointed at whichever PR you are reviewing</span></code></pre>
<pre><code><span class="tok-comment"># Re-point the review worktree at a different pull request:</span>
cd ~/projects/api-review
git fetch origin pull/431/head:pr-431 &amp;&amp; git switch pr-431</code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In <code>thu-git</code>, on <code>main</code>, leave some unfinished work: <code>echo "dang sua do" &gt;&gt; README.md</code> — do not commit it. This is your "feature half-built" state.</li><li>A "production bug" arrives. Open a second worktree on a new branch: <code>git worktree add -b hotfix/chu-thich ../thu-git-hotfix main</code>.</li><li>Fix it there: <code>cd ../thu-git-hotfix</code>, create <code>hotfix.txt</code>, <code>git add hotfix.txt</code>, <code>git commit -m "fix: sua gap"</code>.</li><li>Go back with <code>cd ../thu-git</code> and check three things: <code>git log --oneline -1 hotfix/chu-thich</code> (the commit is already visible — no push, no fetch), <code>git status -s</code> (your README edit is untouched), and <code>git switch hotfix/chu-thich</code> (read the refusal).</li><li>Clean up properly: <code>git worktree remove ../thu-git-hotfix</code>, then <code>git worktree list</code>.</li></ol>
<pre><code class="language-bash">git worktree list          <span class="tok-comment"># real output from our test copy of thu-git; your hashes differ</span></code></pre>
<div class="out">~/thu-git         615e0f6 [main]
~/thu-git-hotfix  f342b79 [hotfix/chu-thich]</div>
<pre><code class="language-bash">git switch hotfix/chu-thich</code></pre>
<div class="out">fatal: 'hotfix/chu-thich' is already used by worktree at '~/thu-git-hotfix'</div>
<p><strong>Done when:</strong> <code>git log --oneline -1 hotfix/chu-thich</code> shows your fix from inside <code>thu-git</code>, <code>git status -s</code> there still shows <code>&nbsp;M README.md</code>, and after <code>remove</code> the list has exactly one line.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Worktree</span><span class="v">A working directory attached to a repository. Every repository has one (the main worktree); <code>git worktree add</code> creates more.</span></div>
  <div class="kv"><span class="k">Linked worktree</span><span class="v">An extra worktree. Its <code>.git</code> is a one-line file (<code>gitdir: …</code>) pointing back into the main repository.</span></div>
  <div class="kv"><span class="k">Object database</span><span class="v"><code>.git/objects</code> — every commit, tree and file version. Shared by all worktrees, which is why a new one is cheap.</span></div>
  <div class="kv"><span class="k">Per-worktree state</span><span class="v">HEAD, index and reflog, kept under <code>.git/worktrees/&lt;name&gt;/</code>. The reason two worktrees never step on each other’s staging area.</span></div>
  <div class="kv"><span class="k">Prunable</span><span class="v">Label <code>git worktree list</code> puts on an entry whose folder no longer exists. <code>git worktree prune</code> deletes such entries.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A worktree is a second working directory on the same repository — a checkout, not a clone.</li><li>Objects and refs are shared, so a commit made in one worktree is visible in the other immediately.</li><li>HEAD, index and working files are separate, so unfinished work in one directory is never disturbed by the other.</li><li>One branch can be checked out in only one worktree at a time; use another branch or <code>--detach</code>.</li><li>Remove with <code>git worktree remove</code>; if you already used <code>rm -rf</code>, run <code>git worktree prune</code>.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-worktree" target="_blank" rel="noopener">
  <span class="lc-ico">🌲</span>
  <span class="lc-body"><span class="lc-title">git-worktree — add, list, remove, prune, lock</span><span class="lc-sub">Including the "DETAILS" section on what state is per-worktree.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: hotfix in a second worktree without touching your feature</span><span class="lc-sub">A graded exercise covering add, list and remove.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> deleting a worktree directory with <code>rm -rf</code> and then being unable to check that branch out anywhere. Git still has the administrative record and believes the branch is checked out at a path that no longer exists. <code>git worktree prune</code> clears it — and <code>git worktree remove</code> avoids the situation in the first place.</div>
<p class="note-ct"><strong>When not to use it:</strong> for a two-minute interruption, <code>git stash</code> is faster. Worktrees earn their keep when the environment around the code is expensive — installed dependencies, a warm build cache, a running server, a database seeded for that branch. That is when "switch branches in place" is the expensive operation, not the checkout itself.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Một kho mã, nhiều thư mục làm việc</h2>
<p class="lead">Một lỗi production ập tới trong lúc nhánh tính năng của bạn đang dở dang, <code>node_modules</code> đã cài cho đúng nhánh đó, và dev server đang chạy. <code>git stash</code> (bài 4.5) lo được phần file — và nó không ngăn được bản dựng của bạn bị vô hiệu, dev server phải khởi động lại, hay trình soạn thảo mất sạch các tab đang mở. <code>git worktree</code> tránh được tất cả.</p>

<pre><code>cd ~/projects/api-backend
git worktree add ../api-hotfix main</code></pre>
<div class="out">Preparing worktree (checking out 'main')
HEAD is now at 3f8a1c9 refactor(api): extract pagination</div>
<p>Giờ bạn có một thư mục thứ hai, <code>../api-hotfix</code>, đang giữ <code>main</code>, trong khi <code>~/projects/api-backend</code> vẫn giữ nguyên nhánh tính năng của bạn — cùng dev server đang chạy, cùng các tab trình soạn thảo, cùng thư viện đã cài.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Một kho đối tượng duy nhất</span><span class="lz-v">Cả hai thư mục dùng chung <code>.git/objects</code>. Một worktree thứ hai tốn một lần checkout, không phải một lần clone — không tải lại, không nhân bản lịch sử.</span></div>
  <div class="lz-layer"><span class="lz-k">Index và HEAD riêng</span><span class="lz-v">Mỗi worktree staging và commit độc lập. Chúng không thể can thiệp vào nhau.</span></div>
  <div class="lz-layer"><span class="lz-k">Ref dùng chung</span><span class="lz-v">Một commit tạo ở bên này nhìn thấy được ngay từ bên kia. Không cần push hay fetch gì cả.</span></div>
</div>

<h3>Quản lý chúng</h3>
${slide('git-10', 4, 'Vá gấp trong worktree thứ hai, nhánh đang dở đứng yên')}
<pre><code>git worktree list</code></pre>
<div class="out">/home/an/projects/api-backend  3f8a1c9 [feature/login]
/home/an/projects/api-hotfix   9e2d4b7 [main]</div>
<pre><code>git worktree add ../api-review pr-431      <span class="tok-comment"># nhánh đã có</span>
git worktree add -b fix/urgent ../api-fix  <span class="tok-comment"># tạo luôn cả nhánh</span>
git worktree add --detach ../api-v14 v1.4.0 <span class="tok-comment"># một tag, ở dạng lìa cành (bài 3.1)</span>

git worktree remove ../api-hotfix          <span class="tok-comment"># xoá nó (từ chối nếu còn thay đổi)</span>
git worktree prune                          <span class="tok-comment"># dọn sau khi bạn xoá thư mục bằng tay</span></code></pre>
<div class="callout warn"><strong>Cùng một nhánh KHÔNG checkout được ở hai worktree.</strong> Git từ chối — ở git 2.51 là "fatal: 'main' is already used by worktree at …" (bản cũ hơn in "is already checked out at …"). Đây là sự bảo vệ, không phải sự phiền phức: hai thư mục cùng commit lên một nhánh sẽ sinh ra một trạng thái mà không bên nào lường được. Hãy dùng nhánh khác, hoặc <code>--detach</code>.</div>

<h3>Chỗ nó thật sự giúp được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hotfix giữa lúc làm tính năng</span><span class="v">Đúng tình huống ở trên. Không stash, không cài lại, không mất trạng thái trình soạn thảo.</span></div>
  <div class="kv"><span class="k">Review một pull request</span><span class="v"><code>git worktree add ../review pr-431</code>, chạy thử, rồi xoá thư mục. Công việc của bạn không hề nhúc nhích.</span></div>
  <div class="kv"><span class="k">So hai phiên bản cạnh nhau</span><span class="v">Hai terminal, hai server, hai tab trình duyệt — hành vi cũ và mới cùng lúc.</span></div>
  <div class="kv"><span class="k">Bản dựng lâu</span><span class="v">Một bản dựng Rust hay C++ mất hai mươi phút giữ được cache riêng cho từng thư mục. Đổi nhánh tại chỗ là vứt cache đó đi.</span></div>
  <div class="kv"><span class="k">Nhánh tài liệu</span><span class="v">Một worktree <code>gh-pages</code> luôn ở trạng thái checkout, nên việc xuất bản chỉ là một commit thay vì một màn nhảy nhánh.</span></div>
</div>

<h3>Cái gì nằm ở đâu</h3>
${slide('git-10', 3, 'Một .git dùng chung, mỗi worktree một HEAD và index')}
<pre><code>cat ../api-hotfix/.git</code></pre>
<div class="out">gitdir: /home/an/projects/api-backend/.git/worktrees/api-hotfix</div>
<p>Một worktree liên kết có <code>.git</code> là một <em>FILE</em>, không phải thư mục — nó trỏ ngược về kho chính. Trạng thái riêng của từng worktree (HEAD, index, reflog) nằm dưới <code>.git/worktrees/&lt;tên&gt;/</code>; còn đối tượng và ref thì dùng chung. Đó chính là thiết kế làm cho chúng rẻ.</p>

<h3>Những thứ cần biết trước khi dựa vào nó</h3>
${slide('git-10', 5, 'Luật của worktree: ba lỗi hay gặp')}
<div class="kv-grid">
  <div class="kv"><span class="k">File bị ignore không được chép sang</span><span class="v">Một worktree mới không có <code>node_modules</code>, không có <code>.env</code>, không có cache build. Bạn cài một lần cho mỗi worktree — vẫn rẻ hơn nhiều so với cài lại ở mỗi lần đổi nhánh.</span></div>
  <div class="kv"><span class="k">Xoá thư mục là chưa đủ</span><span class="v">Git vẫn giữ bản ghi hành chính. Hãy dùng <code>git worktree remove</code>, hoặc <code>git worktree prune</code> sau đó.</span></div>
  <div class="kv"><span class="k">Stash dùng chung</span><span class="v"><code>refs/stash</code> là một ref duy nhất cho cả kho mã, nên một stash tạo ở worktree này nhìn thấy được — và pop được — ở worktree kia. Lần đầu gặp thì khá bất ngờ.</span></div>
  <div class="kv"><span class="k">Submodule phải khởi tạo cho từng worktree</span><span class="v">Chạy <code>git submodule update --init</code> ở mỗi cái (bài 10.2).</span></div>
</div>

<h3>Một cách bố trí thực tế</h3>
<pre><code>~/projects/
  api-backend/          <span class="tok-comment"># worktree chính — tính năng bạn đang làm</span>
  api-main/             <span class="tok-comment"># luôn ở main, để kiểm nhanh và vá gấp</span>
  api-review/           <span class="tok-comment"># chỗ nháp, trỏ lại sang PR nào bạn đang review</span></code></pre>
<pre><code><span class="tok-comment"># Trỏ worktree review sang một pull request khác:</span>
cd ~/projects/api-review
git fetch origin pull/431/head:pr-431 &amp;&amp; git switch pr-431</code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong <code>thu-git</code>, đang ở <code>main</code>, để lại một việc dở dang: <code>echo "dang sua do" &gt;&gt; README.md</code> — KHÔNG commit. Đây là trạng thái "tính năng đang làm dở".</li><li>Một "lỗi production" ập tới. Mở worktree thứ hai trên một nhánh mới: <code>git worktree add -b hotfix/chu-thich ../thu-git-hotfix main</code>.</li><li>Vá ở bên đó: <code>cd ../thu-git-hotfix</code>, tạo <code>hotfix.txt</code>, <code>git add hotfix.txt</code>, <code>git commit -m "fix: sua gap"</code>.</li><li>Quay lại bằng <code>cd ../thu-git</code> và kiểm ba thứ: <code>git log --oneline -1 hotfix/chu-thich</code> (commit đã thấy được — không push, không fetch), <code>git status -s</code> (phần sửa README vẫn nguyên), và <code>git switch hotfix/chu-thich</code> (đọc lời từ chối).</li><li>Dọn cho đúng cách: <code>git worktree remove ../thu-git-hotfix</code>, rồi <code>git worktree list</code>.</li></ol>
<pre><code class="language-bash">git worktree list          <span class="tok-comment"># output thật từ bản sao thu-git của kho thử; mã băm của bạn sẽ khác</span></code></pre>
<div class="out">~/thu-git         615e0f6 [main]
~/thu-git-hotfix  f342b79 [hotfix/chu-thich]</div>
<pre><code class="language-bash">git switch hotfix/chu-thich</code></pre>
<div class="out">fatal: 'hotfix/chu-thich' is already used by worktree at '~/thu-git-hotfix'</div>
<p><strong>Đạt khi:</strong> đứng trong <code>thu-git</code> mà <code>git log --oneline -1 hotfix/chu-thich</code> vẫn in ra commit vá của bạn, <code>git status -s</code> ở đó vẫn là <code>&nbsp;M README.md</code>, và sau <code>remove</code> danh sách chỉ còn đúng một dòng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Worktree</span><span class="v">Cây làm việc — một thư mục làm việc gắn với một kho mã. Kho nào cũng có một cái (worktree chính); <code>git worktree add</code> tạo thêm.</span></div>
  <div class="kv"><span class="k">Linked worktree</span><span class="v">Worktree liên kết — worktree tạo thêm. <code>.git</code> của nó là một file một dòng (<code>gitdir: …</code>) trỏ ngược về kho chính.</span></div>
  <div class="kv"><span class="k">Object database</span><span class="v">Kho đối tượng — <code>.git/objects</code>, chứa mọi commit, tree và phiên bản file. Mọi worktree dùng chung, nên tạo thêm một cái rất rẻ.</span></div>
  <div class="kv"><span class="k">Per-worktree state</span><span class="v">Trạng thái riêng từng worktree — HEAD, index và reflog, nằm dưới <code>.git/worktrees/&lt;tên&gt;/</code>. Nhờ vậy hai worktree không bao giờ giẫm lên vùng staging của nhau.</span></div>
  <div class="kv"><span class="k">Prunable</span><span class="v">Có thể dọn — nhãn mà <code>git worktree list</code> gắn cho một mục có thư mục đã biến mất. <code>git worktree prune</code> xoá những mục đó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Worktree là một thư mục làm việc thứ hai trên cùng một kho — một lần checkout, không phải một lần clone.</li><li>Đối tượng và ref dùng chung, nên commit tạo ở worktree này thấy ngay ở worktree kia.</li><li>HEAD, index và file làm việc thì riêng, nên việc dở ở thư mục này không bao giờ bị thư mục kia làm xáo trộn.</li><li>Một nhánh chỉ được checkout ở một worktree tại một thời điểm; cần thì dùng nhánh khác hoặc <code>--detach</code>.</li><li>Xoá bằng <code>git worktree remove</code>; lỡ <code>rm -rf</code> rồi thì chạy <code>git worktree prune</code>.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-worktree" target="_blank" rel="noopener">
  <span class="lc-ico">🌲</span>
  <span class="lc-body"><span class="lc-title">git-worktree — add, list, remove, prune, lock</span><span class="lc-sub">Gồm cả mục "DETAILS" nói trạng thái nào là riêng của từng worktree.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: vá gấp trong một worktree thứ hai mà không đụng vào tính năng</span><span class="lc-sub">Bài tập chấm điểm phủ add, list và remove.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> xoá thư mục worktree bằng <code>rm -rf</code> rồi sau đó không checkout được cái nhánh đó ở đâu nữa. Git vẫn giữ bản ghi hành chính và tin rằng nhánh đó đang được checkout tại một đường dẫn không còn tồn tại. <code>git worktree prune</code> xoá bản ghi đó — và <code>git worktree remove</code> thì tránh hẳn tình huống ngay từ đầu.</div>
<p class="note-ct"><strong>Khi nào KHÔNG nên dùng:</strong> với một lần gián đoạn hai phút, <code>git stash</code> nhanh hơn. Worktree trả công khi cái môi trường quanh mã nguồn là thứ đắt đỏ — thư viện đã cài, cache build còn nóng, một server đang chạy, một database đã gieo dữ liệu cho đúng nhánh đó. Đó là lúc "đổi nhánh tại chỗ" mới là thao tác đắt, chứ không phải bản thân việc checkout.</p>
</div>
`,
    },

    /* ─────────────────────────── 10.2 ─────────────────────────── */
    {
      title: '10.2 — Submodules vs subtree: repositories inside repositories|||10.2 — Submodule vs subtree: kho mã bên trong kho mã',
      slug: 'git-10-2-submodule-subtree',
      type: 'LESSON',
      description: 'Submodule ghim một commit của kho khác và vì sao nó gây bực mình, subtree nhúng thẳng mã vào, bảng so sánh thẳng thắn, và khi nào câu trả lời đúng là "đừng dùng cả hai".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>Two ways to put one repository inside another</h2>
<p class="lead">You have a shared component library and three applications that use it. Git offers two mechanisms, they behave very differently, and both have a reputation for pain. This lesson explains what each actually does, so you can pick — or decline both, which is often correct.</p>

<h3>Submodule — a pinned pointer</h3>
${slide('git-10', 6, 'submodule là con trỏ gitlink (mode 160000)')}
<pre><code>git submodule add https://github.com/cuonghoang1103/ui-kit.git vendor/ui-kit
git commit -m <span class="tok-string">"chore: add ui-kit as a submodule"</span></code></pre>
<pre><code>cat .gitmodules</code></pre>
<div class="out">[submodule "vendor/ui-kit"]
	path = vendor/ui-kit
	url = https://github.com/cuonghoang1103/ui-kit.git</div>
<pre><code>git ls-files --stage vendor/ui-kit</code></pre>
<div class="out">160000 a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e 0	vendor/ui-kit</div>
<div class="callout ok">Mode <strong>160000</strong> is the giveaway: it is not a blob and not a tree, it is a <em>gitlink</em> — a pointer to one specific commit in another repository. Your repository stores forty characters, not the library's code. That is the whole design, and every quirk below follows from it.</div>

<h3>The commands you must remember</h3>
${slide('git-10', 7, 'Vòng đời submodule: dấu -, dấu cách, dấu +')}
<pre><code>git clone --recurse-submodules &lt;url&gt;        <span class="tok-comment"># clone and fill them in</span>
git submodule update --init --recursive      <span class="tok-comment"># after a normal clone</span>
git submodule update --remote                <span class="tok-comment"># move the pin to the submodule's latest</span>
git submodule status</code></pre>
<div class="out">+a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e vendor/ui-kit (v2.1.0-3-ga7c2f91)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">-hash</span><span class="v">Not initialised. The directory is empty and the build will fail with a confusing "module not found".</span></div>
  <div class="kv"><span class="k">&nbsp;hash</span><span class="v">Checked out at the pinned commit. Correct state.</span></div>
  <div class="kv"><span class="k">+hash</span><span class="v">Checked out at a <em>different</em> commit than pinned — someone worked inside it, or ran <code>--remote</code>. Commit the new pin or reset.</span></div>
</div>
<pre><code><span class="tok-comment"># Make recursion automatic and stop half the problems:</span>
git config --global submodule.recurse true</code></pre>

<h3>Why submodules have their reputation</h3>
${slide('git-10', 8, 'Bẫy: push kho cha trước kho con')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">A plain clone gives empty folders</span><span class="lz-v">Forget <code>--recurse-submodules</code> and the build fails in a way that never mentions submodules. Every new team member hits this once.</span></div>
  <div class="lz-layer"><span class="lz-k">The pin does not follow branches</span><span class="lz-v">A submodule tracks a <em>commit</em>, not a branch. New upstream work never arrives until someone runs <code>--remote</code> and commits the new pin.</span></div>
  <div class="lz-layer"><span class="lz-k">Detached HEAD inside</span><span class="lz-v">The submodule is checked out at a commit, so editing there commits to nowhere unless you <code>git switch main</code> first (3.1).</span></div>
  <div class="lz-layer"><span class="lz-k">Two pushes, in order</span><span class="lz-v">Push the submodule first, then the parent. Reverse the order and colleagues get a pin pointing at a commit that does not exist on the server.</span></div>
  <div class="lz-layer"><span class="lz-k">Merge conflicts on the gitlink</span><span class="lz-v">Two branches pinning different commits conflict on a line that is just a hash. Resolve by choosing the right commit, not by editing text.</span></div>
</div>

<h3>Subtree — the code, merged in</h3>
${slide('git-10', 9, 'subtree chép mã và lịch sử vào kho')}
<pre><code>git subtree add --prefix vendor/ui-kit \\
  https://github.com/cuonghoang1103/ui-kit.git main --squash</code></pre>
<p>This copies the library's files into <code>vendor/ui-kit/</code> as <strong>real files in your repository</strong>. Clone works normally, no extra commands, no empty folders, and someone who has never heard of subtree can work in the repository without noticing.</p>
<pre><code><span class="tok-comment"># Pull upstream changes in:</span>
git subtree pull --prefix vendor/ui-kit &lt;url&gt; main --squash

<span class="tok-comment"># Push your local changes back to the library:</span>
git subtree push --prefix vendor/ui-kit &lt;url&gt; feature/from-app</code></pre>
<div class="callout warn">The cost is repository size and history noise: the library's files live in your history forever, and every update adds a merge. <code>--squash</code> keeps it to one commit per update, which is almost always what you want. And the commands are long enough that people forget them — write them into a Makefile or a script the day you adopt subtree.</div>

<h3>Choosing</h3>
${slide('git-10', 10, 'Submodule, subtree, gói npm hay monorepo')}
<div class="kv-grid">
  <div class="kv"><span class="k">Submodule</span><span class="v">Small parent repository · exact version pinning · you also develop the dependency. Costs: everyone must learn the commands.</span></div>
  <div class="kv"><span class="k">Subtree</span><span class="v">Consumers need no special knowledge · clone just works · easy local patching. Costs: larger repository, noisier history, awkward push-back.</span></div>
  <div class="kv"><span class="k">Package manager</span><span class="v">npm, pip, Maven, Go modules. Versioned, cached, no Git tricks. <strong>The right answer most of the time.</strong></span></div>
  <div class="kv"><span class="k">Monorepo</span><span class="v">One repository with <code>packages/</code>. No cross-repository synchronisation at all — an atomic commit can change the library and its callers together.</span></div>
</div>
<div class="callout ok">Before reaching for either mechanism, ask whether a package registry solves it. Publishing <code>@cuongthai/ui-kit</code> to npm — or to a private registry — gives you versioning, caching, dependency resolution and a lockfile, none of which submodules or subtrees provide. Reach for Git-level embedding when the dependency is not publishable: a private repository you cannot host a registry for, a config repository, or a vendored fork you patch locally.</div>

<h3>Removing a submodule</h3>
<pre><code>git submodule deinit -f vendor/ui-kit
git rm -f vendor/ui-kit
rm -rf .git/modules/vendor/ui-kit
git commit -m <span class="tok-string">"chore: drop the ui-kit submodule"</span></code></pre>
<p>Four steps, and skipping the third leaves stale metadata that breaks re-adding a submodule at the same path later. This awkwardness is itself an argument for considering the alternatives first.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Make a tiny "shared library" next to your playground: <code>cd ..</code>, <code>git init --bare ui-kit.git</code>, <code>git clone ui-kit.git ui-kit-dev</code>, then inside <code>ui-kit-dev</code> commit two files (<code>button.js</code>, <code>modal.js</code>) and <code>git push -u origin HEAD</code>.</li><li>Add it to <code>thu-git</code> as a submodule and commit: <code>git -c protocol.file.allow=always submodule add ../ui-kit.git vendor/ui-kit</code>, then <code>git commit -m "chore: them ui-kit lam submodule"</code>. (The <code>-c</code> is needed only because the library is a folder on disk — since git 2.38.1 Git refuses the local <code>file</code> transport for submodules with "fatal: transport 'file' not allowed". A GitHub URL does not need it.)</li><li>Look at what was stored: <code>git ls-files --stage vendor/ui-kit</code>.</li><li>Play the teammate who forgot <code>--recurse-submodules</code>: <code>cd .. &amp;&amp; git clone thu-git thu-git-ban &amp;&amp; cd thu-git-ban</code>, run <code>git submodule status</code>, then <code>git -c protocol.file.allow=always submodule update --init</code> and run <code>status</code> again.</li><li>Compare with subtree in a fresh repository: <code>cd .. &amp;&amp; git init thu-subtree &amp;&amp; cd thu-subtree &amp;&amp; git commit --allow-empty -m init</code>, then <code>git subtree add --prefix vendor/ui-kit ../ui-kit.git main --squash</code> and <code>git ls-files --stage vendor/ui-kit</code>. (subtree needs at least one commit to merge into — hence the empty one.)</li></ol>
<pre><code class="language-bash"><span class="tok-comment"># real output from our test copy; your hashes differ</span>
git ls-files --stage vendor/ui-kit                <span class="tok-comment"># in thu-git</span></code></pre>
<div class="out">160000 0201254b40e2ee170002e3f439256cf799e54924 0	vendor/ui-kit</div>
<pre><code class="language-bash">git submodule status                              <span class="tok-comment"># in thu-git-ban, before update --init</span></code></pre>
<div class="out">-0201254b40e2ee170002e3f439256cf799e54924 vendor/ui-kit</div>
<pre><code class="language-bash">git ls-files --stage vendor/ui-kit                <span class="tok-comment"># in thu-subtree</span></code></pre>
<div class="out">100644 bd47ced8ecdf8f1f18551367542ee63c36614674 0	vendor/ui-kit/button.js
100644 d0f78bb1a3d37e25b3967b012222e76825acdd00 0	vendor/ui-kit/modal.js</div>
<p><strong>Done when:</strong> you have seen with your own eyes one entry of mode <code>160000</code> in <code>thu-git</code> versus two entries of mode <code>100644</code> in <code>thu-subtree</code>, and <code>git submodule status</code> in <code>thu-git-ban</code> went from a leading <code>-</code> to a leading space.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Submodule</span><span class="v">Another repository mounted at a path inside yours, pinned to one exact commit.</span></div>
  <div class="kv"><span class="k">Gitlink (mode 160000)</span><span class="v">The tree entry that stores that pin: a commit hash from the other repository, not a file and not a folder.</span></div>
  <div class="kv"><span class="k">.gitmodules</span><span class="v">A normal committed file that says where to fetch each submodule from (path + URL). The gitlink says which commit.</span></div>
  <div class="kv"><span class="k">Superproject</span><span class="v">The outer repository that contains submodules — here, <code>do-an-swp</code>.</span></div>
  <div class="kv"><span class="k">Subtree</span><span class="v">The other repository’s files merged into yours as ordinary files (mode 100644); <code>--squash</code> folds its history into one commit per update.</span></div>
  <div class="kv"><span class="k">Recurse submodules</span><span class="v">Make clone, pull and push also act on submodules: <code>--recurse-submodules</code>, or <code>submodule.recurse true</code> once in config.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A submodule stores a 40-character pin (gitlink, mode 160000), never the library’s code.</li><li>A plain clone leaves submodules empty (<code>-</code> in <code>submodule status</code>); <code>update --init</code> or <code>clone --recurse-submodules</code> fills them in.</li><li>Moving the pin is a change in the parent repository: <code>update --remote</code>, then <code>git add</code>, commit and push it.</li><li>Push the submodule before the parent — <code>git push --recurse-submodules=check</code> enforces it for you.</li><li>Subtree copies real files in so teammates need nothing special; a package registry beats both whenever you can publish.</li></ul>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Tools-Submodules" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 7.11 — Submodules</span><span class="lc-sub">Including the "Issues with Submodules" section, which is refreshingly honest.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-subtree" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">git-subtree — add, pull, push, split</span><span class="lc-sub"><code>split</code> is how you extract a subdirectory back into its own repository with history.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> pushing the parent repository before pushing the submodule. Your parent commit pins a submodule commit that exists only on your machine, so every colleague's <code>submodule update</code> fails — on git 2.51 with "fatal: Fetched in submodule path 'vendor/ui-kit', but it did not contain &lt;hash&gt;. Direct fetching of that commit failed." (older Git printed "fatal: reference is not a tree"), and their <code>git pull</code> aborts with "upload-pack: not our ref". Always push the submodule first. <code>git push --recurse-submodules=check</code> makes Git refuse the parent push when a pinned submodule commit is missing upstream — set it and forget the ordering rule.</div>
<p class="note-ct"><strong>The honest summary:</strong> submodules are a precise tool with a steep coordination cost, subtrees trade repository size for everyone else's convenience, and a package manager beats both whenever it is available. Choose deliberately, write the commands down for your team, and revisit the decision when the dependency becomes publishable.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Hai cách đặt một kho mã vào bên trong kho mã khác</h2>
<p class="lead">Bạn có một thư viện thành phần dùng chung và ba ứng dụng dùng nó. Git cho hai cơ chế, chúng hành xử rất khác nhau, và cả hai đều nổi tiếng là gây khổ. Bài này giải thích mỗi cái thật sự làm gì, để bạn chọn — hoặc từ chối cả hai, thứ thường là lựa chọn đúng.</p>

<h3>Submodule — một con trỏ được ghim</h3>
${slide('git-10', 6, 'submodule là con trỏ gitlink (mode 160000)')}
<pre><code>git submodule add https://github.com/cuonghoang1103/ui-kit.git vendor/ui-kit
git commit -m <span class="tok-string">"chore: them ui-kit lam submodule"</span></code></pre>
<pre><code>cat .gitmodules</code></pre>
<div class="out">[submodule "vendor/ui-kit"]
	path = vendor/ui-kit
	url = https://github.com/cuonghoang1103/ui-kit.git</div>
<pre><code>git ls-files --stage vendor/ui-kit</code></pre>
<div class="out">160000 a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e 0	vendor/ui-kit</div>
<div class="callout ok">Chế độ <strong>160000</strong> là dấu hiệu tố cáo: nó không phải blob và không phải tree, nó là một <em>gitlink</em> — con trỏ tới đúng một commit trong một kho mã khác. Kho của bạn lưu bốn mươi ký tự, không lưu mã của thư viện. Đó là toàn bộ thiết kế, và mọi điểm kỳ quặc dưới đây đều suy ra từ nó.</div>

<h3>Những lệnh bạn buộc phải nhớ</h3>
${slide('git-10', 7, 'Vòng đời submodule: dấu -, dấu cách, dấu +')}
<pre><code>git clone --recurse-submodules &lt;url&gt;        <span class="tok-comment"># clone và điền luôn vào</span>
git submodule update --init --recursive      <span class="tok-comment"># sau một lần clone thường</span>
git submodule update --remote                <span class="tok-comment"># dời cái ghim sang commit mới nhất của submodule</span>
git submodule status</code></pre>
<div class="out">+a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e vendor/ui-kit (v2.1.0-3-ga7c2f91)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">-mã băm</span><span class="v">Chưa khởi tạo. Thư mục trống và bản dựng sẽ hỏng với một thông báo "module not found" khó hiểu.</span></div>
  <div class="kv"><span class="k">&nbsp;mã băm</span><span class="v">Đang ở đúng commit được ghim. Trạng thái đúng.</span></div>
  <div class="kv"><span class="k">+mã băm</span><span class="v">Đang ở một commit <em>KHÁC</em> với commit được ghim — có người đã làm việc bên trong nó, hoặc đã chạy <code>--remote</code>. Hãy commit cái ghim mới hoặc reset.</span></div>
</div>
<pre><code><span class="tok-comment"># Bật đệ quy tự động và dẹp được một nửa số vấn đề:</span>
git config --global submodule.recurse true</code></pre>

<h3>Vì sao submodule mang tiếng xấu</h3>
${slide('git-10', 8, 'Bẫy: push kho cha trước kho con')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Clone thường cho ra thư mục trống</span><span class="lz-v">Quên <code>--recurse-submodules</code> là bản dựng hỏng theo một kiểu chẳng bao giờ nhắc tới chữ submodule. Người mới nào vào nhóm cũng dính một lần.</span></div>
  <div class="lz-layer"><span class="lz-k">Cái ghim không đi theo nhánh</span><span class="lz-v">Một submodule theo dõi một <em>COMMIT</em>, không theo dõi một nhánh. Công việc mới ở thượng nguồn không bao giờ tới cho tới khi có người chạy <code>--remote</code> rồi commit cái ghim mới.</span></div>
  <div class="lz-layer"><span class="lz-k">HEAD lìa cành ở bên trong</span><span class="lz-v">Submodule được checkout tại một commit, nên sửa ở đó là commit vào hư không trừ khi bạn <code>git switch main</code> trước (bài 3.1).</span></div>
  <div class="lz-layer"><span class="lz-k">Hai lần push, đúng thứ tự</span><span class="lz-v">Push submodule trước, rồi mới tới kho cha. Đảo thứ tự là đồng nghiệp nhận một cái ghim trỏ vào commit không tồn tại trên máy chủ.</span></div>
  <div class="lz-layer"><span class="lz-k">Xung đột hợp nhất trên gitlink</span><span class="lz-v">Hai nhánh ghim hai commit khác nhau sẽ xung đột trên một dòng vốn chỉ là một mã băm. Hãy giải bằng cách chọn đúng commit, đừng giải bằng cách sửa chữ.</span></div>
</div>

<h3>Subtree — mã nguồn, được hợp nhất thẳng vào</h3>
${slide('git-10', 9, 'subtree chép mã và lịch sử vào kho')}
<pre><code>git subtree add --prefix vendor/ui-kit \\
  https://github.com/cuonghoang1103/ui-kit.git main --squash</code></pre>
<p>Lệnh này chép file của thư viện vào <code>vendor/ui-kit/</code> dưới dạng <strong>file THẬT trong kho của bạn</strong>. Clone chạy bình thường, không lệnh thêm, không thư mục trống, và một người chưa từng nghe tới subtree vẫn làm việc trong kho mà không nhận ra gì.</p>
<pre><code><span class="tok-comment"># Kéo thay đổi từ thượng nguồn về:</span>
git subtree pull --prefix vendor/ui-kit &lt;url&gt; main --squash

<span class="tok-comment"># Đẩy thay đổi cục bộ của bạn ngược lên thư viện:</span>
git subtree push --prefix vendor/ui-kit &lt;url&gt; feature/from-app</code></pre>
<div class="callout warn">Cái giá là kích thước kho và tiếng ồn trong lịch sử: file của thư viện sống trong lịch sử của bạn mãi mãi, và mỗi lần cập nhật thêm một lần merge. <code>--squash</code> giữ nó ở mức một commit cho mỗi lần cập nhật, và đó gần như luôn là thứ bạn muốn. Còn các lệnh thì dài tới mức người ta quên — hãy viết chúng vào một Makefile hay một script ngay ngày bạn nhận subtree.</div>

<h3>Chọn cái nào</h3>
${slide('git-10', 10, 'Submodule, subtree, gói npm hay monorepo')}
<div class="kv-grid">
  <div class="kv"><span class="k">Submodule</span><span class="v">Kho cha nhỏ · ghim phiên bản chính xác · bạn cũng phát triển luôn cái phụ thuộc đó. Cái giá: mọi người phải học các lệnh.</span></div>
  <div class="kv"><span class="k">Subtree</span><span class="v">Người dùng không cần biết gì đặc biệt · clone chạy ngay · vá cục bộ dễ. Cái giá: kho to hơn, lịch sử ồn hơn, đẩy ngược thì lúng túng.</span></div>
  <div class="kv"><span class="k">Trình quản lý gói</span><span class="v">npm, pip, Maven, Go modules. Có phiên bản, có cache, không cần mẹo Git nào. <strong>Câu trả lời đúng trong phần lớn trường hợp.</strong></span></div>
  <div class="kv"><span class="k">Monorepo</span><span class="v">Một kho mã với thư mục <code>packages/</code>. Hoàn toàn không có việc đồng bộ liên kho — một commit nguyên tử đổi được cả thư viện lẫn nơi gọi nó.</span></div>
</div>
<div class="callout ok">Trước khi vớ lấy một trong hai cơ chế, hãy hỏi xem một registry gói có giải quyết được không. Công bố <code>@cuongthai/ui-kit</code> lên npm — hoặc lên một registry riêng tư — cho bạn phiên bản, cache, phân giải phụ thuộc và một lockfile, không thứ nào trong đó submodule hay subtree cung cấp. Hãy dùng cách nhúng ở tầng Git khi cái phụ thuộc không công bố được: một kho riêng tư mà bạn không dựng nổi registry cho nó, một kho cấu hình, hay một bản fork bạn vá cục bộ.</div>

<h3>Gỡ một submodule</h3>
<pre><code>git submodule deinit -f vendor/ui-kit
git rm -f vendor/ui-kit
rm -rf .git/modules/vendor/ui-kit
git commit -m <span class="tok-string">"chore: bo submodule ui-kit"</span></code></pre>
<p>Bốn bước, và bỏ qua bước thứ ba sẽ để lại siêu dữ liệu cũ làm hỏng việc thêm lại một submodule ở cùng đường dẫn về sau. Bản thân sự lúng túng này cũng là một lý lẽ để cân nhắc các phương án khác trước.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Dựng một "thư viện dùng chung" tí hon cạnh sân tập: <code>cd ..</code>, <code>git init --bare ui-kit.git</code>, <code>git clone ui-kit.git ui-kit-dev</code>, rồi trong <code>ui-kit-dev</code> commit hai file (<code>button.js</code>, <code>modal.js</code>) và <code>git push -u origin HEAD</code>.</li><li>Thêm nó vào <code>thu-git</code> làm submodule rồi commit: <code>git -c protocol.file.allow=always submodule add ../ui-kit.git vendor/ui-kit</code>, sau đó <code>git commit -m "chore: them ui-kit lam submodule"</code>. (Cờ <code>-c</code> chỉ cần vì thư viện là một thư mục trên đĩa — từ git 2.38.1, Git từ chối đường truyền <code>file</code> cục bộ cho submodule với "fatal: transport 'file' not allowed". Dùng URL GitHub thì không cần.)</li><li>Xem thứ đã được lưu: <code>git ls-files --stage vendor/ui-kit</code>.</li><li>Đóng vai bạn cùng nhóm quên <code>--recurse-submodules</code>: <code>cd .. &amp;&amp; git clone thu-git thu-git-ban &amp;&amp; cd thu-git-ban</code>, chạy <code>git submodule status</code>, rồi <code>git -c protocol.file.allow=always submodule update --init</code> và chạy lại <code>status</code>.</li><li>So với subtree trong một kho mới tinh: <code>cd .. &amp;&amp; git init thu-subtree &amp;&amp; cd thu-subtree &amp;&amp; git commit --allow-empty -m init</code>, rồi <code>git subtree add --prefix vendor/ui-kit ../ui-kit.git main --squash</code> và <code>git ls-files --stage vendor/ui-kit</code>. (subtree cần ít nhất một commit để hợp nhất vào — vì thế mới có commit rỗng.)</li></ol>
<pre><code class="language-bash"><span class="tok-comment"># output thật từ bản sao kho thử; mã băm của bạn sẽ khác</span>
git ls-files --stage vendor/ui-kit                <span class="tok-comment"># trong thu-git</span></code></pre>
<div class="out">160000 0201254b40e2ee170002e3f439256cf799e54924 0	vendor/ui-kit</div>
<pre><code class="language-bash">git submodule status                              <span class="tok-comment"># trong thu-git-ban, trước update --init</span></code></pre>
<div class="out">-0201254b40e2ee170002e3f439256cf799e54924 vendor/ui-kit</div>
<pre><code class="language-bash">git ls-files --stage vendor/ui-kit                <span class="tok-comment"># trong thu-subtree</span></code></pre>
<div class="out">100644 bd47ced8ecdf8f1f18551367542ee63c36614674 0	vendor/ui-kit/button.js
100644 d0f78bb1a3d37e25b3967b012222e76825acdd00 0	vendor/ui-kit/modal.js</div>
<p><strong>Đạt khi:</strong> bạn tận mắt thấy một mục mode <code>160000</code> trong <code>thu-git</code> so với hai mục mode <code>100644</code> trong <code>thu-subtree</code>, và <code>git submodule status</code> trong <code>thu-git-ban</code> đổi từ dấu <code>-</code> ở đầu sang dấu cách.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Submodule</span><span class="v">Kho con — một kho mã khác gắn vào một đường dẫn trong kho của bạn, ghim ở đúng một commit.</span></div>
  <div class="kv"><span class="k">Gitlink (mode 160000)</span><span class="v">Liên kết Git — mục trong tree lưu cái ghim đó: một mã băm commit của kho kia, không phải file, cũng không phải thư mục.</span></div>
  <div class="kv"><span class="k">.gitmodules</span><span class="v">File cấu hình submodule — file thường được commit, nói lấy mỗi submodule ở đâu (đường dẫn + URL). Còn gitlink nói commit nào.</span></div>
  <div class="kv"><span class="k">Superproject</span><span class="v">Kho cha — kho bên ngoài chứa các submodule; ở đây là <code>do-an-swp</code>.</span></div>
  <div class="kv"><span class="k">Subtree</span><span class="v">Cây con — file của kho kia được hợp nhất vào kho bạn thành file thường (mode 100644); <code>--squash</code> gộp lịch sử của nó thành một commit mỗi lần cập nhật.</span></div>
  <div class="kv"><span class="k">Recurse submodules</span><span class="v">Đệ quy vào submodule — bắt clone, pull, push làm luôn phần submodule: <code>--recurse-submodules</code>, hoặc đặt <code>submodule.recurse true</code> một lần trong config.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Submodule lưu một cái ghim 40 ký tự (gitlink, mode 160000), không bao giờ lưu mã của thư viện.</li><li>Clone thường để submodule trống (dấu <code>-</code> trong <code>submodule status</code>); <code>update --init</code> hoặc <code>clone --recurse-submodules</code> mới điền vào.</li><li>Dời ghim là một thay đổi của kho cha: <code>update --remote</code>, rồi <code>git add</code>, commit và push nó.</li><li>Push submodule trước kho cha — <code>git push --recurse-submodules=check</code> ép luật đó giúp bạn.</li><li>Subtree chép file thật vào nên bạn cùng nhóm không cần biết gì thêm; còn publish được thành gói thì registry thắng cả hai.</li></ul>

<a class="link-card" href="https://git-scm.com/book/vi/v2/C%C3%A1c-C%C3%B4ng-C%E1%BB%A5-Git-Submodules" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 7.11 (tiếng Việt) — Submodule</span><span class="lc-sub">Gồm cả mục "Vấn đề với Submodule", viết rất thẳng thắn.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-subtree" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">git-subtree — add, pull, push, split</span><span class="lc-sub"><code>split</code> là cách bạn tách một thư mục con ra thành kho riêng kèm lịch sử.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> push kho cha trước khi push submodule. Commit ở kho cha ghim một commit submodule chỉ tồn tại trên máy bạn, nên lệnh <code>submodule update</code> của mọi đồng nghiệp hỏng — ở git 2.51 là "fatal: Fetched in submodule path 'vendor/ui-kit', but it did not contain &lt;mã băm&gt;. Direct fetching of that commit failed." (Git đời cũ in "fatal: reference is not a tree"), còn <code>git pull</code> của họ dừng giữa chừng với "upload-pack: not our ref". Hãy luôn push submodule trước. <code>git push --recurse-submodules=check</code> làm Git từ chối push kho cha khi một commit submodule được ghim còn thiếu ở thượng nguồn — hãy đặt nó rồi quên luôn cái luật thứ tự.</div>
<p class="note-ct"><strong>Tóm tắt thẳng thắn:</strong> submodule là công cụ chính xác kèm chi phí phối hợp dốc đứng, subtree đổi kích thước kho lấy sự tiện lợi cho mọi người khác, và một trình quản lý gói thắng cả hai bất cứ khi nào nó khả dụng. Hãy chọn có chủ ý, viết các lệnh ra cho cả nhóm, và xem lại quyết định đó khi cái phụ thuộc trở nên công bố được.</p>
</div>
`,
    },

    /* ─────────────────────────── 10.3 ─────────────────────────── */
    {
      title: '10.3 — Monorepos, sparse-checkout & Git LFS|||10.3 — Monorepo, sparse-checkout & Git LFS',
      slug: 'git-10-3-monorepo-lfs',
      type: 'LESSON',
      description: 'Chỉ lấy về phần kho mã bạn cần với sparse-checkout, chạy CI chỉ trên phần đã đổi, và xử lý file nhị phân lớn bằng Git LFS — kèm những giới hạn mà LFS không nói trước.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>When the repository is bigger than your work</h2>
<p class="lead">A monorepo holds twelve applications and you touch one. A design repository holds 8 GB of Photoshop files. Git handles both, but the defaults are wrong for them: you do not want every file on disk, and you do not want binaries in the object database at all.</p>

<h3>sparse-checkout — fewer files in the working directory</h3>
${slide('git-10', 11, 'partial clone và sparse-checkout bằng số đo thật')}
${slide('git-10', 12, 'sparse-checkout trong thực tế (cone mode)')}
<pre><code>git clone --filter=blob:none --sparse &lt;url&gt;    <span class="tok-comment"># partial clone (9.3) + sparse</span>
cd monorepo
git sparse-checkout set apps/web packages/ui</code></pre>
<pre><code>ls</code></pre>
<div class="out">apps/  packages/  package.json  turbo.json</div>
<pre><code>ls apps/</code></pre>
<div class="out">web/</div>
<p>The other eleven applications are still in history and still fetchable — they are simply not written to disk. On a large monorepo this turns a 40,000-file checkout into 2,000, which makes every editor index, file watcher and test runner dramatically faster.</p>
<pre><code>git sparse-checkout list                 <span class="tok-comment"># what is currently included</span>
git sparse-checkout add packages/api     <span class="tok-comment"># widen the set</span>
git sparse-checkout reapply              <span class="tok-comment"># after changing patterns</span>
git sparse-checkout disable              <span class="tok-comment"># back to a full checkout</span></code></pre>
<div class="callout ok"><strong>Cone mode</strong> (the default since Git 2.37) restricts patterns to whole directories rather than arbitrary globs. That sounds limiting and is the reason it is fast: Git can decide inclusion by directory prefix instead of matching every path against every pattern. Use <code>--no-cone</code> only if you genuinely need file-level patterns, and expect it to be slower.</div>

<h3>Running CI only on what changed</h3>
${slide('git-10', 13, 'Monorepo: CI chỉ chạy phần đã đổi')}
<pre><code><span class="tok-comment"># Which top-level packages did this branch touch?</span>
git diff --name-only origin/main...HEAD | cut -d/ -f1-2 | sort -u</code></pre>
<div class="out">apps/web
packages/ui</div>
<pre><code><span class="tok-comment"># In a workflow — skip the job entirely when nothing relevant changed:</span>
on:
  pull_request:
    paths: [<span class="tok-string">'apps/web/**'</span>, <span class="tok-string">'packages/ui/**'</span>]</code></pre>
<div class="callout warn">Path filters interact badly with required status checks: a job that never runs never reports, and the pull request waits forever (6.4). Either add a companion job with the same name that reports success for skipped paths, or use a dedicated change-detection step inside a job that always runs.</div>

<h3>Git LFS — large binaries, stored elsewhere</h3>
${slide('git-10', 14, 'Git LFS: con trỏ trong Git, file thật ở kho LFS')}
<p>Git is built for text: it diffs it, delta-compresses it, and merges it. A 200 MB video does none of that. Every version is stored whole, in every clone, forever (9.3). <strong>Git LFS</strong> replaces the file in the repository with a small pointer and keeps the bytes on a separate server.</p>
<pre><code>git lfs install
git lfs track <span class="tok-string">"*.psd"</span> <span class="tok-string">"*.mp4"</span> <span class="tok-string">"*.zip"</span>
git add .gitattributes
git add design/hero.psd &amp;&amp; git commit -m <span class="tok-string">"design: add the hero mockup"</span></code></pre>
<pre><code>cat .gitattributes</code></pre>
<div class="out">*.psd filter=lfs diff=lfs merge=lfs -text
*.mp4 filter=lfs diff=lfs merge=lfs -text</div>
<pre><code>git show HEAD:design/hero.psd</code></pre>
<div class="out">version https://git-lfs.github.com/spec/v1
oid sha256:4d7a1e8f9c2b5a6e0d3f7b1c4a8e2d6f0b9c3a5e7d1f4b8c2a6e0d3f7b1c4a8e
size 52428800</div>
<p>Three lines in the repository; 50 MB on the LFS server. Clone downloads pointers, then fetches only the binaries for the commit you check out.</p>
<pre><code>git lfs ls-files                 <span class="tok-comment"># which files are LFS-tracked</span>
git lfs pull                     <span class="tok-comment"># fetch the real content</span>
GIT_LFS_SKIP_SMUDGE=1 git clone  <span class="tok-comment"># clone pointers only — fast, for CI that does not need assets</span></code></pre>

<h3>What LFS does not fix</h3>
${slide('git-10', 15, 'LFS không có hiệu lực ngược')}
<div class="kv-grid">
  <div class="kv"><span class="k">It is not retroactive</span><span class="v">Files committed before you enabled LFS stay in history at full size. Migrating means rewriting history (<code>git lfs migrate import</code>) with the coordination cost of 8.3.</span></div>
  <div class="kv"><span class="k">Everyone needs the client</span><span class="v">Without <code>git lfs install</code>, a colleague checks out the three-line pointer instead of the image — and the application silently fails to load an asset that "looks committed".</span></div>
  <div class="kv"><span class="k">Storage is metered</span><span class="v">GitHub bills LFS storage and bandwidth separately from the repository. A CI job that clones assets on every run can be surprisingly expensive.</span></div>
  <div class="kv"><span class="k">Binaries still do not merge</span><span class="v">Two people editing the same PSD is a conflict you resolve by choosing one file (3.3). LFS changes storage, not merge semantics.</span></div>
</div>

<h3>Monorepo, in practice</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Atomic cross-package changes</span><span class="lz-v">One commit changes the library and every caller. No version bump, no synchronisation window, no "which version of the API is this app on?".</span></div>
  <div class="lz-layer"><span class="lz-k">One toolchain</span><span class="lz-v">One lint config, one test runner, one CI pipeline. New contributors learn it once.</span></div>
  <div class="lz-layer"><span class="lz-k">The cost: scale</span><span class="lz-v">Checkout size, CI time and code ownership all need active management — hence sparse-checkout, path filters and CODEOWNERS (6.4).</span></div>
  <div class="lz-layer"><span class="lz-k">The tooling</span><span class="lz-v">Turborepo, Nx, Bazel and pnpm workspaces exist to cache builds per package and run only what changed. Git gives you the repository; they give you the build graph.</span></div>
</div>
<pre><code><span class="tok-comment"># Make history readable per package — the monorepo version of "what shipped":</span>
git log --oneline v1.4.0..HEAD -- packages/ui/
git shortlog -sn --since=<span class="tok-string">"3 months ago"</span> -- apps/web/</code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Build a toy monorepo next to <code>thu-git</code>: <code>cd .. &amp;&amp; mkdir mono-thu &amp;&amp; cd mono-thu &amp;&amp; git init</code>, create <code>apps/web/README.md</code>, <code>apps/admin/README.md</code> and <code>packages/ui/README.md</code>, then commit them. Allow filtered clones from it: <code>git config uploadpack.allowFilter true</code> (GitHub already allows this; a local repository does not by default).</li><li>Clone only what a web developer needs: <code>cd .. &amp;&amp; git clone --filter=blob:none --sparse "file://$PWD/mono-thu" mono-sparse &amp;&amp; cd mono-sparse &amp;&amp; git sparse-checkout set apps/web</code>.</li><li>Before running them, predict the output of <code>find . -type f -not -path "./.git/*"</code> and of <code>git ls-files | wc -l</code>. Then run both.</li><li>If you have Git LFS (<code>git lfs version</code>; on a Mac <code>brew install git-lfs</code>, on Windows it ships with Git for Windows): in a new repository run <code>git lfs install</code>, <code>git lfs track "*.psd"</code>, create a 1 MB file with <code>head -c 1048576 /dev/urandom &gt; logo.psd</code>, add <code>.gitattributes</code> and <code>logo.psd</code>, commit, then compare <code>git cat-file -s HEAD:logo.psd</code> with <code>ls -l logo.psd</code>.</li></ol>
<pre><code class="language-bash"><span class="tok-comment"># real output from our test run (git 2.51.1, git-lfs 3.7.1)</span>
find . -type f -not -path <span class="tok-string">"./.git/*"</span></code></pre>
<div class="out">./apps/web/README.md</div>
<pre><code class="language-bash">git ls-files | wc -l</code></pre>
<div class="out">       3</div>
<pre><code class="language-bash">git cat-file -s HEAD:logo.psd</code></pre>
<div class="out">132</div>
<p><strong>Done when:</strong> only <code>apps/web/README.md</code> is on disk while <code>git ls-files</code> still counts 3 files, and (with LFS) Git stores 132 bytes for a file that is 1 048 576 bytes on disk. Without LFS installed, stop after step 3 — the pointer demo needs the real client.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Partial clone</span><span class="v"><code>--filter=blob:none</code>: download every commit and tree but no file contents; each blob is fetched the first time something needs it.</span></div>
  <div class="kv"><span class="k">Sparse-checkout</span><span class="v">Write only chosen directories to disk. History and the index still know every file.</span></div>
  <div class="kv"><span class="k">Cone mode</span><span class="v">Sparse-checkout patterns limited to whole directories — fast, and the default since Git 2.37.</span></div>
  <div class="kv"><span class="k">Monorepo</span><span class="v">One repository holding many apps and packages, so a single commit can change a library and all its callers.</span></div>
  <div class="kv"><span class="k">Git LFS pointer</span><span class="v">The small text file (version, oid, size) Git stores instead of a tracked binary.</span></div>
  <div class="kv"><span class="k">Smudge / clean filter</span><span class="v">The hooks LFS installs: clean turns the file into a pointer on add; smudge turns the pointer back into the file on checkout.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Partial clone reduces what is downloaded; sparse-checkout reduces what is written to disk — often used together, but they are different jobs.</li><li>Neither removes anything from history: <code>git log</code> and <code>git show</code> still work for every path.</li><li>In a monorepo, <code>git diff --name-only origin/main...HEAD</code> tells CI which packages changed — but a path-filtered required check that never runs blocks the PR.</li><li>LFS stores a 132-byte pointer in Git and the real bytes on the LFS server; every teammate needs the client.</li><li>LFS only affects files committed after <code>track</code>; weight already in history needs a rewrite (<code>git lfs migrate import</code>) and a re-clone.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-sparse-checkout" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">git-sparse-checkout — cone mode explained</span><span class="lc-sub">Why cone mode is faster and when you genuinely need --no-cone.</span></span>
</a>
<a class="link-card" href="https://git-lfs.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Git LFS — installation, tracking, and migrate import</span><span class="lc-sub">The migration path for a repository that already has large files in history.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> enabling LFS and assuming the repository shrinks. It does not — LFS only affects files committed <em>after</em> it is configured. The 400 MB video from 2023 is still in every clone. Check with the size query from 9.3 first; if the weight is already in history, you need <code>git lfs migrate import</code> or <code>git filter-repo</code>, both of which rewrite history and require everyone to re-clone.</div>
<p class="note-ct"><strong>The order to apply these:</strong> measure first (<code>git count-objects -vH</code> and the largest-blob query from 9.3). If the working directory is the problem, sparse-checkout fixes it with no history rewrite. If history is the problem, only a rewrite will do — so decide once, do every rewrite you owe in the same operation, and make everyone re-clone once rather than three times.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Khi kho mã lớn hơn phần việc của bạn</h2>
<p class="lead">Một monorepo chứa mười hai ứng dụng và bạn chỉ đụng vào một. Một kho thiết kế chứa 8 GB file Photoshop. Git xử lý được cả hai, nhưng mặc định của nó sai với chúng: bạn không muốn mọi file nằm trên đĩa, và bạn hoàn toàn không muốn file nhị phân nằm trong kho đối tượng.</p>

<h3>sparse-checkout — ít file hơn trong thư mục làm việc</h3>
${slide('git-10', 11, 'partial clone và sparse-checkout bằng số đo thật')}
${slide('git-10', 12, 'sparse-checkout trong thực tế (cone mode)')}
<pre><code>git clone --filter=blob:none --sparse &lt;url&gt;    <span class="tok-comment"># partial clone (bài 9.3) + sparse</span>
cd monorepo
git sparse-checkout set apps/web packages/ui</code></pre>
<pre><code>ls</code></pre>
<div class="out">apps/  packages/  package.json  turbo.json</div>
<pre><code>ls apps/</code></pre>
<div class="out">web/</div>
<p>Mười một ứng dụng kia vẫn nằm trong lịch sử và vẫn lấy về được — chúng chỉ không được ghi ra đĩa. Trên một monorepo lớn, việc này biến một lần checkout 40.000 file thành 2.000, làm cho mọi trình đánh chỉ mục của editor, mọi bộ theo dõi file và mọi bộ chạy test nhanh lên rõ rệt.</p>
<pre><code>git sparse-checkout list                 <span class="tok-comment"># hiện đang gồm những gì</span>
git sparse-checkout add packages/api     <span class="tok-comment"># mở rộng tập</span>
git sparse-checkout reapply              <span class="tok-comment"># sau khi đổi các mẫu</span>
git sparse-checkout disable              <span class="tok-comment"># quay lại checkout đầy đủ</span></code></pre>
<div class="callout ok"><strong>Chế độ cone</strong> (mặc định từ Git 2.37) giới hạn các mẫu vào nguyên thư mục thay vì glob tuỳ ý. Nghe có vẻ gò bó và đó chính là lý do nó nhanh: Git quyết định gồm hay không bằng tiền tố thư mục thay vì đem mọi đường dẫn khớp với mọi mẫu. Chỉ dùng <code>--no-cone</code> nếu bạn thật sự cần mẫu ở mức từng file, và hãy chờ đợi nó chậm hơn.</div>

<h3>Chạy CI chỉ trên phần đã đổi</h3>
${slide('git-10', 13, 'Monorepo: CI chỉ chạy phần đã đổi')}
<pre><code><span class="tok-comment"># Nhánh này đã chạm vào những gói cấp cao nào?</span>
git diff --name-only origin/main...HEAD | cut -d/ -f1-2 | sort -u</code></pre>
<div class="out">apps/web
packages/ui</div>
<pre><code><span class="tok-comment"># Trong một workflow — bỏ hẳn job khi không có gì liên quan thay đổi:</span>
on:
  pull_request:
    paths: [<span class="tok-string">'apps/web/**'</span>, <span class="tok-string">'packages/ui/**'</span>]</code></pre>
<div class="callout warn">Bộ lọc đường dẫn tương tác rất tệ với kiểm tra trạng thái bắt buộc: một job không bao giờ chạy thì không bao giờ báo cáo, và pull request chờ mãi mãi (bài 6.4). Hoặc thêm một job đi kèm cùng tên báo thành công cho các đường dẫn bị bỏ qua, hoặc dùng một bước phát hiện thay đổi riêng nằm trong một job luôn chạy.</div>

<h3>Git LFS — file nhị phân lớn, lưu ở chỗ khác</h3>
${slide('git-10', 14, 'Git LFS: con trỏ trong Git, file thật ở kho LFS')}
<p>Git được dựng cho văn bản: nó so sánh được, nén delta được, hợp nhất được. Một video 200 MB thì không làm được thứ nào trong đó. Mọi phiên bản đều được lưu nguyên vẹn, trong mọi bản clone, mãi mãi (bài 9.3). <strong>Git LFS</strong> thay file trong kho bằng một con trỏ nhỏ và giữ các byte trên một máy chủ riêng.</p>
<pre><code>git lfs install
git lfs track <span class="tok-string">"*.psd"</span> <span class="tok-string">"*.mp4"</span> <span class="tok-string">"*.zip"</span>
git add .gitattributes
git add design/hero.psd &amp;&amp; git commit -m <span class="tok-string">"design: them mockup hero"</span></code></pre>
<pre><code>cat .gitattributes</code></pre>
<div class="out">*.psd filter=lfs diff=lfs merge=lfs -text
*.mp4 filter=lfs diff=lfs merge=lfs -text</div>
<pre><code>git show HEAD:design/hero.psd</code></pre>
<div class="out">version https://git-lfs.github.com/spec/v1
oid sha256:4d7a1e8f9c2b5a6e0d3f7b1c4a8e2d6f0b9c3a5e7d1f4b8c2a6e0d3f7b1c4a8e
size 52428800</div>
<p>Ba dòng trong kho mã; 50 MB trên máy chủ LFS. Clone tải về các con trỏ, rồi chỉ lấy phần nhị phân cho commit bạn checkout.</p>
<pre><code>git lfs ls-files                 <span class="tok-comment"># những file nào được LFS theo dõi</span>
git lfs pull                     <span class="tok-comment"># lấy nội dung thật về</span>
GIT_LFS_SKIP_SMUDGE=1 git clone  <span class="tok-comment"># chỉ clone con trỏ — nhanh, cho CI không cần tài sản</span></code></pre>

<h3>Những gì LFS KHÔNG sửa được</h3>
${slide('git-10', 15, 'LFS không có hiệu lực ngược')}
<div class="kv-grid">
  <div class="kv"><span class="k">Nó không có hiệu lực ngược</span><span class="v">File đã commit trước khi bạn bật LFS vẫn nằm trong lịch sử ở kích thước đầy đủ. Di trú nghĩa là viết lại lịch sử (<code>git lfs migrate import</code>) kèm chi phí phối hợp của bài 8.3.</span></div>
  <div class="kv"><span class="k">Mọi người đều cần cài client</span><span class="v">Không có <code>git lfs install</code>, một đồng nghiệp checkout ra con trỏ ba dòng thay vì tấm ảnh — và ứng dụng âm thầm không nạp được một tài sản trông như đã được commit.</span></div>
  <div class="kv"><span class="k">Dung lượng bị tính tiền</span><span class="v">GitHub tính tiền lưu trữ và băng thông LFS tách khỏi kho mã. Một job CI clone tài sản ở mọi lượt chạy có thể đắt đến bất ngờ.</span></div>
  <div class="kv"><span class="k">File nhị phân vẫn không merge được</span><span class="v">Hai người cùng sửa một file PSD là một xung đột mà bạn giải bằng cách chọn một file (bài 3.3). LFS đổi cách lưu trữ, không đổi ngữ nghĩa hợp nhất.</span></div>
</div>

<h3>Monorepo, trong thực tế</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Thay đổi liên gói mang tính nguyên tử</span><span class="lz-v">Một commit đổi cả thư viện lẫn mọi nơi gọi nó. Không tăng phiên bản, không có cửa sổ đồng bộ, không có câu "ứng dụng này đang chạy phiên bản API nào?".</span></div>
  <div class="lz-layer"><span class="lz-k">Một bộ công cụ duy nhất</span><span class="lz-v">Một cấu hình lint, một bộ chạy test, một pipeline CI. Người mới học một lần là xong.</span></div>
  <div class="lz-layer"><span class="lz-k">Cái giá: quy mô</span><span class="lz-v">Kích thước checkout, thời gian CI và quyền sở hữu mã đều cần quản lý chủ động — nên mới có sparse-checkout, bộ lọc đường dẫn và CODEOWNERS (bài 6.4).</span></div>
  <div class="lz-layer"><span class="lz-k">Bộ công cụ</span><span class="lz-v">Turborepo, Nx, Bazel và pnpm workspaces tồn tại để cache bản dựng theo từng gói và chỉ chạy phần đã đổi. Git cho bạn kho mã; chúng cho bạn đồ thị build.</span></div>
</div>
<pre><code><span class="tok-comment"># Làm lịch sử đọc được theo từng gói — phiên bản monorepo của câu "đã ra những gì":</span>
git log --oneline v1.4.0..HEAD -- packages/ui/
git shortlog -sn --since=<span class="tok-string">"3 months ago"</span> -- apps/web/</code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Dựng một monorepo đồ chơi cạnh <code>thu-git</code>: <code>cd .. &amp;&amp; mkdir mono-thu &amp;&amp; cd mono-thu &amp;&amp; git init</code>, tạo <code>apps/web/README.md</code>, <code>apps/admin/README.md</code> và <code>packages/ui/README.md</code>, rồi commit. Cho phép clone có lọc từ kho này: <code>git config uploadpack.allowFilter true</code> (GitHub đã cho sẵn; kho trên máy thì mặc định chưa).</li><li>Chỉ clone phần một bạn làm web cần: <code>cd .. &amp;&amp; git clone --filter=blob:none --sparse "file://$PWD/mono-thu" mono-sparse &amp;&amp; cd mono-sparse &amp;&amp; git sparse-checkout set apps/web</code>.</li><li>Trước khi chạy, đoán output của <code>find . -type f -not -path "./.git/*"</code> và của <code>git ls-files | wc -l</code>. Rồi mới chạy cả hai.</li><li>Nếu máy có Git LFS (<code>git lfs version</code>; Mac: <code>brew install git-lfs</code>, Windows: có sẵn trong Git for Windows): trong một kho mới, chạy <code>git lfs install</code>, <code>git lfs track "*.psd"</code>, tạo file 1 MB bằng <code>head -c 1048576 /dev/urandom &gt; logo.psd</code>, add <code>.gitattributes</code> và <code>logo.psd</code>, commit, rồi so <code>git cat-file -s HEAD:logo.psd</code> với <code>ls -l logo.psd</code>.</li></ol>
<pre><code class="language-bash"><span class="tok-comment"># output thật từ lần chạy thử (git 2.51.1, git-lfs 3.7.1)</span>
find . -type f -not -path <span class="tok-string">"./.git/*"</span></code></pre>
<div class="out">./apps/web/README.md</div>
<pre><code class="language-bash">git ls-files | wc -l</code></pre>
<div class="out">       3</div>
<pre><code class="language-bash">git cat-file -s HEAD:logo.psd</code></pre>
<div class="out">132</div>
<p><strong>Đạt khi:</strong> trên đĩa chỉ có <code>apps/web/README.md</code> trong khi <code>git ls-files</code> vẫn đếm được 3 file, và (nếu có LFS) Git chỉ lưu 132 byte cho một file nặng 1 048 576 byte trên đĩa. Máy chưa cài LFS thì dừng ở bước 3 — phần con trỏ cần client thật.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Partial clone</span><span class="v">Clone một phần — <code>--filter=blob:none</code>: tải mọi commit và tree nhưng không tải nội dung file; mỗi blob được lấy về lần đầu có thứ cần tới nó.</span></div>
  <div class="kv"><span class="k">Sparse-checkout</span><span class="v">Checkout thưa — chỉ ghi ra đĩa những thư mục được chọn. Lịch sử và index vẫn biết đủ mọi file.</span></div>
  <div class="kv"><span class="k">Cone mode</span><span class="v">Chế độ hình nón — mẫu sparse-checkout chỉ nhận nguyên thư mục; nhanh, và là mặc định từ Git 2.37.</span></div>
  <div class="kv"><span class="k">Monorepo</span><span class="v">Kho đơn khối — một kho chứa nhiều ứng dụng và gói, nên một commit đổi được cả thư viện lẫn mọi nơi gọi nó.</span></div>
  <div class="kv"><span class="k">Git LFS pointer</span><span class="v">Con trỏ LFS — file chữ nhỏ (version, oid, size) mà Git lưu thay cho file nhị phân được theo dõi.</span></div>
  <div class="kv"><span class="k">Smudge / clean filter</span><span class="v">Bộ lọc "làm bẩn / làm sạch" — cái móc LFS cài vào: clean biến file thành con trỏ lúc add; smudge biến con trỏ lại thành file lúc checkout.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Partial clone bớt thứ phải tải về; sparse-checkout bớt thứ phải ghi ra đĩa — hay đi cùng nhau, nhưng là hai việc khác nhau.</li><li>Không cái nào xoá gì khỏi lịch sử: <code>git log</code> và <code>git show</code> vẫn chạy với mọi đường dẫn.</li><li>Trong monorepo, <code>git diff --name-only origin/main...HEAD</code> cho CI biết gói nào đã đổi — nhưng một required check bị lọc đường dẫn mà không chạy thì chặn luôn PR.</li><li>LFS lưu một con trỏ 132 byte trong Git và byte thật trên máy chủ LFS; ai trong nhóm cũng phải cài client.</li><li>LFS chỉ tác động tới file commit sau <code>track</code>; sức nặng đã nằm trong lịch sử thì phải viết lại (<code>git lfs migrate import</code>) và clone lại.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-sparse-checkout" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">git-sparse-checkout — giải thích chế độ cone</span><span class="lc-sub">Vì sao cone nhanh hơn và khi nào bạn thật sự cần --no-cone.</span></span>
</a>
<a class="link-card" href="https://git-lfs.com/" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Git LFS — cài đặt, theo dõi, và migrate import</span><span class="lc-sub">Đường di trú cho một kho đã có sẵn file lớn trong lịch sử.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> bật LFS rồi tưởng kho mã nhỏ lại. Không hề — LFS chỉ tác động tới những file được commit <em>SAU</em> khi nó được cấu hình. Cái video 400 MB từ năm 2023 vẫn nằm trong mọi bản clone. Hãy kiểm bằng truy vấn kích thước ở bài 9.3 trước; nếu sức nặng đã nằm trong lịch sử thì bạn cần <code>git lfs migrate import</code> hoặc <code>git filter-repo</code>, cả hai đều viết lại lịch sử và bắt mọi người clone lại.</div>
<p class="note-ct"><strong>Thứ tự áp dụng những thứ này:</strong> hãy đo trước (<code>git count-objects -vH</code> và truy vấn blob lớn nhất ở bài 9.3). Nếu vấn đề nằm ở thư mục làm việc thì sparse-checkout giải quyết mà không cần viết lại lịch sử. Nếu vấn đề nằm ở lịch sử thì chỉ viết lại mới xong — nên hãy quyết một lần, làm hết mọi lần viết lại bạn còn nợ trong cùng một thao tác, và bắt mọi người clone lại một lần thay vì ba lần.</p>
</div>
`,
    },

    /* ─────────────────────────── 10.4 Quiz ─────────────────────────── */
    {
      title: '10.4 — Chapter 10 quiz|||10.4 — Kiểm tra Chương 10',
      slug: 'git-10-4-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống thật: vá gấp bằng worktree, nhánh bị worktree ma giữ chặt, gitlink 160000, push submodule sai thứ tự, dời ghim chưa commit, chọn subtree cho nhóm đồ án, sparse-checkout và partial clone, con trỏ LFS và giới hạn của LFS.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from a real team project — a hotfix in the middle of a feature, a shared UI library, a monorepo, a designer’s 5 MB mockup. Most are decided by one question: what does the repository actually store here — a commit, a pointer, or the bytes themselves? Read every explanation after submitting, especially for the ones you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can open a hotfix in a second worktree, commit there, and remove it with <code>git worktree remove</code>.</li>
<li>I know why Git refuses to check out one branch in two worktrees, and what <code>git worktree prune</code> cleans up.</li>
<li>I can read <code>160000</code> in <code>git ls-files --stage</code> and the <code>-</code>/space/<code>+</code> prefix in <code>git submodule status</code>.</li>
<li>I know the push order for submodules and the flag that enforces it.</li>
<li>I can explain the difference between partial clone and sparse-checkout in one sentence each.</li>
<li>I know what a teammate without git-lfs gets, and why enabling LFS does not shrink existing history.</li>
</ul>
${slide('git-10', 17, 'Bảng tra nhanh Chương 10')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ một đồ án nhóm thật — vá gấp giữa lúc làm tính năng, một thư viện giao diện dùng chung, một monorepo, một file mockup 5 MB của bạn thiết kế. Phần lớn được quyết định bởi một câu hỏi: ở chỗ này kho mã thật sự lưu gì — một commit, một con trỏ, hay chính các byte? Đọc mọi phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi mở được một hotfix ở worktree thứ hai, commit ở đó, rồi gỡ nó bằng <code>git worktree remove</code>.</li>
<li>Tôi biết vì sao Git từ chối checkout một nhánh ở hai worktree, và <code>git worktree prune</code> dọn cái gì.</li>
<li>Tôi đọc được <code>160000</code> trong <code>git ls-files --stage</code> và tiền tố <code>-</code>/dấu cách/<code>+</code> trong <code>git submodule status</code>.</li>
<li>Tôi biết thứ tự push với submodule và cái cờ ép thứ tự đó.</li>
<li>Tôi giải thích được partial clone và sparse-checkout khác nhau thế nào, mỗi cái một câu.</li>
<li>Tôi biết bạn cùng nhóm chưa cài git-lfs sẽ nhận được gì, và vì sao bật LFS không làm lịch sử cũ nhỏ lại.</li>
</ul>
${slide('git-10', 17, 'Bảng tra nhanh Chương 10')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You are halfway through feature/gio-hang: files edited, node_modules installed for this branch, dev server running. The team lead needs an urgent fix on main now. What keeps your current setup completely untouched?|||Bạn đang làm dở feature/gio-hang: file đang sửa, node_modules cài cho đúng nhánh này, dev server đang chạy. Trưởng nhóm cần vá gấp trên main ngay. Cách nào giữ nguyên hoàn toàn chỗ bạn đang làm?',
            options: [
              'git stash, git switch main, fix, then switch back and git stash pop|||git stash, git switch main, vá, rồi switch về và git stash pop',
              'Commit the half-done work as "wip", switch to main, fix, switch back|||Commit phần dở thành "wip", switch sang main, vá, rồi switch về',
              'git worktree add -b hotfix/login ../do-an-hotfix main, and fix it in that folder|||git worktree add -b hotfix/login ../do-an-hotfix main, rồi vá trong thư mục đó',
              'git clone the repository again into a second folder and fix it there|||git clone lại kho vào một thư mục thứ hai rồi vá ở đó',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: A worktree gives main its own folder while sharing the same .git, so your edited files, installed dependencies and running server in the original folder never move, and the fix commit is visible there immediately. stash (and a wip commit) handle the files, but switching branches in place still rewrites the working directory under your dev server and editor. A second clone also works but downloads the whole history again and has separate refs — the fix is invisible to your main folder until you push and fetch.|||VI: Worktree cho main một thư mục riêng mà vẫn dùng chung .git, nên file đang sửa, thư viện đã cài và server đang chạy ở thư mục gốc không hề nhúc nhích, còn commit vá thì thấy được ở đó ngay. stash (hay commit wip) lo được phần file, nhưng đổi nhánh tại chỗ vẫn ghi đè thư mục làm việc ngay dưới chân dev server và editor. Clone thứ hai cũng chạy, nhưng tải lại cả lịch sử và có ref riêng — thư mục chính không thấy commit vá cho tới khi bạn push rồi fetch.',
          },
          {
            question: 'Last week you deleted ../do-an-hotfix with rm -rf. Today "git switch hotfix/login" prints: fatal: ’hotfix/login’ is already used by worktree at ’~/do-an-hotfix’. What fixes it without losing anything?|||Tuần trước bạn xoá ../do-an-hotfix bằng rm -rf. Hôm nay "git switch hotfix/login" báo: fatal: ’hotfix/login’ is already used by worktree at ’~/do-an-hotfix’. Cách nào sửa mà không mất gì?',
            options: [
              'git worktree prune — it removes the record of a worktree whose folder no longer exists|||git worktree prune — xoá bản ghi của worktree có thư mục không còn tồn tại',
              'git branch -D hotfix/login, then recreate the branch from main|||git branch -D hotfix/login, rồi tạo lại nhánh từ main',
              'git fetch --prune, so Git notices the folder is gone|||git fetch --prune để Git nhận ra thư mục đã mất',
              'git stash, then git switch hotfix/login again|||git stash, rồi git switch hotfix/login lần nữa',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: rm -rf deleted the folder but not the administrative entry in .git/worktrees/, so Git still believes the branch is checked out there (git worktree list marks it "prunable"). git worktree prune deletes exactly those stale entries, and the branch with its commits is untouched. fetch --prune sounds right because of the word, but it prunes remote-tracking branches, not worktrees. Deleting and recreating the branch throws away the hotfix commits (and Git refuses -D on a branch it thinks is checked out anyway); stash is unrelated to the lock.|||VI: rm -rf xoá thư mục nhưng không xoá bản ghi trong .git/worktrees/, nên Git vẫn tin nhánh đang được checkout ở đó (git worktree list gắn nhãn "prunable"). git worktree prune xoá đúng những bản ghi mồ côi đó, còn nhánh và commit của nó giữ nguyên. fetch --prune nghe đúng vì có chữ prune, nhưng nó dọn nhánh theo dõi từ xa chứ không dọn worktree. Xoá rồi tạo lại nhánh là vứt luôn các commit vá (mà Git cũng từ chối -D một nhánh nó tin là đang được checkout); stash chẳng liên quan gì tới cái khoá này.',
          },
          {
            question: 'A teammate asks what the repository really stores for vendor/ui-kit. You run git ls-files --stage vendor/ui-kit and see: 160000 1649e84… 0 vendor/ui-kit. What does it mean?|||Bạn cùng nhóm hỏi kho mã thật sự lưu gì cho vendor/ui-kit. Bạn chạy git ls-files --stage vendor/ui-kit và thấy: 160000 1649e84… 0 vendor/ui-kit. Nghĩa là gì?',
            options: [
              'vendor/ui-kit is an executable file tracked by Git|||vendor/ui-kit là một file thực thi được Git theo dõi',
              'vendor/ui-kit is a symbolic link to another folder|||vendor/ui-kit là một liên kết tượng trưng tới thư mục khác',
              'vendor/ui-kit is a large file stored in Git LFS|||vendor/ui-kit là một file lớn lưu trong Git LFS',
              'A gitlink: a pointer to exactly one commit of another repository (a submodule)|||Một gitlink: con trỏ tới đúng một commit của một kho khác (một submodule)',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Mode 160000 is a gitlink — the tree stores one commit hash from the ui-kit repository, not its files (git cat-file -p HEAD:vendor shows "160000 commit 1649e84…"). An executable file is 100755 and a symlink is 120000. An LFS file is an ordinary 100644 blob whose content happens to be a pointer text, so its mode would not change.|||VI: Mode 160000 là gitlink — tree lưu một mã băm commit của kho ui-kit, không lưu file của nó (git cat-file -p HEAD:vendor in ra "160000 commit 1649e84…"). File thực thi là 100755, symlink là 120000. File LFS là một blob 100644 bình thường mà nội dung tình cờ là đoạn chữ con trỏ, nên mode của nó không đổi.',
          },
          {
            question: 'You committed Badge inside vendor/ui-kit, committed the new pin in do-an-swp, and ran git push in do-an-swp only. Your teammate’s git clone --recurse-submodules now fails with "upload-pack: not our ref da584d6…". What is the fix?|||Bạn commit Badge bên trong vendor/ui-kit, commit ghim mới trong do-an-swp, rồi chỉ chạy git push ở do-an-swp. Giờ git clone --recurse-submodules của bạn cùng nhóm hỏng với "upload-pack: not our ref da584d6…". Sửa thế nào?',
            options: [
              'Your teammate should run git submodule update --remote instead|||Bạn cùng nhóm nên chạy git submodule update --remote thay vào đó',
              'Push the submodule commit: git -C vendor/ui-kit push — the parent pins a commit that only exists on your machine|||Push commit của submodule: git -C vendor/ui-kit push — kho cha đang ghim một commit chỉ có trên máy bạn',
              'Your teammate needs -c protocol.file.allow=always to fetch it|||Bạn cùng nhóm cần -c protocol.file.allow=always để lấy được nó',
              'Force-push do-an-swp so the server recalculates the submodule|||Force-push do-an-swp để máy chủ tính lại submodule',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: The parent commit on the server points at da584d6, but da584d6 was never pushed to ui-kit.git, so nobody else can fetch it. Push the submodule, and the same clone succeeds. update --remote is tempting because it "makes the error go away", but it silently checks out a different commit than the one the project pinned. protocol.file.allow only matters for local-path URLs and would give a different error ("transport ’file’ not allowed"). Next time, git push --recurse-submodules=check refuses the parent push before the damage.|||VI: Commit của kho cha trên máy chủ trỏ tới da584d6, nhưng da584d6 chưa bao giờ được push lên ui-kit.git, nên không ai khác lấy được. Push submodule lên là lần clone y hệt chạy ngay. update --remote hấp dẫn vì nó "làm lỗi biến mất", nhưng nó âm thầm checkout một commit khác với commit dự án đã ghim. protocol.file.allow chỉ liên quan tới URL là đường dẫn trên đĩa và sẽ báo lỗi khác ("transport ’file’ not allowed"). Lần sau, git push --recurse-submodules=check từ chối push kho cha trước khi kịp gây hại.',
          },
          {
            question: 'You ran git submodule update --remote and your app now uses the new Toast component. Two days later your teammates still have the old ui-kit, and git status -s on your machine shows " M vendor/ui-kit". Why?|||Bạn chạy git submodule update --remote và app đã dùng được component Toast mới. Hai ngày sau các bạn cùng nhóm vẫn ở ui-kit cũ, còn git status -s trên máy bạn báo " M vendor/ui-kit". Vì sao?',
            options: [
              'They must each run git submodule update --remote themselves|||Mỗi người phải tự chạy git submodule update --remote',
              'Moving the pin is a change in do-an-swp: you still have to git add vendor/ui-kit, commit and push it|||Dời ghim là một thay đổi trong do-an-swp: bạn vẫn phải git add vendor/ui-kit, commit rồi push nó',
              'They need git config submodule.recurse true before pulling|||Họ cần git config submodule.recurse true trước khi pull',
              'The Toast commit was not tagged, so submodules ignore it|||Commit Toast chưa gắn tag nên submodule bỏ qua nó',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: update --remote only moved YOUR checkout; the gitlink stored in do-an-swp still says 1649e84 until you commit the change (git diff shows "-Subproject commit 1649e84… / +Subproject commit 13633f1…"). Asking everyone to run --remote is the tempting shortcut, and it means each person ends up on whatever ui-kit was newest when they ran it — the exact opposite of pinning. submodule.recurse helps pulls update submodules, but only to the pin that was committed. Tags play no role.|||VI: update --remote chỉ dời bản checkout CỦA BẠN; gitlink lưu trong do-an-swp vẫn là 1649e84 cho tới khi bạn commit thay đổi đó (git diff in "-Subproject commit 1649e84… / +Subproject commit 13633f1…"). Bảo mọi người tự chạy --remote là lối tắt hấp dẫn, và kết cục là mỗi người đứng ở bản ui-kit mới nhất vào lúc họ chạy — trái ngược hẳn với ý nghĩa của việc ghim. submodule.recurse giúp pull tự cập nhật submodule, nhưng chỉ tới cái ghim đã được commit. Tag không liên quan gì.',
          },
          {
            question: 'Your SWP391 team (5 people, most only know add/commit/push) shares a private ui-kit repository. You cannot run a package registry, updates come about once a week, and you rarely send changes back. Which setup causes the least pain?|||Nhóm SWP391 của bạn (5 người, đa số chỉ biết add/commit/push) dùng chung một kho ui-kit riêng tư. Không dựng được registry gói, khoảng một tuần cập nhật một lần, và hiếm khi gửi sửa đổi ngược lại. Cách nào ít khổ nhất?',
            options: [
              'git subtree add --prefix vendor/ui-kit … --squash, with the pull command written into a script|||git subtree add --prefix vendor/ui-kit … --squash, và viết lệnh pull vào một script',
              'git submodule add, and remind everyone to clone with --recurse-submodules|||git submodule add, rồi nhắc mọi người clone với --recurse-submodules',
              'git clone ui-kit inside the project folder and add it to .gitignore|||git clone ui-kit vào trong thư mục dự án rồi thêm nó vào .gitignore',
              'Track the whole vendor/ui-kit folder with Git LFS|||Theo dõi cả thư mục vendor/ui-kit bằng Git LFS',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: With subtree the library arrives as ordinary files (mode 100644), so a plain clone just works and teammates need to learn nothing; one person runs the scripted subtree pull when an update is needed. Submodules are the tempting "proper" answer, but every member must remember --recurse-submodules, update --init and the push order — exactly the knowledge this team lacks. A nested clone in .gitignore means teammates get nothing at all, and LFS is for large binaries, not source code.|||VI: Với subtree, thư viện tới dưới dạng file thường (mode 100644), nên clone thường là chạy và bạn cùng nhóm không phải học gì; một người chạy lệnh subtree pull đã viết sẵn trong script khi cần cập nhật. Submodule là đáp án "bài bản" hấp dẫn, nhưng thành viên nào cũng phải nhớ --recurse-submodules, update --init và thứ tự push — đúng thứ nhóm này thiếu. Clone lồng rồi bỏ vào .gitignore thì bạn cùng nhóm chẳng nhận được gì, còn LFS dành cho file nhị phân lớn, không phải mã nguồn.',
          },
          {
            question: 'After git sparse-checkout set apps/web packages/ui, find apps packages -type f | wc -l prints 80 but git ls-files | wc -l prints 202. What is going on?|||Sau git sparse-checkout set apps/web packages/ui, find apps packages -type f | wc -l in ra 80 nhưng git ls-files | wc -l in ra 202. Chuyện gì đang xảy ra?',
            options: [
              'The clone is corrupted — 122 files failed to download|||Bản clone bị hỏng — 122 file tải về thất bại',
              'sparse-checkout deleted the other packages from history, but the index is stale|||sparse-checkout đã xoá các gói kia khỏi lịch sử, chỉ là index chưa cập nhật',
              'You forgot git sparse-checkout reapply after set|||Bạn quên chạy git sparse-checkout reapply sau set',
              'Normal: sparse-checkout only limits what is written to disk; the index and history still know all 202 files|||Bình thường: sparse-checkout chỉ giới hạn thứ được ghi ra đĩa; index và lịch sử vẫn biết đủ 202 file',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: sparse-checkout changes the working directory only. The other packages are still tracked and still in history — git log -- apps/admin keeps working, and disable writes them back. It never deletes anything from history, so "stale index" is wrong. reapply is for when patterns changed without being applied; set already applies them. Nothing failed to download: these are exactly the numbers from our test run.|||VI: sparse-checkout chỉ đổi thư mục làm việc. Các gói kia vẫn được theo dõi và vẫn nằm trong lịch sử — git log -- apps/admin vẫn chạy, và disable sẽ ghi chúng ra lại. Nó không bao giờ xoá gì khỏi lịch sử, nên "index chưa cập nhật" là sai. reapply dành cho lúc mẫu đã đổi mà chưa được áp; set đã áp luôn rồi. Cũng không có gì tải hỏng: đây đúng là những con số của lần chạy thử.',
          },
          {
            question: 'You cloned the monorepo with --filter=blob:none --sparse and only checked out apps/web. Now you run git show HEAD:apps/admin/f2.txt. What happens?|||Bạn clone monorepo với --filter=blob:none --sparse và chỉ checkout apps/web. Giờ bạn chạy git show HEAD:apps/admin/f2.txt. Chuyện gì xảy ra?',
            options: [
              'An error: that blob was filtered out and can never be read from this clone|||Báo lỗi: blob đó đã bị lọc và không bao giờ đọc được từ bản clone này',
              'An empty file, because apps/admin is outside the sparse cone|||Một file rỗng, vì apps/admin nằm ngoài vùng cone',
              'Git fetches the missing blob from the server on demand and prints it (it needs network access)|||Git tự lấy blob còn thiếu từ máy chủ khi cần rồi in ra (cần có mạng)',
              'You must run git sparse-checkout disable before Git will show it|||Bạn phải chạy git sparse-checkout disable thì Git mới cho xem',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: A partial clone keeps every commit and tree, and remembers the server it came from as a "promisor"; when a command needs a missing blob, Git fetches it lazily and carries on — in our test run the command printed the file’s content. So it is neither a permanent error nor an empty file. Sparse-checkout only decides what is written to disk; it does not stop you reading other paths from history, so disable is unnecessary.|||VI: Partial clone giữ mọi commit và tree, và nhớ máy chủ nguồn như một "promisor" (bên hứa giao sau); khi một lệnh cần blob còn thiếu, Git lấy về một cách lười biếng rồi chạy tiếp — trong lần chạy thử, lệnh đã in ra nội dung file. Nên đây không phải lỗi vĩnh viễn, cũng không phải file rỗng. Sparse-checkout chỉ quyết định thứ ghi ra đĩa; nó không cấm bạn đọc đường dẫn khác trong lịch sử, nên không cần disable.',
          },
          {
            question: 'A teammate who never installed git-lfs clones the design repository. The clone says "done.", but Photoshop cannot open design/hero.psd, and ls -l shows it is 132 bytes. What happened and what fixes it?|||Một bạn cùng nhóm chưa từng cài git-lfs clone kho thiết kế. Clone báo "done.", nhưng Photoshop không mở được design/hero.psd, và ls -l cho thấy nó nặng 132 byte. Chuyện gì đã xảy ra và sửa thế nào?',
            options: [
              'The clone was interrupted; delete the folder and clone again|||Clone bị ngắt giữa chừng; xoá thư mục rồi clone lại',
              'They got the LFS pointer file; install git-lfs, run git lfs install, then git lfs pull|||Họ nhận được file con trỏ LFS; cài git-lfs, chạy git lfs install, rồi git lfs pull',
              'GitHub truncates files over 100 MB; ask the designer to export a smaller file|||GitHub cắt file trên 100 MB; nhờ bạn thiết kế xuất file nhỏ hơn',
              'Remove -text from .gitattributes so Git stops converting the file|||Bỏ -text khỏi .gitattributes để Git thôi chuyển đổi file',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Without the LFS client, Git has no smudge filter, so it checks out exactly what it stores: the three-line pointer (version, oid, size) — 132 bytes in our test, against 5 242 880 for the real file. Installing git-lfs and running git lfs pull replaces pointers with the real content. Re-cloning without the client gives the same pointer again, which is why it is the tempting but useless answer. The file is 5 MB, far below any size limit, and -text only disables line-ending conversion.|||VI: Không có client LFS thì Git không có bộ lọc smudge, nên nó checkout đúng thứ nó lưu: con trỏ ba dòng (version, oid, size) — 132 byte trong lần chạy thử, so với 5 242 880 byte của file thật. Cài git-lfs rồi chạy git lfs pull sẽ thay con trỏ bằng nội dung thật. Clone lại mà không có client vẫn ra đúng con trỏ đó, nên đây là đáp án hấp dẫn mà vô dụng. File chỉ 5 MB, còn xa mọi giới hạn kích thước, còn -text chỉ tắt việc chuyển đổi ký tự xuống dòng.',
          },
          {
            question: 'Last month someone committed a 3 MB intro.mp4. Today you run git lfs track "*.mp4" and commit .gitattributes, yet git lfs ls-files prints nothing and every fresh clone is still just as heavy. What actually removes that weight?|||Tháng trước có người commit file intro.mp4 3 MB. Hôm nay bạn chạy git lfs track "*.mp4" và commit .gitattributes, vậy mà git lfs ls-files không in gì và mọi bản clone mới vẫn nặng y như cũ. Cái gì mới thật sự gỡ được sức nặng đó?',
            options: [
              'git gc --aggressive, so Git recompresses the video|||git gc --aggressive để Git nén lại video',
              'git lfs prune, which clears LFS files that are no longer needed|||git lfs prune, lệnh dọn các file LFS không còn cần',
              'Running git lfs track "*.mp4" again and recommitting .gitattributes|||Chạy lại git lfs track "*.mp4" rồi commit lại .gitattributes',
              'Rewriting history with git lfs migrate import (or filter-repo), then everyone re-clones|||Viết lại lịch sử bằng git lfs migrate import (hoặc filter-repo), rồi mọi người clone lại',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: LFS only affects files added after track; the video already sits in history as a normal 3 MB blob (git cat-file -s HEAD:intro.mp4 prints 3145728, and git lfs migrate info shows it). Only rewriting history moves it into LFS, with the usual cost: new hashes and a re-clone for everyone (Chapter 8). gc cannot shrink random video bytes, lfs prune only deletes old local LFS copies, and re-running track changes nothing about commits that already exist.|||VI: LFS chỉ tác động tới file add sau track; video đã nằm trong lịch sử dưới dạng một blob 3 MB bình thường (git cat-file -s HEAD:intro.mp4 in 3145728, và git lfs migrate info cũng chỉ ra nó). Chỉ viết lại lịch sử mới chuyển được nó vào LFS, kèm cái giá quen thuộc: mã băm mới và ai cũng phải clone lại (Chương 8). gc không nén được các byte video vốn đã nén, lfs prune chỉ xoá bản LFS cũ trên máy, còn chạy lại track không đổi gì ở những commit đã có.',
          },
        ],
      },
    },
  ],
};
