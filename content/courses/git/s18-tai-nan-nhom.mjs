/**
 * Git & GitHub — Chương 18: Tai nạn Git thật của nhóm.
 * 31/10/2026. 18.0 slide (deck git-18) · 18.1–18.7 bài · 18.8 quiz. File này SINH RA từ lab18/_dung/ (xem _BRIEF-CHUONG-18.md) — sửa ở đó.
 * Mọi output terminal in trong bài là output THẬT chạy từ lab18/tao-nhom.sh (git 2.51.1); đường dẫn kho giả lập đã
 * đổi thành /tmp/lab18. Tên người (An, Bình, Chi) và mật khẩu trong dự án mẫu là GIẢ.
 * LUẬT: backtick → &#96;; ${ trong mã mẫu → \${; < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
import { gallery, slide } from './_slides.mjs';

export default {
  title: 'Chapter 18 — Real team accidents: build folders, conflicts, bad merges and the rescue|||Chương 18 — Tai nạn Git thật của nhóm: thư mục build, xung đột, merge hỏng và cách cứu',
  description: 'Những tai nạn Git một nhóm sinh viên làm Java web (NetBeans, Servlet/JSP) gặp thật: lỡ commit build/ và nbproject/private/, xung đột web.xml, PR để lâu, kéo main nhầm chỗ, push bị từ chối, sửa nhầm trên main, tự merge không review, hoàn tác merge. Mỗi lỗi tự tái hiện trong một lab ba người rồi tự sửa, output chạy thật.',
  lessons: [
    /* ─────────────────────────── 18.0 ─────────────────────────── */
    {
      title: '18.0 — Chapter 18 slides: real team accidents, in pictures|||18.0 — Slide Chương 18: tai nạn Git thật của nhóm bằng hình',
      slug: 'git-18-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 17 slide của Chương 18: ba loại tệp NetBeans, vì sao .gitignore thêm sau vô tác dụng, xung đột web.xml, PR để lâu, ba thông báo đồng bộ, main ahead 2, reset hay revert, merge không PR, revert -m 1 và revert cái revert, cách chẩn đoán và bảng tra nhanh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Slides</span>
<h2>Seven real accidents of a three-person Java web team, in 17 slides</h2>
<p class="lead">Chapter 16 sets up a team repository and Chapter 17 (Quick start) gets a group onto GitHub; this chapter is about what goes wrong afterwards. The setting is a NetBeans web project (Servlet/JSP, Ant or Maven) written by three students — An, Bình and Chi — on Windows and Mac. Each accident is reproduced in a lab, then repaired; the slides give the picture, the lessons give every command.</p>
<p>The terminal lines and graphs on the slides come from real runs of the lab (git 2.51.1); the names and the passwords in the sample project are invented. The lab is a script, <code>lab18/tao-nhom.sh</code>; lesson 18.7 pastes a twenty-line starter that is enough to do every exercise by hand, and explains why the full script is not pasted.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Slide</span>
<h2>Bảy tai nạn thật của nhóm ba người làm Java web, trong 17 slide</h2>
<p class="lead">Chương 16 dựng kho cho nhóm và chương Khởi động nhanh đưa cả nhóm lên GitHub; chương này nói về những gì hỏng sau đó. Bối cảnh là một dự án web NetBeans (Servlet/JSP, Ant hoặc Maven) của ba sinh viên — An, Bình và Chi — dùng Windows và Mac. Mỗi tai nạn được tái hiện trong một lab rồi sửa; slide cho hình, bài học cho từng lệnh.</p>
<p>Các dòng terminal và đồ thị trên slide lấy từ các lần chạy thật của lab (git 2.51.1); tên người và mật khẩu trong dự án mẫu là bịa. Lab là một script, <code>lab18/tao-nhom.sh</code>; bài 18.7 dán một bản khởi động hai mươi dòng đủ để tự làm mọi bài tập bằng tay, và giải thích vì sao không dán nguyên script đầy đủ.</p>
</div>
${gallery('git-18', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Ba loại tệp trong dự án NetBeans'], [4, 'Đã theo dõi rồi thì .gitignore vô tác dụng'],
  [5, 'Tệp đã xoá vẫn nằm trong lịch sử — xoay vòng mật khẩu'], [6, 'Hai người cùng chèn vào web.xml'], [7, 'Xoá dấu hiệu xung đột làm hỏng XML'],
  [8, 'PR để lâu: main đi xa dần'], [9, 'git pull = fetch + merge, và ba chỗ nó vấp'], [10, 'Hai người cùng đẩy lên main: lịch sử rẽ đôi'],
  [11, 'main ahead 2: dời việc sang nhánh rồi đưa main về origin/main'], [12, 'reset hay revert: hỏi một câu — commit đã rời máy chưa?'],
  [13, 'Merge không qua PR và merge có rào chắn'], [14, 'Hoàn tác merge: ORIG_HEAD, revert -m 1, và revert cái revert'],
  [15, 'Chẩn đoán năm lệnh, rồi sửa từng lớp'], [16, 'Bảng tra nhanh: triệu chứng → chẩn đoán → cách sửa → cách phòng'], [17, 'Thực hành cả chương'],
])}
`,
    },

    /* ─────────────────────────── 18.1 ─────────────────────────── */
    {
      title: '18.1 — Accident: build/ and nbproject/private/ got committed|||18.1 — Tai nạn: lỡ commit build/ và nbproject/private/',
      slug: 'git-18-1-lo-commit-build',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Tái hiện cả chuỗi: add . sau khi Build, pull của bạn bị chặn, .gitignore thêm sau thì vô tác dụng, git rm --cached, đồng đội mất tệp cấu hình, và tệp đã đẩy lên remote — gồm cả mật khẩu — phải xử lý thế nào.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.1</span>
<h2>"git pull" is blocked, and the repository is full of .class files</h2>
<p class="lead">A NetBeans web project holds three kinds of files: the ones you wrote, the ones the IDE generates, and the ones that only make sense on one laptop. Git should carry only the first kind. When a teammate runs <code>git add .</code> right after pressing Build, all three go into the repository, and two days later somebody cannot pull. This lesson reproduces the accident in a three-person lab, repairs it, and answers the question the repair leaves open: what about the copy already on GitHub?</p>
<p>Everything below was run for real in this chapter's lab (<code>lab18/tao-nhom.sh</code>) with <strong>git version 2.51.1</strong>. The remote is a local bare repository, so <code>/tmp/lab18/github.git</code> stands where you would see <code>https://github.com/…</code>. The people are An, Bình and Chi; the passwords in the sample project are invented. Setting up the team is Quick start's job and general rescue tools are in Chapter 13 — this lesson covers only this one accident.</p>

<h3>The accident, step by step</h3>
${slide('git-18', 3, 'Ba loại tệp trong dự án NetBeans')}
<p>An adds a servlet, presses <em>Clean and Build</em> in NetBeans and runs <code>git status</code>. Three folders appear as untracked. The project's <code>.gitignore</code> only mentions <code>*.log</code> and <code>*.tmp</code>, so nothing stops <code>git add .</code>:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git status --short</code></pre>
<div class="out">?? build/
?? dist/
?? nbproject/private/
?? src/java/com/nhom/servlet/DatLichServlet.java</div>
<pre><code class="language-bash">git add .
git commit -m "Them DatLichServlet"</code></pre>
<div class="out">[main d0decdb] Them DatLichServlet
 7 files changed, 17 insertions(+)
…</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   3ed4562..d0decdb  main -&gt; main</div>
<p>Seven files went in: three compiled <code>.class</code> files, the <code>.war</code>, and two files under <code>nbproject/private/</code>. Bình pulls (a fast-forward, so it works), builds on his own laptop — NetBeans rewrites <code>private.properties</code> with <em>his</em> Tomcat path — and now has local changes to files Git tracks:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git pull</code></pre>
<div class="out">From /tmp/lab18/github
   3ed4562..d0decdb  main       -&gt; origin/main
Updating 3ed4562..d0decdb
Fast-forward
…</div>
<pre><code class="language-bash">git status --short</code></pre>
<div class="out"> M build/web/WEB-INF/classes/com/nhom/servlet/DatLichServlet.class
 M build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class
 M build/web/WEB-INF/classes/com/nhom/servlet/LoginServlet.class
 M dist/QuanLyPhongKham.war
 M nbproject/private/private.properties
 M nbproject/private/private.xml</div>
<p>Then An fixes something, builds again, runs <code>git add .</code> again and pushes. Bình's next <code>git pull</code> is the one that stops:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git add .
git commit -m "DatLichServlet: kiem tra gio trong"</code></pre>
<div class="out">[main 27d21c7] DatLichServlet: kiem tra gio trong
 5 files changed, 1 insertion(+)</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   d0decdb..27d21c7  main -&gt; main</div>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git pull</code></pre>
<div class="out">From /tmp/lab18/github
   d0decdb..27d21c7  main       -&gt; origin/main
error: Your local changes to the following files would be overwritten by merge:
	build/web/WEB-INF/classes/com/nhom/servlet/DatLichServlet.class
	build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class
	build/web/WEB-INF/classes/com/nhom/servlet/LoginServlet.class
	dist/QuanLyPhongKham.war
Please commit your changes or stash them before you merge.
Aborting
Updating d0decdb..27d21c7</div>
<p>The message tells Bình to commit or stash <em>build output</em>. That is the wrong cure: if he commits, his binaries will conflict with An's binaries, and a binary file has no "keep both" answer. The right reading is "these files should not be in the repository at all".</p>

<h3>Why it happens: three kinds of files</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Source — commit</span><span class="v"><code>src/</code>, <code>web/</code>, <code>build.xml</code>, <code>nbproject/project.properties</code>. Everyone needs the same copy.</span></div>
  <div class="kv"><span class="k">Generated — ignore</span><span class="v"><code>build/</code> and <code>dist/</code> (Ant) or <code>target/</code> (Maven). Rebuilt from source in seconds, different on every build, so they conflict all the time.</span></div>
  <div class="kv"><span class="k">Per-machine — ignore</span><span class="v"><code>nbproject/private/</code>: the Tomcat folder on <em>your</em> disk, open files, bookmarks, sometimes a server password. Right on one laptop, wrong on the others.</span></div>
</div>
<p><code>git add .</code> stages everything that is not ignored. Git cannot know which folder is "output"; <code>.gitignore</code> is how the team tells it.</p>

<h3>Fix 1 — and the trap: .gitignore alone does nothing</h3>
${slide('git-18', 4, 'Đã theo dõi rồi thì .gitignore vô tác dụng')}
<p>The instinct is to add the three folders to <code>.gitignore</code>. An does that, builds again, and looks:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git status --short</code></pre>
<div class="out"> M .gitignore
 M build/web/WEB-INF/classes/com/nhom/servlet/DatLichServlet.class
 M build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class
 M build/web/WEB-INF/classes/com/nhom/servlet/LoginServlet.class
 M dist/QuanLyPhongKham.war</div>
<pre><code class="language-bash">git check-ignore -v build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class
git check-ignore -v --no-index build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class</code></pre>
<div class="out">.gitignore:3:build/	build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class</div>
<p>Read the first block: <code>git status</code> still lists <code>build/…</code> and <code>dist/…</code> as <strong>modified</strong> (<code>M</code>) although <code>.gitignore</code> now names them. A pattern in <code>.gitignore</code> applies only to <em>untracked</em> files; once a file is in the index Git keeps tracking it. <code>git check-ignore -v</code> prints nothing by default. With <code>--no-index</code> ("pretend the index is empty") it shows the rule that <em>would</em> match: <code>.gitignore:3:build/</code>.</p>

<h3>Fix 2 — remove from the index, keep on disk</h3>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git rm -r --cached -q build dist nbproject/private
git add .gitignore
git status --short</code></pre>
<div class="out">M  .gitignore
D  build/web/WEB-INF/classes/com/nhom/servlet/DatLichServlet.class
D  build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class
D  build/web/WEB-INF/classes/com/nhom/servlet/LoginServlet.class
D  dist/QuanLyPhongKham.war
D  nbproject/private/private.properties
D  nbproject/private/private.xml</div>
<pre><code class="language-bash">git commit -m "Ngung theo doi build/, dist/, nbproject/private/ + bo sung .gitignore"</code></pre>
<div class="out">[main 4493beb] Ngung theo doi build/, dist/, nbproject/private/ + bo sung .gitignore
 7 files changed, 3 insertions(+), 10 deletions(-)
…</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   27d21c7..4493beb  main -&gt; main</div>
<pre><code class="language-bash">git status --short
git check-ignore -v build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class</code></pre>
<div class="out">.gitignore:3:build/	build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class</div>
<pre><code class="language-bash">git ls-files build dist nbproject</code></pre>
<div class="out">nbproject/project.properties</div>
<p><code>git rm -r --cached</code> removes the files from the <strong>index</strong> only; they stay in the working folder, which is why An's NetBeans keeps working. After the commit, <code>git status</code> is empty (the generated folders are now ignored), <code>check-ignore</code> names the protecting line, and <code>git ls-files</code> shows that only <code>nbproject/project.properties</code> — the shared part — is still tracked. Without <code>--cached</code>, <code>git rm</code> would also delete the files from disk.</p>
<p>The .gitignore to start a NetBeans project with (GitHub keeps a maintained template, linked below):</p>
<pre><code class="language-bash"><span class="tok-comment"># NetBeans — Ant</span>
build/
dist/
nbproject/private/
<span class="tok-comment"># NetBeans — Maven</span>
target/
nbam-nbactions.xml
<span class="tok-comment"># Secrets and local config</span>
.env
db.properties</code></pre>

<h3>What happens to the teammates</h3>
<p>The fix commit <strong>deletes</strong> those files from every teammate's disk when they pull — that is what "removed from the repository" means to <code>git pull</code>. Bình has local changes in them, so he must put them aside first; his build output is regenerable, so he drops it. Chi never built, so her pull is quiet:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git stash push -q -- build dist nbproject/private
git pull</code></pre>
<div class="out">From /tmp/lab18/github
   27d21c7..4493beb  main       -&gt; origin/main
Updating d0decdb..4493beb
Fast-forward
 .gitignore                                               |   3 +++
…
 8 files changed, 4 insertions(+), 10 deletions(-)
…</div>
<pre><code class="language-bash">git stash drop</code></pre>
<div class="out">Dropped refs/stash@{0} (dec4ab9c1dee76f63bd28589b1d42495928e2d00)</div>
<pre><code class="language-bash">git status --short
ls</code></pre>
<div class="out">build.xml
nbproject
src
web</div>
<pre><code class="language-bash">ls nbproject</code></pre>
<div class="out">project.properties
</div>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git pull</code></pre>
<div class="out">From /tmp/lab18/github
   3ed4562..4493beb  main       -&gt; origin/main
Updating 3ed4562..4493beb
Fast-forward
 .gitignore                                    | 3 +++
…
 2 files changed, 11 insertions(+)
 create mode 100644 src/java/com/nhom/servlet/DatLichServlet.java</div>
<p>Look at the last <code>ls nbproject</code>: <code>private/</code> is gone from Bình's disk. NetBeans will recreate it, but his registered Tomcat server was stored there, so NetBeans may ask him to choose the server again. To keep it, copy <code>nbproject/private</code> somewhere outside the project <em>before</em> pulling, and put it back afterwards — it is ignored now, so Git will not mind.</p>

<h3>It is already on GitHub. Now what?</h3>
${slide('git-18', 5, 'Tệp đã xoá vẫn nằm trong lịch sử')}
<p>The fix commit stops the problem from <em>growing</em>. It does not remove the old commits: the files are still in history, and anyone with a clone can read them.</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git log --oneline --all -- nbproject/private/private.properties</code></pre>
<div class="out">4493beb Ngung theo doi build/, dist/, nbproject/private/ + bo sung .gitignore
d0decdb Them DatLichServlet</div>
<pre><code class="language-bash">git log --all --oneline -S Tomcat@FPT2026</code></pre>
<div class="out">4493beb Ngung theo doi build/, dist/, nbproject/private/ + bo sung .gitignore
d0decdb Them DatLichServlet</div>
<pre><code class="language-bash">git grep -n tomcat.manager.password HEAD~1 -- nbproject/private/private.properties</code></pre>
<div class="out">HEAD~1:nbproject/private/private.properties:5:tomcat.manager.password=Tomcat@FPT2026</div>
<p><code>git log -S &lt;text&gt;</code> (the "pickaxe") lists every commit where that text was added or removed, and <code>git grep &lt;text&gt; HEAD~1</code> prints the line from the old version. The password is one command away for anybody. Decide by <em>what leaked</em>:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Only binaries and paths</span><span class="v"><code>.class</code>, <code>.war</code>, <code>C:\\Users\\An\\…</code>. Ugly and a little heavy, harmless. Do <strong>not</strong> rewrite history for this; the team's time is worth more than a few hundred KB.</span></div>
  <div class="kv"><span class="k">A password, token, API key, connection string</span><span class="v"><strong>Treat it as stolen.</strong> Rotate it first: change the Tomcat manager password, revoke the key, issue a new one. Deleting the file does not un-leak it.</span></div>
  <div class="kv"><span class="k">After rotating</span><span class="v">The old value is dead, so rewriting history is optional. If the team still wants it gone: <code>git filter-repo</code>, then a force-push — with everybody's agreement and a fresh clone for everybody (Chapter 8 and Chapter 13).</span></div>
</div>
<p>GitHub's own guide says the same order (as of 10/2026): <em>"as a first step you need to revoke and/or rotate that secret"</em>; copies can survive in forks and in cached views of pull requests; and old clones can bring the secret back with a plain pull and push, so collaborators should re-clone after a rewrite. In a private student repository the audience is small, but a Tomcat manager password is often reused for a database or a cloud VM — rotate every place it is used.</p>

<h3>Prevent it</h3>
<ul>
<li><strong>First commit of the project = .gitignore.</strong> Create it before the first <code>git add</code>, from the template above.</li>
<li><strong>Look before you commit.</strong> <code>git status</code> and <code>git diff --cached --stat</code>. Seven files in a commit titled "Add one servlet" is the alarm. <code>git add -n .</code> (dry run) lists what would be staged without staging it.</li>
<li><strong>Stage by path</strong> (<code>git add src web</code>) in a NetBeans project, not by dot.</li>
<li><strong>Rule for the team:</strong> a pull request that touches <code>build/</code>, <code>dist/</code>, <code>target/</code> or <code>nbproject/private/</code> is closed, not reviewed.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>In the <code>thu-git</code> sandbox make a shared remote and two clones: <code>git init --bare remote.git</code>, then <code>git clone remote.git an</code> and <code>git clone remote.git binh</code> (set <code>user.name</code> and <code>user.email</code> inside each clone).</li>
<li>In <code>an</code>: create <code>src/Hello.java</code>, <code>build/Hello.class</code> and <code>nbproject/private/private.properties</code> (put the line <code>password=demo-only</code> in it). Run <code>git add .</code>, commit, push.</li>
<li>In <code>binh</code>: <code>git pull</code>, then change <code>build/Hello.class</code> locally. In <code>an</code>: change the same file, commit with <code>git commit -am</code>, push. In <code>binh</code>: <code>git pull</code> and copy the error you get.</li>
<li>Repair it in <code>an</code>: add the three ignore rules, show that <code>git status</code> still lists the tracked file, then <code>git rm -r --cached build nbproject/private</code>, commit, push. Make <code>binh</code> catch up without losing his work on <code>src/</code>.</li>
<li>Prove the leak: run <code>git log --all --oneline -S demo-only</code> and write down which password you would have to rotate.</li>
</ol>
<p><strong>Done when:</strong> (a) <code>git ls-files</code> in both clones lists no file under <code>build/</code> or <code>nbproject/private/</code>; (b) <code>git check-ignore -v build/Hello.class</code> prints a <code>.gitignore</code> line; (c) the pickaxe command lists two commits; (d) both clones pull without error.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">tracked / untracked</span><span class="v">Tracked files are in the index and in history; untracked ones Git has never been told about. Only untracked files can be ignored.</span></div>
  <div class="kv"><span class="k">.gitignore</span><span class="v">A list of patterns for files Git must not start tracking. It never un-tracks a file already in the index.</span></div>
  <div class="kv"><span class="k">git rm --cached</span><span class="v">Remove a file from the index only (stop tracking it) and leave it on disk.</span></div>
  <div class="kv"><span class="k">build output</span><span class="v">Files produced by compiling: <code>build/</code>, <code>dist/</code>, <code>target/</code>, <code>.class</code>, <code>.war</code>. Regenerable, so never committed.</span></div>
  <div class="kv"><span class="k">pickaxe (git log -S)</span><span class="v">Search history for the commits that added or removed a given string.</span></div>
  <div class="kv"><span class="k">rotate a secret</span><span class="v">Replace a leaked password or key with a new one and invalidate the old one at the service itself.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Source gets committed; generated output and per-machine settings get ignored — and the <code>.gitignore</code> must exist <em>before</em> the first <code>git add .</code>.</li><li>A rule in <code>.gitignore</code> does nothing to files already tracked: use <code>git rm -r --cached</code>, then commit.</li><li>Teammates lose those files from disk when they pull the fix; copy anything you need first.</li><li>A removed file is still in history. Binaries are harmless; a leaked password must be <em>rotated</em>, not just deleted.</li><li>Check <code>git status</code> and <code>git diff --cached --stat</code> before every commit.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/gitignore" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">git-scm — gitignore</span><span class="lc-sub">Pattern syntax and the rule that tracked files are not affected.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/get-started/git-basics/ignoring-files" target="_blank" rel="noopener">
  <span class="lc-ico">🙈</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Ignoring files</span><span class="lc-sub">Including how to stop tracking a file that was already committed.</span></span>
</a>
<a class="link-card" href="https://github.com/github/gitignore/blob/main/Global/NetBeans.gitignore" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">github/gitignore — NetBeans.gitignore</span><span class="lc-sub">The maintained template for NetBeans projects.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Removing sensitive data from a repository</span><span class="lc-sub">Rotate first, then git filter-repo; what stays in forks and cached views.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>How this goes wrong in a student team project.</strong> <b>"I deleted the file, so the password is gone."</b> It is in two commits and on GitHub. Rotate it. <b>Adding <code>build/</code> to .gitignore and expecting the folder to vanish from the repository.</b> Nothing changes until <code>git rm -r --cached</code>. <b>Fixing it by running <code>git rm -r build</code> (without <code>--cached</code>)</b> and deleting everybody's working output. <b>Rewriting history with a force-push to get rid of seven small files</b>, and breaking three teammates' clones for no gain.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.1</span>
<h2>"git pull" bị chặn, còn kho thì đầy tệp .class</h2>
<p class="lead">Một dự án web NetBeans có ba loại tệp: tệp bạn tự viết, tệp IDE sinh ra, và tệp chỉ có nghĩa trên đúng một laptop. Git chỉ nên mang loại thứ nhất. Khi một bạn gõ <code>git add .</code> ngay sau khi bấm Build, cả ba loại cùng vào kho, và hai ngày sau có người không pull được nữa. Bài này tái hiện tai nạn đó trong lab ba người, sửa nó, rồi trả lời câu hỏi mà cách sửa để ngỏ: còn bản đã nằm trên GitHub thì sao?</p>
<p>Mọi output bên dưới được chạy thật trong lab của chương (<code>lab18/tao-nhom.sh</code>) với <strong>git version 2.51.1</strong>. Remote là một kho bare (kho trần, chỉ chứa lịch sử) trên máy, nên <code>/tmp/lab18/github.git</code> đứng ở chỗ bạn sẽ thấy <code>https://github.com/…</code>. Ba người là An, Bình, Chi; mật khẩu trong dự án mẫu là bịa. Dựng nhóm là việc của chương Khởi động nhanh, công cụ cứu hộ chung nằm ở Chương 13 — bài này chỉ nói đúng một tai nạn.</p>

<h3>Tai nạn, từng bước</h3>
${slide('git-18', 3, 'Ba loại tệp trong dự án NetBeans')}
<p>An thêm một servlet, bấm <em>Clean and Build</em> trong NetBeans rồi chạy <code>git status</code>. Ba thư mục hiện ra dạng chưa theo dõi (untracked). <code>.gitignore</code> của dự án chỉ có <code>*.log</code> và <code>*.tmp</code>, nên không gì cản được <code>git add .</code>:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git status --short</code></pre>
<div class="out">?? build/
?? dist/
?? nbproject/private/
?? src/java/com/nhom/servlet/DatLichServlet.java</div>
<pre><code class="language-bash">git add .
git commit -m "Them DatLichServlet"</code></pre>
<div class="out">[main d0decdb] Them DatLichServlet
 7 files changed, 17 insertions(+)
…</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   3ed4562..d0decdb  main -&gt; main</div>
<p>Bảy tệp đã vào: ba tệp <code>.class</code> đã biên dịch, tệp <code>.war</code>, và hai tệp trong <code>nbproject/private/</code>. Bình pull (tua thẳng — fast-forward — nên chạy được), build trên laptop của mình — NetBeans viết lại <code>private.properties</code> bằng đường dẫn Tomcat của <em>Bình</em> — và giờ Bình có thay đổi cục bộ ở những tệp Git đang theo dõi:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git pull</code></pre>
<div class="out">From /tmp/lab18/github
   3ed4562..d0decdb  main       -&gt; origin/main
Updating 3ed4562..d0decdb
Fast-forward
…</div>
<pre><code class="language-bash">git status --short</code></pre>
<div class="out"> M build/web/WEB-INF/classes/com/nhom/servlet/DatLichServlet.class
 M build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class
 M build/web/WEB-INF/classes/com/nhom/servlet/LoginServlet.class
 M dist/QuanLyPhongKham.war
 M nbproject/private/private.properties
 M nbproject/private/private.xml</div>
<p>Rồi An sửa tiếp, build lại, lại <code>git add .</code> và push. Lần <code>git pull</code> kế của Bình thì dừng:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git add .
git commit -m "DatLichServlet: kiem tra gio trong"</code></pre>
<div class="out">[main 27d21c7] DatLichServlet: kiem tra gio trong
 5 files changed, 1 insertion(+)</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   d0decdb..27d21c7  main -&gt; main</div>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git pull</code></pre>
<div class="out">From /tmp/lab18/github
   d0decdb..27d21c7  main       -&gt; origin/main
error: Your local changes to the following files would be overwritten by merge:
	build/web/WEB-INF/classes/com/nhom/servlet/DatLichServlet.class
	build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class
	build/web/WEB-INF/classes/com/nhom/servlet/LoginServlet.class
	dist/QuanLyPhongKham.war
Please commit your changes or stash them before you merge.
Aborting
Updating d0decdb..27d21c7</div>
<p>Thông báo bảo Bình commit hoặc stash (cất tạm) <em>sản phẩm build</em>. Đó là thuốc sai: nếu Bình commit, tệp nhị phân của bạn ấy sẽ xung đột với tệp nhị phân của An, mà tệp nhị phân không có kiểu "giữ cả hai". Cách đọc đúng là: "những tệp này không nên nằm trong kho".</p>

<h3>Vì sao xảy ra: ba loại tệp</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Mã nguồn — commit</span><span class="v"><code>src/</code>, <code>web/</code>, <code>build.xml</code>, <code>nbproject/project.properties</code>. Ai cũng cần cùng một bản.</span></div>
  <div class="kv"><span class="k">Sinh ra — bỏ qua</span><span class="v"><code>build/</code> và <code>dist/</code> (Ant) hoặc <code>target/</code> (Maven). Dựng lại từ mã nguồn trong vài giây, mỗi lần build một khác, nên xung đột liên tục.</span></div>
  <div class="kv"><span class="k">Riêng từng máy — bỏ qua</span><span class="v"><code>nbproject/private/</code>: thư mục Tomcat trên đĩa của <em>bạn</em>, tệp đang mở, bookmark, đôi khi mật khẩu máy chủ. Đúng trên một laptop, sai trên các máy khác.</span></div>
</div>
<p><code>git add .</code> đưa vào index mọi thứ chưa bị bỏ qua. Git không biết thư mục nào là "sản phẩm"; <code>.gitignore</code> là cách cả nhóm nói cho nó biết.</p>

<h3>Sửa 1 — và cái bẫy: chỉ thêm .gitignore thì vô tác dụng</h3>
${slide('git-18', 4, 'Đã theo dõi rồi thì .gitignore vô tác dụng')}
<p>Phản xạ là thêm ba thư mục vào <code>.gitignore</code>. An làm vậy, build lại, và xem:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git status --short</code></pre>
<div class="out"> M .gitignore
 M build/web/WEB-INF/classes/com/nhom/servlet/DatLichServlet.class
 M build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class
 M build/web/WEB-INF/classes/com/nhom/servlet/LoginServlet.class
 M dist/QuanLyPhongKham.war</div>
<pre><code class="language-bash">git check-ignore -v build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class
git check-ignore -v --no-index build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class</code></pre>
<div class="out">.gitignore:3:build/	build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class</div>
<p>Đọc khối đầu: <code>git status</code> vẫn liệt kê <code>build/…</code> và <code>dist/…</code> là <strong>đã sửa</strong> (<code>M</code>) dù <code>.gitignore</code> đã ghi tên chúng. Một mẫu trong <code>.gitignore</code> chỉ áp dụng cho tệp <em>chưa theo dõi</em>; tệp đã nằm trong index thì Git cứ theo dõi tiếp. <code>git check-ignore -v</code> mặc định không in gì. Thêm <code>--no-index</code> ("coi như index trống") thì nó chỉ ra luật <em>sẽ</em> khớp: <code>.gitignore:3:build/</code>.</p>

<h3>Sửa 2 — gỡ khỏi index, giữ trên đĩa</h3>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git rm -r --cached -q build dist nbproject/private
git add .gitignore
git status --short</code></pre>
<div class="out">M  .gitignore
D  build/web/WEB-INF/classes/com/nhom/servlet/DatLichServlet.class
D  build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class
D  build/web/WEB-INF/classes/com/nhom/servlet/LoginServlet.class
D  dist/QuanLyPhongKham.war
D  nbproject/private/private.properties
D  nbproject/private/private.xml</div>
<pre><code class="language-bash">git commit -m "Ngung theo doi build/, dist/, nbproject/private/ + bo sung .gitignore"</code></pre>
<div class="out">[main 4493beb] Ngung theo doi build/, dist/, nbproject/private/ + bo sung .gitignore
 7 files changed, 3 insertions(+), 10 deletions(-)
…</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   27d21c7..4493beb  main -&gt; main</div>
<pre><code class="language-bash">git status --short
git check-ignore -v build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class</code></pre>
<div class="out">.gitignore:3:build/	build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class</div>
<pre><code class="language-bash">git ls-files build dist nbproject</code></pre>
<div class="out">nbproject/project.properties</div>
<p><code>git rm -r --cached</code> chỉ gỡ tệp khỏi <strong>index</strong>; tệp vẫn nằm trong thư mục làm việc, nên NetBeans của An vẫn chạy. Sau commit, <code>git status</code> trống (thư mục sinh ra giờ bị bỏ qua), <code>check-ignore</code> chỉ đúng dòng đang bảo vệ, và <code>git ls-files</code> cho thấy chỉ còn <code>nbproject/project.properties</code> — phần dùng chung — được theo dõi. Thiếu <code>--cached</code> thì <code>git rm</code> xoá luôn tệp khỏi đĩa.</p>
<p>.gitignore nên có ngay từ đầu cho dự án NetBeans (GitHub giữ một mẫu được bảo trì, link ở dưới):</p>
<pre><code class="language-bash"><span class="tok-comment"># NetBeans — Ant</span>
build/
dist/
nbproject/private/
<span class="tok-comment"># NetBeans — Maven</span>
target/
nbam-nbactions.xml
<span class="tok-comment"># Bí mật và cấu hình riêng</span>
.env
db.properties</code></pre>

<h3>Đồng đội chịu gì</h3>
<p>Commit sửa lỗi <strong>xoá</strong> những tệp đó khỏi đĩa của mọi bạn khi họ pull — với <code>git pull</code>, "gỡ khỏi kho" nghĩa là vậy. Bình đang có thay đổi trong đó nên phải cất sang một bên trước; sản phẩm build dựng lại được nên bạn ấy bỏ luôn. Chi chưa từng build nên pull êm:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git stash push -q -- build dist nbproject/private
git pull</code></pre>
<div class="out">From /tmp/lab18/github
   27d21c7..4493beb  main       -&gt; origin/main
Updating d0decdb..4493beb
Fast-forward
 .gitignore                                               |   3 +++
…
 8 files changed, 4 insertions(+), 10 deletions(-)
…</div>
<pre><code class="language-bash">git stash drop</code></pre>
<div class="out">Dropped refs/stash@{0} (dec4ab9c1dee76f63bd28589b1d42495928e2d00)</div>
<pre><code class="language-bash">git status --short
ls</code></pre>
<div class="out">build.xml
nbproject
src
web</div>
<pre><code class="language-bash">ls nbproject</code></pre>
<div class="out">project.properties
</div>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git pull</code></pre>
<div class="out">From /tmp/lab18/github
   3ed4562..4493beb  main       -&gt; origin/main
Updating 3ed4562..4493beb
Fast-forward
 .gitignore                                    | 3 +++
…
 2 files changed, 11 insertions(+)
 create mode 100644 src/java/com/nhom/servlet/DatLichServlet.java</div>
<p>Nhìn dòng <code>ls nbproject</code> cuối cùng: <code>private/</code> biến khỏi đĩa của Bình. NetBeans sẽ tạo lại, nhưng máy chủ Tomcat đã đăng ký của bạn ấy nằm trong đó, nên NetBeans có thể hỏi chọn lại server. Muốn giữ, hãy chép <code>nbproject/private</code> ra ngoài dự án <em>trước</em> khi pull rồi chép về sau — giờ nó bị bỏ qua nên Git không phản đối.</p>

<h3>Nó đã nằm trên GitHub. Làm gì?</h3>
${slide('git-18', 5, 'Tệp đã xoá vẫn nằm trong lịch sử')}
<p>Commit sửa chỉ chặn vấn đề <em>lớn thêm</em>. Nó không xoá các commit cũ: tệp vẫn nằm trong lịch sử, ai có bản clone cũng đọc được.</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git log --oneline --all -- nbproject/private/private.properties</code></pre>
<div class="out">4493beb Ngung theo doi build/, dist/, nbproject/private/ + bo sung .gitignore
d0decdb Them DatLichServlet</div>
<pre><code class="language-bash">git log --all --oneline -S Tomcat@FPT2026</code></pre>
<div class="out">4493beb Ngung theo doi build/, dist/, nbproject/private/ + bo sung .gitignore
d0decdb Them DatLichServlet</div>
<pre><code class="language-bash">git grep -n tomcat.manager.password HEAD~1 -- nbproject/private/private.properties</code></pre>
<div class="out">HEAD~1:nbproject/private/private.properties:5:tomcat.manager.password=Tomcat@FPT2026</div>
<p><code>git log -S &lt;chuỗi&gt;</code> ("pickaxe", cái cuốc chim) liệt kê mọi commit từng thêm hoặc xoá chuỗi đó, còn <code>git grep &lt;chuỗi&gt; HEAD~1</code> in dòng từ bản cũ. Mật khẩu nằm cách ai đó đúng một lệnh. Quyết định theo <em>thứ đã lộ</em>:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Chỉ nhị phân và đường dẫn</span><span class="v"><code>.class</code>, <code>.war</code>, <code>C:\\Users\\An\\…</code>. Xấu và hơi nặng, nhưng vô hại. <strong>Đừng</strong> viết lại lịch sử vì chuyện này; thời gian của nhóm đắt hơn vài trăm KB.</span></div>
  <div class="kv"><span class="k">Mật khẩu, token, khoá API, chuỗi kết nối</span><span class="v"><strong>Coi như đã bị lấy.</strong> Xoay vòng (rotate) trước: đổi mật khẩu Tomcat manager, thu hồi khoá, cấp khoá mới. Xoá tệp không làm nó hết lộ.</span></div>
  <div class="kv"><span class="k">Sau khi đã xoay vòng</span><span class="v">Giá trị cũ đã chết nên viết lại lịch sử là tuỳ chọn. Nếu nhóm vẫn muốn xoá sạch: <code>git filter-repo</code>, rồi force-push — khi cả nhóm đồng ý và mọi người clone lại bản mới (Chương 8 và Chương 13).</span></div>
</div>
<p>Hướng dẫn của chính GitHub cũng đi theo thứ tự đó (tính đến 10/2026): <em>"as a first step you need to revoke and/or rotate that secret"</em> (bước đầu tiên là thu hồi/xoay vòng bí mật); bản sao có thể còn trong fork và trong bản xem lưu đệm của pull request; và bản clone cũ có thể mang bí mật quay lại chỉ bằng một lần pull rồi push, nên sau khi viết lại lịch sử mọi người phải clone lại. Kho riêng của sinh viên thì người xem ít, nhưng mật khẩu Tomcat manager thường bị dùng lại cho database hay máy ảo — hãy xoay vòng ở MỌI nơi nó được dùng.</p>

<h3>Phòng ngừa</h3>
<ul>
<li><strong>Commit đầu tiên của dự án = .gitignore.</strong> Tạo nó trước lần <code>git add</code> đầu tiên, từ mẫu ở trên.</li>
<li><strong>Nhìn trước khi commit.</strong> <code>git status</code> và <code>git diff --cached --stat</code>. Bảy tệp trong một commit tên "Them 1 servlet" là tín hiệu báo động. <code>git add -n .</code> (chạy thử) liệt kê tệp sẽ vào index mà không đưa vào.</li>
<li><strong>Add theo đường dẫn</strong> (<code>git add src web</code>) trong dự án NetBeans, đừng add theo dấu chấm.</li>
<li><strong>Luật nhóm:</strong> pull request đụng tới <code>build/</code>, <code>dist/</code>, <code>target/</code> hoặc <code>nbproject/private/</code> thì đóng lại, không review.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong kho sân tập <code>thu-git</code>, dựng một remote chung và hai bản clone: <code>git init --bare remote.git</code>, rồi <code>git clone remote.git an</code> và <code>git clone remote.git binh</code> (đặt <code>user.name</code>, <code>user.email</code> riêng trong từng clone).</li>
<li>Trong <code>an</code>: tạo <code>src/Hello.java</code>, <code>build/Hello.class</code> và <code>nbproject/private/private.properties</code> (ghi dòng <code>password=demo-only</code>). Chạy <code>git add .</code>, commit, push.</li>
<li>Trong <code>binh</code>: <code>git pull</code>, rồi sửa <code>build/Hello.class</code> cục bộ. Trong <code>an</code>: sửa đúng tệp đó, <code>git commit -am</code>, push. Trong <code>binh</code>: <code>git pull</code> và chép lại lỗi nhận được.</li>
<li>Sửa trong <code>an</code>: thêm ba luật bỏ qua, cho thấy <code>git status</code> vẫn liệt kê tệp đã theo dõi, rồi <code>git rm -r --cached build nbproject/private</code>, commit, push. Giúp <code>binh</code> bắt kịp mà không mất việc đang làm trong <code>src/</code>.</li>
<li>Chứng minh sự rò rỉ: chạy <code>git log --all --oneline -S demo-only</code> và ghi ra mật khẩu nào bạn sẽ phải xoay vòng.</li>
</ol>
<p><strong>Đạt khi:</strong> (a) <code>git ls-files</code> ở cả hai clone không còn tệp nào dưới <code>build/</code> hay <code>nbproject/private/</code>; (b) <code>git check-ignore -v build/Hello.class</code> in ra một dòng của <code>.gitignore</code>; (c) lệnh pickaxe liệt kê hai commit; (d) cả hai clone pull không lỗi.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">tracked / untracked</span><span class="v">Đã theo dõi / chưa theo dõi. Tệp đã theo dõi nằm trong index và lịch sử; tệp chưa theo dõi là thứ Git chưa được báo. Chỉ tệp chưa theo dõi mới bị .gitignore bỏ qua.</span></div>
  <div class="kv"><span class="k">.gitignore</span><span class="v">Danh sách mẫu cho tệp Git không được bắt đầu theo dõi. Nó không bao giờ gỡ một tệp đã nằm trong index.</span></div>
  <div class="kv"><span class="k">git rm --cached</span><span class="v">Gỡ tệp khỏi index (ngừng theo dõi) nhưng để nguyên trên đĩa.</span></div>
  <div class="kv"><span class="k">build output</span><span class="v">Sản phẩm biên dịch: <code>build/</code>, <code>dist/</code>, <code>target/</code>, <code>.class</code>, <code>.war</code>. Dựng lại được, nên không bao giờ commit.</span></div>
  <div class="kv"><span class="k">pickaxe (git log -S)</span><span class="v">Tìm trong lịch sử các commit từng thêm hoặc xoá một chuỗi cho trước.</span></div>
  <div class="kv"><span class="k">rotate a secret</span><span class="v">Xoay vòng bí mật: thay mật khẩu/khoá bị lộ bằng cái mới và vô hiệu cái cũ ngay tại dịch vụ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Mã nguồn thì commit; sản phẩm sinh ra và cấu hình riêng từng máy thì bỏ qua — và <code>.gitignore</code> phải có <em>trước</em> lần <code>git add .</code> đầu tiên.</li><li>Một luật trong <code>.gitignore</code> không làm gì với tệp đã theo dõi: dùng <code>git rm -r --cached</code> rồi commit.</li><li>Đồng đội mất những tệp đó khỏi đĩa khi pull bản sửa; cần gì thì chép ra trước.</li><li>Tệp đã xoá vẫn nằm trong lịch sử. Nhị phân thì vô hại; mật khẩu bị lộ phải được <em>xoay vòng</em>, không chỉ xoá.</li><li>Nhìn <code>git status</code> và <code>git diff --cached --stat</code> trước mỗi commit.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/gitignore" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">git-scm — gitignore</span><span class="lc-sub">Cú pháp mẫu, và luật rằng tệp đã theo dõi không bị ảnh hưởng.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/get-started/git-basics/ignoring-files" target="_blank" rel="noopener">
  <span class="lc-ico">🙈</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Ignoring files</span><span class="lc-sub">Gồm cách ngừng theo dõi một tệp đã lỡ commit.</span></span>
</a>
<a class="link-card" href="https://github.com/github/gitignore/blob/main/Global/NetBeans.gitignore" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">github/gitignore — NetBeans.gitignore</span><span class="lc-sub">Mẫu được bảo trì cho dự án NetBeans.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Removing sensitive data from a repository</span><span class="lc-sub">Xoay vòng trước, rồi git filter-repo; thứ còn lại trong fork và bản lưu đệm.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Chuyện này hỏng thế nào trong đồ án nhóm.</strong> <b>"Mình xoá tệp rồi nên mật khẩu hết lộ."</b> Nó nằm trong hai commit và trên GitHub. Hãy xoay vòng. <b>Thêm <code>build/</code> vào .gitignore rồi chờ thư mục tự biến khỏi kho.</b> Không gì đổi cho tới khi có <code>git rm -r --cached</code>. <b>Sửa bằng <code>git rm -r build</code> (thiếu <code>--cached</code>)</b> và xoá luôn sản phẩm build trên đĩa của mọi người. <b>Viết lại lịch sử bằng force-push chỉ để dọn bảy tệp nhỏ</b>, làm hỏng clone của ba bạn mà không được gì.</div>
</div>
`,
    },

    /* ─────────────────────────── 18.2 ─────────────────────────── */
    {
      title: '18.2 — Accident: web.xml conflicts and the pull request that waited too long|||18.2 — Tai nạn: xung đột web.xml và pull request để lâu',
      slug: 'git-18-2-xung-dot-web-xml',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hai bạn cùng khai báo servlet vào web.xml: xem trước xung đột bằng merge-tree, đọc vùng xung đột, cái bẫy xoá dấu hiệu làm hỏng XML, cách giải đúng, và vì sao PR để vài ngày làm xung đột càng đắt.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.2</span>
<h2>Two people edit web.xml, and one pull request sits for days</h2>
<p class="lead">Some files belong to everybody: <code>web.xml</code>, the project's <code>pom.xml</code>, a shared CSS file, a menu <code>.jsp</code>. Each new feature touches them in the same place, so the first merge is easy and the second one conflicts. The conflict is not a mistake — it is Git asking a human to decide. This lesson shows how to see it coming, how to read it, the one "obvious" fix that silently breaks the file, and why a pull request left open for a week turns a small conflict into a large one.</p>
<p>Outputs are from this chapter's lab (<code>lab18/tao-nhom.sh</code>), <strong>git version 2.51.1</strong>, remote at <code>/tmp/lab18/github.git</code>. Chapter 3 teaches the mechanics of conflicts and Chapter 6 the pull request itself; here we only deal with the shared-file accident.</p>

<h3>The setup: two branches, two servlets, one file</h3>
${slide('git-18', 6, 'Hai người cùng chèn vào web.xml')}
<p>An and Bình branch from the same <code>main</code>. An adds <code>DatLichServlet</code> and registers it in <code>web.xml</code>; Bình adds <code>TraCuuServlet</code> and registers it in the same file, in the same place — just before <code>&lt;session-config&gt;</code>, where everybody pastes. Both push their branches and open pull requests:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git switch -c feature/dat-lich</code></pre>
<div class="out">Switched to a new branch 'feature/dat-lich'</div>
<pre><code class="language-bash">git add -A
git commit -m "Them DatLichServlet va khai bao web.xml"</code></pre>
<div class="out">[feature/dat-lich cf533ac] Them DatLichServlet va khai bao web.xml
 2 files changed, 10 insertions(+)
…</div>
<pre><code class="language-bash">git push -u origin feature/dat-lich</code></pre>
<div class="out">To /tmp/lab18/github.git
 * [new branch]      feature/dat-lich -&gt; feature/dat-lich
branch 'feature/dat-lich' set up to track 'origin/feature/dat-lich'.</div>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git switch -c feature/tra-cuu</code></pre>
<div class="out">Switched to a new branch 'feature/tra-cuu'</div>
<pre><code class="language-bash">git add -A
git commit -m "Them TraCuuServlet va khai bao web.xml"</code></pre>
<div class="out">[feature/tra-cuu 86db42b] Them TraCuuServlet va khai bao web.xml
 2 files changed, 10 insertions(+)
…</div>
<pre><code class="language-bash">git push -u origin feature/tra-cuu</code></pre>
<div class="out">To /tmp/lab18/github.git
 * [new branch]      feature/tra-cuu -&gt; feature/tra-cuu
branch 'feature/tra-cuu' set up to track 'origin/feature/tra-cuu'.</div>
<p>The team accepts An's pull request first. (The lab simulates GitHub's <em>Merge pull request</em> button with <code>git merge --no-ff</code> in An's clone.) Bình's pull request now waits.</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git switch main</code></pre>
<div class="out">Switched to branch 'main'
Your branch is up to date with 'origin/main'.</div>
<pre><code class="language-bash">git merge --no-ff feature/dat-lich -m "Merge pull request #1 from an/dat-lich"</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 src/java/com/nhom/servlet/DatLichServlet.java | 2 ++
 web/WEB-INF/web.xml                           | 8 ++++++++
 2 files changed, 10 insertions(+)
 create mode 100644 src/java/com/nhom/servlet/DatLichServlet.java</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   935c46b..78bd742  main -&gt; main</div>

<h3>See it coming, before it hurts</h3>
${slide('git-18', 8, 'PR để lâu: main đi xa dần')}
<p>A few read-only commands tell Bình how far his branch has drifted and whether the merge will conflict — without touching his working folder:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git fetch origin</code></pre>
<div class="out">From /tmp/lab18/github
 * [new branch]      feature/dat-lich -&gt; origin/feature/dat-lich
   935c46b..78bd742  main             -&gt; origin/main</div>
<pre><code class="language-bash">git rev-list --left-right --count feature/tra-cuu...origin/main</code></pre>
<div class="out">1	2</div>
<pre><code class="language-bash">git log --oneline feature/tra-cuu..origin/main -- web/WEB-INF/web.xml</code></pre>
<div class="out">cf533ac Them DatLichServlet va khai bao web.xml</div>
<pre><code class="language-bash">git diff --stat feature/tra-cuu...origin/main</code></pre>
<div class="out"> src/java/com/nhom/servlet/DatLichServlet.java | 2 ++
 web/WEB-INF/web.xml                           | 8 ++++++++
 2 files changed, 10 insertions(+)</div>
<pre><code class="language-bash">git merge-tree --write-tree --name-only feature/tra-cuu origin/main</code></pre>
<div class="out">1b7b5b5a34e6e8a599f31b2fbf3904a412d25916
web/WEB-INF/web.xml

Auto-merging web/WEB-INF/web.xml
CONFLICT (content): Merge conflict in web/WEB-INF/web.xml</div>
<div class="kv-grid">
  <div class="kv"><span class="k">rev-list --left-right --count</span><span class="v"><code>1  2</code>: the branch has 1 commit main lacks, main has 2 commits the branch lacks (An's commit and the merge commit). The number grows every day the pull request waits.</span></div>
  <div class="kv"><span class="k">log … -- web/WEB-INF/web.xml</span><span class="v">Which of main's new commits touched the file you also touched. One line here is a conflict waiting to happen.</span></div>
  <div class="kv"><span class="k">merge-tree --write-tree --name-only</span><span class="v">A dry run of the merge (Git 2.38 or newer): it prints the result's tree id, then the files that would conflict. It changes nothing in your folder.</span></div>
</div>

<h3>Reading the conflict</h3>
<p>Bình brings <code>main</code> into his branch — the safe direction: he fixes the problem on <em>his</em> branch, not on the shared one:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git merge origin/main</code></pre>
<div class="out">Auto-merging web/WEB-INF/web.xml
CONFLICT (content): Merge conflict in web/WEB-INF/web.xml
Automatic merge failed; fix conflicts and then commit the result.</div>
<pre><code class="language-bash">git status --short</code></pre>
<div class="out">A  src/java/com/nhom/servlet/DatLichServlet.java
UU web/WEB-INF/web.xml</div>
<pre><code class="language-bash">git diff</code></pre>
<div class="out">diff --cc web/WEB-INF/web.xml
index c4ab960,019b86a..0000000
--- a/web/WEB-INF/web.xml
+++ b/web/WEB-INF/web.xml
@@@ -17,12 -17,12 +17,21 @@@
          &lt;url-pattern&gt;/home&lt;/url-pattern&gt;
      &lt;/servlet-mapping&gt;
      &lt;servlet&gt;
++&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
 +        &lt;servlet-name&gt;TraCuuServlet&lt;/servlet-name&gt;
 +        &lt;servlet-class&gt;com.nhom.servlet.TraCuuServlet&lt;/servlet-class&gt;
 +    &lt;/servlet&gt;
 +    &lt;servlet-mapping&gt;
 +        &lt;servlet-name&gt;TraCuuServlet&lt;/servlet-name&gt;
 +        &lt;url-pattern&gt;/tra-cuu&lt;/url-pattern&gt;
++=======
+         &lt;servlet-name&gt;DatLichServlet&lt;/servlet-name&gt;
+         &lt;servlet-class&gt;com.nhom.servlet.DatLichServlet&lt;/servlet-class&gt;
+     &lt;/servlet&gt;
+     &lt;servlet-mapping&gt;
+         &lt;servlet-name&gt;DatLichServlet&lt;/servlet-name&gt;
+         &lt;url-pattern&gt;/dat-lich&lt;/url-pattern&gt;
++&gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main
      &lt;/servlet-mapping&gt;
      &lt;session-config&gt;
          &lt;session-timeout&gt;30&lt;/session-timeout&gt;</div>
<p><code>UU</code> means "unmerged, both sides modified". Between <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> and <code>=======</code> is Bình's version; between <code>=======</code> and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main</code> is An's. Both are wanted. Notice <em>where</em> Git cut: the shared lines (<code>&lt;/servlet-mapping&gt;</code>, the closing of a block) are <strong>outside</strong> the markers, because they are identical on both sides. Each side's block starts right after a shared <code>&lt;servlet&gt;</code> and stops right before a shared <code>&lt;/servlet-mapping&gt;</code> — a hunk that begins and ends in the middle of an XML element.</p>

<h3>The trap: delete the three marker lines and keep everything</h3>
<p>The obvious fix is to delete the lines starting with <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code> and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> (in an editor, or with <code>sed -e '/^&lt;&lt;&lt;&lt;&lt;&lt;&lt; /d' -e '/^=======$/d' -e '/^&gt;&gt;&gt;&gt;&gt;&gt;&gt; /d'</code>). Git is satisfied — no markers left, so <code>git add</code> and <code>git commit</code> succeed. The file is not:</p>
${slide('git-18', 7, 'Xoá dấu hiệu xung đột làm hỏng XML')}
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
xmllint --noout web/WEB-INF/web.xml</code></pre>
<div class="out">web/WEB-INF/web.xml:28: parser error : Opening and ending tag mismatch: servlet-mapping line 23 and servlet
    &lt;/servlet&gt;
              ^</div>
<p><code>xmllint</code> (installed on Mac and Linux; on Windows let NetBeans or VS Code open the file — both underline broken XML) reports that a <code>&lt;servlet-mapping&gt;</code> is closed by <code>&lt;/servlet&gt;</code>. Keeping both halves glued the first block's opening to the second block's tail. Tomcat will fail to deploy, and the failure shows up on <em>everybody's</em> machine after the merge, not in the commit that caused it.</p>

<h3>Fix: resolve at the level of the meaning, not the markers</h3>
<p>The robust way for a structured file is to rebuild it: take <code>main</code>'s version as the base and re-add your own block in the right place, then validate.</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
grep -nE "^(&lt;&lt;&lt;&lt;&lt;&lt;&lt;|=======|&gt;&gt;&gt;&gt;&gt;&gt;&gt;)" web/WEB-INF/web.xml
xmllint --noout web/WEB-INF/web.xml
git add web/WEB-INF/web.xml
git commit -m "Merge main vao feature/tra-cuu: giu ca DatLich va TraCuu trong web.xml"</code></pre>
<div class="out">[feature/tra-cuu dc8d160] Merge main vao feature/tra-cuu: giu ca DatLich va TraCuu trong web.xml</div>
<pre><code class="language-bash">git push</code></pre>
<div class="out">To /tmp/lab18/github.git
   86db42b..dc8d160  feature/tra-cuu -&gt; feature/tra-cuu</div>
<pre><code class="language-bash">git grep -n url-pattern -- web/WEB-INF/web.xml</code></pre>
<div class="out">web/WEB-INF/web.xml:9:        &lt;url-pattern&gt;/login&lt;/url-pattern&gt;
web/WEB-INF/web.xml:17:        &lt;url-pattern&gt;/home&lt;/url-pattern&gt;
web/WEB-INF/web.xml:25:        &lt;url-pattern&gt;/dat-lich&lt;/url-pattern&gt;
web/WEB-INF/web.xml:33:        &lt;url-pattern&gt;/tra-cuu&lt;/url-pattern&gt;</div>
<p>The empty <code>grep</code> shows no marker left; the silent <code>xmllint</code> means the XML is well formed; <code>git grep url-pattern</code> proves all four mappings are there. Only then <code>git add</code> and commit (the merge commit message is yours to write). In VS Code the three-column merge editor (Chapter 14) shows both sides and a result you can validate the same way. If the conflict is hopeless, <code>git merge --abort</code> returns to exactly where you were before the merge.</p>

<h3>Why waiting makes it worse</h3>
<ul>
<li><strong>The conflict is not between people, it is between versions.</strong> Each day the pull request waits, <code>main</code> gets more commits, and more of them touch the shared file.</li>
<li><strong>The author forgets the context.</strong> After five days Bình no longer remembers why he put the block where he did, so the decision at the markers is a guess.</li>
<li><strong>Nobody can trust the review.</strong> A review done on day 1 is about a state of <code>main</code> that no longer exists.</li>
</ul>
<div class="kv-grid">
  <div class="kv"><span class="k">Update the branch every day</span><span class="v"><code>git fetch</code>, then <code>git merge origin/main</code> on your branch. Small conflicts, resolved while you remember.</span></div>
  <div class="kv"><span class="k">GitHub's "Update branch" button</span><span class="v">Merges the base branch into the pull request branch (the dropdown also offers rebase). Per GitHub Docs (10/2026) it works when there are no conflicts and may be unavailable if the head branch is protected. Conflicts must be resolved first — simple ones in GitHub's web editor, complex ones locally.</span></div>
  <div class="kv"><span class="k">Keep pull requests small and short</span><span class="v">One servlet, one pull request, merged within a day or two. Rule of thumb for a student team: a PR open for more than two days gets a message in the group chat.</span></div>
  <div class="kv"><span class="k">Reduce the shared file</span><span class="v">With Servlet 3.0 or newer a servlet can register itself with the <code>@WebServlet("/tra-cuu")</code> annotation, so a new servlet needs no edit in <code>web.xml</code> at all — the conflict disappears. Where a shared file is unavoidable, say in the chat "I am editing web.xml" and merge first.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Make a bare remote and two clones as in 18.1. Commit a small <code>web.xml</code> with one servlet and a <code>&lt;session-config&gt;</code> block, push it, and pull it in both clones.</li>
<li>In <code>an</code>: branch <code>feature/dat-lich</code>, add a servlet block before <code>&lt;session-config&gt;</code>, commit, push, then merge it into <code>main</code> and push <code>main</code>. In <code>binh</code>: branch <code>feature/tra-cuu</code>, add a different block in the same place, commit, push.</li>
<li>In <code>binh</code> run <code>git fetch</code>, <code>git rev-list --left-right --count feature/tra-cuu...origin/main</code> and <code>git merge-tree --write-tree --name-only feature/tra-cuu origin/main</code>. Write down which file is predicted to conflict.</li>
<li>Run <code>git merge origin/main</code>. First delete only the three marker lines, save, and run <code>xmllint --noout web.xml</code> (or open the file in an IDE). Then rebuild the file correctly, validate it, and commit.</li>
<li>Repeat the whole exercise with <code>@WebServlet</code> in place of <code>web.xml</code> edits and note what no longer conflicts.</li>
</ol>
<p><strong>Done when:</strong> (a) your merge-tree prediction named exactly the file that then conflicted; (b) the final <code>web.xml</code> passes <code>xmllint</code> and contains both servlets' mappings; (c) <code>git log --graph --oneline</code> in <code>binh</code> shows a merge commit with two parents; (d) you can say in one sentence why the "delete the markers" version fails.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">merge conflict</span><span class="v">Two commits changed the same lines of a file in different ways; Git cannot choose and asks you to.</span></div>
  <div class="kv"><span class="k">conflict markers</span><span class="v">The lines <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> that Git writes into the file around the two versions.</span></div>
  <div class="kv"><span class="k">UU (unmerged)</span><span class="v">The status code of a file modified on both sides and not yet resolved.</span></div>
  <div class="kv"><span class="k">merge-tree</span><span class="v">A dry-run merge that reports conflicts without touching your working folder.</span></div>
  <div class="kv"><span class="k">shared file</span><span class="v">A file everybody edits (web.xml, pom.xml, a menu page): the usual source of conflicts.</span></div>
  <div class="kv"><span class="k">Update branch</span><span class="v">GitHub's button that brings the base branch's new commits into a pull request branch.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A conflict on a shared file is normal; the skill is seeing it early (<code>rev-list --count</code>, <code>log -- file</code>, <code>merge-tree</code>) and resolving it on your own branch.</li><li>Git cuts a conflict hunk where the two sides differ, not where an XML element begins and ends.</li><li>Deleting the marker lines is not a resolution: validate the result (<code>xmllint</code>, the IDE, a build) before committing.</li><li>A pull request left open makes <code>main</code> run away from it; merge <code>main</code> into your branch daily and keep PRs small.</li><li>The best conflict is the one that cannot happen: annotations instead of a shared <code>web.xml</code>, and a heads-up in the chat before editing a shared file.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-merge-tree" target="_blank" rel="noopener">
  <span class="lc-ico">🔮</span>
  <span class="lc-body"><span class="lc-title">git-scm — git merge-tree</span><span class="lc-sub">The dry-run merge and the --write-tree mode used above.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-merge" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">git-scm — git merge</span><span class="lc-sub">How conflicts are presented and how to abort a merge.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/about-merge-conflicts" target="_blank" rel="noopener">
  <span class="lc-ico">⚔️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — About merge conflicts</span><span class="lc-sub">What GitHub's web editor can resolve and what must be done locally.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/keeping-your-pull-request-in-sync-with-the-base-branch" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Keeping your pull request in sync with the base branch</span><span class="lc-sub">The Update branch button, merge versus rebase.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>How this goes wrong in a student team project.</strong> <b>Deleting the marker lines and pressing commit</b> without validating the file; the XML is broken and the build fails on a machine that did nothing wrong. <b>Always choosing "accept mine"</b> in the IDE and silently deleting a teammate's servlet. <b>Resolving a conflict on <code>main</code> instead of on your branch</b>, so the half-resolved state lands in everyone's pull. <b>Leaving a pull request "for review" for a week</b> and discovering on the deadline night that it conflicts with six others.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.2</span>
<h2>Hai người cùng sửa web.xml, và một pull request nằm nhiều ngày</h2>
<p class="lead">Có những tệp thuộc về tất cả mọi người: <code>web.xml</code>, <code>pom.xml</code> của dự án, một tệp CSS dùng chung, một trang menu <code>.jsp</code>. Mỗi tính năng mới đụng vào chúng ở đúng một chỗ, nên lần merge đầu êm còn lần thứ hai thì xung đột. Xung đột không phải lỗi — đó là Git nhờ con người quyết định. Bài này chỉ cách thấy nó trước, cách đọc nó, một cách sửa "hiển nhiên" làm hỏng tệp mà không báo, và vì sao một pull request để cả tuần biến xung đột nhỏ thành xung đột lớn.</p>
<p>Output lấy từ lab của chương (<code>lab18/tao-nhom.sh</code>), <strong>git version 2.51.1</strong>, remote ở <code>/tmp/lab18/github.git</code>. Chương 3 dạy cơ chế xung đột, Chương 6 dạy pull request; ở đây chỉ nói tai nạn trên tệp dùng chung.</p>

<h3>Bối cảnh: hai nhánh, hai servlet, một tệp</h3>
${slide('git-18', 6, 'Hai người cùng chèn vào web.xml')}
<p>An và Bình rẽ nhánh từ cùng một <code>main</code>. An thêm <code>DatLichServlet</code> và khai báo trong <code>web.xml</code>; Bình thêm <code>TraCuuServlet</code> và khai báo vào cùng tệp, cùng chỗ — ngay trước <code>&lt;session-config&gt;</code>, nơi ai cũng dán. Cả hai push nhánh và mở pull request:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git switch -c feature/dat-lich</code></pre>
<div class="out">Switched to a new branch 'feature/dat-lich'</div>
<pre><code class="language-bash">git add -A
git commit -m "Them DatLichServlet va khai bao web.xml"</code></pre>
<div class="out">[feature/dat-lich cf533ac] Them DatLichServlet va khai bao web.xml
 2 files changed, 10 insertions(+)
…</div>
<pre><code class="language-bash">git push -u origin feature/dat-lich</code></pre>
<div class="out">To /tmp/lab18/github.git
 * [new branch]      feature/dat-lich -&gt; feature/dat-lich
branch 'feature/dat-lich' set up to track 'origin/feature/dat-lich'.</div>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git switch -c feature/tra-cuu</code></pre>
<div class="out">Switched to a new branch 'feature/tra-cuu'</div>
<pre><code class="language-bash">git add -A
git commit -m "Them TraCuuServlet va khai bao web.xml"</code></pre>
<div class="out">[feature/tra-cuu 86db42b] Them TraCuuServlet va khai bao web.xml
 2 files changed, 10 insertions(+)
…</div>
<pre><code class="language-bash">git push -u origin feature/tra-cuu</code></pre>
<div class="out">To /tmp/lab18/github.git
 * [new branch]      feature/tra-cuu -&gt; feature/tra-cuu
branch 'feature/tra-cuu' set up to track 'origin/feature/tra-cuu'.</div>
<p>Nhóm duyệt pull request của An trước. (Lab giả lập nút <em>Merge pull request</em> của GitHub bằng <code>git merge --no-ff</code> trong clone của An.) Pull request của Bình giờ phải chờ.</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git switch main</code></pre>
<div class="out">Switched to branch 'main'
Your branch is up to date with 'origin/main'.</div>
<pre><code class="language-bash">git merge --no-ff feature/dat-lich -m "Merge pull request #1 from an/dat-lich"</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 src/java/com/nhom/servlet/DatLichServlet.java | 2 ++
 web/WEB-INF/web.xml                           | 8 ++++++++
 2 files changed, 10 insertions(+)
 create mode 100644 src/java/com/nhom/servlet/DatLichServlet.java</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   935c46b..78bd742  main -&gt; main</div>

<h3>Thấy nó trước khi nó đau</h3>
${slide('git-18', 8, 'PR để lâu: main đi xa dần')}
<p>Vài lệnh chỉ-đọc cho Bình biết nhánh mình đã trôi bao xa và merge có xung đột không — mà không đụng vào thư mục làm việc:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git fetch origin</code></pre>
<div class="out">From /tmp/lab18/github
 * [new branch]      feature/dat-lich -&gt; origin/feature/dat-lich
   935c46b..78bd742  main             -&gt; origin/main</div>
<pre><code class="language-bash">git rev-list --left-right --count feature/tra-cuu...origin/main</code></pre>
<div class="out">1	2</div>
<pre><code class="language-bash">git log --oneline feature/tra-cuu..origin/main -- web/WEB-INF/web.xml</code></pre>
<div class="out">cf533ac Them DatLichServlet va khai bao web.xml</div>
<pre><code class="language-bash">git diff --stat feature/tra-cuu...origin/main</code></pre>
<div class="out"> src/java/com/nhom/servlet/DatLichServlet.java | 2 ++
 web/WEB-INF/web.xml                           | 8 ++++++++
 2 files changed, 10 insertions(+)</div>
<pre><code class="language-bash">git merge-tree --write-tree --name-only feature/tra-cuu origin/main</code></pre>
<div class="out">1b7b5b5a34e6e8a599f31b2fbf3904a412d25916
web/WEB-INF/web.xml

Auto-merging web/WEB-INF/web.xml
CONFLICT (content): Merge conflict in web/WEB-INF/web.xml</div>
<div class="kv-grid">
  <div class="kv"><span class="k">rev-list --left-right --count</span><span class="v"><code>1  2</code>: nhánh có 1 commit mà main chưa có, main có 2 commit mà nhánh chưa có (commit của An và commit merge). Con số này tăng mỗi ngày pull request nằm chờ.</span></div>
  <div class="kv"><span class="k">log … -- web/WEB-INF/web.xml</span><span class="v">Commit mới nào của main đã đụng vào tệp mà bạn cũng đụng. Một dòng ở đây nghĩa là xung đột đang chờ sẵn.</span></div>
  <div class="kv"><span class="k">merge-tree --write-tree --name-only</span><span class="v">Chạy thử phép merge (Git 2.38 trở lên): in id cây kết quả, rồi các tệp sẽ xung đột. Không đổi gì trong thư mục của bạn.</span></div>
</div>

<h3>Đọc xung đột</h3>
<p>Bình đưa <code>main</code> vào nhánh của mình — chiều an toàn: sửa vấn đề trên nhánh của <em>bạn ấy</em>, không phải trên nhánh chung:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git merge origin/main</code></pre>
<div class="out">Auto-merging web/WEB-INF/web.xml
CONFLICT (content): Merge conflict in web/WEB-INF/web.xml
Automatic merge failed; fix conflicts and then commit the result.</div>
<pre><code class="language-bash">git status --short</code></pre>
<div class="out">A  src/java/com/nhom/servlet/DatLichServlet.java
UU web/WEB-INF/web.xml</div>
<pre><code class="language-bash">git diff</code></pre>
<div class="out">diff --cc web/WEB-INF/web.xml
index c4ab960,019b86a..0000000
--- a/web/WEB-INF/web.xml
+++ b/web/WEB-INF/web.xml
@@@ -17,12 -17,12 +17,21 @@@
          &lt;url-pattern&gt;/home&lt;/url-pattern&gt;
      &lt;/servlet-mapping&gt;
      &lt;servlet&gt;
++&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD
 +        &lt;servlet-name&gt;TraCuuServlet&lt;/servlet-name&gt;
 +        &lt;servlet-class&gt;com.nhom.servlet.TraCuuServlet&lt;/servlet-class&gt;
 +    &lt;/servlet&gt;
 +    &lt;servlet-mapping&gt;
 +        &lt;servlet-name&gt;TraCuuServlet&lt;/servlet-name&gt;
 +        &lt;url-pattern&gt;/tra-cuu&lt;/url-pattern&gt;
++=======
+         &lt;servlet-name&gt;DatLichServlet&lt;/servlet-name&gt;
+         &lt;servlet-class&gt;com.nhom.servlet.DatLichServlet&lt;/servlet-class&gt;
+     &lt;/servlet&gt;
+     &lt;servlet-mapping&gt;
+         &lt;servlet-name&gt;DatLichServlet&lt;/servlet-name&gt;
+         &lt;url-pattern&gt;/dat-lich&lt;/url-pattern&gt;
++&gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main
      &lt;/servlet-mapping&gt;
      &lt;session-config&gt;
          &lt;session-timeout&gt;30&lt;/session-timeout&gt;</div>
<p><code>UU</code> nghĩa là "chưa merge xong, cả hai phía đều sửa". Giữa <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> và <code>=======</code> là bản của Bình; giữa <code>=======</code> và <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main</code> là bản của An. Cả hai đều cần. Để ý Git cắt <em>ở đâu</em>: các dòng chung (<code>&lt;/servlet-mapping&gt;</code>, phần đóng khối) nằm <strong>ngoài</strong> dấu hiệu vì hai phía giống hệt nhau. Khối của mỗi phía bắt đầu ngay sau một thẻ <code>&lt;servlet&gt;</code> chung và dừng ngay trước một thẻ <code>&lt;/servlet-mapping&gt;</code> chung — một đoạn bắt đầu và kết thúc giữa chừng một phần tử XML.</p>

<h3>Cái bẫy: xoá ba dòng dấu hiệu rồi giữ hết</h3>
<p>Cách sửa hiển nhiên là xoá các dòng bắt đầu bằng <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code> và <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> (trong trình soạn thảo, hoặc bằng <code>sed -e '/^&lt;&lt;&lt;&lt;&lt;&lt;&lt; /d' -e '/^=======$/d' -e '/^&gt;&gt;&gt;&gt;&gt;&gt;&gt; /d'</code>). Git hài lòng — hết dấu hiệu nên <code>git add</code> và <code>git commit</code> chạy được. Tệp thì không ổn:</p>
${slide('git-18', 7, 'Xoá dấu hiệu xung đột làm hỏng XML')}
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
xmllint --noout web/WEB-INF/web.xml</code></pre>
<div class="out">web/WEB-INF/web.xml:28: parser error : Opening and ending tag mismatch: servlet-mapping line 23 and servlet
    &lt;/servlet&gt;
              ^</div>
<p><code>xmllint</code> (có sẵn trên Mac và Linux; trên Windows hãy mở tệp bằng NetBeans hoặc VS Code — cả hai gạch chân XML hỏng) báo một thẻ <code>&lt;servlet-mapping&gt;</code> bị đóng bằng <code>&lt;/servlet&gt;</code>. Giữ cả hai nửa đã dán phần đầu của khối thứ nhất vào phần đuôi của khối thứ hai. Tomcat sẽ không deploy được, và lỗi hiện ra trên máy của <em>mọi người</em> sau khi merge, không phải ở commit gây ra nó.</p>

<h3>Cách sửa: giải theo nghĩa, không theo dấu hiệu</h3>
<p>Với tệp có cấu trúc, cách chắc là dựng lại nó: lấy bản của <code>main</code> làm gốc, thêm lại khối của mình vào đúng chỗ, rồi kiểm tra hợp lệ.</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
grep -nE "^(&lt;&lt;&lt;&lt;&lt;&lt;&lt;|=======|&gt;&gt;&gt;&gt;&gt;&gt;&gt;)" web/WEB-INF/web.xml
xmllint --noout web/WEB-INF/web.xml
git add web/WEB-INF/web.xml
git commit -m "Merge main vao feature/tra-cuu: giu ca DatLich va TraCuu trong web.xml"</code></pre>
<div class="out">[feature/tra-cuu dc8d160] Merge main vao feature/tra-cuu: giu ca DatLich va TraCuu trong web.xml</div>
<pre><code class="language-bash">git push</code></pre>
<div class="out">To /tmp/lab18/github.git
   86db42b..dc8d160  feature/tra-cuu -&gt; feature/tra-cuu</div>
<pre><code class="language-bash">git grep -n url-pattern -- web/WEB-INF/web.xml</code></pre>
<div class="out">web/WEB-INF/web.xml:9:        &lt;url-pattern&gt;/login&lt;/url-pattern&gt;
web/WEB-INF/web.xml:17:        &lt;url-pattern&gt;/home&lt;/url-pattern&gt;
web/WEB-INF/web.xml:25:        &lt;url-pattern&gt;/dat-lich&lt;/url-pattern&gt;
web/WEB-INF/web.xml:33:        &lt;url-pattern&gt;/tra-cuu&lt;/url-pattern&gt;</div>
<p><code>grep</code> trống cho thấy hết dấu hiệu; <code>xmllint</code> im lặng nghĩa là XML đúng cú pháp; <code>git grep url-pattern</code> chứng minh đủ bốn ánh xạ. Chỉ lúc đó mới <code>git add</code> và commit (lời nhắn commit merge do bạn viết). Trong VS Code, trình merge ba cột (Chương 14) hiện cả hai phía và một kết quả bạn kiểm tra theo cách tương tự. Nếu xung đột quá rối, <code>git merge --abort</code> đưa bạn về đúng chỗ trước khi merge.</p>

<h3>Vì sao để lâu thì tệ hơn</h3>
<ul>
<li><strong>Xung đột không phải giữa người với người, mà giữa các phiên bản.</strong> Mỗi ngày pull request nằm chờ, <code>main</code> có thêm commit, và nhiều commit trong số đó đụng vào tệp chung.</li>
<li><strong>Tác giả quên ngữ cảnh.</strong> Sau năm ngày Bình không còn nhớ vì sao mình đặt khối ở chỗ đó, nên quyết định tại dấu hiệu chỉ là đoán.</li>
<li><strong>Không ai tin được lượt review.</strong> Review hôm đầu nói về một trạng thái của <code>main</code> không còn tồn tại.</li>
</ul>
<div class="kv-grid">
  <div class="kv"><span class="k">Cập nhật nhánh mỗi ngày</span><span class="v"><code>git fetch</code>, rồi <code>git merge origin/main</code> trên nhánh của bạn. Xung đột nhỏ, giải khi còn nhớ.</span></div>
  <div class="kv"><span class="k">Nút "Update branch" của GitHub</span><span class="v">Merge nhánh gốc vào nhánh của pull request (menu thả xuống có thêm rebase). Theo GitHub Docs (10/2026) nó dùng được khi không có xung đột và có thể không dùng được nếu nhánh đầu được bảo vệ. Có xung đột thì phải giải trước — đơn giản thì trên trình sửa web của GitHub, phức tạp thì trên máy.</span></div>
  <div class="kv"><span class="k">PR nhỏ và ngắn ngày</span><span class="v">Một servlet, một pull request, merge trong một hai ngày. Quy ước cho nhóm sinh viên: PR mở quá hai ngày thì nhắn vào nhóm chat.</span></div>
  <div class="kv"><span class="k">Giảm tệp dùng chung</span><span class="v">Từ Servlet 3.0 trở lên, servlet tự đăng ký bằng chú thích <code>@WebServlet("/tra-cuu")</code>, nên servlet mới không cần sửa <code>web.xml</code> — xung đột biến mất. Chỗ nào tệp chung là không tránh được, hãy nhắn vào nhóm "mình đang sửa web.xml" và merge trước.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Dựng remote bare và hai clone như bài 18.1. Commit một <code>web.xml</code> nhỏ có một servlet và khối <code>&lt;session-config&gt;</code>, push, rồi pull ở cả hai clone.</li>
<li>Trong <code>an</code>: rẽ nhánh <code>feature/dat-lich</code>, thêm một khối servlet trước <code>&lt;session-config&gt;</code>, commit, push, rồi merge vào <code>main</code> và push <code>main</code>. Trong <code>binh</code>: rẽ nhánh <code>feature/tra-cuu</code>, thêm một khối khác ở đúng chỗ đó, commit, push.</li>
<li>Trong <code>binh</code> chạy <code>git fetch</code>, <code>git rev-list --left-right --count feature/tra-cuu...origin/main</code> và <code>git merge-tree --write-tree --name-only feature/tra-cuu origin/main</code>. Ghi lại tệp nào được dự đoán sẽ xung đột.</li>
<li>Chạy <code>git merge origin/main</code>. Trước hết chỉ xoá ba dòng dấu hiệu, lưu, và chạy <code>xmllint --noout web.xml</code> (hoặc mở tệp trong IDE). Sau đó dựng lại tệp cho đúng, kiểm tra hợp lệ, và commit.</li>
<li>Làm lại cả bài tập với <code>@WebServlet</code> thay cho việc sửa <code>web.xml</code> và ghi lại điều gì không còn xung đột.</li>
</ol>
<p><strong>Đạt khi:</strong> (a) dự đoán của merge-tree nêu đúng tệp sau đó xung đột; (b) <code>web.xml</code> cuối cùng qua được <code>xmllint</code> và có ánh xạ của cả hai servlet; (c) <code>git log --graph --oneline</code> trong <code>binh</code> hiện một commit merge có hai cha; (d) bạn nói được trong một câu vì sao bản "xoá dấu hiệu" thất bại.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">merge conflict</span><span class="v">Xung đột merge: hai commit sửa cùng những dòng của một tệp theo hai kiểu khác nhau; Git không chọn được nên nhờ bạn.</span></div>
  <div class="kv"><span class="k">conflict markers</span><span class="v">Dấu hiệu xung đột: các dòng <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code>, <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> Git ghi vào tệp quanh hai phiên bản.</span></div>
  <div class="kv"><span class="k">UU (unmerged)</span><span class="v">Mã trạng thái của tệp bị sửa cả hai phía và chưa giải xong.</span></div>
  <div class="kv"><span class="k">merge-tree</span><span class="v">Merge chạy thử, báo xung đột mà không đụng vào thư mục làm việc.</span></div>
  <div class="kv"><span class="k">shared file</span><span class="v">Tệp dùng chung: tệp ai cũng sửa (web.xml, pom.xml, trang menu), nguồn xung đột quen thuộc.</span></div>
  <div class="kv"><span class="k">Update branch</span><span class="v">Nút của GitHub đưa commit mới của nhánh gốc vào nhánh của pull request.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Xung đột trên tệp chung là chuyện thường; kỹ năng là thấy sớm (<code>rev-list --count</code>, <code>log -- tệp</code>, <code>merge-tree</code>) và giải trên nhánh của mình.</li><li>Git cắt vùng xung đột ở chỗ hai phía khác nhau, không phải ở chỗ một phần tử XML bắt đầu và kết thúc.</li><li>Xoá dòng dấu hiệu không phải là giải xung đột: kiểm tra kết quả (<code>xmllint</code>, IDE, build) trước khi commit.</li><li>Pull request để mở làm <code>main</code> chạy xa nó; mỗi ngày merge <code>main</code> vào nhánh mình và giữ PR nhỏ.</li><li>Xung đột tốt nhất là xung đột không thể xảy ra: chú thích thay cho <code>web.xml</code> chung, và nhắn nhóm trước khi sửa tệp chung.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-merge-tree" target="_blank" rel="noopener">
  <span class="lc-ico">🔮</span>
  <span class="lc-body"><span class="lc-title">git-scm — git merge-tree</span><span class="lc-sub">Merge chạy thử và chế độ --write-tree dùng ở trên.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-merge" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">git-scm — git merge</span><span class="lc-sub">Cách Git trình bày xung đột và cách huỷ một phép merge.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/about-merge-conflicts" target="_blank" rel="noopener">
  <span class="lc-ico">⚔️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — About merge conflicts</span><span class="lc-sub">Trình sửa web của GitHub giải được gì và phần nào phải làm trên máy.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/keeping-your-pull-request-in-sync-with-the-base-branch" target="_blank" rel="noopener">
  <span class="lc-ico">🔄</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Keeping your pull request in sync with the base branch</span><span class="lc-sub">Nút Update branch, merge hay rebase.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Chuyện này hỏng thế nào trong đồ án nhóm.</strong> <b>Xoá dòng dấu hiệu rồi bấm commit</b> mà không kiểm tra tệp; XML hỏng và build đỏ trên máy của người không làm gì sai. <b>Luôn chọn "accept mine"</b> trong IDE và âm thầm xoá servlet của bạn. <b>Giải xung đột ngay trên <code>main</code> thay vì trên nhánh của mình</b>, để trạng thái giải dở lọt vào lần pull của cả nhóm. <b>Để pull request "chờ review" cả tuần</b> rồi đêm sát hạn mới phát hiện nó xung đột với sáu PR khác.</div>
</div>
`,
    },
    /* ─────────────────────────── 18.3 ─────────────────────────── */
    {
      title: '18.3 — Accident: pulling main into the wrong place, and "push rejected"|||18.3 — Tai nạn: kéo main nhầm chỗ và push bị từ chối',
      slug: 'git-18-3-keo-main-va-push-tu-choi',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba thông báo làm sinh viên hoảng nhất khi đồng bộ: "local changes would be overwritten", "no tracking information", "rejected (fetch first)" rồi "divergent branches". Tái hiện từng cái, đọc đúng, sửa an toàn, và vì sao KHÔNG bao giờ dùng --force để cho qua.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.3</span>
<h2>Four messages that scare every student team, and what each one really says</h2>
<p class="lead">Syncing with teammates produces the loudest-looking errors in Git: "would be overwritten", "no tracking information", "rejected", "divergent branches". None of them means something is broken. Each one is Git refusing to guess. This lesson reproduces all four in the lab, tells you in one sentence what each one means, and gives the safe move. It also shows, with real output, what happens to a teammate's work when somebody "fixes" the rejection with <code>--force</code>.</p>
<p>Outputs: this chapter's lab, <strong>git version 2.51.1</strong>, remote <code>/tmp/lab18/github.git</code>. How <code>fetch</code>, <code>pull</code> and tracking work in general is Chapter 5; merge versus rebase is Chapter 3. Here: the four accidents.</p>

<h3>The mental model: a pull is a fetch plus a merge</h3>
${slide('git-18', 9, 'git pull = fetch + merge, và ba chỗ nó vấp')}
<p><code>git pull</code> does two things: <code>git fetch</code> (download the remote's new commits into <code>origin/…</code>, touching nothing of yours) and then a merge (or rebase) of that into the branch you are on. Every error below comes from the second half. The first half is always safe, which is why the habit that prevents most accidents is: <strong>fetch first, look, then merge</strong>.</p>

<h3>Accident A — you have unsaved work and pull main</h3>
<p>An pushes a change to <code>HomeServlet.java</code> on <code>main</code>. Meanwhile Chi opened a branch, edited <em>the same file</em> and did not commit. Thinking "I need the latest main", she types <code>git pull origin main</code>:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git commit -qam "HomeServlet: hien thi ten benh nhan"
git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   9980178..e5ad696  main -&gt; main</div>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git switch -c feature/trang-chu</code></pre>
<div class="out">Switched to a new branch 'feature/trang-chu'</div>
<pre><code class="language-bash">git pull origin main</code></pre>
<div class="out">From /tmp/lab18/github
 * branch            main       -&gt; FETCH_HEAD
   9980178..e5ad696  main       -&gt; origin/main
error: Your local changes to the following files would be overwritten by merge:
	src/java/com/nhom/servlet/HomeServlet.java
Please commit your changes or stash them before you merge.
Aborting
Updating 9980178..e5ad696
</div>
<pre><code class="language-bash">git pull</code></pre>
<div class="out">There is no tracking information for the current branch.
Please specify which branch you want to merge with.
See git-pull(1) for details.

    git pull &lt;remote&gt; &lt;branch&gt;

If you wish to set tracking information for this branch you can do so with:

    git branch --set-upstream-to=origin/&lt;branch&gt; feature/trang-chu</div>
<p>Two different messages appeared, for two different reasons:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">"Your local changes … would be overwritten by merge"</span><span class="v">The incoming commit changes a file that you have modified and not committed. Git will not blend them silently. Nothing was lost; the pull simply did not happen (<code>Aborting</code>).</span></div>
  <div class="kv"><span class="k">"There is no tracking information for the current branch"</span><span class="v">A plain <code>git pull</code> asks "pull from where?" — and a branch never pushed has no upstream (the remote branch it follows). Say where (<code>git pull origin main</code>) or set it once (<code>git push -u origin &lt;branch&gt;</code>).</span></div>
</div>
<p><strong>The safe move is always the same order:</strong> commit your work (a commit on your own branch is safe and reversible), <code>git fetch</code>, look at what is coming, merge it into your branch:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git commit -qam "HomeServlet: banner khuyen mai"
git fetch origin
git log --oneline main..origin/main</code></pre>
<div class="out">e5ad696 HomeServlet: hien thi ten benh nhan</div>
<p><code>git log main..origin/main</code> reads "commits on origin/main that my main does not have": one line, An's commit. Now the merge into the branch:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git merge origin/main</code></pre>
<div class="out">Auto-merging src/java/com/nhom/servlet/HomeServlet.java
CONFLICT (content): Merge conflict in src/java/com/nhom/servlet/HomeServlet.java
Automatic merge failed; fix conflicts and then commit the result.
</div>
<pre><code class="language-bash">git commit -qam "Merge main vao feature/trang-chu"
git log --oneline --graph</code></pre>
<div class="out">*   d1c3686 Merge main vao feature/trang-chu
|\\  
| * e5ad696 HomeServlet: hien thi ten benh nhan
* | fc69f55 HomeServlet: banner khuyen mai
|/  
* 9980178 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p>The merge conflicted because both people appended to the end of the same file. Here the two added lines are independent comments, so the resolution is to keep both (after reading them, not by deleting markers blindly — see 18.2), then commit. The graph shows the merge commit with two parents. Work on a feature branch, bring <code>main</code> in with a merge, and <code>main</code> itself is never touched.</p>
<div class="callout warn"><code>git stash</code> is the other safe option when you are not ready to commit: <code>git stash</code>, then pull, then <code>git stash pop</code>. It can conflict at the <code>pop</code> step too — the cure is the same, and your stashed work stays in the stash until the pop succeeds (Chapter 4).</div>

<h3>Accident B — "rejected", then "divergent branches"</h3>
${slide('git-18', 10, 'Hai người cùng đẩy lên main: lịch sử rẽ đôi')}
<p>An and Bình both commit on <code>main</code> (a bad habit — see 18.4 — but it is what happens before a team has a rule). An pushes first. Bình pushes second and is refused; he types the <code>git pull</code> the message suggested and gets a second error:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git commit -qam "index.jsp: them menu"
git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   308c8b1..c5ab7af  main -&gt; main</div>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git commit -qam "LoginServlet: kiem tra mat khau"
git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
 ! [rejected]        main -&gt; main (fetch first)
error: failed to push some refs to '/tmp/lab18/github.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.</div>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git pull</code></pre>
<div class="out">From /tmp/lab18/github
   308c8b1..c5ab7af  main       -&gt; origin/main
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint:
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint:
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
fatal: Need to specify how to reconcile divergent branches.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">"! [rejected] main -> main (fetch first)"</span><span class="v">The remote's <code>main</code> has a commit that yours does not. Git refuses a push that would make the remote forget it. Remedy: bring that commit in, then push again.</span></div>
  <div class="kv"><span class="k">"Need to specify how to reconcile divergent branches"</span><span class="v">Your <code>main</code> and <code>origin/main</code> each have a commit the other lacks, so Git needs you to choose <em>how</em> to join them — merge, rebase, or fast-forward only. Recent Git versions (2.33 and later) refuse to guess. It is a question, not a failure.</span></div>
</div>
<p>Pick one and say it on the command line. <strong>Merge</strong> keeps both commits and adds a merge commit:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git pull --no-rebase</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 web/index.jsp | 1 +
 1 file changed, 1 insertion(+)</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   c5ab7af..bf3c59a  main -&gt; main</div>
<pre><code class="language-bash">git log --oneline --graph</code></pre>
<div class="out">*   bf3c59a Merge branch 'main' of /tmp/lab18/github
|\\  
| * c5ab7af index.jsp: them menu
* | 2083c59 LoginServlet: kiem tra mat khau
|/  
* 308c8b1 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p><strong>Rebase</strong> replays your commit on top of the new <code>main</code> and leaves a straight line (a new commit hash for yours, which is fine because you have not shared it yet — Chapter 3):</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git pull --rebase</code></pre>
<div class="out">Rebasing (1/1)
Successfully rebased and updated refs/heads/main.</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   6e39165..38f7688  main -&gt; main</div>
<pre><code class="language-bash">git log --oneline --graph</code></pre>
<div class="out">* 38f7688 LoginServlet: kiem tra mat khau
* 6e39165 index.jsp: them menu
* 308c8b1 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p>For a beginner team, merge is the safer default: it never rewrites anything and its conflicts look the same as every other conflict. Choose once and stop being asked: <code>git config --global pull.rebase false</code> (merge) or <code>true</code> (rebase). If you already set one, you will not see the "divergent" message at all — check with <code>git config --global --get pull.rebase</code>.</p>

<h3>Accident C — the shortcut that destroys work: --force</h3>
<p>The rejection is annoying, and the internet suggests <code>git push --force</code>. Here is what that does to the same situation:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git push --force origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
 + 458865e...07a7f7d main -&gt; main (forced update)
</div>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git fetch</code></pre>
<div class="out">From /tmp/lab18/github
 + 458865e...07a7f7d main       -&gt; origin/main  (forced update)</div>
<pre><code class="language-bash">git status -sb</code></pre>
<div class="out">## main...origin/main [ahead 1, behind 1]</div>
<pre><code class="language-bash">git log --oneline --all</code></pre>
<div class="out">458865e index.jsp: them menu
07a7f7d LoginServlet: kiem tra mat khau
354f445 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p>The remote's <code>main</code> was moved <em>backwards and sideways</em> to Bình's commit (<code>+ … (forced update)</code>). An's commit is gone from the shared branch. An's own clone still has it (<code>ahead 1, behind 1</code>), and that copy is the only reason it is recoverable: the remote no longer holds it, so the commit survives only where somebody still has it. The rejection was Git protecting An's work. Rule for the team: <strong><code>--force</code> is never the answer to "rejected"</strong>; fetch, integrate, push. If you truly rewrote your own branch (an amended or rebased commit that you already pushed), use <code>git push --force-with-lease</code>, which refuses if somebody else pushed in the meantime — and only on a branch nobody else is using. On GitHub you can switch force pushes off for <code>main</code> (18.5).</p>

<h3>Prevent it</h3>
<ul>
<li><strong>Fetch first.</strong> Start a work session with <code>git fetch</code> and <code>git status -sb</code>; the <code>[behind 2]</code> in the status line is the whole story.</li>
<li><strong>Never work on <code>main</code></strong> (18.4) and nothing can diverge there.</li>
<li><strong>Commit before you integrate</strong>, so there is no "unsaved work" to protect.</li>
<li><strong>Push with <code>-u</code> the first time</strong>: <code>git push -u origin feature/x</code> sets the upstream and cures "no tracking information" for good.</li>
<li><strong>Set <code>pull.rebase</code> once</strong> on every teammate's machine, so everybody's pull behaves the same.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>In the <code>thu-git</code> sandbox build a bare remote and two clones (<code>an</code>, <code>binh</code>) as in 18.1. Commit a file <code>Home.java</code> with three lines and push.</li>
<li><strong>Accident A.</strong> In <code>an</code> add a line at the end of <code>Home.java</code>, commit, push. In <code>binh</code>: create the branch <code>feature/x</code>, edit the last line of the same file <em>without</em> committing, run <code>git pull origin main</code>. Copy the message. Then commit, <code>git fetch</code>, <code>git log main..origin/main</code>, <code>git merge origin/main</code>, resolve, commit.</li>
<li><strong>Accident B.</strong> In both clones switch to <code>main</code>. <code>an</code> commits and pushes; <code>binh</code> commits and pushes (rejected). Run <code>git pull</code> and copy the "divergent" message. Fix it once with <code>--no-rebase</code> in this exercise.</li>
<li>Redo step 3 from scratch but fix it with <code>--rebase</code>. Compare <code>git log --oneline --graph</code> in the two runs.</li>
<li><strong>Accident C (only in the sandbox).</strong> Redo the situation of step 3, then run <code>git push --force origin main</code> from <code>binh</code> and run <code>git fetch</code> and <code>git status -sb</code> in <code>an</code>. Write one sentence on what An would have lost if he had no local copy.</li>
</ol>
<p><strong>Done when:</strong> (a) you have copied all four messages and can say in one sentence what each means; (b) the merge run shows a commit with two parents and the rebase run a straight line; (c) after the forced push <code>git status -sb</code> in <code>an</code> shows <code>ahead 1, behind 1</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">fetch</span><span class="v">Download the remote's new commits into <code>origin/…</code> without changing your branch or files. Always safe.</span></div>
  <div class="kv"><span class="k">upstream / tracking branch</span><span class="v">The remote branch your local branch follows; it is what a bare <code>git pull</code> and <code>git push</code> use.</span></div>
  <div class="kv"><span class="k">fast-forward</span><span class="v">A merge that only moves the branch pointer forward because nothing diverged. A push is accepted only if it is a fast-forward.</span></div>
  <div class="kv"><span class="k">divergent branches</span><span class="v">Two branches that each have commits the other lacks.</span></div>
  <div class="kv"><span class="k">git push --force</span><span class="v">Make the remote branch equal yours even if that discards its commits. Dangerous on a shared branch.</span></div>
  <div class="kv"><span class="k">--force-with-lease</span><span class="v">A safer force: refused if the remote moved since you last fetched.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A pull is a fetch plus a merge; every sync error comes from the merge half, and <code>git fetch</code> is always safe.</li><li>"Would be overwritten" means commit (or stash) first; "no tracking information" means push with <code>-u</code> or name the remote and branch.</li><li>"Rejected (fetch first)" and "divergent branches" mean: choose merge or rebase once, integrate, then push.</li><li>A merge is the safer default for beginners; a rebase gives a straight line but rewrites your own unshared commits.</li><li><code>--force</code> is not a fix for "rejected": it deletes teammates' commits from the shared branch.</li></ul>

<a class="link-card" href="https://docs.github.com/en/get-started/using-git/dealing-with-non-fast-forward-errors" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Dealing with non-fast-forward errors</span><span class="lc-sub">Why pushes are rejected and the safe ways to fix them.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-pull" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">git-scm — git pull</span><span class="lc-sub">--rebase, --no-rebase, --ff-only and the pull.rebase setting.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-push" target="_blank" rel="noopener">
  <span class="lc-ico">⬆️</span>
  <span class="lc-body"><span class="lc-title">git-scm — git push</span><span class="lc-sub">The --force and --force-with-lease options and the "Note about fast-forwards".</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>How this goes wrong in a student team project.</strong> <b>Typing <code>git push --force</code> because Stack Overflow said so</b>, and the teammate who pushed ten minutes earlier loses a commit without any message. <b>Reading "would be overwritten" as "Git is broken" and re-cloning the project</b>, losing the uncommitted work that the message was protecting. <b>Running <code>git pull</code> on a branch you never pushed</b> and then deleting the folder at "no tracking information". <b>Choosing rebase on a branch two people share</b> because it "looks cleaner".</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.3</span>
<h2>Bốn thông báo làm nhóm sinh viên nào cũng hoảng, và mỗi cái thật sự nói gì</h2>
<p class="lead">Đồng bộ với đồng đội sinh ra những lỗi trông dữ nhất của Git: "would be overwritten", "no tracking information", "rejected", "divergent branches". Không cái nào nghĩa là hỏng. Mỗi cái là Git từ chối đoán mò. Bài này tái hiện cả bốn trong lab, nói trong một câu mỗi cái nghĩa là gì, và đưa ra nước đi an toàn. Bài cũng cho thấy bằng output thật điều gì xảy ra với việc của đồng đội khi ai đó "sửa" lỗi rejected bằng <code>--force</code>.</p>
<p>Output: lab của chương, <strong>git version 2.51.1</strong>, remote <code>/tmp/lab18/github.git</code>. <code>fetch</code>, <code>pull</code> và tracking nói chung ở Chương 5; merge so với rebase ở Chương 3. Ở đây chỉ nói bốn tai nạn.</p>

<h3>Mô hình trong đầu: pull = fetch + merge</h3>
${slide('git-18', 9, 'git pull = fetch + merge, và ba chỗ nó vấp')}
<p><code>git pull</code> làm hai việc: <code>git fetch</code> (tải commit mới của remote về <code>origin/…</code>, không đụng gì của bạn) rồi merge (hoặc rebase) cái đó vào nhánh bạn đang đứng. Mọi lỗi dưới đây đến từ nửa sau. Nửa đầu luôn an toàn, nên thói quen ngăn được phần lớn tai nạn là: <strong>fetch trước, nhìn, rồi mới merge</strong>.</p>

<h3>Tai nạn A — đang làm dở chưa commit mà pull main</h3>
<p>An push một thay đổi cho <code>HomeServlet.java</code> lên <code>main</code>. Cùng lúc đó Chi mở một nhánh, sửa <em>đúng tệp đó</em> và chưa commit. Nghĩ "mình cần main mới nhất", bạn ấy gõ <code>git pull origin main</code>:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git commit -qam "HomeServlet: hien thi ten benh nhan"
git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   9980178..e5ad696  main -&gt; main</div>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git switch -c feature/trang-chu</code></pre>
<div class="out">Switched to a new branch 'feature/trang-chu'</div>
<pre><code class="language-bash">git pull origin main</code></pre>
<div class="out">From /tmp/lab18/github
 * branch            main       -&gt; FETCH_HEAD
   9980178..e5ad696  main       -&gt; origin/main
error: Your local changes to the following files would be overwritten by merge:
	src/java/com/nhom/servlet/HomeServlet.java
Please commit your changes or stash them before you merge.
Aborting
Updating 9980178..e5ad696
</div>
<pre><code class="language-bash">git pull</code></pre>
<div class="out">There is no tracking information for the current branch.
Please specify which branch you want to merge with.
See git-pull(1) for details.

    git pull &lt;remote&gt; &lt;branch&gt;

If you wish to set tracking information for this branch you can do so with:

    git branch --set-upstream-to=origin/&lt;branch&gt; feature/trang-chu</div>
<p>Hai thông báo khác nhau xuất hiện, vì hai lý do khác nhau:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">"Your local changes … would be overwritten by merge"</span><span class="v">Commit sắp vào sửa một tệp mà bạn đã sửa và chưa commit. Git không trộn âm thầm. Không mất gì; chỉ là pull không xảy ra (<code>Aborting</code>).</span></div>
  <div class="kv"><span class="k">"There is no tracking information for the current branch"</span><span class="v"><code>git pull</code> trơn hỏi "pull từ đâu?" — mà nhánh chưa từng push thì chưa có upstream (nhánh remote nó theo dõi). Hãy nói rõ (<code>git pull origin main</code>) hoặc đặt một lần (<code>git push -u origin &lt;nhánh&gt;</code>).</span></div>
</div>
<p><strong>Nước đi an toàn luôn cùng một thứ tự:</strong> commit việc của bạn (commit trên nhánh riêng là an toàn và hoàn tác được), <code>git fetch</code>, xem cái gì sắp về, merge nó vào nhánh của bạn:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git commit -qam "HomeServlet: banner khuyen mai"
git fetch origin
git log --oneline main..origin/main</code></pre>
<div class="out">e5ad696 HomeServlet: hien thi ten benh nhan</div>
<p><code>git log main..origin/main</code> đọc là "các commit trên origin/main mà main của tôi chưa có": một dòng, commit của An. Giờ merge vào nhánh:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git merge origin/main</code></pre>
<div class="out">Auto-merging src/java/com/nhom/servlet/HomeServlet.java
CONFLICT (content): Merge conflict in src/java/com/nhom/servlet/HomeServlet.java
Automatic merge failed; fix conflicts and then commit the result.
</div>
<pre><code class="language-bash">git commit -qam "Merge main vao feature/trang-chu"
git log --oneline --graph</code></pre>
<div class="out">*   d1c3686 Merge main vao feature/trang-chu
|\\  
| * e5ad696 HomeServlet: hien thi ten benh nhan
* | fc69f55 HomeServlet: banner khuyen mai
|/  
* 9980178 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p>Merge xung đột vì hai người cùng nối thêm vào cuối một tệp. Ở đây hai dòng thêm là hai chú thích độc lập nên cách giải là giữ cả hai (sau khi đọc chúng, không phải xoá dấu hiệu một cách mù quáng — xem 18.2), rồi commit. Đồ thị cho thấy commit merge có hai cha. Làm trên nhánh tính năng, đưa <code>main</code> vào bằng merge, và bản thân <code>main</code> không bao giờ bị đụng.</p>
<div class="callout warn"><code>git stash</code> là lựa chọn an toàn còn lại khi bạn chưa muốn commit: <code>git stash</code>, rồi pull, rồi <code>git stash pop</code>. Bước <code>pop</code> cũng có thể xung đột — cách chữa y hệt, và việc đã cất vẫn nằm trong stash cho tới khi pop thành công (Chương 4).</div>

<h3>Tai nạn B — "rejected", rồi "divergent branches"</h3>
${slide('git-18', 10, 'Hai người cùng đẩy lên main: lịch sử rẽ đôi')}
<p>An và Bình cùng commit trên <code>main</code> (thói quen xấu — xem 18.4 — nhưng đó là chuyện xảy ra trước khi nhóm có luật). An push trước. Bình push sau và bị từ chối; bạn ấy gõ <code>git pull</code> theo gợi ý của thông báo và nhận lỗi thứ hai:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git commit -qam "index.jsp: them menu"
git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   308c8b1..c5ab7af  main -&gt; main</div>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git commit -qam "LoginServlet: kiem tra mat khau"
git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
 ! [rejected]        main -&gt; main (fetch first)
error: failed to push some refs to '/tmp/lab18/github.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.</div>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git pull</code></pre>
<div class="out">From /tmp/lab18/github
   308c8b1..c5ab7af  main       -&gt; origin/main
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint:
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint:
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
fatal: Need to specify how to reconcile divergent branches.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">"! [rejected] main -> main (fetch first)"</span><span class="v"><code>main</code> trên remote có một commit mà máy bạn chưa có. Git từ chối một lần push làm remote "quên" nó. Cách chữa: đưa commit đó về, rồi push lại.</span></div>
  <div class="kv"><span class="k">"Need to specify how to reconcile divergent branches"</span><span class="v"><code>main</code> của bạn và <code>origin/main</code> mỗi bên có một commit bên kia không có, nên Git cần bạn chọn <em>cách</em> nối — merge, rebase, hay chỉ fast-forward. Git đời mới (từ 2.33) từ chối đoán. Đó là một câu hỏi, không phải thất bại.</span></div>
</div>
<p>Chọn một cách và nói rõ trên dòng lệnh. <strong>Merge</strong> giữ cả hai commit và thêm một commit merge:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git pull --no-rebase</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 web/index.jsp | 1 +
 1 file changed, 1 insertion(+)</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   c5ab7af..bf3c59a  main -&gt; main</div>
<pre><code class="language-bash">git log --oneline --graph</code></pre>
<div class="out">*   bf3c59a Merge branch 'main' of /tmp/lab18/github
|\\  
| * c5ab7af index.jsp: them menu
* | 2083c59 LoginServlet: kiem tra mat khau
|/  
* 308c8b1 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p><strong>Rebase</strong> phát lại commit của bạn lên trên <code>main</code> mới và để lại một đường thẳng (commit của bạn có mã băm mới, không sao vì bạn chưa chia sẻ nó — Chương 3):</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git pull --rebase</code></pre>
<div class="out">Rebasing (1/1)
Successfully rebased and updated refs/heads/main.</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   6e39165..38f7688  main -&gt; main</div>
<pre><code class="language-bash">git log --oneline --graph</code></pre>
<div class="out">* 38f7688 LoginServlet: kiem tra mat khau
* 6e39165 index.jsp: them menu
* 308c8b1 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p>Với nhóm mới học, merge là mặc định an toàn hơn: nó không viết lại gì và xung đột của nó trông giống mọi xung đột khác. Chọn một lần để khỏi bị hỏi: <code>git config --global pull.rebase false</code> (merge) hoặc <code>true</code> (rebase). Nếu bạn đã đặt một trong hai thì sẽ không thấy thông báo "divergent" — kiểm bằng <code>git config --global --get pull.rebase</code>.</p>

<h3>Tai nạn C — đường tắt phá hỏng công việc: --force</h3>
<p>Bị từ chối thì khó chịu, và Internet gợi ý <code>git push --force</code>. Đây là điều nó làm với đúng tình huống trên:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git push --force origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
 + 458865e...07a7f7d main -&gt; main (forced update)
</div>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git fetch</code></pre>
<div class="out">From /tmp/lab18/github
 + 458865e...07a7f7d main       -&gt; origin/main  (forced update)</div>
<pre><code class="language-bash">git status -sb</code></pre>
<div class="out">## main...origin/main [ahead 1, behind 1]</div>
<pre><code class="language-bash">git log --oneline --all</code></pre>
<div class="out">458865e index.jsp: them menu
07a7f7d LoginServlet: kiem tra mat khau
354f445 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p><code>main</code> trên remote bị kéo <em>lùi và sang ngang</em> về commit của Bình (<code>+ … (forced update)</code>). Commit của An biến khỏi nhánh chung. Clone của An vẫn còn nó (<code>ahead 1, behind 1</code>), và bản sao đó là lý do duy nhất nó cứu được: remote không còn giữ nó, nên commit chỉ sống ở nơi nào còn có người giữ. Việc bị từ chối là Git đang bảo vệ việc của An. Luật cho nhóm: <strong><code>--force</code> không bao giờ là câu trả lời cho "rejected"</strong>; fetch, tích hợp, push. Nếu bạn thật sự viết lại nhánh của riêng mình (commit amend hoặc rebase mà đã push), dùng <code>git push --force-with-lease</code>, nó từ chối nếu giữa chừng có người khác đã push — và chỉ trên nhánh không ai khác dùng. Trên GitHub bạn có thể tắt force push cho <code>main</code> (18.5).</p>

<h3>Phòng ngừa</h3>
<ul>
<li><strong>Fetch trước.</strong> Mở phiên làm việc bằng <code>git fetch</code> và <code>git status -sb</code>; chữ <code>[behind 2]</code> trên dòng trạng thái là toàn bộ câu chuyện.</li>
<li><strong>Không bao giờ làm trên <code>main</code></strong> (18.4) thì ở đó không gì rẽ đôi được.</li>
<li><strong>Commit trước khi tích hợp</strong>, để không còn "việc chưa lưu" cần bảo vệ.</li>
<li><strong>Push với <code>-u</code> lần đầu</strong>: <code>git push -u origin feature/x</code> đặt upstream và chữa "no tracking information" vĩnh viễn.</li>
<li><strong>Đặt <code>pull.rebase</code> một lần</strong> trên máy mọi người, để pull của ai cũng hành xử giống nhau.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong kho sân tập <code>thu-git</code> dựng một remote bare và hai clone (<code>an</code>, <code>binh</code>) như ở 18.1. Commit tệp <code>Home.java</code> ba dòng và push.</li>
<li><strong>Tai nạn A.</strong> Trong <code>an</code> thêm một dòng cuối <code>Home.java</code>, commit, push. Trong <code>binh</code>: tạo nhánh <code>feature/x</code>, sửa dòng cuối của cùng tệp <em>mà không</em> commit, chạy <code>git pull origin main</code>. Chép thông báo. Rồi commit, <code>git fetch</code>, <code>git log main..origin/main</code>, <code>git merge origin/main</code>, giải xung đột, commit.</li>
<li><strong>Tai nạn B.</strong> Ở cả hai clone chuyển sang <code>main</code>. <code>an</code> commit và push; <code>binh</code> commit và push (bị từ chối). Chạy <code>git pull</code> và chép thông báo "divergent". Bài này sửa một lần bằng <code>--no-rebase</code>.</li>
<li>Làm lại bước 3 từ đầu nhưng sửa bằng <code>--rebase</code>. So sánh <code>git log --oneline --graph</code> của hai lần.</li>
<li><strong>Tai nạn C (chỉ trong sân tập).</strong> Làm lại tình huống bước 3, rồi chạy <code>git push --force origin main</code> từ <code>binh</code> và chạy <code>git fetch</code>, <code>git status -sb</code> trong <code>an</code>. Viết một câu: nếu An không có bản sao cục bộ thì sẽ mất gì.</li>
</ol>
<p><strong>Đạt khi:</strong> (a) bạn đã chép cả bốn thông báo và nói được trong một câu mỗi cái nghĩa là gì; (b) lần merge cho một commit có hai cha còn lần rebase cho một đường thẳng; (c) sau lần force push, <code>git status -sb</code> trong <code>an</code> hiện <code>ahead 1, behind 1</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">fetch</span><span class="v">Tải commit mới của remote về <code>origin/…</code> mà không đổi nhánh hay tệp của bạn. Luôn an toàn.</span></div>
  <div class="kv"><span class="k">upstream / tracking branch</span><span class="v">Nhánh remote mà nhánh cục bộ của bạn theo dõi; <code>git pull</code> và <code>git push</code> trơn dùng nó.</span></div>
  <div class="kv"><span class="k">fast-forward</span><span class="v">Tua thẳng: merge chỉ dời con trỏ nhánh về phía trước vì không có gì rẽ đôi. Một lần push chỉ được nhận nếu là fast-forward.</span></div>
  <div class="kv"><span class="k">divergent branches</span><span class="v">Hai nhánh rẽ đôi: mỗi bên có commit mà bên kia không có.</span></div>
  <div class="kv"><span class="k">git push --force</span><span class="v">Ép nhánh remote bằng nhánh của bạn dù phải bỏ commit của nó. Nguy hiểm trên nhánh chung.</span></div>
  <div class="kv"><span class="k">--force-with-lease</span><span class="v">Force an toàn hơn: bị từ chối nếu remote đã đổi từ lần fetch cuối của bạn.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Pull là fetch cộng merge; mọi lỗi đồng bộ đến từ nửa merge, và <code>git fetch</code> luôn an toàn.</li><li>"Would be overwritten" nghĩa là commit (hoặc stash) trước; "no tracking information" nghĩa là push với <code>-u</code> hoặc nêu rõ remote và nhánh.</li><li>"Rejected (fetch first)" và "divergent branches" nghĩa là: chọn merge hay rebase một lần, tích hợp, rồi push.</li><li>Merge là mặc định an toàn hơn cho người mới; rebase cho đường thẳng nhưng viết lại commit chưa chia sẻ của bạn.</li><li><code>--force</code> không phải cách sửa "rejected": nó xoá commit của đồng đội khỏi nhánh chung.</li></ul>

<a class="link-card" href="https://docs.github.com/en/get-started/using-git/dealing-with-non-fast-forward-errors" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Dealing with non-fast-forward errors</span><span class="lc-sub">Vì sao push bị từ chối và những cách sửa an toàn.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-pull" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">git-scm — git pull</span><span class="lc-sub">--rebase, --no-rebase, --ff-only và cài đặt pull.rebase.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-push" target="_blank" rel="noopener">
  <span class="lc-ico">⬆️</span>
  <span class="lc-body"><span class="lc-title">git-scm — git push</span><span class="lc-sub">Tuỳ chọn --force và --force-with-lease, và mục "Note about fast-forwards".</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Chuyện này hỏng thế nào trong đồ án nhóm.</strong> <b>Gõ <code>git push --force</code> vì Stack Overflow bảo vậy</b>, và bạn push mười phút trước mất một commit mà không có thông báo nào. <b>Đọc "would be overwritten" thành "Git hỏng" rồi clone lại cả dự án</b>, mất luôn phần chưa commit mà thông báo đang bảo vệ. <b>Chạy <code>git pull</code> trên nhánh chưa từng push</b> rồi xoá thư mục khi gặp "no tracking information". <b>Chọn rebase trên nhánh hai người cùng dùng</b> vì nó "nhìn gọn hơn".</div>
</div>
`,
    },

    /* ─────────────────────────── 18.4 ─────────────────────────── */
    {
      title: '18.4 — Accident: the work landed on main by mistake|||18.4 — Tai nạn: làm nhầm ngay trên main',
      slug: 'git-18-4-sua-nham-tren-main',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Quên rẽ nhánh và commit thẳng lên main: nếu chưa push thì dời việc sang nhánh bằng branch + reset; nếu đã push thì revert chứ không force. Có luôn bảng quyết định reset hay revert và cách tự cứu bằng reflog.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.4</span>
<h2>"I have been committing on main for two weeks"</h2>
<p class="lead">It is the most common accident in student projects and the easiest to fix — as long as you ask one question first: <strong>has this commit left my laptop?</strong> If not, nothing is public and you can move the work to a branch in three commands. If it has, you must not rewrite history other people already pulled; you add a commit that undoes it. The two cases use different commands, and mixing them up is how a small mistake becomes a big one.</p>
<p>Outputs: this chapter's lab, <strong>git version 2.51.1</strong>, remote <code>/tmp/lab18/github.git</code>. <code>reset</code>, <code>revert</code> and <code>reflog</code> are taught in Chapter 4 and Chapter 13; this lesson is the "which one, today, in a team" decision.</p>

<h3>First, find out where you are</h3>
${slide('git-18', 11, 'main ahead 2: dời việc sang nhánh rồi đưa main về origin/main')}
<p>Chi forgot to create a branch and made two commits right on <code>main</code>. Before touching anything she asks Git:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git commit -qam "Login bang email"
git commit -qam "index: nut dang nhap"
git status -sb</code></pre>
<div class="out">## main...origin/main [ahead 2]</div>
<pre><code class="language-bash">git log --oneline -4</code></pre>
<div class="out">182ad94 index: nut dang nhap
a135628 Login bang email
6994417 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p><code>## main...origin/main [ahead 2]</code> is the answer: two commits exist only here. Nobody else has them. <code>git status -sb</code> (the <code>-sb</code> means short format plus the branch line) is the question to ask before any rescue; the other two possible answers are <code>[ahead 2, behind 1]</code> (diverged — 18.3) and no brackets at all (the commits are already on the remote — second half of this lesson).</p>

<h3>Case 1 — not pushed yet: move the work, then reset</h3>
<p>Three commands: put a new branch at the current commit (that keeps the work), move <code>main</code> back to where the remote is, and switch to the new branch.</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git branch feature/dang-nhap-email
git reset --hard origin/main</code></pre>
<div class="out">HEAD is now at 6994417 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<pre><code class="language-bash">git switch feature/dang-nhap-email</code></pre>
<div class="out">Switched to branch 'feature/dang-nhap-email'</div>
<pre><code class="language-bash">git status -sb</code></pre>
<div class="out">## feature/dang-nhap-email</div>
<pre><code class="language-bash">git log --oneline --graph --all --decorate</code></pre>
<div class="out">* 182ad94 (HEAD -&gt; feature/dang-nhap-email) index: nut dang nhap
* a135628 Login bang email
* 6994417 (origin/main, origin/HEAD, main) Khoi tao du an NetBeans: Login, Home, web.xml
</div>
<pre><code class="language-bash">git reflog -5</code></pre>
<div class="out">182ad94 HEAD@{0}: checkout: moving from main to feature/dang-nhap-email
6994417 HEAD@{1}: reset: moving to origin/main
182ad94 HEAD@{2}: commit: index: nut dang nhap
a135628 HEAD@{3}: commit: Login bang email
6994417 HEAD@{4}: clone: from /tmp/lab18/github.git</div>
<pre><code class="language-bash">git branch cuu-ho HEAD@{2}
git log --oneline -3 cuu-ho</code></pre>
<div class="out">182ad94 index: nut dang nhap
a135628 Login bang email
6994417 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p>Read the graph: the branch <code>feature/dang-nhap-email</code> carries both commits; <code>main</code> is back on <code>origin/main</code>. <code>git reset --hard origin/main</code> is safe <em>here</em> only because the commits are already reachable from the new branch — had Chi run it before creating the branch, the commits would have vanished from every branch. If that ever happens, the last lines are the net: <code>git reflog</code> remembers where <code>HEAD</code> was (<code>HEAD@{2}: commit: index: nut dang nhap</code>), and <code>git branch rescue &lt;hash&gt;</code> brings the commit back (Chapter 13).</p>

<h3>When the reset came first: the reflog</h3>
<p>If the commits are no longer on any branch, they are not gone yet. <code>git reflog</code> is Git's private diary of where <code>HEAD</code> has been: every commit, checkout and reset is a line, newest first. In the output above read the line <code>HEAD@{2}: commit: index: nut dang nhap</code> — that is Chi's second commit, still addressable as <code>HEAD@{2}</code> after the reset. <code>git branch cuu-ho 'HEAD@{2}'</code> (the quotes keep the shell away from the braces) pins it to a new branch, and <code>git log --oneline -3 cuu-ho</code> proves both commits came back. By default Git keeps reflog entries for 90 days, and for commits no branch points to, 30 days (the <code>gc.reflogExpire</code> settings) — plenty of time, but not forever, and the reflog lives only in <em>your</em> clone: delete the folder and it is gone too.</p>
<h3>Case 2 — already pushed: revert, do not rewrite</h3>
<p>Now the same mistake, but Chi also ran <code>git push origin main</code>, and An pulled it:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git commit -qam "Login bang email"
git commit -qam "index: nut dang nhap"
git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   a9576f4..a6db29f  main -&gt; main
</div>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git pull -q
git log --oneline -3</code></pre>
<div class="out">a6db29f index: nut dang nhap
488dcf1 Login bang email
a9576f4 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p>The commits are on the shared branch and in An's clone. Using <code>reset</code> + <code>push --force</code> would rewrite a branch someone else already has (18.3). Instead Chi keeps her work on a branch and then <strong>reverts</strong> the two commits — Git adds new commits that undo them:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git branch feature/dang-nhap-email
git revert --no-edit HEAD~2..HEAD</code></pre>
<div class="out">[main e74c7ce] Revert "index: nut dang nhap"
 Date: Sat Oct 31 21:54:43 2026 +0700
 1 file changed, 1 deletion(-)
[main d76505a] Revert "Login bang email"
 Date: Sat Oct 31 21:54:43 2026 +0700
 1 file changed, 1 deletion(-)</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   a6db29f..d76505a  main -&gt; main</div>
<pre><code class="language-bash">git log --oneline --graph --all --decorate</code></pre>
<div class="out">* d76505a (HEAD -&gt; main, origin/main, origin/HEAD) Revert "Login bang email"
* e74c7ce Revert "index: nut dang nhap"
* a6db29f (feature/dang-nhap-email) index: nut dang nhap
* 488dcf1 Login bang email
* a9576f4 Khoi tao du an NetBeans: Login, Home, web.xml
</div>
<pre><code class="language-bash">git diff --stat origin/main~4 origin/main
<span class="tok-comment"># — An —</span>
git pull -q
git log --oneline -5</code></pre>
<div class="out">d76505a Revert "Login bang email"
e74c7ce Revert "index: nut dang nhap"
a6db29f index: nut dang nhap
488dcf1 Login bang email
a9576f4 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p>The graph shows the shape: the original two commits stay in history, and two <code>Revert …</code> commits follow them; <code>main</code> has the old content again. <code>git diff --stat origin/main~4 origin/main</code> prints nothing because the content of <code>main</code> now equals its content four commits ago — the quick proof that the revert worked. An's next <code>git pull</code> is a normal fast-forward. Chi's work is safe on <code>feature/dang-nhap-email</code>, ready for a real pull request.</p>
<div class="callout warn">There is a catch for the <em>next</em> step: when Chi later merges her branch, Git sees that those two commits are already part of <code>main</code> (reverted, but present) and will not bring them back. The way out is described in 18.6 — revert the revert.</div>

<h3>Which one — reset or revert?</h3>
${slide('git-18', 12, 'reset hay revert: hỏi một câu — commit đã rời máy chưa?')}
<table>
<thead><tr><th>Situation</th><th>Use</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Commits only on your laptop</td><td><code>branch</code> + <code>reset --hard origin/main</code></td><td>Nobody else has them; rewriting your own unshared history is free.</td></tr>
<tr><td>Commits pushed to a shared branch</td><td><code>revert</code></td><td>Adds history instead of changing it; everybody's pull still works.</td></tr>
<tr><td>Pushed, but only to your own feature branch nobody uses</td><td><code>reset</code> + <code>push --force-with-lease</code></td><td>Allowed, if you are certain nobody pulled it.</td></tr>
<tr><td>Not sure who has it</td><td><code>revert</code></td><td>It is always safe; the cost is two extra commits.</td></tr>
</tbody></table>

<h3>Prevent it</h3>
<ul>
<li><strong>Make the shell tell you.</strong> Show the branch name in the prompt (Git Bash does by default; on Mac zsh add <code>%b</code> via <code>vcs_info</code>, or use VS Code's status bar). You cannot commit on <code>main</code> by mistake if you see <code>main</code>.</li>
<li><strong>Branch first, always:</strong> <code>git switch -c feature/&lt;ticket&gt;</code> is the first command of every task (Quick start, KĐ.7).</li>
<li><strong>Make <code>main</code> refuse direct pushes</strong> on GitHub (18.5): then a mistaken commit stays on the laptop where Case 1 fixes it.</li>
<li><strong>A local safety net:</strong> a <code>pre-push</code> hook that stops <code>git push</code> when the current branch is <code>main</code> (Chapter 12).</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>In the sandbox: bare remote, clones <code>an</code> and <code>chi</code>, one pushed commit on <code>main</code>.</li>
<li><strong>Case 1.</strong> In <code>chi</code> make two commits on <code>main</code> without a branch. Run <code>git status -sb</code> and copy the line. Move the work: <code>git branch feature/mine</code>, <code>git reset --hard origin/main</code>, <code>git switch feature/mine</code>. Check with <code>git log --oneline --graph --all --decorate</code>.</li>
<li>Break it on purpose: from <code>main</code> in <code>chi</code> repeat step 2's commits, run <code>git reset --hard origin/main</code> <em>first</em>, then find the lost commits with <code>git reflog</code> and restore them with <code>git branch rescue &lt;hash&gt;</code>.</li>
<li><strong>Case 2.</strong> Make two commits on <code>main</code> in <code>chi</code>, push, and pull in <code>an</code>. Then in <code>chi</code>: <code>git branch feature/mine</code>, <code>git revert --no-edit HEAD~2..HEAD</code>, push. Run <code>git diff --stat &lt;commit before the mistake&gt; origin/main</code>.</li>
</ol>
<p><strong>Done when:</strong> (a) after Case 1 <code>main</code> equals <code>origin/main</code> and the branch holds both commits; (b) the rescue branch in step 3 contains the "lost" commits; (c) after Case 2 the <code>git diff --stat</code> prints nothing and <code>an</code> pulled without a force; (d) you can say which of the two commands you would use for "pushed, nobody else pulled yet" and why.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ahead / behind</span><span class="v">In <code>git status -sb</code>: how many commits your branch has that its upstream lacks, and the reverse.</span></div>
  <div class="kv"><span class="k">git reset --hard</span><span class="v">Move the branch pointer and overwrite files to match. Rewrites history: only for commits that never left your machine.</span></div>
  <div class="kv"><span class="k">git revert</span><span class="v">Create a new commit that undoes an earlier one. History only grows, so it is safe on shared branches.</span></div>
  <div class="kv"><span class="k">reflog</span><span class="v">Git's private diary of where <code>HEAD</code> has been; the net under a bad reset.</span></div>
  <div class="kv"><span class="k">pre-push hook</span><span class="v">A script in <code>.git/hooks</code> that runs before a push and can cancel it.</span></div>
  <div class="kv"><span class="k">shared branch</span><span class="v">A branch other people pull from; its history must only be added to.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>First question: has the commit left my laptop? <code>git status -sb</code> answers it (<code>ahead N</code>).</li><li>Not pushed: <code>git branch</code> to keep the work, <code>git reset --hard origin/main</code>, <code>git switch</code> to the new branch.</li><li>Pushed: <code>git revert</code> (for several commits: <code>HEAD~N..HEAD</code>); never reset and force-push a shared branch.</li><li>A reset that went too far is recoverable from <code>git reflog</code> for a while — do not panic, do not close the terminal's history.</li><li>The cheap prevention is to branch first and to make <code>main</code> reject direct pushes.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-reset" target="_blank" rel="noopener">
  <span class="lc-ico">⏪</span>
  <span class="lc-body"><span class="lc-title">git-scm — git reset</span><span class="lc-sub">The three modes and the table of what each moves.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-revert" target="_blank" rel="noopener">
  <span class="lc-ico">↩️</span>
  <span class="lc-body"><span class="lc-title">git-scm — git revert</span><span class="lc-sub">Reverting one commit, a range, and a merge commit (-m).</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-reflog" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">git-scm — git reflog</span><span class="lc-sub">The log of where HEAD and branch tips have been.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>How this goes wrong in a student team project.</strong> <b>Running <code>git reset --hard origin/main</code> before saving the work on a branch</b>, then believing it is lost. <b>Fixing a pushed mistake with <code>reset --hard</code> and <code>push --force</code></b> so that the three teammates who pulled in between get duplicated or vanished commits. <b>Reverting only the last of three commits</b> and leaving the first two on <code>main</code>. <b>Deleting the whole clone and cloning again</b> to "start clean", with the unpushed commits still inside it.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.4</span>
<h2>"Mình commit trên main cả hai tuần nay"</h2>
<p class="lead">Đây là tai nạn phổ biến nhất trong đồ án sinh viên và dễ sửa nhất — miễn là bạn hỏi trước một câu: <strong>commit này đã rời khỏi laptop của mình chưa?</strong> Nếu chưa, chưa gì công khai và bạn dời việc sang nhánh bằng ba lệnh. Nếu rồi, bạn không được viết lại lịch sử mà người khác đã pull; bạn thêm một commit hoàn tác nó. Hai trường hợp dùng hai lệnh khác nhau, và nhầm lẫn giữa chúng là cách một lỗi nhỏ thành lỗi lớn.</p>
<p>Output: lab của chương, <strong>git version 2.51.1</strong>, remote <code>/tmp/lab18/github.git</code>. <code>reset</code>, <code>revert</code> và <code>reflog</code> được dạy ở Chương 4 và Chương 13; bài này là quyết định "dùng cái nào, hôm nay, trong một nhóm".</p>

<h3>Trước hết, biết mình đang ở đâu</h3>
${slide('git-18', 11, 'main ahead 2: dời việc sang nhánh rồi đưa main về origin/main')}
<p>Chi quên tạo nhánh và làm hai commit ngay trên <code>main</code>. Trước khi đụng vào gì, bạn ấy hỏi Git:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git commit -qam "Login bang email"
git commit -qam "index: nut dang nhap"
git status -sb</code></pre>
<div class="out">## main...origin/main [ahead 2]</div>
<pre><code class="language-bash">git log --oneline -4</code></pre>
<div class="out">182ad94 index: nut dang nhap
a135628 Login bang email
6994417 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p><code>## main...origin/main [ahead 2]</code> là câu trả lời: hai commit chỉ tồn tại ở đây. Chưa ai khác có chúng. <code>git status -sb</code> (<code>-sb</code> là định dạng ngắn kèm dòng nhánh) là câu hỏi nên hỏi trước mọi cuộc cứu hộ; hai câu trả lời có thể khác là <code>[ahead 2, behind 1]</code> (đã rẽ đôi — 18.3) và không có ngoặc nào (commit đã nằm trên remote — nửa sau bài này).</p>

<h3>Trường hợp 1 — chưa push: dời việc đi, rồi reset</h3>
<p>Ba lệnh: đặt một nhánh mới tại commit hiện tại (giữ việc), đưa <code>main</code> về chỗ remote đang đứng, rồi chuyển sang nhánh mới.</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git branch feature/dang-nhap-email
git reset --hard origin/main</code></pre>
<div class="out">HEAD is now at 6994417 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<pre><code class="language-bash">git switch feature/dang-nhap-email</code></pre>
<div class="out">Switched to branch 'feature/dang-nhap-email'</div>
<pre><code class="language-bash">git status -sb</code></pre>
<div class="out">## feature/dang-nhap-email</div>
<pre><code class="language-bash">git log --oneline --graph --all --decorate</code></pre>
<div class="out">* 182ad94 (HEAD -&gt; feature/dang-nhap-email) index: nut dang nhap
* a135628 Login bang email
* 6994417 (origin/main, origin/HEAD, main) Khoi tao du an NetBeans: Login, Home, web.xml
</div>
<pre><code class="language-bash">git reflog -5</code></pre>
<div class="out">182ad94 HEAD@{0}: checkout: moving from main to feature/dang-nhap-email
6994417 HEAD@{1}: reset: moving to origin/main
182ad94 HEAD@{2}: commit: index: nut dang nhap
a135628 HEAD@{3}: commit: Login bang email
6994417 HEAD@{4}: clone: from /tmp/lab18/github.git</div>
<pre><code class="language-bash">git branch cuu-ho HEAD@{2}
git log --oneline -3 cuu-ho</code></pre>
<div class="out">182ad94 index: nut dang nhap
a135628 Login bang email
6994417 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p>Đọc đồ thị: nhánh <code>feature/dang-nhap-email</code> mang cả hai commit; <code>main</code> về lại <code>origin/main</code>. <code>git reset --hard origin/main</code> an toàn <em>ở đây</em> chỉ vì các commit đã với tới được từ nhánh mới — nếu Chi chạy nó trước khi tạo nhánh, các commit sẽ biến khỏi mọi nhánh. Nếu chuyện đó xảy ra, mấy dòng cuối là tấm lưới: <code>git reflog</code> nhớ <code>HEAD</code> từng ở đâu (<code>HEAD@{2}: commit: index: nut dang nhap</code>), và <code>git branch rescue &lt;mã băm&gt;</code> mang commit về (Chương 13).</p>

<h3>Khi reset đi trước: reflog</h3>
<p>Nếu các commit không còn nằm trên nhánh nào thì chúng chưa mất. <code>git reflog</code> là cuốn nhật ký riêng của Git về nơi <code>HEAD</code> từng đứng: mỗi commit, checkout, reset là một dòng, mới nhất ở trên. Trong output ở trên hãy đọc dòng <code>HEAD@{2}: commit: index: nut dang nhap</code> — đó là commit thứ hai của Chi, vẫn gọi được bằng <code>HEAD@{2}</code> sau lần reset. <code>git branch cuu-ho 'HEAD@{2}'</code> (dấu nháy giữ cho shell không đụng vào cặp ngoặc nhọn) ghim nó vào một nhánh mới, và <code>git log --oneline -3 cuu-ho</code> chứng minh cả hai commit đã quay về. Mặc định Git giữ mục reflog 90 ngày, và với commit không nhánh nào trỏ tới thì 30 ngày (các cài đặt <code>gc.reflogExpire</code>) — đủ rộng rãi nhưng không mãi mãi, và reflog chỉ nằm trong clone của <em>bạn</em>: xoá thư mục là mất cả nó.</p>
<h3>Trường hợp 2 — đã push: revert, đừng viết lại</h3>
<p>Giờ cùng lỗi đó, nhưng Chi còn chạy <code>git push origin main</code>, và An đã pull:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git commit -qam "Login bang email"
git commit -qam "index: nut dang nhap"
git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   a9576f4..a6db29f  main -&gt; main
</div>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git pull -q
git log --oneline -3</code></pre>
<div class="out">a6db29f index: nut dang nhap
488dcf1 Login bang email
a9576f4 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p>Các commit nằm trên nhánh chung và trong clone của An. Dùng <code>reset</code> + <code>push --force</code> sẽ viết lại một nhánh mà người khác đã có (18.3). Thay vào đó Chi giữ việc trên một nhánh rồi <strong>revert</strong> hai commit — Git thêm commit mới hoàn tác chúng:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git branch feature/dang-nhap-email
git revert --no-edit HEAD~2..HEAD</code></pre>
<div class="out">[main e74c7ce] Revert "index: nut dang nhap"
 Date: Sat Oct 31 21:54:43 2026 +0700
 1 file changed, 1 deletion(-)
[main d76505a] Revert "Login bang email"
 Date: Sat Oct 31 21:54:43 2026 +0700
 1 file changed, 1 deletion(-)</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   a6db29f..d76505a  main -&gt; main</div>
<pre><code class="language-bash">git log --oneline --graph --all --decorate</code></pre>
<div class="out">* d76505a (HEAD -&gt; main, origin/main, origin/HEAD) Revert "Login bang email"
* e74c7ce Revert "index: nut dang nhap"
* a6db29f (feature/dang-nhap-email) index: nut dang nhap
* 488dcf1 Login bang email
* a9576f4 Khoi tao du an NetBeans: Login, Home, web.xml
</div>
<pre><code class="language-bash">git diff --stat origin/main~4 origin/main
<span class="tok-comment"># — An —</span>
git pull -q
git log --oneline -5</code></pre>
<div class="out">d76505a Revert "Login bang email"
e74c7ce Revert "index: nut dang nhap"
a6db29f index: nut dang nhap
488dcf1 Login bang email
a9576f4 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p>Đồ thị cho thấy hình dạng: hai commit gốc vẫn nằm trong lịch sử, hai commit <code>Revert …</code> đi sau; <code>main</code> có lại nội dung cũ. <code>git diff --stat origin/main~4 origin/main</code> không in gì vì nội dung <code>main</code> giờ bằng nội dung bốn commit trước — bằng chứng nhanh rằng revert đã đúng. Lần <code>git pull</code> kế của An là một fast-forward bình thường. Việc của Chi an toàn trên <code>feature/dang-nhap-email</code>, sẵn sàng cho một pull request đàng hoàng.</p>
<div class="callout warn">Có một cái bẫy cho bước <em>kế tiếp</em>: khi Chi sau này merge nhánh của mình, Git thấy hai commit đó đã là một phần của <code>main</code> (bị revert nhưng vẫn có mặt) và sẽ không mang chúng lại. Lối ra nằm ở 18.6 — revert cái revert.</div>

<h3>Dùng cái nào — reset hay revert?</h3>
${slide('git-18', 12, 'reset hay revert: hỏi một câu — commit đã rời máy chưa?')}
<table>
<thead><tr><th>Tình huống</th><th>Dùng</th><th>Vì sao</th></tr></thead>
<tbody>
<tr><td>Commit chỉ nằm trên laptop của bạn</td><td><code>branch</code> + <code>reset --hard origin/main</code></td><td>Chưa ai khác có; viết lại lịch sử chưa chia sẻ của chính bạn là miễn phí.</td></tr>
<tr><td>Commit đã push lên nhánh chung</td><td><code>revert</code></td><td>Thêm lịch sử thay vì đổi nó; pull của mọi người vẫn chạy.</td></tr>
<tr><td>Đã push, nhưng chỉ lên nhánh tính năng riêng không ai dùng</td><td><code>reset</code> + <code>push --force-with-lease</code></td><td>Được phép, nếu bạn chắc chưa ai pull.</td></tr>
<tr><td>Không chắc ai đang có</td><td><code>revert</code></td><td>Luôn an toàn; cái giá là thêm hai commit.</td></tr>
</tbody></table>

<h3>Phòng ngừa</h3>
<ul>
<li><strong>Để terminal nói cho bạn biết.</strong> Hiện tên nhánh trong dấu nhắc (Git Bash có sẵn; zsh trên Mac thêm <code>%b</code> qua <code>vcs_info</code>, hoặc dùng thanh trạng thái VS Code). Bạn không commit nhầm lên <code>main</code> được nếu bạn thấy chữ <code>main</code>.</li>
<li><strong>Luôn rẽ nhánh trước:</strong> <code>git switch -c feature/&lt;thẻ&gt;</code> là lệnh đầu tiên của mọi việc (Khởi động nhanh, KĐ.7).</li>
<li><strong>Cho <code>main</code> từ chối push trực tiếp</strong> trên GitHub (18.5): khi đó commit nhầm ở lại laptop và Trường hợp 1 sửa được.</li>
<li><strong>Lưới an toàn cục bộ:</strong> hook <code>pre-push</code> chặn <code>git push</code> khi nhánh hiện tại là <code>main</code> (Chương 12).</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong sân tập: remote bare, hai clone <code>an</code> và <code>chi</code>, một commit đã push trên <code>main</code>.</li>
<li><strong>Trường hợp 1.</strong> Trong <code>chi</code> làm hai commit trên <code>main</code> không có nhánh. Chạy <code>git status -sb</code> và chép dòng đó. Dời việc: <code>git branch feature/mine</code>, <code>git reset --hard origin/main</code>, <code>git switch feature/mine</code>. Kiểm bằng <code>git log --oneline --graph --all --decorate</code>.</li>
<li>Cố ý làm hỏng: từ <code>main</code> trong <code>chi</code> lặp lại hai commit của bước 2, chạy <code>git reset --hard origin/main</code> <em>trước</em>, rồi tìm commit "đã mất" bằng <code>git reflog</code> và khôi phục bằng <code>git branch rescue &lt;mã băm&gt;</code>.</li>
<li><strong>Trường hợp 2.</strong> Làm hai commit trên <code>main</code> trong <code>chi</code>, push, rồi pull trong <code>an</code>. Sau đó trong <code>chi</code>: <code>git branch feature/mine</code>, <code>git revert --no-edit HEAD~2..HEAD</code>, push. Chạy <code>git diff --stat &lt;commit trước lỗi&gt; origin/main</code>.</li>
</ol>
<p><strong>Đạt khi:</strong> (a) sau Trường hợp 1, <code>main</code> bằng <code>origin/main</code> và nhánh giữ cả hai commit; (b) nhánh rescue ở bước 3 chứa các commit "đã mất"; (c) sau Trường hợp 2, <code>git diff --stat</code> không in gì và <code>an</code> pull không cần force; (d) bạn nói được với tình huống "đã push, chưa ai pull" thì dùng lệnh nào trong hai lệnh, và vì sao.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ahead / behind</span><span class="v">Trong <code>git status -sb</code>: nhánh bạn có bao nhiêu commit mà upstream chưa có, và ngược lại.</span></div>
  <div class="kv"><span class="k">git reset --hard</span><span class="v">Dời con trỏ nhánh và ghi đè tệp cho khớp. Viết lại lịch sử: chỉ cho commit chưa từng rời máy bạn.</span></div>
  <div class="kv"><span class="k">git revert</span><span class="v">Tạo một commit mới hoàn tác commit trước. Lịch sử chỉ dài thêm nên an toàn trên nhánh chung.</span></div>
  <div class="kv"><span class="k">reflog</span><span class="v">Cuốn nhật ký riêng của Git về nơi <code>HEAD</code> từng đứng; tấm lưới dưới một lần reset hỏng.</span></div>
  <div class="kv"><span class="k">pre-push hook</span><span class="v">Tập lệnh trong <code>.git/hooks</code> chạy trước khi push và có thể huỷ push.</span></div>
  <div class="kv"><span class="k">shared branch</span><span class="v">Nhánh chung: nhánh người khác pull từ đó; lịch sử của nó chỉ được thêm vào.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Câu hỏi đầu tiên: commit đã rời laptop chưa? <code>git status -sb</code> trả lời (<code>ahead N</code>).</li><li>Chưa push: <code>git branch</code> giữ việc, <code>git reset --hard origin/main</code>, <code>git switch</code> sang nhánh mới.</li><li>Đã push: <code>git revert</code> (nhiều commit: <code>HEAD~N..HEAD</code>); không bao giờ reset rồi force-push nhánh chung.</li><li>Reset đi quá đà vẫn cứu được từ <code>git reflog</code> một thời gian — đừng hoảng, đừng xoá clone.</li><li>Phòng ngừa rẻ nhất là rẽ nhánh trước và cho <code>main</code> từ chối push trực tiếp.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-reset" target="_blank" rel="noopener">
  <span class="lc-ico">⏪</span>
  <span class="lc-body"><span class="lc-title">git-scm — git reset</span><span class="lc-sub">Ba chế độ và bảng cho biết mỗi chế độ dời cái gì.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-revert" target="_blank" rel="noopener">
  <span class="lc-ico">↩️</span>
  <span class="lc-body"><span class="lc-title">git-scm — git revert</span><span class="lc-sub">Revert một commit, một khoảng, và một commit merge (-m).</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-reflog" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">git-scm — git reflog</span><span class="lc-sub">Nhật ký nơi HEAD và đầu các nhánh từng đứng.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Chuyện này hỏng thế nào trong đồ án nhóm.</strong> <b>Chạy <code>git reset --hard origin/main</code> trước khi cất việc vào một nhánh</b>, rồi tin là mất. <b>Sửa lỗi đã push bằng <code>reset --hard</code> và <code>push --force</code></b> để ba bạn pull giữa chừng bị nhân đôi hoặc mất commit. <b>Chỉ revert commit cuối trong ba commit</b> và để hai commit đầu trên <code>main</code>. <b>Xoá cả clone rồi clone lại</b> cho "sạch", trong khi các commit chưa push vẫn nằm trong đó.</div>
</div>
`,
    },

    /* ─────────────────────────── 18.5 ─────────────────────────── */
    {
      title: '18.5 — Accident: merging your own change without a review|||18.5 — Tai nạn: tự merge không ai review',
      slug: 'git-18-5-tu-merge-khong-review',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Một merge không qua PR đưa lỗi trùng url-pattern lên main. Cách nhận ra từ lịch sử, rào chắn bằng ruleset + CODEOWNERS trên GitHub (chỉ đường theo docs 10/2026; lab dùng hook MÔ PHỎNG), và danh sách năm câu hỏi review cho nhóm sinh viên.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.5</span>
<h2>"It was a tiny change, so I merged it myself"</h2>
<p class="lead">A review is not about distrust; it is the only moment when a second pair of eyes looks at a change <em>before</em> it reaches everybody. In a student team the pressure to skip it is real: the deadline is tonight, the change is "tiny", and the reviewer is asleep. This lesson shows what a skipped review costs in a concrete case (a duplicate URL mapping that stops Tomcat), how to see afterwards that it happened, and how to make <code>main</code> refuse the shortcut — on GitHub for real, and in the lab with a clearly labelled simulation.</p>
<p>Outputs: this chapter's lab, <strong>git version 2.51.1</strong>, remote <code>/tmp/lab18/github.git</code>. Pull request mechanics and the "author cannot approve" rule are Chapter 6; project setup with protection and CODEOWNERS is Chapter 16.1 — this lesson is the accident and its prevention.</p>

<h3>The accident</h3>
${slide('git-18', 13, 'Merge không qua PR và merge có rào chắn')}
<p>Bình adds <code>TrangChuServlet</code> and maps it to <code>/home</code> in <code>web.xml</code> — a URL that <code>HomeServlet</code> already owns. Instead of opening a pull request he merges his branch into <code>main</code> locally and pushes. No pull request, no review, no build on anybody else's machine:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git switch -c feature/trang-chu-moi</code></pre>
<div class="out">Switched to a new branch 'feature/trang-chu-moi'</div>
<pre><code class="language-bash">git commit -qam "Them TrangChuServlet (map /home)"
git switch main</code></pre>
<div class="out">Switched to branch 'main'
Your branch is up to date with 'origin/main'.</div>
<pre><code class="language-bash">git merge --no-ff feature/trang-chu-moi -m "Merge nhanh trang-chu-moi (khong qua PR)"</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 web/WEB-INF/web.xml | 8 ++++++++
 1 file changed, 8 insertions(+)</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   4980995..4f830c9  main -&gt; main
</div>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git pull</code></pre>
<div class="out">From /tmp/lab18/github
   4980995..4f830c9  main       -&gt; origin/main
Updating 4980995..4f830c9
Fast-forward
 web/WEB-INF/web.xml | 8 ++++++++
 1 file changed, 8 insertions(+)</div>
<pre><code class="language-bash">git log --first-parent --oneline -3</code></pre>
<div class="out">4f830c9 Merge nhanh trang-chu-moi (khong qua PR)
4980995 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<pre><code class="language-bash">git log --merges --first-parent "--format=%h %an: %s" -3</code></pre>
<div class="out">4f830c9 Binh Tran: Merge nhanh trang-chu-moi (khong qua PR)</div>
<pre><code class="language-bash">grep -c "&lt;url-pattern&gt;/home&lt;/url-pattern&gt;" web/WEB-INF/web.xml</code></pre>
<div class="out">2</div>
<p>Everyone who pulls now has two servlets mapped to <code>/home</code>, a configuration Tomcat rejects at deployment. The line <code>grep -c</code> printed <code>2</code>: the pattern appears twice. The merge itself is perfectly valid Git; Git cannot know that two URLs collide. Only a human (or a build that starts the app) can.</p>

<h3>How to see afterwards that a review was skipped</h3>
<p>The history of <code>main</code> tells the story. <code>git log --first-parent --oneline</code> shows what each step on <code>main</code> was, and <code>--merges</code> with a format shows who made each merge. On GitHub a merged pull request leaves a commit titled <em>Merge pull request #N from …</em>; a merge with any other title (here <em>"Merge nhanh trang-chu-moi (khong qua PR)"</em>) was made on a laptop. If the PR list has no entry for a commit that is on <code>main</code>, nobody reviewed it.</p>

<h3>The remedy that works: make <code>main</code> refuse the shortcut</h3>
<p>Good intentions do not survive a deadline night; rules enforced by the server do. In the lab the remote carries a small hook that rejects pushes to <code>main</code>. <strong>This is a simulation</strong>: GitHub's real message is different, but the effect for the person who typed the command is the same:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git commit -qam "index.jsp: them footer"
git push origin main</code></pre>
<div class="out">remote: MO PHONG luat bao ve nhanh: main chi nhan thay doi qua pull request.        
To /tmp/lab18/github.git
 ! [remote rejected] main -&gt; main (pre-receive hook declined)
error: failed to push some refs to '/tmp/lab18/github.git'
</div>
<pre><code class="language-bash">git branch -f feature/footer HEAD
git reset -q --hard origin/main
git switch feature/footer</code></pre>
<div class="out">Switched to branch 'feature/footer'</div>
<pre><code class="language-bash">git push -u origin feature/footer</code></pre>
<div class="out">To /tmp/lab18/github.git
 * [new branch]      feature/footer -&gt; feature/footer
branch 'feature/footer' set up to track 'origin/feature/footer'.</div>
<p>An's direct push is refused; the correct way — a branch, pushed, then a pull request — goes through. The hook is only these lines in <code>hooks/pre-receive</code> of the bare repository:</p>
<pre><code class="language-bash"><span class="tok-comment">#!/bin/sh   (simulation of "main only accepts pull requests")</span>
while read old new ref; do
  if [ "$ref" = "refs/heads/main" ] &amp;&amp; [ -z "$LAB18_QUA_PR" ]; then
    echo "SIMULATION: main only accepts changes through a pull request." &gt;&amp;2
    exit 1
  fi
done</code></pre>

<h3>Turning it on in GitHub (as of 10/2026)</h3>
<p>On GitHub the same idea is a <strong>ruleset</strong>. Path in the repository: <em>Settings → Rulesets → New ruleset → New branch ruleset</em> (per GitHub Docs). Then:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Name and status</div><div class="lz-d">A name such as <code>protect-main</code>; Enforcement status <strong>Active</strong> (Disabled keeps it saved but off).</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Target</div><div class="lz-d">Under <em>Target branches</em> choose <em>Add a target</em> → the default branch (<code>main</code>).</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Rules to tick</div><div class="lz-d"><em>Restrict deletions</em> · <em>Require a pull request before merging</em> (with 1 required approval, <em>Dismiss stale pull request approvals when new commits are pushed</em>, and review from Code Owners) · <em>Require status checks to pass</em> · <em>Block force pushes</em>.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Bypass list</div><div class="lz-d">Leave it <strong>empty</strong> for a student project. A bypass for "the leader" is exactly the shortcut you are closing.</div></div>
</div>
<div class="callout warn"><strong>Check before you promise it to the team.</strong> GitHub's page on rulesets says they are available "for customers on GitHub Team and GitHub Enterprise plans" and does not state in that page how they behave for a private repository on a Free account (Chapter 16.1 records the plan conditions as read on 09/2026). Open <em>Settings → Rulesets</em> on your own repository and see whether you can create and activate one; the older <em>branch protection rule</em> (<em>Settings → Branches</em>) is the other place to look. If neither is available for your repository, keep the rule as a written team agreement, and use the <code>pre-push</code> hook from 18.4 on each laptop.</div>
<p>With 1 required approval a three-person team works: the author cannot approve their own pull request (Chapter 6.2), so one of the other two must. With a team of two, requiring approval blocks everybody on a day when one is ill — decide this on purpose, do not discover it at night.</p>

<h3>CODEOWNERS: the shared files get named reviewers</h3>
<p>The files that cause the most damage when changed unreviewed are the shared ones: <code>web.xml</code>, <code>pom.xml</code>, the menu page. A <code>CODEOWNERS</code> file (in <code>.github/</code>, the repository root or <code>docs/</code>) says who is asked to review changes to which paths; in the pattern list the <strong>last matching line wins</strong>:</p>
<pre><code class="language-bash"><span class="tok-comment"># .github/CODEOWNERS  — the LAST matching pattern takes precedence</span>
*                         @an-nguyen
/web/WEB-INF/web.xml      @an-nguyen @binh-tran
/pom.xml                  @an-nguyen
/nbproject/project.properties  @binh-tran</code></pre>
<p>Every owner needs write access to the repository; when a line lists several owners, an approval from any one of them satisfies the rule. It only <em>blocks</em> merging if the ruleset (or branch protection) has "require review from Code Owners" ticked; otherwise it just requests the review.</p>

<h3>A five-question review for a student pull request</h3>
<ol>
<li><strong>Does it build?</strong> Pull the branch and press Build (CI does this for you once Chapter 16.1 is set up).</li>
<li><strong>Does it touch a shared file?</strong> <code>web.xml</code>, <code>pom.xml</code>, a menu, a CSS file — read those lines slowly (URL collisions, duplicate names, a mapping that shadows another).</li>
<li><strong>Is there anything that is not source?</strong> <code>build/</code>, <code>dist/</code>, <code>nbproject/private/</code>, a <code>.env</code>, a password in a string (18.1).</li>
<li><strong>Does the description say what and why?</strong> One sentence is enough; "update" is not.</li>
<li><strong>Could I run it?</strong> One URL or one screen you clicked through before pressing Approve.</li>
</ol>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>In the sandbox make a bare remote and two clones. Commit a <code>web.xml</code> with one <code>/home</code> mapping and push.</li>
<li>In <code>binh</code>: on a branch add a second servlet mapped to <code>/home</code>, then merge it into <code>main</code> locally with <code>git merge --no-ff</code> and push. In <code>an</code> pull and run <code>git log --first-parent --oneline</code> and <code>git log --merges --first-parent --format="%h %an: %s"</code>.</li>
<li>Install the hook above as <code>hooks/pre-receive</code> in the bare repository (<code>chmod +x</code>), then in <code>an</code> try a direct push to <code>main</code> and copy the message. Push a branch instead.</li>
<li>On a GitHub repository of your own (a private test repo): open <em>Settings → Rulesets</em>, create <code>protect-main</code> as in the steps above and take a note of which of the four rules you were able to tick. If you cannot create it, write down the exact message or missing menu.</li>
<li>Write a <code>CODEOWNERS</code> naming two people for <code>web.xml</code> and commit it on a branch.</li>
</ol>
<p><strong>Done when:</strong> (a) the history output shows a merge that is not <em>Merge pull request #…</em>; (b) the direct push is rejected and the branch push accepted; (c) you have either an active ruleset on a test repository or the exact reason it cannot be created; (d) the <code>CODEOWNERS</code> line for <code>web.xml</code> lists two owners.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ruleset</span><span class="v">A GitHub setting that enforces rules on branches (require pull request, block force push, …); can be Active or Disabled, with a bypass list.</span></div>
  <div class="kv"><span class="k">branch protection rule</span><span class="v">The older GitHub mechanism with similar rules, set per branch pattern.</span></div>
  <div class="kv"><span class="k">CODEOWNERS</span><span class="v">A file mapping paths to the people or teams who are asked to review changes to them.</span></div>
  <div class="kv"><span class="k">required approval</span><span class="v">The number of approving reviews a pull request needs before the merge button works.</span></div>
  <div class="kv"><span class="k">bypass</span><span class="v">Exempting a role or person from a ruleset. For a student team, leave it empty.</span></div>
  <div class="kv"><span class="k">pre-receive hook</span><span class="v">A script on the remote repository that can reject a push before it is accepted (what the lab simulates).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A skipped review is invisible to Git: two servlets on <code>/home</code> are valid commits and invalid configuration.</li><li>You can recognise a skipped review in history: a merge on <code>main</code> that is not <em>Merge pull request #N</em>, or a commit with no pull request.</li><li>Rules enforced by the server beat good intentions: ruleset on <code>main</code> with a required pull request, a required approval, no force pushes and an empty bypass list.</li><li>CODEOWNERS makes the shared files (<code>web.xml</code>, <code>pom.xml</code>) have named reviewers.</li><li>Check on your own repository whether your plan lets you enable the ruleset; if not, agree it in writing and add a local <code>pre-push</code> hook.</li></ul>

<a class="link-card" href="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Creating rulesets for a repository</span><span class="lc-sub">The exact menu path, enforcement status, target branches and bypass list.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Available rules for rulesets</span><span class="lc-sub">The full list of rules: pull request, status checks, block force pushes, restrict deletions.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners" target="_blank" rel="noopener">
  <span class="lc-ico">👥</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — About code owners</span><span class="lc-sub">File locations, syntax and the last-match-wins rule.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>How this goes wrong in a student team project.</strong> <b>Putting the leader on the bypass list</b> "for emergencies", and the leader's own change at 2 a.m. is the one that breaks the demo. <b>Ticking "require approval" on a two-person team</b> and finding on deadline night that nobody can merge. <b>Approving without opening the branch</b> ("LGTM") so the review only looks like a review. <b>Believing the protection works because the checkbox is on</b>, without ever trying a direct push to <code>main</code> to see it refused.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.5</span>
<h2>"Thay đổi bé tí nên mình tự merge luôn"</h2>
<p class="lead">Review không phải vì không tin nhau; đó là khoảnh khắc duy nhất có cặp mắt thứ hai nhìn một thay đổi <em>trước</em> khi nó tới mọi người. Trong nhóm sinh viên, áp lực bỏ qua nó là có thật: tối nay hết hạn, thay đổi "bé tí", và người review đang ngủ. Bài này chỉ ra một lượt bỏ review tốn gì trong một ca cụ thể (ánh xạ URL trùng làm Tomcat không chạy), cách nhìn lịch sử để biết chuyện đã xảy ra, và cách bắt <code>main</code> từ chối đường tắt — trên GitHub thật, và trong lab bằng một bản mô phỏng ghi rõ là mô phỏng.</p>
<p>Output: lab của chương, <strong>git version 2.51.1</strong>, remote <code>/tmp/lab18/github.git</code>. Cơ chế pull request và luật "tác giả không tự duyệt" ở Chương 6; dựng dự án có bảo vệ nhánh và CODEOWNERS ở Chương 16.1 — bài này là tai nạn và cách phòng.</p>

<h3>Tai nạn</h3>
${slide('git-18', 13, 'Merge không qua PR và merge có rào chắn')}
<p>Bình thêm <code>TrangChuServlet</code> và ánh xạ nó tới <code>/home</code> trong <code>web.xml</code> — một URL mà <code>HomeServlet</code> đã giữ. Thay vì mở pull request, bạn ấy merge nhánh vào <code>main</code> ngay trên máy rồi push. Không pull request, không review, không build nào trên máy người khác:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git switch -c feature/trang-chu-moi</code></pre>
<div class="out">Switched to a new branch 'feature/trang-chu-moi'</div>
<pre><code class="language-bash">git commit -qam "Them TrangChuServlet (map /home)"
git switch main</code></pre>
<div class="out">Switched to branch 'main'
Your branch is up to date with 'origin/main'.</div>
<pre><code class="language-bash">git merge --no-ff feature/trang-chu-moi -m "Merge nhanh trang-chu-moi (khong qua PR)"</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 web/WEB-INF/web.xml | 8 ++++++++
 1 file changed, 8 insertions(+)</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   4980995..4f830c9  main -&gt; main
</div>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git pull</code></pre>
<div class="out">From /tmp/lab18/github
   4980995..4f830c9  main       -&gt; origin/main
Updating 4980995..4f830c9
Fast-forward
 web/WEB-INF/web.xml | 8 ++++++++
 1 file changed, 8 insertions(+)</div>
<pre><code class="language-bash">git log --first-parent --oneline -3</code></pre>
<div class="out">4f830c9 Merge nhanh trang-chu-moi (khong qua PR)
4980995 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<pre><code class="language-bash">git log --merges --first-parent "--format=%h %an: %s" -3</code></pre>
<div class="out">4f830c9 Binh Tran: Merge nhanh trang-chu-moi (khong qua PR)</div>
<pre><code class="language-bash">grep -c "&lt;url-pattern&gt;/home&lt;/url-pattern&gt;" web/WEB-INF/web.xml</code></pre>
<div class="out">2</div>
<p>Ai pull về giờ cũng có hai servlet cùng ánh xạ tới <code>/home</code>, một cấu hình Tomcat từ chối lúc deploy. Dòng <code>grep -c</code> in ra <code>2</code>: mẫu xuất hiện hai lần. Bản thân phép merge là Git hoàn toàn hợp lệ; Git không thể biết hai URL va nhau. Chỉ con người (hoặc một lần build có chạy ứng dụng) mới biết.</p>

<h3>Làm sao biết sau đó rằng review đã bị bỏ qua</h3>
<p>Lịch sử của <code>main</code> kể lại chuyện. <code>git log --first-parent --oneline</code> cho thấy mỗi bước trên <code>main</code> là gì, và <code>--merges</code> kèm định dạng cho thấy ai làm từng lần merge. Trên GitHub, một pull request đã merge để lại commit tên <em>Merge pull request #N from …</em>; merge có tên khác (ở đây <em>"Merge nhanh trang-chu-moi (khong qua PR)"</em>) được làm trên một laptop. Nếu danh sách PR không có mục nào cho một commit đang nằm trên <code>main</code>, thì chưa ai review nó.</p>

<h3>Thuốc chữa có tác dụng: cho <code>main</code> từ chối đường tắt</h3>
<p>Thiện chí không sống nổi qua đêm sát hạn; luật do máy chủ thực thi thì sống. Trong lab, remote mang một hook nhỏ từ chối push vào <code>main</code>. <strong>Đây là mô phỏng</strong>: thông báo thật của GitHub khác, nhưng tác dụng với người gõ lệnh là như nhau:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git commit -qam "index.jsp: them footer"
git push origin main</code></pre>
<div class="out">remote: MO PHONG luat bao ve nhanh: main chi nhan thay doi qua pull request.        
To /tmp/lab18/github.git
 ! [remote rejected] main -&gt; main (pre-receive hook declined)
error: failed to push some refs to '/tmp/lab18/github.git'
</div>
<pre><code class="language-bash">git branch -f feature/footer HEAD
git reset -q --hard origin/main
git switch feature/footer</code></pre>
<div class="out">Switched to branch 'feature/footer'</div>
<pre><code class="language-bash">git push -u origin feature/footer</code></pre>
<div class="out">To /tmp/lab18/github.git
 * [new branch]      feature/footer -&gt; feature/footer
branch 'feature/footer' set up to track 'origin/feature/footer'.</div>
<p>Lần push thẳng của An bị từ chối; cách đúng — một nhánh, đẩy nhánh, rồi pull request — đi qua. Hook chỉ là mấy dòng này trong <code>hooks/pre-receive</code> của kho bare:</p>
<pre><code class="language-bash"><span class="tok-comment">#!/bin/sh   (mô phỏng "main chỉ nhận pull request")</span>
while read old new ref; do
  if [ "$ref" = "refs/heads/main" ] &amp;&amp; [ -z "$LAB18_QUA_PR" ]; then
    echo "MO PHONG: main chi nhan thay doi qua pull request." &gt;&amp;2
    exit 1
  fi
done</code></pre>

<h3>Bật nó trên GitHub (tính đến 10/2026)</h3>
<p>Trên GitHub, cùng ý đó là một <strong>ruleset</strong>. Đường đi trong repository: <em>Settings → Rulesets → New ruleset → New branch ruleset</em> (theo GitHub Docs). Sau đó:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Tên và trạng thái</div><div class="lz-d">Một cái tên như <code>protect-main</code>; Enforcement status chọn <strong>Active</strong> (Disabled thì lưu lại nhưng không áp dụng).</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Đối tượng</div><div class="lz-d">Ở <em>Target branches</em> chọn <em>Add a target</em> → nhánh mặc định (<code>main</code>).</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Luật cần tick</div><div class="lz-d"><em>Restrict deletions</em> · <em>Require a pull request before merging</em> (kèm 1 lượt duyệt bắt buộc, <em>Dismiss stale pull request approvals when new commits are pushed</em>, và review từ Code Owners) · <em>Require status checks to pass</em> · <em>Block force pushes</em>.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Danh sách bypass</div><div class="lz-d">Để <strong>trống</strong> với dự án sinh viên. Một lối vượt luật cho "trưởng nhóm" chính là đường tắt bạn đang đóng.</div></div>
</div>
<div class="callout warn"><strong>Kiểm trước khi hứa với nhóm.</strong> Trang về ruleset của GitHub nói chúng có cho "khách hàng của gói GitHub Team và GitHub Enterprise" và trong trang đó không nêu chúng hoạt động thế nào với repo riêng của tài khoản Free (Chương 16.1 ghi lại điều kiện gói như đã đọc ở 09/2026). Hãy mở <em>Settings → Rulesets</em> trên repo của chính bạn xem có tạo và kích hoạt được không; <em>branch protection rule</em> kiểu cũ (<em>Settings → Branches</em>) là nơi còn lại để xem. Nếu cả hai đều không dùng được cho repo của bạn, hãy giữ luật dưới dạng thoả thuận viết ra, và dùng hook <code>pre-push</code> của 18.4 trên từng laptop.</div>
<p>Với 1 lượt duyệt bắt buộc thì nhóm ba người chạy được: tác giả không tự duyệt pull request của mình (Chương 6.2) nên một trong hai người còn lại phải duyệt. Nhóm hai người mà bắt buộc duyệt thì chặn cả hai vào hôm một người ốm — hãy quyết định điều này có chủ ý, đừng phát hiện ra lúc nửa đêm.</p>

<h3>CODEOWNERS: tệp dùng chung có người review đích danh</h3>
<p>Những tệp gây hại nhiều nhất khi đổi mà không review là tệp dùng chung: <code>web.xml</code>, <code>pom.xml</code>, trang menu. Một tệp <code>CODEOWNERS</code> (trong <code>.github/</code>, thư mục gốc hoặc <code>docs/</code>) nói ai được mời review thay đổi ở đường dẫn nào; trong danh sách mẫu thì <strong>dòng khớp cuối cùng thắng</strong>:</p>
<pre><code class="language-bash"><span class="tok-comment"># .github/CODEOWNERS  — mẫu khớp CUỐI CÙNG được ưu tiên</span>
*                         @an-nguyen
/web/WEB-INF/web.xml      @an-nguyen @binh-tran
/pom.xml                  @an-nguyen
/nbproject/project.properties  @binh-tran</code></pre>
<p>Mỗi chủ sở hữu phải có quyền ghi vào repository; khi một dòng liệt kê nhiều người, một lượt duyệt từ bất kỳ ai trong số đó là đủ. Nó chỉ <em>chặn</em> merge nếu ruleset (hoặc branch protection) có tick "require review from Code Owners"; không thì nó chỉ mời review.</p>

<h3>Năm câu hỏi review cho một pull request của sinh viên</h3>
<ol>
<li><strong>Nó build được không?</strong> Kéo nhánh về và bấm Build (CI làm giúp bạn khi đã dựng xong Chương 16.1).</li>
<li><strong>Nó có đụng tệp dùng chung không?</strong> <code>web.xml</code>, <code>pom.xml</code>, menu, tệp CSS — đọc chậm những dòng đó (URL va nhau, trùng tên, một ánh xạ che ánh xạ khác).</li>
<li><strong>Có thứ nào không phải mã nguồn không?</strong> <code>build/</code>, <code>dist/</code>, <code>nbproject/private/</code>, một <code>.env</code>, mật khẩu trong một chuỗi (18.1).</li>
<li><strong>Phần mô tả có nói cái gì và vì sao không?</strong> Một câu là đủ; "update" thì không.</li>
<li><strong>Mình chạy thử được không?</strong> Một URL hoặc một màn hình bạn đã bấm qua trước khi nhấn Approve.</li>
</ol>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Trong sân tập dựng remote bare và hai clone. Commit một <code>web.xml</code> có một ánh xạ <code>/home</code> và push.</li>
<li>Trong <code>binh</code>: trên một nhánh thêm servlet thứ hai ánh xạ <code>/home</code>, rồi merge vào <code>main</code> cục bộ bằng <code>git merge --no-ff</code> và push. Trong <code>an</code> pull và chạy <code>git log --first-parent --oneline</code> và <code>git log --merges --first-parent --format="%h %an: %s"</code>.</li>
<li>Cài hook ở trên thành <code>hooks/pre-receive</code> trong kho bare (<code>chmod +x</code>), rồi trong <code>an</code> thử push thẳng lên <code>main</code> và chép thông báo. Thay vào đó hãy push một nhánh.</li>
<li>Trên một repo GitHub của riêng bạn (repo thử, private): mở <em>Settings → Rulesets</em>, tạo <code>protect-main</code> theo các bước trên và ghi lại trong bốn luật bạn tick được những luật nào. Nếu không tạo được, ghi lại đúng thông báo hoặc menu bị thiếu.</li>
<li>Viết một <code>CODEOWNERS</code> nêu hai người cho <code>web.xml</code> và commit nó trên một nhánh.</li>
</ol>
<p><strong>Đạt khi:</strong> (a) output lịch sử cho thấy một merge không phải <em>Merge pull request #…</em>; (b) lần push thẳng bị từ chối và lần push nhánh được nhận; (c) bạn có một ruleset đang Active trên repo thử, hoặc có lý do chính xác vì sao không tạo được; (d) dòng <code>CODEOWNERS</code> cho <code>web.xml</code> liệt kê hai người.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">ruleset</span><span class="v">Cài đặt của GitHub thực thi luật trên nhánh (bắt buộc pull request, chặn force push, …); có thể Active hoặc Disabled, kèm danh sách bypass.</span></div>
  <div class="kv"><span class="k">branch protection rule</span><span class="v">Cơ chế cũ của GitHub với các luật tương tự, đặt theo mẫu tên nhánh.</span></div>
  <div class="kv"><span class="k">CODEOWNERS</span><span class="v">Tệp ánh xạ đường dẫn tới người hoặc nhóm được mời review thay đổi ở đó.</span></div>
  <div class="kv"><span class="k">required approval</span><span class="v">Số lượt duyệt đồng ý một pull request cần trước khi nút merge dùng được.</span></div>
  <div class="kv"><span class="k">bypass</span><span class="v">Miễn một vai trò hay một người khỏi ruleset. Với nhóm sinh viên, để trống.</span></div>
  <div class="kv"><span class="k">pre-receive hook</span><span class="v">Tập lệnh trên kho remote có thể từ chối một lần push trước khi nhận (cái lab mô phỏng).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Một lượt bỏ review thì Git không thấy: hai servlet cùng <code>/home</code> là commit hợp lệ và cấu hình không hợp lệ.</li><li>Nhận ra review bị bỏ qua từ lịch sử: một merge trên <code>main</code> không phải <em>Merge pull request #N</em>, hoặc một commit không có pull request.</li><li>Luật do máy chủ thực thi thắng thiện chí: ruleset trên <code>main</code> bắt buộc pull request, một lượt duyệt, không force push, bypass để trống.</li><li>CODEOWNERS cho các tệp dùng chung (<code>web.xml</code>, <code>pom.xml</code>) người review đích danh.</li><li>Hãy kiểm trên repo của chính bạn xem gói hiện có cho bật ruleset không; nếu không, thoả thuận bằng văn bản và thêm hook <code>pre-push</code> cục bộ.</li></ul>

<a class="link-card" href="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Creating rulesets for a repository</span><span class="lc-sub">Đường menu chính xác, trạng thái áp dụng, nhánh đích và danh sách bypass.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Available rules for rulesets</span><span class="lc-sub">Danh sách đầy đủ luật: pull request, status check, chặn force push, hạn chế xoá.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners" target="_blank" rel="noopener">
  <span class="lc-ico">👥</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — About code owners</span><span class="lc-sub">Vị trí tệp, cú pháp và luật dòng khớp cuối thắng.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Chuyện này hỏng thế nào trong đồ án nhóm.</strong> <b>Đưa trưởng nhóm vào danh sách bypass</b> "phòng khi khẩn cấp", và thay đổi lúc 2 giờ sáng của chính trưởng nhóm lại là cái làm hỏng buổi demo. <b>Tick "bắt buộc duyệt" trên nhóm hai người</b> rồi đêm sát hạn mới thấy không ai merge được. <b>Approve mà không mở nhánh</b> ("LGTM") nên review chỉ trông giống review. <b>Tin rằng bảo vệ nhánh đang chạy vì ô đã tick</b>, mà chưa từng thử push thẳng lên <code>main</code> để xem nó bị từ chối.</div>
</div>
`,
    },

    /* ─────────────────────────── 18.6 ─────────────────────────── */
    {
      title: '18.6 — Accident: undoing a merge that is already on main|||18.6 — Tai nạn: hoàn tác một merge đã nằm trên main',
      slug: 'git-18-6-hoan-tac-merge',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Merge hỏng chưa push thì reset về ORIG_HEAD; đã push thì git revert -m 1, và cái bẫy kinh điển sau đó: merge lại nhánh cũ báo "Already up to date" — cách thoát là revert cái revert. Mọi bước chạy thật trong lab.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.6</span>
<h2>The merge was a mistake. Can we take it back?</h2>
<p class="lead">You can, always — but the way depends on one fact: <strong>has the merge been pushed?</strong> Before the push the merge is a private experiment and you can erase it. After the push it is shared history, and the only safe way is to add a commit that cancels it. And then comes the trap that catches nearly everybody: after you cancel a merge, merging the same branch again does <em>nothing</em>. This lesson walks through all three situations with real output.</p>
<p>Outputs: this chapter's lab, <strong>git version 2.51.1</strong>, remote <code>/tmp/lab18/github.git</code>. Reverting an ordinary commit is Chapter 4.3 and the reset-or-revert table is in 18.4; here we deal with a <em>merge</em> commit, which has two parents and needs one extra option.</p>

<h3>Situation 1 — merged locally, not pushed yet</h3>
${slide('git-18', 14, 'Hoàn tác merge: ORIG_HEAD, revert -m 1, và revert cái revert')}
<p>Bình merges his branch into <code>main</code> and, before pushing, remembers the URL mapping is wrong:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git switch -c feature/trang-chu-moi</code></pre>
<div class="out">Switched to a new branch 'feature/trang-chu-moi'</div>
<pre><code class="language-bash">git commit -qam "Them TrangChuServlet (map /home)"
git switch main</code></pre>
<div class="out">Switched to branch 'main'
Your branch is up to date with 'origin/main'.</div>
<pre><code class="language-bash">git merge --no-ff feature/trang-chu-moi -m "Merge nhanh trang-chu-moi"</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 web/WEB-INF/web.xml | 8 ++++++++
 1 file changed, 8 insertions(+)</div>
<pre><code class="language-bash">git status -sb</code></pre>
<div class="out">## main...origin/main [ahead 2]
</div>
<pre><code class="language-bash">git reset --hard ORIG_HEAD</code></pre>
<div class="out">HEAD is now at 95bbff1 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<pre><code class="language-bash">git status -sb</code></pre>
<div class="out">## main...origin/main</div>
<pre><code class="language-bash">git log --oneline --graph --all</code></pre>
<div class="out">* 16c88d6 Them TrangChuServlet (map /home)
* 95bbff1 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p><code>[ahead 2]</code> — the merge commit and the branch commit are only here. Git stores the position <code>main</code> had before a merge in <code>ORIG_HEAD</code>, so going back is one command, and it is safe precisely because nothing was shared. The branch keeps the servlet commit, so no work is lost: the log at the end shows the branch's commit hanging off the original commit and <code>main</code> back where it was. (If the merge is still <em>in progress</em> with conflicts, the command is <code>git merge --abort</code> — 18.2.)</p>

<h3>Situation 2 — already on main: revert the merge</h3>
<h3>First, look at what a merge commit is</h3>
<p>A merge commit is the one place where a commit has <strong>two parents</strong>. <code>%p</code> prints them in order, and <code>HEAD^1</code>, <code>HEAD^2</code> name them:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git log --merges --first-parent "--format=%h %an: %s" -3</code></pre>
<div class="out">5a123a1 Binh Tran: Merge nhanh trang-chu-moi (khong qua PR)</div>
<pre><code class="language-bash">grep -c "&lt;url-pattern&gt;/home&lt;/url-pattern&gt;" web/WEB-INF/web.xml</code></pre>
<div class="out">2
</div>
<pre><code class="language-bash">git log --merges -1 "--format=merge %h  parents: %p"</code></pre>
<div class="out">merge 5a123a1  parents: 77fb638 a89b8c2</div>
<pre><code class="language-bash">git show --no-patch "--format=parent 1 = %h %s" HEAD^1</code></pre>
<div class="out">parent 1 = 77fb638 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<pre><code class="language-bash">git show --no-patch "--format=parent 2 = %h %s" HEAD^2</code></pre>
<div class="out">parent 2 = a89b8c2 Them TrangChuServlet (map /home)</div>
<p>Parent 1 is the commit <code>main</code> was on when the merge was made; parent 2 is the tip of the merged branch. "Undo this merge" therefore means "go back to parent 1" — and Git needs you to say so.</p>
<p>Now suppose Bình pushed, An pulled, and Tomcat refuses to start. A merge commit has <em>two</em> parents, so <code>git revert</code> must be told which side is "the mainline" to return to. <code>-m 1</code> means "parent number 1", which for a merge made on <code>main</code> is <code>main</code> itself (the first parent is the branch you were on):</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git revert -m 1 --no-edit HEAD</code></pre>
<div class="out">[main 0e2418c] Revert "Merge nhanh trang-chu-moi (khong qua PR)"
 Date: Sat Oct 31 21:54:46 2026 +0700
 1 file changed, 8 deletions(-)</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   5a123a1..0e2418c  main -&gt; main</div>
<pre><code class="language-bash">git log --oneline --graph --decorate -5</code></pre>
<div class="out">* 0e2418c (HEAD -&gt; main, origin/main, origin/HEAD) Revert "Merge nhanh trang-chu-moi (khong qua PR)"
*   5a123a1 Merge nhanh trang-chu-moi (khong qua PR)
|\\  
| * a89b8c2 Them TrangChuServlet (map /home)
|/  
* 77fb638 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p>The history is not rewritten: the merge commit <code>…</code> stays, and a new commit <em>Revert "Merge …"</em> sits on top and removes the eight lines that the branch had added (<code>1 file changed, 8 deletions(-)</code>). Everybody's next pull is an ordinary fast-forward. Without <code>-m 1</code> Git refuses (<code>error: commit … is a merge but no -m option was given</code>): it cannot know which parent you want to keep. If you pick the wrong number you "revert" the main side and keep the bad side.</p>

<h3>The trap: merging the fixed branch again does nothing</h3>
<p>Bình fixes the mapping and wants to bring the branch back. He switches to <code>main</code> and merges it:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git pull -q
git switch main</code></pre>
<div class="out">Already on 'main'
Your branch is up to date with 'origin/main'.</div>
<pre><code class="language-bash">git merge feature/trang-chu-moi</code></pre>
<div class="out">Already up to date.</div>
<p><strong><code>Already up to date.</code></strong> To Git the branch's commit is already an ancestor of <code>main</code> — it was merged, and the later revert is just another commit on top. Git only merges commits that are <em>not yet</em> ancestors. The original change is therefore "merged and cancelled", and no amount of re-merging will bring it back. There is a worse variant: Bình fixes the branch first and merges at once.</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git switch feature/trang-chu-moi</code></pre>
<div class="out">Switched to branch 'feature/trang-chu-moi'</div>
<pre><code class="language-bash">git commit -qam "TrangChuServlet: doi url-pattern sang /trang-chu"
git switch main</code></pre>
<div class="out">Switched to branch 'main'
Your branch is up to date with 'origin/main'.</div>
<pre><code class="language-bash">git merge feature/trang-chu-moi</code></pre>
<div class="out">Auto-merging web/WEB-INF/web.xml
CONFLICT (content): Merge conflict in web/WEB-INF/web.xml
Automatic merge failed; fix conflicts and then commit the result.</div>
<pre><code class="language-bash">git merge --abort</code></pre>
<p>This time the merge brings in only the <em>fix</em> (one line changed), but <code>main</code> no longer contains the block that the fix modifies — the revert removed it — so the two sides conflict on <code>web.xml</code>. It looks like a mysterious conflict; it is the revert at work.</p>

<h3>The way out: revert the revert</h3>
<p>Cancel the cancellation. That restores everything the merge brought, and then the merge of the fixed branch is a clean, small one. Do it <strong>locally and before you push</strong>, so the faulty state never reaches anyone:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git revert --no-edit 0e2418c</code></pre>
<div class="out">[main db94c00] Reapply "Merge nhanh trang-chu-moi (khong qua PR)"
 Date: Sat Oct 31 21:54:46 2026 +0700
 1 file changed, 8 insertions(+)</div>
<pre><code class="language-bash">git merge --no-ff feature/trang-chu-moi -m "Merge lai trang-chu-moi (da sua url-pattern)"</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 web/WEB-INF/web.xml | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)</div>
<pre><code class="language-bash">git grep -n url-pattern -- web/WEB-INF/web.xml</code></pre>
<div class="out">web/WEB-INF/web.xml:9:        &lt;url-pattern&gt;/login&lt;/url-pattern&gt;
web/WEB-INF/web.xml:17:        &lt;url-pattern&gt;/home&lt;/url-pattern&gt;
web/WEB-INF/web.xml:25:        &lt;url-pattern&gt;/trang-chu&lt;/url-pattern&gt;</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   0e2418c..cd917a8  main -&gt; main</div>
<pre><code class="language-bash">git log --oneline --graph -8</code></pre>
<div class="out">*   cd917a8 Merge lai trang-chu-moi (da sua url-pattern)
|\\  
| * 0710bca TrangChuServlet: doi url-pattern sang /trang-chu
* | db94c00 Reapply "Merge nhanh trang-chu-moi (khong qua PR)"
* | 0e2418c Revert "Merge nhanh trang-chu-moi (khong qua PR)"
* | 5a123a1 Merge nhanh trang-chu-moi (khong qua PR)
|\\| 
| * a89b8c2 Them TrangChuServlet (map /home)
|/  
* 77fb638 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p>In Git 2.51 the command names its new commit <em>Reapply "Merge …"</em>. The merge of the fixed branch then applies only the one changed line (<code>1 insertion(+), 1 deletion(-)</code>), the check <code>git grep url-pattern</code> shows <code>/trang-chu</code> instead of a second <code>/home</code>, and only then is it pushed. The graph is longer than anyone would like — merge, revert, reapply, fix, merge — and perfectly honest about what happened.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Alternative: a new branch</span><span class="v">Instead of reverting the revert, create a fresh branch from <code>main</code>, copy the fixed change onto it (<code>git cherry-pick</code> the feature commits — Chapter 8), and open a new pull request. Cleaner history of intent, more typing; good when the original branch was messy.</span></div>
  <div class="kv"><span class="k">Why not reset and force?</span><span class="v">It would hide the merge from the log, but every teammate who pulled has it, and a force push on <code>main</code> is the accident of 18.3.</span></div>
</div>

<h3>Prevent it</h3>
<ul>
<li><strong>Check before the push:</strong> <code>git status -sb</code> and <code>git log --oneline --graph -5</code>; two seconds that turn Situation 2 into Situation 1.</li>
<li><strong>Merge through a pull request</strong> (18.5): the merge button is "undo-able" in one click on GitHub (<em>Revert</em> on the merged pull request opens a new pull request that does exactly <code>revert -m 1</code> for you).</li>
<li><strong>Run the app after merging into your branch</strong> (18.2), not after merging into <code>main</code>.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol>
<li>Sandbox: bare remote, clones <code>an</code> and <code>binh</code>, a <code>web.xml</code> with a <code>/home</code> mapping pushed.</li>
<li><strong>Situation 1.</strong> In <code>binh</code> make a branch that adds a second <code>/home</code> mapping, merge it into <code>main</code> with <code>--no-ff</code> and do <em>not</em> push. Run <code>git status -sb</code>, then <code>git reset --hard ORIG_HEAD</code>, then <code>git status -sb</code> again.</li>
<li><strong>Situation 2.</strong> Repeat the merge, this time push it, and pull in <code>an</code>. In <code>an</code> run <code>git revert -m 1 --no-edit HEAD</code>, then push. Try the same command without <code>-m 1</code> in a scratch copy and copy the error.</li>
<li><strong>The trap.</strong> In <code>binh</code> pull, switch to <code>main</code> and run <code>git merge &lt;branch&gt;</code> — copy the message. Fix the mapping on the branch, commit, and merge again to see the conflict; <code>git merge --abort</code>.</li>
<li><strong>The way out.</strong> On <code>main</code> run <code>git revert --no-edit &lt;hash of the Revert commit&gt;</code>, merge the fixed branch with <code>--no-ff</code>, check <code>git grep url-pattern</code>, push.</li>
</ol>
<p><strong>Done when:</strong> (a) Situation 1 ends with <code>main</code> level with <code>origin/main</code> and the branch still holding its commit; (b) the revert of the merge removes the lines and pulls cleanly in <code>an</code>; (c) you have seen both <code>Already up to date.</code> and the conflict; (d) the final <code>web.xml</code> has exactly one <code>/home</code> and one <code>/trang-chu</code> mapping.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">merge commit</span><span class="v">A commit with two parents, created when two lines of history are joined.</span></div>
  <div class="kv"><span class="k">ORIG_HEAD</span><span class="v">A pointer Git sets before risky operations (merge, reset, rebase) remembering where <code>HEAD</code> was.</span></div>
  <div class="kv"><span class="k">revert -m 1</span><span class="v">Revert a merge commit, keeping parent 1 (the branch you merged <em>into</em>) as the mainline.</span></div>
  <div class="kv"><span class="k">revert the revert</span><span class="v">Revert the commit that cancelled a merge, so that the original changes are present again.</span></div>
  <div class="kv"><span class="k">ancestor</span><span class="v">A commit reachable by following parent links. Git merges only commits that are not already ancestors.</span></div>
  <div class="kv"><span class="k">merge --abort</span><span class="v">Cancel a merge that stopped on conflicts and return to the state before it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Not pushed: <code>git reset --hard ORIG_HEAD</code> (or <code>git merge --abort</code> if still in conflict); the branch keeps its work.</li><li>Pushed: <code>git revert -m 1 &lt;merge&gt;</code> adds a cancelling commit; the number says which parent is the mainline.</li><li>After a revert, merging the same branch says <code>Already up to date</code> because its commits are already ancestors.</li><li>The way out is to revert the revert (locally, before pushing), then merge the fixed branch — or cherry-pick onto a fresh branch.</li><li>Reading the log (<code>--graph</code>) beats guessing: the history shows exactly which of these situations you are in.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-revert" target="_blank" rel="noopener">
  <span class="lc-ico">↩️</span>
  <span class="lc-body"><span class="lc-title">git-scm — git revert</span><span class="lc-sub">The -m option for reverting a merge commit.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/howto/revert-a-faulty-merge.html" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">git-scm — How to revert a faulty merge</span><span class="lc-sub">The Git project's own account of the "revert the revert" problem.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-merge" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">git-scm — git merge</span><span class="lc-sub">--abort, --no-ff and how ORIG_HEAD is used.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/reverting-a-pull-request" target="_blank" rel="noopener">
  <span class="lc-ico">🧯</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Reverting a pull request</span><span class="lc-sub">The Revert button on a merged pull request.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>How this goes wrong in a student team project.</strong> <b>Reverting a merge without <code>-m 1</code></b> or with <code>-m 2</code>, and "reverting" the good side. <b>Re-merging the fixed branch, getting "Already up to date", and concluding that the fix was lost</b>; it was not, it just was never brought over. <b>Reverting the merge, then merging the branch again after fixing it</b> and resolving the surprise conflict by "accept mine", which silently drops the code. <b>Deleting the branch after the revert</b>, losing the only clean copy of the change.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.6</span>
<h2>Merge nhầm rồi. Rút lại được không?</h2>
<p class="lead">Được, luôn luôn — nhưng cách làm phụ thuộc vào một sự thật: <strong>merge đã được push chưa?</strong> Trước khi push, merge là một thí nghiệm riêng và bạn xoá được nó. Sau khi push, nó là lịch sử chung, và cách an toàn duy nhất là thêm một commit huỷ nó. Rồi tới cái bẫy bắt gần như mọi người: sau khi huỷ một merge, merge lại cùng nhánh đó <em>không làm gì cả</em>. Bài này đi qua cả ba tình huống bằng output thật.</p>
<p>Output: lab của chương, <strong>git version 2.51.1</strong>, remote <code>/tmp/lab18/github.git</code>. Revert một commit thường ở Chương 4.3 và bảng reset-hay-revert ở 18.4; ở đây nói về một commit <em>merge</em>, có hai cha và cần thêm một tuỳ chọn.</p>

<h3>Tình huống 1 — merge cục bộ, chưa push</h3>
${slide('git-18', 14, 'Hoàn tác merge: ORIG_HEAD, revert -m 1, và revert cái revert')}
<p>Bình merge nhánh của mình vào <code>main</code> và, trước khi push, nhớ ra ánh xạ URL bị sai:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git switch -c feature/trang-chu-moi</code></pre>
<div class="out">Switched to a new branch 'feature/trang-chu-moi'</div>
<pre><code class="language-bash">git commit -qam "Them TrangChuServlet (map /home)"
git switch main</code></pre>
<div class="out">Switched to branch 'main'
Your branch is up to date with 'origin/main'.</div>
<pre><code class="language-bash">git merge --no-ff feature/trang-chu-moi -m "Merge nhanh trang-chu-moi"</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 web/WEB-INF/web.xml | 8 ++++++++
 1 file changed, 8 insertions(+)</div>
<pre><code class="language-bash">git status -sb</code></pre>
<div class="out">## main...origin/main [ahead 2]
</div>
<pre><code class="language-bash">git reset --hard ORIG_HEAD</code></pre>
<div class="out">HEAD is now at 95bbff1 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<pre><code class="language-bash">git status -sb</code></pre>
<div class="out">## main...origin/main</div>
<pre><code class="language-bash">git log --oneline --graph --all</code></pre>
<div class="out">* 16c88d6 Them TrangChuServlet (map /home)
* 95bbff1 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p><code>[ahead 2]</code> — commit merge và commit của nhánh chỉ có ở đây. Git lưu vị trí <code>main</code> đứng trước một lần merge trong <code>ORIG_HEAD</code>, nên quay lại chỉ một lệnh, và an toàn chính vì chưa chia sẻ gì. Nhánh vẫn giữ commit servlet nên không mất việc: log cuối cho thấy commit của nhánh treo vào commit gốc và <code>main</code> về chỗ cũ. (Nếu merge còn <em>đang dở</em> vì xung đột thì lệnh là <code>git merge --abort</code> — 18.2.)</p>

<h3>Tình huống 2 — đã nằm trên main: revert cái merge</h3>
<h3>Trước hết, nhìn một commit merge là gì</h3>
<p>Commit merge là chỗ duy nhất một commit có <strong>hai cha</strong>. <code>%p</code> in chúng theo thứ tự, còn <code>HEAD^1</code>, <code>HEAD^2</code> gọi tên chúng:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git log --merges --first-parent "--format=%h %an: %s" -3</code></pre>
<div class="out">5a123a1 Binh Tran: Merge nhanh trang-chu-moi (khong qua PR)</div>
<pre><code class="language-bash">grep -c "&lt;url-pattern&gt;/home&lt;/url-pattern&gt;" web/WEB-INF/web.xml</code></pre>
<div class="out">2
</div>
<pre><code class="language-bash">git log --merges -1 "--format=merge %h  parents: %p"</code></pre>
<div class="out">merge 5a123a1  parents: 77fb638 a89b8c2</div>
<pre><code class="language-bash">git show --no-patch "--format=parent 1 = %h %s" HEAD^1</code></pre>
<div class="out">parent 1 = 77fb638 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<pre><code class="language-bash">git show --no-patch "--format=parent 2 = %h %s" HEAD^2</code></pre>
<div class="out">parent 2 = a89b8c2 Them TrangChuServlet (map /home)</div>
<p>Cha 1 là commit mà <code>main</code> đang đứng khi làm merge; cha 2 là đầu nhánh được merge. "Huỷ merge này" vì vậy nghĩa là "quay về cha 1" — và Git cần bạn nói rõ điều đó.</p>
<p>Giờ giả sử Bình đã push, An đã pull, và Tomcat không chịu khởi động. Một commit merge có <em>hai</em> cha, nên <code>git revert</code> phải được cho biết phía nào là "dòng chính" để quay về. <code>-m 1</code> nghĩa là "cha số 1", với một merge làm trên <code>main</code> thì đó chính là <code>main</code> (cha đầu tiên là nhánh bạn đang đứng):</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git revert -m 1 --no-edit HEAD</code></pre>
<div class="out">[main 0e2418c] Revert "Merge nhanh trang-chu-moi (khong qua PR)"
 Date: Sat Oct 31 21:54:46 2026 +0700
 1 file changed, 8 deletions(-)</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   5a123a1..0e2418c  main -&gt; main</div>
<pre><code class="language-bash">git log --oneline --graph --decorate -5</code></pre>
<div class="out">* 0e2418c (HEAD -&gt; main, origin/main, origin/HEAD) Revert "Merge nhanh trang-chu-moi (khong qua PR)"
*   5a123a1 Merge nhanh trang-chu-moi (khong qua PR)
|\\  
| * a89b8c2 Them TrangChuServlet (map /home)
|/  
* 77fb638 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p>Lịch sử không bị viết lại: commit merge vẫn còn, và một commit mới <em>Revert "Merge …"</em> nằm trên cùng, xoá tám dòng mà nhánh đã thêm (<code>1 file changed, 8 deletions(-)</code>). Lần pull kế của mọi người là một fast-forward bình thường. Thiếu <code>-m 1</code> thì Git từ chối (<code>error: commit … is a merge but no -m option was given</code>): nó không biết bạn muốn giữ cha nào. Nếu chọn sai số, bạn "revert" nhầm phía main và giữ lại phía hỏng.</p>

<h3>Cái bẫy: merge lại nhánh đã sửa mà không có gì xảy ra</h3>
<p>Bình sửa ánh xạ và muốn đưa nhánh quay lại. Bạn ấy chuyển sang <code>main</code> và merge nó:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git pull -q
git switch main</code></pre>
<div class="out">Already on 'main'
Your branch is up to date with 'origin/main'.</div>
<pre><code class="language-bash">git merge feature/trang-chu-moi</code></pre>
<div class="out">Already up to date.</div>
<p><strong><code>Already up to date.</code></strong> Với Git, commit của nhánh đã là tổ tiên của <code>main</code> — nó đã được merge, và lần revert sau chỉ là một commit nữa nằm trên. Git chỉ merge những commit <em>chưa</em> là tổ tiên. Vì vậy thay đổi gốc là "đã merge và đã bị huỷ", và merge lại bao nhiêu lần cũng không đem nó về. Còn có biến thể tệ hơn: Bình sửa nhánh trước rồi merge ngay.</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git switch feature/trang-chu-moi</code></pre>
<div class="out">Switched to branch 'feature/trang-chu-moi'</div>
<pre><code class="language-bash">git commit -qam "TrangChuServlet: doi url-pattern sang /trang-chu"
git switch main</code></pre>
<div class="out">Switched to branch 'main'
Your branch is up to date with 'origin/main'.</div>
<pre><code class="language-bash">git merge feature/trang-chu-moi</code></pre>
<div class="out">Auto-merging web/WEB-INF/web.xml
CONFLICT (content): Merge conflict in web/WEB-INF/web.xml
Automatic merge failed; fix conflicts and then commit the result.</div>
<pre><code class="language-bash">git merge --abort</code></pre>
<p>Lần này merge chỉ mang về mỗi <em>bản sửa</em> (một dòng đổi), nhưng <code>main</code> không còn khối mà bản sửa chỉnh — revert đã xoá nó — nên hai phía xung đột ở <code>web.xml</code>. Nhìn như một xung đột bí ẩn; thật ra là tác dụng của lần revert.</p>

<h3>Lối ra: revert cái revert</h3>
<p>Huỷ việc huỷ. Việc đó khôi phục mọi thứ merge đã mang vào, và sau đó merge nhánh đã sửa là một phép merge sạch, nhỏ. Làm nó <strong>cục bộ và trước khi push</strong>, để trạng thái lỗi không bao giờ tới ai:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Bình —</span>
git revert --no-edit 0e2418c</code></pre>
<div class="out">[main db94c00] Reapply "Merge nhanh trang-chu-moi (khong qua PR)"
 Date: Sat Oct 31 21:54:46 2026 +0700
 1 file changed, 8 insertions(+)</div>
<pre><code class="language-bash">git merge --no-ff feature/trang-chu-moi -m "Merge lai trang-chu-moi (da sua url-pattern)"</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 web/WEB-INF/web.xml | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)</div>
<pre><code class="language-bash">git grep -n url-pattern -- web/WEB-INF/web.xml</code></pre>
<div class="out">web/WEB-INF/web.xml:9:        &lt;url-pattern&gt;/login&lt;/url-pattern&gt;
web/WEB-INF/web.xml:17:        &lt;url-pattern&gt;/home&lt;/url-pattern&gt;
web/WEB-INF/web.xml:25:        &lt;url-pattern&gt;/trang-chu&lt;/url-pattern&gt;</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   0e2418c..cd917a8  main -&gt; main</div>
<pre><code class="language-bash">git log --oneline --graph -8</code></pre>
<div class="out">*   cd917a8 Merge lai trang-chu-moi (da sua url-pattern)
|\\  
| * 0710bca TrangChuServlet: doi url-pattern sang /trang-chu
* | db94c00 Reapply "Merge nhanh trang-chu-moi (khong qua PR)"
* | 0e2418c Revert "Merge nhanh trang-chu-moi (khong qua PR)"
* | 5a123a1 Merge nhanh trang-chu-moi (khong qua PR)
|\\| 
| * a89b8c2 Them TrangChuServlet (map /home)
|/  
* 77fb638 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p>Ở Git 2.51 lệnh đặt tên commit mới là <em>Reapply "Merge …"</em>. Phép merge nhánh đã sửa khi đó chỉ áp đúng một dòng đã đổi (<code>1 insertion(+), 1 deletion(-)</code>), phép kiểm <code>git grep url-pattern</code> cho thấy <code>/trang-chu</code> thay cho <code>/home</code> thứ hai, và chỉ lúc đó mới push. Đồ thị dài hơn ai cũng muốn — merge, revert, reapply, sửa, merge — và hoàn toàn trung thực về điều đã xảy ra.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Cách khác: nhánh mới</span><span class="v">Thay vì revert cái revert, tạo nhánh mới từ <code>main</code>, chép thay đổi đã sửa sang đó (<code>git cherry-pick</code> các commit tính năng — Chương 8) và mở pull request mới. Lịch sử về ý định sạch hơn, gõ nhiều hơn; hợp khi nhánh gốc lộn xộn.</span></div>
  <div class="kv"><span class="k">Sao không reset rồi force?</span><span class="v">Nó giấu merge khỏi log, nhưng mọi bạn đã pull đều có nó, và force push trên <code>main</code> là tai nạn của 18.3.</span></div>
</div>

<h3>Phòng ngừa</h3>
<ul>
<li><strong>Kiểm trước khi push:</strong> <code>git status -sb</code> và <code>git log --oneline --graph -5</code>; hai giây biến Tình huống 2 thành Tình huống 1.</li>
<li><strong>Merge qua pull request</strong> (18.5): nút merge "hoàn tác được" bằng một cú bấm trên GitHub (nút <em>Revert</em> trên pull request đã merge mở một pull request mới làm đúng <code>revert -m 1</code> hộ bạn).</li>
<li><strong>Chạy ứng dụng sau khi merge vào nhánh của bạn</strong> (18.2), không phải sau khi merge vào <code>main</code>.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol>
<li>Sân tập: remote bare, clone <code>an</code> và <code>binh</code>, một <code>web.xml</code> có ánh xạ <code>/home</code> đã push.</li>
<li><strong>Tình huống 1.</strong> Trong <code>binh</code> tạo nhánh thêm ánh xạ <code>/home</code> thứ hai, merge vào <code>main</code> bằng <code>--no-ff</code> và <em>không</em> push. Chạy <code>git status -sb</code>, rồi <code>git reset --hard ORIG_HEAD</code>, rồi <code>git status -sb</code> lần nữa.</li>
<li><strong>Tình huống 2.</strong> Lặp lại merge, lần này push, và pull trong <code>an</code>. Trong <code>an</code> chạy <code>git revert -m 1 --no-edit HEAD</code>, rồi push. Thử cùng lệnh không có <code>-m 1</code> trong một bản sao nháp và chép lỗi.</li>
<li><strong>Cái bẫy.</strong> Trong <code>binh</code> pull, chuyển sang <code>main</code> và chạy <code>git merge &lt;nhánh&gt;</code> — chép thông báo. Sửa ánh xạ trên nhánh, commit, merge lại để thấy xung đột; <code>git merge --abort</code>.</li>
<li><strong>Lối ra.</strong> Trên <code>main</code> chạy <code>git revert --no-edit &lt;mã băm của commit Revert&gt;</code>, merge nhánh đã sửa bằng <code>--no-ff</code>, kiểm <code>git grep url-pattern</code>, push.</li>
</ol>
<p><strong>Đạt khi:</strong> (a) Tình huống 1 kết thúc với <code>main</code> ngang <code>origin/main</code> và nhánh vẫn giữ commit của nó; (b) revert của merge xoá các dòng và pull êm trong <code>an</code>; (c) bạn đã thấy cả <code>Already up to date.</code> lẫn xung đột; (d) <code>web.xml</code> cuối cùng có đúng một ánh xạ <code>/home</code> và một <code>/trang-chu</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">merge commit</span><span class="v">Commit có hai cha, sinh ra khi nối hai dòng lịch sử.</span></div>
  <div class="kv"><span class="k">ORIG_HEAD</span><span class="v">Con trỏ Git đặt trước các thao tác rủi ro (merge, reset, rebase) để nhớ <code>HEAD</code> từng ở đâu.</span></div>
  <div class="kv"><span class="k">revert -m 1</span><span class="v">Revert một commit merge, giữ cha 1 (nhánh bạn merge <em>vào</em>) làm dòng chính.</span></div>
  <div class="kv"><span class="k">revert the revert</span><span class="v">Revert commit đã huỷ một merge, để thay đổi gốc có mặt trở lại.</span></div>
  <div class="kv"><span class="k">ancestor</span><span class="v">Tổ tiên: commit với tới được bằng cách đi theo liên kết cha. Git chỉ merge các commit chưa là tổ tiên.</span></div>
  <div class="kv"><span class="k">merge --abort</span><span class="v">Huỷ một merge đang dừng vì xung đột và quay về trạng thái trước nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Chưa push: <code>git reset --hard ORIG_HEAD</code> (hoặc <code>git merge --abort</code> nếu còn đang xung đột); nhánh giữ nguyên việc.</li><li>Đã push: <code>git revert -m 1 &lt;merge&gt;</code> thêm một commit huỷ; con số nói cha nào là dòng chính.</li><li>Sau một lần revert, merge lại cùng nhánh báo <code>Already up to date</code> vì các commit của nó đã là tổ tiên.</li><li>Lối ra là revert cái revert (cục bộ, trước khi push) rồi merge nhánh đã sửa — hoặc cherry-pick sang nhánh mới.</li><li>Đọc log (<code>--graph</code>) hơn đoán mò: lịch sử cho biết chính xác bạn đang ở tình huống nào.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-revert" target="_blank" rel="noopener">
  <span class="lc-ico">↩️</span>
  <span class="lc-body"><span class="lc-title">git-scm — git revert</span><span class="lc-sub">Tuỳ chọn -m để revert một commit merge.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/howto/revert-a-faulty-merge.html" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">git-scm — How to revert a faulty merge</span><span class="lc-sub">Bài của chính dự án Git về vấn đề "revert cái revert".</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-merge" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">git-scm — git merge</span><span class="lc-sub">--abort, --no-ff và cách ORIG_HEAD được dùng.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/reverting-a-pull-request" target="_blank" rel="noopener">
  <span class="lc-ico">🧯</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Reverting a pull request</span><span class="lc-sub">Nút Revert trên một pull request đã merge.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Chuyện này hỏng thế nào trong đồ án nhóm.</strong> <b>Revert một merge mà thiếu <code>-m 1</code></b> hoặc dùng <code>-m 2</code>, và "revert" nhầm phía tốt. <b>Merge lại nhánh đã sửa, nhận "Already up to date", rồi kết luận bản sửa đã mất</b>; không mất, chỉ là chưa từng được mang sang. <b>Revert merge rồi merge lại nhánh sau khi sửa</b> và giải xung đột bất ngờ bằng "accept mine", âm thầm bỏ mất mã. <b>Xoá nhánh sau khi revert</b>, mất bản sạch duy nhất của thay đổi.</div>
</div>
`,
    },

    /* ─────────────────────────── 18.7 ─────────────────────────── */
    {
      title: '18.7 — Team rescue night: three accidents at once, one calm method|||18.7 — Buổi cứu hộ của nhóm: ba tai nạn cùng lúc, một phương pháp bình tĩnh',
      slug: 'git-18-7-buoi-cuu-ho-nhom',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đêm trước hạn nộp: commit nhầm trên main, build/ lọt vào, push bị từ chối rồi xung đột web.xml cùng lúc. Phương pháp chẩn đoán trước, sửa từng lớp từ ngoài vào trong, kèm bảng tra triệu chứng → lệnh → cách sửa → cách phòng và một lab mini tự dán chạy được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Lesson 18.7</span>
<h2>Three accidents on the same night, and one method</h2>
<p class="lead">Real accidents do not arrive one at a time. The night before the deadline you find a commit on <code>main</code> that should have been on a branch, build output inside it, a rejected push, and a conflict in <code>web.xml</code> — all in the same clone. The panic response is to type the first command a forum suggests. The calm response is a fixed order: <strong>look, save, peel off one layer at a time, verify</strong>. This lesson runs that method on a combined accident and ends with a summary table of the whole chapter.</p>
<p>Outputs: this chapter's lab (accident <code>tong-hop</code>), <strong>git version 2.51.1</strong>, remote <code>/tmp/lab18/github.git</code>. No new command is taught: every move below was explained in 18.1–18.6.</p>

<h3>The night</h3>
${slide('git-18', 15, 'Chẩn đoán năm lệnh, rồi sửa từng lớp')}
<p>An merges a pull request that adds <code>DatLichServlet</code> and edits <code>web.xml</code>. At the same time Chi, who forgot to branch, built <code>TraCuuServlet</code> directly on <code>main</code>, pressed Build, and ran <code>git add .</code>:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git switch -c feature/dat-lich</code></pre>
<div class="out">Switched to a new branch 'feature/dat-lich'</div>
<pre><code class="language-bash">git commit -qam "DatLichServlet + web.xml"
git switch main</code></pre>
<div class="out">Switched to branch 'main'
Your branch is up to date with 'origin/main'.</div>
<pre><code class="language-bash">git merge --no-ff feature/dat-lich -m "Merge pull request #1 from an/dat-lich"</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 web/WEB-INF/web.xml | 8 ++++++++
 1 file changed, 8 insertions(+)</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   db9b833..31f81f7  main -&gt; main</div>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git add .
git commit -qm "Them TraCuuServlet"</code></pre>
<div class="out"></div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
 ! [rejected]        main -&gt; main (fetch first)
error: failed to push some refs to '/tmp/lab18/github.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.</div>
<pre><code class="language-bash">git pull --no-rebase</code></pre>
<div class="out">From /tmp/lab18/github
   db9b833..31f81f7  main       -&gt; origin/main
Auto-merging web/WEB-INF/web.xml
CONFLICT (content): Merge conflict in web/WEB-INF/web.xml
Automatic merge failed; fix conflicts and then commit the result.</div>

<h3>Step 1 — look, do not type</h3>
<p>Resist the urge to "just fix it". Four read-only commands (plus <code>git reflog</code> if a commit seems to have vanished) tell the whole story, and none of them can make anything worse:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git status -sb</code></pre>
<div class="out">## main...origin/main [ahead 1, behind 2]
UU web/WEB-INF/web.xml</div>
<pre><code class="language-bash">git diff --name-only --diff-filter=U</code></pre>
<div class="out">web/WEB-INF/web.xml</div>
<pre><code class="language-bash">git log --oneline --graph --all</code></pre>
<div class="out">* 8013b62 Them TraCuuServlet
| * 31f81f7 Merge pull request #1 from an/dat-lich
|/| 
| * 5113888 DatLichServlet + web.xml
|/  
* db9b833 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<pre><code class="language-bash">git ls-files build dist nbproject/private</code></pre>
<div class="out">build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class
build/web/WEB-INF/classes/com/nhom/servlet/LoginServlet.class
dist/QuanLyPhongKham.war
nbproject/private/private.properties
nbproject/private/private.xml</div>
<div class="kv-grid">
  <div class="kv"><span class="k">git status -sb</span><span class="v"><code>## main...origin/main [ahead 1, behind 2]</code> — Chi's commit is on <code>main</code> (mistake of 18.4), the remote has two commits she lacks (18.3). <code>UU web/WEB-INF/web.xml</code> — a merge is in progress and stopped on conflicts (18.2).</span></div>
  <div class="kv"><span class="k">git diff --name-only --diff-filter=U</span><span class="v">Exactly the files that are still unresolved: one.</span></div>
  <div class="kv"><span class="k">git log --oneline --graph --all</span><span class="v">The shape of the problem: Chi's commit hangs off the old base while the remote has moved on.</span></div>
  <div class="kv"><span class="k">git ls-files build dist nbproject/private</span><span class="v">Five tracked files that must not be tracked (18.1).</span></div>
</div>
<p>Diagnosis in one sentence: <em>work on main by mistake + build output committed + a diverged push, with a shared-file conflict half-way through a merge.</em> Four accidents from four lessons — fix them from the outside in.</p>

<h3>Step 2 — save: nothing is lost, and we leave the half-done merge</h3>
<p>The first move is the safest: leave the unfinished merge with <code>git merge --abort</code>. It returns to the state before the pull, with Chi's commit intact. Then put the work on a branch <em>before</em> moving <code>main</code> (18.4):</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git merge --abort
git status -sb</code></pre>
<div class="out">## main...origin/main [ahead 1, behind 2]
</div>
<pre><code class="language-bash">git branch feature/tra-cuu
git reset --hard origin/main</code></pre>
<div class="out">HEAD is now at 31f81f7 Merge pull request #1 from an/dat-lich</div>
<pre><code class="language-bash">git switch feature/tra-cuu</code></pre>
<div class="out">Switched to branch 'feature/tra-cuu'</div>
<p><code>main</code> now equals the remote's (<code>HEAD is now at a2efb48 …</code>) and the work sits on <code>feature/tra-cuu</code>. Nothing was pushed anywhere, nothing can be lost: the branch holds the commit.</p>

<h3>Steps 3–5 — peel off the layers on the branch</h3>
<p>On the branch: stop tracking build output (18.1), bring <code>main</code> in and resolve the shared file by rebuilding it and validating it (18.2), then push <em>the branch</em> and open a pull request instead of touching <code>main</code> (18.5):</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git rm -r --cached -q build dist nbproject/private
git add .gitignore
git commit -m "Ngung theo doi build/, dist/, nbproject/private/"</code></pre>
<div class="out">[feature/tra-cuu 0deb337] Ngung theo doi build/, dist/, nbproject/private/
 6 files changed, 3 insertions(+), 10 deletions(-)
 delete mode 100644 build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class
 delete mode 100644 build/web/WEB-INF/classes/com/nhom/servlet/LoginServlet.class
 delete mode 100644 dist/QuanLyPhongKham.war
 delete mode 100644 nbproject/private/private.properties
 delete mode 100644 nbproject/private/private.xml
</div>
<pre><code class="language-bash">git merge origin/main</code></pre>
<div class="out">Auto-merging web/WEB-INF/web.xml
CONFLICT (content): Merge conflict in web/WEB-INF/web.xml
Automatic merge failed; fix conflicts and then commit the result.</div>
<pre><code class="language-bash">xmllint --noout web/WEB-INF/web.xml
git add web/WEB-INF/web.xml
git commit -m "Merge main vao feature/tra-cuu"</code></pre>
<div class="out">[feature/tra-cuu 0bb1de2] Merge main vao feature/tra-cuu
</div>
<pre><code class="language-bash">git push -u origin feature/tra-cuu</code></pre>
<div class="out">To /tmp/lab18/github.git
 * [new branch]      feature/tra-cuu -&gt; feature/tra-cuu
branch 'feature/tra-cuu' set up to track 'origin/feature/tra-cuu'.</div>
<pre><code class="language-bash">git ls-files build dist nbproject/private
git log --oneline --graph --all</code></pre>
<div class="out">*   0bb1de2 Merge main vao feature/tra-cuu
|\\  
| *   31f81f7 Merge pull request #1 from an/dat-lich
| |\\  
| | * 5113888 DatLichServlet + web.xml
| |/  
* | 0deb337 Ngung theo doi build/, dist/, nbproject/private/
* | 8013b62 Them TraCuuServlet
|/  
* db9b833 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p>Read the end state: <code>git ls-files build dist nbproject/private</code> prints nothing, the merge commit has two parents, and the work is on a pushed branch ready for review. The same night produced a clean history instead of a force-push.</p>
<div class="callout ok"><strong>The order matters.</strong> (1) Abort anything half-done. (2) Save the work on a branch. (3) Only then move <code>main</code> or rewrite anything. (4) Clean the contents (ignore, un-track). (5) Integrate with <code>main</code> on your branch. (6) Push the branch; <code>main</code> changes only through a pull request.</div>

<h3>The whole chapter in one table</h3>
${slide('git-18', 16, 'Bảng tra nhanh: triệu chứng → chẩn đoán → cách sửa → cách phòng')}
<table>
<thead><tr><th>You see</th><th>It means</th><th>Fix</th><th>Prevent</th><th>Lesson</th></tr></thead>
<tbody>
<tr><td>pull: "local changes … <code>build/…class</code> would be overwritten"</td><td>build output is tracked</td><td><code>git rm -r --cached</code> + <code>.gitignore</code>; rotate any secret</td><td>.gitignore first, <code>git add -n .</code></td><td>18.1</td></tr>
<tr><td><code>UU web.xml</code>, <code>CONFLICT</code></td><td>two edits of the same place</td><td>rebuild from main + re-add yours; <code>xmllint</code></td><td>small PRs, merge main daily, annotations</td><td>18.2</td></tr>
<tr><td>"would be overwritten" / "no tracking information"</td><td>unsaved work / no upstream</td><td>commit → fetch → merge; <code>push -u</code></td><td>fetch first</td><td>18.3</td></tr>
<tr><td>"rejected (fetch first)" / "divergent branches"</td><td>remote has commits you lack</td><td><code>pull --no-rebase</code> or <code>--rebase</code>, then push</td><td><code>pull.rebase</code> set once; never <code>--force</code></td><td>18.3</td></tr>
<tr><td><code>main ... [ahead 2]</code></td><td>work committed on main</td><td>branch + <code>reset --hard origin/main</code>; pushed: <code>revert</code></td><td>branch first, protected main</td><td>18.4</td></tr>
<tr><td>a merge with no "Pull request #" title</td><td>no review</td><td>revert if broken; add ruleset</td><td>ruleset, CODEOWNERS, 5-question review</td><td>18.5</td></tr>
<tr><td><code>Already up to date.</code> after a revert</td><td>commits are already ancestors</td><td><code>revert -m 1</code>; revert the revert, then merge</td><td>check before push</td><td>18.6</td></tr>
</tbody></table>

<h3>Run the lab yourself</h3>
<p>The full lab of this chapter is one script, <code>lab18/tao-nhom.sh</code> in the course's repository: it builds the remote and three clones and reproduces each accident by name (<code>build</code>, <code>xung-dot-web-xml</code>, <code>keo-main-nham</code>, <code>push-tu-choi</code>, <code>sua-nham-main</code>, <code>tu-merge</code>, <code>hoan-tac-merge</code>, <code>tong-hop</code>, …), with <code>--sua</code> to run the fix. It is about five hundred lines, so it is <strong>not pasted here</strong>: a script that long is unreadable inside a lesson and would drift from the real one. What you need to do every exercise of this chapter by hand is the <em>starting position</em>, and that fits in twenty lines. Paste it into a file and run <code>bash nhom-mini.sh</code>; it works in a temporary folder with its own <code>HOME</code>, never touches your real <code>~/.gitconfig</code> or SSH keys, and needs no network:</p>
<pre><code class="language-bash"><span class="tok-comment">#!/usr/bin/env bash</span>
set -e
LAB=$(mktemp -d)
export HOME=$LAB/home GIT_CONFIG_NOSYSTEM=1      <span class="tok-comment"># isolation: your real ~/.gitconfig is not touched</span>
mkdir -p "$HOME"
git config --global init.defaultBranch main
git init -q --bare "$LAB/github.git"             <span class="tok-comment"># a fake "GitHub" on disk</span>
git clone -q "$LAB/github.git" "$LAB/an" 2&gt;/dev/null
cd "$LAB/an"
git config user.name An; git config user.email an@example.com
mkdir -p src web/WEB-INF
echo 'class Login {}' &gt; src/Login.java
printf '&lt;web-app&gt;\\n  &lt;session-config/&gt;\\n&lt;/web-app&gt;\\n' &gt; web/WEB-INF/web.xml
git add . &amp;&amp; git commit -qm "Khoi tao" &amp;&amp; git push -q -u origin main
for ai in binh chi; do
  git clone -q "$LAB/github.git" "$LAB/$ai"
  git -C "$LAB/$ai" config user.name "$ai"; git -C "$LAB/$ai" config user.email "$ai@example.com"
done
echo "Lab is in: $LAB   (cd into an, binh, chi)   Remove: rm -rf $LAB"</code></pre>
<p>After it runs you have <code>an</code>, <code>binh</code> and <code>chi</code> exactly as in the accidents above. The commits made in the clones use the per-clone name and email; if you set <code>pull.rebase</code> globally on your own machine, the "divergent branches" message of 18.3 will not appear (check it with <code>git config --global --get pull.rebase</code>).</p>

<h3>🧪 Practice (30–40 min)</h3>
<div class="callout ok"><ol>
<li>Run <code>nhom-mini.sh</code>. In <code>an</code>: branch, add a servlet block before <code>&lt;session-config/&gt;</code> in <code>web.xml</code>, merge into <code>main</code> with <code>--no-ff</code>, push.</li>
<li>In <code>chi</code>, <em>on main</em>: add a different servlet block in the same place, create <code>build/x.class</code> and <code>nbproject/private/p.properties</code>, run <code>git add .</code> and commit. Run <code>git push</code> (rejected), then <code>git pull --no-rebase</code> (conflict).</li>
<li>Without fixing anything, run the four diagnosis commands and write the one-sentence diagnosis in your own words.</li>
<li>Fix it in the order of the call-out: abort, branch, reset <code>main</code>, un-track the build files, merge <code>origin/main</code> into the branch, resolve <code>web.xml</code> by rebuilding it, validate with <code>xmllint</code>, push the branch.</li>
<li>Fill in your own copy of the summary table with one real command from your run in each row you used.</li>
</ol>
<p><strong>Done when:</strong> (a) <code>git status -sb</code> in <code>chi</code> shows a clean branch tracking <code>origin/feature/…</code>; (b) <code>git ls-files build nbproject/private</code> prints nothing; (c) <code>main</code> in <code>chi</code> equals <code>origin/main</code>; (d) <code>git log --oneline --graph --all</code> shows one merge commit with two parents and no <code>--force</code> anywhere in your history of commands.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">diagnosis</span><span class="v">Reading the state (<code>status</code>, <code>log --graph</code>, <code>ls-files</code>) before acting.</span></div>
  <div class="kv"><span class="k">half-done operation</span><span class="v">A merge, rebase or cherry-pick that stopped on conflicts. First action: finish it or abort it.</span></div>
  <div class="kv"><span class="k">layer</span><span class="v">One independent accident inside a combined one; fix them one at a time, outside in.</span></div>
  <div class="kv"><span class="k">feature branch</span><span class="v">A branch for one task; the only place a team member commits.</span></div>
  <div class="kv"><span class="k">rescue branch</span><span class="v">A branch created only to keep a commit safe before a risky command.</span></div>
  <div class="kv"><span class="k">bare repository</span><span class="v">A repository with history but no working folder; what a server such as GitHub keeps.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Combined accidents are four ordinary accidents; the method is: look, save the work, peel layers outside-in, verify.</li><li>Five read-only commands diagnose almost everything: <code>status -sb</code>, <code>diff --name-only --diff-filter=U</code>, <code>log --oneline --graph --all</code>, <code>ls-files</code>, <code>reflog</code>.</li><li>Abort the half-done operation first and put the work on a branch before you move <code>main</code>.</li><li>Fix the contents (ignore, un-track, resolve) on your branch; <code>main</code> changes only through a pull request.</li><li>If a command you are about to run contains <code>--force</code> or <code>reset --hard</code>, stop and re-read the diagnosis.</li></ul>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git — Reset Demystified</span><span class="lc-sub">What reset moves, and why it is safe or not.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-status" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">git-scm — git status</span><span class="lc-sub">The short format (-s), the branch line (-b) and the XY codes such as UU.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-log" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">git-scm — git log</span><span class="lc-sub">--graph, --all, --first-parent, --merges and -S.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>How this goes wrong in a student team project.</strong> <b>Fixing the layer you noticed last</b> (the conflict) before saving the commit on <code>main</code>, then losing it in a <code>reset --hard</code>. <b>Running the first command from a search result</b> on a Sunday night, without ever looking at <code>git status</code>. <b>Pasting a fix into the shared group chat for everybody</b> although only one clone is in this state. <b>Deleting the folder and cloning again</b>: the unpushed commit of the combined accident would have been inside it.</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 18 · Bài 18.7</span>
<h2>Ba tai nạn cùng một đêm, và một phương pháp</h2>
<p class="lead">Tai nạn thật không đến từng cái một. Đêm trước hạn nộp bạn thấy một commit trên <code>main</code> đáng ra phải ở nhánh, sản phẩm build nằm trong đó, một lần push bị từ chối, và một xung đột trong <code>web.xml</code> — tất cả trong cùng một clone. Phản ứng hoảng loạn là gõ lệnh đầu tiên diễn đàn gợi ý. Phản ứng bình tĩnh là một thứ tự cố định: <strong>nhìn, cất việc, bóc từng lớp một, kiểm lại</strong>. Bài này chạy phương pháp đó trên một tai nạn tổng hợp và kết thúc bằng bảng tóm tắt cả chương.</p>
<p>Output: lab của chương (tai nạn <code>tong-hop</code>), <strong>git version 2.51.1</strong>, remote <code>/tmp/lab18/github.git</code>. Không dạy lệnh mới: mọi nước đi dưới đây đã được giải thích ở 18.1–18.6.</p>

<h3>Cái đêm đó</h3>
${slide('git-18', 15, 'Chẩn đoán năm lệnh, rồi sửa từng lớp')}
<p>An merge một pull request thêm <code>DatLichServlet</code> và sửa <code>web.xml</code>. Cùng lúc, Chi — quên rẽ nhánh — build <code>TraCuuServlet</code> thẳng trên <code>main</code>, bấm Build, rồi <code>git add .</code>:</p>
<pre><code class="language-bash"><span class="tok-comment"># — An —</span>
git switch -c feature/dat-lich</code></pre>
<div class="out">Switched to a new branch 'feature/dat-lich'</div>
<pre><code class="language-bash">git commit -qam "DatLichServlet + web.xml"
git switch main</code></pre>
<div class="out">Switched to branch 'main'
Your branch is up to date with 'origin/main'.</div>
<pre><code class="language-bash">git merge --no-ff feature/dat-lich -m "Merge pull request #1 from an/dat-lich"</code></pre>
<div class="out">Merge made by the 'ort' strategy.
 web/WEB-INF/web.xml | 8 ++++++++
 1 file changed, 8 insertions(+)</div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
   db9b833..31f81f7  main -&gt; main</div>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git add .
git commit -qm "Them TraCuuServlet"</code></pre>
<div class="out"></div>
<pre><code class="language-bash">git push origin main</code></pre>
<div class="out">To /tmp/lab18/github.git
 ! [rejected]        main -&gt; main (fetch first)
error: failed to push some refs to '/tmp/lab18/github.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.</div>
<pre><code class="language-bash">git pull --no-rebase</code></pre>
<div class="out">From /tmp/lab18/github
   db9b833..31f81f7  main       -&gt; origin/main
Auto-merging web/WEB-INF/web.xml
CONFLICT (content): Merge conflict in web/WEB-INF/web.xml
Automatic merge failed; fix conflicts and then commit the result.</div>

<h3>Bước 1 — nhìn, đừng gõ</h3>
<p>Cưỡng lại ý muốn "sửa luôn cho xong". Bốn lệnh chỉ-đọc (thêm <code>git reflog</code> nếu có commit tưởng đã biến mất) kể trọn câu chuyện, và không lệnh nào làm mọi thứ tệ hơn được:</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git status -sb</code></pre>
<div class="out">## main...origin/main [ahead 1, behind 2]
UU web/WEB-INF/web.xml</div>
<pre><code class="language-bash">git diff --name-only --diff-filter=U</code></pre>
<div class="out">web/WEB-INF/web.xml</div>
<pre><code class="language-bash">git log --oneline --graph --all</code></pre>
<div class="out">* 8013b62 Them TraCuuServlet
| * 31f81f7 Merge pull request #1 from an/dat-lich
|/| 
| * 5113888 DatLichServlet + web.xml
|/  
* db9b833 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<pre><code class="language-bash">git ls-files build dist nbproject/private</code></pre>
<div class="out">build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class
build/web/WEB-INF/classes/com/nhom/servlet/LoginServlet.class
dist/QuanLyPhongKham.war
nbproject/private/private.properties
nbproject/private/private.xml</div>
<div class="kv-grid">
  <div class="kv"><span class="k">git status -sb</span><span class="v"><code>## main...origin/main [ahead 1, behind 2]</code> — commit của Chi nằm trên <code>main</code> (lỗi của 18.4), remote có hai commit bạn ấy chưa có (18.3). <code>UU web/WEB-INF/web.xml</code> — một phép merge đang dở, dừng vì xung đột (18.2).</span></div>
  <div class="kv"><span class="k">git diff --name-only --diff-filter=U</span><span class="v">Đúng những tệp còn chưa giải: một tệp.</span></div>
  <div class="kv"><span class="k">git log --oneline --graph --all</span><span class="v">Hình dạng của vấn đề: commit của Chi treo vào gốc cũ trong khi remote đã đi tiếp.</span></div>
  <div class="kv"><span class="k">git ls-files build dist nbproject/private</span><span class="v">Năm tệp đang được theo dõi mà không được phép (18.1).</span></div>
</div>
<p>Chẩn đoán trong một câu: <em>làm nhầm trên main + sản phẩm build đã commit + push bị rẽ đôi, kèm một xung đột tệp chung giữa chừng một phép merge.</em> Bốn tai nạn của bốn bài — sửa từ ngoài vào trong.</p>

<h3>Bước 2 — cất việc: không mất gì, và rời phép merge dang dở</h3>
<p>Nước đi đầu tiên là an toàn nhất: rời phép merge chưa xong bằng <code>git merge --abort</code>. Nó quay về trạng thái trước lần pull, với commit của Chi còn nguyên. Rồi đặt việc lên một nhánh <em>trước</em> khi dời <code>main</code> (18.4):</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git merge --abort
git status -sb</code></pre>
<div class="out">## main...origin/main [ahead 1, behind 2]
</div>
<pre><code class="language-bash">git branch feature/tra-cuu
git reset --hard origin/main</code></pre>
<div class="out">HEAD is now at 31f81f7 Merge pull request #1 from an/dat-lich</div>
<pre><code class="language-bash">git switch feature/tra-cuu</code></pre>
<div class="out">Switched to branch 'feature/tra-cuu'</div>
<p>Giờ <code>main</code> bằng remote (<code>HEAD is now at a2efb48 …</code>) và việc nằm trên <code>feature/tra-cuu</code>. Chưa push đi đâu, không gì mất được: nhánh giữ commit.</p>

<h3>Bước 3–5 — bóc từng lớp trên nhánh</h3>
<p>Trên nhánh: ngừng theo dõi sản phẩm build (18.1), đưa <code>main</code> vào và giải tệp chung bằng cách dựng lại rồi kiểm hợp lệ (18.2), sau đó push <em>nhánh</em> và mở pull request thay vì đụng <code>main</code> (18.5):</p>
<pre><code class="language-bash"><span class="tok-comment"># — Chi —</span>
git rm -r --cached -q build dist nbproject/private
git add .gitignore
git commit -m "Ngung theo doi build/, dist/, nbproject/private/"</code></pre>
<div class="out">[feature/tra-cuu 0deb337] Ngung theo doi build/, dist/, nbproject/private/
 6 files changed, 3 insertions(+), 10 deletions(-)
 delete mode 100644 build/web/WEB-INF/classes/com/nhom/servlet/HomeServlet.class
 delete mode 100644 build/web/WEB-INF/classes/com/nhom/servlet/LoginServlet.class
 delete mode 100644 dist/QuanLyPhongKham.war
 delete mode 100644 nbproject/private/private.properties
 delete mode 100644 nbproject/private/private.xml
</div>
<pre><code class="language-bash">git merge origin/main</code></pre>
<div class="out">Auto-merging web/WEB-INF/web.xml
CONFLICT (content): Merge conflict in web/WEB-INF/web.xml
Automatic merge failed; fix conflicts and then commit the result.</div>
<pre><code class="language-bash">xmllint --noout web/WEB-INF/web.xml
git add web/WEB-INF/web.xml
git commit -m "Merge main vao feature/tra-cuu"</code></pre>
<div class="out">[feature/tra-cuu 0bb1de2] Merge main vao feature/tra-cuu
</div>
<pre><code class="language-bash">git push -u origin feature/tra-cuu</code></pre>
<div class="out">To /tmp/lab18/github.git
 * [new branch]      feature/tra-cuu -&gt; feature/tra-cuu
branch 'feature/tra-cuu' set up to track 'origin/feature/tra-cuu'.</div>
<pre><code class="language-bash">git ls-files build dist nbproject/private
git log --oneline --graph --all</code></pre>
<div class="out">*   0bb1de2 Merge main vao feature/tra-cuu
|\\  
| *   31f81f7 Merge pull request #1 from an/dat-lich
| |\\  
| | * 5113888 DatLichServlet + web.xml
| |/  
* | 0deb337 Ngung theo doi build/, dist/, nbproject/private/
* | 8013b62 Them TraCuuServlet
|/  
* db9b833 Khoi tao du an NetBeans: Login, Home, web.xml</div>
<p>Đọc trạng thái cuối: <code>git ls-files build dist nbproject/private</code> không in gì, commit merge có hai cha, và việc nằm trên một nhánh đã push, sẵn sàng review. Cùng một đêm cho ra lịch sử sạch thay vì một lần force-push.</p>
<div class="callout ok"><strong>Thứ tự là điều quan trọng.</strong> (1) Huỷ mọi thứ đang dở. (2) Cất việc lên một nhánh. (3) Chỉ lúc đó mới dời <code>main</code> hay viết lại gì. (4) Dọn nội dung (bỏ qua, ngừng theo dõi). (5) Tích hợp với <code>main</code> ngay trên nhánh của bạn. (6) Push nhánh; <code>main</code> chỉ đổi qua pull request.</div>

<h3>Cả chương trong một bảng</h3>
${slide('git-18', 16, 'Bảng tra nhanh: triệu chứng → chẩn đoán → cách sửa → cách phòng')}
<table>
<thead><tr><th>Bạn thấy</th><th>Nghĩa là</th><th>Sửa</th><th>Phòng</th><th>Bài</th></tr></thead>
<tbody>
<tr><td>pull: "local changes … <code>build/…class</code> would be overwritten"</td><td>sản phẩm build đang được theo dõi</td><td><code>git rm -r --cached</code> + <code>.gitignore</code>; xoay vòng mọi bí mật</td><td>.gitignore trước, <code>git add -n .</code></td><td>18.1</td></tr>
<tr><td><code>UU web.xml</code>, <code>CONFLICT</code></td><td>hai người sửa cùng một chỗ</td><td>dựng lại từ main + thêm phần của bạn; <code>xmllint</code></td><td>PR nhỏ, merge main hằng ngày, chú thích</td><td>18.2</td></tr>
<tr><td>"would be overwritten" / "no tracking information"</td><td>việc chưa lưu / chưa có upstream</td><td>commit → fetch → merge; <code>push -u</code></td><td>fetch trước</td><td>18.3</td></tr>
<tr><td>"rejected (fetch first)" / "divergent branches"</td><td>remote có commit bạn chưa có</td><td><code>pull --no-rebase</code> hoặc <code>--rebase</code>, rồi push</td><td>đặt <code>pull.rebase</code> một lần; không bao giờ <code>--force</code></td><td>18.3</td></tr>
<tr><td><code>main ... [ahead 2]</code></td><td>việc commit trên main</td><td>branch + <code>reset --hard origin/main</code>; đã push: <code>revert</code></td><td>rẽ nhánh trước, main được bảo vệ</td><td>18.4</td></tr>
<tr><td>một merge không có tên "Pull request #"</td><td>không có review</td><td>revert nếu hỏng; bật ruleset</td><td>ruleset, CODEOWNERS, review năm câu</td><td>18.5</td></tr>
<tr><td><code>Already up to date.</code> sau một lần revert</td><td>commit đã là tổ tiên</td><td><code>revert -m 1</code>; revert cái revert, rồi merge</td><td>kiểm trước khi push</td><td>18.6</td></tr>
</tbody></table>

<h3>Tự chạy lab</h3>
<p>Lab đầy đủ của chương là một script, <code>lab18/tao-nhom.sh</code> trong kho của khoá: nó dựng remote và ba clone rồi tái hiện từng tai nạn theo tên (<code>build</code>, <code>xung-dot-web-xml</code>, <code>keo-main-nham</code>, <code>push-tu-choi</code>, <code>sua-nham-main</code>, <code>tu-merge</code>, <code>hoan-tac-merge</code>, <code>tong-hop</code>, …), thêm <code>--sua</code> để chạy cách sửa. Nó dài khoảng năm trăm dòng nên <strong>không dán ở đây</strong>: script dài cỡ đó đọc không nổi trong một bài học và sẽ lệch dần so với bản thật. Thứ bạn cần để tự làm mọi bài tập của chương bằng tay là <em>vị trí xuất phát</em>, và nó vừa trong hai mươi dòng. Dán vào một tệp và chạy <code>bash nhom-mini.sh</code>; nó chạy trong thư mục tạm với <code>HOME</code> riêng, không bao giờ đụng <code>~/.gitconfig</code> hay khoá SSH thật của bạn, và không cần mạng:</p>
<pre><code class="language-bash"><span class="tok-comment">#!/usr/bin/env bash</span>
set -e
LAB=$(mktemp -d)
export HOME=$LAB/home GIT_CONFIG_NOSYSTEM=1      <span class="tok-comment"># cách ly: ~/.gitconfig thật không bị đụng</span>
mkdir -p "$HOME"
git config --global init.defaultBranch main
git init -q --bare "$LAB/github.git"             <span class="tok-comment"># một "GitHub" giả nằm trên đĩa</span>
git clone -q "$LAB/github.git" "$LAB/an" 2&gt;/dev/null
cd "$LAB/an"
git config user.name An; git config user.email an@example.com
mkdir -p src web/WEB-INF
echo 'class Login {}' &gt; src/Login.java
printf '&lt;web-app&gt;\\n  &lt;session-config/&gt;\\n&lt;/web-app&gt;\\n' &gt; web/WEB-INF/web.xml
git add . &amp;&amp; git commit -qm "Khoi tao" &amp;&amp; git push -q -u origin main
for ai in binh chi; do
  git clone -q "$LAB/github.git" "$LAB/$ai"
  git -C "$LAB/$ai" config user.name "$ai"; git -C "$LAB/$ai" config user.email "$ai@example.com"
done
echo "Lab o: $LAB   (cd vao an, binh, chi)   Xoa: rm -rf $LAB"</code></pre>
<p>Chạy xong bạn có <code>an</code>, <code>binh</code>, <code>chi</code> đúng như trong các tai nạn ở trên. Commit làm trong các clone dùng tên và email riêng của clone; nếu bạn đã đặt <code>pull.rebase</code> toàn cục trên máy mình thì thông báo "divergent branches" của 18.3 sẽ không hiện (kiểm bằng <code>git config --global --get pull.rebase</code>).</p>

<h3>🧪 Thực hành (30–40 phút)</h3>
<div class="callout ok"><ol>
<li>Chạy <code>nhom-mini.sh</code>. Trong <code>an</code>: rẽ nhánh, thêm một khối servlet trước <code>&lt;session-config/&gt;</code> trong <code>web.xml</code>, merge vào <code>main</code> bằng <code>--no-ff</code>, push.</li>
<li>Trong <code>chi</code>, <em>ngay trên main</em>: thêm một khối servlet khác ở đúng chỗ đó, tạo <code>build/x.class</code> và <code>nbproject/private/p.properties</code>, chạy <code>git add .</code> và commit. Chạy <code>git push</code> (bị từ chối), rồi <code>git pull --no-rebase</code> (xung đột).</li>
<li>Chưa sửa gì, chạy bốn lệnh chẩn đoán và viết chẩn đoán một câu bằng lời của bạn.</li>
<li>Sửa theo thứ tự trong khung: huỷ, rẽ nhánh, reset <code>main</code>, ngừng theo dõi tệp build, merge <code>origin/main</code> vào nhánh, giải <code>web.xml</code> bằng cách dựng lại, kiểm bằng <code>xmllint</code>, push nhánh.</li>
<li>Điền bản sao riêng của bảng tóm tắt với một lệnh thật từ lần chạy của bạn ở mỗi hàng bạn đã dùng.</li>
</ol>
<p><strong>Đạt khi:</strong> (a) <code>git status -sb</code> trong <code>chi</code> cho thấy một nhánh sạch theo dõi <code>origin/feature/…</code>; (b) <code>git ls-files build nbproject/private</code> không in gì; (c) <code>main</code> trong <code>chi</code> bằng <code>origin/main</code>; (d) <code>git log --oneline --graph --all</code> cho thấy một commit merge có hai cha và không có <code>--force</code> nào trong lịch sử lệnh của bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">diagnosis</span><span class="v">Chẩn đoán: đọc trạng thái (<code>status</code>, <code>log --graph</code>, <code>ls-files</code>) trước khi hành động.</span></div>
  <div class="kv"><span class="k">half-done operation</span><span class="v">Thao tác dang dở: merge, rebase hay cherry-pick đã dừng vì xung đột. Hành động đầu tiên: làm xong hoặc huỷ nó.</span></div>
  <div class="kv"><span class="k">layer</span><span class="v">Lớp: một tai nạn độc lập nằm trong một tai nạn tổng hợp; sửa từng lớp, từ ngoài vào trong.</span></div>
  <div class="kv"><span class="k">feature branch</span><span class="v">Nhánh tính năng: nhánh cho một việc; chỗ duy nhất một thành viên commit.</span></div>
  <div class="kv"><span class="k">rescue branch</span><span class="v">Nhánh cứu hộ: nhánh tạo ra chỉ để giữ an toàn một commit trước một lệnh rủi ro.</span></div>
  <div class="kv"><span class="k">bare repository</span><span class="v">Kho trần: kho có lịch sử nhưng không có thư mục làm việc; thứ máy chủ như GitHub giữ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Tai nạn tổng hợp là bốn tai nạn thường; phương pháp là: nhìn, cất việc, bóc lớp từ ngoài vào trong, kiểm lại.</li><li>Năm lệnh chỉ-đọc chẩn đoán gần như mọi thứ: <code>status -sb</code>, <code>diff --name-only --diff-filter=U</code>, <code>log --oneline --graph --all</code>, <code>ls-files</code>, <code>reflog</code>.</li><li>Huỷ thao tác dang dở trước và đặt việc lên một nhánh trước khi dời <code>main</code>.</li><li>Sửa nội dung (bỏ qua, ngừng theo dõi, giải xung đột) trên nhánh của bạn; <code>main</code> chỉ đổi qua pull request.</li><li>Nếu lệnh sắp gõ có <code>--force</code> hay <code>reset --hard</code>, dừng lại và đọc lại chẩn đoán.</li></ul>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git — Reset Demystified</span><span class="lc-sub">Reset dời cái gì, và khi nào an toàn hay không.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-status" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">git-scm — git status</span><span class="lc-sub">Định dạng ngắn (-s), dòng nhánh (-b) và các mã XY như UU.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-log" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">git-scm — git log</span><span class="lc-sub">--graph, --all, --first-parent, --merges và -S.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Chuyện này hỏng thế nào trong đồ án nhóm.</strong> <b>Sửa lớp bạn mới nhận ra sau cùng</b> (xung đột) trước khi cất commit trên <code>main</code>, rồi mất nó trong một lần <code>reset --hard</code>. <b>Chạy lệnh đầu tiên trong kết quả tìm kiếm</b> vào đêm Chủ nhật mà chưa từng nhìn <code>git status</code>. <b>Dán một cách sửa vào nhóm chat chung cho tất cả</b> trong khi chỉ có một clone ở trạng thái đó. <b>Xoá thư mục rồi clone lại</b>: commit chưa push của tai nạn tổng hợp đã nằm trong đó.</div>
</div>
`,
    },

    /* ─────────────────────────── 18.8 ─────────────────────────── */
    {
      title: '18.8 — Chapter 18 quiz|||18.8 — Kiểm tra Chương 18',
      slug: 'git-18-8-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống về bảy tai nạn của nhóm: build/ lọt vào kho, xung đột web.xml, ba thông báo đồng bộ, làm nhầm trên main, tự merge không review, hoàn tác merge.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 18 · Quiz</span>
<h2>Ten situations from a student team's bad night</h2>
<p class="lead">Every question is a scene from this chapter. Read the symptom first, decide what Git is telling you, then choose the safest fix — the explanation says why the tempting answer is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain why a rule added to <code>.gitignore</code> does nothing for files that are already tracked, and the command that fixes it.</li>
<li>I know that a leaked password must be rotated, not just deleted.</li>
<li>I can resolve a conflict in <code>web.xml</code> and prove the result is valid XML.</li>
<li>I can tell "would be overwritten", "no tracking information", "rejected" and "divergent branches" apart.</li>
<li>I can choose between <code>reset</code> and <code>revert</code> by asking whether the commit has left my laptop.</li>
<li>I know why re-merging a branch after <code>revert -m 1</code> says "Already up to date".</li>
</ul>
${slide('git-18', 16, 'Bảng tra nhanh Chương 18')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 18 · Kiểm tra</span>
<h2>Mười tình huống từ một đêm tệ của nhóm sinh viên</h2>
<p class="lead">Mỗi câu là một cảnh trong chương này. Đọc triệu chứng trước, quyết định Git đang nói gì, rồi chọn cách sửa an toàn nhất — phần giải thích cho biết vì sao đáp án hấp dẫn lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được vì sao một luật thêm vào <code>.gitignore</code> không làm gì với tệp đã được theo dõi, và lệnh sửa nó.</li>
<li>Tôi biết mật khẩu bị lộ phải được xoay vòng, không chỉ xoá.</li>
<li>Tôi giải được xung đột trong <code>web.xml</code> và chứng minh được kết quả là XML hợp lệ.</li>
<li>Tôi phân biệt được "would be overwritten", "no tracking information", "rejected" và "divergent branches".</li>
<li>Tôi chọn được giữa <code>reset</code> và <code>revert</code> bằng cách hỏi commit đã rời laptop chưa.</li>
<li>Tôi biết vì sao merge lại một nhánh sau <code>revert -m 1</code> báo "Already up to date".</li>
</ul>
${slide('git-18', 16, 'Bảng tra nhanh Chương 18')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Bình runs git pull and Git lists build/…/HomeServlet.class and dist/QuanLyPhongKham.war as "local changes … would be overwritten". An committed them last week with git add . after a NetBeans build. What is the right repair?|||Bình chạy git pull và Git liệt kê build/…/HomeServlet.class và dist/QuanLyPhongKham.war là "local changes … would be overwritten". An đã commit chúng tuần trước bằng git add . sau một lần build NetBeans. Cách sửa đúng là gì?',
            options: [
              'Bình commits his own build output, so that both versions are in history and the conflict can be resolved|||Bình commit luôn sản phẩm build của mình, để cả hai phiên bản nằm trong lịch sử và giải xung đột',
              'Add build/ and dist/ to .gitignore; Git stops tracking them at once|||Thêm build/ và dist/ vào .gitignore; Git ngừng theo dõi chúng ngay',
              'git rm -r --cached build dist, add the rules to .gitignore, commit and push; teammates stash their copies before pulling|||git rm -r --cached build dist, thêm luật vào .gitignore, commit và push; đồng đội stash bản của mình trước khi pull',
              'git stash and pull again every morning|||git stash rồi pull lại mỗi sáng',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'Build output is tracked, so the fix is to stop tracking it: git rm -r --cached removes it from the index (files stay on disk) and the .gitignore rules keep it out afterwards. Option B is the tempting one but wrong: a .gitignore rule never affects files already in the index. Committing binaries (A) just creates unresolvable binary conflicts, and stashing daily (D) treats the symptom forever.|||Sản phẩm build đang được theo dõi nên cách sửa là ngừng theo dõi: git rm -r --cached gỡ chúng khỏi index (tệp vẫn nằm trên đĩa) và luật .gitignore giữ chúng ra ngoài về sau. Đáp án B hấp dẫn nhưng sai: một luật .gitignore không bao giờ ảnh hưởng tới tệp đã nằm trong index. Commit tệp nhị phân (A) chỉ tạo ra xung đột nhị phân không giải được, còn stash mỗi ngày (D) chữa triệu chứng mãi mãi.',
          },
          {
            question: 'The team realises nbproject/private/private.properties, committed and pushed two days ago, contains the Tomcat manager password, which is also used for a test database. They have already removed the file from the repository. What must still be done?|||Nhóm nhận ra nbproject/private/private.properties, đã commit và push hai ngày trước, chứa mật khẩu Tomcat manager, cũng là mật khẩu của một database thử. Họ đã gỡ tệp khỏi kho. Còn phải làm gì?',
            options: [
              'Change the password everywhere it is used; the old value is still in history and must be treated as leaked|||Đổi mật khẩu ở mọi nơi nó được dùng; giá trị cũ vẫn nằm trong lịch sử và phải coi là đã lộ',
              'Nothing: once the file is deleted and the fix is pushed, the password is no longer reachable|||Không cần gì: khi tệp đã xoá và bản sửa đã push thì mật khẩu không còn với tới được',
              'Run git push --force with an empty commit so the old commits disappear from GitHub|||Chạy git push --force với một commit rỗng để các commit cũ biến khỏi GitHub',
              'Make the repository private; that removes the history|||Chuyển repository sang private; việc đó xoá lịch sử',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'The commits that contain the password are still in history, in every clone and possibly in forks and cached views. The first step is always to rotate the secret (and every place it is reused); rewriting history is optional afterwards. B is wrong because deleting a file does not delete its past versions; C does not remove anything (an empty commit changes nothing) and breaks teammates; D changes who can see the repository, not what it contains.|||Các commit chứa mật khẩu vẫn nằm trong lịch sử, trong mọi clone và có thể trong fork và bản lưu đệm. Bước đầu tiên luôn là xoay vòng bí mật (và mọi nơi dùng lại nó); viết lại lịch sử chỉ là tuỳ chọn sau đó. B sai vì xoá một tệp không xoá các phiên bản trước của nó; C không xoá được gì (commit rỗng không đổi gì) và làm hỏng clone đồng đội; D đổi người được xem kho, không đổi nội dung kho.',
          },
          {
            question: 'After a conflict in web.xml, Bình deletes the three marker lines (<<<<<<<, =======, >>>>>>>), keeps everything else and commits. Tomcat then fails on every machine. xmllint says: "Opening and ending tag mismatch: servlet-mapping … and servlet". Why?|||Sau một xung đột trong web.xml, Bình xoá ba dòng dấu hiệu (<<<<<<<, =======, >>>>>>>), giữ mọi thứ còn lại rồi commit. Tomcat lỗi trên mọi máy. xmllint báo: "Opening and ending tag mismatch: servlet-mapping … and servlet". Vì sao?',
            options: [
              'Git corrupted the file while merging; the merge must be redone with --strategy=theirs|||Git làm hỏng tệp khi merge; phải merge lại với --strategy=theirs',
              'The markers are required by XML parsers and must stay in the file|||Dấu hiệu là thứ trình phân tích XML bắt buộc phải có và phải ở lại trong tệp',
              'xmllint is outdated and reports an error that Tomcat does not care about|||xmllint đã cũ và báo một lỗi mà Tomcat không quan tâm',
              'Git cut the conflict region in the middle of XML elements, so keeping both halves glued the opening of one block to the tail of the other|||Git cắt vùng xung đột giữa chừng các phần tử XML, nên giữ cả hai nửa đã dán phần đầu của một khối vào phần đuôi của khối kia',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'A conflict hunk starts and ends where the two sides differ, not where an element starts and ends; the shared lines (such as the closing tag) stay outside the markers. Removing only the markers can therefore leave mismatched tags. The right fix is to rebuild the file from main plus your own block and validate it with xmllint or the IDE. Git did not corrupt anything (A), and markers must never stay in a file (B).|||Một đoạn xung đột bắt đầu và kết thúc ở chỗ hai phía khác nhau, không phải chỗ một phần tử bắt đầu và kết thúc; các dòng chung (như thẻ đóng) nằm ngoài dấu hiệu. Chỉ xoá dấu hiệu vì vậy có thể để lại các thẻ không khớp. Cách sửa đúng là dựng lại tệp từ main cộng khối của bạn rồi kiểm bằng xmllint hoặc IDE. Git không làm hỏng gì (A), và dấu hiệu không bao giờ được ở lại trong tệp (B).',
          },
          {
            question: 'Chi forgot to branch and built on main. git status -sb shows "## main...origin/main [ahead 1, behind 2]" and "UU web/WEB-INF/web.xml" after a git pull. She has not pushed anything. What is the first move?|||Chi quên rẽ nhánh và làm trên main. git status -sb hiện "## main...origin/main [ahead 1, behind 2]" và "UU web/WEB-INF/web.xml" sau một lần git pull. Bạn ấy chưa push gì. Nước đi đầu tiên là gì?',
            options: [
              'git reset --hard origin/main, then redo the work from memory|||git reset --hard origin/main, rồi làm lại việc theo trí nhớ',
              'git merge --abort, then put the commit on a branch before moving main|||git merge --abort, rồi đặt commit lên một nhánh trước khi dời main',
              'Edit web.xml right away and push with --force to settle the matter|||Sửa web.xml ngay và push với --force cho xong chuyện',
              'Delete the folder and clone the repository again|||Xoá thư mục và clone lại repository',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'Leave the half-done merge first (merge --abort returns to the state before the pull), then save the commit on a branch, and only then move main. A would destroy the only copy of her work before it is saved; C rewrites the shared branch; D throws away the unpushed commit that is inside the clone.|||Rời phép merge dang dở trước (merge --abort về trạng thái trước lần pull), rồi cất commit lên một nhánh, và chỉ lúc đó mới dời main. A phá bản duy nhất của việc trước khi kịp cất; C viết lại nhánh chung; D vứt commit chưa push nằm trong clone.',
          },
          {
            question: 'Chi has uncommitted edits in HomeServlet.java and types "git pull origin main". An changed the same file upstream. Git prints "Your local changes to the following files would be overwritten by merge … Aborting". What does it mean and what is safe?|||Chi có sửa chưa commit trong HomeServlet.java và gõ "git pull origin main". An đã sửa cùng tệp trên remote. Git in "Your local changes to the following files would be overwritten by merge … Aborting". Nghĩa là gì và làm gì an toàn?',
            options: [
              'The repository is corrupted; clone it again|||Kho bị hỏng; clone lại',
              'Git deleted her edits; recover them with git reflog|||Git đã xoá phần sửa của bạn ấy; khôi phục bằng git reflog',
              'Nothing was lost, the pull was refused; commit (or stash), then fetch and merge origin/main into her branch|||Không mất gì, pull bị từ chối; commit (hoặc stash), rồi fetch và merge origin/main vào nhánh của bạn ấy',
              'Run git pull --force to overwrite the file|||Chạy git pull --force để ghi đè tệp',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'The incoming commit touches a file with unsaved edits, so Git refuses rather than blend them: the pull did not happen and nothing was lost. Commit first (or stash), fetch, look at what is coming, then merge. There is no such thing as a safe pull --force here; and re-cloning (A) is the way to lose exactly the work the message was protecting.|||Commit sắp vào đụng một tệp có phần sửa chưa lưu, nên Git từ chối thay vì trộn: pull không xảy ra và không mất gì. Commit trước (hoặc stash), fetch, xem cái gì sắp về, rồi merge. Không có chuyện pull --force an toàn ở đây; và clone lại (A) là cách mất đúng phần việc mà thông báo đang bảo vệ.',
          },
          {
            question: 'Bình’s git push to main is rejected ("! [rejected] main -> main (fetch first)"). A teammate says: "just add --force". What is the right answer?|||git push lên main của Bình bị từ chối ("! [rejected] main -> main (fetch first)"). Một bạn bảo: "thêm --force là xong". Câu trả lời đúng là gì?',
            options: [
              'No: --force would delete the commit that someone else pushed; pull first (merge or rebase), then push|||Không: --force sẽ xoá commit mà người khác đã push; pull trước (merge hoặc rebase), rồi push',
              'Yes: --force only changes your own branch, so it is safe|||Được: --force chỉ đổi nhánh của riêng bạn nên an toàn',
              'Yes, but only on Fridays, when nobody pushes|||Được, nhưng chỉ vào thứ Sáu, khi không ai push',
              'No: delete the local main and recreate it from scratch|||Không: xoá main cục bộ và tạo lại từ đầu',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'The rejection means the remote main has a commit Bình lacks; forcing makes the remote forget it (the lab showed "(forced update)" and An’s commit vanishing from origin/main). The safe route is to integrate first: git pull --no-rebase (merge) or --rebase, then push. B is false: a force overwrites the shared branch, not "your own".|||Việc bị từ chối nghĩa là main trên remote có một commit Bình chưa có; force làm remote "quên" nó (lab đã cho thấy "(forced update)" và commit của An biến khỏi origin/main). Đường an toàn là tích hợp trước: git pull --no-rebase (merge) hoặc --rebase, rồi push. B sai: force ghi đè nhánh chung, không phải nhánh "của riêng bạn".',
          },
          {
            question: 'git status -sb shows "## main...origin/main [ahead 2]": two commits meant for a feature branch were made on main and nothing was pushed. Which sequence moves them safely?|||git status -sb hiện "## main...origin/main [ahead 2]": hai commit đáng lẽ thuộc nhánh tính năng đã làm trên main và chưa push gì. Chuỗi lệnh nào dời chúng an toàn?',
            options: [
              'git reset --hard origin/main, then git switch -c feature/x|||git reset --hard origin/main, rồi git switch -c feature/x',
              'git branch feature/x, git reset --hard origin/main, git switch feature/x|||git branch feature/x, git reset --hard origin/main, git switch feature/x',
              'git revert HEAD~2..HEAD, then git push|||git revert HEAD~2..HEAD, rồi git push',
              'git push --force origin main, then create the branch on GitHub|||git push --force origin main, rồi tạo nhánh trên GitHub',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'Create the branch at the current commit first, so the commits stay reachable, then reset main to origin/main and switch. A runs the reset before the commits are saved, and after it no branch points at them (only the reflog remembers). C and D publish the mistake — the commits have not left the laptop, so there is nothing to revert or force.|||Tạo nhánh tại commit hiện tại trước, để các commit còn với tới được, rồi reset main về origin/main và chuyển nhánh. A chạy reset trước khi cất commit, và sau đó không nhánh nào trỏ tới chúng (chỉ reflog còn nhớ). C và D công bố luôn lỗi — commit chưa rời laptop nên không có gì để revert hay force.',
          },
          {
            question: 'The same two commits were pushed to main and three teammates have already pulled them. Which fix is correct?|||Hai commit đó đã được push lên main và ba bạn đã pull chúng. Cách sửa nào đúng?',
            options: [
              'git reset --hard HEAD~2 and git push --force origin main|||git reset --hard HEAD~2 và git push --force origin main',
              'Ask everyone to delete their clones and clone again|||Nhờ mọi người xoá clone và clone lại',
              'git branch -D main on your laptop and push|||git branch -D main trên laptop của bạn và push',
              'Keep the work on a branch, then git revert HEAD~2..HEAD and push (a normal push)|||Giữ việc trên một nhánh, rồi git revert HEAD~2..HEAD và push (push thường)',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'On a shared branch history may only grow: revert adds two commits that cancel the mistake and everybody’s next pull is a fast-forward, while the work survives on its branch. A rewrites a branch three people already have; B and C do not undo anything on the remote.|||Trên nhánh chung lịch sử chỉ được dài thêm: revert thêm hai commit huỷ lỗi và lần pull kế của mọi người là fast-forward, còn việc vẫn sống trên nhánh của nó. A viết lại nhánh mà ba người đã có; B và C không hoàn tác được gì trên remote.',
          },
          {
            question: 'Looking at the history of main you see a merge titled "Merge nhanh trang-chu-moi (khong qua PR)" and the app now has two servlets mapped to /home. Which measure prevents the next one?|||Nhìn lịch sử main bạn thấy một merge tên "Merge nhanh trang-chu-moi (khong qua PR)" và ứng dụng giờ có hai servlet cùng ánh xạ /home. Biện pháp nào ngăn lần sau?',
            options: [
              'A ruleset on main requiring a pull request and an approval, with an empty bypass list, plus CODEOWNERS for web.xml|||Một ruleset trên main bắt buộc pull request và một lượt duyệt, danh sách bypass để trống, cộng CODEOWNERS cho web.xml',
              'Put the team leader on the bypass list so emergencies can be fixed quickly|||Đưa trưởng nhóm vào danh sách bypass để sửa khẩn cấp cho nhanh',
              'Ask everybody to be more careful before merging|||Nhắc mọi người cẩn thận hơn trước khi merge',
              'Rename main to master|||Đổi tên main thành master',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'Rules enforced by the server survive deadline pressure; reminders (C) do not. A bypass for the leader (B) re-opens exactly the shortcut that caused the accident. Renaming the branch (D) changes nothing. Check in Settings whether your plan allows rulesets; if not, agree the rule in writing and add a local pre-push hook.|||Luật do máy chủ thực thi sống qua áp lực hạn nộp; lời nhắc (C) thì không. Một lối bypass cho trưởng nhóm (B) mở lại đúng đường tắt đã gây tai nạn. Đổi tên nhánh (D) không đổi gì. Hãy kiểm trong Settings xem gói của bạn có cho ruleset không; nếu không, thoả thuận luật bằng văn bản và thêm hook pre-push cục bộ.',
          },
          {
            question: 'main already has the bad merge reverted with "git revert -m 1". Bình fixes his branch and runs "git merge feature/trang-chu-moi" on main: "Already up to date." What is going on and what is the way out?|||main đã revert merge hỏng bằng "git revert -m 1". Bình sửa nhánh của mình và chạy "git merge feature/trang-chu-moi" trên main: "Already up to date." Chuyện gì đang xảy ra và lối ra là gì?',
            options: [
              'The fix was lost; redo the whole feature from scratch|||Bản sửa đã mất; làm lại cả tính năng từ đầu',
              'GitHub caches the branch; wait ten minutes and merge again|||GitHub lưu đệm nhánh; chờ mười phút rồi merge lại',
              'The branch commits are already ancestors of main, so Git has nothing to merge; revert the revert (locally, before pushing), then merge the fixed branch|||Các commit của nhánh đã là tổ tiên của main nên Git không có gì để merge; revert cái revert (cục bộ, trước khi push), rồi merge nhánh đã sửa',
              'Use git merge --force to bring the commits back|||Dùng git merge --force để mang các commit về',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'Git merges only commits that are not yet ancestors. The original merge made them ancestors, and the revert is just another commit on top, so re-merging does nothing; merging a fixed branch without undoing the revert gives a confusing conflict instead. Reverting the revert restores the merged content, after which merging the fixed branch applies only the fix. Nothing is lost (A), caching is irrelevant (B), and git merge has no --force (D).|||Git chỉ merge các commit chưa là tổ tiên. Lần merge gốc đã biến chúng thành tổ tiên, và revert chỉ là một commit nữa nằm trên, nên merge lại không làm gì; merge nhánh đã sửa mà không huỷ revert thì cho một xung đột khó hiểu. Revert cái revert khôi phục nội dung đã merge, sau đó merge nhánh đã sửa chỉ áp bản sửa. Không mất gì (A), lưu đệm không liên quan (B), và git merge không có --force (D).',
          },
        ],
      },
    },
  ],
};
