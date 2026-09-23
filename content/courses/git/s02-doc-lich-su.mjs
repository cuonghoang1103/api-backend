/**
 * Git & GitHub — Chương 2: Đọc lịch sử — khảo cổ trên chính kho mã của bạn.
 * git log và các cờ đáng dùng · show/diff giữa hai commit · blame và cái cuốc chim (-S/-G)
 * · bisect (tìm nhị phân ra commit gây lỗi) · grep + --follow.
 * Output CHẠY THẬT git 2.43. LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;;
 * & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 2 — Reading history: archaeology on your own code|||Chương 2 — Đọc lịch sử: khảo cổ trên chính mã của bạn',
  description: 'Lịch sử của một kho mã là tài liệu chi tiết nhất bạn có về dự án — nếu bạn đọc được nó. Chương này biến git log thành công cụ điều tra: lọc theo tác giả/ngày/đường dẫn, đọc một commit, truy vết một dòng về tận nguồn gốc, tìm commit đã xoá một hàm, và dùng bisect để khoanh vùng lỗi trong hàng nghìn commit chỉ với vài bước.',
  lessons: [
    /* ─────────────────────────── 2.0 ─────────────────────────── */
    {
      title: '2.0 — Chapter 2 slides: reading history in pictures|||2.0 — Slide Chương 2: đọc lịch sử bằng hình',
      slug: 'git-2-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 18 slide của Chương 2: lọc git log, khoảng hai chấm/ba chấm, git show, đọc file ở quá khứ, blame, cái cuốc chim, --follow, bisect và một cuộc điều tra thật — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Slides</span>
<h2>The whole chapter in 18 slides</h2>
<p class="lead">Skim these before the lessons to see what each tool is for, then come back after the quiz as a revision sheet. Every terminal on these slides is real output from one small practice repository, so the hashes line up from slide to slide: the commit that blame points at is the same one bisect finds.</p>
<p>The slides are in Vietnamese; the commit graphs, terminals and the bisect diagram read the same in any language. The last two slides are a cheat sheet and a 30-minute practice session for the whole chapter.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Slide</span>
<h2>Cả chương trong 18 slide</h2>
<p class="lead">Lướt qua bộ này trước khi vào bài để biết mỗi công cụ dùng vào việc gì, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mọi terminal trên slide đều là output thật của cùng một kho thử nhỏ, nên mã băm khớp nhau từ slide này sang slide khác: commit mà blame chỉ vào cũng chính là commit bisect tìm ra.</p>
<p>Hai slide cuối là bảng tra nhanh và một buổi thực hành 30 phút cho cả chương — làm xong buổi đó là bạn đã nắm chắc Chương 2.</p>
</div>
${gallery('git-02', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'git log: nén rồi lọc'], [4, 'Khoảng hai chấm trong git log'],
  [5, 'log --graph: chữ và hình'], [6, 'git show: một commit trọn vẹn'], [7, 'commit:đường-dẫn — file ở quá khứ'],
  [8, 'diff hai chấm vs ba chấm'], [9, 'git blame: bốn cột'], [10, 'blame -w xuyên commit prettier'], [11, 'Cái cuốc chim -S và -G'],
  [12, '--follow qua lần đổi tên'], [13, 'bisect chia đôi'], [14, 'git bisect run'], [15, 'Cuộc điều tra năm lệnh'],
  [16, 'Hai ngã cụt'], [17, 'Bảng tra nhanh'], [18, 'Thực hành chương 2'],
])}
`,
    },

    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — git log: turning history into a query|||2.1 — git log: biến lịch sử thành một truy vấn',
      slug: 'git-2-1-git-log',
      type: 'LESSON',
      isFreePreview: true,
      description: 'git log trần thì vô dụng trên kho lớn; với các cờ lọc nó thành công cụ điều tra. Lọc theo tác giả, ngày, đường dẫn, nội dung lời nhắn; định dạng ra dạng đọc được; và vẽ đồ thị nhánh bằng chữ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Your repository is a database. git log is the query language.</h2>
<p class="lead">Most people run <code>git log</code>, see a wall of text, press <kbd>q</kbd>, and never come back. That is a waste of the single richest source of information about a codebase. With five flags, <code>git log</code> answers questions like "who last touched the payment code, and why?" in seconds.</p>

<h3>The default, and why it is unusable</h3>
<pre><code>git log</code></pre>
<div class="out">commit 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d
Author: Nguyen Van An &lt;an@example.com&gt;
Date:   Thu Aug 21 14:20:00 2026 +0700

    fix: reject expired refresh tokens on /auth/refresh</div>
<p>Six lines per commit. On a repository with 4,000 commits that is 24,000 lines. The first thing to learn is to compress it:</p>
<pre><code>git log --oneline -10</code></pre>
<div class="out">3f8a1c9 fix: reject expired refresh tokens on /auth/refresh
9e2d4b7 feat(auth): add refresh token rotation
1c5f8a3 test(auth): cover the expired-token path
7b3e9d1 refactor(api): extract pagination into a helper</div>

<h3>The five filters that do the real work</h3>
${slide('git-02', 3, 'git log: nén một dòng rồi lọc')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">-- &lt;path&gt;</span><span class="lz-v">Only commits that touched this file or directory. The most useful filter by a wide margin.</span></div>
  <div class="lz-layer"><span class="lz-k">--author=</span><span class="lz-v">Substring match on the author's name or email. <code>--author="An"</code> is enough.</span></div>
  <div class="lz-layer"><span class="lz-k">--since / --until</span><span class="lz-v">Accepts human dates: <code>"2 weeks ago"</code>, <code>"2026-08-01"</code>, <code>"yesterday"</code>.</span></div>
  <div class="lz-layer"><span class="lz-k">--grep=</span><span class="lz-v">Search the commit <em>message</em>. Combine with <code>-i</code> for case-insensitive.</span></div>
  <div class="lz-layer"><span class="lz-k">-S / -G</span><span class="lz-v">Search the <em>content of the changes</em> — the pickaxe. Lesson 2.3 is devoted to it.</span></div>
</div>
<pre><code><span class="tok-comment"># Everything that touched the auth module in the last month, by anyone:</span>
git log --oneline --since=<span class="tok-string">"1 month ago"</span> -- src/services/auth/

<span class="tok-comment"># Every commit An made that mentions "cache":</span>
git log --oneline --author=<span class="tok-string">"An"</span> --grep=<span class="tok-string">"cache"</span> -i

<span class="tok-comment"># What shipped between two releases:</span>
git log --oneline v1.4.0..v1.5.0</code></pre>
<div class="callout warn">Note the <code>--</code> before a path. It tells Git "everything after this is a file path, not a branch name". Without it, <code>git log auth</code> is ambiguous if a branch called <code>auth</code> also exists, and Git will refuse or guess wrong. Typing <code>--</code> is a cheap habit.</div>

<h3>Ranges: the two-dot and three-dot notation</h3>
${slide('git-02', 4, 'Hai chấm: cái gì có ở B mà A không có')}
<p><code>A..B</code> means "commits reachable from B but not from A" — in practice, "what is in B that is not in A". This is the single most useful shape in Git, and it appears again in <code>diff</code>, <code>rebase</code> and pull requests:</p>
<pre><code>git log --oneline main..feature/login   <span class="tok-comment"># what my branch adds on top of main</span>
git log --oneline feature/login..main   <span class="tok-comment"># what main has that I do not — do I need to merge?</span>
git log --oneline origin/main..main     <span class="tok-comment"># what I have locally that is not pushed yet</span>
git log --oneline main...feature/login  <span class="tok-comment"># three dots: commits unique to EITHER side</span></code></pre>
<div class="callout ok"><code>git log origin/main..main</code> answers "what am I about to push?" — worth running before every push. Its mirror, <code>git log main..origin/main</code>, answers "what did other people add that I have not pulled?" after a <code>git fetch</code>.</div>

<h3>Seeing the shape of history</h3>
${slide('git-02', 5, 'log --graph: chữ và hình của cùng một lịch sử')}
<pre><code>git log --oneline --graph --all --decorate -15</code></pre>
<div class="out">*   8c4f2a1 (HEAD -&gt; main, origin/main) Merge pull request #58 from feature/login
|\\
| * 3f8a1c9 (feature/login) fix: reject expired refresh tokens
| * 9e2d4b7 feat(auth): add refresh token rotation
|/
* 7b3e9d1 refactor(api): extract pagination into a helper
* 1c5f8a3 chore(deps): bump prisma to 6.2.0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--graph</span><span class="v">Draws the branch structure in ASCII down the left. The <code>|\\</code> is a merge: two lines of history joining.</span></div>
  <div class="kv"><span class="k">--all</span><span class="v">Include every branch, not just the one you are on. Without it you cannot see how branches relate.</span></div>
  <div class="kv"><span class="k">--decorate</span><span class="v">Show which branches and tags point where — <code>(HEAD -&gt; main, origin/main)</code>. On by default in recent Git.</span></div>
</div>
<p>You will type this constantly, so alias it (from 0.4):</p>
<pre><code>git config --global alias.lg <span class="tok-string">"log --oneline --graph --all --decorate -20"</span></code></pre>

<h3>Custom formats — when you need a report, not a browse</h3>
<pre><code>git log --pretty=format:<span class="tok-string">"%h %ad %an — %s"</span> --date=short -5</code></pre>
<div class="out">3f8a1c9 2026-08-21 Nguyen Van An — fix: reject expired refresh tokens
9e2d4b7 2026-08-20 Nguyen Van An — feat(auth): add refresh token rotation
1c5f8a3 2026-08-19 Tran Thi Binh — test(auth): cover the expired-token path</div>
<div class="kv-grid">
  <div class="kv"><span class="k">%h · %H</span><span class="v">Abbreviated hash · full hash.</span></div>
  <div class="kv"><span class="k">%an · %ae</span><span class="v">Author name · author email.</span></div>
  <div class="kv"><span class="k">%ad · %ar</span><span class="v">Author date (formatted by <code>--date=</code>) · relative date ("3 days ago").</span></div>
  <div class="kv"><span class="k">%s · %b</span><span class="v">Subject · body of the message.</span></div>
  <div class="kv"><span class="k">%d</span><span class="v">Ref names — the <code>(HEAD -&gt; main)</code> decoration.</span></div>
</div>

<h3>Two summaries worth knowing</h3>
<pre><code>git shortlog -sn --since=<span class="tok-string">"3 months ago"</span></code></pre>
<div class="out">   142  Nguyen Van An
    87  Tran Thi Binh
    12  dependabot[bot]</div>
<p>Commit counts per author. Useful for "who knows this codebase?" — and useless as a productivity metric, so do not use it as one.</p>
<pre><code>git log --stat -1</code></pre>
<div class="out">3f8a1c9 fix: reject expired refresh tokens on /auth/refresh
 src/services/auth.service.ts | 14 ++++++++++----
 src/services/auth.test.ts    | 32 ++++++++++++++++++++++++++++++++
 2 files changed, 42 insertions(+), 4 deletions(-)</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In your <code>thu-git</code> playground from Chapter 1, create a side branch with one commit: <code>git switch -c feature/avatar</code>, create <code>avatar.js</code> (one line is enough), <code>git add avatar.js &amp;&amp; git commit -m "feat(profile): add avatar helper"</code>, then <code>git switch main</code> (or <code>master</code> if that is your default branch).</li><li>Pretend a teammate pushed to main meanwhile: create <code>health.js</code>, add it, and commit with <code>git commit -m "feat(api): add /health route" --author="Tran Thi Binh &lt;binh@example.com&gt;"</code>.</li><li>Before running anything, <strong>write down</strong> what <code>git log --oneline main..feature/avatar</code> and <code>git log --oneline feature/avatar..main</code> will print. Then run both.</li><li>Run <code>git log --oneline --graph --all</code> and point at the fork with your finger. Then run <code>git log --oneline --author=Binh</code>.</li></ol>
<pre><code class="language-bash">git log --oneline main..feature/avatar
3eec7b3 feat(profile): add avatar helper   <span class="tok-comment"># your hashes will differ</span>
git log --oneline feature/avatar..main
4daa5ba feat(api): add /health route</code></pre>
<p><strong>Done when:</strong> both predictions were right (one commit each, in opposite directions), the graph shows two lines leaving the same commit, and <code>--author=Binh</code> lists only the /health commit.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Range A..B</span><span class="v">Commits reachable from B but not from A — "what B has that A does not".</span></div>
  <div class="kv"><span class="k">Reachable</span><span class="v">A commit is reachable from B if you can walk parent pointers from B back to it.</span></div>
  <div class="kv"><span class="k">Pathspec (<code>--</code>)</span><span class="v">Everything after <code>--</code> is a file path, never a branch name.</span></div>
  <div class="kv"><span class="k">Decoration</span><span class="v">The <code>(HEAD -&gt; main, origin/main)</code> labels showing which refs point at a commit.</span></div>
  <div class="kv"><span class="k">Alias</span><span class="v">A short name for a long command, e.g. <code>git lg</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>git log --oneline</code> first, then narrow: path, author, date, message, content.</li><li><code>--author</code> is a substring match — anchor it with an email when it matters.</li><li><code>A..B</code> = what B has that A lacks; <code>origin/main..main</code> = what you are about to push.</li><li><code>--graph --all</code> shows where branches fork and merge; without <code>--all</code> other branches vanish.</li><li>Before touching unfamiliar code, run <code>git log --oneline -20 -- &lt;file&gt;</code>.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-log" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">git-log — every flag, including the placeholders for --pretty</span><span class="lc-sub">Long, but the "PRETTY FORMATS" section alone is worth bookmarking.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: answer five questions about a repository using only git log</span><span class="lc-sub">Graded exercises on filters, ranges and formats.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>--author</code> matches a substring of the author field, not an exact identity. <code>--author=an</code> also matches "Hoang", "Tran" and "Lan" — any name containing "an" (it does <em>not</em> match "dependabot[bot]", which has no "an" anywhere in its name or email — checked on a real repository). Anchor it with an email (<code>--author=an@example.com</code>) or a regex (<code>--author="^Nguyen"</code>) when precision matters.</div>
<p class="note-ct"><strong>The habit to build:</strong> before changing unfamiliar code, run <code>git log --oneline -20 -- &lt;that file&gt;</code>. Twenty subject lines tell you whether the file is stable or churning, who to ask, and — surprisingly often — that someone already tried your idea and reverted it. Ten seconds that regularly saves an afternoon.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Kho mã của bạn là một cơ sở dữ liệu. git log là ngôn ngữ truy vấn.</h2>
<p class="lead">Đa số người chạy <code>git log</code>, thấy một bức tường chữ, bấm <kbd>q</kbd>, rồi không quay lại nữa. Đó là phí phạm nguồn thông tin giàu có nhất về một kho mã. Với năm cái cờ, <code>git log</code> trả lời được những câu như "ai chạm vào mã thanh toán gần nhất, và vì sao?" chỉ trong vài giây.</p>

<h3>Mặc định, và vì sao nó không dùng được</h3>
<pre><code>git log</code></pre>
<div class="out">commit 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d
Author: Nguyen Van An &lt;an@example.com&gt;
Date:   Thu Aug 21 14:20:00 2026 +0700

    fix: reject expired refresh tokens on /auth/refresh</div>
<p>Sáu dòng cho mỗi commit. Với kho 4.000 commit thì đó là 24.000 dòng. Việc đầu tiên cần học là nén nó lại:</p>
<pre><code>git log --oneline -10</code></pre>
<div class="out">3f8a1c9 fix: reject expired refresh tokens on /auth/refresh
9e2d4b7 feat(auth): add refresh token rotation
1c5f8a3 test(auth): cover the expired-token path
7b3e9d1 refactor(api): extract pagination into a helper</div>

<h3>Năm bộ lọc làm phần việc thật</h3>
${slide('git-02', 3, 'git log: nén một dòng rồi lọc')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">-- &lt;đường dẫn&gt;</span><span class="lz-v">Chỉ những commit chạm vào file hay thư mục này. Bộ lọc hữu ích nhất, bỏ xa các cái khác.</span></div>
  <div class="lz-layer"><span class="lz-k">--author=</span><span class="lz-v">Khớp chuỗi con trên tên hoặc email tác giả. <code>--author="An"</code> là đủ.</span></div>
  <div class="lz-layer"><span class="lz-k">--since / --until</span><span class="lz-v">Nhận ngày theo lối người: <code>"2 weeks ago"</code>, <code>"2026-08-01"</code>, <code>"yesterday"</code>.</span></div>
  <div class="lz-layer"><span class="lz-k">--grep=</span><span class="lz-v">Tìm trong <em>lời nhắn</em> commit. Ghép với <code>-i</code> để không phân biệt hoa thường.</span></div>
  <div class="lz-layer"><span class="lz-k">-S / -G</span><span class="lz-v">Tìm trong <em>nội dung thay đổi</em> — cái cuốc chim. Bài 2.3 dành riêng cho nó.</span></div>
</div>
<pre><code><span class="tok-comment"># Mọi thứ chạm vào module auth trong tháng qua, của bất kỳ ai:</span>
git log --oneline --since=<span class="tok-string">"1 month ago"</span> -- src/services/auth/

<span class="tok-comment"># Mọi commit của An có nhắc tới "cache":</span>
git log --oneline --author=<span class="tok-string">"An"</span> --grep=<span class="tok-string">"cache"</span> -i

<span class="tok-comment"># Những gì đã ra giữa hai bản phát hành:</span>
git log --oneline v1.4.0..v1.5.0</code></pre>
<div class="callout warn">Để ý dấu <code>--</code> trước đường dẫn. Nó nói với Git "mọi thứ sau đây là đường dẫn file, không phải tên nhánh". Thiếu nó, <code>git log auth</code> là nhập nhằng nếu cũng có một nhánh tên <code>auth</code>, và Git sẽ từ chối hoặc đoán sai. Gõ <code>--</code> là một thói quen rẻ tiền.</div>

<h3>Khoảng: ký hiệu hai chấm và ba chấm</h3>
${slide('git-02', 4, 'Hai chấm: cái gì có ở B mà A không có')}
<p><code>A..B</code> nghĩa là "những commit với tới được từ B mà không với tới được từ A" — nói thực dụng là "cái gì có trong B mà không có trong A". Đây là hình dạng hữu ích nhất trong Git, và nó xuất hiện lại ở <code>diff</code>, <code>rebase</code> và pull request:</p>
<pre><code>git log --oneline main..feature/login   <span class="tok-comment"># nhánh của tôi thêm gì lên trên main</span>
git log --oneline feature/login..main   <span class="tok-comment"># main có gì mà tôi chưa có — có cần merge không?</span>
git log --oneline origin/main..main     <span class="tok-comment"># tôi có gì ở cục bộ mà chưa push</span>
git log --oneline main...feature/login  <span class="tok-comment"># ba chấm: commit riêng của MỖI bên</span></code></pre>
<div class="callout ok"><code>git log origin/main..main</code> trả lời "tôi sắp push cái gì?" — đáng chạy trước mỗi lần push. Bản soi gương của nó, <code>git log main..origin/main</code>, trả lời "người khác đã thêm gì mà tôi chưa kéo về?" sau một lần <code>git fetch</code>.</div>

<h3>Nhìn thấy hình dạng của lịch sử</h3>
${slide('git-02', 5, 'log --graph: chữ và hình của cùng một lịch sử')}
<pre><code>git log --oneline --graph --all --decorate -15</code></pre>
<div class="out">*   8c4f2a1 (HEAD -&gt; main, origin/main) Merge pull request #58 from feature/login
|\\
| * 3f8a1c9 (feature/login) fix: reject expired refresh tokens
| * 9e2d4b7 feat(auth): add refresh token rotation
|/
* 7b3e9d1 refactor(api): extract pagination into a helper
* 1c5f8a3 chore(deps): bump prisma to 6.2.0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">--graph</span><span class="v">Vẽ cấu trúc nhánh bằng ký tự ở lề trái. Dấu <code>|\\</code> là một lần hợp nhất: hai dòng lịch sử nhập lại.</span></div>
  <div class="kv"><span class="k">--all</span><span class="v">Gồm mọi nhánh, không chỉ nhánh bạn đang đứng. Thiếu nó thì không thấy được các nhánh liên hệ ra sao.</span></div>
  <div class="kv"><span class="k">--decorate</span><span class="v">Hiện nhánh và tag đang trỏ vào đâu — <code>(HEAD -&gt; main, origin/main)</code>. Git đời mới bật sẵn.</span></div>
</div>
<p>Bạn sẽ gõ cái này liên tục, nên hãy đặt alias (từ bài 0.4):</p>
<pre><code>git config --global alias.lg <span class="tok-string">"log --oneline --graph --all --decorate -20"</span></code></pre>

<h3>Định dạng tuỳ ý — khi bạn cần một báo cáo, không phải để lướt</h3>
<pre><code>git log --pretty=format:<span class="tok-string">"%h %ad %an — %s"</span> --date=short -5</code></pre>
<div class="out">3f8a1c9 2026-08-21 Nguyen Van An — fix: reject expired refresh tokens
9e2d4b7 2026-08-20 Nguyen Van An — feat(auth): add refresh token rotation
1c5f8a3 2026-08-19 Tran Thi Binh — test(auth): cover the expired-token path</div>
<div class="kv-grid">
  <div class="kv"><span class="k">%h · %H</span><span class="v">Mã băm rút gọn · mã băm đầy đủ.</span></div>
  <div class="kv"><span class="k">%an · %ae</span><span class="v">Tên tác giả · email tác giả.</span></div>
  <div class="kv"><span class="k">%ad · %ar</span><span class="v">Ngày của tác giả (định dạng theo <code>--date=</code>) · ngày tương đối ("3 days ago").</span></div>
  <div class="kv"><span class="k">%s · %b</span><span class="v">Tiêu đề · thân của lời nhắn.</span></div>
  <div class="kv"><span class="k">%d</span><span class="v">Tên các ref — phần trang trí <code>(HEAD -&gt; main)</code>.</span></div>
</div>

<h3>Hai bản tóm tắt đáng biết</h3>
<pre><code>git shortlog -sn --since=<span class="tok-string">"3 months ago"</span></code></pre>
<div class="out">   142  Nguyen Van An
    87  Tran Thi Binh
    12  dependabot[bot]</div>
<p>Số commit theo tác giả. Hữu ích cho câu "ai hiểu kho mã này?" — và vô dụng như một thước đo năng suất, nên đừng dùng nó theo hướng đó.</p>
<pre><code>git log --stat -1</code></pre>
<div class="out">3f8a1c9 fix: reject expired refresh tokens on /auth/refresh
 src/services/auth.service.ts | 14 ++++++++++----
 src/services/auth.test.ts    | 32 ++++++++++++++++++++++++++++++++
 2 files changed, 42 insertions(+), 4 deletions(-)</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong kho sân tập <code>thu-git</code> từ Chương 1, tạo một nhánh phụ (side branch) có một commit: <code>git switch -c feature/avatar</code>, tạo file <code>avatar.js</code> (một dòng là đủ), <code>git add avatar.js &amp;&amp; git commit -m "feat(profile): add avatar helper"</code>, rồi <code>git switch main</code> (hoặc <code>master</code> nếu nhánh mặc định của bạn tên vậy).</li><li>Giả vờ một bạn cùng nhóm vừa đẩy lên main: tạo <code>health.js</code>, add rồi commit bằng <code>git commit -m "feat(api): add /health route" --author="Tran Thi Binh &lt;binh@example.com&gt;"</code>.</li><li>Trước khi gõ, <strong>viết ra giấy</strong> bạn đoán <code>git log --oneline main..feature/avatar</code> và <code>git log --oneline feature/avatar..main</code> sẽ in gì. Rồi mới chạy cả hai.</li><li>Chạy <code>git log --oneline --graph --all</code> và lấy ngón tay chỉ vào chỗ rẽ nhánh. Rồi chạy <code>git log --oneline --author=Binh</code>.</li></ol>
<pre><code class="language-bash">git log --oneline main..feature/avatar
3eec7b3 feat(profile): add avatar helper   <span class="tok-comment"># mã băm của bạn sẽ khác</span>
git log --oneline feature/avatar..main
4daa5ba feat(api): add /health route</code></pre>
<p><strong>Đạt khi:</strong> bạn đoán đúng cả hai (mỗi bên một commit, theo hai chiều ngược nhau), đồ thị cho thấy hai đường tách ra từ cùng một commit, và <code>--author=Binh</code> chỉ liệt kê commit /health.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Range A..B</span><span class="v">Khoảng — những commit với tới được từ B mà không với tới được từ A: "B có gì mà A chưa có".</span></div>
  <div class="kv"><span class="k">Reachable</span><span class="v">Với tới được — đi ngược theo con trỏ cha từ B mà gặp được commit đó.</span></div>
  <div class="kv"><span class="k">Pathspec (<code>--</code>)</span><span class="v">Đường dẫn lọc — mọi thứ sau <code>--</code> là đường dẫn file, không bao giờ là tên nhánh.</span></div>
  <div class="kv"><span class="k">Decoration</span><span class="v">Nhãn trang trí — phần <code>(HEAD -&gt; main, origin/main)</code> cho biết ref nào trỏ vào commit.</span></div>
  <div class="kv"><span class="k">Alias</span><span class="v">Bí danh — tên ngắn cho một lệnh dài, ví dụ <code>git lg</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Luôn bắt đầu bằng <code>git log --oneline</code>, rồi thu hẹp: đường dẫn, tác giả, ngày, lời nhắn, nội dung.</li><li><code>--author</code> khớp chuỗi con — cần chính xác thì neo bằng email.</li><li><code>A..B</code> = B có gì mà A thiếu; <code>origin/main..main</code> = thứ bạn sắp push.</li><li><code>--graph --all</code> cho thấy nhánh rẽ ra và nhập lại ở đâu; thiếu <code>--all</code> thì nhánh khác biến mất.</li><li>Trước khi sửa mã lạ, chạy <code>git log --oneline -20 -- &lt;file&gt;</code>.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-log" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">git-log — mọi cờ, kể cả các ký hiệu cho --pretty</span><span class="lc-sub">Dài, nhưng riêng mục "PRETTY FORMATS" đã đáng đánh dấu.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: trả lời năm câu hỏi về một kho mã chỉ bằng git log</span><span class="lc-sub">Bài tập chấm điểm về bộ lọc, khoảng và định dạng.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>--author</code> khớp CHUỖI CON của trường tác giả, không phải một danh tính chính xác. <code>--author=an</code> khớp cả "Hoang", "Tran" và "Lan" — bất cứ tên nào chứa "an" (nó <em>không</em> khớp "dependabot[bot]", vì cả tên lẫn email của bot đó không có chữ "an" nào — đã chạy thử trên kho thật). Hãy neo nó bằng email (<code>--author=an@example.com</code>) hoặc biểu thức chính quy (<code>--author="^Nguyen"</code>) khi cần chính xác.</div>
<p class="note-ct"><strong>Thói quen nên tạo:</strong> trước khi sửa mã lạ, hãy chạy <code>git log --oneline -20 -- &lt;file đó&gt;</code>. Hai mươi dòng tiêu đề cho bạn biết file đó ổn định hay đang lắc lư, nên hỏi ai, và — bất ngờ là khá thường xuyên — rằng đã có người thử đúng ý tưởng của bạn rồi hoàn tác. Mười giây đó đều đặn cứu được cả buổi chiều.</p>
</div>
`,
    },

    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — git show and diffing any two points in time|||2.2 — git show và so sánh hai thời điểm bất kỳ',
      slug: 'git-2-2-show-va-diff',
      type: 'LESSON',
      description: 'Đọc một commit trọn vẹn với git show, so hai commit/nhánh/tag bất kỳ, xem nội dung một file ở một thời điểm quá khứ mà không checkout, và cờ --stat/--name-only cho diff lớn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Looking at any moment in the project's life</h2>
