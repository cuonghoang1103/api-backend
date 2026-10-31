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
@@T('tong-hop','git switch -c','git add .')@@
@@T('tong-hop','git add .','git status -sb')@@

<h3>Step 1 — look, do not type</h3>
<p>Resist the urge to "just fix it". Four read-only commands (plus <code>git reflog</code> if a commit seems to have vanished) tell the whole story, and none of them can make anything worse:</p>
@@T('tong-hop','git status -sb','git merge --abort')@@
<div class="kv-grid">
  <div class="kv"><span class="k">git status -sb</span><span class="v"><code>## main...origin/main [ahead 1, behind 2]</code> — Chi's commit is on <code>main</code> (mistake of 18.4), the remote has two commits she lacks (18.3). <code>UU web/WEB-INF/web.xml</code> — a merge is in progress and stopped on conflicts (18.2).</span></div>
  <div class="kv"><span class="k">git diff --name-only --diff-filter=U</span><span class="v">Exactly the files that are still unresolved: one.</span></div>
  <div class="kv"><span class="k">git log --oneline --graph --all</span><span class="v">The shape of the problem: Chi's commit hangs off the old base while the remote has moved on.</span></div>
  <div class="kv"><span class="k">git ls-files build dist nbproject/private</span><span class="v">Five tracked files that must not be tracked (18.1).</span></div>
</div>
<p>Diagnosis in one sentence: <em>work on main by mistake + build output committed + a diverged push, with a shared-file conflict half-way through a merge.</em> Four accidents from four lessons — fix them from the outside in.</p>

<h3>Step 2 — save: nothing is lost, and we leave the half-done merge</h3>
<p>The first move is the safest: leave the unfinished merge with <code>git merge --abort</code>. It returns to the state before the pull, with Chi's commit intact. Then put the work on a branch <em>before</em> moving <code>main</code> (18.4):</p>
@@T('tong-hop','git merge --abort','git rm -r')@@
<p><code>main</code> now equals the remote's (<code>HEAD is now at a2efb48 …</code>) and the work sits on <code>feature/tra-cuu</code>. Nothing was pushed anywhere, nothing can be lost: the branch holds the commit.</p>

<h3>Steps 3–5 — peel off the layers on the branch</h3>
<p>On the branch: stop tracking build output (18.1), bring <code>main</code> in and resolve the shared file by rebuilding it and validating it (18.2), then push <em>the branch</em> and open a pull request instead of touching <code>main</code> (18.5):</p>
@@T('tong-hop','git rm -r')@@
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
@@T('tong-hop','git switch -c','git add .')@@
@@T('tong-hop','git add .','git status -sb')@@

<h3>Bước 1 — nhìn, đừng gõ</h3>
<p>Cưỡng lại ý muốn "sửa luôn cho xong". Bốn lệnh chỉ-đọc (thêm <code>git reflog</code> nếu có commit tưởng đã biến mất) kể trọn câu chuyện, và không lệnh nào làm mọi thứ tệ hơn được:</p>
@@T('tong-hop','git status -sb','git merge --abort')@@
<div class="kv-grid">
  <div class="kv"><span class="k">git status -sb</span><span class="v"><code>## main...origin/main [ahead 1, behind 2]</code> — commit của Chi nằm trên <code>main</code> (lỗi của 18.4), remote có hai commit bạn ấy chưa có (18.3). <code>UU web/WEB-INF/web.xml</code> — một phép merge đang dở, dừng vì xung đột (18.2).</span></div>
  <div class="kv"><span class="k">git diff --name-only --diff-filter=U</span><span class="v">Đúng những tệp còn chưa giải: một tệp.</span></div>
  <div class="kv"><span class="k">git log --oneline --graph --all</span><span class="v">Hình dạng của vấn đề: commit của Chi treo vào gốc cũ trong khi remote đã đi tiếp.</span></div>
  <div class="kv"><span class="k">git ls-files build dist nbproject/private</span><span class="v">Năm tệp đang được theo dõi mà không được phép (18.1).</span></div>
</div>
<p>Chẩn đoán trong một câu: <em>làm nhầm trên main + sản phẩm build đã commit + push bị rẽ đôi, kèm một xung đột tệp chung giữa chừng một phép merge.</em> Bốn tai nạn của bốn bài — sửa từ ngoài vào trong.</p>

<h3>Bước 2 — cất việc: không mất gì, và rời phép merge dang dở</h3>
<p>Nước đi đầu tiên là an toàn nhất: rời phép merge chưa xong bằng <code>git merge --abort</code>. Nó quay về trạng thái trước lần pull, với commit của Chi còn nguyên. Rồi đặt việc lên một nhánh <em>trước</em> khi dời <code>main</code> (18.4):</p>
@@T('tong-hop','git merge --abort','git rm -r')@@
<p>Giờ <code>main</code> bằng remote (<code>HEAD is now at a2efb48 …</code>) và việc nằm trên <code>feature/tra-cuu</code>. Chưa push đi đâu, không gì mất được: nhánh giữ commit.</p>

<h3>Bước 3–5 — bóc từng lớp trên nhánh</h3>
<p>Trên nhánh: ngừng theo dõi sản phẩm build (18.1), đưa <code>main</code> vào và giải tệp chung bằng cách dựng lại rồi kiểm hợp lệ (18.2), sau đó push <em>nhánh</em> và mở pull request thay vì đụng <code>main</code> (18.5):</p>
@@T('tong-hop','git rm -r')@@
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

