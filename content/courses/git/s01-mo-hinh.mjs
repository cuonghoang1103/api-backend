/**
 * Git & GitHub — Chương 1: Mô hình — ảnh chụp, không phải bản khác biệt.
 * Ba cây (thư mục làm việc · index · HEAD) · một commit thật sự chứa gì
 * (blob/tree/commit + SHA) · vòng lặp add/commit/status/diff hằng ngày ·
 * viết lời nhắn commit sống được lâu · .gitignore và thứ không bao giờ được commit.
 * Output CHẠY THẬT git 2.43. LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;;
 * & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg> (sanitizeHtml xoá sạch).
 */
const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 1 — The model: snapshots, not diffs|||Chương 1 — Mô hình: ảnh chụp, không phải bản khác biệt',
  description: 'Mô hình tinh thần mà cả khoá dựng lên trên đó: ba cây mà mọi lệnh Git đụng vào, một commit thật sự chứa gì (và vì sao nó có mã băm), vòng lặp add/commit hằng ngày, cách viết lời nhắn commit mà sáu tháng sau vẫn đọc được, và .gitignore.',
  lessons: [
    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — The three trees: working directory, index, HEAD|||1.1 — Ba cái cây: thư mục làm việc, index, HEAD',
      slug: 'git-1-1-ba-cai-cay',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao Git có một "vùng staging" mà các VCS khác không có, ba cây đó là gì, và cách đọc git status như đọc một bản đồ vị trí của từng file.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Git is three collections of files, not one</h2>
<p class="lead">The single concept that makes Git make sense is that a file can be in three places at once, holding three different versions of itself. Every command in this course either moves content between these three places or takes a picture of one of them. Learn this and <code>git status</code> stops being noise and becomes a map.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Working directory</span><span class="lz-v">The actual files on your disk, the ones your editor opens. The only place you edit. Also called the <em>working tree</em>.</span></div>
  <div class="lz-layer"><span class="lz-k">Index (staging area)</span><span class="lz-v">A single file, <code>.git/index</code>, holding the content that will go into your <strong>next</strong> commit. A draft of the next snapshot.</span></div>
  <div class="lz-layer"><span class="lz-k">HEAD</span><span class="lz-v">A pointer to the commit you last checked out — in effect, the snapshot your working directory started from. The last committed version.</span></div>
</div>

<h3>The cycle, in one picture</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">edit</div><div class="lz-t">Working directory</div><div class="lz-d">You change a file in your editor. Git knows nothing yet.</div></div>
  <div class="lz-step"><div class="lz-k">git add</div><div class="lz-t">Index</div><div class="lz-d">You choose which changes belong in the next commit. Content is copied into the index.</div></div>
  <div class="lz-step"><div class="lz-k">git commit</div><div class="lz-t">HEAD</div><div class="lz-d">The index becomes a permanent snapshot; HEAD moves to it.</div></div>
</div>

<h3>Why the middle step exists</h3>
<p>Most version control systems have two states: changed and committed. Git inserts a third, and beginners often resent it — "why do I have to <code>add</code> before I <code>commit</code>?" The answer is that <strong>a commit should be one idea</strong>, and an afternoon of work usually contains three.</p>
<p>Suppose you fixed a bug, and while you were in there you also renamed a confusing variable and updated a comment. Those are three separate ideas. With the index you commit them as three commits, each with its own message — so that six months later, when the bug fix needs to be reverted, it can be reverted <em>without</em> also undoing the rename.</p>
<div class="callout ok">The staging area is what makes <code>git add -p</code> possible: staging <em>part</em> of a file, hunk by hunk. You will meet it in 1.3, and it is the moment most people stop resenting the index.</div>

<h3>Reading git status as a map</h3>
<p>Make three different kinds of change in the playground repo from 0.4 and look at the result:</p>
<pre><code>cd ~/git-lab
<span class="tok-keyword">echo</span> <span class="tok-string">"staged change"</span> &gt;&gt; a.txt   &amp;&amp; git add a.txt   <span class="tok-comment"># edited AND staged</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"unstaged change"</span> &gt;&gt; a.txt                   <span class="tok-comment"># edited again, NOT staged</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"hello"</span> &gt; b.txt                              <span class="tok-comment"># brand-new file</span>
git status</code></pre>
<div class="out">On branch main
Changes to be committed:
  (use "git restore --staged &lt;file&gt;..." to unstage)
        modified:   a.txt

Changes not staged for commit:
  (use "git add &lt;file&gt;..." to update what will be committed)
  (use "git restore &lt;file&gt;..." to discard changes in working directory)
        modified:   a.txt

Untracked files:
  (use "git add &lt;file&gt;..." to include in what will be committed)
        b.txt</div>
<p>Notice that <code>a.txt</code> appears <strong>twice</strong>. That is not a bug — it is the three trees showing through. The file holds three different versions right now:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">In HEAD</span><span class="v">The original content, from the last commit.</span></div>
  <div class="kv"><span class="k">In the index</span><span class="v">Original + "staged change". This is what a commit right now would record.</span></div>
  <div class="kv"><span class="k">In the working directory</span><span class="v">Original + "staged change" + "unstaged change". What your editor shows.</span></div>
</div>
<p>The three headings in <code>git status</code> map exactly onto the three trees:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Changes to be committed</span><span class="lz-v">The difference between <strong>HEAD and the index</strong>. This is what your next commit will contain.</span></div>
  <div class="lz-layer"><span class="lz-k">Changes not staged for commit</span><span class="lz-v">The difference between <strong>the index and the working directory</strong>. Real edits that would <em>not</em> be in the next commit.</span></div>
  <div class="lz-layer"><span class="lz-k">Untracked files</span><span class="lz-v">Files Git has never been told about. They are in no tree at all until you <code>git add</code> them once.</span></div>
</div>

<h3>Tracked vs untracked — a distinction worth being precise about</h3>
<p>A file becomes <strong>tracked</strong> the first time you <code>git add</code> it. From then on Git watches it and reports modifications. Until then it is <strong>untracked</strong>: Git lists it under "Untracked files" and otherwise ignores it completely.</p>
<div class="callout warn">This is why <code>git commit -a</code> ("commit all changes") does <em>not</em> include new files. The <code>-a</code> flag means "stage every modification to <strong>tracked</strong> files", and a brand-new file is not tracked yet. It is one of the most common "but I committed it!" surprises — and 1.3 shows how to catch it before you push.</div>

<h3>The short form you will actually use</h3>
<pre><code>git status --short</code></pre>
<div class="out">MM a.txt
?? b.txt</div>
<p>Two columns, and once you see the pattern you will never go back to the long form. The <strong>left</strong> column is the index (HEAD → index), the <strong>right</strong> column is the working directory (index → working dir):</p>
<div class="kv-grid">
  <div class="kv"><span class="k">M_ </span><span class="v">Modified and staged. A commit now would include it.</span></div>
  <div class="kv"><span class="k">_M</span><span class="v">Modified but not staged. A commit now would <em>not</em> include this change.</span></div>
  <div class="kv"><span class="k">MM</span><span class="v">Both — exactly our <code>a.txt</code>. Some of its changes are staged, some are not.</span></div>
  <div class="kv"><span class="k">A_ · ?? · D_</span><span class="v">Added (newly tracked) · untracked · deleted.</span></div>
</div>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 2.2 — Recording Changes to the Repository</span><span class="lc-sub">The lifecycle diagram of tracked / untracked / staged, in the official book.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: put one file in all three states and read the status</span><span class="lc-sub">The Code Lab exercises drill exactly the MM / _M / ?? distinction.</span></span>
</a>

<div class="pitfall"><strong>The classic beginner bug:</strong> you <code>git add file.js</code>, then keep editing <code>file.js</code>, then <code>git commit</code>. Only the version you staged is committed — your last edits are still sitting in the working directory. Nothing warns you. The habit that prevents it: run <code>git diff --staged</code> right before committing and read what is actually about to be recorded.</div>
<p class="note-ct"><strong>Carry this into every later chapter:</strong> when a Git command confuses you, ask "which of the three trees does this touch?". <code>git checkout</code>, <code>git restore</code>, <code>git reset</code> and <code>git stash</code> all look mysterious until you notice they differ only in <em>which trees they change</em> — a table you will build in Chapter 4.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Git là ba tập file, không phải một</h2>
<p class="lead">Khái niệm duy nhất làm cho Git trở nên có lý là: một file có thể nằm ở ba nơi cùng lúc, mang ba phiên bản khác nhau của chính nó. Mọi lệnh trong khoá này hoặc chuyển nội dung giữa ba nơi ấy, hoặc chụp ảnh một trong ba. Học được điều này thì <code>git status</code> hết là tiếng ồn và trở thành một tấm bản đồ.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Thư mục làm việc</span><span class="lz-v">Các file thật trên đĩa, thứ mà trình soạn thảo mở ra. Nơi duy nhất bạn sửa. Còn gọi là <em>working tree</em>.</span></div>
  <div class="lz-layer"><span class="lz-k">Index (vùng staging)</span><span class="lz-v">Một file duy nhất, <code>.git/index</code>, giữ nội dung sẽ đi vào commit <strong>kế tiếp</strong> của bạn. Bản nháp của ảnh chụp sắp tới.</span></div>
  <div class="lz-layer"><span class="lz-k">HEAD</span><span class="lz-v">Con trỏ tới commit bạn checkout gần nhất — thực chất là ảnh chụp mà thư mục làm việc của bạn khởi đi từ đó. Phiên bản đã commit gần nhất.</span></div>
</div>

<h3>Vòng tuần hoàn, trong một bức tranh</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">sửa</div><div class="lz-t">Thư mục làm việc</div><div class="lz-d">Bạn sửa một file trong trình soạn thảo. Git chưa biết gì.</div></div>
  <div class="lz-step"><div class="lz-k">git add</div><div class="lz-t">Index</div><div class="lz-d">Bạn chọn thay đổi nào thuộc về commit kế tiếp. Nội dung được chép vào index.</div></div>
  <div class="lz-step"><div class="lz-k">git commit</div><div class="lz-t">HEAD</div><div class="lz-d">Index trở thành một ảnh chụp vĩnh viễn; HEAD dời tới nó.</div></div>
</div>

<h3>Vì sao có bước ở giữa</h3>
<p>Phần lớn hệ quản lý phiên bản chỉ có hai trạng thái: đã sửa và đã commit. Git chen vào cái thứ ba, và người mới thường bực mình — "sao phải <code>add</code> trước khi <code>commit</code>?". Câu trả lời là <strong>một commit nên là một ý</strong>, mà một buổi chiều làm việc thường chứa ba ý.</p>
<p>Giả sử bạn vừa sửa một lỗi, và nhân tiện đổi tên một biến khó hiểu và cập nhật một dòng chú thích. Đó là ba ý riêng biệt. Với index bạn commit chúng thành ba commit, mỗi cái một lời nhắn — để sáu tháng sau, khi cần hoàn tác bản sửa lỗi, có thể hoàn tác nó mà <em>không</em> đồng thời huỷ luôn việc đổi tên.</p>
<div class="callout ok">Vùng staging chính là thứ làm cho <code>git add -p</code> khả thi: đưa <em>một phần</em> của file vào staging, theo từng đoạn. Bạn sẽ gặp nó ở bài 1.3, và đó là lúc đa số người hết bực mình với index.</div>

<h3>Đọc git status như một tấm bản đồ</h3>
<p>Tạo ba loại thay đổi khác nhau trong kho nháp từ bài 0.4 rồi nhìn kết quả:</p>
<pre><code>cd ~/git-lab
<span class="tok-keyword">echo</span> <span class="tok-string">"staged change"</span> &gt;&gt; a.txt   &amp;&amp; git add a.txt   <span class="tok-comment"># đã sửa VÀ đã staging</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"unstaged change"</span> &gt;&gt; a.txt                   <span class="tok-comment"># sửa tiếp, CHƯA staging</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"hello"</span> &gt; b.txt                              <span class="tok-comment"># file hoàn toàn mới</span>
git status</code></pre>
<div class="out">On branch main
Changes to be committed:
  (use "git restore --staged &lt;file&gt;..." to unstage)
        modified:   a.txt

Changes not staged for commit:
  (use "git add &lt;file&gt;..." to update what will be committed)
  (use "git restore &lt;file&gt;..." to discard changes in working directory)
        modified:   a.txt

Untracked files:
  (use "git add &lt;file&gt;..." to include in what will be committed)
        b.txt</div>
<p>Để ý <code>a.txt</code> xuất hiện <strong>hai lần</strong>. Đó không phải lỗi — đó là ba cái cây lộ ra. Ngay lúc này file đó mang ba phiên bản khác nhau:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Trong HEAD</span><span class="v">Nội dung gốc, từ commit gần nhất.</span></div>
  <div class="kv"><span class="k">Trong index</span><span class="v">Gốc + "staged change". Đây là thứ mà một commit ngay bây giờ sẽ ghi lại.</span></div>
  <div class="kv"><span class="k">Trong thư mục làm việc</span><span class="v">Gốc + "staged change" + "unstaged change". Thứ trình soạn thảo đang hiện.</span></div>
</div>
<p>Ba tiêu đề trong <code>git status</code> ứng chính xác với ba cái cây:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Changes to be committed</span><span class="lz-v">Khác biệt giữa <strong>HEAD và index</strong>. Đây là thứ commit kế tiếp sẽ chứa.</span></div>
  <div class="lz-layer"><span class="lz-k">Changes not staged for commit</span><span class="lz-v">Khác biệt giữa <strong>index và thư mục làm việc</strong>. Sửa đổi thật nhưng sẽ <em>không</em> nằm trong commit kế tiếp.</span></div>
  <div class="lz-layer"><span class="lz-k">Untracked files</span><span class="lz-v">File mà Git chưa từng được cho biết. Chúng không nằm trong cây nào cho tới khi bạn <code>git add</code> một lần.</span></div>
</div>

<h3>Được theo dõi vs chưa theo dõi — một phân biệt đáng nói chính xác</h3>
<p>Một file trở thành <strong>được theo dõi (tracked)</strong> ở lần đầu bạn <code>git add</code> nó. Từ đó Git canh chừng nó và báo cáo mọi sửa đổi. Trước đó nó <strong>chưa theo dõi (untracked)</strong>: Git liệt nó dưới mục "Untracked files" và ngoài ra bỏ qua hoàn toàn.</p>
<div class="callout warn">Đây là lý do <code>git commit -a</code> ("commit mọi thay đổi") <em>không</em> gồm file mới. Cờ <code>-a</code> nghĩa là "đưa vào staging mọi sửa đổi của các file <strong>đã được theo dõi</strong>", mà một file vừa tạo thì chưa được theo dõi. Đây là một trong những cú bất ngờ "nhưng tôi đã commit rồi mà!" phổ biến nhất — và bài 1.3 chỉ cách bắt nó trước khi push.</div>

<h3>Dạng ngắn mà bạn sẽ thật sự dùng</h3>
<pre><code>git status --short</code></pre>
<div class="out">MM a.txt
?? b.txt</div>
<p>Hai cột, và khi đã nhận ra quy luật bạn sẽ không quay lại dạng dài. Cột <strong>trái</strong> là index (HEAD → index), cột <strong>phải</strong> là thư mục làm việc (index → thư mục làm việc):</p>
<div class="kv-grid">
  <div class="kv"><span class="k">M_ </span><span class="v">Đã sửa và đã staging. Commit ngay bây giờ sẽ gồm nó.</span></div>
  <div class="kv"><span class="k">_M</span><span class="v">Đã sửa nhưng chưa staging. Commit ngay bây giờ sẽ <em>không</em> gồm thay đổi này.</span></div>
  <div class="kv"><span class="k">MM</span><span class="v">Cả hai — đúng cái <code>a.txt</code> của ta. Một phần thay đổi đã staging, một phần thì chưa.</span></div>
  <div class="kv"><span class="k">A_ · ?? · D_</span><span class="v">Mới thêm vào theo dõi · chưa theo dõi · đã xoá.</span></div>
</div>

<a class="link-card" href="https://git-scm.com/book/vi/v2/C%C4%83n-B%E1%BA%A3n-Git-Ghi-Nh%E1%BA%ADn-Thay-%C4%90%E1%BB%95i-V%C3%A0o-Kho-Ch%E1%BB%A9a" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 2.2 (tiếng Việt) — Ghi nhận thay đổi vào kho chứa</span><span class="lc-sub">Sơ đồ vòng đời tracked / untracked / staged trong sách chính thức.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đưa một file vào cả ba trạng thái rồi đọc status</span><span class="lc-sub">Bài tập Code Lab luyện đúng phân biệt MM / _M / ??.</span></span>
</a>

<div class="pitfall"><strong>Lỗi kinh điển của người mới:</strong> bạn <code>git add file.js</code>, rồi sửa tiếp <code>file.js</code>, rồi <code>git commit</code>. Chỉ phiên bản bạn đã staging được commit — những sửa đổi cuối vẫn nằm ở thư mục làm việc. Không có gì cảnh báo bạn cả. Thói quen phòng nó: chạy <code>git diff --staged</code> ngay trước khi commit và đọc xem thứ gì thật sự sắp được ghi.</div>
<p class="note-ct"><strong>Mang điều này theo suốt các chương sau:</strong> khi một lệnh Git làm bạn rối, hãy hỏi "lệnh này đụng vào cây nào trong ba cây?". <code>git checkout</code>, <code>git restore</code>, <code>git reset</code> và <code>git stash</code> đều bí hiểm cho tới khi bạn nhận ra chúng chỉ khác nhau ở <em>chỗ chúng đổi cây nào</em> — một bảng mà bạn sẽ dựng ở Chương 4.</p>
</div>
`,
    },

    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — What a commit really is: snapshots, hashes & parents|||1.2 — Một commit thật sự là gì: ảnh chụp, mã băm & commit cha',
      slug: 'git-1-2-commit-la-gi',
      type: 'LESSON',
      description: 'Commit không lưu "những dòng đã đổi" — nó lưu một ảnh chụp toàn dự án. Mã băm SHA đến từ đâu, vì sao đổi một ký tự trong quá khứ làm đổi mọi mã băm sau đó, và commit cha tạo nên lịch sử ra sao.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>A commit is a photograph, not a receipt</h2>
<p class="lead">Almost everyone's first mental model of Git is wrong in the same way: they picture a commit as a list of changes — "line 12 changed, line 40 deleted". It is not. <strong>A commit stores the complete state of every tracked file at that moment.</strong> Git shows you differences because differences are useful to read, but it computes them on demand from two full snapshots.</p>

<h3>What is inside one commit</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">tree</span><span class="lz-v">A pointer to the full directory listing at that moment — every file and folder, with the content of each.</span></div>
  <div class="lz-layer"><span class="lz-k">parent</span><span class="lz-v">The commit that came before. Zero parents for the very first commit; two for a merge commit.</span></div>
  <div class="lz-layer"><span class="lz-k">author + committer</span><span class="lz-v">Name, email and timestamp. Two of them, because a rebase or a patch can rewrite the committer while preserving the original author.</span></div>
  <div class="lz-layer"><span class="lz-k">message</span><span class="lz-v">Your explanation of why. The only part Git cannot generate for you — and the part your future self will read.</span></div>
</div>
<p>You can see all of it with plumbing commands. This is real output from the playground repository:</p>
<pre><code>git cat-file -p HEAD</code></pre>
<div class="out">tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904
parent 8f3c1a2d9e0b4f6a1c3d5e7f9a0b2c4d6e8f0a12
author Nguyen Van An &lt;an@example.com&gt; 1755820800 +0700
committer Nguyen Van An &lt;an@example.com&gt; 1755820800 +0700

commit number 10</div>
<p>That is the entire commit — four lines of metadata and a message. There is no diff anywhere in it. Chapter 9 opens the <code>tree</code> object and goes further down; for now, notice how small and how simple this is.</p>

<h3>"But surely storing every file every time is wasteful?"</h3>
<p>It would be, if Git stored duplicates — and it does not. Content is addressed <strong>by its hash</strong>, so a file that did not change between two commits is stored exactly once and referenced by both trees. A commit touching one file in a 5,000-file project adds one new file object, one or two new tree objects, and one commit object. The rest is pointers.</p>
<div class="callout ok">This is why <code>git checkout</code> of a ten-year-old commit is instant, while a system that stores diffs would have to replay ten years of patches. Snapshots trade a little disk for a lot of speed — and thanks to content addressing plus compression, they often use <em>less</em> disk than the diff-based systems they replaced.</div>

<h3>Where the hash comes from</h3>
<p>Every object in Git — file content, directory listing, commit — is stored under the SHA-1 hash of its own bytes. Anything you can name in Git, you name by content:</p>
<pre><code><span class="tok-comment"># The hash of a piece of content, computed the way Git computes it:</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"hello"</span> | git hash-object --stdin</code></pre>
<div class="out">ce013625030ba8dba906f756967f9e9ca394464a</div>
<p>Run that on any machine on earth and you get the same 40 characters, because the hash is a pure function of the content. Two consequences follow, and both matter:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Deduplication is automatic</span><span class="v">The same content in two files, or the same file in a hundred commits, is one object. Nothing is stored twice.</span></div>
  <div class="kv"><span class="k">History is tamper-evident</span><span class="v">A commit's hash covers its tree, its parent's hash, the author and the message. Change any of it and the hash changes — and so does every commit after it, because each one names its parent by hash.</span></div>
</div>

<h3>The chain — and why rewriting history renames everything</h3>
<div class="lz-map">
  <div class="lz-stage">A commit names its parent by hash, so the chain is welded</div>
  <div class="lz-node"><div class="lz-badge">A</div><div class="lz-nbody"><div class="lz-ntitle">8f3c1a2 — "first commit"</div><div class="lz-nsub">parent: none. The root of the project.</div></div></div>
  <div class="lz-node"><div class="lz-badge">B</div><div class="lz-nbody"><div class="lz-ntitle">5d6e7f8 — "add login form"</div><div class="lz-nsub">parent: 8f3c1a2. Its hash covers that parent hash.</div></div></div>
  <div class="lz-node"><div class="lz-badge">C</div><div class="lz-nbody"><div class="lz-ntitle">1a2b3c4 — "fix validation"</div><div class="lz-nsub">parent: 5d6e7f8. And so on, all the way back to the root.</div></div></div>
</div>
<p>Now edit the message of commit B. Its bytes change, so its hash changes — and C's stored parent hash no longer matches, so C must be rewritten too, which changes <em>its</em> hash. <strong>Rewriting one commit rewrites every commit after it.</strong></p>
<div class="callout warn">That single fact explains all of Chapter 8. When you amend, squash or rebase, you are not editing commits — you are <em>creating new ones</em> and abandoning the old. Locally that is harmless. Once other people have the old hashes, their history and yours have silently diverged, which is why rewriting shared history needs a conversation first.</div>

<h3>Naming commits without typing 40 characters</h3>
<pre><code>git show 1a2b3c4          <span class="tok-comment"># a unique prefix is enough — usually 7 characters</span>
git show HEAD             <span class="tok-comment"># where you are now</span>
git show HEAD~1           <span class="tok-comment"># one commit back (parent)</span>
git show HEAD~3           <span class="tok-comment"># three commits back</span>
git show main             <span class="tok-comment"># the commit the branch main points at</span>
git show HEAD^2           <span class="tok-comment"># the SECOND parent — only meaningful on a merge commit</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">~ (tilde)</span><span class="v">Walk <em>back</em> N generations, always following the first parent. <code>HEAD~2</code> = grandparent.</span></div>
  <div class="kv"><span class="k">^ (caret)</span><span class="v">Select <em>which</em> parent. <code>HEAD^1</code> is the first parent (same as <code>HEAD~1</code>), <code>HEAD^2</code> the second — the branch that was merged in.</span></div>
</div>

<h3>SHA-1, and the collision question</h3>
<p>Git historically used SHA-1, which is broken for adversarial use — a researcher can construct two different files with the same hash. Git 2.13+ ships collision detection that rejects the known attack patterns, and Git has an in-progress migration to SHA-256. For everyday work the practical answer is: accidental collisions do not happen, and deliberate ones are detected. Do not build a security control on top of a bare commit hash; do rely on hashes to identify content.</p>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Internals-Git-Objects" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 10.2 — Git Objects</span><span class="lc-sub">blob, tree, commit and tag, built up by hand with plumbing commands.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/gitrevisions" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">gitrevisions — every way to name a commit</span><span class="lc-sub">~ and ^, ranges, <code>@{2 days ago}</code>, <code>:/text in message</code>. Worth skimming once.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> assuming <code>HEAD^2</code> means "two commits back". It means "the <em>second parent</em>", which only exists on a merge commit — on an ordinary commit Git errors out. Two commits back is <code>HEAD~2</code>. The mix-up is harmless with <code>show</code> and expensive with <code>reset</code>.</div>
<p class="note-ct"><strong>The sentence to remember:</strong> a commit is an immutable snapshot plus a parent pointer, named by the hash of its own contents. Everything else in Git — branches, tags, merges, rebases, the reflog — is bookkeeping about <em>which</em> snapshot you care about right now.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Một commit là một tấm ảnh, không phải một tờ biên lai</h2>
<p class="lead">Mô hình đầu tiên trong đầu gần như ai cũng sai theo cùng một kiểu: họ hình dung commit là một danh sách thay đổi — "dòng 12 đổi, dòng 40 xoá". Không phải vậy. <strong>Một commit lưu trạng thái ĐẦY ĐỦ của mọi file được theo dõi tại thời điểm đó.</strong> Git cho bạn xem phần khác biệt vì phần khác biệt dễ đọc, nhưng nó tính ra khi cần từ hai ảnh chụp đầy đủ.</p>

<h3>Bên trong một commit có gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">tree</span><span class="lz-v">Con trỏ tới danh sách thư mục đầy đủ tại thời điểm đó — mọi file và thư mục, kèm nội dung từng cái.</span></div>
  <div class="lz-layer"><span class="lz-k">parent</span><span class="lz-v">Commit đứng trước. Không có cha với commit đầu tiên; hai cha với một commit hợp nhất.</span></div>
  <div class="lz-layer"><span class="lz-k">author + committer</span><span class="lz-v">Tên, email và dấu thời gian. Có hai, vì một lần rebase hay một bản vá có thể ghi lại người commit trong khi giữ nguyên tác giả gốc.</span></div>
  <div class="lz-layer"><span class="lz-k">message</span><span class="lz-v">Lời giải thích VÌ SAO của bạn. Phần duy nhất Git không sinh hộ được — và là phần chính bạn trong tương lai sẽ đọc.</span></div>
</div>
<p>Bạn xem được tất cả bằng các lệnh cấp thấp. Đây là output thật từ kho nháp:</p>
<pre><code>git cat-file -p HEAD</code></pre>
<div class="out">tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904
parent 8f3c1a2d9e0b4f6a1c3d5e7f9a0b2c4d6e8f0a12
author Nguyen Van An &lt;an@example.com&gt; 1755820800 +0700
committer Nguyen Van An &lt;an@example.com&gt; 1755820800 +0700

commit number 10</div>
<p>Đó là TOÀN BỘ commit — bốn dòng siêu dữ liệu và một lời nhắn. Không có diff nào trong đó cả. Chương 9 sẽ mở đối tượng <code>tree</code> ra và đi sâu hơn; còn giờ, hãy để ý nó nhỏ và đơn giản đến mức nào.</p>

<h3>"Nhưng lưu mọi file mỗi lần thì phí quá chứ?"</h3>
<p>Sẽ phí, nếu Git lưu bản trùng — mà nó không. Nội dung được định danh <strong>bằng mã băm của nó</strong>, nên một file không đổi giữa hai commit chỉ được lưu đúng một lần và được cả hai tree trỏ tới. Một commit chạm vào một file trong dự án 5.000 file chỉ thêm một đối tượng file mới, một hai đối tượng tree mới, và một đối tượng commit. Phần còn lại là con trỏ.</p>
<div class="callout ok">Vì thế <code>git checkout</code> một commit mười năm tuổi chạy tức thì, trong khi một hệ lưu bản khác biệt sẽ phải phát lại mười năm bản vá. Ảnh chụp đổi một chút đĩa lấy rất nhiều tốc độ — và nhờ định danh theo nội dung cộng nén, chúng thường tốn <em>ít</em> đĩa hơn chính các hệ dựa-trên-diff mà chúng thay thế.</div>

<h3>Mã băm đến từ đâu</h3>
<p>Mọi đối tượng trong Git — nội dung file, danh sách thư mục, commit — đều được lưu dưới mã băm SHA-1 của chính các byte của nó. Bất cứ thứ gì bạn gọi tên được trong Git, bạn gọi tên nó bằng nội dung:</p>
<pre><code><span class="tok-comment"># Mã băm của một mẩu nội dung, tính đúng cách Git tính:</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"hello"</span> | git hash-object --stdin</code></pre>
<div class="out">ce013625030ba8dba906f756967f9e9ca394464a</div>
<p>Chạy nó trên bất kỳ máy nào trên trái đất bạn cũng nhận đúng 40 ký tự đó, vì mã băm là một hàm thuần tuý của nội dung. Hai hệ quả theo sau, và cả hai đều quan trọng:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Khử trùng lặp tự động</span><span class="v">Cùng một nội dung ở hai file, hay cùng một file trong một trăm commit, chỉ là một đối tượng. Không gì bị lưu hai lần.</span></div>
  <div class="kv"><span class="k">Lịch sử tố cáo việc sửa lén</span><span class="v">Mã băm của một commit bao gồm cả tree, mã băm của cha, tác giả và lời nhắn. Đổi bất cứ thứ gì thì mã băm đổi — và mọi commit sau đó cũng đổi, vì mỗi cái gọi tên cha mình bằng mã băm.</span></div>
</div>

<h3>Sợi xích — và vì sao viết lại lịch sử đổi tên mọi thứ</h3>
<div class="lz-map">
  <div class="lz-stage">Một commit gọi tên cha bằng mã băm, nên sợi xích được hàn chặt</div>
  <div class="lz-node"><div class="lz-badge">A</div><div class="lz-nbody"><div class="lz-ntitle">8f3c1a2 — "first commit"</div><div class="lz-nsub">cha: không có. Gốc của dự án.</div></div></div>
  <div class="lz-node"><div class="lz-badge">B</div><div class="lz-nbody"><div class="lz-ntitle">5d6e7f8 — "add login form"</div><div class="lz-nsub">cha: 8f3c1a2. Mã băm của nó bao gồm luôn mã băm của cha đó.</div></div></div>
  <div class="lz-node"><div class="lz-badge">C</div><div class="lz-nbody"><div class="lz-ntitle">1a2b3c4 — "fix validation"</div><div class="lz-nsub">cha: 5d6e7f8. Cứ thế, suốt đường về tận gốc.</div></div></div>
</div>
<p>Giờ hãy sửa lời nhắn của commit B. Các byte của nó đổi, nên mã băm đổi — và mã băm cha mà C lưu không còn khớp, nên C cũng phải viết lại, làm đổi luôn mã băm <em>của nó</em>. <strong>Viết lại một commit là viết lại mọi commit sau nó.</strong></p>
<div class="callout warn">Chỉ một sự thật đó giải thích cả Chương 8. Khi bạn amend, gộp hay rebase, bạn không sửa các commit — bạn <em>tạo ra những cái mới</em> và bỏ rơi cái cũ. Ở cục bộ thì vô hại. Khi người khác đã có mã băm cũ, lịch sử của họ và của bạn âm thầm phân ly — vì thế viết lại lịch sử đã chia sẻ cần một cuộc trò chuyện trước.</div>

<h3>Gọi tên commit mà không phải gõ 40 ký tự</h3>
<pre><code>git show 1a2b3c4          <span class="tok-comment"># một tiền tố duy nhất là đủ — thường 7 ký tự</span>
git show HEAD             <span class="tok-comment"># chỗ bạn đang đứng</span>
git show HEAD~1           <span class="tok-comment"># lùi một commit (cha)</span>
git show HEAD~3           <span class="tok-comment"># lùi ba commit</span>
git show main             <span class="tok-comment"># commit mà nhánh main đang trỏ tới</span>
git show HEAD^2           <span class="tok-comment"># cha THỨ HAI — chỉ có nghĩa trên commit hợp nhất</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">~ (dấu ngã)</span><span class="v">Đi <em>lùi</em> N đời, luôn theo cha thứ nhất. <code>HEAD~2</code> = ông nội.</span></div>
  <div class="kv"><span class="k">^ (dấu mũ)</span><span class="v">Chọn cha <em>nào</em>. <code>HEAD^1</code> là cha thứ nhất (giống <code>HEAD~1</code>), <code>HEAD^2</code> là cha thứ hai — nhánh đã được hợp nhất vào.</span></div>
</div>

<h3>SHA-1, và câu hỏi về đụng độ</h3>
<p>Về lịch sử Git dùng SHA-1, thuật toán đã bị phá với mục đích tấn công — người ta dựng được hai file khác nhau có cùng mã băm. Git 2.13 trở lên kèm cơ chế phát hiện đụng độ, từ chối các mẫu tấn công đã biết, và Git đang trong quá trình chuyển sang SHA-256. Với việc hằng ngày, câu trả lời thực dụng là: đụng độ ngẫu nhiên không xảy ra, còn đụng độ cố ý thì bị phát hiện. Đừng xây một cơ chế bảo mật dựa trên một mã băm commit trần; nhưng cứ yên tâm dùng mã băm để định danh nội dung.</p>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Internals-Git-Objects" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 10.2 — Git Objects</span><span class="lc-sub">blob, tree, commit và tag, dựng bằng tay qua các lệnh cấp thấp.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/gitrevisions" target="_blank" rel="noopener">
  <span class="lc-ico">🎯</span>
  <span class="lc-body"><span class="lc-title">gitrevisions — mọi cách gọi tên một commit</span><span class="lc-sub">~ và ^, khoảng, <code>@{2 days ago}</code>, <code>:/chữ trong lời nhắn</code>. Đáng đọc lướt một lần.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tưởng <code>HEAD^2</code> nghĩa là "lùi hai commit". Nó nghĩa là "cha <em>thứ hai</em>", thứ chỉ tồn tại trên commit hợp nhất — trên commit thường Git báo lỗi. Lùi hai commit là <code>HEAD~2</code>. Nhầm lẫn này vô hại với <code>show</code> và rất đắt với <code>reset</code>.</div>
<p class="note-ct"><strong>Câu cần nhớ:</strong> một commit là một ảnh chụp bất biến cộng một con trỏ tới cha, được đặt tên bằng mã băm của chính nội dung nó. Mọi thứ khác trong Git — nhánh, tag, hợp nhất, rebase, reflog — đều là sổ sách ghi chép xem <em>ảnh chụp nào</em> là thứ bạn đang quan tâm lúc này.</p>
</div>
`,
    },

    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — The everyday loop: add, commit, diff — and add -p|||1.3 — Vòng lặp hằng ngày: add, commit, diff — và add -p',
      slug: 'git-1-3-vong-lap-hang-ngay',
      type: 'LESSON',
      description: 'Vòng lặp bạn chạy hàng chục lần mỗi ngày, ba dạng của git diff và cái nào trả lời câu hỏi nào, staging từng đoạn với add -p, và cách gỡ một thứ ra khỏi staging mà không mất công.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>The loop you will run ten thousand times</h2>
