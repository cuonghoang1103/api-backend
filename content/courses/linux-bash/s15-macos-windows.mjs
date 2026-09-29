/**
 * Linux & Bash — Chương 15 (MỚI, 09/2026): Dùng kỹ năng Linux trên macOS và Windows.
 * macOS là Unix nhưng không phải Linux (zsh, BSD vs GNU) · công cụ riêng của Mac (Homebrew, launchd, pbcopy…) ·
 * Windows: WSL2, Git Bash, CRLF · PowerShell cho người biết bash · quiz.
 * Chương này TỔNG HỢP các ô "macOS/WSL khác gì" đã rải ở Mục 0.3, 3.3, 3.5, 6.2, 7.1, 8.1, 8.2, 12.4 rồi đi sâu —
 * trỏ ngược thay vì dạy lại.
 * Output CHẠY THẬT 28/09/2026: Mac M1 macOS 27.0 (zsh 5.9, /bin/bash 3.2.57, công cụ BSD, Homebrew 7.0.6 — chỉ lệnh
 * đọc; plist/keychain/defaults thử trong thư mục scratch rồi dọn), container ubuntu:24.04 arm64 (lx15-u: CRLF, git
 * core.autocrlf/.gitattributes, dos2unix 7.5.1, GNU coreutils 9.4), PowerShell 7.6.6 linux-arm64 cài trong chính
 * container đó (ảnh mcr.microsoft.com/powershell không có arm64). WSL2/Windows: không có máy Windows ⇒ lệnh và thiết
 * lập lấy từ learn.microsoft.com (09/2026), ghi rõ, không in output giả.
 * LUẬT: backtick → &#96;; ${ → \${; gạch chéo ngược viết đôi; < > & trong code → &lt; &gt; &amp;. KHÔNG <svg>.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 15 — Your Linux skills on macOS and Windows|||Chương 15 — Dùng kỹ năng Linux trên macOS và Windows',
  description: 'Mang kỹ năng Linux sang máy Mac và máy Windows: zsh và công cụ BSD trên macOS, Homebrew và launchd, WSL2 và lỗi CRLF trên Windows, và PowerShell cho người đã biết bash — mọi khác biệt đều đo thật.',
  lessons: [
    /* ─────────────────────────── 15.0 ─────────────────────────── */
    {
      title: '15.0 — Chapter 15 slides: Linux skills on macOS and Windows in pictures|||15.0 — Slide Chương 15: kỹ năng Linux trên macOS và Windows bằng hình',
      slug: 'lnx-15-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 15: macOS là Unix nhưng không phải Linux, zsh và bash 3.2, bảng BSD vs GNU đo thật, script chạy hai nơi, Homebrew, launchd, lệnh riêng của Mac, WSL2, CRLF và .gitattributes, PowerShell chuyền đối tượng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Your server runs Ubuntu, your own laptop is a Mac, and half your project team uses Windows. This chapter is about carrying everything you learned in Chapters 0–14 across that gap — knowing what stays the same, and memorising the handful of places where it does not.</p>
<p>Slides 3–9 belong to Lesson 15.1 (macOS as a certified Unix, zsh versus bash 3.2, a measured BSD-versus-GNU table and a script that runs on both), 10–16 to 15.2 (Homebrew, Brewfile, launchd, a real LaunchAgent, and the commands only a Mac has), 17–22 to 15.3 (WSL2, where to keep your files, <code>wsl.conf</code>, and the CRLF bug from start to finish) and 23–28 to 15.4 (PowerShell for people who already know bash). The last four are the chapter's common mistakes, a two-page cheat sheet and a 40-minute practice session. Every Mac terminal is real output recorded on 28/09/2026 on a Mac M1 running macOS 27 with read-only commands; every Linux terminal comes from an Ubuntu 24.04 container; the PowerShell output is PowerShell 7.6.6 running inside that same container. The course has no Windows machine, so Windows commands and settings are quoted from Microsoft's documentation and marked as such — never shown with made-up output.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Máy chủ của bạn chạy Ubuntu, laptop của bạn là Mac, còn một nửa nhóm đồ án dùng Windows. Chương này mang mọi thứ bạn học ở Chương 0–14 vượt qua khoảng cách đó — biết cái gì GIỮ NGUYÊN, và thuộc lòng vài chỗ KHÁC.</p>
<p>Slide 3–9 thuộc Bài 15.1 (macOS là Unix có chứng nhận, zsh so với bash 3.2, bảng BSD–GNU đo thật và một script chạy được cả hai nơi), 10–16 thuộc 15.2 (Homebrew, Brewfile, launchd, một LaunchAgent thật, và những lệnh chỉ Mac có), 17–22 thuộc 15.3 (WSL2, để file ở đâu, <code>wsl.conf</code>, và lỗi CRLF từ đầu tới cuối), 23–28 thuộc 15.4 (PowerShell cho người đã biết bash). Bốn slide cuối là những sai lầm hay gặp, bảng tra nhanh hai trang và một buổi thực hành 40 phút. Mọi terminal Mac là output THẬT ghi ngày 28/09/2026 trên Mac M1 chạy macOS 27, chỉ bằng lệnh đọc; mọi terminal Linux lấy từ container Ubuntu 24.04; output PowerShell là PowerShell 7.6.6 chạy trong chính container đó. Khoá không có máy Windows, nên lệnh và thiết lập của Windows được trích từ tài liệu của Microsoft và ghi rõ như vậy — không bao giờ in output tự bịa.</p>
</div>
${gallery('lx-15', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'macOS là Unix có chứng nhận, không phải Linux'], [4, 'zsh mặc định từ 2019, bash 3.2'], [5, 'zsh không phải bash: bốn chỗ vấp'],
  [6, 'Bảng BSD vs GNU'], [7, 'Lỗi thật khi đem lệnh GNU sang Mac'], [8, 'Thứ đã giống, thứ khác im lặng'], [9, 'Script chạy cả hai nơi'],
  [10, 'Homebrew'], [11, 'GNU trên Mac và Brewfile'], [12, 'launchd thay systemd và cron'], [13, 'Một LaunchAgent thật'],
  [14, 'Tự viết plist, plutil -lint'], [15, 'Lệnh chỉ Mac có'], [16, 'Dịch lệnh chẩn đoán Linux → macOS'],
  [17, 'Ba cách có bash trên Windows'], [18, 'WSL2 là máy ảo Linux thật'], [19, 'Để mã trong ~ của Linux'],
  [20, 'wsl.conf và .wslconfig'], [21, 'CRLF làm vỡ script'], [22, '.gitattributes chặn CRLF'],
  [23, 'PowerShell chuyền đối tượng'], [24, 'Bảng dịch bash → PowerShell'], [25, 'PowerShell 7 chạy thật'],
  [26, '&& của PowerShell'], [27, 'Script .ps1 và execution policy'], [28, 'Khi nào dùng cái nào'],
  [29, 'Sai lầm hay gặp'], [30, 'Bảng tra nhanh (1/2)'], [31, 'Bảng tra nhanh (2/2)'], [32, 'Thực hành chương 15'],
])}
`,
    },
    /* ─────────────────────────── 15.1 ─────────────────────────── */
    {
      title: '15.1 — macOS: a real Unix with zsh, bash 3.2 and BSD tools|||15.1 — macOS: một Unix thật với zsh, bash 3.2 và công cụ BSD',
      slug: 'lnx-15-1-macos-zsh-bsd',
      type: 'LESSON',
      isFreePreview: true,
      description: 'macOS là Unix có chứng nhận nhưng không phải Linux: vì sao zsh là shell mặc định và /bin/bash kẹt ở 3.2, những chỗ zsh khác bash hay vấp, bảng BSD vs GNU đo thật trên Mac, và cách viết một script chạy được cả trên Mac lẫn máy chủ Ubuntu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.1</span>
<h2>macOS: a real Unix with zsh, bash 3.2 and BSD tools</h2>
<p class="lead">Open Terminal on a Mac and almost everything from this course works: <code>ls</code>, pipes, <code>grep</code>, permissions, <code>ssh</code>. That is exactly the trap. The shape is identical, so you stop checking — and then <code>sed -i</code> reports a nonsense error, a script that ran on the VPS dies on line 40, and <code>date -d</code> does not exist. This lesson collects every Mac difference the course has mentioned so far, measures each one on a real Mac, and ends with a script that behaves the same on your laptop and on your server.</p>

<h3>Same family, different house</h3>
${slide('lx-15', 3, 'macOS là Unix có chứng nhận — nhưng không phải Linux')}
<p>Section 0 drew the family tree; here is the part that matters for daily work. macOS is built on <strong>Darwin</strong>, whose kernel <strong>XNU</strong> combines the Mach microkernel with a layer taken from BSD Unix. The command-line tools Apple ships — <code>sed</code>, <code>grep</code>, <code>date</code>, <code>stat</code>, <code>find</code> — are mostly <strong>BSD</strong> versions. Linux is only a kernel; a distribution such as Ubuntu wraps it in <strong>GNU</strong> tools. Both families descend from the Unix ideas of 1969, but they are separate codebases, and the flags drifted apart over forty years.</p>
<pre><code class="language-bash">sw_vers
uname -srm
uname -v | cut -c1-60
ls /proc</code></pre>
<div class="out">ProductName:		macOS
ProductVersion:		27.0
BuildVersion:		26A428
Darwin 27.0.0 arm64
Darwin Kernel Version 27.0.0: Tue Aug 11 21:22:49 PDT 2026;
ls: /proc: No such file or directory</div>
<p>Two readings. <code>uname -s</code> says <code>Darwin</code>, not <code>Linux</code> — this is the one-word test scripts use to know where they are. And there is no <code>/proc</code>: every trick from Chapter 5 and 12 that reads <code>/proc/PID/…</code> has no direct equivalent on a Mac (<code>ps -o</code> and <code>lsof -p</code> are the substitutes).</p>
<div class="callout ok"><strong>"Unix" is a trademark with a test suite behind it.</strong> The Open Group's register lists <em>macOS version 26.0 Tahoe on Apple silicon-based Mac computers</em> as certified to the <strong>UNIX 03</strong> standard (registered 29/08/2025; checked September 2026). Most Linux distributions never apply for that certificate — they aim at POSIX compatibility instead. So the answer to "is a Mac Unix?" is literally yes, and the answer to "is a Mac Linux?" is no. Your servers run the second one.</div>

<h3>Why the default shell is zsh, and why /bin/bash is from 2007</h3>
${slide('lx-15', 4, 'zsh mặc định từ 2019 vì bash mới là GPLv3')}
<pre><code class="language-bash">echo \$SHELL
zsh --version
/bin/bash --version | head -1
brew info bash | head -1</code></pre>
<div class="out">/bin/zsh
zsh 5.9 (arm64-apple-darwin26.0)
GNU bash, version 3.2.57(1)-release (arm64-apple-darwin26)
==&gt; bash: stable 5.3.20 (bottled), HEAD</div>
<p>Apple's own support article states: "Starting with macOS 10.15, your Mac uses zsh as the default login shell and interactive shell" (Catalina, 2019). Bash is still installed, but frozen at 3.2 — the last version released under GPLv2. From bash 4.0 (2009) onward, bash is licensed GPLv3, which Apple does not ship. Rather than keep a twelve-year-old bash as the default, Apple switched to zsh, which uses a permissive MIT-style licence. The latest bash (5.3, reported by Homebrew as <code>5.3.20</code>) is one <code>brew install bash</code> away, but it lands in <code>/opt/homebrew/bin/bash</code> — <code>/bin/bash</code> stays 3.2 forever.</p>
<p>What bash 3.2 lacks, and therefore what breaks on a Mac: associative arrays (<code>declare -A</code>, Lesson 13.1), <code>mapfile</code>/<code>readarray</code>, case conversion <code>\${x^^}</code>, <code>**</code> with <code>shopt -s globstar</code>, negative indexes <code>\${arr[-1]}</code>, <code>|&amp;</code>, and <code>wait -n</code>. Measured:</p>
<pre><code>/bin/bash -c 'arr=(tao cam); echo \${arr[-1]}'
/bin/bash -c 'shopt -s globstar'</code></pre>
<div class="out">/bin/bash: arr: bad array subscript

/bin/bash: line 0: shopt: globstar: invalid shell option name</div>
<p>Section 0.3 showed the <code>declare -A</code> and <code>\${x^^}</code> errors; Lesson 8.2 showed which startup files zsh reads (<code>.zshenv</code> → <code>.zprofile</code> → <code>.zshrc</code> → <code>.zlogin</code>). This lesson does not repeat those — it adds what trips people up when they <em>type</em> and <em>script</em> in zsh.</p>

<h3>zsh is not bash: four differences that bite</h3>
${slide('lx-15', 5, 'zsh không phải bash: mảng từ 1, không tách từ, glob không khớp báo lỗi, # khi gõ tay')}
<p>The same five-line file, run by both shells on the Mac. <code>zsh -f</code> starts zsh without reading any startup file, so what you see is zsh's default behaviour, not someone's configuration:</p>
<pre><code class="language-bash"><span class="tok-comment"># z1.sh</span>
arr=(tao cam le)
echo "\${arr[1]} \${arr[0]}"
v="mot hai ba"
for w in \$v; do echo "tu: \$w"; done
ls *.log</code></pre>
<pre><code>zsh -f z1.sh
/bin/bash z1.sh</code></pre>
<div class="out">tao
tu: mot hai ba
z1.sh:5: no matches found: *.log

cam tao
tu: mot
tu: hai
tu: ba
ls: *.log: No such file or directory</div>
<table>
<tr><th>Difference</th><th>zsh (default)</th><th>bash</th><th>Make zsh behave like bash</th></tr>
<tr><td>Array index</td><td>starts at <strong>1</strong>; <code>\${arr[0]}</code> is empty</td><td>starts at 0</td><td><code>setopt KSH_ARRAYS</code></td></tr>
<tr><td>Unquoted <code>\$v</code></td><td>stays <strong>one word</strong> (no word splitting)</td><td>split on spaces (Lesson 6.2)</td><td><code>\${=v}</code> splits in one place; <code>setopt SH_WORD_SPLIT</code> everywhere</td></tr>
<tr><td>Glob matching nothing</td><td>error <code>no matches found</code>, the command is <strong>not run</strong></td><td>the pattern is passed through literally</td><td><code>setopt NULL_GLOB</code> (expand to nothing) or <code>NO_NOMATCH</code></td></tr>
<tr><td><code>#</code> typed at the prompt</td><td><strong>not</strong> a comment (Section 0.3)</td><td>a comment</td><td><code>setopt interactivecomments</code></td></tr>
<tr><td><code>echo 'a\\tb'</code></td><td>prints a real tab (escapes on by default)</td><td>prints <code>a\\tb</code></td><td><code>print -r</code> / <code>printf</code> in both</td></tr>
<tr><td>Recursive glob</td><td><code>**/*.log</code> works out of the box</td><td>needs bash 4 + <code>globstar</code></td><td>—</td></tr>
<tr><td>Associative arrays</td><td><code>typeset -A</code> works</td><td>bash 4+ only; not in <code>/bin/bash</code> 3.2</td><td>—</td></tr>
</table>
<p>The word-splitting row is the one that changes meaning silently: a loop that processed three hosts in bash processes one string called <code>"host1 host2 host3"</code> in zsh. Lesson 6.2 taught you to quote variables precisely because bash splits them; zsh took the opposite default. The glob row is the loud one: in an interactive zsh, <code>rm *.tmp</code> in a directory with no <code>.tmp</code> files is an error rather than <code>rm</code> complaining about a file literally called <code>*.tmp</code>.</p>
<p>Two zsh-only tools are worth knowing because they solve the bash-in-zsh problem locally. <code>emulate -L sh</code> inside a function makes that function behave like POSIX sh until it returns; and <code>\${=v}</code> asks for splitting at one spot:</p>
<pre><code>zsh -f -c 'v="mot hai ba"; for w in \${=v}; do echo "tach: \$w"; done'
zsh -f -c 'f() { emulate -L sh; v="1 2"; for w in \$v; do echo "sh: \$w"; done; }; f'
zsh -f -c 'setopt KSH_ARRAYS; arr=(tao cam); echo "\${arr[0]}"'</code></pre>
<div class="out">tach: mot
tach: hai
tach: ba
sh: 1
sh: 2
tao</div>
<div class="callout warn"><strong>The practical rule: type in zsh, script in bash.</strong> Keep zsh as your interactive shell — its completion and history are excellent — but every script you write starts with <code>#!/usr/bin/env bash</code> and runs under bash, even on the Mac. Do not <code>source</code> a bash script into your zsh session and expect identical behaviour; run it as a program (<code>./script.sh</code> or <code>bash script.sh</code>) so the shebang decides.</div>

<h3>BSD versus GNU: the measured table</h3>
${slide('lx-15', 6, 'BSD vs GNU: cùng tên lệnh, khác cờ')}
<p>Every row below was run on the same day on the Mac (Apple's BSD tools, called by absolute path so no alias or function interferes) and in the Ubuntu 24.04 container (GNU coreutils 9.4, GNU sed 4.9, GNU grep 3.11). Earlier chapters met some of these one at a time — <code>sed -i ''</code> in Lesson 3.5, <code>grep</code> BRE and <code>\\|</code> in 3.3, <code>readlink -f</code> in 7.1 — this is the whole list in one place.</p>
<table>
<tr><th>Task</th><th>GNU (Ubuntu)</th><th>BSD (macOS) — measured</th><th>Works on both</th></tr>
<tr><td>Edit in place</td><td><code>sed -i 's/a/b/' f</code></td><td><code>sed -i '' 's/a/b/' f</code> (the empty string is the backup suffix)</td><td><code>sed -i.bak 's/a/b/' f</code> then <code>rm f.bak</code></td></tr>
<tr><td>Tomorrow's date</td><td><code>date -d tomorrow +%F</code></td><td><code>date -v+1d +%F</code> → <code>2026-09-29</code></td><td>try <code>-d</code>, fall back to <code>-v</code></td></tr>
<tr><td>Parse a date string</td><td><code>date -d 2026-09-01 +%A</code></td><td><code>date -j -f %Y-%m-%d 2026-09-01 +%A</code> → <code>Tuesday</code></td><td>—</td></tr>
<tr><td>File size in bytes</td><td><code>stat -c %s f</code></td><td><code>stat -f %z f</code></td><td><code>wc -c &lt; f</code></td></tr>
<tr><td>Perl regex</td><td><code>grep -oP '\\d+(?=ms)'</code></td><td><code>grep: invalid option -- P</code></td><td><code>grep -oE '[0-9]+ms'</code> or <code>perl -nle</code></td></tr>
<tr><td>Custom output in find</td><td><code>find . -printf '%s %p\\n'</code></td><td><code>find: -printf: unknown primary or operator</code></td><td><code>find . -exec stat -f '%z %N' {} +</code> (Mac)</td></tr>
<tr><td>Time limit</td><td><code>timeout 5 cmd</code> (exit 124)</td><td><code>command not found: timeout</code></td><td><code>gtimeout</code> (Homebrew coreutils) or <code>perl -e 'alarm shift; exec @ARGV' 5 cmd</code></td></tr>
<tr><td>All but the last line</td><td><code>head -n -1</code></td><td><code>head: illegal line count -- -1</code></td><td><code>sed '\$d'</code></td></tr>
<tr><td>Reverse lines</td><td><code>tac</code></td><td>no <code>tac</code>; <code>tail -r</code></td><td><code>awk '{a[NR]=\$0} END{for(i=NR;i;i--)print a[i]}'</code></td></tr>
<tr><td>Directory size in bytes</td><td><code>du -sb</code></td><td><code>du: invalid option -- b</code></td><td><code>du -sk</code> (kilobytes, both)</td></tr>
<tr><td>Version check</td><td><code>sed --version</code> → <code>sed (GNU sed) 4.9</code></td><td><code>sed: illegal option -- -</code></td><td>that failure <em>is</em> the test</td></tr>
</table>

<h3>Reading the errors, not just avoiding them</h3>
${slide('lx-15', 7, 'Lỗi thật khi đem lệnh GNU sang Mac — và đọc lỗi đầu tiên cho đúng')}
<pre><code class="language-bash">printf 'mode=yes\\n' &gt; m.conf
sed -i 's/yes/no/' m.conf</code></pre>
<div class="out">sed: 1: "m.conf
": invalid command code m</div>
<p>This is the most confusing message on the list, and it is worth decoding once. BSD <code>sed -i</code> <em>requires</em> an argument: the backup suffix. So it takes <code>'s/yes/no/'</code> as that suffix. The next argument, <code>m.conf</code>, is then read as the sed <em>script</em>, and sed complains that <code>m</code> is not a sed command. Nothing is wrong with your regex. The fix <code>sed -i '' …</code> passes an empty suffix explicitly — and that exact line fails on GNU sed, which reads <code>''</code> as the script. <code>sed -i.bak</code> (suffix glued to the flag) is understood by both.</p>
<pre><code>/usr/bin/grep --version
/usr/bin/sort --version | head -1</code></pre>
<div class="out">grep (BSD grep, GNU compatible) 2.6.0-FreeBSD
2.3-Apple (199)</div>
<div class="callout">Notice "GNU compatible" in the grep banner: Apple's grep accepts many GNU long options, but not <code>-P</code>. And Apple's <code>sort</code> is actually derived from GNU sort, so <code>sort -h</code> and <code>sort -V</code> work. "It's BSD, so it won't have X" is a guess; running the command is a measurement.</div>

<h3>What is already the same — and the differences that make no noise</h3>
${slide('lx-15', 8, 'Có thứ đã giống — và có thứ khác mà IM LẶNG (xargs với đầu vào rỗng)')}
<p>Older blog posts are full of "macOS doesn't have <code>readlink -f</code>". On macOS 27, measured: <code>readlink -f ../lx-15/m.conf</code> prints the absolute path; <code>ls --color=auto</code> works; <code>sed -E</code> means extended regex on both; <code>xargs -r</code> is accepted. Apple has quietly closed some gaps. Others remain: <code>ls --time-style</code> is <code>unrecognized option</code>, <code>du -sb</code> is <code>invalid option -- b</code>.</p>
<p>The dangerous differences are the ones that produce <em>no error</em>:</p>
<pre><code>printf '' | xargs echo chay</code></pre>
<div class="out">chay           <span class="tok-comment"># Ubuntu: GNU xargs runs the command once even with no input</span>
               <span class="tok-comment"># Mac: BSD xargs prints nothing</span></div>
<p>A cleanup pipeline like <code>find . -name '*.tmp' | xargs rm</code> on an empty result makes GNU <code>rm</code> complain "missing operand" (and fail the script under <code>set -e</code>), while the Mac is silent. That is why Lesson 3.2 taught <code>xargs -r</code>: it makes GNU behave like BSD, and BSD accepts the flag. Same for <code>**</code>: in bash 3.2 without <code>globstar</code>, <code>g/**/*.log</code> silently behaves like <code>g/*/*.log</code> and finds one file out of three.</p>
<pre><code>/bin/bash -c 'echo g/**/*.log'
zsh -f -c 'print -l g/**/*.log'</code></pre>
<div class="out">g/a/y.log
g/a/b/z.log
g/a/y.log
g/x.log</div>

<h3>A script that runs in both places: detect capabilities, not machine names</h3>
${slide('lx-15', 9, 'Script chạy cả hai nơi: dò khả năng, đừng dò tên máy')}
<pre><code class="language-bash">#!/usr/bin/env bash
set -euo pipefail
case "\$(uname -s)" in
  Darwin) OS=mac ;;
  Linux)  grep -qi microsoft /proc/version 2&gt;/dev/null &amp;&amp; OS=wsl || OS=linux ;;
  MINGW*|MSYS*|CYGWIN*) OS=windows-bash ;;
  *) OS=khac ;;
esac
sedi()      { if sed --version &gt;/dev/null 2&gt;&amp;1; then sed -i "\$@"; else sed -i '' "\$@"; fi; }
ngay_mai()  { date -d tomorrow +%F 2&gt;/dev/null || date -v+1d +%F; }
kich_thuoc(){ stat -c %s "\$1" 2&gt;/dev/null || stat -f %z "\$1"; }
printf 'mode=yes\\n' &gt; thu.conf
sedi 's/yes/no/' thu.conf
echo "OS=\$OS bash=\${BASH_VERSION%%(*} ngay_mai=\$(ngay_mai) size=\$(kich_thuoc thu.conf) \$(cat thu.conf)"</code></pre>
<pre><code>/bin/bash hai-noi.sh          <span class="tok-comment"># on the Mac</span>
bash hai-noi.sh               <span class="tok-comment"># in the Ubuntu container</span></code></pre>
<div class="out">OS=mac bash=3.2.57 ngay_mai=2026-09-29 size=8 mode=no
OS=linux bash=5.2.21 ngay_mai=2026-09-29 size=8 mode=no</div>
<p>Three techniques are packed in there. <strong><code>#!/usr/bin/env bash</code></strong> picks the first <code>bash</code> on <code>PATH</code> — Homebrew's bash 5 on a configured Mac, the system bash on Linux — while <code>#!/bin/bash</code> pins the Mac to 3.2. <strong>Feature detection</strong>: <code>sedi</code> asks sed itself (<code>--version</code> only exists in GNU sed) instead of guessing from <code>uname</code>; that also works on a Mac where someone put GNU sed first in <code>PATH</code>. <strong>Try-then-fall-back</strong>: <code>date -d … || date -v…</code> — the GNU form fails fast on BSD and the second form runs. The <code>uname</code> case is still useful for things that genuinely depend on the OS (package manager, service manager), and the <code>microsoft</code> check tells WSL apart from a real Linux box: on WSL2 the kernel version string contains the word "microsoft" (for example <code>…-microsoft-standard-WSL2</code>; the course has no Windows machine to show real output).</p>
<p>When a script truly needs bash 4+, say so on line 3 instead of failing mysteriously on line 40:</p>
<pre><code class="language-bash">if (( BASH_VERSINFO[0] &lt; 4 )); then
  echo "Can bash &gt;= 4, dang chay \$BASH_VERSION (\$BASH)" &gt;&amp;2
  echo "macOS: brew install bash, roi chay: bash \$0" &gt;&amp;2
  exit 2
fi</code></pre>
<div class="out">Can bash &gt;= 4, dang chay 3.2.57(1)-release (/bin/bash)
macOS: brew install bash, roi chay: bash can-bash4.sh</div>
<div class="pitfall co-tieu-de"><strong>"Works on my Mac" is not a test of a deploy script.</strong> The reverse trap is just as common as the one this lesson started with: a teammate writes <code>sed -i '' 's/…/…/' .env</code> on a Mac, it works, they commit it, and on the Ubuntu VPS GNU sed reads <code>''</code> as an empty script and <code>'s/…/…/'</code> as a <em>file name</em> — "No such file or directory", in the middle of a deploy. Anything that runs on the server must be tested where it runs: in an <code>ubuntu:24.04</code> container on your Mac (<code>docker run --rm -v "\$PWD:/w" -w /w ubuntu:24.04 bash deploy.sh --dry-run</code>), or in CI. Chapter 7's <code>shellcheck</code> will not catch this — both lines are valid shell.</div>

<h3>Flag table: shell switches you will actually use on a Mac</h3>
<table>
<tr><th>Command</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>zsh -f</code></td><td>Start zsh without any startup files — see the defaults</td><td><code>zsh -f -c 'setopt'</code> → <code>nohashdirs</code>, <code>norcs</code></td></tr>
<tr><td><code>setopt</code> / <code>unsetopt NAME</code></td><td>List changed options / switch one on or off</td><td><code>setopt KSH_ARRAYS</code></td></tr>
<tr><td><code>emulate -L sh</code></td><td>Inside a function: behave like POSIX sh until it returns</td><td>paste-in bash snippets</td></tr>
<tr><td><code>\${=v}</code> · <code>\${(U)v}</code></td><td>zsh: split this one expansion · upper-case it</td><td><code>echo \${(U)\$(echo abc)}</code> → <code>ABC</code></td></tr>
<tr><td><code>print -l</code></td><td>zsh: print each argument on its own line</td><td><code>print -l g/**/*.log</code></td></tr>
<tr><td><code>chsh -s PATH</code></td><td>Change your login shell; PATH must be listed in <code>/etc/shells</code></td><td><code>chsh -s /bin/zsh</code></td></tr>
<tr><td><code>BASH_VERSINFO[0]</code></td><td>Major version of the running bash</td><td><code>3</code> in <code>/bin/bash</code>, <code>5</code> on Ubuntu</td></tr>
<tr><td><code>uname -s</code> · <code>sw_vers -productVersion</code></td><td>Kernel name · macOS version</td><td><code>Darwin</code> · <code>27.0</code></td></tr>
</table>
<div class="kv-grid">
  <div class="kv"><span class="k">When to use zsh</span><span class="v">Typing at the prompt on a Mac. Completion, history search and <code>**</code> are genuinely better.</span></div>
  <div class="kv"><span class="k">When NOT to use zsh</span><span class="v">For scripts that run anywhere else. Your VPS, CI runners and Docker images have bash, and many have no zsh at all.</span></div>
  <div class="kv"><span class="k">When to install GNU tools</span><span class="v">When you run many one-liners copied from Linux docs. Use the <code>g</code>-prefixed names in scripts (Lesson 15.2), not a <code>PATH</code> change hidden in your rc file.</span></div>
</div>

<h3>Try it step by step</h3>
<p>On a Mac, in a scratch folder, with no configuration involved. Predict each line before you run it.</p>
<pre><code class="language-bash">mkdir -p ~/thu-linux/mac15 &amp;&amp; cd ~/thu-linux/mac15
zsh -f -c 'arr=(a b c); echo "\${arr[1]} [\${arr[0]}]"'
/bin/bash -c 'arr=(a b c); echo "\${arr[1]} [\${arr[0]}]"'
zsh -f -c 'v="x y"; for w in \$v; do echo "[\$w]"; done'
printf 'k=1\\n' &gt; t.conf; sed -i 's/1/2/' t.conf; echo "rc=\$?"
sed -i.bak 's/1/2/' t.conf &amp;&amp; cat t.conf &amp;&amp; ls t.conf*
date -v+1d +%F; date -d tomorrow +%F 2&gt;&amp;1 | head -1
command -v timeout || echo "khong co timeout"</code></pre>
<div class="out">a []
b [a]
[x y]
sed: 2: "t.conf
": undefined label '.conf'
rc=1
k=2
t.conf
t.conf.bak
2026-09-29
date: illegal option -- d
khong co timeout</div>
<p>What to notice: zsh's index 1 is bash's index 0; zsh kept <code>"x y"</code> as one word; BSD sed again ran your file name as a sed script — this time <code>t</code> <em>is</em> a sed command (branch to a label), so the error changes to <code>undefined label '.conf'</code>: same cause, different message, which is exactly why you read the cause and not the wording; <code>-i.bak</code> worked and left a backup; <code>date -d</code> is not a thing on BSD. Then run the same block in <code>docker run --rm -it ubuntu:24.04 bash</code> (skip the zsh lines) and compare line by line.</p>

<h3>On Linux and WSL</h3>
<p>Nothing in this lesson changes on Ubuntu or inside WSL2 — they have GNU tools and a modern bash, which is the reason every portable script targets them first. Two notes. <code>zsh</code> is not installed on Ubuntu by default (<code>apt install zsh</code>) and it behaves exactly as on the Mac, including arrays from 1. And Ubuntu's <code>/bin/sh</code> is <code>dash</code>, not bash (Chapter 7), while on the Mac <code>/bin/sh</code> is bash 3.2 running in POSIX mode — measured: <code>/bin/sh --version</code> prints <code>GNU bash, version 3.2.57(1)-release</code>. A <code>#!/bin/sh</code> script that uses bash-only syntax therefore "works" on the Mac and fails on the server.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your SWP391 teammate on a Mac says the team's <code>rotate-logs.sh</code> "is broken". It was written on the Ubuntu VPS. Make it run on both without keeping two copies.</p><ol>
<li>In <code>~/thu-linux/mac15</code>, write a script with <code>#!/bin/bash</code> that: creates <code>app.log</code> with three lines, renames it to <code>app-\$(date -d yesterday +%F).log</code>, prints its size with <code>stat -c %s</code>, and replaces <code>ERROR</code> with <code>ERR</code> in it using <code>sed -i</code>.</li>
<li>Run it with <code>/bin/bash</code> on the Mac and write down <em>every</em> error line without fixing anything. Run it in <code>docker run --rm -v "\$PWD:/w" -w /w ubuntu:24.04 bash script.sh</code> and confirm it passes there.</li>
<li>Rewrite it with <code>#!/usr/bin/env bash</code>, the <code>sedi</code>/<code>kich_thuoc</code> helpers from this lesson, and a <code>hom_qua</code> helper using <code>date -d yesterday</code> with a <code>date -v-1d</code> fallback.</li>
<li>Run again in both places.</li></ol>
<p><strong>Done when:</strong> both runs print the same file name (yesterday's date), the same size and the same edited content, and you can explain in one sentence why BSD sed's error message quoted part of your <em>file name</em>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Darwin / XNU</span><span class="v">The open-source core of macOS; XNU is its kernel (Mach + a BSD layer).</span></div>
  <div class="kv"><span class="k">BSD tools</span><span class="v">The Berkeley-lineage versions of <code>sed</code>, <code>date</code>, <code>stat</code>… that Apple ships; flags differ from GNU.</span></div>
  <div class="kv"><span class="k">GNU coreutils</span><span class="v">The tool set on Linux distributions; on a Mac available from Homebrew with a <code>g</code> prefix.</span></div>
  <div class="kv"><span class="k">UNIX 03</span><span class="v">The Open Group's certification of a Unix system; macOS holds it, most Linux distributions do not apply.</span></div>
  <div class="kv"><span class="k">zsh option</span><span class="v">A behaviour switch set with <code>setopt</code> (for example <code>KSH_ARRAYS</code>, <code>NULL_GLOB</code>).</span></div>
  <div class="kv"><span class="k">Feature detection</span><span class="v">Asking a tool what it supports (<code>sed --version</code>) instead of assuming from the OS name.</span></div>
  <div class="kv"><span class="k">GPLv2 / GPLv3</span><span class="v">Software licences; bash moved to v3 at 4.0, which is why Apple stayed on 3.2.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>macOS is a certified Unix (Darwin/XNU + BSD tools), not Linux: no <code>/proc</code>, different flags, <code>uname -s</code> says <code>Darwin</code>.</li>
<li>zsh has been the default since macOS 10.15; <code>/bin/bash</code> is 3.2 because newer bash is GPLv3 — bash 4+ features break there.</li>
<li>zsh differs from bash: arrays start at 1, <code>\$v</code> is not split, unmatched globs are errors, <code>#</code> is not a comment when typed.</li>
<li>The BSD/GNU differences that matter most: <code>sed -i</code>, <code>date -d/-v</code>, <code>stat -c/-f</code>, <code>grep -P</code>, <code>find -printf</code>, <code>timeout</code>, <code>head -n -1</code>.</li>
<li>Some differences are silent (<code>xargs</code> on empty input, <code>**</code> in bash 3.2) — test where the script will run.</li>
<li>Portable scripts: <code>#!/usr/bin/env bash</code>, detect features, try GNU then fall back, and stop early with a clear message if bash is too old.</li>
</ul>

<a class="link-card" href="https://support.apple.com/en-us/102360" target="_blank" rel="noopener">
  <span class="lc-ico">🍎</span>
  <span class="lc-body"><span class="lc-title">Apple Support — Use zsh as the default shell on your Mac</span><span class="lc-sub">Apple's own statement that zsh is the default since macOS 10.15, how <code>chsh</code> works, and how to silence the bash warning.</span></span>
</a>
<a class="link-card" href="https://www.opengroup.org/openbrand/register/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">The Open Group — Register of certified UNIX products</span><span class="lc-sub">Where "macOS is UNIX 03" is written down, product by product, with registration dates.</span></span>
</a>
<a class="link-card" href="https://zsh.sourceforge.io/Doc/Release/Options.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">zsh manual — Options</span><span class="lc-sub">Every <code>setopt</code> switch used in this lesson (<code>KSH_ARRAYS</code>, <code>SH_WORD_SPLIT</code>, <code>NULL_GLOB</code>, <code>INTERACTIVE_COMMENTS</code>) with its default.</span></span>
</a>
<a class="link-card" href="https://man.freebsd.org/cgi/man.cgi?query=sed" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">FreeBSD sed(1) — the BSD side of the table</span><span class="lc-sub">Read the <code>-i extension</code> entry and the BSD sed error above stops being mysterious. Compare with man7.org's GNU sed(1).</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice on Code Lab</span><span class="lc-sub">The Linux &amp; Bash track: the portable-script habits from this lesson — quoting, <code>command -v</code>, exit codes — graded automatically.</span></span>
</a>

<p class="note-ct"><strong>Three commands that answer "why does this behave differently on my Mac?":</strong> <code>uname -s</code> (which kernel family), <code>sed --version</code> (GNU answers, BSD errors — the same trick works for <code>date</code> and <code>stat</code>), and <code>echo \$BASH_VERSION</code> inside the script (which bash actually ran it). Almost every cross-platform surprise is one of those three answers being different from what you assumed.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.1</span>
<h2>macOS: một Unix thật với zsh, bash 3.2 và công cụ BSD</h2>
<p class="lead">Mở Terminal trên Mac thì gần như mọi thứ của khoá này đều chạy: <code>ls</code>, ống dẫn, <code>grep</code>, quyền, <code>ssh</code>. Chính đó là cái bẫy. Hình dạng y hệt nên bạn thôi kiểm — rồi <code>sed -i</code> báo một lỗi vô nghĩa, một script chạy ngon trên VPS chết ở dòng 40, còn <code>date -d</code> thì không tồn tại. Bài này gom lại MỌI khác biệt của Mac mà khoá đã nhắc tới, đo từng cái trên một máy Mac thật, và kết thúc bằng một script cư xử y hệt trên laptop lẫn trên máy chủ.</p>

<h3>Cùng họ, khác nhà</h3>
${slide('lx-15', 3, 'macOS là Unix có chứng nhận — nhưng không phải Linux')}
<p>Mục 0 đã vẽ cây họ; đây là phần quan trọng cho việc hằng ngày. macOS dựng trên <strong>Darwin</strong>, có nhân (kernel) <strong>XNU</strong> ghép vi nhân Mach với một lớp lấy từ BSD Unix. Các công cụ dòng lệnh Apple đi kèm — <code>sed</code>, <code>grep</code>, <code>date</code>, <code>stat</code>, <code>find</code> — phần lớn là bản <strong>BSD</strong>. Linux chỉ là một nhân; một bản phân phối (distro) như Ubuntu bọc nó bằng bộ công cụ <strong>GNU</strong>. Cả hai họ đều sinh ra từ ý tưởng Unix năm 1969, nhưng là hai bộ mã riêng, và cờ lệnh trôi xa nhau suốt bốn mươi năm.</p>
<pre><code class="language-bash">sw_vers
uname -srm
uname -v | cut -c1-60
ls /proc</code></pre>
<div class="out">ProductName:		macOS
ProductVersion:		27.0
BuildVersion:		26A428
Darwin 27.0.0 arm64
Darwin Kernel Version 27.0.0: Tue Aug 11 21:22:49 PDT 2026;
ls: /proc: No such file or directory</div>
<p>Hai điều đọc ra được. <code>uname -s</code> nói <code>Darwin</code>, không phải <code>Linux</code> — đây là phép thử một chữ mà script dùng để biết mình đang ở đâu. Và KHÔNG có <code>/proc</code>: mọi mẹo ở Chương 5 và 12 đọc <code>/proc/PID/…</code> không có bản tương đương trực tiếp trên Mac (thay bằng <code>ps -o</code> và <code>lsof -p</code>).</p>
<div class="callout ok"><strong>"Unix" là một nhãn hiệu có bộ kiểm thử đứng sau.</strong> Sổ đăng ký của The Open Group ghi <em>macOS version 26.0 Tahoe on Apple silicon-based Mac computers</em> đạt chuẩn <strong>UNIX 03</strong> (đăng ký 29/08/2025; kiểm 09/2026). Phần lớn bản Linux không bao giờ đi xin chứng nhận này — họ nhắm tới tương thích POSIX. Vậy "Mac có phải Unix không?" — đúng theo nghĩa đen. "Mac có phải Linux không?" — không. Máy chủ của bạn chạy cái thứ hai.</div>

<h3>Vì sao shell mặc định là zsh, và vì sao /bin/bash là đồ năm 2007</h3>
${slide('lx-15', 4, 'zsh mặc định từ 2019 vì bash mới là GPLv3')}
<pre><code class="language-bash">echo \$SHELL
zsh --version
/bin/bash --version | head -1
brew info bash | head -1</code></pre>
<div class="out">/bin/zsh
zsh 5.9 (arm64-apple-darwin26.0)
GNU bash, version 3.2.57(1)-release (arm64-apple-darwin26)
==&gt; bash: stable 5.3.20 (bottled), HEAD</div>
<p>Trang hỗ trợ của chính Apple viết: "Starting with macOS 10.15, your Mac uses zsh as the default login shell and interactive shell" (Catalina, 2019). Bash vẫn được cài, nhưng đóng băng ở 3.2 — bản cuối cùng phát hành theo giấy phép GPLv2. Từ bash 4.0 (2009) trở đi, bash dùng GPLv3, thứ Apple không đưa vào hệ điều hành. Thay vì giữ một bash mười hai năm tuổi làm mặc định, Apple chuyển sang zsh, vốn dùng giấy phép dễ dãi kiểu MIT. Bash mới nhất (5.3, Homebrew báo <code>5.3.20</code>) chỉ cách một lệnh <code>brew install bash</code>, nhưng nó nằm ở <code>/opt/homebrew/bin/bash</code> — còn <code>/bin/bash</code> mãi là 3.2.</p>
<p>Những gì bash 3.2 KHÔNG có, và vì thế vỡ trên Mac: mảng kết hợp (<code>declare -A</code>, Bài 13.1), <code>mapfile</code>/<code>readarray</code>, đổi hoa thường <code>\${x^^}</code>, <code>**</code> với <code>shopt -s globstar</code>, chỉ số âm <code>\${arr[-1]}</code>, <code>|&amp;</code>, và <code>wait -n</code>. Đo thật:</p>
<pre><code>/bin/bash -c 'arr=(tao cam); echo \${arr[-1]}'
/bin/bash -c 'shopt -s globstar'</code></pre>
<div class="out">/bin/bash: arr: bad array subscript

/bin/bash: line 0: shopt: globstar: invalid shell option name</div>
<p>Mục 0.3 đã cho thấy lỗi <code>declare -A</code> và <code>\${x^^}</code>; Bài 8.2 đã đo zsh đọc file khởi động nào (<code>.zshenv</code> → <code>.zprofile</code> → <code>.zshrc</code> → <code>.zlogin</code>). Bài này không lặp lại — nó thêm những chỗ người ta vấp khi GÕ và khi VIẾT SCRIPT trong zsh.</p>

<h3>zsh không phải bash: bốn chỗ hay vấp</h3>
${slide('lx-15', 5, 'zsh không phải bash: mảng từ 1, không tách từ, glob không khớp báo lỗi, # khi gõ tay')}
<p>Cùng một file năm dòng, chạy bằng cả hai shell trên Mac. <code>zsh -f</code> khởi động zsh mà KHÔNG đọc file khởi động nào, nên cái bạn thấy là hành vi mặc định của zsh, không phải cấu hình của ai đó:</p>
<pre><code class="language-bash"><span class="tok-comment"># z1.sh</span>
arr=(tao cam le)
echo "\${arr[1]} \${arr[0]}"
v="mot hai ba"
for w in \$v; do echo "tu: \$w"; done
ls *.log</code></pre>
<pre><code>zsh -f z1.sh
/bin/bash z1.sh</code></pre>
<div class="out">tao
tu: mot hai ba
z1.sh:5: no matches found: *.log

cam tao
tu: mot
tu: hai
tu: ba
ls: *.log: No such file or directory</div>
<table>
<tr><th>Khác biệt</th><th>zsh (mặc định)</th><th>bash</th><th>Bắt zsh cư xử như bash</th></tr>
<tr><td>Chỉ số mảng</td><td>bắt đầu từ <strong>1</strong>; <code>\${arr[0]}</code> rỗng</td><td>bắt đầu từ 0</td><td><code>setopt KSH_ARRAYS</code></td></tr>
<tr><td><code>\$v</code> không nháy</td><td>vẫn là <strong>MỘT từ</strong> (không cắt từ)</td><td>cắt theo khoảng trắng (Bài 6.2)</td><td><code>\${=v}</code> cắt một chỗ; <code>setopt SH_WORD_SPLIT</code> cắt mọi nơi</td></tr>
<tr><td>Glob (mẫu tên file) không khớp gì</td><td>lỗi <code>no matches found</code>, lệnh <strong>KHÔNG chạy</strong></td><td>mẫu được truyền nguyên văn</td><td><code>setopt NULL_GLOB</code> (thành rỗng) hoặc <code>NO_NOMATCH</code></td></tr>
<tr><td><code>#</code> gõ ở dấu nhắc</td><td><strong>không</strong> phải chú thích (Mục 0.3)</td><td>là chú thích</td><td><code>setopt interactivecomments</code></td></tr>
<tr><td><code>echo 'a\\tb'</code></td><td>in ra một dấu tab thật (mặc định hiểu ký tự thoát)</td><td>in <code>a\\tb</code></td><td>dùng <code>print -r</code> / <code>printf</code> ở cả hai</td></tr>
<tr><td>Glob đệ quy</td><td><code>**/*.log</code> chạy ngay</td><td>cần bash 4 + <code>globstar</code></td><td>—</td></tr>
<tr><td>Mảng kết hợp</td><td><code>typeset -A</code> chạy được</td><td>chỉ bash 4+; <code>/bin/bash</code> 3.2 KHÔNG có</td><td>—</td></tr>
</table>
<p>Hàng cắt từ là hàng đổi nghĩa IM LẶNG: một vòng lặp xử lý ba máy chủ trong bash sẽ xử lý MỘT chuỗi tên <code>"host1 host2 host3"</code> trong zsh. Bài 6.2 dạy bạn đặt biến trong nháy chính vì bash cắt chúng; zsh chọn mặc định ngược lại. Hàng glob là hàng ỒN ÀO: trong zsh tương tác, <code>rm *.tmp</code> ở thư mục không có file <code>.tmp</code> nào là một lỗi, chứ không phải <code>rm</code> than không có file tên đúng là <code>*.tmp</code>.</p>
<p>Hai công cụ chỉ zsh có đáng biết, vì chúng giải quyết chuyện "đoạn bash trong zsh" tại chỗ. <code>emulate -L sh</code> đặt trong một hàm bắt hàm đó cư xử như sh POSIX cho tới khi nó trả về; còn <code>\${=v}</code> yêu cầu cắt từ đúng một chỗ:</p>
<pre><code>zsh -f -c 'v="mot hai ba"; for w in \${=v}; do echo "tach: \$w"; done'
zsh -f -c 'f() { emulate -L sh; v="1 2"; for w in \$v; do echo "sh: \$w"; done; }; f'
zsh -f -c 'setopt KSH_ARRAYS; arr=(tao cam); echo "\${arr[0]}"'</code></pre>
<div class="out">tach: mot
tach: hai
tach: ba
sh: 1
sh: 2
tao</div>
<div class="callout warn"><strong>Luật thực dụng: GÕ bằng zsh, VIẾT SCRIPT bằng bash.</strong> Giữ zsh làm shell tương tác — gợi ý tự động và tìm lịch sử của nó thật sự tốt — nhưng mọi script bạn viết đều mở đầu bằng <code>#!/usr/bin/env bash</code> và chạy dưới bash, kể cả trên Mac. Đừng <code>source</code> một script bash vào phiên zsh rồi mong nó cư xử y hệt; hãy chạy nó như một chương trình (<code>./script.sh</code> hoặc <code>bash script.sh</code>) để dòng shebang quyết định.</div>

<h3>BSD và GNU: bảng đo thật</h3>
${slide('lx-15', 6, 'BSD vs GNU: cùng tên lệnh, khác cờ')}
<p>Mọi hàng dưới đây chạy trong cùng một ngày trên Mac (công cụ BSD của Apple, gọi bằng đường dẫn tuyệt đối để không bí danh hay hàm nào xen vào) và trong container Ubuntu 24.04 (GNU coreutils 9.4, GNU sed 4.9, GNU grep 3.11). Các chương trước đã gặp vài hàng lẻ tẻ — <code>sed -i ''</code> ở Bài 3.5, <code>grep</code> BRE và <code>\\|</code> ở 3.3, <code>readlink -f</code> ở 7.1 — đây là cả danh sách ở một chỗ.</p>
<table>
<tr><th>Việc</th><th>GNU (Ubuntu)</th><th>BSD (macOS) — đo thật</th><th>Chạy được cả hai</th></tr>
<tr><td>Sửa file tại chỗ</td><td><code>sed -i 's/a/b/' f</code></td><td><code>sed -i '' 's/a/b/' f</code> (chuỗi rỗng là đuôi file sao lưu)</td><td><code>sed -i.bak 's/a/b/' f</code> rồi <code>rm f.bak</code></td></tr>
<tr><td>Ngày mai</td><td><code>date -d tomorrow +%F</code></td><td><code>date -v+1d +%F</code> → <code>2026-09-29</code></td><td>thử <code>-d</code>, hỏng thì <code>-v</code></td></tr>
<tr><td>Đọc một chuỗi ngày</td><td><code>date -d 2026-09-01 +%A</code></td><td><code>date -j -f %Y-%m-%d 2026-09-01 +%A</code> → <code>Tuesday</code></td><td>—</td></tr>
<tr><td>Cỡ file (byte)</td><td><code>stat -c %s f</code></td><td><code>stat -f %z f</code></td><td><code>wc -c &lt; f</code></td></tr>
<tr><td>Regex kiểu Perl</td><td><code>grep -oP '\\d+(?=ms)'</code></td><td><code>grep: invalid option -- P</code></td><td><code>grep -oE '[0-9]+ms'</code> hoặc <code>perl -nle</code></td></tr>
<tr><td>In theo mẫu khi tìm</td><td><code>find . -printf '%s %p\\n'</code></td><td><code>find: -printf: unknown primary or operator</code></td><td><code>find . -exec stat -f '%z %N' {} +</code> (Mac)</td></tr>
<tr><td>Giới hạn thời gian</td><td><code>timeout 5 cmd</code> (mã thoát 124)</td><td><code>command not found: timeout</code></td><td><code>gtimeout</code> (Homebrew coreutils) hoặc <code>perl -e 'alarm shift; exec @ARGV' 5 cmd</code></td></tr>
<tr><td>Mọi dòng trừ dòng cuối</td><td><code>head -n -1</code></td><td><code>head: illegal line count -- -1</code></td><td><code>sed '\$d'</code></td></tr>
<tr><td>Đảo thứ tự dòng</td><td><code>tac</code></td><td>không có <code>tac</code>; <code>tail -r</code></td><td><code>awk '{a[NR]=\$0} END{for(i=NR;i;i--)print a[i]}'</code></td></tr>
<tr><td>Cỡ thư mục (byte)</td><td><code>du -sb</code></td><td><code>du: invalid option -- b</code></td><td><code>du -sk</code> (kilobyte, cả hai)</td></tr>
<tr><td>Hỏi phiên bản</td><td><code>sed --version</code> → <code>sed (GNU sed) 4.9</code></td><td><code>sed: illegal option -- -</code></td><td>chính cái lỗi đó LÀ phép thử</td></tr>
</table>

<h3>Đọc lỗi, không chỉ né lỗi</h3>
${slide('lx-15', 7, 'Lỗi thật khi đem lệnh GNU sang Mac — và đọc lỗi đầu tiên cho đúng')}
<pre><code class="language-bash">printf 'mode=yes\\n' &gt; m.conf
sed -i 's/yes/no/' m.conf</code></pre>
<div class="out">sed: 1: "m.conf
": invalid command code m</div>
<p>Đây là thông báo khó hiểu nhất trong danh sách, và đáng giải mã một lần cho xong. <code>sed -i</code> của BSD <em>bắt buộc</em> có một đối số: đuôi file sao lưu. Nên nó lấy <code>'s/yes/no/'</code> làm cái đuôi đó. Đối số tiếp theo, <code>m.conf</code>, lúc này bị đọc như KỊCH BẢN sed, và sed than rằng <code>m</code> không phải lệnh sed. Biểu thức regex của bạn chẳng sai gì cả. Cách sửa <code>sed -i '' …</code> truyền một đuôi rỗng cho rõ ràng — và CHÍNH dòng đó lại hỏng trên GNU sed, vì GNU đọc <code>''</code> là kịch bản. <code>sed -i.bak</code> (đuôi dính liền với cờ) thì cả hai đều hiểu.</p>
<pre><code>/usr/bin/grep --version
/usr/bin/sort --version | head -1</code></pre>
<div class="out">grep (BSD grep, GNU compatible) 2.6.0-FreeBSD
2.3-Apple (199)</div>
<div class="callout">Để ý chữ "GNU compatible" trên dòng giới thiệu của grep: grep của Apple nhận nhiều tuỳ chọn dài kiểu GNU, nhưng KHÔNG nhận <code>-P</code>. Còn <code>sort</code> của Apple thật ra có gốc từ GNU sort, nên <code>sort -h</code> và <code>sort -V</code> chạy được. "Nó là BSD nên chắc không có X" là một phỏng đoán; chạy thử lệnh mới là một phép đo.</div>

<h3>Thứ đã giống nhau — và những khác biệt không phát ra tiếng</h3>
${slide('lx-15', 8, 'Có thứ đã giống — và có thứ khác mà IM LẶNG (xargs với đầu vào rỗng)')}
<p>Các bài blog cũ đầy câu "macOS không có <code>readlink -f</code>". Trên macOS 27, đo thật: <code>readlink -f ../lx-15/m.conf</code> in ra đường dẫn tuyệt đối; <code>ls --color=auto</code> chạy; <code>sed -E</code> nghĩa là regex mở rộng ở cả hai; <code>xargs -r</code> được chấp nhận. Apple đã lặng lẽ lấp vài khe hở. Số khác vẫn còn: <code>ls --time-style</code> là <code>unrecognized option</code>, <code>du -sb</code> là <code>invalid option -- b</code>.</p>
<p>Khác biệt NGUY HIỂM là những cái KHÔNG báo lỗi:</p>
<pre><code>printf '' | xargs echo chay</code></pre>
<div class="out">chay           <span class="tok-comment"># Ubuntu: GNU xargs vẫn chạy lệnh một lần dù không có đầu vào</span>
               <span class="tok-comment"># Mac: BSD xargs không in gì</span></div>
<p>Một chuỗi dọn dẹp kiểu <code>find . -name '*.tmp' | xargs rm</code> khi không tìm thấy gì sẽ làm GNU <code>rm</code> than "missing operand" (và làm script chết nếu có <code>set -e</code>), trong khi Mac im lặng. Đó là lý do Bài 3.2 dạy <code>xargs -r</code>: nó bắt GNU cư xử như BSD, và BSD thì nhận cờ đó. <code>**</code> cũng vậy: trong bash 3.2 không có <code>globstar</code>, <code>g/**/*.log</code> lặng lẽ cư xử như <code>g/*/*.log</code> và chỉ tìm thấy một file trong ba.</p>
<pre><code>/bin/bash -c 'echo g/**/*.log'
zsh -f -c 'print -l g/**/*.log'</code></pre>
<div class="out">g/a/y.log
g/a/b/z.log
g/a/y.log
g/x.log</div>

<h3>Một script chạy được cả hai nơi: dò khả năng, đừng dò tên máy</h3>
${slide('lx-15', 9, 'Script chạy cả hai nơi: dò khả năng, đừng dò tên máy')}
<pre><code class="language-bash">#!/usr/bin/env bash
set -euo pipefail
case "\$(uname -s)" in
  Darwin) OS=mac ;;
  Linux)  grep -qi microsoft /proc/version 2&gt;/dev/null &amp;&amp; OS=wsl || OS=linux ;;
  MINGW*|MSYS*|CYGWIN*) OS=windows-bash ;;
  *) OS=khac ;;
esac
sedi()      { if sed --version &gt;/dev/null 2&gt;&amp;1; then sed -i "\$@"; else sed -i '' "\$@"; fi; }
ngay_mai()  { date -d tomorrow +%F 2&gt;/dev/null || date -v+1d +%F; }
kich_thuoc(){ stat -c %s "\$1" 2&gt;/dev/null || stat -f %z "\$1"; }
printf 'mode=yes\\n' &gt; thu.conf
sedi 's/yes/no/' thu.conf
echo "OS=\$OS bash=\${BASH_VERSION%%(*} ngay_mai=\$(ngay_mai) size=\$(kich_thuoc thu.conf) \$(cat thu.conf)"</code></pre>
<pre><code>/bin/bash hai-noi.sh          <span class="tok-comment"># trên Mac</span>
bash hai-noi.sh               <span class="tok-comment"># trong container Ubuntu</span></code></pre>
<div class="out">OS=mac bash=3.2.57 ngay_mai=2026-09-29 size=8 mode=no
OS=linux bash=5.2.21 ngay_mai=2026-09-29 size=8 mode=no</div>
<p>Ba kỹ thuật được gói trong đó. <strong><code>#!/usr/bin/env bash</code></strong> chọn <code>bash</code> đầu tiên trong <code>PATH</code> — bash 5 của Homebrew trên một máy Mac đã cấu hình, bash hệ thống trên Linux — còn <code>#!/bin/bash</code> ghim Mac vào 3.2. <strong>Dò khả năng</strong> (feature detection): <code>sedi</code> hỏi thẳng sed (<code>--version</code> chỉ có ở GNU sed) thay vì đoán từ <code>uname</code>; cách này đúng cả trên một máy Mac mà ai đó đã đặt GNU sed lên đầu <code>PATH</code>. <strong>Thử-rồi-lùi</strong>: <code>date -d … || date -v…</code> — dạng GNU hỏng ngay trên BSD và dạng thứ hai chạy. Nhánh <code>uname</code> vẫn hữu ích cho thứ thật sự phụ thuộc hệ điều hành (trình quản lý gói, trình quản lý dịch vụ), và phép thử <code>microsoft</code> phân biệt WSL với một máy Linux thật: trên WSL2 chuỗi phiên bản nhân có chữ "microsoft" (ví dụ <code>…-microsoft-standard-WSL2</code>; khoá không có máy Windows để in output thật).</p>
<p>Khi một script thật sự cần bash 4+, hãy nói điều đó ngay ở dòng 3 thay vì chết khó hiểu ở dòng 40:</p>
<pre><code class="language-bash">if (( BASH_VERSINFO[0] &lt; 4 )); then
  echo "Can bash &gt;= 4, dang chay \$BASH_VERSION (\$BASH)" &gt;&amp;2
  echo "macOS: brew install bash, roi chay: bash \$0" &gt;&amp;2
  exit 2
fi</code></pre>
<div class="out">Can bash &gt;= 4, dang chay 3.2.57(1)-release (/bin/bash)
macOS: brew install bash, roi chay: bash can-bash4.sh</div>
<div class="pitfall co-tieu-de"><strong>"Chạy được trên Mac của tôi" không phải là phép thử cho một script deploy.</strong> Cái bẫy ngược lại cũng phổ biến y như cái bẫy mở đầu bài: một bạn cùng nhóm viết <code>sed -i '' 's/…/…/' .env</code> trên Mac, chạy ngon, commit, và trên VPS Ubuntu GNU sed đọc <code>''</code> là một kịch bản rỗng còn <code>'s/…/…/'</code> là một TÊN FILE — "No such file or directory", ngay giữa lúc deploy. Thứ gì chạy trên máy chủ phải được thử ở nơi nó chạy: trong container <code>ubuntu:24.04</code> ngay trên Mac của bạn (<code>docker run --rm -v "\$PWD:/w" -w /w ubuntu:24.04 bash deploy.sh --dry-run</code>), hoặc trong CI. <code>shellcheck</code> của Chương 7 sẽ không bắt được lỗi này — cả hai dòng đều là shell hợp lệ.</div>

<h3>Bảng cờ: những công tắc shell bạn sẽ thật sự dùng trên Mac</h3>
<table>
<tr><th>Lệnh</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>zsh -f</code></td><td>Khởi động zsh không đọc file khởi động nào — thấy hành vi mặc định</td><td><code>zsh -f -c 'setopt'</code> → <code>nohashdirs</code>, <code>norcs</code></td></tr>
<tr><td><code>setopt</code> / <code>unsetopt TÊN</code></td><td>Liệt kê tuỳ chọn đã đổi / bật hoặc tắt một cái</td><td><code>setopt KSH_ARRAYS</code></td></tr>
<tr><td><code>emulate -L sh</code></td><td>Trong một hàm: cư xử như sh POSIX tới khi hàm trả về</td><td>dán đoạn bash vào zsh</td></tr>
<tr><td><code>\${=v}</code> · <code>\${(U)v}</code></td><td>zsh: cắt từ đúng chỗ này · viết hoa</td><td><code>echo \${(U)\$(echo abc)}</code> → <code>ABC</code></td></tr>
<tr><td><code>print -l</code></td><td>zsh: in mỗi đối số trên một dòng</td><td><code>print -l g/**/*.log</code></td></tr>
<tr><td><code>chsh -s ĐƯỜNG_DẪN</code></td><td>Đổi shell đăng nhập; đường dẫn phải có trong <code>/etc/shells</code></td><td><code>chsh -s /bin/zsh</code></td></tr>
<tr><td><code>BASH_VERSINFO[0]</code></td><td>Số phiên bản chính của bash đang chạy</td><td><code>3</code> với <code>/bin/bash</code>, <code>5</code> trên Ubuntu</td></tr>
<tr><td><code>uname -s</code> · <code>sw_vers -productVersion</code></td><td>Tên nhân · phiên bản macOS</td><td><code>Darwin</code> · <code>27.0</code></td></tr>
</table>
<div class="kv-grid">
  <div class="kv"><span class="k">Khi nào dùng zsh</span><span class="v">Gõ lệnh ở dấu nhắc trên Mac. Gợi ý tự động, tìm lịch sử và <code>**</code> thật sự tốt hơn.</span></div>
  <div class="kv"><span class="k">Khi nào KHÔNG dùng zsh</span><span class="v">Cho script sẽ chạy ở bất kỳ đâu khác. VPS, máy CI và ảnh Docker đều có bash, và nhiều nơi không hề có zsh.</span></div>
  <div class="kv"><span class="k">Khi nào cài công cụ GNU</span><span class="v">Khi bạn chạy nhiều lệnh một dòng chép từ tài liệu Linux. Trong script dùng tên có chữ <code>g</code> (Bài 15.2), đừng giấu một thay đổi <code>PATH</code> trong file rc.</span></div>
</div>

<h3>Chạy thử từng bước</h3>
<p>Trên Mac, trong một thư mục thử, không dính tới cấu hình nào. Đoán từng dòng trước khi chạy.</p>
<pre><code class="language-bash">mkdir -p ~/thu-linux/mac15 &amp;&amp; cd ~/thu-linux/mac15
zsh -f -c 'arr=(a b c); echo "\${arr[1]} [\${arr[0]}]"'
/bin/bash -c 'arr=(a b c); echo "\${arr[1]} [\${arr[0]}]"'
zsh -f -c 'v="x y"; for w in \$v; do echo "[\$w]"; done'
printf 'k=1\\n' &gt; t.conf; sed -i 's/1/2/' t.conf; echo "rc=\$?"
sed -i.bak 's/1/2/' t.conf &amp;&amp; cat t.conf &amp;&amp; ls t.conf*
date -v+1d +%F; date -d tomorrow +%F 2&gt;&amp;1 | head -1
command -v timeout || echo "khong co timeout"</code></pre>
<div class="out">a []
b [a]
[x y]
sed: 2: "t.conf
": undefined label '.conf'
rc=1
k=2
t.conf
t.conf.bak
2026-09-29
date: illegal option -- d
khong co timeout</div>
<p>Cần để ý: chỉ số 1 của zsh là chỉ số 0 của bash; zsh giữ <code>"x y"</code> thành một từ; BSD sed lại chạy tên file của bạn như một kịch bản sed — lần này <code>t</code> LÀ một lệnh sed thật (nhảy tới nhãn), nên lỗi đổi thành <code>undefined label '.conf'</code>: cùng nguyên nhân, khác câu chữ, và đó chính là lý do phải đọc ra nguyên nhân chứ không học thuộc câu chữ; <code>-i.bak</code> chạy và để lại một bản sao lưu; <code>date -d</code> không tồn tại trên BSD. Rồi chạy lại cùng khối đó trong <code>docker run --rm -it ubuntu:24.04 bash</code> (bỏ các dòng zsh) và so từng dòng.</p>

<h3>Trên Linux và WSL thì sao</h3>
<p>Không gì trong bài này đổi trên Ubuntu hay trong WSL2 — chúng có công cụ GNU và bash hiện đại, chính vì thế mọi script dùng chung đều nhắm tới chúng trước. Hai ghi chú. <code>zsh</code> không được cài sẵn trên Ubuntu (<code>apt install zsh</code>) và nó cư xử y như trên Mac, kể cả mảng bắt đầu từ 1. Và <code>/bin/sh</code> của Ubuntu là <code>dash</code>, không phải bash (Chương 7), trong khi trên Mac <code>/bin/sh</code> là bash 3.2 chạy ở chế độ POSIX — đo thật: <code>/bin/sh --version</code> in <code>GNU bash, version 3.2.57(1)-release</code>. Một script <code>#!/bin/sh</code> dùng cú pháp chỉ bash có vì thế "chạy được" trên Mac và hỏng trên máy chủ.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn cùng nhóm SWP391 dùng Mac báo script <code>rotate-logs.sh</code> của nhóm "bị hỏng". Nó được viết trên VPS Ubuntu. Sửa cho nó chạy được cả hai nơi mà không phải giữ hai bản.</p><ol>
<li>Trong <code>~/thu-linux/mac15</code>, viết một script <code>#!/bin/bash</code>: tạo <code>app.log</code> ba dòng, đổi tên thành <code>app-\$(date -d yesterday +%F).log</code>, in cỡ file bằng <code>stat -c %s</code>, và thay <code>ERROR</code> bằng <code>ERR</code> trong file bằng <code>sed -i</code>.</li>
<li>Chạy bằng <code>/bin/bash</code> trên Mac và chép lại MỌI dòng lỗi, chưa sửa gì. Chạy trong <code>docker run --rm -v "\$PWD:/w" -w /w ubuntu:24.04 bash script.sh</code> và xác nhận nó qua ở đó.</li>
<li>Viết lại với <code>#!/usr/bin/env bash</code>, hai hàm <code>sedi</code>/<code>kich_thuoc</code> của bài, và hàm <code>hom_qua</code> dùng <code>date -d yesterday</code> có đường lùi <code>date -v-1d</code>.</li>
<li>Chạy lại ở cả hai nơi.</li></ol>
<p><strong>Đạt khi:</strong> hai lần chạy in cùng một tên file (ngày hôm qua), cùng cỡ file và cùng nội dung đã sửa, và bạn giải thích được trong một câu vì sao thông báo lỗi của BSD sed lại trích một phần TÊN FILE của bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Darwin / XNU</span><span class="v">Phần lõi mã nguồn mở của macOS; XNU là nhân của nó (Mach + một lớp BSD).</span></div>
  <div class="kv"><span class="k">BSD tools (công cụ BSD)</span><span class="v">Bản <code>sed</code>, <code>date</code>, <code>stat</code>… dòng Berkeley mà Apple đi kèm; cờ khác GNU.</span></div>
  <div class="kv"><span class="k">GNU coreutils (bộ công cụ lõi GNU)</span><span class="v">Bộ lệnh trên các bản Linux; trên Mac cài từ Homebrew, tên có chữ <code>g</code> ở đầu.</span></div>
  <div class="kv"><span class="k">UNIX 03</span><span class="v">Chứng nhận hệ Unix của The Open Group; macOS có, phần lớn bản Linux không đi xin.</span></div>
  <div class="kv"><span class="k">zsh option (tuỳ chọn zsh)</span><span class="v">Công tắc hành vi bật bằng <code>setopt</code> (ví dụ <code>KSH_ARRAYS</code>, <code>NULL_GLOB</code>).</span></div>
  <div class="kv"><span class="k">Feature detection (dò khả năng)</span><span class="v">Hỏi thẳng công cụ nó hỗ trợ gì (<code>sed --version</code>) thay vì đoán từ tên hệ điều hành.</span></div>
  <div class="kv"><span class="k">GPLv2 / GPLv3 (giấy phép)</span><span class="v">Hai phiên bản giấy phép phần mềm; bash chuyển sang v3 từ bản 4.0, vì thế Apple đứng lại ở 3.2.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>macOS là Unix có chứng nhận (Darwin/XNU + công cụ BSD), không phải Linux: không có <code>/proc</code>, cờ khác, <code>uname -s</code> nói <code>Darwin</code>.</li>
<li>zsh là mặc định từ macOS 10.15; <code>/bin/bash</code> là 3.2 vì bash mới dùng GPLv3 — tính năng bash 4+ vỡ ở đó.</li>
<li>zsh khác bash: mảng bắt đầu từ 1, <code>\$v</code> không bị cắt từ, glob không khớp là lỗi, <code>#</code> gõ tay không phải chú thích.</li>
<li>Khác biệt BSD/GNU quan trọng nhất: <code>sed -i</code>, <code>date -d/-v</code>, <code>stat -c/-f</code>, <code>grep -P</code>, <code>find -printf</code>, <code>timeout</code>, <code>head -n -1</code>.</li>
<li>Có khác biệt IM LẶNG (<code>xargs</code> với đầu vào rỗng, <code>**</code> trong bash 3.2) — hãy thử ở nơi script sẽ chạy.</li>
<li>Script dùng chung: <code>#!/usr/bin/env bash</code>, dò khả năng, thử GNU rồi lùi, và dừng sớm với thông báo rõ nếu bash quá cũ.</li>
</ul>

<a class="link-card" href="https://support.apple.com/en-us/102360" target="_blank" rel="noopener">
  <span class="lc-ico">🍎</span>
  <span class="lc-body"><span class="lc-title">Apple Support — Dùng zsh làm shell mặc định trên Mac</span><span class="lc-sub">Chính Apple xác nhận zsh là mặc định từ macOS 10.15, cách dùng <code>chsh</code>, và cách tắt lời nhắc của bash.</span></span>
</a>
<a class="link-card" href="https://www.opengroup.org/openbrand/register/" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">The Open Group — Sổ đăng ký sản phẩm UNIX có chứng nhận</span><span class="lc-sub">Nơi ghi "macOS đạt UNIX 03", từng sản phẩm, kèm ngày đăng ký.</span></span>
</a>
<a class="link-card" href="https://zsh.sourceforge.io/Doc/Release/Options.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Sách hướng dẫn zsh — Options</span><span class="lc-sub">Mọi công tắc <code>setopt</code> dùng trong bài (<code>KSH_ARRAYS</code>, <code>SH_WORD_SPLIT</code>, <code>NULL_GLOB</code>, <code>INTERACTIVE_COMMENTS</code>) kèm giá trị mặc định.</span></span>
</a>
<a class="link-card" href="https://man.freebsd.org/cgi/man.cgi?query=sed" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">sed(1) của FreeBSD — phía BSD của bảng</span><span class="lc-sub">Đọc mục <code>-i extension</code> là lỗi BSD sed ở trên hết bí ẩn. So với sed(1) của GNU trên man7.org.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trên Code Lab</span><span class="lc-sub">Track Linux &amp; Bash: những thói quen viết script dùng chung của bài này — đặt nháy, <code>command -v</code>, mã thoát — chấm tự động.</span></span>
</a>

<p class="note-ct"><strong>Ba lệnh trả lời câu "sao trên Mac nó cư xử khác?":</strong> <code>uname -s</code> (họ nhân nào), <code>sed --version</code> (GNU thì trả lời, BSD thì báo lỗi — mẹo này dùng được cho cả <code>date</code> và <code>stat</code>), và <code>echo \$BASH_VERSION</code> đặt bên trong script (bash nào thật sự đã chạy nó). Gần như mọi bất ngờ khi chuyển máy đều là một trong ba câu trả lời đó khác với điều bạn đã giả định.</p>
</div>
`,
    },
    /* ─────────────────────────── 15.2 ─────────────────────────── */
    {
      title: '15.2 — macOS tools: Homebrew, launchd, and the commands only a Mac has|||15.2 — Công cụ của macOS: Homebrew, launchd và những lệnh chỉ Mac có',
      slug: 'lnx-15-2-macos-cong-cu',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Homebrew làm trình quản lý gói cho Mac (Cellar, opt, bin, Brewfile, bản GNU có chữ g), launchd thay cả systemd lẫn cron (plist, LaunchAgents, launchctl bootstrap/print), và những lệnh chỉ Mac có: pbcopy, open, mdfind, caffeinate, defaults, security.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.2</span>
<h2>macOS tools: Homebrew, launchd, and the commands only a Mac has</h2>
<p class="lead">Lesson 15.1 was about the things a Mac does <em>differently</em>. This one is about the things it does <em>instead</em>: there is no <code>apt</code>, so there is Homebrew; there is no systemd and no cron worth using, so there is launchd; and there is a set of small commands — <code>pbcopy</code>, <code>open</code>, <code>mdfind</code>, <code>caffeinate</code>, <code>defaults</code>, <code>security</code> — that have no Linux equivalent and that make a Mac terminal genuinely pleasant. Every command here was run on the course Mac with read-only options; the few that would change the machine (installing a package, loading an agent) are printed, explained, and left for you to run on your own Mac.</p>

<h3>Homebrew: the package manager macOS does not ship</h3>
${slide('lx-15', 10, 'Homebrew: trình quản lý gói mà macOS không có sẵn')}
<p>On Ubuntu, <code>apt</code> installs into <code>/usr</code> and the system owns it (Chapter 10). macOS has no general package manager, and <code>/usr/bin</code> is protected by System Integrity Protection — not even root may write there. Homebrew fills the gap by installing everything under its own prefix, owned by your user, so <code>brew install</code> never needs <code>sudo</code>:</p>
<pre><code class="language-bash">brew --prefix
brew --version
brew --cellar
brew list --formula | wc -l
brew list --versions git node gh</code></pre>
<div class="out">/opt/homebrew
Homebrew 7.0.6
/opt/homebrew/Cellar
     123
gh 2.93.0
git 2.51.1
node 26.8.1</div>
<p>Three directories explain every Homebrew question you will have:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Cellar/</span><span class="lz-t">/opt/homebrew/Cellar/git/2.51.1</span><span class="lz-d">Each version of each package in its own folder. A "bottle" (pre-built package) is unpacked here.</span></div>
  <div class="lz-step"><span class="lz-k">opt/</span><span class="lz-t">/opt/homebrew/opt/git → ../Cellar/git/2.51.1</span><span class="lz-d">A stable symlink to whichever version is current. Config files and plists point here so an upgrade does not break them.</span></div>
  <div class="lz-step"><span class="lz-k">bin/</span><span class="lz-t">/opt/homebrew/bin/git → ../Cellar/git/2.51.1/bin/git</span><span class="lz-d">The commands you type. This directory must be early in <code>PATH</code> (Lesson 8.1 showed <code>/etc/paths.d/homebrew</code> putting it there).</span></div>
</div>
<pre><code class="language-bash">ls -l /opt/homebrew/opt/git /opt/homebrew/bin/git | awk '{print \$1, \$9, \$10, \$11}'
/usr/bin/git --version
git --version
command -v git</code></pre>
<div class="out">lrwxr-xr-x@ /opt/homebrew/bin/git -&gt; ../Cellar/git/2.51.1/bin/git
lrwxr-xr-x@ /opt/homebrew/opt/git -&gt; ../Cellar/git/2.51.1
git version 2.54.0 (Apple Git-157)
git version 2.51.1
/opt/homebrew/bin/git</div>
<p>That last pair is a real surprise worth reading twice: Apple's own <code>/usr/bin/git</code> is <em>newer</em> (2.54.0) than the Homebrew one (2.51.1), yet typing <code>git</code> runs the older one, because <code>/opt/homebrew/bin</code> comes first in <code>PATH</code>. Nothing is wrong — PATH order decides, exactly as in Lesson 8.1. When a version looks wrong, <code>command -v</code> and <code>type -a</code> are still the first two commands.</p>
<div class="callout">Prefix by machine: <code>/opt/homebrew</code> on Apple silicon (M1 and later), <code>/usr/local</code> on Intel Macs. Scripts should ask <code>brew --prefix</code> rather than hard-code either. Homebrew also runs on Linux (prefix <code>/home/linuxbrew/.linuxbrew</code>), which is occasionally handy on a machine where you have no <code>sudo</code>.</div>

<h3>Everyday brew commands, with the flags that matter</h3>
<table>
<tr><th>Command</th><th>What it does</th><th>Note</th></tr>
<tr><td><code>brew search NAME</code></td><td>Find formulae and casks</td><td><code>brew search powershell</code> → <code>powershell</code>, <code>powershell@preview</code></td></tr>
<tr><td><code>brew info NAME</code></td><td>Version, dependencies, <strong>Caveats</strong></td><td>read the caveats — they tell you what to add to PATH</td></tr>
<tr><td><code>brew install NAME</code> · <code>--cask NAME</code></td><td>Install a command-line formula · a GUI app</td><td>no <code>sudo</code></td></tr>
<tr><td><code>brew upgrade</code> · <code>brew outdated</code></td><td>Upgrade everything · list what is behind</td><td>pin a version with <code>brew pin NAME</code></td></tr>
<tr><td><code>brew uninstall NAME</code> · <code>brew autoremove</code></td><td>Remove · remove dependencies nobody needs</td><td></td></tr>
<tr><td><code>brew list --versions</code> · <code>brew leaves</code></td><td>Installed with versions · only what you asked for (not dependencies)</td><td>30 leaves on the course Mac</td></tr>
<tr><td><code>brew deps --installed NAME</code> · <code>brew uses --installed NAME</code></td><td>What it needs · who needs it</td><td>before uninstalling a library</td></tr>
<tr><td><code>brew services list</code></td><td>Background services brew manages via launchd</td><td>next section</td></tr>
<tr><td><code>brew doctor</code> · <code>brew cleanup</code></td><td>Diagnose the install · delete old versions from Cellar</td><td>cleanup frees real disk space</td></tr>
</table>

<h3>GNU tools on a Mac, and a Brewfile for the whole team</h3>
${slide('lx-15', 11, 'GNU trên Mac: gọi tên có chữ g, hoặc đặt gnubin trước; Brewfile')}
<p>Lesson 15.1's table has a simple escape hatch: install the GNU versions. They arrive with a <code>g</code> prefix so they do not shadow Apple's tools — Homebrew's own caveat, printed by <code>brew info coreutils</code>, says so:</p>
<div class="out">==&gt; Caveats
Commands also provided by macOS and the commands dir, dircolors, vdir have been installed with the prefix "g".
If you need to use these commands with their normal names, you can add a "gnubin" directory to your PATH with:
  PATH="/opt/homebrew/opt/coreutils/libexec/gnubin:\$PATH"</div>
<pre><code class="language-bash">brew install coreutils gnu-sed grep findutils   <span class="tok-comment"># gdate gstat gtimeout gsed ggrep gfind…</span>
gsed -i 's/yes/no/' m.conf                     <span class="tok-comment"># GNU syntax, on a Mac</span>
gdate -d tomorrow +%F
gtimeout 5 ./chay-lau.sh</code></pre>
<p>You then have two choices, and they suit different people. <strong>Use the <code>g</code> names</strong> in your own scripts — explicit, and it cannot surprise anyone. Or <strong>put the <code>gnubin</code> directories first in <code>PATH</code></strong> in your <code>~/.zshrc</code>, so plain <code>sed</code> becomes GNU sed in your shell. The second feels convenient and has a cost: every tool you start from that shell — including Apple scripts and installers that expect BSD behaviour — now gets GNU tools. And a script that "works" only because <em>your</em> PATH has gnubin first will break for a teammate without it. For shared scripts, prefer the detection trick from 15.1: <code>command -v gsed &gt;/dev/null &amp;&amp; SED=gsed || SED=sed</code>.</p>
<p><strong>Brewfile</strong> is how a team makes "install the tools" one command. It is a plain file, committed to the repo:</p>
<pre><code class="language-ruby"># Brewfile — ở gốc repo
brew "bash"
brew "coreutils"
brew "gnu-sed"
brew "jq"
brew "shellcheck"
cask "visual-studio-code"</code></pre>
<pre><code class="language-bash">brew bundle install                  <span class="tok-comment"># install everything listed (and upgrade by default)</span>
brew bundle check                    <span class="tok-comment"># are all dependencies installed?</span>
brew bundle dump --file=Brewfile     <span class="tok-comment"># write what THIS Mac has into a Brewfile</span>
brew bundle cleanup                  <span class="tok-comment"># help: "Uninstall all dependencies not present in the Brewfile" — careful</span></code></pre>
<p>Those four descriptions come from <code>brew bundle --help</code> on the course Mac (Homebrew 7.0.6), which also lists VS Code extensions, npm and Go packages among what a Brewfile can hold. It is the Mac equivalent of a <code>package.json</code> for the whole machine — a new teammate clones the repo, runs <code>brew bundle install</code>, and has the same major versions as everyone else.</p>

<h3>launchd: one daemon replaces systemd and cron</h3>
${slide('lx-15', 12, 'launchd thay cả systemd lẫn cron trên Mac')}
<p>On Linux, systemd starts services and cron (or systemd timers) runs scheduled jobs — Chapter 11. On a Mac both jobs belong to <strong>launchd</strong>, which is process 1. A job is described by a <strong>property list</strong> (<code>.plist</code>, an XML file) instead of an INI-style unit file, but the ideas map almost one to one:</p>
<table>
<tr><th>Job</th><th>systemd / cron (Chapter 11)</th><th>launchd key</th></tr>
<tr><td>Name</td><td>unit file name</td><td><code>Label</code> (reverse-DNS, e.g. <code>vn.cuongthai.sao-luu</code>)</td></tr>
<tr><td>What to run</td><td><code>ExecStart=</code></td><td><code>ProgramArguments</code> — an array, <strong>no shell</strong>: no <code>~</code>, no <code>\$VAR</code>, no pipes</td></tr>
<tr><td>Restart when it dies</td><td><code>Restart=always</code></td><td><code>KeepAlive</code> = true</td></tr>
<tr><td>Start when loaded / at login</td><td><code>WantedBy=</code> + <code>enable</code></td><td><code>RunAtLoad</code> = true</td></tr>
<tr><td>Schedule</td><td><code>OnCalendar=</code> · crontab line</td><td><code>StartCalendarInterval</code> (dict of Hour, Minute, Weekday…) · <code>StartInterval</code> (seconds)</td></tr>
<tr><td>Environment</td><td><code>Environment=</code></td><td><code>EnvironmentVariables</code> (dict)</td></tr>
<tr><td>Logs</td><td>journald</td><td><code>StandardOutPath</code> / <code>StandardErrorPath</code> — plain files</td></tr>
<tr><td>Per-user job</td><td><code>systemctl --user</code></td><td><code>~/Library/LaunchAgents/</code> — domain <code>gui/&lt;uid&gt;</code></td></tr>
<tr><td>System job (root)</td><td><code>/etc/systemd/system/</code></td><td><code>/Library/LaunchDaemons/</code> — domain <code>system</code></td></tr>
</table>
<p><code>cron</code> still exists on macOS, but a Mac sleeps. <code>man launchd.plist</code> on macOS 27 puts it plainly under <code>StartCalendarInterval</code>: "Unlike cron which skips job invocations when the computer is asleep, launchd will start the job the next time the computer wakes up" (several missed runs are merged into one). On a laptop, that is the difference between a backup that happens and one that does not.</p>

<h3>A real LaunchAgent, written for you by brew services</h3>
${slide('lx-15', 13, 'Một LaunchAgent thật: brew services viết plist hộ bạn — và PATH mặc định của launchd')}
<p>The course Mac already has one: the PostgreSQL 14 that Homebrew runs in the background. Reading it touches nothing:</p>
<pre><code class="language-bash">brew services list
launchctl list | grep postgres
launchctl list | wc -l</code></pre>
<div class="out">Name          Status  User  File
postgresql@14 started admin ~/Library/LaunchAgents/homebrew.mxcl.postgresql@14.plist
postgresql@18 none
redis         none
2720	0	homebrew.mxcl.postgresql@14
     567</div>
<p><code>launchctl list</code> has three columns: PID (or <code>-</code> if not running), the last exit status (<code>man launchctl</code>: a negative number "represents the negative of the signal which stopped the job", e.g. <code>-9</code> = SIGKILL), and the label. The plist <code>brew services</code> wrote is short and readable:</p>
<pre><code class="language-xml">&lt;key&gt;KeepAlive&lt;/key&gt;          &lt;true/&gt;
&lt;key&gt;Label&lt;/key&gt;              &lt;string&gt;homebrew.mxcl.postgresql@14&lt;/string&gt;
&lt;key&gt;ProgramArguments&lt;/key&gt;
&lt;array&gt;
  &lt;string&gt;/opt/homebrew/opt/postgresql@14/bin/postgres&lt;/string&gt;
  &lt;string&gt;-D&lt;/string&gt;
  &lt;string&gt;/opt/homebrew/var/postgresql@14&lt;/string&gt;
&lt;/array&gt;
&lt;key&gt;RunAtLoad&lt;/key&gt;          &lt;true/&gt;
&lt;key&gt;StandardErrorPath&lt;/key&gt;  &lt;string&gt;/opt/homebrew/var/log/postgresql@14.log&lt;/string&gt;</code></pre>
<p>(an excerpt of <code>~/Library/LaunchAgents/homebrew.mxcl.postgresql@14.plist</code>, keys re-aligned for reading). Note it uses the <code>opt/</code> path, so a <code>brew upgrade</code> does not break it. Now ask launchd what it actually did with that file:</p>
<pre><code>launchctl print gui/\$(id -u)/homebrew.mxcl.postgresql@14</code></pre>
<div class="out">gui/501/homebrew.mxcl.postgresql@14 = {
	active count = 1
	path = /Users/admin/Library/LaunchAgents/homebrew.mxcl.postgresql@14.plist
	type = LaunchAgent
	state = running
	program = /opt/homebrew/opt/postgresql@14/bin/postgres
	…
	default environment = {
		PATH =&gt; /usr/bin:/bin:/usr/sbin:/sbin
	}
	…
	runs = 1
	pid = 2720
	last exit code = (never exited)
	…
	properties = keepalive | runatload | inferred program | managed LWCR | has LWCR</div>
<div class="callout warn"><strong>launchd gives jobs <code>PATH=/usr/bin:/bin:/usr/sbin:/sbin</code> — no Homebrew.</strong> This is the cron lesson from Chapter 8 all over again, on a Mac. A plist whose <code>ProgramArguments</code> starts with <code>node</code> or whose script calls <code>jq</code> fails to find them, even though both work in your Terminal. Use absolute paths (<code>/opt/homebrew/bin/node</code>), or set <code>PATH</code> in <code>EnvironmentVariables</code>. And <code>~/.zshrc</code> is never read: launchd does not start a shell.</div>

<h3>Writing your own agent: lint first, then bootstrap</h3>
${slide('lx-15', 14, 'Tự viết plist: plutil -lint trước khi nạp; bootstrap/bootout thay load/unload')}
<p>A nightly backup at 03:00, as a user agent. This file was written in the lesson's scratch folder and checked with <code>plutil</code>; it was <strong>not</strong> loaded into launchd on the course Mac.</p>
<pre><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"&gt;
&lt;plist version="1.0"&gt;
&lt;dict&gt;
  &lt;key&gt;Label&lt;/key&gt;
  &lt;string&gt;vn.cuongthai.sao-luu&lt;/string&gt;
  &lt;key&gt;ProgramArguments&lt;/key&gt;
  &lt;array&gt;
    &lt;string&gt;/bin/bash&lt;/string&gt;
    &lt;string&gt;/Users/an/bin/sao-luu.sh&lt;/string&gt;
  &lt;/array&gt;
  &lt;key&gt;StartCalendarInterval&lt;/key&gt;
  &lt;dict&gt;
    &lt;key&gt;Hour&lt;/key&gt;   &lt;integer&gt;3&lt;/integer&gt;
    &lt;key&gt;Minute&lt;/key&gt; &lt;integer&gt;0&lt;/integer&gt;
  &lt;/dict&gt;
  &lt;key&gt;EnvironmentVariables&lt;/key&gt;
  &lt;dict&gt;
    &lt;key&gt;PATH&lt;/key&gt;
    &lt;string&gt;/opt/homebrew/bin:/usr/bin:/bin&lt;/string&gt;
  &lt;/dict&gt;
  &lt;key&gt;StandardErrorPath&lt;/key&gt;
  &lt;string&gt;/tmp/sao-luu.log&lt;/string&gt;
&lt;/dict&gt;
&lt;/plist&gt;</code></pre>
<pre><code>plutil -lint vn.cuongthai.sao-luu.plist
plutil -lint hong.plist                    <span class="tok-comment"># same file with &lt;/integr&gt; typo on line 14</span>
plutil -convert json -o - vn.cuongthai.sao-luu.plist</code></pre>
<div class="out">vn.cuongthai.sao-luu.plist: OK
hong.plist: (Close tag on line 14 does not match open tag integer)
{"ProgramArguments":["\\/bin\\/bash","\\/Users\\/an\\/bin\\/sao-luu.sh"],"StandardErrorPath":"\\/tmp\\/sao-luu.log","Label":"vn.cuongthai.sao-luu","StartCalendarInterval":{"Hour":3,"Minute":0},"EnvironmentVariables":{"PATH":"\\/opt\\/homebrew\\/bin:\\/usr\\/bin:\\/bin"}}</div>
<p>Then, on your own Mac, the load–test–inspect–unload cycle. <code>man launchctl</code> on macOS 27 lists <code>load</code>/<code>unload</code> under "LEGACY SUBCOMMANDS" with "Recommended alternative subcommands: bootstrap | bootout | enable | disable", so use the modern forms:</p>
<pre><code class="language-bash">cp vn.cuongthai.sao-luu.plist ~/Library/LaunchAgents/
launchctl bootstrap gui/\$(id -u) ~/Library/LaunchAgents/vn.cuongthai.sao-luu.plist   <span class="tok-comment"># load</span>
launchctl kickstart -k gui/\$(id -u)/vn.cuongthai.sao-luu                              <span class="tok-comment"># run it now to test</span>
launchctl print gui/\$(id -u)/vn.cuongthai.sao-luu | grep -E 'state|last exit'          <span class="tok-comment"># did it work?</span>
cat /tmp/sao-luu.log
launchctl bootout gui/\$(id -u)/vn.cuongthai.sao-luu                                   <span class="tok-comment"># unload</span></code></pre>
<div class="callout ok"><strong>Read <code>last exit code</code> the way you read a systemd status.</strong> <code>0</code> is success; a positive number is your script's exit code (Lesson 6.4); <code>127</code> almost always means the PATH problem above. The same <code>man launchctl</code> also warns that the output of <code>print</code> "is not guaranteed to remain stable across releases" and is meant for humans — read it, but do not parse it in scripts.</div>

<h3>Commands only a Mac has</h3>
${slide('lx-15', 15, 'Những lệnh chỉ Mac mới có — pbcopy, open, mdfind, caffeinate, defaults, security')}
<p>These have no standard Linux equivalent, and each one replaces a mouse habit. Output measured on the course Mac; the clipboard demo uses the little-used "ruler" pasteboard so as not to overwrite anyone's real clipboard, and the Keychain demo uses a throw-away keychain file that was deleted afterwards.</p>
<pre><code class="language-bash">echo "lenh da chep" | pbcopy -pboard ruler
pbpaste -pboard ruler
printf 'b\\na\\n' | pbcopy -pboard ruler; pbpaste -pboard ruler | sort</code></pre>
<div class="out">lenh da chep
a
b</div>
<table>
<tr><th>Command</th><th>What it does</th><th>Everyday use</th></tr>
<tr><td><code>pbcopy</code> · <code>pbpaste</code></td><td>stdin → clipboard · clipboard → stdout</td><td><code>pbcopy &lt; ~/.ssh/id_ed25519.pub</code> to paste a key into GitHub; <code>pbpaste | jq .</code> to format JSON you copied</td></tr>
<tr><td><code>open</code></td><td>Open a file, folder, URL or app as if double-clicked</td><td><code>open .</code> (Finder here) · <code>open -a "Visual Studio Code" .</code> · <code>open https://…</code> · <code>open -R file</code> (reveal)</td></tr>
<tr><td><code>mdfind</code></td><td>Query the Spotlight index</td><td>instant across the disk; <code>find</code> for exact paths and scripts</td></tr>
<tr><td><code>caffeinate</code></td><td>Stop the Mac sleeping while a command runs</td><td><code>caffeinate -i ./build.sh</code> — sleep prevention ends when the command does</td></tr>
<tr><td><code>defaults</code></td><td>Read/write app preferences (plist files)</td><td>set up a new Mac from a script</td></tr>
<tr><td><code>security</code></td><td>Keychain from the command line</td><td>keep API tokens out of <code>.env</code> files on your laptop</td></tr>
<tr><td><code>say</code> · <code>osascript</code></td><td>Speak text · run AppleScript</td><td><code>./long-job.sh; say xong</code></td></tr>
</table>
<pre><code>mdfind -onlyin /System/Applications -name Calculator
caffeinate -i -t 4 &amp; P=\$!
pmset -g assertions | grep -A1 "pid \$P("
defaults read -g AppleLocale
defaults write "\$PWD/thu-pref" soLanChay -int 3; defaults read "\$PWD/thu-pref" soLanChay</code></pre>
<div class="out">/System/Applications/Calculator.app
   pid 21780(caffeinate): [0x00072d2f00018b83] 00:00:01 PreventUserIdleSystemSleep named: "caffeinate command-line tool"
	Details: caffeinate asserting for 4 secs
en_VN
3</div>
<p>(<code>mdfind</code> also printed two lines of <code>[UserQueryParser]</code> logging to stderr, omitted here.) <code>defaults write</code> given a <em>path</em> writes that plist file, which is how the demo stayed inside the scratch folder; given a domain name such as <code>com.apple.dock</code> it changes a real app's settings.</p>
<p>The Keychain is the one worth adopting on a laptop. Chapter 8 listed the seven places a secret in a <code>.env</code> file leaks from; on a Mac you can keep a token in the Keychain and fetch it only when a script needs it:</p>
<pre><code class="language-bash">K="\$PWD/lx15-thu.keychain-db"                        <span class="tok-comment"># throw-away keychain for the demo</span>
security create-keychain -p 12345 "\$K"
security add-generic-password -a an -s lx15-demo-api -w 'xxxx-token-thu' "\$K"
security find-generic-password -s lx15-demo-api -w "\$K"
security find-generic-password -s khongco -w "\$K"; echo "rc=\$?"
security delete-keychain "\$K"</code></pre>
<div class="out">xxxx-token-thu
security: SecKeychainSearchCopyNext: The specified item could not be found in the keychain.
rc=44</div>
<p>On your own Mac you omit the keychain path and the item goes into your login keychain: <code>API_TOKEN=\$(security find-generic-password -s my-api -w)</code> inside a script, nothing on disk in plain text. <code>list-keychains -d user</code> was checked before and after the demo and showed only the login keychain both times.</p>

<h3>Translating Linux diagnostics to macOS</h3>
${slide('lx-15', 16, 'Dịch lệnh chẩn đoán Linux → macOS')}
<p>Lesson 12.5 had a short version of this table; here it is complete, every macOS command run on the course Mac:</p>
<pre><code>sysctl -n hw.ncpu hw.memsize
vm_stat | head -3
memory_pressure | tail -1
lsof -nP -iTCP -sTCP:LISTEN | head -3
/usr/bin/log show --last 1m --style compact --predicate 'process == "launchd"' | head -2</code></pre>
<div class="out">10
34359738368
Mach Virtual Memory Statistics: (page size of 16384 bytes)
Pages free:                                     3991.
Pages active:                                 455902.
System-wide memory free percentage: 45%
COMMAND     PID  USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
rapportd    938 admin   12u  IPv4 0x445e09cdba163526      0t0  TCP *:58441 (LISTEN)
rapportd    938 admin   13u  IPv6 0xb75e8239d915d340      0t0  TCP *:58441 (LISTEN)
Timestamp               Ty Process[PID:TID]
2026-09-28 23:21:11.180 Df launchd[1:f726d2] [gui/501/com.apple.xpc.launchd.unmanaged.osascript.21314 [21314]:] added unmanaged active</div>
<table>
<tr><th>Question</th><th>Linux</th><th>macOS</th></tr>
<tr><td>OS version</td><td><code>cat /etc/os-release</code></td><td><code>sw_vers</code></td></tr>
<tr><td>CPUs · RAM</td><td><code>nproc</code> · <code>free -h</code></td><td><code>sysctl -n hw.ncpu hw.memsize</code> (bytes) · <code>vm_stat</code> (pages of 16 KB)</td></tr>
<tr><td>Memory pressure</td><td><code>free</code>, column <code>available</code></td><td><code>memory_pressure</code></td></tr>
<tr><td>Disks</td><td><code>lsblk</code> · <code>df -h</code></td><td><code>diskutil list</code> · <code>df -h</code></td></tr>
<tr><td>Who listens on a port</td><td><code>ss -tlnp</code></td><td><code>lsof -nP -iTCP -sTCP:LISTEN</code></td></tr>
<tr><td>System log</td><td><code>journalctl</code></td><td><code>/usr/bin/log show</code> — in zsh, bare <code>log</code> is a different builtin</td></tr>
<tr><td>A service</td><td><code>systemctl status X</code></td><td><code>launchctl print gui/\$(id -u)/X</code></td></tr>
<tr><td>Network</td><td><code>ip a</code> · <code>ip route</code></td><td><code>ifconfig</code> · <code>netstat -rn</code></td></tr>
<tr><td>Process details</td><td><code>/proc/PID/…</code></td><td><code>ps -o …</code> · <code>lsof -p PID</code></td></tr>
<tr><td>Install software</td><td><code>apt install</code></td><td><code>brew install</code></td></tr>
</table>

<div class="pitfall co-tieu-de"><strong>A LaunchAgent that "does nothing" is usually a PATH or a quoting problem, not a launchd problem.</strong> Two mistakes cover most cases. First, <code>ProgramArguments</code> is not a shell command line: <code>&lt;string&gt;~/bin/backup.sh --full&lt;/string&gt;</code> is ONE argument with a literal tilde and a space in it, so launchd looks for a file with that whole name. Each argument is its own <code>&lt;string&gt;</code>, paths are absolute, and if you need shell features you run <code>/bin/bash</code> with the script as the next string. Second, the job's <code>PATH</code> is <code>/usr/bin:/bin:/usr/sbin:/sbin</code>, as the real <code>launchctl print</code> above shows. Before loading anything, run the exact command with a bare environment — <code>env -i PATH=/usr/bin:/bin:/usr/sbin:/sbin /bin/bash /Users/an/bin/sao-luu.sh</code> — which is the Mac version of Chapter 8's "simulate cron first".</div>

<h3>Try it step by step</h3>
<p>Everything below is read-only or stays inside <code>~/thu-linux/mac15</code>.</p>
<pre><code class="language-xml">brew --prefix; brew list --versions | head -3
type -a git; /usr/bin/git --version; git --version
launchctl list | head -4
launchctl print gui/\$(id -u) | head -6
ls ~/Library/LaunchAgents
cd ~/thu-linux/mac15
cat &gt; thu.plist &lt;&lt;'EOF'
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;plist version="1.0"&gt;&lt;dict&gt;&lt;key&gt;Label&lt;/key&gt;&lt;string&gt;thu&lt;/string&gt;&lt;/dict&gt;&lt;/plist&gt;
EOF
plutil -lint thu.plist; plutil -p thu.plist
date | pbcopy -pboard ruler; pbpaste -pboard ruler</code></pre>
<p>What to notice: whether Homebrew's tools shadow Apple's on <em>your</em> Mac and which is newer; the three columns of <code>launchctl list</code> and how many jobs a normal Mac runs; which third-party agents live in your <code>~/Library/LaunchAgents</code> (updaters, brew services) — each one is a file you can read with <code>plutil -p</code>.</p>

<h3>On Linux and WSL</h3>
<p>None of these tools exist on a Linux server, and you should not try to recreate them there. The mapping to take with you: <strong>Homebrew ↔ apt/dnf</strong> (on a server always use the distribution's package manager, it gets security updates; Homebrew on Linux is for a machine where you lack <code>sudo</code>); <strong>launchd ↔ systemd</strong> (Chapter 11), including the same "the job does not read your shell rc files" rule; <strong>pbcopy ↔ <code>xclip -selection clipboard</code> / <code>wl-copy</code></strong> on a Linux desktop, and <code>clip.exe</code> from inside WSL (a Windows program, which WSL can run — Lesson 15.3); <strong>open ↔ <code>xdg-open</code></strong> on a Linux desktop, <code>explorer.exe .</code> in WSL; <strong>Keychain ↔</strong> <code>secret-tool</code> (libsecret) on a Linux desktop, and on a server a secrets file with mode 600 or your platform's secret store (Chapter 8).</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the team wants a nightly job on your Mac that exports the local database used for SWP391 testing. Before anyone loads anything into launchd, you prepare it so it cannot fail silently.</p><ol>
<li>In <code>~/thu-linux/mac15</code>, write <code>xuat-db.sh</code> that runs <code>jq --version</code> and <code>date</code> and appends both to <code>~/thu-linux/mac15/xuat.log</code> (use <code>jq</code> if you have it, otherwise any Homebrew command you have).</li>
<li>Run it normally; then run it as launchd would: <code>env -i PATH=/usr/bin:/bin:/usr/sbin:/sbin /bin/bash xuat-db.sh</code>. Record what breaks and fix it inside the script (absolute path or your own <code>PATH=</code> line).</li>
<li>Write <code>vn.ban.xuat-db.plist</code> with <code>StartCalendarInterval</code> at 02:30, <code>ProgramArguments</code> = <code>/bin/bash</code> + the absolute script path, and <code>StandardErrorPath</code>. Check it with <code>plutil -lint</code> and <code>plutil -p</code>, then break one tag on purpose and read the error.</li>
<li>(Optional, your own Mac only) <code>launchctl bootstrap</code> it, <code>kickstart -k</code> it, read <code>last exit code</code> with <code>launchctl print</code>, then <code>bootout</code> it.</li></ol>
<p><strong>Done when:</strong> the <code>env -i</code> run appends to the log with exit code 0, <code>plutil -lint</code> prints <code>OK</code>, and you can point to the line in your plist that would have made launchd fail if the script had used a bare command name.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Formula / cask</span><span class="v">A Homebrew package for a command-line tool / for a GUI app.</span></div>
  <div class="kv"><span class="k">Bottle</span><span class="v">A pre-built Homebrew package, unpacked into the Cellar.</span></div>
  <div class="kv"><span class="k">Cellar / opt</span><span class="v">Where each version lives / a stable link to the current version.</span></div>
  <div class="kv"><span class="k">Brewfile</span><span class="v">A list of packages a team commits; <code>brew bundle install</code> installs them all.</span></div>
  <div class="kv"><span class="k">launchd</span><span class="v">macOS's process 1: starts services and runs scheduled jobs.</span></div>
  <div class="kv"><span class="k">plist</span><span class="v">Property list, the XML file describing a launchd job or app setting.</span></div>
  <div class="kv"><span class="k">LaunchAgent / LaunchDaemon</span><span class="v">A job for one logged-in user / for the whole system as root.</span></div>
  <div class="kv"><span class="k">Keychain</span><span class="v">macOS's encrypted store for passwords and tokens, scriptable with <code>security</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Homebrew installs into <code>/opt/homebrew</code> (Cellar → opt → bin) without <code>sudo</code>; <code>PATH</code> order decides whether you get its tools or Apple's.</li>
<li>GNU tools come with a <code>g</code> prefix; prefer the <code>g</code> names or detection in shared scripts over a gnubin <code>PATH</code> change.</li>
<li>A committed Brewfile plus <code>brew bundle install</code> gives a whole team the same tools in one command.</li>
<li>launchd replaces systemd and cron: a <code>.plist</code> with <code>Label</code>, <code>ProgramArguments</code>, <code>KeepAlive</code>/<code>RunAtLoad</code> or <code>StartCalendarInterval</code>.</li>
<li>launchd jobs get <code>PATH=/usr/bin:/bin:/usr/sbin:/sbin</code> and no shell — absolute paths, <code>plutil -lint</code>, then <code>bootstrap</code>/<code>kickstart</code>/<code>print</code>/<code>bootout</code>.</li>
<li><code>pbcopy</code>, <code>open</code>, <code>mdfind</code>, <code>caffeinate</code>, <code>defaults</code> and <code>security</code> are Mac-only and worth the habit.</li>
</ul>

<a class="link-card" href="https://docs.brew.sh/Installation" target="_blank" rel="noopener">
  <span class="lc-ico">🍺</span>
  <span class="lc-body"><span class="lc-title">Homebrew — Installation</span><span class="lc-sub">Why the prefix is <code>/opt/homebrew</code> on Apple silicon and <code>/usr/local</code> on Intel, and the supported way to install.</span></span>
</a>
<a class="link-card" href="https://docs.brew.sh/Brew-Bundle-and-Brewfile" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Homebrew — brew bundle and Brewfile</span><span class="lc-sub">Everything a Brewfile can list, and the <code>install</code>/<code>check</code>/<code>dump</code>/<code>cleanup</code> commands.</span></span>
</a>
<a class="link-card" href="https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">Apple — Creating Launch Daemons and Agents</span><span class="lc-sub">Apple's (archived but still accurate) guide to plist keys, agents versus daemons, and scheduled jobs.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice on Code Lab</span><span class="lc-sub">The Linux &amp; Bash track — the PATH and "run it the way the scheduler runs it" habits this lesson reuses.</span></span>
</a>

<p class="note-ct"><strong>The one habit from this lesson:</strong> before trusting any background job on a Mac, run its exact command under <code>env -i PATH=/usr/bin:/bin:/usr/sbin:/sbin</code>. It is the same test you learned for cron in Chapter 8 and for systemd in Chapter 11 — three schedulers, one rule: a job gets a bare environment, never your shell's.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.2</span>
<h2>Công cụ của macOS: Homebrew, launchd và những lệnh chỉ Mac có</h2>
<p class="lead">Bài 15.1 nói về những thứ Mac làm <em>KHÁC</em>. Bài này nói về những thứ Mac làm <em>THAY</em>: không có <code>apt</code>, nên có Homebrew; không có systemd và cron cũng chẳng đáng dùng, nên có launchd; và có một bộ lệnh nhỏ — <code>pbcopy</code>, <code>open</code>, <code>mdfind</code>, <code>caffeinate</code>, <code>defaults</code>, <code>security</code> — không có bản tương đương trên Linux và làm terminal Mac thật sự dễ chịu. Mọi lệnh ở đây chạy trên máy Mac của khoá với tuỳ chọn chỉ đọc; vài lệnh sẽ thay đổi máy (cài gói, nạp agent) thì được in ra, giải thích, và để bạn tự chạy trên Mac của mình.</p>

<h3>Homebrew: trình quản lý gói mà macOS không có sẵn</h3>
${slide('lx-15', 10, 'Homebrew: trình quản lý gói mà macOS không có sẵn')}
<p>Trên Ubuntu, <code>apt</code> cài vào <code>/usr</code> và hệ thống sở hữu nó (Chương 10). macOS không có trình quản lý gói chung, và <code>/usr/bin</code> được System Integrity Protection (SIP — cơ chế bảo vệ hệ thống) khoá — đến root cũng không ghi được. Homebrew lấp khoảng trống bằng cách cài mọi thứ dưới một thư mục gốc riêng, do chính user của bạn sở hữu, nên <code>brew install</code> không bao giờ cần <code>sudo</code>:</p>
<pre><code class="language-bash">brew --prefix
brew --version
brew --cellar
brew list --formula | wc -l
brew list --versions git node gh</code></pre>
<div class="out">/opt/homebrew
Homebrew 7.0.6
/opt/homebrew/Cellar
     123
gh 2.93.0
git 2.51.1
node 26.8.1</div>
<p>Ba thư mục giải thích mọi câu hỏi về Homebrew bạn sẽ gặp:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Cellar/</span><span class="lz-t">/opt/homebrew/Cellar/git/2.51.1</span><span class="lz-d">Mỗi phiên bản của mỗi gói một thư mục riêng. Một "bottle" (gói dựng sẵn) được giải nén vào đây.</span></div>
  <div class="lz-step"><span class="lz-k">opt/</span><span class="lz-t">/opt/homebrew/opt/git → ../Cellar/git/2.51.1</span><span class="lz-d">Một liên kết tượng trưng ỔN ĐỊNH trỏ tới phiên bản hiện hành. File cấu hình và plist trỏ vào đây nên nâng cấp không làm chúng hỏng.</span></div>
  <div class="lz-step"><span class="lz-k">bin/</span><span class="lz-t">/opt/homebrew/bin/git → ../Cellar/git/2.51.1/bin/git</span><span class="lz-d">Những lệnh bạn gõ. Thư mục này phải đứng sớm trong <code>PATH</code> (Bài 8.1 đã cho thấy <code>/etc/paths.d/homebrew</code> đặt nó vào đó).</span></div>
</div>
<pre><code class="language-bash">ls -l /opt/homebrew/opt/git /opt/homebrew/bin/git | awk '{print \$1, \$9, \$10, \$11}'
/usr/bin/git --version
git --version
command -v git</code></pre>
<div class="out">lrwxr-xr-x@ /opt/homebrew/bin/git -&gt; ../Cellar/git/2.51.1/bin/git
lrwxr-xr-x@ /opt/homebrew/opt/git -&gt; ../Cellar/git/2.51.1
git version 2.54.0 (Apple Git-157)
git version 2.51.1
/opt/homebrew/bin/git</div>
<p>Cặp cuối là một bất ngờ thật, đáng đọc hai lần: <code>/usr/bin/git</code> của Apple lại <em>MỚI HƠN</em> (2.54.0) bản Homebrew (2.51.1), vậy mà gõ <code>git</code> thì chạy bản cũ hơn, vì <code>/opt/homebrew/bin</code> đứng trước trong <code>PATH</code>. Không có gì hỏng — thứ tự PATH quyết định, đúng như Bài 8.1. Khi phiên bản trông sai, <code>command -v</code> và <code>type -a</code> vẫn là hai lệnh đầu tiên.</p>
<div class="callout">Thư mục gốc theo loại máy: <code>/opt/homebrew</code> trên Apple silicon (M1 trở đi), <code>/usr/local</code> trên Mac Intel. Script nên hỏi <code>brew --prefix</code> thay vì ghi cứng cái nào. Homebrew cũng chạy trên Linux (gốc <code>/home/linuxbrew/.linuxbrew</code>), đôi khi tiện trên một máy bạn không có <code>sudo</code>.</div>

<h3>Lệnh brew hằng ngày, với những cờ quan trọng</h3>
<table>
<tr><th>Lệnh</th><th>Làm gì</th><th>Ghi chú</th></tr>
<tr><td><code>brew search TÊN</code></td><td>Tìm formula và cask</td><td><code>brew search powershell</code> → <code>powershell</code>, <code>powershell@preview</code></td></tr>
<tr><td><code>brew info TÊN</code></td><td>Phiên bản, phụ thuộc, <strong>Caveats</strong> (lưu ý)</td><td>đọc phần caveats — nó bảo bạn thêm gì vào PATH</td></tr>
<tr><td><code>brew install TÊN</code> · <code>--cask TÊN</code></td><td>Cài công cụ dòng lệnh · cài ứng dụng có giao diện</td><td>không <code>sudo</code></td></tr>
<tr><td><code>brew upgrade</code> · <code>brew outdated</code></td><td>Nâng cấp tất cả · liệt kê gói đã cũ</td><td>ghim phiên bản bằng <code>brew pin TÊN</code></td></tr>
<tr><td><code>brew uninstall TÊN</code> · <code>brew autoremove</code></td><td>Gỡ · gỡ các phụ thuộc không ai cần nữa</td><td></td></tr>
<tr><td><code>brew list --versions</code> · <code>brew leaves</code></td><td>Đã cài kèm phiên bản · chỉ những gì BẠN yêu cầu (không tính phụ thuộc)</td><td>máy Mac của khoá có 30 "lá"</td></tr>
<tr><td><code>brew deps --installed TÊN</code> · <code>brew uses --installed TÊN</code></td><td>Nó cần gì · ai cần nó</td><td>trước khi gỡ một thư viện</td></tr>
<tr><td><code>brew services list</code></td><td>Dịch vụ nền brew quản lý qua launchd</td><td>mục sau</td></tr>
<tr><td><code>brew doctor</code> · <code>brew cleanup</code></td><td>Chẩn đoán bản cài · xoá phiên bản cũ khỏi Cellar</td><td>cleanup giải phóng dung lượng đĩa thật</td></tr>
</table>

<h3>Công cụ GNU trên Mac, và một Brewfile cho cả nhóm</h3>
${slide('lx-15', 11, 'GNU trên Mac: gọi tên có chữ g, hoặc đặt gnubin trước; Brewfile')}
<p>Bảng của Bài 15.1 có một lối thoát đơn giản: cài bản GNU. Chúng đến với chữ <code>g</code> ở đầu tên để không che công cụ của Apple — chính lời lưu ý của Homebrew, in ra bởi <code>brew info coreutils</code>, nói vậy:</p>
<div class="out">==&gt; Caveats
Commands also provided by macOS and the commands dir, dircolors, vdir have been installed with the prefix "g".
If you need to use these commands with their normal names, you can add a "gnubin" directory to your PATH with:
  PATH="/opt/homebrew/opt/coreutils/libexec/gnubin:\$PATH"</div>
<pre><code class="language-bash">brew install coreutils gnu-sed grep findutils   <span class="tok-comment"># gdate gstat gtimeout gsed ggrep gfind…</span>
gsed -i 's/yes/no/' m.conf                     <span class="tok-comment"># cú pháp GNU, trên Mac</span>
gdate -d tomorrow +%F
gtimeout 5 ./chay-lau.sh</code></pre>
<p>Sau đó bạn có hai lựa chọn, hợp với hai kiểu người. <strong>Dùng tên có chữ <code>g</code></strong> trong script của mình — rõ ràng, không làm ai bất ngờ. Hoặc <strong>đặt các thư mục <code>gnubin</code> lên đầu <code>PATH</code></strong> trong <code>~/.zshrc</code>, để <code>sed</code> trơn trở thành GNU sed trong shell của bạn. Cách thứ hai có vẻ tiện và có cái giá: mọi công cụ khởi chạy từ shell đó — kể cả script của Apple và trình cài đặt chờ hành vi BSD — giờ nhận công cụ GNU. Và một script "chạy được" chỉ vì PATH <em>của bạn</em> có gnubin đứng đầu sẽ hỏng với bạn cùng nhóm không có nó. Cho script dùng chung, ưu tiên mẹo dò của 15.1: <code>command -v gsed &gt;/dev/null &amp;&amp; SED=gsed || SED=sed</code>.</p>
<p><strong>Brewfile</strong> là cách một nhóm biến "cài công cụ" thành một lệnh. Nó là một file thường, commit vào repo:</p>
<pre><code class="language-ruby"># Brewfile — ở gốc repo
brew "bash"
brew "coreutils"
brew "gnu-sed"
brew "jq"
brew "shellcheck"
cask "visual-studio-code"</code></pre>
<pre><code class="language-bash">brew bundle install                  <span class="tok-comment"># cài mọi thứ được liệt kê (mặc định nâng cấp luôn)</span>
brew bundle check                    <span class="tok-comment"># đã cài đủ chưa?</span>
brew bundle dump --file=Brewfile     <span class="tok-comment"># ghi những gì máy NÀY đang có vào Brewfile</span>
brew bundle cleanup                  <span class="tok-comment"># help: gỡ mọi thứ KHÔNG có trong Brewfile — cẩn thận</span></code></pre>
<p>Bốn mô tả đó lấy từ <code>brew bundle --help</code> trên Mac của khoá (Homebrew 7.0.6), trang này còn liệt kê cả tiện ích VS Code, gói npm và Go trong số những thứ một Brewfile chứa được. Nó là "<code>package.json</code> của cả máy" — bạn mới vào nhóm clone repo, chạy <code>brew bundle install</code>, và có cùng phiên bản lớn với mọi người.</p>

<h3>launchd: một tiến trình thay cả systemd lẫn cron</h3>
${slide('lx-15', 12, 'launchd thay cả systemd lẫn cron trên Mac')}
<p>Trên Linux, systemd khởi động dịch vụ còn cron (hoặc timer của systemd) chạy việc hẹn giờ — Chương 11. Trên Mac cả hai việc thuộc về <strong>launchd</strong>, chính là tiến trình số 1. Một việc được mô tả bằng một <strong>property list</strong> (<code>.plist</code>, file XML — danh sách thuộc tính) thay vì file unit kiểu INI, nhưng các ý tưởng khớp gần như một-một:</p>
<table>
<tr><th>Việc</th><th>systemd / cron (Chương 11)</th><th>Khoá của launchd</th></tr>
<tr><td>Tên</td><td>tên file unit</td><td><code>Label</code> (tên miền đảo ngược, vd. <code>vn.cuongthai.sao-luu</code>)</td></tr>
<tr><td>Chạy gì</td><td><code>ExecStart=</code></td><td><code>ProgramArguments</code> — một mảng, <strong>KHÔNG qua shell</strong>: không <code>~</code>, không <code>\$BIEN</code>, không ống dẫn</td></tr>
<tr><td>Chết thì khởi động lại</td><td><code>Restart=always</code></td><td><code>KeepAlive</code> = true</td></tr>
<tr><td>Chạy khi được nạp / lúc đăng nhập</td><td><code>WantedBy=</code> + <code>enable</code></td><td><code>RunAtLoad</code> = true</td></tr>
<tr><td>Hẹn giờ</td><td><code>OnCalendar=</code> · một dòng crontab</td><td><code>StartCalendarInterval</code> (dict gồm Hour, Minute, Weekday…) · <code>StartInterval</code> (giây)</td></tr>
<tr><td>Biến môi trường</td><td><code>Environment=</code></td><td><code>EnvironmentVariables</code> (dict)</td></tr>
<tr><td>Log</td><td>journald</td><td><code>StandardOutPath</code> / <code>StandardErrorPath</code> — file thường</td></tr>
<tr><td>Việc của một người dùng</td><td><code>systemctl --user</code></td><td><code>~/Library/LaunchAgents/</code> — miền <code>gui/&lt;uid&gt;</code></td></tr>
<tr><td>Việc của hệ thống (root)</td><td><code>/etc/systemd/system/</code></td><td><code>/Library/LaunchDaemons/</code> — miền <code>system</code></td></tr>
</table>
<p><code>cron</code> vẫn còn trên macOS, nhưng Mac thì NGỦ. <code>man launchd.plist</code> trên macOS 27 nói thẳng ở mục <code>StartCalendarInterval</code>: "Unlike cron which skips job invocations when the computer is asleep, launchd will start the job the next time the computer wakes up" — khác cron vốn BỎ QUA lần chạy khi máy đang ngủ, launchd chạy việc đó khi máy thức dậy (nhiều lần lỡ gộp thành một). Trên laptop, đó là khác biệt giữa một lần sao lưu có xảy ra và một lần không.</p>

<h3>Một LaunchAgent thật, do brew services viết hộ</h3>
${slide('lx-15', 13, 'Một LaunchAgent thật: brew services viết plist hộ bạn — và PATH mặc định của launchd')}
<p>Máy Mac của khoá đã có sẵn một cái: PostgreSQL 14 mà Homebrew chạy nền. Đọc nó không đụng vào gì cả:</p>
<pre><code class="language-bash">brew services list
launchctl list | grep postgres
launchctl list | wc -l</code></pre>
<div class="out">Name          Status  User  File
postgresql@14 started admin ~/Library/LaunchAgents/homebrew.mxcl.postgresql@14.plist
postgresql@18 none
redis         none
2720	0	homebrew.mxcl.postgresql@14
     567</div>
<p><code>launchctl list</code> có ba cột: PID (hoặc <code>-</code> nếu không chạy), trạng thái thoát lần cuối (theo <code>man launchctl</code>: số âm là số hiệu tín hiệu đã dừng việc, mang dấu trừ, vd. <code>-9</code> = SIGKILL), và nhãn. Plist mà <code>brew services</code> viết ngắn và dễ đọc:</p>
<pre><code class="language-xml">&lt;key&gt;KeepAlive&lt;/key&gt;          &lt;true/&gt;
&lt;key&gt;Label&lt;/key&gt;              &lt;string&gt;homebrew.mxcl.postgresql@14&lt;/string&gt;
&lt;key&gt;ProgramArguments&lt;/key&gt;
&lt;array&gt;
  &lt;string&gt;/opt/homebrew/opt/postgresql@14/bin/postgres&lt;/string&gt;
  &lt;string&gt;-D&lt;/string&gt;
  &lt;string&gt;/opt/homebrew/var/postgresql@14&lt;/string&gt;
&lt;/array&gt;
&lt;key&gt;RunAtLoad&lt;/key&gt;          &lt;true/&gt;
&lt;key&gt;StandardErrorPath&lt;/key&gt;  &lt;string&gt;/opt/homebrew/var/log/postgresql@14.log&lt;/string&gt;</code></pre>
<p>(trích <code>~/Library/LaunchAgents/homebrew.mxcl.postgresql@14.plist</code>, căn lại khoá cho dễ đọc). Để ý nó dùng đường <code>opt/</code>, nên <code>brew upgrade</code> không làm nó hỏng. Giờ hỏi launchd xem nó thật sự đã làm gì với file đó:</p>
<pre><code>launchctl print gui/\$(id -u)/homebrew.mxcl.postgresql@14</code></pre>
<div class="out">gui/501/homebrew.mxcl.postgresql@14 = {
	active count = 1
	path = /Users/admin/Library/LaunchAgents/homebrew.mxcl.postgresql@14.plist
	type = LaunchAgent
	state = running
	program = /opt/homebrew/opt/postgresql@14/bin/postgres
	…
	default environment = {
		PATH =&gt; /usr/bin:/bin:/usr/sbin:/sbin
	}
	…
	runs = 1
	pid = 2720
	last exit code = (never exited)
	…
	properties = keepalive | runatload | inferred program | managed LWCR | has LWCR</div>
<div class="callout warn"><strong>launchd trao cho việc <code>PATH=/usr/bin:/bin:/usr/sbin:/sbin</code> — KHÔNG có Homebrew.</strong> Đây là bài học cron của Chương 8 lặp lại, trên Mac. Một plist có <code>ProgramArguments</code> bắt đầu bằng <code>node</code>, hay script bên trong gọi <code>jq</code>, sẽ không tìm thấy chúng, dù cả hai chạy ngon trong Terminal của bạn. Dùng đường tuyệt đối (<code>/opt/homebrew/bin/node</code>), hoặc đặt <code>PATH</code> trong <code>EnvironmentVariables</code>. Và <code>~/.zshrc</code> không bao giờ được đọc: launchd không khởi động shell nào cả.</div>

<h3>Tự viết agent: kiểm trước, rồi mới bootstrap</h3>
${slide('lx-15', 14, 'Tự viết plist: plutil -lint trước khi nạp; bootstrap/bootout thay load/unload')}
<p>Một lần sao lưu lúc 03:00 mỗi đêm, dưới dạng agent của người dùng. File này được viết trong thư mục thử của bài và kiểm bằng <code>plutil</code>; nó <strong>KHÔNG</strong> được nạp vào launchd trên máy Mac của khoá.</p>
<pre><code class="language-xml">&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"&gt;
&lt;plist version="1.0"&gt;
&lt;dict&gt;
  &lt;key&gt;Label&lt;/key&gt;
  &lt;string&gt;vn.cuongthai.sao-luu&lt;/string&gt;
  &lt;key&gt;ProgramArguments&lt;/key&gt;
  &lt;array&gt;
    &lt;string&gt;/bin/bash&lt;/string&gt;
    &lt;string&gt;/Users/an/bin/sao-luu.sh&lt;/string&gt;
  &lt;/array&gt;
  &lt;key&gt;StartCalendarInterval&lt;/key&gt;
  &lt;dict&gt;
    &lt;key&gt;Hour&lt;/key&gt;   &lt;integer&gt;3&lt;/integer&gt;
    &lt;key&gt;Minute&lt;/key&gt; &lt;integer&gt;0&lt;/integer&gt;
  &lt;/dict&gt;
  &lt;key&gt;EnvironmentVariables&lt;/key&gt;
  &lt;dict&gt;
    &lt;key&gt;PATH&lt;/key&gt;
    &lt;string&gt;/opt/homebrew/bin:/usr/bin:/bin&lt;/string&gt;
  &lt;/dict&gt;
  &lt;key&gt;StandardErrorPath&lt;/key&gt;
  &lt;string&gt;/tmp/sao-luu.log&lt;/string&gt;
&lt;/dict&gt;
&lt;/plist&gt;</code></pre>
<pre><code>plutil -lint vn.cuongthai.sao-luu.plist
plutil -lint hong.plist                    <span class="tok-comment"># cùng file, gõ sai &lt;/integr&gt; ở dòng 14</span>
plutil -convert json -o - vn.cuongthai.sao-luu.plist</code></pre>
<div class="out">vn.cuongthai.sao-luu.plist: OK
hong.plist: (Close tag on line 14 does not match open tag integer)
{"ProgramArguments":["\\/bin\\/bash","\\/Users\\/an\\/bin\\/sao-luu.sh"],"StandardErrorPath":"\\/tmp\\/sao-luu.log","Label":"vn.cuongthai.sao-luu","StartCalendarInterval":{"Hour":3,"Minute":0},"EnvironmentVariables":{"PATH":"\\/opt\\/homebrew\\/bin:\\/usr\\/bin:\\/bin"}}</div>
<p>Rồi, trên Mac của chính bạn, vòng nạp–thử–xem–gỡ. <code>man launchctl</code> trên macOS 27 xếp <code>load</code>/<code>unload</code> vào mục "LEGACY SUBCOMMANDS" kèm dòng "Recommended alternative subcommands: bootstrap | bootout | enable | disable", nên hãy dùng dạng mới:</p>
<pre><code class="language-bash">cp vn.cuongthai.sao-luu.plist ~/Library/LaunchAgents/
launchctl bootstrap gui/\$(id -u) ~/Library/LaunchAgents/vn.cuongthai.sao-luu.plist   <span class="tok-comment"># nạp</span>
launchctl kickstart -k gui/\$(id -u)/vn.cuongthai.sao-luu                              <span class="tok-comment"># chạy ngay để thử</span>
launchctl print gui/\$(id -u)/vn.cuongthai.sao-luu | grep -E 'state|last exit'          <span class="tok-comment"># chạy được không?</span>
cat /tmp/sao-luu.log
launchctl bootout gui/\$(id -u)/vn.cuongthai.sao-luu                                   <span class="tok-comment"># gỡ</span></code></pre>
<div class="callout ok"><strong>Đọc <code>last exit code</code> như đọc trạng thái systemd.</strong> <code>0</code> là thành công; số dương là mã thoát của script (Bài 6.4); <code>127</code> gần như luôn là vấn đề PATH ở trên. Cũng trang <code>man launchctl</code> đó cảnh báo output của <code>print</code> "is not guaranteed to remain stable across releases" và dành cho con người — hãy đọc nó, nhưng đừng phân tích nó trong script.</div>

<h3>Những lệnh chỉ Mac có</h3>
${slide('lx-15', 15, 'Những lệnh chỉ Mac mới có — pbcopy, open, mdfind, caffeinate, defaults, security')}
<p>Những lệnh này không có bản tương đương chuẩn trên Linux, và mỗi cái thay một thói quen dùng chuột. Output đo trên Mac của khoá; bản thử khay nhớ tạm dùng khay "ruler" ít ai dùng để không ghi đè khay nhớ thật của ai, và bản thử Keychain dùng một file keychain vứt đi đã xoá sau đó.</p>
<pre><code class="language-bash">echo "lenh da chep" | pbcopy -pboard ruler
pbpaste -pboard ruler
printf 'b\\na\\n' | pbcopy -pboard ruler; pbpaste -pboard ruler | sort</code></pre>
<div class="out">lenh da chep
a
b</div>
<table>
<tr><th>Lệnh</th><th>Làm gì</th><th>Dùng hằng ngày</th></tr>
<tr><td><code>pbcopy</code> · <code>pbpaste</code></td><td>stdin → khay nhớ tạm · khay nhớ tạm → stdout</td><td><code>pbcopy &lt; ~/.ssh/id_ed25519.pub</code> để dán khoá vào GitHub; <code>pbpaste | jq .</code> để định dạng JSON vừa chép</td></tr>
<tr><td><code>open</code></td><td>Mở file, thư mục, URL hay ứng dụng như bấm đúp</td><td><code>open .</code> (Finder ở đây) · <code>open -a "Visual Studio Code" .</code> · <code>open https://…</code> · <code>open -R file</code> (chỉ chỗ file)</td></tr>
<tr><td><code>mdfind</code></td><td>Hỏi chỉ mục Spotlight</td><td>tức thì trên cả ổ; <code>find</code> cho đường dẫn chính xác và cho script</td></tr>
<tr><td><code>caffeinate</code></td><td>Không cho Mac ngủ khi một lệnh đang chạy</td><td><code>caffeinate -i ./build.sh</code> — hết lệnh là hết giữ</td></tr>
<tr><td><code>defaults</code></td><td>Đọc/ghi thiết lập ứng dụng (file plist)</td><td>dựng máy Mac mới bằng script</td></tr>
<tr><td><code>security</code></td><td>Keychain từ dòng lệnh</td><td>giữ token API ngoài file <code>.env</code> trên laptop</td></tr>
<tr><td><code>say</code> · <code>osascript</code></td><td>Đọc chữ thành tiếng · chạy AppleScript</td><td><code>./viec-lau.sh; say xong</code></td></tr>
</table>
<pre><code>mdfind -onlyin /System/Applications -name Calculator
caffeinate -i -t 4 &amp; P=\$!
pmset -g assertions | grep -A1 "pid \$P("
defaults read -g AppleLocale
defaults write "\$PWD/thu-pref" soLanChay -int 3; defaults read "\$PWD/thu-pref" soLanChay</code></pre>
<div class="out">/System/Applications/Calculator.app
   pid 21780(caffeinate): [0x00072d2f00018b83] 00:00:01 PreventUserIdleSystemSleep named: "caffeinate command-line tool"
	Details: caffeinate asserting for 4 secs
en_VN
3</div>
<p>(<code>mdfind</code> còn in hai dòng log <code>[UserQueryParser]</code> ra stderr, lược ở đây.) <code>defaults write</code> khi nhận một <em>đường dẫn</em> sẽ ghi vào đúng file plist đó, nhờ vậy bản thử nằm gọn trong thư mục thử; khi nhận một tên miền như <code>com.apple.dock</code> nó đổi thiết lập của một ứng dụng thật.</p>
<p>Keychain là cái đáng áp dụng trên laptop. Chương 8 đã kể bảy chỗ một bí mật trong file <code>.env</code> rò ra; trên Mac bạn có thể giữ token trong Keychain và chỉ lấy ra khi script cần:</p>
<pre><code class="language-bash">K="\$PWD/lx15-thu.keychain-db"                        <span class="tok-comment"># keychain vứt đi cho bản thử</span>
security create-keychain -p 12345 "\$K"
security add-generic-password -a an -s lx15-demo-api -w 'xxxx-token-thu' "\$K"
security find-generic-password -s lx15-demo-api -w "\$K"
security find-generic-password -s khongco -w "\$K"; echo "rc=\$?"
security delete-keychain "\$K"</code></pre>
<div class="out">xxxx-token-thu
security: SecKeychainSearchCopyNext: The specified item could not be found in the keychain.
rc=44</div>
<p>Trên Mac của bạn thì bỏ đường dẫn keychain đi và mục đó vào keychain đăng nhập: <code>API_TOKEN=\$(security find-generic-password -s my-api -w)</code> trong script, không có gì nằm trên đĩa dạng chữ thường. <code>list-keychains -d user</code> được kiểm trước và sau bản thử, cả hai lần chỉ có keychain đăng nhập.</p>

<h3>Dịch lệnh chẩn đoán Linux sang macOS</h3>
${slide('lx-15', 16, 'Dịch lệnh chẩn đoán Linux → macOS')}
<p>Bài 12.5 có bản ngắn của bảng này; đây là bản đầy đủ, mọi lệnh macOS chạy trên Mac của khoá:</p>
<pre><code>sysctl -n hw.ncpu hw.memsize
vm_stat | head -3
memory_pressure | tail -1
lsof -nP -iTCP -sTCP:LISTEN | head -3
/usr/bin/log show --last 1m --style compact --predicate 'process == "launchd"' | head -2</code></pre>
<div class="out">10
34359738368
Mach Virtual Memory Statistics: (page size of 16384 bytes)
Pages free:                                     3991.
Pages active:                                 455902.
System-wide memory free percentage: 45%
COMMAND     PID  USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
rapportd    938 admin   12u  IPv4 0x445e09cdba163526      0t0  TCP *:58441 (LISTEN)
rapportd    938 admin   13u  IPv6 0xb75e8239d915d340      0t0  TCP *:58441 (LISTEN)
Timestamp               Ty Process[PID:TID]
2026-09-28 23:21:11.180 Df launchd[1:f726d2] [gui/501/com.apple.xpc.launchd.unmanaged.osascript.21314 [21314]:] added unmanaged active</div>
<table>
<tr><th>Câu hỏi</th><th>Linux</th><th>macOS</th></tr>
<tr><td>Phiên bản hệ điều hành</td><td><code>cat /etc/os-release</code></td><td><code>sw_vers</code></td></tr>
<tr><td>Số nhân · RAM</td><td><code>nproc</code> · <code>free -h</code></td><td><code>sysctl -n hw.ncpu hw.memsize</code> (byte) · <code>vm_stat</code> (trang 16 KB)</td></tr>
<tr><td>Áp lực bộ nhớ</td><td><code>free</code>, cột <code>available</code></td><td><code>memory_pressure</code></td></tr>
<tr><td>Đĩa</td><td><code>lsblk</code> · <code>df -h</code></td><td><code>diskutil list</code> · <code>df -h</code></td></tr>
<tr><td>Ai nghe một cổng</td><td><code>ss -tlnp</code></td><td><code>lsof -nP -iTCP -sTCP:LISTEN</code></td></tr>
<tr><td>Log hệ thống</td><td><code>journalctl</code></td><td><code>/usr/bin/log show</code> — trong zsh, <code>log</code> trơn là một lệnh dựng sẵn KHÁC</td></tr>
<tr><td>Một dịch vụ</td><td><code>systemctl status X</code></td><td><code>launchctl print gui/\$(id -u)/X</code></td></tr>
<tr><td>Mạng</td><td><code>ip a</code> · <code>ip route</code></td><td><code>ifconfig</code> · <code>netstat -rn</code></td></tr>
<tr><td>Chi tiết tiến trình</td><td><code>/proc/PID/…</code></td><td><code>ps -o …</code> · <code>lsof -p PID</code></td></tr>
<tr><td>Cài phần mềm</td><td><code>apt install</code></td><td><code>brew install</code></td></tr>
</table>

<div class="pitfall co-tieu-de"><strong>Một LaunchAgent "không làm gì cả" thường là lỗi PATH hoặc lỗi dấu cách, không phải lỗi launchd.</strong> Hai sai lầm chiếm phần lớn trường hợp. Một, <code>ProgramArguments</code> KHÔNG phải một dòng lệnh shell: <code>&lt;string&gt;~/bin/backup.sh --full&lt;/string&gt;</code> là MỘT đối số chứa dấu ngã nguyên văn và một dấu cách, nên launchd đi tìm một file có đúng cái tên dài đó. Mỗi đối số là một <code>&lt;string&gt;</code> riêng, đường dẫn tuyệt đối, và nếu cần tính năng của shell thì chạy <code>/bin/bash</code> với script ở chuỗi kế tiếp. Hai, <code>PATH</code> của việc là <code>/usr/bin:/bin:/usr/sbin:/sbin</code>, như <code>launchctl print</code> thật ở trên cho thấy. Trước khi nạp gì, hãy chạy đúng lệnh đó với môi trường trống trơn — <code>env -i PATH=/usr/bin:/bin:/usr/sbin:/sbin /bin/bash /Users/an/bin/sao-luu.sh</code> — tức là bản Mac của "mô phỏng cron trước" ở Chương 8.</div>

<h3>Chạy thử từng bước</h3>
<p>Mọi thứ dưới đây chỉ đọc hoặc nằm trong <code>~/thu-linux/mac15</code>.</p>
<pre><code class="language-xml">brew --prefix; brew list --versions | head -3
type -a git; /usr/bin/git --version; git --version
launchctl list | head -4
launchctl print gui/\$(id -u) | head -6
ls ~/Library/LaunchAgents
cd ~/thu-linux/mac15
cat &gt; thu.plist &lt;&lt;'EOF'
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
&lt;plist version="1.0"&gt;&lt;dict&gt;&lt;key&gt;Label&lt;/key&gt;&lt;string&gt;thu&lt;/string&gt;&lt;/dict&gt;&lt;/plist&gt;
EOF
plutil -lint thu.plist; plutil -p thu.plist
date | pbcopy -pboard ruler; pbpaste -pboard ruler</code></pre>
<p>Cần để ý: trên Mac CỦA BẠN công cụ Homebrew có che công cụ của Apple không, và bản nào mới hơn; ba cột của <code>launchctl list</code> và một máy Mac bình thường chạy bao nhiêu việc; những agent bên thứ ba nào sống trong <code>~/Library/LaunchAgents</code> của bạn (trình cập nhật, brew services) — mỗi cái là một file bạn đọc được bằng <code>plutil -p</code>.</p>

<h3>Trên Linux và WSL thì sao</h3>
<p>Không công cụ nào ở đây tồn tại trên máy chủ Linux, và bạn cũng đừng cố dựng lại chúng ở đó. Bản đồ mang theo: <strong>Homebrew ↔ apt/dnf</strong> (trên máy chủ luôn dùng trình quản lý gói của bản phân phối, nó nhận bản vá bảo mật; Homebrew trên Linux dành cho máy bạn không có <code>sudo</code>); <strong>launchd ↔ systemd</strong> (Chương 11), kèm đúng luật "việc chạy nền không đọc file rc của shell"; <strong>pbcopy ↔ <code>xclip -selection clipboard</code> / <code>wl-copy</code></strong> trên máy Linux có giao diện, và <code>clip.exe</code> từ bên trong WSL (một chương trình Windows mà WSL chạy được — Bài 15.3); <strong>open ↔ <code>xdg-open</code></strong> trên máy Linux có giao diện, <code>explorer.exe .</code> trong WSL; <strong>Keychain ↔</strong> <code>secret-tool</code> (libsecret) trên máy Linux có giao diện, còn trên máy chủ là một file bí mật quyền 600 hoặc kho bí mật của nền tảng (Chương 8).</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm muốn một việc chạy mỗi đêm trên Mac của bạn để xuất cơ sở dữ liệu cục bộ dùng thử cho SWP391. Trước khi ai nạp gì vào launchd, bạn chuẩn bị để nó không thể hỏng trong im lặng.</p><ol>
<li>Trong <code>~/thu-linux/mac15</code>, viết <code>xuat-db.sh</code> chạy <code>jq --version</code> và <code>date</code> rồi nối cả hai vào <code>~/thu-linux/mac15/xuat.log</code> (dùng <code>jq</code> nếu có, không thì bất kỳ lệnh Homebrew nào bạn đang có).</li>
<li>Chạy bình thường; rồi chạy như launchd sẽ chạy: <code>env -i PATH=/usr/bin:/bin:/usr/sbin:/sbin /bin/bash xuat-db.sh</code>. Ghi lại thứ gì hỏng và sửa ngay trong script (đường tuyệt đối hoặc một dòng <code>PATH=</code> của riêng nó).</li>
<li>Viết <code>vn.ban.xuat-db.plist</code> có <code>StartCalendarInterval</code> lúc 02:30, <code>ProgramArguments</code> = <code>/bin/bash</code> + đường tuyệt đối của script, và <code>StandardErrorPath</code>. Kiểm bằng <code>plutil -lint</code> và <code>plutil -p</code>, rồi cố tình làm hỏng một thẻ và đọc lỗi.</li>
<li>(Tuỳ chọn, chỉ trên Mac của bạn) <code>launchctl bootstrap</code> nó, <code>kickstart -k</code> nó, đọc <code>last exit code</code> bằng <code>launchctl print</code>, rồi <code>bootout</code>.</li></ol>
<p><strong>Đạt khi:</strong> lần chạy <code>env -i</code> nối được vào log với mã thoát 0, <code>plutil -lint</code> in <code>OK</code>, và bạn chỉ ra được dòng nào trong plist lẽ ra đã làm launchd hỏng nếu script dùng tên lệnh trơn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Formula / cask (công thức / thùng)</span><span class="v">Gói Homebrew cho công cụ dòng lệnh / cho ứng dụng có giao diện.</span></div>
  <div class="kv"><span class="k">Bottle (chai)</span><span class="v">Gói Homebrew dựng sẵn, được giải nén vào Cellar.</span></div>
  <div class="kv"><span class="k">Cellar / opt (hầm / lối tắt)</span><span class="v">Nơi mỗi phiên bản nằm / một liên kết ổn định tới phiên bản hiện hành.</span></div>
  <div class="kv"><span class="k">Brewfile</span><span class="v">Danh sách gói nhóm commit vào repo; <code>brew bundle install</code> cài tất cả.</span></div>
  <div class="kv"><span class="k">launchd</span><span class="v">Tiến trình số 1 của macOS: khởi động dịch vụ và chạy việc hẹn giờ.</span></div>
  <div class="kv"><span class="k">plist (danh sách thuộc tính)</span><span class="v">File XML mô tả một việc của launchd hoặc một thiết lập ứng dụng.</span></div>
  <div class="kv"><span class="k">LaunchAgent / LaunchDaemon</span><span class="v">Việc của một người dùng đang đăng nhập / việc của cả hệ thống chạy bằng root.</span></div>
  <div class="kv"><span class="k">Keychain (chùm chìa khoá)</span><span class="v">Kho mã hoá của macOS cho mật khẩu và token, điều khiển bằng lệnh <code>security</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Homebrew cài vào <code>/opt/homebrew</code> (Cellar → opt → bin) không cần <code>sudo</code>; thứ tự <code>PATH</code> quyết định bạn nhận công cụ của nó hay của Apple.</li>
<li>Công cụ GNU đến với chữ <code>g</code> ở đầu; trong script dùng chung, ưu tiên tên có <code>g</code> hoặc dò khả năng, đừng dựa vào gnubin trong <code>PATH</code>.</li>
<li>Một Brewfile commit vào repo cộng <code>brew bundle install</code> cho cả nhóm cùng bộ công cụ trong một lệnh.</li>
<li>launchd thay systemd và cron: một <code>.plist</code> có <code>Label</code>, <code>ProgramArguments</code>, <code>KeepAlive</code>/<code>RunAtLoad</code> hoặc <code>StartCalendarInterval</code>.</li>
<li>Việc của launchd nhận <code>PATH=/usr/bin:/bin:/usr/sbin:/sbin</code> và không có shell — đường tuyệt đối, <code>plutil -lint</code>, rồi <code>bootstrap</code>/<code>kickstart</code>/<code>print</code>/<code>bootout</code>.</li>
<li><code>pbcopy</code>, <code>open</code>, <code>mdfind</code>, <code>caffeinate</code>, <code>defaults</code> và <code>security</code> chỉ Mac có và đáng tập thành thói quen.</li>
</ul>

<a class="link-card" href="https://docs.brew.sh/Installation" target="_blank" rel="noopener">
  <span class="lc-ico">🍺</span>
  <span class="lc-body"><span class="lc-title">Homebrew — Cài đặt</span><span class="lc-sub">Vì sao gốc là <code>/opt/homebrew</code> trên Apple silicon và <code>/usr/local</code> trên Intel, và cách cài được hỗ trợ.</span></span>
</a>
<a class="link-card" href="https://docs.brew.sh/Brew-Bundle-and-Brewfile" target="_blank" rel="noopener">
  <span class="lc-ico">📦</span>
  <span class="lc-body"><span class="lc-title">Homebrew — brew bundle và Brewfile</span><span class="lc-sub">Mọi thứ một Brewfile liệt kê được, và các lệnh <code>install</code>/<code>check</code>/<code>dump</code>/<code>cleanup</code>.</span></span>
</a>
<a class="link-card" href="https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html" target="_blank" rel="noopener">
  <span class="lc-ico">🚀</span>
  <span class="lc-body"><span class="lc-title">Apple — Creating Launch Daemons and Agents</span><span class="lc-sub">Hướng dẫn (đã lưu trữ nhưng vẫn đúng) của Apple về khoá plist, agent so với daemon, và việc hẹn giờ.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trên Code Lab</span><span class="lc-sub">Track Linux &amp; Bash — thói quen PATH và "chạy nó theo cách trình hẹn giờ chạy" mà bài này dùng lại.</span></span>
</a>

<p class="note-ct"><strong>Một thói quen của bài này:</strong> trước khi tin bất kỳ việc chạy nền nào trên Mac, hãy chạy đúng lệnh của nó dưới <code>env -i PATH=/usr/bin:/bin:/usr/sbin:/sbin</code>. Đó là cùng phép thử bạn đã học cho cron ở Chương 8 và cho systemd ở Chương 11 — ba trình hẹn giờ, một luật: việc chạy nền nhận một môi trường trống trơn, không bao giờ là môi trường shell của bạn.</p>
</div>
`,
    },
    /* ─────────────────────────── 15.3 ─────────────────────────── */
    {
      title: '15.3 — Windows: WSL2, Git Bash, and the CRLF bug from start to finish|||15.3 — Windows: WSL2, Git Bash, và lỗi CRLF từ đầu tới cuối',
      slug: 'lnx-15-3-windows-wsl2',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Ba cách có bash trên Windows và vì sao WSL2 là cách duy nhất cho ra Linux thật; WSL2 là máy ảo nhẹ, để mã trong ~ chứ không ở /mnt/c, wsl.conf và .wslconfig, mạng NAT và mirrored; rồi lỗi CRLF dựng lại thật: triệu chứng, cách đọc, dos2unix, core.autocrlf và .gitattributes.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.3</span>
<h2>Windows: WSL2, Git Bash, and the CRLF bug from start to finish</h2>
<p class="lead">Half of a typical student project team works on Windows. For them, "learn Linux" starts with a choice they may not know they are making — WSL2, Git Bash, or something else — and the most common bug in a mixed team is invisible in every editor: a carriage return at the end of each line. This lesson explains the choice, how WSL2 is built and configured, and then takes the CRLF bug apart completely, reproduced for real in an Ubuntu container. <strong>A note on sources:</strong> the course has no Windows machine. Every <code>wsl</code> command and setting below is taken from Microsoft's documentation on learn.microsoft.com (read September 2026) and marked as such; no Windows output is shown, because none could be recorded honestly.</p>

<h3>Three ways to get bash on Windows — only one is Linux</h3>
${slide('lx-15', 17, 'Ba cách có bash trên Windows — chỉ một cách là Linux')}
<table>
<tr><th></th><th>WSL2 + Ubuntu</th><th>Git Bash</th><th>MSYS2 / Cygwin</th></tr>
<tr><td>What it is</td><td>A real Linux kernel in a lightweight virtual machine, with a real distribution on top</td><td>"a BASH emulation used to run Git from the command line" (gitforwindows.org), with a small set of Unix tools</td><td>"a collection of tools and libraries providing you with an easy-to-use environment for building, installing and running native Windows software" (msys2.org), with <code>pacman</code></td></tr>
<tr><td><code>apt</code>, <code>systemd</code>, Docker, <code>/proc</code></td><td>yes — as on the VPS</td><td>no</td><td>no (its own packages, not Linux ones)</td></tr>
<tr><td>Path of <code>C:\\Users\\an</code></td><td><code>/mnt/c/Users/an</code></td><td><code>/c/Users/an</code></td><td><code>/c/Users/an</code> (MSYS2)</td></tr>
<tr><td>Good for</td><td>this course, your project, anything that deploys to Linux</td><td>git, and quick <code>ls</code>/<code>grep</code> on Windows files</td><td>building Windows software with Unix tools</td></tr>
</table>
<p>The deciding question is simple: <em>will this script run on a Linux server?</em> If yes, test it where Linux is — WSL2 (or a container). Git Bash runs bash, but the programs around it are Windows programs pretending, so a script that "works in Git Bash" has not been tested on Linux. And <code>uname -s</code> tells a script which one it is in: <code>Linux</code> in WSL, a string starting with <code>MINGW64_NT</code> in Git Bash — which is why the portable script in Lesson 15.1 has a <code>MINGW*|MSYS*|CYGWIN*)</code> branch.</p>

<h3>WSL2 is a real Linux virtual machine — just a very light one</h3>
${slide('lx-15', 18, 'WSL2 là một máy ảo Linux thật — chỉ là rất nhẹ')}
<p>Microsoft's comparison page states the architecture directly: WSL 2 "uses the latest and greatest in virtualization technology to run a Linux kernel inside of a lightweight utility virtual machine (VM). WSL2 runs Linux distributions as isolated containers inside the managed VM." The kernel "is built by Microsoft from the latest stable branch, based on the source available at kernel.org" and is updated through Windows Update. That is why WSL2 has full system-call compatibility — Docker, systemd and everything in Chapters 1–14 behave as on a server — while WSL1, the older translation layer, did not.</p>
<p>Section 0.3 gave the install commands; here is the reference you will actually come back to (PowerShell or CMD; from <em>inside</em> Linux you must type <code>wsl.exe</code>, per Microsoft's "Basic commands for WSL"):</p>
<table>
<tr><th>Command</th><th>What it does (Microsoft's description)</th><th>When</th></tr>
<tr><td><code>wsl --install</code></td><td>Install WSL and the default Ubuntu distribution</td><td>once, PowerShell as Administrator, then restart. Requires Windows 10 version 2004 (build 19041) or later, or Windows 11</td></tr>
<tr><td><code>wsl --list --online</code> · <code>wsl --install -d Debian</code></td><td>Distributions available · install another</td><td>a second distro</td></tr>
<tr><td><code>wsl -l -v</code></td><td>Installed distributions, their state, and WSL version 1 or 2</td><td>check VERSION is 2</td></tr>
<tr><td><code>wsl --set-version Ubuntu 2</code></td><td>Convert a distribution between WSL 1 and 2</td><td>an old install</td></tr>
<tr><td><code>wsl -d Ubuntu -u root</code></td><td>Run a specific distribution as a specific user</td><td>forgot your Linux password</td></tr>
<tr><td><code>wsl --shutdown</code> · <code>wsl --terminate Ubuntu</code></td><td>Stop every distribution and the VM · stop one</td><td>after editing <code>.wslconfig</code></td></tr>
<tr><td><code>wsl --export Ubuntu ubuntu.tar</code> · <code>wsl --import …</code></td><td>Snapshot a distribution to a tar file · restore it</td><td>backup before an experiment</td></tr>
<tr><td><code>wsl --unregister Ubuntu</code></td><td>Remove the distribution — Microsoft warns "all data, settings, and software … will be permanently lost"</td><td>almost never</td></tr>
<tr><td><code>wsl --update</code> · <code>wsl --version</code> · <code>wsl --status</code></td><td>Update WSL · component versions · default distro and kernel</td><td>before asking for help</td></tr>
</table>
<div class="callout ok"><strong><code>wsl --export</code> is your undo button.</strong> Before you try something risky from Chapter 14 (or before a Windows reinstall), <code>wsl --export Ubuntu D:\\backup\\ubuntu.tar</code> captures the whole distribution — installed packages, your <code>~</code>, everything — and <code>wsl --import</code> brings it back as a new distribution. It is the WSL equivalent of throwing a container away and starting a new one.</div>

<h3>Keep your code in Linux's ~, not on /mnt/c</h3>
${slide('lx-15', 19, 'Để mã nguồn trong ~ của Linux, đừng để ở /mnt/c')}
<p>A WSL2 distribution has its own ext4 disk. Your Windows drives are visible inside it under <code>/mnt/c</code>, <code>/mnt/d</code>…, and the Linux files are visible from Windows at <code>\\\\wsl$</code> in File Explorer. Both directions work — but crossing the boundary is slow, and Microsoft says so plainly in "Working across file systems": "For the fastest performance speed, store your files in the WSL file system if you are working in a Linux command line … If you're working in a Windows command line (PowerShell, Command Prompt), store your files in the Windows file system." Its example: use <code>/home/&lt;user name&gt;/Project</code>, not <code>/mnt/c/Users/&lt;user name&gt;/Project</code>. The feature table on "Comparing WSL Versions" marks "Performance across OS file systems" as a WSL1 strength and a WSL2 weakness — and <code>npm install</code>, <code>git status</code> on a large repo or a build touch thousands of small files, which is exactly the slow case.</p>
<pre><code class="language-bash">cd ~ &amp;&amp; mkdir -p du-an &amp;&amp; cd du-an          <span class="tok-comment"># Linux side</span>
git clone https://github.com/&lt;nhom&gt;/swp391.git
code .                                         <span class="tok-comment"># VS Code on Windows, connected to WSL (Remote - WSL extension)</span>
explorer.exe .                                 <span class="tok-comment"># open THIS Linux folder in File Explorer</span></code></pre>
<p>WSL also lets the two worlds call each other. From Microsoft's page: Windows programs run from Linux if you include the <code>.exe</code> (<code>notepad.exe</code>, <code>ipconfig.exe | grep IPv4</code>, <code>ls -la | findstr.exe foo</code>), and Linux programs run from PowerShell with <code>wsl</code> in front (<code>wsl ls -la</code>, <code>dir | wsl grep git</code>). Two helpers for paths:</p>
<table>
<tr><th>Need</th><th>Command</th><th>Result (form)</th></tr>
<tr><td>Linux path → Windows path</td><td><code>wslpath -w ~/du-an</code></td><td>a <code>\\\\wsl.localhost\\&lt;distro&gt;\\home\\…</code> path Windows programs can open</td></tr>
<tr><td>Windows path → Linux path</td><td><code>wslpath 'C:\\Users\\an'</code></td><td><code>/mnt/c/Users/an</code></td></tr>
<tr><td>Share one variable both ways</td><td><code>WSLENV</code> with flags <code>/p</code> (translate path), <code>/l</code> (list), <code>/u</code>, <code>/w</code></td><td>documented in the same Microsoft page</td></tr>
</table>
<p><code>wslpath</code> ships inside WSL; the exact output depends on your distribution name, so it is shown here as a form, not as recorded output.</p>
<div class="callout warn"><strong>Two more reasons to stay off <code>/mnt/c</code> for code.</strong> Windows is case-insensitive and Linux is case-sensitive (Microsoft's own warning), so <code>Logo.png</code> and <code>logo.png</code> can collide on <code>/mnt/c</code> and a Linux-built project can behave differently there. And Linux permissions on Windows drives are only emulated: by default the <code>[automount]</code> <code>metadata</code> option is off, so <code>chmod +x deploy.sh</code> on <code>/mnt/c</code> does not stick — a script "loses" its executable bit for no visible reason.</div>

<h3>wsl.conf for one distribution, .wslconfig for the whole VM</h3>
${slide('lx-15', 20, 'wsl.conf cho MỘT distro, .wslconfig cho CẢ máy ảo — và luật 8 giây')}
<p>Microsoft's "Advanced settings configuration in WSL" separates the two files cleanly: <code>/etc/wsl.conf</code> lives inside a distribution and configures that distribution (boot, automount, network, interop, default user); <code>%UserProfile%\\.wslconfig</code> lives on the Windows side and configures the virtual machine that all WSL2 distributions share (memory, processors, networking mode).</p>
<pre><code class="language-ini"># /etc/wsl.conf — inside the distribution (sudo nano /etc/wsl.conf)
[boot]
systemd=true                 # systemd as PID 1 (WSL 2 only)

[interop]
appendWindowsPath=false      # stop adding /mnt/c/... to Linux PATH

[automount]
options="metadata,umask=022" # make chmod meaningful on /mnt/c

[user]
default=an</code></pre>
<pre><code class="language-ini"># %UserProfile%\\.wslconfig — on the Windows side
[wsl2]
memory=4GB                   # default: 50% of Windows memory
processors=2                 # default: all logical processors
networkingMode=mirrored      # Windows 11 22H2 or later</code></pre>
<p>Settings quoted from Microsoft's tables (09/2026): <code>systemd</code> defaults to <code>false</code> in the table but Section 0.3 noted that the Ubuntu installed by <code>wsl --install</code> already enables it; check with <code>ps -p 1 -o comm=</code> — it prints <code>systemd</code> when it is on. <code>appendWindowsPath</code> defaults to <code>true</code>, which is why Lesson 8.1 found <code>/mnt/c/…</code> entries in a WSL <code>PATH</code> — and why <code>node</code> can resolve to a Windows <code>node.exe</code> if Linux has none. <code>memory</code> defaults to "50% of total memory on Windows".</p>
<div class="callout warn"><strong>The 8-second rule.</strong> Microsoft: "You must wait until the subsystem running your Linux distribution completely stops running and restarts for configuration setting updates to appear. This typically takes about 8 seconds after closing ALL instances of the distribution shell." Close the window, reopen it at once, and you get the old configuration and conclude the setting "does not work". <code>wsl --list --running</code> shows what is still up; <code>wsl --shutdown</code> is the fast, blunt way.</div>
<p><strong>Networking.</strong> The default mode is NAT. From Windows you can reach a server running in WSL at <code>localhost</code> (<code>localhost:3000</code> in your Windows browser works); from WSL to a server running on Windows you need the Windows host's IP, which Microsoft shows as <code>ip route show | grep -i default | awk '{ print \$3}'</code>. With <code>networkingMode=mirrored</code> (Windows 11 22H2+), Microsoft lists the benefits as IPv6 support, connecting to Windows servers from Linux with <code>127.0.0.1</code>, better VPN compatibility, multicast, and reaching WSL directly from the LAN. One practical consequence: a dev server that must be reached from another machine usually has to listen on <code>0.0.0.0</code>, not <code>127.0.0.1</code> — the same rule as Chapter 9.</p>

<h3>CRLF: the bug that reaches your server</h3>
${slide('lx-15', 21, "CRLF: script của bạn Windows vỡ trên Linux — $'\\r': command not found")}
<p>Windows ends a line of text with two bytes, carriage return + line feed (<code>\\r\\n</code>, "CRLF"); Linux and macOS with one (<code>\\n</code>, "LF"). An editor hides the difference. Bash does not. Section 0.5 told the story; here is the complete anatomy, rebuilt in an Ubuntu 24.04 container from a four-line script saved with Windows line endings:</p>
<pre><code>printf '#!/bin/bash\\r\\n\\r\\necho "Xin chao"\\r\\ncd /tmp\\r\\n' &gt; deploy.sh; chmod +x deploy.sh
./deploy.sh
bash deploy.sh</code></pre>
<div class="out">bash: ./deploy.sh: cannot execute: required file not found
deploy.sh: line 2: \$'\\r': command not found
Xin chao
deploy.sh: line 4: cd: \$'/tmp\\r': No such file or directory</div>
<p>Each of the three errors is the same <code>\\r</code> in a different place:</p>
<table>
<tr><th>Message</th><th>Why</th></tr>
<tr><td><code>cannot execute: required file not found</code></td><td>The kernel reads the shebang as <code>/bin/bash\\r</code> — an interpreter that does not exist. The file itself exists, which makes the message maddening. (Lesson 12.4 showed the same case from the diagnosis side.)</td></tr>
<tr><td><code>\$'\\r': command not found</code></td><td>The "empty" line 2 is not empty: it contains <code>\\r</code>, which bash tries to run as a command. Bash prints it in <code>\$'…'</code> quoting so you can see the invisible character.</td></tr>
<tr><td><code>cd: \$'/tmp\\r': No such file or directory</code></td><td>The <code>\\r</code> sticks to the last argument of every line. <code>echo</code> "worked" only because printing a carriage return at the end of a line is invisible.</td></tr>
</table>
<p>Three ways to <em>see</em> it, in increasing detail:</p>
<pre><code class="language-bash">file deploy.sh
cat -A deploy.sh
head -1 deploy.sh | xxd
grep -c \$'\\r' deploy.sh</code></pre>
<div class="out">deploy.sh: Bourne-Again shell script, ASCII text executable, with CRLF line terminators
#!/bin/bash^M\$
^M\$
echo "Xin chao"^M\$
cd /tmp^M\$
00000000: 2321 2f62 696e 2f62 6173 680d 0a         #!/bin/bash..
4</div>
<p><code>cat -A</code> shows <code>\\r</code> as <code>^M</code> and the end of line as <code>\$</code>; <code>xxd</code> shows the bytes <code>0d 0a</code>. Then fix it with whichever tool you have:</p>
<pre><code class="language-bash">dos2unix deploy.sh                  <span class="tok-comment"># package dos2unix (7.5.1 on Ubuntu 24.04)</span>
sed -i 's/\\r\$//' deploy.sh          <span class="tok-comment"># GNU sed, nothing to install</span>
tr -d '\\r' &lt; a.sh &gt; b.sh            <span class="tok-comment"># works on macOS too</span>
unix2dos file.txt                   <span class="tok-comment"># the reverse, for a file that must be CRLF</span></code></pre>
<pre><code>dos2unix deploy.sh &amp;&amp; ./deploy.sh</code></pre>
<div class="out">dos2unix: converting file deploy.sh to Unix format...
Xin chao</div>
<p>The same bug in <em>data</em> is harder to spot, because nothing crashes at the point of the mistake. A <code>.env</code> edited in Notepad, loaded with <code>source</code>, measured in the container:</p>
<pre><code class="language-bash">printf 'PORT=3000\\r\\nHOST=db\\r\\n' &gt; .env
. ./.env; echo "[\$PORT]" | cat -A
curl -sS "http://127.0.0.1:\$PORT/"; echo "rc=\$?"
PORT=\${PORT%\$'\\r'}; echo "[\$PORT]" | cat -A</code></pre>
<div class="out">[3000^M]\$
curl: (3) URL rejected: Malformed input to a URL function
rc=3
[3000]\$</div>
<p>The port "looks" like 3000 in <code>echo</code>, yet curl rejects the URL. Lesson 6.5 showed the <code>\${v%\$'\\r'}</code> trim for values read in a loop; the real fix is to stop the <code>\\r</code> entering the repository at all.</p>

<h3>Stop CRLF at the source: .gitattributes beats core.autocrlf</h3>
${slide('lx-15', 22, 'Chặn CRLF từ gốc: .gitattributes thắng core.autocrlf')}
<p>Git can convert line endings for you. GitHub's documentation describes <code>core.autocrlf true</code> on Windows as making checked-out files "correct for Windows" while converting "to Unix style when you commit". The Git for Windows installer offers that setting during installation. The problem is that <code>core.autocrlf</code> is a setting on <em>each person's machine</em>. Simulated in the container — <code>autocrlf=true</code> is exactly what a Windows checkout does:</p>
<pre><code class="language-bash">git config --global core.autocrlf true
git clone -q goc may-win; cd may-win
git ls-files --eol</code></pre>
<div class="out">i/lf    w/crlf  attr/                 	README.md
i/lf    w/crlf  attr/                 	deploy.sh</div>
<p>Read the three columns: <code>i/</code> is the line ending stored in the repository (index), <code>w/</code> in the working copy on this machine, <code>attr/</code> the rule from <code>.gitattributes</code> (empty here). The repository is clean LF; this "Windows" checkout has CRLF in <code>deploy.sh</code>. If that file is now copied to the server with <code>scp</code> — or zipped and uploaded, or mounted into a container from the Windows side — the server gets CRLF. A <code>.gitattributes</code> file committed to the repo overrides every machine's setting:</p>
<pre><code class="language-ini"># .gitattributes — at the root of the repository
* text=auto
*.sh   text eol=lf
*.bash text eol=lf
Dockerfile text eol=lf
*.ps1  text eol=crlf
*.png  binary</code></pre>
<pre><code class="language-bash">printf '*.sh text eol=lf\\n' &gt; .gitattributes
rm deploy.sh &amp;&amp; git checkout -- deploy.sh
git ls-files --eol</code></pre>
<div class="out">i/lf    w/crlf  attr/                 	README.md
i/lf    w/lf    attr/text eol=lf      	deploy.sh</div>
<p>Same machine, same <code>autocrlf=true</code>, but <code>deploy.sh</code> is now checked out with LF because the repository says so. <code>README.md</code> is untouched — CRLF in a Markdown file harms nobody. If CRLF has <em>already</em> been committed (someone had <code>autocrlf=false</code> and a Windows editor), add the attributes and renormalise, as GitHub's page instructs:</p>
<pre><code class="language-bash">git ls-files --eol
git add --renormalize .
git status --short
git ls-files --eol
git check-attr -a build.sh</code></pre>
<div class="out">i/crlf  w/crlf  attr/                 	build.sh
M  build.sh
i/lf    w/crlf  attr/text eol=lf      	build.sh
build.sh: text: set
build.sh: eol: lf</div>
<p>After the commit, the repository stores LF (<code>i/lf</code>); the working copy updates on the next checkout. <code>git check-attr -a FILE</code> answers "which rule applies to this file?" when a pattern does not seem to match.</p>
<div class="pitfall co-tieu-de"><strong>"I set autocrlf, so we're safe" — until one teammate didn't.</strong> A team of five that relies on everyone configuring <code>core.autocrlf</code> is one fresh laptop away from CRLF in the repository, and the first person to notice is whoever deploys, at the worst moment, with <code>\$'\\r': command not found</code> in the log. Worse, CRLF can reach a server without git: a script copied from a Windows folder with <code>scp</code>, pasted from a chat app, or bind-mounted into Docker from <code>/mnt/c</code> never goes through git's conversion at all. The durable fix is two layers: <code>.gitattributes</code> with <code>*.sh text eol=lf</code> in the repository (so git always writes LF), and editors set to LF for shell files — in VS Code, the "CRLF/LF" indicator at the bottom right, or <code>"files.eol": "\\n"</code> in the workspace settings. A check in CI such as <code>! grep -rlI \$'\\r' --include='*.sh' .</code> turns the next slip into a failed build instead of a failed deploy.</div>

<h3>Flag table: WSL and line endings</h3>
<table>
<tr><th>Command / setting</th><th>Meaning</th><th>Example</th></tr>
<tr><td><code>wsl -l -v</code></td><td>Distributions, state, WSL version</td><td>check <code>VERSION 2</code></td></tr>
<tr><td><code>wsl --shutdown</code></td><td>Stop the WSL2 VM (all distributions)</td><td>after <code>.wslconfig</code> changes</td></tr>
<tr><td><code>wsl --export NAME FILE</code> · <code>--import</code></td><td>Back up · restore a distribution</td><td><code>wsl --export Ubuntu ubuntu.tar</code></td></tr>
<tr><td><code>[boot] systemd=true</code></td><td>systemd as PID 1 in this distribution</td><td>needed for <code>systemctl</code> (Chapter 11)</td></tr>
<tr><td><code>[interop] appendWindowsPath=false</code></td><td>Keep Windows directories out of Linux <code>PATH</code></td><td>no surprise <code>node.exe</code></td></tr>
<tr><td><code>[wsl2] memory=4GB</code></td><td>Cap the VM's RAM</td><td>laptop with 8 GB</td></tr>
<tr><td><code>file F</code> · <code>cat -A F</code> · <code>xxd</code></td><td>Detect CRLF · see <code>^M</code> · see <code>0d 0a</code></td><td><code>with CRLF line terminators</code></td></tr>
<tr><td><code>dos2unix</code> · <code>unix2dos</code></td><td>CRLF → LF · LF → CRLF</td><td><code>dos2unix *.sh</code></td></tr>
<tr><td><code>git ls-files --eol</code></td><td>Line endings in index / working copy / attribute</td><td><code>i/lf w/crlf</code></td></tr>
<tr><td><code>git add --renormalize .</code></td><td>Re-apply line-ending rules to tracked files</td><td>after adding <code>.gitattributes</code></td></tr>
<tr><td><code>git config core.autocrlf true|input|false</code></td><td>Per-machine conversion (Windows machines typically use true)</td><td>not a team guarantee</td></tr>
</table>

<h3>Try it step by step</h3>
<p>No Windows needed: the container plays the Windows teammate. Type these one at a time in <code>docker run --rm -it ubuntu:24.04 bash</code>:</p>
<pre><code class="language-bash">apt-get update -qq &amp;&amp; apt-get install -y -qq git dos2unix file &gt;/dev/null
git config --global user.email a@b.c; git config --global user.name An
git init -q goc &amp;&amp; cd goc
printf '#!/bin/bash\\necho ok\\n' &gt; deploy.sh &amp;&amp; git add . &amp;&amp; git commit -qm dau &amp;&amp; cd ..
git config --global core.autocrlf true
git clone -q goc may-win &amp;&amp; cd may-win
git ls-files --eol
file deploy.sh
printf '*.sh text eol=lf\\n' &gt; .gitattributes
rm deploy.sh &amp;&amp; git checkout -- deploy.sh
git ls-files --eol; file deploy.sh</code></pre>
<p>What to notice: the clone gives <code>w/crlf</code> and <code>file</code> says <code>with CRLF line terminators</code> even though nobody typed a <code>\\r</code>; after adding one line of <code>.gitattributes</code> and checking out again, <code>w/lf</code>, and <code>file</code> no longer mentions CRLF. Then break it on purpose: <code>printf 'cd /tmp\\r\\n' &gt;&gt; deploy.sh; bash deploy.sh</code>, read the error, and fix it with <code>dos2unix</code>.</p>

<h3>On macOS and Linux</h3>
<p>On a Mac or a Linux laptop you will never <em>create</em> CRLF by accident, but you will <em>receive</em> it: files from Windows teammates, CSV exports from Excel, <code>.env</code> files pasted from a chat. macOS has no <code>dos2unix</code> by default (<code>brew install dos2unix</code>), but <code>tr -d '\\r'</code> works everywhere, and <code>file</code> reports CRLF the same way. <code>cat -A</code> is GNU-only; on the Mac use <code>cat -v</code> (shows <code>^M</code>) or <code>od -c</code>. For git on a Mac or Linux machine, GitHub's recommendation is <code>core.autocrlf input</code> (convert CRLF to LF on commit, never add CRLF on checkout) — but, as above, the repository's <code>.gitattributes</code> is what actually protects the team.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your SWP391 repo has <code>scripts/deploy.sh</code>, <code>scripts/seed.sh</code> and a <code>.env.example</code>. A Windows teammate committed all three with CRLF, and the VPS now fails with <code>\$'\\r': command not found</code>. Fix the repository so it cannot happen again.</p><ol>
<li>In an <code>ubuntu:24.04</code> container, create a repo and commit the three files with CRLF (use <code>printf '…\\r\\n'</code> and <code>git config core.autocrlf false</code> so git stores them as-is). Prove it with <code>git ls-files --eol</code> (<code>i/crlf</code>).</li>
<li>Reproduce the failure: <code>bash scripts/deploy.sh</code>, and <code>source .env.example</code> followed by <code>echo "[\$PORT]" | cat -A</code>.</li>
<li>Add a <code>.gitattributes</code> covering <code>*.sh</code>, <code>.env*</code> and <code>Dockerfile</code> with <code>eol=lf</code>, run <code>git add --renormalize .</code> and commit.</li>
<li>Clone the repo again with <code>git -c core.autocrlf=true clone …</code> (a "Windows" checkout) and check <code>git ls-files --eol</code> and <code>file</code> on all three files.</li></ol>
<p><strong>Done when:</strong> in the fresh "Windows" clone every one of the three files shows <code>i/lf w/lf</code>, the script runs without <code>\$'\\r'</code>, <code>cat -A</code> on the port shows <code>[3000]\$</code> with no <code>^M</code>, and <code>git check-attr -a scripts/deploy.sh</code> names your rule.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">WSL2</span><span class="v">Windows Subsystem for Linux 2: a real Linux kernel in a lightweight VM managed by Windows.</span></div>
  <div class="kv"><span class="k">Distribution (distro)</span><span class="v">A Linux system (Ubuntu, Debian…) installed inside WSL; several can share one VM.</span></div>
  <div class="kv"><span class="k">/mnt/c · \\\\wsl$</span><span class="v">Windows drive seen from Linux · Linux files seen from Windows.</span></div>
  <div class="kv"><span class="k">wsl.conf · .wslconfig</span><span class="v">Per-distribution settings (inside Linux) · VM-wide settings (Windows side).</span></div>
  <div class="kv"><span class="k">NAT / mirrored</span><span class="v">WSL2 networking modes; mirrored shares Windows' network interfaces, including <code>127.0.0.1</code> both ways.</span></div>
  <div class="kv"><span class="k">CRLF / LF</span><span class="v">Windows line ending <code>\\r\\n</code> / Unix line ending <code>\\n</code>.</span></div>
  <div class="kv"><span class="k">core.autocrlf</span><span class="v">A per-machine git setting converting line endings on checkout and commit.</span></div>
  <div class="kv"><span class="k">.gitattributes</span><span class="v">A file in the repository that sets rules (like <code>eol=lf</code>) for everyone who clones it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Only WSL2 gives Windows users real Linux; Git Bash runs bash with Windows programs underneath — fine for git, not a test of a Linux script.</li>
<li>WSL2 is a lightweight VM with a Microsoft-built Linux kernel; <code>wsl -l -v</code>, <code>--shutdown</code>, <code>--export</code> are the commands you will reuse.</li>
<li>Keep project files in Linux's <code>~</code>, not <code>/mnt/c</code>: crossing file systems is slow, case-insensitive and loses <code>chmod</code>.</li>
<li><code>/etc/wsl.conf</code> configures one distribution, <code>.wslconfig</code> the VM; wait ~8 seconds after closing everything, or <code>wsl --shutdown</code>.</li>
<li>CRLF shows up as <code>required file not found</code>, <code>\$'\\r': command not found</code> and <code>\\r</code> glued to arguments; detect with <code>file</code>/<code>cat -A</code>, fix with <code>dos2unix</code>.</li>
<li><code>core.autocrlf</code> is per machine; a committed <code>.gitattributes</code> with <code>*.sh text eol=lf</code> plus <code>git add --renormalize</code> protects the whole team.</li>
</ul>

<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/basic-commands" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">Microsoft Learn — Basic commands for WSL</span><span class="lc-sub">The full <code>wsl</code> command reference used in this lesson, including export/import and mounting disks.</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/filesystems" target="_blank" rel="noopener">
  <span class="lc-ico">📁</span>
  <span class="lc-body"><span class="lc-title">Microsoft Learn — Working across file systems</span><span class="lc-sub">Where to keep your files for speed, <code>\\\\wsl$</code>, running Windows tools from Linux and back, and <code>WSLENV</code>.</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/wsl-config" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Microsoft Learn — Advanced settings configuration in WSL</span><span class="lc-sub">Every key of <code>wsl.conf</code> and <code>.wslconfig</code> with its default, and the 8-second rule.</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/networking" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Microsoft Learn — Accessing network applications with WSL</span><span class="lc-sub">NAT versus mirrored mode, finding the right IP in each direction, and reaching WSL from the LAN.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/get-started/git-basics/configuring-git-to-handle-line-endings" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Configuring Git to handle line endings</span><span class="lc-sub"><code>core.autocrlf</code> per OS, an example <code>.gitattributes</code>, and <code>git add --renormalize</code>.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice on Code Lab</span><span class="lc-sub">The Linux &amp; Bash track — reading errors and inspecting files byte by byte, the skills behind every CRLF fix.</span></span>
</a>

<p class="note-ct"><strong>If a script "exists but cannot be found", run one command before anything else:</strong> <code>file script.sh</code>. If it says <code>with CRLF line terminators</code>, you are done diagnosing. Then fix the repository, not just the file — one line in <code>.gitattributes</code> saves the next person the same hour.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.3</span>
<h2>Windows: WSL2, Git Bash, và lỗi CRLF từ đầu tới cuối</h2>
<p class="lead">Một nửa nhóm đồ án sinh viên điển hình làm việc trên Windows. Với họ, "học Linux" bắt đầu bằng một lựa chọn mà có khi họ không biết mình đang chọn — WSL2, Git Bash, hay thứ khác — và lỗi hay gặp nhất của một nhóm dùng lẫn máy lại vô hình trong mọi trình soạn thảo: một ký tự về-đầu-dòng ở cuối mỗi dòng. Bài này giải thích lựa chọn đó, WSL2 được dựng và cấu hình ra sao, rồi mổ xẻ trọn vẹn lỗi CRLF, dựng lại thật trong một container Ubuntu. <strong>Về nguồn:</strong> khoá không có máy Windows. Mọi lệnh <code>wsl</code> và thiết lập dưới đây lấy từ tài liệu của Microsoft trên learn.microsoft.com (đọc 09/2026) và được ghi rõ như vậy; không có output Windows nào được in, vì không có cách nào ghi lại nó một cách trung thực.</p>

<h3>Ba cách có bash trên Windows — chỉ một cách là Linux</h3>
${slide('lx-15', 17, 'Ba cách có bash trên Windows — chỉ một cách là Linux')}
<table>
<tr><th></th><th>WSL2 + Ubuntu</th><th>Git Bash</th><th>MSYS2 / Cygwin</th></tr>
<tr><td>Nó là gì</td><td>Nhân Linux thật trong một máy ảo nhẹ, với một bản phân phối thật chạy bên trên</td><td>"a BASH emulation used to run Git from the command line" (gitforwindows.org) — bash giả lập để chạy git, kèm một bộ nhỏ công cụ Unix</td><td>"a collection of tools and libraries providing you with an easy-to-use environment for building, installing and running native Windows software" (msys2.org) — bộ công cụ để dựng phần mềm cho Windows, có <code>pacman</code></td></tr>
<tr><td><code>apt</code>, <code>systemd</code>, Docker, <code>/proc</code></td><td>có — y như trên VPS</td><td>không</td><td>không (gói riêng của nó, không phải gói Linux)</td></tr>
<tr><td>Đường dẫn của <code>C:\\Users\\an</code></td><td><code>/mnt/c/Users/an</code></td><td><code>/c/Users/an</code></td><td><code>/c/Users/an</code> (MSYS2)</td></tr>
<tr><td>Hợp với</td><td>khoá này, đồ án của bạn, mọi thứ deploy lên Linux</td><td>git, và <code>ls</code>/<code>grep</code> nhanh trên file Windows</td><td>biên dịch phần mềm Windows bằng công cụ Unix</td></tr>
</table>
<p>Câu hỏi quyết định rất đơn giản: <em>script này có chạy trên máy chủ Linux không?</em> Nếu có, thử nó ở nơi có Linux — WSL2 (hoặc một container). Git Bash chạy bash, nhưng các chương trình xung quanh là chương trình Windows đóng giả, nên một script "chạy được trong Git Bash" chưa hề được thử trên Linux. Và <code>uname -s</code> cho script biết nó đang ở đâu: <code>Linux</code> trong WSL, một chuỗi bắt đầu bằng <code>MINGW64_NT</code> trong Git Bash — vì thế script dùng chung ở Bài 15.1 có nhánh <code>MINGW*|MSYS*|CYGWIN*)</code>.</p>

<h3>WSL2 là một máy ảo Linux thật — chỉ là rất nhẹ</h3>
${slide('lx-15', 18, 'WSL2 là một máy ảo Linux thật — chỉ là rất nhẹ')}
<p>Trang so sánh của Microsoft nói thẳng kiến trúc: WSL 2 "uses the latest and greatest in virtualization technology to run a Linux kernel inside of a lightweight utility virtual machine (VM). WSL2 runs Linux distributions as isolated containers inside the managed VM" — nó chạy một nhân Linux bên trong một máy ảo tiện ích nhẹ, và mỗi bản phân phối là một container cô lập bên trong máy ảo đó. Nhân "is built by Microsoft from the latest stable branch, based on the source available at kernel.org" — Microsoft tự dựng từ nhánh ổn định mới nhất của kernel.org — và được cập nhật qua Windows Update. Đó là lý do WSL2 tương thích đầy đủ lời gọi hệ thống (syscall) — Docker, systemd và mọi thứ trong Chương 1–14 cư xử như trên máy chủ — còn WSL1, lớp dịch cũ, thì không.</p>
<p>Mục 0.3 đã đưa lệnh cài đặt; đây là bảng tra bạn sẽ thật sự quay lại (gõ trong PowerShell hoặc CMD; từ <em>bên trong</em> Linux thì phải gõ <code>wsl.exe</code>, theo trang "Basic commands for WSL" của Microsoft):</p>
<table>
<tr><th>Lệnh</th><th>Làm gì (theo mô tả của Microsoft)</th><th>Khi nào</th></tr>
<tr><td><code>wsl --install</code></td><td>Cài WSL và bản phân phối Ubuntu mặc định</td><td>một lần, PowerShell quyền Administrator, rồi khởi động lại. Cần Windows 10 bản 2004 (build 19041) trở lên, hoặc Windows 11</td></tr>
<tr><td><code>wsl --list --online</code> · <code>wsl --install -d Debian</code></td><td>Các bản phân phối có sẵn · cài thêm một bản</td><td>muốn bản thứ hai</td></tr>
<tr><td><code>wsl -l -v</code></td><td>Các bản đã cài, trạng thái, và phiên bản WSL 1 hay 2</td><td>kiểm VERSION là 2</td></tr>
<tr><td><code>wsl --set-version Ubuntu 2</code></td><td>Chuyển một bản phân phối giữa WSL 1 và 2</td><td>bản cài cũ</td></tr>
<tr><td><code>wsl -d Ubuntu -u root</code></td><td>Chạy đúng bản phân phối với đúng người dùng</td><td>quên mật khẩu Linux</td></tr>
<tr><td><code>wsl --shutdown</code> · <code>wsl --terminate Ubuntu</code></td><td>Dừng mọi bản phân phối và máy ảo · dừng một bản</td><td>sau khi sửa <code>.wslconfig</code></td></tr>
<tr><td><code>wsl --export Ubuntu ubuntu.tar</code> · <code>wsl --import …</code></td><td>Chụp một bản phân phối ra file tar · khôi phục nó</td><td>sao lưu trước khi thử nghiệm</td></tr>
<tr><td><code>wsl --unregister Ubuntu</code></td><td>Gỡ bản phân phối — Microsoft cảnh báo "all data, settings, and software … will be permanently lost" (mất vĩnh viễn)</td><td>gần như không bao giờ</td></tr>
<tr><td><code>wsl --update</code> · <code>wsl --version</code> · <code>wsl --status</code></td><td>Cập nhật WSL · phiên bản các thành phần · bản mặc định và nhân</td><td>trước khi đi hỏi người khác</td></tr>
</table>
<div class="callout ok"><strong><code>wsl --export</code> là nút hoàn tác của bạn.</strong> Trước khi thử thứ gì liều ở Chương 14 (hoặc trước khi cài lại Windows), <code>wsl --export Ubuntu D:\\backup\\ubuntu.tar</code> chụp lại cả bản phân phối — gói đã cài, thư mục <code>~</code> của bạn, mọi thứ — và <code>wsl --import</code> đem nó về thành một bản mới. Nó là bản WSL của việc vứt một container đi rồi dựng cái mới.</div>

<h3>Để mã nguồn trong ~ của Linux, đừng để ở /mnt/c</h3>
${slide('lx-15', 19, 'Để mã nguồn trong ~ của Linux, đừng để ở /mnt/c')}
<p>Một bản phân phối WSL2 có ổ ext4 riêng. Các ổ Windows hiện ra bên trong nó dưới <code>/mnt/c</code>, <code>/mnt/d</code>…, còn file Linux hiện ra phía Windows ở <code>\\\\wsl$</code> trong File Explorer. Cả hai chiều đều dùng được — nhưng đi qua ranh giới thì CHẬM, và Microsoft nói thẳng trong "Working across file systems": "For the fastest performance speed, store your files in the WSL file system if you are working in a Linux command line … If you're working in a Windows command line (PowerShell, Command Prompt), store your files in the Windows file system" — làm bằng dòng lệnh Linux thì để file trong hệ thống file của WSL, làm bằng PowerShell thì để ở ổ Windows. Ví dụ của họ: dùng <code>/home/&lt;tên&gt;/Project</code>, không dùng <code>/mnt/c/Users/&lt;tên&gt;/Project</code>. Bảng tính năng ở trang "Comparing WSL Versions" ghi "Performance across OS file systems" là điểm mạnh của WSL1 và điểm yếu của WSL2 — mà <code>npm install</code>, <code>git status</code> trên repo lớn hay một lần build chạm vào hàng nghìn file nhỏ, đúng trường hợp chậm nhất.</p>
<pre><code class="language-bash">cd ~ &amp;&amp; mkdir -p du-an &amp;&amp; cd du-an          <span class="tok-comment"># phía Linux</span>
git clone https://github.com/&lt;nhom&gt;/swp391.git
code .                                         <span class="tok-comment"># VS Code trên Windows, nối vào WSL (tiện ích Remote - WSL)</span>
explorer.exe .                                 <span class="tok-comment"># mở CHÍNH thư mục Linux này trong File Explorer</span></code></pre>
<p>WSL còn cho hai thế giới gọi lẫn nhau. Theo trang của Microsoft: chương trình Windows chạy được từ Linux nếu có đuôi <code>.exe</code> (<code>notepad.exe</code>, <code>ipconfig.exe | grep IPv4</code>, <code>ls -la | findstr.exe foo</code>), và chương trình Linux chạy được từ PowerShell với <code>wsl</code> đứng trước (<code>wsl ls -la</code>, <code>dir | wsl grep git</code>). Hai công cụ đổi đường dẫn:</p>
<table>
<tr><th>Cần</th><th>Lệnh</th><th>Kết quả (dạng)</th></tr>
<tr><td>Đường Linux → đường Windows</td><td><code>wslpath -w ~/du-an</code></td><td>một đường <code>\\\\wsl.localhost\\&lt;distro&gt;\\home\\…</code> mà chương trình Windows mở được</td></tr>
<tr><td>Đường Windows → đường Linux</td><td><code>wslpath 'C:\\Users\\an'</code></td><td><code>/mnt/c/Users/an</code></td></tr>
<tr><td>Chia sẻ một biến hai chiều</td><td><code>WSLENV</code> với cờ <code>/p</code> (dịch đường dẫn), <code>/l</code> (danh sách), <code>/u</code>, <code>/w</code></td><td>tài liệu ở cùng trang Microsoft đó</td></tr>
</table>
<p><code>wslpath</code> đi kèm sẵn trong WSL; output chính xác phụ thuộc tên bản phân phối của bạn, nên ở đây chỉ ghi DẠNG của kết quả, không phải output đã ghi lại.</p>
<div class="callout warn"><strong>Thêm hai lý do để không đặt mã ở <code>/mnt/c</code>.</strong> Windows không phân biệt hoa/thường còn Linux thì có (chính Microsoft cảnh báo), nên <code>Logo.png</code> và <code>logo.png</code> có thể đè nhau trên <code>/mnt/c</code> và một dự án dựng cho Linux có thể cư xử khác ở đó. Và quyền Linux trên ổ Windows chỉ là giả lập: mặc định tuỳ chọn <code>metadata</code> của <code>[automount]</code> đang tắt, nên <code>chmod +x deploy.sh</code> trên <code>/mnt/c</code> không giữ được — script "mất" quyền chạy mà chẳng thấy lý do.</div>

<h3>wsl.conf cho MỘT bản phân phối, .wslconfig cho CẢ máy ảo</h3>
${slide('lx-15', 20, 'wsl.conf cho MỘT distro, .wslconfig cho CẢ máy ảo — và luật 8 giây')}
<p>Trang "Advanced settings configuration in WSL" của Microsoft tách bạch hai file: <code>/etc/wsl.conf</code> nằm BÊN TRONG một bản phân phối và cấu hình đúng bản đó (khởi động, gắn ổ tự động, mạng, tương tác với Windows, người dùng mặc định); <code>%UserProfile%\\.wslconfig</code> nằm phía Windows và cấu hình cái máy ảo mà mọi bản WSL2 dùng chung (bộ nhớ, số nhân, chế độ mạng).</p>
<pre><code class="language-ini"># /etc/wsl.conf — bên trong bản phân phối (sudo nano /etc/wsl.conf)
[boot]
systemd=true                 # systemd làm PID 1 (chỉ WSL 2)

[interop]
appendWindowsPath=false      # thôi nối /mnt/c/... vào PATH của Linux

[automount]
options="metadata,umask=022" # cho chmod có tác dụng trên /mnt/c

[user]
default=an</code></pre>
<pre><code class="language-ini"># %UserProfile%\\.wslconfig — phía Windows
[wsl2]
memory=4GB                   # mặc định: 50% bộ nhớ Windows
processors=2                 # mặc định: mọi bộ xử lý logic
networkingMode=mirrored      # Windows 11 22H2 trở lên</code></pre>
<p>Thiết lập trích từ bảng của Microsoft (09/2026): <code>systemd</code> mặc định là <code>false</code> trong bảng, nhưng Mục 0.3 đã ghi rằng Ubuntu cài bằng <code>wsl --install</code> đã bật sẵn; kiểm bằng <code>ps -p 1 -o comm=</code> — in <code>systemd</code> khi nó đang bật. <code>appendWindowsPath</code> mặc định <code>true</code>, chính vì thế Bài 8.1 thấy các mục <code>/mnt/c/…</code> trong <code>PATH</code> của WSL — và vì thế <code>node</code> có thể trỏ tới <code>node.exe</code> của Windows nếu phía Linux không có. <code>memory</code> mặc định "50% of total memory on Windows".</p>
<div class="callout warn"><strong>Luật 8 giây.</strong> Microsoft: "You must wait until the subsystem running your Linux distribution completely stops running and restarts for configuration setting updates to appear. This typically takes about 8 seconds after closing ALL instances of the distribution shell." — phải đợi hệ thống con dừng HẲN rồi khởi động lại thì thiết lập mới có hiệu lực, thường khoảng 8 giây sau khi đóng MỌI cửa sổ shell của bản phân phối. Đóng cửa sổ rồi mở lại ngay là bạn nhận cấu hình CŨ và kết luận thiết lập "không chạy". <code>wsl --list --running</code> cho thấy thứ gì còn chạy; <code>wsl --shutdown</code> là cách nhanh và thô.</div>
<p><strong>Mạng.</strong> Chế độ mặc định là NAT. Từ Windows bạn gọi được máy chủ chạy trong WSL qua <code>localhost</code> (<code>localhost:3000</code> trong trình duyệt Windows chạy được); từ WSL gọi sang máy chủ chạy trên Windows thì cần IP của máy Windows, Microsoft chỉ cách lấy là <code>ip route show | grep -i default | awk '{ print \$3}'</code>. Với <code>networkingMode=mirrored</code> (Windows 11 22H2+), Microsoft liệt kê lợi ích: hỗ trợ IPv6, gọi máy chủ Windows từ Linux bằng <code>127.0.0.1</code>, tương thích VPN tốt hơn, multicast, và gọi thẳng vào WSL từ mạng LAN. Hệ quả thực tế: một dev server cần được máy khác gọi tới thường phải nghe trên <code>0.0.0.0</code>, không phải <code>127.0.0.1</code> — cùng luật với Chương 9.</p>

<h3>CRLF: lỗi đi thẳng tới máy chủ của bạn</h3>
${slide('lx-15', 21, "CRLF: script của bạn Windows vỡ trên Linux — $'\\r': command not found")}
<p>Windows kết thúc một dòng chữ bằng HAI byte, về-đầu-dòng + xuống-dòng (<code>\\r\\n</code>, "CRLF"); Linux và macOS bằng MỘT (<code>\\n</code>, "LF"). Trình soạn thảo giấu sự khác biệt đó. Bash thì không. Mục 0.5 đã kể câu chuyện; đây là giải phẫu đầy đủ, dựng lại trong container Ubuntu 24.04 từ một script bốn dòng lưu với kiểu xuống dòng của Windows:</p>
<pre><code>printf '#!/bin/bash\\r\\n\\r\\necho "Xin chao"\\r\\ncd /tmp\\r\\n' &gt; deploy.sh; chmod +x deploy.sh
./deploy.sh
bash deploy.sh</code></pre>
<div class="out">bash: ./deploy.sh: cannot execute: required file not found
deploy.sh: line 2: \$'\\r': command not found
Xin chao
deploy.sh: line 4: cd: \$'/tmp\\r': No such file or directory</div>
<p>Cả ba lỗi là cùng một <code>\\r</code> ở ba chỗ khác nhau:</p>
<table>
<tr><th>Thông báo</th><th>Vì sao</th></tr>
<tr><td><code>cannot execute: required file not found</code></td><td>Nhân đọc dòng shebang thành <code>/bin/bash\\r</code> — một trình thông dịch không tồn tại. Bản thân file thì có, nên thông báo này làm người ta phát điên. (Bài 12.4 đã gặp đúng ca này từ phía chẩn đoán.)</td></tr>
<tr><td><code>\$'\\r': command not found</code></td><td>Dòng 2 "trống" thật ra không trống: nó chứa <code>\\r</code>, và bash cố chạy nó như một lệnh. Bash in nó trong kiểu nháy <code>\$'…'</code> để bạn thấy được ký tự vô hình.</td></tr>
<tr><td><code>cd: \$'/tmp\\r': No such file or directory</code></td><td><code>\\r</code> dính vào đối số cuối của mọi dòng. <code>echo</code> "chạy được" chỉ vì in một ký tự về-đầu-dòng ở cuối dòng thì không ai thấy.</td></tr>
</table>
<p>Ba cách để <em>thấy</em> nó, chi tiết tăng dần:</p>
<pre><code class="language-bash">file deploy.sh
cat -A deploy.sh
head -1 deploy.sh | xxd
grep -c \$'\\r' deploy.sh</code></pre>
<div class="out">deploy.sh: Bourne-Again shell script, ASCII text executable, with CRLF line terminators
#!/bin/bash^M\$
^M\$
echo "Xin chao"^M\$
cd /tmp^M\$
00000000: 2321 2f62 696e 2f62 6173 680d 0a         #!/bin/bash..
4</div>
<p><code>cat -A</code> hiện <code>\\r</code> thành <code>^M</code> và cuối dòng thành <code>\$</code>; <code>xxd</code> hiện hai byte <code>0d 0a</code>. Rồi sửa bằng công cụ nào bạn có:</p>
<pre><code class="language-bash">dos2unix deploy.sh                  <span class="tok-comment"># gói dos2unix (7.5.1 trên Ubuntu 24.04)</span>
sed -i 's/\\r\$//' deploy.sh          <span class="tok-comment"># GNU sed, không cần cài gì</span>
tr -d '\\r' &lt; a.sh &gt; b.sh            <span class="tok-comment"># chạy cả trên macOS</span>
unix2dos file.txt                   <span class="tok-comment"># chiều ngược lại, cho file BẮT BUỘC phải CRLF</span></code></pre>
<pre><code>dos2unix deploy.sh &amp;&amp; ./deploy.sh</code></pre>
<div class="out">dos2unix: converting file deploy.sh to Unix format...
Xin chao</div>
<p>Cùng lỗi đó nằm trong <em>dữ liệu</em> thì khó thấy hơn, vì chẳng có gì sập ngay tại chỗ sai. Một file <code>.env</code> sửa bằng Notepad, nạp bằng <code>source</code>, đo trong container:</p>
<pre><code class="language-bash">printf 'PORT=3000\\r\\nHOST=db\\r\\n' &gt; .env
. ./.env; echo "[\$PORT]" | cat -A
curl -sS "http://127.0.0.1:\$PORT/"; echo "rc=\$?"
PORT=\${PORT%\$'\\r'}; echo "[\$PORT]" | cat -A</code></pre>
<div class="out">[3000^M]\$
curl: (3) URL rejected: Malformed input to a URL function
rc=3
[3000]\$</div>
<p>Cổng "trông như" 3000 khi <code>echo</code>, vậy mà curl từ chối URL. Bài 6.5 đã cho cách cắt <code>\${v%\$'\\r'}</code> với giá trị đọc trong vòng lặp; cách sửa thật là đừng để <code>\\r</code> lọt vào repo ngay từ đầu.</p>

<h3>Chặn CRLF từ gốc: .gitattributes thắng core.autocrlf</h3>
${slide('lx-15', 22, 'Chặn CRLF từ gốc: .gitattributes thắng core.autocrlf')}
<p>Git có thể đổi kiểu xuống dòng giúp bạn. Tài liệu của GitHub mô tả <code>core.autocrlf true</code> trên Windows là làm cho file lấy ra (checkout) "correct for Windows" trong khi đổi "to Unix style when you commit" — lấy ra thì thành CRLF, commit thì đổi về LF. Trình cài Git for Windows có đưa ra thiết lập đó ngay lúc cài. Vấn đề là <code>core.autocrlf</code> là thiết lập trên <em>MÁY CỦA TỪNG NGƯỜI</em>. Giả lập trong container — <code>autocrlf=true</code> chính là thứ một lần checkout trên Windows làm:</p>
<pre><code class="language-bash">git config --global core.autocrlf true
git clone -q goc may-win; cd may-win
git ls-files --eol</code></pre>
<div class="out">i/lf    w/crlf  attr/                 	README.md
i/lf    w/crlf  attr/                 	deploy.sh</div>
<p>Đọc ba cột: <code>i/</code> là kiểu xuống dòng lưu trong kho (index), <code>w/</code> là trong bản làm việc trên máy này, <code>attr/</code> là luật từ <code>.gitattributes</code> (ở đây trống). Kho sạch LF; bản checkout "Windows" này có CRLF trong <code>deploy.sh</code>. Nếu giờ file đó được chép lên máy chủ bằng <code>scp</code> — hay nén rồi tải lên, hay gắn vào container từ phía Windows — máy chủ nhận CRLF. Một file <code>.gitattributes</code> commit vào repo sẽ đè lên thiết lập của mọi máy:</p>
<pre><code class="language-ini"># .gitattributes — ở gốc repo
* text=auto
*.sh   text eol=lf
*.bash text eol=lf
Dockerfile text eol=lf
*.ps1  text eol=crlf
*.png  binary</code></pre>
<pre><code class="language-bash">printf '*.sh text eol=lf\\n' &gt; .gitattributes
rm deploy.sh &amp;&amp; git checkout -- deploy.sh
git ls-files --eol</code></pre>
<div class="out">i/lf    w/crlf  attr/                 	README.md
i/lf    w/lf    attr/text eol=lf      	deploy.sh</div>
<p>Cùng máy, cùng <code>autocrlf=true</code>, nhưng giờ <code>deploy.sh</code> được lấy ra với LF vì repo đã nói vậy. <code>README.md</code> không đổi — CRLF trong file Markdown chẳng hại ai. Nếu CRLF <em>ĐÃ</em> lỡ được commit (ai đó để <code>autocrlf=false</code> và dùng trình soạn thảo Windows), thêm file thuộc tính rồi chuẩn hoá lại, đúng như trang của GitHub hướng dẫn:</p>
<pre><code class="language-bash">git ls-files --eol
git add --renormalize .
git status --short
git ls-files --eol
git check-attr -a build.sh</code></pre>
<div class="out">i/crlf  w/crlf  attr/                 	build.sh
M  build.sh
i/lf    w/crlf  attr/text eol=lf      	build.sh
build.sh: text: set
build.sh: eol: lf</div>
<p>Sau khi commit, kho lưu LF (<code>i/lf</code>); bản làm việc cập nhật ở lần checkout sau. <code>git check-attr -a FILE</code> trả lời câu "luật nào đang áp cho file này?" khi một mẫu có vẻ không khớp.</p>
<div class="pitfall co-tieu-de"><strong>"Tôi đặt autocrlf rồi, cả nhóm an toàn" — cho tới khi có một bạn chưa đặt.</strong> Một nhóm năm người trông vào việc ai cũng tự cấu hình <code>core.autocrlf</code> chỉ cách CRLF trong repo đúng một cái laptop mới, và người đầu tiên phát hiện là người deploy, vào lúc tệ nhất, với <code>\$'\\r': command not found</code> trong log. Tệ hơn, CRLF có thể tới máy chủ mà không qua git: một script chép từ thư mục Windows bằng <code>scp</code>, dán từ ứng dụng chat, hay gắn vào Docker từ <code>/mnt/c</code> thì không bao giờ đi qua bước chuyển đổi của git. Cách sửa bền là hai lớp: <code>.gitattributes</code> có <code>*.sh text eol=lf</code> trong repo (để git luôn ghi LF), và trình soạn thảo đặt LF cho file shell — trong VS Code là chỗ "CRLF/LF" ở góc dưới bên phải, hoặc <code>"files.eol": "\\n"</code> trong thiết lập của workspace. Một bước kiểm trong CI như <code>! grep -rlI \$'\\r' --include='*.sh' .</code> biến lần lỡ tay kế tiếp thành một lần build hỏng thay vì một lần deploy hỏng.</div>

<h3>Bảng cờ: WSL và kiểu xuống dòng</h3>
<table>
<tr><th>Lệnh / thiết lập</th><th>Nghĩa</th><th>Ví dụ</th></tr>
<tr><td><code>wsl -l -v</code></td><td>Bản phân phối, trạng thái, phiên bản WSL</td><td>kiểm <code>VERSION 2</code></td></tr>
<tr><td><code>wsl --shutdown</code></td><td>Dừng máy ảo WSL2 (mọi bản phân phối)</td><td>sau khi sửa <code>.wslconfig</code></td></tr>
<tr><td><code>wsl --export TÊN FILE</code> · <code>--import</code></td><td>Sao lưu · khôi phục một bản phân phối</td><td><code>wsl --export Ubuntu ubuntu.tar</code></td></tr>
<tr><td><code>[boot] systemd=true</code></td><td>systemd làm PID 1 trong bản phân phối này</td><td>cần cho <code>systemctl</code> (Chương 11)</td></tr>
<tr><td><code>[interop] appendWindowsPath=false</code></td><td>Không cho thư mục Windows vào <code>PATH</code> của Linux</td><td>khỏi dính <code>node.exe</code> bất ngờ</td></tr>
<tr><td><code>[wsl2] memory=4GB</code></td><td>Giới hạn RAM của máy ảo</td><td>laptop 8 GB</td></tr>
<tr><td><code>file F</code> · <code>cat -A F</code> · <code>xxd</code></td><td>Phát hiện CRLF · thấy <code>^M</code> · thấy <code>0d 0a</code></td><td><code>with CRLF line terminators</code></td></tr>
<tr><td><code>dos2unix</code> · <code>unix2dos</code></td><td>CRLF → LF · LF → CRLF</td><td><code>dos2unix *.sh</code></td></tr>
<tr><td><code>git ls-files --eol</code></td><td>Kiểu xuống dòng trong kho / bản làm việc / thuộc tính</td><td><code>i/lf w/crlf</code></td></tr>
<tr><td><code>git add --renormalize .</code></td><td>Áp lại luật xuống dòng cho các file đang theo dõi</td><td>sau khi thêm <code>.gitattributes</code></td></tr>
<tr><td><code>git config core.autocrlf true|input|false</code></td><td>Chuyển đổi theo từng máy (máy Windows thường đặt true)</td><td>không phải bảo đảm cho cả nhóm</td></tr>
</table>

<h3>Chạy thử từng bước</h3>
<p>Không cần Windows: container đóng vai bạn cùng nhóm dùng Windows. Gõ từng dòng trong <code>docker run --rm -it ubuntu:24.04 bash</code>:</p>
<pre><code class="language-bash">apt-get update -qq &amp;&amp; apt-get install -y -qq git dos2unix file &gt;/dev/null
git config --global user.email a@b.c; git config --global user.name An
git init -q goc &amp;&amp; cd goc
printf '#!/bin/bash\\necho ok\\n' &gt; deploy.sh &amp;&amp; git add . &amp;&amp; git commit -qm dau &amp;&amp; cd ..
git config --global core.autocrlf true
git clone -q goc may-win &amp;&amp; cd may-win
git ls-files --eol
file deploy.sh
printf '*.sh text eol=lf\\n' &gt; .gitattributes
rm deploy.sh &amp;&amp; git checkout -- deploy.sh
git ls-files --eol; file deploy.sh</code></pre>
<p>Cần để ý: bản clone cho <code>w/crlf</code> và <code>file</code> báo <code>with CRLF line terminators</code> dù chẳng ai gõ một <code>\\r</code> nào; sau khi thêm một dòng <code>.gitattributes</code> và checkout lại, <code>w/lf</code>, và <code>file</code> không còn nhắc tới CRLF. Rồi cố tình làm hỏng: <code>printf 'cd /tmp\\r\\n' &gt;&gt; deploy.sh; bash deploy.sh</code>, đọc lỗi, và sửa bằng <code>dos2unix</code>.</p>

<h3>Trên macOS và Linux thì sao</h3>
<p>Trên Mac hay laptop Linux bạn sẽ không bao giờ vô tình <em>TẠO</em> ra CRLF, nhưng bạn sẽ <em>NHẬN</em> nó: file từ bạn cùng nhóm dùng Windows, CSV xuất từ Excel, file <code>.env</code> dán từ ứng dụng chat. macOS không có sẵn <code>dos2unix</code> (<code>brew install dos2unix</code>), nhưng <code>tr -d '\\r'</code> chạy ở mọi nơi, và <code>file</code> báo CRLF y như vậy. <code>cat -A</code> chỉ có ở GNU; trên Mac dùng <code>cat -v</code> (hiện <code>^M</code>) hoặc <code>od -c</code>. Với git trên Mac hay Linux, GitHub khuyên <code>core.autocrlf input</code> (đổi CRLF thành LF khi commit, không bao giờ thêm CRLF khi checkout) — nhưng, như ở trên, chính <code>.gitattributes</code> trong repo mới là thứ thật sự bảo vệ cả nhóm.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> repo SWP391 của bạn có <code>scripts/deploy.sh</code>, <code>scripts/seed.sh</code> và một <code>.env.example</code>. Một bạn dùng Windows đã commit cả ba với CRLF, và VPS giờ hỏng với <code>\$'\\r': command not found</code>. Sửa repo để chuyện này không thể lặp lại.</p><ol>
<li>Trong container <code>ubuntu:24.04</code>, tạo một repo và commit ba file với CRLF (dùng <code>printf '…\\r\\n'</code> và <code>git config core.autocrlf false</code> để git lưu nguyên xi). Chứng minh bằng <code>git ls-files --eol</code> (<code>i/crlf</code>).</li>
<li>Tái hiện lỗi: <code>bash scripts/deploy.sh</code>, và <code>source .env.example</code> rồi <code>echo "[\$PORT]" | cat -A</code>.</li>
<li>Thêm <code>.gitattributes</code> phủ <code>*.sh</code>, <code>.env*</code> và <code>Dockerfile</code> với <code>eol=lf</code>, chạy <code>git add --renormalize .</code> và commit.</li>
<li>Clone lại repo bằng <code>git -c core.autocrlf=true clone …</code> (một lần checkout "Windows") và kiểm <code>git ls-files --eol</code> cùng <code>file</code> trên cả ba file.</li></ol>
<p><strong>Đạt khi:</strong> trong bản clone "Windows" mới, cả ba file đều hiện <code>i/lf w/lf</code>, script chạy không còn <code>\$'\\r'</code>, <code>cat -A</code> trên biến cổng hiện <code>[3000]\$</code> không có <code>^M</code>, và <code>git check-attr -a scripts/deploy.sh</code> gọi đúng tên luật của bạn.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">WSL2</span><span class="v">Windows Subsystem for Linux 2 (hệ thống con Linux cho Windows): nhân Linux thật trong một máy ảo nhẹ do Windows quản lý.</span></div>
  <div class="kv"><span class="k">Distribution (bản phân phối, distro)</span><span class="v">Một hệ Linux (Ubuntu, Debian…) cài trong WSL; nhiều bản dùng chung một máy ảo.</span></div>
  <div class="kv"><span class="k">/mnt/c · \\\\wsl$</span><span class="v">Ổ Windows nhìn từ Linux · file Linux nhìn từ Windows.</span></div>
  <div class="kv"><span class="k">wsl.conf · .wslconfig</span><span class="v">Thiết lập của một bản phân phối (bên trong Linux) · thiết lập của cả máy ảo (phía Windows).</span></div>
  <div class="kv"><span class="k">NAT / mirrored (dịch địa chỉ / soi gương)</span><span class="v">Hai chế độ mạng của WSL2; mirrored dùng chung card mạng của Windows, kể cả <code>127.0.0.1</code> hai chiều.</span></div>
  <div class="kv"><span class="k">CRLF / LF (kiểu xuống dòng)</span><span class="v">Kết thúc dòng kiểu Windows <code>\\r\\n</code> / kiểu Unix <code>\\n</code>.</span></div>
  <div class="kv"><span class="k">core.autocrlf</span><span class="v">Thiết lập git theo TỪNG MÁY, đổi kiểu xuống dòng khi checkout và commit.</span></div>
  <div class="kv"><span class="k">.gitattributes (thuộc tính git)</span><span class="v">File nằm trong repo đặt luật (như <code>eol=lf</code>) cho mọi người clone nó.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Chỉ WSL2 cho người dùng Windows một Linux thật; Git Bash chạy bash trên nền chương trình Windows — ổn cho git, không phải phép thử cho script Linux.</li>
<li>WSL2 là máy ảo nhẹ với nhân Linux do Microsoft dựng; <code>wsl -l -v</code>, <code>--shutdown</code>, <code>--export</code> là những lệnh bạn sẽ dùng lại.</li>
<li>Để file dự án trong <code>~</code> của Linux, không ở <code>/mnt/c</code>: đi qua ranh giới hệ thống file thì chậm, không phân biệt hoa/thường và mất <code>chmod</code>.</li>
<li><code>/etc/wsl.conf</code> cấu hình một bản phân phối, <code>.wslconfig</code> cấu hình máy ảo; đợi khoảng 8 giây sau khi đóng hết, hoặc <code>wsl --shutdown</code>.</li>
<li>CRLF hiện ra thành <code>required file not found</code>, <code>\$'\\r': command not found</code> và <code>\\r</code> dính vào đối số; phát hiện bằng <code>file</code>/<code>cat -A</code>, sửa bằng <code>dos2unix</code>.</li>
<li><code>core.autocrlf</code> là của từng máy; một <code>.gitattributes</code> có <code>*.sh text eol=lf</code> commit vào repo cộng <code>git add --renormalize</code> bảo vệ cả nhóm.</li>
</ul>

<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/basic-commands" target="_blank" rel="noopener">
  <span class="lc-ico">🪟</span>
  <span class="lc-body"><span class="lc-title">Microsoft Learn — Các lệnh cơ bản của WSL</span><span class="lc-sub">Bảng tra đầy đủ lệnh <code>wsl</code> dùng trong bài, kể cả export/import và gắn ổ đĩa.</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/filesystems" target="_blank" rel="noopener">
  <span class="lc-ico">📁</span>
  <span class="lc-body"><span class="lc-title">Microsoft Learn — Làm việc qua hai hệ thống file</span><span class="lc-sub">Để file ở đâu cho nhanh, <code>\\\\wsl$</code>, chạy công cụ Windows từ Linux và ngược lại, và <code>WSLENV</code>.</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/wsl-config" target="_blank" rel="noopener">
  <span class="lc-ico">⚙️</span>
  <span class="lc-body"><span class="lc-title">Microsoft Learn — Cấu hình nâng cao trong WSL</span><span class="lc-sub">Mọi khoá của <code>wsl.conf</code> và <code>.wslconfig</code> kèm mặc định, và luật 8 giây.</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/windows/wsl/networking" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Microsoft Learn — Truy cập ứng dụng mạng với WSL</span><span class="lc-sub">NAT so với mirrored, tìm đúng IP ở mỗi chiều, và gọi vào WSL từ mạng LAN.</span></span>
</a>
<a class="link-card" href="https://docs.github.com/en/get-started/git-basics/configuring-git-to-handle-line-endings" target="_blank" rel="noopener">
  <span class="lc-ico">🐙</span>
  <span class="lc-body"><span class="lc-title">GitHub Docs — Cấu hình Git xử lý kiểu xuống dòng</span><span class="lc-sub"><code>core.autocrlf</code> theo từng hệ điều hành, một <code>.gitattributes</code> mẫu, và <code>git add --renormalize</code>.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trên Code Lab</span><span class="lc-sub">Track Linux &amp; Bash — đọc lỗi và soi file từng byte, những kỹ năng nằm sau mọi lần sửa CRLF.</span></span>
</a>

<p class="note-ct"><strong>Nếu một script "có đó mà không tìm thấy", hãy chạy MỘT lệnh trước mọi thứ khác:</strong> <code>file script.sh</code>. Nếu nó nói <code>with CRLF line terminators</code>, bạn chẩn đoán xong rồi. Sau đó sửa cái repo, không chỉ sửa cái file — một dòng trong <code>.gitattributes</code> tiết kiệm cho người tiếp theo đúng một giờ đó.</p>
</div>
`,
    },
    /* ─────────────────────────── 15.4 ─────────────────────────── */
    {
      title: '15.4 — PowerShell for people who already know bash|||15.4 — PowerShell cho người đã biết bash',
      slug: 'lnx-15-4-powershell-cho-nguoi-biet-bash',
      type: 'LESSON',
      isFreePreview: true,
      description: 'PowerShell chuyền đối tượng qua ống dẫn thay vì chữ; bảng dịch bash → PowerShell; PowerShell 7 chạy thật trên Linux (đo trong container); && xét lệnh thành công chứ không xét True/False; script .ps1 có tham số và mã thoát; execution policy; và khi nào dùng bash, WSL, Git Bash hay PowerShell.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Lesson 15.4</span>
<h2>PowerShell for people who already know bash</h2>
<p class="lead">Sooner or later you will need to automate something on Windows itself — a teammate's setup script, a Windows service, a build on a Windows CI runner — and the native tool there is PowerShell. You do not have to start from zero: pipes, variables, exit codes and "read the error" all carry over. What changes is one big idea — PowerShell pipes <em>objects</em>, not text — plus a vocabulary of long, regular command names. All PowerShell output in this lesson is real, from <strong>PowerShell 7.6.6</strong> (the official <code>linux-arm64</code> build) running inside the course's Ubuntu 24.04 container; PowerShell 7 is cross-platform, so the language behaves the same on Windows, macOS and Linux. Windows-only behaviour (aliases, execution policy defaults) is quoted from Microsoft's documentation and marked as such.</p>

<h3>The one idea: objects in the pipe, not lines of text</h3>
${slide('lx-15', 23, 'PowerShell chuyền ĐỐI TƯỢNG qua ống, không phải chữ')}
<p>Everything in Chapter 3 rests on text: <code>ls -l</code> prints lines, and <code>sort -k5 -n</code> and <code>awk '{print \$9}'</code> work because you <em>know</em> that column 5 is the size and column 9 the name. It works — until a file name contains a space, or <code>ls</code> on another system prints a different number of columns. Here is "the biggest file in <code>logs</code>" both ways, measured in the container:</p>
<pre><code class="language-bash">ls -l logs | sort -k5 -n | tail -1 | awk '{print \$9}'           <span class="tok-comment"># bash: parse text</span></code></pre>
<pre><code class="language-powershell">Get-ChildItem logs | Sort-Object Length | Select-Object -Last 1 | ForEach-Object Name</code></pre>
<div class="out">big.log
big.log</div>
<p>Same answer, different mechanism. <code>Get-ChildItem</code> does not print anything to the pipe — it emits <strong>.NET objects</strong>, each with named properties, and only turns them into text at the very end, for your screen. <code>Sort-Object Length</code> sorts by the <em>property</em> called Length; nothing is guessed from a column position. You can ask any object what it is and what it has:</p>
<pre><code class="language-powershell">(Get-ChildItem logs)[0].GetType().FullName
Get-ChildItem logs | Get-Member -MemberType Property | Select-Object -First 5 -ExpandProperty Name</code></pre>
<div class="out">System.IO.FileInfo
Attributes
CreationTime
CreationTimeUtc
Directory
DirectoryName</div>
<div class="callout ok"><strong><code>Get-Member</code> is <code>man</code> for an object.</strong> Whenever you wonder "what can I sort or filter this by?", pipe it to <code>Get-Member</code>. That habit replaces most of the "which column was that?" work you do with <code>awk</code> and <code>cut</code> in bash.</div>
<p>The flip side: an <em>external</em> program still produces text, even in PowerShell. On Linux, <code>ls</code> inside PowerShell is <code>/usr/bin/ls</code>, and what comes out is strings:</p>
<pre><code class="language-powershell">(ls /tmp/logs).GetType().FullName
ls /tmp/logs | ForEach-Object { \$_.GetType().Name } | Select-Object -First 1</code></pre>
<div class="out">System.Object[]
String</div>

<h3>The translation table</h3>
${slide('lx-15', 24, 'Bảng dịch bash → PowerShell')}
<p>PowerShell commands (<em>cmdlets</em>) are named <strong>Verb-Noun</strong> — <code>Get-Process</code>, <code>Stop-Process</code>, <code>Get-Content</code> — so once you know the pattern you can guess names, and <code>Get-Command -Noun Process</code> lists them all (<code>Debug-Process, Get-Process, Start-Process, Stop-Process, Switch-Process, Wait-Process</code> in the container). Parameters are named too, and can be shortened as long as they stay unambiguous.</p>
<table>
<tr><th>Task</th><th>bash</th><th>PowerShell</th></tr>
<tr><td>List files (incl. hidden)</td><td><code>ls -la</code></td><td><code>Get-ChildItem -Force</code></td></tr>
<tr><td>Recursive find by name</td><td><code>find . -name '*.log'</code></td><td><code>Get-ChildItem -Recurse -Filter *.log</code></td></tr>
<tr><td>Read · last 20 lines · follow</td><td><code>cat f</code> · <code>tail -n 20 f</code> · <code>tail -f f</code></td><td><code>Get-Content f</code> · <code>Get-Content f -Tail 20</code> · <code>Get-Content f -Wait</code></td></tr>
<tr><td>Search text</td><td><code>grep -n ERROR app.log</code></td><td><code>Select-String ERROR app.log</code></td></tr>
<tr><td>Filter · pick fields</td><td><code>awk '\$5 &gt; 100'</code> · <code>cut -d, -f1</code></td><td><code>Where-Object Length -gt 100</code> · <code>Select-Object Name, Length</code></td></tr>
<tr><td>Sort · first/last N</td><td><code>sort -n</code> · <code>head</code>/<code>tail</code></td><td><code>Sort-Object</code> · <code>Select-Object -First/-Last N</code></td></tr>
<tr><td>Count · sum</td><td><code>wc -l</code> · <code>awk '{s+=\$1} END{print s}'</code></td><td><code>Measure-Object -Line</code> · <code>Measure-Object Length -Sum</code></td></tr>
<tr><td>Loop over items</td><td><code>while read l; do …; done</code></td><td><code>ForEach-Object { … \$_ … }</code></td></tr>
<tr><td>Processes · kill</td><td><code>ps aux</code> · <code>kill PID</code></td><td><code>Get-Process</code> · <code>Stop-Process -Id PID</code></td></tr>
<tr><td>HTTP + JSON</td><td><code>curl -s URL | jq .name</code></td><td><code>(Invoke-RestMethod URL).name</code></td></tr>
<tr><td>Make JSON</td><td><code>jq -n …</code></td><td><code>… | ConvertTo-Json</code></td></tr>
<tr><td>Environment · PATH</td><td><code>export X=1</code> · <code>\$PATH</code></td><td><code>\$env:X = 1</code> · <code>\$env:PATH</code> (separator <code>;</code> on Windows, <code>:</code> on Linux/macOS)</td></tr>
<tr><td>Variables · string interpolation</td><td><code>x=5; echo "\$((x+1))"</code></td><td><code>\$x = 5; "x+1=\$(\$x + 1)"</code></td></tr>
<tr><td>Exit status</td><td><code>\$?</code> (a number)</td><td><code>\$LASTEXITCODE</code> (number, external programs) · <code>\$?</code> (True/False)</td></tr>
<tr><td>What is this command · help</td><td><code>type -a</code> · <code>man</code></td><td><code>Get-Command</code> · <code>Get-Help</code> · <code>Get-Member</code></td></tr>
<tr><td>Run the next command only on success</td><td><code>a &amp;&amp; b</code></td><td><code>a &amp;&amp; b</code> — PowerShell 7 and later only</td></tr>
</table>
<p>Two details that trip bash users: comparison operators are words (<code>-eq</code>, <code>-ne</code>, <code>-gt</code>, <code>-lt</code>, <code>-like</code>, <code>-match</code>), because <code>&gt;</code> is redirection — the same reason bash's <code>[</code> uses <code>-gt</code> (Lesson 6.4). And the escape character is the backtick (<code>&#96;n</code> is a newline), not the backslash — which is why Windows paths like <code>C:\\Users</code> need no escaping.</p>

<h3>PowerShell 7 running for real on Linux</h3>
${slide('lx-15', 25, 'PowerShell 7 chạy thật trên Linux: đo trong container')}
<p>Microsoft publishes PowerShell 7 for Windows, macOS and Linux; the executable is <code>pwsh</code>, a name chosen, per Microsoft's "Differences between Windows PowerShell 5.1 and PowerShell 7.x", to support "side-by-side installations of Windows PowerShell and PowerShell". So a Windows machine usually has two: the built-in <strong>Windows PowerShell 5.1</strong> (<code>powershell.exe</code>, blue window) and, if installed, <strong>PowerShell 7</strong> (<code>pwsh.exe</code>). Everything in this lesson targets 7. The course installed it in the Ubuntu container because the <code>mcr.microsoft.com/powershell</code> image has no arm64 build (its manifest lists only amd64, arm and Windows); on your Mac, <code>brew info powershell</code> reports <code>powershell: stable 7.6.6 (bottled)</code>.</p>
<pre><code class="language-powershell">Select-String ERROR logs/app.log
Get-ChildItem logs | Where-Object Length -gt 100 | ForEach-Object Name
Get-ChildItem logs | Measure-Object Length -Sum | Select-Object Count, Sum
Get-Content logs/app.log | Select-String ERROR | ForEach-Object { \$_.Line.Split(" ", 2)[1] }</code></pre>
<div class="out">logs/app.log:2:ERROR db timeout
logs/app.log:4:ERROR disk full
big.log
Count     Sum
-----     ---
    2 2053.00
db timeout
disk full</div>
<p>JSON goes both ways without <code>jq</code>. <code>Invoke-RestMethod</code> parses the response into an object, so you navigate it with dots; <code>ConvertTo-Json</code> turns objects back into text:</p>
<pre><code class="language-powershell">Get-ChildItem logs | Select-Object Name, Length | ConvertTo-Json
\$r = Invoke-RestMethod https://api.github.com/repos/PowerShell/PowerShell
\$r.full_name; \$r.license.spdx_id; \$r.GetType().Name</code></pre>
<div class="out">[
  {
    "Name": "app.log",
    "Length": 52
  },
  {
    "Name": "big.log",
    "Length": 2001
  }
]
PowerShell/PowerShell
MIT
PSCustomObject</div>
<p>And variables cross the boundary the way Chapter 8 taught: <code>\$env:APP_ENV = "prod"; bash -c 'echo \$APP_ENV'</code> printed <code>prod</code> — <code>\$env:</code> variables are real environment variables, inherited by child processes of any kind.</p>

<h3>&amp;&amp; checks whether the command succeeded — not whether it printed True</h3>
${slide('lx-15', 26, '&& của PowerShell xét LỆNH chạy được, không xét True/False')}
<p>Microsoft's <code>about_Pipeline_Chain_Operators</code>: "Beginning in PowerShell 7, PowerShell implements the <code>&amp;&amp;</code> and <code>||</code> operators", and "these operators use the <code>\$?</code> and <code>\$LASTEXITCODE</code> variables to determine if a pipeline failed". Read that carefully, because a bash user's instinct produces this, measured:</p>
<pre><code class="language-powershell">Test-Path /khongco &amp;&amp; "co" || "khong"
if (Test-Path /khongco) { "co" } else { "khong" }</code></pre>
<div class="out">False
co
khong</div>
<p><code>Test-Path</code> <em>ran successfully</em> — its job is to answer, and it answered <code>False</code> — so <code>\$?</code> is True and <code>&amp;&amp;</code> continues. In bash, <code>[ -e /khongco ]</code> <em>fails</em> when the file is missing (exit 1), so the bash idiom works; in PowerShell the answer is data, and data goes through <code>if</code>. For external programs the rule is the familiar one:</p>
<pre><code class="language-powershell">/bin/false; \$?
/bin/false &amp;&amp; "chay"; "rc=\$LASTEXITCODE"</code></pre>
<div class="out">False
rc=1</div>
<p>A second trap is aliases. On Windows, PowerShell defines <code>ls</code>, <code>dir</code>, <code>cat</code>, <code>sort</code>… as aliases for cmdlets, so <code>ls</code> returns objects. On Linux and macOS, PowerShell deliberately does <em>not</em> define aliases that would hide real system commands — measured in the container:</p>
<pre><code class="language-powershell">Get-Command ls, Get-ChildItem
Get-Alias cat
Get-Alias dir, gci, echo</code></pre>
<div class="out">CommandType Name          Source
----------- ----          ------
Application ls            /usr/bin/ls
     Cmdlet Get-ChildItem Microsoft.PowerShell.Management
Get-Alias: This command cannot find a matching alias because an alias with the name 'cat' does not exist.
Name Definition
---- ----------
dir  Get-ChildItem
gci  Get-ChildItem
echo Write-Output</div>
<p>(Error line shortened; PowerShell prints it with a line/column frame.) So <code>ls | Sort-Object Length</code> sorts objects on Windows and sorts <em>strings</em> on Linux. A <code>.ps1</code> meant to run everywhere spells out full cmdlet names — which is also what the PowerShell linter PSScriptAnalyzer asks for (it flags aliases used in scripts).</p>

<h3>Writing and running a .ps1 script</h3>
${slide('lx-15', 27, 'Chạy script .ps1: tham số, mã thoát, execution policy')}
<p>A PowerShell script declares its parameters with <code>param()</code> — typed, named and defaulted, with no <code>getopts</code> loop to write (compare Lesson 7.2):</p>
<pre><code class="language-powershell"># dem-loi.ps1
param(
  [string]\$Path = 'logs/app.log',
  [int]\$Top = 5
)
\$loi = Select-String -Path \$Path -Pattern 'ERROR'
if (-not \$loi) { Write-Error "Khong co dong ERROR trong \$Path"; exit 1 }
\$loi | Select-Object -First \$Top | ForEach-Object Line
"Tong: \$(\$loi.Count)"</code></pre>
<pre><code class="language-bash">pwsh -File dem-loi.ps1 -Top 1; echo "rc=\$?"                  <span class="tok-comment"># called from bash</span>
pwsh -File dem-loi.ps1 -Path logs/sach.log; echo "rc=\$?"</code></pre>
<div class="out">ERROR db timeout
Tong: 2
rc=0
Write-Error: Khong co dong ERROR trong logs/sach.log
rc=1</div>
<p><code>exit 1</code> sets the process exit code exactly as in bash, so a <code>.ps1</code> slots into a CI pipeline or a <code>bash &amp;&amp;</code> chain. <code>Write-Error</code> goes to the error stream — PowerShell's stderr. On Linux and macOS you can even give a <code>.ps1</code> a shebang, <code>#!/usr/bin/env pwsh</code>, <code>chmod +x</code> it, and run it like any script.</p>
<p><strong>Execution policy.</strong> On Windows, the first <code>.ps1</code> a student runs often fails because scripts are disabled. Microsoft's <code>about_Execution_Policies</code> (read 09/2026):</p>
<table>
<tr><th>Policy</th><th>Meaning</th><th>Default where</th></tr>
<tr><td><code>Restricted</code></td><td>"Permits individual commands, but doesn't allow scripts"</td><td>Windows PowerShell 5.1 on Windows <strong>client</strong> computers</td></tr>
<tr><td><code>RemoteSigned</code></td><td>Scripts downloaded from the internet must be signed (or unblocked); local ones run</td><td>Windows servers; and the 7.6 page lists it as "the default execution policy for Windows computers"</td></tr>
<tr><td><code>AllSigned</code></td><td>Every script must be signed by a trusted publisher</td><td>—</td></tr>
<tr><td><code>Bypass</code></td><td>Nothing blocked, no prompts</td><td>for apps embedding PowerShell</td></tr>
<tr><td><code>Unrestricted</code></td><td>Unsigned scripts run; warns for files from outside the intranet</td><td>"The default execution policy for non-Windows computers and can't be changed"</td></tr>
</table>
<pre><code class="language-powershell">Get-ExecutionPolicy -List                                  # every scope, highest precedence first
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser         # no Administrator needed
Unblock-File .\\setup.ps1                                   # clear the "downloaded from the internet" mark</code></pre>
<p>On Linux, measured: <code>Get-ExecutionPolicy -List</code> shows <code>Unrestricted</code> for all five scopes (MachinePolicy, UserPolicy, Process, CurrentUser, LocalMachine), matching Microsoft's note that the setting is not enforced outside Windows.</p>
<div class="pitfall co-tieu-de"><strong>Do not "fix" a blocked script by opening the whole machine.</strong> The advice most often pasted into group chats is <code>Set-ExecutionPolicy Unrestricted</code> as Administrator. It works, and it is the wrong lesson. Microsoft's own documentation says "the execution policy isn't a security boundary, it's defense in depth" — it exists to stop you running a script <em>by accident</em>, and anyone can bypass it on purpose. The proportionate fix is <code>Set-ExecutionPolicy RemoteSigned -Scope CurrentUser</code> (your account only, no admin), plus <code>Unblock-File</code> for one script you downloaded and actually read. The same instinct from Chapter 4 applies: do not reach for the biggest hammer (<code>chmod 777</code>, <code>sudo</code>, <code>Unrestricted</code>) because the error message was annoying.</div>

<h3>When to use which</h3>
${slide('lx-15', 28, 'Khi nào dùng cái nào — bash, WSL2, Git Bash, PowerShell, zsh + Homebrew')}
<table>
<tr><th>Job</th><th>Use</th><th>Why</th></tr>
<tr><td>Deploy script for the Ubuntu VPS</td><td>bash, <code>#!/usr/bin/env bash</code></td><td>the server has bash; Chapters 7 and 13</td></tr>
<tr><td>Learning this course on a Windows laptop</td><td>WSL2 + Ubuntu</td><td>real Linux; outputs match the lessons</td></tr>
<tr><td>Only git and a few commands on Windows</td><td>Git Bash</td><td>light, comes with Git for Windows</td></tr>
<tr><td>Automating Windows itself (services, registry, users, Office, Azure)</td><td>PowerShell 7</td><td>.NET objects and Windows cmdlets that bash does not have</td></tr>
<tr><td>Setting up a Mac for the team</td><td>zsh + Homebrew + Brewfile</td><td><code>brew bundle install</code> in one command</td></tr>
<tr><td>A script every teammate runs on Mac, Linux and WSL</td><td>bash ≥ 4 with feature detection</td><td>check <code>BASH_VERSINFO</code>, <code>gsed</code>/<code>sed</code> (Lesson 15.1)</td></tr>
<tr><td>Structured data (JSON, CSV) gets complicated</td><td>PowerShell or Python</td><td>once you are writing <code>awk</code> to parse JSON, you have outgrown text pipes</td></tr>
</table>
<p>Bash is not "worse" than PowerShell or the other way round; they sit on different operating systems' strengths. Bash is the language of Linux servers, containers and CI images, where everything is a text file. PowerShell is the language of Windows administration, where everything is an object behind an API. Knowing both at the level of this lesson means you can read a teammate's script on either side and translate the two or three lines you need.</p>

<h3>Flag table: PowerShell parameters you use constantly</h3>
<table>
<tr><th>Cmdlet · parameter</th><th>Meaning</th><th>bash analogue</th></tr>
<tr><td><code>Get-ChildItem -Recurse -Filter *.log -Force</code></td><td>recursive · pattern · include hidden</td><td><code>find . -name '*.log'</code> · <code>ls -a</code></td></tr>
<tr><td><code>Get-Content -Tail 20 -Wait</code></td><td>last lines · keep following</td><td><code>tail -n 20 -f</code></td></tr>
<tr><td><code>Select-String -Pattern X -Path F -NotMatch -CaseSensitive</code></td><td>regex search, invert, case-sensitive (default is insensitive!)</td><td><code>grep -v</code>; bash <code>grep</code> is case-sensitive by default</td></tr>
<tr><td><code>Select-Object -First N -Last N -ExpandProperty P</code></td><td>take items · unwrap one property to plain values</td><td><code>head</code> · <code>tail</code> · <code>cut</code></td></tr>
<tr><td><code>Sort-Object P -Descending -Unique</code></td><td>sort by property</td><td><code>sort -r -u</code></td></tr>
<tr><td><code>Measure-Object P -Sum -Average -Line</code></td><td>count and aggregate</td><td><code>wc</code>, <code>awk</code></td></tr>
<tr><td><code>Where-Object P -gt V</code> · <code>{ \$_.P -gt V }</code></td><td>filter (short and full form)</td><td><code>awk</code> condition</td></tr>
<tr><td><code>-ErrorAction Stop</code> · <code>SilentlyContinue</code></td><td>make an error terminating · hide it</td><td><code>set -e</code> · <code>2&gt;/dev/null</code></td></tr>
<tr><td><code>-WhatIf</code> · <code>-Confirm</code></td><td>show what would happen · ask first (on cmdlets that change things)</td><td>a <code>--dry-run</code> flag you write yourself</td></tr>
</table>
<div class="callout warn"><code>Select-String</code> is <strong>case-insensitive by default</strong>, the opposite of <code>grep</code>. <code>Select-String error app.log</code> matches <code>ERROR</code>, <code>Error</code> and <code>error</code>; add <code>-CaseSensitive</code> for grep's behaviour. PowerShell comparison operators (<code>-eq</code>, <code>-like</code>, <code>-match</code>) are case-insensitive too; the <code>-c</code> versions (<code>-ceq</code>, <code>-cmatch</code>) are not.</div>

<h3>Try it step by step</h3>
<p>No Windows needed. On a Mac: <code>brew install powershell</code>, then <code>pwsh</code>. Or in a container, as the course did: install the <code>linux-arm64</code> (or <code>linux-x64</code>) tarball from the PowerShell GitHub releases. Then, one line at a time:</p>
<pre><code class="language-powershell">Set-Location /tmp; New-Item -ItemType Directory -Force logs | Out-Null
"INFO start&#96;nERROR db timeout&#96;nINFO ok&#96;nERROR disk full" | Set-Content logs/app.log
"x" * 2000 | Set-Content logs/big.log
"INFO only" | Set-Content logs/sach.log
\$PSVersionTable.PSVersion.ToString()
(Get-ChildItem logs).Count
Get-ChildItem logs | Sort-Object Length -Descending | Select-Object -First 1 -ExpandProperty Name
Select-String -Pattern ERROR -Path logs/app.log | ForEach-Object LineNumber
(Get-Content logs/app.log | Measure-Object -Line).Lines
\$x = 5; "x=\$x, x+1=\$(\$x + 1)"
@(3,1,2) | Sort-Object | Join-String -Separator ','</code></pre>
<div class="out">7.6.6
3
big.log
2
4
4
x=5, x+1=6
1,2,3</div>
<p>What to notice: <code>-ExpandProperty</code> gives you the bare name instead of a one-column table; <code>LineNumber</code> is a property of each match, so there is no <code>cut -d:</code>; the backtick <code>&#96;n</code> is PowerShell's newline. Then do the same three questions in bash (<code>ls -S logs | head -1</code>, <code>grep -n ERROR logs/app.log | cut -d: -f1</code>, <code>wc -l &lt; logs/app.log</code>) and compare which one you would rather maintain.</p>

<h3>On macOS, Linux and WSL</h3>
<p>PowerShell 7 behaves the same language-wise everywhere; what differs is the environment around it. On macOS and Linux: no Windows-style aliases (<code>ls</code> is <code>/usr/bin/ls</code>), <code>\$env:PATH</code> uses <code>:</code>, paths use <code>/</code>, the profile is <code>~/.config/powershell/Microsoft.PowerShell_profile.ps1</code> (measured: <code>\$PROFILE</code> printed <code>/root/.config/powershell/Microsoft.PowerShell_profile.ps1</code> as root in the container), and execution policy is always Unrestricted. Inside WSL you can call the <em>Windows</em> PowerShell from Linux as <code>powershell.exe -c '…'</code> — handy for asking Windows something (a clipboard via <code>Set-Clipboard</code>, an environment variable) from a bash script, per Microsoft's interop rules in Lesson 15.3.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your team's log-summary script is bash, and the teammate who runs the Windows CI runner asks for a PowerShell version. Write it, and prove both give the same answer.</p><ol>
<li>In <code>~/thu-linux/ps15</code> (or a container with <code>pwsh</code>), create <code>logs/app.log</code> with at least six lines mixing <code>INFO</code>, <code>WARN</code> and <code>ERROR</code>, and a second, larger log file.</li>
<li>In bash, print: the number of <code>ERROR</code> lines, the line numbers of those lines, and the name of the largest file in <code>logs</code>.</li>
<li>Write <code>tom-tat.ps1</code> with <code>param([string]\$Dir = 'logs')</code> that prints the same three answers using <code>Select-String</code>, <code>Measure-Object</code> and <code>Sort-Object</code>, and finally the same data as JSON with <code>ConvertTo-Json</code>. Make it <code>exit 1</code> when the directory has no <code>.log</code> files.</li>
<li>Run it with <code>pwsh -File tom-tat.ps1</code> and with <code>-Dir /khongco</code>, printing <code>echo rc=\$?</code> each time.</li></ol>
<p><strong>Done when:</strong> the bash and PowerShell answers match number for number, the JSON parses (<code>pwsh -File tom-tat.ps1 | tail -n +4 | jq .</code> or your own split), the missing directory gives <code>rc=1</code>, and you can say why <code>Select-String error</code> would have counted more lines than <code>grep error</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cmdlet</span><span class="v">A built-in PowerShell command named Verb-Noun, e.g. <code>Get-ChildItem</code>.</span></div>
  <div class="kv"><span class="k">Object pipeline</span><span class="v">Pipes carry .NET objects with named properties, not lines of text.</span></div>
  <div class="kv"><span class="k">Property</span><span class="v">A named field of an object (<code>Name</code>, <code>Length</code>) you sort, filter and select by.</span></div>
  <div class="kv"><span class="k">Get-Member</span><span class="v">Lists an object's type, properties and methods — "man" for an object.</span></div>
  <div class="kv"><span class="k">pwsh / powershell.exe</span><span class="v">PowerShell 7 (cross-platform) / Windows PowerShell 5.1 (Windows only, built in).</span></div>
  <div class="kv"><span class="k">\$LASTEXITCODE</span><span class="v">Exit code of the last external program; <code>\$?</code> is only True/False.</span></div>
  <div class="kv"><span class="k">Execution policy</span><span class="v">Windows setting that controls whether scripts run; a safety net, not a security boundary.</span></div>
  <div class="kv"><span class="k">Pipeline chain operators</span><span class="v"><code>&amp;&amp;</code> and <code>||</code>, added in PowerShell 7; they test success, not True/False output.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>PowerShell pipes objects: sort, filter and select by property name instead of parsing columns; <code>Get-Member</code> shows what an object has.</li>
<li>Cmdlets are Verb-Noun (<code>Get-ChildItem</code>, <code>Select-String</code>, <code>Where-Object</code>, <code>Sort-Object</code>, <code>Measure-Object</code>, <code>Invoke-RestMethod</code>).</li>
<li>PowerShell 7 (<code>pwsh</code>) runs on Windows, macOS and Linux side by side with Windows PowerShell 5.1.</li>
<li><code>&amp;&amp;</code>/<code>||</code> (PowerShell 7+) test whether a command succeeded; <code>Test-Path x &amp;&amp; …</code> continues on <code>False</code> — use <code>if</code>.</li>
<li>Aliases like <code>ls</code>/<code>cat</code> exist only on Windows; portable <code>.ps1</code> files use full cmdlet names. <code>Select-String</code> ignores case by default.</li>
<li>Blocked scripts on Windows: <code>Set-ExecutionPolicy RemoteSigned -Scope CurrentUser</code> and <code>Unblock-File</code>, never machine-wide <code>Unrestricted</code>.</li>
</ul>

<a class="link-card" href="https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipelines" target="_blank" rel="noopener">
  <span class="lc-ico">🔷</span>
  <span class="lc-body"><span class="lc-title">Microsoft Learn — about_Pipelines</span><span class="lc-sub">How objects flow through a PowerShell pipeline, and how parameters bind to them.</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipeline_chain_operators" target="_blank" rel="noopener">
  <span class="lc-ico">⛓</span>
  <span class="lc-body"><span class="lc-title">Microsoft Learn — about_Pipeline_Chain_Operators</span><span class="lc-sub"><code>&amp;&amp;</code> and <code>||</code> since PowerShell 7, and exactly how "success" is decided.</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies" target="_blank" rel="noopener">
  <span class="lc-ico">🛡</span>
  <span class="lc-body"><span class="lc-title">Microsoft Learn — about_Execution_Policies</span><span class="lc-sub">Every policy, its defaults, scopes and precedence, and why it is not a security boundary.</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/powershell/scripting/whats-new/differences-from-windows-powershell" target="_blank" rel="noopener">
  <span class="lc-ico">🆚</span>
  <span class="lc-body"><span class="lc-title">Microsoft Learn — Windows PowerShell 5.1 vs PowerShell 7.x</span><span class="lc-sub">Why the binary is <code>pwsh</code>, what changed, and what to expect when a teammate still uses the blue window.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice on Code Lab</span><span class="lc-sub">The Linux &amp; Bash track — the text-pipeline skills you just translated, graded automatically.</span></span>
</a>

<p class="note-ct"><strong>The fastest way into any unfamiliar PowerShell:</strong> <code>Get-Command *keyword*</code> to find the cmdlet, <code>Get-Help Name -Examples</code> for usage, and <code>… | Get-Member</code> to see what came out. Those three are to PowerShell what <code>apropos</code>, <code>man</code> and "pipe it to <code>head</code> and look" are to bash.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Bài 15.4</span>
<h2>PowerShell cho người đã biết bash</h2>
<p class="lead">Sớm muộn gì bạn cũng cần tự động hoá một thứ trên chính Windows — script cài đặt của bạn cùng nhóm, một dịch vụ Windows, một lần build trên máy CI chạy Windows — và công cụ bản địa ở đó là PowerShell. Bạn không phải bắt đầu từ số 0: ống dẫn, biến, mã thoát và thói quen "đọc lỗi" đều mang sang được. Thứ đổi là MỘT ý tưởng lớn — PowerShell chuyền <em>ĐỐI TƯỢNG</em> qua ống dẫn, không phải chữ — cộng một bộ từ vựng gồm các tên lệnh dài và đều đặn. Mọi output PowerShell trong bài là THẬT, từ <strong>PowerShell 7.6.6</strong> (bản <code>linux-arm64</code> chính thức) chạy trong container Ubuntu 24.04 của khoá; PowerShell 7 chạy đa nền tảng, nên ngôn ngữ cư xử giống nhau trên Windows, macOS và Linux. Hành vi chỉ Windows có (bí danh, mặc định của execution policy) được trích từ tài liệu Microsoft và ghi rõ như vậy.</p>

<h3>Một ý tưởng: đối tượng trong ống dẫn, không phải dòng chữ</h3>
${slide('lx-15', 23, 'PowerShell chuyền ĐỐI TƯỢNG qua ống, không phải chữ')}
<p>Mọi thứ ở Chương 3 đứng trên chữ: <code>ls -l</code> in ra các dòng, và <code>sort -k5 -n</code> với <code>awk '{print \$9}'</code> chạy được vì bạn <em>BIẾT</em> cột 5 là cỡ file, cột 9 là tên. Nó chạy — cho tới khi tên file có dấu cách, hoặc <code>ls</code> trên một hệ khác in số cột khác. Đây là "file lớn nhất trong <code>logs</code>" theo cả hai cách, đo trong container:</p>
<pre><code class="language-bash">ls -l logs | sort -k5 -n | tail -1 | awk '{print \$9}'           <span class="tok-comment"># bash: phân tích chữ</span></code></pre>
<pre><code class="language-powershell">Get-ChildItem logs | Sort-Object Length | Select-Object -Last 1 | ForEach-Object Name</code></pre>
<div class="out">big.log
big.log</div>
<p>Cùng đáp án, khác cơ chế. <code>Get-ChildItem</code> không in gì vào ống dẫn — nó phát ra các <strong>đối tượng .NET</strong>, mỗi cái có thuộc tính mang tên, và chỉ biến chúng thành chữ ở tận cuối, cho màn hình của bạn. <code>Sort-Object Length</code> sắp theo <em>THUỘC TÍNH</em> tên Length; chẳng có gì phải đoán từ vị trí cột. Bạn có thể hỏi bất kỳ đối tượng nào xem nó là gì và có gì:</p>
<pre><code class="language-powershell">(Get-ChildItem logs)[0].GetType().FullName
Get-ChildItem logs | Get-Member -MemberType Property | Select-Object -First 5 -ExpandProperty Name</code></pre>
<div class="out">System.IO.FileInfo
Attributes
CreationTime
CreationTimeUtc
Directory
DirectoryName</div>
<div class="callout ok"><strong><code>Get-Member</code> là <code>man</code> của một đối tượng.</strong> Mỗi khi bạn thắc mắc "sắp hay lọc cái này theo gì được?", hãy chuyền nó sang <code>Get-Member</code>. Thói quen đó thay phần lớn công việc "cột đó là cột mấy nhỉ?" mà bạn làm bằng <code>awk</code> và <code>cut</code> trong bash.</div>
<p>Mặt trái: một chương trình <em>BÊN NGOÀI</em> vẫn cho ra chữ, kể cả trong PowerShell. Trên Linux, <code>ls</code> bên trong PowerShell là <code>/usr/bin/ls</code>, và thứ đi ra là chuỗi:</p>
<pre><code class="language-powershell">(ls /tmp/logs).GetType().FullName
ls /tmp/logs | ForEach-Object { \$_.GetType().Name } | Select-Object -First 1</code></pre>
<div class="out">System.Object[]
String</div>

<h3>Bảng dịch</h3>
${slide('lx-15', 24, 'Bảng dịch bash → PowerShell')}
<p>Lệnh PowerShell (<em>cmdlet</em>) đặt tên theo kiểu <strong>Động từ-Danh từ</strong> — <code>Get-Process</code>, <code>Stop-Process</code>, <code>Get-Content</code> — nên biết quy luật rồi là đoán được tên, và <code>Get-Command -Noun Process</code> liệt kê hết (trong container: <code>Debug-Process, Get-Process, Start-Process, Stop-Process, Switch-Process, Wait-Process</code>). Tham số cũng có tên, và được viết tắt miễn là không lẫn với tham số khác.</p>
<table>
<tr><th>Việc</th><th>bash</th><th>PowerShell</th></tr>
<tr><td>Liệt kê file (kể cả ẩn)</td><td><code>ls -la</code></td><td><code>Get-ChildItem -Force</code></td></tr>
<tr><td>Tìm đệ quy theo tên</td><td><code>find . -name '*.log'</code></td><td><code>Get-ChildItem -Recurse -Filter *.log</code></td></tr>
<tr><td>Đọc · 20 dòng cuối · bám theo</td><td><code>cat f</code> · <code>tail -n 20 f</code> · <code>tail -f f</code></td><td><code>Get-Content f</code> · <code>Get-Content f -Tail 20</code> · <code>Get-Content f -Wait</code></td></tr>
<tr><td>Tìm chữ</td><td><code>grep -n ERROR app.log</code></td><td><code>Select-String ERROR app.log</code></td></tr>
<tr><td>Lọc · lấy trường</td><td><code>awk '\$5 &gt; 100'</code> · <code>cut -d, -f1</code></td><td><code>Where-Object Length -gt 100</code> · <code>Select-Object Name, Length</code></td></tr>
<tr><td>Sắp · N đầu/cuối</td><td><code>sort -n</code> · <code>head</code>/<code>tail</code></td><td><code>Sort-Object</code> · <code>Select-Object -First/-Last N</code></td></tr>
<tr><td>Đếm · cộng</td><td><code>wc -l</code> · <code>awk '{s+=\$1} END{print s}'</code></td><td><code>Measure-Object -Line</code> · <code>Measure-Object Length -Sum</code></td></tr>
<tr><td>Lặp qua từng mục</td><td><code>while read l; do …; done</code></td><td><code>ForEach-Object { … \$_ … }</code></td></tr>
<tr><td>Tiến trình · diệt</td><td><code>ps aux</code> · <code>kill PID</code></td><td><code>Get-Process</code> · <code>Stop-Process -Id PID</code></td></tr>
<tr><td>HTTP + JSON</td><td><code>curl -s URL | jq .name</code></td><td><code>(Invoke-RestMethod URL).name</code></td></tr>
<tr><td>Tạo JSON</td><td><code>jq -n …</code></td><td><code>… | ConvertTo-Json</code></td></tr>
<tr><td>Biến môi trường · PATH</td><td><code>export X=1</code> · <code>\$PATH</code></td><td><code>\$env:X = 1</code> · <code>\$env:PATH</code> (ngăn cách <code>;</code> trên Windows, <code>:</code> trên Linux/macOS)</td></tr>
<tr><td>Biến · chèn vào chuỗi</td><td><code>x=5; echo "\$((x+1))"</code></td><td><code>\$x = 5; "x+1=\$(\$x + 1)"</code></td></tr>
<tr><td>Trạng thái thoát</td><td><code>\$?</code> (một số)</td><td><code>\$LASTEXITCODE</code> (số, cho chương trình ngoài) · <code>\$?</code> (True/False)</td></tr>
<tr><td>Lệnh này là gì · trợ giúp</td><td><code>type -a</code> · <code>man</code></td><td><code>Get-Command</code> · <code>Get-Help</code> · <code>Get-Member</code></td></tr>
<tr><td>Chỉ chạy lệnh sau khi lệnh trước thành công</td><td><code>a &amp;&amp; b</code></td><td><code>a &amp;&amp; b</code> — chỉ từ PowerShell 7</td></tr>
</table>
<p>Hai chi tiết làm người quen bash vấp: toán tử so sánh là CHỮ (<code>-eq</code>, <code>-ne</code>, <code>-gt</code>, <code>-lt</code>, <code>-like</code>, <code>-match</code>), vì <code>&gt;</code> là chuyển hướng — cùng lý do <code>[</code> của bash dùng <code>-gt</code> (Bài 6.4). Và ký tự thoát là dấu backtick (<code>&#96;n</code> là xuống dòng), không phải gạch chéo ngược — nhờ vậy đường dẫn Windows như <code>C:\\Users</code> không cần thoát gì.</p>

<h3>PowerShell 7 chạy thật trên Linux</h3>
${slide('lx-15', 25, 'PowerShell 7 chạy thật trên Linux: đo trong container')}
<p>Microsoft phát hành PowerShell 7 cho Windows, macOS và Linux; tên chương trình là <code>pwsh</code>, một cái tên được chọn — theo trang "Differences between Windows PowerShell 5.1 and PowerShell 7.x" của Microsoft — để hỗ trợ "side-by-side installations of Windows PowerShell and PowerShell", tức cài song song hai bản. Vì thế một máy Windows thường có HAI: <strong>Windows PowerShell 5.1</strong> có sẵn (<code>powershell.exe</code>, cửa sổ xanh) và, nếu cài thêm, <strong>PowerShell 7</strong> (<code>pwsh.exe</code>). Mọi thứ trong bài nhắm tới bản 7. Khoá cài nó trong container Ubuntu vì ảnh <code>mcr.microsoft.com/powershell</code> không có bản arm64 (manifest của nó chỉ liệt kê amd64, arm và Windows); trên Mac của bạn, <code>brew info powershell</code> báo <code>powershell: stable 7.6.6 (bottled)</code>.</p>
<pre><code class="language-powershell">Select-String ERROR logs/app.log
Get-ChildItem logs | Where-Object Length -gt 100 | ForEach-Object Name
Get-ChildItem logs | Measure-Object Length -Sum | Select-Object Count, Sum
Get-Content logs/app.log | Select-String ERROR | ForEach-Object { \$_.Line.Split(" ", 2)[1] }</code></pre>
<div class="out">logs/app.log:2:ERROR db timeout
logs/app.log:4:ERROR disk full
big.log
Count     Sum
-----     ---
    2 2053.00
db timeout
disk full</div>
<p>JSON đi cả hai chiều mà không cần <code>jq</code>. <code>Invoke-RestMethod</code> phân tích phản hồi thành một đối tượng, nên bạn đi vào nó bằng dấu chấm; <code>ConvertTo-Json</code> biến đối tượng trở lại thành chữ:</p>
<pre><code class="language-powershell">Get-ChildItem logs | Select-Object Name, Length | ConvertTo-Json
\$r = Invoke-RestMethod https://api.github.com/repos/PowerShell/PowerShell
\$r.full_name; \$r.license.spdx_id; \$r.GetType().Name</code></pre>
<div class="out">[
  {
    "Name": "app.log",
    "Length": 52
  },
  {
    "Name": "big.log",
    "Length": 2001
  }
]
PowerShell/PowerShell
MIT
PSCustomObject</div>
<p>Và biến đi qua ranh giới đúng như Chương 8 đã dạy: <code>\$env:APP_ENV = "prod"; bash -c 'echo \$APP_ENV'</code> in ra <code>prod</code> — biến <code>\$env:</code> là biến môi trường thật, được mọi loại tiến trình con thừa hưởng.</p>

<h3>&amp;&amp; xét lệnh có thành công không — không xét nó in ra True hay False</h3>
${slide('lx-15', 26, '&& của PowerShell xét LỆNH chạy được, không xét True/False')}
<p>Trang <code>about_Pipeline_Chain_Operators</code> của Microsoft: "Beginning in PowerShell 7, PowerShell implements the <code>&amp;&amp;</code> and <code>||</code> operators" (có từ PowerShell 7), và "these operators use the <code>\$?</code> and <code>\$LASTEXITCODE</code> variables to determine if a pipeline failed" (chúng dựa vào <code>\$?</code> và <code>\$LASTEXITCODE</code> để biết một ống dẫn có hỏng không). Đọc kỹ câu đó, vì phản xạ của người quen bash cho ra thứ này, đo thật:</p>
<pre><code class="language-powershell">Test-Path /khongco &amp;&amp; "co" || "khong"
if (Test-Path /khongco) { "co" } else { "khong" }</code></pre>
<div class="out">False
co
khong</div>
<p><code>Test-Path</code> <em>ĐÃ CHẠY THÀNH CÔNG</em> — việc của nó là trả lời, và nó đã trả lời <code>False</code> — nên <code>\$?</code> là True và <code>&amp;&amp;</code> đi tiếp. Trong bash, <code>[ -e /khongco ]</code> <em>THẤT BẠI</em> khi không có file (mã thoát 1), nên thành ngữ bash chạy đúng; trong PowerShell câu trả lời là DỮ LIỆU, và dữ liệu thì đi qua <code>if</code>. Với chương trình bên ngoài, luật lại quen thuộc:</p>
<pre><code class="language-powershell">/bin/false; \$?
/bin/false &amp;&amp; "chay"; "rc=\$LASTEXITCODE"</code></pre>
<div class="out">False
rc=1</div>
<p>Cái bẫy thứ hai là bí danh (alias). Trên Windows, PowerShell định nghĩa <code>ls</code>, <code>dir</code>, <code>cat</code>, <code>sort</code>… là bí danh của cmdlet, nên <code>ls</code> trả về đối tượng. Trên Linux và macOS, PowerShell cố ý KHÔNG định nghĩa những bí danh sẽ che lệnh hệ thống thật — đo trong container:</p>
<pre><code class="language-powershell">Get-Command ls, Get-ChildItem
Get-Alias cat
Get-Alias dir, gci, echo</code></pre>
<div class="out">CommandType Name          Source
----------- ----          ------
Application ls            /usr/bin/ls
     Cmdlet Get-ChildItem Microsoft.PowerShell.Management
Get-Alias: This command cannot find a matching alias because an alias with the name 'cat' does not exist.
Name Definition
---- ----------
dir  Get-ChildItem
gci  Get-ChildItem
echo Write-Output</div>
<p>(Dòng lỗi được rút gọn; PowerShell in nó kèm khung dòng/cột.) Vậy <code>ls | Sort-Object Length</code> sắp ĐỐI TƯỢNG trên Windows và sắp CHUỖI trên Linux. Một file <code>.ps1</code> muốn chạy mọi nơi phải viết đầy đủ tên cmdlet — cũng chính là điều công cụ kiểm mã PSScriptAnalyzer của PowerShell đòi (nó cảnh báo bí danh dùng trong script).</p>

<h3>Viết và chạy một script .ps1</h3>
${slide('lx-15', 27, 'Chạy script .ps1: tham số, mã thoát, execution policy')}
<p>Script PowerShell khai tham số bằng <code>param()</code> — có kiểu, có tên, có mặc định, không phải viết vòng <code>getopts</code> nào (so với Bài 7.2):</p>
<pre><code class="language-powershell"># dem-loi.ps1
param(
  [string]\$Path = 'logs/app.log',
  [int]\$Top = 5
)
\$loi = Select-String -Path \$Path -Pattern 'ERROR'
if (-not \$loi) { Write-Error "Khong co dong ERROR trong \$Path"; exit 1 }
\$loi | Select-Object -First \$Top | ForEach-Object Line
"Tong: \$(\$loi.Count)"</code></pre>
<pre><code class="language-bash">pwsh -File dem-loi.ps1 -Top 1; echo "rc=\$?"                  <span class="tok-comment"># gọi từ bash</span>
pwsh -File dem-loi.ps1 -Path logs/sach.log; echo "rc=\$?"</code></pre>
<div class="out">ERROR db timeout
Tong: 2
rc=0
Write-Error: Khong co dong ERROR trong logs/sach.log
rc=1</div>
<p><code>exit 1</code> đặt mã thoát của tiến trình y như bash, nên một <code>.ps1</code> lắp vừa khít vào pipeline CI hay một chuỗi <code>&amp;&amp;</code> của bash. <code>Write-Error</code> đi vào luồng lỗi — stderr của PowerShell. Trên Linux và macOS bạn còn có thể cho <code>.ps1</code> một dòng shebang, <code>#!/usr/bin/env pwsh</code>, <code>chmod +x</code> nó, và chạy như mọi script.</p>
<p><strong>Execution policy (chính sách chạy script).</strong> Trên Windows, file <code>.ps1</code> đầu tiên một bạn sinh viên chạy thường hỏng vì script bị tắt. Trang <code>about_Execution_Policies</code> của Microsoft (đọc 09/2026):</p>
<table>
<tr><th>Chính sách</th><th>Nghĩa</th><th>Mặc định ở đâu</th></tr>
<tr><td><code>Restricted</code></td><td>"Permits individual commands, but doesn't allow scripts" — gõ lệnh lẻ được, chạy script thì không</td><td>Windows PowerShell 5.1 trên máy Windows <strong>khách</strong> (client)</td></tr>
<tr><td><code>RemoteSigned</code></td><td>Script tải từ Internet phải có chữ ký (hoặc được bỏ chặn); script viết tại máy thì chạy</td><td>Windows Server; và trang của bản 7.6 ghi nó là "the default execution policy for Windows computers"</td></tr>
<tr><td><code>AllSigned</code></td><td>Mọi script phải được ký bởi nhà phát hành tin cậy</td><td>—</td></tr>
<tr><td><code>Bypass</code></td><td>Không chặn gì, không hỏi gì</td><td>cho ứng dụng nhúng PowerShell</td></tr>
<tr><td><code>Unrestricted</code></td><td>Script không ký vẫn chạy; cảnh báo với file từ ngoài mạng nội bộ</td><td>"The default execution policy for non-Windows computers and can't be changed" — mặc định trên máy không phải Windows, không đổi được</td></tr>
</table>
<pre><code class="language-powershell">Get-ExecutionPolicy -List                                  # mọi phạm vi, ưu tiên cao nhất trước
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser         # không cần quyền Administrator
Unblock-File .\\setup.ps1                                   # bỏ dấu "tải từ Internet"</code></pre>
<p>Trên Linux, đo thật: <code>Get-ExecutionPolicy -List</code> hiện <code>Unrestricted</code> cho cả năm phạm vi (MachinePolicy, UserPolicy, Process, CurrentUser, LocalMachine), khớp với ghi chú của Microsoft rằng thiết lập này không được áp dụng ngoài Windows.</p>
<div class="pitfall co-tieu-de"><strong>Đừng "sửa" một script bị chặn bằng cách mở toang cả máy.</strong> Lời khuyên hay được dán vào nhóm chat nhất là <code>Set-ExecutionPolicy Unrestricted</code> chạy bằng Administrator. Nó chạy, và nó dạy sai bài học. Chính tài liệu của Microsoft nói "the execution policy isn't a security boundary, it's defense in depth" — nó không phải ranh giới bảo mật, chỉ là một lớp phòng thủ thêm, có để ngăn bạn chạy script <em>NHẦM</em>, và ai muốn cố ý thì vượt qua được. Cách sửa vừa tầm là <code>Set-ExecutionPolicy RemoteSigned -Scope CurrentUser</code> (chỉ tài khoản của bạn, không cần admin), cộng <code>Unblock-File</code> cho đúng một script bạn đã tải và đã ĐỌC. Cùng phản xạ ở Chương 4: đừng vớ lấy cái búa to nhất (<code>chmod 777</code>, <code>sudo</code>, <code>Unrestricted</code>) chỉ vì thông báo lỗi làm bạn bực.</div>

<h3>Khi nào dùng cái nào</h3>
${slide('lx-15', 28, 'Khi nào dùng cái nào — bash, WSL2, Git Bash, PowerShell, zsh + Homebrew')}
<table>
<tr><th>Việc</th><th>Dùng</th><th>Vì sao</th></tr>
<tr><td>Script deploy cho VPS Ubuntu</td><td>bash, <code>#!/usr/bin/env bash</code></td><td>máy chủ có bash; Chương 7 và 13</td></tr>
<tr><td>Học khoá này trên laptop Windows</td><td>WSL2 + Ubuntu</td><td>Linux thật; output khớp bài học</td></tr>
<tr><td>Chỉ cần git và vài lệnh trên Windows</td><td>Git Bash</td><td>nhẹ, đi kèm Git for Windows</td></tr>
<tr><td>Tự động hoá chính Windows (dịch vụ, registry, người dùng, Office, Azure)</td><td>PowerShell 7</td><td>đối tượng .NET và cmdlet của Windows mà bash không có</td></tr>
<tr><td>Dựng máy Mac cho cả nhóm</td><td>zsh + Homebrew + Brewfile</td><td><code>brew bundle install</code> một lệnh là xong</td></tr>
<tr><td>Script mọi người trong nhóm chạy trên Mac, Linux và WSL</td><td>bash ≥ 4 kèm dò khả năng</td><td>kiểm <code>BASH_VERSINFO</code>, <code>gsed</code>/<code>sed</code> (Bài 15.1)</td></tr>
<tr><td>Dữ liệu có cấu trúc (JSON, CSV) bắt đầu rối</td><td>PowerShell hoặc Python</td><td>khi bạn đang viết <code>awk</code> để phân tích JSON, bạn đã lớn hơn ống dẫn chữ rồi</td></tr>
</table>
<p>Bash không "kém" PowerShell, và ngược lại; mỗi cái đứng trên thế mạnh của một hệ điều hành. Bash là ngôn ngữ của máy chủ Linux, container và ảnh CI, nơi mọi thứ là file chữ. PowerShell là ngôn ngữ quản trị Windows, nơi mọi thứ là đối tượng nằm sau một API. Biết cả hai ở mức bài này nghĩa là bạn đọc được script của bạn cùng nhóm ở phía nào cũng được, và dịch được hai ba dòng mình cần.</p>

<h3>Bảng cờ: những tham số PowerShell dùng suốt</h3>
<table>
<tr><th>Cmdlet · tham số</th><th>Nghĩa</th><th>Tương đương bash</th></tr>
<tr><td><code>Get-ChildItem -Recurse -Filter *.log -Force</code></td><td>đệ quy · mẫu tên · kể cả file ẩn</td><td><code>find . -name '*.log'</code> · <code>ls -a</code></td></tr>
<tr><td><code>Get-Content -Tail 20 -Wait</code></td><td>các dòng cuối · bám theo</td><td><code>tail -n 20 -f</code></td></tr>
<tr><td><code>Select-String -Pattern X -Path F -NotMatch -CaseSensitive</code></td><td>tìm theo regex, đảo ngược, phân biệt hoa thường (mặc định KHÔNG phân biệt!)</td><td><code>grep -v</code>; <code>grep</code> của bash mặc định CÓ phân biệt</td></tr>
<tr><td><code>Select-Object -First N -Last N -ExpandProperty P</code></td><td>lấy mục · bóc một thuộc tính thành giá trị trơn</td><td><code>head</code> · <code>tail</code> · <code>cut</code></td></tr>
<tr><td><code>Sort-Object P -Descending -Unique</code></td><td>sắp theo thuộc tính</td><td><code>sort -r -u</code></td></tr>
<tr><td><code>Measure-Object P -Sum -Average -Line</code></td><td>đếm và gộp</td><td><code>wc</code>, <code>awk</code></td></tr>
<tr><td><code>Where-Object P -gt V</code> · <code>{ \$_.P -gt V }</code></td><td>lọc (dạng ngắn và dạng đầy đủ)</td><td>điều kiện <code>awk</code></td></tr>
<tr><td><code>-ErrorAction Stop</code> · <code>SilentlyContinue</code></td><td>biến lỗi thành lỗi dừng · giấu lỗi</td><td><code>set -e</code> · <code>2&gt;/dev/null</code></td></tr>
<tr><td><code>-WhatIf</code> · <code>-Confirm</code></td><td>cho xem sẽ xảy ra gì · hỏi trước (với cmdlet có thay đổi hệ thống)</td><td>một cờ <code>--dry-run</code> bạn tự viết</td></tr>
</table>
<div class="callout warn"><code>Select-String</code> <strong>mặc định KHÔNG phân biệt hoa thường</strong>, ngược với <code>grep</code>. <code>Select-String error app.log</code> khớp cả <code>ERROR</code>, <code>Error</code> lẫn <code>error</code>; thêm <code>-CaseSensitive</code> để có hành vi của grep. Toán tử so sánh của PowerShell (<code>-eq</code>, <code>-like</code>, <code>-match</code>) cũng không phân biệt; bản có chữ <code>c</code> (<code>-ceq</code>, <code>-cmatch</code>) thì có.</div>

<h3>Chạy thử từng bước</h3>
<p>Không cần Windows. Trên Mac: <code>brew install powershell</code>, rồi <code>pwsh</code>. Hoặc trong container, như khoá đã làm: cài gói nén <code>linux-arm64</code> (hoặc <code>linux-x64</code>) từ trang phát hành PowerShell trên GitHub. Rồi gõ từng dòng:</p>
<pre><code class="language-powershell">Set-Location /tmp; New-Item -ItemType Directory -Force logs | Out-Null
"INFO start&#96;nERROR db timeout&#96;nINFO ok&#96;nERROR disk full" | Set-Content logs/app.log
"x" * 2000 | Set-Content logs/big.log
"INFO only" | Set-Content logs/sach.log
\$PSVersionTable.PSVersion.ToString()
(Get-ChildItem logs).Count
Get-ChildItem logs | Sort-Object Length -Descending | Select-Object -First 1 -ExpandProperty Name
Select-String -Pattern ERROR -Path logs/app.log | ForEach-Object LineNumber
(Get-Content logs/app.log | Measure-Object -Line).Lines
\$x = 5; "x=\$x, x+1=\$(\$x + 1)"
@(3,1,2) | Sort-Object | Join-String -Separator ','</code></pre>
<div class="out">7.6.6
3
big.log
2
4
4
x=5, x+1=6
1,2,3</div>
<p>Cần để ý: <code>-ExpandProperty</code> trả về cái tên trơn thay vì một bảng một cột; <code>LineNumber</code> là thuộc tính của mỗi lần khớp, nên không cần <code>cut -d:</code>; dấu backtick <code>&#96;n</code> là xuống dòng của PowerShell. Rồi trả lời cùng ba câu hỏi bằng bash (<code>ls -S logs | head -1</code>, <code>grep -n ERROR logs/app.log | cut -d: -f1</code>, <code>wc -l &lt; logs/app.log</code>) và so xem bạn muốn bảo trì cái nào hơn.</p>

<h3>Trên macOS, Linux và WSL thì sao</h3>
<p>PowerShell 7 cư xử như nhau về mặt ngôn ngữ ở mọi nơi; thứ khác là môi trường xung quanh. Trên macOS và Linux: không có bí danh kiểu Windows (<code>ls</code> là <code>/usr/bin/ls</code>), <code>\$env:PATH</code> dùng <code>:</code>, đường dẫn dùng <code>/</code>, file profile là <code>~/.config/powershell/Microsoft.PowerShell_profile.ps1</code> (đo thật: <code>\$PROFILE</code> in <code>/root/.config/powershell/Microsoft.PowerShell_profile.ps1</code> khi chạy bằng root trong container), và execution policy luôn là Unrestricted. Bên trong WSL bạn gọi được PowerShell của <em>WINDOWS</em> từ Linux bằng <code>powershell.exe -c '…'</code> — tiện để hỏi Windows điều gì đó (khay nhớ tạm qua <code>Set-Clipboard</code>, một biến môi trường) từ một script bash, theo luật tương tác của Microsoft ở Bài 15.3.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> script tóm tắt log của nhóm viết bằng bash, và bạn phụ trách máy CI chạy Windows xin một bản PowerShell. Viết nó, và chứng minh cả hai cho cùng đáp án.</p><ol>
<li>Trong <code>~/thu-linux/ps15</code> (hoặc một container có <code>pwsh</code>), tạo <code>logs/app.log</code> ít nhất sáu dòng trộn <code>INFO</code>, <code>WARN</code> và <code>ERROR</code>, và một file log thứ hai lớn hơn.</li>
<li>Bằng bash, in ra: số dòng <code>ERROR</code>, số thứ tự của các dòng đó, và tên file lớn nhất trong <code>logs</code>.</li>
<li>Viết <code>tom-tat.ps1</code> có <code>param([string]\$Dir = 'logs')</code> in cùng ba câu trả lời bằng <code>Select-String</code>, <code>Measure-Object</code> và <code>Sort-Object</code>, cuối cùng in lại dữ liệu đó dạng JSON bằng <code>ConvertTo-Json</code>. Cho nó <code>exit 1</code> khi thư mục không có file <code>.log</code> nào.</li>
<li>Chạy bằng <code>pwsh -File tom-tat.ps1</code> và với <code>-Dir /khongco</code>, mỗi lần in <code>echo rc=\$?</code>.</li></ol>
<p><strong>Đạt khi:</strong> đáp án bash và PowerShell khớp từng con số, JSON phân tích được (<code>pwsh -File tom-tat.ps1 | tail -n +4 | jq .</code> hoặc cách cắt của bạn), thư mục không tồn tại cho <code>rc=1</code>, và bạn nói được vì sao <code>Select-String error</code> lẽ ra đếm nhiều dòng hơn <code>grep error</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Cmdlet (lệnh dựng sẵn của PowerShell)</span><span class="v">Lệnh PowerShell đặt tên Động từ-Danh từ, vd. <code>Get-ChildItem</code>.</span></div>
  <div class="kv"><span class="k">Object pipeline (ống dẫn đối tượng)</span><span class="v">Ống dẫn chở đối tượng .NET có thuộc tính mang tên, không phải dòng chữ.</span></div>
  <div class="kv"><span class="k">Property (thuộc tính)</span><span class="v">Một trường có tên của đối tượng (<code>Name</code>, <code>Length</code>) để sắp, lọc và chọn.</span></div>
  <div class="kv"><span class="k">Get-Member</span><span class="v">Liệt kê kiểu, thuộc tính và phương thức của đối tượng — "man" của một đối tượng.</span></div>
  <div class="kv"><span class="k">pwsh / powershell.exe</span><span class="v">PowerShell 7 (đa nền tảng) / Windows PowerShell 5.1 (chỉ Windows, có sẵn).</span></div>
  <div class="kv"><span class="k">\$LASTEXITCODE (mã thoát cuối)</span><span class="v">Mã thoát của chương trình ngoài chạy gần nhất; <code>\$?</code> chỉ là True/False.</span></div>
  <div class="kv"><span class="k">Execution policy (chính sách chạy script)</span><span class="v">Thiết lập của Windows quyết định script có được chạy không; lưới an toàn, không phải ranh giới bảo mật.</span></div>
  <div class="kv"><span class="k">Pipeline chain operators (toán tử nối ống)</span><span class="v"><code>&amp;&amp;</code> và <code>||</code>, có từ PowerShell 7; chúng xét lệnh thành công hay không, không xét output True/False.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>PowerShell chuyền đối tượng: sắp, lọc, chọn theo TÊN thuộc tính thay vì cắt cột; <code>Get-Member</code> cho biết đối tượng có gì.</li>
<li>Cmdlet đặt tên Động từ-Danh từ (<code>Get-ChildItem</code>, <code>Select-String</code>, <code>Where-Object</code>, <code>Sort-Object</code>, <code>Measure-Object</code>, <code>Invoke-RestMethod</code>).</li>
<li>PowerShell 7 (<code>pwsh</code>) chạy trên Windows, macOS và Linux, cài song song với Windows PowerShell 5.1.</li>
<li><code>&amp;&amp;</code>/<code>||</code> (PowerShell 7+) xét lệnh có thành công không; <code>Test-Path x &amp;&amp; …</code> vẫn đi tiếp khi ra <code>False</code> — dùng <code>if</code>.</li>
<li>Bí danh như <code>ls</code>/<code>cat</code> chỉ có trên Windows; <code>.ps1</code> dùng chung phải viết đủ tên cmdlet. <code>Select-String</code> mặc định không phân biệt hoa thường.</li>
<li>Script bị chặn trên Windows: <code>Set-ExecutionPolicy RemoteSigned -Scope CurrentUser</code> và <code>Unblock-File</code>, không bao giờ <code>Unrestricted</code> cho cả máy.</li>
</ul>

<a class="link-card" href="https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipelines" target="_blank" rel="noopener">
  <span class="lc-ico">🔷</span>
  <span class="lc-body"><span class="lc-title">Microsoft Learn — about_Pipelines</span><span class="lc-sub">Đối tượng chảy qua ống dẫn PowerShell ra sao, và tham số gắn vào chúng thế nào.</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_pipeline_chain_operators" target="_blank" rel="noopener">
  <span class="lc-ico">⛓</span>
  <span class="lc-body"><span class="lc-title">Microsoft Learn — about_Pipeline_Chain_Operators</span><span class="lc-sub"><code>&amp;&amp;</code> và <code>||</code> từ PowerShell 7, và chính xác "thành công" được quyết định thế nào.</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies" target="_blank" rel="noopener">
  <span class="lc-ico">🛡</span>
  <span class="lc-body"><span class="lc-title">Microsoft Learn — about_Execution_Policies</span><span class="lc-sub">Mọi chính sách, mặc định, phạm vi và thứ tự ưu tiên, và vì sao nó không phải ranh giới bảo mật.</span></span>
</a>
<a class="link-card" href="https://learn.microsoft.com/en-us/powershell/scripting/whats-new/differences-from-windows-powershell" target="_blank" rel="noopener">
  <span class="lc-ico">🆚</span>
  <span class="lc-body"><span class="lc-title">Microsoft Learn — Windows PowerShell 5.1 so với PowerShell 7.x</span><span class="lc-sub">Vì sao chương trình tên là <code>pwsh</code>, cái gì đã đổi, và chờ đợi gì khi bạn cùng nhóm vẫn dùng cửa sổ xanh.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện trên Code Lab</span><span class="lc-sub">Track Linux &amp; Bash — những kỹ năng ống dẫn chữ bạn vừa dịch sang PowerShell, chấm tự động.</span></span>
</a>

<p class="note-ct"><strong>Cách nhanh nhất để vào một đoạn PowerShell lạ:</strong> <code>Get-Command *từ-khoá*</code> để tìm cmdlet, <code>Get-Help Tên -Examples</code> để xem cách dùng, và <code>… | Get-Member</code> để xem thứ gì vừa đi ra. Ba lệnh đó với PowerShell giống như <code>apropos</code>, <code>man</code> và "chuyền sang <code>head</code> rồi nhìn" với bash.</p>
</div>
`,
    },
    /* ─────────────────────────── 15.5 ─────────────────────────── */
    {
      title: '15.5 — Chapter 15 check|||15.5 — Kiểm tra Chương 15',
      slug: 'lnx-15-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống: sed -i trên Mac, script bash 4 trên /bin/bash 3.2, mảng của zsh, PATH của launchd, repo nằm ở /mnt/c, CRLF và .gitattributes, đọc git ls-files --eol, && của PowerShell, dịch một ống dẫn bash sang PowerShell, và script .ps1 bị chặn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 15 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from a mixed Mac, Windows and Linux team. Most ask what a command prints or which fix is right — carrying a skill across operating systems is mostly about reading output correctly on an unfamiliar machine. Mac and Linux answers were run on 28/09/2026; Windows facts come from Microsoft's documentation.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain why a Mac has zsh by default and bash 3.2 in <code>/bin/bash</code>, and name three bash 4 features that break there.</li>
<li>I can list the BSD/GNU differences for <code>sed -i</code>, <code>date</code>, <code>stat</code>, <code>grep -P</code> and <code>timeout</code>, and write a script that works on both.</li>
<li>I can read a launchd plist and <code>launchctl print</code>, and I know which <code>PATH</code> a launchd job gets.</li>
<li>I know why WSL2 project files belong in Linux's <code>~</code>, and what <code>wsl.conf</code> and <code>.wslconfig</code> each control.</li>
<li>I can recognise CRLF from its error messages, prove it with <code>file</code>/<code>cat -A</code>, and stop it with <code>.gitattributes</code>.</li>
<li>I can translate a simple bash pipeline into PowerShell and explain what <code>&amp;&amp;</code> checks there.</li>
</ul>
${slide('lx-15', 30, 'Bảng tra nhanh Chương 15 (1/2): macOS')}
${slide('lx-15', 31, 'Bảng tra nhanh Chương 15 (2/2): Windows, WSL, CRLF, PowerShell')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 15 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ một nhóm dùng lẫn Mac, Windows và Linux. Phần lớn hỏi "lệnh này in ra gì" hay "cách sửa nào đúng" — mang một kỹ năng qua nhiều hệ điều hành chủ yếu là đọc đúng output trên một cái máy lạ. Đáp án về Mac và Linux đã chạy thật ngày 28/09/2026; điều về Windows lấy từ tài liệu của Microsoft.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được vì sao Mac mặc định là zsh và <code>/bin/bash</code> là 3.2, và kể được ba tính năng bash 4 vỡ ở đó.</li>
<li>Tôi kể được khác biệt BSD/GNU của <code>sed -i</code>, <code>date</code>, <code>stat</code>, <code>grep -P</code> và <code>timeout</code>, và viết được script chạy ở cả hai.</li>
<li>Tôi đọc được một plist của launchd và <code>launchctl print</code>, và biết một việc của launchd nhận <code>PATH</code> nào.</li>
<li>Tôi biết vì sao file dự án trong WSL2 phải nằm ở <code>~</code> của Linux, và <code>wsl.conf</code>, <code>.wslconfig</code> mỗi cái điều khiển gì.</li>
<li>Tôi nhận ra CRLF qua thông báo lỗi, chứng minh bằng <code>file</code>/<code>cat -A</code>, và chặn nó bằng <code>.gitattributes</code>.</li>
<li>Tôi dịch được một ống dẫn bash đơn giản sang PowerShell và giải thích được <code>&amp;&amp;</code> ở đó xét cái gì.</li>
</ul>
${slide('lx-15', 30, 'Bảng tra nhanh Chương 15 (1/2): macOS')}
${slide('lx-15', 31, 'Bảng tra nhanh Chương 15 (2/2): Windows, WSL, CRLF, PowerShell')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'On a Mac (Apple\'s own tools), you run: printf \'mode=yes\\n\' > m.conf; sed -i \'s/yes/no/\' m.conf — what happens?|||Trên Mac (công cụ của chính Apple), bạn chạy: printf \'mode=yes\\n\' > m.conf; sed -i \'s/yes/no/\' m.conf — chuyện gì xảy ra?',
            options: [
              'm.conf now contains mode=no, same as on Ubuntu|||m.conf giờ chứa mode=no, y như trên Ubuntu',
              'sed: illegal option -- i',
              'sed: 1: "m.conf": invalid command code m — the file is unchanged|||sed: 1: "m.conf": invalid command code m — file không đổi',
              'm.conf is edited and a backup m.confs/yes/no/ is created|||m.conf được sửa và một bản sao lưu m.confs/yes/no/ được tạo',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: BSD sed -i requires a backup suffix, so it takes \'s/yes/no/\' as that suffix and then reads m.conf as the sed SCRIPT — "m" is not a sed command. Nothing is edited. The backup-file option is tempting, but sed never got a valid script, so it neither edits nor backs up. Use sed -i \'\' on BSD or sed -i.bak on both.|||VI: sed -i của BSD bắt buộc có đuôi sao lưu, nên nó lấy \'s/yes/no/\' làm đuôi rồi đọc m.conf như KỊCH BẢN sed — "m" không phải lệnh sed. Không có gì bị sửa. Phương án "tạo bản sao lưu" nghe hợp lý, nhưng sed chưa hề nhận được một kịch bản hợp lệ nên nó chẳng sửa cũng chẳng sao lưu. Dùng sed -i \'\' trên BSD hoặc sed -i.bak cho cả hai.',
          },
          {
            question: 'deploy-helper.sh starts with #!/bin/bash and uses declare -A. It works on the Ubuntu VPS; on a teammate\'s Mac it fails with "declare: -A: invalid option". Which change fixes it properly for the whole team?|||deploy-helper.sh mở đầu bằng #!/bin/bash và dùng declare -A. Nó chạy trên VPS Ubuntu; trên Mac của một bạn cùng nhóm thì hỏng với "declare: -A: invalid option". Thay đổi nào sửa đúng cho cả nhóm?',
            options: [
              'Change the shebang to #!/usr/bin/env bash, have Mac users brew install bash, and add a BASH_VERSINFO check that exits with a clear message|||Đổi shebang thành #!/usr/bin/env bash, người dùng Mac brew install bash, và thêm phép kiểm BASH_VERSINFO thoát kèm thông báo rõ',
              'Tell the teammate to run chsh -s /bin/zsh so the script runs in zsh|||Bảo bạn đó chạy chsh -s /bin/zsh để script chạy trong zsh',
              'Run it with sh deploy-helper.sh, which is more portable|||Chạy bằng sh deploy-helper.sh cho dễ chuyển máy hơn',
              'Add set -euo pipefail at the top|||Thêm set -euo pipefail ở đầu file',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: /bin/bash on a Mac is 3.2 (the last GPLv2 bash) and has no associative arrays. #!/usr/bin/env bash picks Homebrew\'s bash 5 when it comes first in PATH, and the version check turns a cryptic error on line 40 into a clear one on line 3. Changing the login shell does not change the shebang, so the script still runs in /bin/bash; sh is even more limited; set -e only makes the failure stop sooner.|||VI: /bin/bash trên Mac là 3.2 (bash cuối cùng dùng GPLv2) và không có mảng kết hợp. #!/usr/bin/env bash chọn bash 5 của Homebrew khi nó đứng trước trong PATH, và phép kiểm phiên bản biến một lỗi khó hiểu ở dòng 40 thành một lỗi rõ ràng ở dòng 3. Đổi shell đăng nhập không đổi dòng shebang, nên script vẫn chạy bằng /bin/bash; sh còn hạn chế hơn; set -e chỉ khiến lỗi dừng sớm hơn.',
          },
          {
            question: 'In a fresh zsh on a Mac (zsh -f), what does this print?  arr=(tao cam le); echo "${arr[1]}"|||Trong một zsh mới trên Mac (zsh -f), lệnh này in ra gì?  arr=(tao cam le); echo "${arr[1]}"',
            options: [
              'cam',
              '(an empty line)|||(một dòng trống)',
              'tao cam le',
              'tao',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: zsh arrays start at index 1 by default, so ${arr[1]} is the first element, tao (measured with zsh 5.9). "cam" is the bash answer — bash starts at 0. The empty answer would be ${arr[0]} in zsh. setopt KSH_ARRAYS makes zsh count from 0 like bash.|||VI: Mảng của zsh mặc định bắt đầu từ chỉ số 1, nên ${arr[1]} là phần tử đầu, tao (đo bằng zsh 5.9). "cam" là đáp án của bash — bash bắt đầu từ 0. Dòng trống là kết quả của ${arr[0]} trong zsh. setopt KSH_ARRAYS bắt zsh đếm từ 0 như bash.',
          },
          {
            question: 'A LaunchAgent on your Mac runs a backup script that calls jq (installed by Homebrew). It works when you run the script in Terminal, but launchctl print shows last exit code = 127. Which fix is right?|||Một LaunchAgent trên Mac chạy script sao lưu có gọi jq (cài bằng Homebrew). Chạy script trong Terminal thì được, nhưng launchctl print báo last exit code = 127. Cách sửa nào đúng?',
            options: [
              'Add export PATH="/opt/homebrew/bin:$PATH" to ~/.zshrc|||Thêm export PATH="/opt/homebrew/bin:$PATH" vào ~/.zshrc',
              'Call /opt/homebrew/bin/jq by its absolute path in the script, or set PATH in the plist\'s EnvironmentVariables|||Gọi /opt/homebrew/bin/jq bằng đường tuyệt đối trong script, hoặc đặt PATH trong EnvironmentVariables của plist',
              'Reload it with launchctl load -w so launchd rereads your profile|||Nạp lại bằng launchctl load -w để launchd đọc lại profile của bạn',
              'Set RunAtLoad to true in the plist|||Đặt RunAtLoad thành true trong plist',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: launchd jobs get PATH=/usr/bin:/bin:/usr/sbin:/sbin (launchctl print shows it under "default environment") and never start a shell, so /opt/homebrew/bin is missing and jq is "command not found" — exit 127. ~/.zshrc is tempting because it fixes your Terminal, but launchd never reads it; load -w and RunAtLoad change when the job runs, not what PATH it has.|||VI: Việc của launchd nhận PATH=/usr/bin:/bin:/usr/sbin:/sbin (launchctl print hiện nó ở "default environment") và không bao giờ khởi động shell, nên thiếu /opt/homebrew/bin và jq là "command not found" — mã 127. ~/.zshrc nghe hấp dẫn vì nó chữa được Terminal của bạn, nhưng launchd không bao giờ đọc nó; load -w và RunAtLoad đổi lúc nào việc chạy, không đổi PATH của nó.',
          },
          {
            question: 'A teammate on Windows keeps the SWP391 repo in /mnt/c/Users/an/swp391 and runs npm install and git status inside WSL2. Both are painfully slow. What is the best fix?|||Một bạn dùng Windows để repo SWP391 ở /mnt/c/Users/an/swp391 và chạy npm install, git status bên trong WSL2. Cả hai chậm kinh khủng. Cách sửa tốt nhất là gì?',
            options: [
              'Give the VM more RAM with memory=8GB in .wslconfig|||Cho máy ảo thêm RAM bằng memory=8GB trong .wslconfig',
              'Set networkingMode=mirrored in .wslconfig|||Đặt networkingMode=mirrored trong .wslconfig',
              'Clone the repo into the Linux file system (for example ~/swp391) and open it from VS Code connected to WSL|||Clone repo vào hệ thống file của Linux (ví dụ ~/swp391) và mở nó từ VS Code nối vào WSL',
              'chmod -R 777 /mnt/c/Users/an/swp391',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Microsoft\'s "Working across file systems" says to store files in the WSL file system when working from a Linux command line; crossing to /mnt/c is the slow path in WSL2 (its comparison table lists cross-OS file performance as a WSL2 weakness). npm and git touch thousands of small files. More RAM does not change the file-system boundary, networking mode is unrelated, and chmod on /mnt/c does not even persist without the metadata mount option.|||VI: Trang "Working across file systems" của Microsoft bảo để file trong hệ thống file của WSL khi làm việc bằng dòng lệnh Linux; đi qua /mnt/c là đường chậm của WSL2 (bảng so sánh ghi hiệu năng giữa hai hệ file là điểm yếu của WSL2). npm và git chạm vào hàng nghìn file nhỏ. Thêm RAM không đổi được ranh giới hệ thống file, chế độ mạng không liên quan, và chmod trên /mnt/c còn không giữ được nếu không có tuỳ chọn metadata.',
          },
          {
            question: 'On the Ubuntu VPS, ./deploy.sh prints "cannot execute: required file not found" and bash deploy.sh prints "$\'\\r\': command not found". It was last edited on a teammate\'s Windows laptop. Which action stops this happening again for the whole team?|||Trên VPS Ubuntu, ./deploy.sh báo "cannot execute: required file not found" còn bash deploy.sh báo "$\'\\r\': command not found". Lần sửa gần nhất là trên laptop Windows của một bạn. Hành động nào ngăn chuyện này lặp lại cho cả nhóm?',
            options: [
              'Commit a .gitattributes with *.sh text eol=lf and run git add --renormalize . once|||Commit một .gitattributes có *.sh text eol=lf và chạy git add --renormalize . một lần',
              'Ask everyone to set git config core.autocrlf true|||Nhờ mọi người đặt git config core.autocrlf true',
              'Add dos2unix deploy.sh at the start of every deploy on the server|||Thêm dos2unix deploy.sh vào đầu mỗi lần deploy trên máy chủ',
              'Run chmod +x deploy.sh on the server|||Chạy chmod +x deploy.sh trên máy chủ',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Both messages are CRLF: the kernel looks for an interpreter called "/bin/bash\\r", and bash tries to run the "\\r" on an empty line. .gitattributes lives in the repository, so it applies to every clone regardless of each person\'s settings, and --renormalize fixes files already committed. core.autocrlf is per machine — one teammate who skips it brings CRLF back; dos2unix on the server treats the symptom every time; chmod is unrelated, the file is already executable.|||VI: Cả hai thông báo đều là CRLF: nhân đi tìm một trình thông dịch tên "/bin/bash\\r", và bash cố chạy "\\r" nằm trên một dòng trống. .gitattributes nằm trong repo nên áp cho mọi bản clone bất kể thiết lập của từng người, và --renormalize sửa cả những file đã commit. core.autocrlf là của từng máy — một bạn quên đặt là CRLF quay lại; dos2unix trên máy chủ chỉ chữa triệu chứng mỗi lần; chmod không liên quan, file vốn đã có quyền chạy.',
          },
          {
            question: 'git ls-files --eol prints:  i/lf    w/crlf  attr/    deploy.sh  — what does it mean?|||git ls-files --eol in ra:  i/lf    w/crlf  attr/    deploy.sh  — nghĩa là gì?',
            options: [
              'The repository stores CRLF and your working copy has been converted to LF|||Kho lưu CRLF và bản làm việc của bạn đã được đổi sang LF',
              'A .gitattributes rule forces LF in the index and CRLF on disk|||Một luật .gitattributes ép LF trong index và CRLF trên đĩa',
              'The file is binary, so git does not touch its line endings|||File là nhị phân nên git không đụng tới kiểu xuống dòng',
              'The repository stores LF, the copy on this machine has CRLF, and no .gitattributes rule applies|||Kho lưu LF, bản trên máy này có CRLF, và không có luật .gitattributes nào áp dụng',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: i/ is the index (what is committed), w/ is the working tree on this machine, attr/ is the attribute rule — empty means none. This is exactly what a Windows checkout with core.autocrlf=true produced in the lesson. The first option swaps i/ and w/; the second invents a rule where attr/ is empty; a binary file would show i/-text.|||VI: i/ là index (thứ đã commit), w/ là bản làm việc trên máy này, attr/ là luật thuộc tính — trống nghĩa là không có. Đây đúng là thứ một lần checkout trên Windows với core.autocrlf=true tạo ra trong bài. Phương án đầu đảo ngược i/ và w/; phương án hai bịa ra một luật trong khi attr/ trống; một file nhị phân sẽ hiện i/-text.',
          },
          {
            question: 'In PowerShell 7, /khongco does not exist. What does this print?  Test-Path /khongco && "co" || "khong"|||Trong PowerShell 7, /khongco không tồn tại. Lệnh này in ra gì?  Test-Path /khongco && "co" || "khong"',
            options: [
              'khong',
              'False, then co|||False, rồi co',
              'False, then khong|||False, rồi khong',
              'An error: && is not supported|||Một lỗi: không hỗ trợ &&',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: && and || (PowerShell 7+) look at $? — whether the command succeeded — not at the value it output. Test-Path ran fine and output False, so $? is True, && runs "co", and || is skipped. Measured on PowerShell 7.6.6: "False" then "co". "khong" is what a bash user expects; use if (Test-Path /khongco) { … } else { … } to branch on the value. && has existed since PowerShell 7.|||VI: && và || (PowerShell 7+) nhìn vào $? — lệnh có thành công không — chứ không nhìn vào giá trị nó in ra. Test-Path chạy tốt và in False, nên $? là True, && chạy "co", còn || bị bỏ qua. Đo trên PowerShell 7.6.6: "False" rồi "co". "khong" là đáp án người quen bash chờ đợi; muốn rẽ nhánh theo giá trị thì dùng if (Test-Path /khongco) { … } else { … }. && có từ PowerShell 7.',
          },
          {
            question: 'Which PowerShell line does the same job as the bash pipeline  ls -l logs | sort -k5 -n | tail -1 | awk \'{print $9}\'  (name of the largest file)?|||Dòng PowerShell nào làm cùng việc với ống dẫn bash  ls -l logs | sort -k5 -n | tail -1 | awk \'{print $9}\'  (tên file lớn nhất)?',
            options: [
              'Select-String -Path logs -Pattern Length | Select-Object -Last 1',
              'Get-Content logs | Sort-Object -Property 5 | Select-Object -Last 1',
              'Get-ChildItem logs | Sort-Object Length | Select-Object -Last 1 | ForEach-Object Name',
              'Get-ChildItem logs | Measure-Object Length -Maximum',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: Get-ChildItem emits FileInfo objects; Sort-Object sorts by the Length property, Select-Object -Last 1 takes the largest, and ForEach-Object Name extracts its name — measured, it printed big.log, same as the bash line. Measure-Object -Maximum is tempting but returns only the size, not which file; Sort-Object -Property 5 treats "5" as a property name, not a column; Select-String searches text inside files.|||VI: Get-ChildItem phát ra đối tượng FileInfo; Sort-Object sắp theo thuộc tính Length, Select-Object -Last 1 lấy cái lớn nhất, và ForEach-Object Name rút ra tên của nó — đo thật in big.log, y như dòng bash. Measure-Object -Maximum nghe hấp dẫn nhưng chỉ trả về con số kích thước, không cho biết file nào; Sort-Object -Property 5 hiểu "5" là tên thuộc tính chứ không phải cột; Select-String tìm chữ bên trong file.',
          },
          {
            question: 'A teammate on Windows (Windows PowerShell 5.1, default settings) runs .\\setup.ps1, a script they wrote themselves, and is told running scripts is disabled on this system. What is the proportionate fix?|||Một bạn dùng Windows (Windows PowerShell 5.1, thiết lập mặc định) chạy .\\setup.ps1, script chính bạn ấy viết, và nhận thông báo việc chạy script bị tắt trên máy. Cách sửa vừa tầm là gì?',
            options: [
              'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser (and Unblock-File for a script downloaded from the internet)|||Set-ExecutionPolicy RemoteSigned -Scope CurrentUser (và Unblock-File cho script tải từ Internet)',
              'Set-ExecutionPolicy Unrestricted -Scope LocalMachine as Administrator|||Set-ExecutionPolicy Unrestricted -Scope LocalMachine bằng Administrator',
              'Rename it to setup.sh and run it in Git Bash|||Đổi tên thành setup.sh rồi chạy trong Git Bash',
              'Run sudo .\\setup.ps1|||Chạy sudo .\\setup.ps1',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: Microsoft documents Restricted as the default for Windows PowerShell 5.1 on client machines — "permits individual commands, but doesn\'t allow scripts". RemoteSigned for the current user allows local scripts, still guards downloaded ones, and needs no admin. Machine-wide Unrestricted works but opens every account to unsigned scripts, and Microsoft stresses the policy is a safety net, not a security boundary, so the goal is not to "defeat" it. Git Bash cannot run PowerShell code, and Windows PowerShell has no sudo.|||VI: Microsoft ghi Restricted là mặc định của Windows PowerShell 5.1 trên máy khách — "permits individual commands, but doesn\'t allow scripts", gõ lệnh lẻ được nhưng không chạy script. RemoteSigned cho người dùng hiện tại cho phép script viết tại máy, vẫn canh chừng script tải về, và không cần admin. Unrestricted cho cả máy thì chạy được nhưng mở mọi tài khoản cho script không ký, và Microsoft nhấn mạnh chính sách này là lưới an toàn chứ không phải ranh giới bảo mật, nên mục tiêu không phải "đánh bại" nó. Git Bash không chạy được mã PowerShell, và Windows PowerShell không có sudo.',
          },
        ],
      },
    },
  ],
};
