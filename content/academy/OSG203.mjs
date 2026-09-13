/**
 * OSG203 — Operating System (Hệ điều hành), ngành Khoa học Máy tính FPTU.
 * FULL KHUNG — 8 chương kiến thức, song ngữ VI+EN, mỗi chương 1 DOCUMENT + 1 QUIZ.
 * Sách chuẩn: Silberschatz/Galvin/Gagne "Operating System Concepts";
 * Tanenbaum "Modern Operating Systems"; OSTEP (Arpaci-Dusseau); MIT 6.828.
 * Giữ NGUYÊN slug/semester/courseCode/thumb. ⚠️ KHÔNG backtick/${; & -> &amp; trong HTML.
 */
const bi = (en, vi) => `<div class="ml-en">${en}</div>\n<div class="ml-vi">${vi}</div>`;
const doc = (slug, title, desc, pairs) => ({ title, slug, type: 'DOCUMENT', description: desc, content: pairs.map(([e, v]) => bi(e, v)).join('\n') });
const quiz = (slug, title, questions) => ({ title, slug, type: 'QUIZ', description: 'Kiểm tra nhanh kiến thức chương.', quiz: { timeLimitSeconds: 480, questions } });

const intro = doc('osg203-0-1-overview', 'Course overview: Operating Systems|||Tổng quan: Hệ điều hành',
  'HĐH là gì, vì sao cần; lộ trình: tổng quan & kernel → tiến trình & luồng → lập lịch → đồng bộ & deadlock → bộ nhớ & bộ nhớ ảo → file & I/O. Sách: Silberschatz, Tanenbaum, OSTEP.',
  [[
    `<span class="eyebrow">OSG203 · Lesson 0.1 · Overview</span>
<h2>Operating Systems</h2>
<p class="lead">An <strong>operating system (OS)</strong> is the software layer between hardware and your programs. It does two big jobs: it is a <strong>resource manager</strong> (sharing the CPU, memory, disk and devices fairly and safely among many programs) and an <strong>abstraction layer</strong> (turning messy hardware into clean ideas like files, processes and virtual memory).</p>
<h3>Why it matters</h3>
<ul>
<li>Runs many programs at once on limited hardware (multiprogramming).</li>
<li>Protects programs from each other and protects the machine from buggy code.</li>
<li>Gives every program the same simple view: a private memory space, files, and system calls.</li>
</ul>
<h3>Roadmap</h3>
<p>OS overview &amp; the kernel → processes → threads &amp; CPU scheduling → synchronization → deadlock → memory management → virtual memory → file systems &amp; I/O. Bilingual, with worked examples and a quiz per chapter.</p>
<h3>Study path (4 steps)</h3>
<ol>
<li><strong>Concepts</strong> — read each chapter, learn the vocabulary.</li>
<li><strong>Mechanism</strong> — understand how the OS actually does it (PCB, page table, scheduler).</li>
<li><strong>Practice</strong> — trace scheduling and page-replacement examples by hand.</li>
<li><strong>Go deep</strong> — read OSTEP and try MIT 6.828 labs.</li>
</ol>`,
    `<span class="eyebrow">OSG203 · Bài 0.1 · Tổng quan</span>
<h2>Hệ điều hành</h2>
<p class="lead">Một <strong>hệ điều hành (HĐH)</strong> là lớp phần mềm nằm giữa phần cứng và chương trình của bạn. Nó làm hai việc lớn: <strong>quản lý tài nguyên</strong> (chia sẻ CPU, bộ nhớ, đĩa và thiết bị một cách công bằng, an toàn cho nhiều chương trình) và <strong>lớp trừu tượng hoá</strong> (biến phần cứng phức tạp thành các khái niệm gọn như file, tiến trình, bộ nhớ ảo).</p>
<h3>Vì sao quan trọng</h3>
<ul>
<li>Chạy nhiều chương trình cùng lúc trên phần cứng có hạn (đa chương trình).</li>
<li>Bảo vệ các chương trình khỏi nhau và bảo vệ máy khỏi mã lỗi.</li>
<li>Cho mọi chương trình cùng một góc nhìn đơn giản: vùng nhớ riêng, file, và system call.</li>
</ul>
<h3>Lộ trình</h3>
<p>Tổng quan &amp; kernel → tiến trình → luồng &amp; lập lịch CPU → đồng bộ hoá → deadlock → quản lý bộ nhớ → bộ nhớ ảo → hệ thống file &amp; I/O. Song ngữ, có ví dụ mẫu và quiz mỗi chương.</p>
<h3>Lộ trình học (4 bước)</h3>
<ol>
<li><strong>Khái niệm</strong> — đọc từng chương, nắm thuật ngữ.</li>
<li><strong>Cơ chế</strong> — hiểu HĐH thực sự làm thế nào (PCB, bảng trang, bộ lập lịch).</li>
<li><strong>Luyện tập</strong> — tự tay chạy ví dụ lập lịch và thay trang.</li>
<li><strong>Đào sâu</strong> — đọc OSTEP và thử lab MIT 6.828.</li>
</ol>`,
  ]]);

