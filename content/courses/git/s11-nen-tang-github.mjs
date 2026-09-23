/**
 * Git & GitHub — Chương 11: Nền tảng GitHub.
 * Issue/label/milestone/Projects + CLI gh · GitHub Actions từ số 0 ·
 * bảo mật (Dependabot, secret scanning, code scanning) · quiz.
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out đóng bằng </div> (KHÔNG </code></pre>). KHÔNG dùng <svg>.
 * Nâng cấp 09/2026: slide deck git-11 (output thật trong kho thử ch11-lab: git 2.51, node --test, actionlint 1.7.12,
 * gh 2.93 --help — không gọi GitHub), 🧪/🗂/📌 mỗi bài, bài mới 11.3 Bảo mật & quản trị kho, quiz 10 câu có giải thích.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 11 — The GitHub platform|||Chương 11 — Nền tảng GitHub',
  description: 'Git là công cụ; GitHub là mọi thứ dựng quanh nó. Chương này đi qua theo dõi công việc bằng Issue và Projects, chạy việc tự động bằng Actions, các tính năng bảo mật đáng bật ngay hôm nay, và CLI gh để làm tất cả từ terminal.',
  lessons: [
    /* ─────────────────────────── 11.0 ─────────────────────────── */
    {
      title: '11.0 — Chapter 11 slides: the GitHub platform, in pictures|||11.0 — Slide Chương 11: nền tảng GitHub bằng hình',
      slug: 'git-11-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 18 slide của Chương 11: issue tới PR tự đóng, bảng Projects, CLI gh, giải phẫu một workflow Actions, matrix, cache, secrets, CI chặn merge, và sáu lớp bảo mật một kho GitHub.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Slides</span>
<h2>The whole chapter in 18 slides</h2>
<p class="lead">Git stores history; GitHub is where a team plans the work, lets machines check it, and decides who may touch it. The slides follow one bug from an issue to a branch, a pull request with <code>Closes #12</code>, a green CI run and an issue that closes itself — then open up the workflow file that made the run happen, and finish with the six layers that keep a repository safe.</p>
<p>Every terminal on the slides is real output from a throw-away repository: the commit carrying <code>Closes #12</code> (Git 2.51), <code>npm test</code> failing and passing with Node's built-in test runner, <code>actionlint</code> catching two mistakes in a workflow, and help text from <code>gh</code> 2.93. Nothing was sent to GitHub, so what happens on GitHub's side — the Projects board, a run's checks, push protection — is drawn as a diagram, and each feature was checked against docs.github.com as of 09/2026. The last two slides are a cheat sheet and a 60-minute practice session.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Slide</span>
<h2>Cả chương trong 18 slide</h2>
<p class="lead">Git giữ lịch sử; GitHub là nơi cả nhóm lên kế hoạch công việc, để máy tự kiểm tra, và quyết định ai được chạm vào kho. Bộ slide đi theo một lỗi từ issue (phiếu việc) sang nhánh, sang pull request có <code>Closes #12</code>, qua một lượt CI (tích hợp liên tục — máy tự chạy kiểm tra) xanh, tới lúc issue tự đóng — rồi mở tung file workflow (quy trình tự động) đã chạy lượt đó, và kết thúc bằng sáu lớp bảo vệ một kho mã.</p>
<p>Mọi cửa sổ terminal trên slide là output thật trong một kho thử: commit mang <code>Closes #12</code> (Git 2.51), <code>npm test</code> đỏ rồi xanh với bộ chạy test có sẵn của Node, <code>actionlint</code> bắt hai lỗi trong một workflow, và phần trợ giúp của <code>gh</code> 2.93. Không có gì được gửi lên GitHub, nên phần GitHub làm trên máy chủ — bảng Projects, các check của một lượt chạy, push protection (chặn khi đẩy) — được vẽ bằng sơ đồ, và mọi tính năng đều đã kiểm trên docs.github.com (tính đến 09/2026). Hai slide cuối là bảng tra nhanh và một buổi thực hành 60 phút.</p>
</div>
${gallery('git-11', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Issue → nhánh → PR “Closes #12” → tự đóng'], [4, 'Một issue làm được việc và nhãn ba trục'],
  [5, 'Projects: bảng kanban tự chạy theo PR'], [6, 'CLI gh: những lệnh dùng hằng ngày'], [7, 'Actions: sự kiện → workflow → job → step'],
  [8, 'Giải phẫu một workflow ci.yml'], [9, 'Kiểm trên máy trước khi push: actionlint và npm test'], [10, 'Matrix: nhiều job song song'],
  [11, 'Cache: key, restore-keys, giới hạn'], [12, 'Secrets và quyền'], [13, 'CI chặn merge qua ruleset'],
  [14, 'Bảo mật kho: sáu lớp'], [15, 'Dependabot và push protection'], [16, 'Quyền, SECURITY.md và nhật ký bảo mật'],
  [17, 'Bảng tra nhanh'], [18, 'Thực hành chương 11'],
])}
`,
    },

    /* ─────────────────────────── 11.1 ─────────────────────────── */
    {
      title: '11.1 — Issues, Projects & the gh CLI|||11.1 — Issue, Projects & CLI gh',
      slug: 'git-11-1-issue-projects-gh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Issue như một đơn vị công việc, nhãn và milestone dùng đúng cách, mẫu issue, Projects để nhìn toàn cảnh, và CLI gh để làm mọi thứ mà không rời terminal.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>Where the work is tracked</h2>
<p class="lead">A commit says what changed. An <strong>issue</strong> says what should change and why — and it exists before the code does. Used well, the issue is where a decision is argued out once, and every later "why did we build it this way?" has an answer with a URL.</p>

<h3>What makes an issue useful</h3>
${slide('git-11', 4, 'Một issue làm được việc và nhãn ba trục')}
<pre><code><span class="tok-comment"># Title: the symptom, not the guess</span>
Feed returns 500 when a post has no author

<span class="tok-comment"># Body</span>
**What happens:** GET /api/v1/feed returns 500 for ~2% of requests.
**Expected:** 200, with the post rendered and a placeholder author.
**Reproduce:** any post whose author was deleted — e.g. post 8412.
**Environment:** production, since ~14:00 on 20/08. Not on staging.
**Logs:** &#96;TypeError: Cannot read properties of null (reading 'name')&#96;
at feed.service.ts:88</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Title = symptom</span><span class="v">"Feed returns 500 when a post has no author", not "fix feed service". Titles are scanned in a list of eighty.</span></div>
  <div class="kv"><span class="k">Reproduction</span><span class="v">The one thing that decides whether anyone can act on it. A specific ID beats a description.</span></div>
  <div class="kv"><span class="k">Expected vs actual</span><span class="v">Often the whole disagreement lives here, and finding that out early saves the wrong fix.</span></div>
  <div class="kv"><span class="k">Scope, if you know it</span><span class="v">"~2% of requests", "since 14:00" — turns a vague report into something prioritisable.</span></div>
</div>

<h3>Labels — three axes, not forty colours</h3>
<pre><code>type:bug        type:feature     type:chore     type:docs
prio:high       prio:medium      prio:low
area:auth       area:feed        area:payments  area:infra
status:blocked  good-first-issue  help-wanted</code></pre>
<div class="callout ok">Prefixed labels sort together in the picker and read unambiguously in a list. Three axes — <em>what kind</em>, <em>how urgent</em>, <em>which part of the system</em> — cover almost every filtering need. A repository with forty unprefixed labels ends up with nobody labelling anything, which is worse than no labels at all.</div>

<h3>Milestones and Projects</h3>
${slide('git-11', 5, 'Projects: bảng kanban tự chạy theo PR')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Milestone</span><span class="lz-v">A dated bucket: "v1.6.0" or "Sprint 34". One per issue. Gives a progress bar and answers "what is left for this release?".</span></div>
  <div class="lz-layer"><span class="lz-k">Project (board)</span><span class="lz-v">A cross-repository view with custom fields — status, estimate, iteration, owner. This is where planning happens.</span></div>
  <div class="lz-layer"><span class="lz-k">Automation</span><span class="lz-v">Built-in workflows move a card to "In progress" when a linked PR opens, and to "Done" when it merges. Set it up once and the board stops being a thing people forget to update.</span></div>
</div>

<h3>Issue templates</h3>
<pre><code><span class="tok-comment"># .github/ISSUE_TEMPLATE/bug.yml</span>
name: Bug report
description: Something is broken
labels: [<span class="tok-string">"type:bug"</span>]
body:
  - type: textarea
    id: what
    attributes: { label: What happens }
    validations: { required: true }
  - type: textarea
    id: repro
    attributes: { label: Steps to reproduce }
    validations: { required: true }
  - type: dropdown
    id: env
    attributes: { label: Environment, options: [production, staging, local] }</code></pre>
<p>A form with required fields is the cheapest way to stop receiving issues that say only "doesn't work". Add <code>.github/ISSUE_TEMPLATE/config.yml</code> with <code>blank_issues_enabled: false</code> to route everything through a template.</p>

<h3>Linking issues to code</h3>
${slide('git-11', 3, 'Issue → nhánh → PR “Closes #12” → tự đóng')}
<pre><code>git commit -m <span class="tok-string">"fix(feed): render a placeholder when a post has no author

Closes #412"</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Closes / Fixes / Resolves #412</span><span class="v">Closes the issue when the commit reaches the default branch (6.1).</span></div>
  <div class="kv"><span class="k">#412 alone</span><span class="v">Links without closing. Use it for "related to".</span></div>
  <div class="kv"><span class="k">owner/repo#412</span><span class="v">Cross-repository reference.</span></div>
  <div class="kv"><span class="k">@username</span><span class="v">Notifies a person. In a commit message it notifies them every time the commit is rebased — prefer mentions in comments.</span></div>
</div>

<h3>The gh CLI — the whole platform without a browser</h3>
${slide('git-11', 6, 'CLI gh: những lệnh dùng hằng ngày')}
<pre><code>gh auth login                         <span class="tok-comment"># once</span>

gh issue list --label type:bug --state open
gh issue create --title <span class="tok-string">"Feed 500 on null author"</span> --body-file /tmp/report.md
gh issue view 412 --comments
gh issue develop 412 --checkout       <span class="tok-comment"># create + check out a branch for the issue</span>

gh pr create --fill                   <span class="tok-comment"># title/body from your commits</span>
gh pr checkout 431
gh pr review 431 --approve
gh pr merge 431 --squash --delete-branch

gh run list --limit 5                 <span class="tok-comment"># recent Actions runs</span>
gh run view --log-failed              <span class="tok-comment"># the failing step's log, in the terminal</span>
gh release create v1.5.0 --generate-notes</code></pre>
<div class="callout ok"><code>gh run view --log-failed</code> is worth the install on its own: it prints only the failed step's output, instead of scrolling a browser through 4,000 lines of green. Combined with <code>gh pr checkout</code>, most of a review can happen without leaving the terminal.</div>

<h3>Querying with the API</h3>
<pre><code><span class="tok-comment"># Anything the UI can show, gh api can print:</span>
gh api repos/cuonghoang1103/api-backend --jq <span class="tok-string">'.size, .default_branch'</span>
gh api repos/cuonghoang1103/api-backend/issues --paginate \\
  --jq <span class="tok-string">'.[] | select(.pull_request == null) | "\\(.number)\\t\\(.title)"'</span></code></pre>
<div class="out">412	Feed returns 500 when a post has no author
418	Add refresh token rotation</div>
<p>Note the <code>select(.pull_request == null)</code>: in GitHub's API every pull request is also an issue, so listing issues returns both unless you filter. That single detail catches out most people writing their first script against it.</p>

<h3>Discussions, and when to use which</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Issue</span><span class="v">Something specific to do, with a definition of done. It closes.</span></div>
  <div class="kv"><span class="k">Discussion</span><span class="v">A question, an idea, an announcement. It does not close, it has threaded replies and an accepted answer.</span></div>
  <div class="kv"><span class="k">Pull request</span><span class="v">A proposed change to the code. Discussion attached to a diff.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Your SWP391 team keeps losing bug reports in the group chat. In <code>thu-git</code> (on GitHub since Chapter 5), create the three label axes from this lesson: <code>gh label create type:bug -c d73a4a</code>, <code>gh label create prio:high -c b60205</code>, <code>gh label create area:cart -c 1d76db</code> (or Issues → Labels → New label).</li><li>Commit <code>.github/ISSUE_TEMPLATE/bug.yml</code> from this lesson (What happens / Steps to reproduce required) and push it. Open Issues → New issue and check that the form refuses to submit with an empty "Steps to reproduce".</li><li>File a real bug through the form — for example "Cart total goes negative when quantity is negative" — with the labels <code>type:bug</code> and <code>area:cart</code>. Note its number, say <code>#12</code>. Create a board: Projects → New project → Board, and add the issue to it.</li><li>From your terminal: <code>gh issue develop 12 --checkout</code> creates a branch linked to the issue and switches to it. Fix the bug, then commit with <code>Closes #12</code> on its own line in the message body, push, and <code>gh pr create --fill</code>. Merge the PR into <code>main</code>.</li></ol>
<pre><code class="language-bash">git log -1 --format="%h %s%n%n%b"
7422e4e fix(gio): số lượng âm không làm tổng tiền âm

Closes #12        <span class="tok-comment"># real output from the author's test repository — your hash will differ</span></code></pre>
<p><strong>Done when:</strong> issue #12 shows "Closed" with a link to your pull request, its card sits in the board's <strong>Done</strong> column without you dragging it, and <code>gh issue list --label type:bug --state closed</code> lists it.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Issue</span><span class="v">A tracked unit of work — a bug, a feature, a task — with a number, a discussion thread and an open/closed state.</span></div>
  <div class="kv"><span class="k">Label / milestone</span><span class="v">A label is a tag for filtering (type, priority, area); a milestone is a dated bucket such as "Sprint 2" with a progress bar.</span></div>
  <div class="kv"><span class="k">Issue template (issue form)</span><span class="v">A YAML file in <code>.github/ISSUE_TEMPLATE/</code> that turns "New issue" into a form with required fields.</span></div>
  <div class="kv"><span class="k">Closing keyword</span><span class="v"><code>Closes</code>, <code>Fixes</code> or <code>Resolves #n</code> in a PR description or a commit message: the issue closes when the change reaches the default branch.</span></div>
  <div class="kv"><span class="k">Project (board)</span><span class="v">A planning view across issues and PRs with custom fields; its built-in workflows move items to Done when they are closed or merged.</span></div>
  <div class="kv"><span class="k">gh</span><span class="v">GitHub's official command-line tool: issues, pull requests, Actions runs and the REST API from the terminal.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>An issue is written before the code and is the durable record of why a change exists.</li><li>A useful bug report has a symptom as its title and a concrete way to reproduce it.</li><li>Three label axes — type, priority, area — are enough; forty unprefixed labels mean nobody labels anything.</li><li><code>Closes #n</code> in a PR description or commit closes the issue on merge, and the project board follows by itself.</li><li><code>gh</code> covers the whole loop — issue, branch, PR, CI log — without leaving the terminal.</li></ul>

<a class="link-card" href="https://cli.github.com/manual/" target="_blank" rel="noopener">
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">gh — the full command manual</span><span class="lc-sub">Every subcommand, plus <code>gh api</code> and the <code>--jq</code> filter syntax.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/issues/planning-and-tracking-with-projects" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Planning and tracking with Projects</span><span class="lc-sub">Custom fields, views, and the built-in automation workflows.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> tracking work in three places — issues, a chat thread, and a spreadsheet. The moment a decision is recorded only in chat, it is gone in six weeks, and the issue that remains says "see discussion" with a link nobody can open. Whatever you choose, choose one place, and when a decision happens elsewhere, paste the conclusion into the issue. The point of an issue is to be the durable record.</div>
<p class="note-ct"><strong>A habit that pays off later:</strong> when you close an issue, write the resolution in it — one sentence saying what was done and which commit did it. Six months on, "closed" with no explanation is indistinguishable from "abandoned", and the next person to hit the same symptom will reopen it.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Nơi công việc được theo dõi</h2>
<p class="lead">Một commit nói cái gì đã đổi. Một <strong>issue</strong> nói cái gì NÊN đổi và vì sao — và nó tồn tại trước cả khi có mã. Dùng đúng cách, issue là nơi một quyết định được tranh luận đúng một lần, và mọi câu "sao hồi đó ta lại làm kiểu này?" về sau đều có một câu trả lời kèm URL.</p>

<h3>Điều gì làm một issue có ích</h3>
${slide('git-11', 4, 'Một issue làm được việc và nhãn ba trục')}
<pre><code><span class="tok-comment"># Tiêu đề: triệu chứng, không phải phỏng đoán</span>
Feed trả 500 khi một bài không có tác giả

<span class="tok-comment"># Thân bài</span>
**Chuyện gì xảy ra:** GET /api/v1/feed trả 500 với ~2% số request.
**Mong đợi:** 200, bài vẫn hiện ra kèm một tác giả giữ chỗ.
**Tái hiện:** bất kỳ bài nào có tác giả đã bị xoá — ví dụ bài 8412.
**Môi trường:** production, từ khoảng 14:00 ngày 20/08. Staging không dính.
**Log:** &#96;TypeError: Cannot read properties of null (reading 'name')&#96;
tại feed.service.ts:88</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Tiêu đề = triệu chứng</span><span class="v">"Feed trả 500 khi một bài không có tác giả", không phải "sửa feed service". Tiêu đề được lướt mắt trong một danh sách tám mươi cái.</span></div>
  <div class="kv"><span class="k">Cách tái hiện</span><span class="v">Thứ duy nhất quyết định có ai hành động được hay không. Một mã cụ thể hơn hẳn một lời mô tả.</span></div>
  <div class="kv"><span class="k">Mong đợi vs thực tế</span><span class="v">Thường cả cuộc bất đồng nằm ngay ở đây, và phát hiện sớm điều đó tránh được một bản vá sai.</span></div>
  <div class="kv"><span class="k">Phạm vi, nếu bạn biết</span><span class="v">"~2% số request", "từ 14:00" — biến một báo cáo mơ hồ thành thứ xếp được thứ tự ưu tiên.</span></div>
</div>

<h3>Nhãn — ba trục, không phải bốn mươi màu</h3>
<pre><code>type:bug        type:feature     type:chore     type:docs
prio:high       prio:medium      prio:low
area:auth       area:feed        area:payments  area:infra
status:blocked  good-first-issue  help-wanted</code></pre>
<div class="callout ok">Nhãn có tiền tố thì đứng gần nhau trong ô chọn và đọc lên không nhập nhằng trong một danh sách. Ba trục — <em>loại gì</em>, <em>gấp tới đâu</em>, <em>thuộc phần nào của hệ thống</em> — phủ gần như mọi nhu cầu lọc. Một kho có bốn mươi nhãn không tiền tố rốt cuộc thành ra không ai gắn nhãn cho cái gì cả, còn tệ hơn là không có nhãn nào.</div>

<h3>Milestone và Projects</h3>
${slide('git-11', 5, 'Projects: bảng kanban tự chạy theo PR')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Milestone</span><span class="lz-v">Một cái rổ có hạn ngày: "v1.6.0" hay "Sprint 34". Mỗi issue một cái. Cho một thanh tiến độ và trả lời "còn gì cho bản phát hành này?".</span></div>
  <div class="lz-layer"><span class="lz-k">Project (bảng)</span><span class="lz-v">Một góc nhìn xuyên kho mã với các trường tuỳ ý — trạng thái, ước lượng, đợt, người phụ trách. Đây là nơi việc lập kế hoạch diễn ra.</span></div>
  <div class="lz-layer"><span class="lz-k">Tự động hoá</span><span class="lz-v">Các workflow có sẵn dời một thẻ sang "In progress" khi một PR liên kết được mở, và sang "Done" khi nó merge. Cài một lần và cái bảng hết là thứ người ta quên cập nhật.</span></div>
</div>

<h3>Mẫu issue</h3>
<pre><code><span class="tok-comment"># .github/ISSUE_TEMPLATE/bug.yml</span>
name: Báo lỗi
description: Có thứ gì đó hỏng
labels: [<span class="tok-string">"type:bug"</span>]
body:
  - type: textarea
    id: what
    attributes: { label: Chuyện gì xảy ra }
    validations: { required: true }
  - type: textarea
    id: repro
    attributes: { label: Các bước tái hiện }
    validations: { required: true }
  - type: dropdown
    id: env
    attributes: { label: Môi trường, options: [production, staging, local] }</code></pre>
<p>Một biểu mẫu có trường bắt buộc là cách rẻ nhất để thôi nhận những issue chỉ ghi "không chạy". Hãy thêm <code>.github/ISSUE_TEMPLATE/config.yml</code> với <code>blank_issues_enabled: false</code> để mọi thứ đi qua một cái mẫu.</p>

<h3>Nối issue với mã nguồn</h3>
${slide('git-11', 3, 'Issue → nhánh → PR “Closes #12” → tự đóng')}
<pre><code>git commit -m <span class="tok-string">"fix(feed): hien tac gia giu cho khi bai khong co tac gia

Closes #412"</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Closes / Fixes / Resolves #412</span><span class="v">Đóng issue khi commit tới được nhánh mặc định (bài 6.1).</span></div>
  <div class="kv"><span class="k">Chỉ #412</span><span class="v">Liên kết mà không đóng. Dùng cho "liên quan tới".</span></div>
  <div class="kv"><span class="k">owner/repo#412</span><span class="v">Tham chiếu liên kho.</span></div>
  <div class="kv"><span class="k">@tênngườidùng</span><span class="v">Báo cho một người. Trong lời nhắn commit thì nó báo cho họ mỗi lần commit bị rebase — hãy nhắc tên trong bình luận thì hơn.</span></div>
</div>

<h3>CLI gh — cả nền tảng mà không cần trình duyệt</h3>
${slide('git-11', 6, 'CLI gh: những lệnh dùng hằng ngày')}
<pre><code>gh auth login                         <span class="tok-comment"># một lần</span>

gh issue list --label type:bug --state open
gh issue create --title <span class="tok-string">"Feed 500 khi tac gia null"</span> --body-file /tmp/report.md
gh issue view 412 --comments
gh issue develop 412 --checkout       <span class="tok-comment"># tạo + checkout một nhánh cho issue</span>

gh pr create --fill                   <span class="tok-comment"># tiêu đề/thân lấy từ chính commit của bạn</span>
gh pr checkout 431
gh pr review 431 --approve
gh pr merge 431 --squash --delete-branch

gh run list --limit 5                 <span class="tok-comment"># các lượt chạy Actions gần đây</span>
gh run view --log-failed              <span class="tok-comment"># log của bước hỏng, ngay trong terminal</span>
gh release create v1.5.0 --generate-notes</code></pre>
<div class="callout ok">Riêng <code>gh run view --log-failed</code> đã đáng để cài: nó chỉ in ra output của bước bị hỏng, thay vì cuộn trình duyệt qua 4.000 dòng màu xanh. Ghép với <code>gh pr checkout</code>, phần lớn một lượt review diễn ra được mà không rời terminal.</div>

<h3>Truy vấn bằng API</h3>
<pre><code><span class="tok-comment"># Bất cứ thứ gì giao diện hiện được, gh api cũng in được:</span>
gh api repos/cuonghoang1103/api-backend --jq <span class="tok-string">'.size, .default_branch'</span>
gh api repos/cuonghoang1103/api-backend/issues --paginate \\
  --jq <span class="tok-string">'.[] | select(.pull_request == null) | "\\(.number)\\t\\(.title)"'</span></code></pre>
<div class="out">412	Feed returns 500 when a post has no author
418	Add refresh token rotation</div>
<p>Hãy để ý đoạn <code>select(.pull_request == null)</code>: trong API của GitHub, mọi pull request cũng đồng thời là một issue, nên liệt kê issue sẽ trả về cả hai nếu bạn không lọc. Chỉ một chi tiết đó thôi đã làm vấp gần như mọi người viết script đầu tiên với nó.</p>

<h3>Discussions, và khi nào dùng cái nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Issue</span><span class="v">Một việc cụ thể phải làm, kèm định nghĩa thế nào là xong. Nó đóng lại được.</span></div>
  <div class="kv"><span class="k">Discussion</span><span class="v">Một câu hỏi, một ý tưởng, một thông báo. Nó không đóng, có trả lời theo luồng và có câu trả lời được chấp nhận.</span></div>
  <div class="kv"><span class="k">Pull request</span><span class="v">Một thay đổi được đề xuất cho mã nguồn. Thảo luận gắn vào một bản diff.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Nhóm SWP391 của bạn cứ làm rơi báo lỗi trong nhóm chat. Trong <code>thu-git</code> (đã lên GitHub từ Chương 5), tạo ba trục nhãn của bài này: <code>gh label create type:bug -c d73a4a</code>, <code>gh label create prio:high -c b60205</code>, <code>gh label create area:cart -c 1d76db</code> (hoặc Issues → Labels → New label).</li><li>Commit file <code>.github/ISSUE_TEMPLATE/bug.yml</code> của bài này (bắt buộc "Chuyện gì xảy ra" và "Các bước tái hiện") rồi push. Mở Issues → New issue và kiểm rằng biểu mẫu từ chối gửi khi ô "Các bước tái hiện" để trống.</li><li>Báo một lỗi thật qua biểu mẫu — ví dụ "Tổng tiền giỏ hàng bị âm khi số lượng âm" — gắn nhãn <code>type:bug</code> và <code>area:cart</code>. Ghi lại số của nó, giả sử <code>#12</code>. Tạo một bảng: Projects → New project → Board, rồi thêm issue vào bảng.</li><li>Từ terminal: <code>gh issue develop 12 --checkout</code> tạo một nhánh gắn với issue và chuyển sang nhánh đó. Sửa lỗi, commit với dòng <code>Closes #12</code> đứng riêng trong thân lời nhắn, push, rồi <code>gh pr create --fill</code>. Merge PR vào <code>main</code>.</li></ol>
<pre><code class="language-bash">git log -1 --format="%h %s%n%n%b"
7422e4e fix(gio): số lượng âm không làm tổng tiền âm

Closes #12        <span class="tok-comment"># output thật trong kho thử của tác giả — mã băm của bạn sẽ khác</span></code></pre>
<p><strong>Đạt khi:</strong> issue #12 hiện "Closed" kèm liên kết tới pull request của bạn, thẻ của nó nằm ở cột <strong>Done</strong> trên bảng mà bạn không phải kéo tay, và <code>gh issue list --label type:bug --state closed</code> liệt kê được nó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Issue</span><span class="v">Phiếu việc — một đơn vị công việc được theo dõi (lỗi, tính năng, việc vặt), có số, có luồng thảo luận và trạng thái mở/đóng.</span></div>
  <div class="kv"><span class="k">Label / milestone</span><span class="v">Nhãn / cột mốc — nhãn để lọc (loại, độ gấp, khu vực); milestone là một rổ có hạn ngày như "Sprint 2", kèm thanh tiến độ.</span></div>
  <div class="kv"><span class="k">Issue template (issue form)</span><span class="v">Mẫu issue — file YAML trong <code>.github/ISSUE_TEMPLATE/</code> biến nút "New issue" thành một biểu mẫu có ô bắt buộc.</span></div>
  <div class="kv"><span class="k">Closing keyword</span><span class="v">Từ khoá đóng issue — <code>Closes</code>, <code>Fixes</code> hoặc <code>Resolves #n</code> trong mô tả PR hay lời nhắn commit: issue đóng khi thay đổi tới được nhánh mặc định.</span></div>
  <div class="kv"><span class="k">Project (board)</span><span class="v">Bảng dự án — góc nhìn lập kế hoạch trên issue và PR, có trường tuỳ ý; các workflow có sẵn tự dời thẻ sang Done khi việc được đóng hoặc merge.</span></div>
  <div class="kv"><span class="k">gh</span><span class="v">Công cụ dòng lệnh chính thức của GitHub — làm việc với issue, pull request, lượt chạy Actions và API ngay trong terminal.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Issue được viết trước khi có mã, và là bản ghi bền vững về lý do một thay đổi tồn tại.</li><li>Một báo lỗi có ích lấy triệu chứng làm tiêu đề và có cách tái hiện cụ thể.</li><li>Ba trục nhãn — loại, độ gấp, khu vực — là đủ; bốn mươi nhãn không tiền tố nghĩa là chẳng ai gắn nhãn.</li><li><code>Closes #n</code> trong mô tả PR hoặc commit sẽ đóng issue khi merge, và bảng dự án tự đi theo.</li><li><code>gh</code> phủ trọn vòng việc — issue, nhánh, PR, log CI — mà không rời terminal.</li></ul>

<a class="link-card" href="https://cli.github.com/manual/" target="_blank" rel="noopener">
  <span class="lc-ico">💻</span>
  <span class="lc-body"><span class="lc-title">gh — sách hướng dẫn lệnh đầy đủ</span><span class="lc-sub">Mọi lệnh con, cộng <code>gh api</code> và cú pháp bộ lọc <code>--jq</code>.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/issues/planning-and-tracking-with-projects" target="_blank" rel="noopener">
  <span class="lc-ico">📋</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Lập kế hoạch và theo dõi bằng Projects</span><span class="lc-sub">Trường tuỳ ý, các khung nhìn, và những workflow tự động có sẵn.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> theo dõi công việc ở ba nơi — issue, một luồng chat, và một bảng tính. Khoảnh khắc một quyết định chỉ được ghi trong chat, sáu tuần sau nó biến mất, và cái issue còn lại thì ghi "xem thảo luận" kèm một đường dẫn không ai mở được. Chọn gì thì chọn, hãy chọn MỘT chỗ, và khi một quyết định diễn ra ở nơi khác, hãy dán kết luận vào issue. Ý nghĩa của một issue là làm bản ghi bền vững.</div>
<p class="note-ct"><strong>Một thói quen sinh lời về sau:</strong> khi đóng một issue, hãy viết cách giải quyết vào đó — một câu nói đã làm gì và commit nào làm việc đó. Sáu tháng sau, chữ "closed" không kèm giải thích thì không phân biệt được với "bỏ dở", và người tiếp theo gặp đúng triệu chứng ấy sẽ mở lại nó.</p>
</div>
`,
    },

    /* ─────────────────────────── 11.2 ─────────────────────────── */
    {
      title: '11.2 — GitHub Actions: CI from zero|||11.2 — GitHub Actions: CI từ số 0',
      slug: 'git-11-2-actions',
      type: 'LESSON',
      description: 'Cấu trúc một workflow, trigger nào dùng khi nào, cache để CI nhanh, ma trận, secret và quyền, cùng ba lỗi làm CI vừa chậm vừa không đáng tin.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>The checks that make branch protection mean something</h2>
<p class="lead">Chapter 6.4 required status checks to merge. This lesson is where those checks come from. A workflow is a YAML file in your repository that GitHub runs on events you choose — and the whole model is four nested concepts.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Workflow</span><span class="lz-v">One file under <code>.github/workflows/</code>. Has triggers and jobs.</span></div>
  <div class="lz-layer"><span class="lz-k">Job</span><span class="lz-v">Runs on one machine. Jobs run in <strong>parallel</strong> unless you declare <code>needs:</code>.</span></div>
  <div class="lz-layer"><span class="lz-k">Step</span><span class="lz-v">One command or one reusable action, in order, on that machine.</span></div>
  <div class="lz-layer"><span class="lz-k">Action</span><span class="lz-v">A packaged step someone else wrote — <code>actions/checkout</code>, <code>actions/setup-node</code>.</span></div>
</div>

<h3>A workflow that earns its keep</h3>
${slide('git-11', 7, 'Actions: sự kiện → workflow → job → step')}
${slide('git-11', 8, 'Giải phẫu một workflow ci.yml')}
<pre><code><span class="tok-comment"># .github/workflows/ci.yml</span>
name: CI
on:
  pull_request:
  push:
    branches: [main]

<span class="tok-comment"># Cancel an in-flight run when a new commit arrives on the same PR.</span>
concurrency:
  group: &#36;{{ github.workflow }}-&#36;{{ github.ref }}
  cancel-in-progress: true

jobs:
  check:
    name: Lint &amp; Type Check      <span class="tok-comment"># ← the exact string branch protection requires</span>
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm            <span class="tok-comment"># caches ~/.npm keyed on package-lock.json</span>
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run lint

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm test -- --coverage</code></pre>
<div class="callout ok">The <code>concurrency</code> block is the highest-value four lines in this file. Without it, pushing three times in five minutes runs CI three times and you wait for all of them. With <code>cancel-in-progress</code>, only the newest commit is tested — which is the only one that matters.</div>

<h3>Triggers</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">pull_request</span><span class="v">The default for CI. Runs against a <em>merge preview</em> of your branch with the base — so it tests what main will look like, not what your branch looks like alone.</span></div>
  <div class="kv"><span class="k">push: branches: [main]</span><span class="v">Verify the branch after merge. Keep both: a PR check plus a post-merge check catches semantic conflicts (3.2).</span></div>
  <div class="kv"><span class="k">push: tags: ['v*.*.*']</span><span class="v">Release builds (7.3). Tags are not pushed automatically — remember <code>--follow-tags</code> (5.3).</span></div>
  <div class="kv"><span class="k">workflow_dispatch</span><span class="v">A manual "Run workflow" button, optionally with inputs. What deploy workflows should use.</span></div>
  <div class="kv"><span class="k">schedule: cron</span><span class="v">Periodic jobs — dependency audits, cleanup. Note it is UTC and can be delayed under load.</span></div>
</div>
<div class="callout warn"><strong>Deployment should not be a side effect of pushing.</strong> cuongthai.com learned this the expensive way: two deploy workflows once triggered on every push to <code>main</code> and raced each other into real outages — a backend recreate race that left <code>Exited(137)</code> and orphan containers. Both are now <code>workflow_dispatch</code> only, and deploying is a script somebody runs. If two workflows can touch production, give them a shared <code>concurrency.group</code> at minimum.</div>

<h3>Making it fast</h3>
${slide('git-11', 11, 'Cache: key, restore-keys, giới hạn')}
<pre><code>      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }      <span class="tok-comment"># dependency cache, one line</span>

      - uses: actions/cache@v4                       <span class="tok-comment"># anything else</span>
        with:
          path: |
            .next/cache
            ~/.cache/ms-playwright
          key: build-&#36;{{ runner.os }}-&#36;{{ hashFiles('package-lock.json') }}
          restore-keys: build-&#36;{{ runner.os }}-</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">key</span><span class="v">Exact match → cache restored, and saved again at the end only if the key was new.</span></div>
  <div class="kv"><span class="k">restore-keys</span><span class="v">Prefix fallback: no exact match, take the newest close one. Turns a cold cache into a warm one.</span></div>
  <div class="kv"><span class="k">Also</span><span class="v">Run only what changed on a monorepo (10.3), and split slow suites across a matrix.</span></div>
