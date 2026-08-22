/**
 * Git & GitHub — Chương 9: Bên dưới nắp capo — kho đối tượng.
 * Tham quan .git/ · bốn loại đối tượng (blob/tree/commit/tag) dựng bằng tay ·
 * ref, HEAD, packed-refs, file index · packfile, gc, vì sao clone lại nhỏ · quiz.
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 9 — Under the hood: the object database|||Chương 9 — Bên dưới nắp capo: kho đối tượng',
  description: 'Mở .git/ ra và đọc bằng chính mắt bạn. Bốn loại đối tượng của Git, cách dựng một commit bằng tay mà không dùng git commit, ref và index thật ra là gì, và vì sao một kho mã mười năm lịch sử lại clone về chỉ vài chục megabyte. Học xong chương này mọi lệnh ở các chương trước sẽ hết bí ẩn.',
  lessons: [
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
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">objects/</span><span class="lz-v">The content-addressed database. Every version of every file, every directory listing, every commit you have ever made. This is the repository.</span></div>
  <div class="lz-layer"><span class="lz-k">refs/</span><span class="lz-v">Human-readable names pointing into it: branches under <code>refs/heads/</code>, tags under <code>refs/tags/</code>, remote-tracking under <code>refs/remotes/</code>.</span></div>
</div>
<p>Objects plus refs <em>is</em> Git. Everything else in that listing is convenience, configuration or cache.</p>

<h3>HEAD — where you are</h3>
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
<pre><code>ls -la .git/index
git ls-files --stage | head -3</code></pre>
<div class="out">-rw-r--r-- 1 an an 8394 Aug 21 14:20 .git/index

100644 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d 0	src/app.ts
100644 9e2d4b70c1a3f5e7b9d0c2a4f6e8b0d2c4a6f8e0 0	src/auth.ts
100755 a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8	0	deploy.sh</div>
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
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">objects/</span><span class="lz-v">Cơ sở dữ liệu định danh theo nội dung. Mọi phiên bản của mọi file, mọi danh sách thư mục, mọi commit bạn từng tạo. ĐÂY chính là kho mã.</span></div>
  <div class="lz-layer"><span class="lz-k">refs/</span><span class="lz-v">Những cái tên người đọc được, trỏ vào đó: nhánh dưới <code>refs/heads/</code>, tag dưới <code>refs/tags/</code>, nhánh theo dõi remote dưới <code>refs/remotes/</code>.</span></div>
</div>
<p>Đối tượng cộng ref <em>CHÍNH LÀ</em> Git. Mọi thứ khác trong danh sách kia là tiện lợi, cấu hình hoặc bộ nhớ đệm.</p>

<h3>HEAD — bạn đang ở đâu</h3>
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
<pre><code>ls -la .git/index
git ls-files --stage | head -3</code></pre>
<div class="out">-rw-r--r-- 1 an an 8394 Aug 21 14:20 .git/index

100644 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d 0	src/app.ts
100644 9e2d4b70c1a3f5e7b9d0c2a4f6e8b0d2c4a6f8e0 0	src/auth.ts
100755 a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8	0	deploy.sh</div>
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

<a class="link-card" href="https://git-scm.com/book/vi/v2/Git-N%E1%BB%99i-T%E1%BA%A1i-Plumbing-v%C3%A0-Porcelain" target="_blank" rel="noopener">
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
<pre><code>git cat-file -p HEAD</code></pre>
<div class="out">tree 8b7c4a2e1f9d0c3b5a7e9f1d3c5b7a9e1f3d5c7b
parent 9e2d4b70c1a3f5e7b9d0c2a4f6e8b0d2c4a6f8e0
author Nguyen Van An &lt;an@example.com&gt; 1755820800 +0700
committer Nguyen Van An &lt;an@example.com&gt; 1755820800 +0700

feat(auth): add refresh token rotation</div>
<pre><code>git cat-file -p 8b7c4a2</code></pre>
<div class="out">100644 blob a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8	package.json
040000 tree 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d	src
100644 blob 5f7a9c2b8d0e2f4a6c8e0b2d4f6a8c0e2b4d6f8	README.md</div>
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
<div class="callout ok">A blob does not know its own name. The name lives in the <strong>tree</strong> that points at it. Rename a file without changing its content and Git writes a new tree and reuses the identical blob — which is why renaming a 10 MB file costs almost nothing, and why <code>git log --follow</code> (2.3) has to <em>infer</em> renames rather than read them: Git never recorded one.</div>

<h3>Building a commit by hand</h3>
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
<div class="out">a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e</div>
<pre><code><span class="tok-comment"># 5. Point a branch at it. THIS is what "committing" means.</span>
git update-ref refs/heads/main a7c2f91
git log --oneline</code></pre>
<div class="out">a7c2f91 first commit, made by hand</div>
<div class="callout ok">A real commit, in a real repository, built from five plumbing commands. <code>git commit</code> is those five steps plus conveniences: reading your config for the author, opening an editor, running hooks, writing the reflog. Nothing magical was removed.</div>

<h3>The header that goes into the hash</h3>
<pre><code><span class="tok-comment"># Git hashes "&lt;type&gt; &lt;size&gt;\\0&lt;content&gt;", not the content alone:</span>
printf <span class="tok-string">'blob 12\\0hello world\\n'</span> | sha1sum</code></pre>
<div class="out">3b18e512dba79e4c8300dd08aeb37f8e728b8dad  -</div>
<p>The same hash <code>git hash-object</code> produced. The type-and-size prefix is why a blob and a commit with identical bytes get different hashes, and why you can ask <code>git cat-file -t</code> for an object's type without a lookup table.</p>

<h3>Inspecting the whole database</h3>
<pre><code>git cat-file --batch-all-objects --batch-check | head -8</code></pre>
<div class="out">3b18e512dba79e4c8300dd08aeb37f8e728b8dad blob 12
68aba62e560c0ebc3396e8ae9335232cd93a3f60 tree 37
a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e commit 168</div>
<pre><code><span class="tok-comment"># Every object, sorted by size — how you find the 400 MB video (8.3):</span>
git cat-file --batch-all-objects --batch-check=<span class="tok-string">'%(objectsize) %(objectname) %(objecttype)'</span> \\
  | sort -rn | head -5</code></pre>

<h3>Annotated tags are objects too</h3>
<pre><code>git tag -a v1.0 -m <span class="tok-string">"first release"</span>
git cat-file -t v1.0
git cat-file -p v1.0</code></pre>
<div class="out">tag

object a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e
type commit
tag v1.0
tagger Nguyen Van An &lt;an@example.com&gt; 1755820800 +0700

first release</div>
<p>A lightweight tag has no object at all — <code>refs/tags/v1.0</code> holds the commit hash directly. That is the difference from 7.2, made concrete: one is a file, the other is a file <em>and</em> an object.</p>

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
<pre><code>git cat-file -p HEAD</code></pre>
<div class="out">tree 8b7c4a2e1f9d0c3b5a7e9f1d3c5b7a9e1f3d5c7b
parent 9e2d4b70c1a3f5e7b9d0c2a4f6e8b0d2c4a6f8e0
author Nguyen Van An &lt;an@example.com&gt; 1755820800 +0700
committer Nguyen Van An &lt;an@example.com&gt; 1755820800 +0700

feat(auth): add refresh token rotation</div>
<pre><code>git cat-file -p 8b7c4a2</code></pre>
<div class="out">100644 blob a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8	package.json
040000 tree 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d	src
100644 blob 5f7a9c2b8d0e2f4a6c8e0b2d4f6a8c0e2b4d6f8	README.md</div>
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
<div class="callout ok">Một blob không biết tên của chính nó. Cái tên nằm trong <strong>tree</strong> trỏ vào nó. Đổi tên một file mà không đổi nội dung thì Git ghi một tree mới và dùng lại đúng cái blob cũ — vì thế đổi tên một file 10 MB gần như không tốn gì, và vì thế <code>git log --follow</code> (bài 2.3) phải <em>SUY LUẬN</em> ra việc đổi tên chứ không đọc được nó: Git chưa bao giờ ghi lại một lần đổi tên nào.</div>

<h3>Dựng một commit bằng tay</h3>
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
<div class="out">a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e</div>
<pre><code><span class="tok-comment"># 5. Cho một nhánh trỏ vào nó. ĐÂY mới là ý nghĩa của việc "commit".</span>
git update-ref refs/heads/main a7c2f91
git log --oneline</code></pre>
<div class="out">a7c2f91 first commit, made by hand</div>
<div class="callout ok">Một commit thật, trong một kho mã thật, dựng từ năm lệnh cấp thấp. <code>git commit</code> là đúng năm bước đó cộng các tiện ích: đọc cấu hình để lấy tác giả, mở trình soạn thảo, chạy hook, ghi reflog. Không có phép màu nào bị lược bỏ cả.</div>

<h3>Cái header đi vào mã băm</h3>
<pre><code><span class="tok-comment"># Git băm "&lt;loại&gt; &lt;kích thước&gt;\\0&lt;nội dung&gt;", không băm riêng nội dung:</span>
printf <span class="tok-string">'blob 12\\0hello world\\n'</span> | sha1sum</code></pre>
<div class="out">3b18e512dba79e4c8300dd08aeb37f8e728b8dad  -</div>
<p>Đúng cái mã băm mà <code>git hash-object</code> đã sinh ra. Tiền tố loại-và-kích-thước là lý do một blob và một commit có cùng byte lại nhận mã băm khác nhau, và là lý do bạn hỏi được <code>git cat-file -t</code> về loại của một đối tượng mà không cần bảng tra.</p>

<h3>Soi cả cơ sở dữ liệu</h3>
<pre><code>git cat-file --batch-all-objects --batch-check | head -8</code></pre>
<div class="out">3b18e512dba79e4c8300dd08aeb37f8e728b8dad blob 12
68aba62e560c0ebc3396e8ae9335232cd93a3f60 tree 37
a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e commit 168</div>
<pre><code><span class="tok-comment"># Mọi đối tượng, sắp theo kích thước — cách bạn tìm ra cái video 400 MB (bài 8.3):</span>
git cat-file --batch-all-objects --batch-check=<span class="tok-string">'%(objectsize) %(objectname) %(objecttype)'</span> \\
  | sort -rn | head -5</code></pre>

<h3>Tag có chú thích cũng là đối tượng</h3>
<pre><code>git tag -a v1.0 -m <span class="tok-string">"first release"</span>
git cat-file -t v1.0
git cat-file -p v1.0</code></pre>
<div class="out">tag

object a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e
type commit
tag v1.0
tagger Nguyen Van An &lt;an@example.com&gt; 1755820800 +0700

first release</div>
<p>Một tag nhẹ thì không có đối tượng nào cả — <code>refs/tags/v1.0</code> giữ thẳng mã băm commit. Đó là khác biệt ở bài 7.2, hiện ra cụ thể: một bên là một file, bên kia là một file <em>VÀ</em> một đối tượng.</p>

<a class="link-card" href="https://git-scm.com/book/vi/v2/Git-N%E1%BB%99i-T%E1%BA%A1i-%C4%90%E1%BB%91i-T%C6%B0%E1%BB%A3ng-Git" target="_blank" rel="noopener">
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
<pre><code>ls .git/objects/</code></pre>
<div class="out">3f  7b  9e  a7  b2  c4  d8  e0  info  pack</div>
<p>Two-character directories are <strong>loose objects</strong> — one file each, zlib-compressed, written as you work. Every so often Git packs them:</p>
<pre><code>git gc
ls .git/objects/
ls -lh .git/objects/pack/</code></pre>
<div class="out">info  pack

-r--r--r-- 1 an an  38M pack-a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e.pack
-r--r--r-- 1 an an 2.1M pack-a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e.idx</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">.pack</span><span class="v">All the objects, concatenated and delta-compressed.</span></div>
  <div class="kv"><span class="k">.idx</span><span class="v">The index: which hash lives at which byte offset, so any object is one seek away.</span></div>
</div>

<h3>Delta compression — the actual saving</h3>
<p>Inside a pack, Git stores some objects as a <strong>delta</strong> against a similar one: "take object X and apply these changes". Version 200 of a 500 KB file is stored as a few bytes of difference from version 199.</p>
<div class="callout ok">This is where the "snapshots vs diffs" question resolves. Git's <em>model</em> is snapshots — every commit names a complete tree, which is what makes checkout fast and history immutable. Git's <em>storage</em> uses deltas inside packfiles, which is what makes it small. The two are independent: the model stays simple while the storage stays cheap.</div>
<pre><code>git verify-pack -v .git/objects/pack/pack-*.idx | head -6</code></pre>
<div class="out">3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d commit 168 119 12
a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e blob   4823 1904 131
5f7a9c2b8d0e2f4a6c8e0b2d4f6a8c0e2b4d6f8e blob   4901 62 2035 1 a7c2f91d…</div>
<p>Read the last line: a 4,901-byte blob stored in <strong>62 bytes</strong>, as a depth-1 delta against <code>a7c2f91</code>. That single line explains why a repository with a decade of edits to the same files stays small.</p>

<h3>What git gc actually does</h3>
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
git clone --filter=blob:none &lt;url&gt;            <span class="tok-comment"># treeless-ish: fetch blobs on demand</span>
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
<p>Bên trong một pack, Git lưu một số đối tượng dưới dạng <strong>delta</strong> so với một đối tượng tương tự: "lấy đối tượng X rồi áp những thay đổi này". Phiên bản thứ 200 của một file 500 KB được lưu bằng vài byte khác biệt so với phiên bản 199.</p>
<div class="callout ok">Đây là chỗ câu hỏi "ảnh chụp hay bản khác biệt" được giải quyết. <em>MÔ HÌNH</em> của Git là ảnh chụp — mọi commit gọi tên một tree hoàn chỉnh, và đó là thứ làm cho checkout nhanh và lịch sử bất biến. <em>CÁCH LƯU TRỮ</em> của Git dùng delta bên trong packfile, và đó là thứ làm cho nó nhỏ. Hai thứ độc lập với nhau: mô hình vẫn đơn giản trong khi lưu trữ vẫn rẻ.</div>
<pre><code>git verify-pack -v .git/objects/pack/pack-*.idx | head -6</code></pre>
<div class="out">3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d commit 168 119 12
a7c2f91d8e0b2c4a6f8e0d2b4c6a8e0f2d4b6c8e blob   4823 1904 131
5f7a9c2b8d0e2f4a6c8e0b2d4f6a8c0e2b4d6f8e blob   4901 62 2035 1 a7c2f91d…</div>
<p>Hãy đọc dòng cuối: một blob 4.901 byte được lưu trong <strong>62 byte</strong>, dưới dạng delta độ sâu 1 so với <code>a7c2f91</code>. Chỉ một dòng đó giải thích vì sao một kho mã có cả thập kỷ chỉnh sửa trên cùng những file vẫn nhỏ.</p>

<h3>git gc thật ra làm gì</h3>
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

<a class="link-card" href="https://git-scm.com/book/vi/v2/Git-N%E1%BB%99i-T%E1%BA%A1i-Packfiles" target="_blank" rel="noopener">
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
      description: 'Tám câu về .git/, packed-refs, file index và giai đoạn hợp nhất, bốn loại đối tượng, tên file nằm ở đâu, header đi vào mã băm, packfile/delta, và gc --prune=now.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on Git's internals. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: where a file's name is actually stored (9.2), and what <code>gc --prune=now</code> destroys (9.3).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về ruột gan của Git. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: tên của một file thật ra được lưu ở đâu (bài 9.2), và <code>gc --prune=now</code> huỷ mất cái gì (bài 9.3).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: '"cat .git/refs/heads/main" says "No such file". Is the branch gone?|||"cat .git/refs/heads/main" báo "No such file". Nhánh đó mất rồi à?',
            options: [
              'Yes, the branch was deleted|||Rồi, nhánh đã bị xoá',
              'No — refs get packed into .git/packed-refs; use git rev-parse main, which checks both places|||Không — các ref được gói vào .git/packed-refs; hãy dùng git rev-parse main, lệnh này kiểm cả hai chỗ',
              'The repository is corrupt|||Kho mã bị hỏng',
              'The branch only exists on the remote|||Nhánh đó chỉ tồn tại trên remote',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In "git ls-files --stage", what does the number after the hash mean?|||Trong "git ls-files --stage", con số sau mã băm nghĩa là gì?',
            options: [
              'The file size|||Kích thước file',
              'The merge stage: 0 normally, and 1/2/3 (base/ours/theirs) during a conflict|||Giai đoạn hợp nhất: 0 khi bình thường, và 1/2/3 (gốc/của ta/của họ) khi đang xung đột',
              'The number of commits touching it|||Số commit từng chạm vào nó',
              'The Unix permission bits|||Các bit quyền Unix',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which object type stores a file\'s NAME?|||Loại đối tượng nào lưu TÊN của một file?',
            options: [
              'blob',
              'tree — a blob holds only bytes, and the name lives in the tree that points at it|||tree — một blob chỉ giữ byte, còn cái tên nằm trong tree trỏ vào nó',
              'commit',
              'The index, not an object at all|||Index, chứ không phải một đối tượng nào',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why can Git not simply read a file rename out of history?|||Vì sao Git không thể đơn giản đọc ra một lần đổi tên từ lịch sử?',
            options: [
              'Renames are stored but compressed away|||Việc đổi tên có được lưu nhưng bị nén mất',
              'Git stores snapshots — a rename is just a new tree naming the same blob differently, so renames are inferred by similarity heuristics|||Git lưu ảnh chụp — một lần đổi tên chỉ là một tree mới gọi cùng cái blob bằng tên khác, nên việc đổi tên được SUY LUẬN bằng thuật toán tương đồng',
              'Only Git LFS records renames|||Chỉ Git LFS ghi lại việc đổi tên',
              'Renames are recorded in the reflog|||Việc đổi tên được ghi trong reflog',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What exactly does Git hash to produce an object ID?|||Git băm chính xác cái gì để ra một mã định danh đối tượng?',
            options: [
              'The file content alone|||Chỉ nội dung file',
              'The string "<type> <size>\\0" followed by the content|||Chuỗi "<loại> <kích thước>\\0" rồi tới nội dung',
              'The file path plus the content|||Đường dẫn file cộng nội dung',
              'The content plus a timestamp|||Nội dung cộng dấu thời gian',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Git\'s model is snapshots. So what makes repositories small?|||Mô hình của Git là ảnh chụp. Vậy cái gì làm cho kho mã nhỏ?',
            options: [
              'Git actually stores diffs, not snapshots|||Git thật ra lưu bản khác biệt, không lưu ảnh chụp',
              'Delta compression INSIDE packfiles — the model stays snapshots while the storage stores similar objects as deltas|||Nén delta BÊN TRONG packfile — mô hình vẫn là ảnh chụp trong khi phần lưu trữ lưu các đối tượng giống nhau dưới dạng delta',
              'Old commits are deleted after a year|||Commit cũ bị xoá sau một năm',
              'Only the current branch is stored|||Chỉ nhánh hiện tại được lưu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'When does a "deleted" commit truly disappear from disk?|||Khi nào một commit "đã xoá" thật sự biến khỏi đĩa?',
            options: [
              'Immediately on git branch -D|||Ngay khi chạy git branch -D',
              'When git gc prunes objects that no ref and no reflog entry can reach|||Khi git gc dọn những đối tượng mà không ref nào và không dòng reflog nào với tới được',
              'When you push|||Khi bạn push',
              'Never|||Không bao giờ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why should you never run "git gc --prune=now" while rescuing lost work?|||Vì sao đừng bao giờ chạy "git gc --prune=now" trong lúc đang cứu công việc bị mất?',
            options: [
              'It is slow|||Nó chậm',
              'It deletes unreachable objects immediately with no grace period — including the very commits you are trying to recover|||Nó xoá ngay các đối tượng không với tới được, không có thời gian ân hạn — kể cả đúng những commit bạn đang cố cứu',
              'It requires a network connection|||Nó cần kết nối mạng',
              'It rewrites history|||Nó viết lại lịch sử',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
