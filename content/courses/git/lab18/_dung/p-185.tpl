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
@@T('tu-merge','git switch -c','index.jsp: them footer')@@
<p>Everyone who pulls now has two servlets mapped to <code>/home</code>, a configuration Tomcat rejects at deployment. The line <code>grep -c</code> printed <code>2</code>: the pattern appears twice. The merge itself is perfectly valid Git; Git cannot know that two URLs collide. Only a human (or a build that starts the app) can.</p>

<h3>How to see afterwards that a review was skipped</h3>
<p>The history of <code>main</code> tells the story. <code>git log --first-parent --oneline</code> shows what each step on <code>main</code> was, and <code>--merges</code> with a format shows who made each merge. On GitHub a merged pull request leaves a commit titled <em>Merge pull request #N from …</em>; a merge with any other title (here <em>"Merge nhanh trang-chu-moi (khong qua PR)"</em>) was made on a laptop. If the PR list has no entry for a commit that is on <code>main</code>, nobody reviewed it.</p>

<h3>The remedy that works: make <code>main</code> refuse the shortcut</h3>
<p>Good intentions do not survive a deadline night; rules enforced by the server do. In the lab the remote carries a small hook that rejects pushes to <code>main</code>. <strong>This is a simulation</strong>: GitHub's real message is different, but the effect for the person who typed the command is the same:</p>
@@T('tu-merge','index.jsp: them footer')@@
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
@@T('tu-merge','git switch -c','index.jsp: them footer')@@
<p>Ai pull về giờ cũng có hai servlet cùng ánh xạ tới <code>/home</code>, một cấu hình Tomcat từ chối lúc deploy. Dòng <code>grep -c</code> in ra <code>2</code>: mẫu xuất hiện hai lần. Bản thân phép merge là Git hoàn toàn hợp lệ; Git không thể biết hai URL va nhau. Chỉ con người (hoặc một lần build có chạy ứng dụng) mới biết.</p>

<h3>Làm sao biết sau đó rằng review đã bị bỏ qua</h3>
<p>Lịch sử của <code>main</code> kể lại chuyện. <code>git log --first-parent --oneline</code> cho thấy mỗi bước trên <code>main</code> là gì, và <code>--merges</code> kèm định dạng cho thấy ai làm từng lần merge. Trên GitHub, một pull request đã merge để lại commit tên <em>Merge pull request #N from …</em>; merge có tên khác (ở đây <em>"Merge nhanh trang-chu-moi (khong qua PR)"</em>) được làm trên một laptop. Nếu danh sách PR không có mục nào cho một commit đang nằm trên <code>main</code>, thì chưa ai review nó.</p>

<h3>Thuốc chữa có tác dụng: cho <code>main</code> từ chối đường tắt</h3>
<p>Thiện chí không sống nổi qua đêm sát hạn; luật do máy chủ thực thi thì sống. Trong lab, remote mang một hook nhỏ từ chối push vào <code>main</code>. <strong>Đây là mô phỏng</strong>: thông báo thật của GitHub khác, nhưng tác dụng với người gõ lệnh là như nhau:</p>
@@T('tu-merge','index.jsp: them footer')@@
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