<p class="lead"><code>git log</code> tells you <em>which</em> commits exist. <code>git show</code> and <code>git diff</code> tell you <em>what is in them</em>. Between them you can inspect any commit, compare any two points in history, and read a file exactly as it was on any day — all without changing your working directory.</p>

<h3>git show — one commit, completely</h3>
${slide('git-02', 6, 'git show: siêu dữ liệu, lời nhắn, diff')}
<pre><code>git show 3f8a1c9</code></pre>
<div class="out">commit 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d
Author: Nguyen Van An &lt;an@example.com&gt;
Date:   Thu Aug 21 14:20:00 2026 +0700

    fix: reject expired refresh tokens on /auth/refresh

diff --git a/src/services/auth.service.ts b/src/services/auth.service.ts
index 7c4a1b2..9e8f3d1 100644
--- a/src/services/auth.service.ts
+++ b/src/services/auth.service.ts
@@ -48,6 +48,9 @@ export async function refreshToken(token: string) {
   const payload = jwt.verify(token, SECRET, { ignoreExpiration: true });
+  if (payload.exp * 1000 &lt; Date.now()) {
+    throw new UnauthorizedError('refresh token expired');
+  }
   const user = await prisma.user.findUnique({ where: { id: payload.sub } });</div>
<p>Metadata plus the full diff, in one view. Some useful variants:</p>
<pre><code>git show                        <span class="tok-comment"># HEAD — the commit you just made</span>
git show HEAD~3                 <span class="tok-comment"># three commits back</span>
git show v1.5.0                 <span class="tok-comment"># the commit a tag points at</span>
git show 3f8a1c9 --stat         <span class="tok-comment"># just which files, not the content</span>
git show 3f8a1c9 -- src/auth.ts <span class="tok-comment"># only this file's part of that commit</span></code></pre>

<h3>Reading a file as it was, without checking anything out</h3>
${slide('git-02', 7, 'commit:đường-dẫn — đọc file ở quá khứ')}
<p>This is the one people do not know exists, and it is used constantly once you do. The syntax is <code>&lt;commit&gt;:&lt;path&gt;</code>:</p>
<pre><code>git show HEAD~10:src/services/auth.service.ts        <span class="tok-comment"># the whole file, ten commits ago</span>
git show v1.4.0:package.json                         <span class="tok-comment"># dependencies at that release</span>
git show 3f8a1c9:src/config.ts &gt; /tmp/old-config.ts  <span class="tok-comment"># save the old version to compare</span></code></pre>
<div class="callout ok">Your working directory is untouched. No stashing, no branch switching, no "let me just check something out for a second" that turns into a lost afternoon. When someone asks "what did this config look like before the migration?", this is a two-second answer.</div>

<h3>git diff between any two points</h3>
<p>In 1.3 you used <code>git diff</code> to compare the three trees. Given two commit-ish names it compares those instead — and "commit-ish" includes branches, tags, and anything from <code>gitrevisions</code>:</p>
<pre><code>git diff HEAD~3 HEAD              <span class="tok-comment"># what changed over the last three commits</span>
git diff v1.4.0 v1.5.0            <span class="tok-comment"># everything in a release</span>
git diff main feature/login       <span class="tok-comment"># how the two branches differ RIGHT NOW</span>
git diff main...feature/login     <span class="tok-comment"># what the branch added since it forked (see below)</span>
git diff HEAD~1 HEAD -- src/      <span class="tok-comment"># restrict to a directory</span></code></pre>

<h3>Two dots vs three dots in diff — the distinction that matters for reviews</h3>
${slide('git-02', 8, 'diff hai chấm vs ba chấm')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">A..B</div><div class="lz-t">Endpoint to endpoint</div><div class="lz-d">The literal difference between the two current states, including anything A gained after the fork.</div></div>
  <div class="lz-step"><div class="lz-k">A...B</div><div class="lz-t">From the fork point</div><div class="lz-d">Compares B against the common ancestor: "what did THIS branch change", ignoring what A did meanwhile.</div></div>
</div>
<p>Suppose you branched off <code>main</code> a week ago and <code>main</code> has moved on. <code>git diff main feature</code> shows your work <em>plus the inverse of everything main did without you</em> — confusing and usually not what you want. <code>git diff main...feature</code> shows only your work.</p>
<div class="callout ok">This is exactly what a GitHub pull request shows you: the three-dot diff. If a PR's "Files changed" tab ever looks different from your local <code>git diff main feature</code>, this is why — and the PR is showing the more useful view.</div>

<h3>Making a big diff readable</h3>
<pre><code>git diff --stat v1.4.0 v1.5.0</code></pre>
<div class="out"> src/services/auth.service.ts |  42 ++++++++++--
 src/routes/auth.routes.ts    |  18 +++--
 prisma/schema.prisma         |   7 ++
 3 files changed, 58 insertions(+), 9 deletions(-)</div>
<pre><code>git diff --name-only v1.4.0 v1.5.0     <span class="tok-comment"># just the paths — pipes well into other tools</span>
git diff --name-status v1.4.0 v1.5.0   <span class="tok-comment"># paths with A(dded)/M(odified)/D(eleted)</span></code></pre>
<div class="out">M       src/services/auth.service.ts
A       src/services/token.service.ts
D       src/utils/legacy-auth.ts</div>

<h3>Diffs that would otherwise be unreadable</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">-w / --ignore-all-space</span><span class="v">Ignore whitespace changes. Turns a reformatting commit from 800 lines into the three that actually changed.</span></div>
  <div class="kv"><span class="k">--word-diff</span><span class="v">Highlight changed words rather than whole lines. Essential for prose, Markdown and long one-line JSON.</span></div>
  <div class="kv"><span class="k">-M / --find-renames</span><span class="v">Detect that a file was moved rather than deleted-and-added. Usually automatic; force it when a rename also changed content.</span></div>
  <div class="kv"><span class="k">--color-words</span><span class="v">Word-diff with colours instead of markers. The nicest way to review a documentation change.</span></div>
</div>

<h3>What "changed" between me and the server</h3>
<pre><code>git fetch                              <span class="tok-comment"># update your view of the remote (no merge)</span>
git diff main origin/main --stat       <span class="tok-comment"># how far apart are we?</span>
git log --oneline main..origin/main    <span class="tok-comment"># what did they add?</span></code></pre>
<p>Running these three after a <code>fetch</code>, before a <code>pull</code>, is the difference between knowing what is about to land in your working directory and being surprised by it.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Continue in <code>thu-git</code> from the 2.1 practice. Run <code>git show HEAD --stat</code> and read off who made the last commit, when, and which file it touched.</li><li>Without switching branches, read the avatar file from the other branch: <code>git show feature/avatar:avatar.js</code>. Then run <code>git status -sb</code> and confirm you are still on main with nothing changed.</li><li>Predict, then run, <code>git diff --stat main feature/avatar</code> and <code>git diff --stat main...feature/avatar</code>.</li><li>Pick the one that matches what a pull request from <code>feature/avatar</code> would show on GitHub.</li></ol>
<pre><code class="language-bash">git diff --stat main feature/avatar
 avatar.js | 1 +
 health.js | 1 -        <span class="tok-comment"># nobody deleted it — main gained it after the fork</span>
git diff --stat main...feature/avatar
 avatar.js | 1 +</code></pre>
<p><strong>Done when:</strong> you can explain in one sentence why the two-dot diff shows <code>health.js</code> as deleted although nobody deleted it, and <code>git status</code> stayed clean the whole time.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Commit-ish</span><span class="v">Anything that names a commit: hash, branch, tag, <code>HEAD~3</code>.</span></div>
  <div class="kv"><span class="k">&lt;commit&gt;:&lt;path&gt;</span><span class="v">A file's content at that commit, printed without checking anything out.</span></div>
  <div class="kv"><span class="k">Merge base</span><span class="v">The common ancestor where two branches split; three-dot diff starts from it.</span></div>
  <div class="kv"><span class="k">--stat / --name-status</span><span class="v">Summaries of a diff: lines changed per file / A-M-D letter per file.</span></div>
  <div class="kv"><span class="k">Detached HEAD</span><span class="v">What you get from checking out an old commit — avoided entirely by <code>git show commit:path</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>git show &lt;hash&gt;</code> = metadata + message + diff of one commit.</li><li><code>git show v1.0.0:path</code> reads an old file without touching your working directory.</li><li><code>git diff A B</code> compares two current endpoints; <code>git diff A...B</code> shows only what B did since the fork.</li><li>Pull requests show the three-dot diff — use it for "my changes".</li><li>After <code>git fetch</code>, <code>git log main..origin/main</code> tells you what a pull will bring.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-diff" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">git-diff — the full reference, including .. vs ...</span><span class="lc-sub">The "raw output format" section explains the A/M/D letters.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/gitrevisions" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">gitrevisions — &lt;commit&gt;:&lt;path&gt; and every other name form</span><span class="lc-sub">Where <code>HEAD~3:file.ts</code> and <code>:/fix login</code> are specified.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> reading <code>git diff main feature</code> as "my changes" during a long-lived branch. It is not — it is the difference between two current states, so anything <code>main</code> gained after you forked shows up <em>reversed</em>, as if your branch deleted it. On a branch that is two weeks old this makes the diff twice as large and genuinely misleading. Use three dots.</div>
<p class="note-ct"><strong>A trick worth stealing:</strong> pipe <code>--name-only</code> into other tools. <code>git diff --name-only main...HEAD -- '*.ts' | xargs npx eslint</code> lints exactly the TypeScript files your branch touched, instead of the whole project. Half of "make CI fast" is running checks on the diff rather than the repository.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Nhìn vào bất kỳ khoảnh khắc nào trong đời dự án</h2>
<p class="lead"><code>git log</code> cho bạn biết có <em>những</em> commit nào. <code>git show</code> và <code>git diff</code> cho bạn biết <em>trong đó có gì</em>. Kết hợp lại, bạn xem được mọi commit, so được hai điểm bất kỳ trong lịch sử, và đọc được một file đúng như nó từng có vào bất kỳ ngày nào — tất cả mà không đụng vào thư mục làm việc.</p>

<h3>git show — một commit, trọn vẹn</h3>
${slide('git-02', 6, 'git show: siêu dữ liệu, lời nhắn, diff')}
<pre><code>git show 3f8a1c9</code></pre>
<div class="out">commit 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d
Author: Nguyen Van An &lt;an@example.com&gt;
Date:   Thu Aug 21 14:20:00 2026 +0700

    fix: reject expired refresh tokens on /auth/refresh

diff --git a/src/services/auth.service.ts b/src/services/auth.service.ts
index 7c4a1b2..9e8f3d1 100644
--- a/src/services/auth.service.ts
+++ b/src/services/auth.service.ts
@@ -48,6 +48,9 @@ export async function refreshToken(token: string) {
   const payload = jwt.verify(token, SECRET, { ignoreExpiration: true });
+  if (payload.exp * 1000 &lt; Date.now()) {
+    throw new UnauthorizedError('refresh token expired');
+  }
   const user = await prisma.user.findUnique({ where: { id: payload.sub } });</div>
<p>Siêu dữ liệu cộng diff đầy đủ, trong một khung nhìn. Vài biến thể hữu ích:</p>
<pre><code>git show                        <span class="tok-comment"># HEAD — commit bạn vừa tạo</span>
git show HEAD~3                 <span class="tok-comment"># lùi ba commit</span>
git show v1.5.0                 <span class="tok-comment"># commit mà một tag trỏ tới</span>
git show 3f8a1c9 --stat         <span class="tok-comment"># chỉ xem file nào, không xem nội dung</span>
git show 3f8a1c9 -- src/auth.ts <span class="tok-comment"># chỉ phần của file này trong commit đó</span></code></pre>

<h3>Đọc một file như nó từng có, mà không checkout gì cả</h3>
${slide('git-02', 7, 'commit:đường-dẫn — đọc file ở quá khứ')}
<p>Đây là thứ người ta không biết là có, và khi biết rồi thì dùng suốt. Cú pháp là <code>&lt;commit&gt;:&lt;đường dẫn&gt;</code>:</p>
<pre><code>git show HEAD~10:src/services/auth.service.ts        <span class="tok-comment"># cả file, mười commit trước</span>
git show v1.4.0:package.json                         <span class="tok-comment"># danh sách thư viện ở bản phát hành đó</span>
git show 3f8a1c9:src/config.ts &gt; /tmp/old-config.ts  <span class="tok-comment"># lưu bản cũ ra để so</span></code></pre>
<div class="callout ok">Thư mục làm việc của bạn không bị đụng tới. Không phải stash, không phải đổi nhánh, không có màn "để tôi checkout một tí thôi" rồi biến thành mất cả buổi chiều. Khi ai đó hỏi "cái config này trông thế nào trước lần migration?", đây là câu trả lời trong hai giây.</div>

<h3>git diff giữa hai điểm bất kỳ</h3>
<p>Ở bài 1.3 bạn dùng <code>git diff</code> để so ba cái cây. Khi đưa cho nó hai tên commit-ish thì nó so hai cái đó — và "commit-ish" gồm cả nhánh, tag, và mọi dạng trong <code>gitrevisions</code>:</p>
<pre><code>git diff HEAD~3 HEAD              <span class="tok-comment"># ba commit vừa rồi đã đổi những gì</span>
git diff v1.4.0 v1.5.0            <span class="tok-comment"># mọi thứ trong một bản phát hành</span>
git diff main feature/login       <span class="tok-comment"># hai nhánh khác nhau thế nào NGAY LÚC NÀY</span>
git diff main...feature/login     <span class="tok-comment"># nhánh đó đã thêm gì từ lúc rẽ ra (xem dưới)</span>
git diff HEAD~1 HEAD -- src/      <span class="tok-comment"># giới hạn trong một thư mục</span></code></pre>

<h3>Hai chấm vs ba chấm trong diff — phân biệt quan trọng cho việc review</h3>
${slide('git-02', 8, 'diff hai chấm vs ba chấm')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">A..B</div><div class="lz-t">Đầu mút tới đầu mút</div><div class="lz-d">Khác biệt theo nghĩa đen giữa hai trạng thái hiện tại, gồm cả những gì A có thêm sau lúc rẽ nhánh.</div></div>
  <div class="lz-step"><div class="lz-k">A...B</div><div class="lz-t">Tính từ điểm rẽ</div><div class="lz-d">So B với tổ tiên chung: "NHÁNH NÀY đã đổi gì", bỏ qua những gì A làm trong lúc đó.</div></div>
</div>
<p>Giả sử bạn rẽ nhánh từ <code>main</code> một tuần trước và <code>main</code> đã đi tiếp. <code>git diff main feature</code> cho thấy việc của bạn <em>cộng với phần đảo ngược của mọi thứ main làm khi vắng bạn</em> — rối rắm và thường không phải thứ bạn muốn. <code>git diff main...feature</code> chỉ cho thấy việc của bạn.</p>
<div class="callout ok">Đây đúng là thứ một pull request trên GitHub cho bạn xem: diff ba chấm. Nếu tab "Files changed" của một PR có lúc trông khác với <code>git diff main feature</code> ở máy bạn, đó chính là lý do — và PR đang hiện góc nhìn hữu ích hơn.</div>

<h3>Làm một diff lớn đọc được</h3>
<pre><code>git diff --stat v1.4.0 v1.5.0</code></pre>
<div class="out"> src/services/auth.service.ts |  42 ++++++++++--
 src/routes/auth.routes.ts    |  18 +++--
 prisma/schema.prisma         |   7 ++
 3 files changed, 58 insertions(+), 9 deletions(-)</div>
<pre><code>git diff --name-only v1.4.0 v1.5.0     <span class="tok-comment"># chỉ đường dẫn — đưa vào công cụ khác rất tiện</span>
git diff --name-status v1.4.0 v1.5.0   <span class="tok-comment"># đường dẫn kèm A(thêm)/M(sửa)/D(xoá)</span></code></pre>
<div class="out">M       src/services/auth.service.ts
A       src/services/token.service.ts
D       src/utils/legacy-auth.ts</div>

<h3>Những diff mà nếu không có cờ thì không đọc nổi</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">-w / --ignore-all-space</span><span class="v">Bỏ qua thay đổi khoảng trắng. Biến một commit định dạng lại từ 800 dòng thành ba dòng thật sự đổi.</span></div>
  <div class="kv"><span class="k">--word-diff</span><span class="v">Tô đậm TỪ đã đổi thay vì cả dòng. Thiết yếu cho văn xuôi, Markdown và JSON dài một dòng.</span></div>
  <div class="kv"><span class="k">-M / --find-renames</span><span class="v">Nhận ra một file bị DỜI chứ không phải xoá-rồi-thêm. Thường tự động; ép nó khi việc đổi tên đi kèm sửa nội dung.</span></div>
  <div class="kv"><span class="k">--color-words</span><span class="v">Diff theo từ, dùng màu thay vì ký hiệu. Cách dễ chịu nhất để review một thay đổi tài liệu.</span></div>
</div>

<h3>Cái gì đã "đổi" giữa tôi và máy chủ</h3>
<pre><code>git fetch                              <span class="tok-comment"># cập nhật cái nhìn về remote (không hợp nhất)</span>
git diff main origin/main --stat       <span class="tok-comment"># hai bên cách nhau bao xa?</span>
git log --oneline main..origin/main    <span class="tok-comment"># họ đã thêm gì?</span></code></pre>
<p>Chạy ba lệnh này sau <code>fetch</code>, trước <code>pull</code>, là khác biệt giữa biết trước thứ sắp đáp xuống thư mục làm việc của bạn và bị nó làm cho bất ngờ.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Làm tiếp trong <code>thu-git</code> từ bài thực hành 2.1. Chạy <code>git show HEAD --stat</code> và đọc ra: ai tạo commit cuối, lúc nào, chạm vào file nào.</li><li>Không đổi nhánh, đọc file avatar của nhánh kia: <code>git show feature/avatar:avatar.js</code>. Rồi chạy <code>git status -sb</code> và xác nhận bạn vẫn đứng ở main, không có gì thay đổi.</li><li>Đoán trước, rồi mới chạy, <code>git diff --stat main feature/avatar</code> và <code>git diff --stat main...feature/avatar</code>.</li><li>Chọn ra lệnh nào khớp với thứ mà một pull request từ <code>feature/avatar</code> sẽ hiện trên GitHub.</li></ol>
<pre><code class="language-bash">git diff --stat main feature/avatar
 avatar.js | 1 +
 health.js | 1 -        <span class="tok-comment"># không ai xoá nó — main có thêm nó SAU lúc rẽ nhánh</span>
git diff --stat main...feature/avatar
 avatar.js | 1 +</code></pre>
<p><strong>Đạt khi:</strong> bạn giải thích được trong một câu vì sao diff hai chấm hiện <code>health.js</code> như bị xoá dù không ai xoá, và <code>git status</code> sạch suốt cả bài.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Commit-ish</span><span class="v">Thứ gọi được tên một commit — mã băm, nhánh, tag, <code>HEAD~3</code>.</span></div>
  <div class="kv"><span class="k">&lt;commit&gt;:&lt;path&gt;</span><span class="v">Nội dung một file tại commit đó, in ra mà không cần checkout.</span></div>
  <div class="kv"><span class="k">Merge base</span><span class="v">Tổ tiên chung — commit nơi hai nhánh tách ra; diff ba chấm tính từ đây.</span></div>
  <div class="kv"><span class="k">--stat / --name-status</span><span class="v">Bản tóm tắt diff — số dòng đổi theo file / chữ A-M-D (thêm-sửa-xoá) theo file.</span></div>
  <div class="kv"><span class="k">Detached HEAD</span><span class="v">HEAD lìa cành — trạng thái khi checkout một commit cũ; <code>git show commit:path</code> tránh được hẳn nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>git show &lt;mã băm&gt;</code> = siêu dữ liệu + lời nhắn + diff của một commit.</li><li><code>git show v1.0.0:đường/dẫn</code> đọc file cũ mà không đụng vào thư mục làm việc.</li><li><code>git diff A B</code> so hai đầu mút hiện tại; <code>git diff A...B</code> chỉ cho thấy B đã làm gì từ lúc rẽ ra.</li><li>Pull request hiện diff ba chấm — dùng nó khi muốn xem "thay đổi của tôi".</li><li>Sau <code>git fetch</code>, <code>git log main..origin/main</code> cho biết lần pull sắp mang về những gì.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-diff" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">git-diff — tài liệu đầy đủ, gồm cả .. vs ...</span><span class="lc-sub">Mục "raw output format" giải thích các chữ A/M/D.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/gitrevisions" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">gitrevisions — &lt;commit&gt;:&lt;đường dẫn&gt; và mọi dạng gọi tên khác</span><span class="lc-sub">Nơi <code>HEAD~3:file.ts</code> và <code>:/fix login</code> được đặc tả.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đọc <code>git diff main feature</code> như "những thay đổi của tôi" trên một nhánh sống lâu. Không phải vậy — đó là khác biệt giữa hai trạng thái hiện tại, nên mọi thứ <code>main</code> có thêm sau lúc bạn rẽ ra sẽ hiện <em>ngược lại</em>, như thể nhánh của bạn xoá chúng đi. Trên một nhánh hai tuần tuổi, điều này làm diff to gấp đôi và gây hiểu sai thật sự. Hãy dùng ba chấm.</div>
<p class="note-ct"><strong>Một mẹo đáng ăn cắp:</strong> đưa <code>--name-only</code> vào công cụ khác. <code>git diff --name-only main...HEAD -- '*.ts' | xargs npx eslint</code> chạy lint đúng những file TypeScript mà nhánh của bạn chạm vào, thay vì cả dự án. Một nửa của việc "làm CI nhanh" là chạy kiểm tra trên phần diff chứ không trên cả kho mã.</p>
</div>
`,
    },

    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — blame and the pickaxe: why does this line exist?|||2.3 — blame và cái cuốc chim: vì sao dòng này tồn tại?',
      slug: 'git-2-3-blame-va-pickaxe',
      type: 'LESSON',
      description: 'git blame truy vết từng dòng về commit đã tạo ra nó, cách vượt qua commit định dạng lại vô nghĩa, và cái cuốc chim -S/-G tìm ra commit đã THÊM hoặc XOÁ một chuỗi — cách duy nhất tìm mã đã biến mất.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Two tools for "why on earth is this here?"</h2>
<p class="lead">You are reading code and hit a line that makes no sense: a magic number, a <code>setTimeout(0)</code>, a check that looks impossible to trigger. Deleting it is tempting and occasionally catastrophic. Two commands answer the question properly — <code>git blame</code> for a line that is still there, and the <em>pickaxe</em> for one that is not.</p>

<h3>git blame — who wrote each line, and when</h3>
${slide('git-02', 9, 'git blame: bốn cột của một dòng')}
<pre><code>git blame src/services/auth.service.ts</code></pre>
<div class="out">7b3e9d1a (Tran Thi Binh  2026-06-14 09:12:03 +0700  46) export async function refreshToken(token: string) {
3f8a1c9d (Nguyen Van An   2026-08-21 14:20:00 +0700  47)   // ignoreExpiration: we re-check exp below on purpose
3f8a1c9d (Nguyen Van An   2026-08-21 14:20:00 +0700  48)   const payload = jwt.verify(token, SECRET, { ignoreExpiration: true });
9e2d4b70 (Nguyen Van An   2026-08-20 11:05:41 +0700  49)   const user = await prisma.user.findUnique(…</div>
<p>Four columns: the commit that last touched the line, the author, the date, and the line number. Despite the name, treat it as an index into history, not an accusation — the useful move is always the next one:</p>
<pre><code>git show 3f8a1c9</code></pre>
<p>That is the actual answer. Blame gives you the hash; <code>show</code> gives you the reasoning, which is why Chapter 1.4 spent so long on commit messages.</p>

<h3>Narrowing blame to the part you care about</h3>
<pre><code>git blame -L 44,60 src/services/auth.service.ts      <span class="tok-comment"># only lines 44–60</span>
git blame -L :refreshToken src/services/auth.service.ts  <span class="tok-comment"># only that function</span>
git blame HEAD~20 -- src/services/auth.service.ts    <span class="tok-comment"># blame as of 20 commits ago</span></code></pre>

<h3>Getting past the reformatting commit</h3>
${slide('git-02', 10, 'blame -w nhìn xuyên commit prettier')}
<p>The usual disappointment: blame says every line was last touched by <code>chore: run prettier on everything</code>. That commit explains nothing. Three flags see through it:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">-w</span><span class="v">Ignore whitespace-only changes. Kills most reindent commits on its own.</span></div>
  <div class="kv"><span class="k">-C</span><span class="v">Detect lines <em>copied or moved</em> within the same commit — follows a function that moved between files.</span></div>
  <div class="kv"><span class="k">-M</span><span class="v">Detect lines moved <em>within a file</em>. Blames the original author instead of whoever reordered the file.</span></div>
</div>
<pre><code>git blame -w -C -M -L 44,60 src/services/auth.service.ts</code></pre>
<div class="callout ok">A repository can also record "ignore these commits when blaming" permanently: put the hashes of pure-formatting commits in a <code>.git-blame-ignore-revs</code> file, then <code>git config blame.ignoreRevsFile .git-blame-ignore-revs</code>. GitHub's blame view honours the same file. This is the professional answer to "the big prettier commit ruined blame".</div>

<h3>The pickaxe: finding code that is no longer there</h3>
${slide('git-02', 11, 'Cái cuốc chim -S và -G')}
<p>Blame only works on lines that still exist. When a function was <em>deleted</em>, or a config value used to be something else, blame has nothing to show you. The pickaxe searches the content of every change in history:</p>
<pre><code><span class="tok-comment"># Commits where the NUMBER OF OCCURRENCES of "legacyAuth" changed</span>
<span class="tok-comment"># — i.e. where it was introduced or removed:</span>
git log -S<span class="tok-string">"legacyAuth"</span> --oneline</code></pre>
<div class="out">a4f9c2e refactor(auth): delete the legacy auth path
7b3e9d1 feat(auth): add legacyAuth fallback for old clients</div>
<p>Two commits: the one that introduced it and the one that removed it. That is the entire life story of a piece of code, in one command. Follow up with <code>git show a4f9c2e</code> to read why it went.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">-S</div><div class="lz-t">Count changed</div><div class="lz-d">Finds commits where the string appears a different number of times. Answers "when was this added or deleted?"</div></div>
  <div class="lz-step"><div class="lz-k">-G</div><div class="lz-t">Any touched line matches</div><div class="lz-d">Finds every commit whose diff has a line matching the regex — including moves and edits nearby.</div></div>
  <div class="lz-step"><div class="lz-k">-S … --pickaxe-regex</div><div class="lz-t">Both</div><div class="lz-d">-S semantics with a regular expression instead of a fixed string.</div></div>
</div>
<pre><code>git log -S<span class="tok-string">"MAX_RETRIES"</span> -p --oneline        <span class="tok-comment"># -p also prints the diff of each hit</span>
git log -G<span class="tok-string">"process\\.env\\.[A-Z_]+"</span> --oneline   <span class="tok-comment"># every commit that touched an env var read</span>
git log -S<span class="tok-string">"password"</span> --all --oneline       <span class="tok-comment"># across ALL branches — a mini secret audit</span></code></pre>
<div class="callout warn">That last one is worth running on any repository you inherit. <code>git log -G"password|api_key" --all</code> finds credentials that were committed and later deleted (use one regex with <code>|</code>: if you write <code>-S"password" -S"api_key"</code>, Git silently keeps only the <em>last</em> <code>-S</code> and searches for <code>api_key</code> alone) — deleted from the working tree, still in every clone. Chapter 8.4 covers removing them properly; finding them is step one.</div>

<h3>Following a file through renames</h3>
${slide('git-02', 12, '--follow đi xuyên lần đổi tên')}
<pre><code>git log --oneline -- src/services/auth.service.ts</code></pre>
<div class="out">3f8a1c9 fix: reject expired refresh tokens
9e2d4b7 feat(auth): add refresh token rotation</div>
<p>Only two commits — because the file was renamed last month and Git stopped at the rename. <code>--follow</code> crosses it:</p>
<pre><code>git log --oneline --follow -- src/services/auth.service.ts</code></pre>
<div class="out">3f8a1c9 fix: reject expired refresh tokens
9e2d4b7 feat(auth): add refresh token rotation
c8d2f4a refactor: move auth into services/
5a1b3c7 feat: first version of the login endpoint
2f8e9d0 chore: scaffold the auth module</div>
<p>Five commits, back to the file's real beginning under its old name. <code>--follow</code> takes only one path at a time, which is why it is not the default.</p>

<h3>Searching the working tree, not history</h3>
<p>Different question, different tool. <code>git grep</code> searches <em>current</em> content, but understands Git — so it skips <code>.gitignore</code>d files and can search any commit:</p>
<pre><code>git grep <span class="tok-string">"refreshToken"</span>                 <span class="tok-comment"># in the working tree, tracked files only</span>
git grep -n <span class="tok-string">"refreshToken"</span> v1.4.0         <span class="tok-comment"># in an old release, without checking it out</span>
git grep -l <span class="tok-string">"TODO"</span> -- <span class="tok-string">'*.ts'</span>              <span class="tok-comment"># just the file names, TypeScript only</span>
git grep -c <span class="tok-string">"console.log"</span>                <span class="tok-comment"># count per file</span></code></pre>
<div class="callout ok">Prefer <code>git grep</code> over plain <code>grep -r</code> inside a repository: it never wastes time in <code>node_modules/</code>, it respects <code>.gitignore</code>, it is dramatically faster, and it accepts a commit as an argument. Everything <code>grep</code> can do, plus history.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In <code>thu-git</code>, create <code>config.js</code> with the three lines below (line 2 NOT indented) and commit it as your teammate: <code>git add config.js &amp;&amp; git commit -m "feat: add retry config" --author="Tran Thi Binh &lt;binh@example.com&gt;"</code>.</li><li>Indent line 2 by four spaces, then <code>git commit -am "chore: format config.js"</code> as yourself. Compare <code>git blame config.js</code> with <code>git blame -w config.js</code>.</li><li>Delete <code>MAX_RETRIES: 3, </code> from line 2 and commit <code>"refactor: drop retries"</code>. Check that <code>git grep MAX_RETRIES</code> finds nothing, then run <code>git log -S"MAX_RETRIES" --oneline</code>.</li><li><code>git mv config.js settings.js</code>, commit, and compare <code>git log --oneline -- settings.js</code> with <code>git log --oneline --follow -- settings.js</code>.</li></ol>
<pre><code class="language-javascript">function config() {
return { MAX_RETRIES: 3, TIMEOUT_MS: 5000 };
}</code></pre>
<p><strong>Done when:</strong> <code>blame -w</code> credits line 2 to Binh's commit (plain blame credits your format commit), <code>-S</code> lists exactly two commits — the one that added and the one that removed <code>MAX_RETRIES</code>, not the format commit — and <code>--follow</code> shows 4 commits where the plain log shows 1.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Blame</span><span class="v">For each line, the commit that last changed it — an index into history, not a verdict.</span></div>
  <div class="kv"><span class="k">Pickaxe (<code>-S</code>)</span><span class="v">Finds commits where the number of occurrences of a string changed: added or removed.</span></div>
  <div class="kv"><span class="k"><code>-G</code></span><span class="v">Finds commits whose diff has any added/removed line matching a regex, including plain edits.</span></div>
  <div class="kv"><span class="k">--follow</span><span class="v">Keeps following one file's history across renames.</span></div>
  <div class="kv"><span class="k">.git-blame-ignore-revs</span><span class="v">A file listing pure-formatting commits that blame (and GitHub) should skip.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Line still there → <code>git blame -w -C -M -L a,b</code> → <code>git show &lt;hash&gt;</code>.</li><li>Code gone → <code>git log -S"name" --oneline --all</code> → <code>git show &lt;hash&gt;</code>.</li><li><code>-S</code> sees births and deaths; <code>-G</code> also sees edits of matching lines.</li><li>Only the last <code>-S</code> counts — search several strings with one <code>-G"a|b"</code>.</li><li>Renamed file: add <code>--follow</code>, one path at a time.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-blame" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">git-blame — including -C, -M and blame.ignoreRevsFile</span><span class="lc-sub">The copy/move detection heuristics are documented here.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-log#Documentation/git-log.txt--Sltstringgt" target="_blank" rel="noopener">
  <span class="lc-ico">⛏️</span>
  <span class="lc-body"><span class="lc-title">The pickaxe: -S and -G in git-log</span><span class="lc-sub">The exact difference between "occurrence count changed" and "a matching line was touched".</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> using <code>git blame</code> to assign fault. Beyond being unpleasant, it is usually <em>wrong</em>: the last person to touch a line is often someone who reindented it, renamed a variable, or applied a codemod. The line's real author may be five commits underneath. Use <code>-w -C -M</code>, read the commit message, and treat blame as a pointer into history.</div>
<p class="note-ct"><strong>The workflow to remember:</strong> the line is still there → <code>git blame</code> → <code>git show &lt;hash&gt;</code>. The code is gone → <code>git log -S"…"</code> → <code>git show &lt;hash&gt;</code>. Both roads end at a commit message, which is why the quality of your messages decides whether this chapter's tools pay off at all.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Hai công cụ cho câu "cái này ở đây làm gì thế?"</h2>
<p class="lead">Bạn đang đọc mã và gặp một dòng vô lý: một con số thần kỳ, một <code>setTimeout(0)</code>, một phép kiểm trông như không bao giờ kích hoạt nổi. Xoá nó thì rất hấp dẫn và thỉnh thoảng thì thảm hoạ. Hai lệnh trả lời câu hỏi này một cách đàng hoàng — <code>git blame</code> cho dòng vẫn còn đó, và <em>cái cuốc chim</em> cho dòng đã biến mất.</p>

<h3>git blame — ai viết từng dòng, và khi nào</h3>
${slide('git-02', 9, 'git blame: bốn cột của một dòng')}
<pre><code>git blame src/services/auth.service.ts</code></pre>
<div class="out">7b3e9d1a (Tran Thi Binh  2026-06-14 09:12:03 +0700  46) export async function refreshToken(token: string) {
3f8a1c9d (Nguyen Van An   2026-08-21 14:20:00 +0700  47)   // ignoreExpiration: we re-check exp below on purpose
3f8a1c9d (Nguyen Van An   2026-08-21 14:20:00 +0700  48)   const payload = jwt.verify(token, SECRET, { ignoreExpiration: true });
9e2d4b70 (Nguyen Van An   2026-08-20 11:05:41 +0700  49)   const user = await prisma.user.findUnique(…</div>
<p>Bốn cột: commit chạm vào dòng đó gần nhất, tác giả, ngày, và số dòng. Bất chấp cái tên, hãy coi nó như một chỉ mục vào lịch sử, không phải một lời buộc tội — nước đi hữu ích luôn là nước tiếp theo:</p>
<pre><code>git show 3f8a1c9</code></pre>
<p>Đó mới là câu trả lời thật. Blame cho bạn mã băm; <code>show</code> cho bạn lý lẽ, và đó là lý do bài 1.4 dành nhiều công cho lời nhắn commit đến thế.</p>

<h3>Thu hẹp blame vào đúng phần bạn quan tâm</h3>
<pre><code>git blame -L 44,60 src/services/auth.service.ts      <span class="tok-comment"># chỉ dòng 44–60</span>
git blame -L :refreshToken src/services/auth.service.ts  <span class="tok-comment"># chỉ hàm đó</span>
git blame HEAD~20 -- src/services/auth.service.ts    <span class="tok-comment"># blame tại thời điểm 20 commit trước</span></code></pre>

<h3>Vượt qua commit định dạng lại</h3>
${slide('git-02', 10, 'blame -w nhìn xuyên commit prettier')}
<p>Nỗi thất vọng quen thuộc: blame nói mọi dòng đều được chạm gần nhất bởi <code>chore: chạy prettier toàn bộ</code>. Commit đó chẳng giải thích gì. Ba cái cờ nhìn xuyên qua nó:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">-w</span><span class="v">Bỏ qua thay đổi chỉ có khoảng trắng. Riêng nó đã dẹp được đa số commit thụt lề lại.</span></div>
  <div class="kv"><span class="k">-C</span><span class="v">Nhận ra dòng được <em>chép hoặc dời</em> trong cùng một commit — bám theo một hàm chuyển giữa các file.</span></div>
  <div class="kv"><span class="k">-M</span><span class="v">Nhận ra dòng dời <em>trong cùng một file</em>. Quy về tác giả gốc thay vì người sắp xếp lại file.</span></div>
</div>
<pre><code>git blame -w -C -M -L 44,60 src/services/auth.service.ts</code></pre>
<div class="callout ok">Một kho mã cũng ghi được vĩnh viễn luật "bỏ qua các commit này khi blame": đặt mã băm của những commit thuần-định-dạng vào file <code>.git-blame-ignore-revs</code>, rồi <code>git config blame.ignoreRevsFile .git-blame-ignore-revs</code>. Giao diện blame của GitHub cũng tôn trọng chính file đó. Đây là câu trả lời chuyên nghiệp cho "cái commit prettier khổng lồ đã phá nát blame".</div>

<h3>Cái cuốc chim: tìm mã không còn ở đó nữa</h3>
${slide('git-02', 11, 'Cái cuốc chim -S và -G')}
<p>Blame chỉ chạy được trên những dòng còn tồn tại. Khi một hàm đã bị <em>xoá</em>, hoặc một giá trị cấu hình từng là thứ khác, blame không có gì để chỉ cho bạn. Cái cuốc chim tìm trong nội dung của mọi thay đổi trong lịch sử:</p>
<pre><code><span class="tok-comment"># Những commit mà SỐ LẦN XUẤT HIỆN của "legacyAuth" thay đổi</span>
<span class="tok-comment"># — tức là nơi nó được thêm vào hoặc bị gỡ ra:</span>
git log -S<span class="tok-string">"legacyAuth"</span> --oneline</code></pre>
<div class="out">a4f9c2e refactor(auth): delete the legacy auth path
7b3e9d1 feat(auth): add legacyAuth fallback for old clients</div>
<p>Hai commit: cái sinh ra nó và cái gỡ nó đi. Đó là toàn bộ tiểu sử của một mẩu mã, trong một lệnh. Tiếp theo hãy <code>git show a4f9c2e</code> để đọc vì sao nó ra đi.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">-S</div><div class="lz-t">Số lần xuất hiện đổi</div><div class="lz-d">Tìm commit mà chuỗi đó xuất hiện với số lần khác đi. Trả lời "cái này được thêm hay bị xoá lúc nào?"</div></div>
  <div class="lz-step"><div class="lz-k">-G</div><div class="lz-t">Có dòng nào chạm khớp mẫu</div><div class="lz-d">Tìm mọi commit mà diff của nó có một dòng khớp biểu thức chính quy — kể cả dời chỗ và sửa lân cận.</div></div>
  <div class="lz-step"><div class="lz-k">-S … --pickaxe-regex</div><div class="lz-t">Cả hai</div><div class="lz-d">Ngữ nghĩa của -S nhưng dùng biểu thức chính quy thay vì chuỗi cố định.</div></div>
</div>
<pre><code>git log -S<span class="tok-string">"MAX_RETRIES"</span> -p --oneline        <span class="tok-comment"># -p in luôn diff của từng kết quả</span>
git log -G<span class="tok-string">"process\\.env\\.[A-Z_]+"</span> --oneline   <span class="tok-comment"># mọi commit chạm vào việc đọc biến môi trường</span>
git log -S<span class="tok-string">"password"</span> --all --oneline       <span class="tok-comment"># trên MỌI nhánh — một cuộc soát bí mật thu nhỏ</span></code></pre>
<div class="callout warn">Lệnh cuối đáng chạy trên bất kỳ kho mã nào bạn tiếp quản. <code>git log -G"password|api_key" --all</code> tìm ra những chứng chỉ từng được commit rồi xoá đi (dùng MỘT biểu thức với <code>|</code>: nếu viết <code>-S"password" -S"api_key"</code> thì Git lặng lẽ chỉ giữ <code>-S</code> <em>cuối cùng</em> và chỉ tìm <code>api_key</code>) — xoá khỏi cây làm việc, nhưng vẫn nằm trong mọi bản clone. Chương 8.4 nói cách gỡ chúng cho đúng; tìm ra chúng là bước một.</div>

<h3>Bám theo một file qua các lần đổi tên</h3>
${slide('git-02', 12, '--follow đi xuyên lần đổi tên')}
<pre><code>git log --oneline -- src/services/auth.service.ts</code></pre>
<div class="out">3f8a1c9 fix: reject expired refresh tokens
9e2d4b7 feat(auth): add refresh token rotation</div>
<p>Chỉ hai commit — vì file này đã được đổi tên tháng trước và Git dừng lại ở chỗ đổi tên. <code>--follow</code> đi xuyên qua đó:</p>
<pre><code>git log --oneline --follow -- src/services/auth.service.ts</code></pre>
<div class="out">3f8a1c9 fix: reject expired refresh tokens
9e2d4b7 feat(auth): add refresh token rotation
c8d2f4a refactor: move auth into services/
5a1b3c7 feat: first version of the login endpoint
2f8e9d0 chore: scaffold the auth module</div>
<p>Năm commit, về tới khởi đầu thật của file dưới cái tên cũ. <code>--follow</code> chỉ nhận một đường dẫn mỗi lần, và đó là lý do nó không phải mặc định.</p>

<h3>Tìm trong cây làm việc, không phải lịch sử</h3>
<p>Câu hỏi khác, công cụ khác. <code>git grep</code> tìm trong nội dung <em>hiện tại</em>, nhưng nó hiểu Git — nên bỏ qua file bị <code>.gitignore</code> và tìm được trong mọi commit:</p>
<pre><code>git grep <span class="tok-string">"refreshToken"</span>                 <span class="tok-comment"># trong cây làm việc, chỉ file được theo dõi</span>
git grep -n <span class="tok-string">"refreshToken"</span> v1.4.0         <span class="tok-comment"># trong một bản phát hành cũ, không cần checkout</span>
git grep -l <span class="tok-string">"TODO"</span> -- <span class="tok-string">'*.ts'</span>              <span class="tok-comment"># chỉ tên file, chỉ TypeScript</span>
git grep -c <span class="tok-string">"console.log"</span>                <span class="tok-comment"># đếm theo từng file</span></code></pre>
<div class="callout ok">Hãy ưu tiên <code>git grep</code> hơn <code>grep -r</code> trần khi ở trong một kho mã: nó không bao giờ phí thời gian trong <code>node_modules/</code>, nó tôn trọng <code>.gitignore</code>, nó nhanh hơn hẳn, và nó nhận một commit làm tham số. Mọi thứ <code>grep</code> làm được, cộng thêm lịch sử.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong <code>thu-git</code>, tạo <code>config.js</code> với ba dòng dưới đây (dòng 2 KHÔNG thụt lề) và commit dưới tên bạn cùng nhóm: <code>git add config.js &amp;&amp; git commit -m "feat: add retry config" --author="Tran Thi Binh &lt;binh@example.com&gt;"</code>.</li><li>Thụt dòng 2 vào bốn dấu cách, rồi <code>git commit -am "chore: format config.js"</code> dưới tên bạn. So <code>git blame config.js</code> với <code>git blame -w config.js</code>.</li><li>Xoá đoạn <code>MAX_RETRIES: 3, </code> khỏi dòng 2 và commit <code>"refactor: drop retries"</code>. Kiểm rằng <code>git grep MAX_RETRIES</code> không ra gì, rồi chạy <code>git log -S"MAX_RETRIES" --oneline</code>.</li><li><code>git mv config.js settings.js</code>, commit, rồi so <code>git log --oneline -- settings.js</code> với <code>git log --oneline --follow -- settings.js</code>.</li></ol>
<pre><code class="language-javascript">function config() {
return { MAX_RETRIES: 3, TIMEOUT_MS: 5000 };
}</code></pre>
<p><strong>Đạt khi:</strong> <code>blame -w</code> quy dòng 2 về commit của Binh (blame trần quy về commit định dạng của bạn), <code>-S</code> liệt kê đúng hai commit — cái thêm và cái xoá <code>MAX_RETRIES</code>, không có commit định dạng — và <code>--follow</code> hiện 4 commit trong khi log trần chỉ hiện 1.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Blame</span><span class="v">Truy vết từng dòng — commit sửa dòng đó gần nhất; là chỉ mục vào lịch sử, không phải bản án.</span></div>
  <div class="kv"><span class="k">Pickaxe (<code>-S</code>)</span><span class="v">Cái cuốc chim — tìm commit mà số lần xuất hiện của một chuỗi thay đổi: được thêm hoặc bị xoá.</span></div>
  <div class="kv"><span class="k"><code>-G</code></span><span class="v">Tìm commit có dòng thêm/bớt khớp biểu thức chính quy (regex), kể cả dòng chỉ bị sửa.</span></div>
  <div class="kv"><span class="k">--follow</span><span class="v">Bám theo — đi tiếp lịch sử của một file qua các lần đổi tên.</span></div>
  <div class="kv"><span class="k">.git-blame-ignore-revs</span><span class="v">File liệt kê các commit thuần định dạng mà blame (và GitHub) sẽ bỏ qua.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Dòng còn đó → <code>git blame -w -C -M -L a,b</code> → <code>git show &lt;mã băm&gt;</code>.</li><li>Mã đã mất → <code>git log -S"tên" --oneline --all</code> → <code>git show &lt;mã băm&gt;</code>.</li><li><code>-S</code> thấy lúc sinh ra và lúc bị xoá; <code>-G</code> thấy cả lúc dòng khớp bị sửa.</li><li>Chỉ <code>-S</code> cuối cùng có tác dụng — tìm nhiều chuỗi thì dùng một <code>-G"a|b"</code>.</li><li>File đã đổi tên: thêm <code>--follow</code>, mỗi lần một đường dẫn.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-blame" target="_blank" rel="noopener">
  <span class="lc-ico">🔍</span>
  <span class="lc-body"><span class="lc-title">git-blame — gồm cả -C, -M và blame.ignoreRevsFile</span><span class="lc-sub">Các thuật toán phát hiện chép/dời được ghi ở đây.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-log#Documentation/git-log.txt--Sltstringgt" target="_blank" rel="noopener">
  <span class="lc-ico">⛏️</span>
  <span class="lc-body"><span class="lc-title">Cái cuốc chim: -S và -G trong git-log</span><span class="lc-sub">Khác biệt chính xác giữa "số lần xuất hiện đổi" và "có một dòng khớp bị chạm".</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dùng <code>git blame</code> để quy trách nhiệm. Ngoài chuyện khó chịu, nó thường <em>sai</em>: người chạm vào một dòng gần nhất thường là người thụt lại lề, đổi tên một biến, hoặc chạy một codemod. Tác giả thật của dòng đó có thể nằm dưới năm commit. Hãy dùng <code>-w -C -M</code>, đọc lời nhắn commit, và coi blame là một con trỏ vào lịch sử.</div>
<p class="note-ct"><strong>Quy trình cần nhớ:</strong> dòng vẫn còn → <code>git blame</code> → <code>git show &lt;mã băm&gt;</code>. Mã đã biến mất → <code>git log -S"…"</code> → <code>git show &lt;mã băm&gt;</code>. Cả hai con đường đều kết thúc ở một lời nhắn commit, và đó là lý do chất lượng lời nhắn của bạn quyết định các công cụ của chương này có sinh lời hay không.</p>
</div>
`,
    },

    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — git bisect: binary search for the commit that broke it|||2.4 — git bisect: tìm nhị phân ra commit đã làm hỏng',
      slug: 'git-2-4-bisect',
      type: 'LESSON',
      description: 'Khoanh vùng lỗi trong 1.000 commit chỉ với 10 bước: bisect thủ công, bisect tự động bằng git bisect run, cách xử lý commit không dựng được (skip), và những sai lầm làm hỏng một phiên bisect.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>"It worked last month" — the ten-step answer</h2>
<p class="lead">A bug appeared somewhere in the last thousand commits. Reading them is out of the question. <code>git bisect</code> does a binary search: it checks out the midpoint, you say whether the bug is there, and it halves the range. A thousand commits collapse to about <strong>ten questions</strong>, because log₂(1000) ≈ 10.</p>

<h3>The doubling table — why this feels like magic</h3>
${slide('git-02', 13, 'bisect: mỗi câu trả lời vứt đi một nửa')}
<div class="kv-grid">
  <div class="kv"><span class="k">100 commits</span><span class="v">7 steps</span></div>
  <div class="kv"><span class="k">1,000 commits</span><span class="v">10 steps</span></div>
  <div class="kv"><span class="k">10,000 commits</span><span class="v">14 steps</span></div>
  <div class="kv"><span class="k">1,000,000 commits</span><span class="v">20 steps</span></div>
</div>
<p>Each answer throws away half the remaining history. That is why bisect scales to the Linux kernel and why it is worth learning properly.</p>

<h3>The manual session</h3>
<pre><code><span class="tok-comment"># 1. Start, and tell Git the two ends of the range.</span>
git bisect start
git bisect bad                 <span class="tok-comment"># HEAD is broken</span>
git bisect good v1.4.0         <span class="tok-comment"># this tag definitely worked</span></code></pre>
<div class="out">Bisecting: 512 revisions left to test after this (roughly 9 steps)
[7b3e9d1a…] refactor(api): extract pagination into a helper</div>
<p>Git has checked out the midpoint. Now do whatever proves the bug present or absent — run the app, run one test, click the button — and answer:</p>
<pre><code>npm test -- auth.test.ts       <span class="tok-comment"># or however you check</span>
git bisect good                <span class="tok-comment"># …or: git bisect bad</span></code></pre>
<div class="out">Bisecting: 255 revisions left to test after this (roughly 8 steps)
[9e2d4b70…] feat(auth): add refresh token rotation</div>
<p>Repeat. After the last answer Git names the culprit:</p>
<div class="out">3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d is the first bad commit
commit 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d
Author: Nguyen Van An &lt;an@example.com&gt;
Date:   Thu Aug 21 14:20:00 2026 +0700

    fix: reject expired refresh tokens on /auth/refresh

 src/services/auth.service.ts | 14 ++++++++++----</div>
<pre><code>git bisect reset               <span class="tok-comment"># ALWAYS finish with this — back to where you started</span></code></pre>
<div class="callout warn">Forgetting <code>git bisect reset</code> leaves you on a detached HEAD in the middle of history. Everything looks wrong, your editor shows old code, and the next <code>git commit</code> lands somewhere nobody will find. If a session ever goes sideways, <code>git bisect reset</code> is always safe.</div>

<h3>Automating it: git bisect run</h3>
${slide('git-02', 14, 'git bisect run và mã thoát')}
<p>If you can express "is the bug present?" as a command that exits 0 for good and non-zero for bad, Git does the whole search unattended:</p>
<pre><code>git bisect start HEAD v1.4.0            <span class="tok-comment"># bad first, then good — same as the two commands</span>
git bisect run npm test -- auth.test.ts</code></pre>
<div class="out">running 'npm test' '--' 'auth.test.ts'
…
3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d is the first bad commit
bisect found first bad commit</div>
<p>Ten builds and ten test runs, with no human in the loop. For a bug you can reproduce in a script, this is the single highest-leverage command in Git.</p>
<p>When there is no test yet, write a throwaway one — it does not need to be pretty, only to exit with the right code:</p>
<pre><code><span class="tok-comment">#!/usr/bin/env bash</span>
<span class="tok-comment"># /tmp/check.sh — exit 0 = good, 1 = bad, 125 = cannot test this commit</span>
npm ci --silent || <span class="tok-keyword">exit</span> 125          <span class="tok-comment"># deps broken here → skip, do not judge</span>
npm run build --silent || <span class="tok-keyword">exit</span> 125    <span class="tok-comment"># does not compile → skip</span>
node -e <span class="tok-string">"const {refreshToken} = require('./dist/auth'); process.exit(refreshToken('expired') ? 1 : 0)"</span></code></pre>
<pre><code>chmod +x /tmp/check.sh
git bisect start HEAD v1.4.0
git bisect run /tmp/check.sh</code></pre>
<div class="callout ok">Exit code <strong>125</strong> is special: it means "this commit cannot be tested" and Git skips it instead of treating it as good or bad. Use it for commits that do not build — otherwise a broken build gets recorded as "bad" and bisect blames the wrong commit entirely.</div>

<h3>Commits you cannot judge</h3>
<pre><code>git bisect skip                 <span class="tok-comment"># this one: does not build / cannot reproduce</span>
git bisect skip v1.4.2..v1.4.5  <span class="tok-comment"># skip a whole known-broken range</span></code></pre>
<p>With enough skips Git may end with several candidates rather than one. That is still a huge win: five commits to read instead of a thousand.</p>

<h3>Useful extras</h3>
<pre><code>git bisect log &gt; /tmp/bisect.log   <span class="tok-comment"># save the session (paste it into the bug report)</span>
git bisect replay /tmp/bisect.log  <span class="tok-comment"># restore it, or hand it to a colleague</span>
git bisect visualize               <span class="tok-comment"># show the remaining range in gitk / log --graph</span>
git bisect terms --term-old=fast --term-new=slow   <span class="tok-comment"># rename good/bad for perf hunts</span></code></pre>
<p>That last one matters more than it looks: bisect is not only for crashes. Hunting a performance regression, a memory leak, or a rendering change works identically — you are just answering a different question at each step.</p>

<h3>How to set up a bisect so it actually works</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Find a real "good" point first</div><div class="lz-d">Verify the bug is genuinely absent there. A wrong "good" makes the whole search meaningless.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Make the test cheap and certain</div><div class="lz-d">One test file, not the whole suite. A flaky test poisons the search — you will bisect to a random commit.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Handle dependencies per step</div><div class="lz-d">Old commits need old packages. Put <code>npm ci</code> in the script, and exit 125 when it fails.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Always reset when done</div><div class="lz-d"><code>git bisect reset</code>, then read the culprit with <code>git show</code>.</div></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In <code>thu-git</code>, plant a bug in a 20-commit history with the script below (zsh, bash, and Git Bash on Windows all run it). Commit 13 silently turns <code>a + b</code> into <code>a - b</code>.</li><li>Manual round: <code>git bisect start HEAD truoc-bisect</code>. At each stop run <code>cat tinh.txt</code> and answer <code>git bisect good</code> (still <code>a + b</code>) or <code>git bisect bad</code>. Count your answers. Finish with <code>git bisect reset</code>.</li><li>Automated round: <code>git bisect start HEAD truoc-bisect</code>, then <code>git bisect run grep -q "a + b" tinh.txt</code> (grep exits 0 when found = good, 1 when not = bad).</li><li><code>git bisect reset</code>, then <code>git status -sb</code>.</li></ol>
<pre><code class="language-bash">echo "tong = a + b" &gt; tinh.txt
git add tinh.txt &amp;&amp; git commit -m "feat: add tinh.txt"
git tag truoc-bisect
for i in $(seq 1 20); do
  if [ $i -eq 13 ]; then echo "tong = a - b" &gt; tinh.txt; else echo "dong $i" &gt;&gt; nhat-ky.txt; fi
  git add -A &amp;&amp; git commit -qm "commit so $i"
done</code></pre>
<div class="out">Bisecting: 9 revisions left to test after this (roughly 3 steps)
…
8d04ea0… is the first bad commit
    commit so 13</div>
<p><strong>Done when:</strong> both rounds name "commit so 13" after about five answers (log₂ 20 ≈ 4.3), and <code>git status -sb</code> shows <code>## main</code> with a clean tree.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Binary search</span><span class="v">Test the middle, discard the half that cannot contain the answer, repeat.</span></div>
  <div class="kv"><span class="k">good / bad</span><span class="v">Your verdict on the checked-out commit: bug absent / bug present.</span></div>
  <div class="kv"><span class="k">First bad commit</span><span class="v">The earliest commit where the check fails — the one that introduced the bug.</span></div>
  <div class="kv"><span class="k">Exit code 125</span><span class="v">Tells <code>bisect run</code> "cannot test this commit" — it is skipped, not judged.</span></div>
  <div class="kv"><span class="k">Flaky test</span><span class="v">A check that passes and fails randomly; it makes bisect confidently wrong.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Each answer halves the range: 1,000 commits ≈ 10 steps, 1,000,000 ≈ 20.</li><li><code>git bisect start &lt;bad&gt; &lt;good&gt;</code>, answer good/bad, always end with <code>git bisect reset</code>.</li><li><code>git bisect run &lt;cmd&gt;</code>: exit 0 = good, 1–127 except 125 = bad, 125 = skip.</li><li>Keep the check script outside the tracked files so checkouts do not touch it.</li><li>Verify your "good" point and make the check deterministic before starting.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-bisect" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">git-bisect — run, skip, terms, replay</span><span class="lc-sub">The "Bisect run" examples in the docs are worth copying verbatim.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: find the breaking commit in a 200-commit repo</span><span class="lc-sub">A graded exercise with a scripted <code>bisect run</code>.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> bisecting with a flaky test. If the test fails intermittently, one wrong answer sends the search down the wrong half and the "first bad commit" is nonsense — with no warning at all. Before starting, run your check three times on a known-bad commit and three times on a known-good one. If it is not deterministic, fix the check first; bisect amplifies flakiness into confident wrong answers.</div>
<p class="note-ct"><strong>Why small commits pay off here:</strong> bisect points at one commit. If that commit changed 40 files, you have narrowed the search to "somewhere in this giant change" — useful, but not an answer. If it changed one function, you are done. Chapter 1.3's advice to commit small has its biggest payoff on the day you run this command.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>"Tháng trước còn chạy mà" — câu trả lời trong mười bước</h2>
<p class="lead">Một lỗi xuất hiện đâu đó trong một nghìn commit gần nhất. Đọc hết là chuyện không tưởng. <code>git bisect</code> làm phép tìm nhị phân: nó checkout điểm giữa, bạn nói lỗi có ở đó không, và nó cắt đôi khoảng còn lại. Một nghìn commit thu về khoảng <strong>mười câu hỏi</strong>, vì log₂(1000) ≈ 10.</p>

<h3>Bảng nhân đôi — vì sao chuyện này giống ảo thuật</h3>
${slide('git-02', 13, 'bisect: mỗi câu trả lời vứt đi một nửa')}
<div class="kv-grid">
  <div class="kv"><span class="k">100 commit</span><span class="v">7 bước</span></div>
  <div class="kv"><span class="k">1.000 commit</span><span class="v">10 bước</span></div>
  <div class="kv"><span class="k">10.000 commit</span><span class="v">14 bước</span></div>
  <div class="kv"><span class="k">1.000.000 commit</span><span class="v">20 bước</span></div>
</div>
<p>Mỗi câu trả lời vứt đi một nửa lịch sử còn lại. Vì thế bisect dùng được cho cả nhân Linux, và vì thế nó đáng học cho tử tế.</p>

<h3>Phiên làm thủ công</h3>
<pre><code><span class="tok-comment"># 1. Bắt đầu, và nói cho Git biết hai đầu của khoảng.</span>
git bisect start
git bisect bad                 <span class="tok-comment"># HEAD đang hỏng</span>
git bisect good v1.4.0         <span class="tok-comment"># tag này chắc chắn từng chạy được</span></code></pre>
<div class="out">Bisecting: 512 revisions left to test after this (roughly 9 steps)
[7b3e9d1a…] refactor(api): extract pagination into a helper</div>
<p>Git đã checkout điểm giữa. Giờ hãy làm bất cứ điều gì chứng minh lỗi có hay không — chạy ứng dụng, chạy một test, bấm cái nút — rồi trả lời:</p>
<pre><code>npm test -- auth.test.ts       <span class="tok-comment"># hoặc bất cứ cách nào bạn kiểm</span>
git bisect good                <span class="tok-comment"># …hoặc: git bisect bad</span></code></pre>
<div class="out">Bisecting: 255 revisions left to test after this (roughly 8 steps)
[9e2d4b70…] feat(auth): add refresh token rotation</div>
<p>Lặp lại. Sau câu trả lời cuối, Git gọi tên thủ phạm:</p>
<div class="out">3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d is the first bad commit
commit 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d
Author: Nguyen Van An &lt;an@example.com&gt;
Date:   Thu Aug 21 14:20:00 2026 +0700

    fix: reject expired refresh tokens on /auth/refresh

 src/services/auth.service.ts | 14 ++++++++++----</div>
<pre><code>git bisect reset               <span class="tok-comment"># LUÔN kết thúc bằng lệnh này — trở lại chỗ bạn đứng lúc đầu</span></code></pre>
<div class="callout warn">Quên <code>git bisect reset</code> sẽ để bạn nằm lại ở một HEAD lìa cành giữa lịch sử. Mọi thứ trông đều sai, trình soạn thảo hiện mã cũ, và lệnh <code>git commit</code> kế tiếp rơi vào một chỗ không ai tìm ra. Nếu một phiên có đi chệch hướng, <code>git bisect reset</code> lúc nào cũng an toàn.</div>

<h3>Tự động hoá: git bisect run</h3>
${slide('git-02', 14, 'git bisect run và mã thoát')}
<p>Nếu bạn diễn đạt được câu "lỗi có ở đây không?" thành một lệnh trả 0 khi tốt và khác 0 khi hỏng, Git chạy cả cuộc tìm mà không cần người:</p>
<pre><code>git bisect start HEAD v1.4.0            <span class="tok-comment"># bad trước, rồi good — như hai lệnh ở trên</span>
git bisect run npm test -- auth.test.ts</code></pre>
<div class="out">running 'npm test' '--' 'auth.test.ts'
…
3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d is the first bad commit
bisect found first bad commit</div>
<p>Mười lần dựng và mười lần chạy test, không có người ngồi canh. Với một lỗi bạn tái hiện được bằng script, đây là lệnh có đòn bẩy lớn nhất trong Git.</p>
<p>Khi chưa có test nào, hãy viết một cái vứt đi — nó không cần đẹp, chỉ cần thoát ra với đúng mã:</p>
<pre><code><span class="tok-comment">#!/usr/bin/env bash</span>
<span class="tok-comment"># /tmp/check.sh — thoát 0 = tốt, 1 = hỏng, 125 = không kiểm được commit này</span>
npm ci --silent || <span class="tok-keyword">exit</span> 125          <span class="tok-comment"># thư viện hỏng ở đây → bỏ qua, đừng phán xét</span>
npm run build --silent || <span class="tok-keyword">exit</span> 125    <span class="tok-comment"># không biên dịch được → bỏ qua</span>
node -e <span class="tok-string">"const {refreshToken} = require('./dist/auth'); process.exit(refreshToken('expired') ? 1 : 0)"</span></code></pre>
<pre><code>chmod +x /tmp/check.sh
git bisect start HEAD v1.4.0
git bisect run /tmp/check.sh</code></pre>
<div class="callout ok">Mã thoát <strong>125</strong> là đặc biệt: nó nghĩa là "commit này không kiểm được", và Git bỏ qua nó thay vì coi là tốt hay hỏng. Hãy dùng nó cho những commit không dựng được — nếu không, một bản dựng hỏng bị ghi nhận là "bad" và bisect sẽ đổ oan cho một commit hoàn toàn khác.</div>

<h3>Những commit bạn không phán xét được</h3>
<pre><code>git bisect skip                 <span class="tok-comment"># cái này: không dựng được / không tái hiện được</span>
git bisect skip v1.4.2..v1.4.5  <span class="tok-comment"># bỏ qua cả một khoảng đã biết là hỏng</span></code></pre>
<p>Với đủ nhiều lần bỏ qua, Git có thể kết thúc với vài ứng viên thay vì một. Đó vẫn là một thắng lợi lớn: đọc năm commit thay vì một nghìn.</p>

<h3>Vài thứ hữu ích thêm</h3>
<pre><code>git bisect log &gt; /tmp/bisect.log   <span class="tok-comment"># lưu lại phiên (dán vào báo cáo lỗi)</span>
git bisect replay /tmp/bisect.log  <span class="tok-comment"># khôi phục nó, hoặc chuyển cho đồng nghiệp</span>
git bisect visualize               <span class="tok-comment"># xem khoảng còn lại trong gitk / log --graph</span>
git bisect terms --term-old=fast --term-new=slow   <span class="tok-comment"># đổi tên good/bad khi săn hiệu năng</span></code></pre>
<p>Lệnh cuối quan trọng hơn vẻ ngoài của nó: bisect không chỉ dùng cho lỗi sập. Săn một bước lùi hiệu năng, một rò rỉ bộ nhớ, hay một thay đổi hiển thị đều làm y hệt — bạn chỉ trả lời một câu hỏi khác ở mỗi bước.</p>

<h3>Cách chuẩn bị một phiên bisect để nó thật sự chạy đúng</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Tìm một điểm "good" thật trước đã</div><div class="lz-d">Xác minh lỗi thật sự KHÔNG có ở đó. Một chữ "good" sai làm cả cuộc tìm trở nên vô nghĩa.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Làm phép kiểm rẻ và chắc chắn</div><div class="lz-d">Một file test, không phải cả bộ. Một test chớp nháy đầu độc cuộc tìm — bạn sẽ bisect ra một commit ngẫu nhiên.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Xử lý thư viện ở từng bước</div><div class="lz-d">Commit cũ cần gói cũ. Hãy đặt <code>npm ci</code> vào script, và thoát 125 khi nó hỏng.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Luôn reset khi xong</div><div class="lz-d"><code>git bisect reset</code>, rồi đọc thủ phạm bằng <code>git show</code>.</div></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong <code>thu-git</code>, cấy một con lỗi vào lịch sử 20 commit bằng đoạn script dưới đây (chạy được trên zsh, bash và Git Bash của Windows). Commit 13 lặng lẽ đổi <code>a + b</code> thành <code>a - b</code>.</li><li>Vòng làm tay: <code>git bisect start HEAD truoc-bisect</code>. Mỗi lần Git dừng, chạy <code>cat tinh.txt</code> rồi trả lời <code>git bisect good</code> (vẫn là <code>a + b</code>) hoặc <code>git bisect bad</code>. Đếm số câu trả lời. Kết thúc bằng <code>git bisect reset</code>.</li><li>Vòng tự động: <code>git bisect start HEAD truoc-bisect</code>, rồi <code>git bisect run grep -q "a + b" tinh.txt</code> (grep thoát 0 khi tìm thấy = tốt, 1 khi không thấy = hỏng).</li><li><code>git bisect reset</code>, rồi <code>git status -sb</code>.</li></ol>
<pre><code class="language-bash">echo "tong = a + b" &gt; tinh.txt
git add tinh.txt &amp;&amp; git commit -m "feat: add tinh.txt"
git tag truoc-bisect
for i in $(seq 1 20); do
  if [ $i -eq 13 ]; then echo "tong = a - b" &gt; tinh.txt; else echo "dong $i" &gt;&gt; nhat-ky.txt; fi
  git add -A &amp;&amp; git commit -qm "commit so $i"
done</code></pre>
<div class="out">Bisecting: 9 revisions left to test after this (roughly 3 steps)
…
8d04ea0… is the first bad commit
    commit so 13</div>
<p><strong>Đạt khi:</strong> cả hai vòng đều gọi tên "commit so 13" sau khoảng năm câu trả lời (log₂ 20 ≈ 4,3), và <code>git status -sb</code> hiện <code>## main</code> với cây làm việc sạch.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Binary search</span><span class="v">Tìm nhị phân — kiểm điểm giữa, vứt nửa không thể chứa đáp án, lặp lại.</span></div>
  <div class="kv"><span class="k">good / bad</span><span class="v">Tốt / hỏng — phán quyết của bạn cho commit đang được checkout: không có lỗi / có lỗi.</span></div>
  <div class="kv"><span class="k">First bad commit</span><span class="v">Commit hỏng đầu tiên — commit sớm nhất mà phép kiểm thất bại, tức commit gây ra lỗi.</span></div>
  <div class="kv"><span class="k">Exit code 125</span><span class="v">Mã thoát 125 — báo cho <code>bisect run</code> "không kiểm được commit này", nó bị bỏ qua chứ không bị phán xét.</span></div>
  <div class="kv"><span class="k">Flaky test</span><span class="v">Test chớp nháy — lúc qua lúc hỏng ngẫu nhiên; làm bisect sai một cách đầy tự tin.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Mỗi câu trả lời cắt đôi khoảng: 1.000 commit ≈ 10 bước, 1.000.000 ≈ 20.</li><li><code>git bisect start &lt;hỏng&gt; &lt;tốt&gt;</code>, trả lời good/bad, luôn kết thúc bằng <code>git bisect reset</code>.</li><li><code>git bisect run &lt;lệnh&gt;</code>: thoát 0 = tốt, 1–127 trừ 125 = hỏng, 125 = bỏ qua.</li><li>Để script kiểm NGOÀI các file được theo dõi để các lần checkout không đụng tới nó.</li><li>Xác minh điểm "tốt" và làm phép kiểm tất định trước khi bắt đầu.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/git-bisect" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">git-bisect — run, skip, terms, replay</span><span class="lc-sub">Các ví dụ "Bisect run" trong tài liệu đáng chép lại nguyên văn.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: tìm commit gây hỏng trong một kho 200 commit</span><span class="lc-sub">Bài tập chấm điểm kèm một <code>bisect run</code> viết sẵn.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> bisect với một test chớp nháy. Nếu test hỏng lúc được lúc không, một câu trả lời sai đẩy cuộc tìm xuống nửa sai và "commit hỏng đầu tiên" trở thành vô nghĩa — mà không có một lời cảnh báo nào. Trước khi bắt đầu, hãy chạy phép kiểm ba lần trên một commit đã biết là hỏng và ba lần trên một commit đã biết là tốt. Nếu nó không tất định, hãy sửa phép kiểm trước; bisect khuếch đại sự chớp nháy thành những câu trả lời sai đầy tự tin.</div>
<p class="note-ct"><strong>Vì sao commit nhỏ sinh lời ở đây:</strong> bisect chỉ vào MỘT commit. Nếu commit đó đổi 40 file, bạn mới thu hẹp được thành "đâu đó trong cái thay đổi khổng lồ này" — hữu ích, nhưng chưa phải câu trả lời. Nếu nó đổi một hàm, bạn xong việc. Lời khuyên commit nhỏ ở bài 1.3 sinh lời lớn nhất vào đúng ngày bạn chạy lệnh này.</p>
</div>
`,
    },

    /* ─────────────────────────── 2.5 ─────────────────────────── */
    {
      title: '2.5 — A real investigation, end to end|||2.5 — Một cuộc điều tra thật, từ đầu tới cuối',
      slug: 'git-2-5-dieu-tra-thuc-te',
      type: 'LESSON',
      description: 'Ghép cả chương lại: một lỗi production thật ("phiên đăng nhập không bao giờ hết hạn") điều tra bằng log, grep, pickaxe, blame và bisect — kèm cả những ngã rẽ sai và cách nhận ra mình đang đi sai.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>The tools are easy. Choosing the right one is the skill.</h2>
<p class="lead">Four commands, one real bug. This lesson is a transcript rather than a reference: the same investigation a working developer runs, including the two dead ends, because knowing when you are on the wrong road is most of the skill.</p>

<div class="callout warn"><strong>The report:</strong> "Users are staying logged in far longer than 24 hours. Someone got in this morning with a token from six weeks ago." Nobody knows when it started. The repository has 2,400 commits and eleven contributors.</div>

<h3>Step 1 — Find the code, not the commit (git grep)</h3>
<p>Before history, find the mechanism. <code>git grep</code> over tracked files only, so no time is wasted in <code>node_modules/</code>:</p>
<pre><code>git grep -n <span class="tok-string">"expiresIn\\|ignoreExpiration\\|JWT_EXPIRES"</span> -- <span class="tok-string">'src/**/*.ts'</span></code></pre>
<div class="out">src/config/env.ts:41:  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '24h',
src/services/auth.service.ts:23:    { expiresIn: config.JWT_EXPIRES_IN },
src/services/auth.service.ts:48:    const payload = jwt.verify(token, SECRET, { ignoreExpiration: true });</div>
<p>Line 48 is immediately suspicious: verification with <code>ignoreExpiration: true</code>. But suspicion is not evidence — the flag may be deliberate, with the expiry checked somewhere else. History will say.</p>

<h3>Step 2 — Who wrote that line, and why (git blame → git show)</h3>
<pre><code>git blame -w -C -L 44,52 -- src/services/auth.service.ts</code></pre>
<div class="out">7b3e9d1a (Tran Thi Binh 2026-06-14 09:12:03 +0700 44) export async function refreshToken(token: string) {
c4a8f2e1 (Nguyen Van An  2026-07-02 16:41:55 +0700 48)   const payload = jwt.verify(token, SECRET, { ignoreExpiration: true });
7b3e9d1a (Tran Thi Binh 2026-06-14 09:12:03 +0700 49)   const user = await prisma.user.findUnique(…</div>
<p>The flag arrived on 2 July in <code>c4a8f2e1</code>, later than the surrounding function. Read that commit:</p>
<pre><code>git show c4a8f2e1</code></pre>
<div class="out">commit c4a8f2e1…
    fix(auth): add /auth/refresh so 24h sessions stop dying silently

    The backend_token cookie lives 7 days but JWT_EXPIRES_IN is 24h, and
    there was no working refresh route, so every authed call 401'd after a
    day. Verify with ignoreExpiration and then re-check the account, so an
    expired-but-valid token can mint a new one.</div>
<div class="callout ok">This is the moment the commit message earns its keep. The flag was <strong>deliberate</strong> — it exists so an expired token can be exchanged for a fresh one. The bug is not that the flag is there; it is that the promised "re-check" never checks <code>exp</code>. Without this message we would have deleted the flag and broken refresh for everyone.</div>

<h3>Step 3 — A dead end worth showing (git log on the file)</h3>
${slide('git-02', 16, 'Hai ngã cụt và đường thu hẹp')}
<p>The instinct now is to read everything that touched the file:</p>
<pre><code>git log --oneline -- src/services/auth.service.ts | wc -l</code></pre>
<div class="out">147</div>
<p>147 commits. Too many, and most are unrelated — renames, logging, formatting. This is where people give up and start guessing. Narrow instead of browsing.</p>

<h3>Step 4 — When was the lifetime last changed? (the pickaxe)</h3>
<pre><code>git log -S<span class="tok-string">"JWT_EXPIRES_IN"</span> --oneline --all</code></pre>
<div class="out">e91f4a7 chore(config): default JWT_EXPIRES_IN to 24h
c4a8f2e fix(auth): add /auth/refresh so 24h sessions stop dying silently
2b7d0c5 feat(auth): read token lifetime from env instead of hard-coding</div>
<p>Three commits in 2,400 — the entire life of that setting. <code>-S</code> matched only commits where the number of occurrences <em>changed</em>, so the 147 noise commits are gone. Nothing here weakened the expiry, which strengthens the theory that the hole is in the refresh path itself.</p>

<h3>Step 5 — Confirm with a test, then bisect</h3>
<p>Write the smallest possible check. It must be deterministic — a flaky check makes bisect confidently wrong:</p>
<pre><code><span class="tok-comment">// test/refresh-expiry.test.ts — mint a token that expired an hour ago</span>
<span class="tok-keyword">const</span> old = jwt.sign({ sub: 1, exp: Math.floor(Date.now()/1000) - 3600 }, SECRET);
<span class="tok-keyword">await</span> expect(refreshToken(old)).rejects.toThrow();   <span class="tok-comment">// must REJECT</span></code></pre>
<pre><code>npx vitest run test/refresh-expiry.test.ts     <span class="tok-comment"># fails on HEAD → the bug is real</span>
git stash                                       <span class="tok-comment"># keep the test out of the checkouts</span>
git bisect start HEAD v1.3.0
git bisect run sh -c <span class="tok-string">"git stash pop || true; npx vitest run test/refresh-expiry.test.ts; r=\$?; git stash -u; exit \$r"</span></code></pre>
<div class="out">c4a8f2e1… is the first bad commit
    fix(auth): add /auth/refresh so 24h sessions stop dying silently
 src/services/auth.service.ts | 22 ++++++++++++++++++++++</div>
<p>Bisect lands on the same commit blame pointed at. Two independent methods agreeing is what turns a theory into a diagnosis.</p>
<div class="callout warn">Note the awkward stash dance. The test file does not exist in old commits, so it must be carried across each checkout. In a real repository the cleaner route is to put the test in <code>/tmp</code> and run it from there — bisect changes tracked files, and anything untracked survives the checkouts untouched.</div>

<h3>Step 6 — The second dead end: blaming the config</h3>
<p>A plausible competing theory: someone changed <code>JWT_EXPIRES_IN</code> on the server. Check whether the code could even express that:</p>
<pre><code>git log -p -1 e91f4a7 -- src/config/env.ts | head -20</code></pre>
<div class="out">+  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '24h',</div>
<p>The value comes from the environment, so the repository cannot answer it — that is a question for the server, not for Git. Worth ruling out explicitly rather than leaving it as a nagging maybe. <strong>Knowing which questions Git cannot answer is part of using it well.</strong></p>

<h3>Step 7 — Write the fix, and the message the next person needs</h3>
<pre><code>git commit -m <span class="tok-string">"fix: reject expired refresh tokens on /auth/refresh"</span> -m <span class="tok-string">"c4a8f2e added ignoreExpiration so an expired token could be exchanged
for a fresh one, but the promised re-check only verified the account,
never exp. A six-week-old token therefore still minted access tokens.

Verify with ignoreExpiration, then compare exp against now explicitly,
so refresh enforces the same lifetime as the access path.

Found with: git log -S JWT_EXPIRES_IN, then bisect from v1.3.0."</span></code></pre>
<div class="callout ok">The message names the commit that introduced the behaviour, explains why that commit was reasonable, and records how the bug was found. In eighteen months someone will run <code>git blame</code> on this line — and get a complete story instead of a hash.</div>

<h3>The decision table</h3>
${slide('git-02', 15, 'Cuộc điều tra: năm lệnh, một thủ phạm')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Where is this code?</span><span class="lz-v"><code>git grep -n "pattern" -- '*.ts'</code></span></div>
  <div class="lz-layer"><span class="lz-k">Why does this line exist?</span><span class="lz-v"><code>git blame -w -C -L a,b -- file</code> → <code>git show &lt;hash&gt;</code></span></div>
  <div class="lz-layer"><span class="lz-k">When did this string appear or vanish?</span><span class="lz-v"><code>git log -S"string" --oneline --all</code></span></div>
  <div class="lz-layer"><span class="lz-k">Which commit broke it?</span><span class="lz-v"><code>git bisect start HEAD &lt;good&gt;</code> → <code>git bisect run &lt;check&gt;</code></span></div>
  <div class="lz-layer"><span class="lz-k">What shipped in this release?</span><span class="lz-v"><code>git log --oneline v1.4.0..v1.5.0</code></span></div>
  <div class="lz-layer"><span class="lz-k">What did this file look like then?</span><span class="lz-v"><code>git show v1.4.0:path/to/file</code></span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Ask a classmate from your project group to run the script below in your <code>thu-git</code> (or run it yourself without reading the <code>case</code> lines). One of the 12 commits turns a 24-hour session into 2400 hours; another one only reformats that line.</li><li>Investigate like lesson 2.5: <code>git grep -n SESSION_HOURS</code> → <code>git blame session.conf</code> → <code>git blame -w session.conf</code> → <code>git show &lt;hash&gt;</code>.</li><li>Confirm with the pickaxe: <code>git log -S"2400" --oneline</code>.</li><li>Confirm independently with bisect: <code>git bisect start HEAD phien-ok</code>, then <code>git bisect run sh -c '! grep -q 2400 session.conf'</code>, then <code>git bisect reset</code>.</li><li>Fix it (<code>SESSION_HOURS = 24</code>) and write a commit message that names the guilty hash and how you found it.</li></ol>
<pre><code class="language-bash">echo "SESSION_HOURS=24" &gt; session.conf
git add session.conf &amp;&amp; git commit -m "feat: session lifetime config" --author="Tran Thi Binh &lt;binh@example.com&gt;"
git tag phien-ok
for i in $(seq 1 12); do
  case $i in
    5) echo "SESSION_HOURS=2400" &gt; session.conf; msg="chore: tidy config" ;;
    9) echo "SESSION_HOURS = 2400" &gt; session.conf; msg="style: spaces around =" ;;
    *) echo "note $i" &gt;&gt; notes.txt; msg="docs: note $i" ;;
  esac
  git add -A &amp;&amp; git commit -qm "$msg"
done</code></pre>
<p><strong>Done when:</strong> plain <code>blame</code> points at "style: spaces around =" (the dead end), while <code>blame -w</code>, <code>-S"2400"</code> and <code>bisect run</code> all name the same "chore: tidy config" commit, and your fix message quotes that hash.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hypothesis</span><span class="v">A guess about the cause that you then test with history — not yet a diagnosis.</span></div>
  <div class="kv"><span class="k">Dead end</span><span class="v">A road that looks like progress but cannot answer the question (reading 147 commits, blaming server config).</span></div>
  <div class="kv"><span class="k">Deterministic check</span><span class="v">A test that gives the same answer every run — the precondition for bisect.</span></div>
  <div class="kv"><span class="k">Culprit commit</span><span class="v">The commit that introduced the behaviour; read its message before "fixing" it.</span></div>
  <div class="kv"><span class="k">Root cause</span><span class="v">The real reason, as opposed to the symptom or the first suspicious line.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Start from the code (<code>git grep</code>), never from browsing <code>git log</code>.</li><li>Get a hash with <code>blame -w</code>, read the reasoning with <code>show</code>.</li><li>Narrow history with a filter that matches the question: <code>-S</code>, a path, a range.</li><li>Two independent methods agreeing (blame + bisect) turn a theory into a diagnosis.</li><li>Know what Git cannot answer (server env values) and write a fix message that records how you found the bug.</li></ul>

<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: run this investigation on a seeded repository</span><span class="lc-sub">The Code Lab exercise plants a similar bug and grades your diagnosis.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Tools-Debugging-with-Git" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 7.10 — Debugging with Git</span><span class="lc-sub">The official chapter on blame and bisect, with a worked example.</span></span>
</a>

<div class="pitfall"><strong>The trap that costs the most time:</strong> starting with <code>git log</code> on the whole repository and reading. It feels like progress and almost never finds anything — 2,400 subject lines are not searchable by eye. Start from the <em>code</em> (grep), get a hash (blame), then narrow history with a filter that matches the actual question (<code>-S</code>, a path, a range). Browse last, never first.</div>
<p class="note-ct"><strong>The habit worth taking from this lesson:</strong> when you find the culprit, do not stop at "who". Read the commit message and ask why that change was reasonable at the time — as it was here. Fixes written without that step tend to re-break whatever the original commit was protecting, and you meet the same bug from the other side a month later.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Công cụ thì dễ. Chọn đúng công cụ mới là kỹ năng.</h2>
<p class="lead">Bốn lệnh, một lỗi thật. Bài này là một bản ghi hiện trường chứ không phải tài liệu tra cứu: đúng cuộc điều tra mà một lập trình viên đang đi làm sẽ chạy, kể cả hai ngã cụt, vì biết mình đang đi sai đường mới là phần lớn của kỹ năng.</p>

<div class="callout warn"><strong>Báo cáo:</strong> "Người dùng vẫn đăng nhập lâu hơn 24 giờ rất nhiều. Sáng nay có người vào được bằng một token từ sáu tuần trước." Không ai biết nó bắt đầu từ bao giờ. Kho mã có 2.400 commit và mười một người đóng góp.</div>

<h3>Bước 1 — Tìm mã, chưa tìm commit (git grep)</h3>
<p>Trước lịch sử, hãy tìm cơ chế. <code>git grep</code> chỉ chạy trên file được theo dõi, nên không phí thời gian trong <code>node_modules/</code>:</p>
<pre><code>git grep -n <span class="tok-string">"expiresIn\\|ignoreExpiration\\|JWT_EXPIRES"</span> -- <span class="tok-string">'src/**/*.ts'</span></code></pre>
<div class="out">src/config/env.ts:41:  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '24h',
src/services/auth.service.ts:23:    { expiresIn: config.JWT_EXPIRES_IN },
src/services/auth.service.ts:48:    const payload = jwt.verify(token, SECRET, { ignoreExpiration: true });</div>
<p>Dòng 48 lập tức đáng ngờ: xác minh với <code>ignoreExpiration: true</code>. Nhưng nghi ngờ chưa phải bằng chứng — cái cờ đó có thể là cố ý, còn hạn dùng được kiểm ở chỗ khác. Lịch sử sẽ nói.</p>

<h3>Bước 2 — Ai viết dòng đó, và vì sao (git blame → git show)</h3>
<pre><code>git blame -w -C -L 44,52 -- src/services/auth.service.ts</code></pre>
<div class="out">7b3e9d1a (Tran Thi Binh 2026-06-14 09:12:03 +0700 44) export async function refreshToken(token: string) {
c4a8f2e1 (Nguyen Van An  2026-07-02 16:41:55 +0700 48)   const payload = jwt.verify(token, SECRET, { ignoreExpiration: true });
7b3e9d1a (Tran Thi Binh 2026-06-14 09:12:03 +0700 49)   const user = await prisma.user.findUnique(…</div>
<p>Cái cờ xuất hiện ngày 2 tháng 7 trong <code>c4a8f2e1</code>, muộn hơn phần hàm bao quanh. Đọc commit đó:</p>
<pre><code>git show c4a8f2e1</code></pre>
<div class="out">commit c4a8f2e1…
    fix(auth): add /auth/refresh so 24h sessions stop dying silently

    The backend_token cookie lives 7 days but JWT_EXPIRES_IN is 24h, and
    there was no working refresh route, so every authed call 401'd after a
    day. Verify with ignoreExpiration and then re-check the account, so an
    expired-but-valid token can mint a new one.</div>
<div class="callout ok">Đây là khoảnh khắc lời nhắn commit trả công cho công sức viết nó. Cái cờ là <strong>cố ý</strong> — nó tồn tại để một token hết hạn đổi lấy được một token mới. Lỗi không nằm ở việc cờ đó có mặt; lỗi là bước "kiểm lại" được hứa hẹn chẳng bao giờ kiểm <code>exp</code>. Không có lời nhắn này thì ta đã xoá cái cờ đi và làm hỏng chức năng refresh của tất cả mọi người.</div>

<h3>Bước 3 — Một ngã cụt đáng nêu ra (git log trên file)</h3>
${slide('git-02', 16, 'Hai ngã cụt và đường thu hẹp')}
<p>Bản năng lúc này là đọc mọi thứ từng chạm vào file:</p>
<pre><code>git log --oneline -- src/services/auth.service.ts | wc -l</code></pre>
<div class="out">147</div>
<p>147 commit. Quá nhiều, và phần lớn không liên quan — đổi tên, thêm log, định dạng lại. Đây là chỗ người ta bỏ cuộc và bắt đầu đoán. Hãy THU HẸP thay vì lướt.</p>

<h3>Bước 4 — Tuổi thọ token bị đổi lần cuối khi nào? (cái cuốc chim)</h3>
<pre><code>git log -S<span class="tok-string">"JWT_EXPIRES_IN"</span> --oneline --all</code></pre>
<div class="out">e91f4a7 chore(config): default JWT_EXPIRES_IN to 24h
c4a8f2e fix(auth): add /auth/refresh so 24h sessions stop dying silently
2b7d0c5 feat(auth): read token lifetime from env instead of hard-coding</div>
<p>Ba commit trong số 2.400 — toàn bộ cuộc đời của thiết lập đó. <code>-S</code> chỉ khớp những commit mà số lần xuất hiện <em>thay đổi</em>, nên 147 commit nhiễu biến mất. Không có gì ở đây làm yếu hạn dùng, điều này củng cố giả thuyết rằng lỗ hổng nằm ngay trong đường refresh.</p>

<h3>Bước 5 — Xác nhận bằng một test, rồi bisect</h3>
<p>Viết phép kiểm nhỏ nhất có thể. Nó phải tất định — một phép kiểm chớp nháy làm bisect sai một cách đầy tự tin:</p>
<pre><code><span class="tok-comment">// test/refresh-expiry.test.ts — đúc một token đã hết hạn một giờ trước</span>
<span class="tok-keyword">const</span> old = jwt.sign({ sub: 1, exp: Math.floor(Date.now()/1000) - 3600 }, SECRET);
<span class="tok-keyword">await</span> expect(refreshToken(old)).rejects.toThrow();   <span class="tok-comment">// phải TỪ CHỐI</span></code></pre>
<pre><code>npx vitest run test/refresh-expiry.test.ts     <span class="tok-comment"># hỏng trên HEAD → lỗi là thật</span>
git stash                                       <span class="tok-comment"># giữ file test ra khỏi các lần checkout</span>
git bisect start HEAD v1.3.0
git bisect run sh -c <span class="tok-string">"git stash pop || true; npx vitest run test/refresh-expiry.test.ts; r=\$?; git stash -u; exit \$r"</span></code></pre>
<div class="out">c4a8f2e1… is the first bad commit
    fix(auth): add /auth/refresh so 24h sessions stop dying silently
 src/services/auth.service.ts | 22 ++++++++++++++++++++++</div>
<p>Bisect đáp xuống đúng commit mà blame đã chỉ tới. Hai phương pháp độc lập đồng ý với nhau là thứ biến một giả thuyết thành một chẩn đoán.</p>
<div class="callout warn">Để ý màn stash lúng túng đó. File test không tồn tại trong các commit cũ, nên phải mang nó qua từng lần checkout. Trong kho mã thật, đường sạch hơn là để file test ở <code>/tmp</code> và chạy từ đó — bisect chỉ đổi các file được theo dõi, còn thứ chưa theo dõi thì sống sót nguyên vẹn qua mọi lần checkout.</div>

<h3>Bước 6 — Ngã cụt thứ hai: đổ cho cấu hình</h3>
<p>Một giả thuyết cạnh tranh nghe rất hợp lý: ai đó đã đổi <code>JWT_EXPIRES_IN</code> trên máy chủ. Hãy kiểm xem mã có diễn đạt nổi điều đó không:</p>
<pre><code>git log -p -1 e91f4a7 -- src/config/env.ts | head -20</code></pre>
<div class="out">+  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '24h',</div>
<p>Giá trị đến từ môi trường, nên kho mã không trả lời được — đó là câu hỏi dành cho máy chủ, không dành cho Git. Đáng loại trừ một cách tường minh thay vì để nó lởn vởn như một cái "có thể". <strong>Biết câu hỏi nào Git KHÔNG trả lời được cũng là một phần của việc dùng Git giỏi.</strong></p>

<h3>Bước 7 — Viết bản vá, và lời nhắn mà người sau cần</h3>
<pre><code>git commit -m <span class="tok-string">"fix: tu choi refresh token da het han o /auth/refresh"</span> -m <span class="tok-string">"c4a8f2e them ignoreExpiration de mot token het han doi duoc token moi,
nhung buoc kiem lai duoc hua hen chi xac minh tai khoan, chua bao gio
kiem exp. Mot token sau tuan tuoi vi the van duc ra access token.

Xac minh voi ignoreExpiration, roi so exp voi hien tai mot cach tuong
minh, de duong refresh ap dung tuoi tho nhu duong access.

Tim ra bang: git log -S JWT_EXPIRES_IN, roi bisect tu v1.3.0."</span></code></pre>
<div class="callout ok">Lời nhắn gọi tên commit đã tạo ra hành vi này, giải thích vì sao commit đó là hợp lý, và ghi lại cách tìm ra lỗi. Mười tám tháng nữa sẽ có người chạy <code>git blame</code> lên dòng này — và nhận được một câu chuyện hoàn chỉnh thay vì một mã băm.</div>

<h3>Bảng quyết định</h3>
${slide('git-02', 15, 'Cuộc điều tra: năm lệnh, một thủ phạm')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Mã này nằm ở đâu?</span><span class="lz-v"><code>git grep -n "mẫu" -- '*.ts'</code></span></div>
  <div class="lz-layer"><span class="lz-k">Vì sao dòng này tồn tại?</span><span class="lz-v"><code>git blame -w -C -L a,b -- file</code> → <code>git show &lt;mã băm&gt;</code></span></div>
  <div class="lz-layer"><span class="lz-k">Chuỗi này xuất hiện hay biến mất khi nào?</span><span class="lz-v"><code>git log -S"chuỗi" --oneline --all</code></span></div>
  <div class="lz-layer"><span class="lz-k">Commit nào làm hỏng?</span><span class="lz-v"><code>git bisect start HEAD &lt;good&gt;</code> → <code>git bisect run &lt;phép kiểm&gt;</code></span></div>
  <div class="lz-layer"><span class="lz-k">Bản phát hành này có gì?</span><span class="lz-v"><code>git log --oneline v1.4.0..v1.5.0</code></span></div>
  <div class="lz-layer"><span class="lz-k">Hồi đó file này trông thế nào?</span><span class="lz-v"><code>git show v1.4.0:đường/dẫn/file</code></span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Nhờ một bạn trong nhóm đồ án chạy đoạn script dưới đây trong <code>thu-git</code> của bạn (hoặc tự chạy nhưng đừng đọc mấy dòng <code>case</code>). Một trong 12 commit biến phiên đăng nhập 24 giờ thành 2400 giờ; một commit khác chỉ định dạng lại đúng dòng đó.</li><li>Điều tra như bài 2.5: <code>git grep -n SESSION_HOURS</code> → <code>git blame session.conf</code> → <code>git blame -w session.conf</code> → <code>git show &lt;mã băm&gt;</code>.</li><li>Xác nhận bằng cái cuốc chim: <code>git log -S"2400" --oneline</code>.</li><li>Xác nhận độc lập bằng bisect: <code>git bisect start HEAD phien-ok</code>, rồi <code>git bisect run sh -c '! grep -q 2400 session.conf'</code>, rồi <code>git bisect reset</code>.</li><li>Sửa lại (<code>SESSION_HOURS = 24</code>) và viết lời nhắn commit gọi tên mã băm thủ phạm cùng cách bạn tìm ra nó.</li></ol>
<pre><code class="language-bash">echo "SESSION_HOURS=24" &gt; session.conf
git add session.conf &amp;&amp; git commit -m "feat: session lifetime config" --author="Tran Thi Binh &lt;binh@example.com&gt;"
git tag phien-ok
for i in $(seq 1 12); do
  case $i in
    5) echo "SESSION_HOURS=2400" &gt; session.conf; msg="chore: tidy config" ;;
    9) echo "SESSION_HOURS = 2400" &gt; session.conf; msg="style: spaces around =" ;;
    *) echo "note $i" &gt;&gt; notes.txt; msg="docs: note $i" ;;
  esac
  git add -A &amp;&amp; git commit -qm "$msg"
done</code></pre>
<p><strong>Đạt khi:</strong> <code>blame</code> trần chỉ vào "style: spaces around =" (ngã cụt), còn <code>blame -w</code>, <code>-S"2400"</code> và <code>bisect run</code> cùng gọi tên một commit "chore: tidy config", và lời nhắn bản vá của bạn trích đúng mã băm đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Hypothesis</span><span class="v">Giả thuyết — một phỏng đoán về nguyên nhân, cần kiểm bằng lịch sử; chưa phải chẩn đoán.</span></div>
  <div class="kv"><span class="k">Dead end</span><span class="v">Ngã cụt — con đường trông như đang tiến nhưng không trả lời được câu hỏi (đọc 147 commit, đổ cho cấu hình server).</span></div>
  <div class="kv"><span class="k">Deterministic check</span><span class="v">Phép kiểm tất định — chạy lần nào cũng cho cùng kết quả; điều kiện bắt buộc của bisect.</span></div>
  <div class="kv"><span class="k">Culprit commit</span><span class="v">Commit thủ phạm — commit đưa hành vi đó vào; đọc lời nhắn của nó trước khi "sửa".</span></div>
  <div class="kv"><span class="k">Root cause</span><span class="v">Nguyên nhân gốc — lý do thật, khác với triệu chứng hay dòng đáng ngờ đầu tiên.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Bắt đầu từ mã (<code>git grep</code>), đừng bao giờ bắt đầu bằng việc lướt <code>git log</code>.</li><li>Lấy mã băm bằng <code>blame -w</code>, đọc lý lẽ bằng <code>show</code>.</li><li>Thu hẹp lịch sử bằng bộ lọc khớp câu hỏi: <code>-S</code>, một đường dẫn, một khoảng.</li><li>Hai phương pháp độc lập cùng đồng ý (blame + bisect) biến giả thuyết thành chẩn đoán.</li><li>Biết câu nào Git không trả lời được (giá trị env trên server), và viết lời nhắn bản vá ghi lại cách tìm ra lỗi.</li></ul>

<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: chạy cuộc điều tra này trên một kho đã gieo sẵn lỗi</span><span class="lc-sub">Bài tập Code Lab cấy một lỗi tương tự và chấm điểm chẩn đoán của bạn.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Tools-Debugging-with-Git" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 7.10 (tiếng Việt) — Gỡ lỗi với Git</span><span class="lc-sub">Chương chính thức về blame và bisect, kèm một ví dụ chạy trọn vẹn.</span></span>
</a>

<div class="pitfall"><strong>Cái bẫy tốn thời gian nhất:</strong> bắt đầu bằng <code>git log</code> trên cả kho mã rồi ngồi đọc. Nó cho cảm giác đang tiến triển và gần như không bao giờ tìm ra gì — 2.400 dòng tiêu đề không phải thứ tìm được bằng mắt. Hãy bắt đầu từ <em>mã</em> (grep), lấy một mã băm (blame), rồi thu hẹp lịch sử bằng một bộ lọc khớp với đúng câu hỏi (<code>-S</code>, một đường dẫn, một khoảng). Lướt là việc cuối cùng, không bao giờ là việc đầu tiên.</div>
<p class="note-ct"><strong>Thói quen đáng lấy từ bài này:</strong> khi tìm ra thủ phạm, đừng dừng ở chữ "ai". Hãy đọc lời nhắn commit và hỏi vì sao thay đổi đó là hợp lý vào thời điểm đó — như trường hợp ở đây. Những bản vá viết mà bỏ qua bước này thường phá lại đúng thứ mà commit gốc đang bảo vệ, và một tháng sau bạn gặp lại cùng con lỗi ấy từ phía bên kia.</p>
</div>
`,
    },

    /* ─────────────────────────── 2.6 Quiz ─────────────────────────── */
    {
      title: '2.6 — Chapter 2 quiz|||2.6 — Kiểm tra Chương 2',
      slug: 'git-2-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống thật về đọc lịch sử: khoảng hai chấm/ba chấm, lọc git log, đọc file ở quá khứ, blame qua commit định dạng lại, cái cuốc chim, --follow và bisect (kể cả mã thoát 125) — có giải thích từng câu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from real team work — each one is decided by picking the right history tool. Read the explanation after submitting, especially for the ones you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say what <code>main..feature</code> and <code>feature..main</code> list, and which one to run before a push.</li>
<li>I can read a file as it was at a tag without touching my working directory.</li>
<li>I know why <code>git diff main feature</code> can show files as deleted that nobody deleted.</li>
<li>I can get past a formatting commit in blame, and find code that no longer exists.</li>
<li>I can run <code>git bisect run</code> with a script and know what exit codes 0, 1 and 125 mean.</li>
</ul>
${slide('git-02', 17, 'Bảng tra nhanh Chương 2')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ việc làm nhóm thật — câu nào cũng được quyết định bằng việc chọn đúng công cụ đọc lịch sử. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được <code>main..feature</code> và <code>feature..main</code> liệt kê gì, và nên chạy cái nào trước khi push.</li>
<li>Tôi đọc được một file như nó có ở một tag mà không đụng vào thư mục làm việc.</li>
<li>Tôi biết vì sao <code>git diff main feature</code> có thể hiện những file "bị xoá" mà không ai xoá.</li>
<li>Tôi vượt qua được commit định dạng lại khi blame, và tìm được mã đã không còn tồn tại.</li>
<li>Tôi chạy được <code>git bisect run</code> với một script và biết mã thoát 0, 1 và 125 nghĩa là gì.</li>
</ul>
${slide('git-02', 17, 'Bảng tra nhanh Chương 2')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You are about to push to main and want to see exactly which of your commits will go up. Which command?|||Bạn sắp push lên main và muốn xem chính xác những commit nào của mình sẽ được đẩy lên. Lệnh nào?',
            options: [
              'git log --oneline main..origin/main',
              'git diff origin/main --stat',
              'git log --oneline origin/main..main',
              'git log --oneline --all',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: A..B lists what B has that A lacks, so origin/main..main = your local commits the remote does not have yet. The tempting mirror main..origin/main lists what OTHERS pushed that you have not pulled — the opposite question. git diff shows file content, not which commits.|||VI: A..B liệt kê những gì B có mà A thiếu, nên origin/main..main = các commit cục bộ mà remote chưa có. Bản soi gương main..origin/main nghe giống nhưng liệt kê thứ NGƯỜI KHÁC đã đẩy mà bạn chưa kéo về — câu hỏi ngược lại. git diff cho thấy nội dung file, không cho biết commit nào.',
          },
          {
            question: 'In your SWP391 group, the leader asks: "What did An change in src/payment/ during the last week?" Which command answers exactly that?|||Trong nhóm SWP391, trưởng nhóm hỏi: "Tuần qua An đã sửa gì trong src/payment/?" Lệnh nào trả lời đúng câu đó?',
            options: [
              'git log --oneline --author=an@example.com --since="1 week ago" -- src/payment/',
              'git log --oneline --author=An --grep=payment',
              'git shortlog -sn --since="1 week ago"',
              'git blame src/payment/index.ts',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Author anchored by email, a date filter, and a path after -- answer all three parts. --grep=payment searches commit MESSAGES, so it misses payment changes whose message does not say "payment" and includes unrelated ones that do. shortlog only counts commits per person; blame shows the last toucher of each line, not a week of work.|||VI: Tác giả neo bằng email, bộ lọc ngày, và đường dẫn sau -- trả lời đủ ba ý. --grep=payment tìm trong LỜI NHẮN commit, nên bỏ sót những lần sửa payment mà lời nhắn không ghi chữ "payment" và kéo theo cả commit không liên quan có chữ đó. shortlog chỉ đếm số commit theo người; blame chỉ cho biết ai chạm từng dòng gần nhất, không phải việc của một tuần.',
          },
          {
            question: 'Your branch feature/avatar forked two weeks ago. "git diff --stat main feature/avatar" shows .env.example and CHANGELOG.md as deleted, but you never touched them. What is going on?|||Nhánh feature/avatar của bạn rẽ ra hai tuần trước. "git diff --stat main feature/avatar" hiện .env.example và CHANGELOG.md như bị xoá, dù bạn chưa từng đụng tới. Chuyện gì đang xảy ra?',
            options: [
              'Your branch deleted them by accident in one of its commits|||Nhánh của bạn đã vô tình xoá chúng trong một commit nào đó',
              'Those files are listed in .gitignore on your branch|||Các file đó nằm trong .gitignore trên nhánh của bạn',
              'You need to run git fetch first; the diff is stale|||Bạn cần chạy git fetch trước; diff đang bị cũ',
              'main gained them after the fork; two-dot diff compares the two tips, so they appear reversed — use main...feature/avatar|||main có thêm chúng sau lúc rẽ nhánh; diff hai chấm so hai đầu mút nên chúng hiện ngược lại — dùng main...feature/avatar',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: git diff A B compares the two current states, so anything main added after the fork looks "removed" on your side. The three-dot form compares your tip with the merge base and shows only your work — the same view as a pull request. "Deleted by accident" is the scary guess; git log main..feature/avatar -- .env.example would print nothing, proving your branch never touched it.|||VI: git diff A B so hai trạng thái hiện tại, nên mọi thứ main thêm sau lúc rẽ nhánh trông như bị "gỡ" ở phía bạn. Dạng ba chấm so đầu nhánh với tổ tiên chung và chỉ hiện việc của bạn — đúng góc nhìn của pull request. "Vô tình xoá" là phỏng đoán đáng sợ nhất; nhưng git log main..feature/avatar -- .env.example sẽ không in gì, chứng minh nhánh bạn chưa từng chạm vào nó.',
          },
          {
            question: 'A teammate asks which jsonwebtoken version you shipped in v1.0.0. You have uncommitted work and do not want to touch it. What do you run?|||Bạn cùng nhóm hỏi bản v1.0.0 đã dùng jsonwebtoken phiên bản nào. Bạn đang có việc dở chưa commit và không muốn đụng vào. Bạn chạy gì?',
            options: [
              'git checkout v1.0.0 -- package.json',
              'git show v1.0.0:package.json',
              'git log v1.0.0 -- package.json',
              'git diff v1.0.0 -- package.json',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: The commit:path form prints the file as it was at that commit and changes nothing on disk. git checkout v1.0.0 -- package.json OVERWRITES your current package.json (and stages it) — exactly the damage you wanted to avoid. git log lists commits, and git diff shows differences rather than the file itself.|||VI: Dạng commit:đường-dẫn in file đúng như nó có ở commit đó và không đổi gì trên đĩa. git checkout v1.0.0 -- package.json GHI ĐÈ package.json hiện tại (và đưa vào index) — đúng cái hại bạn muốn tránh. git log liệt kê commit, còn git diff cho thấy khác biệt chứ không phải bản thân file.',
          },
          {
            question: 'git blame on auth.js credits every line to Cuong’s commit "chore: run prettier on everything". You need to know who really wrote the refresh logic and why. Best next step?|||git blame trên auth.js quy mọi dòng về commit "chore: run prettier on everything" của Cường. Bạn cần biết ai thật sự viết phần refresh và vì sao. Bước tiếp theo tốt nhất?',
            options: [
              'Ask Cuong, since blame says he wrote those lines|||Hỏi Cường, vì blame nói bạn ấy viết các dòng đó',
              'Read git log -- auth.js from top to bottom|||Đọc git log -- auth.js từ đầu đến cuối',
              'git blame -w -C -M -L :refreshToken auth.js, then git show the hash it gives|||git blame -w -C -M -L :refreshToken auth.js, rồi git show mã băm nó đưa ra',
              'git revert the prettier commit so blame works again|||git revert commit prettier để blame hoạt động lại',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: -w ignores whitespace-only changes (and -C/-M follow moved lines), so blame skips the reformatting commit and lands on the commit that wrote the logic; git show then gives the reason. Asking Cuong is the classic mistake — he only reindented. Reverting the format commit rewrites the code to "fix" a reading problem. In the practice repo, -w moved lines 19–20 from 2f569a3 to 8a4ce74.|||VI: -w bỏ qua thay đổi chỉ có khoảng trắng (còn -C/-M bám theo dòng bị dời), nên blame vượt qua commit định dạng và dừng ở commit thật sự viết logic; git show sau đó cho lý do. Hỏi Cường là sai lầm kinh điển — bạn ấy chỉ thụt lề lại. Revert commit định dạng là sửa mã để chữa một vấn đề đọc. Trong kho thử, -w chuyển dòng 19–20 từ 2f569a3 sang 8a4ce74.',
          },
          {
            question: 'A function legacyAuth was deleted months ago; git grep legacyAuth finds nothing. Which command tells you when it was added and when it was removed?|||Hàm legacyAuth đã bị xoá vài tháng trước; git grep legacyAuth không ra gì. Lệnh nào cho biết nó được thêm vào khi nào và bị xoá khi nào?',
            options: [
              'git log -S"legacyAuth" --oneline --all',
              'git blame -- src/services/auth.js',
              'git grep legacyAuth HEAD~100',
              'git log --grep="legacyAuth" --oneline',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: -S lists commits where the number of occurrences of the string changed — its birth and its death (in the practice repo: b76a82c and d0c0e0e). --grep only searches commit messages; the deleting commit said "delete the legacy auth path", which does not contain "legacyAuth". blame only sees lines that still exist, and grepping HEAD~100 works only if you already guessed a commit where it existed.|||VI: -S liệt kê những commit mà số lần xuất hiện của chuỗi thay đổi — lúc nó sinh ra và lúc nó mất đi (trong kho thử: b76a82c và d0c0e0e). --grep chỉ tìm trong lời nhắn; commit xoá có lời nhắn "delete the legacy auth path", không chứa chữ "legacyAuth". blame chỉ thấy dòng còn tồn tại, còn grep ở HEAD~100 chỉ đúng nếu bạn đã đoán trúng một commit mà hàm còn sống.',
          },
          {
            question: 'Auditing an inherited repo, you run git log -S"password" -S"api_key" --all --oneline. It only lists commits about api_key, although you know a password was committed once. Why?|||Soát một kho mã được giao lại, bạn chạy git log -S"password" -S"api_key" --all --oneline. Nó chỉ liệt kê commit về api_key, dù bạn biết từng có mật khẩu bị commit. Vì sao?',
            options: [
              '-S is case-sensitive and the file wrote PASSWORD|||-S phân biệt hoa thường và file viết PASSWORD',
              'Git keeps only the last -S; search both with one regex: git log -G"password|api_key" --all|||Git chỉ giữ -S cuối cùng; tìm cả hai bằng một biểu thức: git log -G"password|api_key" --all',
              '--all skips commits that are only reachable from tags|||--all bỏ qua commit chỉ với tới được từ tag',
              'You must add --pickaxe-all to search more than one string|||Phải thêm --pickaxe-all mới tìm được nhiều hơn một chuỗi',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: A second -S silently replaces the first — checked on git 2.51: swapping their order changes the result completely. One -G with alternation (or two separate commands) covers both. Case-sensitivity is real but does not explain why api_key hits appear while password ones vanish; --all includes tags; --pickaxe-all only changes which files are shown for a matching commit.|||VI: -S thứ hai lặng lẽ thay thế -S thứ nhất — đã kiểm trên git 2.51: đổi thứ tự hai cờ là kết quả đổi hẳn. Một -G với dấu | (hoặc hai lệnh riêng) phủ được cả hai. Phân biệt hoa thường là có thật nhưng không giải thích vì sao kết quả api_key vẫn hiện còn password thì biến mất; --all có gồm tag; --pickaxe-all chỉ đổi việc hiện những file nào của commit khớp.',
          },
          {
            question: 'git log --oneline -- src/services/auth.js stops at "refactor: move auth into src/services/". You need the history from before that move. What do you add?|||git log --oneline -- src/services/auth.js dừng ở "refactor: move auth into src/services/". Bạn cần cả lịch sử trước lần dời đó. Thêm gì?',
            options: [
              '--all',
              '-M',
              '--graph',
              '--follow',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: A pathspec only matches the NEW name, so history under the old name (auth/login.js) is invisible. --follow detects the rename and keeps following one file: in the practice repo it goes from 7 commits to 10. --all adds other branches, not old names; -M only affects how renames are shown in diffs; --graph only draws the shape.|||VI: Đường dẫn lọc chỉ khớp tên MỚI, nên lịch sử dưới tên cũ (auth/login.js) bị khuất. --follow nhận ra lần đổi tên và đi tiếp theo một file: trong kho thử nó tăng từ 7 lên 10 commit. --all thêm nhánh khác chứ không thêm tên cũ; -M chỉ ảnh hưởng cách diff hiển thị việc đổi tên; --graph chỉ vẽ hình dạng.',
          },
          {
            question: 'About 1,000 commits separate the last good tag from HEAD, and each check (build + one test) takes 3 minutes. Roughly how long does git bisect need?|||Khoảng 1.000 commit nằm giữa tag tốt gần nhất và HEAD, mỗi lần kiểm (build + một test) mất 3 phút. git bisect cần khoảng bao lâu?',
            options: [
              'About 10 checks, around 30 minutes|||Khoảng 10 lần kiểm, cỡ 30 phút',
              'About 500 checks — half the range on average|||Khoảng 500 lần kiểm — trung bình một nửa khoảng',
              'About 100 checks, around 5 hours|||Khoảng 100 lần kiểm, cỡ 5 giờ',
              'One check, because bisect run tests all commits in parallel|||Một lần kiểm, vì bisect run kiểm mọi commit song song',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Each answer halves the remaining range: log₂(1000) ≈ 10 checks × 3 min ≈ 30 min. "Half the range" is the cost of a linear search from one end, which is exactly what bisect avoids. bisect run is sequential — it automates the answering, not the number of steps.|||VI: Mỗi câu trả lời cắt đôi khoảng còn lại: log₂(1000) ≈ 10 lần kiểm × 3 phút ≈ 30 phút. "Một nửa khoảng" là chi phí của tìm tuần tự từ một đầu — chính thứ bisect tránh được. bisect run chạy tuần tự — nó tự động hoá việc trả lời, không giảm số bước.',
          },
          {
            question: 'Your bisect run script starts with npm ci && npm run build. On some old commits the build fails for reasons unrelated to the bug. What should the script exit with in that case?|||Script bisect run của bạn mở đầu bằng npm ci && npm run build. Ở vài commit cũ build hỏng vì lý do không liên quan tới lỗi. Trường hợp đó script nên thoát với mã nào?',
            options: [
              'exit 1',
              'exit 0',
              'exit 125',
              'exit 128',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: 125 means "cannot test this commit": Git skips it instead of judging it. exit 1 would mark it bad and can make bisect blame a commit that merely broke the build; exit 0 would wrongly call it good. Codes above 127 (like 128) do not mean skip — they abort the whole bisect run.|||VI: 125 nghĩa là "không kiểm được commit này": Git bỏ qua nó thay vì phán xét. exit 1 sẽ đánh dấu nó hỏng và có thể khiến bisect đổ oan cho một commit chỉ làm hỏng bản build; exit 0 lại gọi sai nó là tốt. Mã trên 127 (như 128) không có nghĩa là bỏ qua — chúng dừng hẳn cả phiên bisect run.',
          },
        ],
      },
    },
  ],
};
