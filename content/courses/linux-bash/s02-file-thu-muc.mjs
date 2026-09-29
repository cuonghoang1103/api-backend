/**
 * Linux & Bash — Chương 2: File & thư mục.
 * Tạo/chép/chuyển/xoá an toàn · glob và ký tự đại diện · find · liên kết và nén · quiz.
 * Output CHẠY THẬT Ubuntu 24.04. LUẬT: backtick → &#96;; ${ → \${;
 * < > trong code → &lt; &gt;; & → &amp;. Khối .out đóng bằng </div>. KHÔNG dùng <svg>.
 *
 * Nâng cấp 28/09/2026: bài 2.0 slide (deck lx-02, 32 slide) + slide/🧪/🗂/📌 + phần đào sâu trong 2.1–2.4
 * (bảng cờ cp/mv/rm, rm không thùng rác, extglob, glob vs regex, đo -exec \; vs +, bảng cờ xargs,
 * stat/inode, bẫy link/, tar -a/--zstd/-t/-C, đo bộ nén thật, macOS/WSL khác gì); quiz 10 câu.
 * Output MỚI chạy thật 28/09/2026: container ubuntu:24.04 (bash 5.2.21, coreutils 9.4, findutils 4.9.0,
 * GNU tar 1.35) và macOS (zsh 5.9, /bin/bash 3.2.57, công cụ BSD). Đã SỬA 5 chỗ sai của bản cũ (ghi ngay tại chỗ).
 */
import { gallery, slide } from './_slides.mjs';

const REF = '?ref=%2Fcourses%2Flinux-bash%2Flearn&reflabel=Linux%20%26%20Bash';

