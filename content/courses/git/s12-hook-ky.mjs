/**
 * Git & GitHub — Chương 12: Hook, ký commit & tự động hoá.
 * Hook phía client + husky/lint-staged · ký commit (SSH/GPG) + chính sách phía máy chủ · quiz.
 * LUẬT: backtick → &#96;; ${ → \${; < > trong code → &lt; &gt;; & → &amp;.
 * Khối .out đóng bằng </div> (KHÔNG </code></pre>). KHÔNG dùng <svg>.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Fgit%2Flearn&reflabel=Git';

export default {
  title: 'Chapter 12 — Hooks, signing & automation|||Chương 12 — Hook, ký commit & tự động hoá',
  description: 'Git chạy được script của bạn ở những thời điểm định sẵn: trước khi commit, trước khi push, sau khi merge. Chương này dùng chúng để chặn lỗi trước khi chúng tồn tại, và nói về việc ký commit — thứ duy nhất chứng minh một commit đúng là do bạn tạo ra.',
  lessons: [
    /* ─────────────────────────── 12.0 ─────────────────────────── */
    {
      title: '12.0 — Chapter 12 slides: hooks and signatures in pictures|||12.0 — Slide Chương 12: hook và chữ ký bằng hình',
      slug: 'git-12-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 18 slide của Chương 12: dòng thời gian các hook, pre-commit chặn ký hiệu xung đột, file lớn và bí mật, husky + lint-staged + commitlint, --no-verify và vì sao CI kiểm lại, ký commit bằng khoá SSH, %G?, nhãn Verified và vigilant mode, hook pre-receive trên máy chủ.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Slides</span>
<h2>The whole chapter in 18 slides</h2>
<p class="lead">A hook is a script Git runs at a fixed moment, and a signature is the only proof of who made a commit. These slides draw both: a timeline of which hook fires when (and which ones <code>--no-verify</code> can skip), the same broken commit refused on one laptop and waved through on a teammate’s fresh clone, and a fake "GitHub" that rejects an unsigned push even after every local hook was bypassed.</p>
<p>All terminal output is real, from a test repository with a server made by <code>git init --bare</code> (git 2.51, OpenSSH 10.3, gitleaks 8.30, husky 9, lint-staged 16, commitlint 21). The signing key was generated only for the test, under a temporary home directory, so the hashes match from slide to slide: commit <code>f7659bb</code>, signed on slide 12, is the <strong>G</strong> on slide 13 and comes back with the very same hash after a signed rebase on slide 15. The slides are in Vietnamese; the diagrams read the same in any language. The last two are a cheat sheet and a 40-minute practice session.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Slide</span>
<h2>Cả chương trong 18 slide</h2>
<p class="lead">Hook (móc) là script Git tự chạy ở một thời điểm cố định, còn chữ ký là bằng chứng duy nhất cho biết ai đã tạo ra một commit. Bộ slide này vẽ cả hai: dòng thời gian hook nào chạy lúc nào (và cái nào <code>--no-verify</code> bỏ qua được), cùng một commit hỏng bị chặn trên máy này nhưng lọt qua bản clone mới của bạn cùng nhóm, và một "GitHub" giả từ chối lần push không ký dù mọi hook ở máy đã bị bỏ qua.</p>
<p>Mọi output terminal là output thật, từ một kho thử có máy chủ dựng bằng <code>git init --bare</code> (git 2.51, OpenSSH 10.3, gitleaks 8.30, husky 9, lint-staged 16, commitlint 21). Khoá ký được tạo riêng cho kho thử trong một thư mục home tạm, nên mã băm khớp từ slide này sang slide khác: commit <code>f7659bb</code> được ký ở slide 12 chính là chữ <strong>G</strong> ở slide 13, và quay lại với đúng mã băm cũ sau một lần rebase có ký ở slide 15. Hai slide cuối là bảng tra nhanh và một buổi thực hành 40 phút.</p>
</div>
${gallery('git-12', [
  [1, 'Bìa'], [2, 'Bản đồ chương'], [3, 'Dòng thời gian các hook'], [4, 'Hook là một file: tên đúng + chmod +x'],
  [5, 'pre-commit chặn ký hiệu xung đột và file lớn'], [6, 'pre-commit bắt bí mật bằng gitleaks'], [7, '.git/hooks không được clone → core.hooksPath'],
  [8, 'husky + lint-staged + commitlint'], [9, 'pre-push canh main, post-merge nhắc npm install'], [10, '--no-verify và vì sao CI kiểm lại'],
  [11, 'Trường tác giả chỉ là chữ tự khai'], [12, 'Ký bằng khoá SSH và allowedSignersFile'], [13, 'Đọc %G? và ký tag'],
  [14, 'Khoá Signing, Verified, vigilant mode'], [15, 'Rebase và chữ ký'], [16, 'Máy chủ từ chối: pre-receive'],
  [17, 'Bảng tra nhanh'], [18, 'Thực hành chương 12'],
])}
`,
    },

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
<div class="callout warn">Every one ends in <code>.sample</code> and is therefore inert. A hook activates when the file has the exact hook name and the executable bit: <code>mv pre-commit.sample pre-commit &amp;&amp; chmod +x pre-commit</code>. Forgetting <code>chmod +x</code> is the most common reason a hook "does nothing": Git prints only a one-line <code>hint:</code> — not an error — and lets the commit through, so the warning scrolls past unnoticed.</div>

<h3>The hooks worth knowing</h3>
${slide('git-12', 3, 'Dòng thời gian: Git gọi hook nào, lúc nào')}
${slide('git-12', 4, 'Hook là một file: đúng tên + chmod +x')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">pre-commit</span><span class="lz-v">Before the commit is created. Lint, format, run fast tests, scan for secrets. Non-zero → the commit is refused.</span></div>
  <div class="lz-layer"><span class="lz-k">commit-msg</span><span class="lz-v">Receives the message file. Enforce Conventional Commits (1.4) or an issue reference.</span></div>
  <div class="lz-layer"><span class="lz-k">prepare-commit-msg</span><span class="lz-v">Pre-fill the message — e.g. insert the issue number parsed from the branch name.</span></div>
  <div class="lz-layer"><span class="lz-k">pre-push</span><span class="lz-v">Before anything is sent. The right place for slower checks: the full test suite, a type check.</span></div>
  <div class="lz-layer"><span class="lz-k">post-merge / post-checkout</span><span class="lz-v">After the working tree changes. Useful to run <code>npm install</code> when the lockfile moved.</span></div>
  <div class="lz-layer"><span class="lz-k">pre-receive / update</span><span class="lz-v">Server-side, on the remote. The only hooks nobody can skip — but you need control of the Git server to install them.</span></div>
</div>

<h3>A pre-commit hook that stops the worst mistake</h3>
${slide('git-12', 5, 'pre-commit chặn ký hiệu xung đột và file lớn')}
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
${slide('git-12', 7, '.git/hooks không đi theo bản clone → core.hooksPath')}
<p><code>.git/</code> is not part of the repository, so hooks are never cloned. Your colleague has none, and a rule only you enforce is not a rule. Two fixes:</p>
<pre><code><span class="tok-comment"># A. Commit a hooks directory and point Git at it (Git 2.9+):</span>
mkdir -p .githooks &amp;&amp; mv .git/hooks/pre-commit .githooks/
chmod +x .githooks/pre-commit
git add .githooks &amp;&amp; git commit -m <span class="tok-string">"chore: add shared git hooks"</span>
git config core.hooksPath .githooks</code></pre>
<p>The commands are committed; the <code>core.hooksPath</code> setting still has to be run once per clone. Put it in your <code>npm run prepare</code> or a setup script so it happens automatically.</p>

<h3>B. husky + lint-staged, the Node ecosystem answer</h3>
${slide('git-12', 8, 'Dự án Node: husky + lint-staged + commitlint')}
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
<div class="callout ok"><strong>What we saw running it (husky 9.1.7, lint-staged 16.4, 09/2026):</strong> <code>npx husky init</code> adds <code>"prepare": "husky"</code> and writes <code>npm test</code> into <code>.husky/pre-commit</code> — replace that line, or every commit runs your whole test suite. Afterwards <code>git config core.hooksPath</code> prints <code>.husky/_</code>: husky uses exactly the <code>core.hooksPath</code> mechanism of option A, it just sets it for you on every <code>npm install</code>. And lint-staged really does touch only staged files: we staged a messy <code>gio.js</code> and left an equally messy <code>nhap.js</code> unstaged — the commit contained a formatted <code>gio.js</code> and <code>nhap.js</code> was not touched.</div>

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

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In <code>thu-git</code>: <code>mkdir .githooks</code> and create <code>.githooks/pre-commit</code> with the two checks from slide 5 — <code>git diff --cached --check</code> for conflict markers, and a loop that refuses staged files over 5 MB. Run <code>git config core.hooksPath .githooks</code> but do <strong>not</strong> run <code>chmod +x</code> yet. Commit any small change and find the <code>hint:</code> line: the hook was ignored and the commit went through.</li><li><code>chmod +x .githooks/pre-commit</code>. Now fake the classic group-project accident: create <code>lich.js</code> containing a whole <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> … <code>=======</code> … <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/dat-lich</code> block, <code>git add</code> it and commit. It must be refused with <code>leftover conflict marker</code>. Then try a 6 MB file: <code>dd if=/dev/urandom of=demo.mp4 bs=1048576 count=6</code> (macOS/Linux; on Windows run it in Git Bash).</li><li>Unstage and delete both (<code>git restore --staged lich.js demo.mp4</code>, then <code>rm lich.js demo.mp4</code>), and commit the hooks themselves: <code>git add .githooks</code> and <code>git commit -m "chore: them git hook dung chung"</code>. Confirm <code>git ls-files -s .githooks</code> shows mode <code>100755</code>.</li><li>Play your teammate Bình: <code>git clone . ../ban-binh</code>. In <code>../ban-binh</code>, <code>git config core.hooksPath</code> prints nothing — commit a file with conflict markers and watch it go through. Run <code>git config core.hooksPath .githooks</code> there and try the same commit again.</li></ol>
<pre><code class="language-bash">git commit -m "feat(lich): them gio mo cua"
lich.js:2: leftover conflict marker         <span class="tok-comment"># real output from our test repo</span>
lich.js:4: leftover conflict marker
lich.js:6: leftover conflict marker
✋ Còn ký hiệu xung đột hoặc khoảng trắng thừa.</code></pre>
<p><strong>Done when:</strong> the same conflicted file is refused in <code>thu-git</code>, accepted in the fresh <code>ban-binh</code> clone, and refused there too after the one <code>git config</code> line — and you can say which of those three states your teammates get by default.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">hook</span><span class="v">A script Git runs at a fixed moment (before a commit, before a push…). A non-zero exit cancels the operation.</span></div>
  <div class="kv"><span class="k">executable bit (chmod +x)</span><span class="v">The file permission that lets a file run as a program. Without it Git ignores the hook and prints only a hint.</span></div>
  <div class="kv"><span class="k">core.hooksPath</span><span class="v">A per-clone setting telling Git to look for hooks in a directory you commit (e.g. <code>.githooks</code>) instead of <code>.git/hooks</code>.</span></div>
  <div class="kv"><span class="k">staged files</span><span class="v">What is in the index and will go into the next commit — the only thing a pre-commit hook should judge.</span></div>
  <div class="kv"><span class="k">husky / lint-staged / commitlint</span><span class="v">Node tools: husky installs hooks through the <code>prepare</code> script, lint-staged runs formatters on staged files only, commitlint checks the message format.</span></div>
  <div class="kv"><span class="k">--no-verify</span><span class="v">Skips the pre-commit and commit-msg hooks (on <code>git commit</code>) or pre-push (on <code>git push</code>). It never skips anything on the server.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A hook runs only if it has the exact hook name and the executable bit; otherwise Git prints a hint and carries on.</li><li>Check <code>--cached</code>: judge what is being committed, not the whole working tree.</li><li><code>.git/hooks</code> is never cloned; commit a hooks directory and set <code>core.hooksPath</code>, or let husky’s <code>prepare</code> do it.</li><li>lint-staged keeps pre-commit fast by touching only staged files; commitlint guards the message at <code>commit-msg</code>.</li><li>Hooks make the right thing fast, never mandatory — that part belongs to CI and the server (12.3).</li></ul>

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
<div class="callout warn">Cái nào cũng có đuôi <code>.sample</code> nên đều nằm im. Một hook chỉ kích hoạt khi file mang đúng tên hook và có bit thực thi: <code>mv pre-commit.sample pre-commit &amp;&amp; chmod +x pre-commit</code>. Quên <code>chmod +x</code> là lý do phổ biến nhất khiến một hook "chẳng làm gì cả": Git chỉ in một dòng <code>hint:</code> — không phải lỗi — rồi vẫn cho commit đi qua, nên lời nhắc trôi mất mà không ai để ý.</div>

<h3>Những hook đáng biết</h3>
${slide('git-12', 3, 'Dòng thời gian: Git gọi hook nào, lúc nào')}
${slide('git-12', 4, 'Hook là một file: đúng tên + chmod +x')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">pre-commit</span><span class="lz-v">Trước khi commit được tạo. Lint, định dạng, chạy test nhanh, quét bí mật. Khác 0 → commit bị từ chối.</span></div>
  <div class="lz-layer"><span class="lz-k">commit-msg</span><span class="lz-v">Nhận file lời nhắn. Ép Conventional Commits (bài 1.4) hoặc bắt buộc có tham chiếu issue.</span></div>
  <div class="lz-layer"><span class="lz-k">prepare-commit-msg</span><span class="lz-v">Điền sẵn lời nhắn — ví dụ chèn số issue lấy từ tên nhánh.</span></div>
  <div class="lz-layer"><span class="lz-k">pre-push</span><span class="lz-v">Trước khi gửi bất cứ thứ gì. Chỗ đúng cho các phép kiểm chậm hơn: cả bộ test, một lượt kiểm kiểu.</span></div>
  <div class="lz-layer"><span class="lz-k">post-merge / post-checkout</span><span class="lz-v">Sau khi cây làm việc đổi. Hữu ích để chạy <code>npm install</code> khi lockfile thay đổi.</span></div>
  <div class="lz-layer"><span class="lz-k">pre-receive / update</span><span class="lz-v">Phía máy chủ, trên remote. Là những hook duy nhất không ai bỏ qua được — nhưng bạn phải kiểm soát được máy chủ Git mới cài được.</span></div>
</div>

<h3>Một hook pre-commit chặn sai lầm tệ nhất</h3>
${slide('git-12', 5, 'pre-commit chặn ký hiệu xung đột và file lớn')}
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
${slide('git-12', 7, '.git/hooks không đi theo bản clone → core.hooksPath')}
<p><code>.git/</code> không thuộc kho mã, nên hook không bao giờ được clone. Đồng nghiệp của bạn không có cái nào, và một luật chỉ mình bạn áp thì không phải là luật. Hai cách sửa:</p>
<pre><code><span class="tok-comment"># A. Commit một thư mục hook rồi trỏ Git vào đó (Git 2.9+):</span>
mkdir -p .githooks &amp;&amp; mv .git/hooks/pre-commit .githooks/
chmod +x .githooks/pre-commit
git add .githooks &amp;&amp; git commit -m <span class="tok-string">"chore: them git hook dung chung"</span>
git config core.hooksPath .githooks</code></pre>
<p>Các lệnh thì được commit; còn thiết lập <code>core.hooksPath</code> vẫn phải chạy một lần cho mỗi bản clone. Hãy đặt nó vào <code>npm run prepare</code> hay một script cài đặt để nó tự diễn ra.</p>

<h3>B. husky + lint-staged, câu trả lời của hệ sinh thái Node</h3>
${slide('git-12', 8, 'Dự án Node: husky + lint-staged + commitlint')}
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
<div class="callout ok"><strong>Chạy thật thì thấy gì (husky 9.1.7, lint-staged 16.4, 09/2026):</strong> <code>npx husky init</code> thêm <code>"prepare": "husky"</code> và ghi sẵn <code>npm test</code> vào <code>.husky/pre-commit</code> — hãy thay dòng đó, không thì mỗi lần commit lại chạy cả bộ test. Sau đó <code>git config core.hooksPath</code> in ra <code>.husky/_</code>: husky dùng đúng cơ chế <code>core.hooksPath</code> của cách A, chỉ là nó tự đặt hộ bạn sau mỗi lần <code>npm install</code>. Và lint-staged đúng là chỉ đụng tới file đã staging: kho thử staging một file <code>gio.js</code> viết lộn xộn và để nguyên <code>nhap.js</code> cũng lộn xộn mà không staging — commit chứa <code>gio.js</code> đã được định dạng, còn <code>nhap.js</code> không bị đụng tới.</div>

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

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong <code>thu-git</code>: <code>mkdir .githooks</code> rồi tạo <code>.githooks/pre-commit</code> với hai chốt ở slide 5 — <code>git diff --cached --check</code> để bắt ký hiệu xung đột, và một vòng lặp từ chối file đã staging nặng quá 5 MB. Chạy <code>git config core.hooksPath .githooks</code> nhưng <strong>CHƯA</strong> <code>chmod +x</code>. Commit một thay đổi nhỏ bất kỳ và tìm dòng <code>hint:</code> — hook bị bỏ qua và commit vẫn đi qua.</li><li><code>chmod +x .githooks/pre-commit</code>. Giờ dựng lại tai nạn kinh điển của đồ án nhóm: tạo <code>lich.js</code> chứa nguyên một khối <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD</code> … <code>=======</code> … <code>&gt;&gt;&gt;&gt;&gt;&gt;&gt; feature/dat-lich</code>, <code>git add</code> rồi commit. Nó phải bị từ chối kèm <code>leftover conflict marker</code> (ký hiệu xung đột còn sót). Rồi thử một file 6 MB: <code>dd if=/dev/urandom of=demo.mp4 bs=1048576 count=6</code> (macOS/Linux; trên Windows chạy trong Git Bash).</li><li>Bỏ staging và xoá cả hai (<code>git restore --staged lich.js demo.mp4</code>, rồi <code>rm lich.js demo.mp4</code>), sau đó commit chính các hook: <code>git add .githooks</code> và <code>git commit -m "chore: them git hook dung chung"</code>. Kiểm <code>git ls-files -s .githooks</code> hiện chế độ <code>100755</code> (có quyền thực thi).</li><li>Đóng vai bạn cùng nhóm Bình: <code>git clone . ../ban-binh</code>. Trong <code>../ban-binh</code>, <code>git config core.hooksPath</code> không in gì — commit một file có ký hiệu xung đột và nhìn nó lọt qua. Chạy <code>git config core.hooksPath .githooks</code> ở đó rồi thử lại đúng commit ấy.</li></ol>
<pre><code class="language-bash">git commit -m "feat(lich): them gio mo cua"
lich.js:2: leftover conflict marker         <span class="tok-comment"># output thật từ kho thử</span>
lich.js:4: leftover conflict marker
lich.js:6: leftover conflict marker
✋ Còn ký hiệu xung đột hoặc khoảng trắng thừa.</code></pre>
<p><strong>Đạt khi:</strong> cùng một file có xung đột bị chặn trong <code>thu-git</code>, lọt qua bản clone mới <code>ban-binh</code>, rồi cũng bị chặn ở đó sau đúng một dòng <code>git config</code> — và bạn nói được bạn cùng nhóm mặc định đang ở trạng thái nào trong ba trạng thái đó.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">hook</span><span class="v">Móc — script Git tự chạy ở một thời điểm cố định (trước commit, trước push…). Thoát khác 0 là thao tác bị huỷ.</span></div>
  <div class="kv"><span class="k">executable bit (chmod +x)</span><span class="v">Bit thực thi — quyền cho phép một file chạy như chương trình. Thiếu nó, Git bỏ qua hook và chỉ in một dòng nhắc.</span></div>
  <div class="kv"><span class="k">core.hooksPath</span><span class="v">Đường dẫn hook — thiết lập riêng từng bản clone, bảo Git tìm hook trong một thư mục bạn commit (vd <code>.githooks</code>) thay vì <code>.git/hooks</code>.</span></div>
  <div class="kv"><span class="k">staged files</span><span class="v">File đã staging — thứ đang nằm trong index và sẽ vào commit kế tiếp; là thứ duy nhất hook pre-commit nên phán xét.</span></div>
  <div class="kv"><span class="k">husky / lint-staged / commitlint</span><span class="v">Bộ công cụ Node — husky cài hook qua script <code>prepare</code>, lint-staged chạy công cụ định dạng chỉ trên file đã staging, commitlint kiểm định dạng lời nhắn.</span></div>
  <div class="kv"><span class="k">--no-verify</span><span class="v">Bỏ qua kiểm tra — tắt hook pre-commit và commit-msg (với <code>git commit</code>) hoặc pre-push (với <code>git push</code>). Không bao giờ tắt được gì trên máy chủ.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Hook chỉ chạy khi mang đúng tên hook và có bit thực thi; thiếu thì Git in một dòng nhắc rồi làm tiếp.</li><li>Kiểm bằng <code>--cached</code>: phán xét đúng thứ sắp commit, không phải cả cây làm việc.</li><li><code>.git/hooks</code> không bao giờ được clone; hãy commit một thư mục hook và đặt <code>core.hooksPath</code>, hoặc để <code>prepare</code> của husky làm hộ.</li><li>lint-staged giữ pre-commit nhanh vì chỉ đụng file đã staging; commitlint canh lời nhắn ở <code>commit-msg</code>.</li><li>Hook làm việc đúng trở nên nhanh chứ không bắt buộc — phần bắt buộc thuộc về CI và máy chủ (bài 12.3).</li></ul>

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
${slide('git-12', 11, 'Trường tác giả chỉ là chữ tự khai')}
${slide('git-12', 12, 'Ký bằng khoá SSH và xác minh ở máy mình')}
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
${slide('git-12', 13, 'Đọc %G? và ký tag phát hành')}
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
<div class="callout warn"><strong>Two things our test repository showed (git 2.51):</strong> first, before <code>gpg.ssh.allowedSignersFile</code> exists, <code>git log --show-signature</code> prints <code>error: gpg.ssh.allowedSignersFile needs to be configured and exist for ssh signature verification</code> and then <code>No signature</code> — even on a commit that <em>is</em> signed. Read it as "cannot check", not "unsigned". Second, <strong>G</strong> only means "signed by a key in my file": a commit signed with An’s key but committed as <code>binh@example.com</code> still showed <code>G</code>, with <code>Good "git" signature for an@example.com</code>. Git reports whose key it was; comparing that email with the author is your job. A signature from a key that is not in the file shows <code>U</code> and <code>No principal matched.</code>; a commit whose content was edited after signing shows <code>B</code> and <code>incorrect signature</code>.</div>

<h3>GPG, if your organisation requires it</h3>
<pre><code>gpg --full-generate-key                     <span class="tok-comment"># RSA 4096 or ed25519, with an expiry</span>
gpg --list-secret-keys --keyid-format=long  <span class="tok-comment"># find the key id</span>
git config --global user.signingkey 3AA5C34371567BD2
git config --global commit.gpgsign true
gpg --armor --export 3AA5C34371567BD2       <span class="tok-comment"># paste this into GitHub</span></code></pre>
<div class="callout warn">GPG is more work than SSH signing for the same result: a passphrase agent to configure, an expiry to renew, and a key to move between machines. Choose it when a policy or an existing web of trust requires it; otherwise SSH signing gives the same GitHub badge with one line of config.</div>

<h3>The Verified badge — what it does and does not mean</h3>
${slide('git-12', 14, 'Khoá Signing, nhãn Verified, vigilant mode')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Verified</span><span class="lz-v">The signature is valid and the key is registered to a GitHub account whose verified email matches the commit's committer (the person who created the commit object — usually also the author). Real evidence.</span></div>
  <div class="lz-layer"><span class="lz-k">Unverified</span><span class="lz-v">There is a signature, but GitHub cannot match the key — usually because you forgot to add it as a <em>Signing</em> key.</span></div>
  <div class="lz-layer"><span class="lz-k">(no badge)</span><span class="lz-v">Unsigned. The overwhelming majority of commits everywhere.</span></div>
</div>
<div class="callout ok">What it proves: this commit's content was produced by the holder of that private key. What it does <strong>not</strong> prove: that the code is good, that a review happened, or that the key holder is who they claim to be off-platform. It is an identity signal, not a quality one — and it stops one specific, real attack: someone pushing a commit that appears to come from a trusted maintainer.</div>
<div class="callout warn"><strong>Vigilant mode (GitHub Docs, 09/2026).</strong> By default an unsigned commit simply has no badge, so a forged commit and an honest unsigned one look the same. Settings → SSH and GPG keys → <strong>Flag unsigned commits as unverified</strong> changes that for commits bearing your identity: unsigned ones are shown as <strong>Unverified</strong>. A third label appears too — <strong>Partially verified</strong>: the signature is valid, but the commit lists an author who is not the committer and who has vigilant mode on. GitHub’s own advice is to enable it only if you sign <em>all</em> your commits and tags from every machine, because anything unsigned you push afterwards turns Unverified. One more documented detail: once GitHub has verified a signature it stores that result, so the commit stays Verified even if you later rotate or revoke the key.</div>

<h3>Signing tags — the higher-value case</h3>
<pre><code>git tag -s v1.5.0 -m <span class="tok-string">"Release 1.5.0"</span>
git verify-tag v1.5.0
git push origin v1.5.0</code></pre>
<p>If you sign only one thing, sign release tags. A tag is what a build pipeline consumes and what users download; proving that <code>v1.5.0</code> is the version <em>you</em> cut is worth more than proving authorship of one commit among five hundred.</p>

<h3>Requiring signatures on a branch</h3>
<pre><code>Settings → Branches → main → ☑ Require signed commits</code></pre>
<div class="callout warn">Turn this on only after everyone's setup works. GitHub rejects unsigned pushes with a message that does not explain the cause, and an outside contributor with no signing key simply cannot contribute. On an open-source repository this is usually the wrong trade; on a release branch in a regulated environment it is exactly right.</div>

<h3>What signing does not solve</h3>
${slide('git-12', 15, 'Rebase tạo commit mới — chữ ký cũ không đi theo')}
<div class="kv-grid">
  <div class="kv"><span class="k">Rebase and squash break signatures</span><span class="v">They create new commits (8.1), so the original signature no longer applies. Squash-merge on GitHub re-signs with GitHub's own key — the badge stays, the author's signature does not survive.</span></div>
  <div class="kv"><span class="k">A stolen key signs happily</span><span class="v">Signing proves possession of a key, not that the right person holds it. Protect the private key with a passphrase; revoke it the moment a machine is lost.</span></div>
  <div class="kv"><span class="k">CI cannot sign as you</span><span class="v">Automation needs its own key or a bot identity. Never put your personal signing key in a secret (11.2).</span></div>
</div>
<pre><code class="language-bash">git -c commit.gpgsign=false rebase --force-rebase HEAD~3
git log --format=<span class="tok-string">'%h %G? %an %s'</span> -3</code></pre>
<div class="out">fb6065b N Tran Thi Binh refactor(auth): tach ham dem
d13ed49 N Nguyen Van An test(auth): them ca het han
6e0c5f4 N Nguyen Van An feat(auth): them xoay vong refresh token</div>
<pre><code class="language-bash">git rebase --force-rebase HEAD~3            <span class="tok-comment"># commit.gpgsign=true this time</span>
git log --format=<span class="tok-string">'%h %G? %an %s'</span> -3</code></pre>
<div class="out">58e7113 G Tran Thi Binh refactor(auth): tach ham dem
d6aecb7 G Nguyen Van An test(auth): them ca het han
f7659bb G Nguyen Van An feat(auth): them xoay vong refresh token</div>
<div class="callout ok">Real output from our test repository. A rebase without signing strips every signature. With <code>commit.gpgsign</code> on, Git re-signs each rewritten commit with <em>your</em> key — including Bình’s <code>58e7113</code>, which now carries An’s signature under Bình’s name. So a signature proves who <strong>created that commit object</strong> (whoever rebased), not who wrote the code. (The first commit came back as <code>f7659bb</code>, its original hash: same content, same parent, and an Ed25519 signature is deterministic.)</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>Make a key used only for signing, so nothing about your push setup changes: <code>ssh-keygen -t ed25519 -C "your-email" -f ~/.ssh/id_ed25519_ky</code> (Git Bash on Windows accepts the same line).</li><li>Turn signing on <strong>for <code>thu-git</code> only</strong> — no <code>--global</code>: <code>git config gpg.format ssh</code>, <code>git config user.signingkey ~/.ssh/id_ed25519_ky.pub</code>, <code>git config commit.gpgsign true</code>. Commit something and run <code>git log --show-signature -1</code>: read the <code>allowedSignersFile</code> error and the misleading <code>No signature</code>.</li><li>Trust your own key: <code>echo "$(git config user.email) $(cat ~/.ssh/id_ed25519_ky.pub)" &gt;&gt; ~/.git-allowed-signers</code>, then <code>git config gpg.ssh.allowedSignersFile ~/.git-allowed-signers</code>. Run <code>git log --show-signature -1</code> again, then <code>git log --format='%h %G? %an %s' -5</code>.</li><li>Pretend to be Bình: <code>git -c user.name="Binh" -c user.email=binh@example.com commit --allow-empty -m "thu gia danh"</code>. It shows <code>G</code> — read the <code>Good "git" signature for …</code> line and write down whose key it names. Finish with <code>git tag -s v0.1-thu -m "thu ky tag"</code> and <code>git verify-tag v0.1-thu</code>.</li><li>(With a GitHub account) add <code>~/.ssh/id_ed25519_ky.pub</code> under Settings → SSH and GPG keys as a <strong>Signing Key</strong>, push a branch of <code>thu-git</code>, and open the commit list: your new commits say Verified.</li></ol>
<pre><code class="language-bash">git log --format=<span class="tok-string">'%h %G? %an %s'</span> -4        <span class="tok-comment"># real output from our test repo</span>
5eed59f U Tran Thi Binh refactor(auth): tach ham dem
2603516 N Nguyen Van An test(auth): them ca het han
f7659bb G Nguyen Van An feat(auth): them xoay vong refresh token
261dc96 N Tran Thi Binh chore(deps): them package-lock</code></pre>
<p><strong>Done when:</strong> <code>%G?</code> shows <code>G</code> on the commits you made after step 2 and <code>N</code> on the older ones, <code>git verify-tag</code> prints a Good signature, and you can explain in one sentence why the "thu gia danh" commit is <code>G</code> yet proves nothing about Bình.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">signature</span><span class="v">A cryptographic proof, stored inside the commit or tag, that the holder of one private key produced exactly this content.</span></div>
  <div class="kv"><span class="k">gpg.format ssh / user.signingkey</span><span class="v">The two settings that make Git sign with an SSH key (Git 2.34+) instead of GPG, and say which key.</span></div>
  <div class="kv"><span class="k">allowed signers file</span><span class="v">Your local list of "this email ↔ this public key". Git needs it to verify SSH signatures at all.</span></div>
  <div class="kv"><span class="k">%G?</span><span class="v">The <code>git log</code> placeholder for signature status: G good, U good but unknown key, N none, B bad.</span></div>
  <div class="kv"><span class="k">Signing Key vs Authentication Key</span><span class="v">Two separate registrations of a key on GitHub: one lets you push, the other makes commits Verified.</span></div>
  <div class="kv"><span class="k">vigilant mode</span><span class="v">A GitHub setting that marks your unsigned commits as Unverified instead of showing no badge.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li><code>user.name</code> and <code>user.email</code> are self-declared; only a signature is evidence.</li><li>SSH signing is three config lines plus an allowed signers file to verify locally.</li><li><code>G</code> means "signed by a key in my file" — always read whose key the Good line names.</li><li>GitHub needs the key registered a second time as a Signing Key; vigilant mode flags your unsigned commits.</li><li>Rebase makes new commits: signatures are dropped, or re-made with the key of whoever rebased.</li></ul>

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
${slide('git-12', 11, 'Trường tác giả chỉ là chữ tự khai')}
${slide('git-12', 12, 'Ký bằng khoá SSH và xác minh ở máy mình')}
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
${slide('git-12', 13, 'Đọc %G? và ký tag phát hành')}
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
<div class="callout warn"><strong>Hai điều kho thử cho thấy (git 2.51):</strong> thứ nhất, khi chưa có <code>gpg.ssh.allowedSignersFile</code>, <code>git log --show-signature</code> in <code>error: gpg.ssh.allowedSignersFile needs to be configured and exist for ssh signature verification</code> rồi ghi <code>No signature</code> — kể cả với commit <em>có</em> ký. Hãy đọc là "không kiểm được", đừng đọc là "không ký". Thứ hai, <strong>G</strong> chỉ nghĩa là "được ký bởi một khoá có trong file của tôi": một commit ký bằng khoá của An nhưng committer khai là <code>binh@example.com</code> vẫn hiện <code>G</code>, kèm dòng <code>Good "git" signature for an@example.com</code>. Git báo khoá đó là của ai; so email ấy với tác giả là việc của bạn. Chữ ký từ một khoá không có trong file hiện <code>U</code> và <code>No principal matched.</code> (không khớp danh tính nào); một commit bị sửa nội dung sau khi ký hiện <code>B</code> và <code>incorrect signature</code> (chữ ký sai).</div>

<h3>GPG, nếu tổ chức của bạn yêu cầu</h3>
<pre><code>gpg --full-generate-key                     <span class="tok-comment"># RSA 4096 hoặc ed25519, kèm hạn dùng</span>
gpg --list-secret-keys --keyid-format=long  <span class="tok-comment"># tìm id khoá</span>
git config --global user.signingkey 3AA5C34371567BD2
git config --global commit.gpgsign true
gpg --armor --export 3AA5C34371567BD2       <span class="tok-comment"># dán cái này vào GitHub</span></code></pre>
<div class="callout warn">GPG tốn công hơn ký bằng SSH cho cùng một kết quả: phải cấu hình một agent giữ mật khẩu, phải gia hạn khoá, và phải chuyển khoá giữa các máy. Hãy chọn nó khi một chính sách hoặc một mạng lưới tin cậy sẵn có đòi hỏi; còn lại, ký bằng SSH cho đúng cái huy hiệu GitHub ấy chỉ với một dòng cấu hình.</div>

<h3>Huy hiệu Verified — nó nghĩa là gì và không nghĩa là gì</h3>
${slide('git-12', 14, 'Khoá Signing, nhãn Verified, vigilant mode')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Verified</span><span class="lz-v">Chữ ký hợp lệ và khoá được đăng ký với một tài khoản GitHub có email đã xác minh khớp với committer của commit (người tạo ra đối tượng commit — thường cũng là tác giả). Bằng chứng thật.</span></div>
  <div class="lz-layer"><span class="lz-k">Unverified</span><span class="lz-v">Có chữ ký, nhưng GitHub không khớp được cái khoá — thường vì bạn quên thêm nó với vai trò <em>Signing</em>.</span></div>
  <div class="lz-layer"><span class="lz-k">(không có huy hiệu)</span><span class="lz-v">Không ký. Đại đa số commit ở khắp mọi nơi.</span></div>
</div>
<div class="callout ok">Nó chứng minh: nội dung commit này do người giữ khoá riêng đó tạo ra. Nó <strong>KHÔNG</strong> chứng minh: rằng mã tốt, rằng đã có review, hay rằng người giữ khoá đúng là người họ tự nhận ở ngoài đời. Đó là một tín hiệu về danh tính, không phải về chất lượng — và nó chặn được đúng một cuộc tấn công cụ thể, có thật: có kẻ push một commit trông như đến từ một người bảo trì đáng tin.</div>
<div class="callout warn"><strong>Vigilant mode — chế độ cảnh giác (GitHub Docs, 09/2026).</strong> Mặc định một commit không ký chỉ đơn giản là không có huy hiệu, nên một commit giả danh và một commit trung thực mà không ký trông y hệt nhau. Settings → SSH and GPG keys → <strong>Flag unsigned commits as unverified</strong> đổi điều đó cho các commit mang danh tính của bạn: commit không ký sẽ hiện <strong>Unverified</strong>. Xuất hiện thêm nhãn thứ ba — <strong>Partially verified</strong> (xác minh một phần): chữ ký hợp lệ, nhưng commit có một tác giả khác committer và người đó đang bật vigilant mode. Chính GitHub khuyên chỉ bật khi bạn ký <em>MỌI</em> commit và tag từ mọi máy, vì bất cứ thứ gì không ký bạn push sau đó đều thành Unverified. Thêm một chi tiết có trong docs: khi GitHub đã xác minh một chữ ký thì nó lưu kết quả lại, nên commit vẫn Verified kể cả khi sau này bạn thay hoặc thu hồi khoá.</div>

<h3>Ký tag — trường hợp giá trị hơn</h3>
<pre><code>git tag -s v1.5.0 -m <span class="tok-string">"Release 1.5.0"</span>
git verify-tag v1.5.0
git push origin v1.5.0</code></pre>
<p>Nếu chỉ ký một thứ, hãy ký tag phát hành. Một tag là thứ mà pipeline dựng bản tiêu thụ và là thứ người dùng tải về; chứng minh rằng <code>v1.5.0</code> đúng là bản <em>bạn</em> cắt ra đáng giá hơn chứng minh quyền tác giả của một commit giữa năm trăm cái.</p>

<h3>Bắt buộc chữ ký trên một nhánh</h3>
<pre><code>Settings → Branches → main → ☑ Require signed commits</code></pre>
<div class="callout warn">Chỉ bật cái này sau khi thiết lập của mọi người đã chạy. GitHub từ chối các lần push không ký kèm một thông báo không giải thích nguyên nhân, và một người đóng góp bên ngoài không có khoá ký thì đơn giản là không đóng góp được. Trên một kho mã nguồn mở thì đây thường là đánh đổi sai; trên một nhánh phát hành trong môi trường có quy định thì lại chính xác là đúng.</div>

<h3>Ký không giải quyết được cái gì</h3>
${slide('git-12', 15, 'Rebase tạo commit mới — chữ ký cũ không đi theo')}
<div class="kv-grid">
  <div class="kv"><span class="k">Rebase và squash phá chữ ký</span><span class="v">Chúng tạo ra commit mới (bài 8.1), nên chữ ký gốc không còn áp dụng. Squash-merge trên GitHub ký lại bằng khoá của chính GitHub — huy hiệu vẫn còn, chữ ký của tác giả thì không sống sót.</span></div>
  <div class="kv"><span class="k">Một khoá bị đánh cắp vẫn ký ngon lành</span><span class="v">Ký chứng minh việc sở hữu một khoá, không chứng minh đúng người đang giữ nó. Hãy bảo vệ khoá riêng bằng mật khẩu; thu hồi nó ngay khoảnh khắc mất một cái máy.</span></div>
  <div class="kv"><span class="k">CI không ký thay bạn được</span><span class="v">Việc tự động cần khoá riêng của nó hoặc một danh tính bot. Đừng bao giờ đặt khoá ký cá nhân vào một secret (bài 11.2).</span></div>
</div>
<pre><code class="language-bash">git -c commit.gpgsign=false rebase --force-rebase HEAD~3
git log --format=<span class="tok-string">'%h %G? %an %s'</span> -3</code></pre>
<div class="out">fb6065b N Tran Thi Binh refactor(auth): tach ham dem
d13ed49 N Nguyen Van An test(auth): them ca het han
6e0c5f4 N Nguyen Van An feat(auth): them xoay vong refresh token</div>
<pre><code class="language-bash">git rebase --force-rebase HEAD~3            <span class="tok-comment"># lần này commit.gpgsign=true</span>
git log --format=<span class="tok-string">'%h %G? %an %s'</span> -3</code></pre>
<div class="out">58e7113 G Tran Thi Binh refactor(auth): tach ham dem
d6aecb7 G Nguyen Van An test(auth): them ca het han
f7659bb G Nguyen Van An feat(auth): them xoay vong refresh token</div>
<div class="callout ok">Output thật từ kho thử. Rebase mà không ký thì mọi chữ ký bị tước sạch. Bật <code>commit.gpgsign</code> thì Git ký lại từng commit được viết lại bằng khoá của <em>BẠN</em> — kể cả <code>58e7113</code> của Bình, giờ mang chữ ký của An dưới tên Bình. Vậy chữ ký chứng minh ai đã <strong>tạo ra đối tượng commit đó</strong> (người chạy rebase), không chứng minh ai viết mã. (Commit đầu tiên quay lại đúng mã băm cũ <code>f7659bb</code>: cùng nội dung, cùng cha, và chữ ký Ed25519 là tất định — ký lại ra y hệt.)</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Tạo một khoá chỉ dùng để ký, để thiết lập push của bạn không bị ảnh hưởng gì: <code>ssh-keygen -t ed25519 -C "email-cua-ban" -f ~/.ssh/id_ed25519_ky</code> (Git Bash trên Windows nhận đúng dòng này).</li><li>Bật ký <strong>CHỈ cho <code>thu-git</code></strong> — không dùng <code>--global</code>: <code>git config gpg.format ssh</code>, <code>git config user.signingkey ~/.ssh/id_ed25519_ky.pub</code>, <code>git config commit.gpgsign true</code>. Commit một thứ gì đó rồi chạy <code>git log --show-signature -1</code>: đọc lỗi <code>allowedSignersFile</code> và dòng <code>No signature</code> dễ gây hiểu lầm.</li><li>Tin khoá của chính bạn: <code>echo "$(git config user.email) $(cat ~/.ssh/id_ed25519_ky.pub)" &gt;&gt; ~/.git-allowed-signers</code>, rồi <code>git config gpg.ssh.allowedSignersFile ~/.git-allowed-signers</code>. Chạy lại <code>git log --show-signature -1</code>, rồi <code>git log --format='%h %G? %an %s' -5</code>.</li><li>Giả làm Bình: <code>git -c user.name="Binh" -c user.email=binh@example.com commit --allow-empty -m "thu gia danh"</code>. Nó hiện <code>G</code> — đọc dòng <code>Good "git" signature for …</code> và ghi lại nó nêu khoá của ai. Kết thúc bằng <code>git tag -s v0.1-thu -m "thu ky tag"</code> và <code>git verify-tag v0.1-thu</code>.</li><li>(Nếu có tài khoản GitHub) thêm <code>~/.ssh/id_ed25519_ky.pub</code> ở Settings → SSH and GPG keys với loại <strong>Signing Key</strong>, push một nhánh của <code>thu-git</code>, rồi mở danh sách commit: các commit mới ghi Verified.</li></ol>
<pre><code class="language-bash">git log --format=<span class="tok-string">'%h %G? %an %s'</span> -4        <span class="tok-comment"># output thật từ kho thử</span>
5eed59f U Tran Thi Binh refactor(auth): tach ham dem
2603516 N Nguyen Van An test(auth): them ca het han
f7659bb G Nguyen Van An feat(auth): them xoay vong refresh token
261dc96 N Tran Thi Binh chore(deps): them package-lock</code></pre>
<p><strong>Đạt khi:</strong> <code>%G?</code> ra <code>G</code> cho các commit bạn tạo sau bước 2 và <code>N</code> cho các commit cũ hơn, <code>git verify-tag</code> in ra một chữ ký Good, và bạn giải thích được trong một câu vì sao commit "thu gia danh" là <code>G</code> mà chẳng chứng minh được gì về Bình.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">signature</span><span class="v">Chữ ký — bằng chứng mật mã nằm ngay trong commit hay tag, cho thấy người giữ một khoá riêng đã tạo ra đúng nội dung này.</span></div>
  <div class="kv"><span class="k">gpg.format ssh / user.signingkey</span><span class="v">Định dạng ký / khoá ký — hai thiết lập bảo Git ký bằng khoá SSH (Git 2.34+) thay vì GPG, và ký bằng khoá nào.</span></div>
  <div class="kv"><span class="k">allowed signers file</span><span class="v">Danh sách người ký được tin — file ở máy bạn ghi "email này ↔ khoá công khai này". Thiếu nó Git không xác minh được chữ ký SSH nào.</span></div>
  <div class="kv"><span class="k">%G?</span><span class="v">Mã trạng thái chữ ký trong <code>git log</code>: G tốt, U tốt nhưng khoá lạ, N không ký, B chữ ký sai.</span></div>
  <div class="kv"><span class="k">Signing Key vs Authentication Key</span><span class="v">Khoá ký và khoá xác thực — hai lần đăng ký tách biệt của một khoá trên GitHub: một cái cho push, cái kia làm commit hiện Verified.</span></div>
  <div class="kv"><span class="k">vigilant mode</span><span class="v">Chế độ cảnh giác — thiết lập GitHub đánh dấu commit không ký của bạn là Unverified thay vì để trống huy hiệu.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li><code>user.name</code> và <code>user.email</code> là tự khai; chỉ chữ ký mới là bằng chứng.</li><li>Ký bằng SSH là ba dòng cấu hình, cộng một file allowed signers để xác minh ở máy mình.</li><li><code>G</code> nghĩa là "ký bằng một khoá có trong file của tôi" — luôn đọc xem dòng Good nêu khoá của ai.</li><li>GitHub cần khoá được đăng ký lần hai với loại Signing Key; vigilant mode gắn cờ commit không ký của bạn.</li><li>Rebase tạo commit mới: chữ ký bị bỏ, hoặc được ký lại bằng khoá của người chạy rebase.</li></ul>

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

    /* ─────────────────────────── 12.3 (mới) ─────────────────────────── */
    {
      title: '12.3 — Enforcing it for real: server-side hooks, rulesets and CI|||12.3 — Cưỡng chế thật: hook phía máy chủ, ruleset và CI',
      slug: 'git-12-4-chinh-sach-may-chu',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao luật chỉ đứng vững ở nơi lần push hạ cánh: viết hook pre-receive cho máy chủ giả, CI chạy lại đúng các phép kiểm của hook, và những thứ github.com cho thay thế (ruleset, push protection, required checks).',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>Where a rule actually holds</h2>
<p class="lead">Everything in 12.1 runs on a laptop you do not control. A teammate can pass <code>--no-verify</code>, clone without running <code>npm install</code>, or edit a file in the GitHub web editor where no hook exists at all. A rule is only guaranteed at the place every change must pass through: the server that receives the push, and the CI job that guards the merge button. This lesson builds both in your playground and maps each one to what github.com gives you.</p>

<h3>Three places a check can run</h3>
${slide('git-12', 10, '--no-verify: vì sao CI vẫn phải kiểm lại')}
<p>The same check — "no leftover conflict markers" — can live in three places, and each place has a different price and a different guarantee. In the pre-commit hook it costs nothing and catches the mistake before the commit exists, but it can be skipped. In CI it runs on every commit of the pull request and cannot be skipped once it is a required check, but you only hear about it minutes later. On the server it is checked at the moment of the push, for everyone, with no way around it.</p>
<pre><code class="language-bash">git commit --no-verify -m <span class="tok-string">"wip: do dang"</span>      <span class="tok-comment"># lich.js still contains &lt;&lt;&lt;&lt;&lt;&lt;&lt;</span></code></pre>
<div class="out">[main a32d775] wip: do dang
 1 file changed, 6 insertions(+)
 create mode 100644 lich.js</div>
<pre><code class="language-bash"><span class="tok-comment"># what the CI step runs: the SAME check, over every commit not yet on main</span>
git diff --check origin/main HEAD; <span class="tok-keyword">echo</span> <span class="tok-string">"exit=\$?"</span></code></pre>
<div class="out">lich.js:2: leftover conflict marker
lich.js:4: leftover conflict marker
lich.js:6: leftover conflict marker
exit=2</div>
<p>Real output from our test repository. The hook was bypassed, and the identical <code>git diff --check</code> — pointed at a range instead of the index — found the markers anyway. A non-zero exit code is all a CI step needs to turn red, and a red required check is what blocks the merge.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">pre-commit / pre-push</span><span class="v">Instant feedback, runs on the author’s machine. Skippable with <code>--no-verify</code>, absent in a fresh clone.</span></div>
  <div class="kv"><span class="k">CI + required check</span><span class="v">Runs on every pull request, unskippable once required (6.4). Minutes of delay; does not stop a direct push to an unprotected branch.</span></div>
  <div class="kv"><span class="k">Server (pre-receive, rulesets)</span><span class="v">Checked at the moment of every push, for every person. Must be fast, and you must control the server — or use what GitHub offers.</span></div>
</div>

<h3>How a server refuses a push: pre-receive</h3>
${slide('git-12', 16, 'Máy chủ từ chối: hook pre-receive')}
<p>When you push, the server first receives the objects, and <em>before</em> moving any branch it runs the <code>pre-receive</code> hook. The hook reads one line per ref on standard input — <code>&lt;old sha&gt; &lt;new sha&gt; &lt;ref name&gt;</code> — and if it exits non-zero, <strong>the whole push is refused</strong>: no ref moves, and the new objects are thrown away (Git keeps them in a quarantine area until the hook says yes). Whatever the hook prints to its output reaches the pusher prefixed with <code>remote:</code>. Two relatives: <code>update</code> runs once per ref and can refuse just that ref; <code>post-receive</code> runs after everything is accepted and cannot refuse anything — it is where servers send notifications or trigger deploys.</p>
<p>Your playground already has a server: the bare repository <code>thu-git-server.git</code>, created in Lesson 4.1 and used throughout Chapter 5. A bare repository has a <code>hooks/</code> directory of its own, and a hook placed there runs for every push from every clone. Here is one that accepts only signed commits on <code>main</code>, and no conflict markers:</p>
<pre><code class="language-bash"><span class="tok-comment">#!/bin/sh</span>
<span class="tok-comment"># thu-git-server.git/hooks/pre-receive — runs ON THE SERVER, once per push.</span>
<span class="tok-comment"># stdin: &lt;old sha&gt; &lt;new sha&gt; &lt;ref name&gt;, one line per ref. Non-zero exit = refuse the WHOLE push.</span>
zero=0000000000000000000000000000000000000000
<span class="tok-keyword">while</span> read old new ref; <span class="tok-keyword">do</span>
  [ <span class="tok-string">"\$ref"</span> = <span class="tok-string">"refs/heads/main"</span> ] || <span class="tok-keyword">continue</span>          <span class="tok-comment"># only guard main</span>
  [ <span class="tok-string">"\$new"</span> = <span class="tok-string">"\$zero"</span> ] &amp;&amp; { <span class="tok-keyword">echo</span> <span class="tok-string">"✋ Không được xoá main."</span>; <span class="tok-keyword">exit</span> 1; }
  range=\$new; [ <span class="tok-string">"\$old"</span> != <span class="tok-string">"\$zero"</span> ] &amp;&amp; range=\$old..\$new
  <span class="tok-keyword">for</span> c <span class="tok-keyword">in</span> \$(git rev-list \$range); <span class="tok-keyword">do</span>
    <span class="tok-keyword">if</span> ! git verify-commit <span class="tok-string">"\$c"</span> &gt;/dev/null 2&gt;&amp;1; <span class="tok-keyword">then</span>
      <span class="tok-keyword">echo</span> <span class="tok-string">"✋ \$(git log -1 --format='%h %s' \$c) — chưa ký, hoặc khoá không có trong allowed-signers."</span>
      <span class="tok-keyword">exit</span> 1
    <span class="tok-keyword">fi</span>
    <span class="tok-keyword">if</span> ! git diff --check <span class="tok-string">"\$c^"</span> <span class="tok-string">"\$c"</span> &gt;/dev/null 2&gt;&amp;1; <span class="tok-keyword">then</span>
      <span class="tok-keyword">echo</span> <span class="tok-string">"✋ \$(git log -1 --format='%h %s' \$c) — còn ký hiệu xung đột."</span>
      <span class="tok-keyword">exit</span> 1
    <span class="tok-keyword">fi</span>
  <span class="tok-keyword">done</span>
<span class="tok-keyword">done</span>
<span class="tok-keyword">exit</span> 0</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># on the "server": trust the team's keys, then activate the hook</span>
cp ~/.git-allowed-signers ../thu-git-server.git/allowed-signers
git -C ../thu-git-server.git config gpg.ssh.allowedSignersFile allowed-signers
chmod +x ../thu-git-server.git/hooks/pre-receive</code></pre>
<p>A zero hash in the "new" column means the ref is being deleted; in the "old" column, that the branch is new — which is why the hook builds the range differently. Now push an unsigned commit, skipping your own pre-push hook on purpose:</p>
<pre><code class="language-bash">git -c commit.gpgsign=false commit -qm <span class="tok-string">"feat(phong): khoa phong P101"</span>
git push --no-verify origin main</code></pre>
<div class="out">remote: ✋ da7f9a8 feat(phong): khoa phong P101 — chưa ký, hoặc khoá không có trong allowed-signers.
To ../thu-git-server.git
 ! [remote rejected] main -&gt; main (pre-receive hook declined)
error: failed to push some refs to '../thu-git-server.git'</div>
<pre><code class="language-bash">git commit --amend --no-edit -S
git push --no-verify origin main</code></pre>
<div class="out">To ../thu-git-server.git
   261dc96..008f549  main -&gt; main</div>
<div class="callout ok"><strong><code>--no-verify</code> only reaches your own machine.</strong> It skipped An’s pre-push hook, and the server refused anyway, because the server’s hook is not part of anyone’s clone. Signing the same commit (<code>--amend -S</code> gives it a new hash, <code>008f549</code>) was the only way in. A signed commit that still contained <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> was refused by the second check: <code>remote: ✋ 1dd3224 feat(lich): gio mo cua — còn ký hiệu xung đột.</code></div>
<div class="callout warn">Every pusher waits for this hook, so keep it short. GitHub Enterprise Server documents a budget of five seconds for all pre-receive hooks combined (09/2026). Heavy work — tests, builds, scans of the whole history — belongs in CI, not in the push path.</div>

<h3>github.com has no pre-receive for you — here is what replaces it</h3>
<p>On github.com you cannot install your own server hooks; custom pre-receive hooks exist only on <strong>GitHub Enterprise Server</strong>, the version a company runs on its own machines. What you get instead are built-in rules that do the common jobs (GitHub Docs, 09/2026):</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Signatures → Require signed commits</span><span class="lz-v">A branch-protection or ruleset rule: only signed and verified commits can be pushed to the branch. GitHub’s docs add a trap — unsigned commits on a pull request’s branch can block even a squash merge, although GitHub would sign the squash commit itself.</span></div>
  <div class="lz-layer"><span class="lz-k">Big files, paths, extensions → push rulesets</span><span class="lz-v">Refuse commits containing files over a size, under a path, or with an extension. Available for <strong>private or internal</strong> repositories, and enforced across the repository’s whole fork network.</span></div>
  <div class="lz-layer"><span class="lz-k">Secrets → push protection</span><span class="lz-v">Scans each push for known credential formats and refuses it (11.3).</span></div>
  <div class="lz-layer"><span class="lz-k">Everything else → required status checks</span><span class="lz-v">Lint, types, tests, conflict markers, commit messages: run them in Actions and make the job required (6.4, 11.2).</span></div>
</div>
<div class="callout warn">Rulesets on a <em>private</em> repository need a paid plan (Pro, Team or Enterprise — Pro comes free with the Student Developer Pack); on a public repository they are free (6.4). Before promising your SWP391 group "the server will refuse it", open Settings → Rules on the actual repository and check the rule is there.</div>

<h3>The CI job that re-checks everything</h3>
<p>The cheapest way to make hooks mandatory is to run the same commands again in CI, over the whole pull request instead of the index:</p>
<pre><code class="language-yaml"><span class="tok-comment"># .github/workflows/kiem-lai.yml — re-run the hooks' checks on the WHOLE pull request</span>
name: Kiem lai
on: [pull_request]
jobs:
  kiem-lai:
    name: Re-check hooks            <span class="tok-comment"># make this name a required status check (6.4)</span>
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0            <span class="tok-comment"># full history, to compare with the target branch</span>
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - name: Ky hieu xung dot + khoang trang thua
        run: git diff --check origin/&#36;{{ github.base_ref }}...HEAD
      - name: Loi nhan commit
        run: npx commitlint --from origin/&#36;{{ github.base_ref }} --to HEAD</code></pre>
<p>Two details decide whether this works. <code>fetch-depth: 0</code> — the default checkout has a single commit, so there is no <code>origin/main</code> to compare with and the range fails. And <code>...</code> (three dots) compares from the point where the branch left <code>main</code>, so the check judges only the pull request’s own changes, not whatever landed on <code>main</code> meanwhile. (We checked the file with actionlint 1.7.12: no findings.)</p>

<h3>Secrets: the one check you want at every layer</h3>
${slide('git-12', 6, 'pre-commit bắt bí mật — gitleaks chỉ quét phần đã staging')}
<p>Most checks can wait for CI. A secret cannot: by the time CI sees it, the key is already in a commit on GitHub, and the fix becomes rotation plus a history rewrite (8.3). So secrets get a check at every layer — <code>gitleaks git --pre-commit --staged --redact</code> in the pre-commit hook (<code>brew install gitleaks</code> on a Mac; builds for Linux and Windows are on its GitHub page), push protection on GitHub, and a scan in CI for whatever slipped through.</p>
<pre><code class="language-bash">git add config.js &amp;&amp; git commit -m <span class="tok-string">"feat(upload): ket noi S3"</span></code></pre>
<div class="out">Finding:     REDACTED
Secret:      REDACTED
RuleID:      aws-access-token
File:        config.js
Line:        1
…
3:14PM WRN leaks found: 2</div>
<p>Real output from the test repository, with a made-up key in the AWS format. <code>--redact</code> matters: without it the tool prints the secret into your terminal — and into CI logs, which other people can read.</p>

<h3>pre-push: a local mirror of branch protection</h3>
${slide('git-12', 9, 'pre-push canh main · post-merge nhắc npm install')}
<p>A pre-push hook receives the refs being pushed on standard input (<code>&lt;local ref&gt; &lt;local sha&gt; &lt;remote ref&gt; &lt;remote sha&gt;</code>), so it can refuse a push to <code>main</code> before it leaves your laptop — the same rule branch protection enforces, but with a friendlier message and no round trip:</p>
<div class="out">✋ Không push thẳng lên main — đẩy nhánh rồi mở pull request (bài 6.4).
error: failed to push some refs to '../thu-git-server.git'</div>
<p>It is still a convenience. The rule that holds is the protected branch on GitHub; the hook just saves you from reading <code>GH006: Protected branch update failed</code>. The same slide shows a hook that never refuses anything: <code>post-merge</code>, which runs after a successful <code>git pull</code> and here reminds you to run <code>npm install</code> because <code>package-lock.json</code> changed.</p>

<div class="pitfall co-tieu-de"><strong>How this goes wrong in a student team project.</strong> The group installs husky, every laptop refuses conflict markers, and everyone relaxes. Then, the night before the demo, one member resolves a conflict in the GitHub web editor — no hooks there — or commits with <code>--no-verify</code> "just this once", and <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> lands on <code>main</code>. The build breaks during the presentation. The fix was never a stricter hook: it was one CI step with <code>git diff --check</code> and a required check on <code>main</code>, so that the path around the hooks leads to a red X instead of a merge.</div>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><ol><li>In your playground server <code>thu-git-server.git</code>, create <code>hooks/pre-receive</code> with the conflict-marker check from this lesson (the signature check too, if you did the 12.2 practice — then also copy your allowed signers file and set <code>gpg.ssh.allowedSignersFile</code> in the server’s config). <code>chmod +x</code> it.</li><li>In <code>thu-git</code>, commit a file containing a <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>/<code>=======</code>/<code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> block with <code>git commit --no-verify</code>, then <code>git push --no-verify origin main</code>. Read the <code>remote:</code> line and the <code>(pre-receive hook declined)</code>.</li><li>Run the CI check by hand: <code>git diff --check origin/main HEAD; echo $?</code> — note the exit code a CI step would see.</li><li>Undo the bad commit with <code>git reset --hard origin/main</code> (it was never accepted, so nobody else has it), make a clean commit and push: it is accepted.</li><li>Write down for your group which of your real project’s rules live in hooks, which in CI, and which in GitHub rules — and one that currently lives nowhere.</li></ol>
<pre><code class="language-bash">git push --no-verify origin main              <span class="tok-comment"># real output from our test repo</span>
remote: ✋ 1dd3224 feat(lich): gio mo cua — còn ký hiệu xung đột.
To ../thu-git-server.git
 ! [remote rejected] main -&gt; main (pre-receive hook declined)</code></pre>
<p><strong>Done when:</strong> the server refuses your <code>--no-verify</code> push with your own <code>remote:</code> message, <code>git diff --check</code> exits with 2 on the bad range and 0 after the reset, and a clean push goes through.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">pre-receive</span><span class="v">A hook on the server, run once per push before any ref moves. Non-zero exit refuses the entire push.</span></div>
  <div class="kv"><span class="k">update / post-receive</span><span class="v"><code>update</code> runs once per ref and can refuse just that ref; <code>post-receive</code> runs afterwards and can only notify or deploy.</span></div>
  <div class="kv"><span class="k">bare repository</span><span class="v">A repository with no working tree, used as a server (<code>git init --bare</code>). Its hooks live in <code>hooks/</code> at the top level.</span></div>
  <div class="kv"><span class="k">required status check</span><span class="v">A CI job that must be green before a pull request can merge — the GitHub way to make a hook’s check unskippable.</span></div>
  <div class="kv"><span class="k">push ruleset</span><span class="v">A GitHub rule that refuses pushes by file size, path or extension; private and internal repositories only.</span></div>
</div>

<h3>📌 Summary</h3>
<ul><li>A rule holds only where every change must pass: the server that receives the push and the CI that guards the merge.</li><li><code>pre-receive</code> reads old/new/ref lines and refuses the whole push with a non-zero exit — <code>--no-verify</code> cannot reach it.</li><li>github.com gives no custom server hooks; use Require signed commits, push rulesets, push protection and required checks instead.</li><li>Make hooks mandatory by running the same commands in CI over the pull request (<code>fetch-depth: 0</code>, three-dot range).</li><li>Secrets are the exception that needs every layer, because a key that reaches GitHub must be rotated.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/githooks" target="_blank" rel="noopener">
  <span class="lc-ico">🪝</span>
  <span class="lc-body"><span class="lc-title">githooks — pre-receive, update, post-receive</span><span class="lc-sub">The exact stdin format, the quarantine area, and what each exit code does.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Available rules for rulesets</span><span class="lc-sub">Require signed commits, push rulesets (file size, path, extension), status checks.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/enterprise-server@latest/admin/enforcing-policies/enforcing-policy-with-pre-receive-hooks/about-pre-receive-hooks" target="_blank" rel="noopener">
  <span class="lc-ico">🏢</span>
  <span class="lc-body"><span class="lc-title">GitHub Enterprise Server — About pre-receive hooks</span><span class="lc-sub">Where custom server hooks do exist on GitHub, and their five-second budget.</span></span>
</a>
<p class="note-ct"><strong>The way to think about it:</strong> ask of every rule, "what happens to the person who does not follow it?" If the answer is "nothing, unless they happen to have our hooks installed", the rule is a suggestion. Put the suggestion in a hook so doing it right is fast, and put the rule where the push lands.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Luật chỉ đứng vững ở đâu</h2>
<p class="lead">Mọi thứ ở bài 12.1 chạy trên một cái laptop mà bạn không kiểm soát. Bạn cùng nhóm có thể gõ <code>--no-verify</code>, clone về mà không chạy <code>npm install</code>, hoặc sửa file ngay trong trình soạn thảo web của GitHub — nơi không có hook nào cả. Một luật chỉ được bảo đảm ở chỗ mà mọi thay đổi bắt buộc phải đi qua: máy chủ nhận lần push, và job CI canh nút merge. Bài này dựng cả hai trong sân tập của bạn, rồi đối chiếu từng cái với thứ github.com cung cấp.</p>

<h3>Ba chỗ một phép kiểm có thể chạy</h3>
${slide('git-12', 10, '--no-verify: vì sao CI vẫn phải kiểm lại')}
<p>Cùng một phép kiểm — "không còn ký hiệu xung đột" — có thể sống ở ba chỗ, và mỗi chỗ có giá khác nhau, mức bảo đảm khác nhau. Trong hook pre-commit nó chẳng tốn gì và bắt lỗi trước khi commit tồn tại, nhưng bỏ qua được. Trong CI (tích hợp liên tục) nó chạy trên mọi commit của pull request và không bỏ qua được một khi đã là kiểm tra bắt buộc, nhưng vài phút sau bạn mới biết. Trên máy chủ nó được kiểm ngay lúc push, với mọi người, không có đường vòng.</p>
<pre><code class="language-bash">git commit --no-verify -m <span class="tok-string">"wip: do dang"</span>      <span class="tok-comment"># lich.js vẫn còn &lt;&lt;&lt;&lt;&lt;&lt;&lt;</span></code></pre>
<div class="out">[main a32d775] wip: do dang
 1 file changed, 6 insertions(+)
 create mode 100644 lich.js</div>
<pre><code class="language-bash"><span class="tok-comment"># bước CI chạy: ĐÚNG phép kiểm đó, trên mọi commit chưa có trên main</span>
git diff --check origin/main HEAD; <span class="tok-keyword">echo</span> <span class="tok-string">"exit=\$?"</span></code></pre>
<div class="out">lich.js:2: leftover conflict marker
lich.js:4: leftover conflict marker
lich.js:6: leftover conflict marker
exit=2</div>
<p>Output thật từ kho thử. Hook đã bị bỏ qua, và vẫn cái <code>git diff --check</code> ấy — chỉ là trỏ vào một dải commit thay vì index — tìm ra ký hiệu xung đột. Mã thoát khác 0 là tất cả những gì một bước CI cần để chuyển đỏ, và một kiểm tra bắt buộc bị đỏ chính là thứ chặn nút merge.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">pre-commit / pre-push</span><span class="v">Phản hồi tức thì, chạy trên máy người viết. Bỏ qua được bằng <code>--no-verify</code>, và không tồn tại trong một bản clone mới.</span></div>
  <div class="kv"><span class="k">CI + kiểm tra bắt buộc</span><span class="v">Chạy trên mọi pull request, không bỏ qua được một khi đã bắt buộc (bài 6.4). Chậm vài phút; không chặn được push thẳng lên một nhánh không được bảo vệ.</span></div>
  <div class="kv"><span class="k">Máy chủ (pre-receive, ruleset)</span><span class="v">Kiểm ngay lúc mọi lần push, với mọi người. Phải thật nhanh, và bạn phải nắm được máy chủ — hoặc dùng thứ GitHub cho sẵn.</span></div>
</div>

<h3>Máy chủ từ chối một lần push thế nào: pre-receive</h3>
${slide('git-12', 16, 'Máy chủ từ chối: hook pre-receive')}
<p>Khi bạn push, máy chủ nhận các đối tượng trước, rồi <em>TRƯỚC KHI</em> dời bất kỳ nhánh nào nó chạy hook <code>pre-receive</code> (trước khi nhận). Hook đọc mỗi ref một dòng từ đầu vào chuẩn — <code>&lt;sha cũ&gt; &lt;sha mới&gt; &lt;tên ref&gt;</code> — và nếu nó thoát khác 0 thì <strong>CẢ lần push bị từ chối</strong>: không ref nào dời đi, và các đối tượng mới bị vứt bỏ (Git giữ chúng trong một vùng cách ly cho tới khi hook đồng ý). Hook in ra gì thì người push nhận được đúng thứ đó, có tiền tố <code>remote:</code>. Hai người họ hàng: <code>update</code> chạy một lần cho mỗi ref và có thể từ chối riêng ref đó; <code>post-receive</code> chạy sau khi mọi thứ đã được nhận và không từ chối được gì — đó là chỗ máy chủ gửi thông báo hoặc kích hoạt deploy.</p>
<p>Sân tập của bạn đã có sẵn một máy chủ: kho trần <code>thu-git-server.git</code>, tạo ở bài 4.1 và dùng suốt Chương 5. Kho trần (bare repository — kho không có cây làm việc) có thư mục <code>hooks/</code> của riêng nó, và một hook đặt ở đó chạy cho mọi lần push từ mọi bản clone. Đây là một hook chỉ nhận commit đã ký lên <code>main</code>, và không nhận ký hiệu xung đột:</p>
<pre><code class="language-bash"><span class="tok-comment">#!/bin/sh</span>
<span class="tok-comment"># thu-git-server.git/hooks/pre-receive — chạy TRÊN MÁY CHỦ, một lần cho mỗi lần push.</span>
<span class="tok-comment"># stdin: &lt;sha cũ&gt; &lt;sha mới&gt; &lt;tên ref&gt;, mỗi ref một dòng. Thoát khác 0 = từ chối CẢ lần push.</span>
zero=0000000000000000000000000000000000000000
<span class="tok-keyword">while</span> read old new ref; <span class="tok-keyword">do</span>
  [ <span class="tok-string">"\$ref"</span> = <span class="tok-string">"refs/heads/main"</span> ] || <span class="tok-keyword">continue</span>          <span class="tok-comment"># chỉ canh main</span>
  [ <span class="tok-string">"\$new"</span> = <span class="tok-string">"\$zero"</span> ] &amp;&amp; { <span class="tok-keyword">echo</span> <span class="tok-string">"✋ Không được xoá main."</span>; <span class="tok-keyword">exit</span> 1; }
  range=\$new; [ <span class="tok-string">"\$old"</span> != <span class="tok-string">"\$zero"</span> ] &amp;&amp; range=\$old..\$new
  <span class="tok-keyword">for</span> c <span class="tok-keyword">in</span> \$(git rev-list \$range); <span class="tok-keyword">do</span>
    <span class="tok-keyword">if</span> ! git verify-commit <span class="tok-string">"\$c"</span> &gt;/dev/null 2&gt;&amp;1; <span class="tok-keyword">then</span>
      <span class="tok-keyword">echo</span> <span class="tok-string">"✋ \$(git log -1 --format='%h %s' \$c) — chưa ký, hoặc khoá không có trong allowed-signers."</span>
      <span class="tok-keyword">exit</span> 1
    <span class="tok-keyword">fi</span>
    <span class="tok-keyword">if</span> ! git diff --check <span class="tok-string">"\$c^"</span> <span class="tok-string">"\$c"</span> &gt;/dev/null 2&gt;&amp;1; <span class="tok-keyword">then</span>
      <span class="tok-keyword">echo</span> <span class="tok-string">"✋ \$(git log -1 --format='%h %s' \$c) — còn ký hiệu xung đột."</span>
      <span class="tok-keyword">exit</span> 1
    <span class="tok-keyword">fi</span>
  <span class="tok-keyword">done</span>
<span class="tok-keyword">done</span>
<span class="tok-keyword">exit</span> 0</code></pre>
<pre><code class="language-bash"><span class="tok-comment"># trên "máy chủ": tin khoá của cả nhóm, rồi bật hook</span>
cp ~/.git-allowed-signers ../thu-git-server.git/allowed-signers
git -C ../thu-git-server.git config gpg.ssh.allowedSignersFile allowed-signers
chmod +x ../thu-git-server.git/hooks/pre-receive</code></pre>
<p>Mã băm toàn số 0 ở cột "mới" nghĩa là ref đang bị xoá; ở cột "cũ" nghĩa là nhánh mới tinh — vì thế hook dựng dải commit theo hai cách khác nhau. Giờ push một commit không ký, cố ý bỏ qua hook pre-push của chính máy mình:</p>
<pre><code class="language-bash">git -c commit.gpgsign=false commit -qm <span class="tok-string">"feat(phong): khoa phong P101"</span>
git push --no-verify origin main</code></pre>
<div class="out">remote: ✋ da7f9a8 feat(phong): khoa phong P101 — chưa ký, hoặc khoá không có trong allowed-signers.
To ../thu-git-server.git
 ! [remote rejected] main -&gt; main (pre-receive hook declined)
error: failed to push some refs to '../thu-git-server.git'</div>
<pre><code class="language-bash">git commit --amend --no-edit -S
git push --no-verify origin main</code></pre>
<div class="out">To ../thu-git-server.git
   261dc96..008f549  main -&gt; main</div>
<div class="callout ok"><strong><code>--no-verify</code> chỉ với tới máy của chính bạn.</strong> Nó bỏ qua hook pre-push của An, và máy chủ vẫn từ chối, vì hook của máy chủ không nằm trong bản clone của ai cả. Ký lại đúng commit đó (<code>--amend -S</code> cho nó mã băm mới, <code>008f549</code>) là đường vào duy nhất. Một commit đã ký nhưng vẫn còn <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> thì bị phép kiểm thứ hai từ chối: <code>remote: ✋ 1dd3224 feat(lich): gio mo cua — còn ký hiệu xung đột.</code></div>
<div class="callout warn">Mọi người push đều phải chờ hook này, nên hãy giữ nó ngắn. GitHub Enterprise Server ghi rõ ngân sách năm giây cho tất cả hook pre-receive cộng lại (09/2026). Việc nặng — test, build, quét toàn bộ lịch sử — thuộc về CI, không thuộc về đường push.</div>

<h3>github.com không cho bạn pre-receive — đây là thứ thay thế</h3>
<p>Trên github.com bạn không cài được hook máy chủ của riêng mình; hook pre-receive tự viết chỉ có trên <strong>GitHub Enterprise Server</strong>, bản mà một công ty tự chạy trên máy của họ. Thứ bạn có là các luật dựng sẵn làm những việc phổ biến (GitHub Docs, 09/2026):</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Chữ ký → Require signed commits</span><span class="lz-v">Một luật của bảo vệ nhánh hoặc ruleset (bộ luật): chỉ commit đã ký và đã xác minh mới được push lên nhánh. Docs của GitHub còn nêu một cái bẫy — commit không ký trên nhánh của pull request có thể chặn cả squash merge, dù GitHub sẽ tự ký commit squash.</span></div>
  <div class="lz-layer"><span class="lz-k">File lớn, đường dẫn, đuôi file → push ruleset</span><span class="lz-v">Từ chối commit chứa file vượt một dung lượng, nằm dưới một đường dẫn, hoặc mang một đuôi file. Có cho kho <strong>private hoặc internal</strong>, và áp lên cả mạng fork của kho.</span></div>
  <div class="lz-layer"><span class="lz-k">Bí mật → push protection</span><span class="lz-v">Soát từng lần push tìm các dạng chứng chỉ đã biết và từ chối nó (bài 11.3).</span></div>
  <div class="lz-layer"><span class="lz-k">Mọi thứ khác → required status checks</span><span class="lz-v">Lint, kiểu, test, ký hiệu xung đột, lời nhắn commit: chạy chúng trong Actions và đặt job làm kiểm tra bắt buộc (bài 6.4, 11.2).</span></div>
</div>
<div class="callout warn">Ruleset trên kho <em>private</em> cần gói trả phí (Pro, Team hoặc Enterprise — Pro miễn phí trong Student Developer Pack); trên kho public thì miễn phí (bài 6.4). Trước khi hứa với nhóm SWP391 rằng "máy chủ sẽ từ chối", hãy mở Settings → Rules trên đúng cái kho đó và kiểm luật có ở đấy thật.</div>

<h3>Job CI kiểm lại mọi thứ</h3>
<p>Cách rẻ nhất để biến hook thành bắt buộc là chạy lại đúng các lệnh đó trong CI, trên cả pull request thay vì trên index:</p>
<pre><code class="language-yaml"><span class="tok-comment"># .github/workflows/kiem-lai.yml — chạy lại đúng các phép kiểm của hook, trên CẢ pull request</span>
name: Kiem lai
on: [pull_request]
jobs:
  kiem-lai:
    name: Re-check hooks            <span class="tok-comment"># tên này đặt làm required status check (bài 6.4)</span>
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0            <span class="tok-comment"># cần lịch sử để so với nhánh đích</span>
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm ci
      - name: Ky hieu xung dot + khoang trang thua
        run: git diff --check origin/&#36;{{ github.base_ref }}...HEAD
      - name: Loi nhan commit
        run: npx commitlint --from origin/&#36;{{ github.base_ref }} --to HEAD</code></pre>
<p>Hai chi tiết quyết định nó có chạy hay không. <code>fetch-depth: 0</code> — checkout mặc định chỉ lấy đúng một commit, nên không có <code>origin/main</code> nào để so và dải commit báo lỗi. Và <code>...</code> (ba chấm) so từ điểm nhánh tách khỏi <code>main</code>, nên phép kiểm chỉ phán xét thay đổi của chính pull request, không phải những gì vừa vào <code>main</code> trong lúc đó. (File này đã được kiểm bằng actionlint 1.7.12: không có lỗi nào.)</p>

<h3>Bí mật: phép kiểm cần có ở mọi lớp</h3>
${slide('git-12', 6, 'pre-commit bắt bí mật — gitleaks chỉ quét phần đã staging')}
<p>Đa số phép kiểm chờ được tới CI. Bí mật thì không: lúc CI nhìn thấy nó thì khoá đã nằm trong một commit trên GitHub, và cách sửa trở thành xoay khoá cộng viết lại lịch sử (bài 8.3). Vì vậy bí mật có một phép kiểm ở mọi lớp — <code>gitleaks git --pre-commit --staged --redact</code> trong hook pre-commit (<code>brew install gitleaks</code> trên Mac; bản cho Linux và Windows có ở trang GitHub của nó), push protection trên GitHub, và một lượt quét trong CI cho những gì lọt lưới.</p>
<pre><code class="language-bash">git add config.js &amp;&amp; git commit -m <span class="tok-string">"feat(upload): ket noi S3"</span></code></pre>
<div class="out">Finding:     REDACTED
Secret:      REDACTED
RuleID:      aws-access-token
File:        config.js
Line:        1
…
3:14PM WRN leaks found: 2</div>
<p>Output thật từ kho thử, với một khoá bịa theo đúng định dạng của AWS. <code>--redact</code> (che đi) rất quan trọng: thiếu nó công cụ in luôn cái bí mật ra terminal của bạn — và ra log của CI, nơi người khác đọc được.</p>

<h3>pre-push: tấm gương ở máy mình của bảo vệ nhánh</h3>
${slide('git-12', 9, 'pre-push canh main · post-merge nhắc npm install')}
<p>Hook pre-push nhận các ref sắp được push qua đầu vào chuẩn (<code>&lt;ref local&gt; &lt;sha local&gt; &lt;ref remote&gt; &lt;sha remote&gt;</code>), nên nó có thể từ chối một lần push lên <code>main</code> trước khi dữ liệu rời laptop — đúng luật mà bảo vệ nhánh áp, nhưng với lời nhắn dễ hiểu hơn và không phải đi một vòng lên máy chủ:</p>
<div class="out">✋ Không push thẳng lên main — đẩy nhánh rồi mở pull request (bài 6.4).
error: failed to push some refs to '../thu-git-server.git'</div>
<p>Nó vẫn chỉ là tiện lợi. Luật thật sự đứng vững là nhánh được bảo vệ trên GitHub; hook chỉ giúp bạn khỏi phải đọc <code>GH006: Protected branch update failed</code>. Cùng slide đó có một hook không bao giờ từ chối gì: <code>post-merge</code>, chạy sau một lần <code>git pull</code> thành công và ở đây nhắc bạn chạy <code>npm install</code> vì <code>package-lock.json</code> vừa đổi.</p>

<div class="pitfall co-tieu-de"><strong>Chuyện này hỏng thế nào trong đồ án nhóm.</strong> Cả nhóm cài husky, laptop nào cũng chặn ký hiệu xung đột, và ai cũng yên tâm. Rồi đêm trước buổi demo, một bạn giải xung đột ngay trong trình soạn thảo web của GitHub — ở đó không có hook nào — hoặc commit bằng <code>--no-verify</code> "chỉ lần này thôi", và <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code> nằm luôn trên <code>main</code>. Bản dựng vỡ ngay giữa buổi thuyết trình. Cách sửa chưa bao giờ là một cái hook khắt khe hơn: đó là một bước CI chạy <code>git diff --check</code> cộng một kiểm tra bắt buộc trên <code>main</code>, để con đường vòng qua hook dẫn tới một dấu X đỏ chứ không dẫn tới một lần merge.</div>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><ol><li>Trong máy chủ sân tập <code>thu-git-server.git</code>, tạo <code>hooks/pre-receive</code> với phép kiểm ký hiệu xung đột của bài này (thêm cả phép kiểm chữ ký nếu bạn đã làm thực hành 12.2 — khi đó chép luôn file allowed signers và đặt <code>gpg.ssh.allowedSignersFile</code> trong config của máy chủ). <code>chmod +x</code> nó.</li><li>Trong <code>thu-git</code>, commit một file chứa khối <code>&lt;&lt;&lt;&lt;&lt;&lt;&lt;</code>/<code>=======</code>/<code>&gt;&gt;&gt;&gt;&gt;&gt;&gt;</code> bằng <code>git commit --no-verify</code>, rồi <code>git push --no-verify origin main</code>. Đọc dòng <code>remote:</code> và dòng <code>(pre-receive hook declined)</code> (hook pre-receive đã từ chối).</li><li>Tự chạy phép kiểm của CI: <code>git diff --check origin/main HEAD; echo $?</code> — ghi lại mã thoát mà một bước CI sẽ thấy.</li><li>Huỷ commit hỏng bằng <code>git reset --hard origin/main</code> (nó chưa từng được máy chủ nhận nên không ai khác có nó), tạo một commit sạch rồi push: được nhận.</li><li>Viết ra cho nhóm: luật nào của dự án thật đang sống trong hook, luật nào trong CI, luật nào trong luật GitHub — và một luật hiện chẳng sống ở đâu cả.</li></ol>
<pre><code class="language-bash">git push --no-verify origin main              <span class="tok-comment"># output thật từ kho thử</span>
remote: ✋ 1dd3224 feat(lich): gio mo cua — còn ký hiệu xung đột.
To ../thu-git-server.git
 ! [remote rejected] main -&gt; main (pre-receive hook declined)</code></pre>
<p><strong>Đạt khi:</strong> máy chủ từ chối lần push <code>--no-verify</code> của bạn bằng đúng dòng <code>remote:</code> do bạn viết, <code>git diff --check</code> thoát với mã 2 trên dải commit hỏng và 0 sau khi reset, và một lần push sạch đi qua.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">pre-receive</span><span class="v">Trước khi nhận — hook trên máy chủ, chạy một lần mỗi lần push, trước khi ref nào dời đi. Thoát khác 0 là từ chối cả lần push.</span></div>
  <div class="kv"><span class="k">update / post-receive</span><span class="v">Cập nhật / sau khi nhận — <code>update</code> chạy một lần cho mỗi ref và từ chối được riêng ref đó; <code>post-receive</code> chạy sau cùng và chỉ thông báo hoặc deploy.</span></div>
  <div class="kv"><span class="k">bare repository</span><span class="v">Kho trần — kho không có cây làm việc, dùng làm máy chủ (<code>git init --bare</code>). Hook của nó nằm ở <code>hooks/</code> ngay cấp trên cùng.</span></div>
  <div class="kv"><span class="k">required status check</span><span class="v">Kiểm tra bắt buộc — job CI phải xanh thì pull request mới merge được; là cách của GitHub biến phép kiểm của hook thành không bỏ qua được.</span></div>
  <div class="kv"><span class="k">push ruleset</span><span class="v">Bộ luật khi push — luật GitHub từ chối lần push theo dung lượng file, đường dẫn hoặc đuôi file; chỉ cho kho private và internal.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul><li>Luật chỉ đứng vững ở nơi mọi thay đổi bắt buộc phải đi qua: máy chủ nhận push và CI canh nút merge.</li><li><code>pre-receive</code> đọc các dòng cũ/mới/ref và từ chối cả lần push bằng mã thoát khác 0 — <code>--no-verify</code> không với tới được.</li><li>github.com không cho hook máy chủ tự viết; thay bằng Require signed commits, push ruleset, push protection và kiểm tra bắt buộc.</li><li>Biến hook thành bắt buộc bằng cách chạy lại đúng các lệnh đó trong CI trên cả pull request (<code>fetch-depth: 0</code>, dải ba chấm).</li><li>Bí mật là ngoại lệ cần mọi lớp, vì khoá đã lên tới GitHub thì phải xoay khoá.</li></ul>

<a class="link-card" href="https://git-scm.com/docs/githooks" target="_blank" rel="noopener">
  <span class="lc-ico">🪝</span>
  <span class="lc-body"><span class="lc-title">githooks — pre-receive, update, post-receive</span><span class="lc-sub">Đúng định dạng đầu vào, vùng cách ly, và mỗi mã thoát làm gì.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets" target="_blank" rel="noopener">
  <span class="lc-ico">📏</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Các luật có trong ruleset</span><span class="lc-sub">Require signed commits, push ruleset (dung lượng, đường dẫn, đuôi file), status check.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/enterprise-server@latest/admin/enforcing-policies/enforcing-policy-with-pre-receive-hooks/about-pre-receive-hooks" target="_blank" rel="noopener">
  <span class="lc-ico">🏢</span>
  <span class="lc-body"><span class="lc-title">GitHub Enterprise Server — Về hook pre-receive</span><span class="lc-sub">Nơi hook máy chủ tự viết thật sự có trên GitHub, và ngân sách năm giây của chúng.</span></span>
</a>
<p class="note-ct"><strong>Cách nghĩ về chuyện này:</strong> với mỗi luật, hãy hỏi "người không làm theo nó thì chuyện gì xảy ra?" Nếu câu trả lời là "chẳng gì cả, trừ khi máy họ tình cờ có cài hook của nhóm", thì đó mới là một lời khuyên. Đặt lời khuyên vào hook để làm đúng trở nên nhanh, và đặt luật ở nơi lần push hạ cánh.</p>
</div>
`,
    },

    /* ─────────────────────────── 12.4 Quiz (slug cũ git-12-3-quiz) ─────────────────────────── */
    {
      title: '12.4 — Chapter 12 quiz|||12.4 — Kiểm tra Chương 12',
      slug: 'git-12-3-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười tình huống thật: hook bị bỏ qua vì thiếu chmod +x, bản clone mới không có hook, lint-staged, commitlint, --no-verify và CI, pre-receive trên máy chủ, ruleset trên github.com, %G? ra U, khoá Signing và vigilant mode.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from real group work. Most turn on one question: <em>does this check run on a machine I control, or on the one every push must pass?</em> The two that matter most in practice are why a green hook proves nothing about <code>main</code>, and what a <code>G</code> or a Verified badge actually proves. Read every explanation after submitting.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I have made a hook run, seen the <code>hint:</code> when it lacked <code>chmod +x</code>, and shared it with <code>core.hooksPath</code>.</li>
<li>I can explain why a teammate’s fresh clone has no hooks, and how husky’s <code>prepare</code> fixes that.</li>
<li>I know what <code>--no-verify</code> skips — and that it never reaches the server or CI.</li>
<li>I have had a push refused by my own <code>pre-receive</code> hook on <code>thu-git-server.git</code>.</li>
<li>I sign commits with an SSH key and can read <code>%G?</code>: G, U, N, B.</li>
<li>I know why GitHub needs my key a second time as a Signing Key, and what vigilant mode changes.</li>
</ul>
${slide('git-12', 17, 'Bảng tra nhanh Chương 12')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ việc nhóm thật. Phần lớn xoay quanh một câu hỏi: <em>phép kiểm này chạy trên máy tôi kiểm soát, hay trên nơi mà mọi lần push đều phải đi qua?</em> Hai điều quan trọng nhất trong việc thật là vì sao hook xanh chẳng chứng minh gì về <code>main</code>, và chữ <code>G</code> hay huy hiệu Verified thật sự chứng minh điều gì. Đọc mọi phần giải thích sau khi nộp.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đã làm một hook chạy được, đã thấy dòng <code>hint:</code> khi nó thiếu <code>chmod +x</code>, và đã chia sẻ nó bằng <code>core.hooksPath</code>.</li>
<li>Tôi giải thích được vì sao bản clone mới của bạn cùng nhóm không có hook, và <code>prepare</code> của husky sửa chuyện đó thế nào.</li>
<li>Tôi biết <code>--no-verify</code> bỏ qua cái gì — và nó không bao giờ với tới máy chủ hay CI.</li>
<li>Tôi đã bị chính hook <code>pre-receive</code> của mình trên <code>thu-git-server.git</code> từ chối một lần push.</li>
<li>Tôi ký commit bằng khoá SSH và đọc được <code>%G?</code>: G, U, N, B.</li>
<li>Tôi biết vì sao GitHub cần khoá của tôi lần thứ hai với loại Signing Key, và vigilant mode thay đổi điều gì.</li>
</ul>
${slide('git-12', 17, 'Bảng tra nhanh Chương 12')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'Minh wrote .git/hooks/pre-commit to block conflict markers, yet a file with <<<<<<< was committed. The only extra line Git printed was a hint saying the hook "was ignored because it’s not set as executable". What fixes it?|||Minh viết .git/hooks/pre-commit để chặn ký hiệu xung đột, thế mà một file có <<<<<<< vẫn được commit. Dòng duy nhất Git in thêm là một dòng hint nói hook "was ignored because it’s not set as executable". Sửa bằng gì?',
            options: [
              'Rename the file to pre-commit.sh so Git knows it is a shell script|||Đổi tên file thành pre-commit.sh để Git biết đó là script shell',
              'Run git config core.hooksPath .git/hooks so Git looks in the right folder|||Chạy git config core.hooksPath .git/hooks để Git tìm đúng thư mục',
              'chmod +x .git/hooks/pre-commit, then commit again|||chmod +x .git/hooks/pre-commit, rồi commit lại',
              'Reinstall Git, because hooks are disabled in a default install|||Cài lại Git, vì bản cài mặc định tắt hook',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: The hint says exactly what is wrong: the file has the right name but no executable bit, so Git skipped it and let the commit through. chmod +x is the whole fix. Renaming to pre-commit.sh is the tempting answer, but Git looks for the exact name pre-commit — adding .sh makes Git ignore it completely, with no hint at all. .git/hooks is already the default location, and hooks are not disabled by default.|||VI: Dòng hint nói đúng chỗ hỏng: file đã đúng tên nhưng thiếu bit thực thi, nên Git bỏ qua nó và cho commit đi qua. chmod +x là toàn bộ cách sửa. Đổi tên thành pre-commit.sh là đáp án hấp dẫn, nhưng Git tìm đúng cái tên pre-commit — thêm .sh là Git bỏ qua hẳn, đến một dòng nhắc cũng không có. .git/hooks vốn đã là chỗ mặc định, và hook không bị tắt sẵn.',
          },
          {
            question: 'You committed .githooks/pre-commit and pushed. Bình cloned the repository yesterday, and his commits with conflict markers still go through. Why?|||Bạn đã commit .githooks/pre-commit và push. Bình clone kho hôm qua, và các commit có ký hiệu xung đột của Bình vẫn lọt qua. Vì sao?',
            options: [
              'core.hooksPath is local config and is never cloned; Bình must run git config core.hooksPath .githooks once (or let an npm prepare script do it)|||core.hooksPath là cấu hình cục bộ và không bao giờ được clone; Bình phải chạy git config core.hooksPath .githooks một lần (hoặc để script prepare của npm làm hộ)',
              'The .githooks folder is not cloned because Git ignores folders that start with a dot|||Thư mục .githooks không được clone vì Git bỏ qua thư mục bắt đầu bằng dấu chấm',
              'Bình is on Windows, and Git for Windows cannot run hooks|||Bình dùng Windows, mà Git for Windows không chạy được hook',
              'Hooks only run for the person who created them, identified by user.email|||Hook chỉ chạy cho người đã tạo ra nó, nhận diện bằng user.email',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: The files did arrive — in our test, ls .githooks in the fresh clone listed all four — but git config core.hooksPath printed nothing, and without that setting Git looks only in .git/hooks. One git config line per clone fixes it; husky does it automatically through prepare after npm install. Dot-folders are cloned like any other committed files, Git for Windows runs hooks through its bundled shell, and hooks have no idea who created them.|||VI: File đã về đủ — trong kho thử, ls .githooks ở bản clone mới liệt kê đủ bốn file — nhưng git config core.hooksPath không in gì, và thiếu thiết lập đó thì Git chỉ tìm trong .git/hooks. Một dòng git config cho mỗi bản clone là xong; husky tự làm việc đó qua prepare sau npm install. Thư mục có dấu chấm được clone như mọi file đã commit khác, Git for Windows chạy hook qua shell đi kèm, và hook chẳng biết ai đã tạo ra nó.',
          },
          {
            question: 'Your SWP391 pre-commit hook runs npx prettier --write . on the whole project. It takes 40 seconds and reformats files you did not stage. What is the best fix?|||Hook pre-commit của nhóm SWP391 chạy npx prettier --write . trên cả dự án. Nó mất 40 giây và định dạng lại cả những file bạn không staging. Cách sửa tốt nhất?',
            options: [
              'Move the command to pre-push, where 40 seconds is acceptable|||Chuyển lệnh sang pre-push, ở đó 40 giây là chấp nhận được',
              'Tell the team to use git commit --no-verify when they are in a hurry|||Bảo cả nhóm dùng git commit --no-verify khi vội',
              'Delete the hook and rely on everyone formatting in VS Code on save|||Xoá hook và trông vào việc mỗi người tự định dạng khi lưu trong VS Code',
              'Use lint-staged so prettier runs only on staged files and the fixes are re-staged|||Dùng lint-staged để prettier chỉ chạy trên file đã staging và phần sửa được staging lại',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The problem is scope, not timing: formatting unstaged files is slow and changes things that are not in the commit. lint-staged runs the tool on exactly the staged files and re-stages its fixes — in our test a messy unstaged nhap.js was left untouched. Moving it to pre-push keeps the 40 seconds and still reformats files outside the push. Habitual --no-verify means the hook protects nothing, and "everyone configures their editor" is the rule nobody enforces.|||VI: Vấn đề là phạm vi, không phải thời điểm: định dạng file chưa staging vừa chậm vừa sửa những thứ không nằm trong commit. lint-staged chạy công cụ đúng trên các file đã staging và staging lại phần sửa — trong kho thử, một file nhap.js lộn xộn chưa staging không bị đụng tới. Chuyển sang pre-push vẫn giữ 40 giây và vẫn định dạng file ngoài lần push. --no-verify thành thói quen nghĩa là hook chẳng bảo vệ gì, còn "ai cũng tự cấu hình editor" là thứ luật không ai cưỡng chế.',
          },
          {
            question: 'git commit -m "cap nhat linh tinh" fails with: ✖ subject may not be empty [subject-empty], ✖ type may not be empty [type-empty], husky - commit-msg script failed (code 1). What happened?|||git commit -m "cap nhat linh tinh" thất bại với: ✖ subject may not be empty [subject-empty], ✖ type may not be empty [type-empty], husky - commit-msg script failed (code 1). Chuyện gì đã xảy ra?',
            options: [
              'lint-staged found formatting errors in the staged files|||lint-staged tìm thấy lỗi định dạng trong các file đã staging',
              'The commit-msg hook ran commitlint; the message has no type like feat(lich): — rewrite it in Conventional Commits form|||Hook commit-msg chạy commitlint; lời nhắn thiếu kiểu như feat(lich): — viết lại theo dạng Conventional Commits',
              'The commit was created, but husky marked it as invalid for CI|||Commit đã được tạo, nhưng husky đánh dấu nó không hợp lệ cho CI',
              'Git refuses messages without Vietnamese accents|||Git từ chối lời nhắn viết tiếng Việt không dấu',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: "commit-msg script failed" names the hook, and subject-empty / type-empty are commitlint rules: with no "type(scope): " prefix, commitlint cannot find a type or a subject. Nothing was committed — a non-zero commit-msg hook aborts the commit — so rewriting it as feat(lich): them gio mo cua is all it takes. lint-staged runs in pre-commit and prints task lines, not rule names; Git itself does not care about accents.|||VI: "commit-msg script failed" nêu tên hook, còn subject-empty / type-empty là luật của commitlint: không có tiền tố "type(scope): " thì commitlint không tìm ra kiểu lẫn tiêu đề. Chưa có commit nào được tạo — hook commit-msg thoát khác 0 là huỷ commit — nên chỉ cần viết lại thành feat(lich): them gio mo cua. lint-staged chạy ở pre-commit và in các dòng tác vụ, không in tên luật; bản thân Git chẳng quan tâm có dấu hay không dấu.',
          },
          {
            question: 'Late at night a teammate commits with --no-verify; lich.js still contains <<<<<<<. He opens a pull request into main. What stops it from being merged?|||Nửa đêm một bạn cùng nhóm commit bằng --no-verify; lich.js vẫn còn <<<<<<<. Bạn ấy mở pull request vào main. Cái gì ngăn nó được merge?',
            options: [
              'Nothing — once a hook is skipped, the commit is permanently trusted|||Không gì cả — hook đã bị bỏ qua thì commit được tin mãi mãi',
              'A CI job running git diff --check origin/main...HEAD fails, and as a required status check it blocks the merge|||Một job CI chạy git diff --check origin/main...HEAD thất bại, và vì là kiểm tra bắt buộc nó chặn nút merge',
              'The pre-commit hook re-runs automatically when the pull request is opened|||Hook pre-commit tự chạy lại khi pull request được mở',
              'GitHub runs the repository’s .githooks folder on its servers before merging|||GitHub chạy thư mục .githooks của kho trên máy chủ của nó trước khi merge',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: The same check pointed at a range still finds the markers — in our test, git diff --check origin/main HEAD printed three "leftover conflict marker" lines and exited 2, which turns the CI step red, and a required check blocks the merge. That is why hooks are for speed and CI is for enforcement. Hooks never run on GitHub: neither .git/hooks nor a committed .githooks folder is executed by the platform, so options C and D describe something that does not exist.|||VI: Cùng phép kiểm đó trỏ vào một dải commit vẫn tìm ra ký hiệu — trong kho thử, git diff --check origin/main HEAD in ba dòng "leftover conflict marker" và thoát mã 2, làm bước CI chuyển đỏ, và kiểm tra bắt buộc chặn merge. Đó là lý do hook để cho nhanh còn CI để cưỡng chế. Hook không bao giờ chạy trên GitHub: nền tảng không chạy .git/hooks lẫn thư mục .githooks đã commit, nên phương án C và D mô tả một thứ không tồn tại.',
          },
          {
            question: 'You run git push --no-verify origin main to the playground server and get: remote: ✋ da7f9a8 … — chưa ký … ! [remote rejected] main -> main (pre-receive hook declined). Why did --no-verify not help?|||Bạn chạy git push --no-verify origin main lên máy chủ sân tập và nhận: remote: ✋ da7f9a8 … — chưa ký … ! [remote rejected] main -> main (pre-receive hook declined). Vì sao --no-verify không giúp được?',
            options: [
              '--no-verify only works with git commit, not with git push|||--no-verify chỉ dùng được với git commit, không dùng với git push',
              'The server needs --force to accept a commit without a signature|||Máy chủ cần --force mới nhận commit không có chữ ký',
              'The pre-push hook ran anyway because the branch is main|||Hook pre-push vẫn chạy vì nhánh là main',
              '--no-verify skips hooks on your machine only; pre-receive runs on the server for every push|||--no-verify chỉ bỏ qua hook trên máy bạn; pre-receive chạy trên máy chủ cho mọi lần push',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: --no-verify did its job: it skipped the local pre-push hook (on git push it does exactly that, so option A is wrong). The refusal came from pre-receive in the bare repository, which no clone contains and no flag can reach; the "remote:" prefix is the giveaway. --force changes whether history may be overwritten, not whether the server’s hook approves — the hook still reads the new commits and exits 1. The fix was to sign: --amend -S produced 008f549 and the push went through.|||VI: --no-verify đã làm đúng việc của nó: bỏ qua hook pre-push ở máy (với git push nó làm đúng việc đó, nên phương án A sai). Lời từ chối đến từ pre-receive trong kho trần, thứ không bản clone nào chứa và không cờ nào với tới; tiền tố "remote:" chính là dấu hiệu. --force đổi việc có được ghi đè lịch sử hay không, chứ không đổi việc hook máy chủ có đồng ý — hook vẫn đọc các commit mới và thoát 1. Cách sửa là ký: --amend -S tạo ra 008f549 và lần push đi qua.',
          },
          {
            question: 'Your team’s private repository is on github.com. You want every commit on main to be signed, and pushes of files over 50 MB refused. What do you set up?|||Kho private của nhóm nằm trên github.com. Bạn muốn mọi commit trên main phải được ký, và lần push chứa file trên 50 MB bị từ chối. Bạn thiết lập gì?',
            options: [
              'A ruleset with Require signed commits, plus a push ruleset with a file size limit|||Một ruleset có Require signed commits, cộng một push ruleset giới hạn dung lượng file',
              'Upload a pre-receive script under Settings → Hooks in the repository|||Tải một script pre-receive lên ở Settings → Hooks của kho',
              'Commit a .github/hooks/pre-receive file; GitHub runs it on every push|||Commit một file .github/hooks/pre-receive; GitHub chạy nó ở mỗi lần push',
              'Add a webhook that deletes oversized commits after they arrive|||Thêm một webhook xoá các commit quá cỡ sau khi chúng tới',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: On github.com the built-in rules replace server hooks: Require signed commits lets only signed and verified commits reach the branch, and push rulesets (private and internal repositories, GitHub Docs 09/2026) refuse files over a size, path or extension. Custom pre-receive hooks exist only on GitHub Enterprise Server, so B and C are how you would do it on your own server, not on github.com. A webhook fires after the push is accepted — it cannot refuse anything, only react. Remember that rulesets on a private repository need a paid plan such as Pro.|||VI: Trên github.com các luật dựng sẵn thay cho hook máy chủ: Require signed commits chỉ cho commit đã ký và đã xác minh vào nhánh, còn push ruleset (kho private và internal, GitHub Docs 09/2026) từ chối file vượt dung lượng, đường dẫn hay đuôi file. Hook pre-receive tự viết chỉ có trên GitHub Enterprise Server, nên B và C là cách làm trên máy chủ của riêng bạn, không phải trên github.com. Webhook bắn ra sau khi lần push đã được nhận — nó không từ chối được gì, chỉ phản ứng. Nhớ rằng ruleset trên kho private cần gói trả phí như Pro.',
          },
          {
            question: 'git log --format="%h %G? %an %s" shows "5eed59f U Tran Thi Binh refactor(auth): tach ham dem", and git verify-commit 5eed59f prints "Good "git" signature with ED25519 key SHA256:XqVQ1d… / No principal matched." What does it mean?|||git log --format="%h %G? %an %s" hiện "5eed59f U Tran Thi Binh refactor(auth): tach ham dem", và git verify-commit 5eed59f in "Good "git" signature with ED25519 key SHA256:XqVQ1d… / No principal matched." Nghĩa là gì?',
            options: [
              'The commit was modified after it was signed|||Commit đã bị sửa sau khi được ký',
              'The commit is not signed at all|||Commit hoàn toàn không được ký',
              'The signature is mathematically valid, but that key is not in your allowed signers file — confirm it really is Bình’s, then add it|||Chữ ký hợp lệ về mặt toán học, nhưng khoá đó không có trong file allowed signers của bạn — xác nhận đúng là của Bình rồi mới thêm vào',
              'Bình’s key has expired and must be regenerated|||Khoá của Bình đã hết hạn và phải tạo lại',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: U is "good signature, unknown key": the maths checks out ("Good … signature"), but no principal in your allowed signers file owns that key. Check it with Bình (over a channel you trust) and add "binh@… ssh-ed25519 …" to the file. A commit edited after signing shows B and "incorrect signature" — that is the tempting confusion. An unsigned commit shows N, and SSH signing keys have no built-in expiry unless you configure one.|||VI: U là "chữ ký tốt, khoá lạ": phần toán học đúng ("Good … signature"), nhưng không danh tính nào trong file allowed signers sở hữu khoá đó. Hỏi lại Bình (qua một kênh bạn tin) rồi thêm "binh@… ssh-ed25519 …" vào file. Commit bị sửa sau khi ký thì hiện B và "incorrect signature" — đó là chỗ dễ nhầm. Commit không ký hiện N, còn khoá ký SSH không có hạn dùng sẵn trừ khi bạn tự đặt.',
          },
          {
            question: 'You added your SSH key to GitHub months ago to push. Now you sign commits with the same key, git log --show-signature says Good locally, but GitHub shows Unverified. Why?|||Vài tháng trước bạn đã thêm khoá SSH lên GitHub để push. Giờ bạn ký commit bằng đúng khoá đó, ở máy git log --show-signature báo Good, nhưng GitHub hiện Unverified. Vì sao?',
            options: [
              'GitHub only verifies GPG signatures; SSH signatures always show Unverified|||GitHub chỉ xác minh chữ ký GPG; chữ ký SSH lúc nào cũng hiện Unverified',
              'The key is registered only as an Authentication Key; add the same public key again with type Signing Key|||Khoá chỉ được đăng ký là Authentication Key; thêm đúng khoá công khai đó lần nữa với loại Signing Key',
              'Your local allowed signers file was not uploaded with the push|||File allowed signers ở máy bạn không được tải lên cùng lần push',
              'Signed commits need to be pushed with git push --signed|||Commit đã ký phải được push bằng git push --signed',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: GitHub keeps the two roles apart: an Authentication Key lets you push, a Signing Key is what it checks signatures against. The commit really is signed — which is why it says Unverified rather than showing nothing. GitHub has verified SSH signatures for years, so A is out; the allowed signers file is purely your local trust list and GitHub never reads it; git push --signed signs the push itself (a push certificate), not the commits, and has nothing to do with the badge.|||VI: GitHub tách hai vai trò: Authentication Key cho bạn push, còn Signing Key mới là thứ nó dùng để đối chiếu chữ ký. Commit đúng là đã được ký — vì thế nó ghi Unverified chứ không để trống. GitHub xác minh chữ ký SSH từ lâu rồi, nên A sai; file allowed signers chỉ là danh sách tin cậy ở máy bạn và GitHub không bao giờ đọc nó; git push --signed ký chính lần push (một chứng nhận push), không ký các commit, và chẳng liên quan gì tới huy hiệu.',
          },
          {
            question: 'You turn on vigilant mode on GitHub. The next day you push a commit from the lab computer at school, where signing is not set up. How does GitHub show that commit?|||Bạn bật vigilant mode trên GitHub. Hôm sau bạn push một commit từ máy phòng lab ở trường, nơi chưa cài ký commit. GitHub hiển thị commit đó thế nào?',
            options: [
              'With no badge, like any unsigned commit|||Không có huy hiệu, như mọi commit không ký',
              'Verified, because the push came from your account|||Verified, vì lần push đến từ tài khoản của bạn',
              'Partially verified, because only the push was authenticated|||Partially verified, vì chỉ lần push là đã được xác thực',
              'Unverified — vigilant mode flags unsigned commits carrying your identity|||Unverified — vigilant mode gắn cờ các commit không ký mang danh tính của bạn',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: Vigilant mode exists precisely to stop an unsigned commit looking like an honest one: with it on, commits with your identity that are not signed show Unverified. That is why GitHub advises enabling it only if you sign everything, from every machine. "No badge" is the behaviour with vigilant mode off. Partially verified is a different case — a valid signature on a commit whose other author has vigilant mode on — and pushing with your credentials says nothing about who created the commit.|||VI: Vigilant mode sinh ra đúng để một commit không ký thôi trông giống một commit trung thực: bật lên thì commit mang danh tính của bạn mà không ký sẽ hiện Unverified. Vì thế GitHub khuyên chỉ bật khi bạn ký mọi thứ, từ mọi máy. "Không có huy hiệu" là hành vi khi TẮT vigilant mode. Partially verified là trường hợp khác — chữ ký hợp lệ trên một commit mà tác giả còn lại đang bật vigilant — còn push bằng tài khoản của bạn chẳng nói gì về việc ai đã tạo ra commit.',
          },
        ],
      },
    },
  ],
};