const taiLieu = doc('osg203-0-0-tai-lieu', '📚 Course materials & references|||📚 Tài liệu tham khảo môn học',
  'Trung tâm tài liệu: giáo trình & slide (FLM), sách chuẩn (Silberschatz, Tanenbaum, OSTEP), tài liệu miễn phí, YouTube, công cụ, lộ trình tự học.',
  [[
    `<span class="eyebrow">OSG203 · Materials</span>
<h2>Course materials &amp; resource hub</h2>
<p class="lead">Everything to learn Operating Systems — kernel, processes, scheduling, synchronization, memory and file systems — in one place. The full official slides &amp; textbook live on <strong>FLM</strong>; below are free, legal resources.</p>
<h3>📘 Textbook &amp; slides</h3>
<p>The official FPTU giáo trình &amp; lecture slides for OSG203 are on <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — sign in with your FPTU account.</p>
<h3>📗 Reference books</h3>
<ul>
<li><a href="https://www.os-book.com/" target="_blank" rel="noopener"><em>Operating System Concepts</em> — Silberschatz, Galvin &amp; Gagne</a></li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/modern-operating-systems/P200000003311" target="_blank" rel="noopener"><em>Modern Operating Systems</em> — Tanenbaum</a></li>
</ul>
<h3>🌐 Official / free documentation</h3>
<ul>
<li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/" target="_blank" rel="noopener">OSTEP — Operating Systems: Three Easy Pieces (free book)</a></li>
<li><a href="https://pdos.csail.mit.edu/6.828/" target="_blank" rel="noopener">MIT 6.828 / 6.1810 — Operating System Engineering</a></li>
</ul>
<h3>▶️ YouTube channels</h3>
<ul>
<li><a href="https://www.youtube.com/@NesoAcademy" target="_blank" rel="noopener">Neso Academy</a> — full OS lecture series</li>
<li><a href="https://www.youtube.com/@jacobsorber" target="_blank" rel="noopener">Jacob Sorber</a> — systems programming (processes, threads, IPC)</li>
</ul>
<h3>🛠️ Tools</h3>
<ul>
<li><a href="https://www.gnu.org/software/bash/" target="_blank" rel="noopener">Linux shell</a> — try ps, top, kill, free to see OS concepts live</li>
<li><a href="https://man7.org/linux/man-pages/" target="_blank" rel="noopener">Linux man-pages</a> — system call reference (fork, exec, wait, mmap)</li>
</ul>
<div class="callout"><span class="badge">Self-study path</span>
<ol>
<li><strong>Foundation / exam core</strong> — kernel &amp; system calls, process states, CPU scheduling algorithms.</li>
<li><strong>Practice</strong> — trace FCFS/SJF/RR and FIFO/LRU by hand until the numbers match.</li>
<li><strong>Go deeper</strong> — synchronization, deadlock, paging and virtual memory.</li>
<li><strong>Job-ready</strong> — write small C programs with fork/exec/threads and watch them with ps/top.</li>
</ol></div>`,
    `<span class="eyebrow">OSG203 · Tài liệu</span>
<h2>Trung tâm tài liệu tham khảo</h2>
<p class="lead">Mọi thứ để học Hệ điều hành — kernel, tiến trình, lập lịch, đồng bộ, bộ nhớ và hệ thống file — gom về một chỗ. Slide &amp; giáo trình chính thức đầy đủ nằm trên <strong>FLM</strong>; bên dưới là nguồn miễn phí, hợp pháp.</p>
<h3>📘 Giáo trình &amp; slide</h3>
<p>Giáo trình FPTU &amp; slide bài giảng chính thức của OSG203 có trên <a href="https://flm.fpt.edu.vn" target="_blank" rel="noopener">FLM (flm.fpt.edu.vn)</a> — đăng nhập bằng tài khoản FPTU.</p>
<h3>📗 Sách tham khảo</h3>
<ul>
<li><a href="https://www.os-book.com/" target="_blank" rel="noopener"><em>Operating System Concepts</em> — Silberschatz, Galvin &amp; Gagne</a></li>
<li><a href="https://www.pearson.com/en-us/subject-catalog/p/modern-operating-systems/P200000003311" target="_blank" rel="noopener"><em>Modern Operating Systems</em> — Tanenbaum</a></li>
</ul>
<h3>🌐 Tài liệu chính thức / miễn phí</h3>
<ul>
<li><a href="https://pages.cs.wisc.edu/~remzi/OSTEP/" target="_blank" rel="noopener">OSTEP — Operating Systems: Three Easy Pieces (sách miễn phí)</a></li>
<li><a href="https://pdos.csail.mit.edu/6.828/" target="_blank" rel="noopener">MIT 6.828 / 6.1810 — Operating System Engineering</a></li>
</ul>
<h3>▶️ Kênh YouTube</h3>
<ul>
<li><a href="https://www.youtube.com/@NesoAcademy" target="_blank" rel="noopener">Neso Academy</a> — loạt bài giảng OS đầy đủ</li>
<li><a href="https://www.youtube.com/@jacobsorber" target="_blank" rel="noopener">Jacob Sorber</a> — lập trình hệ thống (tiến trình, luồng, IPC)</li>
</ul>
<h3>🛠️ Công cụ</h3>
<ul>
<li><a href="https://www.gnu.org/software/bash/" target="_blank" rel="noopener">Linux shell</a> — thử ps, top, kill, free để thấy khái niệm OS chạy thật</li>
<li><a href="https://man7.org/linux/man-pages/" target="_blank" rel="noopener">Linux man-pages</a> — tra system call (fork, exec, wait, mmap)</li>
</ul>
<div class="callout"><span class="badge">Lộ trình tự học</span>
<ol>
<li><strong>Nền / lõi thi</strong> — kernel &amp; system call, trạng thái tiến trình, các thuật toán lập lịch CPU.</li>
<li><strong>Luyện tập</strong> — tự tay chạy FCFS/SJF/RR và FIFO/LRU đến khi số khớp.</li>
<li><strong>Đào sâu</strong> — đồng bộ hoá, deadlock, phân trang và bộ nhớ ảo.</li>
<li><strong>Sẵn sàng đi làm</strong> — viết chương trình C nhỏ dùng fork/exec/luồng và quan sát bằng ps/top.</li>
</ol></div>`,
  ]]);

const c1 = doc('osg203-1-1-overview-kernel', '1.1 — OS overview & the kernel|||1.1 — Tổng quan HĐH & kernel',
  'Vai trò HĐH, kernel, system call, chế độ user/kernel (dual mode), interrupt/trap, cấu trúc HĐH (monolithic vs microkernel).',
  [[
    `<span class="eyebrow">OSG203 · Chapter 1 · Lesson 1.1</span>
<h2>OS overview &amp; the kernel</h2>
<h3>The kernel</h3>
<p>The <strong>kernel</strong> is the core of the OS — the part always in memory that controls the CPU, memory and devices. Your programs never touch hardware directly; they ask the kernel to do it.</p>
<h3>Dual mode: user vs kernel</h3>
<p>The CPU runs in one of two modes, controlled by a hardware bit:</p>
<ul>
<li><strong>User mode</strong> — normal programs run here; privileged instructions (halt CPU, access I/O directly) are forbidden.</li>
<li><strong>Kernel mode</strong> — the kernel runs here with full access. This protection stops a buggy or malicious program from crashing the whole machine.</li>
</ul>
<h3>System calls</h3>
<p>A <strong>system call</strong> is the doorway from user mode into the kernel — how a program asks for a service (open a file, create a process, allocate memory). It triggers a <strong>trap</strong> that switches to kernel mode, runs the service, then returns.</p>
<pre><code>read()   -&gt; trap -&gt; switch to kernel mode
         -&gt; kernel reads from disk
         -&gt; switch back to user mode -&gt; return data</code></pre>
<h3>OS structure</h3>
<ul>
<li><strong>Monolithic</strong> (Linux) — the whole OS is one big kernel; fast, but a bug anywhere can crash it.</li>
<li><strong>Microkernel</strong> — only the essentials in the kernel; drivers/services run as user processes; safer but slower due to message passing.</li>
</ul>
<div class="callout"><span class="badge">Key idea</span> Interrupts (from hardware) and traps (from software, including system calls) are the two ways control jumps into the kernel.</div>`,
    `<span class="eyebrow">OSG203 · Chương 1 · Bài 1.1</span>
<h2>Tổng quan HĐH &amp; kernel</h2>
<h3>Kernel (nhân)</h3>
<p><strong>Kernel</strong> là lõi của HĐH — phần luôn nằm trong bộ nhớ, điều khiển CPU, bộ nhớ và thiết bị. Chương trình của bạn không bao giờ chạm phần cứng trực tiếp; chúng nhờ kernel làm hộ.</p>
<h3>Hai chế độ: user và kernel</h3>
<p>CPU chạy ở một trong hai chế độ, do một bit phần cứng điều khiển:</p>
<ul>
<li><strong>Chế độ user</strong> — chương trình thường chạy ở đây; các lệnh đặc quyền (dừng CPU, truy cập I/O trực tiếp) bị cấm.</li>
<li><strong>Chế độ kernel</strong> — kernel chạy ở đây với toàn quyền. Cơ chế bảo vệ này ngăn một chương trình lỗi hoặc độc hại làm sập cả máy.</li>
</ul>
<h3>System call (lời gọi hệ thống)</h3>
<p>Một <strong>system call</strong> là cánh cửa từ chế độ user vào kernel — cách chương trình xin một dịch vụ (mở file, tạo tiến trình, cấp bộ nhớ). Nó gây ra một <strong>trap</strong> chuyển sang chế độ kernel, chạy dịch vụ, rồi trả về.</p>
<pre><code>read()   -&gt; trap -&gt; chuyển sang chế độ kernel
         -&gt; kernel đọc từ đĩa
         -&gt; quay lại chế độ user -&gt; trả dữ liệu</code></pre>
<h3>Cấu trúc HĐH</h3>
<ul>
<li><strong>Monolithic</strong> (Linux) — cả HĐH là một kernel lớn; nhanh, nhưng lỗi ở đâu cũng có thể làm sập.</li>
<li><strong>Microkernel</strong> — chỉ phần cốt lõi trong kernel; driver/dịch vụ chạy như tiến trình user; an toàn hơn nhưng chậm hơn do truyền thông điệp.</li>
</ul>
<div class="callout"><span class="badge">Ý chính</span> Interrupt (từ phần cứng) và trap (từ phần mềm, gồm cả system call) là hai cách để quyền điều khiển nhảy vào kernel.</div>`,
  ]]);

