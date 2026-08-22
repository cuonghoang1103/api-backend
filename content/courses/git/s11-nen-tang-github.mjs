/**
 * Git & GitHub — Chương 11: Nền tảng GitHub.
 * Issue/label/milestone/Projects + CLI gh · GitHub Actions từ số 0 ·
 * bảo mật (Dependabot, secret scanning, code scanning) · quiz.
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out đóng bằng </div> (KHÔNG </code></pre>). KHÔNG dùng <svg>.
 */
const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 11 — The GitHub platform|||Chương 11 — Nền tảng GitHub',
  description: 'Git là công cụ; GitHub là mọi thứ dựng quanh nó. Chương này đi qua theo dõi công việc bằng Issue và Projects, chạy việc tự động bằng Actions, các tính năng bảo mật đáng bật ngay hôm nay, và CLI gh để làm tất cả từ terminal.',
  lessons: [
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
<pre><code>git commit -m <span class="tok-string">"fix(feed): render a placeholder when a post has no author

Closes #412"</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Closes / Fixes / Resolves #412</span><span class="v">Closes the issue when the commit reaches the default branch (6.1).</span></div>
  <div class="kv"><span class="k">#412 alone</span><span class="v">Links without closing. Use it for "related to".</span></div>
  <div class="kv"><span class="k">owner/repo#412</span><span class="v">Cross-repository reference.</span></div>
  <div class="kv"><span class="k">@username</span><span class="v">Notifies a person. In a commit message it notifies them every time the commit is rebased — prefer mentions in comments.</span></div>
</div>

<h3>The gh CLI — the whole platform without a browser</h3>
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
<pre><code>git commit -m <span class="tok-string">"fix(feed): hien tac gia giu cho khi bai khong co tac gia

Closes #412"</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Closes / Fixes / Resolves #412</span><span class="v">Đóng issue khi commit tới được nhánh mặc định (bài 6.1).</span></div>
  <div class="kv"><span class="k">Chỉ #412</span><span class="v">Liên kết mà không đóng. Dùng cho "liên quan tới".</span></div>
  <div class="kv"><span class="k">owner/repo#412</span><span class="v">Tham chiếu liên kho.</span></div>
  <div class="kv"><span class="k">@tênngườidùng</span><span class="v">Báo cho một người. Trong lời nhắn commit thì nó báo cho họ mỗi lần commit bị rebase — hãy nhắc tên trong bình luận thì hơn.</span></div>
</div>

<h3>CLI gh — cả nền tảng mà không cần trình duyệt</h3>
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
<pre><code><span class="tok-comment"># .github/workflows/ci.yml</span>
name: CI
on:
  pull_request:
  push:
    branches: [main]

<span class="tok-comment"># Cancel an in-flight run when a new commit arrives on the same PR.</span>
concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
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
<pre><code>      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }      <span class="tok-comment"># dependency cache, one line</span>

      - uses: actions/cache@v4                       <span class="tok-comment"># anything else</span>
        with:
          path: |
            .next/cache
            ~/.cache/ms-playwright
          key: build-\${{ runner.os }}-\${{ hashFiles('package-lock.json') }}
          restore-keys: build-\${{ runner.os }}-</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">key</span><span class="v">Exact match → cache restored, and saved again at the end only if the key was new.</span></div>
  <div class="kv"><span class="k">restore-keys</span><span class="v">Prefix fallback: no exact match, take the newest close one. Turns a cold cache into a warm one.</span></div>
  <div class="kv"><span class="k">Also</span><span class="v">Run only what changed on a monorepo (10.3), and split slow suites across a matrix.</span></div>
</div>

<h3>Matrix builds</h3>
<pre><code>  test:
    strategy:
      fail-fast: false          <span class="tok-comment"># do not cancel the others on the first failure</span>
      matrix:
        node: [20, 22]
        os: [ubuntu-latest, windows-latest]
    runs-on: \${{ matrix.os }}</code></pre>
<p>Four jobs, in parallel. <code>fail-fast: false</code> matters when you are debugging: you want to know whether it fails on Windows <em>and</em> Node 20, not just that something failed first.</p>

<h3>Secrets and permissions</h3>
<pre><code>      - run: ./deploy.sh
        env:
          SSH_KEY: \${{ secrets.VPS_SSH_PRIVATE_KEY }}
          HOST:    \${{ secrets.VPS_HOST }}</code></pre>
