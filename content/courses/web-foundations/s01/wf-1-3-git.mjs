/**
 * Bài 1.3 — Git cục bộ (nâng cấp 02/11/2026). Output thật: _demo/_t1/git/chay.sh (Git 2.51 trong thư mục tạm, cấu hình
 * toàn cục tắt, ngày cố định ⇒ SHA cố định): init/status/add/commit, ba vùng + diff/diff --staged, restore/restore --staged/
 * revert, .gitignore + check-ignore, .env lỡ commit (rm --cached, vẫn còn trong lịch sử), nhánh + merge fast-forward.
 * Deck: scripts/slides-src/wf-1-3.mjs (9 slide, WF/v1/wf-1-3). Code Lab: wf-1-3-git.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-1-3', 'Git: a time machine for your code', 'Git: cỗ máy thời gian cho mã', [
  [1, 'Git: a time machine for your code',
    '<p>Git records snapshots of your project, called commits, so you can see what changed, undo mistakes and try ideas on a branch without fear. This lesson creates a real repository in an empty folder and runs every everyday command, with the exact output Git prints.</p>',
    '<p>Git ghi lại các ảnh chụp của dự án, gọi là commit, để bạn xem được cái gì đã đổi, hoàn tác sai lầm và thử ý tưởng trên một nhánh mà không sợ. Bài này tạo một kho thật trong một thư mục trống và chạy mọi lệnh dùng hằng ngày, kèm đúng output Git in ra.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to start a repository, explain the three areas, stage and commit, read status, diff and log, undo an edit, unstage a file and reverse a commit safely, ignore files that must never be committed, and use a branch.</p>',
    '<p>Bạn sẽ tạo được một kho, giải thích ba vùng, stage và commit, đọc status, diff và log, hoàn tác một chỗ sửa, bỏ stage một tệp và đảo ngược một commit an toàn, bỏ qua những tệp không bao giờ được commit, và dùng một nhánh.</p>'],
  [3, 'The first commit',
    '<p>git init creates a hidden dot git folder. git status shows index dot html as untracked. git add puts it in the staging area, marked A. git commit records a snapshot with a message and gives it an id. git log lists the history.</p>',
    '<p>git init tạo một thư mục ẩn chấm git. git status cho thấy index chấm html chưa được theo dõi. git add đưa nó vào vùng stage, đánh dấu A. git commit ghi một ảnh chụp kèm thông điệp và cho nó một mã. git log liệt kê lịch sử.</p>'],
  [4, 'Three areas',
    '<p>Your working folder, the staging area, and the history. git diff shows what changed but is not staged yet. After git add, plain diff is empty and diff dash dash staged shows the change. Commit moves it into history.</p>',
    '<p>Thư mục làm việc, vùng stage, và lịch sử. git diff cho thấy thứ đã đổi mà chưa stage. Sau git add, diff trơn rỗng còn diff gạch gạch staged hiện thay đổi. Commit đưa nó vào lịch sử.</p>'],
  [5, 'Undo, safely',
    '<p>git restore threw away an unstaged edit. git restore dash dash staged took a file out of staging but kept the edit. git revert undid a whole commit by adding a new commit that reverses it, so history is never rewritten, and the old file is still readable.</p>',
    '<p>git restore bỏ một chỗ sửa chưa stage. git restore gạch gạch staged đưa tệp ra khỏi vùng stage nhưng giữ chỗ sửa. git revert hoàn tác cả một commit bằng cách thêm commit mới đảo ngược nó, nên lịch sử không bị viết lại, và tệp cũ vẫn đọc được.</p>'],
  [6, 'dot gitignore',
    '<p>node modules, the dot env file and log files showed up as untracked. Three lines in dot gitignore made them disappear from status. git check dash ignore explains which rule matched each file.</p>',
    '<p>node modules, tệp chấm env và các tệp log hiện là chưa theo dõi. Ba dòng trong chấm gitignore làm chúng biến khỏi status. git check gạch ignore giải thích luật nào khớp với từng tệp.</p>'],
  [7, 'Ignoring is too late once committed',
    '<p>A dot env file committed before the ignore rule existed kept showing as modified. git rm dash dash cached stopped tracking it. But git show of the earlier commit still printed the secret: once committed, it lives in history.</p>',
    '<p>Một tệp chấm env đã commit trước khi có luật bỏ qua vẫn hiện là đã sửa. git rm gạch gạch cached ngừng theo dõi nó. Nhưng git show của commit trước vẫn in ra bí mật: đã commit thì nó sống trong lịch sử.</p>'],
  [8, 'Branches',
    '<p>A branch is a separate line of commits. On feature slash contact we added a link; main did not have it. Merging brought it in with a fast forward, and the branch was deleted. Every feature in a team starts like this.</p>',
    '<p>Nhánh là một dòng commit riêng. Trên feature gạch contact ta thêm một liên kết; main chưa có nó. Gộp đưa nó vào bằng fast forward, và nhánh được xoá. Mọi tính năng trong một nhóm đều bắt đầu như vậy.</p>'],
  [9, 'Summary & practice',
    '<p>The practice asks you to put your terminal practice folder under Git with at least four small commits, a dot gitignore, one undone change and one merged branch. Done when git log oneline shows your commits and git status is clean.</p>',
    '<p>Bài luyện yêu cầu bạn đưa thư mục luyện terminal vào Git với ít nhất bốn commit nhỏ, một chấm gitignore, một thay đổi đã hoàn tác và một nhánh đã gộp. Xong khi git log oneline hiện các commit và git status sạch.</p>'],
]);

export default {
  title: '1.3 — Git: a time machine for your code|||1.3 — Git: cỗ máy thời gian cho mã của bạn',
  slug: 'wf-1-3-git',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/8JJ101D3knE', durationSeconds: 0 },
  description: 'Git 2.51 chạy thật trong một kho trống: init/status/add/commit/log, ba vùng (diff và diff --staged), hoàn tác an toàn (restore, restore --staged, revert), .gitignore + check-ignore cho node_modules/.env/*.log, .env lỡ commit — rm --cached rồi vẫn đọc được trong lịch sử, nhánh + merge fast-forward.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Git records snapshots so you can always go back</h2>
<p class="lead">After this lesson you can put any project under Git: create a repository, stage and commit, read <code>status</code>, <code>diff</code> and <code>log</code>, undo an edit, unstage a file, reverse a commit without rewriting history, keep secrets and dependencies out with <code>.gitignore</code>, and work on a branch. Lesson 1.4 sends these commits to GitHub; Lesson 10.3 uses them with a team. Everything below was run with Git 2.51 in an empty folder; commit dates are fixed, so you get the same commit IDs if you run the script.</p>

<h3>Step 0 — once per computer</h3>
<pre><code class="language-bash">git config --global user.name "Your Name"
git config --global user.email "you@example.com"     # the email you will use on GitHub
git config --global init.defaultBranch main</code></pre>
<p>Every commit records who made it. Without these lines Git refuses to commit (or guesses badly).</p>

<h3>Step 1 — the first commit</h3>
${ra(OUT['_t1/git/out/first-commit'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">git init</span><span class="lz-t">start tracking this folder</span><span class="lz-d">Creates the hidden <code>.git/</code> folder — the whole history lives there. Delete it and the history is gone.</span></div>
<div class="lz-step"><span class="lz-k">git status</span><span class="lz-t">what is going on?</span><span class="lz-d"><code>Untracked files: index.html</code> — Git sees it but is not recording it.</span></div>
<div class="lz-step"><span class="lz-k">git add</span><span class="lz-t">choose what goes into the next snapshot</span><span class="lz-d"><code>A  index.html</code> — staged as "added".</span></div>
<div class="lz-step"><span class="lz-k">git commit -m</span><span class="lz-t">take the snapshot</span><span class="lz-d"><code>a5600e9</code> is the commit's ID (the first 7 characters of a 40-character hash).</span></div>
</div>

<h3>Step 2 — the three areas</h3>
${ra(OUT['_t1/git/out/three-areas'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Working folder</span><span class="lz-t">the files you edit</span><span class="lz-d"><code> M index.html</code> (M in the right column) — changed, not staged. <code>git diff</code> shows these changes.</span></div>
<div class="lz-layer"><span class="lz-k">Staging area</span><span class="lz-t">the next commit, being prepared</span><span class="lz-d">After <code>git add</code>, <code>git diff</code> is empty and <code>git diff --staged</code> shows the change.</span></div>
<div class="lz-layer"><span class="lz-k">History (.git)</span><span class="lz-t">commits, forever</span><span class="lz-d"><code>git log</code> lists them; <code>git show</code> shows one.</span></div>
</div>
<p>Why stage at all? So one commit can contain exactly one idea. If you fixed a typo and started a new feature in the same session, <code>git add</code> the typo fix alone and commit it with its own message; the feature waits in the working folder. <code>git add .</code> stages everything in the current folder — convenient, and the reason <code>.gitignore</code> (Step 4) matters.</p>
<table>
<thead><tr><th><code>git status --short</code></th><th>Means</th></tr></thead>
<tbody>
<tr><td><code>??</code></td><td>untracked — Git has never recorded this file</td></tr>
<tr><td><code>A </code></td><td>added to staging (new file)</td></tr>
<tr><td><code> M</code></td><td>modified, not staged</td></tr>
<tr><td><code>M </code></td><td>modified and staged</td></tr>
<tr><td><code>UU</code></td><td>merge conflict (Lesson 10.3)</td></tr>
</tbody>
</table>

<h3>Step 3 — undo, safely</h3>
${ra(OUT['_t1/git/out/undo'])}
<table>
<thead><tr><th>Situation</th><th>Command</th><th>Loses</th></tr></thead>
<tbody>
<tr><td>Edited a file, want the last committed version back</td><td><code>git restore file</code></td><td>the uncommitted edit (gone for good)</td></tr>
<tr><td>Staged by mistake</td><td><code>git restore --staged file</code></td><td>nothing — the edit stays</td></tr>
<tr><td>A commit was wrong</td><td><code>git revert &lt;id&gt;</code></td><td>nothing — a new commit undoes it, history kept</td></tr>
<tr><td>Want to see an old version</td><td><code>git show &lt;id&gt;:file</code></td><td>nothing</td></tr>
</tbody>
</table>
<p>The revert above removed <code>style.css</code> and the link to it in a <em>new</em> commit, and <code>git show HEAD~1:style.css</code> still printed the old file: nothing committed is ever really lost. <code>HEAD</code> means "the current commit", <code>HEAD~1</code> "the one before".</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — <code>git restore</code> (and <code>git checkout -- file</code>, <code>git reset --hard</code>) destroy uncommitted work.</strong> They exist to throw changes away, and Git does not ask twice. Commit is the save button: work that was committed can always be recovered; work that was only in the working folder cannot. Commit small and often — even "WIP" commits on a branch are better than an afternoon of unsaved changes.</p></div>

<h3>Step 4 — <code>.gitignore</code>: what must never be committed</h3>
${ra(OUT['_t1/git/out/gitignore'])}
<div class="kv-grid">
  <div class="kv"><span class="k">node_modules/</span><span class="v">Thousands of files that <code>npm install</code> recreates (Lesson 1.5). Huge, and not your code.</span></div>
  <div class="kv"><span class="k">.env</span><span class="v">Passwords, API keys, database URLs (Chapter 7). Never in Git.</span></div>
  <div class="kv"><span class="k">*.log, dist/, .DS_Store</span><span class="v">Generated or personal files.</span></div>
  <div class="kv"><span class="k">git check-ignore -v</span><span class="v">Explains which line of which <code>.gitignore</code> ignores a file.</span></div>
</div>

<h3>Step 5 — when it is already too late</h3>
${ra(OUT['_t1/git/out/env-mistake'])}
<p>Three lessons in one output. Adding <code>.env</code> to <code>.gitignore</code> after it was committed did nothing: <code> M .env</code> — <strong>ignore rules only apply to untracked files</strong>. <code>git rm --cached .env</code> stopped tracking it (the file stays on disk) and later edits disappeared from <code>status</code>. But <code>git show HEAD~1:.env</code> still printed <code>API_KEY=dev-only-123</code>: the value is in history, and on GitHub it would be readable by anyone with access to the repository.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "I deleted the secret in the next commit, so it is fine".</strong> It is not: every earlier commit still contains it, and bots scan public repositories for keys within minutes of a push. The only real fix is to <strong>revoke the key</strong> (create a new one, disable the old one) — rewriting history comes second. Prevention is cheap: create <code>.gitignore</code> with <code>.env</code> and <code>node_modules/</code> as the very first commit of every project, and look at <code>git status</code> before every <code>git add .</code>.</p></div>

<h3>Step 6 — branches</h3>
${ra(OUT['_t1/git/out/branch'])}
<p>A branch is a movable label on a line of commits. <code>git switch -c feature/contact</code> created one and moved to it; the new commit exists only there — on <code>main</code>, <code>grep</code> found 0 "Contact". <code>git merge</code> brought it in; because <code>main</code> had not moved, Git simply slid the label forward ("Fast-forward"). When both sides have new commits, Git creates a merge commit — and when both changed the same line, you get a conflict (Lesson 10.3).</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">edit</span><span class="lz-d">change files</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">git status · git diff</span><span class="lz-d">look before you add</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">git add &lt;files&gt;</span><span class="lz-d">one idea per commit</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">git commit -m "…"</span><span class="lz-d">a message that says what changed</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">repeat</span><span class="lz-d">small and often; push in Lesson 1.4</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Practice (35 minutes) — your portfolio under Git</strong></p>
<ol>
<li>In the <code>practice/portfolio</code> folder from Lesson 1.1: <code>git init</code>, then write <code>.gitignore</code> with <code>node_modules/</code>, <code>.env</code>, <code>*.log</code>, and make it the first commit.</li>
<li>Commit <code>index.html</code>, then <code>css/style.css</code>, then <code>js/app.js</code> — three commits with clear messages. Use <code>git diff --staged</code> before each one.</li>
<li>Write garbage into <code>index.html</code>, check <code>git status</code>, and bring it back with <code>git restore</code>.</li>
<li>Commit a deliberately bad change, then undo it with <code>git revert HEAD</code>.</li>
<li>Create <code>feature/about</code>, add <code>about.html</code> there and commit; switch back to <code>main</code>, merge, delete the branch.</li>
<li>Create a <code>.env</code> with a fake value and confirm <code>git status --short</code> does not show it.</li>
</ol>
<p>Hint: <code>git log --oneline --graph --all</code> after each step shows exactly where every commit and branch is.</p>
<p><strong>Done when:</strong> <code>git log --oneline</code> shows at least 6 commits including a "Revert …" one, <code>git status</code> says <code>nothing to commit, working tree clean</code>, and <code>git check-ignore -v .env</code> prints the <code>.gitignore</code> rule. Then Code Lab module 1.3.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">repository (repo)</span><span class="v">kho mã — thư mục có <code>.git</code>.</span></div>
  <div class="kv"><span class="k">commit</span><span class="v">ảnh chụp có thông điệp và mã định danh.</span></div>
  <div class="kv"><span class="k">working tree</span><span class="v">thư mục làm việc.</span></div>
  <div class="kv"><span class="k">staging area (index)</span><span class="v">vùng stage — commit kế tiếp đang chuẩn bị.</span></div>
  <div class="kv"><span class="k">untracked / tracked</span><span class="v">chưa theo dõi / đang theo dõi.</span></div>
  <div class="kv"><span class="k">diff</span><span class="v">phần khác biệt.</span></div>
  <div class="kv"><span class="k">HEAD</span><span class="v">commit hiện tại.</span></div>
  <div class="kv"><span class="k">revert</span><span class="v">đảo ngược bằng một commit mới.</span></div>
  <div class="kv"><span class="k">.gitignore</span><span class="v">danh sách tệp Git bỏ qua.</span></div>
  <div class="kv"><span class="k">branch / merge / fast-forward</span><span class="v">nhánh / gộp / tiến thẳng.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li><code>init</code> once; then <code>status</code> → <code>add</code> → <code>commit</code>, small and often.</li>
  <li>Three areas: working folder (<code>diff</code>), staging (<code>diff --staged</code>), history (<code>log</code>, <code>show</code>).</li>
  <li><code>restore</code> discards edits, <code>restore --staged</code> unstages, <code>revert</code> undoes a commit safely.</li>
  <li><code>.gitignore</code> first: <code>node_modules/</code>, <code>.env</code>, logs — it does not untrack files already committed.</li>
  <li>A committed secret stays in history: revoke it.</li>
  <li>Branches are cheap; <code>merge</code> brings work back.</li>
</ul>
${nguon('📗', 'Pro Git — Recording Changes to the Repository', 'status, add, commit, diff and .gitignore from the official book', 'https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository')}
${nguon('📘', 'Git documentation — git restore / git revert', 'The two safe ways to undo', 'https://git-scm.com/docs/git-revert')}
${lienKet({ khoa: 'git', bai: 'git-1-1-ba-cai-cay', title: 'Git 1.1 — The three trees', sub: 'Working tree, index and HEAD in depth', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Git ghi lại các ảnh chụp để bạn luôn quay lại được</h2>
<p class="lead">Học xong bài này bạn đưa được bất kỳ dự án nào vào Git: tạo kho, stage và commit, đọc <code>status</code>, <code>diff</code> và <code>log</code>, hoàn tác một chỗ sửa, bỏ stage một tệp, đảo ngược một commit mà không viết lại lịch sử, giữ bí mật và thư viện ngoài Git bằng <code>.gitignore</code>, và làm việc trên một nhánh. Bài 1.4 gửi các commit này lên GitHub; Bài 10.3 dùng chúng với cả nhóm. Mọi thứ dưới đây chạy bằng Git 2.51 trong một thư mục trống; ngày commit cố định, nên chạy script bạn nhận được đúng các mã commit này.</p>

<h3>Bước 0 — mỗi máy một lần</h3>
<pre><code class="language-bash">git config --global user.name "Tên Của Bạn"
git config --global user.email "ban@example.com"     # email bạn sẽ dùng trên GitHub
git config --global init.defaultBranch main</code></pre>
<p>Mọi commit ghi lại ai tạo ra nó. Thiếu mấy dòng này Git từ chối commit (hoặc đoán sai).</p>

<h3>Bước 1 — commit đầu tiên</h3>
${ra(OUT['_t1/git/out/first-commit'])}
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">git init</span><span class="lz-t">bắt đầu theo dõi thư mục này</span><span class="lz-d">Tạo thư mục ẩn <code>.git/</code> — toàn bộ lịch sử sống ở đó. Xoá nó là mất lịch sử.</span></div>
<div class="lz-step"><span class="lz-k">git status</span><span class="lz-t">đang có chuyện gì?</span><span class="lz-d"><code>Untracked files: index.html</code> — Git thấy nó nhưng chưa ghi lại.</span></div>
<div class="lz-step"><span class="lz-k">git add</span><span class="lz-t">chọn thứ vào ảnh chụp kế tiếp</span><span class="lz-d"><code>A  index.html</code> — đã stage dưới dạng "thêm mới".</span></div>
<div class="lz-step"><span class="lz-k">git commit -m</span><span class="lz-t">chụp ảnh</span><span class="lz-d"><code>a5600e9</code> là mã của commit (7 ký tự đầu của một chuỗi băm 40 ký tự).</span></div>
</div>

<h3>Bước 2 — ba vùng</h3>
${ra(OUT['_t1/git/out/three-areas'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">Thư mục làm việc</span><span class="lz-t">các tệp bạn sửa</span><span class="lz-d"><code> M index.html</code> (M ở cột phải) — đã đổi, chưa stage. <code>git diff</code> hiện các thay đổi này.</span></div>
<div class="lz-layer"><span class="lz-k">Vùng stage</span><span class="lz-t">commit kế tiếp, đang chuẩn bị</span><span class="lz-d">Sau <code>git add</code>, <code>git diff</code> rỗng còn <code>git diff --staged</code> hiện thay đổi.</span></div>
<div class="lz-layer"><span class="lz-k">Lịch sử (.git)</span><span class="lz-t">các commit, mãi mãi</span><span class="lz-d"><code>git log</code> liệt kê; <code>git show</code> hiện một cái.</span></div>
</div>
<p>Vì sao phải stage? Để một commit chứa đúng một ý. Nếu trong cùng một buổi bạn vừa sửa lỗi chính tả vừa bắt đầu tính năng mới, hãy <code>git add</code> riêng phần sửa chính tả và commit với thông điệp của nó; tính năng chờ trong thư mục làm việc. <code>git add .</code> stage mọi thứ trong thư mục hiện tại — tiện, và là lý do <code>.gitignore</code> (Bước 4) quan trọng.</p>
<table>
<thead><tr><th><code>git status --short</code></th><th>Nghĩa là</th></tr></thead>
<tbody>
<tr><td><code>??</code></td><td>chưa theo dõi — Git chưa từng ghi tệp này</td></tr>
<tr><td><code>A </code></td><td>đã thêm vào stage (tệp mới)</td></tr>
<tr><td><code> M</code></td><td>đã sửa, chưa stage</td></tr>
<tr><td><code>M </code></td><td>đã sửa và đã stage</td></tr>
<tr><td><code>UU</code></td><td>xung đột khi gộp (Bài 10.3)</td></tr>
</tbody>
</table>

<h3>Bước 3 — hoàn tác, an toàn</h3>
${ra(OUT['_t1/git/out/undo'])}
<table>
<thead><tr><th>Tình huống</th><th>Lệnh</th><th>Mất gì</th></tr></thead>
<tbody>
<tr><td>Đã sửa tệp, muốn lấy lại bản commit gần nhất</td><td><code>git restore tệp</code></td><td>chỗ sửa chưa commit (mất hẳn)</td></tr>
<tr><td>Lỡ stage</td><td><code>git restore --staged tệp</code></td><td>không gì — chỗ sửa vẫn còn</td></tr>
<tr><td>Một commit bị sai</td><td><code>git revert &lt;mã&gt;</code></td><td>không gì — commit mới hoàn tác nó, giữ lịch sử</td></tr>
<tr><td>Muốn xem bản cũ</td><td><code>git show &lt;mã&gt;:tệp</code></td><td>không gì</td></tr>
</tbody>
</table>
<p>Lần revert ở trên xoá <code>style.css</code> và liên kết tới nó bằng một commit <em>mới</em>, và <code>git show HEAD~1:style.css</code> vẫn in ra tệp cũ: những gì đã commit không bao giờ thật sự mất. <code>HEAD</code> nghĩa là "commit hiện tại", <code>HEAD~1</code> là "commit ngay trước".</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — <code>git restore</code> (và <code>git checkout -- tệp</code>, <code>git reset --hard</code>) phá huỷ công việc chưa commit.</strong> Chúng sinh ra để vứt thay đổi, và Git không hỏi lại. Commit là nút lưu: công việc đã commit luôn khôi phục được; công việc chỉ nằm trong thư mục làm việc thì không. Commit nhỏ và thường xuyên — kể cả commit "WIP" trên một nhánh cũng tốt hơn cả buổi chiều thay đổi chưa lưu.</p></div>

<h3>Bước 4 — <code>.gitignore</code>: thứ không bao giờ được commit</h3>
${ra(OUT['_t1/git/out/gitignore'])}
<div class="kv-grid">
  <div class="kv"><span class="k">node_modules/</span><span class="v">Hàng nghìn tệp mà <code>npm install</code> tạo lại được (Bài 1.5). Rất nặng, và không phải mã của bạn.</span></div>
  <div class="kv"><span class="k">.env</span><span class="v">Mật khẩu, khoá API, URL CSDL (Chương 7). Không bao giờ vào Git.</span></div>
  <div class="kv"><span class="k">*.log, dist/, .DS_Store</span><span class="v">Tệp sinh ra hoặc tệp cá nhân.</span></div>
  <div class="kv"><span class="k">git check-ignore -v</span><span class="v">Giải thích dòng nào của <code>.gitignore</code> nào đang bỏ qua một tệp.</span></div>
</div>

<h3>Bước 5 — khi đã quá muộn</h3>
${ra(OUT['_t1/git/out/env-mistake'])}
<p>Ba bài học trong một output. Thêm <code>.env</code> vào <code>.gitignore</code> sau khi đã commit nó chẳng có tác dụng gì: <code> M .env</code> — <strong>luật bỏ qua chỉ áp cho tệp chưa được theo dõi</strong>. <code>git rm --cached .env</code> ngừng theo dõi nó (tệp vẫn nằm trên đĩa) và các lần sửa sau biến khỏi <code>status</code>. Nhưng <code>git show HEAD~1:.env</code> vẫn in ra <code>API_KEY=dev-only-123</code>: giá trị nằm trong lịch sử, và trên GitHub thì ai có quyền vào kho cũng đọc được.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "Tôi đã xoá bí mật ở commit sau, vậy là ổn".</strong> Không ổn: mọi commit trước đó vẫn chứa nó, và bot quét kho công khai để tìm khoá chỉ vài phút sau khi push. Cách sửa thật duy nhất là <strong>thu hồi khoá</strong> (tạo khoá mới, vô hiệu khoá cũ) — viết lại lịch sử là việc thứ hai. Phòng thì rẻ: tạo <code>.gitignore</code> có <code>.env</code> và <code>node_modules/</code> làm commit đầu tiên của mọi dự án, và nhìn <code>git status</code> trước mỗi <code>git add .</code>.</p></div>

<h3>Bước 6 — nhánh</h3>
${ra(OUT['_t1/git/out/branch'])}
<p>Nhánh là một nhãn di chuyển được trên một dòng commit. <code>git switch -c feature/contact</code> tạo nhánh và chuyển sang; commit mới chỉ tồn tại ở đó — trên <code>main</code>, <code>grep</code> đếm được 0 "Contact". <code>git merge</code> đưa nó vào; vì <code>main</code> chưa đi tiếp, Git chỉ việc trượt nhãn lên ("Fast-forward"). Khi cả hai bên đều có commit mới, Git tạo một merge commit — và khi cả hai cùng sửa một dòng, bạn gặp xung đột (Bài 10.3).</p>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">sửa</span><span class="lz-d">thay đổi tệp</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">git status · git diff</span><span class="lz-d">nhìn trước khi add</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">git add &lt;tệp&gt;</span><span class="lz-d">mỗi commit một ý</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">git commit -m "…"</span><span class="lz-d">thông điệp nói rõ cái gì đã đổi</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">lặp lại</span><span class="lz-d">nhỏ và thường xuyên; push ở Bài 1.4</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (35 phút) — đưa portfolio vào Git</strong></p>
<ol>
<li>Trong thư mục <code>practice/portfolio</code> của Bài 1.1: <code>git init</code>, rồi viết <code>.gitignore</code> có <code>node_modules/</code>, <code>.env</code>, <code>*.log</code>, và làm nó thành commit đầu tiên.</li>
<li>Commit <code>index.html</code>, rồi <code>css/style.css</code>, rồi <code>js/app.js</code> — ba commit với thông điệp rõ ràng. Dùng <code>git diff --staged</code> trước mỗi lần.</li>
<li>Ghi rác vào <code>index.html</code>, kiểm <code>git status</code>, và lấy lại bằng <code>git restore</code>.</li>
<li>Commit một thay đổi cố tình sai, rồi hoàn tác bằng <code>git revert HEAD</code>.</li>
<li>Tạo <code>feature/about</code>, thêm <code>about.html</code> ở đó và commit; quay về <code>main</code>, gộp, xoá nhánh.</li>
<li>Tạo <code>.env</code> với giá trị giả và xác nhận <code>git status --short</code> không hiện nó.</li>
</ol>
<p>Gợi ý: <code>git log --oneline --graph --all</code> sau mỗi bước cho thấy chính xác mỗi commit và nhánh đang ở đâu.</p>
<p><strong>Xong khi:</strong> <code>git log --oneline</code> hiện ít nhất 6 commit trong đó có một cái "Revert …", <code>git status</code> báo <code>nothing to commit, working tree clean</code>, và <code>git check-ignore -v .env</code> in ra luật trong <code>.gitignore</code>. Sau đó làm module Code Lab 1.3.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">repository (repo)</span><span class="v">kho mã — thư mục có <code>.git</code>.</span></div>
  <div class="kv"><span class="k">commit</span><span class="v">ảnh chụp có thông điệp và mã định danh.</span></div>
  <div class="kv"><span class="k">working tree</span><span class="v">thư mục làm việc.</span></div>
  <div class="kv"><span class="k">staging area (index)</span><span class="v">vùng stage — commit kế tiếp đang chuẩn bị.</span></div>
  <div class="kv"><span class="k">untracked / tracked</span><span class="v">chưa theo dõi / đang theo dõi.</span></div>
  <div class="kv"><span class="k">diff</span><span class="v">phần khác biệt.</span></div>
  <div class="kv"><span class="k">HEAD</span><span class="v">commit hiện tại.</span></div>
  <div class="kv"><span class="k">revert</span><span class="v">đảo ngược bằng một commit mới.</span></div>
  <div class="kv"><span class="k">.gitignore</span><span class="v">danh sách tệp Git bỏ qua.</span></div>
  <div class="kv"><span class="k">branch / merge / fast-forward</span><span class="v">nhánh / gộp / tiến thẳng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li><code>init</code> một lần; sau đó <code>status</code> → <code>add</code> → <code>commit</code>, nhỏ và thường xuyên.</li>
  <li>Ba vùng: thư mục làm việc (<code>diff</code>), stage (<code>diff --staged</code>), lịch sử (<code>log</code>, <code>show</code>).</li>
  <li><code>restore</code> bỏ chỗ sửa, <code>restore --staged</code> bỏ stage, <code>revert</code> hoàn tác commit an toàn.</li>
  <li><code>.gitignore</code> trước tiên: <code>node_modules/</code>, <code>.env</code>, log — nó không gỡ theo dõi tệp đã commit.</li>
  <li>Bí mật đã commit nằm lại trong lịch sử: hãy thu hồi nó.</li>
  <li>Nhánh rẻ; <code>merge</code> đưa công việc về.</li>
</ul>
${nguon('📗', 'Pro Git — Recording Changes to the Repository', 'status, add, commit, diff và .gitignore từ sách chính thức', 'https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository')}
${nguon('📘', 'Git documentation — git restore / git revert', 'Hai cách hoàn tác an toàn', 'https://git-scm.com/docs/git-revert')}
${lienKet({ khoa: 'git', bai: 'git-1-1-ba-cai-cay', title: 'Git 1.1 — Ba cái cây', sub: 'Thư mục làm việc, index và HEAD, chuyên sâu', cta: 'Mở bài' })}
</div>
`,
};