const c1q = quiz('osg203-quiz-1', 'Quiz 1 — Overview & kernel|||Quiz 1 — Tổng quan & kernel', [
  { id: 'q1', question: 'System call dùng để làm gì?|||What is a system call for?', options: ['Tăng tốc CPU', 'Cách chương trình xin dịch vụ từ kernel', 'Một loại virus', 'Lập lịch tiến trình'], correctIndex: 1, explanation: 'System call là cửa từ user mode vào kernel để xin dịch vụ (mở file, tạo tiến trình...).' },
  { id: 'q2', question: 'Chế độ kernel khác chế độ user ở điểm nào?|||How does kernel mode differ from user mode?', options: ['Chạy chậm hơn', 'Có toàn quyền truy cập phần cứng và lệnh đặc quyền', 'Không dùng bộ nhớ', 'Chỉ dành cho game'], correctIndex: 1, explanation: 'Kernel mode có toàn quyền; user mode bị cấm các lệnh đặc quyền để bảo vệ máy.' },
  { id: 'q3', question: 'Kernel kiểu nào chạy driver như tiến trình user để an toàn hơn?|||Which kernel runs drivers as user processes for safety?', options: ['Monolithic', 'Microkernel', 'Kernel rỗng', 'Kernel ảo'], correctIndex: 1, explanation: 'Microkernel giữ kernel tối thiểu, đẩy driver/dịch vụ ra user space; an toàn hơn nhưng chậm hơn.' },
]);

const c2 = doc('osg203-2-1-processes', '2.1 — Processes|||2.1 — Tiến trình',
  'Tiến trình vs chương trình, PCB, các trạng thái (new/ready/running/waiting/terminated), context switch, tạo tiến trình (fork/exec), IPC.',
  [[
    `<span class="eyebrow">OSG203 · Chapter 2 · Lesson 2.1</span>
<h2>Processes</h2>
<h3>Program vs process</h3>
<p>A <strong>program</strong> is a file on disk (passive). A <strong>process</strong> is a program in execution (active) — with its own code, data, stack, heap, and CPU register values.</p>
<h3>The PCB</h3>
<p>The OS tracks each process with a <strong>Process Control Block (PCB)</strong>: process id (PID), state, program counter, CPU registers, memory limits, open files. It is the process saved as data.</p>
<h3>Process states</h3>
<pre><code>new -&gt; ready -&gt; running -&gt; terminated
             ^        |
             |        v
           ready &lt;- waiting  (blocked on I/O)</code></pre>
<ul>
<li><strong>ready</strong> — waiting for a CPU.</li>
<li><strong>running</strong> — currently on the CPU.</li>
<li><strong>waiting/blocked</strong> — waiting for an event (e.g. disk read).</li>
</ul>
<h3>Context switch</h3>
<p>To swap the CPU from process A to B, the kernel <strong>saves</strong> A into its PCB and <strong>loads</strong> B from its PCB. This overhead is pure bookkeeping — no useful work happens during it.</p>
<h3>Creation &amp; IPC</h3>
<p>On UNIX, <strong>fork()</strong> makes a copy of the current process and <strong>exec()</strong> replaces it with a new program. Processes have separate memory, so they talk via <strong>Inter-Process Communication (IPC)</strong>: shared memory (fast) or message passing / pipes (safer).</p>
<div class="callout"><span class="badge">Key idea</span> The PCB plus the CPU registers are exactly what a context switch saves and restores.</div>`,
    `<span class="eyebrow">OSG203 · Chương 2 · Bài 2.1</span>
<h2>Tiến trình</h2>
<h3>Chương trình vs tiến trình</h3>
<p>Một <strong>chương trình</strong> là file trên đĩa (thụ động). Một <strong>tiến trình</strong> là chương trình đang chạy (chủ động) — có code, dữ liệu, stack, heap và giá trị thanh ghi CPU của riêng nó.</p>
<h3>PCB</h3>
<p>HĐH theo dõi mỗi tiến trình bằng một <strong>Process Control Block (PCB)</strong>: mã tiến trình (PID), trạng thái, con trỏ lệnh, thanh ghi CPU, giới hạn bộ nhớ, file đang mở. Đó là tiến trình được lưu dưới dạng dữ liệu.</p>
<h3>Các trạng thái tiến trình</h3>
<pre><code>new -&gt; ready -&gt; running -&gt; terminated
             ^        |
             |        v
           ready &lt;- waiting  (chờ I/O)</code></pre>
<ul>
<li><strong>ready</strong> — chờ tới lượt CPU.</li>
<li><strong>running</strong> — đang chạy trên CPU.</li>
<li><strong>waiting/blocked</strong> — chờ một sự kiện (vd đọc đĩa).</li>
</ul>
<h3>Context switch (chuyển ngữ cảnh)</h3>
<p>Để đổi CPU từ tiến trình A sang B, kernel <strong>lưu</strong> A vào PCB của nó và <strong>nạp</strong> B từ PCB của B. Chi phí này thuần là việc ghi chép — không có việc hữu ích nào xảy ra trong lúc đó.</p>
<h3>Tạo tiến trình &amp; IPC</h3>
<p>Trên UNIX, <strong>fork()</strong> tạo một bản sao của tiến trình hiện tại và <strong>exec()</strong> thay nó bằng một chương trình mới. Các tiến trình có bộ nhớ riêng nên nói chuyện qua <strong>IPC (giao tiếp liên tiến trình)</strong>: bộ nhớ chung (nhanh) hoặc truyền thông điệp / pipe (an toàn hơn).</p>
<div class="callout"><span class="badge">Ý chính</span> PCB cộng với thanh ghi CPU chính là thứ mà một context switch lưu lại và khôi phục.</div>`,
  ]]);

const c2q = quiz('osg203-quiz-2', 'Quiz 2 — Processes|||Quiz 2 — Tiến trình', [
  { id: 'q1', question: 'Cấu trúc HĐH dùng để lưu thông tin một tiến trình là?|||Which structure stores a process info?', options: ['PCB (Process Control Block)', 'Bảng trang', 'Semaphore', 'Bộ nhớ đệm'], correctIndex: 0, explanation: 'PCB lưu PID, trạng thái, con trỏ lệnh, thanh ghi, file đang mở của tiến trình.' },
  { id: 'q2', question: 'Một tiến trình đang chờ đọc đĩa xong ở trạng thái nào?|||A process waiting for disk I/O is in which state?', options: ['running', 'ready', 'waiting/blocked', 'terminated'], correctIndex: 2, explanation: 'Chờ một sự kiện I/O thì tiến trình ở trạng thái waiting/blocked, không dùng CPU.' },
  { id: 'q3', question: 'Vì sao các tiến trình cần IPC để trao đổi dữ liệu?|||Why do processes need IPC?', options: ['Vì chúng dùng chung bộ nhớ mặc định', 'Vì mỗi tiến trình có bộ nhớ riêng, tách biệt', 'Vì CPU chỉ có một', 'Vì đĩa quá chậm'], correctIndex: 1, explanation: 'Tiến trình có không gian nhớ riêng nên cần IPC (bộ nhớ chung hoặc thông điệp/pipe) để trao đổi.' },
]);

