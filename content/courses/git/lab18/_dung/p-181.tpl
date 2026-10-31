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
@@T('build','git status --short','git pull',drop=[' create mode'])@@
<p>Seven files went in: three compiled <code>.class</code> files, the <code>.war</code>, and two files under <code>nbproject/private/</code>. Bình pulls (a fast-forward, so it works), builds on his own laptop — NetBeans rewrites <code>private.properties</code> with <em>his</em> Tomcat path — and now has local changes to files Git tracks:</p>
@@T('build','git pull','git add .',drop=[' create mode',' .../',' dist/',' nbproject/',' src/',' 7 files'],maxout=6)@@
<p>Then An fixes something, builds again, runs <code>git add .</code> again and pushes. Bình's next <code>git pull</code> is the one that stops:</p>
@@T('build','git add .','git pull',nth=1)@@
@@T('build','git pull','git status',nth=1)@@
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
@@T('build','git status --short','git rm',nth=2)@@
<p>Read the first block: <code>git status</code> still lists <code>build/…</code> and <code>dist/…</code> as <strong>modified</strong> (<code>M</code>) although <code>.gitignore</code> now names them. A pattern in <code>.gitignore</code> applies only to <em>untracked</em> files; once a file is in the index Git keeps tracking it. <code>git check-ignore -v</code> prints nothing by default. With <code>--no-index</code> ("pretend the index is empty") it shows the rule that <em>would</em> match: <code>.gitignore:3:build/</code>.</p>

<h3>Fix 2 — remove from the index, keep on disk</h3>
@@T('build','git rm','git log --oneline --all',drop=[' delete mode'])@@
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
@@T('build','git stash push',drop=[' delete mode',' .../',' dist/',' nbproject/',' src/'],maxout=9)@@
<p>Look at the last <code>ls nbproject</code>: <code>private/</code> is gone from Bình's disk. NetBeans will recreate it, but his registered Tomcat server was stored there, so NetBeans may ask him to choose the server again. To keep it, copy <code>nbproject/private</code> somewhere outside the project <em>before</em> pulling, and put it back afterwards — it is ignored now, so Git will not mind.</p>

<h3>It is already on GitHub. Now what?</h3>
${slide('git-18', 5, 'Tệp đã xoá vẫn nằm trong lịch sử')}
<p>The fix commit stops the problem from <em>growing</em>. It does not remove the old commits: the files are still in history, and anyone with a clone can read them.</p>
@@T('build','git log --oneline --all','git stash push')@@
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
@@T('build','git status --short','git pull',drop=[' create mode'])@@
<p>Bảy tệp đã vào: ba tệp <code>.class</code> đã biên dịch, tệp <code>.war</code>, và hai tệp trong <code>nbproject/private/</code>. Bình pull (tua thẳng — fast-forward — nên chạy được), build trên laptop của mình — NetBeans viết lại <code>private.properties</code> bằng đường dẫn Tomcat của <em>Bình</em> — và giờ Bình có thay đổi cục bộ ở những tệp Git đang theo dõi:</p>
@@T('build','git pull','git add .',drop=[' create mode',' .../',' dist/',' nbproject/',' src/',' 7 files'],maxout=6)@@
<p>Rồi An sửa tiếp, build lại, lại <code>git add .</code> và push. Lần <code>git pull</code> kế của Bình thì dừng:</p>
@@T('build','git add .','git pull',nth=1)@@
@@T('build','git pull','git status',nth=1)@@
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
@@T('build','git status --short','git rm',nth=2)@@
<p>Đọc khối đầu: <code>git status</code> vẫn liệt kê <code>build/…</code> và <code>dist/…</code> là <strong>đã sửa</strong> (<code>M</code>) dù <code>.gitignore</code> đã ghi tên chúng. Một mẫu trong <code>.gitignore</code> chỉ áp dụng cho tệp <em>chưa theo dõi</em>; tệp đã nằm trong index thì Git cứ theo dõi tiếp. <code>git check-ignore -v</code> mặc định không in gì. Thêm <code>--no-index</code> ("coi như index trống") thì nó chỉ ra luật <em>sẽ</em> khớp: <code>.gitignore:3:build/</code>.</p>

<h3>Sửa 2 — gỡ khỏi index, giữ trên đĩa</h3>
@@T('build','git rm','git log --oneline --all',drop=[' delete mode'])@@
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
@@T('build','git stash push',drop=[' delete mode',' .../',' dist/',' nbproject/',' src/'],maxout=9)@@
<p>Nhìn dòng <code>ls nbproject</code> cuối cùng: <code>private/</code> biến khỏi đĩa của Bình. NetBeans sẽ tạo lại, nhưng máy chủ Tomcat đã đăng ký của bạn ấy nằm trong đó, nên NetBeans có thể hỏi chọn lại server. Muốn giữ, hãy chép <code>nbproject/private</code> ra ngoài dự án <em>trước</em> khi pull rồi chép về sau — giờ nó bị bỏ qua nên Git không phản đối.</p>

<h3>Nó đã nằm trên GitHub. Làm gì?</h3>
${slide('git-18', 5, 'Tệp đã xoá vẫn nằm trong lịch sử')}
<p>Commit sửa chỉ chặn vấn đề <em>lớn thêm</em>. Nó không xoá các commit cũ: tệp vẫn nằm trong lịch sử, ai có bản clone cũng đọc được.</p>
@@T('build','git log --oneline --all','git stash push')@@
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