<pre><code>permissions:
  contents: read            <span class="tok-comment"># default to the minimum…</span>
jobs:
  release:
    permissions:
      contents: write       <span class="tok-comment"># …and widen only where needed</span></code></pre>
<div class="callout danger">Secrets are masked in logs, and masking is a string match — <code>echo \$SECRET | base64</code> defeats it entirely. Never print a secret, never pass one to a third-party action you have not read, and pin actions to a full commit SHA (<code>uses: actions/checkout@8f4b7f8…</code>) rather than a moving tag when the action can see your secrets. A compromised tag on a popular action is a supply-chain attack against everyone who wrote <code>@v4</code>.</div>
<div class="callout ok">Prefer the automatic <code>GITHUB_TOKEN</code> over a stored personal access token (5.2): it is minted per run, scoped to that repository, and expires when the job ends. A leaked PAT is your whole account.</div>

<h3>Reading a failure</h3>
<pre><code>gh run list --limit 5
gh run view --log-failed        <span class="tok-comment"># only the failing step</span>
gh run rerun 1234567 --failed   <span class="tok-comment"># re-run just the failed jobs</span>
gh run watch                    <span class="tok-comment"># live, in the terminal</span></code></pre>
<p>And the habit from the CuongThai runbook: when CI goes red, check <em>which step</em> failed and whether your commit even touches that part of the tree (<code>git show --stat</code>) before assuming it is your diff.</p>

<h3>Three mistakes that make CI untrustworthy</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Required check with a path filter</span><span class="v">It never runs on an unrelated PR, so GitHub waits forever (6.4). Add a same-named companion job that reports success.</span></div>
  <div class="kv"><span class="k">Flaky tests left in</span><span class="v">One red run in five teaches everyone to press "re-run" without reading. From then on CI is decoration. Fix or quarantine flakes the day you notice them.</span></div>
  <div class="kv"><span class="k">A twenty-minute pipeline</span><span class="v">People stop waiting and merge on hope. Cache, parallelise, and run the slow suite post-merge rather than per-PR.</span></div>
</div>

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
<pre><code><span class="tok-comment"># .github/workflows/ci.yml</span>
name: CI
on:
  pull_request:
  push:
    branches: [main]

<span class="tok-comment"># Huỷ một lượt đang chạy khi có commit mới trên cùng PR.</span>
concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
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
<pre><code>      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }      <span class="tok-comment"># cache thư viện, một dòng</span>

      - uses: actions/cache@v4                       <span class="tok-comment"># mọi thứ khác</span>
        with:
          path: |
            .next/cache
            ~/.cache/ms-playwright
          key: build-\${{ runner.os }}-\${{ hashFiles('package-lock.json') }}
          restore-keys: build-\${{ runner.os }}-</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">key</span><span class="v">Khớp chính xác → cache được khôi phục, và chỉ được lưu lại ở cuối nếu khoá là mới.</span></div>
  <div class="kv"><span class="k">restore-keys</span><span class="v">Rơi về theo tiền tố: không khớp chính xác thì lấy cái gần nhất còn mới. Biến một cache nguội thành cache ấm.</span></div>
  <div class="kv"><span class="k">Ngoài ra</span><span class="v">Chỉ chạy phần đã đổi trên monorepo (bài 10.3), và chẻ các bộ test chậm ra một ma trận.</span></div>
</div>

<h3>Bản dựng theo ma trận</h3>
<pre><code>  test:
    strategy:
      fail-fast: false          <span class="tok-comment"># đừng huỷ các job khác khi cái đầu tiên hỏng</span>
      matrix:
        node: [20, 22]
        os: [ubuntu-latest, windows-latest]
    runs-on: \${{ matrix.os }}</code></pre>
<p>Bốn job, chạy song song. <code>fail-fast: false</code> quan trọng khi bạn đang gỡ lỗi: bạn muốn biết nó hỏng trên Windows <em>VÀ</em> Node 20, chứ không chỉ biết có thứ gì đó hỏng trước.</p>

<h3>Secret và quyền</h3>
<pre><code>      - run: ./deploy.sh
        env:
          SSH_KEY: \${{ secrets.VPS_SSH_PRIVATE_KEY }}
          HOST:    \${{ secrets.VPS_HOST }}</code></pre>
