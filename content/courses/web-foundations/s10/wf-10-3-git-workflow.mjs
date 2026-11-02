/**
 * Bài 10.3 — Quy trình Git cho công việc thật (nâng cấp 02/11/2026). Output thật: _demo/_t10/10-3/chay.sh (Git 2.51, hai
 * người An/Bình + một "origin" trần trong thư mục tạm, ngày cố định ⇒ SHA cố định): nhánh tính năng, commit nhỏ, push -u,
 * "pull request" (log main..nhánh, diff --stat), merge --no-ff, push bị từ chối (fetch first), merge main vào nhánh tự gộp,
 * xung đột thật cùng một dòng + gỡ, log --graph. Deck: scripts/slides-src/wf-10-3.mjs. Code Lab: wf-10-3-git-workflow.
 */
import { walkWf, ma, ra, nguon, lienKet } from '../_slides.mjs';
import { CODE, OUT } from '../_ma.mjs';

const G = walkWf('wf-10-3', 'Git workflow for real work', 'Quy trình Git cho công việc thật', [
  [1, 'Git workflow for real work',
    '<p>Lesson one point three taught you to save your own work with Git. Real projects have several people changing the same files at the same time. This lesson runs a complete two-person workflow with real Git: feature branches, small commits, push, a pull request, a rejected push, and a real merge conflict, resolved step by step.</p>',
    '<p>Bài một chấm ba dạy bạn lưu công việc của chính mình bằng Git. Dự án thật có nhiều người cùng sửa các tệp giống nhau cùng lúc. Bài này chạy một quy trình hai người hoàn chỉnh bằng Git thật: nhánh tính năng, commit nhỏ, push, pull request, một lần push bị từ chối, và một xung đột merge thật, được gỡ từng bước.</p>'],
  [2, 'After this lesson you can…',
    '<p>You will be able to start a branch for each change, make small commits with clear messages, push a branch and describe what a pull request contains, understand why a push is rejected, bring main into your branch, and resolve a conflict by reading the markers and keeping the right code.</p>',
    '<p>Bạn sẽ mở một nhánh cho mỗi thay đổi, tạo commit nhỏ với thông điệp rõ ràng, push một nhánh và mô tả pull request chứa gì, hiểu vì sao push bị từ chối, đưa main vào nhánh của mình, và gỡ xung đột bằng cách đọc các dấu đánh dấu và giữ đúng phần mã.</p>'],
  [3, 'One branch per change',
    '<p>An creates a branch called feature slash search, makes two small commits, and pushes the branch. The minus u flag connects the local branch to the one on the server, so later a plain git push or git pull knows where to go. Main is untouched.</p>',
    '<p>An tạo nhánh feature gạch chéo search, làm hai commit nhỏ, và push nhánh lên. Cờ trừ u nối nhánh cục bộ với nhánh trên máy chủ, để sau này git push hay git pull trơn biết phải đi đâu. Main không bị đụng tới.</p>'],
  [4, 'What a pull request shows',
    '<p>A pull request asks: please merge my branch into main. Reviewers see the commits that are on the branch but not on main, and the size of the change. Git can show both: log main dot dot branch, and diff with three dots. Two commits, five lines.</p>',
    '<p>Pull request là lời đề nghị: hãy gộp nhánh của tôi vào main. Người review thấy các commit có trên nhánh mà chưa có trên main, và độ lớn của thay đổi. Git cho xem cả hai: log main chấm chấm nhánh, và diff với ba chấm. Hai commit, năm dòng.</p>'],
  [5, 'Push rejected: fetch first',
    '<p>After An\'s pull request was merged, Binh tried to push a commit straight to main. Git refused: the remote contains work you do not have. It never overwrites someone else\'s commits. The answer is to bring their work in first, and to stop committing directly to main.</p>',
    '<p>Sau khi pull request của An được gộp, Bình thử push một commit thẳng lên main. Git từ chối: phía remote có công việc mà bạn chưa có. Git không bao giờ ghi đè commit của người khác. Cách làm đúng là đưa công việc của họ về trước, và thôi commit thẳng vào main.</p>'],
  [6, 'Merging main into your branch',
    '<p>Binh\'s branch sorts the notes; main now has search. They touched different lines, so git merge combined them automatically and created a merge commit. The graph shows both lines of work joining.</p>',
    '<p>Nhánh của Bình sắp xếp ghi chú; main giờ có tìm kiếm. Hai bên sửa các dòng khác nhau, nên git merge tự gộp và tạo một merge commit. Biểu đồ cho thấy hai dòng công việc nhập lại.</p>'],
  [7, 'A real conflict',
    '<p>Then An changed the same line Binh had changed: numbering instead of sorting. Git cannot choose, so it stops and writes both versions into the file between markers: ours above the equals line, theirs below. git status marks the file UU, both modified.</p>',
    '<p>Rồi An sửa đúng dòng mà Bình đã sửa: đánh số thay vì sắp xếp. Git không thể chọn, nên nó dừng và ghi cả hai phiên bản vào tệp giữa các dấu: của ta ở trên dòng dấu bằng, của họ ở dưới. git status đánh dấu tệp là UU, cả hai cùng sửa.</p>'],
  [8, 'Resolving it',
    '<p>Resolving means deciding what the code should be. Here we kept both ideas, sorted and numbered, removed the markers, ran the program to check, then added and committed. After the final merge, the graph shows three pull requests joining main.</p>',
    '<p>Gỡ xung đột nghĩa là quyết định mã phải là gì. Ở đây ta giữ cả hai ý, sắp xếp và đánh số, xoá các dấu, chạy chương trình để kiểm, rồi add và commit. Sau lần gộp cuối, biểu đồ cho thấy ba pull request nhập vào main.</p>'],
  [9, 'Summary & practice',
    '<p>The practice recreates this workflow on your machine with a bare repository and two clones, including one conflict you cause on purpose. Done when git log graph shows two merged branches and the program runs with both changes.</p>',
    '<p>Bài luyện dựng lại quy trình này trên máy bạn với một kho trần và hai bản sao, kèm một xung đột bạn cố ý gây ra. Xong khi git log graph cho thấy hai nhánh đã gộp và chương trình chạy với cả hai thay đổi.</p>'],
]);