<p class="lead">Four commands make up ninety per cent of daily Git. What separates a tidy repository from a messy one is not knowing more commands — it is using these four <em>deliberately</em>.</p>
<pre><code>git status            <span class="tok-comment"># where am I, what changed</span>
git diff              <span class="tok-comment"># what exactly changed, in the working directory</span>
git add &lt;paths&gt;       <span class="tok-comment"># choose what belongs in the next commit</span>
git commit -m <span class="tok-string">"…"</span>     <span class="tok-comment"># seal it, with an explanation</span></code></pre>

<h3>The three faces of git diff</h3>
<p>This trips up nearly everyone, and it is the direct consequence of the three trees from 1.1. <code>git diff</code> compares two of the three, and <em>which two</em> depends on the flag:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">git diff</span><span class="lz-v">index ↔ working directory. "What have I changed that is <strong>not yet staged</strong>?"</span></div>
  <div class="lz-layer"><span class="lz-k">git diff --staged</span><span class="lz-v">HEAD ↔ index. "What <strong>exactly</strong> will my next commit contain?" (<code>--cached</code> is the same flag, older name.)</span></div>
  <div class="lz-layer"><span class="lz-k">git diff HEAD</span><span class="lz-v">HEAD ↔ working directory. "What have I changed in total since the last commit, staged or not?"</span></div>
