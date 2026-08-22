/**
 * Git & GitHub — Mục 0: Giới thiệu · Vì sao cần · Cài đặt · Cách học.
 * Song ngữ EN/VI qua .ml-en / .ml-vi (số khối phải bằng nhau).
 * ⚠️ KHÔNG dùng backtick trần trong content (dùng &#96;); mọi `${` trong code mẫu
 * escape thành \${; < > trong code/output → &lt; &gt;; & → &amp;.
 * Khối .out (kết quả chạy thật) LUÔN đóng bằng </div>, KHÔNG </code></pre>.
 * KHÔNG dùng <svg> — sanitizeHtml() xoá sạch nó, sơ đồ biến mất không báo lỗi.
 */
const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Section 0 — Introduction, Why Git, Setup & How to Study|||Mục 0 — Giới thiệu, Vì sao cần Git, Cài đặt & Cách học',
  description: 'Đọc trước tiên: khoá này dành cho ai, vấn đề mà Git thực sự giải quyết (và vì sao thư mục "báo cáo_final_v2_sửa_lần_cuối" là một hệ quản lý phiên bản tồi), cài đặt và cấu hình Git trên cả ba hệ điều hành, tạo khoá SSH cho GitHub, và cách học khoá này để kiến thức đọng lại.',
  lessons: [
    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — Who this course is for & the full roadmap|||0.1 — Khoá này cho ai & lộ trình toàn khoá',
      slug: 'git-0-1-gioi-thieu-lo-trinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao hầu hết lập trình viên chỉ dùng được 5 lệnh Git và sợ hãi mọi lệnh còn lại, khoá này lấp khoảng trống nào, và bản đồ 14 chương từ commit đầu tiên tới cứu một repo tưởng đã hỏng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>Start here — the tool you will touch every single day</h2>
<p class="lead">Almost every developer learns exactly five Git commands — <code>clone</code>, <code>add</code>, <code>commit</code>, <code>push</code>, <code>pull</code> — and then stops. Everything beyond that becomes folklore: "never rebase", "reset --hard deletes your work", "if it breaks, delete the folder and clone again". That folklore is expensive. It costs you afternoons, and occasionally it costs your team a day of lost work.</p>
<p>This course replaces the folklore with a <strong>model</strong>. Once you can picture what Git actually stores, the scary commands stop being scary, because you can predict what each one will do before you press Enter.</p>

<h3>The one idea this course is built on</h3>
<div class="callout ok">Git does not store your files. Git stores a chain of <strong>snapshots</strong>, each one addressed by a hash of its own content, plus a handful of <strong>pointers</strong> (branches, tags, <code>HEAD</code>) that say "you are here". Every command you will learn either creates a snapshot or moves a pointer. That is the whole system.</div>
<p>Hold on to that sentence. In Chapter 9 you will open <code>.git/</code> with your own hands and see the snapshots and pointers as real files on disk, and the whole thing will click.</p>

<h3>Who this is for</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">The beginner</span><span class="v">You have never made a commit. Start at 0.2 — nothing is assumed beyond being able to open a terminal.</span></div>
  <div class="kv"><span class="k">The "five-command" developer</span><span class="v">You ship code daily but freeze when Git says <em>"fatal: refusing to merge unrelated histories"</em>. Chapters 1, 3 and 4 are written for you.</span></div>
  <div class="kv"><span class="k">The team lead</span><span class="v">You need a branching strategy, a review process and protected branches that people actually follow. Chapters 6–8.</span></div>
  <div class="kv"><span class="k">The person mid-disaster</span><span class="v">Something is on fire right now. Jump straight to Chapter 13 — it is a recovery cookbook, readable out of order.</span></div>
</div>

<h3>What you will be able to do at the end</h3>
<ul>
  <li>Explain what a commit <em>is</em>, not just how to make one — and read a repository's history like a document.</li>
  <li>Resolve a merge conflict calmly, including the ugly kind where both sides changed the same function.</li>
  <li>Rewrite your own local history (squash, reword, reorder) and know exactly when that becomes dangerous for other people.</li>
  <li>Recover a commit, a branch, or a whole afternoon's work that "disappeared" — using <code>reflog</code>, which almost nobody knows about.</li>
  <li>Find which commit introduced a bug in a 10,000-commit repository in about eight steps, with <code>git bisect</code>.</li>
  <li>Run a professional GitHub workflow: pull requests, review, protected branches, required checks, releases, tags.</li>
  <li>Remove a leaked API key from every commit in history — properly, not by deleting the line in a new commit.</li>
</ul>

<h3>The 14-chapter roadmap</h3>
<div class="lz-map">
  <div class="lz-stage">Part 1 — The model (Ch 1–2)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Snapshots, not diffs</div><div class="lz-nsub">The three trees, what a commit really contains, the everyday add/commit loop, .gitignore</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Reading history</div><div class="lz-nsub">log, show, diff, blame, the pickaxe, and bisect — archaeology on your own codebase</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 2 — Moving through history (Ch 3–4)</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Branching &amp; merging</div><div class="lz-nsub">A branch is a 41-byte file. Fast-forward vs 3-way merge, conflicts, merge vs rebase</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Undo, safely</div><div class="lz-nsub">restore, reset (the three modes), revert, stash — and reflog, the undo button for the undo button</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 3 — Working with other people (Ch 5–8)</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Remotes &amp; GitHub</div><div class="lz-nsub">fetch vs pull, tracking branches, SSH keys and tokens, forks and upstream</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Pull requests &amp; review</div><div class="lz-nsub">What makes a PR reviewable, merge vs squash vs rebase, protected branches, CODEOWNERS</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Team workflows &amp; releases</div><div class="lz-nsub">trunk-based vs git-flow, tags, semantic versioning, Conventional Commits, changelogs</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Rewriting history safely</div><div class="lz-nsub">amend, interactive rebase, --force-with-lease, filter-repo for a leaked secret</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 4 — Depth &amp; scale (Ch 9–12)</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Under the hood</div><div class="lz-nsub">Open .git/ and read the object database yourself: blobs, trees, commits, refs, packfiles</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Big repositories</div><div class="lz-nsub">worktree, submodules vs subtree, sparse-checkout, partial clone, LFS, monorepos</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">The GitHub platform</div><div class="lz-nsub">Issues and Projects, Actions, Releases, Dependabot and secret scanning, the gh CLI</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Hooks, signing &amp; automation</div><div class="lz-nsub">pre-commit, husky + lint-staged, server-side policy, signed commits</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Part 5 — When it goes wrong (Ch 13–14)</div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">Disaster recovery cookbook</div><div class="lz-nsub">Wrong branch, force-pushed over a colleague, deleted branch, leaked secret, detached HEAD</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Git in a real workflow</div><div class="lz-nsub">The exact flow behind cuongthai.com, reviewing your own diff, working alongside AI agents</div></div></div>
</div>

<h3>How this course is different from the docs</h3>
<p>The official documentation is a <em>reference</em>: it tells you every flag of every command, and assumes you already know which command you want. This course is a <em>path</em>: it introduces one idea at a time, shows the real terminal output, and tells you which mistake that idea prevents. Keep the reference open beside it — the two are complementary, not competing.</p>
<a class="link-card" href="https://git-scm.com/book/en/v2" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git (Chacon &amp; Straub) — the free official book</span><span class="lc-sub">The definitive reference. Chapter 10 "Git Internals" pairs with our Chapter 9.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/get-started" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Get started</span><span class="lc-sub">The platform half: pull requests, protected branches, Actions, security features.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: the Git track on Code Lab</span><span class="lc-sub">Graded exercises that mirror this course chapter by chapter. Read here, drill there.</span></span>
</a>

<div class="pitfall"><strong>The trap this whole course exists to break:</strong> treating Git as a magic box you feed commands to until the error goes away. Every time you fix a Git problem by copying a Stack Overflow command you do not understand, you make the next problem harder — because now you do not know what state your repository is in. Understanding the model is not academic; it is the cheapest path to being fast.</div>
<p class="note-ct"><strong>How to use this course:</strong> keep a scratch repository open in a second terminal (<code>mkdir /tmp/lab &amp;&amp; cd /tmp/lab &amp;&amp; git init</code>) and run every command as you read it. Git is safe to experiment with in a throwaway folder, and reading about <code>reset --hard</code> teaches you nothing compared to doing it once and getting your work back with <code>reflog</code>.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Bắt đầu từ đây — công cụ bạn chạm vào mỗi ngày</h2>
<p class="lead">Gần như mọi lập trình viên đều học đúng năm lệnh Git — <code>clone</code>, <code>add</code>, <code>commit</code>, <code>push</code>, <code>pull</code> — rồi dừng lại. Mọi thứ ngoài đó trở thành lời đồn: "đừng bao giờ rebase", "reset --hard là mất code", "hỏng thì xoá thư mục clone lại". Lời đồn ấy đắt. Nó lấy của bạn từng buổi chiều, và thỉnh thoảng lấy của cả nhóm một ngày làm việc.</p>
<p>Khoá này thay lời đồn bằng một <strong>mô hình</strong>. Khi bạn hình dung được Git thực sự lưu cái gì, những lệnh đáng sợ hết đáng sợ — vì bạn đoán trước được nó sẽ làm gì trước khi bấm Enter.</p>

<h3>Một ý tưởng duy nhất mà cả khoá này dựng lên trên đó</h3>
<div class="callout ok">Git KHÔNG lưu file của bạn. Git lưu một chuỗi <strong>ảnh chụp (snapshot)</strong>, mỗi ảnh được định danh bằng mã băm của chính nội dung nó, cộng với vài <strong>con trỏ</strong> (nhánh, tag, <code>HEAD</code>) nói "bạn đang ở đây". Mọi lệnh bạn sắp học đều hoặc tạo một ảnh chụp, hoặc dời một con trỏ. Cả hệ thống chỉ có vậy.</div>
<p>Hãy giữ lấy câu đó. Tới Chương 9 bạn sẽ tự tay mở <code>.git/</code> và thấy ảnh chụp cùng con trỏ nằm đó dưới dạng file thật trên đĩa — và mọi thứ sẽ khớp lại.</p>

<h3>Khoá này dành cho ai</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Người mới hoàn toàn</span><span class="v">Bạn chưa từng tạo một commit nào. Bắt đầu từ 0.2 — không giả định gì ngoài việc mở được terminal.</span></div>
  <div class="kv"><span class="k">Lập trình viên "năm lệnh"</span><span class="v">Bạn ship code mỗi ngày nhưng đơ người khi Git báo <em>"fatal: refusing to merge unrelated histories"</em>. Chương 1, 3 và 4 viết cho bạn.</span></div>
  <div class="kv"><span class="k">Người dẫn nhóm</span><span class="v">Bạn cần một chiến lược nhánh, một quy trình review và nhánh được bảo vệ mà mọi người thật sự tuân theo. Chương 6–8.</span></div>
  <div class="kv"><span class="k">Người đang gặp sự cố</span><span class="v">Có thứ đang cháy ngay lúc này. Nhảy thẳng tới Chương 13 — nó là sách công thức cứu hộ, đọc lẻ được.</span></div>
</div>

<h3>Học xong bạn làm được gì</h3>
<ul>
  <li>Giải thích một commit <em>là gì</em>, không chỉ cách tạo ra nó — và đọc lịch sử một kho mã như đọc một tài liệu.</li>
  <li>Xử lý xung đột merge một cách bình tĩnh, kể cả loại xấu xí khi hai bên cùng sửa một hàm.</li>
  <li>Viết lại lịch sử cục bộ của mình (gộp, đổi lời, đổi thứ tự) và biết chính xác lúc nào việc đó thành nguy hiểm cho người khác.</li>
  <li>Lấy lại một commit, một nhánh, hay cả buổi chiều làm việc đã "biến mất" — bằng <code>reflog</code>, thứ mà gần như không ai biết.</li>
  <li>Tìm ra commit nào gây lỗi trong một kho 10.000 commit chỉ trong khoảng tám bước, bằng <code>git bisect</code>.</li>
  <li>Chạy một quy trình GitHub chuyên nghiệp: pull request, review, nhánh được bảo vệ, kiểm tra bắt buộc, release, tag.</li>
  <li>Gỡ một khoá API bị lộ khỏi MỌI commit trong lịch sử — đúng cách, không phải bằng cách xoá dòng đó trong một commit mới.</li>
</ul>

<h3>Lộ trình 14 chương</h3>
<div class="lz-map">
  <div class="lz-stage">Phần 1 — Mô hình (Ch 1–2)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Ảnh chụp, không phải bản khác biệt</div><div class="lz-nsub">Ba cái cây, một commit thật sự chứa gì, vòng lặp add/commit hằng ngày, .gitignore</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Đọc lịch sử</div><div class="lz-nsub">log, show, diff, blame, cái cuốc chim (-S), và bisect — khảo cổ trên chính kho mã của bạn</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 2 — Di chuyển trong lịch sử (Ch 3–4)</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Nhánh &amp; hợp nhất</div><div class="lz-nsub">Một nhánh là một file 41 byte. Fast-forward vs merge 3 chiều, xung đột, merge vs rebase</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Hoàn tác, an toàn</div><div class="lz-nsub">restore, reset (ba chế độ), revert, stash — và reflog, nút undo cho chính nút undo</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 3 — Làm việc với người khác (Ch 5–8)</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Remote &amp; GitHub</div><div class="lz-nsub">fetch vs pull, nhánh theo dõi, khoá SSH và token, fork và upstream</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Pull request &amp; review</div><div class="lz-nsub">Điều gì làm một PR review được, merge vs squash vs rebase, nhánh bảo vệ, CODEOWNERS</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Quy trình nhóm &amp; phát hành</div><div class="lz-nsub">trunk-based vs git-flow, tag, đánh phiên bản ngữ nghĩa, Conventional Commits, changelog</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Viết lại lịch sử an toàn</div><div class="lz-nsub">amend, rebase tương tác, --force-with-lease, filter-repo cho một bí mật bị lộ</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 4 — Chiều sâu &amp; quy mô (Ch 9–12)</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Bên dưới nắp capo</div><div class="lz-nsub">Mở .git/ và tự đọc kho đối tượng: blob, tree, commit, ref, packfile</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Kho mã lớn</div><div class="lz-nsub">worktree, submodule vs subtree, sparse-checkout, partial clone, LFS, monorepo</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Nền tảng GitHub</div><div class="lz-nsub">Issue và Projects, Actions, Releases, Dependabot và quét bí mật, CLI gh</div></div></div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Hook, ký &amp; tự động hoá</div><div class="lz-nsub">pre-commit, husky + lint-staged, chính sách phía máy chủ, commit có chữ ký</div></div></div>
</div>
<div class="lz-map">
  <div class="lz-stage">Phần 5 — Khi mọi thứ hỏng (Ch 13–14)</div>
  <div class="lz-node"><div class="lz-badge">13</div><div class="lz-nbody"><div class="lz-ntitle">Sách công thức cứu hộ</div><div class="lz-nsub">Sai nhánh, force-push đè lên đồng nghiệp, xoá nhánh, lộ bí mật, HEAD lìa cành</div></div></div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Git trong quy trình thật</div><div class="lz-nsub">Đúng quy trình đằng sau cuongthai.com, tự review diff của mình, làm việc cùng agent AI</div></div></div>
</div>

<h3>Khoá này khác tài liệu chính thức ở chỗ nào</h3>
<p>Tài liệu chính thức là một <em>cuốn tra cứu</em>: nó liệt kê mọi cờ của mọi lệnh, và giả định bạn đã biết mình cần lệnh nào. Khoá này là một <em>con đường</em>: nó giới thiệu mỗi lần một ý, đưa ra output terminal thật, và nói cho bạn biết ý đó ngăn được sai lầm nào. Hãy mở cuốn tra cứu bên cạnh — hai thứ bổ sung cho nhau, không cạnh tranh.</p>
<a class="link-card" href="https://git-scm.com/book/vi/v2" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git (Chacon &amp; Straub) — sách chính thức, miễn phí, có bản tiếng Việt</span><span class="lc-sub">Cuốn tra cứu chuẩn mực. Chương 10 "Git Internals" đi cặp với Chương 9 của ta.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/get-started" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Bắt đầu</span><span class="lc-sub">Nửa phần nền tảng: pull request, nhánh bảo vệ, Actions, các tính năng bảo mật.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện tập: track Git trên Code Lab</span><span class="lc-sub">Bài tập có chấm điểm bám theo từng chương của khoá này. Đọc ở đây, luyện ở đó.</span></span>
</a>

<div class="pitfall"><strong>Cái bẫy mà cả khoá này sinh ra để phá:</strong> coi Git như một hộp thần kỳ mà ta nhét lệnh vào cho tới khi hết báo lỗi. Mỗi lần bạn sửa một vấn đề Git bằng cách chép một lệnh trên Stack Overflow mà không hiểu, bạn làm vấn đề kế tiếp khó hơn — vì giờ bạn không biết kho mã của mình đang ở trạng thái nào. Hiểu mô hình không phải là chuyện hàn lâm; đó là con đường rẻ nhất để đi nhanh.</div>
<p class="note-ct"><strong>Cách dùng khoá này:</strong> mở sẵn một kho mã nháp ở terminal thứ hai (<code>mkdir /tmp/lab &amp;&amp; cd /tmp/lab &amp;&amp; git init</code>) và chạy mọi lệnh khi bạn đọc tới. Git rất an toàn để nghịch trong một thư mục vứt đi, và đọc về <code>reset --hard</code> không dạy bạn được gì so với làm nó một lần rồi lấy lại được việc của mình bằng <code>reflog</code>.</p>
</div>
`,
    },

    /* ─────────────────────────── 0.2 ─────────────────────────── */
    {
      title: '0.2 — The problem Git solves (and why folders do not)|||0.2 — Vấn đề Git giải quyết (và vì sao thư mục thì không)',
      slug: 'git-0-2-van-de-git-giai-quyet',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Từ "báo_cáo_final_v2_sửa_lần_cuối.docx" tới hệ quản lý phiên bản phân tán: bốn vấn đề thật mà Git giải quyết, vì sao "phân tán" quan trọng, và Git khác Dropbox/Google Drive ở chỗ nào.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Everyone invents version control. Most people invent a bad one.</h2>
<p class="lead">Before we touch a command, be clear on the problem. You have already built a version control system — it just looked like this:</p>
<pre><code>report.docx
report_v2.docx
report_final.docx
report_final_FIXED.docx
report_final_FIXED_use_this_one.docx
report_final_FIXED_use_this_one_(An's copy).docx</code></pre>
<p>That is a real version control system. It stores versions. It is also a <em>bad</em> one, and it is worth naming exactly why, because each flaw maps to a Git feature.</p>

<h3>Four things the folder approach cannot do</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">It cannot say WHY</span><span class="v">The file name records <em>when</em>-ish, never <em>why</em>. Six months later nobody knows what "FIXED" fixed. Git attaches a message, an author and a timestamp to every version.</span></div>
  <div class="kv"><span class="k">It cannot show WHAT changed</span><span class="v">To find the difference between v2 and final you must read both documents. Git computes the difference for you, line by line, in a second.</span></div>
  <div class="kv"><span class="k">It cannot merge two people's work</span><span class="v">If An and Bình both edit <code>report_final</code>, one of them loses. Git merges both sets of changes automatically when they touch different lines, and asks you only about genuine overlaps.</span></div>
  <div class="kv"><span class="k">It cannot go back safely</span><span class="v">Restoring an old version means copying files over the new ones — destroying the new work. In Git every version stays reachable forever; going back adds history rather than erasing it.</span></div>
</div>

<h3>What a version control system is, precisely</h3>
<p>A <strong>version control system</strong> (VCS) records changes to a set of files over time so that you can recall any specific version later. Three generations exist, and knowing the difference explains most of Git's design:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Local</span><span class="lz-v">Versions live only on your machine (RCS, or your <code>_final_v2</code> folders). Nothing is shared; a dead laptop is a dead project.</span></div>
  <div class="lz-layer"><span class="lz-k">Centralised</span><span class="lz-v">One server holds the history (CVS, Subversion, Perforce). You check files out from it. Simple to reason about — but the server is a single point of failure, and you cannot commit offline.</span></div>
  <div class="lz-layer"><span class="lz-k">Distributed</span><span class="lz-v">Every clone is a <strong>complete</strong> copy of the entire history (Git, Mercurial). You can commit, branch, diff and search history on a plane with no network. The "central" repository is just the clone everyone agrees to treat as central.</span></div>
</div>
<div class="callout ok">That last row is the whole meaning of the D in <strong>DVCS</strong>. When you <code>git clone</code>, you do not download "the current files" — you download <em>every version of every file since the project began</em>, plus all the branches and tags. That is why <code>git log</code> is instant and works offline, and why a GitHub outage does not stop you from working.</div>

<h3>Git in one paragraph of history</h3>
<p>In 2005 the Linux kernel lost access to the proprietary VCS it had been using. Linus Torvalds wrote a replacement in about ten days, with three design goals that still explain every odd corner of the tool: it had to be <strong>fast</strong> (thousands of contributors, a huge codebase), it had to make <strong>branching and merging cheap</strong> (the kernel lives on parallel branches), and it had to <strong>guarantee integrity</strong> — you must be able to prove that the code you have is bit-for-bit the code that was committed. That third goal is why everything in Git is addressed by a SHA hash, which you will meet in Chapter 1.</p>

<h3>Git is not Dropbox — the difference matters</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dropbox / Google Drive</span><span class="v">Syncs <em>continuously and automatically</em>. Every keystroke eventually becomes the shared truth. Great for documents; catastrophic for code, because a half-written function would instantly break everyone else.</span></div>
  <div class="kv"><span class="k">Git</span><span class="v">Syncs <em>deliberately</em>. You decide when a set of changes is coherent enough to become a version (<code>commit</code>), and separately when it is ready for other people (<code>push</code>). That deliberate gap is where code review, tests and CI live.</span></div>
</div>
<p>This is the single most important cultural difference. Git is not a backup tool that happens to handle code. It is a tool for <strong>proposing</strong> changes, and the proposal is the unit of work.</p>

<h3>The vocabulary you need for Chapter 1</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">repository (repo)</span><span class="v">A project folder plus the hidden <code>.git/</code> directory holding its full history.</span></div>
  <div class="kv"><span class="k">commit</span><span class="v">One saved version — a snapshot of the whole project plus a message, an author and a link to its parent.</span></div>
  <div class="kv"><span class="k">branch</span><span class="v">A movable pointer to a commit. Used to develop something without disturbing the main line.</span></div>
  <div class="kv"><span class="k">remote</span><span class="v">Another copy of the repository, usually on a server such as GitHub, that you exchange commits with.</span></div>
  <div class="kv"><span class="k">clone / push / pull</span><span class="v">Copy a whole repository down · send your commits up · bring other people's commits down.</span></div>
</div>

<a class="link-card" href="https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 1.1 — About Version Control</span><span class="lc-sub">The three generations of VCS, with the classic diagrams.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/about" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">git-scm.com/about — the design goals, from the source</span><span class="lc-sub">Branching model, distributed nature, data assurance, staging area.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> putting a Git repository inside a Dropbox / Google Drive / OneDrive synced folder. The sync client and Git both write to <code>.git/</code>, and the sync client has no idea those files must change together. The classic result is a corrupted index or a half-written packfile, on a schedule nobody can reproduce. Keep repositories on ordinary local disk and use a Git remote for sharing — that is exactly what remotes are for.</div>
<p class="note-ct"><strong>Worth internalising now:</strong> Git never asks "what changed?". <em>You</em> tell it what belongs together, by choosing what to stage and when to commit. The quality of a repository's history is a direct reflection of that judgement — which is why Chapter 1 spends real time on the staging area rather than treating <code>git add .</code> as the only way.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Ai cũng tự phát minh ra quản lý phiên bản. Đa số phát minh ra một cái tồi.</h2>
<p class="lead">Trước khi chạm vào một lệnh nào, hãy rõ về vấn đề. Bạn đã từng dựng một hệ quản lý phiên bản rồi — nó chỉ trông thế này:</p>
<pre><code>bao_cao.docx
bao_cao_v2.docx
bao_cao_final.docx
bao_cao_final_SUA.docx
bao_cao_final_SUA_dung_ban_nay.docx
bao_cao_final_SUA_dung_ban_nay_(ban_cua_An).docx</code></pre>
<p>Đó là một hệ quản lý phiên bản thật. Nó có lưu các phiên bản. Nó cũng <em>tồi</em>, và đáng gọi tên chính xác vì sao, bởi mỗi khiếm khuyết ứng với một tính năng của Git.</p>

<h3>Bốn thứ cách-làm-bằng-thư-mục không làm được</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Không nói được VÌ SAO</span><span class="v">Tên file ghi lại <em>khi nào</em> một cách mập mờ, không bao giờ ghi <em>vì sao</em>. Sáu tháng sau không ai biết "SUA" đã sửa cái gì. Git gắn một lời nhắn, một tác giả và một dấu thời gian vào mọi phiên bản.</span></div>
  <div class="kv"><span class="k">Không cho thấy ĐÃ ĐỔI GÌ</span><span class="v">Muốn biết v2 khác final chỗ nào, bạn phải đọc cả hai tài liệu. Git tính hộ bạn phần khác biệt, từng dòng một, trong một giây.</span></div>
  <div class="kv"><span class="k">Không hợp nhất được việc của hai người</span><span class="v">Nếu An và Bình cùng sửa <code>bao_cao_final</code>, một người sẽ mất công. Git hợp nhất tự động cả hai bộ thay đổi khi chúng chạm những dòng khác nhau, và chỉ hỏi bạn ở chỗ chồng lấn thật sự.</span></div>
  <div class="kv"><span class="k">Không quay lại được an toàn</span><span class="v">Khôi phục bản cũ nghĩa là chép đè lên bản mới — huỷ luôn việc mới. Trong Git mọi phiên bản còn với tới được mãi mãi; quay lại là thêm vào lịch sử chứ không xoá đi.</span></div>
</div>

<h3>Hệ quản lý phiên bản là gì, nói cho chính xác</h3>
<p>Một <strong>hệ quản lý phiên bản</strong> (VCS) ghi lại thay đổi trên một tập file theo thời gian để sau này bạn gọi lại được bất kỳ phiên bản cụ thể nào. Có ba thế hệ, và biết sự khác nhau giải thích được phần lớn thiết kế của Git:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Cục bộ</span><span class="lz-v">Phiên bản chỉ nằm trên máy bạn (RCS, hoặc mấy thư mục <code>_final_v2</code> của bạn). Không chia sẻ gì; laptop chết là dự án chết.</span></div>
  <div class="lz-layer"><span class="lz-k">Tập trung</span><span class="lz-v">Một máy chủ giữ lịch sử (CVS, Subversion, Perforce). Bạn "mượn" file từ đó. Dễ hình dung — nhưng máy chủ là điểm chết duy nhất, và bạn không commit được khi ngoại tuyến.</span></div>
  <div class="lz-layer"><span class="lz-k">Phân tán</span><span class="lz-v">Mỗi bản clone là một bản sao <strong>đầy đủ</strong> của toàn bộ lịch sử (Git, Mercurial). Bạn commit, tạo nhánh, so sánh và tìm trong lịch sử được ngay trên máy bay không mạng. Kho "trung tâm" chỉ là bản clone mà mọi người đồng ý coi là trung tâm.</span></div>
</div>
<div class="callout ok">Dòng cuối chính là toàn bộ ý nghĩa của chữ D trong <strong>DVCS</strong>. Khi bạn <code>git clone</code>, bạn không tải "các file hiện tại" — bạn tải <em>mọi phiên bản của mọi file từ khi dự án bắt đầu</em>, kèm tất cả nhánh và tag. Vì thế <code>git log</code> chạy tức thì và hoạt động ngoại tuyến, và vì thế GitHub sập không làm bạn ngừng làm việc.</div>

<h3>Git trong một đoạn lịch sử</h3>
<p>Năm 2005 nhân Linux mất quyền dùng cái VCS thương mại mà họ đang xài. Linus Torvalds viết một cái thay thế trong khoảng mười ngày, với ba mục tiêu thiết kế mà tới giờ vẫn giải thích mọi góc kỳ quặc của công cụ này: phải <strong>nhanh</strong> (hàng nghìn người đóng góp, kho mã khổng lồ), phải làm cho <strong>tạo nhánh và hợp nhất rẻ</strong> (nhân Linux sống trên các nhánh song song), và phải <strong>bảo đảm toàn vẹn</strong> — bạn phải chứng minh được rằng mã bạn đang có đúng từng bit với mã đã được commit. Mục tiêu thứ ba là lý do mọi thứ trong Git được định danh bằng mã băm SHA, thứ bạn sẽ gặp ở Chương 1.</p>

<h3>Git không phải Dropbox — khác biệt này quan trọng</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dropbox / Google Drive</span><span class="v">Đồng bộ <em>liên tục và tự động</em>. Mỗi phím gõ rốt cuộc trở thành sự thật chung. Tuyệt cho tài liệu; thảm hoạ cho mã nguồn, vì một hàm viết dở sẽ lập tức làm hỏng việc của mọi người khác.</span></div>
  <div class="kv"><span class="k">Git</span><span class="v">Đồng bộ <em>có chủ ý</em>. Bạn quyết định khi nào một bộ thay đổi đủ mạch lạc để trở thành một phiên bản (<code>commit</code>), và tách bạch với việc khi nào nó sẵn sàng cho người khác (<code>push</code>). Chính khoảng ngắt có chủ ý đó là nơi review, test và CI sinh sống.</span></div>
</div>
<p>Đây là khác biệt văn hoá quan trọng nhất. Git không phải công cụ sao lưu tình cờ xử lý được mã nguồn. Nó là công cụ để <strong>đề xuất</strong> thay đổi, và lời đề xuất mới là đơn vị công việc.</p>

<h3>Bộ từ vựng bạn cần cho Chương 1</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">kho mã (repository, repo)</span><span class="v">Một thư mục dự án cộng với thư mục ẩn <code>.git/</code> giữ toàn bộ lịch sử của nó.</span></div>
  <div class="kv"><span class="k">commit</span><span class="v">Một phiên bản đã lưu — ảnh chụp toàn dự án cộng lời nhắn, tác giả và liên kết tới commit cha.</span></div>
  <div class="kv"><span class="k">nhánh (branch)</span><span class="v">Một con trỏ di chuyển được, trỏ tới một commit. Dùng để phát triển thứ gì đó mà không quấy vào dòng chính.</span></div>
  <div class="kv"><span class="k">remote</span><span class="v">Một bản sao khác của kho mã, thường nằm trên máy chủ như GitHub, để bạn trao đổi commit với nó.</span></div>
  <div class="kv"><span class="k">clone / push / pull</span><span class="v">Chép cả kho mã về · đẩy commit của bạn lên · kéo commit của người khác về.</span></div>
</div>

<a class="link-card" href="https://git-scm.com/book/vi/v2/M%E1%BB%9F-%C4%90%E1%BA%A7u-V%E1%BB%81-Qu%E1%BA%A3n-L%C3%BD-Phi%C3%AAn-B%E1%BA%A3n" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Pro Git 1.1 (tiếng Việt) — Về Quản Lý Phiên Bản</span><span class="lc-sub">Ba thế hệ VCS, kèm những sơ đồ kinh điển.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/about" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">git-scm.com/about — mục tiêu thiết kế, từ chính nguồn</span><span class="lc-sub">Mô hình nhánh, tính phân tán, bảo đảm dữ liệu, vùng staging.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đặt một kho Git bên trong thư mục được Dropbox / Google Drive / OneDrive đồng bộ. Cả trình đồng bộ lẫn Git đều ghi vào <code>.git/</code>, và trình đồng bộ không hề biết những file đó phải đổi cùng nhau. Kết quả kinh điển là index hỏng hoặc packfile viết dở, theo một lịch không ai tái hiện nổi. Hãy để kho mã trên đĩa cục bộ bình thường và dùng remote của Git để chia sẻ — remote sinh ra chính là để làm việc đó.</div>
<p class="note-ct"><strong>Đáng ghi nhớ ngay lúc này:</strong> Git không bao giờ hỏi "cái gì đã đổi?". Chính <em>bạn</em> nói cho nó biết những gì thuộc về nhau, bằng cách chọn thứ nào đưa vào staging và commit lúc nào. Chất lượng lịch sử của một kho mã phản ánh trực tiếp phán đoán đó — vì thế Chương 1 dành thời gian thật cho vùng staging thay vì coi <code>git add .</code> là cách duy nhất.</p>
</div>
`,
    },

    /* ─────────────────────────── 0.3 ─────────────────────────── */
    {
      title: '0.3 — Install & configure Git, and create your SSH key|||0.3 — Cài đặt & cấu hình Git, và tạo khoá SSH',
      slug: 'git-0-3-cai-dat-cau-hinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Cài Git trên Windows/macOS/Linux, đặt name và email đúng cách, chọn trình soạn thảo, xử lý CRLF/LF cho nhóm nhiều hệ điều hành, tạo khoá SSH ed25519 và nạp lên GitHub, rồi kiểm chứng bằng một lệnh.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Fifteen minutes of setup that prevents a year of small annoyances</h2>
<p class="lead">Most Git tutorials say "install Git, set your name, done". That is enough to make a commit and not enough to work in a team. Four of the settings below exist specifically to prevent problems that are painful to fix afterwards — line endings especially, which can turn a one-line change into a 4,000-line diff.</p>

<h3>1. Install</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Windows</span><span class="v">Install <strong>Git for Windows</strong> from git-scm.com. It bundles Git Bash, which gives you a real POSIX shell — use it for this course instead of PowerShell so every command in these lessons works verbatim.</span></div>
  <div class="kv"><span class="k">macOS</span><span class="v"><code>brew install git</code>. macOS ships an old Apple build; Homebrew's is current. Without Homebrew, running <code>git --version</code> once will offer to install the Xcode Command Line Tools.</span></div>
  <div class="kv"><span class="k">Linux</span><span class="v"><code>sudo apt install git</code> (Debian/Ubuntu) or <code>sudo dnf install git</code> (Fedora).</span></div>
</div>
<p>Verify — anything from 2.30 upwards is fine for everything in this course:</p>
<pre><code>git --version</code></pre>
<div class="out">git version 2.43.0</div>

<h3>2. Identity — who is making these commits</h3>
<p>Every commit permanently records a name and an email. Set them once, globally:</p>
<pre><code>git config --global user.name <span class="tok-string">"Nguyen Van An"</span>
git config --global user.email <span class="tok-string">"an@example.com"</span></code></pre>
<div class="callout warn">Use the same email that is registered on your GitHub account, or GitHub will not link your commits to your profile and they will not appear in your contribution graph. If you want to keep your real address private, GitHub gives you a <code>noreply</code> address (Settings → Emails → "Keep my email addresses private") — use that one here instead.</div>

<h3>3. The settings that actually prevent bugs</h3>
<pre><code><span class="tok-comment"># The name of the first branch in a new repo. GitHub uses "main"; Git's</span>
<span class="tok-comment"># historical default was "master". Setting this avoids a mismatch on day one.</span>
git config --global init.defaultBranch main

<span class="tok-comment"># What "git pull" does when your branch and the remote have both moved.</span>
<span class="tok-comment"># Without this, modern Git refuses to pull and prints a wall of text.</span>
<span class="tok-comment"># "false" = create a merge commit. Chapter 5 explains the alternatives.</span>
git config --global pull.rebase false

<span class="tok-comment"># Line endings. THE setting people wish they had known about.</span>
git config --global core.autocrlf input    <span class="tok-comment"># macOS / Linux</span>
git config --global core.autocrlf true     <span class="tok-comment"># Windows</span>

<span class="tok-comment"># The editor Git opens for commit messages and interactive rebase.</span>
<span class="tok-comment"># The default on Linux is vim; if that is unfamiliar, pick one you can exit.</span>
git config --global core.editor <span class="tok-string">"code --wait"</span>   <span class="tok-comment"># VS Code</span>
git config --global core.editor <span class="tok-string">"nano"</span>          <span class="tok-comment"># or nano</span></code></pre>

<h3>Why line endings deserve their own paragraph</h3>
<p>Windows ends a line of text with two invisible characters (carriage return + line feed, <code>CRLF</code>); macOS and Linux use one (<code>LF</code>). If one teammate's editor saves CRLF and another's saves LF, Git sees <em>every line of the file</em> as changed. A one-word fix arrives as a 4,000-line diff that is impossible to review, and it happens again on every commit.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">setting</div><div class="lz-t">core.autocrlf = input</div><div class="lz-d">Convert CRLF → LF when committing; leave the working copy alone. The right choice on macOS/Linux.</div></div>
  <div class="lz-step"><div class="lz-k">setting</div><div class="lz-t">core.autocrlf = true</div><div class="lz-d">Convert CRLF → LF when committing, and LF → CRLF when checking out. The right choice on Windows.</div></div>
  <div class="lz-step"><div class="lz-k">result</div><div class="lz-t">The repository stores LF</div><div class="lz-d">Every machine gets what it wants locally, and the shared history stays uniform.</div></div>
</div>
<p>For a project you own, do better than relying on everyone's global config — commit a <code>.gitattributes</code> file so the rule travels with the repository:</p>
<pre><code><span class="tok-comment"># .gitattributes — normalise text, and mark binaries so Git never touches them</span>
* text=auto
*.sh   text eol=lf
*.bat  text eol=crlf
*.png  binary
*.pdf  binary</code></pre>

<h3>4. Read your configuration back</h3>
<pre><code>git config --list --show-origin</code></pre>
<div class="out">file:/home/an/.gitconfig        user.name=Nguyen Van An
file:/home/an/.gitconfig        user.email=an@example.com
file:/home/an/.gitconfig        init.defaultbranch=main
file:/home/an/.gitconfig        core.autocrlf=input</div>
<p>Git reads configuration from three levels, each overriding the one above it. Knowing the order saves you from "but I set that!":</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">--system</span><span class="lz-v"><code>/etc/gitconfig</code> — every user on the machine. Rarely touched.</span></div>
  <div class="lz-layer"><span class="lz-k">--global</span><span class="lz-v"><code>~/.gitconfig</code> — you, in every repository. This is where the commands above wrote.</span></div>
  <div class="lz-layer"><span class="lz-k">--local</span><span class="lz-v"><code>.git/config</code> — this one repository only, and it <strong>wins</strong>. Use it to commit to a work project under your work email.</span></div>
</div>

<h3>5. An SSH key for GitHub</h3>
<p>You can talk to GitHub over HTTPS with a personal access token, but SSH is nicer: no token to paste, no expiry to chase. Generate a modern <code>ed25519</code> key:</p>
<pre><code>ssh-keygen -t ed25519 -C <span class="tok-string">"an@example.com"</span>
<span class="tok-comment"># Press Enter to accept ~/.ssh/id_ed25519.</span>
<span class="tok-comment"># A passphrase is optional but recommended — the agent will remember it.</span>

<span class="tok-comment"># Start the agent and add the key so you type the passphrase once per session.</span>
eval <span class="tok-string">"\$(ssh-agent -s)"</span>
ssh-add ~/.ssh/id_ed25519

<span class="tok-comment"># Copy the PUBLIC half (.pub — never the other file) to your clipboard.</span>
cat ~/.ssh/id_ed25519.pub</code></pre>
<p>Paste it into GitHub → Settings → <strong>SSH and GPG keys</strong> → New SSH key. Then prove it works:</p>
<pre><code>ssh -T git@github.com</code></pre>
<div class="out">Hi an-nguyen! You've successfully authenticated, but GitHub does not provide shell access.</div>
<p>That message is a success, despite how it reads. GitHub deliberately refuses you a shell; the authentication is what we were testing.</p>
<div class="callout danger">The two files are not interchangeable. <code>id_ed25519.pub</code> is the <strong>public</strong> key — safe to paste anywhere. <code>id_ed25519</code> with no extension is the <strong>private</strong> key — it is a password. Never paste it into a website, never commit it, never send it in a chat. If it ever leaks, delete the key on GitHub and generate a new pair.</div>

<a class="link-card" href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Connecting to GitHub with SSH</span><span class="lc-sub">Per-OS instructions, agent setup, and troubleshooting a refused key.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-config" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">git config — the full list of settings</span><span class="lc-sub">Every option, with its default and its scope. Search this before inventing a workaround.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> setting <code>user.email</code> to something that is not on your GitHub account, then wondering why months of work shows up as "unknown author" and your contribution graph stays empty. Fixing it later means <em>rewriting history</em> (Chapter 8) on every affected commit. Check it now: <code>git config user.email</code>.</div>
<p class="note-ct"><strong>One habit worth forming today:</strong> when you clone a repository for a client or employer, immediately run <code>git config user.email work@company.com</code> <em>inside that repository</em>. Local config beats global, so your personal address never leaks into their history and their address never leaks into your open-source commits.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Mười lăm phút cài đặt để tránh một năm bực bội vặt</h2>
<p class="lead">Đa số hướng dẫn Git nói "cài Git, đặt tên, xong". Thế là đủ để tạo một commit và KHÔNG đủ để làm việc trong một nhóm. Bốn thiết lập dưới đây tồn tại đúng để chặn những vấn đề rất khó sửa về sau — nhất là ký tự xuống dòng, thứ có thể biến một thay đổi một dòng thành một diff 4.000 dòng.</p>

<h3>1. Cài đặt</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Windows</span><span class="v">Cài <strong>Git for Windows</strong> từ git-scm.com. Nó kèm Git Bash, cho bạn một shell POSIX thật — dùng nó cho khoá này thay vì PowerShell để mọi lệnh trong các bài chạy đúng nguyên văn.</span></div>
  <div class="kv"><span class="k">macOS</span><span class="v"><code>brew install git</code>. macOS đi kèm một bản Apple cũ; bản của Homebrew mới hơn. Không có Homebrew thì chỉ cần chạy <code>git --version</code> một lần, máy sẽ mời cài Xcode Command Line Tools.</span></div>
  <div class="kv"><span class="k">Linux</span><span class="v"><code>sudo apt install git</code> (Debian/Ubuntu) hoặc <code>sudo dnf install git</code> (Fedora).</span></div>
</div>
<p>Kiểm chứng — từ 2.30 trở lên là đủ cho mọi thứ trong khoá này:</p>
<pre><code>git --version</code></pre>
<div class="out">git version 2.43.0</div>

<h3>2. Danh tính — ai đang tạo ra những commit này</h3>
<p>Mọi commit đều ghi vĩnh viễn một cái tên và một email. Đặt một lần, ở mức toàn cục:</p>
<pre><code>git config --global user.name <span class="tok-string">"Nguyen Van An"</span>
git config --global user.email <span class="tok-string">"an@example.com"</span></code></pre>
<div class="callout warn">Dùng đúng email đã đăng ký trên tài khoản GitHub, nếu không GitHub sẽ không nối commit của bạn với hồ sơ và chúng không hiện trong biểu đồ đóng góp. Nếu muốn giữ kín địa chỉ thật, GitHub cấp cho bạn một địa chỉ <code>noreply</code> (Settings → Emails → "Keep my email addresses private") — dùng địa chỉ đó ở đây.</div>

<h3>3. Những thiết lập thật sự ngăn được lỗi</h3>
<pre><code><span class="tok-comment"># Tên nhánh đầu tiên trong một kho mới. GitHub dùng "main"; mặc định lịch sử</span>
<span class="tok-comment"># của Git là "master". Đặt cái này để khỏi lệch nhau ngay ngày đầu.</span>
git config --global init.defaultBranch main

<span class="tok-comment"># "git pull" làm gì khi nhánh của bạn và remote cùng tiến lên.</span>
<span class="tok-comment"># Không đặt thì Git đời mới từ chối pull và in ra một bức tường chữ.</span>
<span class="tok-comment"># "false" = tạo một commit hợp nhất. Chương 5 giải thích các lựa chọn khác.</span>
git config --global pull.rebase false

<span class="tok-comment"># Ký tự xuống dòng. THIẾT LẬP mà ai cũng ước biết sớm hơn.</span>
git config --global core.autocrlf input    <span class="tok-comment"># macOS / Linux</span>
git config --global core.autocrlf true     <span class="tok-comment"># Windows</span>

<span class="tok-comment"># Trình soạn thảo Git mở cho lời nhắn commit và rebase tương tác.</span>
<span class="tok-comment"># Mặc định trên Linux là vim; nếu lạ lẫm, chọn cái nào bạn thoát được.</span>
git config --global core.editor <span class="tok-string">"code --wait"</span>   <span class="tok-comment"># VS Code</span>
git config --global core.editor <span class="tok-string">"nano"</span>          <span class="tok-comment"># hoặc nano</span></code></pre>

<h3>Vì sao ký tự xuống dòng xứng đáng một đoạn riêng</h3>
<p>Windows kết thúc một dòng chữ bằng hai ký tự vô hình (carriage return + line feed, <code>CRLF</code>); macOS và Linux dùng một (<code>LF</code>). Nếu trình soạn thảo của một đồng đội lưu CRLF còn của người kia lưu LF, Git thấy <em>mọi dòng của file</em> đều đã đổi. Một sửa đổi một chữ tới tay người review dưới dạng diff 4.000 dòng không thể review nổi, và chuyện đó lặp lại ở mọi commit.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">thiết lập</div><div class="lz-t">core.autocrlf = input</div><div class="lz-d">Đổi CRLF → LF khi commit; để yên bản làm việc. Lựa chọn đúng trên macOS/Linux.</div></div>
  <div class="lz-step"><div class="lz-k">thiết lập</div><div class="lz-t">core.autocrlf = true</div><div class="lz-d">Đổi CRLF → LF khi commit, và LF → CRLF khi checkout. Lựa chọn đúng trên Windows.</div></div>
  <div class="lz-step"><div class="lz-k">kết quả</div><div class="lz-t">Kho mã lưu LF</div><div class="lz-d">Mỗi máy nhận thứ nó muốn ở cục bộ, còn lịch sử chung thì đồng nhất.</div></div>
</div>
<p>Với dự án của chính bạn, hãy làm tốt hơn là trông vào cấu hình toàn cục của từng người — commit một file <code>.gitattributes</code> để luật đi theo kho mã:</p>
<pre><code><span class="tok-comment"># .gitattributes — chuẩn hoá file chữ, và đánh dấu file nhị phân để Git đừng đụng</span>
* text=auto
*.sh   text eol=lf
*.bat  text eol=crlf
*.png  binary
*.pdf  binary</code></pre>

<h3>4. Đọc lại cấu hình của bạn</h3>
<pre><code>git config --list --show-origin</code></pre>
<div class="out">file:/home/an/.gitconfig        user.name=Nguyen Van An
file:/home/an/.gitconfig        user.email=an@example.com
file:/home/an/.gitconfig        init.defaultbranch=main
file:/home/an/.gitconfig        core.autocrlf=input</div>
<p>Git đọc cấu hình từ ba mức, mức dưới đè lên mức trên. Biết thứ tự này cứu bạn khỏi câu "nhưng tôi đã đặt rồi mà!":</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">--system</span><span class="lz-v"><code>/etc/gitconfig</code> — mọi người dùng trên máy. Hiếm khi đụng tới.</span></div>
  <div class="lz-layer"><span class="lz-k">--global</span><span class="lz-v"><code>~/.gitconfig</code> — riêng bạn, ở mọi kho mã. Đây là nơi các lệnh phía trên ghi vào.</span></div>
  <div class="lz-layer"><span class="lz-k">--local</span><span class="lz-v"><code>.git/config</code> — chỉ một kho mã này, và nó <strong>thắng</strong>. Dùng nó để commit vào dự án công ty bằng email công ty.</span></div>
</div>

<h3>5. Một khoá SSH cho GitHub</h3>
<p>Bạn nói chuyện với GitHub qua HTTPS bằng personal access token cũng được, nhưng SSH dễ chịu hơn: không phải dán token, không phải chạy theo hạn dùng. Tạo một khoá <code>ed25519</code> đời mới:</p>
<pre><code>ssh-keygen -t ed25519 -C <span class="tok-string">"an@example.com"</span>
<span class="tok-comment"># Nhấn Enter để nhận ~/.ssh/id_ed25519.</span>
<span class="tok-comment"># Mật khẩu bảo vệ là tuỳ chọn nhưng nên có — agent sẽ nhớ hộ bạn.</span>

<span class="tok-comment"># Chạy agent và nạp khoá để mỗi phiên chỉ gõ mật khẩu một lần.</span>
eval <span class="tok-string">"\$(ssh-agent -s)"</span>
ssh-add ~/.ssh/id_ed25519

<span class="tok-comment"># Chép nửa CÔNG KHAI (.pub — tuyệt đối không phải file kia) vào clipboard.</span>
cat ~/.ssh/id_ed25519.pub</code></pre>
<p>Dán nó vào GitHub → Settings → <strong>SSH and GPG keys</strong> → New SSH key. Rồi chứng minh nó chạy:</p>
<pre><code>ssh -T git@github.com</code></pre>
<div class="out">Hi an-nguyen! You've successfully authenticated, but GitHub does not provide shell access.</div>
<p>Thông báo đó là THÀNH CÔNG, dù đọc lên nghe như thất bại. GitHub cố tình không cho bạn một shell; thứ ta đang kiểm là việc xác thực.</p>
<div class="callout danger">Hai file đó không thay thế cho nhau được. <code>id_ed25519.pub</code> là khoá <strong>công khai</strong> — dán đâu cũng an toàn. <code>id_ed25519</code> không có đuôi là khoá <strong>riêng tư</strong> — nó là một mật khẩu. Đừng bao giờ dán nó vào một trang web, đừng commit, đừng gửi qua chat. Nếu lỡ lộ, xoá khoá đó trên GitHub và tạo cặp mới.</div>

<a class="link-card" href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Kết nối GitHub bằng SSH</span><span class="lc-sub">Hướng dẫn theo từng hệ điều hành, cài agent, và gỡ rối khi khoá bị từ chối.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-config" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">git config — danh sách đầy đủ các thiết lập</span><span class="lc-sub">Mọi tuỳ chọn, kèm giá trị mặc định và phạm vi. Tra ở đây trước khi nghĩ ra một cách lách.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đặt <code>user.email</code> thành một địa chỉ không có trên tài khoản GitHub, rồi thắc mắc vì sao hàng tháng trời làm việc hiện ra dưới dạng "tác giả không rõ" và biểu đồ đóng góp vẫn trống. Sửa về sau nghĩa là <em>viết lại lịch sử</em> (Chương 8) trên mọi commit bị ảnh hưởng. Kiểm ngay: <code>git config user.email</code>.</div>
<p class="note-ct"><strong>Một thói quen đáng tạo ngay hôm nay:</strong> khi clone kho mã cho khách hàng hay công ty, chạy ngay <code>git config user.email work@company.com</code> <em>bên trong kho đó</em>. Cấu hình cục bộ thắng toàn cục, nên địa chỉ cá nhân không bao giờ lọt vào lịch sử của họ và địa chỉ của họ không lọt vào các commit mã nguồn mở của bạn.</p>
</div>
`,
    },

    /* ─────────────────────────── 0.4 ─────────────────────────── */
    {
      title: '0.4 — How to study this course (and a safe playground)|||0.4 — Cách học khoá này (và một sân tập an toàn)',
      slug: 'git-0-4-cach-hoc',
      type: 'LESSON',
      description: 'Vì sao đọc về Git không dạy được tay bạn, cách dựng một kho nháp để phá thoải mái, ba câu hỏi phải trả lời được trước mọi lệnh, và bộ lệnh chẩn đoán khi bạn lạc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Build a playground you are allowed to destroy</h2>
<p class="lead">Git is a hands skill. Reading about <code>reset --hard</code> teaches you nothing; running it on a throwaway repository, watching your file vanish, and getting it back with <code>reflog</code> teaches you permanently. Set up that playground now — it takes twenty seconds and you will use it in every chapter.</p>

<h3>The scratch repository</h3>
<pre><code>mkdir -p ~/git-lab &amp;&amp; cd ~/git-lab
git init
printf <span class="tok-string">'line one\\n'</span> &gt; a.txt
git add a.txt
git commit -m <span class="tok-string">"first commit"</span></code></pre>
<div class="out">Initialized empty Git repository in /home/an/git-lab/.git/
[main (root-commit) 8f3c1a2] first commit
 1 file changed, 1 insertion(+)
 create mode 100644 a.txt</div>
<p>That is a complete repository. Nothing in it matters, which is exactly the point: you can run any command in this course against it, including the destructive ones, and the worst case is <code>rm -rf ~/git-lab</code> and thirty seconds to rebuild.</p>
<div class="callout ok">Keep a second terminal open on this folder for the whole course. When a lesson shows a command, run it there <em>before</em> reading the explanation of what it did. Predicting, then checking, is what makes the model stick.</div>

<h3>A generator for interesting history</h3>
<p>Several chapters need a repository with a real history to search. This loop builds one with ten commits in a couple of seconds:</p>
<pre><code>cd ~/git-lab
<span class="tok-keyword">for</span> i <span class="tok-keyword">in</span> \$(seq 1 10); <span class="tok-keyword">do</span>
  <span class="tok-keyword">echo</span> <span class="tok-string">"change \$i"</span> &gt;&gt; a.txt
  git commit -am <span class="tok-string">"commit number \$i"</span> &gt;/dev/null
<span class="tok-keyword">done</span>
git log --oneline</code></pre>
<div class="out">1a2b3c4 commit number 10
5d6e7f8 commit number 9
9a0b1c2 commit number 8
…
8f3c1a2 first commit</div>

<h3>Three questions to answer before you press Enter</h3>
<p>This is the single habit that separates people who are comfortable with Git from people who are not. Before running anything you are unsure about, answer:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Which of the three trees does this touch?</div><div class="lz-d">Working directory, staging area, or committed history? (Chapter 1 defines all three.)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Does it move a pointer or create an object?</div><div class="lz-d">Moving a branch pointer is cheap and reversible. Deleting uncommitted file content is not.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Has this commit been pushed?</div><div class="lz-d">Anything already shared is other people's problem too. Rewriting it needs a conversation, not a flag.</div></div>
</div>
<p>Almost every Git horror story is question 3 answered wrong. Rewriting your own unpushed work is free; rewriting shared history is a coordination problem that no command can solve for you.</p>

<h3>The one rule about lost work</h3>
<div class="callout ok"><strong>If it was ever committed, it is not gone.</strong> Git keeps unreachable commits for at least 30 days, and <code>git reflog</code> lists every position <code>HEAD</code> has ever held on your machine. A "lost" branch, a bad <code>reset --hard</code>, a botched rebase — all recoverable in one command. Chapter 4.4 covers it; until then, simply know that panic is unnecessary.</div>
<p>The genuine exception, and the only one worth fearing: changes you <strong>never committed</strong>. Git cannot restore what it was never shown. That is the practical argument for committing often on a local branch — commits are free, and each one is a save point.</p>

<h3>When you get lost — the diagnostic trio</h3>
<p>Three commands answer "where am I and what is going on?". Run them whenever a lesson leaves you unsure:</p>
<pre><code>git status                        <span class="tok-comment"># which branch, what is staged, what is modified</span>
git log --oneline --graph --all -20   <span class="tok-comment"># the shape of history, all branches</span>
git reflog -10                    <span class="tok-comment"># where HEAD has been recently</span></code></pre>
<p>Make the middle one an alias — you will type it hundreds of times:</p>
<pre><code>git config --global alias.lg <span class="tok-string">"log --oneline --graph --all --decorate -20"</span>
git lg</code></pre>
<div class="out">* 1a2b3c4 (HEAD -&gt; main) commit number 10
* 5d6e7f8 commit number 9
* 9a0b1c2 commit number 8</div>

<h3>How to pace the course</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chapters 1–4</span><span class="v">Do these in order and do not skip. They are the model; everything later assumes them. Roughly one chapter per sitting.</span></div>
  <div class="kv"><span class="k">Chapters 5–8</span><span class="v">Team work. Best absorbed while actually collaborating on something, even a two-person project.</span></div>
  <div class="kv"><span class="k">Chapter 9</span><span class="v">Internals. Optional for shipping code, transformative for confidence. Read it once the earlier chapters feel routine.</span></div>
  <div class="kv"><span class="k">Chapters 10–14</span><span class="v">Reference-shaped. Read what you need when you need it; Chapter 13 in particular is a cookbook to open mid-emergency.</span></div>
</div>

<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice after each chapter: the Git track on Code Lab</span><span class="lc-sub">Graded exercises with solutions, ordered to match these chapters.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">git-scm.com/docs — the reference manual</span><span class="lc-sub">Every command. Also available offline: <code>git help &lt;command&gt;</code>.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> learning Git only through a GUI (VS Code's Source Control panel, GitHub Desktop, Sourcetree). GUIs are excellent once you have the model, because they show you the graph. Before that they hide the very distinction you need to learn: the button says "Sync", but was that a fetch, a merge, a rebase, or a push? Learn on the command line for this course, then use whichever GUI you like — you will understand what its buttons actually do.</div>
<p class="note-ct"><strong>A note on memorising:</strong> do not. There are roughly 150 Git commands and nobody knows them all. Learn the <em>model</em> (three trees, snapshots, pointers) and about fifteen commands; look the rest up. Someone who understands the model can find the right command in the docs in a minute, while someone who memorised commands is stuck the moment the situation is slightly different.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Dựng một sân tập mà bạn được phép phá nát</h2>
<p class="lead">Git là kỹ năng của đôi tay. Đọc về <code>reset --hard</code> không dạy bạn được gì; chạy nó trên một kho vứt đi, nhìn file biến mất, rồi lấy lại bằng <code>reflog</code> thì dạy bạn vĩnh viễn. Dựng sân tập đó ngay bây giờ — mất hai mươi giây và bạn sẽ dùng nó ở mọi chương.</p>

<h3>Kho mã nháp</h3>
<pre><code>mkdir -p ~/git-lab &amp;&amp; cd ~/git-lab
git init
printf <span class="tok-string">'line one\\n'</span> &gt; a.txt
git add a.txt
git commit -m <span class="tok-string">"first commit"</span></code></pre>
<div class="out">Initialized empty Git repository in /home/an/git-lab/.git/
[main (root-commit) 8f3c1a2] first commit
 1 file changed, 1 insertion(+)
 create mode 100644 a.txt</div>
<p>Đó là một kho mã hoàn chỉnh. Không có gì trong đó quan trọng, và đấy chính là mục đích: bạn chạy được mọi lệnh của khoá này lên nó, kể cả những lệnh phá hoại, và tệ nhất là <code>rm -rf ~/git-lab</code> cùng ba mươi giây dựng lại.</p>
<div class="callout ok">Giữ một terminal thứ hai mở ở thư mục này suốt khoá. Khi một bài đưa ra một lệnh, hãy chạy nó ở đó <em>trước khi</em> đọc phần giải thích nó vừa làm gì. Đoán trước rồi kiểm chứng — đó là thứ làm mô hình đọng lại.</div>

<h3>Một bộ sinh lịch sử để nghịch</h3>
<p>Vài chương cần một kho có lịch sử thật để tìm kiếm. Vòng lặp này dựng một cái với mười commit trong vài giây:</p>
<pre><code>cd ~/git-lab
<span class="tok-keyword">for</span> i <span class="tok-keyword">in</span> \$(seq 1 10); <span class="tok-keyword">do</span>
  <span class="tok-keyword">echo</span> <span class="tok-string">"change \$i"</span> &gt;&gt; a.txt
  git commit -am <span class="tok-string">"commit number \$i"</span> &gt;/dev/null
<span class="tok-keyword">done</span>
git log --oneline</code></pre>
<div class="out">1a2b3c4 commit number 10
5d6e7f8 commit number 9
9a0b1c2 commit number 8
…
8f3c1a2 first commit</div>

<h3>Ba câu hỏi phải trả lời trước khi bấm Enter</h3>
<p>Đây là thói quen duy nhất phân biệt người thoải mái với Git và người thì không. Trước khi chạy thứ gì bạn chưa chắc, hãy trả lời:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Lệnh này đụng vào cây nào trong ba cây?</div><div class="lz-d">Thư mục làm việc, vùng staging, hay lịch sử đã commit? (Chương 1 định nghĩa cả ba.)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Nó dời một con trỏ hay tạo một đối tượng?</div><div class="lz-d">Dời con trỏ nhánh thì rẻ và đảo ngược được. Xoá nội dung file chưa commit thì không.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Commit này đã push chưa?</div><div class="lz-d">Thứ đã chia sẻ cũng là vấn đề của người khác. Viết lại nó cần một cuộc trò chuyện, không phải một cái cờ.</div></div>
</div>
<p>Gần như mọi câu chuyện kinh dị về Git đều là câu 3 trả lời sai. Viết lại việc của chính mình khi chưa push thì miễn phí; viết lại lịch sử đã chia sẻ là một bài toán phối hợp mà không lệnh nào giải hộ bạn được.</p>

<h3>Một luật duy nhất về việc bị mất</h3>
<div class="callout ok"><strong>Nếu nó từng được commit, nó chưa mất.</strong> Git giữ các commit không còn với tới được ít nhất 30 ngày, và <code>git reflog</code> liệt kê mọi vị trí mà <code>HEAD</code> từng đứng trên máy bạn. Một nhánh "mất", một lần <code>reset --hard</code> hớ, một lần rebase hỏng — đều cứu được bằng một lệnh. Bài 4.4 nói kỹ; tới đó thì cứ biết rằng hoảng loạn là không cần thiết.</div>
<p>Ngoại lệ thật sự, và là ngoại lệ duy nhất đáng sợ: những thay đổi bạn <strong>chưa bao giờ commit</strong>. Git không khôi phục được thứ chưa từng được cho xem. Đó là lý lẽ thực tế cho việc commit thường xuyên trên một nhánh cục bộ — commit thì miễn phí, và mỗi cái là một điểm lưu.</p>

<h3>Khi bạn lạc — bộ ba chẩn đoán</h3>
<p>Ba lệnh trả lời câu "tôi đang ở đâu và chuyện gì đang xảy ra?". Chạy chúng bất cứ lúc nào một bài làm bạn phân vân:</p>
<pre><code>git status                        <span class="tok-comment"># đang ở nhánh nào, gì đã staging, gì đã sửa</span>
git log --oneline --graph --all -20   <span class="tok-comment"># hình dạng lịch sử, mọi nhánh</span>
git reflog -10                    <span class="tok-comment"># HEAD vừa đi qua những đâu</span></code></pre>
<p>Hãy đặt lệnh giữa thành một alias — bạn sẽ gõ nó hàng trăm lần:</p>
<pre><code>git config --global alias.lg <span class="tok-string">"log --oneline --graph --all --decorate -20"</span>
git lg</code></pre>
<div class="out">* 1a2b3c4 (HEAD -&gt; main) commit number 10
* 5d6e7f8 commit number 9
* 9a0b1c2 commit number 8</div>

<h3>Nhịp học cả khoá</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chương 1–4</span><span class="v">Học theo thứ tự và đừng bỏ qua. Đây là mô hình; mọi thứ về sau đều giả định chúng. Khoảng một chương mỗi buổi.</span></div>
  <div class="kv"><span class="k">Chương 5–8</span><span class="v">Làm việc nhóm. Thấm nhất khi bạn đang thật sự cộng tác với ai đó, kể cả dự án hai người.</span></div>
  <div class="kv"><span class="k">Chương 9</span><span class="v">Ruột gan. Không bắt buộc để ship code, nhưng thay đổi hẳn mức độ tự tin. Đọc khi các chương trước đã thành thói quen.</span></div>
  <div class="kv"><span class="k">Chương 10–14</span><span class="v">Dạng tra cứu. Đọc cái nào cần lúc cần; riêng Chương 13 là sách công thức để mở ra giữa lúc sự cố.</span></div>
</div>

<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện sau mỗi chương: track Git trên Code Lab</span><span class="lc-sub">Bài tập có chấm điểm kèm lời giải, sắp xếp khớp với các chương này.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">git-scm.com/docs — sách tra cứu lệnh</span><span class="lc-sub">Mọi lệnh. Cũng có sẵn ngoại tuyến: <code>git help &lt;lệnh&gt;</code>.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> học Git chỉ qua giao diện đồ hoạ (bảng Source Control của VS Code, GitHub Desktop, Sourcetree). GUI rất tốt KHI bạn đã có mô hình, vì nó cho bạn thấy đồ thị. Trước đó nó che đúng cái phân biệt mà bạn cần học: nút ghi "Sync", nhưng vừa rồi là fetch, merge, rebase hay push? Hãy học bằng dòng lệnh trong khoá này, rồi dùng GUI nào bạn thích — bạn sẽ hiểu các nút của nó thật sự làm gì.</div>
<p class="note-ct"><strong>Một lời về học thuộc:</strong> đừng. Git có khoảng 150 lệnh và không ai thuộc hết. Hãy học <em>mô hình</em> (ba cây, ảnh chụp, con trỏ) và chừng mười lăm lệnh; phần còn lại tra. Người hiểu mô hình tìm được lệnh đúng trong tài liệu chỉ trong một phút, còn người học thuộc lệnh thì tắc ngay khi tình huống khác đi một chút.</p>
</div>
`,
    },
  ],
};