</div>

<h3>Matrix builds</h3>
${slide('git-11', 10, 'Matrix: nhiều job song song')}
<pre><code>  test:
    strategy:
      fail-fast: false          <span class="tok-comment"># do not cancel the others on the first failure</span>
      matrix:
        node: [20, 22]
        os: [ubuntu-latest, windows-latest]
    runs-on: &#36;{{ matrix.os }}</code></pre>
<p>Four jobs, in parallel. <code>fail-fast: false</code> matters when you are debugging: you want to know whether it fails on Windows <em>and</em> Node 20, not just that something failed first.</p>

<h3>Secrets and permissions</h3>
${slide('git-11', 12, 'Secrets và quyền')}
<pre><code>      - run: ./deploy.sh
        env:
          SSH_KEY: &#36;{{ secrets.VPS_SSH_PRIVATE_KEY }}
          HOST:    &#36;{{ secrets.VPS_HOST }}</code></pre>
<pre><code>permissions:
  contents: read            <span class="tok-comment"># default to the minimum…</span>
jobs:
  release:
    permissions:
      contents: write       <span class="tok-comment"># …and widen only where needed</span></code></pre>
<div class="callout danger">Secrets are masked in logs, and masking is a string match — <code>echo \$SECRET | base64</code> defeats it entirely. Never print a secret, never pass one to a third-party action you have not read, and pin actions to a full commit SHA (<code>uses: actions/checkout@8f4b7f8…</code>) rather than a moving tag when the action can see your secrets. A compromised tag on a popular action is a supply-chain attack against everyone who wrote <code>@v4</code>.</div>
<div class="callout ok">Prefer the automatic <code>GITHUB_TOKEN</code> over a stored personal access token (5.2): it is minted per run, scoped to that repository, and expires when the job ends. A leaked PAT is your whole account.</div>