</div>
<div class="callout ok">Make <code>git diff --staged</code> the last thing you run before every commit. It is the only view that shows what you are actually about to record — and it catches the classic mistake from 1.1 (staged an old version, kept editing) plus the worse one: a stray <code>console.log</code> or a hard-coded password riding along.</div>

<h3>Reading a diff</h3>
<pre><code>git diff</code></pre>
<div class="out">diff --git a/src/auth.js b/src/auth.js
index 7c4a1b2..9e8f3d1 100644
--- a/src/auth.js
+++ b/src/auth.js
@@ -12,7 +12,7 @@ function login(email, password) {
   const user = await findUser(email);
   if (!user) return null;
-  if (user.password === password) {
+  if (await bcrypt.compare(password, user.passwordHash)) {
     return signToken(user);
   }</div>
<div class="kv-grid">
  <div class="kv"><span class="k">a/ and b/</span><span class="v">The two sides: <code>a</code> is the "before", <code>b</code> is the "after". Not directories — just labels.</span></div>
  <div class="kv"><span class="k">@@ -12,7 +12,7 @@</span><span class="v">The hunk header: from the old file, 7 lines starting at line 12; in the new file, 7 lines starting at line 12.</span></div>
  <div class="kv"><span class="k">- and +</span><span class="v">Removed and added. A "changed" line always appears as one of each — Git has no concept of an edited line.</span></div>
  <div class="kv"><span class="k">Unprefixed lines</span><span class="v">Context, shown so you can read the change in place. Three lines each side by default; <code>-U10</code> gives you ten.</span></div>
</div>
<p>Two flags worth knowing on the day a diff is unreadable:</p>
<pre><code>git diff --word-diff       <span class="tok-comment"># highlight changed WORDS — for prose and long lines</span>
git diff --stat            <span class="tok-comment"># just the summary: which files, how many lines</span></code></pre>
<div class="out"> src/auth.js      | 2 +-
 src/routes.js    | 14 ++++++++++++--
 2 files changed, 14 insertions(+), 2 deletions(-)</div>

<h3>Choosing what to stage</h3>
<pre><code>git add src/auth.js          <span class="tok-comment"># one file</span>
git add src/                 <span class="tok-comment"># a whole directory</span>
git add .                    <span class="tok-comment"># everything below the current directory</span>
git add -u                   <span class="tok-comment"># only files ALREADY tracked (no new files)</span>
git add -A                   <span class="tok-comment"># everything, including deletions, across the whole repo</span></code></pre>
<div class="callout warn"><code>git add .</code> is a habit worth breaking. It sweeps in whatever happens to be lying around — a <code>.env</code> you were testing with, a 40 MB debug log, a scratch file. Naming the paths you mean takes three extra seconds and is the cheapest security control in this course. When you do use it, follow it with <code>git diff --staged --stat</code> and actually read the list.</div>

<h3>git add -p: the feature that justifies the staging area</h3>
<p>When one file contains two unrelated changes, stage them separately. <code>-p</code> (patch) walks you through hunk by hunk:</p>
<pre><code>git add -p src/auth.js</code></pre>
<div class="out">@@ -12,7 +12,7 @@ function login(email, password) {
-  if (user.password === password) {
+  if (await bcrypt.compare(password, user.passwordHash)) {
(1/2) Stage this hunk [y,n,q,a,d,j,J,g,/,s,e,?]?</div>
<div class="kv-grid">
  <div class="kv"><span class="k">y / n</span><span class="v">Stage this hunk · skip it.</span></div>
  <div class="kv"><span class="k">s</span><span class="v"><strong>Split</strong> the hunk into smaller ones. The one you will reach for most.</span></div>
  <div class="kv"><span class="k">e</span><span class="v">Edit the hunk by hand — stage individual lines when even a split is too coarse.</span></div>
  <div class="kv"><span class="k">q / a / d</span><span class="v">Quit · stage this and all remaining hunks in the file · skip this and all remaining.</span></div>
</div>
<p>The result is a commit containing only the security fix, and a second containing only the rename — reviewable separately, revertable separately.</p>

<h3>Committing</h3>
<pre><code>git commit -m <span class="tok-string">"fix: hash passwords with bcrypt instead of comparing plaintext"</span>
git commit                       <span class="tok-comment"># opens your editor for a full message (see 1.4)</span>
git commit -a -m <span class="tok-string">"…"</span>            <span class="tok-comment"># stage all tracked modifications, then commit</span>
git commit --amend               <span class="tok-comment"># replace the LAST commit (Chapter 8)</span></code></pre>
<div class="out">[main 3f8a1c9] fix: hash passwords with bcrypt instead of comparing plaintext
 1 file changed, 1 insertion(+), 1 deletion(-)</div>
<p>Read that confirmation line: branch, new short hash, subject, and the file/line counts. If the counts surprise you, you staged something you did not mean to — <code>git reset --soft HEAD~1</code> puts it all back in the index, unharmed, so you can redo it.</p>

<h3>Unstaging without losing work</h3>
<pre><code>git restore --staged src/auth.js   <span class="tok-comment"># index ← HEAD. Your edits stay in the working dir.</span>
git restore src/auth.js            <span class="tok-comment"># working dir ← index. DESTROYS your unstaged edits.</span></code></pre>
<div class="callout danger">Those two lines differ by one flag and one is destructive. <code>git restore --staged</code> only rewinds the index — completely safe. <code>git restore</code> without the flag overwrites the file on disk, and uncommitted content is the one thing Git genuinely cannot bring back. Read the flag twice.</div>
<p>Modern Git splits these deliberately: <code>git switch</code> for branches, <code>git restore</code> for file content. The old <code>git checkout</code> did both jobs, which is exactly why it confused everybody for fifteen years.</p>

<a class="link-card" href="https://git-scm.com/docs/git-add#Documentation/git-add.txt---patch" target="_blank" rel="noopener">
  <span class="lc-ico">✂️</span>
  <span class="lc-body"><span class="lc-title">git add --patch — the interactive mode reference</span><span class="lc-sub">Every key in the hunk prompt, including the ones nobody remembers.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: split one messy file into two clean commits</span><span class="lc-sub">The Code Lab exercise for <code>add -p</code>, with a graded solution.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>git commit -am "…"</code> as a reflex. The <code>-a</code> silently skips untracked files, so the new module you just created is not in the commit — and the build fails for everyone else while passing locally, because your working directory has the file and theirs does not. If you use <code>-am</code>, glance at <code>git status</code> first for anything marked <code>??</code>.</div>
<p class="note-ct"><strong>The habit that pays for itself:</strong> commit small and commit often, locally. A commit is cheap, private until you push, and endlessly reshapeable afterwards (Chapter 8). Ten small commits can always be squashed into one before review; one giant commit can almost never be split back apart.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Vòng lặp bạn sẽ chạy mười nghìn lần</h2>
<p class="lead">Bốn lệnh chiếm chín mươi phần trăm việc dùng Git hằng ngày. Thứ phân biệt một kho mã gọn gàng với một kho bừa bộn không phải là biết nhiều lệnh hơn — mà là dùng bốn lệnh này một cách <em>có chủ ý</em>.</p>
<pre><code>git status            <span class="tok-comment"># tôi đang ở đâu, cái gì đã đổi</span>
git diff              <span class="tok-comment"># chính xác cái gì đã đổi, ở thư mục làm việc</span>
git add &lt;đường dẫn&gt;   <span class="tok-comment"># chọn thứ thuộc về commit kế tiếp</span>
git commit -m <span class="tok-string">"…"</span>     <span class="tok-comment"># niêm phong lại, kèm lời giải thích</span></code></pre>

<h3>Ba khuôn mặt của git diff</h3>
<p>Chỗ này làm gần như ai cũng vấp, và nó là hệ quả trực tiếp của ba cái cây ở bài 1.1. <code>git diff</code> so hai trong ba cây, và <em>hai cái nào</em> phụ thuộc vào cờ:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">git diff</span><span class="lz-v">index ↔ thư mục làm việc. "Tôi đã đổi gì mà <strong>chưa đưa vào staging</strong>?"</span></div>
  <div class="lz-layer"><span class="lz-k">git diff --staged</span><span class="lz-v">HEAD ↔ index. "Commit kế tiếp của tôi sẽ chứa <strong>chính xác</strong> những gì?" (<code>--cached</code> là cùng cờ, tên cũ.)</span></div>
  <div class="lz-layer"><span class="lz-k">git diff HEAD</span><span class="lz-v">HEAD ↔ thư mục làm việc. "Tính tổng, tôi đã đổi gì từ commit gần nhất, staging hay chưa?"</span></div>
</div>
<div class="callout ok">Hãy để <code>git diff --staged</code> là việc cuối cùng bạn chạy trước mỗi commit. Nó là góc nhìn duy nhất cho thấy thứ bạn thật sự sắp ghi lại — và nó bắt được lỗi kinh điển ở bài 1.1 (staging bản cũ rồi sửa tiếp) cộng thêm lỗi tệ hơn: một <code>console.log</code> lạc hay một mật khẩu viết cứng đi ké.</div>

<h3>Đọc một diff</h3>
<pre><code>git diff</code></pre>
<div class="out">diff --git a/src/auth.js b/src/auth.js
index 7c4a1b2..9e8f3d1 100644
--- a/src/auth.js
+++ b/src/auth.js
@@ -12,7 +12,7 @@ function login(email, password) {
   const user = await findUser(email);
   if (!user) return null;
-  if (user.password === password) {
+  if (await bcrypt.compare(password, user.passwordHash)) {
     return signToken(user);
   }</div>
<div class="kv-grid">
  <div class="kv"><span class="k">a/ và b/</span><span class="v">Hai phía: <code>a</code> là "trước", <code>b</code> là "sau". Không phải thư mục — chỉ là nhãn.</span></div>
  <div class="kv"><span class="k">@@ -12,7 +12,7 @@</span><span class="v">Đầu đoạn: ở file cũ, 7 dòng bắt đầu từ dòng 12; ở file mới, 7 dòng bắt đầu từ dòng 12.</span></div>
  <div class="kv"><span class="k">- và +</span><span class="v">Xoá đi và thêm vào. Một dòng "bị sửa" luôn hiện thành một cặp — Git không có khái niệm dòng-được-sửa.</span></div>
  <div class="kv"><span class="k">Dòng không có tiền tố</span><span class="v">Ngữ cảnh, hiện ra để bạn đọc thay đổi tại chỗ. Mặc định ba dòng mỗi phía; <code>-U10</code> cho bạn mười.</span></div>
</div>
<p>Hai cờ đáng biết cho ngày mà một diff không đọc nổi:</p>
<pre><code>git diff --word-diff       <span class="tok-comment"># tô đậm TỪ đã đổi — hợp với văn xuôi và dòng dài</span>
git diff --stat            <span class="tok-comment"># chỉ phần tóm tắt: file nào, bao nhiêu dòng</span></code></pre>
<div class="out"> src/auth.js      | 2 +-
 src/routes.js    | 14 ++++++++++++--
 2 files changed, 14 insertions(+), 2 deletions(-)</div>

<h3>Chọn thứ đưa vào staging</h3>
<pre><code>git add src/auth.js          <span class="tok-comment"># một file</span>
git add src/                 <span class="tok-comment"># cả một thư mục</span>
git add .                    <span class="tok-comment"># mọi thứ dưới thư mục hiện tại</span>
git add -u                   <span class="tok-comment"># chỉ những file ĐÃ được theo dõi (không có file mới)</span>
git add -A                   <span class="tok-comment"># mọi thứ, kể cả xoá, trên toàn kho</span></code></pre>
<div class="callout warn"><code>git add .</code> là một thói quen đáng bỏ. Nó vơ luôn bất cứ thứ gì tình cờ đang nằm đó — một <code>.env</code> bạn đang thử, một file log gỡ lỗi 40 MB, một file nháp. Gõ đúng đường dẫn bạn muốn tốn thêm ba giây và là biện pháp bảo mật rẻ nhất trong khoá này. Khi buộc phải dùng nó, hãy chạy tiếp <code>git diff --staged --stat</code> và thật sự đọc danh sách.</div>

<h3>git add -p: tính năng biện minh cho sự tồn tại của vùng staging</h3>
<p>Khi một file chứa hai thay đổi không liên quan, hãy đưa chúng vào staging riêng. <code>-p</code> (patch) dắt bạn đi qua từng đoạn:</p>
<pre><code>git add -p src/auth.js</code></pre>
<div class="out">@@ -12,7 +12,7 @@ function login(email, password) {
-  if (user.password === password) {
+  if (await bcrypt.compare(password, user.passwordHash)) {
(1/2) Stage this hunk [y,n,q,a,d,j,J,g,/,s,e,?]?</div>
<div class="kv-grid">
  <div class="kv"><span class="k">y / n</span><span class="v">Đưa đoạn này vào staging · bỏ qua nó.</span></div>
  <div class="kv"><span class="k">s</span><span class="v"><strong>Chẻ (split)</strong> đoạn thành các đoạn nhỏ hơn. Phím bạn dùng nhiều nhất.</span></div>
  <div class="kv"><span class="k">e</span><span class="v">Sửa đoạn bằng tay — chọn từng dòng khi chẻ vẫn còn quá thô.</span></div>
  <div class="kv"><span class="k">q / a / d</span><span class="v">Thoát · lấy đoạn này và mọi đoạn còn lại của file · bỏ đoạn này và mọi đoạn còn lại.</span></div>
</div>
<p>Kết quả là một commit chỉ chứa bản vá bảo mật, và một commit thứ hai chỉ chứa việc đổi tên — review riêng được, hoàn tác riêng được.</p>

<h3>Commit</h3>
<pre><code>git commit -m <span class="tok-string">"fix: băm mật khẩu bằng bcrypt thay vì so sánh chữ thô"</span>
git commit                       <span class="tok-comment"># mở trình soạn thảo cho lời nhắn đầy đủ (xem 1.4)</span>
git commit -a -m <span class="tok-string">"…"</span>            <span class="tok-comment"># staging mọi sửa đổi của file đã theo dõi, rồi commit</span>
git commit --amend               <span class="tok-comment"># thay thế commit CUỐI CÙNG (Chương 8)</span></code></pre>
<div class="out">[main 3f8a1c9] fix: bam mat khau bang bcrypt thay vi so sanh chu tho
 1 file changed, 1 insertion(+), 1 deletion(-)</div>
<p>Hãy đọc dòng xác nhận đó: nhánh, mã băm ngắn mới, tiêu đề, và số file/số dòng. Nếu con số làm bạn ngạc nhiên thì bạn đã staging thứ không định — <code>git reset --soft HEAD~1</code> trả tất cả về index, nguyên vẹn, để bạn làm lại.</p>

<h3>Gỡ khỏi staging mà không mất công</h3>
<pre><code>git restore --staged src/auth.js   <span class="tok-comment"># index ← HEAD. Sửa đổi của bạn vẫn ở thư mục làm việc.</span>
git restore src/auth.js            <span class="tok-comment"># thư mục làm việc ← index. XOÁ sửa đổi chưa staging.</span></code></pre>
<div class="callout danger">Hai dòng đó khác nhau một cái cờ và một trong hai có tính phá huỷ. <code>git restore --staged</code> chỉ tua lại index — hoàn toàn an toàn. <code>git restore</code> không có cờ thì ghi đè file trên đĩa, mà nội dung chưa commit là thứ duy nhất Git thật sự không mang về được. Hãy đọc cái cờ hai lần.</div>
<p>Git đời mới tách hai việc này có chủ ý: <code>git switch</code> cho nhánh, <code>git restore</code> cho nội dung file. <code>git checkout</code> cũ làm cả hai việc, và đó chính là lý do nó làm mọi người rối suốt mười lăm năm.</p>

<a class="link-card" href="https://git-scm.com/docs/git-add#Documentation/git-add.txt---patch" target="_blank" rel="noopener">
  <span class="lc-ico">✂️</span>
  <span class="lc-body"><span class="lc-title">git add --patch — tài liệu chế độ tương tác</span><span class="lc-sub">Mọi phím trong lời nhắc từng đoạn, kể cả những phím không ai nhớ.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: chẻ một file bừa bộn thành hai commit sạch</span><span class="lc-sub">Bài tập Code Lab cho <code>add -p</code>, có lời giải chấm điểm.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>git commit -am "…"</code> theo phản xạ. Cái <code>-a</code> âm thầm bỏ qua file chưa theo dõi, nên module mới bạn vừa tạo KHÔNG nằm trong commit — và bản dựng hỏng với mọi người khác trong khi vẫn chạy tốt ở máy bạn, vì thư mục làm việc của bạn có file đó còn của họ thì không. Nếu dùng <code>-am</code>, hãy liếc <code>git status</code> trước xem có gì gắn dấu <code>??</code> không.</div>
<p class="note-ct"><strong>Thói quen tự trả công cho nó:</strong> commit nhỏ và commit thường xuyên, ở cục bộ. Một commit thì rẻ, riêng tư cho tới khi push, và sau đó vẫn nắn lại thoải mái (Chương 8). Mười commit nhỏ lúc nào cũng gộp được thành một trước khi review; một commit khổng lồ thì gần như không bao giờ chẻ lại được.</p>
</div>
`,
    },

    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — Commit messages that are still useful in a year|||1.4 — Lời nhắn commit một năm sau vẫn còn dùng được',
      slug: 'git-1-4-loi-nhan-commit',
      type: 'LESSON',
      description: 'Cấu trúc tiêu đề/thân bài, luật 50/72, thì mệnh lệnh và vì sao nó không phải chuyện màu mè, viết VÌ SAO thay vì CÁI GÌ, và mẫu Conventional Commits mà công cụ đọc được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>The only part of a commit a human writes</h2>
<p class="lead">Git generates the snapshot, the hash, the timestamp and the parent link. The message is the one thing that requires judgement — and the one thing that decides whether your history is an asset or noise. In two years nobody will read your code comments as often as they read <code>git log</code> while trying to work out why a line exists.</p>

<h3>The shape of a good message</h3>
<pre><code>fix: reject expired refresh tokens on /auth/refresh

A token whose exp had passed was still accepted because we called
jwt.verify with ignoreExpiration: true, which was added in 3f8a1c9 to
support the "verify then re-check the account" flow — but the re-check
never looked at exp.

Sessions therefore never really expired: a token from 40 days ago still
minted a fresh access token. Now we verify with ignoreExpiration and then
explicitly compare exp against now, so the refresh path enforces the same
lifetime as the access path.

Closes #412</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Subject</span><span class="lz-v">One line, ≤ 50 characters, imperative, no full stop. This is what <code>git log --oneline</code> shows and what a reviewer scans.</span></div>
  <div class="lz-layer"><span class="lz-k">Blank line</span><span class="lz-v">Mandatory. Git uses it to split subject from body; without it, tools treat the whole thing as one long subject.</span></div>
  <div class="lz-layer"><span class="lz-k">Body</span><span class="lz-v">Wrapped at 72 characters. Explains <strong>why</strong>, and what the reader would otherwise have to reconstruct.</span></div>
  <div class="lz-layer"><span class="lz-k">Trailers</span><span class="lz-v"><code>Closes #412</code>, <code>Co-authored-by:</code>, <code>Fixes:</code>. Machine-readable footers that GitHub and tooling act on.</span></div>
</div>

<h3>Why imperative mood is not a style preference</h3>
<p>Write "fix the leak", not "fixed the leak" or "fixes the leak". The reason is mechanical: Git itself writes messages in the imperative when it generates them — <code>Merge branch 'feature'</code>, <code>Revert "add cache"</code>. Your messages sit in the same list, and the mixed mood is jarring to read.</p>
<div class="callout ok">The test that settles every argument: a commit subject should complete the sentence <em>"If applied, this commit will …"</em>. "If applied, this commit will <strong>fix the leak</strong>" reads correctly. "If applied, this commit will <strong>fixed the leak</strong>" does not.</div>

<h3>Why, not what</h3>
<p>The diff already says what changed — perfectly, line by line, forever. The message should say what the diff cannot:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ "update auth.js"</span><span class="v">Adds nothing. The file name is already in the diff.</span></div>
  <div class="kv"><span class="k">❌ "fix bug"</span><span class="v">Which bug? Under what conditions? This is the message that costs a future colleague an hour.</span></div>
  <div class="kv"><span class="k">❌ "changes as requested"</span><span class="v">Requested by whom, and what were they? The review thread will be gone; the commit will not.</span></div>
  <div class="kv"><span class="k">✅ "fix: reject expired refresh tokens on /auth/refresh"</span><span class="v">Names the symptom, the endpoint, and the decision. Searchable, and complete on its own.</span></div>
</div>
<p>A body is worth writing whenever any of these is true, and skippable otherwise:</p>
<ul>
  <li>You chose one approach over an obvious alternative — record why, or someone will "fix" it back.</li>
  <li>The change looks wrong out of context (a magic number, a deliberate sleep, a disabled check).</li>
  <li>It fixes a bug — describe the symptom, so the next person searching the symptom finds this commit.</li>
  <li>It has a consequence elsewhere: a migration to run, an env var to set, a cache to clear.</li>
</ul>

<h3>Conventional Commits — structure a machine can read</h3>
<p>A widely used convention that turns the subject line into parseable data:</p>
<pre><code>&lt;type&gt;(&lt;optional scope&gt;): &lt;subject&gt;

feat(auth): add refresh token rotation
fix(feed): stop 500 when a post has no author
docs(readme): document the deploy script
refactor(api): extract pagination into a helper
test(auth): cover the expired-token path
chore(deps): bump prisma to 6.2.0
perf(feed): batch the author lookup into one query</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">feat / fix</span><span class="v">The two that matter for versioning: <code>feat</code> bumps the minor version, <code>fix</code> the patch, under semantic versioning (Chapter 7).</span></div>
  <div class="kv"><span class="k">BREAKING CHANGE:</span><span class="v">A footer, or a <code>!</code> after the type (<code>feat!:</code>). Bumps the major version and belongs in the changelog in bold.</span></div>
  <div class="kv"><span class="k">The payoff</span><span class="v">A changelog generates itself, releases version themselves, and <code>git log --grep "^fix"</code> answers "what did we fix this month?" in one command.</span></div>
</div>

<h3>Writing longer messages comfortably</h3>
<p>Running plain <code>git commit</code> opens your editor with a template. Give it a better one — a checklist you see every time:</p>
<pre><code><span class="tok-comment"># ~/.gitmessage.txt</span>
<span class="tok-comment"># &lt;type&gt;(&lt;scope&gt;): &lt;subject &lt;= 50 chars, imperative&gt;</span>
<span class="tok-comment">#</span>
<span class="tok-comment"># Why is this change needed? What was the behaviour before?</span>
<span class="tok-comment"># Wrap the body at 72 characters.</span>
<span class="tok-comment">#</span>
<span class="tok-comment"># Closes #</span>

git config --global commit.template ~/.gitmessage.txt</code></pre>
<p>Lines starting with <code>#</code> are stripped, so the template is pure prompting and never ends up in history.</p>

<h3>Reading your own history back</h3>
<pre><code>git log --oneline -10</code></pre>
<div class="out">3f8a1c9 fix: reject expired refresh tokens on /auth/refresh
9e2d4b7 feat(auth): add refresh token rotation
1c5f8a3 test(auth): cover the expired-token path
7b3e9d1 refactor(api): extract pagination into a helper</div>
<p>That is a history you can read at a glance a year later. Compare it to the alternative — <code>update</code>, <code>fix</code>, <code>fix again</code>, <code>asdf</code>, <code>final fix</code> — which is the same amount of work to type and worth nothing.</p>

<a class="link-card" href="https://www.conventionalcommits.org/en/v1.0.0/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Conventional Commits 1.0.0 — the specification</span><span class="lc-sub">Short, complete, and the basis of most automated changelog tooling.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-commit#_discussion" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">git-commit — the "Discussion" section</span><span class="lc-sub">Git's own guidance on subject/body and why the blank line is mandatory.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>git commit -m "long explanation with everything in one line because the editor is annoying"</code>. Without a blank line there is no body — the entire text becomes the subject, so <code>git log --oneline</code> becomes unreadable and GitHub truncates it in the PR list. If a message needs more than 50 characters, it needs a body: use <code>git commit</code> with no <code>-m</code>, or pass <code>-m</code> twice (the second becomes the body).</div>
<p class="note-ct"><strong>A calibration for how much to write:</strong> imagine the person who runs <code>git blame</code> on this line in eighteen months, sees your commit, and needs to decide whether the line is still needed. Write the message that answers <em>them</em>. Often that is one good subject line; occasionally it is three paragraphs, and those are the three paragraphs that save a day.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Phần duy nhất của một commit do con người viết</h2>
<p class="lead">Git sinh ra ảnh chụp, mã băm, dấu thời gian và liên kết tới cha. Lời nhắn là thứ duy nhất đòi hỏi phán đoán — và là thứ duy nhất quyết định lịch sử của bạn là tài sản hay tiếng ồn. Hai năm nữa sẽ không ai đọc chú thích trong mã của bạn nhiều bằng đọc <code>git log</code> khi cố hiểu vì sao một dòng tồn tại.</p>

<h3>Hình dạng của một lời nhắn tốt</h3>
<pre><code>fix: từ chối refresh token đã hết hạn ở /auth/refresh

Một token đã quá exp vẫn được chấp nhận vì ta gọi jwt.verify với
ignoreExpiration: true — thêm vào ở 3f8a1c9 để phục vụ luồng "xác minh
rồi kiểm lại tài khoản" — nhưng bước kiểm lại chưa bao giờ nhìn tới exp.

Hệ quả là phiên KHÔNG bao giờ hết hạn thật: một token từ 40 ngày trước
vẫn đúc ra được access token mới. Giờ ta xác minh với ignoreExpiration
rồi so exp với hiện tại một cách tường minh, để đường refresh áp đúng
tuổi thọ như đường access.

Closes #412</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Tiêu đề</span><span class="lz-v">Một dòng, ≤ 50 ký tự, thể mệnh lệnh, không dấu chấm cuối. Đây là thứ <code>git log --oneline</code> hiện ra và người review lướt qua.</span></div>
  <div class="lz-layer"><span class="lz-k">Dòng trống</span><span class="lz-v">Bắt buộc. Git dùng nó để tách tiêu đề khỏi thân; thiếu nó thì công cụ coi cả khối là một tiêu đề dài.</span></div>
  <div class="lz-layer"><span class="lz-k">Thân bài</span><span class="lz-v">Ngắt dòng ở 72 ký tự. Giải thích <strong>vì sao</strong>, và những gì người đọc nếu không có nó sẽ phải tự dựng lại.</span></div>
  <div class="lz-layer"><span class="lz-k">Chân (trailer)</span><span class="lz-v"><code>Closes #412</code>, <code>Co-authored-by:</code>, <code>Fixes:</code>. Những dòng chân máy đọc được mà GitHub và công cụ sẽ hành động theo.</span></div>
</div>

<h3>Vì sao thể mệnh lệnh không phải chuyện sở thích</h3>
<p>Viết "fix the leak", đừng viết "fixed the leak" hay "fixes the leak". Lý do rất cơ học: chính Git viết lời nhắn ở thể mệnh lệnh khi nó tự sinh — <code>Merge branch 'feature'</code>, <code>Revert "add cache"</code>. Lời nhắn của bạn nằm chung danh sách đó, và trộn thì đọc rất chỏi.</p>
<div class="callout ok">Phép thử dập tắt mọi tranh cãi: tiêu đề commit phải hoàn thành được câu <em>"Nếu áp dụng, commit này sẽ …"</em>. "Nếu áp dụng, commit này sẽ <strong>sửa rò rỉ</strong>" thì đọc trôi. "Nếu áp dụng, commit này sẽ <strong>đã sửa rò rỉ</strong>" thì không.</div>

<h3>Vì sao, chứ không phải cái gì</h3>
<p>Bản diff đã nói cái gì đổi rồi — hoàn hảo, từng dòng, mãi mãi. Lời nhắn phải nói thứ mà diff không nói được:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ "cập nhật auth.js"</span><span class="v">Không thêm gì cả. Tên file đã nằm sẵn trong diff.</span></div>
  <div class="kv"><span class="k">❌ "sửa lỗi"</span><span class="v">Lỗi nào? Trong điều kiện nào? Đây là lời nhắn lấy của một đồng nghiệp tương lai một giờ đồng hồ.</span></div>
  <div class="kv"><span class="k">❌ "sửa theo yêu cầu"</span><span class="v">Ai yêu cầu, và yêu cầu gì? Luồng review sẽ biến mất; commit thì không.</span></div>
  <div class="kv"><span class="k">✅ "fix: từ chối refresh token đã hết hạn ở /auth/refresh"</span><span class="v">Gọi tên triệu chứng, điểm cuối, và quyết định. Tìm kiếm được, và tự nó đã đủ.</span></div>
</div>
<p>Đáng viết phần thân bất cứ khi nào một trong các điều sau đúng, còn lại thì bỏ qua được:</p>
<ul>
  <li>Bạn chọn một hướng thay vì một hướng khác rõ ràng — hãy ghi lại vì sao, không thì sẽ có người "sửa" ngược lại.</li>
  <li>Thay đổi trông có vẻ sai khi tách khỏi ngữ cảnh (một con số thần kỳ, một lần chờ có chủ ý, một phép kiểm bị tắt).</li>
  <li>Nó sửa một lỗi — hãy mô tả triệu chứng, để người sau tìm theo triệu chứng thì ra đúng commit này.</li>
  <li>Nó kéo theo hệ quả ở nơi khác: một migration phải chạy, một biến môi trường phải đặt, một cache phải xoá.</li>
</ul>

<h3>Conventional Commits — cấu trúc mà máy đọc được</h3>
<p>Một quy ước được dùng rộng rãi, biến dòng tiêu đề thành dữ liệu phân tích được:</p>
<pre><code>&lt;loại&gt;(&lt;phạm vi tuỳ chọn&gt;): &lt;tiêu đề&gt;

feat(auth): thêm xoay vòng refresh token
fix(feed): hết 500 khi một bài không có tác giả
docs(readme): ghi lại cách dùng script deploy
refactor(api): tách phân trang ra một helper
test(auth): phủ đường token hết hạn
chore(deps): nâng prisma lên 6.2.0
perf(feed): gộp việc tra tác giả thành một truy vấn</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">feat / fix</span><span class="v">Hai loại quan trọng cho việc đánh phiên bản: <code>feat</code> nâng số minor, <code>fix</code> nâng số patch, theo semantic versioning (Chương 7).</span></div>
  <div class="kv"><span class="k">BREAKING CHANGE:</span><span class="v">Một dòng chân, hoặc dấu <code>!</code> sau loại (<code>feat!:</code>). Nâng số major và phải nằm đậm trong changelog.</span></div>
  <div class="kv"><span class="k">Phần thưởng</span><span class="v">Changelog tự sinh, bản phát hành tự đánh số, và <code>git log --grep "^fix"</code> trả lời "tháng này ta đã sửa những gì?" bằng một lệnh.</span></div>
</div>

<h3>Viết lời nhắn dài một cách dễ chịu</h3>
<p>Chạy <code>git commit</code> trơn sẽ mở trình soạn thảo kèm một mẫu. Hãy cho nó một mẫu tốt hơn — một danh sách kiểm mà bạn thấy mỗi lần:</p>
<pre><code><span class="tok-comment"># ~/.gitmessage.txt</span>
<span class="tok-comment"># &lt;loại&gt;(&lt;phạm vi&gt;): &lt;tiêu đề &lt;= 50 ký tự, thể mệnh lệnh&gt;</span>
<span class="tok-comment">#</span>
<span class="tok-comment"># Vì sao cần thay đổi này? Trước đó hành vi ra sao?</span>
<span class="tok-comment"># Ngắt dòng thân bài ở 72 ký tự.</span>
<span class="tok-comment">#</span>
<span class="tok-comment"># Closes #</span>

git config --global commit.template ~/.gitmessage.txt</code></pre>
<p>Dòng bắt đầu bằng <code>#</code> bị lược bỏ, nên cái mẫu thuần tuý là lời nhắc và không bao giờ lọt vào lịch sử.</p>

<h3>Đọc lại lịch sử của chính mình</h3>
<pre><code>git log --oneline -10</code></pre>
<div class="out">3f8a1c9 fix: tu choi refresh token da het han o /auth/refresh
9e2d4b7 feat(auth): them xoay vong refresh token
1c5f8a3 test(auth): phu duong token het han
7b3e9d1 refactor(api): tach phan trang ra mot helper</div>
<p>Đó là một lịch sử mà một năm sau bạn liếc là đọc được. So với phương án kia — <code>update</code>, <code>fix</code>, <code>fix again</code>, <code>asdf</code>, <code>final fix</code> — vốn tốn đúng bằng ấy công gõ mà chẳng đáng gì.</p>

<a class="link-card" href="https://www.conventionalcommits.org/vi/v1.0.0/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Conventional Commits 1.0.0 — bản đặc tả (có tiếng Việt)</span><span class="lc-sub">Ngắn, đủ, và là nền của hầu hết công cụ tự sinh changelog.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-commit#_discussion" target="_blank" rel="noopener">
  <span class="lc-ico">✍️</span>
  <span class="lc-body"><span class="lc-title">git-commit — mục "Discussion"</span><span class="lc-sub">Hướng dẫn của chính Git về tiêu đề/thân và vì sao dòng trống là bắt buộc.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>git commit -m "giải thích thật dài nhét hết vào một dòng vì mở trình soạn thảo phiền quá"</code>. Không có dòng trống thì không có thân — cả đoạn chữ trở thành tiêu đề, nên <code>git log --oneline</code> hết đọc nổi và GitHub cắt cụt nó trong danh sách PR. Nếu một lời nhắn cần hơn 50 ký tự thì nó cần một thân bài: dùng <code>git commit</code> không có <code>-m</code>, hoặc truyền <code>-m</code> hai lần (cái thứ hai thành thân).</div>
<p class="note-ct"><strong>Một thước đo cho việc viết bao nhiêu là đủ:</strong> hãy tưởng tượng người chạy <code>git blame</code> lên dòng này sau mười tám tháng, thấy commit của bạn, và phải quyết định dòng đó còn cần nữa không. Hãy viết lời nhắn trả lời cho <em>họ</em>. Thường thì đó là một dòng tiêu đề tốt; thỉnh thoảng là ba đoạn văn, và ba đoạn ấy chính là thứ cứu được một ngày làm việc.</p>
</div>
`,
    },

    /* ─────────────────────────── 1.5 ─────────────────────────── */
    {
      title: '1.5 — .gitignore, and what must never be committed|||1.5 — .gitignore, và thứ không bao giờ được commit',
      slug: 'git-1-5-gitignore',
      type: 'LESSON',
      description: 'Cú pháp .gitignore đầy đủ, ba tầng ignore, vì sao ignore không có tác dụng với file ĐÃ được theo dõi, cách gỡ một file đã lỡ commit, và danh sách bốn nhóm không bao giờ được vào kho mã.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Deciding what is not part of the project</h2>
<p class="lead">A repository should contain <em>sources</em> — the things a human wrote and from which everything else can be rebuilt. Everything else is noise at best and a security incident at worst. <code>.gitignore</code> is how you draw that line, and it is worth drawing before the first commit rather than after.</p>

<h3>The four categories that never belong in Git</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Secrets</span><span class="lz-v"><code>.env</code>, private keys, tokens, service-account JSON. The serious one — see the box below. Committing a secret means rotating it, not deleting it.</span></div>
  <div class="lz-layer"><span class="lz-k">Dependencies</span><span class="lz-v"><code>node_modules/</code>, <code>vendor/</code>, <code>.venv/</code>. Rebuildable from a lockfile, and enormous. Commit the <strong>lockfile</strong>; never the folder.</span></div>
  <div class="lz-layer"><span class="lz-k">Build output</span><span class="lz-v"><code>dist/</code>, <code>build/</code>, <code>.next/</code>, <code>target/</code>, <code>*.o</code>. Derived from the sources; committing it guarantees merge conflicts nobody can resolve meaningfully.</span></div>
  <div class="lz-layer"><span class="lz-k">Local and machine noise</span><span class="lz-v"><code>.DS_Store</code>, <code>Thumbs.db</code>, <code>*.log</code>, editor folders, coverage reports. Yours alone, useless to everyone else.</span></div>
</div>
<div class="callout danger">A committed secret is <strong>not</strong> fixed by deleting the line in a later commit. The old commit still contains it, it is in every clone, and on a public repository the bots that scrape GitHub for keys find it within minutes. The correct response is: <strong>rotate the credential immediately</strong>, then clean the history (Chapter 8.4). Rotate first — history cleaning takes minutes, and the key is live the whole time.</div>

<h3>The syntax, completely</h3>
<pre><code><span class="tok-comment"># A comment.</span>

node_modules/          <span class="tok-comment"># trailing slash = directories only, at any depth</span>
*.log                  <span class="tok-comment"># any .log file, at any depth</span>
/config.local.json     <span class="tok-comment"># leading slash = ONLY at the repository root</span>
build                  <span class="tok-comment"># a file OR directory named build, at any depth</span>

debug?.log             <span class="tok-comment"># ? = exactly one character: debug1.log, debugA.log</span>
report[0-9].pdf        <span class="tok-comment"># [] = one character from the set</span>
docs/**/draft.md       <span class="tok-comment"># ** = any number of directories in between</span>

!important.log         <span class="tok-comment"># ! = un-ignore (negate) an earlier pattern</span>
*.env                  <span class="tok-comment"># ignore every .env variant…</span>
!.env.example          <span class="tok-comment"># …except the committed template</span></code></pre>
<div class="callout warn">Negation has one hard limit that costs people an afternoon: <strong>you cannot un-ignore a file inside an ignored directory.</strong> If <code>build/</code> is ignored, <code>!build/keep.txt</code> does nothing, because Git never descends into <code>build/</code> to look. Ignore the contents instead — <code>build/*</code> then <code>!build/keep.txt</code>.</div>

<h3>The rule that trips everyone: ignore only affects untracked files</h3>
<p><code>.gitignore</code> is a filter on files Git is <em>not yet tracking</em>. Once a file has been committed, Git keeps tracking it forever, and adding it to <code>.gitignore</code> changes nothing:</p>
<pre><code><span class="tok-comment"># The mistake, played out:</span>
git add .env &amp;&amp; git commit -m <span class="tok-string">"wip"</span>       <span class="tok-comment"># oops</span>
<span class="tok-keyword">echo</span> <span class="tok-string">".env"</span> &gt;&gt; .gitignore                     <span class="tok-comment"># does NOT help</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"SECRET=xyz"</span> &gt;&gt; .env
git status</code></pre>
<div class="out">Changes not staged for commit:
        modified:   .env</div>
<p>Still tracked, still reported, still going into the next commit. The fix is to stop tracking it — while keeping the file on your disk:</p>
<pre><code>git rm --cached .env          <span class="tok-comment"># untrack, KEEP the local file</span>
git rm --cached -r node_modules/   <span class="tok-comment"># same, for a directory</span>
git commit -m <span class="tok-string">"chore: stop tracking .env, it is now ignored"</span></code></pre>
<div class="callout danger"><code>git rm --cached</code> untracks. <code>git rm</code> without the flag <strong>deletes the file from your disk as well</strong>. For a <code>.env</code> holding the only copy of your local database password, that difference is your evening.</div>
<p>And note what this does <em>not</em> do: the secret is still in the earlier commit, and still in everyone's clone. Untracking stops it going forward; Chapter 8.4 removes it from the past.</p>

<h3>Three levels of ignore, for three different purposes</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">.gitignore (committed)</span><span class="v">Rules that apply to <em>everyone</em> on the project: build output, dependencies, secrets. Lives in the repository and is itself committed.</span></div>
  <div class="kv"><span class="k">.git/info/exclude</span><span class="v">Your personal rules for <em>this</em> repository, not shared. Same syntax, never committed. Good for a scratch folder only you have.</span></div>
  <div class="kv"><span class="k">core.excludesFile (global)</span><span class="v">Rules for <em>you on every project</em>: <code>.DS_Store</code>, <code>.idea/</code>, <code>*.swp</code>. Your editor's droppings are your problem, not the project's.</span></div>
</div>
<pre><code><span class="tok-comment"># Set up the global one once — and stop asking teams to ignore your editor.</span>
git config --global core.excludesFile ~/.gitignore_global
printf <span class="tok-string">'.DS_Store\\n.idea/\\n*.swp\\n.vscode/\\n'</span> &gt; ~/.gitignore_global</code></pre>

<h3>Debugging "why is this file (not) ignored?"</h3>
<p>With several files of patterns, work it out instead of guessing:</p>
<pre><code>git check-ignore -v dist/app.js</code></pre>
<div class="out">.gitignore:7:dist/    dist/app.js</div>
<p>File, line number, and the exact pattern that matched. No output at all means the file is <em>not</em> ignored. To see everything Git is currently ignoring:</p>
<pre><code>git status --ignored --short</code></pre>

<h3>A realistic starting point for a Node + Next.js project</h3>
<pre><code><span class="tok-comment"># dependencies</span>
node_modules/
.pnp
.pnp.js

<span class="tok-comment"># build output</span>
dist/
build/
.next/
out/
*.tsbuildinfo

<span class="tok-comment"># environment — the template IS committed, the real values never are</span>
.env
.env.*
!.env.example

<span class="tok-comment"># logs &amp; local databases</span>
*.log
npm-debug.log*
*.sqlite
*.sqlite3

<span class="tok-comment"># test &amp; coverage</span>
coverage/
.nyc_output/

<span class="tok-comment"># OS &amp; editor (better in your GLOBAL ignore, but harmless here)</span>
.DS_Store
Thumbs.db
.idea/
.vscode/*
!.vscode/extensions.json</code></pre>
<div class="callout ok">Note the last two lines and the <code>!.env.example</code>. Committing an <code>.env.example</code> with every key present but every value blank is one of the highest-value habits in this lesson: it documents what the project needs to run, and a new developer copies it to <code>.env</code> and fills it in. Ignoring the whole <code>.vscode/</code> except <code>extensions.json</code> does the same for recommended extensions.</div>

<a class="link-card" href="https://github.com/github/gitignore" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">github/gitignore — official templates per language</span><span class="lc-sub">Node, Python, Java, Unity, Go… Start from the template for your stack instead of inventing one.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/gitignore" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">gitignore — the pattern format, precisely</span><span class="lc-sub">Precedence between the three levels, and the exact negation rules.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> ignoring your lockfile (<code>package-lock.json</code>, <code>yarn.lock</code>, <code>poetry.lock</code>). It looks like generated noise; it is not. The lockfile is what makes an install reproducible — without it, CI and production resolve different dependency versions than your laptop did, and you get the "works on my machine" bug that takes three days to find. Ignore <code>node_modules/</code>, commit the lockfile.</div>
<p class="note-ct"><strong>Do this at the start of every project:</strong> create <code>.gitignore</code> and <code>.env.example</code> <em>before</em> the first <code>git add</code>. It costs one minute at a moment when it is free, and it removes any chance of the <code>.env</code>-in-the-first-commit problem — the single most common way real credentials end up on GitHub.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Quyết định thứ gì KHÔNG thuộc về dự án</h2>
<p class="lead">Một kho mã nên chứa <em>mã nguồn</em> — những thứ do con người viết và từ đó dựng lại được mọi thứ khác. Phần còn lại nhẹ thì là tiếng ồn, nặng thì là một sự cố bảo mật. <code>.gitignore</code> là cách bạn vạch ranh giới đó, và nên vạch trước commit đầu tiên thay vì sau.</p>

<h3>Bốn nhóm không bao giờ thuộc về Git</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Bí mật</span><span class="lz-v"><code>.env</code>, khoá riêng tư, token, JSON tài khoản dịch vụ. Nhóm nghiêm trọng — xem hộp bên dưới. Commit một bí mật nghĩa là phải XOAY khoá, không phải xoá dòng.</span></div>
  <div class="lz-layer"><span class="lz-k">Thư viện phụ thuộc</span><span class="lz-v"><code>node_modules/</code>, <code>vendor/</code>, <code>.venv/</code>. Dựng lại được từ lockfile, và khổng lồ. Hãy commit <strong>lockfile</strong>; đừng bao giờ commit thư mục.</span></div>
  <div class="lz-layer"><span class="lz-k">Sản phẩm build</span><span class="lz-v"><code>dist/</code>, <code>build/</code>, <code>.next/</code>, <code>target/</code>, <code>*.o</code>. Suy ra từ mã nguồn; commit chúng là bảo đảm có xung đột hợp nhất mà không ai giải quyết một cách có nghĩa được.</span></div>
  <div class="lz-layer"><span class="lz-k">Rác của máy và của bạn</span><span class="lz-v"><code>.DS_Store</code>, <code>Thumbs.db</code>, <code>*.log</code>, thư mục của trình soạn thảo, báo cáo độ phủ. Chỉ của riêng bạn, vô dụng với mọi người khác.</span></div>
</div>
<div class="callout danger">Một bí mật đã commit <strong>KHÔNG</strong> được sửa bằng cách xoá dòng đó ở một commit sau. Commit cũ vẫn chứa nó, nó nằm trong mọi bản clone, và trên kho công khai thì các bot quét GitHub tìm khoá sẽ thấy trong vài phút. Phản ứng đúng là: <strong>xoay (rotate) chứng chỉ ngay lập tức</strong>, rồi mới dọn lịch sử (Chương 8.4). Xoay trước — dọn lịch sử mất vài phút, và cái khoá thì sống suốt khoảng thời gian đó.</div>

<h3>Cú pháp, đầy đủ</h3>
<pre><code><span class="tok-comment"># Một dòng chú thích.</span>

node_modules/          <span class="tok-comment"># gạch chéo cuối = chỉ thư mục, ở mọi độ sâu</span>
*.log                  <span class="tok-comment"># mọi file .log, ở mọi độ sâu</span>
/config.local.json     <span class="tok-comment"># gạch chéo đầu = CHỈ ở gốc kho mã</span>
build                  <span class="tok-comment"># một file HOẶC thư mục tên build, ở mọi độ sâu</span>

debug?.log             <span class="tok-comment"># ? = đúng một ký tự: debug1.log, debugA.log</span>
report[0-9].pdf        <span class="tok-comment"># [] = một ký tự trong tập</span>
docs/**/draft.md       <span class="tok-comment"># ** = bao nhiêu cấp thư mục ở giữa cũng được</span>

!important.log         <span class="tok-comment"># ! = bỏ ignore (phủ định) một mẫu phía trên</span>
*.env                  <span class="tok-comment"># bỏ qua mọi biến thể .env…</span>
!.env.example          <span class="tok-comment"># …trừ file mẫu được commit</span></code></pre>
<div class="callout warn">Phủ định có một giới hạn cứng làm người ta mất cả buổi chiều: <strong>bạn KHÔNG bỏ-ignore được một file nằm trong thư mục đã bị ignore.</strong> Nếu <code>build/</code> bị ignore thì <code>!build/keep.txt</code> vô tác dụng, vì Git không bao giờ đi xuống <code>build/</code> để nhìn. Hãy ignore phần nội dung thay vì thư mục — <code>build/*</code> rồi <code>!build/keep.txt</code>.</div>

<h3>Luật làm ai cũng vấp: ignore chỉ tác dụng với file CHƯA theo dõi</h3>
<p><code>.gitignore</code> là bộ lọc trên những file Git <em>chưa theo dõi</em>. Khi một file đã được commit, Git theo dõi nó mãi mãi, và thêm nó vào <code>.gitignore</code> chẳng thay đổi gì:</p>
<pre><code><span class="tok-comment"># Sai lầm, diễn ra từng bước:</span>
git add .env &amp;&amp; git commit -m <span class="tok-string">"wip"</span>       <span class="tok-comment"># lỡ tay</span>
<span class="tok-keyword">echo</span> <span class="tok-string">".env"</span> &gt;&gt; .gitignore                     <span class="tok-comment"># KHÔNG giúp được gì</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"SECRET=xyz"</span> &gt;&gt; .env
git status</code></pre>
<div class="out">Changes not staged for commit:
        modified:   .env</div>
<p>Vẫn được theo dõi, vẫn bị báo cáo, vẫn sẽ vào commit kế tiếp. Cách sửa là ngừng theo dõi nó — trong khi vẫn giữ file trên đĩa:</p>
<pre><code>git rm --cached .env          <span class="tok-comment"># bỏ theo dõi, GIỮ file cục bộ</span>
git rm --cached -r node_modules/   <span class="tok-comment"># tương tự, cho một thư mục</span>
git commit -m <span class="tok-string">"chore: ngừng theo dõi .env, nay đã ignore"</span></code></pre>
<div class="callout danger"><code>git rm --cached</code> bỏ theo dõi. <code>git rm</code> không có cờ thì <strong>xoá luôn file khỏi đĩa của bạn</strong>. Với một <code>.env</code> giữ bản sao duy nhất mật khẩu database cục bộ, khác biệt đó là cả buổi tối của bạn.</div>
<p>Và hãy để ý điều nó <em>không</em> làm: bí mật vẫn nằm trong commit trước đó, và vẫn nằm trong bản clone của mọi người. Bỏ theo dõi chỉ chặn nó đi tiếp; Chương 8.4 mới gỡ nó khỏi quá khứ.</p>

<h3>Ba tầng ignore, cho ba mục đích khác nhau</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">.gitignore (được commit)</span><span class="v">Luật áp cho <em>mọi người</em> trong dự án: sản phẩm build, thư viện, bí mật. Nằm trong kho mã và bản thân nó cũng được commit.</span></div>
  <div class="kv"><span class="k">.git/info/exclude</span><span class="v">Luật riêng của bạn cho <em>kho này</em>, không chia sẻ. Cùng cú pháp, không bao giờ được commit. Hợp cho một thư mục nháp chỉ mình bạn có.</span></div>
  <div class="kv"><span class="k">core.excludesFile (toàn cục)</span><span class="v">Luật cho <em>bạn ở mọi dự án</em>: <code>.DS_Store</code>, <code>.idea/</code>, <code>*.swp</code>. Rác của trình soạn thảo là vấn đề của bạn, không phải của dự án.</span></div>
</div>
<pre><code><span class="tok-comment"># Đặt cái toàn cục một lần — và thôi bắt cả nhóm phải ignore trình soạn thảo của bạn.</span>
git config --global core.excludesFile ~/.gitignore_global
printf <span class="tok-string">'.DS_Store\\n.idea/\\n*.swp\\n.vscode/\\n'</span> &gt; ~/.gitignore_global</code></pre>

<h3>Gỡ rối "vì sao file này (không) bị ignore?"</h3>
<p>Khi đã có vài file mẫu, hãy tra ra thay vì đoán:</p>
<pre><code>git check-ignore -v dist/app.js</code></pre>
<div class="out">.gitignore:7:dist/    dist/app.js</div>
<p>File, số dòng, và chính xác mẫu nào đã khớp. Không có output nào nghĩa là file <em>không</em> bị ignore. Muốn xem mọi thứ Git đang bỏ qua:</p>
<pre><code>git status --ignored --short</code></pre>

<h3>Một điểm khởi đầu thực tế cho dự án Node + Next.js</h3>
<pre><code><span class="tok-comment"># thư viện phụ thuộc</span>
node_modules/
.pnp
.pnp.js

<span class="tok-comment"># sản phẩm build</span>
dist/
build/
.next/
out/
*.tsbuildinfo

<span class="tok-comment"># môi trường — file mẫu ĐƯỢC commit, giá trị thật thì không bao giờ</span>
.env
.env.*
!.env.example

<span class="tok-comment"># log &amp; database cục bộ</span>
*.log
npm-debug.log*
*.sqlite
*.sqlite3

<span class="tok-comment"># kiểm thử &amp; độ phủ</span>
coverage/
.nyc_output/

<span class="tok-comment"># hệ điều hành &amp; trình soạn thảo (nên để ở ignore TOÀN CỤC, nhưng ở đây vô hại)</span>
.DS_Store
Thumbs.db
.idea/
.vscode/*
!.vscode/extensions.json</code></pre>
<div class="callout ok">Để ý hai dòng cuối và dòng <code>!.env.example</code>. Commit một <code>.env.example</code> có đủ mọi khoá nhưng để trống mọi giá trị là một trong những thói quen giá trị nhất bài này: nó ghi lại dự án cần gì để chạy, và người mới chỉ việc chép sang <code>.env</code> rồi điền. Ignore cả <code>.vscode/</code> trừ <code>extensions.json</code> làm đúng việc đó cho danh sách tiện ích khuyến nghị.</div>

<a class="link-card" href="https://github.com/github/gitignore" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">github/gitignore — mẫu chính thức theo từng ngôn ngữ</span><span class="lc-sub">Node, Python, Java, Unity, Go… Bắt đầu từ mẫu của stack bạn thay vì tự nghĩ ra.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/gitignore" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">gitignore — định dạng mẫu, chính xác</span><span class="lc-sub">Thứ tự ưu tiên giữa ba tầng, và luật phủ định chính xác.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> ignore luôn file lock (<code>package-lock.json</code>, <code>yarn.lock</code>, <code>poetry.lock</code>). Nó trông như rác sinh tự động; không phải vậy. Lockfile là thứ làm cho việc cài đặt tái lập được — thiếu nó, CI và production phân giải ra phiên bản thư viện khác với máy bạn, và bạn nhận lỗi "máy tôi chạy được mà" tốn ba ngày để tìm. Hãy ignore <code>node_modules/</code>, và commit lockfile.</div>
<p class="note-ct"><strong>Hãy làm việc này ở đầu mọi dự án:</strong> tạo <code>.gitignore</code> và <code>.env.example</code> <em>trước</em> lần <code>git add</code> đầu tiên. Nó tốn một phút vào đúng lúc còn miễn phí, và loại bỏ mọi khả năng gặp vấn đề <code>.env</code>-nằm-trong-commit-đầu — con đường phổ biến nhất đưa chứng chỉ thật lên GitHub.</p>
</div>
`,
    },

    /* ─────────────────────────── 1.6 Quiz ─────────────────────────── */
    {
      title: '1.6 — Chapter 1 quiz|||1.6 — Kiểm tra Chương 1',
      slug: 'git-1-6-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về ba cái cây, commit là ảnh chụp, mã băm và commit cha, ba dạng của git diff, và luật ignore chỉ tác dụng với file chưa theo dõi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the model. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: which trees <code>git diff --staged</code> compares (1.3), and why <code>.gitignore</code> does nothing for a file that is already tracked (1.5).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về mô hình. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: <code>git diff --staged</code> so hai cây nào (1.3), và vì sao <code>.gitignore</code> vô tác dụng với file đã được theo dõi (1.5).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'git status shows the same file under both "Changes to be committed" and "Changes not staged for commit". What does that mean?|||git status hiện cùng một file ở cả "Changes to be committed" lẫn "Changes not staged for commit". Điều đó nghĩa là gì?',
            options: [
              'The repository is corrupted|||Kho mã bị hỏng',
              'You staged the file, then edited it again — the index and the working directory now hold different versions|||Bạn đã staging file đó rồi sửa tiếp — index và thư mục làm việc giờ mang hai phiên bản khác nhau',
              'The file has a merge conflict|||File đó đang có xung đột hợp nhất',
              'Git is showing it twice by mistake|||Git hiện nhầm hai lần',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does a commit object actually store?|||Một đối tượng commit thật sự lưu cái gì?',
            options: [
              'The list of lines that changed since the previous commit|||Danh sách các dòng đã đổi so với commit trước',
              'A pointer to a full snapshot (tree), its parent commit(s), author/committer and the message|||Con trỏ tới một ảnh chụp đầy đủ (tree), (các) commit cha, tác giả/người commit và lời nhắn',
              'A compressed copy of only the files you ran git add on|||Bản nén chỉ gồm những file bạn đã chạy git add',
              'The diff plus a timestamp|||Bản diff cộng dấu thời gian',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does changing the message of an old commit also change the hash of every commit after it?|||Vì sao sửa lời nhắn của một commit cũ lại làm đổi mã băm của MỌI commit sau nó?',
            options: [
              'Git renumbers commits sequentially|||Git đánh lại số thứ tự các commit',
              'Because each commit hash is computed over its content INCLUDING its parent hash, so the chain re-hashes|||Vì mã băm mỗi commit được tính trên nội dung của nó BAO GỒM mã băm của cha, nên cả sợi xích phải băm lại',
              'It does not — only that one commit changes|||Không có chuyện đó — chỉ commit đó đổi thôi',
              'Because Git stores diffs, and every later diff must be recomputed|||Vì Git lưu bản khác biệt, nên mọi diff sau đó phải tính lại',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which command shows exactly what your NEXT commit will contain?|||Lệnh nào cho thấy chính xác commit KẾ TIẾP của bạn sẽ chứa những gì?',
            options: [
              'git diff',
              'git diff HEAD',
              'git diff --staged',
              'git status',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'You created a new file, then ran git commit -am "add feature". Is the new file in the commit?|||Bạn tạo một file mới, rồi chạy git commit -am "add feature". File mới có nằm trong commit không?',
            options: [
              'Yes — -a stages everything|||Có — -a đưa mọi thứ vào staging',
              'No — -a only stages modifications to files Git already tracks, and a new file is untracked|||Không — -a chỉ staging sửa đổi của các file Git đã theo dõi, mà file mới thì chưa được theo dõi',
              'Only if the file is smaller than 1 MB|||Chỉ khi file nhỏ hơn 1 MB',
              'Yes, but only its name, not its content|||Có, nhưng chỉ tên file chứ không có nội dung',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'HEAD~2 and HEAD^2 — what is the difference?|||HEAD~2 và HEAD^2 — khác nhau chỗ nào?',
            options: [
              'They are two spellings of the same thing|||Chúng là hai cách viết của cùng một thứ',
              '~2 goes back two commits following the first parent; ^2 selects the SECOND parent, which only exists on a merge commit|||~2 lùi hai commit theo cha thứ nhất; ^2 chọn cha THỨ HAI, thứ chỉ tồn tại trên commit hợp nhất',
              '~2 is for branches, ^2 is for tags|||~2 dùng cho nhánh, ^2 dùng cho tag',
              '^2 goes back two commits; ~2 goes forward two|||^2 lùi hai commit; ~2 tiến hai commit',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You committed .env by mistake. You add ".env" to .gitignore. What happens?|||Bạn lỡ commit .env. Bạn thêm ".env" vào .gitignore. Chuyện gì xảy ra?',
            options: [
              'The file is removed from history and the secret is safe|||File bị gỡ khỏi lịch sử và bí mật được an toàn',
              'Nothing changes — .gitignore only affects UNTRACKED files; you need git rm --cached, and the secret is still in the old commit so it must be rotated|||Không gì thay đổi — .gitignore chỉ tác dụng với file CHƯA theo dõi; bạn cần git rm --cached, và bí mật vẫn nằm trong commit cũ nên phải xoay khoá',
              'Git deletes .env from your disk automatically|||Git tự xoá .env khỏi đĩa của bạn',
              'The next commit will exclude it and the previous commit is rewritten|||Commit kế tiếp sẽ loại nó ra và commit trước được viết lại',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In .gitignore, "build/" is ignored. Does "!build/keep.txt" un-ignore that one file?|||Trong .gitignore, "build/" bị ignore. Dòng "!build/keep.txt" có bỏ-ignore được đúng file đó không?',
            options: [
              'Yes, negation always wins|||Có, phủ định luôn thắng',
              'No — Git never descends into an ignored directory, so you must ignore build/* instead and then negate|||Không — Git không bao giờ đi xuống một thư mục đã ignore, nên phải ignore build/* rồi mới phủ định',
              'Yes, but only if the file is already tracked|||Có, nhưng chỉ khi file đó đã được theo dõi',
              'Only in the global ignore file|||Chỉ trong file ignore toàn cục',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