export default {
  title: '10.3 — Git workflow for real work|||10.3 — Quy trình Git cho công việc thật',
  slug: 'wf-10-3-git-workflow',
  type: 'VIDEO',
  video: { url: 'https://youtu.be/Uszj_k0DGsg', durationSeconds: 0 },
  description: 'Quy trình hai người chạy bằng Git 2.51 thật: nhánh cho mỗi thay đổi, commit nhỏ, push -u, pull request nhìn bằng log main..nhánh và diff --stat, merge --no-ff, push lên main bị từ chối (fetch first), merge main vào nhánh tự gộp khi khác dòng, xung đột thật khi cùng dòng (UU, dấu <<<<<<< ======= >>>>>>>), gỡ bằng cách giữ cả hai ý rồi chạy lại, đọc log --graph.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.3</span>
<h2>Git basics get you saving; a workflow gets you collaborating</h2>
<p class="lead">After this lesson you can work on a shared repository the way teams do: a branch for each change, small commits, push, a pull request that a reviewer can read, keeping your branch up to date with <code>main</code>, understanding a rejected push, and resolving a real conflict. Everything below was run with Git 2.51 by two people, An and Binh, sharing one "origin" repository — the same setup as GitHub, without the website.</p>

<h3>The setup</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">origin</span><span class="lz-t">the shared repository</span><span class="lz-d">On GitHub/GitLab in real life; here a bare repository in a folder. Nobody edits files there — only pushes and fetches.</span></div>
<div class="lz-layer"><span class="lz-k">An's clone</span><span class="lz-t">a full copy on An's machine</span><span class="lz-d">Commits are made here, then pushed.</span></div>
<div class="lz-layer"><span class="lz-k">Binh's clone</span><span class="lz-t">another full copy</span><span class="lz-d">Same history, different new work — that is where conflicts come from.</span></div>
</div>
<p>The project is a tiny notes script (<code>notes.js</code>, a list and a <code>list()</code> function). The full script is <code>_demo/_t10/10-3/chay.sh</code>; every commit uses a fixed date, so the commit IDs below are the ones you get if you run it.</p>

<h3>Step 1 — one branch per change, small commits, push</h3>
${ra(OUT['_t10/out/git-branch'])}
<div class="kv-grid">
  <div class="kv"><span class="k">git switch -c feature/search</span><span class="v">Create a branch and move to it. <code>main</code> stays exactly as it was.</span></div>
  <div class="kv"><span class="k">two commits, not one</span><span class="v">"Add search(term)" and "Print search results" — each one does one thing and can be reviewed or reverted alone.</span></div>
  <div class="kv"><span class="k">git push -u origin feature/search</span><span class="v">Send the branch; <code>-u</code> remembers the link so later <code>git push</code>/<code>git pull</code> need no arguments.</span></div>
  <div class="kv"><span class="k">main..feature/search</span><span class="v">Commits on the branch that are not on main — exactly the commit list of the pull request.</span></div>
  <div class="kv"><span class="k">main...feature/search</span><span class="v">The diff since the branch started — the "Files changed" tab.</span></div>
</div>
<table>
<thead><tr><th>Commit message</th><th></th></tr></thead>
<tbody>
<tr><td><code>Add search(term) to notes</code></td><td>✅ imperative, says what changes</td></tr>
<tr><td><code>Fix crash when a pick-up order has no address</code></td><td>✅ says the problem it solves</td></tr>
<tr><td><code>update</code>, <code>fix</code>, <code>asdf</code>, <code>final final 2</code></td><td>❌ useless in <code>git log</code> six months later</td></tr>
</tbody>
</table>

<h3>Step 2 — the pull request is merged; a direct push is rejected</h3>
${ra(OUT['_t10/out/git-rejected'])}
<p>Binh's branch went up without trouble. An's pull request was reviewed and merged (<code>--no-ff</code> keeps a merge commit, as GitHub's Merge button does). Then Binh, still holding the <em>old</em> main, committed straight to main and pushed. Git refused: <code>! [rejected] main -> main (fetch first)</code>. A push may only <em>add</em> commits on top of what the server has; it never silently throws away someone else's work.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — "fixing" a rejected push with <code>--force</code>.</strong> <code>git push --force</code> makes the server's branch equal to yours — deleting An's merged pull request from history for everyone. The correct response is <code>git pull</code> (fetch + merge), check the result, then push. Better still: never commit directly to <code>main</code>; teams protect it so that only reviewed pull requests can change it.</p></div>

<h3>Step 3 — keep your branch up to date: merge main in</h3>
<p>Before asking for review, Binh brings the new <code>main</code> into <code>feature/sort</code> so the pull request is tested against the latest code:</p>
${ra(OUT['_t10/out/git-merge-main'])}
${ra(OUT['_t10/out/git-graph-noconflict'])}
<p>No conflict: Binh changed line 4 (sorting), main added lines at the end (search). Git merges <em>lines</em>, not files — different lines in the same file combine automatically. Read the graph from the bottom: the initial commit, then two lines of work (<code>|</code> and <code>| |</code>), joined by merge commits (<code>*</code> with two parents).</p>

<h3>Step 4 — a real conflict: the same line, changed twice</h3>
<p>Now An numbers the notes — on the very line Binh sorted — and that pull request (#2) is merged first:</p>
${ra(OUT['_t10/out/git-conflict-real'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</span><span class="lz-t">ours</span><span class="lz-d">The version on the branch you are on (Binh's: sorted).</span></div>
<div class="lz-layer"><span class="lz-k">=======</span><span class="lz-t">the divider</span><span class="lz-d">Between the two versions.</span></div>
<div class="lz-layer"><span class="lz-k">&gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main</span><span class="lz-t">theirs</span><span class="lz-d">The version being merged in (An's: numbered).</span></div>
<div class="lz-layer"><span class="lz-k">UU notes.js</span><span class="lz-t">unmerged, both modified</span><span class="lz-d">Git paused the merge. Nothing is lost; the rest of the file merged normally.</span></div>
</div>

<h3>Step 5 — resolve: decide what the code should be</h3>
${ra(OUT['_t10/out/git-resolved'])}
<p>Neither "keep mine" nor "keep theirs" was right: the team wanted notes both sorted <em>and</em> numbered. Binh wrote that line, removed all three marker lines, <strong>ran the program</strong> to see it work, then <code>git add</code> (= "resolved") and <code>git commit</code> (Git pre-filled the merge message). After review, pull request #3 was merged. The final graph shows three branches, each joining <code>main</code> through a merge commit.</p>
<div class="pitfall co-tieu-de"><p><strong>Trap — committing the markers.</strong> A file that still contains <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> is a syntax error in almost every language, and Git does not check for you: <code>git add</code> accepts it. Before adding, search the file for <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, and run the program or the tests. If a merge gets confusing, <code>git merge --abort</code> puts everything back as it was before the merge.</p></div>

<h3>The daily loop</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">git switch main &amp;&amp; git pull</span><span class="lz-d">Start from the latest main.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">git switch -c feature/x</span><span class="lz-d">One branch per change, named after it.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">small commits</span><span class="lz-d">Each does one thing; run the tests before each.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">git merge origin/main</span><span class="lz-d">Before review — resolve conflicts on your branch, not on main.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">push + pull request</span><span class="lz-d">Describe why; reviewers read it, CI runs the checks.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">merge, delete the branch</span><span class="lz-d">Back to step 1.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Practice (45 minutes) — two people, one repository, on your machine</strong></p>
<ol>
<li>In an empty folder: <code>git init --bare origin.git</code>, then <code>git clone origin.git an</code> and <code>git clone origin.git binh</code>. In <code>an</code>, add <code>notes.js</code> from this lesson, commit and push <code>main</code>.</li>
<li>In <code>binh</code>: <code>git pull</code>, create <code>feature/sort</code>, change the <code>return</code> line to sort, commit, push.</li>
<li>In <code>an</code>: create <code>fix/number</code>, change the <em>same</em> line to number the notes, commit, merge it into <code>main</code> and push.</li>
<li>In <code>binh</code>: <code>git fetch</code>, <code>git merge origin/main</code> — read the conflict markers, resolve so the notes are sorted and numbered, run <code>node notes.js</code>, add, commit, push.</li>
<li>In <code>an</code>: merge <code>origin/feature/sort</code> into main, push, and run <code>git log --oneline --graph</code>.</li>
</ol>
<p>Hint: give each clone its own name so commits show who did what: <code>git config user.name An</code> inside <code>an/</code>.</p>
<p><strong>Done when:</strong> <code>git log --oneline --graph</code> in <code>an</code> shows both branches merged, no file contains <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, and <code>node notes.js</code> prints the notes sorted and numbered. Then Code Lab module 10.3.</p>
</div>

<h3>🗂 Key terms (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">remote / origin</span><span class="v">kho từ xa / tên mặc định của nó.</span></div>
  <div class="kv"><span class="k">feature branch</span><span class="v">nhánh tính năng.</span></div>
  <div class="kv"><span class="k">upstream (-u)</span><span class="v">nhánh theo dõi trên remote.</span></div>
  <div class="kv"><span class="k">pull request (PR)</span><span class="v">yêu cầu gộp — đề nghị merge nhánh vào main.</span></div>
  <div class="kv"><span class="k">code review</span><span class="v">duyệt mã.</span></div>
  <div class="kv"><span class="k">merge commit</span><span class="v">commit gộp — có hai cha.</span></div>
  <div class="kv"><span class="k">fast-forward / rejected</span><span class="v">tiến thẳng / bị từ chối.</span></div>
  <div class="kv"><span class="k">merge conflict</span><span class="v">xung đột khi gộp.</span></div>
  <div class="kv"><span class="k">ours / theirs</span><span class="v">phía ta / phía họ.</span></div>
  <div class="kv"><span class="k">protected branch</span><span class="v">nhánh được bảo vệ — chỉ đổi qua PR.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
  <li>One branch per change; small commits with messages that say what and why.</li>
  <li><code>git push -u</code> once per branch; a PR = commits in <code>main..branch</code> + the diff.</li>
  <li>A rejected push means the server has work you do not: pull, check, push — never <code>--force</code> on shared branches.</li>
  <li>Merge <code>main</code> into your branch before review; different lines merge automatically.</li>
  <li>Same line changed twice ⇒ conflict markers; decide the right code, remove markers, run, add, commit.</li>
  <li><code>git log --oneline --graph</code> shows how the work joined.</li>
</ul>
${nguon('📗', 'Pro Git — Basic Branching and Merging', 'Branches, merges and resolving conflicts, from the official Git book', 'https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging')}
${nguon('📘', 'GitHub Docs — About pull requests', 'What a PR contains, reviews and merge options', 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests')}
${lienKet({ khoa: 'git', bai: 'git-3-3-xung-dot', title: 'Git 3.3 — Merge conflicts', sub: 'Every kind of conflict, merge tools and how to undo a bad merge', cta: 'Open lesson' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.3</span>
<h2>Git cơ bản giúp bạn lưu; một quy trình giúp bạn cộng tác</h2>
<p class="lead">Học xong bài này bạn làm việc được trên một kho dùng chung theo cách các nhóm làm: một nhánh cho mỗi thay đổi, commit nhỏ, push, một pull request người review đọc được, giữ nhánh của mình theo kịp <code>main</code>, hiểu một lần push bị từ chối, và gỡ một xung đột thật. Mọi thứ dưới đây được chạy bằng Git 2.51 bởi hai người, An và Bình, dùng chung một kho "origin" — cùng cách bố trí như GitHub, chỉ thiếu trang web.</p>

<h3>Cách bố trí</h3>
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">origin</span><span class="lz-t">kho dùng chung</span><span class="lz-d">Ngoài đời trên GitHub/GitLab; ở đây là một kho trần trong một thư mục. Không ai sửa tệp ở đó — chỉ push và fetch.</span></div>
<div class="lz-layer"><span class="lz-k">bản sao của An</span><span class="lz-t">bản đầy đủ trên máy An</span><span class="lz-d">Commit được tạo ở đây rồi push lên.</span></div>
<div class="lz-layer"><span class="lz-k">bản sao của Bình</span><span class="lz-t">một bản đầy đủ khác</span><span class="lz-d">Cùng lịch sử, công việc mới khác nhau — xung đột đến từ đó.</span></div>
</div>
<p>Dự án là một script ghi chú nhỏ (<code>notes.js</code>, một danh sách và hàm <code>list()</code>). Script đầy đủ là <code>_demo/_t10/10-3/chay.sh</code>; mỗi commit dùng ngày cố định, nên mã commit bên dưới chính là mã bạn nhận được khi chạy nó.</p>

<h3>Bước 1 — một nhánh cho mỗi thay đổi, commit nhỏ, push</h3>
${ra(OUT['_t10/out/git-branch'])}
<div class="kv-grid">
  <div class="kv"><span class="k">git switch -c feature/search</span><span class="v">Tạo nhánh và chuyển sang nó. <code>main</code> giữ nguyên như cũ.</span></div>
  <div class="kv"><span class="k">hai commit, không phải một</span><span class="v">"Add search(term)" và "Print search results" — mỗi cái làm một việc và có thể review hay hoàn tác riêng.</span></div>
  <div class="kv"><span class="k">git push -u origin feature/search</span><span class="v">Gửi nhánh lên; <code>-u</code> nhớ liên kết để sau này <code>git push</code>/<code>git pull</code> không cần đối số.</span></div>
  <div class="kv"><span class="k">main..feature/search</span><span class="v">Các commit có trên nhánh mà chưa có trên main — đúng danh sách commit của pull request.</span></div>
  <div class="kv"><span class="k">main...feature/search</span><span class="v">Phần khác biệt kể từ khi nhánh bắt đầu — tab "Files changed".</span></div>
</div>
<table>
<thead><tr><th>Thông điệp commit</th><th></th></tr></thead>
<tbody>
<tr><td><code>Add search(term) to notes</code></td><td>✅ thể mệnh lệnh, nói rõ thay đổi gì</td></tr>
<tr><td><code>Fix crash when a pick-up order has no address</code></td><td>✅ nói rõ vấn đề nó giải quyết</td></tr>
<tr><td><code>update</code>, <code>fix</code>, <code>asdf</code>, <code>final final 2</code></td><td>❌ vô dụng trong <code>git log</code> sáu tháng sau</td></tr>
</tbody>
</table>

<h3>Bước 2 — pull request được gộp; push thẳng bị từ chối</h3>
${ra(OUT['_t10/out/git-rejected'])}
<p>Nhánh của Bình lên trơn tru. Pull request của An được review và gộp (<code>--no-ff</code> giữ một merge commit, như nút Merge của GitHub). Rồi Bình, vẫn cầm main <em>cũ</em>, commit thẳng vào main và push. Git từ chối: <code>! [rejected] main -> main (fetch first)</code>. Một lần push chỉ được <em>thêm</em> commit lên trên những gì máy chủ đang có; nó không bao giờ lặng lẽ vứt bỏ công việc của người khác.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — "sửa" push bị từ chối bằng <code>--force</code>.</strong> <code>git push --force</code> làm nhánh trên máy chủ bằng đúng nhánh của bạn — xoá pull request đã gộp của An khỏi lịch sử của mọi người. Phản ứng đúng là <code>git pull</code> (fetch + merge), kiểm kết quả, rồi mới push. Tốt hơn nữa: đừng bao giờ commit thẳng vào <code>main</code>; các nhóm bảo vệ nó để chỉ pull request đã review mới đổi được.</p></div>

<h3>Bước 3 — giữ nhánh theo kịp: merge main vào</h3>
<p>Trước khi nhờ review, Bình đưa <code>main</code> mới vào <code>feature/sort</code> để pull request được kiểm trên mã mới nhất:</p>
${ra(OUT['_t10/out/git-merge-main'])}
${ra(OUT['_t10/out/git-graph-noconflict'])}
<p>Không xung đột: Bình sửa dòng 4 (sắp xếp), main thêm dòng ở cuối (tìm kiếm). Git gộp theo <em>dòng</em>, không theo tệp — các dòng khác nhau trong cùng một tệp tự ghép được. Đọc biểu đồ từ dưới lên: commit đầu tiên, rồi hai dòng công việc (<code>|</code> và <code>| |</code>), nhập lại bằng merge commit (<code>*</code> có hai cha).</p>

<h3>Bước 4 — xung đột thật: cùng một dòng, sửa hai lần</h3>
<p>Giờ An đánh số các ghi chú — đúng dòng Bình đã sắp xếp — và pull request đó (#2) được gộp trước:</p>
${ra(OUT['_t10/out/git-conflict-real'])}
<div class="lz-stack">
<div class="lz-layer"><span class="lz-k">&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</span><span class="lz-t">của ta</span><span class="lz-d">Phiên bản trên nhánh bạn đang đứng (của Bình: sắp xếp).</span></div>
<div class="lz-layer"><span class="lz-k">=======</span><span class="lz-t">vạch ngăn</span><span class="lz-d">Giữa hai phiên bản.</span></div>
<div class="lz-layer"><span class="lz-k">&gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main</span><span class="lz-t">của họ</span><span class="lz-d">Phiên bản đang được gộp vào (của An: đánh số).</span></div>
<div class="lz-layer"><span class="lz-k">UU notes.js</span><span class="lz-t">chưa gộp, cả hai cùng sửa</span><span class="lz-d">Git tạm dừng việc gộp. Không mất gì; phần còn lại của tệp đã gộp bình thường.</span></div>
</div>

<h3>Bước 5 — gỡ: quyết định mã phải là gì</h3>
${ra(OUT['_t10/out/git-resolved'])}
<p>Cả "giữ của mình" lẫn "giữ của họ" đều không đúng: nhóm muốn ghi chú vừa sắp xếp <em>vừa</em> đánh số. Bình viết đúng dòng đó, xoá cả ba dòng đánh dấu, <strong>chạy chương trình</strong> để thấy nó hoạt động, rồi <code>git add</code> (= "đã gỡ") và <code>git commit</code> (Git điền sẵn thông điệp gộp). Sau khi review, pull request #3 được gộp. Biểu đồ cuối cho thấy ba nhánh, mỗi nhánh nhập vào <code>main</code> qua một merge commit.</p>
<div class="pitfall co-tieu-de"><p><strong>Bẫy — commit luôn cả các dấu đánh dấu.</strong> Một tệp còn chứa <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> là lỗi cú pháp với gần như mọi ngôn ngữ, và Git không kiểm giùm: <code>git add</code> vẫn nhận. Trước khi add, tìm <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> trong tệp, và chạy chương trình hoặc phép kiểm. Nếu việc gộp trở nên rối, <code>git merge --abort</code> đưa mọi thứ về như trước khi gộp.</p></div>

<h3>Vòng lặp mỗi ngày</h3>
<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">git switch main &amp;&amp; git pull</span><span class="lz-d">Bắt đầu từ main mới nhất.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">git switch -c feature/x</span><span class="lz-d">Một nhánh cho mỗi thay đổi, đặt tên theo nó.</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">commit nhỏ</span><span class="lz-d">Mỗi cái làm một việc; chạy phép kiểm trước mỗi lần.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">git merge origin/main</span><span class="lz-d">Trước khi review — gỡ xung đột trên nhánh của bạn, không phải trên main.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">push + pull request</span><span class="lz-d">Mô tả vì sao; người review đọc, CI chạy các phép kiểm.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">gộp, xoá nhánh</span><span class="lz-d">Quay lại bước 1.</span></div>
</div>

<div class="callout ok">
<p><strong>🧪 Luyện tập (45 phút) — hai người, một kho, trên máy bạn</strong></p>
<ol>
<li>Trong một thư mục trống: <code>git init --bare origin.git</code>, rồi <code>git clone origin.git an</code> và <code>git clone origin.git binh</code>. Trong <code>an</code>, thêm <code>notes.js</code> của bài này, commit và push <code>main</code>.</li>
<li>Trong <code>binh</code>: <code>git pull</code>, tạo <code>feature/sort</code>, đổi dòng <code>return</code> để sắp xếp, commit, push.</li>
<li>Trong <code>an</code>: tạo <code>fix/number</code>, đổi <em>cùng</em> dòng đó để đánh số, commit, gộp vào <code>main</code> và push.</li>
<li>Trong <code>binh</code>: <code>git fetch</code>, <code>git merge origin/main</code> — đọc các dấu xung đột, gỡ để ghi chú vừa sắp xếp vừa đánh số, chạy <code>node notes.js</code>, add, commit, push.</li>
<li>Trong <code>an</code>: gộp <code>origin/feature/sort</code> vào main, push, và chạy <code>git log --oneline --graph</code>.</li>
</ol>
<p>Gợi ý: đặt tên riêng cho mỗi bản sao để commit cho thấy ai làm gì: <code>git config user.name An</code> bên trong <code>an/</code>.</p>
<p><strong>Xong khi:</strong> <code>git log --oneline --graph</code> trong <code>an</code> cho thấy cả hai nhánh đã gộp, không tệp nào còn <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, và <code>node notes.js</code> in ghi chú đã sắp xếp và đánh số. Sau đó làm module Code Lab 10.3.</p>
</div>

<h3>🗂 Thuật ngữ (EN – VI)</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">remote / origin</span><span class="v">kho từ xa / tên mặc định của nó.</span></div>
  <div class="kv"><span class="k">feature branch</span><span class="v">nhánh tính năng.</span></div>
  <div class="kv"><span class="k">upstream (-u)</span><span class="v">nhánh theo dõi trên remote.</span></div>
  <div class="kv"><span class="k">pull request (PR)</span><span class="v">yêu cầu gộp — đề nghị merge nhánh vào main.</span></div>
  <div class="kv"><span class="k">code review</span><span class="v">duyệt mã.</span></div>
  <div class="kv"><span class="k">merge commit</span><span class="v">commit gộp — có hai cha.</span></div>
  <div class="kv"><span class="k">fast-forward / rejected</span><span class="v">tiến thẳng / bị từ chối.</span></div>
  <div class="kv"><span class="k">merge conflict</span><span class="v">xung đột khi gộp.</span></div>
  <div class="kv"><span class="k">ours / theirs</span><span class="v">phía ta / phía họ.</span></div>
  <div class="kv"><span class="k">protected branch</span><span class="v">nhánh được bảo vệ — chỉ đổi qua PR.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
  <li>Một nhánh cho mỗi thay đổi; commit nhỏ với thông điệp nói rõ cái gì và vì sao.</li>
  <li><code>git push -u</code> một lần cho mỗi nhánh; PR = các commit trong <code>main..nhánh</code> + phần khác biệt.</li>
  <li>Push bị từ chối nghĩa là máy chủ có công việc bạn chưa có: pull, kiểm, push — không bao giờ <code>--force</code> lên nhánh dùng chung.</li>
  <li>Merge <code>main</code> vào nhánh của bạn trước khi review; các dòng khác nhau tự gộp.</li>
  <li>Cùng một dòng bị sửa hai lần ⇒ dấu xung đột; quyết định mã đúng, xoá dấu, chạy, add, commit.</li>
  <li><code>git log --oneline --graph</code> cho thấy công việc đã nhập lại ra sao.</li>
</ul>
${nguon('📗', 'Pro Git — Basic Branching and Merging', 'Nhánh, gộp và gỡ xung đột, từ sách Git chính thức', 'https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging')}
${nguon('📘', 'GitHub Docs — About pull requests', 'PR chứa gì, review và các kiểu gộp', 'https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests')}
${lienKet({ khoa: 'git', bai: 'git-3-3-xung-dot', title: 'Git 3.3 — Xung đột khi gộp', sub: 'Mọi loại xung đột, công cụ gộp và cách hoàn tác một lần gộp hỏng', cta: 'Mở bài' })}
</div>
`,
};
