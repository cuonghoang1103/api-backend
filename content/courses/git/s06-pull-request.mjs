/**
 * Git & GitHub — Chương 6: Pull request & code review.
 * Giải phẫu một PR review được · cho và nhận phản hồi · ba chiến lược merge ·
 * nhánh bảo vệ + CODEOWNERS + kiểm tra bắt buộc · PR nháp, PR xếp chồng, giữ PR nhỏ.
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Nâng cấp 09/2026: slide deck git-06 (output thật trong kho thử), 🧪/🗂/📌 mỗi bài, quiz 10 câu có giải thích.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 6 — Pull requests & code review|||Chương 6 — Pull request & code review',
  description: 'Một pull request là đơn vị công việc thật của một nhóm phần mềm. Chương này nói về thứ làm một PR review được, cách cho và nhận phản hồi mà không làm hỏng quan hệ, ba chiến lược merge và hệ quả lâu dài của chúng, các luật bảo vệ nhánh, và vì sao PR nhỏ được merge còn PR lớn thì nằm chờ.',
  lessons: [
    /* ─────────────────────────── 6.0 ─────────────────────────── */
    {
      title: '6.0 — Chapter 6 slides: the life of a pull request, in pictures|||6.0 — Slide Chương 6: vòng đời một pull request bằng hình',
      slug: 'git-6-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 17 slide của Chương 6: vòng đời PR, trang PR có gì, cho và nhận review, ba nút merge vẽ bằng đồ thị commit thật, hệ quả khi revert và dọn nhánh, nhánh bảo vệ, CODEOWNERS và kiểm tra bắt buộc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Slides</span>
<h2>The whole chapter in 17 slides</h2>
<p class="lead">A pull request is where Git stops being a tool you use alone and becomes the way a team agrees on what goes into <code>main</code>. The slides follow one pull request from branch to merge, then show what each of GitHub's three merge buttons really does to the commit graph.</p>
<p>The merge, squash and rebase graphs are not illustrations: they were produced by running the three strategies on the same branch in a throw-away repository, and every hash and terminal line is that run's real output (Git 2.51). What happens on GitHub's side — the pull request page, protection rules, CODEOWNERS — is drawn as a diagram, and every GitHub feature was checked against docs.github.com as of 09/2026. The last two slides are a cheat sheet and a 45-minute practice session.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Slide</span>
<h2>Cả chương trong 17 slide</h2>
<p class="lead">Pull request (yêu cầu kéo — đề nghị nhập nhánh của bạn vào nhánh chính) là chỗ Git thôi là công cụ bạn dùng một mình và trở thành cách cả nhóm thống nhất thứ gì được vào <code>main</code>. Bộ slide đi theo một PR từ lúc tạo nhánh tới lúc merge, rồi cho thấy ba nút merge của GitHub thật ra làm gì với đồ thị commit.</p>
<p>Ba đồ thị merge / squash / rebase không phải hình minh hoạ: chúng là kết quả chạy thật ba chiến lược trên cùng một nhánh trong một kho thử, mọi mã băm và dòng terminal là output thật của lần chạy đó (Git 2.51). Phần GitHub làm trên máy chủ — trang PR, luật bảo vệ, CODEOWNERS — được vẽ bằng sơ đồ, và mọi tính năng GitHub đều đã kiểm trên docs.github.com (tính đến 09/2026). Hai slide cuối là bảng tra nhanh và một buổi thực hành 45 phút.</p>
</div>
${gallery('git-06', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Vòng đời một pull request'], [4, 'PR nhỏ vs PR to — chẻ trước khi viết'],
  [5, 'Một trang PR có gì'], [6, 'Mô tả PR, Closes #n, gh pr create'], [7, 'Ba loại verdict và vòng review'],
  [8, 'Nhãn blocking / nit và khối suggestion'], [9, 'Nút 1: merge commit'], [10, 'Nút 2 và 3: squash và rebase'],
  [11, 'So sánh ba nút merge'], [12, 'Hệ quả: revert -m 1 và branch -d bị từ chối'], [13, 'Nhánh bảo vệ và luật nên bật'],
  [14, 'CODEOWNERS: luật khớp cuối cùng thắng'], [15, 'Kiểm tra bắt buộc, bẫy Pending, ruleset'],
  [16, 'Bảng tra nhanh'], [17, 'Thực hành chương 6'],
])}
`,
    },

    /* ─────────────────────────── 6.1 ─────────────────────────── */
    {
      title: '6.1 — Anatomy of a pull request that actually gets reviewed|||6.1 — Giải phẫu một pull request thật sự được review',
      slug: 'git-6-1-giai-phau-pr',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao PR 900 dòng nằm chờ ba ngày còn PR 80 dòng được merge trong một giờ, cấu trúc mô tả PR, mẫu PR, liên kết issue, và danh sách kiểm trước khi bấm "Create".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>A pull request is a request, not a deposit</h2>
<p class="lead">A pull request asks someone to spend their attention on your work. The size and shape of that request decides how fast it comes back. This is not a matter of politeness — it is measurable: reviewers find far fewer defects per line once a diff passes a few hundred lines, because attention does not scale.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">&lt; 100 lines</div><div class="lz-t">Reviewed properly</div><div class="lz-d">A reviewer holds the whole change in their head, and comments on logic.</div></div>
  <div class="lz-step"><div class="lz-k">100–400</div><div class="lz-t">Reviewed unevenly</div><div class="lz-d">The first files get real attention; the last ones get skimmed.</div></div>
  <div class="lz-step"><div class="lz-k">&gt; 400</div><div class="lz-t">Approved, not reviewed</div><div class="lz-d">"LGTM" arrives, defects survive, and the PR sat for three days first.</div></div>
</div>
${slide('git-06', 4, 'PR nhỏ được review thật — chẻ việc trước khi viết')}
<div class="callout ok">The single highest-leverage habit in this whole chapter: <strong>split the work before you start writing it</strong>, not after. A refactor and the feature that needed it are two pull requests. A migration and the code that uses it are two pull requests. Each one is reviewable; the combination is not.</div>

<h3>What goes in the description</h3>
${slide('git-06', 5, 'Một trang PR có gì: tiêu đề, mô tả, checks, reviewers')}
<p>The diff says <em>what</em> changed. The description exists to say everything the diff cannot:</p>
<pre><code>## What
Reject refresh tokens whose exp has passed on POST /auth/refresh.

## Why
c4a8f2e added &#96;ignoreExpiration: true&#96; so an expired token could be
exchanged for a fresh one, but the promised re-check only verified the
account and never looked at exp. A six-week-old token still minted
access tokens — sessions effectively never expired.

## How
Verify with ignoreExpiration, then compare exp against now explicitly.
Kept the flag rather than removing it, because removing it breaks the
legitimate "expired but valid" refresh path.

## Testing
- Added test/refresh-expiry.test.ts (expired token → 401)
- Existing auth suite passes
- Verified manually against staging with a token minted 40 days ago

Closes #412</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">What</span><span class="v">One or two sentences. The reviewer reads this before the diff and knows what to expect.</span></div>
  <div class="kv"><span class="k">Why</span><span class="v">The most valuable section. Symptom, cause, and what the code did before.</span></div>
  <div class="kv"><span class="k">How</span><span class="v">Only the non-obvious decisions — especially the alternative you rejected, so nobody suggests it in review.</span></div>
  <div class="kv"><span class="k">Testing</span><span class="v">What you actually ran. "Tested locally" means nothing; a named test file means something.</span></div>
</div>

<h3>Linking issues</h3>
<pre><code>Closes #412        <span class="tok-comment"># closes the issue when the PR merges</span>
Fixes #412         <span class="tok-comment"># same</span>
Resolves #412      <span class="tok-comment"># same</span>
Related to #412    <span class="tok-comment"># links without closing</span>
Closes cuonghoang1103/api-backend#412   <span class="tok-comment"># cross-repository</span></code></pre>
<p>The keyword must be in the PR <em>description</em> or a commit message, not only in a comment. Multiple issues need the keyword repeated: <code>Closes #412, closes #413</code>.</p>

<h3>A pull request template</h3>
${slide('git-06', 6, 'Mô tả PR, Closes #n và gh pr create')}
<p>Put the skeleton in the repository and GitHub pre-fills every new pull request with it:</p>
<pre><code><span class="tok-comment"># .github/pull_request_template.md</span>
## What

## Why

## How to test

## Checklist
- [ ] Tests added or updated
- [ ] No secrets, no debug output, no commented-out code
- [ ] Migration included if the schema changed
- [ ] Docs / README updated if behaviour changed</code></pre>
<div class="callout ok">A checklist in the template is not bureaucracy — it is the cheapest possible defect filter, because the author reads it while they can still fix things silently. "No secrets, no debug output" alone catches a surprising number of embarrassments.</div>

<h3>Title, and why it matters more than it looks</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ "Fixes"</span><span class="v">The reviewer must open the diff to learn anything at all.</span></div>
  <div class="kv"><span class="k">❌ "Update auth.service.ts"</span><span class="v">Names a file, not a change.</span></div>
  <div class="kv"><span class="k">✅ "fix(auth): reject expired refresh tokens on /auth/refresh"</span><span class="v">Scannable in a list of thirty open PRs, and — under a squash merge — this becomes the commit message on main forever.</span></div>
</div>

<h3>The checklist before you press Create</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Read your own diff</span><span class="lz-v">On GitHub's "Files changed" tab, as a stranger would. You will find a debug line, a stray import or a typo. This is the highest-value five minutes in the process.</span></div>
  <div class="lz-layer"><span class="lz-k">Is it one idea?</span><span class="lz-v">If the description needs "and also", split it.</span></div>
  <div class="lz-layer"><span class="lz-k">Do the tests pass locally?</span><span class="lz-v">Not "CI will tell me". CI takes four minutes and costs a reviewer's context switch.</span></div>
  <div class="lz-layer"><span class="lz-k">Is the branch up to date?</span><span class="lz-v"><code>git fetch &amp;&amp; git rebase origin/main</code> — a PR with conflicts is not reviewable.</span></div>
  <div class="lz-layer"><span class="lz-k">Is the history clean?</span><span class="lz-v"><code>git rebase -i --autosquash origin/main</code> (3.5) if the branch is full of "wip".</span></div>
</div>

<h3>Draft pull requests</h3>
${slide('git-06', 3, 'Vòng đời một pull request')}
<pre><code><span class="tok-comment"># Open as a draft to get CI running and share direction early:</span>
gh pr create --draft --title <span class="tok-string">"fix(auth): reject expired refresh tokens"</span> --body-file .github/pr.md</code></pre>
<p>A draft cannot be merged and does not request review, but CI runs and colleagues can comment. It is the honest way to say "this is the direction, tell me now if it is wrong" without consuming a reviewer's full attention on unfinished code.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In <code>thu-git</code> (the repository you pushed to GitHub in Chapter 5), create <code>.github/pull_request_template.md</code> with four headings — What, Why, How to test, Checklist — commit it on <code>main</code> and push. Every pull request you open from now on starts from that skeleton.</li><li>Create an issue to fix, as a teammate would report it: <code>gh issue create --title "About page is missing the team name" --body "Seen on the SWP391 demo."</code> (or the green New issue button). Note its number — say <code>#3</code>.</li><li><code>git switch -c fix/about-team-name</code>, make one small change, commit with a Conventional Commits message. Before pushing, measure the pull request the way a reviewer will see it: <code>git diff --stat main...HEAD</code> and <code>git log --oneline main..HEAD</code>.</li><li><code>git push -u origin fix/about-team-name</code>, then <code>gh pr create --draft --title "fix(about): show the team name"</code>. Fill in What / Why / How to test, and put <code>Closes #3</code> in the <em>description</em>. Open the Files changed tab and read your own diff as a stranger; only then run <code>gh pr ready</code>.</li></ol>
<pre><code class="language-bash">git diff --stat main...HEAD
 src/refresh.ts | 1 +
 1 file changed, 1 insertion(+)
git log --oneline main..HEAD
a3e4a62 fix: sửa theo review — dùng helper chung
e4b1e45 wip
720885d feat(auth): xoay vòng refresh token   <span class="tok-comment"># real output from the author's test repo (branch feature/refresh-token) — yours will differ</span></code></pre>
<p><strong>Done when:</strong> the pull request has a <code>type(scope): …</code> title, a description with all template sections filled, the issue appears under "Development" in the right sidebar, and <code>git diff --stat main...HEAD</code> shows well under 100 changed lines.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pull request (PR)</span><span class="v">A request to merge one branch into another, with a page for discussion, CI results and review. GitLab calls the same thing a merge request.</span></div>
  <div class="kv"><span class="k">Base / compare (head) branch</span><span class="v">The branch you merge <em>into</em> (usually <code>main</code>) and the branch that carries your changes.</span></div>
  <div class="kv"><span class="k">Draft pull request</span><span class="v">A PR that cannot be merged and does not ask code owners for review yet; CI still runs.</span></div>
  <div class="kv"><span class="k">Closing keyword</span><span class="v"><code>Closes</code> / <code>Fixes</code> / <code>Resolves #n</code> in the description or a commit message: merging the PR closes issue #n.</span></div>
  <div class="kv"><span class="k">PR template</span><span class="v"><code>.github/pull_request_template.md</code> — GitHub pre-fills every new PR description with it.</span></div>
  <div class="kv"><span class="k">Three-dot diff</span><span class="v"><code>git diff main...HEAD</code> — only what your branch changed since it left <code>main</code>, which is exactly what the PR shows.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A pull request asks for someone's attention; its size decides whether it gets a real review or a rubber-stamp "LGTM".</li><li>Split the work before writing it: a migration, a refactor and the feature that uses them are three pull requests.</li><li>The description carries what the diff cannot: why the change exists and what you actually ran to test it.</li><li><code>Closes #n</code> only works in the description or a commit message, and it closes the issue when the PR merges.</li><li>Read your own diff on the Files changed tab before asking anyone else to; open as a draft when you only want direction.</li></ul>

<a class="link-card" href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Creating a pull request</span><span class="lc-sub">Templates, drafts, linked issues, and the compare view.</span></span>
</a>
<a class="link-card" href="https://google.github.io/eng-practices/review/developer/" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">Google — The Change Author's Guide to code review</span><span class="lc-sub">Small changes, good descriptions, and handling reviewer pushback.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> the "while I was in there" pull request. You went in to fix one bug, noticed three ugly things, and fixed those too. The diff is now 600 lines, the reviewer cannot tell which parts are the actual fix, and a rollback would undo four unrelated things at once. Note the ugly things, finish the fix, open the cleanup separately. The second PR usually takes ten minutes and gets approved instantly.</div>
<p class="note-ct"><strong>How to think about it:</strong> the reviewer's time is the scarce resource, not yours. Ten minutes of your time writing a clear description and splitting a diff routinely saves an hour of theirs — and comes back to you as a same-day merge instead of a three-day wait.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Pull request là một LỜI ĐỀ NGHỊ, không phải một lần nộp bài</h2>
<p class="lead">Một pull request đề nghị ai đó bỏ sự chú ý của họ ra cho công việc của bạn. Kích cỡ và hình dạng của lời đề nghị đó quyết định nó quay lại nhanh tới đâu. Đây không phải chuyện lịch sự — nó đo được: người review tìm ra ít khiếm khuyết trên mỗi dòng hơn hẳn khi một diff vượt qua vài trăm dòng, vì sự chú ý không nhân lên theo quy mô.</p>

<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">&lt; 100 dòng</div><div class="lz-t">Được review đàng hoàng</div><div class="lz-d">Người review giữ được cả thay đổi trong đầu, và bình luận vào logic.</div></div>
  <div class="lz-step"><div class="lz-k">100–400</div><div class="lz-t">Review không đều</div><div class="lz-d">Vài file đầu được chú ý thật; những file cuối chỉ được lướt qua.</div></div>
  <div class="lz-step"><div class="lz-k">&gt; 400</div><div class="lz-t">Được duyệt, không được review</div><div class="lz-d">"LGTM" tới nơi, khiếm khuyết sống sót, và PR đã nằm chờ ba ngày trước đó.</div></div>
</div>
${slide('git-06', 4, 'PR nhỏ được review thật — chẻ việc trước khi viết')}
<div class="callout ok">Thói quen có đòn bẩy lớn nhất cả chương này: <strong>chẻ công việc TRƯỚC khi bắt đầu viết</strong>, không phải sau. Một lần refactor và cái tính năng cần nó là hai pull request. Một migration và phần mã dùng nó là hai pull request. Mỗi cái review được; cái ghép lại thì không.</div>

<h3>Trong phần mô tả có gì</h3>
${slide('git-06', 5, 'Một trang PR có gì: tiêu đề, mô tả, checks, reviewers')}
<p>Bản diff nói <em>cái gì</em> đã đổi. Phần mô tả tồn tại để nói mọi thứ diff không nói được:</p>
<pre><code>## Cái gì
Từ chối refresh token đã quá exp ở POST /auth/refresh.

## Vì sao
c4a8f2e thêm &#96;ignoreExpiration: true&#96; để một token hết hạn đổi được
token mới, nhưng bước kiểm lại được hứa hẹn chỉ xác minh tài khoản và
chưa bao giờ nhìn tới exp. Một token sáu tuần tuổi vẫn đúc ra access
token — phiên đăng nhập trên thực tế không bao giờ hết hạn.

## Làm thế nào
Xác minh với ignoreExpiration, rồi so exp với hiện tại một cách tường
minh. Giữ cái cờ thay vì gỡ nó, vì gỡ đi sẽ làm hỏng đường refresh hợp
lệ của trạng thái "hết hạn nhưng hợp lệ".

## Kiểm thử
- Thêm test/refresh-expiry.test.ts (token hết hạn → 401)
- Bộ test auth hiện có vẫn xanh
- Kiểm tay trên staging với một token đúc từ 40 ngày trước

Closes #412</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Cái gì</span><span class="v">Một hai câu. Người review đọc phần này trước bản diff và biết mình sắp thấy gì.</span></div>
  <div class="kv"><span class="k">Vì sao</span><span class="v">Mục giá trị nhất. Triệu chứng, nguyên nhân, và trước đó mã hành xử ra sao.</span></div>
  <div class="kv"><span class="k">Làm thế nào</span><span class="v">Chỉ những quyết định không hiển nhiên — nhất là phương án bạn đã loại, để không ai đề xuất lại nó trong review.</span></div>
  <div class="kv"><span class="k">Kiểm thử</span><span class="v">Thứ bạn thật sự đã chạy. "Đã test ở máy" chẳng nghĩa gì; một tên file test thì có nghĩa.</span></div>
</div>

<h3>Liên kết issue</h3>
<pre><code>Closes #412        <span class="tok-comment"># đóng issue khi PR được merge</span>
Fixes #412         <span class="tok-comment"># như trên</span>
Resolves #412      <span class="tok-comment"># như trên</span>
Related to #412    <span class="tok-comment"># liên kết mà không đóng</span>
Closes cuonghoang1103/api-backend#412   <span class="tok-comment"># liên kho</span></code></pre>
<p>Từ khoá phải nằm trong <em>phần mô tả</em> PR hoặc trong một lời nhắn commit, không chỉ trong một bình luận. Nhiều issue thì phải lặp lại từ khoá: <code>Closes #412, closes #413</code>.</p>

<h3>Một mẫu pull request</h3>
${slide('git-06', 6, 'Mô tả PR, Closes #n và gh pr create')}
<p>Đặt bộ khung vào kho mã và GitHub sẽ điền sẵn nó vào mọi pull request mới:</p>
<pre><code><span class="tok-comment"># .github/pull_request_template.md</span>
## Cái gì

## Vì sao

## Kiểm thử thế nào

## Danh sách kiểm
- [ ] Đã thêm hoặc cập nhật test
- [ ] Không có bí mật, không có output debug, không có mã bị comment lại
- [ ] Có migration kèm theo nếu schema đổi
- [ ] Đã cập nhật tài liệu / README nếu hành vi đổi</code></pre>
<div class="callout ok">Một danh sách kiểm trong mẫu không phải thủ tục hành chính — nó là bộ lọc khiếm khuyết rẻ nhất có thể, vì chính tác giả đọc nó vào lúc còn sửa được trong im lặng. Riêng dòng "không có bí mật, không có output debug" đã bắt được một lượng đáng ngạc nhiên những pha ngượng ngùng.</div>

<h3>Tiêu đề, và vì sao nó quan trọng hơn vẻ ngoài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ "Sửa lỗi"</span><span class="v">Người review buộc phải mở diff mới biết được điều gì đó.</span></div>
  <div class="kv"><span class="k">❌ "Cập nhật auth.service.ts"</span><span class="v">Gọi tên một file, không gọi tên một thay đổi.</span></div>
  <div class="kv"><span class="k">✅ "fix(auth): từ chối refresh token hết hạn ở /auth/refresh"</span><span class="v">Lướt mắt thấy ngay trong danh sách ba mươi PR đang mở, và — dưới chế độ squash merge — nó trở thành lời nhắn commit trên main mãi mãi.</span></div>
</div>

<h3>Danh sách kiểm trước khi bấm Create</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Tự đọc diff của mình</span><span class="lz-v">Trên tab "Files changed" của GitHub, như một người lạ. Bạn sẽ tìm ra một dòng debug, một import lạc, hay một lỗi chính tả. Đây là năm phút giá trị nhất của cả quy trình.</span></div>
  <div class="lz-layer"><span class="lz-k">Nó có phải một ý không?</span><span class="lz-v">Nếu phần mô tả cần chữ "và còn", hãy chẻ nó ra.</span></div>
  <div class="lz-layer"><span class="lz-k">Test ở máy có xanh không?</span><span class="lz-v">Không phải "CI sẽ báo tôi". CI tốn bốn phút và tốn một lần chuyển ngữ cảnh của người review.</span></div>
  <div class="lz-layer"><span class="lz-k">Nhánh đã cập nhật chưa?</span><span class="lz-v"><code>git fetch &amp;&amp; git rebase origin/main</code> — một PR đang xung đột thì không review được.</span></div>
  <div class="lz-layer"><span class="lz-k">Lịch sử có sạch không?</span><span class="lz-v"><code>git rebase -i --autosquash origin/main</code> (bài 3.5) nếu nhánh đầy commit "wip".</span></div>
</div>

<h3>Pull request nháp</h3>
${slide('git-06', 3, 'Vòng đời một pull request')}
<pre><code><span class="tok-comment"># Mở ở dạng nháp để CI chạy và chia sẻ hướng đi sớm:</span>
gh pr create --draft --title <span class="tok-string">"fix(auth): tu choi refresh token het han"</span> --body-file .github/pr.md</code></pre>
<p>Một bản nháp không merge được và không yêu cầu review, nhưng CI vẫn chạy và đồng nghiệp vẫn bình luận được. Đó là cách trung thực để nói "đây là hướng đi, hãy nói ngay nếu nó sai" mà không ngốn trọn sự chú ý của người review cho phần mã chưa xong.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong <code>thu-git</code> (kho bạn đã đẩy lên GitHub ở Chương 5), tạo <code>.github/pull_request_template.md</code> với bốn tiêu đề — Cái gì, Vì sao, Kiểm thử thế nào, Danh sách kiểm — commit trên <code>main</code> rồi push. Từ giờ mọi pull request bạn mở đều bắt đầu từ bộ khung đó.</li><li>Tạo một issue cần sửa, đúng như một bạn cùng nhóm sẽ báo: <code>gh issue create --title "Trang giới thiệu thiếu tên nhóm" --body "Thấy trên bản demo SWP391."</code> (hoặc nút xanh New issue). Ghi lại số của nó — giả sử <code>#3</code>.</li><li><code>git switch -c fix/about-team-name</code>, sửa một chỗ nhỏ, commit với lời nhắn kiểu Conventional Commits. Trước khi push, đo pull request theo đúng cách người review sẽ thấy: <code>git diff --stat main...HEAD</code> và <code>git log --oneline main..HEAD</code>.</li><li><code>git push -u origin fix/about-team-name</code>, rồi <code>gh pr create --draft --title "fix(about): hiện tên nhóm"</code>. Điền Cái gì / Vì sao / Kiểm thử, và đặt <code>Closes #3</code> vào <em>phần mô tả</em>. Mở tab Files changed, đọc diff của chính mình như một người lạ; xong mới chạy <code>gh pr ready</code>.</li></ol>
<pre><code class="language-bash">git diff --stat main...HEAD
 src/refresh.ts | 1 +
 1 file changed, 1 insertion(+)
git log --oneline main..HEAD
a3e4a62 fix: sửa theo review — dùng helper chung
e4b1e45 wip
720885d feat(auth): xoay vòng refresh token   <span class="tok-comment"># output thật trong kho thử của tác giả (nhánh feature/refresh-token) — của bạn sẽ khác</span></code></pre>
<p><strong>Đạt khi:</strong> pull request có tiêu đề dạng <code>type(scope): …</code>, phần mô tả điền đủ các mục của mẫu, issue hiện ở mục "Development" bên thanh phải, và <code>git diff --stat main...HEAD</code> cho thấy ít hơn hẳn 100 dòng thay đổi.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Pull request (PR)</span><span class="v">Yêu cầu kéo — đề nghị nhập một nhánh vào nhánh khác, kèm một trang để thảo luận, xem CI và review. GitLab gọi đúng thứ này là merge request.</span></div>
  <div class="kv"><span class="k">Base / compare (head) branch</span><span class="v">Nhánh đích / nhánh nguồn — nhánh được nhập <em>vào</em> (thường là <code>main</code>) và nhánh mang thay đổi của bạn.</span></div>
  <div class="kv"><span class="k">Draft pull request</span><span class="v">PR nháp — chưa merge được và chưa mời code owner review; CI vẫn chạy.</span></div>
  <div class="kv"><span class="k">Closing keyword</span><span class="v">Từ khoá đóng issue — <code>Closes</code> / <code>Fixes</code> / <code>Resolves #n</code> trong mô tả hoặc lời nhắn commit: merge PR là issue #n tự đóng.</span></div>
  <div class="kv"><span class="k">PR template</span><span class="v">Mẫu pull request — file <code>.github/pull_request_template.md</code>, GitHub điền sẵn nó vào mô tả mọi PR mới.</span></div>
  <div class="kv"><span class="k">Three-dot diff</span><span class="v">Diff ba chấm — <code>git diff main...HEAD</code> chỉ lấy phần nhánh bạn đã đổi kể từ lúc rẽ khỏi <code>main</code>, đúng thứ trang PR hiển thị.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Pull request là lời xin sự chú ý của người khác; kích cỡ của nó quyết định nó được review thật hay chỉ nhận một chữ "LGTM".</li><li>Chẻ việc trước khi viết: một migration, một lần refactor và tính năng dùng chúng là ba pull request.</li><li>Phần mô tả chở thứ diff không chở được: vì sao có thay đổi này và bạn đã thật sự chạy gì để kiểm.</li><li><code>Closes #n</code> chỉ có tác dụng trong mô tả hoặc lời nhắn commit, và nó đóng issue lúc PR được merge.</li><li>Tự đọc diff của mình ở tab Files changed trước khi nhờ người khác; mở dạng nháp khi bạn chỉ cần góp ý hướng đi.</li></ul>

<a class="link-card" href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Tạo một pull request</span><span class="lc-sub">Mẫu, bản nháp, issue liên kết, và giao diện so sánh.</span></span>
</a>
<a class="link-card" href="https://google.github.io/eng-practices/review/developer/" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">Google — Hướng dẫn cho tác giả thay đổi trong code review</span><span class="lc-sub">Thay đổi nhỏ, mô tả tốt, và cách xử lý khi người review phản đối.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> pull request kiểu "nhân tiện đang ở đó". Bạn vào sửa một lỗi, thấy ba chỗ xấu xí, và sửa luôn cả ba. Diff giờ dài 600 dòng, người review không phân biệt được phần nào mới là bản vá thật, và một lần rollback sẽ huỷ bốn thứ không liên quan cùng lúc. Hãy ghi lại mấy chỗ xấu xí, làm xong bản vá, rồi mở phần dọn dẹp riêng. PR thứ hai thường tốn mười phút và được duyệt ngay lập tức.</div>
<p class="note-ct"><strong>Cách nghĩ về chuyện này:</strong> thời gian của người review mới là tài nguyên khan hiếm, không phải của bạn. Mười phút của bạn để viết một mô tả rõ ràng và chẻ một bản diff đều đặn tiết kiệm một giờ của họ — và quay về với bạn dưới dạng một lần merge trong ngày thay vì ba ngày nằm chờ.</p>
</div>
`,
    },

    /* ─────────────────────────── 6.2 ─────────────────────────── */
    {
      title: '6.2 — Reviewing: giving and receiving feedback|||6.2 — Review: cho và nhận phản hồi',
      slug: 'git-6-2-review',
      type: 'LESSON',
      description: 'Cơ chế review trên GitHub (bình luận, gợi ý, ba loại verdict), thứ tự nên đọc một PR, phân tầng bình luận theo mức ràng buộc, và cách nhận phản hồi mà không tự ái.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>The part of Git that is about people</h2>
<p class="lead">Code review is where most teams either build trust or quietly destroy it. The mechanics take ten minutes to learn; the habits take longer and matter more. Both halves are here — how the buttons work, and what to actually write.</p>

<h3>The three verdicts</h3>
${slide('git-06', 7, 'Ba loại verdict và vòng review')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Comment</span><span class="lz-v">Feedback with no verdict. For questions, or when you looked at part of it and are not the decision-maker.</span></div>
  <div class="lz-layer"><span class="lz-k">Approve</span><span class="lz-v">"I am comfortable with this shipping." Nits can accompany an approval — say they are optional and let the author decide.</span></div>
  <div class="lz-layer"><span class="lz-k">Request changes</span><span class="lz-v">"Something here must change before this merges." Blocks the merge under branch protection. Reserve it for correctness, security and data loss — not for taste.</span></div>
</div>
<div class="callout warn">"Request changes" is a block, and on a protected branch it stays a block until <em>you</em> re-review. Use it when you mean it, then come back promptly — a forgotten "request changes" from someone on holiday is a classic way for work to sit dead for a week.</div>
<div class="callout ok">Two rules from GitHub's own documentation (as of 09/2026) that surprise student teams: <strong>the author of a pull request cannot approve it</strong> — only Comment is available on your own PR, so on a one-person repository "require 1 approval" means nobody but an admin bypass can ever merge. And if the reviewer who requested changes is unavailable, <strong>anyone with write access can dismiss that blocking review</strong> (with a reason that stays in the timeline) — the holiday case above has an exit, it is just a visible one.</div>

<h3>Batch your comments</h3>
<pre><code><span class="tok-comment"># On GitHub: "Start a review" instead of "Add single comment".</span>
gh pr review 431 --comment --body <span class="tok-string">"Two questions inline, otherwise this looks right."</span>
gh pr review 431 --approve
gh pr review 431 --request-changes --body <span class="tok-string">"The token comparison is off by a factor of 1000."</span></code></pre>
<p>Single comments send a notification each. Fifteen of them over twenty minutes is fifteen interruptions, and the author starts responding to comment three while you are still forming the point in comment eleven. Start a review, write everything, submit once.</p>

<h3>Suggested changes</h3>
<pre><code>&#96;&#96;&#96;suggestion
  if (payload.exp * 1000 &lt; Date.now()) {
&#96;&#96;&#96;</code></pre>
<p>A <code>suggestion</code> block renders as a diff the author can apply with one button, and it becomes a real commit. Ideal for typos, naming and one-line fixes — it removes an entire round trip. Do not use it for anything the author should think about; applying a suggestion is not the same as understanding it.</p>

<h3>The order to read a pull request in</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Description and linked issue</div><div class="lz-d">What is this trying to do? Without this you review the code against your own assumptions.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Tests</div><div class="lz-d">They tell you what the author believes the behaviour is — often faster than the implementation.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">The main change</div><div class="lz-d">Now read the implementation, knowing the intent.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Everything else</div><div class="lz-d">Config, migrations, generated files. Skim, but do not skip — this is where secrets hide.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Run it, if it matters</div><div class="lz-d"><code>gh pr checkout 431</code>. For anything risky, reading is not enough.</div></div>
</div>

<h3>What to look for, in priority order</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Correctness</span><span class="v">Does it do what it claims? Off-by-one, null, the empty-list case, the error path nobody tested.</span></div>
  <div class="kv"><span class="k">Security</span><span class="v">Unvalidated input, a missing authorisation check, a secret, a query built by string concatenation.</span></div>
  <div class="kv"><span class="k">Data</span><span class="v">Migrations that cannot be rolled back, a destructive update with no <code>WHERE</code>, an index missing on a new foreign key.</span></div>
  <div class="kv"><span class="k">Design</span><span class="v">Does it fit the codebase? Is there an existing helper being duplicated?</span></div>
  <div class="kv"><span class="k">Readability</span><span class="v">Will someone understand this in a year? Names, and comments where the <em>why</em> is not obvious.</span></div>
  <div class="kv"><span class="k">Style</span><span class="v">Last, and ideally not by a human — a formatter and a linter should have settled it before review (Chapter 12).</span></div>
</div>

<h3>Label the weight of each comment</h3>
${slide('git-06', 8, 'Nhãn blocking / nit và khối suggestion')}
<p>The most common review failure is not harshness — it is <em>ambiguity</em>. The author cannot tell which comments block the merge. A one-word prefix fixes it:</p>
<pre><code>blocking: this returns 200 on a failed payment — the client will
          mark the order paid. Needs to be a 402.

question: is &#96;retries = 3&#96; here deliberate? The rest of the codebase
          uses the RETRY_LIMIT constant.

nit: &#96;usr&#96; → &#96;user&#96; for consistency with the file above. Optional.

praise: nice — the table-driven test makes the edge cases obvious.</code></pre>
<div class="callout ok"><code>nit:</code> is the single most useful convention in code review. It lets a reviewer mention small things without those things blocking anything, and it lets the author skip them with a clear conscience. Without it, every comment reads as a demand.</div>

<h3>How to phrase it</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ "This is wrong."</span><span class="v">A verdict with no information. The author has to guess what you saw.</span></div>
  <div class="kv"><span class="k">✅ "This returns 200 when the payment fails — the client treats that as success. Should it be 402?"</span><span class="v">Names the behaviour, the consequence, and proposes a direction.</span></div>
  <div class="kv"><span class="k">❌ "Why didn't you use a map?"</span><span class="v">Rhetorical, and reads as an accusation even when it is not meant that way.</span></div>
  <div class="kv"><span class="k">✅ "A Map would avoid the O(n²) lookup here. Was there a reason to keep the array?"</span><span class="v">States the concern and leaves room for an answer you have not thought of.</span></div>
  <div class="kv"><span class="k">Review the code</span><span class="v">"This function does X" rather than "you did X". Small change, and it keeps the discussion on the diff.</span></div>
</div>

<h3>Receiving review</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Assume good faith</span><span class="lz-v">Written comments lose all tone. "Why is this here?" is almost always a real question, not an attack.</span></div>
  <div class="lz-layer"><span class="lz-k">Answer, do not just comply</span><span class="lz-v">If you disagree, say why. A reviewer who is missing context wants to know that. Silent compliance produces worse code and resentment.</span></div>
  <div class="lz-layer"><span class="lz-k">Push fixes as new commits</span><span class="lz-v">The reviewer can then see just what changed since their review. Squash at merge time (6.3), not during review.</span></div>
  <div class="lz-layer"><span class="lz-k">Resolve threads you addressed</span><span class="lz-v">"Fixed in a7c2f91" plus resolving the conversation shows progress without a second full read.</span></div>
  <div class="lz-layer"><span class="lz-k">Move deadlocks off the thread</span><span class="lz-v">Three rounds on the same point means the medium is wrong. Talk for five minutes, then post the conclusion in the thread.</span></div>
</div>

<h3>Useful gh commands</h3>
<pre><code>gh pr list                       <span class="tok-comment"># open PRs in this repository</span>
gh pr status                     <span class="tok-comment"># yours, and ones awaiting your review</span>
gh pr checkout 431               <span class="tok-comment"># check out a PR branch locally</span>
gh pr diff 431                   <span class="tok-comment"># read the diff in the terminal</span>
gh pr view 431 --comments        <span class="tok-comment"># description + every comment</span></code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Pair with one teammate from your project group and swap pull requests (the one from 6.1 works). Alone? Review your own PR — GitHub will only offer Comment, which is fine for steps 2–3.</li><li>As reviewer: <code>gh pr checkout &lt;number&gt;</code> and actually run it, then read in the lesson's order — description, tests, main change, everything else.</li><li>On Files changed click <strong>Start a review</strong> (not "Add single comment") and leave three comments: one <code>blocking:</code> or <code>question:</code>, one <code>nit:</code>, and one <code>suggestion</code> block for a one-line fix. Submit once, choosing the verdict that matches the heaviest label.</li><li>As author: press <strong>Commit suggestion</strong> on the suggestion, fix the rest in a new commit, reply "Fixed in &lt;hash&gt;" and resolve each conversation. The reviewer then looks only at the changes since their review and finishes with <code>gh pr review &lt;number&gt; --approve</code>.</li></ol>
<p><strong>Done when:</strong> the PR timeline shows one submitted review containing three comments (not three separate ones), a commit created from the suggestion that lists the reviewer as co-author, every conversation resolved, and a final Approve from someone other than the author (working alone: everything except the Approve).</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Review verdict</span><span class="v">The outcome you submit with a review: Comment, Approve or Request changes.</span></div>
  <div class="kv"><span class="k">Request changes</span><span class="v">A blocking review; under branch protection it holds the merge until that reviewer approves or the review is dismissed.</span></div>
  <div class="kv"><span class="k">Suggested change</span><span class="v">A <code>suggestion</code> block in a review comment; the author applies it with one button and it becomes a commit.</span></div>
  <div class="kv"><span class="k">nit</span><span class="v">Short for nitpick: a small, optional remark that must not block the merge.</span></div>
  <div class="kv"><span class="k">Resolve conversation</span><span class="v">Mark a review thread as dealt with; branch protection can require all of them resolved before merging.</span></div>
  <div class="kv"><span class="k">LGTM</span><span class="v">"Looks good to me" — an approval, honest only if the reviewer actually read the change.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Comment asks, Approve says "safe to ship", Request changes blocks — keep the last one for correctness, security and data.</li><li>Batch your comments into one review; fifteen single comments are fifteen interruptions.</li><li>Label every comment's weight (<code>blocking:</code>, <code>question:</code>, <code>nit:</code>) so the author knows what must change.</li><li>Review the code, not the person: name the behaviour, the consequence, and a direction.</li><li>As author, answer instead of silently complying, push fixes as new commits, and resolve the threads you handled.</li></ul>

<a class="link-card" href="https://google.github.io/eng-practices/review/reviewer/" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">Google — How to do a code review</span><span class="lc-sub">The standard reference: what to look for, speed, and handling pushback.</span></span>
</a>
<a class="link-card" href="https://conventionalcomments.org/" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">Conventional Comments — labelling the weight of feedback</span><span class="lc-sub">The <code>nit:</code> / <code>question:</code> / <code>blocking:</code> convention, specified.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> the reviewer who only ever comments on style. Twelve remarks about naming and spacing on a pull request with a race condition in it is worse than no review at all — it consumes the author's goodwill, spends the review budget, and lets the real defect through with an approval attached. Put a formatter and a linter in CI (Chapter 12), then spend human attention on correctness.</div>
<p class="note-ct"><strong>The norm worth arguing for:</strong> review within one working day. A pull request that waits three days is a branch drifting from main, a colleague blocked, and a context the author has already forgotten. Fast, slightly shallower reviews beat slow, thorough ones — because the alternative to a fast review is usually no review, just an approval.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Phần của Git nói về con người</h2>
<p class="lead">Code review là nơi phần lớn các nhóm hoặc dựng lên niềm tin, hoặc âm thầm phá nát nó. Phần cơ chế học mất mười phút; phần thói quen lâu hơn và quan trọng hơn. Cả hai nửa đều nằm ở đây — các nút bấm hoạt động ra sao, và thật ra nên viết gì.</p>

<h3>Ba loại verdict</h3>
${slide('git-06', 7, 'Ba loại verdict và vòng review')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Comment</span><span class="lz-v">Phản hồi không kèm phán quyết. Dành cho câu hỏi, hoặc khi bạn chỉ xem một phần và không phải người quyết định.</span></div>
  <div class="lz-layer"><span class="lz-k">Approve</span><span class="lz-v">"Tôi thấy yên tâm khi cái này lên production." Vẫn kèm được các nhận xét vặt — hãy nói rõ là tuỳ chọn và để tác giả quyết.</span></div>
  <div class="lz-layer"><span class="lz-k">Request changes</span><span class="lz-v">"Có thứ ở đây PHẢI đổi trước khi merge." Chặn việc merge dưới luật bảo vệ nhánh. Hãy dành nó cho tính đúng đắn, bảo mật và mất dữ liệu — không dành cho gu thẩm mỹ.</span></div>
</div>
<div class="callout warn">"Request changes" là một cái chốt chặn, và trên nhánh được bảo vệ nó chặn cho tới khi <em>chính bạn</em> review lại. Hãy dùng khi bạn thật sự có ý đó, rồi quay lại sớm — một cái "request changes" bị quên của người đang đi nghỉ là cách kinh điển để một phần việc nằm chết cả tuần.</div>
<div class="callout ok">Hai luật trong chính tài liệu của GitHub (tính đến 09/2026) hay làm nhóm sinh viên bất ngờ: <strong>tác giả không tự duyệt được pull request của mình</strong> — trên PR của bạn chỉ có Comment, nên với kho một người thì "bắt buộc 1 lượt duyệt" nghĩa là không ai merge được, trừ khi admin dùng quyền vượt luật (bypass). Và nếu người đã request changes không có mặt, <strong>bất kỳ ai có quyền ghi (write) đều có thể gạt bỏ (dismiss) lượt review chặn đó</strong> — kèm một lý do nằm lại trong dòng thời gian của PR. Ca "đi nghỉ" ở trên có lối ra, chỉ là một lối ra ai cũng thấy.</div>

<h3>Hãy gom các bình luận lại</h3>
<pre><code><span class="tok-comment"># Trên GitHub: bấm "Start a review" thay vì "Add single comment".</span>
gh pr review 431 --comment --body <span class="tok-string">"Hai cau hoi o trong, con lai thi nhin dung."</span>
gh pr review 431 --approve
gh pr review 431 --request-changes --body <span class="tok-string">"Phep so token lech mot he so 1000."</span></code></pre>
<p>Bình luận lẻ mỗi cái gửi một thông báo. Mười lăm cái trong hai mươi phút là mười lăm lần cắt ngang, và tác giả bắt đầu trả lời bình luận số ba trong khi bạn còn đang hình thành ý ở bình luận số mười một. Hãy bắt đầu một lượt review, viết hết, gửi một lần.</p>

<h3>Gợi ý thay đổi</h3>
<pre><code>&#96;&#96;&#96;suggestion
  if (payload.exp * 1000 &lt; Date.now()) {
&#96;&#96;&#96;</code></pre>
<p>Một khối <code>suggestion</code> hiện ra như một bản diff mà tác giả áp được bằng một nút, và nó trở thành một commit thật. Lý tưởng cho lỗi chính tả, đặt tên và các bản vá một dòng — nó bỏ hẳn một vòng đi lại. Đừng dùng nó cho thứ mà tác giả cần suy nghĩ; áp một gợi ý không giống với hiểu nó.</p>

<h3>Thứ tự nên đọc một pull request</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Mô tả và issue liên kết</div><div class="lz-d">Cái này đang cố làm gì? Không có phần này thì bạn review mã dựa trên giả định của chính mình.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Các test</div><div class="lz-d">Chúng cho bạn biết tác giả tin hành vi là gì — thường nhanh hơn đọc phần cài đặt.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Thay đổi chính</div><div class="lz-d">Giờ mới đọc phần cài đặt, khi đã biết ý định.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Mọi thứ còn lại</div><div class="lz-d">Cấu hình, migration, file sinh tự động. Lướt, nhưng đừng bỏ qua — đây là chỗ bí mật hay nấp.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Chạy thử, nếu nó quan trọng</div><div class="lz-d"><code>gh pr checkout 431</code>. Với thứ gì rủi ro, đọc là không đủ.</div></div>
</div>

<h3>Nhìn vào cái gì, theo thứ tự ưu tiên</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Tính đúng đắn</span><span class="v">Nó có làm đúng thứ nó tuyên bố không? Lệch một đơn vị, giá trị null, trường hợp danh sách rỗng, đường lỗi không ai test.</span></div>
  <div class="kv"><span class="k">Bảo mật</span><span class="v">Đầu vào không kiểm, thiếu một phép kiểm phân quyền, một bí mật, một truy vấn dựng bằng nối chuỗi.</span></div>
  <div class="kv"><span class="k">Dữ liệu</span><span class="v">Migration không lùi lại được, một lệnh cập nhật phá huỷ mà thiếu <code>WHERE</code>, một khoá ngoại mới mà thiếu chỉ mục.</span></div>
  <div class="kv"><span class="k">Thiết kế</span><span class="v">Nó có hợp với kho mã không? Có helper sẵn nào đang bị viết lặp lại không?</span></div>
  <div class="kv"><span class="k">Dễ đọc</span><span class="v">Một năm nữa có ai hiểu được cái này không? Tên gọi, và chú thích ở những chỗ <em>vì sao</em> không hiển nhiên.</span></div>
  <div class="kv"><span class="k">Kiểu cách</span><span class="v">Cuối cùng, và lý tưởng là không do con người làm — một formatter và một linter lẽ ra đã dàn xếp xong trước khi review (Chương 12).</span></div>
</div>

<h3>Gắn nhãn sức nặng cho mỗi bình luận</h3>
${slide('git-06', 8, 'Nhãn blocking / nit và khối suggestion')}
<p>Thất bại phổ biến nhất của review không phải là gay gắt — mà là <em>mập mờ</em>. Tác giả không phân biệt được bình luận nào chặn việc merge. Một tiền tố một chữ giải quyết xong:</p>
<pre><code>blocking: chỗ này trả 200 cho một lần thanh toán thất bại — client sẽ
          đánh dấu đơn là đã trả. Phải là 402.

question: &#96;retries = 3&#96; ở đây là cố ý à? Phần còn lại của kho mã dùng
          hằng RETRY_LIMIT.

nit: &#96;usr&#96; → &#96;user&#96; cho đồng bộ với file phía trên. Tuỳ chọn thôi.

praise: hay đấy — cái test dạng bảng làm các ca biên hiện ra rất rõ.</code></pre>
<div class="callout ok"><code>nit:</code> là quy ước hữu ích nhất trong code review. Nó cho phép người review nhắc những chuyện nhỏ mà không để chúng chặn thứ gì, và cho phép tác giả bỏ qua chúng với lương tâm thanh thản. Không có nó, mọi bình luận đều đọc lên như một yêu sách.</div>

<h3>Diễn đạt thế nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">❌ "Cái này sai."</span><span class="v">Một phán quyết không kèm thông tin. Tác giả phải đoán bạn đã thấy gì.</span></div>
  <div class="kv"><span class="k">✅ "Chỗ này trả 200 khi thanh toán thất bại — client coi đó là thành công. Có nên là 402 không?"</span><span class="v">Gọi tên hành vi, hệ quả, và đề xuất một hướng.</span></div>
  <div class="kv"><span class="k">❌ "Sao không dùng map?"</span><span class="v">Câu hỏi tu từ, và đọc lên như một lời buộc tội kể cả khi không có ý đó.</span></div>
  <div class="kv"><span class="k">✅ "Một Map sẽ tránh được phép tra O(n²) ở đây. Có lý do nào để giữ mảng không?"</span><span class="v">Nêu mối lo và chừa chỗ cho một câu trả lời bạn chưa nghĩ tới.</span></div>
  <div class="kv"><span class="k">Hãy review MÃ</span><span class="v">"Hàm này làm X" thay vì "bạn đã làm X". Đổi nhỏ, mà giữ cuộc thảo luận nằm trên bản diff.</span></div>
</div>

<h3>Nhận review</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Giả định thiện chí</span><span class="lz-v">Bình luận viết ra mất hết ngữ điệu. "Vì sao cái này ở đây?" gần như luôn là một câu hỏi thật, không phải một đòn tấn công.</span></div>
  <div class="lz-layer"><span class="lz-k">Hãy trả lời, đừng chỉ tuân theo</span><span class="lz-v">Nếu bạn không đồng ý, hãy nói vì sao. Một người review đang thiếu ngữ cảnh rất muốn biết điều đó. Tuân theo trong im lặng sinh ra mã tệ hơn và sự ấm ức.</span></div>
  <div class="lz-layer"><span class="lz-k">Đẩy bản sửa thành commit MỚI</span><span class="lz-v">Người review khi đó thấy đúng phần đã đổi kể từ lượt review của họ. Hãy gộp lúc merge (bài 6.3), không phải trong lúc review.</span></div>
  <div class="lz-layer"><span class="lz-k">Đóng những luồng bạn đã xử lý</span><span class="lz-v">"Đã sửa ở a7c2f91" cộng với việc đóng luồng cho thấy tiến độ mà không cần đọc lại toàn bộ lần hai.</span></div>
  <div class="lz-layer"><span class="lz-k">Đưa những bế tắc ra khỏi luồng bình luận</span><span class="lz-v">Ba vòng đi lại trên cùng một điểm nghĩa là sai phương tiện. Hãy nói chuyện năm phút, rồi đăng kết luận vào luồng.</span></div>
</div>

<h3>Vài lệnh gh hữu ích</h3>
<pre><code>gh pr list                       <span class="tok-comment"># các PR đang mở trong kho này</span>
gh pr status                     <span class="tok-comment"># của bạn, và những cái đang chờ bạn review</span>
gh pr checkout 431               <span class="tok-comment"># checkout nhánh của một PR về máy</span>
gh pr diff 431                   <span class="tok-comment"># đọc diff ngay trong terminal</span>
gh pr view 431 --comments        <span class="tok-comment"># mô tả + mọi bình luận</span></code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Bắt cặp với một bạn trong nhóm đồ án và đổi pull request cho nhau (PR ở bài 6.1 là được). Làm một mình? Tự review PR của mình — GitHub sẽ chỉ cho chọn Comment, vẫn đủ cho bước 2–3.</li><li>Vai người review: <code>gh pr checkout &lt;số&gt;</code> và chạy thử thật, rồi đọc theo thứ tự trong bài — mô tả, test, thay đổi chính, phần còn lại.</li><li>Ở tab Files changed, bấm <strong>Start a review</strong> (không phải "Add single comment") và để lại ba bình luận: một cái <code>blocking:</code> hoặc <code>question:</code>, một cái <code>nit:</code>, và một khối <code>suggestion</code> cho một bản sửa một dòng. Gửi một lần, chọn verdict khớp với nhãn nặng nhất.</li><li>Vai tác giả: bấm <strong>Commit suggestion</strong> ở gợi ý, sửa phần còn lại bằng một commit mới, trả lời "Đã sửa ở &lt;mã băm&gt;" rồi đóng (resolve) từng luồng. Người review khi đó chỉ xem phần đổi kể từ lượt review của mình và kết thúc bằng <code>gh pr review &lt;số&gt; --approve</code>.</li></ol>
<p><strong>Đạt khi:</strong> dòng thời gian của PR có một lượt review đã gửi chứa ba bình luận (không phải ba bình luận lẻ), một commit sinh ra từ gợi ý ghi người review là đồng tác giả (co-author), mọi luồng đã đóng, và một Approve cuối cùng từ người khác tác giả (làm một mình: đủ mọi thứ trừ Approve).</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Review verdict</span><span class="v">Phán quyết review — kết luận bạn gửi kèm lượt review: Comment, Approve hoặc Request changes.</span></div>
  <div class="kv"><span class="k">Request changes</span><span class="v">Yêu cầu sửa — lượt review chặn; dưới luật bảo vệ nhánh nó giữ nút merge tới khi chính người đó duyệt hoặc lượt review bị gạt bỏ.</span></div>
  <div class="kv"><span class="k">Suggested change</span><span class="v">Thay đổi gợi ý — khối <code>suggestion</code> trong bình luận; tác giả bấm một nút là áp và nó thành một commit.</span></div>
  <div class="kv"><span class="k">nit</span><span class="v">Viết tắt của nitpick (bắt bẻ vặt) — nhận xét nhỏ, tuỳ chọn, không được chặn merge.</span></div>
  <div class="kv"><span class="k">Resolve conversation</span><span class="v">Đóng luồng thảo luận — đánh dấu một luồng review đã xử lý xong; luật bảo vệ có thể bắt đóng hết mới cho merge.</span></div>
  <div class="kv"><span class="k">LGTM</span><span class="v">"Looks good to me" (tôi thấy ổn) — một lời duyệt, chỉ trung thực khi người review đã đọc thật.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Comment để hỏi, Approve nghĩa là "cho lên được", Request changes là chặn — để dành cái cuối cho tính đúng đắn, bảo mật và dữ liệu.</li><li>Gom bình luận thành một lượt review; mười lăm bình luận lẻ là mười lăm lần cắt ngang.</li><li>Gắn nhãn sức nặng cho từng bình luận (<code>blocking:</code>, <code>question:</code>, <code>nit:</code>) để tác giả biết cái gì bắt buộc phải đổi.</li><li>Review mã, không review người: gọi tên hành vi, hệ quả, và một hướng sửa.</li><li>Là tác giả thì trả lời thay vì im lặng làm theo, đẩy bản sửa thành commit mới, và đóng những luồng đã xử lý.</li></ul>

<a class="link-card" href="https://google.github.io/eng-practices/review/reviewer/" target="_blank" rel="noopener">
  <span class="lc-ico">📗</span>
  <span class="lc-body"><span class="lc-title">Google — Cách thực hiện một lượt code review</span><span class="lc-sub">Tài liệu tham chiếu chuẩn: nhìn vào gì, tốc độ, và xử lý phản đối.</span></span>
</a>
<a class="link-card" href="https://conventionalcomments.org/" target="_blank" rel="noopener">
  <span class="lc-ico">🏷️</span>
  <span class="lc-body"><span class="lc-title">Conventional Comments — gắn nhãn sức nặng cho phản hồi</span><span class="lc-sub">Quy ước <code>nit:</code> / <code>question:</code> / <code>blocking:</code>, được đặc tả.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> người review chỉ bình luận về kiểu cách. Mười hai nhận xét về đặt tên và khoảng trắng trên một pull request có race condition bên trong thì còn tệ hơn không review gì cả — nó ngốn thiện chí của tác giả, tiêu hết ngân sách review, và để khiếm khuyết thật lọt qua kèm một chữ approve. Hãy đặt formatter và linter vào CI (Chương 12), rồi dành sự chú ý của con người cho tính đúng đắn.</div>
<p class="note-ct"><strong>Chuẩn mực đáng tranh đấu cho:</strong> review trong vòng một ngày làm việc. Một pull request nằm chờ ba ngày là một nhánh đang trôi xa main, một đồng nghiệp bị kẹt, và một ngữ cảnh mà tác giả đã quên mất. Review nhanh và hơi nông vẫn hơn review chậm và kỹ — vì phương án thay thế của một lượt review nhanh thường không phải review kỹ, mà là không review, chỉ có một chữ approve.</p>
</div>
`,
    },

    /* ─────────────────────────── 6.3 ─────────────────────────── */
    {
      title: '6.3 — Merge strategies: merge, squash, or rebase|||6.3 — Ba chiến lược merge: merge, squash, hay rebase',
      slug: 'git-6-3-chien-luoc-merge',
      type: 'LESSON',
      description: 'Ba nút merge của GitHub tạo ra ba hình dạng lịch sử khác nhau, hệ quả lâu dài của từng cái (revert, bisect, blame), và cách chọn cho nhóm của bạn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Three buttons, three different histories</h2>
<p class="lead">GitHub offers "Create a merge commit", "Squash and merge" and "Rebase and merge". They are not cosmetic variants — each produces a different <code>main</code>, with different consequences for <code>revert</code>, <code>bisect</code> and <code>blame</code> for years afterwards.</p>

<h3>Merge commit — keep everything</h3>
${slide('git-06', 9, 'Nút 1: merge commit — đồ thị thật')}
<pre><code>git switch main &amp;&amp; git merge --no-ff feature/login</code></pre>
<div class="out">*   8c4f2a1 (main) Merge pull request #431 from feature/login
|\\
| * 1a2b3c4 fix: address review — use the shared helper
| * 9e2d4b7 wip
| * 3f8a1c9 feat(auth): add refresh token rotation
|/
* 7b3e9d1 refactor(api): extract pagination</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Keeps</span><span class="v">Every commit, the branch point, and a merge commit naming the PR.</span></div>
  <div class="kv"><span class="k">Good for</span><span class="v">An accurate record. <code>git log --first-parent</code> lists one line per feature. Reverting a whole feature is one <code>revert -m 1</code>.</span></div>
  <div class="kv"><span class="k">Costs</span><span class="v">"wip" and "fix typo" live on main forever. On a busy repository the graph becomes hard to read.</span></div>
</div>

<h3>Squash and merge — one commit per pull request</h3>
${slide('git-06', 10, 'Nút 2 và 3: squash và rebase — đồ thị thật')}
<div class="out">* 8c4f2a1 (main) fix(auth): reject expired refresh tokens (#431)
* 7b3e9d1 refactor(api): extract pagination</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Keeps</span><span class="v">The changes, as a single commit. The PR title becomes the message, the branch's individual commits do not survive on main.</span></div>
  <div class="kv"><span class="k">Good for</span><span class="v">A clean linear main where one commit = one reviewed change. <code>git bisect</code> is at its best: every commit on main passed CI as a unit.</span></div>
  <div class="kv"><span class="k">Costs</span><span class="v">Intermediate commits are gone. A 900-line PR becomes one 900-line commit, which <code>blame</code> and <code>bisect</code> cannot narrow further.</span></div>
</div>
<div class="callout warn">Squash makes the <strong>pull request title</strong> the permanent commit message on main. "Fixes" and "update stuff" become your history. If your team squashes, enforce Conventional Commits (1.4) on PR titles — a CI check for the pattern takes ten lines and pays for itself.</div>
<div class="callout ok"><strong>Precisely, as of 09/2026 (GitHub Docs):</strong> the default squash message depends on the number of commits. With <strong>two or more</strong> commits it is the pull request title plus a list of the branch's commits — the case this section describes. With <strong>only one</strong> commit, GitHub proposes that commit's own title and message instead. The repository can fix the format in Settings → General → Pull Requests → "Allow squash merging" (pull request title; title and commit details; title and description). Whatever the setting, the text is editable in the merge box — read it before you confirm.</div>

<h3>Rebase and merge — linear, every commit kept</h3>
<div class="out">* 1a2b3c4 (main) fix: address review — use the shared helper
* 9e2d4b7 wip
* 3f8a1c9 feat(auth): add refresh token rotation
* 7b3e9d1 refactor(api): extract pagination</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Keeps</span><span class="v">Every commit, replayed onto main with new hashes. No merge commit, no branch point.</span></div>
  <div class="kv"><span class="k">Good for</span><span class="v">Teams who curate their branch history before merging — each commit is meaningful and self-contained.</span></div>
  <div class="kv"><span class="k">Costs</span><span class="v">Any un-curated "wip" lands directly on main with no merge commit to group it. Individual commits on main may never have passed CI on their own.</span></div>
</div>
<div class="callout danger">That last point is the sharp edge. CI tests the <em>tip</em> of the branch. With rebase-and-merge, the intermediate commits land on main having never been tested in that position — so <code>git bisect</code> can stop at a commit that fails for reasons unrelated to the bug you are hunting.</div>
<div class="callout warn">One more difference from the <code>git rebase</code> you run locally (GitHub Docs, 09/2026): GitHub's "Rebase and merge" <strong>always</strong> creates new commit hashes and updates the committer information — even when your branch was already sitting on top of <code>main</code> and a local rebase would have changed nothing. So after a rebase-merge, the commits on <code>main</code> are never the ones on your laptop, and <code>git branch -d</code> will not recognise your branch as merged (see the lifecycle below).</div>

<h3>Choosing</h3>
${slide('git-06', 11, 'So sánh ba nút merge')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Squash — the default for most teams</span><span class="lz-v">Simple mental model: one PR, one commit, one revert. Contributors do not need to curate history. Choose this unless you have a reason not to.</span></div>
  <div class="lz-layer"><span class="lz-k">Merge commit — larger teams, long-lived branches</span><span class="lz-v">When the real history matters, when release branches exist, or when a feature is genuinely a series of related changes worth preserving.</span></div>
  <div class="lz-layer"><span class="lz-k">Rebase — disciplined teams only</span><span class="lz-v">Works well where everyone rebases and cleans their branch before review. Fragile with mixed skill levels.</span></div>
</div>
<p>Whichever you pick, <strong>pick one and turn the others off</strong> in Settings → General → Pull Requests. A repository where the three are mixed has a history that is hard to read and hard to script against.</p>

<h3>The lifecycle around the merge</h3>
${slide('git-06', 12, 'Hệ quả: revert -m 1 và branch -d bị từ chối sau squash')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">CI green + approved</div><div class="lz-d">Branch protection enforces both (6.4).</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Update the branch</div><div class="lz-d">"Update branch" on GitHub, or <code>git rebase origin/main</code> — so CI runs against what will actually be on main.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Merge</div><div class="lz-d">Your team's one strategy. Check the auto-generated message before confirming.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Delete the branch</div><div class="lz-d">GitHub offers a button; turn on automatic deletion in settings.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Clean up locally</div><div class="lz-d"><code>git switch main &amp;&amp; git pull &amp;&amp; git fetch --prune &amp;&amp; git branch -d feature/login</code></div></div>
</div>
<div class="callout warn">Step 5 as written works after a <strong>merge commit</strong>. After <strong>squash</strong> (and GitHub's rebase), <code>git branch -d</code> refuses — real output after a squash-merge whose branch GitHub had already deleted:
<div class="out">git fetch --prune
 - [deleted]         (none)     -&gt; origin/feature/refresh-token
git branch -d feature/refresh-token
error: the branch 'feature/refresh-token' is not fully merged
hint: If you are sure you want to delete it, run 'git branch -D feature/refresh-token'</div>
Git is not wrong: the commit on <code>main</code> is a brand-new one, and your branch's commits really are on no other branch. Check that the pull request shows <strong>Merged</strong> (<code>gh pr view &lt;number&gt;</code>), then delete with <code>git branch -D</code>. That capital D is normal in a squash team — and it is exactly why you check first.</div>

<h3>Auto-merge</h3>
<pre><code>gh pr merge 431 --squash --auto --delete-branch</code></pre>
<p>Queues the merge to happen the moment every required check passes and every required approval is in. Useful for a small PR approved while CI is still running — instead of coming back in six minutes, it merges itself.</p>

<h3>Merge queues, for busy repositories</h3>
<p>On a repository where several PRs merge per hour, "CI was green" can be a lie: it was green against a <code>main</code> that has since moved. A merge queue re-tests each PR against the <em>real</em> upcoming main, in order, and merges only if it still passes. It is the standard cure for "main was broken by two PRs that were each fine alone" — a semantic conflict (3.2) at the repository level.</p>
<div class="callout ok"><strong>Before you plan on one (GitHub Docs, 09/2026):</strong> merge queues are available in public repositories owned by an <em>organization</em>, and in private organization repositories on GitHub Enterprise Cloud — not in a repository under your personal account. If you do use one, CI workflows must also trigger on the <code>merge_group</code> event (<code>on: pull_request:</code> plus <code>merge_group:</code>), otherwise the required checks are never reported for the queued group and the merge fails. For a five-person course project, "require branches to be up to date" (6.4) gives most of the same safety.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In <code>thu-git</code>, from <code>main</code>: <code>git switch -c feature/three-ways</code> and make three commits on one file (say <code>cart.txt</code>) — the second one with the message <code>wip</code>. Switch back to <code>main</code> and commit a change to <code>README.md</code>, as if a teammate's PR landed meanwhile.</li><li>Make three throw-away copies of <code>main</code>: <code>git branch try-merge; git branch try-squash; git branch try-rebase</code>. Each will play "main after pressing one button".</li><li>Press the three buttons by hand: on <code>try-merge</code> run <code>git merge --no-ff feature/three-ways -m "Merge pull request #7 from feature/three-ways"</code>; on <code>try-squash</code> run <code>git merge --squash feature/three-ways</code> then <code>git commit -m "feat(cart): thêm giỏ hàng (#7)"</code>; for rebase, <code>git switch -c tmp-rebase feature/three-ways</code>, <code>git rebase try-rebase</code>, <code>git switch try-rebase</code>, <code>git merge --ff-only tmp-rebase</code>.</li><li>Compare <code>git log --oneline --graph &lt;branch&gt; -6</code> for the three. Then, standing on <code>try-squash</code>, try <code>git branch -d feature/three-ways</code>; stand on <code>try-merge</code> and try again.</li></ol>
<pre><code class="language-bash">git log --oneline --graph try-squash -6
* 18deb77 feat(cart): thêm giỏ hàng (#7)
* cc0a7fc docs: cập nhật README
* e0e5e93 chore: init
git branch -d feature/three-ways          <span class="tok-comment"># standing on try-squash</span>
error: the branch 'feature/three-ways' is not fully merged
git switch try-merge &amp;&amp; git branch -d feature/three-ways
Deleted branch feature/three-ways (was 5d0873f).   <span class="tok-comment"># real run; your hashes differ</span></code></pre>
<p><strong>Done when:</strong> you can point to the graph with a commit that has two parents, the one where "wip" survived but with hashes different from the originals, and the one where "wip" is gone — and explain why <code>git branch -d</code> refused on <code>try-squash</code> but succeeded on <code>try-merge</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Merge commit</span><span class="v">A commit with two parents that joins the PR branch into <code>main</code>; GitHub's "Create a merge commit".</span></div>
  <div class="kv"><span class="k">Squash and merge</span><span class="v">All the PR's changes become one new commit on <code>main</code>; the branch's own commits are not kept there.</span></div>
  <div class="kv"><span class="k">Rebase and merge</span><span class="v">Each commit is replayed onto <code>main</code> with a new hash; no merge commit, straight-line history.</span></div>
  <div class="kv"><span class="k">Linear history</span><span class="v">A history with no merge commits — every commit has one parent. A protection rule can require it.</span></div>
  <div class="kv"><span class="k">Auto-merge</span><span class="v">Tell GitHub to merge by itself the moment every required check and review is satisfied.</span></div>
  <div class="kv"><span class="k">Merge queue</span><span class="v">GitHub re-tests queued PRs against the real upcoming <code>main</code>, in order, before merging each.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>The three buttons build three different <code>main</code>s: a two-parent merge commit, one squashed commit, or replayed commits with new hashes.</li><li>Squash is the sensible default for a student team: one PR, one commit, one revert — so the PR title has to be written like a commit message.</li><li>A merge commit is undone with <code>git revert -m 1</code>; plain <code>git revert</code> on it fails asking for <code>-m</code>.</li><li>After squash or GitHub's rebase, <code>git branch -d</code> refuses because the commits on <code>main</code> are new — confirm "Merged", then use <code>-D</code>.</li><li>Pick one strategy and switch the other two off in Settings, so the history keeps one shape.</li></ul>

<a class="link-card" href="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — About merge methods</span><span class="lc-sub">The three buttons, what each produces, and how to restrict them.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: merge the same branch three ways and compare the graph</span><span class="lc-sub">A graded exercise on the resulting shape of main.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> mixing squash-merge with long-lived shared branches. Squashing rewrites the branch's commits into a new one on main, so anyone whose branch was based on the original commits now has a history that diverges from main with no common tip. Their next merge re-introduces the same changes as "new" work and conflicts with itself. If a branch has children, merge it with a merge commit, not a squash.</div>
<p class="note-ct"><strong>Where this connects to Chapter 2:</strong> your merge strategy is the shape of the history that <code>bisect</code> and <code>blame</code> will search in two years. Squash gives coarse but reliable steps; merge commits give fine detail plus grouping; rebase gives fine detail with no grouping and no CI guarantee. Choose for the archaeologist you will be later, not only for how the graph looks today.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Ba cái nút, ba lịch sử khác nhau</h2>
<p class="lead">GitHub cho ba lựa chọn: "Create a merge commit", "Squash and merge" và "Rebase and merge". Chúng không phải biến thể trang trí — mỗi cái tạo ra một <code>main</code> khác nhau, với hệ quả khác nhau cho <code>revert</code>, <code>bisect</code> và <code>blame</code> trong nhiều năm sau đó.</p>

<h3>Merge commit — giữ lại mọi thứ</h3>
${slide('git-06', 9, 'Nút 1: merge commit — đồ thị thật')}
<pre><code>git switch main &amp;&amp; git merge --no-ff feature/login</code></pre>
<div class="out">*   8c4f2a1 (main) Merge pull request #431 from feature/login
|\\
| * 1a2b3c4 fix: address review — use the shared helper
| * 9e2d4b7 wip
| * 3f8a1c9 feat(auth): add refresh token rotation
|/
* 7b3e9d1 refactor(api): extract pagination</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Giữ lại</span><span class="v">Mọi commit, điểm rẽ nhánh, và một commit hợp nhất gọi tên PR.</span></div>
  <div class="kv"><span class="k">Tốt cho</span><span class="v">Một bản ghi chính xác. <code>git log --first-parent</code> liệt kê mỗi tính năng một dòng. Hoàn tác cả một tính năng chỉ tốn một <code>revert -m 1</code>.</span></div>
  <div class="kv"><span class="k">Cái giá</span><span class="v">"wip" và "fix typo" sống trên main mãi mãi. Trên kho sôi động thì đồ thị thành khó đọc.</span></div>
</div>

<h3>Squash and merge — mỗi pull request một commit</h3>
${slide('git-06', 10, 'Nút 2 và 3: squash và rebase — đồ thị thật')}
<div class="out">* 8c4f2a1 (main) fix(auth): reject expired refresh tokens (#431)
* 7b3e9d1 refactor(api): extract pagination</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Giữ lại</span><span class="v">Các thay đổi, gộp thành một commit duy nhất. Tiêu đề PR trở thành lời nhắn, còn các commit riêng lẻ của nhánh không sống sót trên main.</span></div>
  <div class="kv"><span class="k">Tốt cho</span><span class="v">Một main tuyến tính sạch sẽ, một commit = một thay đổi đã được review. <code>git bisect</code> đạt trạng thái tốt nhất: mọi commit trên main đều đã qua CI như một khối.</span></div>
  <div class="kv"><span class="k">Cái giá</span><span class="v">Các commit trung gian biến mất. Một PR 900 dòng thành một commit 900 dòng, mà <code>blame</code> và <code>bisect</code> không thu hẹp thêm được nữa.</span></div>
</div>
<div class="callout warn">Squash biến <strong>tiêu đề pull request</strong> thành lời nhắn commit vĩnh viễn trên main. "Sửa lỗi" và "cập nhật linh tinh" sẽ trở thành lịch sử của bạn. Nếu nhóm bạn dùng squash, hãy ép Conventional Commits (bài 1.4) lên tiêu đề PR — một phép kiểm CI cho cái mẫu đó dài mười dòng và tự trả công cho nó.</div>
<div class="callout ok"><strong>Nói cho chính xác, tính đến 09/2026 (GitHub Docs):</strong> lời nhắn squash mặc định tuỳ vào số commit. Có <strong>từ hai commit trở lên</strong> thì nó là tiêu đề pull request cộng danh sách các commit của nhánh — đúng trường hợp mục này mô tả. Chỉ có <strong>một</strong> commit thì GitHub đề xuất tiêu đề và lời nhắn của chính commit đó. Kho có thể chốt định dạng ở Settings → General → Pull Requests → "Allow squash merging" (chỉ tiêu đề PR; tiêu đề + chi tiết commit; tiêu đề + mô tả). Đặt thế nào thì chữ vẫn sửa được trong hộp merge — hãy đọc trước khi xác nhận.</div>

<h3>Rebase and merge — tuyến tính, giữ mọi commit</h3>
<div class="out">* 1a2b3c4 (main) fix: address review — use the shared helper
* 9e2d4b7 wip
* 3f8a1c9 feat(auth): add refresh token rotation
* 7b3e9d1 refactor(api): extract pagination</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Giữ lại</span><span class="v">Mọi commit, được phát lại lên main với mã băm mới. Không có commit hợp nhất, không có điểm rẽ nhánh.</span></div>
  <div class="kv"><span class="k">Tốt cho</span><span class="v">Những nhóm biết chăm chút lịch sử nhánh trước khi merge — mỗi commit có nghĩa và tự đứng được.</span></div>
  <div class="kv"><span class="k">Cái giá</span><span class="v">Mọi commit "wip" chưa được chăm chút đáp thẳng xuống main mà không có commit hợp nhất để gom lại. Các commit riêng lẻ trên main có thể chưa bao giờ tự mình qua CI.</span></div>
</div>
<div class="callout danger">Điểm cuối cùng đó là lưỡi dao sắc. CI kiểm ĐẦU của nhánh. Với rebase-and-merge, các commit trung gian đáp xuống main mà chưa từng được kiểm ở đúng vị trí đó — nên <code>git bisect</code> có thể dừng lại ở một commit hỏng vì lý do chẳng liên quan gì tới con lỗi bạn đang săn.</div>
<div class="callout warn">Thêm một khác biệt so với <code>git rebase</code> bạn chạy ở máy (GitHub Docs, 09/2026): "Rebase and merge" của GitHub <strong>luôn luôn</strong> tạo mã băm mới và cập nhật thông tin người commit (committer) — kể cả khi nhánh của bạn vốn đã nằm ngay trên đầu <code>main</code> và một lần rebase ở máy sẽ chẳng đổi gì. Nên sau một lần rebase-merge, commit trên <code>main</code> không bao giờ là commit trên laptop của bạn, và <code>git branch -d</code> sẽ không nhận ra nhánh của bạn đã được merge (xem phần vòng đời bên dưới).</div>

<h3>Chọn cái nào</h3>
${slide('git-06', 11, 'So sánh ba nút merge')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Squash — mặc định cho đa số nhóm</span><span class="lz-v">Mô hình tư duy đơn giản: một PR, một commit, một lần revert. Người đóng góp không cần chăm chút lịch sử. Hãy chọn cái này trừ khi có lý do để không chọn.</span></div>
  <div class="lz-layer"><span class="lz-k">Merge commit — nhóm lớn, nhánh sống lâu</span><span class="lz-v">Khi lịch sử thật sự quan trọng, khi có nhánh phát hành, hoặc khi một tính năng thật sự là một chuỗi thay đổi liên quan đáng được giữ lại.</span></div>
  <div class="lz-layer"><span class="lz-k">Rebase — chỉ dành cho nhóm kỷ luật</span><span class="lz-v">Chạy tốt ở nơi ai cũng rebase và dọn nhánh của mình trước khi review. Rất mong manh khi trình độ trong nhóm chênh lệch.</span></div>
</div>
<p>Chọn cái nào cũng được, nhưng <strong>hãy chọn MỘT và tắt hai cái kia</strong> trong Settings → General → Pull Requests. Một kho mà cả ba bị trộn lẫn thì có một lịch sử khó đọc và khó viết script để xử lý.</p>

<h3>Vòng đời quanh lần merge</h3>
${slide('git-06', 12, 'Hệ quả: revert -m 1 và branch -d bị từ chối sau squash')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">CI xanh + đã được duyệt</div><div class="lz-d">Luật bảo vệ nhánh ép cả hai (bài 6.4).</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Cập nhật nhánh</div><div class="lz-d">Nút "Update branch" trên GitHub, hoặc <code>git rebase origin/main</code> — để CI chạy trên đúng thứ sẽ nằm trên main.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Merge</div><div class="lz-d">Đúng một chiến lược của nhóm bạn. Hãy đọc lời nhắn tự sinh trước khi xác nhận.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Xoá nhánh</div><div class="lz-d">GitHub có sẵn một cái nút; hãy bật xoá tự động trong phần cài đặt.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Dọn ở máy mình</div><div class="lz-d"><code>git switch main &amp;&amp; git pull &amp;&amp; git fetch --prune &amp;&amp; git branch -d feature/login</code></div></div>
</div>
<div class="callout warn">Bước 5 như trên chạy được sau một <strong>merge commit</strong>. Sau <strong>squash</strong> (và sau rebase của GitHub), <code>git branch -d</code> từ chối — output thật sau một lần squash-merge mà GitHub đã xoá nhánh trên máy chủ:
<div class="out">git fetch --prune
 - [deleted]         (none)     -&gt; origin/feature/refresh-token
git branch -d feature/refresh-token
error: the branch 'feature/refresh-token' is not fully merged
hint: If you are sure you want to delete it, run 'git branch -D feature/refresh-token'</div>
Git không sai: commit trên <code>main</code> là một commit hoàn toàn mới, và các commit của nhánh bạn thật sự không nằm trên nhánh nào khác. Hãy kiểm pull request đã hiện <strong>Merged</strong> (<code>gh pr view &lt;số&gt;</code>), rồi xoá bằng <code>git branch -D</code>. Chữ D hoa là chuyện bình thường trong một nhóm dùng squash — và đó chính là lý do phải kiểm trước.</div>

<h3>Auto-merge</h3>
<pre><code>gh pr merge 431 --squash --auto --delete-branch</code></pre>
<p>Xếp hàng để merge ngay khoảnh khắc mọi kiểm tra bắt buộc qua và mọi lượt duyệt bắt buộc đã có. Hữu ích cho một PR nhỏ được duyệt trong lúc CI còn đang chạy — thay vì quay lại sau sáu phút, nó tự merge.</p>

<h3>Hàng đợi merge, cho kho mã bận rộn</h3>
<p>Trên một kho có vài PR merge mỗi giờ, câu "CI đã xanh" có thể là một lời nói dối: nó xanh trên một <code>main</code> mà từ đó tới giờ đã đi tiếp. Một hàng đợi merge kiểm lại từng PR trên <em>main sắp tới thật sự</em>, theo thứ tự, và chỉ merge nếu nó vẫn qua. Đó là phương thuốc chuẩn cho chuyện "main hỏng vì hai PR mà tách riêng cái nào cũng ổn" — một xung đột ngữ nghĩa (bài 3.2) ở cấp kho mã.</p>
<div class="callout ok"><strong>Trước khi định dùng (GitHub Docs, 09/2026):</strong> hàng đợi merge có ở kho public thuộc một <em>tổ chức</em> (organization), và ở kho private của tổ chức dùng GitHub Enterprise Cloud — không có ở kho thuộc tài khoản cá nhân. Nếu có dùng, workflow CI phải chạy thêm cả sự kiện <code>merge_group</code> (<code>on: pull_request:</code> cộng <code>merge_group:</code>), không thì các kiểm tra bắt buộc không bao giờ được báo cho nhóm đang xếp hàng và lần merge thất bại. Với đồ án năm người, luật "bắt buộc nhánh phải cập nhật" (bài 6.4) cho gần đủ độ an toàn đó.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong <code>thu-git</code>, đứng ở <code>main</code>: <code>git switch -c feature/three-ways</code> rồi tạo ba commit trên một file (ví dụ <code>cart.txt</code>) — commit thứ hai có lời nhắn <code>wip</code>. Quay về <code>main</code> và commit một thay đổi ở <code>README.md</code>, như thể PR của một bạn cùng nhóm vừa vào trong lúc đó.</li><li>Tạo ba bản sao dùng-một-lần của <code>main</code>: <code>git branch try-merge; git branch try-squash; git branch try-rebase</code>. Mỗi cái đóng vai "main sau khi bấm một nút".</li><li>Bấm ba nút bằng tay: trên <code>try-merge</code> chạy <code>git merge --no-ff feature/three-ways -m "Merge pull request #7 from feature/three-ways"</code>; trên <code>try-squash</code> chạy <code>git merge --squash feature/three-ways</code> rồi <code>git commit -m "feat(cart): thêm giỏ hàng (#7)"</code>; với rebase: <code>git switch -c tmp-rebase feature/three-ways</code>, <code>git rebase try-rebase</code>, <code>git switch try-rebase</code>, <code>git merge --ff-only tmp-rebase</code>.</li><li>So <code>git log --oneline --graph &lt;nhánh&gt; -6</code> của cả ba. Rồi đứng trên <code>try-squash</code> thử <code>git branch -d feature/three-ways</code>; đứng trên <code>try-merge</code> thử lại.</li></ol>
<pre><code class="language-bash">git log --oneline --graph try-squash -6
* 18deb77 feat(cart): thêm giỏ hàng (#7)
* cc0a7fc docs: cập nhật README
* e0e5e93 chore: init
git branch -d feature/three-ways          <span class="tok-comment"># đang đứng trên try-squash</span>
error: the branch 'feature/three-ways' is not fully merged
git switch try-merge &amp;&amp; git branch -d feature/three-ways
Deleted branch feature/three-ways (was 5d0873f).   <span class="tok-comment"># chạy thật; mã băm của bạn sẽ khác</span></code></pre>
<p><strong>Đạt khi:</strong> bạn chỉ ra được đồ thị có một commit hai cha, đồ thị mà "wip" còn sống nhưng mang mã băm khác bản gốc, và đồ thị mà "wip" biến mất — và giải thích được vì sao <code>git branch -d</code> từ chối trên <code>try-squash</code> nhưng chạy được trên <code>try-merge</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Merge commit</span><span class="v">Commit hợp nhất — commit có hai cha nối nhánh PR vào <code>main</code>; nút "Create a merge commit" của GitHub.</span></div>
  <div class="kv"><span class="k">Squash and merge</span><span class="v">Ép rồi merge — mọi thay đổi của PR gộp thành một commit mới trên <code>main</code>; các commit riêng của nhánh không được giữ ở đó.</span></div>
  <div class="kv"><span class="k">Rebase and merge</span><span class="v">Rebase rồi merge — từng commit được phát lại lên <code>main</code> với mã băm mới; không có commit hợp nhất, lịch sử thẳng một đường.</span></div>
  <div class="kv"><span class="k">Linear history</span><span class="v">Lịch sử tuyến tính — không có commit hợp nhất, commit nào cũng một cha. Một luật bảo vệ có thể bắt buộc điều này.</span></div>
  <div class="kv"><span class="k">Auto-merge</span><span class="v">Tự động merge — dặn GitHub tự merge ngay khi mọi kiểm tra và lượt duyệt bắt buộc đã đủ.</span></div>
  <div class="kv"><span class="k">Merge queue</span><span class="v">Hàng đợi merge — GitHub kiểm lại các PR đang xếp hàng trên đúng <code>main</code> sắp tới, theo thứ tự, rồi mới merge từng cái.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Ba cái nút dựng ra ba <code>main</code> khác nhau: một commit hợp nhất hai cha, một commit đã ép, hoặc các commit phát lại mang mã băm mới.</li><li>Squash là mặc định hợp lý cho nhóm sinh viên: một PR, một commit, một lần revert — nên tiêu đề PR phải viết như lời nhắn commit.</li><li>Gỡ một merge commit bằng <code>git revert -m 1</code>; <code>git revert</code> trần trên nó thất bại và đòi <code>-m</code>.</li><li>Sau squash hay rebase của GitHub, <code>git branch -d</code> từ chối vì commit trên <code>main</code> là commit mới — kiểm "Merged" rồi dùng <code>-D</code>.</li><li>Chọn một chiến lược và tắt hai cái kia trong Settings, để lịch sử giữ một hình dạng.</li></ul>

<a class="link-card" href="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github" target="_blank" rel="noopener">
  <span class="lc-ico">🔀</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Về các phương thức merge</span><span class="lc-sub">Ba cái nút, mỗi cái tạo ra gì, và cách giới hạn chúng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/git${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: merge cùng một nhánh theo ba cách rồi so đồ thị</span><span class="lc-sub">Bài tập chấm điểm về hình dạng main thu được.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> trộn squash-merge với những nhánh chung sống lâu. Squash viết lại các commit của nhánh thành một commit mới trên main, nên ai có nhánh dựa trên các commit gốc thì giờ có một lịch sử phân ly khỏi main mà không còn đầu chung. Lần merge tiếp theo của họ mang lại đúng những thay đổi đó như công việc "mới" và xung đột với chính nó. Nếu một nhánh có nhánh con, hãy merge nó bằng commit hợp nhất, đừng squash.</div>
<p class="note-ct"><strong>Chỗ này nối với Chương 2:</strong> chiến lược merge của bạn chính là hình dạng lịch sử mà <code>bisect</code> và <code>blame</code> sẽ tìm kiếm trong đó hai năm nữa. Squash cho những bước thô nhưng đáng tin; commit hợp nhất cho chi tiết mịn cộng khả năng gom nhóm; rebase cho chi tiết mịn mà không gom nhóm và không bảo đảm CI. Hãy chọn cho nhà khảo cổ mà bạn sẽ trở thành sau này, đừng chỉ chọn theo cái đồ thị hôm nay trông ra sao.</p>
</div>
`,
    },

    /* ─────────────────────────── 6.4 ─────────────────────────── */
    {
      title: '6.4 — Branch protection, CODEOWNERS & required checks|||6.4 — Bảo vệ nhánh, CODEOWNERS & kiểm tra bắt buộc',
      slug: 'git-6-4-bao-ve-nhanh',
      type: 'LESSON',
      description: 'Biến quy ước thành luật máy áp: cấm push thẳng, bắt buộc review và CI xanh, CODEOWNERS tự gán người review, và những luật gây bực mình nhiều hơn giá trị.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Turning "we agreed to" into "the server refuses"</h2>
<p class="lead">Every team agrees not to push straight to <code>main</code>, and every team does it anyway on the Friday when something is on fire. Branch protection turns the agreement into a mechanism, and the value is not distrust — it is removing the decision from a moment when nobody is thinking clearly.</p>

<h3>The rules worth turning on</h3>
${slide('git-06', 13, 'Nhánh bảo vệ và những luật nên bật')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Require a pull request</span><span class="lz-v">No direct pushes to <code>main</code>. The foundation everything else rests on.</span></div>
  <div class="lz-layer"><span class="lz-k">Require approvals (1 is usually enough)</span><span class="lz-v">Someone other than the author looked at it. Two is right for security-sensitive repositories and slows everything else down.</span></div>
  <div class="lz-layer"><span class="lz-k">Dismiss stale approvals on new commits</span><span class="lz-v">An approval covers the code that was reviewed, not code pushed afterwards. Without this, "approve, then push anything" is a real hole.</span></div>
  <div class="lz-layer"><span class="lz-k">Require status checks to pass</span><span class="lz-v">Name the CI jobs that must be green. This is what stops a red build reaching main.</span></div>
  <div class="lz-layer"><span class="lz-k">Require the branch to be up to date</span><span class="lz-v">CI must have run against the current main, not last week's. Prevents the two-PRs-each-fine case (3.2).</span></div>
  <div class="lz-layer"><span class="lz-k">Require conversation resolution</span><span class="lz-v">Every review thread resolved before merge. Cheap, and stops comments being silently ignored.</span></div>
  <div class="lz-layer"><span class="lz-k">Block force pushes &amp; deletions</span><span class="lz-v">On by default with protection, and the reason a <code>--force</code> accident cannot reach <code>main</code>.</span></div>
</div>
<div class="callout ok">"Require the branch to be up to date" plus "require status checks" is the pair that actually keeps main green. Either alone leaves the hole where two independently-passing PRs break each other once both land.</div>
<div class="callout warn"><strong>Check your plan first (GitHub Docs, 09/2026):</strong> protected branches and rulesets are available in <em>public</em> repositories on GitHub Free, and in public <em>and private</em> repositories on GitHub Pro, Team and Enterprise. A private SWP391 repository on a Free personal account has none of this — the settings page tells you so. Students can claim GitHub Pro free through the GitHub Student Developer Pack, which unlocks it for private repositories. Two more rules worth knowing by name: <strong>Require approval of the most recent reviewable push</strong> (the last person who pushed cannot be the one whose approval counts) and <strong>Do not allow bypassing the above settings</strong> (without it, admins can merge past the rules).</div>

<h3>What a protected push looks like</h3>
<pre><code>git push origin main</code></pre>
<div class="out">remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: Changes must be made through a pull request.
 ! [remote rejected] main -&gt; main (protected branch hook declined)</div>
<p>Nothing broke. Make a branch, push that, open a pull request — which is what you meant to do.</p>

<h3>CODEOWNERS — routing review automatically</h3>
${slide('git-06', 14, 'CODEOWNERS: luật khớp cuối cùng thắng')}
<pre><code><span class="tok-comment"># .github/CODEOWNERS — last matching rule wins, like .gitignore</span>

<span class="tok-comment"># Default owners for everything</span>
*                       @cuonghoang1103

<span class="tok-comment"># Area experts</span>
/src/services/auth/     @security-team
/prisma/                @cuonghoang1103 @db-team
/.github/workflows/     @devops-team
/frontend/              @frontend-team

<span class="tok-comment"># Anything touching payments needs two specific people</span>
/src/services/payment/  @cuonghoang1103 @finance-lead</code></pre>
<p>GitHub requests review from the matching owners automatically. Combined with "Require review from Code Owners", a change to <code>prisma/</code> cannot merge without someone from <code>@db-team</code> — the knowledge requirement becomes structural rather than something you have to remember.</p>
<div class="callout warn">Every entry is a potential bottleneck. If <code>@security-team</code> is one person on holiday, every auth pull request stops. Assign <em>teams</em>, not individuals, and keep the file short — a CODEOWNERS with forty rules is a repository where nothing merges on a Friday.</div>
<div class="callout ok">Three details from GitHub Docs (09/2026) that explain most "why wasn't anyone requested?" moments: the file may live in <code>.github/</code>, the repository root or <code>docs/</code> — GitHub searches in that order and uses the first one it finds; every listed user or team needs <strong>explicit write access</strong> to the repository; and code owners are <strong>not</strong> requested on draft pull requests — they are notified when you mark the draft ready for review.</div>

<h3>Required status checks</h3>
${slide('git-06', 15, 'Kiểm tra bắt buộc, bẫy Pending, ruleset')}
<pre><code><span class="tok-comment"># .github/workflows/ci.yml — the job name is what you require</span>
name: CI
on: [pull_request]
jobs:
  test:
    name: Lint &amp; Type Check      <span class="tok-comment"># ← this exact string goes in the protection rule</span>
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm test</code></pre>
<div class="callout danger">A required check that never runs blocks the pull request <strong>forever</strong> — GitHub waits for a report that will not arrive. This happens when a job is renamed, or when it has a path filter (<code>on: pull_request: paths: ['src/**']</code>) and the PR touches only docs. Either drop the path filter or add a trivial job with the same name that reports success for skipped paths.</div>
<div class="callout ok"><strong>GitHub's own table for this (Docs, 09/2026):</strong> a workflow skipped by a path filter, a branch filter or a skip keyword in the commit message leaves its checks <strong>Pending</strong>, which blocks the merge. A <em>job</em> skipped by an <code>if:</code> condition is different — it reports <strong>Success</strong>. And a job that <code>needs</code> a failed job is skipped and may <em>not</em> block the merge; for required checks that depend on other jobs, use <code>if: always()</code> and fail explicitly.</div>

<h3>Rules that cost more than they give</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Requiring 3+ approvals</span><span class="v">On a team of four this means everyone reviews everything. Approvals become rubber stamps, which is worse than one careful review.</span></div>
  <div class="kv"><span class="k">Requiring signed commits everywhere</span><span class="v">Good for a release branch; on every branch it blocks contributors whose setup is not ready and produces confusing rejections (12.4).</span></div>
  <div class="kv"><span class="k">Requiring linear history and merge commits</span><span class="v">Contradictory. Pick one merge strategy (6.3) and configure the protection to match it.</span></div>
  <div class="kv"><span class="k">Including administrators, with no break-glass</span><span class="v">Correct in principle, but have a documented emergency path — a temporary rule change with an audit-log entry beats someone inventing one at 2 a.m.</span></div>
</div>

<h3>Rulesets — the newer mechanism</h3>
<p>GitHub Rulesets do what branch protection does, plus: they apply to several branches or tags by pattern, several rulesets can layer, they can be set organisation-wide, and they have an <strong>evaluate</strong> mode that logs what <em>would</em> have been blocked without blocking it. That last one is how you roll out a strict rule on a busy repository without stopping work on day one.</p>
<div class="callout warn"><strong>Correction by plan (GitHub Docs, 09/2026):</strong> the paragraph above is true on GitHub Enterprise, but two parts do not reach a student account. <strong>Evaluate</strong> mode is documented only for GitHub Enterprise — on Free, Pro and Team a ruleset is either Active or Disabled. <strong>Organisation-wide</strong> rulesets are for organisations on the Enterprise plan. What every plan does get: several rulesets can target the same branch and the most restrictive version of each rule applies; anyone with read access can see the active rulesets (so a teammate can find out <em>why</em> their push was refused); a ruleset can be switched off without deleting it; and a repository can hold up to 75 of them. For a new repository today, start with a ruleset rather than a classic branch protection rule.</div>

<h3>A sensible starting configuration</h3>
<pre><code>Branch: main
  ☑ Require a pull request before merging
      ☑ Require 1 approval
      ☑ Dismiss stale approvals when new commits are pushed
      ☑ Require review from Code Owners
  ☑ Require status checks to pass
      ☑ Require branches to be up to date before merging
      • Lint &amp; Type Check
      • Test
  ☑ Require conversation resolution before merging
  ☑ Block force pushes
  ☐ Require signed commits          (later, if you need it)
  ☐ Include administrators          (with a documented break-glass)</code></pre>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Use <code>thu-git</code> on GitHub; it must be <strong>public</strong>, or you need GitHub Pro (free with the Student Developer Pack). Through a pull request, add <code>.github/CODEOWNERS</code> with a default line <code>*  @your-username</code> and a more specific line below it, for example <code>/docs/  @your-username</code>.</li><li>Settings → Rules → Rulesets → New ruleset → New branch ruleset. Name it <code>protect-main</code>, set enforcement to <strong>Active</strong>, add the default branch as target, and tick <em>Restrict deletions</em>, <em>Block force pushes</em> and <em>Require a pull request before merging</em>. Working alone, leave required approvals at <strong>0</strong> (you cannot approve your own PR); with a teammate as collaborator, set it to 1.</li><li>Prove the rule works: commit something on local <code>main</code> and <code>git push origin main</code>. Read the rejection GitHub sends back on the <code>remote:</code> lines. Then <code>git reset --hard origin/main</code> to drop the local commit.</li><li>Do it properly: move the change to a branch, push, open a PR, and look at the merge box — it lists what the ruleset requires. Merge it, then run <code>git push --force origin main</code> once to see force pushes refused too.</li></ol>
<p><strong>Done when:</strong> a direct push to <code>main</code> and a force push are both refused by the ruleset, the same change reaches <code>main</code> through a pull request, and you can say which CODEOWNERS line would be requested for a change under <code>docs/</code> and why.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Branch protection rule</span><span class="v">The classic per-branch settings (require PR, reviews, checks…); only one rule applies to a branch.</span></div>
  <div class="kv"><span class="k">Ruleset</span><span class="v">The newer mechanism: named sets of rules that can stack, target many branches or tags, and be switched Active/Disabled.</span></div>
  <div class="kv"><span class="k">Required status check</span><span class="v">A named CI job that must report success before the PR can merge.</span></div>
  <div class="kv"><span class="k">CODEOWNERS</span><span class="v">File mapping paths to people or teams; GitHub requests their review automatically, and the last matching line wins.</span></div>
  <div class="kv"><span class="k">Stale approval</span><span class="v">An approval given before newer commits were pushed; a rule can dismiss it automatically.</span></div>
  <div class="kv"><span class="k">Bypass</span><span class="v">Permission to act past the rules (admins by default in classic protection unless you forbid it).</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>Protection turns "we agreed not to push to main" into a server-side refusal, removing the decision from tired moments.</li><li>The pair that keeps main green is "require status checks" plus "require branches to be up to date".</li><li>CODEOWNERS routes review automatically; the last matching line wins, and teams are safer than single people.</li><li>A required check that never runs (path filter, renamed job) leaves the PR Pending forever.</li><li>Private repositories need Pro/Team for any of this; rulesets are the mechanism to start with, and Evaluate mode is Enterprise-only.</li></ul>

<a class="link-card" href="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — About protected branches</span><span class="lc-sub">Every rule, what it blocks, and how rulesets differ.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners" target="_blank" rel="noopener">
  <span class="lc-ico">👥</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — About code owners</span><span class="lc-sub">Syntax, precedence, and why the last matching rule wins.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> protecting <code>main</code> and forgetting the branches that also reach production — a <code>release/*</code> line, a <code>staging</code> branch a deploy watches, or the tags a release workflow triggers on. Protection is per-pattern, so <code>main</code> being safe says nothing about <code>release/2.0</code>. List every ref that can cause a deploy and protect all of them.</div>
<p class="note-ct"><strong>The framing that gets teams to accept this:</strong> protection is not about trusting people less. It is about removing a class of accident — the tired force-push, the wrong terminal window, the "just this once" at midnight. Nobody argues that a seatbelt implies bad driving.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Biến "chúng ta đã thống nhất" thành "máy chủ từ chối"</h2>
<p class="lead">Nhóm nào cũng thống nhất là không push thẳng vào <code>main</code>, và nhóm nào cũng làm thế vào đúng cái thứ Sáu có thứ gì đó đang cháy. Bảo vệ nhánh biến lời thống nhất thành một cơ chế, và giá trị của nó không phải là sự nghi ngờ — mà là gỡ quyết định đó ra khỏi một khoảnh khắc không ai còn tỉnh táo.</p>

<h3>Những luật đáng bật</h3>
${slide('git-06', 13, 'Nhánh bảo vệ và những luật nên bật')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Bắt buộc qua pull request</span><span class="lz-v">Không push thẳng vào <code>main</code>. Nền móng mà mọi thứ khác dựa lên.</span></div>
  <div class="lz-layer"><span class="lz-k">Bắt buộc có duyệt (1 thường là đủ)</span><span class="lz-v">Có người khác ngoài tác giả đã nhìn qua. Hai là hợp lý cho kho nhạy cảm về bảo mật và làm chậm mọi thứ khác.</span></div>
  <div class="lz-layer"><span class="lz-k">Huỷ duyệt cũ khi có commit mới</span><span class="lz-v">Một lượt duyệt bao phủ phần mã đã được review, không bao phủ mã đẩy lên sau đó. Thiếu luật này thì "duyệt xong rồi push gì cũng được" là một lỗ hổng thật.</span></div>
  <div class="lz-layer"><span class="lz-k">Bắt buộc kiểm tra trạng thái phải qua</span><span class="lz-v">Gọi tên những job CI phải xanh. Đây là thứ chặn một bản dựng đỏ đi tới main.</span></div>
  <div class="lz-layer"><span class="lz-k">Bắt buộc nhánh phải cập nhật</span><span class="lz-v">CI phải chạy trên main hiện tại, không phải main tuần trước. Ngăn ca hai-PR-mỗi-cái-đều-ổn (bài 3.2).</span></div>
  <div class="lz-layer"><span class="lz-k">Bắt buộc đóng hết luồng thảo luận</span><span class="lz-v">Mọi luồng review phải được đóng trước khi merge. Rẻ, và chặn việc bình luận bị lờ đi trong im lặng.</span></div>
  <div class="lz-layer"><span class="lz-k">Chặn force push &amp; xoá nhánh</span><span class="lz-v">Bật sẵn khi có bảo vệ, và là lý do một tai nạn <code>--force</code> không tới được <code>main</code>.</span></div>
</div>
<div class="callout ok">"Bắt buộc nhánh phải cập nhật" cộng "bắt buộc kiểm tra trạng thái" là cặp thật sự giữ cho main xanh. Chỉ một trong hai thì vẫn để lại đúng cái lỗ hổng khi hai PR mỗi cái đều qua nhưng phá nhau ngay khi cả hai cùng đáp xuống.</div>
<div class="callout warn"><strong>Kiểm gói tài khoản trước (GitHub Docs, 09/2026):</strong> nhánh bảo vệ và ruleset có ở kho <em>public</em> với GitHub Free, và ở kho public <em>lẫn private</em> với GitHub Pro, Team và Enterprise. Một kho SWP391 để private trên tài khoản cá nhân Free thì không có gì trong số này — trang cài đặt sẽ báo thẳng. Sinh viên nhận được GitHub Pro miễn phí qua gói GitHub Student Developer Pack, và Pro mở khoá tính năng này cho kho private. Thêm hai luật đáng biết tên: <strong>Require approval of the most recent reviewable push</strong> (người push cuối cùng không được là người có lượt duyệt được tính) và <strong>Do not allow bypassing the above settings</strong> (thiếu nó thì admin vẫn merge vượt luật được).</div>

<h3>Một lần push bị chặn trông thế nào</h3>
<pre><code>git push origin main</code></pre>
<div class="out">remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: Changes must be made through a pull request.
 ! [remote rejected] main -&gt; main (protected branch hook declined)</div>
<p>Không có gì hỏng cả. Hãy tạo một nhánh, push nhánh đó, mở một pull request — đúng thứ bạn định làm.</p>

<h3>CODEOWNERS — tự động định tuyến việc review</h3>
${slide('git-06', 14, 'CODEOWNERS: luật khớp cuối cùng thắng')}
<pre><code><span class="tok-comment"># .github/CODEOWNERS — luật khớp CUỐI CÙNG thắng, giống .gitignore</span>

<span class="tok-comment"># Chủ sở hữu mặc định cho mọi thứ</span>
*                       @cuonghoang1103

<span class="tok-comment"># Chuyên gia từng mảng</span>
/src/services/auth/     @security-team
/prisma/                @cuonghoang1103 @db-team
/.github/workflows/     @devops-team
/frontend/              @frontend-team

<span class="tok-comment"># Bất cứ thứ gì chạm vào thanh toán cần đúng hai người</span>
/src/services/payment/  @cuonghoang1103 @finance-lead</code></pre>
<p>GitHub tự động mời đúng những chủ sở hữu khớp vào review. Kết hợp với "Require review from Code Owners", một thay đổi trong <code>prisma/</code> không merge được nếu chưa có ai từ <code>@db-team</code> — yêu cầu về kiến thức trở thành cấu trúc thay vì thành thứ bạn phải nhớ.</p>
<div class="callout warn">Mỗi dòng là một nút thắt tiềm tàng. Nếu <code>@security-team</code> là một người đang đi nghỉ, mọi pull request về auth đứng lại. Hãy gán <em>đội</em>, đừng gán cá nhân, và giữ file ngắn — một CODEOWNERS bốn mươi dòng là một kho mã không có gì merge được vào thứ Sáu.</div>
<div class="callout ok">Ba chi tiết trong GitHub Docs (09/2026) giải thích phần lớn những lần "sao không ai được mời review?": file có thể nằm ở <code>.github/</code>, ở gốc kho hoặc ở <code>docs/</code> — GitHub tìm theo đúng thứ tự đó và dùng file đầu tiên thấy được; mỗi người hoặc đội được liệt kê phải có <strong>quyền ghi (write) tường minh</strong> vào kho; và code owner <strong>không</strong> được mời trên pull request nháp — họ được báo khi bạn chuyển bản nháp sang sẵn sàng review.</div>

<h3>Kiểm tra trạng thái bắt buộc</h3>
${slide('git-06', 15, 'Kiểm tra bắt buộc, bẫy Pending, ruleset')}
<pre><code><span class="tok-comment"># .github/workflows/ci.yml — TÊN JOB là thứ bạn khai vào luật</span>
name: CI
on: [pull_request]
jobs:
  test:
    name: Lint &amp; Type Check      <span class="tok-comment"># ← đúng chuỗi này đi vào luật bảo vệ</span>
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm test</code></pre>
<div class="callout danger">Một kiểm tra bắt buộc mà không bao giờ chạy sẽ chặn pull request <strong>MÃI MÃI</strong> — GitHub chờ một báo cáo sẽ không bao giờ tới. Chuyện này xảy ra khi một job bị đổi tên, hoặc khi nó có bộ lọc đường dẫn (<code>on: pull_request: paths: ['src/**']</code>) mà PR chỉ chạm vào tài liệu. Hoặc bỏ bộ lọc đường dẫn, hoặc thêm một job tầm thường cùng tên báo thành công cho các đường dẫn bị bỏ qua.</div>
<div class="callout ok"><strong>Bảng của chính GitHub cho chuyện này (Docs, 09/2026):</strong> một workflow bị bỏ qua vì bộ lọc đường dẫn, bộ lọc nhánh hoặc từ khoá bỏ qua trong lời nhắn commit sẽ để các kiểm tra của nó ở trạng thái <strong>Pending</strong> (đang chờ) — và chặn merge. Một <em>job</em> bị bỏ qua vì điều kiện <code>if:</code> thì khác — nó báo <strong>Success</strong>. Còn một job <code>needs</code> (phụ thuộc) vào một job đã hỏng thì bị bỏ qua và có thể <em>không</em> chặn merge; với kiểm tra bắt buộc phụ thuộc job khác, dùng <code>if: always()</code> rồi tự báo lỗi cho rõ.</div>

<h3>Những luật tốn nhiều hơn cho lại</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bắt buộc 3+ lượt duyệt</span><span class="v">Trong một nhóm bốn người thì nghĩa là ai cũng review mọi thứ. Lượt duyệt thành con dấu cao su, còn tệ hơn một lượt review cẩn thận.</span></div>
  <div class="kv"><span class="k">Bắt buộc ký commit ở khắp nơi</span><span class="v">Tốt cho một nhánh phát hành; áp lên mọi nhánh thì nó chặn những người đóng góp chưa cài xong và sinh ra những lời từ chối khó hiểu (bài 12.4).</span></div>
  <div class="kv"><span class="k">Bắt buộc lịch sử tuyến tính VÀ commit hợp nhất</span><span class="v">Mâu thuẫn với nhau. Hãy chọn một chiến lược merge (bài 6.3) và cấu hình bảo vệ cho khớp với nó.</span></div>
  <div class="kv"><span class="k">Áp cả cho quản trị viên mà không có cửa thoát hiểm</span><span class="v">Đúng về nguyên tắc, nhưng phải có một đường khẩn cấp được ghi lại — một lần đổi luật tạm thời có dòng trong nhật ký kiểm toán vẫn hơn việc ai đó tự nghĩ ra một đường lúc 2 giờ sáng.</span></div>
</div>

<h3>Ruleset — cơ chế đời mới</h3>
<p>GitHub Ruleset làm được mọi thứ bảo vệ nhánh làm, cộng thêm: áp cho nhiều nhánh hoặc tag theo mẫu, nhiều ruleset xếp chồng lên nhau, đặt được ở cấp tổ chức, và có chế độ <strong>evaluate</strong> ghi lại thứ <em>lẽ ra</em> đã bị chặn mà không thật sự chặn. Cái cuối cùng chính là cách bạn triển khai một luật nghiêm ngặt trên một kho bận rộn mà không làm mọi người ngừng việc ngay ngày đầu.</p>
<div class="callout warn"><strong>Đính chính theo gói (GitHub Docs, 09/2026):</strong> đoạn trên đúng với GitHub Enterprise, nhưng có hai phần không tới được tài khoản sinh viên. Chế độ <strong>Evaluate</strong> chỉ được ghi cho GitHub Enterprise — với Free, Pro và Team, một ruleset chỉ có Active (bật) hoặc Disabled (tắt). Ruleset <strong>cấp tổ chức</strong> dành cho tổ chức dùng gói Enterprise. Thứ gói nào cũng có: nhiều ruleset cùng nhắm một nhánh và bản chặt nhất của mỗi luật được áp; ai có quyền đọc kho cũng xem được các ruleset đang bật (nên bạn cùng nhóm tự tìm ra <em>vì sao</em> lần push của mình bị từ chối); tắt một ruleset không cần xoá nó; và một kho chứa được tới 75 ruleset. Với kho mới hôm nay, hãy bắt đầu bằng ruleset thay vì luật bảo vệ nhánh kiểu cũ.</div>

<h3>Một cấu hình khởi đầu hợp lý</h3>
<pre><code>Nhánh: main
  ☑ Bắt buộc pull request trước khi merge
      ☑ Bắt buộc 1 lượt duyệt
      ☑ Huỷ duyệt cũ khi có commit mới được push
      ☑ Bắt buộc review từ Code Owners
  ☑ Bắt buộc các kiểm tra trạng thái phải qua
      ☑ Bắt buộc nhánh phải cập nhật trước khi merge
      • Lint &amp; Type Check
      • Test
  ☑ Bắt buộc đóng hết luồng thảo luận trước khi merge
  ☑ Chặn force push
  ☐ Bắt buộc commit có chữ ký       (để sau, nếu cần)
  ☐ Áp cả cho quản trị viên          (kèm một cửa thoát hiểm được ghi lại)</code></pre>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Dùng <code>thu-git</code> trên GitHub; kho phải là <strong>public</strong>, hoặc bạn cần GitHub Pro (miễn phí trong gói Student Developer Pack). Qua một pull request, thêm <code>.github/CODEOWNERS</code> với dòng mặc định <code>*  @ten-cua-ban</code> và một dòng cụ thể hơn ở dưới, ví dụ <code>/docs/  @ten-cua-ban</code>.</li><li>Settings → Rules → Rulesets → New ruleset → New branch ruleset. Đặt tên <code>protect-main</code>, chế độ <strong>Active</strong>, thêm nhánh mặc định làm đích, và tích <em>Restrict deletions</em>, <em>Block force pushes</em>, <em>Require a pull request before merging</em>. Làm một mình thì để số lượt duyệt bắt buộc là <strong>0</strong> (bạn không tự duyệt PR của mình được); có bạn cùng nhóm là collaborator thì đặt 1.</li><li>Chứng minh luật có tác dụng: commit gì đó trên <code>main</code> ở máy rồi <code>git push origin main</code>. Đọc lời từ chối GitHub gửi về ở các dòng <code>remote:</code>. Rồi <code>git reset --hard origin/main</code> để bỏ commit ở máy.</li><li>Làm đúng cách: chuyển thay đổi sang một nhánh, push, mở PR, và nhìn hộp merge — nó liệt kê thứ ruleset đòi hỏi. Merge xong, chạy thử một lần <code>git push --force origin main</code> để thấy force push cũng bị từ chối.</li></ol>
<p><strong>Đạt khi:</strong> một lần push thẳng vào <code>main</code> và một lần force push đều bị ruleset từ chối, cùng thay đổi đó vào được <code>main</code> qua pull request, và bạn nói được dòng CODEOWNERS nào sẽ được mời review cho một thay đổi trong <code>docs/</code> và vì sao.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Branch protection rule</span><span class="v">Luật bảo vệ nhánh — bộ cài đặt kiểu cũ cho từng nhánh (bắt PR, review, kiểm tra…); mỗi nhánh chỉ một luật có hiệu lực.</span></div>
  <div class="kv"><span class="k">Ruleset</span><span class="v">Bộ luật — cơ chế đời mới: các bộ luật có tên, xếp chồng được, nhắm nhiều nhánh hoặc tag, và bật/tắt (Active/Disabled) được.</span></div>
  <div class="kv"><span class="k">Required status check</span><span class="v">Kiểm tra trạng thái bắt buộc — một job CI có tên phải báo thành công thì PR mới merge được.</span></div>
  <div class="kv"><span class="k">CODEOWNERS</span><span class="v">Chủ sở hữu mã — file ánh xạ đường dẫn sang người hoặc đội; GitHub tự mời họ review, và dòng khớp cuối cùng thắng.</span></div>
  <div class="kv"><span class="k">Stale approval</span><span class="v">Lượt duyệt cũ — lượt duyệt có trước khi commit mới được push lên; một luật có thể tự huỷ nó.</span></div>
  <div class="kv"><span class="k">Bypass</span><span class="v">Vượt luật — quyền làm bất chấp các luật (luật bảo vệ kiểu cũ mặc định cho admin vượt, trừ khi bạn cấm).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Bảo vệ nhánh biến "đã thống nhất không push thẳng vào main" thành lời từ chối từ máy chủ, gỡ quyết định ra khỏi những lúc mệt mỏi.</li><li>Cặp giữ main luôn xanh là "bắt buộc kiểm tra trạng thái" cộng "bắt buộc nhánh phải cập nhật".</li><li>CODEOWNERS tự định tuyến việc review; dòng khớp cuối cùng thắng, và gán đội an toàn hơn gán một người.</li><li>Một kiểm tra bắt buộc không bao giờ chạy (bộ lọc đường dẫn, job đổi tên) để PR nằm Pending mãi mãi.</li><li>Kho private cần Pro/Team mới có những thứ này; hãy bắt đầu bằng ruleset, và chế độ Evaluate chỉ có ở Enterprise.</li></ul>

<a class="link-card" href="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Về nhánh được bảo vệ</span><span class="lc-sub">Mọi luật, mỗi luật chặn gì, và ruleset khác ở chỗ nào.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners" target="_blank" rel="noopener">
  <span class="lc-ico">👥</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Về code owners</span><span class="lc-sub">Cú pháp, thứ tự ưu tiên, và vì sao luật khớp cuối cùng thắng.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> bảo vệ <code>main</code> mà quên những nhánh cũng dẫn tới production — một dòng <code>release/*</code>, một nhánh <code>staging</code> mà một tiến trình deploy đang canh, hay những tag mà một workflow phát hành kích hoạt theo. Bảo vệ áp theo từng mẫu, nên <code>main</code> an toàn chẳng nói gì về <code>release/2.0</code>. Hãy liệt kê mọi ref có thể gây ra một lần deploy và bảo vệ tất cả.</div>
<p class="note-ct"><strong>Cách diễn đạt khiến các nhóm chấp nhận điều này:</strong> bảo vệ không phải là bớt tin người. Nó là gỡ đi một lớp tai nạn — cú force-push lúc mệt, nhầm cửa sổ terminal, cái "chỉ lần này thôi" lúc nửa đêm. Không ai lập luận rằng đeo dây an toàn nghĩa là lái xe kém.</p>
</div>
`,
    },

    /* ─────────────────────────── 6.5 Quiz ─────────────────────────── */
    {
      title: '6.5 — Chapter 6 quiz|||6.5 — Kiểm tra Chương 6',
      slug: 'git-6-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống thật của nhóm đồ án: chẻ PR, từ khoá đóng issue, cách review và gỡ "request changes", ba nút merge và hệ quả (revert -m 1, branch -d, bisect), CODEOWNERS và kiểm tra bắt buộc bị Pending.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from real team work on GitHub — each one is decided by how pull requests, reviews and merge buttons actually behave, not by definitions. Read the explanation after submitting, especially for the ones you got right by guessing.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can split a large piece of work into small pull requests and write a description with What / Why / Testing and <code>Closes #n</code>.</li>
<li>I can review with one batched review, labelling each comment <code>blocking:</code>, <code>question:</code> or <code>nit:</code>.</li>
<li>I can predict what <code>main</code> looks like after merge commit, squash and rebase — and undo a merge commit with <code>git revert -m 1</code>.</li>
<li>I know why <code>git branch -d</code> refuses after a squash merge, and what to check before using <code>-D</code>.</li>
<li>I can protect <code>main</code> with a ruleset, route review with CODEOWNERS, and explain why a skipped required check blocks a PR.</li>
</ul>
${slide('git-06', 16, 'Bảng tra nhanh Chương 6')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ việc nhóm thật trên GitHub — câu nào cũng được quyết định bởi cách pull request, review và các nút merge thật sự hoạt động, không phải bởi định nghĩa. Đọc phần giải thích sau khi nộp, nhất là những câu bạn đúng nhờ đoán.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chẻ được một phần việc lớn thành các pull request nhỏ và viết được mô tả có Cái gì / Vì sao / Kiểm thử và <code>Closes #n</code>.</li>
<li>Tôi review bằng một lượt review gom chung, gắn nhãn từng bình luận <code>blocking:</code>, <code>question:</code> hoặc <code>nit:</code>.</li>
<li>Tôi đoán trước được <code>main</code> trông thế nào sau merge commit, squash và rebase — và gỡ được một merge commit bằng <code>git revert -m 1</code>.</li>
<li>Tôi biết vì sao <code>git branch -d</code> từ chối sau một lần squash merge, và phải kiểm gì trước khi dùng <code>-D</code>.</li>
<li>Tôi bảo vệ được <code>main</code> bằng ruleset, định tuyến review bằng CODEOWNERS, và giải thích được vì sao một kiểm tra bắt buộc bị bỏ qua lại chặn PR.</li>
</ul>
${slide('git-06', 16, 'Bảng tra nhanh Chương 6')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Your SWP391 cart feature branch contains a Prisma migration, a refactor of the price helper and the cart UI — 900 changed lines. It is Thursday and the demo is next week. What do you do?|||Nhánh tính năng giỏ hàng SWP391 của bạn gồm một migration Prisma, một lần refactor helper tính tiền và giao diện giỏ hàng — 900 dòng thay đổi. Hôm nay thứ Năm, tuần sau demo. Bạn làm gì?',
            options: [
              'Open one PR and request three reviewers so the load is shared|||Mở một PR và mời ba người review để chia tải',
              'Open it as a draft and wait until the whole team has a free afternoon|||Mở dạng nháp và chờ tới khi cả nhóm rảnh một buổi chiều',
              'Split it into three PRs — migration, refactor, feature — and open them in that order|||Chẻ thành ba PR — migration, refactor, tính năng — và mở theo đúng thứ tự đó',
              'Squash the branch into one commit first so the reviewer sees a single change|||Squash cả nhánh thành một commit trước để người review chỉ thấy một thay đổi',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: Reviewer attention does not scale: past a few hundred lines a diff gets skimmed and approved, not reviewed. Three focused PRs are each reviewable in one sitting and can be reverted separately. Three reviewers on one 900-line PR is the tempting answer, but each of them skims the same 900 lines; squashing changes the history, not the size of the diff.|||VI: Sự chú ý của người review không nhân lên theo quy mô: quá vài trăm dòng thì diff chỉ được lướt rồi duyệt, không được review. Ba PR tập trung thì mỗi cái review xong trong một lần ngồi và revert được riêng. Mời ba người cho một PR 900 dòng là phương án hấp dẫn, nhưng cả ba cùng lướt đúng 900 dòng đó; squash đổi lịch sử chứ không đổi kích cỡ diff.',
          },
          {
            question: 'After opening your PR you added a comment under it: "Closes #412". The PR was merged, but issue #412 is still open. Why?|||Sau khi mở PR, bạn viết thêm một bình luận bên dưới: "Closes #412". PR đã được merge, nhưng issue #412 vẫn mở. Vì sao?',
            options: [
              'The keyword only counts in the PR description or a commit message, not in a comment|||Từ khoá chỉ có tác dụng trong phần mô tả PR hoặc lời nhắn commit, không phải trong bình luận',
              'Closing keywords only work for issues in a different repository|||Từ khoá đóng issue chỉ dùng được cho issue ở kho khác',
              'The issue closes only after the PR branch is deleted|||Issue chỉ đóng sau khi nhánh của PR bị xoá',
              'GitHub only recognises "Fixes", not "Closes"|||GitHub chỉ nhận "Fixes", không nhận "Closes"',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: GitHub links and closes issues from the pull request description or from commit messages that reach the default branch; a plain comment is ignored. Edit the description and the link appears under "Development". "Fixes" and "Resolves" are equivalent to "Closes", and cross-repository closing needs owner/repo#412, not a different keyword.|||VI: GitHub liên kết và đóng issue từ phần mô tả pull request hoặc từ lời nhắn commit đi vào nhánh mặc định; bình luận thường bị bỏ qua. Sửa phần mô tả là liên kết hiện ngay ở mục "Development". "Fixes" và "Resolves" tương đương "Closes", còn đóng issue ở kho khác thì cần owner/repo#412, không phải một từ khoá khác.',
          },
          {
            question: 'Reviewing a teammate’s PR you find that a failed payment returns HTTP 200, plus five small naming issues. Which review helps most?|||Review PR của bạn cùng nhóm, bạn thấy một lần thanh toán thất bại vẫn trả HTTP 200, cộng năm chỗ đặt tên nhỏ. Lượt review nào giúp nhiều nhất?',
            options: [
              'Approve and mention the 200 in the group chat so it can be fixed later|||Approve rồi nhắc chuyện 200 trong nhóm chat để sửa sau',
              'Post six single comments right away so the author can start fixing sooner|||Đăng ngay sáu bình luận lẻ để tác giả bắt tay sửa sớm hơn',
              'Request changes and insist all six points are fixed before you will approve|||Request changes và đòi sửa đủ cả sáu điểm mới chịu duyệt',
              'One batched review: Request changes, the 200 marked blocking:, the five names marked nit:|||Một lượt review gom chung: Request changes, lỗi 200 gắn blocking:, năm chỗ đặt tên gắn nit:',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The 200-on-failure is a correctness bug that justifies blocking; the naming issues are optional and should be labelled so. Batching sends one notification instead of six. Demanding all six fixes treats taste as a blocker and teaches the team that every comment is a demand; approving and moving the bug to chat lets it ship.|||VI: Trả 200 khi thất bại là lỗi đúng/sai, đáng để chặn; mấy chỗ đặt tên là tuỳ chọn và phải được gắn nhãn như vậy. Gom lại thì gửi một thông báo thay vì sáu. Đòi sửa đủ sáu điểm là biến gu thẩm mỹ thành rào chặn và dạy cả nhóm rằng bình luận nào cũng là yêu sách; approve rồi dời lỗi sang chat là để lỗi lên production.',
          },
          {
            question: 'Minh clicked "Request changes" on your PR on Friday and then went home to Nghệ An for a week. You fixed everything; main is protected and the PR is still blocked. What is true?|||Minh bấm "Request changes" trên PR của bạn hôm thứ Sáu rồi về quê Nghệ An một tuần. Bạn đã sửa hết; main được bảo vệ và PR vẫn bị chặn. Điều nào đúng?',
            options: [
              'Nobody but Minh can ever unblock it, so the team has to wait a week|||Ngoài Minh không ai gỡ được, nên cả nhóm phải chờ một tuần',
              'Someone with write access can dismiss Minh’s blocking review, with a reason that stays on the PR|||Một người có quyền ghi có thể dismiss (gạt bỏ) lượt review chặn của Minh, kèm lý do nằm lại trên PR',
              'You can approve your own PR to cancel out Minh’s review|||Bạn tự approve PR của mình để triệt tiêu lượt review của Minh',
              'Closing and reopening the PR clears every review|||Đóng rồi mở lại PR là xoá sạch mọi lượt review',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: GitHub’s docs (09/2026): the person who requested changes must approve before merge, but if that reviewer is unavailable, anyone with write permission can dismiss the blocking review — visibly, with a reason. Approving your own PR is impossible: authors cannot approve their own pull requests. Closing and reopening does not reset reviews.|||VI: Theo GitHub Docs (09/2026): người đã request changes phải duyệt thì mới merge được, nhưng nếu người đó vắng mặt thì ai có quyền ghi cũng có thể gạt bỏ lượt review chặn — công khai, kèm lý do. Tự approve PR của mình là không thể: tác giả không được duyệt pull request của chính mình. Đóng rồi mở lại không xoá các lượt review.',
          },
          {
            question: 'Your PR has 4 commits and the title "Fixes". Someone presses "Squash and merge" with the repository’s default settings without editing the text. What lands on main?|||PR của bạn có 4 commit và tiêu đề "Fixes". Ai đó bấm "Squash and merge" với cài đặt mặc định của kho mà không sửa chữ. Cái gì vào main?',
            options: [
              'One commit whose title comes from the PR title "Fixes", with the four commit messages listed in its body|||Một commit có tiêu đề lấy từ tiêu đề PR "Fixes", thân liệt kê lời nhắn của bốn commit',
              'Four commits with new hashes and their original messages|||Bốn commit mang mã băm mới và lời nhắn gốc',
              'One commit titled "Merge pull request #N from …"|||Một commit tiêu đề "Merge pull request #N from …"',
              'One commit titled with the message of the branch’s first commit|||Một commit mang tiêu đề là lời nhắn của commit đầu tiên trên nhánh',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: With two or more commits, GitHub’s default squash message is the PR title plus a list of the commits (Docs, 09/2026) — so "Fixes" becomes permanent history on main. Only a single-commit PR gets that commit’s own message, which is why the "first commit" option is tempting but wrong here. "Merge pull request #N" is the merge-commit button; four new-hash commits is rebase.|||VI: Có từ hai commit trở lên, lời nhắn squash mặc định của GitHub là tiêu đề PR cộng danh sách commit (Docs, 09/2026) — nên "Fixes" thành lịch sử vĩnh viễn trên main. Chỉ PR một commit mới lấy lời nhắn của chính commit đó, vì thế phương án "commit đầu tiên" hấp dẫn nhưng sai ở đây. "Merge pull request #N" là nút merge commit; bốn commit mã băm mới là rebase.',
          },
          {
            question: 'PR #12 was merged with a merge commit 2c143dd and broke production. git revert 2c143dd prints "is a merge but no -m option was given". What do you run?|||PR #12 được merge bằng merge commit 2c143dd và làm hỏng production. git revert 2c143dd in ra "is a merge but no -m option was given". Bạn chạy gì?',
            options: [
              'git reset --hard 2c143dd^ && git push --force origin main',
              'git revert -m 2 2c143dd',
              'git revert -m 1 2c143dd',
              'git branch -D feature/refresh-token && git push origin main',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: A merge commit has two parents, so Git asks which side to keep. -m 1 keeps the first parent (main as it was) and undoes everything the PR brought in, as a new commit that is safe to push. -m 2 would keep the feature side and undo main’s own changes instead. reset + force-push rewrites shared history and is blocked on a protected main anyway; deleting the branch changes nothing on main.|||VI: Merge commit có hai cha, nên Git hỏi giữ phía nào. -m 1 giữ cha thứ nhất (main như trước) và gỡ mọi thứ PR mang vào, bằng một commit mới push an toàn. -m 2 lại giữ phía feature và gỡ chính thay đổi của main. reset + force-push viết lại lịch sử chung và dù sao cũng bị chặn trên main được bảo vệ; xoá nhánh thì chẳng đổi gì trên main.',
          },
          {
            question: 'Your PR was squash-merged and GitHub deleted the branch. After git pull and git fetch --prune, git branch -d feature/cart says "not fully merged". What is going on?|||PR của bạn được squash-merge và GitHub đã xoá nhánh. Sau git pull và git fetch --prune, git branch -d feature/cart báo "not fully merged". Chuyện gì đang xảy ra?',
            options: [
              'GitHub did not really merge the PR, so it must be reopened|||GitHub chưa thật sự merge PR, nên phải mở lại',
              'The local branch is corrupted and the repository should be cloned again|||Nhánh ở máy bị hỏng và nên clone lại kho',
              'Running git pull --rebase first will make git branch -d succeed|||Chạy git pull --rebase trước thì git branch -d sẽ chạy được',
              'The squash commit on main is new, so your commits are in no branch; confirm "Merged" then use -D|||Commit squash trên main là commit mới, nên commit của bạn không nằm trên nhánh nào; kiểm "Merged" rồi dùng -D',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: -d deletes only branches whose commits are reachable from HEAD or their upstream. Squash created a brand-new commit on main, and the upstream was pruned, so Git correctly reports the branch’s original commits as unmerged. It is normal in a squash team: check the PR shows Merged, then git branch -D. Re-cloning or pulling again does not change the fact that those commits were never merged as-is.|||VI: -d chỉ xoá nhánh mà commit của nó tới được từ HEAD hoặc từ upstream. Squash tạo một commit hoàn toàn mới trên main, còn upstream đã bị prune, nên Git báo đúng là các commit gốc của nhánh chưa được merge. Chuyện bình thường trong nhóm dùng squash: kiểm PR hiện Merged rồi git branch -D. Clone lại hay pull thêm không đổi được sự thật là các commit đó chưa bao giờ được merge nguyên dạng.',
          },
          {
            question: 'Your team uses "Rebase and merge". git bisect stops on a "wip" commit on main that does not even compile. Why could that happen?|||Nhóm bạn dùng "Rebase and merge". git bisect dừng ở một commit "wip" trên main mà còn không biên dịch được. Vì sao chuyện đó có thể xảy ra?',
            options: [
              'git bisect does not work on a linear history|||git bisect không chạy được trên lịch sử tuyến tính',
              'CI only tested the tip of the branch; the intermediate commits landed on main untested in that position|||CI chỉ kiểm đầu nhánh; các commit trung gian đáp xuống main mà chưa từng được kiểm ở vị trí đó',
              'Rebase and merge deletes the CI results of the replayed commits|||Rebase and merge xoá kết quả CI của các commit được phát lại',
              'The new hash corrupted the contents of the wip commit|||Mã băm mới làm hỏng nội dung của commit wip',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Rebase-and-merge keeps every commit, including un-curated "wip" ones, and none of them except the tip was ever built by CI on top of that main. Bisect works perfectly on linear history — it just meets a commit that is broken for an unrelated reason. A new hash never changes content: it is computed from the content. Squash, or cleaning the branch with rebase -i before merging, avoids this.|||VI: Rebase-and-merge giữ mọi commit, kể cả "wip" chưa được dọn, và ngoài commit đầu nhánh ra thì chưa cái nào được CI dựng trên đúng main đó. Bisect chạy rất tốt trên lịch sử tuyến tính — nó chỉ gặp một commit hỏng vì lý do không liên quan. Mã băm mới không bao giờ đổi nội dung: nó được tính từ nội dung. Squash, hoặc dọn nhánh bằng rebase -i trước khi merge, tránh được chuyện này.',
          },
          {
            question: 'The required check "Lint & Type Check" runs only on paths: [src/**]. A PR that only edits README.md shows that check waiting forever and cannot merge. What is the fix?|||Kiểm tra bắt buộc "Lint & Type Check" chỉ chạy với paths: [src/**]. Một PR chỉ sửa README.md thấy kiểm tra đó chờ mãi và không merge được. Sửa thế nào?',
            options: [
              'Remove the path filter, or make sure a job with that exact name always reports for skipped paths|||Bỏ bộ lọc đường dẫn, hoặc bảo đảm luôn có một job đúng tên đó báo kết quả cho các đường dẫn bị bỏ qua',
              'Nothing — GitHub treats skipped workflows as passed, so the block must be something else|||Không cần gì — GitHub coi workflow bị bỏ qua là đã qua, nên chặn là do thứ khác',
              'Press "Re-run jobs" until the check appears|||Bấm "Re-run jobs" tới khi kiểm tra hiện ra',
              'Rename the check in the ruleset to "Lint & Type Check (skipped)"|||Đổi tên kiểm tra trong ruleset thành "Lint & Type Check (skipped)"',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: GitHub Docs (09/2026): a workflow skipped by a path filter leaves its checks Pending, and a required Pending check blocks merging. The tempting "skipped counts as passed" is true only for a job skipped by an if: condition, which reports Success — not for a workflow that never started. Re-running cannot start a workflow that the filter excludes, and a renamed requirement waits for a check nobody reports.|||VI: GitHub Docs (09/2026): workflow bị bộ lọc đường dẫn bỏ qua sẽ để kiểm tra của nó ở trạng thái Pending, và một kiểm tra bắt buộc đang Pending thì chặn merge. Câu hấp dẫn "bỏ qua coi như qua" chỉ đúng với một job bị bỏ qua vì điều kiện if:, nó báo Success — không đúng với workflow chưa từng khởi động. Chạy lại không khởi động được workflow mà bộ lọc đã loại, còn đổi tên yêu cầu thì lại chờ một kiểm tra không ai báo.',
          },
          {
            question: 'CODEOWNERS has "* @cuong" on one line and "/src/auth.ts @minh" on a later line; "Require review from Code Owners" is on. A PR changes only src/auth.ts. Whose approval is required?|||CODEOWNERS có dòng "* @cuong" và, ở một dòng phía dưới, "/src/auth.ts @minh"; luật "Require review from Code Owners" đang bật. Một PR chỉ sửa src/auth.ts. Cần lượt duyệt của ai?',
            options: [
              'Both @cuong and @minh, because both lines match|||Cả @cuong và @minh, vì cả hai dòng đều khớp',
              'Either @cuong or @minh — whoever reviews first|||@cuong hoặc @minh — ai review trước cũng được',
              '@minh only, because the last matching line wins|||Chỉ @minh, vì dòng khớp cuối cùng thắng',
              '@cuong only, because * appears first in the file|||Chỉ @cuong, vì * đứng đầu file',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: CODEOWNERS follows gitignore-like precedence: the last matching pattern decides the owners of a file, and the earlier matches are ignored for it. So src/auth.ts belongs to @minh alone, and without his approval the PR cannot merge. "First line wins" and "all matches combine" are the two natural guesses and both are wrong — which is why broad defaults go at the top and specific paths below.|||VI: CODEOWNERS theo thứ tự ưu tiên kiểu gitignore: mẫu khớp cuối cùng quyết định chủ của một file, các dòng khớp trước đó bị bỏ qua với file ấy. Nên src/auth.ts chỉ thuộc về @minh, và thiếu lượt duyệt của Minh thì PR không merge được. "Dòng đầu thắng" và "mọi dòng khớp cộng dồn" là hai cách đoán tự nhiên và đều sai — vì thế dòng mặc định rộng đặt trên cùng, đường dẫn cụ thể đặt bên dưới.',
          },
        ],
      },
    },
  ],
};
