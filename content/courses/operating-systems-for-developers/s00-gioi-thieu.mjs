/**
 * Operating Systems for Developers — Mục 0: Hệ điều hành để làm gì.
 * Bài mẫu (cùng Chương 1) cho các agent soạn chương sau — xem _HOP-DONG.md và _PROMPT-AGENT.md.
 * Output CHẠY THẬT trong ảnh `os-lab` (lab/moi-truong/Dockerfile = Ubuntu 26.04, gcc 15, Node 22, Java 21, Python 3.14,
 * nhân 7.0.12-linuxkit trên Docker Desktop/máy soạn bài Apple Silicon ⇒ arm64). Lệnh in ra bằng `phien` (in "$ lệnh" rồi
 * output), đọc thẳng từ lab/out/*.out.txt qua _ui.mjs `run()`/`grab()`. Mô phỏng nhúng qua _lab.mjs `lab()`.
 * LUẬT escaping: < > trong <pre><code> → &lt; &gt;; & → &amp;; backtick trần → &#96;; ${ của bash → \${.
 */
import { code, cmd, out, run, src, card, kv, details, ul, esc } from './_ui.mjs';
import { lab } from './_lab.mjs';

const REF = '?ref=%2Fcourses%2Foperating-systems-for-developers%2Flearn&reflabel=Operating%20Systems%20for%20Developers';
const L = (href, ico, t, s, cta) => card(href, ico, t, s, cta);

