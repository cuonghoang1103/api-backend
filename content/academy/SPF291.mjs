/**
 * SPF291 — Systems Programming (Lập trình hệ thống). Ngành Khoa học Máy tính
 * FPTU, kỳ 3. Khung 8 chương bằng C trên Linux: system call vs thư viện,
 * tiến trình, I/O file cấp thấp, tín hiệu, IPC, luồng POSIX, socket, bộ nhớ &
 * công cụ. Sách chuẩn: Kerrisk "The Linux Programming Interface"; Stevens
 * "Advanced Programming in the UNIX Environment"; man pages; CMU 15-213.
 * Song ngữ + khối code C + quiz mỗi chương.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; & → &amp;;
 * < → &lt; (ĐƠN) cho #include; "\n" → \\n.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('spf291-0-1-overview', 'Course overview: Systems Programming|||Tổng quan: Lập trình hệ thống',
  'Lập trình hệ thống là gì; C + Linux; bốn bước: nền (system call, tiến trình, file) → tín hiệu & IPC → luồng & socket → bộ nhớ & công cụ. Sách Kerrisk/Stevens, man pages.',
  [[
    `<span class="eyebrow">SPF291 · Lesson 0.1 · Overview</span>
<h2>Systems Programming</h2>
<p class="lead">This course teaches you to program <strong>the operating system directly</strong> — the layer beneath web frameworks and libraries. Using <strong>C on Linux</strong>, you call the <strong>kernel</strong> through <em>system calls</em> to create processes, read and write files, handle signals, talk between programs (IPC), run threads, open network sockets, and manage memory.</p>
<h3>Why it matters</h3>
<p>Everything higher up — a database, a web server, a language runtime — is built on these primitives. Understanding them makes you able to reason about <strong>performance, concurrency and failure</strong> instead of treating the OS as a black box.</p>
<h3>Roadmap (4 steps)</h3>
<ul>
<li><strong>Foundations</strong> — system call vs library, process management (fork/exec/wait), low-level file I/O.</li>
<li><strong>Signals &amp; IPC</strong> — signals and handlers; pipes, FIFOs, shared memory, message queues.</li>
<li><strong>Concurrency &amp; network</strong> — POSIX threads &amp; mutexes; TCP/UDP sockets, client-server.</li>
<li><strong>Memory &amp; tools</strong> — malloc/mmap, memory layout, and debugging with gdb/valgrind/make.</li>
</ul>
<div class="callout"><span class="badge">Books</span> Kerrisk, <em>The Linux Programming Interface</em>; Stevens, <em>Advanced Programming in the UNIX Environment</em>; the Linux <strong>man pages</strong>; CMU 15-213.</div>`,
    `<span class="eyebrow">SPF291 · Bài 0.1 · Tổng quan</span>
<h2>Lập trình hệ thống</h2>
<p class="lead">Môn này dạy bạn lập trình <strong>trực tiếp với hệ điều hành</strong> — tầng nằm dưới các framework và thư viện. Dùng <strong>C trên Linux</strong>, bạn gọi <strong>nhân (kernel)</strong> qua <em>system call</em> để tạo tiến trình, đọc/ghi file, xử lý tín hiệu, giao tiếp giữa các chương trình (IPC), chạy luồng, mở socket mạng và quản lý bộ nhớ.</p>
<h3>Vì sao quan trọng</h3>
<p>Mọi thứ ở tầng cao hơn — cơ sở dữ liệu, web server, runtime ngôn ngữ — đều dựng trên các nguyên thuỷ này. Hiểu chúng giúp bạn suy luận về <strong>hiệu năng, đồng thời và lỗi</strong> thay vì coi hệ điều hành là hộp đen.</p>
<h3>Lộ trình (4 bước)</h3>
<ul>
<li><strong>Nền tảng</strong> — system call vs thư viện, quản lý tiến trình (fork/exec/wait), I/O file cấp thấp.</li>
<li><strong>Tín hiệu &amp; IPC</strong> — tín hiệu và handler; pipe, FIFO, shared memory, message queue.</li>
<li><strong>Đồng thời &amp; mạng</strong> — luồng POSIX &amp; mutex; socket TCP/UDP, client-server.</li>
<li><strong>Bộ nhớ &amp; công cụ</strong> — malloc/mmap, bố cục bộ nhớ, gỡ lỗi với gdb/valgrind/make.</li>
</ul>
<div class="callout"><span class="badge">Sách</span> Kerrisk, <em>The Linux Programming Interface</em>; Stevens, <em>Advanced Programming in the UNIX Environment</em>; <strong>man pages</strong> Linux; CMU 15-213.</div>`,
  ]]);

const c1 = doc('spf291-1-1-what-is-sysprog', '1.1 — What is systems programming|||1.1 — Lập trình hệ thống là gì',
  'System programming vs application; system call vs library function; kernel space vs user space; mode switch. Ví dụ write() so với printf().',
  [[
    `<span class="eyebrow">SPF291 · Chapter 1 · Lesson 1.1</span>
<h2>What is systems programming?</h2>
<h3>System call vs library function</h3>
<ul>
<li><strong>System call</strong> — a request to the <strong>kernel</strong> to do something only it can do (touch hardware, files, processes). Examples: <code>read</code>, <code>write</code>, <code>open</code>, <code>fork</code>.</li>
<li><strong>Library function</strong> — ordinary code in <em>user space</em> (e.g. <code>printf</code>, <code>malloc</code>). It may buffer work and then call the kernel for you.</li>
</ul>
<h3>Kernel space vs user space</h3>
<p>Your program runs in <strong>user space</strong> with limited privileges. A system call causes a <strong>mode switch</strong> into <strong>kernel space</strong>, where the request is served, then control returns. This boundary is what keeps one buggy program from crashing the whole machine.</p>
<pre><code class="language-c">#include &lt;unistd.h&gt;
#include &lt;stdio.h&gt;

int main(void) {
    /* write() is a raw system call: bytes go straight to fd 1 */
    write(1, "hello via syscall\n", 18);

    /* printf() is a library function: it buffers, then calls write() */
    printf("hello via library\n");
    return 0;
}</code></pre>
<div class="callout"><span class="badge">Key idea</span> A library function is convenience; a system call is the real door into the kernel. Every man page section 2 entry is a system call.</div>`,
    `<span class="eyebrow">SPF291 · Chương 1 · Bài 1.1</span>