<pre><code>permissions:
  contents: read            <span class="tok-comment"># mặc định ở mức tối thiểu…</span>
jobs:
  release:
    permissions:
      contents: write       <span class="tok-comment"># …và chỉ mở rộng ở nơi cần</span></code></pre>
<div class="callout danger">Secret được che trong log, và việc che là một phép khớp chuỗi — <code>echo \$SECRET | base64</code> vô hiệu hoá nó hoàn toàn. Đừng bao giờ in một secret, đừng truyền nó cho một action bên thứ ba mà bạn chưa đọc, và hãy ghim action vào một mã băm commit đầy đủ (<code>uses: actions/checkout@8f4b7f8…</code>) thay vì một tag di động khi action đó nhìn thấy được secret của bạn. Một tag bị chiếm trên một action phổ biến là một cuộc tấn công chuỗi cung ứng nhắm vào mọi người đã viết <code>@v4</code>.</div>
<div class="callout ok">Hãy ưu tiên <code>GITHUB_TOKEN</code> tự động hơn là một personal access token lưu sẵn (bài 5.2): nó được đúc cho từng lượt chạy, giới hạn trong kho đó, và hết hạn khi job kết thúc. Một PAT bị lộ là cả tài khoản của bạn.</div>

<h3>Đọc một lần hỏng</h3>
<pre><code>gh run list --limit 5
gh run view --log-failed        <span class="tok-comment"># chỉ bước bị hỏng</span>
gh run rerun 1234567 --failed   <span class="tok-comment"># chạy lại đúng những job đã hỏng</span>
gh run watch                    <span class="tok-comment"># theo dõi trực tiếp, trong terminal</span></code></pre>
<p>Và thói quen từ sổ tay vận hành của CuongThai: khi CI đỏ, hãy kiểm <em>BƯỚC NÀO</em> hỏng và xem commit của bạn có chạm vào phần cây đó không (<code>git show --stat</code>) trước khi cho rằng lỗi nằm ở diff của mình.</p>

<h3>Ba sai lầm làm CI mất đáng tin</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Kiểm tra bắt buộc có bộ lọc đường dẫn</span><span class="v">Nó không bao giờ chạy trên một PR không liên quan, nên GitHub chờ mãi mãi (bài 6.4). Hãy thêm một job đi kèm cùng tên báo thành công.</span></div>
  <div class="kv"><span class="k">Để test chớp nháy nằm lại</span><span class="v">Cứ năm lượt có một lượt đỏ là dạy cho mọi người bấm "re-run" mà không đọc. Từ đó CI thành đồ trang trí. Hãy sửa hoặc cách ly test chớp nháy ngay ngày bạn phát hiện.</span></div>
  <div class="kv"><span class="k">Một pipeline hai mươi phút</span><span class="v">Người ta thôi chờ và merge bằng niềm tin. Hãy cache, chạy song song, và đẩy bộ test chậm sang sau-merge thay vì chạy ở mỗi PR.</span></div>
