/**
 * Linux & Bash — Chương 7: Viết script cho production.
 * Khung script · tham số · trap và dọn dẹp · gỡ lỗi · script hoàn chỉnh · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 * Nâng cấp 28/09/2026: bài 7.0 slide (deck lx-07, 32 slide) + slide/🧪/🗂/📌 trong 7.1–7.5; đào sâu: bảng "set -e
 * KHÔNG dừng khi nào" đo thật, chuyện cd hỏng giữa chuỗi &&, script CRLF từ Windows, readlink -f, "$@"/"$*",
 * getopts dừng ở tham số đầu, sáu cách chết của script và bẫy nào chạy (EXIT/ERR/INT, đo thật), bẫy INT phải exit,
 * trap ERR cần set -E, flock và tiến trình con, mktemp GNU vs BSD, PS4/ShellCheck/env -i chạy thật, "macOS/WSL khác gì".
 * Sửa lỗi cũ (chạy thật mới lộ): 7.1 count KHÔNG giữ giá trị cũ, cd+pwd KHÔNG giải symlink; 7.3 backup.sh thiếu
 * mkdir thư mục ngày nên mv hỏng; 7.5 IFS=$'\\n\\t' làm "$*" của run() nối bằng xuống dòng, bẫy ERR câm trong main()
 * vì thiếu set -E. Quiz 10 câu. Output MỚI chạy thật trong container ubuntu:24.04 (arm64) và trên Mac M1 (macOS 27).
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 7 — Writing scripts for production|||Chương 7 — Viết script cho production',
  description: 'set -euo pipefail, tham số, kiểm tính hợp lệ, trap để dọn dẹp, và cách gỡ lỗi một script mà không phải rắc echo khắp nơi. Chương này viết cho những script chạy lúc 3 giờ sáng mà không có ai ngồi nhìn.',
  lessons: [
    /* ─────────────────────────── 7.0 ─────────────────────────── */
    {
      title: '7.0 — Chapter 7 slides: production scripts in pictures|||7.0 — Slide Chương 7: script production bằng hình',
      slug: 'lnx-7-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 7: bộ khung script chuẩn tô màu từng dòng, bảng set -e không dừng khi nào đo thật, cd hỏng giữa chuỗi &&, script CRLF từ Windows, getopts và cờ dài, sáu cách một script chết và bẫy nào chạy, mktemp, flock, set -x/PS4/ShellCheck, và script deploy hoàn chỉnh cùng hai lỗi thật tìm ra khi chạy lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Skim these before the lessons to see where the chapter is going, then come back after the quiz as a revision sheet. Every script on the slides is syntax-coloured like VS Code with a note on each line, and every terminal is real output: the standard skeleton, the measured table of where <code>set -e</code> does not stop, the six ways a script can die and which trap runs for each, and the complete deploy script run end to end.</p>
<p>Slides 3–8 belong to Lesson 7.1 (skeleton, shebang, strict mode, the <code>set -e</code> exceptions, the failing <code>cd</code> inside an <code>&amp;&amp;</code> chain, CRLF scripts from Windows), 9–13 to 7.2 (arguments, <code>getopts</code>, long options, validation, <code>--dry-run</code>), 14–19 to 7.3 (traps, <code>mktemp</code>, <code>set -E</code>, <code>flock</code>, idempotency), 20–23 to 7.4 (<code>set -x</code>, <code>PS4</code>, <code>bash -n</code>, ShellCheck, <code>env -i</code>) and 24–27 to 7.5. The last five are macOS differences, common mistakes, a two-page cheat sheet and a 45-minute practice session. Recorded on 28/09/2026 in an Ubuntu 24.04 container and on a Mac M1; the slides are in Vietnamese, the code reads the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy chương đi về đâu, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mọi script trên slide đều tô màu kiểu VS Code kèm ghi chú từng dòng, và mọi terminal đều là output THẬT: bộ khung chuẩn, bảng đo "set -e KHÔNG dừng ở đâu", sáu cách một script có thể chết và bẫy nào chạy với từng cách, và script deploy hoàn chỉnh chạy từ đầu tới cuối.</p>
<p>Slide 3–8 thuộc Bài 7.1 (bộ khung, shebang, strict mode, các ngoại lệ của <code>set -e</code>, <code>cd</code> hỏng giữa chuỗi <code>&amp;&amp;</code>, script CRLF từ Windows), 9–13 thuộc 7.2 (tham số, <code>getopts</code>, cờ dài, kiểm tra, <code>--dry-run</code>), 14–19 thuộc 7.3 (bẫy, <code>mktemp</code>, <code>set -E</code>, <code>flock</code>, chạy lại không hỏng), 20–23 thuộc 7.4 (<code>set -x</code>, <code>PS4</code>, <code>bash -n</code>, ShellCheck, <code>env -i</code>) và 24–27 thuộc 7.5. Năm slide cuối là điểm khác của macOS, sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 45 phút. Ghi ngày 28/09/2026 trong container Ubuntu 24.04 và trên Mac M1 — giờ, PID và tên file tạm trên máy bạn sẽ khác, quy luật thì không.</p>
</div>
${gallery('lx-07', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Bộ khung chuẩn, ghi chú từng dòng'], [4, 'Shebang: /bin/sh trên Ubuntu là dash'], [5, 'Strict mode: mỗi cờ chặn một kiểu hỏng'],
  [6, 'set -e KHÔNG dừng ở đâu — đo thật'], [7, 'cd hỏng giữa chuỗi &&'], [8, 'Script CRLF từ Windows'],
  [9, '"$@", "$*", $@ và shift'], [10, 'getopts ":vo:fh"'], [11, 'Cờ dài: while/case và --'],
  [12, 'Bốn cửa trước khi làm việc'], [13, 'run() và --dry-run'],
  [14, 'Script chết giữa chừng: bẫy nào chạy'], [15, 'Bẫy INT phải exit; hàm cleanup'], [16, 'mktemp GNU và BSD'],
  [17, 'trap ERR cần set -E'], [18, 'flock: khoá ở fd, cả tiến trình con'], [19, 'Chạy hai lần không hỏng'],
  [20, 'set -x và PS4'], [21, 'Năm bậc gỡ lỗi, bash -n'], [22, 'ShellCheck'], [23, 'env -i: tái hiện cron'],
  [24, 'Script hoàn chỉnh = 9 khối'], [25, 'stdout là dữ liệu, stderr là log'], [26, 'Hai lỗi thật trong bản cũ'],
  [27, 'Khi nào thôi dùng bash + bảng kiểm'], [28, 'macOS khác gì'], [29, 'Sai lầm hay gặp'],
  [30, 'Bảng tra nhanh (1/2)'], [31, 'Bảng tra nhanh (2/2)'], [32, 'Thực hành chương 7'],
])}
`,
    },
    /* ─────────────────────────── 7.1 ─────────────────────────── */
    {
      title: '7.1 — The skeleton: shebang, strict mode, and its traps|||7.1 — Bộ khung: shebang, chế độ nghiêm ngặt, và những cái bẫy của nó',
      slug: 'lnx-7-1-khung-script',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Vì sao #!/usr/bin/env bash chứ không phải #!/bin/bash, set -e/-u/-o pipefail làm gì và ba chỗ -e KHÔNG kích hoạt, IFS nghiêm ngặt, và một khung script chép về dùng ngay được.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>The skeleton</h2>
<p class="lead">A script that runs on your laptop and a script that runs unattended at 3am are different artefacts. The difference is almost entirely in the first six lines. This lesson is those lines — and, more importantly, the three cases where the famous <code>set -e</code> does <em>not</em> save you, because believing it always works is worse than not using it.</p>

<h3>The shebang</h3>
${slide('lx-07', 4, 'Shebang chọn trình thông dịch — /bin/sh trên Ubuntu là dash')}
<pre><code>#!/usr/bin/env bash        <span class="tok-comment"># portable — finds bash via PATH</span>
#!/bin/bash                <span class="tok-comment"># fixed path — fine on Linux, wrong on some systems</span>
#!/bin/sh                  <span class="tok-comment"># POSIX sh — NOT bash, most of this course does not apply</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>/usr/bin/env bash</code></span><span class="v">Looks bash up in <code>PATH</code>. Finds a newer bash from Homebrew on macOS, or from a Nix profile, instead of the ancient system one. <strong>The default to use.</strong></span></div>
  <div class="kv"><span class="k"><code>/bin/sh</code></span><span class="v">On Debian and Ubuntu this is <code>dash</code>, not bash. No <code>[[ ]]</code>, no arrays, no <code>local</code>, no <code>\${var^^}</code>. A bash script with this shebang fails in confusing ways.</span></div>
</div>
<div class="callout warn">macOS still ships <strong>bash 3.2</strong> from 2007 as <code>/bin/bash</code>, because bash 4 changed licence. So <code>mapfile</code>, <code>\${var^^}</code>, associative arrays and <code>&amp;&gt;&gt;</code> are all missing there. <code>#!/usr/bin/env bash</code> picks up a Homebrew bash 5 if one is installed — which is why the portable form matters even when you only ever target Linux servers.</div>

<h3>set -euo pipefail, one flag at a time</h3>
${slide('lx-07', 5, 'Strict mode: mỗi cờ chặn một kiểu hỏng')}
<pre><code>set -e            <span class="tok-comment"># exit immediately if a command fails</span>
set -u            <span class="tok-comment"># error on an undefined variable</span>
set -o pipefail   <span class="tok-comment"># a pipeline fails if ANY stage fails</span>

set -euo pipefail <span class="tok-comment"># all three, the conventional one-liner</span></code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">-e (errexit)</span><span class="lz-lnote">Stop on the first failing command instead of ploughing on. Without it, <code>cd /nonexistent</code> followed by <code>rm -rf *</code> deletes the wrong directory.</span></div>
  <div class="lz-layer"><span class="lz-lname">-u (nounset)</span><span class="lz-lnote">A typo'd variable becomes an error rather than an empty string. Without it, <code>rm -rf "\$PREFIX/data"</code> with <code>PREFIX</code> misspelled becomes <code>rm -rf "/data"</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">-o pipefail</span><span class="lz-lnote">Lesson 3.2: by default a pipeline reports only the LAST command's status, so <code>curl bad-url | jq .</code> "succeeds". With pipefail it does not.</span></div>
  <div class="lz-layer"><span class="lz-lname">IFS=\$'\\n\\t'</span><span class="lz-lnote">Removes the space from the field separator, so an accidentally unquoted expansion splits on far fewer inputs. A safety net, not a substitute for quoting (Lesson 6.2).</span></div>
</div>
<pre><code><span class="tok-comment"># Without -u: a typo silently becomes a catastrophe</span>
PREFIX=/srv/app
rm -rf "\$PREFX/data"      <span class="tok-comment"># typo → rm -rf "/data"</span>

<span class="tok-comment"># With -u</span>
set -u
rm -rf "\$PREFX/data"</code></pre>
<div class="out">./script.sh: line 4: PREFX: unbound variable</div>

<h3>The three places -e does not fire</h3>
${slide('lx-07', 6, 'set -e KHÔNG dừng ở những chỗ này — đo từng ca')}
<p>This is the part most guides omit, and it is why <code>set -e</code> has a reputation for being unreliable. It is reliable — it just has clearly defined exceptions, and if you do not know them you will trust it where it does not apply.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Inside a condition</span><span class="lz-t">if cmd; then · while cmd · cmd &amp;&amp; other · ! cmd</span><span class="lz-d">A command whose status is being TESTED never triggers -e. That is deliberate and necessary — otherwise every if-statement would abort the script.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Not the last in a pipeline</span><span class="lz-t">failing-cmd | tee log</span><span class="lz-d">Only the last stage's status counts, unless you add pipefail. This is exactly why the third flag exists.</span></div>
  <div class="lz-step"><span class="lz-k">3 · In a command substitution used as an assignment</span><span class="lz-t">local x=\$(failing-cmd)</span><span class="lz-d">The assignment's own status wins, and <code>local</code> always succeeds. Declare and assign on separate lines (Lesson 6.1).</span></div>
</div>
<pre><code><span class="tok-comment"># Trap 1 in the wild — this does NOT exit; count is now EMPTY (the assignment did run: tested, count=[] for a missing file, count=[0] for a file with no match)</span>
set -e
if ! count=\$(grep -c ERROR missing.log); then
  count=0                  <span class="tok-comment"># correct: handle it explicitly</span>
fi

<span class="tok-comment"># Trap 3 in the wild</span>
process() {
  local out=\$(failing-cmd)    <span class="tok-comment"># WRONG: never aborts</span>
  local out                   <span class="tok-comment"># RIGHT</span>
  out=\$(failing-cmd)          <span class="tok-comment">#   two lines, and -e works</span>
}</code></pre>
<div class="callout ok">The practical consequence: use <code>set -euo pipefail</code> <em>and</em> keep checking exit codes explicitly where it matters. Treat strict mode as a net that catches the failures you did not think about, not as a replacement for handling the ones you did. That framing is what makes it genuinely useful rather than a false sense of safety.</div>

<h3>Commands that are allowed to fail</h3>
<pre><code><span class="tok-comment"># These would abort under -e. Say so explicitly.</span>
grep -q pattern file || true          <span class="tok-comment"># "no match" is a valid outcome</span>
rm -f "\$tmpfile" || true              <span class="tok-comment"># cleanup should never fail the script</span>

if grep -q pattern file; then         <span class="tok-comment"># clearer still: use the status</span>
  echo found
fi

count=\$(grep -c pattern file || true) <span class="tok-comment"># capture, tolerate no-match</span></code></pre>
<p><code>|| true</code> is the standard way to say "I know this can fail and that is fine". Used sparingly it documents intent; scattered everywhere it disables strict mode one line at a time, which is worse than not enabling it.</p>

<h3>The skeleton to copy</h3>
${slide('lx-07', 3, 'Bộ khung chuẩn: mỗi dòng đầu chặn một kiểu hỏng')}
<pre><code>#!/usr/bin/env bash
#
# deploy.sh — build and deploy the application
# Usage: ./deploy.sh &lt;staging|production&gt; [--dry-run]

set -euo pipefail
IFS=\$'\\n\\t'

<span class="tok-comment"># Where this script lives (Lesson 6.1) — NOT resolved through symlinks; see "Where the script really lives" below</span>
readonly SCRIPT_DIR=\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" &amp;&amp; pwd)
readonly SCRIPT_NAME=\${0##*/}

<span class="tok-comment"># Diagnostics go to stderr so stdout stays capturable</span>
log()  { printf '[%s] %s\\n' "\$(date +%H:%M:%S)" "\$*" &gt;&amp;2; }
die()  { log "ERROR: \$*"; exit 1; }
usage() { sed -n '3,4p' "\${BASH_SOURCE[0]}" | sed 's/^# \\?//'; }

main() {
  [[ \$# -ge 1 ]] || { usage; exit 2; }

  local env=\$1
  case \$env in
    staging|production) ;;
    -h|--help) usage; exit 0 ;;
    *) die "unknown environment: \$env" ;;
  esac

  command -v docker &gt;/dev/null || die "docker is not installed"

  log "deploying to \$env"
  <span class="tok-comment"># … the actual work …</span>
  log "done"
}

main "\$@"</code></pre>
<div class="out">$ ./deploy.sh
deploy.sh — build and deploy the application
Usage: ./deploy.sh &lt;staging|production&gt; [--dry-run]
$ ./deploy.sh prod
[14:22:03] ERROR: unknown environment: prod</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>main "\$@"</code></span><span class="v">Wrapping the body in a function means nothing runs until the whole file has been parsed — so a syntax error near the end cannot leave a half-executed script. It also gives you <code>local</code> variables and an obvious entry point.</span></div>
  <div class="kv"><span class="k"><code>readonly</code></span><span class="v">Constants that a later line cannot accidentally reassign. Cheap, and it turns a class of bug into an error.</span></div>
  <div class="kv"><span class="k"><code>log</code> to stderr</span><span class="v">So <code>result=\$(./script.sh)</code> captures only real output. Diagnostics on stdout is the reason so many scripts cannot be composed.</span></div>
  <div class="kv"><span class="k"><code>usage</code> from the header</span><span class="v">The help text is the comment block, so it cannot drift out of date. One source of truth.</span></div>
</div>

<h3>Where to put the script</h3>
<pre><code>chmod +x deploy.sh                     <span class="tok-comment"># executable (Chapter 4)</span>
./deploy.sh                            <span class="tok-comment"># run from here (Lesson 1.2)</span>
mv deploy.sh ~/.local/bin/deploy       <span class="tok-comment"># on PATH, no extension needed</span>
sudo mv deploy.sh /usr/local/bin/      <span class="tok-comment"># system-wide (Lesson 1.3)</span></code></pre>
<div class="callout"><code>~/.local/bin</code> is on <code>PATH</code> by default on modern distributions and needs no <code>sudo</code>. Dropping the <code>.sh</code> extension when you install it is conventional: users of a command should not need to know what language it is written in, and it lets you rewrite it in Python later without breaking anyone's muscle memory. Chapter 8 covers <code>PATH</code> in full.</div>

<h3>set -e, measured: every case in one table</h3>
<p>The three exceptions above are the ones you will meet most, but they are not the whole list. Each row below was run as its own <code>bash -c "set -e; …; echo CONTINUED"</code> on Ubuntu 24.04 (bash 5.2.21), so you can see exactly which failures stop a script and which slide straight past.</p>
<table>
<tr><th>Case</th><th>Result (real)</th><th>Why</th></tr>
<tr><td><code>false</code> on its own line</td><td>stops, exit 1</td><td>the ordinary case -e was made for</td></tr>
<tr><td><code>if false; then …; fi</code></td><td>continues</td><td>the status is being tested</td></tr>
<tr><td><code>false || echo rescued</code></td><td>continues</td><td>left side of <code>||</code> is exempt</td></tr>
<tr><td><code>false &amp;&amp; echo x</code></td><td>continues</td><td>every part except the LAST command of an <code>&amp;&amp;</code> list is exempt</td></tr>
<tr><td><code>! true</code></td><td>continues</td><td>a negated status never triggers -e</td></tr>
<tr><td><code>false | cat</code> (no pipefail)</td><td>continues</td><td>only the last stage counts</td></tr>
<tr><td><code>set -o pipefail; false | cat</code></td><td>stops, exit 1</td><td>pipefail makes the whole pipe fail</td></tr>
<tr><td><code>x=\$(false)</code></td><td>stops, exit 1</td><td>a plain assignment keeps the substitution's status</td></tr>
<tr><td><code>local x=\$(false)</code> in a function</td><td>continues</td><td><code>local</code> returns 0 and hides it</td></tr>
<tr><td><code>readonly y=\$(false)</code> · <code>export z=\$(false)</code></td><td>continues</td><td>same masking as <code>local</code></td></tr>
<tr><td><code>f(){ false; echo inside; }; if f; then …</code></td><td>prints "inside", continues</td><td>-e is switched off for the WHOLE function body while it runs in a condition</td></tr>
<tr><td><code>echo "\$(false; echo hi)"</code></td><td>prints "hi", continues</td><td>subshells of <code>\$( )</code> do not inherit -e unless <code>shopt -s inherit_errexit</code></td></tr>
</table>
<pre><code><span class="tok-comment"># The trap nobody expects: an &amp;&amp; test as the LAST line of a function</span>
bash -c 'set -e
  f() { [[ -n "" ]] &amp;&amp; echo x; }     <span class="tok-comment"># the test is false, so f RETURNS 1</span>
  f; echo AFTER-f'; echo "exit=\$?"</code></pre>
<div class="out">exit=1</div>
<p>Nothing was printed — not even an error. The <code>&amp;&amp;</code> inside <code>f</code> was exempt, but its false status became the function's return value, and the <em>call</em> <code>f</code> is an ordinary command, so -e killed the script silently. Two fixes: end the function with <code>return 0</code>, or write the test as <code>if [[ … ]]; then …; fi</code>. ShellCheck will not always spot this one, which is why it is worth remembering.</p>
<div class="callout ok"><strong>Where <code>-E</code> comes from.</strong> The skeleton on slide 3 uses <code>set -Eeuo pipefail</code> — one extra letter. <code>-E</code> (errtrace) makes a <code>trap … ERR</code> fire inside functions and <code>\$( )</code> too. It changes nothing until you add an ERR trap (Lesson 7.3), but most real scripts put everything inside <code>main()</code>, and there the ERR trap is completely silent without it — measured in Lesson 7.3. Put the <code>E</code> in from day one.</div>

<h3>A real story: cd fails, the whole &amp;&amp; chain is skipped — and the script reports success</h3>
${slide('lx-07', 7, 'cd hỏng trong chuỗi &&: cả chuỗi bị bỏ, script vẫn báo xong')}
<p>A student project deploys with one line, <code>cd /srv/app &amp;&amp; git pull &amp;&amp; docker compose up -d</code>. One day someone renames the folder (or types <code>/srv/ap</code>). This is the script, with strict mode switched on, run for real:</p>
<pre><code>#!/usr/bin/env bash
set -euo pipefail
cd /srv/ap &amp;&amp; git pull &amp;&amp; docker compose up -d
echo "Deploy xong ✔"</code></pre>
<div class="out">$ ./deploy-cu.sh; echo "exit: \$?"
./deploy-cu.sh: line 3: cd: /srv/ap: No such file or directory
Deploy xong ✔
exit: 0</div>
<p>Read it slowly. <code>cd</code> failed, so <code>&amp;&amp;</code> skipped <code>git pull</code> and <code>docker compose</code> — nothing was deployed. But the failing command sat <em>inside</em> an <code>&amp;&amp;</code> list, which is exempt from -e, so the script carried on to the next line, printed "Deploy xong ✔" and exited 0. CI shows green; production still runs last week's code. The version with <code>;</code> instead of <code>&amp;&amp;</code> is worse: <code>cd /srv/ap/tmp; rm -rf ./*</code> runs the <code>rm</code> in whatever directory you were already in. Reproduced in a container inside a project folder: everything was deleted except <code>.env</code>, and only because the glob <code>*</code> skips dotfiles.</p>
<pre><code>cd /srv/ap || { echo "cannot enter /srv/ap" &gt;&amp;2; exit 1; }   <span class="tok-comment"># stop AT the cd</span>
git pull                                                     <span class="tok-comment"># one step per line:</span>
docker compose up -d                                         <span class="tok-comment"># now -e sees each one</span></code></pre>
<div class="out">$ ./deploy-moi.sh; echo "exit: \$?"
./deploy-moi.sh: line 3: cd: /srv/ap: No such file or directory
cannot enter /srv/ap
exit: 1</div>
<div class="callout warn">Rule of thumb: in a script, <strong>never put a command whose failure matters in the middle of an <code>&amp;&amp;</code> chain</strong>. Chains are for the interactive prompt, where you are watching. ShellCheck flags the bare form as SC2164 ("Use 'cd ... || exit'").</div>

<h3>Scripts from Windows: <code>\$'\\r': command not found</code></h3>
${slide('lx-07', 8, 'Script từ Windows: $\'\\r\': command not found')}
<p>A teammate on Windows edits <code>deploy.sh</code> in an editor set to Windows line endings and pushes it. Windows ends every line with two characters, <code>\\r\\n</code> (carriage return + newline); Linux uses only <code>\\n</code>. bash therefore sees an invisible <code>\\r</code> glued to the last word of every line. Rebuilt in a container:</p>
<pre><code>printf 'cd /tmp\\r\\npwd\\r\\n' &gt; crlf.sh
bash crlf.sh; echo "exit=\$?"
file crlf.sh
sed -i 's/\\r\$//' crlf.sh &amp;&amp; bash crlf.sh
file crlf.sh</code></pre>
<div class="out">crlf.sh: line 1: cd: \$'/tmp\\r': No such file or directory
crlf.sh: line 2: \$'pwd\\r': command not found
exit=127
crlf.sh: ASCII text, with CRLF line terminators
/tmp
crlf.sh: ASCII text</div>
<table>
<tr><th>Symptom</th><th>What bash actually saw</th></tr>
<tr><td><code>/usr/bin/env: 'bash\\r': No such file or directory</code> (running <code>./x.sh</code>)</td><td>the shebang asks for a program called <code>bash\\r</code></td></tr>
<tr><td><code>\$'\\r': command not found</code></td><td>an "empty" line that actually holds one <code>\\r</code></td></tr>
<tr><td><code>set: pipefail: invalid option name</code></td><td><code>set -euo pipefail\\r</code> — the option is <code>pipefail\\r</code></td></tr>
<tr><td><code>cd: \$'/tmp\\r': No such file or directory</code></td><td>a path with a carriage return at the end</td></tr>
</table>
<p>Diagnose with <code>file x.sh</code> ("with CRLF line terminators") or <code>cat -A x.sh</code> (every line ends in <code>^M\$</code>). Fix the file with <code>sed -i 's/\\r\$//' x.sh</code> or <code>dos2unix x.sh</code>. Stop it happening again with a <code>.gitattributes</code> file in the repository containing <code>*.sh text eol=lf</code>: tested with <code>core.autocrlf=true</code>, git still checked the file out with LF (<code>git ls-files --eol</code> printed <code>i/lf w/lf attr/text eol=lf</code>). In VS Code, the "CRLF/LF" indicator in the bottom-right status bar switches one file.</p>

<h3>Where the script really lives: symlinks and <code>readlink -f</code></h3>
<p>The skeleton finds its own folder with <code>cd "\$(dirname "\${BASH_SOURCE[0]}")" &amp;&amp; pwd</code>. That is correct when you run the file directly, but it does <strong>not</strong> follow symlinks — and installing a script as a link in <code>~/bin</code> is common. Tested with the file in <code>~/app/where.sh</code> and a link <code>~/bin/where</code>:</p>
<pre><code>readonly SCRIPT_DIR=\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" &amp;&amp; pwd)
readonly THAT_DIR=\$(dirname "\$(readlink -f "\${BASH_SOURCE[0]}")")</code></pre>
<div class="out">$ ~/app/where.sh
cd+pwd:       /home/an/app
readlink -f:  /home/an/app
$ ~/bin/where
cd+pwd:       /home/an/bin
readlink -f:  /home/an/app</div>
<p>Called through the link, the first form answers <code>~/bin</code>, so a script that then reads <code>\$SCRIPT_DIR/.env</code> looks in the wrong folder. <code>readlink -f</code> resolves every link to the real file. It exists in GNU coreutils and — since macOS 12.3 — on the Mac as well (tested on macOS 27: <code>readlink -f /tmp</code> prints <code>/private/tmp</code>). On an older Mac it is missing; <code>realpath</code> is the usual substitute.</p>

<h3>Run it step by step</h3>
<p>Five small experiments in the course sandbox. Type them; predict each output before pressing Enter.</p>
<pre><code>mkdir -p ~/thu-linux/ch7 &amp;&amp; cd ~/thu-linux/ch7
printf '#!/bin/sh\\nten=an\\necho "\${ten^^}"\\n' &gt; sai.sh &amp;&amp; chmod +x sai.sh
./sai.sh; echo "exit=\$?"                  <span class="tok-comment"># 1. dash runs it</span>
bash sai.sh                                <span class="tok-comment"># 2. bash runs the same file</span>
printf 'set -e\\nf() { local x=\$(false); echo "still running"; }\\nf\\n' &gt; che.sh
bash che.sh                                <span class="tok-comment"># 3. local hides the failure</span>
printf 'cd /tmp\\r\\npwd\\r\\n' &gt; crlf.sh &amp;&amp; bash crlf.sh   <span class="tok-comment"># 4. CRLF</span>
sed -i 's/\\r\$//' crlf.sh &amp;&amp; bash crlf.sh                   <span class="tok-comment"># 5. fixed</span></code></pre>
<div class="out">./sai.sh: 3: Bad substitution
exit=2
AN
still running
crlf.sh: line 1: cd: \$'/tmp\\r': No such file or directory
crlf.sh: line 2: \$'pwd\\r': command not found
/tmp</div>
<p>Reading it: the shebang <code>#!/bin/sh</code> handed the file to <code>dash</code>, which does not know <code>\${ten^^}</code>; the same file under <code>bash</code> printed <code>AN</code>. <code>local</code> swallowed the <code>false</code>, so -e never fired. The CRLF file failed on every line until <code>sed</code> removed the <code>\\r</code>. (Ubuntu 24.04 container, user <code>an</code>; on the Mac, use <code>sed -i ''</code> instead of <code>sed -i</code>.)</p>

<h3>On macOS and WSL: what is different</h3>
${slide('lx-07', 28, 'Trên Mac: bash 3.2, mktemp và sed kiểu BSD, không có flock')}
<table>
<tr><th>Thing in this lesson</th><th>Ubuntu / WSL2</th><th>macOS 27 (tested)</th></tr>
<tr><td><code>/bin/bash --version</code></td><td>5.2.21</td><td><strong>3.2.57</strong> (2007) — Apple never shipped bash 4+, because it is GPLv3</td></tr>
<tr><td><code>\${ten^^}</code>, <code>declare -A</code></td><td>work</td><td><code>bad substitution</code>, <code>declare: -A: invalid option</code></td></tr>
<tr><td><code>/bin/sh</code></td><td>dash</td><td>bash 3.2 in POSIX mode</td></tr>
<tr><td><code>readlink -f</code></td><td>yes</td><td>yes (macOS 12.3 and later)</td></tr>
<tr><td><code>sed 's/^# \\?//'</code> (the skeleton's <code>usage</code>)</td><td>strips "# "</td><td>does nothing — BSD sed has no <code>\\?</code>; <code>sed -E 's/^# ?//'</code> works on both</td></tr>
<tr><td><code>sed -i 's/\\r\$//' f</code></td><td>works</td><td>needs an empty suffix: <code>sed -i '' 's/\\r\$//' f</code></td></tr>
</table>
<p>WSL2 is a real Ubuntu kernel and userland, so everything behaves as on the VPS — with one trap: files created in the Windows side of the disk (<code>/mnt/c/…</code>) by Windows editors are the classic source of CRLF scripts. A Mac user who wants modern bash installs it with Homebrew; <code>#!/usr/bin/env bash</code> then picks up bash 5 automatically, while <code>#!/bin/bash</code> would still get 3.2.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your SWP391 group has a <code>deploy.sh</code> that "worked yesterday". A teammate on Windows edited it, and the log now shows <code>\$'\\r': command not found</code> followed by "Deploy xong ✔". Rehearse the repair in <code>~/thu-linux/ch7</code> (or an <code>ubuntu:24.04</code> container).</p><ol>
<li>Recreate it: write a 4-line <code>deploy.sh</code> with shebang, <code>set -euo pipefail</code>, <code>cd /srv/ap &amp;&amp; echo pulling</code> and <code>echo "Deploy xong"</code>; convert it to CRLF with <code>sed -i 's/\$/\\r/' deploy.sh</code>.</li>
<li>Run <code>bash deploy.sh</code> and <code>file deploy.sh</code>; name the two symptoms. Remove the <code>\\r</code> and run again.</li>
<li>Now the script prints "Deploy xong" with exit 0 although <code>cd</code> failed. Rewrite line 3 so it stops at the <code>cd</code> with a message and exit 1.</li>
<li>Change the shebang to <code>#!/usr/bin/env bash</code> (if it was <code>/bin/sh</code>), add <code>set -Eeuo pipefail</code> and wrap the body in <code>main "\$@"</code>.</li></ol>
<p><strong>Done when:</strong> <code>file deploy.sh</code> no longer mentions CRLF; <code>./deploy.sh; echo \$?</code> prints your message and <code>1</code> while <code>/srv/ap</code> does not exist; and <code>bash -n deploy.sh</code> is silent.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Shebang</span><span class="v">The first line <code>#!…</code>; the kernel reads it to choose the interpreter that runs the file.</span></div>
  <div class="kv"><span class="k">Strict mode</span><span class="v">The convention <code>set -Eeuo pipefail</code> (+ <code>IFS</code>): stop on errors, unset variables and broken pipes.</span></div>
  <div class="kv"><span class="k">errexit (<code>-e</code>)</span><span class="v">Exit when a command fails — except in conditions, <code>||</code>/<code>&amp;&amp;</code> lists and masked assignments.</span></div>
  <div class="kv"><span class="k">nounset (<code>-u</code>)</span><span class="v">Treat a reference to an unset variable as an error instead of an empty string.</span></div>
  <div class="kv"><span class="k">pipefail</span><span class="v">A pipeline's status is the last non-zero stage, not just the last stage.</span></div>
  <div class="kv"><span class="k">errtrace (<code>-E</code>)</span><span class="v">Let an ERR trap fire inside functions and command substitutions.</span></div>
  <div class="kv"><span class="k">CRLF</span><span class="v">Windows line ending <code>\\r\\n</code>; the stray <code>\\r</code> breaks every line of a bash script.</span></div>
  <div class="kv"><span class="k">Exit status</span><span class="v">The number a command returns: 0 = success, anything else = failure; <code>\$?</code> holds the last one.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Start every script with <code>#!/usr/bin/env bash</code> and <code>set -Eeuo pipefail</code>; <code>/bin/sh</code> is dash on Ubuntu and bash 3.2 on a Mac.</li>
<li><code>set -e</code> skips conditions, <code>||</code>/<code>&amp;&amp;</code> lists, <code>local</code>/<code>readonly</code>/<code>export</code> with <code>\$( )</code>, and whole functions called from <code>if</code>.</li>
<li>A failing <code>cd</code> inside an <code>&amp;&amp;</code> chain silently skips the rest and the script still exits 0 — write <code>cd … || die</code>.</li>
<li><code>\$'\\r': command not found</code> means CRLF line endings: <code>file</code> to see it, <code>sed -i 's/\\r\$//'</code> to fix, <code>.gitattributes</code> to prevent.</li>
<li><code>cd "\$(dirname …)" &amp;&amp; pwd</code> does not follow symlinks; <code>readlink -f</code> does.</li>
<li>Put the body in <code>main "\$@"</code> and send diagnostics to stderr, so the script either finishes or stops with a message and a non-zero code.</li>
</ul>

<a class="link-card" href="http://redsymbol.net/articles/unofficial-bash-strict-mode/" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Unofficial Bash Strict Mode</span><span class="lc-sub">The article that popularised <code>set -euo pipefail</code> plus <code>IFS</code>, with each flag's failure modes spelled out. The canonical reference.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/105" target="_blank" rel="noopener">
  <span class="lc-ico">⚠️</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 105 — "Why doesn't set -e do what I expected?"</span><span class="lc-sub">The counter-argument, listing every exception in detail. Read both this and the article above; the truth is that strict mode is useful <em>and</em> has sharp edges.</span></span>
</a>
<a class="link-card" href="https://google.github.io/styleguide/shellguide.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Google Shell Style Guide</span><span class="lc-sub">Where to use bash at all, the <code>main "\$@"</code> convention, naming, and when a script has outgrown the shell. Opinionated and well argued.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: harden a fragile script</span><span class="lc-sub">You are given a working script with no strict mode and three latent bugs. Add the skeleton, and watch each bug become a clear error.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> adding <code>set -e</code> to an existing script and assuming it is now safe. It changes behaviour retroactively — code that relied on continuing past a failing <code>grep</code> now aborts, and code that <em>should</em> abort still does not, because of the three exceptions above. Add strict mode to a <strong>new</strong> script from line one. When retrofitting an old one, run it end to end afterwards and read the output: the common outcome is a script that now exits silently at the first <code>grep</code> that finds nothing, which is a behaviour change nobody notices until the nightly job stops doing half its work.</div>
<p class="note-ct"><strong>Copy the skeleton above and start every script from it.</strong> Six lines of boilerplate turn "it worked when I ran it" into "it fails loudly and says why". The single highest-value habit in this chapter is that a script should either do its job completely or stop with a message on stderr and a nonzero exit code — never do half the job and report success.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Bộ khung</h2>
<p class="lead">Một script chạy trên laptop của bạn và một script chạy không người trông lúc 3 giờ sáng là hai thứ khác nhau. Khác biệt gần như nằm trọn trong sáu dòng đầu. Bài này nói về những dòng đó — và, quan trọng hơn, về ba trường hợp mà cái <code>set -e</code> nổi tiếng <em>KHÔNG</em> cứu bạn, vì tin rằng nó luôn hiệu quả còn tệ hơn là không dùng nó.</p>

<h3>Dòng shebang</h3>
${slide('lx-07', 4, 'Shebang chọn trình thông dịch — /bin/sh trên Ubuntu là dash')}
<pre><code>#!/usr/bin/env bash        <span class="tok-comment"># khả chuyển — tìm bash qua PATH</span>
#!/bin/bash                <span class="tok-comment"># đường dẫn cứng — ổn trên Linux, sai trên vài hệ khác</span>
#!/bin/sh                  <span class="tok-comment"># sh chuẩn POSIX — KHÔNG phải bash, phần lớn khoá này không áp dụng</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>/usr/bin/env bash</code></span><span class="v">Tra bash trong <code>PATH</code>. Tìm ra một bản bash mới hơn từ Homebrew trên macOS, hoặc từ một hồ sơ Nix, thay vì bản hệ thống cổ lỗ. <strong>Mặc định nên dùng.</strong></span></div>
  <div class="kv"><span class="k"><code>/bin/sh</code></span><span class="v">Trên Debian và Ubuntu, đây là <code>dash</code>, không phải bash. Không có <code>[[ ]]</code>, không mảng, không <code>local</code>, không <code>\${var^^}</code>. Một script bash mang shebang này sẽ hỏng theo những kiểu khó hiểu.</span></div>
</div>
<div class="callout warn">macOS tới nay vẫn kèm <strong>bash 3.2</strong> từ năm 2007 ở đường dẫn <code>/bin/bash</code>, vì bash 4 đổi giấy phép. Nên <code>mapfile</code>, <code>\${var^^}</code>, mảng liên kết và <code>&amp;&gt;&gt;</code> đều KHÔNG có ở đó. <code>#!/usr/bin/env bash</code> sẽ nhặt được bản bash 5 của Homebrew nếu có cài — và đó là lý do dạng khả chuyển vẫn quan trọng kể cả khi bạn chỉ nhắm tới máy chủ Linux.</div>

<h3>set -euo pipefail, từng cờ một</h3>
${slide('lx-07', 5, 'Strict mode: mỗi cờ chặn một kiểu hỏng')}
<pre><code>set -e            <span class="tok-comment"># thoát ngay khi một lệnh thất bại</span>
set -u            <span class="tok-comment"># báo lỗi khi gặp biến chưa định nghĩa</span>
set -o pipefail   <span class="tok-comment"># chuỗi ống thất bại nếu BẤT KỲ khâu nào thất bại</span>

set -euo pipefail <span class="tok-comment"># cả ba, dạng một dòng theo quy ước</span></code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">-e (errexit)</span><span class="lz-lnote">Dừng ở lệnh hỏng đầu tiên thay vì cứ cắm đầu chạy tiếp. Không có nó, <code>cd /nonexistent</code> rồi <code>rm -rf *</code> sẽ xoá nhầm thư mục.</span></div>
  <div class="lz-layer"><span class="lz-lname">-u (nounset)</span><span class="lz-lnote">Một biến gõ sai trở thành LỖI thay vì thành chuỗi rỗng. Không có nó, <code>rm -rf "\$PREFIX/data"</code> với <code>PREFIX</code> viết sai sẽ thành <code>rm -rf "/data"</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">-o pipefail</span><span class="lz-lnote">Bài 3.2: mặc định một chuỗi ống chỉ báo cáo trạng thái của lệnh CUỐI, nên <code>curl bad-url | jq .</code> "thành công". Có pipefail thì không.</span></div>
  <div class="lz-layer"><span class="lz-lname">IFS=\$'\\n\\t'</span><span class="lz-lnote">Bỏ dấu cách khỏi dấu phân cách trường, nên một phép khai triển lỡ quên nháy sẽ cắt với ít đầu vào hơn nhiều. Là lưới đỡ, không phải thứ thay cho việc đặt nháy (Bài 6.2).</span></div>
</div>
<pre><code><span class="tok-comment"># Không có -u: một chỗ gõ sai âm thầm biến thành thảm hoạ</span>
PREFIX=/srv/app
rm -rf "\$PREFX/data"      <span class="tok-comment"># gõ sai → rm -rf "/data"</span>

<span class="tok-comment"># Có -u</span>
set -u
rm -rf "\$PREFX/data"</code></pre>
<div class="out">./script.sh: line 4: PREFX: unbound variable</div>

<h3>Ba chỗ mà -e KHÔNG kích hoạt</h3>
${slide('lx-07', 6, 'set -e KHÔNG dừng ở những chỗ này — đo từng ca')}
<p>Đây là phần mà phần lớn hướng dẫn bỏ qua, và đó là lý do <code>set -e</code> mang tiếng là không đáng tin. Nó ĐÁNG TIN — chỉ là nó có những ngoại lệ được định nghĩa rõ ràng, và nếu bạn không biết chúng thì bạn sẽ tin nó ở đúng những chỗ nó không áp dụng.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Bên trong một điều kiện</span><span class="lz-t">if cmd; then · while cmd · cmd &amp;&amp; other · ! cmd</span><span class="lz-d">Một lệnh mà trạng thái của nó ĐANG BỊ KIỂM thì không bao giờ kích hoạt -e. Đó là chủ ý và là điều bắt buộc — nếu không thì mọi câu lệnh if sẽ làm script chết.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Không phải khâu cuối của chuỗi ống</span><span class="lz-t">lệnh-hỏng | tee log</span><span class="lz-d">Chỉ trạng thái của khâu cuối được tính, trừ khi bạn thêm pipefail. Đó chính xác là lý do cái cờ thứ ba tồn tại.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Trong phép thay thế lệnh dùng làm phép gán</span><span class="lz-t">local x=\$(lệnh-hỏng)</span><span class="lz-d">Trạng thái của chính phép gán thắng, mà <code>local</code> thì luôn thành công. Hãy khai báo và gán trên hai dòng riêng (Bài 6.1).</span></div>
</div>
<pre><code><span class="tok-comment"># Bẫy 1 ngoài đời — cái này KHÔNG thoát; count giờ là chuỗi RỖNG (phép gán vẫn chạy: đã thử, file không tồn tại ⇒ count=[], file không khớp dòng nào ⇒ count=[0])</span>
set -e
if ! count=\$(grep -c ERROR missing.log); then
  count=0                  <span class="tok-comment"># đúng: xử lý nó một cách tường minh</span>
fi

<span class="tok-comment"># Bẫy 3 ngoài đời</span>
process() {
  local out=\$(lệnh-hỏng)      <span class="tok-comment"># SAI: không bao giờ dừng</span>
  local out                   <span class="tok-comment"># ĐÚNG</span>
  out=\$(lệnh-hỏng)            <span class="tok-comment">#   hai dòng, và -e hoạt động</span>
}</code></pre>
<div class="callout ok">Hệ quả thực tế: hãy dùng <code>set -euo pipefail</code> <em>VÀ</em> vẫn kiểm mã thoát một cách tường minh ở những chỗ quan trọng. Hãy coi chế độ nghiêm ngặt là một cái lưới hứng những thất bại bạn KHÔNG nghĩ tới, không phải thứ thay cho việc xử lý những thất bại bạn ĐÃ nghĩ tới. Chính cách đóng khung đó làm nó thật sự hữu ích thay vì thành một cảm giác an toàn giả.</div>

<h3>Những lệnh ĐƯỢC PHÉP thất bại</h3>
<pre><code><span class="tok-comment"># Mấy lệnh này sẽ làm script chết dưới -e. Hãy nói rõ ra.</span>
grep -q pattern file || true          <span class="tok-comment"># "không khớp" là một kết quả hợp lệ</span>
rm -f "\$tmpfile" || true              <span class="tok-comment"># việc dọn dẹp không bao giờ nên làm hỏng script</span>

if grep -q pattern file; then         <span class="tok-comment"># rõ hơn nữa: dùng chính cái trạng thái đó</span>
  echo tìm thấy
fi

count=\$(grep -c pattern file || true) <span class="tok-comment"># hứng lấy, chấp nhận việc không khớp</span></code></pre>
<p><code>|| true</code> là cách chuẩn để nói "tôi biết cái này có thể hỏng và như thế là ổn". Dùng dè dặt thì nó ghi lại ý định; rắc khắp nơi thì nó tắt chế độ nghiêm ngặt từng dòng một, và như thế còn tệ hơn là không bật.</p>

<h3>Bộ khung để chép về</h3>
${slide('lx-07', 3, 'Bộ khung chuẩn: mỗi dòng đầu chặn một kiểu hỏng')}
<pre><code>#!/usr/bin/env bash
#
# deploy.sh — dựng và triển khai ứng dụng
# Cách dùng: ./deploy.sh &lt;staging|production&gt; [--dry-run]

set -euo pipefail
IFS=\$'\\n\\t'

<span class="tok-comment"># Script này nằm ở đâu (Bài 6.1) — KHÔNG giải liên kết tượng trưng; xem mục "Script thật sự nằm ở đâu" bên dưới</span>
readonly SCRIPT_DIR=\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" &amp;&amp; pwd)
readonly SCRIPT_NAME=\${0##*/}

<span class="tok-comment"># Thông báo chẩn đoán đi ra stderr để stdout vẫn hứng được</span>
log()  { printf '[%s] %s\\n' "\$(date +%H:%M:%S)" "\$*" &gt;&amp;2; }
die()  { log "ERROR: \$*"; exit 1; }
usage() { sed -n '3,4p' "\${BASH_SOURCE[0]}" | sed 's/^# \\?//'; }

main() {
  [[ \$# -ge 1 ]] || { usage; exit 2; }

  local env=\$1
  case \$env in
    staging|production) ;;
    -h|--help) usage; exit 0 ;;
    *) die "môi trường không hợp lệ: \$env" ;;
  esac

  command -v docker &gt;/dev/null || die "chưa cài docker"

  log "đang deploy lên \$env"
  <span class="tok-comment"># … phần việc thật …</span>
  log "xong"
}

main "\$@"</code></pre>
<div class="out">$ ./deploy.sh
deploy.sh — dựng và triển khai ứng dụng
Cách dùng: ./deploy.sh &lt;staging|production&gt; [--dry-run]
$ ./deploy.sh prod
[14:22:03] ERROR: môi trường không hợp lệ: prod</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>main "\$@"</code></span><span class="v">Bọc phần thân vào một hàm nghĩa là không gì chạy cho tới khi cả file đã được phân tích xong — nên một lỗi cú pháp gần cuối file không thể để lại một script chạy dở. Nó còn cho bạn biến <code>local</code> và một điểm vào rõ ràng.</span></div>
  <div class="kv"><span class="k"><code>readonly</code></span><span class="v">Những hằng số mà một dòng phía sau không thể lỡ tay gán lại. Rẻ, và nó biến cả một lớp lỗi thành một thông báo lỗi.</span></div>
  <div class="kv"><span class="k"><code>log</code> ra stderr</span><span class="v">Để <code>result=\$(./script.sh)</code> chỉ hứng đúng phần output thật. Đưa thông báo chẩn đoán ra stdout chính là lý do bao nhiêu script không ghép nối được với nhau.</span></div>
  <div class="kv"><span class="k"><code>usage</code> lấy từ phần đầu file</span><span class="v">Phần trợ giúp CHÍNH LÀ khối chú thích, nên nó không thể lệch pha theo thời gian. Một nguồn sự thật duy nhất.</span></div>
</div>

<h3>Đặt script ở đâu</h3>
<pre><code>chmod +x deploy.sh                     <span class="tok-comment"># cho chạy được (Chương 4)</span>
./deploy.sh                            <span class="tok-comment"># chạy từ ngay đây (Bài 1.2)</span>
mv deploy.sh ~/.local/bin/deploy       <span class="tok-comment"># nằm trên PATH, không cần phần đuôi</span>
sudo mv deploy.sh /usr/local/bin/      <span class="tok-comment"># cho toàn hệ thống (Bài 1.3)</span></code></pre>
<div class="callout"><code>~/.local/bin</code> nằm sẵn trên <code>PATH</code> ở các bản phân phối đời mới và không cần <code>sudo</code>. Bỏ phần đuôi <code>.sh</code> khi cài đặt là theo quy ước: người dùng một lệnh không cần biết nó viết bằng ngôn ngữ gì, và điều đó cho phép bạn viết lại nó bằng Python sau này mà không phá thói quen gõ của ai. Chương 8 nói đầy đủ về <code>PATH</code>.</div>

<h3>set -e, đo thật: mọi ca trong một bảng</h3>
<p>Ba ngoại lệ ở trên là ba cái bạn gặp nhiều nhất, nhưng chưa phải toàn bộ danh sách. Mỗi dòng dưới đây được chạy thành một lệnh riêng <code>bash -c "set -e; …; echo CHẠY TIẾP"</code> trên Ubuntu 24.04 (bash 5.2.21), để bạn thấy chính xác lỗi nào làm script dừng và lỗi nào trượt qua êm ru.</p>
<table>
<tr><th>Ca</th><th>Kết quả (thật)</th><th>Vì sao</th></tr>
<tr><td><code>false</code> đứng riêng một dòng</td><td>dừng, mã 1</td><td>ca bình thường mà -e sinh ra để bắt</td></tr>
<tr><td><code>if false; then …; fi</code></td><td>chạy tiếp</td><td>trạng thái đang bị KIỂM</td></tr>
<tr><td><code>false || echo cứu</code></td><td>chạy tiếp</td><td>vế trái của <code>||</code> được miễn</td></tr>
<tr><td><code>false &amp;&amp; echo x</code></td><td>chạy tiếp</td><td>mọi phần của danh sách <code>&amp;&amp;</code> trừ lệnh CUỐI đều được miễn</td></tr>
<tr><td><code>! true</code></td><td>chạy tiếp</td><td>trạng thái bị đảo thì không bao giờ kích hoạt -e</td></tr>
<tr><td><code>false | cat</code> (không pipefail)</td><td>chạy tiếp</td><td>chỉ khâu cuối được tính</td></tr>
<tr><td><code>set -o pipefail; false | cat</code></td><td>dừng, mã 1</td><td>pipefail làm cả ống thất bại</td></tr>
<tr><td><code>x=\$(false)</code></td><td>dừng, mã 1</td><td>phép gán trần giữ nguyên trạng thái của phép thay thế</td></tr>
<tr><td><code>local x=\$(false)</code> trong hàm</td><td>chạy tiếp</td><td><code>local</code> trả 0 và che mất nó</td></tr>
<tr><td><code>readonly y=\$(false)</code> · <code>export z=\$(false)</code></td><td>chạy tiếp</td><td>che y như <code>local</code></td></tr>
<tr><td><code>f(){ false; echo trong; }; if f; then …</code></td><td>in "trong", chạy tiếp</td><td>-e bị TẮT cho CẢ thân hàm khi hàm được gọi trong một điều kiện</td></tr>
<tr><td><code>echo "\$(false; echo hi)"</code></td><td>in "hi", chạy tiếp</td><td>shell con của <code>\$( )</code> không thừa hưởng -e, trừ khi bật <code>shopt -s inherit_errexit</code></td></tr>
</table>
<pre><code><span class="tok-comment"># Cái bẫy không ai ngờ: một phép kiểm &amp;&amp; nằm ở dòng CUỐI của hàm</span>
bash -c 'set -e
  f() { [[ -n "" ]] &amp;&amp; echo x; }     <span class="tok-comment"># phép kiểm sai, nên f TRẢ VỀ 1</span>
  f; echo SAU-f'; echo "mã=\$?"</code></pre>
<div class="out">mã=1</div>
<p>Không có gì được in ra — kể cả một dòng báo lỗi. Cái <code>&amp;&amp;</code> bên trong <code>f</code> được miễn, nhưng trạng thái "sai" của nó trở thành giá trị trả về của hàm, mà <em>lời gọi</em> <code>f</code> lại là một lệnh bình thường, nên -e giết script trong im lặng. Hai cách sửa: kết thúc hàm bằng <code>return 0</code>, hoặc viết phép kiểm thành <code>if [[ … ]]; then …; fi</code>. ShellCheck không phải lúc nào cũng bắt được cái này, nên đáng nhớ.</p>
<div class="callout ok"><strong>Chữ <code>-E</code> từ đâu ra.</strong> Bộ khung ở slide 3 dùng <code>set -Eeuo pipefail</code> — thêm đúng một chữ. <code>-E</code> (errtrace — lần vết lỗi) cho <code>trap … ERR</code> nổ được cả bên trong hàm và bên trong <code>\$( )</code>. Nó không đổi gì cho tới khi bạn đặt bẫy ERR (Bài 7.3), nhưng phần lớn script thật đặt mọi thứ trong <code>main()</code>, và ở đó thiếu nó thì bẫy ERR câm hoàn toàn — Bài 7.3 đo thật chuyện này. Hãy thêm chữ <code>E</code> ngay từ ngày đầu.</div>

<h3>Chuyện thật: cd hỏng, cả chuỗi &amp;&amp; bị bỏ qua — mà script vẫn báo thành công</h3>
${slide('lx-07', 7, 'cd hỏng trong chuỗi &&: cả chuỗi bị bỏ, script vẫn báo xong')}
<p>Một dự án sinh viên deploy bằng đúng một dòng, <code>cd /srv/app &amp;&amp; git pull &amp;&amp; docker compose up -d</code>. Một hôm có người đổi tên thư mục (hoặc gõ nhầm thành <code>/srv/ap</code>). Đây là script, đã bật chế độ nghiêm ngặt, chạy thật:</p>
<pre><code>#!/usr/bin/env bash
set -euo pipefail
cd /srv/ap &amp;&amp; git pull &amp;&amp; docker compose up -d
echo "Deploy xong ✔"</code></pre>
<div class="out">$ ./deploy-cu.sh; echo "mã thoát: \$?"
./deploy-cu.sh: line 3: cd: /srv/ap: No such file or directory
Deploy xong ✔
mã thoát: 0</div>
<p>Đọc chậm từng dòng. <code>cd</code> hỏng, nên <code>&amp;&amp;</code> bỏ qua <code>git pull</code> và <code>docker compose</code> — không có gì được deploy. Nhưng lệnh hỏng lại nằm <em>BÊN TRONG</em> một danh sách <code>&amp;&amp;</code>, thứ được miễn khỏi -e, nên script đi tiếp xuống dòng sau, in "Deploy xong ✔" và thoát với mã 0. CI báo xanh; production vẫn chạy mã của tuần trước. Bản dùng <code>;</code> thay cho <code>&amp;&amp;</code> còn tệ hơn: <code>cd /srv/ap/tmp; rm -rf ./*</code> chạy lệnh <code>rm</code> ở chính thư mục bạn ĐANG đứng. Dựng lại trong container, đứng trong một thư mục dự án: mọi thứ bị xoá sạch trừ <code>.env</code>, và chỉ vì glob <code>*</code> bỏ qua file bắt đầu bằng dấu chấm.</p>
<pre><code>cd /srv/ap || { echo "không vào được /srv/ap" &gt;&amp;2; exit 1; }   <span class="tok-comment"># dừng NGAY tại cd</span>
git pull                                                        <span class="tok-comment"># mỗi bước một dòng:</span>
docker compose up -d                                            <span class="tok-comment"># giờ -e thấy từng bước</span></code></pre>
<div class="out">$ ./deploy-moi.sh; echo "mã thoát: \$?"
./deploy-moi.sh: line 3: cd: /srv/ap: No such file or directory
không vào được /srv/ap
mã thoát: 1</div>
<div class="callout warn">Quy tắc ngón tay cái: trong script, <strong>đừng bao giờ đặt một lệnh mà việc nó hỏng là quan trọng vào GIỮA một chuỗi <code>&amp;&amp;</code></strong>. Chuỗi <code>&amp;&amp;</code> dành cho dấu nhắc tương tác, nơi bạn đang ngồi nhìn. ShellCheck đánh dấu dạng <code>cd</code> trần là SC2164 ("Use 'cd ... || exit'").</div>

<h3>Script từ Windows: <code>\$'\\r': command not found</code></h3>
${slide('lx-07', 8, 'Script từ Windows: $\'\\r\': command not found')}
<p>Một bạn cùng nhóm dùng Windows sửa <code>deploy.sh</code> trong một trình soạn thảo đang đặt kiểu xuống dòng của Windows rồi đẩy lên. Windows kết thúc mỗi dòng bằng HAI ký tự, <code>\\r\\n</code> (carriage return — về đầu dòng, và newline — xuống dòng); Linux chỉ dùng <code>\\n</code>. Vì vậy bash thấy một ký tự <code>\\r</code> vô hình dính vào từ cuối cùng của mọi dòng. Dựng lại trong container:</p>
<pre><code>printf 'cd /tmp\\r\\npwd\\r\\n' &gt; crlf.sh
bash crlf.sh; echo "mã=\$?"
file crlf.sh
sed -i 's/\\r\$//' crlf.sh &amp;&amp; bash crlf.sh
file crlf.sh</code></pre>
<div class="out">crlf.sh: line 1: cd: \$'/tmp\\r': No such file or directory
crlf.sh: line 2: \$'pwd\\r': command not found
mã=127
crlf.sh: ASCII text, with CRLF line terminators
/tmp
crlf.sh: ASCII text</div>
<table>
<tr><th>Triệu chứng</th><th>Thứ bash thật sự nhìn thấy</th></tr>
<tr><td><code>/usr/bin/env: 'bash\\r': No such file or directory</code> (khi chạy <code>./x.sh</code>)</td><td>dòng shebang đòi một chương trình tên là <code>bash\\r</code></td></tr>
<tr><td><code>\$'\\r': command not found</code></td><td>một dòng "trống" thật ra chứa một ký tự <code>\\r</code></td></tr>
<tr><td><code>set: pipefail: invalid option name</code></td><td><code>set -euo pipefail\\r</code> — tên tuỳ chọn thành <code>pipefail\\r</code></td></tr>
<tr><td><code>cd: \$'/tmp\\r': No such file or directory</code></td><td>một đường dẫn có ký tự về-đầu-dòng ở cuối</td></tr>
</table>
<p>Chẩn đoán bằng <code>file x.sh</code> (in "with CRLF line terminators") hoặc <code>cat -A x.sh</code> (mọi dòng kết thúc bằng <code>^M\$</code>). Sửa file bằng <code>sed -i 's/\\r\$//' x.sh</code> hoặc <code>dos2unix x.sh</code>. Chặn không cho tái diễn bằng một file <code>.gitattributes</code> trong kho chứa dòng <code>*.sh text eol=lf</code>: đã thử với <code>core.autocrlf=true</code>, git vẫn lấy file ra dạng LF (<code>git ls-files --eol</code> in <code>i/lf w/lf attr/text eol=lf</code>). Trong VS Code, chữ "CRLF/LF" ở thanh trạng thái góc dưới bên phải đổi được cho từng file.</p>

<h3>Script thật sự nằm ở đâu: liên kết tượng trưng và <code>readlink -f</code></h3>
<p>Bộ khung tìm thư mục của chính nó bằng <code>cd "\$(dirname "\${BASH_SOURCE[0]}")" &amp;&amp; pwd</code>. Cách đó đúng khi bạn chạy thẳng file, nhưng nó <strong>KHÔNG</strong> đi theo liên kết tượng trưng (symlink) — mà cài một script dưới dạng liên kết trong <code>~/bin</code> lại là chuyện thường. Đã thử với file thật ở <code>~/app/where.sh</code> và một liên kết <code>~/bin/where</code>:</p>
<pre><code>readonly SCRIPT_DIR=\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" &amp;&amp; pwd)
readonly THAT_DIR=\$(dirname "\$(readlink -f "\${BASH_SOURCE[0]}")")</code></pre>
<div class="out">$ ~/app/where.sh
cd+pwd:       /home/an/app
readlink -f:  /home/an/app
$ ~/bin/where
cd+pwd:       /home/an/bin
readlink -f:  /home/an/app</div>
<p>Gọi qua liên kết thì dạng đầu trả lời <code>~/bin</code>, nên một script sau đó đọc <code>\$SCRIPT_DIR/.env</code> sẽ tìm nhầm thư mục. <code>readlink -f</code> giải hết mọi tầng liên kết tới file thật. Nó có trong GNU coreutils và — từ macOS 12.3 — có cả trên Mac (đã thử trên macOS 27: <code>readlink -f /tmp</code> in <code>/private/tmp</code>). Mac đời cũ hơn thì thiếu; <code>realpath</code> là lựa chọn thay thế thường dùng.</p>

<h3>Chạy thử từng bước</h3>
<p>Năm thí nghiệm nhỏ trong thư mục sân tập của khoá. Hãy tự gõ; đoán output trước khi nhấn Enter.</p>
<pre><code>mkdir -p ~/thu-linux/ch7 &amp;&amp; cd ~/thu-linux/ch7
printf '#!/bin/sh\\nten=an\\necho "\${ten^^}"\\n' &gt; sai.sh &amp;&amp; chmod +x sai.sh
./sai.sh; echo "mã=\$?"                    <span class="tok-comment"># 1. dash chạy nó</span>
bash sai.sh                                <span class="tok-comment"># 2. bash chạy cùng file đó</span>
printf 'set -e\\nf() { local x=\$(false); echo "vẫn chạy"; }\\nf\\n' &gt; che.sh
bash che.sh                                <span class="tok-comment"># 3. local che mất lỗi</span>
printf 'cd /tmp\\r\\npwd\\r\\n' &gt; crlf.sh &amp;&amp; bash crlf.sh   <span class="tok-comment"># 4. CRLF</span>
sed -i 's/\\r\$//' crlf.sh &amp;&amp; bash crlf.sh                   <span class="tok-comment"># 5. đã sửa</span></code></pre>
<div class="out">./sai.sh: 3: Bad substitution
mã=2
AN
vẫn chạy
crlf.sh: line 1: cd: \$'/tmp\\r': No such file or directory
crlf.sh: line 2: \$'pwd\\r': command not found
/tmp</div>
<p>Đọc kết quả: shebang <code>#!/bin/sh</code> giao file cho <code>dash</code>, thứ không biết <code>\${ten^^}</code>; cùng file đó chạy bằng <code>bash</code> thì in <code>AN</code>. <code>local</code> nuốt mất cái <code>false</code>, nên -e không bao giờ kích hoạt. File CRLF hỏng ở mọi dòng cho tới khi <code>sed</code> xoá <code>\\r</code>. (Container Ubuntu 24.04, người dùng <code>an</code>; trên Mac thì viết <code>sed -i ''</code> thay cho <code>sed -i</code>.)</p>

<h3>Trên macOS và WSL khác gì</h3>
${slide('lx-07', 28, 'Trên Mac: bash 3.2, mktemp và sed kiểu BSD, không có flock')}
<table>
<tr><th>Thứ trong bài</th><th>Ubuntu / WSL2</th><th>macOS 27 (đã thử)</th></tr>
<tr><td><code>/bin/bash --version</code></td><td>5.2.21</td><td><strong>3.2.57</strong> (2007) — Apple không bao giờ đưa bash 4 trở lên vào vì giấy phép GPLv3</td></tr>
<tr><td><code>\${ten^^}</code>, <code>declare -A</code></td><td>chạy được</td><td><code>bad substitution</code>, <code>declare: -A: invalid option</code></td></tr>
<tr><td><code>/bin/sh</code></td><td>dash</td><td>bash 3.2 ở chế độ POSIX</td></tr>
<tr><td><code>readlink -f</code></td><td>có</td><td>có (macOS 12.3 trở đi)</td></tr>
<tr><td><code>sed 's/^# \\?//'</code> (hàm <code>usage</code> của bộ khung)</td><td>bỏ được "# "</td><td>không làm gì — sed BSD không có <code>\\?</code>; <code>sed -E 's/^# ?//'</code> chạy được cả hai nơi</td></tr>
<tr><td><code>sed -i 's/\\r\$//' f</code></td><td>chạy được</td><td>cần hậu tố rỗng: <code>sed -i '' 's/\\r\$//' f</code></td></tr>
</table>
<p>WSL2 là nhân và bộ công cụ Ubuntu thật, nên mọi thứ chạy y như trên VPS — với một cái bẫy: file tạo ở phía Windows của ổ đĩa (<code>/mnt/c/…</code>) bằng trình soạn thảo của Windows chính là nguồn gốc kinh điển của script CRLF. Người dùng Mac muốn bash đời mới thì cài bằng Homebrew; khi đó <code>#!/usr/bin/env bash</code> tự nhặt được bash 5, còn <code>#!/bin/bash</code> thì vẫn ra 3.2.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm SWP391 của bạn có một <code>deploy.sh</code> "hôm qua còn chạy". Một bạn dùng Windows đã sửa nó, và giờ log hiện <code>\$'\\r': command not found</code> rồi tới "Deploy xong ✔". Hãy tập sửa trong <code>~/thu-linux/ch7</code> (hoặc trong một container <code>ubuntu:24.04</code>).</p><ol>
<li>Dựng lại: viết một <code>deploy.sh</code> 4 dòng gồm shebang, <code>set -euo pipefail</code>, <code>cd /srv/ap &amp;&amp; echo pulling</code> và <code>echo "Deploy xong"</code>; đổi nó sang CRLF bằng <code>sed -i 's/\$/\\r/' deploy.sh</code>.</li>
<li>Chạy <code>bash deploy.sh</code> và <code>file deploy.sh</code>; gọi tên hai triệu chứng. Xoá <code>\\r</code> rồi chạy lại.</li>
<li>Giờ script in "Deploy xong" với mã 0 dù <code>cd</code> hỏng. Viết lại dòng 3 để nó dừng ngay tại <code>cd</code> kèm lời nhắn và mã 1.</li>
<li>Đổi shebang thành <code>#!/usr/bin/env bash</code> (nếu đang là <code>/bin/sh</code>), thêm <code>set -Eeuo pipefail</code> và bọc phần thân vào <code>main "\$@"</code>.</li></ol>
<p><strong>Đạt khi:</strong> <code>file deploy.sh</code> không còn nhắc tới CRLF; <code>./deploy.sh; echo \$?</code> in lời nhắn của bạn và số <code>1</code> khi <code>/srv/ap</code> không tồn tại; và <code>bash -n deploy.sh</code> im lặng.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Shebang (dòng #!)</span><span class="v">Dòng đầu tiên <code>#!…</code>; nhân đọc nó để chọn trình thông dịch chạy file.</span></div>
  <div class="kv"><span class="k">Strict mode (chế độ nghiêm ngặt)</span><span class="v">Quy ước <code>set -Eeuo pipefail</code> (+ <code>IFS</code>): dừng khi có lỗi, biến chưa gán và ống bị hỏng.</span></div>
  <div class="kv"><span class="k">errexit <code>-e</code> (thoát khi lỗi)</span><span class="v">Thoát khi một lệnh hỏng — trừ trong điều kiện, danh sách <code>||</code>/<code>&amp;&amp;</code> và phép gán bị che.</span></div>
  <div class="kv"><span class="k">nounset <code>-u</code> (cấm biến chưa đặt)</span><span class="v">Dùng một biến chưa gán là LỖI chứ không phải chuỗi rỗng.</span></div>
  <div class="kv"><span class="k">pipefail (ống hỏng cả ống)</span><span class="v">Trạng thái của một chuỗi ống là khâu hỏng cuối cùng, không chỉ là khâu cuối.</span></div>
  <div class="kv"><span class="k">errtrace <code>-E</code> (lần vết lỗi)</span><span class="v">Cho bẫy ERR nổ được bên trong hàm và phép thay thế lệnh.</span></div>
  <div class="kv"><span class="k">CRLF (xuống dòng kiểu Windows)</span><span class="v">Kết thúc dòng <code>\\r\\n</code>; ký tự <code>\\r</code> thừa làm hỏng mọi dòng của script bash.</span></div>
  <div class="kv"><span class="k">Exit status (mã thoát)</span><span class="v">Con số một lệnh trả về: 0 = thành công, khác 0 = thất bại; <code>\$?</code> giữ mã của lệnh vừa chạy.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mở đầu mọi script bằng <code>#!/usr/bin/env bash</code> và <code>set -Eeuo pipefail</code>; <code>/bin/sh</code> là dash trên Ubuntu và bash 3.2 trên Mac.</li>
<li><code>set -e</code> bỏ qua điều kiện, danh sách <code>||</code>/<code>&amp;&amp;</code>, <code>local</code>/<code>readonly</code>/<code>export</code> đi với <code>\$( )</code>, và cả những hàm được gọi trong <code>if</code>.</li>
<li>Một lệnh <code>cd</code> hỏng giữa chuỗi <code>&amp;&amp;</code> lặng lẽ bỏ qua phần còn lại mà script vẫn thoát 0 — hãy viết <code>cd … || die</code>.</li>
<li><code>\$'\\r': command not found</code> nghĩa là file xuống dòng kiểu CRLF: <code>file</code> để thấy, <code>sed -i 's/\\r\$//'</code> để sửa, <code>.gitattributes</code> để chặn.</li>
<li><code>cd "\$(dirname …)" &amp;&amp; pwd</code> không đi theo liên kết tượng trưng; <code>readlink -f</code> thì có.</li>
<li>Đặt phần thân vào <code>main "\$@"</code> và đưa thông báo chẩn đoán ra stderr, để script hoặc làm xong, hoặc dừng kèm lời nhắn và mã khác 0.</li>
</ul>

<a class="link-card" href="http://redsymbol.net/articles/unofficial-bash-strict-mode/" target="_blank" rel="noopener">
  <span class="lc-ico">🛡️</span>
  <span class="lc-body"><span class="lc-title">Unofficial Bash Strict Mode</span><span class="lc-sub">Bài viết đã phổ biến hoá <code>set -euo pipefail</code> cộng với <code>IFS</code>, kèm phân tích rõ những kiểu hỏng của từng cờ. Tài liệu tham chiếu chuẩn mực.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/105" target="_blank" rel="noopener">
  <span class="lc-ico">⚠️</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 105 — "Vì sao set -e không làm cái tôi mong đợi?"</span><span class="lc-sub">Lập luận phản biện, liệt kê chi tiết mọi ngoại lệ. Hãy đọc cả bài này lẫn bài trên; sự thật là chế độ nghiêm ngặt vừa hữu ích <em>VỪA</em> có những cạnh sắc.</span></span>
</a>
<a class="link-card" href="https://google.github.io/styleguide/shellguide.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Google Shell Style Guide</span><span class="lc-sub">Khi nào nên dùng bash, quy ước <code>main "\$@"</code>, cách đặt tên, và khi nào một script đã vượt quá tầm của shell. Có quan điểm rõ và lập luận tốt.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: gia cố một script mong manh</span><span class="lc-sub">Bạn được đưa một script đang chạy được, không có chế độ nghiêm ngặt và mang ba lỗi tiềm ẩn. Hãy thêm bộ khung vào, rồi nhìn từng lỗi hiện ra thành một thông báo rõ ràng.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> thêm <code>set -e</code> vào một script đang có rồi cho rằng nó đã an toàn. Nó đổi hành vi một cách hồi tố — đoạn mã vốn dựa vào việc chạy tiếp qua một lệnh <code>grep</code> hỏng giờ sẽ làm script chết, còn đoạn mã <em>ĐÁNG LẼ</em> phải chết thì vẫn không chết, vì ba ngoại lệ ở trên. Hãy thêm chế độ nghiêm ngặt vào một script <strong>MỚI</strong> ngay từ dòng đầu. Khi lắp ngược vào một script cũ, hãy chạy nó từ đầu tới cuối rồi ĐỌC output: kết cục thường gặp là một script giờ thoát ra trong im lặng ở lệnh <code>grep</code> đầu tiên không tìm thấy gì, và đó là một thay đổi hành vi mà không ai nhận ra cho tới khi công việc chạy đêm ngừng làm nửa phần việc của nó.</div>
<p class="note-ct"><strong>Hãy chép bộ khung ở trên và bắt đầu mọi script từ nó.</strong> Sáu dòng khuôn mẫu biến "chạy được lúc tôi thử" thành "hỏng một cách ồn ào và nói rõ vì sao". Thói quen giá trị nhất của chương này là: một script phải hoặc làm trọn phần việc của nó, hoặc dừng lại kèm một thông điệp trên stderr và một mã thoát khác 0 — không bao giờ làm nửa việc rồi báo cáo thành công.</p>
</div>
`,
    },
    /* ─────────────────────────── 7.2 ─────────────────────────── */
    {
      title: '7.2 — Arguments, options and validation|||7.2 — Tham số, tuỳ chọn và kiểm tính hợp lệ',
      slug: 'lnx-7-2-tham-so-kiem-tra',
      type: 'LESSON',
      description: 'Tham số vị trí, getopts cho cờ ngắn, vòng lặp while/case cho cờ dài, dấu --, một hàm usage tự sinh, và những chốt chặn kiểm điều kiện tiên quyết trước khi làm bất cứ việc gì.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Arguments and validation</h2>
<p class="lead">A script that does the wrong thing because it was called wrongly is worse than one that refuses to start. This lesson is about the front door: parsing what the caller asked for, checking it is possible, and failing with a message that tells them how to fix it — all before touching anything.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Parse</span><span class="lz-t">getopts, or a while/case loop</span><span class="lz-d">Turn the raw argument list into named variables. Nothing is checked yet, and nothing has happened.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Validate values</span><span class="lz-t">is it in the allowed set? a number? a safe path?</span><span class="lz-d">Reject bad input with a message naming the option. Still nothing has happened.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Check preconditions</span><span class="lz-t">tools installed, files readable, daemon up, disk free</span><span class="lz-d">Everything the work will need, checked in one place. Failing here leaves the system untouched.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Do the work</span><span class="lz-t">only now, and ideally through a run() wrapper</span><span class="lz-d">By this point the script either completes or fails on something genuinely unforeseeable.</span></div>
</div>
<h3>Positional arguments</h3>
${slide('lx-07', 9, '"$@" giữ nguyên từng tham số — $@ trần chẻ tên có dấu cách')}
<pre><code>#!/usr/bin/env bash
set -euo pipefail

echo "script:    \$0"
echo "first:     \$1"
echo "count:     \$#"
echo "all:       \$*"
for a in "\$@"; do echo "  arg: [\$a]"; done

shift                       <span class="tok-comment"># drop \$1; \$2 becomes \$1, \$# decreases</span>
echo "after shift: \$1"</code></pre>
<div class="out">script:    ./demo.sh
first:     staging
count:     2
all:       staging --dry-run
  arg: [staging]
  arg: [--dry-run]
after shift: --dry-run</div>
<div class="callout"><code>shift</code> is how you consume arguments one at a time: read <code>\$1</code>, act on it, <code>shift</code>, repeat until <code>\$#</code> is zero. It is the basis of every option-parsing loop below, and it is also how you separate "the options" from "everything after them".</div>

<h3>getopts: short flags, POSIX, built in</h3>
${slide('lx-07', 10, 'getopts ":vo:fh": mỗi ký tự trong chuỗi là một luật')}
<pre><code>#!/usr/bin/env bash
set -euo pipefail

verbose=0
output=""
force=0

while getopts ":vo:fh" opt; do
  case \$opt in
    v) verbose=1 ;;
    o) output=\$OPTARG ;;             <span class="tok-comment"># the colon after o means "takes a value"</span>
    f) force=1 ;;
    h) usage; exit 0 ;;
    \\?) echo "unknown option: -\$OPTARG" &gt;&amp;2; exit 2 ;;
    :)  echo "option -\$OPTARG needs a value" &gt;&amp;2; exit 2 ;;
  esac
done
shift \$((OPTIND - 1))                <span class="tok-comment"># drop everything getopts consumed</span>

echo "verbose=\$verbose output=\${output:-none} force=\$force"
echo "remaining: \$*"</code></pre>
<div class="out">$ ./demo.sh -v -o result.txt file1 file2
verbose=1 output=result.txt force=0
remaining: file1 file2
$ ./demo.sh -z
unknown option: -z</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Leading <code>:</code> in the spec</span><span class="v"><code>":vo:fh"</code> — turns on <strong>silent error handling</strong>, so you write the error messages instead of getopts printing its own. Always use it.</span></div>
  <div class="kv"><span class="k"><code>o:</code></span><span class="v">A colon <em>after</em> a letter means that option takes a value, delivered in <code>\$OPTARG</code>.</span></div>
  <div class="kv"><span class="k"><code>shift \$((OPTIND - 1))</code></span><span class="v">Mandatory. <code>OPTIND</code> is where getopts stopped; without the shift, the positional arguments still include the flags.</span></div>
  <div class="kv"><span class="k">Bundling</span><span class="v">Free: <code>-vf</code> is the same as <code>-v -f</code>, exactly like standard Unix tools.</span></div>
</div>
<div class="callout warn"><code>getopts</code> handles <strong>short options only</strong>. There is no <code>--verbose</code>, and no way to add one. That is the reason for the manual loop below. Do not confuse it with <code>getopt</code> (no s) — a separate external program with a different interface and real portability problems; the built-in <code>getopts</code> is the one to use.</div>

<h3>Long options: a while/case loop</h3>
${slide('lx-07', 11, 'Cờ dài: vòng while/case + shift, và -- để kết thúc cờ')}
<pre><code>dry_run=0
env=""
tag="latest"

while [[ \$# -gt 0 ]]; do
  case \$1 in
    -h|--help)     usage; exit 0 ;;
    -n|--dry-run)  dry_run=1; shift ;;
    -t|--tag)      tag=\${2:?--tag needs a value}; shift 2 ;;
    --tag=*)       tag=\${1#*=}; shift ;;          <span class="tok-comment"># --tag=v1.2 form</span>
    --)            shift; break ;;                <span class="tok-comment"># end of options</span>
    -*)            echo "unknown option: \$1" &gt;&amp;2; exit 2 ;;
    *)             env=\$1; shift ;;
  esac
done

echo "env=\${env:?environment is required} tag=\$tag dry_run=\$dry_run"
echo "extra args: \$*"</code></pre>
<div class="out">$ ./deploy.sh --tag v1.4 --dry-run production
env=production tag=v1.4 dry_run=1
extra args:
$ ./deploy.sh --tag
./deploy.sh: line 9: 2: --tag needs a value</div>
<div class="callout ok">Note <code>tag=\${2:?--tag needs a value}</code>: the parameter expansion from Lesson 6.3 doing the validation inline. If <code>\$2</code> is missing, the script aborts with that message and a nonzero status — no <code>if</code>, no extra line, and the error names the option rather than the variable.</div>
<p>The <code>--</code> case matters more than it looks. It marks the end of options, so everything after it is a positional argument even if it starts with a dash — which is how you pass a filename literally called <code>-rf</code> (Lesson 2.2). Supporting it costs one line and is what every standard tool does.</p>

<h3>A usage function that cannot go stale</h3>
<pre><code>usage() {
  cat &lt;&lt;EOF
\${SCRIPT_NAME} — build and deploy the application

Usage:
  \${SCRIPT_NAME} [options] &lt;staging|production&gt;

Options:
  -t, --tag TAG    image tag to deploy (default: latest)
  -n, --dry-run    print what would happen, change nothing
  -h, --help       show this help

Examples:
  \${SCRIPT_NAME} staging
  \${SCRIPT_NAME} --tag v1.4 --dry-run production
EOF
}</code></pre>
<p>A quoted-delimiter heredoc (Lesson 3.1) would print <code>\${SCRIPT_NAME}</code> literally; leaving the delimiter unquoted lets the variable expand, so the help text always shows the name the script was actually invoked as. Include at least one example — it is the part people read.</p>

<h3>Preconditions: check everything before doing anything</h3>
${slide('lx-07', 12, 'Bốn cửa: phân tích → kiểm giá trị → tiền kiểm → mới làm')}
<pre><code>require_cmd() {
  command -v "\$1" &gt;/dev/null || die "\$1 is required but not installed"
}

preflight() {
  require_cmd docker
  require_cmd git
  require_cmd jq

  [[ -f "\$SCRIPT_DIR/.env.\$env" ]] || die "missing .env.\$env"
  [[ -r "\$SCRIPT_DIR/.env.\$env" ]] || die "cannot read .env.\$env"

  [[ -z \$(git status --porcelain) ]] || die "working tree is dirty"

  docker info &gt;/dev/null 2&gt;&amp;1 || die "docker daemon is not running"

  local free_gb
  free_gb=\$(df --output=avail -BG /var/lib/docker | tail -1 | tr -dc '0-9')
  (( free_gb &gt;= 5 )) || die "need 5GB free, have \${free_gb}GB"
}</code></pre>
<div class="out">$ ./deploy.sh production
[14:31:02] ERROR: docker daemon is not running</div>
<div class="callout"><strong>Check everything up front, in one place.</strong> A script that validates as it goes can fail on step seven of nine, leaving the system half-changed — the image built, the database migrated, the load balancer not switched. A script that validates first either does the whole job or does nothing at all, and "does nothing at all" is a state you can recover from without thinking.</div>
<p>Note <code>command -v</code> rather than <code>which</code>: it is a shell builtin, works everywhere, and correctly reports builtins and functions as well as files on <code>PATH</code>. <code>which</code> is an external program that does not exist on every system and has inconsistent exit codes.</p>

<h3>Validating the values themselves</h3>
<pre><code><span class="tok-comment"># Enumeration — a case is clearer than a chain of comparisons</span>
case \$env in
  staging|production) ;;
  *) die "environment must be staging or production, got: \$env" ;;
esac

<span class="tok-comment"># Numeric</span>
[[ \$port =~ ^[0-9]+\$ ]] || die "port must be a number: \$port"
(( port &gt; 0 &amp;&amp; port &lt; 65536 )) || die "port out of range: \$port"

<span class="tok-comment"># Format, with a regex (Lesson 6.4)</span>
[[ \$tag =~ ^v[0-9]+\\.[0-9]+\\.[0-9]+\$ ]] || die "tag must look like v1.2.3"

<span class="tok-comment"># Path safety — refuse anything that escapes the base directory</span>
case \$target in
  *..*) die "path may not contain ..: \$target" ;;
esac</code></pre>
<div class="callout warn">That last check is not paranoia. A script that takes a path from an argument, an environment variable or a webhook payload and interpolates it into <code>rm -rf "\$base/\$target"</code> will happily delete <code>/</code> when <code>target</code> is <code>../../..</code>. Validate anything that reaches a destructive command, and prefer building paths with <code>realpath -e</code> so you can compare the resolved result against the base directory.</div>

<h3>A dry-run mode worth having</h3>
${slide('lx-07', 13, 'run() + --dry-run: in ra đúng thứ SẼ chạy')}
<pre><code>run() {
  if (( dry_run )); then
    printf '[dry-run] %s\\n' "\$*" &gt;&amp;2
  else
    "\$@"
  fi
}

run docker build -t "myapp:\$tag" .
run docker push "myapp:\$tag"
run ssh "\$host" "docker pull myapp:\$tag &amp;&amp; docker compose up -d"</code></pre>
<div class="out">$ ./deploy.sh --dry-run --tag v1.4 production
[dry-run] docker build -t myapp:v1.4 .
[dry-run] docker push myapp:v1.4
[dry-run] ssh vps docker pull myapp:v1.4 &amp;&amp; docker compose up -d</div>
<p>One four-line function, and every destructive step in the script becomes inspectable. Because <code>run</code> uses <code>"\$@"</code> (Lesson 6.2), arguments containing spaces survive intact — a version built by string concatenation would corrupt them and, worse, would print something different from what it runs.</p>
<div class="callout ok">A dry-run mode pays for itself the first time you point a deploy script at production. It is also the cheapest way to review a script someone else wrote: run it with <code>--dry-run</code> and read the list of commands it <em>would</em> execute, which is far more reliable than reading the code and imagining.</div>

<h3>Special parameters, and why <code>"\$@"</code> — measured</h3>
<p>The lesson used <code>\$1</code>, <code>\$#</code> and <code>"\$@"</code> without a full list. Here it is, followed by the one experiment that explains why every script in this course writes <code>"\$@"</code> with quotes. The script <code>pos.sh</code> prints each form in brackets, one bracket per argument it received:</p>
<table>
<tr><th>Parameter</th><th>Meaning</th><th>Example value</th></tr>
<tr><td><code>\$0</code></td><td>the script's name, as it was called</td><td><code>./pos.sh</code></td></tr>
<tr><td><code>\$1</code> … <code>\$9</code>, <code>\${10}</code></td><td>the n-th argument (braces from 10 on)</td><td><code>staging</code></td></tr>
<tr><td><code>\$#</code></td><td>how many arguments</td><td><code>3</code></td></tr>
<tr><td><code>"\$@"</code></td><td>every argument, each kept as ONE word</td><td>the one to use</td></tr>
<tr><td><code>"\$*"</code></td><td>all arguments glued into one string (joined by the first character of <code>IFS</code>)</td><td>for messages only</td></tr>
<tr><td><code>\$?</code> · <code>\$\$</code> · <code>\$!</code></td><td>last exit status · this script's PID · PID of the last background job</td><td><code>0</code> · <code>4012</code> · <code>4020</code></td></tr>
</table>
<pre><code>./pos.sh staging "bao cao.txt" x</code></pre>
<div class="out">\$0=./pos.sh  \$#=3  \$1=staging  \$2=bao cao.txt
"\$@" → [staging] [bao cao.txt] [x]
"\$*" → [staging bao cao.txt x]
 \$@  → [staging] [bao] [cao.txt] [x]
sau shift: \$1=bao cao.txt \$#=2</div>
<p>Unquoted <code>\$@</code> turned three arguments into four, because the file name with a space was split — the same bug as an unquoted variable (Lesson 6.2). <code>"\$*"</code> is one string, useful for a log line and wrong for passing arguments on. And the joining character of <code>"\$*"</code> is not always a space: with the strict <code>IFS=\$'\\n\\t'</code> from Lesson 7.1 it is a <em>newline</em> — the cause of a real bug found in Lesson 7.5.</p>

<h3>getopts, one detail at a time</h3>
<table>
<tr><th>Piece</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>getopts SPEC NAME</code></td><td>reads ONE option per call, puts its letter in <code>NAME</code>; returns non-zero when options run out (ends the <code>while</code>)</td><td><code>while getopts ":vo:" opt</code></td></tr>
<tr><td>letter</td><td>a flag with no value</td><td><code>v</code> → <code>-v</code></td></tr>
<tr><td>letter + <code>:</code></td><td>takes a value, delivered in <code>\$OPTARG</code></td><td><code>o:</code> → <code>-o kq.txt</code> or <code>-okq.txt</code></td></tr>
<tr><td><code>:</code> at the very start</td><td>silent mode: unknown flag gives <code>opt=?</code>, missing value gives <code>opt=:</code>, letter in <code>OPTARG</code></td><td><code>":vo:fh"</code></td></tr>
<tr><td><code>\$OPTIND</code></td><td>index of the next argument to read; starts at 1</td><td><code>shift \$((OPTIND - 1))</code></td></tr>
</table>
<pre><code>./go.sh -vf -o kq.txt a.log b.log     <span class="tok-comment"># bundled flags + a value</span>
./go.sh a.log -v                      <span class="tok-comment"># a flag AFTER a file name</span></code></pre>
<div class="out">OPTIND=4
verbose=1 output=kq.txt force=1
còn lại (2): a.log b.log
OPTIND=1
verbose=0 output=không force=0
còn lại (2): a.log -v</div>
<p>The second run surprises people: <code>getopts</code> stops at the <strong>first argument that is not an option</strong>, exactly like POSIX tools, so <code>-v</code> after <code>a.log</code> is treated as a file name. Put options first, or use the <code>while/case</code> loop which accepts them anywhere. <code>getopts</code> is a bash builtin, so it behaves identically on Ubuntu, WSL and the Mac's bash 3.2. The external <code>getopt</code> (no s) is not: GNU <code>getopt</code> from util-linux supports long options, while the Mac's BSD <code>getopt --version</code> simply prints <code> --</code>. Chapter 13 builds a full long-option parser; this chapter stays with the two forms above.</p>

<h3>Exit codes: pick them on purpose</h3>
<p>Callers — cron, CI, another script, a <code>bats</code> test — see only the number. A small convention makes it meaningful:</p>
<table>
<tr><th>Code</th><th>Meaning</th><th>Who produces it</th></tr>
<tr><td><code>0</code></td><td>success — or "nothing to do" (another copy already running)</td><td>you</td></tr>
<tr><td><code>1</code></td><td>the work failed</td><td><code>die</code></td></tr>
<tr><td><code>2</code></td><td>called wrongly: bad option, missing argument</td><td>your parser (same as bash's own builtins)</td></tr>
<tr><td><code>126</code></td><td>file found but not executable ("Permission denied")</td><td>bash</td></tr>
<tr><td><code>127</code></td><td>command not found</td><td>bash</td></tr>
<tr><td><code>130</code> · <code>143</code></td><td>killed by Ctrl-C (128+2) · by SIGTERM (128+15)</td><td>the kernel, via bash</td></tr>
</table>
<p>Tested: running a script copied into a folder without <code>chmod +x</code> printed <code>Permission denied</code> and exit 126; the <code>--force</code> typo above exited 2. Keep 2 for "you called me wrong" and 1 for "I tried and failed", and a CI log becomes readable at a glance.</p>

<h3>Run it step by step</h3>
<p>Save this 14-line version of the long-option loop as <code>~/thu-linux/ch7/dai.sh</code> and <code>chmod +x</code> it (the messages are in Vietnamese exactly as in the recorded run):</p>
<pre><code>#!/usr/bin/env bash
set -euo pipefail
dry_run=0; env=""; tag="latest"
while [[ \$# -gt 0 ]]; do
  case \$1 in
    -n|--dry-run)  dry_run=1; shift ;;
    -t|--tag)      tag=\${2:?--tag cần giá trị}; shift 2 ;;
    --tag=*)       tag=\${1#*=}; shift ;;
    --)            shift; break ;;
    -*)            echo "cờ lạ: \$1" &gt;&amp;2; exit 2 ;;
    *)             env=\$1; shift ;;
  esac
done
echo "env=\${env:?thiếu môi trường} tag=\$tag dry_run=\$dry_run còn: \$*"</code></pre>
<p>Then run these five calls in order, predicting each line first:</p>
<pre><code>./dai.sh --tag=v1.4 -n production
./dai.sh -t v2 staging -- -rf
./dai.sh --tag
./dai.sh --tag v1
./dai.sh --force x; echo "exit=\$?"</code></pre>
<div class="out">env=production tag=v1.4 dry_run=1 còn:
env=staging tag=v2 dry_run=0 còn: -rf
./dai.sh: line 7: 2: --tag cần giá trị
./dai.sh: line 14: env: thiếu môi trường
cờ lạ: --force
exit=2</div>
<p>Reading it: both <code>--tag=v1.4</code> and <code>-t v2</code> work; everything after <code>--</code> stays an argument even though <code>-rf</code> looks like a flag; <code>\${2:?…}</code> and <code>\${env:?…}</code> produce the error messages with no <code>if</code> at all (the <code>2:</code> and <code>env:</code> prefixes are the variable names, which is why the message itself should name the option); and the unknown flag exits 2.</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Thing in this lesson</th><th>Ubuntu / WSL2</th><th>macOS</th></tr>
<tr><td><code>getopts</code>, <code>shift</code>, <code>"\$@"</code>, <code>\${2:?}</code></td><td>bash builtins</td><td>identical (bash 3.2 and zsh both have them)</td></tr>
<tr><td><code>getopt</code> (external)</td><td>GNU util-linux: long options</td><td>BSD: no long options — avoid it</td></tr>
<tr><td><code>df --output=avail -BG</code> (preflight)</td><td>works</td><td><code>df: unrecognized option &#96;--output=avail'</code> — use <code>df -g /</code> and <code>awk</code></td></tr>
<tr><td><code>[[ \$x =~ ^[0-9]+\$ ]]</code></td><td>works</td><td>works in bash 3.2</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the group's <code>backup.sh</code> takes its settings from positional arguments nobody remembers the order of. Give it a proper front door in <code>~/thu-linux/ch7/backup-args.sh</code>.</p><ol>
<li>Accept <code>-n/--dry-run</code>, <code>-k/--keep N</code> (default 7), <code>--keep=N</code>, <code>-h/--help</code>, <code>--</code>, and exactly one positional argument: the source folder.</li>
<li>Validate: <code>N</code> must match <code>^[0-9]+\$</code> and be between 1 and 90; the folder must exist and be readable; unknown options exit 2 with the option named.</li>
<li>Preflight: <code>command -v tar</code>; refuse to run if the source folder is <code>/</code>.</li>
<li>Wrap the (fake) work in a <code>run()</code> function and print <code>[dry-run] tar -czf …</code> in dry-run mode.</li></ol>
<p><strong>Done when:</strong> <code>./backup-args.sh --keep abc x; echo \$?</code> prints a message naming <code>--keep</code> and <code>2</code>; <code>./backup-args.sh -n -k 3 ~/thu-linux</code> prints one <code>[dry-run]</code> line and creates nothing; and <code>--help</code> shows at least one example.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Positional argument</span><span class="v">A value passed by position: <code>\$1</code>, <code>\$2</code>…; <code>\$#</code> counts them.</span></div>
  <div class="kv"><span class="k"><code>"\$@"</code></span><span class="v">All arguments, each kept as one word — the safe way to pass them on.</span></div>
  <div class="kv"><span class="k"><code>shift</code></span><span class="v">Drops <code>\$1</code> and moves the rest down one place.</span></div>
  <div class="kv"><span class="k"><code>getopts</code></span><span class="v">bash builtin that parses short options one per call; <code>OPTARG</code> holds a value, <code>OPTIND</code> the position.</span></div>
  <div class="kv"><span class="k">Long option</span><span class="v">A <code>--word</code> flag; parsed by hand with <code>while/case</code> in bash.</span></div>
  <div class="kv"><span class="k">End of options <code>--</code></span><span class="v">Everything after it is an argument, even if it starts with a dash.</span></div>
  <div class="kv"><span class="k">Precondition / preflight</span><span class="v">A check that everything the work needs exists, done before touching anything.</span></div>
  <div class="kv"><span class="k">Dry run</span><span class="v">A mode that prints the commands it would run without running them.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Always pass arguments on as <code>"\$@"</code>; unquoted <code>\$@</code> splits names with spaces and <code>"\$*"</code> glues them together.</li>
<li><code>getopts ":vo:fh"</code>: leading colon = you print the errors, <code>o:</code> = takes a value; always <code>shift \$((OPTIND - 1))</code> afterwards.</li>
<li><code>getopts</code> stops at the first non-option and knows only short flags; a <code>while/case</code> loop handles <code>--long</code>, <code>--x=v</code> and <code>--</code>.</li>
<li>Parse → validate values → check preconditions → only then work; failing in the first three leaves the system untouched.</li>
<li>Exit 2 for "called wrongly", 1 for "failed", 0 for success or "nothing to do".</li>
<li>A <code>run()</code> wrapper with <code>"\$@"</code> gives you a <code>--dry-run</code> that prints exactly what would execute.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Bourne-Shell-Builtins.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — getopts and shift</span><span class="lc-sub">The exact semantics of <code>OPTIND</code>, <code>OPTARG</code> and silent error mode. Short, and it removes the guesswork.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/035" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 035 — "How can I handle command-line options?"</span><span class="lc-sub">Compares getopts, the manual while/case loop and external getopt, with a complete working example of each.</span></span>
</a>
<a class="link-card" href="https://clig.dev/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Command Line Interface Guidelines</span><span class="lc-sub">What users expect from a CLI: <code>--help</code>, exit codes, stderr versus stdout, <code>--dry-run</code>, colour. Language-agnostic and genuinely worth reading once.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: build the front door</span><span class="lc-sub">Graded tasks: parse short and long options, support <code>--</code>, validate an enum and a port number, and add a working <code>--dry-run</code>.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> forgetting <code>shift \$((OPTIND - 1))</code> after a <code>getopts</code> loop. Everything appears to work — the flags are parsed correctly — but <code>"\$@"</code> still contains them, so the loop over "files" also iterates over <code>-v</code> and <code>-o</code>. The script then tries to open a file called <code>-v</code>, and the error message points at the file-handling code rather than at the missing shift. Whenever a script says "no such file: -v", this is why.</div>
<p class="note-ct"><strong>The structure that makes scripts safe to run:</strong> parse arguments, then validate every value, then check every precondition, and only then start doing work. Each of those stages exits with a distinct message on stderr and a nonzero code. A script built this way can be run by someone who has never read it, because it tells them what it needs instead of failing halfway through and leaving them to guess.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Tham số và kiểm tính hợp lệ</h2>
<p class="lead">Một script làm sai việc vì bị gọi sai cách thì tệ hơn một script từ chối khởi động. Bài này nói về cái cửa trước: phân tích xem người gọi muốn gì, kiểm xem điều đó có khả thi không, và hỏng kèm một thông điệp chỉ cho họ cách sửa — tất cả TRƯỚC KHI đụng vào bất cứ thứ gì.</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Phân tích</span><span class="lz-t">getopts, hoặc một vòng while/case</span><span class="lz-d">Biến danh sách tham số thô thành những biến có tên. Chưa kiểm gì cả, và chưa có gì xảy ra.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Kiểm giá trị</span><span class="lz-t">có nằm trong tập cho phép không? có phải số không? đường dẫn có an toàn không?</span><span class="lz-d">Từ chối đầu vào hỏng kèm một thông điệp gọi tên cái tuỳ chọn. Vẫn chưa có gì xảy ra.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Kiểm điều kiện tiên quyết</span><span class="lz-t">công cụ đã cài, file đọc được, daemon đang chạy, đĩa còn trống</span><span class="lz-d">Mọi thứ phần việc sẽ cần, kiểm ở một chỗ. Hỏng ở đây thì hệ thống còn nguyên vẹn.</span></div>
  <div class="lz-step"><span class="lz-k">4 · Làm việc</span><span class="lz-t">tới lúc này mới làm, và tốt nhất là thông qua một hàm bọc run()</span><span class="lz-d">Tới điểm này thì script hoặc chạy trọn vẹn, hoặc hỏng vì một thứ thật sự không lường trước được.</span></div>
</div>
<h3>Tham số vị trí</h3>
${slide('lx-07', 9, '"$@" giữ nguyên từng tham số — $@ trần chẻ tên có dấu cách')}
<pre><code>#!/usr/bin/env bash
set -euo pipefail

echo "script:    \$0"
echo "cái đầu:   \$1"
echo "số lượng:  \$#"
echo "tất cả:    \$*"
for a in "\$@"; do echo "  tham số: [\$a]"; done

shift                       <span class="tok-comment"># bỏ \$1; \$2 thành \$1, \$# giảm đi</span>
echo "sau shift: \$1"</code></pre>
<div class="out">script:    ./demo.sh
cái đầu:   staging
số lượng:  2
tất cả:    staging --dry-run
  tham số: [staging]
  tham số: [--dry-run]
sau shift: --dry-run</div>
<div class="callout"><code>shift</code> là cách bạn tiêu thụ tham số từng cái một: đọc <code>\$1</code>, xử lý nó, <code>shift</code>, lặp lại cho tới khi <code>\$#</code> bằng 0. Nó là nền tảng của mọi vòng lặp phân tích tuỳ chọn bên dưới, và cũng là cách bạn tách "phần tuỳ chọn" khỏi "mọi thứ đứng sau chúng".</div>

<h3>getopts: cờ ngắn, chuẩn POSIX, dựng sẵn</h3>
${slide('lx-07', 10, 'getopts ":vo:fh": mỗi ký tự trong chuỗi là một luật')}
<pre><code>#!/usr/bin/env bash
set -euo pipefail

verbose=0
output=""
force=0

while getopts ":vo:fh" opt; do
  case \$opt in
    v) verbose=1 ;;
    o) output=\$OPTARG ;;             <span class="tok-comment"># dấu hai chấm sau o nghĩa là "có nhận giá trị"</span>
    f) force=1 ;;
    h) usage; exit 0 ;;
    \\?) echo "tuỳ chọn không rõ: -\$OPTARG" &gt;&amp;2; exit 2 ;;
    :)  echo "tuỳ chọn -\$OPTARG cần một giá trị" &gt;&amp;2; exit 2 ;;
  esac
done
shift \$((OPTIND - 1))                <span class="tok-comment"># bỏ đi mọi thứ getopts đã tiêu thụ</span>

echo "verbose=\$verbose output=\${output:-không có} force=\$force"
echo "còn lại: \$*"</code></pre>
<div class="out">$ ./demo.sh -v -o result.txt file1 file2
verbose=1 output=result.txt force=0
còn lại: file1 file2
$ ./demo.sh -z
tuỳ chọn không rõ: -z</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Dấu <code>:</code> đứng đầu chuỗi mô tả</span><span class="v"><code>":vo:fh"</code> — bật <strong>chế độ xử lý lỗi im lặng</strong>, để BẠN viết thông báo lỗi thay vì getopts tự in ra kiểu của nó. Luôn dùng nó.</span></div>
  <div class="kv"><span class="k"><code>o:</code></span><span class="v">Dấu hai chấm đứng <em>SAU</em> một chữ cái nghĩa là tuỳ chọn đó nhận một giá trị, và giá trị đó nằm trong <code>\$OPTARG</code>.</span></div>
  <div class="kv"><span class="k"><code>shift \$((OPTIND - 1))</code></span><span class="v">BẮT BUỘC. <code>OPTIND</code> là chỗ getopts đã dừng lại; thiếu lệnh shift thì các tham số vị trí vẫn còn chứa cả đám cờ.</span></div>
  <div class="kv"><span class="k">Gộp cờ</span><span class="v">Miễn phí: <code>-vf</code> giống hệt <code>-v -f</code>, đúng như các công cụ Unix chuẩn.</span></div>
</div>
<div class="callout warn"><code>getopts</code> chỉ xử lý được <strong>CỜ NGẮN</strong>. Không có <code>--verbose</code>, và không có cách nào thêm vào. Đó chính là lý do có cái vòng lặp thủ công bên dưới. Đừng nhầm nó với <code>getopt</code> (không có chữ s) — một chương trình ngoài riêng biệt với giao diện khác và những vấn đề khả chuyển có thật; cái dựng sẵn <code>getopts</code> mới là thứ nên dùng.</div>

<h3>Tuỳ chọn dài: một vòng lặp while/case</h3>
${slide('lx-07', 11, 'Cờ dài: vòng while/case + shift, và -- để kết thúc cờ')}
<pre><code>dry_run=0
env=""
tag="latest"

while [[ \$# -gt 0 ]]; do
  case \$1 in
    -h|--help)     usage; exit 0 ;;
    -n|--dry-run)  dry_run=1; shift ;;
    -t|--tag)      tag=\${2:?--tag cần một giá trị}; shift 2 ;;
    --tag=*)       tag=\${1#*=}; shift ;;          <span class="tok-comment"># dạng --tag=v1.2</span>
    --)            shift; break ;;                <span class="tok-comment"># kết thúc phần tuỳ chọn</span>
    -*)            echo "tuỳ chọn không rõ: \$1" &gt;&amp;2; exit 2 ;;
    *)             env=\$1; shift ;;
  esac
done

echo "env=\${env:?bắt buộc phải có môi trường} tag=\$tag dry_run=\$dry_run"
echo "tham số thừa: \$*"</code></pre>
<div class="out">$ ./deploy.sh --tag v1.4 --dry-run production
env=production tag=v1.4 dry_run=1
tham số thừa:
$ ./deploy.sh --tag
./deploy.sh: line 9: 2: --tag cần một giá trị</div>
<div class="callout ok">Để ý <code>tag=\${2:?--tag cần một giá trị}</code>: chính phép khai triển tham số ở Bài 6.3 đang làm việc kiểm tra ngay tại chỗ. Nếu <code>\$2</code> thiếu, script dừng lại với đúng thông điệp đó và một trạng thái khác 0 — không cần <code>if</code>, không thêm dòng nào, và thông báo lỗi gọi tên CÁI TUỲ CHỌN chứ không phải cái biến.</div>
<p>Nhánh <code>--</code> quan trọng hơn vẻ ngoài của nó. Nó đánh dấu chỗ kết thúc phần tuỳ chọn, nên mọi thứ sau nó là tham số vị trí kể cả khi bắt đầu bằng dấu gạch ngang — và đó là cách bạn truyền vào một tên file đúng nghĩa đen là <code>-rf</code> (Bài 2.2). Hỗ trợ nó tốn một dòng, và đó là điều mọi công cụ chuẩn đều làm.</p>

<h3>Một hàm usage không thể lỗi thời</h3>
<pre><code>usage() {
  cat &lt;&lt;EOF
\${SCRIPT_NAME} — dựng và triển khai ứng dụng

Cách dùng:
  \${SCRIPT_NAME} [tuỳ chọn] &lt;staging|production&gt;

Tuỳ chọn:
  -t, --tag TAG    tag ảnh cần deploy (mặc định: latest)
  -n, --dry-run    in ra những gì SẼ xảy ra, không đổi gì cả
  -h, --help       hiện phần trợ giúp này

Ví dụ:
  \${SCRIPT_NAME} staging
  \${SCRIPT_NAME} --tag v1.4 --dry-run production
EOF
}</code></pre>
<p>Một heredoc có dấu kết thúc đặt trong nháy (Bài 3.1) sẽ in ra nguyên chữ <code>\${SCRIPT_NAME}</code>; để dấu kết thúc không nháy thì biến được khai triển, nên phần trợ giúp luôn hiện đúng cái tên mà script THẬT SỰ được gọi bằng. Hãy kèm ít nhất một ví dụ — đó mới là phần người ta đọc.</p>

<h3>Điều kiện tiên quyết: kiểm hết trước khi làm bất cứ gì</h3>
${slide('lx-07', 12, 'Bốn cửa: phân tích → kiểm giá trị → tiền kiểm → mới làm')}
<pre><code>require_cmd() {
  command -v "\$1" &gt;/dev/null || die "cần có \$1 nhưng chưa được cài"
}

preflight() {
  require_cmd docker
  require_cmd git
  require_cmd jq

  [[ -f "\$SCRIPT_DIR/.env.\$env" ]] || die "thiếu .env.\$env"
  [[ -r "\$SCRIPT_DIR/.env.\$env" ]] || die "không đọc được .env.\$env"

  [[ -z \$(git status --porcelain) ]] || die "cây làm việc còn thay đổi chưa commit"

  docker info &gt;/dev/null 2&gt;&amp;1 || die "daemon docker không chạy"

  local free_gb
  free_gb=\$(df --output=avail -BG /var/lib/docker | tail -1 | tr -dc '0-9')
  (( free_gb &gt;= 5 )) || die "cần 5GB trống, đang có \${free_gb}GB"
}</code></pre>
<div class="out">$ ./deploy.sh production
[14:31:02] ERROR: daemon docker không chạy</div>
<div class="callout"><strong>Kiểm hết ngay từ đầu, ở một chỗ.</strong> Một script vừa chạy vừa kiểm có thể hỏng ở bước bảy trên chín, để lại hệ thống thay đổi dở dang — ảnh đã dựng, cơ sở dữ liệu đã di trú, bộ cân bằng tải thì chưa tráo. Một script kiểm trước thì hoặc làm trọn việc, hoặc không làm gì cả, mà "không làm gì cả" là một trạng thái bạn khôi phục được mà chẳng phải nghĩ.</div>
<p>Để ý <code>command -v</code> chứ không phải <code>which</code>: nó là lệnh dựng sẵn của shell, chạy ở mọi nơi, và báo cáo đúng cả lệnh dựng sẵn lẫn hàm chứ không chỉ file nằm trên <code>PATH</code>. <code>which</code> là một chương trình ngoài, không có trên mọi hệ thống và có mã thoát không nhất quán.</p>

<h3>Kiểm chính các giá trị</h3>
<pre><code><span class="tok-comment"># Liệt kê — một case rõ hơn một chuỗi phép so sánh</span>
case \$env in
  staging|production) ;;
  *) die "môi trường phải là staging hoặc production, nhận được: \$env" ;;
esac

<span class="tok-comment"># Số</span>
[[ \$port =~ ^[0-9]+\$ ]] || die "cổng phải là một con số: \$port"
(( port &gt; 0 &amp;&amp; port &lt; 65536 )) || die "cổng ngoài khoảng cho phép: \$port"

<span class="tok-comment"># Định dạng, bằng một regex (Bài 6.4)</span>
[[ \$tag =~ ^v[0-9]+\\.[0-9]+\\.[0-9]+\$ ]] || die "tag phải có dạng v1.2.3"

<span class="tok-comment"># An toàn đường dẫn — từ chối mọi thứ thoát ra khỏi thư mục gốc</span>
case \$target in
  *..*) die "đường dẫn không được chứa ..: \$target" ;;
esac</code></pre>
<div class="callout warn">Phép kiểm cuối cùng đó không phải chuyện hoang tưởng. Một script nhận một đường dẫn từ tham số, từ biến môi trường hay từ nội dung một webhook rồi ghép nó vào <code>rm -rf "\$base/\$target"</code> sẽ vui vẻ xoá <code>/</code> khi <code>target</code> là <code>../../..</code>. Hãy kiểm mọi thứ chảy tới một lệnh phá huỷ, và hãy ưu tiên dựng đường dẫn bằng <code>realpath -e</code> để bạn so được kết quả đã giải với thư mục gốc.</div>

<h3>Một chế độ chạy thử đáng có</h3>
${slide('lx-07', 13, 'run() + --dry-run: in ra đúng thứ SẼ chạy')}
<pre><code>run() {
  if (( dry_run )); then
    printf '[chạy thử] %s\\n' "\$*" &gt;&amp;2
  else
    "\$@"
  fi
}

run docker build -t "myapp:\$tag" .
run docker push "myapp:\$tag"
run ssh "\$host" "docker pull myapp:\$tag &amp;&amp; docker compose up -d"</code></pre>
<div class="out">$ ./deploy.sh --dry-run --tag v1.4 production
[chạy thử] docker build -t myapp:v1.4 .
[chạy thử] docker push myapp:v1.4
[chạy thử] ssh vps docker pull myapp:v1.4 &amp;&amp; docker compose up -d</div>
<p>Một hàm bốn dòng, và mọi bước phá huỷ trong script đều trở nên soi được. Vì <code>run</code> dùng <code>"\$@"</code> (Bài 6.2), những tham số có dấu cách sống sót nguyên vẹn — một phiên bản dựng bằng cách nối chuỗi sẽ làm hỏng chúng và, tệ hơn, sẽ IN RA một thứ khác với thứ nó CHẠY.</p>
<div class="callout ok">Một chế độ chạy thử tự trả lại vốn ngay lần đầu bạn chĩa một script deploy vào production. Nó cũng là cách rẻ nhất để soát một script do người khác viết: chạy nó với <code>--dry-run</code> rồi đọc danh sách những lệnh nó <em>SẼ</em> chạy, và cách đó đáng tin hơn nhiều so với việc đọc mã rồi tưởng tượng.</div>

<h3>Tham số đặc biệt, và vì sao phải là <code>"\$@"</code> — đo thật</h3>
<p>Bài dùng <code>\$1</code>, <code>\$#</code> và <code>"\$@"</code> mà chưa có danh sách đầy đủ. Đây là danh sách đó, kèm đúng một thí nghiệm giải thích vì sao mọi script trong khoá này đều viết <code>"\$@"</code> có nháy. Script <code>pos.sh</code> in từng dạng trong ngoặc vuông, mỗi ngoặc là một tham số nó nhận được:</p>
<table>
<tr><th>Tham số</th><th>Nghĩa</th><th>Giá trị ví dụ</th></tr>
<tr><td><code>\$0</code></td><td>tên script, đúng như lúc được gọi</td><td><code>./pos.sh</code></td></tr>
<tr><td><code>\$1</code> … <code>\$9</code>, <code>\${10}</code></td><td>tham số thứ n (từ số 10 trở đi phải có ngoặc nhọn)</td><td><code>staging</code></td></tr>
<tr><td><code>\$#</code></td><td>có bao nhiêu tham số</td><td><code>3</code></td></tr>
<tr><td><code>"\$@"</code></td><td>mọi tham số, mỗi cái giữ nguyên là MỘT từ</td><td>cái nên dùng</td></tr>
<tr><td><code>"\$*"</code></td><td>mọi tham số dính thành một chuỗi (nối bằng ký tự đầu tiên của <code>IFS</code>)</td><td>chỉ để in thông báo</td></tr>
<tr><td><code>\$?</code> · <code>\$\$</code> · <code>\$!</code></td><td>mã thoát của lệnh trước · PID của script · PID của job nền gần nhất</td><td><code>0</code> · <code>4012</code> · <code>4020</code></td></tr>
</table>
<pre><code>./pos.sh staging "bao cao.txt" x</code></pre>
<div class="out">\$0=./pos.sh  \$#=3  \$1=staging  \$2=bao cao.txt
"\$@" → [staging] [bao cao.txt] [x]
"\$*" → [staging bao cao.txt x]
 \$@  → [staging] [bao] [cao.txt] [x]
sau shift: \$1=bao cao.txt \$#=2</div>
<p><code>\$@</code> không nháy đã biến ba tham số thành bốn, vì tên file có dấu cách bị chẻ đôi — đúng lỗi của biến quên nháy (Bài 6.2). <code>"\$*"</code> là một chuỗi duy nhất, tiện cho một dòng log và sai khi dùng để truyền tham số đi tiếp. Và ký tự nối của <code>"\$*"</code> không phải lúc nào cũng là dấu cách: với <code>IFS=\$'\\n\\t'</code> nghiêm ngặt của Bài 7.1 thì nó là <em>ký tự xuống dòng</em> — nguyên nhân của một lỗi thật tìm ra ở Bài 7.5.</p>

<h3>getopts, từng chi tiết một</h3>
<table>
<tr><th>Mẩu</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>getopts ĐẶC-TẢ TÊN</code></td><td>mỗi lần gọi đọc MỘT cờ, đặt chữ cái vào <code>TÊN</code>; trả mã khác 0 khi hết cờ (kết thúc vòng <code>while</code>)</td><td><code>while getopts ":vo:" opt</code></td></tr>
<tr><td>chữ cái</td><td>cờ bật/tắt, không có giá trị</td><td><code>v</code> → <code>-v</code></td></tr>
<tr><td>chữ cái + <code>:</code></td><td>cần một giá trị, nằm trong <code>\$OPTARG</code></td><td><code>o:</code> → <code>-o kq.txt</code> hoặc <code>-okq.txt</code></td></tr>
<tr><td><code>:</code> ở ngay đầu</td><td>chế độ im lặng: cờ lạ cho <code>opt=?</code>, thiếu giá trị cho <code>opt=:</code>, chữ cái nằm trong <code>OPTARG</code></td><td><code>":vo:fh"</code></td></tr>
<tr><td><code>\$OPTIND</code></td><td>vị trí của tham số sẽ đọc tiếp; bắt đầu từ 1</td><td><code>shift \$((OPTIND - 1))</code></td></tr>
</table>
<pre><code>./go.sh -vf -o kq.txt a.log b.log     <span class="tok-comment"># gộp cờ + một giá trị</span>
./go.sh a.log -v                      <span class="tok-comment"># một cờ đứng SAU tên file</span></code></pre>
<div class="out">OPTIND=4
verbose=1 output=kq.txt force=1
còn lại (2): a.log b.log
OPTIND=1
verbose=0 output=không force=0
còn lại (2): a.log -v</div>
<p>Lần chạy thứ hai làm nhiều người bất ngờ: <code>getopts</code> dừng ở <strong>tham số đầu tiên không phải cờ</strong>, y như các công cụ POSIX, nên <code>-v</code> đứng sau <code>a.log</code> bị coi là một tên file. Hãy đặt cờ lên trước, hoặc dùng vòng <code>while/case</code> vốn nhận cờ ở bất kỳ đâu. <code>getopts</code> là lệnh dựng sẵn của bash, nên chạy y hệt trên Ubuntu, WSL và bash 3.2 của Mac. Còn <code>getopt</code> (không có chữ s) là chương trình ngoài và thì không: <code>getopt</code> GNU của util-linux hiểu cờ dài, còn <code>getopt --version</code> BSD trên Mac chỉ in ra <code> --</code>. Chương 13 dựng một bộ phân tích cờ dài đầy đủ; chương này dừng ở hai dạng trên.</p>

<h3>Mã thoát: chọn có chủ đích</h3>
<p>Người gọi — cron, CI, một script khác, một bài test <code>bats</code> — chỉ thấy con số. Một quy ước nhỏ làm con số đó có nghĩa:</p>
<table>
<tr><th>Mã</th><th>Nghĩa</th><th>Ai sinh ra</th></tr>
<tr><td><code>0</code></td><td>thành công — hoặc "không có gì để làm" (đã có bản khác đang chạy)</td><td>bạn</td></tr>
<tr><td><code>1</code></td><td>công việc thất bại</td><td><code>die</code></td></tr>
<tr><td><code>2</code></td><td>gọi sai cách: cờ sai, thiếu tham số</td><td>bộ phân tích của bạn (giống lệnh dựng sẵn của bash)</td></tr>
<tr><td><code>126</code></td><td>tìm thấy file nhưng không chạy được ("Permission denied")</td><td>bash</td></tr>
<tr><td><code>127</code></td><td>không tìm thấy lệnh</td><td>bash</td></tr>
<tr><td><code>130</code> · <code>143</code></td><td>bị Ctrl-C giết (128+2) · bị SIGTERM giết (128+15)</td><td>nhân, qua bash</td></tr>
</table>
<p>Đã thử: chạy một script chép vào thư mục mà quên <code>chmod +x</code> thì in <code>Permission denied</code> và mã 126; lỗi gõ <code>--force</code> ở trên thoát với mã 2. Giữ 2 cho "bạn gọi tôi sai" và 1 cho "tôi đã thử mà hỏng", thì log CI đọc lướt là hiểu.</p>

<h3>Chạy thử từng bước</h3>
<p>Lưu bản 14 dòng này của vòng lặp cờ dài thành <code>~/thu-linux/ch7/dai.sh</code> rồi <code>chmod +x</code> nó:</p>
<pre><code>#!/usr/bin/env bash
set -euo pipefail
dry_run=0; env=""; tag="latest"
while [[ \$# -gt 0 ]]; do
  case \$1 in
    -n|--dry-run)  dry_run=1; shift ;;
    -t|--tag)      tag=\${2:?--tag cần giá trị}; shift 2 ;;
    --tag=*)       tag=\${1#*=}; shift ;;
    --)            shift; break ;;
    -*)            echo "cờ lạ: \$1" &gt;&amp;2; exit 2 ;;
    *)             env=\$1; shift ;;
  esac
done
echo "env=\${env:?thiếu môi trường} tag=\$tag dry_run=\$dry_run còn: \$*"</code></pre>
<p>Rồi chạy năm lời gọi này theo thứ tự, đoán trước từng dòng:</p>
<pre><code>./dai.sh --tag=v1.4 -n production
./dai.sh -t v2 staging -- -rf
./dai.sh --tag
./dai.sh --tag v1
./dai.sh --force x; echo "mã=\$?"</code></pre>
<div class="out">env=production tag=v1.4 dry_run=1 còn:
env=staging tag=v2 dry_run=0 còn: -rf
./dai.sh: line 7: 2: --tag cần giá trị
./dai.sh: line 14: env: thiếu môi trường
cờ lạ: --force
mã=2</div>
<p>Đọc kết quả: cả <code>--tag=v1.4</code> lẫn <code>-t v2</code> đều được; mọi thứ sau <code>--</code> vẫn là tham số dù <code>-rf</code> trông như một cờ; <code>\${2:?…}</code> và <code>\${env:?…}</code> tự sinh thông báo lỗi mà không cần <code>if</code> nào (tiền tố <code>2:</code> và <code>env:</code> là tên biến, nên chính lời nhắn phải gọi tên cái cờ); và cờ lạ thoát với mã 2.</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ trong bài</th><th>Ubuntu / WSL2</th><th>macOS</th></tr>
<tr><td><code>getopts</code>, <code>shift</code>, <code>"\$@"</code>, <code>\${2:?}</code></td><td>dựng sẵn trong bash</td><td>y hệt (bash 3.2 và zsh đều có)</td></tr>
<tr><td><code>getopt</code> (chương trình ngoài)</td><td>GNU util-linux: có cờ dài</td><td>BSD: không có cờ dài — tránh dùng</td></tr>
<tr><td><code>df --output=avail -BG</code> (tiền kiểm)</td><td>chạy được</td><td><code>df: unrecognized option &#96;--output=avail'</code> — dùng <code>df -g /</code> và <code>awk</code></td></tr>
<tr><td><code>[[ \$x =~ ^[0-9]+\$ ]]</code></td><td>chạy được</td><td>chạy được trên bash 3.2</td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> <code>backup.sh</code> của nhóm nhận cấu hình qua tham số vị trí mà không ai nhớ thứ tự. Hãy làm cho nó một cái cửa trước đàng hoàng trong <code>~/thu-linux/ch7/backup-args.sh</code>.</p><ol>
<li>Nhận <code>-n/--dry-run</code>, <code>-k/--keep N</code> (mặc định 7), <code>--keep=N</code>, <code>-h/--help</code>, <code>--</code>, và đúng một tham số vị trí: thư mục nguồn.</li>
<li>Kiểm giá trị: <code>N</code> phải khớp <code>^[0-9]+\$</code> và nằm trong 1–90; thư mục phải tồn tại và đọc được; cờ lạ thoát mã 2 kèm tên cờ.</li>
<li>Tiền kiểm: <code>command -v tar</code>; từ chối chạy nếu thư mục nguồn là <code>/</code>.</li>
<li>Bọc phần việc (giả) trong một hàm <code>run()</code> và in <code>[dry-run] tar -czf …</code> ở chế độ chạy thử.</li></ol>
<p><strong>Đạt khi:</strong> <code>./backup-args.sh --keep abc x; echo \$?</code> in một lời nhắn gọi tên <code>--keep</code> và số <code>2</code>; <code>./backup-args.sh -n -k 3 ~/thu-linux</code> in đúng một dòng <code>[dry-run]</code> và không tạo ra gì; và <code>--help</code> có ít nhất một ví dụ.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Positional argument (tham số vị trí)</span><span class="v">Giá trị truyền vào theo vị trí: <code>\$1</code>, <code>\$2</code>…; <code>\$#</code> đếm chúng.</span></div>
  <div class="kv"><span class="k"><code>"\$@"</code> (mọi tham số, nguyên vẹn)</span><span class="v">Tất cả tham số, mỗi cái giữ là một từ — cách an toàn để truyền đi tiếp.</span></div>
  <div class="kv"><span class="k"><code>shift</code> (dồn tham số)</span><span class="v">Bỏ <code>\$1</code> và dồn phần còn lại lên một chỗ.</span></div>
  <div class="kv"><span class="k"><code>getopts</code> (đọc cờ ngắn)</span><span class="v">Lệnh dựng sẵn đọc từng cờ ngắn một; <code>OPTARG</code> giữ giá trị, <code>OPTIND</code> giữ vị trí.</span></div>
  <div class="kv"><span class="k">Long option (cờ dài)</span><span class="v">Cờ dạng <code>--từ</code>; trong bash phải tự đọc bằng <code>while/case</code>.</span></div>
  <div class="kv"><span class="k">End of options <code>--</code> (hết cờ)</span><span class="v">Mọi thứ sau nó là tham số, kể cả khi bắt đầu bằng dấu gạch.</span></div>
  <div class="kv"><span class="k">Precondition / preflight (tiền kiểm)</span><span class="v">Kiểm mọi thứ công việc cần đều có, làm TRƯỚC khi đụng vào bất cứ gì.</span></div>
  <div class="kv"><span class="k">Dry run (chạy thử)</span><span class="v">Chế độ in ra các lệnh sẽ chạy mà không chạy chúng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Luôn truyền tham số đi tiếp bằng <code>"\$@"</code>; <code>\$@</code> không nháy chẻ tên có dấu cách, còn <code>"\$*"</code> dán tất cả lại làm một.</li>
<li><code>getopts ":vo:fh"</code>: dấu hai chấm đầu = bạn tự in lỗi, <code>o:</code> = cần giá trị; luôn <code>shift \$((OPTIND - 1))</code> sau vòng lặp.</li>
<li><code>getopts</code> dừng ở tham số đầu không phải cờ và chỉ hiểu cờ ngắn; vòng <code>while/case</code> xử lý được <code>--dài</code>, <code>--x=v</code> và <code>--</code>.</li>
<li>Phân tích → kiểm giá trị → tiền kiểm → mới làm việc; hỏng ở ba bước đầu thì hệ thống chưa bị đụng tới.</li>
<li>Mã 2 cho "gọi sai cách", 1 cho "làm hỏng", 0 cho thành công hoặc "không có gì để làm".</li>
<li>Một hàm bọc <code>run()</code> dùng <code>"\$@"</code> cho bạn chế độ <code>--dry-run</code> in đúng thứ sẽ chạy.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Bourne-Shell-Builtins.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — getopts và shift</span><span class="lc-sub">Ngữ nghĩa chính xác của <code>OPTIND</code>, <code>OPTARG</code> và chế độ lỗi im lặng. Ngắn, và nó xoá bỏ việc phải đoán.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/BashFAQ/035" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">BashFAQ 035 — "Xử lý tuỳ chọn dòng lệnh thế nào?"</span><span class="lc-sub">So sánh getopts, vòng while/case thủ công và getopt bên ngoài, kèm một ví dụ chạy được đầy đủ cho mỗi cách.</span></span>
</a>
<a class="link-card" href="https://clig.dev/" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Command Line Interface Guidelines</span><span class="lc-sub">Người dùng mong đợi gì ở một CLI: <code>--help</code>, mã thoát, stderr so với stdout, <code>--dry-run</code>, màu sắc. Không phụ thuộc ngôn ngữ và thật sự đáng đọc một lần.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: dựng cái cửa trước</span><span class="lc-sub">Bài chấm điểm: phân tích cờ ngắn và cờ dài, hỗ trợ <code>--</code>, kiểm một danh sách liệt kê và một số cổng, và thêm một <code>--dry-run</code> chạy được.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> quên <code>shift \$((OPTIND - 1))</code> sau một vòng <code>getopts</code>. Mọi thứ TRÔNG như chạy đúng — các cờ được phân tích chuẩn — nhưng <code>"\$@"</code> vẫn còn chứa chúng, nên vòng lặp qua "các file" cũng lặp luôn qua <code>-v</code> và <code>-o</code>. Script rồi sẽ tìm cách mở một file tên là <code>-v</code>, và thông báo lỗi chĩa vào đoạn xử lý file chứ không chĩa vào chỗ thiếu lệnh shift. Hễ một script nói "no such file: -v", lý do là đây.</div>
<p class="note-ct"><strong>Cấu trúc làm cho script an toàn khi chạy:</strong> phân tích tham số, rồi kiểm mọi giá trị, rồi kiểm mọi điều kiện tiên quyết, và chỉ tới lúc đó mới bắt tay vào việc. Mỗi giai đoạn đều thoát ra với một thông điệp riêng trên stderr và một mã khác 0. Một script dựng theo lối này thì người chưa từng đọc nó vẫn chạy được, vì nó NÓI cho họ biết nó cần gì thay vì hỏng giữa chừng rồi để họ ngồi đoán.</p>
</div>
`,
    },
    /* ─────────────────────────── 7.3 ─────────────────────────── */
    {
      title: '7.3 — trap, temp files and locks: cleaning up no matter what|||7.3 — trap, file tạm và khoá: dọn dẹp bất kể chuyện gì xảy ra',
      slug: 'lnx-7-3-trap-don-dep',
      type: 'LESSON',
      description: 'trap EXIT là bộ dọn dẹp duy nhất luôn chạy, mktemp thay cho /tmp/foo.$$, flock để hai bản script không giẫm lên nhau, trap ERR để báo đúng dòng hỏng, và tính bền vững khi chạy lại.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.3</span>
<h2>Cleaning up no matter what</h2>
<p class="lead">A script that creates a temporary file and deletes it on the last line works — until it exits early, or hits <code>set -e</code>, or someone presses Ctrl-C. Then the file stays, forever, and the disk fills up over months. <code>trap</code> is how you attach cleanup to <em>leaving</em> rather than to a particular line.</p>

<h3>trap EXIT: the one that always runs</h3>
${slide('lx-07', 14, 'Script chết giữa chừng: bẫy nào chạy, mã thoát bao nhiêu?')}
<pre><code>#!/usr/bin/env bash
set -euo pipefail

tmpdir=\$(mktemp -d)
trap 'rm -rf "\$tmpdir"' EXIT        <span class="tok-comment"># registered immediately after creating it</span>

echo "working in \$tmpdir"
curl -sSf "\$url" -o "\$tmpdir/data.json"
jq '.items' "\$tmpdir/data.json" &gt; result.json</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Normal end</span><span class="lz-t">the script reaches the last line</span><span class="lz-d">EXIT fires. Directory removed.</span></div>
  <div class="lz-step"><span class="lz-k">Early exit</span><span class="lz-t">exit 1 from a validation failure</span><span class="lz-d">EXIT fires. Directory removed.</span></div>
  <div class="lz-step"><span class="lz-k">set -e abort</span><span class="lz-t">curl fails, the script stops</span><span class="lz-d">EXIT fires. Directory removed.</span></div>
  <div class="lz-step"><span class="lz-k">Ctrl-C · SIGTERM</span><span class="lz-t">the user or systemd interrupts it</span><span class="lz-d">EXIT fires. Directory removed. This is why you trap EXIT and not INT.</span></div>
  <div class="lz-step"><span class="lz-k">SIGKILL</span><span class="lz-t">kill -9, or the OOM killer</span><span class="lz-d">Nothing fires — SIGKILL cannot be caught (Lesson 5.3). The one case cleanup cannot cover.</span></div>
</div>
<div class="callout ok"><strong>Trap <code>EXIT</code>, not <code>INT TERM</code>.</strong> <code>EXIT</code> is a pseudo-signal that bash runs whenever the shell terminates for any reason — including after an <code>INT</code> or <code>TERM</code> handler has finished. Trapping <code>EXIT</code> alone covers every case except SIGKILL, with one line and no duplication.</div>

<h3>mktemp: never build a temp path by hand</h3>
${slide('lx-07', 16, 'mktemp: tên không đoán được, quyền 600 — đừng /tmp/x.$$')}
<pre><code>tmpfile=\$(mktemp)                       <span class="tok-comment"># /tmp/tmp.8kqW2nHxYz</span>
tmpdir=\$(mktemp -d)                     <span class="tok-comment"># a directory</span>
tmpfile=\$(mktemp -t deploy.XXXXXX)      <span class="tok-comment"># with a recognisable prefix</span>
tmpfile=\$(mktemp -p "\$SCRIPT_DIR")      <span class="tok-comment"># in a specific directory</span>

trap 'rm -f "\$tmpfile"' EXIT</code></pre>
<div class="callout warn"><strong>Never write <code>/tmp/myscript.\$\$</code>.</strong> PIDs are reused, so two runs can collide; and <code>/tmp</code> is world-writable (Lesson 4.3), so another user can pre-create that exact path as a symlink pointing at a file you have permission to write — and your script then overwrites <em>their</em> chosen target with your content, as you. That is a real privilege-escalation pattern with a name (symlink attack), and <code>mktemp</code> exists specifically to prevent it: it creates the file atomically with mode <code>600</code> and an unpredictable name.</div>

<h3>Cleaning up more than one thing</h3>
${slide('lx-07', 15, 'Bẫy INT mà quên exit: Ctrl-C xong script CHẠY TIẾP')}
<pre><code>cleanup() {
  local rc=\$?                          <span class="tok-comment"># capture the exit code FIRST</span>
  rm -rf "\${tmpdir:-}"
  [[ -n \${container:-} ]] &amp;&amp; docker rm -f "\$container" &gt;/dev/null 2&gt;&amp;1
  [[ -n \${lockfd:-} ]] &amp;&amp; flock -u "\$lockfd"
  (( rc != 0 )) &amp;&amp; log "failed with exit code \$rc"
  return \$rc                            <span class="tok-comment"># preserve it</span>
}
trap cleanup EXIT</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>local rc=\$?</code> first</span><span class="v">Every command inside the handler overwrites <code>\$?</code>. Capture it on the very first line, or you will report the exit code of <code>rm</code>.</span></div>
  <div class="kv"><span class="k"><code>\${var:-}</code></span><span class="v">Under <code>set -u</code>, referencing an unset variable is fatal — and the handler can run <em>before</em> those variables are assigned, if the script dies early. The <code>:-</code> makes it safe.</span></div>
  <div class="kv"><span class="k">Never fail in cleanup</span><span class="v">Redirect errors to <code>/dev/null</code> and tolerate failures. A cleanup handler that itself errors under <code>set -e</code> masks the original problem.</span></div>
</div>

<h3>trap ERR: report where it broke</h3>
${slide('lx-07', 17, 'trap ERR chỉ vào được trong hàm khi có set -E')}
<pre><code>set -euo pipefail

on_error() {
  local rc=\$? line=\$1
  printf 'ERROR: line %s exited with %s: %s\\n' \\
    "\$line" "\$rc" "\$BASH_COMMAND" &gt;&amp;2
}
trap 'on_error \$LINENO' ERR</code></pre>
<div class="out">ERROR: line 42 exited with 22: curl -sSf https://api.example.com/data</div>
<p><code>ERR</code> fires whenever a command fails in a way that would trigger <code>set -e</code>. <code>\$BASH_COMMAND</code> holds the command that was running, and <code>\$LINENO</code> — expanded at trap time because the handler is in <strong>single</strong> quotes — gives the line. The difference between a script that dies silently and one that says "line 42, curl, exit 22" is these five lines.</p>
<div class="callout">Single quotes on <code>trap '…' ERR</code> matter. With double quotes, <code>\$LINENO</code> is expanded once when the <code>trap</code> line runs, so every error reports that same line number. The handler body must stay unexpanded until it fires.</div>

<h3>flock: stop two copies running at once</h3>
${slide('lx-07', 18, 'flock: khoá nằm ở fd đang mở — kể cả của tiến trình con')}
<pre><code>#!/usr/bin/env bash
set -euo pipefail

readonly LOCKFILE=/var/lock/backup.lock
exec 9&gt;"\$LOCKFILE"                      <span class="tok-comment"># open fd 9 on it (Lesson 3.1)</span>
flock -n 9 || { echo "already running" &gt;&amp;2; exit 1; }

<span class="tok-comment"># … the work; the lock is released automatically when the script exits …</span></code></pre>
<div class="out">$ ./backup.sh &amp; ./backup.sh
already running</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-n</code></span><span class="v">Non-blocking: fail immediately if the lock is held. Right for a cron job — a second copy should skip, not queue up behind the first.</span></div>
  <div class="kv"><span class="k">no <code>-n</code></span><span class="v">Wait for the lock. Right when the work must happen, just not concurrently.</span></div>
  <div class="kv"><span class="k"><code>-w 30</code></span><span class="v">Wait, but give up after 30 seconds.</span></div>
</div>
<div class="callout ok">The lock is held by the <strong>open file descriptor</strong>, not by the file's existence — so the kernel releases it when the process dies, however it dies, including <code>kill -9</code> and a power cut. That is why <code>flock</code> is correct and a hand-rolled "create a PID file, delete it at the end" lock is not: the latter leaves a stale lock behind after any crash, and then the job never runs again until someone notices.</div>
<pre><code><span class="tok-comment"># One-liner form, ideal for a crontab entry (Chapter 11)</span>
*/5 * * * * flock -n /var/lock/sync.lock /srv/app/sync.sh</code></pre>
<p>A five-minute cron job whose work sometimes takes six minutes will otherwise pile up copies until the machine falls over. This is the single most common cause of a server that was fine for months and then died at 4am, and it is one word of prevention.</p>

<h3>Idempotency: safe to run twice</h3>
${slide('lx-07', 19, 'Chạy hai lần không hỏng: kiểm rồi mới làm')}
<pre><code><span class="tok-comment"># Not idempotent — a second run fails or duplicates</span>
mkdir /srv/app/data
echo "PATH=/opt/bin:\$PATH" &gt;&gt; ~/.bashrc
useradd deploy

<span class="tok-comment"># Idempotent — a second run is a no-op</span>
mkdir -p /srv/app/data
grep -qxF 'PATH=/opt/bin:\$PATH' ~/.bashrc || echo 'PATH=/opt/bin:\$PATH' &gt;&gt; ~/.bashrc
id -u deploy &amp;&gt;/dev/null || useradd -r -s /usr/sbin/nologin deploy</code></pre>
<p>Scripts get re-run: a deploy is retried, a cron job overlaps, someone is not sure whether the first attempt worked. A script that is safe to run twice can simply be run again after a failure, which is the difference between a five-second recovery and an investigation. The <code>||</code> pattern above — check, then act only if needed — makes almost anything idempotent.</p>
<div class="callout warn">The <code>&gt;&gt; ~/.bashrc</code> example is not hypothetical. A setup script run three times leaves three copies of the same <code>PATH</code> line, each prepending again, so <code>PATH</code> grows on every shell start. <code>grep -qxF</code> — quiet, whole-line, fixed-string — is the guard, and <code>-F</code> matters because the line contains <code>\$</code> and <code>/</code> which would otherwise be regex.</div>

<h3>Putting it together</h3>
<pre><code>#!/usr/bin/env bash
set -euo pipefail
IFS=\$'\\n\\t'

readonly LOCKFILE=/var/lock/backup.lock
tmpdir=""

cleanup() {
  local rc=\$?
  [[ -n \$tmpdir ]] &amp;&amp; rm -rf "\$tmpdir"
  (( rc != 0 )) &amp;&amp; echo "backup failed (\$rc)" &gt;&amp;2
  return \$rc
}
trap cleanup EXIT
trap 'echo "ERROR at line \$LINENO: \$BASH_COMMAND" &gt;&amp;2' ERR

exec 9&gt;"\$LOCKFILE"
flock -n 9 || { echo "backup already running" &gt;&amp;2; exit 0; }

tmpdir=\$(mktemp -d)
mkdir -p "/srv/backups/\$(date +%F)"      <span class="tok-comment"># the DATED folder that mv writes into (fixed 28/09/2026)</span>

pg_dump "\$DATABASE_URL" &gt; "\$tmpdir/db.sql"
tar -czf "\$tmpdir/files.tar.gz" -C /srv/app uploads
mv "\$tmpdir"/*.{sql,tar.gz} "/srv/backups/\$(date +%F)/"

find /srv/backups -mindepth 1 -maxdepth 1 -type d -mtime +30 -exec rm -rf {} +
echo "backup complete"</code></pre>
<div class="out">$ ./backup.sh
backup complete
$ ./backup.sh &amp; ./backup.sh
backup already running</div>
<p>Note <code>exit 0</code> when the lock is held: for a cron job, "another copy is already running" is not an error, and exiting nonzero would send you a failure email every five minutes. Choosing the right exit code for "nothing to do" is part of writing a script that people do not learn to ignore.</p>

<h3>Six ways a script dies — measured</h3>
<p>The flow at the top of this lesson is a claim; here is the measurement. <code>tr.sh</code> creates a directory with <code>mktemp -d</code>, registers an EXIT trap that reports and deletes it, then either finishes, exits, fails under <code>set -e</code>, or sleeps so it can be killed. Ctrl-C was simulated the way a terminal does it: <code>SIGINT</code> sent to the whole process group (<code>kill -INT -- -PGID</code>).</p>
<pre><code>#!/usr/bin/env bash
set -euo pipefail
tmpdir=\$(mktemp -d)
trap 'echo "EXIT ran (code \$?) — removing \$tmpdir" &gt;&amp;2; rm -rf "\$tmpdir"' EXIT
case \${1:-} in
  het)   echo "done" ;;
  exit1) exit 1 ;;
  loi)   false; echo "never reached" ;;
  cho)   sleep 30 ;;
esac</code></pre>
<table>
<tr><th>How it ended</th><th>EXIT trap ran?</th><th>Exit code</th><th>Temp dir left behind?</th></tr>
<tr><td>reached the last line</td><td>yes</td><td>0</td><td>no</td></tr>
<tr><td><code>exit 1</code></td><td>yes</td><td>1</td><td>no</td></tr>
<tr><td><code>false</code> under <code>set -e</code></td><td>yes</td><td>1</td><td>no</td></tr>
<tr><td>Ctrl-C (SIGINT to the group)</td><td>yes, after 0.5 s</td><td>130</td><td>no</td></tr>
<tr><td><code>kill</code> / <code>systemctl stop</code> (SIGTERM)</td><td>yes, after 0.5 s</td><td>143</td><td>no — but the child <code>sleep 30</code> kept running as an orphan</td></tr>
<tr><td><code>kill -9</code> (SIGKILL)</td><td><strong>no</strong></td><td>137</td><td><strong>yes, one directory</strong></td></tr>
</table>
<p>Three things worth noticing. First, the trap printed <code>code 0</code> in the two signal cases even though the script exited 130 and 143 — inside an EXIT trap, <code>\$?</code> tells you about the last command, not about the signal. If you need to know "was I killed?", trap <code>INT</code> and <code>TERM</code> separately. Second, SIGTERM killed bash but not the <code>sleep</code> it was waiting for: a script that starts long-running children should kill them in its cleanup (<code>kill 0</code> or a saved <code>\$!</code>). Third, the test harness itself nearly lied: a background job started from a <em>non-interactive</em> shell ignores SIGINT, so the first attempt showed "exit 0 after 30 s". Only with job control on (<code>set -m</code>) did the numbers match what a real Ctrl-C does.</p>

<h3>A trap on INT must end with exit</h3>
<p>Trapping <code>INT</code> replaces bash's default reaction ("die"). If the handler does not exit, the script <em>continues</em> after Ctrl-C — the interrupted command dies, the next line runs. Measured with two scripts that differ in one word:</p>
<pre><code>trap 'echo "INT: đã bắt Ctrl-C" &gt;&amp;2' INT                      <span class="tok-comment"># int.sh  — no exit</span>
trap 'echo "INT: đã bắt Ctrl-C, thoát 130" &gt;&amp;2; exit 130' INT   <span class="tok-comment"># int2.sh — exits</span>
trap 'echo "EXIT: dọn dẹp" &gt;&amp;2' EXIT
sleep 30
echo "SAU sleep: script vẫn chạy tiếp!"                           <span class="tok-comment"># "AFTER sleep: still running!"</span></code></pre>
<div class="out">== int.sh
SAU sleep: script vẫn chạy tiếp!
INT: đã bắt Ctrl-C
EXIT: dọn dẹp
   mã thoát: 0
== int2.sh
INT: đã bắt Ctrl-C, thoát 130
EXIT: dọn dẹp
   mã thoát: 130</div>
<p>(Messages kept in Vietnamese exactly as recorded; the "SAU sleep" line appears before the INT line only because stdout and stderr were flushed separately.) With no exit, the user pressed Ctrl-C, the script carried on to its next step and finished with code 0 — the worst possible outcome for a deploy. Rule: if you trap <code>INT</code> or <code>TERM</code> at all, end the handler with <code>exit 130</code> / <code>exit 143</code>; if you only need cleanup, trap <code>EXIT</code> alone and leave the signals at their defaults.</p>

<h3>trap ERR is silent inside functions without <code>set -E</code></h3>
<p>The ERR trap in this lesson works at the top level. Most real scripts (Lesson 7.5) run everything inside <code>main()</code>, and the bash manual is explicit: the ERR trap is <em>not</em> inherited by functions, command substitutions or subshells unless <code>errtrace</code> is on. Same script, run twice — the failure is a <code>curl</code> inside a function:</p>
<pre><code>#!/usr/bin/env bash
set -\${CO:-e}uo pipefail
trap 'echo "ERR: dòng \$LINENO, mã \$?: \$BASH_COMMAND" &gt;&amp;2' ERR   <span class="tok-comment"># message kept exactly as recorded</span>
tai_ve() {
  curl -sSf --max-time 3 "http://127.0.0.1:19070/khong-co"
}
main() {
  echo "bắt đầu"
  tai_ve
  echo "xong"
}
main "\$@"</code></pre>
<div class="out">$ ./err.sh; echo "exit=\$?"              <span class="tok-comment"># set -euo pipefail</span>
bắt đầu
curl: (7) Failed to connect to 127.0.0.1 port 19070 after 1 ms: Couldn't connect to server
exit=7
$ CO=Ee ./err.sh; echo "exit=\$?"       <span class="tok-comment"># set -Eeuo pipefail</span>
bắt đầu
curl: (7) Failed to connect to 127.0.0.1 port 19070 after 0 ms: Couldn't connect to server
ERR: dòng 5, mã 7: curl -sSf --max-time 3 "http://127.0.0.1:19070/khong-co"
exit=7</div>
<p>Without <code>-E</code> the script died with no hint of where. With it, the trap names line 5 and the exact command. That single letter is why the skeleton in Lesson 7.1 says <code>set -Eeuo pipefail</code>. One side effect to know: with <code>-E</code> the ERR trap also fires inside <code>cleanup</code> if cleanup returns non-zero, so start <code>cleanup</code> with <code>trap - ERR</code> (Lesson 7.5 shows the measured difference).</p>

<h3>trap and mktemp: the flags you will use</h3>
<table>
<tr><th>Command</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>trap 'cmd' EXIT</code></td><td>run <code>cmd</code> when the shell exits, for any reason but SIGKILL</td><td><code>trap cleanup EXIT</code></td></tr>
<tr><td><code>trap 'cmd' ERR</code></td><td>run <code>cmd</code> when a command fails the way -e would notice</td><td>with <code>set -E</code> in functions</td></tr>
<tr><td><code>trap 'cmd' INT TERM</code></td><td>replace the default "die" on Ctrl-C / SIGTERM — must <code>exit</code></td><td><code>trap '…; exit 130' INT</code></td></tr>
<tr><td><code>trap -p</code></td><td>list the traps currently set</td><td><code>trap -- 'echo bye' EXIT</code></td></tr>
<tr><td><code>trap - EXIT</code></td><td>remove a trap (back to default)</td><td>inside cleanup: <code>trap - ERR</code></td></tr>
<tr><td><code>trap -l</code> / <code>kill -l</code></td><td>list signal names and numbers</td><td><code>2) SIGINT … 9) SIGKILL</code></td></tr>
<tr><td><code>mktemp</code> · <code>mktemp -d</code></td><td>new file (mode 600) · new directory (mode 700)</td><td><code>/tmp/tmp.hfamqMRWWR</code></td></tr>
<tr><td><code>mktemp -t deploy.XXXXXX</code></td><td>GNU: template in <code>\$TMPDIR</code> or /tmp</td><td><code>/tmp/deploy.7cdXsE</code></td></tr>
<tr><td><code>mktemp -p DIR</code></td><td>create inside DIR</td><td><code>/home/an/tmp.0Z2HEjiUVW</code></td></tr>
</table>
<p>Real output from the container: <code>ls -ld</code> on a fresh <code>mktemp</code> file and directory showed <code>-rw-------</code> and <code>drwx------</code>, and a template with too few X's is refused — <code>mktemp /tmp/sai</code> → <code>mktemp: too few X's in template '/tmp/sai'</code>.</p>

<h3>flock: the lock belongs to the open file — children included</h3>
<p>The lesson says the lock is released "when the process dies, however it dies". Precisely: when <strong>every</strong> file descriptor pointing at the open lock file is closed. Children inherit descriptors, so a child can keep holding the lock after its parent is gone. Measured with <code>khoa.sh</code> (takes the lock on fd 9, then <code>sleep 2</code>):</p>
<pre><code>./khoa.sh &amp; sleep 0.3; ./khoa.sh           <span class="tok-comment"># two copies</span>
./khoa.sh &amp; sleep 0.3; kill -9 \$!; ./khoa.sh   <span class="tok-comment"># kill -9 the first, try again</span></code></pre>
<div class="out">[3205] giữ khoá, làm việc 2 giây
[3209] đang có bản khác chạy — bỏ qua
[3205] xong
[3222] giữ khoá, làm việc 2 giây
[3228] đang có bản khác chạy — bỏ qua</div>
<p>Bash 3222 was dead, yet 3228 was still refused: <code>ps</code> showed its child <code>sleep 2</code> (PID 3225) alive and holding fd 9. Two seconds later, when the <code>sleep</code> ended, the lock was free. Usually this is exactly what you want (the work is still running), but it explains the puzzle "I killed the script and the lock is still held". The lock file itself is empty and can stay on disk forever — it is only a name to lock. Chapter 13 goes further (waiting with <code>-w</code>, shared locks, locks in systemd units).</p>

<h3>What re-running this lesson's own script revealed</h3>
<p>The "Putting it together" script above was run for real in a container (with a stand-in <code>pg_dump</code>). The original version failed on its first run:</p>
<div class="out">mv: target '/srv/backups/2026-09-28/': No such file or directory
ERROR at line 25: mv "\$tmpdir"/*.{sql,tar.gz} "/srv/backups/\$(date +%F)/"
backup failed (1)</div>
<p>It created <code>/srv/backups</code> but never the dated folder that <code>mv</code> writes into. The listing above is now fixed (<code>mkdir -p "/srv/backups/\$(date +%F)"</code>), and the <code>find</code> gained <code>-mindepth 1 -maxdepth 1</code> so it can only ever delete the dated sub-folders, never <code>/srv/backups</code> itself or something nested inside today's backup. After the fix: <code>backup complete</code>, and a second copy started while the first held the lock printed <code>backup already running</code> with exit 0. The lesson for your own scripts: a script you have only read is a script you have not tested.</p>

<h3>Run it step by step</h3>
<p>In an <code>ubuntu:24.04</code> container (or <code>~/thu-linux/ch7</code>), save <code>tr.sh</code> from "Six ways a script dies" and make it executable. Then:</p>
<pre><code>./tr.sh het;   echo "exit=\$?"          <span class="tok-comment"># normal end</span>
./tr.sh loi;   echo "exit=\$?"          <span class="tok-comment"># set -e abort</span>
./tr.sh cho                             <span class="tok-comment"># press Ctrl-C after a second</span>
echo "exit=\$?"
ls -d /tmp/tmp.* 2&gt;/dev/null | wc -l    <span class="tok-comment"># how many temp dirs are left?</span></code></pre>
<div class="out">done
EXIT ran (code 0) — removing /tmp/tmp.NEF1Bnzc3K
exit=0
EXIT ran (code 1) — removing /tmp/tmp.phok43IJzS
exit=1
EXIT ran (code 0) — removing /tmp/tmp.aI7orIEqb8
exit=130
0</div>
<p>Every path ran the trap and the count at the end is 0. (Recorded in the container with the Ctrl-C sent as <code>kill -INT</code> to the process group; the random names will differ, and in a real terminal you will also see <code>^C</code>.) Now open a second terminal, run <code>./tr.sh cho</code> in the first and <code>kill -9</code> its PID from the second: the count becomes 1 — the one case no trap can cover.</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Thing in this lesson</th><th>Ubuntu / WSL2</th><th>macOS 27 (tested)</th></tr>
<tr><td><code>trap … EXIT/ERR/INT</code>, <code>set -E</code></td><td>bash 5.2</td><td>the same in bash 3.2</td></tr>
<tr><td><code>mktemp</code></td><td><code>/tmp/tmp.XXXXXXXXXX</code></td><td><code>\$TMPDIR/tmp.XXXXXXXXXX</code>, e.g. <code>/var/folders/…/T/tmp.k1yZayjAhk</code></td></tr>
<tr><td><code>mktemp -t deploy.XXXXXX</code></td><td><code>/tmp/deploy.7cdXsE</code></td><td>treats the argument as a PREFIX: <code>…/T/deploy.XXXXXX.r1Borxn1Pc</code></td></tr>
<tr><td><code>mktemp -t deploy</code></td><td><code>too few X's in template 'deploy'</code></td><td><code>…/T/deploy.Y9g8MaxW1R</code></td></tr>
<tr><td>portable form</td><td colspan="2"><code>mktemp "\${TMPDIR:-/tmp}/deploy.XXXXXX"</code> — works on both (tested)</td></tr>
<tr><td><code>flock</code></td><td>util-linux, installed</td><td><code>flock not found</code> — test lock logic in a container</td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the group VPS's <code>/tmp</code> keeps filling with <code>tmp.*</code> folders, and twice the nightly backup ran two copies at once. Fix both in an <code>ubuntu:24.04</code> container.</p><ol>
<li>Write <code>nightly.sh</code> with <code>set -Eeuo pipefail</code> that makes a temp dir with <code>mktemp -d</code>, writes a 50 MB file into it (<code>head -c 50M /dev/zero</code>), sleeps 20 s, then moves it to <code>/srv/backups/\$(date +%F)/</code>.</li>
<li>Add a <code>cleanup</code> function (capture <code>\$?</code> first, <code>\${tmpdir:-}</code>) and <code>trap cleanup EXIT</code> on the line right after <code>mktemp</code>.</li>
<li>Add <code>exec 9&gt;/run/lock/nightly.lock</code> + <code>flock -n 9 || exit 0</code>.</li>
<li>Test: normal run; Ctrl-C during the sleep; two copies at once; a second normal run (idempotent).</li></ol>
<p><strong>Done when:</strong> <code>ls -d /tmp/tmp.* | wc -l</code> is 0 after the Ctrl-C test; the second concurrent copy exits 0 with a message; the second normal run succeeds without "File exists"; and Ctrl-C gives exit code 130.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Trap</span><span class="v">A command bash runs when a signal or pseudo-signal (EXIT, ERR) happens.</span></div>
  <div class="kv"><span class="k">EXIT (pseudo-signal)</span><span class="v">Fires whenever the shell ends, whatever the reason — except SIGKILL.</span></div>
  <div class="kv"><span class="k">SIGINT / SIGTERM / SIGKILL</span><span class="v">Ctrl-C (2) / polite "please stop" (15) / uncatchable kill (9); exit codes 130 / 143 / 137.</span></div>
  <div class="kv"><span class="k">errtrace (<code>set -E</code>)</span><span class="v">Makes the ERR trap fire inside functions and <code>\$( )</code>.</span></div>
  <div class="kv"><span class="k">mktemp</span><span class="v">Creates a temp file/dir atomically with an unpredictable name and private permissions.</span></div>
  <div class="kv"><span class="k">Symlink attack (CWE-377)</span><span class="v">Pre-creating a guessable temp path as a link so your script overwrites someone else's target.</span></div>
  <div class="kv"><span class="k">flock</span><span class="v">A kernel lock held through an open file descriptor; released when every holder closes it.</span></div>
  <div class="kv"><span class="k">Idempotent</span><span class="v">Safe to run again: a second run changes nothing and does not fail.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Create, then trap on the very next line: <code>tmpdir=\$(mktemp -d)</code> + <code>trap cleanup EXIT</code>.</li>
<li>EXIT runs on normal end, <code>exit</code>, <code>set -e</code>, Ctrl-C (130) and SIGTERM (143) — measured; only <code>kill -9</code> (137) skips it.</li>
<li>A trap on INT/TERM must end with <code>exit</code>, or the script continues after Ctrl-C.</li>
<li>Without <code>set -E</code>, a <code>trap … ERR</code> never fires inside functions — i.e. never, in a script built around <code>main()</code>.</li>
<li><code>flock -n</code> on an fd stops concurrent runs; the lock lasts until every process holding that fd (children too) is gone.</li>
<li>Write every step so a second run is a no-op: <code>mkdir -p</code>, <code>grep -qxF … ||</code>, <code>id -u … ||</code>, <code>ln -sfn</code>.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Bourne-Shell-Builtins.html#index-trap" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — trap</span><span class="lc-sub">The full semantics, including the EXIT, ERR, DEBUG and RETURN pseudo-signals and how traps interact with functions and subshells.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/flock.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">flock(1) — file locks from the shell</span><span class="lc-sub">Both the wrapper form and the fd form, with the exact release semantics. The EXAMPLES section is a ready-made cron guard.</span></span>
</a>
<a class="link-card" href="https://cwe.mitre.org/data/definitions/377.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚠️</span>
  <span class="lc-body"><span class="lc-title">CWE-377 — Insecure Temporary File</span><span class="lc-sub">The formal description of the symlink attack that <code>mktemp</code> prevents, with real examples. Short, and it makes the rule stick.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: clean up after yourself</span><span class="lc-sub">Graded tasks: add an EXIT trap that survives Ctrl-C, replace a hand-built temp path with <code>mktemp</code>, add a <code>flock</code> guard, and make a setup script idempotent.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> registering the trap before creating the thing it cleans up, or after. Both fail. <code>trap 'rm -rf "\$tmpdir"' EXIT</code> written <em>before</em> <code>tmpdir=\$(mktemp -d)</code> runs <code>rm -rf ""</code> if the script dies in between — harmless, but it also means an early failure leaves the directory behind. Written several lines <em>after</em> the <code>mktemp</code>, any failure in that gap leaks the directory permanently. Create, then trap, on the very next line — and inside the handler always guard with <code>\${tmpdir:-}</code> so <code>set -u</code> cannot turn your cleanup into a second error.</div>
<p class="note-ct"><strong>Three lines that belong in most production scripts:</strong> <code>tmpdir=\$(mktemp -d)</code> followed immediately by <code>trap 'rm -rf "\$tmpdir"' EXIT</code>, and <code>flock -n 9</code> on anything reachable from cron. They cost nothing, they are invisible when everything works, and each one prevents a failure that only shows up weeks later — a full disk, or two copies of a backup writing to the same file.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.3</span>
<h2>Dọn dẹp bất kể chuyện gì xảy ra</h2>
<p class="lead">Một script tạo ra file tạm rồi xoá nó ở dòng cuối thì chạy được — cho tới khi nó thoát sớm, hoặc dính <code>set -e</code>, hoặc có người nhấn Ctrl-C. Rồi cái file nằm lại đó, vĩnh viễn, và đĩa đầy dần qua nhiều tháng. <code>trap</code> là cách bạn gắn việc dọn dẹp vào <em>VIỆC RỜI ĐI</em> thay vì gắn vào một dòng cụ thể.</p>

<h3>trap EXIT: cái luôn luôn chạy</h3>
${slide('lx-07', 14, 'Script chết giữa chừng: bẫy nào chạy, mã thoát bao nhiêu?')}
<pre><code>#!/usr/bin/env bash
set -euo pipefail

tmpdir=\$(mktemp -d)
trap 'rm -rf "\$tmpdir"' EXIT        <span class="tok-comment"># đăng ký ngay sau khi tạo ra nó</span>

echo "đang làm việc trong \$tmpdir"
curl -sSf "\$url" -o "\$tmpdir/data.json"
jq '.items' "\$tmpdir/data.json" &gt; result.json</code></pre>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Kết thúc bình thường</span><span class="lz-t">script chạy tới dòng cuối</span><span class="lz-d">EXIT kích hoạt. Thư mục bị xoá.</span></div>
  <div class="lz-step"><span class="lz-k">Thoát sớm</span><span class="lz-t">exit 1 vì một phép kiểm không qua</span><span class="lz-d">EXIT kích hoạt. Thư mục bị xoá.</span></div>
  <div class="lz-step"><span class="lz-k">set -e làm dừng</span><span class="lz-t">curl hỏng, script dừng lại</span><span class="lz-d">EXIT kích hoạt. Thư mục bị xoá.</span></div>
  <div class="lz-step"><span class="lz-k">Ctrl-C · SIGTERM</span><span class="lz-t">người dùng hoặc systemd ngắt nó</span><span class="lz-d">EXIT kích hoạt. Thư mục bị xoá. Đây là lý do bạn bẫy EXIT chứ không bẫy INT.</span></div>
  <div class="lz-step"><span class="lz-k">SIGKILL</span><span class="lz-t">kill -9, hoặc OOM killer</span><span class="lz-d">Không gì kích hoạt cả — SIGKILL không bắt được (Bài 5.3). Trường hợp duy nhất mà việc dọn dẹp không phủ tới.</span></div>
</div>
<div class="callout ok"><strong>Hãy bẫy <code>EXIT</code>, đừng bẫy <code>INT TERM</code>.</strong> <code>EXIT</code> là một tín hiệu giả mà bash chạy mỗi khi shell kết thúc vì BẤT KỲ lý do nào — kể cả sau khi một bộ xử lý <code>INT</code> hay <code>TERM</code> đã chạy xong. Chỉ bẫy <code>EXIT</code> là phủ được mọi trường hợp trừ SIGKILL, bằng một dòng và không lặp lại.</div>

<h3>mktemp: đừng bao giờ tự dựng một đường dẫn tạm</h3>
${slide('lx-07', 16, 'mktemp: tên không đoán được, quyền 600 — đừng /tmp/x.$$')}
<pre><code>tmpfile=\$(mktemp)                       <span class="tok-comment"># /tmp/tmp.8kqW2nHxYz</span>
tmpdir=\$(mktemp -d)                     <span class="tok-comment"># một thư mục</span>
tmpfile=\$(mktemp -t deploy.XXXXXX)      <span class="tok-comment"># có tiền tố nhận ra được</span>
tmpfile=\$(mktemp -p "\$SCRIPT_DIR")      <span class="tok-comment"># trong một thư mục cụ thể</span>

trap 'rm -f "\$tmpfile"' EXIT</code></pre>
<div class="callout warn"><strong>Đừng bao giờ viết <code>/tmp/myscript.\$\$</code>.</strong> PID được dùng lại, nên hai lần chạy có thể đụng nhau; và <code>/tmp</code> thì cả thế giới ghi được (Bài 4.3), nên một người dùng khác tạo trước đúng đường dẫn đó dưới dạng một liên kết tượng trưng trỏ vào một file mà BẠN có quyền ghi — và script của bạn sẽ ghi đè lên cái đích mà <em>HỌ</em> chọn bằng nội dung của bạn, với danh nghĩa của bạn. Đó là một khuôn mẫu leo thang đặc quyền có thật và có tên hẳn hoi (tấn công qua symlink), và <code>mktemp</code> tồn tại chính là để chặn nó: nó tạo file một cách nguyên tử với chế độ <code>600</code> và một cái tên không đoán trước được.</div>

<h3>Dọn dẹp nhiều hơn một thứ</h3>
${slide('lx-07', 15, 'Bẫy INT mà quên exit: Ctrl-C xong script CHẠY TIẾP')}
<pre><code>cleanup() {
  local rc=\$?                          <span class="tok-comment"># bắt lấy mã thoát TRƯỚC TIÊN</span>
  rm -rf "\${tmpdir:-}"
  [[ -n \${container:-} ]] &amp;&amp; docker rm -f "\$container" &gt;/dev/null 2&gt;&amp;1
  [[ -n \${lockfd:-} ]] &amp;&amp; flock -u "\$lockfd"
  (( rc != 0 )) &amp;&amp; log "hỏng với mã thoát \$rc"
  return \$rc                            <span class="tok-comment"># giữ nguyên nó</span>
}
trap cleanup EXIT</code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>local rc=\$?</code> đặt đầu tiên</span><span class="v">Mọi lệnh bên trong bộ xử lý đều ghi đè <code>\$?</code>. Hãy bắt nó ngay ở dòng đầu tiên, không thì bạn sẽ báo cáo mã thoát của lệnh <code>rm</code>.</span></div>
  <div class="kv"><span class="k"><code>\${var:-}</code></span><span class="v">Dưới <code>set -u</code>, tham chiếu tới một biến chưa đặt là lỗi chết người — mà bộ xử lý có thể chạy <em>TRƯỚC</em> khi những biến đó được gán, nếu script chết sớm. Dấu <code>:-</code> làm nó an toàn.</span></div>
  <div class="kv"><span class="k">Đừng bao giờ hỏng trong lúc dọn</span><span class="v">Chuyển hướng lỗi vào <code>/dev/null</code> và chấp nhận thất bại. Một bộ xử lý dọn dẹp mà tự nó báo lỗi dưới <code>set -e</code> sẽ che mất vấn đề gốc.</span></div>
</div>

<h3>trap ERR: báo chỗ nó vỡ</h3>
${slide('lx-07', 17, 'trap ERR chỉ vào được trong hàm khi có set -E')}
<pre><code>set -euo pipefail

on_error() {
  local rc=\$? line=\$1
  printf 'ERROR: dòng %s thoát với mã %s: %s\\n' \\
    "\$line" "\$rc" "\$BASH_COMMAND" &gt;&amp;2
}
trap 'on_error \$LINENO' ERR</code></pre>
<div class="out">ERROR: dòng 42 thoát với mã 22: curl -sSf https://api.example.com/data</div>
<p><code>ERR</code> kích hoạt mỗi khi một lệnh hỏng theo cách sẽ làm <code>set -e</code> ra tay. <code>\$BASH_COMMAND</code> giữ cái lệnh vừa chạy, và <code>\$LINENO</code> — được khai triển vào lúc trap kích hoạt vì phần thân nằm trong nháy <strong>ĐƠN</strong> — cho bạn số dòng. Khác biệt giữa một script chết trong im lặng và một script nói "dòng 42, curl, mã 22" nằm ở năm dòng này.</p>
<div class="callout">Dấu nháy đơn trong <code>trap '…' ERR</code> là quan trọng. Với nháy kép, <code>\$LINENO</code> được khai triển đúng một lần lúc dòng <code>trap</code> chạy, nên MỌI lỗi đều báo cùng một số dòng đó. Phần thân của bộ xử lý phải giữ nguyên chưa khai triển cho tới lúc nó kích hoạt.</div>

<h3>flock: chặn hai bản cùng chạy</h3>
${slide('lx-07', 18, 'flock: khoá nằm ở fd đang mở — kể cả của tiến trình con')}
<pre><code>#!/usr/bin/env bash
set -euo pipefail

readonly LOCKFILE=/var/lock/backup.lock
exec 9&gt;"\$LOCKFILE"                      <span class="tok-comment"># mở fd 9 lên nó (Bài 3.1)</span>
flock -n 9 || { echo "đang chạy rồi" &gt;&amp;2; exit 1; }

<span class="tok-comment"># … phần việc; khoá tự động được thả khi script thoát …</span></code></pre>
<div class="out">$ ./backup.sh &amp; ./backup.sh
đang chạy rồi</div>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-n</code></span><span class="v">Không chờ: hỏng ngay nếu khoá đang có người giữ. Đúng cho một công việc cron — bản thứ hai nên BỎ QUA, không nên xếp hàng sau bản đầu.</span></div>
  <div class="kv"><span class="k">không có <code>-n</code></span><span class="v">Chờ lấy khoá. Đúng khi phần việc BẮT BUỘC phải xảy ra, chỉ là không được chạy đồng thời.</span></div>
  <div class="kv"><span class="k"><code>-w 30</code></span><span class="v">Chờ, nhưng bỏ cuộc sau 30 giây.</span></div>
</div>
<div class="callout ok">Khoá được giữ bởi <strong>BỘ MÔ TẢ FILE ĐANG MỞ</strong>, không phải bởi sự tồn tại của cái file — nên nhân thả nó ra khi tiến trình chết, chết kiểu gì cũng thả, kể cả <code>kill -9</code> và mất điện. Đó là lý do <code>flock</code> đúng còn một cái khoá tự chế kiểu "tạo file PID, xoá nó ở cuối" thì không: kiểu sau để lại một cái khoá cũ mèm sau bất kỳ lần sập nào, và rồi công việc không bao giờ chạy nữa cho tới khi có người để ý.</div>
<pre><code><span class="tok-comment"># Dạng một dòng, lý tưởng cho một mục trong crontab (Chương 11)</span>
*/5 * * * * flock -n /var/lock/sync.lock /srv/app/sync.sh</code></pre>
<p>Một công việc cron chạy mỗi năm phút mà phần việc đôi khi mất sáu phút thì sẽ chồng chất bản này lên bản kia cho tới khi máy đổ. Đây là nguyên nhân phổ biến nhất của một máy chủ vốn ổn suốt nhiều tháng rồi chết lúc 4 giờ sáng, và cách phòng nó chỉ là một chữ.</p>

<h3>Tính bền vững khi chạy lại</h3>
${slide('lx-07', 19, 'Chạy hai lần không hỏng: kiểm rồi mới làm')}
<pre><code><span class="tok-comment"># Không bền — lần chạy thứ hai hỏng hoặc nhân đôi</span>
mkdir /srv/app/data
echo "PATH=/opt/bin:\$PATH" &gt;&gt; ~/.bashrc
useradd deploy

<span class="tok-comment"># Bền — lần chạy thứ hai chẳng làm gì cả</span>
mkdir -p /srv/app/data
grep -qxF 'PATH=/opt/bin:\$PATH' ~/.bashrc || echo 'PATH=/opt/bin:\$PATH' &gt;&gt; ~/.bashrc
id -u deploy &amp;&gt;/dev/null || useradd -r -s /usr/sbin/nologin deploy</code></pre>
<p>Script bị chạy lại: một lần deploy được thử lại, một công việc cron chồng lên nhau, có người không chắc lần đầu đã chạy được chưa. Một script an toàn khi chạy hai lần thì cứ việc chạy lại sau khi hỏng, và đó là khác biệt giữa một lần khôi phục năm giây và cả một cuộc điều tra. Khuôn mẫu <code>||</code> ở trên — kiểm trước, chỉ làm khi cần — biến gần như mọi thứ thành bền vững.</p>
<div class="callout warn">Ví dụ <code>&gt;&gt; ~/.bashrc</code> không phải chuyện giả định. Một script cài đặt chạy ba lần sẽ để lại ba bản của cùng một dòng <code>PATH</code>, mỗi bản lại thêm vào đầu một lần nữa, nên <code>PATH</code> phình ra ở mỗi lần mở shell. <code>grep -qxF</code> — im lặng, khớp nguyên dòng, chuỗi cố định — chính là cái chốt, và chữ <code>-F</code> quan trọng vì cái dòng đó có chứa <code>\$</code> và <code>/</code>, những thứ nếu không sẽ bị hiểu thành regex.</div>

<h3>Ghép lại với nhau</h3>
<pre><code>#!/usr/bin/env bash
set -euo pipefail
IFS=\$'\\n\\t'

readonly LOCKFILE=/var/lock/backup.lock
tmpdir=""

cleanup() {
  local rc=\$?
  [[ -n \$tmpdir ]] &amp;&amp; rm -rf "\$tmpdir"
  (( rc != 0 )) &amp;&amp; echo "sao lưu thất bại (\$rc)" &gt;&amp;2
  return \$rc
}
trap cleanup EXIT
trap 'echo "ERROR ở dòng \$LINENO: \$BASH_COMMAND" &gt;&amp;2' ERR

exec 9&gt;"\$LOCKFILE"
flock -n 9 || { echo "sao lưu đang chạy rồi" &gt;&amp;2; exit 0; }

tmpdir=\$(mktemp -d)
mkdir -p "/srv/backups/\$(date +%F)"      <span class="tok-comment"># tạo sẵn thư mục THEO NGÀY mà mv ghi vào (sửa 28/09/2026)</span>

pg_dump "\$DATABASE_URL" &gt; "\$tmpdir/db.sql"
tar -czf "\$tmpdir/files.tar.gz" -C /srv/app uploads
mv "\$tmpdir"/*.{sql,tar.gz} "/srv/backups/\$(date +%F)/"

find /srv/backups -mindepth 1 -maxdepth 1 -type d -mtime +30 -exec rm -rf {} +
echo "sao lưu hoàn tất"</code></pre>
<div class="out">$ ./backup.sh
sao lưu hoàn tất
$ ./backup.sh &amp; ./backup.sh
sao lưu đang chạy rồi</div>
<p>Để ý <code>exit 0</code> khi khoá đang có người giữ: với một công việc cron, "đã có bản khác đang chạy" KHÔNG phải một lỗi, và thoát khác 0 sẽ gửi cho bạn một email báo hỏng mỗi năm phút. Chọn đúng mã thoát cho tình huống "không có gì phải làm" là một phần của việc viết ra một script mà người ta không học được cách phớt lờ.</p>

<h3>Sáu cách một script chết — đo thật</h3>
<p>Sơ đồ ở đầu bài là một lời khẳng định; đây là phép đo. <code>tr.sh</code> tạo một thư mục bằng <code>mktemp -d</code>, đặt bẫy EXIT báo cáo rồi xoá nó, sau đó hoặc chạy xong, hoặc tự thoát, hoặc hỏng dưới <code>set -e</code>, hoặc ngủ để bị giết. Ctrl-C được giả lập đúng như terminal làm: gửi <code>SIGINT</code> tới cả nhóm tiến trình (<code>kill -INT -- -PGID</code>).</p>
<pre><code>#!/usr/bin/env bash
set -euo pipefail
tmpdir=\$(mktemp -d)
trap 'echo "EXIT chạy (mã \$?) — xoá \$tmpdir" &gt;&amp;2; rm -rf "\$tmpdir"' EXIT
case \${1:-} in
  het)   echo "làm xong" ;;
  exit1) exit 1 ;;
  loi)   false; echo "không tới đây" ;;
  cho)   sleep 30 ;;
esac</code></pre>
<table>
<tr><th>Kết thúc thế nào</th><th>Bẫy EXIT có chạy?</th><th>Mã thoát</th><th>Còn sót thư mục tạm?</th></tr>
<tr><td>chạy tới dòng cuối</td><td>có</td><td>0</td><td>không</td></tr>
<tr><td><code>exit 1</code></td><td>có</td><td>1</td><td>không</td></tr>
<tr><td><code>false</code> dưới <code>set -e</code></td><td>có</td><td>1</td><td>không</td></tr>
<tr><td>Ctrl-C (SIGINT tới cả nhóm)</td><td>có, sau 0,5 giây</td><td>130</td><td>không</td></tr>
<tr><td><code>kill</code> / <code>systemctl stop</code> (SIGTERM)</td><td>có, sau 0,5 giây</td><td>143</td><td>không — nhưng tiến trình con <code>sleep 30</code> vẫn chạy tiếp, mồ côi</td></tr>
<tr><td><code>kill -9</code> (SIGKILL)</td><td><strong>không</strong></td><td>137</td><td><strong>có, một thư mục</strong></td></tr>
</table>
<p>Ba điều đáng để ý. Thứ nhất, bẫy in ra <code>mã 0</code> trong hai ca bị tín hiệu dù script thoát với 130 và 143 — bên trong bẫy EXIT, <code>\$?</code> nói về lệnh vừa chạy, không nói về tín hiệu. Cần biết "tôi có bị giết không?" thì bẫy <code>INT</code> và <code>TERM</code> riêng. Thứ hai, SIGTERM giết bash nhưng không giết cái <code>sleep</code> nó đang chờ: script nào khởi động tiến trình con chạy lâu thì phải giết chúng trong cleanup (<code>kill 0</code> hoặc một <code>\$!</code> đã lưu). Thứ ba, chính bộ đo suýt nói dối: một job nền khởi động từ shell <em>không tương tác</em> bỏ qua SIGINT, nên lần thử đầu cho ra "mã 0 sau 30 giây". Chỉ khi bật điều khiển job (<code>set -m</code>) con số mới khớp với một cú Ctrl-C thật.</p>

<h3>Bẫy INT phải kết thúc bằng exit</h3>
<p>Bẫy <code>INT</code> thay thế phản ứng mặc định của bash ("chết"). Nếu bộ xử lý không exit, script <em>CHẠY TIẾP</em> sau Ctrl-C — lệnh đang chạy chết, dòng kế tiếp vẫn chạy. Đo bằng hai script chỉ khác nhau một từ:</p>
<pre><code>trap 'echo "INT: đã bắt Ctrl-C" &gt;&amp;2' INT              <span class="tok-comment"># int.sh  — không exit</span>
trap 'echo "INT: đã bắt Ctrl-C, thoát 130" &gt;&amp;2; exit 130' INT   <span class="tok-comment"># int2.sh — có exit</span>
trap 'echo "EXIT: dọn dẹp" &gt;&amp;2' EXIT
sleep 30
echo "SAU sleep: script vẫn chạy tiếp!"</code></pre>
<div class="out">== int.sh
SAU sleep: script vẫn chạy tiếp!
INT: đã bắt Ctrl-C
EXIT: dọn dẹp
   mã thoát: 0
== int2.sh
INT: đã bắt Ctrl-C, thoát 130
EXIT: dọn dẹp
   mã thoát: 130</div>
<p>(Dòng "SAU sleep" hiện trước dòng INT chỉ vì stdout và stderr được đẩy ra riêng rẽ.) Không có exit thì người dùng nhấn Ctrl-C, script vẫn đi tiếp sang bước sau và kết thúc với mã 0 — kết cục tệ nhất có thể cho một script deploy. Quy tắc: nếu đã bẫy <code>INT</code> hay <code>TERM</code> thì kết thúc bộ xử lý bằng <code>exit 130</code> / <code>exit 143</code>; nếu chỉ cần dọn dẹp thì chỉ bẫy <code>EXIT</code> và để các tín hiệu ở mặc định.</p>

<h3>trap ERR câm trong hàm nếu thiếu <code>set -E</code></h3>
<p>Bẫy ERR trong bài chạy được ở cấp ngoài cùng. Phần lớn script thật (Bài 7.5) chạy mọi thứ bên trong <code>main()</code>, mà tài liệu bash nói rõ: bẫy ERR <em>KHÔNG</em> được hàm, phép thay thế lệnh hay shell con thừa hưởng, trừ khi bật <code>errtrace</code>. Cùng một script, chạy hai lần — lỗi là một lệnh <code>curl</code> nằm trong hàm:</p>
<pre><code>#!/usr/bin/env bash
set -\${CO:-e}uo pipefail
trap 'echo "ERR: dòng \$LINENO, mã \$?: \$BASH_COMMAND" &gt;&amp;2' ERR
tai_ve() {
  curl -sSf --max-time 3 "http://127.0.0.1:19070/khong-co"
}
main() {
  echo "bắt đầu"
  tai_ve
  echo "xong"
}
main "\$@"</code></pre>
<div class="out">$ ./err.sh; echo "mã=\$?"                <span class="tok-comment"># set -euo pipefail</span>
bắt đầu
curl: (7) Failed to connect to 127.0.0.1 port 19070 after 1 ms: Couldn't connect to server
mã=7
$ CO=Ee ./err.sh; echo "mã=\$?"         <span class="tok-comment"># set -Eeuo pipefail</span>
bắt đầu
curl: (7) Failed to connect to 127.0.0.1 port 19070 after 0 ms: Couldn't connect to server
ERR: dòng 5, mã 7: curl -sSf --max-time 3 "http://127.0.0.1:19070/khong-co"
mã=7</div>
<p>Không có <code>-E</code>, script chết mà không để lại dấu vết nào về chỗ hỏng. Có nó, bẫy gọi tên dòng 5 và đúng câu lệnh. Chỉ một chữ cái đó là lý do bộ khung ở Bài 7.1 viết <code>set -Eeuo pipefail</code>. Một tác dụng phụ cần biết: có <code>-E</code> thì bẫy ERR cũng nổ bên trong <code>cleanup</code> nếu cleanup trả về khác 0, nên hãy mở đầu <code>cleanup</code> bằng <code>trap - ERR</code> (Bài 7.5 cho thấy khác biệt đo được).</p>

<h3>trap và mktemp: những cờ bạn sẽ dùng</h3>
<table>
<tr><th>Lệnh</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>trap 'cmd' EXIT</code></td><td>chạy <code>cmd</code> khi shell thoát, vì bất kỳ lý do gì trừ SIGKILL</td><td><code>trap cleanup EXIT</code></td></tr>
<tr><td><code>trap 'cmd' ERR</code></td><td>chạy <code>cmd</code> khi một lệnh hỏng theo kiểu -e nhận ra</td><td>kèm <code>set -E</code> để vào trong hàm</td></tr>
<tr><td><code>trap 'cmd' INT TERM</code></td><td>thay phản ứng "chết" mặc định với Ctrl-C / SIGTERM — phải <code>exit</code></td><td><code>trap '…; exit 130' INT</code></td></tr>
<tr><td><code>trap -p</code></td><td>liệt kê các bẫy đang đặt</td><td><code>trap -- 'echo bye' EXIT</code></td></tr>
<tr><td><code>trap - EXIT</code></td><td>gỡ một bẫy (về mặc định)</td><td>trong cleanup: <code>trap - ERR</code></td></tr>
<tr><td><code>trap -l</code> / <code>kill -l</code></td><td>liệt kê tên và số của các tín hiệu</td><td><code>2) SIGINT … 9) SIGKILL</code></td></tr>
<tr><td><code>mktemp</code> · <code>mktemp -d</code></td><td>file mới (quyền 600) · thư mục mới (quyền 700)</td><td><code>/tmp/tmp.hfamqMRWWR</code></td></tr>
<tr><td><code>mktemp -t deploy.XXXXXX</code></td><td>GNU: theo mẫu, trong <code>\$TMPDIR</code> hoặc /tmp</td><td><code>/tmp/deploy.7cdXsE</code></td></tr>
<tr><td><code>mktemp -p DIR</code></td><td>tạo bên trong DIR</td><td><code>/home/an/tmp.0Z2HEjiUVW</code></td></tr>
</table>
<p>Output thật trong container: <code>ls -ld</code> trên một file và một thư mục vừa tạo bằng <code>mktemp</code> cho <code>-rw-------</code> và <code>drwx------</code>, còn mẫu thiếu chữ X thì bị từ chối — <code>mktemp /tmp/sai</code> → <code>mktemp: too few X's in template '/tmp/sai'</code>.</p>

<h3>flock: khoá thuộc về file đang mở — kể cả của tiến trình con</h3>
<p>Bài nói khoá được nhả "khi tiến trình chết, dù chết kiểu gì". Chính xác hơn: khi <strong>MỌI</strong> bộ mô tả file (file descriptor) trỏ tới file khoá đang mở đều đã đóng. Tiến trình con thừa hưởng bộ mô tả file, nên một tiến trình con có thể giữ khoá tiếp sau khi cha đã chết. Đo bằng <code>khoa.sh</code> (lấy khoá trên fd 9, rồi <code>sleep 2</code>):</p>
<pre><code>./khoa.sh &amp; sleep 0.3; ./khoa.sh           <span class="tok-comment"># hai bản cùng lúc</span>
./khoa.sh &amp; sleep 0.3; kill -9 \$!; ./khoa.sh   <span class="tok-comment"># kill -9 bản đầu, thử lại</span></code></pre>
<div class="out">[3205] giữ khoá, làm việc 2 giây
[3209] đang có bản khác chạy — bỏ qua
[3205] xong
[3222] giữ khoá, làm việc 2 giây
[3228] đang có bản khác chạy — bỏ qua</div>
<p>Bash 3222 đã chết mà 3228 vẫn bị từ chối: <code>ps</code> cho thấy tiến trình con <code>sleep 2</code> (PID 3225) còn sống và giữ fd 9. Hai giây sau, khi <code>sleep</code> kết thúc, khoá được nhả. Thường thì đó đúng là điều bạn muốn (phần việc vẫn đang chạy), nhưng nó giải thích câu đố "tôi đã giết script mà khoá vẫn bị giữ". Bản thân file khoá rỗng và nằm trên đĩa mãi cũng được — nó chỉ là một cái tên để khoá. Chương 13 đi xa hơn (chờ với <code>-w</code>, khoá dùng chung, khoá trong unit systemd).</p>

<h3>Chạy lại chính script của bài này thì lộ ra gì</h3>
<p>Script "Ghép lại với nhau" ở trên đã được chạy thật trong container (với một <code>pg_dump</code> giả). Bản gốc hỏng ngay lần chạy đầu:</p>
<div class="out">mv: target '/srv/backups/2026-09-28/': No such file or directory
ERROR at line 25: mv "\$tmpdir"/*.{sql,tar.gz} "/srv/backups/\$(date +%F)/"
backup failed (1)</div>
<p>Nó tạo <code>/srv/backups</code> nhưng không bao giờ tạo thư mục theo ngày mà <code>mv</code> ghi vào. Đoạn mã ở trên giờ đã được sửa (<code>mkdir -p "/srv/backups/\$(date +%F)"</code>), và lệnh <code>find</code> được thêm <code>-mindepth 1 -maxdepth 1</code> để nó chỉ có thể xoá các thư mục con theo ngày, không bao giờ xoá chính <code>/srv/backups</code> hay thứ gì lồng bên trong bản sao lưu hôm nay. Sau khi sửa: <code>backup complete</code>, và một bản thứ hai khởi động lúc bản đầu đang giữ khoá in <code>backup already running</code> với mã 0. Bài học cho script của chính bạn: một script mới chỉ ĐỌC là một script chưa được kiểm.</p>

<h3>Chạy thử từng bước</h3>
<p>Trong một container <code>ubuntu:24.04</code> (hoặc <code>~/thu-linux/ch7</code>), lưu <code>tr.sh</code> ở mục "Sáu cách một script chết" và cho nó quyền chạy. Rồi:</p>
<pre><code>./tr.sh het;   echo "mã=\$?"            <span class="tok-comment"># kết thúc bình thường</span>
./tr.sh loi;   echo "mã=\$?"            <span class="tok-comment"># set -e dừng</span>
./tr.sh cho                             <span class="tok-comment"># nhấn Ctrl-C sau một giây</span>
echo "mã=\$?"
ls -d /tmp/tmp.* 2&gt;/dev/null | wc -l    <span class="tok-comment"># còn sót bao nhiêu thư mục tạm?</span></code></pre>
<div class="out">làm xong
EXIT chạy (mã 0) — xoá /tmp/tmp.oJzH0aQMGg
mã=0
EXIT chạy (mã 1) — xoá /tmp/tmp.OcPVbtESQ4
mã=1
EXIT chạy (mã 0) — xoá /tmp/tmp.lLpmWI3ZiN
mã=130
0</div>
<p>Đường nào cũng chạy bẫy và con số cuối là 0. (Ghi trong container, Ctrl-C gửi bằng <code>kill -INT</code> tới cả nhóm tiến trình; tên ngẫu nhiên sẽ khác, và trên terminal thật bạn sẽ thấy thêm <code>^C</code>.) Giờ mở terminal thứ hai, chạy <code>./tr.sh cho</code> ở terminal đầu và <code>kill -9</code> PID của nó từ terminal thứ hai: con số thành 1 — đúng một ca không bẫy nào đỡ được.</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ trong bài</th><th>Ubuntu / WSL2</th><th>macOS 27 (đã thử)</th></tr>
<tr><td><code>trap … EXIT/ERR/INT</code>, <code>set -E</code></td><td>bash 5.2</td><td>y hệt trên bash 3.2</td></tr>
<tr><td><code>mktemp</code></td><td><code>/tmp/tmp.XXXXXXXXXX</code></td><td><code>\$TMPDIR/tmp.XXXXXXXXXX</code>, ví dụ <code>/var/folders/…/T/tmp.k1yZayjAhk</code></td></tr>
<tr><td><code>mktemp -t deploy.XXXXXX</code></td><td><code>/tmp/deploy.7cdXsE</code></td><td>coi tham số là TIỀN TỐ: <code>…/T/deploy.XXXXXX.r1Borxn1Pc</code></td></tr>
<tr><td><code>mktemp -t deploy</code></td><td><code>too few X's in template 'deploy'</code></td><td><code>…/T/deploy.Y9g8MaxW1R</code></td></tr>
<tr><td>dạng chạy được cả hai nơi</td><td colspan="2"><code>mktemp "\${TMPDIR:-/tmp}/deploy.XXXXXX"</code> — đã thử trên cả hai</td></tr>
<tr><td><code>flock</code></td><td>util-linux, có sẵn</td><td><code>flock not found</code> — kiểm logic khoá trong container</td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> <code>/tmp</code> trên VPS của nhóm cứ đầy dần các thư mục <code>tmp.*</code>, và đã hai lần bản sao lưu đêm chạy hai bản cùng lúc. Sửa cả hai trong một container <code>ubuntu:24.04</code>.</p><ol>
<li>Viết <code>nightly.sh</code> có <code>set -Eeuo pipefail</code>: tạo thư mục tạm bằng <code>mktemp -d</code>, ghi một file 50 MB vào đó (<code>head -c 50M /dev/zero</code>), ngủ 20 giây, rồi chuyển nó sang <code>/srv/backups/\$(date +%F)/</code>.</li>
<li>Thêm hàm <code>cleanup</code> (bắt <code>\$?</code> trước tiên, dùng <code>\${tmpdir:-}</code>) và <code>trap cleanup EXIT</code> ngay dòng sau <code>mktemp</code>.</li>
<li>Thêm <code>exec 9&gt;/run/lock/nightly.lock</code> + <code>flock -n 9 || exit 0</code>.</li>
<li>Kiểm: chạy bình thường; Ctrl-C lúc đang ngủ; hai bản cùng lúc; chạy bình thường lần thứ hai (bền khi chạy lại).</li></ol>
<p><strong>Đạt khi:</strong> <code>ls -d /tmp/tmp.* | wc -l</code> bằng 0 sau phép thử Ctrl-C; bản chạy song song thứ hai thoát mã 0 kèm lời nhắn; lần chạy bình thường thứ hai thành công không báo "File exists"; và Ctrl-C cho mã thoát 130.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Trap (bẫy)</span><span class="v">Lệnh bash chạy khi một tín hiệu hoặc tín hiệu giả (EXIT, ERR) xảy ra.</span></div>
  <div class="kv"><span class="k">EXIT (tín hiệu giả khi thoát)</span><span class="v">Nổ mỗi khi shell kết thúc, vì bất kỳ lý do gì — trừ SIGKILL.</span></div>
  <div class="kv"><span class="k">SIGINT / SIGTERM / SIGKILL</span><span class="v">Ctrl-C (2) / lời "xin dừng" lịch sự (15) / cú giết không bắt được (9); mã thoát 130 / 143 / 137.</span></div>
  <div class="kv"><span class="k">errtrace <code>set -E</code> (lần vết lỗi)</span><span class="v">Cho bẫy ERR nổ bên trong hàm và <code>\$( )</code>.</span></div>
  <div class="kv"><span class="k">mktemp (tạo file tạm an toàn)</span><span class="v">Tạo file/thư mục tạm một cách nguyên tử, tên không đoán được, quyền riêng tư.</span></div>
  <div class="kv"><span class="k">Symlink attack (tấn công liên kết, CWE-377)</span><span class="v">Tạo sẵn một đường dẫn tạm đoán được thành liên kết để script của bạn ghi đè đích của người khác.</span></div>
  <div class="kv"><span class="k">flock (khoá file)</span><span class="v">Khoá của nhân giữ qua một bộ mô tả file đang mở; nhả khi mọi nơi giữ nó đều đóng.</span></div>
  <div class="kv"><span class="k">Idempotent (bền khi chạy lại)</span><span class="v">Chạy lại an toàn: lần thứ hai không đổi gì và không hỏng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Tạo xong là đặt bẫy ngay dòng sau: <code>tmpdir=\$(mktemp -d)</code> + <code>trap cleanup EXIT</code>.</li>
<li>EXIT chạy khi kết thúc bình thường, <code>exit</code>, <code>set -e</code>, Ctrl-C (130) và SIGTERM (143) — đã đo; chỉ <code>kill -9</code> (137) bỏ qua nó.</li>
<li>Bẫy INT/TERM phải kết thúc bằng <code>exit</code>, nếu không script chạy tiếp sau Ctrl-C.</li>
<li>Thiếu <code>set -E</code> thì <code>trap … ERR</code> không bao giờ nổ trong hàm — tức là không bao giờ, với một script xây quanh <code>main()</code>.</li>
<li><code>flock -n</code> trên một fd chặn việc chạy chồng; khoá còn cho tới khi mọi tiến trình giữ fd đó (cả tiến trình con) đều đi hết.</li>
<li>Viết mọi bước sao cho lần chạy thứ hai là vô hại: <code>mkdir -p</code>, <code>grep -qxF … ||</code>, <code>id -u … ||</code>, <code>ln -sfn</code>.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Bourne-Shell-Builtins.html#index-trap" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — trap</span><span class="lc-sub">Ngữ nghĩa đầy đủ, gồm các tín hiệu giả EXIT, ERR, DEBUG và RETURN cùng cách trap tương tác với hàm và shell con.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/flock.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">🔒</span>
  <span class="lc-body"><span class="lc-title">flock(1) — khoá file từ shell</span><span class="lc-sub">Cả dạng bọc lẫn dạng dùng fd, kèm ngữ nghĩa thả khoá chính xác. Mục EXAMPLES là một cái chốt cho cron dùng được ngay.</span></span>
</a>
<a class="link-card" href="https://cwe.mitre.org/data/definitions/377.html" target="_blank" rel="noopener">
  <span class="lc-ico">⚠️</span>
  <span class="lc-body"><span class="lc-title">CWE-377 — Insecure Temporary File</span><span class="lc-sub">Mô tả chính thức về cuộc tấn công qua symlink mà <code>mktemp</code> ngăn chặn, kèm ví dụ thật. Ngắn, và nó làm cái luật đó dính vào đầu.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: tự dọn dẹp sau mình</span><span class="lc-sub">Bài chấm điểm: thêm một trap EXIT sống sót qua Ctrl-C, thay một đường dẫn tạm tự dựng bằng <code>mktemp</code>, thêm một chốt <code>flock</code>, và làm một script cài đặt trở nên bền vững khi chạy lại.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> đăng ký trap trước khi tạo ra thứ mà nó dọn, hoặc sau đó. Cả hai đều hỏng. Viết <code>trap 'rm -rf "\$tmpdir"' EXIT</code> ở <em>TRƯỚC</em> dòng <code>tmpdir=\$(mktemp -d)</code> thì nó chạy <code>rm -rf ""</code> nếu script chết ở khoảng giữa — vô hại, nhưng cũng nghĩa là một lần hỏng sớm sẽ để lại cái thư mục. Viết ở vài dòng <em>SAU</em> lệnh <code>mktemp</code> thì mọi thất bại trong khoảng trống đó sẽ rò rỉ thư mục vĩnh viễn. Hãy TẠO, rồi TRAP, ở đúng dòng ngay kế tiếp — và bên trong bộ xử lý thì luôn chốt bằng <code>\${tmpdir:-}</code> để <code>set -u</code> không biến việc dọn dẹp của bạn thành một lỗi thứ hai.</div>
<p class="note-ct"><strong>Ba dòng thuộc về phần lớn script production:</strong> <code>tmpdir=\$(mktemp -d)</code> rồi ngay lập tức <code>trap 'rm -rf "\$tmpdir"' EXIT</code>, và <code>flock -n 9</code> cho mọi thứ mà cron với tới được. Chúng chẳng tốn gì, chúng vô hình khi mọi thứ chạy tốt, và mỗi cái ngăn được một kiểu hỏng chỉ lộ ra sau nhiều tuần — một cái đĩa đầy, hay hai bản sao lưu cùng ghi vào một file.</p>
</div>
`,
    },
    /* ─────────────────────────── 7.4 ─────────────────────────── */
    {
      title: '7.4 — Debugging a script without scattering echo|||7.4 — Gỡ lỗi một script mà không phải rắc echo khắp nơi',
      slug: 'lnx-7-4-go-loi-script',
      type: 'LESSON',
      description: 'set -x và PS4 để thấy đúng lệnh đang chạy, bash -n kiểm cú pháp mà không chạy, ShellCheck, bật gỡ lỗi cho một đoạn, ghi log có mức, và bốn kiểu hỏng thường gặp cùng cách bắt chúng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.4</span>
<h2>Debugging without scattering echo</h2>
<p class="lead">The instinct when a script misbehaves is to add <code>echo</code> lines, run it, add more, and remove them all afterwards — usually missing one. Bash has better tools: it can print every command it runs, with variables already expanded, showing exactly what the shell built rather than what you wrote.</p>

<h3>set -x: trace execution</h3>
${slide('lx-07', 20, 'set -x in lệnh SAU khai triển; PS4 thêm file:dòng:hàm')}
<pre><code>#!/usr/bin/env bash
set -x                      <span class="tok-comment"># trace from here on</span>
name="Binh"
greet="Hello, \$name"
echo "\$greet"
set +x                      <span class="tok-comment"># stop tracing</span></code></pre>
<div class="out">+ name=Binh
+ greet='Hello, Binh'
+ echo 'Hello, Binh'
Hello, Binh
+ set +x</div>
<p>Every traced line goes to <strong>stderr</strong> prefixed with <code>+</code>, and — this is the point — variables are shown <em>after</em> expansion. You see <code>Hello, Binh</code>, not <code>Hello, \$name</code>. Almost every shell bug is a difference between what you thought a line would expand to and what it did, and <code>set -x</code> shows the difference directly.</p>
<pre><code>bash -x ./deploy.sh staging       <span class="tok-comment"># trace without editing the file</span>
./deploy.sh 2&gt; trace.log           <span class="tok-comment"># trace goes to stderr — capture it separately</span></code></pre>

<h3>PS4: make the trace readable</h3>
<pre><code>export PS4='+ \${BASH_SOURCE##*/}:\${LINENO}:\${FUNCNAME[0]:-main}: '
set -x
deploy staging</code></pre>
<div class="out">+ deploy.sh:41:main: deploy staging
+ deploy.sh:22:deploy: local env=staging
+ deploy.sh:24:deploy: [[ -f .env.staging ]]
+ deploy.sh:27:deploy: docker build -t myapp:latest .</div>
<p>The default <code>PS4</code> is just <code>+ </code>, which tells you nothing about <em>where</em>. Adding file, line and function turns a wall of traced commands into something you can navigate — especially in a script with functions, where the plain trace gives no clue which one you are inside. Put that <code>PS4</code> line in your <code>~/.bashrc</code> and every <code>bash -x</code> you ever run gets better.</p>
<div class="callout ok">Add <code>+\$(date +%s.%N)</code> to <code>PS4</code> and the trace becomes a crude profiler — the timestamps show which command consumed the wall-clock time. It is not <code>perf</code>, but for "why does this deploy script take four minutes" it usually answers the question in one run.</div>

<h3>Tracing just the interesting part</h3>
<pre><code><span class="tok-comment"># Around a suspect section</span>
set -x
problematic_function "\$arg"
set +x

<span class="tok-comment"># Toggle from the environment, no editing</span>
[[ \${DEBUG:-0} == 1 ]] &amp;&amp; set -x

<span class="tok-comment"># Inside one function only — restores the previous state on return</span>
process() {
  local -; set -x            <span class="tok-comment"># "local -" scopes shell options to this function</span>
  <span class="tok-comment"># … traced …</span>
}</code></pre>
<div class="out">$ DEBUG=1 ./deploy.sh staging</div>
<p><code>local -</code> is obscure and genuinely useful: it makes shell options local to the function, so <code>set -x</code> inside turns itself off automatically when the function returns. No <code>set +x</code> to forget.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · shellcheck</span><span class="lz-lnote">Finds whole classes of bug without running anything — unquoted variables, masked return values, parsing <code>ls</code>. One second, no side effects. Always first.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · bash -n</span><span class="lz-lnote">Syntax only. Catches a missing <code>fi</code> or an unterminated heredoc before execution can reach it and change something.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · bash -x with a good PS4</span><span class="lz-lnote">Shows every command <em>after</em> expansion, with file, line and function. This is where "I thought that variable held X" becomes visible.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · trap ERR</span><span class="lz-lnote">For a script that dies silently: names the line and the exact command that failed.</span></div>
  <div class="lz-layer"><span class="lz-lname">5 · env -i</span><span class="lz-lnote">For "works by hand, fails in cron": start from an empty environment and add back only what you name.</span></div>
  <div class="lz-layer"><span class="lz-lname">Last · echo</span><span class="lz-lnote">Adding print statements. Useful, but everything above finds the bug faster and leaves nothing to clean up.</span></div>
</div>
<h3>Checking before running</h3>
${slide('lx-07', 21, 'Năm bậc gỡ lỗi trước khi rắc echo')}
<pre><code>bash -n script.sh          <span class="tok-comment"># syntax check ONLY — does not execute anything</span>
bash -v script.sh          <span class="tok-comment"># print each line as read, before expansion</span>
bash -uxn script.sh        <span class="tok-comment"># combine flags</span></code></pre>
<div class="out">script.sh: line 47: syntax error: unexpected end of file</div>
<div class="callout warn"><code>bash -n</code> catches unbalanced quotes, a missing <code>fi</code> or <code>done</code>, and an unterminated heredoc — the errors that would otherwise appear only when execution reaches them, which in a deploy script may be after it has already changed something. Run it as a pre-commit check; it takes milliseconds and it is the shell equivalent of <code>tsc --noEmit</code>.</div>

<h3>ShellCheck: the tool that finds the bugs you cannot see</h3>
${slide('lx-07', 22, 'ShellCheck đọc ra những lỗi mắt không thấy')}
<pre><code>shellcheck deploy.sh
shellcheck -S warning deploy.sh      <span class="tok-comment"># only warnings and errors</span>
shellcheck -x deploy.sh              <span class="tok-comment"># follow 'source'd files</span></code></pre>
<div class="out">In deploy.sh line 14:
rm -rf \$tmpdir/*
       ^-------^ SC2086: Double quote to prevent globbing and word splitting.

In deploy.sh line 22:
local out=\$(risky-command)
      ^-- SC2155: Declare and assign separately to avoid masking return values.

In deploy.sh line 31:
for f in \$(ls *.log); do
         ^---------^ SC2045: Iterating over ls output is fragile. Use globs.</div>
<p>Those three findings are Lessons 6.2, 6.1 and 6.5 respectively — the exact traps this course spent a chapter on, found automatically in under a second. Every warning has a wiki page explaining the failure with a reproduction, so it teaches rather than just complains.</p>
<pre><code><span class="tok-comment"># Install it</span>
sudo apt install shellcheck

<span class="tok-comment"># In CI — fail the build on any finding</span>
shellcheck scripts/*.sh

<span class="tok-comment"># Silence one specific finding, with a reason, on the next line only</span>
<span class="tok-comment"># shellcheck disable=SC2086  # word splitting is intended here</span>
command \$args</code></pre>
<div class="callout ok"><strong>Run ShellCheck on every script you write.</strong> It catches the unquoted-variable class of bug reliably, which is the one that only fails on unusual input and therefore survives testing. When you do disable a rule, put the reason in the comment — a bare <code>disable=</code> line is indistinguishable from silencing something you did not understand.</div>

<h3>Logging with levels</h3>
<pre><code>readonly LOG_LEVEL=\${LOG_LEVEL:-info}

_log() {
  local level=\$1; shift
  local -A rank=([debug]=0 [info]=1 [warn]=2 [error]=3)
  (( rank[\$level] &lt; rank[\$LOG_LEVEL] )) &amp;&amp; return 0
  printf '%s [%s] %s\\n' "\$(date +%FT%T)" "\${level^^}" "\$*" &gt;&amp;2
}
debug() { _log debug "\$@"; }
info()  { _log info  "\$@"; }
warn()  { _log warn  "\$@"; }
error() { _log error "\$@"; }

info "starting deploy"
debug "using tag \$tag"
warn "no health check configured"</code></pre>
<div class="out">$ ./deploy.sh
2026-08-22T14:51:03 [INFO] starting deploy
2026-08-22T14:51:03 [WARN] no health check configured
$ LOG_LEVEL=debug ./deploy.sh
2026-08-22T14:51:09 [INFO] starting deploy
2026-08-22T14:51:09 [DEBUG] using tag v1.4
2026-08-22T14:51:09 [WARN] no health check configured</div>
<p>Twelve lines, and you can leave diagnostic output in the script permanently instead of adding and removing it. Everything goes to stderr, so the script stays composable, and the timestamps mean a log from last week is still readable.</p>

<h3>Four failure modes and how to catch each</h3>
${slide('lx-07', 23, 'Tay chạy được, cron hỏng: env -i tái hiện môi trường trống')}
<div class="kv-grid">
  <div class="kv"><span class="k">"It does nothing"</span><span class="v">Usually an unmatched glob or an empty variable. <code>set -x</code> shows the command with an empty argument, or with a literal <code>*.log</code> — both invisible in the source.</span></div>
  <div class="kv"><span class="k">"It works interactively, fails in cron"</span><span class="v">A different environment: <code>PATH</code>, no <code>HOME</code>, no TTY, a different working directory. Compare <code>env</code> in both, and use absolute paths. Chapter 11 covers this properly.</span></div>
  <div class="kv"><span class="k">"It fails only sometimes"</span><span class="v">A race, or input-dependent quoting. Test with a hostile fixture: <code>touch 'a b.txt' '-rf' '*'</code> and run it again.</span></div>
  <div class="kv"><span class="k">"It exits with no message"</span><span class="v"><code>set -e</code> plus a command that failed quietly. Add <code>trap 'echo "line \$LINENO: \$BASH_COMMAND"' ERR</code> from Lesson 7.3 and it names the line.</span></div>
</div>
<pre><code><span class="tok-comment"># Reproduce cron's environment as closely as possible</span>
env -i HOME="\$HOME" PATH=/usr/bin:/bin bash -x ./script.sh</code></pre>
<p><code>env -i</code> starts with an <em>empty</em> environment and adds back only what you name. If the script works normally but fails under that command, the cause is an environment variable you did not know you depended on — which is exactly the difference between your shell and cron's.</p>

<h3>Testing a script</h3>
<pre><code><span class="tok-comment"># bats — a test framework for bash</span>
sudo apt install bats

<span class="tok-comment"># test/deploy.bats</span>
@test "rejects an unknown environment" {
  run ./deploy.sh nonsense
  [ "\$status" -eq 2 ]
  [[ "\$output" == *"unknown environment"* ]]
}

@test "dry run changes nothing" {
  run ./deploy.sh --dry-run staging
  [ "\$status" -eq 0 ]
  [[ "\$output" == *"[dry-run]"* ]]
}</code></pre>
<div class="out">$ bats test/
 ✓ rejects an unknown environment
 ✓ dry run changes nothing

2 tests, 0 failures</div>
<p>The validation and dry-run work from Lesson 7.2 is what makes a script testable at all: guard clauses give you predictable exit codes to assert on, and <code>--dry-run</code> lets a test exercise the whole flow without touching production. Even two tests are worth having on a script that deploys something.</p>

<h3>Reading a trace line by line</h3>
<p>The traces in this lesson were short. Here is a real one from a nine-line script, first with the default <code>PS4</code>, then with the file:line:function version — so you can see what each piece buys you.</p>
<pre><code>#!/usr/bin/env bash
set -euo pipefail
deploy() {
  local env=\$1
  local tag=\${TAG:-latest}
  [[ -f ".env.\$env" ]] || { echo "thiếu .env.\$env" &gt;&amp;2; return 1; }
  echo "deploy myapp:\$tag lên \$env"
}
deploy "\$@"</code></pre>
<div class="out">$ bash -x dbg.sh staging
+ set -euo pipefail
+ deploy staging
+ local env=staging
+ local tag=latest
+ [[ -f .env.staging ]]
+ echo 'deploy myapp:latest lên staging'
deploy myapp:latest lên staging
$ PS4='+ \${BASH_SOURCE##*/}:\${LINENO}:\${FUNCNAME[0]:-main}: ' bash -x dbg.sh production
+ dbg.sh:2:main: set -euo pipefail
+ dbg.sh:9:main: deploy production
+ dbg.sh:4:deploy: local env=production
+ dbg.sh:5:deploy: local tag=latest
+ dbg.sh:6:deploy: [[ -f .env.production ]]
+ dbg.sh:6:deploy: echo 'thiếu .env.production'
thiếu .env.production
+ dbg.sh:6:deploy: return 1</div>
<p>How to read it: lines starting with <code>+</code> are the trace (on stderr); the others are the script's own output. <code>local tag=latest</code> shows that <code>\${TAG:-latest}</code> fell back to its default, i.e. <code>TAG</code> was not set — a fact the source cannot tell you. <code>[[ -f .env.production ]]</code> with no <code>+</code> line after it for <code>echo "deploy…"</code> means the test failed, and the <code>return 1</code> on line 6 is where the script ended. With the plain <code>+</code> you know <em>what</em> ran; with PS4 you also know <em>where</em>.</p>

<h3>Tracing and checking flags</h3>
<table>
<tr><th>Flag / form</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>bash -x f.sh</code> · <code>set -x</code> / <code>set +x</code></td><td>trace every command after expansion, to stderr · on / off inside the script</td><td><code>bash -x deploy.sh 2&gt; trace.log</code></td></tr>
<tr><td><code>bash -n f.sh</code></td><td>parse only, run nothing</td><td>pre-commit syntax check</td></tr>
<tr><td><code>bash -v f.sh</code></td><td>print each line as READ, before expansion</td><td>see heredocs and comments too</td></tr>
<tr><td><code>PS4='…'</code></td><td>the prefix of every trace line; expanded each time</td><td><code>'+ \${BASH_SOURCE##*/}:\${LINENO}: '</code></td></tr>
<tr><td><code>[[ \${DEBUG:-0} == 1 ]] &amp;&amp; set -x</code></td><td>trace only when asked</td><td><code>DEBUG=1 ./deploy.sh</code></td></tr>
<tr><td><code>local -</code></td><td>make <code>set</code> changes local to one function (bash 4.4+)</td><td><code>f() { local -; set -x; …; }</code></td></tr>
<tr><td><code>env -i VAR=… cmd</code></td><td>run with an empty environment plus what you name</td><td><code>env -i PATH=/usr/bin:/bin ./f.sh</code></td></tr>
</table>

<h3>bash -n: the error is often above the line it names</h3>
<pre><code>$ cat -n n.sh
     1  #!/usr/bin/env bash
     2  if [[ -n "\$1" ]]; then
     3    echo "co tham so"
     4  for f in *.log; do
     5    echo "\$f"
     6  done
$ bash -n n.sh; echo "exit=\$?"</code></pre>
<div class="out">n.sh: line 7: syntax error: unexpected end of file
exit=2</div>
<p>The file has six lines, and bash complains about line 7: it reached the end of the file still waiting for the <code>fi</code> that should have closed the <code>if</code> on line 2 (after line 3). "unexpected end of file" always means "something opened above was never closed" — <code>fi</code>, <code>done</code>, <code>esac</code>, <code>}</code>, a quote, or a heredoc's closing word. Search upwards from the end, and let your editor's bracket matching help.</p>

<h3>ShellCheck, run for real</h3>
<p>A small script with five classic bugs, checked with ShellCheck 0.9.0 (the version in Ubuntu 24.04):</p>
<pre><code>#!/usr/bin/env bash
tmpdir=/tmp/build
rm -rf \$tmpdir/*
process() {
  local out=\$(curl -s "\$1")
  echo "\$out"
}
for f in \$(ls *.log); do
  echo "\$f"
done
cd /srv/app
if [ \$count &gt; 5 ]; then echo nhieu; fi</code></pre>
<div class="out">In sc.sh line 3:
rm -rf \$tmpdir/*
       ^-------^ SC2115 (warning): Use "\${var:?}" to ensure this never expands to /* .

In sc.sh line 5:
  local out=\$(curl -s "\$1")
        ^-^ SC2155 (warning): Declare and assign separately to avoid masking return values.

In sc.sh line 8:
for f in \$(ls *.log); do
         ^---------^ SC2045 (error): Iterating over ls output is fragile. Use globs.
              ^-- SC2035 (info): Use ./*glob* or -- *glob* so names with dashes won't become options.

In sc.sh line 11:
cd /srv/app
^---------^ SC2164 (warning): Use 'cd ... || exit' or 'cd ... || return' in case cd fails.

In sc.sh line 12:
if [ \$count &gt; 5 ]; then echo nhieu; fi
     ^----^ SC2154 (warning): count is referenced but not assigned.
     ^----^ SC2086 (info): Double quote to prevent globbing and word splitting.
            ^-- SC2071 (error): &gt; is for string comparisons. Use -gt instead.</div>
<p>Two details the example earlier in this lesson simplifies. On line 3 the real finding is SC2115 — the danger is not only word splitting but that an <em>empty</em> <code>\$tmpdir</code> makes it <code>rm -rf /*</code>; when <code>tmpdir</code> comes from <code>\$(mktemp -d)</code> instead of a constant, ShellCheck reports both SC2115 and SC2086 (tested). And SC2164 is exactly the "cd fails inside a chain" story from Lesson 7.1. Line 12 is a quiet killer: inside <code>[ ]</code>, <code>&gt;</code> is a <em>redirection</em>, so it creates a file named <code>5</code> and the test only asks "is <code>\$count</code> non-empty?" — tested: with <code>count=3</code> it was true (and a file <code>5</code> appeared), with <code>count</code> unset it was false. Levels: <code>error</code> &gt; <code>warning</code> &gt; <code>info</code> &gt; <code>style</code>; <code>-S warning</code> hides info and style.</p>

<h3>set -x prints your secrets — measured</h3>
<pre><code>TOKEN=12345 bash -xc 'curl -s -H "Authorization: Bearer \$TOKEN" http://127.0.0.1:19071 || true'</code></pre>
<div class="out">+ curl -s -H 'Authorization: Bearer 12345' http://127.0.0.1:19071
+ true</div>
<p>The token appears in full, because the trace shows values <em>after</em> expansion. In a systemd service that line goes to the journal; in cron, into an email. If you must trace a script that handles credentials, switch tracing off around that block (<code>set +x</code> … <code>set -x</code>) and never enable it by default.</p>

<h3>"Works by hand, fails in cron": reproduce it with env -i</h3>
<pre><code>#!/usr/bin/env bash
set -euo pipefail
echo "HOME=\${HOME:-&lt;rỗng&gt;} PATH=\$PATH"
pg_dump app &gt; /dev/null            <span class="tok-comment"># pg_dump lives in /usr/local/bin here</span>
echo OK</code></pre>
<div class="out">$ ./cron-thu.sh
HOME=/home/an PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
OK
$ env -i PATH=/usr/bin:/bin ./cron-thu.sh; echo "exit=\$?"
HOME=&lt;rỗng&gt; PATH=/usr/bin:/bin
./cron-thu.sh: line 4: pg_dump: command not found
exit=127
$ env -i HOME=/home/an PATH=/usr/local/bin:/usr/bin:/bin ./cron-thu.sh
HOME=/home/an PATH=/usr/local/bin:/usr/bin:/bin
OK</div>
<p>cron's default <code>PATH</code> is short (<code>/usr/bin:/bin</code>), so a tool installed in <code>/usr/local/bin</code> "does not exist" there. <code>env -i</code> reproduces that in one second on your own machine, instead of waiting for the 3 a.m. email. Fixes: set <code>PATH</code> at the top of the script, or call tools by absolute path. Chapter 11 covers cron's environment in full.</p>

<h3>Run it step by step</h3>
<p>In an <code>ubuntu:24.04</code> container (<code>apt-get install -y shellcheck</code> first), save <code>n.sh</code>, <code>dbg.sh</code> and <code>sc.sh</code> from above, then:</p>
<pre><code>bash -n n.sh; echo "exit=\$?"                           <span class="tok-comment"># 1. syntax: which line is really wrong?</span>
touch .env.staging &amp;&amp; bash -x dbg.sh staging           <span class="tok-comment"># 2. plain trace</span>
export PS4='+ \${BASH_SOURCE##*/}:\${LINENO}:\${FUNCNAME[0]:-main}: '
bash -x dbg.sh production; echo "exit=\$?"             <span class="tok-comment"># 3. trace with positions</span>
shellcheck -S warning sc.sh | grep -c '^In'            <span class="tok-comment"># 4. how many lines have warnings+?</span></code></pre>
<p>Expected: step 1 names line 7 and exits 2; step 2 prints six <code>+</code> lines then the output; step 3 ends at <code>+ dbg.sh:6:deploy: return 1</code> with exit 1; step 4 prints <code>5</code> — every flagged line also has a warning or error, only the extra info notes (SC2035, SC2086 on line 12) are hidden by <code>-S warning</code>. Fix each ShellCheck finding in <code>sc.sh</code> until <code>shellcheck sc.sh</code> prints nothing and exits 0.</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Thing in this lesson</th><th>Ubuntu / WSL2</th><th>macOS 27 (tested)</th></tr>
<tr><td><code>local -</code></td><td>works (bash 4.4+)</td><td><code>/bin/bash: line 0: local: &#96;-': not a valid identifier</code> — and then <code>set -x</code> stays on after the function returns</td></tr>
<tr><td><code>local -A</code>, <code>\${level^^}</code> (the log-level code above)</td><td>work</td><td><code>bad substitution</code> in bash 3.2 — run it with Homebrew bash</td></tr>
<tr><td><code>PS4</code> with <code>FUNCNAME</code>, <code>bash -x</code>, <code>bash -n</code></td><td>work</td><td>work, same output</td></tr>
<tr><td><code>date +%s.%N</code> (PS4 profiler)</td><td>nanoseconds</td><td>works on macOS 27 (printed <code>1790590852.620410000</code>); older macOS printed a literal <code>N</code></td></tr>
<tr><td><code>shellcheck</code></td><td><code>apt install shellcheck</code></td><td>not preinstalled: <code>brew install shellcheck</code></td></tr>
</table>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> the group's <code>report.sh</code> runs fine when you type it but the 06:00 cron email says <code>command not found</code>, and sometimes it exits without any message. Diagnose it with tools, not by reading.</p><ol>
<li>Write a 10-line <code>report.sh</code> that calls a tool you place in <code>/usr/local/bin</code> (any small script), uses an unquoted variable and a <code>cd</code> without <code>|| exit</code>.</li>
<li>Run <code>shellcheck report.sh</code>; fix every warning and error.</li>
<li>Reproduce the cron failure with <code>env -i PATH=/usr/bin:/bin ./report.sh</code>; fix it by setting <code>PATH</code> in the script.</li>
<li>Add <code>set -Eeuo pipefail</code> and <code>trap 'echo "line \$LINENO: \$BASH_COMMAND" &gt;&amp;2' ERR</code>; make one step fail on purpose and confirm the trap names the line.</li></ol>
<p><strong>Done when:</strong> <code>shellcheck report.sh</code> prints nothing; the <code>env -i</code> run prints the same result as your normal run; and the forced failure prints a line number and command on stderr.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Trace (<code>set -x</code>)</span><span class="v">Print every command after expansion, prefixed by <code>PS4</code>, to stderr.</span></div>
  <div class="kv"><span class="k"><code>PS4</code></span><span class="v">The prompt-like prefix of trace lines; can include file, line and function.</span></div>
  <div class="kv"><span class="k">Syntax check (<code>bash -n</code>)</span><span class="v">Parse the whole file without running any command.</span></div>
  <div class="kv"><span class="k">Linter (ShellCheck)</span><span class="v">A tool that reads source code and flags likely bugs, each with an SC number and a wiki page.</span></div>
  <div class="kv"><span class="k">Expansion</span><span class="v">The shell replacing <code>\$var</code>, globs and <code>\$( )</code> with their values before running a command.</span></div>
  <div class="kv"><span class="k"><code>env -i</code></span><span class="v">Start a command with an empty environment — the quickest imitation of cron.</span></div>
  <div class="kv"><span class="k">Log level</span><span class="v">A label such as DEBUG/INFO/WARN/ERROR that lets you filter diagnostic messages.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Order of tools: <code>shellcheck</code> → <code>bash -n</code> → <code>bash -x</code> with a good <code>PS4</code> → ERR trap with <code>set -E</code> → <code>env -i</code>; <code>echo</code> last.</li>
<li><code>set -x</code> shows commands after expansion on stderr; add <code>\${BASH_SOURCE##*/}:\${LINENO}:\${FUNCNAME[0]}</code> to <code>PS4</code> to know where.</li>
<li>"unexpected end of file" means something opened above was never closed, often many lines before the line it names.</li>
<li>ShellCheck finds SC2115/SC2086 (quoting), SC2155 (<code>local</code> masks), SC2164 (<code>cd</code>), SC2045 (<code>ls</code>) in a second.</li>
<li>Tracing leaks secrets in plain text — gate it behind <code>DEBUG</code> and never trace credential handling.</li>
<li><code>env -i PATH=/usr/bin:/bin</code> reproduces cron's environment; set <code>PATH</code> explicitly in scripts that run unattended.</li>
</ul>

<a class="link-card" href="https://www.shellcheck.net/wiki/" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">ShellCheck wiki — every rule explained</span><span class="lc-sub">One page per finding, each with a broken example, why it breaks, and the fix. Reading SC2086, SC2155 and SC2045 covers most of Chapter 6.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — The Set Builtin</span><span class="lc-sub">Every <code>set</code> option including <code>-x</code>, <code>-v</code>, <code>-n</code> and the <code>-o</code> long names, plus what <code>local -</code> does.</span></span>
</a>
<a class="link-card" href="https://bats-core.readthedocs.io/" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">bats-core — testing bash</span><span class="lc-sub">Setup, teardown, mocking commands with PATH tricks, and running in CI. Enough to test a deploy script properly.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Practice: find the bug with the tools</span><span class="lc-sub">Four broken scripts, one per failure mode above. Diagnose each using <code>set -x</code>, <code>bash -n</code>, ShellCheck and <code>env -i</code> — not by reading.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> leaving <code>set -x</code> on in production. The trace goes to stderr, which in a systemd service lands in the journal and in cron becomes an email — every run, forever. Worse, it prints <em>expanded</em> values, so a script handling a token or a database URL writes the secret into the log in plain text, where it is then backed up and shipped to whatever aggregates your logs. Gate tracing behind <code>\${DEBUG:-0}</code>, and never trace a block that handles credentials.</div>
<p class="note-ct"><strong>The order to reach for these:</strong> <code>shellcheck</code> first, because it finds whole classes of bug in a second without running anything; then <code>bash -n</code> for syntax; then <code>bash -x</code> with a useful <code>PS4</code> to watch what the shell actually built. Adding <code>echo</code> statements should be the last resort, not the first — and once you have the <code>PS4</code> line in your <code>~/.bashrc</code>, it usually never is.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.4</span>
<h2>Gỡ lỗi mà không phải rắc echo khắp nơi</h2>
<p class="lead">Phản xạ khi một script cư xử lạ là thêm mấy dòng <code>echo</code>, chạy thử, thêm nữa, rồi xoá hết đi — và thường sót một dòng. Bash có công cụ tốt hơn: nó in ra được MỌI lệnh nó chạy, với các biến ĐÃ khai triển, cho thấy chính xác thứ shell vừa dựng chứ không phải thứ bạn viết.</p>

<h3>set -x: lần theo từng lệnh</h3>
${slide('lx-07', 20, 'set -x in lệnh SAU khai triển; PS4 thêm file:dòng:hàm')}
<pre><code>#!/usr/bin/env bash
set -x                      <span class="tok-comment"># lần theo từ đây trở đi</span>
name="Binh"
greet="Hello, \$name"
echo "\$greet"
set +x                      <span class="tok-comment"># ngừng lần theo</span></code></pre>
<div class="out">+ name=Binh
+ greet='Hello, Binh'
+ echo 'Hello, Binh'
Hello, Binh
+ set +x</div>
<p>Mọi dòng được lần theo đều đi ra <strong>stderr</strong> với tiền tố dấu <code>+</code>, và — đây mới là điểm mấu chốt — các biến được hiện ra <em>SAU KHI</em> khai triển. Bạn thấy <code>Hello, Binh</code>, không thấy <code>Hello, \$name</code>. Gần như mọi lỗi shell đều là khác biệt giữa thứ bạn NGHĨ một dòng sẽ khai triển thành và thứ nó THẬT SỰ khai triển thành, và <code>set -x</code> cho thấy thẳng khác biệt đó.</p>
<pre><code>bash -x ./deploy.sh staging       <span class="tok-comment"># lần theo mà không phải sửa file</span>
./deploy.sh 2&gt; trace.log           <span class="tok-comment"># vệt lần theo ra stderr — hứng riêng nó</span></code></pre>

<h3>PS4: làm vệt lần theo đọc được</h3>
<pre><code>export PS4='+ \${BASH_SOURCE##*/}:\${LINENO}:\${FUNCNAME[0]:-main}: '
set -x
deploy staging</code></pre>
<div class="out">+ deploy.sh:41:main: deploy staging
+ deploy.sh:22:deploy: local env=staging
+ deploy.sh:24:deploy: [[ -f .env.staging ]]
+ deploy.sh:27:deploy: docker build -t myapp:latest .</div>
<p><code>PS4</code> mặc định chỉ là <code>+ </code>, thứ chẳng nói gì về việc bạn đang ở <em>ĐÂU</em>. Thêm tên file, số dòng và tên hàm biến một bức tường lệnh thành thứ bạn đi lại được — nhất là trong một script có nhiều hàm, nơi vệt lần theo trần chẳng gợi ý gì về việc bạn đang ở bên trong hàm nào. Hãy đặt dòng <code>PS4</code> đó vào <code>~/.bashrc</code> và mọi lệnh <code>bash -x</code> bạn từng chạy đều tốt lên.</p>
<div class="callout ok">Thêm <code>+\$(date +%s.%N)</code> vào <code>PS4</code> thì vệt lần theo trở thành một bộ đo hiệu năng thô sơ — các dấu thời gian cho thấy lệnh nào ngốn hết thời gian thực. Nó không phải <code>perf</code>, nhưng với câu "vì sao cái script deploy này mất bốn phút" thì nó thường trả lời xong chỉ trong một lần chạy.</div>

<h3>Chỉ lần theo đúng đoạn đáng quan tâm</h3>
<pre><code><span class="tok-comment"># Quanh một đoạn khả nghi</span>
set -x
problematic_function "\$arg"
set +x

<span class="tok-comment"># Bật tắt từ môi trường, không phải sửa file</span>
[[ \${DEBUG:-0} == 1 ]] &amp;&amp; set -x

<span class="tok-comment"># Chỉ bên trong một hàm — tự khôi phục trạng thái cũ khi hàm trả về</span>
process() {
  local -; set -x            <span class="tok-comment"># "local -" giới hạn các tuỳ chọn shell trong hàm này</span>
  <span class="tok-comment"># … được lần theo …</span>
}</code></pre>
<div class="out">$ DEBUG=1 ./deploy.sh staging</div>
<p><code>local -</code> vừa ít người biết vừa thật sự hữu ích: nó làm các tuỳ chọn shell trở thành cục bộ trong hàm, nên <code>set -x</code> bên trong tự tắt đi khi hàm trả về. Không còn <code>set +x</code> nào để quên.</p>

<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">1 · shellcheck</span><span class="lz-lnote">Tìm ra cả lớp lỗi mà không cần chạy gì — biến thiếu nháy, mã trả về bị che, phân tích <code>ls</code>. Một giây, không tác dụng phụ. Luôn làm đầu tiên.</span></div>
  <div class="lz-layer"><span class="lz-lname">2 · bash -n</span><span class="lz-lnote">Chỉ cú pháp. Bắt được một chữ <code>fi</code> bị thiếu hay một heredoc chưa đóng TRƯỚC KHI việc thực thi kịp chạy tới đó và đổi mất thứ gì.</span></div>
  <div class="lz-layer"><span class="lz-lname">3 · bash -x với một PS4 tử tế</span><span class="lz-lnote">Hiện mọi lệnh <em>SAU KHI</em> khai triển, kèm file, dòng và tên hàm. Đây là chỗ câu "tôi tưởng cái biến đó mang giá trị X" hiện nguyên hình.</span></div>
  <div class="lz-layer"><span class="lz-lname">4 · trap ERR</span><span class="lz-lnote">Cho một script chết trong im lặng: nó gọi tên dòng và đúng cái lệnh đã hỏng.</span></div>
  <div class="lz-layer"><span class="lz-lname">5 · env -i</span><span class="lz-lnote">Cho tình huống "chạy tay thì được, cron thì hỏng": bắt đầu từ một môi trường rỗng rồi chỉ thêm lại đúng những gì bạn nêu tên.</span></div>
  <div class="lz-layer"><span class="lz-lname">Cuối cùng · echo</span><span class="lz-lnote">Thêm mấy dòng in ra. Có ích, nhưng mọi thứ ở trên tìm ra lỗi nhanh hơn và chẳng để lại gì phải dọn.</span></div>
</div>
<h3>Kiểm trước khi chạy</h3>
${slide('lx-07', 21, 'Năm bậc gỡ lỗi trước khi rắc echo')}
<pre><code>bash -n script.sh          <span class="tok-comment"># CHỈ kiểm cú pháp — không chạy gì cả</span>
bash -v script.sh          <span class="tok-comment"># in từng dòng khi đọc vào, trước khi khai triển</span>
bash -uxn script.sh        <span class="tok-comment"># ghép các cờ lại</span></code></pre>
<div class="out">script.sh: line 47: syntax error: unexpected end of file</div>
<div class="callout warn"><code>bash -n</code> bắt được dấu nháy lệch cặp, thiếu một chữ <code>fi</code> hay <code>done</code>, và một heredoc chưa đóng — những lỗi mà nếu không thì chỉ hiện ra khi việc thực thi chạy tới đó, mà trong một script deploy thì lúc ấy có thể nó đã đổi thứ gì đó rồi. Hãy chạy nó như một phép kiểm trước khi commit; nó tốn vài mili giây và là thứ tương đương với <code>tsc --noEmit</code> của shell.</div>

<h3>ShellCheck: công cụ tìm ra những lỗi bạn không nhìn thấy</h3>
${slide('lx-07', 22, 'ShellCheck đọc ra những lỗi mắt không thấy')}
<pre><code>shellcheck deploy.sh
shellcheck -S warning deploy.sh      <span class="tok-comment"># chỉ cảnh báo và lỗi</span>
shellcheck -x deploy.sh              <span class="tok-comment"># đi theo cả những file được 'source'</span></code></pre>
<div class="out">In deploy.sh line 14:
rm -rf \$tmpdir/*
       ^-------^ SC2086: Double quote to prevent globbing and word splitting.

In deploy.sh line 22:
local out=\$(risky-command)
      ^-- SC2155: Declare and assign separately to avoid masking return values.

In deploy.sh line 31:
for f in \$(ls *.log); do
         ^---------^ SC2045: Iterating over ls output is fragile. Use globs.</div>
<p>Ba phát hiện đó lần lượt là Bài 6.2, 6.1 và 6.5 — đúng những cái bẫy mà khoá này đã dành cả một chương để nói, và được tìm ra tự động trong chưa tới một giây. Mỗi cảnh báo đều có một trang wiki giải thích chỗ hỏng kèm cách dựng lại, nên nó DẠY chứ không chỉ than phiền.</p>
<pre><code><span class="tok-comment"># Cài nó</span>
sudo apt install shellcheck

<span class="tok-comment"># Trong CI — cho bản dựng hỏng nếu có bất kỳ phát hiện nào</span>
shellcheck scripts/*.sh

<span class="tok-comment"># Tắt đúng một phát hiện, kèm lý do, chỉ cho dòng ngay sau</span>
<span class="tok-comment"># shellcheck disable=SC2086  # ở đây cắt từ là chủ ý</span>
command \$args</code></pre>
<div class="callout ok"><strong>Hãy chạy ShellCheck với mọi script bạn viết.</strong> Nó bắt được lớp lỗi biến-thiếu-nháy một cách đáng tin, mà đó lại đúng là lớp lỗi chỉ hỏng với đầu vào bất thường nên sống sót qua mọi lần thử. Khi bạn có tắt một luật, hãy ghi lý do vào chú thích — một dòng <code>disable=</code> trần thì không phân biệt được với việc dập tiếng một thứ mà bạn không hiểu.</div>

<h3>Ghi log có phân mức</h3>
<pre><code>readonly LOG_LEVEL=\${LOG_LEVEL:-info}

_log() {
  local level=\$1; shift
  local -A rank=([debug]=0 [info]=1 [warn]=2 [error]=3)
  (( rank[\$level] &lt; rank[\$LOG_LEVEL] )) &amp;&amp; return 0
  printf '%s [%s] %s\\n' "\$(date +%FT%T)" "\${level^^}" "\$*" &gt;&amp;2
}
debug() { _log debug "\$@"; }
info()  { _log info  "\$@"; }
warn()  { _log warn  "\$@"; }
error() { _log error "\$@"; }

info "bắt đầu deploy"
debug "đang dùng tag \$tag"
warn "chưa cấu hình health check"</code></pre>
<div class="out">$ ./deploy.sh
2026-08-22T14:51:03 [INFO] bắt đầu deploy
2026-08-22T14:51:03 [WARN] chưa cấu hình health check
$ LOG_LEVEL=debug ./deploy.sh
2026-08-22T14:51:09 [INFO] bắt đầu deploy
2026-08-22T14:51:09 [DEBUG] đang dùng tag v1.4
2026-08-22T14:51:09 [WARN] chưa cấu hình health check</div>
<p>Mười hai dòng, và bạn để hẳn phần output chẩn đoán lại trong script vĩnh viễn thay vì cứ thêm vào rồi xoá đi. Mọi thứ đi ra stderr nên script vẫn ghép nối được, và các dấu thời gian nghĩa là một file log của tuần trước vẫn đọc được.</p>

<h3>Bốn kiểu hỏng và cách bắt từng cái</h3>
${slide('lx-07', 23, 'Tay chạy được, cron hỏng: env -i tái hiện môi trường trống')}
<div class="kv-grid">
  <div class="kv"><span class="k">"Nó chẳng làm gì cả"</span><span class="v">Thường là một glob không khớp hoặc một biến rỗng. <code>set -x</code> cho thấy cái lệnh với một tham số rỗng, hoặc với đúng chữ <code>*.log</code> — cả hai đều vô hình khi đọc mã nguồn.</span></div>
  <div class="kv"><span class="k">"Chạy tay thì được, cron thì hỏng"</span><span class="v">Môi trường khác: <code>PATH</code>, không có <code>HOME</code>, không có TTY, thư mục làm việc khác. Hãy so <code>env</code> ở cả hai nơi, và dùng đường dẫn tuyệt đối. Chương 11 nói kỹ chuyện này.</span></div>
  <div class="kv"><span class="k">"Thi thoảng mới hỏng"</span><span class="v">Một tình huống tranh chấp, hoặc chuyện dấu nháy phụ thuộc đầu vào. Hãy thử với một bộ mẫu hiểm ác: <code>touch 'a b.txt' '-rf' '*'</code> rồi chạy lại.</span></div>
  <div class="kv"><span class="k">"Nó thoát ra mà không nói gì"</span><span class="v"><code>set -e</code> cộng với một lệnh hỏng trong im lặng. Hãy thêm <code>trap 'echo "dòng \$LINENO: \$BASH_COMMAND"' ERR</code> ở Bài 7.3 và nó sẽ gọi tên dòng đó.</span></div>
</div>
<pre><code><span class="tok-comment"># Dựng lại môi trường của cron sát nhất có thể</span>
env -i HOME="\$HOME" PATH=/usr/bin:/bin bash -x ./script.sh</code></pre>
<p><code>env -i</code> khởi động với một môi trường <em>RỖNG</em> rồi chỉ thêm lại đúng những gì bạn nêu tên. Nếu script chạy bình thường thì được mà chạy dưới lệnh đó thì hỏng, nguyên nhân là một biến môi trường mà bạn không biết là mình đang phụ thuộc vào — và đó chính xác là khác biệt giữa shell của bạn và của cron.</p>

<h3>Kiểm thử một script</h3>
<pre><code><span class="tok-comment"># bats — một khung kiểm thử cho bash</span>
sudo apt install bats

<span class="tok-comment"># test/deploy.bats</span>
@test "từ chối một môi trường không hợp lệ" {
  run ./deploy.sh nonsense
  [ "\$status" -eq 2 ]
  [[ "\$output" == *"môi trường không hợp lệ"* ]]
}

@test "chạy thử thì không đổi gì cả" {
  run ./deploy.sh --dry-run staging
  [ "\$status" -eq 0 ]
  [[ "\$output" == *"[chạy thử]"* ]]
}</code></pre>
<div class="out">$ bats test/
 ✓ từ chối một môi trường không hợp lệ
 ✓ chạy thử thì không đổi gì cả

2 tests, 0 failures</div>
<p>Chính phần kiểm tính hợp lệ và chế độ chạy thử ở Bài 7.2 là thứ làm cho một script kiểm thử được: các chốt chặn cho bạn những mã thoát đoán trước được để mà khẳng định, còn <code>--dry-run</code> cho phép một phép kiểm chạy qua toàn bộ luồng mà không đụng vào production. Ngay cả hai phép kiểm cũng đáng có với một script đi triển khai thứ gì đó.</p>

<h3>Đọc một vệt trace từng dòng</h3>
<p>Các vệt trace trong bài còn ngắn. Đây là một vệt thật từ một script chín dòng, lần đầu với <code>PS4</code> mặc định, lần sau với bản file:dòng:hàm — để bạn thấy mỗi mẩu mang lại gì.</p>
<pre><code>#!/usr/bin/env bash
set -euo pipefail
deploy() {
  local env=\$1
  local tag=\${TAG:-latest}
  [[ -f ".env.\$env" ]] || { echo "thiếu .env.\$env" &gt;&amp;2; return 1; }
  echo "deploy myapp:\$tag lên \$env"
}
deploy "\$@"</code></pre>
<div class="out">$ bash -x dbg.sh staging
+ set -euo pipefail
+ deploy staging
+ local env=staging
+ local tag=latest
+ [[ -f .env.staging ]]
+ echo 'deploy myapp:latest lên staging'
deploy myapp:latest lên staging
$ PS4='+ \${BASH_SOURCE##*/}:\${LINENO}:\${FUNCNAME[0]:-main}: ' bash -x dbg.sh production
+ dbg.sh:2:main: set -euo pipefail
+ dbg.sh:9:main: deploy production
+ dbg.sh:4:deploy: local env=production
+ dbg.sh:5:deploy: local tag=latest
+ dbg.sh:6:deploy: [[ -f .env.production ]]
+ dbg.sh:6:deploy: echo 'thiếu .env.production'
thiếu .env.production
+ dbg.sh:6:deploy: return 1</div>
<p>Cách đọc: dòng bắt đầu bằng <code>+</code> là vệt trace (trên stderr); các dòng khác là output của chính script. <code>local tag=latest</code> cho thấy <code>\${TAG:-latest}</code> đã rơi về giá trị mặc định, tức là <code>TAG</code> chưa được đặt — điều mà đọc mã nguồn không thể nói cho bạn. <code>[[ -f .env.production ]]</code> mà sau đó không có dòng <code>+</code> nào cho <code>echo "deploy…"</code> nghĩa là phép kiểm đã sai, và <code>return 1</code> ở dòng 6 là chỗ script kết thúc. Với dấu <code>+</code> trơn bạn biết lệnh <em>nào</em> đã chạy; có PS4 bạn biết thêm nó chạy ở <em>đâu</em>.</p>

<h3>Các cờ lần vết và kiểm tra</h3>
<table>
<tr><th>Cờ / dạng</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>bash -x f.sh</code> · <code>set -x</code> / <code>set +x</code></td><td>in mọi lệnh sau khai triển, ra stderr · bật / tắt bên trong script</td><td><code>bash -x deploy.sh 2&gt; trace.log</code></td></tr>
<tr><td><code>bash -n f.sh</code></td><td>chỉ phân tích cú pháp, không chạy gì</td><td>kiểm cú pháp trước khi commit</td></tr>
<tr><td><code>bash -v f.sh</code></td><td>in từng dòng lúc ĐỌC, trước khi khai triển</td><td>thấy cả heredoc và chú thích</td></tr>
<tr><td><code>PS4='…'</code></td><td>tiền tố của mọi dòng trace; khai triển lại mỗi lần</td><td><code>'+ \${BASH_SOURCE##*/}:\${LINENO}: '</code></td></tr>
<tr><td><code>[[ \${DEBUG:-0} == 1 ]] &amp;&amp; set -x</code></td><td>chỉ trace khi được yêu cầu</td><td><code>DEBUG=1 ./deploy.sh</code></td></tr>
<tr><td><code>local -</code></td><td>làm thay đổi của <code>set</code> chỉ có hiệu lực trong một hàm (bash 4.4+)</td><td><code>f() { local -; set -x; …; }</code></td></tr>
<tr><td><code>env -i BIẾN=… lệnh</code></td><td>chạy với môi trường trống cộng những gì bạn chỉ định</td><td><code>env -i PATH=/usr/bin:/bin ./f.sh</code></td></tr>
</table>

<h3>bash -n: lỗi thường nằm TRÊN dòng mà nó báo</h3>
<pre><code>$ cat -n n.sh
     1  #!/usr/bin/env bash
     2  if [[ -n "\$1" ]]; then
     3    echo "co tham so"
     4  for f in *.log; do
     5    echo "\$f"
     6  done
$ bash -n n.sh; echo "mã=\$?"</code></pre>
<div class="out">n.sh: line 7: syntax error: unexpected end of file
mã=2</div>
<p>File có sáu dòng, mà bash kêu ở dòng 7: nó đi tới cuối file mà vẫn đang chờ cái <code>fi</code> lẽ ra phải đóng câu <code>if</code> ở dòng 2 (sau dòng 3). "unexpected end of file" luôn có nghĩa "có thứ gì đó mở ở phía trên mà chưa bao giờ đóng" — <code>fi</code>, <code>done</code>, <code>esac</code>, <code>}</code>, một dấu nháy, hay từ kết thúc của một heredoc. Hãy dò ngược lên từ cuối file, và nhờ tính năng tô cặp ngoặc của trình soạn thảo.</p>

<h3>ShellCheck, chạy thật</h3>
<p>Một script nhỏ mang năm lỗi kinh điển, kiểm bằng ShellCheck 0.9.0 (bản có trong Ubuntu 24.04):</p>
<pre><code>#!/usr/bin/env bash
tmpdir=/tmp/build
rm -rf \$tmpdir/*
process() {
  local out=\$(curl -s "\$1")
  echo "\$out"
}
for f in \$(ls *.log); do
  echo "\$f"
done
cd /srv/app
if [ \$count &gt; 5 ]; then echo nhieu; fi</code></pre>
<div class="out">In sc.sh line 3:
rm -rf \$tmpdir/*
       ^-------^ SC2115 (warning): Use "\${var:?}" to ensure this never expands to /* .

In sc.sh line 5:
  local out=\$(curl -s "\$1")
        ^-^ SC2155 (warning): Declare and assign separately to avoid masking return values.

In sc.sh line 8:
for f in \$(ls *.log); do
         ^---------^ SC2045 (error): Iterating over ls output is fragile. Use globs.
              ^-- SC2035 (info): Use ./*glob* or -- *glob* so names with dashes won't become options.

In sc.sh line 11:
cd /srv/app
^---------^ SC2164 (warning): Use 'cd ... || exit' or 'cd ... || return' in case cd fails.

In sc.sh line 12:
if [ \$count &gt; 5 ]; then echo nhieu; fi
     ^----^ SC2154 (warning): count is referenced but not assigned.
     ^----^ SC2086 (info): Double quote to prevent globbing and word splitting.
            ^-- SC2071 (error): &gt; is for string comparisons. Use -gt instead.</div>
<p>Hai chi tiết mà ví dụ phía trên trong bài đã làm gọn. Ở dòng 3, phát hiện thật là SC2115 — mối nguy không chỉ là chẻ từ mà là một <code>\$tmpdir</code> <em>RỖNG</em> biến lệnh thành <code>rm -rf /*</code>; khi <code>tmpdir</code> lấy từ <code>\$(mktemp -d)</code> thay vì một hằng số, ShellCheck báo cả SC2115 lẫn SC2086 (đã thử). Và SC2164 chính là câu chuyện "cd hỏng giữa chuỗi" của Bài 7.1. Dòng 12 là một sát thủ thầm lặng: bên trong <code>[ ]</code>, <code>&gt;</code> là một phép <em>chuyển hướng</em>, nên nó tạo ra một file tên <code>5</code> và phép kiểm chỉ còn hỏi "<code>\$count</code> có rỗng không?" — đã thử: <code>count=3</code> thì đúng (và một file <code>5</code> xuất hiện), <code>count</code> chưa đặt thì sai. Mức độ: <code>error</code> &gt; <code>warning</code> &gt; <code>info</code> &gt; <code>style</code>; <code>-S warning</code> ẩn info và style.</p>

<h3>set -x in ra bí mật của bạn — đo thật</h3>
<pre><code>TOKEN=12345 bash -xc 'curl -s -H "Authorization: Bearer \$TOKEN" http://127.0.0.1:19071 || true'</code></pre>
<div class="out">+ curl -s -H 'Authorization: Bearer 12345' http://127.0.0.1:19071
+ true</div>
<p>Token hiện ra nguyên vẹn, vì vệt trace in giá trị <em>SAU</em> khai triển. Trong một dịch vụ systemd dòng đó đi vào journal; trong cron, nó thành một email. Nếu buộc phải trace một script có xử lý thông tin đăng nhập, hãy tắt trace quanh khối đó (<code>set +x</code> … <code>set -x</code>) và đừng bao giờ bật mặc định.</p>

<h3>"Tay chạy được, cron hỏng": tái hiện bằng env -i</h3>
<pre><code>#!/usr/bin/env bash
set -euo pipefail
echo "HOME=\${HOME:-&lt;rỗng&gt;} PATH=\$PATH"
pg_dump app &gt; /dev/null            <span class="tok-comment"># ở máy này pg_dump nằm trong /usr/local/bin</span>
echo OK</code></pre>
<div class="out">$ ./cron-thu.sh
HOME=/home/an PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
OK
$ env -i PATH=/usr/bin:/bin ./cron-thu.sh; echo "mã=\$?"
HOME=&lt;rỗng&gt; PATH=/usr/bin:/bin
./cron-thu.sh: line 4: pg_dump: command not found
mã=127
$ env -i HOME=/home/an PATH=/usr/local/bin:/usr/bin:/bin ./cron-thu.sh
HOME=/home/an PATH=/usr/local/bin:/usr/bin:/bin
OK</div>
<p><code>PATH</code> mặc định của cron rất ngắn (<code>/usr/bin:/bin</code>), nên một công cụ cài trong <code>/usr/local/bin</code> "không tồn tại" ở đó. <code>env -i</code> tái hiện điều đó trong một giây ngay trên máy bạn, thay vì chờ email lúc 3 giờ sáng. Cách sửa: đặt <code>PATH</code> ở đầu script, hoặc gọi công cụ bằng đường dẫn tuyệt đối. Chương 11 nói đầy đủ về môi trường của cron.</p>

<h3>Chạy thử từng bước</h3>
<p>Trong một container <code>ubuntu:24.04</code> (chạy <code>apt-get install -y shellcheck</code> trước), lưu <code>n.sh</code>, <code>dbg.sh</code> và <code>sc.sh</code> ở trên, rồi:</p>
<pre><code>bash -n n.sh; echo "mã=\$?"                             <span class="tok-comment"># 1. cú pháp: dòng nào thật sự sai?</span>
touch .env.staging &amp;&amp; bash -x dbg.sh staging           <span class="tok-comment"># 2. trace trơn</span>
export PS4='+ \${BASH_SOURCE##*/}:\${LINENO}:\${FUNCNAME[0]:-main}: '
bash -x dbg.sh production; echo "mã=\$?"               <span class="tok-comment"># 3. trace có vị trí</span>
shellcheck -S warning sc.sh | grep -c '^In'            <span class="tok-comment"># 4. bao nhiêu dòng có warning trở lên?</span></code></pre>
<p>Kết quả mong đợi: bước 1 gọi tên dòng 7 và thoát mã 2; bước 2 in sáu dòng <code>+</code> rồi tới output; bước 3 dừng ở <code>+ dbg.sh:6:deploy: return 1</code> với mã 1; bước 4 in <code>5</code> — dòng nào bị đánh dấu cũng có ít nhất một warning hoặc error, chỉ những ghi chú mức info (SC2035, SC2086 ở dòng 12) bị <code>-S warning</code> ẩn đi. Sửa từng phát hiện của ShellCheck trong <code>sc.sh</code> tới khi <code>shellcheck sc.sh</code> không in gì và thoát mã 0.</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ trong bài</th><th>Ubuntu / WSL2</th><th>macOS 27 (đã thử)</th></tr>
<tr><td><code>local -</code></td><td>chạy được (bash 4.4+)</td><td><code>/bin/bash: line 0: local: &#96;-': not a valid identifier</code> — và <code>set -x</code> vẫn bật sau khi hàm trả về</td></tr>
<tr><td><code>local -A</code>, <code>\${level^^}</code> (đoạn log có mức ở trên)</td><td>chạy được</td><td><code>bad substitution</code> trên bash 3.2 — chạy bằng bash của Homebrew</td></tr>
<tr><td><code>PS4</code> có <code>FUNCNAME</code>, <code>bash -x</code>, <code>bash -n</code></td><td>chạy được</td><td>chạy được, output y hệt</td></tr>
<tr><td><code>date +%s.%N</code> (bộ đo thời gian bằng PS4)</td><td>nano giây</td><td>chạy được trên macOS 27 (in <code>1790590852.620410000</code>); macOS cũ in ra chữ <code>N</code></td></tr>
<tr><td><code>shellcheck</code></td><td><code>apt install shellcheck</code></td><td>không có sẵn: <code>brew install shellcheck</code></td></tr>
</table>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> <code>report.sh</code> của nhóm gõ tay thì chạy tốt nhưng email cron lúc 06:00 báo <code>command not found</code>, và đôi khi nó thoát mà không có lời nhắn nào. Chẩn đoán bằng công cụ, không phải bằng cách đọc.</p><ol>
<li>Viết một <code>report.sh</code> 10 dòng gọi một công cụ bạn đặt trong <code>/usr/local/bin</code> (một script nhỏ bất kỳ), có một biến quên nháy và một <code>cd</code> không kèm <code>|| exit</code>.</li>
<li>Chạy <code>shellcheck report.sh</code>; sửa mọi warning và error.</li>
<li>Tái hiện lỗi cron bằng <code>env -i PATH=/usr/bin:/bin ./report.sh</code>; sửa bằng cách đặt <code>PATH</code> trong script.</li>
<li>Thêm <code>set -Eeuo pipefail</code> và <code>trap 'echo "line \$LINENO: \$BASH_COMMAND" &gt;&amp;2' ERR</code>; cố ý làm hỏng một bước và xác nhận bẫy gọi tên được dòng.</li></ol>
<p><strong>Đạt khi:</strong> <code>shellcheck report.sh</code> không in gì; lần chạy qua <code>env -i</code> ra cùng kết quả với lần chạy thường; và lỗi cố ý in ra số dòng và câu lệnh trên stderr.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Trace <code>set -x</code> (lần vết)</span><span class="v">In mọi lệnh sau khai triển, có tiền tố <code>PS4</code>, ra stderr.</span></div>
  <div class="kv"><span class="k"><code>PS4</code> (tiền tố trace)</span><span class="v">Chuỗi đứng đầu mỗi dòng trace; có thể chứa file, dòng và hàm.</span></div>
  <div class="kv"><span class="k">Syntax check <code>bash -n</code> (kiểm cú pháp)</span><span class="v">Phân tích cả file mà không chạy lệnh nào.</span></div>
  <div class="kv"><span class="k">Linter (công cụ soi mã)</span><span class="v">Đọc mã nguồn và đánh dấu chỗ có thể là lỗi; ShellCheck ghi số SC kèm một trang wiki.</span></div>
  <div class="kv"><span class="k">Expansion (khai triển)</span><span class="v">Shell thay <code>\$biến</code>, glob và <code>\$( )</code> bằng giá trị của chúng trước khi chạy lệnh.</span></div>
  <div class="kv"><span class="k"><code>env -i</code> (môi trường trống)</span><span class="v">Chạy một lệnh với môi trường rỗng — cách nhanh nhất để bắt chước cron.</span></div>
  <div class="kv"><span class="k">Log level (mức log)</span><span class="v">Nhãn như DEBUG/INFO/WARN/ERROR để lọc thông báo chẩn đoán.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Thứ tự công cụ: <code>shellcheck</code> → <code>bash -n</code> → <code>bash -x</code> với <code>PS4</code> tốt → bẫy ERR kèm <code>set -E</code> → <code>env -i</code>; <code>echo</code> sau cùng.</li>
<li><code>set -x</code> in lệnh sau khai triển ra stderr; thêm <code>\${BASH_SOURCE##*/}:\${LINENO}:\${FUNCNAME[0]}</code> vào <code>PS4</code> để biết ở đâu.</li>
<li>"unexpected end of file" nghĩa là có thứ mở ở phía trên mà chưa đóng, thường cách dòng được báo khá xa.</li>
<li>ShellCheck tìm ra SC2115/SC2086 (nháy), SC2155 (<code>local</code> che mã), SC2164 (<code>cd</code>), SC2045 (<code>ls</code>) trong một giây.</li>
<li>Trace làm lộ bí mật dạng chữ thường — chỉ bật qua <code>DEBUG</code> và không bao giờ trace phần xử lý thông tin đăng nhập.</li>
<li><code>env -i PATH=/usr/bin:/bin</code> tái hiện môi trường của cron; đặt <code>PATH</code> tường minh trong script chạy không người trông.</li>
</ul>

<a class="link-card" href="https://www.shellcheck.net/wiki/" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">ShellCheck wiki — giải thích mọi luật</span><span class="lc-sub">Mỗi phát hiện một trang, kèm ví dụ hỏng, lý do nó hỏng, và cách sửa. Đọc SC2086, SC2155 và SC2045 là bao gần hết Chương 6.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — The Set Builtin</span><span class="lc-sub">Mọi tuỳ chọn của <code>set</code> gồm <code>-x</code>, <code>-v</code>, <code>-n</code> và các tên dài của <code>-o</code>, cộng với việc <code>local -</code> làm gì.</span></span>
</a>
<a class="link-card" href="https://bats-core.readthedocs.io/" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">bats-core — kiểm thử bash</span><span class="lc-sub">Thiết lập, dọn dẹp, giả lập lệnh bằng mẹo PATH, và chạy trong CI. Đủ để kiểm thử một script deploy cho tử tế.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Luyện: tìm ra lỗi bằng công cụ</span><span class="lc-sub">Bốn script hỏng, mỗi cái một kiểu trong bốn kiểu ở trên. Hãy chẩn đoán từng cái bằng <code>set -x</code>, <code>bash -n</code>, ShellCheck và <code>env -i</code> — đừng chẩn đoán bằng cách đọc.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> để quên <code>set -x</code> bật trên production. Vệt lần theo đi ra stderr, mà trong một dịch vụ systemd thì nó rơi vào journal còn trong cron thì nó thành một email — mỗi lần chạy, mãi mãi. Tệ hơn, nó in ra các giá trị <em>ĐÃ KHAI TRIỂN</em>, nên một script xử lý một token hay một chuỗi kết nối cơ sở dữ liệu sẽ ghi thẳng cái bí mật đó vào log dưới dạng chữ thường, rồi cái log ấy được sao lưu và chuyển tới bất cứ hệ thống nào đang gom log của bạn. Hãy đặt việc lần theo sau một chốt <code>\${DEBUG:-0}</code>, và đừng bao giờ lần theo một đoạn đang xử lý thông tin xác thực.</div>
<p class="note-ct"><strong>Thứ tự nên với tay lấy chúng:</strong> <code>shellcheck</code> trước, vì nó tìm ra cả lớp lỗi trong một giây mà không cần chạy gì; rồi <code>bash -n</code> cho cú pháp; rồi <code>bash -x</code> với một <code>PS4</code> hữu ích để nhìn xem shell thật sự đã dựng ra cái gì. Thêm mấy dòng <code>echo</code> nên là phương án cuối chứ không phải phương án đầu — và một khi dòng <code>PS4</code> đã nằm trong <code>~/.bashrc</code> của bạn thì nó thường chẳng bao giờ đến lượt.</p>
</div>
`,
    },
    /* ─────────────────────────── 7.5 ─────────────────────────── */
    {
      title: '7.5 — A complete script, and when bash is the wrong tool|||7.5 — Một script hoàn chỉnh, và khi nào bash là công cụ sai',
      slug: 'lnx-7-5-script-hoan-chinh',
      type: 'LESSON',
      description: 'Một script deploy dài 90 dòng ghép mọi thứ của chương này, đọc từng khối một; rồi những dấu hiệu cho thấy đã đến lúc bỏ shell mà viết bằng ngôn ngữ khác.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.5</span>
<h2>A complete script</h2>
<p class="lead">Everything in this chapter, assembled into one script you could put in a repository today. Read it block by block — each one is a lesson you have already done, and the value is in seeing how they fit together rather than in any individual line.</p>

<h3>The whole thing</h3>
${slide('lx-07', 24, 'Script hoàn chỉnh = 9 khối, mỗi khối là một bài đã học')}
<pre><code>#!/usr/bin/env bash
#
# deploy.sh — build, push and release the application
# Usage: deploy.sh [options] &lt;staging|production&gt;

set -Eeuo pipefail            <span class="tok-comment"># -E: the ERR trap also fires inside functions (fixed 28/09/2026, see below)</span>
IFS=\$'\\n\\t'

<span class="tok-comment">#─── constants ────────────────────────────────────────────────</span>
readonly SCRIPT_DIR=\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" &amp;&amp; pwd)
readonly SCRIPT_NAME=\${0##*/}
readonly LOCKFILE=/var/lock/\${SCRIPT_NAME%.sh}.lock
readonly REGISTRY=ghcr.io/cuonghoang1103

<span class="tok-comment">#─── state ────────────────────────────────────────────────────</span>
env=""
tag="latest"
dry_run=0
tmpdir=""

<span class="tok-comment">#─── logging (7.4) ────────────────────────────────────────────</span>
log()  { printf '%s [%s] %s\\n' "\$(date +%T)" "\$1" "\${*:2}" &gt;&amp;2; }
info() { log INFO "\$@"; }
warn() { log WARN "\$@"; }
die()  { log ERROR "\$@"; exit 1; }

<span class="tok-comment">#─── cleanup (7.3) ────────────────────────────────────────────</span>
cleanup() {
  local rc=\$?
  trap - ERR                  <span class="tok-comment"># no second ERR report from inside cleanup (fixed)</span>
  [[ -n \$tmpdir ]] &amp;&amp; rm -rf "\$tmpdir"
  (( rc != 0 )) &amp;&amp; warn "deploy failed with exit code \$rc"
  return \$rc
}
trap cleanup EXIT
trap 'log ERROR "line \$LINENO: \$BASH_COMMAND"' ERR

<span class="tok-comment">#─── dry-run wrapper (7.2) ────────────────────────────────────</span>
run() {
  if (( dry_run )); then
    local IFS=' '             <span class="tok-comment"># IFS=\$'\\n\\t' above would join "\$*" with NEWLINES (fixed)</span>
    printf '[dry-run] %s\\n' "\$*" &gt;&amp;2
  else
    "\$@"
  fi
}

<span class="tok-comment">#─── help (7.2) ───────────────────────────────────────────────</span>
usage() {
  cat &lt;&lt;EOF
\${SCRIPT_NAME} — build, push and release the application

Usage:
  \${SCRIPT_NAME} [options] &lt;staging|production&gt;

Options:
  -t, --tag TAG   image tag (default: latest)
  -n, --dry-run   show what would run, change nothing
  -h, --help      this help

Examples:
  \${SCRIPT_NAME} staging
  \${SCRIPT_NAME} --tag v1.4 --dry-run production
EOF
}

<span class="tok-comment">#─── argument parsing (7.2) ───────────────────────────────────</span>
parse_args() {
  while [[ \$# -gt 0 ]]; do
    case \$1 in
      -h|--help)    usage; exit 0 ;;
      -n|--dry-run) dry_run=1; shift ;;
      -t|--tag)     tag=\${2:?--tag needs a value}; shift 2 ;;
      --tag=*)      tag=\${1#*=}; shift ;;
      --)           shift; break ;;
      -*)           die "unknown option: \$1" ;;
      *)            env=\$1; shift ;;
    esac
  done

  [[ -n \$env ]] || { usage; exit 2; }
  case \$env in
    staging|production) ;;
    *) die "environment must be staging or production, got: \$env" ;;
  esac
  [[ \$tag =~ ^[a-zA-Z0-9._-]+\$ ]] || die "invalid tag: \$tag"
}

<span class="tok-comment">#─── preconditions (7.2) ──────────────────────────────────────</span>
preflight() {
  local cmd
  for cmd in docker git; do
    command -v "\$cmd" &gt;/dev/null || die "\$cmd is required but not installed"
  done

  docker info &amp;&gt;/dev/null || die "docker daemon is not running"
  [[ -f "\$SCRIPT_DIR/.env.\$env" ]] || die "missing .env.\$env"
  [[ -z \$(git status --porcelain) ]] || die "working tree is dirty — commit first"

  if [[ \$env == production &amp;&amp; \$tag == latest ]]; then
    die "refusing to deploy 'latest' to production — pass an explicit --tag"
  fi
}

<span class="tok-comment">#─── the work ─────────────────────────────────────────────────</span>
build_and_push() {
  local image="\$REGISTRY/myapp:\$tag"
  info "building \$image"
  run docker build -t "\$image" "\$SCRIPT_DIR"
  info "pushing \$image"
  run docker push "\$image"
  printf '%s\\n' "\$image"
}

release() {
  local image=\$1 host
  host=\$(grep -m1 '^DEPLOY_HOST=' "\$SCRIPT_DIR/.env.\$env" | cut -d= -f2)
  [[ -n \$host ]] || die "DEPLOY_HOST not set in .env.\$env"

  info "releasing to \$host"
  run ssh "\$host" "docker pull '\$image' &amp;&amp; \\
    docker compose -p myapp up -d --no-build backend"
}

smoke_test() {
  local url=\$1 code
  info "smoke-testing \$url"
  (( dry_run )) &amp;&amp; { printf '[dry-run] curl %s\\n' "\$url" &gt;&amp;2; return 0; }

  code=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "\$url" || echo 000)
  case \$code in
    200|401) info "route is live (HTTP \$code)" ;;
    404)     die "route returned 404 — stale or partial build" ;;
    000)     die "no response from \$url" ;;
    *)       die "unexpected HTTP \$code from \$url" ;;
  esac
}

<span class="tok-comment">#─── entry point (7.1) ────────────────────────────────────────</span>
main() {
  parse_args "\$@"

  exec 9&gt;"\$LOCKFILE"
  flock -n 9 || { warn "another deploy is already running"; exit 0; }

  preflight
  tmpdir=\$(mktemp -d)

  local image
  image=\$(build_and_push)
  release "\$image"
  smoke_test "https://cuongthai.com/api/v1/posts"

  info "deployed \$tag to \$env"
}

main "\$@"</code></pre>
<div class="out">$ ./deploy.sh --dry-run --tag v1.4 production
14:58:02 [INFO] building ghcr.io/cuonghoang1103/myapp:v1.4
[dry-run] docker build -t ghcr.io/cuonghoang1103/myapp:v1.4 /srv/app
14:58:02 [INFO] pushing ghcr.io/cuonghoang1103/myapp:v1.4
[dry-run] docker push ghcr.io/cuonghoang1103/myapp:v1.4
14:58:02 [INFO] releasing to vps
[dry-run] ssh vps docker pull 'ghcr.io/cuonghoang1103/myapp:v1.4' &amp;&amp;     docker compose -p myapp up -d --no-build backend
14:58:02 [INFO] smoke-testing https://cuongthai.com/api/v1/posts
[dry-run] curl https://cuongthai.com/api/v1/posts
14:58:02 [INFO] deployed v1.4 to production</div>

<h3>Why each block is there</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Strict mode + <code>main "\$@"</code></span><span class="v">Nothing executes until the whole file parses, and any failure stops the script instead of continuing into the next step (7.1).</span></div>
  <div class="kv"><span class="k">Parse, then validate, then preflight</span><span class="v">Three separate stages, each exiting with a message. A failure at any of them leaves production completely untouched (7.2).</span></div>
  <div class="kv"><span class="k"><code>flock</code> before any work</span><span class="v">Two people deploying at once is a genuine outage. The lock releases when the process dies, however it dies (7.3).</span></div>
  <div class="kv"><span class="k"><code>trap cleanup EXIT</code></span><span class="v">The temp directory goes away on success, on failure, and on Ctrl-C (7.3).</span></div>
  <div class="kv"><span class="k"><code>run</code> wrapper</span><span class="v">Every destructive command is inspectable with <code>--dry-run</code>, and the printed form is exactly what would execute (7.2).</span></div>
  <div class="kv"><span class="k">Smoke test at the end</span><span class="v">A deploy that finishes is not a deploy that works. A 404 here means a stale build — the exact failure this project hit on 2026-07-02.</span></div>
</div>
<div class="callout ok">Notice the <code>production</code> + <code>latest</code> guard in <code>preflight</code>. It encodes a policy — "never release a floating tag to production" — as a check the script enforces rather than a rule people are asked to remember. That is the highest-leverage kind of line in an operations script: it turns a thing that must not happen into a thing that <em>cannot</em>.</div>

<h3>Functions return data on stdout, status via exit code</h3>
${slide('lx-07', 25, 'stdout mang giá trị, stderr mang log — nên $(…) hứng sạch')}
<pre><code>image=\$(build_and_push)      <span class="tok-comment"># captures ONLY the printf on the last line</span>
release "\$image"</code></pre>
<p><code>build_and_push</code> writes its progress with <code>info</code> — which goes to stderr — and prints the image name to stdout. So the caller captures a clean value while the human still sees the log. That separation (Lesson 6.5) is what makes shell functions composable; a function that logs to stdout can never have its output captured.</p>

<h3>When to stop using bash</h3>
${slide('lx-07', 27, 'Khi nào thôi dùng bash — và 7 mục kiểm trước khi commit')}
<p>Shell is excellent at orchestrating other programs and poor at almost everything else. These are the signals that a script has outgrown it:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Data structures</span><span class="lz-lnote">You need nested data, or a list of records with fields. Bash has one-dimensional arrays and associative arrays, and neither nests. Parsing JSON with <code>jq</code> inside a loop is a warning sign; building JSON with <code>printf</code> is a red flag.</span></div>
  <div class="lz-layer"><span class="lz-lname">Arithmetic</span><span class="lz-lnote">Anything with decimals. Integer-only division (Lesson 6.1) means percentages, averages and rates are all wrong or all require <code>bc</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Error handling</span><span class="lz-lnote">You need to retry with backoff, distinguish error types, or clean up partially completed work. <code>trap</code> covers exit; it does not give you exceptions.</span></div>
  <div class="lz-layer"><span class="lz-lname">Length</span><span class="lz-lnote">Past roughly 300 lines, or once it has more than a handful of functions. Bash has no modules and no namespacing, so a large script is one flat global scope.</span></div>
  <div class="lz-layer"><span class="lz-lname">Testing</span><span class="lz-lnote">You want unit tests for logic rather than end-to-end tests for behaviour. <code>bats</code> is good at the latter and awkward at the former.</span></div>
  <div class="lz-layer"><span class="lz-lname">Concurrency</span><span class="lz-lnote">Beyond <code>&amp;</code> plus <code>wait</code> or <code>xargs -P</code>. Coordinating workers, collecting results, handling partial failure — that is a program, not a script.</span></div>
</div>
<div class="callout"><strong>What bash remains best at:</strong> gluing together commands that already exist. The script above is 90 lines because docker, git, ssh and curl do the actual work — bash only decides the order, checks the preconditions and reports. Rewriting it in Python would make it longer and no clearer. The moment it starts <em>computing</em> rather than <em>coordinating</em>, that calculus reverses.</div>
<pre><code><span class="tok-comment"># A reasonable middle ground: keep the orchestration in bash,</span>
<span class="tok-comment"># move the logic to a program bash calls.</span>
manifest=\$(python3 "\$SCRIPT_DIR/build_manifest.py" --env "\$env")
run docker build --build-arg "MANIFEST=\$manifest" .</code></pre>

<h3>A checklist before you commit a script</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Runs clean</span><span class="v"><code>shellcheck script.sh</code> reports nothing, or every disable has a stated reason.</span></div>
  <div class="kv"><span class="k">Parses</span><span class="v"><code>bash -n script.sh</code> is silent.</span></div>
  <div class="kv"><span class="k">Explains itself</span><span class="v"><code>./script.sh --help</code> shows usage and at least one example.</span></div>
  <div class="kv"><span class="k">Refuses bad input</span><span class="v">No arguments, wrong arguments and a missing dependency each exit nonzero with a distinct message on stderr.</span></div>
  <div class="kv"><span class="k">Safe to re-run</span><span class="v">Running it twice does not duplicate work or fail (Lesson 7.3).</span></div>
  <div class="kv"><span class="k">Cleans up</span><span class="v">Ctrl-C halfway through leaves no temp files and no held lock.</span></div>
  <div class="kv"><span class="k">Survives hostile names</span><span class="v">Tested against a directory containing <code>'a b.txt'</code>, <code>'-rf'</code> and <code>'*'</code>.</span></div>
</div>

<h3>What running the complete script revealed</h3>
${slide('lx-07', 26, 'Chạy lại bản cũ lộ hai lỗi thật: IFS và thiếu -E')}
<p>The script above was run for real on 28/09/2026 in an Ubuntu 24.04 container, from <code>/srv/app</code>: a clean git repository, a <code>.env.production</code> containing <code>DEPLOY_HOST=vps</code>, and a stand-in <code>docker</code> (a two-line file that just exits 0), because only <code>--dry-run</code> was being exercised. The version published before that date had three lines that looked right and were not; all three are fixed in the listing above and marked "fixed".</p>
<p><strong>Bug 1 — the dry-run output fell apart.</strong> Real output of the old version:</p>
<div class="out">10:19:48 [INFO] building ghcr.io/cuonghoang1103/myapp:v1.4
[dry-run] docker
build
-t
ghcr.io/cuonghoang1103/myapp:v1.4
/srv/app</div>
<p><code>"\$*"</code> joins the arguments with the <em>first character of <code>IFS</code></em>. The script sets <code>IFS=\$'\\n\\t'</code> near the top, so the first character is a newline, and every <code>[dry-run]</code> line exploded into one word per line. The fix is one line inside <code>run()</code>: <code>local IFS=' '</code>, which changes the separator only inside that function. (Lesson 7.2's standalone <code>run()</code> was correct — it did not set <code>IFS</code>. The combination is what broke.)</p>
<p><strong>Bug 2 — the ERR trap never fired.</strong> With <code>DEPLOY_HOST</code> removed from <code>.env.production</code>, the old version printed only:</p>
<div class="out">10:20:12 [WARN] deploy failed with exit code 1</div>
<p>No line, no command: everything runs inside <code>main()</code>, and without <code>set -E</code> the ERR trap is not inherited by functions (Lesson 7.3). After changing the first line to <code>set -Eeuo pipefail</code>:</p>
<div class="out">10:20:23 [ERROR] line 117: cut -d= -f2
10:20:23 [ERROR] line 117: host=\$(grep -m1 '^DEPLOY_HOST=' "\$SCRIPT_DIR/.env.\$env" | cut -d= -f2)
10:20:23 [WARN] deploy failed with exit code 1</div>
<p>Now it names the line and the command (twice: once from inside the <code>\$( )</code> subshell, once from the assignment — <code>-E</code> reaches both). <strong>Bug 3</strong> appeared only after fixing bug 2: with <code>-E</code>, the ERR trap also fired when <code>cleanup</code> returned the non-zero code, adding a confusing <code>[ERROR] line 1: exit 1</code>. <code>trap - ERR</code> as the first action in <code>cleanup</code> removed it. Finally, the original listing showed the <code>ssh</code> line of the dry run as <code>docker pull '...'</code>; the real line keeps the image name and the four spaces left by the backslash-newline inside the double-quoted string, as now shown.</p>
<p>The same run also confirmed the guard rails, each exiting before anything was touched:</p>
<div class="out">$ ./deploy.sh production
10:49:25 [ERROR] refusing to deploy 'latest' to production — pass an explicit --tag
10:49:25 [WARN] deploy failed with exit code 1
$ ./deploy.sh --dry-run prod
10:49:26 [ERROR] environment must be staging or production, got: prod
10:49:26 [WARN] deploy failed with exit code 1
$ ./deploy.sh -x staging; echo "exit=\$?"
10:49:26 [ERROR] unknown option: -x
10:49:26 [WARN] deploy failed with exit code 1
exit=1</div>
<p>One inconsistency you may want to fix in your own copy: an unknown option goes through <code>die</code> and exits 1, while "no arguments" exits 2. Lesson 7.2's convention would use 2 for both.</p>

<h3>Chapter 7's common mistakes in one table</h3>
${slide('lx-07', 29, 'Sai lầm hay gặp ở Chương 7')}
<table>
<tr><th>Symptom</th><th>Real cause</th><th>Fix</th></tr>
<tr><td>"Deploy xong" but nothing changed</td><td>a failing <code>cd</code> inside an <code>&amp;&amp;</code> chain (exempt from -e)</td><td><code>cd … || die</code>, one step per line</td></tr>
<tr><td><code>\$'\\r': command not found</code></td><td>file saved with CRLF on Windows</td><td><code>sed -i 's/\\r\$//'</code> + <code>.gitattributes</code></td></tr>
<tr><td><code>[[: not found</code>, <code>Bad substitution</code></td><td><code>#!/bin/sh</code> is dash</td><td><code>#!/usr/bin/env bash</code></td></tr>
<tr><td>a failure inside a function does not stop the script</td><td><code>local x=\$(…)</code>, or the function was called from <code>if</code></td><td>declare and assign on two lines</td></tr>
<tr><td>script dies with no message</td><td>ERR trap without <code>set -E</code></td><td><code>set -Eeuo pipefail</code></td></tr>
<tr><td>"no such file: -v"</td><td>forgot <code>shift \$((OPTIND - 1))</code></td><td>shift after the getopts loop</td></tr>
<tr><td><code>/tmp</code> full of <code>tmp.*</code></td><td>cleanup on the last line instead of in a trap</td><td><code>mktemp -d</code> + <code>trap … EXIT</code> on the next line</td></tr>
<tr><td>five cron copies pile up</td><td>no lock</td><td><code>flock -n</code></td></tr>
<tr><td>token visible in the logs</td><td><code>set -x</code> left on</td><td>gate it behind <code>\${DEBUG:-0}</code></td></tr>
</table>

<h3>Run it step by step</h3>
<p>Reproduce the dry run yourself in a throwaway container — no real Docker, registry or server needed:</p>
<pre><code>docker run --rm -it ubuntu:24.04 bash
apt-get update &amp;&amp; apt-get install -y git curl util-linux
mkdir -p /srv/app &amp;&amp; cd /srv/app
<span class="tok-comment"># paste the complete script into deploy.sh, then:</span>
chmod +x deploy.sh
printf '#!/bin/sh\\nexit 0\\n' &gt; /usr/local/bin/docker &amp;&amp; chmod +x /usr/local/bin/docker   <span class="tok-comment"># stand-in docker</span>
echo DEPLOY_HOST=vps &gt; .env.production
git init -q &amp;&amp; printf '.env.*\\n' &gt; .gitignore
git add -A &amp;&amp; git -c user.name=an -c user.email=a@b commit -qm init
./deploy.sh --dry-run --tag v1.4 production        <span class="tok-comment"># the full dry run</span>
./deploy.sh production; echo "exit=\$?"             <span class="tok-comment"># refused: latest → production</span></code></pre>
<p>Expected: the dry run prints the nine lines shown under the listing (with your own clock time), and the second command is refused with exit 1. Then break it on purpose: delete the <code>local IFS=' '</code> line and run the dry run again — you should see bug 1; change <code>-Eeuo</code> back to <code>-euo</code> and empty <code>.env.production</code> — you should see bug 2.</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Piece of the script</th><th>Ubuntu / WSL2</th><th>macOS</th></tr>
<tr><td><code>flock</code> (line "exec 9&gt;…")</td><td>works</td><td><code>flock not found</code> — the script dies at the lock; test in a container or on the server</td></tr>
<tr><td><code>/var/lock</code></td><td>symlink to <code>/run/lock</code>, writable by everyone (mode 1777)</td><td>does not exist</td></tr>
<tr><td><code>\${*:2}</code>, <code>[[ =~ ]]</code>, <code>local</code></td><td>work</td><td>work in bash 3.2</td></tr>
<tr><td><code>readlink -f</code> alternative for <code>SCRIPT_DIR</code></td><td>works</td><td>works on macOS 12.3+</td></tr>
</table>
<p>This is a server script; it is meant to run on Linux. The practical rule for a mixed team is: edit anywhere, but run and test in the same environment as production — an <code>ubuntu:24.04</code> container, WSL2, or the VPS itself.</p>

<h3>🧪 Practice (15–20 min)</h3>
${slide('lx-07', 32, 'Thực hành Chương 7 (45 phút): gia cố backup.sh của nhóm')}
<div class="callout ok"><p><strong>Situation:</strong> your SWP391 team wants to adopt this script for its own project, whose health route is <code>/api/health</code> and whose image lives in a different registry. Adapt it and prove it works without touching a real server.</p><ol>
<li>Change <code>REGISTRY</code>, the smoke-test URL and the service name; keep every guard.</li>
<li>Set it up in a container as in "Run it step by step" and run <code>shellcheck deploy.sh</code> (<code>apt-get install -y shellcheck</code>) until it is clean.</li>
<li>Run the four cases: full dry run; <code>production</code> without <code>--tag</code>; an unknown environment; <code>.env.production</code> without <code>DEPLOY_HOST</code>.</li>
<li>Make "unknown option" exit 2 instead of 1, and check it with <code>echo \$?</code>.</li>
<li>Run two dry runs at the same time (<code>./deploy.sh -n -t v1 staging &amp; ./deploy.sh -n -t v1 staging</code>) with a <code>sleep 2</code> added after the lock, and read what the second one prints.</li></ol>
<p><strong>Done when:</strong> the dry run shows one <code>[dry-run]</code> line per command, on one line each; the missing-host case names the line that failed; unknown options exit 2; the concurrent run prints "another deploy is already running"; and ShellCheck is clean.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Entry point (<code>main "\$@"</code>)</span><span class="v">The single function where execution starts, called on the last line.</span></div>
  <div class="kv"><span class="k">Guard / preflight check</span><span class="v">A condition that must hold before any work; failing it exits with a message.</span></div>
  <div class="kv"><span class="k">Smoke test</span><span class="v">A quick check of the result a user would see (e.g. an HTTP status) after deploying.</span></div>
  <div class="kv"><span class="k">Floating tag (<code>latest</code>)</span><span class="v">An image name that points to different content over time; not reproducible.</span></div>
  <div class="kv"><span class="k"><code>IFS</code></span><span class="v">Internal Field Separator: the characters used to split words — and to join <code>"\$*"</code>.</span></div>
  <div class="kv"><span class="k">stdout / stderr</span><span class="v">fd 1 for data a caller may capture, fd 2 for messages meant for people.</span></div>
  <div class="kv"><span class="k">Orchestration</span><span class="v">Deciding the order of other programs and checking their results — what bash is best at.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A production script is nine blocks: strict mode, constants, logging, cleanup+traps, run/usage, parsing, preflight, lock, work + verification.</li>
<li>Functions return data on stdout and talk to people on stderr, so <code>\$(func)</code> captures only the value.</li>
<li>With <code>IFS=\$'\\n\\t'</code>, <code>"\$*"</code> joins with newlines — set <code>local IFS=' '</code> where you print it.</li>
<li>Scripts built around <code>main()</code> need <code>set -E</code> for the ERR trap, and <code>trap - ERR</code> at the start of cleanup.</li>
<li>End a deploy with a check of what users see (a smoke test), not with "done".</li>
<li>Run what you publish: re-running this chapter's own scripts found three real bugs that reading had missed.</li>
</ul>

<a class="link-card" href="https://google.github.io/styleguide/shellguide.html#s1.1-which-shell-to-use" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Google Shell Style Guide — "When to use Shell"</span><span class="lc-sub">Their rule is blunt: if it is more than about 100 lines or has non-trivial control flow, rewrite it. Worth reading as a counterweight to writing everything in bash.</span></span>
</a>
<a class="link-card" href="https://github.com/dylanaraps/pure-bash-bible" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Pure Bash Bible</span><span class="lc-sub">How to do common tasks with bash builtins instead of external processes. Useful as a reference, and as a demonstration of where bash's limits actually are.</span></span>
</a>
<a class="link-card" href="https://github.com/awesome-lists/awesome-bash" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Awesome Bash</span><span class="lc-sub">Curated tooling: linters, formatters (<code>shfmt</code>), test frameworks and libraries worth knowing before you write your own.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: ship a script</span><span class="lc-sub">Build a deploy script from the skeleton up, passing every item on the checklist above. Graded on the checks, not the output.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> a script that reports success after doing only part of the job. The classic version deploys the new image, fails to restart the container, and exits 0 because the last command in the pipeline happened to succeed. The user sees "deployed" and moves on; production is still running the old code. Two defences: <code>set -euo pipefail</code> so an intermediate failure stops everything, and a verification step at the end — the smoke test above — that checks the outcome rather than the steps. <strong>A deploy script's last line should test what a user would see, not report what the script did.</strong></div>
<p class="note-ct"><strong>Keep this script as your template.</strong> It is not long, and every block earns its place: strict mode, logging to stderr, argument parsing, validation, preflight, a lock, a cleanup trap, a dry-run wrapper, and a verification at the end. Starting from it is faster than starting from an empty file, and the parts you do not need are quicker to delete than the parts you would otherwise forget to add.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.5</span>
<h2>Một script hoàn chỉnh</h2>
<p class="lead">Mọi thứ trong chương này, lắp lại thành một script mà bạn đưa vào kho mã ngay hôm nay cũng được. Hãy đọc nó theo từng khối — mỗi khối là một bài bạn đã học rồi, và giá trị nằm ở chỗ thấy chúng khớp vào nhau ra sao chứ không nằm ở bất kỳ dòng đơn lẻ nào.</p>

<h3>Toàn bộ script</h3>
${slide('lx-07', 24, 'Script hoàn chỉnh = 9 khối, mỗi khối là một bài đã học')}
<pre><code>#!/usr/bin/env bash
#
# deploy.sh — dựng, đẩy và phát hành ứng dụng
# Cách dùng: deploy.sh [tuỳ chọn] &lt;staging|production&gt;

set -Eeuo pipefail            <span class="tok-comment"># -E: bẫy ERR nổ được cả trong hàm (sửa 28/09/2026, xem bên dưới)</span>
IFS=\$'\\n\\t'

<span class="tok-comment">#─── hằng số ──────────────────────────────────────────────────</span>
readonly SCRIPT_DIR=\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" &amp;&amp; pwd)
readonly SCRIPT_NAME=\${0##*/}
readonly LOCKFILE=/var/lock/\${SCRIPT_NAME%.sh}.lock
readonly REGISTRY=ghcr.io/cuonghoang1103

<span class="tok-comment">#─── trạng thái ───────────────────────────────────────────────</span>
env=""
tag="latest"
dry_run=0
tmpdir=""

<span class="tok-comment">#─── ghi log (7.4) ────────────────────────────────────────────</span>
log()  { printf '%s [%s] %s\\n' "\$(date +%T)" "\$1" "\${*:2}" &gt;&amp;2; }
info() { log INFO "\$@"; }
warn() { log WARN "\$@"; }
die()  { log ERROR "\$@"; exit 1; }

<span class="tok-comment">#─── dọn dẹp (7.3) ────────────────────────────────────────────</span>
cleanup() {
  local rc=\$?
  trap - ERR                  <span class="tok-comment"># không để ERR báo lần hai từ trong cleanup (đã sửa)</span>
  [[ -n \$tmpdir ]] &amp;&amp; rm -rf "\$tmpdir"
  (( rc != 0 )) &amp;&amp; warn "deploy hỏng với mã thoát \$rc"
  return \$rc
}
trap cleanup EXIT
trap 'log ERROR "dòng \$LINENO: \$BASH_COMMAND"' ERR

<span class="tok-comment">#─── hàm bọc cho chạy thử (7.2) ───────────────────────────────</span>
run() {
  if (( dry_run )); then
    local IFS=' '             <span class="tok-comment"># IFS=\$'\\n\\t' ở trên sẽ nối "\$*" bằng XUỐNG DÒNG (đã sửa)</span>
    printf '[chạy thử] %s\\n' "\$*" &gt;&amp;2
  else
    "\$@"
  fi
}

<span class="tok-comment">#─── trợ giúp (7.2) ───────────────────────────────────────────</span>
usage() {
  cat &lt;&lt;EOF
\${SCRIPT_NAME} — dựng, đẩy và phát hành ứng dụng

Cách dùng:
  \${SCRIPT_NAME} [tuỳ chọn] &lt;staging|production&gt;

Tuỳ chọn:
  -t, --tag TAG   tag của ảnh (mặc định: latest)
  -n, --dry-run   in ra những gì SẼ chạy, không đổi gì
  -h, --help      phần trợ giúp này

Ví dụ:
  \${SCRIPT_NAME} staging
  \${SCRIPT_NAME} --tag v1.4 --dry-run production
EOF
}

<span class="tok-comment">#─── phân tích tham số (7.2) ──────────────────────────────────</span>
parse_args() {
  while [[ \$# -gt 0 ]]; do
    case \$1 in
      -h|--help)    usage; exit 0 ;;
      -n|--dry-run) dry_run=1; shift ;;
      -t|--tag)     tag=\${2:?--tag cần một giá trị}; shift 2 ;;
      --tag=*)      tag=\${1#*=}; shift ;;
      --)           shift; break ;;
      -*)           die "tuỳ chọn không rõ: \$1" ;;
      *)            env=\$1; shift ;;
    esac
  done

  [[ -n \$env ]] || { usage; exit 2; }
  case \$env in
    staging|production) ;;
    *) die "môi trường phải là staging hoặc production, nhận được: \$env" ;;
  esac
  [[ \$tag =~ ^[a-zA-Z0-9._-]+\$ ]] || die "tag không hợp lệ: \$tag"
}

<span class="tok-comment">#─── điều kiện tiên quyết (7.2) ───────────────────────────────</span>
preflight() {
  local cmd
  for cmd in docker git; do
    command -v "\$cmd" &gt;/dev/null || die "cần có \$cmd nhưng chưa được cài"
  done

  docker info &amp;&gt;/dev/null || die "daemon docker không chạy"
  [[ -f "\$SCRIPT_DIR/.env.\$env" ]] || die "thiếu .env.\$env"
  [[ -z \$(git status --porcelain) ]] || die "cây làm việc còn thay đổi — hãy commit trước"

  if [[ \$env == production &amp;&amp; \$tag == latest ]]; then
    die "từ chối phát hành 'latest' lên production — hãy truyền --tag tường minh"
  fi
}

<span class="tok-comment">#─── phần việc ────────────────────────────────────────────────</span>
build_and_push() {
  local image="\$REGISTRY/myapp:\$tag"
  info "đang dựng \$image"
  run docker build -t "\$image" "\$SCRIPT_DIR"
  info "đang đẩy \$image"
  run docker push "\$image"
  printf '%s\\n' "\$image"
}

release() {
  local image=\$1 host
  host=\$(grep -m1 '^DEPLOY_HOST=' "\$SCRIPT_DIR/.env.\$env" | cut -d= -f2)
  [[ -n \$host ]] || die "chưa đặt DEPLOY_HOST trong .env.\$env"

  info "đang phát hành lên \$host"
  run ssh "\$host" "docker pull '\$image' &amp;&amp; \\
    docker compose -p myapp up -d --no-build backend"
}

smoke_test() {
  local url=\$1 code
  info "đang chốt kiểm \$url"
  (( dry_run )) &amp;&amp; { printf '[chạy thử] curl %s\\n' "\$url" &gt;&amp;2; return 0; }

  code=\$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "\$url" || echo 000)
  case \$code in
    200|401) info "tuyến đã sống (HTTP \$code)" ;;
    404)     die "tuyến trả về 404 — bản dựng cũ hoặc dựng dở" ;;
    000)     die "không có hồi đáp từ \$url" ;;
    *)       die "HTTP \$code bất thường từ \$url" ;;
  esac
}

<span class="tok-comment">#─── điểm vào (7.1) ───────────────────────────────────────────</span>
main() {
  parse_args "\$@"

  exec 9&gt;"\$LOCKFILE"
  flock -n 9 || { warn "đã có một lần deploy khác đang chạy"; exit 0; }

  preflight
  tmpdir=\$(mktemp -d)

  local image
  image=\$(build_and_push)
  release "\$image"
  smoke_test "https://cuongthai.com/api/v1/posts"

  info "đã deploy \$tag lên \$env"
}

main "\$@"</code></pre>
<div class="out">$ ./deploy.sh --dry-run --tag v1.4 production
14:58:02 [INFO] đang dựng ghcr.io/cuonghoang1103/myapp:v1.4
[chạy thử] docker build -t ghcr.io/cuonghoang1103/myapp:v1.4 /srv/app
14:58:02 [INFO] đang đẩy ghcr.io/cuonghoang1103/myapp:v1.4
[chạy thử] docker push ghcr.io/cuonghoang1103/myapp:v1.4
14:58:02 [INFO] đang phát hành lên vps
[chạy thử] ssh vps docker pull 'ghcr.io/cuonghoang1103/myapp:v1.4' &amp;&amp;     docker compose -p myapp up -d --no-build backend
14:58:02 [INFO] đang chốt kiểm https://cuongthai.com/api/v1/posts
[chạy thử] curl https://cuongthai.com/api/v1/posts
14:58:02 [INFO] đã deploy v1.4 lên production</div>

<h3>Vì sao có từng khối một</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chế độ nghiêm ngặt + <code>main "\$@"</code></span><span class="v">Không gì chạy cho tới khi cả file phân tích xong, và mọi thất bại đều làm script dừng thay vì chạy tiếp sang bước sau (7.1).</span></div>
  <div class="kv"><span class="k">Phân tích, rồi kiểm, rồi tiền kiểm</span><span class="v">Ba giai đoạn riêng biệt, mỗi cái thoát ra kèm một thông điệp. Hỏng ở bất kỳ giai đoạn nào cũng để production nguyên vẹn (7.2).</span></div>
  <div class="kv"><span class="k"><code>flock</code> trước mọi phần việc</span><span class="v">Hai người deploy cùng lúc là một sự cố có thật. Khoá được thả khi tiến trình chết, chết kiểu gì cũng thả (7.3).</span></div>
  <div class="kv"><span class="k"><code>trap cleanup EXIT</code></span><span class="v">Thư mục tạm biến mất khi thành công, khi thất bại, và khi bị Ctrl-C (7.3).</span></div>
  <div class="kv"><span class="k">Hàm bọc <code>run</code></span><span class="v">Mọi lệnh phá huỷ đều soi được bằng <code>--dry-run</code>, và dạng được in ra chính xác là dạng sẽ chạy (7.2).</span></div>
  <div class="kv"><span class="k">Chốt kiểm ở cuối</span><span class="v">Một lần deploy CHẠY XONG không có nghĩa là một lần deploy CHẠY ĐƯỢC. Một mã 404 ở đây nghĩa là bản dựng cũ — đúng kiểu hỏng mà chính dự án này gặp ngày 02/07/2026.</span></div>
</div>
<div class="callout ok">Để ý cái chốt <code>production</code> + <code>latest</code> trong <code>preflight</code>. Nó mã hoá một chính sách — "đừng bao giờ phát hành một tag trôi nổi lên production" — thành một phép kiểm mà script BẮT BUỘC thi hành, thay vì thành một quy tắc mà người ta được nhờ ghi nhớ. Đó là loại dòng có đòn bẩy cao nhất trong một script vận hành: nó biến một thứ KHÔNG ĐƯỢC PHÉP xảy ra thành một thứ <em>KHÔNG THỂ</em> xảy ra.</div>

<h3>Hàm trả dữ liệu qua stdout, trả trạng thái qua mã thoát</h3>
${slide('lx-07', 25, 'stdout mang giá trị, stderr mang log — nên $(…) hứng sạch')}
<pre><code>image=\$(build_and_push)      <span class="tok-comment"># chỉ hứng đúng lệnh printf ở dòng cuối</span>
release "\$image"</code></pre>
<p><code>build_and_push</code> ghi tiến độ bằng <code>info</code> — thứ đi ra stderr — và in tên ảnh ra stdout. Nên người gọi hứng được một giá trị sạch trong khi con người vẫn nhìn thấy phần log. Chính sự tách bạch đó (Bài 6.5) làm cho hàm shell ghép nối được với nhau; một hàm ghi log ra stdout thì không bao giờ hứng được output của nó.</p>

<h3>Khi nào nên thôi dùng bash</h3>
${slide('lx-07', 27, 'Khi nào thôi dùng bash — và 7 mục kiểm trước khi commit')}
<p>Shell rất giỏi việc điều phối các chương trình khác và kém ở gần như mọi thứ còn lại. Đây là những dấu hiệu cho thấy một script đã vượt quá tầm của nó:</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Cấu trúc dữ liệu</span><span class="lz-lnote">Bạn cần dữ liệu lồng nhau, hoặc một danh sách bản ghi có nhiều trường. Bash có mảng một chiều và mảng liên kết, và không cái nào lồng được. Phân tích JSON bằng <code>jq</code> bên trong một vòng lặp là dấu hiệu cảnh báo; DỰNG JSON bằng <code>printf</code> là cờ đỏ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Số học</span><span class="lz-lnote">Mọi thứ có phần thập phân. Chỉ chia được số nguyên (Bài 6.1) nghĩa là phần trăm, trung bình và tỉ lệ đều sai hoặc đều phải nhờ tới <code>bc</code>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Xử lý lỗi</span><span class="lz-lnote">Bạn cần thử lại có giãn cách, phân biệt các loại lỗi, hoặc dọn dẹp phần việc đã làm dở. <code>trap</code> phủ được lúc thoát; nó không cho bạn cơ chế ngoại lệ.</span></div>
  <div class="lz-layer"><span class="lz-lname">Độ dài</span><span class="lz-lnote">Quá khoảng 300 dòng, hoặc khi nó có nhiều hơn dăm bảy hàm. Bash không có mô-đun và không có không gian tên, nên một script lớn là một phạm vi toàn cục phẳng lì.</span></div>
  <div class="lz-layer"><span class="lz-lname">Kiểm thử</span><span class="lz-lnote">Bạn muốn kiểm thử đơn vị cho phần logic chứ không phải kiểm thử đầu-cuối cho hành vi. <code>bats</code> giỏi cái sau và vụng về với cái trước.</span></div>
  <div class="lz-layer"><span class="lz-lname">Đồng thời</span><span class="lz-lnote">Vượt quá <code>&amp;</code> cộng <code>wait</code> hay <code>xargs -P</code>. Điều phối các tiến trình thợ, gom kết quả, xử lý thất bại từng phần — đó là một CHƯƠNG TRÌNH, không phải một script.</span></div>
</div>
<div class="callout"><strong>Thứ bash vẫn giỏi nhất:</strong> dán những lệnh vốn đã tồn tại lại với nhau. Script ở trên dài 90 dòng vì docker, git, ssh và curl mới là thứ làm phần việc thật — bash chỉ quyết định thứ tự, kiểm điều kiện tiên quyết và báo cáo. Viết lại nó bằng Python sẽ làm nó DÀI hơn mà chẳng rõ hơn. Khoảnh khắc nó bắt đầu <em>TÍNH TOÁN</em> thay vì <em>ĐIỀU PHỐI</em>, phép tính đó đảo chiều.</div>
<pre><code><span class="tok-comment"># Một điểm dung hoà hợp lý: giữ phần điều phối trong bash,</span>
<span class="tok-comment"># chuyển phần logic sang một chương trình mà bash gọi tới.</span>
manifest=\$(python3 "\$SCRIPT_DIR/build_manifest.py" --env "\$env")
run docker build --build-arg "MANIFEST=\$manifest" .</code></pre>

<h3>Một bảng kiểm trước khi commit một script</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Chạy sạch</span><span class="v"><code>shellcheck script.sh</code> không báo gì, hoặc mọi lệnh disable đều có nêu lý do.</span></div>
  <div class="kv"><span class="k">Phân tích được</span><span class="v"><code>bash -n script.sh</code> im lặng.</span></div>
  <div class="kv"><span class="k">Tự giải thích</span><span class="v"><code>./script.sh --help</code> hiện cách dùng và ít nhất một ví dụ.</span></div>
  <div class="kv"><span class="k">Từ chối đầu vào hỏng</span><span class="v">Không tham số, sai tham số, và thiếu một thứ phụ thuộc — mỗi trường hợp thoát khác 0 với một thông điệp riêng trên stderr.</span></div>
  <div class="kv"><span class="k">An toàn khi chạy lại</span><span class="v">Chạy hai lần không nhân đôi phần việc và không hỏng (Bài 7.3).</span></div>
  <div class="kv"><span class="k">Có dọn dẹp</span><span class="v">Ctrl-C giữa chừng không để lại file tạm nào và không giữ khoá nào.</span></div>
  <div class="kv"><span class="k">Sống sót với tên hiểm ác</span><span class="v">Đã thử với một thư mục chứa <code>'a b.txt'</code>, <code>'-rf'</code> và <code>'*'</code>.</span></div>
</div>

<h3>Chạy thật script hoàn chỉnh thì lộ ra gì</h3>
${slide('lx-07', 26, 'Chạy lại bản cũ lộ hai lỗi thật: IFS và thiếu -E')}
<p>Script ở trên đã được chạy thật ngày 28/09/2026 trong container Ubuntu 24.04, từ <code>/srv/app</code>: một kho git sạch, một <code>.env.production</code> chứa <code>DEPLOY_HOST=vps</code>, và một <code>docker</code> giả (file hai dòng chỉ <code>exit 0</code>), vì chỉ chạy thử chế độ <code>--dry-run</code>. Bản đăng trước ngày đó có ba dòng trông thì đúng mà không đúng; cả ba đã được sửa trong đoạn mã ở trên và ghi chú "đã sửa". (Lỗi 1 và các chốt chặn ghi từ bản tiếng Anh của script; bản tiếng Việt ở trên cũng đã chạy thật sau khi sửa — output chạy thử của nó chính là khung output ngay dưới đoạn mã.)</p>
<p><strong>Lỗi 1 — output chạy thử vỡ vụn.</strong> Output thật của bản cũ:</p>
<div class="out">10:19:48 [INFO] building ghcr.io/cuonghoang1103/myapp:v1.4
[dry-run] docker
build
-t
ghcr.io/cuonghoang1103/myapp:v1.4
/srv/app</div>
<p><code>"\$*"</code> nối các tham số bằng <em>ký tự đầu tiên của <code>IFS</code></em>. Script đặt <code>IFS=\$'\\n\\t'</code> ở gần đầu file, nên ký tự đầu là xuống dòng, và mỗi dòng <code>[chạy thử]</code> vỡ thành mỗi từ một dòng. Cách sửa là một dòng trong <code>run()</code>: <code>local IFS=' '</code>, chỉ đổi dấu nối bên trong hàm đó. (Hàm <code>run()</code> đứng riêng ở Bài 7.2 thì đúng — nó không đặt <code>IFS</code>. Chính việc ghép hai thứ lại mới làm hỏng.)</p>
<p><strong>Lỗi 2 — bẫy ERR không bao giờ nổ.</strong> Xoá <code>DEPLOY_HOST</code> khỏi <code>.env.production</code>, bản cũ chỉ in:</p>
<div class="out">10:20:12 [WARN] deploy failed with exit code 1</div>
<p>Không dòng, không lệnh: mọi thứ chạy bên trong <code>main()</code>, mà thiếu <code>set -E</code> thì bẫy ERR không được hàm thừa hưởng (Bài 7.3). Sau khi đổi dòng đầu thành <code>set -Eeuo pipefail</code>:</p>
<div class="out">10:51:36 [ERROR] dòng 117: cut -d= -f2
10:51:36 [ERROR] dòng 117: host=\$(grep -m1 '^DEPLOY_HOST=' "\$SCRIPT_DIR/.env.\$env" | cut -d= -f2)
10:51:36 [WARN] deploy hỏng với mã thoát 1</div>
<p>Giờ nó gọi tên dòng và câu lệnh (hai lần: một lần từ bên trong shell con của <code>\$( )</code>, một lần từ phép gán — <code>-E</code> vươn tới cả hai). <strong>Lỗi 3</strong> chỉ lộ ra sau khi sửa lỗi 2: có <code>-E</code> thì bẫy ERR còn nổ khi <code>cleanup</code> trả về mã khác 0, thêm một dòng khó hiểu <code>[ERROR] line 1: exit 1</code>. Đặt <code>trap - ERR</code> làm việc đầu tiên trong <code>cleanup</code> là hết. Cuối cùng, đoạn mã gốc in dòng <code>ssh</code> của lần chạy thử là <code>docker pull '...'</code>; dòng thật giữ nguyên tên ảnh và bốn dấu cách còn lại sau cặp gạch-chéo-xuống-dòng trong chuỗi nháy kép, như giờ đã sửa.</p>
<p>Cùng lần chạy đó cũng xác nhận các chốt chặn, cái nào cũng thoát trước khi đụng vào bất cứ gì:</p>
<div class="out">$ ./deploy.sh production
10:49:25 [ERROR] refusing to deploy 'latest' to production — pass an explicit --tag
10:49:25 [WARN] deploy failed with exit code 1
$ ./deploy.sh --dry-run prod
10:49:26 [ERROR] environment must be staging or production, got: prod
10:49:26 [WARN] deploy failed with exit code 1
$ ./deploy.sh -x staging; echo "exit=\$?"
10:49:26 [ERROR] unknown option: -x
10:49:26 [WARN] deploy failed with exit code 1
exit=1</div>
<p>Một chỗ chưa nhất quán bạn có thể muốn sửa trong bản của mình: cờ lạ đi qua <code>die</code> nên thoát mã 1, trong khi "không có tham số" thoát mã 2. Theo quy ước của Bài 7.2 thì cả hai nên là 2.</p>

<h3>Những sai lầm hay gặp của Chương 7 trong một bảng</h3>
${slide('lx-07', 29, 'Sai lầm hay gặp ở Chương 7')}
<table>
<tr><th>Triệu chứng</th><th>Nguyên nhân thật</th><th>Sửa</th></tr>
<tr><td>Báo "Deploy xong" mà chẳng có gì đổi</td><td><code>cd</code> hỏng trong chuỗi <code>&amp;&amp;</code> (được miễn khỏi -e)</td><td><code>cd … || die</code>, mỗi bước một dòng</td></tr>
<tr><td><code>\$'\\r': command not found</code></td><td>file lưu kiểu CRLF trên Windows</td><td><code>sed -i 's/\\r\$//'</code> + <code>.gitattributes</code></td></tr>
<tr><td><code>[[: not found</code>, <code>Bad substitution</code></td><td><code>#!/bin/sh</code> là dash</td><td><code>#!/usr/bin/env bash</code></td></tr>
<tr><td>lỗi trong hàm mà script không dừng</td><td><code>local x=\$(…)</code>, hoặc hàm được gọi từ <code>if</code></td><td>khai báo và gán trên hai dòng</td></tr>
<tr><td>script chết không một lời</td><td>bẫy ERR thiếu <code>set -E</code></td><td><code>set -Eeuo pipefail</code></td></tr>
<tr><td>"no such file: -v"</td><td>quên <code>shift \$((OPTIND - 1))</code></td><td>shift sau vòng getopts</td></tr>
<tr><td><code>/tmp</code> đầy <code>tmp.*</code></td><td>dọn ở dòng cuối thay vì trong bẫy</td><td><code>mktemp -d</code> + <code>trap … EXIT</code> ngay dòng sau</td></tr>
<tr><td>năm bản cron chồng lên nhau</td><td>không có khoá</td><td><code>flock -n</code></td></tr>
<tr><td>token lộ trong log</td><td>quên tắt <code>set -x</code></td><td>chỉ bật qua <code>\${DEBUG:-0}</code></td></tr>
</table>

<h3>Chạy thử từng bước</h3>
<p>Tự tái hiện lần chạy thử trong một container vứt đi — không cần Docker thật, registry hay máy chủ:</p>
<pre><code>docker run --rm -it ubuntu:24.04 bash
apt-get update &amp;&amp; apt-get install -y git curl util-linux
mkdir -p /srv/app &amp;&amp; cd /srv/app
<span class="tok-comment"># dán script hoàn chỉnh vào deploy.sh, rồi:</span>
chmod +x deploy.sh
printf '#!/bin/sh\\nexit 0\\n' &gt; /usr/local/bin/docker &amp;&amp; chmod +x /usr/local/bin/docker   <span class="tok-comment"># docker giả</span>
echo DEPLOY_HOST=vps &gt; .env.production
git init -q &amp;&amp; printf '.env.*\\n' &gt; .gitignore
git add -A &amp;&amp; git -c user.name=an -c user.email=a@b commit -qm init
./deploy.sh --dry-run --tag v1.4 production        <span class="tok-comment"># chạy thử trọn vẹn</span>
./deploy.sh production; echo "mã=\$?"               <span class="tok-comment"># bị từ chối: latest → production</span></code></pre>
<p>Kết quả mong đợi: lần chạy thử in chín dòng như dưới đoạn mã (giờ theo đồng hồ của bạn), và lệnh thứ hai bị từ chối với mã 1. Rồi cố ý làm hỏng: xoá dòng <code>local IFS=' '</code> và chạy thử lại — bạn sẽ thấy lỗi 1; đổi <code>-Eeuo</code> về <code>-euo</code> và làm rỗng <code>.env.production</code> — bạn sẽ thấy lỗi 2.</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Mẩu của script</th><th>Ubuntu / WSL2</th><th>macOS</th></tr>
<tr><td><code>flock</code> (dòng "exec 9&gt;…")</td><td>chạy được</td><td><code>flock not found</code> — script chết ở chỗ khoá; kiểm trong container hoặc trên máy chủ</td></tr>
<tr><td><code>/var/lock</code></td><td>liên kết tới <code>/run/lock</code>, ai cũng ghi được (quyền 1777)</td><td>không tồn tại</td></tr>
<tr><td><code>\${*:2}</code>, <code>[[ =~ ]]</code>, <code>local</code></td><td>chạy được</td><td>chạy được trên bash 3.2</td></tr>
<tr><td><code>readlink -f</code> thay cho cách lấy <code>SCRIPT_DIR</code></td><td>chạy được</td><td>chạy được từ macOS 12.3</td></tr>
</table>
<p>Đây là script cho máy chủ; nó được viết để chạy trên Linux. Quy tắc thực tế cho một nhóm dùng lẫn máy: sửa ở đâu cũng được, nhưng chạy và kiểm trong đúng môi trường giống production — một container <code>ubuntu:24.04</code>, WSL2, hoặc chính VPS.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
${slide('lx-07', 32, 'Thực hành Chương 7 (45 phút): gia cố backup.sh của nhóm')}
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm SWP391 của bạn muốn dùng script này cho dự án của mình, có route kiểm tra sức khoẻ là <code>/api/health</code> và ảnh nằm ở một registry khác. Hãy chỉnh nó và chứng minh nó chạy đúng mà không đụng tới máy chủ thật.</p><ol>
<li>Đổi <code>REGISTRY</code>, URL của smoke test và tên dịch vụ; giữ nguyên mọi chốt chặn.</li>
<li>Dựng trong container như mục "Chạy thử từng bước" và chạy <code>shellcheck deploy.sh</code> (<code>apt-get install -y shellcheck</code>) tới khi sạch.</li>
<li>Chạy bốn ca: chạy thử trọn vẹn; <code>production</code> không có <code>--tag</code>; môi trường lạ; <code>.env.production</code> thiếu <code>DEPLOY_HOST</code>.</li>
<li>Cho "cờ lạ" thoát mã 2 thay vì 1, và kiểm bằng <code>echo \$?</code>.</li>
<li>Chạy hai lần chạy thử cùng lúc (<code>./deploy.sh -n -t v1 staging &amp; ./deploy.sh -n -t v1 staging</code>) sau khi thêm <code>sleep 2</code> ngay sau chỗ lấy khoá, rồi đọc xem bản thứ hai in gì.</li></ol>
<p><strong>Đạt khi:</strong> lần chạy thử in mỗi lệnh đúng một dòng <code>[dry-run]</code>; ca thiếu host gọi tên được dòng hỏng; cờ lạ thoát mã 2; lần chạy song song in "another deploy is already running"; và ShellCheck sạch.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Entry point <code>main "\$@"</code> (điểm vào)</span><span class="v">Hàm duy nhất nơi việc thực thi bắt đầu, được gọi ở dòng cuối.</span></div>
  <div class="kv"><span class="k">Guard / preflight (chốt chặn / tiền kiểm)</span><span class="v">Điều kiện phải đúng trước mọi phần việc; sai thì thoát kèm lời nhắn.</span></div>
  <div class="kv"><span class="k">Smoke test (kiểm khói)</span><span class="v">Phép kiểm nhanh kết quả người dùng sẽ thấy (ví dụ mã HTTP) sau khi deploy.</span></div>
  <div class="kv"><span class="k">Floating tag <code>latest</code> (nhãn trôi)</span><span class="v">Tên ảnh trỏ tới nội dung khác nhau theo thời gian; không tái lập được.</span></div>
  <div class="kv"><span class="k"><code>IFS</code> (dấu tách trường)</span><span class="v">Các ký tự dùng để chẻ từ — và để nối <code>"\$*"</code>.</span></div>
  <div class="kv"><span class="k">stdout / stderr (luồng ra / luồng lỗi)</span><span class="v">fd 1 cho dữ liệu người gọi có thể hứng, fd 2 cho lời nhắn dành cho người đọc.</span></div>
  <div class="kv"><span class="k">Orchestration (điều phối)</span><span class="v">Quyết định thứ tự các chương trình khác và kiểm kết quả của chúng — việc bash giỏi nhất.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Một script production gồm chín khối: strict mode, hằng số, ghi log, cleanup + bẫy, run/usage, phân tích tham số, tiền kiểm, khoá, phần việc + xác minh.</li>
<li>Hàm trả dữ liệu qua stdout và nói với người qua stderr, nên <code>\$(hàm)</code> chỉ hứng đúng giá trị.</li>
<li>Với <code>IFS=\$'\\n\\t'</code>, <code>"\$*"</code> nối bằng xuống dòng — đặt <code>local IFS=' '</code> ở chỗ in nó ra.</li>
<li>Script xây quanh <code>main()</code> cần <code>set -E</code> cho bẫy ERR, và <code>trap - ERR</code> ở đầu cleanup.</li>
<li>Kết thúc một lần deploy bằng việc kiểm thứ người dùng nhìn thấy (smoke test), không phải bằng chữ "xong".</li>
<li>Hãy chạy thứ mình công bố: chạy lại chính các script của chương này đã tìm ra ba lỗi thật mà đọc không thấy.</li>
</ul>

<a class="link-card" href="https://google.github.io/styleguide/shellguide.html#s1.1-which-shell-to-use" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Google Shell Style Guide — "Khi nào dùng Shell"</span><span class="lc-sub">Luật của họ nói thẳng: nếu quá khoảng 100 dòng hoặc có luồng điều khiển không tầm thường thì hãy viết lại. Đáng đọc như một đối trọng với thói quen viết mọi thứ bằng bash.</span></span>
</a>
<a class="link-card" href="https://github.com/dylanaraps/pure-bash-bible" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Pure Bash Bible</span><span class="lc-sub">Cách làm những việc thường gặp bằng lệnh dựng sẵn của bash thay vì gọi tiến trình ngoài. Hữu ích như một sổ tra, và cũng là một minh chứng cho việc giới hạn của bash thật sự nằm ở đâu.</span></span>
</a>
<a class="link-card" href="https://github.com/awesome-lists/awesome-bash" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Awesome Bash</span><span class="lc-sub">Bộ công cụ được tuyển chọn: bộ soi lỗi, bộ định dạng (<code>shfmt</code>), khung kiểm thử và thư viện đáng biết trước khi bạn tự viết cái của mình.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đưa một script lên bờ</span><span class="lc-sub">Dựng một script deploy từ bộ khung lên, qua được mọi mục trong bảng kiểm ở trên. Chấm điểm theo các phép kiểm, không theo output.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> một script báo cáo thành công sau khi chỉ làm được một phần việc. Phiên bản kinh điển là: nó deploy ảnh mới, không khởi động lại được container, rồi thoát ra với mã 0 vì lệnh cuối trong chuỗi ống tình cờ thành công. Người dùng thấy chữ "đã deploy" rồi đi tiếp; production vẫn đang chạy mã cũ. Hai lớp phòng thủ: <code>set -euo pipefail</code> để một thất bại ở giữa làm dừng mọi thứ, và một bước xác minh ở cuối — chính là cái chốt kiểm ở trên — kiểm KẾT QUẢ chứ không kiểm các BƯỚC. <strong>Dòng cuối của một script deploy nên kiểm thứ mà NGƯỜI DÙNG sẽ thấy, chứ không phải báo cáo thứ mà script đã làm.</strong></div>
<p class="note-ct"><strong>Hãy giữ script này làm khuôn mẫu của bạn.</strong> Nó không dài, và mỗi khối đều xứng đáng có mặt: chế độ nghiêm ngặt, ghi log ra stderr, phân tích tham số, kiểm tính hợp lệ, tiền kiểm, một cái khoá, một trap dọn dẹp, một hàm bọc chạy thử, và một bước xác minh ở cuối. Bắt đầu từ nó thì nhanh hơn bắt đầu từ một file trống, và những phần bạn không cần thì xoá đi nhanh hơn nhiều so với những phần mà nếu không có nó bạn sẽ quên thêm vào.</p>
</div>
`,
    },
    /* ─────────────────────────── 7.6 Quiz ─────────────────────────── */
    {
      title: '7.6 — Chapter 7 quiz|||7.6 — Kiểm tra Chương 7',
      slug: 'lnx-7-6-quiz',
      type: 'QUIZ',
      description: 'Mười câu tình huống, đáp án đã chạy thật: cd hỏng giữa chuỗi &&, lệnh nào làm set -e dừng, file CRLF, $@ không nháy, getopts dừng ở tham số đầu, bẫy INT quên exit, kill -9 và bẫy EXIT, set -E cho bẫy ERR, IFS nối "$*" bằng xuống dòng, và mktemp trên macOS.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions, mostly "what does this script print?" and "which line fixes it?". Every expected output was run on 28/09/2026 in an Ubuntu 24.04 container (bash 5.2.21), or on a Mac where the question says so.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write the standard skeleton from memory: shebang, <code>set -Eeuo pipefail</code>, <code>log</code>/<code>die</code>, <code>main "\$@"</code>.</li>
<li>I can list the places <code>set -e</code> does not stop, including a failing <code>cd</code> in an <code>&amp;&amp;</code> chain.</li>
<li>I can parse short options with <code>getopts</code> and long options with <code>while/case</code>, and validate before doing any work.</li>
<li>I know which trap runs when a script ends normally, fails, gets Ctrl-C, SIGTERM or <code>kill -9</code>.</li>
<li>I can debug with <code>shellcheck</code>, <code>bash -n</code>, <code>bash -x</code> + <code>PS4</code> and <code>env -i</code>.</li>
<li>I can recognise and fix a CRLF script, and I know what differs on a Mac (bash 3.2, BSD <code>mktemp</code>, no <code>flock</code>).</li>
</ul>
${slide('lx-07', 30, 'Bảng tra nhanh Chương 7 (1/2): khung, tham số, kiểm tra')}
${slide('lx-07', 31, 'Bảng tra nhanh Chương 7 (2/2): dọn dẹp, khoá, gỡ lỗi')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu, phần lớn là "script này in ra gì?" và "dòng nào sửa được lỗi?". Mọi output trong đáp án đã được chạy thật ngày 28/09/2026 trong container Ubuntu 24.04 (bash 5.2.21), hoặc trên Mac khi câu hỏi nói vậy.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được bộ khung chuẩn mà không cần nhìn: shebang, <code>set -Eeuo pipefail</code>, <code>log</code>/<code>die</code>, <code>main "\$@"</code>.</li>
<li>Tôi kể được những chỗ <code>set -e</code> không dừng, kể cả một <code>cd</code> hỏng giữa chuỗi <code>&amp;&amp;</code>.</li>
<li>Tôi đọc được cờ ngắn bằng <code>getopts</code>, cờ dài bằng <code>while/case</code>, và kiểm tra hợp lệ trước khi làm việc.</li>
<li>Tôi biết bẫy nào chạy khi script kết thúc bình thường, hỏng, bị Ctrl-C, SIGTERM hay <code>kill -9</code>.</li>
<li>Tôi gỡ lỗi được bằng <code>shellcheck</code>, <code>bash -n</code>, <code>bash -x</code> + <code>PS4</code> và <code>env -i</code>.</li>
<li>Tôi nhận ra và sửa được một script CRLF, và biết Mac khác gì (bash 3.2, <code>mktemp</code> BSD, không có <code>flock</code>).</li>
</ul>
${slide('lx-07', 30, 'Bảng tra nhanh Chương 7 (1/2): khung, tham số, kiểm tra')}
${slide('lx-07', 31, 'Bảng tra nhanh Chương 7 (2/2): dọn dẹp, khoá, gỡ lỗi')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'deploy.sh has "set -euo pipefail", then "cd /srv/ap && git pull && docker compose up -d", then echo "Deploy xong". /srv/ap does not exist. What happens?|||deploy.sh có "set -euo pipefail", rồi "cd /srv/ap && git pull && docker compose up -d", rồi echo "Deploy xong". /srv/ap không tồn tại. Chuyện gì xảy ra?',
            options: [
              'The cd error is printed and the script stops with exit 1|||In lỗi của cd rồi script dừng với mã 1',
              'The cd error is printed, then "Deploy xong", and the exit code is 0|||In lỗi của cd, rồi "Deploy xong", và mã thoát là 0',
              'Nothing is printed and the exit code is 0|||Không in gì và mã thoát là 0',
              'cd, git and docker each print an error, then exit 1|||cd, git và docker đều in lỗi, rồi thoát mã 1',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: Every command in an && list except the last is exempt from -e. cd fails, && skips git and docker, the list as a whole is not checked, so the next line runs — tested: "cd: /srv/ap: No such file or directory", "Deploy xong ✔", exit 0. "Stops with exit 1" is what people expect from set -e, which is exactly the trap; write cd /srv/ap || die "…".|||VI: Mọi lệnh trong danh sách && trừ lệnh cuối đều được miễn khỏi -e. cd hỏng, && bỏ qua git và docker, cả danh sách không bị kiểm, nên dòng sau vẫn chạy — đã thử: "cd: /srv/ap: No such file or directory", "Deploy xong ✔", mã 0. "Dừng với mã 1" là điều người ta chờ đợi ở set -e, và đó chính là cái bẫy; hãy viết cd /srv/ap || die "…".',
          },
          {
            question: 'Under "set -e", which of these lines STOPS the script when the command inside fails?|||Dưới "set -e", dòng nào sau đây làm script DỪNG khi lệnh bên trong hỏng?',
            options: [
              'local x=$(false)   (inside a function)|||local x=$(false)   (bên trong một hàm)',
              'false || echo rescued|||false || echo cứu',
              'if false; then :; fi',
              'x=$(false)',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: A plain assignment keeps the status of its command substitution, so x=$(false) exits 1 (tested). local, readonly and export return their own status (0) and hide the failure — the most tempting wrong answer because it looks identical. The || and if forms are tested conditions, exempt by design.|||VI: Một phép gán trần giữ nguyên trạng thái của phép thay thế lệnh, nên x=$(false) thoát mã 1 (đã thử). local, readonly và export trả về trạng thái của chính chúng (0) và che mất lỗi — phương án sai hấp dẫn nhất vì trông y hệt. Dạng || và if là điều kiện đang bị kiểm, được miễn theo thiết kế.',
          },
          {
            question: 'A teammate edited deploy.sh on Windows. Now "bash deploy.sh" prints "$\'\\r\': command not found" and "file deploy.sh" says "with CRLF line terminators". Which command fixes the file on Ubuntu?|||Một bạn cùng nhóm sửa deploy.sh trên Windows. Giờ "bash deploy.sh" in "$\'\\r\': command not found" và "file deploy.sh" báo "with CRLF line terminators". Lệnh nào sửa được file trên Ubuntu?',
            options: [
              "sed -i 's/\\r$//' deploy.sh",
              'chmod +x deploy.sh',
              'bash -n deploy.sh',
              "sed -i 's/\\n$//' deploy.sh",
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Each line ends in an invisible carriage return (\\r) that bash glues to the last word; removing it at line end fixes the file — tested: after sed, "file" printed plain "ASCII text" and the script ran. Removing \\n is the tempting look-alike, but sed works line by line and never sees the newline, so nothing changes. bash -n only checks syntax.|||VI: Mỗi dòng kết thúc bằng một ký tự về-đầu-dòng (\\r) vô hình mà bash dính vào từ cuối; xoá nó ở cuối dòng là sửa được — đã thử: sau sed, "file" chỉ còn in "ASCII text" và script chạy. Xoá \\n là phương án trông giống, nhưng sed làm việc từng dòng và không bao giờ thấy ký tự xuống dòng, nên chẳng đổi gì. bash -n chỉ kiểm cú pháp.',
          },
          {
            question: 'A script contains: for a in $@; do echo "[$a]"; done   (no quotes around $@). You run: ./s.sh staging "bao cao.txt" x. How many lines are printed?|||Một script có: for a in $@; do echo "[$a]"; done   (không có nháy quanh $@). Bạn chạy: ./s.sh staging "bao cao.txt" x. Có bao nhiêu dòng được in?',
            options: [
              '3',
              '1',
              '4',
              '2',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Unquoted $@ is word-split, so "bao cao.txt" becomes two words: [staging] [bao] [cao.txt] [x] — tested. 3 is what "$@" (quoted) would give, which is why it is the answer people pick. 1 would be "$*", which glues everything into one string.|||VI: $@ không nháy bị chẻ từ, nên "bao cao.txt" thành hai từ: [staging] [bao] [cao.txt] [x] — đã thử. 3 là kết quả của "$@" (có nháy), nên người ta hay chọn nó. 1 là kết quả của "$*", thứ dán tất cả thành một chuỗi.',
          },
          {
            question: 'A script parses flags with: while getopts ":vo:fh" opt; do … done; shift $((OPTIND - 1)). You run: ./go.sh a.log -v. What happens to -v?|||Một script đọc cờ bằng: while getopts ":vo:fh" opt; do … done; shift $((OPTIND - 1)). Bạn chạy: ./go.sh a.log -v. Chuyện gì xảy ra với -v?',
            options: [
              'It is not parsed: getopts stops at a.log, so -v stays in "$@" as if it were a file|||Nó không được đọc: getopts dừng ở a.log, nên -v nằm lại trong "$@" như thể là một file',
              'It is parsed normally; verbose=1|||Nó được đọc bình thường; verbose=1',
              'getopts prints "unknown option" and exits 2|||getopts in "unknown option" và thoát mã 2',
              'getopts reorders the arguments and moves -v first|||getopts sắp lại các tham số và đưa -v lên đầu',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: getopts, like POSIX tools, stops at the first argument that is not an option. Tested: OPTIND=1, verbose=0, remaining "a.log -v". Reordering is what GNU getopt (the external program, no s) does, which makes that option tempting — the builtin getopts never reorders. Put options first, or use a while/case loop.|||VI: getopts, giống các công cụ POSIX, dừng ở tham số đầu tiên không phải cờ. Đã thử: OPTIND=1, verbose=0, còn lại "a.log -v". Sắp lại thứ tự là việc của getopt GNU (chương trình ngoài, không có chữ s), nên phương án đó hấp dẫn — getopts dựng sẵn không bao giờ sắp lại. Hãy đặt cờ lên trước, hoặc dùng vòng while/case.',
          },
          {
            question: 'Script: trap \'echo "caught Ctrl-C"\' INT; trap \'echo cleanup\' EXIT; sleep 30; echo "AFTER sleep". You press Ctrl-C during the sleep. What is the result?|||Script: trap \'echo "bắt Ctrl-C"\' INT; trap \'echo dọn dẹp\' EXIT; sleep 30; echo "SAU sleep". Bạn nhấn Ctrl-C lúc đang ngủ. Kết quả là gì?',
            options: [
              'The script dies at once with exit 130 and prints nothing|||Script chết ngay với mã 130 và không in gì',
              'It prints "caught Ctrl-C" and "cleanup", then exits 130|||In "bắt Ctrl-C" và "dọn dẹp", rồi thoát mã 130',
              'It prints only "cleanup" and exits 0|||Chỉ in "dọn dẹp" và thoát mã 0',
              'It prints "caught Ctrl-C", "AFTER sleep" and "cleanup", and exits 0|||In "bắt Ctrl-C", "SAU sleep" và "dọn dẹp", rồi thoát mã 0',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: An INT trap replaces the default "die". The handler runs, sleep is interrupted, and the script carries on to the next line — tested: "SAU sleep: script vẫn chạy tiếp!", then the EXIT trap, exit 0. "Exits 130" is what happens only if the handler ends with exit 130 (tested as int2.sh). If you trap INT, end it with exit.|||VI: Bẫy INT thay thế phản ứng "chết" mặc định. Bộ xử lý chạy, sleep bị ngắt, và script đi tiếp sang dòng sau — đã thử: "SAU sleep: script vẫn chạy tiếp!", rồi tới bẫy EXIT, mã 0. "Thoát mã 130" chỉ xảy ra khi bộ xử lý kết thúc bằng exit 130 (đã thử với int2.sh). Đã bẫy INT thì phải kết thúc bằng exit.',
          },
          {
            question: 'A script does tmpdir=$(mktemp -d) and trap \'rm -rf "$tmpdir"\' EXIT. In which case does the temporary directory stay on disk?|||Một script làm tmpdir=$(mktemp -d) và trap \'rm -rf "$tmpdir"\' EXIT. Trong trường hợp nào thư mục tạm còn nằm lại trên đĩa?',
            options: [
              'The user presses Ctrl-C|||Người dùng nhấn Ctrl-C',
              'The process gets kill -9 (or the OOM killer)|||Tiến trình bị kill -9 (hoặc bị OOM killer giết)',
              'A command fails under set -e|||Một lệnh hỏng dưới set -e',
              'systemctl stop sends SIGTERM|||systemctl stop gửi SIGTERM',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: SIGKILL cannot be caught, so no trap runs — tested: exit 137 and exactly one tmp.* directory left. Ctrl-C (130), SIGTERM (143) and a set -e failure (1) all ran the EXIT trap and left nothing. SIGTERM is the tempting answer because it is a signal too, but bash does run EXIT before dying from it.|||VI: SIGKILL không bắt được, nên không bẫy nào chạy — đã thử: mã 137 và còn sót đúng một thư mục tmp.*. Ctrl-C (130), SIGTERM (143) và một lỗi dưới set -e (1) đều chạy bẫy EXIT và không để lại gì. SIGTERM là phương án hấp dẫn vì cũng là tín hiệu, nhưng bash vẫn chạy EXIT trước khi chết vì nó.',
          },
          {
            question: 'Your deploy script runs everything inside main() and has trap \'log ERROR "line $LINENO: $BASH_COMMAND"\' ERR, yet a failure prints only "deploy failed with exit code 1" — no line. Which change makes the ERR trap report the line?|||Script deploy của bạn chạy mọi thứ trong main() và có trap \'log ERROR "line $LINENO: $BASH_COMMAND"\' ERR, vậy mà khi hỏng chỉ in "deploy failed with exit code 1" — không có dòng nào. Thay đổi nào làm bẫy ERR báo được dòng?',
            options: [
              'Add set -x|||Thêm set -x',
              'Replace set -e with set -o errexit|||Đổi set -e thành set -o errexit',
              'Use set -Eeuo pipefail (add -E, errtrace)|||Dùng set -Eeuo pipefail (thêm -E, errtrace)',
              'Move the trap into an EXIT handler|||Chuyển bẫy vào một bộ xử lý EXIT',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Without errtrace, the ERR trap is not inherited by functions, command substitutions or subshells. Tested on the chapter’s deploy.sh: after adding -E it printed "[ERROR] line 117: host=$(grep -m1 …)". set -o errexit is just the long name of -e, the most tempting wrong option; set -x traces everything but does not make the trap fire.|||VI: Thiếu errtrace thì bẫy ERR không được hàm, phép thay thế lệnh hay shell con thừa hưởng. Đã thử trên deploy.sh của chương: thêm -E xong nó in "[ERROR] line 117: host=$(grep -m1 …)". set -o errexit chỉ là tên dài của -e, phương án sai hấp dẫn nhất; set -x lần vết mọi thứ nhưng không làm bẫy nổ.',
          },
          {
            question: 'A script sets IFS=$\'\\n\\t\' at the top. Later: run() { printf \'[dry-run] %s\\n\' "$*"; }; run docker push img:v1. What is printed?|||Một script đặt IFS=$\'\\n\\t\' ở đầu. Phía sau: run() { printf \'[dry-run] %s\\n\' "$*"; }; run docker push img:v1. Kết quả in ra là gì?',
            options: [
              'Three lines: "[dry-run] docker", "push", "img:v1"|||Ba dòng: "[dry-run] docker", "push", "img:v1"',
              'One line: "[dry-run] docker push img:v1"|||Một dòng: "[dry-run] docker push img:v1"',
              'Three lines, each starting with "[dry-run]"|||Ba dòng, dòng nào cũng bắt đầu bằng "[dry-run]"',
              'One line with tabs: "[dry-run] docker<TAB>push<TAB>img:v1"|||Một dòng có tab: "[dry-run] docker<TAB>push<TAB>img:v1"',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: "$*" joins the arguments with the FIRST character of IFS, which here is a newline — tested: the chapter’s dry run printed "[dry-run] docker" and then each word on its own line. There is one printf argument, so "[dry-run]" appears once, not three times. The tab option is tempting because tab is in IFS too, but only the first character is used. Fix: local IFS=\' \' inside run().|||VI: "$*" nối các tham số bằng ký tự ĐẦU TIÊN của IFS, ở đây là xuống dòng — đã thử: lần chạy thử của chương in "[dry-run] docker" rồi mỗi từ một dòng. printf chỉ nhận một tham số nên "[dry-run]" xuất hiện một lần, không phải ba. Phương án tab hấp dẫn vì tab cũng nằm trong IFS, nhưng chỉ ký tự đầu được dùng. Sửa: local IFS=\' \' trong run().',
          },
          {
            question: 'On a Mac (macOS 27, BSD mktemp) you run: mktemp -t deploy.XXXXXX. Which output is real?|||Trên Mac (macOS 27, mktemp BSD) bạn chạy: mktemp -t deploy.XXXXXX. Output nào là thật?',
            options: [
              '/tmp/deploy.7cdXsE',
              "mktemp: too few X's in template 'deploy.XXXXXX'",
              '/var/folders/vz/…/T/deploy.XXXXXX.r1Borxn1Pc',
              './deploy.XXXXXX',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: BSD mktemp treats the -t argument as a prefix, keeps the X’s literally and appends its own random suffix inside $TMPDIR — tested on macOS 27. /tmp/deploy.7cdXsE is the GNU (Ubuntu) result, the tempting answer if you have only used Linux. For both systems write mktemp "${TMPDIR:-/tmp}/deploy.XXXXXX".|||VI: mktemp BSD coi tham số của -t là một tiền tố, giữ nguyên các chữ X và tự nối thêm đuôi ngẫu nhiên của nó trong $TMPDIR — đã thử trên macOS 27. /tmp/deploy.7cdXsE là kết quả của GNU (Ubuntu), phương án hấp dẫn nếu bạn chỉ quen Linux. Viết chạy được cả hai nơi: mktemp "${TMPDIR:-/tmp}/deploy.XXXXXX".',
          },
        ],
      },
    },
  ],
};