<h2>Lập trình hệ thống là gì?</h2>
<h3>System call vs hàm thư viện</h3>
<ul>
<li><strong>System call</strong> — lời yêu cầu tới <strong>nhân (kernel)</strong> làm việc mà chỉ nhân làm được (chạm phần cứng, file, tiến trình). Ví dụ: <code>read</code>, <code>write</code>, <code>open</code>, <code>fork</code>.</li>
<li><strong>Hàm thư viện</strong> — mã thường ở <em>user space</em> (vd <code>printf</code>, <code>malloc</code>). Nó có thể đệm việc lại rồi mới gọi nhân giúp bạn.</li>
</ul>
<h3>Kernel space vs user space</h3>
<p>Chương trình của bạn chạy ở <strong>user space</strong> với quyền hạn chế. Một system call gây ra <strong>mode switch</strong> sang <strong>kernel space</strong>, nơi yêu cầu được phục vụ, rồi trả điều khiển về. Ranh giới này giữ cho một chương trình lỗi không làm sập cả máy.</p>
<pre><code class="language-c">#include &lt;unistd.h&gt;
#include &lt;stdio.h&gt;

int main(void) {
    /* write() la system call tho: byte di thang toi fd 1 */
    write(1, "hello via syscall\n", 18);

    /* printf() la ham thu vien: no dem lai, roi goi write() */
    printf("hello via library\n");
    return 0;
}</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Hàm thư viện là tiện lợi; system call mới là cánh cửa thật vào nhân. Mọi mục ở man page mục 2 đều là system call.</div>`,
  ]]);

const c1q = quiz('spf291-quiz-1', 'Quiz 1 — Foundations|||Quiz 1 — Nền tảng', [
  { id: 'q1', question: 'Điểm khác nhau chính giữa system call và hàm thư viện?|||Main difference between a system call and a library function?', options: ['Không có khác biệt|||There is no difference', 'System call yêu cầu nhân (kernel) làm việc; hàm thư viện chạy ở user space|||A system call asks the kernel; a library function runs in user space', 'Hàm thư viện nhanh hơn luôn|||A library function is always faster', 'System call chỉ dùng trong C++|||System calls are only for C++'], correctIndex: 1, explanation: 'System call vượt ranh giới sang kernel space; hàm thư viện là mã user space.' },
  { id: 'q2', question: 'Khi gọi system call, CPU chuyển sang?|||On a system call, the CPU switches to?', options: ['User space', 'Kernel space (mode switch)|||Kernel space (mode switch)', 'Swap space', 'Không chuyển gì|||No switch happens'], correctIndex: 1, explanation: 'System call gây mode switch vào kernel space rồi trả về.' },
  { id: 'q3', question: 'Hàm nào là system call thô ghi thẳng ra file descriptor?|||Which is a raw system call writing straight to a file descriptor?', options: ['printf', 'write', 'cout', 'sprintf'], correctIndex: 1, explanation: 'write() ghi trực tiếp qua fd; printf() đệm rồi mới gọi write().' },
]);

const c2 = doc('spf291-2-1-processes', '2.1 — Process management|||2.1 — Quản lý tiến trình',
  'Tiến trình, PID; fork() nhân đôi, exec() thay ảnh, wait() thu con, exit(). Ví dụ fork + wait.',
  [[
    `<span class="eyebrow">SPF291 · Chapter 2 · Lesson 2.1</span>
<h2>Process management</h2>
<h3>Process &amp; PID</h3>
<p>A <strong>process</strong> is a running program with its own memory and a unique <strong>PID</strong>. Four system calls run the lifecycle:</p>
<ul>
<li><strong>fork()</strong> — duplicates the current process; the child gets a copy. Returns 0 in the child, the child's PID in the parent.</li>
<li><strong>exec()</strong> — replaces the current process image with a new program (keeps the PID).</li>
<li><strong>wait()</strong> — the parent blocks until a child ends and reaps its exit status.</li>
<li><strong>exit()</strong> — ends a process with a status code.</li>
</ul>
<pre><code class="language-c">#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;
#include &lt;stdio.h&gt;

int main(void) {
    pid_t pid = fork();          /* one call, returns twice */
    if (pid == 0) {
        printf("child, pid=%d\n", getpid());
        _exit(0);
    } else {
        int status;
        wait(&amp;status);           /* parent reaps the child */
        printf("parent saw child exit\n");
    }
    return 0;
}</code></pre>
<div class="callout"><span class="badge">fork+exec</span> The shell uses fork() to make a child, then exec() to run your command in it — the classic Unix pattern.</div>`,
    `<span class="eyebrow">SPF291 · Chương 2 · Bài 2.1</span>
<h2>Quản lý tiến trình</h2>
<h3>Tiến trình &amp; PID</h3>
<p>Một <strong>tiến trình</strong> là chương trình đang chạy, có bộ nhớ riêng và <strong>PID</strong> duy nhất. Bốn system call điều khiển vòng đời:</p>
<ul>
<li><strong>fork()</strong> — nhân đôi tiến trình hiện tại; con nhận một bản sao. Trả 0 ở con, trả PID của con ở cha.</li>
<li><strong>exec()</strong> — thay ảnh tiến trình hiện tại bằng chương trình mới (giữ nguyên PID).</li>
<li><strong>wait()</strong> — cha chặn lại tới khi con kết thúc và thu trạng thái thoát của con.</li>
<li><strong>exit()</strong> — kết thúc tiến trình với một mã trạng thái.</li>
</ul>
<pre><code class="language-c">#include &lt;unistd.h&gt;
#include &lt;sys/wait.h&gt;
#include &lt;stdio.h&gt;