<h3>Reading a failure</h3>
${slide('git-11', 9, 'Kiểm trên máy trước khi push: actionlint và npm test')}
<pre><code>gh run list --limit 5
gh run view --log-failed        <span class="tok-comment"># only the failing step</span>
gh run rerun 1234567 --failed   <span class="tok-comment"># re-run just the failed jobs</span>
gh run watch                    <span class="tok-comment"># live, in the terminal</span></code></pre>
<p>And the habit from the CuongThai runbook: when CI goes red, check <em>which step</em> failed and whether your commit even touches that part of the tree (<code>git show --stat</code>) before assuming it is your diff.</p>

<h3>Three mistakes that make CI untrustworthy</h3>
${slide('git-11', 13, 'CI chặn merge qua ruleset')}
<div class="kv-grid">
  <div class="kv"><span class="k">Required check with a path filter</span><span class="v">It never runs on an unrelated PR, so GitHub waits forever (6.4). Add a same-named companion job that reports success.</span></div>
  <div class="kv"><span class="k">Flaky tests left in</span><span class="v">One red run in five teaches everyone to press "re-run" without reading. From then on CI is decoration. Fix or quarantine flakes the day you notice them.</span></div>
  <div class="kv"><span class="k">A twenty-minute pipeline</span><span class="v">People stop waiting and merge on hope. Cache, parallelise, and run the slow suite post-merge rather than per-PR.</span></div>
</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Your teammate on Windows merged code that only passed "on my machine". Give <code>thu-git</code> a CI: add a <code>package.json</code> whose scripts are <code>"test": "node --test"</code> and <code>"lint": "node --check src/gia.js"</code> (the workflow runs both), one small test file, run <code>npm install</code> once so a <code>package-lock.json</code> exists (<code>npm ci</code> refuses to run without it), and copy the workflow from slide 8 into <code>.github/workflows/ci.yml</code>.</li><li>Before pushing, check the file on your machine: install actionlint (<code>brew install actionlint</code> on the Mac, <code>winget install actionlint</code> on Windows) and run <code>actionlint</code> in the repository, then run the exact commands CI will run — <code>npm ci</code> and <code>npm test</code>. Both must exit 0. Then deliberately write <code>pull-request:</code> instead of <code>pull_request:</code> and run actionlint again.</li><li>Fix the typo, commit on a branch, push, and open a PR. Watch it with <code>gh pr checks --watch</code>: you should see one check per matrix entry — <code>Test (Node 20)</code> and <code>Test (Node 22)</code>.</li><li>Break a test on purpose, push, and read the failure without opening a browser: <code>gh run view --log-failed</code>. Fix it, push again, and confirm both checks turn green on the same PR.</li></ol>
<pre><code class="language-bash">actionlint
.github/workflows/ci.yml:3:3: unknown Webhook event "pull-request". see https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#webhook-events for list of all Webhook event names [events]
  |
3 |   pull-request:
  |   ^~~~~~~~~~~~~
<span class="tok-comment"># real output of actionlint 1.7.12 in the author's test repository</span></code></pre>
<p><strong>Done when:</strong> actionlint prints nothing and exits 0, the PR's Checks tab shows one red run followed by one green run for both matrix jobs, and you can name the failing step from <code>gh run view --log-failed</code> alone.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Workflow</span><span class="v">A YAML file in <code>.github/workflows/</code> that GitHub Actions runs when its <code>on:</code> events happen.</span></div>
  <div class="kv"><span class="k">Job / step</span><span class="v">A job runs on one fresh machine (<code>runs-on</code>); its steps run in order, and a step that exits non-zero fails the job.</span></div>
  <div class="kv"><span class="k">Runner</span><span class="v">The machine that executes a job — GitHub-hosted (<code>ubuntu-latest</code>, <code>windows-latest</code>) or your own self-hosted one.</span></div>
  <div class="kv"><span class="k">Matrix</span><span class="v"><code>strategy.matrix</code> expands one job into one job per combination of values, all running in parallel.</span></div>
  <div class="kv"><span class="k">Cache key</span><span class="v">The name a saved cache is stored under; an exact hit restores it, <code>restore-keys</code> fall back to the newest prefix match.</span></div>
  <div class="kv"><span class="k">Secret / GITHUB_TOKEN</span><span class="v">An encrypted value exposed to a job as <code>&#36;{{ secrets.NAME }}</code>; <code>GITHUB_TOKEN</code> is the one GitHub mints for each run and revokes when the job ends.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A workflow is events → jobs → steps: jobs run in parallel on separate machines, steps run in order on one.</li><li>A step is just a command; any non-zero exit code turns the job, and the check, red.</li><li>Run actionlint and the same commands CI runs before pushing — it is faster than waiting for GitHub to tell you.</li><li>Cache, matrix and <code>concurrency</code> make CI fast enough that people keep waiting for it.</li><li>Keep secrets in the secret store, default <code>permissions</code> to read, and let the job's <code>name</code> be what branch protection requires.</li></ul>

<a class="link-card" href="https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Workflow syntax</span><span class="lc-sub">Every key: on, jobs, steps, strategy, concurrency, permissions.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Security hardening for GitHub Actions</span><span class="lc-sub">Pinning actions to a SHA, least-privilege permissions, and untrusted input.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>pull_request_target</code> instead of <code>pull_request</code> on a public repository. It runs with <em>write</em> permissions and access to your secrets, in the context of the base branch — but if you also check out the pull request's code, you are executing a stranger's code with your credentials. It exists for labelling and commenting on forks, not for building their code. If you did not deliberately need it, you want <code>pull_request</code>.</div>
<p class="note-ct"><strong>The rule that decides what belongs in CI:</strong> anything a reviewer would otherwise check by hand and could get wrong. Formatting, types, lint, tests, secret scanning — all of it, so human review is spent on correctness and design (6.2). Every check you automate is a check that never gets skipped on a Friday.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Những phép kiểm làm cho bảo vệ nhánh có ý nghĩa</h2>
<p class="lead">Bài 6.4 yêu cầu các kiểm tra trạng thái phải qua thì mới merge được. Bài này là nơi những phép kiểm đó sinh ra. Một workflow là một file YAML trong kho mã mà GitHub chạy theo các sự kiện bạn chọn — và cả mô hình chỉ gồm bốn khái niệm lồng nhau.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Workflow</span><span class="lz-v">Một file dưới <code>.github/workflows/</code>. Có trigger và job.</span></div>
  <div class="lz-layer"><span class="lz-k">Job</span><span class="lz-v">Chạy trên một cái máy. Các job chạy <strong>SONG SONG</strong> trừ khi bạn khai <code>needs:</code>.</span></div>
  <div class="lz-layer"><span class="lz-k">Step</span><span class="lz-v">Một lệnh hoặc một action dùng lại được, chạy tuần tự, trên cái máy đó.</span></div>
  <div class="lz-layer"><span class="lz-k">Action</span><span class="lz-v">Một bước đóng gói sẵn do người khác viết — <code>actions/checkout</code>, <code>actions/setup-node</code>.</span></div>