const c3 = doc('osg203-3-1-threads-scheduling', '3.1 — Threads & CPU scheduling|||3.1 — Luồng & lập lịch CPU',
  'Luồng (thread) vs tiến trình, chia sẻ tài nguyên; lập lịch CPU: FCFS, SJF, Round Robin, priority; tiêu chí (turnaround, waiting, throughput).',
  [[
    `<span class="eyebrow">OSG203 · Chapter 3 · Lesson 3.1</span>
<h2>Threads &amp; CPU scheduling</h2>
<h3>Threads</h3>
<p>A <strong>thread</strong> is a lightweight unit of execution inside a process. Threads of one process <em>share</em> its code, data and open files, but each has its own stack and registers. Multithreading gives concurrency (e.g. UI thread + worker thread) with far less overhead than separate processes.</p>
<h3>The scheduler</h3>
<p>When several processes are <strong>ready</strong>, the <strong>CPU scheduler</strong> decides who runs next. Algorithms differ in fairness and speed:</p>
<ul>
<li><strong>FCFS</strong> (First-Come-First-Served) — a simple queue; long jobs delay everyone (convoy effect).</li>
<li><strong>SJF</strong> (Shortest-Job-First) — shortest burst first; optimal average waiting time, but needs to predict burst length.</li>
<li><strong>Round Robin (RR)</strong> — each job gets a fixed time slice (quantum), then goes to the back; fair, good for time-sharing.</li>
<li><strong>Priority</strong> — highest priority first; risk of <strong>starvation</strong>, fixed by aging.</li>
</ul>
<h3>Criteria</h3>
<pre><code>Turnaround time = finish - arrival
Waiting time    = turnaround - CPU burst
Throughput      = jobs finished per unit time
Goal: high CPU use &amp; throughput, low waiting/turnaround</code></pre>
<div class="callout"><span class="badge">Preemptive vs not</span> RR and preemptive priority can interrupt a running job; FCFS and plain SJF let it finish its burst.</div>`,
    `<span class="eyebrow">OSG203 · Chương 3 · Bài 3.1</span>
<h2>Luồng &amp; lập lịch CPU</h2>
<h3>Luồng (thread)</h3>
<p>Một <strong>luồng</strong> là đơn vị thực thi nhẹ bên trong một tiến trình. Các luồng của cùng một tiến trình <em>dùng chung</em> code, dữ liệu và file đang mở, nhưng mỗi luồng có stack và thanh ghi riêng. Đa luồng cho phép chạy song song (vd luồng giao diện + luồng xử lý) với chi phí thấp hơn nhiều so với tiến trình riêng.</p>
<h3>Bộ lập lịch</h3>
<p>Khi có nhiều tiến trình ở trạng thái <strong>ready</strong>, <strong>bộ lập lịch CPU</strong> quyết định ai chạy tiếp. Các thuật toán khác nhau về tính công bằng và tốc độ:</p>
<ul>
<li><strong>FCFS</strong> (đến trước phục vụ trước) — hàng đợi đơn giản; việc dài làm mọi việc khác trễ (hiệu ứng đoàn xe).</li>
<li><strong>SJF</strong> (việc ngắn nhất trước) — chạy burst ngắn nhất trước; thời gian chờ trung bình tối ưu, nhưng cần dự đoán độ dài burst.</li>
<li><strong>Round Robin (RR)</strong> — mỗi việc được một lát thời gian cố định (quantum) rồi ra sau hàng; công bằng, hợp chia sẻ thời gian.</li>
<li><strong>Priority</strong> — ưu tiên cao chạy trước; nguy cơ <strong>đói (starvation)</strong>, khắc phục bằng lão hoá (aging).</li>
</ul>
<h3>Tiêu chí</h3>
<pre><code>Turnaround (hoàn thành) = finish - arrival
Waiting (chờ)           = turnaround - CPU burst
Throughput (thông lượng) = số việc xong / đơn vị thời gian
Mục tiêu: CPU &amp; throughput cao, waiting/turnaround thấp</code></pre>
<div class="callout"><span class="badge">Có/không trưng dụng</span> RR và priority trưng dụng có thể ngắt việc đang chạy; FCFS và SJF thường để việc chạy hết burst.</div>`,
  ]]);

const c3q = quiz('osg203-quiz-3', 'Quiz 3 — Threads & scheduling|||Quiz 3 — Luồng & lập lịch', [
  { id: 'q1', question: 'Các luồng trong cùng một tiến trình dùng chung thứ gì?|||What do threads of one process share?', options: ['Stack riêng', 'Code, dữ liệu và file đang mở', 'Thanh ghi', 'Không dùng chung gì'], correctIndex: 1, explanation: 'Luồng chung code/dữ liệu/file của tiến trình; riêng stack và thanh ghi.' },
  { id: 'q2', question: 'Thuật toán lập lịch cho thời gian chờ trung bình tối ưu là?|||Which scheduler gives optimal average waiting time?', options: ['FCFS', 'SJF (việc ngắn nhất trước)', 'Round Robin', 'Ngẫu nhiên'], correctIndex: 1, explanation: 'SJF tối ưu thời gian chờ trung bình, nhưng phải dự đoán được độ dài burst.' },
  { id: 'q3', question: 'Round Robin dùng cơ chế gì để công bằng?|||What makes Round Robin fair?', options: ['Ưu tiên cố định', 'Lát thời gian (quantum) luân phiên', 'Chạy tới hết mới đổi', 'Chọn việc dài trước'], correctIndex: 1, explanation: 'RR cho mỗi việc một quantum rồi luân phiên, phù hợp hệ chia sẻ thời gian.' },
]);

const c4 = doc('osg203-4-1-synchronization', '4.1 — Synchronization|||4.1 — Đồng bộ hoá',
  'Race condition, vùng găng (critical section), yêu cầu giải pháp; mutex/khoá, semaphore (đếm/nhị phân), monitor; bài toán producer-consumer.',
  [[
    `<span class="eyebrow">OSG203 · Chapter 4 · Lesson 4.1</span>
<h2>Synchronization</h2>
<h3>The race condition</h3>
<p>When two threads change shared data at the same time, the result depends on timing — a <strong>race condition</strong>. Even one line like <code>count = count + 1</code> is really read-modify-write, so two threads can both read the old value and one update is lost.</p>
<h3>Critical section</h3>
<p>The code that touches shared data is the <strong>critical section</strong>. A correct solution needs three things: <strong>mutual exclusion</strong> (only one inside at a time), <strong>progress</strong> (no needless blocking), and <strong>bounded waiting</strong> (no starvation).</p>
<h3>Tools</h3>
<ul>
<li><strong>Mutex / lock</strong> — acquire before, release after; only the holder may enter.</li>
<li><strong>Semaphore</strong> — an integer with atomic <code>wait()</code> (P, decrement/block) and <code>signal()</code> (V, increment). A <strong>binary</strong> semaphore acts like a lock; a <strong>counting</strong> semaphore guards N identical resources.</li>
<li><strong>Monitor</strong> — a higher-level construct where mutual exclusion is automatic and threads coordinate via condition variables.</li>
</ul>
<pre><code>wait(mutex);      // enter
  count = count + 1;   // critical section
signal(mutex);    // leave</code></pre>
<div class="callout"><span class="badge">Classic problem</span> Producer-consumer uses a counting semaphore for empty/full slots plus a mutex for the shared buffer.</div>`,
    `<span class="eyebrow">OSG203 · Chương 4 · Bài 4.1</span>
<h2>Đồng bộ hoá</h2>
<h3>Race condition (tranh chấp)</h3>
<p>Khi hai luồng cùng lúc thay đổi dữ liệu chung, kết quả phụ thuộc thời điểm — đó là <strong>race condition</strong>. Ngay một dòng như <code>count = count + 1</code> thực ra là đọc-sửa-ghi, nên hai luồng có thể cùng đọc giá trị cũ và mất một lần cập nhật.</p>
<h3>Vùng găng (critical section)</h3>
<p>Đoạn code chạm dữ liệu chung là <strong>vùng găng</strong>. Một giải pháp đúng cần ba điều: <strong>loại trừ tương hỗ</strong> (mỗi lúc chỉ một luồng bên trong), <strong>tiến triển</strong> (không chặn vô cớ), và <strong>chờ có giới hạn</strong> (không đói).</p>
<h3>Công cụ</h3>
<ul>
<li><strong>Mutex / khoá</strong> — lấy khoá trước, trả khoá sau; chỉ người giữ khoá được vào.</li>
<li><strong>Semaphore</strong> — một số nguyên với thao tác nguyên tử <code>wait()</code> (P, giảm/chặn) và <code>signal()</code> (V, tăng). Semaphore <strong>nhị phân</strong> hoạt động như khoá; semaphore <strong>đếm</strong> canh N tài nguyên giống nhau.</li>
<li><strong>Monitor</strong> — cấu trúc bậc cao, loại trừ tương hỗ tự động và các luồng phối hợp qua biến điều kiện.</li>
</ul>
<pre><code>wait(mutex);      // vào
  count = count + 1;   // vùng găng
signal(mutex);    // ra</code></pre>
<div class="callout"><span class="badge">Bài toán kinh điển</span> Producer-consumer dùng semaphore đếm cho ô trống/đầy cộng một mutex cho vùng đệm chung.</div>`,
  ]]);

