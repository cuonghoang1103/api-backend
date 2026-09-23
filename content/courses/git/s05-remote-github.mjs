/**
 * Git & GitHub — Chương 5: Remote & GitHub.
 * remote là gì · fetch vs pull · nhánh theo dõi · SSH vs HTTPS và token ·
 * push (-u, xoá nhánh remote, tag) · giữ đồng bộ khi hai bên phân ly · fork & upstream.
 * Output CHẠY THẬT git 2.43. LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;;
 * & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 5 — Remotes & GitHub|||Chương 5 — Remote & GitHub',
  description: 'Git là phân tán, nên "máy chủ" chỉ là một bản clone mà mọi người đồng ý coi là trung tâm. Chương này làm rõ remote thật sự là gì, vì sao fetch an toàn còn pull thì không phải lúc nào cũng vậy, nhánh theo dõi hoạt động ra sao, cách xác thực với GitHub, và quy trình fork/upstream để đóng góp cho dự án của người khác.',
  lessons: [
    /* ─────────────────────────── 5.0 ─────────────────────────── */
    {
      title: '5.0 — Chapter 5 slides: remotes in pictures|||5.0 — Slide Chương 5: remote bằng hình',
      slug: 'git-5-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 18 slide của Chương 5: máy bạn ↔ origin, origin/main là ảnh chụp, fetch và pull vẽ bằng đồ thị, SSH vs token, ba lời từ chối khi push, tag, và tam giác fork–upstream — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Slides</span>
<h2>The whole chapter in 18 slides</h2>
<p class="lead">Remotes stop being confusing the moment you can see them: three different things called "main" (yours, <code>origin/main</code>, and the real one on the server), a fetch that moves only the snapshot, a pull that then merges or rebases, and a fork that turns two remotes into a triangle. These slides draw each of those as a picture.</p>
<p>Every terminal on the slides is real output (git 2.51) from a test setup where the "server" is a bare repository on the same disk (<code>git init --bare</code>) and a second clone plays your teammate An — so the hashes match from slide to slide: the commit <code>ca54b35</code> that An pushes on slide 4 is the one your push is rejected over on slide 12. Nothing was pushed to the real GitHub. The slides are in Vietnamese; the diagrams read the same in any language. The last two slides are a cheat sheet and a 30-minute practice session you can do without a GitHub account.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Slide</span>
<h2>Cả chương trong 18 slide</h2>
<p class="lead">Remote hết rối ngay khi bạn nhìn thấy nó: ba thứ khác nhau cùng tên "main" (của bạn, <code>origin/main</code>, và bản thật trên máy chủ), một lần fetch chỉ dời tấm ảnh chụp, một lần pull rồi mới merge hoặc rebase, và một fork biến hai remote thành một tam giác. Bộ slide này vẽ từng thứ đó thành hình.</p>
<p>Mọi terminal trên slide là output thật (git 2.51) từ một bộ thử trong đó "máy chủ" là một kho trần nằm ngay trên đĩa (<code>git init --bare</code>) và một bản clone thứ hai đóng vai bạn cùng nhóm An — nên mã băm khớp nhau từ slide này sang slide khác: commit <code>ca54b35</code> mà An push ở slide 4 chính là commit khiến lần push của bạn bị từ chối ở slide 12. Không có gì bị push lên GitHub thật. Hai slide cuối là bảng tra nhanh và một buổi thực hành 30 phút làm được mà không cần tài khoản GitHub.</p>
</div>
${gallery('git-05', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Máy bạn ↔ origin: ba thứ mang tên main'], [4, 'origin/main không phải bản trực tiếp'],
  [5, 'git fetch chỉ dời origin/main'], [6, 'pull: merge hay rebase'], [7, 'git 2.51: pull trần từ chối khi hai bên lệch nhau'],
  [8, 'SSH key hay HTTPS + token'], [9, 'Token fine-grained và credential helper'], [10, 'Tạo khoá ed25519 và đọc thông báo lỗi'],
  [11, 'push -u nối nhánh với upstream'], [12, 'Push bị từ chối: fetch first và non-fast-forward'], [13, 'Xoá nhánh trên máy chủ, rồi fetch --prune'],
  [14, 'Tag không tự đi theo commit'], [15, 'Tam giác upstream — origin — máy bạn'], [16, 'Đồng bộ fork từ upstream'],
  [17, 'Bảng tra nhanh'], [18, 'Thực hành chương 5'],
])}
`,
    },

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
${slide('git-05', 3, 'Máy bạn ↔ origin: ba thứ mang tên main')}
${slide('git-05', 4, 'origin/main không phải bản trực tiếp')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">main</span><span class="lz-v">A <strong>local branch</strong>. Yours. You commit on it and it moves.</span></div>
  <div class="lz-layer"><span class="lz-k">origin/main</span><span class="lz-v">A <strong>remote-tracking branch</strong>. Your local record of where <code>main</code> was on the server the last time you talked to it. You cannot commit on it; Git updates it for you.</span></div>
  <div class="lz-layer"><span class="lz-k">main on the server</span><span class="lz-v">The real thing, on GitHub. You never see it directly — only <code>origin/main</code>, which may be hours out of date.</span></div>
</div>
<div class="callout warn">This is the source of most remote confusion. <code>origin/main</code> is <strong>not live</strong>. It is a cached snapshot that only changes when you run <code>fetch</code>, <code>pull</code> or <code>push</code>. If a colleague pushed five minutes ago, your <code>origin/main</code> still points at yesterday's commit until you fetch — and <code>git log origin/main</code> will confidently show you stale information.</div>

<h3>fetch — download, change nothing</h3>
${slide('git-05', 5, 'git fetch chỉ dời origin/main')}
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
${slide('git-05', 6, 'pull: merge hay rebase')}
${slide('git-05', 7, 'git 2.51: pull trần từ chối khi hai bên lệch nhau')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">git fetch</div><div class="lz-d">Download and move origin/main. Safe.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">git merge origin/main</div><div class="lz-d">Integrate into your branch. Can conflict, can create a merge commit, changes your working directory.</div></div>
</div>
<p>That is all <code>git pull</code> is: two commands with one name. The second half is the one that can surprise you — which is why the two-step version is worth using whenever you are unsure what is waiting on the server.</p>
<pre><code>git pull                     <span class="tok-comment"># fetch + merge (default)</span>
git pull --rebase            <span class="tok-comment"># fetch + rebase (3.4)</span>
git pull --ff-only           <span class="tok-comment"># fetch + merge, but REFUSE if it is not a fast-forward</span></code></pre>
<div class="callout warn"><code>--ff-only</code> is the setting worth adopting. If your branch and the server have both moved, it stops and tells you, instead of silently creating a merge commit you did not ask for. You then choose <code>--rebase</code> or a real merge — deliberately. <code>git config --global pull.ff only</code> makes it the default.</div>
<div class="callout warn"><strong>What plain <code>git pull</code> does today (git 2.51):</strong> "fetch + merge" is only the whole story when nothing is configured AND your branch has not diverged. If both sides have new commits and you have set none of <code>pull.rebase</code> / <code>pull.ff</code>, modern Git refuses instead of merging — real output from our test repository:
<div class="out">hint: You have divergent branches and need to specify how to reconcile them.
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
fatal: Need to specify how to reconcile divergent branches.</div>
Nothing was changed; Git is asking you to decide once. <code>pull.ff only</code> is the choice this lesson recommends, and then you pick <code>--rebase</code> or <code>--no-rebase</code> by hand on the rare day the two sides really diverge. Older tutorials (and older Git) show a silent merge commit here instead.</div>

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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Give <code>thu-git</code> a fake server if it does not have one yet (Lesson 4.1 did this): <code>git init --bare ../thu-git-server.git</code>, <code>git remote add origin ../thu-git-server.git</code>, <code>git push -u origin main</code>.</li><li>Play your teammate: <code>git clone ../thu-git-server.git ../ban-cung-nhom</code>, then inside it set <code>git config user.name "An"</code>, add a file <code>footer.js</code>, commit, and <code>git push</code>.</li><li>Back in <code>thu-git</code>, <strong>before fetching</strong>, run <code>git status -sb</code> and <code>git log --oneline -1 origin/main</code>. Write down what they claim — neither knows An pushed.</li><li><code>git fetch</code>, then <code>git log --oneline main..origin/main</code> (what did An add?) and <code>git status -sb</code> again.</li><li>Integrate with <code>git pull --ff-only</code>. It succeeds because you made no commit of your own in the meantime — a fast-forward.</li></ol>
<pre><code>git fetch</code></pre>
<div class="out">From ../server
   5c1df3b..ca54b35  main       -&gt; origin/main</div>
<p>(Real output from our test repository, whose server is <code>../server.git</code>; your hashes and names will differ.)</p>
<p><strong>Done when:</strong> <code>main..origin/main</code> printed exactly An's commit before the pull, and after <code>git pull --ff-only</code> the command <code>git status -sb</code> prints <code>## main...origin/main</code> with no <code>[ahead …]</code> or <code>[behind …]</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Remote</span><span class="v">A short name (usually <code>origin</code>) saved for the URL or path of another copy of the repository.</span></div>
  <div class="kv"><span class="k">Remote-tracking branch</span><span class="v"><code>origin/main</code>: your local snapshot of where the server's <code>main</code> was at the last fetch, pull or push.</span></div>
  <div class="kv"><span class="k">fetch</span><span class="v">Downloads new commits and moves only the remote-tracking branches. Never touches your work.</span></div>
  <div class="kv"><span class="k">pull</span><span class="v">fetch, then integrate (merge, rebase, or fast-forward only) into your current branch.</span></div>
  <div class="kv"><span class="k">Fast-forward</span><span class="v">Integration that just moves your branch forward because you have nothing new of your own. No merge commit.</span></div>
  <div class="kv"><span class="k">Diverged</span><span class="v">Both your branch and the server have commits the other lacks; you must merge or rebase before pushing.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>origin</code> is only a nickname for a URL; a repository can have many remotes.</li><li><code>origin/main</code> is a snapshot, not a live view — it moves only on fetch, pull or push.</li><li><code>git fetch</code> is always safe: it changes what you know, never what you have.</li><li><code>git pull</code> = fetch + integrate; set <code>pull.ff only</code> so it never merges behind your back.</li><li>Before believing "up to date", run <code>git fetch</code>.</li></ul>

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
${slide('git-05', 3, 'Máy bạn ↔ origin: ba thứ mang tên main')}
${slide('git-05', 4, 'origin/main không phải bản trực tiếp')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">main</span><span class="lz-v">Một <strong>nhánh cục bộ</strong>. Của bạn. Bạn commit lên nó và nó dịch chuyển.</span></div>
  <div class="lz-layer"><span class="lz-k">origin/main</span><span class="lz-v">Một <strong>nhánh theo dõi remote</strong>. Bản ghi cục bộ của bạn về chỗ <code>main</code> đứng trên máy chủ ở lần cuối bạn nói chuyện với nó. Bạn không commit lên nó được; Git tự cập nhật nó.</span></div>
  <div class="lz-layer"><span class="lz-k">main trên máy chủ</span><span class="lz-v">Thứ thật, trên GitHub. Bạn không bao giờ nhìn thấy nó trực tiếp — chỉ thấy <code>origin/main</code>, thứ có thể đã cũ vài giờ.</span></div>
</div>
<div class="callout warn">Đây là nguồn gốc của phần lớn sự bối rối về remote. <code>origin/main</code> <strong>KHÔNG phải là bản trực tiếp</strong>. Nó là một ảnh chụp lưu tạm, chỉ đổi khi bạn chạy <code>fetch</code>, <code>pull</code> hay <code>push</code>. Nếu một đồng nghiệp vừa push năm phút trước, <code>origin/main</code> của bạn vẫn trỏ vào commit hôm qua cho tới khi bạn fetch — và <code>git log origin/main</code> sẽ tự tin cho bạn xem thông tin đã cũ.</div>

<h3>fetch — tải về, không đổi gì cả</h3>
${slide('git-05', 5, 'git fetch chỉ dời origin/main')}
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
${slide('git-05', 6, 'pull: merge hay rebase')}
${slide('git-05', 7, 'git 2.51: pull trần từ chối khi hai bên lệch nhau')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">git fetch</div><div class="lz-d">Tải về và dời origin/main. An toàn.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">git merge origin/main</div><div class="lz-d">Tích hợp vào nhánh của bạn. Có thể xung đột, có thể tạo commit hợp nhất, đổi thư mục làm việc của bạn.</div></div>
</div>
<p><code>git pull</code> chỉ có vậy: hai lệnh mang một cái tên. Nửa sau mới là phần có thể làm bạn bất ngờ — và vì thế bản hai bước đáng dùng mỗi khi bạn chưa chắc thứ gì đang chờ trên máy chủ.</p>
<pre><code>git pull                     <span class="tok-comment"># fetch + merge (mặc định)</span>
git pull --rebase            <span class="tok-comment"># fetch + rebase (bài 3.4)</span>
git pull --ff-only           <span class="tok-comment"># fetch + merge, nhưng TỪ CHỐI nếu không phải fast-forward</span></code></pre>
<div class="callout warn"><code>--ff-only</code> là thiết lập đáng nhận. Nếu nhánh của bạn và máy chủ cùng tiến lên, nó dừng lại và báo cho bạn, thay vì âm thầm tạo một commit hợp nhất bạn không hề yêu cầu. Bạn khi đó tự chọn <code>--rebase</code> hay một lần merge thật — một cách có chủ ý. <code>git config --global pull.ff only</code> đặt nó làm mặc định.</div>
<div class="callout warn"><strong><code>git pull</code> trần hôm nay làm gì (git 2.51):</strong> "fetch + merge" chỉ đúng trọn vẹn khi chưa cấu hình gì VÀ nhánh của bạn chưa phân ly (diverged — hai bên cùng có commit mới). Nếu cả hai bên đều có commit mới mà bạn chưa đặt <code>pull.rebase</code> hay <code>pull.ff</code>, Git bây giờ TỪ CHỐI thay vì merge — output thật từ kho thử:
<div class="out">hint: You have divergent branches and need to specify how to reconcile them.
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
fatal: Need to specify how to reconcile divergent branches.</div>
Không có gì bị thay đổi; Git chỉ đang bắt bạn chọn một lần. <code>pull.ff only</code> là lựa chọn bài này khuyên, rồi vào những hôm hai bên thật sự lệch nhau thì bạn tự gõ <code>--rebase</code> hoặc <code>--no-rebase</code>. Hướng dẫn cũ (và Git cũ) sẽ cho bạn thấy một commit hợp nhất âm thầm ở chỗ này.</div>

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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Cho <code>thu-git</code> một máy chủ giả nếu chưa có (bài 4.1 đã làm): <code>git init --bare ../thu-git-server.git</code>, <code>git remote add origin ../thu-git-server.git</code>, <code>git push -u origin main</code>.</li><li>Đóng vai bạn cùng nhóm: <code>git clone ../thu-git-server.git ../ban-cung-nhom</code>, rồi trong đó đặt <code>git config user.name "An"</code>, thêm file <code>footer.js</code>, commit, và <code>git push</code>.</li><li>Quay lại <code>thu-git</code>, <strong>CHƯA fetch</strong>, chạy <code>git status -sb</code> và <code>git log --oneline -1 origin/main</code>. Ghi lại chúng nói gì — cả hai đều không biết An đã push.</li><li><code>git fetch</code>, rồi <code>git log --oneline main..origin/main</code> (An đã thêm gì?) và <code>git status -sb</code> lần nữa.</li><li>Tích hợp bằng <code>git pull --ff-only</code>. Nó thành công vì trong lúc đó bạn không có commit nào của riêng mình — tua thẳng (fast-forward).</li></ol>
<pre><code>git fetch</code></pre>
<div class="out">From ../server
   5c1df3b..ca54b35  main       -&gt; origin/main</div>
<p>(Output thật từ kho thử, máy chủ ở đó tên <code>../server.git</code>; mã băm và tên của bạn sẽ khác.)</p>
<p><strong>Đạt khi:</strong> trước khi pull, <code>main..origin/main</code> in ra đúng commit của An; sau <code>git pull --ff-only</code>, lệnh <code>git status -sb</code> in <code>## main...origin/main</code> không kèm <code>[ahead …]</code> hay <code>[behind …]</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Remote</span><span class="v">Kho từ xa — một cái tên ngắn (thường là <code>origin</code>) lưu URL hoặc đường dẫn của một bản sao khác của kho.</span></div>
  <div class="kv"><span class="k">Remote-tracking branch</span><span class="v">Nhánh theo dõi remote — <code>origin/main</code>: ảnh chụp trên máy bạn về chỗ <code>main</code> của máy chủ ở lần fetch/pull/push gần nhất.</span></div>
  <div class="kv"><span class="k">fetch</span><span class="v">Tải về — lấy commit mới và chỉ dời các nhánh theo dõi remote. Không bao giờ đụng việc của bạn.</span></div>
  <div class="kv"><span class="k">pull</span><span class="v">Kéo về — fetch rồi tích hợp (merge, rebase, hoặc chỉ tua thẳng) vào nhánh hiện tại.</span></div>
  <div class="kv"><span class="k">Fast-forward</span><span class="v">Tua thẳng — tích hợp chỉ bằng cách đẩy nhánh của bạn lên trước vì bạn chưa có gì mới. Không có commit hợp nhất.</span></div>
  <div class="kv"><span class="k">Diverged</span><span class="v">Phân ly — nhánh của bạn và máy chủ mỗi bên có commit bên kia không có; phải merge hoặc rebase rồi mới push được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>origin</code> chỉ là biệt danh của một URL; một kho có thể có nhiều remote.</li><li><code>origin/main</code> là ảnh chụp, không phải bản trực tiếp — nó chỉ dịch khi fetch, pull hoặc push.</li><li><code>git fetch</code> luôn an toàn: nó đổi điều bạn BIẾT, không đổi thứ bạn CÓ.</li><li><code>git pull</code> = fetch + tích hợp; đặt <code>pull.ff only</code> để nó không bao giờ merge sau lưng bạn.</li><li>Trước khi tin "up to date", hãy chạy <code>git fetch</code>.</li></ul>

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
${slide('git-05', 8, 'SSH key hay HTTPS + token')}
<div class="kv-grid">
  <div class="kv"><span class="k">SSH — git@github.com:user/repo.git</span><span class="v">A key pair. Set up once (0.3), no expiry, nothing to paste. Blocked on some corporate networks that only allow port 443.</span></div>
  <div class="kv"><span class="k">HTTPS — https://github.com/user/repo.git</span><span class="v">A personal access token used as the password. Works through any firewall and proxy. Tokens expire, so you re-issue them periodically.</span></div>
</div>
<p>Both are equally secure. Choose SSH for your own machine and HTTPS where SSH is blocked. Check which a repository uses, and switch without re-cloning:</p>
<pre><code>git remote -v</code></pre>
<div class="out">origin  https://github.com/cuonghoang1103/api-backend.git (fetch)</div>
<pre><code>git remote set-url origin git@github.com:cuonghoang1103/api-backend.git</code></pre>
<div class="callout ok"><strong>School or café Wi-Fi blocks port 22?</strong> SSH then just hangs. GitHub also answers SSH on port 443 at <code>ssh.github.com</code> — test with <code>ssh -T -p 443 git@ssh.github.com</code>, and if that greets you, add to <code>~/.ssh/config</code>:
<pre><code>Host github.com
    Hostname ssh.github.com
    Port 443
    User git</code></pre>
Your remote URLs stay exactly as they are. (GitHub Docs, "Using SSH over the HTTPS port", checked 09/2026.)</div>

<h3>Personal access tokens</h3>
${slide('git-05', 9, 'Token fine-grained và credential helper')}
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
<div class="callout ok"><strong>Creating a fine-grained token, step by step (GitHub, as of 09/2026):</strong> Settings → Developer settings → Personal access tokens → <strong>Fine-grained tokens</strong> → Generate new token. Give it a name that says where it will live ("macbook-cuong"). <strong>Expiration</strong>: GitHub now allows an unlimited lifetime unless an organisation forbids it — pick a date anyway (90 days). <strong>Resource owner</strong>: you, or the organisation that owns the project. <strong>Repository access</strong>: "Only select repositories" and tick only the ones you push to. <strong>Permissions</strong>: Contents → Read and write. The token is shown once; paste it when Git asks for a password and let the credential helper keep it. Note one real limit from the docs: a fine-grained token cannot push to a public repository you are not a member of — for open source, you push to your own fork (5.4) anyway.</div>

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
${slide('git-05', 10, 'Tạo khoá ed25519 và đọc thông báo lỗi')}
<pre><code>ssh -T git@github.com          <span class="tok-comment"># is SSH working at all?</span>
ssh -vT git@github.com         <span class="tok-comment"># verbose: WHICH key is being offered</span></code></pre>
<div class="out">Hi cuonghoang1103! You've successfully authenticated, but GitHub does not provide shell access.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Permission denied (publickey)</span><span class="v">The key is not loaded or not on GitHub. <code>ssh-add -l</code> to list loaded keys, then re-add with <code>ssh-add ~/.ssh/id_ed25519</code>.</span></div>
  <div class="kv"><span class="k">remote: Invalid username or token. Password authentication is not supported for Git operations.</span><span class="v">Over HTTPS: you typed your account password instead of a token, or the token expired. (Older guides quote this as "Invalid username or password"; the wording above is what GitHub returns as of 09/2026.)</span></div>
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>This one needs your real GitHub account. In any repository you own, run <code>git remote -v</code>: does it start with <code>git@github.com:</code> (SSH) or <code>https://</code> (token)?</li><li>Check for a key: <code>ls ~/.ssh/*.pub</code>. No <code>id_ed25519.pub</code>? Create one with <code>ssh-keygen -t ed25519 -C "your_email@example.com"</code> (set a passphrase), load it with <code>ssh-add --apple-use-keychain ~/.ssh/id_ed25519</code> on macOS, and paste the <code>.pub</code> file into GitHub → Settings → SSH and GPG keys → New SSH key.</li><li>Test: <code>ssh -T git@github.com</code>. If it hangs on the school network, try the port-443 test from the box above.</li><li>Find out who actually stores your HTTPS password: <code>git config --get-urlmatch credential.helper https://github.com</code>. If it says <code>store</code>, switch to your OS keychain and delete <code>~/.git-credentials</code>.</li><li>Switch one repository to SSH with <code>git remote set-url</code> and run <code>git fetch</code>.</li></ol>
<p>On the author's Mac, step 4 printed <code>!/opt/homebrew/bin/gh auth git-credential</code> while plain <code>git config --get credential.helper</code> printed <code>osxkeychain</code> — the GitHub CLI had registered itself only for <code>https://github.com</code>. That is why the URL-matching form is the one to trust.</p>
<p><strong>Done when:</strong> <code>ssh -T git@github.com</code> greets you by your GitHub username, the helper from step 4 is not <code>store</code>, and <code>git fetch</code> in the switched repository finishes without asking for anything.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SSH key pair</span><span class="v">A private key that never leaves your machine plus a public key (<code>.pub</code>) that you give to GitHub.</span></div>
  <div class="kv"><span class="k">Passphrase</span><span class="v">The password that encrypts your private key on disk; the keychain can remember it for you.</span></div>
  <div class="kv"><span class="k">Personal access token (PAT)</span><span class="v">A password-like string used over HTTPS. Fine-grained tokens are limited to chosen repositories and permissions.</span></div>
  <div class="kv"><span class="k">Credential helper</span><span class="v">The program Git asks to store and return your HTTPS credentials (Keychain, Git Credential Manager, libsecret).</span></div>
  <div class="kv"><span class="k">Deploy key</span><span class="v">An SSH key attached to a single repository, read-only by default — the right key for a server.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>GitHub stopped accepting account passwords for Git on 13 August 2021: use an SSH key or a token.</li><li>SSH suits your own machine; HTTPS + token works where port 22 is blocked (or use SSH over port 443).</li><li>Prefer fine-grained tokens: selected repositories, Contents read/write, and an expiry date.</li><li>Keep credentials in the OS keychain, never in <code>credential.helper store</code> or inside a remote URL.</li><li>Read the error: "publickey" is a key problem, "Invalid username or token" is a wrong or expired token, 403 is a permission problem.</li></ul>

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
${slide('git-05', 8, 'SSH key hay HTTPS + token')}
<div class="kv-grid">
  <div class="kv"><span class="k">SSH — git@github.com:user/repo.git</span><span class="v">Một cặp khoá. Cài một lần (bài 0.3), không hết hạn, không phải dán gì. Bị chặn trên vài mạng công ty vốn chỉ cho cổng 443.</span></div>
  <div class="kv"><span class="k">HTTPS — https://github.com/user/repo.git</span><span class="v">Một personal access token dùng làm mật khẩu. Chạy được qua mọi tường lửa và proxy. Token hết hạn, nên thỉnh thoảng phải cấp lại.</span></div>
</div>
<p>Cả hai đều an toàn như nhau. Hãy chọn SSH cho máy của bạn và HTTPS ở nơi SSH bị chặn. Kiểm xem một kho đang dùng cái nào, và đổi mà không cần clone lại:</p>
<pre><code>git remote -v</code></pre>
<div class="out">origin  https://github.com/cuonghoang1103/api-backend.git (fetch)</div>
<pre><code>git remote set-url origin git@github.com:cuonghoang1103/api-backend.git</code></pre>
<div class="callout ok"><strong>Wi-Fi trường hay quán cà phê chặn cổng 22?</strong> SSH khi đó cứ treo im. GitHub còn nghe SSH ở cổng 443 tại <code>ssh.github.com</code> — thử bằng <code>ssh -T -p 443 git@ssh.github.com</code>, nếu nó chào bạn thì thêm vào <code>~/.ssh/config</code>:
<pre><code>Host github.com
    Hostname ssh.github.com
    Port 443
    User git</code></pre>
URL remote của bạn giữ nguyên. (GitHub Docs, "Using SSH over the HTTPS port", kiểm 09/2026.)</div>

<h3>Personal access token</h3>
${slide('git-05', 9, 'Token fine-grained và credential helper')}
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
<div class="callout ok"><strong>Tạo token fine-grained từng bước (GitHub, tính đến 09/2026):</strong> Settings → Developer settings → Personal access tokens → <strong>Fine-grained tokens</strong> → Generate new token. Đặt tên nói rõ nó sẽ nằm ở đâu ("macbook-cuong"). <strong>Expiration</strong> (hạn dùng): GitHub giờ cho phép vô thời hạn nếu tổ chức không cấm — vẫn nên chọn một ngày (90 ngày). <strong>Resource owner</strong> (chủ tài nguyên): bạn, hoặc tổ chức sở hữu dự án. <strong>Repository access</strong>: chọn "Only select repositories" và chỉ tích những kho bạn push. <strong>Permissions</strong>: Contents → Read and write. Token chỉ hiện MỘT lần; dán nó khi Git hỏi mật khẩu rồi để credential helper giữ. Có một giới hạn thật trong docs: token fine-grained không push được vào kho công khai mà bạn không phải thành viên — với mã nguồn mở thì đằng nào bạn cũng push vào fork của mình (bài 5.4).</div>

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
${slide('git-05', 10, 'Tạo khoá ed25519 và đọc thông báo lỗi')}
<pre><code>ssh -T git@github.com          <span class="tok-comment"># SSH có chạy được không?</span>
ssh -vT git@github.com         <span class="tok-comment"># chi tiết: khoá NÀO đang được đưa ra</span></code></pre>
<div class="out">Hi cuonghoang1103! You've successfully authenticated, but GitHub does not provide shell access.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Permission denied (publickey)</span><span class="v">Khoá chưa được nạp hoặc chưa có trên GitHub. <code>ssh-add -l</code> để liệt kê khoá đã nạp, rồi nạp lại bằng <code>ssh-add ~/.ssh/id_ed25519</code>.</span></div>
  <div class="kv"><span class="k">remote: Invalid username or token. Password authentication is not supported for Git operations.</span><span class="v">Qua HTTPS: bạn gõ mật khẩu tài khoản thay vì token, hoặc token đã hết hạn. (Hướng dẫn cũ ghi câu này là "Invalid username or password"; câu ở trên là thứ GitHub trả về tính đến 09/2026.)</span></div>
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Bài này cần tài khoản GitHub thật. Trong một kho bất kỳ của bạn, chạy <code>git remote -v</code>: nó bắt đầu bằng <code>git@github.com:</code> (SSH) hay <code>https://</code> (token)?</li><li>Kiểm khoá: <code>ls ~/.ssh/*.pub</code>. Chưa có <code>id_ed25519.pub</code>? Tạo bằng <code>ssh-keygen -t ed25519 -C "email_cua_ban@example.com"</code> (đặt passphrase), nạp vào agent bằng <code>ssh-add --apple-use-keychain ~/.ssh/id_ed25519</code> trên macOS, rồi dán nội dung file <code>.pub</code> vào GitHub → Settings → SSH and GPG keys → New SSH key.</li><li>Thử: <code>ssh -T git@github.com</code>. Nếu nó treo khi dùng mạng trường, thử cách cổng 443 ở khung phía trên.</li><li>Tìm xem ai thật sự giữ mật khẩu HTTPS của bạn: <code>git config --get-urlmatch credential.helper https://github.com</code>. Nếu nó ghi <code>store</code>, chuyển sang keychain của hệ điều hành và xoá <code>~/.git-credentials</code>.</li><li>Đổi một kho sang SSH bằng <code>git remote set-url</code> rồi chạy <code>git fetch</code>.</li></ol>
<p>Trên máy Mac của tác giả, bước 4 in ra <code>!/opt/homebrew/bin/gh auth git-credential</code> trong khi <code>git config --get credential.helper</code> trần lại in <code>osxkeychain</code> — GitHub CLI đã tự đăng ký riêng cho <code>https://github.com</code>. Vì thế dạng khớp theo URL mới là dạng đáng tin.</p>
<p><strong>Đạt khi:</strong> <code>ssh -T git@github.com</code> chào bạn đúng tên GitHub, helper ở bước 4 không phải <code>store</code>, và <code>git fetch</code> trong kho vừa đổi chạy xong mà không hỏi gì.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">SSH key pair</span><span class="v">Cặp khoá SSH — khoá bí mật (private) không bao giờ rời máy bạn, cộng khoá công khai (<code>.pub</code>) bạn đưa cho GitHub.</span></div>
  <div class="kv"><span class="k">Passphrase</span><span class="v">Mật khẩu của khoá — mã hoá khoá bí mật trên đĩa; Keychain có thể nhớ hộ bạn.</span></div>
  <div class="kv"><span class="k">Personal access token (PAT)</span><span class="v">Mã truy cập cá nhân — chuỗi dùng thay mật khẩu khi đi HTTPS. Loại fine-grained (chi tiết) chỉ có quyền trên kho và quyền bạn chọn.</span></div>
  <div class="kv"><span class="k">Credential helper</span><span class="v">Trình giữ thông tin đăng nhập — chương trình Git nhờ lưu và trả lại mật khẩu/token HTTPS (Keychain, Git Credential Manager, libsecret).</span></div>
  <div class="kv"><span class="k">Deploy key</span><span class="v">Khoá triển khai — khoá SSH gắn vào đúng một kho, mặc định chỉ đọc; loại khoá đúng cho máy chủ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>GitHub ngừng nhận mật khẩu tài khoản cho Git từ 13/08/2021: dùng khoá SSH hoặc token.</li><li>SSH hợp với máy của chính bạn; HTTPS + token chạy cả khi cổng 22 bị chặn (hoặc dùng SSH qua cổng 443).</li><li>Ưu tiên token fine-grained: chọn đúng kho, Contents read/write, và có ngày hết hạn.</li><li>Giữ thông tin đăng nhập trong keychain của hệ điều hành, không bao giờ trong <code>credential.helper store</code> hay nhét trong URL remote.</li><li>Đọc lỗi: "publickey" là chuyện khoá, "Invalid username or token" là token sai/hết hạn, 403 là chuyện quyền.</li></ul>

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
${slide('git-05', 11, 'push -u nối nhánh với upstream')}
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
${slide('git-05', 12, 'Push bị từ chối: fetch first và non-fast-forward')}
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
<div class="callout warn"><strong>"non-fast-forward" does not always mean you rewrote history.</strong> Git picks the wording by what your machine already has. Real output from our test repository, same situation twice — An pushed, Cường has one commit of his own:
<div class="out"><span class="tok-comment"># before fetching:</span>
 ! [rejected]        main -&gt; main (fetch first)
<span class="tok-comment"># after "git fetch", but before merging or rebasing:</span>
 ! [rejected]        main -&gt; main (non-fast-forward)</div>
So a plain "fetched but did not integrate" also shows up as non-fast-forward. Check <code>git status</code> before reaching for <code>--force-with-lease</code>: if it says <em>diverged</em> and you never ran rebase or amend, the answer is still <code>git pull --rebase</code>, not a force.</div>

<h3>Pushing to a different name, and deleting</h3>
${slide('git-05', 13, 'Xoá nhánh trên máy chủ, rồi fetch --prune')}
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
${slide('git-05', 14, 'Tag không tự đi theo commit')}
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In <code>thu-git</code> (with the fake server from 5.1): <code>git switch -c feature/avatar</code>, commit a new file, and run a bare <code>git push</code>. Read the "no upstream branch" message to the end — it tells you the fix.</li><li><code>git push -u origin feature/avatar</code>. Commit once more, then <code>git status -sb</code> and <code>git log --oneline @{u}..HEAD</code> before pushing again.</li><li>Tag your work: <code>git tag -a v0.1 -m "Bản nộp thử"</code>, then <code>git push</code> and <code>git ls-remote --tags origin</code>. Empty? Now <code>git push origin v0.1</code> and list the tags again.</li><li>In <code>../ban-cung-nhom</code> run <code>git fetch</code> so it knows the branch exists. Back in <code>thu-git</code>: <code>git switch main</code> and <code>git push origin --delete feature/avatar</code>.</li><li>In <code>../ban-cung-nhom</code>: <code>git branch -a</code> (the dead branch is still listed), then <code>git fetch --prune</code> and <code>git branch -a</code> again.</li></ol>
<pre><code>git push origin v1.0</code></pre>
<div class="out">To ../server.git
 * [new tag]         v1.0 -&gt; v1.0</div>
<p>(Real output from our test repository — it had printed "Everything up-to-date" for the plain <code>git push</code> just before.)</p>
<p><strong>Done when:</strong> <code>git ls-remote --tags origin</code> lists <code>refs/tags/v0.1</code>, and after <code>git fetch --prune</code> the teammate clone no longer shows <code>remotes/origin/feature/avatar</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Upstream branch</span><span class="v">The remote branch your local branch is linked to (set by <code>-u</code>); <code>@{u}</code> is its shorthand.</span></div>
  <div class="kv"><span class="k">Rejected (fetch first)</span><span class="v">The server has commits you have never downloaded. Integrate, then push.</span></div>
  <div class="kv"><span class="k">Non-fast-forward</span><span class="v">Your push would not simply move the server's branch forward — because of unintegrated work or rewritten history.</span></div>
  <div class="kv"><span class="k">Annotated tag</span><span class="v">A tag object with a message, author and date (<code>git tag -a</code>); the kind <code>--follow-tags</code> pushes.</span></div>
  <div class="kv"><span class="k">Prune</span><span class="v">Deleting local <code>origin/*</code> refs whose branches no longer exist on the server.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A push uploads objects and asks the server to move one ref — the server may refuse.</li><li><code>-u</code> links a branch to its upstream once, so plain <code>push</code>, <code>pull</code> and <code>status</code> work.</li><li>"fetch first" and "non-fast-forward" both usually mean: integrate first, never <code>--force</code> on a shared branch.</li><li>Tags travel only when you push them by name or with <code>--follow-tags</code>.</li><li>Delete merged branches on the server with <code>--delete</code>, and prune the stale refs on every machine.</li></ul>

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
${slide('git-05', 11, 'push -u nối nhánh với upstream')}
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
${slide('git-05', 12, 'Push bị từ chối: fetch first và non-fast-forward')}
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
<div class="callout warn"><strong>"non-fast-forward" không phải lúc nào cũng có nghĩa là bạn đã viết lại lịch sử.</strong> Git chọn câu chữ theo thứ máy bạn đã có. Output thật từ kho thử, cùng một tình huống hai lần — An đã push, Cường có một commit của riêng mình:
<div class="out"><span class="tok-comment"># trước khi fetch:</span>
 ! [rejected]        main -&gt; main (fetch first)
<span class="tok-comment"># sau "git fetch", nhưng chưa merge hay rebase:</span>
 ! [rejected]        main -&gt; main (non-fast-forward)</div>
Vậy "đã fetch mà chưa tích hợp" cũng hiện ra là non-fast-forward (không tua thẳng được). Xem <code>git status</code> trước khi nghĩ tới <code>--force-with-lease</code>: nếu nó nói <em>diverged</em> và bạn chưa hề rebase hay amend, câu trả lời vẫn là <code>git pull --rebase</code>, không phải force.</div>

<h3>Push sang một tên khác, và xoá</h3>
${slide('git-05', 13, 'Xoá nhánh trên máy chủ, rồi fetch --prune')}
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
${slide('git-05', 14, 'Tag không tự đi theo commit')}
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong <code>thu-git</code> (có máy chủ giả từ bài 5.1): <code>git switch -c feature/avatar</code>, commit một file mới, rồi chạy <code>git push</code> trần. Đọc hết thông báo "no upstream branch" — nó chỉ luôn cách sửa.</li><li><code>git push -u origin feature/avatar</code>. Commit thêm một lần, rồi <code>git status -sb</code> và <code>git log --oneline @{u}..HEAD</code> trước khi push tiếp.</li><li>Gắn tag: <code>git tag -a v0.1 -m "Bản nộp thử"</code>, rồi <code>git push</code> và <code>git ls-remote --tags origin</code>. Trống trơn? Giờ <code>git push origin v0.1</code> và liệt kê tag lần nữa.</li><li>Trong <code>../ban-cung-nhom</code> chạy <code>git fetch</code> để nó biết nhánh tồn tại. Quay lại <code>thu-git</code>: <code>git switch main</code> rồi <code>git push origin --delete feature/avatar</code>.</li><li>Trong <code>../ban-cung-nhom</code>: <code>git branch -a</code> (nhánh đã chết vẫn còn trong danh sách), rồi <code>git fetch --prune</code> và <code>git branch -a</code> lần nữa.</li></ol>
<pre><code>git push origin v1.0</code></pre>
<div class="out">To ../server.git
 * [new tag]         v1.0 -&gt; v1.0</div>
<p>(Output thật từ kho thử — ngay trước đó, <code>git push</code> trần chỉ in "Everything up-to-date".)</p>
<p><strong>Đạt khi:</strong> <code>git ls-remote --tags origin</code> liệt kê <code>refs/tags/v0.1</code>, và sau <code>git fetch --prune</code> bản clone của bạn cùng nhóm không còn hiện <code>remotes/origin/feature/avatar</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Upstream branch</span><span class="v">Nhánh thượng nguồn — nhánh trên remote mà nhánh cục bộ được nối vào (đặt bằng <code>-u</code>); viết tắt là <code>@{u}</code>.</span></div>
  <div class="kv"><span class="k">Rejected (fetch first)</span><span class="v">Bị từ chối (hãy fetch trước) — máy chủ có commit bạn chưa từng tải về. Tích hợp rồi mới push.</span></div>
  <div class="kv"><span class="k">Non-fast-forward</span><span class="v">Không tua thẳng được — lần push sẽ không chỉ đơn giản đẩy nhánh máy chủ lên trước, vì có việc chưa tích hợp hoặc lịch sử đã viết lại.</span></div>
  <div class="kv"><span class="k">Annotated tag</span><span class="v">Tag có chú thích — đối tượng tag có lời nhắn, tác giả, ngày (<code>git tag -a</code>); loại mà <code>--follow-tags</code> đẩy lên.</span></div>
  <div class="kv"><span class="k">Prune</span><span class="v">Tỉa — xoá các ref <code>origin/*</code> trên máy bạn khi nhánh tương ứng không còn trên máy chủ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Push tải đối tượng lên rồi xin máy chủ dời một ref — máy chủ có quyền từ chối.</li><li><code>-u</code> nối nhánh với upstream một lần, để <code>push</code>, <code>pull</code>, <code>status</code> trần chạy được.</li><li>"fetch first" và "non-fast-forward" thường cùng một nghĩa: tích hợp trước, không bao giờ <code>--force</code> lên nhánh chung.</li><li>Tag chỉ lên máy chủ khi bạn push nó theo tên hoặc bằng <code>--follow-tags</code>.</li><li>Xoá nhánh đã merge trên máy chủ bằng <code>--delete</code>, và tỉa ref cũ ở mọi máy.</li></ul>

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
${slide('git-05', 15, 'Tam giác upstream — origin — máy bạn')}
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
${slide('git-05', 16, 'Đồng bộ fork từ upstream')}
<p>A fork does not update itself. A week later, <code>origin/main</code> is a week behind the real project — and branching from it produces a pull request full of conflicts.</p>
<pre><code>git fetch upstream
git switch main
git merge --ff-only upstream/main    <span class="tok-comment"># fails loudly if you ever committed to your main</span>
git push origin main                  <span class="tok-comment"># update your fork on GitHub too</span></code></pre>
<div class="callout warn"><strong>Your fork's <code>git status</code> will not warn you.</strong> It compares <code>main</code> with <code>origin/main</code> — your fork — and your fork is exactly as stale as you are. Real output from a test fork, after the original project had received two new commits:
<div class="out">$ git status -sb
## main...origin/main
$ git fetch upstream
$ git log --oneline main..upstream/main
10655e6 perf(feed): phân trang
c55a330 fix(feed): tác giả null</div>
"Up to date" and two commits behind, at the same time. Only <code>upstream/main</code> tells the truth, and only after <code>git fetch upstream</code>. On the GitHub website the <strong>Sync fork</strong> button on your fork does the same merge for you.</div>
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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Fake the Fork button locally, next to <code>thu-git</code>: <code>git clone --bare ../thu-git-server.git ../fork.git</code> (this is "your fork on GitHub"), then <code>git clone ../fork.git ../thu-fork</code> and <code>cd ../thu-fork</code>.</li><li>Add the original as <code>upstream</code> and make pushing to it impossible: <code>git remote add upstream ../thu-git-server.git</code>, <code>git remote set-url --push upstream DISABLED</code>, then <code>git remote -v</code>.</li><li>Play the maintainer: in <code>thu-git</code> make two commits on <code>main</code> and <code>git push</code> them to <code>thu-git-server.git</code>.</li><li>In <code>thu-fork</code>: <code>git status -sb</code> (it claims you are up to date), <code>git fetch upstream</code>, <code>git log --oneline main..upstream/main</code>, <code>git merge --ff-only upstream/main</code>, <code>git push origin main</code>.</li><li>Start a contribution: <code>git switch -c fix/readme</code>, commit, <code>git push -u origin fix/readme</code>. Then try <code>git push upstream fix/readme</code> and read the error.</li></ol>
<pre><code>git push upstream main</code></pre>
<div class="out">fatal: 'DISABLED' does not appear to be a git repository
fatal: Could not read from remote repository.</div>
<p><strong>Done when:</strong> <code>git log --oneline main..upstream/main</code> prints nothing after the sync, <code>git remote -v</code> shows <code>upstream  DISABLED (push)</code>, and the push to upstream fails with the message above.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Fork</span><span class="v">A server-side copy of someone else's repository under your own account, which you can push to.</span></div>
  <div class="kv"><span class="k">upstream</span><span class="v">By convention, the remote name for the original project. You fetch from it; you never push to it.</span></div>
  <div class="kv"><span class="k">origin (in a fork)</span><span class="v">Your fork — where your branches go and where pull requests come from.</span></div>
  <div class="kv"><span class="k">Pull request</span><span class="v">A request for the maintainer to merge a branch from your fork into the original project.</span></div>
  <div class="kv"><span class="k">Maintainer</span><span class="v">A person with write access to the original project who reviews and merges contributions.</span></div>
  <div class="kv"><span class="k">Sync fork</span><span class="v">Bringing your fork's <code>main</code> up to date with <code>upstream/main</code> — by command or with the GitHub button.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>No write access? Fork, clone your fork (<code>origin</code>), add the original as <code>upstream</code>.</li><li>Fetch from upstream, push to origin, and ask upstream for your change with a pull request.</li><li>A fork never updates itself, and its <code>git status</code> cannot tell you it is behind.</li><li>Sync <code>main</code> with <code>git merge --ff-only upstream/main</code> before every new branch.</li><li>One branch per idea, never work on the fork's <code>main</code>, and read CONTRIBUTING.md first.</li></ul>

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
${slide('git-05', 15, 'Tam giác upstream — origin — máy bạn')}
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
${slide('git-05', 16, 'Đồng bộ fork từ upstream')}
<p>Một fork không tự cập nhật. Một tuần sau, <code>origin/main</code> đã đi sau dự án thật một tuần — và tạo nhánh từ đó sinh ra một pull request đầy xung đột.</p>
<pre><code>git fetch upstream
git switch main
git merge --ff-only upstream/main    <span class="tok-comment"># báo lỗi ầm ĩ nếu bạn từng commit vào main của mình</span>
git push origin main                  <span class="tok-comment"># cập nhật luôn fork của bạn trên GitHub</span></code></pre>
<div class="callout warn"><strong><code>git status</code> trong fork sẽ không cảnh báo bạn.</strong> Nó so <code>main</code> với <code>origin/main</code> — tức là fork của bạn — mà fork thì cũ đúng bằng bạn. Output thật từ một fork thử, sau khi dự án gốc có thêm hai commit:
<div class="out">$ git status -sb
## main...origin/main
$ git fetch upstream
$ git log --oneline main..upstream/main
10655e6 perf(feed): phân trang
c55a330 fix(feed): tác giả null</div>
Vừa "up to date" vừa chậm hai commit, cùng một lúc. Chỉ <code>upstream/main</code> nói thật, và chỉ sau <code>git fetch upstream</code>. Trên web GitHub, nút <strong>Sync fork</strong> trong trang fork của bạn làm đúng lần merge này hộ bạn.</div>
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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Giả lập nút Fork ngay trên máy, cạnh <code>thu-git</code>: <code>git clone --bare ../thu-git-server.git ../fork.git</code> (đây là "fork của bạn trên GitHub"), rồi <code>git clone ../fork.git ../thu-fork</code> và <code>cd ../thu-fork</code>.</li><li>Thêm kho gốc làm <code>upstream</code> và khoá luôn đường push vào nó: <code>git remote add upstream ../thu-git-server.git</code>, <code>git remote set-url --push upstream DISABLED</code>, rồi <code>git remote -v</code>.</li><li>Đóng vai người bảo trì: trong <code>thu-git</code> tạo hai commit trên <code>main</code> và <code>git push</code> lên <code>thu-git-server.git</code>.</li><li>Trong <code>thu-fork</code>: <code>git status -sb</code> (nó bảo bạn đang cập nhật), <code>git fetch upstream</code>, <code>git log --oneline main..upstream/main</code>, <code>git merge --ff-only upstream/main</code>, <code>git push origin main</code>.</li><li>Bắt đầu một đóng góp: <code>git switch -c fix/readme</code>, commit, <code>git push -u origin fix/readme</code>. Rồi thử <code>git push upstream fix/readme</code> và đọc lỗi.</li></ol>
<pre><code>git push upstream main</code></pre>
<div class="out">fatal: 'DISABLED' does not appear to be a git repository
fatal: Could not read from remote repository.</div>
<p><strong>Đạt khi:</strong> sau khi đồng bộ, <code>git log --oneline main..upstream/main</code> không in gì, <code>git remote -v</code> hiện <code>upstream  DISABLED (push)</code>, và lần push vào upstream thất bại với thông báo như trên.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Fork</span><span class="v">Bản rẽ — bản sao trên máy chủ của kho người khác, đặt dưới tài khoản của bạn, bạn push vào được.</span></div>
  <div class="kv"><span class="k">upstream</span><span class="v">Kho gốc — theo quy ước, tên remote trỏ tới dự án gốc. Bạn fetch từ nó, không bao giờ push vào nó.</span></div>
  <div class="kv"><span class="k">origin (trong fork)</span><span class="v">Fork của bạn — nơi nhánh của bạn được đẩy lên và nơi pull request xuất phát.</span></div>
  <div class="kv"><span class="k">Pull request</span><span class="v">Yêu cầu hợp nhất — đề nghị người bảo trì merge một nhánh từ fork của bạn vào dự án gốc.</span></div>
  <div class="kv"><span class="k">Maintainer</span><span class="v">Người bảo trì — người có quyền ghi vào dự án gốc, review và merge đóng góp.</span></div>
  <div class="kv"><span class="k">Sync fork</span><span class="v">Đồng bộ fork — đưa <code>main</code> của fork lên bằng <code>upstream/main</code>, bằng lệnh hoặc bằng nút trên GitHub.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Không có quyền ghi? Fork, clone fork của mình (<code>origin</code>), thêm kho gốc làm <code>upstream</code>.</li><li>Lấy về từ upstream, đẩy lên origin, và xin upstream nhận thay đổi bằng pull request.</li><li>Fork không bao giờ tự cập nhật, và <code>git status</code> của nó không thể báo bạn đang chậm.</li><li>Đồng bộ <code>main</code> bằng <code>git merge --ff-only upstream/main</code> trước mỗi nhánh mới.</li><li>Mỗi ý tưởng một nhánh, không làm việc trên <code>main</code> của fork, và đọc CONTRIBUTING.md trước.</li></ul>

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
      description: 'Mười tình huống thật về remote: origin/main là ảnh chụp, fetch an toàn, git pull khi hai bên phân ly, token thay mật khẩu, credential helper, push -u, lời từ chối fetch first, tag không tự đi theo, và quy trình fork/upstream.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from real team work with a shared GitHub repository — most of them are decided by one question: is Git looking at the server right now, or at your last snapshot of it? Read every explanation after submitting, especially for the ones you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain the difference between <code>main</code>, <code>origin/main</code> and <code>main</code> on the server.</li>
<li>I know which network command can never break anything, and which one can create a merge commit.</li>
<li>I know what modern <code>git pull</code> does when my branch and the server have diverged, and how <code>pull.ff only</code> changes it.</li>
<li>I can tell an SSH problem from a token problem by reading the error message.</li>
<li>I can read "(fetch first)" and "(non-fast-forward)" and respond without <code>--force</code>.</li>
<li>I can set up <code>origin</code> + <code>upstream</code> for a fork and bring a stale fork up to date.</li>
</ul>
${slide('git-05', 17, 'Bảng tra nhanh Chương 5')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ việc nhóm thật với một kho GitHub chung — phần lớn được quyết định bởi một câu hỏi: lúc này Git đang nhìn máy chủ, hay đang nhìn ảnh chụp lần trước của bạn? Đọc mọi phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được <code>main</code>, <code>origin/main</code> và <code>main</code> trên máy chủ khác nhau thế nào.</li>
<li>Tôi biết lệnh mạng nào không bao giờ làm hỏng gì, và lệnh nào có thể tạo commit hợp nhất.</li>
<li>Tôi biết <code>git pull</code> bây giờ làm gì khi nhánh của tôi và máy chủ đã phân ly, và <code>pull.ff only</code> đổi điều đó thế nào.</li>
<li>Tôi đọc thông báo lỗi là phân biệt được lỗi SSH với lỗi token.</li>
<li>Tôi đọc được "(fetch first)" và "(non-fast-forward)" và xử lý mà không cần <code>--force</code>.</li>
<li>Tôi dựng được <code>origin</code> + <code>upstream</code> cho một fork và đưa một fork cũ lên bằng dự án gốc.</li>
</ul>
${slide('git-05', 17, 'Bảng tra nhanh Chương 5')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Back after a week off, you run git log --oneline origin/main and see nothing new. An says he pushed three commits to main yesterday. What is going on?|||Nghỉ một tuần quay lại, bạn chạy git log --oneline origin/main và không thấy gì mới. An bảo hôm qua cậu ấy đã push ba commit lên main. Chuyện gì đang xảy ra?',
            options: [
              'GitHub hides commits from other people until a pull request is merged|||GitHub giấu commit của người khác cho tới khi pull request được merge',
              'origin/main is your local snapshot and only moves on fetch, pull or push — you have not fetched|||origin/main là ảnh chụp trên máy bạn, chỉ dịch khi fetch, pull hoặc push — bạn chưa fetch',
              'An’s push must have failed, because origin/main always shows the server|||Lần push của An chắc đã hỏng, vì origin/main luôn hiện đúng máy chủ',
              'git log only lists commits you wrote yourself|||git log chỉ liệt kê commit do chính bạn viết',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: origin/main is a remote-tracking branch: a record on YOUR disk of where main was the last time you talked to the server. Nothing updates it until you fetch, pull or push, so after a week it shows a week-old picture without any warning. The tempting answer is "An’s push failed" — but that assumes origin/main is live, which is exactly the misunderstanding. Run git fetch, then look again.|||VI: origin/main là nhánh theo dõi remote: bản ghi trên ĐĨA CỦA BẠN về chỗ main nằm ở lần cuối bạn nói chuyện với máy chủ. Không gì cập nhật nó cho tới khi bạn fetch, pull hoặc push, nên sau một tuần nó cho xem bức tranh cũ một tuần mà không cảnh báo gì. Đáp án hấp dẫn là "push của An hỏng" — nhưng nó giả định origin/main là bản trực tiếp, đúng cái hiểu lầm cần bỏ. Chạy git fetch rồi nhìn lại.',
          },
          {
            question: 'You are halfway through editing three files (nothing committed) and want to see what the team pushed, without any risk to your work. Which command?|||Bạn đang sửa dở ba file (chưa commit gì) và muốn xem cả nhóm đã push gì, không được có rủi ro gì cho việc đang làm. Lệnh nào?',
            options: [
              'git pull',
              'git pull --rebase',
              'git merge origin/main',
              'git fetch',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: git fetch downloads commits and moves only origin/* refs; your branch, index and working directory are untouched, so it cannot conflict or interrupt anything. Afterwards git log --oneline main..origin/main shows what arrived. git pull --rebase sounds careful but it is fetch PLUS a rebase of your branch — and with uncommitted edits it refuses or makes you stash first. The other two also change your branch.|||VI: git fetch tải commit về và chỉ dời các ref origin/*; nhánh, Index và thư mục làm việc của bạn không bị đụng, nên nó không thể xung đột hay cắt ngang gì. Sau đó git log --oneline main..origin/main cho thấy thứ vừa về. git pull --rebase nghe có vẻ cẩn thận nhưng nó là fetch CỘNG rebase nhánh của bạn — mà đang có phần sửa chưa commit thì nó từ chối hoặc bắt bạn stash trước. Hai phương án còn lại cũng đổi nhánh của bạn.',
          },
          {
            question: 'Git 2.51, no pull.rebase or pull.ff configured. You have one local commit and the server has one commit you do not have. You run git pull. What happens?|||Git 2.51, chưa cấu hình pull.rebase hay pull.ff. Bạn có một commit cục bộ và máy chủ có một commit bạn chưa có. Bạn chạy git pull. Chuyện gì xảy ra?',
            options: [
              'It stops with "fatal: Need to specify how to reconcile divergent branches" and changes nothing|||Nó dừng với "fatal: Need to specify how to reconcile divergent branches" và không đổi gì',
              'It silently creates a merge commit, as older tutorials show|||Nó âm thầm tạo một commit hợp nhất, như các hướng dẫn cũ',
              'It rebases your commit automatically on top of the server’s|||Nó tự động rebase commit của bạn lên trên commit của máy chủ',
              'It replaces your local commit with the server’s version|||Nó thay commit cục bộ của bạn bằng phiên bản của máy chủ',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: This is real output from the chapter’s test repository: with divergent branches and no configured preference, modern Git refuses and lists pull.rebase false / pull.rebase true / pull.ff only for you to choose. The silent merge commit is what older Git did (and what old tutorials still show), so it is the most tempting wrong answer. Nothing is ever replaced; set git config --global pull.ff only once and choose --rebase or --no-rebase deliberately.|||VI: Đây là output thật từ kho thử của chương: hai nhánh phân ly mà chưa cấu hình gì thì Git bây giờ từ chối và liệt kê pull.rebase false / pull.rebase true / pull.ff only cho bạn chọn. Commit hợp nhất âm thầm là cách Git cũ làm (và hướng dẫn cũ vẫn chiếu), nên đó là đáp án sai hấp dẫn nhất. Không có gì bị thay thế cả; đặt git config --global pull.ff only một lần rồi tự chọn --rebase hoặc --no-rebase có chủ ý.',
          },
          {
            question: 'Pushing over HTTPS, Git asks for a password. You type your GitHub account password and get "remote: Invalid username or token. Password authentication is not supported for Git operations." What is the fix?|||Push qua HTTPS, Git hỏi mật khẩu. Bạn gõ mật khẩu tài khoản GitHub và nhận "remote: Invalid username or token. Password authentication is not supported for Git operations." Sửa thế nào?',
            options: [
              'Reset your GitHub password and try again|||Đặt lại mật khẩu GitHub rồi thử lại',
              'Put the password in the URL: https://user:password@github.com/…|||Đặt mật khẩu vào URL: https://user:password@github.com/…',
              'Paste a personal access token (Contents: read and write) instead, or switch the remote to SSH|||Dán một personal access token (Contents: read and write) vào thay, hoặc đổi remote sang SSH',
              'Turn on two-factor authentication so the password is accepted|||Bật xác thực hai lớp để mật khẩu được chấp nhận',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: GitHub stopped accepting account passwords for Git on 13 August 2021; the message says so literally. Over HTTPS the "password" must be a token — ideally fine-grained, limited to the repository, with Contents: read and write — or you move the remote to SSH with git remote set-url. Resetting the password is tempting because it "feels" like a wrong password, but no password works here. The URL trick still fails and additionally leaks the secret into .git/config.|||VI: GitHub ngừng nhận mật khẩu tài khoản cho Git từ 13/08/2021; thông báo nói thẳng ra như thế. Qua HTTPS, "mật khẩu" phải là token — tốt nhất là fine-grained, giới hạn đúng kho, có Contents: read and write — hoặc bạn đổi remote sang SSH bằng git remote set-url. Đặt lại mật khẩu hấp dẫn vì nó "trông như" sai mật khẩu, nhưng ở đây mật khẩu nào cũng không dùng được. Mẹo nhét vào URL vẫn hỏng và còn làm lộ bí mật vào .git/config.',
          },
          {
            question: 'A teammate saved his token on a shared lab computer with git config --global credential.helper store "so it stops asking". What is the real risk?|||Một bạn cùng nhóm lưu token trên máy phòng lab dùng chung bằng git config --global credential.helper store "cho nó thôi hỏi". Rủi ro thật là gì?',
            options: [
              'The token sits in plain text in ~/.git-credentials, readable by anyone using that account|||Token nằm dạng chữ thô trong ~/.git-credentials, ai dùng tài khoản máy đó cũng đọc được',
              'store deletes the token after one hour, so pushes will fail later|||store xoá token sau một giờ, nên lát nữa push sẽ hỏng',
              'store only works on Linux, so the lab Windows machines will ignore it|||store chỉ chạy trên Linux, nên máy Windows trong lab sẽ bỏ qua nó',
              'store attaches the token to every commit, so it becomes public on GitHub|||store gắn token vào mọi commit, nên nó bị công khai trên GitHub',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Despite the reassuring name, the store helper writes the credential unencrypted to ~/.git-credentials. On a shared machine anyone who opens that account can copy it and push as your teammate until the token expires. The one-hour option is a different helper (cache --timeout=3600), which is why the second answer sounds plausible. Use the OS keychain (osxkeychain, Git Credential Manager, libsecret) — and on a shared machine, a short-lived token or none at all.|||VI: Tên nghe yên tâm nhưng helper store ghi thông tin đăng nhập KHÔNG mã hoá vào ~/.git-credentials. Trên máy dùng chung, ai mở tài khoản đó cũng chép được và push dưới tên bạn ấy cho tới khi token hết hạn. Lựa chọn "một giờ" là của một helper khác (cache --timeout=3600), vì thế phương án thứ hai nghe có lý. Hãy dùng keychain của hệ điều hành (osxkeychain, Git Credential Manager, libsecret) — còn trên máy dùng chung thì dùng token hạn ngắn hoặc đừng lưu gì.',
          },
          {
            question: 'First push of a new branch: "fatal: The current branch feature/avatar has no upstream branch." What is the right command?|||Lần push đầu của một nhánh mới: "fatal: The current branch feature/avatar has no upstream branch." Lệnh đúng là gì?',
            options: [
              'git push --force',
              'git push -u origin feature/avatar',
              'git pull, then git push',
              'git branch --set-upstream-to=origin/main',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: The branch does not exist on the server yet, so there is nothing to link to. git push -u origin feature/avatar creates it and records the link, after which plain push, pull and status work (git config --global push.autoSetupRemote true makes this automatic). --set-upstream-to=origin/main is the tempting one because it also "sets an upstream" — but to main, so your next git push would try to send the feature into main. Force and pull do not address the missing link at all.|||VI: Nhánh chưa tồn tại trên máy chủ nên chưa có gì để nối. git push -u origin feature/avatar tạo nó và ghi lại mối nối, sau đó push, pull, status trần đều chạy (git config --global push.autoSetupRemote true làm việc này tự động). --set-upstream-to=origin/main là phương án hấp dẫn vì nó cũng "đặt upstream" — nhưng là main, nên lần git push sau sẽ cố đẩy tính năng vào main. Force và pull chẳng giải quyết chuyện thiếu mối nối.',
          },
          {
            question: 'Ten minutes before the SWP391 demo, your push to the shared main is rejected with "! [rejected] main -> main (fetch first)". What do you do?|||Mười phút trước buổi demo SWP391, lần push lên main chung bị từ chối với "! [rejected] main -> main (fetch first)". Bạn làm gì?',
            options: [
              'git push --force, since the demo is more important|||git push --force, vì demo quan trọng hơn',
              'git push --force-with-lease, the safe kind of force|||git push --force-with-lease, loại force an toàn',
              'Delete main on the server and push yours again|||Xoá main trên máy chủ rồi push lại bản của bạn',
              'git pull --rebase, run the app, then git push|||git pull --rebase, chạy thử ứng dụng, rồi git push',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: "fetch first" means a teammate pushed commits you have never downloaded. Integrate them (pull --rebase keeps history straight), check the app still runs, then push. --force-with-lease is the tempting answer because it is "safe force", but it is still a force: it only protects you when your origin/main is current — and after a successful fetch it would overwrite your teammate’s commits. Plain --force and deleting main destroy their work outright.|||VI: "fetch first" nghĩa là bạn cùng nhóm đã push những commit bạn chưa từng tải về. Tích hợp chúng (pull --rebase giữ lịch sử thẳng), kiểm ứng dụng vẫn chạy, rồi push. --force-with-lease là đáp án hấp dẫn vì nó là "force an toàn", nhưng nó vẫn là force: nó chỉ bảo vệ bạn khi origin/main của bạn còn mới — và sau một lần fetch thành công, nó sẽ ghi đè commit của bạn cùng nhóm. --force trần và xoá main thì huỷ việc của họ luôn.',
          },
          {
            question: 'You run git tag -a v1.0 -m "Final", then git push. The GitHub Actions workflow that runs on tags does not start, and git ls-remote --tags origin prints nothing. Why?|||Bạn chạy git tag -a v1.0 -m "Final", rồi git push. Workflow GitHub Actions chạy theo tag không khởi động, và git ls-remote --tags origin không in gì. Vì sao?',
            options: [
              'Tags can only be created in the GitHub Releases page|||Tag chỉ tạo được trên trang GitHub Releases',
              'Annotated tags cannot be pushed; only lightweight tags can|||Tag có chú thích không push được; chỉ tag nhẹ mới push được',
              'A plain git push sends branches, not tags — run git push origin v1.0 or use --follow-tags|||git push trần chỉ gửi nhánh, không gửi tag — chạy git push origin v1.0 hoặc dùng --follow-tags',
              'The workflow is broken; tags always travel with the commit they point to|||Workflow bị hỏng; tag luôn đi theo commit mà nó trỏ tới',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Tags are refs of their own. In the chapter’s test repository the plain git push printed "Everything up-to-date" and ls-remote showed no tags until git push origin v1.0 printed "* [new tag] v1.0 -> v1.0". Blaming the workflow is tempting because the symptom appears in CI, but the tag was never on the server. --follow-tags pushes annotated tags reachable from what you push — so annotated tags are, if anything, the easier kind to push.|||VI: Tag là ref riêng. Trong kho thử của chương, git push trần in "Everything up-to-date" và ls-remote không có tag nào cho tới khi git push origin v1.0 in ra "* [new tag] v1.0 -> v1.0". Đổ lỗi cho workflow là hấp dẫn vì triệu chứng hiện ra ở CI, nhưng tag chưa bao giờ lên máy chủ. --follow-tags đẩy các tag có chú thích với tới được từ thứ bạn push — nên tag có chú thích, nếu có gì, còn là loại dễ push hơn.',
          },
          {
            question: 'You want to fix a bug in an open-source library you cannot push to. You forked it, cloned your fork (origin) and added the original as upstream. Where does your fix branch go, and how does it reach the project?|||Bạn muốn sửa một lỗi trong thư viện mã nguồn mở mà bạn không có quyền push. Bạn đã fork, clone fork của mình (origin) và thêm kho gốc làm upstream. Nhánh sửa lỗi đi đâu, và làm sao tới được dự án?',
            options: [
              'Push it to upstream, then open a pull request on your fork|||Push lên upstream, rồi mở pull request trên fork của bạn',
              'Push it to origin, then merge it into upstream yourself|||Push lên origin, rồi tự merge nó vào upstream',
              'Push it straight to upstream; the fork is only a backup|||Push thẳng lên upstream; fork chỉ là bản dự phòng',
              'Push it to origin (your fork), then open a pull request from that branch into upstream’s main|||Push lên origin (fork của bạn), rồi mở pull request từ nhánh đó vào main của upstream',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The triangle: fetch from upstream, push to origin, ask upstream to take the change with a pull request from your-fork:branch into upstream:main. You have no write access to upstream, so every answer that pushes there fails (the chapter’s practice even sets its push URL to DISABLED to make that explicit). "Merge it into upstream yourself" is tempting because it sounds like the last step — but merging is the maintainer’s decision, not yours.|||VI: Tam giác: lấy về từ upstream, đẩy lên origin, xin upstream nhận thay đổi bằng pull request từ fork-của-bạn:nhánh vào upstream:main. Bạn không có quyền ghi vào upstream, nên mọi phương án push vào đó đều hỏng (phần thực hành của chương còn đặt URL push của nó thành DISABLED cho rõ). "Tự merge vào upstream" hấp dẫn vì nghe như bước cuối — nhưng merge là quyết định của người bảo trì, không phải của bạn.',
          },
          {
            question: 'In your fork, git status -sb prints "## main...origin/main" (nothing ahead or behind), but the original project got 20 commits this week. What should you do before creating your next branch?|||Trong fork của bạn, git status -sb in "## main...origin/main" (không ahead cũng không behind), nhưng dự án gốc có thêm 20 commit tuần này. Bạn nên làm gì trước khi tạo nhánh kế tiếp?',
            options: [
              'git fetch upstream, git merge --ff-only upstream/main, git push origin main — then branch|||git fetch upstream, git merge --ff-only upstream/main, git push origin main — rồi mới tạo nhánh',
              'Nothing — git status says main is up to date|||Không làm gì — git status nói main đã cập nhật',
              'git pull, which updates main from the original project|||git pull, lệnh này cập nhật main từ dự án gốc',
              'Delete the fork on GitHub and fork again every time|||Xoá fork trên GitHub rồi fork lại mỗi lần',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: git status compares main with origin/main — your fork, which is just as stale as you are (the chapter’s test fork showed "## main...origin/main" while two upstream commits were missing). Only upstream/main, after git fetch upstream, tells the truth. Plain git pull is the tempting answer, but main tracks origin (your fork), so it fetches from the fork and brings nothing new. Re-forking works but throws away your branches and pull-request history; the Sync fork button on GitHub is the web equivalent of the correct answer.|||VI: git status so main với origin/main — tức là fork của bạn, thứ cũ đúng bằng bạn (fork thử của chương hiện "## main...origin/main" trong khi đang thiếu hai commit của upstream). Chỉ upstream/main, sau git fetch upstream, mới nói thật. git pull trần là đáp án hấp dẫn, nhưng main theo dõi origin (fork của bạn), nên nó kéo từ fork về và chẳng mang gì mới. Fork lại thì được nhưng vứt mất nhánh và lịch sử pull request; nút Sync fork trên GitHub là bản web của đáp án đúng.',
          },
        ],
      },
    },
  ],
};