</div>

<h3>Một workflow đáng đồng tiền</h3>
${slide('git-11', 7, 'Actions: sự kiện → workflow → job → step')}
${slide('git-11', 8, 'Giải phẫu một workflow ci.yml')}
<pre><code><span class="tok-comment"># .github/workflows/ci.yml</span>
name: CI
on:
  pull_request:
  push:
    branches: [main]

<span class="tok-comment"># Huỷ một lượt đang chạy khi có commit mới trên cùng PR.</span>
concurrency:
  group: &#36;{{ github.workflow }}-&#36;{{ github.ref }}
  cancel-in-progress: true

jobs:
  check:
    name: Lint &amp; Type Check      <span class="tok-comment"># ← đúng chuỗi mà bảo vệ nhánh yêu cầu</span>
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm            <span class="tok-comment"># cache ~/.npm theo khoá package-lock.json</span>
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run lint

  test:
    name: Test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm test -- --coverage</code></pre>
<div class="callout ok">Khối <code>concurrency</code> là bốn dòng giá trị nhất trong file này. Thiếu nó, push ba lần trong năm phút là CI chạy ba lượt và bạn chờ cả ba. Có <code>cancel-in-progress</code>, chỉ commit mới nhất được kiểm — mà đó là cái duy nhất quan trọng.</div>

<h3>Các trigger</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">pull_request</span><span class="v">Mặc định cho CI. Chạy trên một <em>bản xem trước sau merge</em> giữa nhánh của bạn và nhánh gốc — nên nó kiểm thứ main sẽ trở thành, không kiểm nhánh bạn khi đứng một mình.</span></div>
  <div class="kv"><span class="k">push: branches: [main]</span><span class="v">Kiểm lại nhánh sau khi merge. Hãy giữ cả hai: một phép kiểm ở PR cộng một phép kiểm sau merge sẽ bắt được xung đột ngữ nghĩa (bài 3.2).</span></div>
  <div class="kv"><span class="k">push: tags: ['v*.*.*']</span><span class="v">Dựng bản phát hành (bài 7.3). Tag không tự động được push — nhớ <code>--follow-tags</code> (bài 5.3).</span></div>
  <div class="kv"><span class="k">workflow_dispatch</span><span class="v">Một cái nút "Run workflow" bấm tay, kèm tham số nếu muốn. Thứ mà các workflow deploy nên dùng.</span></div>
  <div class="kv"><span class="k">schedule: cron</span><span class="v">Việc chạy định kỳ — soát thư viện, dọn dẹp. Lưu ý nó theo giờ UTC và có thể bị trễ khi hệ thống tải cao.</span></div>
</div>
<div class="callout warn"><strong>Triển khai KHÔNG nên là tác dụng phụ của việc push.</strong> cuongthai.com đã học điều này bằng một cái giá đắt: hai workflow deploy từng kích hoạt ở mọi lần push vào <code>main</code> và đua nhau tới mức gây sự cố thật — một cuộc đua khi dựng lại backend để lại <code>Exited(137)</code> và các container mồ côi. Giờ cả hai chỉ còn <code>workflow_dispatch</code>, và triển khai là một script do người chạy. Nếu hai workflow cùng chạm được vào production, ít nhất hãy cho chúng chung một <code>concurrency.group</code>.</div>

<h3>Làm cho nó nhanh</h3>
${slide('git-11', 11, 'Cache: key, restore-keys, giới hạn')}
<pre><code>      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }      <span class="tok-comment"># cache thư viện, một dòng</span>

      - uses: actions/cache@v4                       <span class="tok-comment"># mọi thứ khác</span>
        with:
          path: |
            .next/cache
            ~/.cache/ms-playwright
          key: build-&#36;{{ runner.os }}-&#36;{{ hashFiles('package-lock.json') }}
          restore-keys: build-&#36;{{ runner.os }}-</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">key</span><span class="v">Khớp chính xác → cache được khôi phục, và chỉ được lưu lại ở cuối nếu khoá là mới.</span></div>
  <div class="kv"><span class="k">restore-keys</span><span class="v">Rơi về theo tiền tố: không khớp chính xác thì lấy cái gần nhất còn mới. Biến một cache nguội thành cache ấm.</span></div>
  <div class="kv"><span class="k">Ngoài ra</span><span class="v">Chỉ chạy phần đã đổi trên monorepo (bài 10.3), và chẻ các bộ test chậm ra một ma trận.</span></div>
</div>

<h3>Bản dựng theo ma trận</h3>
${slide('git-11', 10, 'Matrix: nhiều job song song')}
<pre><code>  test:
    strategy:
      fail-fast: false          <span class="tok-comment"># đừng huỷ các job khác khi cái đầu tiên hỏng</span>
      matrix:
        node: [20, 22]
        os: [ubuntu-latest, windows-latest]
    runs-on: &#36;{{ matrix.os }}</code></pre>
<p>Bốn job, chạy song song. <code>fail-fast: false</code> quan trọng khi bạn đang gỡ lỗi: bạn muốn biết nó hỏng trên Windows <em>VÀ</em> Node 20, chứ không chỉ biết có thứ gì đó hỏng trước.</p>

<h3>Secret và quyền</h3>
${slide('git-11', 12, 'Secrets và quyền')}
<pre><code>      - run: ./deploy.sh
        env:
          SSH_KEY: &#36;{{ secrets.VPS_SSH_PRIVATE_KEY }}
          HOST:    &#36;{{ secrets.VPS_HOST }}</code></pre>
<pre><code>permissions:
  contents: read            <span class="tok-comment"># mặc định ở mức tối thiểu…</span>
jobs:
  release:
    permissions:
      contents: write       <span class="tok-comment"># …và chỉ mở rộng ở nơi cần</span></code></pre>
<div class="callout danger">Secret được che trong log, và việc che là một phép khớp chuỗi — <code>echo \$SECRET | base64</code> vô hiệu hoá nó hoàn toàn. Đừng bao giờ in một secret, đừng truyền nó cho một action bên thứ ba mà bạn chưa đọc, và hãy ghim action vào một mã băm commit đầy đủ (<code>uses: actions/checkout@8f4b7f8…</code>) thay vì một tag di động khi action đó nhìn thấy được secret của bạn. Một tag bị chiếm trên một action phổ biến là một cuộc tấn công chuỗi cung ứng nhắm vào mọi người đã viết <code>@v4</code>.</div>
<div class="callout ok">Hãy ưu tiên <code>GITHUB_TOKEN</code> tự động hơn là một personal access token lưu sẵn (bài 5.2): nó được đúc cho từng lượt chạy, giới hạn trong kho đó, và hết hạn khi job kết thúc. Một PAT bị lộ là cả tài khoản của bạn.</div>

<h3>Đọc một lần hỏng</h3>
${slide('git-11', 9, 'Kiểm trên máy trước khi push: actionlint và npm test')}
<pre><code>gh run list --limit 5
gh run view --log-failed        <span class="tok-comment"># chỉ bước bị hỏng</span>
gh run rerun 1234567 --failed   <span class="tok-comment"># chạy lại đúng những job đã hỏng</span>
gh run watch                    <span class="tok-comment"># theo dõi trực tiếp, trong terminal</span></code></pre>
<p>Và thói quen từ sổ tay vận hành của CuongThai: khi CI đỏ, hãy kiểm <em>BƯỚC NÀO</em> hỏng và xem commit của bạn có chạm vào phần cây đó không (<code>git show --stat</code>) trước khi cho rằng lỗi nằm ở diff của mình.</p>

<h3>Ba sai lầm làm CI mất đáng tin</h3>
${slide('git-11', 13, 'CI chặn merge qua ruleset')}
<div class="kv-grid">
  <div class="kv"><span class="k">Kiểm tra bắt buộc có bộ lọc đường dẫn</span><span class="v">Nó không bao giờ chạy trên một PR không liên quan, nên GitHub chờ mãi mãi (bài 6.4). Hãy thêm một job đi kèm cùng tên báo thành công.</span></div>
  <div class="kv"><span class="k">Để test chớp nháy nằm lại</span><span class="v">Cứ năm lượt có một lượt đỏ là dạy cho mọi người bấm "re-run" mà không đọc. Từ đó CI thành đồ trang trí. Hãy sửa hoặc cách ly test chớp nháy ngay ngày bạn phát hiện.</span></div>
  <div class="kv"><span class="k">Một pipeline hai mươi phút</span><span class="v">Người ta thôi chờ và merge bằng niềm tin. Hãy cache, chạy song song, và đẩy bộ test chậm sang sau-merge thay vì chạy ở mỗi PR.</span></div>
</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Bạn cùng nhóm dùng Windows vừa merge một đoạn mã chỉ chạy được "trên máy em". Hãy cho <code>thu-git</code> một CI: thêm <code>package.json</code> có hai script <code>"test": "node --test"</code> và <code>"lint": "node --check src/gia.js"</code> (workflow chạy cả hai), một file test nhỏ, chạy <code>npm install</code> một lần để có <code>package-lock.json</code> (<code>npm ci</code> từ chối chạy nếu thiếu file này), rồi chép workflow ở slide 8 vào <code>.github/workflows/ci.yml</code>.</li><li>Trước khi push, kiểm file ngay trên máy: cài actionlint (<code>brew install actionlint</code> trên Mac, <code>winget install actionlint</code> trên Windows), chạy <code>actionlint</code> trong kho, rồi chạy đúng các lệnh CI sẽ chạy — <code>npm ci</code> và <code>npm test</code>. Cả hai phải thoát với mã 0. Sau đó cố ý viết <code>pull-request:</code> thay cho <code>pull_request:</code> và chạy actionlint lần nữa.</li><li>Sửa lỗi gõ, commit trên một nhánh, push, mở PR. Theo dõi bằng <code>gh pr checks --watch</code>: bạn sẽ thấy mỗi ô của ma trận là một check — <code>Test (Node 20)</code> và <code>Test (Node 22)</code>.</li><li>Cố ý làm hỏng một test, push, và đọc lỗi mà không mở trình duyệt: <code>gh run view --log-failed</code>. Sửa, push lại, và xác nhận cả hai check chuyển xanh trên cùng PR đó.</li></ol>
<pre><code class="language-bash">actionlint
.github/workflows/ci.yml:3:3: unknown Webhook event "pull-request". see https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#webhook-events for list of all Webhook event names [events]
  |
3 |   pull-request:
  |   ^~~~~~~~~~~~~
<span class="tok-comment"># output thật của actionlint 1.7.12 trong kho thử của tác giả</span></code></pre>
<p><strong>Đạt khi:</strong> actionlint không in gì và thoát mã 0, tab Checks của PR có một lượt đỏ rồi một lượt xanh cho cả hai job của ma trận, và bạn gọi đúng tên bước hỏng chỉ nhờ <code>gh run view --log-failed</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Workflow</span><span class="v">Quy trình tự động — một file YAML trong <code>.github/workflows/</code> mà GitHub Actions chạy khi các sự kiện trong <code>on:</code> xảy ra.</span></div>
  <div class="kv"><span class="k">Job / step</span><span class="v">Công việc / bước — một job chạy trên một máy mới tinh (<code>runs-on</code>); các step của nó chạy lần lượt, và một step thoát mã khác 0 làm job hỏng.</span></div>
  <div class="kv"><span class="k">Runner</span><span class="v">Máy chạy — cái máy thực thi một job, do GitHub cấp (<code>ubuntu-latest</code>, <code>windows-latest</code>) hoặc máy của chính bạn (self-hosted).</span></div>
  <div class="kv"><span class="k">Matrix</span><span class="v">Ma trận — <code>strategy.matrix</code> nhân một job thành một job cho mỗi tổ hợp giá trị, tất cả chạy song song.</span></div>
  <div class="kv"><span class="k">Cache key</span><span class="v">Khoá bộ đệm — tên dùng để lưu một cache; khớp chính xác thì khôi phục, <code>restore-keys</code> rơi về bản mới nhất khớp tiền tố.</span></div>
  <div class="kv"><span class="k">Secret / GITHUB_TOKEN</span><span class="v">Bí mật — giá trị được mã hoá, đưa vào job qua <code>&#36;{{ secrets.TEN }}</code>; <code>GITHUB_TOKEN</code> là token GitHub tự cấp cho mỗi lượt chạy và thu hồi khi job xong.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Workflow là sự kiện → job → step: job chạy song song trên các máy riêng, step chạy tuần tự trên một máy.</li><li>Một step chỉ là một lệnh; mã thoát khác 0 là job, và cả check, chuyển đỏ.</li><li>Chạy actionlint và đúng các lệnh CI sẽ chạy trước khi push — nhanh hơn chờ GitHub báo cho bạn.</li><li>Cache, ma trận và <code>concurrency</code> làm CI đủ nhanh để mọi người còn chịu chờ nó.</li><li>Giữ secret trong kho secret, để <code>permissions</code> mặc định là đọc, và để <code>name</code> của job là thứ luật bảo vệ nhánh yêu cầu.</li></ul>