const c4q = quiz('osg203-quiz-4', 'Quiz 4 — Synchronization|||Quiz 4 — Đồng bộ hoá', [
  { id: 'q1', question: 'Race condition là gì?|||What is a race condition?', options: ['CPU chạy quá nhanh', 'Kết quả sai vì nhiều luồng cùng sửa dữ liệu chung theo thời điểm', 'Một loại deadlock', 'Lỗi phần cứng'], correctIndex: 1, explanation: 'Race condition: kết quả phụ thuộc thứ tự/thời điểm truy cập dữ liệu chung của nhiều luồng.' },
  { id: 'q2', question: 'Yêu cầu "mỗi lúc chỉ một luồng trong vùng găng" gọi là?|||Only one thread in the critical section at a time is called?', options: ['Bounded waiting', 'Loại trừ tương hỗ (mutual exclusion)', 'Progress', 'Throughput'], correctIndex: 1, explanation: 'Đó là loại trừ tương hỗ (mutual exclusion), điều kiện cốt lõi của vùng găng.' },
  { id: 'q3', question: 'Semaphore đếm (counting) dùng để?|||A counting semaphore is used to?', options: ['Chỉ khoá một tài nguyên', 'Quản lý N tài nguyên giống nhau', 'Tăng tốc CPU', 'Xoá tiến trình'], correctIndex: 1, explanation: 'Semaphore đếm canh N tài nguyên; semaphore nhị phân mới giống một khoá đơn.' },
]);

const c5 = doc('osg203-5-1-deadlock', '5.1 — Deadlock|||5.1 — Deadlock (bế tắc)',
  'Bốn điều kiện Coffman (mutual exclusion, hold-and-wait, no preemption, circular wait); phòng ngừa, tránh (banker), phát hiện & phục hồi.',
  [[
    `<span class="eyebrow">OSG203 · Chapter 5 · Lesson 5.1</span>
<h2>Deadlock</h2>
<h3>What it is</h3>
<p>A <strong>deadlock</strong> is when a set of processes are all stuck, each holding a resource the next one needs — a circular wait that never resolves. Classic image: two cars on a one-lane bridge from opposite ends.</p>
<h3>Four necessary conditions (Coffman)</h3>
<p>All four must hold at once for deadlock to be possible:</p>
<ol>
<li><strong>Mutual exclusion</strong> — a resource is held by one process at a time.</li>
<li><strong>Hold and wait</strong> — a process holds one resource while waiting for another.</li>
<li><strong>No preemption</strong> — a resource cannot be forcibly taken away.</li>
<li><strong>Circular wait</strong> — a cycle of processes each waiting on the next.</li>
</ol>
<h3>Handling deadlock</h3>
<ul>
<li><strong>Prevention</strong> — break one of the four conditions (e.g. request all resources up front, or impose a global ordering to kill circular wait).</li>
<li><strong>Avoidance</strong> — the <strong>Banker's algorithm</strong> grants a request only if the system stays in a <em>safe state</em> (there is some order to finish everyone).</li>
<li><strong>Detection &amp; recovery</strong> — allow deadlock, detect a cycle, then recover by killing or rolling back a process.</li>
</ul>
<pre><code>Banker: grant request only if a safe sequence
still exists (each process can finish with the
resources left). Otherwise make it wait.</code></pre>
<div class="callout"><span class="badge">Key idea</span> Break any one of the four conditions and deadlock becomes impossible.</div>`,
    `<span class="eyebrow">OSG203 · Chương 5 · Bài 5.1</span>
<h2>Deadlock (bế tắc)</h2>
<h3>Deadlock là gì</h3>
<p>Một <strong>deadlock</strong> là khi một nhóm tiến trình đều kẹt, mỗi cái giữ một tài nguyên mà cái kế cần — một vòng chờ không bao giờ gỡ được. Hình ảnh kinh điển: hai xe trên cầu một làn đi ngược chiều.</p>
<h3>Bốn điều kiện cần (Coffman)</h3>
<p>Cả bốn phải cùng xảy ra thì deadlock mới có thể có:</p>
<ol>
<li><strong>Loại trừ tương hỗ</strong> — một tài nguyên chỉ một tiến trình giữ tại một thời điểm.</li>
<li><strong>Giữ và chờ</strong> — tiến trình giữ một tài nguyên trong khi chờ tài nguyên khác.</li>
<li><strong>Không trưng dụng</strong> — không thể cưỡng ép lấy lại tài nguyên.</li>
<li><strong>Chờ vòng tròn</strong> — một vòng các tiến trình, mỗi cái chờ cái kế.</li>
</ol>
<h3>Xử lý deadlock</h3>
<ul>
<li><strong>Phòng ngừa</strong> — phá một trong bốn điều kiện (vd xin hết tài nguyên ngay từ đầu, hoặc áp một thứ tự toàn cục để triệt chờ vòng tròn).</li>
<li><strong>Tránh</strong> — <strong>thuật toán Banker</strong> chỉ cấp yêu cầu nếu hệ vẫn ở <em>trạng thái an toàn</em> (còn một thứ tự để mọi tiến trình hoàn thành).</li>
<li><strong>Phát hiện &amp; phục hồi</strong> — cho phép deadlock, phát hiện chu trình, rồi phục hồi bằng cách kết thúc hoặc quay lui một tiến trình.</li>
</ul>
<pre><code>Banker: chỉ cấp yêu cầu nếu vẫn còn một chuỗi
an toàn (mỗi tiến trình có thể hoàn thành với
tài nguyên còn lại). Không thì bắt chờ.</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Phá bất kỳ một trong bốn điều kiện thì deadlock trở nên bất khả.</div>`,
  ]]);