</div>

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

    /* ─────────────────────────── 11.3 Quiz ─────────────────────────── */
    {
      title: '11.3 — Chapter 11 quiz|||11.3 — Kiểm tra Chương 11',
      slug: 'git-11-3-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về issue viết đúng cách, từ khoá đóng issue, bẫy PR-cũng-là-issue trong API, cấu trúc workflow, concurrency, trigger deploy, secret bị che, và pull_request_target.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on the GitHub platform. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: why deployment should not trigger on push (11.2), and what <code>pull_request_target</code> exposes on a public repository (11.2).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về nền tảng GitHub. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: vì sao triển khai không nên kích hoạt theo push (bài 11.2), và <code>pull_request_target</code> phơi ra cái gì trên một kho công khai (bài 11.2).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'What is the single most important part of a bug issue?|||Phần quan trọng nhất của một issue báo lỗi là gì?',
            options: [
              'The label|||Cái nhãn',
              'A concrete way to reproduce it — without that, nobody can act on the report|||Một cách tái hiện cụ thể — thiếu nó thì không ai hành động được với báo cáo',
              'The assignee|||Người được giao',
              'The milestone|||Milestone',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Where must "Closes #412" appear to close the issue automatically?|||"Closes #412" phải nằm ở đâu để tự động đóng issue?',
            options: [
              'Any comment on the issue|||Một bình luận bất kỳ trên issue',
              'In a commit message or the pull request description — and the commit must reach the default branch|||Trong một lời nhắn commit hoặc phần mô tả pull request — và commit đó phải tới được nhánh mặc định',
              'In the branch name|||Trong tên nhánh',
              'In the issue title|||Trong tiêu đề issue',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does listing issues via the GitHub API also return pull requests?|||Vì sao liệt kê issue qua API của GitHub lại trả về cả pull request?',
            options: [
              'A bug in the API|||Một lỗi của API',
              'Every pull request IS also an issue in GitHub\'s data model — filter with select(.pull_request == null)|||Trong mô hình dữ liệu của GitHub, mọi pull request CŨNG LÀ một issue — hãy lọc bằng select(.pull_request == null)',
              'Only when you use --paginate|||Chỉ khi bạn dùng --paginate',
              'Because they share labels|||Vì chúng dùng chung nhãn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In a GitHub Actions workflow, do jobs run in parallel or in sequence?|||Trong một workflow của GitHub Actions, các job chạy song song hay tuần tự?',
            options: [
              'Always in sequence, top to bottom|||Luôn tuần tự, từ trên xuống',
              'In parallel by default — use "needs:" to force an order|||Song song theo mặc định — dùng "needs:" để ép thứ tự',
              'In parallel only on paid plans|||Song song chỉ với gói trả phí',
              'It depends on runs-on|||Tuỳ vào runs-on',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does "concurrency: cancel-in-progress: true" achieve?|||"concurrency: cancel-in-progress: true" đạt được gì?',
            options: [
              'It runs jobs faster on bigger machines|||Nó chạy job nhanh hơn trên máy to hơn',
              'A new commit on the same branch cancels the in-flight run, so only the newest commit is tested|||Một commit mới trên cùng nhánh sẽ huỷ lượt đang chạy, nên chỉ commit mới nhất được kiểm',
              'It prevents two people pushing at once|||Nó ngăn hai người cùng push một lúc',
              'It caches dependencies between runs|||Nó cache thư viện giữa các lượt chạy',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why should a deploy workflow use workflow_dispatch rather than push?|||Vì sao một workflow deploy nên dùng workflow_dispatch thay vì push?',
            options: [
              'push triggers are deprecated|||Trigger push đã bị khai tử',
              'Deployment as a side effect of pushing means two workflows can race into an outage — cuongthai.com hit exactly that, twice|||Triển khai như tác dụng phụ của việc push nghĩa là hai workflow có thể đua nhau tới một sự cố — cuongthai.com đã dính đúng chuyện đó, hai lần',
              'workflow_dispatch is faster|||workflow_dispatch nhanh hơn',
              'push cannot access secrets|||push không truy cập được secret',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Secrets are masked in Actions logs. Is that enough to keep them safe?|||Secret được che trong log của Actions. Thế đã đủ an toàn chưa?',
            options: [
              'Yes, masking is complete|||Rồi, việc che là trọn vẹn',
              'No — masking is a string match, so any transform (echo $SECRET | base64) defeats it; never print a secret and pin third-party actions to a SHA|||Chưa — việc che là một phép khớp chuỗi, nên mọi phép biến đổi (echo $SECRET | base64) đều vô hiệu hoá nó; đừng bao giờ in secret và hãy ghim action bên thứ ba vào một SHA',
              'Yes, on private repositories|||Rồi, với kho riêng tư',
              'Only if you use GITHUB_TOKEN|||Chỉ khi dùng GITHUB_TOKEN',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is dangerous about pull_request_target on a public repository?|||pull_request_target nguy hiểm ở chỗ nào trên một kho công khai?',
            options: [
              'It is slower than pull_request|||Nó chậm hơn pull_request',
              'It runs with write permissions and access to your secrets — so checking out the PR\'s code executes a stranger\'s code with your credentials|||Nó chạy với quyền ghi và có quyền truy cập secret của bạn — nên checkout mã của PR là thực thi mã của người lạ bằng chứng chỉ của bạn',
              'It cannot be used with branch protection|||Nó không dùng được cùng bảo vệ nhánh',
              'It only works on forks|||Nó chỉ chạy trên fork',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