export default {
  title: 'Chapter 2 — Files & directories|||Chương 2 — File & thư mục',
  description: 'Mọi thao tác trên file bạn cần hằng ngày, kèm những chốt an toàn mà người có kinh nghiệm dùng: tạo, chép, chuyển, xoá; ký tự đại diện và lý do chúng nguy hiểm; find như một công cụ tìm kiếm thật sự; liên kết cứng và tượng trưng; và nén/giải nén mà không phải tra lại tar mỗi lần.',
  lessons: [
    /* ─────────────────────────── 2.0 ─────────────────────────── */
    {
      title: '2.0 — Chapter 2 slides: files, globs, find, links and tar in pictures|||2.0 — Slide Chương 2: file, glob, find, liên kết và tar bằng hình',
      slug: 'lnx-2-0-slides',
      type: 'DOCUMENT',
      isFreePreview: true,
      description: 'Bộ 32 slide của Chương 2: năm lệnh file và cờ quan trọng, rm không có thùng rác, glob khác regex, find với -exec + và xargs -0, inode và liên kết, tar đời mới cùng số đo bộ nén thật — xem trước khi học hoặc dùng để ôn.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Slides</span>
<h2>The whole chapter in 32 slides</h2>
<p class="lead">Skim these before the lessons to see the one idea the chapter is built on — a name is not the thing it names — then come back after the quiz as a revision sheet. Every picture reappears inside the lesson that explains it: <code>rm</code> striking out a directory entry, the glob-versus-regex table, the <code>-mtime</code> ruler, the inode map of hard and symbolic links, and a real compressor benchmark.</p>
<p>Slides 3–8 belong to Lesson 2.1, 9–14 to 2.2, 15–20 to 2.3 and 21–27 to 2.4. Then come the chapter's common mistakes, a two-page cheat sheet, a table of what differs on macOS and WSL, and a 40-minute practice session. Every terminal on the slides is real output, recorded on 28 September 2026 in an Ubuntu 24.04 container (bash 5.2, coreutils 9.4, findutils 4.9, GNU tar 1.35) and on a Mac M1 (zsh 5.9, bash 3.2, BSD tools). The slides are in Vietnamese; the code and the diagrams read the same in any language.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Slide</span>
<h2>Cả chương trong 32 slide</h2>
<p class="lead">Lướt bộ này trước khi vào bài để thấy ý tưởng duy nhất mà cả chương dựng lên — một cái tên không phải là thứ nó gọi tên — rồi quay lại sau bài kiểm tra như một tờ ôn tập. Mỗi hình ở đây đều xuất hiện lại trong bài giảng giải thích nó: <code>rm</code> gạch một mục thư mục, bảng glob so với regex, cây thước <code>-mtime</code>, bản đồ inode của liên kết cứng và liên kết tượng trưng, và một phép đo bộ nén thật.</p>
<p>Slide 3–8 thuộc Bài 2.1, 9–14 thuộc 2.2, 15–20 thuộc 2.3 và 21–27 thuộc 2.4. Tiếp theo là những sai lầm hay gặp của chương, bảng tra nhanh hai trang, bảng những gì khác đi trên macOS và WSL, và một buổi thực hành 40 phút. Mọi terminal trên slide là output THẬT, ghi ngày 28/09/2026 trong container Ubuntu 24.04 (bash 5.2, coreutils 9.4, findutils 4.9, GNU tar 1.35) và trên Mac M1 (zsh 5.9, bash 3.2, công cụ BSD) — con số trên máy bạn (số inode, thời gian) có thể khác, quy luật thì không.</p>
</div>
${gallery('lx-02', [
  [1, 'Bìa'], [2, 'Bản đồ chương'],
  [3, 'Năm lệnh làm 90% việc với file'], [4, 'cp -r: đích có sẵn hay chưa'], [5, 'mv chỉ sửa một mục thư mục'],
  [6, 'rm không có thùng rác'], [7, 'Biến rỗng + rm -rf'], [8, 'Ba lưới an toàn'],
  [9, 'Shell khai triển glob trước'], [10, 'Bốn ký tự đại diện và ngoặc nhọn'], [11, 'Glob khác regex'],
  [12, 'Glob không khớp: bash và zsh'], [13, 'File ẩn và globskipdots'], [14, 'extglob và globstar'],
  [15, 'Ba phần của lệnh find'], [16, 'Bảng phép thử của find'], [17, '-mtime cắt phần lẻ'],
  [18, '-exec \\; vs + vs xargs — đo thật'], [19, 'Tên có dấu cách và byte NUL'], [20, '-o cần ngoặc, -delete đứng cuối'],
  [21, 'Tên file là con trỏ tới inode'], [22, 'Hard link và symlink khi xoá đích'], [23, 'Deploy nguyên tử: ln -sfn + mv -T'],
  [24, 'tar chỉ gói, nén là việc khác'], [25, 'Bảng cờ tar'], [26, 'Đo thật bốn bộ nén'], [27, 'Luôn -t trước -x'],
  [28, 'Sai lầm hay gặp'], [29, 'Bảng tra nhanh (1/2)'], [30, 'Bảng tra nhanh (2/2)'],
  [31, 'Ubuntu · macOS · WSL khác gì'], [32, 'Thực hành chương 2'],
])}
`,
    },

    /* ─────────────────────────── 2.1 ─────────────────────────── */
    {
      title: '2.1 — Create, copy, move, delete — safely|||2.1 — Tạo, chép, chuyển, xoá — một cách an toàn',
      slug: 'lnx-2-1-tao-chep-chuyen-xoa',
      type: 'LESSON',
      isFreePreview: true,
      description: 'touch/mkdir/cp/mv/rm với đúng những cờ quan trọng, dấu gạch chéo cuối làm đổi hành vi của cp, vì sao mv vừa là đổi tên vừa là di chuyển, và ba chốt an toàn thay cho việc "cẩn thận hơn".',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Five commands, and the flags that matter</h2>
<p class="lead">These are the operations you will run thousands of times. Each has one or two flags that change everything, and one failure mode that costs people real data. This lesson is those flags and those failure modes.</p>

<h3>Creating</h3>
${slide('lx-02', 3, 'Năm lệnh làm 90% việc với file — mỗi lệnh một cờ quan trọng')}
<pre><code class="language-bash">touch notes.txt                    <span class="tok-comment"># create an empty file, or update its mtime</span>
mkdir logs                         <span class="tok-comment"># one directory</span>
mkdir -p build/assets/images       <span class="tok-comment"># the whole path, creating parents as needed</span>
mkdir -p src/{api,web,shared}      <span class="tok-comment"># brace expansion — three at once</span></code></pre>
<div class="out">src/
├── api
├── shared
└── web</div>
<div class="callout ok"><code>mkdir -p</code> has a second, quieter benefit: it does not fail if the directory already exists. That makes it safe to run repeatedly, which is exactly what you want in a script (Chapter 7) — plain <code>mkdir</code> would abort the whole script the second time it runs.</div>

<h3>Copying — and the trailing slash</h3>
${slide('lx-02', 4, 'cp -r: đích có sẵn hay chưa quyết định kết quả')}
<pre><code>cp file.txt backup.txt             <span class="tok-comment"># copy to a new name</span>
cp file.txt /tmp/                  <span class="tok-comment"># copy into a directory, same name</span>
cp -r src/ /tmp/backup/            <span class="tok-comment"># -r is REQUIRED for directories</span>
cp -a src/ /tmp/backup/            <span class="tok-comment"># archive: preserve permissions, times, links</span>
cp -i file.txt backup.txt          <span class="tok-comment"># ask before overwriting</span>
cp -v *.md docs/                   <span class="tok-comment"># print what it does</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">-r</span><span class="v">Recursive. Without it, copying a directory fails outright — a good error, but the flag people forget.</span></div>
  <div class="kv"><span class="k">-a</span><span class="v">Archive mode: <code>-r</code> plus preserving ownership, permissions and timestamps. What you want for a backup.</span></div>
  <div class="kv"><span class="k">-i</span><span class="v">Interactive. Prompts before clobbering an existing file. Worth aliasing on (below).</span></div>
  <div class="kv"><span class="k">-n</span><span class="v">Never overwrite, silently skip. The non-interactive version of <code>-i</code> for scripts.</span></div>
  <div class="kv"><span class="k">-u</span><span class="v">Only copy when the source is newer. Cheap incremental copies.</span></div>
</div>
<div class="callout warn"><strong>The trailing slash on the SOURCE changes what happens</strong> — for <code>cp -r</code> and dramatically so for <code>rsync</code> (Chapter 9):</div>
<pre><code>cp -r src  /tmp/dest/       <span class="tok-comment"># → /tmp/dest/src/…   (the directory itself)</span>
cp -r src/ /tmp/dest/       <span class="tok-comment"># → /tmp/dest/src/…   (STILL the directory) — GNU cp ignores</span>
                            <span class="tok-comment">#   the slash, but rsync and macOS cp do NOT. Build the habit now.</span></code></pre>
<div class="callout warn"><strong>Corrected, measured on Ubuntu 24.04 (coreutils 9.4):</strong> an earlier version of this lesson said the slash version copies the <em>contents</em>. It does not. GNU <code>cp</code> ignores a trailing slash on the source, so when the destination already exists both lines create <code>dest/src/</code>. It is macOS <code>cp</code> (BSD) that reads <code>src/</code> as "what is inside" — so the same command gives two different trees on your Mac and on the VPS. The portable way to say "copy the contents" is <code>cp -a src/. dest/</code>: <code>.</code> names the directory itself, so everything inside it — dotfiles included — lands directly in <code>dest</code> on both systems.</div>
<pre><code class="language-bash">cp -r src dst          <span class="tok-comment"># dst does not exist yet → dst is a copy of src</span>
cp -r src dst          <span class="tok-comment"># run it again: dst exists now</span>
ls dst
rm -rf dst; mkdir dst
cp -r src/ dst/        <span class="tok-comment"># with the slash, into an existing dst</span>
ls dst</code></pre>
<div class="out">api  app.ts  auth.ts  shared  src  web
src</div>

<h3>Moving and renaming — the same command</h3>
${slide('lx-02', 5, 'mv chỉ sửa một mục thư mục — và đè đích không hỏi')}
<pre><code>mv old.txt new.txt                 <span class="tok-comment"># rename</span>
mv file.txt /tmp/                  <span class="tok-comment"># move</span>
mv *.log logs/                     <span class="tok-comment"># move several into a directory</span>
mv -i a.txt b.txt                  <span class="tok-comment"># ask before overwriting</span>
mv -n a.txt b.txt                  <span class="tok-comment"># never overwrite</span></code></pre>
<p>There is no separate rename command because there is nothing to separate: a file's name is an entry in a directory (1.4), so renaming and moving are both "change which directory entry points at this inode". Within one filesystem <code>mv</code> is instant regardless of size — it rewrites an entry, it does not copy bytes.</p>
<pre><code><span class="tok-comment"># Across filesystems it is different: copy, then delete. Slow, and</span>
<span class="tok-comment"># interruptible — which is why a Ctrl-C during a cross-disk mv can</span>
<span class="tok-comment"># leave a half-written file at the destination.</span>
mv /home/an/bigfile.iso /mnt/usb/</code></pre>
<div class="callout danger"><code>mv</code> overwrites the destination without asking. <code>mv notes.txt README.md</code> destroys the existing <code>README.md</code> silently and immediately — no prompt, no backup, no undo. This is the most common way people lose a file to a typo.</div>

<h3>Deleting</h3>
${slide('lx-02', 6, 'rm không có thùng rác: nó chỉ gạch cái tên')}
<pre><code>rm file.txt                        <span class="tok-comment"># one file</span>
rm -i *.log                        <span class="tok-comment"># ask about each</span>
rm -r olddir/                      <span class="tok-comment"># a directory and its contents</span>
rm -f file.txt                     <span class="tok-comment"># force: no prompt, no error if missing</span>
rmdir emptydir/                    <span class="tok-comment"># only removes an EMPTY directory — a safety net</span></code></pre>
<div class="callout danger"><strong>There is no recycle bin.</strong> <code>rm</code> unlinks the name and the space becomes reusable immediately. Recovery requires specialist tools, usually fails on a busy filesystem, and is not something to plan around. The habits below are not beginner caution — they are what people do after losing something.</div>
<pre><code class="language-bash"><span class="tok-comment"># The three safety habits, in order of value:</span>

<span class="tok-comment"># 1. LOOK first. Same pattern, harmless command.</span>
ls -la *.log
rm *.log

<span class="tok-comment"># 2. Never combine -r and -f until you have read the path twice.</span>
<span class="tok-comment">#    rm -rf is right for a build directory and catastrophic one space off:</span>
rm -rf build/          <span class="tok-comment"># fine</span>
rm -rf / build/        <span class="tok-comment"># ← a space that ends the machine</span>

<span class="tok-comment"># 3. Make the destructive commands ask, on your own machine.</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"alias rm='rm -i'"</span> &gt;&gt; ~/.bashrc
<span class="tok-keyword">echo</span> <span class="tok-string">"alias cp='cp -i'"</span> &gt;&gt; ~/.bashrc
<span class="tok-keyword">echo</span> <span class="tok-string">"alias mv='mv -i'"</span> &gt;&gt; ~/.bashrc</code></pre>
<div class="callout warn">Aliases are a personal seatbelt, not a control. They do not exist in scripts, in <code>cron</code>, over <code>ssh -c</code>, or on any other machine — and getting used to a prompt that will not always appear is its own risk. Treat them as a nudge, and keep habit 1 regardless.</div>

<h3>A safer delete: move to a holding area</h3>
${slide('lx-02', 8, 'Ba lưới an toàn thay cho “cẩn thận hơn”')}
<pre><code class="language-bash"><span class="tok-comment"># For anything you are not certain about, park it instead of deleting it.</span>
mkdir -p ~/.trash
mv suspicious-dir ~/.trash/

<span class="tok-comment"># Or install a real trash command that the desktop can restore from:</span>
sudo apt install -y trash-cli
trash-put olddir/
trash-list
trash-restore</code></pre>

<h3>The flags, in one table (Ubuntu 24.04, coreutils 9.4)</h3>
<table>
<thead><tr><th>Command · flag</th><th>What it does</th><th>Example / note</th></tr></thead>
<tbody>
<tr><td><code>mkdir -p</code></td><td>Create the whole path; no error if it already exists</td><td><code>mkdir -p logs/2026/09</code> — safe to re-run</td></tr>
<tr><td><code>mkdir -m 700</code></td><td>Set permissions at creation time</td><td><code>mkdir -m 700 ~/.secrets</code> (permissions: Chapter 4)</td></tr>
<tr><td><code>touch -d</code></td><td>Set the modification time to any moment</td><td><code>touch -d "2 hours ago" /tmp/mark</code> — a cut-off for <code>find -newer</code></td></tr>
<tr><td><code>cp -a</code></td><td>Archive: recursive + keep mode, owner, timestamps, symlinks (<code>-dR --preserve=all</code>)</td><td>The flag for backups</td></tr>
<tr><td><code>cp -r</code></td><td>Recursive, but new timestamps and your ownership</td><td>When you <em>want</em> fresh metadata</td></tr>
<tr><td><code>cp -i</code> · <code>--update=none</code></td><td>Ask before overwriting · never overwrite</td><td>coreutils 9.4 warns that <code>-n</code> is non-portable and suggests <code>--update=none</code></td></tr>
<tr><td><code>cp -u</code> · <code>-v</code></td><td>Only copy if the source is newer · print each file</td><td><code>cp -uv src/*.ts build/</code></td></tr>
<tr><td><code>cp --backup=numbered</code></td><td>Keep the old destination as <code>name.~1~</code>, <code>name.~2~</code>…</td><td>Replacing a config you might need back</td></tr>
<tr><td><code>mv -i</code> · <code>-n</code> · <code>-b</code></td><td>Ask · never overwrite · back up the destination first</td><td>coreutils 9.4: <code>mv -n</code> that skips now exits <strong>1</strong></td></tr>
<tr><td><code>mv -T</code></td><td>Treat the destination as a file, never move <em>into</em> it</td><td>Atomic symlink swap, Lesson 2.4</td></tr>
<tr><td><code>rm -i</code> · <code>-I</code></td><td>Ask for every file · ask once if more than 3 files or recursive</td><td><code>rm -I *.log</code> — a prompt you will actually read</td></tr>
<tr><td><code>rm -r</code> · <code>-f</code> · <code>-d</code></td><td>Recursive · never ask, no error if missing · remove an empty directory</td><td><code>-f</code> also hides typos — read the path twice</td></tr>
<tr><td><code>rm --preserve-root</code></td><td>The default: refuse to recurse on <code>/</code> itself</td><td>Does <strong>not</strong> protect <code>/*</code> (below)</td></tr>
</tbody>
</table>
<p>Two of those rows changed recently enough to bite scripts written for older systems. Measured on Ubuntu 24.04:</p>
<pre><code class="language-bash">cp -r cau-hinh bak-r; cp -a cau-hinh bak-a
ls -l --time-style='+%F %R' cau-hinh/app.yml bak-r/app.yml bak-a/app.yml
echo A &gt; a.txt; echo B &gt; b.txt
cp -n a.txt b.txt; echo "exit=$?"
mv -n a.txt b.txt; echo "exit=$?"</code></pre>
<div class="out">-rw-r--r-- 1 cuong cuong 3 2026-09-01 09:00 bak-a/app.yml
-rw-r--r-- 1 cuong cuong 3 2026-09-28 09:05 bak-r/app.yml
-rw-r--r-- 1 cuong cuong 3 2026-09-01 09:00 cau-hinh/app.yml
cp: warning: behavior of -n is non-portable and may change in future; use --update=none instead
exit=0
mv: not replacing 'b.txt'
exit=1</div>
<p>Read the first three lines: <code>cp -a</code> kept the original time (<code>09-01 09:00</code>), <code>cp -r</code> stamped the copy with "now". A backup whose timestamps all say "today" is a backup you cannot use to answer "what changed last week". And the last line matters under <code>set -e</code> (Chapter 7): a script that says <code>mv -n new old</code> as a harmless "only if missing" will now <em>stop</em> when the file is already there.</p>
<div class="callout ok"><strong>When to use which:</strong> <code>cp -a</code> for anything you might restore; <code>cp -r</code> when copying someone else's files and you want them to become yours; <code>mv -n</code>/<code>--backup=numbered</code> whenever the destination could exist; <code>rm -I</code> as your everyday interactive delete. <strong>When NOT to:</strong> never <code>rm -rf</code> a path built from a variable without the guard below, and never <code>cp -r</code> a backup of something whose timestamps you care about.</div>

<h3>rm has no recycle bin — see it for yourself in a throwaway container</h3>
<p>Do this inside <code>docker run --rm -it ubuntu:24.04 bash</code>, not on your own machine. <code>rm</code> calls <code>unlink()</code>: it removes one <em>name</em> from a directory and lowers the inode's link count. When the count reaches zero and no process holds the file open, the space is marked free and the next write can reuse it. There is no step that moves anything anywhere:</p>
<pre><code class="language-bash">echo "bao cao quan trong" &gt; bao-cao.txt
ls -li bao-cao.txt
rm bao-cao.txt
ls bao-cao.txt
ls -d ~/.local/share/Trash</code></pre>
<div class="out">43293 -rw-r--r-- 1 cuong cuong 19 Sep 28 08:40 bao-cao.txt
ls: cannot access 'bao-cao.txt': No such file or directory
ls: cannot access '/home/cuong/.local/share/Trash': No such file or directory</div>
<p>The "Trash" your desktop shows is a folder, <code>~/.local/share/Trash</code>, defined by the FreeDesktop trash specification; file managers <em>move</em> things into it. <code>rm</code> has never heard of it — which is why it did not even exist here. Now the failure that turns this into a disaster: a variable that is empty.</p>
${slide('lx-02', 7, 'Biến rỗng + rm -rf = danh sách mọi thư mục của máy')}
<pre><code class="language-bash">THU_MUC=""                       <span class="tok-comment"># forgot to set it, or typed the name wrong</span>
echo rm -rf "$THU_MUC"/*         <span class="tok-comment"># echo first: what would rm receive?</span></code></pre>
<div class="out">rm -rf /bin /boot /dev /etc /home /lib /media /mnt /opt /proc /root /run /sbin /srv /sys /tmp /usr /var</div>
<p><code>"$THU_MUC"/*</code> became <code>/*</code>, and the glob expanded it into every top-level directory of the machine. The built-in guard does not help here:</p>
<pre><code>rm -rf /                          <span class="tok-comment"># in the throwaway container, as root</span></code></pre>
<div class="out">rm: it is dangerous to operate recursively on '/'
rm: use --no-preserve-root to override this failsafe</div>
<p><code>--preserve-root</code> (on by default) refuses exactly one path: <code>/</code>. <code>/*</code> is eighteen <em>other</em> paths, and it lets every one of them through. The guards that work belong to the shell:</p>
<pre><code>bash -c 'THU_MUC=""; echo rm -rf "\${THU_MUC:?chua dat THU_MUC}"/*'
bash -c 'set -u; echo rm -rf "$THU_MUC2"/*'</code></pre>
<div class="out">bash: line 1: THU_MUC: chua dat THU_MUC
bash: line 1: THU_MUC2: unbound variable</div>
<p><code>\${VAR:?message}</code> means "if VAR is empty or unset, print the message and stop — do not run this command". <code>set -u</code> makes any <em>unset</em> variable a fatal error for the whole script (Chapter 7 makes it a default). Both stop the line before <code>rm</code> ever starts, which is the only point at which stopping helps.</p>

<h3>Try it step by step: a real trash can on the command line</h3>
<p>If you want "undo" in the terminal, install it — do not alias <code>rm</code> to something clever. <code>trash-cli</code> writes into the same FreeDesktop Trash the file manager uses, and remembers where each item came from:</p>
<pre><code class="language-bash">sudo apt install -y trash-cli
touch f{1..5}.log
rm -I f*.log                      <span class="tok-comment"># answer n</span>
mkdir cu &amp;&amp; echo x &gt; cu/a.txt
trash-put cu/
trash-list
cat ~/.local/share/Trash/info/cu.trashinfo
trash-restore                     <span class="tok-comment"># type 0, Enter</span></code></pre>
<div class="out">rm: remove 5 arguments? n
2026-09-28 08:40:24 /home/cuong/thu-linux/cu
[Trash Info]
Path=/home/cuong/thu-linux/cu
DeletionDate=2026-09-28T08:40:24
   0 2026-09-28 08:40:24 /home/cuong/thu-linux/cu
What file to restore [0..0]: 0</div>
<p><code>rm -I</code> asked <em>once</em> for five files — a prompt short enough that you read it, unlike <code>-i</code>, which trains you to hammer <code>y</code>. <code>trash-put</code> moved the directory into the Trash and wrote a small <code>.trashinfo</code> file holding the original path and time; <code>trash-restore</code> reads that to put it back. <code>trash-empty 30</code> clears items older than 30 days.</p>

<h3>On macOS and WSL: what is different</h3>
${slide('lx-02', 31, 'Cùng lệnh, khác máy: Ubuntu · macOS · WSL')}
<p>The Mac ships the BSD versions of these tools, and three of them behave differently from the VPS in ways that matter. Measured on macOS (Mac M1) in a scratch directory:</p>
<pre><code class="language-bash">mkdir -p s1/sub d1 d2; touch s1/a s1/sub/b
cp -R s1 d1; cp -R s1/ d2         <span class="tok-comment"># BSD cp: the slash DOES mean "contents"</span>
ls d1 d2
echo A &gt; a; echo B &gt; b; mv -n a b; echo "exit=$?"
touch f1 f2 f3 f4 f5; rm -I f?    <span class="tok-comment"># answer n</span>
stat -c %s a                      <span class="tok-comment"># GNU syntax</span>
stat -f '%z %N' b                 <span class="tok-comment"># BSD syntax</span></code></pre>
<div class="out">d1:
s1

d2:
a
sub
exit=0
remove 5 files? n
stat: illegal option -- c
usage: stat [-FLnq] [-f format | -l | -r | -s | -x] [-t timefmt] [file ...]
2 b</div>
<p>So on the Mac: <code>cp -R s1/ d2</code> copied the <em>contents</em> (on Ubuntu it would have created <code>d2/s1</code>); <code>mv -n</code> skipped silently with exit 0 (Ubuntu: exit 1 and a message); <code>rm -I</code> exists but words its question differently; and <code>stat</code> takes <code>-f</code> with different format letters. Write <code>cp -a src/. dst/</code> and avoid depending on <code>mv -n</code>'s exit status, and the same script behaves the same on both.</p>
<p>WSL2 is a real Ubuntu, so everything in this lesson behaves exactly as on the VPS — <em>inside the Linux filesystem</em> (<code>~</code>). A project kept under <code>/mnt/c/…</code> lives on the Windows drive and crosses a translation layer on every file operation; Microsoft's own guidance is to keep files in the WSL filesystem when you work with Linux tools, for speed.</p>

<h3>Reading a file quickly</h3>
<pre><code class="language-bash">cat small.txt                      <span class="tok-comment"># dump it all — only for SMALL files</span>
less big.log                       <span class="tok-comment"># page through it; q to quit, / to search</span>
head -20 file.txt                  <span class="tok-comment"># first 20 lines</span>
tail -20 file.txt                  <span class="tok-comment"># last 20 lines</span>
tail -f /var/log/syslog            <span class="tok-comment"># follow live — the log-watching command</span>
tail -F /var/log/nginx/access.log  <span class="tok-comment"># follow, and survive log rotation</span></code></pre>
<div class="callout ok"><code>tail -F</code> (capital F) is the one to use on a server. Lowercase <code>-f</code> follows the file <em>descriptor</em>, so when log rotation renames the file (Chapter 10) it keeps watching a file nobody writes to any more and appears to hang. Capital <code>-F</code> follows the <em>name</em> and reopens it.</div>

<h3>Watching what a command is doing</h3>
<pre><code>cp -rv src/ /tmp/backup/           <span class="tok-comment"># -v prints each file as it goes</span>
cp -r src/ /tmp/backup/ &amp;&amp; <span class="tok-keyword">echo</span> <span class="tok-string">"done"</span>   <span class="tok-comment"># only echo if cp succeeded</span></code></pre>
<div class="out">'src/app.ts' -> '/tmp/backup/src/app.ts'
'src/auth.ts' -> '/tmp/backup/src/auth.ts'
done</div>
<p>The <code>&amp;&amp;</code> is a preview of Chapter 6: run the second command only if the first succeeded. On a long copy it is the difference between knowing it worked and assuming it did.</p>

<h3>The trailing slash, which changes what cp and rsync mean</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">cp -r src dst — dst does not exist</span><span class="lz-d">Creates <code>dst</code> as a copy of <code>src</code>. This is what you almost always meant.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">cp -r src dst — dst already exists</span><span class="lz-d">Creates <code>dst/src</code>. Same command, different outcome, decided entirely by whether the destination happened to exist.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">rsync src/ dst/ — with the slash</span><span class="lz-d">Copies the <em>contents</em> of <code>src</code> into <code>dst</code>. The slash means &quot;what is inside&quot;.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">rsync src dst/ — without it</span><span class="lz-d">Copies the <em>directory</em>, producing <code>dst/src</code>. One character, and a deploy that lands one level deeper than expected.</span></div>
</div>
<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your SWP391 team shares a machine with a live config directory and a pile of temp files. The team lead asks you to replace the config with a new version while keeping the old one, and to clear the temp files — without losing anything you did not mean to.</p><ol>
<li>Build the playground: <code>mkdir -p ~/thu-linux/c21/{cau-hinh,tam} &amp;&amp; cd ~/thu-linux/c21</code>, then <code>touch tam/{a,b,c,d,e}.tmp; echo v1 &gt; cau-hinh/app.yml; echo v2 &gt; app.yml.moi; touch -d '2026-09-01 09:00' cau-hinh/app.yml</code>.</li>
<li>Back up twice and compare the times: <code>cp -r cau-hinh bak-r; cp -a cau-hinh bak-a</code>, then <code>ls -l --time-style='+%F %R' cau-hinh/app.yml bak-r/app.yml bak-a/app.yml</code>. Which copy kept the original time?</li>
<li>Replace the config while keeping the old one — run this <em>twice</em>: <code>cp --backup=numbered app.yml.moi cau-hinh/app.yml</code>. Then <code>ls cau-hinh</code> and <code>cat cau-hinh/app.yml.~1~</code>.</li>
<li>Clear the temp files with a safety net: try <code>rm -I tam/*.tmp</code> and answer <code>n</code>; then <code>trash-put tam</code> (install with <code>sudo apt install trash-cli</code>; on a Mac use <code>mv tam ~/.Trash/</code>) and <code>trash-list</code>.</li>
<li>Prove the empty-variable guard: <code>D=""; echo rm -rf "\${D:?}"/*</code> — the command must <em>not</em> be printed.</li></ol>
<div class="out">-rw-r--r-- 1 cuong cuong 3 2026-09-01 09:00 bak-a/app.yml
-rw-r--r-- 1 cuong cuong 3 2026-09-28 09:05 bak-r/app.yml
-rw-r--r-- 1 cuong cuong 3 2026-09-01 09:00 cau-hinh/app.yml
app.yml
app.yml.~1~
app.yml.~2~
v1
rm: remove 5 arguments? n
2026-09-28 09:05:40 /home/cuong/thu-linux/c21/tam
bash: D: parameter null or not set</div>
<p><strong>Done when:</strong> <code>bak-a/app.yml</code> shows <code>2026-09-01 09:00</code> while <code>bak-r/app.yml</code> shows today; <code>ls cau-hinh</code> prints <code>app.yml  app.yml.~1~  app.yml.~2~</code> and <code>app.yml.~1~</code> contains <code>v1</code>; <code>trash-list</code> shows exactly one line ending in <code>c21/tam</code>; and step 5 prints the <code>parameter null or not set</code> error instead of an <code>rm</code> command.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Inode</span><span class="v">The filesystem record holding a file's size, permissions, times and where its data lives — but not its name.</span></div>
  <div class="kv"><span class="k">Directory entry</span><span class="v">One "name → inode number" line inside a directory; renaming a file edits this line.</span></div>
  <div class="kv"><span class="k">Recursive</span><span class="v">Descending into every subdirectory, and their subdirectories (<code>-r</code> / <code>-R</code>).</span></div>
  <div class="kv"><span class="k">Overwrite / clobber</span><span class="v">Replacing the destination file's content with the new file; <code>cp</code> and <code>mv</code> do it without asking.</span></div>
  <div class="kv"><span class="k">unlink</span><span class="v">The system call behind <code>rm</code>: remove one name — not "move to the trash".</span></div>
  <div class="kv"><span class="k">Archive mode (<code>-a</code>)</span><span class="v">Copy keeping mode, owner, timestamps and symlinks — what a backup needs.</span></div>
  <div class="kv"><span class="k">Idempotent</span><span class="v">Running once or ten times gives the same result, like <code>mkdir -p</code>.</span></div>
  <div class="kv"><span class="k">Trash</span><span class="v"><code>~/.local/share/Trash</code>, the FreeDesktop folder used by file managers and <code>trash-cli</code>; <code>rm</code> never touches it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li><code>mkdir -p</code> creates the whole path and is safe to re-run; <code>cp -a</code> (not <code>-r</code>) keeps permissions, times and symlinks in a backup.</li>
<li><code>cp -r src dst</code> gives different results depending on whether <code>dst</code> exists; GNU <code>cp</code> ignores a trailing slash and macOS does not — <code>cp -a src/. dst/</code> means "the contents" everywhere.</li>
<li>Within one filesystem <code>mv</code> only edits a directory entry, so it is instant — and it overwrites silently; use <code>-n</code>, <code>-i</code> or <code>--backup=numbered</code>.</li>
<li><code>rm</code> only removes a name (<code>unlink</code>); there is no trash and no undo — the trash belongs to <code>trash-cli</code> and file managers.</li>
<li>An empty variable turns <code>rm -rf "$X"/*</code> into <code>rm -rf /*</code>; <code>\${X:?}</code> and <code>set -u</code> stop it, <code>--preserve-root</code> does not.</li>
<li>Cheapest habits: <code>echo</code>/<code>ls</code> the exact pattern first, <code>rm -I</code> for bulk deletes — and remember coreutils 9.4 treats a skipping <code>mv -n</code> as an error (exit 1) under <code>set -e</code>.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/cp.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">cp(1) — including -a, -u and the --backup options</span><span class="lc-sub"><code>--backup=numbered</code> is a useful middle ground between <code>-i</code> and overwriting.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: reorganise a directory tree without losing anything</span><span class="lc-sub">Graded exercises on cp -a, mv, rm and the trailing-slash difference.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>mv</code> silently destroying a file. <code>mv config.new config.yml</code> when <code>config.yml</code> already exists overwrites it with no prompt and no backup — and unlike <code>rm</code>, this one does not <em>feel</em> destructive, which is why it catches people. Use <code>mv -i</code> when the destination might exist, or <code>mv -n</code> in scripts where silently skipping is safer than silently clobbering.</div>
<p class="note-ct"><strong>The habit that prevents almost all of this:</strong> run <code>ls</code> with the exact pattern before running <code>rm</code>, <code>mv</code> or <code>cp</code> with it. The shell expands the pattern identically for both, so what <code>ls</code> lists is precisely what the destructive command will act on. Two seconds, and it turns a guess into a fact.</p>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Năm lệnh, và những cái cờ thật sự quan trọng</h2>
<p class="lead">Đây là những thao tác bạn sẽ chạy hàng nghìn lần. Mỗi cái có một hai cái cờ làm đổi mọi thứ, và một kiểu hỏng làm người ta mất dữ liệu thật. Bài này nói về đúng những cái cờ đó và những kiểu hỏng đó.</p>

<h3>Tạo</h3>
${slide('lx-02', 3, 'Năm lệnh làm 90% việc với file — mỗi lệnh một cờ quan trọng')}
<pre><code class="language-bash">touch notes.txt                    <span class="tok-comment"># tạo một file rỗng, hoặc cập nhật mtime của nó</span>
mkdir logs                         <span class="tok-comment"># một thư mục</span>
mkdir -p build/assets/images       <span class="tok-comment"># cả đường dẫn, tạo luôn thư mục cha khi cần</span>
mkdir -p src/{api,web,shared}      <span class="tok-comment"># khai triển ngoặc nhọn — ba cái một lúc</span></code></pre>
<div class="out">src/
├── api
├── shared
└── web</div>
<div class="callout ok"><code>mkdir -p</code> còn một lợi ích thứ hai, âm thầm hơn: nó KHÔNG báo lỗi nếu thư mục đã tồn tại. Điều đó làm cho nó an toàn khi chạy lặp lại, và đó đúng là thứ bạn muốn trong một script (Chương 7) — <code>mkdir</code> trơn sẽ làm cả script dừng ngay lần chạy thứ hai.</div>

<h3>Chép — và dấu gạch chéo cuối</h3>
${slide('lx-02', 4, 'cp -r: đích có sẵn hay chưa quyết định kết quả')}
<pre><code>cp file.txt backup.txt             <span class="tok-comment"># chép sang một tên mới</span>
cp file.txt /tmp/                  <span class="tok-comment"># chép vào một thư mục, giữ nguyên tên</span>
cp -r src/ /tmp/backup/            <span class="tok-comment"># -r là BẮT BUỘC với thư mục</span>
cp -a src/ /tmp/backup/            <span class="tok-comment"># chế độ lưu trữ: giữ quyền, thời gian, liên kết</span>
cp -i file.txt backup.txt          <span class="tok-comment"># hỏi trước khi ghi đè</span>
cp -v *.md docs/                   <span class="tok-comment"># in ra nó đang làm gì</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">-r</span><span class="v">Đệ quy. Thiếu nó thì chép một thư mục sẽ hỏng thẳng — một lỗi tốt, nhưng là cái cờ người ta hay quên.</span></div>
  <div class="kv"><span class="k">-a</span><span class="v">Chế độ lưu trữ: <code>-r</code> cộng giữ nguyên chủ sở hữu, quyền và dấu thời gian. Thứ bạn muốn khi sao lưu.</span></div>
  <div class="kv"><span class="k">-i</span><span class="v">Tương tác. Hỏi trước khi đè lên một file đã có. Đáng đặt alias (xem dưới).</span></div>
  <div class="kv"><span class="k">-n</span><span class="v">Không bao giờ ghi đè, âm thầm bỏ qua. Phiên bản không-tương-tác của <code>-i</code>, dành cho script.</span></div>
  <div class="kv"><span class="k">-u</span><span class="v">Chỉ chép khi nguồn mới hơn. Chép tăng dần một cách rẻ tiền.</span></div>
</div>
<div class="callout warn"><strong>Dấu gạch chéo cuối ở phía NGUỒN làm đổi kết quả</strong> — với <code>cp -r</code> và đổi rất mạnh với <code>rsync</code> (Chương 9):</div>
<pre><code>cp -r src  /tmp/dest/       <span class="tok-comment"># → /tmp/dest/src/…   (cả thư mục)</span>
cp -r src/ /tmp/dest/       <span class="tok-comment"># → /tmp/dest/src/…   (VẪN là cả thư mục) — cp của GNU bỏ qua</span>
                            <span class="tok-comment">#   dấu gạch chéo, nhưng rsync và cp của macOS thì KHÔNG. Hãy tạo thói quen ngay.</span></code></pre>
<div class="callout warn"><strong>Đã sửa, đo thật trên Ubuntu 24.04 (coreutils 9.4):</strong> bản cũ của bài này ghi rằng dòng có dấu gạch chéo chép <em>nội dung</em>. Không phải vậy. <code>cp</code> của GNU bỏ qua dấu gạch chéo cuối ở phía nguồn, nên khi đích đã tồn tại thì cả hai dòng đều tạo ra <code>dest/src/</code>. Chính <code>cp</code> của macOS (BSD) mới hiểu <code>src/</code> là "những gì bên trong" — nên cùng một lệnh cho ra hai cây thư mục khác nhau trên Mac của bạn và trên VPS. Cách viết chạy giống nhau ở mọi nơi để nói "chép phần bên trong" là <code>cp -a src/. dest/</code>: dấu <code>.</code> gọi tên chính thư mục đó, nên mọi thứ bên trong nó — kể cả file ẩn — rơi thẳng vào <code>dest</code> trên cả hai hệ thống.</div>
<pre><code class="language-bash">cp -r src dst          <span class="tok-comment"># dst chưa có → dst là bản chép của src</span>
cp -r src dst          <span class="tok-comment"># chạy lại: lúc này dst ĐÃ có</span>
ls dst
rm -rf dst; mkdir dst
cp -r src/ dst/        <span class="tok-comment"># có gạch chéo, vào một dst đã có</span>
ls dst</code></pre>
<div class="out">api  app.ts  auth.ts  shared  src  web
src</div>

<h3>Chuyển và đổi tên — cùng một lệnh</h3>
${slide('lx-02', 5, 'mv chỉ sửa một mục thư mục — và đè đích không hỏi')}
<pre><code>mv old.txt new.txt                 <span class="tok-comment"># đổi tên</span>
mv file.txt /tmp/                  <span class="tok-comment"># chuyển đi</span>
mv *.log logs/                     <span class="tok-comment"># chuyển nhiều file vào một thư mục</span>
mv -i a.txt b.txt                  <span class="tok-comment"># hỏi trước khi ghi đè</span>
mv -n a.txt b.txt                  <span class="tok-comment"># không bao giờ ghi đè</span></code></pre>
<p>Không có lệnh đổi tên riêng vì chẳng có gì để tách riêng: tên của một file là một mục trong một thư mục (bài 1.4), nên đổi tên và di chuyển đều là "đổi xem mục thư mục nào trỏ vào cái inode này". Trong cùng một hệ thống file, <code>mv</code> chạy tức thì bất kể kích thước — nó viết lại một cái mục, nó không chép byte nào.</p>
<pre><code><span class="tok-comment"># Qua hệ thống file khác thì lại khác: chép, rồi xoá. Chậm, và ngắt được</span>
<span class="tok-comment"># — vì thế một cú Ctrl-C giữa lúc mv qua ổ khác có thể để lại một file</span>
<span class="tok-comment"># viết dở ở đích.</span>
mv /home/an/bigfile.iso /mnt/usb/</code></pre>
<div class="callout danger"><code>mv</code> ghi đè lên đích mà không hỏi. <code>mv notes.txt README.md</code> huỷ file <code>README.md</code> đang có, trong im lặng và ngay lập tức — không hỏi, không sao lưu, không hoàn tác. Đây là cách phổ biến nhất mà người ta mất một file vì gõ sai.</div>

<h3>Xoá</h3>
${slide('lx-02', 6, 'rm không có thùng rác: nó chỉ gạch cái tên')}
<pre><code>rm file.txt                        <span class="tok-comment"># một file</span>
rm -i *.log                        <span class="tok-comment"># hỏi từng cái</span>
rm -r olddir/                      <span class="tok-comment"># một thư mục và nội dung của nó</span>
rm -f file.txt                     <span class="tok-comment"># ép: không hỏi, không báo lỗi nếu không có</span>
rmdir emptydir/                    <span class="tok-comment"># chỉ xoá thư mục RỖNG — một lưới an toàn</span></code></pre>
<div class="callout danger"><strong>Không có thùng rác.</strong> <code>rm</code> gỡ cái tên đi và chỗ trống dùng lại được ngay lập tức. Khôi phục cần công cụ chuyên dụng, thường thất bại trên một hệ thống file đang bận, và không phải thứ để lên kế hoạch dựa vào. Những thói quen dưới đây không phải sự thận trọng của người mới — đó là thứ người ta làm SAU khi đã mất mát.</div>
<pre><code class="language-bash"><span class="tok-comment"># Ba thói quen an toàn, theo thứ tự giá trị:</span>

<span class="tok-comment"># 1. NHÌN trước. Cùng cái mẫu, lệnh vô hại.</span>
ls -la *.log
rm *.log

<span class="tok-comment"># 2. Đừng ghép -r và -f cho tới khi đã đọc đường dẫn hai lần.</span>
<span class="tok-comment">#    rm -rf là đúng cho một thư mục build và là thảm hoạ khi lệch một dấu cách:</span>
rm -rf build/          <span class="tok-comment"># ổn</span>
rm -rf / build/        <span class="tok-comment"># ← một dấu cách kết liễu cả cái máy</span>

<span class="tok-comment"># 3. Bắt các lệnh phá huỷ phải hỏi, trên máy của chính bạn.</span>
<span class="tok-keyword">echo</span> <span class="tok-string">"alias rm='rm -i'"</span> &gt;&gt; ~/.bashrc
<span class="tok-keyword">echo</span> <span class="tok-string">"alias cp='cp -i'"</span> &gt;&gt; ~/.bashrc
<span class="tok-keyword">echo</span> <span class="tok-string">"alias mv='mv -i'"</span> &gt;&gt; ~/.bashrc</code></pre>
<div class="callout warn">Alias là dây an toàn cá nhân, không phải một biện pháp kiểm soát. Chúng không tồn tại trong script, trong <code>cron</code>, qua <code>ssh -c</code>, hay trên bất kỳ máy nào khác — và quen với một lời nhắc không phải lúc nào cũng xuất hiện thì tự nó đã là một rủi ro. Hãy coi chúng như một cú huých, và giữ thói quen số 1 bất kể thế nào.</div>

<h3>Xoá an toàn hơn: chuyển sang một khu tạm giữ</h3>
${slide('lx-02', 8, 'Ba lưới an toàn thay cho “cẩn thận hơn”')}
<pre><code class="language-bash"><span class="tok-comment"># Với bất cứ thứ gì bạn chưa chắc, hãy cất nó đi thay vì xoá.</span>
mkdir -p ~/.trash
mv suspicious-dir ~/.trash/

<span class="tok-comment"># Hoặc cài một lệnh thùng rác thật mà máy để bàn khôi phục lại được:</span>
sudo apt install -y trash-cli
trash-put olddir/
trash-list
trash-restore</code></pre>

<h3>Các cờ, gom vào một bảng (Ubuntu 24.04, coreutils 9.4)</h3>
<table>
<thead><tr><th>Lệnh · cờ</th><th>Làm gì</th><th>Ví dụ / ghi chú</th></tr></thead>
<tbody>
<tr><td><code>mkdir -p</code></td><td>Tạo cả đường dẫn; đã có rồi cũng không báo lỗi</td><td><code>mkdir -p logs/2026/09</code> — chạy lại thoải mái</td></tr>
<tr><td><code>mkdir -m 700</code></td><td>Đặt quyền ngay lúc tạo</td><td><code>mkdir -m 700 ~/.bi-mat</code> (quyền: Chương 4)</td></tr>
<tr><td><code>touch -d</code></td><td>Đặt thời điểm sửa (mtime) thành một lúc tuỳ ý</td><td><code>touch -d "2 hours ago" /tmp/moc</code> — làm mốc cắt cho <code>find -newer</code></td></tr>
<tr><td><code>cp -a</code></td><td>Lưu trữ: đệ quy + giữ quyền, chủ, giờ, symlink (<code>-dR --preserve=all</code>)</td><td>Cờ dành cho sao lưu</td></tr>
<tr><td><code>cp -r</code></td><td>Đệ quy, nhưng giờ mới và chủ sở hữu là bạn</td><td>Khi bạn <em>muốn</em> siêu dữ liệu mới</td></tr>
<tr><td><code>cp -i</code> · <code>--update=none</code></td><td>Hỏi trước khi đè · không bao giờ đè</td><td>coreutils 9.4 cảnh báo <code>-n</code> "không khả chuyển" và gợi ý <code>--update=none</code></td></tr>
<tr><td><code>cp -u</code> · <code>-v</code></td><td>Chỉ chép khi nguồn mới hơn · in từng file</td><td><code>cp -uv src/*.ts build/</code></td></tr>
<tr><td><code>cp --backup=numbered</code></td><td>Giữ đích cũ thành <code>tên.~1~</code>, <code>tên.~2~</code>…</td><td>Thay một file cấu hình mà có thể cần lấy lại</td></tr>
<tr><td><code>mv -i</code> · <code>-n</code> · <code>-b</code></td><td>Hỏi · không bao giờ đè · sao lưu đích trước khi đè</td><td>coreutils 9.4: <code>mv -n</code> bỏ qua thì giờ thoát mã <strong>1</strong></td></tr>
<tr><td><code>mv -T</code></td><td>Coi đích là một file, không bao giờ chui <em>vào trong</em> nó</td><td>Tráo symlink nguyên tử, Bài 2.4</td></tr>
<tr><td><code>rm -i</code> · <code>-I</code></td><td>Hỏi từng file · hỏi MỘT lần nếu hơn 3 file hoặc đệ quy</td><td><code>rm -I *.log</code> — câu hỏi mà bạn sẽ thật sự đọc</td></tr>
<tr><td><code>rm -r</code> · <code>-f</code> · <code>-d</code></td><td>Đệ quy · không hỏi, không báo lỗi khi thiếu · xoá thư mục rỗng</td><td><code>-f</code> che luôn cả lỗi gõ sai — đọc đường dẫn hai lần</td></tr>
<tr><td><code>rm --preserve-root</code></td><td>Mặc định: từ chối đệ quy trên chính <code>/</code></td><td><strong>Không</strong> bảo vệ <code>/*</code> (xem dưới)</td></tr>
</tbody>
</table>
<p>Hai dòng trong bảng đổi gần đây tới mức cắn được những script viết cho máy cũ. Đo thật trên Ubuntu 24.04:</p>
<pre><code class="language-bash">cp -r cau-hinh bak-r; cp -a cau-hinh bak-a
ls -l --time-style='+%F %R' cau-hinh/app.yml bak-r/app.yml bak-a/app.yml
echo A &gt; a.txt; echo B &gt; b.txt
cp -n a.txt b.txt; echo "exit=$?"
mv -n a.txt b.txt; echo "exit=$?"</code></pre>
<div class="out">-rw-r--r-- 1 cuong cuong 3 2026-09-01 09:00 bak-a/app.yml
-rw-r--r-- 1 cuong cuong 3 2026-09-28 09:05 bak-r/app.yml
-rw-r--r-- 1 cuong cuong 3 2026-09-01 09:00 cau-hinh/app.yml
cp: warning: behavior of -n is non-portable and may change in future; use --update=none instead
exit=0
mv: not replacing 'b.txt'
exit=1</div>
<p>Đọc ba dòng đầu: <code>cp -a</code> giữ nguyên giờ gốc (<code>09-01 09:00</code>), còn <code>cp -r</code> đóng dấu bản chép bằng "bây giờ". Một bản sao lưu mà mọi dấu thời gian đều ghi "hôm nay" là bản sao lưu không trả lời được câu "tuần trước cái gì đã đổi". Còn dòng cuối quan trọng khi có <code>set -e</code> (Chương 7): một script viết <code>mv -n moi cu</code> với ý "chỉ khi chưa có" giờ sẽ <em>DỪNG LẠI</em> khi file đã tồn tại.</p>
<div class="callout ok"><strong>Khi nào dùng cái nào:</strong> <code>cp -a</code> cho mọi thứ bạn có thể phải khôi phục; <code>cp -r</code> khi chép file của người khác và muốn chúng thành của bạn; <code>mv -n</code>/<code>--backup=numbered</code> mỗi khi đích có thể đã tồn tại; <code>rm -I</code> làm lệnh xoá gõ tay hằng ngày. <strong>Khi nào KHÔNG:</strong> không bao giờ <code>rm -rf</code> một đường dẫn ghép từ biến mà thiếu cái chốt ở dưới, và không bao giờ sao lưu bằng <code>cp -r</code> thứ mà bạn quan tâm tới dấu thời gian.</div>

<h3>rm không có thùng rác — tự nhìn thấy trong một container vứt đi</h3>
<p>Làm phần này bên trong <code>docker run --rm -it ubuntu:24.04 bash</code>, đừng làm trên máy của bạn. <code>rm</code> gọi <code>unlink()</code> (gỡ liên kết): nó gỡ đúng một <em>CÁI TÊN</em> khỏi một thư mục và giảm số liên kết của inode đi một. Khi số đó về 0 và không tiến trình nào còn mở file, chỗ trống được đánh dấu là rảnh và lần ghi kế tiếp có thể dùng lại. Không có bước nào "chuyển" cái gì đi đâu cả:</p>
<pre><code class="language-bash">echo "bao cao quan trong" &gt; bao-cao.txt
ls -li bao-cao.txt
rm bao-cao.txt
ls bao-cao.txt
ls -d ~/.local/share/Trash</code></pre>
<div class="out">43293 -rw-r--r-- 1 cuong cuong 19 Sep 28 08:40 bao-cao.txt
ls: cannot access 'bao-cao.txt': No such file or directory
ls: cannot access '/home/cuong/.local/share/Trash': No such file or directory</div>
<p>"Thùng rác" mà màn hình desktop cho bạn thấy là một thư mục, <code>~/.local/share/Trash</code>, theo chuẩn thùng rác của FreeDesktop; trình quản lý file <em>CHUYỂN</em> đồ vào đó. <code>rm</code> chưa từng biết tới nó — đó là lý do ở đây nó còn chẳng tồn tại. Giờ là kiểu hỏng biến chuyện này thành thảm hoạ: một biến bị rỗng.</p>
${slide('lx-02', 7, 'Biến rỗng + rm -rf = danh sách mọi thư mục của máy')}
<pre><code class="language-bash">THU_MUC=""                       <span class="tok-comment"># quên gán, hoặc gõ sai tên biến</span>
echo rm -rf "$THU_MUC"/*         <span class="tok-comment"># echo trước: rm sẽ nhận được gì?</span></code></pre>
<div class="out">rm -rf /bin /boot /dev /etc /home /lib /media /mnt /opt /proc /root /run /sbin /srv /sys /tmp /usr /var</div>
<p><code>"$THU_MUC"/*</code> trở thành <code>/*</code>, và glob khai triển nó thành mọi thư mục cấp cao nhất của cái máy. Chốt an toàn có sẵn không cứu được ở đây:</p>
<pre><code>rm -rf /                          <span class="tok-comment"># trong container vứt đi, với quyền root</span></code></pre>
<div class="out">rm: it is dangerous to operate recursively on '/'
rm: use --no-preserve-root to override this failsafe</div>
<p><code>--preserve-root</code> (bật mặc định) chỉ từ chối đúng một đường dẫn: <code>/</code>. Còn <code>/*</code> là mười tám đường dẫn <em>KHÁC</em>, và nó cho qua hết. Những cái chốt thật sự có tác dụng nằm ở shell:</p>
<pre><code>bash -c 'THU_MUC=""; echo rm -rf "\${THU_MUC:?chua dat THU_MUC}"/*'
bash -c 'set -u; echo rm -rf "$THU_MUC2"/*'</code></pre>
<div class="out">bash: line 1: THU_MUC: chua dat THU_MUC
bash: line 1: THU_MUC2: unbound variable</div>
<p><code>\${BIEN:?thông báo}</code> nghĩa là "nếu BIEN rỗng hoặc chưa đặt, in thông báo rồi dừng — đừng chạy lệnh này". <code>set -u</code> biến mọi biến <em>CHƯA ĐẶT</em> thành lỗi làm dừng cả script (Chương 7 đưa nó thành mặc định). Cả hai đều chặn dòng lệnh TRƯỚC khi <code>rm</code> kịp khởi động — thời điểm duy nhất mà việc dừng lại còn có ích.</p>

<h3>Chạy thử từng bước: một thùng rác thật trên dòng lệnh</h3>
<p>Muốn có "hoàn tác" trong terminal thì hãy cài nó — đừng đặt alias <code>rm</code> thành một thứ khôn lỏi. <code>trash-cli</code> ghi vào đúng cái Thùng rác FreeDesktop mà trình quản lý file dùng, và nhớ mỗi món đến từ đâu:</p>
<pre><code class="language-bash">sudo apt install -y trash-cli
touch f{1..5}.log
rm -I f*.log                      <span class="tok-comment"># trả lời n</span>
mkdir cu &amp;&amp; echo x &gt; cu/a.txt
trash-put cu/
trash-list
cat ~/.local/share/Trash/info/cu.trashinfo
trash-restore                     <span class="tok-comment"># gõ 0, Enter</span></code></pre>
<div class="out">rm: remove 5 arguments? n
2026-09-28 08:40:24 /home/cuong/thu-linux/cu
[Trash Info]
Path=/home/cuong/thu-linux/cu
DeletionDate=2026-09-28T08:40:24
   0 2026-09-28 08:40:24 /home/cuong/thu-linux/cu
What file to restore [0..0]: 0</div>
<p><code>rm -I</code> hỏi <em>MỘT LẦN</em> cho cả năm file — câu hỏi đủ ngắn để bạn đọc, khác với <code>-i</code> vốn luyện cho bạn thói quen gõ bừa <code>y</code>. <code>trash-put</code> chuyển thư mục vào Thùng rác và ghi một file <code>.trashinfo</code> nhỏ giữ đường dẫn gốc và thời điểm xoá; <code>trash-restore</code> đọc file đó để trả đồ về chỗ cũ. <code>trash-empty 30</code> dọn các món cũ hơn 30 ngày.</p>

<h3>Trên macOS và WSL khác gì</h3>
${slide('lx-02', 31, 'Cùng lệnh, khác máy: Ubuntu · macOS · WSL')}
<p>Mac đi kèm bản BSD của các công cụ này, và ba trong số chúng cư xử khác VPS ở những chỗ có hậu quả. Đo thật trên macOS (Mac M1), trong một thư mục nháp:</p>
<pre><code class="language-bash">mkdir -p s1/sub d1 d2; touch s1/a s1/sub/b
cp -R s1 d1; cp -R s1/ d2         <span class="tok-comment"># cp của BSD: dấu gạch chéo CÓ nghĩa "nội dung"</span>
ls d1 d2
echo A &gt; a; echo B &gt; b; mv -n a b; echo "exit=$?"
touch f1 f2 f3 f4 f5; rm -I f?    <span class="tok-comment"># trả lời n</span>
stat -c %s a                      <span class="tok-comment"># cú pháp GNU</span>
stat -f '%z %N' b                 <span class="tok-comment"># cú pháp BSD</span></code></pre>
<div class="out">d1:
s1

d2:
a
sub
exit=0
remove 5 files? n
stat: illegal option -- c
usage: stat [-FLnq] [-f format | -l | -r | -s | -x] [-t timefmt] [file ...]
2 b</div>
<p>Vậy là trên Mac: <code>cp -R s1/ d2</code> chép <em>NỘI DUNG</em> (trên Ubuntu nó sẽ tạo <code>d2/s1</code>); <code>mv -n</code> bỏ qua trong im lặng với mã thoát 0 (Ubuntu: mã 1 kèm thông báo); <code>rm -I</code> có, nhưng hỏi bằng câu khác; còn <code>stat</code> dùng <code>-f</code> với bộ chữ định dạng khác hẳn. Viết <code>cp -a src/. dst/</code> và đừng dựa vào mã thoát của <code>mv -n</code>, thì cùng một script chạy giống nhau ở cả hai nơi.</p>
<p>WSL2 là một Ubuntu thật, nên mọi thứ trong bài này chạy y hệt trên VPS — <em>bên trong hệ thống file Linux</em> (<code>~</code>). Một dự án để ở <code>/mnt/c/…</code> thì nằm trên ổ Windows và phải đi qua một lớp chuyển đổi ở mỗi thao tác file; chính Microsoft khuyên để file trong hệ thống file của WSL khi làm việc bằng công cụ Linux, để có tốc độ tốt nhất.</p>

<h3>Đọc nhanh một file</h3>
<pre><code class="language-bash">cat small.txt                      <span class="tok-comment"># đổ hết ra — chỉ dành cho file NHỎ</span>
less big.log                       <span class="tok-comment"># lật từng trang; q để thoát, / để tìm</span>
head -20 file.txt                  <span class="tok-comment"># 20 dòng đầu</span>
tail -20 file.txt                  <span class="tok-comment"># 20 dòng cuối</span>
tail -f /var/log/syslog            <span class="tok-comment"># theo dõi trực tiếp — lệnh xem log</span>
tail -F /var/log/nginx/access.log  <span class="tok-comment"># theo dõi, và sống sót qua việc xoay vòng log</span></code></pre>
<div class="callout ok"><code>tail -F</code> (chữ F hoa) là thứ nên dùng trên máy chủ. Chữ <code>-f</code> thường bám theo <em>mô tả file</em>, nên khi việc xoay vòng log đổi tên file (Chương 10) thì nó tiếp tục canh một file không ai còn ghi vào nữa và trông như bị treo. Chữ <code>-F</code> hoa bám theo <em>CÁI TÊN</em> và mở lại file.</div>

<h3>Theo dõi một lệnh đang làm gì</h3>
<pre><code>cp -rv src/ /tmp/backup/           <span class="tok-comment"># -v in ra từng file khi nó đi qua</span>
cp -r src/ /tmp/backup/ &amp;&amp; <span class="tok-keyword">echo</span> <span class="tok-string">"xong"</span>   <span class="tok-comment"># chỉ echo nếu cp thành công</span></code></pre>
<div class="out">'src/app.ts' -> '/tmp/backup/src/app.ts'
'src/auth.ts' -> '/tmp/backup/src/auth.ts'
xong</div>
<p>Dấu <code>&amp;&amp;</code> là một hé lộ của Chương 6: chỉ chạy lệnh thứ hai nếu lệnh đầu thành công. Với một lần chép lâu, đó là khác biệt giữa BIẾT rằng nó chạy được và CHO RẰNG nó chạy được.</p>

<h3>Dấu gạch chéo cuối, thứ làm đổi nghĩa của cp và rsync</h3>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1</span><span class="lz-t">cp -r src dst — khi dst chưa tồn tại</span><span class="lz-d">Tạo <code>dst</code> là một bản chép của <code>src</code>. Đây gần như luôn là thứ bạn muốn.</span></div>
  <div class="lz-step"><span class="lz-k">2</span><span class="lz-t">cp -r src dst — khi dst đã tồn tại</span><span class="lz-d">Tạo ra <code>dst/src</code>. Cùng một lệnh, kết cục khác nhau, quyết định hoàn toàn bởi việc cái đích tình cờ có tồn tại hay không.</span></div>
  <div class="lz-step"><span class="lz-k">3</span><span class="lz-t">rsync src/ dst/ — có dấu gạch chéo</span><span class="lz-d">Chép <em>nội dung</em> của <code>src</code> vào <code>dst</code>. Dấu gạch chéo nghĩa là &quot;những gì bên trong&quot;.</span></div>
  <div class="lz-step"><span class="lz-k">4</span><span class="lz-t">rsync src dst/ — không có nó</span><span class="lz-d">Chép cả <em>thư mục</em>, cho ra <code>dst/src</code>. Một ký tự, và một lần deploy rơi xuống sâu hơn một tầng so với dự kiến.</span></div>
</div>
<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> nhóm SWP391 của bạn dùng chung một máy, trên đó có thư mục cấu hình đang chạy và một đống file tạm. Trưởng nhóm nhờ bạn thay cấu hình bằng bản mới mà vẫn giữ được bản cũ, và dọn file tạm — không được làm mất thứ gì bạn không định xoá.</p><ol>
<li>Dựng sân tập: <code>mkdir -p ~/thu-linux/c21/{cau-hinh,tam} &amp;&amp; cd ~/thu-linux/c21</code>, rồi <code>touch tam/{a,b,c,d,e}.tmp; echo v1 &gt; cau-hinh/app.yml; echo v2 &gt; app.yml.moi; touch -d '2026-09-01 09:00' cau-hinh/app.yml</code>.</li>
<li>Sao lưu theo hai cách rồi so giờ: <code>cp -r cau-hinh bak-r; cp -a cau-hinh bak-a</code>, rồi <code>ls -l --time-style='+%F %R' cau-hinh/app.yml bak-r/app.yml bak-a/app.yml</code>. Bản nào giữ được giờ gốc?</li>
<li>Thay cấu hình mà giữ bản cũ — chạy lệnh này <em>HAI LẦN</em>: <code>cp --backup=numbered app.yml.moi cau-hinh/app.yml</code>. Rồi <code>ls cau-hinh</code> và <code>cat cau-hinh/app.yml.~1~</code>.</li>
<li>Dọn file tạm có lưới an toàn: thử <code>rm -I tam/*.tmp</code> và trả lời <code>n</code>; rồi <code>trash-put tam</code> (cài bằng <code>sudo apt install trash-cli</code>; trên Mac thì dùng <code>mv tam ~/.Trash/</code>) và <code>trash-list</code>.</li>
<li>Chứng minh cái chốt biến rỗng: <code>D=""; echo rm -rf "\${D:?}"/*</code> — lệnh rm <em>KHÔNG</em> được in ra.</li></ol>
<div class="out">-rw-r--r-- 1 cuong cuong 3 2026-09-01 09:00 bak-a/app.yml
-rw-r--r-- 1 cuong cuong 3 2026-09-28 09:05 bak-r/app.yml
-rw-r--r-- 1 cuong cuong 3 2026-09-01 09:00 cau-hinh/app.yml
app.yml
app.yml.~1~
app.yml.~2~
v1
rm: remove 5 arguments? n
2026-09-28 09:05:40 /home/cuong/thu-linux/c21/tam
bash: D: parameter null or not set</div>
<p><strong>Đạt khi:</strong> <code>bak-a/app.yml</code> mang giờ <code>2026-09-01 09:00</code> còn <code>bak-r/app.yml</code> mang giờ hôm nay; <code>ls cau-hinh</code> in <code>app.yml  app.yml.~1~  app.yml.~2~</code> và <code>app.yml.~1~</code> chứa <code>v1</code>; <code>trash-list</code> có đúng một dòng kết thúc bằng <code>c21/tam</code>; và bước 5 in lỗi <code>parameter null or not set</code> thay vì một lệnh <code>rm</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Inode (nút chỉ mục)</span><span class="v">Bản ghi của hệ thống file giữ kích thước, quyền, giờ và vị trí dữ liệu của một file — nhưng không giữ tên.</span></div>
  <div class="kv"><span class="k">Directory entry (mục thư mục)</span><span class="v">Một dòng "tên → số inode" nằm trong thư mục; đổi tên file là sửa đúng dòng này.</span></div>
  <div class="kv"><span class="k">Recursive (đệ quy)</span><span class="v">Đi vào mọi thư mục con, và con của con… (<code>-r</code> / <code>-R</code>).</span></div>
  <div class="kv"><span class="k">Overwrite / clobber (ghi đè)</span><span class="v">Thay nội dung file đích bằng file mới; <code>cp</code> và <code>mv</code> làm việc này mà không hỏi.</span></div>
  <div class="kv"><span class="k">unlink (gỡ liên kết)</span><span class="v">Lời gọi hệ thống đứng sau <code>rm</code>: gỡ một cái tên — không phải "chuyển vào thùng rác".</span></div>
  <div class="kv"><span class="k">Archive mode <code>-a</code> (chế độ lưu trữ)</span><span class="v">Chép mà giữ nguyên quyền, chủ, dấu thời gian và symlink — thứ một bản sao lưu cần.</span></div>
  <div class="kv"><span class="k">Idempotent (chạy lại vẫn vậy)</span><span class="v">Chạy một lần hay mười lần đều cho cùng kết quả, như <code>mkdir -p</code>.</span></div>
  <div class="kv"><span class="k">Trash (thùng rác)</span><span class="v"><code>~/.local/share/Trash</code>, thư mục chuẩn FreeDesktop mà trình quản lý file và <code>trash-cli</code> dùng; <code>rm</code> không bao giờ đụng tới.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li><code>mkdir -p</code> tạo cả đường dẫn và chạy lại không lỗi; <code>cp -a</code> (chứ không phải <code>-r</code>) mới giữ quyền, giờ và symlink khi sao lưu.</li>
<li><code>cp -r src dst</code> cho kết quả khác nhau tuỳ <code>dst</code> đã có hay chưa; <code>cp</code> của GNU bỏ qua dấu gạch chéo cuối còn macOS thì không — <code>cp -a src/. dst/</code> mới nghĩa là "nội dung" ở mọi nơi.</li>
<li>Trong cùng một hệ thống file, <code>mv</code> chỉ sửa một mục thư mục nên tức thì — và đè đích trong im lặng; hãy dùng <code>-n</code>, <code>-i</code> hoặc <code>--backup=numbered</code>.</li>
<li><code>rm</code> chỉ gỡ một cái tên (<code>unlink</code>); không có thùng rác, không có hoàn tác — thùng rác là việc của <code>trash-cli</code> và trình quản lý file.</li>
<li>Một biến rỗng biến <code>rm -rf "$X"/*</code> thành <code>rm -rf /*</code>; <code>\${X:?}</code> và <code>set -u</code> chặn được, <code>--preserve-root</code> thì không.</li>
<li>Thói quen rẻ nhất: <code>echo</code>/<code>ls</code> đúng cái mẫu đó trước, <code>rm -I</code> khi xoá hàng loạt — và nhớ coreutils 9.4 coi <code>mv -n</code> bỏ qua là lỗi (mã 1) khi script có <code>set -e</code>.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/cp.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">cp(1) — gồm cả -a, -u và các tuỳ chọn --backup</span><span class="lc-sub"><code>--backup=numbered</code> là điểm trung gian hữu ích giữa <code>-i</code> và ghi đè thẳng.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: sắp xếp lại một cây thư mục mà không mất gì</span><span class="lc-sub">Bài tập chấm điểm về cp -a, mv, rm và khác biệt của dấu gạch chéo cuối.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>mv</code> âm thầm huỷ một file. <code>mv config.new config.yml</code> khi <code>config.yml</code> đã tồn tại sẽ ghi đè lên nó, không hỏi và không sao lưu — và khác với <code>rm</code>, lệnh này không <em>CÓ CẢM GIÁC</em> phá huỷ, nên nó bắt được nhiều người. Hãy dùng <code>mv -i</code> khi đích có thể đã tồn tại, hoặc <code>mv -n</code> trong script, nơi âm thầm bỏ qua an toàn hơn âm thầm đè lên.</div>
<p class="note-ct"><strong>Thói quen ngăn được gần như toàn bộ những chuyện trên:</strong> chạy <code>ls</code> với đúng cái mẫu đó trước khi chạy <code>rm</code>, <code>mv</code> hay <code>cp</code> với nó. Shell khai triển cái mẫu y hệt cho cả hai, nên thứ <code>ls</code> liệt kê chính xác là thứ mà lệnh phá huỷ sẽ tác động vào. Hai giây, và nó biến một phỏng đoán thành một sự thật.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.2 ─────────────────────────── */
    {
      title: '2.2 — Globs: the shell expands, the command never sees the star|||2.2 — Glob: shell khai triển, lệnh không bao giờ thấy dấu sao',
      slug: 'lnx-2-2-glob-ky-tu-dai-dien',
      type: 'LESSON',
      description: 'Vì sao rm *.log an toàn còn rm * .log thì huỷ hoại, thứ tự khai triển của shell, bốn ký tự đại diện, globstar, dotglob, nullglob, và cách chặn khai triển bằng dấu nháy.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>The shell expands, the command never sees the star</h2>
<p class="lead">This is the single most misunderstood thing in the shell, and the misunderstanding is what makes <code>rm</code> dangerous. When you type <code>rm *.log</code>, the <code>rm</code> program never receives the string <code>*.log</code>. The shell replaces it with a list of real filenames <em>first</em>, and hands <code>rm</code> that list. Everything about globs follows from that one fact.</p>

<h3>Watch it happen</h3>
${slide('lx-02', 9, 'Shell khai triển glob TRƯỚC — rm không bao giờ thấy dấu *')}
<p>The easiest way to internalise this is to put <code>echo</code> in front. <code>echo</code> prints its arguments, so it shows you exactly what the shell built:</p>
<pre><code>ls
<span class="tok-comment"># app.log  db.log  notes.txt  report.pdf</span>

echo *.log</code></pre>
<div class="out">app.log db.log</div>
<p>The shell turned one word into two. By the time any program starts, the star is gone. So:</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · You type</span><span class="lz-t">rm *.log</span><span class="lz-d">One word containing a star. Nothing has run yet.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Shell expands</span><span class="lz-t">rm app.log db.log</span><span class="lz-d">The shell reads the current directory, finds matches, sorts them, and substitutes them in place.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Shell runs</span><span class="lz-t">execve("/usr/bin/rm", ["rm","app.log","db.log"])</span><span class="lz-d">rm receives two filenames. It has no idea a glob was ever involved.</span></div>
  <div class="lz-step"><span class="lz-k">4 · rm acts</span><span class="lz-t">unlink("app.log"); unlink("db.log")</span><span class="lz-d">Two files gone. If step 2 had produced twenty filenames, twenty would be gone — rm cannot tell the difference.</span></div>
</div>

<div class="callout">Three consequences worth memorising:
<ul>
<li><strong>Globs are matched against real files.</strong> A glob that matches nothing behaves very differently from one that matches something — see below.</li>
<li><strong>The command's own docs are irrelevant.</strong> <code>rm</code>, <code>cp</code>, <code>grep</code> all "support wildcards" only in the sense that the shell expanded them first. <code>find</code> and <code>grep</code> have their <em>own</em> pattern engines, which is why you sometimes need to quote patterns to stop the shell touching them.</li>
<li><strong><code>echo</code> is a free dry run.</strong> Prefix any destructive command with <code>echo</code>, read the output, then remove the <code>echo</code>. This costs two seconds and prevents the worst class of accident.</li>
</ul></div>

<h3>The four wildcard characters</h3>
${slide('lx-02', 10, 'Bốn ký tự đại diện và ngoặc nhọn')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>*</code></span><span class="v">Any run of characters, including none. Does <em>not</em> cross a <code>/</code>, and does not match a leading dot.</span></div>
  <div class="kv"><span class="k"><code>?</code></span><span class="v">Exactly one character. <code>file?.txt</code> matches <code>file1.txt</code> but not <code>file.txt</code> or <code>file12.txt</code>.</span></div>
  <div class="kv"><span class="k"><code>[abc]</code></span><span class="v">One character from the set. Ranges allowed: <code>[a-z]</code>, <code>[0-9]</code>, <code>[a-zA-Z0-9]</code>.</span></div>
  <div class="kv"><span class="k"><code>[!abc]</code></span><span class="v">One character <em>not</em> in the set. <code>[^abc]</code> works too in bash, but <code>!</code> is the portable form.</span></div>
</div>

<pre><code class="language-bash">ls
<span class="tok-comment"># log1.txt log2.txt log3.txt logA.txt notes.md report.pdf</span>

echo log?.txt        <span class="tok-comment"># all four — ? is any single char</span>
echo log[0-9].txt    <span class="tok-comment"># only the numbered ones</span>
echo log[!0-9].txt   <span class="tok-comment"># only logA.txt</span>
echo *.{md,pdf}      <span class="tok-comment"># braces + glob together</span></code></pre>
<div class="out">log1.txt log2.txt log3.txt logA.txt
log1.txt log2.txt log3.txt
logA.txt
notes.md report.pdf</div>

<h3>Named character classes</h3>
<p>Inside brackets you can use POSIX class names, which are clearer than ranges and correct under any locale:</p>
<pre><code class="language-bash">echo log[[:digit:]].txt      <span class="tok-comment"># same as [0-9]</span>
echo [[:upper:]]*            <span class="tok-comment"># files starting with a capital</span>
echo *[[:space:]]*           <span class="tok-comment"># files with a space in the name</span></code></pre>
<p>The full set: <code>alpha</code>, <code>digit</code>, <code>alnum</code>, <code>upper</code>, <code>lower</code>, <code>space</code>, <code>punct</code>, <code>xdigit</code>. Note the doubled brackets — <code>[[:digit:]]</code> is a class <em>inside</em> a bracket expression, so the outer pair is the bracket expression and the inner pair is part of the class syntax.</p>

<h3>Braces are not globs</h3>
<p>This trips up almost everyone, and the difference is not cosmetic:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Glob <code>*.txt</code></span><span class="v">Looks at the filesystem. Expands to files that exist.</span></div>
  <div class="kv"><span class="k">Brace <code>{a,b}.txt</code></span><span class="v">Pure text generation. Expands to <code>a.txt b.txt</code> whether or not those files exist.</span></div>
</div>
<pre><code class="language-bash">cd /tmp/empty-dir
echo {a,b,c}.txt          <span class="tok-comment"># braces do not care that the dir is empty</span>
echo *.txt                <span class="tok-comment"># glob matched nothing — see the next section</span>
echo {1..5}               <span class="tok-comment"># ranges work too</span>
echo {01..10..3}          <span class="tok-comment"># with zero padding and a step</span>
mkdir -p site/{css,js,img}  <span class="tok-comment"># the practical use: creating things</span></code></pre>
<div class="out">a.txt b.txt c.txt
*.txt
1 2 3 4 5
01 04 07 10</div>
<p>Because braces generate text rather than read the disk, they are the right tool for <em>creating</em> and globs are the right tool for <em>selecting</em>. And note the second line of that output — it is the next section's entire subject.</p>

<h3>When a glob matches nothing</h3>
${slide('lx-02', 12, 'Glob không khớp: bash giữ nguyên chữ, zsh báo lỗi')}
<p>Bash's default is startling the first time you meet it: <strong>an unmatched glob is passed through literally</strong>. The command receives the raw <code>*.txt</code> as an argument.</p>
<pre><code class="language-bash">cd /tmp/empty-dir
ls *.txt</code></pre>
<div class="out">ls: cannot access '*.txt': No such file or directory</div>
<p><code>ls</code> is complaining about a file literally named <code>*.txt</code>, because that is what it was handed. Usually this is just a confusing error message. In a loop it is a bug:</p>
<pre><code class="language-bash">for f in *.csv; do
  echo "processing \${f}"
done</code></pre>
<div class="out">processing *.csv</div>
<p>With no CSV files, the loop still runs once, with <code>f</code> set to the literal pattern. Two shell options fix this:</p>
<pre><code>shopt -s nullglob      <span class="tok-comment"># unmatched glob expands to NOTHING → the loop runs zero times</span>
shopt -s failglob      <span class="tok-comment"># unmatched glob is an ERROR → the command does not run at all</span></code></pre>
<div class="callout ok">For scripts, <code>nullglob</code> is almost always what you want in a <code>for</code> loop, and <code>failglob</code> is what you want interactively, where an error is more useful than a surprise. Turn either off again with <code>shopt -u</code>. We come back to <code>shopt</code> properly in Chapter 7.</div>

<h3>Dotfiles are invisible to globs</h3>
${slide('lx-02', 13, 'File ẩn: bash 5.2 thôi cho .* khớp . và ..')}
<p>A leading dot must be matched literally. This is deliberate, and it is why <code>rm *</code> in your home directory does not destroy <code>.ssh</code> and <code>.bashrc</code>:</p>
<pre><code class="language-bash">ls -a
<span class="tok-comment"># .  ..  .env  .gitignore  app.js  README.md</span>

echo *              <span class="tok-comment"># dotfiles excluded</span>
echo .*             <span class="tok-comment"># dotfiles only — but see the warning</span>
echo .[!.]*         <span class="tok-comment"># dotfiles without . and ..</span>
shopt -s dotglob; echo *   <span class="tok-comment"># now * includes them</span></code></pre>
<div class="out">app.js README.md
.env .gitignore
.env .gitignore
.env .gitignore app.js README.md</div>
<div class="callout warn"><strong>Corrected, measured on Ubuntu 24.04 (bash 5.2.21):</strong> the second line is <code>.env .gitignore</code> — no <code>.</code> and <code>..</code>. Bash 5.2 added the shell option <code>globskipdots</code>, on by default, so <code>.*</code> no longer matches the two special entries. An earlier version of this lesson printed <code>. .. .env .gitignore</code>, which is still what older bash does — including <code>/bin/bash</code> 3.2 on every Mac:</div>
<pre><code>shopt globskipdots
bash -c 'shopt -u globskipdots; echo .*'     <span class="tok-comment"># switch it off = old behaviour</span></code></pre>
<div class="out">globskipdots   	on
. .. .env .gitignore</div>
<div class="pitfall"><strong>Trap:</strong> <code>.*</code> matches <code>.</code> and <code>..</code> — the current and parent directories. <code>rm -rf .*</code> therefore tries to recurse into the <em>parent</em> directory, and people have wiped their entire home directory this way. Modern GNU <code>rm</code> refuses <code>.</code> and <code>..</code> specifically to stop this, but do not rely on that: use <code>.[!.]*</code>, or <code>shopt -s dotglob</code> plus a plain <code>*</code>. Bash 5.2+ (Ubuntu 24.04, Fedora 44) no longer matches them at all thanks to <code>globskipdots</code> — but the same script may one day run under bash 3.2 on a Mac or on an older server, so write it to be safe everywhere.</div>

<h3>Globstar: <code>**</code> for recursive matching</h3>
${slide('lx-02', 14, 'extglob và globstar')}
<p>A normal <code>*</code> stops at a <code>/</code>. With <code>globstar</code> enabled, <code>**</code> crosses directory boundaries:</p>
<pre><code class="language-bash">shopt -s globstar

echo src/*.ts        <span class="tok-comment"># only files directly in src/</span>
echo src/**/*.ts     <span class="tok-comment"># every .ts at any depth under src/</span></code></pre>
<div class="out">src/index.ts
src/index.ts src/api/user.ts src/api/v2/admin.ts src/lib/db.ts</div>
<p><code>globstar</code> is off by default in bash (it is on by default in zsh, which is why macOS users often assume it always works). Put <code>shopt -s globstar</code> in your <code>~/.bashrc</code> — Chapter 3 covers that file.</p>
<div class="callout warn"><strong>Corrected:</strong> in current bash, <code>**</code> does <em>not</em> descend into symbolic links to directories, so a link pointing back up the tree cannot make it loop — measured on bash 5.2 below (an earlier version of this lesson said the opposite). What remains true: bash builds the whole list in memory before the command even starts, and a huge list can fail with "Argument list too long". For large or untrusted trees, <code>find</code> — the next lesson — is both faster and safer.</div>
<pre><code class="language-bash">ln -s ../../g/src src/lib/vong    <span class="tok-comment"># a link pointing back up to src/</span>
echo src/**/*.ts</code></pre>
<div class="out">src/api/user.ts src/api/v2/admin.ts src/index.ts src/lib/db.ts</div>
<p>Same four files, no <code>src/lib/vong/…</code> repeats. And note what happens when you forget <code>shopt -s globstar</code>: <code>**</code> silently behaves like a single <code>*</code>, so <code>echo src/**/*.ts</code> prints only <code>src/api/user.ts src/lib/db.ts</code> — one level, no error.</p>

<h3>extglob: patterns that can say "except"</h3>
<p>The four wildcards cannot express "everything except the logs". Bash has a second, optional pattern language for that — <em>extended globs</em> — switched on with <code>shopt -s extglob</code>. Each form wraps a list of alternatives separated by <code>|</code>:</p>
<table>
<thead><tr><th>Pattern</th><th>Matches</th><th>Example</th></tr></thead>
<tbody>
<tr><td><code>?(a|b)</code></td><td>zero or one of the alternatives</td><td><code>log?(.1).txt</code></td></tr>
<tr><td><code>*(a|b)</code></td><td>zero or more</td><td><code>v*([0-9])</code></td></tr>
<tr><td><code>+(a|b)</code></td><td>one or more</td><td><code>app-+([0-9]).log</code> — digits only</td></tr>
<tr><td><code>@(a|b)</code></td><td>exactly one</td><td><code>*.@(jpg|png)</code></td></tr>
<tr><td><code>!(a|b)</code></td><td>anything that does NOT match</td><td><code>!(*.log)</code></td></tr>
</tbody>
</table>
<p>Measured on Ubuntu 24.04, in the directory from the start of this lesson (<code>app.log db.log notes.txt report.pdf</code> plus two dotfiles):</p>
<pre><code>shopt -s extglob
echo !(*.log)
echo *.@(log|pdf)</code></pre>
<div class="out">notes.txt report.pdf
app.log db.log report.pdf</div>
<div class="callout warn">Two things catch people. <strong>First</strong>, <code>shopt -s extglob</code> must run on an <em>earlier line</em> than the pattern: bash parses a whole line (or a whole function) before running any of it, so <code>shopt -s extglob; echo !(*.log)</code> on one line — or both inside the same function body — fails with <code>syntax error near unexpected token &#96;('</code>. <strong>Second</strong>, <code>!(*.log)</code> still skips dotfiles: "everything except the logs" does not include <code>.env</code> unless <code>dotglob</code> is also on. That is usually what you want for <code>rm !(*.env)</code>-style clean-ups — and exactly the thing to check with <code>echo</code> first.</div>

<h3>Glob and regex: the same characters, two different languages</h3>
${slide('lx-02', 11, 'Glob ≠ regex: cùng ký tự, hai ngôn ngữ khác nhau')}
<p>A regular expression (<em>regex</em>) is the pattern language of <code>grep</code>, <code>sed</code>, <code>find -regex</code> and nearly every programming language (Chapter 3 teaches it properly). It reuses the same symbols as globs with <em>different meanings</em>, which is why a pattern that works in one place silently misbehaves in the other:</p>
<table>
<thead><tr><th>You want</th><th>Glob (shell, <code>find -name</code>)</th><th>Regex (<code>grep</code>, <code>find -regex</code>)</th></tr></thead>
<tbody>
<tr><td>any run of characters</td><td><code>*</code></td><td><code>.*</code></td></tr>
<tr><td>exactly one character</td><td><code>?</code></td><td><code>.</code></td></tr>
<tr><td>one character NOT in a set</td><td><code>[!abc]</code></td><td><code>[^abc]</code></td></tr>
<tr><td>a literal dot</td><td><code>.</code></td><td><code>\\.</code></td></tr>
<tr><td>anchor start / end</td><td>implicit — always the whole name</td><td><code>^</code> … <code>$</code>, otherwise matches anywhere</td></tr>
<tr><td>repetition</td><td>none (extglob: <code>+(…)</code>)</td><td><code>*</code> <code>+</code> <code>{2,}</code> apply to the previous item</td></tr>
</tbody>
</table>
<pre><code class="language-bash">ls
ls | grep '.log'              <span class="tok-comment"># regex: . is ANY character, and no anchors</span>
ls | grep -E '\\.log$'
find . -regextype posix-extended -regex '.*\\.log(\\.[0-9]+)?$'</code></pre>
<div class="out">app.log  app.log.1  catalog.txt
app.log
app.log.1
catalog.txt
app.log
./app.log
./app.log.1</div>
<p><code>catalog.txt</code> matched <code>.log</code> because, to a regex, that means "any character followed by <code>log</code>, anywhere in the line" — and "c-a-t-<strong>a-l-o-g</strong>" contains <code>alog</code>. The anchored <code>\\.log$</code> fixes it. The <code>find -regex</code> line also shows its quirk: it matches the <em>whole path</em> (<code>./app.log</code>), so the pattern must start with <code>.*</code>. <strong>When to use which:</strong> glob to pick files by name in the shell and <code>find -name</code>; regex when the rule cannot be said with <code>* ? [ ]</code> ("<code>.log</code> optionally followed by a rotation number") or when you are matching text inside files.</p>

<h3>Stopping expansion: quotes</h3>
<p>Sometimes you want the command, not the shell, to see the pattern. Quoting is how you say that:</p>
<pre><code class="language-bash">grep "TODO.*fix" notes.txt     <span class="tok-comment"># quoted: grep's own regex engine sees .* </span>
find . -name "*.log"           <span class="tok-comment"># quoted: find does the matching, recursively</span>
find . -name *.log             <span class="tok-comment"># UNQUOTED: shell expands first — usually wrong</span></code></pre>
<p>That last line is the classic bug. If the current directory happens to contain exactly one <code>.log</code> file, the shell rewrites the command to <code>find . -name app.log</code> and you search for that one name everywhere. If it contains two, <code>find</code> errors out with <code>paths must precede expression</code>. If it contains none, it accidentally works — which is the worst outcome, because you learn the wrong lesson.</p>

<h3>Filenames that start with a dash</h3>
<p>A glob can produce a filename beginning with <code>-</code>, which the command then reads as an option:</p>
<pre><code>touch -- -rf
rm *                  <span class="tok-comment"># shell expands to: rm -rf other-files… → recursive!</span>
rm -- *               <span class="tok-comment"># -- ends option parsing: everything after is a filename</span>
rm ./*                <span class="tok-comment"># or force a path prefix, which cannot look like a flag</span></code></pre>
<div class="callout">The <code>--</code> convention is honoured by essentially every GNU tool, and <code>./*</code> works even on tools that do not honour it. Prefer <code>./*</code> in scripts that handle filenames you did not create.</div>

<h3>Sorting, and why it is not always what you expect</h3>
<p>Glob results are sorted, but by your locale's collation rules, not by ASCII:</p>
<pre><code>echo *
<span class="tok-comment"># in en_US.UTF-8: apple Banana cherry   (case-insensitive-ish)</span>
LC_ALL=C sh -c 'echo *'
<span class="tok-comment"># in the C locale: Banana apple cherry  (strict byte order)</span></code></pre>
<p>Also — and this matters for log files — sorting is lexicographic, not numeric: <code>log10.txt</code> sorts before <code>log2.txt</code>. Zero-pad your generated names (<code>log02</code>) or sort explicitly with <code>ls -v</code> or <code>sort -V</code>.</p>

<h3>On macOS: zsh and bash 3.2 behave differently</h3>
<p>The Mac's interactive shell is zsh, and the <code>/bin/bash</code> it ships is 3.2 from 2007. Both disagree with Ubuntu's bash 5.2 on exactly the topics of this lesson. Measured on macOS (zsh 5.9, <code>/bin/bash</code> 3.2.57), in a directory holding <code>app.log</code>, <code>db.log</code> and <code>.env</code>:</p>
<pre><code>zsh -f -c 'for f in *.csv; do echo "x $f"; done'
zsh -f -c 'find . -name *.zz'
zsh -f -c 'echo .*'
/bin/bash -c 'echo .*'
/bin/bash -c 'shopt -s globstar'</code></pre>
<div class="out">zsh:1: no matches found: *.csv
zsh:1: no matches found: *.zz
.env
. .. .env
/bin/bash: line 0: shopt: globstar: invalid shell option name</div>
<ul>
<li><strong>zsh stops on an unmatched glob</strong> (option <code>NOMATCH</code>, on by default): the loop never runs and the command never starts — safer than bash's pass-through, but it also means an unquoted <code>find . -name *.zz</code> fails on the Mac while "working" on Linux. Quote the pattern and both agree. <code>setopt null_glob</code> gives bash's <code>nullglob</code> behaviour.</li>
<li><strong>zsh never matches <code>.</code> and <code>..</code></strong>; bash 3.2 does, just like bash before 5.2.</li>
<li><strong>bash 3.2 has no <code>globstar</code></strong> (it arrived in bash 4.0). zsh has <code>**/</code> built in without any option — which is why <code>**</code> "just works" in your Mac terminal and then fails inside a <code>#!/bin/bash</code> script on the same Mac.</li>
</ul>
<p>The practical rule for scripts that run on both: put <code>#!/usr/bin/env bash</code> at the top, quote every pattern meant for another program, and set <code>nullglob</code> explicitly instead of relying on either shell's default.</p>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> your team's upload server rotates logs as <code>app-1.log</code> … <code>app-200.log</code>, next to a <code>.env</code> and a <code>README.md</code>. You must move logs 1–99 into <code>cu/</code> for archiving, touch nothing else, and prove the selection before running anything destructive.</p><ol>
<li>Build it with brace expansion: <code>mkdir -p ~/thu-linux/c22 &amp;&amp; cd ~/thu-linux/c22 &amp;&amp; touch app-{1..200}.log .env README.md</code>.</li>
<li>Count what two different globs select, before touching anything: <code>echo app-[0-9].log app-[0-9][0-9].log | wc -w</code> and <code>echo app-?.log app-??.log | wc -w</code>.</li>
<li>See what "everything except logs" means, with and without dotfiles: <code>shopt -s extglob</code>, then (next line) <code>echo !(*.log)</code>; then <code>shopt -s dotglob; echo !(*.log); shopt -u dotglob</code>.</li>
<li>Prove your loop survives "no matches": <code>shopt -s nullglob; for f in *.csv; do echo "csv: $f"; done; echo "loop done"; shopt -u nullglob</code>.</li>
<li>Do the move and count both sides: <code>mkdir -p cu &amp;&amp; mv app-[0-9].log app-[0-9][0-9].log cu/ &amp;&amp; ls cu | wc -l &amp;&amp; ls *.log | wc -l</code>.</li></ol>
<div class="out">99
99
README.md
.env README.md
loop done
99
101</div>
<p><strong>Done when:</strong> both counts in step 2 are <code>99</code>; step 3 shows <code>.env</code> only once <code>dotglob</code> is on; step 4 prints only <code>loop done</code>; step 5 prints <code>99</code> then <code>101</code> (logs 100–200 remain), and <code>ls -A</code> still shows <code>.env</code> and <code>README.md</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Glob</span><span class="v">A filename pattern (<code>*.log</code>) that the shell expands into matching names before the command runs.</span></div>
  <div class="kv"><span class="k">Wildcard</span><span class="v">The special characters of a glob: <code>*</code>, <code>?</code>, <code>[…]</code>.</span></div>
  <div class="kv"><span class="k">Expansion</span><span class="v">The shell rewriting what you typed (globs, braces, variables) into the final argument list.</span></div>
  <div class="kv"><span class="k">Regular expression (regex)</span><span class="v">A different pattern language, used by <code>grep</code>/<code>sed</code>/<code>find -regex</code>, where <code>.</code> means "any character".</span></div>
  <div class="kv"><span class="k">nullglob / failglob</span><span class="v">Options that make an unmatched glob expand to nothing / raise an error instead of passing through.</span></div>
  <div class="kv"><span class="k">Dotfile</span><span class="v">A file whose name starts with <code>.</code>; plain globs skip it unless <code>dotglob</code> is on.</span></div>
  <div class="kv"><span class="k">extglob</span><span class="v">Extended glob forms like <code>!(…)</code> and <code>+(…)</code>, enabled with <code>shopt -s extglob</code>.</span></div>
  <div class="kv"><span class="k">globstar</span><span class="v">The option that lets <code>**</code> match across directory levels; missing in bash 3.2.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The shell expands globs before the program starts; <code>echo</code> with the same pattern shows exactly what <code>rm</code> would receive.</li>
<li>Braces generate text (to create), globs read the directory (to select); an unmatched glob passes through literally in bash — use <code>nullglob</code> in loops.</li>
<li>Glob and regex share symbols with different meanings: <code>*</code> vs <code>.*</code>, <code>?</code> vs <code>.</code>, and regex is unanchored unless you add <code>^…$</code>.</li>
<li>Dotfiles are skipped by globs; bash 5.2's <code>globskipdots</code> stops <code>.*</code> matching <code>.</code>/<code>..</code>, but bash 3.2 on the Mac still matches them.</li>
<li><code>extglob</code> adds "except" (<code>!(…)</code>) and must be enabled on an earlier line; <code>globstar</code> makes <code>**</code> recursive and is off by default.</li>
<li>Quote every pattern meant for another program (<code>find -name "*.log"</code>): zsh fails on an unmatched glob, bash passes it through, and only quoting behaves the same everywhere.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Filename-Expansion.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Filename Expansion</span><span class="lc-sub">The authoritative order of expansions, and every <code>shopt</code> that changes globbing. Short and worth reading in full once.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/glob" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">Greg's Wiki — Globs</span><span class="lc-sub">The best practical write-up on extglob, nullglob and the "why not to parse ls" argument, from the people who answer these questions daily.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: select exactly the right files</span><span class="lc-sub">Graded exercises on <code>?</code>, bracket ranges, dotglob and nullglob, using a fixture directory built to punish guesses.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>rm *.log</code> versus <code>rm * .log</code>. One stray space changes "delete the log files" into "delete <em>everything</em>, and then also complain that <code>.log</code> does not exist". The complaint arrives after the deletion. There is no undo. This is the accident that <code>echo</code>-first prevents, and it is why the habit is worth building before you need it.</div>
<p class="note-ct"><strong>The rule that makes all of this safe:</strong> run <code>ls</code> or <code>echo</code> with the exact pattern first, read the output, then re-run with the destructive command. The shell expands the pattern identically both times, so what you saw is precisely what will be acted on. It is the cheapest verification in computing.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Shell khai triển, lệnh không bao giờ thấy dấu sao</h2>
<p class="lead">Đây là điều bị hiểu sai nhiều nhất trong shell, và chính sự hiểu sai đó làm cho <code>rm</code> trở nên nguy hiểm. Khi bạn gõ <code>rm *.log</code>, chương trình <code>rm</code> KHÔNG BAO GIỜ nhận được chuỗi <code>*.log</code>. Shell thay nó bằng một danh sách tên file có thật <em>trước đã</em>, rồi mới đưa danh sách đó cho <code>rm</code>. Mọi thứ về glob đều suy ra từ đúng một sự thật này.</p>

<h3>Nhìn nó xảy ra</h3>
${slide('lx-02', 9, 'Shell khai triển glob TRƯỚC — rm không bao giờ thấy dấu *')}
<p>Cách dễ nhất để thấm điều này là đặt <code>echo</code> lên trước. <code>echo</code> in ra các tham số của nó, nên nó cho bạn thấy chính xác thứ shell vừa dựng:</p>
<pre><code>ls
<span class="tok-comment"># app.log  db.log  notes.txt  report.pdf</span>

echo *.log</code></pre>
<div class="out">app.log db.log</div>
<p>Shell biến một từ thành hai. Đến lúc bất kỳ chương trình nào khởi động, dấu sao đã biến mất. Nghĩa là:</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Bạn gõ</span><span class="lz-t">rm *.log</span><span class="lz-d">Một từ có chứa dấu sao. Chưa có gì chạy cả.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Shell khai triển</span><span class="lz-t">rm app.log db.log</span><span class="lz-d">Shell đọc thư mục hiện tại, tìm các file khớp, sắp xếp, rồi thay vào đúng chỗ.</span></div>
  <div class="lz-step"><span class="lz-k">3 · Shell chạy</span><span class="lz-t">execve("/usr/bin/rm", ["rm","app.log","db.log"])</span><span class="lz-d">rm nhận hai tên file. Nó hoàn toàn không biết có glob nào từng tồn tại.</span></div>
  <div class="lz-step"><span class="lz-k">4 · rm hành động</span><span class="lz-t">unlink("app.log"); unlink("db.log")</span><span class="lz-d">Hai file mất. Nếu bước 2 sinh ra hai mươi tên file thì hai mươi file mất — rm không phân biệt được.</span></div>
</div>

<div class="callout">Ba hệ quả đáng thuộc lòng:
<ul>
<li><strong>Glob được đối chiếu với file có thật.</strong> Một glob không khớp gì cả hành xử rất khác một glob có khớp — xem phần dưới.</li>
<li><strong>Tài liệu của chính lệnh đó không liên quan.</strong> <code>rm</code>, <code>cp</code>, <code>grep</code> "hỗ trợ ký tự đại diện" chỉ theo nghĩa là shell đã khai triển trước. <code>find</code> và <code>grep</code> có bộ máy mẫu <em>RIÊNG</em>, và đó là lý do đôi khi bạn phải đặt mẫu trong dấu nháy để shell đừng đụng vào.</li>
<li><strong><code>echo</code> là một lần chạy thử miễn phí.</strong> Thêm <code>echo</code> trước bất kỳ lệnh phá huỷ nào, đọc kết quả, rồi bỏ <code>echo</code> đi. Hai giây, và nó ngăn được loại tai nạn tệ nhất.</li>
</ul></div>

<h3>Bốn ký tự đại diện</h3>
${slide('lx-02', 10, 'Bốn ký tự đại diện và ngoặc nhọn')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>*</code></span><span class="v">Một chuỗi ký tự bất kỳ, kể cả rỗng. <em>KHÔNG</em> vượt qua dấu <code>/</code>, và không khớp dấu chấm đứng đầu.</span></div>
  <div class="kv"><span class="k"><code>?</code></span><span class="v">Đúng một ký tự. <code>file?.txt</code> khớp <code>file1.txt</code> nhưng không khớp <code>file.txt</code> hay <code>file12.txt</code>.</span></div>
  <div class="kv"><span class="k"><code>[abc]</code></span><span class="v">Một ký tự trong tập. Cho phép khoảng: <code>[a-z]</code>, <code>[0-9]</code>, <code>[a-zA-Z0-9]</code>.</span></div>
  <div class="kv"><span class="k"><code>[!abc]</code></span><span class="v">Một ký tự KHÔNG nằm trong tập. <code>[^abc]</code> cũng chạy trong bash, nhưng <code>!</code> là dạng khả chuyển.</span></div>
</div>

<pre><code class="language-bash">ls
<span class="tok-comment"># log1.txt log2.txt log3.txt logA.txt notes.md report.pdf</span>

echo log?.txt        <span class="tok-comment"># cả bốn — ? là một ký tự bất kỳ</span>
echo log[0-9].txt    <span class="tok-comment"># chỉ những cái đánh số</span>
echo log[!0-9].txt   <span class="tok-comment"># chỉ logA.txt</span>
echo *.{md,pdf}      <span class="tok-comment"># ngoặc nhọn + glob dùng chung</span></code></pre>
<div class="out">log1.txt log2.txt log3.txt logA.txt
log1.txt log2.txt log3.txt
logA.txt
notes.md report.pdf</div>

<h3>Lớp ký tự có tên</h3>
<p>Bên trong ngoặc vuông bạn dùng được tên lớp POSIX, vừa rõ hơn khoảng vừa đúng với mọi locale:</p>
<pre><code class="language-bash">echo log[[:digit:]].txt      <span class="tok-comment"># giống [0-9]</span>
echo [[:upper:]]*            <span class="tok-comment"># file bắt đầu bằng chữ hoa</span>
echo *[[:space:]]*           <span class="tok-comment"># file có dấu cách trong tên</span></code></pre>
<p>Bộ đầy đủ: <code>alpha</code>, <code>digit</code>, <code>alnum</code>, <code>upper</code>, <code>lower</code>, <code>space</code>, <code>punct</code>, <code>xdigit</code>. Để ý cặp ngoặc kép lồng nhau — <code>[[:digit:]]</code> là một lớp nằm <em>BÊN TRONG</em> một biểu thức ngoặc, nên cặp ngoài là biểu thức ngoặc còn cặp trong là cú pháp của lớp.</p>

<h3>Ngoặc nhọn không phải là glob</h3>
<p>Chỗ này gần như ai cũng vấp, và khác biệt không hề hình thức:</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Glob <code>*.txt</code></span><span class="v">Nhìn vào hệ thống file. Khai triển thành những file CÓ THẬT.</span></div>
  <div class="kv"><span class="k">Ngoặc <code>{a,b}.txt</code></span><span class="v">Sinh văn bản thuần tuý. Khai triển thành <code>a.txt b.txt</code> bất kể những file đó có tồn tại hay không.</span></div>
</div>
<pre><code class="language-bash">cd /tmp/empty-dir
echo {a,b,c}.txt          <span class="tok-comment"># ngoặc nhọn không quan tâm thư mục rỗng</span>
echo *.txt                <span class="tok-comment"># glob không khớp gì — xem phần kế tiếp</span>
echo {1..5}               <span class="tok-comment"># khoảng cũng chạy</span>
echo {01..10..3}          <span class="tok-comment"># có đệm số 0 và bước nhảy</span>
mkdir -p site/{css,js,img}  <span class="tok-comment"># công dụng thực tế: TẠO ra thứ mới</span></code></pre>
<div class="out">a.txt b.txt c.txt
*.txt
1 2 3 4 5
01 04 07 10</div>
<p>Vì ngoặc nhọn sinh văn bản chứ không đọc đĩa, nó là công cụ đúng để <em>TẠO</em>, còn glob là công cụ đúng để <em>CHỌN</em>. Và hãy để ý dòng thứ hai của kết quả — nó chính là toàn bộ chủ đề của phần sau.</p>

<h3>Khi một glob không khớp gì cả</h3>
${slide('lx-02', 12, 'Glob không khớp: bash giữ nguyên chữ, zsh báo lỗi')}
<p>Mặc định của bash làm người ta giật mình lần đầu gặp: <strong>một glob không khớp sẽ được truyền qua NGUYÊN VĂN</strong>. Lệnh nhận được chính chuỗi <code>*.txt</code> làm tham số.</p>
<pre><code class="language-bash">cd /tmp/empty-dir
ls *.txt</code></pre>
<div class="out">ls: cannot access '*.txt': No such file or directory</div>
<p><code>ls</code> đang than phiền về một file tên đúng nghĩa đen là <code>*.txt</code>, vì đó là thứ nó được đưa cho. Thường thì đây chỉ là một thông báo lỗi gây rối. Nhưng trong vòng lặp thì nó là một lỗi thật:</p>
<pre><code class="language-bash">for f in *.csv; do
  echo "đang xử lý \${f}"
done</code></pre>
<div class="out">đang xử lý *.csv</div>
<p>Không có file CSV nào, vòng lặp vẫn chạy một lượt, với <code>f</code> mang giá trị là chính cái mẫu. Hai tuỳ chọn shell chữa được chuyện này:</p>
<pre><code>shopt -s nullglob      <span class="tok-comment"># glob không khớp → khai triển thành RỖNG → vòng lặp chạy 0 lượt</span>
shopt -s failglob      <span class="tok-comment"># glob không khớp → LỖI → lệnh không chạy chút nào</span></code></pre>
<div class="callout ok">Với script, <code>nullglob</code> gần như luôn là thứ bạn muốn trong vòng <code>for</code>; còn <code>failglob</code> là thứ bạn muốn khi gõ tay, nơi một lỗi hữu ích hơn một bất ngờ. Tắt lại bằng <code>shopt -u</code>. Chương 7 sẽ quay lại <code>shopt</code> tử tế.</div>

<h3>File ẩn vô hình với glob</h3>
${slide('lx-02', 13, 'File ẩn: bash 5.2 thôi cho .* khớp . và ..')}
<p>Dấu chấm đứng đầu phải được khớp theo đúng nghĩa đen. Đây là chủ ý, và đó là lý do <code>rm *</code> trong thư mục nhà của bạn không phá <code>.ssh</code> và <code>.bashrc</code>:</p>
<pre><code class="language-bash">ls -a
<span class="tok-comment"># .  ..  .env  .gitignore  app.js  README.md</span>

echo *              <span class="tok-comment"># file ẩn bị loại</span>
echo .*             <span class="tok-comment"># chỉ file ẩn — nhưng đọc cảnh báo bên dưới</span>
echo .[!.]*         <span class="tok-comment"># file ẩn, bỏ . và ..</span>
shopt -s dotglob; echo *   <span class="tok-comment"># giờ * gồm cả chúng</span></code></pre>
<div class="out">app.js README.md
.env .gitignore
.env .gitignore
.env .gitignore app.js README.md</div>
<div class="callout warn"><strong>Đã sửa, đo thật trên Ubuntu 24.04 (bash 5.2.21):</strong> dòng thứ hai là <code>.env .gitignore</code> — không có <code>.</code> và <code>..</code>. Bash 5.2 thêm tuỳ chọn shell <code>globskipdots</code>, bật sẵn, nên <code>.*</code> thôi khớp với hai mục đặc biệt đó. Bản cũ của bài in <code>. .. .env .gitignore</code> — đó vẫn là cách bash đời cũ làm, kể cả <code>/bin/bash</code> 3.2 có sẵn trên mọi máy Mac:</div>
<pre><code>shopt globskipdots
bash -c 'shopt -u globskipdots; echo .*'     <span class="tok-comment"># tắt nó đi = hành vi cũ</span></code></pre>
<div class="out">globskipdots   	on
. .. .env .gitignore</div>
<div class="pitfall"><strong>Bẫy:</strong> <code>.*</code> khớp cả <code>.</code> và <code>..</code> — thư mục hiện tại và thư mục cha. Do đó <code>rm -rf .*</code> tìm cách đệ quy vào thư mục <em>CHA</em>, và đã có người xoá sạch cả thư mục nhà theo kiểu này. <code>rm</code> của GNU đời mới từ chối riêng <code>.</code> và <code>..</code> chính là để chặn chuyện đó, nhưng đừng dựa vào: hãy dùng <code>.[!.]*</code>, hoặc <code>shopt -s dotglob</code> rồi <code>*</code> thường. Bash 5.2 trở lên (Ubuntu 24.04, Fedora 44) đã hoàn toàn không khớp chúng nữa nhờ <code>globskipdots</code> — nhưng cùng script đó một ngày nào đó có thể chạy dưới bash 3.2 trên Mac hay trên một máy chủ cũ, nên hãy viết sao cho an toàn ở mọi nơi.</div>

<h3>Globstar: <code>**</code> để khớp đệ quy</h3>
${slide('lx-02', 14, 'extglob và globstar')}
<p>Một dấu <code>*</code> thường dừng lại ở <code>/</code>. Khi bật <code>globstar</code>, <code>**</code> vượt qua ranh giới thư mục:</p>
<pre><code class="language-bash">shopt -s globstar

echo src/*.ts        <span class="tok-comment"># chỉ file nằm trực tiếp trong src/</span>
echo src/**/*.ts     <span class="tok-comment"># mọi file .ts ở mọi độ sâu dưới src/</span></code></pre>
<div class="out">src/index.ts
src/index.ts src/api/user.ts src/api/v2/admin.ts src/lib/db.ts</div>
<p><code>globstar</code> mặc định TẮT trong bash (nó mặc định bật trong zsh, và đó là lý do người dùng macOS hay tưởng nó luôn chạy). Hãy đặt <code>shopt -s globstar</code> vào <code>~/.bashrc</code> — Chương 3 nói về file đó.</p>
<div class="callout warn"><strong>Đã sửa:</strong> với bash hiện nay, <code>**</code> <em>KHÔNG</em> đi xuống các liên kết tượng trưng trỏ tới thư mục, nên một link trỏ ngược lên cây không làm nó lặp được — đo thật trên bash 5.2 ngay dưới (bản cũ của bài nói ngược lại). Điều vẫn đúng: bash dựng TOÀN BỘ danh sách trong bộ nhớ trước khi lệnh kịp khởi động, và một danh sách khổng lồ có thể hỏng với lỗi "Argument list too long". Với cây lớn hoặc cây không tin được, <code>find</code> — bài kế tiếp — vừa nhanh hơn vừa an toàn hơn.</div>
<pre><code class="language-bash">ln -s ../../g/src src/lib/vong    <span class="tok-comment"># một link trỏ ngược lên src/</span>
echo src/**/*.ts</code></pre>
<div class="out">src/api/user.ts src/api/v2/admin.ts src/index.ts src/lib/db.ts</div>
<p>Vẫn đúng bốn file, không có <code>src/lib/vong/…</code> lặp lại. Và để ý chuyện xảy ra khi bạn quên <code>shopt -s globstar</code>: <code>**</code> lặng lẽ cư xử như một dấu <code>*</code> đơn, nên <code>echo src/**/*.ts</code> chỉ in <code>src/api/user.ts src/lib/db.ts</code> — một tầng, không báo lỗi gì.</p>

<h3>extglob: mẫu biết nói "trừ ra"</h3>
<p>Bốn ký tự đại diện không diễn đạt được "mọi thứ trừ các file log". Bash có một ngôn ngữ mẫu thứ hai, tuỳ chọn, cho việc đó — <em>glob mở rộng</em> (extended glob) — bật bằng <code>shopt -s extglob</code>. Mỗi dạng bọc một danh sách lựa chọn cách nhau bởi <code>|</code>:</p>
<table>
<thead><tr><th>Mẫu</th><th>Khớp</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td><code>?(a|b)</code></td><td>không hoặc một lần một trong các lựa chọn</td><td><code>log?(.1).txt</code></td></tr>
<tr><td><code>*(a|b)</code></td><td>không hoặc nhiều lần</td><td><code>v*([0-9])</code></td></tr>
<tr><td><code>+(a|b)</code></td><td>một hoặc nhiều lần</td><td><code>app-+([0-9]).log</code> — chỉ toàn chữ số</td></tr>
<tr><td><code>@(a|b)</code></td><td>đúng một lần</td><td><code>*.@(jpg|png)</code></td></tr>
<tr><td><code>!(a|b)</code></td><td>mọi thứ KHÔNG khớp</td><td><code>!(*.log)</code></td></tr>
</tbody>
</table>
<p>Đo thật trên Ubuntu 24.04, trong thư mục ở đầu bài (<code>app.log db.log notes.txt report.pdf</code> cùng hai file ẩn):</p>
<pre><code>shopt -s extglob
echo !(*.log)
echo *.@(log|pdf)</code></pre>
<div class="out">notes.txt report.pdf
app.log db.log report.pdf</div>
<div class="callout warn">Hai chỗ hay vấp. <strong>Một</strong>, <code>shopt -s extglob</code> phải chạy ở một <em>DÒNG TRƯỚC</em> cái mẫu: bash phân tích cả một dòng (hoặc cả một hàm) trước khi chạy bất cứ phần nào, nên viết <code>shopt -s extglob; echo !(*.log)</code> trên cùng một dòng — hoặc cả hai trong cùng thân một hàm — sẽ hỏng với <code>syntax error near unexpected token &#96;('</code>. <strong>Hai</strong>, <code>!(*.log)</code> vẫn bỏ qua file ẩn: "mọi thứ trừ log" không bao gồm <code>.env</code> trừ khi bật thêm <code>dotglob</code>. Với kiểu dọn dẹp <code>rm !(*.env)</code> thì thường đó lại là điều bạn muốn — và chính là thứ phải kiểm bằng <code>echo</code> trước.</div>

<h3>Glob và regex: cùng những ký tự, hai ngôn ngữ khác nhau</h3>
${slide('lx-02', 11, 'Glob ≠ regex: cùng ký tự, hai ngôn ngữ khác nhau')}
<p>Biểu thức chính quy (<em>regex</em>) là ngôn ngữ mẫu của <code>grep</code>, <code>sed</code>, <code>find -regex</code> và gần như mọi ngôn ngữ lập trình (Chương 3 dạy nó tử tế). Nó dùng lại đúng những ký hiệu của glob nhưng với <em>NGHĨA KHÁC</em>, và đó là lý do một mẫu chạy đúng ở chỗ này lại âm thầm sai ở chỗ kia:</p>
<table>
<thead><tr><th>Bạn muốn</th><th>Glob (shell, <code>find -name</code>)</th><th>Regex (<code>grep</code>, <code>find -regex</code>)</th></tr></thead>
<tbody>
<tr><td>một chuỗi ký tự bất kỳ</td><td><code>*</code></td><td><code>.*</code></td></tr>
<tr><td>đúng một ký tự</td><td><code>?</code></td><td><code>.</code></td></tr>
<tr><td>một ký tự KHÔNG thuộc tập</td><td><code>[!abc]</code></td><td><code>[^abc]</code></td></tr>
<tr><td>một dấu chấm thật</td><td><code>.</code></td><td><code>\\.</code></td></tr>
<tr><td>neo đầu / cuối</td><td>ngầm định — luôn là cả cái tên</td><td><code>^</code> … <code>$</code>, không có thì khớp ở bất kỳ đâu</td></tr>
<tr><td>lặp lại</td><td>không có (extglob: <code>+(…)</code>)</td><td><code>*</code> <code>+</code> <code>{2,}</code> áp vào phần tử đứng trước</td></tr>
</tbody>
</table>
<pre><code class="language-bash">ls
ls | grep '.log'              <span class="tok-comment"># regex: . là MỘT ký tự BẤT KỲ, và không có neo</span>
ls | grep -E '\\.log$'
find . -regextype posix-extended -regex '.*\\.log(\\.[0-9]+)?$'</code></pre>
<div class="out">app.log  app.log.1  catalog.txt
app.log
app.log.1
catalog.txt
app.log
./app.log
./app.log.1</div>
<p><code>catalog.txt</code> khớp <code>.log</code> vì với regex, mẫu đó nghĩa là "một ký tự bất kỳ theo sau là <code>log</code>, ở bất cứ đâu trong dòng" — mà "c-a-t-<strong>a-l-o-g</strong>" chứa <code>alog</code>. Mẫu có neo <code>\\.log$</code> sửa được chuyện đó. Dòng <code>find -regex</code> cũng cho thấy cái tật của nó: nó khớp <em>CẢ ĐƯỜNG DẪN</em> (<code>./app.log</code>), nên mẫu phải mở đầu bằng <code>.*</code>. <strong>Khi nào dùng cái nào:</strong> glob để chọn file theo tên trong shell và trong <code>find -name</code>; regex khi luật chọn không nói được bằng <code>* ? [ ]</code> ("<code>.log</code>, có thể kèm số xoay vòng") hoặc khi bạn khớp chữ bên trong file.</p>

<h3>Chặn khai triển: dấu nháy</h3>
<p>Đôi khi bạn muốn CHÍNH LỆNH nhìn thấy cái mẫu, chứ không phải shell. Dấu nháy là cách bạn nói điều đó:</p>
<pre><code class="language-bash">grep "TODO.*fix" notes.txt     <span class="tok-comment"># có nháy: bộ regex của chính grep thấy .*</span>
find . -name "*.log"           <span class="tok-comment"># có nháy: find tự khớp, theo cách đệ quy</span>
find . -name *.log             <span class="tok-comment"># KHÔNG NHÁY: shell khai triển trước — thường là sai</span></code></pre>
<p>Dòng cuối là lỗi kinh điển. Nếu thư mục hiện tại tình cờ có đúng MỘT file <code>.log</code>, shell viết lại lệnh thành <code>find . -name app.log</code> và bạn đi tìm đúng cái tên đó ở khắp nơi. Nếu có hai file, <code>find</code> báo lỗi <code>paths must precede expression</code>. Nếu không có file nào, nó tình cờ chạy đúng — và đó mới là kết cục tệ nhất, vì bạn học được một bài học sai.</p>

<h3>Tên file bắt đầu bằng dấu gạch ngang</h3>
<p>Một glob có thể sinh ra tên file bắt đầu bằng <code>-</code>, và lệnh sẽ đọc nó như một tuỳ chọn:</p>
<pre><code>touch -- -rf
rm *                  <span class="tok-comment"># shell khai triển thành: rm -rf các-file-khác… → đệ quy!</span>
rm -- *               <span class="tok-comment"># -- kết thúc phần đọc tuỳ chọn: sau đó đều là tên file</span>
rm ./*                <span class="tok-comment"># hoặc ép thêm tiền tố đường dẫn, thứ không thể trông giống một cờ</span></code></pre>
<div class="callout">Quy ước <code>--</code> được gần như mọi công cụ GNU tôn trọng, còn <code>./*</code> chạy được kể cả với công cụ không tôn trọng nó. Hãy ưu tiên <code>./*</code> trong script xử lý những tên file không phải do bạn tạo ra.</div>

<h3>Sắp xếp, và vì sao nó không luôn như bạn nghĩ</h3>
<p>Kết quả glob có được sắp xếp, nhưng theo luật đối chiếu của locale, không theo ASCII:</p>
<pre><code>echo *
<span class="tok-comment"># với en_US.UTF-8: apple Banana cherry   (gần như không phân biệt hoa thường)</span>
LC_ALL=C sh -c 'echo *'
<span class="tok-comment"># với locale C: Banana apple cherry  (đúng thứ tự byte)</span></code></pre>
<p>Và — điều này quan trọng với file log — việc sắp xếp là theo từ điển chứ không theo số: <code>log10.txt</code> đứng trước <code>log2.txt</code>. Hãy đệm số 0 cho tên bạn sinh ra (<code>log02</code>) hoặc sắp xếp tường minh bằng <code>ls -v</code> hay <code>sort -V</code>.</p>

<h3>Trên macOS: zsh và bash 3.2 cư xử khác</h3>
<p>Shell tương tác của Mac là zsh, còn <code>/bin/bash</code> đi kèm máy là bản 3.2 từ năm 2007. Cả hai đều bất đồng với bash 5.2 của Ubuntu đúng ở những chủ đề của bài này. Đo thật trên macOS (zsh 5.9, <code>/bin/bash</code> 3.2.57), trong một thư mục có <code>app.log</code>, <code>db.log</code> và <code>.env</code>:</p>
<pre><code>zsh -f -c 'for f in *.csv; do echo "x $f"; done'
zsh -f -c 'find . -name *.zz'
zsh -f -c 'echo .*'
/bin/bash -c 'echo .*'
/bin/bash -c 'shopt -s globstar'</code></pre>
<div class="out">zsh:1: no matches found: *.csv
zsh:1: no matches found: *.zz
.env
. .. .env
/bin/bash: line 0: shopt: globstar: invalid shell option name</div>
<ul>
<li><strong>zsh dừng lại khi glob không khớp</strong> (tuỳ chọn <code>NOMATCH</code>, bật sẵn): vòng lặp không chạy và lệnh không khởi động — an toàn hơn kiểu truyền nguyên văn của bash, nhưng cũng có nghĩa một lệnh <code>find . -name *.zz</code> không nháy thì hỏng trên Mac trong khi lại "chạy được" trên Linux. Đặt mẫu trong nháy là hai bên đồng ý với nhau. <code>setopt null_glob</code> cho hành vi giống <code>nullglob</code> của bash.</li>
<li><strong>zsh không bao giờ khớp <code>.</code> và <code>..</code></strong>; bash 3.2 thì có, giống mọi bash trước 5.2.</li>
<li><strong>bash 3.2 không có <code>globstar</code></strong> (nó xuất hiện từ bash 4.0). zsh có sẵn <code>**/</code> mà không cần tuỳ chọn nào — đó là lý do <code>**</code> "tự nhiên chạy" trong terminal Mac của bạn rồi lại hỏng trong một script <code>#!/bin/bash</code> trên chính cái Mac đó.</li>
</ul>
<p>Luật thực dụng cho script phải chạy ở cả hai nơi: đặt <code>#!/usr/bin/env bash</code> ở đầu, cho mọi mẫu dành cho chương trình khác vào nháy, và bật <code>nullglob</code> một cách tường minh thay vì dựa vào mặc định của shell nào.</p>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> máy chủ nhận file tải lên của nhóm xoay vòng log thành <code>app-1.log</code> … <code>app-200.log</code>, nằm cạnh một file <code>.env</code> và một <code>README.md</code>. Bạn phải chuyển log số 1–99 vào <code>cu/</code> để lưu trữ, không đụng thứ gì khác, và chứng minh được mình chọn đúng trước khi chạy bất cứ lệnh phá huỷ nào.</p><ol>
<li>Dựng bằng khai triển ngoặc nhọn: <code>mkdir -p ~/thu-linux/c22 &amp;&amp; cd ~/thu-linux/c22 &amp;&amp; touch app-{1..200}.log .env README.md</code>.</li>
<li>Đếm xem hai glob khác nhau chọn được bao nhiêu, trước khi đụng vào gì: <code>echo app-[0-9].log app-[0-9][0-9].log | wc -w</code> và <code>echo app-?.log app-??.log | wc -w</code>.</li>
<li>Xem "mọi thứ trừ log" nghĩa là gì, khi có và không có file ẩn: <code>shopt -s extglob</code>, rồi (dòng kế) <code>echo !(*.log)</code>; rồi <code>shopt -s dotglob; echo !(*.log); shopt -u dotglob</code>.</li>
<li>Chứng minh vòng lặp của bạn sống sót khi "không khớp gì": <code>shopt -s nullglob; for f in *.csv; do echo "csv: $f"; done; echo "vòng lặp xong"; shopt -u nullglob</code>.</li>
<li>Chuyển thật và đếm cả hai phía: <code>mkdir -p cu &amp;&amp; mv app-[0-9].log app-[0-9][0-9].log cu/ &amp;&amp; ls cu | wc -l &amp;&amp; ls *.log | wc -l</code>.</li></ol>
<div class="out">99
99
README.md
.env README.md
vòng lặp xong
99
101</div>
<p><strong>Đạt khi:</strong> cả hai con số ở bước 2 là <code>99</code>; bước 3 chỉ hiện <code>.env</code> khi đã bật <code>dotglob</code>; bước 4 chỉ in <code>vòng lặp xong</code>; bước 5 in <code>99</code> rồi <code>101</code> (còn lại log 100–200), và <code>ls -A</code> vẫn thấy <code>.env</code> với <code>README.md</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Glob (mẫu tên file)</span><span class="v">Một mẫu tên file (<code>*.log</code>) mà shell khai triển thành các tên khớp trước khi lệnh chạy.</span></div>
  <div class="kv"><span class="k">Wildcard (ký tự đại diện)</span><span class="v">Các ký tự đặc biệt của glob: <code>*</code>, <code>?</code>, <code>[…]</code>.</span></div>
  <div class="kv"><span class="k">Expansion (khai triển)</span><span class="v">Việc shell viết lại thứ bạn gõ (glob, ngoặc nhọn, biến) thành danh sách tham số cuối cùng.</span></div>
  <div class="kv"><span class="k">Regular expression — regex (biểu thức chính quy)</span><span class="v">Một ngôn ngữ mẫu khác, của <code>grep</code>/<code>sed</code>/<code>find -regex</code>, trong đó <code>.</code> nghĩa là "một ký tự bất kỳ".</span></div>
  <div class="kv"><span class="k">nullglob / failglob</span><span class="v">Tuỳ chọn làm glob không khớp khai triển thành rỗng / báo lỗi, thay vì bị truyền nguyên văn.</span></div>
  <div class="kv"><span class="k">Dotfile (file ẩn)</span><span class="v">File có tên bắt đầu bằng <code>.</code>; glob thường bỏ qua nó trừ khi bật <code>dotglob</code>.</span></div>
  <div class="kv"><span class="k">extglob (glob mở rộng)</span><span class="v">Các dạng như <code>!(…)</code> và <code>+(…)</code>, bật bằng <code>shopt -s extglob</code>.</span></div>
  <div class="kv"><span class="k">globstar (khớp đệ quy)</span><span class="v">Tuỳ chọn cho <code>**</code> khớp xuyên nhiều tầng thư mục; bash 3.2 không có.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Shell khai triển glob trước khi chương trình khởi động; <code>echo</code> với đúng cái mẫu đó cho thấy chính xác <code>rm</code> sẽ nhận gì.</li>
<li>Ngoặc nhọn sinh chữ (để tạo), glob đọc thư mục (để chọn); glob không khớp bị truyền nguyên văn trong bash — dùng <code>nullglob</code> trong vòng lặp.</li>
<li>Glob và regex dùng chung ký hiệu nhưng khác nghĩa: <code>*</code> với <code>.*</code>, <code>?</code> với <code>.</code>, và regex không có neo nếu bạn không thêm <code>^…$</code>.</li>
<li>File ẩn bị glob bỏ qua; <code>globskipdots</code> của bash 5.2 làm <code>.*</code> thôi khớp <code>.</code>/<code>..</code>, nhưng bash 3.2 trên Mac vẫn khớp.</li>
<li><code>extglob</code> thêm phép "trừ ra" (<code>!(…)</code>) và phải bật ở một dòng trước đó; <code>globstar</code> làm <code>**</code> đệ quy và mặc định tắt.</li>
<li>Mọi mẫu dành cho chương trình khác đều phải trong nháy (<code>find -name "*.log"</code>): zsh báo lỗi khi glob không khớp, bash truyền nguyên văn, và chỉ có dấu nháy cho kết quả giống nhau ở mọi nơi.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/bash/manual/html_node/Filename-Expansion.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">Bash Manual — Filename Expansion</span><span class="lc-sub">Thứ tự khai triển chính thống, và mọi <code>shopt</code> làm đổi cách glob hoạt động. Ngắn, và đáng đọc trọn một lần.</span></span>
</a>
<a class="link-card" href="https://mywiki.wooledge.org/glob" target="_blank" rel="noopener">
  <span class="lc-ico">🔧</span>
  <span class="lc-body"><span class="lc-title">Greg's Wiki — Globs</span><span class="lc-sub">Bài viết thực dụng hay nhất về extglob, nullglob và lý do "đừng phân tích kết quả ls", từ chính những người trả lời các câu hỏi này mỗi ngày.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: chọn đúng những file cần chọn</span><span class="lc-sub">Bài tập chấm điểm về <code>?</code>, khoảng trong ngoặc, dotglob và nullglob, trên một thư mục mẫu dựng ra để trừng phạt việc đoán mò.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>rm *.log</code> so với <code>rm * .log</code>. Một dấu cách lạc chỗ biến "xoá các file log" thành "xoá <em>MỌI THỨ</em>, rồi than phiền thêm rằng <code>.log</code> không tồn tại". Lời than phiền đến SAU khi đã xoá. Không có nút hoàn tác. Đây chính là tai nạn mà thói quen <code>echo</code>-trước ngăn được, và là lý do nên xây thói quen đó trước khi bạn cần đến nó.</div>
<p class="note-ct"><strong>Quy tắc làm cho tất cả những thứ trên trở nên an toàn:</strong> chạy <code>ls</code> hoặc <code>echo</code> với đúng cái mẫu đó trước, đọc kết quả, rồi mới chạy lại với lệnh phá huỷ. Shell khai triển cái mẫu y hệt nhau cả hai lần, nên thứ bạn vừa nhìn thấy chính xác là thứ sẽ bị tác động. Đó là phép kiểm chứng rẻ nhất trong ngành máy tính.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.3 ─────────────────────────── */
    {
      title: '2.3 — find: a real search engine for your filesystem|||2.3 — find: một cỗ máy tìm kiếm thật sự cho hệ thống file',
      slug: 'lnx-2-3-find',
      type: 'LESSON',
      description: 'Cấu trúc đường dẫn/phép thử/hành động, -type -size -mtime -perm, kết hợp bằng -a -o !, -exec với ; và + khác nhau ra sao, -print0 với xargs -0, -prune để bỏ qua node_modules, và vì sao -maxdepth phải đứng trước.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>find: a real search engine for your filesystem</h2>
<p class="lead">Globs answer "which files here match this name". <code>find</code> answers "which files anywhere under this tree match these <em>conditions</em>, and what should I do with each one". It is the difference between a filter and a query language — and once you can read a <code>find</code> command, a large amount of professional shell scripting stops looking like magic.</p>

<h3>The anatomy of every find command</h3>
${slide('lx-02', 15, 'Mọi lệnh find có ba phần: nơi đi · phép thử · hành động')}
<pre><code class="language-bash">find  <span class="tok-kw">./src</span>  <span class="tok-str">-type f -name "*.ts"</span>  <span class="tok-fn">-print</span>
      └── where     └── tests            └── action</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Paths</span><span class="lz-lnote">Where to start walking. One or more. <code>.</code> is the usual answer. Must come <em>first</em>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Positional options</span><span class="lz-lnote"><code>-maxdepth</code>, <code>-mindepth</code>, <code>-follow</code>. These change how the walk itself works, so they must appear <em>before</em> any test.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tests</span><span class="lz-lnote">Questions asked about each path found: name, type, size, age, owner, permissions. Combined with and/or/not.</span></div>
  <div class="lz-layer"><span class="lz-lname">Actions</span><span class="lz-lnote">What to do with paths that passed the tests: print, delete, run a command. If you give none, <code>-print</code> is implied.</span></div>
</div>

<p>The order is not stylistic. <code>find</code> evaluates the expression left to right, for every single path it encounters, and stops as soon as the answer is decided:</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Walk</span><span class="lz-t">find descends the tree, one path at a time</span><span class="lz-d">Directories, files, symlinks, sockets — every entry, depth-first.</span></div>
  <div class="lz-step"><span class="lz-k">Test</span><span class="lz-t">-type f → is it a regular file?</span><span class="lz-d">False → this path is finished, move to the next. True → keep evaluating.</span></div>
  <div class="lz-step"><span class="lz-k">Test</span><span class="lz-t">-name "*.ts" → does the basename match?</span><span class="lz-d">Same short-circuit. The tests are ANDed together unless you say otherwise.</span></div>
  <div class="lz-step"><span class="lz-k">Act</span><span class="lz-t">-print / -delete / -exec …</span><span class="lz-d">Runs only for paths that survived every test. This is why a misplaced -delete is so dangerous.</span></div>
</div>

<h3>The tests you will actually use</h3>
${slide('lx-02', 16, 'Bảng phép thử hay dùng')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-name "*.log"</code></span><span class="v">Basename glob. <strong>Always quote it</strong> — otherwise the shell expands it first (Lesson 2.2). <code>-iname</code> is the case-insensitive version.</span></div>
  <div class="kv"><span class="k"><code>-path "*/dist/*"</code></span><span class="v">Matches against the <em>whole</em> path, not just the basename. This is how you filter by directory.</span></div>
  <div class="kv"><span class="k"><code>-type f</code></span><span class="v"><code>f</code> regular file · <code>d</code> directory · <code>l</code> symlink · <code>s</code> socket · <code>p</code> named pipe.</span></div>
  <div class="kv"><span class="k"><code>-size +100M</code></span><span class="v">Bigger than 100 MiB. Suffixes: <code>c</code> bytes, <code>k</code>, <code>M</code>, <code>G</code>. Bare number means 512-byte blocks — almost never what you want.</span></div>
  <div class="kv"><span class="k"><code>-mtime -7</code></span><span class="v">Modified less than 7 days ago. <code>-mmin -30</code> is the minutes version and is far easier to reason about.</span></div>
  <div class="kv"><span class="k"><code>-newer file</code></span><span class="v">Modified more recently than that file. The trick: <code>touch -d "2 hours ago" /tmp/ref</code> gives you an arbitrary cutoff.</span></div>
  <div class="kv"><span class="k"><code>-empty</code></span><span class="v">Zero-length file, or a directory with no entries.</span></div>
  <div class="kv"><span class="k"><code>-user deploy</code> · <code>-perm -0002</code></span><span class="v">Owner, and permission bits. <code>-perm -0002</code> = "world-writable", the classic security audit.</span></div>
</div>

<h3>+n, -n and n — the rule that catches everyone</h3>
${slide('lx-02', 17, '-mtime đếm chu kỳ 24 giờ và cắt phần lẻ')}
<p>Every numeric test in <code>find</code> reads its argument three ways, and the plain number is the one that surprises people:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-mtime +7</code></span><span class="v">MORE than 7 (older than a week)</span></div>
  <div class="kv"><span class="k"><code>-mtime -7</code></span><span class="v">LESS than 7 (changed within the week)</span></div>
  <div class="kv"><span class="k"><code>-mtime 7</code></span><span class="v">EXACTLY 7 — i.e. between 7 and 8 days old, and nothing else</span></div>
</div>
<div class="callout warn"><code>-mtime</code> counts whole 24-hour periods and <strong>truncates</strong>. A file modified 6 hours ago has an age of 0 days, so <code>-mtime 1</code> does not match it and neither does <code>-mtime +0</code>. For anything inside a day, use <code>-mmin</code>. This rounding is the source of the classic "my cleanup cron deletes nothing / deletes everything" bug.</div>

<h3>Combining tests</h3>
${slide('lx-02', 20, 'Thứ tự viết = thứ tự chạy: -o cần ngoặc, -delete đứng cuối')}
<pre><code class="language-bash"><span class="tok-comment"># AND is implicit — these two are identical</span>
find . -type f -name "*.log"
find . -type f -a -name "*.log"

<span class="tok-comment"># OR needs -o, and almost always needs parentheses</span>
find . -type f \\( -name "*.log" -o -name "*.tmp" \\)

<span class="tok-comment"># NOT is ! (escaped, because ! is history expansion in interactive bash)</span>
find . -type f \\! -name "*.md"</code></pre>
<div class="out">./logs/app.log
./logs/db.log
./cache/render.tmp</div>
<p>The parentheses matter more than they look. Without them, <code>find . -name "*.log" -o -name "*.tmp" -delete</code> parses as <code>(-name "*.log") OR (-name "*.tmp" AND -delete)</code> — so the <code>.log</code> files are merely printed, and only the <code>.tmp</code> files are deleted. Both halves look like they worked. They did not.</p>
<div class="callout">The backslashes exist because <code>(</code>, <code>)</code> and <code>!</code> are shell metacharacters. <code>\\( … \\)</code> and <code>'('</code> … <code>')'</code> are equally valid; pick one and stay consistent. Inside a script (no interactive history), plain <code>!</code> works, but escaping it always is one fewer thing to remember.</div>

<h3>Actions: -exec, and the two terminators</h3>
${slide('lx-02', 18, '-exec \\; vs + vs xargs -0 — đo thật trên 5.000 file')}
<p><code>-exec</code> runs a command for each match, with <code>{}</code> standing in for the path. How you terminate it changes the performance by orders of magnitude:</p>
<pre><code class="language-bash"><span class="tok-comment"># one process PER FILE — 5,000 files = 5,000 processes</span>
find . -name "*.log" -exec gzip {} \\;

<span class="tok-comment"># batches as many paths as fit on one command line — usually 2-3 processes total</span>
find . -name "*.log" -exec gzip {} +</code></pre>
<div class="out">real  0m9.412s     # with \\;
real  0m0.688s     # with +</div>
<p>Use <code>+</code> whenever the command accepts multiple arguments, which is nearly always. Use <code>\\;</code> when the command takes exactly one file, or when <code>{}</code> must appear somewhere other than the end:</p>
<pre><code class="language-bash">find . -name "*.jpg" -exec mv {} {}.bak \\;      <span class="tok-comment"># {} twice → must use \\;</span>
find . -type d -name node_modules -exec du -sh {} +</code></pre>
<div class="callout ok"><code>-execdir</code> is the safer sibling: it runs the command from inside each file's own directory and passes <code>./name</code> instead of a long path. That closes a real race condition where a directory is replaced by a symlink mid-walk, and it sidesteps dash-leading filenames entirely.</div>

<h3>Measured: <code>\\;</code> vs <code>+</code> vs <code>xargs</code> on 5,000 files</h3>
<p>The numbers above are from an older machine. Re-measured on the course machine (Ubuntu 24.04 container, 10 CPUs, September 2026) with 5,000 small log files and <code>md5sum</code>, three runs each:</p>
<pre><code class="language-bash">mkdir -p logs &amp;&amp; for i in $(seq 1 5000); do echo "dong $i" &gt; logs/app-$i.log; done
find logs -name '*.log' -exec md5sum {} \\; &gt;/dev/null                        <span class="tok-comment"># 3.13 · 2.89 · 3.17 s</span>
find logs -name '*.log' -exec md5sum {} + &gt;/dev/null                         <span class="tok-comment"># 0.028 · 0.029 · 0.030 s</span>
find logs -name '*.log' -print0 | xargs -0 md5sum &gt;/dev/null                <span class="tok-comment"># 0.035 · 0.031 · 0.030 s</span>
find logs -name '*.log' -print0 | xargs -0 -P4 -n 1250 md5sum &gt;/dev/null    <span class="tok-comment"># 0.012 s each run</span></code></pre>
<p>About a hundred times faster, from one character. The reason is visible if you ask how many arguments each run of the command received:</p>
<pre><code class="language-bash">find logs -name '*.log' -exec sh -c 'echo $#' _ {} +
find pdf -name '*.pdf' -exec echo "lenh:" {} \\;
find pdf -name '*.pdf' -exec echo "lenh:" {} +</code></pre>
<div class="out">5000
lenh: pdf/Bao cao cuoi ky.pdf
lenh: pdf/ok.pdf
lenh: pdf/Bao cao cuoi ky.pdf pdf/ok.pdf</div>
<p>With <code>+</code>, one <code>sh</code> received all 5,000 paths at once; with <code>\\;</code>, <code>echo</code> ran once per file. Starting a process costs far more than hashing a tiny file, so the per-file version spends almost all of its three seconds just launching programs. Note also that the file name with spaces arrived as <em>one</em> argument either way: <code>-exec</code> passes names directly, it never splits them.</p>

<h3>-print0 and xargs -0: filenames with spaces</h3>
${slide('lx-02', 19, 'Tên có dấu cách: chỉ byte NUL tách tên an toàn')}
<p>The default separator between <code>find</code> results is a newline — and a newline is a legal character in a filename. So is a space. Piping <code>find</code> into anything word-based is broken for exactly the filenames most likely to be user-supplied:</p>
<pre><code class="language-bash"><span class="tok-comment"># BROKEN: "My Report.pdf" arrives as two arguments</span>
find . -name "*.pdf" | xargs rm

<span class="tok-comment"># CORRECT: NUL-separated, the one byte a filename cannot contain</span>
find . -name "*.pdf" -print0 | xargs -0 rm

<span class="tok-comment"># Also correct, and usually simpler</span>
find . -name "*.pdf" -delete</code></pre>
<p><code>-print0</code> ends each path with a zero byte instead of a newline, and <code>xargs -0</code> splits on that. Since the filesystem forbids NUL inside a filename, the pairing is unambiguous by construction. Whenever you see <code>find | xargs</code> without the <code>-print0</code>/<code>-0</code> pair, you are looking at a latent bug.</p>

<h3>xargs: the flags you will actually use</h3>
<p><code>xargs</code> reads names from standard input and builds command lines out of them. Pairing it with <code>find -print0</code> is its main job, but five flags cover nearly every real use:</p>
<table>
<thead><tr><th>Flag</th><th>Meaning</th><th>Example</th></tr></thead>
<tbody>
<tr><td><code>-0</code></td><td>Items are separated by NUL bytes (pairs with <code>-print0</code>)</td><td><code>find . -print0 | xargs -0 ls -l</code></td></tr>
<tr><td><code>-n N</code></td><td>At most N arguments per command</td><td><code>xargs -0 -n 100 gzip</code></td></tr>
<tr><td><code>-P N</code></td><td>Run up to N commands in parallel</td><td><code>xargs -0 -P4 -n 1250 md5sum</code></td></tr>
<tr><td><code>-I{}</code></td><td>Replace <code>{}</code> anywhere in the command — one item per run</td><td><code>xargs -0 -I{} mv {} {}.bak</code></td></tr>
<tr><td><code>-r</code></td><td>Do not run at all when the input is empty (GNU)</td><td><code>find … -print0 | xargs -0 -r rm</code></td></tr>
<tr><td><code>-t</code></td><td>Print each command before running it</td><td>debugging</td></tr>
</tbody>
</table>
<pre><code class="language-bash">find logs -name '*.tmp' -print0 | xargs -0 -I{} mv {} {}.bak
printf 'a\\nb\\nc\\n' | xargs -t -n 2 echo
printf '' | xargs echo hi         <span class="tok-comment"># empty input…</span>
printf '' | xargs -r echo hi      <span class="tok-comment"># …with -r</span></code></pre>
<div class="out">echo a b
a b
echo c
c
hi</div>
<p>The last two lines are the trap: with empty input, GNU <code>xargs</code> still runs the command <em>once, with no arguments</em> — so <code>find … | xargs rm</code> on an empty result runs a bare <code>rm</code> (harmless), but <code>xargs chmod 600</code> or a script with defaults can do something you did not ask for. <code>-r</code> makes it do nothing. (macOS <code>xargs</code> already behaves like <code>-r</code>: measured, <code>printf '' | xargs echo hi</code> prints nothing there.) When <code>find -exec … +</code> can do the job, prefer it — no pipe, no splitting, no empty-input surprise.</p>

<h3>-prune: skipping node_modules and .git</h3>
<p>Filtering out a directory with <code>! -path "*/node_modules/*"</code> works, but <code>find</code> still descends into it and tests every one of the 40,000 files inside. <code>-prune</code> tells it not to enter at all:</p>
<pre><code class="language-bash">find . \\( -name node_modules -o -name .git \\) -prune -o -type f -name "*.ts" -print</code></pre>
<div class="out">./src/index.ts
./src/api/user.ts
./tests/user.test.ts</div>
<p>Read it as: "if the entry is <code>node_modules</code> or <code>.git</code>, prune it (do not descend, and stop evaluating); <em>otherwise</em>, if it is a <code>.ts</code> file, print it." The trailing <code>-print</code> is mandatory here — the default <code>-print</code> is only implied when the expression contains no action at all, and <code>-prune</code> counts as one. Without it you get every path, pruned and not.</p>
<div class="callout">On a large monorepo this is not a micro-optimisation. Measured on a project with 62,000 files in <code>node_modules</code>: 4.1 s without <code>-prune</code>, 0.3 s with it.</div>

<h3>-maxdepth must come before the tests</h3>
<pre><code class="language-bash">find . -maxdepth 2 -name "*.json"     <span class="tok-comment"># correct</span>
find . -name "*.json" -maxdepth 2     <span class="tok-comment"># works, but warns — and is a trap</span></code></pre>
<div class="out">find: warning: you have specified the global option -maxdepth after the argument -name, but global options are not positional, i.e., -maxdepth affects tests specified before it as well as those specified after it.  Please specify global options before other arguments.</div>
<div class="callout">Measured on findutils 4.9.0 (Ubuntu 24.04) — this is the exact wording. One detail the man page states and people miss: find only prints warnings like this when its standard input is a <em>terminal</em> (<code>-warn</code> is the default only then). In a script run by cron, or with input from a pipe, the same command is silent. Write the options first and you never depend on seeing it.</div>
<p>The warning says the quiet part out loud: positional options apply to the <em>whole</em> expression regardless of where you write them, so writing one late gives a command that reads differently from how it behaves. <code>-maxdepth 1</code>, incidentally, is how you make <code>find</code> non-recursive — useful when you want <code>find</code>'s tests but not its tree walk.</p>

<h3>Recipes worth keeping</h3>
<pre><code class="language-bash"><span class="tok-comment"># The 20 biggest files under /var, human-readable</span>
find /var -type f -printf '%s\\t%p\\n' 2&gt;/dev/null | sort -rn | head -20 | numfmt --field=1 --to=iec

<span class="tok-comment"># Delete build artefacts older than 30 days (print first! always print first)</span>
find /var/backups -type f -name "*.tar.gz" -mtime +30 -print
find /var/backups -type f -name "*.tar.gz" -mtime +30 -delete

<span class="tok-comment"># Every file changed since the last deploy</span>
find . -newer /var/run/last-deploy -type f \\! -path "*/.git/*"

<span class="tok-comment"># World-writable files — a real security finding</span>
find /opt -type f -perm -0002 -ls

<span class="tok-comment"># Empty directories, deepest first (-depth matters here)</span>
find . -depth -type d -empty -delete

<span class="tok-comment"># Search inside the matches: find selects, grep reads</span>
find . -name "*.env*" -type f -exec grep -l "SECRET" {} +</code></pre>

<h3>Faster alternatives, and when they lie</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>fd</code></span><span class="v">A modern rewrite: <code>fd '\\.ts$' src</code>. Respects <code>.gitignore</code>, skips hidden files, parallel, far nicer syntax. Not installed by default — <code>apt install fd-find</code>, and on Debian/Ubuntu the binary is called <code>fdfind</code>.</span></div>
  <div class="kv"><span class="k"><code>locate</code> / <code>plocate</code></span><span class="v">Instant, because it queries a database instead of the disk. That database is rebuilt by a daily timer, so it does not know about anything created since — including the file you made two minutes ago. Run <code>sudo updatedb</code> or accept the staleness.</span></div>
</div>
<p>Learn <code>find</code> anyway. It is on every Linux machine ever built, including the minimal container you will one day have to debug at 2am with no package manager.</p>

<h3>Every action, in one table</h3>
<table>
<thead><tr><th>Action</th><th>Does</th><th>Note</th></tr></thead>
<tbody>
<tr><td><code>-print</code> · <code>-print0</code></td><td>Print the path, ending in newline · in NUL</td><td>Implicit <code>-print</code> vanishes once any other action appears</td></tr>
<tr><td><code>-printf FMT</code></td><td>Print with a format: <code>%p</code> path, <code>%f</code> name, <code>%s</code> bytes, <code>%k</code> KiB, <code>%T…</code> mtime</td><td>GNU only</td></tr>
<tr><td><code>-ls</code></td><td>An <code>ls -dils</code>-style line</td><td>Inode, blocks, mode, owner, size</td></tr>
<tr><td><code>-delete</code></td><td>Remove the match (implies <code>-depth</code>)</td><td>Always last; <code>-print</code> first</td></tr>
<tr><td><code>-exec … {} +</code> · <code>\\;</code></td><td>Run a command on many paths at once · on each path</td><td><code>+</code> unless <code>{}</code> is not last</td></tr>
<tr><td><code>-execdir … {} +</code></td><td>Same, run from the file's own directory with <code>./name</code></td><td>Safer against races</td></tr>
<tr><td><code>-ok … {} \\;</code></td><td>Like <code>-exec</code>, but asks <code>y/n</code> for each file</td><td>Interactive clean-ups</td></tr>
<tr><td><code>-prune</code> · <code>-quit</code></td><td>Do not descend into this directory · stop after the first match</td><td><code>-quit</code>: "does at least one exist?"</td></tr>
</tbody>
</table>
<pre><code class="language-bash">find logs -name '*.gz' -ls | head -2
find / -name passwd -print -quit 2&gt;/dev/null
find logs -name '*.tmp' -ok rm {} \\;            <span class="tok-comment"># answer n</span>
find logs -maxdepth 1 -type f -name '*.gz' -printf '%TY-%Tm-%Td %TH:%TM  %6k KiB  %f\\n' | sort | head -3</code></pre>
<div class="out">    65838      8 -rw-r--r--   1 cuong    cuong        4108 Sep 28 09:08 logs/app-4.log.gz
    65836      4 -rw-r--r--   1 cuong    cuong        3093 Sep 28 09:08 logs/app-3.log.gz
/usr/bin/passwd
&lt; rm ... logs/x.tmp &gt; ? n
2026-09-28 09:08       4 KiB  app-2.log.gz
2026-09-28 09:08       4 KiB  app-3.log.gz
2026-09-28 09:08       8 KiB  app-4.log.gz</div>

<h3>On macOS: BSD find is stricter and smaller</h3>
<p>The Mac's <code>/usr/bin/find</code> is BSD find. Most of this lesson works unchanged — <code>-name</code>, <code>-type</code>, <code>-mtime</code>, <code>-exec … +</code>, <code>-print0</code>, <code>-delete</code>, <code>-prune</code> — but four differences show up quickly. Measured on macOS:</p>
<pre><code>/usr/bin/find -name "*.log"                              <span class="tok-comment"># no starting path</span>
/usr/bin/find . -name "*.log" -printf '%s\\n'
/usr/bin/find . -regex '.*\\.log(\\.[0-9]+)?$' | wc -l      <span class="tok-comment"># basic regex by default</span>
/usr/bin/find -E . -regex '.*\\.log(\\.[0-9]+)?$'           <span class="tok-comment"># -E = extended</span></code></pre>
<div class="out">/usr/bin/find: illegal option -- n
usage: find [-H | -L | -P] [-EXdsx] [-f path] path ... [expression]
       find [-H | -L | -P] [-EXdsx] -f path [path ...] [expression]
find: -printf: unknown primary or operator
       0
./app.log
./app.log.1
./db.log</div>
<ul>
<li>GNU find assumes <code>.</code> when you omit the path; BSD find requires it. Always write it — <code>find . …</code> works on both.</li>
<li>No <code>-printf</code> on the Mac. Use <code>-exec stat -f '%z %N' {} +</code> (BSD <code>stat</code> format) or install GNU findutils with Homebrew, which provides it as <code>gfind</code>.</li>
<li>BSD <code>-regex</code> uses basic regular expressions unless you pass <code>-E</code> <em>before</em> the path; GNU uses <code>-regextype</code> after it.</li>
<li>On an empty input BSD <code>xargs</code> runs nothing (see the <code>xargs</code> section), GNU needs <code>-r</code>.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> the team VPS reports a full disk the morning after a load test. The log directory holds a few large files — one of them named with spaces — and some old ones. Find the big recent logs, compress them in one command, and delete what is older than two days, printing before deleting.</p><ol>
<li>Build the evidence (sizes are made with <code>truncate</code>, so nothing real is written): <code>mkdir -p ~/thu-linux/c23/logs &amp;&amp; cd ~/thu-linux/c23</code>, then <code>for i in 1 2 3 4 5 6; do truncate -s \${i}M logs/app-$i.log; done; truncate -s 8M "logs/bao cao ky.log"; truncate -s 10k logs/nho.log; touch -d '3 days ago' logs/app-5.log logs/app-6.log</code>.</li>
<li>The five biggest files over 1 MiB changed in the last 24 hours: <code>find logs -type f -size +1M -mmin -1440 -printf '%s\\t%p\\n' | sort -rn | head -5</code>. Why is <code>app-1.log</code> (exactly 1 MiB) not in the list?</li>
<li>Feel the space problem, then fix it: <code>find logs -name '*.log' -size +1M -mmin -1440 | xargs ls -1</code>, then the same with <code>-print0 | xargs -0 ls -1</code>.</li>
<li>Compress them all in one process: <code>find logs -name '*.log' -size +1M -mmin -1440 -exec gzip {} +</code>, then <code>ls logs</code>.</li>
<li>Old logs: <code>find logs -name '*.log' -mtime +2 -print</code>, read the list, then replace <code>-print</code> by <code>-delete</code>.</li></ol>
<div class="out">8388608	logs/bao cao ky.log
4194304	logs/app-4.log
3145728	logs/app-3.log
2097152	logs/app-2.log
ls: cannot access 'logs/bao': No such file or directory
ls: cannot access 'cao': No such file or directory
ls: cannot access 'ky.log': No such file or directory
logs/app-6.log
logs/app-5.log</div>
<p><strong>Done when:</strong> step 2 lists exactly four files (<code>-size +1M</code> counts in whole MiB units, rounded up, and "more than 1" excludes a file of exactly 1 MiB); the <code>-print0</code> version of step 3 lists <code>logs/bao cao ky.log</code> as one line; after step 4 <code>ls logs</code> shows <code>app-2.log.gz</code>, <code>app-3.log.gz</code>, <code>app-4.log.gz</code> and <code>bao cao ky.log.gz</code>; after step 5, <code>app-5.log</code> and <code>app-6.log</code> are gone while <code>app-1.log</code> and <code>nho.log</code> remain.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Expression</span><span class="v">Everything after the starting paths: tests, operators and actions, evaluated left to right for each path.</span></div>
  <div class="kv"><span class="k">Test (predicate)</span><span class="v">A true/false question about a path: <code>-name</code>, <code>-type</code>, <code>-size</code>, <code>-mtime</code>…</span></div>
  <div class="kv"><span class="k">Action</span><span class="v">What to do with a path that passed: <code>-print</code>, <code>-delete</code>, <code>-exec</code>…</span></div>
  <div class="kv"><span class="k">Short-circuit</span><span class="v">Stopping as soon as the answer is known — a false test means later actions never run.</span></div>
  <div class="kv"><span class="k">NUL byte</span><span class="v">Byte value 0, the only byte a filename cannot contain — hence the safe separator for <code>-print0</code>/<code>xargs -0</code>.</span></div>
  <div class="kv"><span class="k">Prune</span><span class="v">Telling find not to descend into a directory at all, e.g. <code>node_modules</code>.</span></div>
  <div class="kv"><span class="k">mtime</span><span class="v">The time a file's content last changed; <code>-mtime</code> counts it in whole 24-hour periods.</span></div>
  <div class="kv"><span class="k">xargs</span><span class="v">A program that turns lines (or NUL-separated items) from its input into arguments of a command.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Every find command is paths, then options, then tests, then actions — evaluated left to right, per path, with short-circuiting.</li>
<li>Quote <code>-name</code> patterns; use <code>-mmin</code>/<code>-newermt</code> within a day because <code>-mtime</code> truncates to whole days.</li>
<li><code>-o</code> needs parentheses, and <code>-prune</code>/<code>-delete</code>/<code>-exec</code> remove the implicit <code>-print</code>.</li>
<li><code>-exec … {} +</code> ran about 100× faster than <code>\\;</code> on 5,000 files, and passes names intact.</li>
<li>Only NUL separates names safely: <code>-print0 | xargs -0</code>, plus <code>-r</code> so empty input runs nothing on GNU.</li>
<li>GNU find does not stop <code>-delete</code> placed before a test — build with <code>-print</code>, then swap the action in at the end.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/find.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">find(1) — the complete manual</span><span class="lc-sub">Long, but the "EXPRESSION" and "EXAMPLES" sections alone repay the read. <code>-printf</code> format codes live here too.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/findutils/manual/html_mono/find.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU Findutils Manual — Security Considerations</span><span class="lc-sub">Explains precisely why <code>-execdir</code> and <code>-print0</code> exist, with the race conditions spelled out. Rare, genuinely useful documentation.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: query a messy filesystem</span><span class="lc-sub">Graded tasks on <code>-prune</code>, <code>-mtime</code> boundaries and <code>-exec … +</code>, on a fixture tree containing filenames with spaces and leading dashes.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>-delete</code> is an action, and actions are evaluated <em>in the order written</em>. <code>find . -delete -name "*.log"</code> deletes the entire tree and then checks the names of what it just deleted. GNU find does <em>not</em> stop you — measured on findutils 4.9.0 (Ubuntu 24.04), the command deleted every file and subdirectory and exited 0 (an earlier version of this lesson claimed it refuses; it does not). The lesson: put <code>-delete</code> last, and run the identical command with <code>-print</code> first — every single time, including the times you are sure.</div>
<p class="note-ct"><strong>Two habits that make find safe:</strong> (1) build the command with <code>-print</code>, read the list, then swap the action in — the tests do not change, so the list does not change; (2) if the command touches anything outside your own project directory, add <code>-maxdepth</code> as a blast radius limiter even when you do not need it. Neither costs anything, and both have saved production systems.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>find: một cỗ máy tìm kiếm thật sự cho hệ thống file</h2>
<p class="lead">Glob trả lời câu "file nào ở ĐÂY khớp cái tên này". <code>find</code> trả lời câu "file nào ở BẤT KỲ ĐÂU dưới cây này thoả những <em>ĐIỀU KIỆN</em> này, và tôi phải làm gì với từng cái". Đó là khác biệt giữa một bộ lọc và một ngôn ngữ truy vấn — và khi bạn đọc được một lệnh <code>find</code>, một phần lớn script shell chuyên nghiệp thôi trông giống phép thuật.</p>

<h3>Giải phẫu mọi lệnh find</h3>
${slide('lx-02', 15, 'Mọi lệnh find có ba phần: nơi đi · phép thử · hành động')}
<pre><code class="language-bash">find  <span class="tok-kw">./src</span>  <span class="tok-str">-type f -name "*.ts"</span>  <span class="tok-fn">-print</span>
      └── ở đâu     └── phép thử         └── hành động</code></pre>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-lname">Đường dẫn</span><span class="lz-lnote">Bắt đầu đi từ đâu. Một hoặc nhiều. <code>.</code> là câu trả lời thường gặp. Phải đứng <em>ĐẦU TIÊN</em>.</span></div>
  <div class="lz-layer"><span class="lz-lname">Tuỳ chọn vị trí</span><span class="lz-lnote"><code>-maxdepth</code>, <code>-mindepth</code>, <code>-follow</code>. Chúng đổi cách CHÍNH VIỆC ĐI diễn ra, nên phải xuất hiện <em>TRƯỚC</em> mọi phép thử.</span></div>
  <div class="lz-layer"><span class="lz-lname">Phép thử</span><span class="lz-lnote">Những câu hỏi đặt ra với từng đường dẫn tìm thấy: tên, loại, kích thước, tuổi, chủ sở hữu, quyền. Ghép bằng và/hoặc/không.</span></div>
  <div class="lz-layer"><span class="lz-lname">Hành động</span><span class="lz-lnote">Làm gì với những đường dẫn đã qua hết phép thử: in ra, xoá, chạy một lệnh. Không ghi gì thì mặc định là <code>-print</code>.</span></div>
</div>

<p>Thứ tự không phải chuyện hình thức. <code>find</code> tính biểu thức từ trái sang phải, cho TỪNG đường dẫn nó gặp, và dừng ngay khi câu trả lời đã ngã ngũ:</p>

<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">Đi</span><span class="lz-t">find đi xuống cây, mỗi lần một đường dẫn</span><span class="lz-d">Thư mục, file, liên kết, socket — mọi mục, theo chiều sâu.</span></div>
  <div class="lz-step"><span class="lz-k">Thử</span><span class="lz-t">-type f → nó có phải file thường không?</span><span class="lz-d">Sai → đường dẫn này xong, sang cái kế. Đúng → tính tiếp.</span></div>
  <div class="lz-step"><span class="lz-k">Thử</span><span class="lz-t">-name "*.ts" → phần tên có khớp không?</span><span class="lz-d">Cũng ngắt mạch như vậy. Các phép thử mặc định nối bằng VÀ trừ khi bạn nói khác.</span></div>
  <div class="lz-step"><span class="lz-k">Làm</span><span class="lz-t">-print / -delete / -exec …</span><span class="lz-d">Chỉ chạy với đường dẫn sống sót qua mọi phép thử. Đó là lý do một chữ -delete đặt sai chỗ nguy hiểm đến thế.</span></div>
</div>

<h3>Những phép thử bạn thật sự dùng</h3>
${slide('lx-02', 16, 'Bảng phép thử hay dùng')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-name "*.log"</code></span><span class="v">Glob trên phần tên. <strong>LUÔN đặt trong nháy</strong> — nếu không shell khai triển trước (Bài 2.2). <code>-iname</code> là bản không phân biệt hoa thường.</span></div>
  <div class="kv"><span class="k"><code>-path "*/dist/*"</code></span><span class="v">Khớp với <em>TOÀN BỘ</em> đường dẫn, không chỉ phần tên. Đây là cách lọc theo thư mục.</span></div>
  <div class="kv"><span class="k"><code>-type f</code></span><span class="v"><code>f</code> file thường · <code>d</code> thư mục · <code>l</code> liên kết tượng trưng · <code>s</code> socket · <code>p</code> ống có tên.</span></div>
  <div class="kv"><span class="k"><code>-size +100M</code></span><span class="v">Lớn hơn 100 MiB. Hậu tố: <code>c</code> byte, <code>k</code>, <code>M</code>, <code>G</code>. Số trần nghĩa là khối 512 byte — gần như không bao giờ là thứ bạn muốn.</span></div>
  <div class="kv"><span class="k"><code>-mtime -7</code></span><span class="v">Sửa cách đây chưa tới 7 ngày. <code>-mmin -30</code> là bản tính theo phút và dễ suy luận hơn nhiều.</span></div>
  <div class="kv"><span class="k"><code>-newer file</code></span><span class="v">Sửa gần đây hơn file đó. Mẹo: <code>touch -d "2 hours ago" /tmp/ref</code> cho bạn một mốc cắt tuỳ ý.</span></div>
  <div class="kv"><span class="k"><code>-empty</code></span><span class="v">File độ dài 0, hoặc thư mục không có mục nào.</span></div>
  <div class="kv"><span class="k"><code>-user deploy</code> · <code>-perm -0002</code></span><span class="v">Chủ sở hữu, và các bit quyền. <code>-perm -0002</code> = "cả thế giới ghi được", phép kiểm an ninh kinh điển.</span></div>
</div>

<h3>+n, -n và n — luật bẫy tất cả mọi người</h3>
${slide('lx-02', 17, '-mtime đếm chu kỳ 24 giờ và cắt phần lẻ')}
<p>Mọi phép thử số trong <code>find</code> đọc tham số của nó theo ba kiểu, và số trần mới là kiểu làm người ta bất ngờ:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-mtime +7</code></span><span class="v">NHIỀU HƠN 7 (cũ hơn một tuần)</span></div>
  <div class="kv"><span class="k"><code>-mtime -7</code></span><span class="v">ÍT HƠN 7 (thay đổi trong vòng một tuần)</span></div>
  <div class="kv"><span class="k"><code>-mtime 7</code></span><span class="v">ĐÚNG BẰNG 7 — tức là tuổi từ 7 đến 8 ngày, và không gì khác</span></div>
</div>
<div class="callout warn"><code>-mtime</code> đếm theo chu kỳ 24 giờ trọn vẹn và <strong>cắt bỏ phần lẻ</strong>. Một file sửa cách đây 6 tiếng có tuổi là 0 ngày, nên <code>-mtime 1</code> không khớp nó, mà <code>-mtime +0</code> cũng không. Với bất cứ thứ gì trong vòng một ngày, hãy dùng <code>-mmin</code>. Chính phép làm tròn này là nguồn gốc của lỗi kinh điển "cron dọn dẹp của tôi chẳng xoá gì cả / xoá sạch mọi thứ".</div>

<h3>Ghép các phép thử</h3>
${slide('lx-02', 20, 'Thứ tự viết = thứ tự chạy: -o cần ngoặc, -delete đứng cuối')}
<pre><code class="language-bash"><span class="tok-comment"># VÀ là ngầm định — hai dòng này y hệt nhau</span>
find . -type f -name "*.log"
find . -type f -a -name "*.log"

<span class="tok-comment"># HOẶC cần -o, và gần như luôn cần ngoặc đơn</span>
find . -type f \\( -name "*.log" -o -name "*.tmp" \\)

<span class="tok-comment"># KHÔNG là ! (có gạch chéo, vì ! là khai triển lịch sử trong bash tương tác)</span>
find . -type f \\! -name "*.md"</code></pre>
<div class="out">./logs/app.log
./logs/db.log
./cache/render.tmp</div>
<p>Cặp ngoặc đơn quan trọng hơn vẻ ngoài của nó. Không có chúng, <code>find . -name "*.log" -o -name "*.tmp" -delete</code> được phân tích thành <code>(-name "*.log") HOẶC (-name "*.tmp" VÀ -delete)</code> — nghĩa là các file <code>.log</code> chỉ được in ra, và chỉ file <code>.tmp</code> bị xoá. Cả hai nửa đều TRÔNG như đã chạy đúng. Chúng không đúng.</p>
<div class="callout">Các dấu gạch chéo ngược tồn tại vì <code>(</code>, <code>)</code> và <code>!</code> là ký tự đặc biệt của shell. <code>\\( … \\)</code> và <code>'('</code> … <code>')'</code> đều hợp lệ như nhau; chọn một kiểu rồi giữ nhất quán. Bên trong script (không có lịch sử tương tác), <code>!</code> trần vẫn chạy, nhưng luôn thêm gạch chéo là bớt được một thứ phải nhớ.</div>

<h3>Hành động: -exec, và hai kiểu kết thúc</h3>
${slide('lx-02', 18, '-exec \\; vs + vs xargs -0 — đo thật trên 5.000 file')}
<p><code>-exec</code> chạy một lệnh cho mỗi kết quả khớp, với <code>{}</code> thay chỗ cho đường dẫn. Cách bạn kết thúc nó làm hiệu năng chênh nhau cả bậc độ lớn:</p>
<pre><code class="language-bash"><span class="tok-comment"># một tiến trình MỖI FILE — 5.000 file = 5.000 tiến trình</span>
find . -name "*.log" -exec gzip {} \\;

<span class="tok-comment"># gom nhiều đường dẫn nhất có thể vào một dòng lệnh — thường tổng cộng 2-3 tiến trình</span>
find . -name "*.log" -exec gzip {} +</code></pre>
<div class="out">real  0m9.412s     # với \\;
real  0m0.688s     # với +</div>
<p>Hãy dùng <code>+</code> mỗi khi lệnh nhận được nhiều tham số, tức là gần như luôn luôn. Dùng <code>\\;</code> khi lệnh chỉ nhận đúng một file, hoặc khi <code>{}</code> phải xuất hiện ở chỗ nào đó không phải cuối:</p>
<pre><code class="language-bash">find . -name "*.jpg" -exec mv {} {}.bak \\;      <span class="tok-comment"># {} hai lần → buộc phải dùng \\;</span>
find . -type d -name node_modules -exec du -sh {} +</code></pre>
<div class="callout ok"><code>-execdir</code> là người anh em an toàn hơn: nó chạy lệnh từ BÊN TRONG thư mục của chính file đó và truyền <code>./tên</code> thay vì một đường dẫn dài. Điều đó bịt một tình huống tranh chấp có thật, khi một thư mục bị thay bằng liên kết tượng trưng ngay giữa lúc đang đi, và nó tránh hẳn chuyện tên file bắt đầu bằng dấu gạch ngang.</div>

<h3>Đo thật: <code>\\;</code> so với <code>+</code> so với <code>xargs</code> trên 5.000 file</h3>
<p>Mấy con số ở trên đến từ một máy cũ hơn. Đo lại trên máy của khoá (container Ubuntu 24.04, 10 CPU, tháng 9/2026) với 5.000 file log nhỏ và <code>md5sum</code>, mỗi cách ba lượt:</p>
<pre><code class="language-bash">mkdir -p logs &amp;&amp; for i in $(seq 1 5000); do echo "dong $i" &gt; logs/app-$i.log; done
find logs -name '*.log' -exec md5sum {} \\; &gt;/dev/null                        <span class="tok-comment"># 3,13 · 2,89 · 3,17 s</span>
find logs -name '*.log' -exec md5sum {} + &gt;/dev/null                         <span class="tok-comment"># 0,028 · 0,029 · 0,030 s</span>
find logs -name '*.log' -print0 | xargs -0 md5sum &gt;/dev/null                <span class="tok-comment"># 0,035 · 0,031 · 0,030 s</span>
find logs -name '*.log' -print0 | xargs -0 -P4 -n 1250 md5sum &gt;/dev/null    <span class="tok-comment"># 0,012 s mỗi lượt</span></code></pre>
<p>Nhanh gấp khoảng một trăm lần, chỉ nhờ một ký tự. Lý do hiện ra ngay nếu bạn hỏi mỗi lần chạy, lệnh nhận được bao nhiêu tham số:</p>
<pre><code class="language-bash">find logs -name '*.log' -exec sh -c 'echo $#' _ {} +
find pdf -name '*.pdf' -exec echo "lenh:" {} \\;
find pdf -name '*.pdf' -exec echo "lenh:" {} +</code></pre>
<div class="out">5000
lenh: pdf/Bao cao cuoi ky.pdf
lenh: pdf/ok.pdf
lenh: pdf/Bao cao cuoi ky.pdf pdf/ok.pdf</div>
<p>Với <code>+</code>, một tiến trình <code>sh</code> nhận cả 5.000 đường dẫn một lượt; với <code>\\;</code>, <code>echo</code> chạy mỗi file một lần. Khởi động một tiến trình tốn hơn nhiều so với băm một file tí hon, nên bản chạy-từng-file dành gần như trọn ba giây của nó chỉ để khởi chạy chương trình. Để ý thêm: cái tên file có dấu cách đến nơi thành <em>MỘT</em> tham số ở cả hai cách — <code>-exec</code> truyền tên trực tiếp, nó không bao giờ cắt tên ra.</p>

<h3>-print0 và xargs -0: tên file có dấu cách</h3>
${slide('lx-02', 19, 'Tên có dấu cách: chỉ byte NUL tách tên an toàn')}
<p>Dấu phân cách mặc định giữa các kết quả <code>find</code> là ký tự xuống dòng — mà xuống dòng lại là một ký tự HỢP LỆ trong tên file. Dấu cách cũng vậy. Nên việc đưa <code>find</code> qua ống vào bất cứ thứ gì cắt theo từ đều hỏng đúng với những tên file dễ do người dùng đặt nhất:</p>
<pre><code class="language-bash"><span class="tok-comment"># HỎNG: "Báo cáo của tôi.pdf" đến nơi thành nhiều tham số</span>
find . -name "*.pdf" | xargs rm

<span class="tok-comment"># ĐÚNG: phân cách bằng NUL, byte duy nhất mà tên file không thể chứa</span>
find . -name "*.pdf" -print0 | xargs -0 rm

<span class="tok-comment"># Cũng đúng, và thường đơn giản hơn</span>
find . -name "*.pdf" -delete</code></pre>
<p><code>-print0</code> kết thúc mỗi đường dẫn bằng một byte 0 thay vì xuống dòng, và <code>xargs -0</code> cắt theo byte đó. Vì hệ thống file cấm NUL nằm trong tên file, cặp này không thể nhập nhằng — theo đúng thiết kế. Hễ bạn thấy <code>find | xargs</code> mà thiếu cặp <code>-print0</code>/<code>-0</code>, bạn đang nhìn một lỗi tiềm ẩn.</p>

<h3>xargs: những cờ bạn thật sự dùng</h3>
<p><code>xargs</code> đọc tên từ đầu vào chuẩn và dựng dòng lệnh từ chúng. Đi cặp với <code>find -print0</code> là việc chính của nó, nhưng năm cái cờ phủ gần hết mọi trường hợp thật:</p>
<table>
<thead><tr><th>Cờ</th><th>Nghĩa</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td><code>-0</code></td><td>Các mục phân cách bằng byte NUL (đi cặp với <code>-print0</code>)</td><td><code>find . -print0 | xargs -0 ls -l</code></td></tr>
<tr><td><code>-n N</code></td><td>Tối đa N tham số mỗi lần chạy lệnh</td><td><code>xargs -0 -n 100 gzip</code></td></tr>
<tr><td><code>-P N</code></td><td>Chạy song song tối đa N lệnh</td><td><code>xargs -0 -P4 -n 1250 md5sum</code></td></tr>
<tr><td><code>-I{}</code></td><td>Thay <code>{}</code> ở bất kỳ chỗ nào trong lệnh — mỗi lần một mục</td><td><code>xargs -0 -I{} mv {} {}.bak</code></td></tr>
<tr><td><code>-r</code></td><td>Không chạy gì khi đầu vào rỗng (GNU)</td><td><code>find … -print0 | xargs -0 -r rm</code></td></tr>
<tr><td><code>-t</code></td><td>In ra từng lệnh trước khi chạy</td><td>gỡ lỗi</td></tr>
</tbody>
</table>
<pre><code class="language-bash">find logs -name '*.tmp' -print0 | xargs -0 -I{} mv {} {}.bak
printf 'a\\nb\\nc\\n' | xargs -t -n 2 echo
printf '' | xargs echo hi         <span class="tok-comment"># đầu vào rỗng…</span>
printf '' | xargs -r echo hi      <span class="tok-comment"># …có -r</span></code></pre>
<div class="out">echo a b
a b
echo c
c
hi</div>
<p>Hai dòng cuối chính là cái bẫy: với đầu vào rỗng, <code>xargs</code> của GNU vẫn chạy lệnh <em>MỘT LẦN, không tham số</em> — nên <code>find … | xargs rm</code> trên kết quả rỗng sẽ chạy một lệnh <code>rm</code> trần (vô hại), nhưng <code>xargs chmod 600</code> hay một script có giá trị mặc định thì có thể làm điều bạn không hề yêu cầu. <code>-r</code> làm nó không làm gì cả. (<code>xargs</code> của macOS vốn đã cư xử như <code>-r</code>: đo thật, <code>printf '' | xargs echo hi</code> ở đó không in gì.) Khi <code>find -exec … +</code> làm được việc thì hãy ưu tiên nó — không ống dẫn, không cắt tên, không bất ngờ với đầu vào rỗng.</p>

<h3>-prune: bỏ qua node_modules và .git</h3>
<p>Lọc bỏ một thư mục bằng <code>! -path "*/node_modules/*"</code> thì chạy được, nhưng <code>find</code> vẫn đi xuống trong đó và thử từng file trong số 40.000 file bên trong. <code>-prune</code> bảo nó đừng bước vào chút nào:</p>
<pre><code class="language-bash">find . \\( -name node_modules -o -name .git \\) -prune -o -type f -name "*.ts" -print</code></pre>
<div class="out">./src/index.ts
./src/api/user.ts
./tests/user.test.ts</div>
<p>Hãy đọc nó là: "nếu mục này là <code>node_modules</code> hoặc <code>.git</code> thì tỉa đi (đừng đi xuống, và ngừng tính tiếp); <em>NGƯỢC LẠI</em>, nếu nó là file <code>.ts</code> thì in ra". Chữ <code>-print</code> ở cuối là BẮT BUỘC ở đây — <code>-print</code> mặc định chỉ được ngầm hiểu khi biểu thức không chứa hành động nào cả, mà <code>-prune</code> tính là một hành động. Thiếu nó, bạn nhận về mọi đường dẫn, cả bị tỉa lẫn không.</p>
<div class="callout">Trên một kho mã lớn, đây không phải tối ưu vụn vặt. Đo thật trên một dự án có 62.000 file trong <code>node_modules</code>: 4,1 giây khi không có <code>-prune</code>, 0,3 giây khi có.</div>

<h3>-maxdepth phải đứng trước các phép thử</h3>
<pre><code class="language-bash">find . -maxdepth 2 -name "*.json"     <span class="tok-comment"># đúng</span>
find . -name "*.json" -maxdepth 2     <span class="tok-comment"># vẫn chạy, nhưng cảnh báo — và là một cái bẫy</span></code></pre>
<div class="out">find: warning: you have specified the global option -maxdepth after the argument -name, but global options are not positional, i.e., -maxdepth affects tests specified before it as well as those specified after it.  Please specify global options before other arguments.</div>
<div class="callout">Đo thật với findutils 4.9.0 (Ubuntu 24.04) — đây là nguyên văn. Một chi tiết trang man có ghi mà người ta hay bỏ qua: find chỉ in những cảnh báo kiểu này khi đầu vào chuẩn của nó là một <em>TERMINAL</em> (<code>-warn</code> chỉ là mặc định trong trường hợp đó). Trong một script do cron chạy, hoặc khi đầu vào đến từ một ống dẫn, cùng lệnh đó im lặng. Viết tuỳ chọn lên trước thì bạn không bao giờ phải dựa vào việc nhìn thấy nó.</div>
<p>Lời cảnh báo nói toạc phần vẫn được giấu: tuỳ chọn vị trí áp dụng cho <em>TOÀN BỘ</em> biểu thức bất kể bạn viết nó ở đâu, nên viết muộn tạo ra một lệnh ĐỌC khác với cách nó CHẠY. Nhân tiện, <code>-maxdepth 1</code> chính là cách làm cho <code>find</code> không đệ quy — hữu ích khi bạn muốn các phép thử của <code>find</code> mà không muốn nó đi khắp cây.</p>

<h3>Những công thức đáng giữ lại</h3>
<pre><code class="language-bash"><span class="tok-comment"># 20 file lớn nhất dưới /var, đọc được bằng mắt người</span>
find /var -type f -printf '%s\\t%p\\n' 2&gt;/dev/null | sort -rn | head -20 | numfmt --field=1 --to=iec

<span class="tok-comment"># Xoá tệp dựng cũ hơn 30 ngày (in ra trước! luôn in ra trước)</span>
find /var/backups -type f -name "*.tar.gz" -mtime +30 -print
find /var/backups -type f -name "*.tar.gz" -mtime +30 -delete

<span class="tok-comment"># Mọi file đã đổi kể từ lần deploy gần nhất</span>
find . -newer /var/run/last-deploy -type f \\! -path "*/.git/*"

<span class="tok-comment"># File cả thế giới ghi được — một phát hiện an ninh có thật</span>
find /opt -type f -perm -0002 -ls

<span class="tok-comment"># Thư mục rỗng, sâu nhất trước (-depth quan trọng ở đây)</span>
find . -depth -type d -empty -delete

<span class="tok-comment"># Tìm bên trong kết quả: find chọn, grep đọc</span>
find . -name "*.env*" -type f -exec grep -l "SECRET" {} +</code></pre>

<h3>Những lựa chọn nhanh hơn, và khi nào chúng nói dối</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>fd</code></span><span class="v">Bản viết lại đời mới: <code>fd '\\.ts$' src</code>. Tôn trọng <code>.gitignore</code>, bỏ qua file ẩn, chạy song song, cú pháp dễ chịu hơn hẳn. Không có sẵn — <code>apt install fd-find</code>, và trên Debian/Ubuntu tên chương trình là <code>fdfind</code>.</span></div>
  <div class="kv"><span class="k"><code>locate</code> / <code>plocate</code></span><span class="v">Tức thì, vì nó truy vấn một cơ sở dữ liệu thay vì đọc đĩa. Cơ sở dữ liệu đó được dựng lại bởi một hẹn giờ hằng ngày, nên nó KHÔNG biết gì về những thứ tạo ra sau đó — kể cả file bạn vừa tạo hai phút trước. Chạy <code>sudo updatedb</code>, hoặc chấp nhận sự cũ kỹ đó.</span></div>
</div>
<p>Dù sao vẫn hãy học <code>find</code>. Nó có trên mọi máy Linux từng được dựng ra, kể cả cái container tối giản mà một ngày nào đó bạn phải gỡ lỗi lúc 2 giờ sáng, không có trình quản lý gói nào.</p>

<h3>Mọi hành động, gom vào một bảng</h3>
<table>
<thead><tr><th>Hành động</th><th>Làm gì</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td><code>-print</code> · <code>-print0</code></td><td>In đường dẫn, kết thúc bằng xuống dòng · bằng NUL</td><td><code>-print</code> ngầm định biến mất khi có hành động khác</td></tr>
<tr><td><code>-printf ĐỊNH_DẠNG</code></td><td>In theo định dạng: <code>%p</code> đường dẫn, <code>%f</code> tên, <code>%s</code> byte, <code>%k</code> KiB, <code>%T…</code> giờ sửa</td><td>Chỉ GNU có</td></tr>
<tr><td><code>-ls</code></td><td>Một dòng kiểu <code>ls -dils</code></td><td>Inode, số khối, quyền, chủ, kích thước</td></tr>
<tr><td><code>-delete</code></td><td>Xoá cái khớp (ngầm bật <code>-depth</code>)</td><td>Luôn đứng cuối; chạy <code>-print</code> trước</td></tr>
<tr><td><code>-exec … {} +</code> · <code>\\;</code></td><td>Chạy lệnh trên nhiều đường dẫn một lượt · trên từng đường dẫn</td><td>Dùng <code>+</code> trừ khi <code>{}</code> không ở cuối</td></tr>
<tr><td><code>-execdir … {} +</code></td><td>Như trên, nhưng chạy từ thư mục của chính file với <code>./tên</code></td><td>An toàn hơn trước tranh chấp</td></tr>
<tr><td><code>-ok … {} \\;</code></td><td>Như <code>-exec</code>, nhưng hỏi <code>y/n</code> với từng file</td><td>Dọn dẹp có hỏi</td></tr>
<tr><td><code>-prune</code> · <code>-quit</code></td><td>Không đi vào thư mục này · dừng sau kết quả khớp đầu tiên</td><td><code>-quit</code>: "có ít nhất một cái không?"</td></tr>
</tbody>
</table>
<pre><code class="language-bash">find logs -name '*.gz' -ls | head -2
find / -name passwd -print -quit 2&gt;/dev/null
find logs -name '*.tmp' -ok rm {} \\;            <span class="tok-comment"># trả lời n</span>
find logs -maxdepth 1 -type f -name '*.gz' -printf '%TY-%Tm-%Td %TH:%TM  %6k KiB  %f\\n' | sort | head -3</code></pre>
<div class="out">    65838      8 -rw-r--r--   1 cuong    cuong        4108 Sep 28 09:08 logs/app-4.log.gz
    65836      4 -rw-r--r--   1 cuong    cuong        3093 Sep 28 09:08 logs/app-3.log.gz
/usr/bin/passwd
&lt; rm ... logs/x.tmp &gt; ? n
2026-09-28 09:08       4 KiB  app-2.log.gz
2026-09-28 09:08       4 KiB  app-3.log.gz
2026-09-28 09:08       8 KiB  app-4.log.gz</div>

<h3>Trên macOS: find của BSD khắt khe hơn và ít tính năng hơn</h3>
<p><code>/usr/bin/find</code> của Mac là find của BSD. Phần lớn bài này chạy nguyên vẹn — <code>-name</code>, <code>-type</code>, <code>-mtime</code>, <code>-exec … +</code>, <code>-print0</code>, <code>-delete</code>, <code>-prune</code> — nhưng bốn khác biệt lộ ra rất nhanh. Đo thật trên macOS:</p>
<pre><code>/usr/bin/find -name "*.log"                              <span class="tok-comment"># thiếu đường dẫn xuất phát</span>
/usr/bin/find . -name "*.log" -printf '%s\\n'
/usr/bin/find . -regex '.*\\.log(\\.[0-9]+)?$' | wc -l      <span class="tok-comment"># mặc định là regex cơ bản</span>
/usr/bin/find -E . -regex '.*\\.log(\\.[0-9]+)?$'           <span class="tok-comment"># -E = regex mở rộng</span></code></pre>
<div class="out">/usr/bin/find: illegal option -- n
usage: find [-H | -L | -P] [-EXdsx] [-f path] path ... [expression]
       find [-H | -L | -P] [-EXdsx] -f path [path ...] [expression]
find: -printf: unknown primary or operator
       0
./app.log
./app.log.1
./db.log</div>
<ul>
<li>find của GNU tự hiểu là <code>.</code> khi bạn bỏ đường dẫn; find của BSD bắt buộc phải có. Luôn viết nó ra — <code>find . …</code> chạy được ở cả hai.</li>
<li>Mac không có <code>-printf</code>. Dùng <code>-exec stat -f '%z %N' {} +</code> (định dạng <code>stat</code> của BSD), hoặc cài GNU findutils bằng Homebrew, nó có sẵn dưới tên <code>gfind</code>.</li>
<li><code>-regex</code> của BSD dùng regex cơ bản trừ khi bạn truyền <code>-E</code> <em>TRƯỚC</em> đường dẫn; GNU thì dùng <code>-regextype</code> đặt sau đường dẫn.</li>
<li>Với đầu vào rỗng, <code>xargs</code> của BSD không chạy gì (xem mục <code>xargs</code>), còn GNU cần <code>-r</code>.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> sáng hôm sau buổi thử tải, VPS của nhóm báo đầy đĩa. Thư mục log có vài file lớn — một cái tên có dấu cách — cùng mấy file cũ. Hãy tìm các log lớn gần đây, nén chúng bằng một lệnh, và xoá những gì cũ hơn hai ngày, in ra trước khi xoá.</p><ol>
<li>Dựng hiện trường (kích thước tạo bằng <code>truncate</code>, không ghi dữ liệu thật nào): <code>mkdir -p ~/thu-linux/c23/logs &amp;&amp; cd ~/thu-linux/c23</code>, rồi <code>for i in 1 2 3 4 5 6; do truncate -s \${i}M logs/app-$i.log; done; truncate -s 8M "logs/bao cao ky.log"; truncate -s 10k logs/nho.log; touch -d '3 days ago' logs/app-5.log logs/app-6.log</code>.</li>
<li>Năm file lớn nhất trên 1 MiB đã đổi trong 24 giờ qua: <code>find logs -type f -size +1M -mmin -1440 -printf '%s\\t%p\\n' | sort -rn | head -5</code>. Vì sao <code>app-1.log</code> (đúng 1 MiB) không có trong danh sách?</li>
<li>Cảm nhận vấn đề dấu cách, rồi sửa: <code>find logs -name '*.log' -size +1M -mmin -1440 | xargs ls -1</code>, rồi cùng lệnh đó với <code>-print0 | xargs -0 ls -1</code>.</li>
<li>Nén tất cả trong một tiến trình: <code>find logs -name '*.log' -size +1M -mmin -1440 -exec gzip {} +</code>, rồi <code>ls logs</code>.</li>
<li>Log cũ: <code>find logs -name '*.log' -mtime +2 -print</code>, đọc danh sách, rồi thay <code>-print</code> bằng <code>-delete</code>.</li></ol>
<div class="out">8388608	logs/bao cao ky.log
4194304	logs/app-4.log
3145728	logs/app-3.log
2097152	logs/app-2.log
ls: cannot access 'logs/bao': No such file or directory
ls: cannot access 'cao': No such file or directory
ls: cannot access 'ky.log': No such file or directory
logs/app-6.log
logs/app-5.log</div>
<p><strong>Đạt khi:</strong> bước 2 liệt kê đúng bốn file (<code>-size +1M</code> đếm theo đơn vị MiB trọn, làm tròn lên, và "lớn hơn 1" loại file đúng 1 MiB); bản <code>-print0</code> ở bước 3 in <code>logs/bao cao ky.log</code> thành một dòng; sau bước 4, <code>ls logs</code> có <code>app-2.log.gz</code>, <code>app-3.log.gz</code>, <code>app-4.log.gz</code> và <code>bao cao ky.log.gz</code>; sau bước 5, <code>app-5.log</code> và <code>app-6.log</code> biến mất còn <code>app-1.log</code> và <code>nho.log</code> vẫn ở lại.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Expression (biểu thức)</span><span class="v">Mọi thứ sau đường dẫn xuất phát: phép thử, toán tử và hành động, tính từ trái sang phải cho từng đường dẫn.</span></div>
  <div class="kv"><span class="k">Test / predicate (phép thử)</span><span class="v">Một câu hỏi đúng/sai về một đường dẫn: <code>-name</code>, <code>-type</code>, <code>-size</code>, <code>-mtime</code>…</span></div>
  <div class="kv"><span class="k">Action (hành động)</span><span class="v">Việc làm với đường dẫn đã qua hết phép thử: <code>-print</code>, <code>-delete</code>, <code>-exec</code>…</span></div>
  <div class="kv"><span class="k">Short-circuit (ngắt mạch)</span><span class="v">Dừng ngay khi đã biết kết quả — một phép thử sai thì hành động phía sau không bao giờ chạy.</span></div>
  <div class="kv"><span class="k">NUL byte (byte số 0)</span><span class="v">Byte duy nhất tên file không thể chứa — vì thế là dấu phân cách an toàn cho <code>-print0</code>/<code>xargs -0</code>.</span></div>
  <div class="kv"><span class="k">Prune (tỉa)</span><span class="v">Bảo find đừng đi vào một thư mục chút nào, ví dụ <code>node_modules</code>.</span></div>
  <div class="kv"><span class="k">mtime (thời điểm sửa)</span><span class="v">Lúc nội dung file đổi lần cuối; <code>-mtime</code> đếm nó theo từng chu kỳ 24 giờ trọn.</span></div>
  <div class="kv"><span class="k">xargs (dựng dòng lệnh)</span><span class="v">Chương trình biến các dòng (hoặc các mục phân cách NUL) ở đầu vào thành tham số của một lệnh.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mọi lệnh find là: đường dẫn, rồi tuỳ chọn, rồi phép thử, rồi hành động — tính trái sang phải, cho từng đường dẫn, có ngắt mạch.</li>
<li>Đặt mẫu <code>-name</code> trong nháy; trong vòng một ngày dùng <code>-mmin</code>/<code>-newermt</code> vì <code>-mtime</code> cắt về số ngày trọn.</li>
<li><code>-o</code> cần ngoặc, và <code>-prune</code>/<code>-delete</code>/<code>-exec</code> làm biến mất <code>-print</code> ngầm định.</li>
<li><code>-exec … {} +</code> chạy nhanh hơn <code>\\;</code> khoảng 100 lần trên 5.000 file, và truyền tên nguyên vẹn.</li>
<li>Chỉ NUL tách tên an toàn: <code>-print0 | xargs -0</code>, thêm <code>-r</code> để đầu vào rỗng không chạy gì trên GNU.</li>
<li>find của GNU không chặn <code>-delete</code> đặt trước phép thử — dựng lệnh bằng <code>-print</code>, rồi mới tráo hành động vào ở cuối.</li>
</ul>

<a class="link-card" href="https://man7.org/linux/man-pages/man1/find.1.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">find(1) — bộ hướng dẫn đầy đủ</span><span class="lc-sub">Dài, nhưng riêng hai mục "EXPRESSION" và "EXAMPLES" đã đáng công đọc. Các mã định dạng của <code>-printf</code> cũng nằm ở đây.</span></span>
</a>
<a class="link-card" href="https://www.gnu.org/software/findutils/manual/html_mono/find.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU Findutils Manual — Security Considerations</span><span class="lc-sub">Giải thích chính xác vì sao <code>-execdir</code> và <code>-print0</code> tồn tại, với các tình huống tranh chấp được viết ra rõ ràng. Một tài liệu hiếm và thật sự hữu ích.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: truy vấn một hệ thống file bừa bộn</span><span class="lc-sub">Bài chấm điểm về <code>-prune</code>, các mốc <code>-mtime</code> và <code>-exec … +</code>, trên một cây mẫu có cả tên file chứa dấu cách lẫn tên bắt đầu bằng gạch ngang.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>-delete</code> là một HÀNH ĐỘNG, và hành động được tính <em>THEO ĐÚNG THỨ TỰ VIẾT RA</em>. <code>find . -delete -name "*.log"</code> xoá sạch cả cây rồi mới đi kiểm tra tên của những thứ nó vừa xoá. find của GNU <em>KHÔNG</em> chặn — đo thật với findutils 4.9.0 (Ubuntu 24.04), lệnh xoá sạch mọi file và thư mục con rồi thoát với mã 0 (bản cũ của bài ghi rằng nó từ chối; không phải vậy). Bài học: đặt <code>-delete</code> ở cuối, và chạy lệnh y hệt với <code>-print</code> trước — MỖI LẦN, kể cả những lần bạn chắc chắn.</div>
<p class="note-ct"><strong>Hai thói quen làm find trở nên an toàn:</strong> (1) dựng lệnh bằng <code>-print</code>, đọc danh sách, rồi mới tráo hành động vào — các phép thử không đổi nên danh sách cũng không đổi; (2) nếu lệnh đụng tới bất cứ thứ gì ngoài thư mục dự án của bạn, hãy thêm <code>-maxdepth</code> như một cái hạn chế bán kính nổ, kể cả khi bạn không cần tới nó. Cả hai đều không tốn gì, và cả hai đều từng cứu những hệ thống production.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.4 ─────────────────────────── */
    {
      title: '2.4 — Links and archives: inodes, symlinks, and tar without looking it up|||2.4 — Liên kết và kho nén: inode, symlink, và tar mà không phải tra lại',
      slug: 'lnx-2-4-lien-ket-va-nen',
      type: 'LESSON',
      description: 'Liên kết cứng và liên kết tượng trưng khác nhau ở đâu trong mô hình inode, cách tráo symlink một cách nguyên tử khi deploy, và tar/gzip/xz/zstd với đủ cờ để không bao giờ phải tra lại — kèm số đo thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>Links and archives</h2>
<p class="lead">Two topics that look unrelated but share a root: both are about the difference between a <em>name</em> and the <em>thing</em> it names. Once you see that a filename is just a pointer, hard links stop being mysterious, <code>rm</code> stops being scary in the way you thought, and the reason a deploy can swap a whole application in one atomic step becomes obvious.</p>

<h3>A filename is not a file</h3>
${slide('lx-02', 21, 'Tên file chỉ là con trỏ: mục thư mục → inode → dữ liệu')}
<p>Lesson 1.4 introduced inodes. Here is the part that matters now: the directory entry and the file are two different objects.</p>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Directory entry</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">report.txt → inode 4021</span><span class="lz-nsub">A name in a directory, and a number. That is all a directory contains.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">backup.txt → inode 4021</span><span class="lz-nsub">A HARD LINK: a second name pointing at the very same inode. Neither name is "the original".</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">shortcut.txt → inode 4099</span><span class="lz-nsub">A SYMLINK: its own inode, whose content is the text "report.txt". Resolved at open time.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Inode 4021</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">metadata + link count = 2</span><span class="lz-nsub">Size, owner, permissions, timestamps, and pointers to the data blocks. No name lives here.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Data blocks</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">the actual bytes</span><span class="lz-nsub">Freed only when the link count reaches 0 AND no process still has the file open.</span></div></div>
  </div>
</div>

<pre><code class="language-bash">echo "hello" &gt; report.txt
ln    report.txt backup.txt      <span class="tok-comment"># hard link — a second NAME</span>
ln -s report.txt shortcut.txt    <span class="tok-comment"># symbolic link — a small file holding a PATH</span>
ls -li</code></pre>
<div class="out">4021 -rw-r--r-- 2 you you  6 Aug 22 10:14 backup.txt
4021 -rw-r--r-- 2 you you  6 Aug 22 10:14 report.txt
4099 lrwxrwxrwx 1 you you 10 Aug 22 10:14 shortcut.txt -> report.txt</div>
<p>Read the columns: <code>report.txt</code> and <code>backup.txt</code> share inode <strong>4021</strong> and both show a link count of <strong>2</strong>. <code>shortcut.txt</code> has its own inode, a size of 10 bytes (the length of the string <code>report.txt</code>), and type <code>l</code>.</p>

<h3>The consequences, one by one</h3>
${slide('lx-02', 22, 'Xoá tên gốc: hard link vẫn đọc được, symlink thành link treo')}
<pre><code class="language-bash">rm report.txt
cat backup.txt        <span class="tok-comment"># still works — link count went 2 → 1</span>
cat shortcut.txt      <span class="tok-comment"># BROKEN — its target name no longer exists</span></code></pre>
<div class="out">hello
cat: shortcut.txt: No such file or directory</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Hard link</span><span class="v">Indistinguishable from "the original" — there is no original. Deleting any one name leaves the data intact until the last name goes. Cannot cross filesystems (inode numbers are per-filesystem). Cannot point at a directory.</span></div>
  <div class="kv"><span class="k">Symlink</span><span class="v">A tiny file containing a path string. Can point anywhere — another disk, a directory, or nothing at all. Can dangle. Costs one inode.</span></div>
</div>
<div class="callout">This is also the honest explanation of what <code>rm</code> does. The system call is <code>unlink()</code>: it removes a <em>name</em> and decrements the count. The data disappears as a side effect of the last name disappearing — which is exactly why a deleted-but-still-open log file keeps consuming disk (Lesson 1.4), and why <code>mv</code> within one filesystem is instant (Lesson 2.1). One model, three behaviours you already met.</div>

<h3>Try it step by step: watch the inode with <code>stat</code></h3>
<p><code>ls -li</code> shows the inode; <code>stat</code> shows everything the inode holds, and a format string picks the fields. Run this in <code>~/thu-linux</code> on Ubuntu:</p>
<pre><code class="language-bash">echo "hello" &gt; report.txt; ln report.txt backup.txt; ln -s report.txt shortcut.txt
stat -c '%i %h %s %F %N' report.txt backup.txt shortcut.txt
rm report.txt
find . -xtype l                         <span class="tok-comment"># which symlinks now point at nothing?</span>
mkdir thu; ln thu thu2                  <span class="tok-comment"># a hard link to a directory?</span>
ln backup.txt /dev/shm/x.txt            <span class="tok-comment"># a hard link onto another filesystem?</span>
mkdir -p dem/a dem/b dem/c; stat -c '%h %n' dem dem/a</code></pre>
<div class="out">65857 2 6 regular file 'report.txt'
65857 2 6 regular file 'backup.txt'
65858 1 10 symbolic link 'shortcut.txt' -&gt; 'report.txt'
./shortcut.txt
ln: thu: hard link not allowed for directory
ln: failed to create hard link '/dev/shm/x.txt' =&gt; 'backup.txt': Invalid cross-device link
5 dem
2 dem/a</div>
<table>
<thead><tr><th>Format</th><th>Field</th><th>What the output tells you</th></tr></thead>
<tbody>
<tr><td><code>%i</code></td><td>inode number</td><td>Same number = same file, whatever the names</td></tr>
<tr><td><code>%h</code></td><td>hard link count</td><td>How many names point here; the data is freed at 0</td></tr>
<tr><td><code>%s</code> · <code>%F</code></td><td>size in bytes · file type</td><td>The symlink is 10 bytes: the length of the text <code>report.txt</code></td></tr>
<tr><td><code>%N</code></td><td>quoted name, with <code>-&gt;</code> target for links</td><td>Shows where a symlink points without following it</td></tr>
</tbody>
</table>
<p>The last line answers a question people rarely think to ask: why does a directory with three subdirectories have a link count of <strong>5</strong>? Because a directory is itself a name in its parent (1), it contains <code>.</code> pointing at itself (2), and each subdirectory's <code>..</code> points back at it (3 more). An empty directory therefore always shows 2. The two errors are the rules from the table above, stated by the kernel: no hard links to directories (they would let the tree loop), and none across filesystems (an inode number means nothing on another disk — <code>/dev/shm</code> is a separate in-memory filesystem).</p>

<h3>Relative versus absolute symlinks</h3>
<p>A symlink stores whatever path you gave it, verbatim. That choice decides whether it survives being moved:</p>
<pre><code>ln -s config.yml current.yml           <span class="tok-comment"># relative — resolved from the LINK's directory</span>
ln -s /etc/app/config.yml current.yml  <span class="tok-comment"># absolute — same target from anywhere</span>

ln -sr /etc/app/config.yml current.yml <span class="tok-comment"># -r: give an absolute path, store a relative one</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Relative</span><span class="v">Survives moving or copying the whole tree — a container image, a tarball, a chroot. Breaks if you move the link alone.</span></div>
  <div class="kv"><span class="k">Absolute</span><span class="v">Survives moving the link. Breaks the moment the tree is mounted somewhere else, which is every container and every backup restore.</span></div>
</div>
<p>Inside a project, prefer relative. For pointing at a fixed system path such as <code>/usr/share</code>, absolute is right.</p>

<h3>Reading and following links</h3>
<pre><code class="language-bash">readlink shortcut.txt        <span class="tok-comment"># the stored string, one level</span>
readlink -f shortcut.txt     <span class="tok-comment"># follow every level to the real path</span>
realpath shortcut.txt        <span class="tok-comment"># same idea, clearer name</span>
ls -l /usr/bin/python3       <span class="tok-comment"># see a real-world chain</span>
readlink -f /usr/bin/python3</code></pre>
<div class="out">python3 -> python3.12
/usr/bin/python3.12</div>
<p>Most commands follow symlinks by default. The exceptions matter: <code>rm shortcut.txt</code> removes the <em>link</em>, never the target — but <code>rm shortcut/</code>, with the trailing slash, follows into the directory. <code>cp</code> copies the target unless you pass <code>-P</code> (or <code>-a</code>, which implies it) to copy the link itself.</p>

<h3>Where you meet symlinks in real work</h3>
${slide('lx-02', 23, 'Deploy nguyên tử: ln -sfn rồi mv -T')}
<pre><code><span class="tok-comment"># Atomic deploy: build the new release beside the old one, then swap one pointer</span>
/srv/app/releases/2026-08-22-a1b2c3/
/srv/app/releases/2026-08-21-9f8e7d/
/srv/app/current -&gt; releases/2026-08-22-a1b2c3

ln -sfn releases/2026-08-22-a1b2c3 /srv/app/current-new
mv -T /srv/app/current-new /srv/app/current</code></pre>
<div class="callout ok">The two flags carry the whole trick. <code>-n</code> stops <code>ln</code> from following an existing symlink-to-directory and creating the new link <em>inside</em> it — the classic bug that produces <code>current/releases/...</code>. And <code>mv -T</code> performs a <code>rename()</code>, which the kernel guarantees is atomic: any process opening <code>current</code> sees either the old release or the new one, never a half-swapped state and never a missing path. Rollback is the same command with yesterday's directory. This is how Capistrano, Deployer and most hand-rolled deploy scripts work.</div>
<p>You will also meet symlinks in <code>/etc/alternatives</code> (how Debian switches between java or python versions), in <code>node_modules/.bin</code> (each entry links to the real script inside its package), and in <code>/etc/nginx/sites-enabled</code> (each file links back to one in <code>sites-available</code>, so enabling a site is creating a link and disabling it is removing one).</p>

<h3>Two traps, measured: a slash after a link, and ln without -n</h3>
<p>Both of these are one character long and both were run for real on Ubuntu 24.04. First, <code>lien</code> is a symlink to a directory <code>that/</code> holding <code>con/a.txt</code> and <code>b.txt</code>:</p>
<pre><code class="language-bash">rm lien/; echo "exit=$?"
rm -r lien/; echo "exit=$?"
ls -A that
ls -l lien</code></pre>
<div class="out">rm: cannot remove 'lien/': Is a directory
exit=1
rm: cannot remove 'lien/': Not a directory
exit=1
lrwxrwxrwx 1 cuong cuong 4 Sep 28 09:08 lien -&gt; that</div>
<p>Read it slowly: <code>rm -r lien/</code> reported an <em>error</em> — and still <strong>emptied the real directory</strong> <code>that/</code> (the <code>ls -A that</code> line prints nothing). The trailing slash made the path mean "the directory the link points to", so <code>rm -r</code> walked into it and deleted everything inside; only then did it fail to remove <code>lien/</code> itself, because a symlink is not a directory. The link survives, pointing at an empty folder. To remove a link, name it <em>without</em> a slash: <code>rm lien</code>. Tab-completion adds that slash for you, which is exactly how this happens.</p>
<p>Second, updating a symlink that points at a directory:</p>
<pre><code class="language-bash">ln -s rel/a cur
ln -sf rel/b cur                       <span class="tok-comment"># forgot -n</span>
ls -l rel/a
ln -sfn rel/b cur; ls -l cur           <span class="tok-comment"># with -n</span>
ln -sfn rel/b cur-new; mv cur-new cur  <span class="tok-comment"># forgot -T</span>
ls -l rel/a</code></pre>
<div class="out">total 0
lrwxrwxrwx 1 cuong cuong 5 Sep 28 08:47 b -&gt; rel/b
lrwxrwxrwx 1 cuong cuong 5 Sep 28 08:47 cur -&gt; rel/b
total 0
lrwxrwxrwx 1 cuong cuong 5 Sep 28 08:47 b -&gt; rel/b
lrwxrwxrwx 1 cuong cuong 5 Sep 28 08:47 cur-new -&gt; rel/b</div>
<p>Without <code>-n</code>, <code>ln</code> followed <code>cur</code> into <code>rel/a</code> and created a new (broken) link <em>inside</em> it, leaving <code>cur</code> unchanged. Without <code>-T</code>, <code>mv</code> did the same: it moved <code>cur-new</code> into the directory instead of replacing <code>cur</code>. Both commands "succeeded" with exit 0 — the deploy script prints green and the site still serves yesterday's release.</p>

<h3>tar: two ideas, not one</h3>
${slide('lx-02', 24, 'tar chỉ gói; nén là một chương trình khác')}
<p><code>tar</code> is short for <em>tape archive</em>, and its job is narrower than people assume: it concatenates many files into one stream, preserving names, permissions, ownership and timestamps. It does <strong>not</strong> compress. Compression is a separate program that <code>tar</code> pipes through for you:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Archive</span><span class="lz-t">many files → one .tar stream</span><span class="lz-d">tar's actual job. Metadata preserved: mode, owner, mtime, symlinks, directory structure.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Compress</span><span class="lz-t">.tar → .tar.gz / .tar.xz / .tar.zst</span><span class="lz-d">gzip, xz or zstd run on the whole stream. That is why tar compresses better than zip: it sees cross-file redundancy.</span></div>
</div>

<h3>The flags, and how to stop re-reading the man page</h3>
${slide('lx-02', 25, 'Bảng cờ tar')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-c</code> <code>-x</code> <code>-t</code></span><span class="v">Create · eXtract · lisT. Exactly one of these, always.</span></div>
  <div class="kv"><span class="k"><code>-f FILE</code></span><span class="v">The archive file. Must be immediately followed by the filename. Omit it and tar talks to stdin/stdout instead — which is a feature, see below.</span></div>
  <div class="kv"><span class="k"><code>-z</code> <code>-j</code> <code>-J</code> <code>--zstd</code></span><span class="v">gzip · bzip2 · xz · zstd. On GNU tar you can drop these entirely when extracting: it detects the format.</span></div>
  <div class="kv"><span class="k"><code>-v</code></span><span class="v">Verbose. Useful when creating, noisy when extracting a large archive.</span></div>
  <div class="kv"><span class="k"><code>-C DIR</code></span><span class="v">Change to DIR first. On extract it means "put it here"; on create it means "treat paths as relative to here".</span></div>
</div>
<pre><code class="language-bash">tar -czf backup.tar.gz ./project      <span class="tok-comment"># Create Zipped File</span>
tar -tzf backup.tar.gz | head         <span class="tok-comment"># lisT — ALWAYS do this first</span>
tar -xzf backup.tar.gz                <span class="tok-comment"># eXtract</span>
tar -xzf backup.tar.gz -C /srv/app    <span class="tok-comment"># extract somewhere specific</span>
tar -xzf backup.tar.gz --strip-components=1   <span class="tok-comment"># drop the top-level directory</span></code></pre>
<div class="out">./project/
./project/src/
./project/src/index.ts
./project/package.json</div>
<div class="callout"><strong>The mnemonic that sticks:</strong> <code>-czf</code> is "Create Zipped File", <code>-xzf</code> is "eXtract Zipped File", <code>-tzf</code> is "lisT Zipped File". The <code>f</code> is last because the filename follows it.</div>

<h3>--strip-components, and why every release tarball needs it</h3>
<p>Almost every project tarball unpacks into a versioned top directory: <code>node-v22.6.0-linux-x64/bin/node</code>. If you want the contents in <code>/usr/local</code> without that wrapper, strip one level:</p>
<pre><code class="language-bash">tar -xzf node-v22.6.0-linux-x64.tar.gz -C /usr/local --strip-components=1</code></pre>
<p>This single flag is why installation instructions in READMEs so often work in one line. It is also the flag people most often do not know exists, and instead extract-then-<code>mv</code>, which is two more chances to get a path wrong.</p>

<h3>tar without -f: streaming</h3>
<p>Leave off <code>-f</code> and tar writes to stdout or reads from stdin. That turns it into a plumbing component:</p>
<pre><code class="language-bash"><span class="tok-comment"># Copy a tree to another machine without a temporary file anywhere</span>
tar -cz ./project | ssh deploy@vps "tar -xz -C /srv"

<span class="tok-comment"># Copy preserving permissions and hard links, faster than cp -a on many small files</span>
tar -c -C /src . | tar -x -C /dst

<span class="tok-comment"># Look inside a Docker image's filesystem</span>
docker export my-container | tar -t | head -20</code></pre>
<p>The first line is worth internalising: no intermediate file means no disk space needed for the archive, and compression happens before the network rather than after.</p>

<h3>Which compressor, measured</h3>
${slide('lx-02', 26, 'Đo thật: gzip, bzip2, xz, zstd')}
<p>Same input every time — a 512 MB <code>node_modules</code> directory, on 8 cores:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>gzip</code> (-z)</span><span class="v">142 MB · 21 s to compress · 3.1 s to decompress. Universally available. The safe default when someone else must open it.</span></div>
  <div class="kv"><span class="k"><code>bzip2</code> (-j)</span><span class="v">128 MB · 96 s · 14 s. Superseded — slower than xz for worse ratios. Only for reading old archives.</span></div>
  <div class="kv"><span class="k"><code>xz</code> (-J)</span><span class="v">98 MB · 188 s · 6.4 s. Smallest. Use when you compress once and download many times, e.g. a release artefact.</span></div>
  <div class="kv"><span class="k"><code>zstd</code> (--zstd)</span><span class="v">134 MB · <strong>4.2 s</strong> · 1.1 s. With <code>-19</code>: 101 MB in 71 s. The best default in 2026 when you control both ends.</span></div>
</div>
<div class="callout ok">Rule of thumb: <strong>zstd</strong> for backups and anything internal, <strong>gzip</strong> for anything a stranger will open, <strong>xz</strong> for public downloads where bandwidth is the cost. Set <code>GZIP=-9</code> or use <code>-I 'zstd -19 -T0'</code> to tune levels; <code>-T0</code> tells zstd and xz to use every core, which is usually a 4-6× speedup they do not take by default.</div>

<h3>Measured again on the course machine (September 2026)</h3>
<p>The figures above come from a different machine and dataset. Re-measured on the course's Ubuntu 24.04 container (10 CPUs; gzip 1.12, bzip2, xz 5.4.5, zstd 1.5.5) with a real tree — <code>/usr</code> of the image, 4,330 files, a 156.3 MB tar. Compression time is <code>X -c usr.tar</code>, decompression is <code>X -dc</code>, both to <code>/dev/null</code>:</p>
<table>
<thead><tr><th>Compressor</th><th>Size</th><th>Compress</th><th>Decompress</th></tr></thead>
<tbody>
<tr><td><code>gzip</code> (<code>-z</code>)</td><td>44.2 MB</td><td>3.9 s</td><td>0.85 s</td></tr>
<tr><td><code>bzip2</code> (<code>-j</code>)</td><td>37.8 MB</td><td>7.9 s</td><td>2.7 s</td></tr>
<tr><td><code>xz</code> (<code>-J</code>)</td><td><strong>28.1 MB</strong></td><td>39.9 s</td><td>1.5 s</td></tr>
<tr><td><code>xz -T0</code></td><td>28.5 MB</td><td>12.4 s</td><td>—</td></tr>
<tr><td><code>zstd</code> (<code>--zstd</code>)</td><td>40.8 MB</td><td><strong>0.40 s</strong></td><td><strong>0.20 s</strong></td></tr>
<tr><td><code>zstd -T0</code></td><td>40.8 MB</td><td>0.13 s</td><td>—</td></tr>
<tr><td><code>zstd -19 -T0</code></td><td>31.7 MB</td><td>14.9 s</td><td>0.21 s</td></tr>
</tbody>
</table>
<p>The ranking matches the older table, and three things are worth taking away. zstd at its default level compresses about ten times faster than gzip <em>and</em> produces a smaller file. xz still wins on size, but is the slowest by far unless you add <code>-T0</code> — with xz 5.4.5 the default is still a single thread (39.9 s against 12.4 s here), which is why the rule of thumb below says to add it. And <code>zstd -19</code> gets close to xz's size while decompressing seven times faster, which is why many Linux distributions have moved their packages to zstd.</p>

<h3>Modern tar: <code>-a</code>, <code>--zstd</code>, <code>-t</code> before <code>-x</code>, and <code>-C</code></h3>
<p>GNU tar 1.35 (Ubuntu 24.04) no longer needs you to remember which letter means which compressor. Measured, with a small <code>project/</code> containing <code>src/</code>, <code>node_modules/</code>, <code>package.json</code> and a <code>.env</code>:</p>
<pre><code class="language-bash">tar -caf p.tar.zst project           <span class="tok-comment"># -a: pick the compressor from the suffix</span>
tar -caf p.tar.xz  project
file p.tar.zst p.tar.xz
tar -tvf p.tar.zst | head -3         <span class="tok-comment"># list, verbose: permissions, owner, size</span>
cat p.tar.zst | tar -tf -            <span class="tok-comment"># from a pipe there is no suffix to read</span>
cat p.tar.zst | tar --zstd -tf - | head -2
tar -czf p2.tar.gz --exclude=node_modules project
tar -tzf p2.tar.gz
tar -xzf p.tar.gz -O project/package.json   <span class="tok-comment"># -O: one file to stdout, nothing written</span></code></pre>
<div class="out">p.tar.zst: Zstandard compressed data (v0.8+), Dictionary ID: None
p.tar.xz:  XZ compressed data, checksum CRC64
drwxr-xr-x cuong/cuong       0 2026-09-28 08:47 project/
-rw-r--r-- cuong/cuong       9 2026-09-28 08:47 project/.env
drwxr-xr-x cuong/cuong       0 2026-09-28 08:47 project/node_modules/
tar: Archive is compressed. Use --zstd option
tar: Error is not recoverable: exiting now
project/
project/.env
project/
project/.env
project/src/
project/src/index.ts
project/package.json
{}</div>
${slide('lx-02', 27, 'Luôn -t trước -x: bom tar, dấu / ở đầu, file ẩn bị * bỏ sót')}
<p>Now the three things <code>-t</code> is for. Each was run for real:</p>
<pre><code class="language-bash">tar -tzf bomb.tar.gz                 <span class="tok-comment"># an archive made without a top directory</span>
tar -czf abs.tar.gz /etc/hostname    <span class="tok-comment"># an absolute path</span>
tar -tzf abs.tar.gz
cd project &amp;&amp; tar -czf ../star.tar.gz * &amp;&amp; cd ..
tar -tzf star.tar.gz                 <span class="tok-comment"># where is .env?</span>
tar -czf p3.tar.gz -C project .      <span class="tok-comment"># the directory, not a glob</span>
tar -tzf p3.tar.gz | head -2</code></pre>
<div class="out">src/
src/index.ts
package.json
.env
tar: Removing leading &#96;/' from member names
etc/hostname
node_modules/
node_modules/lib/
node_modules/lib/a.js
package.json
src/
src/index.ts
./
./.env</div>
<ul>
<li><strong>Tar bomb:</strong> no common top directory, so <code>tar -xf</code> would scatter four entries into whatever directory you are in. Extract such archives into a fresh box: <code>mkdir out &amp;&amp; tar -xf bomb.tar.gz -C out</code>.</li>
<li><strong>Leading <code>/</code>:</strong> GNU tar strips it and says so, so extraction lands under the current directory, not in <code>/etc</code>. The message scrolls past quickly; <code>-t</code> lets you see it first.</li>
<li><strong>The glob gap:</strong> <code>*</code> skipped <code>.env</code>, exactly as Lesson 2.2 predicts. <code>-C project .</code> archives the directory itself, dotfiles included.</li>
</ul>
<div class="callout danger"><strong>The flag-order trap:</strong> <code>-f</code> takes the <em>next word</em> as the archive name. <code>tar -cfz x.tar.gz project</code> therefore creates an archive called <code>z</code>, tries to add a file named <code>x.tar.gz</code>, and fails (measured: <code>tar: x.tar.gz: Cannot stat: No such file or directory</code>, exit 2, and a file <code>z</code> left behind). Keep <code>f</code> last in the cluster: <code>-czf</code>, <code>-caf</code>, <code>-tvf</code>.</div>

<h3>zip, for when the other end is Windows</h3>
<pre><code>zip -r archive.zip ./project      <span class="tok-comment"># -r is required for directories</span>
unzip -l archive.zip              <span class="tok-comment"># list — the -t equivalent</span>
unzip archive.zip -d /srv/app     <span class="tok-comment"># -d, not -C</span></code></pre>
<p><code>zip</code> compresses each file separately, so it loses the cross-file redundancy that makes <code>.tar.gz</code> smaller. It also stores no Unix permissions reliably and no ownership at all. Use it for interop, not for backups.</p>

<h3>Single-file compression</h3>
<pre><code>gzip big.log            <span class="tok-comment"># REPLACES it with big.log.gz — the original is gone</span>
gzip -k big.log         <span class="tok-comment"># -k keeps the original</span>
gunzip big.log.gz
zcat big.log.gz | grep ERROR    <span class="tok-comment"># read without decompressing to disk</span>
zless big.log.gz                <span class="tok-comment"># page through a compressed file</span>
zgrep -c ERROR big.log.gz       <span class="tok-comment"># grep straight into the archive</span></code></pre>
<p>The <code>z*</code> family (<code>zcat</code>, <code>zless</code>, <code>zgrep</code>, <code>zdiff</code>) exists precisely so that rotated logs stay searchable. There is no reason to decompress a 4 GB <code>.gz</code> just to grep it.</p>

<h3>On macOS: what is different</h3>
<p>Measured on macOS (BSD tools, bsdtar 3.5.3) in a scratch directory:</p>
<pre><code class="language-bash">ln -sr r.txt s2.txt
mv -T cur-new cur
mv -h cur-new cur; ls -l cur          <span class="tok-comment"># BSD: -h = do not follow a link to a directory</span>
ln r.txt h.txt
stat -f '%i %l %N' r.txt              <span class="tok-comment"># inode, link count, name</span>
readlink -f s.txt
tar --zstd -cf t.tar.zst app.log; tar -caf t2.tar.zst app.log; file t2.tar.zst</code></pre>
<div class="out">ln: illegal option -- r
usage: ln [-s [-F] | -L | -P] [-f | -i] [-hnv] source_file [target_file]
       ln [-s [-F] | -L | -P] [-f | -i] [-hnv] source_file ... target_dir
mv: illegal option -- T
usage: mv [-f | -i | -n] [-hv] source target
       mv [-f | -i | -n] [-v] source ... directory
lrwxr-xr-x@ 1 admin  wheel  5 Sep 28 15:41 cur -&gt; rel/b
61348302 2 r.txt
/private/tmp/…/mac/r.txt
t2.tar.zst: Zstandard compressed data (v0.8+), Dictionary ID: None</div>
<ul>
<li><strong>No <code>mv -T</code>, no <code>ln -r</code>.</strong> The atomic-swap recipe is a Linux-server recipe; on a Mac the equivalent is <code>mv -h</code>. Keep deploy scripts running on the VPS, not on your laptop.</li>
<li><strong><code>stat</code> speaks BSD:</strong> <code>-f</code> with <code>%i</code> (inode) and <code>%l</code> (link count) instead of GNU's <code>-c</code> with <code>%i</code>/<code>%h</code>.</li>
<li><strong>bsdtar understands the modern flags:</strong> <code>--zstd</code> and <code>-a</code> both worked, so <code>.tar.zst</code> archives move between your Mac and the VPS without trouble.</li>
<li><code>readlink -f</code> works on current macOS; very old macOS versions lacked it, which is why older scripts use <code>realpath</code> or Python instead.</li>
</ul>

<h3>🧪 Practice (15–20 min)</h3>
<div class="callout ok"><p><strong>Scenario:</strong> you are setting up deploys for your group project on the VPS. Build the <code>releases/</code> + <code>current</code> layout, ship a new release atomically, roll it back, and take a backup that provably contains the <code>.env</code>.</p><ol>
<li>Build two releases: <code>mkdir -p ~/thu-linux/c24 &amp;&amp; cd ~/thu-linux/c24 &amp;&amp; mkdir -p app/releases/2026-09-27 app/releases/2026-09-28</code>, then <code>echo 'phien ban cu' &gt; app/releases/2026-09-27/index.html; echo 'phien ban moi' &gt; app/releases/2026-09-28/index.html; echo 'DB_PASS=bi-mat' &gt; app/.env</code>.</li>
<li>Point <code>current</code> at the old release and read through it: <code>ln -sfn releases/2026-09-27 app/current; cat app/current/index.html</code>.</li>
<li>Ship atomically, then roll back — each is two commands: <code>ln -sfn releases/2026-09-28 app/current.new &amp;&amp; mv -T app/current.new app/current</code>, check with <code>readlink app/current; cat app/current/index.html</code>, then do the same with <code>2026-09-27</code>.</li>
<li>Back up the whole directory and prove the <code>.env</code> is inside before you trust it: <code>tar -caf app.tar.zst app</code>, <code>tar -tf app.tar.zst | grep -c '/\\.env$'</code>, and <code>tar -tvf app.tar.zst | grep current</code> to see that the link was stored as a link.</li>
<li>Restore into a fresh box and compare: <code>mkdir -p out &amp;&amp; tar -xf app.tar.zst -C out &amp;&amp; diff -r app out/app &amp;&amp; echo "giong het"</code>, then <code>readlink out/app/current</code>.</li></ol>
<div class="out">phien ban cu
releases/2026-09-28
phien ban moi
releases/2026-09-27
1
lrwxrwxrwx cuong/cuong       0 2026-09-28 09:09 app/current -&gt; releases/2026-09-27
giong het
releases/2026-09-27</div>
<p><strong>Done when:</strong> <code>readlink app/current</code> shows the release you chose at each step; the <code>grep -c</code> prints <code>1</code>; the archive listing shows <code>app/current -&gt; releases/…</code> (a link, not a copy of the release); <code>diff -r</code> prints nothing and you see <code>giong het</code>; and the restored <code>current</code> still points at <code>releases/2026-09-27</code> — a relative link, so it survived the move into <code>out/</code>.</p></div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Inode</span><span class="v">The file itself as the filesystem sees it: metadata plus pointers to data, identified by a number, with no name.</span></div>
  <div class="kv"><span class="k">Hard link</span><span class="v">An extra name for the same inode; the data lives until the last name is removed.</span></div>
  <div class="kv"><span class="k">Symbolic link (symlink)</span><span class="v">A tiny file whose content is a path, followed when opened; can point anywhere, including nowhere.</span></div>
  <div class="kv"><span class="k">Dangling link</span><span class="v">A symlink whose target no longer exists; find it with <code>find -xtype l</code>.</span></div>
  <div class="kv"><span class="k">Atomic</span><span class="v">Happening in one indivisible step — <code>rename()</code> via <code>mv -T</code> is never seen half-done.</span></div>
  <div class="kv"><span class="k">Archive</span><span class="v">Many files packed into one stream with their names and metadata (what <code>tar</code> makes).</span></div>
  <div class="kv"><span class="k">Compression level</span><span class="v">How hard the compressor works, trading time for size: <code>zstd -19</code>, <code>xz -9</code>.</span></div>
  <div class="kv"><span class="k">Tar bomb</span><span class="v">An archive with no common top directory that sprays files into wherever you extract it.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>A directory entry maps a name to an inode; hard links are extra names, symlinks are small files holding a path.</li>
<li><code>stat -c '%i %h'</code> shows inode and link count; hard links cannot point at directories or cross filesystems, and <code>find -xtype l</code> finds broken symlinks.</li>
<li>Remove a link without a trailing slash — <code>rm -r link/</code> empties the real directory — and update directory links with <code>ln -sfn</code> + <code>mv -T</code>.</li>
<li><code>tar</code> packs; the compressor is separate: <code>-a</code> chooses by suffix, <code>--zstd</code>/<code>-J</code>/<code>-z</code> by name, and a pipe needs the flag spelled out.</li>
<li>Measured: zstd compresses about 10× faster than gzip and smaller; xz is smallest but needs <code>-T0</code>; bzip2 is only for reading old archives.</li>
<li>Always <code>tar -t</code> before <code>-x</code>, extract unknown archives with <code>-C</code> into a fresh directory, archive with <code>-C dir .</code> so dotfiles are included, and keep <code>f</code> last in the flag cluster.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/tar/manual/tar.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU tar Manual</span><span class="lc-sub">The "Choosing Files" and "Changing Directories" chapters cover <code>--strip-components</code>, <code>--exclude</code> and <code>-C</code> properly — the three things worth knowing beyond czf/xzf.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/symlink.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">symlink(7) — how the kernel resolves links</span><span class="lc-sub">Which system calls follow links and which do not, laid out in a table. This is the page that settles arguments.</span></span>
</a>
<a class="link-card" href="https://github.com/facebook/zstd" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">zstd — benchmarks and level guide</span><span class="lc-sub">The README's comparison table shows why zstd replaced gzip as the sensible default, with numbers you can reproduce.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Practice: links, atomic swaps, and archives</span><span class="lc-sub">Build a releases/current deploy layout, swap it atomically, then pack and restore it while preserving permissions.</span></span>
</a>

<div class="pitfall"><strong>Trap:</strong> <code>tar -czf backup.tar.gz *</code> silently omits every dotfile — <code>.env</code>, <code>.gitignore</code>, <code>.github/</code> — because the shell expands the <code>*</code> before tar ever runs, and globs skip leading dots (Lesson 2.2). The archive looks fine, lists fine, and restores an application that will not start. Archive the <em>directory</em> instead: <code>tar -czf backup.tar.gz ./project</code>, or from inside it, <code>tar -czf ../backup.tar.gz .</code> — the single dot is a path, not a glob, so nothing is skipped.</div>
<p class="note-ct"><strong>Always list before you extract.</strong> <code>tar -tzf archive.tar.gz | head</code> costs one second and tells you whether the archive contains <code>project/…</code> or four hundred loose files that are about to spray across your current directory — the "tar bomb". While you are there, check for a leading <code>/</code>: GNU tar strips it and warns, but the warning scrolls past, and an archive built with <code>-P</code> genuinely can write to absolute paths.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Liên kết và kho nén</h2>
<p class="lead">Hai chủ đề trông chẳng liên quan nhưng chung một gốc: cả hai đều nói về khác biệt giữa một <em>CÁI TÊN</em> và <em>THỨ</em> mà nó gọi tên. Khi bạn thấy được rằng tên file chỉ là một con trỏ, liên kết cứng thôi bí ẩn, <code>rm</code> thôi đáng sợ theo cái kiểu bạn từng nghĩ, và lý do một lần deploy có thể tráo cả ứng dụng trong đúng một bước nguyên tử trở nên hiển nhiên.</p>

<h3>Tên file không phải là file</h3>
${slide('lx-02', 21, 'Tên file chỉ là con trỏ: mục thư mục → inode → dữ liệu')}
<p>Bài 1.4 đã giới thiệu inode. Đây là phần quan trọng lúc này: mục thư mục và file là hai đối tượng KHÁC NHAU.</p>

<div class="lz-map">
  <div class="lz-stage">
    <span class="lz-badge">Mục thư mục</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">report.txt → inode 4021</span><span class="lz-nsub">Một cái tên trong một thư mục, và một con số. Thư mục chỉ chứa có thế.</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">backup.txt → inode 4021</span><span class="lz-nsub">LIÊN KẾT CỨNG: một cái tên thứ hai trỏ vào đúng cùng một inode. Không cái tên nào là "bản gốc".</span></div></div>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">shortcut.txt → inode 4099</span><span class="lz-nsub">LIÊN KẾT TƯỢNG TRƯNG: có inode riêng, nội dung là dòng chữ "report.txt". Được giải khi mở file.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Inode 4021</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">siêu dữ liệu + số liên kết = 2</span><span class="lz-nsub">Kích thước, chủ sở hữu, quyền, dấu thời gian, và con trỏ tới các khối dữ liệu. KHÔNG có cái tên nào ở đây.</span></div></div>
  </div>
  <div class="lz-stage">
    <span class="lz-badge">Khối dữ liệu</span>
    <div class="lz-node"><div class="lz-nbody"><span class="lz-ntitle">các byte thật sự</span><span class="lz-nsub">Chỉ được giải phóng khi số liên kết về 0 VÀ không tiến trình nào còn mở file.</span></div></div>
  </div>
</div>

<pre><code class="language-bash">echo "hello" &gt; report.txt
ln    report.txt backup.txt      <span class="tok-comment"># liên kết cứng — một cái TÊN thứ hai</span>
ln -s report.txt shortcut.txt    <span class="tok-comment"># liên kết tượng trưng — một file nhỏ chứa một ĐƯỜNG DẪN</span>
ls -li</code></pre>
<div class="out">4021 -rw-r--r-- 2 you you  6 Aug 22 10:14 backup.txt
4021 -rw-r--r-- 2 you you  6 Aug 22 10:14 report.txt
4099 lrwxrwxrwx 1 you you 10 Aug 22 10:14 shortcut.txt -> report.txt</div>
<p>Hãy đọc các cột: <code>report.txt</code> và <code>backup.txt</code> dùng chung inode <strong>4021</strong> và cả hai đều hiện số liên kết là <strong>2</strong>. <code>shortcut.txt</code> có inode riêng, kích thước 10 byte (đúng bằng độ dài chuỗi <code>report.txt</code>), và loại <code>l</code>.</p>

<h3>Các hệ quả, từng cái một</h3>
${slide('lx-02', 22, 'Xoá tên gốc: hard link vẫn đọc được, symlink thành link treo')}
<pre><code class="language-bash">rm report.txt
cat backup.txt        <span class="tok-comment"># vẫn chạy — số liên kết đi từ 2 xuống 1</span>
cat shortcut.txt      <span class="tok-comment"># HỎNG — cái tên nó trỏ tới không còn nữa</span></code></pre>
<div class="out">hello
cat: shortcut.txt: No such file or directory</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Liên kết cứng</span><span class="v">Không phân biệt được với "bản gốc" — vì không có bản gốc. Xoá bất kỳ cái tên nào thì dữ liệu vẫn nguyên cho tới khi cái tên cuối cùng biến mất. Không vượt được sang hệ thống file khác (số inode chỉ có nghĩa trong một hệ thống file). Không trỏ vào thư mục được.</span></div>
  <div class="kv"><span class="k">Liên kết tượng trưng</span><span class="v">Một file tí hon chứa một chuỗi đường dẫn. Trỏ đi đâu cũng được — sang đĩa khác, vào thư mục, hoặc vào hư không. Có thể trỏ hụt. Tốn một inode.</span></div>
</div>
<div class="callout">Đây cũng là lời giải thích trung thực về việc <code>rm</code> làm gì. Lời gọi hệ thống là <code>unlink()</code>: nó gỡ một <em>CÁI TÊN</em> và giảm số đếm đi một. Dữ liệu biến mất chỉ như một hệ quả phụ của việc cái tên cuối cùng biến mất — và đó chính xác là lý do một file log đã xoá nhưng còn được mở vẫn ăn đĩa (Bài 1.4), và lý do <code>mv</code> trong cùng một hệ thống file là tức thì (Bài 2.1). Một mô hình, ba hành vi bạn đã gặp.</div>

<h3>Chạy thử từng bước: nhìn inode bằng <code>stat</code></h3>
<p><code>ls -li</code> cho thấy số inode; <code>stat</code> cho thấy mọi thứ inode đang giữ, và một chuỗi định dạng chọn ra những trường bạn cần. Chạy trong <code>~/thu-linux</code> trên Ubuntu:</p>
<pre><code class="language-bash">echo "hello" &gt; report.txt; ln report.txt backup.txt; ln -s report.txt shortcut.txt
stat -c '%i %h %s %F %N' report.txt backup.txt shortcut.txt
rm report.txt
find . -xtype l                         <span class="tok-comment"># symlink nào giờ trỏ vào hư không?</span>
mkdir thu; ln thu thu2                  <span class="tok-comment"># liên kết cứng tới một thư mục?</span>
ln backup.txt /dev/shm/x.txt            <span class="tok-comment"># liên kết cứng sang hệ thống file khác?</span>
mkdir -p dem/a dem/b dem/c; stat -c '%h %n' dem dem/a</code></pre>
<div class="out">65857 2 6 regular file 'report.txt'
65857 2 6 regular file 'backup.txt'
65858 1 10 symbolic link 'shortcut.txt' -&gt; 'report.txt'
./shortcut.txt
ln: thu: hard link not allowed for directory
ln: failed to create hard link '/dev/shm/x.txt' =&gt; 'backup.txt': Invalid cross-device link
5 dem
2 dem/a</div>
<table>
<thead><tr><th>Định dạng</th><th>Trường</th><th>Output nói gì với bạn</th></tr></thead>
<tbody>
<tr><td><code>%i</code></td><td>số inode</td><td>Cùng số = cùng một file, bất kể tên là gì</td></tr>
<tr><td><code>%h</code></td><td>số liên kết cứng</td><td>Có bao nhiêu cái tên trỏ vào đây; dữ liệu được giải phóng khi về 0</td></tr>
<tr><td><code>%s</code> · <code>%F</code></td><td>kích thước tính bằng byte · loại file</td><td>Symlink nặng 10 byte: đúng độ dài dòng chữ <code>report.txt</code></td></tr>
<tr><td><code>%N</code></td><td>tên trong nháy, kèm <code>-&gt;</code> đích với liên kết</td><td>Cho thấy symlink trỏ đi đâu mà không đi theo nó</td></tr>
</tbody>
</table>
<p>Dòng cuối trả lời một câu người ta hiếm khi nghĩ tới việc hỏi: vì sao một thư mục có ba thư mục con lại có số liên kết là <strong>5</strong>? Vì bản thân thư mục là một cái tên trong thư mục cha (1), nó chứa <code>.</code> trỏ về chính nó (2), và <code>..</code> của mỗi thư mục con trỏ ngược về nó (thêm 3). Vì thế một thư mục rỗng luôn hiện 2. Hai lỗi kia là đúng những luật trong bảng phía trên, do chính nhân nói ra: không có liên kết cứng tới thư mục (nếu có, cây thư mục có thể lặp vòng), và không có liên kết cứng xuyên hệ thống file (số inode vô nghĩa trên một đĩa khác — <code>/dev/shm</code> là một hệ thống file riêng nằm trong RAM).</p>

<h3>Liên kết tương đối so với tuyệt đối</h3>
<p>Một symlink lưu đúng nguyên văn đường dẫn bạn đưa cho nó. Lựa chọn đó quyết định nó có sống sót khi bị di chuyển hay không:</p>
<pre><code>ln -s config.yml current.yml           <span class="tok-comment"># tương đối — giải từ thư mục của CHÍNH LIÊN KẾT</span>
ln -s /etc/app/config.yml current.yml  <span class="tok-comment"># tuyệt đối — cùng một đích từ bất cứ đâu</span>

ln -sr /etc/app/config.yml current.yml <span class="tok-comment"># -r: đưa đường dẫn tuyệt đối, lưu ra đường dẫn tương đối</span></code></pre>
<div class="kv-grid">
  <div class="kv"><span class="k">Tương đối</span><span class="v">Sống sót khi cả cây bị di chuyển hoặc sao chép — một ảnh container, một file tar, một chroot. Hỏng nếu bạn chỉ di chuyển riêng cái liên kết.</span></div>
  <div class="kv"><span class="k">Tuyệt đối</span><span class="v">Sống sót khi di chuyển cái liên kết. Hỏng ngay khi cả cây được gắn ở chỗ khác — tức là mọi container và mọi lần khôi phục sao lưu.</span></div>
</div>
<p>Bên trong một dự án, hãy ưu tiên tương đối. Để trỏ tới một đường dẫn hệ thống cố định như <code>/usr/share</code> thì tuyệt đối mới đúng.</p>

<h3>Đọc và đi theo liên kết</h3>
<pre><code class="language-bash">readlink shortcut.txt        <span class="tok-comment"># chuỗi đã lưu, đúng một tầng</span>
readlink -f shortcut.txt     <span class="tok-comment"># đi theo mọi tầng tới đường dẫn thật</span>
realpath shortcut.txt        <span class="tok-comment"># cùng ý tưởng, tên rõ hơn</span>
ls -l /usr/bin/python3       <span class="tok-comment"># xem một chuỗi liên kết ngoài đời</span>
readlink -f /usr/bin/python3</code></pre>
<div class="out">python3 -> python3.12
/usr/bin/python3.12</div>
<p>Hầu hết lệnh đi theo symlink theo mặc định. Những ngoại lệ mới đáng nhớ: <code>rm shortcut.txt</code> gỡ <em>CÁI LIÊN KẾT</em>, không bao giờ gỡ đích — nhưng <code>rm shortcut/</code>, có dấu gạch chéo cuối, lại đi vào trong thư mục. <code>cp</code> chép ĐÍCH trừ khi bạn thêm <code>-P</code> (hoặc <code>-a</code>, vốn đã bao hàm nó) để chép chính cái liên kết.</p>

<h3>Bạn gặp symlink ở đâu trong công việc thật</h3>
${slide('lx-02', 23, 'Deploy nguyên tử: ln -sfn rồi mv -T')}
<pre><code><span class="tok-comment"># Deploy nguyên tử: dựng bản mới cạnh bản cũ, rồi tráo đúng một con trỏ</span>
/srv/app/releases/2026-08-22-a1b2c3/
/srv/app/releases/2026-08-21-9f8e7d/
/srv/app/current -&gt; releases/2026-08-22-a1b2c3

ln -sfn releases/2026-08-22-a1b2c3 /srv/app/current-new
mv -T /srv/app/current-new /srv/app/current</code></pre>
<div class="callout ok">Hai cái cờ đó gánh toàn bộ mẹo này. <code>-n</code> ngăn <code>ln</code> đi theo một symlink-trỏ-vào-thư-mục đang tồn tại rồi tạo liên kết mới <em>BÊN TRONG</em> nó — lỗi kinh điển sinh ra <code>current/releases/...</code>. Còn <code>mv -T</code> thực hiện một <code>rename()</code>, thứ mà nhân bảo đảm là nguyên tử: bất kỳ tiến trình nào mở <code>current</code> đều thấy hoặc bản cũ hoặc bản mới, không bao giờ thấy trạng thái tráo dở, và không bao giờ thấy đường dẫn biến mất. Quay lui chính là lệnh đó với thư mục của hôm qua. Capistrano, Deployer và phần lớn script deploy tự viết đều chạy theo cách này.</div>
<p>Bạn cũng sẽ gặp symlink trong <code>/etc/alternatives</code> (cách Debian chuyển giữa các phiên bản java hay python), trong <code>node_modules/.bin</code> (mỗi mục liên kết tới script thật bên trong gói của nó), và trong <code>/etc/nginx/sites-enabled</code> (mỗi file liên kết ngược về một file trong <code>sites-available</code>, nên bật một site là tạo một liên kết còn tắt nó là gỡ liên kết đi).</p>

<h3>Hai cái bẫy, đo thật: dấu gạch chéo sau một link, và ln thiếu -n</h3>
<p>Cả hai đều chỉ dài một ký tự, và cả hai đều đã chạy thật trên Ubuntu 24.04. Trước hết, <code>lien</code> là một symlink trỏ tới thư mục <code>that/</code> chứa <code>con/a.txt</code> và <code>b.txt</code>:</p>
<pre><code class="language-bash">rm lien/; echo "exit=$?"
rm -r lien/; echo "exit=$?"
ls -A that
ls -l lien</code></pre>
<div class="out">rm: cannot remove 'lien/': Is a directory
exit=1
rm: cannot remove 'lien/': Not a directory
exit=1
lrwxrwxrwx 1 cuong cuong 4 Sep 28 09:08 lien -&gt; that</div>
<p>Đọc chậm thôi: <code>rm -r lien/</code> báo <em>LỖI</em> — mà vẫn <strong>xoá sạch thư mục thật</strong> <code>that/</code> (dòng <code>ls -A that</code> không in gì). Dấu gạch chéo cuối làm đường dẫn mang nghĩa "thư mục mà link trỏ tới", nên <code>rm -r</code> đi vào trong và xoá mọi thứ bên trong đó; chỉ tới lúc ấy nó mới thất bại khi gỡ chính <code>lien/</code>, vì symlink không phải thư mục. Cái link sống sót, trỏ vào một thư mục rỗng. Muốn gỡ một link thì gọi tên nó <em>KHÔNG</em> có gạch chéo: <code>rm lien</code>. Phím Tab tự điền thêm dấu gạch chéo đó cho bạn — và đó đúng là cách chuyện này xảy ra.</p>
<p>Thứ hai, cập nhật một symlink đang trỏ vào thư mục:</p>
<pre><code class="language-bash">ln -s rel/a cur
ln -sf rel/b cur                       <span class="tok-comment"># quên -n</span>
ls -l rel/a
ln -sfn rel/b cur; ls -l cur           <span class="tok-comment"># có -n</span>
ln -sfn rel/b cur-new; mv cur-new cur  <span class="tok-comment"># quên -T</span>
ls -l rel/a</code></pre>
<div class="out">total 0
lrwxrwxrwx 1 cuong cuong 5 Sep 28 08:47 b -&gt; rel/b
lrwxrwxrwx 1 cuong cuong 5 Sep 28 08:47 cur -&gt; rel/b
total 0
lrwxrwxrwx 1 cuong cuong 5 Sep 28 08:47 b -&gt; rel/b
lrwxrwxrwx 1 cuong cuong 5 Sep 28 08:47 cur-new -&gt; rel/b</div>
<p>Thiếu <code>-n</code>, <code>ln</code> đi theo <code>cur</code> vào <code>rel/a</code> rồi tạo một link mới (hỏng) <em>BÊN TRONG</em> đó, để nguyên <code>cur</code>. Thiếu <code>-T</code>, <code>mv</code> cũng y vậy: nó chuyển <code>cur-new</code> vào trong thư mục thay vì thay thế <code>cur</code>. Cả hai lệnh đều "thành công" với mã 0 — script deploy in chữ xanh còn trang web vẫn phục vụ bản phát hành của hôm qua.</p>

<h3>tar: hai ý tưởng, không phải một</h3>
${slide('lx-02', 24, 'tar chỉ gói; nén là một chương trình khác')}
<p><code>tar</code> viết tắt của <em>tape archive</em>, và việc của nó hẹp hơn người ta tưởng: nó nối nhiều file thành một dòng duy nhất, giữ nguyên tên, quyền, chủ sở hữu và dấu thời gian. Nó <strong>KHÔNG</strong> nén. Nén là một chương trình riêng mà <code>tar</code> đưa dòng đó chảy qua giúp bạn:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-k">1 · Gói</span><span class="lz-t">nhiều file → một dòng .tar</span><span class="lz-d">Đây mới là việc thật của tar. Siêu dữ liệu được giữ: quyền, chủ, mtime, symlink, cấu trúc thư mục.</span></div>
  <div class="lz-step"><span class="lz-k">2 · Nén</span><span class="lz-t">.tar → .tar.gz / .tar.xz / .tar.zst</span><span class="lz-d">gzip, xz hoặc zstd chạy trên TOÀN BỘ dòng. Đó là lý do tar nén tốt hơn zip: nó nhìn thấy phần trùng lặp GIỮA các file.</span></div>
</div>

<h3>Các cờ, và cách thôi phải đọc lại trang man</h3>
${slide('lx-02', 25, 'Bảng cờ tar')}
<div class="kv-grid">
  <div class="kv"><span class="k"><code>-c</code> <code>-x</code> <code>-t</code></span><span class="v">Create (tạo) · eXtract (bung) · lisT (liệt kê). Luôn có đúng một trong ba.</span></div>
  <div class="kv"><span class="k"><code>-f FILE</code></span><span class="v">File kho nén. Phải đứng ngay trước tên file. Bỏ nó đi thì tar nói chuyện với stdin/stdout — mà đó lại là một tính năng, xem bên dưới.</span></div>
  <div class="kv"><span class="k"><code>-z</code> <code>-j</code> <code>-J</code> <code>--zstd</code></span><span class="v">gzip · bzip2 · xz · zstd. Với tar của GNU, lúc bung bạn bỏ hẳn các cờ này cũng được: nó tự nhận ra định dạng.</span></div>
  <div class="kv"><span class="k"><code>-v</code></span><span class="v">Chi tiết. Hữu ích lúc tạo, ồn ào lúc bung một kho lớn.</span></div>
  <div class="kv"><span class="k"><code>-C DIR</code></span><span class="v">Chuyển sang DIR trước đã. Lúc bung nó nghĩa là "để vào đây"; lúc tạo nó nghĩa là "coi các đường dẫn là tương đối với chỗ này".</span></div>
</div>
<pre><code class="language-bash">tar -czf backup.tar.gz ./project      <span class="tok-comment"># Create Zipped File</span>
tar -tzf backup.tar.gz | head         <span class="tok-comment"># lisT — LUÔN làm việc này trước</span>
tar -xzf backup.tar.gz                <span class="tok-comment"># eXtract</span>
tar -xzf backup.tar.gz -C /srv/app    <span class="tok-comment"># bung vào một chỗ cụ thể</span>
tar -xzf backup.tar.gz --strip-components=1   <span class="tok-comment"># bỏ đi thư mục bọc ngoài cùng</span></code></pre>
<div class="out">./project/
./project/src/
./project/src/index.ts
./project/package.json</div>
<div class="callout"><strong>Cách nhớ dính chặt:</strong> <code>-czf</code> là "Create Zipped File", <code>-xzf</code> là "eXtract Zipped File", <code>-tzf</code> là "lisT Zipped File". Chữ <code>f</code> đứng cuối vì tên file đi ngay sau nó.</div>

<h3>--strip-components, và vì sao mọi bản phát hành dạng tar đều cần nó</h3>
<p>Gần như mọi file tar của dự án đều bung ra thành một thư mục có số phiên bản ở ngoài cùng: <code>node-v22.6.0-linux-x64/bin/node</code>. Nếu bạn muốn nội dung nằm thẳng trong <code>/usr/local</code> mà không có lớp bọc đó, hãy lột đi một tầng:</p>
<pre><code class="language-bash">tar -xzf node-v22.6.0-linux-x64.tar.gz -C /usr/local --strip-components=1</code></pre>
<p>Đúng một cái cờ này là lý do hướng dẫn cài đặt trong các file README thường chạy được chỉ trong một dòng. Nó cũng là cái cờ mà người ta hay không biết là có tồn tại nhất, và thay vào đó họ bung-rồi-<code>mv</code>, tức là thêm hai cơ hội nữa để gõ sai đường dẫn.</p>

<h3>tar không có -f: chảy thành dòng</h3>
<p>Bỏ <code>-f</code> đi thì tar ghi ra stdout hoặc đọc từ stdin. Điều đó biến nó thành một mắt xích đường ống:</p>
<pre><code class="language-bash"><span class="tok-comment"># Chép cả cây sang máy khác mà không cần file tạm ở bất cứ đâu</span>
tar -cz ./project | ssh deploy@vps "tar -xz -C /srv"

<span class="tok-comment"># Chép mà vẫn giữ quyền và liên kết cứng, nhanh hơn cp -a với nhiều file nhỏ</span>
tar -c -C /src . | tar -x -C /dst

<span class="tok-comment"># Nhìn vào bên trong hệ thống file của một ảnh Docker</span>
docker export my-container | tar -t | head -20</code></pre>
<p>Dòng đầu tiên đáng thấm: không có file trung gian nghĩa là không cần chỗ trống trên đĩa cho kho nén, và việc nén xảy ra TRƯỚC khi qua mạng chứ không phải sau.</p>

<h3>Chọn bộ nén nào, đo thật</h3>
${slide('lx-02', 26, 'Đo thật: gzip, bzip2, xz, zstd')}
<p>Cùng một đầu vào mỗi lần — một thư mục <code>node_modules</code> 512 MB, trên 8 nhân:</p>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>gzip</code> (-z)</span><span class="v">142 MB · nén 21 giây · bung 3,1 giây. Có ở khắp mọi nơi. Mặc định an toàn khi người khác phải mở nó.</span></div>
  <div class="kv"><span class="k"><code>bzip2</code> (-j)</span><span class="v">128 MB · 96 giây · 14 giây. Đã bị vượt qua — chậm hơn xz mà tỉ lệ lại tệ hơn. Chỉ dùng để đọc kho cũ.</span></div>
  <div class="kv"><span class="k"><code>xz</code> (-J)</span><span class="v">98 MB · 188 giây · 6,4 giây. Nhỏ nhất. Dùng khi nén một lần và tải về nhiều lần, ví dụ một bản phát hành.</span></div>
  <div class="kv"><span class="k"><code>zstd</code> (--zstd)</span><span class="v">134 MB · <strong>4,2 giây</strong> · 1,1 giây. Với <code>-19</code>: 101 MB trong 71 giây. Mặc định tốt nhất năm 2026 khi bạn nắm cả hai đầu.</span></div>
</div>
<div class="callout ok">Quy tắc bỏ túi: <strong>zstd</strong> cho sao lưu và mọi thứ nội bộ, <strong>gzip</strong> cho thứ người lạ sẽ mở, <strong>xz</strong> cho bản tải công khai nơi băng thông mới là chi phí. Đặt <code>GZIP=-9</code> hoặc dùng <code>-I 'zstd -19 -T0'</code> để chỉnh mức nén; <code>-T0</code> bảo zstd và xz dùng mọi nhân, thường nhanh gấp 4-6 lần, thứ mà mặc định chúng không tự làm.</div>

<h3>Đo lại trên máy của khoá (tháng 9/2026)</h3>
<p>Các con số phía trên đến từ một máy và một bộ dữ liệu khác. Đo lại trên container Ubuntu 24.04 của khoá (10 CPU; gzip 1.12, bzip2, xz 5.4.5, zstd 1.5.5) với một cây thư mục thật — <code>/usr</code> của ảnh, 4.330 file, file tar 156,3 MB. Thời gian nén là <code>X -c usr.tar</code>, giải nén là <code>X -dc</code>, cả hai đổ vào <code>/dev/null</code>:</p>
<table>
<thead><tr><th>Bộ nén</th><th>Kích thước</th><th>Nén</th><th>Giải nén</th></tr></thead>
<tbody>
<tr><td><code>gzip</code> (<code>-z</code>)</td><td>44,2 MB</td><td>3,9 s</td><td>0,85 s</td></tr>
<tr><td><code>bzip2</code> (<code>-j</code>)</td><td>37,8 MB</td><td>7,9 s</td><td>2,7 s</td></tr>
<tr><td><code>xz</code> (<code>-J</code>)</td><td><strong>28,1 MB</strong></td><td>39,9 s</td><td>1,5 s</td></tr>
<tr><td><code>xz -T0</code></td><td>28,5 MB</td><td>12,4 s</td><td>—</td></tr>
<tr><td><code>zstd</code> (<code>--zstd</code>)</td><td>40,8 MB</td><td><strong>0,40 s</strong></td><td><strong>0,20 s</strong></td></tr>
<tr><td><code>zstd -T0</code></td><td>40,8 MB</td><td>0,13 s</td><td>—</td></tr>
<tr><td><code>zstd -19 -T0</code></td><td>31,7 MB</td><td>14,9 s</td><td>0,21 s</td></tr>
</tbody>
</table>
<p>Thứ hạng khớp với bảng cũ, và có ba điều đáng mang theo. zstd ở mức mặc định nén nhanh hơn gzip khoảng mười lần <em>MÀ</em> file còn nhỏ hơn. xz vẫn thắng về kích thước, nhưng chậm nhất một cách áp đảo nếu không thêm <code>-T0</code> — với xz 5.4.5, mặc định vẫn là một luồng (39,9 s so với 12,4 s ở đây), và đó là lý do quy tắc bỏ túi phía dưới bảo thêm nó vào. Còn <code>zstd -19</code> nén gần nhỏ bằng xz mà giải nén nhanh hơn bảy lần — lý do nhiều bản phân phối Linux đã chuyển gói phần mềm của họ sang zstd.</p>

<h3>tar đời mới: <code>-a</code>, <code>--zstd</code>, <code>-t</code> trước <code>-x</code>, và <code>-C</code></h3>
<p>GNU tar 1.35 (Ubuntu 24.04) không còn bắt bạn nhớ chữ cái nào ứng với bộ nén nào. Đo thật, với một <code>project/</code> nhỏ gồm <code>src/</code>, <code>node_modules/</code>, <code>package.json</code> và một <code>.env</code>:</p>
<pre><code class="language-bash">tar -caf p.tar.zst project           <span class="tok-comment"># -a: chọn bộ nén theo đuôi file</span>
tar -caf p.tar.xz  project
file p.tar.zst p.tar.xz
tar -tvf p.tar.zst | head -3         <span class="tok-comment"># liệt kê chi tiết: quyền, chủ, cỡ</span>
cat p.tar.zst | tar -tf -            <span class="tok-comment"># đọc từ ống dẫn thì không có đuôi nào để đoán</span>
cat p.tar.zst | tar --zstd -tf - | head -2
tar -czf p2.tar.gz --exclude=node_modules project
tar -tzf p2.tar.gz
tar -xzf p.tar.gz -O project/package.json   <span class="tok-comment"># -O: một file ra stdout, không ghi gì xuống đĩa</span></code></pre>
<div class="out">p.tar.zst: Zstandard compressed data (v0.8+), Dictionary ID: None
p.tar.xz:  XZ compressed data, checksum CRC64
drwxr-xr-x cuong/cuong       0 2026-09-28 08:47 project/
-rw-r--r-- cuong/cuong       9 2026-09-28 08:47 project/.env
drwxr-xr-x cuong/cuong       0 2026-09-28 08:47 project/node_modules/
tar: Archive is compressed. Use --zstd option
tar: Error is not recoverable: exiting now
project/
project/.env
project/
project/.env
project/src/
project/src/index.ts
project/package.json
{}</div>
${slide('lx-02', 27, 'Luôn -t trước -x: bom tar, dấu / ở đầu, file ẩn bị * bỏ sót')}
<p>Giờ là ba việc mà <code>-t</code> sinh ra để làm. Từng cái đều đã chạy thật:</p>
<pre><code class="language-bash">tar -tzf bomb.tar.gz                 <span class="tok-comment"># một kho nén dựng mà không có thư mục bọc ngoài</span>
tar -czf abs.tar.gz /etc/hostname    <span class="tok-comment"># một đường dẫn tuyệt đối</span>
tar -tzf abs.tar.gz
cd project &amp;&amp; tar -czf ../star.tar.gz * &amp;&amp; cd ..
tar -tzf star.tar.gz                 <span class="tok-comment"># .env đâu?</span>
tar -czf p3.tar.gz -C project .      <span class="tok-comment"># cả thư mục, không phải glob</span>
tar -tzf p3.tar.gz | head -2</code></pre>
<div class="out">src/
src/index.ts
package.json
.env
tar: Removing leading &#96;/' from member names
etc/hostname
node_modules/
node_modules/lib/
node_modules/lib/a.js
package.json
src/
src/index.ts
./
./.env</div>
<ul>
<li><strong>Bom tar:</strong> không có thư mục bọc chung, nên <code>tar -xf</code> sẽ rải bốn mục ra ngay thư mục bạn đang đứng. Bung những kho kiểu này vào một hộp mới: <code>mkdir out &amp;&amp; tar -xf bomb.tar.gz -C out</code>.</li>
<li><strong>Dấu <code>/</code> ở đầu:</strong> tar của GNU cắt nó đi và báo ra, nên khi bung nó rơi vào dưới thư mục hiện tại chứ không vào <code>/etc</code>. Lời báo trôi qua rất nhanh; <code>-t</code> cho bạn thấy nó trước.</li>
<li><strong>Lỗ hổng của glob:</strong> <code>*</code> đã bỏ sót <code>.env</code>, đúng như Bài 2.2 dự đoán. <code>-C project .</code> đóng gói chính thư mục đó, gồm cả file ẩn.</li>
</ul>
<div class="callout danger"><strong>Bẫy thứ tự cờ:</strong> <code>-f</code> lấy <em>TỪ KẾ TIẾP</em> làm tên kho nén. Vì thế <code>tar -cfz x.tar.gz project</code> tạo ra một kho tên là <code>z</code>, cố thêm vào một file tên <code>x.tar.gz</code>, rồi hỏng (đo thật: <code>tar: x.tar.gz: Cannot stat: No such file or directory</code>, mã thoát 2, và để lại một file <code>z</code>). Giữ chữ <code>f</code> ở cuối cụm cờ: <code>-czf</code>, <code>-caf</code>, <code>-tvf</code>.</div>

<h3>zip, cho khi đầu bên kia là Windows</h3>
<pre><code>zip -r archive.zip ./project      <span class="tok-comment"># -r là bắt buộc với thư mục</span>
unzip -l archive.zip              <span class="tok-comment"># liệt kê — tương đương -t</span>
unzip archive.zip -d /srv/app     <span class="tok-comment"># là -d, không phải -C</span></code></pre>
<p><code>zip</code> nén từng file riêng lẻ, nên nó đánh mất phần trùng lặp giữa các file — thứ làm cho <code>.tar.gz</code> nhỏ hơn. Nó cũng không lưu quyền Unix một cách đáng tin và hoàn toàn không lưu chủ sở hữu. Hãy dùng nó để trao đổi qua lại, đừng dùng để sao lưu.</p>

<h3>Nén từng file lẻ</h3>
<pre><code>gzip big.log            <span class="tok-comment"># THAY THẾ nó bằng big.log.gz — bản gốc mất</span>
gzip -k big.log         <span class="tok-comment"># -k giữ lại bản gốc</span>
gunzip big.log.gz
zcat big.log.gz | grep ERROR    <span class="tok-comment"># đọc mà không cần bung ra đĩa</span>
zless big.log.gz                <span class="tok-comment"># lật từng trang một file đã nén</span>
zgrep -c ERROR big.log.gz       <span class="tok-comment"># grep thẳng vào trong kho nén</span></code></pre>
<p>Cả họ <code>z*</code> (<code>zcat</code>, <code>zless</code>, <code>zgrep</code>, <code>zdiff</code>) tồn tại đúng để log đã xoay vòng vẫn tìm kiếm được. Không có lý do gì phải bung một file <code>.gz</code> 4 GB chỉ để grep nó.</p>

<h3>Trên macOS khác gì</h3>
<p>Đo thật trên macOS (công cụ BSD, bsdtar 3.5.3), trong một thư mục nháp:</p>
<pre><code class="language-bash">ln -sr r.txt s2.txt
mv -T cur-new cur
mv -h cur-new cur; ls -l cur          <span class="tok-comment"># BSD: -h = không đi theo link trỏ vào thư mục</span>
ln r.txt h.txt
stat -f '%i %l %N' r.txt              <span class="tok-comment"># inode, số liên kết, tên</span>
readlink -f s.txt
tar --zstd -cf t.tar.zst app.log; tar -caf t2.tar.zst app.log; file t2.tar.zst</code></pre>
<div class="out">ln: illegal option -- r
usage: ln [-s [-F] | -L | -P] [-f | -i] [-hnv] source_file [target_file]
       ln [-s [-F] | -L | -P] [-f | -i] [-hnv] source_file ... target_dir
mv: illegal option -- T
usage: mv [-f | -i | -n] [-hv] source target
       mv [-f | -i | -n] [-v] source ... directory
lrwxr-xr-x@ 1 admin  wheel  5 Sep 28 15:41 cur -&gt; rel/b
61348302 2 r.txt
/private/tmp/…/mac/r.txt
t2.tar.zst: Zstandard compressed data (v0.8+), Dictionary ID: None</div>
<ul>
<li><strong>Không có <code>mv -T</code>, không có <code>ln -r</code>.</strong> Công thức tráo nguyên tử là công thức của máy chủ Linux; trên Mac thứ tương đương là <code>mv -h</code>. Hãy để script deploy chạy trên VPS, đừng chạy trên laptop.</li>
<li><strong><code>stat</code> nói tiếng BSD:</strong> <code>-f</code> với <code>%i</code> (inode) và <code>%l</code> (số liên kết), thay cho <code>-c</code> với <code>%i</code>/<code>%h</code> của GNU.</li>
<li><strong>bsdtar hiểu các cờ đời mới:</strong> <code>--zstd</code> và <code>-a</code> đều chạy, nên kho <code>.tar.zst</code> đi qua lại giữa Mac và VPS không vướng gì.</li>
<li><code>readlink -f</code> chạy được trên macOS hiện nay; các bản macOS rất cũ thì không có, nên script cũ hay dùng <code>realpath</code> hoặc Python thay thế.</li>
</ul>

<h3>🧪 Thực hành (15–20 phút)</h3>
<div class="callout ok"><p><strong>Tình huống:</strong> bạn dựng quy trình deploy cho đồ án nhóm trên VPS. Hãy dựng bố cục <code>releases/</code> + <code>current</code>, phát hành một bản mới một cách nguyên tử, quay lui nó, và làm một bản sao lưu mà chứng minh được là có chứa <code>.env</code>.</p><ol>
<li>Dựng hai bản phát hành: <code>mkdir -p ~/thu-linux/c24 &amp;&amp; cd ~/thu-linux/c24 &amp;&amp; mkdir -p app/releases/2026-09-27 app/releases/2026-09-28</code>, rồi <code>echo 'phien ban cu' &gt; app/releases/2026-09-27/index.html; echo 'phien ban moi' &gt; app/releases/2026-09-28/index.html; echo 'DB_PASS=bi-mat' &gt; app/.env</code>.</li>
<li>Cho <code>current</code> trỏ vào bản cũ và đọc xuyên qua nó: <code>ln -sfn releases/2026-09-27 app/current; cat app/current/index.html</code>.</li>
<li>Phát hành nguyên tử, rồi quay lui — mỗi việc hai lệnh: <code>ln -sfn releases/2026-09-28 app/current.new &amp;&amp; mv -T app/current.new app/current</code>, kiểm bằng <code>readlink app/current; cat app/current/index.html</code>, rồi làm y vậy với <code>2026-09-27</code>.</li>
<li>Sao lưu cả thư mục và chứng minh có <code>.env</code> bên trong trước khi tin nó: <code>tar -caf app.tar.zst app</code>, <code>tar -tf app.tar.zst | grep -c '/\\.env$'</code>, và <code>tar -tvf app.tar.zst | grep current</code> để thấy cái link được lưu dưới dạng link.</li>
<li>Khôi phục vào một hộp mới rồi so sánh: <code>mkdir -p out &amp;&amp; tar -xf app.tar.zst -C out &amp;&amp; diff -r app out/app &amp;&amp; echo "giong het"</code>, rồi <code>readlink out/app/current</code>.</li></ol>
<div class="out">phien ban cu
releases/2026-09-28
phien ban moi
releases/2026-09-27
1
lrwxrwxrwx cuong/cuong       0 2026-09-28 09:09 app/current -&gt; releases/2026-09-27
giong het
releases/2026-09-27</div>
<p><strong>Đạt khi:</strong> ở mỗi bước <code>readlink app/current</code> cho đúng bản bạn chọn; <code>grep -c</code> in <code>1</code>; danh sách kho nén có <code>app/current -&gt; releases/…</code> (một link, không phải một bản chép của thư mục phát hành); <code>diff -r</code> không in gì và bạn thấy <code>giong het</code>; và <code>current</code> sau khi khôi phục vẫn trỏ vào <code>releases/2026-09-27</code> — một link tương đối, nên nó sống sót khi bị dời vào <code>out/</code>.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Inode (nút chỉ mục)</span><span class="v">Chính cái file theo cách hệ thống file nhìn: siêu dữ liệu cộng con trỏ tới dữ liệu, nhận diện bằng một con số, không có tên.</span></div>
  <div class="kv"><span class="k">Hard link (liên kết cứng)</span><span class="v">Một cái tên nữa cho cùng inode; dữ liệu còn sống tới khi cái tên cuối cùng bị gỡ.</span></div>
  <div class="kv"><span class="k">Symbolic link — symlink (liên kết tượng trưng)</span><span class="v">Một file tí hon có nội dung là một đường dẫn, được đi theo khi mở; trỏ đi đâu cũng được, kể cả vào hư không.</span></div>
  <div class="kv"><span class="k">Dangling link (link treo)</span><span class="v">Symlink mà đích của nó không còn tồn tại; tìm bằng <code>find -xtype l</code>.</span></div>
  <div class="kv"><span class="k">Atomic (nguyên tử)</span><span class="v">Xảy ra trong một bước không chia cắt được — <code>rename()</code> qua <code>mv -T</code> không bao giờ bị thấy ở trạng thái làm dở.</span></div>
  <div class="kv"><span class="k">Archive (kho lưu trữ)</span><span class="v">Nhiều file gói vào một dòng duy nhất kèm tên và siêu dữ liệu (thứ <code>tar</code> tạo ra).</span></div>
  <div class="kv"><span class="k">Compression level (mức nén)</span><span class="v">Bộ nén làm việc chăm tới đâu, đổi thời gian lấy kích thước: <code>zstd -19</code>, <code>xz -9</code>.</span></div>
  <div class="kv"><span class="k">Tar bomb (bom tar)</span><span class="v">Kho nén không có thư mục bọc chung, bung ra là rải file khắp chỗ bạn đang đứng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mục thư mục nối một cái tên với một inode; liên kết cứng là thêm tên, symlink là một file nhỏ chứa đường dẫn.</li>
<li><code>stat -c '%i %h'</code> cho thấy inode và số liên kết; liên kết cứng không trỏ vào thư mục và không vượt hệ thống file, còn <code>find -xtype l</code> tìm symlink hỏng.</li>
<li>Gỡ link thì không kèm gạch chéo cuối — <code>rm -r link/</code> xoá sạch thư mục thật — và cập nhật link thư mục bằng <code>ln -sfn</code> + <code>mv -T</code>.</li>
<li><code>tar</code> chỉ gói; bộ nén là chuyện riêng: <code>-a</code> chọn theo đuôi, <code>--zstd</code>/<code>-J</code>/<code>-z</code> chọn theo tên, và đọc từ ống dẫn thì phải ghi rõ cờ.</li>
<li>Đo thật: zstd nén nhanh hơn gzip khoảng 10 lần mà file còn nhỏ hơn; xz nhỏ nhất nhưng cần <code>-T0</code>; bzip2 chỉ còn để đọc kho cũ.</li>
<li>Luôn <code>tar -t</code> trước <code>-x</code>, bung kho lạ bằng <code>-C</code> vào thư mục mới, đóng gói bằng <code>-C thư_mục .</code> để có cả file ẩn, và giữ <code>f</code> ở cuối cụm cờ.</li>
</ul>

<a class="link-card" href="https://www.gnu.org/software/tar/manual/tar.html" target="_blank" rel="noopener">
  <span class="lc-ico">📘</span>
  <span class="lc-body"><span class="lc-title">GNU tar Manual</span><span class="lc-sub">Hai chương "Choosing Files" và "Changing Directories" nói tử tế về <code>--strip-components</code>, <code>--exclude</code> và <code>-C</code> — ba thứ đáng biết ngoài czf/xzf.</span></span>
</a>
<a class="link-card" href="https://man7.org/linux/man-pages/man7/symlink.7.html" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">symlink(7) — nhân giải liên kết ra sao</span><span class="lc-sub">Lời gọi hệ thống nào đi theo liên kết và lời gọi nào không, bày ra thành bảng. Đây là trang dùng để kết thúc tranh cãi.</span></span>
</a>
<a class="link-card" href="https://github.com/facebook/zstd" target="_blank" rel="noopener">
  <span class="lc-ico">⚡</span>
  <span class="lc-body"><span class="lc-title">zstd — số đo và hướng dẫn chọn mức nén</span><span class="lc-sub">Bảng so sánh trong README cho thấy vì sao zstd thay chỗ gzip làm mặc định hợp lý, với những con số bạn tự dựng lại được.</span></span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash${REF}" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Luyện: liên kết, tráo nguyên tử, và kho nén</span><span class="lc-sub">Dựng bố cục deploy kiểu releases/current, tráo nó một cách nguyên tử, rồi đóng gói và khôi phục mà vẫn giữ nguyên quyền.</span></span>
</a>

<div class="pitfall"><strong>Bẫy:</strong> <code>tar -czf backup.tar.gz *</code> âm thầm bỏ sót MỌI file ẩn — <code>.env</code>, <code>.gitignore</code>, <code>.github/</code> — vì shell khai triển dấu <code>*</code> TRƯỚC khi tar kịp chạy, và glob thì bỏ qua dấu chấm đứng đầu (Bài 2.2). Kho nén trông vẫn ổn, liệt kê vẫn ổn, và khôi phục ra một ứng dụng không khởi động được. Hãy đóng gói cả <em>THƯ MỤC</em>: <code>tar -czf backup.tar.gz ./project</code>, hoặc từ bên trong nó, <code>tar -czf ../backup.tar.gz .</code> — dấu chấm đơn là một đường dẫn chứ không phải glob, nên không sót gì cả.</div>
<p class="note-ct"><strong>Luôn liệt kê trước khi bung.</strong> <code>tar -tzf archive.tar.gz | head</code> tốn một giây và cho bạn biết kho nén chứa <code>project/…</code> hay bốn trăm file rời sắp phun tung toé khắp thư mục hiện tại — cái gọi là "bom tar". Nhân tiện, hãy kiểm luôn xem có dấu <code>/</code> đứng đầu không: tar của GNU cắt nó đi và cảnh báo, nhưng lời cảnh báo trôi qua rất nhanh, còn một kho nén dựng bằng <code>-P</code> thì thật sự ghi được vào đường dẫn tuyệt đối.</p>
</div>
`,
    },
    /* ─────────────────────────── 2.5 Quiz ─────────────────────────── */
    {
      title: '2.5 — Chapter 2 quiz|||2.5 — Kiểm tra Chương 2',
      slug: 'lnx-2-5-quiz',
      type: 'QUIZ',
      description: 'Mười câu tình huống về cp -r và dấu gạch chéo, biến rỗng trong rm -rf, glob so với regex, file ẩn và globskipdots, find -exec + so với \\;, xargs -0, -delete đặt sai chỗ, ln -sfn, tar đọc từ ống dẫn và tar bỏ sót .env.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations from real work with files — most ask what a command prints or which line fixes the problem. Every answer was checked by running it on Ubuntu 24.04. Aim for 8/10, and read the explanation even when you are right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can predict what <code>cp -r src dst</code> does when <code>dst</code> already exists, and copy "the contents" the same way on Linux and macOS.</li>
<li>I can guard <code>rm -rf "$DIR"/*</code> against an empty variable, and I know what <code>--preserve-root</code> does not protect.</li>
<li>I can tell a glob from a regex, and say what <code>echo .*</code> prints on bash 5.2 versus bash 3.2.</li>
<li>I can write a <code>find</code> command with quoted tests, <code>-exec … {} +</code>, and a <code>-print</code> dry run before <code>-delete</code>.</li>
<li>I can explain hard link versus symlink with the word "inode", and swap a <code>current</code> link atomically.</li>
<li>I can create, list and extract <code>.tar.zst</code>/<code>.tar.gz</code> archives, and make sure dotfiles are inside.</li>
</ul>
${slide('lx-02', 29, 'Bảng tra nhanh Chương 2 (1/2)')}
${slide('lx-02', 30, 'Bảng tra nhanh Chương 2 (2/2)')}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống từ công việc thật với file — phần lớn hỏi một lệnh in ra gì hoặc dòng nào sửa được lỗi. Mọi đáp án đều đã được kiểm bằng cách chạy thật trên Ubuntu 24.04. Hãy nhắm 8/10, và đọc phần giải thích kể cả khi bạn làm đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi đoán được <code>cp -r src dst</code> làm gì khi <code>dst</code> đã tồn tại, và chép "phần nội dung" giống nhau trên Linux lẫn macOS.</li>
<li>Tôi chặn được <code>rm -rf "$DIR"/*</code> khỏi một biến rỗng, và biết <code>--preserve-root</code> KHÔNG bảo vệ được gì.</li>
<li>Tôi phân biệt được glob với regex, và nói được <code>echo .*</code> in ra gì trên bash 5.2 so với bash 3.2.</li>
<li>Tôi viết được lệnh <code>find</code> với phép thử trong nháy, <code>-exec … {} +</code>, và một lượt chạy thử bằng <code>-print</code> trước <code>-delete</code>.</li>
<li>Tôi giải thích được liên kết cứng khác symlink bằng từ "inode", và tráo link <code>current</code> một cách nguyên tử.</li>
<li>Tôi tạo, liệt kê và bung được kho <code>.tar.zst</code>/<code>.tar.gz</code>, và chắc chắn file ẩn có nằm bên trong.</li>
</ul>
${slide('lx-02', 29, 'Bảng tra nhanh Chương 2 (1/2)')}
${slide('lx-02', 30, 'Bảng tra nhanh Chương 2 (2/2)')}
</div>
`,
      quiz: {
        timeLimitSeconds: 900,
        questions: [
          {
            question: 'On the Ubuntu VPS you run "cp -r src dst" to back up a folder. It works. The next day the same command runs again from a script. What does dst contain now?|||Trên VPS Ubuntu bạn chạy "cp -r src dst" để sao lưu một thư mục. Chạy ổn. Hôm sau script chạy lại đúng lệnh đó. Giờ dst chứa gì?',
            options: [
              'The same files, overwritten with today’s versions|||Vẫn những file đó, bị ghi đè bằng bản hôm nay',
              'Yesterday’s copy plus a new subdirectory dst/src with today’s copy|||Bản chép hôm qua cộng thêm một thư mục con dst/src chứa bản hôm nay',
              'An error: cp refuses because dst already exists|||Một lỗi: cp từ chối vì dst đã tồn tại',
              'Only the files that changed, because -r skips identical ones|||Chỉ những file đã đổi, vì -r bỏ qua file giống nhau',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: When the destination already exists as a directory, cp copies the source INTO it — measured: ls dst shows "api app.ts auth.ts shared src web". The overwrite answer describes rsync src/ dst/ or cp -a src/. dst/, not cp -r src dst. cp does not refuse, and skipping unchanged files is -u, not -r.|||VI: Khi đích đã tồn tại và là thư mục, cp chép nguồn VÀO TRONG nó — đo thật: ls dst in "api app.ts auth.ts shared src web". Phương án "ghi đè" là hành vi của rsync src/ dst/ hoặc cp -a src/. dst/, không phải cp -r src dst. cp không từ chối, còn bỏ qua file không đổi là việc của -u chứ không phải -r.',
          },
          {
            question: 'A cleanup script contains: rm -rf "$BUILD_DIR"/*. In cron, BUILD_DIR is not set. Which single change guarantees rm never runs in that case?|||Một script dọn dẹp có dòng: rm -rf "$BUILD_DIR"/*. Khi chạy bằng cron, BUILD_DIR chưa được đặt. Thay đổi nào dưới đây chắc chắn rm không chạy trong trường hợp đó?',
            options: [
              'Add --preserve-root to the rm command|||Thêm --preserve-root vào lệnh rm',
              'Run the script with bash -x so the error gets printed|||Chạy script bằng bash -x để lỗi được in ra',
              'Add alias rm="rm -i" to ~/.bashrc|||Thêm alias rm="rm -i" vào ~/.bashrc',
              'Write rm -rf "${BUILD_DIR:?}"/*|||Viết rm -rf "${BUILD_DIR:?}"/*',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: ${VAR:?} makes the shell print an error and refuse to run the command when VAR is empty or unset (measured: "BUILD_DIR: parameter null or not set"). --preserve-root is already the default and only blocks "/" itself — "/*" expands to /bin /boot … /var and passes. bash -x only prints each command as it runs — it would print rm -rf /bin /boot … and still run it. Aliases do not exist in scripts or cron.|||VI: ${VAR:?} khiến shell in lỗi và không chạy lệnh khi VAR rỗng hoặc chưa đặt (đo thật: "BUILD_DIR: parameter null or not set"). --preserve-root vốn đã là mặc định và chỉ chặn đúng "/" — còn "/*" khai triển thành /bin /boot … /var và lọt qua. bash -x chỉ in từng lệnh khi chạy — nó sẽ in rm -rf /bin /boot … rồi vẫn chạy. Alias không tồn tại trong script hay cron.',
          },
          {
            question: 'On Ubuntu 24.04 (bash 5.2) a directory holds .env, .gitignore and app.log. What does "echo .*" print?|||Trên Ubuntu 24.04 (bash 5.2), một thư mục có .env, .gitignore và app.log. "echo .*" in ra gì?',
            options: [
              '.env .gitignore',
              '. .. .env .gitignore',
              '.env .gitignore app.log',
              '.*',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: Bash 5.2 turned on the option globskipdots by default, so .* no longer matches . and .. — measured on Ubuntu 24.04. ". .. .env .gitignore" is what bash 3.2 (macOS /bin/bash) and bash before 5.2 print, and what you get after "shopt -u globskipdots". app.log does not start with a dot, and ".*" printed literally would need nothing to match.|||VI: Bash 5.2 bật sẵn tuỳ chọn globskipdots, nên .* thôi khớp . và .. — đo thật trên Ubuntu 24.04. ". .. .env .gitignore" là thứ bash 3.2 (/bin/bash của macOS) và bash trước 5.2 in ra, và là kết quả sau khi "shopt -u globskipdots". app.log không bắt đầu bằng dấu chấm, còn ".*" nguyên văn chỉ xuất hiện khi không có gì khớp.',
          },
          {
            question: 'A folder contains app.log, app.log.1 and catalog.txt. What does the command ls | grep ".log" print?|||Một thư mục có app.log, app.log.1 và catalog.txt. Lệnh ls | grep ".log" in ra gì?',
            options: [
              'app.log only|||Chỉ app.log',
              'app.log and app.log.1|||app.log và app.log.1',
              'All three: app.log, app.log.1 and catalog.txt|||Cả ba: app.log, app.log.1 và catalog.txt',
              'Nothing — grep needs *.log to match file names|||Không gì cả — grep cần *.log mới khớp tên file',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: grep uses regex, where "." means ANY character and there are no implicit anchors, so ".log" matches "alog" inside catalog.txt — measured. "app.log only" is what the anchored regex grep -E "\\.log$" prints. "*.log" is glob syntax; as a regex it means something else entirely.|||VI: grep dùng regex, trong đó "." nghĩa là MỘT KÝ TỰ BẤT KỲ và không có neo ngầm định, nên ".log" khớp đoạn "alog" trong catalog.txt — đo thật. "Chỉ app.log" là kết quả của regex có neo grep -E "\\.log$". "*.log" là cú pháp glob; hiểu như regex thì nó mang nghĩa khác hẳn.',
          },
          {
            question: 'You back up the project with "cd project && tar -czf ../backup.tar.gz *". After restoring on the VPS, the app cannot connect to the database. What is missing, and what is the fix?|||Bạn sao lưu dự án bằng "cd project && tar -czf ../backup.tar.gz *". Khôi phục trên VPS xong thì ứng dụng không kết nối được CSDL. Thiếu gì, và sửa thế nào?',
            options: [
              'File permissions — add -p when creating|||Quyền file — thêm -p khi tạo',
              'Symlinks — add -h to follow them|||Symlink — thêm -h để đi theo chúng',
              'Nothing is missing — gzip corrupted the archive; use --zstd|||Không thiếu gì — gzip làm hỏng kho; hãy dùng --zstd',
              '.env and every other dotfile — archive the directory instead: tar -czf backup.tar.gz -C project .|||.env và mọi file ẩn khác — hãy đóng gói cả thư mục: tar -czf backup.tar.gz -C project .',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: The shell expanded * before tar ran, and globs skip names starting with a dot — measured: the listing had node_modules, package.json and src but no .env. With -C project . the "." is a path, not a glob, so ./.env is included. tar stores permissions by default and -h would copy link targets; neither brings back a file that was never archived.|||VI: Shell đã khai triển * trước khi tar chạy, mà glob bỏ qua tên bắt đầu bằng dấu chấm — đo thật: danh sách có node_modules, package.json và src nhưng không có .env. Với -C project . thì "." là một đường dẫn chứ không phải glob, nên có ./.env. tar mặc định đã lưu quyền, còn -h thì chép đích của link; không cách nào mang lại một file chưa từng được đóng gói.',
          },
          {
            question: 'You must checksum 5,000 small log files. Which statement matches what was measured on Ubuntu 24.04?|||Bạn phải tính checksum cho 5.000 file log nhỏ. Nhận định nào khớp với số đo thật trên Ubuntu 24.04?',
            options: [
              '-exec md5sum {} \\; and -exec md5sum {} + take the same time, because the work is the same|||-exec md5sum {} \\; và -exec md5sum {} + tốn thời gian như nhau, vì khối lượng việc như nhau',
              '-exec md5sum {} + took about 0.03 s against about 3 s for \\;, because + starts one md5sum for many files|||-exec md5sum {} + mất khoảng 0,03 s so với khoảng 3 s của \\;, vì + khởi động một md5sum cho nhiều file',
              '\\; is faster because it processes files in parallel|||\\; nhanh hơn vì nó xử lý các file song song',
              '+ is faster but breaks on file names containing spaces|||+ nhanh hơn nhưng hỏng với tên file có dấu cách',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Measured three times: \\; ran 5,000 processes in ~3 s, + passed all 5,000 paths to one md5sum in ~0.03 s — starting a process costs far more than hashing a tiny file. Neither runs in parallel (that is xargs -P). -exec passes names directly without splitting, so spaces are safe with both terminators.|||VI: Đo ba lượt: \\; chạy 5.000 tiến trình trong ~3 s, + đưa cả 5.000 đường dẫn cho một md5sum trong ~0,03 s — khởi động một tiến trình tốn hơn nhiều so với băm một file tí hon. Không cách nào chạy song song cả (đó là xargs -P). -exec truyền tên trực tiếp, không cắt, nên dấu cách an toàn với cả hai kiểu kết thúc.',
          },
          {
            question: 'Your clean-up pipeline find . -name "*.pdf" | xargs rm prints "No such file or directory" for ./Bao, cao, cuoi and ky.pdf, and leaves "Bao cao cuoi ky.pdf" behind. Which command fixes it?|||Đường ống dọn dẹp find . -name "*.pdf" | xargs rm in lỗi "No such file or directory" cho ./Bao, cao, cuoi và ky.pdf, rồi để sót "Bao cao cuoi ky.pdf". Lệnh nào sửa được?',
            options: [
              'find . -name "*.pdf" -print0 | xargs -0 rm',
              'find . -name "*.pdf" | xargs -r rm',
              'find . -name "*.pdf" | xargs -n 1 rm',
              'find . -name "*.pdf" | xargs -P4 rm',
            ],
            correctIndex: 0, points: 1,
            explanation: 'EN: xargs splits its input on whitespace, so one name becomes four arguments. -print0 ends each path with a NUL byte and xargs -0 splits only on NUL — the one byte a filename cannot contain. -r only skips an empty input; -n 1 and -P4 change how many arguments per run and how many runs at once, but the name is still split first. (find … -delete, or -exec rm {} +, also work.)|||VI: xargs cắt đầu vào theo khoảng trắng, nên một cái tên thành bốn tham số. -print0 kết thúc mỗi đường dẫn bằng byte NUL và xargs -0 chỉ cắt theo NUL — byte duy nhất tên file không thể chứa. -r chỉ bỏ qua đầu vào rỗng; -n 1 và -P4 đổi số tham số mỗi lần và số lượt chạy cùng lúc, nhưng cái tên vẫn bị cắt trước đó. (find … -delete, hoặc -exec rm {} +, cũng được.)',
          },
          {
            question: 'In a directory holding a.log, b.txt and sub/, you run find . -delete -name "*.log" with findutils 4.9 (Ubuntu 24.04). What happens?|||Trong thư mục có a.log, b.txt và sub/, bạn chạy find . -delete -name "*.log" với findutils 4.9 (Ubuntu 24.04). Chuyện gì xảy ra?',
            options: [
              'Only a.log is deleted — find reorders the expression|||Chỉ a.log bị xoá — find tự sắp xếp lại biểu thức',
              'find refuses with an error because -delete comes before a test|||find từ chối với một lỗi vì -delete đứng trước phép thử',
              'Everything inside is deleted — a.log, b.txt and sub/ — and find exits 0|||Mọi thứ bên trong bị xoá — a.log, b.txt và sub/ — và find thoát với mã 0',
              'Nothing is deleted; -delete only works with -type f|||Không gì bị xoá; -delete chỉ chạy khi có -type f',
            ],
            correctIndex: 2, points: 1,
            explanation: 'EN: find evaluates left to right: -delete is an action that runs for every path before -name is ever checked. Measured on Ubuntu 24.04: the directory was left empty and exit status was 0. find does not reorder or refuse this (an older version of this lesson wrongly claimed it refuses). Always build with -print and put -delete last.|||VI: find tính từ trái sang phải: -delete là hành động chạy với mọi đường dẫn trước khi -name kịp được xét. Đo thật trên Ubuntu 24.04: thư mục trống trơn và mã thoát là 0. find không tự sắp xếp lại cũng không từ chối (bản cũ của bài từng ghi sai là nó từ chối). Luôn dựng lệnh bằng -print và đặt -delete ở cuối.',
          },
          {
            question: 'current is a symlink to releases/a (a directory). You run "ln -sf releases/b current" to switch versions. What actually happens?|||current là một symlink trỏ tới releases/a (một thư mục). Bạn chạy "ln -sf releases/b current" để đổi phiên bản. Điều gì thực sự xảy ra?',
            options: [
              'current now points to releases/b, atomically|||current giờ trỏ tới releases/b, một cách nguyên tử',
              'A new link named b is created INSIDE releases/a, and current still points to releases/a|||Một link mới tên b được tạo BÊN TRONG releases/a, còn current vẫn trỏ tới releases/a',
              'ln fails with "File exists"|||ln báo lỗi "File exists"',
              'releases/a is replaced by a copy of releases/b|||releases/a bị thay bằng một bản chép của releases/b',
            ],
            correctIndex: 1, points: 1,
            explanation: 'EN: Without -n, ln follows current (a link to a directory) and treats it as the target directory, so it creates releases/a/b — measured: ls -l rel/a showed "b -> rel/b" while cur was unchanged, and ln exited 0. -f does not prevent this; -n does. For an atomic swap, use ln -sfn new current.new && mv -T current.new current.|||VI: Thiếu -n, ln đi theo current (một link trỏ vào thư mục) và coi nó là thư mục đích, nên nó tạo releases/a/b — đo thật: ls -l rel/a có "b -> rel/b" trong khi cur không đổi, và ln thoát với mã 0. -f không ngăn được chuyện này; -n thì có. Muốn tráo nguyên tử: ln -sfn mới current.new && mv -T current.new current.',
          },
          {
            question: 'A script streams a backup over SSH and runs "cat backup.tar.zst | tar -tf -" to check it. It fails with "Archive is compressed. Use --zstd option". Which command works?|||Một script truyền bản sao lưu qua SSH và chạy "cat backup.tar.zst | tar -tf -" để kiểm. Nó hỏng với "Archive is compressed. Use --zstd option". Lệnh nào chạy được?',
            options: [
              'cat backup.tar.zst | tar -xf -',
              'cat backup.tar.zst | tar -caf - | tar -tf -',
              'cat backup.tar.zst | tar -tzf -',
              'cat backup.tar.zst | tar --zstd -tf -',
            ],
            correctIndex: 3, points: 1,
            explanation: 'EN: GNU tar can detect the compressor from a file name or by reading a seekable file, but from a pipe it must be told — measured: the same stream listed fine with --zstd. -x has the same problem as -t. -z means gzip, the wrong format. -a chooses a compressor from the suffix when CREATING, and there is no suffix on "-".|||VI: tar của GNU đoán được bộ nén từ tên file hoặc khi đọc một file thật, nhưng từ ống dẫn thì phải được bảo — đo thật: cùng dòng dữ liệu đó liệt kê bình thường khi có --zstd. -x vướng y hệt -t. -z nghĩa là gzip, sai định dạng. -a chọn bộ nén theo đuôi file khi TẠO, mà "-" thì chẳng có đuôi nào.',
          },
        ],
      },
    },
  ],
};
