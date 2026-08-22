/**
 * Git & GitHub — Chương 2: Đọc lịch sử — khảo cổ trên chính kho mã của bạn.
 * git log và các cờ đáng dùng · show/diff giữa hai commit · blame và cái cuốc chim (-S/-G)
 * · bisect (tìm nhị phân ra commit gây lỗi) · grep + --follow.
 * Output CHẠY THẬT git 2.43. LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;;
 * & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 2 — Reading history: archaeology on your own code|||Chương 2 — Đọc lịch sử: khảo cổ trên chính mã của bạn',
  description: 'Lịch sử của một kho mã là tài liệu chi tiết nhất bạn có về dự án — nếu bạn đọc được nó. Chương này biến git log thành công cụ điều tra: lọc theo tác giả/ngày/đường dẫn, đọc một commit, truy vết một dòng về tận nguồn gốc, tìm commit đã xoá một hàm, và dùng bisect để khoanh vùng lỗi trong hàng nghìn commit chỉ với vài bước.',
  lessons: [
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
<p><code>A..B</code> means "commits reachable from B but not from A" — in practice, "what is in B that is not in A". This is the single most useful shape in Git, and it appears again in <code>diff</code>, <code>rebase</code> and pull requests:</p>
<pre><code>git log --oneline main..feature/login   <span class="tok-comment"># what my branch adds on top of main</span>
git log --oneline feature/login..main   <span class="tok-comment"># what main has that I do not — do I need to merge?</span>
git log --oneline origin/main..main     <span class="tok-comment"># what I have locally that is not pushed yet</span>
git log --oneline main...feature/login  <span class="tok-comment"># three dots: commits unique to EITHER side</span></code></pre>
<div class="callout ok"><code>git log origin/main..main</code> answers "what am I about to push?" — worth running before every push. Its mirror, <code>git log main..origin/main</code>, answers "what did other people add that I have not pulled?" after a <code>git fetch</code>.</div>

<h3>Seeing the shape of history</h3>
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

<a class="link-card" href="https://git-scm.com/docs/git-log" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">git-log — every flag, including the placeholders for --pretty</span><span class="lc-sub">Long, but the "PRETTY FORMATS" section alone is worth bookmarking.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: answer five questions about a repository using only git log</span><span class="lc-sub">Graded exercises on filters, ranges and formats.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>--author</code> matches a substring of the author field, not an exact identity. <code>--author=an</code> also matches "Hoang", "Tran" and "dependabot" — any name containing "an". Anchor it with an email (<code>--author=an@example.com</code>) or a regex (<code>--author="^Nguyen"</code>) when precision matters.</div>
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
<p><code>A..B</code> nghĩa là "những commit với tới được từ B mà không với tới được từ A" — nói thực dụng là "cái gì có trong B mà không có trong A". Đây là hình dạng hữu ích nhất trong Git, và nó xuất hiện lại ở <code>diff</code>, <code>rebase</code> và pull request:</p>
<pre><code>git log --oneline main..feature/login   <span class="tok-comment"># nhánh của tôi thêm gì lên trên main</span>
git log --oneline feature/login..main   <span class="tok-comment"># main có gì mà tôi chưa có — có cần merge không?</span>
git log --oneline origin/main..main     <span class="tok-comment"># tôi có gì ở cục bộ mà chưa push</span>
git log --oneline main...feature/login  <span class="tok-comment"># ba chấm: commit riêng của MỖI bên</span></code></pre>
<div class="callout ok"><code>git log origin/main..main</code> trả lời "tôi sắp push cái gì?" — đáng chạy trước mỗi lần push. Bản soi gương của nó, <code>git log main..origin/main</code>, trả lời "người khác đã thêm gì mà tôi chưa kéo về?" sau một lần <code>git fetch</code>.</div>

<h3>Nhìn thấy hình dạng của lịch sử</h3>
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

<a class="link-card" href="https://git-scm.com/docs/git-log" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">git-log — mọi cờ, kể cả các ký hiệu cho --pretty</span><span class="lc-sub">Dài, nhưng riêng mục "PRETTY FORMATS" đã đáng đánh dấu.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: trả lời năm câu hỏi về một kho mã chỉ bằng git log</span><span class="lc-sub">Bài tập chấm điểm về bộ lọc, khoảng và định dạng.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>--author</code> khớp CHUỖI CON của trường tác giả, không phải một danh tính chính xác. <code>--author=an</code> khớp cả "Hoang", "Tran" và "dependabot" — bất cứ tên nào chứa "an". Hãy neo nó bằng email (<code>--author=an@example.com</code>) hoặc biểu thức chính quy (<code>--author="^Nguyen"</code>) khi cần chính xác.</div>
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
<p>The usual disappointment: blame says every line was last touched by <code>chore: run prettier on everything</code>. That commit explains nothing. Three flags see through it:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">-w</span><span class="v">Ignore whitespace-only changes. Kills most reindent commits on its own.</span></div>
  <div class="kv"><span class="k">-C</span><span class="v">Detect lines <em>copied or moved</em> within the same commit — follows a function that moved between files.</span></div>
  <div class="kv"><span class="k">-M</span><span class="v">Detect lines moved <em>within a file</em>. Blames the original author instead of whoever reordered the file.</span></div>
</div>
<pre><code>git blame -w -C -M -L 44,60 src/services/auth.service.ts</code></pre>
<div class="callout ok">A repository can also record "ignore these commits when blaming" permanently: put the hashes of pure-formatting commits in a <code>.git-blame-ignore-revs</code> file, then <code>git config blame.ignoreRevsFile .git-blame-ignore-revs</code>. GitHub's blame view honours the same file. This is the professional answer to "the big prettier commit ruined blame".</div>

<h3>The pickaxe: finding code that is no longer there</h3>
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
<div class="callout warn">That last one is worth running on any repository you inherit. <code>git log -S"password" -S"api_key" --all</code> finds credentials that were committed and later deleted — deleted from the working tree, still in every clone. Chapter 8.4 covers removing them properly; finding them is step one.</div>

<h3>Following a file through renames</h3>
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
<p>Nỗi thất vọng quen thuộc: blame nói mọi dòng đều được chạm gần nhất bởi <code>chore: chạy prettier toàn bộ</code>. Commit đó chẳng giải thích gì. Ba cái cờ nhìn xuyên qua nó:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">-w</span><span class="v">Bỏ qua thay đổi chỉ có khoảng trắng. Riêng nó đã dẹp được đa số commit thụt lề lại.</span></div>
  <div class="kv"><span class="k">-C</span><span class="v">Nhận ra dòng được <em>chép hoặc dời</em> trong cùng một commit — bám theo một hàm chuyển giữa các file.</span></div>
  <div class="kv"><span class="k">-M</span><span class="v">Nhận ra dòng dời <em>trong cùng một file</em>. Quy về tác giả gốc thay vì người sắp xếp lại file.</span></div>
</div>
<pre><code>git blame -w -C -M -L 44,60 src/services/auth.service.ts</code></pre>
<div class="callout ok">Một kho mã cũng ghi được vĩnh viễn luật "bỏ qua các commit này khi blame": đặt mã băm của những commit thuần-định-dạng vào file <code>.git-blame-ignore-revs</code>, rồi <code>git config blame.ignoreRevsFile .git-blame-ignore-revs</code>. Giao diện blame của GitHub cũng tôn trọng chính file đó. Đây là câu trả lời chuyên nghiệp cho "cái commit prettier khổng lồ đã phá nát blame".</div>

<h3>Cái cuốc chim: tìm mã không còn ở đó nữa</h3>
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
<div class="callout warn">Lệnh cuối đáng chạy trên bất kỳ kho mã nào bạn tiếp quản. <code>git log -S"password" -S"api_key" --all</code> tìm ra những chứng chỉ từng được commit rồi xoá đi — xoá khỏi cây làm việc, nhưng vẫn nằm trong mọi bản clone. Chương 8.4 nói cách gỡ chúng cho đúng; tìm ra chúng là bước một.</div>

<h3>Bám theo một file qua các lần đổi tên</h3>
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
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Where is this code?</span><span class="lz-v"><code>git grep -n "pattern" -- '*.ts'</code></span></div>
  <div class="lz-layer"><span class="lz-k">Why does this line exist?</span><span class="lz-v"><code>git blame -w -C -L a,b -- file</code> → <code>git show &lt;hash&gt;</code></span></div>
  <div class="lz-layer"><span class="lz-k">When did this string appear or vanish?</span><span class="lz-v"><code>git log -S"string" --oneline --all</code></span></div>
  <div class="lz-layer"><span class="lz-k">Which commit broke it?</span><span class="lz-v"><code>git bisect start HEAD &lt;good&gt;</code> → <code>git bisect run &lt;check&gt;</code></span></div>
  <div class="lz-layer"><span class="lz-k">What shipped in this release?</span><span class="lz-v"><code>git log --oneline v1.4.0..v1.5.0</code></span></div>
  <div class="lz-layer"><span class="lz-k">What did this file look like then?</span><span class="lz-v"><code>git show v1.4.0:path/to/file</code></span></div>
</div>

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
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Mã này nằm ở đâu?</span><span class="lz-v"><code>git grep -n "mẫu" -- '*.ts'</code></span></div>
  <div class="lz-layer"><span class="lz-k">Vì sao dòng này tồn tại?</span><span class="lz-v"><code>git blame -w -C -L a,b -- file</code> → <code>git show &lt;mã băm&gt;</code></span></div>
  <div class="lz-layer"><span class="lz-k">Chuỗi này xuất hiện hay biến mất khi nào?</span><span class="lz-v"><code>git log -S"chuỗi" --oneline --all</code></span></div>
  <div class="lz-layer"><span class="lz-k">Commit nào làm hỏng?</span><span class="lz-v"><code>git bisect start HEAD &lt;good&gt;</code> → <code>git bisect run &lt;phép kiểm&gt;</code></span></div>
  <div class="lz-layer"><span class="lz-k">Bản phát hành này có gì?</span><span class="lz-v"><code>git log --oneline v1.4.0..v1.5.0</code></span></div>
  <div class="lz-layer"><span class="lz-k">Hồi đó file này trông thế nào?</span><span class="lz-v"><code>git show v1.4.0:đường/dẫn/file</code></span></div>
</div>

<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: chạy cuộc điều tra này trên một kho đã gieo sẵn lỗi</span><span class="lc-sub">Bài tập Code Lab cấy một lỗi tương tự và chấm điểm chẩn đoán của bạn.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/book/vi/v2/C%C3%A1c-C%C3%B4ng-C%E1%BB%A5-Git-G%E1%BB%A1-L%E1%BB%97i-V%E1%BB%9Bi-Git" target="_blank" rel="noopener">
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
      description: 'Tám câu về bộ lọc của git log, khoảng hai chấm/ba chấm, đọc file ở quá khứ, blame qua commit định dạng lại, cái cuốc chim, và bisect (kể cả mã thoát 125).',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on reading history. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: why a pull request shows the three-dot diff (2.2), and what exit code 125 means to <code>git bisect run</code> (2.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về đọc lịch sử. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: vì sao pull request hiện diff ba chấm (2.2), và mã thoát 125 nghĩa là gì với <code>git bisect run</code> (2.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What does "git log origin/main..main" show?|||"git log origin/main..main" cho thấy gì?',
            options: [
              'Everything on main since the project began|||Mọi thứ trên main từ khi dự án bắt đầu',
              'Commits you have locally that are not on the remote yet — i.e. what you are about to push|||Những commit bạn có ở cục bộ mà remote chưa có — tức là thứ bạn sắp push',
              'Commits the remote has that you do not|||Những commit remote có mà bạn không có',
              'The difference in file content between the two|||Khác biệt nội dung file giữa hai bên',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Your branch forked from main a week ago and main has moved on. Which diff shows ONLY your work?|||Nhánh của bạn rẽ ra từ main một tuần trước và main đã đi tiếp. Diff nào chỉ cho thấy việc CỦA BẠN?',
            options: [
              'git diff main feature',
              'git diff main...feature',
              'git diff feature main',
              'git diff HEAD',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'How do you read a file exactly as it was at tag v1.4.0, without changing your working directory?|||Làm sao đọc một file đúng như nó có ở tag v1.4.0, mà không đụng vào thư mục làm việc?',
            options: [
              'git checkout v1.4.0 -- path/to/file',
              'git show v1.4.0:path/to/file',
              'git log v1.4.0 path/to/file',
              'git diff v1.4.0 path/to/file',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'git blame says every line was last touched by "chore: run prettier". Which flags see past that?|||git blame nói mọi dòng đều được chạm gần nhất bởi "chore: run prettier". Cờ nào nhìn xuyên qua nó?',
            options: [
              '-p and -v',
              '-w (ignore whitespace), -M (moved within a file) and -C (copied/moved between files)|||-w (bỏ qua khoảng trắng), -M (dời trong một file) và -C (chép/dời giữa các file)',
              '--all and --follow',
              'There is no way — the history is lost|||Không có cách nào — lịch sử đã mất',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A function was deleted months ago. Which command finds the commit that removed it?|||Một hàm đã bị xoá vài tháng trước. Lệnh nào tìm ra commit đã gỡ nó?',
            options: [
              'git blame -- the-file.ts',
              'git log -S"functionName" --oneline --all',
              'git grep "functionName"',
              'git show HEAD~100',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Roughly how many steps does git bisect need for 10,000 commits?|||git bisect cần khoảng bao nhiêu bước cho 10.000 commit?',
            options: [
              'About 100|||Khoảng 100',
              'About 14, because each answer halves the remaining range (log₂)|||Khoảng 14, vì mỗi câu trả lời cắt đôi khoảng còn lại (log₂)',
              'About 1,000|||Khoảng 1.000',
              'It depends on the number of branches|||Tuỳ số nhánh',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In a "git bisect run" script, what does exit code 125 mean?|||Trong script của "git bisect run", mã thoát 125 nghĩa là gì?',
            options: [
              'The commit is bad|||Commit này hỏng',
              'The commit is good|||Commit này tốt',
              'This commit cannot be tested (e.g. it does not build) — skip it instead of judging it|||Commit này không kiểm được (ví dụ không build nổi) — bỏ qua nó thay vì phán xét',
              'Stop the bisect immediately|||Dừng bisect ngay lập tức',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Why is "git grep" preferred over plain "grep -r" inside a repository?|||Vì sao nên dùng "git grep" thay vì "grep -r" trần khi ở trong một kho mã?',
            options: [
              'It is the only one that supports regular expressions|||Nó là cái duy nhất hỗ trợ biểu thức chính quy',
              'It searches only tracked files (skipping node_modules and .gitignore), is much faster, and can search any commit|||Nó chỉ tìm trong file được theo dõi (bỏ qua node_modules và .gitignore), nhanh hơn nhiều, và tìm được trong mọi commit',
              'It also searches commit messages|||Nó tìm cả trong lời nhắn commit',
              'It automatically fixes what it finds|||Nó tự sửa thứ nó tìm thấy',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