const c5q = quiz('osg203-quiz-5', 'Quiz 5 — Deadlock|||Quiz 5 — Deadlock', [
  { id: 'q1', question: 'Cần bao nhiêu điều kiện Coffman cùng lúc để có deadlock?|||How many Coffman conditions must hold for deadlock?', options: ['1', '2', 'Cả 4', '10'], correctIndex: 2, explanation: 'Cả bốn điều kiện phải đồng thời đúng; phá một điều kiện là đủ để loại bỏ deadlock.' },
  { id: 'q2', question: 'Thuật toán Banker thuộc chiến lược nào?|||The Banker algorithm belongs to which strategy?', options: ['Phòng ngừa', 'Tránh deadlock (avoidance)', 'Phát hiện', 'Bỏ qua'], correctIndex: 1, explanation: 'Banker là tránh deadlock: chỉ cấp yêu cầu nếu hệ vẫn ở trạng thái an toàn.' },
  { id: 'q3', question: 'Điều kiện "một vòng các tiến trình mỗi cái chờ cái kế" là?|||A cycle where each process waits on the next is?', options: ['Hold and wait', 'Circular wait (chờ vòng tròn)', 'Mutual exclusion', 'No preemption'], correctIndex: 1, explanation: 'Đó là circular wait; áp thứ tự tài nguyên toàn cục sẽ phá được nó.' },
]);

const c6 = doc('osg203-6-1-memory', '6.1 — Memory management|||6.1 — Quản lý bộ nhớ',
  'Cấp phát bộ nhớ, phân mảnh; phân trang (paging: page/frame, page table), phân đoạn (segmentation), dịch địa chỉ logic sang vật lý, TLB.',
  [[
    `<span class="eyebrow">OSG203 · Chapter 6 · Lesson 6.1</span>
<h2>Memory management</h2>
<h3>The problem</h3>
<p>Many processes must share one physical memory, each thinking it owns a clean address space. The OS must place them, protect them from each other, and fight <strong>fragmentation</strong> (free memory split into unusable small pieces).</p>
<h3>Paging</h3>
<p>The most common scheme. Split logical memory into fixed-size <strong>pages</strong> and physical memory into equal <strong>frames</strong>. A <strong>page table</strong> maps each page to a frame, so a process can be scattered across memory yet see it as contiguous. Paging removes external fragmentation.</p>
<pre><code>Logical address = (page number, offset)
page table[page number] -&gt; frame number
Physical address = (frame number, offset)</code></pre>
<h3>Segmentation</h3>
<p><strong>Segmentation</strong> divides memory by logical unit (code, stack, heap) of variable size, matching how a programmer thinks. Address = (segment, offset). It can suffer external fragmentation; many systems combine segmentation with paging.</p>
<h3>Speeding it up: the TLB</h3>
<p>Every access would need an extra memory read for the page table. A <strong>TLB (Translation Lookaside Buffer)</strong> caches recent page-to-frame translations so most lookups are instant.</p>
<div class="callout"><span class="badge">Paging vs segmentation</span> Paging = fixed size, no external fragmentation, hardware-oriented. Segmentation = variable size, matches program structure.</div>`,
    `<span class="eyebrow">OSG203 · Chương 6 · Bài 6.1</span>
<h2>Quản lý bộ nhớ</h2>
<h3>Vấn đề</h3>
<p>Nhiều tiến trình phải dùng chung một bộ nhớ vật lý, mỗi cái tưởng mình sở hữu một không gian địa chỉ sạch. HĐH phải sắp chỗ, bảo vệ chúng khỏi nhau, và chống <strong>phân mảnh</strong> (bộ nhớ trống bị chia thành các mẩu nhỏ không dùng được).</p>
<h3>Phân trang (paging)</h3>
<p>Sơ đồ phổ biến nhất. Chia bộ nhớ logic thành các <strong>trang (page)</strong> cỡ cố định và bộ nhớ vật lý thành các <strong>khung (frame)</strong> bằng nhau. Một <strong>bảng trang</strong> ánh xạ mỗi trang tới một khung, nên tiến trình có thể nằm rải khắp bộ nhớ mà vẫn thấy liền mạch. Paging loại bỏ phân mảnh ngoài.</p>
<pre><code>Địa chỉ logic = (số trang, offset)
bảng trang[số trang] -&gt; số khung
Địa chỉ vật lý = (số khung, offset)</code></pre>
<h3>Phân đoạn (segmentation)</h3>
<p><strong>Phân đoạn</strong> chia bộ nhớ theo đơn vị logic (code, stack, heap) cỡ thay đổi, khớp cách lập trình viên nghĩ. Địa chỉ = (đoạn, offset). Nó có thể bị phân mảnh ngoài; nhiều hệ kết hợp phân đoạn với phân trang.</p>
<h3>Tăng tốc: TLB</h3>
<p>Mỗi lần truy cập lẽ ra cần thêm một lần đọc bộ nhớ cho bảng trang. Một <strong>TLB (Translation Lookaside Buffer)</strong> lưu đệm các ánh xạ trang-tới-khung gần đây nên phần lớn tra cứu là tức thì.</p>
<div class="callout"><span class="badge">Paging vs segmentation</span> Paging = cỡ cố định, không phân mảnh ngoài, thiên phần cứng. Segmentation = cỡ thay đổi, khớp cấu trúc chương trình.</div>`,
  ]]);

const c6q = quiz('osg203-quiz-6', 'Quiz 6 — Memory management|||Quiz 6 — Quản lý bộ nhớ', [
  { id: 'q1', question: 'Phân trang (paging) loại bỏ được loại phân mảnh nào?|||Paging eliminates which fragmentation?', options: ['Phân mảnh trong', 'Phân mảnh ngoài (external)', 'Cả hai', 'Không loại nào'], correctIndex: 1, explanation: 'Trang/khung cỡ cố định nên loại bỏ phân mảnh ngoài (vẫn còn phân mảnh trong nhỏ).' },
  { id: 'q2', question: 'Cấu trúc ánh xạ số trang sang số khung là?|||What maps a page number to a frame number?', options: ['TLB', 'Bảng trang (page table)', 'PCB', 'Semaphore'], correctIndex: 1, explanation: 'Bảng trang giữ ánh xạ trang -> khung; TLB chỉ là bộ đệm tăng tốc cho nó.' },
  { id: 'q3', question: 'TLB dùng để làm gì?|||What is the TLB for?', options: ['Lưu file', 'Đệm các ánh xạ trang-khung gần đây để dịch địa chỉ nhanh', 'Lập lịch CPU', 'Chống deadlock'], correctIndex: 1, explanation: 'TLB đệm bản dịch gần đây nên phần lớn truy cập không phải đọc lại bảng trang.' },
]);