<a class="link-card" href="https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Cú pháp workflow</span><span class="lc-sub">Mọi khoá: on, jobs, steps, strategy, concurrency, permissions.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Gia cố bảo mật cho GitHub Actions</span><span class="lc-sub">Ghim action vào SHA, quyền tối thiểu, và dữ liệu đầu vào không tin cậy.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> dùng <code>pull_request_target</code> thay vì <code>pull_request</code> trên một kho công khai. Nó chạy với quyền <em>GHI</em> và có quyền truy cập secret của bạn, trong ngữ cảnh nhánh gốc — nhưng nếu bạn còn checkout luôn mã của pull request thì bạn đang thực thi mã của người lạ bằng chứng chỉ của mình. Nó tồn tại để gắn nhãn và bình luận trên các fork, không phải để dựng mã của họ. Nếu bạn không chủ ý cần nó thì thứ bạn muốn là <code>pull_request</code>.</div>
<p class="note-ct"><strong>Luật quyết định cái gì thuộc về CI:</strong> bất cứ thứ gì mà nếu không có nó, người review sẽ phải kiểm bằng tay và có thể kiểm sai. Định dạng, kiểu, lint, test, quét bí mật — tất cả, để sự chú ý của con người dành cho tính đúng đắn và thiết kế (bài 6.2). Mỗi phép kiểm bạn tự động hoá là một phép kiểm không bao giờ bị bỏ qua vào một chiều thứ Sáu.</p>
</div>
`,
    },

    /* ─────────────────────────── 11.3 (mới) ─────────────────────────── */
    {
      title: '11.3 — Securing and administering a repository on GitHub|||11.3 — Bảo mật & quản trị kho trên GitHub',
      slug: 'git-11-4-bao-mat-kho',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Sáu lớp bảo vệ một kho nhóm: 2FA và passkey, quyền collaborator và vai trò trong tổ chức, Dependabot, secret scanning và push protection, SECURITY.md, và nhật ký bảo mật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.3</span>
<h2>Who can get in, and what warns you when something is wrong</h2>
<p class="lead">A repository is only as safe as the weakest account that can push to it. For a student team that means five personal accounts, one shared <code>main</code>, a <code>package.json</code> full of other people's code, and at least one <code>.env</code> file that someone will eventually try to commit. GitHub has a free answer for each of those — most of them are one click in Settings, and almost nobody turns them on until after the incident.</p>

<h3>Layer 1 — your account: 2FA and passkeys</h3>
${slide('git-11', 14, 'Bảo mật kho: sáu lớp')}
<p>Everything else in this lesson assumes that the person pushing is really you. A password alone does not prove that: passwords are reused, phished and leaked. GitHub requires two-factor authentication for accounts that contribute code, so if you have not been asked yet, you will be.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Where</span><span class="v">Profile picture → <strong>Settings</strong> → <strong>Password and authentication</strong> → <strong>Enable two-factor authentication</strong>.</span></div>
  <div class="kv"><span class="k">TOTP app (recommended)</span><span class="v">An authenticator app generates a six-digit code every 30 seconds. GitHub's docs recommend it over SMS, which can be intercepted.</span></div>
  <div class="kv"><span class="k">Recovery codes</span><span class="v">Shown once when you enable 2FA. Download them and keep them in a password manager — they are the way back in if you lose your phone.</span></div>
  <div class="kv"><span class="k">28-day check-up</span><span class="v">After enabling 2FA, GitHub asks you to prove within 28 days that it works, so a mis-scanned QR code does not lock you out months later.</span></div>
  <div class="kv"><span class="k">Passkey</span><span class="v">Same page, under <strong>Passkeys</strong> → <strong>Add a passkey</strong>. Stored by Touch ID, Windows Hello, a phone or a password manager, and bound to the <code>github.com</code> domain — a fake login page cannot use it. It satisfies both the password and the 2FA step in one go.</span></div>
</div>
<div class="callout warn">Recovery codes belong in a password manager or on paper — never in a repository, a note synced to the group drive, or a screenshot in your camera roll. And note what 2FA does <em>not</em> protect: a personal access token or an SSH key already on your laptop (5.2) still works without a second factor. Give tokens an expiry date and delete the ones you no longer use.</div>

<h3>Layer 2 — who can get in: collaborators, organisations and roles</h3>
${slide('git-11', 16, 'Quyền, SECURITY.md và nhật ký bảo mật')}
<p>A repository under your personal account has exactly two levels: you, the owner, and <strong>collaborators</strong>. Collaborators can push, merge pull requests, and manage issues and labels — and on a private personal repository there is no read-only option: everyone you invite gets write access. That is fine for two people. For a team of five with a mentor who should only watch, it is the wrong tool.</p>
<p>A free <strong>organisation</strong> gives you real roles, assigned per person or — better — per <strong>team</strong>:</p>
<table>
<tr><th>Role</th><th>Meant for</th><th>Can</th></tr>
<tr><td>Read</td><td>a mentor, a grader</td><td>view, clone, open and comment on issues</td></tr>
<tr><td>Triage</td><td>a tester, a PM</td><td>also label, assign, close and reopen issues and PRs — but not push</td></tr>
<tr><td>Write</td><td>every developer</td><td>also push branches and merge pull requests</td></tr>
<tr><td>Maintain</td><td>the team lead</td><td>also manage the repository's settings, without the sensitive or destructive ones</td></tr>
<tr><td>Admin</td><td>one or two people</td><td>everything, including security settings and deleting the repository</td></tr>
</table>
<p>For an SWP391 group: create an organisation for the project, a team <code>developers</code> with <strong>Write</strong>, give the lead <strong>Maintain</strong> or <strong>Admin</strong>, and the lecturer <strong>Read</strong>. When someone leaves the group, remove them from the team the same day — and remember the warning in GitHub's own docs: a <strong>deploy key</strong> keeps working for anyone holding the private key, even after they are removed from the organisation. Rotate it.</p>

<h3>Layer 3 — the code you did not write: Dependabot</h3>
${slide('git-11', 15, 'Dependabot và push protection')}
<p>A Next.js project pulls in hundreds of packages. When a vulnerability is published for one of them, the question is not whether you read the announcement — you did not — but whether something tells you. Dependabot is three separate features that are easy to confuse:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Dependabot alerts</span><span class="v">GitHub reads your manifest and lock files (the <em>dependency graph</em>), compares them with the GitHub Advisory Database, and raises an alert when a version you use is vulnerable. Works on any repository, public or private.</span></div>
  <div class="kv"><span class="k">Dependabot security updates</span><span class="v">For each alert that has a fix, Dependabot opens a pull request bumping the package to the <em>minimum</em> version that contains the patch, and links it to the alert.</span></div>
  <div class="kv"><span class="k">Dependabot version updates</span><span class="v">Independent of vulnerabilities: keeps dependencies current on a schedule, configured by a file you commit.</span></div>
</div>
<p>Alerts and security updates are switched on in the repository's <strong>Settings → Advanced Security</strong> (the page used to be called "Code security and analysis"). Version updates live in <code>.github/dependabot.yml</code>:</p>
<pre><code class="language-yaml">version: 2
updates:
  - package-ecosystem: <span class="tok-string">"npm"</span>
    directory: <span class="tok-string">"/"</span>
    schedule:
      interval: <span class="tok-string">"weekly"</span>
  - package-ecosystem: <span class="tok-string">"github-actions"</span>   <span class="tok-comment"># keeps actions/checkout@v4 and friends current</span>
    directory: <span class="tok-string">"/"</span>
    schedule:
      interval: <span class="tok-string">"weekly"</span></code></pre>
<p>The <code>github-actions</code> entry closes the loop with 11.2: the actions your workflows use are dependencies too, and pinned versions go stale. Every Dependabot pull request runs through the same CI as yours — which is exactly why the CI has to exist first. A green check on a minor bump is usually safe to merge; a <em>major</em> bump deserves the same review as any other PR, because it is allowed to break things by definition.</p>

<h3>Layer 4 — secrets: secret scanning and push protection</h3>
<p><strong>Secret scanning</strong> looks for credentials — API keys, tokens, private keys — across the entire Git history on every branch, plus issues, pull requests, discussions and wikis. On public repositories it runs automatically and for free; alerts appear on the repository's <strong>Security and quality</strong> tab. For many providers GitHub also notifies the provider directly, so a leaked token may be revoked before you even read the alert.</p>
<p><strong>Push protection</strong> works one step earlier: it inspects a push and refuses it if it contains a supported secret. "Push protection for users" is on by default for every account and blocks pushes of supported secrets to public repositories; on a repository with secret scanning enabled you can also turn it on for everyone pushing to that repository. The rejected push lists where the secret is, in this shape (excerpt from GitHub's docs):</p>
<pre><code>remote:   —— GitHub Personal Access Token ——————————————————————
remote:    locations:
remote:      - commit: 8728dbe67
remote:        path: README.md:4</code></pre>
<ol>
<li>If the secret is only in your last commit: remove it, <code>git commit --amend --all</code>, push again.</li>
<li>If it is in an earlier commit: <code>git rebase -i &lt;first-commit&gt;~1</code>, mark that commit <code>edit</code>, remove the secret, <code>git commit --amend</code>, <code>git rebase --continue</code> (Chapter 8).</li>
<li>If the string really is harmless, the URL in the rejection lets the person who pushed choose a reason — <em>It's used in tests</em>, <em>It's a false positive</em>, or <em>I'll fix it later</em> — and then retry the push within three hours. "I'll fix it later" leaves an open alert behind; it is a promise, not a fix.</li>
</ol>
<div class="callout danger">If a real key has already reached GitHub, <strong>revoke it at the provider first</strong>, then clean history (8.3). Anyone who cloned or scraped the repository in the meantime still has it, and bots scan public pushes within minutes. Rewriting history hides the key from future readers; only revoking it stops it working.</div>

<h3>Layer 5 — a front door for bad news: SECURITY.md</h3>
<p>If someone finds a hole in your project — say, the booking API lets any logged-in user cancel anyone's appointment — the worst place for them to report it is a public issue. <code>SECURITY.md</code> tells them where to go instead. GitHub looks for it in the repository root, in <code>docs/</code>, or in <code>.github/</code>, and links it from the <strong>Security and quality</strong> tab (→ <strong>Security policy</strong> → <strong>Start setup</strong> creates it for you):</p>
<pre><code>cat SECURITY.md
# Chính sách bảo mật

## Báo lỗ hổng
Đừng mở issue công khai. Dùng nút
**Report a vulnerability** của kho,
hoặc gửi mail cho trưởng nhóm.
Chúng tôi trả lời trong 3 ngày làm việc.   <span class="tok-comment"># from the author's test repository</span></code></pre>
<p>On a public repository, also turn on <strong>Private vulnerability reporting</strong> (Settings → Advanced Security). It adds a <em>Report a vulnerability</em> button on the repository's Advisories page, so a researcher can send the details privately to the maintainers instead of hunting for an email address.</p>

<h3>Layer 6 — the record: the security log</h3>
<p>Your account keeps a <strong>security log</strong> of the last 90 days: sign-ins, new tokens and SSH keys, 2FA changes, repositories created or transferred. Profile picture → <strong>Settings</strong> → in the "Archives" section, <strong>Security log</strong>. It cannot be searched by free text, but it filters: <code>operation:authentication</code> shows sign-in events, <code>repo:owner/name</code> narrows to one repository. Organisations have the equivalent for all members, the organisation <strong>audit log</strong>. Open it the day your laptop is stolen or a teammate says "I didn't push that" — before changing anything, so you can see what actually happened.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>A teammate's laptop was stolen last semester and nobody knew which of the group's accounts were exposed. Start with yours: Settings → Password and authentication — enable 2FA with an authenticator app if it is off, download the recovery codes into your password manager, and add one passkey. Sign out and sign in again with the passkey.</li><li>Open Settings → Security log and filter <code>operation:authentication</code>. Find your own sign-in from step 1 — and anything you do not recognise.</li><li>In <code>thu-git</code>: add <code>.github/dependabot.yml</code> (npm + github-actions, weekly) and a <code>SECURITY.md</code>, commit them as one commit and push. Then Settings → Advanced Security: enable Dependabot alerts and Dependabot security updates; if the repository is public, check that secret scanning and push protection are on.</li><li>Test push protection without a real secret: GitHub's docs describe the blocked-push message and the bypass page; read them, then run <code>git log -p -S"ghp_" --all</code> in your real project repositories to make sure no GitHub token has ever been committed there.</li></ol>
<pre><code class="language-bash">git show --stat --format="%h %s" HEAD
e4ef3c3 chore: bật Dependabot và thêm SECURITY.md

 .github/dependabot.yml | 10 ++++++++++
 SECURITY.md            |  7 +++++++
 2 files changed, 17 insertions(+)   <span class="tok-comment"># real output from the author's test repository</span></code></pre>
<p><strong>Done when:</strong> Password and authentication shows 2FA "Enabled" and at least one passkey, the security log shows your passkey sign-in, <code>thu-git</code> has both files on <code>main</code>, and Advanced Security lists Dependabot alerts as enabled.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Two-factor authentication (2FA)</span><span class="v">Signing in needs something you know (password) plus something you have (an authenticator app, a security key).</span></div>
  <div class="kv"><span class="k">Passkey</span><span class="v">A key pair stored on your device and bound to github.com; it replaces password + 2FA in one phishing-resistant step.</span></div>
  <div class="kv"><span class="k">Collaborator / role</span><span class="v">A person given access to a repository; in an organisation their power is set by a role — Read, Triage, Write, Maintain or Admin.</span></div>
  <div class="kv"><span class="k">Dependabot alert / update</span><span class="v">A warning that a dependency version is vulnerable, and the pull request Dependabot opens to upgrade it.</span></div>
  <div class="kv"><span class="k">Secret scanning / push protection</span><span class="v">Finding credentials already in the repository, and refusing a push that would add one.</span></div>
  <div class="kv"><span class="k">SECURITY.md / security log</span><span class="v">The file that tells people how to report a vulnerability privately; the 90-day record of security events on your account.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Protect the account first: 2FA with an authenticator app, recovery codes stored safely, and a passkey.</li><li>Personal repositories only know owner and collaborator; a team that needs Read or Triage needs an organisation.</li><li>Dependabot alerts tell you a dependency is vulnerable; security updates open the PR that fixes it.</li><li>Push protection stops a secret before it lands; a secret that already landed must be revoked, not just deleted.</li><li>SECURITY.md gives bad news a private door, and the security log tells you what really happened.</li></ul>

<a class="link-card" href="https://docs.github.com/en/code-security/getting-started/quickstart-for-securing-your-repository" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Quickstart for securing your repository</span><span class="lc-sub">Access, dependency graph, Dependabot, secret protection and a security policy, step by step.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection" target="_blank" rel="noopener">
  <span class="lc-ico">🕵️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — About push protection</span><span class="lc-sub">What is blocked, push protection for users, and the bypass reasons.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Configuring two-factor authentication</span><span class="lc-sub">Authenticator apps, security keys, passkeys and recovery codes.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>How this goes wrong in a student team project.</strong> <b>Everyone is Admin "so nobody gets blocked".</b> Then anyone can switch off branch protection the night before the deadline, or delete the repository by mistake. Give Write, keep one or two Admins. <b>One shared GitHub account for the whole group.</b> The history can no longer say who did what, 2FA codes end up in the group chat, and the lecturer grading contributions sees one name. <b>"I deleted the .env in the next commit."</b> The key is still in the previous commit, on GitHub, forever — revoke it. <b>Thirty Dependabot PRs ignored for a month.</b> Merge the patch and minor bumps weekly while they are small; a backlog is how a real vulnerability hides.</div>
<p class="note-ct"><strong>How to think about it:</strong> none of these layers is strong alone. 2FA does not stop a leaked token, secret scanning does not stop a malicious collaborator, roles do not stop a vulnerable package. Together they mean an attacker has to beat several unrelated things at once — and each one costs you a few minutes, once.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.3</span>
<h2>Ai vào được kho, và cái gì báo cho bạn khi có chuyện</h2>
<p class="lead">Một kho mã chỉ an toàn bằng tài khoản yếu nhất có quyền push vào nó. Với một nhóm sinh viên, điều đó nghĩa là năm tài khoản cá nhân, một nhánh <code>main</code> dùng chung, một <code>package.json</code> đầy mã của người khác, và ít nhất một file <code>.env</code> mà sớm muộn sẽ có người định commit. GitHub có một câu trả lời miễn phí cho từng chuyện đó — phần lớn chỉ là một cú bấm trong Settings, và hầu như không ai bật chúng cho tới khi sự cố đã xảy ra.</p>

<h3>Lớp 1 — tài khoản của bạn: 2FA và passkey</h3>
${slide('git-11', 14, 'Bảo mật kho: sáu lớp')}
<p>Mọi thứ còn lại trong bài này đều giả định người đang push đúng là bạn. Một mình mật khẩu không chứng minh được điều đó: mật khẩu bị dùng lại, bị lừa lấy (phishing), bị lộ. GitHub bắt buộc 2FA (two-factor authentication — xác thực hai lớp) với các tài khoản có đóng góp mã, nên nếu bạn chưa bị yêu cầu thì rồi cũng sẽ bị.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Ở đâu</span><span class="v">Ảnh đại diện → <strong>Settings</strong> → <strong>Password and authentication</strong> → <strong>Enable two-factor authentication</strong>.</span></div>
  <div class="kv"><span class="k">App TOTP (nên dùng)</span><span class="v">Một app xác thực sinh mã sáu số mỗi 30 giây. Tài liệu của GitHub khuyên dùng nó hơn SMS, vì tin nhắn có thể bị chặn bắt.</span></div>
  <div class="kv"><span class="k">Recovery codes</span><span class="v">Mã khôi phục — chỉ hiện một lần lúc bật 2FA. Tải về và cất trong trình quản lý mật khẩu — đó là đường quay lại nếu bạn mất điện thoại.</span></div>
  <div class="kv"><span class="k">Kiểm tra 28 ngày</span><span class="v">Sau khi bật 2FA, GitHub yêu cầu bạn chứng minh trong vòng 28 ngày rằng nó chạy được, để một mã QR quét hỏng không khoá bạn ngoài cửa vài tháng sau.</span></div>
  <div class="kv"><span class="k">Passkey</span><span class="v">Khoá đăng nhập — cùng trang đó, mục <strong>Passkeys</strong> → <strong>Add a passkey</strong>. Được giữ bởi Touch ID, Windows Hello, điện thoại hoặc trình quản lý mật khẩu, và gắn chặt với tên miền <code>github.com</code> — một trang đăng nhập giả không dùng được nó. Nó thay cả bước mật khẩu lẫn bước 2FA trong một lần.</span></div>
</div>
<div class="callout warn">Mã khôi phục thuộc về trình quản lý mật khẩu hoặc tờ giấy — không bao giờ nằm trong kho mã, trong một ghi chú đồng bộ lên drive của nhóm, hay trong ảnh chụp màn hình ở thư viện ảnh. Và hãy nhớ thứ 2FA <em>KHÔNG</em> bảo vệ: một personal access token hay một khoá SSH đã nằm sẵn trên laptop (bài 5.2) vẫn dùng được mà không cần lớp thứ hai. Hãy đặt hạn dùng cho token và xoá những cái không còn dùng.</div>

<h3>Lớp 2 — ai vào được: collaborator, tổ chức và vai trò</h3>
${slide('git-11', 16, 'Quyền, SECURITY.md và nhật ký bảo mật')}
<p>Một kho nằm dưới tài khoản cá nhân chỉ có đúng hai mức: bạn — chủ kho (owner), và <strong>collaborator</strong> (cộng tác viên). Collaborator push được, merge được pull request, quản lý được issue và nhãn — và trên một kho riêng tư của cá nhân thì không có lựa chọn chỉ-đọc: ai được mời cũng có quyền ghi. Hai người thì ổn. Một nhóm năm người kèm một giảng viên chỉ nên xem, thì đó là công cụ sai.</p>
<p>Một <strong>organization</strong> (tổ chức) miễn phí cho bạn các vai trò thật, gán theo từng người hoặc — tốt hơn — theo <strong>team</strong> (đội):</p>
<table>
<tr><th>Vai trò</th><th>Dành cho</th><th>Làm được</th></tr>
<tr><td>Read</td><td>giảng viên hướng dẫn, người chấm</td><td>xem, clone, mở và bình luận issue</td></tr>
<tr><td>Triage</td><td>tester, người quản lý dự án</td><td>thêm: gắn nhãn, giao việc, đóng/mở issue và PR — nhưng không push</td></tr>
<tr><td>Write</td><td>mọi lập trình viên</td><td>thêm: push nhánh và merge pull request</td></tr>
<tr><td>Maintain</td><td>trưởng nhóm</td><td>thêm: quản lý cài đặt của kho, trừ những thứ nhạy cảm hoặc phá huỷ</td></tr>
<tr><td>Admin</td><td>một hai người</td><td>mọi thứ, kể cả cài đặt bảo mật và xoá kho</td></tr>
</table>
<p>Cho một nhóm SWP391: tạo một organization cho đồ án, một team <code>developers</code> với quyền <strong>Write</strong>, cho trưởng nhóm <strong>Maintain</strong> hoặc <strong>Admin</strong>, và giảng viên <strong>Read</strong>. Khi có bạn rời nhóm, gỡ bạn đó khỏi team ngay trong ngày — và nhớ lời cảnh báo trong chính tài liệu GitHub: một <strong>deploy key</strong> (khoá triển khai) vẫn dùng được với bất kỳ ai giữ khoá riêng, kể cả sau khi họ đã bị gỡ khỏi tổ chức. Hãy thay khoá.</p>

<h3>Lớp 3 — mã bạn không tự viết: Dependabot</h3>
${slide('git-11', 15, 'Dependabot và push protection')}
<p>Một dự án Next.js kéo về hàng trăm gói thư viện. Khi một lỗ hổng được công bố cho một trong số đó, câu hỏi không phải là bạn có đọc thông báo không — bạn không đọc — mà là có thứ gì báo cho bạn không. Dependabot là ba tính năng riêng rẽ, rất dễ nhầm với nhau:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Dependabot alerts</span><span class="v">Cảnh báo lỗ hổng — GitHub đọc các file khai báo và file khoá phiên bản của bạn (<em>dependency graph</em> — đồ thị phụ thuộc), đối chiếu với GitHub Advisory Database, và bật cảnh báo khi một phiên bản bạn đang dùng có lỗ hổng. Dùng được với mọi kho, công khai hay riêng tư.</span></div>
  <div class="kv"><span class="k">Dependabot security updates</span><span class="v">Cập nhật bảo mật — với mỗi cảnh báo đã có bản vá, Dependabot mở một pull request nâng gói lên phiên bản <em>NHỎ NHẤT</em> có chứa bản vá, và gắn PR đó với cảnh báo.</span></div>
  <div class="kv"><span class="k">Dependabot version updates</span><span class="v">Cập nhật phiên bản — không liên quan tới lỗ hổng: giữ thư viện luôn mới theo lịch, cấu hình bằng một file bạn commit.</span></div>
</div>
<p>Cảnh báo và cập nhật bảo mật được bật trong <strong>Settings → Advanced Security</strong> của kho (trang này trước kia tên là "Code security and analysis"). Cập nhật phiên bản nằm trong <code>.github/dependabot.yml</code>:</p>
<pre><code class="language-yaml">version: 2
updates:
  - package-ecosystem: <span class="tok-string">"npm"</span>
    directory: <span class="tok-string">"/"</span>
    schedule:
      interval: <span class="tok-string">"weekly"</span>
  - package-ecosystem: <span class="tok-string">"github-actions"</span>   <span class="tok-comment"># giữ actions/checkout@v4 và các action khác luôn mới</span>
    directory: <span class="tok-string">"/"</span>
    schedule:
      interval: <span class="tok-string">"weekly"</span></code></pre>
<p>Mục <code>github-actions</code> khép vòng với bài 11.2: các action mà workflow của bạn dùng cũng là thư viện phụ thuộc, và phiên bản ghim cứng thì cũ dần. Mọi pull request của Dependabot đều chạy qua đúng CI như PR của bạn — đó chính là lý do CI phải có trước. Một check xanh trên một lần nâng bản nhỏ thường merge được yên tâm; một lần nâng bản <em>LỚN</em> (major) đáng được review như mọi PR khác, vì theo định nghĩa nó được phép làm vỡ thứ khác.</p>

<h3>Lớp 4 — bí mật: secret scanning và push protection</h3>
<p><strong>Secret scanning</strong> (quét bí mật) tìm các chứng chỉ — API key, token, khoá riêng — trong toàn bộ lịch sử Git trên mọi nhánh, cộng cả issue, pull request, discussion và wiki. Với kho công khai nó chạy tự động và miễn phí; cảnh báo hiện ở tab <strong>Security and quality</strong> của kho. Với nhiều nhà cung cấp, GitHub còn báo thẳng cho nhà cung cấp, nên một token bị lộ có thể đã bị thu hồi trước cả khi bạn đọc cảnh báo.</p>
<p><strong>Push protection</strong> (chặn khi đẩy) làm việc sớm hơn một bước: nó soát lần push và từ chối nếu có một bí mật thuộc loại nó nhận ra. "Push protection for users" bật sẵn cho mọi tài khoản và chặn việc đẩy những bí mật đó lên kho công khai; trên một kho đã bật secret scanning, bạn còn bật được nó cho tất cả mọi người push vào kho đó. Lần push bị từ chối liệt kê bí mật nằm ở đâu, theo dạng này (trích tài liệu GitHub):</p>
<pre><code>remote:   —— GitHub Personal Access Token ——————————————————————
remote:    locations:
remote:      - commit: 8728dbe67
remote:        path: README.md:4</code></pre>
<ol>
<li>Nếu bí mật chỉ nằm ở commit cuối: gỡ nó ra, <code>git commit --amend --all</code>, push lại.</li>
<li>Nếu nó nằm ở một commit cũ hơn: <code>git rebase -i &lt;commit-đầu-tiên&gt;~1</code>, đánh dấu commit đó là <code>edit</code>, gỡ bí mật, <code>git commit --amend</code>, <code>git rebase --continue</code> (Chương 8).</li>
<li>Nếu chuỗi đó thật sự vô hại, đường dẫn trong lời từ chối cho chính người đã push chọn một lý do — <em>It's used in tests</em> (dùng trong test), <em>It's a false positive</em> (báo nhầm), hoặc <em>I'll fix it later</em> (sẽ sửa sau) — rồi push lại trong vòng ba giờ. "I'll fix it later" để lại một cảnh báo còn mở; đó là một lời hứa, không phải một bản sửa.</li>
</ol>
<div class="callout danger">Nếu một khoá thật đã lên tới GitHub, hãy <strong>THU HỒI nó ở nhà cung cấp trước</strong>, rồi mới dọn lịch sử (bài 8.3). Bất kỳ ai đã clone hay quét kho trong lúc đó vẫn giữ nó, và bot quét các lần push công khai chỉ trong vài phút. Viết lại lịch sử giấu khoá khỏi người đọc về sau; chỉ thu hồi mới làm nó thôi dùng được.</div>

<h3>Lớp 5 — cửa riêng cho tin xấu: SECURITY.md</h3>
<p>Nếu ai đó tìm ra một lỗ hổng trong dự án của bạn — chẳng hạn API đặt lịch cho phép bất kỳ người dùng đã đăng nhập nào huỷ lịch hẹn của người khác — thì chỗ tệ nhất để họ báo là một issue công khai. <code>SECURITY.md</code> chỉ cho họ nên đi đâu. GitHub tìm file này ở gốc kho, trong <code>docs/</code>, hoặc trong <code>.github/</code>, và gắn liên kết tới nó ở tab <strong>Security and quality</strong> (→ <strong>Security policy</strong> → <strong>Start setup</strong> sẽ tạo file giúp bạn):</p>
<pre><code>cat SECURITY.md
# Chính sách bảo mật

## Báo lỗ hổng
Đừng mở issue công khai. Dùng nút
**Report a vulnerability** của kho,
hoặc gửi mail cho trưởng nhóm.
Chúng tôi trả lời trong 3 ngày làm việc.   <span class="tok-comment"># trong kho thử của tác giả</span></code></pre>
<p>Với kho công khai, hãy bật thêm <strong>Private vulnerability reporting</strong> (báo lỗ hổng kín — Settings → Advanced Security). Nó thêm nút <em>Report a vulnerability</em> ở trang Advisories của kho, để một người nghiên cứu bảo mật gửi chi tiết riêng cho người duy trì kho thay vì phải đi lùng một địa chỉ email.</p>

<h3>Lớp 6 — bản ghi: security log</h3>
<p>Tài khoản của bạn giữ một <strong>security log</strong> (nhật ký bảo mật) của 90 ngày gần nhất: các lần đăng nhập, token và khoá SSH mới, thay đổi 2FA, kho được tạo hay chuyển nhượng. Ảnh đại diện → <strong>Settings</strong> → trong mục "Archives", <strong>Security log</strong>. Nó không tìm được bằng chữ tự do, nhưng lọc được: <code>operation:authentication</code> hiện các sự kiện đăng nhập, <code>repo:owner/ten-kho</code> thu hẹp về một kho. Tổ chức có thứ tương đương cho mọi thành viên, gọi là <strong>audit log</strong> (nhật ký kiểm toán). Hãy mở nó ngay hôm laptop bị mất hoặc một bạn cùng nhóm nói "em không push cái đó" — TRƯỚC khi đổi bất cứ thứ gì, để còn thấy chuyện gì đã thật sự xảy ra.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Học kỳ trước laptop của một bạn trong nhóm bị mất và không ai biết tài khoản nào của nhóm bị lộ. Bắt đầu từ tài khoản của bạn: Settings → Password and authentication — bật 2FA bằng app xác thực nếu đang tắt, tải mã khôi phục vào trình quản lý mật khẩu, và thêm một passkey. Đăng xuất rồi đăng nhập lại bằng passkey.</li><li>Mở Settings → Security log và lọc <code>operation:authentication</code>. Tìm lần đăng nhập của chính bạn ở bước 1 — và bất cứ thứ gì bạn không nhận ra.</li><li>Trong <code>thu-git</code>: thêm <code>.github/dependabot.yml</code> (npm + github-actions, hằng tuần) và một file <code>SECURITY.md</code>, commit chung thành một commit rồi push. Sau đó vào Settings → Advanced Security: bật Dependabot alerts và Dependabot security updates; nếu kho công khai, kiểm rằng secret scanning và push protection đang bật.</li><li>Kiểm push protection mà không cần bí mật thật: tài liệu GitHub mô tả lời từ chối và trang bỏ qua; đọc chúng, rồi chạy <code>git log -p -S"ghp_" --all</code> trong các kho dự án thật của bạn để chắc rằng chưa từng có token GitHub nào bị commit vào đó.</li></ol>
<pre><code class="language-bash">git show --stat --format="%h %s" HEAD
e4ef3c3 chore: bật Dependabot và thêm SECURITY.md

 .github/dependabot.yml | 10 ++++++++++
 SECURITY.md            |  7 +++++++
 2 files changed, 17 insertions(+)   <span class="tok-comment"># output thật trong kho thử của tác giả</span></code></pre>
<p><strong>Đạt khi:</strong> trang Password and authentication hiện 2FA "Enabled" và ít nhất một passkey, security log có lần đăng nhập bằng passkey của bạn, <code>thu-git</code> có cả hai file trên <code>main</code>, và Advanced Security ghi Dependabot alerts đang bật.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Two-factor authentication (2FA)</span><span class="v">Xác thực hai lớp — đăng nhập cần thứ bạn biết (mật khẩu) cộng thứ bạn có (app xác thực, khoá bảo mật).</span></div>
  <div class="kv"><span class="k">Passkey</span><span class="v">Khoá đăng nhập — một cặp khoá lưu trên thiết bị của bạn và gắn với github.com; thay mật khẩu + 2FA bằng một bước không bị trang giả lừa.</span></div>
  <div class="kv"><span class="k">Collaborator / role</span><span class="v">Cộng tác viên / vai trò — người được cấp quyền vào một kho; trong tổ chức, quyền của họ do vai trò quyết định: Read, Triage, Write, Maintain hoặc Admin.</span></div>
  <div class="kv"><span class="k">Dependabot alert / update</span><span class="v">Cảnh báo / cập nhật phụ thuộc — lời báo rằng một phiên bản thư viện có lỗ hổng, và pull request Dependabot mở ra để nâng nó.</span></div>
  <div class="kv"><span class="k">Secret scanning / push protection</span><span class="v">Quét bí mật / chặn khi đẩy — tìm chứng chỉ đã nằm trong kho, và từ chối một lần push sắp thêm chứng chỉ vào.</span></div>
  <div class="kv"><span class="k">SECURITY.md / security log</span><span class="v">Chính sách bảo mật / nhật ký bảo mật — file chỉ cách báo lỗ hổng một cách kín đáo; bản ghi 90 ngày các sự kiện bảo mật trên tài khoản.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Bảo vệ tài khoản trước: 2FA bằng app xác thực, mã khôi phục cất kỹ, và một passkey.</li><li>Kho cá nhân chỉ biết chủ kho và collaborator; nhóm cần Read hay Triage thì cần một organization.</li><li>Dependabot alerts báo một thư viện có lỗ hổng; security updates mở luôn PR để vá nó.</li><li>Push protection chặn bí mật trước khi nó lên; bí mật đã lên rồi thì phải thu hồi, không chỉ xoá.</li><li>SECURITY.md cho tin xấu một cửa riêng, và security log cho bạn biết chuyện gì đã thật sự xảy ra.</li></ul>

<a class="link-card" href="https://docs.github.com/en/code-security/getting-started/quickstart-for-securing-your-repository" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Bảo mật kho mã từng bước</span><span class="lc-sub">Quyền truy cập, dependency graph, Dependabot, bảo vệ bí mật và chính sách bảo mật.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection" target="_blank" rel="noopener">
  <span class="lc-ico">🕵️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Về push protection</span><span class="lc-sub">Cái gì bị chặn, push protection cho người dùng, và các lý do được phép bỏ qua.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/authentication/securing-your-account-with-two-factor-authentication-2fa/configuring-two-factor-authentication" target="_blank" rel="noopener">
  <span class="lc-ico">🔑</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Cài đặt xác thực hai lớp</span><span class="lc-sub">App xác thực, khoá bảo mật, passkey và mã khôi phục.</span></span>
</a>

<div class="pitfall co-tieu-de"><strong>Chuyện này hỏng thế nào trong đồ án nhóm.</strong> <b>Ai cũng là Admin "cho khỏi bị chặn".</b> Rồi bất kỳ ai cũng tắt được bảo vệ nhánh vào đêm trước hạn nộp, hoặc lỡ tay xoá luôn kho. Hãy cho Write, giữ một hai Admin thôi. <b>Cả nhóm dùng chung một tài khoản GitHub.</b> Lịch sử không còn nói được ai làm gì, mã 2FA trôi nổi trong nhóm chat, và giảng viên chấm phần đóng góp chỉ thấy đúng một cái tên. <b>"Em xoá file .env ở commit sau rồi."</b> Khoá vẫn nằm ở commit trước đó, trên GitHub, mãi mãi — hãy thu hồi nó. <b>Ba mươi PR của Dependabot bị bỏ mặc cả tháng.</b> Merge các bản vá và bản nâng nhỏ hằng tuần khi chúng còn nhỏ; một đống tồn đọng là chỗ một lỗ hổng thật ẩn mình.</div>
<p class="note-ct"><strong>Nghĩ về nó thế này:</strong> không lớp nào trong số này mạnh khi đứng một mình. 2FA không chặn được một token bị lộ, secret scanning không chặn được một collaborator có ý xấu, vai trò không chặn được một gói thư viện có lỗ hổng. Gộp lại, chúng buộc kẻ tấn công phải vượt qua nhiều thứ chẳng liên quan gì tới nhau cùng một lúc — còn bạn thì mỗi thứ chỉ tốn vài phút, một lần.</p>
</div>
`,
    },

    /* ─────────────────────────── 11.4 Quiz ─────────────────────────── */
    {
      title: '11.4 — Chapter 11 quiz|||11.4 — Kiểm tra Chương 11',
      slug: 'git-11-3-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống thật của nhóm đồ án trên GitHub: issue không tự đóng, bảng Projects, job chạy song song, actionlint, matrix fail-fast, secret lọt log, check bắt buộc Pending, vai trò Triage, Dependabot và khoá API đã bị push.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from running a team project on GitHub — each one is decided by how issues, Actions and the security settings actually behave, not by definitions. Read the explanation after submitting, especially for the ones you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can take a bug from an issue to a branch (<code>gh issue develop</code>) to a pull request that closes it, and know when <code>Closes #n</code> actually fires.</li>
<li>I can read a workflow file and say what <code>on</code>, <code>jobs</code>, <code>runs-on</code>, <code>steps</code>, <code>matrix</code> and <code>concurrency</code> each do.</li>
<li>I check a workflow with actionlint and the same commands CI runs before pushing, and read a failure with <code>gh run view --log-failed</code>.</li>
<li>I can make a CI job a required check, and explain why renaming the job leaves pull requests waiting.</li>
<li>I have 2FA and a passkey on my account, and I know which roles, Dependabot settings and secret protections a team repository needs.</li>
</ul>
${slide('git-11', 17, 'Bảng tra nhanh Chương 11')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống khi vận hành một dự án nhóm trên GitHub — câu nào cũng được quyết định bởi cách issue, Actions và các cài đặt bảo mật thật sự hoạt động, không phải bởi định nghĩa. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đưa được một lỗi từ issue sang nhánh (<code>gh issue develop</code>) sang pull request đóng nó, và biết khi nào <code>Closes #n</code> thật sự có tác dụng.</li>
<li>Tôi đọc được một file workflow và nói được <code>on</code>, <code>jobs</code>, <code>runs-on</code>, <code>steps</code>, <code>matrix</code>, <code>concurrency</code> mỗi thứ làm gì.</li>
<li>Tôi kiểm workflow bằng actionlint và đúng các lệnh CI sẽ chạy trước khi push, và đọc lỗi bằng <code>gh run view --log-failed</code>.</li>
<li>Tôi biến được một job CI thành check bắt buộc, và giải thích được vì sao đổi tên job làm pull request đứng chờ.</li>
<li>Tài khoản của tôi có 2FA và passkey, và tôi biết một kho nhóm cần vai trò, cài đặt Dependabot và lớp bảo vệ bí mật nào.</li>
</ul>
${slide('git-11', 17, 'Bảng tra nhanh Chương 11')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Your team works on a develop branch and only merges develop into main at the end of each sprint. You committed "Closes #12" on fix/12-gio-am and merged that PR into develop yesterday. Issue #12 is still open. Why?|||Nhóm bạn làm trên nhánh develop và chỉ merge develop vào main cuối mỗi sprint. Bạn commit "Closes #12" trên fix/12-gio-am và hôm qua đã merge PR đó vào develop. Issue #12 vẫn mở. Vì sao?',
            options: [
              'The keyword must be in the PR title, not the commit message|||Từ khoá phải nằm trong tiêu đề PR, không phải lời nhắn commit',
              'GitHub only reads closing keywords typed in issue comments|||GitHub chỉ đọc từ khoá đóng issue gõ trong bình luận của issue',
              'The commit has not reached the default branch yet — it closes #12 when develop is merged into main|||Commit chưa tới nhánh mặc định — #12 sẽ đóng khi develop được merge vào main',
              'Closing keywords only work for PRs created with gh pr create|||Từ khoá đóng chỉ có tác dụng với PR tạo bằng gh pr create',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: A closing keyword in a commit message or PR description closes the issue when the change lands on the repository’s default branch. Merging into develop links the issue but does not close it; the sprint merge into main will. The title is not where GitHub looks for commit keywords, and comments are ignored entirely. If you want it closed now, close it by hand with a sentence pointing at the PR.|||VI: Từ khoá đóng trong lời nhắn commit hoặc mô tả PR chỉ đóng issue khi thay đổi tới được nhánh mặc định của kho. Merge vào develop thì liên kết issue nhưng chưa đóng; lần merge cuối sprint vào main mới đóng. Tiêu đề không phải chỗ GitHub đọc từ khoá của commit, còn bình luận thì bị bỏ qua hoàn toàn. Muốn đóng ngay thì đóng tay, kèm một câu trỏ tới PR.',
          },
          {
            question: 'You created a Projects board for SWP391. Closed issues move to Done by themselves, but issues you add to the board sit with an empty Status instead of Todo. What is going on?|||Bạn tạo một bảng Projects cho SWP391. Issue đóng thì tự sang Done, nhưng issue mới thêm vào bảng lại có Status trống thay vì Todo. Chuyện gì đang xảy ra?',
            options: [
              'Only two built-in workflows are on by default (closed → Done, merged → Done); "item added → Todo" must be turned on under Workflows|||Chỉ hai workflow có sẵn bật mặc định (đóng → Done, merge → Done); luật "thêm vào → Todo" phải bật trong mục Workflows',
              'Automatic status changes need a paid GitHub plan, so the Done move is a one-off|||Đổi trạng thái tự động cần gói GitHub trả phí, nên lần sang Done chỉ là ngẫu nhiên',
              'Issues get a Status only after a type:… label is attached to them|||Issue chỉ có Status sau khi được gắn một nhãn type:…',
              'Items get a Status only when added with gh project item-add, not from the web|||Thẻ chỉ có Status khi thêm bằng gh project item-add, không phải từ web',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: A new project enables exactly two built-in workflows: closed issues/PRs and merged PRs set Status to Done. Setting Todo on add is another built-in workflow you switch on in the project’s Workflows menu. It has nothing to do with plans, labels or which client added the item — the same item added by gh or the web behaves the same.|||VI: Một project mới bật đúng hai workflow có sẵn: issue/PR bị đóng và PR được merge thì Status = Done. Đặt Todo khi thêm vào là một workflow có sẵn khác, bạn bật trong menu Workflows của project. Chuyện này không liên quan tới gói trả phí, nhãn hay công cụ dùng để thêm — cùng một thẻ thêm bằng gh hay bằng web đều như nhau.',
          },
          {
            question: 'Your group repository lives under your personal account and is private. The tester should label and close issues but must never push code. What do you do?|||Kho của nhóm nằm dưới tài khoản cá nhân của bạn và là kho riêng tư. Bạn tester cần gắn nhãn và đóng issue nhưng tuyệt đối không được push mã. Bạn làm gì?',
            options: [
              'Invite the tester as a collaborator and pick "Read" in the invitation|||Mời bạn tester làm collaborator và chọn "Read" khi mời',
              'Share your own login with the tester so you can watch what they do|||Đưa tài khoản của bạn cho bạn tester để còn theo dõi được họ làm gì',
              'Give Write access and ask the tester politely not to push|||Cho quyền Write và nhờ bạn tester đừng push',
              'Move the repository into a free organisation and give the tester the Triage role|||Chuyển kho vào một organization miễn phí và cho bạn tester vai trò Triage',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: A personal repository has only owner and collaborators, and on a private one every collaborator gets write access — there is no Read choice to pick. Organisations have the Read / Triage / Write / Maintain / Admin roles; Triage manages issues and PRs without push. "Write and ask nicely" is the tempting answer, but it is a promise, not a permission. Sharing an account destroys the history of who did what.|||VI: Kho cá nhân chỉ có chủ kho và collaborator, và với kho riêng tư thì mọi collaborator đều có quyền ghi — không có lựa chọn Read nào để chọn. Organization mới có các vai trò Read / Triage / Write / Maintain / Admin; Triage quản lý issue và PR mà không push được. "Cho Write rồi nhờ khéo" là phương án hấp dẫn, nhưng đó là lời hứa chứ không phải quyền. Dùng chung tài khoản thì xoá sạch dấu vết ai đã làm gì.',
          },
          {
            question: 'Your workflow has two jobs, test and deploy, in that order in the file. A PR with a failing test still got deployed, because deploy started at the same moment as test. Why, and what fixes it?|||Workflow của bạn có hai job, test và deploy, theo đúng thứ tự đó trong file. Một PR có test hỏng vẫn bị deploy, vì deploy chạy cùng lúc với test. Vì sao, và sửa thế nào?',
            options: [
              'Jobs run top to bottom, so this must be a GitHub outage — re-run the workflow|||Job chạy từ trên xuống, nên chắc chắn GitHub gặp sự cố — chạy lại workflow',
              'Jobs run in parallel unless one declares needs: — add needs: test to the deploy job|||Job chạy song song trừ khi khai needs: — thêm needs: test vào job deploy',
              'Both jobs must use the same runs-on to share a result — set both to ubuntu-latest|||Hai job phải cùng runs-on mới chia sẻ kết quả — đặt cả hai là ubuntu-latest',
              'Deploy steps ignore failures unless fail-fast is set — add fail-fast: true|||Bước deploy bỏ qua lỗi trừ khi đặt fail-fast — thêm fail-fast: true',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Jobs in a workflow start in parallel on separate machines; order in the file means nothing. needs: test makes deploy wait for test and skip if it fails. Using the same runs-on only picks the same kind of machine, not the same machine. fail-fast is a matrix setting about cancelling sibling jobs, not about ordering. (And as 11.2 says, deploying on every push is a risk of its own.)|||VI: Các job trong một workflow bắt đầu song song trên những máy riêng; thứ tự trong file không có nghĩa gì. needs: test bắt deploy chờ test và bị bỏ qua nếu test hỏng. Cùng runs-on chỉ là chọn cùng loại máy, không phải cùng một máy. fail-fast là cài đặt của ma trận về việc huỷ các job anh em, không liên quan thứ tự. (Và như bài 11.2 đã nói, deploy ở mọi lần push tự nó đã là rủi ro.)',
          },
          {
            question: 'Before pushing, you run actionlint and get: ci.yml:3:3: unknown Webhook event "pull-request". What is the right conclusion?|||Trước khi push, bạn chạy actionlint và nhận: ci.yml:3:3: unknown Webhook event "pull-request". Kết luận đúng là gì?',
            options: [
              'The event is spelled pull_request; as written the workflow would not trigger on pull requests — fix it before pushing|||Sự kiện viết là pull_request; viết như vậy thì workflow không kích hoạt theo pull request — sửa trước khi push',
              'actionlint is stricter than GitHub, which accepts both spellings — ignore it|||actionlint khắt khe hơn GitHub, còn GitHub nhận cả hai cách viết — bỏ qua',
              'The actionlint version is too old to know newer events — update it and run again|||Phiên bản actionlint quá cũ nên chưa biết sự kiện mới — cập nhật rồi chạy lại',
              'The file must be named ci.yaml for events with a dash — rename it|||File phải tên ci.yaml thì sự kiện có gạch ngang mới được nhận — đổi tên',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Webhook event names use underscores: pull_request, workflow_dispatch. actionlint checks against GitHub’s list of events, so this is a real mistake, not strictness — the workflow would not run for pull requests and your required check would never appear. Updating actionlint does not invent a new event, and .yml and .yaml are both accepted file extensions.|||VI: Tên sự kiện webhook dùng gạch dưới: pull_request, workflow_dispatch. actionlint đối chiếu với danh sách sự kiện của GitHub, nên đây là lỗi thật chứ không phải khắt khe — workflow sẽ không chạy cho pull request và check bắt buộc của bạn sẽ không bao giờ xuất hiện. Cập nhật actionlint không tạo ra sự kiện mới, còn đuôi .yml và .yaml đều được chấp nhận.',
          },
          {
            question: 'Settings → Advanced Security shows Dependabot alerts enabled, and there is an alert for a vulnerable package in package-lock.json — but no Dependabot pull request ever appears. Why?|||Settings → Advanced Security cho thấy Dependabot alerts đang bật, và có một cảnh báo cho một gói có lỗ hổng trong package-lock.json — nhưng không có pull request nào của Dependabot xuất hiện. Vì sao?',
            options: [
              'Alerts only work once a .github/dependabot.yml file is committed|||Cảnh báo chỉ hoạt động khi đã commit file .github/dependabot.yml',
              'Dependabot only opens pull requests on public repositories|||Dependabot chỉ mở pull request trên kho công khai',
              'Alerts only warn; the fix PRs come from "Dependabot security updates", which is a separate setting to enable|||Cảnh báo chỉ báo; PR vá lỗi đến từ "Dependabot security updates", một cài đặt riêng phải bật',
              'Dependabot skips packages that are pinned in a lock file|||Dependabot bỏ qua các gói đã được ghim trong file lock',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Dependabot is three features. Alerts compare your dependency graph with the Advisory Database and warn. Security updates — a separate switch in Advanced Security — open a PR raising the package to the minimum patched version. dependabot.yml configures version updates, which is the tempting answer, but alerts already work without it (you are looking at one). Lock files are exactly what the dependency graph reads.|||VI: Dependabot là ba tính năng. Alerts đối chiếu đồ thị phụ thuộc với Advisory Database và cảnh báo. Security updates — một công tắc riêng trong Advanced Security — mở PR nâng gói lên phiên bản nhỏ nhất đã vá. dependabot.yml cấu hình version updates; đó là phương án hấp dẫn, nhưng cảnh báo vẫn chạy khi thiếu file này (bạn đang nhìn thấy một cái). File lock chính là thứ đồ thị phụ thuộc đọc.',
          },
          {
            question: 'Your matrix is node: [20, 22] × os: [ubuntu-latest, windows-latest]. After one push you see one red job and the other three marked cancelled, so you cannot tell whether only Windows is broken. What changes that?|||Ma trận của bạn là node: [20, 22] × os: [ubuntu-latest, windows-latest]. Sau một lần push bạn thấy một job đỏ và ba job còn lại bị đánh dấu cancelled, nên không biết có phải chỉ Windows hỏng. Thay đổi gì để thấy đủ?',
            options: [
              'Add max-parallel: 1 so the jobs run one after another|||Thêm max-parallel: 1 để các job chạy lần lượt',
              'Remove windows-latest — Windows runners are not available on the free plan|||Bỏ windows-latest — máy Windows không có trong gói miễn phí',
              'Split the matrix into two workflows, because a matrix supports only one dimension|||Tách ma trận thành hai workflow, vì ma trận chỉ hỗ trợ một chiều',
              'Set strategy.fail-fast: false — it defaults to true, which cancels the remaining jobs on the first failure|||Đặt strategy.fail-fast: false — mặc định là true, tức huỷ các job còn lại khi có job đầu tiên hỏng',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: fail-fast defaults to true: the first failing matrix job cancels its siblings. With false, all four finish and the pattern (both Windows red, both Ubuntu green) points at the operating system. max-parallel only limits how many run at once — a failure would still cancel the rest. Windows runners are available, and a matrix happily takes several dimensions.|||VI: fail-fast mặc định là true: job đầu tiên của ma trận hỏng sẽ huỷ các job anh em. Đặt false thì cả bốn chạy xong, và hình mẫu (hai ô Windows đỏ, hai ô Ubuntu xanh) chỉ thẳng vào hệ điều hành. max-parallel chỉ giới hạn số job chạy cùng lúc — một lần hỏng vẫn huỷ phần còn lại. Máy Windows vẫn dùng được, và ma trận nhận nhiều chiều thoải mái.',
          },
          {
            question: 'To debug a failing deploy, a teammate adds a step that runs echo "$DB_URL" | base64 with DB_URL taken from secrets. The log shows a long base64 string. What now?|||Để gỡ lỗi một lần deploy hỏng, một bạn thêm bước chạy echo "$DB_URL" | base64 với DB_URL lấy từ secrets. Log hiện ra một chuỗi base64 dài. Giờ làm gì?',
            options: [
              'Treat the secret as leaked: rotate the database password, remove the step, and delete that run’s logs|||Coi như secret đã lộ: đổi mật khẩu cơ sở dữ liệu, gỡ bước đó, và xoá log của lượt chạy ấy',
              'Nothing — GitHub masks secrets in logs, so the value is safe|||Không cần gì — GitHub che secret trong log, nên giá trị vẫn an toàn',
              'Nothing — the repository is private, so only the team can read the log|||Không cần gì — kho riêng tư nên chỉ người trong nhóm đọc được log',
              'Switch the step to GITHUB_TOKEN so the value is encrypted next time|||Chuyển bước đó sang GITHUB_TOKEN để lần sau giá trị được mã hoá',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Masking is a string match on the exact secret value; base64 of it is a different string, so it is printed in clear — anyone who can read the log can decode it. "GitHub masks secrets" is the tempting answer and exactly the assumption this breaks. A private repository still has readers you did not pick (future members, a leaked token). GITHUB_TOKEN is GitHub’s own per-run token and has nothing to do with your database password.|||VI: Việc che là phép khớp chuỗi trên đúng giá trị của secret; base64 của nó là một chuỗi khác, nên được in ra nguyên văn — ai đọc được log là giải mã được. "GitHub che secret" là phương án hấp dẫn và chính là giả định bị phá ở đây. Kho riêng tư vẫn có người đọc mà bạn không chọn (thành viên sau này, một token bị lộ). GITHUB_TOKEN là token GitHub tự cấp cho mỗi lượt chạy, chẳng liên quan gì tới mật khẩu cơ sở dữ liệu của bạn.',
          },
          {
            question: 'main requires the check "Test". You added a Node 20/22 matrix and named the job "Test (Node ${{ matrix.node }})". CI is green, yet every PR now waits on "Test — Expected, waiting for status to be reported". Why?|||main yêu cầu check "Test". Bạn thêm ma trận Node 20/22 và đặt tên job là "Test (Node ${{ matrix.node }})". CI xanh, vậy mà mọi PR giờ đều chờ "Test — Expected, waiting for status to be reported". Vì sao?',
            options: [
              'Matrix jobs never count as status checks; remove the matrix|||Job của ma trận không bao giờ được tính là check; bỏ ma trận đi',
              'The required check is matched by name; the jobs now report "Test (Node 20)" and "Test (Node 22)" — update the ruleset to require those|||Check bắt buộc được khớp theo tên; các job giờ báo "Test (Node 20)" và "Test (Node 22)" — sửa ruleset để yêu cầu hai tên đó',
              'Required checks only refresh once a day, so wait until tomorrow|||Check bắt buộc chỉ làm mới mỗi ngày một lần, nên chờ tới mai',
              'The workflow has a syntax error that actionlint would catch|||Workflow có lỗi cú pháp mà actionlint sẽ bắt được',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Branch protection and rulesets wait for a check with an exact name. Renaming the job — here by adding the matrix value — produces new check names, and nothing will ever report "Test" again, so the rule waits forever. Matrix jobs are ordinary checks; there is no daily refresh; and the workflow is valid, since it ran and went green.|||VI: Bảo vệ nhánh và ruleset chờ một check đúng tên. Đổi tên job — ở đây bằng cách thêm giá trị của ma trận — sinh ra tên check mới, và sẽ không còn gì báo tên "Test" nữa, nên luật chờ mãi. Job của ma trận là check bình thường; không có chuyện làm mới mỗi ngày; và workflow hợp lệ, vì nó đã chạy và xanh.',
          },
          {
            question: 'A teammate pushed .env with a live Stripe key to your public repository two hours ago, then removed the file in the next commit. What do you do first?|||Một bạn đã push file .env chứa khoá Stripe đang dùng lên kho công khai của nhóm từ hai giờ trước, rồi xoá file ở commit kế tiếp. Việc ĐẦU TIÊN là gì?',
            options: [
              'Rewrite history to remove .env and force-push — once it is gone from history it is safe|||Viết lại lịch sử để gỡ .env rồi force-push — mất khỏi lịch sử là an toàn',
              'Make the repository private so nobody else can see the old commit|||Chuyển kho sang riêng tư để không ai thấy commit cũ nữa',
              'Revoke the key in Stripe and issue a new one, then clean the history (8.3)|||Thu hồi khoá trong Stripe và cấp khoá mới, rồi mới dọn lịch sử (bài 8.3)',
              'Turn on push protection now so the key is blocked|||Bật push protection ngay để khoá bị chặn',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: The key is still in the earlier commit, and a public push is scanned by bots within minutes — assume it is copied. Only revoking it at the provider stops it working. Rewriting history is the tempting answer and still worth doing afterwards, but it cannot un-copy the key; going private hides it from future visitors only; push protection prevents new pushes and does nothing about a secret already on GitHub.|||VI: Khoá vẫn nằm ở commit trước đó, và một lần push công khai bị bot quét trong vài phút — hãy coi như nó đã bị chép. Chỉ thu hồi ở nhà cung cấp mới làm nó thôi dùng được. Viết lại lịch sử là phương án hấp dẫn và vẫn nên làm sau đó, nhưng nó không "bỏ chép" được khoá; chuyển riêng tư chỉ giấu với người xem về sau; push protection chặn các lần push mới và không làm gì được với bí mật đã nằm trên GitHub.',
          },
        ],
      },
    },
  ],
};
