/**
 * Git & GitHub — Chương 9: Bên dưới nắp capo — kho đối tượng.
 * Tham quan .git/ · bốn loại đối tượng (blob/tree/commit/tag) dựng bằng tay ·
 * ref, HEAD, packed-refs, file index · packfile, gc, vì sao clone lại nhỏ · quiz.
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 9 — Under the hood: the object database|||Chương 9 — Bên dưới nắp capo: kho đối tượng',
  description: 'Mở .git/ ra và đọc bằng chính mắt bạn. Bốn loại đối tượng của Git, cách dựng một commit bằng tay mà không dùng git commit, ref và index thật ra là gì, và vì sao một kho mã mười năm lịch sử lại clone về chỉ vài chục megabyte. Học xong chương này mọi lệnh ở các chương trước sẽ hết bí ẩn.',
  lessons: [
    /* ─────────────────────────── 9.0 ─────────────────────────── */
    {
      title: '9.0 — Chapter 9 slides: the object database in pictures|||9.0 — Slide Chương 9: kho đối tượng bằng hình',
      slug: 'git-9-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 18 slide của Chương 9: cây thư mục .git, HEAD và nhánh là file chữ, đồ thị commit → tree → blob, hai commit dùng chung blob, commit dựng bằng tay, tag có chú thích, packfile và delta, gc với reflog — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Slides</span>
<h2>The whole chapter in 18 slides</h2>
<p class="lead">Git's internals are easiest to believe as pictures: a folder tree, a chain of one-line text files from HEAD to a commit, and a graph in which a commit points to a tree, the tree to blobs and sub-trees — and two commits quietly share every blob that did not change. Skim these before the lessons, then use them as a revision sheet after the quiz.</p>
<p>Every terminal on these slides is real output (git 2.51) from three small test repositories, so the hashes agree from slide to slide: the blob <code>5c661fc</code> that holds <code>README.md</code> on slide 7 is the same blob both commits share on slide 8, and the same hash <code>printf … | shasum</code> reproduces by hand on slide 11. The slides are in Vietnamese; the diagrams read the same in any language. The last two slides are a cheat sheet and a 40-minute practice session in which you build a commit with plumbing commands and watch <code>git gc</code> pack and prune objects.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Slide</span>
<h2>Cả chương trong 18 slide</h2>
<p class="lead">Ruột gan của Git dễ tin nhất khi nhìn bằng hình: một cây thư mục, một chuỗi file chữ một dòng đi từ HEAD tới commit, và một đồ thị trong đó commit trỏ tới tree, tree trỏ tới blob và tree con — còn hai commit lặng lẽ dùng chung mọi blob không đổi. Lướt bộ này trước khi vào bài, rồi dùng lại làm tờ ôn tập sau bài kiểm tra.</p>
<p>Mọi terminal trên slide là output thật (git 2.51) từ ba kho thử nhỏ, nên mã băm khớp nhau từ slide này sang slide khác: blob <code>5c661fc</code> giữ <code>README.md</code> ở slide 7 chính là blob hai commit dùng chung ở slide 8, và cũng là mã băm mà <code>printf … | shasum</code> tự tính lại bằng tay ở slide 11. Hai slide cuối là bảng tra nhanh và một buổi thực hành 40 phút — trong đó bạn tự dựng một commit bằng lệnh tầng thấp và nhìn <code>git gc</code> gói rồi tỉa bỏ đối tượng.</p>
</div>
${gallery('git-09', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Tham quan thư mục .git'], [4, 'HEAD và nhánh là file chữ một dòng'],
  [5, 'objects/: mỗi đối tượng rời là một file'], [6, 'Bốn loại đối tượng'], [7, 'Một commit mở bung ra: commit → tree → blob'],
  [8, 'Hai commit dùng chung blob'], [9, 'Lần theo từng tầng bằng cat-file -p'], [10, 'index là một file thật'],
  [11, 'Mã băm = SHA-1 của header + nội dung'], [12, 'Dựng commit bằng năm lệnh tầng thấp'], [13, 'Tag có chú thích là một đối tượng'],
  [14, 'Đối tượng rời → packfile'], [15, 'Delta trong packfile'], [16, 'gc --prune=now và reflog'], [17, 'Bảng tra nhanh'], [18, 'Thực hành chương 9'],
])}
`,
    },

    /* ─────────────────────────── 9.1 ─────────────────────────── */
    {
      title: '9.1 — A tour of the .git directory|||9.1 — Tham quan thư mục .git',
      slug: 'git-9-1-thu-muc-git',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Mở .git/ ra xem từng thứ trong đó là gì: objects, refs, HEAD, index, config, hooks, logs — và mỗi thứ ứng với khái niệm nào bạn đã học ở tám chương trước.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Everything Git knows is in one folder</h2>
<p class="lead">Eight chapters of commands, and all of it reads and writes a single directory. Open it once and the abstractions stop being abstract: branches become files, commits become files, and "Git lost my work" becomes a claim you can check.</p>

<pre><code>cd ~/git-lab
ls -F .git/</code></pre>
<div class="out">HEAD          config        hooks/        index         logs/
COMMIT_EDITMSG description   info/         objects/      refs/</div>

<h3>The two that matter</h3>
${slide('git-09', 3, 'Tham quan thư mục .git — thứ gì nằm ở đâu')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">objects/</span><span class="lz-v">The content-addressed database. Every version of every file, every directory listing, every commit you have ever made. This is the repository.</span></div>
  <div class="lz-layer"><span class="lz-k">refs/</span><span class="lz-v">Human-readable names pointing into it: branches under <code>refs/heads/</code>, tags under <code>refs/tags/</code>, remote-tracking under <code>refs/remotes/</code>.</span></div>
</div>
<p>Objects plus refs <em>is</em> Git. Everything else in that listing is convenience, configuration or cache.</p>

<h3>HEAD — where you are</h3>
${slide('git-09', 4, 'HEAD và nhánh chỉ là file chữ một dòng')}
<pre><code>cat .git/HEAD</code></pre>
<div class="out">ref: refs/heads/main</div>
<p>One line. It names the branch you are on (3.1). During a detached HEAD it holds a raw hash instead, which is the entire difference between the two states.</p>

<h3>refs/ — the branches</h3>
<pre><code>find .git/refs -type f | head
cat .git/refs/heads/main</code></pre>
<div class="out">.git/refs/heads/main
.git/refs/heads/feature/login
.git/refs/tags/v1.5.0
.git/refs/remotes/origin/main

3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d</div>
<p>Each branch is a 41-byte file. Note that <code>feature/login</code> created a real subdirectory — which is why you cannot have both a branch <code>feature</code> and a branch <code>feature/login</code> (3.1): one would have to be a file and a directory at once.</p>
<pre><code>cat .git/packed-refs | head -3</code></pre>
<div class="out"># pack-refs with: peeled fully-peeled sorted
3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d refs/heads/main
9e2d4b70c1a3f5e7b9d0c2a4f6e8b0d2c4a6f8e0 refs/tags/v1.5.0</div>
<div class="callout ok">A repository with thousands of refs would mean thousands of tiny files, so Git periodically packs them into <code>packed-refs</code>. If <code>cat .git/refs/heads/main</code> says "No such file", the ref is not missing — it is in <code>packed-refs</code>. Use <code>git rev-parse main</code>, which checks both.</div>

<h3>objects/ — the database</h3>
${slide('git-09', 5, 'objects/: mỗi đối tượng rời là một file')}
<pre><code>ls .git/objects/ | head
ls .git/objects/3f/</code></pre>
<div class="out">3f  7b  9e  a7  info  pack

8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d</div>
<p>Each object's 40-character hash is split: the first two characters become a directory name, the remaining 38 the file name. That split exists purely to stop one directory holding a million entries, which most filesystems handle badly.</p>
<pre><code>cat .git/objects/3f/8a1c9d2e5b…       <span class="tok-comment"># binary — zlib-compressed</span>
git cat-file -t 3f8a1c9               <span class="tok-comment"># type</span>
git cat-file -p 3f8a1c9               <span class="tok-comment"># pretty-print the content</span>
git cat-file -s 3f8a1c9               <span class="tok-comment"># size in bytes</span></code></pre>
<div class="out">commit</div>
<p>The files are zlib-compressed, so <code>cat</code> shows binary. <code>git cat-file</code> is the tool for reading them, and 9.2 uses it on all four object types.</p>

<h3>index — the staging area, as a real file</h3>
${slide('git-09', 10, 'index — vùng staging là một file thật')}
<pre><code>ls -la .git/index
git ls-files --stage | head -3</code></pre>
<div class="out">-rw-r--r-- 1 an an 8394 Aug 21 14:20 .git/index

100644 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d 0	src/app.ts
100644 9e2d4b70c1a3f5e7b9d0c2a4f6e8b0d2c4a6f8e0 0	src/auth.ts
100755 a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e	0	deploy.sh</div>
<div class="kv-grid">
  <div class="kv"><span class="k">100644 / 100755</span><span class="v">File mode. Git records only "regular file" and "executable" — it deliberately does not track full Unix permissions.</span></div>
  <div class="kv"><span class="k">The hash</span><span class="v">The blob holding that file's staged content.</span></div>
  <div class="kv"><span class="k">0</span><span class="v">Merge stage. During a conflict this becomes 1 (base), 2 (ours), 3 (theirs) — which is literally how a conflict is stored (3.3).</span></div>
</div>
<div class="callout ok">This is the "middle tree" from 1.1, made concrete: one binary file listing every tracked path with the hash of its staged content. <code>git add</code> writes a blob and updates a row here; <code>git commit</code> turns the whole table into a tree object.</div>

<h3>The rest</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">config</span><span class="v">Per-repository configuration — the <code>--local</code> level from 0.3, including your remotes.</span></div>
  <div class="kv"><span class="k">logs/</span><span class="v">The reflog (4.4). <code>logs/HEAD</code> plus one file per branch. Never pushed, which is why nobody else can recover your mistakes.</span></div>
  <div class="kv"><span class="k">hooks/</span><span class="v">Scripts Git runs at defined moments, all <code>.sample</code> and inert until renamed (Chapter 12).</span></div>
  <div class="kv"><span class="k">info/exclude</span><span class="v">Personal ignore rules for this repository, not committed (1.5).</span></div>
  <div class="kv"><span class="k">COMMIT_EDITMSG</span><span class="v">A scratch file holding the message you last typed in the editor. Not history — just the buffer.</span></div>
  <div class="kv"><span class="k">ORIG_HEAD</span><span class="v">Where HEAD was before the last dangerous operation. <code>git reset --hard ORIG_HEAD</code> undoes a bad merge or rebase.</span></div>
</div>

<h3>Proving the model</h3>
<pre><code><span class="tok-comment"># A branch really is just a file. Create one with echo:</span>
<span class="tok-keyword">echo</span> \$(git rev-parse HEAD) &gt; .git/refs/heads/handmade
git branch | grep handmade</code></pre>
<div class="out">  handmade</div>
<p>Git did not need to be told. It reads that directory, so writing a file there creates a branch. (Do this once for the understanding, then use <code>git branch</code> — the porcelain also updates the reflog and validates the hash.)</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In your <code>thu-git</code> playground, predict what <code>cat .git/HEAD</code> prints, then run it. Now <code>git switch --detach HEAD~1</code>, run <code>cat .git/HEAD</code> again and compare, then go back with <code>git switch main</code>.</li><li>Run <code>git count-objects -v</code> and add <code>count</code> + <code>in-pack</code>: that is how many objects your repository holds.</li><li>Before committing, predict how many new objects a commit that edits ONE file at the root of the project will create. Append a line to <code>README.md</code>, commit it, and count again.</li><li>Compare <code>cat .git/refs/heads/main</code> with <code>git rev-parse main</code>. If the file does not exist, look for the branch in <code>.git/packed-refs</code>.</li><li>Create a branch with nothing but <code>echo</code> (the "Proving the model" block above), check <code>git branch</code>, then delete it properly with <code>git branch -d handmade</code>.</li></ol>
<pre><code class="language-bash">git count-objects -v | head -1
count: 11
<span class="tok-keyword">echo</span> <span class="tok-string">"Them mot dong."</span> &gt;&gt; README.md &amp;&amp; git commit -qam <span class="tok-string">"docs: them mot dong vao README"</span>
git count-objects -v | head -1
count: 14                 <span class="tok-comment"># real output from our test repo: +3</span>
git switch --detach HEAD~1 &amp;&amp; cat .git/HEAD
HEAD is now at 6a952eb feat: doi loi chao
6a952eb80d5ac9cd0ab8757ac9b6dcb382f7fa5b   <span class="tok-comment"># a raw hash, not "ref: …"</span></code></pre>
<p><strong>Done when:</strong> the total went up by exactly 3 and you can name all three (the new blob of <code>README.md</code>, a new root tree, the commit); during the detach <code>.git/HEAD</code> held a bare hash; and <code>git rev-parse main</code> printed the same hash as the branch file (or its line in <code>packed-refs</code>).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">.git directory</span><span class="v">The repository itself. Your project folder is only a checkout of one snapshot from it.</span></div>
  <div class="kv"><span class="k">Object database</span><span class="v"><code>.git/objects/</code> — every file version, directory listing, commit and annotated tag, each stored under the hash of its own bytes.</span></div>
  <div class="kv"><span class="k">Ref</span><span class="v">A human-readable name (branch, tag, remote-tracking branch) that is just a file holding a hash.</span></div>
  <div class="kv"><span class="k">HEAD</span><span class="v">A one-line file: normally <code>ref: refs/heads/&lt;branch&gt;</code>, or a bare hash when detached.</span></div>
  <div class="kv"><span class="k">packed-refs</span><span class="v">One file collecting many refs, written by <code>git gc</code>. The reason a branch file can "disappear" without the branch being lost.</span></div>
  <div class="kv"><span class="k">Loose object</span><span class="v">One zlib-compressed file per object, at <code>objects/&lt;first 2 chars&gt;/&lt;other 38&gt;</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>objects/</code> plus <code>refs/</code> is the whole repository; everything else is configuration, cache or convenience.</li><li>A branch is a 41-byte text file holding a commit hash; <code>HEAD</code> is a one-line file naming that branch.</li><li>Detached HEAD simply means <code>.git/HEAD</code> holds a hash instead of a branch name.</li><li>The index is a real binary file listing every tracked path with the hash of its staged content.</li><li>Read <code>.git/</code> freely; write it through commands such as <code>git rev-parse</code>, <code>git branch</code> and <code>git update-ref</code>.</li></ul>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 10.1 — Plumbing and Porcelain</span><span class="lc-sub">The distinction between the commands people use and the ones they are built from.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/gitrepository-layout" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">gitrepository-layout — every file in .git, documented</span><span class="lc-sub">The reference for anything in that directory this lesson did not cover.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> editing files in <code>.git/</code> to fix a problem. It works often enough to be tempting and it bypasses every check Git makes — a hand-written ref with a typo, a manually deleted object, an edited index — and the resulting corruption surfaces hours later somewhere unrelated. Read <code>.git/</code> freely; write it through commands.</div>
<p class="note-ct"><strong>What this chapter buys you:</strong> after this tour, "the repository is broken" becomes a checkable claim. Is <code>HEAD</code> pointing at a ref that exists? Does that ref hold a hash that <code>git cat-file -t</code> recognises? Chapter 13 leans on exactly this to recover situations that look hopeless.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Mọi thứ Git biết đều nằm trong một thư mục</h2>
<p class="lead">Tám chương lệnh, và tất cả chỉ đọc và ghi vào một thư mục duy nhất. Mở nó ra một lần thì các trừu tượng hết trừu tượng: nhánh thành file, commit thành file, và câu "Git làm mất việc của tôi" thành một khẳng định kiểm chứng được.</p>

<pre><code>cd ~/git-lab
ls -F .git/</code></pre>
<div class="out">HEAD          config        hooks/        index         logs/
COMMIT_EDITMSG description   info/         objects/      refs/</div>

<h3>Hai thứ thật sự quan trọng</h3>
${slide('git-09', 3, 'Tham quan thư mục .git — thứ gì nằm ở đâu')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">objects/</span><span class="lz-v">Cơ sở dữ liệu định danh theo nội dung. Mọi phiên bản của mọi file, mọi danh sách thư mục, mọi commit bạn từng tạo. ĐÂY chính là kho mã.</span></div>
  <div class="lz-layer"><span class="lz-k">refs/</span><span class="lz-v">Những cái tên người đọc được, trỏ vào đó: nhánh dưới <code>refs/heads/</code>, tag dưới <code>refs/tags/</code>, nhánh theo dõi remote dưới <code>refs/remotes/</code>.</span></div>
</div>
<p>Đối tượng cộng ref <em>CHÍNH LÀ</em> Git. Mọi thứ khác trong danh sách kia là tiện lợi, cấu hình hoặc bộ nhớ đệm.</p>

<h3>HEAD — bạn đang ở đâu</h3>
${slide('git-09', 4, 'HEAD và nhánh chỉ là file chữ một dòng')}
<pre><code>cat .git/HEAD</code></pre>
<div class="out">ref: refs/heads/main</div>
<p>Một dòng. Nó gọi tên cái nhánh bạn đang đứng (bài 3.1). Khi HEAD lìa cành, nó giữ thẳng một mã băm thay vì tên nhánh, và đó là toàn bộ khác biệt giữa hai trạng thái.</p>

<h3>refs/ — các nhánh</h3>
<pre><code>find .git/refs -type f | head
cat .git/refs/heads/main</code></pre>
<div class="out">.git/refs/heads/main
.git/refs/heads/feature/login
.git/refs/tags/v1.5.0
.git/refs/remotes/origin/main

3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d</div>
<p>Mỗi nhánh là một file 41 byte. Hãy để ý <code>feature/login</code> đã tạo ra một thư mục con thật — và đó là lý do bạn không thể có đồng thời một nhánh <code>feature</code> và một nhánh <code>feature/login</code> (bài 3.1): một thứ sẽ phải vừa là file vừa là thư mục.</p>
<pre><code>cat .git/packed-refs | head -3</code></pre>
<div class="out"># pack-refs with: peeled fully-peeled sorted
3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d refs/heads/main
9e2d4b70c1a3f5e7b9d0c2a4f6e8b0d2c4a6f8e0 refs/tags/v1.5.0</div>
<div class="callout ok">Một kho mã có hàng nghìn ref sẽ nghĩa là hàng nghìn file bé tí, nên Git định kỳ gói chúng vào <code>packed-refs</code>. Nếu <code>cat .git/refs/heads/main</code> báo "No such file" thì cái ref không mất — nó nằm trong <code>packed-refs</code>. Hãy dùng <code>git rev-parse main</code>, lệnh này kiểm cả hai chỗ.</div>

<h3>objects/ — cơ sở dữ liệu</h3>
${slide('git-09', 5, 'objects/: mỗi đối tượng rời là một file')}
<pre><code>ls .git/objects/ | head
ls .git/objects/3f/</code></pre>
<div class="out">3f  7b  9e  a7  info  pack

8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d</div>
<p>Mã băm 40 ký tự của mỗi đối tượng bị chẻ ra: hai ký tự đầu thành tên thư mục, 38 ký tự còn lại thành tên file. Việc chẻ đó tồn tại thuần tuý để một thư mục không phải chứa cả triệu mục, thứ mà đa số hệ thống file xử lý rất tệ.</p>
<pre><code>cat .git/objects/3f/8a1c9d2e5b…       <span class="tok-comment"># nhị phân — nén zlib</span>
git cat-file -t 3f8a1c9               <span class="tok-comment"># loại</span>
git cat-file -p 3f8a1c9               <span class="tok-comment"># in nội dung ra cho người đọc</span>
git cat-file -s 3f8a1c9               <span class="tok-comment"># kích thước theo byte</span></code></pre>
<div class="out">commit</div>
<p>Các file được nén zlib, nên <code>cat</code> hiện ra nhị phân. <code>git cat-file</code> là công cụ để đọc chúng, và bài 9.2 dùng nó trên cả bốn loại đối tượng.</p>

<h3>index — vùng staging, dưới dạng một file thật</h3>
${slide('git-09', 10, 'index — vùng staging là một file thật')}
<pre><code>ls -la .git/index
git ls-files --stage | head -3</code></pre>
<div class="out">-rw-r--r-- 1 an an 8394 Aug 21 14:20 .git/index

100644 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d 0	src/app.ts
100644 9e2d4b70c1a3f5e7b9d0c2a4f6e8b0d2c4a6f8e0 0	src/auth.ts
100755 a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e	0	deploy.sh</div>
<div class="kv-grid">
  <div class="kv"><span class="k">100644 / 100755</span><span class="v">Chế độ file. Git chỉ ghi lại "file thường" và "file thực thi được" — nó cố tình không theo dõi quyền Unix đầy đủ.</span></div>
  <div class="kv"><span class="k">Mã băm</span><span class="v">Blob giữ nội dung đã staging của file đó.</span></div>
  <div class="kv"><span class="k">0</span><span class="v">Giai đoạn hợp nhất. Khi có xung đột, giá trị này thành 1 (gốc), 2 (của ta), 3 (của họ) — đó chính là cách một xung đột được lưu (bài 3.3).</span></div>
</div>
<div class="callout ok">Đây là "cái cây ở giữa" của bài 1.1, hiện ra cụ thể: một file nhị phân liệt kê mọi đường dẫn được theo dõi kèm mã băm nội dung đã staging của nó. <code>git add</code> ghi một blob và cập nhật một dòng ở đây; <code>git commit</code> biến cả cái bảng này thành một đối tượng tree.</div>

<h3>Phần còn lại</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">config</span><span class="v">Cấu hình riêng của kho này — mức <code>--local</code> ở bài 0.3, gồm cả các remote của bạn.</span></div>
  <div class="kv"><span class="k">logs/</span><span class="v">Reflog (bài 4.4). <code>logs/HEAD</code> cộng một file cho mỗi nhánh. Không bao giờ được push, và vì thế không ai khác cứu được sai lầm của bạn.</span></div>
  <div class="kv"><span class="k">hooks/</span><span class="v">Các script Git chạy ở những thời điểm định sẵn, tất cả đều đuôi <code>.sample</code> và nằm im cho tới khi được đổi tên (Chương 12).</span></div>
  <div class="kv"><span class="k">info/exclude</span><span class="v">Luật ignore cá nhân cho kho này, không được commit (bài 1.5).</span></div>
  <div class="kv"><span class="k">COMMIT_EDITMSG</span><span class="v">File nháp giữ lời nhắn bạn vừa gõ trong trình soạn thảo. Không phải lịch sử — chỉ là bộ đệm.</span></div>
  <div class="kv"><span class="k">ORIG_HEAD</span><span class="v">Chỗ HEAD đứng trước thao tác nguy hiểm gần nhất. <code>git reset --hard ORIG_HEAD</code> huỷ một lần merge hay rebase hỏng.</span></div>
</div>

<h3>Chứng minh mô hình</h3>
<pre><code><span class="tok-comment"># Một nhánh thật sự chỉ là một file. Hãy tạo một cái bằng echo:</span>
<span class="tok-keyword">echo</span> \$(git rev-parse HEAD) &gt; .git/refs/heads/handmade
git branch | grep handmade</code></pre>
<div class="out">  handmade</div>
<p>Không cần nói cho Git biết. Nó đọc thư mục đó, nên ghi một file vào đấy là tạo ra một nhánh. (Hãy làm việc này một lần cho hiểu, rồi dùng <code>git branch</code> — lệnh cấp cao còn cập nhật reflog và kiểm tính hợp lệ của mã băm.)</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong sân tập <code>thu-git</code>, đoán trước <code>cat .git/HEAD</code> in ra gì, rồi chạy. Sau đó <code>git switch --detach HEAD~1</code>, chạy lại <code>cat .git/HEAD</code> và so sánh, rồi quay về bằng <code>git switch main</code>.</li><li>Chạy <code>git count-objects -v</code> và cộng <code>count</code> với <code>in-pack</code>: đó là số đối tượng kho của bạn đang giữ.</li><li>Trước khi commit, đoán xem một commit chỉ sửa MỘT file nằm ở gốc dự án sẽ tạo ra bao nhiêu đối tượng mới. Thêm một dòng vào <code>README.md</code>, commit, rồi đếm lại.</li><li>So <code>cat .git/refs/heads/main</code> với <code>git rev-parse main</code>. Nếu file không tồn tại, tìm nhánh trong <code>.git/packed-refs</code>.</li><li>Tạo một nhánh chỉ bằng <code>echo</code> (khối "Chứng minh mô hình" ở trên), kiểm bằng <code>git branch</code>, rồi xoá đàng hoàng bằng <code>git branch -d handmade</code>.</li></ol>
<pre><code class="language-bash">git count-objects -v | head -1
count: 11
<span class="tok-keyword">echo</span> <span class="tok-string">"Them mot dong."</span> &gt;&gt; README.md &amp;&amp; git commit -qam <span class="tok-string">"docs: them mot dong vao README"</span>
git count-objects -v | head -1
count: 14                 <span class="tok-comment"># output thật từ kho thử: +3</span>
git switch --detach HEAD~1 &amp;&amp; cat .git/HEAD
HEAD is now at 6a952eb feat: doi loi chao
6a952eb80d5ac9cd0ab8757ac9b6dcb382f7fa5b   <span class="tok-comment"># mã băm trần, không phải "ref: …"</span></code></pre>
<p><strong>Đạt khi:</strong> tổng số đối tượng tăng đúng 3 và bạn gọi tên được cả ba (blob mới của <code>README.md</code>, một tree gốc mới, commit); lúc lìa cành <code>.git/HEAD</code> giữ một mã băm trần; và <code>git rev-parse main</code> in ra đúng mã băm trong file nhánh (hoặc dòng của nó trong <code>packed-refs</code>).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">.git directory</span><span class="v">Thư mục .git — chính là kho mã. Thư mục dự án chỉ là bản lấy ra (checkout) của một ảnh chụp trong đó.</span></div>
  <div class="kv"><span class="k">Object database</span><span class="v">Kho đối tượng — <code>.git/objects/</code>, nơi mọi phiên bản file, danh sách thư mục, commit và tag có chú thích nằm dưới mã băm của chính các byte của chúng.</span></div>
  <div class="kv"><span class="k">Ref</span><span class="v">Tham chiếu — cái tên người đọc được (nhánh, tag, nhánh theo dõi remote), thật ra chỉ là một file chứa mã băm.</span></div>
  <div class="kv"><span class="k">HEAD</span><span class="v">Con trỏ "bạn đang ở đây" — file một dòng: thường là <code>ref: refs/heads/&lt;nhánh&gt;</code>, hoặc mã băm trần khi lìa cành.</span></div>
  <div class="kv"><span class="k">packed-refs</span><span class="v">File gói ref — một file gom nhiều ref, do <code>git gc</code> ghi ra. Lý do một file nhánh có thể "biến mất" mà nhánh không hề mất.</span></div>
  <div class="kv"><span class="k">Loose object</span><span class="v">Đối tượng rời — mỗi đối tượng một file nén zlib, ở <code>objects/&lt;2 ký tự đầu&gt;/&lt;38 ký tự còn lại&gt;</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>objects/</code> cộng <code>refs/</code> là toàn bộ kho mã; mọi thứ khác là cấu hình, bộ đệm hoặc tiện ích.</li><li>Một nhánh là file chữ 41 byte chứa mã băm commit; <code>HEAD</code> là file một dòng gọi tên nhánh đó.</li><li>HEAD lìa cành đơn giản là <code>.git/HEAD</code> chứa mã băm thay vì tên nhánh.</li><li>Index là một file nhị phân thật, liệt kê mọi đường dẫn được theo dõi kèm mã băm nội dung đã staging.</li><li>Đọc <code>.git/</code> thoải mái; ghi vào nó qua lệnh như <code>git rev-parse</code>, <code>git branch</code> và <code>git update-ref</code>.</li></ul>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Internals-Plumbing-and-Porcelain" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 10.1 (tiếng Việt) — Plumbing và Porcelain</span><span class="lc-sub">Phân biệt giữa những lệnh người ta dùng và những lệnh dựng nên chúng.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/gitrepository-layout" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">gitrepository-layout — mọi file trong .git, được ghi lại</span><span class="lc-sub">Tài liệu tra cứu cho bất cứ thứ gì trong thư mục đó mà bài này chưa nói tới.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> sửa file trong <code>.git/</code> để chữa một vấn đề. Nó chạy được đủ thường xuyên để trở nên hấp dẫn và nó bỏ qua mọi phép kiểm Git thực hiện — một ref viết tay có lỗi chính tả, một đối tượng bị xoá thủ công, một index bị sửa — và sự hỏng hóc sinh ra sẽ lộ ra vài giờ sau ở một chỗ chẳng liên quan. Hãy ĐỌC <code>.git/</code> thoải mái; và GHI vào nó qua các lệnh.</div>
<p class="note-ct"><strong>Chương này mua cho bạn cái gì:</strong> sau chuyến tham quan này, "kho mã hỏng rồi" trở thành một khẳng định kiểm chứng được. <code>HEAD</code> có trỏ vào một ref tồn tại không? Cái ref đó có giữ một mã băm mà <code>git cat-file -t</code> nhận ra không? Chương 13 dựa hẳn vào điều này để cứu những tình huống trông như vô vọng.</p>
</div>
`,
    },

    /* ─────────────────────────── 9.2 ─────────────────────────── */
    {
      title: '9.2 — The four objects: blob, tree, commit, tag|||9.2 — Bốn đối tượng: blob, tree, commit, tag',
      slug: 'git-9-2-bon-doi-tuong',
      type: 'LESSON',
      description: 'Bốn loại đối tượng và mối quan hệ giữa chúng, đọc từng loại bằng cat-file, và dựng một commit hoàn chỉnh BẰNG TAY không dùng git add hay git commit.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Four kinds of thing, and that is the whole database</h2>
<p class="lead">Git's object database has exactly four types. Everything you have done in eight chapters — every commit, branch, merge and tag — is these four, stored under the hash of their own bytes.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">blob</span><span class="lz-v">The contents of one file. No name, no path, no permissions — just bytes.</span></div>
  <div class="lz-layer"><span class="lz-k">tree</span><span class="lz-v">A directory listing: names, modes, and the hash of the blob or sub-tree each name refers to.</span></div>
  <div class="lz-layer"><span class="lz-k">commit</span><span class="lz-v">One tree (the root of the snapshot), zero or more parents, author, committer, message.</span></div>
  <div class="lz-layer"><span class="lz-k">tag</span><span class="lz-v">An annotated tag (7.2): a pointer to another object plus tagger, date, message and optional signature.</span></div>
</div>

<h3>Reading each one</h3>
${slide('git-09', 7, 'Một commit mở bung ra: commit → tree → blob')}
<pre><code>git cat-file -p HEAD</code></pre>
<div class="out">tree 8b7c4a2e1f9d0c3b5a7e9f1d3c5b7a9e1f3d5c7b
parent 9e2d4b70c1a3f5e7b9d0c2a4f6e8b0d2c4a6f8e0
author Nguyen Van An &lt;an@example.com&gt; 1755820800 +0700
committer Nguyen Van An &lt;an@example.com&gt; 1755820800 +0700

feat(auth): add refresh token rotation</div>
<pre><code>git cat-file -p 8b7c4a2</code></pre>
<div class="out">100644 blob a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e	package.json
040000 tree 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d	src
100644 blob 5f7a9c2b8d0e2f4a6c8e0b2d4f6a8c0e2b4d6f8e	README.md</div>
<pre><code>git cat-file -p a7c2f91 | head -3</code></pre>
<div class="out">{
  "name": "api-backend",
  "version": "1.5.0",</div>
<p>Three levels: the commit names a tree, the tree names blobs and sub-trees, a blob holds bytes. That is the whole storage model, and it recurses for any depth of directory.</p>

<div class="lz-map">
  <div class="lz-stage">One commit, expanded</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">commit 3f8a1c9</div><div class="lz-nsub">tree 8b7c4a2 · parent 9e2d4b7 · author · message</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">tree 8b7c4a2 — the project root</div><div class="lz-nsub">package.json → blob · src → tree · README.md → blob</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">tree 3f8a1c9 — src/</div><div class="lz-nsub">app.ts → blob · auth.ts → blob</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">blob a7c2f91</div><div class="lz-nsub">The literal bytes of package.json. Nothing else.</div></div></div>
</div>

<h3>Where the file name lives — and why renames are free</h3>
${slide('git-09', 8, 'Hai commit dùng chung blob — file không đổi, không tốn thêm')}
<div class="callout ok">A blob does not know its own name. The name lives in the <strong>tree</strong> that points at it. Rename a file without changing its content and Git writes a new tree and reuses the identical blob — which is why renaming a 10 MB file costs almost nothing, and why <code>git log --follow</code> (2.3) has to <em>infer</em> renames rather than read them: Git never recorded one.</div>

<h3>Building a commit by hand</h3>
${slide('git-09', 12, 'Dựng một commit bằng năm lệnh tầng thấp')}
<p>The most convincing way to believe all this is to make a commit without <code>git add</code> or <code>git commit</code>. Every command below is real:</p>
<pre><code>mkdir -p /tmp/by-hand &amp;&amp; cd /tmp/by-hand &amp;&amp; git init -q

<span class="tok-comment"># 1. Store some content as a blob. -w means "write it to the database".</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"hello world"</span> | git hash-object -w --stdin</code></pre>
<div class="out">3b18e512dba79e4c8300dd08aeb37f8e728b8dad</div>
<pre><code><span class="tok-comment"># 2. Put that blob into the index under a name.</span>
git update-index --add --cacheinfo 100644,3b18e512dba79e4c8300dd08aeb37f8e728b8dad,hello.txt

<span class="tok-comment"># 3. Turn the index into a tree object.</span>
git write-tree</code></pre>
<div class="out">68aba62e560c0ebc3396e8ae9335232cd93a3f60</div>
<pre><code><span class="tok-comment"># 4. Wrap the tree in a commit.</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"first commit, made by hand"</span> | git commit-tree 68aba62</code></pre>
<div class="out">826b62edec33ae69e4f04a1ba2c40744ec4938c8</div>
<pre><code><span class="tok-comment"># 5. Point a branch at it. THIS is what "committing" means.</span>
git update-ref refs/heads/main 826b62e
git log --oneline</code></pre>
<div class="out">826b62e first commit, made by hand</div>
<div class="callout ok">A real commit, in a real repository, built from five plumbing commands. <code>git commit</code> is those five steps plus conveniences: reading your config for the author, opening an editor, running hooks, writing the reflog. Nothing magical was removed.</div>
<p>Two honest details from running this for real (git 2.51). First, <strong>your commit hash will differ</strong>: a commit object contains the author name, email and the second it was made, so only the blob <code>3b18e51</code> and the tree <code>68aba62</code> are identical on every machine. Second, the working directory was never touched, so Git reports the file as deleted until you check it out. (Step 5 assumes <code>init.defaultBranch = main</code> from 0.3; if your new repository started on <code>master</code>, create it with <code>git init -b main</code> instead.)</p>
<pre><code>git status -s
git restore hello.txt   <span class="tok-comment"># write the committed blob out to disk</span></code></pre>
<div class="out"> D hello.txt</div>

<h3>The header that goes into the hash</h3>
<pre><code><span class="tok-comment"># Git hashes "&lt;type&gt; &lt;size&gt;\\0&lt;content&gt;", not the content alone:</span>
printf <span class="tok-string">'blob 12\\0hello world\\n'</span> | sha1sum</code></pre>
<div class="out">3b18e512dba79e4c8300dd08aeb37f8e728b8dad  -</div>
<p>The same hash <code>git hash-object</code> produced. The type-and-size prefix is why a blob and a commit with identical bytes get different hashes, and why you can ask <code>git cat-file -t</code> for an object's type without a lookup table.</p>
<p>On Linux and in Git Bash on Windows <code>sha1sum</code> is always there; on a Mac use <code>shasum</code> (recent macOS also ships <code>sha1sum</code>). Same 40 characters either way.</p>

<h3>Inspecting the whole database</h3>
<pre><code>git cat-file --batch-all-objects --batch-check | head -8</code></pre>
<div class="out">3b18e512dba79e4c8300dd08aeb37f8e728b8dad blob 12
68aba62e560c0ebc3396e8ae9335232cd93a3f60 tree 37
826b62edec33ae69e4f04a1ba2c40744ec4938c8 commit 177</div>
<pre><code><span class="tok-comment"># Every object, sorted by size — how you find the 400 MB video (8.3):</span>
git cat-file --batch-all-objects --batch-check=<span class="tok-string">'%(objectsize) %(objectname) %(objecttype)'</span> \\
  | sort -rn | head -5</code></pre>

<h3>Annotated tags are objects too</h3>
${slide('git-09', 13, 'Tag có chú thích là một đối tượng; tag nhẹ chỉ là file')}
<pre><code>git tag -a v1.0 -m <span class="tok-string">"first release"</span>
git cat-file -t v1.0
git cat-file -p v1.0</code></pre>
<div class="out">tag

object 826b62edec33ae69e4f04a1ba2c40744ec4938c8
type commit
tag v1.0
tagger Cuong &lt;cuong@example.com&gt; 1790020600 +0700

first release</div>
<p>A lightweight tag has no object at all — <code>refs/tags/v1.0</code> holds the commit hash directly. That is the difference from 7.2, made concrete: one is a file, the other is a file <em>and</em> an object.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In <code>thu-git</code>, walk down from HEAD with <code>git cat-file -p</code>: the commit, its <code>tree</code>, a sub-tree if you have one, and finally a blob. Write down the four hashes.</li><li>Now build a commit <strong>without</strong> <code>git add</code> or <code>git commit</code>, on a new branch: <code>git switch -c tay</code>, then <code>echo "ghi chu tu tay" | git hash-object -w --stdin</code>.</li><li>Put that blob into the index under a name: <code>git update-index --add --cacheinfo 100644,&lt;blob hash&gt;,tay.txt</code>, then <code>git write-tree</code> and read the tree with <code>git cat-file -p</code>. Why are all your old files in it too?</li><li>Wrap it: <code>echo "feat: commit dung bang tay" | git commit-tree &lt;tree hash&gt; -p HEAD</code>, then point the branch at the result with <code>git update-ref refs/heads/tay &lt;commit hash&gt;</code>.</li><li>Check <code>git log --oneline -2</code> and <code>git status -s</code>, then <code>git restore tay.txt</code> and <code>cat tay.txt</code>.</li></ol>
<pre><code class="language-bash">git write-tree &amp;&amp; git cat-file -p 1fb718c
1fb718c89d93b4acb013261eb658c348046eac25
100644 blob 9c3ec627cfb3a17c423b540c563fe60d92d2cf2e	README.md
040000 tree 8230aab1da15ca4d74ba45d6200ce9172d7cb455	src
100644 blob 35aebccbb552f64796d2deeb8f53ae2dd012e74b	tay.txt
git log --oneline -2
399cba8 feat: commit dung bang tay     <span class="tok-comment"># real output; your commit hash will differ</span>
99ae6f9 docs: them mot dong vao README
git status -s
 D tay.txt                             <span class="tok-comment"># in the index and the commit, never written to disk</span></code></pre>
<p><strong>Done when:</strong> <code>git log</code> on <code>tay</code> shows your hand-made commit on top of the previous one, <code>git cat-file -p HEAD</code> shows a <code>parent</code> line, <code>git status -s</code> is empty after the restore, and you can say why the tree contains every old file (the index already listed them — <code>update-index</code> only added one row).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Blob</span><span class="v">The bytes of one file version. No name, no path, no date.</span></div>
  <div class="kv"><span class="k">Tree</span><span class="v">A directory listing: mode, name and hash of each blob or sub-tree. The only place a file name is stored.</span></div>
  <div class="kv"><span class="k">Commit object</span><span class="v">One root tree + parent(s) + author/committer + message. Its hash changes if any of those change.</span></div>
  <div class="kv"><span class="k">Annotated tag object</span><span class="v">An object pointing at another object, with tagger, date and message. A lightweight tag is only a ref.</span></div>
  <div class="kv"><span class="k">Content-addressable</span><span class="v">Every object's name is the SHA-1 of <code>"&lt;type&gt; &lt;size&gt;"</code> + NUL + its content, so equal content means equal hash everywhere.</span></div>
  <div class="kv"><span class="k">Plumbing vs porcelain</span><span class="v">Low-level commands (<code>hash-object</code>, <code>write-tree</code>…) versus the everyday commands built from them (<code>add</code>, <code>commit</code>).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>The whole database is four object types: blob, tree, commit and annotated tag.</li><li>A file's name lives in a tree, so renaming without editing reuses the same blob.</li><li>A commit that changes one file writes only the objects on the path from that file up to the commit; every other blob is shared.</li><li><code>git commit</code> is <code>write-tree</code> + <code>commit-tree</code> + <code>update-ref</code>, plus config, editor, hooks and reflog.</li><li>Same bytes give the same blob hash on every machine; commit hashes differ because they include author and time.</li></ul>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Internals-Git-Objects" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 10.2 — Git Objects</span><span class="lc-sub">The same by-hand construction, with more detail on tree entry format.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-cat-file" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">git-cat-file — including --batch-all-objects</span><span class="lc-sub">The format placeholders for --batch-check, useful for auditing repository size.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> assuming Git stores renames or moves. It stores <em>snapshots</em>; a rename is simply a tree that no longer mentions the old name and does mention a new one pointing at the same blob. Every "rename detection" you see — in <code>git log --follow</code>, in <code>git blame -C</code>, in a diff — is a similarity heuristic computed on demand. It usually works, and it can be wrong when a file was renamed and heavily edited in one commit.</div>
<p class="note-ct"><strong>Why the by-hand exercise is worth the ten minutes:</strong> after doing it once, "the commit is corrupt", "the branch points at nothing" and "the object is missing" stop being mysteries and become statements about specific files you know how to inspect. That is the foundation Chapter 13's recovery work stands on.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Bốn loại thứ, và đó là toàn bộ cơ sở dữ liệu</h2>
<p class="lead">Kho đối tượng của Git có đúng bốn loại. Mọi thứ bạn đã làm suốt tám chương — mọi commit, nhánh, lần hợp nhất và tag — đều là bốn loại này, lưu dưới mã băm của chính các byte của chúng.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">blob</span><span class="lz-v">Nội dung của một file. Không tên, không đường dẫn, không quyền — chỉ có byte.</span></div>
  <div class="lz-layer"><span class="lz-k">tree</span><span class="lz-v">Một danh sách thư mục: tên, chế độ, và mã băm của blob hoặc tree con mà mỗi tên trỏ tới.</span></div>
  <div class="lz-layer"><span class="lz-k">commit</span><span class="lz-v">Một tree (gốc của ảnh chụp), không hoặc nhiều cha, tác giả, người commit, lời nhắn.</span></div>
  <div class="lz-layer"><span class="lz-k">tag</span><span class="lz-v">Một tag có chú thích (bài 7.2): con trỏ tới một đối tượng khác cộng người gắn tag, ngày, lời nhắn và chữ ký tuỳ chọn.</span></div>
</div>

<h3>Đọc từng loại</h3>
${slide('git-09', 7, 'Một commit mở bung ra: commit → tree → blob')}
<pre><code>git cat-file -p HEAD</code></pre>
<div class="out">tree 8b7c4a2e1f9d0c3b5a7e9f1d3c5b7a9e1f3d5c7b
parent 9e2d4b70c1a3f5e7b9d0c2a4f6e8b0d2c4a6f8e0
author Nguyen Van An &lt;an@example.com&gt; 1755820800 +0700
committer Nguyen Van An &lt;an@example.com&gt; 1755820800 +0700

feat(auth): add refresh token rotation</div>
<pre><code>git cat-file -p 8b7c4a2</code></pre>
<div class="out">100644 blob a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e	package.json
040000 tree 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d	src
100644 blob 5f7a9c2b8d0e2f4a6c8e0b2d4f6a8c0e2b4d6f8e	README.md</div>
<pre><code>git cat-file -p a7c2f91 | head -3</code></pre>
<div class="out">{
  "name": "api-backend",
  "version": "1.5.0",</div>
<p>Ba tầng: commit gọi tên một tree, tree gọi tên các blob và tree con, một blob giữ các byte. Đó là toàn bộ mô hình lưu trữ, và nó đệ quy cho thư mục sâu bao nhiêu cũng được.</p>

<div class="lz-map">
  <div class="lz-stage">Một commit, mở bung ra</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">commit 3f8a1c9</div><div class="lz-nsub">tree 8b7c4a2 · parent 9e2d4b7 · tác giả · lời nhắn</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">tree 8b7c4a2 — gốc dự án</div><div class="lz-nsub">package.json → blob · src → tree · README.md → blob</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">tree 3f8a1c9 — src/</div><div class="lz-nsub">app.ts → blob · auth.ts → blob</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">blob a7c2f91</div><div class="lz-nsub">Đúng các byte của package.json. Không gì khác.</div></div></div>
</div>

<h3>Tên file nằm ở đâu — và vì sao đổi tên là miễn phí</h3>
${slide('git-09', 8, 'Hai commit dùng chung blob — file không đổi, không tốn thêm')}
<div class="callout ok">Một blob không biết tên của chính nó. Cái tên nằm trong <strong>tree</strong> trỏ vào nó. Đổi tên một file mà không đổi nội dung thì Git ghi một tree mới và dùng lại đúng cái blob cũ — vì thế đổi tên một file 10 MB gần như không tốn gì, và vì thế <code>git log --follow</code> (bài 2.3) phải <em>SUY LUẬN</em> ra việc đổi tên chứ không đọc được nó: Git chưa bao giờ ghi lại một lần đổi tên nào.</div>

<h3>Dựng một commit bằng tay</h3>
${slide('git-09', 12, 'Dựng một commit bằng năm lệnh tầng thấp')}
<p>Cách thuyết phục nhất để tin toàn bộ chuyện này là tạo một commit mà không dùng <code>git add</code> hay <code>git commit</code>. Mọi lệnh dưới đây đều là thật:</p>
<pre><code>mkdir -p /tmp/by-hand &amp;&amp; cd /tmp/by-hand &amp;&amp; git init -q

<span class="tok-comment"># 1. Lưu một mẩu nội dung thành blob. -w nghĩa là "ghi nó vào cơ sở dữ liệu".</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"hello world"</span> | git hash-object -w --stdin</code></pre>
<div class="out">3b18e512dba79e4c8300dd08aeb37f8e728b8dad</div>
<pre><code><span class="tok-comment"># 2. Đưa blob đó vào index dưới một cái tên.</span>
git update-index --add --cacheinfo 100644,3b18e512dba79e4c8300dd08aeb37f8e728b8dad,hello.txt

<span class="tok-comment"># 3. Biến index thành một đối tượng tree.</span>
git write-tree</code></pre>
<div class="out">68aba62e560c0ebc3396e8ae9335232cd93a3f60</div>
<pre><code><span class="tok-comment"># 4. Bọc cái tree đó trong một commit.</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"first commit, made by hand"</span> | git commit-tree 68aba62</code></pre>
<div class="out">826b62edec33ae69e4f04a1ba2c40744ec4938c8</div>
<pre><code><span class="tok-comment"># 5. Cho một nhánh trỏ vào nó. ĐÂY mới là ý nghĩa của việc "commit".</span>
git update-ref refs/heads/main 826b62e
git log --oneline</code></pre>
<div class="out">826b62e first commit, made by hand</div>
<div class="callout ok">Một commit thật, trong một kho mã thật, dựng từ năm lệnh cấp thấp. <code>git commit</code> là đúng năm bước đó cộng các tiện ích: đọc cấu hình để lấy tác giả, mở trình soạn thảo, chạy hook, ghi reflog. Không có phép màu nào bị lược bỏ cả.</div>
<p>Hai chi tiết thật khi chạy chuyện này (git 2.51). Một, <strong>mã băm commit của bạn sẽ KHÁC</strong>: đối tượng commit chứa tên tác giả, email và đúng giây nó được tạo, nên chỉ blob <code>3b18e51</code> và tree <code>68aba62</code> là giống hệt trên mọi máy. Hai, thư mục làm việc chưa hề bị đụng tới, nên Git báo file đã bị xoá cho tới khi bạn lấy nó ra. (Bước 5 giả định <code>init.defaultBranch = main</code> đã đặt ở bài 0.3; nếu kho mới của bạn bắt đầu trên <code>master</code> thì tạo nó bằng <code>git init -b main</code>.)</p>
<pre><code>git status -s
git restore hello.txt   <span class="tok-comment"># ghi blob đã commit ra đĩa</span></code></pre>
<div class="out"> D hello.txt</div>

<h3>Cái header đi vào mã băm</h3>
<pre><code><span class="tok-comment"># Git băm "&lt;loại&gt; &lt;kích thước&gt;\\0&lt;nội dung&gt;", không băm riêng nội dung:</span>
printf <span class="tok-string">'blob 12\\0hello world\\n'</span> | sha1sum</code></pre>
<div class="out">3b18e512dba79e4c8300dd08aeb37f8e728b8dad  -</div>
<p>Đúng cái mã băm mà <code>git hash-object</code> đã sinh ra. Tiền tố loại-và-kích-thước là lý do một blob và một commit có cùng byte lại nhận mã băm khác nhau, và là lý do bạn hỏi được <code>git cat-file -t</code> về loại của một đối tượng mà không cần bảng tra.</p>
<p>Trên Linux và Git Bash của Windows luôn có <code>sha1sum</code>; trên Mac dùng <code>shasum</code> (macOS đời mới cũng có sẵn <code>sha1sum</code>). Cách nào cũng ra đúng 40 ký tự đó.</p>

<h3>Soi cả cơ sở dữ liệu</h3>
<pre><code>git cat-file --batch-all-objects --batch-check | head -8</code></pre>
<div class="out">3b18e512dba79e4c8300dd08aeb37f8e728b8dad blob 12
68aba62e560c0ebc3396e8ae9335232cd93a3f60 tree 37
826b62edec33ae69e4f04a1ba2c40744ec4938c8 commit 177</div>
<pre><code><span class="tok-comment"># Mọi đối tượng, sắp theo kích thước — cách bạn tìm ra cái video 400 MB (bài 8.3):</span>
git cat-file --batch-all-objects --batch-check=<span class="tok-string">'%(objectsize) %(objectname) %(objecttype)'</span> \\
  | sort -rn | head -5</code></pre>

<h3>Tag có chú thích cũng là đối tượng</h3>
${slide('git-09', 13, 'Tag có chú thích là một đối tượng; tag nhẹ chỉ là file')}
<pre><code>git tag -a v1.0 -m <span class="tok-string">"first release"</span>
git cat-file -t v1.0
git cat-file -p v1.0</code></pre>
<div class="out">tag

object 826b62edec33ae69e4f04a1ba2c40744ec4938c8
type commit
tag v1.0
tagger Cuong &lt;cuong@example.com&gt; 1790020600 +0700

first release</div>
<p>Một tag nhẹ thì không có đối tượng nào cả — <code>refs/tags/v1.0</code> giữ thẳng mã băm commit. Đó là khác biệt ở bài 7.2, hiện ra cụ thể: một bên là một file, bên kia là một file <em>VÀ</em> một đối tượng.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong <code>thu-git</code>, đi xuống từ HEAD bằng <code>git cat-file -p</code>: commit, <code>tree</code> của nó, một tree con nếu có, và cuối cùng một blob. Ghi lại bốn mã băm.</li><li>Giờ dựng một commit <strong>KHÔNG</strong> dùng <code>git add</code> hay <code>git commit</code>, trên nhánh mới: <code>git switch -c tay</code>, rồi <code>echo "ghi chu tu tay" | git hash-object -w --stdin</code>.</li><li>Đưa blob đó vào index dưới một cái tên: <code>git update-index --add --cacheinfo 100644,&lt;mã blob&gt;,tay.txt</code>, rồi <code>git write-tree</code> và đọc tree bằng <code>git cat-file -p</code>. Vì sao mọi file cũ cũng nằm trong đó?</li><li>Bọc lại: <code>echo "feat: commit dung bang tay" | git commit-tree &lt;mã tree&gt; -p HEAD</code>, rồi cho nhánh trỏ vào kết quả bằng <code>git update-ref refs/heads/tay &lt;mã commit&gt;</code>.</li><li>Kiểm <code>git log --oneline -2</code> và <code>git status -s</code>, rồi <code>git restore tay.txt</code> và <code>cat tay.txt</code>.</li></ol>
<pre><code class="language-bash">git write-tree &amp;&amp; git cat-file -p 1fb718c
1fb718c89d93b4acb013261eb658c348046eac25
100644 blob 9c3ec627cfb3a17c423b540c563fe60d92d2cf2e	README.md
040000 tree 8230aab1da15ca4d74ba45d6200ce9172d7cb455	src
100644 blob 35aebccbb552f64796d2deeb8f53ae2dd012e74b	tay.txt
git log --oneline -2
399cba8 feat: commit dung bang tay     <span class="tok-comment"># output thật; mã commit của bạn sẽ khác</span>
99ae6f9 docs: them mot dong vao README
git status -s
 D tay.txt                             <span class="tok-comment"># có trong index và commit, chưa từng ghi ra đĩa</span></code></pre>
<p><strong>Đạt khi:</strong> <code>git log</code> trên <code>tay</code> hiện commit tự dựng của bạn nằm trên commit trước đó, <code>git cat-file -p HEAD</code> có dòng <code>parent</code>, <code>git status -s</code> trống sau khi restore, và bạn nói được vì sao tree chứa mọi file cũ (index vốn đã liệt kê chúng — <code>update-index</code> chỉ thêm một dòng).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Blob</span><span class="v">Khối nội dung — các byte của một phiên bản file. Không tên, không đường dẫn, không ngày giờ.</span></div>
  <div class="kv"><span class="k">Tree</span><span class="v">Cây thư mục — danh sách chế độ, tên và mã băm của từng blob hoặc tree con. Chỗ DUY NHẤT lưu tên file.</span></div>
  <div class="kv"><span class="k">Commit object</span><span class="v">Đối tượng commit — một tree gốc + cha + tác giả/người commit + lời nhắn. Đổi bất cứ thứ gì trong đó là đổi mã băm.</span></div>
  <div class="kv"><span class="k">Annotated tag object</span><span class="v">Đối tượng tag có chú thích — trỏ tới một đối tượng khác, kèm người gắn, ngày, lời nhắn. Tag nhẹ thì chỉ là một ref.</span></div>
  <div class="kv"><span class="k">Content-addressable</span><span class="v">Định danh theo nội dung — tên mỗi đối tượng là SHA-1 của <code>"&lt;loại&gt; &lt;kích thước&gt;"</code> + ký tự NUL + nội dung, nên nội dung giống nhau thì mã băm giống nhau ở mọi nơi.</span></div>
  <div class="kv"><span class="k">Plumbing vs porcelain</span><span class="v">Lệnh tầng thấp (<code>hash-object</code>, <code>write-tree</code>…) so với lệnh hằng ngày dựng từ chúng (<code>add</code>, <code>commit</code>) — "ống nước" và "đồ sứ".</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Cả cơ sở dữ liệu chỉ có bốn loại đối tượng: blob, tree, commit và tag có chú thích.</li><li>Tên file nằm trong tree, nên đổi tên mà không sửa nội dung thì dùng lại đúng blob cũ.</li><li>Một commit sửa một file chỉ ghi các đối tượng trên đường từ file đó lên tới commit; mọi blob khác được dùng chung.</li><li><code>git commit</code> là <code>write-tree</code> + <code>commit-tree</code> + <code>update-ref</code>, cộng cấu hình, trình soạn thảo, hook và reflog.</li><li>Cùng byte thì cùng mã băm blob trên mọi máy; mã băm commit khác nhau vì có tác giả và thời điểm.</li></ul>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Internals-Git-Objects" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 10.2 (tiếng Việt) — Đối tượng Git</span><span class="lc-sub">Cùng cách dựng bằng tay, kèm chi tiết hơn về định dạng mục trong tree.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-cat-file" target="_blank" rel="noopener">
  <span class="lc-ico">🔬</span>
  <span class="lc-body"><span class="lc-title">git-cat-file — gồm cả --batch-all-objects</span><span class="lc-sub">Các ký hiệu định dạng cho --batch-check, hữu ích khi soát kích thước kho mã.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tưởng Git lưu lại việc đổi tên hay di chuyển file. Nó lưu <em>ảnh chụp</em>; một lần đổi tên đơn giản là một cái tree không còn nhắc tên cũ nữa và có nhắc một tên mới trỏ vào cùng cái blob. Mọi "phát hiện đổi tên" bạn thấy — trong <code>git log --follow</code>, trong <code>git blame -C</code>, trong một bản diff — đều là một thuật toán tương đồng tính ra khi cần. Nó thường đúng, và có thể sai khi một file vừa bị đổi tên vừa bị sửa nhiều trong cùng một commit.</div>
<p class="note-ct"><strong>Vì sao bài tập dựng-bằng-tay đáng mười phút:</strong> sau khi làm một lần, "commit bị hỏng", "nhánh trỏ vào chỗ trống" và "thiếu mất đối tượng" hết là điều bí ẩn và trở thành những khẳng định về các file cụ thể mà bạn biết cách soi. Đó là nền móng mà phần cứu hộ của Chương 13 đứng lên trên.</p>
</div>
`,
    },

    /* ─────────────────────────── 9.3 ─────────────────────────── */
    {
      title: '9.3 — Packfiles, gc & why a clone is small|||9.3 — Packfile, gc & vì sao một bản clone lại nhỏ',
      slug: 'git-9-3-packfile-gc',
      type: 'LESSON',
      description: 'Từ đối tượng rời tới packfile, delta compression, git gc và những gì nó dọn, đo kích thước kho mã, tìm thứ làm phình nó, và các lệnh clone nông/một phần cho CI.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Ten years of history, forty megabytes</h2>
<p class="lead">Chapter 1.2 claimed that storing a full snapshot per commit is not wasteful. This lesson is the proof: Git periodically rewrites thousands of loose objects into a single <strong>packfile</strong> that stores similar objects as deltas against one another.</p>

<h3>Loose objects, then packs</h3>
${slide('git-09', 14, 'Đối tượng rời → packfile: git gc gói lại')}
<pre><code>ls .git/objects/</code></pre>
<div class="out">3f  7b  9e  a7  b2  c4  d8  e0  info  pack</div>
<p>Two-character directories are <strong>loose objects</strong> — one file each, zlib-compressed, written as you work. Every so often Git packs them:</p>
<pre><code>git gc
ls .git/objects/
ls -lh .git/objects/pack/</code></pre>
<div class="out">info  pack

-r--r--r-- 1 an an  38M pack-a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e.pack
-r--r--r-- 1 an an 2.1M pack-a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e.idx</div>
<div class="kv-grid">
  <div class="kv"><span class="k">.pack</span><span class="v">All the objects, concatenated and delta-compressed.</span></div>
  <div class="kv"><span class="k">.idx</span><span class="v">The index: which hash lives at which byte offset, so any object is one seek away.</span></div>
</div>

<h3>Delta compression — the actual saving</h3>
${slide('git-09', 15, 'Delta: bản cũ chỉ còn là phần khác')}
<p>Inside a pack, Git stores some objects as a <strong>delta</strong> against a similar one: "take object X and apply these changes". Version 200 of a 500 KB file is stored as a few bytes of difference from version 199.</p>
<div class="callout ok">This is where the "snapshots vs diffs" question resolves. Git's <em>model</em> is snapshots — every commit names a complete tree, which is what makes checkout fast and history immutable. Git's <em>storage</em> uses deltas inside packfiles, which is what makes it small. The two are independent: the model stays simple while the storage stays cheap.</div>
<pre><code>git verify-pack -v .git/objects/pack/pack-*.idx | head -6</code></pre>
<div class="out">3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d commit 168 119 12
a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e blob   4823 1904 131
5f7a9c2b8d0e2f4a6c8e0b2d4f6a8c0e2b4d6f8e blob   4901 62 2035 1 a7c2f91d…</div>
<p>Read the last line: a 4,901-byte blob stored in <strong>62 bytes</strong>, as a depth-1 delta against <code>a7c2f91</code>. That single line explains why a repository with a decade of edits to the same files stays small.</p>

<h3>What git gc actually does</h3>
${slide('git-09', 16, 'gc --prune=now không xoá thứ reflog còn nhắc tới')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Pack loose objects</div><div class="lz-d">Thousands of small files become one packfile.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Pack refs</div><div class="lz-d">Individual ref files collapse into <code>packed-refs</code> (9.1).</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Expire the reflog</div><div class="lz-d">Entries older than 90 days (30 for unreachable ones) are dropped.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Delete unreachable objects</div><div class="lz-d">Objects no ref and no reflog entry can reach are removed — <strong>this</strong> is when a "deleted" commit truly disappears (4.4).</div></div>
</div>
<pre><code>git gc                 <span class="tok-comment"># normal; Git also runs this automatically</span>
git gc --aggressive     <span class="tok-comment"># recompute deltas from scratch — slow, occasionally worth it</span>
git gc --prune=now      <span class="tok-comment"># DELETE unreachable objects immediately, no grace period</span></code></pre>
<div class="callout danger"><code>--prune=now</code> removes the safety net from 4.4. Anything not reachable from a ref or a reflog entry is gone permanently — including the commits you were about to recover. Never run it while you are trying to rescue something; that is exactly backwards.</div>
<div class="callout warn"><strong>What the reflog still protects — tested, not assumed.</strong> In a copy of our test repository, <code>git reset --hard HEAD~1</code> followed by <code>git gc --prune=now</code> did <em>not</em> delete the abandoned commit: <code>git cat-file -t 4098f32</code> still answered <code>commit</code>, because <code>HEAD@{1}</code> in the reflog still named it. Only after <code>git reflog expire --expire=now --all</code> did a second <code>gc --prune=now</code> make it <code>fatal: Not a valid object name</code>. So the objects <code>--prune=now</code> really destroys are the ones <em>no</em> reflog line names: a dropped stash, a blob you staged and then replaced, commits whose reflog entries already expired — exactly the things <code>git fsck --lost-found</code> (Chapter 13) is used to find. Guides for purging secrets tell you to run <code>reflog expire</code> first for this very reason.</div>

<h3>Measuring a repository</h3>
<pre><code>git count-objects -vH</code></pre>
<div class="out">count: 143
size: 1.21 MiB
in-pack: 24817
packs: 1
size-pack: 38.42 MiB
prune-packable: 0
garbage: 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">count / size</span><span class="v">Loose objects — written since the last gc.</span></div>
  <div class="kv"><span class="k">in-pack / size-pack</span><span class="v">Objects inside packfiles. Usually almost everything.</span></div>
  <div class="kv"><span class="k">garbage</span><span class="v">Files Git does not recognise in <code>objects/</code>. Non-zero here suggests something wrote into <code>.git/</code> that should not have (9.1's pitfall).</span></div>
</div>

<h3>Finding what made it big</h3>
<pre><code><span class="tok-comment"># The ten largest objects in history, with their path names:</span>
git rev-list --objects --all \\
  | git cat-file --batch-check=<span class="tok-string">'%(objecttype) %(objectname) %(objectsize) %(rest)'</span> \\
  | awk <span class="tok-string">'\$1=="blob"'</span> | sort -k3 -rn | head -10</code></pre>
<div class="out">blob 5f7a9c2b… 419430400 assets/demo-video.mp4
blob a7c2f91d… 52428800 public/textures/city.psd
blob 9e2d4b70… 8388608 package-lock.json</div>
<p>A 400 MB video that was deleted two years ago is still in every clone forever, because history is immutable. Removing it means rewriting history (8.3) — <code>git filter-repo --strip-blobs-bigger-than 10M</code> — with the full coordination cost that implies.</p>

<h3>Making clones cheaper without rewriting</h3>
<pre><code>git clone --depth 1 &lt;url&gt;                     <span class="tok-comment"># shallow: latest commit only</span>
git clone --filter=blob:none &lt;url&gt;            <span class="tok-comment"># blobless: fetch file contents on demand</span>
git clone --filter=blob:limit=1m &lt;url&gt;        <span class="tok-comment"># skip blobs over 1 MB until needed</span>
git clone --single-branch --branch main &lt;url&gt; <span class="tok-comment"># one branch only</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">--depth 1</span><span class="v">The classic CI clone. No history at all, so <code>git log</code>, <code>blame</code> and <code>describe</code> do not work — which breaks version stamping (7.2) if you rely on it.</span></div>
  <div class="kv"><span class="k">--filter=blob:none</span><span class="v">A <em>partial clone</em>: full commit and tree history, file contents fetched lazily over the network. History commands work; the first <code>checkout</code> of an old commit is slower.</span></div>
</div>
<pre><code>git fetch --unshallow          <span class="tok-comment"># turn a shallow clone into a full one</span></code></pre>

<h3>Maintenance, the modern way</h3>
<pre><code>git maintenance start           <span class="tok-comment"># register scheduled background upkeep</span>
git maintenance run --task=gc</code></pre>
<p>On a large repository this beats waiting for automatic <code>gc</code> to trigger mid-command. It also enables the commit-graph file, which makes <code>git log --graph</code> and merge-base calculations dramatically faster on repositories with tens of thousands of commits.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Work on a <strong>copy</strong>, because the last step deletes objects for real: <code>cp -R thu-git thu-git-gc &amp;&amp; cd thu-git-gc</code> (on Windows, copy the folder in Explorer or use the same command in Git Bash).</li><li>Make a 40 KB file and edit it five times, committing each time (zsh, bash and Git Bash all accept this loop): <code>for i in $(seq 1 1000); do echo "Dong $i: ghi chu bai giang Git, phan $((i % 17))"; done &gt; ghi-chu.md</code>, commit, then five times <code>echo "Ban sua lan N" &gt;&gt; ghi-chu.md &amp;&amp; git commit -qam "docs: sua lan N"</code>.</li><li><code>git count-objects -vH</code>, then <code>git gc</code>, then <code>git count-objects -vH</code> again. Compare <code>size</code> before with <code>size-pack</code> after.</li><li><code>git verify-pack -v .git/objects/pack/pack-*.idx | tail -3</code> and find the "chain length = 1" line. Which version of <code>ghi-chu.md</code> is stored whole?</li><li>Note the hash of the last commit, <code>git reset --hard HEAD~1</code>, <code>git gc --prune=now</code>, then <code>git cat-file -t &lt;hash&gt;</code>. Then <code>git reflog expire --expire=now --all</code>, <code>git gc --prune=now</code> and ask again. Delete the copy when you are done.</li></ol>
<pre><code class="language-bash">git count-objects -vH | grep -E <span class="tok-string">'^(count|size-pack)'</span>   <span class="tok-comment"># before gc: 29 loose, 25,239 bytes of real data</span>
count: 29
size-pack: 0 bytes
git gc &amp;&amp; git count-objects -vH | grep -E <span class="tok-string">'^(count|size-pack)'</span>
count: 0
size-pack: 8.08 KiB
git cat-file -t 4098f32      <span class="tok-comment"># after reset --hard HEAD~1 and gc --prune=now</span>
commit
git cat-file -t 4098f32      <span class="tok-comment"># after reflog expire and a second gc --prune=now</span>
fatal: Not a valid object name 4098f32</code></pre>
<p><strong>Done when:</strong> <code>size-pack</code> is a fraction of the loose size, you have seen at least one line with depth <code>1</code> in <code>verify-pack</code>, and you have watched the same hash answer <code>commit</code> and then <code>fatal: Not a valid object name</code> — and can explain that the reflog was the only thing standing between them.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Packfile</span><span class="v">One <code>.pack</code> file holding many objects, plus an <code>.idx</code> mapping each hash to its byte offset.</span></div>
  <div class="kv"><span class="k">Delta</span><span class="v">An object stored as "take base object X and apply these changes". Git keeps the newest version whole and older ones as deltas.</span></div>
  <div class="kv"><span class="k">git gc</span><span class="v">Housekeeping: packs objects and refs, expires old reflog entries, prunes unreachable objects past their grace period.</span></div>
  <div class="kv"><span class="k">Unreachable object</span><span class="v">An object no ref, index entry or reflog line leads to. The only kind <code>gc</code> ever deletes.</span></div>
  <div class="kv"><span class="k">Prune</span><span class="v">Deleting unreachable objects. <code>--prune=now</code> removes the usual two-week grace period.</span></div>
  <div class="kv"><span class="k">Shallow vs partial clone</span><span class="v"><code>--depth 1</code> drops history; <code>--filter=blob:none</code> keeps all history and fetches file contents on demand.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>New objects start loose, one file each; <code>git gc</code> packs them into a single packfile.</li><li>Inside a pack, similar objects are stored as deltas — the model stays snapshots, the storage becomes small.</li><li>Git keeps the newest version whole and makes older versions deltas, because the newest is read most.</li><li>An object disappears only when nothing reaches it — no ref, no index entry, no reflog line — and <code>gc</code> prunes it.</li><li>A repository's size is decided by everything ever committed; <code>--filter=blob:none</code> and <code>--depth</code> make clones cheaper without rewriting.</li></ul>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Internals-Packfiles" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Pro Git 10.4 — Packfiles</span><span class="lc-sub">How delta bases are chosen, and reading verify-pack output.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/partial-clone" target="_blank" rel="noopener">
  <span class="lc-ico">🪶</span>
  <span class="lc-body"><span class="lc-title">Partial clone — the --filter options explained</span><span class="lc-sub">When a partial clone beats a shallow one, and what stays slow.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> using <code>--depth 1</code> in CI and then wondering why <code>git describe</code> returns nothing, why <code>git log v1.4.0..HEAD</code> is empty, and why a merge-base check fails. A shallow clone has no history to search. Either fetch the tags you need (<code>git fetch --depth=1 origin +refs/tags/*:refs/tags/*</code>) or use <code>--filter=blob:none</code>, which keeps the whole commit graph while skipping file contents.</div>
<p class="note-ct"><strong>The thing to take away:</strong> a repository's size is decided by what was <em>ever</em> committed, not by what is in it today. Deleting a large file makes the working tree smaller and the clone exactly as large as before. That is the practical argument for <code>.gitignore</code> discipline (1.5) and for Git LFS on binary assets — both are cheap in advance and expensive to retrofit.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Mười năm lịch sử, bốn mươi megabyte</h2>
<p class="lead">Bài 1.2 khẳng định rằng lưu một ảnh chụp đầy đủ cho mỗi commit không hề lãng phí. Bài này là bằng chứng: Git định kỳ viết lại hàng nghìn đối tượng rời thành một <strong>packfile</strong> duy nhất, trong đó các đối tượng giống nhau được lưu dưới dạng delta so với nhau.</p>

<h3>Đối tượng rời, rồi tới pack</h3>
${slide('git-09', 14, 'Đối tượng rời → packfile: git gc gói lại')}
<pre><code>ls .git/objects/</code></pre>
<div class="out">3f  7b  9e  a7  b2  c4  d8  e0  info  pack</div>
<p>Các thư mục hai ký tự là <strong>đối tượng rời</strong> — mỗi cái một file, nén zlib, được ghi ra trong lúc bạn làm việc. Thỉnh thoảng Git gói chúng lại:</p>
<pre><code>git gc
ls .git/objects/
ls -lh .git/objects/pack/</code></pre>
<div class="out">info  pack

-r--r--r-- 1 an an  38M pack-a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e.pack
-r--r--r-- 1 an an 2.1M pack-a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e.idx</div>
<div class="kv-grid">
  <div class="kv"><span class="k">.pack</span><span class="v">Mọi đối tượng, nối lại và nén theo delta.</span></div>
  <div class="kv"><span class="k">.idx</span><span class="v">Bảng chỉ mục: mã băm nào nằm ở byte thứ mấy, nên với tới đối tượng nào cũng chỉ tốn một lần nhảy.</span></div>
</div>

<h3>Nén delta — chỗ tiết kiệm thật sự</h3>
${slide('git-09', 15, 'Delta: bản cũ chỉ còn là phần khác')}
<p>Bên trong một pack, Git lưu một số đối tượng dưới dạng <strong>delta</strong> so với một đối tượng tương tự: "lấy đối tượng X rồi áp những thay đổi này". Phiên bản thứ 200 của một file 500 KB được lưu bằng vài byte khác biệt so với phiên bản 199.</p>
<div class="callout ok">Đây là chỗ câu hỏi "ảnh chụp hay bản khác biệt" được giải quyết. <em>MÔ HÌNH</em> của Git là ảnh chụp — mọi commit gọi tên một tree hoàn chỉnh, và đó là thứ làm cho checkout nhanh và lịch sử bất biến. <em>CÁCH LƯU TRỮ</em> của Git dùng delta bên trong packfile, và đó là thứ làm cho nó nhỏ. Hai thứ độc lập với nhau: mô hình vẫn đơn giản trong khi lưu trữ vẫn rẻ.</div>
<pre><code>git verify-pack -v .git/objects/pack/pack-*.idx | head -6</code></pre>
<div class="out">3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d commit 168 119 12
a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e blob   4823 1904 131
5f7a9c2b8d0e2f4a6c8e0b2d4f6a8c0e2b4d6f8e blob   4901 62 2035 1 a7c2f91d…</div>
<p>Hãy đọc dòng cuối: một blob 4.901 byte được lưu trong <strong>62 byte</strong>, dưới dạng delta độ sâu 1 so với <code>a7c2f91</code>. Chỉ một dòng đó giải thích vì sao một kho mã có cả thập kỷ chỉnh sửa trên cùng những file vẫn nhỏ.</p>

<h3>git gc thật ra làm gì</h3>
${slide('git-09', 16, 'gc --prune=now không xoá thứ reflog còn nhắc tới')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Gói đối tượng rời</div><div class="lz-d">Hàng nghìn file nhỏ thành một packfile.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Gói các ref</div><div class="lz-d">Các file ref riêng lẻ dồn vào <code>packed-refs</code> (bài 9.1).</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Hết hạn reflog</div><div class="lz-d">Các dòng cũ hơn 90 ngày (30 ngày với những dòng không với tới được) bị bỏ đi.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Xoá đối tượng không với tới được</div><div class="lz-d">Đối tượng mà không ref nào và không dòng reflog nào với tới được sẽ bị gỡ — <strong>ĐÂY</strong> mới là lúc một commit "đã xoá" thật sự biến mất (bài 4.4).</div></div>
</div>
<pre><code>git gc                 <span class="tok-comment"># bình thường; Git cũng tự chạy cái này</span>
git gc --aggressive     <span class="tok-comment"># tính lại delta từ đầu — chậm, thỉnh thoảng đáng làm</span>
git gc --prune=now      <span class="tok-comment"># XOÁ ngay các đối tượng không với tới được, không có thời gian ân hạn</span></code></pre>
<div class="callout danger"><code>--prune=now</code> gỡ bỏ lưới an toàn của bài 4.4. Mọi thứ không với tới được từ một ref hay một dòng reflog đều mất vĩnh viễn — kể cả những commit bạn đang định cứu. Đừng bao giờ chạy nó trong lúc đang cố cứu thứ gì đó; như thế là làm ngược hoàn toàn.</div>
<div class="callout warn"><strong>Reflog vẫn che chắn được gì — đã chạy thử, không đoán.</strong> Trên một bản sao của kho thử, <code>git reset --hard HEAD~1</code> rồi <code>git gc --prune=now</code> KHÔNG xoá commit bị bỏ rơi: <code>git cat-file -t 4098f32</code> vẫn trả lời <code>commit</code>, vì dòng <code>HEAD@{1}</code> trong reflog còn nhắc tên nó. Phải sau <code>git reflog expire --expire=now --all</code> thì lần <code>gc --prune=now</code> thứ hai mới biến nó thành <code>fatal: Not a valid object name</code>. Vậy thứ <code>--prune=now</code> thật sự huỷ là những đối tượng KHÔNG dòng reflog nào nhắc tới: một stash đã drop, một blob bạn từng add rồi thay bằng bản khác, những commit mà dòng reflog đã hết hạn — đúng những thứ người ta dùng <code>git fsck --lost-found</code> (Chương 13) để tìm lại. Các hướng dẫn xoá bí mật khỏi lịch sử bảo bạn chạy <code>reflog expire</code> trước cũng vì lẽ đó.</div>

<h3>Đo một kho mã</h3>
<pre><code>git count-objects -vH</code></pre>
<div class="out">count: 143
size: 1.21 MiB
in-pack: 24817
packs: 1
size-pack: 38.42 MiB
prune-packable: 0
garbage: 0</div>
<div class="kv-grid">
  <div class="kv"><span class="k">count / size</span><span class="v">Đối tượng rời — được ghi ra kể từ lần gc gần nhất.</span></div>
  <div class="kv"><span class="k">in-pack / size-pack</span><span class="v">Đối tượng nằm trong packfile. Thường là gần như tất cả.</span></div>
  <div class="kv"><span class="k">garbage</span><span class="v">Những file Git không nhận ra trong <code>objects/</code>. Khác 0 ở đây gợi ý có thứ gì đó đã ghi vào <code>.git/</code> mà lẽ ra không nên (cái bẫy ở bài 9.1).</span></div>
</div>

<h3>Tìm ra thứ làm nó phình to</h3>
<pre><code><span class="tok-comment"># Mười đối tượng lớn nhất trong lịch sử, kèm tên đường dẫn:</span>
git rev-list --objects --all \\
  | git cat-file --batch-check=<span class="tok-string">'%(objecttype) %(objectname) %(objectsize) %(rest)'</span> \\
  | awk <span class="tok-string">'\$1=="blob"'</span> | sort -k3 -rn | head -10</code></pre>
<div class="out">blob 5f7a9c2b… 419430400 assets/demo-video.mp4
blob a7c2f91d… 52428800 public/textures/city.psd
blob 9e2d4b70… 8388608 package-lock.json</div>
<p>Một video 400 MB bị xoá từ hai năm trước vẫn nằm trong mọi bản clone mãi mãi, vì lịch sử là bất biến. Gỡ nó ra nghĩa là viết lại lịch sử (bài 8.3) — <code>git filter-repo --strip-blobs-bigger-than 10M</code> — kèm toàn bộ chi phí phối hợp mà điều đó kéo theo.</p>

<h3>Làm cho việc clone rẻ hơn mà không cần viết lại</h3>
<pre><code>git clone --depth 1 &lt;url&gt;                     <span class="tok-comment"># nông: chỉ commit mới nhất</span>
git clone --filter=blob:none &lt;url&gt;            <span class="tok-comment"># lấy nội dung file khi cần</span>
git clone --filter=blob:limit=1m &lt;url&gt;        <span class="tok-comment"># bỏ qua blob trên 1 MB cho tới khi cần</span>
git clone --single-branch --branch main &lt;url&gt; <span class="tok-comment"># chỉ một nhánh</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">--depth 1</span><span class="v">Bản clone kinh điển cho CI. Hoàn toàn không có lịch sử, nên <code>git log</code>, <code>blame</code> và <code>describe</code> không chạy — thứ làm hỏng việc đóng dấu phiên bản (bài 7.2) nếu bạn dựa vào nó.</span></div>
  <div class="kv"><span class="k">--filter=blob:none</span><span class="v">Một <em>partial clone</em>: đầy đủ lịch sử commit và tree, nội dung file được lấy về từ từ qua mạng. Các lệnh lịch sử chạy được; lần <code>checkout</code> đầu tiên một commit cũ thì chậm hơn.</span></div>
</div>
<pre><code>git fetch --unshallow          <span class="tok-comment"># biến một bản clone nông thành đầy đủ</span></code></pre>

<h3>Bảo trì, theo cách đời mới</h3>
<pre><code>git maintenance start           <span class="tok-comment"># đăng ký bảo trì nền theo lịch</span>
git maintenance run --task=gc</code></pre>
<p>Trên một kho mã lớn, cách này hơn hẳn việc ngồi chờ <code>gc</code> tự động kích hoạt giữa một lệnh khác. Nó cũng bật file commit-graph, thứ làm cho <code>git log --graph</code> và các phép tính tổ tiên chung nhanh lên rõ rệt trên những kho có hàng chục nghìn commit.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Làm trên một <strong>BẢN SAO</strong>, vì bước cuối xoá đối tượng thật: <code>cp -R thu-git thu-git-gc &amp;&amp; cd thu-git-gc</code> (trên Windows, chép thư mục bằng Explorer hoặc gõ đúng lệnh này trong Git Bash).</li><li>Tạo một file 40 KB rồi sửa nó năm lần, mỗi lần một commit (vòng lặp này chạy được trên zsh, bash và Git Bash): <code>for i in $(seq 1 1000); do echo "Dong $i: ghi chu bai giang Git, phan $((i % 17))"; done &gt; ghi-chu.md</code>, commit, rồi năm lần <code>echo "Ban sua lan N" &gt;&gt; ghi-chu.md &amp;&amp; git commit -qam "docs: sua lan N"</code>.</li><li><code>git count-objects -vH</code>, rồi <code>git gc</code>, rồi <code>git count-objects -vH</code> lần nữa. So <code>size</code> lúc trước với <code>size-pack</code> lúc sau.</li><li><code>git verify-pack -v .git/objects/pack/pack-*.idx | tail -3</code> và tìm dòng "chain length = 1". Phiên bản nào của <code>ghi-chu.md</code> được lưu nguyên?</li><li>Ghi lại mã băm commit cuối, <code>git reset --hard HEAD~1</code>, <code>git gc --prune=now</code>, rồi <code>git cat-file -t &lt;mã&gt;</code>. Sau đó <code>git reflog expire --expire=now --all</code>, <code>git gc --prune=now</code> và hỏi lại. Làm xong thì xoá bản sao.</li></ol>
<pre><code class="language-bash">git count-objects -vH | grep -E <span class="tok-string">'^(count|size-pack)'</span>   <span class="tok-comment"># trước gc: 29 đối tượng rời, 25.239 byte dữ liệu thật</span>
count: 29
size-pack: 0 bytes
git gc &amp;&amp; git count-objects -vH | grep -E <span class="tok-string">'^(count|size-pack)'</span>
count: 0
size-pack: 8.08 KiB
git cat-file -t 4098f32      <span class="tok-comment"># sau reset --hard HEAD~1 và gc --prune=now</span>
commit
git cat-file -t 4098f32      <span class="tok-comment"># sau reflog expire và gc --prune=now lần hai</span>
fatal: Not a valid object name 4098f32</code></pre>
<p><strong>Đạt khi:</strong> <code>size-pack</code> chỉ bằng một phần nhỏ kích thước lúc còn rời, bạn đã thấy ít nhất một dòng có độ sâu <code>1</code> trong <code>verify-pack</code>, và đã nhìn cùng một mã băm trả lời <code>commit</code> rồi <code>fatal: Not a valid object name</code> — và giải thích được rằng reflog là thứ duy nhất đứng giữa hai kết quả đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Packfile</span><span class="v">Tệp gói — một file <code>.pack</code> chứa nhiều đối tượng, kèm file <code>.idx</code> ghi mỗi mã băm nằm ở byte thứ mấy.</span></div>
  <div class="kv"><span class="k">Delta</span><span class="v">Phần chênh lệch — đối tượng lưu dưới dạng "lấy đối tượng gốc X rồi áp các thay đổi này". Git giữ bản mới nhất nguyên vẹn, bản cũ thành delta.</span></div>
  <div class="kv"><span class="k">git gc</span><span class="v">Dọn rác (garbage collection) — gói đối tượng và ref, cho các dòng reflog cũ hết hạn, tỉa đối tượng không với tới được đã quá thời gian ân hạn.</span></div>
  <div class="kv"><span class="k">Unreachable object</span><span class="v">Đối tượng không với tới được — không ref, không dòng index, không dòng reflog nào dẫn tới. Loại DUY NHẤT gc từng xoá.</span></div>
  <div class="kv"><span class="k">Prune</span><span class="v">Tỉa bỏ — xoá đối tượng không với tới được. <code>--prune=now</code> bỏ luôn thời gian ân hạn hai tuần mặc định.</span></div>
  <div class="kv"><span class="k">Shallow vs partial clone</span><span class="v">Clone nông vs clone một phần — <code>--depth 1</code> bỏ lịch sử; <code>--filter=blob:none</code> giữ đủ lịch sử, nội dung file tải về khi cần.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Đối tượng mới ra đời ở dạng rời, mỗi cái một file; <code>git gc</code> gói chúng vào một packfile.</li><li>Trong pack, các đối tượng giống nhau lưu dưới dạng delta — mô hình vẫn là ảnh chụp, còn chỗ chứa thì nhỏ lại.</li><li>Git giữ bản mới nhất nguyên vẹn và biến bản cũ thành delta, vì bản mới nhất được đọc nhiều nhất.</li><li>Một đối tượng chỉ biến mất khi không còn gì với tới nó — không ref, không dòng index, không dòng reflog — và gc tỉa nó đi.</li><li>Kích thước kho do mọi thứ TỪNG được commit quyết định; <code>--filter=blob:none</code> và <code>--depth</code> làm clone rẻ hơn mà không phải viết lại lịch sử.</li></ul>

<a class="link-card" href="https://git-scm.com/book/en/v2/Git-Internals-Packfiles" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Pro Git 10.4 (tiếng Việt) — Packfile</span><span class="lc-sub">Cách chọn đối tượng gốc cho delta, và đọc output của verify-pack.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/partial-clone" target="_blank" rel="noopener">
  <span class="lc-ico">🪶</span>
  <span class="lc-body"><span class="lc-title">Partial clone — giải thích các tuỳ chọn --filter</span><span class="lc-sub">Khi nào partial clone hơn shallow clone, và cái gì vẫn chậm.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dùng <code>--depth 1</code> trong CI rồi thắc mắc vì sao <code>git describe</code> không trả về gì, vì sao <code>git log v1.4.0..HEAD</code> trống trơn, và vì sao một phép kiểm tổ tiên chung thất bại. Một bản clone nông không có lịch sử để tìm. Hoặc fetch những tag bạn cần (<code>git fetch --depth=1 origin +refs/tags/*:refs/tags/*</code>), hoặc dùng <code>--filter=blob:none</code>, thứ giữ nguyên cả đồ thị commit trong khi bỏ qua nội dung file.</div>
<p class="note-ct"><strong>Điều cần mang đi:</strong> kích thước một kho mã được quyết định bởi thứ TỪNG được commit, không phải bởi thứ hôm nay còn trong đó. Xoá một file lớn làm cây làm việc nhỏ đi và bản clone thì vẫn to y như cũ. Đó là lý lẽ thực dụng cho kỷ luật <code>.gitignore</code> (bài 1.5) và cho Git LFS với các tài sản nhị phân — cả hai đều rẻ khi làm trước và đắt khi lắp vào sau.</p>
</div>
`,
    },

    /* ─────────────────────────── 9.4 Quiz ─────────────────────────── */
    {
      title: '9.4 — Chapter 9 quiz|||9.4 — Kiểm tra Chương 9',
      slug: 'git-9-4-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống thật về ruột gan của Git: nhánh "mất" vì packed-refs, HEAD lìa cành, xung đột trong index, đổi tên file và blob, số đối tượng một commit tạo ra, mã băm, commit dựng bằng tay, tag nhẹ và tag có chú thích, dòng delta trong verify-pack, và gc --prune=now với reflog.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations where knowing what is really inside <code>.git/</code> decides the answer — most of them are things that go wrong in a team repository and look scarier than they are. Read every explanation after submitting, especially for the ones you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say what <code>.git/HEAD</code> and <code>.git/refs/heads/main</code> contain, and where a branch goes after <code>git gc</code>.</li>
<li>I can walk from a commit to the contents of a file with <code>git cat-file -p</code>, one level at a time.</li>
<li>I can predict how many new objects a commit creates, and why unchanged files cost nothing.</li>
<li>I have built a commit with <code>hash-object</code>, <code>update-index</code>, <code>write-tree</code>, <code>commit-tree</code> and <code>update-ref</code>.</li>
<li>I can read a <code>git verify-pack -v</code> line and tell a whole object from a delta.</li>
<li>I know which objects <code>git gc --prune=now</code> can really delete — and what the reflog still protects.</li>
</ul>
${slide('git-09', 17, 'Bảng tra nhanh Chương 9')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống mà biết thật sự có gì trong <code>.git/</code> sẽ quyết định câu trả lời — phần lớn là chuyện trục trặc trong kho mã của nhóm, trông đáng sợ hơn thực tế. Đọc mọi phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được <code>.git/HEAD</code> và <code>.git/refs/heads/main</code> chứa gì, và nhánh đi đâu sau <code>git gc</code>.</li>
<li>Tôi lần được từ một commit xuống nội dung một file bằng <code>git cat-file -p</code>, từng tầng một.</li>
<li>Tôi đoán được một commit tạo ra bao nhiêu đối tượng mới, và vì sao file không đổi không tốn gì.</li>
<li>Tôi đã tự dựng một commit bằng <code>hash-object</code>, <code>update-index</code>, <code>write-tree</code>, <code>commit-tree</code> và <code>update-ref</code>.</li>
<li>Tôi đọc được một dòng <code>git verify-pack -v</code> và phân biệt đối tượng lưu nguyên với delta.</li>
<li>Tôi biết <code>git gc --prune=now</code> thật sự xoá được những đối tượng nào — và reflog vẫn che chắn được gì.</li>
</ul>
${slide('git-09', 17, 'Bảng tra nhanh Chương 9')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'After someone ran git gc, a teammate in your SWP391 group panics: "cat .git/refs/heads/main says No such file — our branch is gone!" What is going on?|||Sau khi ai đó chạy git gc, một bạn trong nhóm SWP391 hoảng lên: "cat .git/refs/heads/main báo No such file — nhánh mất rồi!" Chuyện gì đang xảy ra?',
            options: [
              'The ref was deleted locally; git fetch origin will recreate it|||Ref đã bị xoá ở máy; git fetch origin sẽ tạo lại nó',
              'The repository is corrupt and has to be cloned again|||Kho mã bị hỏng, phải clone lại',
              'gc moved the ref into .git/packed-refs; git rev-parse main still prints its hash|||gc đã chuyển ref vào .git/packed-refs; git rev-parse main vẫn in ra mã băm của nó',
              'The branch now lives only in the reflog; restore it with git reflog|||Nhánh giờ chỉ còn trong reflog; khôi phục bằng git reflog',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: git gc packs individual ref files into the single file .git/packed-refs — in our test repository refs/heads/main vanished from the folder and reappeared as a line in packed-refs. git rev-parse main (and every normal command) reads both places, so nothing is lost. git fetch sounds sensible but only updates origin/main, not your local branch, and nothing here calls for re-cloning or the reflog.|||VI: git gc gói các file ref riêng lẻ vào một file duy nhất .git/packed-refs — trong kho thử, refs/heads/main biến khỏi thư mục và xuất hiện lại thành một dòng trong packed-refs. git rev-parse main (và mọi lệnh thường) đọc cả hai chỗ, nên chẳng mất gì. git fetch nghe hợp lý nhưng nó chỉ cập nhật origin/main chứ không đụng nhánh cục bộ của bạn, còn ở đây không có gì cần clone lại hay lục reflog.',
          },
          {
            question: 'cat .git/HEAD prints 6a952eb80d5ac9cd0ab8757ac9b6dcb382f7fa5b instead of "ref: refs/heads/main". What does that tell you?|||cat .git/HEAD in ra 6a952eb80d5ac9cd0ab8757ac9b6dcb382f7fa5b thay vì "ref: refs/heads/main". Điều đó cho bạn biết gì?',
            options: [
              'HEAD is detached: new commits belong to no branch, so create one (git switch -c) before switching away|||HEAD đang lìa cành: commit mới không thuộc nhánh nào, nên tạo nhánh (git switch -c) trước khi chuyển đi',
              'The HEAD file is corrupt and must be edited back by hand|||File HEAD bị hỏng và phải sửa tay lại',
              'You are standing on the remote branch origin/main|||Bạn đang đứng trên nhánh remote origin/main',
              'A merge is in progress and has not been committed yet|||Một lần merge đang dở và chưa được commit',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: A detached HEAD is exactly this: .git/HEAD holds a bare commit hash instead of a branch name (we saw it after git switch --detach v1.0). It is a normal state, not damage — but commits made now are reachable only through HEAD and the reflog. Editing .git/HEAD by hand is the trap from 9.1; a merge in progress shows up as MERGE_HEAD, not as a change to HEAD.|||VI: HEAD lìa cành chính là thế này: .git/HEAD giữ một mã băm commit trần thay vì tên nhánh (kho thử cho thấy đúng như vậy sau git switch --detach v1.0). Đó là trạng thái bình thường, không phải hỏng — nhưng commit tạo lúc này chỉ với tới được qua HEAD và reflog. Sửa tay .git/HEAD là đúng cái bẫy ở bài 9.1; còn merge đang dở thì hiện ra thành MERGE_HEAD, không làm đổi HEAD.',
          },
          {
            question: 'In the middle of a merge conflict, git ls-files --stage login.js prints three lines whose stage numbers are 1, 2 and 3. What are they?|||Giữa một lần xung đột merge, git ls-files --stage login.js in ra ba dòng với số giai đoạn 1, 2 và 3. Chúng là gì?',
            options: [
              'The three most recent commits that touched login.js|||Ba commit gần nhất từng chạm vào login.js',
              'Three file modes: normal, executable and symlink|||Ba chế độ file: thường, chạy được và liên kết mềm',
              'The three conflicting hunks inside the file|||Ba khúc xung đột bên trong file',
              'Three blobs in the index: the common base (1), ours (2) and theirs (3)|||Ba blob trong index: bản gốc chung (1), của ta (2) và của họ (3)',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The number after the hash is the merge stage. Normally it is 0; during a conflict the index holds up to three versions of the same path — base, ours, theirs — each as its own blob, which is literally how Git stores a conflict. "Three hunks" is tempting because conflicts appear as hunks in the file, but hunks live in the working-tree file with <<<<<<< markers, not as index stages.|||VI: Con số sau mã băm là giai đoạn hợp nhất. Bình thường là 0; khi xung đột, index giữ tới ba phiên bản của cùng một đường dẫn — gốc, của ta, của họ — mỗi bản là một blob riêng, và đó chính là cách Git lưu một xung đột. "Ba khúc" hấp dẫn vì xung đột hiện ra thành từng khúc trong file, nhưng các khúc đó nằm trong file ở thư mục làm việc với dấu <<<<<<<, không phải các giai đoạn trong index.',
          },
          {
            question: 'You rename assets/intro.mp4 (10 MB) to assets/gioi-thieu.mp4 without changing a byte and commit. How many new BLOB objects does that commit add?|||Bạn đổi tên assets/intro.mp4 (10 MB) thành assets/gioi-thieu.mp4 mà không đổi một byte nào rồi commit. Commit đó thêm bao nhiêu đối tượng BLOB mới?',
            options: [
              'One — a new 10 MB blob under the new name|||Một — một blob 10 MB mới mang tên mới',
              'None — only new trees and the commit; the tree names the same blob under the new name|||Không cái nào — chỉ có tree mới và commit; tree gọi cùng blob cũ bằng tên mới',
              'Two — one to delete the old file, one for the new file|||Hai — một để xoá file cũ, một cho file mới',
              'One small delta blob that records the rename|||Một blob delta nhỏ ghi lại việc đổi tên',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: A blob has no name — its hash is computed from "blob <size>\\0" plus the bytes, so identical bytes give the identical blob. The rename writes a new assets/ tree, a new root tree and a commit, all pointing at the existing blob. The delta option is tempting, but deltas are a storage detail inside packfiles, and Git never records renames at all — it infers them later.|||VI: Blob không có tên — mã băm của nó tính từ "blob <kích thước>\\0" cộng các byte, nên byte giống hệt thì ra đúng blob cũ. Lần đổi tên chỉ ghi một tree assets/ mới, một tree gốc mới và một commit, tất cả trỏ vào blob đã có. Phương án delta hấp dẫn, nhưng delta chỉ là chi tiết lưu trữ bên trong packfile, và Git không hề ghi lại việc đổi tên — nó suy luận ra sau.',
          },
          {
            question: 'A repository contains README.md, src/app.js and src/auth.js. The next commit edits only src/app.js. How many NEW objects does it write?|||Một kho có README.md, src/app.js và src/auth.js. Commit tiếp theo chỉ sửa src/app.js. Nó ghi bao nhiêu đối tượng MỚI?',
            options: [
              '1 — just the new blob of app.js|||1 — chỉ blob mới của app.js',
              '2 — the new blob and the commit|||2 — blob mới và commit',
              '4 — blob app.js, tree src/, root tree and commit|||4 — blob app.js, tree src/, tree gốc và commit',
              '5 — new blobs for all three files, one tree and the commit|||5 — blob mới cho cả ba file, một tree và commit',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Every object on the path from the changed file up to the commit gets a new hash: the blob, the src/ tree that lists it, the root tree that lists src/, and the commit that names the root tree. In our test repository that is exactly what happened (7728117, 8230aab, 713039b, 6a952eb) while README.md and auth.js kept their old blobs. "2" forgets that trees are objects too; "5" forgets that unchanged content is shared.|||VI: Mọi đối tượng trên đường đi từ file bị sửa lên tới commit đều nhận mã băm mới: blob, tree src/ liệt kê nó, tree gốc liệt kê src/, và commit gọi tên tree gốc. Kho thử cho ra đúng như vậy (7728117, 8230aab, 713039b, 6a952eb) trong khi README.md và auth.js giữ nguyên blob cũ. "2" quên rằng tree cũng là đối tượng; "5" quên rằng nội dung không đổi thì được dùng chung.',
          },
          {
            question: 'Two teammates on different laptops (one Mac, one Windows, different Git versions) run git hash-object README.md on byte-identical files. What do they get?|||Hai bạn cùng nhóm trên hai laptop khác nhau (một Mac, một Windows, khác phiên bản Git) chạy git hash-object README.md trên hai file giống hệt từng byte. Họ nhận được gì?',
            options: [
              'The same hash — it is SHA-1 of "blob <size>\\0" plus the content, with no name, time or machine in it|||Cùng một mã băm — đó là SHA-1 của "blob <kích thước>\\0" cộng nội dung, không có tên, thời gian hay máy nào trong đó',
              'Different hashes, because each run mixes in the current time|||Mã băm khác nhau, vì mỗi lần chạy trộn thêm thời điểm hiện tại',
              'Different hashes, because the file path is part of the hash|||Mã băm khác nhau, vì đường dẫn file là một phần của mã băm',
              'The same hash only if both use the same Git version|||Chỉ cùng mã băm nếu cả hai dùng cùng phiên bản Git',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: A blob hash depends only on its type, size and bytes — printf "blob 33\\0…" | shasum reproduced 5c661fc exactly. That is why clones on every machine agree. Time is tempting because COMMIT hashes do include author and timestamp, which is why your hand-made commit hash differs from ours while the blob and tree hashes match. (One real trap: if Windows converts line endings to CRLF, the bytes are no longer identical.)|||VI: Mã băm blob chỉ phụ thuộc vào loại, kích thước và các byte — printf "blob 33\\0…" | shasum tính lại đúng 5c661fc. Vì thế mọi bản clone trên mọi máy đều khớp nhau. Phương án thời gian hấp dẫn vì mã băm COMMIT thì có chứa tác giả và thời điểm, nên commit bạn dựng bằng tay mang mã khác của chúng tôi trong khi blob và tree thì trùng. (Một cái bẫy thật: nếu Windows đổi xuống dòng sang CRLF thì các byte đã không còn giống hệt.)',
          },
          {
            question: 'You ran hash-object -w, update-index, write-tree and commit-tree, and commit-tree printed a hash — but git log shows no new commit. What is missing?|||Bạn đã chạy hash-object -w, update-index, write-tree và commit-tree, và commit-tree đã in ra một mã băm — nhưng git log không hiện commit mới nào. Còn thiếu gì?',
            options: [
              'commit-tree failed silently; run it again with --verbose|||commit-tree đã thất bại âm thầm; chạy lại với --verbose',
              'You still have to git add the file before the commit counts|||Bạn vẫn phải git add file thì commit mới được tính',
              'The objects are loose, and git log only reads packfiles until git gc runs|||Các đối tượng đang rời, và git log chỉ đọc packfile cho tới khi chạy git gc',
              'No ref points at it yet: git update-ref refs/heads/<branch> <hash> moves the branch onto it|||Chưa có ref nào trỏ vào nó: git update-ref refs/heads/<nhánh> <mã băm> dời nhánh lên đó',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The commit exists in the object database the moment commit-tree prints its hash, but git log starts from HEAD, and HEAD still names a branch that points at the old commit. Moving the branch is the fifth step — "this is what committing means". git add is tempting, but update-index already did its job; git log reads loose objects perfectly well.|||VI: Commit đã có trong kho đối tượng ngay khi commit-tree in ra mã băm, nhưng git log bắt đầu từ HEAD, mà HEAD vẫn gọi tên một nhánh đang trỏ vào commit cũ. Dời nhánh là bước thứ năm — "đó mới là ý nghĩa của việc commit". git add hấp dẫn, nhưng update-index đã làm xong đúng việc đó; còn git log đọc đối tượng rời hoàn toàn bình thường.',
          },
          {
            question: 'git cat-file -t v1.0 prints "tag", but git cat-file -t v1.1 prints "commit". What is the difference between the two tags?|||git cat-file -t v1.0 in ra "tag", còn git cat-file -t v1.1 in ra "commit". Hai tag này khác nhau thế nào?',
            options: [
              'v1.1 is corrupt: every tag should be of type tag|||v1.1 bị hỏng: tag nào cũng phải có loại tag',
              'v1.0 is GPG-signed and v1.1 is not|||v1.0 có chữ ký GPG còn v1.1 thì không',
              'v1.1 is lightweight (the ref holds the commit hash directly); v1.0 is annotated and has its own tag object|||v1.1 là tag nhẹ (ref giữ thẳng mã băm commit); v1.0 là tag có chú thích và có đối tượng tag riêng',
              'v1.1 points at a merge commit, v1.0 at an ordinary one|||v1.1 trỏ vào một commit merge, v1.0 trỏ vào commit thường',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: An annotated tag (git tag -a) writes a tag object — tagger, date, message, and "object <commit>" — and the ref points at that object. A lightweight tag is only a ref file containing the commit hash, so cat-file resolves straight to a commit (we checked with v1.0-nhe). Signing is tempting because only annotated tags can carry a signature, but an unsigned annotated tag is still type tag.|||VI: Tag có chú thích (git tag -a) ghi ra một đối tượng tag — người gắn, ngày, lời nhắn và dòng "object <commit>" — và ref trỏ vào đối tượng đó. Tag nhẹ chỉ là một file ref chứa mã băm commit, nên cat-file đi thẳng tới một commit (đã kiểm bằng v1.0-nhe). Phương án chữ ký hấp dẫn vì chỉ tag có chú thích mới mang được chữ ký, nhưng một tag có chú thích không ký vẫn có loại tag.',
          },
          {
            question: 'In git verify-pack -v you see: "7563b513… blob 9 21 6168 1 ce4edba7…". What does this line say?|||Trong git verify-pack -v bạn thấy: "7563b513… blob 9 21 6168 1 ce4edba7…". Dòng này nói gì?',
            options: [
              'The blob is damaged — a real file version cannot be only 9 bytes|||Blob đã hỏng — một phiên bản file thật không thể chỉ có 9 byte',
              'It is stored as a 9-byte delta (21 bytes in the pack) on top of ce4edba, depth 1; Git rebuilds the full file when you read it|||Nó được lưu dưới dạng delta 9 byte (21 byte trong pack) dựa trên ce4edba, độ sâu 1; Git dựng lại file đầy đủ khi bạn đọc',
              'In that commit the file was cut down to 9 bytes|||Trong commit đó file bị cắt còn 9 byte',
              'The blob is a Git LFS pointer to a file stored elsewhere|||Blob là con trỏ Git LFS tới một file lưu ở chỗ khác',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: The trailing "1 ce4edba…" means depth 1 and delta base ce4edba. In our test ghi-chu.md was 40,374 bytes; the newest version (ce4edba) was stored whole in 3,796 compressed bytes and each older version as a delta of about 20 bytes in the pack. "Damaged" and "truncated" are tempting if you read the 9 as the file size — git cat-file -s 7563b51 still reports the full size. An LFS pointer is a normal small blob with no base column.|||VI: Phần đuôi "1 ce4edba…" nghĩa là độ sâu 1 và gốc delta là ce4edba. Trong kho thử, ghi-chu.md nặng 40.374 byte; bản mới nhất (ce4edba) được lưu nguyên trong 3.796 byte nén, còn mỗi bản cũ là một delta khoảng 20 byte trong pack. "Hỏng" và "bị cắt" hấp dẫn nếu bạn đọc số 9 là kích thước file — git cat-file -s 7563b51 vẫn báo đủ kích thước. Con trỏ LFS là một blob nhỏ bình thường, không có cột gốc delta.',
          },
          {
            question: 'You ran git reset --hard HEAD~3 by mistake. Before you can react, a teammate says "clean up first" and you run git gc --prune=now. Can you still get the three commits back?|||Bạn lỡ chạy git reset --hard HEAD~3. Chưa kịp làm gì thì một bạn bảo "dọn dẹp trước đã" và bạn chạy git gc --prune=now. Còn lấy lại được ba commit đó không?',
            options: [
              'Yes — the reflog (HEAD@{1}) still names them, so gc keeps them: git reset --hard HEAD@{1}. Just do not run git reflog expire|||Còn — reflog (HEAD@{1}) vẫn nhắc tên chúng nên gc giữ lại: git reset --hard HEAD@{1}. Chỉ đừng chạy git reflog expire',
              'No — --prune=now deletes every commit that no branch points at, immediately|||Không — --prune=now xoá ngay mọi commit không có nhánh nào trỏ tới',
              'Only if the commits had already been pushed to GitHub|||Chỉ khi các commit đó đã được push lên GitHub',
              'Only by searching the object files with git fsck --lost-found|||Chỉ bằng cách lục các file đối tượng với git fsck --lost-found',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: gc only prunes objects that nothing reaches, and a reflog line counts. We tested it: after reset --hard HEAD~1 and gc --prune=now, git cat-file -t still answered "commit"; only after git reflog expire --expire=now --all did a second gc make it "Not a valid object name". Option B is the tempting half-truth — true for objects NO reflog line names (a dropped stash, an expired entry). fsck --lost-found is for those dangling objects, not needed here.|||VI: gc chỉ tỉa đối tượng không gì với tới được, và một dòng reflog cũng tính. Đã thử thật: sau reset --hard HEAD~1 và gc --prune=now, git cat-file -t vẫn trả lời "commit"; phải sau git reflog expire --expire=now --all thì lần gc thứ hai mới biến nó thành "Not a valid object name". Phương án B là nửa sự thật hấp dẫn — đúng với đối tượng KHÔNG dòng reflog nào nhắc tới (một stash đã drop, một dòng đã hết hạn). fsck --lost-found dành cho những đối tượng lơ lửng đó, ở đây không cần.',
          },
        ],
      },
    },
  ],
};
