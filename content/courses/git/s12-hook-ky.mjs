/**
 * Git & GitHub — Chương 12: Hook, ký commit & tự động hoá.
 * Hook phía client + husky/lint-staged · ký commit (SSH/GPG) + chính sách phía máy chủ · quiz.
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out đóng bằng </div> (KHÔNG </code></pre>). KHÔNG dùng <svg>.
 */
const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 12 — Hooks, signing & automation|||Chương 12 — Hook, ký commit & tự động hoá',
  description: 'Git chạy được script của bạn ở những thời điểm định sẵn: trước khi commit, trước khi push, sau khi merge. Chương này dùng chúng để chặn lỗi trước khi chúng tồn tại, và nói về việc ký commit — thứ duy nhất chứng minh một commit đúng là do bạn tạo ra.',
  lessons: [
    /* ─────────────────────────── 12.1 ─────────────────────────── */
    {
      title: '12.1 — Hooks: catching mistakes before they exist|||12.1 — Hook: bắt lỗi trước khi nó tồn tại',
      slug: 'git-12-1-hooks',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Các hook đáng dùng, vì sao .git/hooks KHÔNG được chia sẻ, husky + lint-staged để cả nhóm cùng có, và luật giữ hook nhanh — cộng cách bỏ qua khi cần.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>Scripts Git runs for you</h2>
<p class="lead">A hook is an executable file in <code>.git/hooks/</code> that Git runs at a defined moment. If it exits non-zero, the operation is refused. That single mechanism is how a leaked secret, a broken build or a malformed commit message gets stopped at the cheapest possible moment — before the commit exists.</p>

<pre><code>ls .git/hooks/</code></pre>
<div class="out">applypatch-msg.sample     pre-commit.sample      pre-push.sample
commit-msg.sample         pre-rebase.sample      prepare-commit-msg.sample
post-update.sample        pre-receive.sample     update.sample</div>
<div class="callout warn">Every one ends in <code>.sample</code> and is therefore inert. A hook activates when the file has the exact hook name and the executable bit: <code>mv pre-commit.sample pre-commit &amp;&amp; chmod +x pre-commit</code>. Forgetting <code>chmod +x</code> is the most common reason a hook "does nothing" with no error at all.</div>

<h3>The hooks worth knowing</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">pre-commit</span><span class="lz-v">Before the commit is created. Lint, format, run fast tests, scan for secrets. Non-zero → the commit is refused.</span></div>
  <div class="lz-layer"><span class="lz-k">commit-msg</span><span class="lz-v">Receives the message file. Enforce Conventional Commits (1.4) or an issue reference.</span></div>
  <div class="lz-layer"><span class="lz-k">prepare-commit-msg</span><span class="lz-v">Pre-fill the message — e.g. insert the issue number parsed from the branch name.</span></div>
  <div class="lz-layer"><span class="lz-k">pre-push</span><span class="lz-v">Before anything is sent. The right place for slower checks: the full test suite, a type check.</span></div>
  <div class="lz-layer"><span class="lz-k">post-merge / post-checkout</span><span class="lz-v">After the working tree changes. Useful to run <code>npm install</code> when the lockfile moved.</span></div>
  <div class="lz-layer"><span class="lz-k">pre-receive / update</span><span class="lz-v">Server-side, on the remote. The only hooks nobody can skip — but you need control of the Git server to install them.</span></div>
</div>

<h3>A pre-commit hook that stops the worst mistake</h3>
<pre><code><span class="tok-comment">#!/usr/bin/env bash</span>
<span class="tok-comment"># .git/hooks/pre-commit — refuse obvious secrets and leftover markers</span>
<span class="tok-keyword">set</span> -euo pipefail

<span class="tok-comment"># Only what is STAGED — not the whole working tree.</span>
files=\$(git diff --cached --name-only --diff-filter=ACM)
[ -z <span class="tok-string">"\$files"</span> ] &amp;&amp; <span class="tok-keyword">exit</span> 0

<span class="tok-keyword">if</span> git diff --cached | grep -nE <span class="tok-string">'(sk_live_|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY)'</span>; <span class="tok-keyword">then</span>
  <span class="tok-keyword">echo</span> <span class="tok-string">"✋ Possible secret in the staged diff. Commit refused."</span>
  <span class="tok-keyword">exit</span> 1
<span class="tok-keyword">fi</span>

<span class="tok-keyword">if</span> git diff --cached --check; <span class="tok-keyword">then</span> :; <span class="tok-keyword">else</span>
  <span class="tok-keyword">echo</span> <span class="tok-string">"✋ Whitespace errors or leftover conflict markers."</span>
  <span class="tok-keyword">exit</span> 1
<span class="tok-keyword">fi</span></code></pre>
<div class="callout ok">Two details make this hook correct rather than annoying. It checks <code>--cached</code>, so it judges what you are actually committing rather than unrelated edits in your tree. And <code>git diff --cached --check</code> is a built-in that reports leftover conflict markers (3.3) and trailing whitespace — one command instead of a regex you would get wrong.</div>

<h3>The problem: .git/hooks is not shared</h3>
<p><code>.git/</code> is not part of the repository, so hooks are never cloned. Your colleague has none, and a rule only you enforce is not a rule. Two fixes:</p>
<pre><code><span class="tok-comment"># A. Commit a hooks directory and point Git at it (Git 2.9+):</span>
mkdir -p .githooks &amp;&amp; mv .git/hooks/pre-commit .githooks/
chmod +x .githooks/pre-commit
git add .githooks &amp;&amp; git commit -m <span class="tok-string">"chore: add shared git hooks"</span>
git config core.hooksPath .githooks</code></pre>
<p>The commands are committed; the <code>core.hooksPath</code> setting still has to be run once per clone. Put it in your <code>npm run prepare</code> or a setup script so it happens automatically.</p>

<h3>B. husky + lint-staged, the Node ecosystem answer</h3>
<pre><code>npm install --save-dev husky lint-staged
npx husky init                      <span class="tok-comment"># creates .husky/ and adds "prepare": "husky"</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"npx lint-staged"</span> &gt; .husky/pre-commit</code></pre>
<pre><code><span class="tok-comment">// package.json</span>
{
  <span class="tok-string">"scripts"</span>: { <span class="tok-string">"prepare"</span>: <span class="tok-string">"husky"</span> },
  <span class="tok-string">"lint-staged"</span>: {
    <span class="tok-string">"*.{ts,tsx}"</span>: [<span class="tok-string">"eslint --fix"</span>, <span class="tok-string">"prettier --write"</span>],
    <span class="tok-string">"*.{json,md,yml}"</span>: [<span class="tok-string">"prettier --write"</span>]
  }
}</code></pre>
<p><code>prepare</code> runs automatically after <code>npm install</code>, so a new clone installs the hooks with no extra step. <strong>lint-staged</strong> is the important half: it runs the tools on <em>only the staged files</em> and re-stages what they fix. Linting the whole project on every commit is how a pre-commit hook goes from two seconds to ninety and gets bypassed forever after.</p>

<h3>commit-msg: enforcing the convention</h3>
<pre><code>npm install --save-dev @commitlint/{cli,config-conventional}
<span class="tok-keyword">echo</span> <span class="tok-string">"export default { extends: ['@commitlint/config-conventional'] };"</span> &gt; commitlint.config.mjs
<span class="tok-keyword">echo</span> <span class="tok-string">'npx commitlint --edit \$1'</span> &gt; .husky/commit-msg</code></pre>
<pre><code>git commit -m <span class="tok-string">"updated stuff"</span></code></pre>
<div class="out">⧗   input: updated stuff
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
✖   found 2 problems, 0 warnings</div>
<p>Refused at the moment it costs nothing to fix. This is what makes the automated changelog and version calculation of 7.3 reliable rather than aspirational.</p>

<h3>pre-push: the slower gate</h3>
<pre><code><span class="tok-comment">#!/usr/bin/env bash</span>
<span class="tok-comment"># .husky/pre-push — the checks too slow for every commit</span>
npx tsc --noEmit || <span class="tok-keyword">exit</span> 1
npm test -- --run --silent || <span class="tok-keyword">exit</span> 1</code></pre>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">pre-commit</div><div class="lz-t">Under 2 seconds</div><div class="lz-d">Format and lint the staged files. Scan for secrets.</div></div>
  <div class="lz-step"><div class="lz-k">pre-push</div><div class="lz-t">Under 60 seconds</div><div class="lz-d">Type check and unit tests. You push far less often than you commit.</div></div>
  <div class="lz-step"><div class="lz-k">CI</div><div class="lz-t">Minutes, and unskippable</div><div class="lz-d">Everything: matrix, integration, e2e, security scanning (11.2).</div></div>
</div>
<div class="callout warn">Hooks are a convenience, never a control. Anyone can pass <code>--no-verify</code>, and a fresh clone without <code>npm install</code> has no hooks at all. Anything that <em>must</em> hold belongs in CI plus branch protection (6.4). Hooks make the right thing fast; CI makes it mandatory.</div>

<h3>Skipping, deliberately</h3>
<pre><code>git commit --no-verify -m <span class="tok-string">"wip: mid-refactor, tests intentionally red"</span>
git push --no-verify
HUSKY=0 git commit -m <span class="tok-string">"…"</span>          <span class="tok-comment"># disable husky for one command</span></code></pre>
<p>Skipping is legitimate for a "wip" commit you are about to squash (3.5). It is not legitimate as a habit — if you find yourself always skipping, the hook is too slow or too strict, and that is the thing to fix.</p>

<a class="link-card" href="https://git-scm.com/docs/githooks" target="_blank" rel="noopener">
  <span class="lc-ico">🪝</span>
  <span class="lc-body"><span class="lc-title">githooks — every hook, its arguments, and what a non-zero exit does</span><span class="lc-sub">The reference for the ones this lesson did not cover.</span></span>
</a>
<a class="link-card" href="https://typicode.github.io/husky/" target="_blank" rel="noopener">
  <span class="lc-ico">🐶</span>
  <span class="lc-body"><span class="lc-title">husky — shared hooks for Node projects</span><span class="lc-sub">Plus the lint-staged pairing that keeps pre-commit fast.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> a pre-commit hook that formats the <em>whole project</em>. It takes forty seconds, it touches files you did not stage, and the reformatted-but-unstaged files quietly do not make it into your commit — so the diff on GitHub differs from what you saw locally. Run tools on staged files only (that is what lint-staged does) and re-stage exactly what they changed.</div>
<p class="note-ct"><strong>The way to think about the three gates:</strong> each one catches what the previous one cannot afford to. Pre-commit is instant and catches typos and secrets; pre-push costs a minute and catches broken builds; CI costs minutes and catches everything, and is the only one nobody can skip. Put a check as early as its runtime allows — every step earlier is a shorter feedback loop.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Những script Git chạy hộ bạn</h2>
<p class="lead">Một hook là một file thực thi được trong <code>.git/hooks/</code> mà Git chạy ở một thời điểm định sẵn. Nếu nó thoát khác 0, thao tác bị từ chối. Chỉ một cơ chế đó thôi là cách một bí mật bị lộ, một bản dựng hỏng hay một lời nhắn commit sai định dạng bị chặn lại ở khoảnh khắc rẻ nhất có thể — trước khi commit tồn tại.</p>

<pre><code>ls .git/hooks/</code></pre>
<div class="out">applypatch-msg.sample     pre-commit.sample      pre-push.sample
commit-msg.sample         pre-rebase.sample      prepare-commit-msg.sample
post-update.sample        pre-receive.sample     update.sample</div>
<div class="callout warn">Cái nào cũng có đuôi <code>.sample</code> nên đều nằm im. Một hook chỉ kích hoạt khi file mang đúng tên hook và có bit thực thi: <code>mv pre-commit.sample pre-commit &amp;&amp; chmod +x pre-commit</code>. Quên <code>chmod +x</code> là lý do phổ biến nhất khiến một hook "chẳng làm gì cả" mà không hề báo lỗi.</div>

<h3>Những hook đáng biết</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">pre-commit</span><span class="lz-v">Trước khi commit được tạo. Lint, định dạng, chạy test nhanh, quét bí mật. Khác 0 → commit bị từ chối.</span></div>
  <div class="lz-layer"><span class="lz-k">commit-msg</span><span class="lz-v">Nhận file lời nhắn. Ép Conventional Commits (bài 1.4) hoặc bắt buộc có tham chiếu issue.</span></div>
  <div class="lz-layer"><span class="lz-k">prepare-commit-msg</span><span class="lz-v">Điền sẵn lời nhắn — ví dụ chèn số issue lấy từ tên nhánh.</span></div>
  <div class="lz-layer"><span class="lz-k">pre-push</span><span class="lz-v">Trước khi gửi bất cứ thứ gì. Chỗ đúng cho các phép kiểm chậm hơn: cả bộ test, một lượt kiểm kiểu.</span></div>
  <div class="lz-layer"><span class="lz-k">post-merge / post-checkout</span><span class="lz-v">Sau khi cây làm việc đổi. Hữu ích để chạy <code>npm install</code> khi lockfile thay đổi.</span></div>
  <div class="lz-layer"><span class="lz-k">pre-receive / update</span><span class="lz-v">Phía máy chủ, trên remote. Là những hook duy nhất không ai bỏ qua được — nhưng bạn phải kiểm soát được máy chủ Git mới cài được.</span></div>
</div>

<h3>Một hook pre-commit chặn sai lầm tệ nhất</h3>
<pre><code><span class="tok-comment">#!/usr/bin/env bash</span>
<span class="tok-comment"># .git/hooks/pre-commit — từ chối bí mật rõ ràng và ký hiệu xung đột còn sót</span>
<span class="tok-keyword">set</span> -euo pipefail

<span class="tok-comment"># Chỉ xét thứ ĐÃ STAGING — không xét cả cây làm việc.</span>
files=\$(git diff --cached --name-only --diff-filter=ACM)
[ -z <span class="tok-string">"\$files"</span> ] &amp;&amp; <span class="tok-keyword">exit</span> 0

<span class="tok-keyword">if</span> git diff --cached | grep -nE <span class="tok-string">'(sk_live_|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY)'</span>; <span class="tok-keyword">then</span>
  <span class="tok-keyword">echo</span> <span class="tok-string">"✋ Co the co bi mat trong diff da staging. Tu choi commit."</span>
  <span class="tok-keyword">exit</span> 1
<span class="tok-keyword">fi</span>

<span class="tok-keyword">if</span> git diff --cached --check; <span class="tok-keyword">then</span> :; <span class="tok-keyword">else</span>
  <span class="tok-keyword">echo</span> <span class="tok-string">"✋ Loi khoang trang hoac ky hieu xung dot con sot."</span>
  <span class="tok-keyword">exit</span> 1
<span class="tok-keyword">fi</span></code></pre>
<div class="callout ok">Hai chi tiết làm cho hook này đúng chứ không phiền. Nó kiểm <code>--cached</code>, nên nó phán xét đúng thứ bạn đang commit chứ không phán xét những sửa đổi không liên quan trong cây. Và <code>git diff --cached --check</code> là một lệnh có sẵn báo ký hiệu xung đột còn sót (bài 3.3) cùng khoảng trắng thừa — một lệnh thay cho một biểu thức chính quy mà bạn sẽ viết sai.</div>

<h3>Vấn đề: .git/hooks KHÔNG được chia sẻ</h3>
<p><code>.git/</code> không thuộc kho mã, nên hook không bao giờ được clone. Đồng nghiệp của bạn không có cái nào, và một luật chỉ mình bạn áp thì không phải là luật. Hai cách sửa:</p>
<pre><code><span class="tok-comment"># A. Commit một thư mục hook rồi trỏ Git vào đó (Git 2.9+):</span>
mkdir -p .githooks &amp;&amp; mv .git/hooks/pre-commit .githooks/
chmod +x .githooks/pre-commit
git add .githooks &amp;&amp; git commit -m <span class="tok-string">"chore: them git hook dung chung"</span>
git config core.hooksPath .githooks</code></pre>
<p>Các lệnh thì được commit; còn thiết lập <code>core.hooksPath</code> vẫn phải chạy một lần cho mỗi bản clone. Hãy đặt nó vào <code>npm run prepare</code> hay một script cài đặt để nó tự diễn ra.</p>

<h3>B. husky + lint-staged, câu trả lời của hệ sinh thái Node</h3>
<pre><code>npm install --save-dev husky lint-staged
npx husky init                      <span class="tok-comment"># tạo .husky/ và thêm "prepare": "husky"</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"npx lint-staged"</span> &gt; .husky/pre-commit</code></pre>
<pre><code><span class="tok-comment">// package.json</span>
{
  <span class="tok-string">"scripts"</span>: { <span class="tok-string">"prepare"</span>: <span class="tok-string">"husky"</span> },
  <span class="tok-string">"lint-staged"</span>: {
    <span class="tok-string">"*.{ts,tsx}"</span>: [<span class="tok-string">"eslint --fix"</span>, <span class="tok-string">"prettier --write"</span>],
    <span class="tok-string">"*.{json,md,yml}"</span>: [<span class="tok-string">"prettier --write"</span>]
  }
}</code></pre>
<p><code>prepare</code> chạy tự động sau <code>npm install</code>, nên một bản clone mới cài luôn các hook mà không cần thêm bước nào. <strong>lint-staged</strong> mới là nửa quan trọng: nó chạy công cụ trên <em>chỉ những file đã staging</em> rồi đưa lại vào staging phần chúng vừa sửa. Chạy lint cả dự án ở mọi lần commit là cách một hook pre-commit đi từ hai giây lên chín mươi giây rồi bị bỏ qua vĩnh viễn.</p>

<h3>commit-msg: ép quy ước</h3>
<pre><code>npm install --save-dev @commitlint/{cli,config-conventional}
<span class="tok-keyword">echo</span> <span class="tok-string">"export default { extends: ['@commitlint/config-conventional'] };"</span> &gt; commitlint.config.mjs
<span class="tok-keyword">echo</span> <span class="tok-string">'npx commitlint --edit \$1'</span> &gt; .husky/commit-msg</code></pre>
<pre><code>git commit -m <span class="tok-string">"cap nhat linh tinh"</span></code></pre>
<div class="out">⧗   input: cap nhat linh tinh
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
✖   found 2 problems, 0 warnings</div>
<p>Bị từ chối vào đúng khoảnh khắc sửa lại chẳng tốn gì. Đây là thứ làm cho changelog tự sinh và việc tính phiên bản ở bài 7.3 trở nên đáng tin thay vì chỉ là mong ước.</p>

<h3>pre-push: cửa chậm hơn</h3>
<pre><code><span class="tok-comment">#!/usr/bin/env bash</span>
<span class="tok-comment"># .husky/pre-push — những phép kiểm quá chậm cho mỗi lần commit</span>
npx tsc --noEmit || <span class="tok-keyword">exit</span> 1
npm test -- --run --silent || <span class="tok-keyword">exit</span> 1</code></pre>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">pre-commit</div><div class="lz-t">Dưới 2 giây</div><div class="lz-d">Định dạng và lint các file đã staging. Quét bí mật.</div></div>
  <div class="lz-step"><div class="lz-k">pre-push</div><div class="lz-t">Dưới 60 giây</div><div class="lz-d">Kiểm kiểu và test đơn vị. Bạn push ít hơn hẳn số lần commit.</div></div>
  <div class="lz-step"><div class="lz-k">CI</div><div class="lz-t">Vài phút, và không bỏ qua được</div><div class="lz-d">Mọi thứ: ma trận, tích hợp, e2e, quét bảo mật (bài 11.2).</div></div>
</div>
<div class="callout warn">Hook là một tiện lợi, không bao giờ là một biện pháp kiểm soát. Ai cũng truyền được <code>--no-verify</code>, và một bản clone mới chưa chạy <code>npm install</code> thì hoàn toàn không có hook nào. Bất cứ thứ gì <em>BẮT BUỘC</em> phải giữ đều thuộc về CI cộng bảo vệ nhánh (bài 6.4). Hook làm cho việc đúng trở nên nhanh; CI làm cho nó trở thành bắt buộc.</div>

<h3>Bỏ qua, một cách có chủ ý</h3>
<pre><code>git commit --no-verify -m <span class="tok-string">"wip: dang refactor do, test co tinh de do"</span>
git push --no-verify
HUSKY=0 git commit -m <span class="tok-string">"…"</span>          <span class="tok-comment"># tắt husky cho một lệnh</span></code></pre>
<p>Bỏ qua là chính đáng với một commit "wip" mà bạn sắp gộp lại (bài 3.5). Nó không chính đáng khi thành thói quen — nếu bạn thấy mình lúc nào cũng bỏ qua thì cái hook quá chậm hoặc quá khắt khe, và ĐÓ mới là thứ cần sửa.</p>

<a class="link-card" href="https://git-scm.com/docs/githooks" target="_blank" rel="noopener">
  <span class="lc-ico">🪝</span>
  <span class="lc-body"><span class="lc-title">githooks — mọi hook, tham số của nó, và mã thoát khác 0 làm gì</span><span class="lc-sub">Tài liệu tra cứu cho những hook mà bài này chưa nói tới.</span></span>
</a>
<a class="link-card" href="https://typicode.github.io/husky/" target="_blank" rel="noopener">
  <span class="lc-ico">🐶</span>
  <span class="lc-body"><span class="lc-title">husky — hook dùng chung cho dự án Node</span><span class="lc-sub">Cộng cặp bài trùng lint-staged giữ cho pre-commit luôn nhanh.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> một hook pre-commit định dạng <em>CẢ DỰ ÁN</em>. Nó mất bốn mươi giây, nó chạm vào những file bạn không staging, và những file được định dạng lại mà chưa staging thì âm thầm không lọt vào commit — nên bản diff trên GitHub khác với thứ bạn thấy ở máy. Hãy chạy công cụ chỉ trên file đã staging (đó chính là việc lint-staged làm) và staging lại đúng phần chúng vừa sửa.</div>
<p class="note-ct"><strong>Cách nghĩ về ba cái cửa:</strong> mỗi cửa bắt thứ mà cửa trước không kham nổi. Pre-commit chạy tức thì và bắt lỗi chính tả cùng bí mật; pre-push tốn một phút và bắt bản dựng hỏng; CI tốn vài phút và bắt mọi thứ, và là cửa duy nhất không ai bỏ qua được. Hãy đặt một phép kiểm ở chỗ sớm nhất mà thời gian chạy của nó cho phép — mỗi bước sớm hơn là một vòng phản hồi ngắn hơn.</p>
</div>
`,
    },

    /* ─────────────────────────── 12.2 ─────────────────────────── */
    {
      title: '12.2 — Signing commits: proving who wrote what|||12.2 — Ký commit: chứng minh ai đã viết gì',
      slug: 'git-12-2-ky-commit',
      type: 'LESSON',
      description: 'Vì sao trường author của một commit là chữ tự khai và ai cũng giả mạo được, ký bằng khoá SSH (cách dễ nhất), huy hiệu Verified của GitHub, và ký tag phát hành.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Anyone can commit as anyone</h2>
<p class="lead">The author field of a commit is whatever <code>user.name</code> and <code>user.email</code> say. Git does not verify it, because it cannot — a distributed system has no central authority to ask. Which means this works, from any machine, in thirty seconds:</p>

<pre><code>git config user.name <span class="tok-string">"Linus Torvalds"</span>
git config user.email <span class="tok-string">"torvalds@linux-foundation.org"</span>
git commit --allow-empty -m <span class="tok-string">"feat: definitely written by Linus"</span>
git log -1 --format=<span class="tok-string">'%an &lt;%ae&gt;'</span></code></pre>
<div class="out">Linus Torvalds &lt;torvalds@linux-foundation.org&gt;</div>
<div class="callout danger">Push that to a repository where he is a contributor and GitHub will even show his avatar, because it matches on email address. Nothing about a commit's authorship is evidence — until it is <strong>signed</strong>. A signature is a cryptographic proof that the holder of a specific private key produced that exact commit content.</div>

<h3>Signing with SSH — the easy path</h3>
<p>Git 2.34+ can sign with the SSH key you already made in 0.3. No GPG, no keyring, no expiry management:</p>
<pre><code>git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true      <span class="tok-comment"># sign every commit</span>
git config --global tag.gpgsign true         <span class="tok-comment"># and every annotated tag</span></code></pre>
<pre><code>git commit -m <span class="tok-string">"feat(auth): add refresh token rotation"</span>
git log --show-signature -1 | head -4</code></pre>
<div class="out">commit 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d
Good "git" signature for an@example.com with ED25519 key SHA256:4d7a1e…
Author: Nguyen Van An &lt;an@example.com&gt;</div>
<p>Then add the <em>same public key</em> to GitHub a second time — Settings → SSH and GPG keys → New SSH key, with key type <strong>Signing Key</strong> rather than Authentication Key. One key file, two registrations, two purposes.</p>

<h3>Verifying locally</h3>
<pre><code><span class="tok-comment"># Tell Git which keys you trust, and for which identity:</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"an@example.com \$(cat ~/.ssh/id_ed25519.pub)"</span> &gt;&gt; ~/.git-allowed-signers
git config --global gpg.ssh.allowedSignersFile ~/.git-allowed-signers

git log --show-signature -3
git verify-commit HEAD
git log --format=<span class="tok-string">'%h %G? %an %s'</span> -5</code></pre>
<div class="out">3f8a1c9 G Nguyen Van An feat(auth): add refresh token rotation
9e2d4b7 G Nguyen Van An test(auth): cover the expired-token path
7b3e9d1 N Tran Thi Binh refactor(api): extract pagination</div>
<div class="kv-grid">
  <div class="kv"><span class="k">G</span><span class="v">Good signature from a key in your allowed-signers file.</span></div>
  <div class="kv"><span class="k">U</span><span class="v">Good signature, but the key is not marked as trusted.</span></div>
  <div class="kv"><span class="k">B / X / Y</span><span class="v">Bad signature · expired signature · expired key. Any of these on a commit you did not expect is worth investigating.</span></div>
  <div class="kv"><span class="k">N</span><span class="v">No signature. Normal for most commits in most repositories — it is not an error, just an absence of proof.</span></div>
</div>

<h3>GPG, if your organisation requires it</h3>
<pre><code>gpg --full-generate-key                     <span class="tok-comment"># RSA 4096 or ed25519, with an expiry</span>
gpg --list-secret-keys --keyid-format=long  <span class="tok-comment"># find the key id</span>
git config --global user.signingkey 3AA5C34371567BD2
git config --global commit.gpgsign true
gpg --armor --export 3AA5C34371567BD2       <span class="tok-comment"># paste this into GitHub</span></code></pre>
<div class="callout warn">GPG is more work than SSH signing for the same result: a passphrase agent to configure, an expiry to renew, and a key to move between machines. Choose it when a policy or an existing web of trust requires it; otherwise SSH signing gives the same GitHub badge with one line of config.</div>

<h3>The Verified badge — what it does and does not mean</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Verified</span><span class="lz-v">The signature is valid and the key is registered to a GitHub account whose verified email matches the commit's author. Real evidence.</span></div>
  <div class="lz-layer"><span class="lz-k">Unverified</span><span class="lz-v">There is a signature, but GitHub cannot match the key — usually because you forgot to add it as a <em>Signing</em> key.</span></div>
  <div class="lz-layer"><span class="lz-k">(no badge)</span><span class="lz-v">Unsigned. The overwhelming majority of commits everywhere.</span></div>
</div>
<div class="callout ok">What it proves: this commit's content was produced by the holder of that private key. What it does <strong>not</strong> prove: that the code is good, that a review happened, or that the key holder is who they claim to be off-platform. It is an identity signal, not a quality one — and it stops one specific, real attack: someone pushing a commit that appears to come from a trusted maintainer.</div>

<h3>Signing tags — the higher-value case</h3>
<pre><code>git tag -s v1.5.0 -m <span class="tok-string">"Release 1.5.0"</span>
git verify-tag v1.5.0
git push origin v1.5.0</code></pre>
<p>If you sign only one thing, sign release tags. A tag is what a build pipeline consumes and what users download; proving that <code>v1.5.0</code> is the version <em>you</em> cut is worth more than proving authorship of one commit among five hundred.</p>

<h3>Requiring signatures on a branch</h3>
<pre><code>Settings → Branches → main → ☑ Require signed commits</code></pre>
<div class="callout warn">Turn this on only after everyone's setup works. GitHub rejects unsigned pushes with a message that does not explain the cause, and an outside contributor with no signing key simply cannot contribute. On an open-source repository this is usually the wrong trade; on a release branch in a regulated environment it is exactly right.</div>

<h3>What signing does not solve</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rebase and squash break signatures</span><span class="v">They create new commits (8.1), so the original signature no longer applies. Squash-merge on GitHub re-signs with GitHub's own key — the badge stays, the author's signature does not survive.</span></div>
  <div class="kv"><span class="k">A stolen key signs happily</span><span class="v">Signing proves possession of a key, not that the right person holds it. Protect the private key with a passphrase; revoke it the moment a machine is lost.</span></div>
  <div class="kv"><span class="k">CI cannot sign as you</span><span class="v">Automation needs its own key or a bot identity. Never put your personal signing key in a secret (11.2).</span></div>
</div>

<a class="link-card" href="https://docs.github.com/en/authentication/managing-commit-signature-verification" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Managing commit signature verification</span><span class="lc-sub">SSH and GPG setup, the Verified badge rules, and vigilant mode.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-config#Documentation/git-config.txt-gpgformat" target="_blank" rel="noopener">
  <span class="lc-ico">🔏</span>
  <span class="lc-body"><span class="lc-title">git-config — gpg.format, user.signingkey, allowedSignersFile</span><span class="lc-sub">The SSH signing configuration in full.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> adding your SSH key to GitHub once, as an <em>Authentication</em> key, and expecting commits to show Verified. GitHub treats the two roles separately: the same public key must be registered a second time with type "Signing Key". The commit is genuinely signed and GitHub simply has no record that the key is yours — which is why the badge says Unverified rather than nothing at all.</div>
<p class="note-ct"><strong>A reasonable default:</strong> turn on SSH signing for yourself — it is three config lines and costs nothing per commit. Require signatures on release tags, where the proof is most valuable. Require them on <code>main</code> only when you control every contributor's setup, because the failure mode is a contributor who cannot push and cannot tell why.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Ai cũng commit dưới danh nghĩa bất kỳ ai</h2>
<p class="lead">Trường tác giả của một commit là bất cứ thứ gì <code>user.name</code> và <code>user.email</code> khai. Git không xác minh nó, vì nó không xác minh nổi — một hệ phân tán không có cơ quan trung ương nào để hỏi. Nghĩa là chuyện này chạy được, từ bất kỳ cái máy nào, trong ba mươi giây:</p>

<pre><code>git config user.name <span class="tok-string">"Linus Torvalds"</span>
git config user.email <span class="tok-string">"torvalds@linux-foundation.org"</span>
git commit --allow-empty -m <span class="tok-string">"feat: chac chan do Linus viet"</span>
git log -1 --format=<span class="tok-string">'%an &lt;%ae&gt;'</span></code></pre>
<div class="out">Linus Torvalds &lt;torvalds@linux-foundation.org&gt;</div>
<div class="callout danger">Đẩy cái đó lên một kho mà ông ấy là người đóng góp thì GitHub còn hiện cả ảnh đại diện của ông, vì nó khớp theo địa chỉ email. Không có gì về quyền tác giả của một commit là bằng chứng cả — cho tới khi nó được <strong>KÝ</strong>. Một chữ ký là bằng chứng mật mã rằng người giữ một khoá riêng cụ thể đã tạo ra đúng nội dung commit đó.</div>

<h3>Ký bằng SSH — con đường dễ</h3>
<p>Git 2.34+ ký được bằng chính cái khoá SSH bạn đã tạo ở bài 0.3. Không GPG, không keyring, không phải quản lý hạn dùng:</p>
<pre><code>git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub
git config --global commit.gpgsign true      <span class="tok-comment"># ký mọi commit</span>
git config --global tag.gpgsign true         <span class="tok-comment"># và mọi tag có chú thích</span></code></pre>
<pre><code>git commit -m <span class="tok-string">"feat(auth): them xoay vong refresh token"</span>
git log --show-signature -1 | head -4</code></pre>
<div class="out">commit 3f8a1c9d2e5b7a4c6f8e0a2b4d6c8e0f2a4b6c8d
Good "git" signature for an@example.com with ED25519 key SHA256:4d7a1e…
Author: Nguyen Van An &lt;an@example.com&gt;</div>
<p>Rồi thêm <em>đúng cái khoá công khai đó</em> lên GitHub một lần nữa — Settings → SSH and GPG keys → New SSH key, với loại khoá là <strong>Signing Key</strong> chứ không phải Authentication Key. Một file khoá, hai lần đăng ký, hai mục đích.</p>

<h3>Xác minh ở máy mình</h3>
<pre><code><span class="tok-comment"># Nói cho Git biết bạn tin những khoá nào, và cho danh tính nào:</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"an@example.com \$(cat ~/.ssh/id_ed25519.pub)"</span> &gt;&gt; ~/.git-allowed-signers
git config --global gpg.ssh.allowedSignersFile ~/.git-allowed-signers

git log --show-signature -3
git verify-commit HEAD
git log --format=<span class="tok-string">'%h %G? %an %s'</span> -5</code></pre>
<div class="out">3f8a1c9 G Nguyen Van An feat(auth): add refresh token rotation
9e2d4b7 G Nguyen Van An test(auth): cover the expired-token path
7b3e9d1 N Tran Thi Binh refactor(api): extract pagination</div>
<div class="kv-grid">
  <div class="kv"><span class="k">G</span><span class="v">Chữ ký tốt, từ một khoá có trong file allowed-signers của bạn.</span></div>
  <div class="kv"><span class="k">U</span><span class="v">Chữ ký tốt, nhưng khoá chưa được đánh dấu là tin cậy.</span></div>
  <div class="kv"><span class="k">B / X / Y</span><span class="v">Chữ ký sai · chữ ký hết hạn · khoá hết hạn. Bất kỳ dấu nào trong ba dấu này trên một commit bạn không ngờ tới đều đáng điều tra.</span></div>
  <div class="kv"><span class="k">N</span><span class="v">Không có chữ ký. Bình thường với đa số commit ở đa số kho mã — đó không phải lỗi, chỉ là không có bằng chứng.</span></div>
</div>

<h3>GPG, nếu tổ chức của bạn yêu cầu</h3>
<pre><code>gpg --full-generate-key                     <span class="tok-comment"># RSA 4096 hoặc ed25519, kèm hạn dùng</span>
gpg --list-secret-keys --keyid-format=long  <span class="tok-comment"># tìm id khoá</span>
git config --global user.signingkey 3AA5C34371567BD2
git config --global commit.gpgsign true
gpg --armor --export 3AA5C34371567BD2       <span class="tok-comment"># dán cái này vào GitHub</span></code></pre>
<div class="callout warn">GPG tốn công hơn ký bằng SSH cho cùng một kết quả: phải cấu hình một agent giữ mật khẩu, phải gia hạn khoá, và phải chuyển khoá giữa các máy. Hãy chọn nó khi một chính sách hoặc một mạng lưới tin cậy sẵn có đòi hỏi; còn lại, ký bằng SSH cho đúng cái huy hiệu GitHub ấy chỉ với một dòng cấu hình.</div>

<h3>Huy hiệu Verified — nó nghĩa là gì và không nghĩa là gì</h3>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Verified</span><span class="lz-v">Chữ ký hợp lệ và khoá được đăng ký với một tài khoản GitHub có email đã xác minh khớp với tác giả của commit. Bằng chứng thật.</span></div>
  <div class="lz-layer"><span class="lz-k">Unverified</span><span class="lz-v">Có chữ ký, nhưng GitHub không khớp được cái khoá — thường vì bạn quên thêm nó với vai trò <em>Signing</em>.</span></div>
  <div class="lz-layer"><span class="lz-k">(không có huy hiệu)</span><span class="lz-v">Không ký. Đại đa số commit ở khắp mọi nơi.</span></div>
</div>
<div class="callout ok">Nó chứng minh: nội dung commit này do người giữ khoá riêng đó tạo ra. Nó <strong>KHÔNG</strong> chứng minh: rằng mã tốt, rằng đã có review, hay rằng người giữ khoá đúng là người họ tự nhận ở ngoài đời. Đó là một tín hiệu về danh tính, không phải về chất lượng — và nó chặn được đúng một cuộc tấn công cụ thể, có thật: có kẻ push một commit trông như đến từ một người bảo trì đáng tin.</div>

<h3>Ký tag — trường hợp giá trị hơn</h3>
<pre><code>git tag -s v1.5.0 -m <span class="tok-string">"Release 1.5.0"</span>
git verify-tag v1.5.0
git push origin v1.5.0</code></pre>
<p>Nếu chỉ ký một thứ, hãy ký tag phát hành. Một tag là thứ mà pipeline dựng bản tiêu thụ và là thứ người dùng tải về; chứng minh rằng <code>v1.5.0</code> đúng là bản <em>bạn</em> cắt ra đáng giá hơn chứng minh quyền tác giả của một commit giữa năm trăm cái.</p>

<h3>Bắt buộc chữ ký trên một nhánh</h3>
<pre><code>Settings → Branches → main → ☑ Require signed commits</code></pre>
<div class="callout warn">Chỉ bật cái này sau khi thiết lập của mọi người đã chạy. GitHub từ chối các lần push không ký kèm một thông báo không giải thích nguyên nhân, và một người đóng góp bên ngoài không có khoá ký thì đơn giản là không đóng góp được. Trên một kho mã nguồn mở thì đây thường là đánh đổi sai; trên một nhánh phát hành trong môi trường có quy định thì lại chính xác là đúng.</div>

<h3>Ký không giải quyết được cái gì</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Rebase và squash phá chữ ký</span><span class="v">Chúng tạo ra commit mới (bài 8.1), nên chữ ký gốc không còn áp dụng. Squash-merge trên GitHub ký lại bằng khoá của chính GitHub — huy hiệu vẫn còn, chữ ký của tác giả thì không sống sót.</span></div>
  <div class="kv"><span class="k">Một khoá bị đánh cắp vẫn ký ngon lành</span><span class="v">Ký chứng minh việc sở hữu một khoá, không chứng minh đúng người đang giữ nó. Hãy bảo vệ khoá riêng bằng mật khẩu; thu hồi nó ngay khoảnh khắc mất một cái máy.</span></div>
  <div class="kv"><span class="k">CI không ký thay bạn được</span><span class="v">Việc tự động cần khoá riêng của nó hoặc một danh tính bot. Đừng bao giờ đặt khoá ký cá nhân vào một secret (bài 11.2).</span></div>
</div>

<a class="link-card" href="https://docs.github.com/en/authentication/managing-commit-signature-verification" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Quản lý việc xác minh chữ ký commit</span><span class="lc-sub">Cài đặt SSH và GPG, luật của huy hiệu Verified, và chế độ vigilant.</span></span>
</a>
<a class="link-card" href="https://git-scm.com/docs/git-config#Documentation/git-config.txt-gpgformat" target="_blank" rel="noopener">
  <span class="lc-ico">🔏</span>
  <span class="lc-body"><span class="lc-title">git-config — gpg.format, user.signingkey, allowedSignersFile</span><span class="lc-sub">Toàn bộ cấu hình ký bằng SSH.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> thêm khoá SSH lên GitHub đúng một lần, với vai trò <em>Authentication</em>, rồi mong commit hiện chữ Verified. GitHub coi hai vai trò đó tách biệt: đúng cái khoá công khai ấy phải được đăng ký lần thứ hai với loại "Signing Key". Commit đúng là đã được ký thật và GitHub chỉ đơn giản không có bản ghi nào nói cái khoá đó là của bạn — vì thế huy hiệu ghi Unverified chứ không phải là không có gì.</div>
<p class="note-ct"><strong>Một mặc định hợp lý:</strong> hãy bật ký bằng SSH cho chính bạn — ba dòng cấu hình và không tốn gì cho mỗi commit. Hãy bắt buộc chữ ký trên các tag phát hành, nơi bằng chứng có giá trị nhất. Chỉ bắt buộc nó trên <code>main</code> khi bạn kiểm soát được thiết lập của mọi người đóng góp, vì kiểu hỏng của nó là một người không push được và không hiểu vì sao.</p>
</div>
`,
    },

    /* ─────────────────────────── 12.3 Quiz ─────────────────────────── */
    {
      title: '12.3 — Chapter 12 quiz|||12.3 — Kiểm tra Chương 12',
      slug: 'git-12-3-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Tám câu về hook (chmod +x, .git/hooks không được chia sẻ, lint-staged), ba cửa kiểm, --no-verify, trường author giả mạo được, ký bằng SSH và huy hiệu Verified.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on hooks and signing. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The two that matter most in real work: why hooks are a convenience and not a control (12.1), and what a Verified badge actually proves (12.2).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về hook và ký commit. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Hai câu quan trọng nhất trong việc thật: vì sao hook là tiện lợi chứ không phải biện pháp kiểm soát (bài 12.1), và huy hiệu Verified thật sự chứng minh cái gì (bài 12.2).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Your pre-commit hook does nothing and prints no error. What is the most likely cause?|||Hook pre-commit của bạn không làm gì và không in lỗi nào. Nguyên nhân nhiều khả năng nhất là gì?',
            options: [
              'Git hooks are disabled by default|||Hook của Git mặc định bị tắt',
              'The file is still named .sample, or it is missing the executable bit (chmod +x)|||File vẫn còn đuôi .sample, hoặc thiếu bit thực thi (chmod +x)',
              'It needs to be written in Bash|||Nó phải được viết bằng Bash',
              'It must be committed to the repository first|||Nó phải được commit vào kho mã trước',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why does a hook in .git/hooks/ not protect your team?|||Vì sao một hook trong .git/hooks/ không bảo vệ được cả nhóm bạn?',
            options: [
              'Hooks only run for repository owners|||Hook chỉ chạy với chủ sở hữu kho mã',
              '.git/ is not part of the repository, so hooks are never cloned — use core.hooksPath or husky to share them|||.git/ không thuộc kho mã, nên hook không bao giờ được clone — hãy dùng core.hooksPath hoặc husky để chia sẻ',
              'They are ignored by .gitignore|||Chúng bị .gitignore bỏ qua',
              'GitHub disables them|||GitHub vô hiệu hoá chúng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does lint-staged add over running eslint in a pre-commit hook?|||lint-staged thêm gì so với việc chạy thẳng eslint trong hook pre-commit?',
            options: [
              'It runs eslint faster|||Nó chạy eslint nhanh hơn',
              'It runs the tools on only the STAGED files and re-stages what they fix — so the hook stays fast and the commit matches what you saw|||Nó chạy công cụ chỉ trên các file ĐÃ STAGING và staging lại phần chúng vừa sửa — nên hook vẫn nhanh và commit khớp với thứ bạn nhìn thấy',
              'It signs the commit|||Nó ký commit',
              'It uploads results to CI|||Nó tải kết quả lên CI',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Which check belongs in pre-push rather than pre-commit?|||Phép kiểm nào thuộc về pre-push chứ không phải pre-commit?',
            options: [
              'Formatting the staged files|||Định dạng các file đã staging',
              'The full type check and unit test suite — too slow for every commit, fine before a push|||Kiểm kiểu đầy đủ và cả bộ test đơn vị — quá chậm cho mỗi lần commit, vừa phải trước một lần push',
              'Scanning for secrets|||Quét bí mật',
              'Validating the commit message|||Kiểm tính hợp lệ của lời nhắn commit',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why can hooks never be a security control?|||Vì sao hook không bao giờ là một biện pháp kiểm soát bảo mật?',
            options: [
              'They run too late|||Chúng chạy quá muộn',
              'Anyone can pass --no-verify, and a fresh clone without npm install has no hooks at all — enforcement belongs in CI plus branch protection|||Ai cũng truyền được --no-verify, và một bản clone mới chưa npm install thì hoàn toàn không có hook — việc cưỡng chế thuộc về CI cộng bảo vệ nhánh',
              'They cannot read the staged diff|||Chúng không đọc được diff đã staging',
              'GitHub overrides them|||GitHub ghi đè lên chúng',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Can you make a commit that claims to be from someone else?|||Bạn có tạo được một commit tự nhận là của người khác không?',
            options: [
              'No, Git verifies the author against the remote|||Không, Git đối chiếu tác giả với remote',
              'Yes — the author field is just user.name and user.email, and Git cannot verify it; only a SIGNATURE is evidence|||Có — trường tác giả chỉ là user.name và user.email, và Git không xác minh nổi; chỉ có CHỮ KÝ mới là bằng chứng',
              'Only on a local repository|||Chỉ trên kho cục bộ',
              'Only if you know their password|||Chỉ khi bạn biết mật khẩu của họ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'You added your SSH key to GitHub for authentication. Why do commits still show "Unverified"?|||Bạn đã thêm khoá SSH lên GitHub để xác thực. Vì sao commit vẫn hiện "Unverified"?',
            options: [
              'Signing needs GPG, not SSH|||Ký phải dùng GPG, không dùng SSH được',
              'GitHub treats the roles separately — the same public key must be registered a second time with type "Signing Key"|||GitHub coi hai vai trò là tách biệt — đúng cái khoá công khai đó phải được đăng ký lần thứ hai với loại "Signing Key"',
              'The key has expired|||Khoá đã hết hạn',
              'Verification only works on public repositories|||Việc xác minh chỉ chạy trên kho công khai',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What does a Verified badge prove?|||Huy hiệu Verified chứng minh điều gì?',
            options: [
              'The code was reviewed and is correct|||Mã đã được review và đúng đắn',
              'The commit content was produced by the holder of a key registered to a GitHub account whose verified email matches the author — an identity signal, not a quality one|||Nội dung commit do người giữ một khoá được đăng ký với tài khoản GitHub có email xác minh khớp tác giả tạo ra — một tín hiệu về danh tính, không phải về chất lượng',
              'CI passed on that commit|||CI đã xanh trên commit đó',
              'The commit cannot be rebased|||Commit đó không rebase được',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