export default {
  title: 'Section 0 — What an operating system is for|||Mục 0 — Hệ điều hành để làm gì',
  description: 'Hệ điều hành bằng lời đời thường và bằng số đo: vì sao nó tồn tại, nó làm gì cho code của bạn, dựng phòng lab Linux thật để quan sát, và vừa đủ C để đọc mọi ví dụ của khoá.',
  lessons: [
    /* ───────────────────────── 0.8 — Bắt đầu tại đây (1/2) ───────────────────────── */
    {
      title: 'Start here (1/2) — What the OS does for your code, why it exists, and bugs that cost lives|||Bắt đầu tại đây (1/2) — Hệ điều hành làm gì cho code của bạn, vì sao nó tồn tại, và những lỗi trả giá bằng mạng người',
      slug: 'os-0-8-bat-dau-tai-day',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Lời chào và bức tranh lớn: hệ điều hành là người quản lý toà nhà chia tài nguyên cho các chương trình; lịch sử Unix → Linux; và vì sao một lập trình viên backend/bảo mật bắt buộc phải hiểu nó.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (1/2)</span>
<h2>You already use an operating system all day — now let's open it up</h2>
<p class="lead">Every day you watch which process eats the CPU, whether memory is running low or the disk is full, and how containers box programs in. You wrote that you read what happens there and <em>understand almost none of it</em>. This course fixes exactly that. By the end you will not just read those numbers — you will know where they come from, reproduce every problem on purpose, and measure the fix.</p>
<p>And because you want to go into backend and security: a server handling thousands of requests at once lives or dies by how it uses processes and threads; a huge share of real vulnerabilities live at the OS layer, where you cannot analyse a binary without knowing how a program sits in memory. Those are not advanced topics bolted on at the end — they are the spine of this course.</p>

<h3>What an operating system actually is</h3>
<p>A computer has one set of real resources: a few CPU cores, some RAM, a disk, a network card. You want to run dozens of programs — a browser, your editor, a database, three Docker containers — all at once, and none of them should be able to read another's memory or crash the whole machine. Something has to share the hardware fairly and safely. That something is the <strong>operating system</strong>, and its core is the <strong>kernel</strong>.</p>
<p>Think of the kernel as the <strong>manager of an apartment building</strong>. Tenants (your programs) each think they have the whole place: their own rooms (memory), their turn with the lift (the CPU), their own mailbox (files). The manager hands out time and space, keeps one tenant out of another's rooms, and is the only one allowed to touch the building's wiring (the hardware). When a program wants something real — read a file, send a packet, start another program — it does not do it directly; it asks the manager through a <strong>system call</strong>. That request, crossing from your code into the kernel and back, is the single most important event in this whole course, and you will watch it happen with <code>strace</code> in Section 0's lab.</p>

<h3>Where it came from (and why that matters)</h3>
<p>None of this was obvious. The ideas were worked out over fifty years, and knowing the story makes the design make sense:</p>
<ul>
<li><strong>1964–1969 · Multics.</strong> MIT, Bell Labs and GE tried to build an ambitious time-sharing system called Multics. It was too big; Bell Labs pulled out in 1969.</li>
<li><strong>1969 · Unix.</strong> Ken Thompson and Dennis Ritchie at Bell Labs built a small, simple system on a spare PDP-7 — a reaction to Multics. Development started in 1969; it was announced outside Bell Labs in 1973.</li>
<li><strong>1971–1973 · C and the Unix philosophy.</strong> Ritchie created the C language and Unix was rewritten in it (announced 1973) — so the OS could move to new hardware instead of being tied to one machine. Doug McIlroy's <strong>pipe</strong> arrived in 1973, and with it the Unix philosophy: each program does one thing well; connect them with pipes; text is the universal interface. You will feel that philosophy in every lab.</li>
<li><strong>1983–1989 · GNU and Bash.</strong> Richard Stallman started the GNU project in 1983 to build a free Unix-compatible system; Brian Fox wrote the Bash shell in 1989.</li>
<li><strong>25 August 1991 · Linux.</strong> A Finnish student, Linus Torvalds, announced a free kernel on the comp.os.minix newsgroup. Linux 0.01 shipped with a build of GNU's Bash. GNU tools + the Linux kernel became the system that now runs most of the internet, every Android phone, and the machine your containers live on.</li>
<li><strong>1993 · Windows NT</strong> (Dave Cutler's team) and <strong>2001 · macOS</strong> (the XNU kernel: Mach + BSD) took different roads — Chapter 14 compares all three through a developer's eyes.</li>
</ul>
${lab('latency', 'default', 'en', 'A feel for the scale we are working at — if one CPU cycle took a second, a disk read would take days and a cross-country network trip four years.')}

<h3>Bugs at this layer are not academic</h3>
<p>Two famous cases — both caused by exactly the mechanisms this course teaches:</p>
<div class="callout danger">
<p><strong>Therac-25 (1985–1987).</strong> A radiotherapy machine had a <em>race condition</em> (Chapter 5): if an operator typed the treatment settings quickly, two concurrent tasks interleaved in an order the programmers never expected, and the machine delivered massive radiation overdoses. At least six patients were seriously injured; several died. Concurrency bugs are invisible until the timing lines up — which is the whole reason this course makes you <em>see</em> the interleaving.</p>
<p><strong>Mars Pathfinder (1997).</strong> Days after landing, the spacecraft kept resetting itself. The cause was <em>priority inversion</em> (Chapter 6): a low-priority task held a lock that a high-priority task needed, while a medium-priority task hogged the CPU, so the high-priority task missed its deadline and a watchdog rebooted the system. Engineers diagnosed it on an identical lab unit and fixed it by flipping one flag — from Earth.</p>
</div>
<p>You are not building radiotherapy machines. But "the result depends on timing" and "a lock held too long stalls everything" are exactly the bugs that take down a backend at 2 a.m., and they are what you will reproduce and fix here.</p>

<h3>🗂 Key terms</h3>
${kv([
  ['operating system (hệ điều hành)', 'The software that shares one computer’s hardware among many programs, safely and fairly.'],
  ['kernel (nhân)', 'The core of the OS that runs with full hardware access; everything else asks it for service.'],
  ['system call (lời gọi hệ thống)', 'The one controlled doorway from your program into the kernel — open a file, send a packet, start a process.'],
  ['process (tiến trình)', 'A running program: its own memory, open files, identity and a number (PID).'],
  ['race condition (tranh chấp)', 'A bug where the result depends on the exact timing of concurrent work — the Therac-25 killer.'],
  ['distribution / distro (bản phân phối)', 'Linux kernel + tools packaged together: Ubuntu, Debian, Fedora, Alpine.'],
])}

<h3>🧪 Practice (10 min)</h3>
<div class="callout ok">
<p>Just get oriented — no setup yet.</p>
<ol>
<li>On your own machine open a terminal and run <code>uname -a</code> (macOS/Linux) or, on Windows, <code>wsl uname -a</code>. Which kernel are you on?</li>
<li>Open your system's activity viewer — <code>top</code> (press <code>q</code> to quit) in a terminal, or Activity Monitor (macOS) / Task Manager (Windows). Find the process using the most CPU and the one using the most memory. Write down their names.</li>
<li>Play the latency ladder above to the end. How many orders of magnitude separate an L1 cache hit from a cross-country network round trip?</li>
</ol>
<p><strong>Done when:</strong> you can name your kernel, your two hungriest processes, and say roughly how much slower the network is than the CPU (answer: about 100 million times).</p>
</div>

<h3>📌 Summary</h3>
<ul>
<li>An OS shares one computer's real hardware among many programs; the kernel is its core and the only thing that touches the hardware directly.</li>
<li>Programs ask the kernel for everything real through system calls — the doorway you will watch all course long.</li>
<li>Unix (1969) → C (1973) → GNU (1983) → Linux (1991) is why the same ideas run your laptop, your server, and your phone.</li>
<li>OS bugs — races, priority inversion — are real and expensive; this course makes them visible so you can avoid them.</li>
<li>For backend and security work, processes/threads and the memory layout are not optional extras — they are the core.</li>
</ul>
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/', '📘', 'OSTEP — Operating Systems: Three Easy Pieces', 'The free textbook this course reads alongside (Arpaci-Dusseau, Wisconsin).', 'Read')}
${L('https://en.wikipedia.org/wiki/History_of_Linux', '📜', 'History of Linux', 'Torvalds’ 1991 comp.os.minix announcement and what came after.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (1/2)</span>
<h2>Bạn đã dùng hệ điều hành cả ngày rồi — giờ ta mở nó ra</h2>
<p class="lead">Mỗi ngày bạn nhìn tiến trình nào ăn CPU, bộ nhớ sắp cạn hay ổ đĩa đầy chưa, container nhốt chương trình thế nào. Bạn nói rằng bạn đọc những thứ đó mà <em>gần như không hiểu gì</em>. Khoá này sửa đúng chuyện đó. Học xong, bạn không chỉ đọc được các con số ấy — bạn biết chúng từ đâu ra, tái hiện được mọi sự cố một cách có chủ đích, và đo được cách sửa.</p>
<p>Và vì bạn muốn đi backend và bảo mật: một máy chủ xử lý hàng nghìn yêu cầu cùng lúc sống chết ở chỗ nó dùng tiến trình (process) và luồng (thread) ra sao; một phần lớn lỗ hổng thật nằm ở tầng hệ điều hành, nơi bạn không thể mổ xẻ một tệp nhị phân nếu không biết chương trình nằm trong bộ nhớ thế nào. Đó không phải chủ đề nâng cao gắn thêm ở cuối — đó là xương sống của khoá.</p>

<h3>Hệ điều hành thật ra là gì</h3>
<p>Một máy tính có một bộ tài nguyên thật: vài lõi CPU, một ít RAM, một ổ đĩa, một card mạng. Bạn muốn chạy hàng chục chương trình — trình duyệt, trình soạn mã, một cơ sở dữ liệu, ba container Docker — cùng lúc, và không chương trình nào được đọc bộ nhớ của chương trình khác hay làm sập cả máy. Phải có một thứ chia phần cứng một cách công bằng và an toàn. Thứ đó là <strong>hệ điều hành (operating system)</strong>, và lõi của nó là <strong>nhân (kernel)</strong>.</p>
<p>Hãy hình dung nhân như <strong>người quản lý một chung cư</strong>. Mỗi người thuê (các chương trình của bạn) đều tưởng mình có cả toà nhà: phòng riêng (bộ nhớ), lượt đi thang máy (CPU), hộp thư riêng (file). Người quản lý phát thời gian và không gian, giữ người này không bước vào phòng người kia, và là người duy nhất được chạm vào hệ thống điện của toà nhà (phần cứng). Khi một chương trình muốn làm việc thật — đọc file, gửi gói tin, chạy một chương trình khác — nó không tự làm; nó <em>nhờ</em> người quản lý qua một <strong>lời gọi hệ thống (system call)</strong>. Lời nhờ đó, băng từ code của bạn vào nhân rồi trở ra, là sự kiện quan trọng nhất của cả khoá — và bạn sẽ nhìn thấy nó xảy ra bằng <code>strace</code> ngay trong phòng lab Mục 0.</p>

<h3>Nó từ đâu tới (và vì sao điều đó đáng quan tâm)</h3>
<p>Mọi thứ này không tự nhiên hiển nhiên. Các ý tưởng được đúc kết suốt năm mươi năm, và biết câu chuyện thì thấy thiết kế hợp lý hẳn:</p>
<ul>
<li><strong>1964–1969 · Multics.</strong> MIT, Bell Labs và GE thử dựng một hệ chia-sẻ-thời-gian tham vọng tên Multics. Nó quá đồ sộ; Bell Labs rút lui năm 1969.</li>
<li><strong>1969 · Unix.</strong> Ken Thompson và Dennis Ritchie ở Bell Labs dựng một hệ nhỏ, đơn giản trên một máy PDP-7 bỏ không — như một phản ứng với Multics. Bắt đầu năm 1969; công bố ra ngoài Bell Labs năm 1973.</li>
<li><strong>1971–1973 · C và triết lý Unix.</strong> Ritchie tạo ra ngôn ngữ C và Unix được viết lại bằng C (công bố 1973) — để hệ điều hành chuyển sang phần cứng mới được, thay vì bị trói vào một máy. <strong>Pipe (ống dẫn)</strong> của Doug McIlroy ra đời 1973, kéo theo triết lý Unix: mỗi chương trình làm tốt một việc; nối chúng bằng ống dẫn; văn bản là giao diện chung. Bạn sẽ cảm thấy triết lý đó trong mọi bài lab.</li>
<li><strong>1983–1989 · GNU và Bash.</strong> Richard Stallman khởi động dự án GNU năm 1983 để dựng một hệ tương thích Unix miễn phí; Brian Fox viết shell Bash năm 1989.</li>
<li><strong>25/08/1991 · Linux.</strong> Một sinh viên Phần Lan, Linus Torvalds, công bố một nhân miễn phí trên nhóm tin comp.os.minix. Linux 0.01 kèm theo một bản Bash của GNU. Công cụ GNU + nhân Linux thành hệ điều hành mà nay chạy phần lớn internet, mọi điện thoại Android, và cái máy mà container của bạn đang sống trên đó.</li>
<li><strong>1993 · Windows NT</strong> (nhóm của Dave Cutler) và <strong>2001 · macOS</strong> (nhân XNU: Mach + BSD) đi đường khác — Chương 14 so cả ba dưới con mắt lập trình viên.</li>
</ul>
${lab('latency', 'default', 'vi', 'Cảm nhận về thang độ lớn mà ta đang làm việc — nếu một chu kỳ CPU dài một giây thì đọc đĩa mất mấy ngày và một vòng mạng xuyên lục địa mất bốn năm.')}

<h3>Lỗi ở tầng này không phải chuyện sách vở</h3>
<p>Hai ca nổi tiếng — cả hai do đúng những cơ chế khoá này dạy:</p>
<div class="callout danger">
<p><strong>Therac-25 (1985–1987).</strong> Một máy xạ trị có một <em>race condition</em> (Chương 5): nếu kỹ thuật viên gõ các thông số điều trị thật nhanh, hai tác vụ chạy đồng thời xen vào nhau theo một thứ tự mà người lập trình chưa bao giờ lường trước, và máy phóng ra liều bức xạ cực lớn. Ít nhất sáu bệnh nhân bị thương nặng; một số đã tử vong. Lỗi đồng thời vô hình cho tới khi thời điểm trùng khớp — chính vì thế khoá này bắt bạn <em>nhìn thấy</em> cách các luồng xen kẽ.</p>
<p><strong>Mars Pathfinder (1997).</strong> Vài ngày sau khi hạ cánh, tàu cứ tự khởi động lại. Nguyên nhân là <em>đảo ngược ưu tiên</em> (Chương 6): một tác vụ ưu tiên thấp giữ một khoá mà tác vụ ưu tiên cao cần, trong khi một tác vụ ưu tiên trung bình chiếm CPU, nên tác vụ ưu tiên cao lỡ hạn và một watchdog khởi động lại hệ thống. Kỹ sư chẩn đoán trên một bản sao giống hệt ở phòng lab và sửa bằng cách bật một cờ — từ Trái Đất.</p>
</div>
<p>Bạn không dựng máy xạ trị. Nhưng "kết quả phụ thuộc thời điểm" và "một khoá giữ quá lâu làm nghẽn tất cả" đúng là những lỗi hạ gục một backend lúc 2 giờ sáng, và đó là thứ bạn sẽ tái hiện rồi sửa ở đây.</p>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['operating system (hệ điều hành)', 'Phần mềm chia phần cứng của một máy tính cho nhiều chương trình, an toàn và công bằng.'],
  ['kernel (nhân)', 'Lõi của hệ điều hành, chạy với toàn quyền phần cứng; mọi thứ khác phải nhờ nó phục vụ.'],
  ['system call (lời gọi hệ thống)', 'Cánh cửa duy nhất, có kiểm soát, từ chương trình của bạn vào nhân — mở file, gửi gói tin, tạo tiến trình.'],
  ['process (tiến trình)', 'Một chương trình đang chạy: có bộ nhớ riêng, file đang mở, danh tính và một con số (PID).'],
  ['race condition (tranh chấp)', 'Lỗi mà kết quả phụ thuộc vào thời điểm chính xác của việc chạy đồng thời — thủ phạm của Therac-25.'],
  ['distribution / distro (bản phân phối)', 'Nhân Linux + công cụ đóng gói chung: Ubuntu, Debian, Fedora, Alpine.'],
])}

<h3>🧪 Thực hành (10 phút)</h3>
<div class="callout ok">
<p>Chỉ để định hướng — chưa cài gì cả.</p>
<ol>
<li>Trên máy của bạn mở một terminal và chạy <code>uname -a</code> (macOS/Linux), hoặc trên Windows chạy <code>wsl uname -a</code>. Bạn đang dùng nhân nào?</li>
<li>Mở công cụ xem hoạt động của hệ thống — <code>top</code> (bấm <code>q</code> để thoát) trong terminal, hoặc Activity Monitor (macOS) / Task Manager (Windows). Tìm tiến trình ăn CPU nhiều nhất và tiến trình ăn bộ nhớ nhiều nhất. Ghi tên chúng lại.</li>
<li>Chạy thang độ trễ phía trên tới hết. Cache L1 và một vòng mạng xuyên lục địa cách nhau mấy bậc độ lớn?</li>
</ol>
<p><strong>Đạt khi:</strong> bạn gọi được tên nhân của mình, hai tiến trình đói tài nguyên nhất, và nói được mạng chậm hơn CPU cỡ nào (đáp án: khoảng 100 triệu lần).</p>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Hệ điều hành chia phần cứng thật của một máy cho nhiều chương trình; nhân là lõi của nó và là thứ duy nhất chạm trực tiếp vào phần cứng.</li>
<li>Chương trình nhờ nhân làm mọi việc thật qua lời gọi hệ thống — cánh cửa bạn sẽ theo dõi suốt khoá.</li>
<li>Unix (1969) → C (1973) → GNU (1983) → Linux (1991) là lý do cùng những ý tưởng ấy chạy trên laptop, máy chủ và điện thoại của bạn.</li>
<li>Lỗi hệ điều hành — race, đảo ngược ưu tiên — là có thật và đắt giá; khoá này làm chúng hiện ra để bạn tránh.</li>
<li>Với backend và bảo mật, tiến trình/luồng và bố cục bộ nhớ không phải phần phụ — chúng là phần cốt lõi.</li>
</ul>
${L('https://pages.cs.wisc.edu/~remzi/OSTEP/', '📘', 'OSTEP — Operating Systems: Three Easy Pieces', 'Sách giáo khoa miễn phí mà khoá này đọc song song (Arpaci-Dusseau, Wisconsin).', 'Đọc')}
${L('https://en.wikipedia.org/wiki/History_of_Linux', '📜', 'Lịch sử Linux', 'Lời công bố năm 1991 của Torvalds trên comp.os.minix và những gì đến sau.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 0.9 — Bắt đầu tại đây (2/2) ───────────────────────── */
    {
      title: 'Start here (2/2) — What you can do after this course, and how to study it|||Bắt đầu tại đây (2/2) — Học xong làm được gì, và học thế nào',
      slug: 'os-0-9-bat-dau-hoc-xong',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Bản đồ cả khoá, bạn làm được gì sau mỗi chương, và cách học hiệu quả: xem mô phỏng → đọc bài → gõ lại lệnh → tự đo → quiz; dùng phòng lab vứt đi được để không sợ làm hỏng.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Start here (2/2)</span>
<h2>Where this course takes you</h2>
<p class="lead">This is a university OS course — but every idea is tied back to code you write and numbers you can measure. You will not memorise definitions; you will reproduce each phenomenon in a throwaway Linux lab and watch it.</p>

<h3>The map</h3>
<p><strong>Foundations.</strong> Section 0 (here) sets up the lab and just-enough C. <strong>Chapter 1 — Processes</strong>: what a running program is, fork/exec/wait, zombies, exit 137. <strong>Chapter 2 — Observing Linux day to day</strong>: the exact skill you asked for — which process eats CPU/RAM/disk/IO/network, told as real incidents from this very project (the disk-full outage, the exit-137 OOM during a build, Docker hanging).</p>
<p><strong>Concurrency.</strong> <strong>Chapter 3</strong> threads and CPU scheduling; <strong>Chapter 4</strong> you <em>write</em> concurrent and parallel programs in C, Java, Node and Python and measure the speed-ups and costs; <strong>Chapter 5</strong> races and locks; <strong>Chapter 6</strong> deadlock and the classic problems. This is the "thousands of requests at once" backend core.</p>
<p><strong>Memory.</strong> <strong>Chapter 7</strong> virtual memory and paging (why programs slow down when RAM is short); <strong>Chapter 8</strong> swap, cgroups and the OOM killer — the exit-137 story, measured.</p>
<p><strong>Files, I/O, syscalls, containers.</strong> <strong>Chapter 9</strong> file systems and permissions; <strong>Chapter 10</strong> I/O models (why nginx and Node handle thousands of connections with epoll); <strong>Chapter 11</strong> system calls up close; <strong>Chapter 12</strong> containers = namespaces + cgroups, built by hand.</p>
<p><strong>Security and the wider world.</strong> <strong>Chapter 13 — Security at the OS layer</strong>: memory layout for reverse engineering, buffer overflows and the mitigations (ASLR, NX, stack canaries, PIE), privilege escalation, container escape basics — strictly defensive, only on your own lab. <strong>Chapter 14</strong> Windows and macOS through a developer's eyes. <strong>Chapter 15</strong> observe and tune (strace, perf, eBPF). <strong>Chapter 16</strong> exams and interviews. <strong>Chapter 17 — Capstone</strong>: build a mini shell + a tiny thread-pool HTTP server, then diagnose a planted performance incident.</p>

<h3>Prerequisites, honestly</h3>
<p>You should be able to program in one language (C, Java or JavaScript) and use a Linux terminal at a basic level. You do <em>not</em> need to know C well — lesson 0.2 gives you just enough to read every example, and the hard C lives in small, commented programs you run rather than write from scratch. If you have not used a terminal much, do the <strong>Linux &amp; Bash</strong> course first; it teaches <em>using</em> the OS, while this one teaches the <em>mechanisms</em> underneath and their effect on your code.</p>
${L('/courses/linux-bash/learn' + REF.replace('operating-systems-for-developers', 'linux-bash'), '🐧', 'Linux & Bash', 'Using the OS from the terminal — the companion course. Do it first if the shell is new to you.', 'Open')}

<h3>How to study so it sticks (and you don't give up)</h3>
<p>Beginners quit an OS course for three reasons: it feels invisible, the errors are in English, and they memorise commands without understanding. This course is built against all three — the simulators make it visible, every term has a Vietnamese gloss in a 🗂 box, and nothing is memorised because you reproduce it. The rhythm for each lesson:</p>
<ol>
<li><strong>Skim the slides</strong> to see the shape of the lesson.</li>
<li><strong>Play the simulator</strong> for the idea — step through it, change the inputs, break it on purpose.</li>
<li><strong>Read the lesson</strong> and <strong>run the commands yourself</strong> in the lab container. The output on your machine will differ in the exact numbers; the <em>pattern</em> will not.</li>
<li><strong>Do the 🧪 practice</strong> — a real situation, not "try command X".</li>
<li><strong>Take the quiz</strong>; the explanations say why the tempting wrong answer is wrong.</li>
</ol>
<div class="pitfall co-tieu-de"><p><strong>Don't just watch.</strong> An OS course you only read feels understood and vanishes in a week. The one thing that makes it stick is typing the commands and seeing <em>your</em> numbers. Every lesson is built so you can — that is what the lab in 0.1 is for.</p></div>

<h3>🗂 Key terms</h3>
${kv([
  ['throwaway container (container vứt đi)', 'A Linux box you can break, fill up or crash — then delete and recreate in seconds. Your safe playground.'],
  ['reproduce (tái hiện)', 'Make a bug happen on purpose so you can study and fix it — the opposite of hoping it never comes back.'],
  ['measure, don’t guess (đo, đừng đoán)', 'The habit of this course: run it and read the number, instead of reasoning about what "should" happen.'],
  ['capstone (dự án cuối khoá)', 'The final project where you build and diagnose a small system end to end.'],
])}

<h3>🧪 Practice (5 min)</h3>
<div class="callout ok">
<p>Make yourself a study plan.</p>
<ol>
<li>Decide your path: the full 17 chapters, or a 2-week minimum (Sections 0–1, then 2, 3, 5, 7, 8). Write it down.</li>
<li>Bookmark the visual lab (<code>/os-lab</code>) and OSTEP. You will use both every lesson.</li>
<li>Commit to the rhythm above for lesson 0.1 next.</li>
</ol>
<p><strong>Done when:</strong> you have a written path and the two bookmarks.</p>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The course goes from "what a process is" to diagnosing a real production server, with security and multi-OS chapters along the way.</li>
<li>You need one programming language and basic terminal use; lesson 0.2 covers the C you need.</li>
<li>The rhythm — slides → simulator → read &amp; run → practice → quiz — is designed so the invisible becomes visible and sticks.</li>
<li>The single highest-value habit: run the commands and read your own numbers, in a throwaway lab you cannot damage.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bắt đầu tại đây (2/2)</span>
<h2>Khoá này đưa bạn tới đâu</h2>
<p class="lead">Đây là một môn hệ điều hành bậc đại học — nhưng mọi ý tưởng đều nối về code bạn viết và những con số bạn đo được. Bạn sẽ không học thuộc định nghĩa; bạn sẽ tái hiện từng hiện tượng trong một phòng lab Linux vứt đi được, và nhìn nó.</p>

<h3>Bản đồ</h3>
<p><strong>Nền tảng.</strong> Mục 0 (ở đây) dựng phòng lab và dạy vừa đủ C. <strong>Chương 1 — Tiến trình</strong>: chương trình đang chạy là gì, fork/exec/wait, zombie, exit 137. <strong>Chương 2 — Quan sát Linux hằng ngày</strong>: đúng kỹ năng bạn hỏi — tiến trình nào ăn CPU/RAM/đĩa/IO/mạng, kể như những sự cố thật của chính dự án này (sự cố đầy đĩa, OOM exit 137 lúc build, Docker treo).</p>
<p><strong>Đồng thời.</strong> <strong>Chương 3</strong> luồng và lập lịch CPU; <strong>Chương 4</strong> bạn <em>tự viết</em> chương trình đồng thời và song song bằng C, Java, Node và Python rồi đo tốc độ tăng và cái giá phải trả; <strong>Chương 5</strong> race và khoá; <strong>Chương 6</strong> deadlock và các bài toán kinh điển. Đây là phần cốt lõi "hàng nghìn yêu cầu cùng lúc" của backend.</p>
<p><strong>Bộ nhớ.</strong> <strong>Chương 7</strong> bộ nhớ ảo và phân trang (vì sao chương trình chậm đi khi thiếu RAM); <strong>Chương 8</strong> swap, cgroup và OOM killer — câu chuyện exit 137, đo thật.</p>
<p><strong>File, I/O, syscall, container.</strong> <strong>Chương 9</strong> hệ thống file và quyền; <strong>Chương 10</strong> các mô hình I/O (vì sao nginx và Node xử lý hàng nghìn kết nối bằng epoll); <strong>Chương 11</strong> system call nhìn gần; <strong>Chương 12</strong> container = namespace + cgroup, tự dựng bằng tay.</p>
<p><strong>Bảo mật và thế giới rộng hơn.</strong> <strong>Chương 13 — Bảo mật ở tầng hệ điều hành</strong>: bố cục bộ nhớ để dịch ngược, tràn bộ đệm và các lớp phòng vệ (ASLR, NX, stack canary, PIE), leo thang đặc quyền, nhập môn thoát container — thuần phòng thủ, chỉ trên phòng lab của chính bạn. <strong>Chương 14</strong> Windows và macOS dưới con mắt lập trình viên. <strong>Chương 15</strong> quan sát và tinh chỉnh (strace, perf, eBPF). <strong>Chương 16</strong> thi cử và phỏng vấn. <strong>Chương 17 — Dự án cuối khoá</strong>: dựng một shell tí hon + một máy chủ HTTP có thread pool, rồi chẩn đoán một sự cố hiệu năng được cài sẵn.</p>

<h3>Điều kiện cần, nói thẳng</h3>
<p>Bạn cần lập trình được một ngôn ngữ (C, Java hoặc JavaScript) và dùng terminal Linux ở mức cơ bản. Bạn <em>không</em> cần giỏi C — bài 0.2 cho bạn vừa đủ để đọc mọi ví dụ, và phần C khó nằm trong những chương trình nhỏ có chú thích mà bạn chạy chứ không viết từ đầu. Nếu bạn chưa quen terminal, học khoá <strong>Linux &amp; Bash</strong> trước; khoá đó dạy <em>dùng</em> hệ điều hành, còn khoá này dạy <em>cơ chế</em> bên dưới và tác động của nó lên code của bạn.</p>
${L('/courses/linux-bash/learn' + REF.replace('operating-systems-for-developers', 'linux-bash'), '🐧', 'Linux & Bash', 'Dùng hệ điều hành từ terminal — khoá đồng hành. Học trước nếu shell còn mới với bạn.', 'Mở')}

<h3>Học thế nào để đọng lại (và không bỏ cuộc)</h3>
<p>Người mới bỏ môn hệ điều hành vì ba lý do: nó vô hình, lỗi toàn tiếng Anh, và học thuộc lệnh mà không hiểu. Khoá này dựng để chống cả ba — mô phỏng làm nó hiện ra, mọi thuật ngữ có nghĩa tiếng Việt trong ô 🗂, và không phải học thuộc gì vì bạn tái hiện lại. Nhịp của mỗi bài:</p>
<ol>
<li><strong>Lướt slide</strong> để thấy hình dạng bài học.</li>
<li><strong>Chạy mô phỏng</strong> của ý đó — đi từng bước, đổi dữ liệu vào, phá nó có chủ đích.</li>
<li><strong>Đọc bài</strong> và <strong>tự gõ lại các lệnh</strong> trong container lab. Output trên máy bạn sẽ khác ở con số cụ thể; <em>quy luật</em> thì không.</li>
<li><strong>Làm 🧪 thực hành</strong> — một tình huống thật, không phải "hãy thử lệnh X".</li>
<li><strong>Làm quiz</strong>; phần giải thích nói vì sao đáp án hấp dẫn nhưng sai lại sai.</li>
</ol>
<div class="pitfall co-tieu-de"><p><strong>Đừng chỉ xem.</strong> Một môn hệ điều hành chỉ đọc thì thấy hiểu rồi tuần sau bay hết. Thứ duy nhất làm nó đọng lại là gõ lệnh và nhìn con số của <em>chính bạn</em>. Mỗi bài được dựng để bạn làm được điều đó — phòng lab ở bài 0.1 là để dành cho việc này.</p></div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['throwaway container (container vứt đi)', 'Một máy Linux bạn làm hỏng, làm đầy hay làm sập cũng được — rồi xoá và dựng lại trong vài giây. Sân chơi an toàn của bạn.'],
  ['reproduce (tái hiện)', 'Làm cho lỗi xảy ra có chủ đích để nghiên cứu và sửa — ngược với việc mong nó đừng quay lại.'],
  ['measure, don’t guess (đo, đừng đoán)', 'Thói quen của khoá: chạy rồi đọc con số, thay vì suy luận chuyện "đáng lẽ" phải xảy ra.'],
  ['capstone (dự án cuối khoá)', 'Dự án cuối, nơi bạn dựng và chẩn đoán một hệ thống nhỏ từ đầu tới cuối.'],
])}

<h3>🧪 Thực hành (5 phút)</h3>
<div class="callout ok">
<p>Tự lập cho mình một kế hoạch học.</p>
<ol>
<li>Chọn lộ trình: trọn 17 chương, hay bản tối thiểu 2 tuần (Mục 0–Chương 1, rồi 2, 3, 5, 7, 8). Ghi ra.</li>
<li>Đánh dấu phòng lab trực quan (<code>/os-lab</code>) và OSTEP. Bạn sẽ dùng cả hai mỗi bài.</li>
<li>Cam kết đi theo nhịp phía trên cho bài 0.1 tiếp theo.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn có một lộ trình viết ra và hai dấu trang.</p>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Khoá đi từ "tiến trình là gì" tới chẩn đoán một máy chủ production thật, có các chương bảo mật và đa hệ điều hành dọc đường.</li>
<li>Bạn cần một ngôn ngữ lập trình và biết dùng terminal cơ bản; bài 0.2 lo phần C cần thiết.</li>
<li>Nhịp — slide → mô phỏng → đọc &amp; chạy → thực hành → quiz — được thiết kế để cái vô hình hiện ra và đọng lại.</li>
<li>Thói quen giá trị nhất: chạy lệnh và đọc con số của chính mình, trong một phòng lab vứt đi được mà bạn không thể làm hỏng.</li>
</ul>
</div>
`,
    },
    /* ───────────────────────── 0.1 — Phòng lab ───────────────────────── */
    {
      title: '0.1 — Your OS lab: a throwaway Linux with gcc, strace and friends|||0.1 — Phòng lab OS: một Linux vứt đi được, có gcc, strace và đồng bọn',
      slug: 'os-0-1-cai-dat',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Dựng container lab của khoá (Docker Desktop, chạy trên Mac Apple Silicon/Linux/Windows), chạy thử nó, và hiểu vì sao Docker trên macOS thật ra là một máy ảo Linux — cùng những chỗ nó khác máy Linux trần.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>A Linux you can break</h2>
<p class="lead">Everything in this course runs on Linux, and you will do things to it that you must never do to your real machine — fill the disk, exhaust memory, send SIGKILL in bulk, fork-bomb a cgroup. The answer is a <strong>throwaway container</strong>: a real Linux with all the tools, that you create in seconds and delete when you are done, leaving your laptop untouched.</p>

<h3>Get Docker, then build the lab image</h3>
<p>Install <strong>Docker Desktop</strong> (macOS, Windows or Linux). Then grab the course lab folder and build the image once — it has gcc, gdb, strace, ltrace, valgrind, perf, htop, sysstat, stress-ng, Python 3, OpenJDK 21 and Node 22, about 1.8 GB:</p>
${cmd('# the lab Dockerfile lives in the course: content/courses/operating-systems-for-developers/lab/moi-truong/', 'docker build -t os-lab lab/moi-truong          # ~3-6 min the first time', 'docker run -it --rm --name os-lab --hostname oslab os-lab     # you are now inside Linux')}
<p>Inside, check what you have — this is real output from the image:</p>
${run('s00-gioi-thieu', 'uname -srm', 9)}
<p>That is Ubuntu 26.04 with the GNU toolchain, three language runtimes and the whole observability toolbox. <code>--rm</code> means the container is deleted the moment you exit, so you always start clean. Mount a folder to keep your code across runs:</p>
${cmd('docker run -it --rm -v "$PWD/mycode":/lab/mycode -w /lab/mycode os-lab   # your files survive')}

<h3>A box you can hand limits to</h3>
<p>Real servers do not have infinite CPU and RAM, and neither will your container when you ask it not to. This is how Chapter 8's OOM stories are reproduced — a 1 GB box with 2 cores, just like a small VPS:</p>
${run('s00-gioi-han', 'nproc', 1)}
${run('s00-gioi-han', 'cat /sys/fs/cgroup/cpu.max', 1)}
${run('s00-gioi-han', 'cat /sys/fs/cgroup/memory.max', 1)}
<p><code>cpu.max</code> reads <code>200000 100000</code>: 200 ms of CPU time per 100 ms of wall-clock — that is the <code>--cpus 2</code> limit, enforced by the kernel's cgroup v2 (Chapter 8 and 12). <code>memory.max</code> is exactly 1 GiB in bytes. The kernel will kill anything inside that tries to go past it.</p>

<div class="pitfall co-tieu-de">
<p><strong>Docker Desktop on a Mac is a Linux VM.</strong> macOS is Unix but its kernel is XNU, not Linux, and it has no containers, cgroups or <code>/proc</code> the way Linux does. So Docker Desktop quietly runs a lightweight Linux virtual machine, and your containers live inside <em>that</em>. Run <code>uname -r</code> in the lab and you will see <code>7.0.12-linuxkit</code> — the VM's kernel, not macOS. Almost everything behaves exactly like a bare Linux server; the exceptions, noted where they matter, are: <code>perf</code> hardware counters are limited (you get software events like <code>task-clock</code>, not <code>cache-misses</code>); some <code>/proc</code> and <code>/sys</code> values describe the VM, not your Mac; and disk/network timings are the VM's. For those few things, a real Linux machine (a cheap VPS, or Windows' WSL2) gives the full picture.</p>
</div>

<h3>Golden rules for the lab</h3>
<ul>
<li>Dangerous commands (filling the disk, <code>kill</code> sprees, fork bombs, mounting filesystems) go <strong>only inside a container you can delete</strong> — never on your host.</li>
<li>Name your lab containers so you can find and remove them: <code>docker run --name os-xx …</code>, then <code>docker rm -f os-xx</code>.</li>
<li><code>docker run --privileged</code> grants a container extra power (needed for the namespaces, cgroups and security chapters). Use it only on a throwaway container, never casually.</li>
<li>When done: <code>docker ps -a</code> to see leftovers, <code>docker rm -f $(docker ps -aq --filter name=os-)</code> to clean up.</li>
</ul>

<h3>🧪 Practice (15 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you want to be sure you can break and rebuild the lab freely before you rely on it.</p>
<ol>
<li>Build the image and start a container. Run <code>cat /etc/os-release</code>, <code>nproc</code>, <code>free -h</code>.</li>
<li>Fill its disk on purpose: <code>fallocate -l 500M /tmp/big &amp;&amp; df -h /tmp</code>, then <code>rm /tmp/big</code>. (Your Mac's disk is untouched.)</li>
<li>Exit, and prove the damage is gone: start a fresh container and run <code>ls /tmp</code> — <code>big</code> is not there.</li>
<li>Start one with limits: <code>docker run -it --rm --cpus 1 --memory 512m os-lab</code> and confirm with <code>nproc</code> and <code>cat /sys/fs/cgroup/memory.max</code>.</li>
<li>Clean up: <code>docker ps -a</code>, then remove any leftover <code>os-</code> containers.</li>
</ol>
<p><strong>Done when:</strong> you filled a disk and threw it away, and you have a 1-core/512 MB box reporting its limits.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['image (ảnh)', 'A read-only template — the lab’s filesystem + tools. You build it once and run many containers from it.'],
  ['container', 'A running instance of an image: a sandboxed Linux process tree. Chapter 12 shows it is just namespaces + cgroups.'],
  ['--rm', 'Delete the container when it exits, so every run starts from a clean image.'],
  ['bind mount (-v host:container)', 'Share a host folder into the container so your code survives deletes.'],
  ['cgroup v2', 'The kernel feature that caps a container’s CPU, memory and I/O. cpu.max / memory.max are its knobs.'],
  ['linuxkit', 'The tiny Linux kernel Docker Desktop runs in a VM on macOS/Windows.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>Do everything in a throwaway container: a real Linux with every tool, created and deleted in seconds.</li>
<li>Build it once with <code>docker build -t os-lab lab/moi-truong</code>; <code>--rm</code> keeps each run clean; <code>-v</code> keeps your code.</li>
<li><code>--cpus</code> and <code>--memory</code> give you a VPS-sized box to reproduce real limits and OOM.</li>
<li>On macOS/Windows, Docker runs a Linux VM; it behaves like bare Linux except for <code>perf</code> hardware counters and some VM-specific timings.</li>
</ul>
${L('https://docs.docker.com/desktop/', '🐳', 'Docker Desktop docs', 'Install for macOS, Windows or Linux.', 'Open')}
${L('/courses/docker/learn' + REF.replace('operating-systems-for-developers', 'docker'), '📦', 'Docker course', 'Want more on images and containers? The Docker course goes deep; here we only use them as a lab.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Một Linux bạn làm hỏng cũng được</h2>
<p class="lead">Mọi thứ trong khoá chạy trên Linux, và bạn sẽ làm với nó những việc không bao giờ được làm với máy thật — làm đầy đĩa, vét sạch bộ nhớ, gửi SIGKILL hàng loạt, fork-bomb một cgroup. Giải pháp là một <strong>container vứt đi được</strong>: một Linux thật đủ công cụ, dựng trong vài giây và xoá khi xong, không đụng gì tới laptop của bạn.</p>

<h3>Cài Docker rồi dựng ảnh lab</h3>
<p>Cài <strong>Docker Desktop</strong> (macOS, Windows hoặc Linux). Rồi lấy thư mục lab của khoá và dựng ảnh một lần — nó có gcc, gdb, strace, ltrace, valgrind, perf, htop, sysstat, stress-ng, Python 3, OpenJDK 21 và Node 22, cỡ 1,8 GB:</p>
${cmd('# Dockerfile của lab nằm trong khoá: content/courses/operating-systems-for-developers/lab/moi-truong/', 'docker build -t os-lab lab/moi-truong          # ~3-6 phút lần đầu', 'docker run -it --rm --name os-lab --hostname oslab os-lab     # bạn đang ở trong Linux')}
<p>Vào trong, kiểm xem bạn có gì — đây là output thật của ảnh:</p>
${run('s00-gioi-thieu', 'uname -srm', 9)}
<p>Đó là Ubuntu 26.04 với bộ công cụ GNU, ba trình chạy ngôn ngữ và cả hộp đồ nghề quan sát. <code>--rm</code> nghĩa là container bị xoá ngay khi bạn thoát, nên lần nào cũng bắt đầu sạch. Gắn một thư mục để giữ mã qua các lần chạy:</p>
${cmd('docker run -it --rm -v "$PWD/mycode":/lab/mycode -w /lab/mycode os-lab   # file của bạn còn lại')}

<h3>Một cái hộp bạn phát giới hạn cho nó được</h3>
<p>Máy chủ thật không có CPU và RAM vô hạn, và container của bạn cũng vậy khi bạn bảo nó đừng. Đây chính là cách tái hiện các câu chuyện OOM của Chương 8 — một hộp 1 GB với 2 lõi, y như một VPS nhỏ:</p>
${run('s00-gioi-han', 'nproc', 1)}
${run('s00-gioi-han', 'cat /sys/fs/cgroup/cpu.max', 1)}
${run('s00-gioi-han', 'cat /sys/fs/cgroup/memory.max', 1)}
<p><code>cpu.max</code> đọc ra <code>200000 100000</code>: 200 ms thời gian CPU trên mỗi 100 ms đồng hồ treo tường — chính là giới hạn <code>--cpus 2</code>, do cgroup v2 của nhân ép (Chương 8 và 12). <code>memory.max</code> đúng bằng 1 GiB tính theo byte. Nhân sẽ giết bất cứ thứ gì bên trong cố vượt qua nó.</p>

<div class="pitfall co-tieu-de">
<p><strong>Docker Desktop trên Mac là một máy ảo Linux.</strong> macOS là Unix nhưng nhân của nó là XNU, không phải Linux, và nó không có container, cgroup hay <code>/proc</code> theo kiểu Linux. Nên Docker Desktop âm thầm chạy một máy ảo Linux gọn nhẹ, và container của bạn sống bên trong <em>cái đó</em>. Chạy <code>uname -r</code> trong lab bạn sẽ thấy <code>7.0.12-linuxkit</code> — nhân của máy ảo, không phải macOS. Gần như mọi thứ hành xử đúng như máy chủ Linux trần; các ngoại lệ, có ghi chú ở chỗ chúng đáng kể, là: bộ đếm phần cứng của <code>perf</code> bị hạn chế (bạn chỉ có sự kiện phần mềm như <code>task-clock</code>, không có <code>cache-misses</code>); một số giá trị <code>/proc</code> và <code>/sys</code> tả máy ảo chứ không phải máy Mac; và thời gian đĩa/mạng là của máy ảo. Với vài thứ đó, một máy Linux thật (một VPS rẻ, hoặc WSL2 của Windows) cho bức tranh đầy đủ.</p>
</div>

<h3>Luật vàng cho phòng lab</h3>
<ul>
<li>Lệnh nguy hiểm (làm đầy đĩa, <code>kill</code> hàng loạt, fork bomb, mount hệ thống file) chỉ chạy <strong>trong một container xoá được</strong> — không bao giờ trên máy chủ (host) của bạn.</li>
<li>Đặt tên container lab để tìm và xoá được: <code>docker run --name os-xx …</code>, rồi <code>docker rm -f os-xx</code>.</li>
<li><code>docker run --privileged</code> trao cho container thêm quyền (cần cho các chương namespace, cgroup và bảo mật). Chỉ dùng trên container vứt đi, đừng dùng bừa.</li>
<li>Xong thì: <code>docker ps -a</code> để xem thứ còn sót, <code>docker rm -f $(docker ps -aq --filter name=os-)</code> để dọn.</li>
</ul>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn muốn chắc chắn mình có thể phá rồi dựng lại phòng lab thoải mái trước khi dựa vào nó.</p>
<ol>
<li>Dựng ảnh và khởi động một container. Chạy <code>cat /etc/os-release</code>, <code>nproc</code>, <code>free -h</code>.</li>
<li>Làm đầy đĩa có chủ đích: <code>fallocate -l 500M /tmp/big &amp;&amp; df -h /tmp</code>, rồi <code>rm /tmp/big</code>. (Đĩa Mac của bạn không hề bị đụng.)</li>
<li>Thoát ra, và chứng minh thiệt hại đã biến mất: khởi động một container mới và chạy <code>ls /tmp</code> — không có <code>big</code>.</li>
<li>Khởi động một cái có giới hạn: <code>docker run -it --rm --cpus 1 --memory 512m os-lab</code> rồi kiểm bằng <code>nproc</code> và <code>cat /sys/fs/cgroup/memory.max</code>.</li>
<li>Dọn: <code>docker ps -a</code>, rồi xoá mọi container <code>os-</code> còn sót.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn đã làm đầy một đĩa rồi vứt nó đi, và có một hộp 1 lõi/512 MB báo đúng giới hạn của nó.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['image (ảnh)', 'Một khuôn chỉ đọc — hệ thống file + công cụ của lab. Dựng một lần, chạy nhiều container từ nó.'],
  ['container', 'Một bản đang chạy của một ảnh: một cây tiến trình Linux bị rào lại. Chương 12 cho thấy nó chỉ là namespace + cgroup.'],
  ['--rm', 'Xoá container khi nó thoát, nên lần chạy nào cũng bắt đầu từ một ảnh sạch.'],
  ['bind mount (-v host:container)', 'Chia một thư mục của host vào container để mã của bạn còn lại sau khi xoá.'],
  ['cgroup v2', 'Tính năng của nhân giới hạn CPU, bộ nhớ và I/O của một container. cpu.max / memory.max là các núm của nó.'],
  ['linuxkit', 'Nhân Linux tí hon mà Docker Desktop chạy trong một máy ảo trên macOS/Windows.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>Làm mọi thứ trong một container vứt đi được: một Linux thật đủ công cụ, dựng và xoá trong vài giây.</li>
<li>Dựng một lần bằng <code>docker build -t os-lab lab/moi-truong</code>; <code>--rm</code> giữ mỗi lần chạy sạch; <code>-v</code> giữ mã của bạn.</li>
<li><code>--cpus</code> và <code>--memory</code> cho bạn một hộp cỡ VPS để tái hiện giới hạn thật và OOM.</li>
<li>Trên macOS/Windows, Docker chạy một máy ảo Linux; nó hành xử như Linux trần, trừ bộ đếm phần cứng của <code>perf</code> và vài thời gian riêng của máy ảo.</li>
</ul>
${L('https://docs.docker.com/desktop/', '🐳', 'Tài liệu Docker Desktop', 'Cài cho macOS, Windows hoặc Linux.', 'Mở')}
${L('/courses/docker/learn' + REF.replace('operating-systems-for-developers', 'docker'), '📦', 'Khoá Docker', 'Muốn hiểu sâu về image và container? Khoá Docker đi sâu; ở đây ta chỉ dùng chúng làm phòng lab.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 0.2 — Vừa đủ C ───────────────────────── */
    {
      title: '0.2 — Just enough C to read every OS example|||0.2 — Vừa đủ C để đọc mọi ví dụ của khoá',
      slug: 'os-0-2-c-toi-thieu',
      type: 'LESSON',
      isFreePreview: true,
      description: 'Con trỏ và địa chỉ, stack vs heap, malloc/free, gọi hàm hệ thống từ C, và vì sao C không có lưới an toàn — mọi ví dụ chạy thật, nối sang cách Java/JavaScript che những chuyện này đi.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Why the OS speaks C</h2>
<p class="lead">Unix was rewritten in C in 1973, the Linux kernel is C, and every system call has a C signature. You do not need to <em>write</em> much C in this course, but you need to <em>read</em> it — because C is the one language that hides nothing: a pointer really is an address, memory you allocate is really yours to manage, and a mistake really does crash. That transparency is exactly why it is the right language to see the OS through.</p>

<h3>A pointer is just an address</h3>
<p>This tiny program shows the whole idea. Read it, then read the output:</p>
${src('s00/pointers.c', 'c')}
${run('s00-c', 'gcc -Wall -g pointers.c')}
<p>Three things to take away. First, <code>&amp;n</code> is the <em>address</em> of <code>n</code> and <code>p</code> holds it, so <code>*p</code> reads the value there — <code>p</code> and <code>&amp;n</code> print the same number. Second, passing <code>&amp;n</code> to a function lets it change your variable (<code>twice</code> turned 5 into 10): that is how system calls return data into a buffer you give them. Third, look at the <em>addresses</em>: the global <code>&amp;count</code>, the heap <code>arr</code>, and the stack <code>&amp;n</code> are in three very different regions — <code>0xaaaa…</code>, <code>0xaaab…</code> and <code>0xffff…</code>. Those three regions are the subject of Chapter 7, and you can explore them right now:</p>
${lab('memory', 'layout', 'en', 'The regions those three addresses live in — text, data, heap, mmap and stack — and how ASLR moves them every run.')}

<h3>Stack vs heap, and malloc/free</h3>
<p>A local variable like <code>n</code> lives on the <strong>stack</strong>: created when the function is entered, gone when it returns — automatic. Anything bigger or longer-lived you request from the <strong>heap</strong> with <code>malloc</code>, and you must hand it back with <code>free</code>. Forget to free and the memory stays used until the process exits — a <em>leak</em> (Chapter 7). This is the one chore Java and JavaScript do for you with a garbage collector; C makes it explicit so you can see where the memory actually goes.</p>

<h3>Calling the kernel from C</h3>
<p>Every real action is a function that ends in a system call. Here <code>getpid</code>, <code>write</code> and <code>open</code>:</p>
${src('s00/sys.c', 'c')}
${run('s00-c', 'gcc -Wall -g sys.c')}
<p>Two openings failed and C does not throw — it returns <code>-1</code> and sets the global <code>errno</code>. <code>/etc/shadow</code> gave <code>errno 13</code> (EACCES, "Permission denied") because we ran as the unprivileged <code>dev</code> user; the missing file gave <code>ENOENT</code>. Reading <code>errno</code> after every syscall is the C habit that becomes "check the error" in every language. In Chapter 11 you will watch these exact calls cross into the kernel with <code>strace</code>.</p>

<h3>No safety net — and that is the point</h3>
<p>C will let you write past the end of an array. Here is the same <code>strcpy</code> into an 8-byte buffer, three ways:</p>
${src('s00/overflow.c', 'c')}
${run('s00-c', 'gcc -g overflow.c -o overflow', 1)}
<p>A too-long string smashed the stack; glibc's built-in check caught it and called <code>abort()</code> — exit code 134. Compile the same code with AddressSanitizer and it tells you exactly where:</p>
${run('s00-c', 'gcc -g -fsanitize=address overflow.c', 1, { max: 7 })}
<p>And a classic NULL dereference — "the user was not found, so the pointer is null, and we read it anyway":</p>
${src('s00/null.c', 'c')}
${run('s00-c', 'gcc -g null.c -o null', 1)}
${run('s00-c', 'gdb -q -batch', 1)}
<p><code>gdb</code> points straight at the line and shows <code>u=0x0</code>. Exit code 139 = 128 + 11 (SIGSEGV). These are not just C curiosities: a buffer overflow is the raw material of a whole class of security exploits (Chapter 13), and <code>SIGSEGV</code>/<code>SIGABRT</code> are signals you will meet again in Chapter 1.</p>

<div class="pitfall co-tieu-de">
<p><strong>Java and JavaScript did not remove these problems — they hid them.</strong> An array index out of bounds throws <code>ArrayIndexOutOfBoundsException</code> instead of corrupting memory; a null reference throws <code>NullPointerException</code>/<code>TypeError</code> instead of segfaulting; the garbage collector frees memory so you cannot forget. That safety is real and worth having. But the OS underneath is still C, so when your Node or Java process gets <code>Killed</code> with exit 137, or a native library segfaults, or memory grows without bound, you are back in this world — and this lesson is why you will understand it.</p>
</div>

<h3>🧪 Practice (20 min)</h3>
<div class="callout ok">
<p><strong>Situation:</strong> you are reviewing a teammate's C and want to predict what it does before running it.</p>
<ol>
<li>In the lab, <code>gcc -Wall -g pointers.c -o pointers &amp;&amp; ./pointers</code>. Change <code>twice</code> to take <code>int p</code> (by value, no <code>&amp;</code>) and call it <code>twice(n)</code>. Does <code>n</code> change now? Explain why.</li>
<li>Run <code>./overflow ok</code> (short) and <code>./overflow aaaaaaaaaaaaaaaa</code> (long). One prints, one aborts. Why?</li>
<li>Rebuild <code>overflow.c</code> with <code>-fsanitize=address</code> and feed it the long string. Which line and which variable does it name?</li>
<li>Write a 10-line program that <code>malloc</code>s 1 MB in a loop and never frees it; run it under <code>/usr/bin/time -v ./a.out</code> and watch "Maximum resident set size" climb. Add <code>free</code> and compare.</li>
</ol>
<p><strong>Done when:</strong> you can explain pass-by-value vs pass-by-address, why the long string aborts, and show RSS growing then not growing once you free.</p>
</div>

<h3>🗂 Key terms</h3>
${kv([
  ['pointer (con trỏ)', 'A variable holding a memory address. *p reads the value at that address; &x gives the address of x.'],
  ['stack / heap (ngăn xếp / vùng cấp phát)', 'Stack = automatic locals, freed on return. Heap = malloc’d memory you must free yourself.'],
  ['malloc / free', 'Request / return heap memory. Forgetting free is a memory leak.'],
  ['errno', 'A global set to an error code when a C library/syscall fails (returns -1). EACCES=13, ENOENT=2.'],
  ['segmentation fault (SIGSEGV)', 'The kernel killing a process that touched memory it may not — e.g. dereferencing NULL. Exit 139.'],
  ['AddressSanitizer (-fsanitize=address)', 'A compiler option that catches out-of-bounds and use-after-free with the exact line.'],
])}

<h3>📌 Summary</h3>
<ul>
<li>C hides nothing: a pointer is an address, you manage heap memory with malloc/free, and mistakes crash — which is why the OS is seen through it.</li>
<li>Syscalls return <code>-1</code> and set <code>errno</code>; checking it is the universal "handle the error" habit.</li>
<li>Out-of-bounds writes and NULL dereferences are real; stack canaries, AddressSanitizer and gdb catch them — and they are the seed of Chapters 11 and 13.</li>
<li>Java/JS turn these into exceptions and GC, but the C world returns the moment your process is Killed or a native call faults.</li>
</ul>
${L('https://man7.org/linux/man-pages/man3/errno.3.html', '📄', 'man 3 errno', 'The error codes every syscall can set.', 'Open')}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Vì sao hệ điều hành nói tiếng C</h2>
<p class="lead">Unix được viết lại bằng C năm 1973, nhân Linux là C, và mọi lời gọi hệ thống có một chữ ký C. Bạn không cần <em>viết</em> nhiều C trong khoá này, nhưng cần <em>đọc</em> được — vì C là ngôn ngữ duy nhất không giấu gì: một con trỏ thật sự là một địa chỉ, bộ nhớ bạn cấp phát thật sự do bạn quản lý, và một lỗi thật sự làm sập. Chính sự trong suốt đó khiến nó là ngôn ngữ đúng để nhìn xuyên vào hệ điều hành.</p>

<h3>Con trỏ chỉ là một địa chỉ</h3>
<p>Chương trình tí hon này cho thấy trọn ý tưởng. Đọc nó, rồi đọc output:</p>
${src('s00/pointers.c', 'c')}
${run('s00-c', 'gcc -Wall -g pointers.c')}
<p>Ba điều mang về. Một, <code>&amp;n</code> là <em>địa chỉ</em> của <code>n</code> và <code>p</code> giữ nó, nên <code>*p</code> đọc giá trị ở đó — <code>p</code> và <code>&amp;n</code> in ra cùng một số. Hai, truyền <code>&amp;n</code> vào một hàm cho phép nó đổi biến của bạn (<code>twice</code> biến 5 thành 10): đó chính là cách lời gọi hệ thống trả dữ liệu vào một bộ đệm bạn đưa cho nó. Ba, nhìn các <em>địa chỉ</em>: biến toàn cục <code>&amp;count</code>, heap <code>arr</code>, và stack <code>&amp;n</code> nằm ở ba vùng rất khác nhau — <code>0xaaaa…</code>, <code>0xaaab…</code> và <code>0xffff…</code>. Ba vùng đó là chủ đề của Chương 7, và bạn khám phá chúng được ngay bây giờ:</p>
${lab('memory', 'layout', 'vi', 'Các vùng mà ba địa chỉ đó nằm trong — text, data, heap, mmap và stack — và ASLR dời chúng mỗi lần chạy ra sao.')}

<h3>Stack vs heap, và malloc/free</h3>
<p>Một biến cục bộ như <code>n</code> nằm trên <strong>stack (ngăn xếp)</strong>: tạo ra khi vào hàm, mất đi khi hàm trả về — tự động. Thứ gì lớn hơn hoặc sống lâu hơn thì bạn xin từ <strong>heap (vùng cấp phát)</strong> bằng <code>malloc</code>, và phải trả lại bằng <code>free</code>. Quên free thì bộ nhớ bị chiếm cho tới khi tiến trình thoát — một <em>rò rỉ</em> (Chương 7). Đây là việc vặt duy nhất mà Java và JavaScript làm hộ bạn bằng bộ gom rác; C nói thẳng ra để bạn thấy bộ nhớ thật sự đi đâu.</p>

<h3>Gọi nhân từ C</h3>
<p>Mọi hành động thật là một hàm kết thúc bằng một lời gọi hệ thống. Ở đây là <code>getpid</code>, <code>write</code> và <code>open</code>:</p>
${src('s00/sys.c', 'c')}
${run('s00-c', 'gcc -Wall -g sys.c')}
<p>Hai lần mở thất bại và C không ném ngoại lệ — nó trả về <code>-1</code> và đặt biến toàn cục <code>errno</code>. <code>/etc/shadow</code> cho <code>errno 13</code> (EACCES, "Permission denied") vì ta chạy dưới người dùng không đặc quyền <code>dev</code>; file không có cho <code>ENOENT</code>. Đọc <code>errno</code> sau mỗi syscall là thói quen của C, về sau thành "kiểm tra lỗi" trong mọi ngôn ngữ. Ở Chương 11 bạn sẽ nhìn đúng những lời gọi này băng vào nhân bằng <code>strace</code>.</p>

<h3>Không có lưới an toàn — và đó mới là điểm chính</h3>
<p>C để bạn ghi vượt quá cuối một mảng. Đây là cùng một <code>strcpy</code> vào bộ đệm 8 byte, ba kiểu:</p>
${src('s00/overflow.c', 'c')}
${run('s00-c', 'gcc -g overflow.c -o overflow', 1)}
<p>Một chuỗi quá dài đã đập nát stack; phép kiểm dựng sẵn của glibc bắt được và gọi <code>abort()</code> — mã thoát 134. Biên dịch cùng đoạn mã với AddressSanitizer thì nó chỉ đúng chỗ:</p>
${run('s00-c', 'gcc -g -fsanitize=address overflow.c', 1, { max: 7 })}
<p>Và một ca truy cập NULL kinh điển — "không tìm thấy user, nên con trỏ là null, mà ta vẫn đọc nó":</p>
${src('s00/null.c', 'c')}
${run('s00-c', 'gcc -g null.c -o null', 1)}
${run('s00-c', 'gdb -q -batch', 1)}
<p><code>gdb</code> chỉ thẳng vào dòng lỗi và hiện <code>u=0x0</code>. Mã thoát 139 = 128 + 11 (SIGSEGV). Đây không chỉ là chuyện lạ của C: tràn bộ đệm là nguyên liệu thô của cả một lớp lỗ hổng bảo mật (Chương 13), và <code>SIGSEGV</code>/<code>SIGABRT</code> là những tín hiệu bạn gặp lại ở Chương 1.</p>

<div class="pitfall co-tieu-de">
<p><strong>Java và JavaScript không xoá bỏ những vấn đề này — chúng giấu đi.</strong> Chỉ số mảng vượt biên ném <code>ArrayIndexOutOfBoundsException</code> thay vì phá bộ nhớ; tham chiếu null ném <code>NullPointerException</code>/<code>TypeError</code> thay vì segfault; bộ gom rác tự giải phóng bộ nhớ nên bạn không thể quên. Sự an toàn đó là thật và đáng có. Nhưng hệ điều hành bên dưới vẫn là C, nên khi tiến trình Node hay Java của bạn bị <code>Killed</code> với exit 137, hay một thư viện gốc segfault, hay bộ nhớ phình không giới hạn, bạn quay lại thế giới này — và bài học này là lý do bạn sẽ hiểu nó.</p>
</div>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p><strong>Tình huống:</strong> bạn đang review C của một bạn cùng nhóm và muốn đoán trước nó làm gì trước khi chạy.</p>
<ol>
<li>Trong lab, <code>gcc -Wall -g pointers.c -o pointers &amp;&amp; ./pointers</code>. Đổi <code>twice</code> thành nhận <code>int p</code> (theo giá trị, không có <code>&amp;</code>) và gọi <code>twice(n)</code>. Giờ <code>n</code> có đổi không? Giải thích vì sao.</li>
<li>Chạy <code>./overflow ok</code> (ngắn) và <code>./overflow aaaaaaaaaaaaaaaa</code> (dài). Một cái in ra, một cái abort. Vì sao?</li>
<li>Dựng lại <code>overflow.c</code> với <code>-fsanitize=address</code> rồi đưa chuỗi dài vào. Nó gọi tên dòng nào, biến nào?</li>
<li>Viết một chương trình 10 dòng <code>malloc</code> 1 MB trong vòng lặp và không bao giờ free; chạy dưới <code>/usr/bin/time -v ./a.out</code> và nhìn "Maximum resident set size" leo lên. Thêm <code>free</code> rồi so sánh.</li>
</ol>
<p><strong>Đạt khi:</strong> bạn giải thích được truyền theo giá trị vs theo địa chỉ, vì sao chuỗi dài abort, và cho thấy RSS leo rồi không leo khi đã free.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
${kv([
  ['pointer (con trỏ)', 'Một biến giữ địa chỉ bộ nhớ. *p đọc giá trị ở địa chỉ đó; &x cho địa chỉ của x.'],
  ['stack / heap (ngăn xếp / vùng cấp phát)', 'Stack = biến cục bộ tự động, giải phóng khi trả về. Heap = bộ nhớ malloc mà bạn phải tự free.'],
  ['malloc / free', 'Xin / trả bộ nhớ heap. Quên free là rò rỉ bộ nhớ.'],
  ['errno', 'Biến toàn cục đặt thành mã lỗi khi một hàm thư viện/syscall C thất bại (trả về -1). EACCES=13, ENOENT=2.'],
  ['segmentation fault (SIGSEGV)', 'Nhân giết một tiến trình chạm vào bộ nhớ không được phép — vd. truy cập NULL. Mã thoát 139.'],
  ['AddressSanitizer (-fsanitize=address)', 'Một tuỳ chọn biên dịch bắt lỗi vượt biên và dùng-sau-khi-giải-phóng kèm đúng dòng.'],
])}

<h3>📌 Tóm tắt</h3>
<ul>
<li>C không giấu gì: con trỏ là địa chỉ, bạn quản lý bộ nhớ heap bằng malloc/free, và lỗi thì sập — vì thế ta nhìn hệ điều hành qua nó.</li>
<li>Syscall trả <code>-1</code> và đặt <code>errno</code>; đọc nó là thói quen "xử lý lỗi" của mọi ngôn ngữ.</li>
<li>Ghi vượt biên và truy cập NULL là có thật; stack canary, AddressSanitizer và gdb bắt được — và chúng là mầm của Chương 11 và 13.</li>
<li>Java/JS biến chúng thành ngoại lệ và GC, nhưng thế giới C quay lại ngay khi tiến trình của bạn bị Killed hoặc một lời gọi gốc lỗi.</li>
</ul>
${L('https://man7.org/linux/man-pages/man3/errno.3.html', '📄', 'man 3 errno', 'Các mã lỗi mà mọi syscall có thể đặt.', 'Mở')}
</div>
`,
    },
    /* ───────────────────────── 0.7 — Quiz ───────────────────────── */
    {
      title: '0.7 — Section 0 check|||0.7 — Kiểm tra Mục 0',
      slug: 'os-0-7-quiz',
      type: 'QUIZ',
      isFreePreview: true,
      description: 'Mười câu về vai trò của hệ điều hành, lịch sử, phòng lab và C tối thiểu — tình huống và "lệnh này in ra gì", có giải thích.',
      content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Check</span>
<h2>Do you have the foundations?</h2>
<p class="lead">Ten questions on what an OS does, where it came from, your lab, and just-enough C. Each explanation says why the tempting wrong answer is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain, in one sentence, what the kernel does and what a system call is.</li>
<li>I can build the lab image and start a throwaway container with CPU and memory limits.</li>
<li>I can read a small C program with pointers and predict its output.</li>
<li>I know why Docker on my Mac is really a Linux VM, and one thing that differs.</li>
<li>I can say what exit code 139 and 134 mean.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Kiểm tra</span>
<h2>Bạn đã có nền chưa?</h2>
<p class="lead">Mười câu về hệ điều hành làm gì, từ đâu tới, phòng lab của bạn, và C tối thiểu. Mỗi phần giải thích nói vì sao đáp án hấp dẫn nhưng sai lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được trong một câu nhân làm gì và lời gọi hệ thống là gì.</li>
<li>Tôi dựng được ảnh lab và khởi động một container vứt đi với giới hạn CPU và bộ nhớ.</li>
<li>Tôi đọc được một chương trình C nhỏ có con trỏ và đoán được output.</li>
<li>Tôi biết vì sao Docker trên Mac của tôi thật ra là một máy ảo Linux, và một điểm nó khác.</li>
<li>Tôi nói được mã thoát 139 và 134 nghĩa là gì.</li>
</ul>
</div>
`,
      quiz: {
        timeLimitSeconds: 600,
        questions: [
          { question: 'What is the single most important role of the kernel?|||Vai trò quan trọng nhất của nhân (kernel) là gì?',
            options: ['Draw the graphical desktop|||Vẽ giao diện đồ hoạ', 'Share the hardware among programs safely, and be the only thing that touches it directly|||Chia phần cứng cho các chương trình một cách an toàn, và là thứ duy nhất chạm trực tiếp vào nó', 'Compile your source code|||Biên dịch mã nguồn của bạn', 'Store your files in the cloud|||Lưu file của bạn lên cloud'],
            correctIndex: 1, points: 1,
            explanation: 'EN: The kernel multiplexes CPU, memory, disk and network among all processes and is the only code with full hardware access; programs reach the hardware only by asking it via system calls. The desktop is a normal program; compiling is the compiler’s job.|||VI: Nhân chia CPU, bộ nhớ, đĩa và mạng cho mọi tiến trình và là mã duy nhất có toàn quyền phần cứng; chương trình chạm phần cứng chỉ bằng cách nhờ nó qua lời gọi hệ thống. Giao diện là một chương trình thường; biên dịch là việc của trình biên dịch.' },
          { question: 'A program wants to read a file. How does it actually get the data?|||Một chương trình muốn đọc một file. Nó thật sự lấy dữ liệu bằng cách nào?',
            options: ['It reads the disk hardware directly|||Nó đọc thẳng phần cứng đĩa', 'It makes a system call and the kernel does the read on its behalf|||Nó thực hiện một lời gọi hệ thống và nhân đọc hộ nó', 'It asks the compiler|||Nó hỏi trình biên dịch', 'It copies the file from another process’s memory|||Nó chép file từ bộ nhớ của tiến trình khác'],
            correctIndex: 1, points: 1,
            explanation: 'EN: User programs cannot touch hardware; they cross into the kernel through a system call (here open/read), which performs the privileged operation and copies the data back. That boundary is the subject of Chapter 11.|||VI: Chương trình người dùng không chạm được phần cứng; chúng băng vào nhân qua một lời gọi hệ thống (ở đây open/read), nơi thực hiện thao tác đặc quyền và chép dữ liệu về. Ranh giới đó là chủ đề Chương 11.' },
          { question: 'Put these in the right order in time.|||Xếp các mốc này đúng thứ tự thời gian.',
            options: ['Linux → Unix → GNU → C|||Linux → Unix → GNU → C', 'Unix (1969) → C (1973) → GNU (1983) → Linux (1991)|||Unix (1969) → C (1973) → GNU (1983) → Linux (1991)', 'C → Unix → Linux → GNU|||C → Unix → Linux → GNU', 'GNU → Unix → Linux → C|||GNU → Unix → Linux → C'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Unix came first (Thompson & Ritchie, 1969), then C and the C rewrite of Unix (1973), then Stallman’s GNU project (1983), then Torvalds’ Linux kernel (1991), which combined with GNU tools.|||VI: Unix có trước (Thompson & Ritchie, 1969), rồi C và bản viết lại Unix bằng C (1973), rồi dự án GNU của Stallman (1983), rồi nhân Linux của Torvalds (1991), kết hợp với công cụ GNU.' },
          { question: 'The Therac-25 overdoses were caused by which kind of bug?|||Các liều quá mức của Therac-25 do loại lỗi nào gây ra?',
            options: ['A memory leak|||Rò rỉ bộ nhớ', 'A race condition between concurrent tasks|||Một race condition giữa các tác vụ chạy đồng thời', 'A full disk|||Đầy đĩa', 'A null pointer|||Một con trỏ null'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Fast operator input let two concurrent tasks interleave in an unanticipated order — a race condition (Chapter 5). The outcome depended on timing, which is why such bugs hide in testing. Mars Pathfinder, by contrast, was priority inversion (Chapter 6).|||VI: Thao tác nhập nhanh khiến hai tác vụ đồng thời xen vào nhau theo thứ tự không lường trước — một race condition (Chương 5). Kết quả phụ thuộc thời điểm, nên loại lỗi này ẩn khi kiểm thử. Ngược lại, Mars Pathfinder là đảo ngược ưu tiên (Chương 6).' },
          { question: 'Why do you run dangerous experiments in a Docker container instead of on your Mac?|||Vì sao bạn chạy các thí nghiệm nguy hiểm trong container Docker thay vì trên máy Mac?',
            options: ['Containers are faster than the host|||Container nhanh hơn máy chủ', 'The container is a real Linux you can fill, crash or delete without touching the host|||Container là một Linux thật mà bạn làm đầy, làm sập hay xoá được mà không đụng máy chủ', 'macOS cannot run gcc|||macOS không chạy được gcc', 'Docker encrypts your commands|||Docker mã hoá các lệnh của bạn'],
            correctIndex: 1, points: 1,
            explanation: 'EN: A throwaway container isolates the damage: fill its disk, OOM it, fork-bomb it — then delete it and your laptop is untouched. It is not about speed, and macOS can run gcc fine; the point is a safe, disposable Linux.|||VI: Một container vứt đi cô lập thiệt hại: làm đầy đĩa nó, OOM nó, fork-bomb nó — rồi xoá và laptop bạn nguyên vẹn. Không phải chuyện tốc độ, và macOS chạy gcc tốt; điểm chính là một Linux an toàn, bỏ được.' },
          { question: 'In the lab, <code>uname -r</code> prints <code>7.0.12-linuxkit</code> on your Mac. Why?|||Trong lab, <code>uname -r</code> in ra <code>7.0.12-linuxkit</code> trên máy Mac. Vì sao?',
            options: ['macOS is based on Linux|||macOS dựa trên Linux', 'Docker Desktop runs your containers inside a lightweight Linux VM|||Docker Desktop chạy container của bạn bên trong một máy ảo Linux gọn nhẹ', 'It is a bug|||Đó là một lỗi', 'The container replaced your Mac’s kernel|||Container đã thay nhân của máy Mac'],
            correctIndex: 1, points: 1,
            explanation: 'EN: macOS uses the XNU kernel and has no Linux containers, so Docker Desktop runs a small Linux VM (linuxkit) and your containers live in it. Consequences: limited perf hardware counters, VM-specific /proc and timings.|||VI: macOS dùng nhân XNU và không có container Linux, nên Docker Desktop chạy một máy ảo Linux nhỏ (linuxkit) và container của bạn sống trong đó. Hệ quả: bộ đếm phần cứng perf bị hạn chế, /proc và thời gian là của máy ảo.' },
          { question: 'In C, what does <code>*p</code> mean when <code>p</code> is a pointer?|||Trong C, <code>*p</code> nghĩa là gì khi <code>p</code> là một con trỏ?',
            options: ['The address of p|||Địa chỉ của p', 'The value stored at the address that p holds|||Giá trị lưu ở địa chỉ mà p đang giữ', 'p multiplied by something|||p nhân với cái gì đó', 'A new copy of p|||Một bản sao mới của p'],
            correctIndex: 1, points: 1,
            explanation: 'EN: p holds an address; *p dereferences it — reads the value there. &x is the opposite: the address of x. Passing &x to a function lets it modify your variable, which is how syscalls fill a buffer you give them.|||VI: p giữ một địa chỉ; *p "giải tham chiếu" nó — đọc giá trị ở đó. &x thì ngược lại: địa chỉ của x. Truyền &x vào một hàm cho phép nó sửa biến của bạn, đó là cách syscall điền vào bộ đệm bạn đưa.' },
          { question: 'A C syscall wrapper like <code>open()</code> fails. How does your code learn what went wrong?|||Một hàm bọc syscall của C như <code>open()</code> thất bại. Code của bạn biết chuyện gì sai bằng cách nào?',
            options: ['It throws an exception|||Nó ném một ngoại lệ', 'It returns -1 and sets the global <code>errno</code> (e.g. 13 = EACCES)|||Nó trả về -1 và đặt biến toàn cục <code>errno</code> (vd. 13 = EACCES)', 'It prints to the screen automatically|||Nó tự in ra màn hình', 'The program exits immediately|||Chương trình thoát ngay'],
            correctIndex: 1, points: 1,
            explanation: 'EN: C has no exceptions. Syscall wrappers return -1 on failure and set errno; you read it (or call perror/strerror). EACCES (13) is permission denied, ENOENT (2) is no such file. Checking it after every call is the C habit.|||VI: C không có ngoại lệ. Hàm bọc syscall trả -1 khi lỗi và đặt errno; bạn đọc nó (hoặc gọi perror/strerror). EACCES (13) là không đủ quyền, ENOENT (2) là không có file. Kiểm nó sau mỗi lời gọi là thói quen của C.' },
          { question: 'A program writes a 40-character string into <code>char buf[8]</code> and prints <code>*** stack smashing detected ***</code>, exit code 134. What happened?|||Một chương trình ghi chuỗi 40 ký tự vào <code>char buf[8]</code> rồi in <code>*** stack smashing detected ***</code>, mã thoát 134. Chuyện gì xảy ra?',
            options: ['The disk was full|||Đĩa đầy', 'It overflowed the buffer; the stack canary caught it and called abort() (SIGABRT = 128+6)|||Nó tràn bộ đệm; stack canary bắt được và gọi abort() (SIGABRT = 128+6)', 'It ran out of memory|||Nó hết bộ nhớ', 'The network timed out|||Mạng hết giờ'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Writing past buf[8] overwrote a random canary the compiler placed before the return address; glibc noticed the change and aborted BEFORE the corrupted return address could be used. 134 = 128 + 6 (SIGABRT). A plain SIGSEGV would be 139 = 128 + 11.|||VI: Ghi quá buf[8] đã đè lên một canary ngẫu nhiên mà trình biên dịch đặt trước địa chỉ trả về; glibc thấy nó đổi và abort TRƯỚC khi địa chỉ trả về hỏng được dùng. 134 = 128 + 6 (SIGABRT). Một SIGSEGV trơn sẽ là 139 = 128 + 11.' },
          { question: 'Which habit does this course push hardest?|||Khoá này đẩy mạnh nhất thói quen nào?',
            options: ['Memorise every command|||Học thuộc mọi lệnh', 'Measure, don’t guess: reproduce the phenomenon and read the real number|||Đo, đừng đoán: tái hiện hiện tượng và đọc con số thật', 'Always use the GUI|||Luôn dùng giao diện đồ hoạ', 'Avoid the terminal|||Tránh terminal'],
            correctIndex: 1, points: 1,
            explanation: 'EN: Reading a model teaches the shape; running it teaches the truth, because a renamed syscall or a closed path only shows up when you measure. Every lesson pairs a simulator (to see it) with real lab output (to measure it).|||VI: Đọc một mô hình dạy hình dạng; chạy nó dạy sự thật, vì một syscall đổi tên hay một đường bị đóng chỉ lộ ra khi bạn đo. Mỗi bài ghép một mô phỏng (để thấy) với output lab thật (để đo).' },
        ],
      },
    },
  ],
};