int main(void) {
    pid_t pid = fork();          /* mot loi goi, tra ve hai lan */
    if (pid == 0) {
        printf("con, pid=%d\n", getpid());
        _exit(0);
    } else {
        int status;
        wait(&amp;status);           /* cha thu con */
        printf("cha thay con thoat\n");
    }
    return 0;
}</code></pre>
<div class="callout"><span class="badge">fork+exec</span> Shell dùng fork() tạo con, rồi exec() chạy lệnh của bạn trong con đó — mẫu Unix kinh điển.</div>`,
  ]]);

const c2q = quiz('spf291-quiz-2', 'Quiz 2 — Processes|||Quiz 2 — Tiến trình', [
  { id: 'q1', question: 'fork() trả về gì trong tiến trình con?|||What does fork() return in the child?', options: ['PID của con|||The child PID', '0', 'PID của cha|||The parent PID', '-1'], correctIndex: 1, explanation: 'fork() trả 0 ở con, và PID của con ở cha.' },
  { id: 'q2', question: 'System call nào thay ảnh tiến trình bằng chương trình mới?|||Which call replaces the process image with a new program?', options: ['fork()', 'exec()', 'wait()', 'exit()'], correctIndex: 1, explanation: 'exec() nạp chương trình mới, giữ nguyên PID.' },
  { id: 'q3', question: 'Cha dùng gì để chờ và thu trạng thái của con?|||What does a parent use to wait for and reap a child?', options: ['sleep()', 'wait()', 'kill()', 'pipe()'], correctIndex: 1, explanation: 'wait() chặn cha tới khi con kết thúc và lấy exit status.' },
]);

const c3 = doc('spf291-3-1-file-io', '3.1 — Low-level file I/O|||3.1 — Vào/ra file cấp thấp',
  'File descriptor; open/read/write/close, lseek. So với stdio đệm. Ví dụ sao chép file bằng read/write.',
  [[
    `<span class="eyebrow">SPF291 · Chapter 3 · Lesson 3.1</span>
<h2>Low-level file I/O</h2>
<h3>File descriptor</h3>
<p>A <strong>file descriptor (fd)</strong> is a small integer the kernel hands you to name an open file. Three are open by default: <strong>0 stdin, 1 stdout, 2 stderr</strong>. The core calls:</p>
<ul>
<li><strong>open()</strong> — open/create a file, returns an fd.</li>
<li><strong>read() / write()</strong> — move raw bytes to/from the fd; return the count actually moved.</li>
<li><strong>lseek()</strong> — move the file offset (random access).</li>
<li><strong>close()</strong> — release the fd.</li>
</ul>
<pre><code class="language-c">#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;

