/**
 * Linux & Bash — Chương 7: Viết script cho production.
 * Khung script · tham số · trap và dọn dẹp · gỡ lỗi · script hoàn chỉnh · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 * Gạch chéo ngược PHẢI viết đôi (\\n), xem scripts/course-content-check.mjs.
 */
const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 7 — Writing scripts for production|||Chương 7 — Viết script cho production',
  description: 'set -euo pipefail, tham số, kiểm tính hợp lệ, trap để dọn dẹp, và cách gỡ lỗi một script mà không phải rắc echo khắp nơi. Chương này viết cho những script chạy lúc 3 giờ sáng mà không có ai ngồi nhìn.',
  lessons: [
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
<pre><code>#!/usr/bin/env bash        <span class="tok-comment"># portable — finds bash via PATH</span>
#!/bin/bash                <span class="tok-comment"># fixed path — fine on Linux, wrong on some systems</span>
#!/bin/sh                  <span class="tok-comment"># POSIX sh — NOT bash, most of this course does not apply</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>/usr/bin/env bash</code></span><span class="v">Looks bash up in <code>PATH</code>. Finds a newer bash from Homebrew on macOS, or from a Nix profile, instead of the ancient system one. <strong>The default to use.</strong></span></div>
  <div class="kv"><span class="k"><code>/bin/sh</code></span><span class="v">On Debian and Ubuntu this is <code>dash</code>, not bash. No <code>[[ ]]</code>, no arrays, no <code>local</code>, no <code>\${var^^}</code>. A bash script with this shebang fails in confusing ways.</span></div>
</div>
<div class="callout warn">macOS still ships <strong>bash 3.2</strong> from 2007 as <code>/bin/bash</code>, because bash 4 changed licence. So <code>mapfile</code>, <code>\${var^^}</code>, associative arrays and <code>&amp;&gt;&gt;</code> are all missing there. <code>#!/usr/bin/env bash</code> picks up a Homebrew bash 5 if one is installed — which is why the portable form matters even when you only ever target Linux servers.</div>

<h3>set -euo pipefail, one flag at a time</h3>
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
<p>This is the part most guides omit, and it is why <code>set -e</code> has a reputation for being unreliable. It is reliable — it just has clearly defined exceptions, and if you do not know them you will trust it where it does not apply.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Inside a condition</span><span class="lz-t">if cmd; then · while cmd · cmd &amp;&amp; other · ! cmd</span><span class="lz-d">A command whose status is being TESTED never triggers -e. That is deliberate and necessary — otherwise every if-statement would abort the script.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Not the last in a pipeline</span><span class="lz-t">failing-cmd | tee log</span><span class="lz-d">Only the last stage's status counts, unless you add pipefail. This is exactly why the third flag exists.</span></div>
  <div class="lz-step"><span class="lz-k">3 · In a command substitution used as an assignment</span><span class="lz-t">local x=\$(failing-cmd)</span><span class="lz-d">The assignment's own status wins, and <code>local</code> always succeeds. Declare and assign on separate lines (Lesson 6.1).</span></div>
</div>
<pre><code><span class="tok-comment"># Trap 1 in the wild — this does NOT exit, and count keeps its old value</span>
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
<pre><code>#!/usr/bin/env bash
#
# deploy.sh — build and deploy the application
# Usage: ./deploy.sh &lt;staging|production&gt; [--dry-run]

set -euo pipefail
IFS=\$'\\n\\t'

<span class="tok-comment"># Where this script lives, resolved through symlinks (Lesson 6.1)</span>
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
<pre><code>#!/usr/bin/env bash        <span class="tok-comment"># khả chuyển — tìm bash qua PATH</span>
#!/bin/bash                <span class="tok-comment"># đường dẫn cứng — ổn trên Linux, sai trên vài hệ khác</span>
#!/bin/sh                  <span class="tok-comment"># sh chuẩn POSIX — KHÔNG phải bash, phần lớn khoá này không áp dụng</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>/usr/bin/env bash</code></span><span class="v">Tra bash trong <code>PATH</code>. Tìm ra một bản bash mới hơn từ Homebrew trên macOS, hoặc từ một hồ sơ Nix, thay vì bản hệ thống cổ lỗ. <strong>Mặc định nên dùng.</strong></span></div>
  <div class="kv"><span class="k"><code>/bin/sh</code></span><span class="v">Trên Debian và Ubuntu, đây là <code>dash</code>, không phải bash. Không có <code>[[ ]]</code>, không mảng, không <code>local</code>, không <code>\${var^^}</code>. Một script bash mang shebang này sẽ hỏng theo những kiểu khó hiểu.</span></div>
</div>
<div class="callout warn">macOS tới nay vẫn kèm <strong>bash 3.2</strong> từ năm 2007 ở đường dẫn <code>/bin/bash</code>, vì bash 4 đổi giấy phép. Nên <code>mapfile</code>, <code>\${var^^}</code>, mảng liên kết và <code>&amp;&gt;&gt;</code> đều KHÔNG có ở đó. <code>#!/usr/bin/env bash</code> sẽ nhặt được bản bash 5 của Homebrew nếu có cài — và đó là lý do dạng khả chuyển vẫn quan trọng kể cả khi bạn chỉ nhắm tới máy chủ Linux.</div>

<h3>set -euo pipefail, từng cờ một</h3>
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
<p>Đây là phần mà phần lớn hướng dẫn bỏ qua, và đó là lý do <code>set -e</code> mang tiếng là không đáng tin. Nó ĐÁNG TIN — chỉ là nó có những ngoại lệ được định nghĩa rõ ràng, và nếu bạn không biết chúng thì bạn sẽ tin nó ở đúng những chỗ nó không áp dụng.</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Bên trong một điều kiện</span><span class="lz-t">if cmd; then · while cmd · cmd &amp;&amp; other · ! cmd</span><span class="lz-d">Một lệnh mà trạng thái của nó ĐANG BỊ KIỂM thì không bao giờ kích hoạt -e. Đó là chủ ý và là điều bắt buộc — nếu không thì mọi câu lệnh if sẽ làm script chết.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Không phải khâu cuối của chuỗi ống</span><span class="lz-t">lệnh-hỏng | tee log</span><span class="lz-d">Chỉ trạng thái của khâu cuối được tính, trừ khi bạn thêm pipefail. Đó chính xác là lý do cái cờ thứ ba tồn tại.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Trong phép thay thế lệnh dùng làm phép gán</span><span class="lz-t">local x=\$(lệnh-hỏng)</span><span class="lz-d">Trạng thái của chính phép gán thắng, mà <code>local</code> thì luôn thành công. Hãy khai báo và gán trên hai dòng riêng (Bài 6.1).</span></div>
</div>
<pre><code><span class="tok-comment"># Bẫy 1 ngoài đời — cái này KHÔNG thoát, và count giữ nguyên giá trị cũ</span>
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
<pre><code>#!/usr/bin/env bash
#
# deploy.sh — dựng và triển khai ứng dụng
# Cách dùng: ./deploy.sh &lt;staging|production&gt; [--dry-run]

set -euo pipefail
IFS=\$'\\n\\t'

<span class="tok-comment"># Script này nằm ở đâu, đã giải hết liên kết tượng trưng (Bài 6.1)</span>
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
<pre><code>tmpfile=\$(mktemp)                       <span class="tok-comment"># /tmp/tmp.8kqW2nHxYz</span>
tmpdir=\$(mktemp -d)                     <span class="tok-comment"># a directory</span>
tmpfile=\$(mktemp -t deploy.XXXXXX)      <span class="tok-comment"># with a recognisable prefix</span>
tmpfile=\$(mktemp -p "\$SCRIPT_DIR")      <span class="tok-comment"># in a specific directory</span>

trap 'rm -f "\$tmpfile"' EXIT</code></pre>
<div class="callout warn"><strong>Never write <code>/tmp/myscript.\$\$</code>.</strong> PIDs are reused, so two runs can collide; and <code>/tmp</code> is world-writable (Lesson 4.3), so another user can pre-create that exact path as a symlink pointing at a file you have permission to write — and your script then overwrites <em>their</em> chosen target with your content, as you. That is a real privilege-escalation pattern with a name (symlink attack), and <code>mktemp</code> exists specifically to prevent it: it creates the file atomically with mode <code>600</code> and an unpredictable name.</div>

<h3>Cleaning up more than one thing</h3>
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
mkdir -p /srv/backups

pg_dump "\$DATABASE_URL" &gt; "\$tmpdir/db.sql"
tar -czf "\$tmpdir/files.tar.gz" -C /srv/app uploads
mv "\$tmpdir"/*.{sql,tar.gz} "/srv/backups/\$(date +%F)/"

find /srv/backups -type d -mtime +30 -exec rm -rf {} +
echo "backup complete"</code></pre>
<div class="out">$ ./backup.sh
backup complete
$ ./backup.sh &amp; ./backup.sh
backup already running</div>
<p>Note <code>exit 0</code> when the lock is held: for a cron job, "another copy is already running" is not an error, and exiting nonzero would send you a failure email every five minutes. Choosing the right exit code for "nothing to do" is part of writing a script that people do not learn to ignore.</p>

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
<pre><code>tmpfile=\$(mktemp)                       <span class="tok-comment"># /tmp/tmp.8kqW2nHxYz</span>
tmpdir=\$(mktemp -d)                     <span class="tok-comment"># một thư mục</span>
tmpfile=\$(mktemp -t deploy.XXXXXX)      <span class="tok-comment"># có tiền tố nhận ra được</span>
tmpfile=\$(mktemp -p "\$SCRIPT_DIR")      <span class="tok-comment"># trong một thư mục cụ thể</span>

trap 'rm -f "\$tmpfile"' EXIT</code></pre>
<div class="callout warn"><strong>Đừng bao giờ viết <code>/tmp/myscript.\$\$</code>.</strong> PID được dùng lại, nên hai lần chạy có thể đụng nhau; và <code>/tmp</code> thì cả thế giới ghi được (Bài 4.3), nên một người dùng khác tạo trước đúng đường dẫn đó dưới dạng một liên kết tượng trưng trỏ vào một file mà BẠN có quyền ghi — và script của bạn sẽ ghi đè lên cái đích mà <em>HỌ</em> chọn bằng nội dung của bạn, với danh nghĩa của bạn. Đó là một khuôn mẫu leo thang đặc quyền có thật và có tên hẳn hoi (tấn công qua symlink), và <code>mktemp</code> tồn tại chính là để chặn nó: nó tạo file một cách nguyên tử với chế độ <code>600</code> và một cái tên không đoán trước được.</div>

<h3>Dọn dẹp nhiều hơn một thứ</h3>
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
mkdir -p /srv/backups

pg_dump "\$DATABASE_URL" &gt; "\$tmpdir/db.sql"
tar -czf "\$tmpdir/files.tar.gz" -C /srv/app uploads
mv "\$tmpdir"/*.{sql,tar.gz} "/srv/backups/\$(date +%F)/"

find /srv/backups -type d -mtime +30 -exec rm -rf {} +
echo "sao lưu hoàn tất"</code></pre>
<div class="out">$ ./backup.sh
sao lưu hoàn tất
$ ./backup.sh &amp; ./backup.sh
sao lưu đang chạy rồi</div>
<p>Để ý <code>exit 0</code> khi khoá đang có người giữ: với một công việc cron, "đã có bản khác đang chạy" KHÔNG phải một lỗi, và thoát khác 0 sẽ gửi cho bạn một email báo hỏng mỗi năm phút. Chọn đúng mã thoát cho tình huống "không có gì phải làm" là một phần của việc viết ra một script mà người ta không học được cách phớt lờ.</p>

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
<pre><code>bash -n script.sh          <span class="tok-comment"># syntax check ONLY — does not execute anything</span>
bash -v script.sh          <span class="tok-comment"># print each line as read, before expansion</span>
bash -uxn script.sh        <span class="tok-comment"># combine flags</span></code></pre>
<div class="out">script.sh: line 47: syntax error: unexpected end of file</div>
<div class="callout warn"><code>bash -n</code> catches unbalanced quotes, a missing <code>fi</code> or <code>done</code>, and an unterminated heredoc — the errors that would otherwise appear only when execution reaches them, which in a deploy script may be after it has already changed something. Run it as a pre-commit check; it takes milliseconds and it is the shell equivalent of <code>tsc --noEmit</code>.</div>

<h3>ShellCheck: the tool that finds the bugs you cannot see</h3>
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
<pre><code>bash -n script.sh          <span class="tok-comment"># CHỈ kiểm cú pháp — không chạy gì cả</span>
bash -v script.sh          <span class="tok-comment"># in từng dòng khi đọc vào, trước khi khai triển</span>
bash -uxn script.sh        <span class="tok-comment"># ghép các cờ lại</span></code></pre>
<div class="out">script.sh: line 47: syntax error: unexpected end of file</div>
<div class="callout warn"><code>bash -n</code> bắt được dấu nháy lệch cặp, thiếu một chữ <code>fi</code> hay <code>done</code>, và một heredoc chưa đóng — những lỗi mà nếu không thì chỉ hiện ra khi việc thực thi chạy tới đó, mà trong một script deploy thì lúc ấy có thể nó đã đổi thứ gì đó rồi. Hãy chạy nó như một phép kiểm trước khi commit; nó tốn vài mili giây và là thứ tương đương với <code>tsc --noEmit</code> của shell.</div>

<h3>ShellCheck: công cụ tìm ra những lỗi bạn không nhìn thấy</h3>
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
<pre><code>#!/usr/bin/env bash
#
# deploy.sh — build, push and release the application
# Usage: deploy.sh [options] &lt;staging|production&gt;

set -euo pipefail
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
  [[ -n \$tmpdir ]] &amp;&amp; rm -rf "\$tmpdir"
  (( rc != 0 )) &amp;&amp; warn "deploy failed with exit code \$rc"
  return \$rc
}
trap cleanup EXIT
trap 'log ERROR "line \$LINENO: \$BASH_COMMAND"' ERR

<span class="tok-comment">#─── dry-run wrapper (7.2) ────────────────────────────────────</span>
run() {
  if (( dry_run )); then
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
[dry-run] ssh vps docker pull '...' &amp;&amp; docker compose -p myapp up -d --no-build backend
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
<pre><code>image=\$(build_and_push)      <span class="tok-comment"># captures ONLY the printf on the last line</span>
release "\$image"</code></pre>
<p><code>build_and_push</code> writes its progress with <code>info</code> — which goes to stderr — and prints the image name to stdout. So the caller captures a clean value while the human still sees the log. That separation (Lesson 6.5) is what makes shell functions composable; a function that logs to stdout can never have its output captured.</p>

<h3>When to stop using bash</h3>
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
<pre><code>#!/usr/bin/env bash
#
# deploy.sh — dựng, đẩy và phát hành ứng dụng
# Cách dùng: deploy.sh [tuỳ chọn] &lt;staging|production&gt;

set -euo pipefail
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
  [[ -n \$tmpdir ]] &amp;&amp; rm -rf "\$tmpdir"
  (( rc != 0 )) &amp;&amp; warn "deploy hỏng với mã thoát \$rc"
  return \$rc
}
trap cleanup EXIT
trap 'log ERROR "dòng \$LINENO: \$BASH_COMMAND"' ERR

<span class="tok-comment">#─── hàm bọc cho chạy thử (7.2) ───────────────────────────────</span>
run() {
  if (( dry_run )); then
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
[chạy thử] ssh vps docker pull '...' &amp;&amp; docker compose -p myapp up -d --no-build backend
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
<pre><code>image=\$(build_and_push)      <span class="tok-comment"># chỉ hứng đúng lệnh printf ở dòng cuối</span>
release "\$image"</code></pre>
<p><code>build_and_push</code> ghi tiến độ bằng <code>info</code> — thứ đi ra stderr — và in tên ảnh ra stdout. Nên người gọi hứng được một giá trị sạch trong khi con người vẫn nhìn thấy phần log. Chính sự tách bạch đó (Bài 6.5) làm cho hàm shell ghép nối được với nhau; một hàm ghi log ra stdout thì không bao giờ hứng được output của nó.</p>

<h3>Khi nào nên thôi dùng bash</h3>
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
      description: 'Tám câu về shebang, ba ngoại lệ của set -e, getopts và OPTIND, trap EXIT, mktemp, flock, tính bền vững khi chạy lại, và vì sao set -x nguy hiểm trên production.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Eight questions on writing scripts that survive being run by someone else, at 3am, without you watching. Answer from memory; they follow the lesson order.</p>
<div class="callout ok">Aim for 7/8. The three that matter most in real work: where <code>set -e</code> does <em>not</em> fire (7.1), why <code>trap EXIT</code> rather than <code>trap INT TERM</code> (7.3), and why <code>/tmp/script.\$\$</code> is a security bug (7.3).</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Tám câu về việc viết script sống sót khi bị người khác chạy, lúc 3 giờ sáng, không có bạn ngồi nhìn. Trả lời bằng trí nhớ; các câu theo thứ tự bài.</p>
<div class="callout ok">Hãy nhắm 7/8. Ba câu quan trọng nhất trong việc thật: <code>set -e</code> KHÔNG kích hoạt ở đâu (bài 7.1), vì sao dùng <code>trap EXIT</code> chứ không phải <code>trap INT TERM</code> (bài 7.3), và vì sao <code>/tmp/script.\$\$</code> là một lỗi an ninh (bài 7.3).</div>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Why prefer #!/usr/bin/env bash over #!/bin/bash?|||Vì sao nên chọn #!/usr/bin/env bash thay vì #!/bin/bash?',
            options: [
              'It runs faster because env caches the interpreter|||Nó chạy nhanh hơn vì env lưu tạm trình thông dịch',
              'It looks bash up in PATH, so it finds a newer bash (e.g. Homebrew bash 5 on macOS, where /bin/bash is still 3.2)|||Nó tra bash trong PATH, nên tìm được bản bash mới hơn (ví dụ bash 5 của Homebrew trên macOS, nơi /bin/bash vẫn là 3.2)',
              'It is required for set -euo pipefail to work|||Nó là bắt buộc để set -euo pipefail hoạt động',
              'It makes the script run as the invoking user|||Nó làm script chạy với danh nghĩa người gọi',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'With set -e enabled, which of these does NOT abort the script when the command fails?|||Khi đã bật set -e, trường hợp nào dưới đây KHÔNG làm script dừng lại khi lệnh thất bại?',
            options: [
              'A plain command on its own line|||Một lệnh trần đứng riêng một dòng',
              'The last command in a pipeline|||Lệnh cuối cùng trong một chuỗi ống',
              'A command inside an if condition, a && chain, or assigned via local x=$(cmd) — all three are exceptions|||Một lệnh nằm trong điều kiện của if, trong một chuỗi &&, hoặc được gán qua local x=$(cmd) — cả ba đều là ngoại lệ',
              'A command that writes to stderr|||Một lệnh có ghi ra stderr',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'After a getopts loop you forget "shift $((OPTIND - 1))". What breaks?|||Sau một vòng getopts bạn quên "shift $((OPTIND - 1))". Cái gì hỏng?',
            options: [
              'The flags are not parsed at all|||Các cờ hoàn toàn không được phân tích',
              'OPTARG is empty for every option|||OPTARG rỗng với mọi tuỳ chọn',
              'The flags parse correctly, but "$@" still contains them — so a loop over "files" also iterates over -v and -o|||Các cờ vẫn phân tích đúng, nhưng "$@" vẫn còn chứa chúng — nên vòng lặp qua "các file" cũng lặp luôn qua -v và -o',
              'getopts loops forever|||getopts lặp vô tận',
            ],
            correctIndex: 2,
            points: 1,
          },
          {
            question: 'Why trap cleanup on EXIT rather than on INT and TERM?|||Vì sao nên bẫy cleanup ở EXIT thay vì ở INT và TERM?',
            options: [
              'EXIT is faster to process|||EXIT xử lý nhanh hơn',
              'EXIT is a pseudo-signal bash runs whenever the shell terminates for ANY reason — including after an INT or TERM handler — so one line covers every case except SIGKILL|||EXIT là một tín hiệu giả mà bash chạy mỗi khi shell kết thúc vì BẤT KỲ lý do nào — kể cả sau khi một bộ xử lý INT hay TERM đã chạy — nên một dòng phủ được mọi trường hợp trừ SIGKILL',
              'INT and TERM cannot be trapped in a script|||INT và TERM không bẫy được trong một script',
              'EXIT also catches SIGKILL, which the others do not|||EXIT còn bắt được cả SIGKILL, thứ mà những cái kia không bắt được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why is tmpfile=/tmp/myscript.$$ a security problem, not just a collision risk?|||Vì sao tmpfile=/tmp/myscript.$$ là một vấn đề AN NINH, không chỉ là rủi ro trùng tên?',
            options: [
              'PIDs are predictable and /tmp is world-writable, so another user can pre-create that path as a symlink and your script writes your content into THEIR chosen target, as you|||PID đoán trước được và /tmp thì cả thế giới ghi được, nên người dùng khác tạo trước đường dẫn đó dưới dạng liên kết tượng trưng và script của bạn ghi nội dung của bạn vào ĐÍCH DO HỌ CHỌN, với danh nghĩa của bạn',
              '/tmp is cleared on reboot, so the data is lost|||/tmp bị xoá khi khởi động lại, nên dữ liệu mất',
              '$$ is not available in non-interactive shells|||$$ không dùng được trong shell không tương tác',
              'The file is created with mode 777|||File được tạo với chế độ 777',
            ],
            correctIndex: 0,
            points: 1,
          },
          {
            question: 'Why is flock correct for a cron guard, while a hand-made PID-file lock is not?|||Vì sao flock là đúng cho một cái chốt của cron, còn một khoá tự chế bằng file PID thì không?',
            options: [
              'flock is faster than creating a file|||flock nhanh hơn việc tạo một file',
              'The lock is held by the open file descriptor, so the kernel releases it whenever the process dies — including kill -9 and a power cut. A PID file leaves a stale lock after any crash|||Khoá được giữ bởi bộ mô tả file đang mở, nên nhân thả nó ra mỗi khi tiến trình chết — kể cả kill -9 và mất điện. Một file PID sẽ để lại khoá cũ sau bất kỳ lần sập nào',
              'flock works across machines over NFS|||flock hoạt động qua NFS giữa nhiều máy',
              'PID files require root to create|||File PID cần quyền root mới tạo được',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'What makes this line idempotent: grep -qxF "$line" ~/.bashrc || echo "$line" >> ~/.bashrc ?|||Điều gì làm dòng này bền vững khi chạy lại: grep -qxF "$line" ~/.bashrc || echo "$line" >> ~/.bashrc ?',
            options: [
              'The >> operator never duplicates content|||Toán tử >> không bao giờ nhân đôi nội dung',
              'The check-then-act pattern: it only appends if the exact whole line is not already present, so running it repeatedly is a no-op|||Khuôn mẫu kiểm-rồi-làm: nó chỉ nối thêm nếu đúng nguyên dòng đó CHƯA có, nên chạy lại nhiều lần cũng chẳng làm gì',
              'grep -q locks the file while writing|||grep -q khoá file trong lúc ghi',
              'Nothing — it still duplicates on the second run|||Chẳng có gì — nó vẫn nhân đôi ở lần chạy thứ hai',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Why should set -x never be left on in a production service?|||Vì sao không bao giờ nên để quên set -x bật trên một dịch vụ production?',
            options: [
              'It slows the script down by about 50%|||Nó làm script chậm đi khoảng 50%',
              'It prints EXPANDED values to stderr, so tokens and database URLs get written into the journal or emailed by cron — in plain text, on every run|||Nó in ra các giá trị ĐÃ KHAI TRIỂN vào stderr, nên token và chuỗi kết nối cơ sở dữ liệu bị ghi vào journal hoặc bị cron gửi email — dưới dạng chữ thường, ở mỗi lần chạy',
              'It disables set -e|||Nó vô hiệu hoá set -e',
              'It only works on interactive terminals anyway|||Dù sao nó cũng chỉ chạy trên terminal tương tác',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
  ],
};
