/**
 * LOS201 — Linux and Open Source Platform. Ngành Thiết kế vi mạch bán dẫn, kỳ 3.
 * Giáo trình: Shotts "The Linux Command Line"; Nemeth "Unix and Linux System
 * Administration Handbook"; Sobell "A Practical Guide to Linux Commands"; The
 * Linux Documentation Project. Song ngữ + lệnh shell thực hành + quiz.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; escape <>&.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const taiLieu = doc('los201-0-0-tai-lieu', '📚 Course materials &amp; references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách (Shotts, Nemeth, Sobell), tài liệu chính thức miễn phí (TLDP, man pages), YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">LOS201 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn <strong>Linux &amp; the open-source platform</strong> — from the command line and filesystem to Bash scripting, package management, services and open-source dev tools — in one place. The official slides &amp; syllabus live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Syllabus &amp; slides</h3>
<p>The official FPTU syllabus &amp; lecture slides for LOS201 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://linuxcommand.org/tlcl.php" target="_blank" rel="noopener"><em>The Linux Command Line</em> — William Shotts</a> (free PDF)</li>
<li><a href="https://www.admin.com/" target="_blank" rel="noopener"><em>Unix and Linux System Administration Handbook</em> — Nemeth et al.</a></li>
<li><a href="https://sobell.com/" target="_blank" rel="noopener"><em>A Practical Guide to Linux Commands, Editors, and Shell Programming</em> — Sobell</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://tldp.org/" target="_blank" rel="noopener">The Linux Documentation Project (TLDP)</a> — guides &amp; HOWTOs</li>
<li><a href="https://www.gnu.org/software/bash/manual/" target="_blank" rel="noopener">GNU Bash Reference Manual</a></li>
<li><a href="https://man7.org/linux/man-pages/" target="_blank" rel="noopener">Linux man pages (man7.org)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@LearnLinuxTV" target="_blank" rel="noopener">Learn Linux TV</a> — Linux from basics to sysadmin</li>
<li><a href="https://www.youtube.com/@DistroTube" target="_blank" rel="noopener">DistroTube</a> — the command line &amp; open-source tooling</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.virtualbox.org/" target="_blank" rel="noopener">VirtualBox</a> — run a Linux VM safely on any OS</li>
<li><a href="https://ubuntu.com/wsl" target="_blank" rel="noopener">WSL (Ubuntu on Windows)</a> — a real Linux shell inside Windows</li>
<li><a href="https://explainshell.com/" target="_blank" rel="noopener">explainshell.com</a> — break any command into its man-page parts</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation</strong> — install a VM, learn the shell, filesystem, and the man pages.</li>
<li><strong>Operate</strong> — processes, users, permissions, package management and services.</li>
<li><strong>Automate</strong> — write Bash scripts and wire them into systemd.</li>
<li><strong>Contribute</strong> — use git/make/gcc, read source, and open your first pull request.</li>
</ol></div>`,
    `<span class="eyebrow">LOS201 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học <strong>Linux &amp; nền tảng mã nguồn mở</strong> — từ dòng lệnh và hệ thống tập tin đến Bash script, quản lý gói, dịch vụ và công cụ phát triển mã nguồn mở — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của LOS201 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://linuxcommand.org/tlcl.php" target="_blank" rel="noopener"><em>The Linux Command Line</em> — William Shotts</a> (PDF miễn phí)</li>
<li><a href="https://www.admin.com/" target="_blank" rel="noopener"><em>Unix and Linux System Administration Handbook</em> — Nemeth và cộng sự</a></li>
<li><a href="https://sobell.com/" target="_blank" rel="noopener"><em>A Practical Guide to Linux Commands, Editors, and Shell Programming</em> — Sobell</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://tldp.org/" target="_blank" rel="noopener">The Linux Documentation Project (TLDP)</a> — hướng dẫn &amp; HOWTO</li>
<li><a href="https://www.gnu.org/software/bash/manual/" target="_blank" rel="noopener">Sổ tay tham chiếu GNU Bash</a></li>
<li><a href="https://man7.org/linux/man-pages/" target="_blank" rel="noopener">Trang man Linux (man7.org)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@LearnLinuxTV" target="_blank" rel="noopener">Learn Linux TV</a> — Linux từ cơ bản đến quản trị</li>
<li><a href="https://www.youtube.com/@DistroTube" target="_blank" rel="noopener">DistroTube</a> — dòng lệnh &amp; công cụ mã nguồn mở</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.virtualbox.org/" target="_blank" rel="noopener">VirtualBox</a> — chạy máy ảo Linux an toàn trên mọi hệ điều hành</li>
<li><a href="https://ubuntu.com/wsl" target="_blank" rel="noopener">WSL (Ubuntu trên Windows)</a> — shell Linux thật ngay trong Windows</li>
<li><a href="https://explainshell.com/" target="_blank" rel="noopener">explainshell.com</a> — tách một lệnh ra từng phần theo man page</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — cài máy ảo, học shell, hệ thống tập tin và trang man.</li>
<li><strong>Vận hành</strong> — tiến trình, người dùng, quyền, quản lý gói và dịch vụ.</li>
<li><strong>Tự động hoá</strong> — viết Bash script và cắm vào systemd.</li>
<li><strong>Đóng góp</strong> — dùng git/make/gcc, đọc mã nguồn, mở pull request đầu tiên.</li>
</ol></div>`,
  ]]);

const intro = doc('los201-0-1-overview', 'Course overview: Linux &amp; open source|||Tổng quan: Linux &amp; mã nguồn mở',
  'Linux là gì, vì sao ngành vi mạch dùng Linux; kernel vs distro; triết lý mã nguồn mở; lộ trình 8 chương: giấy phép → shell → tiến trình/quyền → Bash → gói → mạng/systemd → công cụ dev → đóng góp.',
  [[
    `<span class="eyebrow">LOS201 · Lesson 0.1 · Overview</span>
<h2>Linux &amp; the open-source platform</h2>
<p class="lead">This course teaches you to <strong>work confidently on a Linux system</strong> and to understand the <strong>open-source model</strong> that produced it. Nearly all chip-design (EDA) flows, servers, and cloud infrastructure run on Linux — so for a semiconductor engineer, the Linux command line is a daily tool, not an optional one.</p>
<h3>Kernel vs. distribution</h3>
<ul>
<li><strong>The Linux kernel</strong> — the core that talks to hardware, manages memory, processes and files. Started by Linus Torvalds in 1991.</li>
<li><strong>A distribution (distro)</strong> — the kernel plus GNU tools, a package manager and defaults, bundled together (Ubuntu, Debian, Fedora, CentOS/Rocky).</li>
</ul>
<h3>Why "open source" matters</h3>
<p>Open-source software ships with its <strong>source code</strong> and a <strong>license</strong> that lets you run, study, modify and share it. That model gave us Linux, Git, GCC and the open EDA tools you'll meet in Chapter 7.</p>
<h3>Roadmap</h3>
<p>History &amp; licenses → the shell &amp; filesystem → processes, users &amp; permissions → Bash scripting → package management → networking &amp; systemd → open-source dev tools (git/make/gcc, EDA) → community &amp; contributing. Bilingual, with hands-on commands and a quiz per chapter.</p>`,
    `<span class="eyebrow">LOS201 · Bài 0.1 · Tổng quan</span>
<h2>Linux &amp; nền tảng mã nguồn mở</h2>
<p class="lead">Môn này dạy bạn <strong>làm việc tự tin trên hệ thống Linux</strong> và hiểu <strong>mô hình mã nguồn mở</strong> đã tạo ra nó. Gần như mọi luồng thiết kế vi mạch (EDA), máy chủ và hạ tầng đám mây đều chạy trên Linux — nên với kỹ sư bán dẫn, dòng lệnh Linux là công cụ hằng ngày, không phải lựa chọn thêm.</p>
<h3>Kernel và bản phân phối</h3>
<ul>
<li><strong>Nhân Linux (kernel)</strong> — lõi giao tiếp với phần cứng, quản lý bộ nhớ, tiến trình và tập tin. Linus Torvalds khởi tạo năm 1991.</li>
<li><strong>Bản phân phối (distro)</strong> — kernel cộng bộ công cụ GNU, trình quản lý gói và cấu hình mặc định, đóng gói cùng nhau (Ubuntu, Debian, Fedora, CentOS/Rocky).</li>
</ul>
<h3>Vì sao "mã nguồn mở" quan trọng</h3>
<p>Phần mềm mã nguồn mở đi kèm <strong>mã nguồn</strong> và một <strong>giấy phép</strong> cho phép bạn chạy, nghiên cứu, sửa và chia sẻ. Mô hình đó cho ta Linux, Git, GCC và những công cụ EDA mở bạn sẽ gặp ở Chương 7.</p>
<h3>Lộ trình</h3>
<p>Lịch sử &amp; giấy phép → shell &amp; hệ thống tập tin → tiến trình, người dùng &amp; quyền → Bash script → quản lý gói → mạng &amp; systemd → công cụ dev mã nguồn mở (git/make/gcc, EDA) → cộng đồng &amp; đóng góp. Song ngữ, có lệnh thực hành và quiz mỗi chương.</p>`,
  ]]);

const c1 = doc('los201-1-1-history-licenses', '1.1 — Linux/GNU history &amp; open-source licenses|||1.1 — Lịch sử Linux/GNU &amp; giấy phép mã nguồn mở',
  'Unix → GNU (Stallman, 1983) → kernel Linux (Torvalds, 1991); triết lý phần mềm tự do vs mã nguồn mở; giấy phép GPL (copyleft) vs MIT/BSD/Apache (dễ dãi); vì sao chọn giấy phép đúng.',
  [[
    `<span class="eyebrow">LOS201 · Chapter 1 · Lesson 1.1</span>
<h2>Linux/GNU history &amp; open-source licenses</h2>
<h3>From Unix to GNU/Linux</h3>
<ul>
<li><strong>Unix (1970s, Bell Labs)</strong> — the ancestor: multi-user, multitasking, "everything is a file", small tools joined by pipes.</li>
<li><strong>GNU (1983, Richard Stallman)</strong> — a project to build a free Unix-like OS and its tools (bash, gcc, coreutils). It also created the <strong>Free Software Foundation</strong> and the GPL.</li>
<li><strong>The Linux kernel (1991, Linus Torvalds)</strong> — the missing piece. GNU tools + Linux kernel = a complete free OS, hence the name <strong>GNU/Linux</strong>.</li>
</ul>
<h3>Free software vs. open source</h3>
<p><strong>"Free software"</strong> (FSF) stresses the user's freedom to run, study, modify and share. <strong>"Open source"</strong> (OSI) stresses the practical, collaborative development model. Same code, different emphasis — the "four freedoms" vs. the "Open Source Definition".</p>
<h3>The license decides what others may do</h3>
<ul>
<li><strong>GPL (copyleft)</strong> — you may use and modify, but if you distribute, you must release your source under the GPL too. It keeps derivatives open.</li>
<li><strong>MIT / BSD (permissive)</strong> — do almost anything, even ship a closed-source product, as long as you keep the copyright notice.</li>
<li><strong>Apache 2.0</strong> — permissive, plus an explicit <strong>patent grant</strong> — popular for large corporate-backed projects.</li>
</ul>
<pre><code># See the license shipped with a package on Debian/Ubuntu:
cat /usr/share/doc/bash/copyright

# Many projects keep it at the repo root:
less LICENSE
</code></pre>
<div class="callout"><span class="badge">Why it matters for chips</span> Open EDA tools and CPU cores (RISC-V) are released under these licenses. Picking GPL vs. permissive decides whether the community can build on your work — and whether you can build on theirs.</div>`,
    `<span class="eyebrow">LOS201 · Chương 1 · Bài 1.1</span>
<h2>Lịch sử Linux/GNU &amp; giấy phép mã nguồn mở</h2>
<h3>Từ Unix đến GNU/Linux</h3>
<ul>
<li><strong>Unix (thập ni 1970, Bell Labs)</strong> — tổ tiên: đa người dùng, đa nhiệm, "mọi thứ là tập tin", nhiều công cụ nhỏ nối bằng pipe.</li>
<li><strong>GNU (1983, Richard Stallman)</strong> — dự án dựng một hệ điều hành tự do kiểu Unix và bộ công cụ (bash, gcc, coreutils). Cũng lập ra <strong>Free Software Foundation</strong> và giấy phép GPL.</li>
<li><strong>Nhân Linux (1991, Linus Torvalds)</strong> — mảnh còn thiếu. Công cụ GNU + nhân Linux = hệ điều hành tự do trọn vẹn, nên có tên <strong>GNU/Linux</strong>.</li>
</ul>
<h3>Phần mềm tự do và mã nguồn mở</h3>
<p><strong>"Phần mềm tự do"</strong> (FSF) nhấn mạnh quyền tự do của người dùng: chạy, nghiên cứu, sửa và chia sẻ. <strong>"Mã nguồn mở"</strong> (OSI) nhấn mạnh mô hình phát triển hợp tác, thực dụng. Cùng mã nguồn, khác trọng tâm — "bốn quyền tự do" so với "Định nghĩa mã nguồn mở".</p>
<h3>Giấy phép quyết định người khác được làm gì</h3>
<ul>
<li><strong>GPL (copyleft)</strong> — được dùng và sửa, nhưng khi phân phối thì phải công bố mã nguồn của bạn cũng theo GPL. Giữ cho bản dẫn xuất luôn mở.</li>
<li><strong>MIT / BSD (dễ dãi)</strong> — làm gần như mọi thứ, kể cả bán sản phẩm đóng mã, miễn giữ lại dòng bản quyền.</li>
<li><strong>Apache 2.0</strong> — dễ dãi, cộng thêm điều khoản <strong>cấp quyền sáng chế</strong> rõ ràng — phổ biến ở các dự án lớn có doanh nghiệp hậu thuẫn.</li>
</ul>
<pre><code># Xem giấy phép đi kèm một gói trên Debian/Ubuntu:
cat /usr/share/doc/bash/copyright

# Nhiều dự án đặt ngay ở gốc kho:
less LICENSE
</code></pre>
<div class="callout"><span class="badge">Vì sao quan trọng với vi mạch</span> Công cụ EDA mở và lõi CPU (RISC-V) được phát hành theo các giấy phép này. Chọn GPL hay dễ dãi quyết định cộng đồng có xây tiếp trên việc của bạn được không — và bạn có xây trên việc của họ được không.</div>`,
  ]]);

const c1q = quiz('los201-quiz-1', 'Quiz 1 — History &amp; licenses|||Quiz 1 — Lịch sử &amp; giấy phép', [
  { id: 'q1', question: 'Ai khởi tạo nhân (kernel) Linux năm 1991?', options: ['Richard Stallman', 'Linus Torvalds', 'Ken Thompson', 'Dennis Ritchie'], correctIndex: 1, explanation: 'Linus Torvalds viết nhân Linux năm 1991; Stallman lập dự án GNU (1983).' },
  { id: 'q2', question: 'Giấy phép nào là "copyleft" — buộc bản dẫn xuất khi phân phối cũng phải mở mã?', options: ['MIT', 'BSD', 'GPL', 'Apache 2.0'], correctIndex: 2, explanation: 'GPL là copyleft: phân phối bản sửa đổi thì phải công bố mã nguồn theo GPL.' },
  { id: 'q3', question: 'Điểm riêng nổi bật của giấy phép Apache 2.0 so với MIT?', options: ['Cấm dùng thương mại', 'Có điều khoản cấp quyền sáng chế rõ ràng', 'Buộc mở toàn bộ mã', 'Không cho sửa mã'], correctIndex: 1, explanation: 'Apache 2.0 dễ dãi nhưng bổ sung điều khoản cấp quyền sáng chế (patent grant).' },
]);

const c2 = doc('los201-2-1-shell-filesystem', '2.1 — The command line &amp; filesystem|||2.1 — Dòng lệnh &amp; hệ thống tập tin',
  'Shell là gì; cấu trúc lệnh; cây thư mục FHS (/, /home, /etc, /bin, /var); di chuyển & liệt kê (pwd/ls/cd); thao tác tập tin (cp/mv/rm/mkdir); đường dẫn tuyệt đối/tương đối; đọc file & tìm kiếm; man pages.',
  [[
    `<span class="eyebrow">LOS201 · Chapter 2 · Lesson 2.1</span>
<h2>The command line &amp; filesystem</h2>
<h3>The shell</h3>
<p>The <strong>shell</strong> (usually <code>bash</code>) reads commands you type and asks the kernel to run them. A command is <strong>command + options + arguments</strong>, e.g. <code>ls -l /etc</code>.</p>
<h3>One tree, mounted at /</h3>
<p>Linux has a single tree starting at the root <code>/</code> (the <strong>FHS</strong>):</p>
<ul>
<li><code>/home</code> — user home directories · <code>/root</code> — root's home</li>
<li><code>/etc</code> — system config files · <code>/var</code> — logs &amp; changing data</li>
<li><code>/bin</code>, <code>/usr/bin</code> — programs · <code>/tmp</code> — temporary files</li>
</ul>
<h3>Move around &amp; look</h3>
<pre><code>pwd                 # print working directory (where am I?)
ls -lah /etc        # long listing, all files, human sizes
cd /var/log         # change directory (absolute path)
cd ..               # go up one level
cd ~                # go to your home directory
</code></pre>
<h3>Create, copy, move, delete</h3>
<pre><code>mkdir -p project/src        # make nested dirs
cp file.txt backup.txt      # copy
mv old.txt new.txt          # rename / move
rm -i note.txt              # delete (ask first)
rm -r project/              # delete a directory tree (careful!)
</code></pre>
<h3>Read files &amp; search</h3>
<pre><code>cat notes.txt               # print a whole file
less big.log                # scroll a large file (q to quit)
grep -rn "TODO" src/        # find text in files, recursively
man ls                      # the manual page for any command
</code></pre>
<div class="callout"><span class="badge">Absolute vs. relative</span> A path starting with <code>/</code> is absolute (from the root); anything else is relative to your current directory. <code>~</code> always means your home.</div>`,
    `<span class="eyebrow">LOS201 · Chương 2 · Bài 2.1</span>
<h2>Dòng lệnh &amp; hệ thống tập tin</h2>
<h3>Shell</h3>
<p><strong>Shell</strong> (thường là <code>bash</code>) đọc lệnh bạn gõ và nhờ kernel chạy. Một lệnh gồm <strong>tên lệnh + tuỳ chọn + tham số</strong>, ví dụ <code>ls -l /etc</code>.</p>
<h3>Một cây duy nhất, gắn tại /</h3>
<p>Linux có một cây duy nhất bắt đầu từ gốc <code>/</code> (chuẩn <strong>FHS</strong>):</p>
<ul>
<li><code>/home</code> — thư mục nhà người dùng · <code>/root</code> — nhà của root</li>
<li><code>/etc</code> — tập tin cấu hình hệ thống · <code>/var</code> — log &amp; dữ liệu hay đổi</li>
<li><code>/bin</code>, <code>/usr/bin</code> — chương trình · <code>/tmp</code> — tập tin tạm</li>
</ul>
<h3>Di chuyển &amp; xem</h3>
<pre><code>pwd                 # in thư mục hiện tại (tôi đang ở đâu?)
ls -lah /etc        # liệt kê chi tiết, mọi tập tin, cỡ dễ đọc
cd /var/log         # đổi thư mục (đường dẫn tuyệt đối)
cd ..               # lên một cấp
cd ~                # về thư mục nhà của bạn
</code></pre>
<h3>Tạo, sao chép, di chuyển, xoá</h3>
<pre><code>mkdir -p project/src        # tạo thư mục lồng nhau
cp file.txt backup.txt      # sao chép
mv old.txt new.txt          # đổi tên / di chuyển
rm -i note.txt              # xoá (hỏi trước)
rm -r project/              # xoá cả cây thư mục (cẩn thận!)
</code></pre>
<h3>Đọc tập tin &amp; tìm kiếm</h3>
<pre><code>cat notes.txt               # in cả tập tin
less big.log                # cuộn tập tin lớn (q để thoát)
grep -rn "TODO" src/        # tìm chữ trong tập tin, đệ quy
man ls                      # trang hướng dẫn của mọi lệnh
</code></pre>
<div class="callout"><span class="badge">Tuyệt đối và tương đối</span> Đường dẫn bắt đầu bằng <code>/</code> là tuyệt đối (tính từ gốc); còn lại là tương đối so với thư mục hiện tại. <code>~</code> luôn là thư mục nhà của bạn.</div>`,
  ]]);

const c2q = quiz('los201-quiz-2', 'Quiz 2 — Shell &amp; filesystem|||Quiz 2 — Shell &amp; tập tin', [
  { id: 'q1', question: 'Thư mục nào chứa tập tin cấu hình hệ thống?', options: ['/home', '/etc', '/var', '/bin'], correctIndex: 1, explanation: '/etc chứa cấu hình hệ thống; /var chứa log & dữ liệu hay đổi.' },
  { id: 'q2', question: 'Lệnh nào in ra thư mục làm việc hiện tại?', options: ['ls', 'cd', 'pwd', 'cat'], correctIndex: 2, explanation: 'pwd (print working directory) cho biết bạn đang ở thư mục nào.' },
  { id: 'q3', question: 'Đường dẫn nào là TUYỆT ĐỐI?', options: ['src/main.c', '../docs', '/etc/hosts', './run.sh'], correctIndex: 2, explanation: 'Đường dẫn tuyệt đối bắt đầu bằng /; các dạng còn lại là tương đối.' },
]);

const c3 = doc('los201-3-1-processes-users-permissions', '3.1 — Processes, users &amp; permissions|||3.1 — Tiến trình, người dùng &amp; quyền',
  'Tiến trình (ps/top/kill, PID, foreground/background); người dùng & nhóm (root, sudo, /etc/passwd); quyền rwx cho owner/group/other, số bát phân (chmod 755), đổi chủ (chown).',
  [[
    `<span class="eyebrow">LOS201 · Chapter 3 · Lesson 3.1</span>
<h2>Processes, users &amp; permissions</h2>
<h3>Processes</h3>
<p>Every running program is a <strong>process</strong> with a numeric <strong>PID</strong>. You can list, monitor and stop them:</p>
<pre><code>ps aux              # snapshot of all processes
top                 # live, sorted by CPU (q to quit)
sleep 300 &amp;         # run in the background
jobs                # background jobs of this shell
kill 1234           # ask process 1234 to stop
kill -9 1234        # force it to stop
</code></pre>
<h3>Users &amp; groups</h3>
<p>Linux is multi-user. <strong>root</strong> (UID 0) is the superuser; ordinary users borrow root power for one command with <strong>sudo</strong>.</p>
<pre><code>whoami              # your username
id                  # your UID, GID and groups
sudo apt update     # run one command as root
cat /etc/passwd     # one line per user account
</code></pre>
<h3>Permissions: rwx for user / group / other</h3>
<p>In <code>ls -l</code>, a line like <code>-rwxr-xr--</code> means: owner read/write/execute, group read/execute, others read only. As octal that is <strong>754</strong> (r=4, w=2, x=1).</p>
<pre><code>ls -l script.sh             # -rwxr-xr-- 1 alice devs ...
chmod 755 script.sh         # rwx for owner, r-x for group &amp; other
chmod +x script.sh          # add the execute bit
chown alice:devs file.txt   # change owner and group
</code></pre>
<div class="callout"><span class="badge">Least privilege</span> Work as a normal user; reach for <code>sudo</code> only when you truly need root. A stray <code>rm -r</code> as root can wipe the whole system.</div>`,
    `<span class="eyebrow">LOS201 · Chương 3 · Bài 3.1</span>
<h2>Tiến trình, người dùng &amp; quyền</h2>
<h3>Tiến trình</h3>
<p>Mỗi chương trình đang chạy là một <strong>tiến trình</strong> có số <strong>PID</strong>. Bạn liệt kê, theo dõi và dừng chúng:</p>
<pre><code>ps aux              # ảnh chụp mọi tiến trình
top                 # xem trực tiếp, xếp theo CPU (q để thoát)
sleep 300 &amp;         # chạy nền
jobs                # công việc nền của shell này
kill 1234           # yêu cầu tiến trình 1234 dừng
kill -9 1234        # ép dừng
</code></pre>
<h3>Người dùng &amp; nhóm</h3>
<p>Linux đa người dùng. <strong>root</strong> (UID 0) là siêu người dùng; người dùng thường mượn quyền root cho một lệnh bằng <strong>sudo</strong>.</p>
<pre><code>whoami              # tên đăng nhập của bạn
id                  # UID, GID và các nhóm của bạn
sudo apt update     # chạy một lệnh với quyền root
cat /etc/passwd     # mỗi dòng là một tài khoản
</code></pre>
<h3>Quyền: rwx cho chủ / nhóm / người khác</h3>
<p>Trong <code>ls -l</code>, dòng như <code>-rwxr-xr--</code> nghĩa là: chủ đọc/ghi/chạy, nhóm đọc/chạy, người khác chỉ đọc. Dạng bát phân là <strong>754</strong> (r=4, w=2, x=1).</p>
<pre><code>ls -l script.sh             # -rwxr-xr-- 1 alice devs ...
chmod 755 script.sh         # rwx cho chủ, r-x cho nhóm &amp; người khác
chmod +x script.sh          # thêm quyền chạy
chown alice:devs file.txt   # đổi chủ và nhóm
</code></pre>
<div class="callout"><span class="badge">Quyền tối thiểu</span> Làm việc dưới tài khoản thường; chỉ dùng <code>sudo</code> khi thật sự cần root. Một lệnh <code>rm -r</code> lỡ tay dưới quyền root có thể xoá cả hệ thống.</div>`,
  ]]);

const c3q = quiz('los201-quiz-3', 'Quiz 3 — Processes &amp; permissions|||Quiz 3 — Tiến trình &amp; quyền', [
  { id: 'q1', question: 'Quyền bát phân 755 tương ứng với chuỗi nào?', options: ['rw-r--r--', 'rwxr-xr-x', 'rwxrwxrwx', 'r-xr-xr-x'], correctIndex: 1, explanation: '7=rwx cho chủ, 5=r-x cho nhóm, 5=r-x cho người khác → rwxr-xr-x.' },
  { id: 'q2', question: 'Lệnh nào chạy một lệnh đơn với quyền root?', options: ['chmod', 'sudo', 'chown', 'kill'], correctIndex: 1, explanation: 'sudo cho phép người dùng thường thực thi một lệnh với quyền root.' },
  { id: 'q3', question: 'Số PID dùng để làm gì?', options: ['Định danh một tập tin', 'Định danh một tiến trình đang chạy', 'Định danh một người dùng', 'Định danh một ổ đĩa'], correctIndex: 1, explanation: 'PID (Process ID) định danh duy nhất một tiến trình; kill dùng PID để dừng.' },
]);

const c4 = doc('los201-4-1-bash-scripting', '4.1 — Bash scripting|||4.1 — Lập trình Bash',
  'Shebang, chmod +x; biến & tham số ($1, $#); dấu nháy; if/test, vòng lặp for/while; hàm; mã thoát $?; pipe & redirect; ví dụ script sao lưu.',
  [[
    `<span class="eyebrow">LOS201 · Chapter 4 · Lesson 4.1</span>
<h2>Bash scripting</h2>
<p>A script is just commands in a file. Start it with a <strong>shebang</strong>, make it executable, then run it.</p>
<pre><code>#!/usr/bin/env bash
echo "Hello, $USER"
</code></pre>
<pre><code>chmod +x hello.sh
./hello.sh
</code></pre>
<h3>Variables &amp; arguments</h3>
<p>No spaces around <code>=</code>. Read a variable with <code>$name</code>. Script arguments are <code>$1</code>, <code>$2</code>; <code>$#</code> is the count; <code>$?</code> is the last exit code (0 = success).</p>
<pre><code>name="Linux"
echo "Learning $name, arg1 is $1, count $#"
</code></pre>
<h3>Decisions &amp; loops</h3>
<pre><code>if [ -f "$1" ]; then
  echo "$1 exists"
else
  echo "no such file"
fi

for f in *.log; do
  echo "found $f"
done

n=1
while [ $n -le 3 ]; do
  echo "count $n"
  n=$((n + 1))
done
</code></pre>
<h3>Pipes &amp; redirection</h3>
<p>Send output to a file with <code>&gt;</code> (overwrite) or <code>&gt;&gt;</code> (append); feed input with <code>&lt;</code>; join commands with a pipe <code>|</code>.</p>
<pre><code>ls -l | grep ".txt" &gt; list.txt      # filter, then save
sort &lt; names.txt | uniq             # sort a file, drop duplicates
</code></pre>
<div class="callout"><span class="badge">Quote your variables</span> Always write <code>"$var"</code> in double quotes. An unquoted path with a space breaks the command — a classic scripting bug.</div>`,
    `<span class="eyebrow">LOS201 · Chương 4 · Bài 4.1</span>
<h2>Lập trình Bash</h2>
<p>Script chỉ là các lệnh trong một tập tin. Bắt đầu bằng dòng <strong>shebang</strong>, cấp quyền chạy, rồi thực thi.</p>
<pre><code>#!/usr/bin/env bash
echo "Chào, $USER"
</code></pre>
<pre><code>chmod +x hello.sh
./hello.sh
</code></pre>
<h3>Biến &amp; tham số</h3>
<p>Không có khoảng trắng quanh dấu <code>=</code>. Đọc biến bằng <code>$ten</code>. Tham số của script là <code>$1</code>, <code>$2</code>; <code>$#</code> là số lượng; <code>$?</code> là mã thoát lệnh trước (0 = thành công).</p>
<pre><code>name="Linux"
echo "Đang học $name, tham số 1 là $1, có $# tham số"
</code></pre>
<h3>Rẽ nhánh &amp; vòng lặp</h3>
<pre><code>if [ -f "$1" ]; then
  echo "$1 tồn tại"
else
  echo "không có tập tin"
fi

for f in *.log; do
  echo "thấy $f"
done

n=1
while [ $n -le 3 ]; do
  echo "đếm $n"
  n=$((n + 1))
done
</code></pre>
<h3>Pipe &amp; chuyển hướng</h3>
<p>Ghi đầu ra ra tập tin bằng <code>&gt;</code> (ghi đè) hoặc <code>&gt;&gt;</code> (nối thêm); nạp đầu vào bằng <code>&lt;</code>; nối các lệnh bằng pipe <code>|</code>.</p>
<pre><code>ls -l | grep ".txt" &gt; list.txt      # lọc rồi lưu lại
sort &lt; names.txt | uniq             # sắp xếp một tập tin, bỏ dòng trùng
</code></pre>
<div class="callout"><span class="badge">Luôn bọc nháy biến</span> Luôn viết <code>"$var"</code> trong nháy kép. Một đường dẫn có dấu cách mà không bọc nháy sẽ làm hỏng lệnh — lỗi script kinh điển.</div>`,
  ]]);

const c4q = quiz('los201-quiz-4', 'Quiz 4 — Bash scripting|||Quiz 4 — Lập trình Bash', [
  { id: 'q1', question: 'Dòng shebang chuẩn để chạy script bằng bash là?', options: ['// bash', '#!/usr/bin/env bash', '#include bash', 'run: bash'], correctIndex: 1, explanation: 'Dòng đầu #!/usr/bin/env bash báo cho hệ thống dùng bash để thực thi.' },
  { id: 'q2', question: 'Toán tử chuyển hướng nào NỐI THÊM vào cuối tập tin (không ghi đè)?', options: ['>', '>>', '<', '|'], correctIndex: 1, explanation: '> ghi đè, >> nối thêm, < nạp đầu vào, | nối lệnh.' },
  { id: 'q3', question: 'Biến $? trong bash cho biết điều gì?', options: ['Số tham số', 'Tên script', 'Mã thoát của lệnh vừa chạy (0 = thành công)', 'PID hiện tại'], correctIndex: 2, explanation: '$? là exit code của lệnh trước; 0 nghĩa là thành công.' },
]);

const c5 = doc('los201-5-1-package-management', '5.1 — Package &amp; software management|||5.1 — Quản lý gói &amp; phần mềm',
  'Gói & kho phần mềm; APT (Debian/Ubuntu) vs DNF/YUM (Fedora/RHEL); cài/gỡ/cập nhật/tìm; phụ thuộc; build từ mã nguồn (configure/make/make install).',
  [[
    `<span class="eyebrow">LOS201 · Chapter 5 · Lesson 5.1</span>
<h2>Package &amp; software management</h2>
<p>You rarely download installers on Linux. A <strong>package manager</strong> fetches software (and its <strong>dependencies</strong>) from trusted <strong>repositories</strong>, then installs, updates and removes it cleanly.</p>
<h3>APT — Debian &amp; Ubuntu</h3>
<pre><code>sudo apt update             # refresh the package index
sudo apt upgrade            # update installed packages
sudo apt install git        # install a package + its deps
sudo apt remove git         # remove it
apt search compiler         # search for a package
</code></pre>
<h3>DNF / YUM — Fedora &amp; RHEL/Rocky</h3>
<pre><code>sudo dnf check-update
sudo dnf install git
sudo dnf remove git
dnf search compiler
</code></pre>
<h3>Building from source</h3>
<p>When a tool is not packaged, you build it. The classic three-step dance:</p>
<pre><code>./configure          # check your system, prepare a Makefile
make                 # compile the source into binaries
sudo make install    # copy binaries into place (needs root)
</code></pre>
<div class="callout"><span class="badge">Prefer the package manager</span> Packages are signed, tracked and easy to remove. Build from source only when you need a version the repos don't carry — then you own the updates yourself.</div>`,
    `<span class="eyebrow">LOS201 · Chương 5 · Bài 5.1</span>
<h2>Quản lý gói &amp; phần mềm</h2>
<p>Trên Linux, bạn hiếm khi tải bộ cài. Một <strong>trình quản lý gói</strong> tải phần mềm (cùng <strong>phụ thuộc</strong>) từ <strong>kho</strong> tin cậy, rồi cài, cập nhật và gỡ gọn gàng.</p>
<h3>APT — Debian &amp; Ubuntu</h3>
<pre><code>sudo apt update             # làm mới danh mục gói
sudo apt upgrade            # cập nhật các gói đã cài
sudo apt install git        # cài một gói + phụ thuộc
sudo apt remove git         # gỡ gói đó
apt search compiler         # tìm một gói
</code></pre>
<h3>DNF / YUM — Fedora &amp; RHEL/Rocky</h3>
<pre><code>sudo dnf check-update
sudo dnf install git
sudo dnf remove git
dnf search compiler
</code></pre>
<h3>Biên dịch từ mã nguồn</h3>
<p>Khi một công cụ không có sẵn gói, bạn tự biên dịch. Điệu nhảy ba bước kinh điển:</p>
<pre><code>./configure          # kiểm tra hệ thống, dựng Makefile
make                 # biên dịch mã nguồn thành tập tin thực thi
sudo make install    # chép tập tin vào chỗ (cần root)
</code></pre>
<div class="callout"><span class="badge">Ưu tiên trình quản lý gói</span> Gói được ký, được theo dõi và dễ gỡ. Chỉ biên dịch từ mã nguồn khi cần phiên bản kho không có — khi đó bạn tự lo cập nhật.</div>`,
  ]]);

const c5q = quiz('los201-quiz-5', 'Quiz 5 — Package management|||Quiz 5 — Quản lý gói', [
  { id: 'q1', question: 'Trình quản lý gói của Debian/Ubuntu là?', options: ['dnf', 'apt', 'pacman', 'brew'], correctIndex: 1, explanation: 'Debian/Ubuntu dùng APT; Fedora/RHEL dùng DNF/YUM.' },
  { id: 'q2', question: 'Thứ tự đúng để biên dịch & cài từ mã nguồn?', options: ['make install → configure → make', './configure → make → sudo make install', 'make → ./configure → install', 'install → make → configure'], correctIndex: 1, explanation: 'Chuẩn: ./configure (chuẩn bị Makefile) → make (biên dịch) → make install (cài).' },
  { id: 'q3', question: 'Vì sao nên ưu tiên trình quản lý gói hơn cài tay?', options: ['Chạy nhanh hơn khi thực thi', 'Gói được ký, theo dõi phụ thuộc và dễ gỡ sạch', 'Không cần internet', 'Không cần quyền root bao giờ'], correctIndex: 1, explanation: 'Trình quản lý gói xử lý phụ thuộc, ký xác thực và gỡ cài gọn gàng.' },
]);

const c6 = doc('los201-6-1-networking-services', '6.1 — Networking &amp; services (SSH, systemd)|||6.1 — Mạng &amp; dịch vụ (SSH, systemd)',
  'Công cụ mạng (ip/ping/ss/curl); SSH đăng nhập từ xa & khoá công khai; scp truyền file; systemd & systemctl quản lý dịch vụ (start/enable/status); đọc log bằng journalctl.',
  [[
    `<span class="eyebrow">LOS201 · Chapter 6 · Lesson 6.1</span>
<h2>Networking &amp; services</h2>
<h3>Look at the network</h3>
<pre><code>ip addr                     # your IP addresses
ping -c 3 example.com       # is a host reachable?
ss -tulpn                   # which ports are listening
curl https://example.com    # fetch a URL from the shell
</code></pre>
<h3>SSH — the remote shell</h3>
<p><strong>SSH</strong> gives you an encrypted shell on another machine — how you reach servers and the lab/EDA machines. Key pairs beat passwords.</p>
<pre><code>ssh alice@server.example.com        # log in
ssh-keygen -t ed25519               # create a key pair
ssh-copy-id alice@server            # install your public key
scp report.pdf alice@server:/tmp/   # copy a file over SSH
</code></pre>
<h3>systemd &amp; systemctl</h3>
<p>Modern distros use <strong>systemd</strong> to start and supervise background <strong>services</strong> (daemons). You drive it with <code>systemctl</code>.</p>
<pre><code>systemctl status ssh        # is the service running?
sudo systemctl start ssh    # start it now
sudo systemctl enable ssh   # start it on every boot
sudo systemctl restart ssh  # restart after a config change
journalctl -u ssh -e        # read that service's logs
</code></pre>
<div class="callout"><span class="badge">start vs. enable</span> <code>start</code> runs a service right now; <code>enable</code> makes it come up automatically at boot. You usually want both.</div>`,
    `<span class="eyebrow">LOS201 · Chương 6 · Bài 6.1</span>
<h2>Mạng &amp; dịch vụ</h2>
<h3>Xem mạng</h3>
<pre><code>ip addr                     # địa chỉ IP của bạn
ping -c 3 example.com       # máy đích có tới được không?
ss -tulpn                   # cổng nào đang lắng nghe
curl https://example.com    # tải một URL ngay từ shell
</code></pre>
<h3>SSH — shell từ xa</h3>
<p><strong>SSH</strong> cho bạn một shell được mã hoá trên máy khác — cách bạn vào máy chủ và máy lab/EDA. Cặp khoá tốt hơn mật khẩu.</p>
<pre><code>ssh alice@server.example.com        # đăng nhập
ssh-keygen -t ed25519               # tạo cặp khoá
ssh-copy-id alice@server            # cài khoá công khai của bạn
scp report.pdf alice@server:/tmp/   # chép tập tin qua SSH
</code></pre>
<h3>systemd &amp; systemctl</h3>
<p>Các distro hiện đại dùng <strong>systemd</strong> để khởi động và giám sát <strong>dịch vụ</strong> nền (daemon). Bạn điều khiển bằng <code>systemctl</code>.</p>
<pre><code>systemctl status ssh        # dịch vụ có đang chạy không?
sudo systemctl start ssh    # khởi động ngay
sudo systemctl enable ssh   # tự chạy mỗi lần khởi động máy
sudo systemctl restart ssh  # khởi động lại sau khi đổi cấu hình
journalctl -u ssh -e        # đọc log của dịch vụ đó
</code></pre>
<div class="callout"><span class="badge">start và enable</span> <code>start</code> chạy dịch vụ ngay bây giờ; <code>enable</code> khiến nó tự lên khi khởi động máy. Thường bạn cần cả hai.</div>`,
  ]]);

const c6q = quiz('los201-quiz-6', 'Quiz 6 — Networking &amp; services|||Quiz 6 — Mạng &amp; dịch vụ', [
  { id: 'q1', question: 'SSH dùng để làm gì?', options: ['Biên dịch mã nguồn', 'Mở một shell được mã hoá trên máy từ xa', 'Quản lý gói phần mềm', 'Xem log hệ thống'], correctIndex: 1, explanation: 'SSH cho shell mã hoá trên máy khác; scp truyền file qua chính kênh đó.' },
  { id: 'q2', question: 'Lệnh systemctl nào khiến dịch vụ TỰ CHẠY mỗi lần khởi động máy?', options: ['systemctl start', 'systemctl status', 'systemctl enable', 'systemctl stop'], correctIndex: 2, explanation: 'enable đặt dịch vụ chạy lúc boot; start chỉ chạy ngay lần này.' },
  { id: 'q3', question: 'Lệnh nào đọc log của một dịch vụ do systemd quản lý?', options: ['journalctl -u ssh', 'ps aux', 'ip addr', 'chmod ssh'], correctIndex: 0, explanation: 'journalctl -u <dịch vụ> hiển thị nhật ký của dịch vụ đó từ journal.' },
]);

const c7 = doc('los201-7-1-open-source-dev-tools', '7.1 — Open-source dev tools (git, make, gcc, open EDA)|||7.1 — Công cụ dev mã nguồn mở (git, make, gcc, EDA mở)',
  'Git (clone/add/commit/push, nhánh); gcc biên dịch C; make & Makefile tự động dựng; công cụ EDA mã nguồn mở cho vi mạch (Verilator, Yosys, OpenROAD, ngspice) và RISC-V.',
  [[
    `<span class="eyebrow">LOS201 · Chapter 7 · Lesson 7.1</span>
<h2>Open-source developer tools</h2>
<h3>Git — version control</h3>
<pre><code>git clone https://github.com/user/repo.git
cd repo
git checkout -b my-feature   # a new branch
git add .                    # stage changes
git commit -m "Add feature"  # record a snapshot
git push origin my-feature   # send it to the remote
</code></pre>
<h3>gcc — compile C</h3>
<pre><code>gcc -Wall -o hello hello.c   # compile with warnings on
./hello                      # run the program
</code></pre>
<h3>make — automate the build</h3>
<p>A <strong>Makefile</strong> records how to build your project, so you rebuild only what changed with one command. (Indent recipe lines with a real TAB.)</p>
<pre><code>hello: hello.c
	gcc -Wall -o hello hello.c

clean:
	rm -f hello
</code></pre>
<pre><code>make          # build the "hello" target
make clean    # remove build artifacts
</code></pre>
<h3>Open-source EDA for chip design</h3>
<p>The tools above underpin an entire open silicon flow, all Linux-native:</p>
<ul>
<li><strong>Verilator, Icarus Verilog</strong> — simulate Verilog/SystemVerilog RTL</li>
<li><strong>Yosys</strong> — synthesis (RTL → gates); <strong>OpenROAD</strong> — place &amp; route</li>
<li><strong>ngspice</strong> — analog/SPICE simulation; <strong>KLayout</strong> — layout viewing</li>
<li><strong>RISC-V</strong> — an open instruction set you can implement freely</li>
</ul>
<div class="callout"><span class="badge">It all connects</span> You clone an open EDA tool with git, build it with make + gcc, then run it from the shell — every skill in this course feeds the chip-design workflow.</div>`,
    `<span class="eyebrow">LOS201 · Chương 7 · Bài 7.1</span>
<h2>Công cụ phát triển mã nguồn mở</h2>
<h3>Git — quản lý phiên bản</h3>
<pre><code>git clone https://github.com/user/repo.git
cd repo
git checkout -b my-feature   # tạo nhánh mới
git add .                    # đưa thay đổi vào staging
git commit -m "Add feature"  # ghi lại một ảnh chụp
git push origin my-feature   # đẩy lên máy chủ từ xa
</code></pre>
<h3>gcc — biên dịch C</h3>
<pre><code>gcc -Wall -o hello hello.c   # biên dịch, bật cảnh báo
./hello                      # chạy chương trình
</code></pre>
<h3>make — tự động hoá việc dựng</h3>
<p>Một <strong>Makefile</strong> ghi lại cách dựng dự án, nên bạn chỉ dựng lại phần thay đổi bằng một lệnh. (Thụt dòng công thức bằng TAB thật.)</p>
<pre><code>hello: hello.c
	gcc -Wall -o hello hello.c

clean:
	rm -f hello
</code></pre>
<pre><code>make          # dựng mục tiêu "hello"
make clean    # xoá sản phẩm biên dịch
</code></pre>
<h3>EDA mã nguồn mở cho thiết kế vi mạch</h3>
<p>Các công cụ trên là nền cho cả một luồng silicon mở, đều chạy gốc trên Linux:</p>
<ul>
<li><strong>Verilator, Icarus Verilog</strong> — mô phỏng RTL Verilog/SystemVerilog</li>
<li><strong>Yosys</strong> — tổng hợp (RTL → cổng logic); <strong>OpenROAD</strong> — sắp đặt &amp; định tuyến</li>
<li><strong>ngspice</strong> — mô phỏng analog/SPICE; <strong>KLayout</strong> — xem layout</li>
<li><strong>RISC-V</strong> — tập lệnh mở mà bạn được tự do hiện thực</li>
</ul>
<div class="callout"><span class="badge">Tất cả nối với nhau</span> Bạn clone một công cụ EDA mở bằng git, dựng bằng make + gcc, rồi chạy từ shell — mọi kỹ năng trong môn này đều phục vụ luồng thiết kế vi mạch.</div>`,
  ]]);

const c7q = quiz('los201-quiz-7', 'Quiz 7 — Dev tools|||Quiz 7 — Công cụ dev', [
  { id: 'q1', question: 'Lệnh git nào ghi lại một ảnh chụp thay đổi đã staging?', options: ['git clone', 'git add', 'git commit', 'git push'], correctIndex: 2, explanation: 'git commit ghi ảnh chụp; add đưa vào staging, push đẩy lên remote.' },
  { id: 'q2', question: 'Công cụ nào tự động hoá việc dựng dựa trên tập tin Makefile?', options: ['gcc', 'make', 'git', 'ssh'], correctIndex: 1, explanation: 'make đọc Makefile và dựng lại đúng phần thay đổi.' },
  { id: 'q3', question: 'Công cụ EDA mã nguồn mở nào dùng để TỔNG HỢP RTL thành cổng logic?', options: ['Yosys', 'gcc', 'curl', 'apt'], correctIndex: 0, explanation: 'Yosys là công cụ tổng hợp (synthesis) mã nguồn mở; OpenROAD lo place & route.' },
]);

const c8 = doc('los201-8-1-community-contributing', '8.1 — Community &amp; contributing to open source|||8.1 — Cộng đồng &amp; đóng góp mã nguồn mở',
  'Vì sao đóng góp; cách cộng đồng vận hành (issue, maintainer, code of conduct); quy trình fork → branch → commit → pull request → review; đóng góp không chỉ là code (docs, dịch, báo lỗi).',
  [[
    `<span class="eyebrow">LOS201 · Chapter 8 · Lesson 8.1</span>
<h2>Community &amp; contributing to open source</h2>
<h3>How a project runs</h3>
<ul>
<li><strong>Maintainers</strong> review and merge changes; <strong>contributors</strong> propose them.</li>
<li><strong>Issues</strong> track bugs and feature requests; discussion happens in the open.</li>
<li><strong>README, CONTRIBUTING and a Code of Conduct</strong> tell you how to take part respectfully.</li>
</ul>
<h3>The contribution workflow</h3>
<p>The standard "fork &amp; pull request" flow, all on the command line you now know:</p>
<pre><code># 1) Fork on the website, then clone YOUR fork
git clone https://github.com/you/project.git
cd project

# 2) Make a focused branch
git checkout -b fix-typo-readme

# 3) Change, commit, push to your fork
git add README.md
git commit -m "docs: fix a typo in the install steps"
git push origin fix-typo-readme

# 4) Open a Pull Request from your branch on the website
# 5) Respond to review, push follow-up commits, get merged
</code></pre>
<h3>Contributions are not only code</h3>
<p>You can help by <strong>improving docs, translating, reporting good bug reports, writing tests, or answering questions</strong>. A first PR that fixes a typo or clarifies a README is genuinely welcome — it is how most people start.</p>
<div class="callout"><span class="badge">Good first steps</span> Look for issues tagged <em>good first issue</em>, read CONTRIBUTING first, keep each pull request small and focused, and describe clearly what you changed and why.</div>`,
    `<span class="eyebrow">LOS201 · Chương 8 · Bài 8.1</span>
<h2>Cộng đồng &amp; đóng góp mã nguồn mở</h2>
<h3>Một dự án vận hành thế nào</h3>
<ul>
<li><strong>Maintainer</strong> duyệt và gộp thay đổi; <strong>người đóng góp</strong> đề xuất chúng.</li>
<li><strong>Issue</strong> theo dõi lỗi và đề nghị tính năng; thảo luận diễn ra công khai.</li>
<li><strong>README, CONTRIBUTING và Quy tắc ứng xử</strong> chỉ cho bạn cách tham gia đúng mực.</li>
</ul>
<h3>Quy trình đóng góp</h3>
<p>Luồng "fork &amp; pull request" chuẩn, tất cả trên dòng lệnh bạn vừa học:</p>
<pre><code># 1) Fork trên website, rồi clone bản fork CỦA BẠN
git clone https://github.com/you/project.git
cd project

# 2) Tạo một nhánh tập trung vào một việc
git checkout -b fix-typo-readme

# 3) Sửa, commit, đẩy lên bản fork của bạn
git add README.md
git commit -m "docs: sửa lỗi chính tả trong phần cài đặt"
git push origin fix-typo-readme

# 4) Mở Pull Request từ nhánh của bạn trên website
# 5) Phản hồi review, đẩy thêm commit, được gộp vào
</code></pre>
<h3>Đóng góp không chỉ là code</h3>
<p>Bạn có thể giúp bằng cách <strong>cải thiện tài liệu, dịch thuật, báo lỗi rõ ràng, viết kiểm thử, hoặc trả lời câu hỏi</strong>. Một PR đầu tiên sửa lỗi chính tả hay làm rõ README thật sự được hoan nghênh — đó là cách hầu hết mọi người bắt đầu.</p>
<div class="callout"><span class="badge">Bước khởi đầu tốt</span> Tìm issue gắn nhãn <em>good first issue</em>, đọc CONTRIBUTING trước, giữ mỗi pull request nhỏ và tập trung, và mô tả rõ bạn đã đổi gì và vì sao.</div>`,
  ]]);

const c8q = quiz('los201-quiz-8', 'Quiz 8 — Contributing|||Quiz 8 — Đóng góp', [
  { id: 'q1', question: 'Trong luồng đóng góp chuẩn, bạn đề xuất thay đổi cho dự án bằng cách?', options: ['Gửi email kèm file zip', 'Mở một Pull Request từ nhánh của mình', 'Sửa trực tiếp trên máy chủ production', 'Xoá kho rồi tạo lại'], correctIndex: 1, explanation: 'Chuẩn: fork → nhánh → commit → mở Pull Request để maintainer review và gộp.' },
  { id: 'q2', question: 'Ai là người duyệt và gộp (merge) các thay đổi vào dự án?', options: ['Người đóng góp bất kỳ', 'Maintainer', 'Người dùng cuối', 'Trình quản lý gói'], correctIndex: 1, explanation: 'Maintainer duyệt và gộp; contributor đề xuất qua issue/PR.' },
  { id: 'q3', question: 'Phát biểu nào ĐÚNG về đóng góp mã nguồn mở?', options: ['Chỉ viết code mới được tính', 'Cải thiện tài liệu, dịch, báo lỗi cũng là đóng góp giá trị', 'Phải là maintainer mới được góp', 'PR càng lớn càng dễ được gộp'], correctIndex: 1, explanation: 'Đóng góp gồm cả docs, dịch, test, báo lỗi; PR nên nhỏ và tập trung.' },
]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'LOS201',
    slug: 'los201-linux-and-open-source-platform',
    title: 'Linux and Open Source Platform',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/LOS201.webp',
    shortDescription: 'Linux & open source from scratch — GNU/Linux history & licenses, the shell & filesystem, processes/users/permissions, Bash scripting, package management, networking & systemd, dev tools (git/make/gcc, open-source EDA) & contributing. Bilingual, hands-on.|||Linux & mã nguồn mở từ đầu — lịch sử GNU/Linux & giấy phép, shell & tập tin, tiến trình/người dùng/quyền, Bash script, quản lý gói, mạng & systemd, công cụ dev (git/make/gcc, EDA mở) & đóng góp. Song ngữ.',
    description: 'Môn <strong>LOS201 — Linux and Open Source Platform</strong> (ngành Thiết kế vi mạch bán dẫn, kỳ 3) dạy bạn <strong>làm việc thành thạo trên Linux</strong> và hiểu <strong>mô hình mã nguồn mở</strong>. Từ <strong>lịch sử GNU/Linux &amp; giấy phép</strong> (GPL/MIT/Apache) → <strong>dòng lệnh &amp; hệ thống tập tin</strong> → <strong>tiến trình, người dùng &amp; quyền</strong> → <strong>Bash scripting</strong> → <strong>quản lý gói</strong> → <strong>mạng &amp; systemd</strong> → <strong>công cụ dev (git/make/gcc, EDA mã nguồn mở)</strong> → <strong>đóng góp mã nguồn mở</strong>. Song ngữ, có lệnh thực hành và quiz mỗi chương. Bám giáo trình Shotts, Nemeth, Sobell và TLDP.',
    whatYouLearn: 'Lịch sử Unix→GNU→Linux &amp; phân biệt giấy phép GPL/MIT/BSD/Apache; shell &amp; cây thư mục FHS, di chuyển/thao tác tập tin, man pages; tiến trình (ps/top/kill), người dùng/sudo, quyền rwx &amp; chmod/chown; Bash scripting (biến, if, for/while, pipe, redirect); quản lý gói (apt/dnf) &amp; build từ mã nguồn; mạng &amp; SSH, systemd/systemctl, journalctl; git/make/gcc &amp; công cụ EDA mã nguồn mở (Verilator, Yosys, OpenROAD, ngspice, RISC-V); quy trình fork → pull request để đóng góp.',
    requirements: 'Biết dùng máy tính cơ bản. Nên cài một máy ảo Linux (VirtualBox) hoặc dùng WSL trên Windows để thực hành lệnh.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách (Shotts/Nemeth/Sobell), tài liệu chính thức, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Linux là gì, kernel vs distro, triết lý mã nguồn mở, lộ trình 8 chương.', lessons: [intro] },
    { title: 'Chương 1 — Lịch sử & giấy phép|||Chapter 1 — History & licenses', description: 'Unix→GNU→Linux, phần mềm tự do vs mã nguồn mở, GPL/MIT/Apache.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Dòng lệnh & tập tin|||Chapter 2 — Shell & filesystem', description: 'Shell, cây thư mục FHS, di chuyển, thao tác tập tin, man.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Tiến trình, người dùng & quyền|||Chapter 3 — Processes, users & permissions', description: 'ps/top/kill, sudo, quyền rwx, chmod/chown.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Bash scripting|||Chapter 4 — Bash scripting', description: 'Shebang, biến, if/for/while, pipe & redirect.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Quản lý gói|||Chapter 5 — Package management', description: 'apt/dnf, cài/gỡ/cập nhật, build từ mã nguồn.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Mạng & dịch vụ|||Chapter 6 — Networking & services', description: 'ip/ping/ss/curl, SSH, systemd/systemctl, journalctl.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Công cụ dev mã nguồn mở|||Chapter 7 — Open-source dev tools', description: 'git, gcc, make, EDA mở (Verilator/Yosys/OpenROAD), RISC-V.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Cộng đồng & đóng góp|||Chapter 8 — Community & contributing', description: 'Maintainer/issue, fork → PR, đóng góp ngoài code.', lessons: [c8, c8q] },
  ],
};