int main(void) {
    int in  = open("src.txt", O_RDONLY);
    int out = open("dst.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    char buf[4096];
    ssize_t n;
    while ((n = read(in, buf, sizeof buf)) &gt; 0)
        write(out, buf, n);      /* copy in fixed-size chunks */
    close(in);
    close(out);
    return 0;
}</code></pre>
<div class="callout"><span class="badge">Unbuffered</span> These are unbuffered kernel calls — unlike stdio (fopen/fread), which buffers in user space for speed.</div>`,
    `<span class="eyebrow">SPF291 · Chương 3 · Bài 3.1</span>
<h2>Vào/ra file cấp thấp</h2>
<h3>File descriptor</h3>
<p>Một <strong>file descriptor (fd)</strong> là số nguyên nhỏ nhân đưa cho bạn để đặt tên một file đang mở. Ba fd mở sẵn: <strong>0 stdin, 1 stdout, 2 stderr</strong>. Các lời gọi lõi:</p>
<ul>
<li><strong>open()</strong> — mở/tạo file, trả về một fd.</li>
<li><strong>read() / write()</strong> — chuyển byte thô vào/ra fd; trả về số byte thực sự chuyển.</li>
<li><strong>lseek()</strong> — dời con trỏ vị trí trong file (truy cập ngẫu nhiên).</li>
<li><strong>close()</strong> — giải phóng fd.</li>
</ul>
<pre><code class="language-c">#include &lt;fcntl.h&gt;
#include &lt;unistd.h&gt;

int main(void) {
    int in  = open("src.txt", O_RDONLY);
    int out = open("dst.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
    char buf[4096];
    ssize_t n;
    while ((n = read(in, buf, sizeof buf)) &gt; 0)
        write(out, buf, n);      /* sao chep theo khoi co dinh */
    close(in);
    close(out);
    return 0;
}</code></pre>
<div class="callout"><span class="badge">Không đệm</span> Đây là lời gọi nhân không đệm — khác stdio (fopen/fread) vốn đệm ở user space cho nhanh.</div>`,
  ]]);

const c3q = quiz('spf291-quiz-3', 'Quiz 3 — File I/O|||Quiz 3 — Vào/ra file', [
  { id: 'q1', question: 'File descriptor 1 mặc định là?|||File descriptor 1 is by default?', options: ['stdin', 'stdout', 'stderr', 'một file bất kỳ|||any file'], correctIndex: 1, explanation: '0 = stdin, 1 = stdout, 2 = stderr.' },
  { id: 'q2', question: 'System call nào dời con trỏ vị trí trong file?|||Which call moves the file offset?', options: ['read()', 'lseek()', 'close()', 'fork()'], correctIndex: 1, explanation: 'lseek() cho phép truy cập ngẫu nhiên bằng cách dời offset.' },
  { id: 'q3', question: 'So với stdio (fread), read()/write() cấp thấp thì?|||Compared with stdio, low-level read()/write() are?', options: ['Có đệm ở user space|||Buffered in user space', 'Không đệm — gọi thẳng nhân|||Unbuffered — call the kernel directly', 'Chỉ đọc text|||Text only', 'Chậm hơn luôn|||Always slower'], correctIndex: 1, explanation: 'read/write là lời gọi nhân không đệm; stdio đệm ở user space.' },
]);

const c4 = doc('spf291-4-1-signals', '4.1 — Signals|||4.1 — Tín hiệu',
  'Tín hiệu bất đồng bộ; SIGINT/SIGTERM/SIGKILL; handler với signal()/sigaction(); kill(). Ví dụ bắt SIGINT.',
  [[
    `<span class="eyebrow">SPF291 · Chapter 4 · Lesson 4.1</span>
<h2>Signals</h2>
<h3>Asynchronous notifications</h3>
<p>A <strong>signal</strong> is a software interrupt delivered to a process. Common ones:</p>
<ul>
<li><strong>SIGINT</strong> — Ctrl-C from the terminal (catchable).</li>
<li><strong>SIGTERM</strong> — polite "please stop" (catchable).</li>
<li><strong>SIGKILL</strong> — force kill; <em>cannot</em> be caught or ignored.</li>
</ul>
<p>You install a <strong>handler</strong> with <code>signal()</code> or the safer <code>sigaction()</code>, and send a signal with <code>kill(pid, sig)</code>.</p>
<pre><code class="language-c">#include &lt;signal.h&gt;
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;

volatile sig_atomic_t stop = 0;
void on_int(int sig) { stop = 1; }   /* keep handlers tiny */

int main(void) {
    signal(SIGINT, on_int);          /* catch Ctrl-C */
    while (!stop) pause();           /* wait for a signal */
    printf("caught SIGINT, exiting cleanly\n");
    return 0;
}</code></pre>
<div class="callout"><span class="badge">Handler rule</span> Do almost nothing in a handler — just set a flag like sig_atomic_t and act on it in the main loop.</div>`,
    `<span class="eyebrow">SPF291 · Chương 4 · Bài 4.1</span>
<h2>Tín hiệu</h2>
<h3>Thông báo bất đồng bộ</h3>
<p>Một <strong>tín hiệu (signal)</strong> là ngắt phần mềm gửi tới một tiến trình. Vài loại phổ biến:</p>
<ul>
<li><strong>SIGINT</strong> — Ctrl-C từ terminal (bắt được).</li>
<li><strong>SIGTERM</strong> — lời "xin dừng lại" lịch sự (bắt được).</li>
<li><strong>SIGKILL</strong> — buộc giết; <em>không thể</em> bắt hay bỏ qua.</li>
</ul>
<p>Bạn cài <strong>handler</strong> bằng <code>signal()</code> hoặc <code>sigaction()</code> an toàn hơn, và gửi tín hiệu bằng <code>kill(pid, sig)</code>.</p>
<pre><code class="language-c">#include &lt;signal.h&gt;
#include &lt;stdio.h&gt;
#include &lt;unistd.h&gt;

volatile sig_atomic_t stop = 0;
void on_int(int sig) { stop = 1; }   /* giu handler that nho */

int main(void) {
    signal(SIGINT, on_int);          /* bat Ctrl-C */
    while (!stop) pause();           /* cho mot tin hieu */
    printf("bat duoc SIGINT, thoat sach\n");
    return 0;
}</code></pre>
<div class="callout"><span class="badge">Quy tắc handler</span> Làm thật ít trong handler — chỉ đặt một cờ như sig_atomic_t rồi xử lý ở vòng lặp chính.</div>`,
  ]]);

const c4q = quiz('spf291-quiz-4', 'Quiz 4 — Signals|||Quiz 4 — Tín hiệu', [
  { id: 'q1', question: 'Tín hiệu nào KHÔNG thể bắt hay bỏ qua?|||Which signal cannot be caught or ignored?', options: ['SIGINT', 'SIGTERM', 'SIGKILL', 'SIGUSR1'], correctIndex: 2, explanation: 'SIGKILL (và SIGSTOP) luôn buộc thi hành, không thể bắt.' },
  { id: 'q2', question: 'Ctrl-C trên terminal gửi tín hiệu nào?|||Ctrl-C at the terminal sends which signal?', options: ['SIGINT', 'SIGKILL', 'SIGSEGV', 'SIGCHLD'], correctIndex: 0, explanation: 'Ctrl-C gửi SIGINT, mặc định kết thúc tiến trình nhưng bắt được.' },
  { id: 'q3', question: 'Trong signal handler nên làm gì là an toàn nhất?|||Safest thing to do inside a signal handler?', options: ['Gọi printf phức tạp|||Call a complex printf', 'Cấp phát bộ nhớ lớn|||Allocate a large buffer', 'Chỉ đặt một cờ sig_atomic_t|||Just set a sig_atomic_t flag', 'Mở file mạng|||Open a network file'], correctIndex: 2, explanation: 'Handler phải cực ngắn; đặt cờ và xử lý ở vòng lặp chính.' },
]);

const c5 = doc('spf291-5-1-ipc', '5.1 — Inter-process communication (IPC)|||5.1 — Giao tiếp liên tiến trình (IPC)',
  'Pipe (ẩn danh), FIFO (named pipe), shared memory, message queue; khi nào dùng cái nào. Ví dụ pipe cha-con.',
  [[
    `<span class="eyebrow">SPF291 · Chapter 5 · Lesson 5.1</span>
<h2>Inter-process communication (IPC)</h2>
<h3>Ways processes talk</h3>
<ul>
<li><strong>Pipe</strong> — a one-way byte stream between related processes (parent/child). <code>pipe()</code> gives two fds: read end and write end.</li>
<li><strong>FIFO (named pipe)</strong> — like a pipe but has a name in the filesystem, so unrelated processes can meet.</li>
<li><strong>Shared memory</strong> — a region mapped into several processes; the fastest IPC (no copy), but you must synchronise access yourself.</li>
<li><strong>Message queue</strong> — the kernel keeps discrete messages you send/receive by priority.</li>
</ul>
<pre><code class="language-c">#include &lt;unistd.h&gt;
#include &lt;stdio.h&gt;

int main(void) {
    int fd[2];
    pipe(fd);                    /* fd[0]=read, fd[1]=write */
    if (fork() == 0) {
        close(fd[0]);
        write(fd[1], "hi parent", 9);   /* child -&gt; parent */
    } else {
        char buf[16];
        close(fd[1]);
        int n = read(fd[0], buf, sizeof buf);
        printf("parent got %d bytes\n", n);
    }
    return 0;
}</code></pre>
<div class="callout"><span class="badge">Pick the tool</span> Pipes for a simple stream between kin; FIFOs for unrelated processes; shared memory for speed; message queues for structured, prioritised messages.</div>`,
    `<span class="eyebrow">SPF291 · Chương 5 · Bài 5.1</span>
<h2>Giao tiếp liên tiến trình (IPC)</h2>
<h3>Các cách tiến trình nói chuyện</h3>
<ul>
<li><strong>Pipe</strong> — luồng byte một chiều giữa các tiến trình có họ (cha/con). <code>pipe()</code> cho hai fd: đầu đọc và đầu ghi.</li>
<li><strong>FIFO (named pipe)</strong> — như pipe nhưng có tên trong hệ thống file, nên tiến trình không họ hàng cũng gặp được nhau.</li>
<li><strong>Shared memory</strong> — vùng nhớ ánh xạ vào nhiều tiến trình; IPC nhanh nhất (không sao chép), nhưng bạn phải tự đồng bộ truy cập.</li>
<li><strong>Message queue</strong> — nhân giữ các thông điệp rời rạc, gửi/nhận theo độ ưu tiên.</li>
</ul>
<pre><code class="language-c">#include &lt;unistd.h&gt;
#include &lt;stdio.h&gt;

int main(void) {
    int fd[2];
    pipe(fd);                    /* fd[0]=doc, fd[1]=ghi */
    if (fork() == 0) {
        close(fd[0]);
        write(fd[1], "hi parent", 9);   /* con -&gt; cha */
    } else {
        char buf[16];
        close(fd[1]);
        int n = read(fd[0], buf, sizeof buf);
        printf("cha nhan %d byte\n", n);
    }
    return 0;
}</code></pre>
<div class="callout"><span class="badge">Chọn công cụ</span> Pipe cho luồng đơn giản giữa họ hàng; FIFO cho tiến trình không họ hàng; shared memory cho tốc độ; message queue cho thông điệp có cấu trúc, có ưu tiên.</div>`,
  ]]);

const c5q = quiz('spf291-quiz-5', 'Quiz 5 — IPC|||Quiz 5 — IPC', [
  { id: 'q1', question: 'pipe() trả về hai fd dùng để?|||pipe() returns two fds used for?', options: ['Hai file trên đĩa|||Two files on disk', 'Đầu đọc và đầu ghi của luồng byte|||The read end and write end of a byte stream', 'Hai socket mạng|||Two network sockets', 'Hai tín hiệu|||Two signals'], correctIndex: 1, explanation: 'fd[0] là đầu đọc, fd[1] là đầu ghi của pipe một chiều.' },
  { id: 'q2', question: 'Cơ chế IPC nào cho tiến trình KHÔNG họ hàng gặp nhau qua một tên trong hệ thống file?|||Which IPC lets unrelated processes meet via a filesystem name?', options: ['Anonymous pipe', 'FIFO (named pipe)', 'Thanh ghi CPU', 'Signal'], correctIndex: 1, explanation: 'FIFO có tên trên hệ thống file nên tiến trình không họ hàng dùng chung được.' },
  { id: 'q3', question: 'IPC nào nhanh nhất nhưng buộc bạn tự đồng bộ?|||Which IPC is fastest but forces you to synchronise yourself?', options: ['Pipe', 'Message queue', 'Shared memory', 'Signal'], correctIndex: 2, explanation: 'Shared memory không sao chép dữ liệu nên nhanh nhất, nhưng cần mutex/semaphore.' },
]);

const c6 = doc('spf291-6-1-threads', '6.1 — POSIX threads|||6.1 — Luồng POSIX',
  'Thread vs process (chung bộ nhớ); pthread_create/join; race condition; mutex bảo vệ vùng găng. Ví dụ hai luồng + mutex.',
  [[
    `<span class="eyebrow">SPF291 · Chapter 6 · Lesson 6.1</span>
<h2>POSIX threads (pthreads)</h2>
<h3>Threads share memory</h3>
<p>Where processes each have their own memory, <strong>threads</strong> in one process <strong>share</strong> the same address space — so they communicate cheaply, but a <strong>race condition</strong> appears when two threads touch the same data at once.</p>
<ul>
<li><strong>pthread_create()</strong> — start a thread running a function.</li>
<li><strong>pthread_join()</strong> — wait for a thread to finish.</li>
<li><strong>pthread_mutex_lock/unlock()</strong> — a <em>mutex</em> lets only one thread into a critical section at a time.</li>
</ul>
<pre><code class="language-c">#include &lt;pthread.h&gt;

long counter = 0;
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;

void *work(void *arg) {
    for (int i = 0; i &lt; 100000; i++) {
        pthread_mutex_lock(&amp;m);      /* enter critical section */
        counter++;
        pthread_mutex_unlock(&amp;m);
    }
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_create(&amp;a, NULL, work, NULL);
    pthread_create(&amp;b, NULL, work, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);       /* counter == 200000, no race */
    return 0;
}</code></pre>
<div class="callout"><span class="badge">Critical section</span> Without the mutex, counter++ (read-modify-write) interleaves and you lose updates. The lock makes it atomic.</div>`,
    `<span class="eyebrow">SPF291 · Chương 6 · Bài 6.1</span>
<h2>Luồng POSIX (pthreads)</h2>
<h3>Luồng dùng chung bộ nhớ</h3>
<p>Trong khi mỗi tiến trình có bộ nhớ riêng, các <strong>luồng (thread)</strong> trong cùng một tiến trình <strong>dùng chung</strong> không gian địa chỉ — nên giao tiếp rẻ, nhưng <strong>race condition</strong> xuất hiện khi hai luồng chạm cùng một dữ liệu cùng lúc.</p>
<ul>
<li><strong>pthread_create()</strong> — khởi động một luồng chạy một hàm.</li>
<li><strong>pthread_join()</strong> — chờ một luồng kết thúc.</li>
<li><strong>pthread_mutex_lock/unlock()</strong> — một <em>mutex</em> chỉ cho một luồng vào vùng găng tại một thời điểm.</li>
</ul>
<pre><code class="language-c">#include &lt;pthread.h&gt;

long counter = 0;
pthread_mutex_t m = PTHREAD_MUTEX_INITIALIZER;

void *work(void *arg) {
    for (int i = 0; i &lt; 100000; i++) {
        pthread_mutex_lock(&amp;m);      /* vao vung gang */
        counter++;
        pthread_mutex_unlock(&amp;m);
    }
    return NULL;
}

int main(void) {
    pthread_t a, b;
    pthread_create(&amp;a, NULL, work, NULL);
    pthread_create(&amp;b, NULL, work, NULL);
    pthread_join(a, NULL);
    pthread_join(b, NULL);       /* counter == 200000, khong race */
    return 0;
}</code></pre>
<div class="callout"><span class="badge">Vùng găng</span> Không có mutex, counter++ (đọc-sửa-ghi) đan xen và bạn mất cập nhật. Khoá làm nó nguyên tử.</div>`,
  ]]);

const c6q = quiz('spf291-quiz-6', 'Quiz 6 — Threads|||Quiz 6 — Luồng', [
  { id: 'q1', question: 'Khác biệt chính giữa thread và process?|||Main difference between a thread and a process?', options: ['Thread luôn chậm hơn|||Threads are always slower', 'Các thread trong một tiến trình dùng chung bộ nhớ|||Threads in one process share memory', 'Process không có PID|||A process has no PID', 'Thread không chạy song song|||Threads never run in parallel'], correctIndex: 1, explanation: 'Thread chia sẻ không gian địa chỉ; process thì mỗi cái có bộ nhớ riêng.' },
  { id: 'q2', question: 'Mutex dùng để?|||A mutex is used to?', options: ['Tăng tốc CPU|||Speed up the CPU', 'Chỉ cho một luồng vào vùng găng tại một thời điểm|||Allow only one thread in a critical section at a time', 'Cấp phát bộ nhớ|||Allocate memory', 'Gửi tín hiệu|||Send a signal'], correctIndex: 1, explanation: 'Mutex bảo vệ vùng găng, ngăn race condition.' },
  { id: 'q3', question: 'Hàm nào chờ một luồng kết thúc?|||Which call waits for a thread to finish?', options: ['pthread_create()', 'pthread_join()', 'pthread_exit()', 'fork()'], correctIndex: 1, explanation: 'pthread_join() chặn tới khi luồng đích hoàn thành.' },
]);

const c7 = doc('spf291-7-1-sockets', '7.1 — Network programming with sockets|||7.1 — Lập trình mạng với socket',
  'Socket là điểm cuối; TCP (tin cậy, dòng) vs UDP (không kết nối, gói); luồng server: socket/bind/listen/accept; client: connect. Ví dụ TCP server.',
  [[
    `<span class="eyebrow">SPF291 · Chapter 7 · Lesson 7.1</span>
<h2>Network programming with sockets</h2>
<h3>Sockets, TCP &amp; UDP</h3>
<p>A <strong>socket</strong> is an endpoint for network communication, used like a file descriptor.</p>
<ul>
<li><strong>TCP</strong> — connection-oriented, reliable, ordered byte stream (web, SSH).</li>
<li><strong>UDP</strong> — connectionless datagrams, fast but no guarantees (DNS, video).</li>
</ul>
<p>A TCP <strong>server</strong> follows: <code>socket()</code> → <code>bind()</code> → <code>listen()</code> → <code>accept()</code>; a <strong>client</strong> does <code>socket()</code> → <code>connect()</code>.</p>
<pre><code class="language-c">#include &lt;sys/socket.h&gt;
#include &lt;netinet/in.h&gt;

int main(void) {
    int s = socket(AF_INET, SOCK_STREAM, 0);   /* TCP socket */
    struct sockaddr_in addr = {0};
    addr.sin_family = AF_INET;
    addr.sin_port = htons(8080);
    addr.sin_addr.s_addr = INADDR_ANY;

    bind(s, (struct sockaddr *)&amp;addr, sizeof addr);
    listen(s, 16);
    int c = accept(s, NULL, NULL);             /* block for a client */
    write(c, "hello\n", 6);
    return 0;
}</code></pre>
<div class="callout"><span class="badge">fd again</span> Once connected, you read()/write() a socket just like a file — the same low-level I/O you already learned.</div>`,
    `<span class="eyebrow">SPF291 · Chương 7 · Bài 7.1</span>
<h2>Lập trình mạng với socket</h2>
<h3>Socket, TCP &amp; UDP</h3>
<p>Một <strong>socket</strong> là điểm cuối cho giao tiếp mạng, dùng như một file descriptor.</p>
<ul>
<li><strong>TCP</strong> — hướng kết nối, tin cậy, dòng byte có thứ tự (web, SSH).</li>
<li><strong>UDP</strong> — không kết nối, gói datagram, nhanh nhưng không bảo đảm (DNS, video).</li>
</ul>
<p>Một <strong>server</strong> TCP theo trình tự: <code>socket()</code> → <code>bind()</code> → <code>listen()</code> → <code>accept()</code>; một <strong>client</strong> làm <code>socket()</code> → <code>connect()</code>.</p>
<pre><code class="language-c">#include &lt;sys/socket.h&gt;
#include &lt;netinet/in.h&gt;

int main(void) {
    int s = socket(AF_INET, SOCK_STREAM, 0);   /* socket TCP */
    struct sockaddr_in addr = {0};
    addr.sin_family = AF_INET;
    addr.sin_port = htons(8080);
    addr.sin_addr.s_addr = INADDR_ANY;

    bind(s, (struct sockaddr *)&amp;addr, sizeof addr);
    listen(s, 16);
    int c = accept(s, NULL, NULL);             /* chan cho mot client */
    write(c, "hello\n", 6);
    return 0;
}</code></pre>
<div class="callout"><span class="badge">Lại là fd</span> Khi đã kết nối, bạn read()/write() một socket y như một file — chính là I/O cấp thấp bạn đã học.</div>`,
  ]]);

const c7q = quiz('spf291-quiz-7', 'Quiz 7 — Sockets|||Quiz 7 — Socket', [
  { id: 'q1', question: 'Giao thức nào tin cậy, có thứ tự, hướng kết nối?|||Which protocol is reliable, ordered, connection-oriented?', options: ['UDP', 'TCP', 'ICMP', 'ARP'], correctIndex: 1, explanation: 'TCP cho dòng byte tin cậy, có thứ tự; UDP thì không.' },
  { id: 'q2', question: 'Trình tự đúng của một TCP server?|||Correct sequence for a TCP server?', options: ['connect → listen → bind', 'socket → bind → listen → accept', 'accept → socket → bind', 'listen → connect → read'], correctIndex: 1, explanation: 'Server: socket → bind → listen → accept; client dùng connect.' },
  { id: 'q3', question: 'Sau khi kết nối, đọc/ghi dữ liệu trên socket bằng?|||After connecting, you read/write socket data with?', options: ['printf/scanf', 'read()/write() như một fd|||read()/write() like an fd', 'malloc/free', 'fork/exec'], correctIndex: 1, explanation: 'Socket dùng như file descriptor: read()/write() giống I/O file.' },
]);

const c8 = doc('spf291-8-1-memory-tools', '8.1 — Memory management & tools|||8.1 — Quản lý bộ nhớ & công cụ',
  'Bố cục bộ nhớ (text/data/heap/stack); malloc/free, mmap; rò rỉ bộ nhớ; công cụ gdb, valgrind, make. Ví dụ malloc/free.',
  [[
    `<span class="eyebrow">SPF291 · Chapter 8 · Lesson 8.1</span>
<h2>Memory management &amp; tools</h2>
<h3>Process memory layout</h3>
<ul>
<li><strong>Text</strong> — the code. <strong>Data/BSS</strong> — globals. <strong>Heap</strong> — grows up via malloc. <strong>Stack</strong> — grows down for calls/locals.</li>
<li><strong>malloc()/free()</strong> — allocate and release heap memory; every malloc needs exactly one free (or you leak).</li>
<li><strong>mmap()</strong> — map files or anonymous pages straight into your address space.</li>
</ul>
<pre><code class="language-c">#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;

int main(void) {
    char *buf = malloc(64);      /* heap allocation */
    if (!buf) return 1;
    strcpy(buf, "systems programming");
    free(buf);                   /* must free, or leak */
    return 0;
}</code></pre>
<h3>Essential tools</h3>
<ul>
<li><strong>gcc/make</strong> — compile; a Makefile automates the build.</li>
<li><strong>gdb</strong> — step through, set breakpoints, inspect variables and stack.</li>
<li><strong>valgrind</strong> — find leaks and invalid memory access (run <code>valgrind ./a.out</code>).</li>
</ul>
<div class="callout"><span class="badge">Leak check</span> Compile with -g, then let valgrind confirm every byte allocated was freed — the habit that separates a systems programmer from a guesser.</div>`,
    `<span class="eyebrow">SPF291 · Chương 8 · Bài 8.1</span>
<h2>Quản lý bộ nhớ &amp; công cụ</h2>
<h3>Bố cục bộ nhớ của tiến trình</h3>
<ul>
<li><strong>Text</strong> — mã lệnh. <strong>Data/BSS</strong> — biến toàn cục. <strong>Heap</strong> — lớn dần lên qua malloc. <strong>Stack</strong> — lớn xuống cho lời gọi/biến cục bộ.</li>
<li><strong>malloc()/free()</strong> — cấp phát và giải phóng bộ nhớ heap; mỗi malloc cần đúng một free (không thì rò rỉ).</li>
<li><strong>mmap()</strong> — ánh xạ file hoặc trang ẩn danh thẳng vào không gian địa chỉ của bạn.</li>
</ul>
<pre><code class="language-c">#include &lt;stdlib.h&gt;
#include &lt;string.h&gt;

int main(void) {
    char *buf = malloc(64);      /* cap phat tren heap */
    if (!buf) return 1;
    strcpy(buf, "systems programming");
    free(buf);                   /* phai free, khong thi ro ri */
    return 0;
}</code></pre>
<h3>Công cụ thiết yếu</h3>
<ul>
<li><strong>gcc/make</strong> — biên dịch; một Makefile tự động hoá việc dựng.</li>
<li><strong>gdb</strong> — chạy từng bước, đặt breakpoint, xem biến và stack.</li>
<li><strong>valgrind</strong> — tìm rò rỉ và truy cập bộ nhớ sai (chạy <code>valgrind ./a.out</code>).</li>
</ul>
<div class="callout"><span class="badge">Kiểm rò rỉ</span> Biên dịch với -g, rồi để valgrind xác nhận mọi byte đã cấp phát đều được giải phóng — thói quen phân biệt lập trình viên hệ thống với người đoán mò.</div>`,
  ]]);

const c8q = quiz('spf291-quiz-8', 'Quiz 8 — Memory & tools|||Quiz 8 — Bộ nhớ & công cụ', [
  { id: 'q1', question: 'Vùng nhớ nào lớn dần lên khi bạn gọi malloc()?|||Which memory region grows as you call malloc()?', options: ['Stack', 'Text', 'Heap', 'BSS'], correctIndex: 2, explanation: 'malloc() cấp phát trên heap; stack dùng cho lời gọi hàm và biến cục bộ.' },
  { id: 'q2', question: 'Mỗi malloc() cần bao nhiêu free() để không rò rỉ?|||How many free() calls does each malloc() need?', options: ['Không cần|||None needed', 'Đúng một|||Exactly one', 'Hai', 'Tuỳ hệ điều hành|||Depends on the OS'], correctIndex: 1, explanation: 'Mỗi vùng cấp phát cần đúng một free(); thiếu là rò rỉ, thừa là double-free.' },
  { id: 'q3', question: 'Công cụ nào phát hiện rò rỉ và truy cập bộ nhớ sai?|||Which tool finds leaks and invalid memory access?', options: ['make', 'valgrind', 'htop', 'grep'], correctIndex: 1, explanation: 'valgrind báo rò rỉ và truy cập ngoài vùng; gdb để gỡ lỗi từng bước.' },
]);

const taiLieu = doc('spf291-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình FLM, sách Kerrisk & Stevens, man pages, CMU 15-213, YouTube, công cụ, lộ trình 4 bước.',
  [[
    `<span class="eyebrow">SPF291 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Systems Programming in C on Linux — processes, files, signals, IPC, threads, sockets, memory — in one place. The official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for SPF291 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://man7.org/tlpi/" target="_blank" rel="noopener"><em>The Linux Programming Interface</em> — Michael Kerrisk</a></li>
<li><a href="https://www.apuebook.com/" target="_blank" rel="noopener"><em>Advanced Programming in the UNIX Environment</em> — W. Richard Stevens</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://man7.org/linux/man-pages/" target="_blank" rel="noopener">Linux man pages (man7.org) — section 2 system calls</a></li>
<li><a href="https://csapp.cs.cmu.edu/" target="_blank" rel="noopener">CS:APP — Computer Systems: A Programmer's Perspective (CMU 15-213)</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@CoffeeBeforeArch" target="_blank" rel="noopener">Coffee Before Arch</a> — systems &amp; concurrency in C/C++</li>
<li><a href="https://www.youtube.com/@JacobSorber" target="_blank" rel="noopener">Jacob Sorber</a> — practical C, syscalls, sockets, threads</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://gcc.gnu.org/" target="_blank" rel="noopener">GCC</a> — the GNU C compiler</li>
<li><a href="https://www.sourceware.org/gdb/" target="_blank" rel="noopener">GDB</a> — the GNU debugger</li>
<li><a href="https://valgrind.org/" target="_blank" rel="noopener">Valgrind</a> — memory leak &amp; error detector</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundations</strong> — system call vs library, processes (fork/exec/wait), low-level file I/O.</li>
<li><strong>Signals &amp; IPC</strong> — handlers; pipes, FIFOs, shared memory, message queues.</li>
<li><strong>Concurrency &amp; network</strong> — POSIX threads &amp; mutexes; TCP/UDP sockets.</li>
<li><strong>Job-ready</strong> — read man pages, build with make, debug with gdb, check memory with valgrind.</li>
</ol></div>`,
    `<span class="eyebrow">SPF291 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Lập trình hệ thống bằng C trên Linux — tiến trình, file, tín hiệu, IPC, luồng, socket, bộ nhớ — gom về một chỗ. Slide &amp; giáo trình chính thức nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của SPF291 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://man7.org/tlpi/" target="_blank" rel="noopener"><em>The Linux Programming Interface</em> — Michael Kerrisk</a></li>
<li><a href="https://www.apuebook.com/" target="_blank" rel="noopener"><em>Advanced Programming in the UNIX Environment</em> — W. Richard Stevens</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://man7.org/linux/man-pages/" target="_blank" rel="noopener">Man pages Linux (man7.org) — mục 2 là system call</a></li>
<li><a href="https://csapp.cs.cmu.edu/" target="_blank" rel="noopener">CS:APP — Computer Systems: A Programmer's Perspective (CMU 15-213)</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@CoffeeBeforeArch" target="_blank" rel="noopener">Coffee Before Arch</a> — hệ thống &amp; đồng thời trong C/C++</li>
<li><a href="https://www.youtube.com/@JacobSorber" target="_blank" rel="noopener">Jacob Sorber</a> — C thực hành, syscall, socket, thread</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://gcc.gnu.org/" target="_blank" rel="noopener">GCC</a> — trình biên dịch C của GNU</li>
<li><a href="https://www.sourceware.org/gdb/" target="_blank" rel="noopener">GDB</a> — trình gỡ lỗi của GNU</li>
<li><a href="https://valgrind.org/" target="_blank" rel="noopener">Valgrind</a> — công cụ dò rò rỉ &amp; lỗi bộ nhớ</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền tảng</strong> — system call vs thư viện, tiến trình (fork/exec/wait), I/O file cấp thấp.</li>
<li><strong>Tín hiệu &amp; IPC</strong> — handler; pipe, FIFO, shared memory, message queue.</li>
<li><strong>Đồng thời &amp; mạng</strong> — luồng POSIX &amp; mutex; socket TCP/UDP.</li>
<li><strong>Sẵn sàng đi làm</strong> — đọc man page, dựng bằng make, gỡ lỗi bằng gdb, kiểm bộ nhớ bằng valgrind.</li>
</ol></div>`,
  ]]);

export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'SPF291',
    slug: 'spf291-systems-programming',
    title: 'Systems Programming',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/SPF291.webp',
    shortDescription: 'Systems programming in C on Linux — system calls vs library, kernel/user space, processes (fork/exec/wait), file I/O, signals, IPC (pipe/shared memory), POSIX threads & mutex, TCP/UDP sockets, memory (malloc/mmap) & tools (gdb/valgrind). Bilingual, C examples & quizzes.|||Lập trình hệ thống bằng C trên Linux — system call, tiến trình, I/O file, tín hiệu, IPC, luồng POSIX & mutex, socket TCP/UDP, bộ nhớ & công cụ (gdb/valgrind). Song ngữ, có ví dụ C & quiz.',
    description: 'Môn <strong>SPF291 — Systems Programming</strong> (Lập trình hệ thống, kỳ 3) dạy bạn lập trình <strong>trực tiếp với hệ điều hành</strong> bằng <strong>C trên Linux</strong>. Từ <strong>nền tảng</strong> (system call vs thư viện, kernel/user space, tiến trình fork/exec/wait, I/O file cấp thấp) → <strong>tín hiệu &amp; IPC</strong> (signal, pipe, FIFO, shared memory, message queue) → <strong>đồng thời &amp; mạng</strong> (luồng POSIX &amp; mutex, socket TCP/UDP) → <strong>bộ nhớ &amp; công cụ</strong> (malloc/mmap, gdb/valgrind/make). Song ngữ, mỗi chương có khối code C minh hoạ và quiz. Sách chuẩn: Kerrisk &amp; Stevens.',
    whatYouLearn: 'System call vs hàm thư viện, kernel/user space; quản lý tiến trình (fork/exec/wait/exit, PID); I/O file cấp thấp (fd, open/read/write/close, lseek); tín hiệu (handler, SIGINT/SIGTERM/SIGKILL, kill); IPC (pipe, FIFO, shared memory, message queue); luồng POSIX (pthread_create/join, mutex, race condition); socket mạng (TCP/UDP, client-server); quản lý bộ nhớ (bố cục, malloc/free, mmap) và công cụ gdb/valgrind/make.',
    requirements: 'Biết lập trình C cơ bản (con trỏ, struct, mảng) và dùng terminal Linux. Xem điều kiện tiên quyết trong khung chương trình ngành Khoa học Máy tính trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình FLM, Kerrisk & Stevens, man pages, CMU 15-213, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'Lập trình hệ thống, C + Linux, lộ trình 4 bước.', lessons: [intro] },
    { title: 'Chương 1 — Lập trình hệ thống là gì|||Chapter 1 — What is systems programming', description: 'System call vs thư viện, kernel/user space.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Quản lý tiến trình|||Chapter 2 — Process management', description: 'fork/exec/wait, PID, exit.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Vào/ra file cấp thấp|||Chapter 3 — Low-level file I/O', description: 'fd, open/read/write/close, lseek.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Tín hiệu|||Chapter 4 — Signals', description: 'Handler, SIGINT/SIGKILL, kill.', lessons: [c4, c4q] },
    { title: 'Chương 5 — IPC|||Chapter 5 — IPC', description: 'Pipe, FIFO, shared memory, message queue.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Luồng POSIX|||Chapter 6 — POSIX threads', description: 'pthread, mutex, đồng bộ.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Lập trình mạng socket|||Chapter 7 — Socket programming', description: 'socket, TCP/UDP, client-server.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Bộ nhớ & công cụ|||Chapter 8 — Memory & tools', description: 'malloc/mmap, gdb/valgrind/make.', lessons: [c8, c8q] },
  ],
};
