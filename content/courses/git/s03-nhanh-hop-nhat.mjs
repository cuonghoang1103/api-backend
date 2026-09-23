/**
 * Git & GitHub — Chương 3: Nhánh & hợp nhất.
 * Nhánh là một file 41 byte · fast-forward vs merge 3 chiều · xung đột (đọc và giải)
 * · rebase vs merge · rebase tương tác (gộp, đổi lời, đổi thứ tự).
 * Output CHẠY THẬT git 2.43. LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;;
 * & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 3 — Branching & merging|||Chương 3 — Nhánh & hợp nhất',
  description: 'Nhánh là thứ Git làm rẻ nhất và cũng là thứ người ta sợ nhất. Chương này cho thấy một nhánh thật ra chỉ là một file 41 byte, hai kiểu hợp nhất khác nhau ra sao, cách đọc và giải một xung đột mà không hoảng, và khi nào rebase tốt hơn merge — kèm ranh giới an toàn của nó.',
  lessons: [
    /* ─────────────────────────── 3.0 ─────────────────────────── */
    {
      title: '3.0 — Chapter 3 slides: branches, merges and rebase in pictures|||3.0 — Slide Chương 3: nhánh, hợp nhất và rebase bằng hình',
      slug: 'git-3-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 18 slide của Chương 3: nhánh là file 41 byte, fast-forward và merge ba chiều, đọc và giải xung đột, rebase sao chép commit, rebase -i và cứu bằng reflog — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Slides</span>
<h2>The whole chapter in 18 slides</h2>
<p class="lead">This is the chapter where pictures matter most: every command here changes the <em>shape</em> of the commit graph. Skim the slides first to see those shapes — fast-forward, a merge commit with two parents, a rebase that leaves ghost copies behind — then read the lessons for the why.</p>
<p>Every terminal, conflict and hash on these slides is real output from Git 2.51, run in a throw-away repository. The last two slides are a cheat sheet and a 40-minute practice session that makes you create a conflict on purpose and squash four messy commits into two.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Slide</span>
<h2>Cả chương trong 18 slide</h2>
<p class="lead">Đây là chương cần hình nhất khoá: lệnh nào ở đây cũng đổi <em>hình dạng</em> của đồ thị commit. Lướt bộ slide trước để thấy các hình dạng đó — tua thẳng (fast-forward), commit hợp nhất có hai cha, rebase để lại những bản sao "ma" — rồi đọc bài giảng để hiểu vì sao.</p>
<p>Mọi terminal, vùng xung đột và mã băm trên slide đều là output thật của Git 2.51, chạy trong một kho thử. Hai slide cuối là bảng tra nhanh và một buổi thực hành 40 phút: tự tạo một xung đột rồi giải, và gộp bốn commit lộn xộn thành hai.</p>
</div>
${gallery('git-03', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Một nhánh = một file 41 byte'], [4, 'Commit mới chỉ dời nhánh HEAD đang trỏ'],
  [5, 'Detached HEAD'], [6, 'Fast-forward: trước và sau'], [7, 'Hợp nhất ba chiều: commit hai cha'],
  [8, 'Đọc git log --graph, chọn kiểu merge'], [9, 'Đọc vùng xung đột zdiff3'], [10, 'Bốn bước giải xung đột'],
  [11, 'Rebase sao chép commit'], [12, 'Merge vs rebase và luật vàng'], [13, 'Xung đột khi rebase: nhãn bị đảo'],
  [14, 'Danh sách việc của rebase -i'], [15, '5 commit thành 2'], [16, 'Cứu rebase hỏng bằng reflog'],
  [17, 'Bảng tra nhanh'], [18, 'Thực hành chương 3'],
])}
`,
    },

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
${slide('git-03', 3, 'Một nhánh = một file 41 byte')}
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
${slide('git-03', 4, 'Commit mới chỉ dời nhánh mà HEAD đang trỏ')}
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
${slide('git-03', 5, 'Detached HEAD và commit bị bỏ rơi')}
<pre><code>git switch --detach HEAD~3
cat .git/HEAD</code></pre>
<div class="out">3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d</div>
<p><code>HEAD</code> now holds a commit hash directly instead of a branch name. Everything works normally, with one catch: commits you make here move <em>no branch pointer</em>, so as soon as you switch away nothing refers to them and they become garbage.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">safe</div><div class="lz-t">Looking around</div><div class="lz-d">Checking out an old commit to build or test it. Switch back and nothing is lost.</div></div>
  <div class="lz-step"><div class="lz-k">risky</div><div class="lz-t">Committing there</div><div class="lz-d">The commits are real but unreferenced. Give them a home before leaving: <code>git switch -c rescue</code>.</div></div>
  <div class="lz-step"><div class="lz-k">recovery</div><div class="lz-t">Already switched away</div><div class="lz-d"><code>git reflog</code> still lists them for 30 days. Chapter 4.4 and 13.5.</div></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In your <code>thu-git</code> playground from Chapter 1, run <code>git switch -c thu/nhanh</code>, then <code>cat .git/refs/heads/thu/nhanh</code> and <code>wc -c &lt; .git/refs/heads/thu/nhanh</code>. (Git Bash on Windows has <code>wc</code>; in PowerShell use <code>(Get-Item .git/refs/heads/thu/nhanh).Length</code>.)</li><li>Run <code>cat .git/HEAD</code>. Make one commit on <code>thu/nhanh</code>, then run <code>git branch -v</code>: predict first which of the two branches moved.</li><li>Go detached on purpose: <code>git switch --detach HEAD~1</code>, commit a new file <code>y.txt</code> with the message "thử lìa cành", then <code>git switch main</code>. Read the warning — it prints the hash of the commit you are leaving behind.</li><li>Rescue that commit with <code>git branch cuu-ho &lt;hash from the warning&gt;</code>. Finally try <code>git branch -d thu/nhanh</code> and read why Git refuses.</li></ol>
<pre><code class="language-bash">wc -c &lt; .git/refs/heads/thu/nhanh
      41
git switch main
Warning: you are leaving 1 commit behind, not connected to
any of your branches:

  2aa317c thử lìa cành
git branch -d thu/nhanh
error: the branch 'thu/nhanh' is not fully merged
hint: If you are sure you want to delete it, run 'git branch -D thu/nhanh'</code></pre>
<p><strong>Done when:</strong> the byte count is 41, <code>git log --oneline -1 cuu-ho</code> shows your "thử lìa cành" commit, and you can say in one sentence why <code>-d</code> refused (the commit on <code>thu/nhanh</code> exists on no other branch). Your hashes will differ from these.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Branch</span><span class="v">A movable pointer: one file under <code>.git/refs/heads/</code> holding one commit hash.</span></div>
  <div class="kv"><span class="k">HEAD</span><span class="v">Says which branch you are on (<code>ref: refs/heads/main</code>). That branch is the one a new commit moves.</span></div>
  <div class="kv"><span class="k">Ref</span><span class="v">Any name that points at a commit: branches, tags, remote-tracking branches like <code>origin/main</code>.</span></div>
  <div class="kv"><span class="k">Detached HEAD</span><span class="v">HEAD holds a commit hash instead of a branch name. Commits made there belong to no branch.</span></div>
  <div class="kv"><span class="k">git switch</span><span class="v">The modern command for changing branch; <code>-c</code> creates one. Replaces the branch half of <code>git checkout</code>.</span></div>
  <div class="kv"><span class="k">Fully merged</span><span class="v">Every commit of the branch is reachable from where you are — the condition <code>git branch -d</code> checks.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A branch is a 41-byte file containing a commit hash; creating one copies nothing.</li><li><code>HEAD</code> names the current branch, and a commit moves only that branch.</li><li><code>git switch -c name</code> creates and switches; <code>git switch -</code> goes back.</li><li>Detached HEAD is a normal state — give any commit made there a branch before you leave.</li><li>Delete with <code>-d</code> by default: when it refuses, it is protecting work that exists nowhere else.</li></ul>

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
${slide('git-03', 3, 'Một nhánh = một file 41 byte')}
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
${slide('git-03', 4, 'Commit mới chỉ dời nhánh mà HEAD đang trỏ')}
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
${slide('git-03', 5, 'Detached HEAD và commit bị bỏ rơi')}
<pre><code>git switch --detach HEAD~3
cat .git/HEAD</code></pre>
<div class="out">3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d</div>
<p><code>HEAD</code> giờ giữ thẳng một mã băm commit thay vì tên một nhánh. Mọi thứ chạy bình thường, trừ một điều: commit bạn tạo ở đây <em>không dời con trỏ nhánh nào</em>, nên vừa chuyển đi chỗ khác là không còn gì trỏ tới chúng và chúng thành rác.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">an toàn</div><div class="lz-t">Chỉ ngó nghiêng</div><div class="lz-d">Checkout một commit cũ để dựng hay để test. Chuyển về là không mất gì.</div></div>
  <div class="lz-step"><div class="lz-k">rủi ro</div><div class="lz-t">Commit ở đó</div><div class="lz-d">Các commit là thật nhưng không được ai trỏ tới. Hãy cho chúng một mái nhà trước khi rời đi: <code>git switch -c rescue</code>.</div></div>
  <div class="lz-step"><div class="lz-k">cứu hộ</div><div class="lz-t">Lỡ chuyển đi rồi</div><div class="lz-d"><code>git reflog</code> vẫn liệt kê chúng trong 30 ngày. Bài 4.4 và 13.5.</div></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong kho sân tập <code>thu-git</code> từ Chương 1, chạy <code>git switch -c thu/nhanh</code>, rồi <code>cat .git/refs/heads/thu/nhanh</code> và <code>wc -c &lt; .git/refs/heads/thu/nhanh</code>. (Git Bash trên Windows có <code>wc</code>; trong PowerShell dùng <code>(Get-Item .git/refs/heads/thu/nhanh).Length</code>.)</li><li>Chạy <code>cat .git/HEAD</code>. Tạo một commit trên <code>thu/nhanh</code>, rồi chạy <code>git branch -v</code>: đoán trước xem nhánh nào trong hai nhánh đã dời đi.</li><li>Cố tình lìa cành: <code>git switch --detach HEAD~1</code>, commit một file mới <code>y.txt</code> với lời nhắn "thử lìa cành", rồi <code>git switch main</code>. Đọc lời cảnh báo — nó in mã băm của commit bạn đang bỏ lại.</li><li>Cứu commit đó bằng <code>git branch cuu-ho &lt;mã băm trong lời cảnh báo&gt;</code>. Cuối cùng thử <code>git branch -d thu/nhanh</code> và đọc xem vì sao Git từ chối.</li></ol>
<pre><code class="language-bash">wc -c &lt; .git/refs/heads/thu/nhanh
      41
git switch main
Warning: you are leaving 1 commit behind, not connected to
any of your branches:

  2aa317c thử lìa cành
git branch -d thu/nhanh
error: the branch 'thu/nhanh' is not fully merged
hint: If you are sure you want to delete it, run 'git branch -D thu/nhanh'</code></pre>
<p><strong>Đạt khi:</strong> đếm ra đúng 41 byte, <code>git log --oneline -1 cuu-ho</code> hiện commit "thử lìa cành" của bạn, và bạn nói được trong một câu vì sao <code>-d</code> từ chối (commit trên <code>thu/nhanh</code> không có ở nhánh nào khác). Mã băm trên máy bạn sẽ khác mấy mã này.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Branch</span><span class="v">Nhánh — một con trỏ di động: đúng một file dưới <code>.git/refs/heads/</code> chứa một mã băm commit.</span></div>
  <div class="kv"><span class="k">HEAD</span><span class="v">Đầu đọc — cho biết bạn đang đứng trên nhánh nào (<code>ref: refs/heads/main</code>); commit mới sẽ dời đúng nhánh đó.</span></div>
  <div class="kv"><span class="k">Ref</span><span class="v">Tham chiếu — mọi cái tên trỏ tới một commit: nhánh, tag, nhánh theo dõi remote như <code>origin/main</code>.</span></div>
  <div class="kv"><span class="k">Detached HEAD</span><span class="v">HEAD lìa cành — HEAD giữ thẳng một mã băm thay vì tên nhánh; commit tạo ở đó không thuộc nhánh nào.</span></div>
  <div class="kv"><span class="k">git switch</span><span class="v">Lệnh đổi nhánh đời mới; <code>-c</code> để tạo nhánh. Thay cho nửa "đổi nhánh" của <code>git checkout</code>.</span></div>
  <div class="kv"><span class="k">Fully merged</span><span class="v">Đã hợp nhất trọn — mọi commit của nhánh đều tới được từ chỗ bạn đứng; đó là điều <code>git branch -d</code> kiểm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một nhánh là một file 41 byte chứa mã băm commit; tạo nhánh không chép gì cả.</li><li><code>HEAD</code> gọi tên nhánh hiện tại, và commit mới chỉ dời đúng nhánh đó.</li><li><code>git switch -c ten</code> vừa tạo vừa chuyển; <code>git switch -</code> quay về nhánh trước.</li><li>HEAD lìa cành là trạng thái bình thường — commit nào tạo ở đó thì đặt cho nó một nhánh trước khi rời đi.</li><li>Xoá nhánh mặc định bằng <code>-d</code>: khi nó từ chối là nó đang giữ hộ phần việc không nằm ở đâu khác.</li></ul>

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
${slide('git-03', 6, 'Fast-forward: trước và sau')}
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
${slide('git-03', 7, 'Hợp nhất ba chiều: commit merge có hai cha')}
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
${slide('git-03', 8, 'Đọc git log --graph và chọn kiểu merge')}
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In <code>thu-git</code>, from <code>main</code>: <code>git switch -c feature/ff</code>, make two commits (for example a file <code>home.txt</code>), <code>git switch main</code>, <code>git merge feature/ff</code>. Find the word "Fast-forward" and confirm with <code>git log --oneline -3</code> that no new commit appeared.</li><li>Now make both sides move: <code>git switch -c feature/ba-chieu</code>, commit <code>login.txt</code>; switch back to <code>main</code> and commit <code>README.md</code> — as if a teammate's work landed on main meanwhile.</li><li>Before merging, predict the merge base, then check it with <code>git merge-base main feature/ba-chieu</code>. Merge with <code>git merge --no-edit feature/ba-chieu</code>.</li><li>Read the result with <code>git log --oneline --graph -5</code> and ask the merge commit for its parents.</li></ol>
<pre><code class="language-bash">git merge feature/ff
Updating b1f3c61..7c17b58
Fast-forward
git merge --no-edit feature/ba-chieu
Merge made by the 'ort' strategy.
git show --no-patch --format="%h cha: %p" HEAD
3acbc85 cha: 55cf02b a24c295   <span class="tok-comment"># ^1 = 55cf02b (main side) · ^2 = a24c295 (feature side)</span></code></pre>
<p><strong>Done when:</strong> you can point at the only commit with two parents in the graph, say which parent is <code>^1</code>, and explain why the first merge created no commit at all.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Fast-forward</span><span class="v">Merge that only slides the branch pointer forward, because your branch is an ancestor of the other. No new commit.</span></div>
  <div class="kv"><span class="k">Three-way merge</span><span class="v">Merge that compares both tips with their common ancestor and records the combined result.</span></div>
  <div class="kv"><span class="k">Merge base</span><span class="v">The most recent common ancestor of the two branches; <code>git merge-base</code> prints it.</span></div>
  <div class="kv"><span class="k">Merge commit</span><span class="v">A commit with two parents: <code>^1</code> the branch you were on, <code>^2</code> the branch you merged in.</span></div>
  <div class="kv"><span class="k">--no-ff / --ff-only</span><span class="v">Always create a merge commit / refuse unless a fast-forward is possible.</span></div>
  <div class="kv"><span class="k">--first-parent</span><span class="v">Follow only <code>^1</code> when walking history — on a <code>--no-ff</code> main it lists one line per feature.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>If the branch you are on is an ancestor of the other, <code>git merge</code> just slides the pointer — a fast-forward, no new commit.</li><li>If both sides moved, Git diffs each side against the merge base and records a commit with two parents.</li><li><code>HEAD^1</code> is the side you were on; <code>HEAD^2</code> is the branch you merged in.</li><li><code>--no-ff</code> keeps one visible merge per feature; <code>--ff-only</code> refuses anything but a fast-forward.</li><li>A merge without conflicts is not proof the code works — run the tests after merging.</li></ul>

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
${slide('git-03', 6, 'Fast-forward: trước và sau')}
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
${slide('git-03', 7, 'Hợp nhất ba chiều: commit merge có hai cha')}
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
${slide('git-03', 8, 'Đọc git log --graph và chọn kiểu merge')}
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong <code>thu-git</code>, đứng ở <code>main</code>: <code>git switch -c feature/ff</code>, tạo hai commit (ví dụ file <code>home.txt</code>), <code>git switch main</code>, <code>git merge feature/ff</code>. Tìm chữ "Fast-forward" và kiểm bằng <code>git log --oneline -3</code> rằng không có commit mới nào.</li><li>Giờ cho cả hai bên cùng tiến: <code>git switch -c feature/ba-chieu</code>, commit <code>login.txt</code>; quay về <code>main</code> và commit <code>README.md</code> — như thể việc của một bạn cùng nhóm vừa vào main trong lúc đó.</li><li>Trước khi merge, đoán điểm gốc hợp nhất (merge base), rồi kiểm bằng <code>git merge-base main feature/ba-chieu</code>. Hợp nhất bằng <code>git merge --no-edit feature/ba-chieu</code>.</li><li>Đọc kết quả bằng <code>git log --oneline --graph -5</code> và hỏi commit hợp nhất xem nó có những cha nào.</li></ol>
<pre><code class="language-bash">git merge feature/ff
Updating b1f3c61..7c17b58
Fast-forward
git merge --no-edit feature/ba-chieu
Merge made by the 'ort' strategy.
git show --no-patch --format="%h cha: %p" HEAD
3acbc85 cha: 55cf02b a24c295   <span class="tok-comment"># ^1 = 55cf02b (phía main) · ^2 = a24c295 (phía feature)</span></code></pre>
<p><strong>Đạt khi:</strong> bạn chỉ ra được commit duy nhất có hai cha trong đồ thị, nói được cha nào là <code>^1</code>, và giải thích được vì sao lần merge đầu không tạo commit nào.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Fast-forward</span><span class="v">Tua thẳng — merge chỉ trượt con trỏ nhánh lên, vì nhánh của bạn là tổ tiên của nhánh kia. Không có commit mới.</span></div>
  <div class="kv"><span class="k">Three-way merge</span><span class="v">Hợp nhất ba chiều — so hai đầu nhánh với tổ tiên chung của chúng rồi ghi lại kết quả gộp.</span></div>
  <div class="kv"><span class="k">Merge base</span><span class="v">Điểm gốc hợp nhất — tổ tiên chung gần nhất của hai nhánh; <code>git merge-base</code> in nó ra.</span></div>
  <div class="kv"><span class="k">Merge commit</span><span class="v">Commit hợp nhất — commit có hai cha: <code>^1</code> là nhánh bạn đang đứng, <code>^2</code> là nhánh được nhập vào.</span></div>
  <div class="kv"><span class="k">--no-ff / --ff-only</span><span class="v">Luôn tạo commit hợp nhất / từ chối nếu không tua thẳng được.</span></div>
  <div class="kv"><span class="k">--first-parent</span><span class="v">Chỉ đi theo cha thứ nhất (<code>^1</code>) — trên một main dùng <code>--no-ff</code>, mỗi tính năng hiện đúng một dòng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Nếu nhánh bạn đang đứng là tổ tiên của nhánh kia, <code>git merge</code> chỉ trượt con trỏ — tua thẳng, không có commit mới.</li><li>Nếu cả hai bên đã tiến, Git so từng bên với điểm gốc hợp nhất rồi ghi một commit có hai cha.</li><li><code>HEAD^1</code> là phía bạn đang đứng; <code>HEAD^2</code> là nhánh được nhập vào.</li><li><code>--no-ff</code> giữ mỗi tính năng một "nút" nhìn thấy được; <code>--ff-only</code> từ chối mọi thứ trừ tua thẳng.</li><li>Merge không xung đột chưa chứng minh mã chạy được — chạy test SAU khi merge.</li></ul>

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
${slide('git-03', 9, 'Đọc một vùng xung đột kiểu zdiff3')}
<pre><code>git config --global merge.conflictStyle zdiff3</code></pre>
<pre><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
  const ttl = 60 * 60;          <span class="tok-comment">// 1 hour</span>
||||||| 7b3e9d1
  const ttl = 30 * 60;          <span class="tok-comment">// 30 minutes</span>
=======
  const ttl = 15 * 60;          <span class="tok-comment">// 15 minutes</span>
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/login</code></pre>
<p>Now you can see the original was 30 minutes: one side <em>raised</em> it, the other <em>lowered</em> it. That is a real disagreement needing a decision. Without the base you might have assumed one side simply added the line. <strong>Turn this on today</strong> — it is the single highest-value Git setting in this course, and <code>zdiff3</code> is the improved version that keeps common lines out of the conflict region.</p>
<div class="callout ok">The line after <code>|||||||</code> names the base: in a merge Git prints the merge base’s short hash (here <code>7b3e9d1</code>, commit A from lesson 3.2); during a rebase it prints <code>parent of &lt;hash&gt; (&lt;message&gt;)</code> instead. Either way, the lines under it are the text <em>before</em> both sides touched it.</div>

<h3>The four-step resolution</h3>
${slide('git-03', 10, 'Bốn bước giải xung đột')}
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Turn on the base view once: <code>git config --global merge.conflictStyle zdiff3</code>.</li><li>Build a conflict yourself. In <code>thu-git</code> on <code>main</code>: create <code>config.txt</code> containing <code>ttl=30</code> and commit. <code>git switch -c feature/ttl</code>, change it to <code>ttl=15</code>, commit. <code>git switch main</code>, change it to <code>ttl=60</code>, commit.</li><li><code>git merge feature/ttl</code>. Run <code>git status -s</code> (expect <code>UU config.txt</code>) and <code>cat config.txt</code>. Point at the three versions: yours, the base, theirs.</li><li>Decide — say the team agreed on 15 — and write <code>ttl=15</code>. Run <code>git diff --check</code> (must print nothing), then <code>git add config.txt</code> and <code>git commit --no-edit</code>.</li><li>Build the same conflict again on a new pair of branches, and this time leave with <code>git merge --abort</code>; check that <code>git status</code> is clean.</li></ol>
<pre><code class="language-bash">cat config.txt
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
ttl=60
||||||| 0069feb          <span class="tok-comment"># short hash of the merge base: the commit that said ttl=30</span>
ttl=30
=======
ttl=15
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/ttl
git diff --check         <span class="tok-comment"># run BEFORE fixing the file:</span>
config.txt:1: leftover conflict marker
config.txt:3: leftover conflict marker
config.txt:5: leftover conflict marker
config.txt:7: leftover conflict marker</code></pre>
<p><strong>Done when:</strong> <code>git log --oneline --graph -4</code> shows a merge commit joining <code>feature/ttl</code>, and <code>git grep -n "&lt;&lt;&lt;&lt;&lt;&lt;&lt;"</code> prints nothing.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Merge conflict</span><span class="v">Both sides changed the same lines; Git pauses the merge and asks you to decide.</span></div>
  <div class="kv"><span class="k">Conflict markers</span><span class="v"><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> · <code>|||||||</code> · <code>=======</code> · <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> — the lines that fence off each version. All must be deleted.</span></div>
  <div class="kv"><span class="k">Ours / theirs</span><span class="v">In a merge: ours = the branch you are on (HEAD), theirs = the branch being merged in.</span></div>
  <div class="kv"><span class="k">zdiff3</span><span class="v">Conflict style that also shows the base version, so you can see what each side changed.</span></div>
  <div class="kv"><span class="k">Unmerged path (UU)</span><span class="v">How <code>git status -s</code> shows a file still in conflict; <code>git add</code> marks it resolved.</span></div>
  <div class="kv"><span class="k">git merge --abort</span><span class="v">Cancels the paused merge and restores everything to how it was before.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A conflict means both sides edited the same lines; the merge is paused and nothing is lost.</li><li>Top half (<code>HEAD</code>) is the branch you are on, bottom half is the branch being merged; zdiff3 adds the base in the middle.</li><li>Resolving = edit the file, delete every marker, <code>git add</code>, <code>git commit</code> — then run the tests.</li><li><code>git diff --check</code> catches leftover markers before they reach history.</li><li><code>git merge --abort</code> is always available until you commit.</li></ul>

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
${slide('git-03', 9, 'Đọc một vùng xung đột kiểu zdiff3')}
<pre><code>git config --global merge.conflictStyle zdiff3</code></pre>
<pre><code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
  const ttl = 60 * 60;          <span class="tok-comment">// 1 giờ</span>
||||||| 7b3e9d1
  const ttl = 30 * 60;          <span class="tok-comment">// 30 phút</span>
=======
  const ttl = 15 * 60;          <span class="tok-comment">// 15 phút</span>
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/login</code></pre>
<p>Giờ bạn thấy bản gốc là 30 phút: một bên <em>nâng lên</em>, bên kia <em>hạ xuống</em>. Đó là một bất đồng thật sự cần một quyết định. Không có bản gốc, bạn có thể đã tưởng một bên chỉ đơn giản thêm dòng đó vào. <strong>Hãy bật cái này ngay hôm nay</strong> — nó là thiết lập Git có giá trị nhất trong cả khoá, và <code>zdiff3</code> là bản cải tiến giữ các dòng chung ra ngoài vùng xung đột.</p>
<div class="callout ok">Dòng sau <code>|||||||</code> gọi tên bản gốc: khi merge, Git in mã băm ngắn của điểm gốc hợp nhất (ở đây <code>7b3e9d1</code>, commit A của bài 3.2); khi rebase, nó in <code>parent of &lt;mã&gt; (&lt;lời nhắn&gt;)</code>. Dù kiểu nào, các dòng bên dưới nó là văn bản <em>trước khi</em> hai bên đụng vào.</div>

<h3>Bốn bước giải quyết</h3>
${slide('git-03', 10, 'Bốn bước giải xung đột')}
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Bật hiển thị bản gốc một lần là xong: <code>git config --global merge.conflictStyle zdiff3</code>.</li><li>Tự tay tạo một xung đột. Trong <code>thu-git</code>, đứng ở <code>main</code>: tạo <code>config.txt</code> chứa <code>ttl=30</code> rồi commit. <code>git switch -c feature/ttl</code>, sửa thành <code>ttl=15</code>, commit. <code>git switch main</code>, sửa thành <code>ttl=60</code>, commit.</li><li><code>git merge feature/ttl</code>. Chạy <code>git status -s</code> (phải thấy <code>UU config.txt</code>) và <code>cat config.txt</code>. Chỉ ra ba phiên bản: của bạn, bản gốc, của họ.</li><li>Quyết định — giả sử nhóm chốt 15 — và ghi <code>ttl=15</code>. Chạy <code>git diff --check</code> (phải không in gì), rồi <code>git add config.txt</code> và <code>git commit --no-edit</code>.</li><li>Tạo lại đúng xung đột đó trên một cặp nhánh mới, lần này thoát ra bằng <code>git merge --abort</code>; kiểm rằng <code>git status</code> sạch.</li></ol>
<pre><code class="language-bash">cat config.txt
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
ttl=60
||||||| 0069feb          <span class="tok-comment"># mã băm ngắn của merge base: commit ghi ttl=30</span>
ttl=30
=======
ttl=15
&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/ttl
git diff --check         <span class="tok-comment"># chạy TRƯỚC khi sửa file:</span>
config.txt:1: leftover conflict marker
config.txt:3: leftover conflict marker
config.txt:5: leftover conflict marker
config.txt:7: leftover conflict marker</code></pre>
<p><strong>Đạt khi:</strong> <code>git log --oneline --graph -4</code> hiện một commit hợp nhất nối <code>feature/ttl</code> vào, và <code>git grep -n "&lt;&lt;&lt;&lt;&lt;&lt;&lt;"</code> không in gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Merge conflict</span><span class="v">Xung đột hợp nhất — hai bên cùng sửa những dòng giống nhau; Git tạm dừng việc hợp nhất và hỏi bạn.</span></div>
  <div class="kv"><span class="k">Conflict markers</span><span class="v">Ký hiệu xung đột — <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> · <code>|||||||</code> · <code>=======</code> · <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code>, rào từng phiên bản. Phải xoá HẾT.</span></div>
  <div class="kv"><span class="k">Ours / theirs</span><span class="v">Phía mình / phía họ — khi merge: ours là nhánh bạn đang đứng (HEAD), theirs là nhánh được nhập vào.</span></div>
  <div class="kv"><span class="k">zdiff3</span><span class="v">Kiểu hiển thị xung đột có thêm bản gốc, để thấy mỗi bên đã đổi gì so với ban đầu.</span></div>
  <div class="kv"><span class="k">Unmerged path (UU)</span><span class="v">Đường dẫn chưa hợp nhất — cách <code>git status -s</code> báo file còn xung đột; <code>git add</code> đánh dấu đã giải.</span></div>
  <div class="kv"><span class="k">git merge --abort</span><span class="v">Huỷ lần merge đang tạm dừng, trả mọi thứ về như trước lúc merge.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Xung đột nghĩa là hai bên sửa cùng những dòng; việc hợp nhất tạm dừng và không có gì bị mất.</li><li>Nửa trên (<code>HEAD</code>) là nhánh bạn đang đứng, nửa dưới là nhánh được nhập vào; zdiff3 chèn bản gốc vào giữa.</li><li>Giải xung đột = sửa file, xoá mọi ký hiệu, <code>git add</code>, <code>git commit</code> — rồi chạy test.</li><li><code>git diff --check</code> bắt ký hiệu còn sót trước khi chúng lọt vào lịch sử.</li><li><code>git merge --abort</code> luôn dùng được cho tới khi bạn commit.</li></ul>

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
${slide('git-03', 11, 'Rebase sao chép commit, mã băm mới')}
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
${slide('git-03', 12, 'Merge vs rebase và luật vàng')}
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
<div class="pitfall co-tieu-de"><strong>How this goes wrong in a student team project.</strong> <b>Rebasing <code>develop</code> "to make it tidy".</b> Four teammates already pulled it; after your force-push each of them gets duplicated commits on the next pull. Tidy your own <code>feature/*</code> branch instead, before opening the PR. <b>Rebasing a branch you share with one teammate.</b> Agree first, or merge. <b>Using <code>--force</code> instead of <code>--force-with-lease</code>.</b> Plain force silently deletes whatever your teammate pushed in the last five minutes.</div>

<h3>Choosing</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Merge — when</span><span class="v">The branch is shared · you want a permanent record of when a feature landed · a long-lived branch where the true history is worth keeping.</span></div>
  <div class="kv"><span class="k">Merge — cost</span><span class="v">A busy graph. On an active repository, <code>--graph</code> becomes a tangle of parallel lines that nobody reads.</span></div>
  <div class="kv"><span class="k">Rebase — when</span><span class="v">A private branch, before opening a pull request · updating your branch with main's latest · cleaning up "wip" commits before review (3.5).</span></div>
  <div class="kv"><span class="k">Rebase — cost</span><span class="v">Rewrites history, so it is unsafe on shared branches. Conflicts may reappear <em>once per commit</em> instead of once in total.</span></div>
</div>
<p>Most teams land on: <strong>rebase to update your own branch, merge to integrate it.</strong> You rebase while working so your branch stays a clean line on top of the latest main, then the pull request is merged so the fact that it was a feature stays visible.</p>

<h3>Conflicts during a rebase</h3>
${slide('git-03', 13, 'Xung đột khi rebase: nhãn bị đảo')}
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In <code>thu-git</code>: <code>git switch -c feature/rebase</code> from <code>main</code>, make two commits on <code>profile.txt</code>. Switch to <code>main</code> and commit <code>footer.txt</code> — a teammate's work landing on main.</li><li><code>git switch feature/rebase</code> and write down the output of <code>git log --oneline main..feature/rebase</code>.</li><li><code>git rebase main</code>, then run the same log again. Compare hashes and messages line by line.</li><li><code>git log --oneline --graph -4</code>: your commits should now sit directly on top of "thêm footer". Then <code>git reflog -5</code>: find your old tip in the "checkout: moving" line.</li></ol>
<pre><code class="language-bash">git log --oneline main..feature/rebase     <span class="tok-comment"># before</span>
c17550f feat: thêm ảnh hồ sơ
e42043b feat: thêm hồ sơ
git rebase main
Successfully rebased and updated refs/heads/feature/rebase.
git log --oneline main..feature/rebase     <span class="tok-comment"># after: same messages, new hashes</span>
2c99f35 feat: thêm ảnh hồ sơ
6dc01e7 feat: thêm hồ sơ
git reflog -5
2c99f35 HEAD@{0}: rebase (finish): returning to refs/heads/feature/rebase
2c99f35 HEAD@{1}: rebase (pick): feat: thêm ảnh hồ sơ
6dc01e7 HEAD@{2}: rebase (pick): feat: thêm hồ sơ
30e46a5 HEAD@{3}: rebase (start): checkout main
c17550f HEAD@{4}: checkout: moving from main to feature/rebase</code></pre>
<p><strong>Done when:</strong> both hashes changed while the messages stayed identical, <code>git log --graph</code> shows a straight line, and you found the old tip <code>c17550f</code> (yours will differ) in the reflog.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rebase</span><span class="v">Take your commits and replay them on top of another base; the branch then points at the copies.</span></div>
  <div class="kv"><span class="k">Replay</span><span class="v">Apply one commit's change again somewhere else — which produces a new commit with a new hash.</span></div>
  <div class="kv"><span class="k">Golden rule</span><span class="v">Never rebase commits that other people already have.</span></div>
  <div class="kv"><span class="k">--force-with-lease</span><span class="v">The safe force-push after rebasing your own pushed branch: refuses if someone else pushed meanwhile (Chapter 8).</span></div>
  <div class="kv"><span class="k">git pull --rebase</span><span class="v">Fetch, then rebase your unpushed commits on top instead of creating a merge commit.</span></div>
  <div class="kv"><span class="k">--onto</span><span class="v">Rebase only a chosen range of commits onto a different base.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Rebase copies your commits onto a new base; every copy gets a new hash, the originals stay only in the reflog.</li><li>Merge preserves the real parallel history; rebase produces a straight line.</li><li>Golden rule: rebase only commits nobody else has — your own feature branch, never <code>main</code> or <code>develop</code>.</li><li>In a rebase conflict, <code>HEAD</code> is the branch you are rebasing onto and your commit is the bottom half; finish with <code>git rebase --continue</code>.</li><li><code>pull.rebase true</code> is safe for everyday use because it only moves your own unpushed commits.</li></ul>

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
${slide('git-03', 11, 'Rebase sao chép commit, mã băm mới')}
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
${slide('git-03', 12, 'Merge vs rebase và luật vàng')}
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
<div class="pitfall co-tieu-de"><strong>Chuyện này hỏng thế nào trong đồ án nhóm.</strong> <b>Rebase <code>develop</code> "cho gọn".</b> Bốn bạn cùng nhóm đã kéo nó về; sau khi bạn force-push, ai pull lần tới cũng bị nhân đôi commit. Hãy dọn nhánh <code>feature/*</code> của riêng bạn, trước khi mở PR. <b>Rebase một nhánh đang làm chung với một bạn.</b> Thống nhất trước, hoặc dùng merge. <b>Dùng <code>--force</code> thay vì <code>--force-with-lease</code>.</b> Force trần âm thầm xoá mất thứ bạn cùng nhóm vừa push năm phút trước.</div>

<h3>Chọn cái nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Merge — khi nào</span><span class="v">Nhánh đã chia sẻ · bạn muốn một dấu vết vĩnh viễn về lúc một tính năng đáp xuống · một nhánh sống lâu mà lịch sử thật đáng giữ lại.</span></div>
  <div class="kv"><span class="k">Merge — cái giá</span><span class="v">Đồ thị rậm rạp. Trên một kho mã sôi động, <code>--graph</code> thành một mớ đường song song không ai đọc.</span></div>
  <div class="kv"><span class="k">Rebase — khi nào</span><span class="v">Nhánh riêng tư, trước khi mở pull request · cập nhật nhánh của bạn với main mới nhất · dọn các commit "wip" trước khi review (bài 3.5).</span></div>
  <div class="kv"><span class="k">Rebase — cái giá</span><span class="v">Viết lại lịch sử, nên không an toàn trên nhánh chung. Xung đột có thể hiện lại <em>một lần cho mỗi commit</em> thay vì một lần tổng cộng.</span></div>
</div>
<p>Đa số nhóm dừng lại ở: <strong>rebase để cập nhật nhánh của mình, merge để tích hợp nó.</strong> Bạn rebase trong lúc làm việc để nhánh luôn là một đường sạch nằm trên main mới nhất, rồi pull request được merge để cái sự thật "đây là một tính năng" vẫn nhìn thấy được.</p>

<h3>Xung đột trong lúc rebase</h3>
${slide('git-03', 13, 'Xung đột khi rebase: nhãn bị đảo')}
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong <code>thu-git</code>: <code>git switch -c feature/rebase</code> từ <code>main</code>, tạo hai commit trên <code>profile.txt</code>. Chuyển về <code>main</code> và commit <code>footer.txt</code> — việc của một bạn cùng nhóm vừa vào main.</li><li><code>git switch feature/rebase</code> và chép lại kết quả của <code>git log --oneline main..feature/rebase</code>.</li><li><code>git rebase main</code>, rồi chạy lại đúng lệnh log đó. So mã băm và lời nhắn từng dòng.</li><li><code>git log --oneline --graph -4</code>: các commit của bạn giờ phải nằm ngay trên "thêm footer". Rồi <code>git reflog -5</code>: tìm đầu nhánh cũ trong dòng "checkout: moving".</li></ol>
<pre><code class="language-bash">git log --oneline main..feature/rebase     <span class="tok-comment"># trước</span>
c17550f feat: thêm ảnh hồ sơ
e42043b feat: thêm hồ sơ
git rebase main
Successfully rebased and updated refs/heads/feature/rebase.
git log --oneline main..feature/rebase     <span class="tok-comment"># sau: cùng lời nhắn, mã băm mới</span>
2c99f35 feat: thêm ảnh hồ sơ
6dc01e7 feat: thêm hồ sơ
git reflog -5
2c99f35 HEAD@{0}: rebase (finish): returning to refs/heads/feature/rebase
2c99f35 HEAD@{1}: rebase (pick): feat: thêm ảnh hồ sơ
6dc01e7 HEAD@{2}: rebase (pick): feat: thêm hồ sơ
30e46a5 HEAD@{3}: rebase (start): checkout main
c17550f HEAD@{4}: checkout: moving from main to feature/rebase</code></pre>
<p><strong>Đạt khi:</strong> cả hai mã băm đã đổi trong khi lời nhắn giữ nguyên, <code>git log --graph</code> là một đường thẳng, và bạn tìm thấy đầu nhánh cũ <code>c17550f</code> (máy bạn sẽ ra mã khác) trong reflog.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rebase</span><span class="v">Đặt lại gốc — lấy các commit của bạn phát lại lên trên một gốc khác; nhánh sau đó trỏ vào các bản sao.</span></div>
  <div class="kv"><span class="k">Replay</span><span class="v">Phát lại — áp lại thay đổi của một commit ở chỗ khác, sinh ra commit mới với mã băm mới.</span></div>
  <div class="kv"><span class="k">Golden rule</span><span class="v">Luật vàng — không bao giờ rebase những commit mà người khác đã có.</span></div>
  <div class="kv"><span class="k">--force-with-lease</span><span class="v">Force-push an toàn sau khi rebase nhánh riêng đã push: từ chối nếu có người khác vừa push lên (Chương 8).</span></div>
  <div class="kv"><span class="k">git pull --rebase</span><span class="v">Kéo về rồi phát lại các commit chưa push của bạn lên trên, thay vì tạo commit hợp nhất.</span></div>
  <div class="kv"><span class="k">--onto</span><span class="v">Rebase chỉ một đoạn commit được chọn lên một gốc khác.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Rebase sao chép commit của bạn lên gốc mới; mỗi bản sao có mã băm mới, bản gốc chỉ còn trong reflog.</li><li>Merge giữ lịch sử song song thật; rebase cho ra một đường thẳng.</li><li>Luật vàng: chỉ rebase commit chưa ai khác có — nhánh tính năng của riêng bạn, không bao giờ là <code>main</code> hay <code>develop</code>.</li><li>Khi xung đột lúc rebase, <code>HEAD</code> là nhánh bạn rebase LÊN, commit của bạn là nửa dưới; xong thì <code>git rebase --continue</code>.</li><li><code>pull.rebase true</code> an toàn cho việc hằng ngày vì nó chỉ dời những commit chưa push của chính bạn.</li></ul>

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
<div class="callout ok">Recent Git (2.51 on the author’s Mac) prints each line as <code>pick 9e2d4b7 # feat(auth): add refresh…</code> — with a <code>#</code> before the message. It is harmless: Git reads only the command and the hash; the message is there for you. The worked lists in this lesson keep the older form without <code>#</code>; the 🧪 practice at the end shows the real 2.51 output. Both forms work.</div>

<h3>The seven commands</h3>
${slide('git-03', 14, 'Danh sách việc của rebase -i')}
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
${slide('git-03', 15, '5 commit lộn xộn thành 2 commit')}
<pre><code>pick   9e2d4b7 feat(auth): add refresh token rotation
fixup  1a2b3c4 wip
fixup  5f7a9c2 fix typo
fixup  d4e8f0a actually fix it
reword b2c6a91 add tests</code></pre>
<p>Save and close. Git replays: the first commit is kept, the next three are folded into it and their messages discarded, and the test commit stays separate — marked <code>reword</code>, so Git stops once and lets you rename "add tests" to <code>test(auth): cover the expired-token path</code>.</p>
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
${slide('git-03', 16, 'Cứu một lần rebase hỏng bằng reflog')}
<pre><code>git rebase --abort             <span class="tok-comment"># mid-rebase: back to exactly before you started</span>
git rebase --continue          <span class="tok-comment"># after resolving a conflict or an edit stop</span>
git rebase --skip              <span class="tok-comment"># drop the commit currently being applied</span></code></pre>
<p>And after the rebase has finished but the result is wrong — the case that feels unrecoverable and is not:</p>
<pre><code>git reflog</code></pre>
<div class="out">c7f1a30 HEAD@{0}: rebase (finish): returning to refs/heads/feature/login
c7f1a30 HEAD@{1}: rebase (reword): test(auth): cover the expired-token path
e8b4d92 HEAD@{3}: rebase (fixup): feat(auth): add refresh token rotation
9e2d4b7 HEAD@{6}: rebase (start): checkout main
b2c6a91 HEAD@{7}: commit: add tests</div>
<pre><code>git reset --hard HEAD@{7}      <span class="tok-comment"># back to the pre-rebase state, everything restored</span></code></pre>
<div class="callout ok"><code>HEAD@{7}</code> is where the branch pointed just before <code>rebase (start)</code> — the line directly <em>below</em> it, which is your old tip "add tests". The original commits were never deleted — the branch simply stopped pointing at them. Chapter 4.4 makes this a reflex; for now, know that a bad rebase costs you one command, not your work.</div>

<h3>The rule that keeps this safe</h3>
<div class="callout danger">Interactive rebase rewrites history, so the golden rule from 3.4 applies in full: only on commits nobody else has. On your own feature branch, before review, it is one of the most valuable tools in Git. On <code>main</code>, it is how you break everyone's clone at once.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In <code>thu-git</code>, from <code>main</code>: <code>git switch -c feature/profile</code>. Make four commits in this order: create <code>profile.html</code> "feat(profile): thêm trang hồ sơ" · create <code>avatar.js</code> "wip avatar" · edit <code>profile.html</code> "sửa typo" · edit <code>avatar.js</code> "xong avatar".</li><li><code>git rebase -i main</code>. Move the "sửa typo" line up under the first line and change the words so the list reads: <code>pick</code> / <code>fixup</code> (sửa typo) / <code>pick</code> (wip avatar) / <code>squash</code> (xong avatar).</li><li>Save and close. Because of <code>squash</code>, Git opens a second editor showing both messages "wip avatar" and "xong avatar": delete them and write <code>feat(profile): thêm ảnh đại diện</code>.</li><li>Check with <code>git log --oneline main..HEAD</code> (two lines) and <code>git log --stat --format=%s main..HEAD</code> (each commit touches one file).</li><li>Practise the rescue: <code>git reflog</code>, find the line directly under "rebase (start)", <code>git reset --hard HEAD@{n}</code> — the four commits are back. Redo step 2.</li></ol>
<pre><code class="language-bash"><span class="tok-comment"># the to-do list after your edit (hashes are yours)</span>
pick 8c84ed7 # feat(profile): thêm trang hồ sơ
fixup 850dd09 # sửa typo
pick 7ec195f # wip avatar
squash 0f620da # xong avatar
git log --oneline main..HEAD
319e9e8 feat(profile): thêm ảnh đại diện
0240c28 feat(profile): thêm trang hồ sơ
git reflog -6
319e9e8 HEAD@{0}: rebase (finish): returning to refs/heads/feature/profile
319e9e8 HEAD@{1}: rebase (squash): feat(profile): thêm ảnh đại diện
8b8ee76 HEAD@{2}: rebase (pick): wip avatar
0240c28 HEAD@{3}: rebase (fixup): feat(profile): thêm trang hồ sơ
8c84ed7 HEAD@{4}: rebase (start): checkout main
0f620da HEAD@{5}: commit: xong avatar       <span class="tok-comment"># ← old tip: git reset --hard HEAD@{5}</span></code></pre>
<p>Lost in vim? Set an editor you know first: <code>git config --global core.editor "code --wait"</code> (VS Code, same on macOS, Linux and Windows).</p>
<p><strong>Done when:</strong> <code>main..feature/profile</code> is exactly two commits, each changing one file, both with meaningful messages — and you have undone and redone the rebase once.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Interactive rebase</span><span class="v"><code>git rebase -i</code>: a rebase where you edit the list of steps before Git runs it.</span></div>
  <div class="kv"><span class="k">Todo list</span><span class="v">That list of steps — oldest commit on top, one command per line.</span></div>
  <div class="kv"><span class="k">squash</span><span class="v">Fold this commit into the line above and let you write a combined message.</span></div>
  <div class="kv"><span class="k">fixup</span><span class="v">Fold into the line above and throw this commit's message away.</span></div>
  <div class="kv"><span class="k">reword</span><span class="v">Keep the change, stop to edit the message.</span></div>
  <div class="kv"><span class="k">--autosquash</span><span class="v">Moves commits made with <code>git commit --fixup &lt;hash&gt;</code> under their target and marks them <code>fixup</code> for you.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>git rebase -i</code> opens a script with the oldest commit on top; nothing happens until you save and close.</li><li><code>fixup</code> folds into the line above and drops the message; <code>squash</code> folds and asks for a combined message.</li><li>Moving lines reorders commits — that is how you group work done hours apart.</li><li><code>--fixup</code> while working plus <code>--autosquash</code> before the PR means you rarely edit the list by hand.</li><li>A bad result costs one command: <code>git reflog</code> → the line under "rebase (start)" → <code>git reset --hard</code>.</li></ul>

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
<div class="callout ok">Git bản mới (máy tác giả là 2.51) in mỗi dòng dạng <code>pick 9e2d4b7 # feat(auth): add refresh…</code> — có thêm dấu <code>#</code> trước lời nhắn. Không sao cả: Git chỉ đọc lệnh và mã băm; lời nhắn là để bạn đọc. Các danh sách minh hoạ trong bài giữ kiểu cũ không có <code>#</code>; phần 🧪 thực hành cuối bài in đúng output thật của 2.51. Viết kiểu nào cũng chạy.</div>

<h3>Bảy lệnh</h3>
${slide('git-03', 14, 'Danh sách việc của rebase -i')}
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
${slide('git-03', 15, '5 commit lộn xộn thành 2 commit')}
<pre><code>pick   9e2d4b7 feat(auth): add refresh token rotation
fixup  1a2b3c4 wip
fixup  5f7a9c2 fix typo
fixup  d4e8f0a actually fix it
reword b2c6a91 add tests</code></pre>
<p>Lưu và đóng. Git phát lại: commit đầu được giữ, ba cái tiếp theo bị gấp vào trong nó và lời nhắn của chúng bị vứt đi, còn commit test thì đứng riêng — nó được đánh dấu <code>reword</code> nên Git dừng một lần cho bạn đổi "add tests" thành <code>test(auth): cover the expired-token path</code>.</p>
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
${slide('git-03', 16, 'Cứu một lần rebase hỏng bằng reflog')}
<pre><code>git rebase --abort             <span class="tok-comment"># đang giữa chừng: về đúng trước lúc bạn bắt đầu</span>
git rebase --continue          <span class="tok-comment"># sau khi giải xung đột hoặc sau một lần dừng edit</span>
git rebase --skip              <span class="tok-comment"># bỏ commit đang được áp</span></code></pre>
<p>Và khi rebase đã xong nhưng kết quả sai — trường hợp có cảm giác không cứu được mà thật ra thì được:</p>
<pre><code>git reflog</code></pre>
<div class="out">c7f1a30 HEAD@{0}: rebase (finish): returning to refs/heads/feature/login
c7f1a30 HEAD@{1}: rebase (reword): test(auth): cover the expired-token path
e8b4d92 HEAD@{3}: rebase (fixup): feat(auth): add refresh token rotation
9e2d4b7 HEAD@{6}: rebase (start): checkout main
b2c6a91 HEAD@{7}: commit: add tests</div>
<pre><code>git reset --hard HEAD@{7}      <span class="tok-comment"># về trạng thái trước rebase, mọi thứ trở lại</span></code></pre>
<div class="callout ok"><code>HEAD@{7}</code> là chỗ nhánh trỏ tới ngay trước dòng <code>rebase (start)</code> — tức dòng nằm ngay <em>DƯỚI</em> nó, chính là đầu nhánh cũ "add tests". Các commit gốc chưa bao giờ bị xoá — chỉ là cái nhánh thôi trỏ vào chúng. Bài 4.4 biến việc này thành phản xạ; còn giờ, hãy biết rằng một lần rebase hỏng tốn của bạn một lệnh, không phải công việc của bạn.</div>

<h3>Luật giữ cho việc này an toàn</h3>
<div class="callout danger">Rebase tương tác VIẾT LẠI lịch sử, nên luật vàng ở bài 3.4 áp dụng đầy đủ: chỉ làm trên những commit chưa ai khác có. Trên nhánh tính năng của chính bạn, trước khi review, nó là một trong những công cụ giá trị nhất của Git. Trên <code>main</code>, nó là cách bạn làm hỏng bản clone của tất cả mọi người cùng một lúc.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong <code>thu-git</code>, từ <code>main</code>: <code>git switch -c feature/profile</code>. Tạo bốn commit theo đúng thứ tự: tạo <code>profile.html</code> "feat(profile): thêm trang hồ sơ" · tạo <code>avatar.js</code> "wip avatar" · sửa <code>profile.html</code> "sửa typo" · sửa <code>avatar.js</code> "xong avatar".</li><li><code>git rebase -i main</code>. Dời dòng "sửa typo" lên ngay dưới dòng đầu và đổi chữ đầu dòng để danh sách thành: <code>pick</code> / <code>fixup</code> (sửa typo) / <code>pick</code> (wip avatar) / <code>squash</code> (xong avatar).</li><li>Lưu và đóng. Vì có <code>squash</code>, Git mở trình soạn thảo lần hai với cả hai lời nhắn "wip avatar" và "xong avatar": xoá chúng đi và viết <code>feat(profile): thêm ảnh đại diện</code>.</li><li>Kiểm bằng <code>git log --oneline main..HEAD</code> (hai dòng) và <code>git log --stat --format=%s main..HEAD</code> (mỗi commit chỉ đụng một file).</li><li>Tập cứu hộ: <code>git reflog</code>, tìm dòng nằm ngay dưới "rebase (start)", <code>git reset --hard HEAD@{n}</code> — bốn commit trở lại. Làm lại bước 2.</li></ol>
<pre><code class="language-bash"><span class="tok-comment"># danh sách việc sau khi bạn sửa (mã băm là của máy bạn)</span>
pick 8c84ed7 # feat(profile): thêm trang hồ sơ
fixup 850dd09 # sửa typo
pick 7ec195f # wip avatar
squash 0f620da # xong avatar
git log --oneline main..HEAD
319e9e8 feat(profile): thêm ảnh đại diện
0240c28 feat(profile): thêm trang hồ sơ
git reflog -6
319e9e8 HEAD@{0}: rebase (finish): returning to refs/heads/feature/profile
319e9e8 HEAD@{1}: rebase (squash): feat(profile): thêm ảnh đại diện
8b8ee76 HEAD@{2}: rebase (pick): wip avatar
0240c28 HEAD@{3}: rebase (fixup): feat(profile): thêm trang hồ sơ
8c84ed7 HEAD@{4}: rebase (start): checkout main
0f620da HEAD@{5}: commit: xong avatar       <span class="tok-comment"># ← đầu nhánh cũ: git reset --hard HEAD@{5}</span></code></pre>
<p>Kẹt trong vim? Đặt trước một trình soạn thảo bạn quen: <code>git config --global core.editor "code --wait"</code> (VS Code, giống nhau trên macOS, Linux và Windows).</p>
<p><strong>Đạt khi:</strong> <code>main..feature/profile</code> đúng hai commit, mỗi commit đổi một file, cả hai có lời nhắn có nghĩa — và bạn đã huỷ rồi làm lại lần rebase một lần.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Interactive rebase</span><span class="v">Rebase tương tác — <code>git rebase -i</code>: bạn sửa danh sách các bước trước khi Git chạy.</span></div>
  <div class="kv"><span class="k">Todo list</span><span class="v">Danh sách việc — danh sách các bước đó, commit CŨ NHẤT ở trên cùng, mỗi dòng một lệnh.</span></div>
  <div class="kv"><span class="k">squash</span><span class="v">Gộp (giữ lời nhắn) — nhập commit này vào dòng phía trên và cho bạn viết một lời nhắn gộp.</span></div>
  <div class="kv"><span class="k">fixup</span><span class="v">Gộp (bỏ lời nhắn) — nhập vào dòng phía trên và vứt lời nhắn của commit này đi.</span></div>
  <div class="kv"><span class="k">reword</span><span class="v">Đổi lời — giữ thay đổi, dừng lại để sửa lời nhắn.</span></div>
  <div class="kv"><span class="k">--autosquash</span><span class="v">Tự gộp — tự dời các commit tạo bằng <code>git commit --fixup &lt;mã&gt;</code> xuống dưới commit đích và đánh dấu <code>fixup</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>git rebase -i</code> mở một kịch bản, commit cũ nhất ở trên cùng; chưa có gì xảy ra cho tới khi bạn lưu và đóng.</li><li><code>fixup</code> gộp vào dòng trên và bỏ lời nhắn; <code>squash</code> gộp và hỏi bạn lời nhắn chung.</li><li>Dời dòng là đổi thứ tự commit — cách gom những việc làm cách nhau vài giờ.</li><li><code>--fixup</code> trong lúc làm cộng <code>--autosquash</code> trước khi mở PR thì hiếm khi phải sửa danh sách bằng tay.</li><li>Kết quả sai chỉ tốn một lệnh: <code>git reflog</code> → dòng dưới "rebase (start)" → <code>git reset --hard</code>.</li></ul>

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
      description: 'Mười tình huống về nhánh là con trỏ, HEAD lìa cành, fast-forward vs ba chiều, đọc và giải xung đột (kể cả nhãn đảo khi rebase), luật vàng của rebase, rebase tương tác và cứu bằng reflog.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from real team work — each one is decided by the shape of the commit graph. Read the explanation after submitting, especially for the ones you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can show that a branch is a 41-byte file and say which branch a new commit moves.</li>
<li>I can predict whether <code>git merge</code> will fast-forward or create a commit with two parents.</li>
<li>I can read a zdiff3 conflict (ours, base, theirs) and finish a merge with <code>git add</code> + <code>git commit</code>, or leave with <code>--abort</code>.</li>
<li>I know why rebase changes hashes and which branches I must never rebase.</li>
<li>I can squash messy commits with <code>git rebase -i</code> and undo a bad rebase with <code>git reflog</code>.</li>
</ul>
${slide('git-03', 17, 'Bảng tra nhanh Chương 3')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ việc nhóm thật — câu nào cũng được quyết định bởi hình dạng đồ thị commit. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chứng minh được một nhánh là file 41 byte và nói được commit mới dời nhánh nào.</li>
<li>Tôi đoán trước được <code>git merge</code> sẽ tua thẳng hay tạo commit hai cha.</li>
<li>Tôi đọc được một xung đột zdiff3 (ours, bản gốc, theirs) và kết thúc merge bằng <code>git add</code> + <code>git commit</code>, hoặc thoát bằng <code>--abort</code>.</li>
<li>Tôi biết vì sao rebase đổi mã băm và những nhánh nào tuyệt đối không được rebase.</li>
<li>Tôi gộp được commit lộn xộn bằng <code>git rebase -i</code> và huỷ một lần rebase hỏng bằng <code>git reflog</code>.</li>
</ul>
${slide('git-03', 17, 'Bảng tra nhanh Chương 3')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Your SWP391 repo has 2 GB of history. You run git branch feature/cart. What does Git actually write to disk?|||Kho SWP391 của bạn có 2 GB lịch sử. Bạn chạy git branch feature/cart. Git thật sự ghi gì xuống đĩa?',
            options: [
              'A copy of the working directory under .git/branches/feature/cart|||Một bản sao thư mục làm việc dưới .git/branches/feature/cart',
              'A compressed snapshot of every commit reachable from main|||Một ảnh chụp nén của mọi commit tới được từ main',
              'One 41-byte file .git/refs/heads/feature/cart holding the current commit hash|||Một file 41 byte .git/refs/heads/feature/cart chứa mã băm commit hiện tại',
              'A new entry for the branch inside .git/index|||Một bản ghi mới cho nhánh bên trong .git/index',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: A branch is just a ref file: 40 hex characters plus a newline. That is why creating one is instant whatever the repo size. The "copy of the working directory" option describes old systems like SVN, which is exactly the intuition this chapter replaces; .git/index is the staging area, not a branch list.|||VI: Nhánh chỉ là một file ref: 40 ký tự hex cộng một dấu xuống dòng. Vì thế tạo nhánh tức thì dù kho lớn cỡ nào. Phương án “bản sao thư mục làm việc” mô tả các hệ cũ như SVN — đúng cái trực giác chương này thay thế; còn .git/index là vùng staging, không phải danh sách nhánh.',
          },
          {
            question: 'You checked out an old commit to test a bug, made two fix commits there, then ran git switch main. Git warned "you are leaving 2 commits behind". What is true?|||Bạn checkout một commit cũ để thử lỗi, tạo hai commit sửa ở đó, rồi chạy git switch main. Git cảnh báo "you are leaving 2 commits behind". Điều nào đúng?',
            options: [
              'The commits still exist; git branch rescue <hash from the warning> (or a hash found in git reflog) gives them a home|||Các commit vẫn còn; git branch rescue <mã trong lời cảnh báo> (hoặc mã tìm trong git reflog) cho chúng một mái nhà',
              'They were deleted the moment you switched, because no branch pointed at them|||Chúng bị xoá ngay lúc bạn chuyển nhánh, vì không nhánh nào trỏ tới',
              'Git merged them into main automatically when you switched|||Git tự hợp nhất chúng vào main khi bạn chuyển nhánh',
              'git switch - re-attaches them to main as if they had been made there|||git switch - gắn chúng lại vào main như thể chúng được tạo ở đó',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Unreferenced commits are not deleted immediately — the reflog keeps them for weeks, and the warning even prints the hash. Creating a branch at that hash makes them safe. "Deleted the moment you switched" sounds logical but is false; git switch - does not attach anything to main — it even refuses, because the previous position was a commit, not a branch.|||VI: Commit không ai trỏ tới không bị xoá ngay — reflog giữ chúng hàng tuần, và lời cảnh báo còn in sẵn mã băm. Tạo một nhánh tại mã đó là chúng an toàn. “Bị xoá ngay lúc chuyển” nghe hợp lý nhưng sai; git switch - không gắn gì vào main cả — nó còn từ chối chạy, vì chỗ đứng trước đó là một commit chứ không phải một nhánh.',
          },
          {
            question: 'main points at A. You made B and C on feature/login on top of A, and nobody touched main. On main you run git merge feature/login. What happens?|||main trỏ vào A. Bạn tạo B và C trên feature/login, ngay trên A, và không ai đụng vào main. Đứng ở main, bạn chạy git merge feature/login. Chuyện gì xảy ra?',
            options: [
              'Git creates a merge commit with parents A and C|||Git tạo một commit hợp nhất có hai cha A và C',
              'Git reports a conflict because both branches contain A|||Git báo xung đột vì cả hai nhánh đều chứa A',
              'Git refuses: branches must diverge before they can be merged|||Git từ chối: hai nhánh phải rẽ ra rồi mới hợp nhất được',
              'Git prints "Fast-forward" and simply moves main to C; no new commit is created|||Git in "Fast-forward" và chỉ dời main tới C; không tạo commit mới nào',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: main is an ancestor of feature/login, so there is nothing to combine — Git slides the pointer. A merge commit only appears when both sides moved, or when you pass --no-ff. Sharing ancestor A is normal for every pair of branches and never causes a conflict by itself.|||VI: main là tổ tiên của feature/login nên chẳng có gì để ghép — Git trượt con trỏ. Commit hợp nhất chỉ xuất hiện khi cả hai bên đã tiến, hoặc khi bạn thêm --no-ff. Có chung tổ tiên A là chuyện của mọi cặp nhánh và tự nó không bao giờ gây xung đột.',
          },
          {
            question: 'Your team wants main to read as one line per finished feature, AND wants to keep the individual commits of each feature for later debugging. Which habit fits?|||Nhóm muốn main đọc lên mỗi tính năng một dòng, VÀ vẫn giữ các commit lẻ của từng tính năng để gỡ lỗi về sau. Thói quen nào hợp?',
            options: [
              'Merge with git merge --ff-only so history stays linear|||Hợp nhất bằng git merge --ff-only cho lịch sử thẳng',
              'Merge with git merge --no-ff, and read main with git log --first-parent --oneline|||Hợp nhất bằng git merge --no-ff, và đọc main bằng git log --first-parent --oneline',
              'Merge with git merge --squash so each feature becomes one commit|||Hợp nhất bằng git merge --squash để mỗi tính năng thành một commit',
              'Rebase every feature onto main and fast-forward it|||Rebase mọi tính năng lên main rồi tua thẳng',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: --no-ff leaves one merge commit per feature; --first-parent walks only those, giving one line per feature, while the feature commits stay reachable through ^2. --squash also gives one line per feature — the tempting answer — but it throws the individual commits away, which breaks the second requirement. --ff-only and rebase+fast-forward give a line with no feature boundaries.|||VI: --no-ff để lại mỗi tính năng một commit hợp nhất; --first-parent chỉ đi qua các commit đó nên mỗi tính năng một dòng, còn commit lẻ vẫn tới được qua ^2. --squash cũng cho mỗi tính năng một dòng — phương án hấp dẫn — nhưng nó vứt các commit lẻ, trái yêu cầu thứ hai. --ff-only và rebase + tua thẳng cho một đường thẳng không còn ranh giới tính năng.',
          },
          {
            question: 'With zdiff3 on, a conflict shows: HEAD side ttl=60, the ||||||| section ttl=30, the other side ttl=15. What does this tell you?|||Đã bật zdiff3, một xung đột hiện: phía HEAD ttl=60, phần ||||||| là ttl=30, phía bên kia ttl=15. Điều này cho bạn biết gì?',
            options: [
              'Each side added its own new line, so keeping both lines is correct|||Mỗi bên thêm một dòng mới của mình, nên giữ cả hai dòng là đúng',
              'The original was 30: one side raised it, the other lowered it — a real disagreement to settle with the team|||Bản gốc là 30: một bên nâng lên, bên kia hạ xuống — một bất đồng thật cần chốt với nhóm',
              'The ||||||| section is the newest version, so 30 should win|||Phần ||||||| là bản mới nhất, nên 30 phải thắng',
              'In a merge the bottom side is always the correct one|||Khi merge, nửa dưới luôn là bản đúng',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: The ||||||| section is the merge base — the text before either side touched it. Seeing 30 there proves both sides EDITED the same value in opposite directions. Without the base you might think each side just added a line and keep both, producing two ttl declarations. No side is "always correct"; the decision is about the code.|||VI: Phần ||||||| là điểm gốc hợp nhất — văn bản trước khi hai bên đụng vào. Thấy 30 ở đó chứng tỏ cả hai bên đều SỬA cùng một giá trị theo hai hướng ngược nhau. Không có bản gốc, bạn dễ tưởng mỗi bên chỉ thêm một dòng rồi giữ cả hai, thành hai khai báo ttl. Không bên nào “luôn đúng”; quyết định là chuyện của mã.',
          },
          {
            question: 'After resolving a merge, CI fails with a syntax error pointing at a line ">>>>>>> feature/ttl". Which command, run before committing, would have caught it?|||Sau khi giải một lần merge, CI hỏng với lỗi cú pháp chỉ vào dòng ">>>>>>> feature/ttl". Lệnh nào, chạy trước khi commit, đã bắt được lỗi này?',
            options: [
              'git status -s — it would still show UU for that file|||git status -s — nó vẫn sẽ hiện UU cho file đó',
              'git merge --abort — it validates the file before committing|||git merge --abort — nó kiểm file trước khi commit',
              'git log --oneline --graph — it highlights broken merges|||git log --oneline --graph — nó tô đậm những lần merge hỏng',
              'git diff --check — it reports every leftover conflict marker|||git diff --check — nó báo từng ký hiệu xung đột còn sót',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: git diff --check prints "leftover conflict marker" for each marker line. git status -s is the tempting answer, but once you git add the file it shows M, not UU — Git trusts you, it does not scan the content. --abort throws the merge away instead of checking it.|||VI: git diff --check in "leftover conflict marker" cho từng dòng ký hiệu. git status -s là phương án hấp dẫn, nhưng một khi đã git add thì nó hiện M chứ không còn UU — Git tin bạn, nó không quét nội dung. --abort thì vứt cả lần merge chứ không kiểm gì.',
          },
          {
            question: 'You run git rebase main on feature/login and hit a conflict. The block under <<<<<<< HEAD contains ttl=60. Whose version is that?|||Bạn chạy git rebase main trên feature/login và gặp xung đột. Khối dưới <<<<<<< HEAD chứa ttl=60. Đó là phiên bản của ai?',
            options: [
              'main’s — during a rebase HEAD is the branch you are rebasing onto; your commit is below =======|||Của main — khi rebase, HEAD là nhánh bạn đang rebase LÊN; commit của bạn nằm dưới =======',
              'Yours — HEAD always means the branch you started on, as in a merge|||Của bạn — HEAD luôn là nhánh bạn bắt đầu, giống khi merge',
              'The merge base — HEAD marks the original text during a rebase|||Của điểm gốc hợp nhất — khi rebase, HEAD đánh dấu văn bản gốc',
              'Whichever commit is newer by date|||Của commit nào mới hơn theo ngày',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Rebase first moves to main’s tip, then replays your commits one by one, so HEAD is main plus the commits already replayed, and the bottom half is labelled with your commit, e.g. ">>>>>>> afa2f38 (fix(auth): …)". Assuming it reads like a merge is the classic way to resolve a rebase conflict backwards.|||VI: Rebase đi tới đầu main trước, rồi phát lại từng commit của bạn, nên HEAD là main cộng những commit đã phát lại, còn nửa dưới mang tên commit của bạn, ví dụ ">>>>>>> afa2f38 (fix(auth): …)". Tưởng nó đọc giống merge là cách kinh điển để giải xung đột rebase ngược.',
          },
          {
            question: 'A teammate rebased the shared develop branch and force-pushed. Now everyone’s git pull produces duplicated commits and strange conflicts. Which rule was broken?|||Một bạn cùng nhóm rebase nhánh chung develop rồi force-push. Giờ ai git pull cũng bị nhân đôi commit và xung đột khó hiểu. Luật nào đã bị vi phạm?',
            options: [
              'Always use git pull --rebase instead of plain git pull|||Luôn dùng git pull --rebase thay cho git pull thường',
              'Always pass --onto when rebasing a long branch|||Luôn thêm --onto khi rebase một nhánh dài',
              'Never rebase commits other people already have — integrate shared branches with merge|||Không bao giờ rebase commit mà người khác đã có — nhánh chung thì tích hợp bằng merge',
              'Enable rerere before any rebase|||Bật rerere trước mọi lần rebase',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Rebase replaced develop’s commits with copies that have new hashes; everyone else still has the originals, so Git sees two unrelated sets of the same changes. pull --rebase is a fine habit for your own unpushed commits but did not cause this and cannot undo it. rerere only replays conflict resolutions.|||VI: Rebase thay các commit của develop bằng bản sao có mã băm mới; mọi người khác vẫn giữ bản gốc, nên Git thấy hai bộ thay đổi y hệt mà không liên quan. pull --rebase là thói quen tốt cho commit chưa push của riêng bạn, nhưng không gây ra chuyện này và cũng không gỡ được. rerere chỉ phát lại cách giải xung đột.',
          },
          {
            question: 'The rebase -i list shows: pick a1 feat(auth), pick b2 wip, pick c3 fix typo. You want ONE commit with only the feat(auth) message. Which edit?|||Danh sách rebase -i là: pick a1 feat(auth), pick b2 wip, pick c3 fix typo. Bạn muốn MỘT commit chỉ mang lời nhắn feat(auth). Sửa thế nào?',
            options: [
              'squash a1 / pick b2 / pick c3',
              'pick a1 / squash b2 / squash c3',
              'fixup a1 / fixup b2 / pick c3',
              'pick a1 / fixup b2 / fixup c3',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: squash and fixup fold a commit into the line ABOVE it, so the first line must stay pick, and fixup discards the "wip" and "fix typo" messages. pick/squash/squash also gives one commit, but opens an editor holding all three messages for you to clean up. squash or fixup on the first line fails: Git refuses to squash when there is no previous commit in the list.|||VI: squash và fixup gộp một commit vào dòng PHÍA TRÊN, nên dòng đầu phải giữ pick, và fixup vứt lời nhắn "wip", "fix typo". pick/squash/squash cũng ra một commit, nhưng mở trình soạn thảo chứa cả ba lời nhắn để bạn tự dọn. squash hay fixup ở dòng đầu thì Git báo lỗi: không có commit nào phía trên để gộp vào.',
          },
          {
            question: 'An interactive rebase finished, but you dropped the wrong commit. git reflog shows "HEAD@{5}: rebase (start): checkout main" and "HEAD@{6}: commit: add tests". What restores the branch as it was before the rebase?|||Một lần rebase tương tác đã xong nhưng bạn lỡ drop nhầm commit. git reflog có "HEAD@{5}: rebase (start): checkout main" và "HEAD@{6}: commit: add tests". Lệnh nào trả nhánh về đúng như trước khi rebase?',
            options: [
              'git reset --hard HEAD@{6}',
              'git rebase --abort',
              'git reset --hard HEAD@{5}',
              'Nothing — a finished rebase deletes the old commits|||Không gì cả — rebase xong là commit cũ bị xoá',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: The line just BELOW "rebase (start)" is where your branch pointed before the rebase began — here the "add tests" commit. HEAD@{5} is the tempting answer, but that entry is the base the rebase started from, so resetting there loses your work again. git rebase --abort only works mid-rebase; afterwards it prints "fatal: no rebase in progress".|||VI: Dòng nằm ngay DƯỚI "rebase (start)" là chỗ nhánh bạn trỏ tới trước khi rebase bắt đầu — ở đây là commit "add tests". HEAD@{5} là phương án hấp dẫn, nhưng dòng đó là cái gốc mà rebase xuất phát, reset về đó là lại mất việc. git rebase --abort chỉ chạy được khi đang giữa chừng; xong rồi thì nó báo "fatal: no rebase in progress".',
          },
        ],
      },
    },
  ],
};
