/**
 * Linux & Bash — Chương 1: Shell & hệ thống file.
 * Dấu nhắc và ba lệnh đầu tiên · đường dẫn (tuyệt đối/tương đối, . .. ~ -) ·
 * cây thư mục và mỗi thư mục gốc để làm gì · nhìn kỹ một file (ls -l, stat, file) · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * Nâng cấp 28/09/2026: bài 1.0 slide (deck lx-01, 31 slide) + slide/🧪/🗂/📌 trong 1.1–1.4, phần tự tra cứu
 * (type/help/man mục 1·5·8/less/apropos/tldr) trong 1.1, "Chạy thử từng bước" + "macOS/WSL/Fedora khác gì" mỗi bài,
 * quiz 10 câu. Output MỚI chạy thật trong container ubuntu:24.04 (arm64), trên Fedora 44 và Mac M1 (macOS 27).
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 1 — The shell & the filesystem|||Chương 1 — Shell & hệ thống file',
  description: 'Ba lệnh đầu tiên và cách đọc dấu nhắc, hệ thống đường dẫn mà mọi lệnh về sau đều dựa vào, cây thư mục Linux và ý nghĩa của từng thư mục gốc, và cách nhìn kỹ một file để biết nó thật sự là gì.',
  lessons: [
    /* ─────────────────────────── 1.0 ─────────────────────────── */
    {
      title: '1.0 — Chapter 1 slides: the shell and the filesystem in pictures|||1.0 — Slide Chương 1: shell và hệ thống file bằng hình',
      slug: 'lnx-1-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 31 slide của Chương 1: đọc dấu nhắc, hình dạng câu lệnh, tự tra cứu bằng type/help/man/less/apropos, đường dẫn tuyệt đối và tương đối vẽ thành cây, cây FHS trên Ubuntu/Fedora/macOS, bảy cột của ls -l, stat, file và file đã xoá mà vẫn chiếm đĩa.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Slides</span>
<h2>The whole chapter in 31 slides</h2>
<p class="lead">Skim these before the lessons to see the shape of the chapter, then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: the prompt read piece by piece, the one-tree map with absolute and relative routes, the FHS tree, the seven numbered columns of <code>ls -l</code>, and the inode that keeps a deleted file's space.</p>
<p>Slides 3–10 belong to Lesson 1.1 (including the new part on finding help: <code>type</code>, <code>help</code>, man sections, <code>less</code>, <code>apropos</code>), 11–15 to 1.2, 16–21 to 1.3 and 22–27 to 1.4. The last four are the chapter's common mistakes, a two-page cheat sheet and a 40-minute practice session. Every terminal on the slides is real output, recorded on 28/09/2026 in an Ubuntu 24.04 container, on a Fedora 44 machine and on a Mac M1. The slides are in Vietnamese; the diagrams and code read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Slide</span>
<h2>Cả chương trong 31 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy hình dạng của chương, rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại bên trong bài giảng giải thích nó: dấu nhắc đọc từng mẩu, tấm bản đồ một cây với đường đi tuyệt đối và tương đối, cây FHS, bảy cột đánh số của <code>ls -l</code>, và cái inode giữ lại chỗ trống của một file đã xoá.</p>
<p>Slide 3–10 thuộc Bài 1.1 (gồm cả phần mới về tự tra cứu: <code>type</code>, <code>help</code>, các mục của man, <code>less</code>, <code>apropos</code>), 11–15 thuộc 1.2, 16–21 thuộc 1.3 và 22–27 thuộc 1.4. Bốn slide cuối là những sai lầm hay gặp của chương, bảng tra nhanh hai trang và một buổi thực hành 40 phút. Mọi terminal trên slide là output THẬT, ghi ngày 28/09/2026 trong container Ubuntu 24.04, trên máy Fedora 44 và trên Mac M1 — con số trên máy bạn có thể khác, quy luật thì không.</p>
</div>
${gallery('lx-01', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Dấu nhắc là thanh trạng thái'], [4, 'Mọi câu lệnh cùng một hình dạng'], [5, 'pwd, cd và cd -'],
  [6, 'ls giấu file dấu chấm'], [7, 'Hỏi type trước khi tra cứu'], [8, 'Các mục của man: passwd(1) và passwd(5)'],
  [9, 'Đọc man trong less'], [10, 'apropos và --help | grep'],
  [11, 'Một cây, một gốc /'], [12, 'Tuyệt đối vs tương đối'], [13, 'Bốn lối tắt . .. ~ -'],
  [14, 'Vì sao cần ./deploy.sh'], [15, 'Dấu cách, tên bắt đầu bằng -, realpath'],
  [16, 'Cây FHS'], [17, 'Ai ghi vào, cài lại có mất không'], [18, '/bin là lối tắt, /usr/local/bin là của bạn'],
  [19, '/proc, /sys, /dev không nằm trên đĩa'], [20, 'Ubuntu · Fedora · macOS'], [21, 'File mới đi đâu và du'],
  [22, 'Bảy cột của ls -l'], [23, 'Loại file và lưới quyền'], [24, 'Sắp xếp: -S, -t, -r'],
  [25, 'stat: ba dấu thời gian'], [26, 'file đọc nội dung'], [27, 'Xoá mà đĩa không trống'],
  [28, 'Sai lầm hay gặp'], [29, 'Bảng tra nhanh (1/2)'], [30, 'Bảng tra nhanh (2/2)'], [31, 'Thực hành chương 1'],
])}
`,
    },

    /* ─────────────────────────── 1.1 ─────────────────────────── */
    {
      title: '1.1 — The prompt, and your first three commands|||1.1 — Dấu nhắc, và ba lệnh đầu tiên của bạn',
      slug: 'lnx-1-1-dau-nhac-ba-lenh',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Đọc dấu nhắc như đọc một bảng thông tin, pwd/ls/cd, cấu trúc chung của mọi lệnh Linux, vì sao một dấu cách đặt sai làm hỏng cả câu lệnh, và cách tự tra cứu: type, help, các mục của man, đọc trong less, apropos, --help.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>The prompt is a status bar</h2>
<p class="lead">Before typing anything, read what is already on the line. A default prompt carries four pieces of information, and two of them decide whether the next command is safe.</p>
${slide('lx-01', 3, 'Dấu nhắc là thanh trạng thái: đọc 4 mẩu trước khi gõ')}

<pre><code>an@lab:~/projects/api$ </code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">an</span><span class="lz-v">The user you are. Determines what you are allowed to touch (Chapter 4).</span></div>
  <div class="lz-layer"><span class="lz-k">lab</span><span class="lz-v">The machine's hostname. On a laptop this is decoration; over SSH it is the difference between your machine and production.</span></div>
  <div class="lz-layer"><span class="lz-k">~/projects/api</span><span class="lz-v">The current directory. Almost every command acts relative to this.</span></div>
  <div class="lz-layer"><span class="lz-k">\$ vs #</span><span class="lz-v"><strong>\$</strong> = an ordinary user. <strong>#</strong> = root, where nothing will stop you. Check this before anything destructive.</span></div>
</div>
<div class="callout danger">The <code>#</code> is not decoration. As root there are no permission errors — a mistyped path in <code>rm -rf</code> does not fail, it succeeds. Any time the prompt ends in <code>#</code>, slow down and re-read the command before pressing Enter.</div>
<div class="callout ok"><strong>On a Mac the prompt looks different and means the same thing.</strong> The default shell on macOS is zsh, and its prompt comes from one line in <code>/etc/zshrc</code>: <code>PS1="%n@%m %1~ %# "</code>. It prints <code>admin@Cuong-Hoang lx-01 %</code> — user, machine, only the <em>last</em> directory name, and <code>%</code> where bash shows <code>\$</code> (it too becomes <code>#</code> for root). On Ubuntu the same job is done by <code>PS1='\${debian_chroot:+(\$debian_chroot)}\\u@\\h:\\w\\$ '</code>: <code>\\u</code> user, <code>\\h</code> host, <code>\\w</code> full directory. Chapter 8 shows how to change it; for now, just know that the prompt is built from a variable, not carved in stone.</div>

<h3>pwd — where am I?</h3>
<pre><code>pwd</code></pre>
<div class="out">/home/an/projects/api</div>
<p>"Print working directory". Every shell has a current directory, every relative path is resolved from it, and a surprising number of "the command did nothing" problems are really "I was somewhere else". It is the cheapest command in Linux and the one to run whenever something is confusing.</p>

<h3>ls — what is here?</h3>
${slide('lx-01', 6, 'ls giấu file dấu chấm — ls -A để thấy .env')}
<pre><code>ls</code></pre>
<div class="out">README.md  node_modules  package.json  src  tests</div>
<pre><code class="language-bash">ls -l</code></pre>
<div class="out">total 48
-rw-r--r--  1 an an  1204 Aug 21 14:20 README.md
drwxr-xr-x 84 an an  4096 Aug 20 09:11 node_modules
-rw-r--r--  1 an an  2891 Aug 21 11:02 package.json
drwxr-xr-x  6 an an  4096 Aug 21 14:18 src
drwxr-xr-x  3 an an  4096 Aug 19 16:40 tests</div>
<div class="kv-grid">
  <div class="kv"><span class="k">-l</span><span class="v">Long format: type, permissions, owner, size, modification time. Lesson 1.4 reads every column.</span></div>
  <div class="kv"><span class="k">-a</span><span class="v">Include hidden entries — anything whose name starts with a dot, such as <code>.env</code> and <code>.git</code>.</span></div>
  <div class="kv"><span class="k">-h</span><span class="v">Human-readable sizes (4.0K, 2.1M) instead of raw bytes. Only meaningful with <code>-l</code>.</span></div>
  <div class="kv"><span class="k">-t</span><span class="v">Sort by modification time, newest first. <code>ls -lat</code> is "what changed here recently?".</span></div>
</div>
<pre><code class="language-bash">ls -lah</code></pre>
<div class="out">total 48K
drwxr-xr-x  7 an an 4.0K Aug 21 14:20 .
drwxr-xr-x 12 an an 4.0K Aug 19 10:03 ..
-rw-r--r--  1 an an  312 Aug 19 10:05 .env
drwxr-xr-x  8 an an 4.0K Aug 21 14:20 .git
-rw-r--r--  1 an an 1.2K Aug 21 14:20 README.md</div>
<div class="callout ok">"Hidden" files are not protected or special — the rule is simply that <code>ls</code> skips names starting with <code>.</code> unless you ask. That convention is why configuration lives in <code>~/.bashrc</code> and <code>.env</code>: it keeps a home directory readable, and nothing more.</div>

<h3>cd — move</h3>
${slide('lx-01', 5, 'pwd hỏi “tôi ở đâu”, cd di chuyển, cd - quay lại')}
<pre><code class="language-bash">cd src              <span class="tok-comment"># into a subdirectory</span>
cd ..               <span class="tok-comment"># up one level</span>
cd ~                <span class="tok-comment"># home. Plain 'cd' does the same.</span>
cd -                <span class="tok-comment"># back to the PREVIOUS directory — like Alt-Tab</span>
cd /var/log         <span class="tok-comment"># an absolute path, from anywhere</span></code></pre>
<div class="out">/home/an/projects/api/src
/home/an/projects/api
/home/an
/home/an/projects/api</div>
<p><code>cd -</code> is the one people do not discover on their own, and it is worth adopting today: bouncing between a source directory and a log directory becomes two keystrokes.</p>
<div class="callout warn"><strong>How to read the output above.</strong> <code>cd</code> itself prints nothing when it succeeds — silence is success. The four lines show where <code>pwd</code> would put you after the first four commands; the only <code>cd</code> that prints on its own is <code>cd -</code>, which echoes the directory it returned to (it printed <code>/home/an/projects/api</code> above). If you run the block and see nothing, nothing is wrong.</div>

<h3>The shape of every command</h3>
${slide('lx-01', 4, 'Mọi câu lệnh cùng một hình dạng — dấu cách là dao chẻ')}
<pre><code class="language-bash">ls   -l   --sort=size   /var/log
│     │        │            │
│     │        │            └─ arguments: what to act on
│     │        └─ long option, two dashes, often takes =value
│     └─ short option, one dash. Combinable: -lah = -l -a -h
└─ the command</code></pre>
<div class="callout warn"><strong>Spaces separate arguments — always.</strong> The shell splits your line on whitespace before the program sees anything, so <code>ls-l</code> is one unknown command, and <code>ls My Documents</code> is a request for two directories called <code>My</code> and <code>Documents</code>. A filename containing a space must be quoted: <code>ls "My Documents"</code>. Chapter 6 makes this systematic; for now, quote anything with a space in it.</div>
<pre><code class="language-bash"><span class="tok-comment"># Same result, three ways of grouping short options:</span>
ls -l -a -h
ls -lah
ls -la -h</code></pre>

<h3>Tab completion, and why it is a safety feature</h3>
<pre><code class="language-bash">cd pro&lt;Tab&gt;                  <span class="tok-comment"># completes to projects/</span>
cd projects/ap&lt;Tab&gt;           <span class="tok-comment"># completes to api/</span>
ls /var/lo&lt;Tab&gt;&lt;Tab&gt;          <span class="tok-comment"># two Tabs: list every match</span></code></pre>
<div class="callout ok">Tab completion is not only convenience. A path that completes <em>exists</em>; a path that does not complete is a typo you just caught before running anything. Type the first three letters and press Tab rather than typing paths in full — it is faster and it verifies as you go.</div>

<h3>Three commands worth adding now</h3>
<pre><code>clear                 <span class="tok-comment"># empty the screen (or Ctrl-L)</span>
history | tail -5     <span class="tok-comment"># what did I just run?</span>
!!                     <span class="tok-comment"># repeat the last command</span>
sudo !!                <span class="tok-comment"># repeat it with sudo — the classic use</span>
!543                   <span class="tok-comment"># run command number 543 from history</span></code></pre>
<div class="out">  541  pwd
  542  ls -lah
  543  cd /var/log
  544  ls
  545  history | tail -5</div>

<h3>Finding help without leaving the terminal: type first</h3>
${slide('lx-01', 7, 'Trước khi tra cứu, hỏi type: lệnh này là loại gì?')}
<p>Every command you type is one of four kinds, and each kind keeps its documentation in a different place. Asking <code>man</code> about the wrong kind is the most common reason beginners decide "the manual is useless". So the first question is not "what does it do?" but "what <em>is</em> it?" — and <code>type</code> answers in one line.</p>
<pre><code>type -a ls
type cd
man cd
help cd | head -2</code></pre>
<div class="out">ls is aliased to &#96;ls --color=auto'
ls is /usr/bin/ls
ls is /bin/ls
cd is a shell builtin
No manual entry for cd
cd: cd [-L|[-P [-e]] [-@]] [dir]
    Change the shell working directory.</div>
<table>
<tr><th>type says</th><th>What it is</th><th>Where its documentation lives</th></tr>
<tr><td><code>is aliased to</code></td><td>A shorthand the shell defines (Ubuntu ships <code>ls='ls --color=auto'</code>)</td><td><code>alias ls</code> shows the expansion; then look up the real command</td></tr>
<tr><td><code>is a shell builtin</code></td><td>Code inside bash itself: <code>cd</code>, <code>pwd</code>, <code>echo</code>, <code>type</code>, <code>history</code></td><td><code>help cd</code> — there is usually no man page</td></tr>
<tr><td><code>is /usr/bin/ls</code></td><td>A program, a file on disk</td><td><code>man ls</code>, <code>ls --help</code></td></tr>
<tr><td><code>is a function</code></td><td>A shell function (Chapter 6)</td><td><code>type name</code> prints its whole body</td></tr>
</table>
<p>Why is <code>cd</code> a builtin at all? Because it cannot be anything else. A program runs as a child process, and a child cannot change its parent's current directory — a separate <code>/usr/bin/cd</code> would change its own directory and exit, leaving your shell exactly where it was. The same logic makes <code>export</code> and <code>source</code> builtins. Chapter 8 goes further into <code>type</code>, <code>command -v</code> and why <code>which</code> can mislead.</p>

<h3>Man pages come in numbered sections</h3>
${slide('lx-01', 8, 'man chia mục: passwd(1) là lệnh, passwd(5) là định dạng file')}
<p>The manual is split into sections, and the same name can live in more than one. <code>passwd</code> is both a command (section 1) and the format of <code>/etc/passwd</code> (section 5). That is what the number in brackets means whenever documentation writes <code>crontab(5)</code> or <code>sshd(8)</code>.</p>
<pre><code>man -f passwd              <span class="tok-comment"># which sections have a page called passwd? (= whatis)</span>
man 5 passwd | head -5     <span class="tok-comment"># ask for section 5 explicitly</span></code></pre>
<div class="out">passwd (1)           - change user password
passwd (1ssl)        - OpenSSL application commands
passwd (5)           - the password file
PASSWD(5)		File Formats and Configuration		     PASSWD(5)

NAME
       passwd - the password file
</div>
<table>
<tr><th>Section</th><th>Contains</th><th>You will read</th></tr>
<tr><td><strong>1</strong></td><td>User commands</td><td><code>man ls</code>, <code>man 1 passwd</code></td></tr>
<tr><td>2 · 3</td><td>System calls · C library functions</td><td><code>man 2 open</code> (for programmers)</td></tr>
<tr><td>4</td><td>Special files in <code>/dev</code></td><td><code>man 4 null</code></td></tr>
<tr><td><strong>5</strong></td><td>File formats and configuration files</td><td><code>man 5 passwd</code>, <code>man 5 crontab</code>, <code>man 5 sshd_config</code></td></tr>
<tr><td>7</td><td>Overviews and conventions</td><td><code>man 7 hier</code> (Lesson 1.3), <code>man 7 man-pages</code></td></tr>
<tr><td><strong>8</strong></td><td>System administration commands, often root-only</td><td><code>man 8 mount</code>, <code>man 8 sshd</code></td></tr>
</table>
<div class="callout ok">Plain <code>man passwd</code> shows the first page found in the search order, and section 1 comes before 5 — so you get the command, not the file format. When you are editing a configuration file, the page you want is almost always in section 5: <code>man 5 sshd_config</code> lists every directive the SSH server understands, which is exactly the page that would have explained the <code>PasswordAuthentication</code> surprise of Chapter 14.</div>

<h3>Reading a man page in less</h3>
${slide('lx-01', 9, 'man mở trong less: / tìm, n tới, q thoát — cách đọc SYNOPSIS')}
<p><code>man</code> does not display the page itself; it hands it to a <strong>pager</strong>, normally <code>less</code>. The same program opens when you run <code>git log</code>, <code>systemctl status</code> or <code>journalctl</code>, so the keys below pay off far beyond manuals.</p>
<table>
<tr><th>Key</th><th>What it does</th></tr>
<tr><td><code>Space</code> / <code>b</code></td><td>Forward / back one screen (<code>j</code>/<code>k</code> or arrows: one line)</td></tr>
<tr><td><code>/text</code> then Enter</td><td>Search forward. <code>?text</code> searches backward</td></tr>
<tr><td><code>n</code> / <code>N</code></td><td>Next / previous match — the pair you will press most</td></tr>
<tr><td><code>g</code> / <code>G</code></td><td>Jump to the start / end</td></tr>
<tr><td><code>&amp;text</code></td><td>Show only lines containing <em>text</em> (a filter; <code>&amp;</code> + Enter clears it)</td></tr>
<tr><td><code>F</code></td><td>Follow the file as it grows, like <code>tail -f</code>; <code>Ctrl</code>+<code>C</code> stops following</td></tr>
<tr><td><code>h</code> / <code>q</code></td><td>Help screen / quit</td></tr>
</table>
<p>A man page has a fixed shape. For <code>ls</code> the headings are:</p>
<pre><code>man ls | col -b | grep '^[A-Z]'</code></pre>
<div class="out">LS(1)				 User Commands				 LS(1)
NAME
SYNOPSIS
DESCRIPTION
AUTHOR
REPORTING BUGS
COPYRIGHT
SEE ALSO</div>
<p>Read NAME for the one-line summary, SYNOPSIS for the shape, and search DESCRIPTION for the flag you care about. Notice what is missing: <code>ls(1)</code> has no EXAMPLES section. Many GNU pages do not, which is exactly the gap <code>tldr</code> fills (below). The SYNOPSIS uses a small notation worth learning once:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">[OPTION]</span><span class="v">Square brackets: optional. You may leave it out.</span></div>
  <div class="kv"><span class="k">...</span><span class="v">May be repeated: <code>[FILE]...</code> means zero or more files.</span></div>
  <div class="kv"><span class="k">UPPERCASE</span><span class="v">A placeholder — replace it with your own value.</span></div>
  <div class="kv"><span class="k">a|b</span><span class="v">Choose one of the alternatives.</span></div>
</div>
<pre><code>man ls                    <span class="tok-comment"># then type:  /^ *-r   and Enter — jumps to where -r is defined</span>
less -N -S app.log        <span class="tok-comment"># -N line numbers, -S do not wrap long lines (scroll sideways)</span>
less +F app.log           <span class="tok-comment"># open already following the end, like tail -f</span>
less -i app.log           <span class="tok-comment"># searches ignore case unless you type a capital</span></code></pre>
<div class="callout ok">Searching for <code>-r</code> alone lands on every word containing "-r". Anchoring to the start of the line with <code>^</code> and allowing the indentation with <code> *</code> takes you straight to the definition — a pattern that works in every man page.</div>

<h3>When you do not know the command's name</h3>
${slide('lx-01', 10, 'Không nhớ tên lệnh? apropos. Nhớ tên, quên cờ? --help | grep')}
<pre><code class="language-bash">apropos -s 1 compress | wc -l                        <span class="tok-comment"># search the one-line descriptions, section 1 only</span>
apropos -s 1 compress | grep -E "^(gzip|xz|zstd) "
ls --help | grep -i "by file size"                   <span class="tok-comment"># know the command, forgot the flag</span>
help -d cd pwd                                       <span class="tok-comment"># one-line summaries of builtins</span></code></pre>
<div class="out">51
gzip (1)             - compress or expand files
xz (1)               - Compress or decompress .xz and .lzma files
zstd (1)             - zstd, zstdmt, unzstd, zstdcat - Compress or decompress...
  -S                         sort by file size, largest first
cd - Change the shell working directory.
pwd - Print the name of the current working directory.</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Do not know the name</div><div class="lz-d"><code>apropos keyword</code> (same as <code>man -k</code>) searches every page's description.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Know the name, need a flag fast</div><div class="lz-d"><code>command --help | grep -i word</code> — one second, enough most of the time.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Need to understand it properly</div><div class="lz-d"><code>man command</code>, search with <code>/</code>. The same pages are on man7.org for your phone.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">It is a bash builtin</div><div class="lz-d"><code>help name</code>; <code>man bash</code> has the full story.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Want a worked example</div><div class="lz-d"><code>tldr command</code>, or the same community pages at tldr.sh.</div></div>
</div>
<div class="callout warn"><strong>A <code>tldr</code> surprise worth knowing about.</strong> Ubuntu 24.04's packaged client (<code>tealdeer</code> 1.6.1) could not download its page cache when this lesson was tested on 28/09/2026 — <code>tldr --update</code> failed with <code>Could not decompress downloaded ZIP archive</code>. The pages are fine; the old client is not. Use the website, or a newer client, rather than concluding the tool is broken for good. And if <code>apropos</code> answers <code>nothing appropriate</code> inside a Docker container, the image was "minimized" without man pages — on a real server it works.</div>

<h3>Run it step by step</h3>
<p>Nine commands, in order, in the course sandbox. Type them rather than pasting; predict each output first.</p>
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch1/api/{src,logs} &amp;&amp; cd ~/thu-linux/ch1/api
touch .env README.md src/app.ts
pwd
ls
ls -A
cd src &amp;&amp; pwd
cd ../logs
cd -
type pwd</code></pre>
<div class="out">/home/an/thu-linux/ch1/api
README.md  logs  src
.env  README.md  logs  src
/home/an/thu-linux/ch1/api/src
/home/an/thu-linux/ch1/api/src
pwd is a shell builtin</div>
<p>Reading it: <code>ls</code> hides <code>.env</code> and <code>ls -A</code> shows it; <code>cd ../logs</code> printed nothing; <code>cd -</code> printed the directory it jumped back to (<code>src</code>); and <code>pwd</code> is a builtin, so its documentation is <code>help pwd</code>. (Output recorded in an Ubuntu 24.04 container as user <code>an</code>.)</p>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th>Thing</th><th>Ubuntu / WSL</th><th>macOS (zsh, BSD tools)</th></tr>
<tr><td>Prompt</td><td><code>an@lab:~/projects/api$</code></td><td><code>admin@Cuong-Hoang lx-01 %</code> — <code>%</code> instead of <code>\$</code>, last folder only</td></tr>
<tr><td><code>ls</code> long options</td><td><code>--sort=size</code>, <code>--time</code>, <code>--version</code> work (GNU)</td><td><code>ls: unrecognized option &#96;--sort=size'</code> — use <code>-S</code>, <code>-t</code></td></tr>
<tr><td>Extra marks after permissions</td><td>none (Fedora adds <code>.</code> = SELinux label)</td><td><code>@</code> = extended attributes, <code>+</code> = ACL: <code>-rw-r--r--@</code></td></tr>
<tr><td><code>help cd</code></td><td>works (bash builtin)</td><td><code>zsh: command not found: help</code> — zsh has no <code>help</code>; run <code>bash</code> first or read <code>man zshbuiltins</code></td></tr>
<tr><td><code>man</code>, <code>apropos</code></td><td>present on a real install</td><td>present (<code>/usr/bin/man</code>, <code>/usr/bin/apropos</code>)</td></tr>
</table>
<p>WSL2 runs a real Ubuntu kernel and userland, so everything in this lesson behaves exactly as on the VPS. The differences show up on a Mac, and they are small but constant: a GNU long option that "does not exist" on macOS is the most common one.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> your SWP391 teammate gives you SSH access to the group's server and says "the API is somewhere under home, the config is in a dotfile, figure it out". Rehearse on your own machine, without Google.</p><ol>
<li>Build the scene: <code>mkdir -p ~/thu-linux/ch1/api/{src,logs} &amp;&amp; cd ~/thu-linux/ch1/api &amp;&amp; touch .env src/app.ts</code>.</li>
<li>Read your prompt aloud: which user, which machine, which directory, and does it end in <code>\$</code>, <code>%</code> or <code>#</code>?</li>
<li>Run <code>ls</code>, then <code>ls -A</code>. Name the file that only the second command showed.</li>
<li>Run <code>cd src</code>, <code>cd ../logs</code>, then — before pressing Enter — say what <code>cd -</code> will print. Check.</li>
<li>Using only the terminal: which man section documents the format of <code>/etc/passwd</code>, and which flag of the builtin <code>pwd</code> resolves symlinks? (<code>man -f passwd</code>, <code>type pwd</code>, <code>help pwd</code>.)</li></ol>
<p><strong>Done when:</strong> <code>ls -A</code> showed <code>.env</code>; your prediction for <code>cd -</code> (<code>…/ch1/api/src</code>) matched; and you can answer "section 5" and "<code>-P</code>" with the command that proved each.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Prompt</span><span class="v">The text the shell prints before your cursor: user, host, current directory, and <code>\$</code> / <code>#</code>.</span></div>
  <div class="kv"><span class="k">Working directory</span><span class="v">The directory your shell is "in"; every relative path starts from it. <code>pwd</code> prints it.</span></div>
  <div class="kv"><span class="k">Option / flag</span><span class="v">A switch that changes a command's behaviour: <code>-l</code> (short) or <code>--sort=size</code> (long).</span></div>
  <div class="kv"><span class="k">Argument</span><span class="v">What the command acts on, after the options: the <code>/var/log</code> in <code>ls -l /var/log</code>.</span></div>
  <div class="kv"><span class="k">Builtin</span><span class="v">A command implemented inside the shell itself (<code>cd</code>, <code>pwd</code>); documented by <code>help</code>, not <code>man</code>.</span></div>
  <div class="kv"><span class="k">Man page / section</span><span class="v">The system manual, split into numbered sections: 1 commands, 5 file formats, 8 admin commands.</span></div>
  <div class="kv"><span class="k">Pager (less)</span><span class="v">The program that shows long text one screen at a time; <code>/</code> searches, <code>q</code> quits.</span></div>
  <div class="kv"><span class="k">Dotfile</span><span class="v">A file whose name starts with <code>.</code>; hidden by <code>ls</code> unless you add <code>-a</code> or <code>-A</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Read the prompt before typing: who, which machine, where — and <code>#</code> means root with no safety net.</li>
<li>Every command is <em>name, options, arguments</em>, and the shell splits them on spaces before the program sees anything.</li>
<li><code>pwd</code> to check, <code>cd -</code> to bounce back, Tab to type paths that are guaranteed to exist.</li>
<li><code>ls -A</code> shows the dotfiles that plain <code>ls</code> hides — check before deleting or copying a "empty" folder.</li>
<li><code>type</code> first: builtins are documented by <code>help</code>, programs by <code>man</code> and <code>--help</code>.</li>
<li>Man sections matter (<code>passwd(1)</code> vs <code>passwd(5)</code>); inside <code>less</code>, <code>/</code>, <code>n</code> and <code>q</code> are the three keys to know.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/man.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">man(1) — the manual about the manual</span><span class="lc-sub">The section list, <code>-k</code>, <code>-f</code>, <code>-a</code> and how the search order works.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/less.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">less(1) — every key and option of the pager</span><span class="lc-sub">The same screen you get by pressing <code>h</code> inside less, in a form you can read on a phone.</span></span>
</a>
<a class="link-card" href="https://tldr.sh/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">tldr pages — short, example-first help</span><span class="lc-sub">Community-written cheat sheets for thousands of commands; the fastest answer to "just show me an example".</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/ls.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">ls(1) — every flag, from the manual</span><span class="lc-sub">Skim the sorting and format sections; the rest is rarely needed.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: navigate a directory tree blindfolded</span><span class="lc-sub">Graded exercises on pwd, ls, cd and reading the prompt.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> assuming <code>ls</code> shows everything. It hides dotfiles by default, so a directory that looks empty may hold <code>.env</code>, <code>.git</code> and <code>.ssh</code>. People delete a folder believing it is empty, or copy a project without its configuration, for exactly this reason. When it matters, use <code>ls -A</code> — like <code>-a</code>, but without the <code>.</code> and <code>..</code> entries cluttering the output.</div>
<p class="note-ct"><strong>The habit to build from lesson one:</strong> <code>pwd</code> before anything destructive, and Tab instead of typing paths. Both take under a second, and between them they prevent the single most common category of terminal accident — running the right command in the wrong place.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Dấu nhắc là một thanh trạng thái</h2>
<p class="lead">Trước khi gõ gì, hãy đọc thứ vốn đã có sẵn trên dòng. Một dấu nhắc mặc định mang bốn mẩu thông tin, và hai trong số đó quyết định lệnh kế tiếp có an toàn hay không.</p>
${slide('lx-01', 3, 'Dấu nhắc là thanh trạng thái: đọc 4 mẩu trước khi gõ')}

<pre><code>an@lab:~/projects/api$ </code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">an</span><span class="lz-v">Bạn đang là người dùng nào. Quyết định bạn được phép đụng vào cái gì (Chương 4).</span></div>
  <div class="lz-layer"><span class="lz-k">lab</span><span class="lz-v">Tên máy. Trên laptop thì là trang trí; qua SSH thì đó là khác biệt giữa máy bạn và production.</span></div>
  <div class="lz-layer"><span class="lz-k">~/projects/api</span><span class="lz-v">Thư mục hiện tại. Gần như mọi lệnh đều tác động tương đối với chỗ này.</span></div>
  <div class="lz-layer"><span class="lz-k">\$ vs #</span><span class="lz-v"><strong>\$</strong> = người dùng thường. <strong>#</strong> = root, nơi không gì chặn bạn lại. Hãy kiểm cái này trước mọi việc phá huỷ.</span></div>
</div>
<div class="callout danger">Dấu <code>#</code> không phải trang trí. Là root thì không có lỗi phân quyền nào cả — một đường dẫn gõ sai trong <code>rm -rf</code> không thất bại, nó THÀNH CÔNG. Bất cứ khi nào dấu nhắc kết thúc bằng <code>#</code>, hãy chậm lại và đọc lại lệnh trước khi bấm Enter.</div>
<div class="callout ok"><strong>Trên Mac dấu nhắc trông khác, nhưng nghĩa y hệt.</strong> Shell mặc định của macOS là zsh, và dấu nhắc của nó đến từ đúng một dòng trong <code>/etc/zshrc</code>: <code>PS1="%n@%m %1~ %# "</code>. Nó in ra <code>admin@Cuong-Hoang lx-01 %</code> — người dùng, tên máy, chỉ tên thư mục <em>CUỐI</em>, và dấu <code>%</code> ở chỗ bash in <code>\$</code> (nó cũng thành <code>#</code> khi là root). Trên Ubuntu việc đó do <code>PS1='\${debian_chroot:+(\$debian_chroot)}\\u@\\h:\\w\\$ '</code> đảm nhận: <code>\\u</code> là người dùng, <code>\\h</code> là tên máy, <code>\\w</code> là thư mục đầy đủ. Chương 8 chỉ cách đổi nó; giờ chỉ cần biết dấu nhắc được ghép từ một biến (variable), không phải thứ khắc vào đá.</div>

<h3>pwd — tôi đang ở đâu?</h3>
<pre><code>pwd</code></pre>
<div class="out">/home/an/projects/api</div>
<p>"Print working directory" — in ra thư mục làm việc. Mọi shell đều có một thư mục hiện tại, mọi đường dẫn tương đối đều được phân giải từ đó, và một số lượng đáng ngạc nhiên các vấn đề "lệnh chẳng làm gì cả" thật ra là "tôi đang đứng ở chỗ khác". Đây là lệnh rẻ nhất trong Linux và là lệnh nên chạy mỗi khi có gì đó khó hiểu.</p>

<h3>ls — ở đây có gì?</h3>
${slide('lx-01', 6, 'ls giấu file dấu chấm — ls -A để thấy .env')}
<pre><code>ls</code></pre>
<div class="out">README.md  node_modules  package.json  src  tests</div>
<pre><code class="language-bash">ls -l</code></pre>
<div class="out">total 48
-rw-r--r--  1 an an  1204 Aug 21 14:20 README.md
drwxr-xr-x 84 an an  4096 Aug 20 09:11 node_modules
-rw-r--r--  1 an an  2891 Aug 21 11:02 package.json
drwxr-xr-x  6 an an  4096 Aug 21 14:18 src
drwxr-xr-x  3 an an  4096 Aug 19 16:40 tests</div>
<div class="kv-grid">
  <div class="kv"><span class="k">-l</span><span class="v">Dạng dài: loại, quyền, chủ sở hữu, kích thước, thời gian sửa. Bài 1.4 đọc từng cột.</span></div>
  <div class="kv"><span class="k">-a</span><span class="v">Gồm cả mục ẩn — mọi thứ có tên bắt đầu bằng dấu chấm, như <code>.env</code> và <code>.git</code>.</span></div>
  <div class="kv"><span class="k">-h</span><span class="v">Kích thước dạng người đọc được (4.0K, 2.1M) thay vì byte thô. Chỉ có nghĩa khi đi cùng <code>-l</code>.</span></div>
  <div class="kv"><span class="k">-t</span><span class="v">Sắp theo thời gian sửa, mới nhất trước. <code>ls -lat</code> là câu "gần đây ở đây có gì đổi?".</span></div>
</div>
<pre><code class="language-bash">ls -lah</code></pre>
<div class="out">total 48K
drwxr-xr-x  7 an an 4.0K Aug 21 14:20 .
drwxr-xr-x 12 an an 4.0K Aug 19 10:03 ..
-rw-r--r--  1 an an  312 Aug 19 10:05 .env
drwxr-xr-x  8 an an 4.0K Aug 21 14:20 .git
-rw-r--r--  1 an an 1.2K Aug 21 14:20 README.md</div>
<div class="callout ok">File "ẩn" không được bảo vệ và cũng không đặc biệt gì — luật đơn giản là <code>ls</code> bỏ qua những cái tên bắt đầu bằng <code>.</code> trừ khi bạn hỏi tới. Quy ước đó là lý do cấu hình sống ở <code>~/.bashrc</code> và <code>.env</code>: nó giữ cho thư mục nhà đọc được, chỉ vậy thôi.</div>

<h3>cd — di chuyển</h3>
${slide('lx-01', 5, 'pwd hỏi “tôi ở đâu”, cd di chuyển, cd - quay lại')}
<pre><code class="language-bash">cd src              <span class="tok-comment"># vào một thư mục con</span>
cd ..               <span class="tok-comment"># lên một cấp</span>
cd ~                <span class="tok-comment"># về nhà. Gõ 'cd' trơn cũng vậy.</span>
cd -                <span class="tok-comment"># về thư mục TRƯỚC ĐÓ — như Alt-Tab</span>
cd /var/log         <span class="tok-comment"># một đường dẫn tuyệt đối, đứng đâu cũng chạy</span></code></pre>
<div class="out">/home/an/projects/api/src
/home/an/projects/api
/home/an
/home/an/projects/api</div>
<p><code>cd -</code> là thứ người ta không tự khám phá ra, và đáng nhận ngay hôm nay: nhảy qua nhảy lại giữa một thư mục mã nguồn và một thư mục log chỉ còn tốn hai phím.</p>
<div class="callout warn"><strong>Đọc output ở trên thế nào cho đúng.</strong> Bản thân <code>cd</code> KHÔNG in gì khi thành công — im lặng nghĩa là thành công. Bốn dòng kia là chỗ <code>pwd</code> sẽ báo bạn đang đứng sau bốn lệnh đầu; lệnh <code>cd</code> duy nhất tự in ra là <code>cd -</code>, nó in thư mục vừa quay về (ở trên là <code>/home/an/projects/api</code>). Chạy khối lệnh mà không thấy gì hiện ra thì không có gì sai cả.</div>

<h3>Hình dạng của mọi câu lệnh</h3>
${slide('lx-01', 4, 'Mọi câu lệnh cùng một hình dạng — dấu cách là dao chẻ')}
<pre><code class="language-bash">ls   -l   --sort=size   /var/log
│     │        │            │
│     │        │            └─ tham số: tác động lên cái gì
│     │        └─ tuỳ chọn dài, hai gạch, thường nhận =giá trị
│     └─ tuỳ chọn ngắn, một gạch. Ghép được: -lah = -l -a -h
└─ tên lệnh</code></pre>
<div class="callout warn"><strong>Dấu cách ngăn cách các tham số — luôn luôn.</strong> Shell chẻ dòng của bạn theo khoảng trắng TRƯỚC khi chương trình nhìn thấy gì, nên <code>ls-l</code> là một lệnh không tồn tại, và <code>ls My Documents</code> là một yêu cầu về hai thư mục tên <code>My</code> và <code>Documents</code>. Một tên file có dấu cách buộc phải bọc nháy: <code>ls "My Documents"</code>. Chương 6 làm cho chuyện này thành hệ thống; còn giờ, hãy bọc nháy mọi thứ có dấu cách.</div>
<pre><code class="language-bash"><span class="tok-comment"># Cùng kết quả, ba cách gom các tuỳ chọn ngắn:</span>
ls -l -a -h
ls -lah
ls -la -h</code></pre>

<h3>Hoàn thành bằng Tab, và vì sao nó là một tính năng an toàn</h3>
<pre><code class="language-bash">cd pro&lt;Tab&gt;                  <span class="tok-comment"># tự hoàn thành thành projects/</span>
cd projects/ap&lt;Tab&gt;           <span class="tok-comment"># tự hoàn thành thành api/</span>
ls /var/lo&lt;Tab&gt;&lt;Tab&gt;          <span class="tok-comment"># hai lần Tab: liệt kê mọi khả năng</span></code></pre>
<div class="callout ok">Hoàn thành bằng Tab không chỉ là tiện. Một đường dẫn tự hoàn thành được nghĩa là nó <em>TỒN TẠI</em>; một đường dẫn không tự hoàn thành là một lỗi gõ mà bạn vừa bắt được trước khi chạy bất cứ thứ gì. Hãy gõ ba chữ đầu rồi bấm Tab thay vì gõ đủ cả đường dẫn — vừa nhanh hơn vừa kiểm chứng dọc đường.</div>

<h3>Ba lệnh đáng thêm vào ngay bây giờ</h3>
<pre><code>clear                 <span class="tok-comment"># xoá màn hình (hoặc Ctrl-L)</span>
history | tail -5     <span class="tok-comment"># tôi vừa chạy những gì?</span>
!!                     <span class="tok-comment"># lặp lại lệnh cuối</span>
sudo !!                <span class="tok-comment"># lặp lại nó kèm sudo — cách dùng kinh điển</span>
!543                   <span class="tok-comment"># chạy lệnh số 543 trong lịch sử</span></code></pre>
<div class="out">  541  pwd
  542  ls -lah
  543  cd /var/log
  544  ls
  545  history | tail -5</div>

<h3>Tự tra cứu ngay trong terminal: hỏi type trước</h3>
${slide('lx-01', 7, 'Trước khi tra cứu, hỏi type: lệnh này là loại gì?')}
<p>Mỗi lệnh bạn gõ thuộc một trong bốn LOẠI, và mỗi loại cất tài liệu ở một chỗ khác nhau. Hỏi <code>man</code> về sai loại là lý do phổ biến nhất khiến người mới kết luận "sách hướng dẫn vô dụng". Nên câu hỏi đầu tiên không phải "nó làm gì?" mà là "nó LÀ cái gì?" — và <code>type</code> trả lời trong một dòng.</p>
<pre><code>type -a ls
type cd
man cd
help cd | head -2</code></pre>
<div class="out">ls is aliased to &#96;ls --color=auto'
ls is /usr/bin/ls
ls is /bin/ls
cd is a shell builtin
No manual entry for cd
cd: cd [-L|[-P [-e]] [-@]] [dir]
    Change the shell working directory.</div>
<table>
<tr><th>type báo</th><th>Là gì</th><th>Tài liệu nằm ở đâu</th></tr>
<tr><td><code>is aliased to</code></td><td>Alias (tên tắt) do shell định nghĩa (Ubuntu đặt sẵn <code>ls='ls --color=auto'</code>)</td><td><code>alias ls</code> cho biết nó thành gì; rồi tra lệnh thật</td></tr>
<tr><td><code>is a shell builtin</code></td><td>Builtin (lệnh dựng sẵn) nằm TRONG bash: <code>cd</code>, <code>pwd</code>, <code>echo</code>, <code>type</code>, <code>history</code></td><td><code>help cd</code> — thường KHÔNG có trang man</td></tr>
<tr><td><code>is /usr/bin/ls</code></td><td>Một chương trình, một file trên đĩa</td><td><code>man ls</code>, <code>ls --help</code></td></tr>
<tr><td><code>is a function</code></td><td>Hàm shell (Chương 6)</td><td><code>type tên</code> in ra cả thân hàm</td></tr>
</table>
<p>Vì sao <code>cd</code> phải là builtin? Vì nó không thể là thứ gì khác. Một chương trình chạy thành tiến trình CON, và tiến trình con không đổi được thư mục hiện tại của tiến trình CHA — một <code>/usr/bin/cd</code> riêng sẽ đổi thư mục của chính nó rồi thoát, để lại shell của bạn đứng y chỗ cũ. Cùng lý lẽ đó làm <code>export</code> và <code>source</code> thành builtin. Chương 8 đào sâu <code>type</code>, <code>command -v</code> và vì sao <code>which</code> có thể nói sai.</p>

<h3>Trang man chia thành các mục có đánh số</h3>
${slide('lx-01', 8, 'man chia mục: passwd(1) là lệnh, passwd(5) là định dạng file')}
<p>Sách hướng dẫn (manual) được chia thành các mục (section), và cùng một cái tên có thể nằm ở nhiều mục. <code>passwd</code> vừa là một lệnh (mục 1) vừa là định dạng của file <code>/etc/passwd</code> (mục 5). Đó chính là nghĩa của con số trong ngoặc mỗi khi tài liệu viết <code>crontab(5)</code> hay <code>sshd(8)</code>.</p>
<pre><code>man -f passwd              <span class="tok-comment"># những mục nào có trang tên passwd? (= whatis)</span>
man 5 passwd | head -5     <span class="tok-comment"># hỏi thẳng mục 5</span></code></pre>
<div class="out">passwd (1)           - change user password
passwd (1ssl)        - OpenSSL application commands
passwd (5)           - the password file
PASSWD(5)		File Formats and Configuration		     PASSWD(5)

NAME
       passwd - the password file
</div>
<table>
<tr><th>Mục</th><th>Chứa gì</th><th>Bạn sẽ đọc</th></tr>
<tr><td><strong>1</strong></td><td>Lệnh của người dùng</td><td><code>man ls</code>, <code>man 1 passwd</code></td></tr>
<tr><td>2 · 3</td><td>Lời gọi hệ thống · hàm thư viện C</td><td><code>man 2 open</code> (cho người lập trình)</td></tr>
<tr><td>4</td><td>File đặc biệt trong <code>/dev</code></td><td><code>man 4 null</code></td></tr>
<tr><td><strong>5</strong></td><td>Định dạng file và file cấu hình</td><td><code>man 5 passwd</code>, <code>man 5 crontab</code>, <code>man 5 sshd_config</code></td></tr>
<tr><td>7</td><td>Tổng quan và quy ước</td><td><code>man 7 hier</code> (bài 1.3), <code>man 7 man-pages</code></td></tr>
<tr><td><strong>8</strong></td><td>Lệnh quản trị hệ thống, thường chỉ root dùng</td><td><code>man 8 mount</code>, <code>man 8 sshd</code></td></tr>
</table>
<div class="callout ok">Gõ <code>man passwd</code> trơn thì ra trang ĐẦU TIÊN tìm thấy theo thứ tự tra, mà mục 1 đứng trước mục 5 — nên bạn nhận trang về LỆNH, không phải về định dạng file. Khi đang sửa một file cấu hình, trang bạn cần gần như luôn nằm ở mục 5: <code>man 5 sshd_config</code> liệt kê mọi chỉ thị mà máy chủ SSH hiểu — đúng trang đã có thể giải thích sự cố <code>PasswordAuthentication</code> mà Chương 14 kể lại.</div>

<h3>Đọc một trang man trong less</h3>
${slide('lx-01', 9, 'man mở trong less: / tìm, n tới, q thoát — cách đọc SYNOPSIS')}
<p><code>man</code> không tự hiện trang; nó giao cho một <strong>pager (trình phân trang)</strong>, thường là <code>less</code>. Đúng chương trình đó mở ra khi bạn chạy <code>git log</code>, <code>systemctl status</code> hay <code>journalctl</code>, nên các phím dưới đây có ích xa hơn nhiều so với việc đọc sách hướng dẫn.</p>
<table>
<tr><th>Phím</th><th>Làm gì</th></tr>
<tr><td><code>Space</code> / <code>b</code></td><td>Xuống / lên một màn hình (<code>j</code>/<code>k</code> hoặc phím mũi tên: một dòng)</td></tr>
<tr><td><code>/chữ</code> rồi Enter</td><td>Tìm xuôi. <code>?chữ</code> tìm ngược</td></tr>
<tr><td><code>n</code> / <code>N</code></td><td>Kết quả kế tiếp / trước đó — cặp phím bạn bấm nhiều nhất</td></tr>
<tr><td><code>g</code> / <code>G</code></td><td>Nhảy về đầu / xuống cuối</td></tr>
<tr><td><code>&amp;chữ</code></td><td>Chỉ hiện những dòng chứa <em>chữ</em> (một bộ lọc; <code>&amp;</code> + Enter để bỏ lọc)</td></tr>
<tr><td><code>F</code></td><td>Bám theo file khi nó phình ra, như <code>tail -f</code>; <code>Ctrl</code>+<code>C</code> để thôi bám</td></tr>
<tr><td><code>h</code> / <code>q</code></td><td>Màn hình trợ giúp / thoát</td></tr>
</table>
<p>Một trang man có hình dạng cố định. Với <code>ls</code>, các đề mục là:</p>
<pre><code>man ls | col -b | grep '^[A-Z]'</code></pre>
<div class="out">LS(1)				 User Commands				 LS(1)
NAME
SYNOPSIS
DESCRIPTION
AUTHOR
REPORTING BUGS
COPYRIGHT
SEE ALSO</div>
<p>Đọc NAME để lấy câu tóm tắt một dòng, SYNOPSIS để thấy hình dạng câu lệnh, rồi tìm trong DESCRIPTION đúng cái cờ bạn cần. Để ý thứ bị THIẾU: <code>ls(1)</code> không có mục EXAMPLES (ví dụ). Rất nhiều trang GNU cũng không, và đó chính là khoảng trống mà <code>tldr</code> lấp vào (xem dưới). Phần SYNOPSIS dùng một ký pháp nhỏ, học một lần là xong:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">[OPTION]</span><span class="v">Ngoặc vuông: tuỳ chọn, có thể bỏ.</span></div>
  <div class="kv"><span class="k">...</span><span class="v">Lặp lại được: <code>[FILE]...</code> nghĩa là không, một hay nhiều file.</span></div>
  <div class="kv"><span class="k">CHỮ HOA</span><span class="v">Chỗ trống — thay bằng giá trị của bạn.</span></div>
  <div class="kv"><span class="k">a|b</span><span class="v">Chọn một trong các phương án.</span></div>
</div>
<pre><code>man ls                    <span class="tok-comment"># rồi gõ:  /^ *-r   và Enter — nhảy tới chỗ định nghĩa cờ -r</span>
less -N -S app.log        <span class="tok-comment"># -N đánh số dòng, -S không bẻ dòng dài (cuộn ngang)</span>
less +F app.log           <span class="tok-comment"># mở ra là bám theo cuối file luôn, như tail -f</span>
less -i app.log           <span class="tok-comment"># tìm không phân biệt hoa thường, trừ khi bạn gõ chữ hoa</span></code></pre>
<div class="callout ok">Tìm mỗi <code>-r</code> thì less dừng ở MỌI từ có chứa "-r". Neo vào đầu dòng bằng <code>^</code> và cho phép khoảng thụt đầu dòng bằng <code> *</code> sẽ đưa bạn thẳng tới dòng định nghĩa — một mẫu tìm dùng được ở mọi trang man.</div>

<h3>Khi không biết tên lệnh</h3>
${slide('lx-01', 10, 'Không nhớ tên lệnh? apropos. Nhớ tên, quên cờ? --help | grep')}
<pre><code class="language-bash">apropos -s 1 compress | wc -l                        <span class="tok-comment"># tìm trong dòng mô tả, chỉ mục 1</span>
apropos -s 1 compress | grep -E "^(gzip|xz|zstd) "
ls --help | grep -i "by file size"                   <span class="tok-comment"># biết lệnh, quên cờ</span>
help -d cd pwd                                       <span class="tok-comment"># tóm tắt một dòng của builtin</span></code></pre>
<div class="out">51
gzip (1)             - compress or expand files
xz (1)               - Compress or decompress .xz and .lzma files
zstd (1)             - zstd, zstdmt, unzstd, zstdcat - Compress or decompress...
  -S                         sort by file size, largest first
cd - Change the shell working directory.
pwd - Print the name of the current working directory.</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Không biết tên</div><div class="lz-d"><code>apropos từ-khoá</code> (giống <code>man -k</code>) tìm trong phần mô tả của mọi trang.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Biết tên, cần một cờ thật nhanh</div><div class="lz-d"><code>lệnh --help | grep -i từ</code> — một giây, đủ cho phần lớn trường hợp.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Cần hiểu cho kỹ</div><div class="lz-d"><code>man lệnh</code>, tìm bằng <code>/</code>. Cũng những trang đó có ở man7.org để đọc trên điện thoại.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Là builtin của bash</div><div class="lz-d"><code>help tên</code>; toàn bộ câu chuyện nằm trong <code>man bash</code>.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Muốn một ví dụ làm sẵn</div><div class="lz-d"><code>tldr lệnh</code>, hoặc cùng các trang cộng đồng đó ở tldr.sh.</div></div>
</div>
<div class="callout warn"><strong>Một bất ngờ với <code>tldr</code> đáng biết.</strong> Bản đóng gói sẵn của Ubuntu 24.04 (<code>tealdeer</code> 1.6.1) KHÔNG tải được bộ đệm trang khi bài này được thử ngày 28/09/2026 — <code>tldr --update</code> báo <code>Could not decompress downloaded ZIP archive</code>. Các trang vẫn ổn; cái máy khách cũ thì không. Hãy dùng trang web hoặc một bản mới hơn, đừng kết luận là công cụ hỏng hẳn. Và nếu <code>apropos</code> trả lời <code>nothing appropriate</code> trong một container Docker, đó là vì ảnh đã bị "minimize" (cắt gọn) bỏ trang man — trên máy chủ thật thì nó chạy.</div>

<h3>Chạy thử từng bước</h3>
<p>Chín lệnh, theo đúng thứ tự, trong sân tập của khoá. Hãy gõ chứ đừng dán; đoán trước output của từng lệnh.</p>
<pre><code class="language-bash">mkdir -p ~/thu-linux/ch1/api/{src,logs} &amp;&amp; cd ~/thu-linux/ch1/api
touch .env README.md src/app.ts
pwd
ls
ls -A
cd src &amp;&amp; pwd
cd ../logs
cd -
type pwd</code></pre>
<div class="out">/home/an/thu-linux/ch1/api
README.md  logs  src
.env  README.md  logs  src
/home/an/thu-linux/ch1/api/src
/home/an/thu-linux/ch1/api/src
pwd is a shell builtin</div>
<p>Đọc kết quả: <code>ls</code> giấu <code>.env</code> còn <code>ls -A</code> thì hiện; <code>cd ../logs</code> không in gì; <code>cd -</code> in thư mục nó vừa nhảy về (<code>src</code>); và <code>pwd</code> là builtin, nên tài liệu của nó là <code>help pwd</code>. (Output ghi trong container Ubuntu 24.04, người dùng <code>an</code>.)</p>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th>Thứ</th><th>Ubuntu / WSL</th><th>macOS (zsh, công cụ BSD)</th></tr>
<tr><td>Dấu nhắc</td><td><code>an@lab:~/projects/api$</code></td><td><code>admin@Cuong-Hoang lx-01 %</code> — <code>%</code> thay cho <code>\$</code>, chỉ tên thư mục cuối</td></tr>
<tr><td>Cờ dài của <code>ls</code></td><td><code>--sort=size</code>, <code>--time</code>, <code>--version</code> chạy được (GNU)</td><td><code>ls: unrecognized option &#96;--sort=size'</code> — dùng <code>-S</code>, <code>-t</code></td></tr>
<tr><td>Ký hiệu thêm sau cột quyền</td><td>không có (Fedora thêm <code>.</code> = nhãn SELinux)</td><td><code>@</code> = thuộc tính mở rộng, <code>+</code> = ACL: <code>-rw-r--r--@</code></td></tr>
<tr><td><code>help cd</code></td><td>chạy (builtin của bash)</td><td><code>zsh: command not found: help</code> — zsh không có <code>help</code>; gõ <code>bash</code> trước, hoặc đọc <code>man zshbuiltins</code></td></tr>
<tr><td><code>man</code>, <code>apropos</code></td><td>có trên bản cài thật</td><td>có (<code>/usr/bin/man</code>, <code>/usr/bin/apropos</code>)</td></tr>
</table>
<p>WSL2 chạy nhân và bộ công cụ Ubuntu thật, nên mọi thứ trong bài này hành xử y như trên VPS. Khác biệt lộ ra trên Mac, và chúng nhỏ nhưng gặp liên tục: một cờ dài của GNU "không tồn tại" trên macOS là trường hợp hay gặp nhất.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn cùng nhóm SWP391 cấp cho bạn quyền SSH vào máy chủ của nhóm và nói "API nằm đâu đó trong thư mục nhà, cấu hình nằm trong một file dấu chấm, tự tìm nhé". Tập trước trên máy của bạn, không Google.</p><ol>
<li>Dựng hiện trường: <code>mkdir -p ~/thu-linux/ch1/api/{src,logs} &amp;&amp; cd ~/thu-linux/ch1/api &amp;&amp; touch .env src/app.ts</code>.</li>
<li>Đọc to dấu nhắc của bạn: người dùng nào, máy nào, thư mục nào, và nó kết thúc bằng <code>\$</code>, <code>%</code> hay <code>#</code>?</li>
<li>Chạy <code>ls</code>, rồi <code>ls -A</code>. Gọi tên cái file chỉ lệnh thứ hai mới hiện ra.</li>
<li>Chạy <code>cd src</code>, <code>cd ../logs</code>, rồi — TRƯỚC khi bấm Enter — nói xem <code>cd -</code> sẽ in gì. Kiểm lại.</li>
<li>Chỉ dùng terminal: mục man nào mô tả định dạng của <code>/etc/passwd</code>, và cờ nào của builtin <code>pwd</code> đi xuyên qua symlink? (<code>man -f passwd</code>, <code>type pwd</code>, <code>help pwd</code>.)</li></ol>
<p><strong>Đạt khi:</strong> <code>ls -A</code> hiện ra <code>.env</code>; bạn đoán đúng <code>cd -</code> in <code>…/ch1/api/src</code>; và trả lời được "mục 5" và "<code>-P</code>" kèm lệnh đã chứng minh từng câu.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Prompt (dấu nhắc)</span><span class="v">Dòng chữ shell in trước con trỏ: người dùng, tên máy, thư mục hiện tại, và <code>\$</code> / <code>#</code>.</span></div>
  <div class="kv"><span class="k">Working directory (thư mục làm việc)</span><span class="v">Thư mục shell đang "đứng"; mọi đường dẫn tương đối bắt đầu từ đây. <code>pwd</code> in ra nó.</span></div>
  <div class="kv"><span class="k">Option / flag (tuỳ chọn / cờ)</span><span class="v">Công tắc đổi cách lệnh chạy: <code>-l</code> (ngắn) hay <code>--sort=size</code> (dài).</span></div>
  <div class="kv"><span class="k">Argument (tham số)</span><span class="v">Thứ lệnh tác động lên, đứng sau các cờ: <code>/var/log</code> trong <code>ls -l /var/log</code>.</span></div>
  <div class="kv"><span class="k">Builtin (lệnh dựng sẵn)</span><span class="v">Lệnh nằm ngay trong shell (<code>cd</code>, <code>pwd</code>); tra bằng <code>help</code>, không phải <code>man</code>.</span></div>
  <div class="kv"><span class="k">Man page / section (trang man / mục)</span><span class="v">Sách hướng dẫn của hệ thống, chia mục có số: 1 lệnh, 5 định dạng file, 8 lệnh quản trị.</span></div>
  <div class="kv"><span class="k">Pager (trình phân trang — less)</span><span class="v">Chương trình hiện chữ dài từng màn hình; <code>/</code> để tìm, <code>q</code> để thoát.</span></div>
  <div class="kv"><span class="k">Dotfile (file dấu chấm, file ẩn)</span><span class="v">File có tên bắt đầu bằng <code>.</code>; <code>ls</code> giấu đi trừ khi thêm <code>-a</code> hoặc <code>-A</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc dấu nhắc trước khi gõ: ai, máy nào, đang ở đâu — và <code>#</code> nghĩa là root, không còn lưới an toàn.</li>
<li>Mọi câu lệnh là <em>tên, cờ, tham số</em>, và shell chẻ chúng theo dấu cách trước khi chương trình thấy gì.</li>
<li><code>pwd</code> để kiểm, <code>cd -</code> để quay lại, Tab để gõ những đường dẫn chắc chắn có thật.</li>
<li><code>ls -A</code> hiện file dấu chấm mà <code>ls</code> trơn giấu đi — kiểm trước khi xoá hay chép một thư mục "trống".</li>
<li>Hỏi <code>type</code> trước: builtin tra bằng <code>help</code>, chương trình tra bằng <code>man</code> và <code>--help</code>.</li>
<li>Mục man có ý nghĩa (<code>passwd(1)</code> khác <code>passwd(5)</code>); trong <code>less</code>, ba phím cần nhớ là <code>/</code>, <code>n</code> và <code>q</code>.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/man.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">man(1) — sách hướng dẫn về chính sách hướng dẫn</span><span class="lc-sub">Danh sách các mục, <code>-k</code>, <code>-f</code>, <code>-a</code> và thứ tự tra hoạt động ra sao.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/less.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📜</span>
  <span class="lc-body"><span class="lc-title">less(1) — mọi phím và tuỳ chọn của trình phân trang</span><span class="lc-sub">Đúng màn hình bạn thấy khi bấm <code>h</code> trong less, ở dạng đọc được trên điện thoại.</span></span>
</a>
<a class="link-card" href="https://tldr.sh/" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">tldr pages — trợ giúp ngắn, ví dụ đi trước</span><span class="lc-sub">Tờ tra cứu do cộng đồng viết cho hàng nghìn lệnh; câu trả lời nhanh nhất cho "cho tôi xem một ví dụ thôi".</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man1/ls.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">ls(1) — mọi cái cờ, từ sách hướng dẫn</span><span class="lc-sub">Lướt qua phần sắp xếp và định dạng; phần còn lại hiếm khi cần.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: đi lại trong một cây thư mục khi bịt mắt</span><span class="lc-sub">Bài tập chấm điểm về pwd, ls, cd và đọc dấu nhắc.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tưởng <code>ls</code> hiện ra mọi thứ. Nó giấu các file dấu chấm theo mặc định, nên một thư mục trông như trống rỗng có thể đang chứa <code>.env</code>, <code>.git</code> và <code>.ssh</code>. Người ta xoá một thư mục vì tin rằng nó trống, hoặc chép một dự án mà thiếu mất cấu hình, đúng vì lý do này. Khi chuyện đó quan trọng, hãy dùng <code>ls -A</code> — như <code>-a</code> nhưng không có hai mục <code>.</code> và <code>..</code> làm rối output.</div>
<p class="note-ct"><strong>Thói quen cần tạo ngay từ bài một:</strong> <code>pwd</code> trước mọi việc phá huỷ, và bấm Tab thay vì gõ đường dẫn. Cả hai đều tốn chưa tới một giây, và cùng nhau chúng ngăn được nhóm tai nạn terminal phổ biến nhất — chạy đúng lệnh ở sai chỗ.</p>
</div>
`,
    },

    /* ─────────────────────────── 1.2 ─────────────────────────── */
    {
      title: '1.2 — Paths: absolute, relative, and the shortcuts|||1.2 — Đường dẫn: tuyệt đối, tương đối, và các lối tắt',
      slug: 'lnx-1-2-duong-dan',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Hệ thống đường dẫn mà mọi lệnh còn lại của khoá dựa vào: gốc /, tuyệt đối vs tương đối, . .. ~ -, vì sao ./script.sh cần dấu chấm, và cách đọc một đường dẫn dài mà không bị lạc.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>One tree, one root, no drive letters</h2>
<p class="lead">Windows has <code>C:\\</code>, <code>D:\\</code> and a separate tree per drive. Linux has exactly one tree, starting at <code>/</code>. A second disk, a USB stick, a network share — all of them appear as a directory <em>inside</em> that single tree. Once you accept that, every path in this course reads the same way.</p>
${slide('lx-01', 11, 'Linux có MỘT cây, gốc là / — ổ đĩa thứ hai chỉ là một thư mục')}

<pre><code>/                          <span class="tok-comment"># the root of everything</span>
/home                      <span class="tok-comment"># a directory inside root</span>
/home/an                   <span class="tok-comment"># your home directory</span>
/home/an/projects/api      <span class="tok-comment"># deeper still</span>
/mnt/usb                   <span class="tok-comment"># a USB stick — a directory, not a drive letter</span></code></pre>
<div class="callout ok">The leading <code>/</code> means "start from the root". Every other <code>/</code> is just a separator between names. That single character at the front is the entire difference between an absolute and a relative path — and it is the most consequential character in this lesson.</div>

<h3>Absolute vs relative</h3>
${slide('lx-01', 12, 'Tuyệt đối đi từ gốc, tương đối đi từ chỗ bạn đang đứng')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Absolute — starts with /</span><span class="lz-v"><code>/var/log/nginx/error.log</code>. Means the same thing from anywhere on the machine. Use it in scripts, in cron jobs, in systemd units.</span></div>
  <div class="lz-layer"><span class="lz-k">Relative — does not start with /</span><span class="lz-v"><code>src/app.ts</code>. Resolved from your current directory. Shorter to type, and meaningless without knowing where you are.</span></div>
</div>
<pre><code>pwd</code></pre>
<div class="out">/home/an/projects/api</div>
<pre><code class="language-bash"><span class="tok-comment"># These two are the same file, right now:</span>
cat src/app.ts
cat /home/an/projects/api/src/app.ts

<span class="tok-comment"># After moving, only one of them still works:</span>
cd /tmp
cat src/app.ts                              <span class="tok-comment"># cat: src/app.ts: No such file or directory</span>
cat /home/an/projects/api/src/app.ts        <span class="tok-comment"># still fine</span></code></pre>
<div class="callout warn">This is why a script that works when you run it by hand fails from <code>cron</code> or <code>systemd</code>: those start it in a different directory, so every relative path breaks. Chapter 7 gives the fix — but the rule is simple enough to adopt now: <strong>relative paths for typing, absolute paths for anything automated</strong>.</div>

<h3>The four shortcuts</h3>
${slide('lx-01', 13, 'Bốn lối tắt . .. ~ - do shell khai triển')}
<div class="kv-grid">
  <div class="kv"><span class="k">.</span><span class="v">The current directory. <code>cp file.txt .</code> means "copy it here".</span></div>
  <div class="kv"><span class="k">..</span><span class="v">The parent. Stackable: <code>../../etc</code> goes up twice, then into <code>etc</code>.</span></div>
  <div class="kv"><span class="k">~</span><span class="v">Your home directory, expanded by the shell to <code>/home/an</code>. <code>~/notes</code>, <code>~an</code> (another user's home).</span></div>
  <div class="kv"><span class="k">-</span><span class="v">Only for <code>cd</code>: the previous directory. Not a real path.</span></div>
</div>
<pre><code class="language-bash">cd ~/projects/api/src
cd ../tests            <span class="tok-comment"># up to api/, then into tests/</span>
pwd</code></pre>
<div class="out">/home/an/projects/api/tests</div>
<pre><code class="language-bash"><span class="tok-comment"># The shell expands ~ before the command sees it — proof:</span>
<span class="tok-keyword">echo</span> ~
<span class="tok-keyword">echo</span> <span class="tok-string">"~"</span></code></pre>
<div class="out">/home/an
~</div>
<div class="callout ok">The quoted version stays literal, which tells you <code>~</code> is a <em>shell</em> feature, not something <code>echo</code> understands. Same for <code>*</code> (Chapter 2) and <code>\$VAR</code> (Chapter 6): the shell rewrites your line first, and the program only ever sees the result.</div>

<h3>Why ./script.sh needs the dot</h3>
${slide('lx-01', 14, './deploy.sh cần ./ vì thư mục hiện tại không nằm trong PATH')}
<pre><code class="language-bash">ls
./deploy.sh            <span class="tok-comment"># works</span>
deploy.sh              <span class="tok-comment"># bash: deploy.sh: command not found</span></code></pre>
<p>A bare word is looked up in <code>PATH</code> — a list of system directories (Chapter 8). The current directory is deliberately <strong>not</strong> in that list, so <code>./</code> is how you say "the one right here, not one from PATH".</p>
<div class="callout danger">That exclusion is a security decision, not an oversight. If <code>.</code> were in <code>PATH</code>, an attacker could drop a file named <code>ls</code> into a shared directory and wait for someone to <code>cd</code> in and type <code>ls</code>. The extra two characters exist so that running a program from the current directory is always a deliberate act.</div>

<h3>Reading a long path without getting lost</h3>
<pre><code>/var/log/nginx/error.log
│   │   │     └─ the file
│   │   └─ per-service subdirectory
│   └─ where logs live (1.3)
└─ variable data — changes while the system runs</code></pre>
<p>Read right to left when you want the file, left to right when you want to understand where it sits. Long paths are rarely as complex as they look; they are a category, then a narrowing, then a name.</p>

<h3>Paths with spaces and awkward characters</h3>
${slide('lx-01', 15, 'Tên có dấu cách hay bắt đầu bằng “-”: bọc nháy, ./ và --')}
<pre><code class="language-bash"><span class="tok-comment"># Wrong — the shell sees two arguments:</span>
cd My Documents
<span class="tok-comment"># bash: cd: too many arguments</span>

<span class="tok-comment"># Right, three equivalent ways:</span>
cd <span class="tok-string">"My Documents"</span>
cd <span class="tok-string">'My Documents'</span>
cd My\\ Documents</code></pre>
<pre><code><span class="tok-comment"># A file whose name begins with a dash looks like an option. Use ./ or --:</span>
rm ./-weird-file
rm -- -weird-file</code></pre>
<div class="callout warn">Prefer double quotes as your habit. Chapter 6 shows that they also protect variables containing spaces — the single most common cause of scripts that work until someone creates a folder called "My Project". Quoting is cheap, and the bug it prevents is subtle.</div>

<h3>Two commands that make paths easier</h3>
<pre><code>realpath src/app.ts          <span class="tok-comment"># turn a relative path into an absolute one</span>
readlink -f /bin/sh          <span class="tok-comment"># follow symlinks to the real file (Chapter 2)</span>
basename /var/log/nginx/error.log
dirname  /var/log/nginx/error.log</code></pre>
<div class="out">/home/an/projects/api/src/app.ts
/usr/bin/dash
error.log
/var/log/nginx</div>
<p><code>basename</code> and <code>dirname</code> look trivial and become essential in Chapter 7, where a script needs to know its own location regardless of where it was started from.</p>

<h3>Run it step by step</h3>
<p>A walk through the sandbox from Lesson 1.1, checking every move. <code>realpath</code> turns any relative path into the absolute one it resolves to, so it is the honest way to answer "where would this take me?" before you go there.</p>
<pre><code class="language-javascript">cd ~/thu-linux/ch1/api/src &amp;&amp; pwd
realpath ../logs                    <span class="tok-comment"># where WOULD ../logs take me?</span>
cd ../.. &amp;&amp; pwd                     <span class="tok-comment"># two levels up</span>
cd api/src/../../api &amp;&amp; pwd         <span class="tok-comment"># a silly path — still resolves</span>
echo "console.log(1)" &gt; src/app.ts
realpath src/app.ts
cd /tmp &amp;&amp; cat src/app.ts           <span class="tok-comment"># relative path, wrong place</span>
cat ~/thu-linux/ch1/api/src/app.ts  <span class="tok-comment"># absolute path, any place</span></code></pre>
<div class="out">/home/an/thu-linux/ch1/api/src
/home/an/thu-linux/ch1/api/logs
/home/an/thu-linux/ch1
/home/an/thu-linux/ch1/api
/home/an/thu-linux/ch1/api/src/app.ts
cat: src/app.ts: No such file or directory
console.log(1)</div>
<p>The pair at the end is the whole lesson in two lines: the same file, one path that depends on where you stand and one that does not.</p>
<div class="callout warn"><strong>A dash-name trap you can only learn by running it.</strong> Create a file called <code>-v.txt</code> and try <code>rm -v.txt</code>. You do not get "unknown option -v" — <code>-v</code> <em>is</em> a real option of <code>rm</code> (verbose), so <code>rm</code> accepts it and then chokes on the next letter: <code>rm: invalid option -- '.'</code>. The error points at the wrong character, which is why this one confuses people. <code>rm ./-v.txt</code> or <code>rm -- -v.txt</code> both work.</div>

<h3>On macOS and WSL: what is different</h3>
<table>
<tr><th></th><th>Ubuntu (VPS)</th><th>macOS</th><th>WSL2 on Windows</th></tr>
<tr><td>Your home</td><td><code>/home/an</code></td><td><code>/Users/admin</code></td><td><code>/home/an</code> (inside Linux)</td></tr>
<tr><td>Another disk / USB</td><td><code>/mnt/…</code>, <code>/media/an/…</code></td><td><code>/Volumes/&lt;name&gt;</code></td><td>Windows drive C: is <code>/mnt/c</code></td></tr>
<tr><td>Case of names</td><td><strong>Sensitive</strong>: <code>README.md</code> ≠ <code>readme.md</code></td><td>Insensitive by default (APFS): <code>cat readme.md</code> opens <code>README.md</code></td><td>Sensitive in <code>/home</code>; <code>/mnt/c</code> follows Windows (insensitive)</td></tr>
<tr><td>Separator</td><td><code>/</code></td><td><code>/</code></td><td><code>/</code> inside WSL, <code>\\</code> on the Windows side</td></tr>
</table>
<pre><code class="language-bash"><span class="tok-comment"># Same file, same command, two systems:</span>
cat readme.md          <span class="tok-comment"># on Ubuntu (the file is README.md)</span>
cat readme.md          <span class="tok-comment"># on the Mac (the file is README.md)</span></code></pre>
<div class="out">cat: readme.md: No such file or directory
hi</div>
<p>This is the source of a classic group-project bug: an <code>import './Header'</code> that matches a file called <code>header.tsx</code> works on every teammate's Mac and fails on the Linux build server. Microsoft's own advice for WSL points the same way for a different reason: keep project files in the Linux file system (<code>/home/you/Project</code>), not under <code>/mnt/c</code>, because crossing between the two file systems is much slower.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a backup script in your group works when you run it from the project folder, and prints <code>No such file or directory</code> when the lecturer runs it from somewhere else. Reproduce the bug, then make it location-proof.</p><ol>
<li><code>cd ~/thu-linux/ch1/api &amp;&amp; echo "console.log(1)" &gt; src/app.ts</code>, then <code>cat src/app.ts</code> — it works here.</li>
<li>Reproduce the failure: <code>cd /tmp &amp;&amp; cat src/app.ts</code>. Read the error aloud: which directory did <code>cat</code> look in?</li>
<li>Go back with <code>cd -</code>, run <code>realpath src/app.ts</code>, and use the result to <code>cat</code> the file from <code>/tmp</code>.</li>
<li>In <code>~/thu-linux/ch1</code> create a folder <code>"Bao cao tuan 1"</code> and a file <code>./-v.txt</code>; enter the folder with one <code>cd</code>, then delete <code>-v.txt</code> without an error.</li>
<li>Print just the file name and just the folder of the path from step 3 with <code>basename</code> and <code>dirname</code>.</li></ol>
<p><strong>Done when:</strong> the absolute path prints <code>console.log(1)</code> while standing in <code>/tmp</code>; <code>pwd</code> shows <code>…/ch1/Bao cao tuan 1</code>; <code>ls -A ~/thu-linux/ch1</code> no longer lists <code>-v.txt</code>; and step 5 printed <code>app.ts</code> and <code>…/api/src</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Root directory (/)</span><span class="v">The top of the one tree; every absolute path starts here.</span></div>
  <div class="kv"><span class="k">Absolute path</span><span class="v">Starts with <code>/</code>; means the same thing from anywhere.</span></div>
  <div class="kv"><span class="k">Relative path</span><span class="v">No leading <code>/</code>; resolved from the current directory.</span></div>
  <div class="kv"><span class="k">Tilde expansion</span><span class="v">The shell replacing <code>~</code> with your home directory before the command runs.</span></div>
  <div class="kv"><span class="k">PATH</span><span class="v">The list of directories searched for a bare command name; the current directory is not in it.</span></div>
  <div class="kv"><span class="k">Quoting</span><span class="v">Wrapping a word in <code>"…"</code> or <code>'…'</code> so the shell treats spaces inside it as ordinary characters.</span></div>
  <div class="kv"><span class="k">Mount point</span><span class="v">A directory where another disk is attached to the tree: <code>/mnt/usb</code>, <code>/Volumes/USB</code>, <code>/mnt/c</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Linux has one tree rooted at <code>/</code>; extra disks appear as directories, not drive letters.</li>
<li>A leading <code>/</code> means "from the root"; anything else means "from where I am".</li>
<li>Relative paths for typing, absolute paths for cron, systemd and every script that others will run.</li>
<li><code>.</code> <code>..</code> <code>~</code> are expanded by the shell; quote a <code>~</code> and it stays literal.</li>
<li><code>./script.sh</code> is required because the current directory is deliberately not in <code>PATH</code>.</li>
<li>Quote names with spaces; use <code>./</code> or <code>--</code> for names starting with <code>-</code>; <code>realpath</code> shows where a path really goes.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/path_resolution.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">path_resolution(7) — how the kernel resolves a path</span><span class="lc-sub">The precise rules, including symlinks and permission checks along the way.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: reach a target directory in one cd, from anywhere</span><span class="lc-sub">Graded exercises on relative paths, .., ~ and quoting.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> a trailing slash changing what a command does. For <code>cd</code> and <code>ls</code> it is harmless. For <code>cp</code>, <code>mv</code> and especially <code>rsync</code> it is significant: <code>rsync src/ dest/</code> copies the <em>contents</em> of <code>src</code>, while <code>rsync src dest/</code> copies the <em>directory itself</em> into <code>dest</code>. One character, two very different outcomes — Chapter 9 covers it, and it is worth knowing the trap exists now.</div>
<p class="note-ct"><strong>The mental model to keep:</strong> there is one tree. Every path is either "start at the root" (leading <code>/</code>) or "start where I am" (no leading <code>/</code>). Every confusing "file not found" in this course reduces to that distinction plus <code>pwd</code>.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Một cái cây, một cái gốc, không có ký tự ổ đĩa</h2>
<p class="lead">Windows có <code>C:\\</code>, <code>D:\\</code> và mỗi ổ một cây riêng. Linux có đúng MỘT cây, bắt đầu từ <code>/</code>. Một cái đĩa thứ hai, một cái USB, một thư mục chia sẻ qua mạng — tất cả đều hiện ra như một thư mục <em>BÊN TRONG</em> cái cây duy nhất đó. Khi bạn chấp nhận điều đó, mọi đường dẫn trong khoá này đều đọc theo một kiểu.</p>
${slide('lx-01', 11, 'Linux có MỘT cây, gốc là / — ổ đĩa thứ hai chỉ là một thư mục')}

<pre><code>/                          <span class="tok-comment"># gốc của mọi thứ</span>
/home                      <span class="tok-comment"># một thư mục bên trong gốc</span>
/home/an                   <span class="tok-comment"># thư mục nhà của bạn</span>
/home/an/projects/api      <span class="tok-comment"># sâu hơn nữa</span>
/mnt/usb                   <span class="tok-comment"># một cái USB — một thư mục, không phải ký tự ổ đĩa</span></code></pre>
<div class="callout ok">Dấu <code>/</code> đứng đầu nghĩa là "bắt đầu từ gốc". Mọi dấu <code>/</code> khác chỉ là vạch ngăn giữa các tên. Đúng một ký tự ở đầu đó là toàn bộ khác biệt giữa đường dẫn tuyệt đối và tương đối — và nó là ký tự có hệ quả lớn nhất trong bài này.</div>

<h3>Tuyệt đối vs tương đối</h3>
${slide('lx-01', 12, 'Tuyệt đối đi từ gốc, tương đối đi từ chỗ bạn đang đứng')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Tuyệt đối — bắt đầu bằng /</span><span class="lz-v"><code>/var/log/nginx/error.log</code>. Đứng ở đâu trên máy nó cũng có cùng ý nghĩa. Hãy dùng trong script, trong cron, trong unit của systemd.</span></div>
  <div class="lz-layer"><span class="lz-k">Tương đối — không bắt đầu bằng /</span><span class="lz-v"><code>src/app.ts</code>. Được phân giải từ thư mục hiện tại của bạn. Gõ ngắn hơn, và vô nghĩa nếu không biết bạn đang đứng đâu.</span></div>
</div>
<pre><code>pwd</code></pre>
<div class="out">/home/an/projects/api</div>
<pre><code class="language-bash"><span class="tok-comment"># Ngay lúc này, hai cái này là cùng một file:</span>
cat src/app.ts
cat /home/an/projects/api/src/app.ts

<span class="tok-comment"># Sau khi chuyển chỗ, chỉ còn một cái chạy được:</span>
cd /tmp
cat src/app.ts                              <span class="tok-comment"># cat: src/app.ts: No such file or directory</span>
cat /home/an/projects/api/src/app.ts        <span class="tok-comment"># vẫn ổn</span></code></pre>
<div class="callout warn">Đây là lý do một script chạy tốt khi bạn gõ tay lại hỏng khi chạy từ <code>cron</code> hay <code>systemd</code>: chúng khởi động script ở một thư mục khác, nên mọi đường dẫn tương đối đều vỡ. Chương 7 đưa ra cách sửa — nhưng cái luật đủ đơn giản để nhận ngay bây giờ: <strong>đường dẫn tương đối để gõ tay, đường dẫn tuyệt đối cho mọi thứ tự động</strong>.</div>

<h3>Bốn lối tắt</h3>
${slide('lx-01', 13, 'Bốn lối tắt . .. ~ - do shell khai triển')}
<div class="kv-grid">
  <div class="kv"><span class="k">.</span><span class="v">Thư mục hiện tại. <code>cp file.txt .</code> nghĩa là "chép nó về đây".</span></div>
  <div class="kv"><span class="k">..</span><span class="v">Thư mục cha. Xếp chồng được: <code>../../etc</code> lên hai cấp rồi vào <code>etc</code>.</span></div>
  <div class="kv"><span class="k">~</span><span class="v">Thư mục nhà của bạn, được shell khai triển thành <code>/home/an</code>. <code>~/notes</code>, <code>~an</code> (nhà của người dùng khác).</span></div>
  <div class="kv"><span class="k">-</span><span class="v">Chỉ dùng với <code>cd</code>: thư mục trước đó. Không phải một đường dẫn thật.</span></div>
</div>
<pre><code class="language-bash">cd ~/projects/api/src
cd ../tests            <span class="tok-comment"># lên api/, rồi vào tests/</span>
pwd</code></pre>
<div class="out">/home/an/projects/api/tests</div>
<pre><code class="language-bash"><span class="tok-comment"># Shell khai triển ~ TRƯỚC khi lệnh nhìn thấy — bằng chứng:</span>
<span class="tok-keyword">echo</span> ~
<span class="tok-keyword">echo</span> <span class="tok-string">"~"</span></code></pre>
<div class="out">/home/an
~</div>
<div class="callout ok">Bản bọc nháy giữ nguyên chữ, và điều đó cho bạn biết <code>~</code> là một tính năng của <em>SHELL</em>, không phải thứ <code>echo</code> hiểu. Tương tự với <code>*</code> (Chương 2) và <code>\$VAR</code> (Chương 6): shell viết lại dòng của bạn trước, và chương trình chỉ bao giờ nhìn thấy kết quả.</div>

<h3>Vì sao ./script.sh cần dấu chấm</h3>
${slide('lx-01', 14, './deploy.sh cần ./ vì thư mục hiện tại không nằm trong PATH')}
<pre><code class="language-bash">ls
./deploy.sh            <span class="tok-comment"># chạy được</span>
deploy.sh              <span class="tok-comment"># bash: deploy.sh: command not found</span></code></pre>
<p>Một từ trần được tra trong <code>PATH</code> — một danh sách các thư mục hệ thống (Chương 8). Thư mục hiện tại CỐ Ý <strong>không</strong> nằm trong danh sách đó, nên <code>./</code> là cách bạn nói "cái ngay ở đây, không phải cái lấy từ PATH".</p>
<div class="callout danger">Việc loại trừ đó là một quyết định bảo mật, không phải sơ suất. Nếu <code>.</code> nằm trong <code>PATH</code>, kẻ tấn công có thể thả một file tên <code>ls</code> vào một thư mục dùng chung rồi chờ ai đó <code>cd</code> vào và gõ <code>ls</code>. Hai ký tự thêm vào tồn tại để việc chạy một chương trình từ thư mục hiện tại luôn là một hành động có chủ ý.</div>

<h3>Đọc một đường dẫn dài mà không bị lạc</h3>
<pre><code>/var/log/nginx/error.log
│   │   │     └─ tên file
│   │   └─ thư mục con theo từng dịch vụ
│   └─ nơi log sinh sống (bài 1.3)
└─ dữ liệu biến động — thay đổi trong lúc hệ thống chạy</code></pre>
<p>Đọc từ phải sang trái khi bạn cần cái file, đọc từ trái sang phải khi bạn muốn hiểu nó nằm ở đâu. Đường dẫn dài hiếm khi phức tạp như vẻ ngoài; chúng là một phạm trù, rồi một lần thu hẹp, rồi một cái tên.</p>

<h3>Đường dẫn có dấu cách và ký tự khó chịu</h3>
${slide('lx-01', 15, 'Tên có dấu cách hay bắt đầu bằng “-”: bọc nháy, ./ và --')}
<pre><code class="language-bash"><span class="tok-comment"># Sai — shell nhìn thấy hai tham số:</span>
cd My Documents
<span class="tok-comment"># bash: cd: too many arguments</span>

<span class="tok-comment"># Đúng, ba cách tương đương:</span>
cd <span class="tok-string">"My Documents"</span>
cd <span class="tok-string">'My Documents'</span>
cd My\\ Documents</code></pre>
<pre><code><span class="tok-comment"># Một file có tên bắt đầu bằng dấu gạch trông như một tuỳ chọn. Dùng ./ hoặc --:</span>
rm ./-weird-file
rm -- -weird-file</code></pre>
<div class="callout warn">Hãy để nháy kép thành thói quen. Chương 6 sẽ cho thấy nó còn bảo vệ những biến chứa dấu cách — nguyên nhân phổ biến nhất của những script chạy tốt cho tới khi có người tạo một thư mục tên "Dự án của tôi". Bọc nháy thì rẻ, còn con lỗi nó ngăn được thì tinh vi.</div>

<h3>Hai lệnh làm cho đường dẫn dễ thở hơn</h3>
<pre><code>realpath src/app.ts          <span class="tok-comment"># biến đường dẫn tương đối thành tuyệt đối</span>
readlink -f /bin/sh          <span class="tok-comment"># đi theo liên kết tới file thật (Chương 2)</span>
basename /var/log/nginx/error.log
dirname  /var/log/nginx/error.log</code></pre>
<div class="out">/home/an/projects/api/src/app.ts
/usr/bin/dash
error.log
/var/log/nginx</div>
<p><code>basename</code> và <code>dirname</code> trông tầm thường và trở nên thiết yếu ở Chương 7, nơi một script cần biết vị trí của chính nó bất kể nó được khởi động từ đâu.</p>

<h3>Chạy thử từng bước</h3>
<p>Một vòng đi qua sân tập của bài 1.1, kiểm từng bước. <code>realpath</code> biến mọi đường dẫn tương đối thành đường dẫn tuyệt đối mà nó thực sự trỏ tới, nên đó là cách trung thực để trả lời "lệnh này sẽ đưa tôi tới đâu?" trước khi đi.</p>
<pre><code class="language-javascript">cd ~/thu-linux/ch1/api/src &amp;&amp; pwd
realpath ../logs                    <span class="tok-comment"># ../logs SẼ đưa tôi tới đâu?</span>
cd ../.. &amp;&amp; pwd                     <span class="tok-comment"># lên hai cấp</span>
cd api/src/../../api &amp;&amp; pwd         <span class="tok-comment"># một đường vòng vô lý — vẫn phân giải được</span>
echo "console.log(1)" &gt; src/app.ts
realpath src/app.ts
cd /tmp &amp;&amp; cat src/app.ts           <span class="tok-comment"># tương đối, đứng sai chỗ</span>
cat ~/thu-linux/ch1/api/src/app.ts  <span class="tok-comment"># tuyệt đối, đứng đâu cũng được</span></code></pre>
<div class="out">/home/an/thu-linux/ch1/api/src
/home/an/thu-linux/ch1/api/logs
/home/an/thu-linux/ch1
/home/an/thu-linux/ch1/api
/home/an/thu-linux/ch1/api/src/app.ts
cat: src/app.ts: No such file or directory
console.log(1)</div>
<p>Cặp lệnh cuối là toàn bộ bài học gói trong hai dòng: cùng một file, một đường dẫn phụ thuộc vào chỗ bạn đứng và một đường dẫn thì không.</p>
<div class="callout warn"><strong>Một cái bẫy tên-có-gạch chỉ học được khi chạy thật.</strong> Tạo một file tên <code>-v.txt</code> rồi thử <code>rm -v.txt</code>. Bạn KHÔNG nhận được "không biết cờ -v" — <code>-v</code> LÀ một cờ thật của <code>rm</code> (verbose — in chi tiết), nên <code>rm</code> nhận nó rồi mắc nghẹn ở chữ kế tiếp: <code>rm: invalid option -- '.'</code>. Lỗi chỉ vào sai ký tự, và đó là lý do cái này làm người ta bối rối. <code>rm ./-v.txt</code> hoặc <code>rm -- -v.txt</code> đều chạy.</div>

<h3>Trên macOS và WSL khác gì</h3>
<table>
<tr><th></th><th>Ubuntu (VPS)</th><th>macOS</th><th>WSL2 trên Windows</th></tr>
<tr><td>Thư mục nhà</td><td><code>/home/an</code></td><td><code>/Users/admin</code></td><td><code>/home/an</code> (bên trong Linux)</td></tr>
<tr><td>Đĩa khác / USB</td><td><code>/mnt/…</code>, <code>/media/an/…</code></td><td><code>/Volumes/&lt;tên&gt;</code></td><td>Ổ C: của Windows là <code>/mnt/c</code></td></tr>
<tr><td>Chữ hoa/thường trong tên</td><td><strong>Phân biệt</strong>: <code>README.md</code> ≠ <code>readme.md</code></td><td>Mặc định KHÔNG phân biệt (APFS): <code>cat readme.md</code> mở được <code>README.md</code></td><td>Phân biệt trong <code>/home</code>; <code>/mnt/c</code> theo Windows (không phân biệt)</td></tr>
<tr><td>Dấu ngăn</td><td><code>/</code></td><td><code>/</code></td><td><code>/</code> bên trong WSL, <code>\\</code> ở phía Windows</td></tr>
</table>
<pre><code class="language-bash"><span class="tok-comment"># Cùng file, cùng lệnh, hai hệ thống:</span>
cat readme.md          <span class="tok-comment"># trên Ubuntu (file tên là README.md)</span>
cat readme.md          <span class="tok-comment"># trên Mac (file tên là README.md)</span></code></pre>
<div class="out">cat: readme.md: No such file or directory
hi</div>
<p>Đây là nguồn gốc của một lỗi kinh điển trong đồ án nhóm: một dòng <code>import './Header'</code> khớp với file tên <code>header.tsx</code> chạy ngon trên Mac của mọi người trong nhóm, rồi hỏng trên máy build Linux. Lời khuyên của chính Microsoft cho WSL cũng chỉ về cùng hướng, vì một lý do khác: để file dự án trong hệ thống file của Linux (<code>/home/bạn/Project</code>), không để dưới <code>/mnt/c</code>, vì đi qua lại giữa hai hệ thống file chậm hơn nhiều.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một script sao lưu của nhóm chạy tốt khi bạn chạy trong thư mục dự án, nhưng in <code>No such file or directory</code> khi giảng viên chạy từ chỗ khác. Hãy tái hiện lỗi, rồi làm cho nó chạy được ở bất cứ đâu.</p><ol>
<li><code>cd ~/thu-linux/ch1/api &amp;&amp; echo "console.log(1)" &gt; src/app.ts</code>, rồi <code>cat src/app.ts</code> — ở đây thì chạy.</li>
<li>Tái hiện lỗi: <code>cd /tmp &amp;&amp; cat src/app.ts</code>. Đọc to thông báo lỗi: <code>cat</code> đã tìm trong thư mục nào?</li>
<li>Quay lại bằng <code>cd -</code>, chạy <code>realpath src/app.ts</code>, rồi dùng kết quả đó để <code>cat</code> file khi đang đứng ở <code>/tmp</code>.</li>
<li>Trong <code>~/thu-linux/ch1</code> tạo thư mục <code>"Bao cao tuan 1"</code> và file <code>./-v.txt</code>; vào thư mục bằng MỘT lệnh <code>cd</code>, rồi xoá <code>-v.txt</code> mà không gặp lỗi.</li>
<li>In riêng tên file và riêng thư mục của đường dẫn ở bước 3 bằng <code>basename</code> và <code>dirname</code>.</li></ol>
<p><strong>Đạt khi:</strong> đường dẫn tuyệt đối in ra <code>console.log(1)</code> trong lúc đứng ở <code>/tmp</code>; <code>pwd</code> hiện <code>…/ch1/Bao cao tuan 1</code>; <code>ls -A ~/thu-linux/ch1</code> không còn <code>-v.txt</code>; và bước 5 in ra <code>app.ts</code> và <code>…/api/src</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Root directory (thư mục gốc, /)</span><span class="v">Đỉnh của cái cây duy nhất; mọi đường dẫn tuyệt đối bắt đầu từ đây.</span></div>
  <div class="kv"><span class="k">Absolute path (đường dẫn tuyệt đối)</span><span class="v">Bắt đầu bằng <code>/</code>; đứng đâu cũng mang cùng một nghĩa.</span></div>
  <div class="kv"><span class="k">Relative path (đường dẫn tương đối)</span><span class="v">Không có <code>/</code> đầu; được tính từ thư mục hiện tại.</span></div>
  <div class="kv"><span class="k">Tilde expansion (khai triển dấu ngã)</span><span class="v">Shell thay <code>~</code> bằng thư mục nhà của bạn trước khi lệnh chạy.</span></div>
  <div class="kv"><span class="k">PATH (danh sách đường tìm lệnh)</span><span class="v">Các thư mục được lục khi bạn gõ một tên lệnh trần; thư mục hiện tại không nằm trong đó.</span></div>
  <div class="kv"><span class="k">Quoting (bọc nháy)</span><span class="v">Bọc một từ trong <code>"…"</code> hoặc <code>'…'</code> để shell coi dấu cách bên trong là ký tự bình thường.</span></div>
  <div class="kv"><span class="k">Mount point (điểm gắn)</span><span class="v">Thư mục nơi một đĩa khác được treo vào cây: <code>/mnt/usb</code>, <code>/Volumes/USB</code>, <code>/mnt/c</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Linux có một cây, gốc là <code>/</code>; đĩa thêm vào hiện ra như thư mục, không phải ký tự ổ đĩa.</li>
<li><code>/</code> đứng đầu nghĩa là "từ gốc"; không có thì nghĩa là "từ chỗ tôi đang đứng".</li>
<li>Gõ tay dùng tương đối; cron, systemd và mọi script người khác sẽ chạy thì dùng tuyệt đối.</li>
<li><code>.</code> <code>..</code> <code>~</code> do shell khai triển; bọc nháy <code>~</code> thì nó giữ nguyên chữ.</li>
<li>Phải gõ <code>./script.sh</code> vì thư mục hiện tại cố ý không nằm trong <code>PATH</code>.</li>
<li>Bọc nháy tên có dấu cách; dùng <code>./</code> hoặc <code>--</code> cho tên bắt đầu bằng <code>-</code>; <code>realpath</code> cho biết một đường dẫn thật sự dẫn tới đâu.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/path_resolution.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">path_resolution(7) — kernel phân giải một đường dẫn thế nào</span><span class="lc-sub">Luật chính xác, gồm cả symlink và các phép kiểm quyền dọc đường.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: tới đúng một thư mục đích bằng một lệnh cd, từ bất cứ đâu</span><span class="lc-sub">Bài tập chấm điểm về đường dẫn tương đối, .., ~ và bọc nháy.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> một dấu gạch chéo ở cuối làm đổi hành vi của lệnh. Với <code>cd</code> và <code>ls</code> thì vô hại. Với <code>cp</code>, <code>mv</code> và nhất là <code>rsync</code> thì rất quan trọng: <code>rsync src/ dest/</code> chép <em>NỘI DUNG</em> của <code>src</code>, còn <code>rsync src dest/</code> chép <em>CẢ THƯ MỤC</em> vào trong <code>dest</code>. Một ký tự, hai kết cục rất khác nhau — Chương 9 nói kỹ, và đáng biết là cái bẫy đó tồn tại ngay từ bây giờ.</div>
<p class="note-ct"><strong>Mô hình cần giữ:</strong> chỉ có MỘT cái cây. Mọi đường dẫn hoặc là "bắt đầu ở gốc" (có <code>/</code> đứng đầu) hoặc là "bắt đầu ở chỗ tôi đang đứng" (không có). Mọi lỗi "file not found" khó hiểu trong khoá này đều quy về phân biệt đó cộng với <code>pwd</code>.</p>
</div>
`,
    },

    /* ─────────────────────────── 1.3 ─────────────────────────── */
    {
      title: '1.3 — The filesystem hierarchy: what every top folder is for|||1.3 — Cây thư mục: mỗi thư mục gốc để làm gì',
      slug: 'lnx-1-3-cay-thu-muc',
      type: 'LESSON',
      description: 'Tham quan / và ý nghĩa của từng thư mục gốc, ba chỗ bạn thật sự đụng tới hằng ngày (/etc, /var, /home), nơi phần mềm bạn cài đi vào, và luật quyết định đặt file mới ở đâu.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Every directory has a job</h2>
<p class="lead">The top of a Linux filesystem looks arbitrary until you learn the question it answers: <em>who writes this, and does it survive a reinstall?</em> Once you can place a file by that rule, "where does this belong?" and "why is this here?" both become easy.</p>

<pre><code class="language-bash">ls /</code></pre>
<div class="out">bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run
sbin  srv  sys  tmp  usr  var</div>
${slide('lx-01', 16, 'Cây FHS: mỗi thư mục gốc có một nhiệm vụ')}

<h3>The three you will actually use</h3>
${slide('lx-01', 17, 'Đặt file đúng chỗ = trả lời 2 câu: ai ghi vào, cài lại có mất không?')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">/etc</span><span class="lz-v"><strong>Configuration.</strong> Plain text, edited by administrators, machine-specific. <code>/etc/nginx/</code>, <code>/etc/ssh/sshd_config</code>, <code>/etc/hosts</code>. Never binaries, never data.</span></div>
  <div class="lz-layer"><span class="lz-k">/var</span><span class="lz-v"><strong>Variable data.</strong> Things that grow while the system runs: <code>/var/log</code> (logs), <code>/var/lib</code> (databases), <code>/var/www</code> (websites). This is the directory that fills your disk.</span></div>
  <div class="lz-layer"><span class="lz-k">/home</span><span class="lz-v"><strong>Users.</strong> One directory per person: <code>/home/an</code>. Your files, your dotfiles, your projects. Root's home is <code>/root</code>, deliberately elsewhere.</span></div>
</div>
<pre><code class="language-bash">ls /etc | head -6
ls /var/log | head -6</code></pre>
<div class="out">apt
crontab
fstab
hostname
hosts
nginx

auth.log
dpkg.log
journal
nginx
syslog
unattended-upgrades</div>

<h3>Where programs live</h3>
${slide('lx-01', 18, '/bin chỉ là lối tắt vào /usr/bin; script của bạn ở /usr/local/bin')}
<div class="kv-grid">
  <div class="kv"><span class="k">/usr/bin</span><span class="v">Almost every command you type. <code>ls</code>, <code>grep</code>, <code>python3</code>. Managed by the package manager.</span></div>
  <div class="kv"><span class="k">/usr/sbin</span><span class="v">System binaries, normally for root: <code>sshd</code>, <code>useradd</code>, <code>iptables</code>.</span></div>
  <div class="kv"><span class="k">/usr/local/bin</span><span class="v">Programs <em>you</em> installed outside the package manager. The right place for your own scripts — it is in <code>PATH</code> and the package manager never touches it.</span></div>
  <div class="kv"><span class="k">/opt</span><span class="v">Large self-contained third-party software that ships its own tree: <code>/opt/google/chrome</code>.</span></div>
  <div class="kv"><span class="k">/bin, /sbin, /lib</span><span class="v">On modern systems these are symlinks into <code>/usr</code>. Historical; treat them as the same place.</span></div>
</div>
<pre><code class="language-bash">ls -ld /bin
<span class="tok-keyword">type</span> -a ls python3</code></pre>
<div class="out">lrwxrwxrwx 1 root root 7 Apr 22  2024 /bin -&gt; usr/bin
ls is aliased to &#96;ls --color=auto'
ls is /usr/bin/ls
ls is /bin/ls
python3 is /usr/bin/python3
python3 is /bin/python3</div>
<div class="callout ok"><strong>Put your own scripts in <code>/usr/local/bin</code>.</strong> It is in <code>PATH</code> on every distribution, and no package upgrade will overwrite them — which is exactly the risk of dropping a script into <code>/usr/bin</code>. Chapter 7 finishes the story with the shebang line and the executable bit.</div>

<h3>The virtual ones — not files at all</h3>
${slide('lx-01', 19, '/proc, /sys, /dev không nằm trên đĩa')}
<pre><code class="language-bash">cat /proc/uptime
cat /sys/class/net/eth0/address
ls -l /dev/null /dev/urandom | head -2</code></pre>
<div class="out">184223.41 892011.09
02:42:ac:11:00:02
crw-rw-rw- 1 root root 1, 3 Aug 21 09:00 /dev/null
crw-rw-rw- 1 root root 1, 9 Aug 21 09:00 /dev/urandom</div>
<div class="kv-grid">
  <div class="kv"><span class="k">/proc</span><span class="v">Processes and kernel state, generated on read. <code>/proc/1234/</code> is process 1234 (Chapter 5).</span></div>
  <div class="kv"><span class="k">/sys</span><span class="v">Devices and drivers. Where you read a MAC address or set screen brightness.</span></div>
  <div class="kv"><span class="k">/dev</span><span class="v">Device files. <code>/dev/sda</code> (a disk), <code>/dev/null</code> (the wastebasket), <code>/dev/urandom</code>.</span></div>
  <div class="kv"><span class="k">/run</span><span class="v">Runtime state since boot — PID files, sockets. Lives in memory and is emptied on reboot.</span></div>
</div>
<p>None of these exist on disk. They are the kernel presenting itself through the file interface from 0.2, which is why <code>cat</code> and <code>grep</code> work on them.</p>

<h3>The temporary ones</h3>
${slide('lx-01', 20, 'Ba máy, ba bản đồ: Ubuntu · Fedora · macOS')}
<div class="kv-grid">
  <div class="kv"><span class="k">/tmp</span><span class="v">Anyone can write. <strong>Cleared on reboot</strong>, and often sooner. Perfect for scratch work; never for anything you want tomorrow.</span></div>
  <div class="kv"><span class="k">/var/tmp</span><span class="v">Also temporary, but survives a reboot. For work in progress that spans a restart.</span></div>
  <div class="kv"><span class="k">/mnt, /media</span><span class="v">Mount points. <code>/media</code> is where desktops auto-mount USB sticks; <code>/mnt</code> is for manual mounts (Chapter 10).</span></div>
</div>
<div class="callout warn"><code>/tmp</code> is world-writable, which makes it a classic attack surface: a script that writes to a predictable name like <code>/tmp/backup.sql</code> can be tricked into overwriting a file someone else created there first. Use <code>mktemp</code> instead — Chapter 7 shows the safe pattern.</div>

<h3>The rule for deciding where a new file goes</h3>
${slide('lx-01', 21, 'File mới đi đâu? 5 câu hỏi — và du chỉ ra ai ăn đĩa')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Is it configuration a human edits?</div><div class="lz-d">→ <code>/etc</code> for the system, or <code>~/.config</code> for one user.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Does it grow while the service runs?</div><div class="lz-d">→ <code>/var</code>. Logs in <code>/var/log</code>, data in <code>/var/lib/&lt;app&gt;</code>.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Is it a program you installed by hand?</div><div class="lz-d">→ <code>/usr/local/bin</code>, or <code>/opt</code> if it brings its own tree.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Is it yours and personal?</div><div class="lz-d">→ <code>/home/you</code>. Nothing personal belongs anywhere else.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Is it throwaway?</div><div class="lz-d">→ <code>/tmp</code>, via <code>mktemp</code>, and accept that it may vanish.</div></div>
</div>

<h3>Seeing the shape of a tree</h3>
<pre><code>tree -L 1 /var
du -sh /var/* 2&gt;/dev/null | sort -rh | head -5</code></pre>
<div class="out">/var
├── backups
├── cache
├── lib
├── log
├── spool
└── tmp

2.1G	/var/lib
890M	/var/log
412M	/var/cache
18M	/var/backups</div>
<p>That second command is the first tool you will reach for when a server reports a full disk — Chapter 10 develops it into a full procedure, but the shape of the answer is already visible here.</p>

<h3>Why /bin is only a shortcut now</h3>
<p>The type output above lists <code>ls</code> twice — <code>/usr/bin/ls</code> and <code>/bin/ls</code> — yet there is only one file. Look at the root directory in long form and the reason is visible:</p>
<pre><code class="language-bash">ls -l / | grep -- "-&gt;"
readlink -f /bin/ls</code></pre>
<div class="out">lrwxrwxrwx   1 root root    7 Apr 22  2024 bin -&gt; usr/bin
lrwxrwxrwx   1 root root    7 Apr 22  2024 lib -&gt; usr/lib
lrwxrwxrwx   1 root root    8 Apr 22  2024 sbin -&gt; usr/sbin
/usr/bin/ls</div>
<p>Historically <code>/bin</code> held the few programs needed to boot before <code>/usr</code> (often a separate disk) was mounted. Modern distributions merged the two, and the old names survive as symbolic links so that every script written with <code>#!/bin/bash</code> still works. The output above is an arm64 container; on an x86-64 VPS you will also see <code>lib64 -&gt; usr/lib64</code>. Since <code>PATH</code> contains both <code>/usr/bin</code> and <code>/bin</code>, <code>type -a</code> finds the same file twice — two roads, one destination.</p>

<h3>Three machines, three maps</h3>
<p>You work on three systems, and each one bends the standard a little. All values below were read on the machines themselves on 28/09/2026.</p>
<table>
<tr><th></th><th>Ubuntu 24.04 (VPS)</th><th>Fedora 44 (home PC)</th><th>macOS (Mac M1)</th></tr>
<tr><td>Home</td><td><code>/home/an</code></td><td><code>/home/an</code></td><td><code>/Users/admin</code></td></tr>
<tr><td><code>/etc</code>, <code>/tmp</code>, <code>/var</code></td><td>real directories</td><td>real directories</td><td>symlinks into <code>/private</code>: <code>/etc -&gt; private/etc</code></td></tr>
<tr><td><code>/tmp</code> lives in</td><td>the disk; emptied at boot, files older than 30 days removed</td><td>RAM (<code>tmpfs</code>); files older than 10 days removed</td><td><code>/private/tmp</code></td></tr>
<tr><td><code>/var/tmp</code></td><td>not cleaned automatically</td><td>files older than 30 days removed</td><td><code>/private/var/tmp</code></td></tr>
<tr><td><code>/bin</code></td><td>symlink to <code>usr/bin</code></td><td>symlink to <code>usr/bin</code></td><td>a real directory (protected by the OS)</td></tr>
<tr><td>Your own tools</td><td><code>/usr/local/bin</code></td><td><code>/usr/local/bin</code></td><td><code>/opt/homebrew/bin</code> (Homebrew)</td></tr>
<tr><td>USB / extra disks</td><td><code>/media/an/…</code>, <code>/mnt</code></td><td><code>/run/media/an/…</code>, <code>/mnt</code></td><td><code>/Volumes/…</code></td></tr>
</table>
<pre><code class="language-bash"><span class="tok-comment"># Ubuntu 24.04 — who cleans /tmp, and how:</span>
grep -v '^#' /usr/lib/tmpfiles.d/tmp.conf
<span class="tok-comment"># Fedora 44 — same file, different rules, and /tmp is in RAM:</span>
grep -v '^#' /usr/lib/tmpfiles.d/tmp.conf ; findmnt -no FSTYPE /tmp</code></pre>
<div class="out">D /tmp 1777 root root 30d

q /tmp 1777 root root 10d
q /var/tmp 1777 root root 30d
tmpfs</div>
<p>Read the first letter as the action (<code>D</code> = create the directory and empty it at boot, <code>q</code> = create it, and age out old files), then the mode, owner, group and the age limit. The mode <code>1777</code> is why <code>ls -ld /tmp</code> shows <code>drwxrwxrwt</code> — everyone may write, and the trailing <code>t</code> (the sticky bit, Chapter 4) stops people deleting each other's files. The practical rule survives every difference: <strong>nothing you need tomorrow belongs in <code>/tmp</code></strong>.</p>
<pre><code class="language-bash"><span class="tok-comment"># macOS — the root looks nothing like FHS:</span>
ls /
ls -ld /etc /tmp /var</code></pre>
<div class="out">Applications  bin  cores  dev  etc  home  Library  opt  pkg  private  sbin  System  tmp  Users  usr  var  Volumes
lrwxr-xr-x@ 1 root  wheel  11 Sep  3 17:34 /etc -&gt; private/etc
lrwxr-xr-x@ 1 root  wheel  11 Sep  3 17:34 /tmp -&gt; private/tmp
lrwxr-xr-x@ 1 root  wheel  11 Sep  3 17:34 /var -&gt; private/var</div>

<h3>Run it step by step</h3>
<p>Do this in a throwaway container so you can poke at <code>/</code> freely: <code>docker run --rm -it ubuntu:24.04 bash</code> (or on your VPS, read-only). Five commands, one map.</p>
<pre><code class="language-bash">ls -ld /proc /sys /tmp                  <span class="tok-comment"># size 0 = generated by the kernel; the t = sticky</span>
cat /proc/uptime                        <span class="tok-comment"># seconds since boot — a "file" that is never on disk</span>
ls -l /dev/null /dev/zero               <span class="tok-comment"># c = character device, "1, 3" = driver numbers</span>
du -sh /var/* 2&gt;/dev/null | sort -rh | head -3
tree -L 1 /var                          <span class="tok-comment"># apt-get install -y tree first, in the container</span></code></pre>
<div class="out">dr-xr-xr-x 266 root root    0 Sep 28 08:39 /proc
dr-xr-xr-x  11 root root    0 Sep 28 08:41 /sys
drwxrwxrwt   1 root root 4096 Sep 28 08:44 /tmp
404389.05 4009949.29
crw-rw-rw- 1 root root 1, 3 Sep 28 08:39 /dev/null
crw-rw-rw- 1 root root 1, 5 Sep 28 08:39 /dev/zero
63M	/var/lib
2.9M	/var/cache
440K	/var/log
/var
|-- backups
|-- cache
|-- lib
|-- local
|-- lock -&gt; /run/lock
|-- log
|-- mail
|-- opt
|-- run -&gt; /run
|-- spool
&#96;-- tmp

12 directories, 0 files</div>
<p>Two things to notice. <code>tree</code> drew its lines with <code>|--</code> because the container has no UTF-8 locale; with <code>LANG=C.UTF-8</code> you get the <code>├──</code> seen earlier. And even in a fresh container <code>/var/lib</code> is the heaviest directory — on a real server with PostgreSQL and Docker it is usually measured in gigabytes, which is exactly where the "disk full while deploying" incident started.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> you inherit your group's VPS and must write a two-line "map" for the team: where the configuration is, where the data grows, and where a new nightly backup script and its log should go. Do it in a throwaway container: <code>docker run --rm -it ubuntu:24.04 bash</code>.</p><ol>
<li>Run <code>ls -l /</code> and list every entry that is a symlink, with its target.</li>
<li>Prove that <code>/bin/ls</code> and <code>/usr/bin/ls</code> are one file: <code>readlink -f /bin/ls</code> and <code>ls -li /bin/ls /usr/bin/ls</code> (compare the first column, the inode number).</li>
<li>Run <code>ls -ld /proc /sys /tmp</code>. Which two have size 0, and what does the last letter of <code>/tmp</code>'s permissions say?</li>
<li>Find the three biggest things under <code>/var</code>: <code>du -sh /var/* 2&gt;/dev/null | sort -rh | head -3</code>.</li>
<li>Decide the paths for a script <code>backup-db</code>, its settings, and its log, then check each parent exists: <code>ls -ld /usr/local/bin /etc /var/log</code>.</li></ol>
<p><strong>Done when:</strong> your symlink list is <code>bin</code>, <code>lib</code>, <code>sbin</code> (plus <code>lib64</code> on x86-64); both <code>ls -li</code> lines show the same inode number; you named <code>/proc</code> and <code>/sys</code> and the sticky <code>t</code>; <code>/var/lib</code> tops the <code>du</code> list; and your map reads <code>/usr/local/bin/backup-db</code>, <code>/etc/backup-db/…</code>, <code>/var/log/backup-db/…</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">FHS</span><span class="v">Filesystem Hierarchy Standard — the agreement on what each top-level directory is for.</span></div>
  <div class="kv"><span class="k">/etc</span><span class="v">Machine-specific configuration, plain text, edited by administrators.</span></div>
  <div class="kv"><span class="k">/var (variable data)</span><span class="v">Data that grows while services run: logs, databases, caches.</span></div>
  <div class="kv"><span class="k">/usr/local</span><span class="v">Software installed by you, outside the package manager; never overwritten by upgrades.</span></div>
  <div class="kv"><span class="k">Virtual filesystem</span><span class="v">Directories like <code>/proc</code> and <code>/sys</code> whose "files" are generated by the kernel when read.</span></div>
  <div class="kv"><span class="k">tmpfs</span><span class="v">A filesystem that lives in RAM; its contents vanish at reboot (Fedora's <code>/tmp</code>).</span></div>
  <div class="kv"><span class="k">Merged /usr</span><span class="v">The modern layout where <code>/bin</code>, <code>/sbin</code>, <code>/lib</code> are symlinks into <code>/usr</code>.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Place a file by two questions: who writes it, and does it survive a reinstall?</li>
<li><code>/etc</code> is configuration, <code>/var</code> is data that grows, <code>/home</code> is people — and <code>/var/lib</code> is what fills disks.</li>
<li>Your own programs go in <code>/usr/local/bin</code>; <code>/usr/bin</code> belongs to the package manager.</li>
<li><code>/bin</code>, <code>/sbin</code>, <code>/lib</code> are now symlinks into <code>/usr</code>, so one program can appear under two paths.</li>
<li><code>/proc</code>, <code>/sys</code>, <code>/dev</code>, <code>/run</code> are the kernel talking through files; nothing there is on disk.</li>
<li><code>/tmp</code> rules differ per system (disk vs RAM, 10 vs 30 days) — the only safe assumption is that it will disappear.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/hier.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">hier(7) — the filesystem hierarchy, from the manual</span><span class="lc-sub">One page describing every top-level directory. Available offline as <code>man hier</code>.</span></span>
</a>
<a class="link-card" href="https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Filesystem Hierarchy Standard 3.0</span><span class="lc-sub">The specification distributions follow. Worth skimming once to settle any "where should this go?" argument.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> installing your own software into <code>/usr/bin</code> because that is where the other commands are. The package manager owns that directory and will happily overwrite or remove your file during an upgrade, with no warning — and you will spend an hour wondering why a script that worked for months has vanished. <code>/usr/local/bin</code> exists precisely for this, and is already in <code>PATH</code>.</div>
<p class="note-ct"><strong>Why this pays off in Chapter 12:</strong> diagnosing an unfamiliar server starts with knowing where to look. Configuration is in <code>/etc</code>, logs are in <code>/var/log</code>, the service's data is in <code>/var/lib</code>, and what is running is visible in <code>/proc</code>. That map turns "I have no idea where anything is" into four directories to check.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Mỗi thư mục có một nhiệm vụ</h2>
<p class="lead">Phần trên cùng của một hệ thống file Linux trông tuỳ tiện cho tới khi bạn học được câu hỏi mà nó trả lời: <em>AI ghi vào đây, và nó có sống sót qua một lần cài lại không?</em> Khi bạn xếp được một file theo luật đó thì cả "cái này thuộc về đâu?" lẫn "vì sao cái này ở đây?" đều thành dễ.</p>

<pre><code class="language-bash">ls /</code></pre>
<div class="out">bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run
sbin  srv  sys  tmp  usr  var</div>
${slide('lx-01', 16, 'Cây FHS: mỗi thư mục gốc có một nhiệm vụ')}

<h3>Ba thư mục bạn thật sự dùng</h3>
${slide('lx-01', 17, 'Đặt file đúng chỗ = trả lời 2 câu: ai ghi vào, cài lại có mất không?')}
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">/etc</span><span class="lz-v"><strong>Cấu hình.</strong> Văn bản thuần, do quản trị viên sửa, riêng theo từng máy. <code>/etc/nginx/</code>, <code>/etc/ssh/sshd_config</code>, <code>/etc/hosts</code>. Không bao giờ chứa file nhị phân, không bao giờ chứa dữ liệu.</span></div>
  <div class="lz-layer"><span class="lz-k">/var</span><span class="lz-v"><strong>Dữ liệu biến động.</strong> Những thứ phình ra trong lúc hệ thống chạy: <code>/var/log</code> (log), <code>/var/lib</code> (cơ sở dữ liệu), <code>/var/www</code> (website). Đây là cái thư mục làm đầy đĩa của bạn.</span></div>
  <div class="lz-layer"><span class="lz-k">/home</span><span class="lz-v"><strong>Người dùng.</strong> Mỗi người một thư mục: <code>/home/an</code>. File của bạn, các file dấu chấm của bạn, dự án của bạn. Nhà của root là <code>/root</code>, cố ý nằm chỗ khác.</span></div>
</div>
<pre><code class="language-bash">ls /etc | head -6
ls /var/log | head -6</code></pre>
<div class="out">apt
crontab
fstab
hostname
hosts
nginx

auth.log
dpkg.log
journal
nginx
syslog
unattended-upgrades</div>

<h3>Chương trình sống ở đâu</h3>
${slide('lx-01', 18, '/bin chỉ là lối tắt vào /usr/bin; script của bạn ở /usr/local/bin')}
<div class="kv-grid">
  <div class="kv"><span class="k">/usr/bin</span><span class="v">Gần như mọi lệnh bạn gõ. <code>ls</code>, <code>grep</code>, <code>python3</code>. Do trình quản lý gói quản lý.</span></div>
  <div class="kv"><span class="k">/usr/sbin</span><span class="v">File nhị phân hệ thống, thường dành cho root: <code>sshd</code>, <code>useradd</code>, <code>iptables</code>.</span></div>
  <div class="kv"><span class="k">/usr/local/bin</span><span class="v">Chương trình do <em>BẠN</em> cài ngoài trình quản lý gói. Chỗ đúng cho script của chính bạn — nó nằm trong <code>PATH</code> và trình quản lý gói không bao giờ đụng tới.</span></div>
  <div class="kv"><span class="k">/opt</span><span class="v">Phần mềm bên thứ ba cỡ lớn, tự đóng gói và mang theo cây thư mục riêng: <code>/opt/google/chrome</code>.</span></div>
  <div class="kv"><span class="k">/bin, /sbin, /lib</span><span class="v">Trên hệ thống đời mới, đây là symlink trỏ vào <code>/usr</code>. Mang tính lịch sử; cứ coi chúng là cùng một chỗ.</span></div>
</div>
<pre><code class="language-bash">ls -ld /bin
<span class="tok-keyword">type</span> -a ls python3</code></pre>
<div class="out">lrwxrwxrwx 1 root root 7 Apr 22  2024 /bin -&gt; usr/bin
ls is aliased to &#96;ls --color=auto'
ls is /usr/bin/ls
ls is /bin/ls
python3 is /usr/bin/python3
python3 is /bin/python3</div>
<div class="callout ok"><strong>Hãy đặt script của chính bạn vào <code>/usr/local/bin</code>.</strong> Nó nằm trong <code>PATH</code> ở mọi bản phân phối, và không lần nâng cấp gói nào ghi đè lên chúng — đó chính xác là rủi ro của việc thả một script vào <code>/usr/bin</code>. Chương 7 kể nốt câu chuyện với dòng shebang và bit thực thi.</div>

<h3>Những thư mục ảo — hoàn toàn không phải file</h3>
${slide('lx-01', 19, '/proc, /sys, /dev không nằm trên đĩa')}
<pre><code class="language-bash">cat /proc/uptime
cat /sys/class/net/eth0/address
ls -l /dev/null /dev/urandom | head -2</code></pre>
<div class="out">184223.41 892011.09
02:42:ac:11:00:02
crw-rw-rw- 1 root root 1, 3 Aug 21 09:00 /dev/null
crw-rw-rw- 1 root root 1, 9 Aug 21 09:00 /dev/urandom</div>
<div class="kv-grid">
  <div class="kv"><span class="k">/proc</span><span class="v">Tiến trình và trạng thái kernel, sinh ra vào lúc đọc. <code>/proc/1234/</code> chính là tiến trình 1234 (Chương 5).</span></div>
  <div class="kv"><span class="k">/sys</span><span class="v">Thiết bị và trình điều khiển. Nơi bạn đọc địa chỉ MAC hay chỉnh độ sáng màn hình.</span></div>
  <div class="kv"><span class="k">/dev</span><span class="v">File thiết bị. <code>/dev/sda</code> (một cái đĩa), <code>/dev/null</code> (sọt rác), <code>/dev/urandom</code>.</span></div>
  <div class="kv"><span class="k">/run</span><span class="v">Trạng thái từ lúc khởi động — file PID, socket. Nằm trong bộ nhớ và bị xoá sạch khi khởi động lại.</span></div>
</div>
<p>Không cái nào trong số này tồn tại trên đĩa. Chúng là kernel tự phơi mình ra qua giao diện file ở bài 0.2, và vì thế <code>cat</code> và <code>grep</code> chạy được trên chúng.</p>

<h3>Những thư mục tạm</h3>
${slide('lx-01', 20, 'Ba máy, ba bản đồ: Ubuntu · Fedora · macOS')}
<div class="kv-grid">
  <div class="kv"><span class="k">/tmp</span><span class="v">Ai cũng ghi được. <strong>Bị xoá khi khởi động lại</strong>, và thường là sớm hơn. Hoàn hảo cho việc nháp; không bao giờ dành cho thứ bạn còn cần ngày mai.</span></div>
  <div class="kv"><span class="k">/var/tmp</span><span class="v">Cũng là tạm, nhưng sống sót qua một lần khởi động lại. Dành cho việc đang dở kéo dài qua một lần restart.</span></div>
  <div class="kv"><span class="k">/mnt, /media</span><span class="v">Điểm gắn kết. <code>/media</code> là nơi máy để bàn tự gắn USB; <code>/mnt</code> dành cho việc gắn thủ công (Chương 10).</span></div>
</div>
<div class="callout warn"><code>/tmp</code> cho cả thế giới ghi vào, và điều đó biến nó thành một bề mặt tấn công kinh điển: một script ghi vào một cái tên đoán được như <code>/tmp/backup.sql</code> có thể bị lừa để ghi đè lên một file mà người khác đã tạo sẵn ở đó. Hãy dùng <code>mktemp</code> thay vì thế — Chương 7 chỉ mẫu an toàn.</div>

<h3>Luật quyết định một file mới đi đâu</h3>
${slide('lx-01', 21, 'File mới đi đâu? 5 câu hỏi — và du chỉ ra ai ăn đĩa')}
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Có phải cấu hình do con người sửa không?</div><div class="lz-d">→ <code>/etc</code> cho cả hệ thống, hoặc <code>~/.config</code> cho một người dùng.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Nó có phình ra khi dịch vụ chạy không?</div><div class="lz-d">→ <code>/var</code>. Log ở <code>/var/log</code>, dữ liệu ở <code>/var/lib/&lt;ứng dụng&gt;</code>.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Có phải chương trình bạn cài tay không?</div><div class="lz-d">→ <code>/usr/local/bin</code>, hoặc <code>/opt</code> nếu nó mang theo cây riêng.</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Có phải của riêng bạn không?</div><div class="lz-d">→ <code>/home/bạn</code>. Không thứ gì mang tính cá nhân thuộc về nơi khác.</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Có phải thứ vứt đi không?</div><div class="lz-d">→ <code>/tmp</code>, qua <code>mktemp</code>, và chấp nhận rằng nó có thể biến mất.</div></div>
</div>

<h3>Nhìn thấy hình dạng của một cây</h3>
<pre><code>tree -L 1 /var
du -sh /var/* 2&gt;/dev/null | sort -rh | head -5</code></pre>
<div class="out">/var
├── backups
├── cache
├── lib
├── log
├── spool
└── tmp

2.1G	/var/lib
890M	/var/log
412M	/var/cache
18M	/var/backups</div>
<p>Lệnh thứ hai đó là công cụ đầu tiên bạn sẽ vớ lấy khi một máy chủ báo đầy đĩa — Chương 10 phát triển nó thành một quy trình đầy đủ, nhưng hình dạng của câu trả lời đã nhìn thấy được ngay ở đây.</p>

<h3>Vì sao /bin giờ chỉ còn là lối tắt</h3>
<p>Output của <code>type</code> ở trên liệt kê <code>ls</code> HAI lần — <code>/usr/bin/ls</code> và <code>/bin/ls</code> — trong khi chỉ có một file. Nhìn thư mục gốc ở dạng dài là thấy lý do:</p>
<pre><code class="language-bash">ls -l / | grep -- "-&gt;"
readlink -f /bin/ls</code></pre>
<div class="out">lrwxrwxrwx   1 root root    7 Apr 22  2024 bin -&gt; usr/bin
lrwxrwxrwx   1 root root    7 Apr 22  2024 lib -&gt; usr/lib
lrwxrwxrwx   1 root root    8 Apr 22  2024 sbin -&gt; usr/sbin
/usr/bin/ls</div>
<p>Ngày xưa <code>/bin</code> chứa vài chương trình cần để khởi động trước khi <code>/usr</code> (thường là một đĩa riêng) được gắn vào. Các bản phân phối đời mới đã gộp hai chỗ làm một, và các tên cũ sống tiếp dưới dạng symlink (liên kết tượng trưng) để mọi script viết <code>#!/bin/bash</code> vẫn chạy. Output trên lấy từ container arm64; trên VPS x86-64 bạn sẽ thấy thêm <code>lib64 -&gt; usr/lib64</code>. Vì <code>PATH</code> chứa cả <code>/usr/bin</code> lẫn <code>/bin</code>, <code>type -a</code> tìm thấy cùng một file hai lần — hai con đường, một đích đến.</p>

<h3>Ba máy, ba tấm bản đồ</h3>
<p>Bạn làm việc trên ba hệ thống, và mỗi cái bẻ tiêu chuẩn đi một chút. Mọi giá trị dưới đây được đọc ngay trên máy thật ngày 28/09/2026.</p>
<table>
<tr><th></th><th>Ubuntu 24.04 (VPS)</th><th>Fedora 44 (máy nhà)</th><th>macOS (Mac M1)</th></tr>
<tr><td>Thư mục nhà</td><td><code>/home/an</code></td><td><code>/home/an</code></td><td><code>/Users/admin</code></td></tr>
<tr><td><code>/etc</code>, <code>/tmp</code>, <code>/var</code></td><td>thư mục thật</td><td>thư mục thật</td><td>symlink vào <code>/private</code>: <code>/etc -&gt; private/etc</code></td></tr>
<tr><td><code>/tmp</code> nằm ở</td><td>trên đĩa; bị làm rỗng lúc khởi động, file cũ hơn 30 ngày bị xoá</td><td>trong RAM (<code>tmpfs</code>); file cũ hơn 10 ngày bị xoá</td><td><code>/private/tmp</code></td></tr>
<tr><td><code>/var/tmp</code></td><td>không tự dọn</td><td>file cũ hơn 30 ngày bị xoá</td><td><code>/private/var/tmp</code></td></tr>
<tr><td><code>/bin</code></td><td>symlink tới <code>usr/bin</code></td><td>symlink tới <code>usr/bin</code></td><td>thư mục thật (hệ điều hành bảo vệ)</td></tr>
<tr><td>Công cụ tự cài</td><td><code>/usr/local/bin</code></td><td><code>/usr/local/bin</code></td><td><code>/opt/homebrew/bin</code> (Homebrew)</td></tr>
<tr><td>USB / đĩa thêm</td><td><code>/media/an/…</code>, <code>/mnt</code></td><td><code>/run/media/an/…</code>, <code>/mnt</code></td><td><code>/Volumes/…</code></td></tr>
</table>
<pre><code class="language-bash"><span class="tok-comment"># Ubuntu 24.04 — ai dọn /tmp, và dọn thế nào:</span>
grep -v '^#' /usr/lib/tmpfiles.d/tmp.conf
<span class="tok-comment"># Fedora 44 — cùng file, luật khác, và /tmp nằm trong RAM:</span>
grep -v '^#' /usr/lib/tmpfiles.d/tmp.conf ; findmnt -no FSTYPE /tmp</code></pre>
<div class="out">D /tmp 1777 root root 30d

q /tmp 1777 root root 10d
q /var/tmp 1777 root root 30d
tmpfs</div>
<p>Đọc chữ đầu là hành động (<code>D</code> = tạo thư mục và làm rỗng nó lúc khởi động, <code>q</code> = tạo nó, và dọn file cũ theo tuổi), rồi tới quyền, chủ, nhóm và hạn tuổi. Quyền <code>1777</code> là lý do <code>ls -ld /tmp</code> hiện <code>drwxrwxrwt</code> — ai cũng được ghi, và chữ <code>t</code> ở cuối (sticky bit, Chương 4) chặn người này xoá file của người kia. Luật thực tế thì đứng vững qua mọi khác biệt: <strong>thứ gì bạn còn cần ngày mai thì không thuộc về <code>/tmp</code></strong>.</p>
<pre><code class="language-bash"><span class="tok-comment"># macOS — thư mục gốc trông chẳng giống FHS chút nào:</span>
ls /
ls -ld /etc /tmp /var</code></pre>
<div class="out">Applications  bin  cores  dev  etc  home  Library  opt  pkg  private  sbin  System  tmp  Users  usr  var  Volumes
lrwxr-xr-x@ 1 root  wheel  11 Sep  3 17:34 /etc -&gt; private/etc
lrwxr-xr-x@ 1 root  wheel  11 Sep  3 17:34 /tmp -&gt; private/tmp
lrwxr-xr-x@ 1 root  wheel  11 Sep  3 17:34 /var -&gt; private/var</div>

<h3>Chạy thử từng bước</h3>
<p>Làm trong một container vứt đi để được thoải mái chọc vào <code>/</code>: <code>docker run --rm -it ubuntu:24.04 bash</code> (hoặc trên VPS, chỉ đọc). Năm lệnh, một tấm bản đồ.</p>
<pre><code class="language-bash">ls -ld /proc /sys /tmp                  <span class="tok-comment"># cỡ 0 = do nhân sinh ra; chữ t = sticky</span>
cat /proc/uptime                        <span class="tok-comment"># số giây từ lúc bật — một "file" không bao giờ nằm trên đĩa</span>
ls -l /dev/null /dev/zero               <span class="tok-comment"># c = thiết bị ký tự, "1, 3" = số hiệu driver</span>
du -sh /var/* 2&gt;/dev/null | sort -rh | head -3
tree -L 1 /var                          <span class="tok-comment"># trong container: apt-get install -y tree trước</span></code></pre>
<div class="out">dr-xr-xr-x 266 root root    0 Sep 28 08:39 /proc
dr-xr-xr-x  11 root root    0 Sep 28 08:41 /sys
drwxrwxrwt   1 root root 4096 Sep 28 08:44 /tmp
404389.05 4009949.29
crw-rw-rw- 1 root root 1, 3 Sep 28 08:39 /dev/null
crw-rw-rw- 1 root root 1, 5 Sep 28 08:39 /dev/zero
63M	/var/lib
2.9M	/var/cache
440K	/var/log
/var
|-- backups
|-- cache
|-- lib
|-- local
|-- lock -&gt; /run/lock
|-- log
|-- mail
|-- opt
|-- run -&gt; /run
|-- spool
&#96;-- tmp

12 directories, 0 files</div>
<p>Hai điều cần để ý. <code>tree</code> vẽ bằng <code>|--</code> vì container không có locale UTF-8; đặt <code>LANG=C.UTF-8</code> thì ra <code>├──</code> như ở trên. Và ngay cả trong một container mới tinh, <code>/var/lib</code> vẫn là thư mục nặng nhất — trên máy chủ thật có PostgreSQL và Docker thì nó thường tính bằng gigabyte, và đó đúng là chỗ sự cố "đầy đĩa giữa lúc deploy" bắt đầu.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn nhận lại VPS của nhóm và phải viết một "tấm bản đồ" hai dòng cho cả nhóm: cấu hình nằm đâu, dữ liệu phình ở đâu, và một script sao lưu hằng đêm mới cùng log của nó nên đặt ở đâu. Làm trong một container vứt đi: <code>docker run --rm -it ubuntu:24.04 bash</code>.</p><ol>
<li>Chạy <code>ls -l /</code> và liệt kê mọi mục là symlink, kèm đích của nó.</li>
<li>Chứng minh <code>/bin/ls</code> và <code>/usr/bin/ls</code> là một file: <code>readlink -f /bin/ls</code> và <code>ls -li /bin/ls /usr/bin/ls</code> (so cột đầu tiên, số inode).</li>
<li>Chạy <code>ls -ld /proc /sys /tmp</code>. Hai cái nào có cỡ 0, và chữ cuối trong cột quyền của <code>/tmp</code> nói lên điều gì?</li>
<li>Tìm ba thứ lớn nhất dưới <code>/var</code>: <code>du -sh /var/* 2&gt;/dev/null | sort -rh | head -3</code>.</li>
<li>Chọn đường dẫn cho script <code>backup-db</code>, cấu hình của nó và log của nó, rồi kiểm các thư mục cha có tồn tại: <code>ls -ld /usr/local/bin /etc /var/log</code>.</li></ol>
<p><strong>Đạt khi:</strong> danh sách symlink của bạn là <code>bin</code>, <code>lib</code>, <code>sbin</code> (thêm <code>lib64</code> trên máy x86-64); hai dòng <code>ls -li</code> cùng một số inode; bạn gọi đúng <code>/proc</code>, <code>/sys</code> và chữ <code>t</code> sticky; <code>/var/lib</code> đứng đầu danh sách <code>du</code>; và bản đồ của bạn ghi <code>/usr/local/bin/backup-db</code>, <code>/etc/backup-db/…</code>, <code>/var/log/backup-db/…</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">FHS (tiêu chuẩn cây thư mục)</span><span class="v">Filesystem Hierarchy Standard — bản thoả thuận mỗi thư mục gốc dùng để làm gì.</span></div>
  <div class="kv"><span class="k">/etc (cấu hình)</span><span class="v">Cấu hình riêng của từng máy, văn bản thuần, do quản trị viên sửa.</span></div>
  <div class="kv"><span class="k">/var (dữ liệu biến động)</span><span class="v">Dữ liệu phình ra khi dịch vụ chạy: log, cơ sở dữ liệu, bộ đệm.</span></div>
  <div class="kv"><span class="k">/usr/local (cài tay)</span><span class="v">Phần mềm do bạn cài ngoài trình quản lý gói; nâng cấp không bao giờ ghi đè.</span></div>
  <div class="kv"><span class="k">Virtual filesystem (hệ thống file ảo)</span><span class="v">Thư mục như <code>/proc</code>, <code>/sys</code> mà "file" do nhân sinh ra lúc bạn đọc.</span></div>
  <div class="kv"><span class="k">tmpfs (hệ thống file trong RAM)</span><span class="v">Nằm trong bộ nhớ; nội dung biến mất khi khởi động lại (<code>/tmp</code> của Fedora).</span></div>
  <div class="kv"><span class="k">Merged /usr (gộp /usr)</span><span class="v">Bố cục đời mới: <code>/bin</code>, <code>/sbin</code>, <code>/lib</code> là symlink trỏ vào <code>/usr</code>.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đặt một file bằng hai câu hỏi: ai ghi vào nó, và nó có sống sót qua một lần cài lại không?</li>
<li><code>/etc</code> là cấu hình, <code>/var</code> là dữ liệu phình ra, <code>/home</code> là con người — và <code>/var/lib</code> là thứ làm đầy đĩa.</li>
<li>Chương trình của riêng bạn đặt ở <code>/usr/local/bin</code>; <code>/usr/bin</code> thuộc về trình quản lý gói.</li>
<li><code>/bin</code>, <code>/sbin</code>, <code>/lib</code> giờ là symlink vào <code>/usr</code>, nên một chương trình có thể hiện ra dưới hai đường dẫn.</li>
<li><code>/proc</code>, <code>/sys</code>, <code>/dev</code>, <code>/run</code> là nhân nói chuyện qua file; không thứ gì ở đó nằm trên đĩa.</li>
<li>Luật của <code>/tmp</code> khác nhau theo từng hệ (đĩa hay RAM, 10 hay 30 ngày) — giả định an toàn duy nhất là nó sẽ biến mất.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man7/hier.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">hier(7) — cây thư mục, từ sách hướng dẫn</span><span class="lc-sub">Một trang mô tả mọi thư mục gốc. Có sẵn ngoại tuyến qua <code>man hier</code>.</span></span>
</a>
<a class="link-card" href="https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Filesystem Hierarchy Standard 3.0</span><span class="lc-sub">Bản đặc tả mà các bản phân phối tuân theo. Đáng lướt một lần để dàn xếp mọi tranh cãi "cái này nên để đâu?".</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> cài phần mềm của chính bạn vào <code>/usr/bin</code> vì các lệnh khác đều ở đó. Trình quản lý gói sở hữu thư mục đó và sẽ vui vẻ ghi đè hoặc gỡ bỏ file của bạn trong một lần nâng cấp, không hề cảnh báo — và bạn sẽ mất một giờ thắc mắc vì sao một script chạy tốt suốt nhiều tháng bỗng biến mất. <code>/usr/local/bin</code> tồn tại chính xác cho việc này, và nó đã nằm sẵn trong <code>PATH</code>.</div>
<p class="note-ct"><strong>Vì sao điều này sinh lời ở Chương 12:</strong> chẩn đoán một máy chủ lạ bắt đầu bằng việc biết phải nhìn vào đâu. Cấu hình ở <code>/etc</code>, log ở <code>/var/log</code>, dữ liệu của dịch vụ ở <code>/var/lib</code>, và thứ đang chạy thì nhìn thấy được trong <code>/proc</code>. Tấm bản đồ đó biến "tôi chẳng biết cái gì nằm ở đâu" thành bốn thư mục cần kiểm.</p>
</div>
`,
    },

    /* ─────────────────────────── 1.4 ─────────────────────────── */
    {
      title: '1.4 — Looking closely: ls -l, file, stat|||1.4 — Nhìn cho kỹ: ls -l, file, stat',
      slug: 'lnx-1-4-nhin-ky-mot-file',
      type: 'LESSON',
      description: 'Đọc từng cột của ls -l, ba dấu thời gian mà mọi file đều có, dùng file để biết một thứ THẬT SỰ là gì thay vì tin phần đuôi tên, và inode giải thích vì sao xoá được file mà đĩa vẫn đầy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Reading a directory listing properly</h2>
<p class="lead"><code>ls -l</code> prints seven columns and most people read two of them. The other five answer questions you will keep asking: who owns this, when did it change, why can I not write to it, and is it even a real file?</p>

<pre><code class="language-bash">ls -l /var/log</code></pre>
<div class="out">total 2884
-rw-r-----  1 syslog adm    184320 Aug 21 14:20 auth.log
drwxr-xr-x  2 root   root     4096 Aug 19 10:03 nginx
lrwxrwxrwx  1 root   root       19 Aug 19 10:03 syslog -> /var/log/syslog.1
-rw-r--r--  1 root   root  2621440 Aug 21 09:14 syslog.1</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">1st character</span><span class="lz-v">Type. <code>-</code> regular file · <code>d</code> directory · <code>l</code> symbolic link · <code>c</code>/<code>b</code> device · <code>s</code> socket · <code>p</code> pipe.</span></div>
  <div class="lz-layer"><span class="lz-k">rw-r-----</span><span class="lz-v">Permissions in three groups of three: owner, group, everyone else. Chapter 4 is entirely this.</span></div>
  <div class="lz-layer"><span class="lz-k">1 / 2</span><span class="lz-v">Link count. For a directory it is 2 + the number of subdirectories, which is why an empty directory shows 2.</span></div>
  <div class="lz-layer"><span class="lz-k">syslog adm</span><span class="lz-v">Owning user, then owning group. Two separate things, and the source of most permission confusion.</span></div>
  <div class="lz-layer"><span class="lz-k">184320</span><span class="lz-v">Size in bytes. For a directory this is the size of the listing, not of its contents — a 4096-byte directory can hold gigabytes.</span></div>
  <div class="lz-layer"><span class="lz-k">Aug 21 14:20</span><span class="lz-v">Modification time. Within the last six months you get a clock; older than that, a year instead.</span></div>
  <div class="lz-layer"><span class="lz-k">-&gt; /var/log/syslog.1</span><span class="lz-v">Only on links: what it points at. Chapter 2 covers links properly.</span></div>
</div>
${slide('lx-01', 22, 'ls -l in 7 cột — đọc từng cột một')}
${slide('lx-01', 23, 'Ký tự đầu là LOẠI file — lưới quyền rwx')}
<div class="callout warn">The size column for a <em>directory</em> misleads everybody once. <code>drwxr-xr-x 2 root root 4096</code> does not mean the directory holds 4 KB — it means the listing itself occupies one 4 KB block. To find out how much is inside, you need <code>du</code> (Chapter 10), which walks the tree and adds it up.</div>

<h3>Sorting a listing to answer a question</h3>
${slide('lx-01', 24, 'Sắp xếp để trả lời một câu hỏi: -S, -t, -r')}
<pre><code class="language-bash">ls -lhS /var/log | head -4          <span class="tok-comment"># biggest first — what is filling this?</span>
ls -lt /var/log | head -4            <span class="tok-comment"># newest first — what changed just now?</span>
ls -ltr /var/log | tail -4           <span class="tok-comment"># newest LAST — the most useful form</span></code></pre>
<div class="out">total 2.9M
-rw-r-----  1 root   adm   2.5M Aug 21 09:14 syslog.1
-rw-r-----  1 syslog adm   180K Aug 21 14:20 auth.log
-rw-r--r--  1 root   root   68K Aug 20 03:11 dpkg.log</div>
<div class="callout ok"><code>ls -ltr</code> is worth making a habit. Reversing the sort puts the newest entries at the <em>bottom</em>, right above your prompt — so on a directory with two hundred files you see what you came for without scrolling. The same reasoning applies to any long output: end it where your eyes already are.</div>

<h3>Three timestamps, not one</h3>
${slide('lx-01', 25, 'stat: ba dấu thời gian — chmod đổi ctime, không đổi mtime')}
<pre><code>stat /var/log/auth.log</code></pre>
<div class="out">  File: /var/log/auth.log
  Size: 184320    	Blocks: 360        IO Block: 4096   regular file
Device: 8,1	Inode: 1049601     Links: 1
Access: (0640/-rw-r-----)  Uid: (  104/ syslog)   Gid: (   4/     adm)
Access: 2026-08-21 14:22:03.114 +0700
Modify: 2026-08-21 14:20:51.882 +0700
Change: 2026-08-21 14:20:51.882 +0700</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Access (atime)</span><span class="v">Last read. Often disabled for performance, so do not rely on it.</span></div>
  <div class="kv"><span class="k">Modify (mtime)</span><span class="v">Contents last changed. This is what <code>ls -l</code> shows and what <code>find -mtime</code> tests.</span></div>
  <div class="kv"><span class="k">Change (ctime)</span><span class="v">The <em>inode</em> last changed — permissions, owner, name. Not "creation time". Changing a permission updates ctime but not mtime.</span></div>
</div>
<div class="callout warn">There is no portable "creation time" on Linux. <code>ctime</code> is <strong>change</strong> time, and the mistake is common enough to matter: a file <code>chmod</code>-ed yesterday has yesterday's ctime and an unchanged mtime from last year. Modern filesystems can record a birth time (<code>stat</code> shows <code>Birth:</code> on ext4 with newer tools), but nothing in this course should depend on it.</div>

<h3>What is this file, really?</h3>
${slide('lx-01', 26, 'file đọc NỘI DUNG — đuôi tên chỉ là lời hứa')}
<pre><code>file /usr/bin/ls /etc/hostname /var/log/nginx /dev/null report.pdf</code></pre>
<div class="out">/usr/bin/ls:     ELF 64-bit LSB pie executable, x86-64, dynamically linked
/etc/hostname:   ASCII text
/var/log/nginx:  directory
/dev/null:       character special (1/3)
report.pdf:      PDF document, version 1.7</div>
<p><code>file</code> reads the beginning of the file and identifies it by content, not by extension. On Linux the extension is a convention for humans — nothing enforces it — so a <code>.txt</code> that is really a JPEG is entirely possible, and <code>file</code> is how you find out before <code>cat</code> fills your terminal with binary noise.</p>
<pre><code><span class="tok-comment"># Before cat-ing something unknown, ask what it is:</span>
file downloaded-thing
<span class="tok-comment"># If it is text, look at it safely — head stops after 20 lines:</span>
head -20 downloaded-thing</code></pre>

<h3>Inodes, and why deleting a file can free nothing</h3>
${slide('lx-01', 27, 'Xoá file mà đĩa không trống: inode vẫn còn người giữ')}
<p>The number in <code>stat</code> labelled <code>Inode</code> is the file's real identity. The name in a directory is just a pointer to it. Two consequences that come up constantly:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">A name is a link, not the file</div><div class="lz-d">Several names can point at one inode (hard links, Chapter 2). Removing one name removes a pointer, not the data.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Space is freed at zero references</div><div class="lz-d">Both the name count AND the open-file count must reach zero.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">So a deleted file can still occupy the disk</div><div class="lz-d">If a process still has it open, the space stays used until that process exits.</div></div>
</div>
<pre><code><span class="tok-comment"># The classic: someone deleted a 40 GB log while the service held it open.</span>
<span class="tok-comment"># df says the disk is full; du finds nothing.</span>
lsof +L1 | head -3</code></pre>
<div class="out">COMMAND   PID   USER  FD   TYPE  DEVICE  SIZE/OFF NLINK  NODE NAME
nginx    1284   root  12w   REG     8,1 42949672960     0 1049612 /var/log/nginx/access.log (deleted)</div>
<p><code>NLINK 0</code> plus <code>(deleted)</code> is the fingerprint. The fix is to restart the process holding it, not to delete more files — Chapter 12 turns this into a full recipe.</p>

<h3>Two more small tools</h3>
<pre><code>wc -l /etc/passwd            <span class="tok-comment"># count lines</span>
wc -c /etc/hostname          <span class="tok-comment"># count bytes</span>
du -h /var/log/syslog.1      <span class="tok-comment"># how much disk does this really use?</span>
tree -L 2 -d /etc/nginx      <span class="tok-comment"># directories only, two levels deep</span></code></pre>
<div class="out">42 /etc/passwd
4 /etc/hostname
2.5M	/var/log/syslog.1</div>

<h3>Run it step by step: one directory, every file type</h3>
<p>Reading <code>ls -l</code> becomes easy once you have made each kind of entry yourself. In the sandbox:</p>
<pre><code class="language-bash">mkdir ~/thu-linux/ch1/xem &amp;&amp; cd ~/thu-linux/ch1/xem
printf "PORT=3000\\n" &gt; .env                       <span class="tok-comment"># regular file</span>
printf '#!/bin/bash\\necho hi\\n' &gt; deploy.sh
chmod +x deploy.sh                                <span class="tok-comment"># regular file, executable</span>
mkdir logs                                        <span class="tok-comment"># directory</span>
ln -s logs/app.log latest                         <span class="tok-comment"># symbolic link (to a file that does not exist yet)</span>
mkfifo ong                                        <span class="tok-comment"># named pipe (Chapter 3)</span>
ls -la
ls -lF                                            <span class="tok-comment"># -F appends a symbol for the type</span>
ls -l /dev/null                                   <span class="tok-comment"># a character device</span></code></pre>
<div class="out">total 20
drwxr-xr-x 3 an an 4096 Sep 28 09:08 .
drwxr-x--- 6 an an 4096 Sep 28 09:08 ..
-rw-r--r-- 1 an an   10 Sep 28 09:08 .env
-rwxr-xr-x 1 an an   20 Sep 28 09:08 deploy.sh
lrwxrwxrwx 1 an an   12 Sep 28 09:08 latest -&gt; logs/app.log
drwxr-xr-x 2 an an 4096 Sep 28 09:08 logs
prw-r--r-- 1 an an    0 Sep 28 09:08 ong
total 8
-rwxr-xr-x 1 an an   20 Sep 28 09:08 deploy.sh*
lrwxrwxrwx 1 an an   12 Sep 28 09:08 latest -&gt; logs/app.log
drwxr-xr-x 2 an an 4096 Sep 28 09:08 logs/
prw-r--r-- 1 an an    0 Sep 28 09:08 ong|
crw-rw-rw- 1 root root 1, 3 Sep 28 08:39 /dev/null</div>
<p>Check each claim from the table above against real output: the first letter changes with the type (<code>-</code> <code>d</code> <code>l</code> <code>p</code> <code>c</code>); <code>deploy.sh</code> gained <code>x</code> in all three groups; the symlink's size is 12 because <code>logs/app.log</code> is 12 characters — a link stores the <em>path</em>, not the data; <code>/dev/null</code> shows <code>1, 3</code> (the driver's major and minor numbers) where a size would be. The symbols <code>-F</code> adds are worth memorising: <code>/</code> directory, <code>*</code> executable, <code>@</code> link, <code>|</code> pipe, <code>=</code> socket.</p>

<h3>stat in scripts: pick the fields you need</h3>
<p><code>stat</code> can print exactly the fields you ask for, which is how scripts read a file's size or owner without parsing <code>ls</code> (whose column layout changes with locale and age).</p>
<pre><code>stat -c "%A %a %U %G %s %n" deploy.sh
stat -c "%i %h %n" deploy.sh
stat --printf="Modify: %y\\nChange: %z\\n" deploy.sh</code></pre>
<div class="out">-rwxr-xr-x 755 an an 20 deploy.sh
65822 1 deploy.sh
Modify: 2026-09-28 09:08:33.835669170 +0000
Change: 2026-09-28 09:08:33.835734003 +0000</div>
<table>
<tr><th>Code</th><th>Meaning</th><th>Code</th><th>Meaning</th></tr>
<tr><td><code>%A</code> / <code>%a</code></td><td>Permissions as text / as octal</td><td><code>%s</code></td><td>Size in bytes</td></tr>
<tr><td><code>%U</code> / <code>%G</code></td><td>Owner / group name</td><td><code>%i</code> / <code>%h</code></td><td>Inode number / hard-link count</td></tr>
<tr><td><code>%y</code> / <code>%z</code> / <code>%x</code></td><td>mtime / ctime / atime, readable</td><td><code>%n</code> / <code>%F</code></td><td>File name / file type in words</td></tr>
</table>
<div class="callout warn"><strong>macOS: same command name, different language.</strong> The Mac's BSD <code>stat</code> rejects <code>-c</code>: <code>stat: illegal option -- c</code>. Its equivalents are <code>-f</code> with different codes, or <code>-x</code> for a Linux-like block:</div>
<pre><code>stat -f "%Sp %Lp %Su %z %N" ghi-chu.txt     <span class="tok-comment"># on the Mac</span>
stat -x ghi-chu.txt</code></pre>
<div class="out">-rw-r--r-- 644 admin 3 ghi-chu.txt
  File: "ghi-chu.txt"
  Size: 3            FileType: Regular File
  Mode: (0644/-rw-r--r--)         Uid: (  501/   admin)  Gid: (    0/   wheel)
Device: 1,18   Inode: 61348552    Links: 1
Access: Mon Sep 28 15:42:50 2026
Modify: Mon Sep 28 15:42:50 2026
Change: Mon Sep 28 15:42:50 2026
 Birth: Mon Sep 28 15:42:50 2026</div>
<p>A script that must run on both (your Mac and the VPS) should either detect the system with <code>uname</code> or avoid <code>stat</code> formats altogether — Chapter 7 shows the pattern.</p>

<h3>Watching ctime move while mtime stands still</h3>
<pre><code class="language-bash">echo "v1" &gt; ghi-chu.txt
touch -d "2025-03-01 09:00" ghi-chu.txt        <span class="tok-comment"># pretend it was last edited in March 2025</span>
stat --printf="Modify: %y\\nChange: %z\\n" ghi-chu.txt
chmod 600 ghi-chu.txt                          <span class="tok-comment"># change permissions only</span>
stat --printf="Modify: %y\\nChange: %z\\n" ghi-chu.txt
ls -l ghi-chu.txt</code></pre>
<div class="out">Modify: 2025-03-01 09:00:00.000000000 +0000
Change: 2026-09-28 08:42:13.188089341 +0000
Modify: 2025-03-01 09:00:00.000000000 +0000
Change: 2026-09-28 08:42:13.189572466 +0000
-rw------- 1 an an 3 Mar  1  2025 ghi-chu.txt</div>
<p>Three lessons in one run. <code>touch -d</code> can set mtime to anything — so mtime is a claim, not proof. It cannot set ctime: the kernel stamps ctime with "now" whenever the inode changes, which is why investigators trust it more. And <code>ls -l</code> shows the year instead of a clock because the file is older than six months.</p>

<h3>On Fedora and macOS the columns carry extra marks</h3>
<pre><code class="language-bash"><span class="tok-comment"># Fedora 44 (btrfs, SELinux):</span>
ls -ld /etc
<span class="tok-comment"># macOS (APFS):</span>
ls -l README.md</code></pre>
<div class="out">drwxr-xr-x. 1 root root 5234 Sep 19 22:38 /etc
-rw-r--r--@ 1 admin  wheel  3 Sep 28 15:58 README.md</div>
<p>The dot after the permissions on Fedora means the file carries an SELinux security label; the <code>@</code> on the Mac means extended attributes (here <code>com.apple.provenance</code>, shown by <code>ls -l@</code>); a <code>+</code> in that spot on any system means an ACL (Chapter 4). Notice also what btrfs does to the numbers the lesson called universal: <code>/etc</code> has a link count of 1 and a "size" of 5234. The "directory = 4096 bytes, links = 2 + subdirectories" rule is true on ext4 (most VPSes) and false on btrfs — one more reason to measure contents with <code>du</code>, never with the directory's size column.</p>

<h3>The deleted-but-open file, reproduced</h3>
<p>You can watch the classic "disk still full after rm" happen in two minutes inside a throwaway container, where nothing real is at stake:</p>
<pre><code>head -c 500M /dev/zero &gt; /srv/log/access.log
df -m --output=used /
(sleep 600 3&gt;&gt;/srv/log/access.log &amp;)          <span class="tok-comment"># a process holds the file open on fd 3</span>
rm /srv/log/access.log &amp;&amp; du -sh /srv/log
df -m --output=used /
lsof +L1
kill 4087 &amp;&amp; df -m --output=used /</code></pre>
<div class="out"> Used
24073
4.0K	/srv/log
 Used
24073
COMMAND  PID USER   FD   TYPE DEVICE  SIZE/OFF NLINK  NODE NAME
sleep   4087 root    3w   REG   0,68 524288000     0 61724 /srv/log/access.log (deleted)
 Used
23573</div>
<p><code>du</code> walks names and finds nothing; <code>df</code> counts allocated blocks and still sees 500 MB; <code>lsof +L1</code> lists open files whose link count is below 1 — the fingerprint. Killing the holder returns exactly 500 MB. On a real server you would restart the service rather than kill it. Better still, empty a log instead of deleting it: <code>: &gt; /srv/log/app.log</code> truncates the file in place, so the space comes back immediately even while the process keeps it open (tested the same way: 24718 → 24218 MB used).</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Situation:</strong> a teammate uploads <code>bao-cao.pdf</code>, <code>anh.jpg</code> and <code>notes.txt</code> to the group server and says "they're just documents". Before anyone opens them, you check what they really are and who changed what.</p><ol>
<li>In <code>~/thu-linux/ch1/xem</code>, fake the upload: <code>printf '#!/bin/sh\\necho hacked\\n' &gt; anh.jpg</code>, <code>gzip -c /etc/services &gt; notes.txt</code>, <code>printf '%%PDF-1.7\\n' &gt; bao-cao.pdf</code>. (On a Mac use <code>/etc/hosts</code> instead of <code>/etc/services</code>.)</li>
<li>Run <code>ls -l</code> and <code>file *</code>. Which two names lie about their content?</li>
<li>Show the first bytes of the "text" file with <code>head -c 16 notes.txt | od -A x -t x1z</code> and find the gzip signature <code>1f 8b</code>.</li>
<li>Run <code>chmod 600 anh.jpg</code>, then compare <code>stat --printf="%y\\n%z\\n" anh.jpg</code> (on a Mac: <code>stat -x anh.jpg</code>). Which timestamp moved?</li>
<li>Use <code>stat -c "%A %a %U %s %n" *</code> (Mac: <code>stat -f "%Sp %Lp %Su %z %N" *</code>) to print a one-line summary of every file.</li></ol>
<p><strong>Done when:</strong> <code>file</code> calls <code>anh.jpg</code> a shell script and <code>notes.txt</code> gzip data; <code>od</code> shows <code>1f 8b</code> first; after <code>chmod</code> only Change moved; and your summary line for <code>anh.jpg</code> starts with <code>-rw------- 600</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Long listing (ls -l)</span><span class="v">Type, permissions, links, owner, group, size, mtime and name, one file per line.</span></div>
  <div class="kv"><span class="k">Inode</span><span class="v">The record holding a file's metadata and data location; the name in a directory only points to it.</span></div>
  <div class="kv"><span class="k">Link count</span><span class="v">How many names point to an inode; the data is freed when it and the open count reach zero.</span></div>
  <div class="kv"><span class="k">mtime / ctime / atime</span><span class="v">Last content change / last inode change (permissions, owner, name) / last read.</span></div>
  <div class="kv"><span class="k">Magic number</span><span class="v">The signature bytes at the start of a file (<code>1f 8b</code> for gzip) that <code>file</code> uses to identify it.</span></div>
  <div class="kv"><span class="k">Symbolic link</span><span class="v">A small file whose content is a path to another file; <code>l</code> in the first column.</span></div>
  <div class="kv"><span class="k">Device file</span><span class="v">An entry in <code>/dev</code> that talks to a driver: <code>c</code> character (<code>/dev/null</code>), <code>b</code> block (a disk).</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Read <code>ls -l</code> column by column: type, permissions, links, owner, group, size, mtime, name.</li>
<li>A directory's size column is the listing, not its contents — and on btrfs even that rule changes; use <code>du</code>.</li>
<li><code>ls -lhS</code> finds the biggest, <code>ls -ltr</code> puts the newest just above your prompt.</li>
<li>mtime is content, ctime is the inode (and cannot be faked with <code>touch</code>), and there is no portable creation time.</li>
<li><code>file</code> identifies content by its first bytes; extensions are only a promise.</li>
<li>A deleted file still held open keeps its space: <code>lsof +L1</code> finds it, and truncating with <code>: &gt; file</code> beats <code>rm</code>.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/stat.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">stat(1) — every field, and the --format placeholders</span><span class="lc-sub">Useful in scripts: <code>stat -c '%s %n' file</code> prints just size and name.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: answer five questions from one ls -l listing</span><span class="lc-sub">Graded exercises on type, owner, size, times and links.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> trusting a file extension. Linux does not use it to decide anything — <code>chmod +x</code> and the shebang line make a file executable (Chapter 7), not <code>.sh</code>. A downloaded <code>invoice.pdf.exe</code>, a <code>.jpg</code> that is really a script, a <code>.txt</code> that is a 2 GB core dump: <code>file</code> tells you in one command, and it is worth running on anything you did not create yourself.</div>
<p class="note-ct"><strong>The three commands to keep from this lesson:</strong> <code>ls -ltrh</code> for "what is here and what changed recently", <code>file</code> for "what is this actually", and <code>stat</code> for "everything the filesystem knows". Between them they answer almost every question about a file that is not about its contents — and Chapter 3 handles the contents.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Đọc một danh sách thư mục cho đúng</h2>
<p class="lead"><code>ls -l</code> in ra bảy cột và đa số người ta chỉ đọc hai. Năm cột còn lại trả lời những câu hỏi bạn sẽ hỏi đi hỏi lại: ai sở hữu cái này, nó đổi lúc nào, vì sao tôi không ghi được vào đó, và nó có phải một file thật không?</p>

<pre><code class="language-bash">ls -l /var/log</code></pre>
<div class="out">total 2884
-rw-r-----  1 syslog adm    184320 Aug 21 14:20 auth.log
drwxr-xr-x  2 root   root     4096 Aug 19 10:03 nginx
lrwxrwxrwx  1 root   root       19 Aug 19 10:03 syslog -> /var/log/syslog.1
-rw-r--r--  1 root   root  2621440 Aug 21 09:14 syslog.1</div>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-k">Ký tự đầu tiên</span><span class="lz-v">Loại. <code>-</code> file thường · <code>d</code> thư mục · <code>l</code> liên kết tượng trưng · <code>c</code>/<code>b</code> thiết bị · <code>s</code> socket · <code>p</code> ống.</span></div>
  <div class="lz-layer"><span class="lz-k">rw-r-----</span><span class="lz-v">Quyền, chia ba nhóm ba ký tự: chủ sở hữu, nhóm, mọi người khác. Chương 4 nói trọn vẹn về cái này.</span></div>
  <div class="lz-layer"><span class="lz-k">1 / 2</span><span class="lz-v">Số liên kết. Với một thư mục thì bằng 2 + số thư mục con, và vì thế một thư mục rỗng hiện số 2.</span></div>
  <div class="lz-layer"><span class="lz-k">syslog adm</span><span class="lz-v">Người dùng sở hữu, rồi nhóm sở hữu. Hai thứ tách biệt, và là nguồn gốc của phần lớn sự rối rắm về quyền.</span></div>
  <div class="lz-layer"><span class="lz-k">184320</span><span class="lz-v">Kích thước theo byte. Với thư mục thì đây là kích thước của cái DANH SÁCH, không phải của nội dung — một thư mục 4096 byte chứa được vài gigabyte.</span></div>
  <div class="lz-layer"><span class="lz-k">Aug 21 14:20</span><span class="lz-v">Thời gian sửa. Trong vòng sáu tháng gần đây thì hiện giờ giấc; cũ hơn thì hiện năm.</span></div>
  <div class="lz-layer"><span class="lz-k">-&gt; /var/log/syslog.1</span><span class="lz-v">Chỉ có ở liên kết: nó trỏ vào đâu. Chương 2 nói kỹ về liên kết.</span></div>
</div>
${slide('lx-01', 22, 'ls -l in 7 cột — đọc từng cột một')}
${slide('lx-01', 23, 'Ký tự đầu là LOẠI file — lưới quyền rwx')}
<div class="callout warn">Cột kích thước của một <em>THƯ MỤC</em> làm ai cũng hiểu nhầm một lần. <code>drwxr-xr-x 2 root root 4096</code> không có nghĩa thư mục đó chứa 4 KB — nó nghĩa là bản thân cái danh sách chiếm một khối 4 KB. Muốn biết bên trong có bao nhiêu, bạn cần <code>du</code> (Chương 10), lệnh đi khắp cây và cộng lại.</div>

<h3>Sắp xếp một danh sách để trả lời một câu hỏi</h3>
${slide('lx-01', 24, 'Sắp xếp để trả lời một câu hỏi: -S, -t, -r')}
<pre><code class="language-bash">ls -lhS /var/log | head -4          <span class="tok-comment"># to nhất trước — cái gì đang làm đầy chỗ này?</span>
ls -lt /var/log | head -4            <span class="tok-comment"># mới nhất trước — vừa nãy có gì đổi?</span>
ls -ltr /var/log | tail -4           <span class="tok-comment"># mới nhất SAU CÙNG — dạng hữu ích nhất</span></code></pre>
<div class="out">total 2.9M
-rw-r-----  1 root   adm   2.5M Aug 21 09:14 syslog.1
-rw-r-----  1 syslog adm   180K Aug 21 14:20 auth.log
-rw-r--r--  1 root   root   68K Aug 20 03:11 dpkg.log</div>
<div class="callout ok"><code>ls -ltr</code> đáng biến thành thói quen. Đảo chiều sắp xếp đưa những mục mới nhất xuống <em>ĐÁY</em>, ngay phía trên dấu nhắc của bạn — nên trong một thư mục hai trăm file, bạn thấy đúng thứ mình cần mà không phải cuộn. Cùng một lý lẽ áp cho mọi output dài: hãy kết thúc nó ở nơi mắt bạn vốn đã ở đó.</div>

<h3>Ba dấu thời gian, không phải một</h3>
${slide('lx-01', 25, 'stat: ba dấu thời gian — chmod đổi ctime, không đổi mtime')}
<pre><code>stat /var/log/auth.log</code></pre>
<div class="out">  File: /var/log/auth.log
  Size: 184320    	Blocks: 360        IO Block: 4096   regular file
Device: 8,1	Inode: 1049601     Links: 1
Access: (0640/-rw-r-----)  Uid: (  104/ syslog)   Gid: (   4/     adm)
Access: 2026-08-21 14:22:03.114 +0700
Modify: 2026-08-21 14:20:51.882 +0700
Change: 2026-08-21 14:20:51.882 +0700</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Access (atime)</span><span class="v">Lần đọc gần nhất. Thường bị tắt để tăng hiệu năng, nên đừng dựa vào nó.</span></div>
  <div class="kv"><span class="k">Modify (mtime)</span><span class="v">Nội dung đổi lần gần nhất. Đây là thứ <code>ls -l</code> hiện ra và thứ <code>find -mtime</code> kiểm.</span></div>
  <div class="kv"><span class="k">Change (ctime)</span><span class="v"><em>INODE</em> đổi lần gần nhất — quyền, chủ sở hữu, tên. KHÔNG phải "thời gian tạo". Đổi một cái quyền thì cập nhật ctime chứ không cập nhật mtime.</span></div>
</div>
<div class="callout warn">Trên Linux không có "thời gian tạo" theo cách khả chuyển. <code>ctime</code> là thời gian <strong>THAY ĐỔI</strong>, và nhầm lẫn này phổ biến tới mức đáng nói: một file được <code>chmod</code> hôm qua thì có ctime là hôm qua và mtime không đổi từ năm ngoái. Hệ thống file đời mới ghi được thời gian sinh (<code>stat</code> hiện <code>Birth:</code> trên ext4 với công cụ mới), nhưng không gì trong khoá này nên phụ thuộc vào nó.</div>

<h3>Cái file này THẬT SỰ là gì?</h3>
${slide('lx-01', 26, 'file đọc NỘI DUNG — đuôi tên chỉ là lời hứa')}
<pre><code>file /usr/bin/ls /etc/hostname /var/log/nginx /dev/null report.pdf</code></pre>
<div class="out">/usr/bin/ls:     ELF 64-bit LSB pie executable, x86-64, dynamically linked
/etc/hostname:   ASCII text
/var/log/nginx:  directory
/dev/null:       character special (1/3)
report.pdf:      PDF document, version 1.7</div>
<p><code>file</code> đọc phần đầu của file và nhận dạng theo NỘI DUNG, không theo phần đuôi tên. Trên Linux, phần đuôi là một quy ước dành cho con người — chẳng có gì cưỡng chế nó — nên một file <code>.txt</code> thật ra là ảnh JPEG là chuyện hoàn toàn có thể, và <code>file</code> là cách bạn biết trước khi <code>cat</code> làm ngập terminal bằng nhiễu nhị phân.</p>
<pre><code><span class="tok-comment"># Trước khi cat một thứ chưa rõ, hãy hỏi nó là gì:</span>
file downloaded-thing
<span class="tok-comment"># Nếu là văn bản, hãy xem một cách an toàn — head dừng sau 20 dòng:</span>
head -20 downloaded-thing</code></pre>

<h3>Inode, và vì sao xoá một file có thể không giải phóng gì</h3>
${slide('lx-01', 27, 'Xoá file mà đĩa không trống: inode vẫn còn người giữ')}
<p>Con số trong <code>stat</code> mang nhãn <code>Inode</code> mới là danh tính thật của file. Cái tên trong thư mục chỉ là một con trỏ tới nó. Hai hệ quả xuất hiện liên tục:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Một cái tên là một liên kết, không phải cái file</div><div class="lz-d">Nhiều tên trỏ được vào một inode (liên kết cứng, Chương 2). Gỡ một cái tên là gỡ một con trỏ, không phải gỡ dữ liệu.</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Chỗ trống được giải phóng khi số tham chiếu về 0</div><div class="lz-d">Cả số tên LẪN số tiến trình đang mở file đều phải về 0.</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Nên một file đã xoá vẫn có thể đang chiếm đĩa</div><div class="lz-d">Nếu một tiến trình vẫn giữ nó ở trạng thái mở, chỗ đó vẫn bị chiếm cho tới khi tiến trình ấy thoát.</div></div>
</div>
<pre><code><span class="tok-comment"># Ca kinh điển: có người xoá một file log 40 GB trong khi dịch vụ vẫn đang mở nó.</span>
<span class="tok-comment"># df báo đĩa đầy; du thì không tìm ra gì.</span>
lsof +L1 | head -3</code></pre>
<div class="out">COMMAND   PID   USER  FD   TYPE  DEVICE  SIZE/OFF NLINK  NODE NAME
nginx    1284   root  12w   REG     8,1 42949672960     0 1049612 /var/log/nginx/access.log (deleted)</div>
<p><code>NLINK 0</code> cộng chữ <code>(deleted)</code> là dấu vân tay. Cách sửa là khởi động lại tiến trình đang giữ nó, chứ không phải xoá thêm file — Chương 12 biến việc này thành một công thức đầy đủ.</p>

<h3>Hai công cụ nhỏ nữa</h3>
<pre><code>wc -l /etc/passwd            <span class="tok-comment"># đếm dòng</span>
wc -c /etc/hostname          <span class="tok-comment"># đếm byte</span>
du -h /var/log/syslog.1      <span class="tok-comment"># cái này thật sự chiếm bao nhiêu đĩa?</span>
tree -L 2 -d /etc/nginx      <span class="tok-comment"># chỉ thư mục, sâu hai cấp</span></code></pre>
<div class="out">42 /etc/passwd
4 /etc/hostname
2.5M	/var/log/syslog.1</div>

<h3>Chạy thử từng bước: một thư mục, đủ mọi loại file</h3>
<p>Đọc <code>ls -l</code> sẽ thành dễ khi bạn đã tự tay tạo ra từng loại mục. Trong sân tập:</p>
<pre><code class="language-bash">mkdir ~/thu-linux/ch1/xem &amp;&amp; cd ~/thu-linux/ch1/xem
printf "PORT=3000\\n" &gt; .env                       <span class="tok-comment"># file thường</span>
printf '#!/bin/bash\\necho hi\\n' &gt; deploy.sh
chmod +x deploy.sh                                <span class="tok-comment"># file thường, chạy được</span>
mkdir logs                                        <span class="tok-comment"># thư mục</span>
ln -s logs/app.log latest                         <span class="tok-comment"># liên kết tượng trưng (tới một file chưa tồn tại)</span>
mkfifo ong                                        <span class="tok-comment"># ống có tên (Chương 3)</span>
ls -la
ls -lF                                            <span class="tok-comment"># -F gắn thêm ký hiệu cho từng loại</span>
ls -l /dev/null                                   <span class="tok-comment"># một thiết bị ký tự</span></code></pre>
<div class="out">total 20
drwxr-xr-x 3 an an 4096 Sep 28 09:08 .
drwxr-x--- 6 an an 4096 Sep 28 09:08 ..
-rw-r--r-- 1 an an   10 Sep 28 09:08 .env
-rwxr-xr-x 1 an an   20 Sep 28 09:08 deploy.sh
lrwxrwxrwx 1 an an   12 Sep 28 09:08 latest -&gt; logs/app.log
drwxr-xr-x 2 an an 4096 Sep 28 09:08 logs
prw-r--r-- 1 an an    0 Sep 28 09:08 ong
total 8
-rwxr-xr-x 1 an an   20 Sep 28 09:08 deploy.sh*
lrwxrwxrwx 1 an an   12 Sep 28 09:08 latest -&gt; logs/app.log
drwxr-xr-x 2 an an 4096 Sep 28 09:08 logs/
prw-r--r-- 1 an an    0 Sep 28 09:08 ong|
crw-rw-rw- 1 root root 1, 3 Sep 28 08:39 /dev/null</div>
<p>Đối chiếu từng lời khẳng định trong bảng trên với output thật: chữ đầu đổi theo loại (<code>-</code> <code>d</code> <code>l</code> <code>p</code> <code>c</code>); <code>deploy.sh</code> có thêm <code>x</code> ở cả ba nhóm; cỡ của symlink là 12 vì <code>logs/app.log</code> dài đúng 12 ký tự — liên kết lưu <em>ĐƯỜNG DẪN</em>, không lưu dữ liệu; <code>/dev/null</code> hiện <code>1, 3</code> (số major và minor của driver) ở chỗ lẽ ra là cỡ. Các ký hiệu mà <code>-F</code> thêm vào đáng nhớ: <code>/</code> thư mục, <code>*</code> chạy được, <code>@</code> liên kết, <code>|</code> ống, <code>=</code> socket.</p>

<h3>stat trong script: chọn đúng trường cần lấy</h3>
<p><code>stat</code> in được đúng những trường bạn hỏi, và đó là cách script đọc cỡ hay chủ sở hữu của file mà không phải bóc tách output của <code>ls</code> (bố cục cột của <code>ls</code> đổi theo ngôn ngữ và theo tuổi file).</p>
<pre><code>stat -c "%A %a %U %G %s %n" deploy.sh
stat -c "%i %h %n" deploy.sh
stat --printf="Modify: %y\\nChange: %z\\n" deploy.sh</code></pre>
<div class="out">-rwxr-xr-x 755 an an 20 deploy.sh
65822 1 deploy.sh
Modify: 2026-09-28 09:08:33.835669170 +0000
Change: 2026-09-28 09:08:33.835734003 +0000</div>
<table>
<tr><th>Mã</th><th>Nghĩa</th><th>Mã</th><th>Nghĩa</th></tr>
<tr><td><code>%A</code> / <code>%a</code></td><td>Quyền dạng chữ / dạng bát phân</td><td><code>%s</code></td><td>Cỡ theo byte</td></tr>
<tr><td><code>%U</code> / <code>%G</code></td><td>Tên chủ / tên nhóm</td><td><code>%i</code> / <code>%h</code></td><td>Số inode / số liên kết cứng</td></tr>
<tr><td><code>%y</code> / <code>%z</code> / <code>%x</code></td><td>mtime / ctime / atime, dạng đọc được</td><td><code>%n</code> / <code>%F</code></td><td>Tên file / loại file bằng chữ</td></tr>
</table>
<div class="callout warn"><strong>macOS: cùng tên lệnh, khác ngôn ngữ.</strong> <code>stat</code> kiểu BSD của Mac từ chối <code>-c</code>: <code>stat: illegal option -- c</code>. Cách tương đương là <code>-f</code> với bộ mã khác, hoặc <code>-x</code> để ra một khối giống Linux:</div>
<pre><code>stat -f "%Sp %Lp %Su %z %N" ghi-chu.txt     <span class="tok-comment"># trên Mac</span>
stat -x ghi-chu.txt</code></pre>
<div class="out">-rw-r--r-- 644 admin 3 ghi-chu.txt
  File: "ghi-chu.txt"
  Size: 3            FileType: Regular File
  Mode: (0644/-rw-r--r--)         Uid: (  501/   admin)  Gid: (    0/   wheel)
Device: 1,18   Inode: 61348552    Links: 1
Access: Mon Sep 28 15:42:50 2026
Modify: Mon Sep 28 15:42:50 2026
Change: Mon Sep 28 15:42:50 2026
 Birth: Mon Sep 28 15:42:50 2026</div>
<p>Một script phải chạy được ở cả hai nơi (Mac của bạn và VPS) thì hoặc dò hệ thống bằng <code>uname</code>, hoặc tránh hẳn định dạng của <code>stat</code> — Chương 7 chỉ mẫu làm.</p>

<h3>Nhìn ctime nhảy trong khi mtime đứng yên</h3>
<pre><code class="language-bash">echo "v1" &gt; ghi-chu.txt
touch -d "2025-03-01 09:00" ghi-chu.txt        <span class="tok-comment"># giả như lần sửa cuối là tháng 3/2025</span>
stat --printf="Modify: %y\\nChange: %z\\n" ghi-chu.txt
chmod 600 ghi-chu.txt                          <span class="tok-comment"># chỉ đổi quyền</span>
stat --printf="Modify: %y\\nChange: %z\\n" ghi-chu.txt
ls -l ghi-chu.txt</code></pre>
<div class="out">Modify: 2025-03-01 09:00:00.000000000 +0000
Change: 2026-09-28 08:42:13.188089341 +0000
Modify: 2025-03-01 09:00:00.000000000 +0000
Change: 2026-09-28 08:42:13.189572466 +0000
-rw------- 1 an an 3 Mar  1  2025 ghi-chu.txt</div>
<p>Ba bài học trong một lần chạy. <code>touch -d</code> đặt được mtime thành bất cứ gì — nên mtime là một lời khai, không phải bằng chứng. Nó KHÔNG đặt được ctime: nhân tự đóng dấu ctime bằng "bây giờ" mỗi khi inode thay đổi, và vì thế người điều tra tin ctime hơn. Và <code>ls -l</code> hiện năm thay cho giờ vì file cũ hơn sáu tháng.</p>

<h3>Trên Fedora và macOS các cột mang thêm ký hiệu</h3>
<pre><code class="language-bash"><span class="tok-comment"># Fedora 44 (btrfs, SELinux):</span>
ls -ld /etc
<span class="tok-comment"># macOS (APFS):</span>
ls -l README.md</code></pre>
<div class="out">drwxr-xr-x. 1 root root 5234 Sep 19 22:38 /etc
-rw-r--r--@ 1 admin  wheel  3 Sep 28 15:58 README.md</div>
<p>Dấu chấm sau cột quyền trên Fedora nghĩa là file mang nhãn bảo mật SELinux; dấu <code>@</code> trên Mac nghĩa là có thuộc tính mở rộng (ở đây là <code>com.apple.provenance</code>, xem bằng <code>ls -l@</code>); dấu <code>+</code> ở vị trí đó trên mọi hệ nghĩa là có ACL (Chương 4). Để ý thêm btrfs làm gì với những con số mà bài gọi là phổ quát: <code>/etc</code> có số liên kết là 1 và "cỡ" là 5234. Luật "thư mục = 4096 byte, số liên kết = 2 + số thư mục con" đúng trên ext4 (đa số VPS) và SAI trên btrfs — thêm một lý do để đo nội dung bằng <code>du</code>, đừng bao giờ bằng cột cỡ của thư mục.</p>

<h3>Tái hiện file đã xoá mà vẫn đang mở</h3>
<p>Bạn có thể xem sự cố kinh điển "rm rồi mà đĩa vẫn đầy" xảy ra trong hai phút, bên trong một container vứt đi, nơi không có gì thật bị đe doạ:</p>
<pre><code>head -c 500M /dev/zero &gt; /srv/log/access.log
df -m --output=used /
(sleep 600 3&gt;&gt;/srv/log/access.log &amp;)          <span class="tok-comment"># một tiến trình giữ file mở ở fd 3</span>
rm /srv/log/access.log &amp;&amp; du -sh /srv/log
df -m --output=used /
lsof +L1
kill 4087 &amp;&amp; df -m --output=used /</code></pre>
<div class="out"> Used
24073
4.0K	/srv/log
 Used
24073
COMMAND  PID USER   FD   TYPE DEVICE  SIZE/OFF NLINK  NODE NAME
sleep   4087 root    3w   REG   0,68 524288000     0 61724 /srv/log/access.log (deleted)
 Used
23573</div>
<p><code>du</code> đi theo TÊN nên không tìm thấy gì; <code>df</code> đếm các khối đã cấp phát nên vẫn thấy 500 MB; <code>lsof +L1</code> liệt kê những file đang mở có số liên kết dưới 1 — đó là dấu vân tay. Diệt tiến trình giữ file thì lấy lại đúng 500 MB. Trên máy chủ thật bạn sẽ khởi động lại dịch vụ chứ không diệt nó. Tốt hơn nữa, hãy làm rỗng log thay vì xoá: <code>: &gt; /srv/log/app.log</code> cắt file về 0 byte ngay tại chỗ, nên chỗ trống quay về tức thì dù tiến trình vẫn đang giữ nó mở (đã thử cùng cách: 24718 → 24218 MB đã dùng).</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> một bạn cùng nhóm tải lên máy chủ nhóm ba file <code>bao-cao.pdf</code>, <code>anh.jpg</code> và <code>notes.txt</code> rồi bảo "chỉ là tài liệu thôi". Trước khi ai mở chúng, bạn kiểm xem chúng THẬT RA là gì và ai đã đổi cái gì.</p><ol>
<li>Trong <code>~/thu-linux/ch1/xem</code>, giả lập vụ tải lên: <code>printf '#!/bin/sh\\necho hacked\\n' &gt; anh.jpg</code>, <code>gzip -c /etc/services &gt; notes.txt</code>, <code>printf '%%PDF-1.7\\n' &gt; bao-cao.pdf</code>. (Trên Mac dùng <code>/etc/hosts</code> thay cho <code>/etc/services</code>.)</li>
<li>Chạy <code>ls -l</code> và <code>file *</code>. Hai cái tên nào nói dối về nội dung của mình?</li>
<li>Xem những byte đầu của file "văn bản" bằng <code>head -c 16 notes.txt | od -A x -t x1z</code> và tìm chữ ký gzip <code>1f 8b</code>.</li>
<li>Chạy <code>chmod 600 anh.jpg</code>, rồi so <code>stat --printf="%y\\n%z\\n" anh.jpg</code> (trên Mac: <code>stat -x anh.jpg</code>). Dấu thời gian nào đã nhảy?</li>
<li>Dùng <code>stat -c "%A %a %U %s %n" *</code> (Mac: <code>stat -f "%Sp %Lp %Su %z %N" *</code>) để in bản tóm tắt một dòng cho mọi file.</li></ol>
<p><strong>Đạt khi:</strong> <code>file</code> gọi <code>anh.jpg</code> là shell script và <code>notes.txt</code> là gzip data; <code>od</code> hiện <code>1f 8b</code> đầu tiên; sau <code>chmod</code> chỉ có Change nhảy; và dòng tóm tắt của <code>anh.jpg</code> bắt đầu bằng <code>-rw------- 600</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Long listing (danh sách dạng dài, ls -l)</span><span class="v">Loại, quyền, số liên kết, chủ, nhóm, cỡ, mtime và tên — mỗi file một dòng.</span></div>
  <div class="kv"><span class="k">Inode (nút chỉ mục)</span><span class="v">Bản ghi giữ siêu dữ liệu và vị trí dữ liệu của file; cái tên trong thư mục chỉ trỏ tới nó.</span></div>
  <div class="kv"><span class="k">Link count (số liên kết)</span><span class="v">Số cái tên trỏ vào một inode; dữ liệu được giải phóng khi nó và số lần mở cùng về 0.</span></div>
  <div class="kv"><span class="k">mtime / ctime / atime</span><span class="v">Lần đổi nội dung / lần đổi inode (quyền, chủ, tên) / lần đọc gần nhất.</span></div>
  <div class="kv"><span class="k">Magic number (chữ ký đầu file)</span><span class="v">Mấy byte đầu file (<code>1f 8b</code> với gzip) mà <code>file</code> dùng để nhận dạng.</span></div>
  <div class="kv"><span class="k">Symbolic link (liên kết tượng trưng)</span><span class="v">File nhỏ mà nội dung là đường dẫn tới file khác; chữ <code>l</code> ở cột đầu.</span></div>
  <div class="kv"><span class="k">Device file (file thiết bị)</span><span class="v">Mục trong <code>/dev</code> nói chuyện với driver: <code>c</code> ký tự (<code>/dev/null</code>), <code>b</code> khối (một ổ đĩa).</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Đọc <code>ls -l</code> từng cột: loại, quyền, số liên kết, chủ, nhóm, cỡ, mtime, tên.</li>
<li>Cột cỡ của thư mục là cỡ của cái danh sách, không phải nội dung — và trên btrfs luật đó còn đổi; hãy dùng <code>du</code>.</li>
<li><code>ls -lhS</code> tìm cái to nhất, <code>ls -ltr</code> đặt cái mới nhất ngay trên dấu nhắc.</li>
<li>mtime là nội dung, ctime là inode (và <code>touch</code> không làm giả được), còn thời gian tạo thì không có cách khả chuyển.</li>
<li><code>file</code> nhận dạng theo những byte đầu; phần đuôi tên chỉ là một lời hứa.</li>
<li>File đã xoá mà còn bị giữ mở vẫn chiếm chỗ: <code>lsof +L1</code> tìm ra nó, và cắt rỗng bằng <code>: &gt; file</code> tốt hơn <code>rm</code>.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/stat.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">stat(1) — mọi trường, và các ký hiệu của --format</span><span class="lc-sub">Hữu ích trong script: <code>stat -c '%s %n' file</code> chỉ in kích thước và tên.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: trả lời năm câu hỏi chỉ từ một danh sách ls -l</span><span class="lc-sub">Bài tập chấm điểm về loại, chủ sở hữu, kích thước, thời gian và liên kết.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> tin vào phần đuôi tên file. Linux không dùng nó để quyết định bất cứ điều gì — <code>chmod +x</code> và dòng shebang mới làm cho một file chạy được (Chương 7), chứ không phải cái đuôi <code>.sh</code>. Một file tải về tên <code>invoice.pdf.exe</code>, một <code>.jpg</code> thật ra là script, một <code>.txt</code> thật ra là một bản đổ lõi 2 GB: <code>file</code> nói cho bạn biết trong một lệnh, và đáng chạy nó với mọi thứ không do chính bạn tạo ra.</div>
<p class="note-ct"><strong>Ba lệnh cần giữ lại từ bài này:</strong> <code>ls -ltrh</code> cho câu "ở đây có gì và gần đây cái gì đổi", <code>file</code> cho câu "cái này thật ra là gì", và <code>stat</code> cho câu "hệ thống file biết những gì về nó". Cùng nhau chúng trả lời gần như mọi câu hỏi về một file mà không liên quan tới nội dung — còn nội dung thì Chương 3 lo.</p>
</div>
`,
    },

    /* ─────────────────────────── 1.5 Quiz ─────────────────────────── */
    {
      title: '1.5 — Chapter 1 quiz|||1.5 — Kiểm tra Chương 1',
      slug: 'lnx-1-5-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu tình huống: cd - in gì, builtin và help, mục 5 của man, đường dẫn tuyệt đối cho cron, ./script.sh, cỡ của symlink, ctime sau chmod, file nhận dạng theo nội dung, lsof +L1, và stat trên macOS.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten questions, mostly "what does this print?" and "which line fixes it?" — reading commands is the core skill of the whole course. Every expected output was run on Ubuntu 24.04 (and on a Mac where the question says so).</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can read a prompt and say who I am, on which machine, where, and whether I am root.</li>
<li>I can find help for any command: <code>type</code> first, then <code>help</code>, <code>man</code> (with the right section) or <code>--help</code>.</li>
<li>I can tell an absolute path from a relative one and explain why scripts and cron need absolute paths.</li>
<li>I know what <code>/etc</code>, <code>/var</code>, <code>/usr/local/bin</code>, <code>/proc</code> and <code>/tmp</code> are for.</li>
<li>I can read all seven columns of <code>ls -l</code> and the three timestamps of <code>stat</code>.</li>
<li>I can explain why deleting a file sometimes frees no space, and find the culprit.</li>
</ul>
${slide('lx-01', 29, 'Bảng tra nhanh Chương 1 (1/2): di chuyển và tự tra cứu')}
${slide('lx-01', 30, 'Bảng tra nhanh Chương 1 (2/2): cây thư mục và nhìn kỹ một file')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười câu, phần lớn là "lệnh này in ra gì?" và "dòng nào sửa được lỗi?" — đọc lệnh là kỹ năng cốt lõi của cả khoá. Mọi output trong đáp án đã được chạy thật trên Ubuntu 24.04 (và trên Mac khi câu hỏi nói vậy).</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đọc được dấu nhắc và nói được mình là ai, trên máy nào, đang ở đâu, có phải root không.</li>
<li>Tôi tự tra cứu được mọi lệnh: <code>type</code> trước, rồi <code>help</code>, <code>man</code> (đúng mục) hoặc <code>--help</code>.</li>
<li>Tôi phân biệt được đường dẫn tuyệt đối với tương đối và giải thích được vì sao script và cron cần đường dẫn tuyệt đối.</li>
<li>Tôi biết <code>/etc</code>, <code>/var</code>, <code>/usr/local/bin</code>, <code>/proc</code> và <code>/tmp</code> dùng để làm gì.</li>
<li>Tôi đọc được cả bảy cột của <code>ls -l</code> và ba dấu thời gian của <code>stat</code>.</li>
<li>Tôi giải thích được vì sao xoá file đôi khi không giải phóng chỗ nào, và tìm ra thủ phạm.</li>
</ul>
${slide('lx-01', 29, 'Bảng tra nhanh Chương 1 (1/2): di chuyển và tự tra cứu')}
${slide('lx-01', 30, 'Bảng tra nhanh Chương 1 (2/2): cây thư mục và nhìn kỹ một file')}
</div>

`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'You run: cd ~/projects/api, then cd /var/log, then cd -. What does the last command print?|||Bạn chạy: cd ~/projects/api, rồi cd /var/log, rồi cd -. Lệnh cuối in ra gì?',
            options: [
              'Nothing — cd never prints on success|||Không gì cả — cd không bao giờ in khi thành công',
              '/var/log',
              '/home/an/projects/api',
              '~/projects/api',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: cd - jumps to the previous directory ($OLDPWD) and, unlike every other cd, prints it — as a full path, so /home/an/projects/api, not the ~ form. "Nothing" is right for plain cd, which is exactly why it is tempting.|||VI: cd - nhảy về thư mục trước đó ($OLDPWD) và, khác với mọi lệnh cd khác, IN nó ra — dạng đường dẫn đầy đủ, nên là /home/an/projects/api chứ không phải dạng ~. "Không gì cả" đúng với cd thường, và đó chính là lý do nó hấp dẫn.',
          },
          {
            question: '"man cd" answers "No manual entry for cd". What is going on, and what do you run instead?|||"man cd" trả lời "No manual entry for cd". Chuyện gì đang xảy ra, và bạn chạy gì thay thế?',
            options: [
              'cd is a bash builtin, not a program — run: help cd|||cd là builtin của bash, không phải chương trình — chạy: help cd',
              'The man pages are not installed — reinstall man-db|||Chưa cài trang man — cài lại man-db',
              'cd is an alias — run: alias cd|||cd là một alias — chạy: alias cd',
              'You need section 8 — run: man 8 cd|||Cần mục 8 — chạy: man 8 cd',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: type cd prints "cd is a shell builtin". Builtins live inside bash and are documented by help. cd must be a builtin: a child process cannot change its parent shell’s directory. Missing man pages is a real cause in minimized containers, but then man ls would fail too.|||VI: type cd in "cd is a shell builtin". Builtin nằm trong bash và được tra bằng help. cd buộc phải là builtin: tiến trình con không đổi được thư mục của shell cha. Thiếu trang man là nguyên nhân có thật trong container bị cắt gọn, nhưng khi đó man ls cũng hỏng theo.',
          },
          {
            question: 'You are editing /etc/passwd by hand and want the documentation of its seven fields, but "man passwd" shows "passwd - change user password". Which command gives the right page?|||Bạn đang sửa tay /etc/passwd và cần tài liệu về bảy trường của nó, nhưng "man passwd" lại hiện "passwd - change user password". Lệnh nào ra đúng trang?',
            options: [
              'man passwd --file',
              'man 8 passwd',
              'apropos passwd --format',
              'man 5 passwd',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: Section 5 is file formats: man 5 passwd opens PASSWD(5) "the password file". Plain man passwd shows the first match in the search order, section 1, the command. Section 8 is administration commands, the most plausible wrong guess because /etc/passwd is admin territory.|||VI: Mục 5 là định dạng file: man 5 passwd mở PASSWD(5) "the password file". man passwd trơn cho trang đầu tiên theo thứ tự tra, tức mục 1 — cái lệnh. Mục 8 là lệnh quản trị, đoán sai hợp lý nhất vì /etc/passwd thuộc việc của quản trị viên.',
          },
          {
            question: 'backup.sh contains "cat config/db.env". It works when you run it inside the project folder, but from cron it prints "cat: config/db.env: No such file or directory". What is the fix?|||backup.sh có dòng "cat config/db.env". Chạy trong thư mục dự án thì được, nhưng chạy bằng cron lại in "cat: config/db.env: No such file or directory". Sửa thế nào?',
            options: [
              'Rename the file to .db.env so cron can see it|||Đổi tên file thành .db.env để cron thấy được',
              'Use an absolute path such as /home/an/projects/api/config/db.env|||Dùng đường dẫn tuyệt đối như /home/an/projects/api/config/db.env',
              'Add "./" in front: cat ./config/db.env|||Thêm "./" phía trước: cat ./config/db.env',
              'Run chmod +x config/db.env|||Chạy chmod +x config/db.env',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: cron starts the script in a different working directory, so every relative path is resolved from there. An absolute path means the same thing from anywhere. "./config/db.env" looks like a fix but is still relative — "./" only means "the current directory", which is the wrong one.|||VI: cron khởi động script ở một thư mục làm việc khác, nên mọi đường dẫn tương đối được tính từ đó. Đường dẫn tuyệt đối mang cùng một nghĩa ở mọi nơi. "./config/db.env" trông như một cách sửa nhưng vẫn là tương đối — "./" chỉ nghĩa là "thư mục hiện tại", mà đó lại là thư mục sai.',
          },
          {
            question: 'In ~/projects/api you type "deploy.sh" and get "bash: deploy.sh: command not found" (exit 127), although ls shows the file and it is executable. Which command runs it?|||Trong ~/projects/api bạn gõ "deploy.sh" và nhận "bash: deploy.sh: command not found" (mã 127), dù ls thấy file và nó có quyền chạy. Lệnh nào chạy được nó?',
            options: [
              'deploy.sh --here',
              './deploy.sh',
              'cd . && deploy.sh',
              'sh -n deploy.sh',
            ],
            correctIndex: 1,
            points: 1,
            explanation: 'EN: A bare name is searched only in PATH, and the current directory is deliberately not in PATH. Any "/" in the name skips the PATH search, so ./deploy.sh runs the file right here. cd . changes nothing. sh -n only checks the syntax and exits 0 without running a single line — a quiet trap, because it looks like it worked.|||VI: Một tên trần chỉ được tìm trong PATH, và thư mục hiện tại cố ý không nằm trong PATH. Có dấu "/" trong tên là bỏ qua việc tra PATH, nên ./deploy.sh chạy đúng file ở đây. cd . không đổi gì. sh -n chỉ kiểm cú pháp rồi thoát với mã 0 mà không chạy dòng nào — một cái bẫy im lặng, vì trông như đã chạy xong.',
          },
          {
            question: 'ls -l prints "lrwxrwxrwx 1 an an 12 Sep 28 09:08 latest -> logs/app.log". Why is the size 12?|||ls -l in "lrwxrwxrwx 1 an an 12 Sep 28 09:08 latest -> logs/app.log". Vì sao cỡ là 12?',
            options: [
              'app.log is 12 bytes long|||app.log dài 12 byte',
              'A link always occupies 12 bytes|||Liên kết luôn chiếm 12 byte',
              'There are 12 links to the target|||Có 12 liên kết trỏ tới đích',
              'The link stores the path "logs/app.log", which is 12 characters|||Liên kết lưu đường dẫn "logs/app.log", dài đúng 12 ký tự',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: A symbolic link is a small file whose content is a path; ls shows the length of that path. Here the target does not even exist yet (file calls it a "broken symbolic link"), so it cannot be the target’s size. The link count is the second column (1), not the size.|||VI: Liên kết tượng trưng là một file nhỏ mà nội dung là một đường dẫn; ls hiện độ dài của đường dẫn đó. Ở đây đích còn chưa tồn tại (file gọi nó là "broken symbolic link"), nên không thể là cỡ của đích. Số liên kết là cột thứ hai (1), không phải cột cỡ.',
          },
          {
            question: 'A file was last edited in March 2025. Today you run "chmod 600 notes.txt". Which timestamps does stat now show as today?|||Một file được sửa lần cuối vào tháng 3/2025. Hôm nay bạn chạy "chmod 600 notes.txt". stat giờ hiện những dấu thời gian nào là hôm nay?',
            options: [
              'Only Change (ctime); Modify stays in March 2025|||Chỉ Change (ctime); Modify vẫn là tháng 3/2025',
              'Only Modify (mtime)|||Chỉ Modify (mtime)',
              'Both Modify and Change|||Cả Modify lẫn Change',
              'None — chmod does not touch timestamps|||Không cái nào — chmod không đụng tới dấu thời gian',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: chmod changes the inode (permissions), not the contents: ctime jumps to now, mtime stays — tested: Modify 2025-03-01, Change 2026-09-28. "Both" is the tempting answer because people read ctime as "creation" or "changed anything"; ctime is inode change time.|||VI: chmod đổi inode (quyền), không đổi nội dung: ctime nhảy về hiện tại, mtime đứng yên — đã thử: Modify 2025-03-01, Change 2026-09-28. "Cả hai" hấp dẫn vì người ta đọc ctime là "creation" hay "đổi bất cứ gì"; ctime là thời điểm INODE đổi.',
          },
          {
            question: 'A teammate uploads anh.jpg. "file anh.jpg" prints "POSIX shell script, ASCII text executable". What should you conclude?|||Một bạn cùng nhóm tải lên anh.jpg. "file anh.jpg" in "POSIX shell script, ASCII text executable". Bạn nên kết luận gì?',
            options: [
              'file is confused by the .jpg extension — trust the extension|||file bị đuôi .jpg làm rối — cứ tin phần đuôi',
              'It is an image with an embedded preview script|||Đó là ảnh có kèm một script xem trước',
              'The content is a shell script whatever the name says — do not run or open it blindly|||Nội dung là một shell script, bất kể tên nói gì — đừng chạy hay mở nó một cách mù quáng',
              'It will run automatically because it says "executable"|||Nó sẽ tự chạy vì có chữ "executable"',
            ],
            correctIndex: 2,
            points: 1,
            explanation: 'EN: file ignores the name and reads the first bytes: "#!/bin/sh" means a script. Linux never trusts extensions. "executable" here describes the content (it starts with #!), not permission — the file was -rw-r--r-- and would not run by itself; that needs chmod +x (Chapter 7).|||VI: file bỏ qua cái tên và đọc mấy byte đầu: "#!/bin/sh" nghĩa là một script. Linux không bao giờ tin phần đuôi. Chữ "executable" ở đây mô tả NỘI DUNG (bắt đầu bằng #!), không phải quyền — file đang là -rw-r--r-- và không tự chạy được; muốn chạy phải chmod +x (Chương 7).',
          },
          {
            question: 'You deleted a 500 MB log with rm. du on its folder shows 4.0K, but df still shows the space as used. Which command finds the cause?|||Bạn đã rm một file log 500 MB. du trên thư mục đó hiện 4.0K, nhưng df vẫn báo chỗ đó đang bị dùng. Lệnh nào tìm ra nguyên nhân?',
            options: [
              'lsof +L1',
              'du -sh --deleted /',
              'ls -la /srv/log',
              'sync; df -h',
            ],
            correctIndex: 0,
            points: 1,
            explanation: 'EN: lsof +L1 lists open files with fewer than one link — deleted but still held. The test printed "sleep 4087 3w … 524288000 0 /srv/log/access.log (deleted)"; killing PID 4087 dropped df from 24073 to 23573 MB. ls -la cannot help: the name is already gone, which is exactly why du sees nothing.|||VI: lsof +L1 liệt kê những file đang mở có ít hơn một liên kết — đã xoá mà vẫn bị giữ. Khi thử nó in "sleep 4087 3w … 524288000 0 /srv/log/access.log (deleted)"; diệt PID 4087 thì df giảm từ 24073 xuống 23573 MB. ls -la không giúp gì: cái tên đã mất, và đó chính là lý do du không thấy gì.',
          },
          {
            question: 'Your script uses "stat -c %s file" to read a file size. It works on the VPS; on your Mac it prints "stat: illegal option -- c". Which line works on the Mac?|||Script của bạn dùng "stat -c %s file" để đọc cỡ file. Trên VPS thì chạy; trên Mac lại in "stat: illegal option -- c". Dòng nào chạy được trên Mac?',
            options: [
              'stat --format=%s file',
              'stat -c "%s" file',
              'stat --printf=%s file',
              'stat -f %z file',
            ],
            correctIndex: 3,
            points: 1,
            explanation: 'EN: macOS ships BSD stat, whose format flag is -f with its own codes: %z is the size (tested: stat -f "%Sp %Lp %Su %z %N" printed "-rw-r--r-- 644 admin 3 ghi-chu.txt"). --format and --printf are GNU long options; BSD stat rejects them too (stat: illegal option -- -); quoting "%s" changes nothing.|||VI: macOS dùng stat kiểu BSD, cờ định dạng là -f với bộ mã riêng: %z là cỡ (đã thử: stat -f "%Sp %Lp %Su %z %N" in "-rw-r--r-- 644 admin 3 ghi-chu.txt"). --format và --printf là cờ dài của GNU; stat BSD cũng từ chối (stat: illegal option -- -); bọc nháy "%s" không đổi được gì.',
          },
        ],
      },
    },
  ],
};