const c7 = doc('osg203-7-1-virtual-memory', '7.1 — Virtual memory|||7.1 — Bộ nhớ ảo',
  'Bộ nhớ ảo, demand paging, page fault; thuật toán thay trang FIFO/LRU/optimal, dị thường Belady; thrashing & working set.',
  [[
    `<span class="eyebrow">OSG203 · Chapter 7 · Lesson 7.1</span>
<h2>Virtual memory</h2>
<h3>The big idea</h3>
<p><strong>Virtual memory</strong> lets a process use more memory than physically exists by keeping only the active pages in RAM and the rest on disk. Every program gets a large, private virtual address space; the OS and hardware translate it and swap pages as needed.</p>
<h3>Demand paging &amp; page faults</h3>
<p>With <strong>demand paging</strong>, a page is loaded only when first touched. If the page is not in memory, the CPU raises a <strong>page fault</strong>: the OS finds the page on disk, loads it into a free frame, updates the page table, and resumes the instruction.</p>
<h3>Page replacement</h3>
<p>When memory is full, which page do we evict? The goal is to minimise future page faults:</p>
<ul>
<li><strong>FIFO</strong> — evict the oldest loaded page; simple, can suffer <strong>Belady's anomaly</strong> (more frames, more faults).</li>
<li><strong>Optimal (OPT)</strong> — evict the page used furthest in the future; best possible, but needs the future — a benchmark only.</li>
<li><strong>LRU</strong> (Least Recently Used) — evict the page unused for longest; a practical approximation of optimal.</li>
</ul>
<h3>Thrashing</h3>
<p>If too many processes compete for too few frames, the system spends all its time paging in/out and almost none computing — <strong>thrashing</strong>. The <strong>working set</strong> model keeps each process its recently-used pages to avoid it.</p>
<pre><code>Reference 1 2 3 4 1 2 5, 3 frames, FIFO:
faults on 1 2 3 4 1 2 5 = 7 faults total</code></pre>
<div class="callout"><span class="badge">Key idea</span> LRU approximates OPT well and, unlike FIFO, does not suffer Belady's anomaly.</div>`,
    `<span class="eyebrow">OSG203 · Chương 7 · Bài 7.1</span>
<h2>Bộ nhớ ảo</h2>
<h3>Ý tưởng lớn</h3>
<p><strong>Bộ nhớ ảo</strong> cho một tiến trình dùng nhiều bộ nhớ hơn thực có, bằng cách chỉ giữ các trang đang hoạt động trong RAM, phần còn lại trên đĩa. Mỗi chương trình có một không gian địa chỉ ảo lớn, riêng; HĐH và phần cứng dịch địa chỉ và tráo trang khi cần.</p>
<h3>Demand paging &amp; page fault</h3>
<p>Với <strong>demand paging</strong>, một trang chỉ được nạp khi chạm tới lần đầu. Nếu trang chưa có trong bộ nhớ, CPU phát <strong>page fault</strong>: HĐH tìm trang trên đĩa, nạp vào một khung trống, cập nhật bảng trang, rồi chạy lại lệnh.</p>
<h3>Thay trang (page replacement)</h3>
<p>Khi bộ nhớ đầy, đuổi trang nào? Mục tiêu là giảm page fault trong tương lai:</p>
<ul>
<li><strong>FIFO</strong> — đuổi trang nạp lâu nhất; đơn giản, có thể dính <strong>dị thường Belady</strong> (thêm khung mà nhiều fault hơn).</li>
<li><strong>Optimal (OPT)</strong> — đuổi trang sẽ dùng xa nhất trong tương lai; tốt nhất có thể, nhưng cần biết tương lai — chỉ dùng làm chuẩn.</li>
<li><strong>LRU</strong> (ít dùng gần đây nhất) — đuổi trang lâu nhất không dùng; xấp xỉ thực tế của optimal.</li>
</ul>
<h3>Thrashing</h3>
<p>Nếu quá nhiều tiến trình tranh quá ít khung, hệ dành hết thời gian tráo trang vào/ra và gần như không tính toán — <strong>thrashing</strong>. Mô hình <strong>working set</strong> giữ cho mỗi tiến trình các trang mới dùng gần đây để tránh nó.</p>
<pre><code>Chuỗi tham chiếu 1 2 3 4 1 2 5, 3 khung, FIFO:
fault ở 1 2 3 4 1 2 5 = tổng 7 fault</code></pre>
<div class="callout"><span class="badge">Ý chính</span> LRU xấp xỉ OPT tốt và, khác FIFO, không dính dị thường Belady.</div>`,
  ]]);

const c7q = quiz('osg203-quiz-7', 'Quiz 7 — Virtual memory|||Quiz 7 — Bộ nhớ ảo', [
  { id: 'q1', question: 'Page fault xảy ra khi nào?|||When does a page fault occur?', options: ['Khi CPU quá tải', 'Khi truy cập một trang chưa có trong bộ nhớ', 'Khi đĩa đầy', 'Khi có deadlock'], correctIndex: 1, explanation: 'Page fault: trang cần dùng chưa ở RAM; HĐH nạp nó từ đĩa rồi chạy lại lệnh.' },
  { id: 'q2', question: 'Thuật toán thay trang nào là chuẩn tốt nhất (cần biết tương lai)?|||Which replacement algorithm is the best-possible benchmark?', options: ['FIFO', 'LRU', 'Optimal (OPT)', 'Ngẫu nhiên'], correctIndex: 2, explanation: 'OPT đuổi trang dùng xa nhất trong tương lai — tối ưu nhưng không cài đặt thật được.' },
  { id: 'q3', question: 'Thrashing là hiện tượng gì?|||What is thrashing?', options: ['CPU chạy quá nhanh', 'Hệ dành hầu hết thời gian tráo trang thay vì tính toán', 'Đĩa hỏng', 'Nhiều luồng cùng ghi'], correctIndex: 1, explanation: 'Quá ít khung cho quá nhiều tiến trình -> page fault liên tục, hệ bận tráo trang, gần như không tính toán.' },
]);

const c8 = doc('osg203-8-1-filesystem-io', '8.1 — File systems & I/O|||8.1 — Hệ thống file & I/O',
  'File & thuộc tính, thư mục, cấp phát khối (contiguous/linked/indexed), free space; I/O & lập lịch đĩa (FCFS, SSTF, SCAN/elevator).',
  [[
    `<span class="eyebrow">OSG203 · Chapter 8 · Lesson 8.1</span>
<h2>File systems &amp; I/O</h2>
<h3>Files &amp; directories</h3>
<p>A <strong>file</strong> is a named, persistent collection of data with attributes (name, size, owner, permissions, timestamps). A <strong>directory</strong> organises files into a tree, mapping names to their on-disk metadata (an inode in UNIX).</p>
<h3>Block allocation</h3>
<p>How does the OS decide which disk blocks hold a file?</p>
<ul>
<li><strong>Contiguous</strong> — one continuous run of blocks; fast reads, but external fragmentation and hard to grow.</li>
<li><strong>Linked</strong> — each block points to the next; grows easily, but slow random access.</li>
<li><strong>Indexed</strong> — an index block lists all data blocks (the UNIX inode idea); good random access, small overhead.</li>
</ul>
<h3>Disk scheduling</h3>
<p>The disk arm is slow to move, so the order of requests matters. Scheduling minimises head movement (seek time):</p>
<ul>
<li><strong>FCFS</strong> — serve in arrival order; fair, but lots of arm travel.</li>
<li><strong>SSTF</strong> (Shortest Seek Time First) — nearest request next; fast, can starve far requests.</li>
<li><strong>SCAN / elevator</strong> — sweep in one direction serving requests, then reverse; smooth and fair.</li>
</ul>
<pre><code>Head at 53, requests: 98 183 37 122
FCFS order: 53-&gt;98-&gt;183-&gt;37-&gt;122 (much travel)
SSTF picks the closest each step (less travel)</code></pre>
<div class="callout"><span class="badge">Key idea</span> The inode (indexed allocation) is why UNIX files can grow and still allow fast random access.</div>`,
    `<span class="eyebrow">OSG203 · Chương 8 · Bài 8.1</span>
<h2>Hệ thống file &amp; I/O</h2>
<h3>File &amp; thư mục</h3>
<p>Một <strong>file</strong> là tập dữ liệu có tên, lâu bền, kèm thuộc tính (tên, kích thước, chủ sở hữu, quyền, mốc thời gian). Một <strong>thư mục</strong> tổ chức file thành cây, ánh xạ tên tới siêu dữ liệu trên đĩa (inode trong UNIX).</p>
<h3>Cấp phát khối</h3>
<p>HĐH quyết định khối đĩa nào chứa một file thế nào?</p>
<ul>
<li><strong>Liên tục (contiguous)</strong> — một dải khối liền; đọc nhanh, nhưng phân mảnh ngoài và khó lớn thêm.</li>
<li><strong>Liên kết (linked)</strong> — mỗi khối trỏ tới khối kế; dễ lớn thêm, nhưng truy cập ngẫu nhiên chậm.</li>
<li><strong>Chỉ mục (indexed)</strong> — một khối chỉ mục liệt kê mọi khối dữ liệu (ý tưởng inode UNIX); truy cập ngẫu nhiên tốt, chi phí nhỏ.</li>
</ul>
<h3>Lập lịch đĩa</h3>
<p>Cánh tay đĩa di chuyển chậm nên thứ tự yêu cầu rất quan trọng. Lập lịch giảm quãng di chuyển đầu đọc (seek time):</p>
<ul>
<li><strong>FCFS</strong> — phục vụ theo thứ tự đến; công bằng, nhưng đầu đọc đi lại nhiều.</li>
<li><strong>SSTF</strong> (seek ngắn nhất trước) — chọn yêu cầu gần nhất; nhanh, có thể bỏ đói yêu cầu xa.</li>
<li><strong>SCAN / thang máy</strong> — quét một chiều phục vụ yêu cầu rồi đảo chiều; mượt và công bằng.</li>
</ul>
<pre><code>Đầu đọc ở 53, yêu cầu: 98 183 37 122
Thứ tự FCFS: 53-&gt;98-&gt;183-&gt;37-&gt;122 (đi nhiều)
SSTF chọn cái gần nhất mỗi bước (đi ít hơn)</code></pre>
<div class="callout"><span class="badge">Ý chính</span> Inode (cấp phát chỉ mục) là lý do file UNIX vừa lớn thêm được vừa cho truy cập ngẫu nhiên nhanh.</div>`,
  ]]);

