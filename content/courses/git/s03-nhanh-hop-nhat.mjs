/**
 * Git & GitHub — Chương 3: Nhánh & hợp nhất.
 * Nhánh là một file 41 byte · fast-forward vs merge 3 chiều · xung đột (đọc và giải)
 * · rebase vs merge · rebase tương tác (gộp, đổi lời, đổi thứ tự).
 * Output CHẠY THẬT git 2.43. LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;;
 * & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 3 — Branching & merging|||Chương 3 — Nhánh & hợp nhất',
  description: 'Nhánh là thứ Git làm rẻ nhất và cũng là thứ người ta sợ nhất. Chương này cho thấy một nhánh thật ra chỉ là một file 41 byte, hai kiểu hợp nhất khác nhau ra sao, cách đọc và giải một xung đột mà không hoảng, và khi nào rebase tốt hơn merge — kèm ranh giới an toàn của nó.',
  lessons: [
    /* ─────────────────────────── 3.1 ─────────────────────────── */
    {
      title: '3.1 — A branch is a 41-byte file|||3.1 — Một nhánh là một file 41 byte',
      slug: 'git-3-1-nhanh-la-gi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mở .git/refs/heads/ ra xem một nhánh thật sự là gì, vì sao tạo nhánh trong Git tức thì còn ở SVN thì tốn phút, HEAD trỏ vào đâu, và switch vs checkout.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Open the box: a branch is one line of text</h2>
<p class="lead">People arrive at Git from systems where "make a branch" meant copying the entire source tree — minutes of waiting, gigabytes of disk. That history is why branching still <em>feels</em> heavy. In Git it is not. Let us prove it rather than assert it.</p>

<pre><code>cd ~/git-lab
git branch feature/login
cat .git/refs/heads/feature/login</code></pre>
<div class="out">3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d</div>
<p>That is the entire branch: a file containing one commit hash — 40 characters plus a newline, 41 bytes. Creating it copied nothing, and took under a millisecond. Deleting it deletes 41 bytes.</p>
<div class="callout ok">This is the single most freeing fact in Git. Branches are so cheap that the correct instinct is to make one for <em>everything</em> — an experiment you will probably throw away, a spike, a "let me just try something". You are not committing to anything by branching. You are creating a 41-byte bookmark.</div>

<h3>Where you are: HEAD</h3>
<pre><code>cat .git/HEAD</code></pre>
<div class="out">ref: refs/heads/main</div>
<p><code>HEAD</code> is a pointer to a <em>pointer</em>. It does not name a commit directly; it names the branch you are on, and the branch names the commit. That indirection is what makes committing work:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">You commit</div><div class="lz-d">Git writes a new commit object whose parent is the current one.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Git follows HEAD</div><div class="lz-d">HEAD says "refs/heads/main", so main is the branch that must move.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">The branch file is rewritten</div><div class="lz-d">.git/refs/heads/main now holds the new hash. Other branches are untouched.</div></div>
</div>
<p>"Being on a branch" means exactly this: <strong>new commits move that pointer forward</strong>. Nothing more mystical is happening.</p>

<h3>Creating and switching</h3>
<pre><code>git branch feature/login          <span class="tok-comment"># create, stay where you are</span>
git switch feature/login          <span class="tok-comment"># move onto it</span>
git switch -c feature/login       <span class="tok-comment"># create AND switch — what you normally want</span>
git switch -                      <span class="tok-comment"># back to the previous branch (like cd -)</span>
git switch main                   <span class="tok-comment"># by name</span></code></pre>
<div class="out">Switched to a new branch 'feature/login'</div>
<div class="callout warn">You will see <code>git checkout -b feature/login</code> everywhere online. It does the same thing and still works. Git 2.23 split the old overloaded <code>checkout</code> into <code>switch</code> (branches) and <code>restore</code> (file content) precisely because one command doing both caused years of accidents — <code>git checkout somefile</code> silently destroying edits when you meant to change branch. Prefer the new pair; recognise the old one in other people's instructions.</div>

<h3>What a switch actually does</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">1. Moves HEAD</span><span class="lz-v">Rewrites <code>.git/HEAD</code> to name the new branch. Instant.</span></div>
  <div class="lz-layer"><span class="lz-k">2. Rewrites the index</span><span class="lz-v">Loads the target commit's tree into the staging area.</span></div>
  <div class="lz-layer"><span class="lz-k">3. Updates the working directory</span><span class="lz-v">Adds, removes and rewrites <em>only the files that differ</em> between the two commits. This is why switching is fast even on huge repositories.</span></div>
</div>
<p>Step 3 is also why Git refuses to switch when you have uncommitted changes to a file that differs between the branches — it would have to overwrite your work. The three ways out are Chapter 4's material: commit, stash, or discard.</p>

<h3>Naming branches so a team can read them</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">feature/user-profile</span><span class="v">New functionality. The prefix groups them in listings and in most Git GUIs.</span></div>
  <div class="kv"><span class="k">fix/login-500</span><span class="v">A bug fix. Naming the symptom beats naming the file.</span></div>
  <div class="kv"><span class="k">chore/bump-prisma</span><span class="v">Maintenance with no user-visible change.</span></div>
  <div class="kv"><span class="k">an/experiment-webgl</span><span class="v">Personal scratch space, prefixed with your initials. Nobody else will touch it.</span></div>
</div>
<p>Two mechanical rules: no spaces (they need quoting forever), and slashes are just characters — <code>feature/login</code> creates a real subdirectory under <code>refs/heads/</code>, which is why you cannot have both a branch <code>feature</code> and a branch <code>feature/login</code>. Git tells you so with "cannot lock ref".</p>

<h3>Listing and cleaning up</h3>
<pre><code>git branch                    <span class="tok-comment"># local branches; * marks the current one</span>
git branch -v                 <span class="tok-comment"># with the last commit of each</span>
git branch -a                 <span class="tok-comment"># include remote-tracking branches</span>
git branch --merged main      <span class="tok-comment"># fully merged into main — safe to delete</span>
git branch --no-merged main   <span class="tok-comment"># still carry unique work</span></code></pre>
<div class="out">* feature/login  3f8a1c9 fix: reject expired refresh tokens
  main           7b3e9d1 refactor(api): extract pagination
  fix/feed-500   9e2d4b7 fix(feed): stop 500 when a post has no author</div>
<pre><code>git branch -d feature/login   <span class="tok-comment"># delete — REFUSES if it has unmerged commits</span>
git branch -D feature/login   <span class="tok-comment"># force delete — no questions asked</span>
git branch -m old-name new-name   <span class="tok-comment"># rename</span></code></pre>
<div class="callout ok">Use <code>-d</code>, never <code>-D</code>, as your default. Lowercase <code>-d</code> is a safety check: it refuses when the branch holds commits that exist nowhere else. When it refuses, that is information — either merge the work or deliberately choose <code>-D</code>. And even after <code>-D</code>, the commits survive in the reflog for 30 days (Chapter 4.4), so this is recoverable.</div>

<h3>Detached HEAD — not an error, just a state</h3>
<pre><code>git switch --detach HEAD~3
cat .git/HEAD</code></pre>
<div class="out">3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d</div>
<p><code>HEAD</code> now holds a commit hash directly instead of a branch name. Everything works normally, with one catch: commits you make here move <em>no branch pointer</em>, so as soon as you switch away nothing refers to them and they become garbage.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">safe</div><div class="lz-t">Looking around</div><div class="lz-d">Checking out an old commit to build or test it. Switch back and nothing is lost.</div></div>
  <div class="lz-step"><div class="lz-k">risky</div><div class="lz-t">Committing there</div><div class="lz-d">The commits are real but unreferenced. Give them a home before leaving: <code>git switch -c rescue</code>.</div></div>
  <div class="lz-step"><div class="lz-k">recovery</div><div class="lz-t">Already switched away</div><div class="lz-d"><code>git reflog</code> still lists them for 30 days. Chapter 4.4 and 13.5.</div></div>
</div>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 3.1 — Branches in a Nutshell</span><span class="lc-sub">The same "a branch is a pointer" idea, with the book's diagrams.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-switch" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">git-switch — the modern replacement for checkout</span><span class="lc-sub">Includes <code>--detach</code>, <code>-c</code>, and what happens to uncommitted changes.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> treating "detached HEAD" as an error to escape from as fast as possible. It is a normal state — <code>git bisect</code> puts you there on purpose. The only real hazard is <em>committing</em> while detached and then switching away. If you have made commits there, run <code>git switch -c some-name</code> first; that creates a branch pointing at them and they are safe.</div>
<p class="note-ct"><strong>The habit worth building:</strong> branch for everything, including work you expect to throw away. A branch costs 41 bytes and one command, and having one means you can always get back to a known-good state with <code>git switch main</code>. The alternative — experimenting directly on <code>main</code> — is how people end up with work they cannot separate from work they wanted to keep.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Mở nắp hộp ra: một nhánh là một dòng chữ</h2>
<p class="lead">Người ta đến với Git từ những hệ mà "tạo nhánh" nghĩa là chép cả cây mã nguồn — chờ vài phút, tốn vài gigabyte. Lịch sử đó là lý do việc tạo nhánh tới giờ vẫn <em>có cảm giác</em> nặng nề. Trong Git thì không. Hãy chứng minh thay vì khẳng định suông.</p>

<pre><code>cd ~/git-lab
git branch feature/login
cat .git/refs/heads/feature/login</code></pre>
<div class="out">3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d</div>
<p>Đó là TOÀN BỘ cái nhánh: một file chứa một mã băm commit — 40 ký tự cộng một dấu xuống dòng, 41 byte. Tạo nó không chép gì cả, và mất chưa tới một phần nghìn giây. Xoá nó là xoá 41 byte.</p>
<div class="callout ok">Đây là sự thật giải phóng nhất trong Git. Nhánh rẻ tới mức bản năng đúng là tạo một cái cho <em>mọi thứ</em> — một thí nghiệm chắc sẽ vứt đi, một lần thử nhanh, một cái "để tôi thử cái này xem". Bạn không cam kết với điều gì khi tạo nhánh. Bạn đang tạo một cái đánh dấu trang 41 byte.</div>

<h3>Bạn đang ở đâu: HEAD</h3>
<pre><code>cat .git/HEAD</code></pre>
<div class="out">ref: refs/heads/main</div>
<p><code>HEAD</code> là con trỏ tới một <em>con trỏ</em>. Nó không gọi tên một commit trực tiếp; nó gọi tên cái nhánh bạn đang đứng, và cái nhánh mới gọi tên commit. Chính lớp gián tiếp đó làm cho việc commit chạy được:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Bạn commit</div><div class="lz-d">Git ghi một đối tượng commit mới có cha là commit hiện tại.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Git đi theo HEAD</div><div class="lz-d">HEAD nói "refs/heads/main", vậy main là nhánh phải dời.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">File nhánh được ghi lại</div><div class="lz-d">.git/refs/heads/main giờ giữ mã băm mới. Các nhánh khác không bị đụng tới.</div></div>
</div>
<p>"Đang ở trên một nhánh" nghĩa chính xác là thế này: <strong>commit mới dời con trỏ đó tiến lên</strong>. Không có gì huyền bí hơn đang diễn ra cả.</p>

<h3>Tạo và chuyển</h3>
<pre><code>git branch feature/login          <span class="tok-comment"># tạo, vẫn đứng nguyên chỗ cũ</span>
git switch feature/login          <span class="tok-comment"># bước sang nó</span>
git switch -c feature/login       <span class="tok-comment"># tạo VÀ chuyển — thứ bạn thường muốn</span>
git switch -                      <span class="tok-comment"># về nhánh trước đó (như cd -)</span>
git switch main                   <span class="tok-comment"># theo tên</span></code></pre>
<div class="out">Switched to a new branch 'feature/login'</div>
<div class="callout warn">Bạn sẽ thấy <code>git checkout -b feature/login</code> ở khắp nơi trên mạng. Nó làm cùng một việc và tới giờ vẫn chạy. Git 2.23 tách lệnh <code>checkout</code> quá tải cũ thành <code>switch</code> (nhánh) và <code>restore</code> (nội dung file) chính vì một lệnh làm hai việc đã gây tai nạn suốt nhiều năm — <code>git checkout somefile</code> âm thầm huỷ sửa đổi trong khi bạn định đổi nhánh. Hãy ưu tiên cặp mới; và nhận ra cái cũ trong hướng dẫn của người khác.</div>

<h3>Một lần switch thật sự làm gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">1. Dời HEAD</span><span class="lz-v">Ghi lại <code>.git/HEAD</code> để gọi tên nhánh mới. Tức thì.</span></div>
  <div class="lz-layer"><span class="lz-k">2. Ghi lại index</span><span class="lz-v">Nạp tree của commit đích vào vùng staging.</span></div>
  <div class="lz-layer"><span class="lz-k">3. Cập nhật thư mục làm việc</span><span class="lz-v">Thêm, xoá và ghi lại <em>chỉ những file khác nhau</em> giữa hai commit. Vì thế chuyển nhánh vẫn nhanh trên kho khổng lồ.</span></div>
</div>
<p>Bước 3 cũng là lý do Git từ chối chuyển nhánh khi bạn có sửa đổi chưa commit trên một file khác nhau giữa hai nhánh — nó sẽ phải ghi đè lên việc của bạn. Ba lối ra là nội dung Chương 4: commit, stash, hoặc vứt bỏ.</p>

<h3>Đặt tên nhánh sao cho cả nhóm đọc được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">feature/user-profile</span><span class="v">Chức năng mới. Tiền tố gom chúng lại trong danh sách và trong hầu hết GUI của Git.</span></div>
  <div class="kv"><span class="k">fix/login-500</span><span class="v">Sửa lỗi. Gọi tên triệu chứng thì hơn gọi tên file.</span></div>
  <div class="kv"><span class="k">chore/bump-prisma</span><span class="v">Bảo trì, người dùng không thấy gì đổi.</span></div>
  <div class="kv"><span class="k">an/experiment-webgl</span><span class="v">Chỗ nháp cá nhân, gắn tiền tố là tên viết tắt của bạn. Không ai khác sẽ đụng vào.</span></div>
</div>
<p>Hai luật cơ học: không có dấu cách (sẽ phải bỏ trong nháy suốt đời), và dấu gạch chéo chỉ là ký tự — <code>feature/login</code> tạo ra một thư mục con thật dưới <code>refs/heads/</code>, và vì thế bạn không thể có đồng thời một nhánh <code>feature</code> và một nhánh <code>feature/login</code>. Git báo cho bạn bằng "cannot lock ref".</p>

<h3>Liệt kê và dọn dẹp</h3>
<pre><code>git branch                    <span class="tok-comment"># nhánh cục bộ; dấu * là nhánh hiện tại</span>
git branch -v                 <span class="tok-comment"># kèm commit cuối của từng nhánh</span>
git branch -a                 <span class="tok-comment"># gồm cả nhánh theo dõi remote</span>
git branch --merged main      <span class="tok-comment"># đã hợp nhất trọn vào main — xoá được an toàn</span>
git branch --no-merged main   <span class="tok-comment"># vẫn mang công việc riêng</span></code></pre>
<div class="out">* feature/login  3f8a1c9 fix: reject expired refresh tokens
  main           7b3e9d1 refactor(api): extract pagination
  fix/feed-500   9e2d4b7 fix(feed): stop 500 when a post has no author</div>
<pre><code>git branch -d feature/login   <span class="tok-comment"># xoá — TỪ CHỐI nếu còn commit chưa hợp nhất</span>
git branch -D feature/login   <span class="tok-comment"># xoá ép — không hỏi han gì</span>
git branch -m ten-cu ten-moi  <span class="tok-comment"># đổi tên</span></code></pre>
<div class="callout ok">Hãy để <code>-d</code>, không phải <code>-D</code>, làm mặc định của bạn. Chữ <code>-d</code> thường là một chốt an toàn: nó từ chối khi nhánh giữ những commit không tồn tại ở chỗ nào khác. Khi nó từ chối, đó là THÔNG TIN — hoặc bạn hợp nhất phần việc đó, hoặc bạn chủ ý chọn <code>-D</code>. Và kể cả sau <code>-D</code>, các commit vẫn sống trong reflog 30 ngày (bài 4.4), nên chuyện này cứu được.</div>

<h3>HEAD lìa cành — không phải lỗi, chỉ là một trạng thái</h3>
<pre><code>git switch --detach HEAD~3
cat .git/HEAD</code></pre>
<div class="out">3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d</div>
<p><code>HEAD</code> giờ giữ thẳng một mã băm commit thay vì tên một nhánh. Mọi thứ chạy bình thường, trừ một điều: commit bạn tạo ở đây <em>không dời con trỏ nhánh nào</em>, nên vừa chuyển đi chỗ khác là không còn gì trỏ tới chúng và chúng thành rác.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">an toàn</div><div class="lz-t">Chỉ ngó nghiêng</div><div class="lz-d">Checkout một commit cũ để dựng hay để test. Chuyển về là không mất gì.</div></div>
  <div class="lz-step"><div class="lz-k">rủi ro</div><div class="lz-t">Commit ở đó</div><div class="lz-d">Các commit là thật nhưng không được ai trỏ tới. Hãy cho chúng một mái nhà trước khi rời đi: <code>git switch -c rescue</code>.</div></div>
  <div class="lz-step"><div class="lz-k">cứu hộ</div><div class="lz-t">Lỡ chuyển đi rồi</div><div class="lz-d"><code>git reflog</code> vẫn liệt kê chúng trong 30 ngày. Bài 4.4 và 13.5.</div></div>
</div>

<a class="link-card" href="https://git-scm.com/book/vi/v2/Nh%C3%A1nh-Nh%C3%A1nh-Trong-Git-L%C3%A0-G%C3%AC" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 3.1 (tiếng Việt) — Nhánh trong Git là gì</span><span class="lc-sub">Cùng ý "một nhánh là một con trỏ", kèm sơ đồ của sách.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-switch" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">git-switch — bản thay thế đời mới cho checkout</span><span class="lc-sub">Gồm <code>--detach</code>, <code>-c</code>, và chuyện gì xảy ra với sửa đổi chưa commit.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> coi "detached HEAD" là một lỗi phải thoát ra càng nhanh càng tốt. Nó là một trạng thái bình thường — <code>git bisect</code> cố tình đặt bạn vào đó. Nguy hiểm thật sự duy nhất là <em>commit</em> khi đang lìa cành rồi chuyển đi. Nếu bạn đã tạo commit ở đó, hãy chạy <code>git switch -c một-cái-tên</code> trước; nó tạo một nhánh trỏ tới chúng và chúng an toàn.</div>
<p class="note-ct"><strong>Thói quen đáng tạo:</strong> tạo nhánh cho mọi thứ, kể cả việc bạn nghĩ sẽ vứt đi. Một nhánh tốn 41 byte và một lệnh, và có nó nghĩa là bạn luôn quay về được trạng thái tốt đã biết bằng <code>git switch main</code>. Phương án còn lại — thí nghiệm thẳng trên <code>main</code> — là cách người ta rơi vào cảnh có một mớ việc không tách nổi khỏi phần việc muốn giữ.</p>
</div>
`,
    },

    /* ─────────────────────────── 3.2 ─────────────────────────── */
    {
      title: '3.2 — Fast-forward vs three-way merge|||3.2 — Fast-forward vs hợp nhất ba chiều',
      slug: 'git-3-2-hai-kieu-merge',
      type: 'LESSON',
      description: 'Hai kiểu hợp nhất hoàn toàn khác nhau mà cùng gọi là "merge": dời con trỏ (fast-forward) và tạo một commit hai cha (ba chiều). Khi nào Git chọn cái nào, --no-ff làm gì, và tổ tiên chung là chìa khoá của mọi thứ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>One command, two completely different operations</h2>
<p class="lead"><code>git merge</code> does one of two things depending on the shape of history, and they are not variations of each other. Confusing them is why "why is there a merge commit sometimes and not others?" is such a common question.</p>

<h3>Case 1 — Fast-forward: nothing to merge, just move the pointer</h3>
<p>You branched off <code>main</code>, made two commits, and <code>main</code> has not moved since:</p>
<div class="lz-map">
  <div class="lz-stage">Before the merge</div>
  <div class="lz-node"><div class="lz-badge">C</div><div class="lz-nbody"><div class="lz-ntitle">1a2b3c4 ← feature/login</div><div class="lz-nsub">your second commit</div></div></div>
  <div class="lz-node"><div class="lz-badge">B</div><div class="lz-nbody"><div class="lz-ntitle">9e2d4b7</div><div class="lz-nsub">your first commit</div></div></div>
  <div class="lz-node"><div class="lz-badge">A</div><div class="lz-nbody"><div class="lz-ntitle">7b3e9d1 ← main</div><div class="lz-nsub">where you forked. main is still here.</div></div></div>
</div>
<p>Commit A is an <em>ancestor</em> of C, so there is nothing to reconcile — everything in <code>main</code> is already in <code>feature/login</code>. Git simply slides the <code>main</code> pointer forward:</p>
<pre><code>git switch main
git merge feature/login</code></pre>
<div class="out">Updating 7b3e9d1..1a2b3c4
Fast-forward
 src/services/auth.service.ts | 22 ++++++++++++++++++++++
 1 file changed, 22 insertions(+)</div>
<p>No new commit was created. <code>main</code> now points at <code>1a2b3c4</code>, and history is a straight line — you cannot tell afterwards that a branch ever existed.</p>

<h3>Case 2 — Three-way merge: both sides moved</h3>
<p>The realistic case. While you worked, someone merged something else into <code>main</code>:</p>
<div class="lz-map">
  <div class="lz-stage">Two lines of history that both moved</div>
  <div class="lz-node"><div class="lz-badge">C</div><div class="lz-nbody"><div class="lz-ntitle">1a2b3c4 ← feature/login</div><div class="lz-nsub">your work</div></div></div>
  <div class="lz-node"><div class="lz-badge">D</div><div class="lz-nbody"><div class="lz-ntitle">5f7a9c2 ← main</div><div class="lz-nsub">someone else's work, added after you forked</div></div></div>
  <div class="lz-node"><div class="lz-badge">A</div><div class="lz-nbody"><div class="lz-ntitle">7b3e9d1 — the merge base</div><div class="lz-nsub">the common ancestor of C and D. Everything hinges on this commit.</div></div></div>
</div>
<p>Neither branch contains the other, so a pointer move is impossible. Git performs a <strong>three-way merge</strong> — the "three" being the two branch tips <em>and their common ancestor</em>:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Find the merge base</div><div class="lz-d"><code>git merge-base main feature/login</code> → commit A, the most recent common ancestor.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Diff A→C and A→D</div><div class="lz-d">"What did each side change relative to the shared starting point?"</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Combine both sets of changes</div><div class="lz-d">Different files or different regions → applied automatically. Same lines → a conflict (3.3).</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Commit with TWO parents</div><div class="lz-d">A merge commit: parent 1 = main (D), parent 2 = feature (C).</div></div>
</div>
<pre><code>git merge feature/login</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 src/services/auth.service.ts | 22 ++++++++++++++++++++++
 1 file changed, 22 insertions(+)</div>
<div class="callout ok">Step 2 is why Git merges so much better than a plain "compare two files" tool. Knowing the common ancestor lets Git distinguish "you added this line" from "they deleted it" — a two-way comparison cannot tell those apart, which is why merging in older systems was so painful. (<code>ort</code> is the name of the modern merge strategy, default since Git 2.34.)</div>

<h3>Seeing the two shapes</h3>
<pre><code>git log --oneline --graph -6</code></pre>
<div class="out">*   8c4f2a1 (HEAD -&gt; main) Merge branch 'feature/login'
|\\
| * 1a2b3c4 (feature/login) fix: reject expired refresh tokens
| * 9e2d4b7 feat(auth): add refresh token rotation
* | 5f7a9c2 fix(feed): stop 500 when a post has no author
|/
* 7b3e9d1 refactor(api): extract pagination into a helper</div>
<p>Read it bottom-up: at <code>7b3e9d1</code> history splits (<code>|/</code>), the two sides develop in parallel, and at <code>8c4f2a1</code> they join (<code>|\\</code>). That merge commit has two parents — <code>HEAD^1</code> is main's side, <code>HEAD^2</code> is the feature's side, which is the practical use for the caret notation from 1.2.</p>

<h3>Forcing a merge commit: --no-ff</h3>
<pre><code>git merge --no-ff feature/login</code></pre>
<div class="out">Merge made by the 'ort' strategy.</div>
<p>Even when a fast-forward is possible, <code>--no-ff</code> creates a merge commit anyway. Teams choose between the two deliberately:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Fast-forward (default)</span><span class="v">Linear, easy-to-read history. But the branch disappears — you lose the record of which commits belonged to one feature.</span></div>
  <div class="kv"><span class="k">--no-ff</span><span class="v">Every feature leaves a visible merge commit, so <code>git log --first-parent</code> reads as a list of features and reverting a whole feature is one command. Costs a busier graph.</span></div>
  <div class="kv"><span class="k">--ff-only</span><span class="v">Refuse to merge unless it is a fast-forward. Excellent for <code>git pull</code>: it fails loudly instead of quietly creating a merge commit you did not want.</span></div>
  <div class="kv"><span class="k">--squash</span><span class="v">Take all the branch's changes as one uncommitted lump. You then commit once, with no merge and no link to the branch. This is what GitHub's "Squash and merge" button does.</span></div>
</div>
<div class="callout ok"><code>git log --first-parent --oneline</code> on a <code>--no-ff</code> history lists only the merge commits — one line per feature that landed, ignoring the dozens of "wip" commits inside each. On a release branch that is the changelog, almost for free.</div>

<h3>Aborting and inspecting</h3>
<pre><code>git merge --abort      <span class="tok-comment"># mid-conflict: return everything to before the merge</span>
git merge --no-commit feature/login   <span class="tok-comment"># merge but stop before committing, to inspect</span>
git merge-base main feature/login     <span class="tok-comment"># which commit is the common ancestor?</span>
git diff HEAD^1 HEAD                  <span class="tok-comment"># what the merge changed relative to main</span>
git diff HEAD^2 HEAD                  <span class="tok-comment"># …relative to the feature branch</span></code></pre>

<h3>"Refusing to merge unrelated histories"</h3>
<pre><code>git merge other-project/main</code></pre>
<div class="out">fatal: refusing to merge unrelated histories</div>
<p>There is no common ancestor at all — the two histories were created independently (a repository initialised twice, or a template repo pasted over your own). Git refuses because a three-way merge with no base would treat <em>every</em> file as a conflict. The escape hatch exists, but understand what it means before using it:</p>
<pre><code>git merge other-project/main --allow-unrelated-histories</code></pre>
<div class="callout warn">Ninety per cent of the time this error means you did something unintended — cloned into an existing folder, or ran <code>git init</code> in a directory that was already a repository. Check <code>git log --oneline | tail -3</code> on both sides first. If the root commits differ, the flag is right; if you did not expect two roots, the flag will bury the real mistake.</div>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 3.2 — Basic Branching and Merging</span><span class="lc-sub">The fast-forward and three-way diagrams, in the official book.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-merge" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">git-merge — strategies, --no-ff, --squash, --abort</span><span class="lc-sub">Also documents the <code>ort</code> strategy and its options.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> assuming a successful merge means working code. Git merges <em>text</em>. If your branch renamed <code>getUser()</code> and a colleague's branch added three new calls to <code>getUser()</code>, the merge succeeds with zero conflicts and the build breaks — the changes touched different lines, so Git had nothing to ask about. This is called a <em>semantic conflict</em>, and the only defence is running the tests after every merge, never just before.</div>
<p class="note-ct"><strong>Practical guidance:</strong> keep branches short-lived. Every day a branch stays open, the two sides drift further from the merge base and the merge gets harder — conflicts grow super-linearly with time, not linearly. A branch merged after two days is usually trivial; the same branch after three weeks is an afternoon of work.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Một lệnh, hai thao tác hoàn toàn khác nhau</h2>
<p class="lead"><code>git merge</code> làm một trong hai việc tuỳ hình dạng lịch sử, và chúng không phải biến thể của nhau. Nhầm hai cái đó là lý do câu "sao lúc thì có commit hợp nhất lúc thì không?" phổ biến đến thế.</p>

<h3>Trường hợp 1 — Fast-forward: không có gì để hợp nhất, chỉ dời con trỏ</h3>
<p>Bạn rẽ ra từ <code>main</code>, tạo hai commit, và <code>main</code> chưa hề nhúc nhích:</p>
<div class="lz-map">
  <div class="lz-stage">Trước khi merge</div>
  <div class="lz-node"><div class="lz-badge">C</div><div class="lz-nbody"><div class="lz-ntitle">1a2b3c4 ← feature/login</div><div class="lz-nsub">commit thứ hai của bạn</div></div></div>
  <div class="lz-node"><div class="lz-badge">B</div><div class="lz-nbody"><div class="lz-ntitle">9e2d4b7</div><div class="lz-nsub">commit thứ nhất của bạn</div></div></div>
  <div class="lz-node"><div class="lz-badge">A</div><div class="lz-nbody"><div class="lz-ntitle">7b3e9d1 ← main</div><div class="lz-nsub">chỗ bạn rẽ ra. main vẫn còn ở đây.</div></div></div>
</div>
<p>Commit A là <em>tổ tiên</em> của C, nên không có gì phải điều hoà — mọi thứ trong <code>main</code> đã có sẵn trong <code>feature/login</code>. Git chỉ việc trượt con trỏ <code>main</code> tiến lên:</p>
<pre><code>git switch main
git merge feature/login</code></pre>
<div class="out">Updating 7b3e9d1..1a2b3c4
Fast-forward
 src/services/auth.service.ts | 22 ++++++++++++++++++++++
 1 file changed, 22 insertions(+)</div>
<p>Không commit mới nào được tạo. <code>main</code> giờ trỏ tới <code>1a2b3c4</code>, và lịch sử là một đường thẳng — sau đó bạn không nhận ra được là đã từng có một nhánh.</p>

<h3>Trường hợp 2 — Hợp nhất ba chiều: cả hai bên đều đã tiến</h3>
<p>Đây là trường hợp thực tế. Trong lúc bạn làm việc, có người đã hợp nhất thứ khác vào <code>main</code>:</p>
<div class="lz-map">
  <div class="lz-stage">Hai dòng lịch sử đều đã tiến lên</div>
  <div class="lz-node"><div class="lz-badge">C</div><div class="lz-nbody"><div class="lz-ntitle">1a2b3c4 ← feature/login</div><div class="lz-nsub">việc của bạn</div></div></div>
  <div class="lz-node"><div class="lz-badge">D</div><div class="lz-nbody"><div class="lz-ntitle">5f7a9c2 ← main</div><div class="lz-nsub">việc của người khác, thêm vào sau khi bạn rẽ ra</div></div></div>
  <div class="lz-node"><div class="lz-badge">A</div><div class="lz-nbody"><div class="lz-ntitle">7b3e9d1 — điểm gốc hợp nhất (merge base)</div><div class="lz-nsub">tổ tiên chung của C và D. Mọi thứ xoay quanh commit này.</div></div></div>
</div>
<p>Không nhánh nào chứa nhánh kia, nên dời con trỏ là chuyện bất khả. Git thực hiện một <strong>hợp nhất ba chiều</strong> — "ba" ở đây là hai đầu nhánh <em>cộng tổ tiên chung của chúng</em>:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Tìm điểm gốc hợp nhất</div><div class="lz-d"><code>git merge-base main feature/login</code> → commit A, tổ tiên chung gần nhất.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">So A→C và A→D</div><div class="lz-d">"Mỗi bên đã đổi gì so với điểm xuất phát chung?"</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Ghép hai bộ thay đổi</div><div class="lz-d">File khác nhau hoặc vùng khác nhau → áp tự động. Cùng những dòng đó → một xung đột (bài 3.3).</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Commit với HAI cha</div><div class="lz-d">Một commit hợp nhất: cha 1 = main (D), cha 2 = feature (C).</div></div>
</div>
<pre><code>git merge feature/login</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 src/services/auth.service.ts | 22 ++++++++++++++++++++++
 1 file changed, 22 insertions(+)</div>
<div class="callout ok">Bước 2 là lý do Git hợp nhất tốt hơn hẳn một công cụ "so hai file" thường. Biết tổ tiên chung cho phép Git phân biệt "bạn THÊM dòng này" với "họ XOÁ nó" — phép so hai chiều không phân biệt nổi hai chuyện đó, và vì thế hợp nhất trong các hệ cũ mới khổ sở đến vậy. (<code>ort</code> là tên chiến lược hợp nhất đời mới, mặc định từ Git 2.34.)</div>

<h3>Nhìn thấy hai hình dạng</h3>
<pre><code>git log --oneline --graph -6</code></pre>
<div class="out">*   8c4f2a1 (HEAD -&gt; main) Merge branch 'feature/login'
|\\
| * 1a2b3c4 (feature/login) fix: reject expired refresh tokens
| * 9e2d4b7 feat(auth): add refresh token rotation
* | 5f7a9c2 fix(feed): stop 500 when a post has no author
|/
* 7b3e9d1 refactor(api): extract pagination into a helper</div>
<p>Đọc từ dưới lên: ở <code>7b3e9d1</code> lịch sử tách đôi (<code>|/</code>), hai bên phát triển song song, và ở <code>8c4f2a1</code> chúng nhập lại (<code>|\\</code>). Commit hợp nhất đó có hai cha — <code>HEAD^1</code> là phía main, <code>HEAD^2</code> là phía feature, và đó là công dụng thực tế của ký hiệu dấu mũ ở bài 1.2.</p>

<h3>Ép tạo commit hợp nhất: --no-ff</h3>
<pre><code>git merge --no-ff feature/login</code></pre>
<div class="out">Merge made by the 'ort' strategy.</div>
<p>Ngay cả khi fast-forward là khả thi, <code>--no-ff</code> vẫn tạo một commit hợp nhất. Các nhóm chọn giữa hai cách này một cách có chủ ý:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Fast-forward (mặc định)</span><span class="v">Lịch sử tuyến tính, dễ đọc. Nhưng cái nhánh biến mất — bạn mất dấu vết những commit nào thuộc về một tính năng.</span></div>
  <div class="kv"><span class="k">--no-ff</span><span class="v">Mỗi tính năng để lại một commit hợp nhất nhìn thấy được, nên <code>git log --first-parent</code> đọc như một danh sách tính năng và hoàn tác cả một tính năng chỉ tốn một lệnh. Cái giá là đồ thị rậm rạp hơn.</span></div>
  <div class="kv"><span class="k">--ff-only</span><span class="v">Từ chối hợp nhất trừ khi đó là fast-forward. Rất tốt cho <code>git pull</code>: nó báo lỗi ầm ĩ thay vì âm thầm tạo một commit hợp nhất bạn không muốn.</span></div>
  <div class="kv"><span class="k">--squash</span><span class="v">Lấy mọi thay đổi của nhánh thành một cục chưa commit. Bạn commit một lần, không có hợp nhất và không có liên kết tới nhánh. Đây là thứ nút "Squash and merge" của GitHub làm.</span></div>
</div>
<div class="callout ok"><code>git log --first-parent --oneline</code> trên một lịch sử <code>--no-ff</code> chỉ liệt kê các commit hợp nhất — mỗi tính năng đã đáp xuống một dòng, bỏ qua hàng chục commit "wip" bên trong từng cái. Trên một nhánh phát hành thì đó gần như là changelog cho không.</div>

<h3>Huỷ bỏ và soi xét</h3>
<pre><code>git merge --abort      <span class="tok-comment"># đang giữa xung đột: trả mọi thứ về trước lúc merge</span>
git merge --no-commit feature/login   <span class="tok-comment"># hợp nhất nhưng dừng trước khi commit, để soi</span>
git merge-base main feature/login     <span class="tok-comment"># commit nào là tổ tiên chung?</span>
git diff HEAD^1 HEAD                  <span class="tok-comment"># lần merge đã đổi gì so với main</span>
git diff HEAD^2 HEAD                  <span class="tok-comment"># …so với nhánh feature</span></code></pre>

<h3>"Refusing to merge unrelated histories"</h3>
<pre><code>git merge other-project/main</code></pre>
<div class="out">fatal: refusing to merge unrelated histories</div>
<p>Hoàn toàn không có tổ tiên chung — hai lịch sử được tạo ra độc lập (một kho được init hai lần, hoặc một kho mẫu dán đè lên kho của bạn). Git từ chối vì một hợp nhất ba chiều mà không có điểm gốc sẽ coi <em>mọi</em> file là xung đột. Có cửa thoát, nhưng hãy hiểu nó nghĩa là gì trước khi dùng:</p>
<pre><code>git merge other-project/main --allow-unrelated-histories</code></pre>
<div class="callout warn">Chín mươi phần trăm trường hợp, lỗi này nghĩa là bạn đã làm một việc ngoài ý định — clone vào một thư mục đã có sẵn, hoặc chạy <code>git init</code> trong một thư mục vốn đã là kho mã. Hãy kiểm <code>git log --oneline | tail -3</code> ở cả hai phía trước. Nếu commit gốc khác nhau thì cái cờ là đúng; nếu bạn không hề chờ đợi có hai gốc thì cái cờ sẽ chôn vùi sai lầm thật.</div>

<a class="link-card" href="https://git-scm.com/book/vi/v2/Nh%C3%A1nh-C%C4%83n-B%E1%BA%A3n-V%E1%BB%81-Nh%C3%A1nh-v%C3%A0-H%C3%B2a-Tr%E1%BB%99n" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 3.2 (tiếng Việt) — Căn bản về nhánh và hoà trộn</span><span class="lc-sub">Sơ đồ fast-forward và ba chiều, trong sách chính thức.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-merge" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">git-merge — chiến lược, --no-ff, --squash, --abort</span><span class="lc-sub">Cũng ghi lại chiến lược <code>ort</code> và các tuỳ chọn của nó.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tưởng một lần merge thành công nghĩa là mã chạy được. Git hợp nhất <em>văn bản</em>. Nếu nhánh của bạn đổi tên <code>getUser()</code> còn nhánh của đồng nghiệp thêm ba lời gọi mới tới <code>getUser()</code>, việc hợp nhất thành công với không một xung đột nào và bản dựng thì hỏng — các thay đổi chạm những dòng khác nhau nên Git chẳng có gì để hỏi. Đây gọi là <em>xung đột ngữ nghĩa</em>, và phòng thủ duy nhất là chạy test SAU mỗi lần merge, không phải chỉ trước đó.</div>
<p class="note-ct"><strong>Lời khuyên thực dụng:</strong> giữ nhánh sống ngắn ngày. Mỗi ngày một nhánh còn mở, hai bên trôi xa điểm gốc hợp nhất thêm một chút và việc hợp nhất khó hơn — xung đột tăng theo cấp trên tuyến tính với thời gian, không phải tuyến tính. Một nhánh hợp nhất sau hai ngày thường là chuyện vặt; đúng nhánh ấy sau ba tuần là một buổi chiều làm việc.</p>
</div>
`,
    },

    /* ─────────────────────────── 3.3 ─────────────────────────── */
    {
      title: '3.3 — Merge conflicts: reading them and resolving calmly|||3.3 — Xung đột hợp nhất: đọc và giải quyết một cách bình tĩnh',
      slug: 'git-3-3-xung-dot',
      type: 'LESSON',
      description: 'Ký hiệu xung đột nghĩa là gì từng dòng, quy trình bốn bước giải xung đột, diff3 cho thấy cả bản gốc, các chiến lược ours/theirs, rerere, và cách giảm số xung đột ngay từ đầu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>A conflict is a question, not an error</h2>
<p class="lead">Git resolves most merges silently. A conflict means it reached a spot where both sides changed <em>the same lines</em> and it has no basis for choosing. It is not a failure — it is Git correctly refusing to guess. Your job is to answer the question, and the panic most people feel comes entirely from not knowing how to read what is on screen.</p>

<pre><code>git merge feature/login</code></pre>
<div class="out">Auto-merging src/services/auth.service.ts
CONFLICT (content): Merge conflict in src/services/auth.service.ts
Automatic merge failed; fix conflicts and then commit the result.</div>
<div class="callout ok">Nothing is broken and nothing is lost. The merge is <em>paused</em>. <code>git merge --abort</code> returns you to exactly where you were, at any point, until you commit. Knowing that escape hatch exists is what makes it possible to work calmly.</div>

<h3>Reading the markers</h3>
<pre><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
  const ttl = 60 * 60;          <span class="tok-comment">// 1 hour</span>
=======
  const ttl = 15 * 60;          <span class="tok-comment">// 15 minutes</span>
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/login</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</span><span class="lz-v">Start of <strong>your</strong> version — the branch you are currently on, the one you ran <code>git merge</code> from.</span></div>
  <div class="lz-layer"><span class="lz-k">=======</span><span class="lz-v">The divider. Not part of either version.</span></div>
  <div class="lz-layer"><span class="lz-k">&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/login</span><span class="lz-v">End of <strong>their</strong> version — the branch being merged in. The name after the arrows tells you whose it is.</span></div>
</div>
<div class="callout warn">During a <code>merge</code>, <code>HEAD</code> is your branch. During a <code>rebase</code> the labels <strong>swap</strong>, because rebase replays your commits on top of theirs — so <code>HEAD</code> is the branch you are rebasing <em>onto</em>. This inversion is the single most common cause of resolving a conflict backwards. Read the branch name after <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>, never assume.</div>

<h3>diff3 — see what the line looked like BEFORE either side touched it</h3>
<pre><code>git config --global merge.conflictStyle zdiff3</code></pre>
<pre><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
  const ttl = 60 * 60;          <span class="tok-comment">// 1 hour</span>
||||||| merge base
  const ttl = 30 * 60;          <span class="tok-comment">// 30 minutes</span>
=======
  const ttl = 15 * 60;          <span class="tok-comment">// 15 minutes</span>
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/login</code></pre>
<p>Now you can see the original was 30 minutes: one side <em>raised</em> it, the other <em>lowered</em> it. That is a real disagreement needing a decision. Without the base you might have assumed one side simply added the line. <strong>Turn this on today</strong> — it is the single highest-value Git setting in this course, and <code>zdiff3</code> is the improved version that keeps common lines out of the conflict region.</p>

<h3>The four-step resolution</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">See the damage</div><div class="lz-d"><code>git status</code> lists every conflicted file under "Unmerged paths".</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Edit each one</div><div class="lz-d">Decide the correct result. Delete ALL markers — including <code>=======</code>.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Mark it resolved</div><div class="lz-d"><code>git add &lt;file&gt;</code>. Staging a conflicted file is how you tell Git "this one is settled".</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Finish and TEST</div><div class="lz-d"><code>git commit</code> (the message is pre-filled), then actually run the tests.</div></div>
</div>
<pre><code>git status</code></pre>
<div class="out">You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add &lt;file&gt;..." to mark resolution)
        both modified:   src/services/auth.service.ts</div>
<p>The result does not have to be either side. Often the right answer is a third thing — both features, combined properly. Git is asking what the code <em>should</em> be, not which side wins.</p>

<h3>When one side is simply right</h3>
<pre><code>git checkout --ours  src/config.ts     <span class="tok-comment"># keep MY version entirely</span>
git checkout --theirs src/config.ts    <span class="tok-comment"># keep THEIR version entirely</span>
git add src/config.ts</code></pre>
<p>Useful for generated files — a lockfile, a build artefact, a snapshot. For hand-written code, prefer reading both: "ours" is usually a polite way of discarding a colleague's work without looking at it.</p>
<div class="callout warn">For a lockfile the correct move is usually neither side: take one, then <strong>regenerate</strong> it with the project's tooling (<code>npm install</code>, <code>poetry lock</code>). A hand-merged lockfile can describe a dependency tree that has never existed anywhere, and it will fail in CI in a way that is very hard to read.</div>

<h3>Conflicts that are not about content</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">modify/delete</span><span class="v">One side edited the file, the other deleted it. Git cannot merge; decide with <code>git rm &lt;file&gt;</code> or <code>git add &lt;file&gt;</code>.</span></div>
  <div class="kv"><span class="k">rename/rename</span><span class="v">Both sides renamed the same file to different names. Pick one, delete the other, move the content.</span></div>
  <div class="kv"><span class="k">add/add</span><span class="v">Both created a file at the same path with different content. Ordinary content conflict — reconcile the two.</span></div>
  <div class="kv"><span class="k">binary</span><span class="v">An image or PDF. No line merging is possible: choose one whole file with <code>--ours</code> / <code>--theirs</code>.</span></div>
</div>

<h3>Tools that help</h3>
<pre><code>git diff                       <span class="tok-comment"># during a conflict, shows a combined diff of the mess</span>
git diff --name-only --diff-filter=U   <span class="tok-comment"># just the conflicted paths</span>
git mergetool                  <span class="tok-comment"># open a three-pane visual tool</span>
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd <span class="tok-string">'code --wait \$MERGED'</span></code></pre>
<p>And the feature that pays off in long-lived branches:</p>
<pre><code>git config --global rerere.enabled true</code></pre>
<p><strong>rerere</strong> = "reuse recorded resolution". Git remembers how you resolved a particular conflict and replays that resolution automatically the next time the identical conflict appears. On a branch you rebase repeatedly, or a long-running merge you redo after every upstream change, this turns the same manual fix from a daily chore into a one-off.</p>

<h3>Preventing conflicts is cheaper than resolving them</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Merge main in often</span><span class="v">Daily, not at the end. Ten small conflicts spread over two weeks are far easier than one enormous one.</span></div>
  <div class="kv"><span class="k">Keep branches small</span><span class="v">A one-day branch rarely conflicts. A three-week branch almost always does.</span></div>
  <div class="kv"><span class="k">Agree on formatting</span><span class="v">Prettier/ESLint/gofmt in a pre-commit hook (Chapter 12). Most "conflicts" in undisciplined repos are whitespace.</span></div>
  <div class="kv"><span class="k">Split large files</span><span class="v">A 3,000-line file that everyone edits is a conflict factory. Modules that different people own rarely collide.</span></div>
</div>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 7.8 — Advanced Merging</span><span class="lc-sub">Conflict styles, ours/theirs, rerere, and merging binary files.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: resolve four conflicts, including a modify/delete</span><span class="lc-sub">Graded exercises with the resolution checked against a target file.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> committing a conflict marker. Leave one <code>=======</code> or <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> behind and it goes straight into history — the file becomes syntactically invalid and CI fails with an error that points nowhere useful. Before finishing a merge, run <code>git diff --check</code> (it reports leftover markers) or simply <code>git grep -n "^&lt;&lt;&lt;&lt;&lt;&lt;&lt;"</code>. Chapter 12 shows how to make a pre-commit hook refuse it automatically.</div>
<p class="note-ct"><strong>The step people skip:</strong> running the tests after resolving. A conflict resolution is new code that has never been executed anywhere — you wrote it by hand, under mild stress, combining two people's intentions. It is exactly the kind of code that compiles and misbehaves. Resolve, then <em>run it</em>, then commit.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Một xung đột là một CÂU HỎI, không phải một lỗi</h2>
<p class="lead">Git hợp nhất phần lớn mọi thứ trong im lặng. Một xung đột nghĩa là nó gặp một chỗ mà cả hai bên cùng sửa <em>đúng những dòng đó</em> và nó không có căn cứ nào để chọn. Đó không phải thất bại — đó là Git từ chối đoán mò, một cách đúng đắn. Việc của bạn là trả lời câu hỏi, và nỗi hoảng loạn mà đa số người cảm thấy hoàn toàn đến từ việc không biết đọc thứ đang hiện trên màn hình.</p>

<pre><code>git merge feature/login</code></pre>
<div class="out">Auto-merging src/services/auth.service.ts
CONFLICT (content): Merge conflict in src/services/auth.service.ts
Automatic merge failed; fix conflicts and then commit the result.</div>
<div class="callout ok">Không có gì hỏng và không có gì mất. Việc hợp nhất đang <em>tạm dừng</em>. <code>git merge --abort</code> trả bạn về đúng chỗ bạn vừa đứng, ở bất kỳ thời điểm nào, cho tới khi bạn commit. Biết là có cửa thoát đó chính là thứ cho phép bạn làm việc bình tĩnh.</div>

<h3>Đọc các ký hiệu</h3>
<pre><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
  const ttl = 60 * 60;          <span class="tok-comment">// 1 giờ</span>
=======
  const ttl = 15 * 60;          <span class="tok-comment">// 15 phút</span>
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/login</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</span><span class="lz-v">Bắt đầu phiên bản <strong>của bạn</strong> — nhánh bạn đang đứng, nhánh mà bạn gõ <code>git merge</code> từ đó.</span></div>
  <div class="lz-layer"><span class="lz-k">=======</span><span class="lz-v">Vạch ngăn. Không thuộc về phiên bản nào cả.</span></div>
  <div class="lz-layer"><span class="lz-k">&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/login</span><span class="lz-v">Kết thúc phiên bản <strong>của họ</strong> — nhánh đang được hợp nhất vào. Cái tên sau mấy mũi tên cho bạn biết đó là của ai.</span></div>
</div>
<div class="callout warn">Trong một lần <code>merge</code>, <code>HEAD</code> là nhánh của bạn. Trong một lần <code>rebase</code> thì nhãn <strong>ĐẢO NGƯỢC</strong>, vì rebase phát lại các commit của bạn lên trên của họ — nên <code>HEAD</code> là nhánh bạn đang rebase <em>lên</em>. Sự đảo ngược này là nguyên nhân phổ biến nhất của việc giải xung đột ngược. Hãy đọc tên nhánh sau <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>, đừng bao giờ giả định.</div>

<h3>diff3 — nhìn thấy dòng đó trông thế nào TRƯỚC khi cả hai bên đụng vào</h3>
<pre><code>git config --global merge.conflictStyle zdiff3</code></pre>
<pre><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
  const ttl = 60 * 60;          <span class="tok-comment">// 1 giờ</span>
||||||| merge base
  const ttl = 30 * 60;          <span class="tok-comment">// 30 phút</span>
=======
  const ttl = 15 * 60;          <span class="tok-comment">// 15 phút</span>
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/login</code></pre>
<p>Giờ bạn thấy bản gốc là 30 phút: một bên <em>nâng lên</em>, bên kia <em>hạ xuống</em>. Đó là một bất đồng thật sự cần một quyết định. Không có bản gốc, bạn có thể đã tưởng một bên chỉ đơn giản thêm dòng đó vào. <strong>Hãy bật cái này ngay hôm nay</strong> — nó là thiết lập Git có giá trị nhất trong cả khoá, và <code>zdiff3</code> là bản cải tiến giữ các dòng chung ra ngoài vùng xung đột.</p>

<h3>Bốn bước giải quyết</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Xem thiệt hại</div><div class="lz-d"><code>git status</code> liệt kê mọi file xung đột dưới mục "Unmerged paths".</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Sửa từng file</div><div class="lz-d">Quyết định kết quả đúng. Xoá HẾT các ký hiệu — kể cả <code>=======</code>.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Đánh dấu đã giải quyết</div><div class="lz-d"><code>git add &lt;file&gt;</code>. Đưa một file xung đột vào staging chính là cách bạn nói với Git "cái này xong rồi".</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Kết thúc và CHẠY TEST</div><div class="lz-d"><code>git commit</code> (lời nhắn đã điền sẵn), rồi thật sự chạy bộ test.</div></div>
</div>
<pre><code>git status</code></pre>
<div class="out">You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add &lt;file&gt;..." to mark resolution)
        both modified:   src/services/auth.service.ts</div>
<p>Kết quả không nhất thiết phải là một trong hai bên. Thường câu trả lời đúng là một thứ thứ ba — cả hai tính năng, ghép lại cho đúng. Git đang hỏi mã <em>nên</em> như thế nào, chứ không hỏi bên nào thắng.</p>

<h3>Khi một bên đơn giản là đúng</h3>
<pre><code>git checkout --ours  src/config.ts     <span class="tok-comment"># giữ nguyên phiên bản CỦA TÔI</span>
git checkout --theirs src/config.ts    <span class="tok-comment"># giữ nguyên phiên bản CỦA HỌ</span>
git add src/config.ts</code></pre>
<p>Hữu ích cho file sinh tự động — một lockfile, một sản phẩm build, một snapshot. Với mã viết tay thì nên đọc cả hai: "ours" thường là một cách lịch sự để vứt bỏ việc của đồng nghiệp mà không thèm nhìn.</p>
<div class="callout warn">Với lockfile thì nước đi đúng thường là KHÔNG bên nào: lấy một bên, rồi <strong>sinh lại</strong> nó bằng công cụ của dự án (<code>npm install</code>, <code>poetry lock</code>). Một lockfile hợp nhất bằng tay có thể mô tả một cây phụ thuộc chưa từng tồn tại ở đâu, và nó sẽ hỏng trong CI theo một kiểu rất khó đọc.</div>

<h3>Những xung đột không phải về nội dung</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">modify/delete</span><span class="v">Một bên sửa file, bên kia xoá nó. Git không hợp nhất được; hãy quyết bằng <code>git rm &lt;file&gt;</code> hoặc <code>git add &lt;file&gt;</code>.</span></div>
  <div class="kv"><span class="k">rename/rename</span><span class="v">Cả hai bên đổi tên cùng một file thành hai tên khác nhau. Chọn một, xoá cái kia, chuyển nội dung sang.</span></div>
  <div class="kv"><span class="k">add/add</span><span class="v">Cả hai cùng tạo một file ở cùng đường dẫn với nội dung khác nhau. Là xung đột nội dung thường — điều hoà hai bên.</span></div>
  <div class="kv"><span class="k">nhị phân</span><span class="v">Một tấm ảnh hay một file PDF. Không hợp nhất theo dòng được: chọn nguyên một file bằng <code>--ours</code> / <code>--theirs</code>.</span></div>
</div>

<h3>Những công cụ giúp được</h3>
<pre><code>git diff                       <span class="tok-comment"># khi đang xung đột, hiện một diff gộp của mớ bòng bong</span>
git diff --name-only --diff-filter=U   <span class="tok-comment"># chỉ những đường dẫn đang xung đột</span>
git mergetool                  <span class="tok-comment"># mở một công cụ trực quan ba khung</span>
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd <span class="tok-string">'code --wait \$MERGED'</span></code></pre>
<p>Và tính năng sinh lời trên những nhánh sống lâu:</p>
<pre><code>git config --global rerere.enabled true</code></pre>
<p><strong>rerere</strong> = "reuse recorded resolution" (dùng lại cách giải đã ghi). Git nhớ cách bạn giải một xung đột cụ thể và tự phát lại cách giải đó vào lần sau khi đúng xung đột ấy xuất hiện. Trên một nhánh bạn rebase nhiều lần, hay một lần merge dài hơi mà bạn làm lại sau mỗi thay đổi từ thượng nguồn, nó biến đúng một thao tác tay từ việc phải làm mỗi ngày thành việc chỉ làm một lần.</p>

<h3>Ngăn xung đột rẻ hơn giải xung đột</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Merge main vào thường xuyên</span><span class="v">Hằng ngày, không phải để tới cuối. Mười xung đột nhỏ rải ra hai tuần dễ hơn hẳn một xung đột khổng lồ.</span></div>
  <div class="kv"><span class="k">Giữ nhánh nhỏ</span><span class="v">Một nhánh một ngày hiếm khi xung đột. Một nhánh ba tuần thì gần như chắc chắn.</span></div>
  <div class="kv"><span class="k">Thống nhất định dạng</span><span class="v">Prettier/ESLint/gofmt trong một hook pre-commit (Chương 12). Đa số "xung đột" ở các kho vô kỷ luật là khoảng trắng.</span></div>
  <div class="kv"><span class="k">Chẻ nhỏ file lớn</span><span class="v">Một file 3.000 dòng mà ai cũng sửa là một cỗ máy sản xuất xung đột. Các module có chủ sở hữu khác nhau hiếm khi va nhau.</span></div>
</div>

<a class="link-card" href="https://git-scm.com/book/vi/v2/C%C3%A1c-C%C3%B4ng-C%E1%BB%A5-Git-H%C3%B2a-Tr%E1%BB%99n-N%C3%A2ng-Cao" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 7.8 (tiếng Việt) — Hoà trộn nâng cao</span><span class="lc-sub">Kiểu hiển thị xung đột, ours/theirs, rerere, và hợp nhất file nhị phân.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: giải bốn xung đột, có cả một ca modify/delete</span><span class="lc-sub">Bài tập chấm điểm, đối chiếu kết quả giải với một file đích.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> commit luôn cả ký hiệu xung đột. Bỏ sót một dòng <code>=======</code> hay <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> là nó đi thẳng vào lịch sử — file trở nên sai cú pháp và CI hỏng với một thông báo chỉ vào chỗ chẳng ích gì. Trước khi kết thúc một lần merge, hãy chạy <code>git diff --check</code> (nó báo ký hiệu còn sót) hoặc đơn giản là <code>git grep -n "^&lt;&lt;&lt;&lt;&lt;&lt;&lt;"</code>. Chương 12 chỉ cách làm một hook pre-commit tự động từ chối việc đó.</div>
<p class="note-ct"><strong>Bước mà người ta hay bỏ qua:</strong> chạy test sau khi giải xung đột. Một bản giải xung đột là mã MỚI chưa từng được chạy ở đâu — bạn viết nó bằng tay, dưới áp lực nhẹ, ghép ý định của hai người lại. Đó đúng là loại mã biên dịch trót lọt và hành xử sai. Hãy giải, rồi <em>chạy nó</em>, rồi mới commit.</p>
</div>
`,
    },

    /* ─────────────────────────── 3.4 ─────────────────────────── */
    {
      title: '3.4 — Rebase vs merge: replaying instead of joining|||3.4 — Rebase vs merge: phát lại thay vì nhập vào',
      slug: 'git-3-4-rebase-vs-merge',
      type: 'LESSON',
      description: 'Rebase làm gì ở mức commit, vì sao nó tạo commit MỚI với mã băm mới, luật vàng của rebase, khi nào chọn cái nào, và pull --rebase.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Two ways to catch up with main</h2>
<p class="lead">Your branch is three commits old and <code>main</code> has moved on. You need those changes. <code>merge</code> ties the two histories together with a knot; <code>rebase</code> pretends you started later and replays your work on top. Both are correct; they produce different history and have different risks.</p>

<h3>What rebase actually does</h3>
<pre><code>git switch feature/login
git rebase main</code></pre>
<div class="out">Successfully rebased and updated refs/heads/feature/login.</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Find your commits</div><div class="lz-d">Everything on feature/login that is not on main — the range <code>main..feature/login</code>.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Save them as patches</div><div class="lz-d">Each commit becomes a diff plus its message and author.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Move the branch to main's tip</div><div class="lz-d">Rewind feature/login to where main is now.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Replay each patch</div><div class="lz-d">Apply them one by one. Each application creates a BRAND-NEW commit with a new hash.</div></div>
</div>
<div class="callout warn">Step 4 is the whole story. Rebase does not "move" commits — it <strong>copies</strong> them. Your original commits still exist (the reflog can find them), but the branch now points at new ones with different hashes. Everything else about rebase follows from this single fact.</div>

<h3>The two shapes, side by side</h3>
<pre><code><span class="tok-comment"># After merge — the fork is visible forever</span>
git log --oneline --graph -5</code></pre>
<div class="out">*   8c4f2a1 (HEAD -&gt; feature/login) Merge branch 'main' into feature/login
|\\
| * 5f7a9c2 (main) fix(feed): stop 500 when a post has no author
* | 1a2b3c4 fix: reject expired refresh tokens
* | 9e2d4b7 feat(auth): add refresh token rotation
|/
* 7b3e9d1 refactor(api): extract pagination</div>
<pre><code><span class="tok-comment"># After rebase — as if you had started from main's tip all along</span>
git log --oneline --graph -5</code></pre>
<div class="out">* d4e8f0a (HEAD -&gt; feature/login) fix: reject expired refresh tokens
* b2c6a91 feat(auth): add refresh token rotation
* 5f7a9c2 (main) fix(feed): stop 500 when a post has no author
* 7b3e9d1 refactor(api): extract pagination</div>
<p>Compare the hashes: <code>1a2b3c4</code> and <code>9e2d4b7</code> became <code>d4e8f0a</code> and <code>b2c6a91</code>. Same changes, same messages, same authors — different commits.</p>

<h3>The golden rule</h3>
<div class="callout danger"><strong>Never rebase commits that other people already have.</strong> Rebasing replaces commits with new ones. If a colleague pulled the originals, their history and yours have silently diverged — and when they next pull, Git tries to merge the old copies with the new copies and produces duplicate commits and conflicts nobody can explain. Rebase freely on a branch only you have; use merge once it is shared.</div>
<p>The practical boundary: <em>have I pushed this branch, and could anyone have pulled it?</em> A personal feature branch nobody else touches is fine to rebase even after pushing (you force-push with <code>--force-with-lease</code>, Chapter 8.3). A shared branch — <code>main</code>, <code>develop</code>, a branch two people are working on — is not.</p>

<h3>Choosing</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Merge — when</span><span class="v">The branch is shared · you want a permanent record of when a feature landed · a long-lived branch where the true history is worth keeping.</span></div>
  <div class="kv"><span class="k">Merge — cost</span><span class="v">A busy graph. On an active repository, <code>--graph</code> becomes a tangle of parallel lines that nobody reads.</span></div>
  <div class="kv"><span class="k">Rebase — when</span><span class="v">A private branch, before opening a pull request · updating your branch with main's latest · cleaning up "wip" commits before review (3.5).</span></div>
  <div class="kv"><span class="k">Rebase — cost</span><span class="v">Rewrites history, so it is unsafe on shared branches. Conflicts may reappear <em>once per commit</em> instead of once in total.</span></div>
</div>
<p>Most teams land on: <strong>rebase to update your own branch, merge to integrate it.</strong> You rebase while working so your branch stays a clean line on top of the latest main, then the pull request is merged so the fact that it was a feature stays visible.</p>

<h3>Conflicts during a rebase</h3>
<p>The mechanics differ from a merge: rebase replays commits one at a time, so it can stop several times.</p>
<pre><code>git rebase main</code></pre>
<div class="out">CONFLICT (content): Merge conflict in src/services/auth.service.ts
error: could not apply 9e2d4b7… feat(auth): add refresh token rotation
Resolve all conflicts manually, mark them as resolved with
"git add/rm &lt;conflicted_files&gt;", then run "git rebase --continue".</div>
<pre><code><span class="tok-comment"># fix the file, then:</span>
git add src/services/auth.service.ts
git rebase --continue          <span class="tok-comment"># on to the next commit</span>
git rebase --skip              <span class="tok-comment"># drop THIS commit (it is already upstream)</span>
git rebase --abort             <span class="tok-comment"># give up entirely, back to before the rebase</span></code></pre>
<div class="callout warn">Remember the label inversion from 3.3: during a rebase, <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> is the branch you are rebasing <strong>onto</strong> (main), and the bottom half is <em>your</em> commit. It reads backwards from a merge. Read the name after <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> every time — it names the commit being replayed.</div>
<p>And this is where <code>rerere</code> (3.3) earns its keep: on a rebase of ten commits through the same conflicting region, it resolves nine of them for you after you solve the first.</p>

<h3>git pull is merge or rebase — pick deliberately</h3>
<pre><code>git pull                       <span class="tok-comment"># = git fetch + git merge origin/main (default)</span>
git pull --rebase              <span class="tok-comment"># = git fetch + git rebase origin/main</span>
git config --global pull.rebase true      <span class="tok-comment"># make --rebase the default</span>
git config --global pull.ff only          <span class="tok-comment"># or: refuse to pull unless fast-forward</span></code></pre>
<p>The default creates a merge commit every time your local branch and the remote have both moved. On a busy <code>main</code> this produces a stream of noise commits saying "Merge branch 'main' of github.com:…" — pure bookkeeping that tells a reader nothing.</p>
<div class="callout ok"><code>pull.rebase true</code> is safe for the everyday case even under the golden rule: you are rebasing <em>your own unpushed commits</em> onto what the server already has. Nobody else has your local commits, so nothing is being rewritten out from under anyone. This is the setting most teams end up standardising on.</div>

<h3>Rebasing onto a different base</h3>
<pre><code>git rebase --onto main feature/base feature/child</code></pre>
<p>Read it as "take the commits in <code>feature/base..feature/child</code> and replay them onto <code>main</code>". The use case: you branched off another feature branch, that branch got squashed into main, and now your branch's parent commits no longer exist. <code>--onto</code> transplants only your own commits and leaves the vanished ones behind.</p>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Branching-Rebasing" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 3.6 — Rebasing</span><span class="lc-sub">Including "The Perils of Rebasing", which is the golden rule with diagrams.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-rebase" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">git-rebase — --onto, --continue, --skip, autosquash</span><span class="lc-sub">The <code>--onto</code> examples in the docs are worth reading twice.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> rebasing a branch that has an open pull request with review comments. The rebase replaces every commit, so GitHub cannot match the old hashes — review threads attached to specific commits go stale or disappear, and reviewers lose the "changes since your last review" view. Finish the review first, then rebase (or squash on merge). Chapter 6.4 covers the merge-strategy choice that avoids this entirely.</div>
<p class="note-ct"><strong>A way to remember the difference:</strong> merge answers "what actually happened" — two people worked in parallel and their work was joined on Tuesday. Rebase answers "what is the clearest way to tell the story" — as if the work had been done in sequence. Neither is dishonest; they optimise for different readers. Choose per branch, not per religion.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Hai cách bắt kịp main</h2>
<p class="lead">Nhánh của bạn đã ba commit tuổi và <code>main</code> thì đã đi tiếp. Bạn cần những thay đổi đó. <code>merge</code> buộc hai lịch sử lại bằng một nút thắt; <code>rebase</code> giả vờ như bạn bắt đầu muộn hơn và phát lại việc của bạn lên trên. Cả hai đều đúng; chúng tạo ra lịch sử khác nhau và mang rủi ro khác nhau.</p>

<h3>Rebase thật sự làm gì</h3>
<pre><code>git switch feature/login
git rebase main</code></pre>
<div class="out">Successfully rebased and updated refs/heads/feature/login.</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Tìm các commit của bạn</div><div class="lz-d">Mọi thứ trên feature/login mà main không có — khoảng <code>main..feature/login</code>.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Lưu chúng thành bản vá</div><div class="lz-d">Mỗi commit trở thành một diff cộng lời nhắn và tác giả của nó.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Dời nhánh về đầu của main</div><div class="lz-d">Tua feature/login về đúng chỗ main đang đứng.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Phát lại từng bản vá</div><div class="lz-d">Áp lần lượt. Mỗi lần áp tạo ra một commit HOÀN TOÀN MỚI với mã băm mới.</div></div>
</div>
<div class="callout warn">Bước 4 là toàn bộ câu chuyện. Rebase không "dời" commit — nó <strong>SAO CHÉP</strong> chúng. Các commit gốc của bạn vẫn tồn tại (reflog tìm ra chúng), nhưng nhánh giờ trỏ tới những cái mới với mã băm khác. Mọi thứ khác về rebase đều suy ra từ đúng sự thật này.</div>

<h3>Hai hình dạng, đặt cạnh nhau</h3>
<pre><code><span class="tok-comment"># Sau merge — chỗ rẽ nhánh nhìn thấy được mãi mãi</span>
git log --oneline --graph -5</code></pre>
<div class="out">*   8c4f2a1 (HEAD -&gt; feature/login) Merge branch 'main' into feature/login
|\\
| * 5f7a9c2 (main) fix(feed): stop 500 when a post has no author
* | 1a2b3c4 fix: reject expired refresh tokens
* | 9e2d4b7 feat(auth): add refresh token rotation
|/
* 7b3e9d1 refactor(api): extract pagination</div>
<pre><code><span class="tok-comment"># Sau rebase — như thể bạn đã bắt đầu từ đầu main ngay từ đầu</span>
git log --oneline --graph -5</code></pre>
<div class="out">* d4e8f0a (HEAD -&gt; feature/login) fix: reject expired refresh tokens
* b2c6a91 feat(auth): add refresh token rotation
* 5f7a9c2 (main) fix(feed): stop 500 when a post has no author
* 7b3e9d1 refactor(api): extract pagination</div>
<p>Hãy so mã băm: <code>1a2b3c4</code> và <code>9e2d4b7</code> đã thành <code>d4e8f0a</code> và <code>b2c6a91</code>. Cùng thay đổi, cùng lời nhắn, cùng tác giả — khác commit.</p>

<h3>Luật vàng</h3>
<div class="callout danger"><strong>Đừng bao giờ rebase những commit mà người khác đã có.</strong> Rebase thay commit bằng những commit mới. Nếu một đồng nghiệp đã kéo bản gốc về, lịch sử của họ và của bạn đã âm thầm phân ly — và lần pull tiếp theo, Git sẽ cố hợp nhất bản sao cũ với bản sao mới rồi sinh ra commit trùng lặp cùng những xung đột không ai giải thích nổi. Hãy rebase thoải mái trên nhánh chỉ mình bạn có; dùng merge khi nó đã được chia sẻ.</div>
<p>Ranh giới thực dụng: <em>tôi đã push nhánh này chưa, và có ai có thể đã kéo nó về không?</em> Một nhánh tính năng cá nhân không ai khác đụng vào thì rebase được kể cả sau khi push (bạn force-push bằng <code>--force-with-lease</code>, bài 8.3). Một nhánh chung — <code>main</code>, <code>develop</code>, một nhánh hai người cùng làm — thì không.</p>

<h3>Chọn cái nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Merge — khi nào</span><span class="v">Nhánh đã chia sẻ · bạn muốn một dấu vết vĩnh viễn về lúc một tính năng đáp xuống · một nhánh sống lâu mà lịch sử thật đáng giữ lại.</span></div>
  <div class="kv"><span class="k">Merge — cái giá</span><span class="v">Đồ thị rậm rạp. Trên một kho mã sôi động, <code>--graph</code> thành một mớ đường song song không ai đọc.</span></div>
  <div class="kv"><span class="k">Rebase — khi nào</span><span class="v">Nhánh riêng tư, trước khi mở pull request · cập nhật nhánh của bạn với main mới nhất · dọn các commit "wip" trước khi review (bài 3.5).</span></div>
  <div class="kv"><span class="k">Rebase — cái giá</span><span class="v">Viết lại lịch sử, nên không an toàn trên nhánh chung. Xung đột có thể hiện lại <em>một lần cho mỗi commit</em> thay vì một lần tổng cộng.</span></div>
</div>
<p>Đa số nhóm dừng lại ở: <strong>rebase để cập nhật nhánh của mình, merge để tích hợp nó.</strong> Bạn rebase trong lúc làm việc để nhánh luôn là một đường sạch nằm trên main mới nhất, rồi pull request được merge để cái sự thật "đây là một tính năng" vẫn nhìn thấy được.</p>

<h3>Xung đột trong lúc rebase</h3>
<p>Cơ chế khác với merge: rebase phát lại từng commit một, nên nó có thể dừng lại nhiều lần.</p>
<pre><code>git rebase main</code></pre>
<div class="out">CONFLICT (content): Merge conflict in src/services/auth.service.ts
error: could not apply 9e2d4b7… feat(auth): add refresh token rotation
Resolve all conflicts manually, mark them as resolved with
"git add/rm &lt;conflicted_files&gt;", then run "git rebase --continue".</div>
<pre><code><span class="tok-comment"># sửa file, rồi:</span>
git add src/services/auth.service.ts
git rebase --continue          <span class="tok-comment"># sang commit kế tiếp</span>
git rebase --skip              <span class="tok-comment"># bỏ commit NÀY (nó đã có ở thượng nguồn rồi)</span>
git rebase --abort             <span class="tok-comment"># bỏ hẳn, về trước lúc rebase</span></code></pre>
<div class="callout warn">Nhớ chuyện đảo nhãn ở bài 3.3: trong lúc rebase, <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> là nhánh bạn đang rebase <strong>LÊN</strong> (main), còn nửa dưới mới là commit <em>của bạn</em>. Nó đọc ngược so với merge. Hãy đọc cái tên sau <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> mỗi lần — nó gọi tên commit đang được phát lại.</div>
<p>Và đây là chỗ <code>rerere</code> (bài 3.3) trả công: khi rebase mười commit đi qua cùng một vùng xung đột, nó giải hộ bạn chín cái sau khi bạn giải cái đầu tiên.</p>

<h3>git pull là merge hay rebase — hãy chọn có chủ ý</h3>
<pre><code>git pull                       <span class="tok-comment"># = git fetch + git merge origin/main (mặc định)</span>
git pull --rebase              <span class="tok-comment"># = git fetch + git rebase origin/main</span>
git config --global pull.rebase true      <span class="tok-comment"># lấy --rebase làm mặc định</span>
git config --global pull.ff only          <span class="tok-comment"># hoặc: từ chối pull trừ khi fast-forward</span></code></pre>
<p>Mặc định tạo một commit hợp nhất mỗi lần nhánh cục bộ và remote cùng tiến lên. Trên một <code>main</code> sôi động, nó sinh ra một dòng commit nhiễu ghi "Merge branch 'main' of github.com:…" — thuần sổ sách, chẳng nói gì với người đọc.</p>
<div class="callout ok"><code>pull.rebase true</code> an toàn cho trường hợp hằng ngày kể cả dưới luật vàng: bạn đang rebase <em>những commit chưa push của chính mình</em> lên trên thứ máy chủ đã có. Không ai khác có commit cục bộ của bạn, nên không có gì bị viết lại dưới chân người khác. Đây là thiết lập mà đa số nhóm rốt cuộc chuẩn hoá theo.</div>

<h3>Rebase lên một gốc khác</h3>
<pre><code>git rebase --onto main feature/base feature/child</code></pre>
<p>Đọc nó là "lấy các commit trong <code>feature/base..feature/child</code> và phát lại lên <code>main</code>". Tình huống dùng: bạn rẽ nhánh từ một nhánh tính năng khác, nhánh đó bị gộp (squash) vào main, và giờ các commit cha của nhánh bạn không còn tồn tại. <code>--onto</code> ghép sang chỉ những commit của riêng bạn và bỏ lại những cái đã biến mất.</p>

<a class="link-card" href="https://git-scm.com/book/vi/v2/Nh%C3%A1nh-Rebase" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 3.6 (tiếng Việt) — Rebase</span><span class="lc-sub">Gồm cả mục "Hiểm hoạ của Rebase", chính là luật vàng kèm sơ đồ.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-rebase" target="_blank" rel="noopener">
  <span class="lc-ico">♻️</span>
  <span class="lc-body"><span class="lc-title">git-rebase — --onto, --continue, --skip, autosquash</span><span class="lc-sub">Các ví dụ <code>--onto</code> trong tài liệu đáng đọc hai lần.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> rebase một nhánh đang có pull request mở kèm bình luận review. Rebase thay thế mọi commit, nên GitHub không khớp được mã băm cũ — các luồng review gắn với commit cụ thể sẽ lỗi thời hoặc biến mất, và người review mất góc nhìn "đã đổi gì từ lần review trước". Hãy xong review trước rồi mới rebase (hoặc gộp khi merge). Bài 6.4 nói về lựa chọn chiến lược merge tránh hẳn chuyện này.</div>
<p class="note-ct"><strong>Một cách nhớ khác biệt:</strong> merge trả lời "chuyện gì đã thật sự xảy ra" — hai người làm song song và việc của họ được nhập lại vào thứ Ba. Rebase trả lời "cách kể câu chuyện rõ ràng nhất là gì" — như thể việc đã được làm tuần tự. Không cái nào là gian dối; chúng tối ưu cho hai loại người đọc khác nhau. Hãy chọn theo từng nhánh, đừng chọn theo tín ngưỡng.</p>
</div>
`,
    },

    /* ─────────────────────────── 3.5 ─────────────────────────── */
    {
      title: '3.5 — Interactive rebase: editing your own history|||3.5 — Rebase tương tác: biên tập lịch sử của chính mình',
      slug: 'git-3-5-rebase-tuong-tac',
      type: 'LESSON',
      description: 'Bảy lệnh của rebase tương tác (pick, reword, edit, squash, fixup, drop, break), quy trình dọn nhánh trước khi review, --autosquash, và cách thoát khi rebase đi sai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.5</span>
<h2>Turning ten "wip" commits into three good ones</h2>
<p class="lead">You committed small and often, exactly as Chapter 1.3 recommended. Your branch now reads: <code>wip</code>, <code>fix typo</code>, <code>actually fix it</code>, <code>oops</code>, <code>final</code>. That is fine while working and embarrassing in review. Interactive rebase lets you rewrite that into the history you <em>meant</em> to write, before anyone else sees it.</p>

<pre><code>git rebase -i main            <span class="tok-comment"># every commit on this branch since main</span>
git rebase -i HEAD~5          <span class="tok-comment"># the last five commits</span>
git rebase -i 7b3e9d1         <span class="tok-comment"># everything AFTER that commit</span></code></pre>
<p>Your editor opens with a to-do list. Nothing has happened yet — this is a script you are editing, and Git will execute it when you save and close:</p>
<pre><code>pick 9e2d4b7 feat(auth): add refresh token rotation
pick 1a2b3c4 wip
pick 5f7a9c2 fix typo
pick d4e8f0a actually fix it
pick b2c6a91 add tests

<span class="tok-comment"># Rebase 7b3e9d1..b2c6a91 onto 7b3e9d1 (5 commands)</span>
<span class="tok-comment">#</span>
<span class="tok-comment"># Commands:</span>
<span class="tok-comment"># p, pick   = use commit</span>
<span class="tok-comment"># r, reword = use commit, but edit the commit message</span>
<span class="tok-comment"># e, edit   = use commit, but stop for amending</span>
<span class="tok-comment"># s, squash = use commit, but meld into previous commit</span>
<span class="tok-comment"># f, fixup  = like squash, but discard this commit's log message</span>
<span class="tok-comment"># d, drop   = remove commit</span>
<span class="tok-comment"># b, break  = stop here (continue rebase later with git rebase --continue)</span></code></pre>
<div class="callout warn">The list is in <strong>oldest-first</strong> order — the reverse of <code>git log</code>. This trips up everyone once. <code>squash</code> and <code>fixup</code> always merge a commit into the one <em>above</em> it in this list, which is the chronologically earlier one.</div>

<h3>The seven commands</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">pick</span><span class="lz-v">Keep it as is. The default for every line.</span></div>
  <div class="lz-layer"><span class="lz-k">reword</span><span class="lz-v">Keep the changes, edit the message. Git opens your editor for that commit alone.</span></div>
  <div class="lz-layer"><span class="lz-k">edit</span><span class="lz-v">Stop at this commit so you can change the <em>content</em> — split it, add a forgotten file, remove a debug line.</span></div>
  <div class="lz-layer"><span class="lz-k">squash</span><span class="lz-v">Merge into the previous commit and let you write a combined message.</span></div>
  <div class="lz-layer"><span class="lz-k">fixup</span><span class="lz-v">Merge into the previous commit and throw this message away. What you want for "fix typo".</span></div>
  <div class="lz-layer"><span class="lz-k">drop</span><span class="lz-v">Delete the commit entirely. Deleting the line does the same thing.</span></div>
  <div class="lz-layer"><span class="lz-k">break</span><span class="lz-v">Pause here to run tests or look around, then <code>git rebase --continue</code>.</span></div>
</div>
<p>Reordering is available too: move the lines. Git replays them in the order you leave them, which is how you group related commits that were made hours apart.</p>

<h3>The cleanup, worked through</h3>
<pre><code>pick   9e2d4b7 feat(auth): add refresh token rotation
fixup  1a2b3c4 wip
fixup  5f7a9c2 fix typo
fixup  d4e8f0a actually fix it
pick   b2c6a91 add tests</code></pre>
<p>Save and close. Git replays: the first commit is kept, the next three are folded into it and their messages discarded, and the test commit stays separate.</p>
<pre><code>git log --oneline main..HEAD</code></pre>
<div class="out">c7f1a30 test(auth): cover the expired-token path
e8b4d92 feat(auth): add refresh token rotation</div>
<p>Five commits became two, and both mean something. That is the branch a reviewer wants: one commit per idea, each with a message that explains itself.</p>

<h3>Splitting a commit that does two things</h3>
<p>Mark it <code>edit</code>. When the rebase stops there:</p>
<pre><code>git reset HEAD~                <span class="tok-comment"># undo the commit, keep the changes in the working dir</span>
git add -p src/auth.ts         <span class="tok-comment"># stage only the first idea (1.3)</span>
git commit -m <span class="tok-string">"fix: hash passwords with bcrypt"</span>
git add .
git commit -m <span class="tok-string">"refactor: rename user.pw to user.passwordHash"</span>
git rebase --continue</code></pre>
<p>One commit became two, in the right order, with proper messages. This is the cleanest way to undo an over-eager <code>git commit -am</code>.</p>

<h3>--autosquash: mark the fixups as you go</h3>
<p>Rather than editing the to-do list by hand, label the fix at the moment you make it:</p>
<pre><code><span class="tok-comment"># You spot a typo in a commit you made an hour ago:</span>
git commit --fixup 9e2d4b7          <span class="tok-comment"># message becomes "fixup! feat(auth): add refresh…"</span>
git commit --squash 9e2d4b7         <span class="tok-comment"># same, but keeps the message for the combined commit</span>

<span class="tok-comment"># Later, when tidying the branch:</span>
git rebase -i --autosquash main</code></pre>
<p>Git pre-arranges the to-do list: each <code>fixup!</code> commit is moved directly below its target and marked <code>fixup</code>. You usually just save and close. Make it permanent:</p>
<pre><code>git config --global rebase.autosquash true</code></pre>
<div class="callout ok">This is the workflow that makes "commit small" and "clean history" compatible instead of opposed. Commit whenever anything works, mark corrections with <code>--fixup</code>, and one <code>rebase -i --autosquash</code> before the pull request produces a history that looks planned.</div>

<h3>When it goes wrong</h3>
<pre><code>git rebase --abort             <span class="tok-comment"># mid-rebase: back to exactly before you started</span>
git rebase --continue          <span class="tok-comment"># after resolving a conflict or an edit stop</span>
git rebase --skip              <span class="tok-comment"># drop the commit currently being applied</span></code></pre>
<p>And after the rebase has finished but the result is wrong — the case that feels unrecoverable and is not:</p>
<pre><code>git reflog</code></pre>
<div class="out">e8b4d92 HEAD@{0}: rebase (finish): returning to refs/heads/feature/login
c7f1a30 HEAD@{1}: rebase (pick): test(auth): cover the expired-token path
b2c6a91 HEAD@{4}: rebase (start): checkout main
d4e8f0a HEAD@{5}: commit: actually fix it</div>
<pre><code>git reset --hard HEAD@{5}      <span class="tok-comment"># back to the pre-rebase state, everything restored</span></code></pre>
<div class="callout ok"><code>HEAD@{5}</code> is where the branch pointed just before <code>rebase (start)</code>. The original commits were never deleted — the branch simply stopped pointing at them. Chapter 4.4 makes this a reflex; for now, know that a bad rebase costs you one command, not your work.</div>

<h3>The rule that keeps this safe</h3>
<div class="callout danger">Interactive rebase rewrites history, so the golden rule from 3.4 applies in full: only on commits nobody else has. On your own feature branch, before review, it is one of the most valuable tools in Git. On <code>main</code>, it is how you break everyone's clone at once.</div>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 7.6 — Rewriting History</span><span class="lc-sub">Interactive rebase, splitting commits, and the amend workflow.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: turn a 7-commit mess into 3 reviewable commits</span><span class="lc-sub">A graded exercise using fixup, reword, drop and reordering.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> using <code>squash</code> where you meant <code>fixup</code>. <code>squash</code> keeps every message and opens an editor with all of them concatenated, so you end up with a commit whose body reads "wip / fix typo / actually fix it". Use <code>fixup</code> for corrections whose message is worthless — which is nearly all of them — and <code>squash</code> only when both messages contain something you want to keep.</div>
<p class="note-ct"><strong>How much cleaning is enough:</strong> aim for commits a reviewer could read in order and understand as a sequence of decisions. Not one giant commit (unreviewable), and not fifteen (noise). Three to seven meaningful commits is the shape of a pull request that gets reviewed properly instead of approved unread.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.5</span>
<h2>Biến mười commit "wip" thành ba commit tử tế</h2>
<p class="lead">Bạn đã commit nhỏ và thường xuyên, đúng như bài 1.3 khuyên. Nhánh của bạn giờ đọc lên là: <code>wip</code>, <code>fix typo</code>, <code>actually fix it</code>, <code>oops</code>, <code>final</code>. Thế là ổn trong lúc làm và ngượng khi đưa đi review. Rebase tương tác cho phép bạn viết lại nó thành lịch sử bạn <em>đã định</em> viết, trước khi ai khác nhìn thấy.</p>

<pre><code>git rebase -i main            <span class="tok-comment"># mọi commit trên nhánh này kể từ main</span>
git rebase -i HEAD~5          <span class="tok-comment"># năm commit gần nhất</span>
git rebase -i 7b3e9d1         <span class="tok-comment"># mọi thứ SAU commit đó</span></code></pre>
<p>Trình soạn thảo mở ra một danh sách việc-cần-làm. Chưa có gì xảy ra cả — đây là một kịch bản bạn đang sửa, và Git sẽ thi hành nó khi bạn lưu và đóng:</p>
<pre><code>pick 9e2d4b7 feat(auth): add refresh token rotation
pick 1a2b3c4 wip
pick 5f7a9c2 fix typo
pick d4e8f0a actually fix it
pick b2c6a91 add tests

<span class="tok-comment"># Rebase 7b3e9d1..b2c6a91 onto 7b3e9d1 (5 commands)</span>
<span class="tok-comment">#</span>
<span class="tok-comment"># Commands:</span>
<span class="tok-comment"># p, pick   = dùng commit</span>
<span class="tok-comment"># r, reword = dùng commit, nhưng sửa lời nhắn</span>
<span class="tok-comment"># e, edit   = dùng commit, nhưng dừng lại để sửa</span>
<span class="tok-comment"># s, squash = dùng commit, nhưng nhập vào commit phía trước</span>
<span class="tok-comment"># f, fixup  = như squash, nhưng vứt lời nhắn của commit này đi</span>
<span class="tok-comment"># d, drop   = bỏ commit</span>
<span class="tok-comment"># b, break  = dừng ở đây (chạy tiếp bằng git rebase --continue)</span></code></pre>
<div class="callout warn">Danh sách xếp theo thứ tự <strong>cũ nhất trước</strong> — ngược với <code>git log</code>. Chỗ này làm ai cũng vấp một lần. <code>squash</code> và <code>fixup</code> luôn nhập một commit vào cái nằm <em>PHÍA TRÊN</em> nó trong danh sách này, tức là cái xảy ra sớm hơn về thời gian.</div>

<h3>Bảy lệnh</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">pick</span><span class="lz-v">Giữ nguyên. Mặc định cho mọi dòng.</span></div>
  <div class="lz-layer"><span class="lz-k">reword</span><span class="lz-v">Giữ thay đổi, sửa lời nhắn. Git mở trình soạn thảo riêng cho commit đó.</span></div>
  <div class="lz-layer"><span class="lz-k">edit</span><span class="lz-v">Dừng ở commit này để bạn đổi <em>nội dung</em> — chẻ nó ra, thêm một file quên mất, gỡ một dòng debug.</span></div>
  <div class="lz-layer"><span class="lz-k">squash</span><span class="lz-v">Nhập vào commit trước và cho bạn viết một lời nhắn gộp.</span></div>
  <div class="lz-layer"><span class="lz-k">fixup</span><span class="lz-v">Nhập vào commit trước và vứt lời nhắn này đi. Thứ bạn muốn cho "fix typo".</span></div>
  <div class="lz-layer"><span class="lz-k">drop</span><span class="lz-v">Xoá hẳn commit. Xoá cả dòng đó đi cũng có tác dụng y hệt.</span></div>
  <div class="lz-layer"><span class="lz-k">break</span><span class="lz-v">Dừng ở đây để chạy test hay ngó nghiêng, rồi <code>git rebase --continue</code>.</span></div>
</div>
<p>Đổi thứ tự cũng làm được: chỉ việc dời các dòng. Git phát lại chúng theo thứ tự bạn để lại, và đó là cách bạn gom những commit liên quan được tạo cách nhau nhiều giờ.</p>

<h3>Cuộc dọn dẹp, làm từng bước</h3>
<pre><code>pick   9e2d4b7 feat(auth): add refresh token rotation
fixup  1a2b3c4 wip
fixup  5f7a9c2 fix typo
fixup  d4e8f0a actually fix it
pick   b2c6a91 add tests</code></pre>
<p>Lưu và đóng. Git phát lại: commit đầu được giữ, ba cái tiếp theo bị gấp vào trong nó và lời nhắn của chúng bị vứt đi, còn commit test thì đứng riêng.</p>
<pre><code>git log --oneline main..HEAD</code></pre>
<div class="out">c7f1a30 test(auth): cover the expired-token path
e8b4d92 feat(auth): add refresh token rotation</div>
<p>Năm commit thành hai, và cả hai đều có nghĩa. Đó là cái nhánh mà người review muốn thấy: mỗi commit một ý, mỗi cái một lời nhắn tự giải thích được.</p>

<h3>Chẻ một commit làm hai việc</h3>
<p>Đánh dấu nó là <code>edit</code>. Khi rebase dừng ở đó:</p>
<pre><code>git reset HEAD~                <span class="tok-comment"># huỷ commit, giữ thay đổi ở thư mục làm việc</span>
git add -p src/auth.ts         <span class="tok-comment"># chỉ staging ý thứ nhất (bài 1.3)</span>
git commit -m <span class="tok-string">"fix: bam mat khau bang bcrypt"</span>
git add .
git commit -m <span class="tok-string">"refactor: doi ten user.pw thanh user.passwordHash"</span>
git rebase --continue</code></pre>
<p>Một commit thành hai, đúng thứ tự, kèm lời nhắn tử tế. Đây là cách sạch nhất để sửa một lần <code>git commit -am</code> quá vội vàng.</p>

<h3>--autosquash: đánh dấu các bản vá ngay khi tạo</h3>
<p>Thay vì sửa danh sách việc bằng tay, hãy gắn nhãn cho bản vá ngay lúc bạn tạo ra nó:</p>
<pre><code><span class="tok-comment"># Bạn thấy một lỗi chính tả trong commit tạo một giờ trước:</span>
git commit --fixup 9e2d4b7          <span class="tok-comment"># lời nhắn thành "fixup! feat(auth): add refresh…"</span>
git commit --squash 9e2d4b7         <span class="tok-comment"># tương tự, nhưng giữ lời nhắn cho commit gộp</span>

<span class="tok-comment"># Về sau, khi dọn nhánh:</span>
git rebase -i --autosquash main</code></pre>
<p>Git sắp sẵn danh sách: mỗi commit <code>fixup!</code> được dời xuống ngay dưới commit đích và đánh dấu <code>fixup</code>. Bạn thường chỉ việc lưu và đóng. Hãy đặt nó vĩnh viễn:</p>
<pre><code>git config --global rebase.autosquash true</code></pre>
<div class="callout ok">Đây là quy trình làm cho "commit nhỏ" và "lịch sử sạch" tương thích với nhau thay vì đối lập. Commit bất cứ khi nào có thứ gì chạy được, đánh dấu các bản sửa bằng <code>--fixup</code>, và một lần <code>rebase -i --autosquash</code> trước pull request cho ra một lịch sử trông như đã được lên kế hoạch.</div>

<h3>Khi mọi thứ đi sai</h3>
<pre><code>git rebase --abort             <span class="tok-comment"># đang giữa chừng: về đúng trước lúc bạn bắt đầu</span>
git rebase --continue          <span class="tok-comment"># sau khi giải xung đột hoặc sau một lần dừng edit</span>
git rebase --skip              <span class="tok-comment"># bỏ commit đang được áp</span></code></pre>
<p>Và khi rebase đã xong nhưng kết quả sai — trường hợp có cảm giác không cứu được mà thật ra thì được:</p>
<pre><code>git reflog</code></pre>
<div class="out">e8b4d92 HEAD@{0}: rebase (finish): returning to refs/heads/feature/login
c7f1a30 HEAD@{1}: rebase (pick): test(auth): cover the expired-token path
b2c6a91 HEAD@{4}: rebase (start): checkout main
d4e8f0a HEAD@{5}: commit: actually fix it</div>
<pre><code>git reset --hard HEAD@{5}      <span class="tok-comment"># về trạng thái trước rebase, mọi thứ trở lại</span></code></pre>
<div class="callout ok"><code>HEAD@{5}</code> là chỗ nhánh trỏ tới ngay trước dòng <code>rebase (start)</code>. Các commit gốc chưa bao giờ bị xoá — chỉ là cái nhánh thôi trỏ vào chúng. Bài 4.4 biến việc này thành phản xạ; còn giờ, hãy biết rằng một lần rebase hỏng tốn của bạn một lệnh, không phải công việc của bạn.</div>

<h3>Luật giữ cho việc này an toàn</h3>
<div class="callout danger">Rebase tương tác VIẾT LẠI lịch sử, nên luật vàng ở bài 3.4 áp dụng đầy đủ: chỉ làm trên những commit chưa ai khác có. Trên nhánh tính năng của chính bạn, trước khi review, nó là một trong những công cụ giá trị nhất của Git. Trên <code>main</code>, nó là cách bạn làm hỏng bản clone của tất cả mọi người cùng một lúc.</div>

<a class="link-card" href="https://git-scm.com/book/vi/v2/C%C3%A1c-C%C3%B4ng-C%E1%BB%A5-Git-Vi%E1%BA%BFt-L%E1%BA%A1i-L%E1%BB%8Bch-S%E1%BB%AD" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 7.6 (tiếng Việt) — Viết lại lịch sử</span><span class="lc-sub">Rebase tương tác, chẻ commit, và quy trình amend.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: biến một mớ 7 commit thành 3 commit review được</span><span class="lc-sub">Bài tập chấm điểm dùng fixup, reword, drop và đổi thứ tự.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dùng <code>squash</code> trong khi ý bạn là <code>fixup</code>. <code>squash</code> giữ mọi lời nhắn và mở trình soạn thảo với tất cả nối lại, nên bạn nhận một commit có thân đọc lên là "wip / fix typo / actually fix it". Hãy dùng <code>fixup</code> cho các bản sửa mà lời nhắn vô giá trị — tức gần như tất cả — và chỉ dùng <code>squash</code> khi cả hai lời nhắn đều có thứ đáng giữ.</div>
<p class="note-ct"><strong>Dọn tới mức nào là đủ:</strong> hãy nhắm tới những commit mà người review đọc lần lượt và hiểu được như một chuỗi quyết định. Không phải một commit khổng lồ (không review nổi), cũng không phải mười lăm cái (nhiễu). Ba tới bảy commit có nghĩa là hình dạng của một pull request được review đàng hoàng thay vì được duyệt mà chẳng ai đọc.</p>
</div>
`,
    },

    /* ─────────────────────────── 3.6 Quiz ─────────────────────────── */
    {
      title: '3.6 — Chapter 3 quiz|||3.6 — Kiểm tra Chương 3',
      slug: 'git-3-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về nhánh là con trỏ, fast-forward vs ba chiều, tổ tiên chung, đọc ký hiệu xung đột (kể cả đảo nhãn khi rebase), luật vàng, và rebase tương tác.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on branching and merging. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: why the conflict labels invert during a rebase (3.3), and the golden rule about rebasing shared commits (3.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về nhánh và hợp nhất. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: vì sao nhãn xung đột đảo ngược khi rebase (3.3), và luật vàng về rebase những commit đã chia sẻ (3.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What is a Git branch, physically?|||Về mặt vật lý, một nhánh Git là gì?',
            options: [
              'A copy of the whole source tree|||Một bản sao của cả cây mã nguồn',
              'A 41-byte file under .git/refs/heads/ containing one commit hash|||Một file 41 byte dưới .git/refs/heads/ chứa một mã băm commit',
              'A compressed archive of all commits on that line|||Một kho nén mọi commit trên dòng đó',
              'An entry in a database inside .git/index|||Một bản ghi trong cơ sở dữ liệu bên trong .git/index',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'When does git merge do a fast-forward instead of creating a merge commit?|||Khi nào git merge làm fast-forward thay vì tạo một commit hợp nhất?',
            options: [
              'When there are no conflicts|||Khi không có xung đột nào',
              'When the current branch tip is an ancestor of the branch being merged — so nothing needs reconciling|||Khi đầu nhánh hiện tại là tổ tiên của nhánh đang được hợp nhất — nên không có gì cần điều hoà',
              'When fewer than 10 files changed|||Khi có ít hơn 10 file thay đổi',
              'Only when you pass --ff|||Chỉ khi bạn truyền --ff',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is knowing the common ancestor essential to a three-way merge?|||Vì sao biết tổ tiên chung là thiết yếu với hợp nhất ba chiều?',
            options: [
              'It is only used to sort commits by date|||Nó chỉ dùng để sắp commit theo ngày',
              'It lets Git tell "you added this line" apart from "they deleted it" — a two-way comparison cannot|||Nó cho phép Git phân biệt "bạn THÊM dòng này" với "họ XOÁ nó" — phép so hai chiều thì không',
              'It makes the merge faster but changes nothing else|||Nó làm merge nhanh hơn nhưng không đổi gì khác',
              'It determines which branch name appears in the merge message|||Nó quyết định tên nhánh nào xuất hiện trong lời nhắn hợp nhất',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'During a REBASE, which side is under "<<<<<<< HEAD" in a conflict?|||Trong lúc REBASE, phía nào nằm dưới "<<<<<<< HEAD" khi có xung đột?',
            options: [
              'Your own commit, same as in a merge|||Commit của chính bạn, giống như khi merge',
              'The branch you are rebasing ONTO — the labels are inverted compared to a merge|||Nhánh bạn đang rebase LÊN — nhãn bị đảo so với khi merge',
              'Always the main branch, whatever you are doing|||Luôn là nhánh main, dù bạn đang làm gì',
              'The merge base|||Điểm gốc hợp nhất',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does merge.conflictStyle = zdiff3 add to a conflict?|||merge.conflictStyle = zdiff3 thêm gì vào một xung đột?',
            options: [
              'Colours in the terminal|||Màu sắc trong terminal',
              'A third section showing the ORIGINAL content from the merge base, so you can see what each side changed|||Một phần thứ ba hiện nội dung GỐC từ điểm gốc hợp nhất, để bạn thấy mỗi bên đã đổi gì',
              'It resolves whitespace conflicts automatically|||Nó tự giải các xung đột khoảng trắng',
              'It shows three suggested resolutions|||Nó gợi ý ba cách giải',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why must you never rebase commits other people already have?|||Vì sao tuyệt đối không được rebase những commit người khác đã có?',
            options: [
              'Rebase is slower on shared branches|||Rebase chậm hơn trên nhánh chung',
              'Rebase replaces commits with new hashes, so their history and yours diverge and their next pull produces duplicates and unexplainable conflicts|||Rebase thay commit bằng những cái có mã băm mới, nên lịch sử của họ và của bạn phân ly, và lần pull sau của họ sinh ra commit trùng lặp cùng xung đột không giải thích nổi',
              'GitHub blocks it|||GitHub chặn việc đó',
              'It deletes the original commits permanently|||Nó xoá vĩnh viễn các commit gốc',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In an interactive rebase to-do list, "fixup" merges a commit into which one?|||Trong danh sách việc của rebase tương tác, "fixup" nhập một commit vào commit nào?',
            options: [
              'The one below it in the list|||Cái nằm dưới nó trong danh sách',
              'The one above it in the list — the chronologically earlier commit — discarding this one\'s message|||Cái nằm TRÊN nó trong danh sách — commit sớm hơn về thời gian — và vứt lời nhắn của cái này đi',
              'The most recent commit on the branch|||Commit mới nhất của nhánh',
              'The merge base|||Điểm gốc hợp nhất',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A rebase finished but the result is wrong. What recovers the pre-rebase state?|||Rebase đã xong nhưng kết quả sai. Cái gì khôi phục trạng thái trước rebase?',
            options: [
              'git rebase --abort (it works after the rebase completes too)|||git rebase --abort (nó vẫn chạy sau khi rebase kết thúc)',
              'git reflog to find the entry just before "rebase (start)", then git reset --hard HEAD@{n}|||git reflog để tìm bản ghi ngay trước "rebase (start)", rồi git reset --hard HEAD@{n}',
              'Nothing — the old commits were deleted|||Không gì cả — các commit cũ đã bị xoá',
              'git merge --abort',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
