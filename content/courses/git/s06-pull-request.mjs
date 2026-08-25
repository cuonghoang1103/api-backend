/**
 * Git & GitHub — Chương 6: Pull request & code review.
 * Giải phẫu một PR review được · cho và nhận phản hồi · ba chiến lược merge ·
 * nhánh bảo vệ + CODEOWNERS + kiểm tra bắt buộc · PR nháp, PR xếp chồng, giữ PR nhỏ.
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 6 — Pull requests & code review|||Chương 6 — Pull request & code review',
  description: 'Một pull request là đơn vị công việc thật của một nhóm phần mềm. Chương này nói về thứ làm một PR review được, cách cho và nhận phản hồi mà không làm hỏng quan hệ, ba chiến lược merge và hệ quả lâu dài của chúng, các luật bảo vệ nhánh, và vì sao PR nhỏ được merge còn PR lớn thì nằm chờ.',
  lessons: [
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
<div class="callout ok">The single highest-leverage habit in this whole chapter: <strong>split the work before you start writing it</strong>, not after. A refactor and the feature that needed it are two pull requests. A migration and the code that uses it are two pull requests. Each one is reviewable; the combination is not.</div>

<h3>What goes in the description</h3>
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
<pre><code><span class="tok-comment"># Open as a draft to get CI running and share direction early:</span>
gh pr create --draft --title <span class="tok-string">"fix(auth): reject expired refresh tokens"</span> --body-file .github/pr.md</code></pre>
<p>A draft cannot be merged and does not request review, but CI runs and colleagues can comment. It is the honest way to say "this is the direction, tell me now if it is wrong" without consuming a reviewer's full attention on unfinished code.</p>

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
<div class="callout ok">Thói quen có đòn bẩy lớn nhất cả chương này: <strong>chẻ công việc TRƯỚC khi bắt đầu viết</strong>, không phải sau. Một lần refactor và cái tính năng cần nó là hai pull request. Một migration và phần mã dùng nó là hai pull request. Mỗi cái review được; cái ghép lại thì không.</div>

<h3>Trong phần mô tả có gì</h3>
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
<pre><code><span class="tok-comment"># Mở ở dạng nháp để CI chạy và chia sẻ hướng đi sớm:</span>
gh pr create --draft --title <span class="tok-string">"fix(auth): tu choi refresh token het han"</span> --body-file .github/pr.md</code></pre>
<p>Một bản nháp không merge được và không yêu cầu review, nhưng CI vẫn chạy và đồng nghiệp vẫn bình luận được. Đó là cách trung thực để nói "đây là hướng đi, hãy nói ngay nếu nó sai" mà không ngốn trọn sự chú ý của người review cho phần mã chưa xong.</p>

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
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Comment</span><span class="lz-v">Feedback with no verdict. For questions, or when you looked at part of it and are not the decision-maker.</span></div>
  <div class="lz-layer"><span class="lz-k">Approve</span><span class="lz-v">"I am comfortable with this shipping." Nits can accompany an approval — say they are optional and let the author decide.</span></div>
  <div class="lz-layer"><span class="lz-k">Request changes</span><span class="lz-v">"Something here must change before this merges." Blocks the merge under branch protection. Reserve it for correctness, security and data loss — not for taste.</span></div>
</div>
<div class="callout warn">"Request changes" is a block, and on a protected branch it stays a block until <em>you</em> re-review. Use it when you mean it, then come back promptly — a forgotten "request changes" from someone on holiday is a classic way for work to sit dead for a week.</div>

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
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Comment</span><span class="lz-v">Phản hồi không kèm phán quyết. Dành cho câu hỏi, hoặc khi bạn chỉ xem một phần và không phải người quyết định.</span></div>
  <div class="lz-layer"><span class="lz-k">Approve</span><span class="lz-v">"Tôi thấy yên tâm khi cái này lên production." Vẫn kèm được các nhận xét vặt — hãy nói rõ là tuỳ chọn và để tác giả quyết.</span></div>
  <div class="lz-layer"><span class="lz-k">Request changes</span><span class="lz-v">"Có thứ ở đây PHẢI đổi trước khi merge." Chặn việc merge dưới luật bảo vệ nhánh. Hãy dành nó cho tính đúng đắn, bảo mật và mất dữ liệu — không dành cho gu thẩm mỹ.</span></div>
</div>
<div class="callout warn">"Request changes" là một cái chốt chặn, và trên nhánh được bảo vệ nó chặn cho tới khi <em>chính bạn</em> review lại. Hãy dùng khi bạn thật sự có ý đó, rồi quay lại sớm — một cái "request changes" bị quên của người đang đi nghỉ là cách kinh điển để một phần việc nằm chết cả tuần.</div>

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
<div class="out">* 8c4f2a1 (main) fix(auth): reject expired refresh tokens (#431)
* 7b3e9d1 refactor(api): extract pagination</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Keeps</span><span class="v">The changes, as a single commit. The PR title becomes the message, the branch's individual commits do not survive on main.</span></div>
  <div class="kv"><span class="k">Good for</span><span class="v">A clean linear main where one commit = one reviewed change. <code>git bisect</code> is at its best: every commit on main passed CI as a unit.</span></div>
  <div class="kv"><span class="k">Costs</span><span class="v">Intermediate commits are gone. A 900-line PR becomes one 900-line commit, which <code>blame</code> and <code>bisect</code> cannot narrow further.</span></div>
</div>
<div class="callout warn">Squash makes the <strong>pull request title</strong> the permanent commit message on main. "Fixes" and "update stuff" become your history. If your team squashes, enforce Conventional Commits (1.4) on PR titles — a CI check for the pattern takes ten lines and pays for itself.</div>

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

<h3>Choosing</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Squash — the default for most teams</span><span class="lz-v">Simple mental model: one PR, one commit, one revert. Contributors do not need to curate history. Choose this unless you have a reason not to.</span></div>
  <div class="lz-layer"><span class="lz-k">Merge commit — larger teams, long-lived branches</span><span class="lz-v">When the real history matters, when release branches exist, or when a feature is genuinely a series of related changes worth preserving.</span></div>
  <div class="lz-layer"><span class="lz-k">Rebase — disciplined teams only</span><span class="lz-v">Works well where everyone rebases and cleans their branch before review. Fragile with mixed skill levels.</span></div>
</div>
<p>Whichever you pick, <strong>pick one and turn the others off</strong> in Settings → General → Pull Requests. A repository where the three are mixed has a history that is hard to read and hard to script against.</p>

<h3>The lifecycle around the merge</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">CI green + approved</div><div class="lz-d">Branch protection enforces both (6.4).</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Update the branch</div><div class="lz-d">"Update branch" on GitHub, or <code>git rebase origin/main</code> — so CI runs against what will actually be on main.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Merge</div><div class="lz-d">Your team's one strategy. Check the auto-generated message before confirming.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Delete the branch</div><div class="lz-d">GitHub offers a button; turn on automatic deletion in settings.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Clean up locally</div><div class="lz-d"><code>git switch main &amp;&amp; git pull &amp;&amp; git fetch --prune &amp;&amp; git branch -d feature/login</code></div></div>
</div>

<h3>Auto-merge</h3>
<pre><code>gh pr merge 431 --squash --auto --delete-branch</code></pre>
<p>Queues the merge to happen the moment every required check passes and every required approval is in. Useful for a small PR approved while CI is still running — instead of coming back in six minutes, it merges itself.</p>

<h3>Merge queues, for busy repositories</h3>
<p>On a repository where several PRs merge per hour, "CI was green" can be a lie: it was green against a <code>main</code> that has since moved. A merge queue re-tests each PR against the <em>real</em> upcoming main, in order, and merges only if it still passes. It is the standard cure for "main was broken by two PRs that were each fine alone" — a semantic conflict (3.2) at the repository level.</p>

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
<div class="out">* 8c4f2a1 (main) fix(auth): reject expired refresh tokens (#431)
* 7b3e9d1 refactor(api): extract pagination</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Giữ lại</span><span class="v">Các thay đổi, gộp thành một commit duy nhất. Tiêu đề PR trở thành lời nhắn, còn các commit riêng lẻ của nhánh không sống sót trên main.</span></div>
  <div class="kv"><span class="k">Tốt cho</span><span class="v">Một main tuyến tính sạch sẽ, một commit = một thay đổi đã được review. <code>git bisect</code> đạt trạng thái tốt nhất: mọi commit trên main đều đã qua CI như một khối.</span></div>
  <div class="kv"><span class="k">Cái giá</span><span class="v">Các commit trung gian biến mất. Một PR 900 dòng thành một commit 900 dòng, mà <code>blame</code> và <code>bisect</code> không thu hẹp thêm được nữa.</span></div>
</div>
<div class="callout warn">Squash biến <strong>tiêu đề pull request</strong> thành lời nhắn commit vĩnh viễn trên main. "Sửa lỗi" và "cập nhật linh tinh" sẽ trở thành lịch sử của bạn. Nếu nhóm bạn dùng squash, hãy ép Conventional Commits (bài 1.4) lên tiêu đề PR — một phép kiểm CI cho cái mẫu đó dài mười dòng và tự trả công cho nó.</div>

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

<h3>Chọn cái nào</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Squash — mặc định cho đa số nhóm</span><span class="lz-v">Mô hình tư duy đơn giản: một PR, một commit, một lần revert. Người đóng góp không cần chăm chút lịch sử. Hãy chọn cái này trừ khi có lý do để không chọn.</span></div>
  <div class="lz-layer"><span class="lz-k">Merge commit — nhóm lớn, nhánh sống lâu</span><span class="lz-v">Khi lịch sử thật sự quan trọng, khi có nhánh phát hành, hoặc khi một tính năng thật sự là một chuỗi thay đổi liên quan đáng được giữ lại.</span></div>
  <div class="lz-layer"><span class="lz-k">Rebase — chỉ dành cho nhóm kỷ luật</span><span class="lz-v">Chạy tốt ở nơi ai cũng rebase và dọn nhánh của mình trước khi review. Rất mong manh khi trình độ trong nhóm chênh lệch.</span></div>
</div>
<p>Chọn cái nào cũng được, nhưng <strong>hãy chọn MỘT và tắt hai cái kia</strong> trong Settings → General → Pull Requests. Một kho mà cả ba bị trộn lẫn thì có một lịch sử khó đọc và khó viết script để xử lý.</p>

<h3>Vòng đời quanh lần merge</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">CI xanh + đã được duyệt</div><div class="lz-d">Luật bảo vệ nhánh ép cả hai (bài 6.4).</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Cập nhật nhánh</div><div class="lz-d">Nút "Update branch" trên GitHub, hoặc <code>git rebase origin/main</code> — để CI chạy trên đúng thứ sẽ nằm trên main.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Merge</div><div class="lz-d">Đúng một chiến lược của nhóm bạn. Hãy đọc lời nhắn tự sinh trước khi xác nhận.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Xoá nhánh</div><div class="lz-d">GitHub có sẵn một cái nút; hãy bật xoá tự động trong phần cài đặt.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Dọn ở máy mình</div><div class="lz-d"><code>git switch main &amp;&amp; git pull &amp;&amp; git fetch --prune &amp;&amp; git branch -d feature/login</code></div></div>
</div>

<h3>Auto-merge</h3>
<pre><code>gh pr merge 431 --squash --auto --delete-branch</code></pre>
<p>Xếp hàng để merge ngay khoảnh khắc mọi kiểm tra bắt buộc qua và mọi lượt duyệt bắt buộc đã có. Hữu ích cho một PR nhỏ được duyệt trong lúc CI còn đang chạy — thay vì quay lại sau sáu phút, nó tự merge.</p>

<h3>Hàng đợi merge, cho kho mã bận rộn</h3>
<p>Trên một kho có vài PR merge mỗi giờ, câu "CI đã xanh" có thể là một lời nói dối: nó xanh trên một <code>main</code> mà từ đó tới giờ đã đi tiếp. Một hàng đợi merge kiểm lại từng PR trên <em>main sắp tới thật sự</em>, theo thứ tự, và chỉ merge nếu nó vẫn qua. Đó là phương thuốc chuẩn cho chuyện "main hỏng vì hai PR mà tách riêng cái nào cũng ổn" — một xung đột ngữ nghĩa (bài 3.2) ở cấp kho mã.</p>

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

<h3>What a protected push looks like</h3>
<pre><code>git push origin main</code></pre>
<div class="out">remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: Changes must be made through a pull request.
 ! [remote rejected] main -&gt; main (protected branch hook declined)</div>
<p>Nothing broke. Make a branch, push that, open a pull request — which is what you meant to do.</p>

<h3>CODEOWNERS — routing review automatically</h3>
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

<h3>Required status checks</h3>
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

<h3>Rules that cost more than they give</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Requiring 3+ approvals</span><span class="v">On a team of four this means everyone reviews everything. Approvals become rubber stamps, which is worse than one careful review.</span></div>
  <div class="kv"><span class="k">Requiring signed commits everywhere</span><span class="v">Good for a release branch; on every branch it blocks contributors whose setup is not ready and produces confusing rejections (12.4).</span></div>
  <div class="kv"><span class="k">Requiring linear history and merge commits</span><span class="v">Contradictory. Pick one merge strategy (6.3) and configure the protection to match it.</span></div>
  <div class="kv"><span class="k">Including administrators, with no break-glass</span><span class="v">Correct in principle, but have a documented emergency path — a temporary rule change with an audit-log entry beats someone inventing one at 2 a.m.</span></div>
</div>

<h3>Rulesets — the newer mechanism</h3>
<p>GitHub Rulesets do what branch protection does, plus: they apply to several branches or tags by pattern, several rulesets can layer, they can be set organisation-wide, and they have an <strong>evaluate</strong> mode that logs what <em>would</em> have been blocked without blocking it. That last one is how you roll out a strict rule on a busy repository without stopping work on day one.</p>

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

<h3>Một lần push bị chặn trông thế nào</h3>
<pre><code>git push origin main</code></pre>
<div class="out">remote: error: GH006: Protected branch update failed for refs/heads/main.
remote: error: Changes must be made through a pull request.
 ! [remote rejected] main -&gt; main (protected branch hook declined)</div>
<p>Không có gì hỏng cả. Hãy tạo một nhánh, push nhánh đó, mở một pull request — đúng thứ bạn định làm.</p>

<h3>CODEOWNERS — tự động định tuyến việc review</h3>
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

<h3>Kiểm tra trạng thái bắt buộc</h3>
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

<h3>Những luật tốn nhiều hơn cho lại</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bắt buộc 3+ lượt duyệt</span><span class="v">Trong một nhóm bốn người thì nghĩa là ai cũng review mọi thứ. Lượt duyệt thành con dấu cao su, còn tệ hơn một lượt review cẩn thận.</span></div>
  <div class="kv"><span class="k">Bắt buộc ký commit ở khắp nơi</span><span class="v">Tốt cho một nhánh phát hành; áp lên mọi nhánh thì nó chặn những người đóng góp chưa cài xong và sinh ra những lời từ chối khó hiểu (bài 12.4).</span></div>
  <div class="kv"><span class="k">Bắt buộc lịch sử tuyến tính VÀ commit hợp nhất</span><span class="v">Mâu thuẫn với nhau. Hãy chọn một chiến lược merge (bài 6.3) và cấu hình bảo vệ cho khớp với nó.</span></div>
  <div class="kv"><span class="k">Áp cả cho quản trị viên mà không có cửa thoát hiểm</span><span class="v">Đúng về nguyên tắc, nhưng phải có một đường khẩn cấp được ghi lại — một lần đổi luật tạm thời có dòng trong nhật ký kiểm toán vẫn hơn việc ai đó tự nghĩ ra một đường lúc 2 giờ sáng.</span></div>
</div>

<h3>Ruleset — cơ chế đời mới</h3>
<p>GitHub Ruleset làm được mọi thứ bảo vệ nhánh làm, cộng thêm: áp cho nhiều nhánh hoặc tag theo mẫu, nhiều ruleset xếp chồng lên nhau, đặt được ở cấp tổ chức, và có chế độ <strong>evaluate</strong> ghi lại thứ <em>lẽ ra</em> đã bị chặn mà không thật sự chặn. Cái cuối cùng chính là cách bạn triển khai một luật nghiêm ngặt trên một kho bận rộn mà không làm mọi người ngừng việc ngay ngày đầu.</p>

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
      description: 'Tám câu về kích thước PR, mô tả và từ khoá đóng issue, ba loại verdict review, nhãn nit/blocking, ba chiến lược merge và hệ quả, CODEOWNERS và kiểm tra bắt buộc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on pull requests and review. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: what squash-merge does to the PR title (6.3), and why a required check that never runs blocks a PR forever (6.4).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về pull request và review. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: squash-merge làm gì với tiêu đề PR (bài 6.3), và vì sao một kiểm tra bắt buộc không bao giờ chạy sẽ chặn PR mãi mãi (bài 6.4).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why do very large pull requests get worse reviews?|||Vì sao pull request rất lớn lại được review tệ hơn?',
            options: [
              'GitHub truncates the diff|||GitHub cắt cụt bản diff',
              'Reviewer attention does not scale — past a few hundred lines, defects found per line drops and "LGTM" replaces real review|||Sự chú ý của người review không nhân lên theo quy mô — quá vài trăm dòng, số khiếm khuyết tìm ra trên mỗi dòng tụt xuống và "LGTM" thay cho review thật',
              'Large PRs cannot be merged with squash|||PR lớn không merge bằng squash được',
              'CI times out on large diffs|||CI hết giờ với diff lớn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Where must "Closes #412" appear to actually close the issue on merge?|||"Closes #412" phải nằm ở đâu để thật sự đóng issue khi merge?',
            options: [
              'Anywhere, including a review comment|||Ở đâu cũng được, kể cả một bình luận review',
              'In the pull request DESCRIPTION or a commit message — a plain comment does not count|||Trong PHẦN MÔ TẢ của pull request hoặc trong một lời nhắn commit — một bình luận thường không tính',
              'Only in the branch name|||Chỉ trong tên nhánh',
              'Only in the PR title|||Chỉ trong tiêu đề PR',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does the "nit:" prefix accomplish in a review comment?|||Tiền tố "nit:" trong một bình luận review đạt được điều gì?',
            options: [
              'It hides the comment from other reviewers|||Nó giấu bình luận khỏi những người review khác',
              'It marks the comment as optional, so it does not read as a demand and does not block the merge|||Nó đánh dấu bình luận là tuỳ chọn, nên nó không đọc lên như một yêu sách và không chặn việc merge',
              'It automatically applies the change|||Nó tự động áp thay đổi',
              'It converts the comment into a GitHub suggestion|||Nó biến bình luận thành một suggestion của GitHub',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Under "Squash and merge", what becomes the commit message on main?|||Với "Squash and merge", cái gì trở thành lời nhắn commit trên main?',
            options: [
              'The first commit message of the branch|||Lời nhắn của commit đầu tiên trên nhánh',
              'The pull request TITLE — which is why PR titles need the same care as commit messages|||TIÊU ĐỀ của pull request — và vì thế tiêu đề PR cần được chăm chút như lời nhắn commit',
              'All the branch messages concatenated|||Mọi lời nhắn của nhánh nối lại',
              'An auto-generated "Merge pull request #N"|||Một dòng tự sinh "Merge pull request #N"',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What is the risk of "Rebase and merge" for git bisect?|||Rủi ro của "Rebase and merge" với git bisect là gì?',
            options: [
              'Bisect cannot run on a linear history|||Bisect không chạy được trên lịch sử tuyến tính',
              'Intermediate commits land on main having never been tested in that position, so bisect can stop at a commit that fails for an unrelated reason|||Các commit trung gian đáp xuống main mà chưa từng được kiểm ở vị trí đó, nên bisect có thể dừng ở một commit hỏng vì lý do không liên quan',
              'Rebase deletes the commit messages|||Rebase xoá mất lời nhắn commit',
              'There is no risk|||Không có rủi ro nào',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why enable "Dismiss stale approvals when new commits are pushed"?|||Vì sao nên bật "Huỷ duyệt cũ khi có commit mới được push"?',
            options: [
              'It speeds up CI|||Nó làm CI nhanh hơn',
              'An approval covers only the code that was reviewed — without it, an author can approve-then-push anything|||Một lượt duyệt chỉ bao phủ phần mã đã được review — thiếu nó, tác giả có thể duyệt-rồi-push bất cứ thứ gì',
              'It is required for CODEOWNERS to work|||Nó là điều kiện để CODEOWNERS chạy được',
              'It prevents force pushes|||Nó ngăn force push',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In CODEOWNERS, which rule wins when several match a file?|||Trong CODEOWNERS, luật nào thắng khi nhiều luật cùng khớp một file?',
            options: [
              'The first matching rule|||Luật khớp đầu tiên',
              'The LAST matching rule, like .gitignore|||Luật khớp CUỐI CÙNG, giống .gitignore',
              'The most specific path|||Đường dẫn cụ thể nhất',
              'All of them combine|||Tất cả cộng dồn lại',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A required status check has a path filter and the PR only touches docs. What happens?|||Một kiểm tra bắt buộc có bộ lọc đường dẫn và PR chỉ chạm vào tài liệu. Chuyện gì xảy ra?',
            options: [
              'GitHub treats it as passed|||GitHub coi như đã qua',
              'The check never runs, so GitHub waits for a report that never arrives and the PR is blocked forever|||Kiểm tra đó không bao giờ chạy, nên GitHub chờ một báo cáo không bao giờ tới và PR bị chặn mãi mãi',
              'The check runs anyway|||Kiểm tra vẫn chạy',
              'The protection rule is skipped automatically|||Luật bảo vệ tự động bị bỏ qua',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