const c8q = quiz('osg203-quiz-8', 'Quiz 8 — File systems & I/O|||Quiz 8 — Hệ thống file & I/O', [
  { id: 'q1', question: 'Trong UNIX, siêu dữ liệu và danh sách khối của một file nằm ở?|||In UNIX, a file metadata and block list live in?', options: ['Bảng trang', 'Inode', 'PCB', 'TLB'], correctIndex: 1, explanation: 'Inode giữ thuộc tính và chỉ mục các khối dữ liệu của file (cấp phát chỉ mục).' },
  { id: 'q2', question: 'Cách cấp phát nào cho truy cập ngẫu nhiên tốt mà vẫn dễ lớn thêm?|||Which allocation gives good random access and easy growth?', options: ['Liên tục (contiguous)', 'Liên kết (linked)', 'Chỉ mục (indexed)', 'Không cách nào'], correctIndex: 2, explanation: 'Cấp phát chỉ mục (inode) cho truy cập ngẫu nhiên nhanh và file lớn thêm dễ dàng.' },
  { id: 'q3', question: 'Thuật toán lập lịch đĩa nào quét một chiều rồi đảo chiều?|||Which disk scheduler sweeps one way then reverses?', options: ['FCFS', 'SSTF', 'SCAN (thang máy)', 'Round Robin'], correctIndex: 2, explanation: 'SCAN (elevator) quét theo một chiều phục vụ yêu cầu rồi đảo chiều, mượt và công bằng.' },
]);

export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'OSG203',
    slug: 'osg203-operating-system',
    title: 'Operating System',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    syncOrder: true,
    pruneSections: true,
    thumbnailUrl: 'https://media.cuongthai.com/images/academy-covers/v3/OSG203.webp',
    shortDescription: 'How operating systems work — kernel & system calls, processes & threads, CPU scheduling, synchronization & deadlock, memory management, virtual memory & paging, file systems & I/O. Bilingual, with examples & quizzes.|||Hệ điều hành hoạt động thế nào — kernel & system call, tiến trình & luồng, lập lịch CPU, đồng bộ & deadlock, quản lý bộ nhớ, bộ nhớ ảo & phân trang, hệ thống file & I/O. Song ngữ, có ví dụ & quiz.',
    description: 'Môn <strong>OSG203 — Operating System</strong> (kỳ 2, ngành Khoa học Máy tính) giúp hiểu <strong>hệ điều hành hoạt động thế nào</strong>. Từ <strong>tổng quan &amp; kernel</strong> (system call, chế độ user/kernel) → <strong>tiến trình &amp; luồng</strong> (PCB, context switch, IPC) → <strong>lập lịch CPU</strong> (FCFS/SJF/RR) → <strong>đồng bộ hoá &amp; deadlock</strong> (mutex/semaphore, banker) → <strong>quản lý bộ nhớ, bộ nhớ ảo</strong> (phân trang, thay trang) → <strong>hệ thống file &amp; I/O</strong>. Bám sách chuẩn (Silberschatz, Tanenbaum, OSTEP), song ngữ, có ví dụ và quiz mỗi chương.',
    whatYouLearn: 'Vai trò HĐH, kernel, system call, chế độ user/kernel; tiến trình (PCB, trạng thái, context switch, IPC); luồng &amp; lập lịch CPU (FCFS, SJF, RR, priority, tiêu chí); đồng bộ hoá (race condition, critical section, mutex/semaphore, monitor); deadlock (4 điều kiện, phòng tránh, banker); quản lý bộ nhớ (paging, segmentation, dịch địa chỉ); bộ nhớ ảo (demand paging, thay trang FIFO/LRU/optimal, thrashing); hệ thống file &amp; I/O (thư mục, cấp phát, lập lịch đĩa).',
    requirements: 'Kiến thức lập trình cơ bản (C/Java) và cấu trúc máy tính là lợi thế. Không yêu cầu phần cứng chuyên sâu; xem điều kiện tiên quyết trên FLM.',
  },
  sections: [
    { title: '📚 Tài liệu tham khảo|||📚 Course materials', description: 'Giáo trình & slide trên FLM, sách chuẩn, tài liệu miễn phí, YouTube, công cụ, lộ trình.', lessons: [taiLieu] },
    { title: 'Giới thiệu môn học|||Course introduction', description: 'HĐH là gì, vai trò, lộ trình học.', lessons: [intro] },
    { title: 'Chương 1 — Tổng quan HĐH & kernel|||Chapter 1 — OS overview & kernel', description: 'Kernel, system call, user/kernel mode, cấu trúc HĐH.', lessons: [c1, c1q] },
    { title: 'Chương 2 — Tiến trình|||Chapter 2 — Processes', description: 'PCB, trạng thái, context switch, IPC.', lessons: [c2, c2q] },
    { title: 'Chương 3 — Luồng & lập lịch CPU|||Chapter 3 — Threads & scheduling', description: 'Thread, FCFS/SJF/RR/priority, tiêu chí.', lessons: [c3, c3q] },
    { title: 'Chương 4 — Đồng bộ hoá|||Chapter 4 — Synchronization', description: 'Race condition, vùng găng, mutex/semaphore, monitor.', lessons: [c4, c4q] },
    { title: 'Chương 5 — Deadlock|||Chapter 5 — Deadlock', description: '4 điều kiện, phòng ngừa, tránh (banker), phát hiện.', lessons: [c5, c5q] },
    { title: 'Chương 6 — Quản lý bộ nhớ|||Chapter 6 — Memory management', description: 'Paging, segmentation, dịch địa chỉ, TLB.', lessons: [c6, c6q] },
    { title: 'Chương 7 — Bộ nhớ ảo|||Chapter 7 — Virtual memory', description: 'Demand paging, thay trang FIFO/LRU/optimal, thrashing.', lessons: [c7, c7q] },
    { title: 'Chương 8 — Hệ thống file & I/O|||Chapter 8 — File systems & I/O', description: 'File, thư mục, cấp phát khối, lập lịch đĩa.', lessons: [c8, c8q] },
  ],
};
