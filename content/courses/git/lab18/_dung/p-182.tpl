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
@@T('xung-dot-web-xml','git switch -c feature/dat-lich','git switch main',drop=[' create mode'])@@
<p>The team accepts An's pull request first. (The lab simulates GitHub's <em>Merge pull request</em> button with <code>git merge --no-ff</code> in An's clone.) Bình's pull request now waits.</p>
@@T('xung-dot-web-xml','git switch main','git fetch')@@

<h3>See it coming, before it hurts</h3>
${slide('git-18', 8, 'PR để lâu: main đi xa dần')}
<p>A few read-only commands tell Bình how far his branch has drifted and whether the merge will conflict — without touching his working folder:</p>
@@T('xung-dot-web-xml','git fetch','git merge origin/main')@@
<div class="kv-grid">
  <div class="kv"><span class="k">rev-list --left-right --count</span><span class="v"><code>1  2</code>: the branch has 1 commit main lacks, main has 2 commits the branch lacks (An's commit and the merge commit). The number grows every day the pull request waits.</span></div>
  <div class="kv"><span class="k">log … -- web/WEB-INF/web.xml</span><span class="v">Which of main's new commits touched the file you also touched. One line here is a conflict waiting to happen.</span></div>
  <div class="kv"><span class="k">merge-tree --write-tree --name-only</span><span class="v">A dry run of the merge (Git 2.38 or newer): it prints the result's tree id, then the files that would conflict. It changes nothing in your folder.</span></div>
</div>

<h3>Reading the conflict</h3>
<p>Bình brings <code>main</code> into his branch — the safe direction: he fixes the problem on <em>his</em> branch, not on the shared one:</p>
@@T('xung-dot-web-xml','git merge origin/main','xmllint')@@
<p><code>UU</code> means "unmerged, both sides modified". Between <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> and <code>=======</code> is Bình's version; between <code>=======</code> and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main</code> is An's. Both are wanted. Notice <em>where</em> Git cut: the shared lines (<code>&lt;/servlet-mapping&gt;</code>, the closing of a block) are <strong>outside</strong> the markers, because they are identical on both sides. Each side's block starts right after a shared <code>&lt;servlet&gt;</code> and stops right before a shared <code>&lt;/servlet-mapping&gt;</code> — a hunk that begins and ends in the middle of an XML element.</p>

<h3>The trap: delete the three marker lines and keep everything</h3>
<p>The obvious fix is to delete the lines starting with <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code> and <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> (in an editor, or with <code>sed -e '/^&lt;&lt;&lt;&lt;&lt;&lt;&lt; /d' -e '/^=======$/d' -e '/^&gt;&gt;&gt;&gt;&gt;&gt;&gt; /d'</code>). Git is satisfied — no markers left, so <code>git add</code> and <code>git commit</code> succeed. The file is not:</p>
${slide('git-18', 7, 'Xoá dấu hiệu xung đột làm hỏng XML')}
@@T('xung-dot-web-xml','xmllint','grep -nE')@@
<p><code>xmllint</code> (installed on Mac and Linux; on Windows let NetBeans or VS Code open the file — both underline broken XML) reports that a <code>&lt;servlet-mapping&gt;</code> is closed by <code>&lt;/servlet&gt;</code>. Keeping both halves glued the first block's opening to the second block's tail. Tomcat will fail to deploy, and the failure shows up on <em>everybody's</em> machine after the merge, not in the commit that caused it.</p>

<h3>Fix: resolve at the level of the meaning, not the markers</h3>
<p>The robust way for a structured file is to rebuild it: take <code>main</code>'s version as the base and re-add your own block in the right place, then validate.</p>
@@T('xung-dot-web-xml','grep -nE')@@
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
@@T('xung-dot-web-xml','git switch -c feature/dat-lich','git switch main',drop=[' create mode'])@@
<p>Nhóm duyệt pull request của An trước. (Lab giả lập nút <em>Merge pull request</em> của GitHub bằng <code>git merge --no-ff</code> trong clone của An.) Pull request của Bình giờ phải chờ.</p>
@@T('xung-dot-web-xml','git switch main','git fetch')@@

<h3>Thấy nó trước khi nó đau</h3>
${slide('git-18', 8, 'PR để lâu: main đi xa dần')}
<p>Vài lệnh chỉ-đọc cho Bình biết nhánh mình đã trôi bao xa và merge có xung đột không — mà không đụng vào thư mục làm việc:</p>
@@T('xung-dot-web-xml','git fetch','git merge origin/main')@@
<div class="kv-grid">
  <div class="kv"><span class="k">rev-list --left-right --count</span><span class="v"><code>1  2</code>: nhánh có 1 commit mà main chưa có, main có 2 commit mà nhánh chưa có (commit của An và commit merge). Con số này tăng mỗi ngày pull request nằm chờ.</span></div>
  <div class="kv"><span class="k">log … -- web/WEB-INF/web.xml</span><span class="v">Commit mới nào của main đã đụng vào tệp mà bạn cũng đụng. Một dòng ở đây nghĩa là xung đột đang chờ sẵn.</span></div>
  <div class="kv"><span class="k">merge-tree --write-tree --name-only</span><span class="v">Chạy thử phép merge (Git 2.38 trở lên): in id cây kết quả, rồi các tệp sẽ xung đột. Không đổi gì trong thư mục của bạn.</span></div>
</div>

<h3>Đọc xung đột</h3>
<p>Bình đưa <code>main</code> vào nhánh của mình — chiều an toàn: sửa vấn đề trên nhánh của <em>bạn ấy</em>, không phải trên nhánh chung:</p>
@@T('xung-dot-web-xml','git merge origin/main','xmllint')@@
<p><code>UU</code> nghĩa là "chưa merge xong, cả hai phía đều sửa". Giữa <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> và <code>=======</code> là bản của Bình; giữa <code>=======</code> và <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; origin/main</code> là bản của An. Cả hai đều cần. Để ý Git cắt <em>ở đâu</em>: các dòng chung (<code>&lt;/servlet-mapping&gt;</code>, phần đóng khối) nằm <strong>ngoài</strong> dấu hiệu vì hai phía giống hệt nhau. Khối của mỗi phía bắt đầu ngay sau một thẻ <code>&lt;servlet&gt;</code> chung và dừng ngay trước một thẻ <code>&lt;/servlet-mapping&gt;</code> chung — một đoạn bắt đầu và kết thúc giữa chừng một phần tử XML.</p>

<h3>Cái bẫy: xoá ba dòng dấu hiệu rồi giữ hết</h3>
<p>Cách sửa hiển nhiên là xoá các dòng bắt đầu bằng <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>, <code>=======</code> và <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> (trong trình soạn thảo, hoặc bằng <code>sed -e '/^&lt;&lt;&lt;&lt;&lt;&lt;&lt; /d' -e '/^=======$/d' -e '/^&gt;&gt;&gt;&gt;&gt;&gt;&gt; /d'</code>). Git hài lòng — hết dấu hiệu nên <code>git add</code> và <code>git commit</code> chạy được. Tệp thì không ổn:</p>
${slide('git-18', 7, 'Xoá dấu hiệu xung đột làm hỏng XML')}
@@T('xung-dot-web-xml','xmllint','grep -nE')@@
<p><code>xmllint</code> (có sẵn trên Mac và Linux; trên Windows hãy mở tệp bằng NetBeans hoặc VS Code — cả hai gạch chân XML hỏng) báo một thẻ <code>&lt;servlet-mapping&gt;</code> bị đóng bằng <code>&lt;/servlet&gt;</code>. Giữ cả hai nửa đã dán phần đầu của khối thứ nhất vào phần đuôi của khối thứ hai. Tomcat sẽ không deploy được, và lỗi hiện ra trên máy của <em>mọi người</em> sau khi merge, không phải ở commit gây ra nó.</p>

<h3>Cách sửa: giải theo nghĩa, không theo dấu hiệu</h3>
<p>Với tệp có cấu trúc, cách chắc là dựng lại nó: lấy bản của <code>main</code> làm gốc, thêm lại khối của mình vào đúng chỗ, rồi kiểm tra hợp lệ.</p>
@@T('xung-dot-web-xml','grep -nE')@@
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
