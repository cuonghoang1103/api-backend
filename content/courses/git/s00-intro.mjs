/**
 * Git & GitHub — Mục 0: Giới thiệu · Vì sao cần · Cài đặt · Cách học.
 * Song ngữ EN/VI qua .ml-en / .ml-vi (số khối phải bằng nhau).
 * ⚠️ KHÔNG dùng backtick trần trong content (dùng &#96;); mọi `${` trong code mẫu
 * escape thành \${; < > trong code/output → &lt; &gt;; & → &amp;.
 * Khối .out (kết quả chạy thật) LUÔN đóng bằng </div>, KHÔNG </code></pre>.
 * KHÔNG dùng <svg> — sanitizeHtml() xoá sạch nó, sơ đồ biến mất không báo lỗi.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Section 0 — Introduction, Why Git, Setup & How to Study|||Mục 0 — Giới thiệu, Vì sao cần Git, Cài đặt & Cách học',
  description: 'Đọc trước tiên: khoá này dành cho ai, vấn đề mà Git thực sự giải quyết (và vì sao thư mục "báo cáo_final_v2_sửa_lần_cuối" là một hệ quản lý phiên bản tồi), cài đặt và cấu hình Git trên cả ba hệ điều hành, tạo khoá SSH cho GitHub, và cách học khoá này để kiến thức đọng lại.',
  lessons: [
    /* ─────────────────────────── 0.0 ─────────────────────────── */
    {
      title: '0.0 — Section 0 slides: getting started in pictures|||0.0 — Slide Mục 0: bắt đầu với Git bằng hình',
      slug: 'git-0-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 17 slide của Mục 0: khoá này cho ai, lộ trình 17 phần, vấn đề "final_v2_THẬT.docx", Git khác GitHub, cài đặt trên ba hệ điều hành, git config, khoá SSH và sân tập thu-git.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Slides</span>
<h2>Section 0 in 17 slides</h2>
<p class="lead">Skim these before reading the lessons to see where the whole course goes, then keep them open while you install Git and create your SSH key. Every picture here reappears inside the lesson that explains it.</p>
<p>The slides are in Vietnamese; the pictures (the 17-stop roadmap, Git vs GitHub, the SSH key pair) read the same in any language. Every terminal on the slides is real output from a real run. The last two slides are a cheat sheet and a 30-minute setup session — finish that session and you are ready for Chapter 1.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Slide</span>
<h2>Mục 0 trong 17 slide</h2>
<p class="lead">Lướt bộ này trước khi đọc bài để thấy cả khoá sẽ đi tới đâu, rồi mở nó bên cạnh lúc bạn cài Git và tạo khoá SSH. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó.</p>
<p>Mọi terminal trên slide là output thật của một lần chạy thật. Hai slide cuối là bảng tra nhanh và một buổi cài đặt 30 phút — làm xong buổi đó là bạn sẵn sàng vào Chương 1.</p>
</div>
${gallery('git-00', [
  [1, 'Bìa'], [2, 'Bản đồ Mục 0'], [3, 'Khoá này viết cho ai'], [4, 'Lộ trình toàn khoá — 17 phần'],
  [5, 'Ba chương mới 14–16'], [6, 'final_v2_THẬT.docx và git log'], [7, 'Bốn thứ thư mục không làm được'],
  [8, 'Ba thế hệ quản lý phiên bản'], [9, 'Git ≠ GitHub'], [10, 'Cài Git trên ba hệ điều hành'], [11, 'git config tối thiểu'],
  [12, 'Khoá SSH: một cặp, hai nửa'], [13, 'Khoá SSH — output thật'], [14, 'Sân tập thu-git'],
  [15, 'Ba câu hỏi trước khi bấm Enter'], [16, 'Bảng tra nhanh'], [17, 'Thực hành Mục 0'],
])}
`,
    },

    /* ─────────────────────────── 0.1 ─────────────────────────── */
    {
      title: '0.1 — Who this course is for & the full roadmap|||0.1 — Khoá này cho ai & lộ trình toàn khoá',
      slug: 'git-0-1-gioi-thieu-lo-trinh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao hầu hết lập trình viên chỉ dùng được 5 lệnh Git và sợ hãi mọi lệnh còn lại, khoá này lấp khoảng trống nào, và bản đồ toàn khoá (Mục 0 + 16 chương, bài thi cuối khoá ở cuối Chương 16) từ commit đầu tiên tới một dự án nhóm thật.',
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
${slide('git-00', 3, 'Khoá này viết cho ai')}
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
${slide('git-00', 4, 'Lộ trình toàn khoá — 17 phần')}
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

<div class="callout warn"><strong>Roadmap update (09/2026):</strong> the map above is the original plan and is kept as written. Since then the course has grown to <strong>16 chapters</strong> (17 parts counting this Section 0). The old stop "14 — Git in a real workflow" now lives inside Chapter 13 as lesson 13.2, and three new chapters were added below. Lesson 13.3 is now a check on Chapter 13 only.</div>
<h3>New in 09/2026 — Chapters 14–16</h3>
${slide('git-00', 5, 'Ba chương mới 14–16')}
<div class="lz-map">
  <div class="lz-stage">Part 6 — Tools, career &amp; a real team project (Ch 14–16)</div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Everyday Git in your tools</div><div class="lz-nsub">VS Code Source Control (stage single lines, the 3-column merge editor), Git Graph / GitLens, GitHub Desktop, lazygit; advanced .gitconfig (aliases, includeIf for school vs personal email); working with Windows teammates (CRLF/LF, .gitattributes)</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">GitHub for students</div><div class="lz-nsub">Profile README, pinned repos and project READMEs recruiters actually read, GitHub Pages for a portfolio, the Student Developer Pack and Codespaces, your first open-source contribution</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">Capstone: running a team project on GitHub</div><div class="lz-nsub">A 4-student SWP391-style project ("clinic booking", 3 weeks): setting up the repo, one full sprint with a real conflict, tagging v1.0.0 and a hotfix, and 8 classic team incidents with their rescue</div></div></div>
</div>
<div class="callout ok"><strong>The final course exam — 20 questions — sits at the end of Chapter 16</strong> (lesson 16.5). It covers Chapters 1–16 with real situations, and every question comes with an explanation. Each chapter before that ends with its own 10-question check.</div>

<h3>How this course is different from the docs</h3>
<p>The official documentation is a <em>reference</em>: it tells you every flag of every command, and assumes you already know which command you want. This course is a <em>path</em>: it introduces one idea at a time, shows the real terminal output, and tells you which mistake that idea prevents. Keep the reference open beside it — the two are complementary, not competing.</p>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Open a terminal (on Windows: Git Bash) and run <code>git --version</code>. If it prints a version of 2.30 or newer, note it down; if it says "command not found", your first stop is lesson 0.3.</li><li>Find the card on slide 3 that describes you today, and write down which chapters it points to.</li><li>Write down three Git moments from your own team projects (SWP391 or similar) that scared or confused you — for example "I pushed straight to main", "package-lock.json conflicted again", "a teammate committed the .env file".</li><li>Using the roadmap (slide 4 and the map above), put a chapter number next to each moment. Then give Chapters 1–4 a date in your calendar — one chapter per sitting.</li></ol>
<pre><code class="language-bash"><span class="tok-comment"># example of what your note can look like</span>
pushed straight to main            → Ch 4 (undo), Ch 6 (protected branches), Ch 13
package-lock.json conflict         → Ch 3 (conflicts), Ch 16.4
.env committed by a teammate       → Ch 1.5 (.gitignore), Ch 8, Ch 13</code></pre>
<p><strong>Done when:</strong> you have the output of <code>git --version</code> (or know you must install first), three real moments each mapped to at least one chapter number, and dates written down for Chapters 1–4.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Snapshot</span><span class="v">A full picture of the whole project at one moment. Git stores a chain of these, not a list of edits.</span></div>
  <div class="kv"><span class="k">Pointer / ref</span><span class="v">A name that points at one snapshot: a branch, a tag, or <code>HEAD</code> ("you are here").</span></div>
  <div class="kv"><span class="k">Roadmap</span><span class="v">The 17-part route of this course: Section 0 plus Chapters 1–16.</span></div>
  <div class="kv"><span class="k">Capstone</span><span class="v">The final team project in Chapter 16 where every earlier chapter is used together.</span></div>
  <div class="kv"><span class="k">Final exam</span><span class="v">The 20-question test at the end of Chapter 16 (lesson 16.5), covering the whole course.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Git stores snapshots plus a few pointers; every command either creates a snapshot or moves a pointer.</li><li>The course is 17 parts: Section 0 plus 16 chapters, from the model (Ch 1) to a real team project (Ch 16).</li><li>Chapters 1–4 are the foundation — do them in order; Chapter 13 can be opened mid-emergency.</li><li>Chapters 14–16 (new 09/2026) cover everyday tools, your GitHub profile as a student, and a capstone team project.</li><li>The 20-question final exam is at the end of Chapter 16; every other chapter ends with a 10-question check.</li></ul>

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
${slide('git-00', 3, 'Khoá này viết cho ai')}
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
${slide('git-00', 4, 'Lộ trình toàn khoá — 17 phần')}
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

<div class="callout warn"><strong>Cập nhật lộ trình (09/2026):</strong> bản đồ phía trên là kế hoạch ban đầu, được giữ nguyên văn. Từ đó khoá đã lớn lên thành <strong>16 chương</strong> (17 phần nếu tính cả Mục 0 này). Trạm cũ "14 — Git trong quy trình thật" nay nằm trong Chương 13 dưới dạng bài 13.2, và ba chương mới được thêm vào bên dưới. Bài 13.3 giờ chỉ kiểm tra riêng Chương 13.</div>
<h3>Mới 09/2026 — Chương 14–16</h3>
${slide('git-00', 5, 'Ba chương mới 14–16')}
<div class="lz-map">
  <div class="lz-stage">Phần 6 — Công cụ, nghề nghiệp &amp; một dự án nhóm thật (Ch 14–16)</div>
  <div class="lz-node"><div class="lz-badge">14</div><div class="lz-nbody"><div class="lz-ntitle">Git hằng ngày trong công cụ</div><div class="lz-nsub">Source Control của VS Code (stage từng dòng, merge editor — trình giải xung đột — 3 cột), Git Graph / GitLens, GitHub Desktop, lazygit; .gitconfig nâng cao (alias — tên tắt, includeIf để tách email trường và email cá nhân); làm nhóm với bạn dùng Windows (CRLF/LF, .gitattributes)</div></div></div>
  <div class="lz-node"><div class="lz-badge">15</div><div class="lz-nbody"><div class="lz-ntitle">GitHub cho sinh viên</div><div class="lz-nsub">Profile README (trang giới thiệu bản thân), ghim repo và README dự án mà nhà tuyển dụng thật sự đọc, GitHub Pages cho portfolio, Student Developer Pack (gói quyền lợi sinh viên) và Codespaces, lần đóng góp mã nguồn mở đầu tiên</div></div></div>
  <div class="lz-node"><div class="lz-badge">16</div><div class="lz-nbody"><div class="lz-ntitle">Dự án nhóm cuối khoá</div><div class="lz-nsub">Nhóm 4 sinh viên làm đồ án kiểu SWP391 ("Đặt lịch phòng khám", 3 tuần): dựng repo, một sprint trọn vẹn có xung đột thật, gắn tag v1.0.0 và hotfix (bản vá gấp), 8 sự cố kinh điển của nhóm và cách cứu</div></div></div>
</div>
<div class="callout ok"><strong>Bài thi cuối khoá 20 câu nằm ở cuối Chương 16</strong> (bài 16.5). Nó trải đều Chương 1–16 bằng tình huống thật, câu nào cũng có giải thích. Trước đó, mỗi chương kết thúc bằng bài kiểm tra 10 câu của riêng nó.</div>

<h3>Khoá này khác tài liệu chính thức ở chỗ nào</h3>
<p>Tài liệu chính thức là một <em>cuốn tra cứu</em>: nó liệt kê mọi cờ của mọi lệnh, và giả định bạn đã biết mình cần lệnh nào. Khoá này là một <em>con đường</em>: nó giới thiệu mỗi lần một ý, đưa ra output terminal thật, và nói cho bạn biết ý đó ngăn được sai lầm nào. Hãy mở cuốn tra cứu bên cạnh — hai thứ bổ sung cho nhau, không cạnh tranh.</p>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Mở terminal (Windows: mở Git Bash) và chạy <code>git --version</code>. Nếu nó in ra phiên bản từ 2.30 trở lên, ghi lại; nếu báo "command not found" (không tìm thấy lệnh), điểm dừng đầu tiên của bạn là bài 0.3.</li><li>Tìm thẻ trên slide 3 mô tả đúng bạn lúc này, ghi lại nó trỏ tới những chương nào.</li><li>Ghi ra ba khoảnh khắc Git trong đồ án nhóm của chính bạn (SWP391 hay tương tự) từng làm bạn sợ hoặc rối — ví dụ "mình push thẳng lên main", "package-lock.json lại xung đột", "một bạn commit luôn file .env".</li><li>Dùng lộ trình (slide 4 và bản đồ phía trên), ghi số chương cạnh từng khoảnh khắc. Rồi đặt ngày cho Chương 1–4 trong lịch — mỗi buổi một chương.</li></ol>
<pre><code class="language-bash"><span class="tok-comment"># ví dụ ghi chú của bạn có thể trông thế này</span>
push thẳng lên main                → Ch 4 (hoàn tác), Ch 6 (nhánh bảo vệ), Ch 13
xung đột package-lock.json         → Ch 3 (xung đột), Ch 16.4
bạn cùng nhóm commit file .env     → Ch 1.5 (.gitignore), Ch 8, Ch 13</code></pre>
<p><strong>Đạt khi:</strong> bạn có output của <code>git --version</code> (hoặc biết mình phải cài trước), ba khoảnh khắc thật mỗi cái gắn với ít nhất một số chương, và ngày học Chương 1–4 đã ghi vào lịch.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Snapshot</span><span class="v">Ảnh chụp — bức hình đầy đủ của cả dự án tại một thời điểm. Git lưu một chuỗi những ảnh này, không phải danh sách chỗ sửa.</span></div>
  <div class="kv"><span class="k">Pointer / ref</span><span class="v">Con trỏ / tham chiếu — một cái tên trỏ vào một ảnh chụp: nhánh, tag, hoặc <code>HEAD</code> ("bạn đang ở đây").</span></div>
  <div class="kv"><span class="k">Roadmap</span><span class="v">Lộ trình — con đường 17 phần của khoá: Mục 0 cộng Chương 1–16.</span></div>
  <div class="kv"><span class="k">Capstone</span><span class="v">Dự án tổng kết — đồ án nhóm ở Chương 16, nơi mọi chương trước được dùng cùng lúc.</span></div>
  <div class="kv"><span class="k">Final exam</span><span class="v">Bài thi cuối khoá — 20 câu ở cuối Chương 16 (bài 16.5), phủ toàn bộ khoá.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Git lưu ảnh chụp cộng vài con trỏ; mọi lệnh hoặc tạo ảnh chụp, hoặc dời con trỏ.</li><li>Khoá có 17 phần: Mục 0 cộng 16 chương, từ mô hình (Ch 1) tới một dự án nhóm thật (Ch 16).</li><li>Chương 1–4 là nền móng — học theo thứ tự; Chương 13 mở ra được ngay giữa lúc sự cố.</li><li>Chương 14–16 (mới 09/2026) dạy công cụ hằng ngày, hồ sơ GitHub của sinh viên và một dự án nhóm tổng kết.</li><li>Bài thi cuối khoá 20 câu nằm ở cuối Chương 16; mọi chương khác kết thúc bằng bài kiểm tra 10 câu.</li></ul>

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
${slide('git-00', 6, 'final_v2_THẬT.docx và git log')}
${slide('git-00', 7, 'Bốn thứ thư mục không làm được')}
<div class="kv-grid">
  <div class="kv"><span class="k">It cannot say WHY</span><span class="v">The file name records <em>when</em>-ish, never <em>why</em>. Six months later nobody knows what "FIXED" fixed. Git attaches a message, an author and a timestamp to every version.</span></div>
  <div class="kv"><span class="k">It cannot show WHAT changed</span><span class="v">To find the difference between v2 and final you must read both documents. Git computes the difference for you, line by line, in a second.</span></div>
  <div class="kv"><span class="k">It cannot merge two people's work</span><span class="v">If An and Bình both edit <code>report_final</code>, one of them loses. Git merges both sets of changes automatically when they touch different lines, and asks you only about genuine overlaps.</span></div>
  <div class="kv"><span class="k">It cannot go back safely</span><span class="v">Restoring an old version means copying files over the new ones — destroying the new work. In Git every version stays reachable forever; going back adds history rather than erasing it.</span></div>
</div>

<h3>What a version control system is, precisely</h3>
${slide('git-00', 8, 'Ba thế hệ quản lý phiên bản')}
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

<h3>Git is not GitHub either</h3>
${slide('git-00', 9, 'Git ≠ GitHub')}
<p>Beginners often use the two names as one word. They are different things, and mixing them up leads to wrong mental models ("GitHub is down, so I cannot commit"):</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Git</span><span class="v">A free, open-source program that runs on <em>your</em> machine. Commits, branches, merges and the whole history live in the hidden <code>.git/</code> folder of your project. It works with no network and no account.</span></div>
  <div class="kv"><span class="k">GitHub</span><span class="v">A website (owned by Microsoft) that hosts Git repositories so a team can share one. It adds things Git itself does not have: pull requests, issues, Actions, Pages. GitLab, Bitbucket and Gitea are alternatives that speak the same Git protocol.</span></div>
</div>
<p>Everything in Chapters 1–4 happens in Git, on your laptop. GitHub enters in Chapter 5, when you start exchanging commits with other people through <code>git push</code> and <code>git pull</code>.</p>

<h3>The vocabulary you need for Chapter 1</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">repository (repo)</span><span class="v">A project folder plus the hidden <code>.git/</code> directory holding its full history.</span></div>
  <div class="kv"><span class="k">commit</span><span class="v">One saved version — a snapshot of the whole project plus a message, an author and a link to its parent.</span></div>
  <div class="kv"><span class="k">branch</span><span class="v">A movable pointer to a commit. Used to develop something without disturbing the main line.</span></div>
  <div class="kv"><span class="k">remote</span><span class="v">Another copy of the repository, usually on a server such as GitHub, that you exchange commits with.</span></div>
  <div class="kv"><span class="k">clone / push / pull</span><span class="v">Copy a whole repository down · send your commits up · bring other people's commits down.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Rebuild the "report" story with Git instead of file names. In any scratch folder: <code>mkdir bao-cao &amp;&amp; cd bao-cao &amp;&amp; git init</code>, create <code>bao-cao.md</code> with a title line and "Chương 1: Giới thiệu", then commit it <em>as An</em> (the <code>-c</code> flags set a name for one command only — you configure your own name properly in 0.3).</li><li>Append a line "Chương 2: Yêu cầu hệ thống" and commit it <em>as Bình</em>.</li><li>Open the file in your editor, change line 2 to "Chương 1: Giới thiệu đề tài đặt lịch phòng khám", and commit as An with a message that says <strong>why</strong>.</li><li>Now answer, using only Git: who changed the topic title, when, why, and which exact line changed?</li></ol>
<pre><code class="language-bash">printf <span class="tok-string">'# Báo cáo SWP391\\nChương 1: Giới thiệu\\n'</span> &gt; bao-cao.md
git add . &amp;&amp; git -c user.name=An -c user.email=an@example.com commit -m <span class="tok-string">"Thêm dàn ý báo cáo"</span>
printf <span class="tok-string">'Chương 2: Yêu cầu hệ thống\\n'</span> &gt;&gt; bao-cao.md
git -c user.name=Binh -c user.email=binh@example.com commit -am <span class="tok-string">"Viết chương 2: yêu cầu hệ thống"</span>
<span class="tok-comment"># … edit line 2 in your editor, then:</span>
git -c user.name=An -c user.email=an@example.com commit -am <span class="tok-string">"Sửa tên đề tài theo góp ý của thầy"</span>
git log --format=<span class="tok-string">"%h %ad %an: %s"</span> --date=format:%d/%m
git diff HEAD~1</code></pre>
<div class="out">c09109c 16/09 An: Sửa tên đề tài theo góp ý của thầy
9925789 15/09 Binh: Viết chương 2: yêu cầu hệ thống
63a7a1a 14/09 An: Thêm dàn ý báo cáo
…
-Chương 1: Giới thiệu
+Chương 1: Giới thiệu đề tài đặt lịch phòng khám</div>
<p>(Real output from git 2.51. Your hashes and dates will differ — they depend on the exact content and the moment you commit.)</p>
<p><strong>Done when:</strong> <code>git log</code> shows three commits from two authors, and <code>git diff HEAD~1</code> shows exactly one <code>-</code> line and one <code>+</code> line — the answer to "what changed" that the folder of <code>_final_v2</code> files could never give you.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Version control system (VCS)</span><span class="v">A tool that records changes to files over time so you can get any earlier version back.</span></div>
  <div class="kv"><span class="k">Centralised vs distributed</span><span class="v">One server holds the history, versus every clone holding the complete history.</span></div>
  <div class="kv"><span class="k">Repository (repo)</span><span class="v">Your project folder plus the hidden <code>.git/</code> folder with its full history.</span></div>
  <div class="kv"><span class="k">Hosting service</span><span class="v">A website such as GitHub that stores a shared copy of a Git repository for a team.</span></div>
  <div class="kv"><span class="k">Diff</span><span class="v">The line-by-line difference between two versions: <code>-</code> lines removed, <code>+</code> lines added.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Folders of <code>_final_v2</code> files are a version control system — one that cannot say why, show what, merge, or go back safely.</li><li>Git is distributed: every clone is a full copy of the history, so it works offline and survives a server outage.</li><li>Git is not Dropbox: it syncs only when you deliberately commit and push, and that gap is where review happens.</li><li>Git is not GitHub: Git is the program on your machine; GitHub is a website that hosts repositories and adds PRs, issues and Actions.</li><li>Keep repositories out of Dropbox / Google Drive / OneDrive folders — use a Git remote to share.</li></ul>

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
${slide('git-00', 6, 'final_v2_THẬT.docx và git log')}
${slide('git-00', 7, 'Bốn thứ thư mục không làm được')}
<div class="kv-grid">
  <div class="kv"><span class="k">Không nói được VÌ SAO</span><span class="v">Tên file ghi lại <em>khi nào</em> một cách mập mờ, không bao giờ ghi <em>vì sao</em>. Sáu tháng sau không ai biết "SUA" đã sửa cái gì. Git gắn một lời nhắn, một tác giả và một dấu thời gian vào mọi phiên bản.</span></div>
  <div class="kv"><span class="k">Không cho thấy ĐÃ ĐỔI GÌ</span><span class="v">Muốn biết v2 khác final chỗ nào, bạn phải đọc cả hai tài liệu. Git tính hộ bạn phần khác biệt, từng dòng một, trong một giây.</span></div>
  <div class="kv"><span class="k">Không hợp nhất được việc của hai người</span><span class="v">Nếu An và Bình cùng sửa <code>bao_cao_final</code>, một người sẽ mất công. Git hợp nhất tự động cả hai bộ thay đổi khi chúng chạm những dòng khác nhau, và chỉ hỏi bạn ở chỗ chồng lấn thật sự.</span></div>
  <div class="kv"><span class="k">Không quay lại được an toàn</span><span class="v">Khôi phục bản cũ nghĩa là chép đè lên bản mới — huỷ luôn việc mới. Trong Git mọi phiên bản còn với tới được mãi mãi; quay lại là thêm vào lịch sử chứ không xoá đi.</span></div>
</div>

<h3>Hệ quản lý phiên bản là gì, nói cho chính xác</h3>
${slide('git-00', 8, 'Ba thế hệ quản lý phiên bản')}
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

<h3>Git cũng không phải GitHub</h3>
${slide('git-00', 9, 'Git ≠ GitHub')}
<p>Người mới hay gọi hai cái tên như một. Chúng là hai thứ khác nhau, và nhầm chúng dẫn tới mô hình tư duy sai ("GitHub sập nên mình không commit được"):</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Git</span><span class="v">Một phần mềm miễn phí, mã nguồn mở, chạy trên máy <em>của bạn</em>. Commit, nhánh, merge và toàn bộ lịch sử nằm trong thư mục ẩn <code>.git/</code> của dự án. Nó chạy được khi không có mạng và không cần tài khoản nào.</span></div>
  <div class="kv"><span class="k">GitHub</span><span class="v">Một trang web (thuộc Microsoft) lưu hộ (host) các kho Git để cả nhóm dùng chung một kho. Nó thêm những thứ Git không có: pull request (yêu cầu gộp mã), issue (phiếu công việc), Actions (tự động hoá), Pages (trang web tĩnh). GitLab, Bitbucket, Gitea là các lựa chọn khác, nói cùng giao thức Git.</span></div>
</div>
<p>Mọi thứ trong Chương 1–4 diễn ra trong Git, trên laptop của bạn. GitHub bước vào ở Chương 5, khi bạn bắt đầu trao đổi commit với người khác qua <code>git push</code> và <code>git pull</code>.</p>

<h3>Bộ từ vựng bạn cần cho Chương 1</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">kho mã (repository, repo)</span><span class="v">Một thư mục dự án cộng với thư mục ẩn <code>.git/</code> giữ toàn bộ lịch sử của nó.</span></div>
  <div class="kv"><span class="k">commit</span><span class="v">Một phiên bản đã lưu — ảnh chụp toàn dự án cộng lời nhắn, tác giả và liên kết tới commit cha.</span></div>
  <div class="kv"><span class="k">nhánh (branch)</span><span class="v">Một con trỏ di chuyển được, trỏ tới một commit. Dùng để phát triển thứ gì đó mà không quấy vào dòng chính.</span></div>
  <div class="kv"><span class="k">remote</span><span class="v">Một bản sao khác của kho mã, thường nằm trên máy chủ như GitHub, để bạn trao đổi commit với nó.</span></div>
  <div class="kv"><span class="k">clone / push / pull</span><span class="v">Chép cả kho mã về · đẩy commit của bạn lên · kéo commit của người khác về.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Dựng lại câu chuyện "báo cáo" bằng Git thay vì bằng tên file. Trong một thư mục nháp bất kỳ: <code>mkdir bao-cao &amp;&amp; cd bao-cao &amp;&amp; git init</code>, tạo <code>bao-cao.md</code> có dòng tiêu đề và "Chương 1: Giới thiệu", rồi commit <em>dưới tên An</em> (cờ <code>-c</code> đặt tên cho đúng một lệnh — bạn sẽ cấu hình tên thật của mình ở bài 0.3).</li><li>Thêm dòng "Chương 2: Yêu cầu hệ thống" rồi commit <em>dưới tên Bình</em>.</li><li>Mở file bằng trình soạn thảo, sửa dòng 2 thành "Chương 1: Giới thiệu đề tài đặt lịch phòng khám", rồi commit dưới tên An với lời nhắn nói rõ <strong>vì sao</strong>.</li><li>Giờ trả lời, chỉ bằng Git: ai đã đổi tên đề tài, lúc nào, vì sao, và đúng dòng nào đã đổi?</li></ol>
<pre><code class="language-bash">printf <span class="tok-string">'# Báo cáo SWP391\\nChương 1: Giới thiệu\\n'</span> &gt; bao-cao.md
git add . &amp;&amp; git -c user.name=An -c user.email=an@example.com commit -m <span class="tok-string">"Thêm dàn ý báo cáo"</span>
printf <span class="tok-string">'Chương 2: Yêu cầu hệ thống\\n'</span> &gt;&gt; bao-cao.md
git -c user.name=Binh -c user.email=binh@example.com commit -am <span class="tok-string">"Viết chương 2: yêu cầu hệ thống"</span>
<span class="tok-comment"># … sửa dòng 2 trong trình soạn thảo, rồi:</span>
git -c user.name=An -c user.email=an@example.com commit -am <span class="tok-string">"Sửa tên đề tài theo góp ý của thầy"</span>
git log --format=<span class="tok-string">"%h %ad %an: %s"</span> --date=format:%d/%m
git diff HEAD~1</code></pre>
<div class="out">c09109c 16/09 An: Sửa tên đề tài theo góp ý của thầy
9925789 15/09 Binh: Viết chương 2: yêu cầu hệ thống
63a7a1a 14/09 An: Thêm dàn ý báo cáo
…
-Chương 1: Giới thiệu
+Chương 1: Giới thiệu đề tài đặt lịch phòng khám</div>
<p>(Output thật từ git 2.51. Mã băm và ngày của bạn sẽ khác — chúng phụ thuộc đúng nội dung và thời điểm bạn commit.)</p>
<p><strong>Đạt khi:</strong> <code>git log</code> có ba commit của hai tác giả, và <code>git diff HEAD~1</code> hiện đúng một dòng <code>-</code> và một dòng <code>+</code> — câu trả lời cho "đã đổi gì" mà thư mục đầy file <code>_final_v2</code> không bao giờ cho bạn được.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Version control system (VCS)</span><span class="v">Hệ quản lý phiên bản — công cụ ghi lại thay đổi của file theo thời gian để lấy lại được bất kỳ bản cũ nào.</span></div>
  <div class="kv"><span class="k">Centralised vs distributed</span><span class="v">Tập trung và phân tán — một máy chủ giữ lịch sử, so với mỗi bản clone đều giữ ĐỦ lịch sử.</span></div>
  <div class="kv"><span class="k">Repository (repo)</span><span class="v">Kho mã — thư mục dự án cộng thư mục ẩn <code>.git/</code> chứa toàn bộ lịch sử.</span></div>
  <div class="kv"><span class="k">Hosting service</span><span class="v">Dịch vụ lưu kho — trang web như GitHub giữ một bản sao dùng chung của kho Git cho cả nhóm.</span></div>
  <div class="kv"><span class="k">Diff</span><span class="v">Phần khác biệt — so từng dòng giữa hai phiên bản: dòng <code>-</code> bị bỏ, dòng <code>+</code> được thêm.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Thư mục đầy file <code>_final_v2</code> cũng là một hệ quản lý phiên bản — một cái không nói được vì sao, không cho thấy đổi gì, không hợp nhất được, không quay lại an toàn được.</li><li>Git là phân tán: mỗi bản clone là bản sao đầy đủ của lịch sử, nên chạy được khi mất mạng và sống sót khi máy chủ sập.</li><li>Git không phải Dropbox: nó chỉ đồng bộ khi bạn chủ ý commit và push, và khoảng ngắt đó là nơi review diễn ra.</li><li>Git không phải GitHub: Git là phần mềm trên máy bạn; GitHub là trang web lưu kho và thêm PR, issue, Actions.</li><li>Đừng để kho mã trong thư mục Dropbox / Google Drive / OneDrive — chia sẻ bằng remote của Git.</li></ul>

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
${slide('git-00', 10, 'Cài Git trên ba hệ điều hành')}
<div class="kv-grid">
  <div class="kv"><span class="k">Windows</span><span class="v">Install <strong>Git for Windows</strong> from git-scm.com. It bundles Git Bash, which gives you a real POSIX shell — use it for this course instead of PowerShell so every command in these lessons works verbatim.</span></div>
  <div class="kv"><span class="k">macOS</span><span class="v"><code>brew install git</code>. macOS ships an old Apple build; Homebrew's is current. Without Homebrew, running <code>git --version</code> once will offer to install the Xcode Command Line Tools.</span></div>
  <div class="kv"><span class="k">Linux</span><span class="v"><code>sudo apt install git</code> (Debian/Ubuntu) or <code>sudo dnf install git</code> (Fedora).</span></div>
</div>
<div class="callout ok"><strong>Checked against git-scm.com (as of 09/2026):</strong> the latest Git is <strong>2.55.0</strong>; Git for Windows is <strong>2.55.0(5)</strong>, released 20/08/2026, with separate installers for x64 and ARM64 plus a portable edition. On Windows you can also install from the terminal with <code>winget install --id Git.Git -e --source winget</code>. On macOS without Homebrew, <code>xcode-select --install</code> gives you Apple's build (older, but fine for this course); the old standalone macOS installer on git-scm.com is no longer maintained. On Ubuntu, <code>sudo add-apt-repository ppa:git-core/ppa</code> gets you the newest release instead of the distribution's one.</div>
<p>If your teammates are on Windows: during the Git for Windows installer, keep the defaults for line endings and the terminal — they match what this course assumes (Git Bash, <code>core.autocrlf true</code>). The one screen worth changing is the default editor: the installer suggests Vim, and picking VS Code or Nano there saves beginners from being stuck inside Vim on their first commit message.</p>
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
${slide('git-00', 11, 'git config tối thiểu và ba mức cấu hình')}
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

<p>To see which level a value came from without long file paths, ask for the <em>scope</em>. Inside a project where you set a local email, both values show up, and the last one wins:</p>
<pre><code class="language-bash">git config --show-scope --get-all user.email
git config user.email</code></pre>
<div class="out">global	cuong@example.com
local	cuong.nv@fpt.edu.vn
cuong.nv@fpt.edu.vn</div>
<h3>5. An SSH key for GitHub</h3>
${slide('git-00', 12, 'Khoá SSH: một cặp, hai nửa')}
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
${slide('git-00', 13, 'Khoá SSH — output thật')}
<div class="callout warn"><strong>What you will really see (OpenSSH 10.3, 09/2026):</strong> after the passphrase prompts, <code>ssh-keygen</code> prints a fingerprint line such as <code>SHA256:asAafUeDlp1FG1HSFW5Ar4TpAUo7zkvyEt3QbKu9E58 cuong@example.com</code> and a small "randomart" box — both are normal. The first time you connect, SSH asks whether to trust <code>github.com</code>; answer <code>yes</code> only if the fingerprint matches the one GitHub publishes: <code>SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU</code> (ED25519). And if you run <code>ssh -T</code> before adding the key to GitHub, the answer is <code>git@github.com: Permission denied (publickey).</code> — that means "GitHub does not know this key yet", not that SSH is broken.</div>
<div class="callout danger">The two files are not interchangeable. <code>id_ed25519.pub</code> is the <strong>public</strong> key — safe to paste anywhere. <code>id_ed25519</code> with no extension is the <strong>private</strong> key — it is a password. Never paste it into a website, never commit it, never send it in a chat. If it ever leaks, delete the key on GitHub and generate a new pair.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Install Git for your OS (table above) and confirm <code>git --version</code> prints 2.30 or newer. Windows: do everything below in Git Bash.</li><li>Run the identity and "prevent bugs" settings with <strong>your</strong> name and the email that is on your GitHub account, then check them with <code>git config --list --show-scope</code>.</li><li>Go into the <code>bao-cao</code> folder from 0.2 and give it your school email only there: <code>git config user.email "you@fpt.edu.vn"</code>. Make one commit and check which email it carries.</li><li>Create an ed25519 key <em>with a passphrase</em>, add the <code>.pub</code> half on GitHub (Settings → SSH and GPG keys → New SSH key), and run <code>ssh -T git@github.com</code>.</li></ol>
<pre><code class="language-bash">git config --show-scope --get-all user.email
git log -1 --format=<span class="tok-string">"%h %an &lt;%ae&gt;"</span></code></pre>
<div class="out">global	cuong@example.com
local	cuong.nv@fpt.edu.vn
697bba5 Nguyen Van Cuong &lt;cuong.nv@fpt.edu.vn&gt;</div>
<p><strong>Done when:</strong> <code>git config --list --show-scope</code> lists your name, email, <code>init.defaultbranch=main</code> and <code>core.autocrlf</code>; the commit in <code>bao-cao</code> carries the school email while your global email is unchanged; and <code>ssh -T git@github.com</code> greets <strong>your</strong> GitHub username.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Global / local config</span><span class="v"><code>~/.gitconfig</code> applies to you everywhere; <code>.git/config</code> applies to one repository and wins.</span></div>
  <div class="kv"><span class="k">Line endings (CRLF / LF)</span><span class="v">Windows ends lines with two invisible characters, macOS/Linux with one; <code>core.autocrlf</code> converts them.</span></div>
  <div class="kv"><span class="k">SSH key pair</span><span class="v">Two files made together: a private key that stays on your machine and a public key you give to GitHub.</span></div>
  <div class="kv"><span class="k">Passphrase</span><span class="v">A password that protects the private key file itself; the ssh-agent remembers it for the session.</span></div>
  <div class="kv"><span class="k">Fingerprint</span><span class="v">A short hash that identifies a key — used to check you are really talking to github.com.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Install Git from the official source for your OS; 2.30 or newer is enough for this course.</li><li>Set <code>user.name</code> and <code>user.email</code> once, globally, with the email that is on your GitHub account.</li><li>A local <code>git config</code> inside a repository overrides the global one — use it for school or company email.</li><li><code>ssh-keygen -t ed25519</code> makes a key pair; only the <code>.pub</code> half ever leaves your machine.</li><li><code>ssh -T git@github.com</code> answering "Hi username!" is success; "Permission denied (publickey)" means the key is not on GitHub yet.</li></ul>

<a class="link-card" href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Connecting to GitHub with SSH</span><span class="lc-sub">Per-OS instructions, agent setup, and troubleshooting a refused key.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-config" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">git config — the full list of settings</span><span class="lc-sub">Every option, with its default and its scope. Search this before inventing a workaround.</span></span>
</a>

<a class="link-card" href="https://git-scm.com/downloads" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">git-scm.com — Install Git</span><span class="lc-sub">The official install page for macOS, Windows and Linux, with the current version number.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Testing your SSH connection</span><span class="lc-sub">The exact success message and GitHub's published host-key fingerprints.</span></span>
</a>
<div class="pitfall"><strong>Trap:</strong> setting <code>user.email</code> to something that is not on your GitHub account, then wondering why months of work shows up as "unknown author" and your contribution graph stays empty. Fixing it later means <em>rewriting history</em> (Chapter 8) on every affected commit. Check it now: <code>git config user.email</code>.</div>
<p class="note-ct"><strong>One habit worth forming today:</strong> when you clone a repository for a client or employer, immediately run <code>git config user.email work@company.com</code> <em>inside that repository</em>. Local config beats global, so your personal address never leaks into their history and their address never leaks into your open-source commits.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Mười lăm phút cài đặt để tránh một năm bực bội vặt</h2>
<p class="lead">Đa số hướng dẫn Git nói "cài Git, đặt tên, xong". Thế là đủ để tạo một commit và KHÔNG đủ để làm việc trong một nhóm. Bốn thiết lập dưới đây tồn tại đúng để chặn những vấn đề rất khó sửa về sau — nhất là ký tự xuống dòng, thứ có thể biến một thay đổi một dòng thành một diff 4.000 dòng.</p>

<h3>1. Cài đặt</h3>
${slide('git-00', 10, 'Cài Git trên ba hệ điều hành')}
<div class="kv-grid">
  <div class="kv"><span class="k">Windows</span><span class="v">Cài <strong>Git for Windows</strong> từ git-scm.com. Nó kèm Git Bash, cho bạn một shell POSIX thật — dùng nó cho khoá này thay vì PowerShell để mọi lệnh trong các bài chạy đúng nguyên văn.</span></div>
  <div class="kv"><span class="k">macOS</span><span class="v"><code>brew install git</code>. macOS đi kèm một bản Apple cũ; bản của Homebrew mới hơn. Không có Homebrew thì chỉ cần chạy <code>git --version</code> một lần, máy sẽ mời cài Xcode Command Line Tools.</span></div>
  <div class="kv"><span class="k">Linux</span><span class="v"><code>sudo apt install git</code> (Debian/Ubuntu) hoặc <code>sudo dnf install git</code> (Fedora).</span></div>
</div>
<div class="callout ok"><strong>Đã đối chiếu với git-scm.com (tính đến 09/2026):</strong> Git mới nhất là <strong>2.55.0</strong>; Git for Windows là <strong>2.55.0(5)</strong>, phát hành 20/08/2026, có bộ cài riêng cho x64 và ARM64 cùng một bản portable (chạy không cần cài). Trên Windows bạn cũng cài được từ terminal bằng <code>winget install --id Git.Git -e --source winget</code>. Trên macOS không có Homebrew, <code>xcode-select --install</code> cho bạn bản của Apple (cũ hơn, nhưng đủ cho khoá này); bộ cài macOS riêng trên git-scm.com đã ngừng được bảo trì. Trên Ubuntu, <code>sudo add-apt-repository ppa:git-core/ppa</code> cho bạn bản mới nhất thay vì bản của bản phân phối.</div>
<p>Nếu bạn cùng nhóm dùng Windows: trong trình cài Git for Windows, cứ giữ mặc định ở phần ký tự xuống dòng và terminal — chúng khớp với những gì khoá này giả định (Git Bash, <code>core.autocrlf true</code>). Màn hình duy nhất nên đổi là trình soạn thảo mặc định: trình cài gợi ý Vim, và chọn VS Code hoặc Nano ở đó giúp người mới khỏi bị kẹt trong Vim ngay lời nhắn commit đầu tiên.</p>
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
${slide('git-00', 11, 'git config tối thiểu và ba mức cấu hình')}
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

<p>Muốn biết một giá trị đến từ mức nào mà không phải đọc đường dẫn file dài, hãy hỏi <em>phạm vi</em> (scope). Trong một dự án có đặt email cục bộ, cả hai giá trị cùng hiện ra, và giá trị cuối cùng thắng:</p>
<pre><code class="language-bash">git config --show-scope --get-all user.email
git config user.email</code></pre>
<div class="out">global	cuong@example.com
local	cuong.nv@fpt.edu.vn
cuong.nv@fpt.edu.vn</div>
<h3>5. Một khoá SSH cho GitHub</h3>
${slide('git-00', 12, 'Khoá SSH: một cặp, hai nửa')}
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
${slide('git-00', 13, 'Khoá SSH — output thật')}
<div class="callout warn"><strong>Thứ bạn sẽ thấy thật (OpenSSH 10.3, 09/2026):</strong> sau hai lần hỏi passphrase (mật khẩu bảo vệ khoá), <code>ssh-keygen</code> in một dòng fingerprint (vân tay khoá) kiểu <code>SHA256:asAafUeDlp1FG1HSFW5Ar4TpAUo7zkvyEt3QbKu9E58 cuong@example.com</code> và một ô "randomart" nhỏ — cả hai đều bình thường. Lần đầu kết nối, SSH hỏi có tin <code>github.com</code> không; chỉ trả lời <code>yes</code> khi vân tay khớp với cái GitHub công bố: <code>SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU</code> (ED25519). Và nếu bạn chạy <code>ssh -T</code> TRƯỚC khi nạp khoá lên GitHub, câu trả lời là <code>git@github.com: Permission denied (publickey).</code> — nghĩa là "GitHub chưa biết khoá này", không phải SSH hỏng.</div>
<div class="callout danger">Hai file đó không thay thế cho nhau được. <code>id_ed25519.pub</code> là khoá <strong>công khai</strong> — dán đâu cũng an toàn. <code>id_ed25519</code> không có đuôi là khoá <strong>riêng tư</strong> — nó là một mật khẩu. Đừng bao giờ dán nó vào một trang web, đừng commit, đừng gửi qua chat. Nếu lỡ lộ, xoá khoá đó trên GitHub và tạo cặp mới.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Cài Git cho hệ điều hành của bạn (bảng phía trên) và xác nhận <code>git --version</code> in ra từ 2.30 trở lên. Windows: làm mọi bước dưới đây trong Git Bash.</li><li>Chạy các thiết lập danh tính và "chặn lỗi" với tên của <strong>bạn</strong> và đúng email trên tài khoản GitHub, rồi kiểm bằng <code>git config --list --show-scope</code>.</li><li>Vào thư mục <code>bao-cao</code> từ bài 0.2 và chỉ ở đó đặt email trường: <code>git config user.email "ban@fpt.edu.vn"</code>. Tạo một commit rồi kiểm nó mang email nào.</li><li>Tạo khoá ed25519 <em>có passphrase</em>, nạp nửa <code>.pub</code> lên GitHub (Settings → SSH and GPG keys → New SSH key), rồi chạy <code>ssh -T git@github.com</code>.</li></ol>
<pre><code class="language-bash">git config --show-scope --get-all user.email
git log -1 --format=<span class="tok-string">"%h %an &lt;%ae&gt;"</span></code></pre>
<div class="out">global	cuong@example.com
local	cuong.nv@fpt.edu.vn
697bba5 Nguyen Van Cuong &lt;cuong.nv@fpt.edu.vn&gt;</div>
<p><strong>Đạt khi:</strong> <code>git config --list --show-scope</code> liệt kê tên, email, <code>init.defaultbranch=main</code> và <code>core.autocrlf</code> của bạn; commit trong <code>bao-cao</code> mang email trường còn email toàn cục không đổi; và <code>ssh -T git@github.com</code> chào đúng username GitHub của <strong>bạn</strong>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Global / local config</span><span class="v">Cấu hình toàn cục / cục bộ — <code>~/.gitconfig</code> áp cho bạn ở mọi nơi; <code>.git/config</code> chỉ áp cho một kho và thắng.</span></div>
  <div class="kv"><span class="k">Line endings (CRLF / LF)</span><span class="v">Ký tự xuống dòng — Windows kết thúc dòng bằng hai ký tự vô hình, macOS/Linux bằng một; <code>core.autocrlf</code> chuyển đổi chúng.</span></div>
  <div class="kv"><span class="k">SSH key pair</span><span class="v">Cặp khoá SSH — hai file sinh cùng lúc: khoá riêng nằm yên trên máy bạn, khoá công khai đưa cho GitHub.</span></div>
  <div class="kv"><span class="k">Passphrase</span><span class="v">Mật khẩu bảo vệ chính file khoá riêng; ssh-agent nhớ hộ bạn trong phiên làm việc.</span></div>
  <div class="kv"><span class="k">Fingerprint</span><span class="v">Vân tay khoá — một mã băm ngắn định danh một khoá, dùng để kiểm bạn đang nói chuyện với đúng github.com.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Cài Git từ nguồn chính thức cho hệ điều hành của bạn; từ 2.30 trở lên là đủ cho khoá này.</li><li>Đặt <code>user.name</code> và <code>user.email</code> một lần, ở mức toàn cục, bằng đúng email trên tài khoản GitHub.</li><li><code>git config</code> cục bộ trong một kho đè lên cấu hình toàn cục — dùng cho email trường hoặc email công ty.</li><li><code>ssh-keygen -t ed25519</code> tạo một cặp khoá; chỉ nửa <code>.pub</code> được phép rời khỏi máy bạn.</li><li><code>ssh -T git@github.com</code> trả lời "Hi username!" là thành công; "Permission denied (publickey)" nghĩa là khoá chưa có trên GitHub.</li></ul>

<a class="link-card" href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Kết nối GitHub bằng SSH</span><span class="lc-sub">Hướng dẫn theo từng hệ điều hành, cài agent, và gỡ rối khi khoá bị từ chối.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-config" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">git config — danh sách đầy đủ các thiết lập</span><span class="lc-sub">Mọi tuỳ chọn, kèm giá trị mặc định và phạm vi. Tra ở đây trước khi nghĩ ra một cách lách.</span></span>
</a>

<a class="link-card" href="https://git-scm.com/downloads" target="_blank" rel="noopener">
  <span class="lc-ico">⬇️</span>
  <span class="lc-body"><span class="lc-title">git-scm.com — Cài đặt Git</span><span class="lc-sub">Trang cài đặt chính thức cho macOS, Windows và Linux, kèm số phiên bản hiện hành.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Kiểm tra kết nối SSH</span><span class="lc-sub">Câu chào thành công chính xác và vân tay khoá máy chủ mà GitHub công bố.</span></span>
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
${slide('git-00', 14, 'Sân tập thu-git: phá thoải mái, cứu được hết')}
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
<div class="callout warn"><strong>One name for the playground:</strong> from Chapter 1 onwards every practice box calls this repository <code>thu-git</code> ("try git"). The folder name does not matter to Git, but if you want the practice commands to work word for word, create it as <code>~/thu-git</code> instead of <code>~/git-lab</code>. Never practise inside your real team project — the whole point is a repository nobody else depends on.</div>

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
${slide('git-00', 15, 'Ba câu hỏi trước khi bấm Enter + bộ ba chẩn đoán')}
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
<div class="callout ok"><strong>Update 09/2026 — Chapters 14–16:</strong> the table above was written for the original plan. For the three new chapters: read <strong>Chapter 14</strong> (Git inside VS Code and other tools) any time after Chapter 4, once you know what the buttons should be doing; <strong>Chapter 15</strong> (GitHub for students) any time after Chapter 6; and keep <strong>Chapter 16</strong> (the team capstone) for last, because it uses everything — it ends with the 20-question final exam.</div>

<h3>🧪 Practice (15–20 min)</h3>
${slide('git-00', 17, 'Thực hành Mục 0 (30 phút)')}
<div class="callout ok"><ol><li>Build the playground: <code>mkdir -p ~/thu-git &amp;&amp; cd ~/thu-git &amp;&amp; git init</code>, one file, one first commit, then five more commits with the loop below. Set up the <code>git lg</code> alias.</li><li>Before the next step, answer the three questions out loud for <code>git reset --hard HEAD~3</code>: which trees does it touch, does it move a pointer, has anything been pushed?</li><li>Run it. <code>git lg</code> now shows only three commits — "commit số 3, 4, 5" seem gone.</li><li>Run <code>git reflog -5</code>, find the line that still says "commit số 5", and move back to it.</li></ol>
<pre><code class="language-bash">printf <span class="tok-string">'dòng một\\n'</span> &gt; a.txt &amp;&amp; git add a.txt &amp;&amp; git commit -m <span class="tok-string">"commit đầu tiên"</span>
<span class="tok-keyword">for</span> i <span class="tok-keyword">in</span> \$(seq 1 5); <span class="tok-keyword">do</span> <span class="tok-keyword">echo</span> <span class="tok-string">"thay đổi \$i"</span> &gt;&gt; a.txt; git commit -qam <span class="tok-string">"commit số \$i"</span>; <span class="tok-keyword">done</span>
git reset --hard HEAD~3
git reflog -5
git reset --hard <span class="tok-string">"HEAD@{1}"</span>    <span class="tok-comment"># quotes keep PowerShell happy too</span></code></pre>
<div class="out">HEAD is now at 9bdc2af commit số 2
9bdc2af HEAD@{0}: reset: moving to HEAD~3
17f6418 HEAD@{1}: commit: commit số 5
f1c7ab1 HEAD@{2}: commit: commit số 4
9e09032 HEAD@{3}: commit: commit số 3
9bdc2af HEAD@{4}: commit: commit số 2
HEAD is now at 17f6418 commit số 5</div>
<p>(Real output from git 2.51 — your hashes will be different.)</p>
<p><strong>Done when:</strong> <code>git lg</code> in <code>~/thu-git</code> shows "commit số 5" at the top with <code>(HEAD -&gt; main)</code>, <code>git status</code> says "nothing to commit, working tree clean", and you can explain why <code>HEAD@{1}</code> was the right target.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Playground / scratch repo</span><span class="v">A throwaway repository (<code>thu-git</code>) where breaking things costs nothing.</span></div>
  <div class="kv"><span class="k">Reflog</span><span class="v">Git's local diary of every place <code>HEAD</code> has been — the undo button for the undo button.</span></div>
  <div class="kv"><span class="k">Reachable / unreachable commit</span><span class="v">A commit that a branch or tag still leads to, versus one only the reflog remembers (kept at least 30 days).</span></div>
  <div class="kv"><span class="k">Alias</span><span class="v">A short name you define for a long command, such as <code>git lg</code>.</span></div>
  <div class="kv"><span class="k">Diagnostic trio</span><span class="v"><code>git status</code>, <code>git lg</code>, <code>git reflog</code> — the three commands to run whenever you are lost.</span></div>
</div>

<h3>📌 Summary</h3>
${slide('git-00', 16, 'Bảng tra nhanh Mục 0')}
<ul><li>Git is learned by hand: run every command in <code>~/thu-git</code>, never in your real team project.</li><li>Before any unfamiliar command, ask: which tree, pointer or object, and has it been pushed?</li><li>If it was ever committed, <code>git reflog</code> can bring it back; only never-committed changes are truly lost.</li><li>When lost, run <code>git status</code>, <code>git lg</code> and <code>git reflog -10</code> before typing anything else.</li><li>Do Chapters 1–4 in order, then use the rest as needed; Chapter 16 and its 20-question final exam come last.</li></ul>
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
${slide('git-00', 14, 'Sân tập thu-git: phá thoải mái, cứu được hết')}
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
<div class="callout warn"><strong>Một cái tên cho sân tập:</strong> từ Chương 1 trở đi, mọi ô thực hành đều gọi kho này là <code>thu-git</code>. Tên thư mục chẳng quan trọng gì với Git, nhưng nếu muốn lệnh trong bài tập chạy đúng nguyên văn thì hãy tạo nó là <code>~/thu-git</code> thay cho <code>~/git-lab</code>. Đừng bao giờ tập trong kho đồ án thật của nhóm — cả ý nghĩa của sân tập là một kho không ai khác phụ thuộc vào.</div>

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
${slide('git-00', 15, 'Ba câu hỏi trước khi bấm Enter + bộ ba chẩn đoán')}
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
<div class="callout ok"><strong>Cập nhật 09/2026 — Chương 14–16:</strong> bảng trên được viết theo kế hoạch ban đầu. Với ba chương mới: đọc <strong>Chương 14</strong> (Git trong VS Code và các công cụ khác) bất cứ lúc nào sau Chương 4, khi bạn đã biết các nút bấm lẽ ra phải làm gì; <strong>Chương 15</strong> (GitHub cho sinh viên) bất cứ lúc nào sau Chương 6; và để <strong>Chương 16</strong> (dự án nhóm tổng kết) sau cùng, vì nó dùng tới mọi thứ — nó kết thúc bằng bài thi cuối khoá 20 câu.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
${slide('git-00', 17, 'Thực hành Mục 0 (30 phút)')}
<div class="callout ok"><ol><li>Dựng sân tập: <code>mkdir -p ~/thu-git &amp;&amp; cd ~/thu-git &amp;&amp; git init</code>, một file, commit đầu tiên, rồi thêm năm commit bằng vòng lặp bên dưới. Đặt alias <code>git lg</code>.</li><li>Trước bước kế tiếp, trả lời to ba câu hỏi cho lệnh <code>git reset --hard HEAD~3</code>: nó đụng cây nào, có dời con trỏ không, đã push gì chưa?</li><li>Chạy nó. <code>git lg</code> giờ chỉ còn ba commit — "commit số 3, 4, 5" có vẻ đã mất.</li><li>Chạy <code>git reflog -5</code>, tìm dòng vẫn còn ghi "commit số 5", rồi quay về đó.</li></ol>
<pre><code class="language-bash">printf <span class="tok-string">'dòng một\\n'</span> &gt; a.txt &amp;&amp; git add a.txt &amp;&amp; git commit -m <span class="tok-string">"commit đầu tiên"</span>
<span class="tok-keyword">for</span> i <span class="tok-keyword">in</span> \$(seq 1 5); <span class="tok-keyword">do</span> <span class="tok-keyword">echo</span> <span class="tok-string">"thay đổi \$i"</span> &gt;&gt; a.txt; git commit -qam <span class="tok-string">"commit số \$i"</span>; <span class="tok-keyword">done</span>
git reset --hard HEAD~3
git reflog -5
git reset --hard <span class="tok-string">"HEAD@{1}"</span>    <span class="tok-comment"># có nháy kép thì PowerShell cũng chạy đúng</span></code></pre>
<div class="out">HEAD is now at 9bdc2af commit số 2
9bdc2af HEAD@{0}: reset: moving to HEAD~3
17f6418 HEAD@{1}: commit: commit số 5
f1c7ab1 HEAD@{2}: commit: commit số 4
9e09032 HEAD@{3}: commit: commit số 3
9bdc2af HEAD@{4}: commit: commit số 2
HEAD is now at 17f6418 commit số 5</div>
<p>(Output thật từ git 2.51 — mã băm của bạn sẽ khác.)</p>
<p><strong>Đạt khi:</strong> <code>git lg</code> trong <code>~/thu-git</code> hiện "commit số 5" trên cùng kèm <code>(HEAD -&gt; main)</code>, <code>git status</code> báo "nothing to commit, working tree clean", và bạn giải thích được vì sao <code>HEAD@{1}</code> là đích đúng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Playground / scratch repo</span><span class="v">Sân tập / kho nháp — một kho vứt đi (<code>thu-git</code>) nơi làm hỏng không tốn gì.</span></div>
  <div class="kv"><span class="k">Reflog</span><span class="v">Nhật ký tham chiếu — sổ ghi cục bộ của Git về mọi chỗ <code>HEAD</code> từng đứng; nút undo cho chính nút undo.</span></div>
  <div class="kv"><span class="k">Reachable / unreachable commit</span><span class="v">Commit với tới được / không với tới được — còn nhánh hay tag dẫn tới, so với chỉ reflog còn nhớ (giữ ít nhất 30 ngày).</span></div>
  <div class="kv"><span class="k">Alias</span><span class="v">Tên tắt — cái tên ngắn bạn tự đặt cho một lệnh dài, như <code>git lg</code>.</span></div>
  <div class="kv"><span class="k">Diagnostic trio</span><span class="v">Bộ ba chẩn đoán — <code>git status</code>, <code>git lg</code>, <code>git reflog</code>: ba lệnh chạy mỗi khi bạn lạc.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
${slide('git-00', 16, 'Bảng tra nhanh Mục 0')}
<ul><li>Git học bằng tay: chạy mọi lệnh trong <code>~/thu-git</code>, không bao giờ trong kho đồ án thật của nhóm.</li><li>Trước một lệnh lạ, hỏi: đụng cây nào, dời con trỏ hay tạo đối tượng, và đã push chưa?</li><li>Thứ gì từng được commit thì <code>git reflog</code> lấy lại được; chỉ thay đổi chưa bao giờ commit mới mất thật.</li><li>Khi lạc, chạy <code>git status</code>, <code>git lg</code> và <code>git reflog -10</code> trước khi gõ bất cứ gì khác.</li><li>Học Chương 1–4 theo thứ tự, phần còn lại dùng khi cần; Chương 16 và bài thi cuối khoá 20 câu để sau cùng.</li></ul>
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
