/**
 * OSG202 · Chương 7 (web) — Lab Linux 1–4: lệnh, shell script, C trên Linux, /proc.
 * Quiz viết lại (10 câu, giữ slug osg202-quiz-ch7).
 *
 * ⚠️ FILE SINH TỰ ĐỘNG bởi flm-nguon/OSG202/gen/gen.mjs từ gen/src/**, gen/code/**, gen/sim/** và gen/uml/**.
 * Đừng sửa tay: sửa nguồn rồi chạy lại `node OSG202/gen/gen.mjs`.
 */

import { bi } from './_slides.mjs';

/* ───────── Lab 1 — Linux commands and the file system: navigation, permissions, find and grep, pipes, logs, archives, links, disk space ───────── */
const L_x_lab_1 = {
  title: 'Lab 1 — Linux commands and the file system: navigation, permissions, find and grep, pipes, logs, archives, links, disk space|||Lab 1 — Lệnh Linux và hệ thống tệp: điều hướng, quyền, find và grep, pipe, xem log, nén, liên kết, dung lượng đĩa',
  slug: 'osg202-lab-1',
  type: 'VIDEO',
  description: 'Bài lab 1 của OSG202 (CLO7–8) theo tình huống của dev backend trên một VPS Linux mới: chín bài tập tăng dần có lời giải chạy thật trong container Linux — dựng cây thư mục, đọc và đặt quyền rwx với chmod, chown, umask, tạo người dùng và nhóm, tìm tệp bằng find và nội dung bằng grep, phân tích log bằng pipe, xem log đang lớn dần, nén bằng tar và gzip, liên kết cứng và mềm (mẹo phát hành current), và tìm vì sao đĩa đầy — kèm cách đọc thông báo lỗi, bảng chấm điểm và thuật ngữ.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lab 1 · CLO7–8</span>
<h2>Lab 1 — Linux commands and the file system</h2>
<p class="lead">Your team has just rented a fresh Linux VPS for a small backend. Nobody has installed anything yet and you only have a terminal. In this lab you do the daily work of a backend developer there: lay out folders, lock down secrets, find a bug in a log, ship a release and find out why the disk is full. Lessons 7.1–7.2 gave you the commands; here you <strong>use</strong> them on realistic tasks.</p>
<h3>🎯 Objectives</h3>
<ul>
<li>Navigate the file tree with absolute and relative paths and manage files and folders (CLO7).</li>
<li>Read an <code>ls -l</code> permission string, change it with <code>chmod</code> (symbolic and octal), explain <code>umask</code>, and manage users and groups (CLO7–8; theory: Chapter 4 slides on protection).</li>
<li>Search with <code>find</code> and <code>grep</code>; combine commands with pipes and redirections (CLO8; builds on CS.2 exercise 3).</li>
<li>Read logs, compress and archive, understand hard and symbolic links, and measure disk usage with <code>du</code> and <code>df</code> (CLO8).</li>
</ul>
<h3>🐳 How to work</h3>
<p>Every exercise below was <strong>run for real</strong> in the course container (Debian 12, bash 5.2, on ARM64). Do each one in your own terminal first — WSL, a Linux VM or a Docker container all work (see lesson 0.3). Only then open the solution and compare. Differences in dates, inode numbers or sizes are normal; differences in <em>meaning</em> are not.</p>
<table>
<thead><tr><th>Exercise</th><th>Task</th><th>Commands</th></tr></thead>
<tbody>
<tr><td>1</td><td>lay out a deployment folder tree</td><td>pwd, cd, ls, mkdir, cp, mv, rm, tree</td></tr>
<tr><td>2</td><td>lock down a secrets file; understand umask</td><td>chmod, stat, umask</td></tr>
<tr><td>3</td><td>a deploy user, a group and a shared folder</td><td>useradd, groupadd, id, chown, setgid</td></tr>
<tr><td>4</td><td>find files, find text inside files</td><td>find, grep, xargs</td></tr>
<tr><td>5</td><td>answer questions about a web server log</td><td>cut, sort, uniq, &gt;, &gt;&gt;, tee</td></tr>
<tr><td>6</td><td>read a log that keeps growing</td><td>head, tail -f, sed -n, less</td></tr>
<tr><td>7</td><td>pack and compress a release</td><td>tar, gzip, diff -r</td></tr>
<tr><td>8</td><td>hard link vs symbolic link; zero-downtime releases</td><td>ln, ln -s, readlink</td></tr>
<tr><td>9</td><td>where did the disk go?</td><td>du, df, df -i</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Lab 1 · CLO7–8</span>
<h2>Lab 1 — Lệnh Linux và hệ thống tệp</h2>
<p class="lead">Nhóm bạn vừa thuê một VPS Linux mới tinh cho một backend nhỏ. Chưa ai cài gì và bạn chỉ có một cái terminal. Trong lab này bạn làm những việc hằng ngày của dev backend ở đó: dựng thư mục, khoá kín bí mật, tìm lỗi trong log, phát hành một bản và tìm xem vì sao đĩa đầy. Bài 7.1–7.2 đã cho bạn các lệnh; ở đây bạn <strong>dùng</strong> chúng cho những việc thực tế.</p>
<h3>🎯 Mục tiêu</h3>
<ul>
<li>Đi lại trong cây thư mục bằng đường dẫn tuyệt đối và tương đối, quản lý tệp và thư mục (CLO7).</li>
<li>Đọc chuỗi quyền của <code>ls -l</code>, đổi bằng <code>chmod</code> (ký hiệu và bát phân), giải thích <code>umask</code>, quản lý người dùng và nhóm (CLO7–8; lý thuyết: các slide bảo vệ ở Chương 4).</li>
<li>Tìm bằng <code>find</code> và <code>grep</code>; kết hợp lệnh bằng pipe và chuyển hướng (CLO8; nối tiếp bài 3 của CS.2).</li>
<li>Đọc log, nén và đóng gói, hiểu liên kết cứng và liên kết mềm, đo dung lượng đĩa bằng <code>du</code> và <code>df</code> (CLO8).</li>
</ul>
<h3>🐳 Cách làm</h3>
<p>Mọi bài tập dưới đây đều <strong>đã chạy thật</strong> trong container của môn (Debian 12, bash 5.2, trên ARM64). Hãy tự làm từng bài trong terminal của bạn trước — WSL, máy ảo Linux hay container Docker đều được (xem bài 0.3). Rồi mới mở lời giải để đối chiếu. Khác ngày giờ, số inode hay kích thước là bình thường; khác về <em>ý nghĩa</em> thì không.</p>
<table>
<thead><tr><th>Bài</th><th>Việc cần làm</th><th>Lệnh</th></tr></thead>
<tbody>
<tr><td>1</td><td>dựng cây thư mục triển khai</td><td>pwd, cd, ls, mkdir, cp, mv, rm, tree</td></tr>
<tr><td>2</td><td>khoá tệp bí mật; hiểu umask</td><td>chmod, stat, umask</td></tr>
<tr><td>3</td><td>người dùng deploy, một nhóm và thư mục dùng chung</td><td>useradd, groupadd, id, chown, setgid</td></tr>
<tr><td>4</td><td>tìm tệp, tìm chữ bên trong tệp</td><td>find, grep, xargs</td></tr>
<tr><td>5</td><td>trả lời câu hỏi về log web server</td><td>cut, sort, uniq, &gt;, &gt;&gt;, tee</td></tr>
<tr><td>6</td><td>đọc một log đang lớn dần</td><td>head, tail -f, sed -n, less</td></tr>
<tr><td>7</td><td>đóng gói và nén một bản phát hành</td><td>tar, gzip, diff -r</td></tr>
<tr><td>8</td><td>liên kết cứng và mềm; phát hành không gián đoạn</td><td>ln, ln -s, readlink</td></tr>
<tr><td>9</td><td>đĩa đi đâu mất?</td><td>du, df, df -i</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — lay out the folders of a backend (15 min)</h3>
<p><strong>Situation.</strong> You log in as a normal user and must prepare <code>~/app</code> with <code>releases/v1</code> (the code), <code>shared/logs</code> and <code>shared/uploads</code> (data that survives releases). Create it with as few commands as possible, show it as a tree, then practise: move between folders using both absolute and relative paths and return with <code>cd -</code>; copy <code>v1</code> to <code>v2</code>, rename a file inside it; remove <code>v1</code> and <code>v2</code> and notice which command refuses; finally create a hidden <code>.env</code> and make it visible.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 1: lay out the folders of a small backend on a fresh VPS<br>
$ pwd<br>
/home/sv<br>
$ mkdir -p app/releases/v1 app/shared/logs app/shared/uploads<br>
$ touch app/releases/v1/server.js app/shared/logs/app.log<br>
$ tree app<br>
app<br>
├── releases<br>
│   └── v1<br>
│   &nbsp;&nbsp;&nbsp;&nbsp;└── server.js<br>
└── shared<br>
&nbsp;&nbsp;&nbsp;&nbsp;├── logs<br>
&nbsp;&nbsp;&nbsp;&nbsp;│   └── app.log<br>
&nbsp;&nbsp;&nbsp;&nbsp;└── uploads<br>
<br>
6 directories, 2 files<br>
# Absolute vs relative paths<br>
$ cd app/shared/logs<br>
$ pwd<br>
/home/sv/app/shared/logs<br>
$ cd ../../releases/v1<br>
$ pwd<br>
/home/sv/app/releases/v1<br>
$ cd -<br>
/home/sv/app/shared/logs<br>
$ cd ~<br>
$ pwd<br>
/home/sv<br>
# Copy, move, remove<br>
$ cp -r app/releases/v1 app/releases/v2<br>
$ mv app/releases/v2/server.js app/releases/v2/main.js<br>
$ ls app/releases/v1 app/releases/v2<br>
app/releases/v1:<br>
server.js<br>
<br>
app/releases/v2:<br>
main.js<br>
$ rm app/releases/v1/server.js<br>
$ rmdir app/releases/v1<br>
$ rmdir app/releases/v2<br>
rmdir: failed to remove 'app/releases/v2': Directory not empty<br>
$ rm -r app/releases/v2<br>
$ ls app/releases<br>
# Hidden files and the long listing<br>
$ touch app/.env<br>
$ ls app<br>
releases<br>
shared<br>
$ ls -a app<br>
.<br>
..<br>
.env<br>
releases<br>
shared</div>
<ul>
<li><code>mkdir -p</code> creates every missing parent and does not complain if the folder exists — one command for the whole tree. <code>tree</code> shows the result.</li>
<li><strong>Absolute</strong> paths start with <code>/</code> (or <code>~</code> for your home) and work from anywhere; <strong>relative</strong> paths start from the current folder. <code>..</code> is the parent. <code>cd -</code> jumps back to the previous folder and prints where you landed.</li>
<li><code>cp -r</code> is needed for folders. <code>mv</code> both moves and renames.</li>
<li><code>rmdir</code> only removes <em>empty</em> folders: it failed on <code>v2</code> with <code>Directory not empty</code>. <code>rm -r</code> removes a folder with its content, <strong>with no recycle bin</strong> — never type <code>rm -r</code> with a path you did not read twice, and never <code>rm -rf /</code> or <code>rm -rf $VAR/</code> when <code>$VAR</code> may be empty.</li>
<li>A name starting with <code>.</code> is hidden: <code>ls</code> skips it, <code>ls -a</code> shows it (together with <code>.</code> = this folder and <code>..</code> = parent). Put secrets such as <code>.env</code> there only if you also fix their permissions (Exercise 2).</li>
</ul>
</details>`,
    `<h3>🧪 Bài 1 — dựng cây thư mục cho backend (15 phút)</h3>
<p><strong>Tình huống.</strong> Bạn đăng nhập bằng người dùng thường và phải chuẩn bị <code>~/app</code> gồm <code>releases/v1</code> (mã nguồn), <code>shared/logs</code> và <code>shared/uploads</code> (dữ liệu sống sót qua các bản phát hành). Tạo nó bằng ít lệnh nhất, hiện thành cây, rồi luyện: đi lại giữa các thư mục bằng cả đường dẫn tuyệt đối và tương đối, quay về bằng <code>cd -</code>; sao chép <code>v1</code> thành <code>v2</code>, đổi tên một tệp bên trong; xoá <code>v1</code> và <code>v2</code> và để ý lệnh nào từ chối; cuối cùng tạo tệp ẩn <code>.env</code> và làm nó hiện ra.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 1: dựng cây thư mục cho một backend nhỏ trên VPS mới<br>
$ pwd<br>
/home/sv<br>
$ mkdir -p app/releases/v1 app/shared/logs app/shared/uploads<br>
$ touch app/releases/v1/server.js app/shared/logs/app.log<br>
$ tree app<br>
app<br>
├── releases<br>
│   └── v1<br>
│   &nbsp;&nbsp;&nbsp;&nbsp;└── server.js<br>
└── shared<br>
&nbsp;&nbsp;&nbsp;&nbsp;├── logs<br>
&nbsp;&nbsp;&nbsp;&nbsp;│   └── app.log<br>
&nbsp;&nbsp;&nbsp;&nbsp;└── uploads<br>
<br>
6 directories, 2 files<br>
# Đường dẫn tuyệt đối và tương đối<br>
$ cd app/shared/logs<br>
$ pwd<br>
/home/sv/app/shared/logs<br>
$ cd ../../releases/v1<br>
$ pwd<br>
/home/sv/app/releases/v1<br>
$ cd -<br>
/home/sv/app/shared/logs<br>
$ cd ~<br>
$ pwd<br>
/home/sv<br>
# Sao chép, di chuyển, xoá<br>
$ cp -r app/releases/v1 app/releases/v2<br>
$ mv app/releases/v2/server.js app/releases/v2/main.js<br>
$ ls app/releases/v1 app/releases/v2<br>
app/releases/v1:<br>
server.js<br>
<br>
app/releases/v2:<br>
main.js<br>
$ rm app/releases/v1/server.js<br>
$ rmdir app/releases/v1<br>
$ rmdir app/releases/v2<br>
rmdir: failed to remove 'app/releases/v2': Directory not empty<br>
$ rm -r app/releases/v2<br>
$ ls app/releases<br>
# Tệp ẩn và dạng liệt kê dài<br>
$ touch app/.env<br>
$ ls app<br>
releases<br>
shared<br>
$ ls -a app<br>
.<br>
..<br>
.env<br>
releases<br>
shared</div>
<ul>
<li><code>mkdir -p</code> tạo mọi thư mục cha còn thiếu và không phàn nàn nếu thư mục đã có — một lệnh cho cả cây. <code>tree</code> hiện kết quả.</li>
<li>Đường dẫn <strong>tuyệt đối</strong> bắt đầu bằng <code>/</code> (hoặc <code>~</code> cho thư mục nhà) và dùng được từ bất kỳ đâu; đường dẫn <strong>tương đối</strong> tính từ thư mục hiện tại. <code>..</code> là thư mục cha. <code>cd -</code> nhảy về thư mục trước đó và in ra nơi bạn đến.</li>
<li>Muốn sao chép thư mục phải có <code>cp -r</code>. <code>mv</code> vừa di chuyển vừa đổi tên.</li>
<li><code>rmdir</code> chỉ xoá thư mục <em>rỗng</em>: nó báo <code>Directory not empty</code> với <code>v2</code>. <code>rm -r</code> xoá thư mục cùng nội dung, <strong>không có thùng rác</strong> — đừng gõ <code>rm -r</code> với một đường dẫn chưa đọc hai lần, và đừng bao giờ <code>rm -rf /</code> hay <code>rm -rf $VAR/</code> khi <code>$VAR</code> có thể rỗng.</li>
<li>Tên bắt đầu bằng <code>.</code> là tệp ẩn: <code>ls</code> bỏ qua, <code>ls -a</code> mới hiện (cùng <code>.</code> = thư mục này và <code>..</code> = thư mục cha). Chỉ để bí mật như <code>.env</code> ở đó khi bạn cũng đã chỉnh quyền cho chúng (Bài 2).</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 2 — lock down a secrets file (15 min)</h3>
<p><strong>Situation.</strong> <code>secrets.env</code> holds a database password and <code>deploy.sh</code> must be executable — but right now a freshly created script says <code>Permission denied</code>. As a normal user: (a) read the <code>ls -l</code> strings and run <code>./deploy.sh</code> before and after <code>chmod u+x</code>; (b) set <code>secrets.env</code> to <code>640</code>, then to <code>000</code>, and show who can still read it; (c) make a folder, remove its <code>x</code> bit and then its <code>r</code> bit and find out what <code>cat</code> and <code>ls</code> can still do; (d) compare what files and folders get under <code>umask</code> 022 and 077.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 2: read the permission string, change it, and watch "Permission denied"<br>
$ echo 'DB_PASSWORD=s3cret' &gt; secrets.env<br>
$ echo 'echo deploy running' &gt; deploy.sh<br>
$ ls -l secrets.env deploy.sh<br>
-rw-r--r-- 1 sv sv 20 Oct 26 12:34 deploy.sh<br>
-rw-r--r-- 1 sv sv 19 Oct 26 12:34 secrets.env<br>
$ ./deploy.sh<br>
bash: ./deploy.sh: Permission denied<br>
$ chmod u+x deploy.sh<br>
$ ./deploy.sh<br>
deploy running<br>
# Octal: r=4 w=2 x=1<br>
$ chmod 640 secrets.env<br>
$ stat -c '%a %A %U:%G %n' secrets.env deploy.sh<br>
640 -rw-r----- sv:sv secrets.env<br>
744 -rwxr--r-- sv:sv deploy.sh<br>
$ chmod 000 secrets.env<br>
$ cat secrets.env<br>
cat: secrets.env: Permission denied<br>
$ chmod 600 secrets.env<br>
$ cat secrets.env<br>
DB_PASSWORD=s3cret<br>
# A directory needs x to be entered, r to be listed<br>
$ mkdir cua &amp;&amp; echo hi &gt; cua/a.txt<br>
$ chmod -x cua<br>
$ cat cua/a.txt<br>
cat: cua/a.txt: Permission denied<br>
$ ls cua<br>
a.txt<br>
$ chmod +x cua &amp;&amp; chmod -r cua<br>
$ ls cua<br>
ls: cannot open directory 'cua': Permission denied<br>
$ cat cua/a.txt<br>
hi<br>
$ chmod 755 cua<br>
# umask: the permissions a NEW file does not get<br>
$ umask<br>
0022<br>
$ touch f-022 &amp;&amp; mkdir d-022<br>
$ umask 077<br>
$ touch f-077 &amp;&amp; mkdir d-077<br>
$ stat -c '%a %n' f-022 d-022 f-077 d-077<br>
644 f-022<br>
755 d-022<br>
600 f-077<br>
700 d-077</div>
<ul>
<li><strong>Reading</strong> <code>-rw-r--r--</code>: the first character is the type (<code>-</code> file, <code>d</code> folder, <code>l</code> link); then three triples for <strong>u</strong>ser (owner), <strong>g</strong>roup and <strong>o</strong>thers. <code>r</code>=4, <code>w</code>=2, <code>x</code>=1, so <code>rw-r--r--</code> is <code>644</code>. A new file has no <code>x</code>, which is why the script was refused: <code>bash: ./deploy.sh: Permission denied</code>. <code>chmod u+x</code> adds it for the owner only (now <code>744</code>).</li>
<li><code>640</code> = owner read/write, group read, others nothing — a good default for a secrets file. With <code>000</code> even the owner gets <code>Permission denied</code> (the owner can still <code>chmod</code> it back, since owning the file is what allows <code>chmod</code>; <code>root</code> ignores these bits altogether).</li>
<li><strong>Folders mean something different.</strong> <code>x</code> = may <em>enter</em> (reach the names inside); <code>r</code> = may <em>list</em> the names. Without <code>x</code> the file <code>cua/a.txt</code> is unreachable even though <code>ls</code> still lists the name; without <code>r</code> (but with <code>x</code>) you cannot list, but <code>cat cua/a.txt</code> works if you already know the name. This is how a "drop box" folder is built.</li>
<li><strong>umask</strong> is the set of bits a <em>new</em> file is <em>not</em> given. Files start from <code>666</code> and folders from <code>777</code>; <code>022</code> removes group/other write → <code>644</code> and <code>755</code>; <code>077</code> removes everything for group and others → <code>600</code> and <code>700</code>. It only affects the shell it is set in. Services started by <code>systemd</code> have their own <code>UMask=</code>.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 2 — khoá kín tệp bí mật (15 phút)</h3>
<p><strong>Tình huống.</strong> <code>secrets.env</code> chứa mật khẩu CSDL và <code>deploy.sh</code> phải chạy được — nhưng hiện một script mới tạo báo <code>Permission denied</code>. Với tư cách người dùng thường: (a) đọc chuỗi <code>ls -l</code> và chạy <code>./deploy.sh</code> trước và sau <code>chmod u+x</code>; (b) đặt <code>secrets.env</code> thành <code>640</code>, rồi <code>000</code>, và chỉ ra ai còn đọc được; (c) tạo một thư mục, bỏ bit <code>x</code> rồi bỏ bit <code>r</code> của nó và xem <code>cat</code>, <code>ls</code> còn làm được gì; (d) so sánh quyền tệp và thư mục mới sinh ra dưới <code>umask</code> 022 và 077.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 2: đọc chuỗi quyền, đổi nó, và xem "Permission denied"<br>
$ echo 'DB_PASSWORD=s3cret' &gt; secrets.env<br>
$ echo 'echo deploy running' &gt; deploy.sh<br>
$ ls -l secrets.env deploy.sh<br>
-rw-r--r-- 1 sv sv 20 Oct 26 12:34 deploy.sh<br>
-rw-r--r-- 1 sv sv 19 Oct 26 12:34 secrets.env<br>
$ ./deploy.sh<br>
bash: ./deploy.sh: Permission denied<br>
$ chmod u+x deploy.sh<br>
$ ./deploy.sh<br>
deploy running<br>
# Số bát phân: r=4 w=2 x=1<br>
$ chmod 640 secrets.env<br>
$ stat -c '%a %A %U:%G %n' secrets.env deploy.sh<br>
640 -rw-r----- sv:sv secrets.env<br>
744 -rwxr--r-- sv:sv deploy.sh<br>
$ chmod 000 secrets.env<br>
$ cat secrets.env<br>
cat: secrets.env: Permission denied<br>
$ chmod 600 secrets.env<br>
$ cat secrets.env<br>
DB_PASSWORD=s3cret<br>
# Thư mục cần x để đi vào, r để liệt kê<br>
$ mkdir cua &amp;&amp; echo hi &gt; cua/a.txt<br>
$ chmod -x cua<br>
$ cat cua/a.txt<br>
cat: cua/a.txt: Permission denied<br>
$ ls cua<br>
a.txt<br>
$ chmod +x cua &amp;&amp; chmod -r cua<br>
$ ls cua<br>
ls: cannot open directory 'cua': Permission denied<br>
$ cat cua/a.txt<br>
hi<br>
$ chmod 755 cua<br>
# umask: những quyền mà tệp MỚI không có<br>
$ umask<br>
0022<br>
$ touch f-022 &amp;&amp; mkdir d-022<br>
$ umask 077<br>
$ touch f-077 &amp;&amp; mkdir d-077<br>
$ stat -c '%a %n' f-022 d-022 f-077 d-077<br>
644 f-022<br>
755 d-022<br>
600 f-077<br>
700 d-077</div>
<ul>
<li><strong>Đọc</strong> <code>-rw-r--r--</code>: ký tự đầu là loại (<code>-</code> tệp, <code>d</code> thư mục, <code>l</code> liên kết); rồi ba bộ ba cho <strong>u</strong>ser (chủ), <strong>g</strong>roup (nhóm) và <strong>o</strong>thers (người khác). <code>r</code>=4, <code>w</code>=2, <code>x</code>=1 nên <code>rw-r--r--</code> là <code>644</code>. Tệp mới không có <code>x</code>, vì thế script bị từ chối: <code>bash: ./deploy.sh: Permission denied</code>. <code>chmod u+x</code> thêm quyền đó chỉ cho chủ (giờ là <code>744</code>).</li>
<li><code>640</code> = chủ đọc/ghi, nhóm đọc, người khác không gì cả — mặc định tốt cho tệp bí mật. Với <code>000</code> ngay cả chủ cũng nhận <code>Permission denied</code> (chủ vẫn <code>chmod</code> lại được, vì làm chủ tệp là điều kiện để <code>chmod</code>; còn <code>root</code> bỏ qua các bit này hoàn toàn).</li>
<li><strong>Với thư mục, ý nghĩa khác.</strong> <code>x</code> = được <em>đi vào</em> (chạm tới các tên bên trong); <code>r</code> = được <em>liệt kê</em> các tên. Không có <code>x</code> thì <code>cua/a.txt</code> không với tới được dù <code>ls</code> vẫn liệt kê tên; không có <code>r</code> (nhưng có <code>x</code>) thì không liệt kê được, song <code>cat cua/a.txt</code> vẫn chạy nếu bạn đã biết tên. Đó là cách làm thư mục "hộp thả thư".</li>
<li><strong>umask</strong> là tập các bit mà tệp <em>mới</em> <em>không</em> được cấp. Tệp bắt đầu từ <code>666</code>, thư mục từ <code>777</code>; <code>022</code> bỏ quyền ghi của nhóm/người khác → <code>644</code> và <code>755</code>; <code>077</code> bỏ mọi quyền của nhóm và người khác → <code>600</code> và <code>700</code>. Nó chỉ ảnh hưởng tới shell đặt ra nó. Dịch vụ do <code>systemd</code> khởi động có <code>UMask=</code> riêng.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 3 — a deploy user, a group and a shared folder (20 min)</h3>
<p><strong>Situation.</strong> Two developers (<code>deploy</code> and <code>an</code>) must edit the files in <code>/srv/site</code>; the contractor <code>khach</code> must see nothing. As <code>root</code>: create the group <code>webteam</code> and the three users; make <code>/srv/site</code> owned by <code>deploy:webteam</code>, with mode <code>2770</code>; then test as each user. Expect one surprise: <code>an</code> cannot append to the file <code>deploy</code> created — find out why and fix it. Finally show that a normal user may not give a file away.</p>
<details><summary>Solution — run for real</summary>
<div class="out"># Exercise 3: a deploy user, a group, and a shared folder<br>
$ id<br>
uid=0(root) gid=0(root) groups=0(root)<br>
# Who exists? Format: name:x:uid:gid:comment:home:shell<br>
$ grep -E '^(root|www-data|nobody):' /etc/passwd<br>
root:x:0:0:root:/root:/bin/bash<br>
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin<br>
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin<br>
$ groupadd webteam<br>
$ useradd -m -s /bin/bash -G webteam deploy<br>
$ useradd -m -s /bin/bash -G webteam an<br>
$ useradd -m -s /bin/bash khach<br>
$ id deploy<br>
uid=1001(deploy) gid=1002(deploy) groups=1002(deploy),1001(webteam)<br>
$ id khach<br>
uid=1003(khach) gid=1004(khach) groups=1004(khach)<br>
$ getent group webteam<br>
webteam:x:1001:deploy,an<br>
# A folder owned by deploy, writable by the group, not even readable by others<br>
$ mkdir /srv/site<br>
$ chown deploy:webteam /srv/site<br>
$ chmod 2770 /srv/site<br>
$ ls -ld /srv/site<br>
drwxrws--- 2 deploy webteam 4096 Oct 26 13:05 /srv/site<br>
# Test as three different users<br>
$ su -s /bin/bash deploy -c 'echo "from deploy" &gt; /srv/site/index.html'<br>
$ su -s /bin/bash an -c 'echo "from an" &gt;&gt; /srv/site/index.html'<br>
bash: line 1: /srv/site/index.html: Permission denied<br>
# The file is 644: the group may read it but not write. Fix the FILE mode, not the folder<br>
$ chmod g+w /srv/site/index.html<br>
$ su -s /bin/bash an -c 'echo "from an" &gt;&gt; /srv/site/index.html'<br>
$ su -s /bin/bash khach -c 'cat /srv/site/index.html'<br>
cat: /srv/site/index.html: Permission denied<br>
$ su -s /bin/bash khach -c 'ls /srv/site'<br>
ls: cannot open directory '/srv/site': Permission denied<br>
$ ls -l /srv/site<br>
total 4<br>
-rw-rw-r-- 1 deploy webteam 20 Oct 26 13:05 index.html<br>
$ cat /srv/site/index.html<br>
from deploy<br>
from an<br>
# Change the owner of one file; a normal user may not<br>
$ chown khach /srv/site/index.html<br>
$ ls -l /srv/site/index.html<br>
-rw-rw-r-- 1 khach webteam 20 Oct 26 13:05 /srv/site/index.html<br>
$ su -s /bin/bash an -c 'chown an /srv/site/index.html'<br>
chown: changing ownership of '/srv/site/index.html': Operation not permitted</div>
<ul>
<li><code>/etc/passwd</code> lines are <code>name:x:uid:gid:comment:home:shell</code>. Service accounts such as <code>www-data</code> and <code>nobody</code> have the shell <code>/usr/sbin/nologin</code>: nobody can log in as them, but a web server can run <em>as</em> them with minimal rights.</li>
<li><code>useradd -m -s /bin/bash -G webteam deploy</code>: <code>-m</code> creates the home folder, <code>-s</code> sets the shell, <code>-G</code> adds <em>supplementary</em> groups. <code>id deploy</code> shows its own group <code>deploy</code> plus <code>webteam</code>; <code>khach</code> is in neither.</li>
<li><code>2770</code>: the leading <code>2</code> is the <strong>setgid</strong> bit on a folder (the <code>s</code> in <code>drwxrws---</code>) — new files inside inherit the group <code>webteam</code> instead of the creator's own group. <code>770</code> = owner and group everything, others nothing; so <code>khach</code> gets <code>Permission denied</code> even for <code>ls</code>.</li>
<li><strong>The surprise.</strong> The first append by <code>an</code> failed although <code>an</code> is in the group and the folder is group-writable. Reason: writing a file needs the permission <em>of the file</em>, and <code>deploy</code> created it with <code>umask</code> 022 → <code>644</code>, so the group could read but not write. Fix the <strong>file</strong> (<code>chmod g+w</code>), or better, make the writers use <code>umask 002</code> so that every new file is <code>664</code>. The folder permission only decides who may create, delete and rename entries.</li>
<li>Only <code>root</code> may <code>chown</code> a file to someone else: <code>chown: changing ownership … Operation not permitted</code> for <code>an</code>. This is on purpose (otherwise a user could dodge disk quotas by giving files away).</li>
</ul>
<p>In real life never share a password between developers: create one account per person, put them in a group, and use <code>sudo</code> for the few commands that need <code>root</code>.</p>
</details>`,
    `<h3>🧪 Bài 3 — người dùng deploy, một nhóm và thư mục dùng chung (20 phút)</h3>
<p><strong>Tình huống.</strong> Hai lập trình viên (<code>deploy</code> và <code>an</code>) phải sửa tệp trong <code>/srv/site</code>; nhân viên thuê ngoài <code>khach</code> không được thấy gì. Với tư cách <code>root</code>: tạo nhóm <code>webteam</code> và ba người dùng; đặt <code>/srv/site</code> thuộc <code>deploy:webteam</code> với quyền <code>2770</code>; rồi thử bằng từng người. Sẽ có một bất ngờ: <code>an</code> không nối thêm được vào tệp do <code>deploy</code> tạo — tìm lý do và sửa. Cuối cùng chứng minh người dùng thường không được "tặng" tệp cho người khác.</p>
<details><summary>Lời giải — chạy thật</summary>
<div class="out"># Bài 3: người dùng deploy, một nhóm, và thư mục dùng chung<br>
$ id<br>
uid=0(root) gid=0(root) groups=0(root)<br>
# Ai có mặt? Định dạng: tên:x:uid:gid:ghi chú:thư mục nhà:shell<br>
$ grep -E '^(root|www-data|nobody):' /etc/passwd<br>
root:x:0:0:root:/root:/bin/bash<br>
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin<br>
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin<br>
$ groupadd webteam<br>
$ useradd -m -s /bin/bash -G webteam deploy<br>
$ useradd -m -s /bin/bash -G webteam an<br>
$ useradd -m -s /bin/bash khach<br>
$ id deploy<br>
uid=1001(deploy) gid=1002(deploy) groups=1002(deploy),1001(webteam)<br>
$ id khach<br>
uid=1003(khach) gid=1004(khach) groups=1004(khach)<br>
$ getent group webteam<br>
webteam:x:1001:deploy,an<br>
# Thư mục của deploy, nhóm ghi được, người ngoài không đọc được<br>
$ mkdir /srv/site<br>
$ chown deploy:webteam /srv/site<br>
$ chmod 2770 /srv/site<br>
$ ls -ld /srv/site<br>
drwxrws--- 2 deploy webteam 4096 Oct 26 13:05 /srv/site<br>
# Thử với ba người khác nhau<br>
$ su -s /bin/bash deploy -c 'echo "from deploy" &gt; /srv/site/index.html'<br>
$ su -s /bin/bash an -c 'echo "from an" &gt;&gt; /srv/site/index.html'<br>
bash: line 1: /srv/site/index.html: Permission denied<br>
# Tệp là 644: nhóm đọc được nhưng không ghi được. Sửa quyền của TỆP, không phải thư mục<br>
$ chmod g+w /srv/site/index.html<br>
$ su -s /bin/bash an -c 'echo "from an" &gt;&gt; /srv/site/index.html'<br>
$ su -s /bin/bash khach -c 'cat /srv/site/index.html'<br>
cat: /srv/site/index.html: Permission denied<br>
$ su -s /bin/bash khach -c 'ls /srv/site'<br>
ls: cannot open directory '/srv/site': Permission denied<br>
$ ls -l /srv/site<br>
total 4<br>
-rw-rw-r-- 1 deploy webteam 20 Oct 26 13:05 index.html<br>
$ cat /srv/site/index.html<br>
from deploy<br>
from an<br>
# Đổi chủ một tệp; người dùng thường không được<br>
$ chown khach /srv/site/index.html<br>
$ ls -l /srv/site/index.html<br>
-rw-rw-r-- 1 khach webteam 20 Oct 26 13:05 /srv/site/index.html<br>
$ su -s /bin/bash an -c 'chown an /srv/site/index.html'<br>
chown: changing ownership of '/srv/site/index.html': Operation not permitted</div>
<ul>
<li>Mỗi dòng của <code>/etc/passwd</code> có dạng <code>tên:x:uid:gid:ghi chú:thư mục nhà:shell</code>. Tài khoản dịch vụ như <code>www-data</code>, <code>nobody</code> có shell <code>/usr/sbin/nologin</code>: không ai đăng nhập bằng chúng được, nhưng web server chạy <em>dưới tên</em> chúng với quyền tối thiểu.</li>
<li><code>useradd -m -s /bin/bash -G webteam deploy</code>: <code>-m</code> tạo thư mục nhà, <code>-s</code> đặt shell, <code>-G</code> thêm các nhóm <em>phụ</em>. <code>id deploy</code> hiện nhóm riêng <code>deploy</code> cùng <code>webteam</code>; <code>khach</code> không thuộc nhóm nào trong hai nhóm đó.</li>
<li><code>2770</code>: số <code>2</code> đứng đầu là bit <strong>setgid</strong> trên thư mục (chữ <code>s</code> trong <code>drwxrws---</code>) — tệp mới tạo bên trong thừa kế nhóm <code>webteam</code> thay vì nhóm riêng của người tạo. <code>770</code> = chủ và nhóm toàn quyền, người khác không gì cả; nên <code>khach</code> nhận <code>Permission denied</code> kể cả với <code>ls</code>.</li>
<li><strong>Bất ngờ.</strong> Lần nối thêm đầu tiên của <code>an</code> thất bại dù <code>an</code> thuộc nhóm và thư mục cho nhóm ghi. Lý do: ghi vào tệp cần quyền <em>của tệp</em>, mà <code>deploy</code> tạo nó với <code>umask</code> 022 → <code>644</code>, nên nhóm đọc được nhưng không ghi được. Sửa <strong>tệp</strong> (<code>chmod g+w</code>), hoặc tốt hơn, cho những người ghi dùng <code>umask 002</code> để mọi tệp mới là <code>664</code>. Quyền của thư mục chỉ quyết định ai được tạo, xoá, đổi tên các mục bên trong.</li>
<li>Chỉ <code>root</code> mới <code>chown</code> tệp cho người khác: <code>an</code> nhận <code>chown: changing ownership … Operation not permitted</code>. Cố ý như vậy (nếu không, người dùng có thể lách hạn ngạch đĩa bằng cách tặng tệp đi).</li>
</ul>
<p>Ngoài đời đừng bao giờ dùng chung một mật khẩu giữa các lập trình viên: mỗi người một tài khoản, gom vào một nhóm, và dùng <code>sudo</code> cho vài lệnh cần <code>root</code>.</p>
</details>`),
    bi(`<h3>🧪 Exercise 4 — find files, find text (20 min)</h3>
<p><strong>Situation.</strong> You inherit a project <code>~/site</code> and must answer from the terminal: which <code>.js</code> files exist; which folders; which file is larger than 2 KB; which file has not been touched for 7 days; which file is world-writable (<code>777</code>, a security smell); how many lines each log has; which source files still contain <code>TODO</code> and on which line; how many <code>ERROR</code> lines the log has and what surrounds the slow query.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 4: find FILES by name/type/size/age/permission<br>
$ cd site<br>
$ find . -type f -name '*.js'<br>
./dist/bundle.js<br>
./src/server.js<br>
./src/db.js<br>
$ find . -type d<br>
.<br>
./dist<br>
./src<br>
./logs<br>
$ find . -type f -size +2k<br>
./dist/bundle.js<br>
$ find . -type f -mtime +7<br>
./logs/old.log<br>
$ find . -type f -perm 777<br>
./dist/style.css<br>
# find + action<br>
$ find . -name '*.log' -exec wc -l {} \\;<br>
4 ./logs/app.log<br>
4 ./logs/old.log<br>
$ find . -name '*.js' | xargs grep -l TODO<br>
./src/server.js<br>
./src/db.js<br>
# grep: search INSIDE files<br>
$ grep -rn TODO .<br>
./src/server.js:2:// TODO: read PORT from env<br>
./src/db.js:2: &nbsp;// TODO: retry<br>
$ grep -rin 'error' logs/app.log<br>
2:2026-10-26 10:00:05 ERROR db timeout<br>
4:2026-10-26 10:02:30 ERROR db timeout<br>
$ grep -c ERROR logs/app.log<br>
2<br>
$ grep -v INFO logs/app.log<br>
2026-10-26 10:00:05 ERROR db timeout<br>
2026-10-26 10:01:00 WARN slow query<br>
2026-10-26 10:02:30 ERROR db timeout<br>
$ grep -E 'ERROR|WARN' logs/app.log<br>
2026-10-26 10:00:05 ERROR db timeout<br>
2026-10-26 10:01:00 WARN slow query<br>
2026-10-26 10:02:30 ERROR db timeout<br>
$ grep -B1 -A1 'slow' logs/app.log<br>
2026-10-26 10:00:05 ERROR db timeout<br>
2026-10-26 10:01:00 WARN slow query<br>
2026-10-26 10:02:30 ERROR db timeout<br>
$ grep -rl 'port' --include='*.js' .<br>
./src/server.js</div>
<ul>
<li><strong><code>find</code> searches by file attributes</strong>: <code>-name</code> (quote the pattern so the shell does not expand it first), <code>-type f|d</code>, <code>-size +2k</code>, <code>-mtime +7</code> (modified more than 7 days ago), <code>-perm 777</code>. <code>-exec cmd {} \\;</code> runs a command per match; <code>| xargs cmd</code> passes many matches to one command (use <code>-print0 | xargs -0</code> when names may contain spaces).</li>
<li><strong><code>grep</code> searches inside files</strong>: <code>-r</code> recurse, <code>-n</code> line numbers, <code>-i</code> ignore case, <code>-c</code> count lines, <code>-v</code> invert, <code>-E</code> extended regex (<code>ERROR|WARN</code>), <code>-l</code> only names of matching files, <code>-B1 -A1</code> context lines, <code>--include</code> limit by name.</li>
<li>The two tools answer different questions: "<em>which file?</em>" → <code>find</code>; "<em>which line?</em>" → <code>grep</code>. They combine: <code>find … | xargs grep -l TODO</code>.</li>
<li>Note the order of <code>find</code>'s output: it is the order of the directory, not alphabetical. Add <code>| sort</code> when order matters.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 4 — tìm tệp, tìm chữ (20 phút)</h3>
<p><strong>Tình huống.</strong> Bạn nhận lại dự án <code>~/site</code> và phải trả lời ngay trên terminal: có những tệp <code>.js</code> nào; có thư mục nào; tệp nào lớn hơn 2 KB; tệp nào 7 ngày chưa đụng tới; tệp nào ai cũng ghi được (<code>777</code>, dấu hiệu nguy hiểm); mỗi log có bao nhiêu dòng; tệp nguồn nào còn <code>TODO</code> và ở dòng nào; log có bao nhiêu dòng <code>ERROR</code> và quanh câu truy vấn chậm có gì.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 4: find TỆP theo tên/loại/cỡ/tuổi/quyền<br>
$ cd site<br>
$ find . -type f -name '*.js'<br>
./dist/bundle.js<br>
./src/server.js<br>
./src/db.js<br>
$ find . -type d<br>
.<br>
./dist<br>
./src<br>
./logs<br>
$ find . -type f -size +2k<br>
./dist/bundle.js<br>
$ find . -type f -mtime +7<br>
./logs/old.log<br>
$ find . -type f -perm 777<br>
./dist/style.css<br>
# find kèm hành động<br>
$ find . -name '*.log' -exec wc -l {} \\;<br>
4 ./logs/app.log<br>
4 ./logs/old.log<br>
$ find . -name '*.js' | xargs grep -l TODO<br>
./src/server.js<br>
./src/db.js<br>
# grep: tìm BÊN TRONG tệp<br>
$ grep -rn TODO .<br>
./src/server.js:2:// TODO: read PORT from env<br>
./src/db.js:2: &nbsp;// TODO: retry<br>
$ grep -rin 'error' logs/app.log<br>
2:2026-10-26 10:00:05 ERROR db timeout<br>
4:2026-10-26 10:02:30 ERROR db timeout<br>
$ grep -c ERROR logs/app.log<br>
2<br>
$ grep -v INFO logs/app.log<br>
2026-10-26 10:00:05 ERROR db timeout<br>
2026-10-26 10:01:00 WARN slow query<br>
2026-10-26 10:02:30 ERROR db timeout<br>
$ grep -E 'ERROR|WARN' logs/app.log<br>
2026-10-26 10:00:05 ERROR db timeout<br>
2026-10-26 10:01:00 WARN slow query<br>
2026-10-26 10:02:30 ERROR db timeout<br>
$ grep -B1 -A1 'slow' logs/app.log<br>
2026-10-26 10:00:05 ERROR db timeout<br>
2026-10-26 10:01:00 WARN slow query<br>
2026-10-26 10:02:30 ERROR db timeout<br>
$ grep -rl 'port' --include='*.js' .<br>
./src/server.js</div>
<ul>
<li><strong><code>find</code> tìm theo thuộc tính của tệp</strong>: <code>-name</code> (đặt mẫu trong nháy để shell không bung nó trước), <code>-type f|d</code>, <code>-size +2k</code>, <code>-mtime +7</code> (sửa cách đây hơn 7 ngày), <code>-perm 777</code>. <code>-exec lệnh {} \\;</code> chạy một lệnh cho mỗi kết quả; <code>| xargs lệnh</code> đưa nhiều kết quả vào một lệnh (dùng <code>-print0 | xargs -0</code> khi tên có thể chứa dấu cách).</li>
<li><strong><code>grep</code> tìm bên trong tệp</strong>: <code>-r</code> đệ quy, <code>-n</code> số dòng, <code>-i</code> không phân biệt hoa thường, <code>-c</code> đếm dòng, <code>-v</code> đảo, <code>-E</code> regex mở rộng (<code>ERROR|WARN</code>), <code>-l</code> chỉ tên tệp khớp, <code>-B1 -A1</code> dòng ngữ cảnh, <code>--include</code> giới hạn theo tên.</li>
<li>Hai công cụ trả lời hai câu hỏi khác nhau: "<em>tệp nào?</em>" → <code>find</code>; "<em>dòng nào?</em>" → <code>grep</code>. Chúng kết hợp được: <code>find … | xargs grep -l TODO</code>.</li>
<li>Để ý thứ tự kết quả của <code>find</code>: đó là thứ tự trong thư mục, không phải thứ tự chữ cái. Thêm <code>| sort</code> khi cần thứ tự.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 5 — interrogate a web server log with pipes (20 min)</h3>
<p><strong>Situation.</strong> <code>access.log</code> has one request per line: <code>IP METHOD PATH STATUS</code>. Using only pipelines: count the requests; count each status code; list the two IPs that send most; count failed logins (<code>401</code>) per IP. Then: save the <code>500</code> lines to a file and append a note; send an error message to a file; split a stream into a file and a counter with <code>tee</code>. Finally explain why you must <code>sort</code> before <code>uniq</code>.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 5: answer questions about a web server log with pipes<br>
$ wc -l access.log<br>
8 access.log<br>
$ cut -d' ' -f4 access.log | sort | uniq -c<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 200<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 401<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 500<br>
$ echo "--- which IP sends the most requests?"<br>
--- which IP sends the most requests?<br>
$ cut -d' ' -f1 access.log | sort | uniq -c | sort -rn | head -2<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 10.0.0.5<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 10.0.0.9<br>
$ echo "--- failed logins (401) per IP"<br>
--- failed logins (401) per IP<br>
$ grep ' 401$' access.log | cut -d' ' -f1 | sort | uniq -c<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 10.0.0.5<br>
# Redirects: &gt; overwrite, &gt;&gt; append, 2&gt; errors, &lt; input<br>
$ grep ' 500$' access.log &gt; errors.txt<br>
$ echo "extra line" &gt;&gt; errors.txt<br>
$ wc -l &lt; errors.txt<br>
3<br>
$ ls /khong-co 2&gt; err.txt; cat err.txt<br>
ls: cannot access '/khong-co': No such file or directory<br>
$ grep 200 access.log | tee ok.txt | wc -l<br>
4<br>
# Why 'sort | uniq' and not 'uniq' alone<br>
$ cut -d' ' -f4 access.log | uniq -c<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 200<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 401<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 500<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 401<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 200<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 500</div>
<ul>
<li>The grammar of a "log question" is almost always <strong>select → extract → group → count → rank</strong>: <code>grep</code> (select lines) · <code>cut -d' ' -f4</code> (extract a column) · <code>sort | uniq -c</code> (group and count) · <code>sort -rn | head</code> (rank). Learn it once, use it on any log.</li>
<li>Reading the answers: 4 requests with status 200, 2 with 401, 2 with 500; <code>10.0.0.5</code> sent 4 requests and <em>all</em> of its 401 responses — two failed logins from one IP is the start of a brute-force pattern.</li>
<li><code>&gt;</code> overwrites, <code>&gt;&gt;</code> appends, <code>2&gt;</code> redirects stderr, <code>&lt;</code> feeds a file to stdin (<code>wc -l &lt; errors.txt</code> prints only the number, without the file name). <code>tee</code> copies its input to a file <em>and</em> to stdout, so the pipeline continues. (Order of <code>2&gt;&amp;1</code> and fds: CS.2 exercise 3.)</li>
<li><strong><code>uniq</code> only merges <em>adjacent</em> equal lines.</strong> Without <code>sort</code>, the last command printed six groups instead of three. This is the most common mistake of beginners with <code>uniq -c</code>.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 5 — tra hỏi log web server bằng pipe (20 phút)</h3>
<p><strong>Tình huống.</strong> <code>access.log</code> mỗi dòng một request: <code>IP PHƯƠNG_THỨC ĐƯỜNG_DẪN MÃ</code>. Chỉ dùng pipeline: đếm số request; đếm từng mã trạng thái; liệt kê hai IP gửi nhiều nhất; đếm số lần đăng nhập thất bại (<code>401</code>) theo IP. Sau đó: lưu các dòng <code>500</code> ra tệp rồi nối thêm một ghi chú; chuyển thông báo lỗi vào tệp; tách một luồng thành tệp và bộ đếm bằng <code>tee</code>. Cuối cùng giải thích vì sao phải <code>sort</code> trước <code>uniq</code>.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 5: trả lời câu hỏi về log web server bằng pipe<br>
$ wc -l access.log<br>
8 access.log<br>
$ cut -d' ' -f4 access.log | sort | uniq -c<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 200<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 401<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 500<br>
$ echo "--- which IP sends the most requests?"<br>
--- which IP sends the most requests?<br>
$ cut -d' ' -f1 access.log | sort | uniq -c | sort -rn | head -2<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;4 10.0.0.5<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 10.0.0.9<br>
$ echo "--- failed logins (401) per IP"<br>
--- failed logins (401) per IP<br>
$ grep ' 401$' access.log | cut -d' ' -f1 | sort | uniq -c<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 10.0.0.5<br>
# Chuyển hướng: &gt; ghi đè, &gt;&gt; nối thêm, 2&gt; lỗi, &lt; đầu vào<br>
$ grep ' 500$' access.log &gt; errors.txt<br>
$ echo "extra line" &gt;&gt; errors.txt<br>
$ wc -l &lt; errors.txt<br>
3<br>
$ ls /khong-co 2&gt; err.txt; cat err.txt<br>
ls: cannot access '/khong-co': No such file or directory<br>
$ grep 200 access.log | tee ok.txt | wc -l<br>
4<br>
# Vì sao 'sort | uniq' chứ không 'uniq' một mình<br>
$ cut -d' ' -f4 access.log | uniq -c<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 200<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 401<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 500<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 401<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2 200<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 500</div>
<ul>
<li>"Văn phạm" của một câu hỏi về log gần như luôn là <strong>chọn → trích → gom → đếm → xếp hạng</strong>: <code>grep</code> (chọn dòng) · <code>cut -d' ' -f4</code> (trích một cột) · <code>sort | uniq -c</code> (gom và đếm) · <code>sort -rn | head</code> (xếp hạng). Học một lần, dùng cho mọi log.</li>
<li>Đọc đáp án: 4 request mã 200, 2 mã 401, 2 mã 500; <code>10.0.0.5</code> gửi 4 request và có <em>cả</em> hai phản hồi 401 — hai lần đăng nhập sai từ một IP là khởi đầu của mẫu dò mật khẩu.</li>
<li><code>&gt;</code> ghi đè, <code>&gt;&gt;</code> nối thêm, <code>2&gt;</code> chuyển stderr, <code>&lt;</code> đưa tệp vào stdin (<code>wc -l &lt; errors.txt</code> chỉ in con số, không kèm tên tệp). <code>tee</code> sao chép đầu vào vào tệp <em>và</em> ra stdout, nên pipeline tiếp tục. (Thứ tự của <code>2&gt;&amp;1</code> và các fd: bài 3 của CS.2.)</li>
<li><strong><code>uniq</code> chỉ gộp các dòng giống nhau <em>liền kề</em>.</strong> Không có <code>sort</code>, lệnh cuối in ra sáu nhóm thay vì ba. Đây là lỗi phổ biến nhất của người mới với <code>uniq -c</code>.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 6 — read a log that keeps growing (10 min)</h3>
<p><strong>Situation.</strong> The application writes <code>app.log</code> all day. You want the first 3 lines, the last 3, then to <em>watch</em> new lines as they arrive, to print lines 5–7 and to find lines 10–12 with their line numbers — without opening an editor.</p>
<details><summary>Solution — 🎲 one real run (a background job appends a line while <code>tail -f</code> watches)</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 6: read a growing log without opening an editor<br>
$ head -n 3 app.log<br>
line 1<br>
line 2<br>
line 3<br>
$ tail -n 3 app.log<br>
line 18<br>
line 19<br>
line 20<br>
# tail -f follows the end of the file; here a background job appends one line<br>
$ (sleep 0.5; echo "new line arrived" &gt;&gt; app.log) &amp;<br>
$ timeout 1.5 tail -n 2 -f app.log<br>
line 19<br>
line 20<br>
new line arrived<br>
$ echo "tail exit code: $?"<br>
tail exit code: 124<br>
# Page through a file: less is interactive, so here are its non-interactive cousins<br>
$ sed -n '5,7p' app.log<br>
line 5<br>
line 6<br>
line 7<br>
$ less -FX app.log | head -n 2<br>
line 1<br>
line 2<br>
$ wc -l app.log<br>
21 app.log<br>
$ grep -n 'line 1[0-2]' app.log<br>
10:line 10<br>
11:line 11<br>
12:line 12</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<ul>
<li><code>head -n N</code> / <code>tail -n N</code> show the start / end. For a log the <em>end</em> is where the news is.</li>
<li><code>tail -f</code> (or <code>-F</code>, which survives log rotation) never exits by itself: it keeps the file open and prints what is appended. Here <code>timeout 1.5</code> stopped it and the exit code was <strong>124</strong> — the code <code>timeout</code> uses for "I killed it". On a real server you press <kbd>Ctrl</kbd>+<kbd>C</kbd>.</li>
<li><code>sed -n '5,7p'</code> prints only lines 5–7 (<code>-n</code> turns off automatic printing, <code>p</code> prints). <code>grep -n</code> adds line numbers.</li>
<li><code>less</code> is the pager for big files: <kbd>Space</kbd>/<kbd>b</kbd> page down/up, <code>/text</code> searches forward, <kbd>n</kbd> next match, <kbd>G</kbd> end, <kbd>g</kbd> start, <kbd>F</kbd> follow like <code>tail -f</code>, <kbd>q</kbd> quit. It does not load the whole file, so it opens a 5 GB log instantly; <code>cat</code> on it would flood the terminal. (Here <code>less -FX</code> behaves like <code>cat</code> because its output goes into a pipe.)</li>
</ul>
</details>`,
    `<h3>🧪 Bài 6 — đọc một log đang lớn dần (10 phút)</h3>
<p><strong>Tình huống.</strong> Ứng dụng ghi <code>app.log</code> suốt ngày. Bạn muốn xem 3 dòng đầu, 3 dòng cuối, rồi <em>theo dõi</em> dòng mới khi chúng xuất hiện, in dòng 5–7 và tìm dòng 10–12 kèm số dòng — không mở trình soạn thảo.</p>
<details><summary>Lời giải — 🎲 một lần chạy thật (một job nền nối thêm dòng khi <code>tail -f</code> đang theo dõi)</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 6: đọc log đang lớn dần mà không mở trình soạn thảo<br>
$ head -n 3 app.log<br>
line 1<br>
line 2<br>
line 3<br>
$ tail -n 3 app.log<br>
line 18<br>
line 19<br>
line 20<br>
# tail -f bám theo cuối tệp; ở đây một job nền nối thêm một dòng<br>
$ (sleep 0.5; echo "new line arrived" &gt;&gt; app.log) &amp;<br>
$ timeout 1.5 tail -n 2 -f app.log<br>
line 19<br>
line 20<br>
new line arrived<br>
$ echo "tail exit code: $?"<br>
tail exit code: 124<br>
# Xem từng trang: less cần tương tác, đây là các "anh em" không tương tác<br>
$ sed -n '5,7p' app.log<br>
line 5<br>
line 6<br>
line 7<br>
$ less -FX app.log | head -n 2<br>
line 1<br>
line 2<br>
$ wc -l app.log<br>
21 app.log<br>
$ grep -n 'line 1[0-2]' app.log<br>
10:line 10<br>
11:line 11<br>
12:line 12</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<ul>
<li><code>head -n N</code> / <code>tail -n N</code> hiện phần đầu / cuối. Với log, tin tức nằm ở phần <em>cuối</em>.</li>
<li><code>tail -f</code> (hoặc <code>-F</code>, chịu được việc xoay log) không tự thoát: nó giữ tệp mở và in những gì được nối thêm. Ở đây <code>timeout 1.5</code> dừng nó và mã thoát là <strong>124</strong> — mã <code>timeout</code> dùng để nói "tôi đã giết nó". Trên server thật bạn bấm <kbd>Ctrl</kbd>+<kbd>C</kbd>.</li>
<li><code>sed -n '5,7p'</code> chỉ in dòng 5–7 (<code>-n</code> tắt in tự động, <code>p</code> in). <code>grep -n</code> thêm số dòng.</li>
<li><code>less</code> là trình xem từng trang cho tệp lớn: <kbd>Space</kbd>/<kbd>b</kbd> trang sau/trước, <code>/chữ</code> tìm tới, <kbd>n</kbd> kết quả kế, <kbd>G</kbd> cuối, <kbd>g</kbd> đầu, <kbd>F</kbd> bám theo như <code>tail -f</code>, <kbd>q</kbd> thoát. Nó không nạp cả tệp nên mở log 5 GB tức thì; <code>cat</code> sẽ làm ngập terminal. (Ở đây <code>less -FX</code> hành xử như <code>cat</code> vì đầu ra của nó đi vào một pipe.)</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 7 — pack and compress a release (15 min)</h3>
<p><strong>Situation.</strong> You must send <code>~/site</code> (with a 480 KB log) to a colleague. Compress one file with <code>gzip</code> but keep the original; pack the whole folder into <code>site.tar.gz</code>; list the archive without unpacking; unpack it into a different folder and prove the copy is identical; finally do the same without any temporary file, through a pipe.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 7: archive and compress a release<br>
$ ls -l site/logs/big.log<br>
-rw-r--r-- 1 sv sv 488894 Oct 26 13:05 site/logs/big.log<br>
$ gzip -k site/logs/big.log<br>
$ ls -l site/logs/<br>
total 536<br>
-rw-r--r-- 1 sv sv 488894 Oct 26 13:05 big.log<br>
-rw-r--r-- 1 sv sv &nbsp;53872 Oct 26 13:05 big.log.gz<br>
$ gzip -l site/logs/big.log.gz<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;compressed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;uncompressed &nbsp;ratio uncompressed_name<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;53872 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;488894 &nbsp;89.0% site/logs/big.log<br>
# tar = many files in one; z = gzip; c create, t list, x extract, f file<br>
$ tar czf site.tar.gz site<br>
$ tar tzf site.tar.gz<br>
site/<br>
site/package.json<br>
site/logs/<br>
site/logs/big.log<br>
site/logs/big.log.gz<br>
$ mkdir restore<br>
$ tar xzf site.tar.gz -C restore<br>
$ ls restore/site<br>
logs<br>
package.json<br>
$ diff -r site restore/site &amp;&amp; echo "identical"<br>
identical<br>
# Stream it without writing an intermediate file<br>
$ tar cz site | wc -c<br>
60631<br>
$ tar cz site | tar tz | head -n 3<br>
site/<br>
site/package.json<br>
site/logs/<br>
$ gunzip -c site/logs/big.log.gz | head -n 2<br>
2026-10-26 request 1<br>
2026-10-26 request 2</div>
<ul>
<li><code>gzip</code> compresses <strong>one file</strong>; <code>-k</code> keeps the original (by default it is replaced by <code>.gz</code>). The log went from 488 894 to 53 872 bytes (89 % smaller) because it is highly repetitive text; photos and videos, already compressed, shrink hardly at all.</li>
<li><code>tar</code> packs <strong>many files into one</strong> (it does not compress by itself); the <code>z</code> flag pipes it through gzip. Mnemonic: <code>c</code>reate, <code>t</code>est/list, <code>x</code>tract; <code>z</code> gzip; <code>f</code>ile — and <code>f</code> must be last, followed by the archive name. <code>-C dir</code> unpacks into <code>dir</code>.</li>
<li><code>diff -r a b</code> compares two trees and prints nothing when they are the same; the program's exit code (0 = same) lets <code>&amp;&amp; echo identical</code> work. Always verify a restore once — an untested backup is only a hope.</li>
<li><code>tar cz site | tar tz</code> shows the Unix idea again: <code>tar</code> writes to stdout when no <code>f</code> is given, so archives can flow through <code>ssh</code>, <code>nc</code> or a pipe to another disk without touching your own: <code>tar cz site | ssh vps 'tar xz -C /srv'</code>.</li>
<li>Tar strips the leading <code>/</code> from absolute names for safety; and never unpack an archive from a stranger as <code>root</code> without listing it first (<code>tar tzf</code>) — it may contain <code>../</code> paths.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 7 — đóng gói và nén một bản phát hành (15 phút)</h3>
<p><strong>Tình huống.</strong> Bạn phải gửi <code>~/site</code> (có một log 480 KB) cho đồng nghiệp. Nén một tệp bằng <code>gzip</code> nhưng giữ bản gốc; đóng cả thư mục thành <code>site.tar.gz</code>; liệt kê gói mà không giải nén; giải nén vào thư mục khác và chứng minh bản sao giống hệt; cuối cùng làm điều tương tự mà không cần tệp tạm nào, qua một pipe.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 7: đóng gói và nén một bản phát hành<br>
$ ls -l site/logs/big.log<br>
-rw-r--r-- 1 sv sv 488894 Oct 26 13:05 site/logs/big.log<br>
$ gzip -k site/logs/big.log<br>
$ ls -l site/logs/<br>
total 536<br>
-rw-r--r-- 1 sv sv 488894 Oct 26 13:05 big.log<br>
-rw-r--r-- 1 sv sv &nbsp;53872 Oct 26 13:05 big.log.gz<br>
$ gzip -l site/logs/big.log.gz<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;compressed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;uncompressed &nbsp;ratio uncompressed_name<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;53872 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;488894 &nbsp;89.0% site/logs/big.log<br>
# tar = nhiều tệp thành một; z = gzip; c tạo, t liệt kê, x giải nén, f tệp<br>
$ tar czf site.tar.gz site<br>
$ tar tzf site.tar.gz<br>
site/<br>
site/package.json<br>
site/logs/<br>
site/logs/big.log<br>
site/logs/big.log.gz<br>
$ mkdir restore<br>
$ tar xzf site.tar.gz -C restore<br>
$ ls restore/site<br>
logs<br>
package.json<br>
$ diff -r site restore/site &amp;&amp; echo "identical"<br>
identical<br>
# Truyền thẳng, không ghi tệp trung gian<br>
$ tar cz site | wc -c<br>
60631<br>
$ tar cz site | tar tz | head -n 3<br>
site/<br>
site/package.json<br>
site/logs/<br>
$ gunzip -c site/logs/big.log.gz | head -n 2<br>
2026-10-26 request 1<br>
2026-10-26 request 2</div>
<ul>
<li><code>gzip</code> nén <strong>một tệp</strong>; <code>-k</code> giữ bản gốc (mặc định nó thay tệp bằng <code>.gz</code>). Log giảm từ 488 894 xuống 53 872 byte (nhỏ đi 89 %) vì là văn bản lặp lại rất nhiều; ảnh và video vốn đã nén nên hầu như không nhỏ thêm.</li>
<li><code>tar</code> gói <strong>nhiều tệp thành một</strong> (tự nó không nén); cờ <code>z</code> cho đi qua gzip. Mẹo nhớ: <code>c</code>reate tạo, <code>t</code> liệt kê, <code>x</code>tract giải nén; <code>z</code> gzip; <code>f</code>ile — và <code>f</code> phải đứng cuối, theo sau là tên gói. <code>-C thư_mục</code> giải nén vào thư mục đó.</li>
<li><code>diff -r a b</code> so hai cây và không in gì khi giống nhau; mã thoát của nó (0 = giống) giúp <code>&amp;&amp; echo identical</code> hoạt động. Luôn thử khôi phục ít nhất một lần — bản sao lưu chưa thử chỉ là một niềm hy vọng.</li>
<li><code>tar cz site | tar tz</code> cho thấy lại ý tưởng Unix: <code>tar</code> ghi ra stdout khi không có <code>f</code>, nên gói có thể chảy qua <code>ssh</code>, <code>nc</code> hay một pipe sang đĩa khác mà không đụng đĩa của bạn: <code>tar cz site | ssh vps 'tar xz -C /srv'</code>.</li>
<li>Tar bỏ dấu <code>/</code> đầu ở tên tuyệt đối vì an toàn; và đừng bao giờ giải nén gói của người lạ bằng <code>root</code> khi chưa liệt kê (<code>tar tzf</code>) — nó có thể chứa đường dẫn <code>../</code>.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 8 — hard link, symbolic link, and the zero-downtime release (20 min)</h3>
<p><strong>Situation (part A).</strong> Create <code>data.txt</code>, a hard link <code>hard.txt</code> and a symbolic link <code>soft.txt</code>. Compare their inode numbers and link counts; delete the original and see which copy survives; try to hard-link a folder. <strong>Situation (part B).</strong> Your server runs the code in <code>app/current</code>. Publish version 2 so that there is <em>never</em> a moment when <code>current</code> does not exist, and show how to roll back.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 8: hard link vs symbolic link, then the zero-downtime release trick<br>
$ echo "version one" &gt; data.txt<br>
$ ln data.txt hard.txt<br>
$ ln -s data.txt soft.txt<br>
$ ls -li data.txt hard.txt soft.txt<br>
286837 -rw-r--r-- 2 sv sv 12 Oct 26 12:34 data.txt<br>
286837 -rw-r--r-- 2 sv sv 12 Oct 26 12:34 hard.txt<br>
286939 lrwxrwxrwx 1 sv sv &nbsp;8 Oct 26 12:34 soft.txt -&gt; data.txt<br>
$ stat -c '%h links &nbsp;inode %i &nbsp;%n' data.txt<br>
2 links &nbsp;inode 286837 &nbsp;data.txt<br>
$ rm data.txt<br>
$ cat hard.txt<br>
version one<br>
$ cat soft.txt<br>
cat: soft.txt: No such file or directory<br>
$ ls -l soft.txt<br>
lrwxrwxrwx 1 sv sv 8 Oct 26 12:34 soft.txt -&gt; data.txt<br>
# Hard links cannot cross file systems or point at directories<br>
$ mkdir d<br>
$ ln d d-hard<br>
ln: d: hard link not allowed for directory<br>
# The release trick: 'current' is a symlink, switching is one atomic rename<br>
$ mkdir -p app/releases/v1 app/releases/v2<br>
$ echo "server v1" &gt; app/releases/v1/server.txt<br>
$ echo "server v2" &gt; app/releases/v2/server.txt<br>
$ ln -s releases/v1 app/current<br>
$ cat app/current/server.txt<br>
server v1<br>
$ ln -sfn releases/v2 app/current.tmp &amp;&amp; mv -T app/current.tmp app/current<br>
$ cat app/current/server.txt<br>
server v2<br>
$ readlink app/current<br>
releases/v2<br>
$ readlink -f app/current<br>
/home/sv/app/releases/v2<br>
# Rollback = point it back<br>
$ ln -sfn releases/v1 app/current.tmp &amp;&amp; mv -T app/current.tmp app/current<br>
$ cat app/current/server.txt<br>
server v1</div>
<ul>
<li><strong>Hard link</strong> (<code>ln a b</code>): a second <em>name</em> for the same inode. <code>data.txt</code> and <code>hard.txt</code> show the same inode number and a link count of 2. The data is freed only when the <em>last</em> name is removed — that is why <code>rm data.txt</code> did not hurt <code>hard.txt</code>. (Theory: Chapter 4, slides on i-nodes and links; the inode numbers differ on each run.)</li>
<li><strong>Symbolic link</strong> (<code>ln -s target link</code>): a tiny file that contains a <em>path</em> (<code>soft.txt -&gt; data.txt</code>). It has its own inode, size 8 = the length of "data.txt". When the target is removed, the link <strong>dangles</strong>: <code>cat</code> says <code>No such file or directory</code> although <code>ls -l</code> still shows the link.</li>
<li>Hard links cannot point at folders (<code>hard link not allowed for directory</code>: it would allow loops) and cannot cross file systems; symlinks can do both.</li>
<li><strong>Zero-downtime release.</strong> Never edit the live folder. Put each version in <code>releases/vN</code>; the app runs from <code>current</code>, a symlink. To switch: create a <em>new</em> link <code>current.tmp</code> (<code>ln -sfn</code>) and <code>mv -T</code> it over <code>current</code>. A <code>rename</code> is atomic (Chapter 4; the same idea as CS.2 exercise 6), so a request sees either v1 or v2, never nothing. Rollback is the same command pointing back to v1. This is the layout of Capistrano and of many hand-made deploy scripts. <code>readlink -f</code> resolves the real path.</li>
<li>Why <code>-n</code>? Without it, <code>ln -sf</code> on an existing link to a <em>folder</em> would create the new link <em>inside</em> the folder. With the relative target <code>releases/v2</code>, remember it is relative to the folder that holds the link.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 8 — liên kết cứng, liên kết mềm và phát hành không gián đoạn (20 phút)</h3>
<p><strong>Tình huống (phần A).</strong> Tạo <code>data.txt</code>, liên kết cứng <code>hard.txt</code> và liên kết mềm <code>soft.txt</code>. So số inode và số liên kết; xoá tệp gốc và xem bản nào sống sót; thử tạo liên kết cứng tới một thư mục. <strong>Tình huống (phần B).</strong> Máy chủ chạy mã trong <code>app/current</code>. Hãy phát hành phiên bản 2 sao cho <em>không bao giờ</em> có khoảnh khắc <code>current</code> không tồn tại, và chỉ cách hoàn tác.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 8: liên kết cứng và mềm, rồi mẹo phát hành không gián đoạn<br>
$ echo "version one" &gt; data.txt<br>
$ ln data.txt hard.txt<br>
$ ln -s data.txt soft.txt<br>
$ ls -li data.txt hard.txt soft.txt<br>
286837 -rw-r--r-- 2 sv sv 12 Oct 26 12:34 data.txt<br>
286837 -rw-r--r-- 2 sv sv 12 Oct 26 12:34 hard.txt<br>
286939 lrwxrwxrwx 1 sv sv &nbsp;8 Oct 26 12:34 soft.txt -&gt; data.txt<br>
$ stat -c '%h links &nbsp;inode %i &nbsp;%n' data.txt<br>
2 links &nbsp;inode 286837 &nbsp;data.txt<br>
$ rm data.txt<br>
$ cat hard.txt<br>
version one<br>
$ cat soft.txt<br>
cat: soft.txt: No such file or directory<br>
$ ls -l soft.txt<br>
lrwxrwxrwx 1 sv sv 8 Oct 26 12:34 soft.txt -&gt; data.txt<br>
# Liên kết cứng không vượt hệ thống tệp và không trỏ vào thư mục<br>
$ mkdir d<br>
$ ln d d-hard<br>
ln: d: hard link not allowed for directory<br>
# Mẹo phát hành: 'current' là symlink, đổi bản chỉ là một phép rename nguyên tử<br>
$ mkdir -p app/releases/v1 app/releases/v2<br>
$ echo "server v1" &gt; app/releases/v1/server.txt<br>
$ echo "server v2" &gt; app/releases/v2/server.txt<br>
$ ln -s releases/v1 app/current<br>
$ cat app/current/server.txt<br>
server v1<br>
$ ln -sfn releases/v2 app/current.tmp &amp;&amp; mv -T app/current.tmp app/current<br>
$ cat app/current/server.txt<br>
server v2<br>
$ readlink app/current<br>
releases/v2<br>
$ readlink -f app/current<br>
/home/sv/app/releases/v2<br>
# Hoàn tác = trỏ lại<br>
$ ln -sfn releases/v1 app/current.tmp &amp;&amp; mv -T app/current.tmp app/current<br>
$ cat app/current/server.txt<br>
server v1</div>
<ul>
<li><strong>Liên kết cứng</strong> (<code>ln a b</code>): một <em>tên</em> thứ hai cho cùng một inode. <code>data.txt</code> và <code>hard.txt</code> có cùng số inode và số liên kết là 2. Dữ liệu chỉ được giải phóng khi tên <em>cuối cùng</em> bị xoá — vì thế <code>rm data.txt</code> không hại gì cho <code>hard.txt</code>. (Lý thuyết: Chương 4, các slide về i-node và liên kết; số inode khác nhau mỗi lần chạy.)</li>
<li><strong>Liên kết mềm</strong> (<code>ln -s đích tên</code>): một tệp nhỏ chứa một <em>đường dẫn</em> (<code>soft.txt -&gt; data.txt</code>). Nó có inode riêng, cỡ 8 = độ dài của "data.txt". Khi đích bị xoá, liên kết bị <strong>treo</strong>: <code>cat</code> báo <code>No such file or directory</code> dù <code>ls -l</code> vẫn hiện liên kết.</li>
<li>Liên kết cứng không trỏ vào thư mục được (<code>hard link not allowed for directory</code>: sẽ tạo ra vòng lặp) và không vượt qua hệ thống tệp; liên kết mềm làm được cả hai.</li>
<li><strong>Phát hành không gián đoạn.</strong> Đừng bao giờ sửa thư mục đang chạy. Mỗi phiên bản nằm trong <code>releases/vN</code>; ứng dụng chạy từ <code>current</code>, một symlink. Để chuyển: tạo liên kết <em>mới</em> <code>current.tmp</code> (<code>ln -sfn</code>) rồi <code>mv -T</code> đè lên <code>current</code>. <code>rename</code> là nguyên tử (Chương 4; cùng ý tưởng với bài 6 của CS.2) nên một request thấy hoặc v1 hoặc v2, không bao giờ thấy "không có gì". Hoàn tác là cùng lệnh đó trỏ lại v1. Đây là bố cục của Capistrano và của nhiều script deploy tự viết. <code>readlink -f</code> giải ra đường dẫn thật.</li>
<li>Vì sao có <code>-n</code>? Thiếu nó, <code>ln -sf</code> lên một liên kết sẵn có tới <em>thư mục</em> sẽ tạo liên kết mới <em>bên trong</em> thư mục đó. Với đích tương đối <code>releases/v2</code>, hãy nhớ nó tính từ thư mục chứa liên kết.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 9 — where did the disk go? (25 min)</h3>
<p><strong>Situation.</strong> At 3 a.m. the app logs <code>No space left on device</code>. Part A: with <code>du</code>, find which folder is biggest and which file inside it; understand why a 1 GB "sparse" file uses no space. Part B: make the same error on purpose, on a 2 MiB scratch file system (needs <code>--privileged</code> in the container; on your VM use a tmpfs or a loop device): fill it with data, then — after cleaning — fill it with 60 tiny files, and compare what <code>df -h</code> and <code>df -i</code> say each time.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--privileged</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 9: where did the disk go? du finds WHO is big<br>
$ du -sh /srv<br>
4.1M	/srv<br>
$ du -h --max-depth=1 /srv | sort -h<br>
44K	/srv/cache<br>
1.1M	/srv/uploads<br>
3.1M	/srv/logs<br>
4.1M	/srv<br>
$ du -ah /srv | sort -rh | head -n 3<br>
4.1M	/srv<br>
3.1M	/srv/logs<br>
3.0M	/srv/logs/app.log<br>
# A sparse file: huge on paper, almost nothing on disk<br>
$ truncate -s 1G /srv/sparse.img<br>
$ ls -lh /srv/sparse.img<br>
-rw-r--r-- 1 root root 1.0G Oct 26 12:34 /srv/sparse.img<br>
$ du -h /srv/sparse.img<br>
0	/srv/sparse.img<br>
$ du -h --apparent-size /srv/sparse.img<br>
1.0G	/srv/sparse.img<br>
# df shows HOW FULL a file system is. We build a tiny one (2 MiB, 50 inodes) to fill on purpose<br>
$ mkdir /mnt/small<br>
$ mount -t tmpfs -o size=2m,nr_inodes=50 tmpfs /mnt/small<br>
$ df -h /mnt/small<br>
Filesystem &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Size &nbsp;Used Avail Use% Mounted on<br>
tmpfs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.0M &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;2.0M &nbsp;&nbsp;0% /mnt/small<br>
$ dd if=/dev/zero of=/mnt/small/big bs=1M count=5 2&gt;&amp;1 | head -n 1<br>
dd: error writing '/mnt/small/big': No space left on device<br>
$ df -h /mnt/small<br>
Filesystem &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Size &nbsp;Used Avail Use% Mounted on<br>
tmpfs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.0M &nbsp;2.0M &nbsp;&nbsp;&nbsp;&nbsp;0 100% /mnt/small<br>
$ rm /mnt/small/big<br>
$ for i in $(seq 1 60); do touch /mnt/small/f$i; done 2&gt;&amp;1 | tail -n 1<br>
touch: cannot touch '/mnt/small/f60': No space left on device<br>
$ df -i /mnt/small<br>
Filesystem &nbsp;&nbsp;&nbsp;&nbsp;Inodes IUsed IFree IUse% Mounted on<br>
tmpfs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50 &nbsp;&nbsp;&nbsp;50 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;100% /mnt/small<br>
$ df -h /mnt/small<br>
Filesystem &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Size &nbsp;Used Avail Use% Mounted on<br>
tmpfs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.0M &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;2.0M &nbsp;&nbsp;0% /mnt/small<br>
$ ls /mnt/small | wc -l<br>
49</div>
<ul>
<li><strong><code>df</code> asks the file system "how full are you?"; <code>du</code> asks the files "how big are you?".</strong> When the disk is full, start with <code>df -h</code> to know <em>which</em> mount, then <code>du -h --max-depth=1 /that/mount | sort -h</code> and go one level deeper each time. Here the 3.0 MB log is the culprit of the 4.1 MB total.</li>
<li><code>du</code> counts <em>blocks used</em>; <code>--apparent-size</code> counts the file's length. The 1 GB sparse file (made by <code>truncate</code>) has holes that take no blocks: <code>ls</code> says 1.0G, <code>du</code> says 0. Database files, VM images and core dumps are often sparse — so <code>ls -l</code> alone can mislead you both ways.</li>
<li><strong>Two ways to be "full".</strong> First, blocks: after writing 2 MiB <code>dd</code> stops with <code>No space left on device</code> and <code>df -h</code> shows <code>100%</code>. Second, <strong>inodes</strong>: with 50 inodes and 49 usable files (one inode is the root folder), the 50th <code>touch</code> fails with the <em>same message</em>, yet <code>df -h</code> shows <strong>0 % used</strong> — only <code>df -i</code> (<code>IUse% 100%</code>) tells the truth. Typical cause: millions of tiny session or cache files. Cure: delete them (<code>find /var/cache/app -type f -mtime +7 -delete</code>), not "buy a bigger disk".</li>
<li>A third trap (not run here): a file deleted while a process still holds it open keeps its blocks until the process exits, so <code>du</code> shows free space and <code>df</code> shows none; <code>lsof +L1</code> lists such files (see CS.2 exercise 4).</li>
</ul>
</details>`,
    `<h3>🧪 Bài 9 — đĩa đi đâu mất? (25 phút)</h3>
<p><strong>Tình huống.</strong> 3 giờ sáng ứng dụng ghi <code>No space left on device</code>. Phần A: dùng <code>du</code> tìm thư mục to nhất và tệp to nhất bên trong; hiểu vì sao tệp "thưa" 1 GB không chiếm chỗ. Phần B: tự tạo lại đúng lỗi đó trên một hệ thống tệp thử 2 MiB (trong container cần <code>--privileged</code>; trên máy ảo của bạn dùng tmpfs hoặc thiết bị loop): lấp đầy bằng dữ liệu, rồi — sau khi dọn — lấp bằng 60 tệp nhỏ xíu, và so sánh <code>df -h</code> với <code>df -i</code> nói gì mỗi lần.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--privileged</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 9: đĩa đi đâu mất rồi? du tìm xem AI to<br>
$ du -sh /srv<br>
4.1M	/srv<br>
$ du -h --max-depth=1 /srv | sort -h<br>
44K	/srv/cache<br>
1.1M	/srv/uploads<br>
3.1M	/srv/logs<br>
4.1M	/srv<br>
$ du -ah /srv | sort -rh | head -n 3<br>
4.1M	/srv<br>
3.1M	/srv/logs<br>
3.0M	/srv/logs/app.log<br>
# Tệp thưa: to trên giấy, gần như không chiếm đĩa<br>
$ truncate -s 1G /srv/sparse.img<br>
$ ls -lh /srv/sparse.img<br>
-rw-r--r-- 1 root root 1.0G Oct 26 12:34 /srv/sparse.img<br>
$ du -h /srv/sparse.img<br>
0	/srv/sparse.img<br>
$ du -h --apparent-size /srv/sparse.img<br>
1.0G	/srv/sparse.img<br>
# df cho biết hệ thống tệp ĐẦY ĐẾN ĐÂU. Ta dựng một cái nhỏ xíu (2 MiB, 50 inode) để cố ý làm đầy<br>
$ mkdir /mnt/small<br>
$ mount -t tmpfs -o size=2m,nr_inodes=50 tmpfs /mnt/small<br>
$ df -h /mnt/small<br>
Filesystem &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Size &nbsp;Used Avail Use% Mounted on<br>
tmpfs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.0M &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;2.0M &nbsp;&nbsp;0% /mnt/small<br>
$ dd if=/dev/zero of=/mnt/small/big bs=1M count=5 2&gt;&amp;1 | head -n 1<br>
dd: error writing '/mnt/small/big': No space left on device<br>
$ df -h /mnt/small<br>
Filesystem &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Size &nbsp;Used Avail Use% Mounted on<br>
tmpfs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.0M &nbsp;2.0M &nbsp;&nbsp;&nbsp;&nbsp;0 100% /mnt/small<br>
$ rm /mnt/small/big<br>
$ for i in $(seq 1 60); do touch /mnt/small/f$i; done 2&gt;&amp;1 | tail -n 1<br>
touch: cannot touch '/mnt/small/f60': No space left on device<br>
$ df -i /mnt/small<br>
Filesystem &nbsp;&nbsp;&nbsp;&nbsp;Inodes IUsed IFree IUse% Mounted on<br>
tmpfs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;50 &nbsp;&nbsp;&nbsp;50 &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;100% /mnt/small<br>
$ df -h /mnt/small<br>
Filesystem &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Size &nbsp;Used Avail Use% Mounted on<br>
tmpfs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.0M &nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;2.0M &nbsp;&nbsp;0% /mnt/small<br>
$ ls /mnt/small | wc -l<br>
49</div>
<ul>
<li><strong><code>df</code> hỏi hệ thống tệp "anh đầy đến đâu?"; <code>du</code> hỏi các tệp "các bạn nặng bao nhiêu?".</strong> Khi đĩa đầy, bắt đầu bằng <code>df -h</code> để biết <em>điểm gắn</em> nào, rồi <code>du -h --max-depth=1 /điểm/gắn/đó | sort -h</code> và đi sâu thêm một tầng mỗi lần. Ở đây log 3,0 MB là thủ phạm của tổng 4,1 MB.</li>
<li><code>du</code> đếm <em>số khối đã dùng</em>; <code>--apparent-size</code> đếm độ dài của tệp. Tệp thưa 1 GB (tạo bằng <code>truncate</code>) có các "lỗ" không chiếm khối: <code>ls</code> báo 1.0G, <code>du</code> báo 0. Tệp CSDL, ảnh máy ảo, core dump thường là tệp thưa — nên chỉ nhìn <code>ls -l</code> có thể đánh lừa bạn theo cả hai chiều.</li>
<li><strong>Hai kiểu "đầy".</strong> Thứ nhất, khối: sau khi ghi 2 MiB, <code>dd</code> dừng với <code>No space left on device</code> và <code>df -h</code> hiện <code>100%</code>. Thứ hai, <strong>inode</strong>: với 50 inode và 49 tệp dùng được (một inode là thư mục gốc), lệnh <code>touch</code> thứ 50 thất bại với <em>đúng thông báo đó</em>, vậy mà <code>df -h</code> hiện <strong>0 % đã dùng</strong> — chỉ <code>df -i</code> (<code>IUse% 100%</code>) nói sự thật. Nguyên nhân thường gặp: hàng triệu tệp session hay cache nhỏ xíu. Cách chữa: xoá chúng (<code>find /var/cache/app -type f -mtime +7 -delete</code>), chứ không phải "mua đĩa to hơn".</li>
<li>Cái bẫy thứ ba (không chạy ở đây): một tệp bị xoá khi tiến trình vẫn đang mở nó vẫn giữ các khối cho tới khi tiến trình thoát, nên <code>du</code> thấy còn trống còn <code>df</code> thấy hết; <code>lsof +L1</code> liệt kê những tệp như vậy (xem bài 4 của CS.2).</li>
</ul>
</details>`),
    bi(`<h3>⚠️ Common errors — how to read them</h3>
<p>Linux error messages are short and honest: <code>program: object: reason</code>. Read from the right. The reasons you met in this lab:</p>
<table>
<thead><tr><th>Message</th><th>What it means</th><th>What to check</th></tr></thead>
<tbody>
<tr><td>Permission denied</td><td>the permission bits (or the folder's <code>x</code>) forbid this user</td><td><code>ls -ld</code> on the file <em>and every folder above it</em>; <code>id</code>; the file mode vs the folder mode</td></tr>
<tr><td>Operation not permitted</td><td>even the bits allow it, the kernel does not (e.g. <code>chown</code> by a non-root user)</td><td>are you root? is the file immutable? capabilities</td></tr>
<tr><td>No such file or directory</td><td>the path is wrong or a symlink dangles</td><td><code>pwd</code>; <code>ls</code> every part of the path; <code>readlink -f</code>; for scripts: CRLF in the shebang</td></tr>
<tr><td>Directory not empty</td><td><code>rmdir</code> on a folder with content</td><td><code>ls -A</code>; use <code>rm -r</code> if you are sure</td></tr>
<tr><td>command not found</td><td>the shell found no such program in <code>$PATH</code></td><td>typo? <code>./script</code> for the current folder; <code>echo $PATH</code></td></tr>
<tr><td>No space left on device</td><td>out of blocks <em>or inodes</em> (or a quota)</td><td><code>df -h</code> <em>and</em> <code>df -i</code>; <code>du</code>; deleted-but-open files</td></tr>
<tr><td>hard link not allowed for directory</td><td>a hard link to a folder is forbidden</td><td>use <code>ln -s</code></td></tr>
</tbody>
</table>
<h3>📝 What to submit and how it is marked</h3>
<p>The lecturer sets the exact format of the real lab. Use this as your self-check; it follows the syllabus outcomes CLO7–8. Record your terminal with <code>script lab1.log</code> (and <code>exit</code> to stop), or copy the commands and their output into a text file named <code>Lab1_&lt;StudentID&gt;.txt</code>, plus two or three sentences per exercise saying <em>why</em> the command works.</p>
<table>
<thead><tr><th>Criterion</th><th>What a full mark needs</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Commands run correctly</td><td>every exercise produces the expected result; no leftover errors that you did not explain</td><td>4</td></tr>
<tr><td>Explanations</td><td>for each exercise you say in your own words what each option does (e.g. why <code>-p</code>, why <code>sort</code> before <code>uniq</code>)</td><td>2</td></tr>
<tr><td>Permissions and users</td><td>the secrets file is not world-readable; you can state the octal mode of every file you created</td><td>1.5</td></tr>
<tr><td>Safety habits</td><td>you never used <code>rm -rf</code> with an unquoted variable, you tested a restore, you did not work as <code>root</code> without need</td><td>1.5</td></tr>
<tr><td>Error reading</td><td>you reproduced and explained at least four messages from the table above</td><td>1</td></tr>
</tbody>
</table>
<p>Self-check questions (answer without looking): (1) what mode does a new file get under <code>umask 027</code>? (2) can a user delete a file in a folder where he has <code>w</code> and <code>x</code> but the file belongs to someone else? (3) why does <code>df</code> say 0 % and the write still fail? (4) what is the difference between <code>&gt;</code> and <code>&gt;&gt;</code>? <em>Answers: 640 for files, 750 for folders · yes — deleting is a folder operation (unless the sticky bit is set, as in /tmp) · inodes are exhausted · overwrite vs append.</em></p>`,
    `<h3>⚠️ Lỗi hay gặp — cách đọc thông báo</h3>
<p>Thông báo lỗi của Linux ngắn và thật thà: <code>chương_trình: đối_tượng: lý_do</code>. Đọc từ phải sang. Các lý do bạn đã gặp trong lab này:</p>
<table>
<thead><tr><th>Thông báo</th><th>Nghĩa là gì</th><th>Cần kiểm tra</th></tr></thead>
<tbody>
<tr><td>Permission denied</td><td>các bit quyền (hoặc <code>x</code> của thư mục) cấm người dùng này</td><td><code>ls -ld</code> trên tệp <em>và mọi thư mục phía trên nó</em>; <code>id</code>; quyền tệp so với quyền thư mục</td></tr>
<tr><td>Operation not permitted</td><td>bit cho phép nhưng nhân không cho (vd. <code>chown</code> bởi người không phải root)</td><td>bạn có phải root? tệp có bất biến? capability</td></tr>
<tr><td>No such file or directory</td><td>đường dẫn sai hoặc symlink bị treo</td><td><code>pwd</code>; <code>ls</code> từng đoạn đường dẫn; <code>readlink -f</code>; với script: CRLF trong dòng shebang</td></tr>
<tr><td>Directory not empty</td><td><code>rmdir</code> trên thư mục còn nội dung</td><td><code>ls -A</code>; dùng <code>rm -r</code> nếu chắc chắn</td></tr>
<tr><td>command not found</td><td>shell không thấy chương trình nào như vậy trong <code>$PATH</code></td><td>gõ sai? <code>./script</code> cho thư mục hiện tại; <code>echo $PATH</code></td></tr>
<tr><td>No space left on device</td><td>hết khối <em>hoặc inode</em> (hoặc hạn ngạch)</td><td><code>df -h</code> <em>và</em> <code>df -i</code>; <code>du</code>; tệp đã xoá nhưng còn mở</td></tr>
<tr><td>hard link not allowed for directory</td><td>cấm liên kết cứng tới thư mục</td><td>dùng <code>ln -s</code></td></tr>
</tbody>
</table>
<h3>📝 Nộp gì / chấm thế nào</h3>
<p>Định dạng chính xác của bài lab thật do giảng viên đặt. Hãy dùng bảng này để tự kiểm; nó theo chuẩn đầu ra CLO7–8 của đề cương. Ghi lại terminal bằng <code>script lab1.log</code> (và <code>exit</code> để dừng), hoặc chép lệnh cùng output vào tệp văn bản <code>Lab1_&lt;MãSV&gt;.txt</code>, kèm hai ba câu cho mỗi bài nói <em>vì sao</em> lệnh đó chạy được.</p>
<table>
<thead><tr><th>Tiêu chí</th><th>Điểm tối đa cần gì</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Lệnh chạy đúng</td><td>mỗi bài cho đúng kết quả mong đợi; không còn lỗi nào mà bạn chưa giải thích</td><td>4</td></tr>
<tr><td>Giải thích</td><td>mỗi bài bạn nói bằng lời của mình từng tuỳ chọn làm gì (vd. vì sao <code>-p</code>, vì sao <code>sort</code> trước <code>uniq</code>)</td><td>2</td></tr>
<tr><td>Quyền và người dùng</td><td>tệp bí mật không ai đọc được; bạn nêu được quyền bát phân của mọi tệp mình tạo</td><td>1,5</td></tr>
<tr><td>Thói quen an toàn</td><td>không dùng <code>rm -rf</code> với biến không đặt trong nháy, đã thử khôi phục, không làm việc bằng <code>root</code> khi không cần</td><td>1,5</td></tr>
<tr><td>Đọc lỗi</td><td>bạn tái hiện và giải thích được ít nhất bốn thông báo trong bảng trên</td><td>1</td></tr>
</tbody>
</table>
<p>Câu tự kiểm (trả lời khi không nhìn bài): (1) tệp mới có quyền gì dưới <code>umask 027</code>? (2) một người có <code>w</code> và <code>x</code> trên thư mục có xoá được tệp của người khác trong đó không? (3) vì sao <code>df</code> báo 0 % mà việc ghi vẫn thất bại? (4) <code>&gt;</code> khác <code>&gt;&gt;</code> thế nào? <em>Đáp án: 640 cho tệp, 750 cho thư mục · có — xoá là thao tác trên thư mục (trừ khi có sticky bit như /tmp) · hết inode · ghi đè so với nối thêm.</em></p>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>absolute / relative path</strong></td><td>đường dẫn tuyệt đối / tương đối</td><td>A path from the root <code>/</code> versus a path from the current folder.</td></tr>
<tr><td><strong>home directory (~)</strong></td><td>thư mục nhà</td><td>The folder of a user, where he has full rights; <code>~</code> expands to it.</td></tr>
<tr><td><strong>permission bits (rwx)</strong></td><td>các bit quyền</td><td>Read, write, execute for owner, group and others; 4, 2, 1 in octal.</td></tr>
<tr><td><strong>chmod / chown</strong></td><td>đổi quyền / đổi chủ</td><td>Change the mode bits of a file; change its owner and group (root only for the owner).</td></tr>
<tr><td><strong>umask</strong></td><td>mặt nạ quyền</td><td>The bits removed from the default 666 (files) or 777 (folders) of new objects.</td></tr>
<tr><td><strong>setgid on a folder</strong></td><td>setgid trên thư mục</td><td>New files inherit the folder's group, which makes shared folders work.</td></tr>
<tr><td><strong>uid / gid</strong></td><td>mã người dùng / mã nhóm</td><td>The numbers the kernel really uses; names are only labels from /etc/passwd and /etc/group.</td></tr>
<tr><td><strong>root / sudo</strong></td><td>quản trị / chạy với quyền quản trị</td><td>uid 0 ignores permission bits; sudo runs one command with that power.</td></tr>
<tr><td><strong>find / grep</strong></td><td>tìm tệp / tìm chữ</td><td>find selects files by attributes; grep selects lines by pattern.</td></tr>
<tr><td><strong>pipe / redirection</strong></td><td>ống / chuyển hướng</td><td><code>|</code> connects stdout of one command to stdin of the next; <code>&gt;</code> <code>&gt;&gt;</code> <code>&lt;</code> <code>2&gt;</code> connect files.</td></tr>
<tr><td><strong>tail -f</strong></td><td>theo dõi cuối tệp</td><td>Keep the file open and print new lines as they are appended.</td></tr>
<tr><td><strong>tar / gzip</strong></td><td>đóng gói / nén</td><td>tar joins many files into one archive; gzip compresses one stream.</td></tr>
<tr><td><strong>inode</strong></td><td>nút chỉ mục (inode)</td><td>The kernel record of a file (owner, mode, size, block list); a name is only an entry pointing to it.</td></tr>
<tr><td><strong>hard link / symbolic link</strong></td><td>liên kết cứng / liên kết mềm</td><td>A second name for the same inode; a small file holding a path (may dangle).</td></tr>
<tr><td><strong>atomic rename</strong></td><td>đổi tên nguyên tử</td><td>rename() replaces the target in one step; readers never see a half state.</td></tr>
<tr><td><strong>sparse file</strong></td><td>tệp thưa</td><td>A file with holes that use no blocks: apparent size is larger than disk usage.</td></tr>
<tr><td><strong>df / du</strong></td><td>dung lượng hệ thống tệp / dung lượng tệp</td><td>df: space and inodes per file system; du: space used by files and folders.</td></tr>
<tr><td><strong>inode exhaustion</strong></td><td>hết inode</td><td>No free inodes: new files fail with "No space left on device" while df -h shows free space.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>absolute / relative path</strong></td><td>đường dẫn tuyệt đối / tương đối</td><td>Đường dẫn tính từ gốc <code>/</code> so với tính từ thư mục hiện tại.</td></tr>
<tr><td><strong>home directory (~)</strong></td><td>thư mục nhà</td><td>Thư mục của một người dùng, nơi họ có toàn quyền; <code>~</code> được bung ra thành nó.</td></tr>
<tr><td><strong>permission bits (rwx)</strong></td><td>các bit quyền</td><td>Đọc, ghi, thực thi cho chủ, nhóm và người khác; 4, 2, 1 ở dạng bát phân.</td></tr>
<tr><td><strong>chmod / chown</strong></td><td>đổi quyền / đổi chủ</td><td>Đổi các bit quyền của tệp; đổi chủ và nhóm (đổi chủ chỉ root làm được).</td></tr>
<tr><td><strong>umask</strong></td><td>mặt nạ quyền</td><td>Các bit bị bớt khỏi mặc định 666 (tệp) hay 777 (thư mục) của đối tượng mới.</td></tr>
<tr><td><strong>setgid on a folder</strong></td><td>setgid trên thư mục</td><td>Tệp mới thừa kế nhóm của thư mục, giúp thư mục dùng chung hoạt động.</td></tr>
<tr><td><strong>uid / gid</strong></td><td>mã người dùng / mã nhóm</td><td>Các con số mà nhân thật sự dùng; tên chỉ là nhãn lấy từ /etc/passwd và /etc/group.</td></tr>
<tr><td><strong>root / sudo</strong></td><td>quản trị / chạy với quyền quản trị</td><td>uid 0 bỏ qua các bit quyền; sudo chạy một lệnh với sức mạnh đó.</td></tr>
<tr><td><strong>find / grep</strong></td><td>tìm tệp / tìm chữ</td><td>find chọn tệp theo thuộc tính; grep chọn dòng theo mẫu.</td></tr>
<tr><td><strong>pipe / redirection</strong></td><td>ống / chuyển hướng</td><td><code>|</code> nối stdout của lệnh này với stdin của lệnh kế; <code>&gt;</code> <code>&gt;&gt;</code> <code>&lt;</code> <code>2&gt;</code> nối với tệp.</td></tr>
<tr><td><strong>tail -f</strong></td><td>theo dõi cuối tệp</td><td>Giữ tệp mở và in các dòng mới khi chúng được nối thêm.</td></tr>
<tr><td><strong>tar / gzip</strong></td><td>đóng gói / nén</td><td>tar gộp nhiều tệp thành một gói; gzip nén một luồng.</td></tr>
<tr><td><strong>inode</strong></td><td>nút chỉ mục (inode)</td><td>Bản ghi của nhân về một tệp (chủ, quyền, cỡ, danh sách khối); tên chỉ là một mục trỏ tới nó.</td></tr>
<tr><td><strong>hard link / symbolic link</strong></td><td>liên kết cứng / liên kết mềm</td><td>Một tên thứ hai cho cùng inode; một tệp nhỏ chứa đường dẫn (có thể bị treo).</td></tr>
<tr><td><strong>atomic rename</strong></td><td>đổi tên nguyên tử</td><td>rename() thay đích trong một bước; người đọc không bao giờ thấy trạng thái nửa chừng.</td></tr>
<tr><td><strong>sparse file</strong></td><td>tệp thưa</td><td>Tệp có các "lỗ" không chiếm khối: cỡ danh nghĩa lớn hơn dung lượng đĩa dùng.</td></tr>
<tr><td><strong>df / du</strong></td><td>dung lượng hệ thống tệp / dung lượng tệp</td><td>df: dung lượng và inode của từng hệ thống tệp; du: dung lượng mà tệp và thư mục chiếm.</td></tr>
<tr><td><strong>inode exhaustion</strong></td><td>hết inode</td><td>Hết inode trống: tệp mới lỗi "No space left on device" trong khi df -h vẫn còn chỗ.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Lab 1 summary</h2>
<ul>
<li><strong>Paths:</strong> absolute starts with <code>/</code> or <code>~</code>; <code>mkdir -p</code>, <code>cp -r</code>, <code>rm -r</code> (no recycle bin), <code>rmdir</code> only for empty folders.</li>
<li><strong>Permissions:</strong> <code>rwx</code> = 4+2+1 for user / group / others; files need <code>x</code> to run, folders need <code>x</code> to enter and <code>r</code> to list; <code>umask</code> removes bits from new objects (022 → 644/755); only root can <code>chown</code>; secrets = 600 or 640.</li>
<li><strong>Shared work:</strong> one account per person, a group, a <code>2770</code> setgid folder — and remember the <em>file</em> mode (664 needs <code>umask 002</code>).</li>
<li><strong>Search:</strong> <code>find</code> = which file (name, type, size, age, perm); <code>grep -rn</code> = which line; combine with <code>xargs</code>.</li>
<li><strong>Pipes:</strong> select → extract → <code>sort | uniq -c</code> → <code>sort -rn | head</code>; <code>uniq</code> needs sorted input; <code>tail -f</code> follows a log; <code>less</code> pages it.</li>
<li><strong>Archives:</strong> <code>tar czf</code> / <code>tzf</code> / <code>xzf -C</code>; test a restore with <code>diff -r</code>.</li>
<li><strong>Links:</strong> hard = another name for the same inode; soft = a path (can dangle); <code>ln -sfn</code> + <code>mv -T</code> switches <code>current</code> atomically.</li>
<li><strong>Disk:</strong> <code>df -h</code> then <code>du --max-depth=1 | sort -h</code>; "No space left" can also mean <em>no inodes</em> (<code>df -i</code>); sparse files lie in <code>ls</code>.</li>
<li><strong>Next:</strong> Lab 2 turns these commands into scripts.</li>
</ul>`,
    `<h2>📌 Tóm tắt Lab 1</h2>
<ul>
<li><strong>Đường dẫn:</strong> tuyệt đối bắt đầu bằng <code>/</code> hoặc <code>~</code>; <code>mkdir -p</code>, <code>cp -r</code>, <code>rm -r</code> (không có thùng rác), <code>rmdir</code> chỉ cho thư mục rỗng.</li>
<li><strong>Quyền:</strong> <code>rwx</code> = 4+2+1 cho chủ / nhóm / người khác; tệp cần <code>x</code> để chạy, thư mục cần <code>x</code> để vào và <code>r</code> để liệt kê; <code>umask</code> bớt bit của đối tượng mới (022 → 644/755); chỉ root <code>chown</code> được; bí mật = 600 hoặc 640.</li>
<li><strong>Làm việc chung:</strong> mỗi người một tài khoản, một nhóm, một thư mục <code>2770</code> setgid — và nhớ quyền của <em>tệp</em> (664 cần <code>umask 002</code>).</li>
<li><strong>Tìm kiếm:</strong> <code>find</code> = tệp nào (tên, loại, cỡ, tuổi, quyền); <code>grep -rn</code> = dòng nào; kết hợp bằng <code>xargs</code>.</li>
<li><strong>Pipe:</strong> chọn → trích → <code>sort | uniq -c</code> → <code>sort -rn | head</code>; <code>uniq</code> cần đầu vào đã sắp; <code>tail -f</code> theo dõi log; <code>less</code> xem từng trang.</li>
<li><strong>Đóng gói:</strong> <code>tar czf</code> / <code>tzf</code> / <code>xzf -C</code>; thử khôi phục bằng <code>diff -r</code>.</li>
<li><strong>Liên kết:</strong> cứng = tên khác của cùng inode; mềm = một đường dẫn (có thể treo); <code>ln -sfn</code> + <code>mv -T</code> đổi <code>current</code> nguyên tử.</li>
<li><strong>Đĩa:</strong> <code>df -h</code> rồi <code>du --max-depth=1 | sort -h</code>; "No space left" cũng có thể là <em>hết inode</em> (<code>df -i</code>); tệp thưa nói dối trong <code>ls</code>.</li>
<li><strong>Tiếp theo:</strong> Lab 2 biến các lệnh này thành script.</li>
</ul>`),
  ].join('\n'),
};

/* ───────── Lab 2 — Shell scripting: quoting, tests, loops, functions, exit codes, trap, backup, health check, awk and sed ───────── */
const L_x_lab_2 = {
  title: 'Lab 2 — Shell scripting: quoting, tests, loops, functions, exit codes, trap, backup, health check, awk and sed|||Lab 2 — Shell script: dấu nháy, điều kiện, vòng lặp, hàm, mã thoát, trap, sao lưu, kiểm tra sức khoẻ, awk và sed',
  slug: 'osg202-lab-2',
  type: 'VIDEO',
  description: 'Bài lab 2 của OSG202 (CLO9) viết shell script thật cho việc của dev backend: chín bài tập có lời giải chạy thật — biến và dấu nháy (và vì sao tên tệp có dấu cách làm hỏng script), if và test, vòng lặp và case, hàm và tham số, mã thoát cùng set -euo pipefail, trap để dọn dẹp và khoá chống chạy hai bản, script sao lưu có xoay vòng, script kiểm tra sức khoẻ dịch vụ với mã thoát kiểu Nagios, và xử lý access log bằng awk và sed — kèm lỗi hay gặp, bảng chấm điểm và thuật ngữ.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lab 2 · CLO9</span>
<h2>Lab 2 — Shell scripting</h2>
<p class="lead">In Lab 1 you typed commands. A backend developer types the same commands every day, so sooner or later they become a <strong>script</strong>: a backup that runs at 03:30, a health check that tells the monitoring system whether to wake somebody up, a log summary for the morning meeting. A script is also code that deletes things unattended — so most of this lab is about writing scripts that fail <em>safely</em>.</p>
<h3>🎯 Objectives</h3>
<ul>
<li>Use variables and the three kinds of quotes correctly; understand word splitting and globbing (CLO9).</li>
<li>Write <code>if</code>/<code>case</code>/<code>for</code>/<code>while</code>, functions and positional parameters <code>$1 $@ $#</code> (CLO9).</li>
<li>Use exit codes, <code>set -euo pipefail</code> and <code>trap</code> so a script stops on error and cleans up after itself (CLO9; the theory of signals and exit codes: CS.1 and Chapter 2).</li>
<li>Write three real scripts — backup with rotation, service health check, log analysis with <code>awk</code>/<code>sed</code> (CLO8–9).</li>
</ul>
<h3>🐳 How to work</h3>
<p>Every solution was run for real (Debian 12, bash 5.2, <code>mawk</code> as <code>awk</code>). In the transcripts a line that starts with <code>&gt;</code> is the body of a file being written by a here-document — copy it into a file with your editor (<code>nano</code>, <code>vim</code> or VS Code Remote). Try each exercise yourself before opening the solution. Always run a new script first on a copy or on a test folder.</p>
<table>
<thead><tr><th>Exercise</th><th>Task</th><th>Key ideas</th></tr></thead>
<tbody>
<tr><td>1</td><td>variables and quotes</td><td><code>"$x"</code>, <code>&#36;{x:-d}</code>, word splitting, glob</td></tr>
<tr><td>2</td><td>check before acting</td><td><code>[ ]</code>, <code>[[ ]]</code>, <code>-e -d -s</code>, <code>&amp;&amp; &#124;&#124;</code></td></tr>
<tr><td>3</td><td>process a log, a list of files</td><td><code>for</code>, <code>while read</code>, <code>case</code></td></tr>
<tr><td>4</td><td>arguments and functions</td><td><code>$# $@ shift</code>, <code>local</code>, status vs value</td></tr>
<tr><td>5</td><td>stop on error</td><td><code>set -euo pipefail</code>, exit codes</td></tr>
<tr><td>6</td><td>clean up and one-instance lock</td><td><code>trap</code>, <code>mktemp</code>, lock file</td></tr>
<tr><td>7</td><td>backup with rotation</td><td><code>tar</code>, atomic <code>mv</code>, <code>tail -n +N</code></td></tr>
<tr><td>8</td><td>health check for a service</td><td><code>pgrep</code>, <code>/dev/tcp</code>, <code>df</code>, exit 0/1/2</td></tr>
<tr><td>9</td><td>analyse an access log</td><td><code>awk</code>, <code>sed</code></td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Lab 2 · CLO9</span>
<h2>Lab 2 — Shell script</h2>
<p class="lead">Ở Lab 1 bạn gõ lệnh. Dev backend gõ cùng những lệnh đó mỗi ngày, nên sớm muộn chúng thành một <strong>script</strong>: bản sao lưu chạy lúc 03:30, phép kiểm tra sức khoẻ báo cho hệ thống giám sát biết có nên đánh thức ai không, bản tóm tắt log cho buổi họp sáng. Script cũng là mã tự xoá thứ gì đó khi không có ai nhìn — nên phần lớn lab này nói về việc viết script biết thất bại <em>một cách an toàn</em>.</p>
<h3>🎯 Mục tiêu</h3>
<ul>
<li>Dùng đúng biến và ba loại dấu nháy; hiểu tách từ (word splitting) và bung ký tự đại diện (globbing) (CLO9).</li>
<li>Viết <code>if</code>/<code>case</code>/<code>for</code>/<code>while</code>, hàm và tham số vị trí <code>$1 $@ $#</code> (CLO9).</li>
<li>Dùng mã thoát, <code>set -euo pipefail</code> và <code>trap</code> để script dừng khi lỗi và tự dọn dẹp (CLO9; lý thuyết về tín hiệu và mã thoát: CS.1 và Chương 2).</li>
<li>Viết ba script thật — sao lưu có xoay vòng, kiểm tra sức khoẻ dịch vụ, phân tích log bằng <code>awk</code>/<code>sed</code> (CLO8–9).</li>
</ul>
<h3>🐳 Cách làm</h3>
<p>Mọi lời giải đều đã chạy thật (Debian 12, bash 5.2, <code>mawk</code> làm <code>awk</code>). Trong bản ghi terminal, dòng bắt đầu bằng <code>&gt;</code> là nội dung tệp đang được ghi bởi here-document — hãy chép vào một tệp bằng trình soạn thảo của bạn (<code>nano</code>, <code>vim</code> hoặc VS Code Remote). Tự làm từng bài trước khi mở lời giải. Luôn chạy script mới trước hết trên bản sao hoặc thư mục thử.</p>
<table>
<thead><tr><th>Bài</th><th>Việc cần làm</th><th>Ý chính</th></tr></thead>
<tbody>
<tr><td>1</td><td>biến và dấu nháy</td><td><code>"$x"</code>, <code>&#36;{x:-d}</code>, tách từ, glob</td></tr>
<tr><td>2</td><td>kiểm tra trước khi làm</td><td><code>[ ]</code>, <code>[[ ]]</code>, <code>-e -d -s</code>, <code>&amp;&amp; &#124;&#124;</code></td></tr>
<tr><td>3</td><td>xử lý log, danh sách tệp</td><td><code>for</code>, <code>while read</code>, <code>case</code></td></tr>
<tr><td>4</td><td>tham số và hàm</td><td><code>$# $@ shift</code>, <code>local</code>, trạng thái và giá trị</td></tr>
<tr><td>5</td><td>dừng khi lỗi</td><td><code>set -euo pipefail</code>, mã thoát</td></tr>
<tr><td>6</td><td>dọn dẹp và khoá một bản chạy</td><td><code>trap</code>, <code>mktemp</code>, tệp khoá</td></tr>
<tr><td>7</td><td>sao lưu có xoay vòng</td><td><code>tar</code>, <code>mv</code> nguyên tử, <code>tail -n +N</code></td></tr>
<tr><td>8</td><td>kiểm tra sức khoẻ dịch vụ</td><td><code>pgrep</code>, <code>/dev/tcp</code>, <code>df</code>, thoát 0/1/2</td></tr>
<tr><td>9</td><td>phân tích access log</td><td><code>awk</code>, <code>sed</code></td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — variables and quotes (15 min)</h3>
<p><strong>Situation.</strong> A deploy script printed <code>file_.txt</code> instead of <code>file_50.txt</code>, and another one tried to delete <code>my</code> and <code>report.txt</code> instead of <code>my report.txt</code>. Reproduce both bugs and explain: what is the difference between <code>$x</code>, <code>"$x"</code> and <code>'$x'</code>; why <code>&#36;{n}0</code>; what <code>&#36;{PORT:-3000}</code>, <code>&#36;{f%.tar.gz}</code>, <code>&#36;{f#backup-}</code> and <code>&#36;{#f}</code> do; and when the shell expands <code>*.log</code>.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 1: variables and quoting — the #1 source of script bugs<br>
$ app="my shop"<br>
$ echo $app<br>
my shop<br>
$ echo "$app"<br>
my shop<br>
$ echo '$app'<br>
$app<br>
$ echo "today has $(echo 3 + 4 | bc) apples, user is $(whoami)"<br>
today has 7 apples, user is sv<br>
# No spaces around = ; $VAR vs &#36;{VAR}<br>
$ n=5<br>
$ echo "file_$n.txt &nbsp;file_&#36;{n}0.txt &nbsp;file_$n0.txt"<br>
file_5.txt &nbsp;file_50.txt &nbsp;file_.txt<br>
# Default values and string surgery<br>
$ echo "port=&#36;{PORT:-3000}"<br>
port=3000<br>
$ PORT=8080<br>
$ echo "port=&#36;{PORT:-3000}"<br>
port=8080<br>
$ f="backup-2026-10-26.tar.gz"<br>
$ echo "&#36;{f%.tar.gz} &nbsp;&#36;{f#backup-} &nbsp;&#36;{#f}"<br>
backup-2026-10-26 &nbsp;2026-10-26.tar.gz &nbsp;24<br>
# The classic bug: a file name with a space<br>
$ touch "my report.txt"<br>
$ file="my report.txt"<br>
$ rm $file<br>
rm: cannot remove 'my': No such file or directory<br>
rm: cannot remove 'report.txt': No such file or directory<br>
$ rm "$file"<br>
$ ls<br>
# Globs expand BEFORE the command runs<br>
$ touch a.log b.log<br>
$ echo *.log<br>
a.log b.log<br>
$ echo "*.log"<br>
*.log<br>
$ echo '*.log' *.log<br>
*.log a.log b.log</div>
<ul>
<li><strong>No spaces around <code>=</code></strong> (<code>n=5</code>). With spaces bash would run a command called <code>n</code>.</li>
<li><code>"$x"</code> (double quotes): the value is substituted, but the result stays <strong>one word</strong>. <code>'$x'</code> (single quotes): nothing is substituted — literal text. <code>$x</code> (no quotes): the value is substituted and then <strong>split on spaces</strong> into several words, and each word that looks like a pattern (<code>*</code>, <code>?</code>) is expanded as a glob. That is why <code>rm $file</code> tried to remove <code>my</code> and <code>report.txt</code>. <strong>Rule: always write <code>"$var"</code>.</strong> Worse than this error is the silent one: <code>rm -rf $DIR/*</code> with an empty or spaced <code>$DIR</code> deletes something you never meant to touch.</li>
<li><code>$n0</code> means the variable called <code>n0</code> (unset → empty), so <code>file_$n0.txt</code> became <code>file_.txt</code>; <code>&#36;{n}0</code> marks where the name ends.</li>
<li><code>&#36;{PORT:-3000}</code> = the value of <code>PORT</code>, or <code>3000</code> if unset/empty — the idiom for configuration from the environment (Node and Spring Boot do the same with <code>process.env.PORT || 3000</code>). <code>&#36;{f%.tar.gz}</code> removes a suffix, <code>&#36;{f#backup-}</code> a prefix, <code>&#36;{#f}</code> is the length — no <code>sed</code> needed.</li>
<li><code>$(command)</code> runs a command and substitutes its output (old style: backticks).</li>
<li>The glob <code>*.log</code> is expanded by <strong>the shell, before the command starts</strong>: <code>echo</code> never sees the star. Quoted, it stays a star.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 1 — biến và dấu nháy (15 phút)</h3>
<p><strong>Tình huống.</strong> Một script deploy in <code>file_.txt</code> thay vì <code>file_50.txt</code>, và một script khác định xoá <code>my</code> và <code>report.txt</code> thay vì <code>my report.txt</code>. Tái hiện cả hai lỗi và giải thích: <code>$x</code>, <code>"$x"</code> và <code>'$x'</code> khác nhau thế nào; vì sao có <code>&#36;{n}0</code>; <code>&#36;{PORT:-3000}</code>, <code>&#36;{f%.tar.gz}</code>, <code>&#36;{f#backup-}</code> và <code>&#36;{#f}</code> làm gì; và shell bung <code>*.log</code> lúc nào.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 1: biến và dấu nháy — nguồn lỗi số 1 của script<br>
$ app="my shop"<br>
$ echo $app<br>
my shop<br>
$ echo "$app"<br>
my shop<br>
$ echo '$app'<br>
$app<br>
$ echo "today has $(echo 3 + 4 | bc) apples, user is $(whoami)"<br>
today has 7 apples, user is sv<br>
# Không có dấu cách quanh = ; $VAR và &#36;{VAR}<br>
$ n=5<br>
$ echo "file_$n.txt &nbsp;file_&#36;{n}0.txt &nbsp;file_$n0.txt"<br>
file_5.txt &nbsp;file_50.txt &nbsp;file_.txt<br>
# Giá trị mặc định và cắt chuỗi<br>
$ echo "port=&#36;{PORT:-3000}"<br>
port=3000<br>
$ PORT=8080<br>
$ echo "port=&#36;{PORT:-3000}"<br>
port=8080<br>
$ f="backup-2026-10-26.tar.gz"<br>
$ echo "&#36;{f%.tar.gz} &nbsp;&#36;{f#backup-} &nbsp;&#36;{#f}"<br>
backup-2026-10-26 &nbsp;2026-10-26.tar.gz &nbsp;24<br>
# Lỗi kinh điển: tên tệp có dấu cách<br>
$ touch "my report.txt"<br>
$ file="my report.txt"<br>
$ rm $file<br>
rm: cannot remove 'my': No such file or directory<br>
rm: cannot remove 'report.txt': No such file or directory<br>
$ rm "$file"<br>
$ ls<br>
# Dấu * bung ra TRƯỚC khi lệnh chạy<br>
$ touch a.log b.log<br>
$ echo *.log<br>
a.log b.log<br>
$ echo "*.log"<br>
*.log<br>
$ echo '*.log' *.log<br>
*.log a.log b.log</div>
<ul>
<li><strong>Không có dấu cách quanh <code>=</code></strong> (<code>n=5</code>). Có dấu cách thì bash sẽ chạy một lệnh tên <code>n</code>.</li>
<li><code>"$x"</code> (nháy kép): giá trị được thay vào, nhưng kết quả vẫn là <strong>một từ</strong>. <code>'$x'</code> (nháy đơn): không thay gì — chữ nguyên văn. <code>$x</code> (không nháy): giá trị được thay vào rồi bị <strong>tách theo dấu cách</strong> thành nhiều từ, và từ nào giống mẫu (<code>*</code>, <code>?</code>) bị bung như glob. Vì thế <code>rm $file</code> định xoá <code>my</code> và <code>report.txt</code>. <strong>Quy tắc: luôn viết <code>"$var"</code>.</strong> Tệ hơn lỗi này là lỗi âm thầm: <code>rm -rf $DIR/*</code> với <code>$DIR</code> rỗng hoặc có dấu cách sẽ xoá thứ bạn chưa từng định đụng tới.</li>
<li><code>$n0</code> nghĩa là biến tên <code>n0</code> (chưa đặt → rỗng), nên <code>file_$n0.txt</code> thành <code>file_.txt</code>; <code>&#36;{n}0</code> đánh dấu chỗ tên kết thúc.</li>
<li><code>&#36;{PORT:-3000}</code> = giá trị của <code>PORT</code>, hoặc <code>3000</code> nếu chưa đặt/rỗng — thành ngữ lấy cấu hình từ môi trường (Node và Spring Boot làm tương tự với <code>process.env.PORT || 3000</code>). <code>&#36;{f%.tar.gz}</code> bỏ hậu tố, <code>&#36;{f#backup-}</code> bỏ tiền tố, <code>&#36;{#f}</code> là độ dài — không cần <code>sed</code>.</li>
<li><code>$(lệnh)</code> chạy một lệnh và thay bằng output của nó (kiểu cũ: dấu backtick).</li>
<li>Glob <code>*.log</code> được <strong>shell bung ra trước khi lệnh bắt đầu</strong>: <code>echo</code> không bao giờ thấy dấu sao. Đặt trong nháy thì nó vẫn là dấu sao.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 2 — check before acting (15 min)</h3>
<p><strong>Situation.</strong> Write <code>check.sh FILE</code> that says whether FILE does not exist, is a folder (with how many entries), is an empty file, or a file with data (how many bytes). Then explain three things that surprise beginners: why <code>[ "10" \\&gt; "9" ]</code> is false, what <code>[: =: unary operator expected</code> means, and how <code>if</code> relates to <code>&amp;&amp;</code> and <code>||</code>.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 2: if / test — checking before acting<br>
$ cat &gt; check.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; file="$1"<br>
&gt; if [ ! -e "$file" ]; then<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "$file: does not exist"<br>
&gt; elif [ -d "$file" ]; then<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "$file: a folder with $(ls "$file" | wc -l) entries"<br>
&gt; elif [ -s "$file" ]; then<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "$file: a file with data ($(wc -c &lt; "$file") bytes)"<br>
&gt; else<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "$file: an EMPTY file"<br>
&gt; fi<br>
&gt; END<br>
$ chmod +x check.sh<br>
$ mkdir dir1 &amp;&amp; touch empty.txt &amp;&amp; echo hello &gt; full.txt<br>
$ ./check.sh nothing<br>
nothing: does not exist<br>
$ ./check.sh dir1<br>
dir1: a folder with 0 entries<br>
$ ./check.sh empty.txt<br>
empty.txt: an EMPTY file<br>
$ ./check.sh full.txt<br>
full.txt: a file with data (6 bytes)<br>
# Numbers vs strings<br>
$ [ 10 -gt 9 ] &amp;&amp; echo "10 -gt 9 is true"<br>
10 -gt 9 is true<br>
$ [ "10" \\&gt; "9" ] || echo "string test: 10 &gt; 9 is FALSE (compares characters)"<br>
string test: 10 &gt; 9 is FALSE (compares characters)<br>
$ [[ 10 -gt 9 &amp;&amp; "abc" == a* ]] &amp;&amp; echo "[[ ]] allows &amp;&amp; and patterns"<br>
[[ ]] allows &amp;&amp; and patterns<br>
# The empty-variable trap<br>
$ x=""<br>
$ [ $x = yes ] &amp;&amp; echo ok<br>
bash: [: =: unary operator expected<br>
$ [ "$x" = yes ] &amp;&amp; echo ok<br>
# &amp;&amp; and || as short ifs; the exit code is the condition<br>
$ grep -q hello full.txt &amp;&amp; echo "found hello"<br>
found hello<br>
$ grep -q bye full.txt || echo "no bye"<br>
no bye<br>
$ if grep -q hello full.txt; then echo "if uses the exit code of grep"; fi<br>
if uses the exit code of grep</div>
<ul>
<li><code>if</code> does not test a boolean: it runs a <strong>command</strong> and looks at its <strong>exit code — 0 means true</strong>. <code>[</code> is itself a command (also written <code>test</code>); the final <code>]</code> is just its last argument, so the spaces inside <code>[ … ]</code> are mandatory.</li>
<li>File tests: <code>-e</code> exists · <code>-f</code> regular file · <code>-d</code> folder · <code>-s</code> exists and not empty · <code>-r -w -x</code> permissions · <code>-z "$s"</code> empty string · <code>-n "$s"</code> non-empty. Numbers: <code>-eq -ne -lt -le -gt -ge</code>. Strings: <code>= != </code>.</li>
<li><strong>Numbers vs strings.</strong> Inside <code>[ ]</code>, <code>&gt;</code> compares <em>characters</em> (and must be escaped, or it becomes a redirection!). <code>"10"</code> is before <code>"9"</code> because <code>1 &lt; 9</code>. Use <code>-gt</code> for numbers, or <code>(( ))</code> in bash.</li>
<li><strong>The empty-variable trap.</strong> Unquoted, <code>[ $x = yes ]</code> with an empty <code>x</code> becomes <code>[ = yes ]</code> — a syntax error, not "false". Quoted, it is <code>[ "" = yes ]</code> and works. Same rule as Exercise 1.</li>
<li><code>[[ … ]]</code> is a bash feature: no word-splitting inside, supports <code>&amp;&amp;</code>, <code>||</code>, patterns (<code>== a*</code>) and <code>=~</code> (regex). Use it in bash scripts; use <code>[ ]</code> in portable <code>sh</code> scripts.</li>
<li><code>a &amp;&amp; b</code> = "run b only if a succeeded"; <code>a || b</code> = "run b only if a failed". <code>grep -q</code> (quiet) is the standard way to test "does it contain …?".</li>
</ul>
</details>`,
    `<h3>🧪 Bài 2 — kiểm tra trước khi làm (15 phút)</h3>
<p><strong>Tình huống.</strong> Viết <code>check.sh TỆP</code> báo TỆP không tồn tại, là thư mục (có bao nhiêu mục), là tệp rỗng, hay là tệp có dữ liệu (bao nhiêu byte). Rồi giải thích ba điều làm người mới ngạc nhiên: vì sao <code>[ "10" \\&gt; "9" ]</code> là sai, thông báo <code>[: =: unary operator expected</code> nghĩa là gì, và <code>if</code> liên quan thế nào tới <code>&amp;&amp;</code> và <code>||</code>.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 2: if / test — kiểm tra trước khi làm<br>
$ cat &gt; check.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; file="$1"<br>
&gt; if [ ! -e "$file" ]; then<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "$file: does not exist"<br>
&gt; elif [ -d "$file" ]; then<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "$file: a folder with $(ls "$file" | wc -l) entries"<br>
&gt; elif [ -s "$file" ]; then<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "$file: a file with data ($(wc -c &lt; "$file") bytes)"<br>
&gt; else<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "$file: an EMPTY file"<br>
&gt; fi<br>
&gt; END<br>
$ chmod +x check.sh<br>
$ mkdir dir1 &amp;&amp; touch empty.txt &amp;&amp; echo hello &gt; full.txt<br>
$ ./check.sh nothing<br>
nothing: does not exist<br>
$ ./check.sh dir1<br>
dir1: a folder with 0 entries<br>
$ ./check.sh empty.txt<br>
empty.txt: an EMPTY file<br>
$ ./check.sh full.txt<br>
full.txt: a file with data (6 bytes)<br>
# Số và chuỗi<br>
$ [ 10 -gt 9 ] &amp;&amp; echo "10 -gt 9 is true"<br>
10 -gt 9 is true<br>
$ [ "10" \\&gt; "9" ] || echo "string test: 10 &gt; 9 is FALSE (compares characters)"<br>
string test: 10 &gt; 9 is FALSE (compares characters)<br>
$ [[ 10 -gt 9 &amp;&amp; "abc" == a* ]] &amp;&amp; echo "[[ ]] allows &amp;&amp; and patterns"<br>
[[ ]] allows &amp;&amp; and patterns<br>
# Cái bẫy biến rỗng<br>
$ x=""<br>
$ [ $x = yes ] &amp;&amp; echo ok<br>
bash: [: =: unary operator expected<br>
$ [ "$x" = yes ] &amp;&amp; echo ok<br>
# &amp;&amp; và || là if rút gọn; mã thoát chính là điều kiện<br>
$ grep -q hello full.txt &amp;&amp; echo "found hello"<br>
found hello<br>
$ grep -q bye full.txt || echo "no bye"<br>
no bye<br>
$ if grep -q hello full.txt; then echo "if uses the exit code of grep"; fi<br>
if uses the exit code of grep</div>
<ul>
<li><code>if</code> không kiểm tra một giá trị logic: nó chạy một <strong>lệnh</strong> và xem <strong>mã thoát — 0 nghĩa là đúng</strong>. Bản thân <code>[</code> là một lệnh (còn viết <code>test</code>); dấu <code>]</code> cuối chỉ là đối số cuối của nó, nên dấu cách trong <code>[ … ]</code> là bắt buộc.</li>
<li>Kiểm tra tệp: <code>-e</code> tồn tại · <code>-f</code> tệp thường · <code>-d</code> thư mục · <code>-s</code> tồn tại và không rỗng · <code>-r -w -x</code> quyền · <code>-z "$s"</code> chuỗi rỗng · <code>-n "$s"</code> chuỗi không rỗng. Số: <code>-eq -ne -lt -le -gt -ge</code>. Chuỗi: <code>= !=</code>.</li>
<li><strong>Số và chuỗi.</strong> Trong <code>[ ]</code>, <code>&gt;</code> so sánh <em>ký tự</em> (và phải thoát, nếu không nó thành chuyển hướng!). <code>"10"</code> đứng trước <code>"9"</code> vì <code>1 &lt; 9</code>. Dùng <code>-gt</code> cho số, hoặc <code>(( ))</code> trong bash.</li>
<li><strong>Cái bẫy biến rỗng.</strong> Không có nháy, <code>[ $x = yes ]</code> với <code>x</code> rỗng thành <code>[ = yes ]</code> — lỗi cú pháp, chứ không phải "sai". Có nháy, nó là <code>[ "" = yes ]</code> và chạy được. Cùng quy tắc với Bài 1.</li>
<li><code>[[ … ]]</code> là tính năng của bash: không tách từ bên trong, hỗ trợ <code>&amp;&amp;</code>, <code>||</code>, mẫu (<code>== a*</code>) và <code>=~</code> (regex). Dùng trong script bash; dùng <code>[ ]</code> trong script <code>sh</code> cần di động.</li>
<li><code>a &amp;&amp; b</code> = "chạy b chỉ khi a thành công"; <code>a || b</code> = "chạy b chỉ khi a thất bại". <code>grep -q</code> (im lặng) là cách chuẩn để kiểm tra "có chứa … không?".</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 3 — loops and case (15 min)</h3>
<p><strong>Situation.</strong> (a) Print "deploying X" for three service names, then count down from 3. (b) Read <code>app.log</code> (fields: date, time, level, message), print every <code>ERROR</code> with a <code>!!</code> mark, every <code>WARN</code> with a <code>w</code>, ignore the rest, and finish with the number of errors. (c) Loop over the <code>*.log</code> files of a folder that contains a file named <code>two words.log</code>. (d) Print the odd numbers up to 7 using <code>until</code>, <code>continue</code> and <code>break</code>.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 3: loops and case<br>
$ for name in api web worker; do echo "deploying $name"; done<br>
deploying api<br>
deploying web<br>
deploying worker<br>
$ for i in $(seq 1 3); do echo "retry $i"; done<br>
retry 1<br>
retry 2<br>
retry 3<br>
$ for ((i = 3; i &gt; 0; i--)); do echo -n "$i... "; done; echo "go"<br>
3... 2... 1... go<br>
# while read: process a file line by line<br>
$ cat &gt; scan.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; errors=0<br>
&gt; while read -r date time level msg; do<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;case "$level" in<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERROR) errors=$((errors + 1)); echo "!! $time &nbsp;$msg" ;;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WARN) &nbsp;echo "w &nbsp;$time &nbsp;$msg" ;;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*) &nbsp;&nbsp;&nbsp;&nbsp;;;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;esac<br>
&gt; done &lt; app.log<br>
&gt; echo "errors: $errors"<br>
&gt; END<br>
$ bash scan.sh<br>
!! 10:00:05 &nbsp;db timeout<br>
w &nbsp;10:01:00 &nbsp;slow query<br>
!! 10:02:30 &nbsp;disk full<br>
errors: 2<br>
# A loop over files: always quote, never parse ls<br>
$ touch "one.log" "two words.log" "three.txt"<br>
$ for f in *.log; do echo "log file: [$f]"; done<br>
log file: [app.log]<br>
log file: [one.log]<br>
log file: [two words.log]<br>
# until / break / continue<br>
$ n=0; list=""<br>
$ until [ $n -ge 10 ]; do<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;n=$((n + 1))<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;[ $((n % 2)) -eq 0 ] &amp;&amp; continue<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;[ $n -gt 7 ] &amp;&amp; break<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;list="$list $n"<br>
&gt; done<br>
$ echo "odd numbers up to 7:$list"<br>
odd numbers up to 7: 1 3 5 7</div>
<ul>
<li><code>for x in list</code> iterates over words; <code>$(seq 1 3)</code> makes a number list; <code>for ((i=3; i&gt;0; i--))</code> is the C-style loop of PRF192.</li>
<li><strong><code>while read -r a b c rest; do … done &lt; file</code></strong> is the standard way to process a file line by line: <code>read</code> splits the line into variables (the last variable takes the rest of the line), <code>-r</code> keeps backslashes. The redirection is placed after <code>done</code>.</li>
<li><code>case "$level" in ERROR) …;; WARN) …;; *) …;; esac</code> compares against patterns; <code>;;</code> ends a branch; <code>*</code> is the default. It is cleaner than a chain of <code>if</code> for commands like <code>start|stop|restart)</code>.</li>
<li><code>errors=$((errors + 1))</code> is arithmetic. Variables changed inside a <code>while</code> that is the <em>target of a pipe</em> (<code>cat f | while …</code>) are lost when the loop ends, because the loop runs in a subshell — that is why the script uses <code>&lt; app.log</code> and not <code>cat | while</code>.</li>
<li><code>for f in *.log</code> handles the name with a space correctly (<code>[two words.log]</code> is a single item) because the glob produces whole names. <code>for f in $(ls *.log)</code> would not — never parse <code>ls</code>.</li>
<li>The last loop printed <code>1 3 5 7</code>: <code>continue</code> skips even numbers; <code>break</code> leaves the loop at 9 before printing.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 3 — vòng lặp và case (15 phút)</h3>
<p><strong>Tình huống.</strong> (a) In "deploying X" cho ba tên dịch vụ, rồi đếm ngược từ 3. (b) Đọc <code>app.log</code> (các trường: ngày, giờ, mức, thông điệp), in mỗi dòng <code>ERROR</code> với dấu <code>!!</code>, mỗi dòng <code>WARN</code> với <code>w</code>, bỏ qua phần còn lại, và kết thúc bằng số lỗi. (c) Lặp trên các tệp <code>*.log</code> của một thư mục có tệp tên <code>two words.log</code>. (d) In các số lẻ đến 7 bằng <code>until</code>, <code>continue</code> và <code>break</code>.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 3: vòng lặp và case<br>
$ for name in api web worker; do echo "deploying $name"; done<br>
deploying api<br>
deploying web<br>
deploying worker<br>
$ for i in $(seq 1 3); do echo "retry $i"; done<br>
retry 1<br>
retry 2<br>
retry 3<br>
$ for ((i = 3; i &gt; 0; i--)); do echo -n "$i... "; done; echo "go"<br>
3... 2... 1... go<br>
# while read: xử lý tệp từng dòng<br>
$ cat &gt; scan.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; errors=0<br>
&gt; while read -r date time level msg; do<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;case "$level" in<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ERROR) errors=$((errors + 1)); echo "!! $time &nbsp;$msg" ;;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;WARN) &nbsp;echo "w &nbsp;$time &nbsp;$msg" ;;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*) &nbsp;&nbsp;&nbsp;&nbsp;;;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;esac<br>
&gt; done &lt; app.log<br>
&gt; echo "errors: $errors"<br>
&gt; END<br>
$ bash scan.sh<br>
!! 10:00:05 &nbsp;db timeout<br>
w &nbsp;10:01:00 &nbsp;slow query<br>
!! 10:02:30 &nbsp;disk full<br>
errors: 2<br>
# Lặp trên tệp: luôn đặt trong nháy, đừng bao giờ phân tích ls<br>
$ touch "one.log" "two words.log" "three.txt"<br>
$ for f in *.log; do echo "log file: [$f]"; done<br>
log file: [app.log]<br>
log file: [one.log]<br>
log file: [two words.log]<br>
# until / break / continue<br>
$ n=0; list=""<br>
$ until [ $n -ge 10 ]; do<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;n=$((n + 1))<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;[ $((n % 2)) -eq 0 ] &amp;&amp; continue<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;[ $n -gt 7 ] &amp;&amp; break<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;list="$list $n"<br>
&gt; done<br>
$ echo "odd numbers up to 7:$list"<br>
odd numbers up to 7: 1 3 5 7</div>
<ul>
<li><code>for x in danh_sách</code> lặp trên các từ; <code>$(seq 1 3)</code> tạo danh sách số; <code>for ((i=3; i&gt;0; i--))</code> là vòng lặp kiểu C của PRF192.</li>
<li><strong><code>while read -r a b c rest; do … done &lt; tệp</code></strong> là cách chuẩn xử lý tệp từng dòng: <code>read</code> tách dòng vào các biến (biến cuối nhận phần còn lại của dòng), <code>-r</code> giữ dấu gạch ngược. Phép chuyển hướng đặt sau <code>done</code>.</li>
<li><code>case "$level" in ERROR) …;; WARN) …;; *) …;; esac</code> so với các mẫu; <code>;;</code> kết thúc một nhánh; <code>*</code> là mặc định. Gọn hơn chuỗi <code>if</code> cho các lệnh kiểu <code>start|stop|restart)</code>.</li>
<li><code>errors=$((errors + 1))</code> là phép tính số học. Biến đổi bên trong một <code>while</code> là <em>đích của pipe</em> (<code>cat f | while …</code>) sẽ mất khi vòng lặp kết thúc, vì vòng lặp chạy trong subshell — vì thế script dùng <code>&lt; app.log</code> chứ không dùng <code>cat | while</code>.</li>
<li><code>for f in *.log</code> xử lý đúng tên có dấu cách (<code>[two words.log]</code> là một mục) vì glob tạo ra những tên nguyên vẹn. <code>for f in $(ls *.log)</code> thì không — đừng bao giờ phân tích <code>ls</code>.</li>
<li>Vòng cuối in <code>1 3 5 7</code>: <code>continue</code> bỏ số chẵn; <code>break</code> rời vòng ở 9 trước khi in.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 4 — arguments and functions (15 min)</h3>
<p><strong>Situation.</strong> (a) Write <code>args.sh</code> that prints <code>$0</code>, the number of arguments, the first two, then loops over all of them and finally calls <code>shift</code>; run it as <code>./args.sh start "hello world" --verbose</code> and watch how the quoted argument behaves. (b) Write functions <code>is_even</code>, <code>square</code> and <code>log</code> and show: how a function "returns" a status, how it "returns" a value, and what <code>local</code> protects. (c) Write <code>usage.sh</code> that refuses to run unless it gets exactly two arguments, prints the usage on <strong>stderr</strong> and exits with a code that says "usage error".</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 4: arguments and functions<br>
$ cat &gt; args.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; echo "script: $0"<br>
&gt; echo "count : $#"<br>
&gt; echo "first : $1 &nbsp;second: $2"<br>
&gt; echo "all &nbsp;&nbsp;:" "$@"<br>
&gt; for a in "$@"; do echo " &nbsp;arg=[$a]"; done<br>
&gt; echo "joined: [$*]"<br>
&gt; shift<br>
&gt; echo "after shift, count = $#, first = $1"<br>
&gt; END<br>
$ chmod +x args.sh<br>
$ ./args.sh start "hello world" --verbose<br>
script: ./args.sh<br>
count : 3<br>
first : start &nbsp;second: hello world<br>
all &nbsp;&nbsp;: start hello world --verbose<br>
&nbsp;&nbsp;arg=[start]<br>
&nbsp;&nbsp;arg=[hello world]<br>
&nbsp;&nbsp;arg=[--verbose]<br>
joined: [start hello world --verbose]<br>
after shift, count = 2, first = hello world<br>
# Functions return a STATUS (0-255), not a value; print values and capture them<br>
$ cat &gt; fn.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; is_even() { [ $(($1 % 2)) -eq 0 ]; }<br>
&gt; square() { echo $(($1 * $1)); }<br>
&gt; log() { local level="$1"; shift; echo "[$level] $*"; }<br>
&gt; for n in 3 4; do<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;if is_even "$n"; then log INFO "$n is even"; else log WARN "$n is odd"; fi<br>
&gt; done<br>
&gt; result=$(square 12)<br>
&gt; log INFO "12 squared = $result"<br>
&gt; x=outer<br>
&gt; f() { local x=inner; echo "inside: $x"; }<br>
&gt; f; echo "outside: $x"<br>
&gt; END<br>
$ bash fn.sh<br>
[WARN] 3 is odd<br>
[INFO] 4 is even<br>
[INFO] 12 squared = 144<br>
inside: inner<br>
outside: outer<br>
# A real usage message: validate arguments<br>
$ cat &gt; usage.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; if [ $# -ne 2 ]; then<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "usage: $0 &lt;source&gt; &lt;destination&gt;" &gt;&amp;2<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;exit 64<br>
&gt; fi<br>
&gt; echo "copying $1 to $2"<br>
&gt; END<br>
$ bash usage.sh a<br>
usage: usage.sh &lt;source&gt; &lt;destination&gt;<br>
$ echo "exit code: $?"<br>
exit code: 64<br>
$ bash usage.sh a b<br>
copying a to b<br>
$ echo "exit code: $?"<br>
exit code: 0</div>
<ul>
<li><code>$0</code> script name · <code>$1 … $9</code> arguments (use <code>&#36;{10}</code> beyond nine) · <code>$#</code> count · <code>$?</code> exit code of the last command · <code>$$</code> PID of the script.</li>
<li><strong><code>"$@"</code> keeps each argument as it was given</strong> (<code>hello world</code> stays one item); <code>"$*"</code> glues all into one string; unquoted <code>$@</code> re-splits on spaces and loses the boundaries. To pass arguments on, always write <code>"$@"</code>. <code>shift</code> drops <code>$1</code> and moves the others down — the usual way to parse <code>--flag value</code> pairs in a <code>while [ $# -gt 0 ]</code> loop.</li>
<li><strong>A function returns a status, not a value.</strong> <code>return N</code> (0–255) and the status of the last command become <code>$?</code>, which is what <code>if is_even 4</code> tests. To "return a string or number" you <code>echo</code> it and capture it with <code>$(square 12)</code>. Never <code>echo</code> log messages inside such a function without sending them to stderr (<code>&gt;&amp;2</code>) — they would pollute the captured value.</li>
<li>Variables are global by default; <code>local</code> keeps them inside the function (<code>outside: outer</code>).</li>
<li>Usage errors go to <strong>stderr</strong> (<code>&gt;&amp;2</code>) so that they do not end up in a pipeline's data, and exit with a non-zero code: 2 is common, <code>64</code> is "usage error" in <code>sysexits.h</code>. The caller sees <code>exit code: 64</code>, then <code>0</code> when the arguments are right.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 4 — tham số và hàm (15 phút)</h3>
<p><strong>Tình huống.</strong> (a) Viết <code>args.sh</code> in <code>$0</code>, số tham số, hai tham số đầu, rồi lặp qua tất cả và cuối cùng gọi <code>shift</code>; chạy <code>./args.sh start "hello world" --verbose</code> và xem tham số có nháy xử sự thế nào. (b) Viết các hàm <code>is_even</code>, <code>square</code> và <code>log</code> rồi chỉ ra: hàm "trả về" một trạng thái thế nào, "trả về" một giá trị thế nào, và <code>local</code> bảo vệ cái gì. (c) Viết <code>usage.sh</code> từ chối chạy trừ khi có đúng hai tham số, in cách dùng ra <strong>stderr</strong> và thoát bằng mã nói "sai cách dùng".</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 4: tham số và hàm<br>
$ cat &gt; args.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; echo "script: $0"<br>
&gt; echo "count : $#"<br>
&gt; echo "first : $1 &nbsp;second: $2"<br>
&gt; echo "all &nbsp;&nbsp;:" "$@"<br>
&gt; for a in "$@"; do echo " &nbsp;arg=[$a]"; done<br>
&gt; echo "joined: [$*]"<br>
&gt; shift<br>
&gt; echo "after shift, count = $#, first = $1"<br>
&gt; END<br>
$ chmod +x args.sh<br>
$ ./args.sh start "hello world" --verbose<br>
script: ./args.sh<br>
count : 3<br>
first : start &nbsp;second: hello world<br>
all &nbsp;&nbsp;: start hello world --verbose<br>
&nbsp;&nbsp;arg=[start]<br>
&nbsp;&nbsp;arg=[hello world]<br>
&nbsp;&nbsp;arg=[--verbose]<br>
joined: [start hello world --verbose]<br>
after shift, count = 2, first = hello world<br>
# Hàm trả về MỘT TRẠNG THÁI (0-255), không phải giá trị; muốn trả giá trị thì in ra rồi bắt lấy<br>
$ cat &gt; fn.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; is_even() { [ $(($1 % 2)) -eq 0 ]; }<br>
&gt; square() { echo $(($1 * $1)); }<br>
&gt; log() { local level="$1"; shift; echo "[$level] $*"; }<br>
&gt; for n in 3 4; do<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;if is_even "$n"; then log INFO "$n is even"; else log WARN "$n is odd"; fi<br>
&gt; done<br>
&gt; result=$(square 12)<br>
&gt; log INFO "12 squared = $result"<br>
&gt; x=outer<br>
&gt; f() { local x=inner; echo "inside: $x"; }<br>
&gt; f; echo "outside: $x"<br>
&gt; END<br>
$ bash fn.sh<br>
[WARN] 3 is odd<br>
[INFO] 4 is even<br>
[INFO] 12 squared = 144<br>
inside: inner<br>
outside: outer<br>
# Thông báo cách dùng thật: kiểm tra tham số<br>
$ cat &gt; usage.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; if [ $# -ne 2 ]; then<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "usage: $0 &lt;source&gt; &lt;destination&gt;" &gt;&amp;2<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;exit 64<br>
&gt; fi<br>
&gt; echo "copying $1 to $2"<br>
&gt; END<br>
$ bash usage.sh a<br>
usage: usage.sh &lt;source&gt; &lt;destination&gt;<br>
$ echo "exit code: $?"<br>
exit code: 64<br>
$ bash usage.sh a b<br>
copying a to b<br>
$ echo "exit code: $?"<br>
exit code: 0</div>
<ul>
<li><code>$0</code> tên script · <code>$1 … $9</code> tham số (quá chín dùng <code>&#36;{10}</code>) · <code>$#</code> số lượng · <code>$?</code> mã thoát lệnh trước · <code>$$</code> PID của script.</li>
<li><strong><code>"$@"</code> giữ mỗi tham số đúng như đã đưa vào</strong> (<code>hello world</code> vẫn là một mục); <code>"$*"</code> dán tất cả thành một chuỗi; <code>$@</code> không nháy bị tách lại theo dấu cách và mất ranh giới. Muốn chuyển tiếp tham số, luôn viết <code>"$@"</code>. <code>shift</code> bỏ <code>$1</code> và dồn các tham số còn lại xuống — cách thông dụng để phân tích cặp <code>--cờ giá_trị</code> trong vòng <code>while [ $# -gt 0 ]</code>.</li>
<li><strong>Hàm trả về một trạng thái, không phải một giá trị.</strong> <code>return N</code> (0–255) và trạng thái của lệnh cuối trở thành <code>$?</code>, đúng cái mà <code>if is_even 4</code> kiểm tra. Muốn "trả về chuỗi hay số" thì <code>echo</code> nó và bắt bằng <code>$(square 12)</code>. Đừng <code>echo</code> thông điệp log trong hàm như vậy mà không đưa chúng sang stderr (<code>&gt;&amp;2</code>) — chúng sẽ làm bẩn giá trị bắt được.</li>
<li>Biến mặc định là toàn cục; <code>local</code> giữ chúng trong hàm (<code>outside: outer</code>).</li>
<li>Lỗi cách dùng đi ra <strong>stderr</strong> (<code>&gt;&amp;2</code>) để không lẫn vào dữ liệu của pipeline, và thoát với mã khác 0: 2 là phổ biến, <code>64</code> là "lỗi cách dùng" trong <code>sysexits.h</code>. Người gọi thấy <code>exit code: 64</code>, rồi <code>0</code> khi tham số đúng.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 5 — stop on error: <code>set -euo pipefail</code> (15 min)</h3>
<p><strong>Situation.</strong> The script <code>lax.sh</code> does <code>cd /khong/co/thu/muc</code> and then a destructive command "in the current folder". Show that, by default, bash prints the error and <strong>carries on</strong> — in the wrong folder — and exits with 0. Then fix it with strict mode. Also show what <code>-u</code> and <code>pipefail</code> add, and why <code>set -e</code> does not stop after a failed command used as a condition.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 5: exit codes and "strict mode"<br>
$ cat &gt; lax.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; cd /khong/co/thu/muc<br>
&gt; echo "deleting in $(pwd) ..."<br>
&gt; echo "(pretend: rm -rf ./* would run here)"<br>
&gt; END<br>
$ bash lax.sh<br>
lax.sh: line 2: cd: /khong/co/thu/muc: No such file or directory<br>
deleting in /home/sv ...<br>
(pretend: rm -rf ./* would run here)<br>
$ echo "lax.sh exit code: $?"<br>
lax.sh exit code: 0<br>
$ cat &gt; strict.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; set -euo pipefail<br>
&gt; cd /khong/co/thu/muc<br>
&gt; echo "never reached"<br>
&gt; END<br>
$ bash strict.sh<br>
strict.sh: line 3: cd: /khong/co/thu/muc: No such file or directory<br>
$ echo "strict.sh exit code: $?"<br>
strict.sh exit code: 1<br>
# -u: an unset variable is an error, not an empty string<br>
$ bash -c 'echo "rm -rf /srv/$FOLDER/data"'<br>
rm -rf /srv//data<br>
$ bash -u -c 'echo "rm -rf /srv/$FOLDER/data"'<br>
bash: line 1: FOLDER: unbound variable<br>
$ echo "exit code: $?"<br>
exit code: 127<br>
# pipefail: the exit code of a pipeline<br>
$ bash -c 'false | cat; echo "without pipefail: $?"'<br>
without pipefail: 0<br>
$ bash -c 'set -o pipefail; false | cat; echo "with pipefail: &nbsp;&nbsp;&nbsp;$?"'<br>
with pipefail: &nbsp;&nbsp;&nbsp;1<br>
# set -e does NOT stop inside conditions; || true is the explicit "I accept failure"<br>
$ bash -c 'set -e; grep -q xyz /etc/hostname || echo "grep failed but we handled it"; echo "still running"'<br>
grep failed but we handled it<br>
still running<br>
$ bash -c 'set -e; grep -q xyz /etc/hostname; echo "NOT printed"'<br>
$ echo "exit code: $?"<br>
exit code: 1</div>
<ul>
<li><strong>Default bash is optimistic.</strong> <code>lax.sh</code> failed at <code>cd</code> but still ran its next lines in <code>/home/sv</code> and ended with exit code <strong>0</strong> — the job scheduler would report "success". Replace the <code>echo</code> by <code>rm -rf ./*</code> and you have a classic disaster story.</li>
<li><code>set -e</code> (<code>errexit</code>) stops at the first failing command; <code>-u</code> (<code>nounset</code>) makes an unset variable an error — see <code>rm -rf /srv//data</code>, what would have run when <code>$FOLDER</code> was forgotten; <code>-o pipefail</code> makes a pipeline fail when <em>any</em> stage fails (without it only the last stage counts: <code>false | cat</code> → 0). Together: <strong><code>set -euo pipefail</code> on the second line of every serious script.</strong></li>
<li><code>strict.sh</code> stopped at line 3 with exit code <strong>1</strong>, and "never reached" never ran. (In this container <code>bash -u -c</code> exited with 127; scripts are not all consistent here — only "non-zero" is guaranteed.)</li>
<li><strong>Limits of <code>set -e</code>.</strong> It is deliberately ignored in conditions: after <code>cmd || echo …</code>, in an <code>if</code> test, or in the left side of <code>&amp;&amp;</code>. So <code>grep -q xyz file || echo handled</code> continues, while a bare <code>grep -q xyz file</code> (exit 1) stops the script. If a failure is acceptable, say so explicitly: <code>cmd || true</code>. For a real error handler use <code>trap … ERR</code> (next exercise) and check <code>$?</code> yourself where it matters.</li>
<li>Exit codes you will meet: 0 success · 1 general error · 2 misuse · 126 not executable · 127 command not found · 128+N killed by signal N (130 = Ctrl-C, 137 = SIGKILL, 143 = SIGTERM; see CS.1).</li>
</ul>
</details>`,
    `<h3>🧪 Bài 5 — dừng khi lỗi: <code>set -euo pipefail</code> (15 phút)</h3>
<p><strong>Tình huống.</strong> Script <code>lax.sh</code> chạy <code>cd /khong/co/thu/muc</code> rồi một lệnh phá huỷ "trong thư mục hiện tại". Chứng minh rằng mặc định bash in lỗi rồi <strong>chạy tiếp</strong> — ở sai thư mục — và thoát với mã 0. Sau đó sửa bằng chế độ nghiêm ngặt. Chỉ ra thêm <code>-u</code> và <code>pipefail</code> mang lại gì, và vì sao <code>set -e</code> không dừng sau một lệnh thất bại được dùng làm điều kiện.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 5: mã thoát và "chế độ nghiêm ngặt"<br>
$ cat &gt; lax.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; cd /khong/co/thu/muc<br>
&gt; echo "deleting in $(pwd) ..."<br>
&gt; echo "(pretend: rm -rf ./* would run here)"<br>
&gt; END<br>
$ bash lax.sh<br>
lax.sh: line 2: cd: /khong/co/thu/muc: No such file or directory<br>
deleting in /home/sv ...<br>
(pretend: rm -rf ./* would run here)<br>
$ echo "lax.sh exit code: $?"<br>
lax.sh exit code: 0<br>
$ cat &gt; strict.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; set -euo pipefail<br>
&gt; cd /khong/co/thu/muc<br>
&gt; echo "never reached"<br>
&gt; END<br>
$ bash strict.sh<br>
strict.sh: line 3: cd: /khong/co/thu/muc: No such file or directory<br>
$ echo "strict.sh exit code: $?"<br>
strict.sh exit code: 1<br>
# -u: biến chưa đặt là lỗi, không phải chuỗi rỗng<br>
$ bash -c 'echo "rm -rf /srv/$FOLDER/data"'<br>
rm -rf /srv//data<br>
$ bash -u -c 'echo "rm -rf /srv/$FOLDER/data"'<br>
bash: line 1: FOLDER: unbound variable<br>
$ echo "exit code: $?"<br>
exit code: 127<br>
# pipefail: mã thoát của một pipeline<br>
$ bash -c 'false | cat; echo "without pipefail: $?"'<br>
without pipefail: 0<br>
$ bash -c 'set -o pipefail; false | cat; echo "with pipefail: &nbsp;&nbsp;&nbsp;$?"'<br>
with pipefail: &nbsp;&nbsp;&nbsp;1<br>
# set -e KHÔNG dừng bên trong điều kiện; || true là lời tuyên bố "tôi chấp nhận thất bại"<br>
$ bash -c 'set -e; grep -q xyz /etc/hostname || echo "grep failed but we handled it"; echo "still running"'<br>
grep failed but we handled it<br>
still running<br>
$ bash -c 'set -e; grep -q xyz /etc/hostname; echo "NOT printed"'<br>
$ echo "exit code: $?"<br>
exit code: 1</div>
<ul>
<li><strong>Bash mặc định lạc quan.</strong> <code>lax.sh</code> hỏng ở <code>cd</code> nhưng vẫn chạy các dòng sau trong <code>/home/sv</code> và kết thúc với mã <strong>0</strong> — bộ lập lịch sẽ báo "thành công". Thay <code>echo</code> bằng <code>rm -rf ./*</code> là bạn có một câu chuyện thảm hoạ kinh điển.</li>
<li><code>set -e</code> (<code>errexit</code>) dừng ở lệnh thất bại đầu tiên; <code>-u</code> (<code>nounset</code>) coi biến chưa đặt là lỗi — xem <code>rm -rf /srv//data</code>, thứ sẽ chạy khi quên <code>$FOLDER</code>; <code>-o pipefail</code> làm pipeline thất bại khi <em>bất kỳ</em> công đoạn nào thất bại (không có nó chỉ công đoạn cuối được tính: <code>false | cat</code> → 0). Gộp lại: <strong><code>set -euo pipefail</code> ở dòng thứ hai của mọi script nghiêm túc.</strong></li>
<li><code>strict.sh</code> dừng ở dòng 3 với mã <strong>1</strong>, và "never reached" không bao giờ chạy. (Trong container này <code>bash -u -c</code> thoát với 127; các mã không nhất quán hoàn toàn — chỉ "khác 0" là được bảo đảm.)</li>
<li><strong>Giới hạn của <code>set -e</code>.</strong> Nó cố ý bị bỏ qua trong điều kiện: sau <code>lệnh || echo …</code>, trong phép thử của <code>if</code>, hay vế trái của <code>&amp;&amp;</code>. Nên <code>grep -q xyz tệp || echo handled</code> chạy tiếp, còn <code>grep -q xyz tệp</code> đứng một mình (mã 1) dừng script. Nếu thất bại là chấp nhận được, hãy nói rõ: <code>lệnh || true</code>. Muốn bộ xử lý lỗi thật thì dùng <code>trap … ERR</code> (bài sau) và tự kiểm <code>$?</code> ở chỗ quan trọng.</li>
<li>Các mã thoát bạn sẽ gặp: 0 thành công · 1 lỗi chung · 2 dùng sai · 126 không thực thi được · 127 không tìm thấy lệnh · 128+N bị tín hiệu N giết (130 = Ctrl-C, 137 = SIGKILL, 143 = SIGTERM; xem CS.1).</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 6 — clean up with <code>trap</code>, and run only one copy (20 min)</h3>
<p><strong>Situation.</strong> <code>job.sh</code> works in a temporary folder and must hold a lock so that cron cannot start a second copy. It must remove its temp folder (and its lock) on success, on error <em>and</em> when it is killed by <code>SIGTERM</code>. Test: normal run; run with a failing command; start it in the background and send <code>SIGTERM</code>; start a second copy while the first holds the lock.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 6: trap — clean up even when the script is interrupted<br>
$ cat &gt; job.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; set -euo pipefail<br>
&gt; work=$(mktemp -d /tmp/job.XXXXXX)<br>
&gt; lock=/tmp/job.lock<br>
&gt; have_lock=0<br>
&gt; cleanup() {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;local code=$?<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;rm -rf "$work"<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;[ $have_lock = 1 ] &amp;&amp; rm -f "$lock" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# never delete a lock we do not own<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "cleanup: temp dir removed, lock owned=$have_lock (exit code was $code)"<br>
&gt; }<br>
&gt; trap cleanup EXIT<br>
&gt; trap 'echo "caught INT/TERM, exiting"; exit 130' INT TERM<br>
&gt; if ! ( set -o noclobber; echo $$ &gt; "$lock" ) 2&gt;/dev/null; then<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "another instance is running (lock exists)"; exit 1<br>
&gt; fi<br>
&gt; have_lock=1<br>
&gt; echo "working in a temp dir: $([ -d "$work" ] &amp;&amp; echo exists)"<br>
&gt; echo "step 1 ok" &gt; "$work/state"<br>
&gt; if [ "&#36;{1:-}" = fail ]; then false; fi<br>
&gt; if [ "&#36;{1:-}" = hang ]; then sleep 30 &amp; wait $!; fi<br>
&gt; echo "done"<br>
&gt; END<br>
$ chmod +x job.sh<br>
$ ./job.sh<br>
working in a temp dir: exists<br>
done<br>
cleanup: temp dir removed, lock owned=1 (exit code was 0)<br>
$ echo "exit: $?"<br>
exit: 0<br>
$ ls /tmp | grep -c '^job' || true<br>
0<br>
$ ./job.sh fail<br>
working in a temp dir: exists<br>
cleanup: temp dir removed, lock owned=1 (exit code was 1)<br>
$ echo "exit: $?"<br>
exit: 1<br>
# Interrupted: send SIGTERM to the running script<br>
$ ./job.sh hang &amp; sleep 1; kill -TERM %1; wait %1; echo "exit: $?"<br>
working in a temp dir: exists<br>
caught INT/TERM, exiting<br>
cleanup: temp dir removed, lock owned=1 (exit code was 130)<br>
exit: 130<br>
$ ls /tmp | grep -c '^job' || true<br>
0<br>
# Second instance while the first holds the lock<br>
$ ./job.sh hang &amp; sleep 1; ./job.sh; echo "second exit: $?"; kill -TERM %1; wait %1<br>
working in a temp dir: exists<br>
another instance is running (lock exists)<br>
cleanup: temp dir removed, lock owned=0 (exit code was 1)<br>
second exit: 1<br>
caught INT/TERM, exiting<br>
cleanup: temp dir removed, lock owned=1 (exit code was 130)</div>
<ul>
<li><code>trap 'commands' EXIT</code> runs when the script ends <em>for any reason</em> — success, <code>set -e</code> stop, or <code>exit</code> in a handler. <code>$?</code> inside the handler still holds the exit code that is about to be returned (<code>0</code>, <code>1</code>, <code>130</code> above). <code>trap … INT TERM</code> reacts to Ctrl-C and <code>kill</code>; its <code>exit 130</code> then triggers the <code>EXIT</code> handler. <code>SIGKILL</code> (137) cannot be caught — nothing can clean up after it (CS.1 exercise 6).</li>
<li><code>mktemp -d</code> creates a unique, private temp folder; never use a fixed <code>/tmp/name</code> (predictable names are a security hole and a collision source).</li>
<li><strong>Lock file.</strong> <code>set -o noclobber</code> makes <code>&gt;</code> fail if the file exists, so <code>echo $$ &gt; lock</code> is an <em>atomic</em> "create if absent" (the check and the creation are one system call, no race). The second copy printed <code>another instance is running</code> and exited 1. For production you would store the PID and check it is alive, or use <code>flock</code>.</li>
<li><strong>A bug found while testing — the version without <code>have_lock</code> deleted the first copy's lock</strong> when the second copy exited, because the cleanup removed <code>$lock</code> unconditionally. The final version removes the lock only if <em>this</em> process created it (<code>lock owned=0</code> in the second copy). Cleanup code must delete only what the script created.</li>
<li><strong>Why <code>sleep 30 &amp; wait $!</code> and not <code>sleep 30</code>:</strong> bash runs a trap only after the current <em>foreground</em> command ends. With a plain <code>sleep 30</code> the <code>SIGTERM</code> handler would wait up to 30 s (we saw this: the first version of this exercise timed out). <code>wait</code> is interrupted immediately by a signal. Long-running scripts that must stop quickly should wait this way.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 6 — dọn dẹp bằng <code>trap</code>, và chỉ chạy một bản (20 phút)</h3>
<p><strong>Tình huống.</strong> <code>job.sh</code> làm việc trong một thư mục tạm và phải giữ một khoá để cron không khởi động bản thứ hai. Nó phải xoá thư mục tạm (và khoá) khi thành công, khi lỗi <em>và</em> khi bị <code>SIGTERM</code> giết. Thử: chạy bình thường; chạy với một lệnh lỗi; chạy nền rồi gửi <code>SIGTERM</code>; khởi động bản thứ hai khi bản đầu đang giữ khoá.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 6: trap — dọn dẹp ngay cả khi script bị ngắt<br>
$ cat &gt; job.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; set -euo pipefail<br>
&gt; work=$(mktemp -d /tmp/job.XXXXXX)<br>
&gt; lock=/tmp/job.lock<br>
&gt; have_lock=0<br>
&gt; cleanup() {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;local code=$?<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;rm -rf "$work"<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;[ $have_lock = 1 ] &amp;&amp; rm -f "$lock" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# never delete a lock we do not own<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "cleanup: temp dir removed, lock owned=$have_lock (exit code was $code)"<br>
&gt; }<br>
&gt; trap cleanup EXIT<br>
&gt; trap 'echo "caught INT/TERM, exiting"; exit 130' INT TERM<br>
&gt; if ! ( set -o noclobber; echo $$ &gt; "$lock" ) 2&gt;/dev/null; then<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "another instance is running (lock exists)"; exit 1<br>
&gt; fi<br>
&gt; have_lock=1<br>
&gt; echo "working in a temp dir: $([ -d "$work" ] &amp;&amp; echo exists)"<br>
&gt; echo "step 1 ok" &gt; "$work/state"<br>
&gt; if [ "&#36;{1:-}" = fail ]; then false; fi<br>
&gt; if [ "&#36;{1:-}" = hang ]; then sleep 30 &amp; wait $!; fi<br>
&gt; echo "done"<br>
&gt; END<br>
$ chmod +x job.sh<br>
$ ./job.sh<br>
working in a temp dir: exists<br>
done<br>
cleanup: temp dir removed, lock owned=1 (exit code was 0)<br>
$ echo "exit: $?"<br>
exit: 0<br>
$ ls /tmp | grep -c '^job' || true<br>
0<br>
$ ./job.sh fail<br>
working in a temp dir: exists<br>
cleanup: temp dir removed, lock owned=1 (exit code was 1)<br>
$ echo "exit: $?"<br>
exit: 1<br>
# Bị ngắt: gửi SIGTERM cho script đang chạy<br>
$ ./job.sh hang &amp; sleep 1; kill -TERM %1; wait %1; echo "exit: $?"<br>
working in a temp dir: exists<br>
caught INT/TERM, exiting<br>
cleanup: temp dir removed, lock owned=1 (exit code was 130)<br>
exit: 130<br>
$ ls /tmp | grep -c '^job' || true<br>
0<br>
# Bản thứ hai chạy khi bản đầu đang giữ khoá<br>
$ ./job.sh hang &amp; sleep 1; ./job.sh; echo "second exit: $?"; kill -TERM %1; wait %1<br>
working in a temp dir: exists<br>
another instance is running (lock exists)<br>
cleanup: temp dir removed, lock owned=0 (exit code was 1)<br>
second exit: 1<br>
caught INT/TERM, exiting<br>
cleanup: temp dir removed, lock owned=1 (exit code was 130)</div>
<ul>
<li><code>trap 'lệnh' EXIT</code> chạy khi script kết thúc <em>vì bất kỳ lý do nào</em> — thành công, bị <code>set -e</code> dừng, hay <code>exit</code> trong một handler. <code>$?</code> bên trong handler vẫn giữ mã thoát sắp trả về (<code>0</code>, <code>1</code>, <code>130</code> ở trên). <code>trap … INT TERM</code> phản ứng với Ctrl-C và <code>kill</code>; lệnh <code>exit 130</code> của nó rồi kích hoạt handler <code>EXIT</code>. <code>SIGKILL</code> (137) không bắt được — không gì dọn dẹp được sau nó (bài 6 của CS.1).</li>
<li><code>mktemp -d</code> tạo thư mục tạm riêng và duy nhất; đừng bao giờ dùng <code>/tmp/tên</code> cố định (tên đoán trước được là lỗ hổng bảo mật và nguồn va chạm).</li>
<li><strong>Tệp khoá.</strong> <code>set -o noclobber</code> làm <code>&gt;</code> thất bại nếu tệp đã có, nên <code>echo $$ &gt; lock</code> là phép "tạo nếu chưa có" <em>nguyên tử</em> (kiểm tra và tạo là một lời gọi hệ thống, không có race). Bản thứ hai in <code>another instance is running</code> và thoát 1. Trên production bạn sẽ ghi PID và kiểm tra nó còn sống, hoặc dùng <code>flock</code>.</li>
<li><strong>Một lỗi tìm ra khi thử — bản không có <code>have_lock</code> đã xoá khoá của bản đầu</strong> khi bản thứ hai thoát, vì phần dọn dẹp xoá <code>$lock</code> vô điều kiện. Bản cuối chỉ xoá khoá nếu <em>chính tiến trình này</em> đã tạo nó (<code>lock owned=0</code> ở bản thứ hai). Mã dọn dẹp chỉ được xoá thứ script đã tạo.</li>
<li><strong>Vì sao <code>sleep 30 &amp; wait $!</code> chứ không phải <code>sleep 30</code>:</strong> bash chỉ chạy trap sau khi lệnh <em>foreground</em> hiện tại kết thúc. Với <code>sleep 30</code> trơn, handler <code>SIGTERM</code> phải chờ tới 30 s (chúng tôi đã thấy: phiên bản đầu của bài này bị quá giờ). <code>wait</code> bị tín hiệu ngắt ngay. Script chạy lâu mà phải dừng nhanh nên chờ theo cách này.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 7 — a backup script with rotation (25 min)</h3>
<p><strong>Situation.</strong> Write <code>backup.sh SRC DEST KEEP [STAMP]</code>: pack <code>SRC</code> into <code>DEST/backup-STAMP.tar.gz</code> (default stamp = current date and time), never leave a half-written file under the final name, then delete all but the newest <code>KEEP</code> backups. It must refuse to run without arguments and with a source that is not a folder (different exit codes). Test it with five fake dates and <code>KEEP=3</code>, and prove the newest backup restores.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 7: backup script with rotation (keep the newest N)<br>
$ mkdir -p data backups<br>
$ echo "orders table" &gt; data/orders.sql<br>
$ echo "users table" &gt; data/users.sql<br>
$ cat &gt; backup.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; # usage: backup.sh &lt;source-dir&gt; &lt;backup-dir&gt; &lt;keep&gt; [stamp]<br>
&gt; set -euo pipefail<br>
&gt; src=&#36;{1:?usage: $0 &lt;source-dir&gt; &lt;backup-dir&gt; &lt;keep&gt; [stamp]}<br>
&gt; dest=&#36;{2:?missing backup dir}<br>
&gt; keep=&#36;{3:?missing keep count}<br>
&gt; stamp=&#36;{4:-$(date +%Y%m%d-%H%M%S)}<br>
&gt; [ -d "$src" ] || { echo "error: $src is not a directory" &gt;&amp;2; exit 2; }<br>
&gt; mkdir -p "$dest"<br>
&gt; tmp="$dest/.partial-$stamp.tar.gz"<br>
&gt; out="$dest/backup-$stamp.tar.gz"<br>
&gt; tar czf "$tmp" -C "$(dirname "$src")" "$(basename "$src")"<br>
&gt; mv "$tmp" "$out" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# a half-written file never gets the final name<br>
&gt; echo "created $(basename "$out") ($(stat -c %s "$out") bytes)"<br>
&gt; # rotation: names sort by time, so list, skip the newest $keep, delete the rest<br>
&gt; ls -1 "$dest"/backup-*.tar.gz | sort -r | tail -n +$((keep + 1)) | while read -r old; do<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "rotate: removing $(basename "$old")"<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;rm -- "$old"<br>
&gt; done<br>
&gt; END<br>
$ chmod +x backup.sh<br>
$ ./backup.sh<br>
./backup.sh: line 4: 1: usage: ./backup.sh &lt;source-dir&gt; &lt;backup-dir&gt; &lt;keep&gt; [stamp]<br>
$ echo "exit: $?"<br>
exit: 1<br>
$ ./backup.sh nodir backups 3<br>
error: nodir is not a directory<br>
$ echo "exit: $?"<br>
exit: 2<br>
$ for d in 20261020 20261021 20261022 20261023 20261024; do ./backup.sh data backups 3 $d-0300; done<br>
created backup-20261020-0300.tar.gz (184 bytes)<br>
created backup-20261021-0300.tar.gz (184 bytes)<br>
created backup-20261022-0300.tar.gz (184 bytes)<br>
created backup-20261023-0300.tar.gz (184 bytes)<br>
rotate: removing backup-20261020-0300.tar.gz<br>
created backup-20261024-0300.tar.gz (184 bytes)<br>
rotate: removing backup-20261021-0300.tar.gz<br>
$ ls backups<br>
backup-20261022-0300.tar.gz<br>
backup-20261023-0300.tar.gz<br>
backup-20261024-0300.tar.gz<br>
# Verify the newest backup really restores<br>
$ mkdir test-restore &amp;&amp; tar xzf backups/backup-20261024-0300.tar.gz -C test-restore &amp;&amp; diff -r data test-restore/data &amp;&amp; echo "restore verified"<br>
restore verified<br>
# How you would schedule it (cron line, read in Lab 4)<br>
$ echo '30 3 * * * &nbsp;/home/deploy/backup.sh /srv/app/data /srv/backups 7 &gt;&gt; /var/log/backup.log 2&gt;&amp;1'<br>
30 3 * * * &nbsp;/home/deploy/backup.sh /srv/app/data /srv/backups 7 &gt;&gt; /var/log/backup.log 2&gt;&amp;1</div>
<ul>
<li><code>&#36;{1:?message}</code> aborts with the message if <code>$1</code> is missing — one line per required argument. The first call exited with 1 and bash's own error text; the second, with a source that is not a folder, exited with 2 from our own check. Different codes let the caller tell the failures apart.</li>
<li><strong>Atomic result.</strong> <code>tar</code> writes to <code>.partial-STAMP.tar.gz</code> and only <code>mv</code> (an atomic rename within a folder, Lab 1 exercise 8) gives it the final name. If the machine dies during <code>tar</code>, no <code>backup-*.tar.gz</code> exists that looks complete but is not — and the rotation, which only looks at <code>backup-*</code>, can never delete good backups in favour of a broken one.</li>
<li><strong>Rotation.</strong> The names contain a sortable date (<code>YYYYMMDD-HHMMSS</code>), so alphabetical order is time order. <code>ls -1 … | sort -r</code> puts the newest first; <code>tail -n +$((keep + 1))</code> prints from line <code>keep+1</code> onward = everything older than the newest 3; <code>while read</code> deletes them. After five runs, exactly the 22nd, 23rd and 24th remain. <code>rm -- "$old"</code>: the <code>--</code> stops a name beginning with <code>-</code> being read as an option.</li>
<li><strong>Verify, do not assume.</strong> The last step restores into a scratch folder and compares with <code>diff -r</code>. Real backup scripts also check free space first, copy to another machine (<code>scp</code>/<code>rsync</code>/object storage) — a backup on the same disk dies with the disk — and log the result.</li>
<li>The <code>echo</code> line is how this would be scheduled by <code>cron</code>: minute 30, hour 3, every day; its fields are decoded in Lab 4. Redirecting <code>&gt;&gt; log 2&gt;&amp;1</code> is what makes a cron job debuggable.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 7 — script sao lưu có xoay vòng (25 phút)</h3>
<p><strong>Tình huống.</strong> Viết <code>backup.sh NGUỒN ĐÍCH GIỮ [NHÃN]</code>: nén <code>NGUỒN</code> thành <code>ĐÍCH/backup-NHÃN.tar.gz</code> (nhãn mặc định = ngày giờ hiện tại), không bao giờ để một tệp ghi dở mang tên cuối cùng, rồi xoá mọi bản trừ <code>GIỮ</code> bản mới nhất. Nó phải từ chối chạy khi thiếu tham số và khi nguồn không phải thư mục (mã thoát khác nhau). Thử với năm ngày giả và <code>GIỮ=3</code>, và chứng minh bản mới nhất khôi phục được.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 7: script sao lưu có xoay vòng (giữ N bản mới nhất)<br>
$ mkdir -p data backups<br>
$ echo "orders table" &gt; data/orders.sql<br>
$ echo "users table" &gt; data/users.sql<br>
$ cat &gt; backup.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; # usage: backup.sh &lt;source-dir&gt; &lt;backup-dir&gt; &lt;keep&gt; [stamp]<br>
&gt; set -euo pipefail<br>
&gt; src=&#36;{1:?usage: $0 &lt;source-dir&gt; &lt;backup-dir&gt; &lt;keep&gt; [stamp]}<br>
&gt; dest=&#36;{2:?missing backup dir}<br>
&gt; keep=&#36;{3:?missing keep count}<br>
&gt; stamp=&#36;{4:-$(date +%Y%m%d-%H%M%S)}<br>
&gt; [ -d "$src" ] || { echo "error: $src is not a directory" &gt;&amp;2; exit 2; }<br>
&gt; mkdir -p "$dest"<br>
&gt; tmp="$dest/.partial-$stamp.tar.gz"<br>
&gt; out="$dest/backup-$stamp.tar.gz"<br>
&gt; tar czf "$tmp" -C "$(dirname "$src")" "$(basename "$src")"<br>
&gt; mv "$tmp" "$out" &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;# a half-written file never gets the final name<br>
&gt; echo "created $(basename "$out") ($(stat -c %s "$out") bytes)"<br>
&gt; # rotation: names sort by time, so list, skip the newest $keep, delete the rest<br>
&gt; ls -1 "$dest"/backup-*.tar.gz | sort -r | tail -n +$((keep + 1)) | while read -r old; do<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "rotate: removing $(basename "$old")"<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;rm -- "$old"<br>
&gt; done<br>
&gt; END<br>
$ chmod +x backup.sh<br>
$ ./backup.sh<br>
./backup.sh: line 4: 1: usage: ./backup.sh &lt;source-dir&gt; &lt;backup-dir&gt; &lt;keep&gt; [stamp]<br>
$ echo "exit: $?"<br>
exit: 1<br>
$ ./backup.sh nodir backups 3<br>
error: nodir is not a directory<br>
$ echo "exit: $?"<br>
exit: 2<br>
$ for d in 20261020 20261021 20261022 20261023 20261024; do ./backup.sh data backups 3 $d-0300; done<br>
created backup-20261020-0300.tar.gz (184 bytes)<br>
created backup-20261021-0300.tar.gz (184 bytes)<br>
created backup-20261022-0300.tar.gz (184 bytes)<br>
created backup-20261023-0300.tar.gz (184 bytes)<br>
rotate: removing backup-20261020-0300.tar.gz<br>
created backup-20261024-0300.tar.gz (184 bytes)<br>
rotate: removing backup-20261021-0300.tar.gz<br>
$ ls backups<br>
backup-20261022-0300.tar.gz<br>
backup-20261023-0300.tar.gz<br>
backup-20261024-0300.tar.gz<br>
# Kiểm tra bản mới nhất thật sự khôi phục được<br>
$ mkdir test-restore &amp;&amp; tar xzf backups/backup-20261024-0300.tar.gz -C test-restore &amp;&amp; diff -r data test-restore/data &amp;&amp; echo "restore verified"<br>
restore verified<br>
# Cách lên lịch (dòng cron, đọc ở Lab 4)<br>
$ echo '30 3 * * * &nbsp;/home/deploy/backup.sh /srv/app/data /srv/backups 7 &gt;&gt; /var/log/backup.log 2&gt;&amp;1'<br>
30 3 * * * &nbsp;/home/deploy/backup.sh /srv/app/data /srv/backups 7 &gt;&gt; /var/log/backup.log 2&gt;&amp;1</div>
<ul>
<li><code>&#36;{1:?thông_báo}</code> dừng với thông báo nếu thiếu <code>$1</code> — một dòng cho mỗi tham số bắt buộc. Lần gọi đầu thoát với 1 và thông báo riêng của bash; lần hai, nguồn không phải thư mục, thoát với 2 từ phép kiểm tra của chính ta. Mã khác nhau giúp người gọi phân biệt các thất bại.</li>
<li><strong>Kết quả nguyên tử.</strong> <code>tar</code> ghi vào <code>.partial-NHÃN.tar.gz</code> và chỉ <code>mv</code> (đổi tên nguyên tử trong một thư mục, Lab 1 bài 8) mới cho nó tên cuối. Nếu máy chết giữa lúc <code>tar</code>, không có tệp <code>backup-*.tar.gz</code> nào trông như hoàn chỉnh mà thực ra hỏng — và phần xoay vòng, chỉ nhìn <code>backup-*</code>, không bao giờ xoá bản tốt để giữ bản hỏng.</li>
<li><strong>Xoay vòng.</strong> Tên chứa ngày có thể sắp xếp (<code>YYYYMMDD-HHMMSS</code>), nên thứ tự chữ cái chính là thứ tự thời gian. <code>ls -1 … | sort -r</code> đặt bản mới nhất lên đầu; <code>tail -n +$((keep + 1))</code> in từ dòng <code>keep+1</code> trở đi = mọi thứ cũ hơn 3 bản mới nhất; <code>while read</code> xoá chúng. Sau năm lần chạy còn đúng các bản 22, 23, 24. <code>rm -- "$old"</code>: <code>--</code> ngăn tên bắt đầu bằng <code>-</code> bị đọc thành tuỳ chọn.</li>
<li><strong>Kiểm chứng, đừng giả định.</strong> Bước cuối khôi phục vào thư mục thử và so với <code>diff -r</code>. Script sao lưu thật còn kiểm tra dung lượng trống trước, chép sang máy khác (<code>scp</code>/<code>rsync</code>/kho đối tượng) — bản sao lưu cùng đĩa chết cùng đĩa — và ghi log kết quả.</li>
<li>Dòng <code>echo</code> là cách <code>cron</code> sẽ lên lịch cho nó: phút 30, giờ 3, mỗi ngày; các trường của nó được giải ở Lab 4. Chuyển hướng <code>&gt;&gt; log 2&gt;&amp;1</code> là thứ làm một job cron gỡ lỗi được.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 8 — a health-check script (25 min)</h3>
<p><strong>Situation.</strong> Your monitoring system runs <code>health.sh NAME PORT [DISK%]</code> every minute and looks at the exit code: <strong>0 = OK, 1 = WARNING, 2 = CRITICAL</strong> (the convention of Nagios and many monitoring tools). The script must check that (1) a process with that exact name is running, (2) the TCP port accepts a connection, (3) the root disk is below a threshold, print one line per check, and return the <em>worst</em> status. Test it with nothing running, with a real Node server on port 4000, and with an absurdly low disk threshold.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 8: a health-check script with Nagios-style exit codes (0 OK, 1 WARNING, 2 CRITICAL)<br>
$ cat &gt; fake-api.js &lt;&lt;'END'<br>
&gt; require('http').createServer((q, r) =&gt; { r.end('ok'); }).listen(4000, '127.0.0.1');<br>
&gt; END<br>
$ cat &gt; health.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; # usage: health.sh &lt;process-name&gt; &lt;port&gt; [disk-warn-percent]<br>
&gt; proc=&#36;{1:?process name}; port=&#36;{2:?port}; warn=&#36;{3:-90}<br>
&gt; status=0; worst() { [ "$1" -gt "$status" ] &amp;&amp; status=$1; return 0; }<br>
&gt; if pgrep -x "$proc" &gt; /dev/null; then<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;process $proc is running (pid $(pgrep -x "$proc" | head -n 1))"<br>
&gt; else<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "CRITICAL process $proc is NOT running"; worst 2<br>
&gt; fi<br>
&gt; if (exec 3&lt;&gt;/dev/tcp/127.0.0.1/"$port") 2&gt;/dev/null; then<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;port $port accepts connections"<br>
&gt; else<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "CRITICAL port $port refuses connections"; worst 2<br>
&gt; fi<br>
&gt; use=$(df -P / | awk 'NR==2 {gsub("%", "", $5); print $5}')<br>
&gt; if [ "$use" -ge "$warn" ]; then echo "WARNING &nbsp;disk / is &#36;{use}% full (limit &#36;{warn}%)"; worst 1<br>
&gt; else echo "OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;disk / is below &#36;{warn}%"; fi<br>
&gt; exit $status<br>
&gt; END<br>
$ chmod +x health.sh<br>
$ ./health.sh node 4000<br>
CRITICAL process node is NOT running<br>
CRITICAL port 4000 refuses connections<br>
OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;disk / is below 90%<br>
$ echo "exit: $?"<br>
exit: 2<br>
$ node fake-api.js &amp; sleep 1<br>
$ ./health.sh node 4000<br>
OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;process node is running (pid 29)<br>
OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;port 4000 accepts connections<br>
OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;disk / is below 90%<br>
$ echo "exit: $?"<br>
exit: 0<br>
$ ./health.sh node 4000 1<br>
OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;process node is running (pid 29)<br>
OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;port 4000 accepts connections<br>
WARNING &nbsp;disk / is 6% full (limit 1%)<br>
$ echo "exit: $?"<br>
exit: 1<br>
$ kill %1; wait %1 2&gt;/dev/null; true</div>
<ul>
<li><code>pgrep -x NAME</code> finds processes by exact name (without <code>-x</code> it is a substring match, so <code>pgrep node</code> would also match <code>nodemon</code>). It returns 0 if at least one exists.</li>
<li><strong><code>/dev/tcp/HOST/PORT</code></strong> is a bash feature: redirecting to it opens a TCP connection — no <code>nc</code> or <code>curl</code> needed (this minimal container has neither, and neither does a minimal Docker image). The subshell <code>( exec 3&lt;&gt;… )</code> closes the connection when it ends. Success → the port accepts; failure → "Connection refused". Note: a port that accepts connections is not proof that the application answers correctly; a real check would also request <code>/health</code> and test the HTTP status.</li>
<li><code>df -P /</code> (POSIX format, one line per file system) + <code>awk</code> extracts the use percentage from column 5; <code>gsub("%","",$5)</code> strips the sign so the shell can compare numbers.</li>
<li><strong>"Worst status wins".</strong> The helper <code>worst N</code> only raises the variable <code>status</code>, never lowers it; the script ends with <code>exit $status</code>. First run: two criticals → exit 2. Second run (server started): all OK → 0. Third run, limit 1 %: only the disk warns → 1 (the percentage printed is the disk of the machine that ran this transcript).</li>
<li>Design lesson: a check script must <strong>never hang</strong> (use <code>timeout 5 …</code> around anything that can block) and must print something readable for the human who gets the alert at night. Scripts like this are what Kubernetes liveness probes and Docker <code>HEALTHCHECK</code> run too.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 8 — script kiểm tra sức khoẻ (25 phút)</h3>
<p><strong>Tình huống.</strong> Hệ thống giám sát chạy <code>health.sh TÊN CỔNG [ĐĨA%]</code> mỗi phút và nhìn mã thoát: <strong>0 = OK, 1 = CẢNH BÁO, 2 = NGHIÊM TRỌNG</strong> (quy ước của Nagios và nhiều công cụ giám sát). Script phải kiểm tra (1) có tiến trình tên đúng như vậy đang chạy, (2) cổng TCP nhận kết nối, (3) đĩa gốc dưới một ngưỡng, in một dòng cho mỗi phép kiểm, và trả về trạng thái <em>tệ nhất</em>. Thử khi chưa có gì chạy, với một Node server thật ở cổng 4000, và với ngưỡng đĩa thấp phi lý.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 8: script kiểm tra sức khoẻ với mã thoát kiểu Nagios (0 OK, 1 CẢNH BÁO, 2 NGHIÊM TRỌNG)<br>
$ cat &gt; fake-api.js &lt;&lt;'END'<br>
&gt; require('http').createServer((q, r) =&gt; { r.end('ok'); }).listen(4000, '127.0.0.1');<br>
&gt; END<br>
$ cat &gt; health.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; # usage: health.sh &lt;process-name&gt; &lt;port&gt; [disk-warn-percent]<br>
&gt; proc=&#36;{1:?process name}; port=&#36;{2:?port}; warn=&#36;{3:-90}<br>
&gt; status=0; worst() { [ "$1" -gt "$status" ] &amp;&amp; status=$1; return 0; }<br>
&gt; if pgrep -x "$proc" &gt; /dev/null; then<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;process $proc is running (pid $(pgrep -x "$proc" | head -n 1))"<br>
&gt; else<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "CRITICAL process $proc is NOT running"; worst 2<br>
&gt; fi<br>
&gt; if (exec 3&lt;&gt;/dev/tcp/127.0.0.1/"$port") 2&gt;/dev/null; then<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;port $port accepts connections"<br>
&gt; else<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "CRITICAL port $port refuses connections"; worst 2<br>
&gt; fi<br>
&gt; use=$(df -P / | awk 'NR==2 {gsub("%", "", $5); print $5}')<br>
&gt; if [ "$use" -ge "$warn" ]; then echo "WARNING &nbsp;disk / is &#36;{use}% full (limit &#36;{warn}%)"; worst 1<br>
&gt; else echo "OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;disk / is below &#36;{warn}%"; fi<br>
&gt; exit $status<br>
&gt; END<br>
$ chmod +x health.sh<br>
$ ./health.sh node 4000<br>
CRITICAL process node is NOT running<br>
CRITICAL port 4000 refuses connections<br>
OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;disk / is below 90%<br>
$ echo "exit: $?"<br>
exit: 2<br>
$ node fake-api.js &amp; sleep 1<br>
$ ./health.sh node 4000<br>
OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;process node is running (pid 29)<br>
OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;port 4000 accepts connections<br>
OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;disk / is below 90%<br>
$ echo "exit: $?"<br>
exit: 0<br>
$ ./health.sh node 4000 1<br>
OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;process node is running (pid 29)<br>
OK &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;port 4000 accepts connections<br>
WARNING &nbsp;disk / is 6% full (limit 1%)<br>
$ echo "exit: $?"<br>
exit: 1<br>
$ kill %1; wait %1 2&gt;/dev/null; true</div>
<ul>
<li><code>pgrep -x TÊN</code> tìm tiến trình theo tên chính xác (không có <code>-x</code> là khớp chuỗi con, nên <code>pgrep node</code> cũng khớp <code>nodemon</code>). Trả về 0 nếu có ít nhất một tiến trình.</li>
<li><strong><code>/dev/tcp/MÁY/CỔNG</code></strong> là tính năng của bash: chuyển hướng tới nó mở một kết nối TCP — không cần <code>nc</code> hay <code>curl</code> (container tối giản này không có cái nào, ảnh Docker tối giản cũng vậy). Subshell <code>( exec 3&lt;&gt;… )</code> đóng kết nối khi kết thúc. Thành công → cổng nhận kết nối; thất bại → "Connection refused". Lưu ý: cổng nhận kết nối chưa chứng minh ứng dụng trả lời đúng; kiểm tra thật còn gọi <code>/health</code> và xem mã HTTP.</li>
<li><code>df -P /</code> (định dạng POSIX, một dòng cho mỗi hệ thống tệp) + <code>awk</code> lấy phần trăm dùng ở cột 5; <code>gsub("%","",$5)</code> bỏ dấu % để shell so sánh số được.</li>
<li><strong>"Trạng thái tệ nhất thắng".</strong> Hàm phụ <code>worst N</code> chỉ nâng biến <code>status</code>, không bao giờ hạ; script kết thúc bằng <code>exit $status</code>. Lần chạy đầu: hai nghiêm trọng → thoát 2. Lần hai (đã bật server): tất cả OK → 0. Lần ba, ngưỡng 1 %: chỉ đĩa cảnh báo → 1 (phần trăm in ra là của đĩa máy đã chạy bản ghi này).</li>
<li>Bài học thiết kế: script kiểm tra <strong>không bao giờ được treo</strong> (dùng <code>timeout 5 …</code> quanh bất cứ thứ gì có thể chặn) và phải in ra thứ người nhận cảnh báo lúc nửa đêm đọc hiểu được. Kubernetes liveness probe và Docker <code>HEALTHCHECK</code> cũng chạy những script như thế này.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 9 — analyse an access log with awk and sed (25 min)</h3>
<p><strong>Situation.</strong> The access log has 7 lines: <code>IP - - [date] "METHOD PATH PROTO" STATUS BYTES SECONDS</code>. Answer with <code>awk</code>: the first column pair IP/status; every request with status ≥ 500 (IP, path, seconds); a count per status; total and mean bytes; the number of requests and the average time <em>per path</em>. Then with <code>sed</code>: print lines 4 and 7; change <code>HTTP/1.1</code> to <code>H1</code>; hide the last byte of each IP (privacy), first on the screen and then <em>in the file</em>; delete the health-check lines.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 9: awk and sed on a real-looking access log<br>
# awk splits each line into fields $1 $2 ...; $NF is the last. Fields: 1=IP 6=path 8=status 9=bytes 10=seconds (=$NF)<br>
$ awk '{print $1, $8}' access.log | head -n 3<br>
10.0.0.5 200<br>
10.0.0.7 200<br>
10.0.0.5 401<br>
$ awk '$8 &gt;= 500 {print $1, $6, $NF "s"}' access.log<br>
10.0.0.9 /api/orders 1.900s<br>
10.0.0.9 /api/orders 2.400s<br>
$ awk '{count[$8]++} END {for (s in count) print s, count[s]}' access.log | sort<br>
200 4<br>
401 1<br>
500 2<br>
$ awk '{bytes += $9} END {printf "total %d bytes, mean %.1f per request\\n", bytes, bytes / NR}' access.log<br>
total 3784 bytes, mean 540.6 per request<br>
$ awk '{sum[$6] += $NF; n[$6]++} END {for (p in sum) printf "%-12s %d req, avg %.3fs\\n", p, n[p], sum[p] / n[p]}' access.log | sort<br>
/api/login &nbsp;&nbsp;2 req, avg 0.028s<br>
/api/orders &nbsp;2 req, avg 2.150s<br>
/api/users &nbsp;&nbsp;2 req, avg 0.025s<br>
/health &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 req, avg 0.001s<br>
# sed: s/old/new/ ; -n with p prints chosen lines ; -i edits the file<br>
$ sed -n '4p;7p' access.log | cut -c1-60<br>
10.0.0.9 - - [26/Oct/2026:10:00:04] "GET /api/orders HTTP/1.<br>
10.0.0.9 - - [26/Oct/2026:10:00:07] "GET /api/orders HTTP/1.<br>
$ sed 's/HTTP\\/1.1/H1/' access.log | head -n 1<br>
10.0.0.5 - - [26/Oct/2026:10:00:01] "GET /api/users H1" 200 512 0.020<br>
$ sed -E 's/^([0-9]+\\.[0-9]+\\.[0-9]+)\\.[0-9]+/\\1.xxx/' access.log | head -n 2<br>
10.0.0.xxx - - [26/Oct/2026:10:00:01] "GET /api/users HTTP/1.1" 200 512 0.020<br>
10.0.0.xxx - - [26/Oct/2026:10:00:02] "GET /api/users HTTP/1.1" 200 480 0.030<br>
$ cp access.log anon.log<br>
$ sed -i -E 's/^([0-9]+\\.[0-9]+\\.[0-9]+)\\.[0-9]+/\\1.xxx/' anon.log<br>
$ cut -d' ' -f1 anon.log | sort | uniq -c<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 10.0.0.xxx<br>
$ sed '/health/d' access.log | wc -l<br>
6</div>
<ul>
<li><strong><code>awk 'pattern {action}'</code></strong> reads line by line and splits it into fields on whitespace: <code>$1 … $NF</code> (<code>NF</code> = number of fields, <code>NR</code> = line number). Count the fields on one line first: IP is <code>$1</code>, the path is <code>$6</code>, the status <code>$8</code>, the bytes <code>$9</code>, the time <code>$NF</code> — the quotes and brackets of the log format are part of fields. Wrong field numbers are the usual mistake (we made it too, on our first run).</li>
<li><code>$8 &gt;= 500 {print …}</code> — pattern then action. <code>count[$8]++</code> is an <em>associative array</em>; the <code>END { … }</code> block runs after the last line. This "group and count" idiom replaces <code>sort | uniq -c</code> when you also need sums: <code>sum[$6] += $NF</code>, <code>n[$6]++</code>, then average = sum/n. Result: <code>/api/orders</code> averages 2.150 s — the slow, failing endpoint — while <code>/health</code> takes 1 ms.</li>
<li>awk's order for <code>for (k in array)</code> is unspecified, so we pipe through <code>sort</code>. Debian's <code>awk</code> is <code>mawk</code> (fast, small, no GNU extras such as <code>gensub</code> or <code>strtonum</code>); on macOS you get BSD awk, on Fedora gawk — keep to the portable subset.</li>
<li><strong><code>sed</code></strong> edits a <em>stream</em>: <code>s/old/new/</code> substitutes (first match per line; add <code>g</code> for all); the delimiter can be any character (<code>s|a|b|</code>) to avoid escaping <code>/</code>; <code>-E</code> enables extended regex with <code>( )</code> groups and <code>\\1</code> back-references; <code>-n '4p;7p'</code> prints only chosen lines; <code>/health/d</code> deletes matching lines.</li>
<li><strong><code>sed -i</code> edits the file in place</strong> — there is no undo. Try the command without <code>-i</code> first (as we did), or use <code>-i.bak</code> to keep a copy. The seven IPs became <code>10.0.0.xxx</code>: anonymising logs before sharing them is a real job.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 9 — phân tích access log bằng awk và sed (25 phút)</h3>
<p><strong>Tình huống.</strong> Access log có 7 dòng: <code>IP - - [ngày] "PHƯƠNG_THỨC ĐƯỜNG_DẪN GIAO_THỨC" MÃ BYTE GIÂY</code>. Trả lời bằng <code>awk</code>: cặp IP/mã của vài dòng đầu; mọi request có mã ≥ 500 (IP, đường dẫn, số giây); số lượng theo từng mã; tổng và trung bình byte; số request và thời gian trung bình <em>theo từng đường dẫn</em>. Rồi bằng <code>sed</code>: in dòng 4 và 7; đổi <code>HTTP/1.1</code> thành <code>H1</code>; che số cuối của mỗi IP (riêng tư), trước hết trên màn hình rồi <em>trong tệp</em>; xoá các dòng health-check.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 9: awk và sed trên một access log giống thật<br>
# awk tách mỗi dòng thành trường $1 $2 ...; $NF là trường cuối. Trường: 1=IP 6=đường dẫn 8=mã 9=byte 10=giây (=$NF)<br>
$ awk '{print $1, $8}' access.log | head -n 3<br>
10.0.0.5 200<br>
10.0.0.7 200<br>
10.0.0.5 401<br>
$ awk '$8 &gt;= 500 {print $1, $6, $NF "s"}' access.log<br>
10.0.0.9 /api/orders 1.900s<br>
10.0.0.9 /api/orders 2.400s<br>
$ awk '{count[$8]++} END {for (s in count) print s, count[s]}' access.log | sort<br>
200 4<br>
401 1<br>
500 2<br>
$ awk '{bytes += $9} END {printf "total %d bytes, mean %.1f per request\\n", bytes, bytes / NR}' access.log<br>
total 3784 bytes, mean 540.6 per request<br>
$ awk '{sum[$6] += $NF; n[$6]++} END {for (p in sum) printf "%-12s %d req, avg %.3fs\\n", p, n[p], sum[p] / n[p]}' access.log | sort<br>
/api/login &nbsp;&nbsp;2 req, avg 0.028s<br>
/api/orders &nbsp;2 req, avg 2.150s<br>
/api/users &nbsp;&nbsp;2 req, avg 0.025s<br>
/health &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 req, avg 0.001s<br>
# sed: s/cũ/mới/ ; -n với p in dòng được chọn ; -i sửa tại tệp<br>
$ sed -n '4p;7p' access.log | cut -c1-60<br>
10.0.0.9 - - [26/Oct/2026:10:00:04] "GET /api/orders HTTP/1.<br>
10.0.0.9 - - [26/Oct/2026:10:00:07] "GET /api/orders HTTP/1.<br>
$ sed 's/HTTP\\/1.1/H1/' access.log | head -n 1<br>
10.0.0.5 - - [26/Oct/2026:10:00:01] "GET /api/users H1" 200 512 0.020<br>
$ sed -E 's/^([0-9]+\\.[0-9]+\\.[0-9]+)\\.[0-9]+/\\1.xxx/' access.log | head -n 2<br>
10.0.0.xxx - - [26/Oct/2026:10:00:01] "GET /api/users HTTP/1.1" 200 512 0.020<br>
10.0.0.xxx - - [26/Oct/2026:10:00:02] "GET /api/users HTTP/1.1" 200 480 0.030<br>
$ cp access.log anon.log<br>
$ sed -i -E 's/^([0-9]+\\.[0-9]+\\.[0-9]+)\\.[0-9]+/\\1.xxx/' anon.log<br>
$ cut -d' ' -f1 anon.log | sort | uniq -c<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;7 10.0.0.xxx<br>
$ sed '/health/d' access.log | wc -l<br>
6</div>
<ul>
<li><strong><code>awk 'mẫu {hành động}'</code></strong> đọc từng dòng và tách thành trường theo khoảng trắng: <code>$1 … $NF</code> (<code>NF</code> = số trường, <code>NR</code> = số thứ tự dòng). Hãy đếm trường trên một dòng trước: IP là <code>$1</code>, đường dẫn <code>$6</code>, mã <code>$8</code>, byte <code>$9</code>, thời gian <code>$NF</code> — dấu nháy và ngoặc của định dạng log là một phần của trường. Đánh sai số trường là lỗi thường gặp (chúng tôi cũng mắc ở lần chạy đầu).</li>
<li><code>$8 &gt;= 500 {print …}</code> — mẫu rồi hành động. <code>count[$8]++</code> là <em>mảng kết hợp</em>; khối <code>END { … }</code> chạy sau dòng cuối. Thành ngữ "gom và đếm" này thay thế <code>sort | uniq -c</code> khi bạn còn cần tổng: <code>sum[$6] += $NF</code>, <code>n[$6]++</code>, rồi trung bình = sum/n. Kết quả: <code>/api/orders</code> trung bình 2,150 s — endpoint chậm và lỗi — còn <code>/health</code> mất 1 ms.</li>
<li>Thứ tự của <code>for (k in mảng)</code> trong awk không xác định, nên ta cho qua <code>sort</code>. <code>awk</code> của Debian là <code>mawk</code> (nhanh, nhỏ, không có tiện ích GNU như <code>gensub</code> hay <code>strtonum</code>); trên macOS là BSD awk, trên Fedora là gawk — hãy dùng phần chung di động.</li>
<li><strong><code>sed</code></strong> sửa một <em>luồng</em>: <code>s/cũ/mới/</code> thay thế (lần khớp đầu của mỗi dòng; thêm <code>g</code> cho tất cả); dấu phân cách có thể là ký tự bất kỳ (<code>s|a|b|</code>) để khỏi thoát <code>/</code>; <code>-E</code> bật regex mở rộng với nhóm <code>( )</code> và tham chiếu ngược <code>\\1</code>; <code>-n '4p;7p'</code> chỉ in dòng được chọn; <code>/health/d</code> xoá dòng khớp.</li>
<li><strong><code>sed -i</code> sửa tại chỗ trong tệp</strong> — không có hoàn tác. Hãy thử lệnh không có <code>-i</code> trước (như ta đã làm), hoặc dùng <code>-i.bak</code> để giữ bản sao. Bảy IP thành <code>10.0.0.xxx</code>: ẩn danh log trước khi chia sẻ là một việc có thật.</li>
</ul>
</details>`),
    bi(`<h3>⚠️ Common errors — how to read them</h3>
<table>
<thead><tr><th>Message or symptom</th><th>Cause</th><th>Fix</th></tr></thead>
<tbody>
<tr><td><code>bad interpreter: No such file or directory</code> or <code>$'\\r': command not found</code></td><td>the file has Windows line endings (CRLF), so the shebang is <code>bash\\r</code></td><td><code>sed -i 's/\\r$//' script.sh</code>; set your editor to LF</td></tr>
<tr><td><code>Permission denied</code> when running <code>./script.sh</code></td><td>no execute bit</td><td><code>chmod +x</code>, or run <code>bash script.sh</code></td></tr>
<tr><td><code>command not found</code> for your own script</td><td>the current folder is not in <code>$PATH</code></td><td><code>./script.sh</code></td></tr>
<tr><td><code>[: too many arguments</code> / <code>unary operator expected</code></td><td>unquoted variable that was empty or had spaces</td><td>quote: <code>[ "$x" = y ]</code></td></tr>
<tr><td><code>syntax error near unexpected token 'fi'</code> / <code>'done'</code></td><td>a missing <code>then</code>/<code>do</code>, or a missing <code>;</code> before it on the same line</td><td>read the line number bash gives; match every <code>if/fi</code>, <code>for/done</code></td></tr>
<tr><td><code>unbound variable</code></td><td><code>set -u</code> found a variable that was never set</td><td>give a default: <code>&#36;{VAR:-}</code>, or fix the typo</td></tr>
<tr><td><code>Integer expression expected</code></td><td><code>-gt</code> given text or an empty string</td><td>check that the variable holds a number: <code>[[ $n =~ ^[0-9]+$ ]]</code></td></tr>
<tr><td>The script works by hand but not in cron</td><td>cron has a tiny <code>PATH</code> and no login environment</td><td>use absolute paths, set <code>PATH</code> at the top, redirect output to a log</td></tr>
<tr><td>The script "works" but silently did nothing</td><td><code>set -e</code> missing, or an error hidden in a pipe</td><td><code>set -euo pipefail</code>; add <code>set -x</code> (trace) while debugging; run <code>bash -n script.sh</code> (syntax check) and <code>shellcheck</code> if you have it</td></tr>
</tbody>
</table>
<h3>📝 What to submit and how it is marked</h3>
<p>The lecturer sets the exact format of the real lab; this is your self-check against CLO8–9. Submit <code>Lab2_&lt;StudentID&gt;.zip</code> with the scripts <code>backup.sh</code>, <code>health.sh</code> and <code>logstats.sh</code> (your own: reads an access log and prints requests per status, top 3 IPs and the slowest path), one text file with the terminal output of a test run for each, and a few sentences on every design decision (why <code>set -euo pipefail</code>, why atomic <code>mv</code>, ...).</p>
<table>
<thead><tr><th>Criterion</th><th>What a full mark needs</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Scripts run and give correct results</td><td>on normal input and on at least two bad inputs (missing argument, missing file)</td><td>3</td></tr>
<tr><td>Safety</td><td><code>set -euo pipefail</code>; every variable quoted; cleanup with <code>trap</code>; nothing deleted that the script did not create</td><td>2.5</td></tr>
<tr><td>Structure and readability</td><td>functions, a usage message on stderr, meaningful exit codes, comments that say <em>why</em></td><td>2</td></tr>
<tr><td>Tools</td><td>correct use of <code>awk</code>/<code>sed</code>/<code>grep</code>/<code>sort</code>/<code>uniq</code> — no parsing of <code>ls</code>, no useless <code>cat</code></td><td>1.5</td></tr>
<tr><td>Explanation</td><td>you can say in one sentence what each exercise's bug or trap was</td><td>1</td></tr>
</tbody>
</table>
<p>Self-check: (1) what does <code>rm -rf "$DIR"/*</code> do when <code>DIR</code> is empty and <code>set -u</code> is on? (2) why does <code>false | true</code> succeed? (3) which signal can a trap never catch? (4) what is the difference between <code>"$@"</code> and <code>"$*"</code>? <em>Answers: the script stops with "unbound variable" before running rm · only the last stage counts without pipefail · SIGKILL (and SIGSTOP) · "$@" keeps arguments separate, "$*" is one string.</em></p>`,
    `<h3>⚠️ Lỗi hay gặp — cách đọc thông báo</h3>
<table>
<thead><tr><th>Thông báo hoặc triệu chứng</th><th>Nguyên nhân</th><th>Cách sửa</th></tr></thead>
<tbody>
<tr><td><code>bad interpreter: No such file or directory</code> hoặc <code>$'\\r': command not found</code></td><td>tệp có xuống dòng kiểu Windows (CRLF), nên shebang là <code>bash\\r</code></td><td><code>sed -i 's/\\r$//' script.sh</code>; đặt trình soạn thảo ở LF</td></tr>
<tr><td><code>Permission denied</code> khi chạy <code>./script.sh</code></td><td>thiếu bit thực thi</td><td><code>chmod +x</code>, hoặc chạy <code>bash script.sh</code></td></tr>
<tr><td><code>command not found</code> với script của chính bạn</td><td>thư mục hiện tại không nằm trong <code>$PATH</code></td><td><code>./script.sh</code></td></tr>
<tr><td><code>[: too many arguments</code> / <code>unary operator expected</code></td><td>biến không nháy bị rỗng hoặc có dấu cách</td><td>đặt nháy: <code>[ "$x" = y ]</code></td></tr>
<tr><td><code>syntax error near unexpected token 'fi'</code> / <code>'done'</code></td><td>thiếu <code>then</code>/<code>do</code>, hoặc thiếu <code>;</code> trước nó trên cùng dòng</td><td>đọc số dòng bash báo; khớp mọi cặp <code>if/fi</code>, <code>for/done</code></td></tr>
<tr><td><code>unbound variable</code></td><td><code>set -u</code> gặp biến chưa bao giờ được đặt</td><td>cho giá trị mặc định: <code>&#36;{VAR:-}</code>, hoặc sửa lỗi gõ</td></tr>
<tr><td><code>Integer expression expected</code></td><td><code>-gt</code> nhận chữ hoặc chuỗi rỗng</td><td>kiểm tra biến chứa số: <code>[[ $n =~ ^[0-9]+$ ]]</code></td></tr>
<tr><td>Script chạy tay được nhưng không chạy trong cron</td><td>cron có <code>PATH</code> rất ngắn và không có môi trường đăng nhập</td><td>dùng đường dẫn tuyệt đối, đặt <code>PATH</code> ở đầu, chuyển output vào log</td></tr>
<tr><td>Script "chạy" nhưng im lặng không làm gì</td><td>thiếu <code>set -e</code>, hoặc lỗi bị giấu trong pipe</td><td><code>set -euo pipefail</code>; thêm <code>set -x</code> (vết) khi gỡ lỗi; chạy <code>bash -n script.sh</code> (kiểm cú pháp) và <code>shellcheck</code> nếu có</td></tr>
</tbody>
</table>
<h3>📝 Nộp gì / chấm thế nào</h3>
<p>Định dạng chính xác của bài lab thật do giảng viên đặt; đây là bảng tự kiểm theo CLO8–9. Nộp <code>Lab2_&lt;MãSV&gt;.zip</code> gồm các script <code>backup.sh</code>, <code>health.sh</code> và <code>logstats.sh</code> (của riêng bạn: đọc access log và in số request theo mã, 3 IP đứng đầu và đường dẫn chậm nhất), mỗi script kèm một tệp văn bản ghi output của lần chạy thử, và vài câu về từng quyết định thiết kế (vì sao <code>set -euo pipefail</code>, vì sao <code>mv</code> nguyên tử, ...).</p>
<table>
<thead><tr><th>Tiêu chí</th><th>Điểm tối đa cần gì</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Script chạy và cho kết quả đúng</td><td>với đầu vào bình thường và ít nhất hai đầu vào xấu (thiếu tham số, thiếu tệp)</td><td>3</td></tr>
<tr><td>An toàn</td><td><code>set -euo pipefail</code>; mọi biến đặt trong nháy; dọn dẹp bằng <code>trap</code>; không xoá thứ script không tạo ra</td><td>2,5</td></tr>
<tr><td>Cấu trúc và dễ đọc</td><td>hàm, thông báo cách dùng ra stderr, mã thoát có ý nghĩa, chú thích nói <em>vì sao</em></td><td>2</td></tr>
<tr><td>Công cụ</td><td>dùng đúng <code>awk</code>/<code>sed</code>/<code>grep</code>/<code>sort</code>/<code>uniq</code> — không phân tích <code>ls</code>, không <code>cat</code> thừa</td><td>1,5</td></tr>
<tr><td>Giải thích</td><td>nói được trong một câu cái lỗi hay cái bẫy của từng bài</td><td>1</td></tr>
</tbody>
</table>
<p>Tự kiểm: (1) <code>rm -rf "$DIR"/*</code> làm gì khi <code>DIR</code> rỗng và <code>set -u</code> đang bật? (2) vì sao <code>false | true</code> thành công? (3) tín hiệu nào trap không bao giờ bắt được? (4) <code>"$@"</code> khác <code>"$*"</code> thế nào? <em>Đáp án: script dừng với "unbound variable" trước khi chạy rm · không có pipefail thì chỉ công đoạn cuối được tính · SIGKILL (và SIGSTOP) · "$@" giữ các tham số tách biệt, "$*" là một chuỗi.</em></p>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>shell script</strong></td><td>script shell</td><td>A text file of commands run by an interpreter such as bash; the first line (shebang) names it.</td></tr>
<tr><td><strong>shebang (#!)</strong></td><td>dòng khai báo trình thông dịch</td><td>The first line <code>#!/bin/bash</code> that tells the kernel which program runs the file.</td></tr>
<tr><td><strong>quoting</strong></td><td>đặt trong dấu nháy</td><td>'…' keeps text literal; "…" allows variables but prevents word splitting and globbing.</td></tr>
<tr><td><strong>word splitting</strong></td><td>tách từ</td><td>Splitting an unquoted expansion into words at spaces — the cause of the "file with a space" bug.</td></tr>
<tr><td><strong>glob / wildcard</strong></td><td>ký tự đại diện</td><td>Patterns <code>* ? [ ]</code> that the shell expands to file names before running the command.</td></tr>
<tr><td><strong>parameter expansion</strong></td><td>bung tham số</td><td><code>&#36;{v:-d}</code>, <code>&#36;{v%suffix}</code>, <code>&#36;{#v}</code>: modify a variable without calling another program.</td></tr>
<tr><td><strong>command substitution</strong></td><td>thay thế lệnh</td><td><code>$(cmd)</code> is replaced by the output of cmd.</td></tr>
<tr><td><strong>positional parameters</strong></td><td>tham số vị trí</td><td><code>$1 $2 … $# $@</code>: the script's arguments; <code>shift</code> moves them.</td></tr>
<tr><td><strong>exit status</strong></td><td>trạng thái thoát</td><td>0–255 returned by a command; 0 = success; read with <code>$?</code>.</td></tr>
<tr><td><strong>set -euo pipefail</strong></td><td>chế độ nghiêm ngặt</td><td>Stop on error, error on unset variables, a pipeline fails if any stage fails.</td></tr>
<tr><td><strong>trap</strong></td><td>bẫy tín hiệu</td><td>Registers commands to run on a signal or on exit (EXIT, INT, TERM, ERR).</td></tr>
<tr><td><strong>subshell</strong></td><td>shell con</td><td>A child copy of the shell (for <code>( )</code>, <code>$( )</code> and pipelines); its variable changes are lost.</td></tr>
<tr><td><strong>lock file</strong></td><td>tệp khoá</td><td>A file whose existence says "a copy is already running"; created atomically with noclobber or flock.</td></tr>
<tr><td><strong>backup rotation</strong></td><td>xoay vòng sao lưu</td><td>Keeping only the newest N backups and deleting the older ones.</td></tr>
<tr><td><strong>health check / probe</strong></td><td>kiểm tra sức khoẻ</td><td>A cheap automatic test of a service whose result is an exit code or HTTP status.</td></tr>
<tr><td><strong>awk</strong></td><td>awk</td><td>A line-oriented language: <code>pattern {action}</code> over whitespace-separated fields <code>$1 … $NF</code>.</td></tr>
<tr><td><strong>sed</strong></td><td>sed</td><td>Stream editor: <code>s/old/new/</code>, line selection and deletion; <code>-i</code> edits the file in place.</td></tr>
<tr><td><strong>/dev/tcp</strong></td><td>/dev/tcp</td><td>A bash feature: redirecting to <code>/dev/tcp/host/port</code> opens a TCP connection.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>shell script</strong></td><td>script shell</td><td>Tệp văn bản chứa các lệnh do một trình thông dịch như bash chạy; dòng đầu (shebang) nêu tên nó.</td></tr>
<tr><td><strong>shebang (#!)</strong></td><td>dòng khai báo trình thông dịch</td><td>Dòng đầu <code>#!/bin/bash</code> cho nhân biết chương trình nào chạy tệp.</td></tr>
<tr><td><strong>quoting</strong></td><td>đặt trong dấu nháy</td><td>'…' giữ nguyên chữ; "…" cho phép biến nhưng ngăn tách từ và bung glob.</td></tr>
<tr><td><strong>word splitting</strong></td><td>tách từ</td><td>Tách một giá trị không nháy thành các từ ở dấu cách — nguyên nhân lỗi "tệp có dấu cách".</td></tr>
<tr><td><strong>glob / wildcard</strong></td><td>ký tự đại diện</td><td>Mẫu <code>* ? [ ]</code> mà shell bung thành tên tệp trước khi chạy lệnh.</td></tr>
<tr><td><strong>parameter expansion</strong></td><td>bung tham số</td><td><code>&#36;{v:-d}</code>, <code>&#36;{v%hậu_tố}</code>, <code>&#36;{#v}</code>: biến đổi biến mà không gọi chương trình khác.</td></tr>
<tr><td><strong>command substitution</strong></td><td>thay thế lệnh</td><td><code>$(lệnh)</code> được thay bằng output của lệnh.</td></tr>
<tr><td><strong>positional parameters</strong></td><td>tham số vị trí</td><td><code>$1 $2 … $# $@</code>: các đối số của script; <code>shift</code> dịch chúng.</td></tr>
<tr><td><strong>exit status</strong></td><td>trạng thái thoát</td><td>0–255 do lệnh trả về; 0 = thành công; đọc bằng <code>$?</code>.</td></tr>
<tr><td><strong>set -euo pipefail</strong></td><td>chế độ nghiêm ngặt</td><td>Dừng khi lỗi, coi biến chưa đặt là lỗi, pipeline thất bại nếu có công đoạn thất bại.</td></tr>
<tr><td><strong>trap</strong></td><td>bẫy tín hiệu</td><td>Đăng ký lệnh chạy khi có tín hiệu hay khi thoát (EXIT, INT, TERM, ERR).</td></tr>
<tr><td><strong>subshell</strong></td><td>shell con</td><td>Bản sao con của shell (cho <code>( )</code>, <code>$( )</code> và pipeline); thay đổi biến trong đó bị mất.</td></tr>
<tr><td><strong>lock file</strong></td><td>tệp khoá</td><td>Tệp mà sự tồn tại của nó nói "đã có một bản đang chạy"; tạo nguyên tử bằng noclobber hay flock.</td></tr>
<tr><td><strong>backup rotation</strong></td><td>xoay vòng sao lưu</td><td>Chỉ giữ N bản sao lưu mới nhất và xoá các bản cũ hơn.</td></tr>
<tr><td><strong>health check / probe</strong></td><td>kiểm tra sức khoẻ</td><td>Phép thử rẻ tiền, tự động, trên một dịch vụ, có kết quả là mã thoát hay mã HTTP.</td></tr>
<tr><td><strong>awk</strong></td><td>awk</td><td>Ngôn ngữ theo dòng: <code>mẫu {hành động}</code> trên các trường <code>$1 … $NF</code> cách nhau bởi khoảng trắng.</td></tr>
<tr><td><strong>sed</strong></td><td>sed</td><td>Trình sửa luồng: <code>s/cũ/mới/</code>, chọn và xoá dòng; <code>-i</code> sửa tại chỗ trong tệp.</td></tr>
<tr><td><strong>/dev/tcp</strong></td><td>/dev/tcp</td><td>Tính năng của bash: chuyển hướng tới <code>/dev/tcp/máy/cổng</code> mở một kết nối TCP.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Lab 2 summary</h2>
<ul>
<li><strong>Quote everything:</strong> <code>"$var"</code>, <code>"$@"</code>, <code>"$(cmd)"</code>; unquoted values are split on spaces and globbed — the root of most script disasters. <code>&#36;{v:-default}</code>, <code>&#36;{v%suffix}</code> need no external program.</li>
<li><strong><code>if</code> tests an exit code</strong> (0 = true); <code>[ ]</code> is a command; <code>-gt</code> for numbers, <code>=</code> for strings; <code>[[ ]]</code> in bash; <code>&amp;&amp;</code>/<code>||</code> are short ifs.</li>
<li><strong>Loops:</strong> <code>for x in "$@"</code>, <code>while read -r … &lt; file</code> (not <code>cat | while</code>), <code>case</code> for choices; a function returns a <em>status</em>, prints its <em>value</em>; <code>local</code> keeps variables private.</li>
<li><strong>Start every serious script with <code>set -euo pipefail</code>;</strong> use <code>|| true</code> only when you accept failure; remember <code>set -e</code> is ignored in conditions.</li>
<li><strong><code>trap … EXIT</code></strong> cleans up on success, error and SIGTERM (never SIGKILL); lock with <code>noclobber</code>; delete only what you created; <code>sleep &amp; wait</code> keeps traps responsive.</li>
<li><strong>Backups:</strong> write to a temp name, <code>mv</code> atomically, rotate with sortable names and <code>tail -n +N</code>, then <em>test a restore</em> — and copy off the machine.</li>
<li><strong>Health checks</strong> return 0/1/2, never hang, print one readable line per check; <code>/dev/tcp</code> tests a port without extra tools.</li>
<li><strong>awk</strong> for columns, sums and group-by; <strong>sed</strong> for substitution and line edits; <code>-i</code> has no undo.</li>
<li><strong>Next:</strong> Lab 3 moves from scripts to C programs on Linux.</li>
</ul>`,
    `<h2>📌 Tóm tắt Lab 2</h2>
<ul>
<li><strong>Đặt mọi thứ trong nháy:</strong> <code>"$var"</code>, <code>"$@"</code>, <code>"$(lệnh)"</code>; giá trị không nháy bị tách theo dấu cách và bung glob — gốc của phần lớn thảm hoạ script. <code>&#36;{v:-mặc_định}</code>, <code>&#36;{v%hậu_tố}</code> không cần chương trình ngoài.</li>
<li><strong><code>if</code> kiểm tra một mã thoát</strong> (0 = đúng); <code>[ ]</code> là một lệnh; <code>-gt</code> cho số, <code>=</code> cho chuỗi; <code>[[ ]]</code> trong bash; <code>&amp;&amp;</code>/<code>||</code> là if rút gọn.</li>
<li><strong>Vòng lặp:</strong> <code>for x in "$@"</code>, <code>while read -r … &lt; tệp</code> (không phải <code>cat | while</code>), <code>case</code> cho các lựa chọn; hàm trả về một <em>trạng thái</em>, in ra <em>giá trị</em>; <code>local</code> giữ biến riêng tư.</li>
<li><strong>Mọi script nghiêm túc mở đầu bằng <code>set -euo pipefail</code>;</strong> chỉ dùng <code>|| true</code> khi bạn chấp nhận thất bại; nhớ <code>set -e</code> bị bỏ qua trong điều kiện.</li>
<li><strong><code>trap … EXIT</code></strong> dọn dẹp khi thành công, lỗi và SIGTERM (không bao giờ SIGKILL); khoá bằng <code>noclobber</code>; chỉ xoá thứ mình tạo; <code>sleep &amp; wait</code> giữ trap phản ứng nhanh.</li>
<li><strong>Sao lưu:</strong> ghi vào tên tạm, <code>mv</code> nguyên tử, xoay vòng bằng tên sắp xếp được và <code>tail -n +N</code>, rồi <em>thử khôi phục</em> — và chép ra khỏi máy.</li>
<li><strong>Kiểm tra sức khoẻ</strong> trả 0/1/2, không bao giờ treo, in một dòng dễ đọc cho mỗi phép kiểm; <code>/dev/tcp</code> thử một cổng mà không cần công cụ thêm.</li>
<li><strong>awk</strong> cho cột, tổng và group-by; <strong>sed</strong> cho thay thế và sửa dòng; <code>-i</code> không có hoàn tác.</li>
<li><strong>Tiếp theo:</strong> Lab 3 chuyển từ script sang chương trình C trên Linux.</li>
</ul>`),
  ].join('\n'),
};

/* ───────── Lab 3 — C programming on Linux: gcc, make, gdb, fork/exec/wait, pipes, system calls, signals, and a mini-shell ───────── */
const L_x_lab_3 = {
  title: 'Lab 3 — C programming on Linux: gcc, make, gdb, fork/exec/wait, pipes, system calls, signals, and a mini-shell|||Lab 3 — Lập trình C trên Linux: gcc, make, gdb, fork/exec/wait, ống, lời gọi hệ thống, tín hiệu, và một mini-shell',
  slug: 'osg202-lab-3',
  type: 'VIDEO',
  description: 'Bài lab 3 của OSG202 (CLO9–10) lập trình C trên Linux theo kiểu dev backend: bảy bài tập có lời giải chạy thật — đọc cảnh báo của gcc và tách biên dịch/liên kết, viết Makefile, dò lỗi bằng gdb ở chế độ batch (bt, print, break có điều kiện), fork/exec/wait và cách đọc trạng thái thoát, ống giữa cha và con cùng quy tắc EOF, sao chép tệp bằng lời gọi hệ thống và quan sát bằng strace, tín hiệu và worker tắt êm — rồi một bài tập lớn tự viết mini-shell hỗ trợ chuyển hướng và một dấu ống. Kèm lỗi hay gặp, bảng chấm điểm, thuật ngữ.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lab 3 · CLO9–10</span>
<h2>Lab 3 — C programming on Linux</h2>
<p class="lead">Almost every tool you use on a Linux server is a C program: the shell, <code>ls</code>, <code>nginx</code>, <code>redis</code>, the Node.js and Java runtimes. In this lab you stop only <em>running</em> them and start <em>building the same machinery yourself</em>: compile and debug a program, start other programs with <code>fork</code> and <code>exec</code>, connect them with pipes, talk to the kernel with system calls, and handle signals. The lab ends with a project: your own small shell.</p>
<h3>🎯 Objectives</h3>
<ul>
<li>Compile with <code>gcc -Wall -Wextra -g</code>, understand compile versus link, and automate with <code>make</code> (CLO10).</li>
<li>Find bugs with <code>gdb</code>: breakpoint, backtrace, print, step (CLO10).</li>
<li>Use <code>fork</code>, <code>exec</code>, <code>wait</code>, <code>pipe</code>, <code>dup2</code> and signals correctly (CLO9–10; theory: Chapter 2 and ⭐ CS.1).</li>
<li>Read and write files with system calls and watch them with <code>strace</code> (CLO10; theory: Chapter 4 and ⭐ CS.2).</li>
<li>Combine everything in a mini-shell with redirection and a pipe.</li>
</ul>
<h3>🐳 How to work</h3>
<p>Programs were compiled with <code>gcc 12.2</code> and run for real in the course container (Debian 12 on <strong>ARM64</strong>, because the course was prepared on an Apple-silicon Mac). On your own x86-64 Linux or WSL the logic and output are the same; only machine addresses (<code>0x0000aaaa…</code>), library paths (<code>/lib/aarch64-linux-gnu</code> versus <code>/lib/x86_64-linux-gnu</code>) and the exact numbers of machine instructions differ. Type the programs yourself — do not paste — and run each one before reading the explanation. Lines marked 🎲 are one real run of something timing-dependent.</p>
<table>
<thead><tr><th>Exercise</th><th>Task</th><th>Tools</th></tr></thead>
<tbody>
<tr><td>1</td><td>read compiler warnings; compile in two steps</td><td>gcc -Wall -Wextra -c, nm, file</td></tr>
<tr><td>2</td><td>rebuild only what changed</td><td>make, Makefile</td></tr>
<tr><td>3</td><td>find a crash and a silent wrong answer</td><td>gdb -batch, bt, break if</td></tr>
<tr><td>4</td><td>run a command and report how it ended</td><td>fork, execvp, waitpid</td></tr>
<tr><td>5</td><td>send data from parent to child; why EOF may never come</td><td>pipe, close, poll</td></tr>
<tr><td>6</td><td>copy a file with system calls; count them</td><td>open, read, write, lseek, strace</td></tr>
<tr><td>7</td><td>a worker that shuts down gracefully</td><td>sigaction, SIGTERM, kill</td></tr>
<tr><td>8</td><td><strong>Big project:</strong> a mini-shell</td><td>all of the above, dup2</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Lab 3 · CLO9–10</span>
<h2>Lab 3 — Lập trình C trên Linux</h2>
<p class="lead">Hầu như mọi công cụ bạn dùng trên server Linux đều là một chương trình C: shell, <code>ls</code>, <code>nginx</code>, <code>redis</code>, runtime Node.js và Java. Trong lab này bạn thôi chỉ <em>chạy</em> chúng mà bắt đầu <em>tự dựng lại chính bộ máy đó</em>: biên dịch và gỡ lỗi một chương trình, khởi động chương trình khác bằng <code>fork</code> và <code>exec</code>, nối chúng bằng ống, nói chuyện với nhân qua lời gọi hệ thống và xử lý tín hiệu. Lab kết thúc bằng một dự án: shell nhỏ của riêng bạn.</p>
<h3>🎯 Mục tiêu</h3>
<ul>
<li>Biên dịch với <code>gcc -Wall -Wextra -g</code>, hiểu biên dịch và liên kết khác nhau thế nào, tự động hoá bằng <code>make</code> (CLO10).</li>
<li>Tìm lỗi bằng <code>gdb</code>: điểm dừng, backtrace, print, chạy từng bước (CLO10).</li>
<li>Dùng đúng <code>fork</code>, <code>exec</code>, <code>wait</code>, <code>pipe</code>, <code>dup2</code> và tín hiệu (CLO9–10; lý thuyết: Chương 2 và ⭐ CS.1).</li>
<li>Đọc và ghi tệp bằng lời gọi hệ thống và quan sát chúng bằng <code>strace</code> (CLO10; lý thuyết: Chương 4 và ⭐ CS.2).</li>
<li>Kết hợp tất cả trong một mini-shell có chuyển hướng và một dấu ống.</li>
</ul>
<h3>🐳 Cách làm</h3>
<p>Các chương trình được biên dịch bằng <code>gcc 12.2</code> và chạy thật trong container của môn (Debian 12 trên <strong>ARM64</strong>, vì môn được chuẩn bị trên máy Mac chip Apple). Trên Linux x86-64 hay WSL của bạn, logic và output giống hệt; chỉ địa chỉ máy (<code>0x0000aaaa…</code>), đường dẫn thư viện (<code>/lib/aarch64-linux-gnu</code> so với <code>/lib/x86_64-linux-gnu</code>) và số lệnh máy chính xác là khác. Hãy tự gõ các chương trình — đừng dán — và chạy từng cái trước khi đọc lời giải thích. Dòng đánh dấu 🎲 là một lần chạy thật của thứ phụ thuộc thời gian.</p>
<table>
<thead><tr><th>Bài</th><th>Việc cần làm</th><th>Công cụ</th></tr></thead>
<tbody>
<tr><td>1</td><td>đọc cảnh báo của trình biên dịch; biên dịch hai bước</td><td>gcc -Wall -Wextra -c, nm, file</td></tr>
<tr><td>2</td><td>chỉ dựng lại phần đã đổi</td><td>make, Makefile</td></tr>
<tr><td>3</td><td>tìm một lần sập và một đáp án sai âm thầm</td><td>gdb -batch, bt, break if</td></tr>
<tr><td>4</td><td>chạy một lệnh và báo nó kết thúc thế nào</td><td>fork, execvp, waitpid</td></tr>
<tr><td>5</td><td>gửi dữ liệu từ cha sang con; vì sao EOF có thể không bao giờ tới</td><td>pipe, close, poll</td></tr>
<tr><td>6</td><td>sao chép tệp bằng lời gọi hệ thống; đếm chúng</td><td>open, read, write, lseek, strace</td></tr>
<tr><td>7</td><td>worker tắt êm</td><td>sigaction, SIGTERM, kill</td></tr>
<tr><td>8</td><td><strong>Bài tập lớn:</strong> một mini-shell</td><td>mọi thứ ở trên, dup2</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — compiler warnings, and compile versus link (20 min)</h3>
<p><strong>Situation.</strong> A teammate's code "compiles" but prints a strange number. Compile <code>warn.c</code> first with no flags, then with <code>-Wall -Wextra -O2</code>, and explain every warning. Then split a program into <code>main.c</code>, <code>mymath.c</code> and <code>mymath.h</code>; compile each into an object file, link them, and provoke (and explain) the classic <code>undefined reference</code> error.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 1: compile, read warnings, split into object files<br>
$ cat &gt; warn.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; int main(void) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;int unused;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;long big = 3000000000L;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;int total;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("big = %d\\n", big);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("total = %d\\n", total);<br>
&gt; }<br>
&gt; END<br>
$ gcc warn.c -o warn<br>
$ gcc -Wall -Wextra -O2 warn.c -o warn<br>
warn.c: In function ‘main’:<br>
warn.c:6:20: warning: format ‘%d’ expects argument of type ‘int’, but argument 2 has type ‘long int’ [-Wformat=]<br>
&nbsp;&nbsp;&nbsp;&nbsp;6 | &nbsp;&nbsp;&nbsp;&nbsp;printf("big = %d\\n", big);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;~^ &nbsp;&nbsp;&nbsp;&nbsp;~~~<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;|<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int &nbsp;&nbsp;long int<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%ld<br>
warn.c:3:9: warning: unused variable ‘unused’ [-Wunused-variable]<br>
&nbsp;&nbsp;&nbsp;&nbsp;3 | &nbsp;&nbsp;&nbsp;&nbsp;int unused;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^~~~~~<br>
warn.c:7:5: warning: ‘total’ is used uninitialized [-Wuninitialized]<br>
&nbsp;&nbsp;&nbsp;&nbsp;7 | &nbsp;&nbsp;&nbsp;&nbsp;printf("total = %d\\n", total);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;^~~~~~~~~~~~~~~~~~~~~~~~~~~~~<br>
warn.c:5:9: note: ‘total’ was declared here<br>
&nbsp;&nbsp;&nbsp;&nbsp;5 | &nbsp;&nbsp;&nbsp;&nbsp;int total;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^~~~~<br>
$ ./warn | head -n 1<br>
big = -1294967296<br>
# Separate compilation: each .c becomes a .o, then the linker joins them<br>
$ cat &gt; mymath.h &lt;&lt;'END'<br>
&gt; int square(int x);<br>
&gt; END<br>
$ cat &gt; mymath.c &lt;&lt;'END'<br>
&gt; #include "mymath.h"<br>
&gt; int square(int x) { return x * x; }<br>
&gt; END<br>
$ cat &gt; main.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include "mymath.h"<br>
&gt; int main(void) { printf("7 squared = %d\\n", square(7)); return 0; }<br>
&gt; END<br>
$ gcc -Wall -c main.c<br>
$ gcc -Wall -c mymath.c<br>
$ ls *.o<br>
main.o<br>
mymath.o<br>
$ gcc main.o -o app<br>
/usr/bin/ld: main.o: in function &#96;main':<br>
main.c:(.text+0xc): undefined reference to &#96;square'<br>
collect2: error: ld returned 1 exit status<br>
$ gcc main.o mymath.o -o app<br>
$ ./app<br>
7 squared = 49<br>
# What did we build?<br>
$ file app | cut -d, -f1-2<br>
app: ELF 64-bit LSB pie executable, ARM aarch64<br>
$ nm mymath.o | grep square<br>
0000000000000000 T square<br>
$ nm main.o | grep -E 'square|printf'<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U printf<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U square</div>
<ul>
<li><strong>Plain <code>gcc</code> said nothing</strong>, yet the program prints <code>big = -1294967296</code> — 3 000 000 000 does not fit in an <code>int</code>, and <code>%d</code> reads only 32 bits of a 64-bit <code>long</code>. Always compile with <strong><code>-Wall -Wextra</code></strong> (and treat warnings as errors in a team: <code>-Werror</code>). <code>-O2</code> matters too: some warnings, like "used uninitialized", need the optimiser's data-flow analysis.</li>
<li>Reading a diagnostic: <code>file:line:column: severity: message [-Wflag]</code>, then the source line with a caret. Fix the <em>first</em> one first; later ones are often consequences. The flag in brackets tells you what to search for.</li>
<li><strong>Three steps hide behind <code>gcc a.c -o a</code>:</strong> (1) compile each <code>.c</code> to an object file <code>.o</code> (machine code with <em>holes</em> for symbols defined elsewhere); (2) the linker <code>ld</code> joins the objects and libraries, filling the holes; (3) the output is an ELF executable (<code>file app</code>: "ELF 64-bit LSB pie executable, ARM aarch64"). <code>-c</code> stops after step 1.</li>
<li><code>nm</code> lists the symbols: in <code>mymath.o</code> <code>square</code> is <code>T</code> (defined, in the text section); in <code>main.o</code> it is <code>U</code> (undefined) — a hole. Linking <code>main.o</code> alone leaves the hole open: <strong><code>undefined reference to 'square'</code> is a <em>linker</em> error</strong> — the declaration in the header satisfied the compiler, but nobody supplied the code. Fix: add the missing <code>.o</code> (or <code>-lm</code> and similar for libraries).</li>
<li>A header holds <em>declarations</em> (promises), a <code>.c</code> file holds <em>definitions</em> (the code). Quotes <code>"mymath.h"</code> search the current folder first, <code>&lt;stdio.h&gt;</code> the system folders.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 1 — cảnh báo của trình biên dịch, biên dịch và liên kết (20 phút)</h3>
<p><strong>Tình huống.</strong> Mã của một đồng đội "biên dịch được" nhưng in ra một con số lạ. Biên dịch <code>warn.c</code> lần đầu không cờ, lần hai với <code>-Wall -Wextra -O2</code>, và giải thích từng cảnh báo. Rồi tách một chương trình thành <code>main.c</code>, <code>mymath.c</code> và <code>mymath.h</code>; biên dịch từng tệp thành tệp đối tượng, liên kết lại, và cố ý gây ra (rồi giải thích) lỗi kinh điển <code>undefined reference</code>.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 1: biên dịch, đọc cảnh báo, tách thành tệp đối tượng<br>
$ cat &gt; warn.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; int main(void) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;int unused;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;long big = 3000000000L;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;int total;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("big = %d\\n", big);<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("total = %d\\n", total);<br>
&gt; }<br>
&gt; END<br>
$ gcc warn.c -o warn<br>
$ gcc -Wall -Wextra -O2 warn.c -o warn<br>
warn.c: In function ‘main’:<br>
warn.c:6:20: warning: format ‘%d’ expects argument of type ‘int’, but argument 2 has type ‘long int’ [-Wformat=]<br>
&nbsp;&nbsp;&nbsp;&nbsp;6 | &nbsp;&nbsp;&nbsp;&nbsp;printf("big = %d\\n", big);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;~^ &nbsp;&nbsp;&nbsp;&nbsp;~~~<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;|<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;int &nbsp;&nbsp;long int<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;%ld<br>
warn.c:3:9: warning: unused variable ‘unused’ [-Wunused-variable]<br>
&nbsp;&nbsp;&nbsp;&nbsp;3 | &nbsp;&nbsp;&nbsp;&nbsp;int unused;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^~~~~~<br>
warn.c:7:5: warning: ‘total’ is used uninitialized [-Wuninitialized]<br>
&nbsp;&nbsp;&nbsp;&nbsp;7 | &nbsp;&nbsp;&nbsp;&nbsp;printf("total = %d\\n", total);<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;^~~~~~~~~~~~~~~~~~~~~~~~~~~~~<br>
warn.c:5:9: note: ‘total’ was declared here<br>
&nbsp;&nbsp;&nbsp;&nbsp;5 | &nbsp;&nbsp;&nbsp;&nbsp;int total;<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;^~~~~<br>
$ ./warn | head -n 1<br>
big = -1294967296<br>
# Biên dịch tách rời: mỗi .c thành một .o, rồi trình liên kết ghép lại<br>
$ cat &gt; mymath.h &lt;&lt;'END'<br>
&gt; int square(int x);<br>
&gt; END<br>
$ cat &gt; mymath.c &lt;&lt;'END'<br>
&gt; #include "mymath.h"<br>
&gt; int square(int x) { return x * x; }<br>
&gt; END<br>
$ cat &gt; main.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include "mymath.h"<br>
&gt; int main(void) { printf("7 squared = %d\\n", square(7)); return 0; }<br>
&gt; END<br>
$ gcc -Wall -c main.c<br>
$ gcc -Wall -c mymath.c<br>
$ ls *.o<br>
main.o<br>
mymath.o<br>
$ gcc main.o -o app<br>
/usr/bin/ld: main.o: in function &#96;main':<br>
main.c:(.text+0xc): undefined reference to &#96;square'<br>
collect2: error: ld returned 1 exit status<br>
$ gcc main.o mymath.o -o app<br>
$ ./app<br>
7 squared = 49<br>
# Ta vừa dựng ra cái gì?<br>
$ file app | cut -d, -f1-2<br>
app: ELF 64-bit LSB pie executable, ARM aarch64<br>
$ nm mymath.o | grep square<br>
0000000000000000 T square<br>
$ nm main.o | grep -E 'square|printf'<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U printf<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;U square</div>
<ul>
<li><strong><code>gcc</code> trơn không nói gì</strong>, vậy mà chương trình in <code>big = -1294967296</code> — 3 000 000 000 không vừa trong <code>int</code>, và <code>%d</code> chỉ đọc 32 bit của một <code>long</code> 64 bit. Luôn biên dịch với <strong><code>-Wall -Wextra</code></strong> (và trong nhóm, coi cảnh báo là lỗi: <code>-Werror</code>). <code>-O2</code> cũng quan trọng: một số cảnh báo, như "used uninitialized", cần phân tích luồng dữ liệu của bộ tối ưu.</li>
<li>Đọc một chẩn đoán: <code>tệp:dòng:cột: mức: thông điệp [-Wcờ]</code>, rồi dòng mã nguồn với dấu mũ. Sửa lỗi <em>đầu tiên</em> trước; các lỗi sau thường là hệ quả. Cờ trong ngoặc cho biết nên tìm kiếm gì.</li>
<li><strong>Ba bước ẩn sau <code>gcc a.c -o a</code>:</strong> (1) biên dịch mỗi <code>.c</code> thành tệp đối tượng <code>.o</code> (mã máy có các <em>lỗ</em> cho ký hiệu định nghĩa ở nơi khác); (2) trình liên kết <code>ld</code> ghép các tệp đối tượng và thư viện, lấp các lỗ; (3) kết quả là tệp thực thi ELF (<code>file app</code>: "ELF 64-bit LSB pie executable, ARM aarch64"). <code>-c</code> dừng sau bước 1.</li>
<li><code>nm</code> liệt kê ký hiệu: trong <code>mymath.o</code>, <code>square</code> là <code>T</code> (đã định nghĩa, nằm ở vùng mã); trong <code>main.o</code> nó là <code>U</code> (chưa định nghĩa) — một cái lỗ. Liên kết riêng <code>main.o</code> để hở cái lỗ: <strong><code>undefined reference to 'square'</code> là lỗi của <em>trình liên kết</em></strong> — khai báo trong header làm hài lòng trình biên dịch, nhưng không ai cung cấp mã. Cách sửa: thêm <code>.o</code> còn thiếu (hoặc <code>-lm</code> và tương tự cho thư viện).</li>
<li>Header chứa <em>khai báo</em> (lời hứa), tệp <code>.c</code> chứa <em>định nghĩa</em> (mã thật). Dấu nháy kép <code>"mymath.h"</code> tìm thư mục hiện tại trước, <code>&lt;stdio.h&gt;</code> tìm thư mục hệ thống.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 2 — a Makefile (15 min)</h3>
<p><strong>Situation.</strong> Typing three <code>gcc</code> commands after every edit is tedious and error-prone. Write a <code>Makefile</code> so that <code>make</code> builds <code>app</code>, rebuilds <em>only</em> what is out of date, and <code>make clean</code> / <code>make run</code> work. Predict what <code>make</code> does after <code>touch mymath.c</code>, after <code>touch mymath.h</code>, and when nothing changed. Then reproduce the most famous Makefile error.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 2: a Makefile — rebuild only what changed<br>
$ cat &gt; Makefile &lt;&lt;'END'<br>
&gt; CC &nbsp;&nbsp;&nbsp;&nbsp;= gcc<br>
&gt; CFLAGS = -Wall -Wextra -g<br>
&gt;<br>
&gt; app: main.o mymath.o<br>
&gt; 	$(CC) $(CFLAGS) main.o mymath.o -o app<br>
&gt;<br>
&gt; main.o: main.c mymath.h<br>
&gt; 	$(CC) $(CFLAGS) -c main.c<br>
&gt;<br>
&gt; mymath.o: mymath.c mymath.h<br>
&gt; 	$(CC) $(CFLAGS) -c mymath.c<br>
&gt;<br>
&gt; .PHONY: clean run<br>
&gt; clean:<br>
&gt; 	rm -f *.o app<br>
&gt;<br>
&gt; run: app<br>
&gt; 	./app<br>
&gt; END<br>
$ make<br>
gcc -Wall -Wextra -g -c main.c<br>
gcc -Wall -Wextra -g -c mymath.c<br>
gcc -Wall -Wextra -g main.o mymath.o -o app<br>
$ make<br>
make: 'app' is up to date.<br>
$ touch mymath.c<br>
$ make<br>
gcc -Wall -Wextra -g -c mymath.c<br>
gcc -Wall -Wextra -g main.o mymath.o -o app<br>
$ touch mymath.h<br>
$ make<br>
gcc -Wall -Wextra -g -c main.c<br>
gcc -Wall -Wextra -g -c mymath.c<br>
gcc -Wall -Wextra -g main.o mymath.o -o app<br>
$ make run<br>
./app<br>
7 squared = 49<br>
$ make -n clean<br>
rm -f *.o app<br>
$ make clean<br>
rm -f *.o app<br>
$ ls<br>
Makefile<br>
main.c<br>
mymath.c<br>
mymath.h<br>
# The classic mistake: spaces instead of a TAB before a command<br>
$ printf 'all:\\n &nbsp;&nbsp;&nbsp;echo hello\\n' &gt; Bad.mk<br>
$ make -f Bad.mk<br>
Bad.mk:2: *** missing separator. &nbsp;Stop.</div>
<ul>
<li>A rule is <code>target: prerequisites</code> followed by command lines that start with a <strong>TAB</strong>. <code>make</code> compares file modification times: if any prerequisite is newer than the target (or the target is missing), it runs the commands. That is the whole idea.</li>
<li>First <code>make</code>: everything is built, in dependency order (the objects first, then <code>app</code>). Second <code>make</code>: <code>'app' is up to date</code> — nothing runs. After <code>touch mymath.c</code> only <code>mymath.o</code> and the link step ran, <code>main.o</code> was reused. After <code>touch mymath.h</code> <em>both</em> objects were rebuilt, because both list the header as a prerequisite. <strong>Forgetting the header in a rule is a classic bug</strong>: the program keeps old code and behaves in impossible ways until <code>make clean</code>. (<code>gcc -MMD</code> can generate such dependencies automatically.)</li>
<li><code>CC</code> and <code>CFLAGS</code> are variables (<code>$(CC)</code>); <code>.PHONY</code> says <code>clean</code> and <code>run</code> are actions, not files, so a file named <code>clean</code> cannot block them. <code>make -n</code> prints the commands without running them — a safe preview of <code>clean</code>.</li>
<li><strong>The classic error:</strong> <code>Bad.mk:2: *** missing separator.  Stop.</code> The command line began with 4 spaces, not a TAB. Editors that convert tabs to spaces cause it; configure your editor to keep tabs in Makefiles.</li>
<li>Real projects scale this up with <code>$@</code>/<code>$&lt;</code> automatic variables and pattern rules (<code>%.o: %.c</code>), then with CMake. The principle — a graph of files and timestamps — is the same in Gradle, Maven and <code>npm run build</code> caches.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 2 — một Makefile (15 phút)</h3>
<p><strong>Tình huống.</strong> Gõ ba lệnh <code>gcc</code> sau mỗi lần sửa vừa mệt vừa dễ sai. Viết một <code>Makefile</code> để <code>make</code> dựng <code>app</code>, chỉ dựng lại phần <em>cũ hơn</em> mã nguồn, và <code>make clean</code> / <code>make run</code> hoạt động. Dự đoán <code>make</code> làm gì sau <code>touch mymath.c</code>, sau <code>touch mymath.h</code>, và khi không có gì đổi. Rồi tái hiện lỗi Makefile nổi tiếng nhất.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 2: Makefile — chỉ dựng lại phần đã đổi<br>
$ cat &gt; Makefile &lt;&lt;'END'<br>
&gt; CC &nbsp;&nbsp;&nbsp;&nbsp;= gcc<br>
&gt; CFLAGS = -Wall -Wextra -g<br>
&gt;<br>
&gt; app: main.o mymath.o<br>
&gt; 	$(CC) $(CFLAGS) main.o mymath.o -o app<br>
&gt;<br>
&gt; main.o: main.c mymath.h<br>
&gt; 	$(CC) $(CFLAGS) -c main.c<br>
&gt;<br>
&gt; mymath.o: mymath.c mymath.h<br>
&gt; 	$(CC) $(CFLAGS) -c mymath.c<br>
&gt;<br>
&gt; .PHONY: clean run<br>
&gt; clean:<br>
&gt; 	rm -f *.o app<br>
&gt;<br>
&gt; run: app<br>
&gt; 	./app<br>
&gt; END<br>
$ make<br>
gcc -Wall -Wextra -g -c main.c<br>
gcc -Wall -Wextra -g -c mymath.c<br>
gcc -Wall -Wextra -g main.o mymath.o -o app<br>
$ make<br>
make: 'app' is up to date.<br>
$ touch mymath.c<br>
$ make<br>
gcc -Wall -Wextra -g -c mymath.c<br>
gcc -Wall -Wextra -g main.o mymath.o -o app<br>
$ touch mymath.h<br>
$ make<br>
gcc -Wall -Wextra -g -c main.c<br>
gcc -Wall -Wextra -g -c mymath.c<br>
gcc -Wall -Wextra -g main.o mymath.o -o app<br>
$ make run<br>
./app<br>
7 squared = 49<br>
$ make -n clean<br>
rm -f *.o app<br>
$ make clean<br>
rm -f *.o app<br>
$ ls<br>
Makefile<br>
main.c<br>
mymath.c<br>
mymath.h<br>
# Lỗi kinh điển: dấu cách thay cho TAB trước lệnh<br>
$ printf 'all:\\n &nbsp;&nbsp;&nbsp;echo hello\\n' &gt; Bad.mk<br>
$ make -f Bad.mk<br>
Bad.mk:2: *** missing separator. &nbsp;Stop.</div>
<ul>
<li>Một luật có dạng <code>đích: điều_kiện_tiên_quyết</code> theo sau là các dòng lệnh bắt đầu bằng một <strong>TAB</strong>. <code>make</code> so thời điểm sửa tệp: nếu điều kiện tiên quyết nào mới hơn đích (hoặc đích chưa có), nó chạy các lệnh. Toàn bộ ý tưởng chỉ có vậy.</li>
<li><code>make</code> lần đầu: dựng tất cả theo thứ tự phụ thuộc (các tệp đối tượng trước, rồi <code>app</code>). Lần hai: <code>'app' is up to date</code> — không chạy gì. Sau <code>touch mymath.c</code> chỉ <code>mymath.o</code> và bước liên kết chạy, <code>main.o</code> được dùng lại. Sau <code>touch mymath.h</code> <em>cả hai</em> tệp đối tượng được dựng lại, vì cả hai đều liệt kê header là điều kiện tiên quyết. <strong>Quên header trong luật là lỗi kinh điển</strong>: chương trình giữ mã cũ và hành xử khó tin cho tới khi <code>make clean</code>. (<code>gcc -MMD</code> sinh các phụ thuộc này tự động.)</li>
<li><code>CC</code> và <code>CFLAGS</code> là biến (<code>$(CC)</code>); <code>.PHONY</code> nói <code>clean</code> và <code>run</code> là hành động chứ không phải tệp, nên một tệp tên <code>clean</code> không chặn được chúng. <code>make -n</code> in lệnh mà không chạy — xem trước <code>clean</code> an toàn.</li>
<li><strong>Lỗi kinh điển:</strong> <code>Bad.mk:2: *** missing separator.  Stop.</code> Dòng lệnh bắt đầu bằng 4 dấu cách, không phải TAB. Trình soạn thảo tự đổi tab thành dấu cách gây ra lỗi này; hãy cấu hình để giữ tab trong Makefile.</li>
<li>Dự án thật mở rộng ý này bằng biến tự động <code>$@</code>/<code>$&lt;</code> và luật mẫu (<code>%.o: %.c</code>), rồi CMake. Nguyên lý — một đồ thị các tệp và dấu thời gian — giống hệt Gradle, Maven và bộ nhớ đệm của <code>npm run build</code>.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 3 — debug with gdb: a crash and a silent wrong answer (25 min)</h3>
<p><strong>Situation.</strong> <code>bug.c</code> sums the ages of a team and then prints the length of a user's name. It prints nothing useful and then crashes. (a) Run it and read the exit code. (b) Without editing the source, use <code>gdb</code> in batch mode to find <em>where</em> it dies and who called it, and print the argument. (c) Stop at <code>total_age</code>, print the first element, step with <code>next</code>, print the loop variable, and <code>finish</code> to see the return value. (d) Use a <strong>conditional breakpoint</strong> to stop exactly when the loop reaches the bad index. There are two bugs; find both.</p>
<details><summary>Solution — run for real (gdb needs <code>--security-opt seccomp=unconfined</code> in Docker; on a normal Linux nothing special)</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--security-opt=seccomp=unconfined</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 3: find a crash with gdb in batch mode<br>
$ cat &gt; bug.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;string.h&gt;<br>
&gt;<br>
&gt; struct user { char name[16]; int age; };<br>
&gt;<br>
&gt; int total_age(struct user *u, int n) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;int sum = 0;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;for (int i = 0; i &lt;= n; i++) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/* bug: should be i &lt; n */<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum += u[i].age;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return sum;<br>
&gt; }<br>
&gt;<br>
&gt; int name_len(struct user *u) { return (int)strlen(u-&gt;name); }<br>
&gt;<br>
&gt; int main(void) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;struct user team[2] = { {"an", 20}, {"binh", 22} };<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("total = %d\\n", total_age(team, 2));<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;struct user *missing = NULL;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("len = %d\\n", name_len(missing));<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; END<br>
$ gcc -g -O0 -Wall bug.c -o bug<br>
$ ./bug<br>
bash: &nbsp;&nbsp;&nbsp;21 Segmentation fault &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./bug<br>
$ echo "exit code: $?"<br>
exit code: 139<br>
# Where did it die? run, then bt (backtrace)<br>
$ gdb -q -batch -ex run -ex bt ./bug 2&gt;&amp;1 | grep -v '^\\[' | tail -n 8<br>
Using host libthread_db library "/lib/aarch64-linux-gnu/libthread_db.so.1".<br>
<br>
Program received signal SIGSEGV, Segmentation fault.<br>
0x0000fffff7e9e6d0 in ?? () from /lib/aarch64-linux-gnu/libc.so.6<br>
#0 &nbsp;0x0000fffff7e9e6d0 in ?? () from /lib/aarch64-linux-gnu/libc.so.6<br>
#1 &nbsp;0x0000aaaaaaaa0858 in name_len (u=0x0) at bug.c:13<br>
#2 &nbsp;0x0000aaaaaaaa08ac in main () at bug.c:19<br>
# Look at variables in the crashed frame<br>
$ gdb -q -batch -ex run -ex 'frame 1' -ex 'print u' -ex 'info locals' ./bug 2&gt;&amp;1 | tail -n 5<br>
0x0000fffff7e9e6d0 in ?? () from /lib/aarch64-linux-gnu/libc.so.6<br>
#1 &nbsp;0x0000aaaaaaaa0858 in name_len (u=0x0) at bug.c:13<br>
13	int name_len(struct user *u) { return (int)strlen(u-&gt;name); }<br>
$1 = (struct user *) 0x0<br>
No locals.<br>
# Stop BEFORE the bug: break, run, print, next, finish<br>
$ gdb -q -batch -ex 'break total_age' -ex run -ex 'print *u' -ex 'print u[1].age' -ex 'next' -ex 'next' -ex 'next' -ex 'print i' -ex 'print sum' -ex 'finish' ./bug 2&gt;&amp;1 | grep -v '^\\[' | tail -n 14<br>
Using host libthread_db library "/lib/aarch64-linux-gnu/libthread_db.so.1".<br>
<br>
Breakpoint 1, total_age (u=0xfffffffffb20, n=2) at bug.c:7<br>
7	 &nbsp;&nbsp;&nbsp;int sum = 0;<br>
$1 = {name = "an", '\\000' &lt;repeats 13 times&gt;, age = 20}<br>
$2 = 22<br>
8	 &nbsp;&nbsp;&nbsp;for (int i = 0; i &lt;= n; i++) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/* bug: should be i &lt; n */<br>
9	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum += u[i].age;<br>
8	 &nbsp;&nbsp;&nbsp;for (int i = 0; i &lt;= n; i++) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/* bug: should be i &lt; n */<br>
$3 = 0<br>
$4 = 20<br>
0x0000aaaaaaaa0890 in main () at bug.c:17<br>
17	 &nbsp;&nbsp;&nbsp;printf("total = %d\\n", total_age(team, 2));<br>
Value returned is $5 = -1431697270<br>
# The bug: i &lt;= n reads u[2], past the end of the array<br>
$ gdb -q -batch -ex 'break 9 if i == 2' -ex run -ex 'print i' -ex 'print n' -ex 'print u[i]' ./bug 2&gt;&amp;1 | grep -v '^\\[' | tail -n 5<br>
Breakpoint 1, total_age (u=0xfffffffffb20, n=2) at bug.c:9<br>
9	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum += u[i].age;<br>
$1 = 2<br>
$2 = 2<br>
$3 = {name = " ", '\\000' &lt;repeats 11 times&gt;, "0\\0000", age = -1431697312}</div>
<ul>
<li>(a) <code>Segmentation fault</code> and exit code <strong>139 = 128 + 11 (SIGSEGV)</strong>. Notice that the line <code>total = …</code> is <em>missing</em>: stdout was a pipe, so <code>printf</code> kept its text in a buffer, and the crash threw the buffer away. Debugging with <code>printf</code> can lie when the program dies — print to <code>stderr</code> or flush.</li>
<li>(b) <code>bt</code> (backtrace) lists the stack, innermost first: <strong>#1 <code>name_len (u=0x0) at bug.c:13</code></strong>, called from <strong>#2 <code>main () at bug.c:19</code></strong>. Frame #0 is inside libc (<code>strlen</code>, no debug info, shown as <code>??</code>) — the crash happened there, but the <em>cause</em> is in our frame: the argument <code>u</code> is <code>0x0</code>, a NULL pointer. <code>frame 1</code> selects our frame; <code>print u</code> gives <code>(struct user *) 0x0</code>. You compiled with <code>-g</code>; without it you would see no file names or line numbers.</li>
<li>(c) <code>break total_age</code> + <code>run</code> stops at the function; <code>print *u</code> shows the first struct; <code>print u[1].age</code> evaluates an expression; <code>next</code> executes one line (stepping <em>over</em> calls; <code>step</code> would step into them); <code>finish</code> runs until the function returns and prints <code>Value returned is $5 = -1431697270</code>: <strong>garbage, not 42</strong>.</li>
<li>(d) <code>break 9 if i == 2</code> stops only when <code>i</code> is 2; there <code>n</code> is also 2 and <code>u[i]</code> shows a nonsense name and age. The loop condition <code>i &lt;= n</code> reads <code>u[2]</code>, one element past the end of a 2-element array (an <em>off-by-one</em>). It does not crash — C does not check array bounds — it silently adds garbage. <strong>Bug 1: wrong answer, no crash (fix: <code>i &lt; n</code>). Bug 2: NULL pointer passed to <code>strlen</code> (fix: check before calling).</strong> Tools that find the first kind without a debugger: <code>gcc -fsanitize=address,undefined</code> or <code>valgrind</code>.</li>
<li>Useful commands to remember: <code>run</code>, <code>bt</code>, <code>frame N</code>, <code>print expr</code>, <code>info locals</code>, <code>break fn|file:line [if cond]</code>, <code>next</code>, <code>step</code>, <code>finish</code>, <code>continue</code>, <code>watch var</code>, <code>quit</code>. In an interactive session just type <code>gdb ./bug</code> and use the same commands, or <code>gdb -tui</code> for a source window. (The addresses above are those of one ARM64 run; with ASLR on, <code>gdb</code> turns it off, so they are stable in the debugger but change when you run the program normally.)</li>
</ul>
</details>`,
    `<h3>🧪 Bài 3 — gỡ lỗi bằng gdb: một lần sập và một đáp án sai âm thầm (25 phút)</h3>
<p><strong>Tình huống.</strong> <code>bug.c</code> cộng tuổi của một nhóm rồi in độ dài tên một người dùng. Nó không in được gì hữu ích rồi sập. (a) Chạy và đọc mã thoát. (b) Không sửa mã nguồn, dùng <code>gdb</code> ở chế độ batch để tìm <em>nơi</em> nó chết và ai gọi, và in đối số. (c) Dừng ở <code>total_age</code>, in phần tử đầu, chạy từng bước bằng <code>next</code>, in biến vòng lặp, và <code>finish</code> để xem giá trị trả về. (d) Dùng <strong>điểm dừng có điều kiện</strong> để dừng đúng lúc vòng lặp chạm chỉ số sai. Có hai lỗi; hãy tìm cả hai.</p>
<details><summary>Lời giải — chạy thật (gdb trong Docker cần <code>--security-opt seccomp=unconfined</code>; trên Linux thường không cần gì)</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--security-opt=seccomp=unconfined</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 3: tìm chỗ chương trình sập bằng gdb ở chế độ batch<br>
$ cat &gt; bug.c &lt;&lt;'END'<br>
&gt; #include &lt;stdio.h&gt;<br>
&gt; #include &lt;string.h&gt;<br>
&gt;<br>
&gt; struct user { char name[16]; int age; };<br>
&gt;<br>
&gt; int total_age(struct user *u, int n) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;int sum = 0;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;for (int i = 0; i &lt;= n; i++) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/* bug: should be i &lt; n */<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum += u[i].age;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return sum;<br>
&gt; }<br>
&gt;<br>
&gt; int name_len(struct user *u) { return (int)strlen(u-&gt;name); }<br>
&gt;<br>
&gt; int main(void) {<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;struct user team[2] = { {"an", 20}, {"binh", 22} };<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("total = %d\\n", total_age(team, 2));<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;struct user *missing = NULL;<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;printf("len = %d\\n", name_len(missing));<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;return 0;<br>
&gt; }<br>
&gt; END<br>
$ gcc -g -O0 -Wall bug.c -o bug<br>
$ ./bug<br>
bash: &nbsp;&nbsp;&nbsp;21 Segmentation fault &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;./bug<br>
$ echo "exit code: $?"<br>
exit code: 139<br>
# Sập ở đâu? run, rồi bt (backtrace)<br>
$ gdb -q -batch -ex run -ex bt ./bug 2&gt;&amp;1 | grep -v '^\\[' | tail -n 8<br>
Using host libthread_db library "/lib/aarch64-linux-gnu/libthread_db.so.1".<br>
<br>
Program received signal SIGSEGV, Segmentation fault.<br>
0x0000fffff7e9e6d0 in ?? () from /lib/aarch64-linux-gnu/libc.so.6<br>
#0 &nbsp;0x0000fffff7e9e6d0 in ?? () from /lib/aarch64-linux-gnu/libc.so.6<br>
#1 &nbsp;0x0000aaaaaaaa0858 in name_len (u=0x0) at bug.c:13<br>
#2 &nbsp;0x0000aaaaaaaa08ac in main () at bug.c:19<br>
# Xem biến trong khung bị sập<br>
$ gdb -q -batch -ex run -ex 'frame 1' -ex 'print u' -ex 'info locals' ./bug 2&gt;&amp;1 | tail -n 5<br>
0x0000fffff7e9e6d0 in ?? () from /lib/aarch64-linux-gnu/libc.so.6<br>
#1 &nbsp;0x0000aaaaaaaa0858 in name_len (u=0x0) at bug.c:13<br>
13	int name_len(struct user *u) { return (int)strlen(u-&gt;name); }<br>
$1 = (struct user *) 0x0<br>
No locals.<br>
# Dừng TRƯỚC lỗi: break, run, print, next, finish<br>
$ gdb -q -batch -ex 'break total_age' -ex run -ex 'print *u' -ex 'print u[1].age' -ex 'next' -ex 'next' -ex 'next' -ex 'print i' -ex 'print sum' -ex 'finish' ./bug 2&gt;&amp;1 | grep -v '^\\[' | tail -n 14<br>
Using host libthread_db library "/lib/aarch64-linux-gnu/libthread_db.so.1".<br>
<br>
Breakpoint 1, total_age (u=0xfffffffffb20, n=2) at bug.c:7<br>
7	 &nbsp;&nbsp;&nbsp;int sum = 0;<br>
$1 = {name = "an", '\\000' &lt;repeats 13 times&gt;, age = 20}<br>
$2 = 22<br>
8	 &nbsp;&nbsp;&nbsp;for (int i = 0; i &lt;= n; i++) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/* bug: should be i &lt; n */<br>
9	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum += u[i].age;<br>
8	 &nbsp;&nbsp;&nbsp;for (int i = 0; i &lt;= n; i++) &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/* bug: should be i &lt; n */<br>
$3 = 0<br>
$4 = 20<br>
0x0000aaaaaaaa0890 in main () at bug.c:17<br>
17	 &nbsp;&nbsp;&nbsp;printf("total = %d\\n", total_age(team, 2));<br>
Value returned is $5 = -1431697270<br>
# Lỗi: i &lt;= n đọc u[2], vượt quá cuối mảng<br>
$ gdb -q -batch -ex 'break 9 if i == 2' -ex run -ex 'print i' -ex 'print n' -ex 'print u[i]' ./bug 2&gt;&amp;1 | grep -v '^\\[' | tail -n 5<br>
Breakpoint 1, total_age (u=0xfffffffffb20, n=2) at bug.c:9<br>
9	 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sum += u[i].age;<br>
$1 = 2<br>
$2 = 2<br>
$3 = {name = " ", '\\000' &lt;repeats 11 times&gt;, "0\\0000", age = -1431697312}</div>
<ul>
<li>(a) <code>Segmentation fault</code> và mã thoát <strong>139 = 128 + 11 (SIGSEGV)</strong>. Để ý dòng <code>total = …</code> <em>không có</em>: stdout là một pipe nên <code>printf</code> giữ chữ trong bộ đệm, và lần sập vứt bộ đệm đi. Gỡ lỗi bằng <code>printf</code> có thể nói dối khi chương trình chết — in ra <code>stderr</code> hoặc xả bộ đệm.</li>
<li>(b) <code>bt</code> (backtrace) liệt kê ngăn xếp, trong cùng trước: <strong>#1 <code>name_len (u=0x0) at bug.c:13</code></strong>, được gọi từ <strong>#2 <code>main () at bug.c:19</code></strong>. Khung #0 nằm trong libc (<code>strlen</code>, không có thông tin gỡ lỗi, hiện là <code>??</code>) — lần sập xảy ra ở đó, nhưng <em>nguyên nhân</em> nằm ở khung của ta: đối số <code>u</code> là <code>0x0</code>, con trỏ NULL. <code>frame 1</code> chọn khung của ta; <code>print u</code> cho <code>(struct user *) 0x0</code>. Bạn đã biên dịch với <code>-g</code>; không có nó sẽ không thấy tên tệp hay số dòng.</li>
<li>(c) <code>break total_age</code> + <code>run</code> dừng ở hàm; <code>print *u</code> hiện struct đầu tiên; <code>print u[1].age</code> tính một biểu thức; <code>next</code> chạy một dòng (<em>bước qua</em> lời gọi hàm; <code>step</code> sẽ bước vào); <code>finish</code> chạy tới khi hàm trả về và in <code>Value returned is $5 = -1431697270</code>: <strong>rác, không phải 42</strong>.</li>
<li>(d) <code>break 9 if i == 2</code> chỉ dừng khi <code>i</code> bằng 2; lúc đó <code>n</code> cũng bằng 2 và <code>u[i]</code> hiện một cái tên và tuổi vô nghĩa. Điều kiện <code>i &lt;= n</code> đọc <code>u[2]</code>, một phần tử sau cuối mảng 2 phần tử (<em>lệch một</em>, off-by-one). Nó không sập — C không kiểm tra biên mảng — mà âm thầm cộng rác. <strong>Lỗi 1: đáp án sai, không sập (sửa: <code>i &lt; n</code>). Lỗi 2: truyền con trỏ NULL cho <code>strlen</code> (sửa: kiểm tra trước khi gọi).</strong> Công cụ tìm lỗi loại 1 không cần debugger: <code>gcc -fsanitize=address,undefined</code> hoặc <code>valgrind</code>.</li>
<li>Các lệnh nên nhớ: <code>run</code>, <code>bt</code>, <code>frame N</code>, <code>print biểu_thức</code>, <code>info locals</code>, <code>break hàm|tệp:dòng [if điều_kiện]</code>, <code>next</code>, <code>step</code>, <code>finish</code>, <code>continue</code>, <code>watch biến</code>, <code>quit</code>. Trong phiên tương tác chỉ cần gõ <code>gdb ./bug</code> rồi dùng các lệnh này, hoặc <code>gdb -tui</code> để có cửa sổ mã nguồn. (Các địa chỉ ở trên là của một lần chạy ARM64; khi ASLR bật, <code>gdb</code> tắt nó nên địa chỉ ổn định trong debugger nhưng đổi khi bạn chạy chương trình bình thường.)</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 4 — run a command and say how it ended (25 min)</h3>
<p><strong>Situation.</strong> Write a C function <code>run(argv)</code> that starts a program, waits for it, and prints either <code>exited with code N</code> or <code>killed by signal N (name)</code>. Test it with four commands: one that succeeds, one that fails (<code>false</code>), one that kills itself with <code>SIGKILL</code>, and one that does not exist. Explain why the child ends with <code>_exit(127)</code> after <code>execvp</code>, and why <code>fflush(stdout)</code> comes before <code>fork</code>.</p>
<details><summary>Solution — run for real</summary>
<pre><code class="language-c">// Exercise 4: a tiny "run this command and tell me how it ended"
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static void run(char *const argv[]) {
    printf("run:");
    for (int i = 0; argv[i]; i++) printf(" %s", argv[i]);
    printf("\\n");
    fflush(stdout);                       // without this the child inherits a copy of the buffer
    pid_t pid = fork();
    if (pid &lt; 0) { perror("fork"); exit(1); }
    if (pid == 0) {
        execvp(argv[0], argv);
        perror(argv[0]);                  // reached only if exec FAILED
        _exit(127);
    }
    int status;
    if (waitpid(pid, &amp;status, 0) &lt; 0) { perror("waitpid"); exit(1); }
    if (WIFEXITED(status))
        printf("  -&gt; exited with code %d\\n", WEXITSTATUS(status));
    else if (WIFSIGNALED(status))
        printf("  -&gt; killed by signal %d (%s)\\n", WTERMSIG(status), strsignal(WTERMSIG(status)));
}

int main(void) {
    char *a[] = { "echo", "hello from the child", NULL };
    char *b[] = { "false", NULL };
    char *c[] = { "sh", "-c", "kill -9 $$", NULL };
    char *d[] = { "no-such-program", NULL };
    run(a); run(b); run(c); run(d);
    return 0;
}</code></pre>
<pre><code class="language-c">// Exercise 4: a tiny "run this command and tell me how it ended"
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static void run(char *const argv[]) {
    printf("run:");
    for (int i = 0; argv[i]; i++) printf(" %s", argv[i]);
    printf("\\n");
    fflush(stdout);                       // without this the child inherits a copy of the buffer
    pid_t pid = fork();
    if (pid &lt; 0) { perror("fork"); exit(1); }
    if (pid == 0) {
        execvp(argv[0], argv);
        perror(argv[0]);                  // reached only if exec FAILED
        _exit(127);
    }
    int status;
    if (waitpid(pid, &amp;status, 0) &lt; 0) { perror("waitpid"); exit(1); }
    if (WIFEXITED(status))
        printf("  -&gt; exited with code %d\\n", WEXITSTATUS(status));
    else if (WIFSIGNALED(status))
        printf("  -&gt; killed by signal %d (%s)\\n", WTERMSIG(status), strsignal(WTERMSIG(status)));
}

int main(void) {
    char *a[] = { "echo", "hello from the child", NULL };
    char *b[] = { "false", NULL };
    char *c[] = { "sh", "-c", "kill -9 $$", NULL };
    char *d[] = { "no-such-program", NULL };
    run(a); run(b); run(c); run(d);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bai4-fork-exec-wait.c -o bai4-fork-exec-wait &amp;&amp; ./bai4-fork-exec-wait<br>
run: echo hello from the child<br>
hello from the child<br>
&nbsp;&nbsp;-&gt; exited with code 0<br>
run: false<br>
&nbsp;&nbsp;-&gt; exited with code 1<br>
run: sh -c kill -9 $$<br>
&nbsp;&nbsp;-&gt; killed by signal 9 (Killed)<br>
run: no-such-program<br>
no-such-program: No such file or directory<br>
&nbsp;&nbsp;-&gt; exited with code 127</div>
<ul>
<li><code>fork()</code> returns <strong>twice</strong>: <code>0</code> in the child, the child's PID in the parent, <code>-1</code> on failure. The child is a copy of the parent (same code, copied memory and fd table) — the <code>if (pid == 0)</code> decides who runs which branch (⭐ CS.1).</li>
<li><code>execvp(file, argv)</code> <em>replaces</em> the child's program with a new one and never returns on success. The <code>v</code> means argument vector, the <code>p</code> means "search <code>$PATH</code>". <code>argv</code> must end with <code>NULL</code> and <code>argv[0]</code> is the program's name. Code after <code>execvp</code> runs only if it <strong>failed</strong> (here: <code>no-such-program: No such file or directory</code>); the child must then <code>_exit(127)</code> — not return into the parent's loop (that would create a second copy of the whole program) and not <code>exit()</code> (which would flush the parent's copied buffers a second time). 127 is the shell convention for "command not found".</li>
<li><code>waitpid(pid, &amp;status, 0)</code> blocks until the child ends and collects its status (without it the child stays as a <strong>zombie</strong>). The status is a packed integer: ask it with macros — <code>WIFEXITED</code>/<code>WEXITSTATUS</code> for a normal exit with a code, <code>WIFSIGNALED</code>/<code>WTERMSIG</code> for death by signal. Results above: <code>0</code>, <code>1</code>, <code>killed by signal 9 (Killed)</code>, <code>127</code>.</li>
<li><strong>Why <code>fflush(stdout)</code> before <code>fork</code>:</strong> the output here goes to a pipe, so <code>printf</code> text waits in a buffer inside the process. <code>fork</code> copies that buffer, and every copy would print it again. Flushing first guarantees the text appears once, in the right order relative to the child's output.</li>
<li>This 20-line function is the heart of every shell, <code>make</code>, CI runner, and Node's <code>child_process.spawn</code>. You will reuse it in the Big Project.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 4 — chạy một lệnh và nói nó kết thúc thế nào (25 phút)</h3>
<p><strong>Tình huống.</strong> Viết hàm C <code>run(argv)</code> khởi động một chương trình, chờ nó, và in <code>exited with code N</code> hoặc <code>killed by signal N (tên)</code>. Thử với bốn lệnh: một lệnh thành công, một lệnh thất bại (<code>false</code>), một lệnh tự giết mình bằng <code>SIGKILL</code>, và một lệnh không tồn tại. Giải thích vì sao tiến trình con kết thúc bằng <code>_exit(127)</code> sau <code>execvp</code>, và vì sao <code>fflush(stdout)</code> đứng trước <code>fork</code>.</p>
<details><summary>Lời giải — chạy thật</summary>
<pre><code class="language-c">// Bài 4: chương trình "chạy lệnh này và cho biết nó kết thúc thế nào"
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static void run(char *const argv[]) {
    printf("run:");
    for (int i = 0; argv[i]; i++) printf(" %s", argv[i]);
    printf("\\n");
    fflush(stdout);                       // without this the child inherits a copy of the buffer
    pid_t pid = fork();
    if (pid &lt; 0) { perror("fork"); exit(1); }
    if (pid == 0) {
        execvp(argv[0], argv);
        perror(argv[0]);                  // reached only if exec FAILED
        _exit(127);
    }
    int status;
    if (waitpid(pid, &amp;status, 0) &lt; 0) { perror("waitpid"); exit(1); }
    if (WIFEXITED(status))
        printf("  -&gt; exited with code %d\\n", WEXITSTATUS(status));
    else if (WIFSIGNALED(status))
        printf("  -&gt; killed by signal %d (%s)\\n", WTERMSIG(status), strsignal(WTERMSIG(status)));
}

int main(void) {
    char *a[] = { "echo", "hello from the child", NULL };
    char *b[] = { "false", NULL };
    char *c[] = { "sh", "-c", "kill -9 $$", NULL };
    char *d[] = { "no-such-program", NULL };
    run(a); run(b); run(c); run(d);
    return 0;
}</code></pre>
<pre><code class="language-c">// Bài 4: chương trình "chạy lệnh này và cho biết nó kết thúc thế nào"
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static void run(char *const argv[]) {
    printf("run:");
    for (int i = 0; argv[i]; i++) printf(" %s", argv[i]);
    printf("\\n");
    fflush(stdout);                       // without this the child inherits a copy of the buffer
    pid_t pid = fork();
    if (pid &lt; 0) { perror("fork"); exit(1); }
    if (pid == 0) {
        execvp(argv[0], argv);
        perror(argv[0]);                  // reached only if exec FAILED
        _exit(127);
    }
    int status;
    if (waitpid(pid, &amp;status, 0) &lt; 0) { perror("waitpid"); exit(1); }
    if (WIFEXITED(status))
        printf("  -&gt; exited with code %d\\n", WEXITSTATUS(status));
    else if (WIFSIGNALED(status))
        printf("  -&gt; killed by signal %d (%s)\\n", WTERMSIG(status), strsignal(WTERMSIG(status)));
}

int main(void) {
    char *a[] = { "echo", "hello from the child", NULL };
    char *b[] = { "false", NULL };
    char *c[] = { "sh", "-c", "kill -9 $$", NULL };
    char *d[] = { "no-such-program", NULL };
    run(a); run(b); run(c); run(d);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bai4-fork-exec-wait.c -o bai4-fork-exec-wait &amp;&amp; ./bai4-fork-exec-wait<br>
run: echo hello from the child<br>
hello from the child<br>
&nbsp;&nbsp;-&gt; exited with code 0<br>
run: false<br>
&nbsp;&nbsp;-&gt; exited with code 1<br>
run: sh -c kill -9 $$<br>
&nbsp;&nbsp;-&gt; killed by signal 9 (Killed)<br>
run: no-such-program<br>
no-such-program: No such file or directory<br>
&nbsp;&nbsp;-&gt; exited with code 127</div>
<ul>
<li><code>fork()</code> trả về <strong>hai lần</strong>: <code>0</code> trong tiến trình con, PID của con trong tiến trình cha, <code>-1</code> khi thất bại. Tiến trình con là bản sao của cha (cùng mã, bộ nhớ và bảng fd được sao chép) — <code>if (pid == 0)</code> quyết định ai chạy nhánh nào (⭐ CS.1).</li>
<li><code>execvp(tệp, argv)</code> <em>thay</em> chương trình của tiến trình con bằng chương trình mới và không bao giờ trả về nếu thành công. Chữ <code>v</code> là vector đối số, chữ <code>p</code> là "tìm trong <code>$PATH</code>". <code>argv</code> phải kết thúc bằng <code>NULL</code> và <code>argv[0]</code> là tên chương trình. Mã sau <code>execvp</code> chỉ chạy khi nó <strong>thất bại</strong> (ở đây: <code>no-such-program: No such file or directory</code>); khi đó con phải <code>_exit(127)</code> — không được trả về vào vòng lặp của cha (sẽ tạo bản sao thứ hai của cả chương trình) và không được dùng <code>exit()</code> (sẽ xả bộ đệm đã sao chép của cha lần nữa). 127 là quy ước của shell cho "không tìm thấy lệnh".</li>
<li><code>waitpid(pid, &amp;status, 0)</code> chặn tới khi con kết thúc và thu trạng thái của nó (thiếu nó, con ở lại thành <strong>zombie</strong>). Trạng thái là một số nguyên đóng gói: hỏi nó bằng các macro — <code>WIFEXITED</code>/<code>WEXITSTATUS</code> cho thoát bình thường có mã, <code>WIFSIGNALED</code>/<code>WTERMSIG</code> cho chết vì tín hiệu. Kết quả ở trên: <code>0</code>, <code>1</code>, <code>killed by signal 9 (Killed)</code>, <code>127</code>.</li>
<li><strong>Vì sao <code>fflush(stdout)</code> trước <code>fork</code>:</strong> output ở đây đi vào một pipe nên chữ của <code>printf</code> nằm chờ trong bộ đệm của tiến trình. <code>fork</code> sao chép bộ đệm đó, và mỗi bản sao sẽ in lại nó. Xả trước bảo đảm chữ xuất hiện đúng một lần, đúng thứ tự so với output của con.</li>
<li>Hàm 20 dòng này là trái tim của mọi shell, <code>make</code>, CI runner, và <code>child_process.spawn</code> của Node. Bạn sẽ dùng lại nó trong Bài tập lớn.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 5 — a pipe from parent to child, and the EOF rule (25 min)</h3>
<p><strong>Situation.</strong> The parent must send three lines to the child through a pipe; the child reads until end-of-file and reports how many bytes arrived. Implement it and then deliberately break it: let the child <em>forget to close its copy of the write end</em>. Explain what the child sees and why.</p>
<details><summary>Solution — run for real</summary>
<pre><code class="language-c">// Exercise 5: a pipe between parent and child, and the EOF rule
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;poll.h&gt;
#include &lt;sys/wait.h&gt;

static void demo(int child_closes_its_write_end) {
    int fd[2];
    if (pipe(fd) &lt; 0) { perror("pipe"); exit(1); }       // fd[0] = read end, fd[1] = write end
    pid_t pid = fork();
    if (pid == 0) {                                      // child: the READER
        if (child_closes_its_write_end) close(fd[1]);
        char buf[64];
        size_t total = 0;
        for (;;) {
            struct pollfd p = { fd[0], POLLIN, 0 };
            if (poll(&amp;p, 1, 500) == 0) {                 // nothing for 500 ms
                printf("  child: no data and no EOF after 500 ms -&gt; a write end is still open (mine!)\\n");
                _exit(1);
            }
            ssize_t n = read(fd[0], buf, sizeof buf);
            if (n == 0) { printf("  child: read() returned 0 = EOF after %zu bytes\\n", total); _exit(0); }
            total += (size_t)n;
        }
    }
    close(fd[0]);                                        // parent: the WRITER does not read
    const char *msgs[] = { "first line\\n", "second line\\n", "third line\\n" };
    for (int i = 0; i &lt; 3; i++) write(fd[1], msgs[i], strlen(msgs[i]));
    close(fd[1]);                                        // the other half of the EOF rule
    int st;
    waitpid(pid, &amp;st, 0);
    printf("  parent: child exit code %d\\n", WEXITSTATUS(st));
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    printf("correct version (the child closes the write end it does not use):\\n");
    demo(1);
    printf("buggy version (the child keeps its copy of the write end open):\\n");
    demo(0);
    return 0;
}</code></pre>
<pre><code class="language-c">// Exercise 5: a pipe between parent and child, and the EOF rule
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;poll.h&gt;
#include &lt;sys/wait.h&gt;

static void demo(int child_closes_its_write_end) {
    int fd[2];
    if (pipe(fd) &lt; 0) { perror("pipe"); exit(1); }       // fd[0] = read end, fd[1] = write end
    pid_t pid = fork();
    if (pid == 0) {                                      // child: the READER
        if (child_closes_its_write_end) close(fd[1]);
        char buf[64];
        size_t total = 0;
        for (;;) {
            struct pollfd p = { fd[0], POLLIN, 0 };
            if (poll(&amp;p, 1, 500) == 0) {                 // nothing for 500 ms
                printf("  child: no data and no EOF after 500 ms -&gt; a write end is still open (mine!)\\n");
                _exit(1);
            }
            ssize_t n = read(fd[0], buf, sizeof buf);
            if (n == 0) { printf("  child: read() returned 0 = EOF after %zu bytes\\n", total); _exit(0); }
            total += (size_t)n;
        }
    }
    close(fd[0]);                                        // parent: the WRITER does not read
    const char *msgs[] = { "first line\\n", "second line\\n", "third line\\n" };
    for (int i = 0; i &lt; 3; i++) write(fd[1], msgs[i], strlen(msgs[i]));
    close(fd[1]);                                        // the other half of the EOF rule
    int st;
    waitpid(pid, &amp;st, 0);
    printf("  parent: child exit code %d\\n", WEXITSTATUS(st));
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    printf("correct version (the child closes the write end it does not use):\\n");
    demo(1);
    printf("buggy version (the child keeps its copy of the write end open):\\n");
    demo(0);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bai5-ong.c -o bai5-ong &amp;&amp; ./bai5-ong<br>
correct version (the child closes the write end it does not use):<br>
&nbsp;&nbsp;child: read() returned 0 = EOF after 34 bytes<br>
&nbsp;&nbsp;parent: child exit code 0<br>
buggy version (the child keeps its copy of the write end open):<br>
&nbsp;&nbsp;child: no data and no EOF after 500 ms -&gt; a write end is still open (mine!)<br>
&nbsp;&nbsp;parent: child exit code 1</div>
<ul>
<li><code>pipe(fd)</code> creates a kernel buffer and gives <strong>two</strong> fds: <code>fd[0]</code> to read, <code>fd[1]</code> to write. After <code>fork</code> both processes have <em>both</em> ends (⭐ CS.2 exercise 3). Each side closes the end it does not use: the reader closes the write end, the writer closes the read end.</li>
<li><strong>The EOF rule:</strong> <code>read()</code> returns <code>0</code> (end-of-file) only when <em>every</em> write end of the pipe, in <em>every</em> process, is closed. In the correct version the parent closed its write end after writing, the child had closed its own, so after the 34 bytes (three lines) the child got <code>read() returned 0</code> and exited with 0.</li>
<li>In the buggy version the child kept its write end. Its own open write end makes "someone could still write" true forever, so <code>read()</code> would block for ever — a real <strong>hang</strong>. We used <code>poll()</code> with a 500 ms timeout to <em>show</em> it instead of freezing: "no data and no EOF after 500 ms". This is the single most common pipe bug, and the reason the shell's code (Big Project) closes <em>every</em> pipe fd in the child after <code>dup2</code>. The same thing happens with <code>ls | head</code> if some process keeps the pipe open.</li>
<li>The reverse rule: if every <em>read</em> end is closed, <code>write()</code> raises <code>SIGPIPE</code> (exit code 141 in a shell) — the reason <code>yes | head</code> stops (CS.2 exercise 3).</li>
<li>A pipe is a byte stream with no message boundaries (the three <code>write</code> calls may arrive as one <code>read</code>) and holds about 64 KiB; a writer blocks when it is full. Design protocols with line ends or lengths.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 5 — ống từ cha sang con, và quy tắc EOF (25 phút)</h3>
<p><strong>Tình huống.</strong> Cha phải gửi ba dòng sang con qua một ống; con đọc cho tới hết tệp (EOF) và báo đã nhận bao nhiêu byte. Hiện thực nó, rồi cố ý làm hỏng: để con <em>quên đóng bản sao đầu ghi</em> của mình. Giải thích con thấy gì và vì sao.</p>
<details><summary>Lời giải — chạy thật</summary>
<pre><code class="language-c">// Bài 5: ống giữa cha và con, và quy tắc EOF
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;poll.h&gt;
#include &lt;sys/wait.h&gt;

static void demo(int child_closes_its_write_end) {
    int fd[2];
    if (pipe(fd) &lt; 0) { perror("pipe"); exit(1); }       // fd[0] = read end, fd[1] = write end
    pid_t pid = fork();
    if (pid == 0) {                                      // child: the READER
        if (child_closes_its_write_end) close(fd[1]);
        char buf[64];
        size_t total = 0;
        for (;;) {
            struct pollfd p = { fd[0], POLLIN, 0 };
            if (poll(&amp;p, 1, 500) == 0) {                 // nothing for 500 ms
                printf("  child: no data and no EOF after 500 ms -&gt; a write end is still open (mine!)\\n");
                _exit(1);
            }
            ssize_t n = read(fd[0], buf, sizeof buf);
            if (n == 0) { printf("  child: read() returned 0 = EOF after %zu bytes\\n", total); _exit(0); }
            total += (size_t)n;
        }
    }
    close(fd[0]);                                        // parent: the WRITER does not read
    const char *msgs[] = { "first line\\n", "second line\\n", "third line\\n" };
    for (int i = 0; i &lt; 3; i++) write(fd[1], msgs[i], strlen(msgs[i]));
    close(fd[1]);                                        // the other half of the EOF rule
    int st;
    waitpid(pid, &amp;st, 0);
    printf("  parent: child exit code %d\\n", WEXITSTATUS(st));
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    printf("correct version (the child closes the write end it does not use):\\n");
    demo(1);
    printf("buggy version (the child keeps its copy of the write end open):\\n");
    demo(0);
    return 0;
}</code></pre>
<pre><code class="language-c">// Bài 5: ống giữa cha và con, và quy tắc EOF
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;poll.h&gt;
#include &lt;sys/wait.h&gt;

static void demo(int child_closes_its_write_end) {
    int fd[2];
    if (pipe(fd) &lt; 0) { perror("pipe"); exit(1); }       // fd[0] = read end, fd[1] = write end
    pid_t pid = fork();
    if (pid == 0) {                                      // child: the READER
        if (child_closes_its_write_end) close(fd[1]);
        char buf[64];
        size_t total = 0;
        for (;;) {
            struct pollfd p = { fd[0], POLLIN, 0 };
            if (poll(&amp;p, 1, 500) == 0) {                 // nothing for 500 ms
                printf("  child: no data and no EOF after 500 ms -&gt; a write end is still open (mine!)\\n");
                _exit(1);
            }
            ssize_t n = read(fd[0], buf, sizeof buf);
            if (n == 0) { printf("  child: read() returned 0 = EOF after %zu bytes\\n", total); _exit(0); }
            total += (size_t)n;
        }
    }
    close(fd[0]);                                        // parent: the WRITER does not read
    const char *msgs[] = { "first line\\n", "second line\\n", "third line\\n" };
    for (int i = 0; i &lt; 3; i++) write(fd[1], msgs[i], strlen(msgs[i]));
    close(fd[1]);                                        // the other half of the EOF rule
    int st;
    waitpid(pid, &amp;st, 0);
    printf("  parent: child exit code %d\\n", WEXITSTATUS(st));
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    printf("correct version (the child closes the write end it does not use):\\n");
    demo(1);
    printf("buggy version (the child keeps its copy of the write end open):\\n");
    demo(0);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bai5-ong.c -o bai5-ong &amp;&amp; ./bai5-ong<br>
correct version (the child closes the write end it does not use):<br>
&nbsp;&nbsp;child: read() returned 0 = EOF after 34 bytes<br>
&nbsp;&nbsp;parent: child exit code 0<br>
buggy version (the child keeps its copy of the write end open):<br>
&nbsp;&nbsp;child: no data and no EOF after 500 ms -&gt; a write end is still open (mine!)<br>
&nbsp;&nbsp;parent: child exit code 1</div>
<ul>
<li><code>pipe(fd)</code> tạo một bộ đệm trong nhân và trả về <strong>hai</strong> fd: <code>fd[0]</code> để đọc, <code>fd[1]</code> để ghi. Sau <code>fork</code> cả hai tiến trình đều có <em>cả hai</em> đầu (⭐ CS.2 bài 3). Mỗi bên đóng đầu mình không dùng: người đọc đóng đầu ghi, người ghi đóng đầu đọc.</li>
<li><strong>Quy tắc EOF:</strong> <code>read()</code> chỉ trả về <code>0</code> (hết tệp) khi <em>mọi</em> đầu ghi của ống, ở <em>mọi</em> tiến trình, đã đóng. Ở bản đúng, cha đóng đầu ghi sau khi ghi, con đã đóng đầu ghi của mình, nên sau 34 byte (ba dòng) con nhận <code>read() returned 0</code> và thoát với 0.</li>
<li>Ở bản lỗi, con giữ đầu ghi. Chính đầu ghi còn mở của nó làm "vẫn có thể có người ghi" đúng mãi mãi, nên <code>read()</code> sẽ chặn vĩnh viễn — một vụ <strong>treo</strong> thật. Ta dùng <code>poll()</code> với thời hạn 500 ms để <em>cho thấy</em> nó thay vì đóng băng: "no data and no EOF after 500 ms". Đây là lỗi ống phổ biến nhất, và là lý do mã của shell (Bài tập lớn) đóng <em>mọi</em> fd của ống trong tiến trình con sau <code>dup2</code>. Điều tương tự xảy ra với <code>ls | head</code> nếu có tiến trình nào giữ ống mở.</li>
<li>Quy tắc ngược lại: nếu mọi đầu <em>đọc</em> đã đóng, <code>write()</code> gây <code>SIGPIPE</code> (mã thoát 141 trong shell) — lý do <code>yes | head</code> dừng lại (CS.2 bài 3).</li>
<li>Ống là luồng byte không có ranh giới thông điệp (ba lần <code>write</code> có thể tới như một lần <code>read</code>) và chứa khoảng 64 KiB; người ghi bị chặn khi đầy. Hãy thiết kế giao thức bằng ký tự xuống dòng hoặc độ dài.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 6 — copy a file with system calls, and count them (25 min)</h3>
<p><strong>Situation.</strong> Write <code>copy(from, to, bufsize)</code> using only <code>open</code>, <code>read</code>, <code>write</code>, <code>close</code> (and <code>lseek</code> to measure the result). Handle errors with <code>strerror(errno)</code>. Run it on a 10 000-byte file with buffers of 4096, 100 and 1 byte, and on a file that does not exist. Then use <code>strace</code> to count the real system calls.</p>
<details><summary>Solution — run for real</summary>
<pre><code class="language-c">// Exercise 6: copy a file with system calls only (open, read, write, lseek, close)
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;

static int copy(const char *from, const char *to, size_t bufsize, long *reads, long *writes) {
    int in = open(from, O_RDONLY);
    if (in &lt; 0) { fprintf(stderr, "open %s: %s\\n", from, strerror(errno)); return -1; }
    int out = open(to, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (out &lt; 0) { fprintf(stderr, "open %s: %s\\n", to, strerror(errno)); close(in); return -1; }
    char *buf = malloc(bufsize);
    ssize_t n;
    *reads = *writes = 0;
    while ((n = read(in, buf, bufsize)) &gt; 0) {
        (*reads)++;
        ssize_t done = 0;
        while (done &lt; n) {                              // write() may write LESS than asked
            ssize_t w = write(out, buf + done, (size_t)(n - done));
            if (w &lt; 0) { perror("write"); free(buf); close(in); close(out); return -1; }
            done += w;
            (*writes)++;
        }
    }
    if (n &lt; 0) perror("read");
    free(buf);
    close(in);
    close(out);
    return n &lt; 0 ? -1 : 0;
}

int main(void) {
    // make a 10000-byte source file with the same syscalls
    int fd = open("src.bin", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    char block[1000];
    memset(block, 'x', sizeof block);
    for (int i = 0; i &lt; 10; i++) write(fd, block, sizeof block);
    close(fd);

    long r, w;
    for (size_t bs = 4096; bs &gt;= 1; bs = (bs == 4096) ? 100 : (bs == 100) ? 1 : 0) {
        if (copy("src.bin", "dst.bin", bs, &amp;r, &amp;w) == 0) {
            int d = open("dst.bin", O_RDONLY);
            off_t size = lseek(d, 0, SEEK_END);         // size of the copy
            close(d);
            printf("buffer %4zu bytes: %5ld read() + %5ld write() calls, copy is %ld bytes\\n", bs, r, w, (long)size);
        }
        if (bs == 1) break;
    }
    copy("does-not-exist.txt", "dst.bin", 4096, &amp;r, &amp;w);
    copy("src.bin", "/proc/no/such/dir/dst.bin", 4096, &amp;r, &amp;w);
    return 0;
}</code></pre>
<pre><code class="language-c">// Exercise 6: copy a file with system calls only (open, read, write, lseek, close)
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;

static int copy(const char *from, const char *to, size_t bufsize, long *reads, long *writes) {
    int in = open(from, O_RDONLY);
    if (in &lt; 0) { fprintf(stderr, "open %s: %s\\n", from, strerror(errno)); return -1; }
    int out = open(to, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (out &lt; 0) { fprintf(stderr, "open %s: %s\\n", to, strerror(errno)); close(in); return -1; }
    char *buf = malloc(bufsize);
    ssize_t n;
    *reads = *writes = 0;
    while ((n = read(in, buf, bufsize)) &gt; 0) {
        (*reads)++;
        ssize_t done = 0;
        while (done &lt; n) {                              // write() may write LESS than asked
            ssize_t w = write(out, buf + done, (size_t)(n - done));
            if (w &lt; 0) { perror("write"); free(buf); close(in); close(out); return -1; }
            done += w;
            (*writes)++;
        }
    }
    if (n &lt; 0) perror("read");
    free(buf);
    close(in);
    close(out);
    return n &lt; 0 ? -1 : 0;
}

int main(void) {
    // make a 10000-byte source file with the same syscalls
    int fd = open("src.bin", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    char block[1000];
    memset(block, 'x', sizeof block);
    for (int i = 0; i &lt; 10; i++) write(fd, block, sizeof block);
    close(fd);

    long r, w;
    for (size_t bs = 4096; bs &gt;= 1; bs = (bs == 4096) ? 100 : (bs == 100) ? 1 : 0) {
        if (copy("src.bin", "dst.bin", bs, &amp;r, &amp;w) == 0) {
            int d = open("dst.bin", O_RDONLY);
            off_t size = lseek(d, 0, SEEK_END);         // size of the copy
            close(d);
            printf("buffer %4zu bytes: %5ld read() + %5ld write() calls, copy is %ld bytes\\n", bs, r, w, (long)size);
        }
        if (bs == 1) break;
    }
    copy("does-not-exist.txt", "dst.bin", 4096, &amp;r, &amp;w);
    copy("src.bin", "/proc/no/such/dir/dst.bin", 4096, &amp;r, &amp;w);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bai6-sao-chep.c -o bai6-sao-chep &amp;&amp; ./bai6-sao-chep<br>
open does-not-exist.txt: No such file or directory<br>
open /proc/no/such/dir/dst.bin: No such file or directory<br>
buffer 4096 bytes: &nbsp;&nbsp;&nbsp;&nbsp;3 read() + &nbsp;&nbsp;&nbsp;&nbsp;3 write() calls, copy is 10000 bytes<br>
buffer &nbsp;100 bytes: &nbsp;&nbsp;100 read() + &nbsp;&nbsp;100 write() calls, copy is 10000 bytes<br>
buffer &nbsp;&nbsp;&nbsp;1 bytes: 10000 read() + 10000 write() calls, copy is 10000 bytes</div>
<div class="out"># Exercise 6 (cont.): watch the system calls the program really makes<br>
$ gcc -Wall bai6-sao-chep.c -o mycp<br>
$ strace -e trace=openat,read,write ./mycp &gt; /dev/null 2&gt; trace.txt<br>
$ grep -m3 -E 'openat\\(AT_FDCWD, "(src|dst).bin"' trace.txt<br>
openat(AT_FDCWD, "src.bin", O_WRONLY|O_CREAT|O_TRUNC, 0644) = 3<br>
openat(AT_FDCWD, "src.bin", O_RDONLY) &nbsp;&nbsp;= 3<br>
openat(AT_FDCWD, "dst.bin", O_WRONLY|O_CREAT|O_TRUNC, 0644) = 4<br>
$ grep -m2 'read(3, .*, 4096)' trace.txt<br>
read(3, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"..., 4096) = 4096<br>
read(3, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"..., 4096) = 4096<br>
$ grep -m1 'write(4, ' trace.txt | cut -c1-30<br>
write(4, "xxxxxxxxxxxxxxxxxxxx<br>
$ grep -c 'read(3, .*, 4096)' trace.txt<br>
4<br>
$ grep -c 'read(3, .*, 100)' trace.txt<br>
101<br>
$ grep -c 'read(3, .*, 1)' trace.txt<br>
10001</div>
<ul>
<li><code>open(path, flags, mode)</code> returns a small integer <strong>fd</strong> (3 first, because 0, 1, 2 are taken) or <code>-1</code> with the reason in <code>errno</code>; <code>strerror(errno)</code> turns it into the text you saw: <code>No such file or directory</code>. Check <em>every</em> return value: the two error lines come from a missing source and an impossible destination folder.</li>
<li><code>read(fd, buf, n)</code> returns the number of bytes read, <code>0</code> at end-of-file, <code>-1</code> on error. <code>write</code> may write <strong>less than asked</strong> (pipe full, signal, disk almost full), so the inner loop keeps writing the rest. Code that assumes one call is enough works on files in tests and fails on sockets in production. <code>lseek(fd, 0, SEEK_END)</code> returns the file size.</li>
<li><strong>Buffer size is a speed knob.</strong> Same 10 000 bytes: 3 reads with 4096-byte buffers, 100 with 100-byte buffers, 10 000 with 1-byte buffers. <code>strace</code> confirms with 4, 101 and 10 001 <code>read</code> calls — one more each time: the final <code>read</code> that returns 0 and tells you "end of file". Each system call crosses from user mode to kernel mode (Chapter 1) and costs about a microsecond or more; 10 000 of them for 10 KB is why <code>stdio</code> (<code>fread</code>, <code>fgets</code>) keeps its own buffer and why Java and Node wrap streams in buffered readers.</li>
<li><code>strace</code> prints the system calls of a program as they happen: <code>openat(AT_FDCWD, "src.bin", O_RDONLY) = 3</code> is <code>open()</code> in C (the modern kernel call is <code>openat</code>). It is the first tool to use when you ask "what is this program really doing?" or "which file is it failing to open?" — usually with <code>strace -f -e trace=openat,connect</code> (the syscall <em>numbers</em> on ARM64 differ from x86-64 although the names are the same).</li>
</ul>
</details>`,
    `<h3>🧪 Bài 6 — sao chép tệp bằng lời gọi hệ thống, và đếm chúng (25 phút)</h3>
<p><strong>Tình huống.</strong> Viết <code>copy(từ, đến, cỡ_đệm)</code> chỉ dùng <code>open</code>, <code>read</code>, <code>write</code>, <code>close</code> (và <code>lseek</code> để đo kết quả). Xử lý lỗi bằng <code>strerror(errno)</code>. Chạy trên tệp 10 000 byte với bộ đệm 4096, 100 và 1 byte, và trên tệp không tồn tại. Rồi dùng <code>strace</code> đếm các lời gọi hệ thống thật.</p>
<details><summary>Lời giải — chạy thật</summary>
<pre><code class="language-c">// Bài 6: sao chép tệp chỉ bằng lời gọi hệ thống (open, read, write, lseek, close)
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;

static int copy(const char *from, const char *to, size_t bufsize, long *reads, long *writes) {
    int in = open(from, O_RDONLY);
    if (in &lt; 0) { fprintf(stderr, "open %s: %s\\n", from, strerror(errno)); return -1; }
    int out = open(to, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (out &lt; 0) { fprintf(stderr, "open %s: %s\\n", to, strerror(errno)); close(in); return -1; }
    char *buf = malloc(bufsize);
    ssize_t n;
    *reads = *writes = 0;
    while ((n = read(in, buf, bufsize)) &gt; 0) {
        (*reads)++;
        ssize_t done = 0;
        while (done &lt; n) {                              // write() may write LESS than asked
            ssize_t w = write(out, buf + done, (size_t)(n - done));
            if (w &lt; 0) { perror("write"); free(buf); close(in); close(out); return -1; }
            done += w;
            (*writes)++;
        }
    }
    if (n &lt; 0) perror("read");
    free(buf);
    close(in);
    close(out);
    return n &lt; 0 ? -1 : 0;
}

int main(void) {
    // make a 10000-byte source file with the same syscalls
    int fd = open("src.bin", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    char block[1000];
    memset(block, 'x', sizeof block);
    for (int i = 0; i &lt; 10; i++) write(fd, block, sizeof block);
    close(fd);

    long r, w;
    for (size_t bs = 4096; bs &gt;= 1; bs = (bs == 4096) ? 100 : (bs == 100) ? 1 : 0) {
        if (copy("src.bin", "dst.bin", bs, &amp;r, &amp;w) == 0) {
            int d = open("dst.bin", O_RDONLY);
            off_t size = lseek(d, 0, SEEK_END);         // size of the copy
            close(d);
            printf("buffer %4zu bytes: %5ld read() + %5ld write() calls, copy is %ld bytes\\n", bs, r, w, (long)size);
        }
        if (bs == 1) break;
    }
    copy("does-not-exist.txt", "dst.bin", 4096, &amp;r, &amp;w);
    copy("src.bin", "/proc/no/such/dir/dst.bin", 4096, &amp;r, &amp;w);
    return 0;
}</code></pre>
<pre><code class="language-c">// Bài 6: sao chép tệp chỉ bằng lời gọi hệ thống (open, read, write, lseek, close)
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;

static int copy(const char *from, const char *to, size_t bufsize, long *reads, long *writes) {
    int in = open(from, O_RDONLY);
    if (in &lt; 0) { fprintf(stderr, "open %s: %s\\n", from, strerror(errno)); return -1; }
    int out = open(to, O_WRONLY | O_CREAT | O_TRUNC, 0644);
    if (out &lt; 0) { fprintf(stderr, "open %s: %s\\n", to, strerror(errno)); close(in); return -1; }
    char *buf = malloc(bufsize);
    ssize_t n;
    *reads = *writes = 0;
    while ((n = read(in, buf, bufsize)) &gt; 0) {
        (*reads)++;
        ssize_t done = 0;
        while (done &lt; n) {                              // write() may write LESS than asked
            ssize_t w = write(out, buf + done, (size_t)(n - done));
            if (w &lt; 0) { perror("write"); free(buf); close(in); close(out); return -1; }
            done += w;
            (*writes)++;
        }
    }
    if (n &lt; 0) perror("read");
    free(buf);
    close(in);
    close(out);
    return n &lt; 0 ? -1 : 0;
}

int main(void) {
    // make a 10000-byte source file with the same syscalls
    int fd = open("src.bin", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    char block[1000];
    memset(block, 'x', sizeof block);
    for (int i = 0; i &lt; 10; i++) write(fd, block, sizeof block);
    close(fd);

    long r, w;
    for (size_t bs = 4096; bs &gt;= 1; bs = (bs == 4096) ? 100 : (bs == 100) ? 1 : 0) {
        if (copy("src.bin", "dst.bin", bs, &amp;r, &amp;w) == 0) {
            int d = open("dst.bin", O_RDONLY);
            off_t size = lseek(d, 0, SEEK_END);         // size of the copy
            close(d);
            printf("buffer %4zu bytes: %5ld read() + %5ld write() calls, copy is %ld bytes\\n", bs, r, w, (long)size);
        }
        if (bs == 1) break;
    }
    copy("does-not-exist.txt", "dst.bin", 4096, &amp;r, &amp;w);
    copy("src.bin", "/proc/no/such/dir/dst.bin", 4096, &amp;r, &amp;w);
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bai6-sao-chep.c -o bai6-sao-chep &amp;&amp; ./bai6-sao-chep<br>
open does-not-exist.txt: No such file or directory<br>
open /proc/no/such/dir/dst.bin: No such file or directory<br>
buffer 4096 bytes: &nbsp;&nbsp;&nbsp;&nbsp;3 read() + &nbsp;&nbsp;&nbsp;&nbsp;3 write() calls, copy is 10000 bytes<br>
buffer &nbsp;100 bytes: &nbsp;&nbsp;100 read() + &nbsp;&nbsp;100 write() calls, copy is 10000 bytes<br>
buffer &nbsp;&nbsp;&nbsp;1 bytes: 10000 read() + 10000 write() calls, copy is 10000 bytes</div>
<div class="out"># Bài 6 (tiếp): xem những lời gọi hệ thống chương trình thật sự thực hiện<br>
$ gcc -Wall bai6-sao-chep.c -o mycp<br>
$ strace -e trace=openat,read,write ./mycp &gt; /dev/null 2&gt; trace.txt<br>
$ grep -m3 -E 'openat\\(AT_FDCWD, "(src|dst).bin"' trace.txt<br>
openat(AT_FDCWD, "src.bin", O_WRONLY|O_CREAT|O_TRUNC, 0644) = 3<br>
openat(AT_FDCWD, "src.bin", O_RDONLY) &nbsp;&nbsp;= 3<br>
openat(AT_FDCWD, "dst.bin", O_WRONLY|O_CREAT|O_TRUNC, 0644) = 4<br>
$ grep -m2 'read(3, .*, 4096)' trace.txt<br>
read(3, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"..., 4096) = 4096<br>
read(3, "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"..., 4096) = 4096<br>
$ grep -m1 'write(4, ' trace.txt | cut -c1-30<br>
write(4, "xxxxxxxxxxxxxxxxxxxx<br>
$ grep -c 'read(3, .*, 4096)' trace.txt<br>
4<br>
$ grep -c 'read(3, .*, 100)' trace.txt<br>
101<br>
$ grep -c 'read(3, .*, 1)' trace.txt<br>
10001</div>
<ul>
<li><code>open(đường_dẫn, cờ, quyền)</code> trả về một số nguyên nhỏ gọi là <strong>fd</strong> (3 đầu tiên, vì 0, 1, 2 đã bị chiếm) hoặc <code>-1</code> với lý do trong <code>errno</code>; <code>strerror(errno)</code> đổi nó thành chữ bạn đã thấy: <code>No such file or directory</code>. Hãy kiểm tra <em>mọi</em> giá trị trả về: hai dòng lỗi đến từ nguồn không có và thư mục đích bất khả thi.</li>
<li><code>read(fd, buf, n)</code> trả về số byte đọc được, <code>0</code> ở cuối tệp, <code>-1</code> khi lỗi. <code>write</code> có thể ghi <strong>ít hơn yêu cầu</strong> (ống đầy, tín hiệu, đĩa gần đầy), nên vòng lặp trong tiếp tục ghi phần còn lại. Mã giả định một lần gọi là đủ chạy tốt với tệp khi thử và hỏng với socket trên production. <code>lseek(fd, 0, SEEK_END)</code> trả về cỡ tệp.</li>
<li><strong>Cỡ bộ đệm là núm vặn tốc độ.</strong> Cùng 10 000 byte: 3 lần đọc với đệm 4096 byte, 100 lần với đệm 100 byte, 10 000 lần với đệm 1 byte. <code>strace</code> xác nhận với 4, 101 và 10 001 lời gọi <code>read</code> — mỗi lần nhiều hơn một: lần <code>read</code> cuối trả về 0 báo "hết tệp". Mỗi lời gọi hệ thống chuyển từ chế độ người dùng sang chế độ nhân (Chương 1) và tốn cỡ một micro giây hoặc hơn; 10 000 lần cho 10 KB là lý do <code>stdio</code> (<code>fread</code>, <code>fgets</code>) giữ bộ đệm riêng và Java, Node bọc luồng bằng bộ đọc có đệm.</li>
<li><code>strace</code> in các lời gọi hệ thống của một chương trình khi chúng xảy ra: <code>openat(AT_FDCWD, "src.bin", O_RDONLY) = 3</code> chính là <code>open()</code> trong C (lời gọi nhân hiện đại là <code>openat</code>). Đó là công cụ đầu tiên khi bạn hỏi "chương trình này thật sự đang làm gì?" hay "nó không mở được tệp nào?" — thường với <code>strace -f -e trace=openat,connect</code> (<em>số hiệu</em> lời gọi hệ thống trên ARM64 khác x86-64, dù tên giống nhau).</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 7 — a worker that shuts down gracefully (25 min)</h3>
<p><strong>Situation.</strong> A background worker processes "units of work" in a loop. When the orchestrator (Docker, systemd, Kubernetes) stops it, it sends <code>SIGTERM</code>, waits about 10 s, then <code>SIGKILL</code>. The worker must finish the unit it is in and exit with code 0. Implement it in C with <code>sigaction</code>; also count three <code>SIGUSR1</code> signals; and try to install a handler for <code>SIGKILL</code>.</p>
<details><summary>Solution — 🎲 one real run (the number of units depends on timing; the messages do not)</summary>
<pre><code class="language-c">// Exercise 7: signals — a worker that shuts down gracefully
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;signal.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static volatile sig_atomic_t stop = 0;       // only set a flag inside a handler
static volatile sig_atomic_t usr1 = 0;
static void on_term(int sig) { (void)sig; stop = 1; }
static void on_usr1(int sig) { (void)sig; usr1++; }

static void nap(long ms) {
    struct timespec t = { ms / 1000, (ms % 1000) * 1000000L };
    while (nanosleep(&amp;t, &amp;t) &lt; 0 &amp;&amp; errno == EINTR) {}     // finish the nap even if interrupted
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    struct sigaction sa;
    memset(&amp;sa, 0, sizeof sa);
    sa.sa_handler = on_term;
    sigaction(SIGTERM, &amp;sa, NULL);
    sigaction(SIGINT, &amp;sa, NULL);
    sa.sa_handler = on_usr1;
    sigaction(SIGUSR1, &amp;sa, NULL);

    struct sigaction kill_try;
    memset(&amp;kill_try, 0, sizeof kill_try);
    kill_try.sa_handler = on_term;
    if (sigaction(SIGKILL, &amp;kill_try, NULL) &lt; 0)
        printf("SIGKILL: sigaction failed: %s\\n", strerror(errno));

    int ready[2];
    pipe(ready);
    pid_t pid = fork();
    if (pid == 0) {                                         // child = the worker
        close(ready[0]);
        write(ready[1], "r", 1);                            // tell the parent: handlers are installed
        close(ready[1]);
        int unit = 0;
        while (!stop) {
            unit++;
            nap(80);                                        // one unit of work
        }
        printf("child: got %d SIGUSR1, stopping after unit %d\\n", (int)usr1, unit);
        printf("child: finished the unit it was working on, cleaning up\\n");
        _exit(0);
    }
    close(ready[1]);
    char c;
    read(ready[0], &amp;c, 1);
    for (int i = 0; i &lt; 3; i++) { kill(pid, SIGUSR1); nap(20); }
    nap(150);
    printf("parent: sending SIGTERM\\n");
    kill(pid, SIGTERM);
    int st;
    waitpid(pid, &amp;st, 0);
    printf("parent: child exited with code %d\\n", WEXITSTATUS(st));
    return 0;
}</code></pre>
<pre><code class="language-c">// Exercise 7: signals — a worker that shuts down gracefully
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;signal.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static volatile sig_atomic_t stop = 0;       // only set a flag inside a handler
static volatile sig_atomic_t usr1 = 0;
static void on_term(int sig) { (void)sig; stop = 1; }
static void on_usr1(int sig) { (void)sig; usr1++; }

static void nap(long ms) {
    struct timespec t = { ms / 1000, (ms % 1000) * 1000000L };
    while (nanosleep(&amp;t, &amp;t) &lt; 0 &amp;&amp; errno == EINTR) {}     // finish the nap even if interrupted
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    struct sigaction sa;
    memset(&amp;sa, 0, sizeof sa);
    sa.sa_handler = on_term;
    sigaction(SIGTERM, &amp;sa, NULL);
    sigaction(SIGINT, &amp;sa, NULL);
    sa.sa_handler = on_usr1;
    sigaction(SIGUSR1, &amp;sa, NULL);

    struct sigaction kill_try;
    memset(&amp;kill_try, 0, sizeof kill_try);
    kill_try.sa_handler = on_term;
    if (sigaction(SIGKILL, &amp;kill_try, NULL) &lt; 0)
        printf("SIGKILL: sigaction failed: %s\\n", strerror(errno));

    int ready[2];
    pipe(ready);
    pid_t pid = fork();
    if (pid == 0) {                                         // child = the worker
        close(ready[0]);
        write(ready[1], "r", 1);                            // tell the parent: handlers are installed
        close(ready[1]);
        int unit = 0;
        while (!stop) {
            unit++;
            nap(80);                                        // one unit of work
        }
        printf("child: got %d SIGUSR1, stopping after unit %d\\n", (int)usr1, unit);
        printf("child: finished the unit it was working on, cleaning up\\n");
        _exit(0);
    }
    close(ready[1]);
    char c;
    read(ready[0], &amp;c, 1);
    for (int i = 0; i &lt; 3; i++) { kill(pid, SIGUSR1); nap(20); }
    nap(150);
    printf("parent: sending SIGTERM\\n");
    kill(pid, SIGTERM);
    int st;
    waitpid(pid, &amp;st, 0);
    printf("parent: child exited with code %d\\n", WEXITSTATUS(st));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bai7-tin-hieu.c -o bai7-tin-hieu &amp;&amp; ./bai7-tin-hieu<br>
SIGKILL: sigaction failed: Invalid argument<br>
parent: sending SIGTERM<br>
child: got 3 SIGUSR1, stopping after unit 3<br>
child: finished the unit it was working on, cleaning up<br>
parent: child exited with code 0</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<ul>
<li><code>sigaction(sig, &amp;sa, NULL)</code> installs a handler (prefer it to the old <code>signal()</code>, whose behaviour varies between systems). The handler runs <em>asynchronously</em>, interrupting the main code at any instruction, so it may only do very simple things: here it sets a <code>volatile sig_atomic_t</code> flag. <strong>Never call <code>printf</code>, <code>malloc</code> or take a lock in a handler</strong> (they are not async-signal-safe and can deadlock); set a flag, return, and let the main loop notice.</li>
<li>The main loop is <code>while (!stop) { work }</code>: when <code>SIGTERM</code> arrives, the current unit is <em>finished</em>, then the loop ends, cleanup runs, and the worker exits 0. The parent printed <code>child exited with code 0</code>. If the worker ignored the signal, the orchestrator's timeout would escalate to <code>SIGKILL</code> (exit 137) and the in-flight unit would be lost — compare CS.1 exercises 4 and 5, where the same story is told for Node and for Docker's PID 1.</li>
<li><code>nap()</code> loops on <code>EINTR</code>: a signal that arrives during a slow system call (<code>nanosleep</code>, <code>read</code>) makes it fail with <code>EINTR</code> unless the call is restarted. Robust code either retries (as here) or uses <code>SA_RESTART</code>.</li>
<li>Three <code>SIGUSR1</code> were counted exactly ("got 3"): they were sent one at a time with a pause. Standard signals are <strong>not queued</strong> — if three arrive while the handler has not run yet, you may see one. Use a flag, not a counter, for correctness; use real-time signals or a pipe/<code>signalfd</code> when you need counts.</li>
<li><code>SIGKILL: sigaction failed: Invalid argument</code> — <strong><code>SIGKILL</code> and <code>SIGSTOP</code> cannot be caught, blocked or ignored</strong>; the kernel guarantees an administrator can always stop a process. That is why <code>kill -9</code> is a last resort: the process gets no chance to clean up.</li>
<li>The little pipe <code>ready</code> makes the parent wait until the child has installed its handlers; otherwise the first <code>SIGUSR1</code> could arrive before the handler exists and kill the child (the default action of <code>SIGUSR1</code> is to terminate). Race conditions like this are why signals are hard.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 7 — worker tắt êm (25 phút)</h3>
<p><strong>Tình huống.</strong> Một worker nền xử lý các "đơn vị công việc" trong một vòng lặp. Khi bộ điều phối (Docker, systemd, Kubernetes) dừng nó, nó gửi <code>SIGTERM</code>, chờ chừng 10 s, rồi <code>SIGKILL</code>. Worker phải làm xong đơn vị đang xử lý và thoát với mã 0. Hiện thực bằng C với <code>sigaction</code>; đồng thời đếm ba tín hiệu <code>SIGUSR1</code>; và thử cài handler cho <code>SIGKILL</code>.</p>
<details><summary>Lời giải — 🎲 một lần chạy thật (số đơn vị phụ thuộc thời gian; các thông điệp thì không)</summary>
<pre><code class="language-c">// Bài 7: tín hiệu — worker tắt êm
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;signal.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static volatile sig_atomic_t stop = 0;       // only set a flag inside a handler
static volatile sig_atomic_t usr1 = 0;
static void on_term(int sig) { (void)sig; stop = 1; }
static void on_usr1(int sig) { (void)sig; usr1++; }

static void nap(long ms) {
    struct timespec t = { ms / 1000, (ms % 1000) * 1000000L };
    while (nanosleep(&amp;t, &amp;t) &lt; 0 &amp;&amp; errno == EINTR) {}     // finish the nap even if interrupted
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    struct sigaction sa;
    memset(&amp;sa, 0, sizeof sa);
    sa.sa_handler = on_term;
    sigaction(SIGTERM, &amp;sa, NULL);
    sigaction(SIGINT, &amp;sa, NULL);
    sa.sa_handler = on_usr1;
    sigaction(SIGUSR1, &amp;sa, NULL);

    struct sigaction kill_try;
    memset(&amp;kill_try, 0, sizeof kill_try);
    kill_try.sa_handler = on_term;
    if (sigaction(SIGKILL, &amp;kill_try, NULL) &lt; 0)
        printf("SIGKILL: sigaction failed: %s\\n", strerror(errno));

    int ready[2];
    pipe(ready);
    pid_t pid = fork();
    if (pid == 0) {                                         // child = the worker
        close(ready[0]);
        write(ready[1], "r", 1);                            // tell the parent: handlers are installed
        close(ready[1]);
        int unit = 0;
        while (!stop) {
            unit++;
            nap(80);                                        // one unit of work
        }
        printf("child: got %d SIGUSR1, stopping after unit %d\\n", (int)usr1, unit);
        printf("child: finished the unit it was working on, cleaning up\\n");
        _exit(0);
    }
    close(ready[1]);
    char c;
    read(ready[0], &amp;c, 1);
    for (int i = 0; i &lt; 3; i++) { kill(pid, SIGUSR1); nap(20); }
    nap(150);
    printf("parent: sending SIGTERM\\n");
    kill(pid, SIGTERM);
    int st;
    waitpid(pid, &amp;st, 0);
    printf("parent: child exited with code %d\\n", WEXITSTATUS(st));
    return 0;
}</code></pre>
<pre><code class="language-c">// Bài 7: tín hiệu — worker tắt êm
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;signal.h&gt;
#include &lt;string.h&gt;
#include &lt;errno.h&gt;
#include &lt;time.h&gt;
#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;

static volatile sig_atomic_t stop = 0;       // only set a flag inside a handler
static volatile sig_atomic_t usr1 = 0;
static void on_term(int sig) { (void)sig; stop = 1; }
static void on_usr1(int sig) { (void)sig; usr1++; }

static void nap(long ms) {
    struct timespec t = { ms / 1000, (ms % 1000) * 1000000L };
    while (nanosleep(&amp;t, &amp;t) &lt; 0 &amp;&amp; errno == EINTR) {}     // finish the nap even if interrupted
}

int main(void) {
    setvbuf(stdout, NULL, _IOLBF, 0);
    struct sigaction sa;
    memset(&amp;sa, 0, sizeof sa);
    sa.sa_handler = on_term;
    sigaction(SIGTERM, &amp;sa, NULL);
    sigaction(SIGINT, &amp;sa, NULL);
    sa.sa_handler = on_usr1;
    sigaction(SIGUSR1, &amp;sa, NULL);

    struct sigaction kill_try;
    memset(&amp;kill_try, 0, sizeof kill_try);
    kill_try.sa_handler = on_term;
    if (sigaction(SIGKILL, &amp;kill_try, NULL) &lt; 0)
        printf("SIGKILL: sigaction failed: %s\\n", strerror(errno));

    int ready[2];
    pipe(ready);
    pid_t pid = fork();
    if (pid == 0) {                                         // child = the worker
        close(ready[0]);
        write(ready[1], "r", 1);                            // tell the parent: handlers are installed
        close(ready[1]);
        int unit = 0;
        while (!stop) {
            unit++;
            nap(80);                                        // one unit of work
        }
        printf("child: got %d SIGUSR1, stopping after unit %d\\n", (int)usr1, unit);
        printf("child: finished the unit it was working on, cleaning up\\n");
        _exit(0);
    }
    close(ready[1]);
    char c;
    read(ready[0], &amp;c, 1);
    for (int i = 0; i &lt; 3; i++) { kill(pid, SIGUSR1); nap(20); }
    nap(150);
    printf("parent: sending SIGTERM\\n");
    kill(pid, SIGTERM);
    int st;
    waitpid(pid, &amp;st, 0);
    printf("parent: child exited with code %d\\n", WEXITSTATUS(st));
    return 0;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bai7-tin-hieu.c -o bai7-tin-hieu &amp;&amp; ./bai7-tin-hieu<br>
SIGKILL: sigaction failed: Invalid argument<br>
parent: sending SIGTERM<br>
child: got 3 SIGUSR1, stopping after unit 3<br>
child: finished the unit it was working on, cleaning up<br>
parent: child exited with code 0</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<ul>
<li><code>sigaction(sig, &amp;sa, NULL)</code> cài một handler (nên dùng thay cho <code>signal()</code> cũ, vốn hành xử khác nhau giữa các hệ thống). Handler chạy <em>bất đồng bộ</em>, ngắt mã chính ở bất kỳ lệnh nào, nên chỉ được làm việc rất đơn giản: ở đây nó đặt một cờ <code>volatile sig_atomic_t</code>. <strong>Đừng bao giờ gọi <code>printf</code>, <code>malloc</code> hay lấy khoá trong handler</strong> (chúng không an toàn với tín hiệu bất đồng bộ và có thể deadlock); hãy đặt cờ, trả về, để vòng lặp chính nhận ra.</li>
<li>Vòng lặp chính là <code>while (!stop) { làm việc }</code>: khi <code>SIGTERM</code> tới, đơn vị hiện tại được <em>làm xong</em>, rồi vòng lặp kết thúc, dọn dẹp chạy, và worker thoát 0. Cha in <code>child exited with code 0</code>. Nếu worker phớt lờ tín hiệu, thời hạn của bộ điều phối sẽ leo thang thành <code>SIGKILL</code> (mã 137) và đơn vị đang làm dở mất — so với CS.1 bài 4 và 5, cùng câu chuyện được kể cho Node và cho PID 1 của Docker.</li>
<li><code>nap()</code> lặp khi gặp <code>EINTR</code>: một tín hiệu tới giữa lúc một lời gọi hệ thống chậm (<code>nanosleep</code>, <code>read</code>) làm nó thất bại với <code>EINTR</code> trừ khi lời gọi được khởi động lại. Mã bền vững hoặc thử lại (như ở đây) hoặc dùng <code>SA_RESTART</code>.</li>
<li>Ba <code>SIGUSR1</code> được đếm đúng ("got 3"): chúng được gửi từng cái với quãng nghỉ. Tín hiệu chuẩn <strong>không xếp hàng</strong> — nếu ba tín hiệu tới khi handler chưa chạy, bạn có thể chỉ thấy một. Hãy dùng cờ chứ không dùng bộ đếm để đúng đắn; dùng tín hiệu thời gian thực hoặc pipe/<code>signalfd</code> khi cần đếm.</li>
<li><code>SIGKILL: sigaction failed: Invalid argument</code> — <strong><code>SIGKILL</code> và <code>SIGSTOP</code> không thể bắt, chặn hay bỏ qua</strong>; nhân bảo đảm quản trị viên luôn dừng được một tiến trình. Vì thế <code>kill -9</code> là biện pháp cuối: tiến trình không có cơ hội dọn dẹp.</li>
<li>Ống nhỏ <code>ready</code> làm cha chờ tới khi con đã cài handler; nếu không, <code>SIGUSR1</code> đầu tiên có thể tới trước khi handler tồn tại và giết con (hành động mặc định của <code>SIGUSR1</code> là kết thúc tiến trình). Race condition kiểu này là lý do tín hiệu khó.</li>
</ul>
</details>`),
    bi(`<h3>🏁 Big project — write a mini-shell (2–3 hours)</h3>
<p><strong>Situation.</strong> You have used a shell for the whole course; now you write one. <code>mini</code> reads a line, runs it, prints the prompt again. Required features:</p>
<ol>
<li>Run any program: <code>ls -l /etc</code> (use <code>fork</code> + <code>execvp</code> + <code>waitpid</code>); a missing command prints <code>name: command not found</code> and gives status 127.</li>
<li>Words separated by spaces; <strong>quotes</strong> group words (<code>echo "two   spaces"</code> keeps both spaces).</li>
<li>Redirection with <code>&gt;</code> (truncate) and <code>&lt;</code>, implemented with <code>open</code> + <code>dup2</code> in the child.</li>
<li><strong>One pipe</strong>: <code>cmd1 | cmd2</code> (<code>pipe</code>, two children, every pipe fd closed everywhere). Status of a pipeline = status of its last command.</li>
<li>Built-ins that must run <em>inside</em> the shell process: <code>cd [dir]</code>, <code>status</code> (prints the status of the last command), <code>exit [n]</code>. Explain why <code>cd</code> cannot be an external program.</li>
<li>Status convention of bash: exit code as is; killed by signal N → <strong>128 + N</strong>.</li>
<li>Errors never crash the shell: syntax errors, unterminated quotes, unreadable input file, a command killed by a signal.</li>
</ol>
<p><strong>Extensions (for extra marks):</strong> any number of pipes <code>a | b | c</code>; <code>&gt;&gt;</code> (append); <code>&amp;</code> (background job; reap with <code>waitpid(-1, …, WNOHANG)</code>); ignore <code>SIGINT</code> in the shell but not in its children; <code>$?</code> expansion; a Makefile with <code>make</code> and <code>make clean</code>; no memory leaks under <code>valgrind</code>.</p>
<p><strong>Method.</strong> Build it in steps and test after each: (1) read a line and echo it; (2) tokenizer (test it alone with printf of the tokens); (3) fork/exec/wait one command; (4) built-ins; (5) redirection; (6) the pipe; (7) polish. If it crashes, use <code>gdb</code> (Exercise 3); if it hangs on a pipe, you forgot to close a pipe end (Exercise 5); if text appears twice or in the wrong order, <code>fflush</code> before <code>fork</code> (Exercise 4).</p>
<details><summary>Reference solution — run for real (one of many possible designs)</summary>
<pre><code class="language-c">// Big project: mini-shell — fork + exec + wait, redirection with dup2, one pipe, built-ins cd / status / exit
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;sys/wait.h&gt;

#define MAXTOK 64
#define MAXARG 32

typedef struct { char *argv[MAXARG]; int argc; char *in, *out; } Cmd;

static char arena[4096];                 // storage for the tokens of ONE line
static int last_status = 0;

// ---- 1. split a line into tokens; quotes group words; | &lt; &gt; are tokens of their own ----
static int tokenize(const char *s, char **tok, int *is_op) {
    int n = 0;
    char *w = arena;
    while (*s) {
        while (*s == ' ' || *s == '\\t' || *s == '\\n') s++;
        if (!*s) break;
        if (n &gt;= MAXTOK - 1) return -1;
        if (*s == '|' || *s == '&lt;' || *s == '&gt;') {
            tok[n] = w; is_op[n++] = 1;
            *w++ = *s++; *w++ = 0;
            continue;
        }
        tok[n] = w; is_op[n++] = 0;
        char quote = 0;
        while (*s &amp;&amp; (quote || !strchr(" \\t\\n|&lt;&gt;", *s))) {
            if (quote) { if (*s == quote) quote = 0; else *w++ = *s; }
            else if (*s == '\\'' || *s == '"') quote = *s;
            else *w++ = *s;
            s++;
        }
        if (quote) return -2;                                      // unterminated quote
        *w++ = 0;
    }
    return n;
}

// ---- 2. group the tokens into at most two commands joined by one pipe ----
static int build(char **tok, int *is_op, int n, Cmd *cmd) {
    int k = 0;
    memset(&amp;cmd[0], 0, sizeof(Cmd));
    for (int i = 0; i &lt; n; i++) {
        if (is_op[i] &amp;&amp; tok[i][0] == '|') {
            if (k == 1 || cmd[k].argc == 0) return -1;             // second pipe or empty command
            k++;
            memset(&amp;cmd[k], 0, sizeof(Cmd));
        } else if (is_op[i]) {
            if (i + 1 &gt;= n || is_op[i + 1]) return -1;             // redirection without a file name
            if (tok[i][0] == '&lt;') cmd[k].in = tok[i + 1]; else cmd[k].out = tok[i + 1];
            i++;
        } else if (cmd[k].argc &lt; MAXARG - 1) {
            cmd[k].argv[cmd[k].argc++] = tok[i];
        }
    }
    if (cmd[k].argc == 0) return -1;
    return k + 1;
}

// ---- 3. start one command in a child process ----
static pid_t spawn(Cmd *c, int fd_in, int fd_out, int close_a, int close_b) {
    pid_t pid = fork();
    if (pid &lt; 0) { perror("fork"); return -1; }
    if (pid == 0) {
        if (fd_in &gt;= 0) dup2(fd_in, 0);                            // wire the pipe first ...
        if (fd_out &gt;= 0) dup2(fd_out, 1);
        if (close_a &gt;= 0) close(close_a);                          // ... then close EVERY pipe fd, or the reader never sees EOF
        if (close_b &gt;= 0) close(close_b);
        if (c-&gt;in) {                                               // ... then explicit &lt; and &gt; win over the pipe
            int f = open(c-&gt;in, O_RDONLY);
            if (f &lt; 0) { perror(c-&gt;in); _exit(1); }
            dup2(f, 0); close(f);
        }
        if (c-&gt;out) {
            int f = open(c-&gt;out, O_WRONLY | O_CREAT | O_TRUNC, 0644);
            if (f &lt; 0) { perror(c-&gt;out); _exit(1); }
            dup2(f, 1); close(f);
        }
        c-&gt;argv[c-&gt;argc] = NULL;
        execvp(c-&gt;argv[0], c-&gt;argv);
        fprintf(stderr, "%s: command not found\\n", c-&gt;argv[0]);
        _exit(127);
    }
    return pid;
}

static int to_status(int st) {
    if (WIFEXITED(st)) return WEXITSTATUS(st);
    if (WIFSIGNALED(st)) return 128 + WTERMSIG(st);                // same convention as bash
    return 1;
}

static void run(Cmd *cmd, int ncmd) {
    fflush(stdout);                                                // never fork with unflushed output
    if (ncmd == 1) {
        pid_t p = spawn(&amp;cmd[0], -1, -1, -1, -1);
        int st; if (p &gt; 0 &amp;&amp; waitpid(p, &amp;st, 0) &gt; 0) last_status = to_status(st);
        return;
    }
    int fd[2];
    if (pipe(fd) &lt; 0) { perror("pipe"); return; }
    pid_t a = spawn(&amp;cmd[0], -1, fd[1], fd[0], fd[1]);
    pid_t b = spawn(&amp;cmd[1], fd[0], -1, fd[0], fd[1]);
    close(fd[0]); close(fd[1]);                                    // the parent must close both ends too
    int st;
    if (a &gt; 0) waitpid(a, &amp;st, 0);
    if (b &gt; 0 &amp;&amp; waitpid(b, &amp;st, 0) &gt; 0) last_status = to_status(st);   // status of a pipeline = its last command
}

int main(void) {
    char line[512];
    int tty = isatty(0);
    for (;;) {
        if (tty) { printf("mini$ "); fflush(stdout); }
        if (!fgets(line, sizeof line, stdin)) break;
        if (!tty) { printf("mini$ %s", line); fflush(stdout); }    // echo the script so the transcript reads like a session
        char *tok[MAXTOK]; int is_op[MAXTOK];
        int n = tokenize(line, tok, is_op);
        if (n &lt; 0) { fprintf(stderr, "mini: syntax error (quotes or too long)\\n"); last_status = 2; continue; }
        if (n == 0 || tok[0][0] == '#') continue;
        Cmd cmd[2];
        int ncmd = build(tok, is_op, n, cmd);
        if (ncmd &lt; 0) { fprintf(stderr, "mini: syntax error (one | at most, no empty command, a file name after &lt; or &gt;)\\n"); last_status = 2; continue; }
        if (ncmd == 1 &amp;&amp; !is_op[0]) {                              // must run in the shell itself, not in a child
            if (!strcmp(tok[0], "exit")) return cmd[0].argc &gt; 1 ? atoi(cmd[0].argv[1]) : last_status;
            if (!strcmp(tok[0], "cd")) {
                const char *d = cmd[0].argc &gt; 1 ? cmd[0].argv[1] : getenv("HOME");
                if (!d || chdir(d) &lt; 0) { perror("cd"); last_status = 1; } else last_status = 0;
                continue;
            }
            if (!strcmp(tok[0], "status")) { printf("%d\\n", last_status); continue; }
        }
        run(cmd, ncmd);
    }
    return last_status;
}</code></pre>
<p>The script <code>bai8-mini-shell.in</code> is fed to the shell's stdin; because stdin is not a terminal, the shell echoes each line after the prompt so that the transcript reads like a session:</p>
<pre><code class="language-c">// Big project: mini-shell — fork + exec + wait, redirection with dup2, one pipe, built-ins cd / status / exit
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;sys/wait.h&gt;

#define MAXTOK 64
#define MAXARG 32

typedef struct { char *argv[MAXARG]; int argc; char *in, *out; } Cmd;

static char arena[4096];                 // storage for the tokens of ONE line
static int last_status = 0;

// ---- 1. split a line into tokens; quotes group words; | &lt; &gt; are tokens of their own ----
static int tokenize(const char *s, char **tok, int *is_op) {
    int n = 0;
    char *w = arena;
    while (*s) {
        while (*s == ' ' || *s == '\\t' || *s == '\\n') s++;
        if (!*s) break;
        if (n &gt;= MAXTOK - 1) return -1;
        if (*s == '|' || *s == '&lt;' || *s == '&gt;') {
            tok[n] = w; is_op[n++] = 1;
            *w++ = *s++; *w++ = 0;
            continue;
        }
        tok[n] = w; is_op[n++] = 0;
        char quote = 0;
        while (*s &amp;&amp; (quote || !strchr(" \\t\\n|&lt;&gt;", *s))) {
            if (quote) { if (*s == quote) quote = 0; else *w++ = *s; }
            else if (*s == '\\'' || *s == '"') quote = *s;
            else *w++ = *s;
            s++;
        }
        if (quote) return -2;                                      // unterminated quote
        *w++ = 0;
    }
    return n;
}

// ---- 2. group the tokens into at most two commands joined by one pipe ----
static int build(char **tok, int *is_op, int n, Cmd *cmd) {
    int k = 0;
    memset(&amp;cmd[0], 0, sizeof(Cmd));
    for (int i = 0; i &lt; n; i++) {
        if (is_op[i] &amp;&amp; tok[i][0] == '|') {
            if (k == 1 || cmd[k].argc == 0) return -1;             // second pipe or empty command
            k++;
            memset(&amp;cmd[k], 0, sizeof(Cmd));
        } else if (is_op[i]) {
            if (i + 1 &gt;= n || is_op[i + 1]) return -1;             // redirection without a file name
            if (tok[i][0] == '&lt;') cmd[k].in = tok[i + 1]; else cmd[k].out = tok[i + 1];
            i++;
        } else if (cmd[k].argc &lt; MAXARG - 1) {
            cmd[k].argv[cmd[k].argc++] = tok[i];
        }
    }
    if (cmd[k].argc == 0) return -1;
    return k + 1;
}

// ---- 3. start one command in a child process ----
static pid_t spawn(Cmd *c, int fd_in, int fd_out, int close_a, int close_b) {
    pid_t pid = fork();
    if (pid &lt; 0) { perror("fork"); return -1; }
    if (pid == 0) {
        if (fd_in &gt;= 0) dup2(fd_in, 0);                            // wire the pipe first ...
        if (fd_out &gt;= 0) dup2(fd_out, 1);
        if (close_a &gt;= 0) close(close_a);                          // ... then close EVERY pipe fd, or the reader never sees EOF
        if (close_b &gt;= 0) close(close_b);
        if (c-&gt;in) {                                               // ... then explicit &lt; and &gt; win over the pipe
            int f = open(c-&gt;in, O_RDONLY);
            if (f &lt; 0) { perror(c-&gt;in); _exit(1); }
            dup2(f, 0); close(f);
        }
        if (c-&gt;out) {
            int f = open(c-&gt;out, O_WRONLY | O_CREAT | O_TRUNC, 0644);
            if (f &lt; 0) { perror(c-&gt;out); _exit(1); }
            dup2(f, 1); close(f);
        }
        c-&gt;argv[c-&gt;argc] = NULL;
        execvp(c-&gt;argv[0], c-&gt;argv);
        fprintf(stderr, "%s: command not found\\n", c-&gt;argv[0]);
        _exit(127);
    }
    return pid;
}

static int to_status(int st) {
    if (WIFEXITED(st)) return WEXITSTATUS(st);
    if (WIFSIGNALED(st)) return 128 + WTERMSIG(st);                // same convention as bash
    return 1;
}

static void run(Cmd *cmd, int ncmd) {
    fflush(stdout);                                                // never fork with unflushed output
    if (ncmd == 1) {
        pid_t p = spawn(&amp;cmd[0], -1, -1, -1, -1);
        int st; if (p &gt; 0 &amp;&amp; waitpid(p, &amp;st, 0) &gt; 0) last_status = to_status(st);
        return;
    }
    int fd[2];
    if (pipe(fd) &lt; 0) { perror("pipe"); return; }
    pid_t a = spawn(&amp;cmd[0], -1, fd[1], fd[0], fd[1]);
    pid_t b = spawn(&amp;cmd[1], fd[0], -1, fd[0], fd[1]);
    close(fd[0]); close(fd[1]);                                    // the parent must close both ends too
    int st;
    if (a &gt; 0) waitpid(a, &amp;st, 0);
    if (b &gt; 0 &amp;&amp; waitpid(b, &amp;st, 0) &gt; 0) last_status = to_status(st);   // status of a pipeline = its last command
}

int main(void) {
    char line[512];
    int tty = isatty(0);
    for (;;) {
        if (tty) { printf("mini$ "); fflush(stdout); }
        if (!fgets(line, sizeof line, stdin)) break;
        if (!tty) { printf("mini$ %s", line); fflush(stdout); }    // echo the script so the transcript reads like a session
        char *tok[MAXTOK]; int is_op[MAXTOK];
        int n = tokenize(line, tok, is_op);
        if (n &lt; 0) { fprintf(stderr, "mini: syntax error (quotes or too long)\\n"); last_status = 2; continue; }
        if (n == 0 || tok[0][0] == '#') continue;
        Cmd cmd[2];
        int ncmd = build(tok, is_op, n, cmd);
        if (ncmd &lt; 0) { fprintf(stderr, "mini: syntax error (one | at most, no empty command, a file name after &lt; or &gt;)\\n"); last_status = 2; continue; }
        if (ncmd == 1 &amp;&amp; !is_op[0]) {                              // must run in the shell itself, not in a child
            if (!strcmp(tok[0], "exit")) return cmd[0].argc &gt; 1 ? atoi(cmd[0].argv[1]) : last_status;
            if (!strcmp(tok[0], "cd")) {
                const char *d = cmd[0].argc &gt; 1 ? cmd[0].argv[1] : getenv("HOME");
                if (!d || chdir(d) &lt; 0) { perror("cd"); last_status = 1; } else last_status = 0;
                continue;
            }
            if (!strcmp(tok[0], "status")) { printf("%d\\n", last_status); continue; }
        }
        run(cmd, ncmd);
    }
    return last_status;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bai8-mini-shell.c -o bai8-mini-shell &amp;&amp; ./bai8-mini-shell &lt; bai8-mini-shell.in<br>
mini$ echo hello world<br>
hello world<br>
mini$ echo "two &nbsp;&nbsp;spaces kept" &gt; out.txt<br>
mini$ cat out.txt<br>
two &nbsp;&nbsp;spaces kept<br>
mini$ echo one two three | wc -w<br>
3<br>
mini$ printf 'b\\na\\nc\\n' | sort | tr a-z A-Z<br>
mini: syntax error (one | at most, no empty command, a file name after &lt; or &gt;)<br>
mini$ sort &lt; out.txt<br>
two &nbsp;&nbsp;spaces kept<br>
mini$ false<br>
mini$ status<br>
1<br>
mini$ no-such-cmd<br>
no-such-cmd: command not found<br>
mini$ status<br>
127<br>
mini$ cd /tmp<br>
mini$ pwd<br>
/tmp<br>
mini$ sh -c 'kill -9 $$'<br>
mini$ status<br>
137<br>
mini$ cat &lt; /does/not/exist<br>
/does/not/exist: No such file or directory<br>
mini$ echo broken | | wc<br>
mini: syntax error (one | at most, no empty command, a file name after &lt; or &gt;)<br>
mini$ exit 3<br>
[exit code 3]</div>
<ul>
<li><strong>Design in three layers:</strong> <code>tokenize</code> (text → words and operators, honouring quotes) → <code>build</code> (words → one or two <code>Cmd</code> records with <code>argv</code>, <code>in</code>, <code>out</code>) → <code>run</code>/<code>spawn</code> (processes). Each layer can be tested alone; this is how real shells are structured, only with a bigger grammar.</li>
<li><strong>Built-ins run in the shell itself</strong> because a child cannot change its parent's working directory or exit the parent: <code>cd /tmp</code> followed by <code>pwd</code> printed <code>/tmp</code>; the last line <code>exit 3</code> made the whole program end with code 3 (see <code>[exit code 3]</code>).</li>
<li><code>echo one two three | wc -w</code> printed <code>3</code>: <code>spawn</code> wires the pipe with <code>dup2</code> and closes both pipe fds in the child; the parent closes both too — remove either and <code>wc</code> never sees EOF (Exercise 5).</li>
<li>Status after <code>no-such-cmd</code> is 127; after <code>sh -c 'kill -9 $$'</code> it is 137 = 128 + 9; after <code>false</code> it is 1.</li>
<li>The line with <strong>three</strong> stages (<code>printf … | sort | tr …</code>) was rejected with a syntax error: the reference supports one pipe only — the first extension is to lift this limit (hint: a loop that creates <code>n−1</code> pipes and remembers the previous read end).</li>
</ul>
</details>`,
    `<h3>🏁 Bài tập lớn — viết một mini-shell (2–3 giờ)</h3>
<p><strong>Tình huống.</strong> Bạn đã dùng shell suốt môn học; giờ bạn viết một cái. <code>mini</code> đọc một dòng, chạy nó, in lại dấu nhắc. Các tính năng bắt buộc:</p>
<ol>
<li>Chạy chương trình bất kỳ: <code>ls -l /etc</code> (dùng <code>fork</code> + <code>execvp</code> + <code>waitpid</code>); lệnh không tồn tại in <code>tên: command not found</code> và cho trạng thái 127.</li>
<li>Các từ cách nhau bằng dấu cách; <strong>dấu nháy</strong> gom các từ (<code>echo "two   spaces"</code> giữ cả hai dấu cách).</li>
<li>Chuyển hướng bằng <code>&gt;</code> (ghi đè) và <code>&lt;</code>, hiện thực bằng <code>open</code> + <code>dup2</code> trong tiến trình con.</li>
<li><strong>Một dấu ống</strong>: <code>cmd1 | cmd2</code> (<code>pipe</code>, hai tiến trình con, mọi fd của ống được đóng ở mọi nơi). Trạng thái của pipeline = trạng thái của lệnh cuối.</li>
<li>Lệnh nội bộ phải chạy <em>bên trong</em> tiến trình shell: <code>cd [thư_mục]</code>, <code>status</code> (in trạng thái của lệnh trước), <code>exit [n]</code>. Giải thích vì sao <code>cd</code> không thể là chương trình ngoài.</li>
<li>Quy ước trạng thái của bash: mã thoát giữ nguyên; bị tín hiệu N giết → <strong>128 + N</strong>.</li>
<li>Lỗi không bao giờ làm sập shell: lỗi cú pháp, nháy không đóng, tệp đầu vào không đọc được, lệnh bị tín hiệu giết.</li>
</ol>
<p><strong>Mở rộng (để lấy điểm cộng):</strong> số dấu ống tuỳ ý <code>a | b | c</code>; <code>&gt;&gt;</code> (nối thêm); <code>&amp;</code> (job nền; thu bằng <code>waitpid(-1, …, WNOHANG)</code>); bỏ qua <code>SIGINT</code> trong shell nhưng không trong các tiến trình con; bung <code>$?</code>; Makefile với <code>make</code> và <code>make clean</code>; không rò bộ nhớ dưới <code>valgrind</code>.</p>
<p><strong>Phương pháp.</strong> Dựng từng bước và thử sau mỗi bước: (1) đọc một dòng và in lại; (2) bộ tách từ (thử riêng bằng cách in các từ); (3) fork/exec/wait một lệnh; (4) lệnh nội bộ; (5) chuyển hướng; (6) ống; (7) đánh bóng. Nếu sập, dùng <code>gdb</code> (Bài 3); nếu treo ở ống, bạn quên đóng một đầu ống (Bài 5); nếu chữ xuất hiện hai lần hoặc sai thứ tự, <code>fflush</code> trước <code>fork</code> (Bài 4).</p>
<details><summary>Lời giải tham khảo — chạy thật (một trong nhiều thiết kế khả dĩ)</summary>
<pre><code class="language-c">// Bài tập lớn: mini-shell — fork + exec + wait, chuyển hướng bằng dup2, một dấu |, lệnh nội bộ cd / status / exit
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;sys/wait.h&gt;

#define MAXTOK 64
#define MAXARG 32

typedef struct { char *argv[MAXARG]; int argc; char *in, *out; } Cmd;

static char arena[4096];                 // storage for the tokens of ONE line
static int last_status = 0;

// ---- 1. split a line into tokens; quotes group words; | &lt; &gt; are tokens of their own ----
static int tokenize(const char *s, char **tok, int *is_op) {
    int n = 0;
    char *w = arena;
    while (*s) {
        while (*s == ' ' || *s == '\\t' || *s == '\\n') s++;
        if (!*s) break;
        if (n &gt;= MAXTOK - 1) return -1;
        if (*s == '|' || *s == '&lt;' || *s == '&gt;') {
            tok[n] = w; is_op[n++] = 1;
            *w++ = *s++; *w++ = 0;
            continue;
        }
        tok[n] = w; is_op[n++] = 0;
        char quote = 0;
        while (*s &amp;&amp; (quote || !strchr(" \\t\\n|&lt;&gt;", *s))) {
            if (quote) { if (*s == quote) quote = 0; else *w++ = *s; }
            else if (*s == '\\'' || *s == '"') quote = *s;
            else *w++ = *s;
            s++;
        }
        if (quote) return -2;                                      // unterminated quote
        *w++ = 0;
    }
    return n;
}

// ---- 2. group the tokens into at most two commands joined by one pipe ----
static int build(char **tok, int *is_op, int n, Cmd *cmd) {
    int k = 0;
    memset(&amp;cmd[0], 0, sizeof(Cmd));
    for (int i = 0; i &lt; n; i++) {
        if (is_op[i] &amp;&amp; tok[i][0] == '|') {
            if (k == 1 || cmd[k].argc == 0) return -1;             // second pipe or empty command
            k++;
            memset(&amp;cmd[k], 0, sizeof(Cmd));
        } else if (is_op[i]) {
            if (i + 1 &gt;= n || is_op[i + 1]) return -1;             // redirection without a file name
            if (tok[i][0] == '&lt;') cmd[k].in = tok[i + 1]; else cmd[k].out = tok[i + 1];
            i++;
        } else if (cmd[k].argc &lt; MAXARG - 1) {
            cmd[k].argv[cmd[k].argc++] = tok[i];
        }
    }
    if (cmd[k].argc == 0) return -1;
    return k + 1;
}

// ---- 3. start one command in a child process ----
static pid_t spawn(Cmd *c, int fd_in, int fd_out, int close_a, int close_b) {
    pid_t pid = fork();
    if (pid &lt; 0) { perror("fork"); return -1; }
    if (pid == 0) {
        if (fd_in &gt;= 0) dup2(fd_in, 0);                            // wire the pipe first ...
        if (fd_out &gt;= 0) dup2(fd_out, 1);
        if (close_a &gt;= 0) close(close_a);                          // ... then close EVERY pipe fd, or the reader never sees EOF
        if (close_b &gt;= 0) close(close_b);
        if (c-&gt;in) {                                               // ... then explicit &lt; and &gt; win over the pipe
            int f = open(c-&gt;in, O_RDONLY);
            if (f &lt; 0) { perror(c-&gt;in); _exit(1); }
            dup2(f, 0); close(f);
        }
        if (c-&gt;out) {
            int f = open(c-&gt;out, O_WRONLY | O_CREAT | O_TRUNC, 0644);
            if (f &lt; 0) { perror(c-&gt;out); _exit(1); }
            dup2(f, 1); close(f);
        }
        c-&gt;argv[c-&gt;argc] = NULL;
        execvp(c-&gt;argv[0], c-&gt;argv);
        fprintf(stderr, "%s: command not found\\n", c-&gt;argv[0]);
        _exit(127);
    }
    return pid;
}

static int to_status(int st) {
    if (WIFEXITED(st)) return WEXITSTATUS(st);
    if (WIFSIGNALED(st)) return 128 + WTERMSIG(st);                // same convention as bash
    return 1;
}

static void run(Cmd *cmd, int ncmd) {
    fflush(stdout);                                                // never fork with unflushed output
    if (ncmd == 1) {
        pid_t p = spawn(&amp;cmd[0], -1, -1, -1, -1);
        int st; if (p &gt; 0 &amp;&amp; waitpid(p, &amp;st, 0) &gt; 0) last_status = to_status(st);
        return;
    }
    int fd[2];
    if (pipe(fd) &lt; 0) { perror("pipe"); return; }
    pid_t a = spawn(&amp;cmd[0], -1, fd[1], fd[0], fd[1]);
    pid_t b = spawn(&amp;cmd[1], fd[0], -1, fd[0], fd[1]);
    close(fd[0]); close(fd[1]);                                    // the parent must close both ends too
    int st;
    if (a &gt; 0) waitpid(a, &amp;st, 0);
    if (b &gt; 0 &amp;&amp; waitpid(b, &amp;st, 0) &gt; 0) last_status = to_status(st);   // status of a pipeline = its last command
}

int main(void) {
    char line[512];
    int tty = isatty(0);
    for (;;) {
        if (tty) { printf("mini$ "); fflush(stdout); }
        if (!fgets(line, sizeof line, stdin)) break;
        if (!tty) { printf("mini$ %s", line); fflush(stdout); }    // echo the script so the transcript reads like a session
        char *tok[MAXTOK]; int is_op[MAXTOK];
        int n = tokenize(line, tok, is_op);
        if (n &lt; 0) { fprintf(stderr, "mini: syntax error (quotes or too long)\\n"); last_status = 2; continue; }
        if (n == 0 || tok[0][0] == '#') continue;
        Cmd cmd[2];
        int ncmd = build(tok, is_op, n, cmd);
        if (ncmd &lt; 0) { fprintf(stderr, "mini: syntax error (one | at most, no empty command, a file name after &lt; or &gt;)\\n"); last_status = 2; continue; }
        if (ncmd == 1 &amp;&amp; !is_op[0]) {                              // must run in the shell itself, not in a child
            if (!strcmp(tok[0], "exit")) return cmd[0].argc &gt; 1 ? atoi(cmd[0].argv[1]) : last_status;
            if (!strcmp(tok[0], "cd")) {
                const char *d = cmd[0].argc &gt; 1 ? cmd[0].argv[1] : getenv("HOME");
                if (!d || chdir(d) &lt; 0) { perror("cd"); last_status = 1; } else last_status = 0;
                continue;
            }
            if (!strcmp(tok[0], "status")) { printf("%d\\n", last_status); continue; }
        }
        run(cmd, ncmd);
    }
    return last_status;
}</code></pre>
<p>Tệp <code>bai8-mini-shell.in</code> được đưa vào stdin của shell; vì stdin không phải terminal, shell in lại từng dòng sau dấu nhắc để bản ghi đọc như một phiên làm việc:</p>
<pre><code class="language-c">// Bài tập lớn: mini-shell — fork + exec + wait, chuyển hướng bằng dup2, một dấu |, lệnh nội bộ cd / status / exit
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;
#include &lt;unistd.h&gt;
#include &lt;fcntl.h&gt;
#include &lt;sys/wait.h&gt;

#define MAXTOK 64
#define MAXARG 32

typedef struct { char *argv[MAXARG]; int argc; char *in, *out; } Cmd;

static char arena[4096];                 // storage for the tokens of ONE line
static int last_status = 0;

// ---- 1. split a line into tokens; quotes group words; | &lt; &gt; are tokens of their own ----
static int tokenize(const char *s, char **tok, int *is_op) {
    int n = 0;
    char *w = arena;
    while (*s) {
        while (*s == ' ' || *s == '\\t' || *s == '\\n') s++;
        if (!*s) break;
        if (n &gt;= MAXTOK - 1) return -1;
        if (*s == '|' || *s == '&lt;' || *s == '&gt;') {
            tok[n] = w; is_op[n++] = 1;
            *w++ = *s++; *w++ = 0;
            continue;
        }
        tok[n] = w; is_op[n++] = 0;
        char quote = 0;
        while (*s &amp;&amp; (quote || !strchr(" \\t\\n|&lt;&gt;", *s))) {
            if (quote) { if (*s == quote) quote = 0; else *w++ = *s; }
            else if (*s == '\\'' || *s == '"') quote = *s;
            else *w++ = *s;
            s++;
        }
        if (quote) return -2;                                      // unterminated quote
        *w++ = 0;
    }
    return n;
}

// ---- 2. group the tokens into at most two commands joined by one pipe ----
static int build(char **tok, int *is_op, int n, Cmd *cmd) {
    int k = 0;
    memset(&amp;cmd[0], 0, sizeof(Cmd));
    for (int i = 0; i &lt; n; i++) {
        if (is_op[i] &amp;&amp; tok[i][0] == '|') {
            if (k == 1 || cmd[k].argc == 0) return -1;             // second pipe or empty command
            k++;
            memset(&amp;cmd[k], 0, sizeof(Cmd));
        } else if (is_op[i]) {
            if (i + 1 &gt;= n || is_op[i + 1]) return -1;             // redirection without a file name
            if (tok[i][0] == '&lt;') cmd[k].in = tok[i + 1]; else cmd[k].out = tok[i + 1];
            i++;
        } else if (cmd[k].argc &lt; MAXARG - 1) {
            cmd[k].argv[cmd[k].argc++] = tok[i];
        }
    }
    if (cmd[k].argc == 0) return -1;
    return k + 1;
}

// ---- 3. start one command in a child process ----
static pid_t spawn(Cmd *c, int fd_in, int fd_out, int close_a, int close_b) {
    pid_t pid = fork();
    if (pid &lt; 0) { perror("fork"); return -1; }
    if (pid == 0) {
        if (fd_in &gt;= 0) dup2(fd_in, 0);                            // wire the pipe first ...
        if (fd_out &gt;= 0) dup2(fd_out, 1);
        if (close_a &gt;= 0) close(close_a);                          // ... then close EVERY pipe fd, or the reader never sees EOF
        if (close_b &gt;= 0) close(close_b);
        if (c-&gt;in) {                                               // ... then explicit &lt; and &gt; win over the pipe
            int f = open(c-&gt;in, O_RDONLY);
            if (f &lt; 0) { perror(c-&gt;in); _exit(1); }
            dup2(f, 0); close(f);
        }
        if (c-&gt;out) {
            int f = open(c-&gt;out, O_WRONLY | O_CREAT | O_TRUNC, 0644);
            if (f &lt; 0) { perror(c-&gt;out); _exit(1); }
            dup2(f, 1); close(f);
        }
        c-&gt;argv[c-&gt;argc] = NULL;
        execvp(c-&gt;argv[0], c-&gt;argv);
        fprintf(stderr, "%s: command not found\\n", c-&gt;argv[0]);
        _exit(127);
    }
    return pid;
}

static int to_status(int st) {
    if (WIFEXITED(st)) return WEXITSTATUS(st);
    if (WIFSIGNALED(st)) return 128 + WTERMSIG(st);                // same convention as bash
    return 1;
}

static void run(Cmd *cmd, int ncmd) {
    fflush(stdout);                                                // never fork with unflushed output
    if (ncmd == 1) {
        pid_t p = spawn(&amp;cmd[0], -1, -1, -1, -1);
        int st; if (p &gt; 0 &amp;&amp; waitpid(p, &amp;st, 0) &gt; 0) last_status = to_status(st);
        return;
    }
    int fd[2];
    if (pipe(fd) &lt; 0) { perror("pipe"); return; }
    pid_t a = spawn(&amp;cmd[0], -1, fd[1], fd[0], fd[1]);
    pid_t b = spawn(&amp;cmd[1], fd[0], -1, fd[0], fd[1]);
    close(fd[0]); close(fd[1]);                                    // the parent must close both ends too
    int st;
    if (a &gt; 0) waitpid(a, &amp;st, 0);
    if (b &gt; 0 &amp;&amp; waitpid(b, &amp;st, 0) &gt; 0) last_status = to_status(st);   // status of a pipeline = its last command
}

int main(void) {
    char line[512];
    int tty = isatty(0);
    for (;;) {
        if (tty) { printf("mini$ "); fflush(stdout); }
        if (!fgets(line, sizeof line, stdin)) break;
        if (!tty) { printf("mini$ %s", line); fflush(stdout); }    // echo the script so the transcript reads like a session
        char *tok[MAXTOK]; int is_op[MAXTOK];
        int n = tokenize(line, tok, is_op);
        if (n &lt; 0) { fprintf(stderr, "mini: syntax error (quotes or too long)\\n"); last_status = 2; continue; }
        if (n == 0 || tok[0][0] == '#') continue;
        Cmd cmd[2];
        int ncmd = build(tok, is_op, n, cmd);
        if (ncmd &lt; 0) { fprintf(stderr, "mini: syntax error (one | at most, no empty command, a file name after &lt; or &gt;)\\n"); last_status = 2; continue; }
        if (ncmd == 1 &amp;&amp; !is_op[0]) {                              // must run in the shell itself, not in a child
            if (!strcmp(tok[0], "exit")) return cmd[0].argc &gt; 1 ? atoi(cmd[0].argv[1]) : last_status;
            if (!strcmp(tok[0], "cd")) {
                const char *d = cmd[0].argc &gt; 1 ? cmd[0].argv[1] : getenv("HOME");
                if (!d || chdir(d) &lt; 0) { perror("cd"); last_status = 1; } else last_status = 0;
                continue;
            }
            if (!strcmp(tok[0], "status")) { printf("%d\\n", last_status); continue; }
        }
        run(cmd, ncmd);
    }
    return last_status;
}</code></pre>
<div class="out">$ gcc -Wall -O0 -pthread bai8-mini-shell.c -o bai8-mini-shell &amp;&amp; ./bai8-mini-shell &lt; bai8-mini-shell.in<br>
mini$ echo hello world<br>
hello world<br>
mini$ echo "two &nbsp;&nbsp;spaces kept" &gt; out.txt<br>
mini$ cat out.txt<br>
two &nbsp;&nbsp;spaces kept<br>
mini$ echo one two three | wc -w<br>
3<br>
mini$ printf 'b\\na\\nc\\n' | sort | tr a-z A-Z<br>
mini: syntax error (one | at most, no empty command, a file name after &lt; or &gt;)<br>
mini$ sort &lt; out.txt<br>
two &nbsp;&nbsp;spaces kept<br>
mini$ false<br>
mini$ status<br>
1<br>
mini$ no-such-cmd<br>
no-such-cmd: command not found<br>
mini$ status<br>
127<br>
mini$ cd /tmp<br>
mini$ pwd<br>
/tmp<br>
mini$ sh -c 'kill -9 $$'<br>
mini$ status<br>
137<br>
mini$ cat &lt; /does/not/exist<br>
/does/not/exist: No such file or directory<br>
mini$ echo broken | | wc<br>
mini: syntax error (one | at most, no empty command, a file name after &lt; or &gt;)<br>
mini$ exit 3<br>
[exit code 3]</div>
<ul>
<li><strong>Thiết kế ba tầng:</strong> <code>tokenize</code> (chữ → từ và toán tử, tôn trọng dấu nháy) → <code>build</code> (từ → một hoặc hai bản ghi <code>Cmd</code> với <code>argv</code>, <code>in</code>, <code>out</code>) → <code>run</code>/<code>spawn</code> (tiến trình). Mỗi tầng thử riêng được; shell thật cũng được cấu trúc như vậy, chỉ với văn phạm lớn hơn.</li>
<li><strong>Lệnh nội bộ chạy trong chính shell</strong> vì tiến trình con không đổi được thư mục làm việc của cha và không thoát thay cha được: <code>cd /tmp</code> rồi <code>pwd</code> in <code>/tmp</code>; dòng cuối <code>exit 3</code> làm cả chương trình kết thúc với mã 3 (xem <code>[exit code 3]</code>).</li>
<li><code>echo one two three | wc -w</code> in <code>3</code>: <code>spawn</code> nối ống bằng <code>dup2</code> và đóng cả hai fd của ống trong tiến trình con; cha cũng đóng cả hai — bỏ một trong hai thì <code>wc</code> không bao giờ thấy EOF (Bài 5).</li>
<li>Trạng thái sau <code>no-such-cmd</code> là 127; sau <code>sh -c 'kill -9 $$'</code> là 137 = 128 + 9; sau <code>false</code> là 1.</li>
<li>Dòng có <strong>ba</strong> công đoạn (<code>printf … | sort | tr …</code>) bị từ chối với lỗi cú pháp: lời giải tham khảo chỉ hỗ trợ một dấu ống — phần mở rộng đầu tiên là gỡ giới hạn này (gợi ý: một vòng lặp tạo <code>n−1</code> ống và nhớ đầu đọc của ống trước).</li>
</ul>
</details>`),
    bi(`<h3>⚠️ Common errors — how to read them</h3>
<table>
<thead><tr><th>Message or symptom</th><th>Meaning</th><th>What to do</th></tr></thead>
<tbody>
<tr><td><code>warning: implicit declaration of function</code></td><td>you used a function without its <code>#include</code></td><td>add the header named by <code>man 3 function</code></td></tr>
<tr><td><code>undefined reference to 'f'</code></td><td>link error: no object file or library provides <code>f</code></td><td>add the <code>.c</code>/<code>.o</code> or <code>-l…</code>; check spelling and <code>static</code></td></tr>
<tr><td><code>multiple definition of 'f'</code></td><td>the same function defined in two files (often in a header)</td><td>declarations in headers, definitions in one <code>.c</code></td></tr>
<tr><td><code>Segmentation fault (core dumped)</code> / exit 139</td><td>invalid memory access: NULL pointer, bad index, freed memory</td><td><code>gcc -g</code>, then <code>gdb</code>: <code>run</code>, <code>bt</code>; or <code>-fsanitize=address</code></td></tr>
<tr><td><code>*** missing separator. Stop.</code></td><td>spaces instead of TAB in a Makefile</td><td>TAB before every command line</td></tr>
<tr><td><code>No such file or directory</code> (from <code>exec</code>)</td><td>wrong path, wrong architecture, or a CRLF in the shebang</td><td><code>file</code>, <code>ls -l</code>, <code>which</code></td></tr>
<tr><td>Output appears twice, or after the child's</td><td>unflushed buffer duplicated by <code>fork</code></td><td><code>fflush(stdout)</code> before <code>fork</code></td></tr>
<tr><td>The program hangs on a pipe</td><td>a write end is still open somewhere</td><td>close every unused pipe fd in every process</td></tr>
<tr><td>Zombie processes in <code>ps</code> (<code>Z</code>)</td><td>the parent never called <code>wait</code></td><td><code>waitpid</code>, or handle <code>SIGCHLD</code></td></tr>
<tr><td><code>Interrupted system call (EINTR)</code></td><td>a signal arrived during a slow call</td><td>retry the call or use <code>SA_RESTART</code></td></tr>
</tbody>
</table>
<h3>📝 What to submit and how it is marked</h3>
<p>The lecturer sets the exact format of the real lab; this is your self-check against CLO9–10. Submit a folder <code>Lab3_&lt;StudentID&gt;</code> with: the source of each exercise (<code>ex1…ex7.c</code>, <code>Makefile</code>), the Big Project (<code>mini.c</code>, <code>Makefile</code>), a <code>README.txt</code> showing how to build and one terminal transcript of a test session, and a short report (half a page per exercise: what the program does, what you observed, one thing that went wrong and how you found it).</p>
<table>
<thead><tr><th>Criterion</th><th>What a full mark needs</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Correctness</td><td>every exercise compiles <strong>without warnings</strong> under <code>-Wall -Wextra</code> and gives the expected output</td><td>3</td></tr>
<tr><td>Big project</td><td>the 7 required features work, tested with at least 8 command lines including 3 error cases</td><td>3</td></tr>
<tr><td>System-call discipline</td><td>every <code>fork</code>, <code>exec</code>, <code>open</code>, <code>read</code>, <code>write</code>, <code>pipe</code> return value is checked; no zombies; no leaked fds (check <code>ls /proc/PID/fd</code>)</td><td>1.5</td></tr>
<tr><td>Tools</td><td>a working Makefile; one gdb session (backtrace and a conditional breakpoint) and one strace output in the report</td><td>1.5</td></tr>
<tr><td>Explanations</td><td>you can explain compile vs link, the EOF rule, why built-ins run in the shell, and why handlers set flags</td><td>1</td></tr>
</tbody>
</table>
<p>Self-check: (1) what does <code>fork()</code> return in the child? (2) why is code after a successful <code>execvp</code> never reached? (3) which signals cannot be caught? (4) after <code>pipe()</code> and <code>fork()</code>, how many processes hold the write end? <em>Answers: 0 · the process image was replaced · SIGKILL and SIGSTOP · two (parent and child) until each closes its copy.</em></p>`,
    `<h3>⚠️ Lỗi hay gặp — cách đọc thông báo</h3>
<table>
<thead><tr><th>Thông báo hoặc triệu chứng</th><th>Nghĩa là</th><th>Việc cần làm</th></tr></thead>
<tbody>
<tr><td><code>warning: implicit declaration of function</code></td><td>bạn dùng hàm mà thiếu <code>#include</code></td><td>thêm header mà <code>man 3 hàm</code> nêu</td></tr>
<tr><td><code>undefined reference to 'f'</code></td><td>lỗi liên kết: không tệp đối tượng hay thư viện nào cung cấp <code>f</code></td><td>thêm <code>.c</code>/<code>.o</code> hoặc <code>-l…</code>; kiểm tra chính tả và <code>static</code></td></tr>
<tr><td><code>multiple definition of 'f'</code></td><td>cùng một hàm được định nghĩa ở hai tệp (thường trong header)</td><td>khai báo trong header, định nghĩa ở đúng một <code>.c</code></td></tr>
<tr><td><code>Segmentation fault (core dumped)</code> / mã 139</td><td>truy cập bộ nhớ không hợp lệ: con trỏ NULL, chỉ số sai, bộ nhớ đã giải phóng</td><td><code>gcc -g</code>, rồi <code>gdb</code>: <code>run</code>, <code>bt</code>; hoặc <code>-fsanitize=address</code></td></tr>
<tr><td><code>*** missing separator. Stop.</code></td><td>dấu cách thay cho TAB trong Makefile</td><td>TAB trước mỗi dòng lệnh</td></tr>
<tr><td><code>No such file or directory</code> (từ <code>exec</code>)</td><td>sai đường dẫn, sai kiến trúc, hoặc CRLF trong shebang</td><td><code>file</code>, <code>ls -l</code>, <code>which</code></td></tr>
<tr><td>Output xuất hiện hai lần, hoặc sau output của con</td><td>bộ đệm chưa xả bị <code>fork</code> nhân đôi</td><td><code>fflush(stdout)</code> trước <code>fork</code></td></tr>
<tr><td>Chương trình treo ở một ống</td><td>đâu đó vẫn còn một đầu ghi mở</td><td>đóng mọi fd ống không dùng ở mọi tiến trình</td></tr>
<tr><td>Tiến trình zombie trong <code>ps</code> (<code>Z</code>)</td><td>tiến trình cha chưa bao giờ gọi <code>wait</code></td><td><code>waitpid</code>, hoặc xử lý <code>SIGCHLD</code></td></tr>
<tr><td><code>Interrupted system call (EINTR)</code></td><td>một tín hiệu tới giữa lời gọi chậm</td><td>thử lại lời gọi hoặc dùng <code>SA_RESTART</code></td></tr>
</tbody>
</table>
<h3>📝 Nộp gì / chấm thế nào</h3>
<p>Định dạng chính xác của bài lab thật do giảng viên đặt; đây là bảng tự kiểm theo CLO9–10. Nộp thư mục <code>Lab3_&lt;MãSV&gt;</code> gồm: mã nguồn từng bài (<code>ex1…ex7.c</code>, <code>Makefile</code>), Bài tập lớn (<code>mini.c</code>, <code>Makefile</code>), một <code>README.txt</code> nêu cách dựng và một bản ghi terminal của phiên thử, và một báo cáo ngắn (nửa trang mỗi bài: chương trình làm gì, bạn quan sát được gì, một điều đã sai và bạn tìm ra bằng cách nào).</p>
<table>
<thead><tr><th>Tiêu chí</th><th>Điểm tối đa cần gì</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Đúng đắn</td><td>mỗi bài biên dịch <strong>không cảnh báo</strong> với <code>-Wall -Wextra</code> và cho đúng output</td><td>3</td></tr>
<tr><td>Bài tập lớn</td><td>7 tính năng bắt buộc chạy được, thử với ít nhất 8 dòng lệnh gồm 3 trường hợp lỗi</td><td>3</td></tr>
<tr><td>Kỷ luật lời gọi hệ thống</td><td>mọi giá trị trả về của <code>fork</code>, <code>exec</code>, <code>open</code>, <code>read</code>, <code>write</code>, <code>pipe</code> được kiểm tra; không zombie; không rò fd (xem <code>ls /proc/PID/fd</code>)</td><td>1,5</td></tr>
<tr><td>Công cụ</td><td>Makefile chạy được; một phiên gdb (backtrace và điểm dừng có điều kiện) và một output strace trong báo cáo</td><td>1,5</td></tr>
<tr><td>Giải thích</td><td>giải thích được biên dịch và liên kết, quy tắc EOF, vì sao lệnh nội bộ chạy trong shell, vì sao handler chỉ đặt cờ</td><td>1</td></tr>
</tbody>
</table>
<p>Tự kiểm: (1) <code>fork()</code> trả về gì trong tiến trình con? (2) vì sao mã sau một <code>execvp</code> thành công không bao giờ chạy tới? (3) tín hiệu nào không bắt được? (4) sau <code>pipe()</code> và <code>fork()</code>, có bao nhiêu tiến trình giữ đầu ghi? <em>Đáp án: 0 · ảnh tiến trình đã bị thay · SIGKILL và SIGSTOP · hai (cha và con) cho tới khi mỗi bên đóng bản sao của mình.</em></p>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>gcc / compiler warnings</strong></td><td>gcc / cảnh báo biên dịch</td><td>The GNU C compiler; -Wall -Wextra turn on the checks that catch most beginner bugs.</td></tr>
<tr><td><strong>object file (.o)</strong></td><td>tệp đối tượng</td><td>Machine code of one source file with unresolved symbols, produced by gcc -c.</td></tr>
<tr><td><strong>linker (ld)</strong></td><td>trình liên kết</td><td>Joins object files and libraries into one executable; reports "undefined reference".</td></tr>
<tr><td><strong>ELF</strong></td><td>định dạng ELF</td><td>The executable file format of Linux (code, data, symbols, entry point).</td></tr>
<tr><td><strong>Makefile / make</strong></td><td>Makefile / make</td><td>Rules "target: prerequisites" plus TAB-indented commands; make rebuilds what is older than its inputs.</td></tr>
<tr><td><strong>gdb / backtrace</strong></td><td>gdb / vết ngăn xếp</td><td>The GNU debugger; bt lists the chain of calls that led to the current line.</td></tr>
<tr><td><strong>breakpoint (conditional)</strong></td><td>điểm dừng (có điều kiện)</td><td>A place where gdb stops the program; "break 9 if i == 2" stops only when the condition holds.</td></tr>
<tr><td><strong>segmentation fault (SIGSEGV)</strong></td><td>lỗi phân đoạn</td><td>The kernel kills a process that touches memory it may not use; exit code 139.</td></tr>
<tr><td><strong>off-by-one</strong></td><td>lỗi lệch một</td><td>A loop or index that goes one element too far or too short (i &lt;= n instead of i &lt; n).</td></tr>
<tr><td><strong>fork / exec / wait</strong></td><td>tạo / thay / chờ tiến trình</td><td>Create a copy of the process; replace its program; collect its exit status.</td></tr>
<tr><td><strong>exit status / WEXITSTATUS</strong></td><td>trạng thái thoát</td><td>The number a process returns; macros decode the packed value from wait (exit code or signal).</td></tr>
<tr><td><strong>zombie</strong></td><td>tiến trình zombie</td><td>A finished child whose parent has not yet called wait; it only holds its exit status.</td></tr>
<tr><td><strong>pipe / EOF rule</strong></td><td>ống / quy tắc EOF</td><td>A kernel byte buffer with a read and a write end; EOF only when all write ends are closed.</td></tr>
<tr><td><strong>dup2</strong></td><td>nhân bản fd</td><td>Makes one fd number refer to the same open file as another — the engine of redirection.</td></tr>
<tr><td><strong>system call</strong></td><td>lời gọi hệ thống</td><td>The controlled entry from a program into the kernel (open, read, write, fork, …).</td></tr>
<tr><td><strong>errno / strerror</strong></td><td>mã lỗi / chữ mô tả lỗi</td><td>The variable that holds the reason of the last failed call; strerror turns it into text.</td></tr>
<tr><td><strong>strace</strong></td><td>strace</td><td>Prints every system call a program makes, with arguments and results.</td></tr>
<tr><td><strong>signal / handler</strong></td><td>tín hiệu / hàm xử lý</td><td>An asynchronous notification to a process; a handler should only set a flag.</td></tr>
<tr><td><strong>SIGTERM vs SIGKILL</strong></td><td>SIGTERM so với SIGKILL</td><td>SIGTERM asks politely and can be handled; SIGKILL cannot be caught, so there is no cleanup.</td></tr>
<tr><td><strong>EINTR</strong></td><td>bị ngắt bởi tín hiệu</td><td>A slow system call returned early because a signal arrived; retry it.</td></tr>
<tr><td><strong>shell built-in</strong></td><td>lệnh nội bộ của shell</td><td>A command (cd, exit) that must run inside the shell process because it changes the shell itself.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>gcc / compiler warnings</strong></td><td>gcc / cảnh báo biên dịch</td><td>Trình biên dịch C của GNU; -Wall -Wextra bật các kiểm tra bắt được phần lớn lỗi của người mới.</td></tr>
<tr><td><strong>object file (.o)</strong></td><td>tệp đối tượng</td><td>Mã máy của một tệp nguồn với các ký hiệu chưa giải quyết, do gcc -c tạo ra.</td></tr>
<tr><td><strong>linker (ld)</strong></td><td>trình liên kết</td><td>Ghép các tệp đối tượng và thư viện thành một tệp thực thi; báo "undefined reference".</td></tr>
<tr><td><strong>ELF</strong></td><td>định dạng ELF</td><td>Định dạng tệp thực thi của Linux (mã, dữ liệu, ký hiệu, điểm vào).</td></tr>
<tr><td><strong>Makefile / make</strong></td><td>Makefile / make</td><td>Các luật "đích: điều kiện tiên quyết" cùng lệnh thụt bằng TAB; make dựng lại thứ cũ hơn đầu vào của nó.</td></tr>
<tr><td><strong>gdb / backtrace</strong></td><td>gdb / vết ngăn xếp</td><td>Trình gỡ lỗi của GNU; bt liệt kê chuỗi lời gọi dẫn tới dòng hiện tại.</td></tr>
<tr><td><strong>breakpoint (conditional)</strong></td><td>điểm dừng (có điều kiện)</td><td>Nơi gdb dừng chương trình; "break 9 if i == 2" chỉ dừng khi điều kiện đúng.</td></tr>
<tr><td><strong>segmentation fault (SIGSEGV)</strong></td><td>lỗi phân đoạn</td><td>Nhân giết tiến trình chạm vào bộ nhớ mà nó không được dùng; mã thoát 139.</td></tr>
<tr><td><strong>off-by-one</strong></td><td>lỗi lệch một</td><td>Vòng lặp hay chỉ số đi quá hoặc thiếu một phần tử (i &lt;= n thay vì i &lt; n).</td></tr>
<tr><td><strong>fork / exec / wait</strong></td><td>tạo / thay / chờ tiến trình</td><td>Tạo bản sao của tiến trình; thay chương trình của nó; thu trạng thái thoát của nó.</td></tr>
<tr><td><strong>exit status / WEXITSTATUS</strong></td><td>trạng thái thoát</td><td>Con số tiến trình trả về; các macro giải mã giá trị đóng gói từ wait (mã thoát hay tín hiệu).</td></tr>
<tr><td><strong>zombie</strong></td><td>tiến trình zombie</td><td>Tiến trình con đã xong mà cha chưa gọi wait; nó chỉ còn giữ trạng thái thoát.</td></tr>
<tr><td><strong>pipe / EOF rule</strong></td><td>ống / quy tắc EOF</td><td>Bộ đệm byte trong nhân có đầu đọc và đầu ghi; chỉ có EOF khi mọi đầu ghi đã đóng.</td></tr>
<tr><td><strong>dup2</strong></td><td>nhân bản fd</td><td>Cho một số fd trỏ tới cùng tệp đang mở với fd khác — động cơ của chuyển hướng.</td></tr>
<tr><td><strong>system call</strong></td><td>lời gọi hệ thống</td><td>Cửa vào có kiểm soát từ chương trình vào nhân (open, read, write, fork, …).</td></tr>
<tr><td><strong>errno / strerror</strong></td><td>mã lỗi / chữ mô tả lỗi</td><td>Biến giữ lý do của lời gọi thất bại gần nhất; strerror đổi nó thành chữ.</td></tr>
<tr><td><strong>strace</strong></td><td>strace</td><td>In mọi lời gọi hệ thống chương trình thực hiện, kèm đối số và kết quả.</td></tr>
<tr><td><strong>signal / handler</strong></td><td>tín hiệu / hàm xử lý</td><td>Thông báo bất đồng bộ gửi tới tiến trình; handler chỉ nên đặt một cờ.</td></tr>
<tr><td><strong>SIGTERM vs SIGKILL</strong></td><td>SIGTERM so với SIGKILL</td><td>SIGTERM yêu cầu lịch sự và xử lý được; SIGKILL không bắt được nên không có dọn dẹp.</td></tr>
<tr><td><strong>EINTR</strong></td><td>bị ngắt bởi tín hiệu</td><td>Một lời gọi hệ thống chậm trả về sớm vì có tín hiệu; hãy thử lại.</td></tr>
<tr><td><strong>shell built-in</strong></td><td>lệnh nội bộ của shell</td><td>Lệnh (cd, exit) phải chạy trong chính tiến trình shell vì nó thay đổi chính shell.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Lab 3 summary</h2>
<ul>
<li><strong>Build:</strong> always <code>gcc -Wall -Wextra -g</code>; compile (<code>-c</code>) then link; "undefined reference" is a linker error; headers declare, <code>.c</code> files define.</li>
<li><strong>make:</strong> target, prerequisites, TAB-indented commands; rebuilds by timestamp; list headers as prerequisites; <code>.PHONY</code> for <code>clean</code>; "missing separator" = spaces instead of TAB.</li>
<li><strong>gdb:</strong> <code>run</code>, <code>bt</code>, <code>frame</code>, <code>print</code>, <code>break … if</code>, <code>next</code>, <code>step</code>, <code>finish</code>; exit 139 = SIGSEGV; the crash site (inside libc) is not always the cause (a NULL argument) — and C may give a wrong answer without crashing.</li>
<li><strong>Processes:</strong> <code>fork</code> returns 0 in the child; <code>exec</code> replaces the program and returns only on failure (then <code>_exit(127)</code>); <code>waitpid</code> + macros decode the status; <code>fflush</code> before <code>fork</code>.</li>
<li><strong>Pipes:</strong> two fds; EOF only when every write end is closed — close unused ends in every process, or the reader hangs.</li>
<li><strong>System calls:</strong> check every return value; <code>write</code> may be short; buffer size changes the number of calls (4 vs 101 vs 10 001); <code>strace</code> shows the truth.</li>
<li><strong>Signals:</strong> handler sets a <code>volatile sig_atomic_t</code> flag only; SIGTERM → finish the unit and exit 0; SIGKILL cannot be caught; retry on EINTR.</li>
<li><strong>Mini-shell:</strong> tokenizer → command builder → spawn; built-ins in the shell; <code>dup2</code> for &lt; &gt; |; status 128 + signal.</li>
<li><strong>Next:</strong> Lab 4 uses <code>/proc</code> and system tools to look at the processes you just learned to create — see ⭐ CS.7 for the deeper story.</li>
</ul>`,
    `<h2>📌 Tóm tắt Lab 3</h2>
<ul>
<li><strong>Dựng:</strong> luôn <code>gcc -Wall -Wextra -g</code>; biên dịch (<code>-c</code>) rồi liên kết; "undefined reference" là lỗi của trình liên kết; header khai báo, tệp <code>.c</code> định nghĩa.</li>
<li><strong>make:</strong> đích, điều kiện tiên quyết, lệnh thụt bằng TAB; dựng lại theo dấu thời gian; liệt kê header là điều kiện tiên quyết; <code>.PHONY</code> cho <code>clean</code>; "missing separator" = dấu cách thay TAB.</li>
<li><strong>gdb:</strong> <code>run</code>, <code>bt</code>, <code>frame</code>, <code>print</code>, <code>break … if</code>, <code>next</code>, <code>step</code>, <code>finish</code>; mã 139 = SIGSEGV; nơi sập (trong libc) không phải lúc nào cũng là nguyên nhân (một đối số NULL) — và C có thể cho đáp án sai mà không sập.</li>
<li><strong>Tiến trình:</strong> <code>fork</code> trả 0 trong tiến trình con; <code>exec</code> thay chương trình và chỉ trả về khi thất bại (khi đó <code>_exit(127)</code>); <code>waitpid</code> + macro giải mã trạng thái; <code>fflush</code> trước <code>fork</code>.</li>
<li><strong>Ống:</strong> hai fd; chỉ có EOF khi mọi đầu ghi đã đóng — đóng các đầu không dùng ở mọi tiến trình, nếu không người đọc bị treo.</li>
<li><strong>Lời gọi hệ thống:</strong> kiểm tra mọi giá trị trả về; <code>write</code> có thể ghi thiếu; cỡ bộ đệm đổi số lời gọi (4 so với 101 so với 10 001); <code>strace</code> cho thấy sự thật.</li>
<li><strong>Tín hiệu:</strong> handler chỉ đặt cờ <code>volatile sig_atomic_t</code>; SIGTERM → làm xong đơn vị rồi thoát 0; SIGKILL không bắt được; thử lại khi gặp EINTR.</li>
<li><strong>Mini-shell:</strong> bộ tách từ → bộ dựng lệnh → spawn; lệnh nội bộ ở trong shell; <code>dup2</code> cho &lt; &gt; |; trạng thái 128 + tín hiệu.</li>
<li><strong>Tiếp theo:</strong> Lab 4 dùng <code>/proc</code> và công cụ hệ thống để nhìn các tiến trình bạn vừa học tạo ra — xem ⭐ CS.7 cho câu chuyện sâu hơn.</li>
</ul>`),
  ].join('\n'),
};

/* ───────── Lab 4 — Observing a Linux system: ps, top, /proc, memory, signals, job control, systemd, cron, and a process doctor ───────── */
const L_x_lab_4 = {
  title: 'Lab 4 — Observing a Linux system: ps, top, /proc, memory, signals, job control, systemd, cron, and a process doctor|||Lab 4 — Quan sát hệ thống Linux: ps, top, /proc, bộ nhớ, tín hiệu, điều khiển job, systemd, cron, và bác sĩ tiến trình',
  slug: 'osg202-lab-4',
  type: 'VIDEO',
  description: 'Bài lab 4 của OSG202 (CLO8–10) dạy nhìn vào bên trong một máy Linux đang chạy như người trực hệ thống backend: tám bài tập có lời giải chạy thật — ps, pstree và top, đọc /proc cho từng tiến trình (trạng thái, fd, bản đồ bộ nhớ), meminfo, cpuinfo, loadavg và cái bẫy giới hạn của container (bị OOM-kill), tín hiệu, nice và điều khiển job, đọc một systemd unit (container không có systemd nên nói thẳng), và đọc cú pháp cron — rồi bài tập lớn tự viết bác sĩ tiến trình chỉ đọc từ /proc. Kèm lỗi hay gặp, bảng chấm điểm, thuật ngữ.',
  content: [
    bi(`<span class="eyebrow">Chapter 7 · Lab 4 · CLO8–10</span>
<h2>Lab 4 — Observing a Linux system</h2>
<p class="lead">It is 02:00 and the pager says "the API is slow". You have an SSH session and no profiler. Who is running? What is it holding? Is it out of memory, out of file descriptors, stuck, or just starved of CPU? In this lab you learn to ask a running Linux system these questions with the tools every server has — <code>ps</code>, <code>top</code> and the <code>/proc</code> file system — and to read what the answers mean in terms of the processes, memory and files you studied in Chapters 2–4. You also read the two things that start and schedule services on a typical VPS: a <strong>systemd unit</strong> and a <strong>cron</strong> line.</p>
<h3>🎯 Objectives</h3>
<ul>
<li>List processes and their relations with <code>ps</code>, <code>pstree</code>, <code>top -b</code>; read state letters (S, R, T, Z) (CLO8; Chapter 2).</li>
<li>Read <code>/proc/PID/status</code>, <code>fd</code>, <code>maps</code>, <code>limits</code> and <code>/proc/meminfo</code>, <code>cpuinfo</code>, <code>loadavg</code>; tell virtual memory from resident memory (CLO8, CLO10; Chapter 3).</li>
<li>Send signals, change priority with <code>nice</code>/<code>renice</code>, and use shell job control (CLO8–9).</li>
<li>Read and explain a systemd unit and a crontab line (CLO8).</li>
<li>Combine everything in a small diagnostic tool (CLO9–10).</li>
</ul>
<h3>🐳 How to work</h3>
<p>Everything below was <strong>run for real</strong> in the course container (Debian 12, ARM64). Two honest limits: the container has <strong>no systemd</strong> and <strong>no cron</strong> (PID 1 is a shell, not <code>systemd</code>) — so for those two topics you read and lint real files and simulate what the service manager does, but you cannot run <code>systemctl</code> here; try them on your own VM or VPS. And the numbers (PIDs, memory sizes, load) will differ on your machine — what must match is the <em>meaning</em>. Do each exercise yourself first; on your own Linux you can run the same commands on real services (<code>nginx</code>, <code>postgres</code>, your Node app).</p>
<table>
<thead><tr><th>Exercise</th><th>Question</th><th>Tools</th></tr></thead>
<tbody>
<tr><td>1</td><td>who is running, and who started whom?</td><td>ps, pstree, top -b</td></tr>
<tr><td>2</td><td>what is process 1234, exactly?</td><td>/proc/PID/{comm,cmdline,exe,cwd,status,environ,task}</td></tr>
<tr><td>3</td><td>what files and memory does it hold?</td><td>/proc/PID/{fd,fdinfo,limits,maps}</td></tr>
<tr><td>4</td><td>how much RAM and CPU does the machine have — and the container?</td><td>/proc/{meminfo,cpuinfo,loadavg}, cgroup</td></tr>
<tr><td>5</td><td>stop it, resume it, make it polite</td><td>kill, pgrep, nice, renice</td></tr>
<tr><td>6</td><td>run things in the background properly</td><td>jobs, bg, nohup, setsid</td></tr>
<tr><td>7</td><td>read a systemd unit</td><td>.service file, lint, setpriv</td></tr>
<tr><td>8</td><td>read a cron line</td><td>five fields, step, list, the OR trap</td></tr>
<tr><td>9</td><td><strong>Big project:</strong> a process doctor</td><td>everything above</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 7 · Lab 4 · CLO8–10</span>
<h2>Lab 4 — Quan sát một hệ thống Linux</h2>
<p class="lead">Lúc 02:00 máy nhắn "API đang chậm". Bạn có một phiên SSH và không có profiler. Ai đang chạy? Nó đang giữ gì? Nó hết bộ nhớ, hết file descriptor, bị kẹt, hay chỉ bị thiếu CPU? Trong lab này bạn học cách hỏi một hệ thống Linux đang chạy những câu đó bằng các công cụ máy chủ nào cũng có — <code>ps</code>, <code>top</code> và hệ thống tệp <code>/proc</code> — và đọc ý nghĩa của câu trả lời theo các tiến trình, bộ nhớ và tệp bạn đã học ở Chương 2–4. Bạn cũng đọc hai thứ khởi động và lên lịch dịch vụ trên một VPS điển hình: một <strong>systemd unit</strong> và một dòng <strong>cron</strong>.</p>
<h3>🎯 Mục tiêu</h3>
<ul>
<li>Liệt kê tiến trình và quan hệ giữa chúng bằng <code>ps</code>, <code>pstree</code>, <code>top -b</code>; đọc các chữ trạng thái (S, R, T, Z) (CLO8; Chương 2).</li>
<li>Đọc <code>/proc/PID/status</code>, <code>fd</code>, <code>maps</code>, <code>limits</code> và <code>/proc/meminfo</code>, <code>cpuinfo</code>, <code>loadavg</code>; phân biệt bộ nhớ ảo với bộ nhớ thường trú (CLO8, CLO10; Chương 3).</li>
<li>Gửi tín hiệu, đổi độ ưu tiên bằng <code>nice</code>/<code>renice</code>, và dùng điều khiển job của shell (CLO8–9).</li>
<li>Đọc và giải thích một systemd unit và một dòng crontab (CLO8).</li>
<li>Kết hợp tất cả trong một công cụ chẩn đoán nhỏ (CLO9–10).</li>
</ul>
<h3>🐳 Cách làm</h3>
<p>Mọi thứ dưới đây đã <strong>chạy thật</strong> trong container của môn (Debian 12, ARM64). Hai giới hạn trung thực: container <strong>không có systemd</strong> và <strong>không có cron</strong> (PID 1 là một shell, không phải <code>systemd</code>) — nên với hai chủ đề đó bạn đọc và kiểm tra các tệp thật rồi mô phỏng việc trình quản lý dịch vụ làm, nhưng không chạy được <code>systemctl</code> ở đây; hãy thử trên máy ảo hay VPS của bạn. Và các con số (PID, cỡ bộ nhớ, tải) sẽ khác trên máy bạn — điều phải khớp là <em>ý nghĩa</em>. Tự làm từng bài trước; trên Linux của bạn, có thể chạy chính những lệnh đó trên dịch vụ thật (<code>nginx</code>, <code>postgres</code>, ứng dụng Node của bạn).</p>
<table>
<thead><tr><th>Bài</th><th>Câu hỏi</th><th>Công cụ</th></tr></thead>
<tbody>
<tr><td>1</td><td>ai đang chạy, và ai khởi động ai?</td><td>ps, pstree, top -b</td></tr>
<tr><td>2</td><td>tiến trình 1234 chính xác là gì?</td><td>/proc/PID/{comm,cmdline,exe,cwd,status,environ,task}</td></tr>
<tr><td>3</td><td>nó giữ những tệp và bộ nhớ nào?</td><td>/proc/PID/{fd,fdinfo,limits,maps}</td></tr>
<tr><td>4</td><td>máy có bao nhiêu RAM và CPU — còn container?</td><td>/proc/{meminfo,cpuinfo,loadavg}, cgroup</td></tr>
<tr><td>5</td><td>dừng nó, cho chạy tiếp, bảo nó nhường</td><td>kill, pgrep, nice, renice</td></tr>
<tr><td>6</td><td>chạy việc nền cho đúng</td><td>jobs, bg, nohup, setsid</td></tr>
<tr><td>7</td><td>đọc một systemd unit</td><td>tệp .service, lint, setpriv</td></tr>
<tr><td>8</td><td>đọc một dòng cron</td><td>năm trường, bước nhảy, danh sách, bẫy OR</td></tr>
<tr><td>9</td><td><strong>Bài tập lớn:</strong> bác sĩ tiến trình</td><td>mọi thứ ở trên</td></tr>
</tbody>
</table>`),
    bi(`<h3>🧪 Exercise 1 — who is running, and who started whom? (15 min)</h3>
<p><strong>Situation.</strong> Three background things run: a plain <code>sleep</code>, a Node "service", and a script that starts a child and then replaces itself with <code>sleep</code> without ever waiting for the child. Show (a) the process table with PID, parent PID, state and nice value; (b) the same as a tree; (c) which process is a <strong>zombie</strong> and who its parent is; (d) a batch snapshot of <code>top</code>; (e) the three biggest processes by resident memory.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 1: who is running on this machine?<br>
$ sleep 300 &amp;<br>
$ node -e 'setInterval(() =&gt; {}, 1000)' &amp;<br>
$ bash -c 'sleep 0.2 &amp; exec sleep 300' &amp;<br>
$ sleep 1<br>
# The basic table: PID, parent PID, state, nice value, command<br>
$ ps -eo pid,ppid,stat,ni,comm<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT &nbsp;NI COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 Ss &nbsp;&nbsp;&nbsp;&nbsp;0 bash<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 S &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 Sl &nbsp;&nbsp;&nbsp;&nbsp;0 node<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 S &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17 Z &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 R &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 ps<br>
# The same processes as a tree: who started whom<br>
$ pstree -p 1<br>
bash(1)-+-node(14)-+-{node}(21)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-{node}(22)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-{node}(23)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-{node}(24)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-{node}(25)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#96;-{node}(27)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-pstree(33)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-sleep(11)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#96;-sleep(17)---sleep(20)<br>
# State letters: S sleeping, R running, T stopped, Z zombie (finished, parent has not called wait)<br>
$ ps -eo pid,ppid,stat,comm | awk '$3 ~ /^Z/ {print "zombie: parent is PID", $2}'<br>
zombie: parent is PID 17<br>
$ ps -eo stat,comm | grep -c '^Z'<br>
1<br>
# One snapshot of top in batch mode (first lines only)<br>
$ top -b -n 1 | head -n 12 | grep -v '^%Cpu'<br>
top - 12:57:36 up 1 day, 11:36, &nbsp;0 user, &nbsp;load average: 7.03, 8.64, 7.98<br>
Tasks: &nbsp;&nbsp;8 total, &nbsp;&nbsp;1 running, &nbsp;&nbsp;6 sleeping, &nbsp;&nbsp;0 stopped, &nbsp;&nbsp;1 zombie<br>
MiB Mem : &nbsp;&nbsp;7934.1 total, &nbsp;&nbsp;3809.0 free, &nbsp;&nbsp;3126.3 used, &nbsp;&nbsp;1387.0 buff/cache<br>
MiB Swap: &nbsp;&nbsp;1024.0 total, &nbsp;&nbsp;1005.4 free, &nbsp;&nbsp;&nbsp;&nbsp;18.6 used. &nbsp;&nbsp;4807.8 avail Mem<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID USER &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PR &nbsp;NI &nbsp;&nbsp;&nbsp;VIRT &nbsp;&nbsp;&nbsp;RES &nbsp;&nbsp;&nbsp;SHR S &nbsp;%CPU &nbsp;%MEM &nbsp;&nbsp;&nbsp;&nbsp;TIME+ COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 sv &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;4852 &nbsp;&nbsp;3620 &nbsp;&nbsp;2728 S &nbsp;&nbsp;0.0 &nbsp;&nbsp;0.0 &nbsp;&nbsp;0:00.01 bash<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11 sv &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;2660 &nbsp;&nbsp;1452 &nbsp;&nbsp;1352 S &nbsp;&nbsp;0.0 &nbsp;&nbsp;0.0 &nbsp;&nbsp;0:00.00 sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 sv &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;0 &nbsp;483752 &nbsp;42264 &nbsp;35904 S &nbsp;&nbsp;0.0 &nbsp;&nbsp;0.5 &nbsp;&nbsp;0:00.01 node<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17 sv &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;2660 &nbsp;&nbsp;1440 &nbsp;&nbsp;1340 S &nbsp;&nbsp;0.0 &nbsp;&nbsp;0.0 &nbsp;&nbsp;0:00.00 sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 sv &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 Z &nbsp;&nbsp;0.0 &nbsp;&nbsp;0.0 &nbsp;&nbsp;0:00.00 sleep<br>
# Custom columns and sorting: the 3 biggest processes by resident memory<br>
$ ps -eo pid,rss,comm --sort=-rss | head -n 4<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;RSS COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 42264 node<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;49 &nbsp;3956 ps<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;3620 bash<br>
$ kill %1 %2 %3</div>
<ul>
<li><code>ps -eo pid,ppid,stat,ni,comm</code>: <code>-e</code> every process, <code>-o</code> the columns <em>you</em> choose (more stable than <code>ps aux</code>, whose layout you parse at your own risk). PID 1 is <code>bash</code> here because the container starts the lab as its first process; on a real server it is <code>systemd</code> (or <code>init</code>), the ancestor of everything. Every other process has a parent (<code>PPID</code>): the one that called <code>fork()</code> (Lab 3).</li>
<li><strong>State letters</strong> (column STAT): <code>S</code> sleeping (waiting for an event — most processes, most of the time), <code>R</code> running or runnable, <code>T</code> stopped by a signal, <code>D</code> uninterruptible sleep (usually disk I/O; cannot be killed, and counts in load average), <code>Z</code> zombie. Extra characters: <code>s</code> session leader, <code>l</code> multi-threaded (<code>node</code> shows <code>Sl</code>), <code>+</code> foreground, <code>&lt;</code>/<code>N</code> high/low priority.</li>
<li><strong>The zombie.</strong> <code>bash -c 'sleep 0.2 &amp; exec sleep 300'</code> forked a child (the <code>Z</code> row) that exited after 0.2 s; then the shell <em>replaced itself</em> with <code>sleep 300</code> (the zombie's <code>PPID</code>), a program that never calls <code>wait()</code>. The child's task struct stays in the table as <code>Z</code> with the one thing the parent might still want: its exit status (Chapter 2; ⭐ CS.1 exercise 3). A zombie uses no CPU and no memory — but a <em>leak</em> of zombies fills the PID table. You cannot kill a zombie; you fix or kill its <strong>parent</strong> (then PID 1 adopts and reaps it).</li>
<li><code>pstree -p 1</code> draws the same parent links as a tree and shows <strong>threads</strong> in braces: Node has 6 extra threads (V8 and libuv worker threads). Use it to answer "what did this process spawn?".</li>
<li><code>top -b -n 1</code> is <code>top</code> without the interactive screen: one frame, safe in scripts and logs. Header lines: time and <em>uptime</em>; <code>load average</code> (1, 5, 15 minutes; see Exercise 4); task counts per state (here 1 zombie); the <code>%Cpu</code> line (us user, sy kernel, id idle, wa waiting for I/O, st stolen by the hypervisor — we left that line out because its columns change width); memory and swap. Interactive keys on a real terminal: <kbd>M</kbd> sort by memory, <kbd>P</kbd> by CPU, <kbd>1</kbd> per-CPU, <kbd>k</kbd> kill, <kbd>q</kbd> quit. <strong>The load average shown here belongs to the Docker host</strong>, not to this container — see Exercise 4.</li>
<li><code>ps -eo pid,rss,comm --sort=-rss | head</code> = the biggest memory users first. <code>RSS</code> (resident set size, KiB) is the RAM actually used now; <code>VIRT/VSZ</code> is address space promised (Exercise 3). Node's 42 MiB is a typical empty-service size.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 1 — ai đang chạy, và ai khởi động ai? (15 phút)</h3>
<p><strong>Tình huống.</strong> Ba thứ chạy nền: một <code>sleep</code> trơn, một "dịch vụ" Node, và một script khởi động một tiến trình con rồi tự thay mình bằng <code>sleep</code> mà không bao giờ chờ con. Hãy chỉ ra (a) bảng tiến trình với PID, PID cha, trạng thái và nice; (b) cũng điều đó dưới dạng cây; (c) tiến trình nào là <strong>zombie</strong> và cha của nó là ai; (d) một ảnh chụp batch của <code>top</code>; (e) ba tiến trình lớn nhất theo bộ nhớ thường trú.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 1: ai đang chạy trên máy này?<br>
$ sleep 300 &amp;<br>
$ node -e 'setInterval(() =&gt; {}, 1000)' &amp;<br>
$ bash -c 'sleep 0.2 &amp; exec sleep 300' &amp;<br>
$ sleep 1<br>
# Bảng cơ bản: PID, PID cha, trạng thái, nice, lệnh<br>
$ ps -eo pid,ppid,stat,ni,comm<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;PPID STAT &nbsp;NI COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 Ss &nbsp;&nbsp;&nbsp;&nbsp;0 bash<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 S &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 Sl &nbsp;&nbsp;&nbsp;&nbsp;0 node<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 S &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17 Z &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;30 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 R &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 ps<br>
# Cũng các tiến trình đó dưới dạng cây: ai khởi động ai<br>
$ pstree -p 1<br>
bash(1)-+-node(14)-+-{node}(21)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-{node}(22)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-{node}(23)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-{node}(24)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-{node}(25)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#96;-{node}(27)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-pstree(33)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|-sleep(11)<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#96;-sleep(17)---sleep(20)<br>
# Chữ trạng thái: S ngủ, R chạy, T dừng, Z zombie (đã xong, cha chưa gọi wait)<br>
$ ps -eo pid,ppid,stat,comm | awk '$3 ~ /^Z/ {print "zombie: parent is PID", $2}'<br>
zombie: parent is PID 17<br>
$ ps -eo stat,comm | grep -c '^Z'<br>
1<br>
# Một ảnh chụp của top ở chế độ batch (chỉ vài dòng đầu)<br>
$ top -b -n 1 | head -n 12 | grep -v '^%Cpu'<br>
top - 12:57:36 up 1 day, 11:36, &nbsp;0 user, &nbsp;load average: 7.03, 8.64, 7.98<br>
Tasks: &nbsp;&nbsp;8 total, &nbsp;&nbsp;1 running, &nbsp;&nbsp;6 sleeping, &nbsp;&nbsp;0 stopped, &nbsp;&nbsp;1 zombie<br>
MiB Mem : &nbsp;&nbsp;7934.1 total, &nbsp;&nbsp;3809.0 free, &nbsp;&nbsp;3126.3 used, &nbsp;&nbsp;1387.0 buff/cache<br>
MiB Swap: &nbsp;&nbsp;1024.0 total, &nbsp;&nbsp;1005.4 free, &nbsp;&nbsp;&nbsp;&nbsp;18.6 used. &nbsp;&nbsp;4807.8 avail Mem<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID USER &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PR &nbsp;NI &nbsp;&nbsp;&nbsp;VIRT &nbsp;&nbsp;&nbsp;RES &nbsp;&nbsp;&nbsp;SHR S &nbsp;%CPU &nbsp;%MEM &nbsp;&nbsp;&nbsp;&nbsp;TIME+ COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 sv &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;4852 &nbsp;&nbsp;3620 &nbsp;&nbsp;2728 S &nbsp;&nbsp;0.0 &nbsp;&nbsp;0.0 &nbsp;&nbsp;0:00.01 bash<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;11 sv &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;2660 &nbsp;&nbsp;1452 &nbsp;&nbsp;1352 S &nbsp;&nbsp;0.0 &nbsp;&nbsp;0.0 &nbsp;&nbsp;0:00.00 sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 sv &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;0 &nbsp;483752 &nbsp;42264 &nbsp;35904 S &nbsp;&nbsp;0.0 &nbsp;&nbsp;0.5 &nbsp;&nbsp;0:00.01 node<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;17 sv &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;2660 &nbsp;&nbsp;1440 &nbsp;&nbsp;1340 S &nbsp;&nbsp;0.0 &nbsp;&nbsp;0.0 &nbsp;&nbsp;0:00.00 sleep<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 sv &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20 &nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 Z &nbsp;&nbsp;0.0 &nbsp;&nbsp;0.0 &nbsp;&nbsp;0:00.00 sleep<br>
# Cột tùy chọn và sắp xếp: 3 tiến trình dùng nhiều RAM nhất<br>
$ ps -eo pid,rss,comm --sort=-rss | head -n 4<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;RSS COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;14 42264 node<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;49 &nbsp;3956 ps<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1 &nbsp;3620 bash<br>
$ kill %1 %2 %3</div>
<ul>
<li><code>ps -eo pid,ppid,stat,ni,comm</code>: <code>-e</code> mọi tiến trình, <code>-o</code> các cột <em>bạn</em> chọn (ổn định hơn <code>ps aux</code>, bố cục của nó bạn phân tích bằng rủi ro của mình). PID 1 ở đây là <code>bash</code> vì container khởi động lab như tiến trình đầu tiên; trên server thật nó là <code>systemd</code> (hoặc <code>init</code>), tổ tiên của mọi thứ. Mọi tiến trình khác có một cha (<code>PPID</code>): tiến trình đã gọi <code>fork()</code> (Lab 3).</li>
<li><strong>Chữ trạng thái</strong> (cột STAT): <code>S</code> ngủ (chờ một sự kiện — đa số tiến trình, phần lớn thời gian), <code>R</code> đang chạy hoặc sẵn sàng chạy, <code>T</code> bị tín hiệu dừng, <code>D</code> ngủ không ngắt được (thường là I/O đĩa; không giết được, và được tính vào load average), <code>Z</code> zombie. Ký tự phụ: <code>s</code> trưởng phiên, <code>l</code> đa luồng (<code>node</code> hiện <code>Sl</code>), <code>+</code> foreground, <code>&lt;</code>/<code>N</code> ưu tiên cao/thấp.</li>
<li><strong>Zombie.</strong> <code>bash -c 'sleep 0.2 &amp; exec sleep 300'</code> fork một con (dòng <code>Z</code>) thoát sau 0,2 s; rồi shell <em>tự thay mình</em> bằng <code>sleep 300</code> (<code>PPID</code> của zombie), chương trình không bao giờ gọi <code>wait()</code>. Cấu trúc của con vẫn nằm trong bảng với trạng thái <code>Z</code>, giữ đúng thứ duy nhất cha có thể còn cần: mã thoát của nó (Chương 2; ⭐ CS.1 bài 3). Zombie không dùng CPU hay bộ nhớ — nhưng một vụ <em>rò</em> zombie làm đầy bảng PID. Bạn không giết được zombie; bạn sửa hoặc giết <strong>cha</strong> của nó (rồi PID 1 nhận nuôi và thu dọn).</li>
<li><code>pstree -p 1</code> vẽ cùng các liên kết cha–con thành cây và hiện <strong>luồng</strong> trong ngoặc nhọn: Node có 6 luồng phụ (luồng V8 và luồng worker của libuv). Dùng nó để trả lời "tiến trình này đã sinh ra gì?".</li>
<li><code>top -b -n 1</code> là <code>top</code> không có màn hình tương tác: một khung hình, an toàn trong script và log. Các dòng đầu: giờ và <em>uptime</em>; <code>load average</code> (1, 5, 15 phút; xem Bài 4); số tiến trình theo trạng thái (ở đây 1 zombie); dòng <code>%Cpu</code> (us người dùng, sy nhân, id rảnh, wa chờ I/O, st bị hypervisor lấy mất — ta bỏ dòng này vì cột của nó đổi độ rộng); bộ nhớ và swap. Phím tương tác trên terminal thật: <kbd>M</kbd> sắp xếp theo bộ nhớ, <kbd>P</kbd> theo CPU, <kbd>1</kbd> theo từng CPU, <kbd>k</kbd> giết, <kbd>q</kbd> thoát. <strong>Load average hiện ở đây là của máy chủ Docker</strong>, không phải của container này — xem Bài 4.</li>
<li><code>ps -eo pid,rss,comm --sort=-rss | head</code> = kẻ dùng nhiều bộ nhớ nhất đứng đầu. <code>RSS</code> (resident set size, KiB) là RAM thật sự đang dùng; <code>VIRT/VSZ</code> là không gian địa chỉ đã hứa (Bài 3). 42 MiB của Node là cỡ điển hình của một dịch vụ rỗng.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 2 — what exactly is process 1234? (20 min)</h3>
<p><strong>Situation.</strong> A Node API is running; you know only its PID. Without opening the source, answer from <code>/proc/PID</code>: its short name, its full command line, which program file it runs and in which folder, its state and threads and resident memory, the environment variables it was started with (<code>PORT</code>, <code>APP_ENV</code>), whether the <code>Threads</code> number equals what the file system shows, and what happens to the directory when the process dies.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 2: one process, seen through /proc/PID<br>
$ cd ~/svc<br>
$ PORT=4000 APP_ENV=staging node server.js &amp;<br>
$ sleep 1<br>
$ P=$(jobs -p %1)<br>
# Who is it?<br>
$ cat /proc/$P/comm<br>
my-api<br>
$ tr '\\0' ' ' &lt; /proc/$P/cmdline; echo<br>
my-api<br>
$ readlink /proc/$P/exe | sed 's|.*/||'<br>
node<br>
$ readlink /proc/$P/cwd | sed 's|.*/||'<br>
svc<br>
# What does it hold? (status = the human-readable summary)<br>
$ grep -E '^(Name|State|Threads|VmRSS|Uid)' /proc/$P/status<br>
Name:	my-api<br>
State:	S (sleeping)<br>
Uid:	1000	1000	1000	1000<br>
VmRSS:	 &nbsp;&nbsp;45032 kB<br>
Threads:	7<br>
# The environment it was started with (NUL-separated)<br>
$ tr '\\0' '\\n' &lt; /proc/$P/environ | grep -E '^(PORT|APP_ENV)='<br>
PORT=4000<br>
APP_ENV=staging<br>
# Threads are directories under task/<br>
$ [ "$(grep '^Threads' /proc/$P/status | awk '{print $2}')" = "$(ls /proc/$P/task | wc -l)" ] &amp;&amp; echo "Threads field == number of entries in /proc/$P/task"<br>
Threads field == number of entries in /proc/17/task<br>
# Same data from the stat file: field 3 is the state, 4 the parent<br>
$ awk '{print "state:", $3, " &nbsp;ppid is my shell:", ($4 == '"$$"' ? "yes" : "no")}' /proc/$P/stat<br>
state: S &nbsp;&nbsp;ppid is my shell: yes<br>
# A process can read ITS OWN /proc entry<br>
$ readlink /proc/self; readlink /proc/self<br>
64<br>
65<br>
$ echo "my shell is $$ - each reader sees its own PID"<br>
my shell is 1 - each reader sees its own PID<br>
# After it dies the directory disappears<br>
$ kill $P; wait $P 2&gt;/dev/null<br>
$ ls /proc/$P 2&gt;&amp;1 | head -n 1<br>
ls: cannot access '/proc/17': No such file or directory</div>
<ul>
<li><strong><code>/proc</code> is not a disk.</strong> It is a virtual file system the kernel generates on demand: each number-named directory is a live process, and each "file" is a window onto the kernel's data structure for it (Chapter 4: everything is a file). Reading costs a system call; nothing is stored. That is why <code>ps</code>, <code>top</code>, <code>free</code> and <code>lsof</code> are tiny programs that only read and format <code>/proc</code> (lesson 7.1).</li>
<li><code>comm</code> = short name (15 characters); <code>cmdline</code> = the arguments, separated by <code>NUL</code> bytes (so we convert with <code>tr '\\0' ' '</code>). <strong>Here both say <code>my-api</code>, not <code>node server.js</code>:</strong> the program set <code>process.title</code>, which overwrites its own <code>argv</code> memory — a process can lie about its name and command line. The honest witnesses are <code>/proc/PID/exe</code> (a symlink to the real binary: <code>node</code>) and <code>cwd</code> (its working directory: <code>svc</code>). When a name looks wrong in <code>ps</code>, check <code>exe</code>.</li>
<li><code>status</code> is the human-readable summary: <code>State: S (sleeping)</code>, <code>Uid</code> (real, effective, saved, filesystem: 1000 = user <code>sv</code>), <code>Threads</code>, <code>VmRSS</code> (resident, ≈ 45 MB). Others worth knowing: <code>VmSize</code> (virtual), <code>VmPeak</code>, <code>VmSwap</code>, <code>voluntary_ctxt_switches</code> (the process gave up the CPU to wait — healthy) versus <code>nonvoluntary_ctxt_switches</code> (the scheduler preempted it — a hint of CPU contention), <code>SigCgt</code> (caught signals).</li>
<li><code>environ</code> shows the environment <em>at start</em> — also NUL-separated. It is the quickest way to check "which <code>PORT</code> / <code>DATABASE_URL</code> did production actually start with?" (and a reason to restrict who may read <code>/proc/PID/environ</code>: secrets live there; only the owner and root can).</li>
<li><code>task/</code> has one directory per thread (7, matching <code>Threads: 7</code>); in a multithreaded server, <code>top -H</code> or <code>ps -L</code> lists them individually.</li>
<li>In <code>/proc/PID/stat</code> everything is on one line, fields separated by spaces — field 3 is the state, 4 the parent PID (here our shell, PID 1, so "yes"). <strong>Warning:</strong> field 2 is the name in parentheses and can contain spaces, so "field 22" is wrong for names like <code>(Web Content)</code>; strip up to the last <code>)</code> first (the Big Project does).</li>
<li>Two readers see different <code>/proc/self</code>: it always means "the process that is reading". After the process ended, <code>/proc/PID</code> vanished — the kernel keeps nothing about a dead process (except the zombie entry of Exercise 1).</li>
</ul>
</details>`,
    `<h3>🧪 Bài 2 — tiến trình 1234 chính xác là gì? (20 phút)</h3>
<p><strong>Tình huống.</strong> Một API Node đang chạy; bạn chỉ biết PID của nó. Không mở mã nguồn, hãy trả lời từ <code>/proc/PID</code>: tên ngắn, dòng lệnh đầy đủ, tệp chương trình nó đang chạy và trong thư mục nào, trạng thái, số luồng và bộ nhớ thường trú, các biến môi trường lúc khởi động (<code>PORT</code>, <code>APP_ENV</code>), con số <code>Threads</code> có bằng những gì hệ thống tệp cho thấy không, và điều gì xảy ra với thư mục khi tiến trình chết.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 2: một tiến trình, nhìn qua /proc/PID<br>
$ cd ~/svc<br>
$ PORT=4000 APP_ENV=staging node server.js &amp;<br>
$ sleep 1<br>
$ P=$(jobs -p %1)<br>
# Nó là ai?<br>
$ cat /proc/$P/comm<br>
my-api<br>
$ tr '\\0' ' ' &lt; /proc/$P/cmdline; echo<br>
my-api<br>
$ readlink /proc/$P/exe | sed 's|.*/||'<br>
node<br>
$ readlink /proc/$P/cwd | sed 's|.*/||'<br>
svc<br>
# Nó giữ gì? (status = bản tóm tắt cho người đọc)<br>
$ grep -E '^(Name|State|Threads|VmRSS|Uid)' /proc/$P/status<br>
Name:	my-api<br>
State:	S (sleeping)<br>
Uid:	1000	1000	1000	1000<br>
VmRSS:	 &nbsp;&nbsp;45032 kB<br>
Threads:	7<br>
# Môi trường lúc nó được khởi động (ngăn cách bằng NUL)<br>
$ tr '\\0' '\\n' &lt; /proc/$P/environ | grep -E '^(PORT|APP_ENV)='<br>
PORT=4000<br>
APP_ENV=staging<br>
# Mỗi luồng là một thư mục dưới task/<br>
$ [ "$(grep '^Threads' /proc/$P/status | awk '{print $2}')" = "$(ls /proc/$P/task | wc -l)" ] &amp;&amp; echo "Threads field == number of entries in /proc/$P/task"<br>
Threads field == number of entries in /proc/17/task<br>
# Cùng dữ liệu từ tệp stat: trường 3 là trạng thái, 4 là cha<br>
$ awk '{print "state:", $3, " &nbsp;ppid is my shell:", ($4 == '"$$"' ? "yes" : "no")}' /proc/$P/stat<br>
state: S &nbsp;&nbsp;ppid is my shell: yes<br>
# Tiến trình đọc được mục /proc CỦA CHÍNH NÓ<br>
$ readlink /proc/self; readlink /proc/self<br>
64<br>
65<br>
$ echo "my shell is $$ - each reader sees its own PID"<br>
my shell is 1 - each reader sees its own PID<br>
# Khi nó chết, thư mục biến mất<br>
$ kill $P; wait $P 2&gt;/dev/null<br>
$ ls /proc/$P 2&gt;&amp;1 | head -n 1<br>
ls: cannot access '/proc/17': No such file or directory</div>
<ul>
<li><strong><code>/proc</code> không phải đĩa.</strong> Nó là hệ thống tệp ảo do nhân sinh ra theo yêu cầu: mỗi thư mục tên là số là một tiến trình đang sống, và mỗi "tệp" là một ô cửa nhìn vào cấu trúc dữ liệu của nhân về nó (Chương 4: mọi thứ là tệp). Đọc tốn một lời gọi hệ thống; không có gì được lưu. Vì thế <code>ps</code>, <code>top</code>, <code>free</code> và <code>lsof</code> là những chương trình nhỏ chỉ đọc rồi định dạng <code>/proc</code> (bài 7.1).</li>
<li><code>comm</code> = tên ngắn (15 ký tự); <code>cmdline</code> = các đối số, cách nhau bằng byte <code>NUL</code> (nên ta đổi bằng <code>tr '\\0' ' '</code>). <strong>Ở đây cả hai đều ghi <code>my-api</code>, không phải <code>node server.js</code>:</strong> chương trình đã đặt <code>process.title</code>, ghi đè vùng nhớ <code>argv</code> của chính nó — một tiến trình có thể nói dối về tên và dòng lệnh. Nhân chứng trung thực là <code>/proc/PID/exe</code> (liên kết tới tệp nhị phân thật: <code>node</code>) và <code>cwd</code> (thư mục làm việc: <code>svc</code>). Khi tên trong <code>ps</code> trông sai, hãy kiểm tra <code>exe</code>.</li>
<li><code>status</code> là bản tóm tắt cho người đọc: <code>State: S (sleeping)</code>, <code>Uid</code> (thật, hiệu lực, đã lưu, hệ thống tệp: 1000 = người dùng <code>sv</code>), <code>Threads</code>, <code>VmRSS</code> (thường trú, ≈ 45 MB). Những trường đáng biết khác: <code>VmSize</code> (ảo), <code>VmPeak</code>, <code>VmSwap</code>, <code>voluntary_ctxt_switches</code> (tiến trình tự nhường CPU để chờ — lành mạnh) so với <code>nonvoluntary_ctxt_switches</code> (bộ lập lịch cưỡng đoạt — gợi ý tranh chấp CPU), <code>SigCgt</code> (tín hiệu đã bắt).</li>
<li><code>environ</code> cho thấy môi trường <em>lúc khởi động</em> — cũng cách nhau bằng NUL. Đó là cách nhanh nhất để kiểm tra "production thật sự khởi động với <code>PORT</code> / <code>DATABASE_URL</code> nào?" (và là lý do hạn chế ai đọc được <code>/proc/PID/environ</code>: bí mật nằm ở đó; chỉ chủ và root đọc được).</li>
<li><code>task/</code> có một thư mục cho mỗi luồng (7, khớp với <code>Threads: 7</code>); với server đa luồng, <code>top -H</code> hay <code>ps -L</code> liệt kê từng luồng.</li>
<li>Trong <code>/proc/PID/stat</code> mọi thứ nằm trên một dòng, các trường cách nhau bằng dấu cách — trường 3 là trạng thái, trường 4 là PID cha (ở đây là shell của ta, PID 1, nên "yes"). <strong>Cảnh báo:</strong> trường 2 là tên trong ngoặc tròn và có thể chứa dấu cách, nên "trường 22" sai với tên kiểu <code>(Web Content)</code>; hãy cắt tới dấu <code>)</code> cuối cùng trước (Bài tập lớn làm vậy).</li>
<li>Hai người đọc thấy <code>/proc/self</code> khác nhau: nó luôn nghĩa là "tiến trình đang đọc". Sau khi tiến trình kết thúc, <code>/proc/PID</code> biến mất — nhân không giữ gì về một tiến trình đã chết (trừ mục zombie ở Bài 1).</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 3 — what files and memory does it hold? (25 min)</h3>
<p><strong>Situation.</strong> (a) Open a file for reading on fd 3 and one for writing on fd 4 in your own shell; list <code>/proc/$$/fd</code> and explain every line; find the read offset in <code>fdinfo</code>; read the open-files limit. (b) Write a C program that prints the interesting regions of its own address space from <code>/proc/self/maps</code>, then allocates 64 MiB but touches only 1 KiB, and prints how <code>VmSize</code> and <code>VmRSS</code> changed.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 3a: every open file of a process is a link in /proc/PID/fd<br>
$ echo "line 1" &gt; data.txt<br>
$ exec 3&lt; data.txt<br>
$ exec 4&gt; out.txt<br>
$ ls -l /proc/$$/fd | awk 'NR&gt;1 &amp;&amp; $9 ~ /^[0-9]+$/ {print $9, $10, $11}' | sed 's|/home/sv/||' | sort -n | head -n 6<br>
0 -&gt; pipe:[9691760]<br>
1 -&gt; pipe:[9691761]<br>
2 -&gt; pipe:[9691761]<br>
3 -&gt; data.txt<br>
4 -&gt; out.txt<br>
255 -&gt; /usr/local/bin/phien<br>
$ read -r first &lt;&amp;3; echo "read through fd 3: $first"<br>
read through fd 3: line 1<br>
$ grep -E '^(pos|flags)' /proc/$$/fdinfo/3<br>
pos:	7<br>
flags:	0400000<br>
# Why "Too many open files" happens: count what a process holds, compare with the limit<br>
$ grep 'Max open files' /proc/$$/limits | awk '{print "soft limit:", $4, " hard limit:", $5}'<br>
soft limit: 1048576 &nbsp;hard limit: 1048576<br>
$ exec 3&lt;&amp;- 4&gt;&amp;-<br>
$ ls /proc/$$/fd | awk '$1 == 3 || $1 == 4' | wc -l<br>
0</div>
<pre><code class="language-c">// Exercise 3b: the address space of a running program, from /proc/self/maps
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;

static long vm_size_kb(void) {            // VmSize from /proc/self/status
    FILE *f = fopen("/proc/self/status", "r");
    char line[256]; long kb = -1;
    while (fgets(line, sizeof line, f)) if (sscanf(line, "VmSize: %ld kB", &amp;kb) == 1) break;
    fclose(f);
    return kb;
}

static long vm_rss_kb(void) {
    FILE *f = fopen("/proc/self/status", "r");
    char line[256]; long kb = -1;
    while (fgets(line, sizeof line, f)) if (sscanf(line, "VmRSS: %ld kB", &amp;kb) == 1) break;
    fclose(f);
    return kb;
}

static void show_regions(const char *title) {
    printf("%s\\n", title);
    FILE *f = fopen("/proc/self/maps", "r");
    char line[512];
    while (fgets(line, sizeof line, f)) {
        char range[64], perms[8], offset[32], dev[16], path[256] = "";
        long inode;
        if (sscanf(line, "%63s %7s %31s %15s %ld %255[^\\n]", range, perms, offset, dev, &amp;inode, path) &lt; 5) continue;
        if (strstr(path, "[heap]") || strstr(path, "[stack]") || strstr(path, "maps") || strstr(path, "libc.so"))
            printf("  %s %s %s\\n", perms, strstr(path, "libc.so") ? "libc.so.6" : path, "");
        else if (strstr(path, "bai3b")) printf("  %s %s\\n", perms, "bai3b-maps (this program)");
    }
    fclose(f);
}

int main(void) {
    show_regions("regions of this process:");
    long before = vm_size_kb();
    char *big = malloc(64L * 1024 * 1024);           // big requests are served by mmap(), not by the heap
    long after = vm_size_kb();
    long rss_before = vm_rss_kb();
    memset(big, 1, 1024);
    long rss_after = vm_rss_kb();                            // touch only 1 KiB: the rest is not in RAM yet
    printf("VmSize grew by 64 MiB: %s\\n", (after - before) &gt;= 65536 &amp;&amp; (after - before) &lt;= 65600 ? "yes" : "no");
    printf("touched only 1 KiB, so VmRSS grew by less than 1 MiB: %s\\n", (rss_after - rss_before) &lt; 1024 ? "yes" : "no");
    free(big);
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--security-opt=seccomp=unconfined</code> — see the ⭐ lesson "Setting up Linux".</p>
<pre><code class="language-c">// Exercise 3b: the address space of a running program, from /proc/self/maps
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;

static long vm_size_kb(void) {            // VmSize from /proc/self/status
    FILE *f = fopen("/proc/self/status", "r");
    char line[256]; long kb = -1;
    while (fgets(line, sizeof line, f)) if (sscanf(line, "VmSize: %ld kB", &amp;kb) == 1) break;
    fclose(f);
    return kb;
}

static long vm_rss_kb(void) {
    FILE *f = fopen("/proc/self/status", "r");
    char line[256]; long kb = -1;
    while (fgets(line, sizeof line, f)) if (sscanf(line, "VmRSS: %ld kB", &amp;kb) == 1) break;
    fclose(f);
    return kb;
}

static void show_regions(const char *title) {
    printf("%s\\n", title);
    FILE *f = fopen("/proc/self/maps", "r");
    char line[512];
    while (fgets(line, sizeof line, f)) {
        char range[64], perms[8], offset[32], dev[16], path[256] = "";
        long inode;
        if (sscanf(line, "%63s %7s %31s %15s %ld %255[^\\n]", range, perms, offset, dev, &amp;inode, path) &lt; 5) continue;
        if (strstr(path, "[heap]") || strstr(path, "[stack]") || strstr(path, "maps") || strstr(path, "libc.so"))
            printf("  %s %s %s\\n", perms, strstr(path, "libc.so") ? "libc.so.6" : path, "");
        else if (strstr(path, "bai3b")) printf("  %s %s\\n", perms, "bai3b-maps (this program)");
    }
    fclose(f);
}

int main(void) {
    show_regions("regions of this process:");
    long before = vm_size_kb();
    char *big = malloc(64L * 1024 * 1024);           // big requests are served by mmap(), not by the heap
    long after = vm_size_kb();
    long rss_before = vm_rss_kb();
    memset(big, 1, 1024);
    long rss_after = vm_rss_kb();                            // touch only 1 KiB: the rest is not in RAM yet
    printf("VmSize grew by 64 MiB: %s\\n", (after - before) &gt;= 65536 &amp;&amp; (after - before) &lt;= 65600 ? "yes" : "no");
    printf("touched only 1 KiB, so VmRSS grew by less than 1 MiB: %s\\n", (rss_after - rss_before) &lt; 1024 ? "yes" : "no");
    free(big);
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--security-opt=seccomp=unconfined</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread bai3b-maps.c -o bai3b-maps &amp;&amp; ./bai3b-maps<br>
regions of this process:<br>
&nbsp;&nbsp;r-xp /w/bai3b-maps<br>
&nbsp;&nbsp;r--p /w/bai3b-maps<br>
&nbsp;&nbsp;rw-p /w/bai3b-maps<br>
&nbsp;&nbsp;rw-p [heap]<br>
&nbsp;&nbsp;r-xp libc.so.6<br>
&nbsp;&nbsp;---p libc.so.6<br>
&nbsp;&nbsp;r--p libc.so.6<br>
&nbsp;&nbsp;rw-p libc.so.6<br>
&nbsp;&nbsp;rw-p [stack]<br>
VmSize grew by 64 MiB: yes<br>
touched only 1 KiB, so VmRSS grew by less than 1 MiB: yes</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<ul>
<li>Each entry of <code>/proc/PID/fd</code> is a symlink named by the fd number. Targets: <code>pipe:[…]</code> — a pipe (here stdin/stdout/stderr of the lab are pipes, because the runner captures output; in a terminal you would see <code>/dev/pts/0</code>), the inode number is the pipe's identity; <code>socket:[…]</code> would be a network connection (⭐ CS.2 exercise 4 matches these inode numbers with <code>ss</code>); a plain path for files (<code>data.txt</code>, <code>out.txt</code>); fd 255 is bash's private copy of the script. <code>exec 3&lt; file</code> opens an fd in the shell itself; <code>&lt;&amp;3</code> reads through it.</li>
<li><code>fdinfo/3</code> shows <code>pos: 7</code>: the current offset after we read one 7-byte line ("line 1\\n"). The offset lives in the <em>open file description</em>, not in the file (⭐ CS.2 exercise 2). <code>flags</code> are the open flags in octal.</li>
<li><code>limits</code>: "Max open files" soft/hard = the per-process fd ceiling (1 048 576 in this container; on many distributions the default soft limit is 1024 — a classic cause of <code>Too many open files</code>). When you suspect a leak, compare <code>ls /proc/PID/fd | wc -l</code> with this number (the Big Project automates it).</li>
<li><strong>Memory map.</strong> Each line of <code>maps</code> is a region: address range, permissions <code>r</code>ead <code>w</code>rite e<code>x</code>ecute <code>p</code>rivate, offset, device, inode, name. The program shows: its own code <code>r-xp</code> (readable, executable, not writable — code), constants <code>r--p</code>, data <code>rw-p</code>; <code>[heap]</code> (grown by <code>brk</code>, small <code>malloc</code>s); <code>libc.so.6</code> mapped four times (code, guard <code>---p</code>, read-only data, data) — shared libraries are mapped once in RAM and shared by all processes; <code>[stack]</code>. Addresses vary on every run (ASLR, Chapter 9) — compare names and permissions, not numbers.</li>
<li><strong>Virtual versus resident.</strong> <code>malloc(64 MiB)</code> made <code>VmSize</code> grow by 64 MiB (a new anonymous region created by <code>mmap</code> — large requests do not use the heap), but touching only 1 KiB grew <code>VmRSS</code> by less than 1 MiB: the kernel hands out real pages only on first touch (demand paging, Chapter 3). That is why a JVM can "use" 8 GB of virtual memory with 300 MB of RAM, why <code>VIRT</code> in <code>top</code> is almost useless for judging memory pressure, and why <code>RSS</code> (not VIRT) is what the OOM killer counts.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 3 — nó giữ những tệp và bộ nhớ nào? (25 phút)</h3>
<p><strong>Tình huống.</strong> (a) Mở một tệp để đọc ở fd 3 và một tệp để ghi ở fd 4 trong shell của bạn; liệt kê <code>/proc/$$/fd</code> và giải thích từng dòng; tìm vị trí đọc trong <code>fdinfo</code>; đọc giới hạn số tệp mở. (b) Viết một chương trình C in các vùng đáng chú ý trong không gian địa chỉ của chính nó từ <code>/proc/self/maps</code>, rồi cấp phát 64 MiB nhưng chỉ chạm vào 1 KiB, và in ra <code>VmSize</code> với <code>VmRSS</code> đã đổi thế nào.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 3a: mỗi tệp đang mở của tiến trình là một liên kết trong /proc/PID/fd<br>
$ echo "line 1" &gt; data.txt<br>
$ exec 3&lt; data.txt<br>
$ exec 4&gt; out.txt<br>
$ ls -l /proc/$$/fd | awk 'NR&gt;1 &amp;&amp; $9 ~ /^[0-9]+$/ {print $9, $10, $11}' | sed 's|/home/sv/||' | sort -n | head -n 6<br>
0 -&gt; pipe:[9691760]<br>
1 -&gt; pipe:[9691761]<br>
2 -&gt; pipe:[9691761]<br>
3 -&gt; data.txt<br>
4 -&gt; out.txt<br>
255 -&gt; /usr/local/bin/phien<br>
$ read -r first &lt;&amp;3; echo "read through fd 3: $first"<br>
read through fd 3: line 1<br>
$ grep -E '^(pos|flags)' /proc/$$/fdinfo/3<br>
pos:	7<br>
flags:	0400000<br>
# Vì sao có "Too many open files": đếm số tiến trình đang giữ, so với giới hạn<br>
$ grep 'Max open files' /proc/$$/limits | awk '{print "soft limit:", $4, " hard limit:", $5}'<br>
soft limit: 1048576 &nbsp;hard limit: 1048576<br>
$ exec 3&lt;&amp;- 4&gt;&amp;-<br>
$ ls /proc/$$/fd | awk '$1 == 3 || $1 == 4' | wc -l<br>
0</div>
<pre><code class="language-c">// Bài 3b: không gian địa chỉ của một chương trình đang chạy, đọc từ /proc/self/maps
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;

static long vm_size_kb(void) {            // VmSize from /proc/self/status
    FILE *f = fopen("/proc/self/status", "r");
    char line[256]; long kb = -1;
    while (fgets(line, sizeof line, f)) if (sscanf(line, "VmSize: %ld kB", &amp;kb) == 1) break;
    fclose(f);
    return kb;
}

static long vm_rss_kb(void) {
    FILE *f = fopen("/proc/self/status", "r");
    char line[256]; long kb = -1;
    while (fgets(line, sizeof line, f)) if (sscanf(line, "VmRSS: %ld kB", &amp;kb) == 1) break;
    fclose(f);
    return kb;
}

static void show_regions(const char *title) {
    printf("%s\\n", title);
    FILE *f = fopen("/proc/self/maps", "r");
    char line[512];
    while (fgets(line, sizeof line, f)) {
        char range[64], perms[8], offset[32], dev[16], path[256] = "";
        long inode;
        if (sscanf(line, "%63s %7s %31s %15s %ld %255[^\\n]", range, perms, offset, dev, &amp;inode, path) &lt; 5) continue;
        if (strstr(path, "[heap]") || strstr(path, "[stack]") || strstr(path, "maps") || strstr(path, "libc.so"))
            printf("  %s %s %s\\n", perms, strstr(path, "libc.so") ? "libc.so.6" : path, "");
        else if (strstr(path, "bai3b")) printf("  %s %s\\n", perms, "bai3b-maps (this program)");
    }
    fclose(f);
}

int main(void) {
    show_regions("regions of this process:");
    long before = vm_size_kb();
    char *big = malloc(64L * 1024 * 1024);           // big requests are served by mmap(), not by the heap
    long after = vm_size_kb();
    long rss_before = vm_rss_kb();
    memset(big, 1, 1024);
    long rss_after = vm_rss_kb();                            // touch only 1 KiB: the rest is not in RAM yet
    printf("VmSize grew by 64 MiB: %s\\n", (after - before) &gt;= 65536 &amp;&amp; (after - before) &lt;= 65600 ? "yes" : "no");
    printf("touched only 1 KiB, so VmRSS grew by less than 1 MiB: %s\\n", (rss_after - rss_before) &lt; 1024 ? "yes" : "no");
    free(big);
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--security-opt=seccomp=unconfined</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<pre><code class="language-c">// Bài 3b: không gian địa chỉ của một chương trình đang chạy, đọc từ /proc/self/maps
#include &lt;stdio.h&gt;
#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;

static long vm_size_kb(void) {            // VmSize from /proc/self/status
    FILE *f = fopen("/proc/self/status", "r");
    char line[256]; long kb = -1;
    while (fgets(line, sizeof line, f)) if (sscanf(line, "VmSize: %ld kB", &amp;kb) == 1) break;
    fclose(f);
    return kb;
}

static long vm_rss_kb(void) {
    FILE *f = fopen("/proc/self/status", "r");
    char line[256]; long kb = -1;
    while (fgets(line, sizeof line, f)) if (sscanf(line, "VmRSS: %ld kB", &amp;kb) == 1) break;
    fclose(f);
    return kb;
}

static void show_regions(const char *title) {
    printf("%s\\n", title);
    FILE *f = fopen("/proc/self/maps", "r");
    char line[512];
    while (fgets(line, sizeof line, f)) {
        char range[64], perms[8], offset[32], dev[16], path[256] = "";
        long inode;
        if (sscanf(line, "%63s %7s %31s %15s %ld %255[^\\n]", range, perms, offset, dev, &amp;inode, path) &lt; 5) continue;
        if (strstr(path, "[heap]") || strstr(path, "[stack]") || strstr(path, "maps") || strstr(path, "libc.so"))
            printf("  %s %s %s\\n", perms, strstr(path, "libc.so") ? "libc.so.6" : path, "");
        else if (strstr(path, "bai3b")) printf("  %s %s\\n", perms, "bai3b-maps (this program)");
    }
    fclose(f);
}

int main(void) {
    show_regions("regions of this process:");
    long before = vm_size_kb();
    char *big = malloc(64L * 1024 * 1024);           // big requests are served by mmap(), not by the heap
    long after = vm_size_kb();
    long rss_before = vm_rss_kb();
    memset(big, 1, 1024);
    long rss_after = vm_rss_kb();                            // touch only 1 KiB: the rest is not in RAM yet
    printf("VmSize grew by 64 MiB: %s\\n", (after - before) &gt;= 65536 &amp;&amp; (after - before) &lt;= 65600 ? "yes" : "no");
    printf("touched only 1 KiB, so VmRSS grew by less than 1 MiB: %s\\n", (rss_after - rss_before) &lt; 1024 ? "yes" : "no");
    free(big);
    return 0;
}</code></pre>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--security-opt=seccomp=unconfined</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out">$ gcc -Wall -O0 -pthread bai3b-maps.c -o bai3b-maps &amp;&amp; ./bai3b-maps<br>
regions of this process:<br>
&nbsp;&nbsp;r-xp /w/bai3b-maps<br>
&nbsp;&nbsp;r--p /w/bai3b-maps<br>
&nbsp;&nbsp;rw-p /w/bai3b-maps<br>
&nbsp;&nbsp;rw-p [heap]<br>
&nbsp;&nbsp;r-xp libc.so.6<br>
&nbsp;&nbsp;---p libc.so.6<br>
&nbsp;&nbsp;r--p libc.so.6<br>
&nbsp;&nbsp;rw-p libc.so.6<br>
&nbsp;&nbsp;rw-p [stack]<br>
VmSize grew by 64 MiB: yes<br>
touched only 1 KiB, so VmRSS grew by less than 1 MiB: yes</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<ul>
<li>Mỗi mục của <code>/proc/PID/fd</code> là một symlink mang tên là số fd. Đích: <code>pipe:[…]</code> — một ống (ở đây stdin/stdout/stderr của lab là ống, vì bộ chạy bắt output; trong terminal bạn sẽ thấy <code>/dev/pts/0</code>), số inode là danh tính của ống; <code>socket:[…]</code> sẽ là một kết nối mạng (⭐ CS.2 bài 4 ghép các số inode này với <code>ss</code>); một đường dẫn trơn cho tệp (<code>data.txt</code>, <code>out.txt</code>); fd 255 là bản sao riêng của bash cho script. <code>exec 3&lt; tệp</code> mở một fd trong chính shell; <code>&lt;&amp;3</code> đọc qua nó.</li>
<li><code>fdinfo/3</code> cho <code>pos: 7</code>: offset hiện tại sau khi ta đọc một dòng 7 byte ("line 1\\n"). Offset sống trong <em>open file description</em>, không phải trong tệp (⭐ CS.2 bài 2). <code>flags</code> là cờ mở ở dạng bát phân.</li>
<li><code>limits</code>: "Max open files" mềm/cứng = trần fd của mỗi tiến trình (1 048 576 trong container này; trên nhiều bản phân phối, giới hạn mềm mặc định là 1024 — nguyên nhân kinh điển của <code>Too many open files</code>). Khi nghi có rò rỉ, so <code>ls /proc/PID/fd | wc -l</code> với con số này (Bài tập lớn tự động hoá việc đó).</li>
<li><strong>Bản đồ bộ nhớ.</strong> Mỗi dòng của <code>maps</code> là một vùng: khoảng địa chỉ, quyền <code>r</code>ead <code>w</code>rite e<code>x</code>ecute <code>p</code>rivate, offset, thiết bị, inode, tên. Chương trình cho thấy: mã của chính nó <code>r-xp</code> (đọc, thực thi, không ghi — là mã), hằng số <code>r--p</code>, dữ liệu <code>rw-p</code>; <code>[heap]</code> (lớn lên bằng <code>brk</code>, các <code>malloc</code> nhỏ); <code>libc.so.6</code> được ánh xạ bốn lần (mã, vùng chặn <code>---p</code>, dữ liệu chỉ đọc, dữ liệu) — thư viện chia sẻ chỉ nằm một bản trong RAM và dùng chung cho mọi tiến trình; <code>[stack]</code>. Địa chỉ đổi mỗi lần chạy (ASLR, Chương 9) — so tên và quyền, không so con số.</li>
<li><strong>Ảo so với thường trú.</strong> <code>malloc(64 MiB)</code> làm <code>VmSize</code> tăng 64 MiB (một vùng vô danh mới do <code>mmap</code> tạo — yêu cầu lớn không dùng heap), nhưng chỉ chạm 1 KiB thì <code>VmRSS</code> tăng chưa tới 1 MiB: nhân chỉ cấp trang thật ở lần chạm đầu tiên (phân trang theo yêu cầu, Chương 3). Vì thế một JVM có thể "dùng" 8 GB bộ nhớ ảo với 300 MB RAM, <code>VIRT</code> trong <code>top</code> gần như vô dụng để đánh giá áp lực bộ nhớ, và <code>RSS</code> (không phải VIRT) mới là thứ OOM killer tính.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 4 — RAM, CPU and load: the machine versus the container (25 min)</h3>
<p><strong>Situation.</strong> Your service runs in a Docker container started with <code>--memory=64m</code>. A colleague runs <code>free -m</code> inside it, sees 8 GB and says "plenty of room". Prove him wrong. Show the structure of <code>/proc/meminfo</code>, prove that <code>free</code> is only a formatter, count CPUs from two sources, read <code>/proc/loadavg</code>, find the real limit in the cgroup file, and then try to use 200 MiB and see what the kernel does.</p>
<details><summary>Solution — run for real (<code>--memory=64m --memory-swap=64m</code>)</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--memory=64m --memory-swap=64m</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 4: memory and CPU facts from /proc — and a Docker trap<br>
# /proc/meminfo is "name: value kB"<br>
$ head -n 5 /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
MemFree: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3901564 kB<br>
MemAvailable: &nbsp;&nbsp;&nbsp;4887236 kB<br>
Buffers: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;142984 kB<br>
Cached: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1161568 kB<br>
# free is only a formatter of the same file<br>
$ [ "$(free -k | awk '/^Mem:/ {print $2}')" = "$(awk '/^MemTotal/ {print $2}' /proc/meminfo)" ] &amp;&amp; echo "free total == MemTotal"<br>
free total == MemTotal<br>
$ awk '/^MemFree/ {f=$2} /^MemAvailable/ {a=$2} END {print "MemAvailable &gt;= MemFree:", (a &gt;= f ? "yes" : "no")}' /proc/meminfo<br>
MemAvailable &gt;= MemFree: yes<br>
# CPUs<br>
$ nproc<br>
10<br>
$ [ "$(grep -c '^processor' /proc/cpuinfo)" = "$(nproc)" ] &amp;&amp; echo "processor entries == nproc"<br>
processor entries == nproc<br>
$ sed -n '1,/^$/p' /proc/cpuinfo | cut -d: -f1 | sed 's/[[:space:]]*$//' | grep -v '^$' | head -n 6<br>
processor<br>
BogoMIPS<br>
Features<br>
CPU implementer<br>
CPU architecture<br>
CPU variant<br>
$ uname -m<br>
aarch64<br>
# Load average: 1, 5, 15 minute averages, running/total tasks, last PID<br>
$ cat /proc/loadavg<br>
3.49 8.41 7.88 8/765 40<br>
$ awk '{print "fields:", NF}' /proc/loadavg<br>
fields: 5<br>
# THE TRAP: this container has a 64 MiB limit, but /proc/meminfo shows the HOST<br>
$ echo "limit by cgroup: $(( $(cat /sys/fs/cgroup/memory.max) / 1024 / 1024 )) MiB"<br>
limit by cgroup: 64 MiB<br>
$ awk '/^MemTotal/ {print "MemTotal says:", ($2 &gt; 65536 ? "more than 64 MiB (the host)" : "64 MiB or less")}' /proc/meminfo<br>
MemTotal says: more than 64 MiB (the host)<br>
# What the limit really does: try to use 200 MiB<br>
$ node -e 'const a = []; for (let i = 0; i &lt; 200; i++) a.push(Buffer.alloc(1024 * 1024, 1)); console.log("allocated 200 MiB")'<br>
bash: &nbsp;&nbsp;&nbsp;52 Killed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;node -e 'const a = []; for (let i = 0; i &lt; 200; i++) a.push(Buffer.alloc(1024 * 1024, 1)); console.log("allocated 200 MiB")'<br>
$ echo "exit code: $?"<br>
exit code: 137<br>
$ grep -E '^(oom_kill|oom) ' /sys/fs/cgroup/memory.events<br>
oom 1<br>
oom_kill 1</div>
<ul>
<li><code>/proc/meminfo</code> lines are <code>Name: value kB</code>. <code>MemTotal</code> = installed RAM; <code>MemFree</code> = completely unused (usually small — free RAM is wasted RAM); <strong><code>MemAvailable</code></strong> = what could be given to a new program <em>without swapping</em>, i.e. free + reclaimable caches (<code>Buffers</code>, <code>Cached</code> hold file data in the page cache, Chapter 4). <code>MemAvailable ≥ MemFree</code> always. When judging "am I short of memory?" use <code>MemAvailable</code>, not <code>MemFree</code>.</li>
<li><code>free</code> reads the same file: the totals match. Its <code>available</code> column is <code>MemAvailable</code>. <code>Swap</code> lines tell how much memory was pushed to disk; a swapping server is slow because disk is ~100 000× slower than RAM (Chapter 3).</li>
<li><strong>CPU:</strong> 10 <code>processor</code> entries in <code>/proc/cpuinfo</code> = <code>nproc</code> = 10 logical CPUs. This container is <strong>ARM64</strong>, so each entry has <code>BogoMIPS</code>, <code>Features</code>, <code>CPU implementer</code>…; on x86 you would see <code>model name</code>, <code>cpu MHz</code>, <code>flags</code>. Always parse by field name, never by line number.</li>
<li><code>/proc/loadavg</code>: <code>3.49 8.41 7.88 8/765 40</code> = load averages over 1, 5 and 15 minutes; 8 runnable out of 765 existing scheduling entities; the last PID created. <strong>Load average counts tasks that are runnable or in uninterruptible I/O wait</strong> (Exercise 1: state <code>R</code> and <code>D</code>); compare with the CPU count: load 10 on 10 CPUs is "just full", 40 on 10 CPUs is a queue. ⭐ CS.7 reads it in depth.</li>
<li><strong>THE TRAP.</strong> <code>/proc/meminfo</code>, <code>/proc/cpuinfo</code> and <code>/proc/loadavg</code> are <strong>not namespaced</strong>: inside a container they still describe the <em>host</em> (here 7.9 GB, 10 CPUs and the host's load), while the real limit is in the cgroup: <code>memory.max</code> = 64 MiB. Programs that size their pools from <code>MemTotal</code> or <code>nproc</code> (older JVMs, some Node and Python tools) over-allocate and get killed. Modern JVMs and Node read cgroup limits; in Kubernetes use the <em>limits</em>, and tools like <code>lxcfs</code> if you need <code>free</code> to tell the truth.</li>
<li><strong>What the limit does:</strong> the Node program tried to hold 200 MiB. The kernel's <strong>OOM killer</strong> (Chapter 3) killed it with <code>SIGKILL</code>: <code>Killed</code>, exit code <strong>137 = 128 + 9</strong>, and <code>memory.events</code> counted <code>oom_kill 1</code>. There is no exception, no stack trace, no log line from the program — just the code 137. When a container "dies for no reason" with 137 (or Kubernetes reports <code>OOMKilled</code>), check this file or <code>dmesg | grep -i oom</code> before looking at your code.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 4 — RAM, CPU và tải: máy so với container (25 phút)</h3>
<p><strong>Tình huống.</strong> Dịch vụ của bạn chạy trong một container Docker khởi động với <code>--memory=64m</code>. Đồng nghiệp chạy <code>free -m</code> bên trong, thấy 8 GB và nói "còn thừa chỗ". Hãy chứng minh anh ấy sai. Cho thấy cấu trúc của <code>/proc/meminfo</code>, chứng minh <code>free</code> chỉ là bộ định dạng, đếm CPU từ hai nguồn, đọc <code>/proc/loadavg</code>, tìm giới hạn thật trong tệp cgroup, rồi thử dùng 200 MiB và xem nhân làm gì.</p>
<details><summary>Lời giải — chạy thật (<code>--memory=64m --memory-swap=64m</code>)</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--memory=64m --memory-swap=64m</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 4: sự thật về RAM và CPU từ /proc — và một cái bẫy của Docker<br>
# /proc/meminfo có dạng "tên: giá trị kB"<br>
$ head -n 5 /proc/meminfo<br>
MemTotal: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;8124516 kB<br>
MemFree: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3901564 kB<br>
MemAvailable: &nbsp;&nbsp;&nbsp;4887236 kB<br>
Buffers: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;142984 kB<br>
Cached: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1161568 kB<br>
# free chỉ là bộ định dạng của chính tệp đó<br>
$ [ "$(free -k | awk '/^Mem:/ {print $2}')" = "$(awk '/^MemTotal/ {print $2}' /proc/meminfo)" ] &amp;&amp; echo "free total == MemTotal"<br>
free total == MemTotal<br>
$ awk '/^MemFree/ {f=$2} /^MemAvailable/ {a=$2} END {print "MemAvailable &gt;= MemFree:", (a &gt;= f ? "yes" : "no")}' /proc/meminfo<br>
MemAvailable &gt;= MemFree: yes<br>
# CPU<br>
$ nproc<br>
10<br>
$ [ "$(grep -c '^processor' /proc/cpuinfo)" = "$(nproc)" ] &amp;&amp; echo "processor entries == nproc"<br>
processor entries == nproc<br>
$ sed -n '1,/^$/p' /proc/cpuinfo | cut -d: -f1 | sed 's/[[:space:]]*$//' | grep -v '^$' | head -n 6<br>
processor<br>
BogoMIPS<br>
Features<br>
CPU implementer<br>
CPU architecture<br>
CPU variant<br>
$ uname -m<br>
aarch64<br>
# Tải trung bình: 1, 5, 15 phút, tiến trình chạy/tổng, PID cuối<br>
$ cat /proc/loadavg<br>
3.49 8.41 7.88 8/765 40<br>
$ awk '{print "fields:", NF}' /proc/loadavg<br>
fields: 5<br>
# CÁI BẪY: container này bị giới hạn 64 MiB, nhưng /proc/meminfo hiện RAM của MÁY CHỦ<br>
$ echo "limit by cgroup: $(( $(cat /sys/fs/cgroup/memory.max) / 1024 / 1024 )) MiB"<br>
limit by cgroup: 64 MiB<br>
$ awk '/^MemTotal/ {print "MemTotal says:", ($2 &gt; 65536 ? "more than 64 MiB (the host)" : "64 MiB or less")}' /proc/meminfo<br>
MemTotal says: more than 64 MiB (the host)<br>
# Giới hạn thật sự làm gì: thử dùng 200 MiB<br>
$ node -e 'const a = []; for (let i = 0; i &lt; 200; i++) a.push(Buffer.alloc(1024 * 1024, 1)); console.log("allocated 200 MiB")'<br>
bash: &nbsp;&nbsp;&nbsp;52 Killed &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;node -e 'const a = []; for (let i = 0; i &lt; 200; i++) a.push(Buffer.alloc(1024 * 1024, 1)); console.log("allocated 200 MiB")'<br>
$ echo "exit code: $?"<br>
exit code: 137<br>
$ grep -E '^(oom_kill|oom) ' /sys/fs/cgroup/memory.events<br>
oom 1<br>
oom_kill 1</div>
<ul>
<li>Các dòng của <code>/proc/meminfo</code> có dạng <code>Tên: giá trị kB</code>. <code>MemTotal</code> = RAM lắp đặt; <code>MemFree</code> = hoàn toàn chưa dùng (thường nhỏ — RAM rảnh là RAM lãng phí); <strong><code>MemAvailable</code></strong> = lượng có thể cấp cho một chương trình mới <em>mà không phải swap</em>, tức rảnh + bộ đệm thu hồi được (<code>Buffers</code>, <code>Cached</code> chứa dữ liệu tệp trong page cache, Chương 4). Luôn có <code>MemAvailable ≥ MemFree</code>. Khi đánh giá "mình có thiếu bộ nhớ không?" hãy dùng <code>MemAvailable</code>, không phải <code>MemFree</code>.</li>
<li><code>free</code> đọc cùng tệp đó: tổng khớp nhau. Cột <code>available</code> của nó là <code>MemAvailable</code>. Các dòng <code>Swap</code> cho biết bao nhiêu bộ nhớ đã bị đẩy xuống đĩa; server đang swap thì chậm vì đĩa chậm hơn RAM cỡ 100 000 lần (Chương 3).</li>
<li><strong>CPU:</strong> 10 mục <code>processor</code> trong <code>/proc/cpuinfo</code> = <code>nproc</code> = 10 CPU logic. Container này là <strong>ARM64</strong>, nên mỗi mục có <code>BogoMIPS</code>, <code>Features</code>, <code>CPU implementer</code>…; trên x86 bạn sẽ thấy <code>model name</code>, <code>cpu MHz</code>, <code>flags</code>. Luôn phân tích theo tên trường, không bao giờ theo số dòng.</li>
<li><code>/proc/loadavg</code>: <code>3.49 8.41 7.88 8/765 40</code> = tải trung bình 1, 5, 15 phút; 8 tiến trình sẵn sàng chạy trên tổng 765 thực thể lập lịch đang tồn tại; PID được tạo gần nhất. <strong>Load average đếm các tác vụ sẵn sàng chạy hoặc đang chờ I/O không ngắt được</strong> (Bài 1: trạng thái <code>R</code> và <code>D</code>); so với số CPU: tải 10 trên 10 CPU là "vừa đầy", 40 trên 10 CPU là có hàng đợi. ⭐ CS.7 đọc nó sâu hơn.</li>
<li><strong>CÁI BẪY.</strong> <code>/proc/meminfo</code>, <code>/proc/cpuinfo</code> và <code>/proc/loadavg</code> <strong>không bị cô lập theo namespace</strong>: trong container chúng vẫn mô tả <em>máy chủ</em> (ở đây 7,9 GB, 10 CPU và tải của máy chủ), còn giới hạn thật nằm trong cgroup: <code>memory.max</code> = 64 MiB. Chương trình tính cỡ pool từ <code>MemTotal</code> hay <code>nproc</code> (JVM cũ, vài công cụ Node và Python) sẽ cấp phát quá tay và bị giết. JVM và Node hiện đại đọc giới hạn cgroup; trong Kubernetes hãy dùng <em>limits</em>, và dùng công cụ như <code>lxcfs</code> nếu cần <code>free</code> nói đúng sự thật.</li>
<li><strong>Giới hạn làm gì:</strong> chương trình Node cố giữ 200 MiB. <strong>OOM killer</strong> của nhân (Chương 3) giết nó bằng <code>SIGKILL</code>: <code>Killed</code>, mã thoát <strong>137 = 128 + 9</strong>, và <code>memory.events</code> đếm <code>oom_kill 1</code>. Không có ngoại lệ, không có stack trace, không có dòng log nào từ chương trình — chỉ có mã 137. Khi một container "chết không rõ lý do" với 137 (hay Kubernetes báo <code>OOMKilled</code>), hãy kiểm tra tệp này hoặc <code>dmesg | grep -i oom</code> trước khi nhìn vào mã của bạn.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 5 — stop it, resume it, make it polite (25 min)</h3>
<p><strong>Situation.</strong> (a) Translate signal numbers 1, 2, 9, 15, 18, 19 to names. (b) Freeze a process, show the state letter change, resume it; test whether a PID exists without sending anything. (c) Kill by name. (d) As a normal user, start a command with lower priority, change a running process's niceness, and try to raise its priority again. (e) Does <code>nice</code> really change the CPU share? Pin two busy loops to a single CPU, one with <code>nice 0</code> and one with <code>nice 19</code>, and compare the CPU time they get in 4 seconds.</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 5: signals and priorities<br>
$ kill -l 1 2 9 15 18 19<br>
HUP<br>
INT<br>
KILL<br>
TERM<br>
CONT<br>
STOP<br>
$ sleep 300 &amp;<br>
$ P=$(jobs -p %1)<br>
$ ps -o pid,stat,ni,comm -p $P<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID STAT &nbsp;NI COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 S &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 sleep<br>
# SIGSTOP freezes, SIGCONT resumes: the state letter changes S -&gt; T -&gt; S<br>
$ kill -STOP $P<br>
$ sleep 0.2<br>
$ ps -o stat= -p $P<br>
T<br>
$ kill -CONT $P<br>
$ sleep 0.2<br>
$ ps -o stat= -p $P<br>
S<br>
# kill -0 sends nothing: it only asks "does this process exist and may I signal it?"<br>
$ kill -0 $P &amp;&amp; echo "alive and mine"<br>
alive and mine<br>
$ kill -0 99999<br>
bash: kill: (99999) - No such process<br>
# pgrep / pkill by name or pattern<br>
$ pgrep -c -x sleep<br>
1<br>
$ pkill -x sleep<br>
$ sleep 0.2<br>
$ pgrep -c -x sleep<br>
0<br>
# Niceness: -20 (greedy) .. 19 (polite). A normal user can only become MORE polite<br>
$ nice -n 10 sh -c 'ps -o ni= -p $$'<br>
&nbsp;10<br>
$ sleep 300 &amp;<br>
$ Q=$(jobs -p %1)<br>
$ renice -n 5 -p $Q<br>
58 (process ID) old priority 0, new priority 5<br>
$ ps -o pid,ni,comm -p $Q<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;NI COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;58 &nbsp;&nbsp;5 sleep<br>
$ renice -n 0 -p $Q<br>
renice: failed to set priority for 58 (process ID): Permission denied<br>
$ nice -n -5 true<br>
nice: cannot set niceness: Permission denied<br>
$ kill $Q</div>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 5 (cont.): does nice really change the CPU share? Pin two busy loops to ONE CPU<br>
$ taskset -c 0 sh -c 'while :; do :; done' &amp;<br>
$ A=$(jobs -p %1)<br>
$ taskset -c 0 nice -n 19 sh -c 'while :; do :; done' &amp;<br>
$ B=$(jobs -p %2)<br>
$ sleep 4<br>
$ ta=$(awk '{print $14 + $15}' /proc/$A/stat); tb=$(awk '{print $14 + $15}' /proc/$B/stat)<br>
$ kill $A $B<br>
$ echo "nice 0 used &nbsp;: $ta ticks of CPU"<br>
nice 0 used &nbsp;: 393 ticks of CPU<br>
$ echo "nice 19 used : $tb ticks of CPU"<br>
nice 19 used : 5 ticks of CPU<br>
$ echo "CPU time ratio (nice 0 : nice 19) is about: $(( ta / (tb + 1) )) : 1"<br>
CPU time ratio (nice 0 : nice 19) is about: 65 : 1</div>
<p class="chu-thich">🎲 This is ONE real run — run it again and the numbers (PIDs, timings, race results…) may differ; the property stated in the lesson always holds.</p>
<ul>
<li><code>kill</code> does not kill — it <strong>sends a signal</strong>; <code>kill -l N</code> converts a number to a name: 1 HUP (terminal closed / reload config), 2 INT (Ctrl-C), 9 KILL, 15 TERM (default of <code>kill</code>; "please exit"), 18 CONT, 19 STOP (these numbers are the same on x86-64 and ARM64, but a few architectures differ — use names in scripts, and <code>kill -l</code> for the truth on your machine). The Node/Docker graceful-shutdown story is about 15 versus 9 (⭐ CS.1; Lab 3 exercise 7).</li>
<li><strong>STOP/CONT:</strong> <code>kill -STOP</code> freezes a process (state <code>T</code>) without losing anything; <code>-CONT</code> resumes it (back to <code>S</code>). Useful for pausing a runaway job while you think. STOP cannot be caught or ignored.</li>
<li><code>kill -0 PID</code> sends <em>no</em> signal: it only checks that the process exists and you may signal it. The first (our own <code>sleep</code>) printed "alive and mine"; the second said <code>kill: (99999) - No such process</code>. The exit code is what scripts use (Lab 2 exercise 8).</li>
<li><code>pgrep -x NAME</code> lists PIDs by exact name (<code>-c</code> counts); <code>pkill -x NAME</code> signals them all; <code>-f</code> matches the whole command line (careful: <code>pkill -f node</code> also kills <em>your editor's</em> Node helper). Check with <code>pgrep -a</code> before you <code>pkill</code>.</li>
<li><strong>Niceness</strong> is a hint to the scheduler: −20 (greedy) … 19 (polite); default 0. <code>nice -n 10 cmd</code> starts a command politely; <code>renice -n 5 -p PID</code> changes a running one (we saw old priority 0, new priority 5). <strong>A normal user can only increase niceness</strong>: lowering it again gave <code>Permission denied</code>, and so did <code>nice -n -5</code>. Only root (or <code>CAP_SYS_NICE</code>) may be greedier. Use it for batch jobs (backups, video encoding) on a server that also serves users: <code>nice -n 19 ionice -c3 tar czf …</code>.</li>
<li><strong>It really matters under contention.</strong> With both loops pinned to one CPU (<code>taskset -c 0</code>), the nice-0 loop got 393 ticks and the nice-19 loop only 5 — about <strong>65 : 1</strong> (🎲 timing dependent; the ratio is always large). The Linux scheduler (CFS/EEVDF) gives each task a weight from its nice value (nice 0 → 1024, nice 19 → 15), so a polite process gets almost nothing while someone else wants the CPU — but runs at full speed when the CPU is idle. Without contention (separate CPUs) nice changes nothing; that is why the loops had to be pinned together.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 5 — dừng nó, cho chạy tiếp, bảo nó nhường (25 phút)</h3>
<p><strong>Tình huống.</strong> (a) Đổi số hiệu tín hiệu 1, 2, 9, 15, 18, 19 sang tên. (b) Đóng băng một tiến trình, cho thấy chữ trạng thái đổi, cho chạy tiếp; kiểm tra một PID có tồn tại không mà không gửi gì. (c) Giết theo tên. (d) Với tư cách người dùng thường, khởi động lệnh với ưu tiên thấp hơn, đổi nice của tiến trình đang chạy, và thử nâng ưu tiên lại. (e) <code>nice</code> có thật sự đổi phần CPU không? Ghim hai vòng lặp bận vào một CPU, một vòng <code>nice 0</code> và một vòng <code>nice 19</code>, rồi so thời gian CPU mỗi vòng nhận trong 4 giây.</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 5: tín hiệu và độ ưu tiên<br>
$ kill -l 1 2 9 15 18 19<br>
HUP<br>
INT<br>
KILL<br>
TERM<br>
CONT<br>
STOP<br>
$ sleep 300 &amp;<br>
$ P=$(jobs -p %1)<br>
$ ps -o pid,stat,ni,comm -p $P<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID STAT &nbsp;NI COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;13 S &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 sleep<br>
# SIGSTOP đóng băng, SIGCONT chạy tiếp: chữ trạng thái đổi S -&gt; T -&gt; S<br>
$ kill -STOP $P<br>
$ sleep 0.2<br>
$ ps -o stat= -p $P<br>
T<br>
$ kill -CONT $P<br>
$ sleep 0.2<br>
$ ps -o stat= -p $P<br>
S<br>
# kill -0 không gửi gì: chỉ hỏi "tiến trình có tồn tại và tôi có quyền gửi không?"<br>
$ kill -0 $P &amp;&amp; echo "alive and mine"<br>
alive and mine<br>
$ kill -0 99999<br>
bash: kill: (99999) - No such process<br>
# pgrep / pkill theo tên hay mẫu<br>
$ pgrep -c -x sleep<br>
1<br>
$ pkill -x sleep<br>
$ sleep 0.2<br>
$ pgrep -c -x sleep<br>
0<br>
# Nice: -20 (tham) .. 19 (nhường). Người dùng thường chỉ có thể nhường THÊM<br>
$ nice -n 10 sh -c 'ps -o ni= -p $$'<br>
&nbsp;10<br>
$ sleep 300 &amp;<br>
$ Q=$(jobs -p %1)<br>
$ renice -n 5 -p $Q<br>
58 (process ID) old priority 0, new priority 5<br>
$ ps -o pid,ni,comm -p $Q<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;NI COMMAND<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;58 &nbsp;&nbsp;5 sleep<br>
$ renice -n 0 -p $Q<br>
renice: failed to set priority for 58 (process ID): Permission denied<br>
$ nice -n -5 true<br>
nice: cannot set niceness: Permission denied<br>
$ kill $Q</div>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 5 (tiếp): nice có thật sự đổi phần CPU không? Ghim hai vòng lặp bận vào MỘT CPU<br>
$ taskset -c 0 sh -c 'while :; do :; done' &amp;<br>
$ A=$(jobs -p %1)<br>
$ taskset -c 0 nice -n 19 sh -c 'while :; do :; done' &amp;<br>
$ B=$(jobs -p %2)<br>
$ sleep 4<br>
$ ta=$(awk '{print $14 + $15}' /proc/$A/stat); tb=$(awk '{print $14 + $15}' /proc/$B/stat)<br>
$ kill $A $B<br>
$ echo "nice 0 used &nbsp;: $ta ticks of CPU"<br>
nice 0 used &nbsp;: 393 ticks of CPU<br>
$ echo "nice 19 used : $tb ticks of CPU"<br>
nice 19 used : 5 ticks of CPU<br>
$ echo "CPU time ratio (nice 0 : nice 19) is about: $(( ta / (tb + 1) )) : 1"<br>
CPU time ratio (nice 0 : nice 19) is about: 65 : 1</div>
<p class="chu-thich">🎲 Đây là MỘT lần chạy thật — chạy lại, các con số (PID, thời gian, kết quả tranh chấp…) có thể khác; tính chất ghi trong bài thì luôn đúng.</p>
<ul>
<li><code>kill</code> không giết — nó <strong>gửi một tín hiệu</strong>; <code>kill -l N</code> đổi số thành tên: 1 HUP (đóng terminal / nạp lại cấu hình), 2 INT (Ctrl-C), 9 KILL, 15 TERM (mặc định của <code>kill</code>; "xin hãy thoát"), 18 CONT, 19 STOP (các số này giống nhau trên x86-64 và ARM64, nhưng vài kiến trúc khác — hãy dùng tên trong script, và <code>kill -l</code> cho sự thật của máy bạn). Câu chuyện tắt êm của Node/Docker là chuyện 15 so với 9 (⭐ CS.1; Lab 3 bài 7).</li>
<li><strong>STOP/CONT:</strong> <code>kill -STOP</code> đóng băng tiến trình (trạng thái <code>T</code>) mà không mất gì; <code>-CONT</code> cho chạy tiếp (về <code>S</code>). Hữu ích để tạm dừng một job chạy mất kiểm soát khi bạn suy nghĩ. STOP không bắt hay bỏ qua được.</li>
<li><code>kill -0 PID</code> <em>không</em> gửi tín hiệu: nó chỉ kiểm tra tiến trình tồn tại và bạn có quyền gửi. Lần đầu (<code>sleep</code> của chính ta) in "alive and mine"; lần hai báo <code>kill: (99999) - No such process</code>. Mã thoát là thứ script dùng (Lab 2 bài 8).</li>
<li><code>pgrep -x TÊN</code> liệt kê PID theo tên chính xác (<code>-c</code> đếm); <code>pkill -x TÊN</code> gửi tín hiệu cho tất cả; <code>-f</code> khớp toàn bộ dòng lệnh (cẩn thận: <code>pkill -f node</code> cũng giết cả trình hỗ trợ Node của <em>trình soạn thảo</em> bạn). Kiểm tra bằng <code>pgrep -a</code> trước khi <code>pkill</code>.</li>
<li><strong>Nice</strong> là gợi ý cho bộ lập lịch: −20 (tham) … 19 (nhường); mặc định 0. <code>nice -n 10 lệnh</code> khởi động lệnh một cách nhường nhịn; <code>renice -n 5 -p PID</code> đổi tiến trình đang chạy (ta thấy old priority 0, new priority 5). <strong>Người dùng thường chỉ tăng được nice</strong>: hạ nó xuống lại báo <code>Permission denied</code>, và <code>nice -n -5</code> cũng vậy. Chỉ root (hoặc <code>CAP_SYS_NICE</code>) mới tham hơn được. Dùng cho job theo lô (sao lưu, mã hoá video) trên server còn phục vụ người dùng: <code>nice -n 19 ionice -c3 tar czf …</code>.</li>
<li><strong>Nó thật sự quan trọng khi tranh chấp.</strong> Với cả hai vòng ghim vào một CPU (<code>taskset -c 0</code>), vòng nice 0 nhận 393 tick còn vòng nice 19 chỉ 5 — cỡ <strong>65 : 1</strong> (🎲 phụ thuộc thời gian; tỉ lệ luôn lớn). Bộ lập lịch Linux (CFS/EEVDF) cấp cho mỗi tác vụ một trọng số theo nice (nice 0 → 1024, nice 19 → 15), nên tiến trình nhường gần như không nhận gì khi có người khác muốn CPU — nhưng chạy hết tốc độ khi CPU rảnh. Không có tranh chấp (CPU tách biệt) thì nice không đổi gì; vì thế hai vòng phải bị ghim chung.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 6 — run things in the background properly (20 min)</h3>
<p><strong>Situation.</strong> Start two long jobs, list them, stop one the way <kbd>Ctrl</kbd>+<kbd>Z</kbd> does, resume it in the background, and kill both with job numbers. Then answer: what is <code>$!</code>? What happens to a background process when the shell that started it exits? How do <code>nohup</code> and <code>setsid</code> change that?</p>
<details><summary>Solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Exercise 6: job control (a script must turn it on with set -m; in a terminal it is on)<br>
$ set -m<br>
$ sleep 100 &amp;<br>
$ sleep 200 &amp;<br>
$ jobs<br>
[1]- &nbsp;Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 100 &amp;<br>
[2]+ &nbsp;Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 200 &amp;<br>
$ jobs -l | awk '{print $1, $2, $3, $4, $5}'<br>
[1]- 12 Running sleep 100<br>
[2]+ 15 Running sleep 200<br>
# Ctrl-Z asks the job to stop (SIGTSTP); SIGSTOP is the same effect that cannot be refused<br>
$ kill -STOP %1<br>
$ sleep 0.2<br>
$ jobs<br>
[1]+ &nbsp;Stopped &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 100<br>
[2]- &nbsp;Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 200 &amp;<br>
$ bg %1<br>
[1]+ sleep 100 &amp;<br>
$ sleep 0.2<br>
$ jobs<br>
[1]- &nbsp;Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 100 &amp;<br>
[2]+ &nbsp;Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 200 &amp;<br>
$ kill %1 %2<br>
[1]- &nbsp;Terminated &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 100<br>
[2]+ &nbsp;Terminated &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 200<br>
$ wait 2&gt;/dev/null<br>
$ jobs<br>
# $! is the PID of the last background command<br>
$ sleep 50 &amp; echo "last background PID is $! (same as jobs -p: $(jobs -p %1))"<br>
last background PID is 44 (same as jobs -p: 44)<br>
$ kill %1<br>
# A background child outlives its parent: it is adopted by PID 1<br>
[1]+ &nbsp;Terminated &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 50<br>
$ bash -c 'sleep 40 &amp; echo "parent shell $$ exits now"'<br>
parent shell 50 exits now<br>
$ sleep 0.3<br>
$ ps -o ppid= -p $(pgrep -x sleep) | awk '{print "its parent is now PID", $1}'<br>
its parent is now PID 1<br>
$ pkill -x sleep<br>
# nohup / setsid: detach from the terminal session<br>
$ nohup sleep 40 &gt; /dev/null 2&gt;&amp;1 &amp;<br>
$ setsid sleep 41 &amp;<br>
$ sleep 0.3<br>
$ ps -o pid,sid,pgid,comm -C sleep | awk 'NR==1 {print} NR&gt;1 {print ($2==$1 ? "own session leader" : "same session"), $4}'<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;&nbsp;SID &nbsp;&nbsp;&nbsp;PGID COMMAND<br>
same session sleep<br>
own session leader sleep<br>
$ pkill -x sleep<br>
[1]- &nbsp;Terminated &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nohup sleep 40 &gt; /dev/null 2&gt;&amp;1</div>
<ul>
<li>A <strong>job</strong> is a pipeline started by the shell. <code>cmd &amp;</code> runs it in the background; <code>jobs</code> lists them as <code>[1]- Running</code> (<code>+</code> = current job, <code>-</code> = previous); <code>%1</code> refers to job 1 in <code>kill</code>, <code>bg</code>, <code>fg</code>, <code>wait</code>. Interactive terminals have job control on; in a script you must write <code>set -m</code> (we did).</li>
<li>In a terminal: <kbd>Ctrl</kbd>+<kbd>Z</kbd> sends <code>SIGTSTP</code> to the foreground job ("stop, please"); <code>bg</code> resumes it in the background (<code>SIGCONT</code>); <code>fg</code> brings it back. Above we used <code>kill -STOP %1</code> — the same effect that a program cannot refuse; <code>jobs</code> then says <code>Stopped</code>, <code>bg %1</code> prints <code>[1]+ sleep 100 &amp;</code> and it runs again. <code>kill %1 %2</code> ended both; bash reports <code>Terminated</code>.</li>
<li><code>$!</code> = the PID of the most recent background command; <code>wait $!</code> (or <code>wait</code>) blocks until it ends and returns its exit status — the reliable way to run jobs in parallel in a script (Lab 2).</li>
<li><strong>A child can outlive its parent.</strong> The inner <code>bash -c</code> started <code>sleep 40</code> and exited at once. The <code>sleep</code> was not killed: the kernel re-parented it to PID 1 ("its parent is now PID 1") — the <em>init adoption</em> that also reaps zombies. That is how daemons are born. (If the <em>terminal</em> closes, the kernel sends <code>SIGHUP</code> to the session's jobs, which kills them — hence <code>nohup</code>.)</li>
<li><code>nohup cmd &amp;</code> makes the process ignore <code>SIGHUP</code> and redirects its output (to <code>nohup.out</code> by default), so closing the SSH session does not kill it. <code>setsid cmd</code> starts it in a <strong>new session</strong> with no controlling terminal: the table shows <code>own session leader</code> (SID equals PID) for the <code>setsid</code> process and <code>same session</code> for the other. Both are poor-man's daemons; the right tool on a modern server is a service manager (Exercise 7) or <code>tmux</code>/<code>screen</code> for interactive work.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 6 — chạy việc nền cho đúng (20 phút)</h3>
<p><strong>Tình huống.</strong> Khởi động hai job dài, liệt kê chúng, dừng một job theo kiểu <kbd>Ctrl</kbd>+<kbd>Z</kbd>, cho chạy tiếp ở nền, rồi giết cả hai bằng số job. Sau đó trả lời: <code>$!</code> là gì? Điều gì xảy ra với một tiến trình nền khi shell đã khởi động nó thoát? <code>nohup</code> và <code>setsid</code> thay đổi điều đó thế nào?</p>
<details><summary>Lời giải — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài 6: điều khiển job (script phải bật bằng set -m; trong terminal nó có sẵn)<br>
$ set -m<br>
$ sleep 100 &amp;<br>
$ sleep 200 &amp;<br>
$ jobs<br>
[1]- &nbsp;Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 100 &amp;<br>
[2]+ &nbsp;Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 200 &amp;<br>
$ jobs -l | awk '{print $1, $2, $3, $4, $5}'<br>
[1]- 12 Running sleep 100<br>
[2]+ 15 Running sleep 200<br>
# Ctrl-Z yêu cầu job dừng (SIGTSTP); SIGSTOP có tác dụng giống nhưng không thể từ chối<br>
$ kill -STOP %1<br>
$ sleep 0.2<br>
$ jobs<br>
[1]+ &nbsp;Stopped &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 100<br>
[2]- &nbsp;Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 200 &amp;<br>
$ bg %1<br>
[1]+ sleep 100 &amp;<br>
$ sleep 0.2<br>
$ jobs<br>
[1]- &nbsp;Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 100 &amp;<br>
[2]+ &nbsp;Running &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 200 &amp;<br>
$ kill %1 %2<br>
[1]- &nbsp;Terminated &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 100<br>
[2]+ &nbsp;Terminated &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 200<br>
$ wait 2&gt;/dev/null<br>
$ jobs<br>
# $! là PID của lệnh nền cuối cùng<br>
$ sleep 50 &amp; echo "last background PID is $! (same as jobs -p: $(jobs -p %1))"<br>
last background PID is 44 (same as jobs -p: 44)<br>
$ kill %1<br>
# Tiến trình nền sống lâu hơn cha: được PID 1 nhận nuôi<br>
[1]+ &nbsp;Terminated &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sleep 50<br>
$ bash -c 'sleep 40 &amp; echo "parent shell $$ exits now"'<br>
parent shell 50 exits now<br>
$ sleep 0.3<br>
$ ps -o ppid= -p $(pgrep -x sleep) | awk '{print "its parent is now PID", $1}'<br>
its parent is now PID 1<br>
$ pkill -x sleep<br>
# nohup / setsid: tách khỏi phiên terminal<br>
$ nohup sleep 40 &gt; /dev/null 2&gt;&amp;1 &amp;<br>
$ setsid sleep 41 &amp;<br>
$ sleep 0.3<br>
$ ps -o pid,sid,pgid,comm -C sleep | awk 'NR==1 {print} NR&gt;1 {print ($2==$1 ? "own session leader" : "same session"), $4}'<br>
&nbsp;&nbsp;&nbsp;&nbsp;PID &nbsp;&nbsp;&nbsp;&nbsp;SID &nbsp;&nbsp;&nbsp;PGID COMMAND<br>
same session sleep<br>
own session leader sleep<br>
$ pkill -x sleep<br>
[1]- &nbsp;Terminated &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nohup sleep 40 &gt; /dev/null 2&gt;&amp;1</div>
<ul>
<li>Một <strong>job</strong> là một pipeline do shell khởi động. <code>lệnh &amp;</code> chạy nó ở nền; <code>jobs</code> liệt kê dạng <code>[1]- Running</code> (<code>+</code> = job hiện tại, <code>-</code> = job trước); <code>%1</code> chỉ job 1 trong <code>kill</code>, <code>bg</code>, <code>fg</code>, <code>wait</code>. Terminal tương tác có sẵn điều khiển job; trong script bạn phải viết <code>set -m</code> (ta đã làm).</li>
<li>Trong terminal: <kbd>Ctrl</kbd>+<kbd>Z</kbd> gửi <code>SIGTSTP</code> cho job foreground ("dừng đi nhé"); <code>bg</code> cho chạy tiếp ở nền (<code>SIGCONT</code>); <code>fg</code> đưa nó trở lại. Ở trên ta dùng <code>kill -STOP %1</code> — cùng hiệu quả mà chương trình không từ chối được; <code>jobs</code> khi đó báo <code>Stopped</code>, <code>bg %1</code> in <code>[1]+ sleep 100 &amp;</code> và nó chạy lại. <code>kill %1 %2</code> kết thúc cả hai; bash báo <code>Terminated</code>.</li>
<li><code>$!</code> = PID của lệnh nền gần nhất; <code>wait $!</code> (hoặc <code>wait</code>) chặn tới khi nó xong và trả về mã thoát của nó — cách đáng tin để chạy job song song trong script (Lab 2).</li>
<li><strong>Con có thể sống lâu hơn cha.</strong> <code>bash -c</code> bên trong khởi động <code>sleep 40</code> rồi thoát ngay. <code>sleep</code> không bị giết: nhân gán lại cha của nó cho PID 1 ("its parent is now PID 1") — sự <em>nhận nuôi bởi init</em>, cũng là nơi thu dọn zombie. Daemon sinh ra như vậy. (Nếu <em>terminal</em> đóng, nhân gửi <code>SIGHUP</code> cho các job của phiên, giết chúng — vì thế có <code>nohup</code>.)</li>
<li><code>nohup lệnh &amp;</code> làm tiến trình phớt lờ <code>SIGHUP</code> và chuyển hướng output (mặc định vào <code>nohup.out</code>), nên đóng phiên SSH không giết nó. <code>setsid lệnh</code> khởi động nó trong một <strong>phiên mới</strong> không có terminal điều khiển: bảng cho thấy <code>own session leader</code> (SID bằng PID) với tiến trình <code>setsid</code> và <code>same session</code> với tiến trình kia. Cả hai là daemon "nhà làm"; công cụ đúng trên server hiện đại là trình quản lý dịch vụ (Bài 7) hoặc <code>tmux</code>/<code>screen</code> cho việc tương tác.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 7 — read a systemd unit (25 min)</h3>
<p><strong>Situation.</strong> On the VPS, your Node API is started by <strong>systemd</strong>, the service manager that is PID 1 on almost every modern distribution. You are handed <code>myapi.service</code>. Explain each line; then check whether this container has systemd (it does not — say so), lint two unit files for the mistakes that cost people a night, and reproduce by hand what systemd does before it runs <code>ExecStart</code>: switch user, set the environment, enter the working directory — and what <code>Restart=on-failure</code> means.</p>
<details><summary>Solution — run for real (no systemd here: PID 1 is <code>bash</code>, <code>systemctl</code> is not installed)</summary>
<div class="out"># Exercise 7: reading a systemd unit. This container has no systemd — and says so<br>
$ ps -p 1 -o comm=<br>
bash<br>
$ command -v systemctl || echo "systemctl: not installed here (PID 1 is not systemd)"<br>
systemctl: not installed here (PID 1 is not systemd)<br>
# A typical unit for a Node.js API<br>
$ cat &gt; myapi.service &lt;&lt;'END'<br>
&gt; [Unit]<br>
&gt; Description=My shop API<br>
&gt; After=network-online.target postgresql.service<br>
&gt; Wants=network-online.target<br>
&gt;<br>
&gt; [Service]<br>
&gt; Type=simple<br>
&gt; User=sv<br>
&gt; WorkingDirectory=/tmp/myapi<br>
&gt; Environment=NODE_ENV=production<br>
&gt; Environment=PORT=3000<br>
&gt; EnvironmentFile=-/etc/myapi.env<br>
&gt; ExecStart=/usr/local/bin/node server.js<br>
&gt; Restart=on-failure<br>
&gt; RestartSec=5<br>
&gt; LimitNOFILE=65535<br>
&gt; MemoryMax=512M<br>
&gt; UMask=0027<br>
&gt;<br>
&gt; [Install]<br>
&gt; WantedBy=multi-user.target<br>
&gt; END<br>
# A tiny linter: the mistakes that cost people a night<br>
$ cat &gt; lint-unit.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; f=$1; bad=0<br>
&gt; chk() { if ! grep -qE "$2" "$f"; then echo "WARN: $1"; bad=1; fi; }<br>
&gt; chk "no [Service] section" '^\\[Service\\]'<br>
&gt; chk "ExecStart must be an ABSOLUTE path" '^ExecStart=/'<br>
&gt; chk "no Restart= policy: a crash leaves the service dead" '^Restart='<br>
&gt; chk "no User=: the service would run as root" '^User='<br>
&gt; chk "no [Install] WantedBy=: 'enable' would do nothing" '^WantedBy='<br>
&gt; grep -E '^ExecStart=' "$f" | grep -qE 'nohup|&amp;$' &amp;&amp; { echo "WARN: do not daemonize inside ExecStart (no nohup, no &amp;)"; bad=1; }<br>
&gt; [ $bad = 0 ] &amp;&amp; echo "unit looks sane"<br>
&gt; exit $bad<br>
&gt; END<br>
$ bash lint-unit.sh myapi.service<br>
unit looks sane<br>
$ printf '[Service]\\nExecStart=node server.js &amp;\\n' &gt; bad.service<br>
$ bash lint-unit.sh bad.service<br>
WARN: ExecStart must be an ABSOLUTE path<br>
WARN: no Restart= policy: a crash leaves the service dead<br>
WARN: no User=: the service would run as root<br>
WARN: no [Install] WantedBy=: 'enable' would do nothing<br>
WARN: do not daemonize inside ExecStart (no nohup, no &amp;)<br>
# What systemd does for you, by hand: environment, user, directory, then run<br>
$ mkdir -p /tmp/myapi &amp;&amp; chown sv /tmp/myapi<br>
$ printf 'console.log("uid=" + process.getuid(), "cwd=" + process.cwd(), "NODE_ENV=" + process.env.NODE_ENV, "PORT=" + process.env.PORT, "HOME=" + (process.env.HOME || "(unset)"));\\n' &gt; /tmp/myapi/server.js<br>
$ cd /tmp/myapi<br>
$ setpriv --reuid=sv --regid=sv --clear-groups env -i NODE_ENV=production PORT=3000 PATH=/usr/local/bin:/usr/bin:/bin /usr/local/bin/node server.js<br>
uid=1000 cwd=/tmp/myapi NODE_ENV=production PORT=3000 HOME=(unset)<br>
# Restart=on-failure, by hand: exit code 0 = stop, anything else = start again after RestartSec<br>
$ printf 'const n = +process.argv[2]; console.log("run", n); process.exit(n &lt; 3 ? 1 : 0);\\n' &gt; flaky.js<br>
$ for n in 1 2 3 4; do node flaky.js $n; code=$?; [ $code = 0 ] &amp;&amp; { echo "exit 0: systemd would NOT restart"; break; } || echo "exit $code: systemd would restart in 5 s"; done<br>
run 1<br>
exit 1: systemd would restart in 5 s<br>
run 2<br>
exit 1: systemd would restart in 5 s<br>
run 3<br>
exit 0: systemd would NOT restart</div>
<p><strong>What each line of the unit means.</strong></p>
<ul>
<li><code>[Unit]</code> — metadata and ordering. <code>After=network-online.target postgresql.service</code> = start <em>after</em> those (ordering only); <code>Wants=</code> = pull the network target in (a soft dependency; <code>Requires=</code> would be a hard one).</li>
<li><code>[Service]</code> — how to run it. <code>Type=simple</code>: the process in <code>ExecStart</code> <em>is</em> the service and stays in the foreground (that is why the linter warns about <code>nohup</code>/<code>&amp;</code>: systemd wants to supervise the process itself). <code>User=sv</code> — never run an API as root. <code>WorkingDirectory=</code>, <code>Environment=</code> and <code>EnvironmentFile=-/etc/myapi.env</code> (the <code>-</code> means "not an error if the file is missing") set the process's folder and variables — the same things you saw in <code>/proc/PID/cwd</code> and <code>environ</code> (Exercise 2). <code>ExecStart=</code> must use an absolute path: systemd does <em>not</em> use your <code>$PATH</code>. <code>Restart=on-failure</code> + <code>RestartSec=5</code>: if the process exits with a non-zero code or is killed by a signal, start it again after 5 s; a clean exit 0 stops it.</li>
<li>Resource limits: <code>LimitNOFILE=65535</code> raises the fd ceiling of Exercise 3; <code>MemoryMax=512M</code> sets a cgroup memory limit — the same mechanism as Docker's <code>--memory</code> (Exercise 4: exceed it and the OOM killer ends the service, systemd restarts it). <code>UMask=0027</code> = Lab 1's umask.</li>
<li><code>[Install]</code> <code>WantedBy=multi-user.target</code>: what <code>systemctl enable</code> uses to start the service at boot. Without it, <code>enable</code> does nothing — a classic "it works after deploy but not after reboot".</li>
</ul>
<p><strong>What you would type on a real server.</strong> <code>sudo systemctl daemon-reload</code> (re-read unit files) · <code>systemctl start|stop|restart|status myapi</code> · <code>systemctl enable --now myapi</code> · <code>journalctl -u myapi -f</code> (follow its logs; <code>-n 100</code>, <code>--since "10 min ago"</code>) · <code>systemctl list-units --failed</code> · <code>systemd-analyze verify myapi.service</code> (the real linter) · <code>systemctl cat myapi</code>. <strong>After editing a unit you must run <code>daemon-reload</code></strong> or systemd keeps using the old one.</p>
<ul>
<li>The tiny linter (a few <code>grep</code>s) accepted the good unit and found five problems in a bad one: a relative <code>ExecStart</code>, no <code>Restart</code>, no <code>User</code>, no <code>[Install]</code>, and a daemonizing <code>&amp;</code>. The real <code>systemd-analyze verify</code> catches more, but the point stands: unit files are plain text you can check in a pipeline.</li>
<li>Doing by hand what systemd does: <code>setpriv --reuid=sv --regid=sv --clear-groups env -i NODE_ENV=production PORT=3000 … node server.js</code> printed <code>uid=1000 cwd=/tmp/myapi NODE_ENV=production PORT=3000 HOME=(unset)</code>. Two lessons: <code>env -i</code> starts with an <strong>empty environment</strong> — a service started by systemd (or cron) does not inherit your shell's <code>PATH</code>, <code>HOME</code> or nvm settings; every variable must be declared. "It works in my terminal but not as a service" is almost always this.</li>
<li><code>Restart=on-failure</code> by hand: the loop ran the "service" four times at most; runs 1 and 2 exited 1 → "would restart in 5 s"; run 3 exited 0 → "would NOT restart". With <code>Restart=always</code> even exit 0 restarts; with <code>StartLimitBurst</code> systemd gives up after too many quick crashes (state <code>failed</code>). Pair <code>Restart=</code> with a fix for the crash, not instead of one.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 7 — đọc một systemd unit (25 phút)</h3>
<p><strong>Tình huống.</strong> Trên VPS, API Node của bạn do <strong>systemd</strong> khởi động — trình quản lý dịch vụ là PID 1 trên gần như mọi bản phân phối hiện đại. Bạn được đưa <code>myapi.service</code>. Hãy giải thích từng dòng; rồi kiểm tra container này có systemd không (không — hãy nói thẳng), lint hai tệp unit để tìm những lỗi khiến người ta mất cả đêm, và tái hiện bằng tay việc systemd làm trước khi chạy <code>ExecStart</code>: đổi người dùng, đặt môi trường, vào thư mục làm việc — và <code>Restart=on-failure</code> nghĩa là gì.</p>
<details><summary>Lời giải — chạy thật (ở đây không có systemd: PID 1 là <code>bash</code>, <code>systemctl</code> không được cài)</summary>
<div class="out"># Bài 7: đọc một systemd unit. Container này không có systemd — và nói thẳng ra<br>
$ ps -p 1 -o comm=<br>
bash<br>
$ command -v systemctl || echo "systemctl: not installed here (PID 1 is not systemd)"<br>
systemctl: not installed here (PID 1 is not systemd)<br>
# Một unit điển hình cho API Node.js<br>
$ cat &gt; myapi.service &lt;&lt;'END'<br>
&gt; [Unit]<br>
&gt; Description=My shop API<br>
&gt; After=network-online.target postgresql.service<br>
&gt; Wants=network-online.target<br>
&gt;<br>
&gt; [Service]<br>
&gt; Type=simple<br>
&gt; User=sv<br>
&gt; WorkingDirectory=/tmp/myapi<br>
&gt; Environment=NODE_ENV=production<br>
&gt; Environment=PORT=3000<br>
&gt; EnvironmentFile=-/etc/myapi.env<br>
&gt; ExecStart=/usr/local/bin/node server.js<br>
&gt; Restart=on-failure<br>
&gt; RestartSec=5<br>
&gt; LimitNOFILE=65535<br>
&gt; MemoryMax=512M<br>
&gt; UMask=0027<br>
&gt;<br>
&gt; [Install]<br>
&gt; WantedBy=multi-user.target<br>
&gt; END<br>
# Một linter nhỏ: những lỗi khiến người ta mất cả đêm<br>
$ cat &gt; lint-unit.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; f=$1; bad=0<br>
&gt; chk() { if ! grep -qE "$2" "$f"; then echo "WARN: $1"; bad=1; fi; }<br>
&gt; chk "no [Service] section" '^\\[Service\\]'<br>
&gt; chk "ExecStart must be an ABSOLUTE path" '^ExecStart=/'<br>
&gt; chk "no Restart= policy: a crash leaves the service dead" '^Restart='<br>
&gt; chk "no User=: the service would run as root" '^User='<br>
&gt; chk "no [Install] WantedBy=: 'enable' would do nothing" '^WantedBy='<br>
&gt; grep -E '^ExecStart=' "$f" | grep -qE 'nohup|&amp;$' &amp;&amp; { echo "WARN: do not daemonize inside ExecStart (no nohup, no &amp;)"; bad=1; }<br>
&gt; [ $bad = 0 ] &amp;&amp; echo "unit looks sane"<br>
&gt; exit $bad<br>
&gt; END<br>
$ bash lint-unit.sh myapi.service<br>
unit looks sane<br>
$ printf '[Service]\\nExecStart=node server.js &amp;\\n' &gt; bad.service<br>
$ bash lint-unit.sh bad.service<br>
WARN: ExecStart must be an ABSOLUTE path<br>
WARN: no Restart= policy: a crash leaves the service dead<br>
WARN: no User=: the service would run as root<br>
WARN: no [Install] WantedBy=: 'enable' would do nothing<br>
WARN: do not daemonize inside ExecStart (no nohup, no &amp;)<br>
# Việc systemd làm thay bạn, làm bằng tay: môi trường, người dùng, thư mục, rồi chạy<br>
$ mkdir -p /tmp/myapi &amp;&amp; chown sv /tmp/myapi<br>
$ printf 'console.log("uid=" + process.getuid(), "cwd=" + process.cwd(), "NODE_ENV=" + process.env.NODE_ENV, "PORT=" + process.env.PORT, "HOME=" + (process.env.HOME || "(unset)"));\\n' &gt; /tmp/myapi/server.js<br>
$ cd /tmp/myapi<br>
$ setpriv --reuid=sv --regid=sv --clear-groups env -i NODE_ENV=production PORT=3000 PATH=/usr/local/bin:/usr/bin:/bin /usr/local/bin/node server.js<br>
uid=1000 cwd=/tmp/myapi NODE_ENV=production PORT=3000 HOME=(unset)<br>
# Restart=on-failure làm bằng tay: mã 0 = dừng, mã khác = chạy lại sau RestartSec<br>
$ printf 'const n = +process.argv[2]; console.log("run", n); process.exit(n &lt; 3 ? 1 : 0);\\n' &gt; flaky.js<br>
$ for n in 1 2 3 4; do node flaky.js $n; code=$?; [ $code = 0 ] &amp;&amp; { echo "exit 0: systemd would NOT restart"; break; } || echo "exit $code: systemd would restart in 5 s"; done<br>
run 1<br>
exit 1: systemd would restart in 5 s<br>
run 2<br>
exit 1: systemd would restart in 5 s<br>
run 3<br>
exit 0: systemd would NOT restart</div>
<p><strong>Ý nghĩa từng dòng của unit.</strong></p>
<ul>
<li><code>[Unit]</code> — siêu dữ liệu và thứ tự. <code>After=network-online.target postgresql.service</code> = khởi động <em>sau</em> chúng (chỉ là thứ tự); <code>Wants=</code> = kéo target mạng vào (phụ thuộc mềm; <code>Requires=</code> là phụ thuộc cứng).</li>
<li><code>[Service]</code> — cách chạy. <code>Type=simple</code>: tiến trình trong <code>ExecStart</code> <em>chính là</em> dịch vụ và ở foreground (vì thế linter cảnh báo <code>nohup</code>/<code>&amp;</code>: systemd muốn tự giám sát tiến trình). <code>User=sv</code> — đừng bao giờ chạy API bằng root. <code>WorkingDirectory=</code>, <code>Environment=</code> và <code>EnvironmentFile=-/etc/myapi.env</code> (dấu <code>-</code> nghĩa là "không lỗi nếu thiếu tệp") đặt thư mục và biến của tiến trình — chính những thứ bạn thấy trong <code>/proc/PID/cwd</code> và <code>environ</code> (Bài 2). <code>ExecStart=</code> phải dùng đường dẫn tuyệt đối: systemd <em>không</em> dùng <code>$PATH</code> của bạn. <code>Restart=on-failure</code> + <code>RestartSec=5</code>: nếu tiến trình thoát với mã khác 0 hoặc bị tín hiệu giết, chạy lại sau 5 s; thoát sạch với mã 0 thì dừng hẳn.</li>
<li>Giới hạn tài nguyên: <code>LimitNOFILE=65535</code> nâng trần fd của Bài 3; <code>MemoryMax=512M</code> đặt giới hạn bộ nhớ cgroup — cùng cơ chế với <code>--memory</code> của Docker (Bài 4: vượt giới hạn thì OOM killer kết thúc dịch vụ, systemd khởi động lại). <code>UMask=0027</code> = umask ở Lab 1.</li>
<li><code>[Install]</code> <code>WantedBy=multi-user.target</code>: thứ <code>systemctl enable</code> dùng để khởi động dịch vụ lúc boot. Thiếu nó, <code>enable</code> không làm gì — "sau deploy chạy được nhưng sau reboot thì không" kinh điển.</li>
</ul>
<p><strong>Thứ bạn sẽ gõ trên server thật.</strong> <code>sudo systemctl daemon-reload</code> (đọc lại tệp unit) · <code>systemctl start|stop|restart|status myapi</code> · <code>systemctl enable --now myapi</code> · <code>journalctl -u myapi -f</code> (theo dõi log; <code>-n 100</code>, <code>--since "10 min ago"</code>) · <code>systemctl list-units --failed</code> · <code>systemd-analyze verify myapi.service</code> (linter thật) · <code>systemctl cat myapi</code>. <strong>Sau khi sửa unit phải chạy <code>daemon-reload</code></strong> nếu không systemd vẫn dùng bản cũ.</p>
<ul>
<li>Linter nhỏ (vài lệnh <code>grep</code>) chấp nhận unit tốt và tìm ra năm vấn đề ở unit xấu: <code>ExecStart</code> tương đối, không có <code>Restart</code>, không có <code>User</code>, không có <code>[Install]</code>, và dấu <code>&amp;</code> biến thành daemon. <code>systemd-analyze verify</code> thật bắt được nhiều hơn, nhưng ý chính vẫn đúng: tệp unit là văn bản thuần mà bạn kiểm tra được trong pipeline.</li>
<li>Làm bằng tay việc systemd làm: <code>setpriv --reuid=sv --regid=sv --clear-groups env -i NODE_ENV=production PORT=3000 … node server.js</code> in <code>uid=1000 cwd=/tmp/myapi NODE_ENV=production PORT=3000 HOME=(unset)</code>. Hai bài học: <code>env -i</code> bắt đầu với <strong>môi trường rỗng</strong> — dịch vụ do systemd (hay cron) khởi động không thừa kế <code>PATH</code>, <code>HOME</code> hay cấu hình nvm của shell bạn; mọi biến phải được khai báo. "Chạy được trong terminal của tôi nhưng không chạy như dịch vụ" hầu như luôn là chuyện này.</li>
<li><code>Restart=on-failure</code> bằng tay: vòng lặp chạy "dịch vụ" tối đa bốn lần; lần 1 và 2 thoát 1 → "would restart in 5 s"; lần 3 thoát 0 → "would NOT restart". Với <code>Restart=always</code> ngay cả thoát 0 cũng chạy lại; với <code>StartLimitBurst</code> systemd bỏ cuộc sau quá nhiều lần sập nhanh (trạng thái <code>failed</code>). Hãy ghép <code>Restart=</code> với việc sửa lỗi sập, đừng dùng nó thay cho việc sửa.</li>
</ul>
</details>`),
    bi(`<h3>🧪 Exercise 8 — read a cron line (20 min)</h3>
<p><strong>Situation.</strong> The VPS has a crontab with lines like <code>30 3 * * *  /home/deploy/backup.sh …</code> (Lab 2 exercise 7). Cron has five time fields — <strong>minute, hour, day-of-month, month, day-of-week</strong> — followed by the command. For each of six lines, <em>predict</em> the next three run times from "now = Monday 26 Oct 2026, 10:00 UTC" before you look at the answer; then use the program to check yourself.</p>
<details><summary>Solution — run for real (no cron daemon here: the program is a small explainer that computes the schedule)</summary>
<pre class="trich"><code class="language-javascript">const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function field(text, min, max) {                 // "*/15", "1-5", "5,35", "*", "9-17/2"
    const out = new Set();
    for (const part of text.split(',')) {
        const [range, step] = part.split('/');
        let a, b;
        if (range === '*') { a = min; b = max; }
        else if (range.includes('-')) { [a, b] = range.split('-').map(Number); }
        else { a = b = Number(range); if (step) b = max; }
        for (let v = a; v &lt;= b; v += step ? Number(step) : 1) out.add(v);
    }
    return { set: out, star: text === '*' || text.startsWith('*/') };
}

function nextRuns(expr, from, count) {
    const [mi, ho, dom, mon, dow] = expr.split(/\\s+/);
    const M = field(mi, 0, 59), H = field(ho, 0, 23), D = field(dom, 1, 31), O = field(mon, 1, 12), W = field(dow, 0, 6);
    const runs = [];
    for (let t = new Date(from.getTime() + 60000); runs.length &lt; count &amp;&amp; t - from &lt; 400 * 864e5; t = new Date(t.getTime() + 60000)) {
        if (!M.set.has(t.getUTCMinutes()) || !H.set.has(t.getUTCHours()) || !O.set.has(t.getUTCMonth() + 1)) continue;
        const dayOk = D.set.has(t.getUTCDate()), wdayOk = W.set.has(t.getUTCDay());
        // the famous rule: if BOTH day-of-month and day-of-week are restricted, either one is enough (OR)
        const ok = (!D.star &amp;&amp; !W.star) ? (dayOk || wdayOk) : (dayOk &amp;&amp; wdayOk);
        if (ok) runs.push(t);
    }
    return runs;
}</code></pre>
<pre><code class="language-javascript">// Exercise 8: read cron lines — this program prints when each one will REALLY run
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function field(text, min, max) {                 // "*/15", "1-5", "5,35", "*", "9-17/2"
    const out = new Set();
    for (const part of text.split(',')) {
        const [range, step] = part.split('/');
        let a, b;
        if (range === '*') { a = min; b = max; }
        else if (range.includes('-')) { [a, b] = range.split('-').map(Number); }
        else { a = b = Number(range); if (step) b = max; }
        for (let v = a; v &lt;= b; v += step ? Number(step) : 1) out.add(v);
    }
    return { set: out, star: text === '*' || text.startsWith('*/') };
}

function nextRuns(expr, from, count) {
    const [mi, ho, dom, mon, dow] = expr.split(/\\s+/);
    const M = field(mi, 0, 59), H = field(ho, 0, 23), D = field(dom, 1, 31), O = field(mon, 1, 12), W = field(dow, 0, 6);
    const runs = [];
    for (let t = new Date(from.getTime() + 60000); runs.length &lt; count &amp;&amp; t - from &lt; 400 * 864e5; t = new Date(t.getTime() + 60000)) {
        if (!M.set.has(t.getUTCMinutes()) || !H.set.has(t.getUTCHours()) || !O.set.has(t.getUTCMonth() + 1)) continue;
        const dayOk = D.set.has(t.getUTCDate()), wdayOk = W.set.has(t.getUTCDay());
        // the famous rule: if BOTH day-of-month and day-of-week are restricted, either one is enough (OR)
        const ok = (!D.star &amp;&amp; !W.star) ? (dayOk || wdayOk) : (dayOk &amp;&amp; wdayOk);
        if (ok) runs.push(t);
    }
    return runs;
}

const from = new Date('2026-10-26T10:00:00Z');    // a Monday
console.log('now = ' + from.toISOString().slice(0, 16).replace('T', ' ') + ' UTC (' + DAYS[from.getUTCDay()] + ')');
const lines = [
    ['*/15 * * * *', 'every 15 minutes'],
    ['30 3 * * *', 'the nightly backup'],
    ['0 9-17 * * 1-5', 'working hours, hourly'],
    ['0 0 1 * *', 'monthly report'],
    ['5,35 */6 * * *', 'lists and steps together'],
    ['0 12 15 * 1', 'day-of-month AND day-of-week: the trap', 5],
];
for (const [expr, why, n = 3] of lines) {
    console.log('\\n' + expr + '   # ' + why);
    for (const t of nextRuns(expr, from, n))
        console.log('   ' + DAYS[t.getUTCDay()] + ' ' + t.toISOString().slice(0, 16).replace('T', ' '));
}</code></pre>
<div class="out">$ node bai8-cron.js<br>
now = 2026-10-26 10:00 UTC (Mon)<br>
<br>
*/15 * * * * &nbsp;&nbsp;# every 15 minutes<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 10:15<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 10:30<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 10:45<br>
<br>
30 3 * * * &nbsp;&nbsp;# the nightly backup<br>
&nbsp;&nbsp;&nbsp;Tue 2026-10-27 03:30<br>
&nbsp;&nbsp;&nbsp;Wed 2026-10-28 03:30<br>
&nbsp;&nbsp;&nbsp;Thu 2026-10-29 03:30<br>
<br>
0 9-17 * * 1-5 &nbsp;&nbsp;# working hours, hourly<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 11:00<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 12:00<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 13:00<br>
<br>
0 0 1 * * &nbsp;&nbsp;# monthly report<br>
&nbsp;&nbsp;&nbsp;Sun 2026-11-01 00:00<br>
&nbsp;&nbsp;&nbsp;Tue 2026-12-01 00:00<br>
&nbsp;&nbsp;&nbsp;Fri 2027-01-01 00:00<br>
<br>
5,35 */6 * * * &nbsp;&nbsp;# lists and steps together<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 12:05<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 12:35<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 18:05<br>
<br>
0 12 15 * 1 &nbsp;&nbsp;# day-of-month AND day-of-week: the trap<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 12:00<br>
&nbsp;&nbsp;&nbsp;Mon 2026-11-02 12:00<br>
&nbsp;&nbsp;&nbsp;Mon 2026-11-09 12:00<br>
&nbsp;&nbsp;&nbsp;Sun 2026-11-15 12:00<br>
&nbsp;&nbsp;&nbsp;Mon 2026-11-16 12:00</div>
<table>
<thead><tr><th>Syntax</th><th>Meaning</th><th>Example</th></tr></thead>
<tbody>
<tr><td><code>*</code></td><td>every value of the field</td><td><code>* * * * *</code> = every minute</td></tr>
<tr><td><code>5</code></td><td>exactly this value</td><td><code>30 3 * * *</code> = 03:30 every day</td></tr>
<tr><td><code>1-5</code></td><td>a range (inclusive)</td><td><code>0 9-17 * * 1-5</code> = on the hour, 09:00–17:00, Mon–Fri</td></tr>
<tr><td><code>5,35</code></td><td>a list</td><td><code>5,35 * * * *</code> = at minutes 5 and 35</td></tr>
<tr><td><code>*/15</code></td><td>a step: every 15th value from the start of the range</td><td><code>*/15 * * * *</code> = :00 :15 :30 :45</td></tr>
</tbody>
</table>
<ul>
<li>Fields in order: <strong>minute (0–59) · hour (0–23) · day of month (1–31) · month (1–12) · day of week (0–7, 0 and 7 = Sunday)</strong>. Mnemonic: small to large, then the week. Next to the five fields, <code>/etc/crontab</code> and <code>/etc/cron.d/*</code> have a sixth column with the <em>user name</em>; a user's own crontab (<code>crontab -e</code>, <code>crontab -l</code>) does not.</li>
<li><code>*/15 * * * *</code> → 10:15, 10:30, 10:45 (the next quarter hours after 10:00). <code>30 3 * * *</code> → tomorrow 03:30, then the day after (the time has already passed today). <code>0 9-17 * * 1-5</code> → 11:00, 12:00, 13:00 (it is Monday, 10:00 is a working hour, so the next is 11:00). <code>0 0 1 * *</code> → 1 Nov, 1 Dec, 1 Jan: <em>midnight</em> on the first. <code>5,35 */6 * * *</code> → hours 0, 6, 12, 18 at minutes 5 and 35: 12:05, 12:35, 18:05.</li>
<li><strong>The trap — the last line.</strong> <code>0 12 15 * 1</code> reads "at noon on the 15th that is a Monday", and almost everybody expects that. Cron actually runs it on the 15th <strong>OR</strong> on every Monday: the output shows every Monday <em>and</em> Sunday 15 Nov. When <strong>both</strong> day-of-month and day-of-week are restricted (neither is <code>*</code>), a match of either is enough. (To get the "AND", put the test in the command: <code>0 12 * * 1 [ "$(date +\\%d)" = 15 ] &amp;&amp; …</code>.)</li>
<li><strong>Things that bite in production:</strong> (1) cron runs with a nearly empty environment — tiny <code>PATH</code>, no <code>HOME</code> profile (the same lesson as <code>env -i</code> in Exercise 7): use absolute paths and set <code>PATH</code> at the top of the crontab or script. (2) In a crontab, <code>%</code> is special (newline) and must be written <code>\\%</code>. (3) Output is mailed to the user or discarded: always redirect <code>&gt;&gt; /var/log/job.log 2&gt;&amp;1</code>. (4) The time zone is the server's (often UTC): the program above uses UTC. (5) Overlapping runs: if a job takes longer than its interval, two copies run — use a lock (Lab 2 exercise 6) or <code>flock -n</code>. (6) <code>@reboot</code>, <code>@daily</code>, <code>@hourly</code> are shortcuts. On systemd systems a <strong>timer unit</strong> (<code>OnCalendar=*-*-* 03:30:00</code>, <code>Persistent=true</code>) is the modern alternative: it logs to the journal and can catch up on missed runs.</li>
</ul>
</details>`,
    `<h3>🧪 Bài 8 — đọc một dòng cron (20 phút)</h3>
<p><strong>Tình huống.</strong> VPS có một crontab với các dòng như <code>30 3 * * *  /home/deploy/backup.sh …</code> (Lab 2 bài 7). Cron có năm trường thời gian — <strong>phút, giờ, ngày trong tháng, tháng, ngày trong tuần</strong> — rồi tới lệnh. Với mỗi dòng trong sáu dòng, hãy <em>đoán</em> ba lần chạy kế tiếp tính từ "bây giờ = thứ Hai 26/10/2026, 10:00 UTC" trước khi xem đáp án; rồi dùng chương trình để tự kiểm tra.</p>
<details><summary>Lời giải — chạy thật (ở đây không có daemon cron: chương trình là một bộ giải thích nhỏ tính ra lịch chạy)</summary>
<pre class="trich"><code class="language-javascript">const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function field(text, min, max) {                 // "*/15", "1-5", "5,35", "*", "9-17/2"
    const out = new Set();
    for (const part of text.split(',')) {
        const [range, step] = part.split('/');
        let a, b;
        if (range === '*') { a = min; b = max; }
        else if (range.includes('-')) { [a, b] = range.split('-').map(Number); }
        else { a = b = Number(range); if (step) b = max; }
        for (let v = a; v &lt;= b; v += step ? Number(step) : 1) out.add(v);
    }
    return { set: out, star: text === '*' || text.startsWith('*/') };
}

function nextRuns(expr, from, count) {
    const [mi, ho, dom, mon, dow] = expr.split(/\\s+/);
    const M = field(mi, 0, 59), H = field(ho, 0, 23), D = field(dom, 1, 31), O = field(mon, 1, 12), W = field(dow, 0, 6);
    const runs = [];
    for (let t = new Date(from.getTime() + 60000); runs.length &lt; count &amp;&amp; t - from &lt; 400 * 864e5; t = new Date(t.getTime() + 60000)) {
        if (!M.set.has(t.getUTCMinutes()) || !H.set.has(t.getUTCHours()) || !O.set.has(t.getUTCMonth() + 1)) continue;
        const dayOk = D.set.has(t.getUTCDate()), wdayOk = W.set.has(t.getUTCDay());
        // the famous rule: if BOTH day-of-month and day-of-week are restricted, either one is enough (OR)
        const ok = (!D.star &amp;&amp; !W.star) ? (dayOk || wdayOk) : (dayOk &amp;&amp; wdayOk);
        if (ok) runs.push(t);
    }
    return runs;
}</code></pre>
<pre><code class="language-javascript">// Bài 8: đọc dòng cron — chương trình này in ra khi nào mỗi dòng THẬT SỰ chạy
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function field(text, min, max) {                 // "*/15", "1-5", "5,35", "*", "9-17/2"
    const out = new Set();
    for (const part of text.split(',')) {
        const [range, step] = part.split('/');
        let a, b;
        if (range === '*') { a = min; b = max; }
        else if (range.includes('-')) { [a, b] = range.split('-').map(Number); }
        else { a = b = Number(range); if (step) b = max; }
        for (let v = a; v &lt;= b; v += step ? Number(step) : 1) out.add(v);
    }
    return { set: out, star: text === '*' || text.startsWith('*/') };
}

function nextRuns(expr, from, count) {
    const [mi, ho, dom, mon, dow] = expr.split(/\\s+/);
    const M = field(mi, 0, 59), H = field(ho, 0, 23), D = field(dom, 1, 31), O = field(mon, 1, 12), W = field(dow, 0, 6);
    const runs = [];
    for (let t = new Date(from.getTime() + 60000); runs.length &lt; count &amp;&amp; t - from &lt; 400 * 864e5; t = new Date(t.getTime() + 60000)) {
        if (!M.set.has(t.getUTCMinutes()) || !H.set.has(t.getUTCHours()) || !O.set.has(t.getUTCMonth() + 1)) continue;
        const dayOk = D.set.has(t.getUTCDate()), wdayOk = W.set.has(t.getUTCDay());
        // the famous rule: if BOTH day-of-month and day-of-week are restricted, either one is enough (OR)
        const ok = (!D.star &amp;&amp; !W.star) ? (dayOk || wdayOk) : (dayOk &amp;&amp; wdayOk);
        if (ok) runs.push(t);
    }
    return runs;
}

const from = new Date('2026-10-26T10:00:00Z');    // a Monday
console.log('now = ' + from.toISOString().slice(0, 16).replace('T', ' ') + ' UTC (' + DAYS[from.getUTCDay()] + ')');
const lines = [
    ['*/15 * * * *', 'every 15 minutes'],
    ['30 3 * * *', 'the nightly backup'],
    ['0 9-17 * * 1-5', 'working hours, hourly'],
    ['0 0 1 * *', 'monthly report'],
    ['5,35 */6 * * *', 'lists and steps together'],
    ['0 12 15 * 1', 'day-of-month AND day-of-week: the trap', 5],
];
for (const [expr, why, n = 3] of lines) {
    console.log('\\n' + expr + '   # ' + why);
    for (const t of nextRuns(expr, from, n))
        console.log('   ' + DAYS[t.getUTCDay()] + ' ' + t.toISOString().slice(0, 16).replace('T', ' '));
}</code></pre>
<div class="out">$ node bai8-cron.js<br>
now = 2026-10-26 10:00 UTC (Mon)<br>
<br>
*/15 * * * * &nbsp;&nbsp;# every 15 minutes<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 10:15<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 10:30<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 10:45<br>
<br>
30 3 * * * &nbsp;&nbsp;# the nightly backup<br>
&nbsp;&nbsp;&nbsp;Tue 2026-10-27 03:30<br>
&nbsp;&nbsp;&nbsp;Wed 2026-10-28 03:30<br>
&nbsp;&nbsp;&nbsp;Thu 2026-10-29 03:30<br>
<br>
0 9-17 * * 1-5 &nbsp;&nbsp;# working hours, hourly<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 11:00<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 12:00<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 13:00<br>
<br>
0 0 1 * * &nbsp;&nbsp;# monthly report<br>
&nbsp;&nbsp;&nbsp;Sun 2026-11-01 00:00<br>
&nbsp;&nbsp;&nbsp;Tue 2026-12-01 00:00<br>
&nbsp;&nbsp;&nbsp;Fri 2027-01-01 00:00<br>
<br>
5,35 */6 * * * &nbsp;&nbsp;# lists and steps together<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 12:05<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 12:35<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 18:05<br>
<br>
0 12 15 * 1 &nbsp;&nbsp;# day-of-month AND day-of-week: the trap<br>
&nbsp;&nbsp;&nbsp;Mon 2026-10-26 12:00<br>
&nbsp;&nbsp;&nbsp;Mon 2026-11-02 12:00<br>
&nbsp;&nbsp;&nbsp;Mon 2026-11-09 12:00<br>
&nbsp;&nbsp;&nbsp;Sun 2026-11-15 12:00<br>
&nbsp;&nbsp;&nbsp;Mon 2026-11-16 12:00</div>
<table>
<thead><tr><th>Cú pháp</th><th>Nghĩa</th><th>Ví dụ</th></tr></thead>
<tbody>
<tr><td><code>*</code></td><td>mọi giá trị của trường</td><td><code>* * * * *</code> = mỗi phút</td></tr>
<tr><td><code>5</code></td><td>đúng giá trị này</td><td><code>30 3 * * *</code> = 03:30 mỗi ngày</td></tr>
<tr><td><code>1-5</code></td><td>một khoảng (gồm cả hai đầu)</td><td><code>0 9-17 * * 1-5</code> = đúng giờ, 09:00–17:00, thứ Hai–thứ Sáu</td></tr>
<tr><td><code>5,35</code></td><td>một danh sách</td><td><code>5,35 * * * *</code> = ở phút 5 và 35</td></tr>
<tr><td><code>*/15</code></td><td>bước nhảy: cứ 15 giá trị một lần kể từ đầu khoảng</td><td><code>*/15 * * * *</code> = :00 :15 :30 :45</td></tr>
</tbody>
</table>
<ul>
<li>Thứ tự các trường: <strong>phút (0–59) · giờ (0–23) · ngày trong tháng (1–31) · tháng (1–12) · ngày trong tuần (0–7, 0 và 7 = Chủ nhật)</strong>. Mẹo nhớ: nhỏ đến lớn, rồi tới tuần. Cạnh năm trường, <code>/etc/crontab</code> và <code>/etc/cron.d/*</code> có cột thứ sáu là <em>tên người dùng</em>; crontab riêng của người dùng (<code>crontab -e</code>, <code>crontab -l</code>) thì không.</li>
<li><code>*/15 * * * *</code> → 10:15, 10:30, 10:45 (các mốc 15 phút kế sau 10:00). <code>30 3 * * *</code> → mai 03:30, rồi ngày kia (hôm nay đã qua giờ đó). <code>0 9-17 * * 1-5</code> → 11:00, 12:00, 13:00 (hôm nay là thứ Hai, 10:00 là giờ làm việc nên lần kế là 11:00). <code>0 0 1 * *</code> → 1/11, 1/12, 1/1: <em>nửa đêm</em> ngày mùng một. <code>5,35 */6 * * *</code> → các giờ 0, 6, 12, 18 ở phút 5 và 35: 12:05, 12:35, 18:05.</li>
<li><strong>Cái bẫy — dòng cuối.</strong> <code>0 12 15 * 1</code> đọc là "12 giờ trưa ngày 15 mà là thứ Hai", và gần như ai cũng mong như vậy. Thực tế cron chạy nó vào ngày 15 <strong>HOẶC</strong> mọi thứ Hai: kết quả cho thấy mọi thứ Hai <em>và</em> Chủ nhật 15/11. Khi <strong>cả hai</strong> trường ngày trong tháng và ngày trong tuần bị hạn chế (không cái nào là <code>*</code>), khớp một trong hai là đủ. (Muốn "VÀ", đặt phép thử vào lệnh: <code>0 12 * * 1 [ "$(date +\\%d)" = 15 ] &amp;&amp; …</code>.)</li>
<li><strong>Những thứ gây đau trên production:</strong> (1) cron chạy với môi trường gần như rỗng — <code>PATH</code> rất ngắn, không có profile của <code>HOME</code> (cùng bài học với <code>env -i</code> ở Bài 7): dùng đường dẫn tuyệt đối và đặt <code>PATH</code> ở đầu crontab hay script. (2) Trong crontab, <code>%</code> là ký tự đặc biệt (xuống dòng) và phải viết <code>\\%</code>. (3) Output được gửi mail cho người dùng hoặc bị bỏ: luôn chuyển hướng <code>&gt;&gt; /var/log/job.log 2&gt;&amp;1</code>. (4) Múi giờ là của server (thường UTC): chương trình trên dùng UTC. (5) Chạy chồng: nếu job lâu hơn chu kỳ thì hai bản chạy cùng lúc — dùng khoá (Lab 2 bài 6) hoặc <code>flock -n</code>. (6) <code>@reboot</code>, <code>@daily</code>, <code>@hourly</code> là cách viết tắt. Trên hệ thống systemd, <strong>timer unit</strong> (<code>OnCalendar=*-*-* 03:30:00</code>, <code>Persistent=true</code>) là lựa chọn hiện đại: ghi log vào journal và bù được các lần chạy bị lỡ.</li>
</ul>
</details>`),
    bi(`<h3>🏁 Big project — write a "process doctor" (2–3 hours)</h3>
<p><strong>Situation.</strong> At 02:00 you want one command that tells you at a glance whether a process is healthy. Write <code>doctor.sh PID [MAX_RSS_MIB]</code>, <strong>read-only</strong>, built only from <code>/proc</code> and basic tools. It must report:</p>
<ol>
<li><strong>Identity:</strong> name, PID, state letter and word, full command line, user ID, and the <strong>chain of ancestors</strong> up to PID 1 (parse <code>PPid</code> from <code>status</code>).</li>
<li><strong>Age and threads:</strong> seconds since start (from <code>stat</code> field 22 in clock ticks, <code>getconf CLK_TCK</code> and <code>/proc/uptime</code>) and thread count. The name field of <code>stat</code> may contain spaces — handle it.</li>
<li><strong>Memory:</strong> resident size in MiB (flag it when above the limit given in argument 2, default 512), and the <strong>three biggest mappings</strong> (convert the hexadecimal address ranges of <code>maps</code>).</li>
<li><strong>File descriptors:</strong> how many are open, the soft limit from <code>limits</code>, the percentage; flag at 80 % or more.</li>
<li><strong>Listening TCP ports owned by the process:</strong> collect the socket inodes from <code>fd/</code> and match them against the LISTEN rows (state <code>0A</code>) of <code>/proc/net/tcp</code> and <code>tcp6</code>; convert the hexadecimal port.</li>
<li><strong>Zombie children:</strong> count them and flag any.</li>
<li>A final <code>VERDICT: OK</code> or <code>WARN</code> and an exit code (0 / 1); exit code 2 with a message on stderr for a missing PID; a usage message when called without arguments.</li>
</ol>
<p><strong>Test on three subjects</strong> you create yourself: a healthy Node HTTP server; a "leaky" one started with <code>(ulimit -n 64; exec node leaky.js)</code> that opens files and never closes them; and a script that leaves a zombie child (<code>bash -c 'sleep 0.1 &amp; exec sleep 60'</code>). <strong>Extensions:</strong> accept a process <em>name</em> instead of a PID (<code>pgrep -x</code>); show the CPU time and percent between two samples of <code>stat</code> fields 14–15; list established connections count; <code>--json</code> output; compare with what <code>ps</code> and <code>ss -ltnp</code> report.</p>
<details><summary>Reference solution — run for real</summary>
<p class="chu-thich">🐳 Run in the <code>osg202-lab</code> container with <code>--user=sv</code> — see the ⭐ lesson "Setting up Linux".</p>
<div class="out"># Big project: a read-only "process doctor" built only from /proc<br>
$ cat &gt; doctor.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; # usage: doctor.sh &lt;pid&gt; [max-rss-MiB] &nbsp;&nbsp;&nbsp;exit 0 = OK, 1 = WARN, 2 = no such process<br>
&gt; set -u<br>
&gt; pid=&#36;{1:?usage: doctor.sh &lt;pid&gt; [max-rss-MiB]}<br>
&gt; maxrss=&#36;{2:-512}<br>
&gt; d=/proc/$pid<br>
&gt; [ -d "$d" ] || { echo "no such process: $pid" &gt;&amp;2; exit 2; }<br>
&gt; warn=0; flag() { echo " &nbsp;!! $1"; warn=1; }<br>
&gt; status() { awk -v k="$1:" '$1 == k {print $2}' "$d/status"; }<br>
&gt;<br>
&gt; # 1. identity and state<br>
&gt; echo "process &nbsp;&nbsp;: $(cat "$d/comm") (pid $pid), state: $(awk '/^State:/ {print $2, $3}' "$d/status")"<br>
&gt; echo "cmdline &nbsp;&nbsp;: $(tr '\\0' ' ' &lt; "$d/cmdline")"<br>
&gt; echo "run as uid: $(status Uid)"<br>
&gt; chain=""; p=$pid<br>
&gt; while [ "$p" != 0 ] &amp;&amp; [ -r "/proc/$p/status" ]; do<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;chain="$chain$(cat "/proc/$p/comm")($p) &lt; "<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;p=$(awk '/^PPid:/ {print $2}' "/proc/$p/status")<br>
&gt; done<br>
&gt; echo "ancestors : &#36;{chain% &lt; }"<br>
&gt;<br>
&gt; # 2. age (stat field 22 = start time in clock ticks since boot; strip "pid (comm) " first because comm may contain spaces)<br>
&gt; start=$(sed 's/^.*) //' "$d/stat" | awk '{print $20}')<br>
&gt; age=$(( $(awk '{print int($1)}' /proc/uptime) - start / $(getconf CLK_TCK) ))<br>
&gt; echo "age &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &#36;{age}s, threads: $(status Threads)"<br>
&gt;<br>
&gt; # 3. memory<br>
&gt; rss=$(( $(status VmRSS) / 1024 ))<br>
&gt; echo "memory &nbsp;&nbsp;&nbsp;: RSS &#36;{rss} MiB (limit for this check: &#36;{maxrss} MiB)"<br>
&gt; [ "$rss" -gt "$maxrss" ] &amp;&amp; flag "RSS above &#36;{maxrss} MiB"<br>
&gt; echo "biggest mappings (KiB perms path):"<br>
&gt; while read -r range perms off dev ino path; do<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "$(( (16#&#36;{range#*-} - 16#&#36;{range%-*}) / 1024 )) $perms &#36;{path:-[anonymous]}"<br>
&gt; done &lt; "$d/maps" | sort -rn | head -n 3 | sed 's/^/ &nbsp;&nbsp;&nbsp;/'<br>
&gt;<br>
&gt; # 4. file descriptors against the limit<br>
&gt; nfd=$(ls "$d/fd" | wc -l)<br>
&gt; limit=$(awk '/^Max open files/ {print $4}' "$d/limits")<br>
&gt; pct=$(( nfd * 100 / limit ))<br>
&gt; echo "fds &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: $nfd of $limit ($pct%)"<br>
&gt; [ "$pct" -ge 80 ] &amp;&amp; flag "file descriptors at &#36;{pct}% of the limit: a leak? EMFILE is near"<br>
&gt;<br>
&gt; # 5. listening TCP ports owned by this process: socket inodes in fd/ &nbsp;x &nbsp;LISTEN rows (state 0A) of /proc/net/tcp{,6}<br>
&gt; inodes=$(ls -l "$d/fd" | grep -o 'socket:\\[[0-9]*\\]' | tr -dc '0-9\\n')<br>
&gt; ports=""<br>
&gt; while read -r sl local rem st q t retr uid to inode rest; do<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;[ "$st" = 0A ] &amp;&amp; echo "$inodes" | grep -qx "$inode" &amp;&amp; ports="$ports $((16#&#36;{local##*:}))"<br>
&gt; done &lt; &lt;(tail -q -n +2 /proc/net/tcp /proc/net/tcp6)<br>
&gt; echo "listening : TCP&#36;{ports:- none}"<br>
&gt;<br>
&gt; # 6. zombie children<br>
&gt; z=$(ps --ppid "$pid" -o stat= | grep -c '^Z')<br>
&gt; echo "zombies &nbsp;&nbsp;: $z"<br>
&gt; [ "$z" -gt 0 ] &amp;&amp; flag "$z zombie children: the process does not wait() for them"<br>
&gt;<br>
&gt; [ "$warn" = 0 ] &amp;&amp; echo "VERDICT &nbsp;&nbsp;: OK" || echo "VERDICT &nbsp;&nbsp;: WARN"<br>
&gt; exit $warn<br>
&gt; END<br>
$ cat &gt; healthy.js &lt;&lt;'END'<br>
&gt; process.title = "healthy-api";<br>
&gt; require("http").createServer((q, r) =&gt; r.end("ok")).listen(4000);<br>
&gt; setInterval(() =&gt; {}, 1000);<br>
&gt; END<br>
$ cat &gt; leaky.js &lt;&lt;'END'<br>
&gt; process.title = "leaky-api";<br>
&gt; const fs = require("fs"), held = [];<br>
&gt; for (let i = 0; i &lt; 40; i++) held.push(fs.openSync("/etc/hostname", "r")); &nbsp;&nbsp;// never closed<br>
&gt; require("http").createServer((q, r) =&gt; r.end("ok")).listen(5000);<br>
&gt; setInterval(() =&gt; {}, 1000);<br>
&gt; END<br>
$ node healthy.js &amp;<br>
$ (ulimit -n 64; exec node leaky.js) &amp;<br>
$ (exec 2&gt;/dev/null; bash -c 'sleep 0.1 &amp; exec sleep 60') &amp;<br>
$ sleep 1<br>
$ H=$(jobs -p %1); L=$(jobs -p %2); Z=$(jobs -p %3)<br>
$ bash doctor.sh $H<br>
process &nbsp;&nbsp;: healthy-api (pid 23), state: S (sleeping)<br>
cmdline &nbsp;&nbsp;: healthy-api<br>
run as uid: 1000<br>
ancestors : healthy-api(23) &lt; bash(1)<br>
age &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1s, threads: 7<br>
memory &nbsp;&nbsp;&nbsp;: RSS 43 MiB (limit for this check: 512 MiB)<br>
biggest mappings (KiB perms path):<br>
&nbsp;&nbsp;&nbsp;&nbsp;261892 ---p [anonymous]<br>
&nbsp;&nbsp;&nbsp;&nbsp;101056 r-xp /usr/local/bin/node<br>
&nbsp;&nbsp;&nbsp;&nbsp;65404 ---p [anonymous]<br>
fds &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 19 of 1048576 (0%)<br>
listening : TCP 4000<br>
zombies &nbsp;&nbsp;: 0<br>
VERDICT &nbsp;&nbsp;: OK<br>
$ echo "exit code: $?"<br>
exit code: 0<br>
$ bash doctor.sh $L<br>
process &nbsp;&nbsp;: leaky-api (pid 26), state: S (sleeping)<br>
cmdline &nbsp;&nbsp;: leaky-api<br>
run as uid: 1000<br>
ancestors : leaky-api(26) &lt; bash(1)<br>
age &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1s, threads: 7<br>
memory &nbsp;&nbsp;&nbsp;: RSS 44 MiB (limit for this check: 512 MiB)<br>
biggest mappings (KiB perms path):<br>
&nbsp;&nbsp;&nbsp;&nbsp;261892 ---p [anonymous]<br>
&nbsp;&nbsp;&nbsp;&nbsp;101056 r-xp /usr/local/bin/node<br>
&nbsp;&nbsp;&nbsp;&nbsp;65404 ---p [anonymous]<br>
fds &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 59 of 64 (92%)<br>
&nbsp;&nbsp;!! file descriptors at 92% of the limit: a leak? EMFILE is near<br>
listening : TCP 5000<br>
zombies &nbsp;&nbsp;: 0<br>
VERDICT &nbsp;&nbsp;: WARN<br>
$ echo "exit code: $?"<br>
exit code: 1<br>
$ bash doctor.sh $Z 1 | grep -E 'zombies|VERDICT|!!'<br>
zombies &nbsp;&nbsp;: 1<br>
&nbsp;&nbsp;!! 1 zombie children: the process does not wait() for them<br>
VERDICT &nbsp;&nbsp;: WARN<br>
$ bash doctor.sh 99999<br>
no such process: 99999<br>
$ echo "exit code: $?"<br>
exit code: 2<br>
$ bash doctor.sh<br>
doctor.sh: line 4: 1: usage: doctor.sh &lt;pid&gt; [max-rss-MiB]<br>
$ kill $H $L $Z</div>
<ul>
<li><strong>Structure:</strong> six independent blocks, each reads a different <code>/proc</code> file; the helper <code>flag</code> records a warning; the script ends with a verdict and an exit code the monitoring system can use (Lab 2 exercise 8).</li>
<li><strong>The three subjects:</strong> <code>healthy-api</code> — 19 fds of 1 048 576 (0 %), listening on TCP 4000, no zombies → <code>OK</code>. <code>leaky-api</code> — 59 of 64 fds (92 %) → flagged, <code>WARN</code>, exit 1; it still serves port 5000 (a service in this state works until the next connection fails with <code>EMFILE</code>, which is why you want the warning <em>before</em>). The third subject has one zombie child → <code>WARN</code>. A missing PID gives exit code 2 and a message on stderr; no arguments gives bash's <code>&#36;{1:?}</code> usage message.</li>
<li><strong>Ancestors:</strong> <code>healthy-api(23) &lt; bash(1)</code> — the process was started from the lab shell, which is PID 1 here; on a server the chain would end at <code>systemd(1)</code> or, in Docker, at the container's entrypoint (⭐ CS.1 exercise 5: PID 1 and signals).</li>
<li><strong>Age</strong> uses <code>sed 's/^.*) //'</code> to cut the "(name)" safely — a name with a space or a parenthesis would otherwise shift every field. <strong>Memory:</strong> the three biggest mappings are virtual reservations (<code>---p</code> regions of V8's heap cage: no permission, no RAM) and the 101 MB <code>node</code> binary — a vivid reminder that virtual size says nothing about RAM (Exercise 3).</li>
<li><strong>Ports:</strong> Node listens on IPv6 <code>::</code> (which also accepts IPv4), so the row is in <code>/proc/net/tcp6</code>, not <code>tcp</code>; reading both files is required. The socket inode from <code>fd/</code> is the key that ties a process to a network row — the same technique that <code>ss -ltnp</code> and <code>lsof -i</code> use.</li>
<li>Limits of the tool: it reads, never fixes; a process owned by another user may hide its <code>fd</code> and <code>environ</code> (run it with <code>sudo</code>); and everything is a snapshot — a real monitor samples repeatedly (rates are differences between two samples).</li>
</ul>
</details>`,
    `<h3>🏁 Bài tập lớn — viết một "bác sĩ tiến trình" (2–3 giờ)</h3>
<p><strong>Tình huống.</strong> Lúc 02:00 bạn muốn một lệnh duy nhất cho biết ngay một tiến trình có khoẻ không. Viết <code>doctor.sh PID [RSS_TỐI_ĐA_MIB]</code>, <strong>chỉ đọc</strong>, xây hoàn toàn từ <code>/proc</code> và các công cụ cơ bản. Nó phải báo cáo:</p>
<ol>
<li><strong>Danh tính:</strong> tên, PID, chữ và từ chỉ trạng thái, dòng lệnh đầy đủ, ID người dùng, và <strong>chuỗi tổ tiên</strong> lên tới PID 1 (đọc <code>PPid</code> từ <code>status</code>).</li>
<li><strong>Tuổi và luồng:</strong> số giây từ lúc khởi động (từ trường 22 của <code>stat</code> tính bằng tick đồng hồ, <code>getconf CLK_TCK</code> và <code>/proc/uptime</code>) và số luồng. Trường tên của <code>stat</code> có thể chứa dấu cách — hãy xử lý.</li>
<li><strong>Bộ nhớ:</strong> kích thước thường trú tính bằng MiB (cảnh báo khi vượt giới hạn ở tham số 2, mặc định 512), và <strong>ba vùng ánh xạ lớn nhất</strong> (đổi các khoảng địa chỉ thập lục phân của <code>maps</code>).</li>
<li><strong>File descriptor:</strong> đang mở bao nhiêu, giới hạn mềm từ <code>limits</code>, phần trăm; cảnh báo từ 80 % trở lên.</li>
<li><strong>Cổng TCP đang nghe thuộc tiến trình:</strong> gom inode socket từ <code>fd/</code> và ghép với các dòng LISTEN (trạng thái <code>0A</code>) của <code>/proc/net/tcp</code> và <code>tcp6</code>; đổi cổng thập lục phân.</li>
<li><strong>Con zombie:</strong> đếm và cảnh báo nếu có.</li>
<li><code>VERDICT: OK</code> hoặc <code>WARN</code> cuối cùng cùng mã thoát (0 / 1); mã thoát 2 kèm thông báo ra stderr khi PID không tồn tại; thông báo cách dùng khi gọi không có tham số.</li>
</ol>
<p><strong>Thử trên ba đối tượng</strong> do bạn tự tạo: một HTTP server Node khoẻ mạnh; một cái "rò" khởi động bằng <code>(ulimit -n 64; exec node leaky.js)</code> mở tệp mà không bao giờ đóng; và một script để lại tiến trình con zombie (<code>bash -c 'sleep 0.1 &amp; exec sleep 60'</code>). <strong>Mở rộng:</strong> nhận <em>tên</em> tiến trình thay cho PID (<code>pgrep -x</code>); hiện thời gian CPU và phần trăm giữa hai lần lấy mẫu trường 14–15 của <code>stat</code>; đếm kết nối đã thiết lập; xuất <code>--json</code>; so với những gì <code>ps</code> và <code>ss -ltnp</code> báo.</p>
<details><summary>Lời giải tham khảo — chạy thật</summary>
<p class="chu-thich">🐳 Chạy trong container <code>osg202-lab</code> với cờ <code>--user=sv</code> — xem bài ⭐ "Cài môi trường Linux".</p>
<div class="out"># Bài tập lớn: "bác sĩ tiến trình" chỉ đọc, xây hoàn toàn từ /proc<br>
$ cat &gt; doctor.sh &lt;&lt;'END'<br>
&gt; #!/bin/bash<br>
&gt; # usage: doctor.sh &lt;pid&gt; [max-rss-MiB] &nbsp;&nbsp;&nbsp;exit 0 = OK, 1 = WARN, 2 = no such process<br>
&gt; set -u<br>
&gt; pid=&#36;{1:?usage: doctor.sh &lt;pid&gt; [max-rss-MiB]}<br>
&gt; maxrss=&#36;{2:-512}<br>
&gt; d=/proc/$pid<br>
&gt; [ -d "$d" ] || { echo "no such process: $pid" &gt;&amp;2; exit 2; }<br>
&gt; warn=0; flag() { echo " &nbsp;!! $1"; warn=1; }<br>
&gt; status() { awk -v k="$1:" '$1 == k {print $2}' "$d/status"; }<br>
&gt;<br>
&gt; # 1. identity and state<br>
&gt; echo "process &nbsp;&nbsp;: $(cat "$d/comm") (pid $pid), state: $(awk '/^State:/ {print $2, $3}' "$d/status")"<br>
&gt; echo "cmdline &nbsp;&nbsp;: $(tr '\\0' ' ' &lt; "$d/cmdline")"<br>
&gt; echo "run as uid: $(status Uid)"<br>
&gt; chain=""; p=$pid<br>
&gt; while [ "$p" != 0 ] &amp;&amp; [ -r "/proc/$p/status" ]; do<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;chain="$chain$(cat "/proc/$p/comm")($p) &lt; "<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;p=$(awk '/^PPid:/ {print $2}' "/proc/$p/status")<br>
&gt; done<br>
&gt; echo "ancestors : &#36;{chain% &lt; }"<br>
&gt;<br>
&gt; # 2. age (stat field 22 = start time in clock ticks since boot; strip "pid (comm) " first because comm may contain spaces)<br>
&gt; start=$(sed 's/^.*) //' "$d/stat" | awk '{print $20}')<br>
&gt; age=$(( $(awk '{print int($1)}' /proc/uptime) - start / $(getconf CLK_TCK) ))<br>
&gt; echo "age &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: &#36;{age}s, threads: $(status Threads)"<br>
&gt;<br>
&gt; # 3. memory<br>
&gt; rss=$(( $(status VmRSS) / 1024 ))<br>
&gt; echo "memory &nbsp;&nbsp;&nbsp;: RSS &#36;{rss} MiB (limit for this check: &#36;{maxrss} MiB)"<br>
&gt; [ "$rss" -gt "$maxrss" ] &amp;&amp; flag "RSS above &#36;{maxrss} MiB"<br>
&gt; echo "biggest mappings (KiB perms path):"<br>
&gt; while read -r range perms off dev ino path; do<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;echo "$(( (16#&#36;{range#*-} - 16#&#36;{range%-*}) / 1024 )) $perms &#36;{path:-[anonymous]}"<br>
&gt; done &lt; "$d/maps" | sort -rn | head -n 3 | sed 's/^/ &nbsp;&nbsp;&nbsp;/'<br>
&gt;<br>
&gt; # 4. file descriptors against the limit<br>
&gt; nfd=$(ls "$d/fd" | wc -l)<br>
&gt; limit=$(awk '/^Max open files/ {print $4}' "$d/limits")<br>
&gt; pct=$(( nfd * 100 / limit ))<br>
&gt; echo "fds &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: $nfd of $limit ($pct%)"<br>
&gt; [ "$pct" -ge 80 ] &amp;&amp; flag "file descriptors at &#36;{pct}% of the limit: a leak? EMFILE is near"<br>
&gt;<br>
&gt; # 5. listening TCP ports owned by this process: socket inodes in fd/ &nbsp;x &nbsp;LISTEN rows (state 0A) of /proc/net/tcp{,6}<br>
&gt; inodes=$(ls -l "$d/fd" | grep -o 'socket:\\[[0-9]*\\]' | tr -dc '0-9\\n')<br>
&gt; ports=""<br>
&gt; while read -r sl local rem st q t retr uid to inode rest; do<br>
&gt; &nbsp;&nbsp;&nbsp;&nbsp;[ "$st" = 0A ] &amp;&amp; echo "$inodes" | grep -qx "$inode" &amp;&amp; ports="$ports $((16#&#36;{local##*:}))"<br>
&gt; done &lt; &lt;(tail -q -n +2 /proc/net/tcp /proc/net/tcp6)<br>
&gt; echo "listening : TCP&#36;{ports:- none}"<br>
&gt;<br>
&gt; # 6. zombie children<br>
&gt; z=$(ps --ppid "$pid" -o stat= | grep -c '^Z')<br>
&gt; echo "zombies &nbsp;&nbsp;: $z"<br>
&gt; [ "$z" -gt 0 ] &amp;&amp; flag "$z zombie children: the process does not wait() for them"<br>
&gt;<br>
&gt; [ "$warn" = 0 ] &amp;&amp; echo "VERDICT &nbsp;&nbsp;: OK" || echo "VERDICT &nbsp;&nbsp;: WARN"<br>
&gt; exit $warn<br>
&gt; END<br>
$ cat &gt; healthy.js &lt;&lt;'END'<br>
&gt; process.title = "healthy-api";<br>
&gt; require("http").createServer((q, r) =&gt; r.end("ok")).listen(4000);<br>
&gt; setInterval(() =&gt; {}, 1000);<br>
&gt; END<br>
$ cat &gt; leaky.js &lt;&lt;'END'<br>
&gt; process.title = "leaky-api";<br>
&gt; const fs = require("fs"), held = [];<br>
&gt; for (let i = 0; i &lt; 40; i++) held.push(fs.openSync("/etc/hostname", "r")); &nbsp;&nbsp;// never closed<br>
&gt; require("http").createServer((q, r) =&gt; r.end("ok")).listen(5000);<br>
&gt; setInterval(() =&gt; {}, 1000);<br>
&gt; END<br>
$ node healthy.js &amp;<br>
$ (ulimit -n 64; exec node leaky.js) &amp;<br>
$ (exec 2&gt;/dev/null; bash -c 'sleep 0.1 &amp; exec sleep 60') &amp;<br>
$ sleep 1<br>
$ H=$(jobs -p %1); L=$(jobs -p %2); Z=$(jobs -p %3)<br>
$ bash doctor.sh $H<br>
process &nbsp;&nbsp;: healthy-api (pid 23), state: S (sleeping)<br>
cmdline &nbsp;&nbsp;: healthy-api<br>
run as uid: 1000<br>
ancestors : healthy-api(23) &lt; bash(1)<br>
age &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1s, threads: 7<br>
memory &nbsp;&nbsp;&nbsp;: RSS 43 MiB (limit for this check: 512 MiB)<br>
biggest mappings (KiB perms path):<br>
&nbsp;&nbsp;&nbsp;&nbsp;261892 ---p [anonymous]<br>
&nbsp;&nbsp;&nbsp;&nbsp;101056 r-xp /usr/local/bin/node<br>
&nbsp;&nbsp;&nbsp;&nbsp;65404 ---p [anonymous]<br>
fds &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 19 of 1048576 (0%)<br>
listening : TCP 4000<br>
zombies &nbsp;&nbsp;: 0<br>
VERDICT &nbsp;&nbsp;: OK<br>
$ echo "exit code: $?"<br>
exit code: 0<br>
$ bash doctor.sh $L<br>
process &nbsp;&nbsp;: leaky-api (pid 26), state: S (sleeping)<br>
cmdline &nbsp;&nbsp;: leaky-api<br>
run as uid: 1000<br>
ancestors : leaky-api(26) &lt; bash(1)<br>
age &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 1s, threads: 7<br>
memory &nbsp;&nbsp;&nbsp;: RSS 44 MiB (limit for this check: 512 MiB)<br>
biggest mappings (KiB perms path):<br>
&nbsp;&nbsp;&nbsp;&nbsp;261892 ---p [anonymous]<br>
&nbsp;&nbsp;&nbsp;&nbsp;101056 r-xp /usr/local/bin/node<br>
&nbsp;&nbsp;&nbsp;&nbsp;65404 ---p [anonymous]<br>
fds &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: 59 of 64 (92%)<br>
&nbsp;&nbsp;!! file descriptors at 92% of the limit: a leak? EMFILE is near<br>
listening : TCP 5000<br>
zombies &nbsp;&nbsp;: 0<br>
VERDICT &nbsp;&nbsp;: WARN<br>
$ echo "exit code: $?"<br>
exit code: 1<br>
$ bash doctor.sh $Z 1 | grep -E 'zombies|VERDICT|!!'<br>
zombies &nbsp;&nbsp;: 1<br>
&nbsp;&nbsp;!! 1 zombie children: the process does not wait() for them<br>
VERDICT &nbsp;&nbsp;: WARN<br>
$ bash doctor.sh 99999<br>
no such process: 99999<br>
$ echo "exit code: $?"<br>
exit code: 2<br>
$ bash doctor.sh<br>
doctor.sh: line 4: 1: usage: doctor.sh &lt;pid&gt; [max-rss-MiB]<br>
$ kill $H $L $Z</div>
<ul>
<li><strong>Cấu trúc:</strong> sáu khối độc lập, mỗi khối đọc một tệp <code>/proc</code> khác nhau; hàm phụ <code>flag</code> ghi lại một cảnh báo; script kết thúc bằng phán quyết và mã thoát mà hệ thống giám sát dùng được (Lab 2 bài 8).</li>
<li><strong>Ba đối tượng:</strong> <code>healthy-api</code> — 19 fd trên 1 048 576 (0 %), nghe ở TCP 4000, không zombie → <code>OK</code>. <code>leaky-api</code> — 59 trên 64 fd (92 %) → bị gắn cờ, <code>WARN</code>, mã thoát 1; nó vẫn phục vụ cổng 5000 (dịch vụ ở trạng thái này chạy được tới khi kết nối kế tiếp thất bại với <code>EMFILE</code>, vì thế bạn muốn có cảnh báo <em>trước</em> đó). Đối tượng thứ ba có một con zombie → <code>WARN</code>. PID không tồn tại cho mã thoát 2 và thông báo ra stderr; không tham số cho thông báo cách dùng <code>&#36;{1:?}</code> của bash.</li>
<li><strong>Tổ tiên:</strong> <code>healthy-api(23) &lt; bash(1)</code> — tiến trình được khởi động từ shell của lab, ở đây là PID 1; trên server, chuỗi sẽ kết thúc ở <code>systemd(1)</code> hoặc, trong Docker, ở entrypoint của container (⭐ CS.1 bài 5: PID 1 và tín hiệu).</li>
<li><strong>Tuổi</strong> dùng <code>sed 's/^.*) //'</code> để cắt "(tên)" an toàn — một cái tên có dấu cách hay ngoặc sẽ làm lệch mọi trường. <strong>Bộ nhớ:</strong> ba vùng lớn nhất là các vùng giữ chỗ ảo (vùng <code>---p</code> của heap cage V8: không quyền, không RAM) và tệp nhị phân <code>node</code> 101 MB — lời nhắc sinh động rằng kích thước ảo không nói gì về RAM (Bài 3).</li>
<li><strong>Cổng:</strong> Node nghe trên IPv6 <code>::</code> (cũng nhận IPv4), nên dòng nằm trong <code>/proc/net/tcp6</code>, không phải <code>tcp</code>; phải đọc cả hai tệp. Inode socket từ <code>fd/</code> là chìa khoá nối một tiến trình với một dòng mạng — chính kỹ thuật mà <code>ss -ltnp</code> và <code>lsof -i</code> dùng.</li>
<li>Giới hạn của công cụ: nó chỉ đọc, không sửa; tiến trình của người dùng khác có thể giấu <code>fd</code> và <code>environ</code> (chạy bằng <code>sudo</code>); và mọi thứ là một ảnh chụp — bộ giám sát thật lấy mẫu liên tục (tốc độ là hiệu giữa hai mẫu).</li>
</ul>
</details>`),
    bi(`<h3>⚠️ Common errors — how to read them</h3>
<table>
<thead><tr><th>Symptom or message</th><th>Meaning</th><th>What to check</th></tr></thead>
<tbody>
<tr><td><code>Too many open files</code> (EMFILE)</td><td>the process reached its fd limit</td><td><code>ls /proc/PID/fd &#124; wc -l</code> against <code>limits</code>; find the leak; <code>LimitNOFILE=</code> / <code>ulimit -n</code> only afterwards</td></tr>
<tr><td>Container exits with code 137, no error</td><td>killed by <code>SIGKILL</code> — usually the OOM killer</td><td><code>memory.events</code>, <code>dmesg &#124; grep -i oom</code>, <code>docker inspect</code> → <code>OOMKilled</code></td></tr>
<tr><td><code>free</code> shows lots of RAM inside a container</td><td><code>/proc/meminfo</code> is the host's</td><td>read <code>/sys/fs/cgroup/memory.max</code> and <code>memory.current</code></td></tr>
<tr><td>Process in state <code>D</code> that will not die</td><td>uninterruptible I/O wait (slow disk, NFS)</td><td><code>iostat</code>, <code>dmesg</code>; it counts in load average; <code>kill -9</code> does not help</td></tr>
<tr><td>Zombie (<code>Z</code>) processes accumulate</td><td>the parent never calls <code>wait()</code></td><td>fix or restart the parent; in containers use an init (<code>--init</code>)</td></tr>
<tr><td><code>kill: (PID) - No such process</code></td><td>the PID is gone or was reused</td><td><code>pgrep -a</code>; use names or PID files carefully</td></tr>
<tr><td><code>Operation not permitted</code> on <code>kill</code> or <code>renice</code></td><td>the process is not yours / you may only raise niceness</td><td><code>sudo</code>, or ask the owner</td></tr>
<tr><td>Service runs in the terminal but not under systemd or cron</td><td>empty environment, other user, relative paths</td><td>declare <code>Environment=</code> / <code>PATH</code>; absolute paths; check <code>journalctl -u</code> or the cron log</td></tr>
<tr><td>Unit changes are ignored</td><td>systemd still has the old unit in memory</td><td><code>systemctl daemon-reload</code>, then <code>restart</code></td></tr>
<tr><td>Cron job did not run</td><td>wrong field order, <code>%</code> unescaped, timezone, or the daemon is down</td><td>check the five fields (Exercise 8), the log, and <code>date</code> on the server</td></tr>
</tbody>
</table>
<h3>📝 What to submit and how it is marked</h3>
<p>The lecturer sets the exact format of the real lab; this is your self-check against CLO8–10. Submit <code>Lab4_&lt;StudentID&gt;.zip</code> with: a text file of the terminal transcript of every exercise <em>run on your own Linux</em> (so the numbers are yours), your <code>doctor.sh</code> with the three test subjects and their output, a one-page "incident note" describing a real finding (for example: "the leaky service held 92 % of its fd limit"), and your answers to the self-check questions.</p>
<table>
<thead><tr><th>Criterion</th><th>What a full mark needs</th><th>Points</th></tr></thead>
<tbody>
<tr><td>Observation commands</td><td>Exercises 1–6 reproduced on your machine with your own numbers; each state, field and column explained</td><td>3</td></tr>
<tr><td>Reading configuration</td><td>the systemd unit and the six cron lines explained line by line, including the OR trap, <code>daemon-reload</code> and the empty environment</td><td>2</td></tr>
<tr><td>Big project</td><td>all 7 features; tested on the three subjects; correct exit codes; handles a name with spaces in <code>stat</code></td><td>3</td></tr>
<tr><td>Reasoning</td><td>the incident note links an observation (fd, RSS, state, load) to a cause and a remedy; distinguishes virtual from resident memory and host from container</td><td>1.5</td></tr>
<tr><td>Safety</td><td>read-only tools; no <code>kill -9</code> as a first resort; <code>pgrep -a</code> before <code>pkill</code></td><td>0.5</td></tr>
</tbody>
</table>
<p>Self-check: (1) a process shows <code>Z</code>: how do you get rid of it? (2) what does exit code 137 mean? (3) why is <code>VIRT</code> in <code>top</code> a poor measure of memory use? (4) <code>0 12 15 * 1</code>: when does it run? (5) why does a script work by hand but not from cron? <em>Answers: deal with its parent — fix, kill or restart it, then init reaps it · killed by SIGKILL (128 + 9), often the OOM killer · it counts address space that was never touched · on the 15th or on any Monday, at 12:00 · because cron/systemd start with an empty environment and another PATH.</em></p>`,
    `<h3>⚠️ Lỗi hay gặp — cách đọc thông báo</h3>
<table>
<thead><tr><th>Triệu chứng hoặc thông báo</th><th>Nghĩa là</th><th>Cần kiểm tra</th></tr></thead>
<tbody>
<tr><td><code>Too many open files</code> (EMFILE)</td><td>tiến trình chạm giới hạn fd</td><td><code>ls /proc/PID/fd &#124; wc -l</code> so với <code>limits</code>; tìm chỗ rò; chỉ sau đó mới <code>LimitNOFILE=</code> / <code>ulimit -n</code></td></tr>
<tr><td>Container thoát với mã 137, không có lỗi</td><td>bị <code>SIGKILL</code> — thường là OOM killer</td><td><code>memory.events</code>, <code>dmesg &#124; grep -i oom</code>, <code>docker inspect</code> → <code>OOMKilled</code></td></tr>
<tr><td><code>free</code> hiện nhiều RAM trong container</td><td><code>/proc/meminfo</code> là của máy chủ</td><td>đọc <code>/sys/fs/cgroup/memory.max</code> và <code>memory.current</code></td></tr>
<tr><td>Tiến trình ở trạng thái <code>D</code> không chết được</td><td>chờ I/O không ngắt được (đĩa chậm, NFS)</td><td><code>iostat</code>, <code>dmesg</code>; nó được tính vào load average; <code>kill -9</code> không giúp</td></tr>
<tr><td>Tiến trình zombie (<code>Z</code>) tích tụ</td><td>tiến trình cha không bao giờ gọi <code>wait()</code></td><td>sửa hoặc khởi động lại cha; trong container dùng init (<code>--init</code>)</td></tr>
<tr><td><code>kill: (PID) - No such process</code></td><td>PID đã mất hoặc đã được dùng lại</td><td><code>pgrep -a</code>; dùng tên hoặc tệp PID cẩn thận</td></tr>
<tr><td><code>Operation not permitted</code> khi <code>kill</code> hay <code>renice</code></td><td>tiến trình không phải của bạn / bạn chỉ được tăng nice</td><td><code>sudo</code>, hoặc nhờ chủ sở hữu</td></tr>
<tr><td>Dịch vụ chạy trong terminal nhưng không chạy dưới systemd hay cron</td><td>môi trường rỗng, người dùng khác, đường dẫn tương đối</td><td>khai báo <code>Environment=</code> / <code>PATH</code>; đường dẫn tuyệt đối; xem <code>journalctl -u</code> hoặc log cron</td></tr>
<tr><td>Thay đổi unit bị bỏ qua</td><td>systemd vẫn giữ unit cũ trong bộ nhớ</td><td><code>systemctl daemon-reload</code>, rồi <code>restart</code></td></tr>
<tr><td>Job cron không chạy</td><td>sai thứ tự trường, <code>%</code> chưa thoát, múi giờ, hoặc daemon đã tắt</td><td>kiểm tra năm trường (Bài 8), log, và <code>date</code> trên server</td></tr>
</tbody>
</table>
<h3>📝 Nộp gì / chấm thế nào</h3>
<p>Định dạng chính xác của bài lab thật do giảng viên đặt; đây là bảng tự kiểm theo CLO8–10. Nộp <code>Lab4_&lt;MãSV&gt;.zip</code> gồm: tệp văn bản ghi terminal của mọi bài tập <em>chạy trên Linux của chính bạn</em> (để con số là của bạn), <code>doctor.sh</code> của bạn cùng ba đối tượng thử và output của chúng, một "ghi chú sự cố" một trang mô tả một phát hiện thật (ví dụ: "dịch vụ rò giữ 92 % giới hạn fd"), và câu trả lời cho các câu tự kiểm.</p>
<table>
<thead><tr><th>Tiêu chí</th><th>Điểm tối đa cần gì</th><th>Điểm</th></tr></thead>
<tbody>
<tr><td>Lệnh quan sát</td><td>Bài 1–6 tái hiện trên máy bạn với số liệu của bạn; mỗi trạng thái, trường và cột được giải thích</td><td>3</td></tr>
<tr><td>Đọc cấu hình</td><td>systemd unit và sáu dòng cron được giải thích từng dòng, gồm bẫy OR, <code>daemon-reload</code> và môi trường rỗng</td><td>2</td></tr>
<tr><td>Bài tập lớn</td><td>đủ 7 tính năng; thử trên ba đối tượng; mã thoát đúng; xử lý tên có dấu cách trong <code>stat</code></td><td>3</td></tr>
<tr><td>Lập luận</td><td>ghi chú sự cố nối một quan sát (fd, RSS, trạng thái, tải) với nguyên nhân và cách khắc phục; phân biệt bộ nhớ ảo với thường trú và máy chủ với container</td><td>1,5</td></tr>
<tr><td>An toàn</td><td>công cụ chỉ đọc; không dùng <code>kill -9</code> làm biện pháp đầu tiên; <code>pgrep -a</code> trước <code>pkill</code></td><td>0,5</td></tr>
</tbody>
</table>
<p>Tự kiểm: (1) một tiến trình hiện <code>Z</code>: làm sao loại bỏ nó? (2) mã thoát 137 nghĩa là gì? (3) vì sao <code>VIRT</code> trong <code>top</code> là thước đo bộ nhớ kém? (4) <code>0 12 15 * 1</code>: khi nào chạy? (5) vì sao một script chạy tay được mà từ cron thì không? <em>Đáp án: xử lý cha của nó — sửa, giết hoặc khởi động lại, rồi init thu dọn · bị SIGKILL giết (128 + 9), thường là OOM killer · nó tính cả không gian địa chỉ chưa từng chạm tới · vào ngày 15 hoặc vào mọi thứ Hai, lúc 12:00 · vì cron/systemd khởi động với môi trường rỗng và PATH khác.</em></p>`),
    bi(`<h2>🗂 Glossary — English → Vietnamese</h2>
<p>Every term of the chapter with its Vietnamese name and a one-sentence explanation. Cover the right-hand columns and test yourself.</p>
<table>
<thead><tr><th>Term (EN)</th><th>Vietnamese</th><th>In one sentence</th></tr></thead>
<tbody>
<tr><td><strong>process / PID / PPID</strong></td><td>tiến trình / mã / mã cha</td><td>A running program instance; each has a unique PID and the PID of the parent that created it.</td></tr>
<tr><td><strong>process state (S R T D Z)</strong></td><td>trạng thái tiến trình</td><td>Sleeping, running/runnable, stopped, uninterruptible sleep, zombie — the STAT column of ps.</td></tr>
<tr><td><strong>zombie</strong></td><td>tiến trình zombie</td><td>A finished process kept in the table until its parent calls wait(); kill the parent, not the zombie.</td></tr>
<tr><td><strong>/proc</strong></td><td>/proc</td><td>A virtual file system generated by the kernel: one directory per process plus system-wide files.</td></tr>
<tr><td><strong>RSS / VSZ (VIRT)</strong></td><td>bộ nhớ thường trú / ảo</td><td>RSS = RAM actually used now; VSZ = address space reserved, mostly never touched.</td></tr>
<tr><td><strong>memory map (maps)</strong></td><td>bản đồ bộ nhớ</td><td>The regions of a process address space with permissions: code, data, heap, stack, libraries.</td></tr>
<tr><td><strong>MemAvailable</strong></td><td>bộ nhớ khả dụng</td><td>Memory that can be given to programs without swapping: free plus reclaimable cache.</td></tr>
<tr><td><strong>load average</strong></td><td>tải trung bình</td><td>Average number of runnable plus uninterruptible tasks over 1, 5, 15 minutes; compare with CPU count.</td></tr>
<tr><td><strong>cgroup</strong></td><td>nhóm kiểm soát (cgroup)</td><td>Kernel feature that limits and accounts CPU, memory and I/O of a group of processes — the base of containers.</td></tr>
<tr><td><strong>OOM killer</strong></td><td>bộ giết khi hết bộ nhớ</td><td>The kernel sends SIGKILL to a process when memory runs out; exit code 137.</td></tr>
<tr><td><strong>signal</strong></td><td>tín hiệu</td><td>A notification to a process: TERM asks it to exit, KILL and STOP cannot be caught, CONT resumes.</td></tr>
<tr><td><strong>nice / renice</strong></td><td>độ nhường / đổi độ nhường</td><td>Scheduling priority hint from -20 (greedy) to 19 (polite); users may only raise it.</td></tr>
<tr><td><strong>job control</strong></td><td>điều khiển job</td><td>Shell features to run, stop, resume and list background jobs: &amp;, jobs, bg, fg, %N.</td></tr>
<tr><td><strong>nohup / setsid</strong></td><td>nohup / setsid</td><td>Detach a process from the terminal: ignore SIGHUP / start a new session.</td></tr>
<tr><td><strong>systemd / unit file</strong></td><td>systemd / tệp unit</td><td>The service manager (PID 1) and its text configuration: [Unit], [Service], [Install].</td></tr>
<tr><td><strong>Restart= policy</strong></td><td>chính sách khởi động lại</td><td>Tells systemd when to restart a service: no, on-failure, always.</td></tr>
<tr><td><strong>journalctl</strong></td><td>xem nhật ký journal</td><td>Reads the systemd journal: journalctl -u service -f follows one service.</td></tr>
<tr><td><strong>cron / crontab</strong></td><td>cron / bảng lịch</td><td>Daemon that runs commands on a schedule: minute hour day-of-month month day-of-week.</td></tr>
<tr><td><strong>file descriptor limit</strong></td><td>giới hạn fd</td><td>Per-process maximum of open files and sockets (ulimit -n, LimitNOFILE); exceeding it gives EMFILE.</td></tr>
</tbody>
</table>`,
    `<h2>🗂 Thuật ngữ — Anh → Việt</h2>
<p>Mọi thuật ngữ của chương, kèm nghĩa tiếng Việt và một câu giải thích. Che hai cột bên phải lại để tự kiểm tra.</p>
<table>
<thead><tr><th>Thuật ngữ (EN)</th><th>Nghĩa tiếng Việt</th><th>Giải thích một câu</th></tr></thead>
<tbody>
<tr><td><strong>process / PID / PPID</strong></td><td>tiến trình / mã / mã cha</td><td>Một thể hiện chương trình đang chạy; mỗi tiến trình có PID duy nhất và PID của cha đã tạo nó.</td></tr>
<tr><td><strong>process state (S R T D Z)</strong></td><td>trạng thái tiến trình</td><td>Ngủ, đang chạy/sẵn sàng, bị dừng, ngủ không ngắt được, zombie — cột STAT của ps.</td></tr>
<tr><td><strong>zombie</strong></td><td>tiến trình zombie</td><td>Tiến trình đã xong nhưng còn trong bảng cho tới khi cha gọi wait(); hãy xử lý cha, không phải zombie.</td></tr>
<tr><td><strong>/proc</strong></td><td>/proc</td><td>Hệ thống tệp ảo do nhân sinh ra: một thư mục cho mỗi tiến trình cùng các tệp toàn hệ thống.</td></tr>
<tr><td><strong>RSS / VSZ (VIRT)</strong></td><td>bộ nhớ thường trú / ảo</td><td>RSS = RAM thật đang dùng; VSZ = không gian địa chỉ đã giữ chỗ, phần lớn chưa bao giờ chạm tới.</td></tr>
<tr><td><strong>memory map (maps)</strong></td><td>bản đồ bộ nhớ</td><td>Các vùng của không gian địa chỉ tiến trình kèm quyền: mã, dữ liệu, heap, stack, thư viện.</td></tr>
<tr><td><strong>MemAvailable</strong></td><td>bộ nhớ khả dụng</td><td>Bộ nhớ có thể cấp cho chương trình mà không phải swap: rảnh cộng bộ đệm thu hồi được.</td></tr>
<tr><td><strong>load average</strong></td><td>tải trung bình</td><td>Số tác vụ sẵn sàng chạy cộng ngủ không ngắt được trung bình trong 1, 5, 15 phút; so với số CPU.</td></tr>
<tr><td><strong>cgroup</strong></td><td>nhóm kiểm soát (cgroup)</td><td>Tính năng của nhân giới hạn và đo CPU, bộ nhớ, I/O của một nhóm tiến trình — nền tảng của container.</td></tr>
<tr><td><strong>OOM killer</strong></td><td>bộ giết khi hết bộ nhớ</td><td>Nhân gửi SIGKILL cho một tiến trình khi hết bộ nhớ; mã thoát 137.</td></tr>
<tr><td><strong>signal</strong></td><td>tín hiệu</td><td>Thông báo gửi tới tiến trình: TERM yêu cầu thoát, KILL và STOP không bắt được, CONT cho chạy tiếp.</td></tr>
<tr><td><strong>nice / renice</strong></td><td>độ nhường / đổi độ nhường</td><td>Gợi ý ưu tiên lập lịch từ -20 (tham) tới 19 (nhường); người dùng chỉ được tăng.</td></tr>
<tr><td><strong>job control</strong></td><td>điều khiển job</td><td>Tính năng shell để chạy, dừng, tiếp tục và liệt kê job nền: &amp;, jobs, bg, fg, %N.</td></tr>
<tr><td><strong>nohup / setsid</strong></td><td>nohup / setsid</td><td>Tách tiến trình khỏi terminal: bỏ qua SIGHUP / bắt đầu phiên mới.</td></tr>
<tr><td><strong>systemd / unit file</strong></td><td>systemd / tệp unit</td><td>Trình quản lý dịch vụ (PID 1) và cấu hình dạng văn bản của nó: [Unit], [Service], [Install].</td></tr>
<tr><td><strong>Restart= policy</strong></td><td>chính sách khởi động lại</td><td>Cho systemd biết khi nào khởi động lại dịch vụ: no, on-failure, always.</td></tr>
<tr><td><strong>journalctl</strong></td><td>xem nhật ký journal</td><td>Đọc nhật ký của systemd: journalctl -u dịch_vụ -f theo dõi một dịch vụ.</td></tr>
<tr><td><strong>cron / crontab</strong></td><td>cron / bảng lịch</td><td>Daemon chạy lệnh theo lịch: phút giờ ngày-trong-tháng tháng ngày-trong-tuần.</td></tr>
<tr><td><strong>file descriptor limit</strong></td><td>giới hạn fd</td><td>Số tệp và socket mở tối đa của mỗi tiến trình (ulimit -n, LimitNOFILE); vượt thì gặp EMFILE.</td></tr>
</tbody>
</table>`),
    bi(`<h2>📌 Lab 4 summary</h2>
<ul>
<li><strong>Processes:</strong> <code>ps -eo pid,ppid,stat,ni,comm</code>, <code>pstree -p</code>, <code>top -b -n 1</code>; states S R T D Z; a zombie is cured at its parent; PID 1 adopts orphans.</li>
<li><strong><code>/proc/PID</code>:</strong> <code>comm</code>/<code>cmdline</code> can be rewritten, <code>exe</code> and <code>cwd</code> cannot; <code>status</code>, <code>environ</code>, <code>task/</code>, <code>stat</code> (strip the "(name)" before counting fields), <code>fd/</code>, <code>limits</code>, <code>maps</code>.</li>
<li><strong>Memory:</strong> VIRT is a promise, RSS is RAM; pages arrive on first touch; <code>MemAvailable</code> (not <code>MemFree</code>) is what is really left; swap is slow.</li>
<li><strong>Containers:</strong> <code>/proc/meminfo</code>, <code>cpuinfo</code>, <code>loadavg</code> show the host; the real limit is in the cgroup; over the limit → OOM kill, exit 137, <code>memory.events</code>.</li>
<li><strong>Signals and priority:</strong> TERM (15) asks, KILL (9) and STOP cannot be caught; STOP/CONT freeze and resume; <code>kill -0</code> tests; <code>nice</code> only matters under contention and users can only raise it.</li>
<li><strong>Background jobs:</strong> <code>set -m</code> in scripts; <code>jobs</code>, <code>bg</code>, <code>%N</code>; orphans are adopted by PID 1; <code>nohup</code>/<code>setsid</code> detach — a service manager does it properly.</li>
<li><strong>systemd:</strong> <code>[Unit]</code> ordering, <code>[Service]</code> User/WorkingDirectory/Environment/ExecStart (absolute)/Restart/limits, <code>[Install]</code> WantedBy; <code>daemon-reload</code> after edits; <code>journalctl -u</code>; services start with an empty environment.</li>
<li><strong>cron:</strong> minute hour day-of-month month day-of-week; lists, ranges, steps; day-of-month and day-of-week are OR-ed when both are restricted; empty environment, <code>\\%</code>, redirect output, UTC, lock against overlap.</li>
<li><strong>Process doctor:</strong> identity → age → memory → fds → ports → zombies → verdict, all from <code>/proc</code>. <strong>Next:</strong> ⭐ CS.7 teaches how to read load average, <code>top</code> and the performance tools in depth.</li>
</ul>`,
    `<h2>📌 Tóm tắt Lab 4</h2>
<ul>
<li><strong>Tiến trình:</strong> <code>ps -eo pid,ppid,stat,ni,comm</code>, <code>pstree -p</code>, <code>top -b -n 1</code>; trạng thái S R T D Z; zombie chữa ở cha của nó; PID 1 nhận nuôi tiến trình mồ côi.</li>
<li><strong><code>/proc/PID</code>:</strong> <code>comm</code>/<code>cmdline</code> có thể bị viết lại, <code>exe</code> và <code>cwd</code> thì không; <code>status</code>, <code>environ</code>, <code>task/</code>, <code>stat</code> (cắt "(tên)" trước khi đếm trường), <code>fd/</code>, <code>limits</code>, <code>maps</code>.</li>
<li><strong>Bộ nhớ:</strong> VIRT là lời hứa, RSS là RAM; trang tới ở lần chạm đầu; <code>MemAvailable</code> (không phải <code>MemFree</code>) mới là thứ thật sự còn lại; swap chậm.</li>
<li><strong>Container:</strong> <code>/proc/meminfo</code>, <code>cpuinfo</code>, <code>loadavg</code> hiện máy chủ; giới hạn thật nằm trong cgroup; vượt giới hạn → OOM kill, mã 137, <code>memory.events</code>.</li>
<li><strong>Tín hiệu và ưu tiên:</strong> TERM (15) xin, KILL (9) và STOP không bắt được; STOP/CONT đóng băng và chạy tiếp; <code>kill -0</code> để thử; <code>nice</code> chỉ có ý nghĩa khi tranh chấp và người dùng chỉ tăng được.</li>
<li><strong>Job nền:</strong> <code>set -m</code> trong script; <code>jobs</code>, <code>bg</code>, <code>%N</code>; tiến trình mồ côi được PID 1 nhận nuôi; <code>nohup</code>/<code>setsid</code> tách rời — trình quản lý dịch vụ làm việc đó đúng đắn.</li>
<li><strong>systemd:</strong> <code>[Unit]</code> thứ tự, <code>[Service]</code> User/WorkingDirectory/Environment/ExecStart (tuyệt đối)/Restart/giới hạn, <code>[Install]</code> WantedBy; <code>daemon-reload</code> sau khi sửa; <code>journalctl -u</code>; dịch vụ khởi động với môi trường rỗng.</li>
<li><strong>cron:</strong> phút giờ ngày-trong-tháng tháng ngày-trong-tuần; danh sách, khoảng, bước; ngày-trong-tháng và ngày-trong-tuần được OR khi cả hai bị hạn chế; môi trường rỗng, <code>\\%</code>, chuyển hướng output, UTC, khoá chống chạy chồng.</li>
<li><strong>Bác sĩ tiến trình:</strong> danh tính → tuổi → bộ nhớ → fd → cổng → zombie → phán quyết, tất cả từ <code>/proc</code>. <strong>Tiếp theo:</strong> ⭐ CS.7 dạy đọc load average, <code>top</code> và các công cụ hiệu năng một cách sâu hơn.</li>
</ul>`),
  ].join('\n'),
};

/* ───────── Quiz (osg202-quiz-ch7) — 10 câu ───────── */
const QUIZ = {
  timeLimitSeconds: 900,
  questions: [
    { id: 'q1',
      question: 'A file is given permissions with `chmod 754 report.sh`. What does `ls -l` show in the permission column?|||Một tệp được đặt quyền bằng `chmod 754 report.sh`. Cột quyền của `ls -l` hiện gì?',
      options: ['-rwxrw-r--|||-rwxrw-r--', '-rwxr-xr--|||-rwxr-xr--', '-rwxr--r-x|||-rwxr--r-x', '-rw-r-xr--|||-rw-r-xr--'],
      correctIndex: 1,
      points: 1,
      explanation: 'Run for real: each octal digit is read=4 + write=2 + execute=1 for owner, group, others. 7 = 4+2+1 = rwx, 5 = 4+1 = r-x, 4 = r--, so -rwxr-xr--. -rwxrw-r-- would be 764; -rw-r-xr-- would be 654. Lab 1 (permissions).|||Chạy thật: mỗi chữ số bát phân là đọc=4 + ghi=2 + thực thi=1 cho chủ, nhóm, người khác. 7 = 4+2+1 = rwx, 5 = 4+1 = r-x, 4 = r--, nên ra -rwxr-xr--. -rwxrw-r-- là 764; -rw-r-xr-- là 654. Lab 1 (quyền).' },
    { id: 'q2',
      question: 'With `umask 027`, a program creates a new regular file (requested mode 666). What mode does the file get?|||Với `umask 027`, một chương trình tạo tệp thường mới (xin quyền 666). Tệp nhận quyền nào?',
      options: ['750|||750', '027|||027', '640|||640', '666|||666'],
      correctIndex: 2,
      points: 1,
      explanation: 'Run for real: the umask REMOVES bits — 666 with 027 masked out = 640 (rw-r-----): the group loses write, others lose everything. 750 is what a new DIRECTORY gets (requested 777). The umask is not the resulting mode, and 666 would mean no umask at all. Servers often use 027 so that log files are not world-readable. Lab 1.|||Chạy thật: umask XOÁ bit — 666 bị che 027 = 640 (rw-r-----): nhóm mất quyền ghi, người khác mất hết. 750 là quyền của THƯ MỤC mới (xin 777). umask không phải quyền kết quả, còn 666 nghĩa là không có umask. Server hay dùng 027 để tệp log không ai ngoài nhóm đọc được. Lab 1.' },
    { id: 'q3',
      question: 'In bash, you type a command name that does not exist, then `echo $?`. What is printed?|||Trong bash, bạn gõ tên một lệnh không tồn tại rồi `echo $?`. In ra gì?',
      options: ['0|||0', '1|||1', '126|||126', '127|||127'],
      correctIndex: 3,
      points: 1,
      explanation: 'Run for real: 127 means "command not found"; 126 means "found but not executable" (missing x permission). 1 is a generic failure reported by a program that DID run, and 0 is success. Health-check scripts and CI read these codes, so it pays to know them. Lab 2 (exit codes) and ⭐ CS.1.|||Chạy thật: 127 nghĩa là "không tìm thấy lệnh"; 126 là "tìm thấy nhưng không chạy được" (thiếu quyền x). 1 là lỗi chung do một chương trình ĐÃ chạy báo ra, còn 0 là thành công. Script kiểm tra sức khoẻ và CI đọc các mã này, nên cần thuộc. Lab 2 (mã thoát) và ⭐ CS.1.' },
    { id: 'q4',
      question: "\"X=world; echo '[$X]' \\\"[$X]\\\"\" — what does bash print?|||\"X=world; echo '[$X]' \\\"[$X]\\\"\" — bash in ra gì?",
      options: ['[$X] [world]|||[$X] [world]', '[world] [world]|||[world] [world]', '[$X] [$X]|||[$X] [$X]', '[world] [$X]|||[world] [$X]'],
      correctIndex: 0,
      points: 1,
      explanation: "Run for real: inside single quotes nothing is expanded, so '[$X]' stays literally [$X]; inside double quotes variables ARE expanded, so \"[$X]\" becomes [world]. This is why scripts write \"$file\" in double quotes (expanded, but spaces kept) and use single quotes for literal text. Lab 2 (quoting).|||Chạy thật: trong nháy đơn không có gì được mở rộng, nên '[$X]' giữ nguyên [$X]; trong nháy kép biến ĐƯỢC mở rộng, nên \"[$X]\" thành [world]. Vì vậy script viết \"$file\" trong nháy kép (được mở rộng, nhưng giữ khoảng trắng) và dùng nháy đơn cho chữ nguyên văn. Lab 2 (trích dẫn)." },
    { id: 'q5',
      question: '`touch a; ln a b; ln -s a c` — what link count does `stat -c %h a` report for `a`?|||`touch a; ln a b; ln -s a c` — `stat -c %h a` báo số liên kết của `a` là bao nhiêu?',
      options: ['1|||1', '3|||3', '2|||2', '0|||0'],
      correctIndex: 2,
      points: 1,
      explanation: "Run for real: a hard link (ln) is a second directory entry pointing to the SAME i-node, so the i-node's link count goes 1 → 2. A symbolic link (ln -s) is a separate small file that stores the path \"a\"; it has its own i-node and does not change a's count. Deleting a would leave b working and c dangling. Lab 1 and lesson 4.B (i-nodes).|||Chạy thật: hard link (ln) là một mục thư mục thứ hai trỏ tới CÙNG i-node, nên số liên kết của i-node tăng 1 → 2. Symbolic link (ln -s) là một tệp nhỏ riêng lưu đường dẫn \"a\"; nó có i-node riêng và không làm đổi số của a. Xoá a thì b vẫn dùng được, còn c thành link gãy. Lab 1 và bài 4.B (i-node)." },
    { id: 'q6',
      question: 'A script is run as `./deploy.sh a "b c" d`. What does `echo $#` print inside it?|||Một script được chạy bằng `./deploy.sh a "b c" d`. Bên trong, `echo $#` in ra gì?',
      options: ['4|||4', '3|||3', '1|||1', '5|||5'],
      correctIndex: 1,
      points: 1,
      explanation: 'Run for real: $# is the number of arguments, and the quoted "b c" is ONE argument, so a, "b c", d = 3. Without the quotes it would be 4. Iterate with "$@" (in double quotes) so that "b c" stays one item. Lab 2 (arguments).|||Chạy thật: $# là số đối số, và "b c" trong nháy là MỘT đối số, nên a, "b c", d = 3. Không có nháy thì sẽ là 4. Duyệt bằng "$@" (trong nháy kép) để "b c" vẫn là một phần tử. Lab 2 (đối số).' },
    { id: 'q7',
      question: 'A C program runs `fork(); fork(); puts("hi");` and every process prints once. How many lines of "hi" appear?|||Một chương trình C chạy `fork(); fork(); puts("hi");` và mỗi tiến trình in một lần. Có bao nhiêu dòng "hi"?',
      options: ['2|||2', '3|||3', '1|||1', '4|||4'],
      correctIndex: 3,
      points: 1,
      explanation: 'Run for real: the first fork makes 2 processes; BOTH run the second fork, giving 4; all 4 reach puts. In general n forks in a row give 2ⁿ processes. 3 is the common mistake of thinking only the child forks again. Lab 3 (fork/exec/wait) and lesson 2.A.|||Chạy thật: fork thứ nhất tạo 2 tiến trình; CẢ HAI chạy fork thứ hai, thành 4; cả 4 tới puts. Tổng quát: n lần fork liên tiếp cho 2ⁿ tiến trình. 3 là lỗi hay gặp khi nghĩ chỉ tiến trình con fork tiếp. Lab 3 (fork/exec/wait) và bài 2.A.' },
    { id: 'q8',
      question: 'What does `2>&1` mean in `./backup.sh > backup.log 2>&1`?|||`2>&1` trong `./backup.sh > backup.log 2>&1` nghĩa là gì?',
      options: ['Send standard error (fd 2) to wherever standard output (fd 1) currently goes — the log file|||Gửi lỗi chuẩn (fd 2) tới nơi đầu ra chuẩn (fd 1) đang trỏ — tức tệp log', 'Run the script twice and keep the first output|||Chạy script hai lần và giữ đầu ra lần đầu', 'Write the log to a file named "1"|||Ghi log vào một tệp tên "1"', 'Send standard output to standard error|||Gửi đầu ra chuẩn sang lỗi chuẩn'],
      correctIndex: 0,
      points: 1,
      explanation: 'Redirections are applied left to right: `> backup.log` points fd 1 at the file, then `2>&1` makes fd 2 a copy of fd 1 (the shell calls dup2), so errors land in the same log. Written in the other order (`2>&1 > log`) errors would still go to the terminal. Without `&`, `2>1` would create a file called 1. Lab 1 (redirection) and ⭐ CS.2.|||Các chuyển hướng áp dụng từ trái sang phải: `> backup.log` trỏ fd 1 vào tệp, rồi `2>&1` làm fd 2 thành bản sao của fd 1 (shell gọi dup2), nên lỗi vào cùng tệp log. Viết ngược thứ tự (`2>&1 > log`) thì lỗi vẫn ra màn hình. Thiếu `&`, `2>1` sẽ tạo một tệp tên 1. Lab 1 (chuyển hướng) và ⭐ CS.2.' },
    { id: 'q9',
      question: 'Which signal can a process NOT catch, block or ignore?|||Tín hiệu nào tiến trình KHÔNG thể bắt, chặn hay bỏ qua?',
      options: ['SIGTERM (15)|||SIGTERM (15)', 'SIGINT (2)|||SIGINT (2)', 'SIGKILL (9)|||SIGKILL (9)', 'SIGHUP (1)|||SIGHUP (1)'],
      correctIndex: 2,
      points: 1,
      explanation: 'SIGKILL (and SIGSTOP) are handled by the kernel itself: no handler runs, so the program gets no chance to clean up — its exit status shows 137 = 128 + 9. SIGTERM (what `kill` and `docker stop` send first) can be caught for a graceful shutdown; SIGINT is Ctrl+C; SIGHUP is sent when the terminal closes. Lab 4 (kill) and ⭐ CS.1.|||SIGKILL (và SIGSTOP) do chính nhân xử lý: không handler nào chạy, nên chương trình không kịp dọn dẹp — mã thoát hiện 137 = 128 + 9. SIGTERM (thứ `kill` và `docker stop` gửi trước) bắt được để tắt êm; SIGINT là Ctrl+C; SIGHUP được gửi khi terminal đóng. Lab 4 (kill) và ⭐ CS.1.' },
    { id: 'q10',
      question: 'Which command lists the `.log` files under /var/log that were modified within the last day?|||Lệnh nào liệt kê các tệp `.log` trong /var/log được sửa trong vòng một ngày qua?',
      options: ['grep -r ".log" /var/log --days 1|||grep -r ".log" /var/log --days 1', 'find /var/log -name "*.log" -mtime -1|||find /var/log -name "*.log" -mtime -1', 'ls /var/log/*.log -1day|||ls /var/log/*.log -1day', 'find /var/log -name *.log -mtime +1|||find /var/log -name *.log -mtime +1'],
      correctIndex: 1,
      points: 1,
      explanation: 'find walks the tree; -name "*.log" matches the name (quoted so the shell does not expand the * first); -mtime -1 means "modified less than 1 day ago" (+1 would mean MORE than a day ago). grep searches file CONTENTS and has no --days; ls has no such option. Lab 1 (find/grep).|||find duyệt cây thư mục; -name "*.log" so tên (để trong nháy để shell không mở rộng dấu * trước); -mtime -1 nghĩa là "sửa cách đây chưa tới 1 ngày" (+1 là HƠN một ngày). grep tìm trong NỘI DUNG tệp và không có --days; ls không có tuỳ chọn đó. Lab 1 (find/grep).' },
  ],
};

export default {
  extrasEnd: [L_x_lab_1, L_x_lab_2, L_x_lab_3, L_x_lab_4],
  quiz: QUIZ,
  quizDescription: '10 câu ôn Chương 7 (Linux & Shell — bài 7.1, 7.2 và Lab 1–4) viết lại, mỗi câu có giải thích song ngữ; 7 câu "in ra gì" có đáp án kiểm bằng chương trình chạy thật trên Linux: chuỗi quyền của chmod 754, quyền tệp mới với umask 027, mã thoát của lệnh không tồn tại, nháy đơn và nháy kép, số liên kết cứng, $# của script, fork hai lần; cùng 2>&1, tín hiệu không bắt được và lệnh find.',
};
