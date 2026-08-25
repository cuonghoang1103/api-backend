/**
 * Git & GitHub — Chương 10: Kho mã lớn & quy trình nâng cao.
 * worktree · submodule vs subtree · sparse-checkout + partial clone · Git LFS + monorepo · quiz.
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out đóng bằng </div> (KHÔNG </code></pre>). KHÔNG dùng <svg>.
 */
const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 10 — Big repositories & advanced workflows|||Chương 10 — Kho mã lớn & quy trình nâng cao',
  description: 'Những công cụ bạn cần khi một kho mã không còn vừa với mô hình "một thư mục, một nhánh": nhiều thư mục làm việc cùng lúc, ghép nhiều kho lại với nhau, chỉ lấy về phần bạn cần, và xử lý file nhị phân lớn.',
  lessons: [
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
<pre><code>git worktree list</code></pre>
<div class="out">/home/an/projects/api-backend  3f8a1c9 [feature/login]
/home/an/projects/api-hotfix   9e2d4b7 [main]</div>
<pre><code>git worktree add ../api-review pr-431      <span class="tok-comment"># existing branch</span>
git worktree add -b fix/urgent ../api-fix  <span class="tok-comment"># create the branch too</span>
git worktree add --detach ../api-v14 v1.4.0 <span class="tok-comment"># a tag, detached (3.1)</span>

git worktree remove ../api-hotfix          <span class="tok-comment"># delete it (refuses if dirty)</span>
git worktree prune                          <span class="tok-comment"># clean up after deleting a folder by hand</span></code></pre>
<div class="callout warn"><strong>The same branch cannot be checked out in two worktrees.</strong> Git refuses with "fatal: 'main' is already checked out at …". This is protection, not an inconvenience: two directories committing to one branch would produce a state neither of them expects. Use a different branch, or <code>--detach</code>.</div>

<h3>Where it genuinely helps</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hotfix during a feature</span><span class="v">The case above. No stash, no reinstall, no lost editor state.</span></div>
  <div class="kv"><span class="k">Reviewing a pull request</span><span class="v"><code>git worktree add ../review pr-431</code>, run it, delete the folder. Your own work never moves.</span></div>
  <div class="kv"><span class="k">Comparing two versions side by side</span><span class="v">Two terminals, two servers, two browser tabs — old and new behaviour at once.</span></div>
  <div class="kv"><span class="k">Long builds</span><span class="v">A Rust or C++ build that takes twenty minutes keeps its cache per directory. Switching branches in place throws that away.</span></div>
  <div class="kv"><span class="k">Documentation branches</span><span class="v">A <code>gh-pages</code> worktree that stays checked out, so publishing is a commit rather than a branch dance.</span></div>
</div>

<h3>What lives where</h3>
<pre><code>cat ../api-hotfix/.git</code></pre>
<div class="out">gitdir: /home/an/projects/api-backend/.git/worktrees/api-hotfix</div>
<p>A linked worktree has a <code>.git</code> <em>file</em>, not a directory — it points back at the main repository. Per-worktree state (HEAD, index, reflog) lives under <code>.git/worktrees/&lt;name&gt;/</code>; objects and refs stay shared. That is exactly the design that makes them cheap.</p>

<h3>Things to know before relying on it</h3>
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
<pre><code>git worktree list</code></pre>
<div class="out">/home/an/projects/api-backend  3f8a1c9 [feature/login]
/home/an/projects/api-hotfix   9e2d4b7 [main]</div>
<pre><code>git worktree add ../api-review pr-431      <span class="tok-comment"># nhánh đã có</span>
git worktree add -b fix/urgent ../api-fix  <span class="tok-comment"># tạo luôn cả nhánh</span>
git worktree add --detach ../api-v14 v1.4.0 <span class="tok-comment"># một tag, ở dạng lìa cành (bài 3.1)</span>

git worktree remove ../api-hotfix          <span class="tok-comment"># xoá nó (từ chối nếu còn thay đổi)</span>
git worktree prune                          <span class="tok-comment"># dọn sau khi bạn xoá thư mục bằng tay</span></code></pre>
<div class="callout warn"><strong>Cùng một nhánh KHÔNG checkout được ở hai worktree.</strong> Git từ chối với "fatal: 'main' is already checked out at …". Đây là sự bảo vệ, không phải sự phiền phức: hai thư mục cùng commit lên một nhánh sẽ sinh ra một trạng thái mà không bên nào lường được. Hãy dùng nhánh khác, hoặc <code>--detach</code>.</div>

<h3>Chỗ nó thật sự giúp được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hotfix giữa lúc làm tính năng</span><span class="v">Đúng tình huống ở trên. Không stash, không cài lại, không mất trạng thái trình soạn thảo.</span></div>
  <div class="kv"><span class="k">Review một pull request</span><span class="v"><code>git worktree add ../review pr-431</code>, chạy thử, rồi xoá thư mục. Công việc của bạn không hề nhúc nhích.</span></div>
  <div class="kv"><span class="k">So hai phiên bản cạnh nhau</span><span class="v">Hai terminal, hai server, hai tab trình duyệt — hành vi cũ và mới cùng lúc.</span></div>
  <div class="kv"><span class="k">Bản dựng lâu</span><span class="v">Một bản dựng Rust hay C++ mất hai mươi phút giữ được cache riêng cho từng thư mục. Đổi nhánh tại chỗ là vứt cache đó đi.</span></div>
  <div class="kv"><span class="k">Nhánh tài liệu</span><span class="v">Một worktree <code>gh-pages</code> luôn ở trạng thái checkout, nên việc xuất bản chỉ là một commit thay vì một màn nhảy nhánh.</span></div>
</div>

<h3>Cái gì nằm ở đâu</h3>
<pre><code>cat ../api-hotfix/.git</code></pre>
<div class="out">gitdir: /home/an/projects/api-backend/.git/worktrees/api-hotfix</div>
<p>Một worktree liên kết có <code>.git</code> là một <em>FILE</em>, không phải thư mục — nó trỏ ngược về kho chính. Trạng thái riêng của từng worktree (HEAD, index, reflog) nằm dưới <code>.git/worktrees/&lt;tên&gt;/</code>; còn đối tượng và ref thì dùng chung. Đó chính là thiết kế làm cho chúng rẻ.</p>

<h3>Những thứ cần biết trước khi dựa vào nó</h3>
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
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">A plain clone gives empty folders</span><span class="lz-v">Forget <code>--recurse-submodules</code> and the build fails in a way that never mentions submodules. Every new team member hits this once.</span></div>
  <div class="lz-layer"><span class="lz-k">The pin does not follow branches</span><span class="lz-v">A submodule tracks a <em>commit</em>, not a branch. New upstream work never arrives until someone runs <code>--remote</code> and commits the new pin.</span></div>
  <div class="lz-layer"><span class="lz-k">Detached HEAD inside</span><span class="lz-v">The submodule is checked out at a commit, so editing there commits to nowhere unless you <code>git switch main</code> first (3.1).</span></div>
  <div class="lz-layer"><span class="lz-k">Two pushes, in order</span><span class="lz-v">Push the submodule first, then the parent. Reverse the order and colleagues get a pin pointing at a commit that does not exist on the server.</span></div>
  <div class="lz-layer"><span class="lz-k">Merge conflicts on the gitlink</span><span class="lz-v">Two branches pinning different commits conflict on a line that is just a hash. Resolve by choosing the right commit, not by editing text.</span></div>
</div>

<h3>Subtree — the code, merged in</h3>
<pre><code>git subtree add --prefix vendor/ui-kit \\
  https://github.com/cuonghoang1103/ui-kit.git main --squash</code></pre>
<p>This copies the library's files into <code>vendor/ui-kit/</code> as <strong>real files in your repository</strong>. Clone works normally, no extra commands, no empty folders, and someone who has never heard of subtree can work in the repository without noticing.</p>
<pre><code><span class="tok-comment"># Pull upstream changes in:</span>
git subtree pull --prefix vendor/ui-kit &lt;url&gt; main --squash

<span class="tok-comment"># Push your local changes back to the library:</span>
git subtree push --prefix vendor/ui-kit &lt;url&gt; feature/from-app</code></pre>
<div class="callout warn">The cost is repository size and history noise: the library's files live in your history forever, and every update adds a merge. <code>--squash</code> keeps it to one commit per update, which is almost always what you want. And the commands are long enough that people forget them — write them into a Makefile or a script the day you adopt subtree.</div>

<h3>Choosing</h3>
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

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Tools-Submodules" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 7.11 — Submodules</span><span class="lc-sub">Including the "Issues with Submodules" section, which is refreshingly honest.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-subtree" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">git-subtree — add, pull, push, split</span><span class="lc-sub"><code>split</code> is how you extract a subdirectory back into its own repository with history.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> pushing the parent repository before pushing the submodule. Your parent commit pins a submodule commit that exists only on your machine, so every colleague's <code>submodule update</code> fails with "fatal: reference is not a tree". Always push the submodule first. <code>git push --recurse-submodules=check</code> makes Git refuse the parent push when a pinned submodule commit is missing upstream — set it and forget the ordering rule.</div>
<p class="note-ct"><strong>The honest summary:</strong> submodules are a precise tool with a steep coordination cost, subtrees trade repository size for everyone else's convenience, and a package manager beats both whenever it is available. Choose deliberately, write the commands down for your team, and revisit the decision when the dependency becomes publishable.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Hai cách đặt một kho mã vào bên trong kho mã khác</h2>
<p class="lead">Bạn có một thư viện thành phần dùng chung và ba ứng dụng dùng nó. Git cho hai cơ chế, chúng hành xử rất khác nhau, và cả hai đều nổi tiếng là gây khổ. Bài này giải thích mỗi cái thật sự làm gì, để bạn chọn — hoặc từ chối cả hai, thứ thường là lựa chọn đúng.</p>

<h3>Submodule — một con trỏ được ghim</h3>
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
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Clone thường cho ra thư mục trống</span><span class="lz-v">Quên <code>--recurse-submodules</code> là bản dựng hỏng theo một kiểu chẳng bao giờ nhắc tới chữ submodule. Người mới nào vào nhóm cũng dính một lần.</span></div>
  <div class="lz-layer"><span class="lz-k">Cái ghim không đi theo nhánh</span><span class="lz-v">Một submodule theo dõi một <em>COMMIT</em>, không theo dõi một nhánh. Công việc mới ở thượng nguồn không bao giờ tới cho tới khi có người chạy <code>--remote</code> rồi commit cái ghim mới.</span></div>
  <div class="lz-layer"><span class="lz-k">HEAD lìa cành ở bên trong</span><span class="lz-v">Submodule được checkout tại một commit, nên sửa ở đó là commit vào hư không trừ khi bạn <code>git switch main</code> trước (bài 3.1).</span></div>
  <div class="lz-layer"><span class="lz-k">Hai lần push, đúng thứ tự</span><span class="lz-v">Push submodule trước, rồi mới tới kho cha. Đảo thứ tự là đồng nghiệp nhận một cái ghim trỏ vào commit không tồn tại trên máy chủ.</span></div>
  <div class="lz-layer"><span class="lz-k">Xung đột hợp nhất trên gitlink</span><span class="lz-v">Hai nhánh ghim hai commit khác nhau sẽ xung đột trên một dòng vốn chỉ là một mã băm. Hãy giải bằng cách chọn đúng commit, đừng giải bằng cách sửa chữ.</span></div>
</div>

<h3>Subtree — mã nguồn, được hợp nhất thẳng vào</h3>
<pre><code>git subtree add --prefix vendor/ui-kit \\
  https://github.com/cuonghoang1103/ui-kit.git main --squash</code></pre>
<p>Lệnh này chép file của thư viện vào <code>vendor/ui-kit/</code> dưới dạng <strong>file THẬT trong kho của bạn</strong>. Clone chạy bình thường, không lệnh thêm, không thư mục trống, và một người chưa từng nghe tới subtree vẫn làm việc trong kho mà không nhận ra gì.</p>
<pre><code><span class="tok-comment"># Kéo thay đổi từ thượng nguồn về:</span>
git subtree pull --prefix vendor/ui-kit &lt;url&gt; main --squash

<span class="tok-comment"># Đẩy thay đổi cục bộ của bạn ngược lên thư viện:</span>
git subtree push --prefix vendor/ui-kit &lt;url&gt; feature/from-app</code></pre>
<div class="callout warn">Cái giá là kích thước kho và tiếng ồn trong lịch sử: file của thư viện sống trong lịch sử của bạn mãi mãi, và mỗi lần cập nhật thêm một lần merge. <code>--squash</code> giữ nó ở mức một commit cho mỗi lần cập nhật, và đó gần như luôn là thứ bạn muốn. Còn các lệnh thì dài tới mức người ta quên — hãy viết chúng vào một Makefile hay một script ngay ngày bạn nhận subtree.</div>

<h3>Chọn cái nào</h3>
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

<a class="link-card" href="https://git-scm.com/book/vi/v2/C%C3%A1c-C%C3%B4ng-C%E1%BB%A5-Git-Submodules" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 7.11 (tiếng Việt) — Submodule</span><span class="lc-sub">Gồm cả mục "Vấn đề với Submodule", viết rất thẳng thắn.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-subtree" target="_blank" rel="noopener">
  <span class="lc-ico">🌱</span>
  <span class="lc-body"><span class="lc-title">git-subtree — add, pull, push, split</span><span class="lc-sub"><code>split</code> là cách bạn tách một thư mục con ra thành kho riêng kèm lịch sử.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> push kho cha trước khi push submodule. Commit ở kho cha ghim một commit submodule chỉ tồn tại trên máy bạn, nên lệnh <code>submodule update</code> của mọi đồng nghiệp hỏng với "fatal: reference is not a tree". Hãy luôn push submodule trước. <code>git push --recurse-submodules=check</code> làm Git từ chối push kho cha khi một commit submodule được ghim còn thiếu ở thượng nguồn — hãy đặt nó rồi quên luôn cái luật thứ tự.</div>
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
<div class="callout ok"><strong>Cone mode</strong> (the default since Git 2.26) restricts patterns to whole directories rather than arbitrary globs. That sounds limiting and is the reason it is fast: Git can decide inclusion by directory prefix instead of matching every path against every pattern. Use <code>--no-cone</code> only if you genuinely need file-level patterns, and expect it to be slower.</div>

<h3>Running CI only on what changed</h3>
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
<div class="callout ok"><strong>Chế độ cone</strong> (mặc định từ Git 2.26) giới hạn các mẫu vào nguyên thư mục thay vì glob tuỳ ý. Nghe có vẻ gò bó và đó chính là lý do nó nhanh: Git quyết định gồm hay không bằng tiền tố thư mục thay vì đem mọi đường dẫn khớp với mọi mẫu. Chỉ dùng <code>--no-cone</code> nếu bạn thật sự cần mẫu ở mức từng file, và hãy chờ đợi nó chậm hơn.</div>

<h3>Chạy CI chỉ trên phần đã đổi</h3>
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
      description: 'Tám câu về worktree, gitlink mode 160000, thứ tự push submodule, subtree vs package manager, sparse-checkout cone mode, và giới hạn của Git LFS.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on scale and advanced workflows. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: the push order for submodules (10.2), and what LFS does <em>not</em> fix (10.3).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về quy mô và quy trình nâng cao. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: thứ tự push với submodule (bài 10.2), và LFS <em>KHÔNG</em> sửa được gì (bài 10.3).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does a second git worktree share with the main one?|||Một worktree thứ hai dùng chung gì với worktree chính?',
            options: [
              'Nothing — it is a full clone|||Không gì cả — nó là một bản clone đầy đủ',
              'The object database and refs; each worktree has its own HEAD, index and working directory|||Kho đối tượng và các ref; mỗi worktree có HEAD, index và thư mục làm việc riêng',
              'The working directory, but separate objects|||Thư mục làm việc, nhưng đối tượng thì riêng',
              'Only the config file|||Chỉ file cấu hình',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does Git refuse to check out the same branch in two worktrees?|||Vì sao Git từ chối checkout cùng một nhánh ở hai worktree?',
            options: [
              'A licensing restriction|||Một hạn chế về giấy phép',
              'Two directories committing to one branch would produce a state neither expects — it is protection, not a limitation|||Hai thư mục cùng commit lên một nhánh sẽ sinh ra trạng thái mà không bên nào lường được — đó là sự bảo vệ, không phải hạn chế',
              'It would double disk usage|||Nó sẽ làm gấp đôi dung lượng đĩa',
              'Only bare repositories allow it|||Chỉ kho trần mới cho phép',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In "git ls-files --stage", what does mode 160000 mean?|||Trong "git ls-files --stage", chế độ 160000 nghĩa là gì?',
            options: [
              'An executable file|||Một file thực thi được',
              'A gitlink — a pointer to one specific commit in another repository (a submodule)|||Một gitlink — con trỏ tới đúng một commit trong một kho mã khác (một submodule)',
              'A symbolic link|||Một liên kết tượng trưng',
              'A file stored in Git LFS|||Một file lưu trong Git LFS',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You changed code in a submodule. In what order do you push?|||Bạn vừa sửa mã trong một submodule. Push theo thứ tự nào?',
            options: [
              'Parent first, then the submodule|||Kho cha trước, rồi tới submodule',
              'Submodule FIRST, then the parent — otherwise the parent pins a commit that does not exist upstream|||Submodule TRƯỚC, rồi mới tới kho cha — nếu không, kho cha ghim một commit không tồn tại ở thượng nguồn',
              'Order does not matter|||Thứ tự không quan trọng',
              'They must be pushed in the same command|||Chúng phải được push trong cùng một lệnh',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the main practical advantage of subtree over submodule?|||Ưu điểm thực tế chính của subtree so với submodule là gì?',
            options: [
              'It uses less disk space|||Nó tốn ít dung lượng đĩa hơn',
              'Consumers need no special knowledge — a normal clone just works, with no extra commands and no empty folders|||Người dùng không cần biết gì đặc biệt — clone bình thường là chạy, không lệnh thêm, không thư mục trống',
              'It pins an exact version|||Nó ghim một phiên bản chính xác',
              'It supports binary files better|||Nó xử lý file nhị phân tốt hơn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does sparse-checkout change?|||sparse-checkout thay đổi cái gì?',
            options: [
              'Which commits exist in history|||Những commit nào tồn tại trong lịch sử',
              'Which files are written to the working directory — history stays complete and fetchable|||Những file nào được ghi ra thư mục làm việc — lịch sử vẫn đầy đủ và vẫn lấy về được',
              'Which branches you can check out|||Những nhánh nào bạn checkout được',
              'The remote URL|||URL của remote',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You enable Git LFS today. Does the repository get smaller?|||Bạn bật Git LFS hôm nay. Kho mã có nhỏ lại không?',
            options: [
              'Yes, immediately|||Có, ngay lập tức',
              'No — LFS only affects files committed AFTER it is configured; existing large files stay in history until you rewrite it|||Không — LFS chỉ tác động tới file được commit SAU khi cấu hình; những file lớn đã có vẫn nằm trong lịch sử cho tới khi bạn viết lại nó',
              'Yes, after running git gc|||Có, sau khi chạy git gc',
              'Only for files under 1 MB|||Chỉ với file dưới 1 MB',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A colleague without git-lfs installed clones the repository. What do they get?|||Một đồng nghiệp chưa cài git-lfs clone kho mã về. Họ nhận được gì?',
            options: [
              'A clone error|||Một lỗi khi clone',
              'The three-line pointer file instead of the real binary — so the app silently fails to load an asset that looks committed|||File con trỏ ba dòng thay vì file nhị phân thật — nên ứng dụng âm thầm không nạp được một tài sản trông như đã được commit',
              'The binary, downloaded automatically|||File nhị phân, tải về tự động',
              'An empty file|||Một file rỗng',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
