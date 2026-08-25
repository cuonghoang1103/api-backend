/**
 * Git & GitHub — Chương 5: Remote & GitHub.
 * remote là gì · fetch vs pull · nhánh theo dõi · SSH vs HTTPS và token ·
 * push (-u, xoá nhánh remote, tag) · giữ đồng bộ khi hai bên phân ly · fork & upstream.
 * Output CHẠY THẬT git 2.43. LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;;
 * & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 5 — Remotes & GitHub|||Chương 5 — Remote & GitHub',
  description: 'Git là phân tán, nên "máy chủ" chỉ là một bản clone mà mọi người đồng ý coi là trung tâm. Chương này làm rõ remote thật sự là gì, vì sao fetch an toàn còn pull thì không phải lúc nào cũng vậy, nhánh theo dõi hoạt động ra sao, cách xác thực với GitHub, và quy trình fork/upstream để đóng góp cho dự án của người khác.',
  lessons: [
    /* ─────────────────────────── 5.1 ─────────────────────────── */
    {
      title: '5.1 — What a remote is, and why fetch ≠ pull|||5.1 — Remote là gì, và vì sao fetch ≠ pull',
      slug: 'git-5-1-remote-fetch-pull',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Remote chỉ là một cái tên gán cho một URL, nhánh theo dõi remote (origin/main) là gì và khác nhánh cục bộ ra sao, vì sao fetch là thao tác an toàn tuyệt đối, và pull thật ra là hai lệnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>"origin" is just a nickname for a URL</h2>
<p class="lead">Git has no concept of a server. A <strong>remote</strong> is a saved shortcut: a short name mapped to somewhere another copy of this repository lives. There is nothing special about the name <code>origin</code> — it is simply what <code>git clone</code> calls the place it cloned from.</p>

<pre><code>git remote -v</code></pre>
<div class="out">origin  git@github.com:cuonghoang1103/api-backend.git (fetch)
origin  git@github.com:cuonghoang1103/api-backend.git (push)</div>
<pre><code>git remote add upstream git@github.com:original/project.git   <span class="tok-comment"># add another</span>
git remote rename origin github                                <span class="tok-comment"># rename</span>
git remote remove upstream                                     <span class="tok-comment"># remove</span>
git remote show origin                                         <span class="tok-comment"># full detail: branches, tracking, stale refs</span></code></pre>
<div class="callout ok">A repository can have as many remotes as you like, and they need not be GitHub. A remote can be a GitLab URL, a bare repository on your own server, or even a folder on the same disk — <code>git remote add nha /srv/repos/api.git</code> works. That is what "distributed" means in practice.</div>

<h3>Three kinds of branch</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">main</span><span class="lz-v">A <strong>local branch</strong>. Yours. You commit on it and it moves.</span></div>
  <div class="lz-layer"><span class="lz-k">origin/main</span><span class="lz-v">A <strong>remote-tracking branch</strong>. Your local record of where <code>main</code> was on the server the last time you talked to it. You cannot commit on it; Git updates it for you.</span></div>
  <div class="lz-layer"><span class="lz-k">main on the server</span><span class="lz-v">The real thing, on GitHub. You never see it directly — only <code>origin/main</code>, which may be hours out of date.</span></div>
</div>
<div class="callout warn">This is the source of most remote confusion. <code>origin/main</code> is <strong>not live</strong>. It is a cached snapshot that only changes when you run <code>fetch</code>, <code>pull</code> or <code>push</code>. If a colleague pushed five minutes ago, your <code>origin/main</code> still points at yesterday's commit until you fetch — and <code>git log origin/main</code> will confidently show you stale information.</div>

<h3>fetch — download, change nothing</h3>
<pre><code>git fetch origin</code></pre>
<div class="out">remote: Enumerating objects: 24, done.
From github.com:cuonghoang1103/api-backend
   7b3e9d1..5f7a9c2  main       -&gt; origin/main
 * [new branch]      feature/feed -&gt; origin/feature/feed</div>
<p>New commits are downloaded and the remote-tracking branches move. Your local branches, your working directory and your index are <strong>untouched</strong>. Nothing can break, nothing can conflict, and nothing you were doing is interrupted.</p>
<pre><code><span class="tok-comment"># The safe review ritual, after fetching:</span>
git log --oneline main..origin/main     <span class="tok-comment"># what did they add?</span>
git diff main origin/main --stat        <span class="tok-comment"># how big is it?</span>
git log --oneline origin/main..main     <span class="tok-comment"># what do I have that they do not?</span></code></pre>
<div class="callout ok"><code>git fetch</code> is the only network command in Git that cannot possibly cause a problem. Run it whenever you want to know what is going on — before starting work, before pushing, before deciding whether to rebase. Some people run it on a timer.</div>

<h3>pull — fetch, then integrate</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">git fetch</div><div class="lz-d">Download and move origin/main. Safe.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">git merge origin/main</div><div class="lz-d">Integrate into your branch. Can conflict, can create a merge commit, changes your working directory.</div></div>
</div>
<p>That is all <code>git pull</code> is: two commands with one name. The second half is the one that can surprise you — which is why the two-step version is worth using whenever you are unsure what is waiting on the server.</p>
<pre><code>git pull                     <span class="tok-comment"># fetch + merge (default)</span>
git pull --rebase            <span class="tok-comment"># fetch + rebase (3.4)</span>
git pull --ff-only           <span class="tok-comment"># fetch + merge, but REFUSE if it is not a fast-forward</span></code></pre>
<div class="callout warn"><code>--ff-only</code> is the setting worth adopting. If your branch and the server have both moved, it stops and tells you, instead of silently creating a merge commit you did not ask for. You then choose <code>--rebase</code> or a real merge — deliberately. <code>git config --global pull.ff only</code> makes it the default.</div>

<h3>Reading the divergence</h3>
<pre><code>git status</code></pre>
<div class="out">On branch main
Your branch and 'origin/main' have diverged,
and have 2 and 3 different commits each, respectively.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">"ahead 2"</span><span class="v">You have 2 commits the server does not. Push them.</span></div>
  <div class="kv"><span class="k">"behind 3"</span><span class="v">The server has 3 you do not. Pull them.</span></div>
  <div class="kv"><span class="k">"diverged, 2 and 3"</span><span class="v">Both. You must integrate before you can push — merge or rebase, your choice.</span></div>
  <div class="kv"><span class="k">"up to date"</span><span class="v">Only as of your last fetch. Run <code>git fetch</code> before believing it.</span></div>
</div>
<pre><code>git branch -vv               <span class="tok-comment"># every local branch, its upstream, and ahead/behind</span></code></pre>
<div class="out">* main          5f7a9c2 [origin/main: ahead 2, behind 3] fix(auth): reject expired
  feature/login 3f8a1c9 [origin/feature/login] feat(auth): rotation
  experiment    9e2d4b7 no upstream — never pushed</div>

<h3>Cleaning up branches that were deleted on the server</h3>
<pre><code>git fetch --prune            <span class="tok-comment"># delete origin/* refs whose branch is gone from the server</span>
git config --global fetch.prune true    <span class="tok-comment"># do it on every fetch</span></code></pre>
<p>Without pruning, <code>git branch -a</code> keeps listing <code>origin/feature/old-thing</code> for branches that were merged and deleted months ago. Turn it on once and forget about it.</p>

<h3>The clone, seen through this lens</h3>
<pre><code>git clone git@github.com:cuonghoang1103/api-backend.git</code></pre>
<p>A clone is four operations: create a directory with a <code>.git</code>, add a remote called <code>origin</code>, fetch everything, and check out the default branch with a local branch tracking <code>origin/main</code>. Every one of those is a command you already know.</p>
<pre><code>git clone --depth 1 &lt;url&gt;        <span class="tok-comment"># shallow: latest commit only, no history (fast CI)</span>
git clone --branch v1.4.0 &lt;url&gt;  <span class="tok-comment"># start on a specific branch or tag</span>
git clone --bare &lt;url&gt;           <span class="tok-comment"># no working directory — this is what a server holds</span></code></pre>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 2.5 — Working with Remotes</span><span class="lc-sub">remote add/rename/remove, and what "remote-tracking branch" means.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-fetch" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">git-fetch — refspecs, --prune, --all</span><span class="lc-sub">The refspec section explains how origin/* mapping actually works.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> trusting <code>git log origin/main</code> without fetching first. It reads your local cache, so after a week away it happily shows you a week-old picture with no warning at all — and decisions made from it (whether to rebase, whether your fix is already upstream) will be wrong. Make <code>git fetch</code> the first command of every working session.</div>
<p class="note-ct"><strong>The distinction to hold on to:</strong> <code>fetch</code> updates your <em>knowledge</em>; <code>merge</code>/<code>rebase</code> updates your <em>work</em>; <code>pull</code> does both in one step and hides which. When something surprising happens after a pull, redo it as fetch-then-look-then-integrate and the surprise usually explains itself.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>"origin" chỉ là biệt danh của một URL</h2>
<p class="lead">Git không có khái niệm máy chủ. Một <strong>remote</strong> là một lối tắt được lưu lại: một cái tên ngắn ánh xạ tới nơi có một bản sao khác của kho mã này. Cái tên <code>origin</code> chẳng có gì đặc biệt — nó chỉ là cách <code>git clone</code> gọi cái nơi mà nó đã clone về.</p>

<pre><code>git remote -v</code></pre>
<div class="out">origin  git@github.com:cuonghoang1103/api-backend.git (fetch)
origin  git@github.com:cuonghoang1103/api-backend.git (push)</div>
<pre><code>git remote add upstream git@github.com:original/project.git   <span class="tok-comment"># thêm một cái nữa</span>
git remote rename origin github                                <span class="tok-comment"># đổi tên</span>
git remote remove upstream                                     <span class="tok-comment"># gỡ bỏ</span>
git remote show origin                                         <span class="tok-comment"># chi tiết đầy đủ: nhánh, theo dõi, ref cũ</span></code></pre>
<div class="callout ok">Một kho mã có bao nhiêu remote cũng được, và chúng không nhất thiết phải là GitHub. Một remote có thể là URL GitLab, một kho trần trên máy chủ của chính bạn, hay thậm chí một thư mục trên cùng cái đĩa — <code>git remote add nha /srv/repos/api.git</code> chạy được. Đó là ý nghĩa thực tế của chữ "phân tán".</div>

<h3>Ba loại nhánh</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">main</span><span class="lz-v">Một <strong>nhánh cục bộ</strong>. Của bạn. Bạn commit lên nó và nó dịch chuyển.</span></div>
  <div class="lz-layer"><span class="lz-k">origin/main</span><span class="lz-v">Một <strong>nhánh theo dõi remote</strong>. Bản ghi cục bộ của bạn về chỗ <code>main</code> đứng trên máy chủ ở lần cuối bạn nói chuyện với nó. Bạn không commit lên nó được; Git tự cập nhật nó.</span></div>
  <div class="lz-layer"><span class="lz-k">main trên máy chủ</span><span class="lz-v">Thứ thật, trên GitHub. Bạn không bao giờ nhìn thấy nó trực tiếp — chỉ thấy <code>origin/main</code>, thứ có thể đã cũ vài giờ.</span></div>
</div>
<div class="callout warn">Đây là nguồn gốc của phần lớn sự bối rối về remote. <code>origin/main</code> <strong>KHÔNG phải là bản trực tiếp</strong>. Nó là một ảnh chụp lưu tạm, chỉ đổi khi bạn chạy <code>fetch</code>, <code>pull</code> hay <code>push</code>. Nếu một đồng nghiệp vừa push năm phút trước, <code>origin/main</code> của bạn vẫn trỏ vào commit hôm qua cho tới khi bạn fetch — và <code>git log origin/main</code> sẽ tự tin cho bạn xem thông tin đã cũ.</div>

<h3>fetch — tải về, không đổi gì cả</h3>
<pre><code>git fetch origin</code></pre>
<div class="out">remote: Enumerating objects: 24, done.
From github.com:cuonghoang1103/api-backend
   7b3e9d1..5f7a9c2  main       -&gt; origin/main
 * [new branch]      feature/feed -&gt; origin/feature/feed</div>
<p>Các commit mới được tải về và các nhánh theo dõi remote dịch chuyển. Nhánh cục bộ, thư mục làm việc và index của bạn <strong>không bị đụng tới</strong>. Không gì hỏng được, không gì xung đột được, và không có việc gì bạn đang làm bị cắt ngang.</p>
<pre><code><span class="tok-comment"># Nghi thức soi xét an toàn, sau khi fetch:</span>
git log --oneline main..origin/main     <span class="tok-comment"># họ đã thêm gì?</span>
git diff main origin/main --stat        <span class="tok-comment"># nó to cỡ nào?</span>
git log --oneline origin/main..main     <span class="tok-comment"># tôi có gì mà họ chưa có?</span></code></pre>
<div class="callout ok"><code>git fetch</code> là lệnh mạng DUY NHẤT trong Git không thể gây ra vấn đề gì. Hãy chạy nó bất cứ khi nào bạn muốn biết chuyện gì đang diễn ra — trước khi bắt đầu làm việc, trước khi push, trước khi quyết định có rebase hay không. Có người còn đặt hẹn giờ chạy nó.</div>

<h3>pull — fetch, rồi tích hợp</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">git fetch</div><div class="lz-d">Tải về và dời origin/main. An toàn.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">git merge origin/main</div><div class="lz-d">Tích hợp vào nhánh của bạn. Có thể xung đột, có thể tạo commit hợp nhất, đổi thư mục làm việc của bạn.</div></div>
</div>
<p><code>git pull</code> chỉ có vậy: hai lệnh mang một cái tên. Nửa sau mới là phần có thể làm bạn bất ngờ — và vì thế bản hai bước đáng dùng mỗi khi bạn chưa chắc thứ gì đang chờ trên máy chủ.</p>
<pre><code>git pull                     <span class="tok-comment"># fetch + merge (mặc định)</span>
git pull --rebase            <span class="tok-comment"># fetch + rebase (bài 3.4)</span>
git pull --ff-only           <span class="tok-comment"># fetch + merge, nhưng TỪ CHỐI nếu không phải fast-forward</span></code></pre>
<div class="callout warn"><code>--ff-only</code> là thiết lập đáng nhận. Nếu nhánh của bạn và máy chủ cùng tiến lên, nó dừng lại và báo cho bạn, thay vì âm thầm tạo một commit hợp nhất bạn không hề yêu cầu. Bạn khi đó tự chọn <code>--rebase</code> hay một lần merge thật — một cách có chủ ý. <code>git config --global pull.ff only</code> đặt nó làm mặc định.</div>

<h3>Đọc trạng thái phân ly</h3>
<pre><code>git status</code></pre>
<div class="out">On branch main
Your branch and 'origin/main' have diverged,
and have 2 and 3 different commits each, respectively.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">"ahead 2"</span><span class="v">Bạn có 2 commit mà máy chủ chưa có. Hãy push chúng.</span></div>
  <div class="kv"><span class="k">"behind 3"</span><span class="v">Máy chủ có 3 cái bạn chưa có. Hãy pull chúng về.</span></div>
  <div class="kv"><span class="k">"diverged, 2 and 3"</span><span class="v">Cả hai. Bạn phải tích hợp trước khi push được — merge hay rebase, tuỳ bạn.</span></div>
  <div class="kv"><span class="k">"up to date"</span><span class="v">Chỉ tính tới lần fetch gần nhất của bạn. Hãy chạy <code>git fetch</code> trước khi tin nó.</span></div>
</div>
<pre><code>git branch -vv               <span class="tok-comment"># mọi nhánh cục bộ, upstream của nó, và ahead/behind</span></code></pre>
<div class="out">* main          5f7a9c2 [origin/main: ahead 2, behind 3] fix(auth): reject expired
  feature/login 3f8a1c9 [origin/feature/login] feat(auth): rotation
  experiment    9e2d4b7 no upstream — never pushed</div>

<h3>Dọn những nhánh đã bị xoá trên máy chủ</h3>
<pre><code>git fetch --prune            <span class="tok-comment"># xoá các ref origin/* mà nhánh đã biến mất khỏi máy chủ</span>
git config --global fetch.prune true    <span class="tok-comment"># làm việc đó ở mọi lần fetch</span></code></pre>
<p>Không prune thì <code>git branch -a</code> cứ liệt kê mãi <code>origin/feature/old-thing</code> cho những nhánh đã merge và xoá từ nhiều tháng trước. Bật một lần rồi quên nó đi.</p>

<h3>Lệnh clone, nhìn qua lăng kính này</h3>
<pre><code>git clone git@github.com:cuonghoang1103/api-backend.git</code></pre>
<p>Một lần clone là bốn thao tác: tạo một thư mục có <code>.git</code>, thêm một remote tên <code>origin</code>, fetch mọi thứ, và checkout nhánh mặc định với một nhánh cục bộ theo dõi <code>origin/main</code>. Từng thao tác một trong số đó đều là lệnh bạn đã biết.</p>
<pre><code>git clone --depth 1 &lt;url&gt;        <span class="tok-comment"># nông: chỉ commit mới nhất, không lịch sử (CI nhanh)</span>
git clone --branch v1.4.0 &lt;url&gt;  <span class="tok-comment"># bắt đầu ở một nhánh hoặc tag cụ thể</span>
git clone --bare &lt;url&gt;           <span class="tok-comment"># không có thư mục làm việc — đây là thứ một máy chủ giữ</span></code></pre>

<a class="link-card" href="https://git-scm.com/book/vi/v2/C%C4%83n-B%E1%BA%A3n-Git-L%C3%A0m-Vi%E1%BB%87c-V%E1%BB%9Bi-Remote" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 2.5 (tiếng Việt) — Làm việc với Remote</span><span class="lc-sub">remote add/rename/remove, và "nhánh theo dõi remote" nghĩa là gì.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-fetch" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">git-fetch — refspec, --prune, --all</span><span class="lc-sub">Mục refspec giải thích ánh xạ origin/* thật ra hoạt động thế nào.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tin vào <code>git log origin/main</code> mà chưa fetch. Nó đọc bộ nhớ đệm cục bộ, nên sau một tuần vắng mặt nó vui vẻ cho bạn xem bức tranh của một tuần trước mà không hề cảnh báo — và những quyết định dựa trên đó (có nên rebase không, bản vá của mình đã lên thượng nguồn chưa) sẽ sai. Hãy để <code>git fetch</code> làm lệnh đầu tiên của mọi phiên làm việc.</div>
<p class="note-ct"><strong>Phân biệt cần giữ lấy:</strong> <code>fetch</code> cập nhật <em>hiểu biết</em> của bạn; <code>merge</code>/<code>rebase</code> cập nhật <em>công việc</em> của bạn; <code>pull</code> làm cả hai trong một bước và giấu đi cái nào là cái nào. Khi có chuyện bất ngờ xảy ra sau một lần pull, hãy làm lại theo lối fetch-rồi-nhìn-rồi-tích-hợp, và cái bất ngờ thường tự nó giải thích.</p>
</div>
`,
    },

    /* ─────────────────────────── 5.2 ─────────────────────────── */
    {
      title: '5.2 — Authenticating with GitHub: SSH, tokens, credentials|||5.2 — Xác thực với GitHub: SSH, token, chứng chỉ',
      slug: 'git-5-2-xac-thuc',
      type: 'LESSON',
      description: 'Vì sao mật khẩu GitHub không còn dùng được cho Git, SSH vs HTTPS + PAT, phạm vi và hạn dùng của token, credential helper trên ba hệ điều hành, nhiều tài khoản trên một máy, và deploy key.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Your GitHub password does not work here</h2>
<p class="lead">GitHub removed password authentication for Git operations in 2021. Every push and every private-repository fetch now uses either an <strong>SSH key</strong> or a <strong>personal access token</strong>. Knowing which one you are using — and where it is stored — turns most "authentication failed" messages into a ten-second fix.</p>

<h3>SSH vs HTTPS</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SSH — git@github.com:user/repo.git</span><span class="v">A key pair. Set up once (0.3), no expiry, nothing to paste. Blocked on some corporate networks that only allow port 443.</span></div>
  <div class="kv"><span class="k">HTTPS — https://github.com/user/repo.git</span><span class="v">A personal access token used as the password. Works through any firewall and proxy. Tokens expire, so you re-issue them periodically.</span></div>
</div>
<p>Both are equally secure. Choose SSH for your own machine and HTTPS where SSH is blocked. Check which a repository uses, and switch without re-cloning:</p>
<pre><code>git remote -v</code></pre>
<div class="out">origin  https://github.com/cuonghoang1103/api-backend.git (fetch)</div>
<pre><code>git remote set-url origin git@github.com:cuonghoang1103/api-backend.git</code></pre>

<h3>Personal access tokens</h3>
<p>GitHub offers two kinds. Prefer the newer one:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Fine-grained (recommended)</span><span class="lz-v">Scoped to <strong>specific repositories</strong> with per-permission control (Contents: read/write, Pull requests: read). A leak exposes only what you granted.</span></div>
  <div class="lz-layer"><span class="lz-k">Classic</span><span class="lz-v">Broad scopes such as <code>repo</code>, applying to <em>every</em> repository you can reach. Simpler, and far more dangerous if it leaks.</span></div>
</div>
<p>For pushing code you need <strong>Contents: Read and write</strong> on the repositories in question, and nothing else. Add <strong>Workflows: Read and write</strong> only if your commits change files under <code>.github/workflows/</code> — without it, GitHub rejects the push with a message about workflow scope.</p>
<pre><code>git push origin main</code></pre>
<div class="out">Username for 'https://github.com': cuonghoang1103
Password for 'https://cuonghoang1103@github.com': &lt;paste the TOKEN, not your password&gt;</div>
<div class="callout danger">A token is a password with your permissions attached. Never commit one, never paste one into a chat or an issue, and never put one in a URL like <code>https://user:token@github.com/…</code> — that form lands in <code>.git/config</code> in plain text and in your shell history. Use a credential helper instead, below.</div>

<h3>Credential helpers — stop retyping</h3>
<pre><code><span class="tok-comment"># macOS — stores in the system Keychain, encrypted</span>
git config --global credential.helper osxkeychain

<span class="tok-comment"># Windows — Git Credential Manager, ships with Git for Windows</span>
git config --global credential.helper manager

<span class="tok-comment"># Linux — libsecret (GNOME Keyring / KWallet), encrypted</span>
git config --global credential.helper libsecret

<span class="tok-comment"># Anywhere, as a fallback: cache in memory for one hour</span>
git config --global credential.helper <span class="tok-string">'cache --timeout=3600'</span></code></pre>
<div class="callout warn">Avoid <code>credential.helper store</code>. Despite the reassuring name it writes your token to <code>~/.git-credentials</code> in <strong>plain text</strong>, readable by anything running as you. Use the OS keychain where one exists, and the in-memory cache where one does not.</div>
<pre><code><span class="tok-comment"># Wrong token saved? Remove it and Git will ask again:</span>
git credential reject &lt;&lt;&lt; <span class="tok-string">'protocol=https
host=github.com'</span></code></pre>

<h3>Debugging authentication</h3>
<pre><code>ssh -T git@github.com          <span class="tok-comment"># is SSH working at all?</span>
ssh -vT git@github.com         <span class="tok-comment"># verbose: WHICH key is being offered</span></code></pre>
<div class="out">Hi cuonghoang1103! You've successfully authenticated, but GitHub does not provide shell access.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Permission denied (publickey)</span><span class="v">The key is not loaded or not on GitHub. <code>ssh-add -l</code> to list loaded keys, then re-add with <code>ssh-add ~/.ssh/id_ed25519</code>.</span></div>
  <div class="kv"><span class="k">remote: Invalid username or password</span><span class="v">Over HTTPS: you typed your account password instead of a token, or the token expired.</span></div>
  <div class="kv"><span class="k">403 Forbidden on push</span><span class="v">You authenticated fine, but the token lacks Contents: write, or you lack push rights on that repository.</span></div>
  <div class="kv"><span class="k">refusing to allow … workflow scope</span><span class="v">Your commits touch <code>.github/workflows/</code> and the token has no Workflows permission.</span></div>
</div>

<h3>Two GitHub accounts on one machine</h3>
<p>A personal account and a work account cannot both use the same default SSH key. Give each an alias in <code>~/.ssh/config</code>:</p>
<pre><code>Host github-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal
  IdentitiesOnly yes

Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
  IdentitiesOnly yes</code></pre>
<pre><code><span class="tok-comment"># Then use the alias in place of the hostname:</span>
git clone git@github-work:company/api.git
git remote set-url origin git@github-personal:cuonghoang1103/api-backend.git</code></pre>
<p>Pair it with the per-repository identity from 0.3 so your commits carry the right email too:</p>
<pre><code>cd ~/work/api &amp;&amp; git config user.email an@company.com</code></pre>
<div class="callout ok"><code>IdentitiesOnly yes</code> matters more than it looks. Without it, SSH offers every key in your agent in turn, and GitHub authenticates you as whichever account matches <em>first</em> — so you silently push to the work repository as your personal account. The flag forces exactly the key you named.</div>

<h3>Deploy keys and CI tokens</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Deploy key</span><span class="v">An SSH key granting access to <strong>one repository</strong>, read-only by default. The right choice for a server that only needs to pull.</span></div>
  <div class="kv"><span class="k">GITHUB_TOKEN</span><span class="v">Minted automatically for each GitHub Actions run, scoped to that repository, expires when the job ends. Prefer it over a stored PAT in workflows.</span></div>
  <div class="kv"><span class="k">Machine user</span><span class="v">A separate GitHub account for automation when a deploy key is not enough (multi-repository access).</span></div>
</div>
<div class="callout warn">Never put your personal token on a server or in CI. If the server is compromised, the attacker has your access to <em>every</em> repository you can reach, and the audit log shows your name. A deploy key limits the blast radius to one repository and one direction.</div>

<a class="link-card" href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Managing personal access tokens</span><span class="lc-sub">Fine-grained vs classic, permission tables, expiry.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/gitcredentials" target="_blank" rel="noopener">
  <span class="lc-ico">🗝️</span>
  <span class="lc-body"><span class="lc-title">gitcredentials — how helpers are chosen and queried</span><span class="lc-sub">Also documents <code>git credential reject</code> for clearing a bad entry.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> embedding a token in the remote URL to "make it work" — <code>git remote set-url origin https://ghp_xxx@github.com/user/repo.git</code>. It does work, and it writes the token in clear text into <code>.git/config</code>, into your shell history, and into any log that echoes the remote. Worse, <code>git remote -v</code> prints it, so it ends up pasted into bug reports. Use a credential helper; it exists precisely to avoid this.</div>
<p class="note-ct"><strong>A useful habit:</strong> give every token an expiry (90 days is a reasonable default) and a name that says where it lives — "laptop-an", "vps-deploy", "ci-staging". When one leaks or a machine is retired, you know exactly which to revoke, and revoking it breaks exactly one thing.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Mật khẩu GitHub của bạn không dùng được ở đây</h2>
<p class="lead">GitHub đã bỏ xác thực bằng mật khẩu cho các thao tác Git từ năm 2021. Mọi lần push và mọi lần fetch kho riêng tư giờ đều dùng hoặc một <strong>khoá SSH</strong>, hoặc một <strong>personal access token</strong>. Biết mình đang dùng cái nào — và nó được lưu ở đâu — biến phần lớn thông báo "authentication failed" thành một cú sửa mười giây.</p>

<h3>SSH vs HTTPS</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SSH — git@github.com:user/repo.git</span><span class="v">Một cặp khoá. Cài một lần (bài 0.3), không hết hạn, không phải dán gì. Bị chặn trên vài mạng công ty vốn chỉ cho cổng 443.</span></div>
  <div class="kv"><span class="k">HTTPS — https://github.com/user/repo.git</span><span class="v">Một personal access token dùng làm mật khẩu. Chạy được qua mọi tường lửa và proxy. Token hết hạn, nên thỉnh thoảng phải cấp lại.</span></div>
</div>
<p>Cả hai đều an toàn như nhau. Hãy chọn SSH cho máy của bạn và HTTPS ở nơi SSH bị chặn. Kiểm xem một kho đang dùng cái nào, và đổi mà không cần clone lại:</p>
<pre><code>git remote -v</code></pre>
<div class="out">origin  https://github.com/cuonghoang1103/api-backend.git (fetch)</div>
<pre><code>git remote set-url origin git@github.com:cuonghoang1103/api-backend.git</code></pre>

<h3>Personal access token</h3>
<p>GitHub cấp hai loại. Hãy ưu tiên loại mới hơn:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Fine-grained (khuyến nghị)</span><span class="lz-v">Giới hạn vào <strong>những kho cụ thể</strong> với quyền chi tiết từng mục (Contents: đọc/ghi, Pull requests: đọc). Lộ ra thì chỉ phơi đúng phần bạn đã cấp.</span></div>
  <div class="lz-layer"><span class="lz-k">Classic</span><span class="lz-v">Các phạm vi rộng như <code>repo</code>, áp cho <em>MỌI</em> kho bạn với tới được. Đơn giản hơn, và nguy hiểm hơn nhiều nếu lộ.</span></div>
</div>
<p>Để push mã bạn cần <strong>Contents: Read and write</strong> trên các kho liên quan, và không cần gì thêm. Chỉ thêm <strong>Workflows: Read and write</strong> nếu commit của bạn đụng vào file dưới <code>.github/workflows/</code> — thiếu nó, GitHub từ chối push kèm thông báo về phạm vi workflow.</p>
<pre><code>git push origin main</code></pre>
<div class="out">Username for 'https://github.com': cuonghoang1103
Password for 'https://cuonghoang1103@github.com': &lt;dán TOKEN, không phải mật khẩu&gt;</div>
<div class="callout danger">Một token là một mật khẩu kèm sẵn quyền của bạn. Đừng bao giờ commit nó, đừng dán nó vào chat hay issue, và đừng đặt nó trong URL kiểu <code>https://user:token@github.com/…</code> — dạng đó rơi vào <code>.git/config</code> dưới dạng chữ thô và vào lịch sử shell của bạn. Hãy dùng credential helper, ngay dưới đây.</div>

<h3>Credential helper — thôi gõ đi gõ lại</h3>
<pre><code><span class="tok-comment"># macOS — lưu vào Keychain của hệ thống, có mã hoá</span>
git config --global credential.helper osxkeychain

<span class="tok-comment"># Windows — Git Credential Manager, đi kèm Git for Windows</span>
git config --global credential.helper manager

<span class="tok-comment"># Linux — libsecret (GNOME Keyring / KWallet), có mã hoá</span>
git config --global credential.helper libsecret

<span class="tok-comment"># Ở đâu cũng được, làm phương án lùi: giữ trong bộ nhớ một giờ</span>
git config --global credential.helper <span class="tok-string">'cache --timeout=3600'</span></code></pre>
<div class="callout warn">Hãy tránh <code>credential.helper store</code>. Bất chấp cái tên nghe yên tâm, nó ghi token của bạn vào <code>~/.git-credentials</code> dưới dạng <strong>chữ thô</strong>, mọi thứ chạy dưới danh nghĩa bạn đều đọc được. Hãy dùng keychain của hệ điều hành ở nơi có, và bộ nhớ tạm ở nơi không có.</div>
<pre><code><span class="tok-comment"># Lưu nhầm token? Gỡ nó ra và Git sẽ hỏi lại:</span>
git credential reject &lt;&lt;&lt; <span class="tok-string">'protocol=https
host=github.com'</span></code></pre>

<h3>Gỡ rối xác thực</h3>
<pre><code>ssh -T git@github.com          <span class="tok-comment"># SSH có chạy được không?</span>
ssh -vT git@github.com         <span class="tok-comment"># chi tiết: khoá NÀO đang được đưa ra</span></code></pre>
<div class="out">Hi cuonghoang1103! You've successfully authenticated, but GitHub does not provide shell access.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Permission denied (publickey)</span><span class="v">Khoá chưa được nạp hoặc chưa có trên GitHub. <code>ssh-add -l</code> để liệt kê khoá đã nạp, rồi nạp lại bằng <code>ssh-add ~/.ssh/id_ed25519</code>.</span></div>
  <div class="kv"><span class="k">remote: Invalid username or password</span><span class="v">Qua HTTPS: bạn gõ mật khẩu tài khoản thay vì token, hoặc token đã hết hạn.</span></div>
  <div class="kv"><span class="k">403 Forbidden khi push</span><span class="v">Bạn xác thực ổn, nhưng token thiếu Contents: write, hoặc bạn không có quyền push vào kho đó.</span></div>
  <div class="kv"><span class="k">refusing to allow … workflow scope</span><span class="v">Commit của bạn chạm vào <code>.github/workflows/</code> và token không có quyền Workflows.</span></div>
</div>

<h3>Hai tài khoản GitHub trên một máy</h3>
<p>Một tài khoản cá nhân và một tài khoản công ty không thể cùng dùng một khoá SSH mặc định. Hãy cho mỗi cái một bí danh trong <code>~/.ssh/config</code>:</p>
<pre><code>Host github-personal
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_personal
  IdentitiesOnly yes

Host github-work
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_work
  IdentitiesOnly yes</code></pre>
<pre><code><span class="tok-comment"># Rồi dùng bí danh thay cho tên máy chủ:</span>
git clone git@github-work:company/api.git
git remote set-url origin git@github-personal:cuonghoang1103/api-backend.git</code></pre>
<p>Hãy ghép nó với danh tính theo từng kho ở bài 0.3 để commit của bạn cũng mang đúng email:</p>
<pre><code>cd ~/work/api &amp;&amp; git config user.email an@company.com</code></pre>
<div class="callout ok"><code>IdentitiesOnly yes</code> quan trọng hơn vẻ ngoài của nó. Thiếu nó, SSH lần lượt đưa ra mọi khoá trong agent, và GitHub xác thực bạn dưới danh nghĩa tài khoản nào khớp <em>ĐẦU TIÊN</em> — nên bạn âm thầm push vào kho công ty dưới tài khoản cá nhân. Cái cờ ép dùng đúng khoá bạn đã chỉ định.</div>

<h3>Deploy key và token cho CI</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Deploy key</span><span class="v">Một khoá SSH cấp quyền vào <strong>một kho duy nhất</strong>, mặc định chỉ đọc. Lựa chọn đúng cho một máy chủ chỉ cần pull.</span></div>
  <div class="kv"><span class="k">GITHUB_TOKEN</span><span class="v">Được đúc tự động cho mỗi lượt chạy GitHub Actions, giới hạn trong kho đó, hết hạn khi job kết thúc. Hãy ưu tiên nó hơn một PAT lưu sẵn trong workflow.</span></div>
  <div class="kv"><span class="k">Tài khoản máy</span><span class="v">Một tài khoản GitHub riêng cho việc tự động hoá, khi deploy key không đủ (cần truy cập nhiều kho).</span></div>
</div>
<div class="callout warn">Đừng bao giờ đặt token cá nhân của bạn lên máy chủ hay trong CI. Nếu máy chủ bị chiếm, kẻ tấn công có quyền truy cập của bạn vào <em>MỌI</em> kho bạn với tới được, và nhật ký kiểm toán ghi tên bạn. Một deploy key giới hạn bán kính vụ nổ trong một kho và một chiều.</div>

<a class="link-card" href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Quản lý personal access token</span><span class="lc-sub">Fine-grained vs classic, bảng quyền, hạn dùng.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/gitcredentials" target="_blank" rel="noopener">
  <span class="lc-ico">🗝️</span>
  <span class="lc-body"><span class="lc-title">gitcredentials — helper được chọn và hỏi thế nào</span><span class="lc-sub">Cũng ghi lại <code>git credential reject</code> để xoá một mục sai.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> nhét token vào URL remote cho "chạy được" — <code>git remote set-url origin https://ghp_xxx@github.com/user/repo.git</code>. Nó chạy thật, và nó ghi token dưới dạng chữ thô vào <code>.git/config</code>, vào lịch sử shell của bạn, và vào mọi bản log có in ra cái remote. Tệ hơn, <code>git remote -v</code> in nó ra, nên nó rốt cuộc bị dán vào các báo cáo lỗi. Hãy dùng credential helper; nó sinh ra chính là để tránh chuyện này.</div>
<p class="note-ct"><strong>Một thói quen hữu ích:</strong> cho mọi token một hạn dùng (90 ngày là mặc định hợp lý) và một cái tên nói rõ nó sống ở đâu — "laptop-an", "vps-deploy", "ci-staging". Khi một cái bị lộ hay một cái máy bị thanh lý, bạn biết chính xác phải thu hồi cái nào, và thu hồi nó chỉ làm hỏng đúng một thứ.</p>
</div>
`,
    },

    /* ─────────────────────────── 5.3 ─────────────────────────── */
    {
      title: '5.3 — Pushing: tracking branches, tags, and deletions|||5.3 — Push: nhánh theo dõi, tag, và xoá',
      slug: 'git-5-3-push',
      type: 'LESSON',
      description: 'push -u làm gì thật ra, đọc mọi thông báo từ chối của push, đẩy và xoá nhánh remote, đẩy tag (chúng KHÔNG tự đi theo), và những nhánh mà bạn nên cấm push thẳng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.3</span>
<h2>Sending commits the other way</h2>
<p class="lead"><code>git push</code> is <code>fetch</code> in reverse: it uploads commits the remote does not have and asks it to move a branch pointer. The remote is allowed to refuse, and almost every push problem is one of three refusals — each with a different correct response.</p>

<pre><code>git push origin main</code></pre>
<div class="out">Enumerating objects: 12, done.
Writing objects: 100% (7/7), 1.24 KiB | 1.24 MiB/s, done.
To github.com:cuonghoang1103/api-backend.git
   7b3e9d1..5f7a9c2  main -&gt; main</div>
<p>Read the last line as "on the remote, <code>main</code> moved from <code>7b3e9d1</code> to <code>5f7a9c2</code>". That is literally all a push does: transfer objects, then move a ref.</p>

<h3>-u, and what "upstream" means</h3>
<pre><code>git push -u origin feature/login</code></pre>
<div class="out">To github.com:cuonghoang1103/api-backend.git
 * [new branch]      feature/login -&gt; feature/login
branch 'feature/login' set up to track 'origin/feature/login'.</div>
<p><code>-u</code> (<code>--set-upstream</code>) records a link between your local branch and the remote one. Once set, four things start working with no arguments:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">git push</span><span class="v">Knows where to send it.</span></div>
  <div class="kv"><span class="k">git pull</span><span class="v">Knows where to get it from.</span></div>
  <div class="kv"><span class="k">git status</span><span class="v">Can say "ahead 2, behind 3".</span></div>
  <div class="kv"><span class="k">@{u}</span><span class="v">A shorthand for the upstream branch: <code>git log @{u}..HEAD</code> = "what have I not pushed?"</span></div>
</div>
<pre><code>git branch -vv                                   <span class="tok-comment"># which branches have an upstream</span>
git branch --set-upstream-to=origin/main main    <span class="tok-comment"># set it after the fact</span>
git config --global push.autoSetupRemote true    <span class="tok-comment"># do -u automatically on first push</span></code></pre>
<div class="callout ok">That last setting removes the most common daily papercut: pushing a new branch and being told "fatal: The current branch has no upstream branch". With <code>push.autoSetupRemote</code> on, the first <code>git push</code> creates the remote branch and the link in one go.</div>

<h3>The three refusals, and what each one means</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">! [rejected] … (fetch first)</span><span class="lz-v">The remote has commits you do not. Someone pushed while you were working. <strong>Pull (or fetch + rebase), then push.</strong> Never force.</span></div>
  <div class="lz-layer"><span class="lz-k">! [rejected] … (non-fast-forward)</span><span class="lz-v">Your history diverged — usually you rewrote commits the remote still has. Fix with <code>--force-with-lease</code>, <em>only</em> if that branch is yours (8.3).</span></div>
  <div class="lz-layer"><span class="lz-k">! [remote rejected] … (protected branch)</span><span class="lz-v">A branch protection rule refused it. Push to a branch and open a pull request instead — the rule is doing its job (6.5).</span></div>
</div>
<pre><code>git push</code></pre>
<div class="out">! [rejected]        main -&gt; main (fetch first)
error: failed to push some refs to 'github.com:cuonghoang1103/api-backend.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref.</div>
<pre><code>git pull --rebase &amp;&amp; git push          <span class="tok-comment"># the correct response, nine times in ten</span></code></pre>
<div class="callout danger">The wrong response is <code>git push --force</code>. It tells the server "discard whatever you have and take mine" — and whatever it had was your colleague's commits, which are now gone from the server. If they have them locally they can restore them; if the only copy was on the server, that work is destroyed. Chapter 8.3 covers <code>--force-with-lease</code>, which refuses in exactly this situation.</div>

<h3>Pushing to a different name, and deleting</h3>
<pre><code>git push origin feature/login                    <span class="tok-comment"># same name on both sides</span>
git push origin feature/login:review/login       <span class="tok-comment"># local:remote — different names</span>
git push origin --delete feature/login           <span class="tok-comment"># delete the REMOTE branch</span>
git push origin :feature/login                   <span class="tok-comment"># the old spelling of the same thing</span></code></pre>
<p>The old form reads as "push nothing into <code>feature/login</code>", which is why an empty left-hand side deletes. Use <code>--delete</code>; it says what it means.</p>
<pre><code><span class="tok-comment"># After a pull request is merged, clean up both sides:</span>
git push origin --delete feature/login    <span class="tok-comment"># remote (or use the button on GitHub)</span>
git branch -d feature/login               <span class="tok-comment"># local</span>
git fetch --prune                         <span class="tok-comment"># drop the stale origin/feature/login ref</span></code></pre>

<h3>Tags do not travel with commits</h3>
<pre><code>git tag -a v1.5.0 -m <span class="tok-string">"Release 1.5.0"</span>
git push origin main</code></pre>
<div class="out">   7b3e9d1..5f7a9c2  main -&gt; main</div>
<p>The commit went; the tag did not. Tags are refs of their own and must be pushed explicitly — a fact that has delayed many releases by exactly one confused hour, because the CI that triggers on tags never fired.</p>
<pre><code>git push origin v1.5.0            <span class="tok-comment"># one tag</span>
git push origin --tags            <span class="tok-comment"># every local tag</span>
git push --follow-tags            <span class="tok-comment"># push commits + the ANNOTATED tags that point into them</span>
git push origin --delete v1.5.0   <span class="tok-comment"># delete a tag from the remote</span></code></pre>
<div class="callout ok"><code>--follow-tags</code> is the sane default for a release workflow: it pushes annotated tags reachable from what you are pushing, and ignores stray local tags. Chapter 7.3 covers tags and semantic versioning properly.</div>

<h3>Pushing everything, and what not to do</h3>
<pre><code>git push origin --all             <span class="tok-comment"># every local branch — rarely what you want</span>
git push --dry-run origin main    <span class="tok-comment"># show what WOULD be pushed, transfer nothing</span></code></pre>
<div class="callout warn"><code>--all</code> uploads every local branch, including <code>wip/</code>, <code>experiment-2</code> and the one with a debug password in it. On a shared repository that is noise at best. Push branches by name.</div>

<h3>What to check before every push</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">What am I sending?</div><div class="lz-d"><code>git log --oneline @{u}..HEAD</code> — read the subject lines. Any "wip" left in there?</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Is there anything I should not send?</div><div class="lz-d"><code>git diff @{u}..HEAD --stat</code> — an unexpected file is a secret or a build artefact.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Does it still work?</div><div class="lz-d">Run the tests. CI will tell you in four minutes; your own machine tells you in ten seconds.</div></div>
</div>

<a class="link-card" href="https://git-scm.com/docs/git-push" target="_blank" rel="noopener">
  <span class="lc-ico">⬆️</span>
  <span class="lc-body"><span class="lc-title">git-push — refspecs, --delete, --follow-tags, --dry-run</span><span class="lc-sub">The refspec section explains the <code>local:remote</code> colon syntax.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: handle all three push rejections correctly</span><span class="lc-sub">Graded scenarios, including one where forcing would destroy work.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> reading "! [rejected] (fetch first)" as an error to overcome rather than information. It is Git protecting a colleague's commits — the remote is saying "I have work you have not seen". Forcing past it deletes that work from the server. The correct response is always to integrate first: <code>git pull --rebase</code>, resolve anything that conflicts, run the tests, then push.</div>
<p class="note-ct"><strong>A small habit with a large payoff:</strong> before pushing, run <code>git log --oneline @{u}..HEAD</code>. It takes a second and it is the last moment where a "wip" commit, a debug line, or a stray <code>.env</code> costs nothing to fix. After the push it is on the server, in CI logs, and possibly in a colleague's clone.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.3</span>
<h2>Gửi commit đi theo chiều ngược lại</h2>
<p class="lead"><code>git push</code> là <code>fetch</code> đảo chiều: nó tải lên những commit remote chưa có và yêu cầu remote dời một con trỏ nhánh. Remote có quyền từ chối, và gần như mọi vấn đề khi push đều là một trong ba lời từ chối — mỗi lời có một cách đáp đúng khác nhau.</p>

<pre><code>git push origin main</code></pre>
<div class="out">Enumerating objects: 12, done.
Writing objects: 100% (7/7), 1.24 KiB | 1.24 MiB/s, done.
To github.com:cuonghoang1103/api-backend.git
   7b3e9d1..5f7a9c2  main -&gt; main</div>
<p>Hãy đọc dòng cuối là "trên remote, <code>main</code> đã dời từ <code>7b3e9d1</code> tới <code>5f7a9c2</code>". Một lần push chỉ có đúng vậy: chuyển các đối tượng, rồi dời một ref.</p>

<h3>-u, và "upstream" nghĩa là gì</h3>
<pre><code>git push -u origin feature/login</code></pre>
<div class="out">To github.com:cuonghoang1103/api-backend.git
 * [new branch]      feature/login -&gt; feature/login
branch 'feature/login' set up to track 'origin/feature/login'.</div>
<p><code>-u</code> (<code>--set-upstream</code>) ghi lại một liên kết giữa nhánh cục bộ của bạn và nhánh trên remote. Đặt rồi thì bốn thứ bắt đầu chạy mà không cần tham số:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">git push</span><span class="v">Biết phải gửi đi đâu.</span></div>
  <div class="kv"><span class="k">git pull</span><span class="v">Biết phải lấy về từ đâu.</span></div>
  <div class="kv"><span class="k">git status</span><span class="v">Nói được "ahead 2, behind 3".</span></div>
  <div class="kv"><span class="k">@{u}</span><span class="v">Cách viết tắt cho nhánh upstream: <code>git log @{u}..HEAD</code> = "tôi chưa push cái gì?"</span></div>
</div>
<pre><code>git branch -vv                                   <span class="tok-comment"># nhánh nào đã có upstream</span>
git branch --set-upstream-to=origin/main main    <span class="tok-comment"># đặt sau khi đã lỡ</span>
git config --global push.autoSetupRemote true    <span class="tok-comment"># tự làm -u ở lần push đầu</span></code></pre>
<div class="callout ok">Thiết lập cuối cùng đó gỡ đi vết xước hằng ngày phổ biến nhất: push một nhánh mới rồi bị báo "fatal: The current branch has no upstream branch". Bật <code>push.autoSetupRemote</code> thì lần <code>git push</code> đầu tiên tạo luôn nhánh trên remote và liên kết, một phát.</div>

<h3>Ba lời từ chối, và mỗi lời nghĩa là gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">! [rejected] … (fetch first)</span><span class="lz-v">Remote có commit bạn chưa có. Ai đó đã push trong lúc bạn làm việc. <strong>Hãy pull (hoặc fetch + rebase), rồi push.</strong> Đừng bao giờ ép.</span></div>
  <div class="lz-layer"><span class="lz-k">! [rejected] … (non-fast-forward)</span><span class="lz-v">Lịch sử của bạn đã phân ly — thường là bạn đã viết lại những commit mà remote vẫn còn giữ. Sửa bằng <code>--force-with-lease</code>, <em>chỉ khi</em> nhánh đó là của bạn (bài 8.3).</span></div>
  <div class="lz-layer"><span class="lz-k">! [remote rejected] … (protected branch)</span><span class="lz-v">Một luật bảo vệ nhánh đã từ chối. Hãy push lên một nhánh rồi mở pull request — cái luật đang làm đúng việc của nó (bài 6.5).</span></div>
</div>
<pre><code>git push</code></pre>
<div class="out">! [rejected]        main -&gt; main (fetch first)
error: failed to push some refs to 'github.com:cuonghoang1103/api-backend.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref.</div>
<pre><code>git pull --rebase &amp;&amp; git push          <span class="tok-comment"># cách đáp đúng, chín trên mười lần</span></code></pre>
<div class="callout danger">Cách đáp SAI là <code>git push --force</code>. Nó nói với máy chủ "vứt đi cái ngươi đang có và nhận cái của ta" — và cái nó đang có là commit của đồng nghiệp bạn, giờ đã biến mất khỏi máy chủ. Nếu họ còn bản cục bộ thì khôi phục được; nếu bản duy nhất nằm trên máy chủ thì phần việc đó bị huỷ. Bài 8.3 nói về <code>--force-with-lease</code>, thứ sẽ từ chối đúng trong tình huống này.</div>

<h3>Push sang một tên khác, và xoá</h3>
<pre><code>git push origin feature/login                    <span class="tok-comment"># cùng tên ở hai phía</span>
git push origin feature/login:review/login       <span class="tok-comment"># cục bộ:remote — tên khác nhau</span>
git push origin --delete feature/login           <span class="tok-comment"># xoá nhánh TRÊN REMOTE</span>
git push origin :feature/login                   <span class="tok-comment"># cách viết cũ của cùng việc đó</span></code></pre>
<p>Dạng cũ đọc lên là "đẩy KHÔNG GÌ CẢ vào <code>feature/login</code>", và đó là lý do vế trái để trống thì xoá. Hãy dùng <code>--delete</code>; nó nói đúng điều nó làm.</p>
<pre><code><span class="tok-comment"># Sau khi một pull request được merge, hãy dọn cả hai phía:</span>
git push origin --delete feature/login    <span class="tok-comment"># remote (hoặc bấm nút trên GitHub)</span>
git branch -d feature/login               <span class="tok-comment"># cục bộ</span>
git fetch --prune                         <span class="tok-comment"># bỏ ref origin/feature/login đã cũ</span></code></pre>

<h3>Tag KHÔNG đi theo commit</h3>
<pre><code>git tag -a v1.5.0 -m <span class="tok-string">"Release 1.5.0"</span>
git push origin main</code></pre>
<div class="out">   7b3e9d1..5f7a9c2  main -&gt; main</div>
<p>Commit đã đi; cái tag thì không. Tag là ref riêng và phải được push một cách tường minh — một sự thật đã làm chậm nhiều bản phát hành đúng một giờ đồng hồ bối rối, vì cái CI vốn kích hoạt theo tag chẳng bao giờ chạy.</p>
<pre><code>git push origin v1.5.0            <span class="tok-comment"># một tag</span>
git push origin --tags            <span class="tok-comment"># mọi tag cục bộ</span>
git push --follow-tags            <span class="tok-comment"># push commit + những tag CÓ CHÚ THÍCH trỏ vào chúng</span>
git push origin --delete v1.5.0   <span class="tok-comment"># xoá một tag khỏi remote</span></code></pre>
<div class="callout ok"><code>--follow-tags</code> là mặc định hợp lý cho quy trình phát hành: nó push những tag có chú thích với tới được từ thứ bạn đang push, và bỏ qua các tag cục bộ lạc lõng. Bài 7.3 nói tử tế về tag và đánh phiên bản ngữ nghĩa.</div>

<h3>Push mọi thứ, và những thứ không nên làm</h3>
<pre><code>git push origin --all             <span class="tok-comment"># mọi nhánh cục bộ — hiếm khi là thứ bạn muốn</span>
git push --dry-run origin main    <span class="tok-comment"># cho xem thứ SẼ được push, không truyền gì cả</span></code></pre>
<div class="callout warn"><code>--all</code> tải lên mọi nhánh cục bộ, kể cả <code>wip/</code>, <code>experiment-2</code> và cái nhánh có mật khẩu debug trong đó. Trên một kho dùng chung thì nhẹ nhất cũng là tiếng ồn. Hãy push nhánh theo tên.</div>

<h3>Kiểm gì trước mỗi lần push</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Tôi đang gửi gì?</div><div class="lz-d"><code>git log --oneline @{u}..HEAD</code> — đọc các dòng tiêu đề. Còn sót "wip" nào không?</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Có gì tôi không nên gửi không?</div><div class="lz-d"><code>git diff @{u}..HEAD --stat</code> — một file lạ là một bí mật hoặc một sản phẩm build.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Nó còn chạy không?</div><div class="lz-d">Chạy test. CI sẽ báo bạn sau bốn phút; máy của bạn báo sau mười giây.</div></div>
</div>

<a class="link-card" href="https://git-scm.com/docs/git-push" target="_blank" rel="noopener">
  <span class="lc-ico">⬆️</span>
  <span class="lc-body"><span class="lc-title">git-push — refspec, --delete, --follow-tags, --dry-run</span><span class="lc-sub">Mục refspec giải thích cú pháp dấu hai chấm <code>cục-bộ:remote</code>.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: xử lý đúng cả ba lời từ chối khi push</span><span class="lc-sub">Kịch bản chấm điểm, có một ca mà ép push sẽ huỷ mất công việc.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đọc "! [rejected] (fetch first)" như một lỗi cần vượt qua thay vì như một thông tin. Đó là Git đang bảo vệ commit của đồng nghiệp — remote đang nói "tôi có phần việc anh chưa nhìn thấy". Ép qua nó là xoá phần việc đó khỏi máy chủ. Cách đáp đúng lúc nào cũng là tích hợp trước: <code>git pull --rebase</code>, giải những gì xung đột, chạy test, rồi mới push.</div>
<p class="note-ct"><strong>Một thói quen nhỏ mà lời to:</strong> trước khi push, chạy <code>git log --oneline @{u}..HEAD</code>. Nó tốn một giây và là khoảnh khắc cuối cùng mà một commit "wip", một dòng debug, hay một file <code>.env</code> lạc lối còn sửa được với giá bằng không. Sau lần push thì nó đã ở trên máy chủ, trong log của CI, và có thể trong bản clone của một đồng nghiệp.</p>
</div>
`,
    },

    /* ─────────────────────────── 5.4 ─────────────────────────── */
    {
      title: '5.4 — Forks and upstream: contributing to someone else\'s project|||5.4 — Fork và upstream: đóng góp cho dự án của người khác',
      slug: 'git-5-4-fork-upstream',
      type: 'LESSON',
      description: 'Fork là gì ở phía máy chủ, hai remote origin/upstream, quy trình đóng góp mã nguồn mở đầy đủ, giữ fork đồng bộ, và những sai lầm khiến pull request của bạn không review được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.4</span>
<h2>How you contribute to a repository you cannot push to</h2>
<p class="lead">You want to fix a bug in an open-source project. You have no write access, so <code>git push</code> is refused. The answer is a <strong>fork</strong>: GitHub makes you a server-side copy that you <em>do</em> own, you push there, and then you ask the original project to pull your change back.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Fork on GitHub</div><div class="lz-d">A full server-side copy under your account. One button.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Clone YOUR fork</div><div class="lz-d">It becomes <code>origin</code> — the remote you can push to.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Add the original as upstream</div><div class="lz-d">A second remote you fetch from but never push to.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Branch, commit, push to origin</div><div class="lz-d">Your fork gets the branch.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Open a pull request</div><div class="lz-d">From your fork's branch into the original project's main.</div></div>
</div>

<h3>Setting it up</h3>
<pre><code><span class="tok-comment"># After clicking Fork on GitHub:</span>
git clone git@github.com:cuonghoang1103/some-project.git
cd some-project
git remote add upstream https://github.com/original-owner/some-project.git
git remote -v</code></pre>
<div class="out">origin    git@github.com:cuonghoang1103/some-project.git (fetch)
origin    git@github.com:cuonghoang1103/some-project.git (push)
upstream  https://github.com/original-owner/some-project.git (fetch)
upstream  https://github.com/original-owner/some-project.git (push)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">origin</span><span class="v">Your fork. You push here. SSH, because you authenticate to it.</span></div>
  <div class="kv"><span class="k">upstream</span><span class="v">The original project. You only ever fetch. HTTPS is fine — you have no credentials for it anyway.</span></div>
</div>
<pre><code><span class="tok-comment"># Belt and braces: make pushing to upstream physically impossible.</span>
git remote set-url --push upstream DISABLED</code></pre>

<h3>The contribution loop</h3>
<pre><code><span class="tok-comment"># 1. Start from the LATEST upstream code, not your fork's stale main.</span>
git fetch upstream
git switch main
git merge upstream/main          <span class="tok-comment"># or: git reset --hard upstream/main</span>

<span class="tok-comment"># 2. Branch. Never work on main in a fork.</span>
git switch -c fix/null-author-500

<span class="tok-comment"># 3. Work, in small commits with real messages (1.4).</span>
git commit -m <span class="tok-string">"fix(feed): return 200 with a placeholder when a post has no author"</span>

<span class="tok-comment"># 4. Push to YOUR fork.</span>
git push -u origin fix/null-author-500</code></pre>
<p>GitHub then shows a "Compare &amp; pull request" banner on your fork. The pull request goes <em>from</em> <code>cuonghoang1103:fix/null-author-500</code> <em>into</em> <code>original-owner:main</code>.</p>

<h3>Keeping your fork in sync</h3>
<p>A fork does not update itself. A week later, <code>origin/main</code> is a week behind the real project — and branching from it produces a pull request full of conflicts.</p>
<pre><code>git fetch upstream
git switch main
git merge --ff-only upstream/main    <span class="tok-comment"># fails loudly if you ever committed to your main</span>
git push origin main                  <span class="tok-comment"># update your fork on GitHub too</span></code></pre>
<div class="callout ok">Do this <em>before starting every new contribution</em>, not when the maintainer asks you to rebase. Branching from an up-to-date main is the single biggest thing you can do to make a pull request easy to merge.</div>
<p>If your <code>main</code> has drifted (you committed to it by accident), the blunt fix is fine — a fork's <code>main</code> should hold nothing of your own:</p>
<pre><code>git switch main
git reset --hard upstream/main
git push --force-with-lease origin main</code></pre>

<h3>Responding to review</h3>
<pre><code><span class="tok-comment"># Reviewer asks for changes. Commit on the SAME branch and push again —</span>
<span class="tok-comment"># the pull request updates itself. Do not open a new one.</span>
git switch fix/null-author-500
<span class="tok-comment"># …edit…</span>
git commit -m <span class="tok-string">"fix(feed): use the shared placeholder helper as requested"</span>
git push</code></pre>
<pre><code><span class="tok-comment"># Asked to rebase onto the latest upstream:</span>
git fetch upstream
git rebase upstream/main
git push --force-with-lease          <span class="tok-comment"># rewriting YOUR OWN fork branch — allowed (3.4)</span></code></pre>
<div class="callout warn">Force-pushing a pull-request branch is normal and expected in open source — it is your branch on your fork. But it invalidates review comments attached to the old commits, so do it when asked, or before the first review, not in the middle of an active discussion (3.4).</div>

<h3>Fetching someone else's pull request</h3>
<p>To test a contribution locally — as a maintainer, or to build on someone's work:</p>
<pre><code>git fetch upstream pull/431/head:pr-431   <span class="tok-comment"># fetch PR #431 into a local branch</span>
git switch pr-431</code></pre>
<p>GitHub exposes every pull request as a ref under <code>pull/&lt;n&gt;/head</code>. This works even when the contributor's fork has been deleted.</p>

<h3>Mistakes that make a pull request hard to accept</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Working on main</span><span class="v">Your fork's <code>main</code> is now un-syncable, and the pull request cannot be updated independently of it. Always branch.</span></div>
  <div class="kv"><span class="k">One pull request, three unrelated fixes</span><span class="v">The maintainer must accept or reject all three together. One branch per idea.</span></div>
  <div class="kv"><span class="k">Reformatting the whole file</span><span class="v">Your editor ran a formatter on save and the diff is now 400 lines. Turn format-on-save off for other people's repositories, or restrict it to lines you touched.</span></div>
  <div class="kv"><span class="k">Branching from a stale fork</span><span class="v">A pull request full of conflicts before anyone has read it. Sync first, every time.</span></div>
  <div class="kv"><span class="k">Ignoring CONTRIBUTING.md</span><span class="v">Most projects specify commit style, tests to run, and branch naming. Reading it takes five minutes and doubles your chance of a merge.</span></div>
</div>

<a class="link-card" href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks" target="_blank" rel="noopener">
  <span class="lc-ico">🍴</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Working with forks</span><span class="lc-sub">Syncing a fork, allowing maintainer edits, and the "Sync fork" button.</span></span>
</a>
<a class="link-card" href="https://opensource.guide/how-to-contribute/" target="_blank" rel="noopener">
  <span class="lc-ico">🌍</span>
  <span class="lc-body"><span class="lc-title">Open Source Guides — How to Contribute</span><span class="lc-sub">The social half: choosing a project, writing the pull request description, handling review.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> forgetting that a fork's <code>main</code> is a copy frozen at fork time. GitHub's "This branch is 47 commits behind" banner is easy to ignore, and every branch you cut from it inherits those 47 missing commits. The pull request then shows conflicts that have nothing to do with your change, and the maintainer usually asks you to start again. <code>git fetch upstream &amp;&amp; git merge --ff-only upstream/main</code> before every new branch.</div>
<p class="note-ct"><strong>Why the same pattern appears inside companies:</strong> the fork workflow is not only for open source. Many teams give contributors read access to the main repository and write access only to their own forks, so that the two-remote setup here is exactly the daily workflow. The commands do not change; only the names do.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.4</span>
<h2>Cách đóng góp cho một kho mã mà bạn không push vào được</h2>
<p class="lead">Bạn muốn sửa một lỗi trong một dự án mã nguồn mở. Bạn không có quyền ghi, nên <code>git push</code> bị từ chối. Câu trả lời là một <strong>fork</strong>: GitHub tạo cho bạn một bản sao phía máy chủ mà bạn <em>có</em> sở hữu, bạn push vào đó, rồi đề nghị dự án gốc kéo thay đổi của bạn về.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Fork trên GitHub</div><div class="lz-d">Một bản sao đầy đủ phía máy chủ dưới tài khoản bạn. Một cái nút.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Clone FORK CỦA BẠN</div><div class="lz-d">Nó trở thành <code>origin</code> — cái remote bạn push được.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Thêm bản gốc làm upstream</div><div class="lz-d">Một remote thứ hai để fetch nhưng không bao giờ push.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Tạo nhánh, commit, push lên origin</div><div class="lz-d">Fork của bạn nhận nhánh đó.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Mở pull request</div><div class="lz-d">Từ nhánh trên fork của bạn vào main của dự án gốc.</div></div>
</div>

<h3>Thiết lập</h3>
<pre><code><span class="tok-comment"># Sau khi bấm Fork trên GitHub:</span>
git clone git@github.com:cuonghoang1103/some-project.git
cd some-project
git remote add upstream https://github.com/original-owner/some-project.git
git remote -v</code></pre>
<div class="out">origin    git@github.com:cuonghoang1103/some-project.git (fetch)
origin    git@github.com:cuonghoang1103/some-project.git (push)
upstream  https://github.com/original-owner/some-project.git (fetch)
upstream  https://github.com/original-owner/some-project.git (push)</div>
<div class="kv-grid">
  <div class="kv"><span class="k">origin</span><span class="v">Fork của bạn. Bạn push vào đây. Dùng SSH, vì bạn xác thực với nó.</span></div>
  <div class="kv"><span class="k">upstream</span><span class="v">Dự án gốc. Bạn chỉ fetch. HTTPS là đủ — dù sao bạn cũng chẳng có chứng chỉ cho nó.</span></div>
</div>
<pre><code><span class="tok-comment"># Cho chắc: làm cho việc push vào upstream trở thành bất khả về mặt vật lý.</span>
git remote set-url --push upstream DISABLED</code></pre>

<h3>Vòng lặp đóng góp</h3>
<pre><code><span class="tok-comment"># 1. Bắt đầu từ mã upstream MỚI NHẤT, không phải cái main đã cũ của fork bạn.</span>
git fetch upstream
git switch main
git merge upstream/main          <span class="tok-comment"># hoặc: git reset --hard upstream/main</span>

<span class="tok-comment"># 2. Tạo nhánh. Đừng bao giờ làm việc trên main trong một fork.</span>
git switch -c fix/null-author-500

<span class="tok-comment"># 3. Làm việc, commit nhỏ với lời nhắn tử tế (bài 1.4).</span>
git commit -m <span class="tok-string">"fix(feed): tra 200 kem placeholder khi mot bai khong co tac gia"</span>

<span class="tok-comment"># 4. Push lên FORK CỦA BẠN.</span>
git push -u origin fix/null-author-500</code></pre>
<p>GitHub khi đó hiện dải "Compare &amp; pull request" trên fork của bạn. Pull request đi <em>từ</em> <code>cuonghoang1103:fix/null-author-500</code> <em>vào</em> <code>original-owner:main</code>.</p>

<h3>Giữ fork của bạn đồng bộ</h3>
<p>Một fork không tự cập nhật. Một tuần sau, <code>origin/main</code> đã đi sau dự án thật một tuần — và tạo nhánh từ đó sinh ra một pull request đầy xung đột.</p>
<pre><code>git fetch upstream
git switch main
git merge --ff-only upstream/main    <span class="tok-comment"># báo lỗi ầm ĩ nếu bạn từng commit vào main của mình</span>
git push origin main                  <span class="tok-comment"># cập nhật luôn fork của bạn trên GitHub</span></code></pre>
<div class="callout ok">Hãy làm việc này <em>TRƯỚC KHI bắt đầu mỗi đóng góp mới</em>, không phải khi người bảo trì yêu cầu bạn rebase. Tạo nhánh từ một main cập nhật là việc lớn nhất bạn làm được để một pull request dễ merge.</div>
<p>Nếu <code>main</code> của bạn đã trôi dạt (bạn lỡ commit vào nó), cách sửa thô bạo là ổn — <code>main</code> của một fork không nên giữ thứ gì của riêng bạn:</p>
<pre><code>git switch main
git reset --hard upstream/main
git push --force-with-lease origin main</code></pre>

<h3>Đáp lại review</h3>
<pre><code><span class="tok-comment"># Người review yêu cầu sửa. Hãy commit trên CÙNG nhánh và push lại —</span>
<span class="tok-comment"># pull request tự cập nhật. Đừng mở cái mới.</span>
git switch fix/null-author-500
<span class="tok-comment"># …sửa…</span>
git commit -m <span class="tok-string">"fix(feed): dung helper placeholder chung nhu duoc yeu cau"</span>
git push</code></pre>
<pre><code><span class="tok-comment"># Được yêu cầu rebase lên upstream mới nhất:</span>
git fetch upstream
git rebase upstream/main
git push --force-with-lease          <span class="tok-comment"># viết lại nhánh TRÊN FORK CỦA CHÍNH BẠN — được phép (bài 3.4)</span></code></pre>
<div class="callout warn">Force-push một nhánh của pull request là chuyện bình thường và được trông đợi trong mã nguồn mở — đó là nhánh của bạn trên fork của bạn. Nhưng nó làm mất hiệu lực các bình luận review gắn với commit cũ, nên hãy làm khi được yêu cầu, hoặc trước lần review đầu tiên, chứ đừng làm giữa một cuộc thảo luận đang sôi nổi (bài 3.4).</div>

<h3>Lấy về pull request của người khác</h3>
<p>Để thử một đóng góp ở máy mình — với tư cách người bảo trì, hoặc để làm tiếp trên công việc của ai đó:</p>
<pre><code>git fetch upstream pull/431/head:pr-431   <span class="tok-comment"># lấy PR #431 vào một nhánh cục bộ</span>
git switch pr-431</code></pre>
<p>GitHub phơi mọi pull request ra thành một ref dưới <code>pull/&lt;n&gt;/head</code>. Cách này chạy được cả khi fork của người đóng góp đã bị xoá.</p>

<h3>Những sai lầm làm pull request khó được chấp nhận</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Làm việc trên main</span><span class="v"><code>main</code> của fork bạn giờ không đồng bộ lại được, và pull request không cập nhật độc lập với nó được. Luôn tạo nhánh.</span></div>
  <div class="kv"><span class="k">Một pull request, ba bản vá không liên quan</span><span class="v">Người bảo trì buộc phải nhận hoặc từ chối cả ba cùng lúc. Mỗi ý một nhánh.</span></div>
  <div class="kv"><span class="k">Định dạng lại cả file</span><span class="v">Trình soạn thảo của bạn chạy formatter khi lưu và diff giờ dài 400 dòng. Hãy tắt format-khi-lưu với kho của người khác, hoặc giới hạn nó vào những dòng bạn chạm.</span></div>
  <div class="kv"><span class="k">Tạo nhánh từ một fork đã cũ</span><span class="v">Một pull request đầy xung đột trước khi có ai kịp đọc. Hãy đồng bộ trước, mỗi lần không sót.</span></div>
  <div class="kv"><span class="k">Bỏ qua CONTRIBUTING.md</span><span class="v">Đa số dự án nêu rõ kiểu lời nhắn commit, test phải chạy, và cách đặt tên nhánh. Đọc nó tốn năm phút và tăng gấp đôi cơ hội được merge.</span></div>
</div>

<a class="link-card" href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks" target="_blank" rel="noopener">
  <span class="lc-ico">🍴</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Làm việc với fork</span><span class="lc-sub">Đồng bộ fork, cho phép người bảo trì sửa, và nút "Sync fork".</span></span>
</a>
<a class="link-card" href="https://opensource.guide/how-to-contribute/" target="_blank" rel="noopener">
  <span class="lc-ico">🌍</span>
  <span class="lc-body"><span class="lc-title">Open Source Guides — Cách đóng góp</span><span class="lc-sub">Nửa phần xã hội: chọn dự án, viết mô tả pull request, xử lý review.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> quên rằng <code>main</code> của một fork là một bản sao đóng băng tại thời điểm fork. Dải chữ "This branch is 47 commits behind" của GitHub rất dễ bị lờ đi, và mọi nhánh bạn cắt ra từ đó đều thừa hưởng 47 commit thiếu hụt ấy. Pull request khi đó hiện những xung đột chẳng liên quan gì tới thay đổi của bạn, và người bảo trì thường bảo bạn làm lại từ đầu. Hãy <code>git fetch upstream &amp;&amp; git merge --ff-only upstream/main</code> trước mỗi nhánh mới.</div>
<p class="note-ct"><strong>Vì sao đúng mô hình này xuất hiện cả trong công ty:</strong> quy trình fork không chỉ dành cho mã nguồn mở. Nhiều nhóm cho người đóng góp quyền đọc kho chính và quyền ghi chỉ trên fork của họ, nên thiết lập hai remote ở đây chính là quy trình hằng ngày. Các lệnh không đổi; chỉ có tên là đổi.</p>
</div>
`,
    },

    /* ─────────────────────────── 5.5 Quiz ─────────────────────────── */
    {
      title: '5.5 — Chapter 5 quiz|||5.5 — Kiểm tra Chương 5',
      slug: 'git-5-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về remote, origin/main là bản lưu tạm chứ không phải bản trực tiếp, fetch vs pull, xác thực, ba lời từ chối khi push, tag không tự đi theo, và quy trình fork/upstream.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on remotes and GitHub. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: what <code>origin/main</code> actually is (5.1), and the correct response to "! [rejected] (fetch first)" (5.3).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về remote và GitHub. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: <code>origin/main</code> thật ra là gì (bài 5.1), và cách đáp đúng với "! [rejected] (fetch first)" (bài 5.3).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What is "origin/main"?|||"origin/main" là gì?',
            options: [
              'A live view of the branch on the server|||Một góc nhìn trực tiếp vào nhánh trên máy chủ',
              'A remote-tracking branch — your LOCAL cached record of where main was the last time you fetched|||Một nhánh theo dõi remote — bản ghi CỤC BỘ của bạn về chỗ main đứng ở lần fetch gần nhất',
              'Another name for your local main branch|||Một tên khác của nhánh main cục bộ của bạn',
              'The default branch name GitHub requires|||Tên nhánh mặc định mà GitHub bắt buộc',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is "git fetch" always safe to run?|||Vì sao "git fetch" lúc nào cũng an toàn để chạy?',
            options: [
              'It only works when there is nothing to download|||Nó chỉ chạy khi không có gì để tải về',
              'It downloads objects and moves remote-tracking refs only — your branches, index and working directory are untouched|||Nó chỉ tải các đối tượng và dời các ref theo dõi remote — nhánh, index và thư mục làm việc của bạn không bị đụng tới',
              'It asks for confirmation first|||Nó hỏi xác nhận trước',
              'It automatically stashes your changes|||Nó tự động stash các thay đổi của bạn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'git pull is equivalent to which two commands?|||git pull tương đương với hai lệnh nào?',
            options: [
              'git fetch + git reset --hard',
              'git fetch + git merge (or git rebase with --rebase)|||git fetch + git merge (hoặc git rebase khi có --rebase)',
              'git clone + git checkout',
              'git fetch + git push',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why should you avoid "credential.helper store"?|||Vì sao nên tránh "credential.helper store"?',
            options: [
              'It is slower than the alternatives|||Nó chậm hơn các lựa chọn khác',
              'It writes your token to ~/.git-credentials in PLAIN TEXT, readable by anything running as you|||Nó ghi token của bạn vào ~/.git-credentials dưới dạng CHỮ THÔ, mọi thứ chạy dưới danh nghĩa bạn đều đọc được',
              'It only works on Linux|||Nó chỉ chạy trên Linux',
              'It expires after one hour|||Nó hết hạn sau một giờ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your push is rejected with "(fetch first)". What is the correct response?|||Push của bạn bị từ chối với "(fetch first)". Cách đáp đúng là gì?',
            options: [
              'git push --force',
              'git pull --rebase (or fetch + integrate), resolve anything that conflicts, run the tests, then push|||git pull --rebase (hoặc fetch + tích hợp), giải những gì xung đột, chạy test, rồi push',
              'Delete the remote branch and push again|||Xoá nhánh trên remote rồi push lại',
              'git reset --hard origin/main',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You created a tag and ran "git push origin main". Is the tag on the server?|||Bạn tạo một tag rồi chạy "git push origin main". Cái tag có lên máy chủ không?',
            options: [
              'Yes, tags follow the commits they point at|||Có, tag đi theo commit mà nó trỏ vào',
              'No — tags are separate refs and must be pushed explicitly (git push origin <tag> or --follow-tags)|||Không — tag là ref riêng và phải được push tường minh (git push origin <tag> hoặc --follow-tags)',
              'Only if the tag is annotated|||Chỉ khi tag có chú thích',
              'Only if you pushed to the default branch|||Chỉ khi bạn push vào nhánh mặc định',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In the fork workflow, what are "origin" and "upstream"?|||Trong quy trình fork, "origin" và "upstream" là gì?',
            options: [
              'origin is the original project; upstream is your fork|||origin là dự án gốc; upstream là fork của bạn',
              'origin is YOUR fork (you push there); upstream is the original project (you only fetch)|||origin là FORK CỦA BẠN (bạn push vào đó); upstream là dự án gốc (bạn chỉ fetch)',
              'They are two names for the same remote|||Chúng là hai tên của cùng một remote',
              'origin is HTTPS and upstream is SSH|||origin là HTTPS còn upstream là SSH',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does a fork need syncing before each new contribution?|||Vì sao một fork cần được đồng bộ trước mỗi đóng góp mới?',
            options: [
              'GitHub charges for out-of-date forks|||GitHub tính phí cho fork lỗi thời',
              'A fork does not update itself, so branching from a stale main produces a pull request full of unrelated conflicts|||Một fork không tự cập nhật, nên tạo nhánh từ một main đã cũ sinh ra pull request đầy xung đột không liên quan',
              'Otherwise your SSH key stops working|||Nếu không thì khoá SSH của bạn ngừng hoạt động',
              'It is only needed for private repositories|||Chỉ cần với kho riêng tư',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
